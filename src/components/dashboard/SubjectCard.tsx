import { BookOpen, Brain, Database, Globe, ShieldCheck, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { tones } from "@/lib/tones";
import type { Subject, SubjectIcon } from "@/lib/types";
import { cn } from "@/lib/utils";

const icons: Record<SubjectIcon, LucideIcon> = {
  brain: Brain,
  database: Database,
  globe: Globe,
  shield: ShieldCheck,
  book: BookOpen,
};

export function SubjectCard({ subject }: { subject: Subject }) {
  const Icon = icons[subject.icon] ?? BookOpen;
  const tone = tones[subject.tone];

  return (
    <Link
      href={`/chat?subject=${subject.id}`}
      className="card block p-4 transition-colors hover:border-indigo-300 dark:hover:border-indigo-700"
    >
      <div className={cn("mb-3 inline-flex rounded-md p-2", tone.badge)}>
        <Icon size={18} />
      </div>
      <h3 className="text-sm font-semibold">{subject.name}</h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subject.description}</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={cn("h-full rounded-full", tone.bar)}
          style={{ width: `${subject.progress}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-slate-400">{subject.progress}% studied</p>
    </Link>
  );
}
