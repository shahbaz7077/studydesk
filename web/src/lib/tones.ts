import type { Tone } from "./types";

// Full class names so Tailwind can see them at build time.
export const tones: Record<Tone, { badge: string; bar: string }> = {
  indigo: {
    badge: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    bar: "bg-indigo-500",
  },
  emerald: {
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    bar: "bg-emerald-500",
  },
  amber: {
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    bar: "bg-amber-500",
  },
  sky: {
    badge: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    bar: "bg-sky-500",
  },
  rose: {
    badge: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
    bar: "bg-rose-500",
  },
  slate: {
    badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    bar: "bg-slate-500",
  },
};
