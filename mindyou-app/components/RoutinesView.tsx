"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, RotateCcw, Repeat, CalendarCheck2, ListChecks } from "lucide-react";
import { NewRoutineModal } from "./NewRoutineModal";

interface Completion {
  id: string;
  dateKey: string;
}

interface Step {
  id: string;
  label: string;
  icon: string;
  order: number;
  completions: Completion[];
}

interface Routine {
  id: string;
  name: string;
  resetDaily: boolean;
  order: number;
  steps: Step[];
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isDone(routine: Routine, step: Step) {
  const key = routine.resetDaily ? todayKey() : "ALL";
  return step.completions.some((c) => c.dateKey === key);
}

export function RoutinesView() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    fetch("/api/routines")
      .then((r) => r.json())
      .then(setRoutines)
      .finally(() => setLoading(false));
  }, []);

  async function createRoutine(name: string, resetDaily: boolean) {
    const res = await fetch("/api/routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, resetDaily }),
    });
    const routine = await res.json();
    setRoutines((prev) => [...prev, { ...routine, steps: [] }]);
    setShowNew(false);
    window.location.href = `/activiteiten/${routine.id}`;
  }

  async function resetRoutine(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, steps: r.steps.map((s) => ({ ...s, completions: [] })) } : r))
    );
    await fetch(`/api/routines/${id}/reset`, { method: "POST" });
  }

  async function deleteRoutine(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setRoutines((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/routines/${id}`, { method: "DELETE" });
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-1 font-display text-3xl font-medium text-ink dark:text-cream">
            Activiteiten
          </h1>
          <p className="font-sans text-sm text-ink/55 dark:text-cream/55">
            Je opgeslagen routines.
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          aria-label="Nieuwe routine"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition-opacity hover:opacity-90 dark:bg-gold dark:text-ink"
        >
          <Plus className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </div>

      {loading ? (
        <p className="font-sans text-sm text-ink/40 dark:text-cream/40">Laden...</p>
      ) : routines.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 px-6 py-16 text-center dark:border-cream/15">
          <ListChecks className="h-7 w-7 text-ink/25 dark:text-cream/25" strokeWidth={1.5} />
          <p className="font-sans text-sm text-ink/45 dark:text-cream/45">
            Nog geen routines. Maak je eerste aan met de knop rechtsboven.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {routines.map((routine) => {
            const doneCount = routine.steps.filter((s) => isDone(routine, s)).length;
            const total = routine.steps.length;
            const allDone = total > 0 && doneCount === total;
            return (
              <li key={routine.id}>
                <a
                  href={`/activiteiten/${routine.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-ink/8 p-4 transition-colors hover:border-gold dark:border-cream/10"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-base font-medium text-ink dark:text-cream">
                      {routine.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-sans text-xs text-ink/45 dark:text-cream/45">
                      {routine.resetDaily ? (
                        <Repeat className="h-3 w-3" />
                      ) : (
                        <CalendarCheck2 className="h-3 w-3" />
                      )}
                      {routine.resetDaily ? "Dagelijks" : "Eenmalig"}
                      {total > 0 && (
                        <>
                          {" "}
                          · <span className={allDone ? "text-gold" : ""}>{doneCount}/{total} gedaan</span>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-0.5">
                    <button
                      onClick={(e) => resetRoutine(routine.id, e)}
                      disabled={doneCount === 0}
                      aria-label="Reset voortgang"
                      title="Reset voortgang"
                      className="rounded-full p-2 text-ink/25 transition-colors hover:bg-ink/5 hover:text-ink/50 disabled:pointer-events-none disabled:opacity-25 dark:text-cream/25 dark:hover:bg-cream/10"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <a
                      href={`/activiteiten/${routine.id}?edit=1`}
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Bewerken"
                      title="Bewerken"
                      className="rounded-full p-2 text-ink/25 transition-colors hover:bg-ink/5 hover:text-ink/50 dark:text-cream/25 dark:hover:bg-cream/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </a>
                    <button
                      onClick={(e) => deleteRoutine(routine.id, e)}
                      aria-label="Routine verwijderen"
                      title="Verwijderen"
                      className="rounded-full p-2 text-ink/25 transition-colors hover:bg-ink/5 hover:text-ink/50 dark:text-cream/25 dark:hover:bg-cream/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {showNew && (
        <NewRoutineModal onClose={() => setShowNew(false)} onCreate={createRoutine} />
      )}
    </div>
  );
}
