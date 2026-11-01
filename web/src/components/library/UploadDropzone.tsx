"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useApp } from "@/context/AppProvider";
import { useToast } from "@/context/ToastProvider";
import { isSupported } from "@/lib/services/documents";
import { cn } from "@/lib/utils";

export function UploadDropzone() {
  const { subjects, addDocuments } = useApp();
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [subjectId, setSubjectId] = useState("");

  const selected = subjectId || subjects[0]?.id || "";

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const files = Array.from(list);
    const valid = files.filter((f) => isSupported(f.name));
        if (valid.length < files.length) toast("Only PDF files are supported.");
    if (valid.length === 0) return;
    if (!selected) {
      toast("Pehle ek subject banao.");
      return;
    }
    try {
      const count = await addDocuments(valid, selected);
      toast(`${count} file${count > 1 ? "s" : ""} uploaded. Processing shuru…`);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Upload failed.");
    }
  }

  return (
    <div>
      <label className="label" htmlFor="upload-subject">
        Subject
      </label>
      <select
        id="upload-subject"
        className="input mb-3"
        value={selected}
        onChange={(e) => setSubjectId(e.target.value)}
      >
        {subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 py-8 text-center transition-colors",
          dragging
            ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40"
            : "border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50",
        )}
      >
        <Upload size={20} className="mb-2 text-slate-400" />
        <p className="text-sm font-medium">Drop files here or click to browse</p>
        <p className="mt-1 text-xs text-slate-400">PDF, TXT or MD</p>
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
      </div>
    </div>
  );
}
