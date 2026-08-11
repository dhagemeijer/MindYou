"use client";

import { useEffect, useState } from "react";
import { getModuleDef } from "@/lib/modules";

interface Setting {
  key: string;
  visible: boolean;
  order: number;
}

export default function Home() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/module-settings")
      .then((r) => r.json())
      .then((data: Setting[]) => setSettings(data.sort((a, b) => a.order - b.order)))
      .finally(() => setLoading(false));
  }, []);

  const visible = settings.filter((s) => s.visible);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10">
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold">
          Connect your thoughts.
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink dark:text-cream sm:text-4xl">
          Waar wil je aan werken?
        </h1>
      </div>

      {loading ? (
        <p className="font-sans text-sm text-ink/40 dark:text-cream/40">Laden...</p>
      ) : visible.length === 0 ? (
        <p className="font-sans text-sm text-ink/40 dark:text-cream/40">
          Alle onderdelen staan uit. Zet ze weer aan bij{" "}
          <a href="/instellingen" className="underline hover:text-gold">
            Instellingen
          </a>
          .
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visible.map(({ key }) => {
            const def = getModuleDef(key);
            if (!def) return null;
            const Icon = def.icon;
            return (
              <a
                key={key}
                href={def.href}
                className="group flex flex-col gap-3 rounded-2xl border border-ink/8 p-6 transition-colors hover:border-gold dark:border-cream/10"
              >
                <Icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
                <div>
                  <h2 className="font-display text-lg font-medium text-ink dark:text-cream">
                    {def.label}
                  </h2>
                  <p className="mt-1 font-sans text-sm text-ink/55 dark:text-cream/55">
                    {def.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
