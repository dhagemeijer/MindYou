"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, GripVertical, Check, Repeat, CalendarCheck2 } from "lucide-react";
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

  const [newName, setNewName] = useState("");
  const [newResetDaily, setNewResetDaily] = useState(true);

  const [dragStep, setDragStep] = useState<{ routineId: string; stepId: string } | null>(null);

  useEffect(() => {
    fetch("/api/routines")
      .then((r) => r.json())
      .then(setRoutines)
      .finally(() => setLoading(false));
  }, []);

  async function createRoutine(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const res = await fetch("/api/routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, resetDaily: newResetDaily }),
    });
    const routine = await res.json();
    setRoutines((prev) => [...prev, { ...routine, steps: [] }]);
    setNewName("");
    setNewResetDaily(true);
  }

  async function deleteRoutine(id: string) {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/routines/${id}`, { method: "DELETE" });
  }

  async function addStep(routineId: string, label: string, icon: string) {
    if (!label.trim()) return;
    const res = await fetch(`/api/routines/${routineId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, icon }),
    });
    const step = await res.json();
    setRoutines((prev) =>
      prev.map((r) => (r.id === routineId ? { ...r, steps: [...r.steps, step] } : r))
    );
  }

  async function deleteStep(routineId: string, stepId: string) {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId ? { ...r, steps: r.steps.filter((s) => s.id !== stepId) } : r
      )
    );
    await fetch(`/api/routines/steps/${stepId}`, { method: "DELETE" });
  }

  async function toggleStep(routineId: string, stepId: string) {
    // optimistic update
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== routineId) return r;
        const key = r.resetDaily ? todayKey() : "ALL";
        return {
          ...r,
          steps: r.steps.map((s) => {
            if (s.id !== stepId) return s;
            const already = s.completions.some((c) => c.dateKey === key);
            return {
              ...s,
              completions: already
                ? s.completions.filter((c) => c.dateKey !== key)
                : [...s.completions, { id: "temp", dateKey: key }],
            };
          }),
        };
      })
    );
    const res = await fetch(`/api/routines/steps/${stepId}/toggle`, { method: "POST" });
    const updated = await res.json();
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? { ...r, steps: r.steps.map((s) => (s.id === stepId ? updated : s)) }
          : r
      )
    );
  }

  function handleDrop(routineId: string, targetStepId: string) {
    if (!dragStep || dragStep.routineId !== routineId || dragStep.stepId === targetStepId) {
      setDragStep(null);
      return;
    }
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== routineId) return r;
        const steps = [...r.steps];
        const fromIdx = steps.findIndex((s) => s.id === dragStep.stepId);
        const toIdx = steps.findIndex((s) => s.id === targetStepId);
        const [moved] = steps.splice(fromIdx, 1);
        steps.splice(toIdx, 0, moved);
        const reordered = steps.map((s, i) => ({ ...s, order: i }));

        fetch("/api/routines/steps/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            steps: reordered.map((s) => ({ id: s.id, order: s.order })),
          }),
        });

        return { ...r, steps: reordered };
      })
    );
    setDragStep(null);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-1 font-display text-3xl font-medium text-ink dark:text-cream">
        Activiteiten
      </h1>
      <p className="mb-8 font-sans text-sm text-ink/55 dark:text-cream/55">
        Bouw routines op met stappen die je kunt afvinken.
      </p>

      <form
        onSubmit={createRoutine}
        className="mb-10 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-ink/[0.02] p-4 dark:border-cream/10 dark:bg-cream/[0.03] sm:flex-row sm:items-center"
      >
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nieuwe routine, bv. Ochtendroutine"
          className="flex-1 rounded-lg border border-ink/10 bg-cream px-3 py-2.5 font-sans text-sm text-ink placeholder:text-ink/35 focus:border-gold focus:outline-none dark:border-cream/15 dark:bg-ink dark:text-cream dark:placeholder:text-cream/35"
        />
        <button
          type="button"
          onClick={() => setNewResetDaily((v) => !v)}
          className="flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-2 font-sans text-xs text-ink/70 transition-colors hover:border-gold dark:border-cream/20 dark:text-cream/70"
        >
          {newResetDaily ? (
            <Repeat className="h-3.5 w-3.5 text-gold" />
          ) : (
            <CalendarCheck2 className="h-3.5 w-3.5 text-gold" />
          )}
          {newResetDaily ? "Dagelijks" : "Eenmalig"}
        </button>
        <button
          type="submit"
          disabled={!newName.trim()}
          className="flex items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-2.5 font-sans text-sm font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-gold dark:text-ink"
        >
          <Plus className="h-4 w-4" />
          Routine
        </button>
      </form>

      {loading ? (
        <p className="font-sans text-sm text-ink/40 dark:text-cream/40">Laden...</p>
      ) : routines.length === 0 ? (
        <p className="font-sans text-sm text-ink/40 dark:text-cream/40">
          Nog geen routines. Maak er hierboven één aan.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onDelete={() => deleteRoutine(routine.id)}
              onAddStep={(label, icon) => addStep(routine.id, label, icon)}
              onDeleteStep={(stepId) => deleteStep(routine.id, stepId)}
              onToggleStep={(stepId) => toggleStep(routine.id, stepId)}
              onDragStart={(stepId) => setDragStep({ routineId: routine.id, stepId })}
              onDrop={(stepId) => handleDrop(routine.id, stepId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RoutineCard({
  routine,
  onDelete,
  onAddStep,
  onDeleteStep,
  onToggleStep,
  onDragStart,
  onDrop,
}: {
  routine: Routine;
  onDelete: () => void;
  onAddStep: (label: string, icon: string) => void;
  onDeleteStep: (stepId: string) => void;
  onToggleStep: (stepId: string) => void;
  onDragStart: (stepId: string) => void;
  onDrop: (stepId: string) => void;
}) {
  const [stepLabel, setStepLabel] = useState("");
  const [stepIcon, setStepIcon] = useState("check");

  const doneCount = routine.steps.filter((s) => isDone(routine, s)).length;

  return (
    <div className="rounded-2xl border border-ink/8 dark:border-cream/10">
      <div className="flex items-center justify-between border-b border-ink/8 px-5 py-4 dark:border-cream/10">
        <div>
          <h2 className="font-display text-lg font-medium text-ink dark:text-cream">
            {routine.name}
          </h2>
          <p className="mt-0.5 flex items-center gap-1.5 font-sans text-xs text-ink/45 dark:text-cream/45">
            {routine.resetDaily ? (
              <Repeat className="h-3 w-3" />
            ) : (
              <CalendarCheck2 className="h-3 w-3" />
            )}
            {routine.resetDaily ? "Dagelijks" : "Eenmalig"} · {doneCount}/{routine.steps.length}{" "}
            gedaan
          </p>
        </div>
        <button
          onClick={onDelete}
          aria-label="Routine verwijderen"
          className="rounded-full p-1.5 text-ink/30 transition-colors hover:bg-ink/5 hover:text-ink/60 dark:text-cream/30 dark:hover:bg-cream/10 dark:hover:text-cream/60"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <ul className="flex flex-col gap-1 p-3">
        {routine.steps
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((step) => {
            const Icon = getIcon(step.icon);
            const done = isDone(routine, step);
            return (
              <li
                key={step.id}
                draggable
                onDragStart={() => onDragStart(step.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(step.id)}
                className="flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-ink/[0.03] dark:hover:bg-cream/[0.04]"
              >
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-ink/25 dark:text-cream/25" />

                <button
                  onClick={() => onToggleStep(step.id)}
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    done
                      ? "border-gold bg-gold text-ink"
                      : "border-ink/20 text-transparent dark:border-cream/25"
                  }`}
                  aria-label="Afvinken"
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </button>

                <Icon
                  className={`h-4 w-4 shrink-0 ${done ? "text-gold" : "text-ink/40 dark:text-cream/40"}`}
                  strokeWidth={1.75}
                />

                <span
                  className={`flex-1 font-sans text-sm text-ink dark:text-cream ${
                    done ? "text-ink/40 line-through dark:text-cream/40" : ""
                  }`}
                >
                  {step.label}
                </span>

                <button
                  onClick={() => onDeleteStep(step.id)}
                  aria-label="Stap verwijderen"
                  className="shrink-0 rounded-full p-1 text-ink/25 transition-colors hover:bg-ink/5 hover:text-ink/50 dark:text-cream/25 dark:hover:bg-cream/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAddStep(stepLabel, stepIcon);
          setStepLabel("");
          setStepIcon("check");
        }}
        className="flex items-center gap-2 border-t border-ink/8 px-3 py-3 dark:border-cream/10"
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
    </div>
  );
}
