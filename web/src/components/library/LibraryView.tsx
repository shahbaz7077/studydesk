"use client";

import { FileText, Search, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { DocumentList } from "@/components/library/DocumentList";
import { PageHeader } from "@/components/ui/PageHeader";
import { useApp } from "@/context/AppProvider";
import { useToast } from "@/context/ToastProvider";
import { isSupported } from "@/lib/services/documents";

export function LibraryView() {
  const { subjects, documents, addDocuments } = useApp();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(
    () =>
      documents.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) &&
          (filter === "all" || d.subjectId === filter),
      ),
    [documents, query, filter],
  );

  async function handleFiles(list: FileList | null) {
    if (!list) return;
    const files = Array.from(list).filter((f) => isSupported(f.name));
    if (files.length < list.length) toast("Only PDF, TXT and MD files are supported.");
    if (files.length === 0) return;
    // Files go to the active filter's subject, or the first subject.
    const subjectId = filter !== "all" ? filter : subjects[0]?.id ?? "";
    const count = await addDocuments(files, subjectId);
    toast(`${count} file${count > 1 ? "s" : ""} added.`);
  }

  return (
    <>
      <PageHeader
        title="Documents"
        description="Your study files."
        action={
          <button className="btn-primary" onClick={() => inputRef.current?.click()}>
            <Upload size={16} /> Upload
          </button>
        }
      />
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.md"
        multiple
        hidden
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9"
            placeholder="Search documents"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="input sm:w-56"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter by subject"
        >
          <option value="all">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length > 0 ? (
        <DocumentList documents={filtered} />
      ) : (
        <div className="card flex flex-col items-center px-4 py-14 text-center">
          <FileText size={28} className="mb-3 text-slate-300" />
          <h3 className="text-sm font-semibold">
            {documents.length === 0 ? "No documents yet" : "No matching documents"}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {documents.length === 0
              ? "Upload PDF, TXT or MD files to get started."
              : "Try a different search or subject."}
          </p>
          {documents.length === 0 && (
            <button className="btn-primary mt-4" onClick={() => inputRef.current?.click()}>
              <Upload size={16} /> Upload a file
            </button>
          )}
        </div>
      )}
    </>
  );
}
