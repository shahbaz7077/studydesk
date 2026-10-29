"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultSubjects } from "@/lib/data";
import { documentService } from "@/lib/services/documents";
import type { Chat, StudyDocument, Subject } from "@/lib/types";
import { uid } from "@/lib/utils";

const KEYS = {
  subjects: "studydesk_subjects",
  documents: "studydesk_documents",
  chats: "studydesk_chats",
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or blocked: ignore
  }
}

interface AppState {
  /** false until saved data has been loaded from the browser */
  ready: boolean;
  subjects: Subject[];
  documents: StudyDocument[];
  chats: Chat[];
  addSubject: (name: string, description: string) => void;
  addDocuments: (files: File[], subjectId: string) => Promise<number>;
  removeDocument: (id: string) => void;
  saveChat: (chat: Chat) => void;
  deleteChat: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [documents, setDocuments] = useState<StudyDocument[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  // Load saved data once, on the client.
  useEffect(() => {
    setSubjects(read(KEYS.subjects, defaultSubjects));
    setDocuments(read(KEYS.documents, []));
    setChats(read(KEYS.chats, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) write(KEYS.subjects, subjects);
  }, [ready, subjects]);
  useEffect(() => {
    if (ready) write(KEYS.documents, documents);
  }, [ready, documents]);
  useEffect(() => {
    if (ready) write(KEYS.chats, chats);
  }, [ready, chats]);

  const addSubject = useCallback((name: string, description: string) => {
    setSubjects((prev) => [
      ...prev,
      {
        id: uid(),
        name,
        description: description || "Your study topic",
        tone: "slate",
        icon: "book",
        progress: 0,
      },
    ]);
  }, []);

  const addDocuments = useCallback(async (files: File[], subjectId: string) => {
    const created = await Promise.all(files.map((f) => documentService.create(f, subjectId)));
    setDocuments((prev) => [...prev, ...created]);
    return created.length;
  }, []);

  const removeDocument = useCallback((id: string) => {
    void documentService.remove(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const saveChat = useCallback((chat: Chat) => {
    setChats((prev) => {
      const exists = prev.some((c) => c.id === chat.id);
      return exists ? prev.map((c) => (c.id === chat.id ? chat : c)) : [...prev, chat];
    });
  }, []);

  const deleteChat = useCallback((id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const value = useMemo<AppState>(
    () => ({
      ready,
      subjects,
      documents,
      chats,
      addSubject,
      addDocuments,
      removeDocument,
      saveChat,
      deleteChat,
    }),
    [ready, subjects, documents, chats, addSubject, addDocuments, removeDocument, saveChat, deleteChat],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
