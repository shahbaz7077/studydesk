"use client";

import { Send } from "lucide-react";
import type { KeyboardEvent } from "react";

interface ChatInputProps {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, disabled, onChange, onSend }: ChatInputProps) {
  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className="border-t border-slate-200 p-3 dark:border-slate-800">
      <div className="flex items-end gap-2">
        <textarea
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your question"
          className="input max-h-32 min-h-[40px] resize-none"
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="btn-primary h-10 w-10 shrink-0 p-0"
        >
          <Send size={16} />
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">Enter to send, Shift + Enter for a new line.</p>
    </div>
  );
}
