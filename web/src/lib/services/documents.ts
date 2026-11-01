import { api, type ApiDocument } from "@/lib/api";
import type { DocumentExt, StudyDocument } from "@/lib/types";

// Laravel abhi sirf PDF leta hai.
export const allowedExtensions: DocumentExt[] = ["pdf"];

export function getExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function isSupported(fileName: string): boolean {
  return (allowedExtensions as string[]).includes(getExtension(fileName));
}

export function toStudyDocument(d: ApiDocument): StudyDocument {
  return {
    id: String(d.id),
    name: d.title,
    size: 0, // API size nahi bhejti; upload ke waqt wala size AppProvider yaad rakhta hai
    ext: "pdf",
    subjectId: d.subject_id ? String(d.subject_id) : "",
    addedAt: d.created_at,
    status: d.status,
    error: d.error,
  };
}

export interface DocumentService {
  list(): Promise<StudyDocument[]>;
  create(file: File, subjectId: string): Promise<StudyDocument>;
  remove(id: string): Promise<void>;
}

export const documentService: DocumentService = {
  async list() {
    return (await api<ApiDocument[]>("/documents")).map(toStudyDocument);
  },
  async create(file, subjectId) {
    const form = new FormData();
    form.append("file", file);
    form.append("subject_id", subjectId);
    form.append("title", file.name);
    const d = await api<ApiDocument>("/documents", { method: "POST", body: form });
    return { ...toStudyDocument(d), size: file.size };
  },
  async remove(id) {
    await api(`/documents/${id}`, { method: "DELETE" });
  },
};