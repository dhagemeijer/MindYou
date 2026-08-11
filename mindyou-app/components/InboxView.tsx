"use client";

import { useEffect, useState } from "react";
import { Plus, X, Check, Trash2, Pencil, Lightbulb, ListTodo, Zap } from "lucide-react";

type ItemType = "IDEE" | "TODO" | "ACTIE";
type ItemStatus = "INBOX" | "ACTIEF" | "AFGEROND";

interface Project {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface Item {
  id: string;
  title: string;
  type: ItemType;
  status: ItemStatus;
  createdAt: string;
  project: Project | null;
  tags: Tag[];
}

const TYPE_META: Record<ItemType, { label: string; icon: typeof Lightbulb }> = {
  IDEE: { label: "Idee", icon: Lightbulb },
  TODO: { label: "Todo", icon: ListTodo },
  ACTIE: { label: "Actie", icon: Zap },
};

function TypePicker({ type, setType }: { type: ItemType; setType: (t: ItemType) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {(Object.keys(TYPE_META) as ItemType[]).map((t) => {
        const { label, icon: Icon } = TYPE_META[t];
        const active = type === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-sans text-xs transition-colors ${
              active
                ? "border-gold bg-gold text-ink"
                : "border-ink/15 text-ink/60 hover:border-gold/60 dark:border-cream/20 dark:text-cream/60"
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function ProjectPicker({
  projectId,
  setProjectId,
  projects,
  onCreateProject,
}: {
  projectId: string;
  setProjectId: (id: string) => void;
  projects: Project[];
  onCreateProject: (name: string) => Promise<Project>;
}) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  if (creating) {
    return (
      <div className="flex flex-1 items-center gap-1.5">
        <input
          autoFocus
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && newName.trim()) {
              e.preventDefault();
              const p = await onCreateProject(newName.trim());
              setProjectId(p.id);
              setNewName("");
              setCreating(false);
            }
          }}
          placeholder="Nieuw project..."
          className="flex-1 rounded-lg border border-gold bg-cream px-3 py-2 font-sans text-xs text-ink placeholder:text-ink/35 focus:outline-none dark:bg-ink dark:text-cream"
        />
        <button
          type="button"
          onClick={async () => {
            if (!newName.trim()) return;
            const p = await onCreateProject(newName.trim());
            setProjectId(p.id);
            setNewName("");
            setCreating(false);
          }}
          className="rounded-lg bg-gold p-2 text-ink"
          aria-label="Project toevoegen"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setCreating(false)}
          className="rounded-lg border border-ink/15 p-2 text-ink/50 dark:border-cream/20 dark:text-cream/50"
          aria-label="Annuleren"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <select
      value={projectId}
      onChange={(e) => {
        if (e.target.value === "__new__") setCreating(true);
        else setProjectId(e.target.value);
      }}
      className="flex-1 rounded-lg border border-ink/10 bg-cream px-3 py-2 font-sans text-xs text-ink focus:border-gold focus:outline-none dark:border-cream/15 dark:bg-ink dark:text-cream"
    >
      <option value="">Geen project</option>
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
      <option value="__new__">+ Nieuw project...</option>
    </select>
  );
}

function EditItemRow({
  item,
  projects,
  onCreateProject,
  onSave,
  onCancel,
}: {
  item: Item;
  projects: Project[];
  onCreateProject: (name: string) => Promise<Project>;
  onSave: (patch: { title: string; type: ItemType; tags: string[]; projectId: string | null }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [type, setType] = useState<ItemType>(item.type);
  const [tagsInput, setTagsInput] = useState(item.tags.map((t) => t.name).join(", "));
  const [projectId, setProjectId] = useState(item.project?.id ?? "");

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-gold/50 bg-gold/[0.05] px-4 py-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg border border-ink/10 bg-cream px-3 py-2 font-sans text-sm text-ink focus:border-gold focus:outline-none dark:border-cream/15 dark:bg-ink dark:text-cream"
      />
      <TypePicker type={type} setType={setType} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="tags, met, komma's"
          className="flex-1 rounded-lg border border-ink/10 bg-cream px-3 py-2 font-sans text-xs text-ink placeholder:text-ink/35 focus:border-gold focus:outline-none dark:border-cream/15 dark:bg-ink dark:text-cream dark:placeholder:text-cream/35"
        />
        <ProjectPicker
          projectId={projectId}
          setProjectId={setProjectId}
          projects={projects}
          onCreateProject={onCreateProject}
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            onSave({
              title,
              type,
              tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
              projectId: projectId || null,
            })
          }
          disabled={!title.trim()}
          className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 font-sans text-xs font-medium text-cream disabled:opacity-40 dark:bg-gold dark:text-ink"
        >
          <Check className="h-3.5 w-3.5" />
          Opslaan
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-1.5 font-sans text-xs text-ink/60 dark:border-cream/20 dark:text-cream/60"
        >
          <X className="h-3.5 w-3.5" />
          Annuleren
        </button>
      </div>
    </li>
  );
}

export function InboxView() {
  const [items, setItems] = useState<Item[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [type, setType] = useState<ItemType>("IDEE");
  const [tagsInput, setTagsInput] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/items").then((r) => r.json()),
      fetch("/api/projects").then((r) => r.json()),
    ])
      .then(([itemsRes, projectsRes]) => {
        setItems(itemsRes);
        setProjects(projectsRes);
      })
      .finally(() => setLoading(false));
  }, []);

