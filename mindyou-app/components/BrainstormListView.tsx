"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Lightbulb } from "lucide-react";
import { NewSessionModal } from "./NewSessionModal";

interface Session {
  id: string;
  title: string;
  createdAt: string;
  _count: { nodes: number };
}

export function BrainstormListView() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    fetch("/api/brainstorm")
      .then((r) => r.json())
      .then(setSessions)
      .finally(() => setLoading(false));
  }, []);

  async function createSession(title: string) {
    const res = await fetch("/api/brainstorm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const session = await res.json();
    setShowNew(false);
    window.location.href = `/brainstorm/${session.id}`;
  }

  async function deleteSession(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSessions((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/brainstorm/${id}`, { method: "DELETE" });
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="mb-1 font-display text-3xl font-medium text-ink dark:text-cream">
            Brainstorm
          </h1>
          <p className="font-sans text-sm text-ink/55 dark:text-cream/55">
            Vrij denken in een mindmap, later ordenen.
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          aria-label="Nieuwe brainstorm"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-cream transition-opacity hover:opacity-90 dark:bg-gold dark:text-ink"
        >
          <Plus className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </div>

      {loading ? (
        <p className="font-sans text-sm text-ink/40 dark:text-cream/40">Laden...</p>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-ink/15 px-6 py-16 text-center dark:border-cream/15">
          <Lightbulb className="h-7 w-7 text-ink/25 dark:text-cream/25" strokeWidth={1.5} />
          <p className="font-sans text-sm text-ink/45 dark:text-cream/45">
            Nog geen brainstorms. Begin er één met de knop rechtsboven.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {sessions.map((s) => (
            <li key={s.id}>
              <a
                href={`/brainstorm/${s.id}`}
                className="flex items-center gap-4 rounded-2xl border border-ink/8 p-4 transition-colors hover:border-gold dark:border-cream/10"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10">
                  <Lightbulb className="h-4.5 w-4.5 text-gold" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-base font-medium text-ink dark:text-cream">
                    {s.title}
                  </p>
                  <p className="mt-0.5 font-sans text-xs text-ink/45 dark:text-cream/45">
                    {s._count.nodes} {s._count.nodes === 1 ? "knooppunt" : "knooppunten"}
                  </p>
                </div>
                <button
                  onClick={(e) => deleteSession(s.id, e)}
                  aria-label="Verwijderen"
                  className="shrink-0 rounded-full p-2 text-ink/25 transition-colors hover:bg-ink/5 hover:text-ink/50 dark:text-cream/25 dark:hover:bg-cream/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </a>
            </li>
          ))}
        </ul>
      )}

      {showNew && (
        <NewSessionModal onClose={() => setShowNew(false)} onCreate={createSession} />
      )}
    </div>
  );
}
