"use client";

import { FileText, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { useToast } from "@/context/ToastProvider";
import type { StudyDocument } from "@/lib/types";
import { formatDate, formatSize } from "@/lib/utils";

export function DocumentList({ documents }: { documents: StudyDocument[] }) {
  const { subjects, removeDocument } = useApp();
  const toast = useToast();

  return (
    <ul className="card divide-y divide-slate-200 dark:divide-slate-800">
      {documents.map((doc) => {
        const subject = subjects.find((s) => s.id === doc.subjectId);
        return (
          <li key={doc.id} className="flex items-center gap-3 px-4 py-3">
            <FileText size={18} className="shrink-0 text-slate-400" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{doc.name}</p>
              <p className="text-xs text-slate-400">
                {doc.ext.toUpperCase()} · {formatSize(doc.size)} · {formatDate(doc.addedAt)}
              </p>
            </div>
            <span className="hidden rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300 sm:inline">
              {subject?.name ?? "Unassigned"}
            </span>
            <button
              aria-label={`Delete ${doc.name}`}
              onClick={() => {
                removeDocument(doc.id);
                toast("Document removed.");
              }}
              className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800"
            >
              <Trash2 size={16} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