  async function createProject(name: string): Promise<Project> {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const project = await res.json();
    setProjects((prev) => [...prev, project]);
    return project;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || submitting) return;
    setSubmitting(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type, tags, projectId: projectId || null }),
      });
      if (!res.ok) throw new Error("Opslaan mislukt");
      const created = await res.json();
      setItems((prev) => [created, ...prev]);
      setTitle("");
      setTagsInput("");
      setType("IDEE");
      setProjectId("");
    } catch {
      // Keep it simple for v1 — surface nothing fancy, the form just stays filled in.
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleStatus(item: Item) {
    const next: ItemStatus =
      item.status === "AFGEROND" ? "INBOX" : item.status === "INBOX" ? "ACTIEF" : "AFGEROND";
    const res = await fetch(`/api/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
  }

  async function saveEdit(
    id: string,
    patch: { title: string; type: ItemType; tags: string[]; projectId: string | null }
  ) {
    const res = await fetch(`/api/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    setEditingId(null);
  }

  async function deleteItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/items/${id}`, { method: "DELETE" });
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-1 font-display text-3xl font-medium text-ink dark:text-cream">
        Drop it!
      </h1>
      <p className="mb-8 font-sans text-sm text-ink/55 dark:text-cream/55">
        Vang alles wat in je hoofd zit — sorteer later.
      </p>

      {/* Capture form */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 flex flex-col gap-3 rounded-2xl border border-ink/10 bg-ink/[0.02] p-4 dark:border-cream/10 dark:bg-cream/[0.03]"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Wat wil je vastleggen?"
          className="w-full rounded-lg border border-ink/10 bg-cream px-3 py-2.5 font-sans text-sm text-ink placeholder:text-ink/35 focus:border-gold focus:outline-none dark:border-cream/15 dark:bg-ink dark:text-cream dark:placeholder:text-cream/35"
        />

        <TypePicker type={type} setType={setType} />

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="tags, met, komma's"
            className="flex-1 rounded-lg border border-ink/10 bg-cream px-3 py-2 font-sans text-xs text-ink placeholder:text-ink/35 focus:border-gold focus:outline-none dark:border-cream/15 dark:bg-ink dark:text-cream dark:placeholder:text-cream/35"
          />
          <ProjectPicker
            projectId={projectId}
            setProjectId={setProjectId}
            projects={projects}
            onCreateProject={createProject}
          />
        </div>

        <button
          type="submit"
          disabled={!title.trim() || submitting}
          className="flex items-center justify-center gap-1.5 self-start rounded-full bg-ink px-5 py-2 font-sans text-sm font-medium text-cream transition-opacity hover:opacity-90 disabled:opacity-40 dark:bg-gold dark:text-ink"
        >
          <Plus className="h-4 w-4" />
          Toevoegen
        </button>
      </form>

      {/* List */}
      {loading ? (
        <p className="font-sans text-sm text-ink/40 dark:text-cream/40">Laden...</p>
      ) : items.length === 0 ? (
        <p className="font-sans text-sm text-ink/40 dark:text-cream/40">
          Nog niets vastgelegd. Begin hierboven.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) =>
            editingId === item.id ? (
              <EditItemRow
                key={item.id}
                item={item}
                projects={projects}
                onCreateProject={createProject}
                onSave={(patch) => saveEdit(item.id, patch)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-ink/8 px-4 py-3 dark:border-cream/10"
              >
                <button
                  onClick={() => toggleStatus(item)}
                  aria-label="Status wijzigen"
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    item.status === "AFGEROND"
                      ? "border-gold bg-gold text-ink"
                      : item.status === "ACTIEF"
                        ? "border-gold text-gold"
                        : "border-ink/20 text-transparent dark:border-cream/25"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </button>

                {(() => {
                  const { icon: Icon } = TYPE_META[item.type];
                  return (
                    <Icon className="h-4 w-4 shrink-0 text-ink/40 dark:text-cream/40" strokeWidth={2} />
                  );
                })()}

                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate font-sans text-sm text-ink dark:text-cream ${
                      item.status === "AFGEROND" ? "text-ink/40 line-through dark:text-cream/40" : ""
                    }`}
                  >
                    {item.title}
                  </p>
                  {(item.project || item.tags.length > 0) && (
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {item.project && (
                        <span className="rounded-full bg-ink/5 px-2 py-0.5 font-sans text-[11px] text-ink/55 dark:bg-cream/10 dark:text-cream/55">
                          {item.project.name}
                        </span>
                      )}
                      {item.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-gold/10 px-2 py-0.5 font-sans text-[11px] text-gold"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setEditingId(item.id)}
                  aria-label="Bewerken"
                  className="shrink-0 rounded-full p-1.5 text-ink/30 transition-colors hover:bg-ink/5 hover:text-ink/60 dark:text-cream/30 dark:hover:bg-cream/10 dark:hover:text-cream/60"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  aria-label="Verwijderen"
                  className="shrink-0 rounded-full p-1.5 text-ink/30 transition-colors hover:bg-ink/5 hover:text-ink/60 dark:text-cream/30 dark:hover:bg-cream/10 dark:hover:text-cream/60"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
