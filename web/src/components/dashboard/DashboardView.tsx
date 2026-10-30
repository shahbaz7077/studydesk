"use client";

import { ArrowRight, ClipboardList, HelpCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { UploadDropzone } from "@/components/library/UploadDropzone";
import { PlanModal } from "@/components/modals/PlanModal";
import { QuizModal } from "@/components/modals/QuizModal";
import { useApp } from "@/context/AppProvider";

type OpenModal = "quiz" | "plan" | null;

export function DashboardView() {
  const { subjects, documents, chats } = useApp();
  const [modal, setModal] = useState<OpenModal>(null);
  const [today, setToday] = useState("");

  // Set on the client so the server and browser dates never disagree.
  useEffect(() => {
    setToday(
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  return (
    <>
      <div className="mb-6">
        <p className="h-4 text-sm text-slate-400">{today}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Keep your notes in one place and pick up where you left off.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Documents" value={documents.length} hint="Files in your library" />
        <StatCard label="Subjects" value={subjects.length} hint="Topics you are studying" />
        <StatCard label="Chats" value={chats.length} hint="Conversations started" />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">Your subjects</h2>
        <Link
          href="/subjects"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {subjects.slice(0, 4).map((s) => (
          <SubjectCard key={s.id} subject={s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-1 text-base font-semibold">Add documents</h2>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Upload your notes and slides.
          </p>
          <UploadDropzone />
        </section>

        <section className="card p-5">
          <h2 className="mb-1 text-base font-semibold">Quick start</h2>
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">Small steps add up.</p>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            <Link
              href="/chat"
              className="flex items-center gap-3 py-3 text-sm hover:text-indigo-600"
            >
              <MessageSquare size={18} className="text-slate-400" />
              <span className="flex-1">
                <span className="block font-medium">Start a chat</span>
                <span className="text-xs text-slate-400">Ask a question about a subject</span>
              </span>
              <ArrowRight size={14} className="text-slate-300" />
            </Link>
            <button
              onClick={() => setModal("quiz")}
              className="flex w-full items-center gap-3 py-3 text-left text-sm hover:text-indigo-600"
            >
              <HelpCircle size={18} className="text-slate-400" />
              <span className="flex-1">
                <span className="block font-medium">Practice quiz</span>
                <span className="text-xs text-slate-400">Try a sample question</span>
              </span>
              <ArrowRight size={14} className="text-slate-300" />
            </button>
            <button
              onClick={() => setModal("plan")}
              className="flex w-full items-center gap-3 py-3 text-left text-sm hover:text-indigo-600"
            >
              <ClipboardList size={18} className="text-slate-400" />
              <span className="flex-1">
                <span className="block font-medium">Plan a session</span>
                <span className="text-xs text-slate-400">Make a simple checklist</span>
              </span>
              <ArrowRight size={14} className="text-slate-300" />
            </button>
          </div>
        </section>
      </div>

      {modal === "quiz" && <QuizModal onClose={() => setModal(null)} />}
      {modal === "plan" && <PlanModal onClose={() => setModal(null)} />}
    </>
  );
}
