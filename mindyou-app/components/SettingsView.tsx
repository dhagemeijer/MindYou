"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, GripVertical } from "lucide-react";
import { MODULES, getModuleDef } from "@/lib/modules";

interface Setting {
  key: string;
  visible: boolean;
  order: number;
}

export function SettingsView() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragKey, setDragKey] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/module-settings")
      .then((r) => r.json())
      .then((data: Setting[]) => setSettings(data.sort((a, b) => a.order - b.order)))
      .finally(() => setLoading(false));
  }, []);

  function persist(next: Setting[]) {
    setSettings(next);
    fetch("/api/module-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        settings: next.map((s, i) => ({ key: s.key, visible: s.visible, order: i })),
      }),
    });
  }

  function toggleVisible(key: string) {
    persist(settings.map((s) => (s.key === key ? { ...s, visible: !s.visible } : s)));
  }

  function handleDrop(targetKey: string) {
    if (!dragKey || dragKey === targetKey) {
      setDragKey(null);
      return;
    }
    const next = [...settings];
    const fromIdx = next.findIndex((s) => s.key === dragKey);
    const toIdx = next.findIndex((s) => s.key === targetKey);
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    persist(next);
    setDragKey(null);
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-12">
      <h1 className="mb-1 font-display text-3xl font-medium text-ink dark:text-cream">
        Instellingen
      </h1>
      <p className="mb-8 font-sans text-sm text-ink/55 dark:text-cream/55">
        Zet onderdelen aan of uit, en sleep ze in je gewenste volgorde op het hoofdscherm.
      </p>

      {loading ? (
        <p className="font-sans text-sm text-ink/40 dark:text-cream/40">Laden...</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {settings.map((setting) => {
            const def = getModuleDef(setting.key);
            if (!def) return null;
            const Icon = def.icon;
            return (
              <li
                key={setting.key}
                draggable
                onDragStart={() => setDragKey(setting.key)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(setting.key)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  setting.visible
                    ? "border-ink/8 dark:border-cream/10"
                    : "border-ink/5 opacity-50 dark:border-cream/5"
                }`}
              >
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-ink/25 dark:text-cream/25" />
                <Icon className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.75} />
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-medium text-ink dark:text-cream">
                    {def.label}
                  </p>
                  <p className="truncate font-sans text-xs text-ink/45 dark:text-cream/45">
                    {def.description}
                  </p>
                </div>
                <button
                  onClick={() => toggleVisible(setting.key)}
                  aria-label={setting.visible ? "Verbergen" : "Tonen"}
                  className="shrink-0 rounded-full p-1.5 text-ink/50 transition-colors hover:bg-ink/5 dark:text-cream/50 dark:hover:bg-cream/10"
                >
                  {setting.visible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {!loading && MODULES.length === 0 && (
        <p className="font-sans text-sm text-ink/40 dark:text-cream/40">Geen modules.</p>
      )}
    </div>
  );
}
