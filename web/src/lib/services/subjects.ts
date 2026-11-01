import { api, type ApiSubject } from "@/lib/api";
import type { Subject, SubjectIcon, Tone } from "@/lib/types";

const tones: Tone[] = ["indigo", "emerald", "amber", "sky", "rose", "slate"];
const icons: SubjectIcon[] = ["brain", "database", "globe", "shield", "book"];

export function toSubject(s: ApiSubject): Subject {
  return {
    id: String(s.id),
    name: s.name,
    description: s.description || "Your study topic",
    tone: (tones as string[]).includes(s.tone) ? (s.tone as Tone) : "slate",
    icon: (icons as string[]).includes(s.icon) ? (s.icon as SubjectIcon) : "book",
    progress: 0,
  };
}

export const subjectService = {
  async list(): Promise<Subject[]> {
    return (await api<ApiSubject[]>("/subjects")).map(toSubject);
  },
  async create(name: string, description: string): Promise<Subject> {
    const s = await api<ApiSubject>("/subjects", {
      method: "POST",
      body: JSON.stringify({ name, description: description || null, tone: "slate", icon: "book" }),
    });
    return toSubject(s);
  },
};