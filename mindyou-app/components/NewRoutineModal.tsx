"use client";

import { useState } from "react";
import { X, Repeat, CalendarCheck2, Plus } from "lucide-react";

export function NewRoutineModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, resetDaily: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [resetDaily, setResetDaily] = useState(true);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-routine-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-t-2xl bg-cream p-6 shadow-2xl dark:bg-slate sm:rounded-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="new-routine-title" className="font-display text-lg font-medium text-ink dark:text-cream">
            Nieuwe routine
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
            if (!name.trim()) return;
            onCreate(name.trim(), resetDaily);
          }}
          className="flex flex-col gap-4"
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bijv. Ochtendroutine"
            className="w-full rounded-lg border border-ink/10 bg-transparent px-3 py-2.5 font-sans text-sm text-ink placeholder:text-ink/35 focus:border-gold focus:outline-none dark:border-cream/15 dark:text-cream dark:placeholder:text-cream/35"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setResetDaily(true)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 font-sans text-xs transition-colors ${
                resetDaily
                  ? "border-gold bg-gold text-ink"
                  : "border-ink/15 text-ink/60 dark:border-cream/20 dark:text-cream/60"
              }`}
            >
              <Repeat className="h-3.5 w-3.5" />
              Dagelijks
            </button>
            <button
              type="button"
              onClick={() => setResetDaily(false)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 font-sans text-xs transition-colors ${
                !resetDaily
                  ? "border-gold bg-gold text-ink"
                  : "border-ink/15 text-ink/60 dark:border-cream/20 dark:text-cream/60"
              }`}
            >
              <CalendarCheck2 className="h-3.5 w-3.5" />
              Eenmalig
            </button>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="flex items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-2.5 font-sans text-sm font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-gold dark:text-ink"
          >
            <Plus className="h-4 w-4" />
            Aanmaken
          </button>
        </form>
      </div>
    </div>
  );
}
