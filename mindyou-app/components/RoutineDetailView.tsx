"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Plus, Trash2, RotateCcw, GripVertical, PartyPopper, Pencil, X } from "lucide-react";
import { IconPicker } from "./IconPicker";
import { getIcon } from "@/lib/icons";

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
  steps: Step[];
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function RoutineDetailView({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [stepLabel, setStepLabel] = useState("");
  const [stepIcon, setStepIcon] = useState("check");
  const [dragStepId, setDragStepId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/routines/${id}`)
      .then((r) => r.json())
      .then(setRoutine)
      .finally(() => setLoading(false));
    if (searchParams.get("edit") === "1") setEditMode(true);
  }, [id, searchParams]);

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <p className="font-sans text-sm text-ink/40 dark:text-cream/40">Laden...</p>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="font-sans text-sm text-ink/45 dark:text-cream/45">
          Deze routine bestaat niet (meer).
        </p>
      </div>
    );
  }

  const dateKey = routine.resetDaily ? todayKey() : "ALL";
  const isDone = (step: Step) => step.completions.some((c) => c.dateKey === dateKey);
  const doneCount = routine.steps.filter(isDone).length;
  const total = routine.steps.length;
  const allDone = total > 0 && doneCount === total;

  const wasAllDone = useRef(false);
  useEffect(() => {
    if (allDone && !wasAllDone.current) {
      // Rustig naar boven scrollen zodat de melding altijd in beeld komt,
      // ook als je onderin de lijst zat te scrollen.
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    wasAllDone.current = allDone;
  }, [allDone]);

  async function toggleStep(stepId: string) {
    if (!routine) return;
    // optimistisch bijwerken
    setRoutine((prev) =>
      prev
        ? {
            ...prev,
            steps: prev.steps.map((s) => {
              if (s.id !== stepId) return s;
              const already = s.completions.some((c) => c.dateKey === dateKey);
              return {
                ...s,
                completions: already
                  ? s.completions.filter((c) => c.dateKey !== dateKey)
                  : [...s.completions, { id: "temp", dateKey }],
              };
            }),
          }
        : prev
    );
    const res = await fetch(`/api/routines/steps/${stepId}/toggle`, { method: "POST" });
    const updated = await res.json();
    setRoutine((prev) =>
      prev ? { ...prev, steps: prev.steps.map((s) => (s.id === stepId ? updated : s)) } : prev
    );
  }

  async function addStep(e: React.FormEvent) {
    e.preventDefault();
    if (!stepLabel.trim() || !routine) return;
    const res = await fetch(`/api/routines/${routine.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: stepLabel, icon: stepIcon }),
    });
    const step = await res.json();
    setRoutine((prev) => (prev ? { ...prev, steps: [...prev.steps, step] } : prev));
    setStepLabel("");
    setStepIcon("check");
  }

  async function deleteStep(stepId: string) {
    setRoutine((prev) =>
      prev ? { ...prev, steps: prev.steps.filter((s) => s.id !== stepId) } : prev
    );
    await fetch(`/api/routines/steps/${stepId}`, { method: "DELETE" });
  }

  async function resetRoutine() {
    if (!routine) return;
    setRoutine((prev) =>
      prev ? { ...prev, steps: prev.steps.map((s) => ({ ...s, completions: [] })) } : prev
    );
    await fetch(`/api/routines/${routine.id}/reset`, { method: "POST" });
  }

  function handleDrop(targetId: string) {
    if (!routine || !dragStepId || dragStepId === targetId) {
      setDragStepId(null);
      return;
    }
    const steps = [...routine.steps];
    const fromIdx = steps.findIndex((s) => s.id === dragStepId);
    const toIdx = steps.findIndex((s) => s.id === targetId);
    const [moved] = steps.splice(fromIdx, 1);
    steps.splice(toIdx, 0, moved);
    const reordered = steps.map((s, i) => ({ ...s, order: i }));
    setRoutine({ ...routine, steps: reordered });

    fetch("/api/routines/steps/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steps: reordered.map((s) => ({ id: s.id, order: s.order })) }),
    });
    setDragStepId(null);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col px-5 py-8 sm:py-10">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="flex-1 text-center">
          <h1 className="font-display text-2xl font-medium text-ink dark:text-cream sm:text-3xl">
            {routine.name}
          </h1>
          {total > 0 && (
            <p className="mt-2 font-sans text-sm text-ink/50 dark:text-cream/50">
              {doneCount} van {total} gedaan
            </p>
          )}
        </div>
        {doneCount > 0 && (
          <button
            onClick={resetRoutine}
            aria-label="Reset voortgang"
            title="Reset voortgang"
            className="shrink-0 rounded-full p-2 text-ink/30 transition-colors hover:bg-ink/5 hover:text-ink/60 dark:text-cream/30 dark:hover:bg-cream/10"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>

      {allDone && (
        <div className="animate-gentle-celebrate mb-6 flex flex-col items-center gap-3 rounded-2xl border border-gold/40 bg-gold/10 px-6 py-6 text-center">
          <PartyPopper className="h-6 w-6 text-gold" strokeWidth={1.75} />
          <p className="font-display text-base font-medium text-ink dark:text-cream">
            Goed gedaan!
          </p>
          <p className="font-sans text-xs text-ink/55 dark:text-cream/55">
            Alles is afgerond.
          </p>
          <button
            onClick={resetRoutine}
            className="flex items-center gap-1.5 rounded-full border border-gold/50 px-4 py-1.5 font-sans text-xs text-ink transition-colors hover:bg-gold/10 dark:text-cream"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Opnieuw beginnen
          </button>
        </div>
      )}

      {total === 0 ? (
        <p className="text-center font-sans text-sm text-ink/45 dark:text-cream/45">
          Nog geen stappen. Zet "Bewerken" aan om er een toe te voegen.
        </p>
      ) : (
        <ul className="flex flex-1 flex-col gap-3">
          {routine.steps
            .slice()
            .sort((a, b) =>
              editMode
                ? a.order - b.order
                : Number(isDone(a)) - Number(isDone(b)) || a.order - b.order
            )
            .map((step) => {
              const Icon = getIcon(step.icon);
              const done = isDone(step);
              return (
                <li
                  key={step.id}
                  draggable={editMode}
                  onDragStart={() => editMode && setDragStepId(step.id)}
                  onDragOver={(e) => editMode && e.preventDefault()}
                  onDrop={() => editMode && handleDrop(step.id)}
                >
                  <div
                    className={`flex items-center gap-4 rounded-2xl border-2 px-4 py-4 transition-colors ${
                      done
                        ? "border-gold/50 bg-gold/[0.08]"
                        : "border-ink/10 dark:border-cream/12"
                    }`}
                  >
                    {editMode && (
                      <GripVertical className="h-5 w-5 shrink-0 cursor-grab text-ink/25 dark:text-cream/25" />
                    )}

                    <button
                      onClick={() => toggleStep(step.id)}
                      className="flex flex-1 items-center gap-4 text-left"
                      aria-pressed={done}
                    >
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                          done ? "bg-gold text-ink" : "bg-ink/5 text-ink/60 dark:bg-cream/10 dark:text-cream/60"
                        }`}
                      >
                        <Icon className="h-6 w-6" strokeWidth={1.75} />
                      </span>
                      <span
                        className={`flex-1 font-sans text-lg text-ink dark:text-cream ${
                          done ? "text-ink/45 line-through dark:text-cream/45" : ""
                        }`}
                      >
                        {step.label}
                      </span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                          done
                            ? "border-gold bg-gold text-ink"
                            : "border-ink/20 text-transparent dark:border-cream/25"
                        }`}
                      >
                        <Check className="h-5 w-5" strokeWidth={3} />
                      </span>
                    </button>

                    {editMode && (
                      <button
                        onClick={() => deleteStep(step.id)}
                        aria-label="Stap verwijderen"
                        className="shrink-0 rounded-full p-1.5 text-ink/30 transition-colors hover:bg-ink/5 hover:text-ink/60 dark:text-cream/30 dark:hover:bg-cream/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
        </ul>
      )}

      <div className="mt-8">
        <button
          onClick={() => setEditMode((v) => !v)}
          className="flex w-full items-center justify-center gap-1.5 rounded-full border border-ink/15 py-2.5 font-sans text-xs text-ink/60 transition-colors hover:border-gold dark:border-cream/20 dark:text-cream/60"
        >
          {editMode ? <X className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
          {editMode ? "Klaar met bewerken" : "Bewerken"}
        </button>

        {editMode && (
          <form
            onSubmit={addStep}
            className="mt-3 flex items-center gap-2 rounded-2xl border border-ink/10 p-3 dark:border-cream/10"
          >
            <IconPicker value={stepIcon} onChange={setStepIcon} />
            <input
              value={stepLabel}
              onChange={(e) => setStepLabel(e.target.value)}
              placeholder="Stap toevoegen..."
              className="flex-1 rounded-lg border border-ink/10 bg-cream px-3 py-2 font-sans text-sm text-ink placeholder:text-ink/35 focus:border-gold focus:outline-none dark:border-cream/15 dark:bg-ink dark:text-cream dark:placeholder:text-cream/35"
            />
            <button
              type="submit"
              disabled={!stepLabel.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-cream transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-gold dark:text-ink"
              aria-label="Stap toevoegen"
            >
              <Plus className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
