import io
import os

import chromadb
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, UploadFile
from openai import OpenAI
from pydantic import BaseModel
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer

load_dotenv()

app = FastAPI()

# --- Settings ---
CHUNK_SIZE = 800
OVERLAP = 100

LLM_MODEL = os.getenv("LLM_MODEL")
llm = OpenAI(api_key=os.getenv("LLM_API_KEY"), base_url=os.getenv("LLM_BASE_URL"))

SYSTEM_PROMPT = (
    "You are a study assistant. Answer ONLY using the provided context. "
    "If the answer is not in the context, say you could not find it in the "
    "uploaded material. Answer in the same language style as the question "
    "(Roman Urdu or English). Mention page numbers like (p. 4)."
)

# --- Model aur vector store: server start par ek hi baar load hote hain ---
model = SentenceTransformer("intfloat/multilingual-e5-small")
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(
    "chunks", metadata={"hnsw:space": "cosine"}  # cosine = angle se similarity
)


# --- Helpers ---
def embed_passages(texts):
    # e5 model ko batana parta hai ke yeh document hai ("passage: ")
    return model.encode(
        [f"passage: {t}" for t in texts], normalize_embeddings=True
    ).tolist()


def embed_query(text):
    # aur yeh sawal hai ("query: ")
    return model.encode(f"query: {text}", normalize_embeddings=True).tolist()


def chunk_text(text, size=CHUNK_SIZE, overlap=OVERLAP):
    chunks, start = [], 0
    while start < len(text):
        piece = text[start:start + size].strip()
        if piece:
            chunks.append(piece)
        start += size - overlap
    return chunks


def retrieve(question, document_ids, k):
    res = collection.query(
        query_embeddings=[embed_query(question)],
        n_results=k,
        where={"document_id": {"$in": document_ids}},
    )
    return [
        {
            "text": doc,
            "page": meta["page"],
            "document_id": meta["document_id"],
            "score": round(1 - dist, 3),  # 1 = bilkul milta-julta
        }
        for doc, meta, dist in zip(
            res["documents"][0], res["metadatas"][0], res["distances"][0]
        )
    ]


def verify_secret(x_internal_secret: str = Header(None)):
    # Sirf Laravel ke paas yeh secret hai. Secret set na ho to sab band (fail closed).
    expected = os.getenv("INTERNAL_SECRET")
    if not expected or x_internal_secret != expected:
        raise HTTPException(401, "Unauthorized")


# --- Request bodies ---
class QueryBody(BaseModel):
    question: str
    document_ids: list[int]
    k: int = 5


class ChatBody(BaseModel):
    question: str
    document_ids: list[int]
    k: int = 5


# --- Endpoints ---
@app.get("/health")
def health():
    return {"ok": True, "stored_chunks": collection.count()}


@app.post("/ingest", dependencies=[Depends(verify_secret)])
def ingest(file: UploadFile = File(...), document_id: int = Form(...)):
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are supported")

    data = file.file.read()
    try:
        reader = PdfReader(io.BytesIO(data))
    except Exception:
        raise HTTPException(400, "Could not read PDF")

    chunks = []
    for page_no, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").strip()
        for c in chunk_text(text):
            chunks.append({"page": page_no, "text": c})

    if not chunks:
        raise HTTPException(422, "No text found (scanned PDF? needs OCR)")

    # dobara upload ho to purane chunks hata do (duplicate na bane)
    collection.delete(where={"document_id": document_id})

    texts = [c["text"] for c in chunks]
    collection.add(
        ids=[f"{document_id}-{i}" for i in range(len(chunks))],
        documents=texts,
        embeddings=embed_passages(texts),
        metadatas=[{"document_id": document_id, "page": c["page"]} for c in chunks],
    )
    return {"document_id": document_id, "chunks": len(chunks)}


@app.delete("/documents/{document_id}", dependencies=[Depends(verify_secret)])
def delete_document(document_id: int):
    collection.delete(where={"document_id": document_id})
    return {"deleted": document_id}


@app.post("/query", dependencies=[Depends(verify_secret)])
def query(body: QueryBody):
    return retrieve(body.question, body.document_ids, body.k)


@app.post("/chat", dependencies=[Depends(verify_secret)])
def chat(body: ChatBody):
    sources = retrieve(body.question, body.document_ids, body.k)
    if not sources:
        return {"answer": "No material found for this subject.", "sources": []}

    context = "\n\n".join(f"[Page {s['page']}]\n{s['text']}" for s in sources)
    try:
        resp = llm.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"Context:\n{context}\n\nQuestion: {body.question}",
                },
            ],
            temperature=0.2,
        )
    except Exception as e:
        # key/model/URL galat ho to yahan asli wajah dikhegi
        raise HTTPException(502, f"LLM call failed: {e}")

    return {"answer": resp.choices[0].message.content, "sources": sources}