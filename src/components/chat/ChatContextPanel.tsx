import type { Subject } from "@/lib/types";

const suggestions = [
  "Explain this topic simply",
  "Give me 5 practice questions",
  "Summarize my notes",
];

interface ChatContextPanelProps {
  subjects: Subject[];
  subjectId: string;
  onSubjectChange: (id: string) => void;
  onSuggestion: (text: string) => void;
}

export function ChatContextPanel({
  subjects,
  subjectId,
  onSubjectChange,
  onSuggestion,
}: ChatContextPanelProps) {
  return (
    <aside className="card p-4">
      <label className="label" htmlFor="chat-subject">
        Subject
      </label>
      <select
        id="chat-subject"
        className="input"
        value={subjectId}
        onChange={(e) => onSubjectChange(e.target.value)}
      >
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <p className="mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-slate-400">
        Suggestions
      </p>
      <div className="space-y-2">
        {suggestions.map((text) => (
          <button
            key={text}
            onClick={() => onSuggestion(text)}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {text}
          </button>
        ))}
      </div>
    </aside>
  );
}
