import type { ChatMessage } from "@/lib/types";

/**
 * Chat service boundary.
 *
 * The UI only talks to `chatService`. Today it is a placeholder that does not
 * call any AI. To add AI / RAG later, replace `placeholderChatService` with an
 * implementation that calls your backend (see src/app/api/chat/route.ts) and
 * set `connected: true`. No component needs to change.
 */
export interface ChatRequest {
  subjectId: string;
  messages: ChatMessage[];
  /** Later: ids of documents to retrieve context from. */
  documentIds?: string[];
}

export interface ChatService {
  /** false = placeholder; the chat header shows a "not connected" label. */
  connected: boolean;
  send(request: ChatRequest): Promise<string>;
}

const placeholderChatService: ChatService = {
  connected: false,
  async send() {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return "The assistant is not connected yet. Your message was saved in this browser.";
  },
};

// Example of what the real one could look like:
//
// const apiChatService: ChatService = {
//   connected: true,
//   async send(request) {
//     const res = await fetch("/api/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(request),
//     });
//     if (!res.ok) throw new Error("Chat request failed");
//     const data = (await res.json()) as { reply: string };
//     return data.reply;
//   },
// };

export const chatService: ChatService = placeholderChatService;
