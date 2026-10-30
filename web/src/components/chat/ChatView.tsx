"use client";

import { ChatSession } from "@/components/chat/ChatSession";
import { useApp } from "@/context/AppProvider";

interface ChatViewProps {
  chatId?: string;
  subjectId?: string;
}

// Waits until saved data is loaded, then mounts the session once.
export function ChatView({ chatId, subjectId }: ChatViewProps) {
  const { ready } = useApp();
  if (!ready) return <p className="text-sm text-slate-400">Loading…</p>;
  return <ChatSession chatId={chatId} subjectId={subjectId} />;
}
