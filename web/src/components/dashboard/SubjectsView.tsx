"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { AddSubjectModal } from "@/components/modals/AddSubjectModal";
import { PageHeader } from "@/components/ui/PageHeader";
import { useApp } from "@/context/AppProvider";

export function SubjectsView() {
  const { subjects } = useApp();
  const [adding, setAdding] = useState(false);

  return (
    <>
      <PageHeader
        title="Subjects"
        description="Organize your study material by topic."
        action={
          <button className="btn-primary" onClick={() => setAdding(true)}>
            <Plus size={16} /> Add subject
          </button>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((s) => (
          <SubjectCard key={s.id} subject={s} />
        ))}
      </div>
      {adding && <AddSubjectModal onClose={() => setAdding(false)} />}
    </>
  );
}
