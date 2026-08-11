"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch: theme is only known client-side.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-10 w-[72px] rounded-full bg-ink/10 dark:bg-cream/10" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Schakel naar lichte modus" : "Schakel naar donkere modus"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative h-10 w-[72px] rounded-full border-2 border-ink/25 bg-ink/10 shadow-md transition-colors dark:border-cream/30 dark:bg-cream/[0.14]"
    >
      {/* static icons in the track, so the "off" side stays legible too */}
      <Sun
        className={`absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transition-opacity ${
          isDark ? "opacity-30 text-cream" : "opacity-0"
        }`}
        strokeWidth={2}
      />
      <Moon
        className={`absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 transition-opacity ${
          isDark ? "opacity-0" : "opacity-30 text-ink"
        }`}
        strokeWidth={2}
      />

      <span
        className={`absolute top-1 left-1 flex h-7 w-7 items-center justify-center rounded-full bg-gold shadow-lg ring-2 ring-cream/40 dark:ring-ink/20 transition-transform duration-300 ease-out ${
          isDark ? "translate-x-9" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-ink" strokeWidth={2.25} />
        ) : (
          <Sun className="h-4 w-4 text-ink" strokeWidth={2.25} />
        )}
      </span>
    </button>
  );
}
