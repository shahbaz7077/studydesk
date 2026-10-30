import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const time = new Date(message.createdAt).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn("mb-4 flex", isUser ? "justify-end" : "justify-start")}>
      <div className="max-w-[85%]">
        <div
          className={cn(
            "whitespace-pre-wrap rounded-lg px-3.5 py-2.5 text-sm leading-relaxed",
            isUser
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
          )}
        >
          {message.content}
        </div>
        <p className={cn("mt-1 text-xs text-slate-400", isUser && "text-right")}>{time}</p>
      </div>
    </div>
  );
}
