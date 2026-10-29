"use client";

import { useEffect, useRef, useState } from "react";
import { ChatContextPanel } from "@/components/chat/ChatContextPanel";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { useApp } from "@/context/AppProvider";
import { useToast } from "@/context/ToastProvider";
import { chatService } from "@/lib/services/chat";
import type { ChatMessage } from "@/lib/types";
import { uid } from "@/lib/utils";

interface ChatSessionProps {
  chatId?: string;
  subjectId?: string;
}

function makeMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return { id: uid(), role, content, createdAt: new Date().toISOString() };
}

export function ChatSession({ chatId, subjectId: initialSubject }: ChatSessionProps) {
  const { subjects, chats, saveChat, deleteChat } = useApp();
  const toast = useToast();

  // Values are read once when the session mounts (the parent remounts it per chat).
  const existing = chatId ? chats.find((c) => c.id === chatId) : undefined;
  const [id] = useState(() => existing?.id ?? uid());
  const [subjectId, setSubjectId] = useState(
    existing?.subjectId ?? initialSubject ?? subjects[0]?.id ?? "",
  );
  const [messages, setMessages] = useState<ChatMessage[]>(existing?.messages ?? []);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const subject = subjects.find((s) => s.id === subjectId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  function persist(next: ChatMessage[], forSubject = subjectId) {
    const firstUser = next.find((m) => m.role === "user")?.content ?? "New chat";
    saveChat({
      id,
      title: firstUser.length > 35 ? `${firstUser.slice(0, 35)}…` : firstUser,
      subjectId: forSubject,
      messages: next,
      updatedAt: new Date().toISOString(),
    });
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || sending) return;

    const withUser = [...messages, makeMessage("user", content)];
    setMessages(withUser);
    setInput("");
    setSending(true);
    persist(withUser);

    try {
      const reply = await chatService.send({ subjectId, messages: withUser });
      const withReply = [...withUser, makeMessage("assistant", reply)];
      setMessages(withReply);
      persist(withReply);
    } catch {
      toast("Could not get a reply. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function clearChat() {
    setMessages([]);
    deleteChat(id);
  }

  return (
    <div className="grid h-[calc(100vh-9rem)] min-h-[420px] grid-cols-1 gap-4 lg:grid-cols-[240px_1fr]">
      <div className="hidden lg:block">
        <ChatContextPanel
          subjects={subjects}
          subjectId={subjectId}
          onSubjectChange={(next) => {
            setSubjectId(next);
            if (messages.length > 0) persist(messages, next);
          }}
          onSuggestion={(text) => void send(text)}
        />
      </div>

      <section className="card flex min-h-0 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold">
              {subject ? `${subject.name} chat` : "Study chat"}
            </h1>
            {!chatService.connected && (
              <p className="text-xs text-slate-400">Assistant not connected yet</p>
            )}
          </div>
          {/* Subject picker for small screens, where the side panel is hidden */}
          <select
            className="input w-40 py-1.5 lg:hidden"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            aria-label="Subject"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            onClick={clearChat}
            disabled={messages.length === 0}
            className="text-xs text-slate-500 hover:text-slate-800 disabled:opacity-40 dark:hover:text-slate-200"
          >
            Clear
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-sm text-slate-400">
              Ask a question to start the conversation.
            </div>
          ) : (
            messages.map((m) => <MessageBubble key={m.id} message={m} />)
          )}
          {sending && <p className="text-sm text-slate-400">Waiting for a reply…</p>}
          <div ref={bottomRef} />
        </div>

        <ChatInput
          value={input}
          disabled={sending}
          onChange={setInput}
          onSend={() => void send(input)}
        />
      </section>
    </div>
  );
}
