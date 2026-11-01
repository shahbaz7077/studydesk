"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/Modal";
import { useApp } from "@/context/AppProvider";
import { useToast } from "@/context/ToastProvider";

export function AddSubjectModal({ onClose }: { onClose: () => void }) {
  const { addSubject } = useApp();
  const toast = useToast();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

     async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await addSubject(name.trim(), description.trim());
      toast("Subject added.");
      onClose();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not add subject.");
    }
  }

  return (
    <Modal title="Add subject" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="subject-name">
            Name
          </label>
          <input
            id="subject-name"
            className="input"
            placeholder="e.g. Operating Systems"
            maxLength={35}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
        <div>
          <label className="label" htmlFor="subject-desc">
            Description (optional)
          </label>
          <input
            id="subject-desc"
            className="input"
            placeholder="What are you studying?"
            maxLength={70}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={!name.trim()}>
          Add subject
        </button>
      </form>
    </Modal>
  );
}
