export type Tone = "indigo" | "emerald" | "amber" | "sky" | "rose" | "slate";

export type SubjectIcon = "brain" | "database" | "globe" | "shield" | "book";

export interface Subject {
  id: string;
  name: string;
  description: string;
  tone: Tone;
  icon: SubjectIcon;
  progress: number; // 0-100
}

export type DocumentExt = "pdf" | "txt" | "md";

export type DocStatus = "pending" | "processing" | "ready" | "failed";

export interface StudyDocument {
  id: string;
  name: string;
  size: number;
  ext: DocumentExt;
  subjectId: string;
  addedAt: string; // ISO date
  status?: DocStatus;
  error?: string | null;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface Chat {
  id: string;
  title: string;
  subjectId: string;
  messages: ChatMessage[];
  updatedAt: string;
}