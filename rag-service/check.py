import os

from dotenv import load_dotenv

load_dotenv()


def show(ok, msg):
    print(("OK    " if ok else "FAIL  ") + msg)


key = os.getenv("LLM_API_KEY") or ""
model = os.getenv("LLM_MODEL", "gemini-flash-latest")

show(bool(key), f"LLM_API_KEY loaded (length {len(key)}, starts with '{key[:3]}')")
show(not any(c in key for c in " \"'"), "key has no spaces or quotes")
show(bool(os.getenv("INTERNAL_SECRET")), "INTERNAL_SECRET is set")
print("model:", model)

try:
    from google import genai

    client = genai.Client(api_key=key)
    r = client.models.generate_content(
        model=model, contents="Reply with the single word: ready"
    )
    show(True, f"Gemini replied: {r.text!r}")
except Exception as e:
    show(False, f"Gemini call failed: {e}")

try:
    import chromadb

    col = chromadb.PersistentClient(path="./chroma_db").get_or_create_collection("chunks")
    show(col.count() > 0, f"Chroma has {col.count()} chunks stored")
except Exception as e:
    show(False, f"Chroma error: {e}")