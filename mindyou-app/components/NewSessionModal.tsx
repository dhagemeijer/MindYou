"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

export function NewSessionModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (title: string) => void;
}) {
  const [title, setTitle] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-session-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-t-2xl bg-cream p-6 shadow-2xl dark:bg-slate sm:rounded-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="new-session-title" className="font-display text-lg font-medium text-ink dark:text-cream">
            Nieuwe brainstorm
          </h2>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="rounded-full p-1.5 text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink dark:text-cream/50 dark:hover:bg-cream/10 dark:hover:text-cream"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            onCreate(title.trim());
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="mb-1.5 block font-sans text-xs text-ink/50 dark:text-cream/50">
              Centrale onderwerp
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bijv. Verjaardagsfeestje"
              className="w-full rounded-lg border border-ink/10 bg-transparent px-3 py-2.5 font-sans text-sm text-ink placeholder:text-ink/35 focus:border-gold focus:outline-none dark:border-cream/15 dark:text-cream dark:placeholder:text-cream/35"
            />
          </div>

          <button
            type="submit"
            disabled={!title.trim()}
            className="flex items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-2.5 font-sans text-sm font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-gold dark:text-ink"
          >
            <Plus className="h-4 w-4" />
            Beginnen
          </button>
        </form>
      </div>
    </div>
  );
}
