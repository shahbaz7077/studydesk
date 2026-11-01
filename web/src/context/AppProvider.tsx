"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getToken } from "@/lib/api";
import { documentService } from "@/lib/services/documents";
import { subjectService } from "@/lib/services/subjects";
import type { Chat, StudyDocument, Subject } from "@/lib/types";

// Chats abhi browser mein hi rehti hain (DB mein save karna M6 mein).
const CHATS_KEY = "studydesk_chats";

function readChats(): Chat[] {
  try {
    const raw = window.localStorage.getItem(CHATS_KEY);
    return raw ? (JSON.parse(raw) as Chat[]) : [];
  } catch {
    return [];
  }
}

function writeChats(chats: Chat[]) {
  try {
    window.localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  } catch {
    // storage full or blocked: ignore
  }
}

interface AppState {
  /** false jab tak subjects/documents server se load na ho jayen */
  ready: boolean;
  subjects: Subject[];
  documents: StudyDocument[];
  chats: Chat[];
  addSubject: (name: string, description: string) => Promise<void>;
  addDocuments: (files: File[], subjectId: string) => Promise<number>;
  removeDocument: (id: string) => Promise<void>;
  saveChat: (chat: Chat) => void;
  deleteChat: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [documents, setDocuments] = useState<StudyDocument[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const sizes = useRef<Record<string, number>>({}); // upload ke waqt ka file size

  // Server se documents lo, aur purana size wapas laga do.
  const refreshDocuments = useCallback(async () => {
    const list = await documentService.list();
    setDocuments(list.map((d) => ({ ...d, size: sizes.current[d.id] ?? 0 })));
  }, []);

  // Pehli baar load
  useEffect(() => {
    setChats(readChats());
    if (!getToken()) {
      setReady(true); // login page par hain, server se kuch nahi chahiye
      return;
    }
    Promise.all([subjectService.list(), documentService.list()])
      .then(([subs, docs]) => {
        setSubjects(subs);
        setDocuments(docs);
      })
      .catch((e) => console.error("Load failed:", e))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) writeChats(chats);
  }, [ready, chats]);

  // Jab tak koi document pending/processing hai, har 3 second baad status dekho.
  const busy = documents.some((d) => d.status === "pending" || d.status === "processing");
  useEffect(() => {
    if (!busy) return;
    const t = setTimeout(() => {
      refreshDocuments().catch((e) => console.error("Refresh failed:", e));
    }, 3000);
    return () => clearTimeout(t);
  }, [busy, documents, refreshDocuments]);

  const addSubject = useCallback(async (name: string, description: string) => {
    const created = await subjectService.create(name, description);
    setSubjects((prev) => [created, ...prev]);
  }, []);

  const addDocuments = useCallback(async (files: File[], subjectId: string) => {
    let ok = 0;
    let lastError: unknown = null;
    for (const file of files) {
      try {
        const doc = await documentService.create(file, subjectId);
        sizes.current[doc.id] = file.size;
        setDocuments((prev) => [doc, ...prev]);
        ok += 1;
      } catch (e) {
        lastError = e;
      }
    }
    if (ok === 0 && lastError) throw lastError;
    return ok;
  }, []);

  const removeDocument = useCallback(async (id: string) => {
    await documentService.remove(id);
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