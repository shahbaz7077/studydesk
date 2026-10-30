"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { sampleQuiz } from "@/lib/data";
import { cn } from "@/lib/utils";

export function QuizModal({ onClose }: { onClose: () => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const correct = picked === sampleQuiz.correctId;

  return (
    <Modal title="Practice quiz" onClose={onClose}>
      <p className="mb-3 text-xs text-slate-400">Sample question · {sampleQuiz.subject}</p>
      <p className="mb-3 text-sm font-medium">{sampleQuiz.question}</p>
      <div className="space-y-2">
        {sampleQuiz.options.map((opt) => {
          const isPicked = picked === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setPicked(opt.id)}
              className={cn(
                "w-full rounded-md border px-3 py-2 text-left text-sm transition-colors",
                !isPicked && "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800",
                isPicked && correct && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
                isPicked && !correct && "border-rose-400 bg-rose-50 dark:bg-rose-950/40",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {picked && (
        <p className={cn("mt-3 text-sm", correct ? "text-emerald-600" : "text-rose-600")}>
          {correct ? `Correct. ${sampleQuiz.explanation}` : "Not quite. Try again."}
        </p>
      )}
    </Modal>
  );
}
