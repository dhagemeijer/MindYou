"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/80 backdrop-blur-md dark:border-cream/10 dark:bg-ink/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2">
        <a href="/" className="flex items-center" aria-label="MindYou — home">
          {mounted ? (
            <Image
              src={isDark ? "/logo/wordmark-dark-transparent.png" : "/logo/wordmark-light-transparent.png"}
              alt="MindYou. Connect your thoughts."
              width={1265}
              height={361}
              priority
              className="h-16 w-auto sm:h-20"
            />
          ) : (
            <span className="h-16 w-[251px] sm:h-20 sm:w-[314px]" aria-hidden />
          )}
        </a>

        <nav className="hidden items-center gap-7 font-sans text-sm text-ink/70 dark:text-cream/70 sm:flex">
          <a href="/inbox" className="transition-colors hover:text-gold">Inbox</a>
          <a href="/projecten" className="transition-colors hover:text-gold">Projecten</a>
          <a href="/brainstorm" className="transition-colors hover:text-gold">Brainstorm</a>
          <a href="/activiteiten" className="transition-colors hover:text-gold">Activiteiten</a>
          <a href="/reminders" className="transition-colors hover:text-gold">Reminders</a>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
