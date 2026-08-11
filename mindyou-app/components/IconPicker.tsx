"use client";

import { useState } from "react";
import { ICON_OPTIONS, getIcon } from "@/lib/icons";

export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const SelectedIcon = getIcon(value);

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
          <div className="absolute left-0 top-12 z-40 grid w-64 grid-cols-5 gap-1 rounded-xl border border-ink/10 bg-cream p-3 shadow-xl dark:border-cream/15 dark:bg-slate">
            {ICON_OPTIONS.map(({ key, label, icon: Icon }) => (
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
          </div>
        </>
      )}
    </div>
  );
}
