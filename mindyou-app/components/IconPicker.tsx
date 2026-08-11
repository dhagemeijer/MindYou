"use client";

import { useEffect, useState } from "react";
import { ICON_OPTIONS, getIcon } from "@/lib/icons";

interface IconSetting {
  key: string;
  visible: boolean;
  order: number;
}

export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string> | null>(null);
  const SelectedIcon = getIcon(value);

  useEffect(() => {
    fetch("/api/icon-settings")
      .then((r) => r.json())
      .then((settings: IconSetting[]) => {
        setVisibleKeys(new Set(settings.filter((s) => s.visible).map((s) => s.key)));
      })
      .catch(() => setVisibleKeys(null));
  }, []);

  // Terwijl de instellingen nog laden (of bij een netwerkfout) toon de volledige
  // set, zodat de picker nooit leeg lijkt.
  const options = visibleKeys
    ? ICON_OPTIONS.filter((o) => visibleKeys.has(o.key))
    : ICON_OPTIONS;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-ink/15 bg-cream text-ink transition-colors hover:border-gold dark:border-cream/20 dark:bg-ink dark:text-cream"
        aria-label="Kies pictogram"
      >
        <SelectedIcon className="h-5 w-5" strokeWidth={1.75} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-12 z-40 grid max-h-64 w-64 grid-cols-5 gap-1 overflow-y-auto rounded-xl border border-ink/10 bg-cream p-3 shadow-xl dark:border-cream/15 dark:bg-slate">
            {options.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                title={label}
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  key === value
                    ? "bg-gold text-ink"
                    : "text-ink/60 hover:bg-ink/5 dark:text-cream/60 dark:hover:bg-cream/10"
                }`}
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              </button>
            ))}
            {options.length === 0 && (
              <p className="col-span-5 px-1 py-2 font-sans text-xs text-ink/45 dark:text-cream/45">
                Geen iconen zichtbaar. Zet er een paar aan bij Instellingen → Iconen.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
