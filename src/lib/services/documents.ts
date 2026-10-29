import type { DocumentExt, StudyDocument } from "@/lib/types";
import { uid } from "@/lib/utils";

/**
 * Document service boundary.
 *
 * Today it only records file metadata (name, size, type) in the browser.
 * Later: upload the file to storage, extract text, chunk and embed it for RAG,
 * then return the saved record. Components keep calling `create`.
 */
export const allowedExtensions: DocumentExt[] = ["pdf", "txt", "md"];

export function getExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

export function isSupported(fileName: string): boolean {
  return (allowedExtensions as string[]).includes(getExtension(fileName));
}

export interface DocumentService {
  create(file: File, subjectId: string): Promise<StudyDocument>;
  remove(id: string): Promise<void>;
}

export const documentService: DocumentService = {
  async create(file, subjectId) {
    return {
      id: uid(),
      name: file.name,
      size: file.size,
      ext: getExtension(file.name) as DocumentExt,
      subjectId,
      addedAt: new Date().toISOString(),
    };
  },
  async remove() {
    // Later: delete from storage / vector index.
  },
};
