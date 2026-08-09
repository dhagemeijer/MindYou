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
    return <div className="h-9 w-16 rounded-full bg-slate/10 dark:bg-cream/10" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Schakel naar lichte modus" : "Schakel naar donkere modus"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative h-9 w-16 rounded-full border border-ink/10 bg-ink/5 dark:border-cream/15 dark:bg-cream/10 transition-colors"
    >
      <span
        className={`absolute top-1 left-1 flex h-7 w-7 items-center justify-center rounded-full bg-cream dark:bg-ink shadow-sm transition-transform duration-300 ease-out ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-gold" strokeWidth={1.75} />
        ) : (
          <Sun className="h-4 w-4 text-gold" strokeWidth={1.75} />
        )}
      </span>
    </button>
  );
}
