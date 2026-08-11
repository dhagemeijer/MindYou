"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { CHANGELOG, type ChangelogKind } from "@/lib/version";

const KIND_LABEL: Record<ChangelogKind, string> = {
  major: "Major",
  minor: "Functionaliteit",
  patch: "Bugfix",
};

export function ChangelogModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="changelog-title"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-cream p-6 shadow-2xl dark:bg-slate sm:rounded-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="changelog-title" className="font-display text-xl font-medium text-ink dark:text-cream">
            Changelog
          </h2>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="rounded-full p-1.5 text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink dark:text-cream/50 dark:hover:bg-cream/10 dark:hover:text-cream"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ul className="flex flex-col gap-5">
          {CHANGELOG.map((entry) => (
            <li key={entry.version} className="border-l-2 border-gold/60 pl-4">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-base font-semibold text-ink dark:text-cream">
                  v{entry.version}
                </span>
                <span className="font-sans text-xs uppercase tracking-wide text-gold">
                  {KIND_LABEL[entry.kind]}
                </span>
                <span className="ml-auto font-sans text-xs text-ink/40 dark:text-cream/40">
                  {entry.date}
                </span>
              </div>
              <ul className="mt-2 flex flex-col gap-1">
                {entry.summary.map((line) => (
                  <li key={line} className="font-sans text-sm text-ink/70 dark:text-cream/70">
                    {line}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
