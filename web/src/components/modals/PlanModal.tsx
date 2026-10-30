"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useApp } from "@/context/AppProvider";
import { studyDurations } from "@/lib/data";

const steps = [
  "5 min: review previous notes",
  "15 min: learn one key concept",
  "5 min: explain it from memory",
  "Finish: write down one question",
];

export function PlanModal({ onClose }: { onClose: () => void }) {
  const { subjects } = useApp();
  const [subjectId, setSubjectId] = useState(subjects[0]?.id ?? "");
  const [duration, setDuration] = useState(studyDurations[0]);
  const [plan, setPlan] = useState<string | null>(null);

  function create() {
    const name = subjects.find((s) => s.id === subjectId)?.name ?? "Study session";
    setPlan(`${name} · ${duration}`);
  }

  return (
    <Modal title="Plan a study session" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="label" htmlFor="plan-subject">
            Subject
          </label>
          <select
            id="plan-subject"
            className="input"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="plan-duration">
            Duration
          </label>
          <select
            id="plan-duration"
            className="input"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            {studyDurations.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <button className="btn-primary w-full" onClick={create}>
          Create plan
        </button>
        {plan && (
          <div className="rounded-md bg-slate-50 p-4 text-sm dark:bg-slate-800">
            <p className="mb-2 font-medium">{plan}</p>
            <ul className="space-y-1.5">
              {steps.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}
