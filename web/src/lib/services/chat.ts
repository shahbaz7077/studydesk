import { api } from "@/lib/api";
import type { ChatMessage } from "@/lib/types";

export interface ChatRequest {
  subjectId: string;
  messages: ChatMessage[];
  documentIds?: string[];
}

export interface ChatService {
  connected: boolean;
  send(request: ChatRequest): Promise<string>;
}

interface ChatApiResponse {
  answer: string;
  sources: { page: number }[];
}

const apiChatService: ChatService = {
  connected: true,
  async send({ subjectId, messages }) {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) throw new Error("Pehle sawal likho.");

    const id = Number(subjectId);
    if (!Number.isInteger(id)) throw new Error("Pehle ek subject chuno.");

    const data = await api<ChatApiResponse>("/chat", {
      method: "POST",
      body: JSON.stringify({ subject_id: id, question: lastUser.content }),
    });

    const pages = [...new Set(data.sources.map((s) => s.page))].sort((a, b) => a - b);
    return pages.length > 0
      ? `${data.answer}\n\nSources: ${pages.map((p) => `p. ${p}`).join(", ")}`
      : data.answer;
  },
};

export const chatService: ChatService = apiChatService;