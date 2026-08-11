"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, X, Check, Lightbulb, ListTodo, Zap, ExternalLink } from "lucide-react";
import {
  computeRadialLayout,
  flattenPositioned,
  edgesOf,
  type MindmapNode,
  type PositionedNode,
} from "@/lib/mindmap-layout";

interface Session {
  id: string;
  title: string;
  nodes: MindmapNode[];
}

const NODE_W = 128;
const NODE_H = 56;
const ROOT_W = 168;
const ROOT_H = 72;

export function MindmapView({ id }: { id: string }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [labelDraft, setLabelDraft] = useState("");
  const [addingChild, setAddingChild] = useState(false);
  const [childLabel, setChildLabel] = useState("");

  useEffect(() => {
    fetch(`/api/brainstorm/${id}`)
      .then((r) => r.json())
      .then(setSession)
      .finally(() => setLoading(false));
  }, [id]);

  const root = useMemo(() => {
    if (!session) return null;
    return computeRadialLayout(session.title, session.nodes);
  }, [session]);

  const flat = useMemo(() => (root ? flattenPositioned(root) : []), [root]);
  const edges = useMemo(() => (root ? edgesOf(root) : []), [root]);

  const maxDepth = flat.reduce((m, n) => Math.max(m, n.depth), 0);
  const canvasRadius = (maxDepth + 1) * 150 + 100;
  const viewBox = `${-canvasRadius} ${-canvasRadius} ${canvasRadius * 2} ${canvasRadius * 2}`;

  const selected = flat.find((n) => n.id === selectedId) || null;

  function selectNode(node: PositionedNode) {
    setSelectedId(node.id);
    setLabelDraft(node.label);
    setAddingChild(false);
    setChildLabel("");
  }

  function closePanel() {
    setSelectedId(null);
    setAddingChild(false);
  }

  async function saveLabel() {
    if (!selected || !session || !labelDraft.trim()) return;
    if (selected.id === "__root__") {
      setSession({ ...session, title: labelDraft.trim() });
      await fetch(`/api/brainstorm/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: labelDraft.trim() }),
      });
    } else {
      setSession({
        ...session,
        nodes: session.nodes.map((n) =>
          n.id === selected.id ? { ...n, label: labelDraft.trim() } : n
        ),
      });
      await fetch(`/api/brainstorm/nodes/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: labelDraft.trim() }),
      });
    }
  }

  async function addChild(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !childLabel.trim() || !selected) return;
    const parentId = selected.id === "__root__" ? null : selected.id;
    const res = await fetch("/api/brainstorm/nodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: id, parentId, label: childLabel.trim() }),
    });
    const node = await res.json();
    setSession({ ...session, nodes: [...session.nodes, node] });
    setChildLabel("");
    setAddingChild(false);
  }

  function collectDescendantIds(nodeId: string, nodes: MindmapNode[]): string[] {
    const direct = nodes.filter((n) => n.parentId === nodeId).map((n) => n.id);
    return direct.concat(direct.flatMap((cid) => collectDescendantIds(cid, nodes)));
  }

  async function deleteSelected() {
    if (!session || !selected || selected.id === "__root__") return;
    const toRemove = new Set([selected.id, ...collectDescendantIds(selected.id, session.nodes)]);
    setSession({ ...session, nodes: session.nodes.filter((n) => !toRemove.has(n.id)) });
    closePanel();
    await fetch(`/api/brainstorm/nodes/${selected.id}`, { method: "DELETE" });
  }

  async function promote(type: "IDEE" | "TODO" | "ACTIE") {
    if (!session || !selected || selected.id === "__root__") return;
    const res = await fetch(`/api/brainstorm/nodes/${selected.id}/promote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setSession({
      ...session,
      nodes: session.nodes.map((n) =>
        n.id === selected.id ? { ...n, promotedItemId: data.item.id } : n
      ),
    });
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <p className="font-sans text-sm text-ink/40 dark:text-cream/40">Laden...</p>
      </div>
    );
  }

  if (!session || !root) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
        <p className="font-sans text-sm text-ink/45 dark:text-cream/45">
          Deze brainstorm bestaat niet (meer).
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 8rem)" }}>
        <svg
          viewBox={viewBox}
          className="mx-auto block"
          style={{ width: canvasRadius * 2, height: canvasRadius * 2, maxWidth: "none" }}
        >
          {edges.map(({ from, to }) => (
            <line
              key={`${from.id}-${to.id}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className="stroke-ink/15 dark:stroke-cream/15"
              strokeWidth={1.5}
            />
          ))}

          {flat.map((node) => {
            const isRoot = node.id === "__root__";
            const w = isRoot ? ROOT_W : NODE_W;
            const h = isRoot ? ROOT_H : NODE_H;
            const isSelected = node.id === selectedId;
            const isPromoted = !!node.promotedItemId;
            return (
              <foreignObject
                key={node.id}
                x={node.x - w / 2}
                y={node.y - h / 2}
                width={w}
                height={h}
              >
                <button
                  onClick={() => selectNode(node)}
                  className={`flex h-full w-full items-center justify-center gap-1 rounded-2xl border-2 px-3 text-center transition-colors ${
                    isRoot
                      ? "border-gold bg-gold text-ink"
                      : isSelected
                        ? "border-gold bg-gold/15 text-ink dark:text-cream"
                        : isPromoted
                          ? "border-gold/40 bg-gold/[0.06] text-ink dark:text-cream"
                          : "border-ink/15 bg-cream text-ink dark:border-cream/20 dark:bg-ink dark:text-cream"
                  }`}
                >
                  {isPromoted && !isRoot && (
                    <ExternalLink className="h-3 w-3 shrink-0 text-gold" strokeWidth={2} />
                  )}
                  <span
                    className={`line-clamp-2 font-sans ${isRoot ? "text-sm font-semibold" : "text-xs"}`}
                  >
                    {node.label}
                  </span>
                </button>
              </foreignObject>
            );
          })}
        </svg>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/30 backdrop-blur-[2px] sm:items-center"
          onClick={closePanel}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-t-2xl bg-cream p-6 shadow-2xl dark:bg-slate sm:rounded-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-base font-medium text-ink dark:text-cream">
                {selected.id === "__root__" ? "Centraal onderwerp" : "Knooppunt"}
              </h2>
              <button
                onClick={closePanel}
                aria-label="Sluiten"
                className="rounded-full p-1.5 text-ink/50 hover:bg-ink/5 dark:text-cream/50 dark:hover:bg-cream/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <input
                  value={labelDraft}
                  onChange={(e) => setLabelDraft(e.target.value)}
                  className="flex-1 rounded-lg border border-ink/10 bg-transparent px-3 py-2 font-sans text-sm text-ink focus:border-gold focus:outline-none dark:border-cream/15 dark:text-cream"
                />
                <button
                  onClick={saveLabel}
                  disabled={!labelDraft.trim() || labelDraft === selected.label}
                  aria-label="Opslaan"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-cream disabled:opacity-30 dark:bg-gold dark:text-ink"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>

              {addingChild ? (
                <form onSubmit={addChild} className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={childLabel}
                    onChange={(e) => setChildLabel(e.target.value)}
                    placeholder="Nieuwe tak..."
                    className="flex-1 rounded-lg border border-gold bg-transparent px-3 py-2 font-sans text-sm text-ink focus:outline-none dark:text-cream"
                  />
                  <button
                    type="submit"
                    disabled={!childLabel.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-cream disabled:opacity-30 dark:bg-gold dark:text-ink"
                    aria-label="Toevoegen"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setAddingChild(true)}
                  className="flex items-center justify-center gap-1.5 rounded-full border border-ink/15 py-2.5 font-sans text-xs text-ink/70 hover:border-gold dark:border-cream/20 dark:text-cream/70"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Tak toevoegen
                </button>
              )}

              {selected.id !== "__root__" && (
                <>
                  <div className="border-t border-ink/8 pt-4 dark:border-cream/10">
                    {selected.promotedItemId ? (
                      <p className="flex items-center gap-1.5 font-sans text-xs text-gold">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Al toegevoegd aan Drop it!
                      </p>
                    ) : (
                      <>
                        <p className="mb-2 font-sans text-xs text-ink/50 dark:text-cream/50">
                          Promoveer naar Drop it! als:
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => promote("IDEE")}
                            className="flex flex-1 flex-col items-center gap-1 rounded-lg border border-ink/15 py-2 font-sans text-[11px] text-ink/70 hover:border-gold dark:border-cream/20 dark:text-cream/70"
                          >
                            <Lightbulb className="h-4 w-4" />
                            Idee
                          </button>
                          <button
                            onClick={() => promote("TODO")}
                            className="flex flex-1 flex-col items-center gap-1 rounded-lg border border-ink/15 py-2 font-sans text-[11px] text-ink/70 hover:border-gold dark:border-cream/20 dark:text-cream/70"
                          >
                            <ListTodo className="h-4 w-4" />
                            Todo
                          </button>
                          <button
                            onClick={() => promote("ACTIE")}
                            className="flex flex-1 flex-col items-center gap-1 rounded-lg border border-ink/15 py-2 font-sans text-[11px] text-ink/70 hover:border-gold dark:border-cream/20 dark:text-cream/70"
                          >
                            <Zap className="h-4 w-4" />
                            Actie
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={deleteSelected}
                    className="flex items-center justify-center gap-1.5 rounded-full py-2 font-sans text-xs text-ink/40 hover:text-red-500 dark:text-cream/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Knooppunt verwijderen
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
