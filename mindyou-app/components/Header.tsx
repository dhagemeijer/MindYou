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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center" aria-label="MindYou — home">
          {mounted ? (
            <Image
              src={isDark ? "/logo/wordmark-dark.png" : "/logo/wordmark-light.png"}
              alt="MindYou. Connect your thoughts."
              width={172}
              height={91}
              priority
              className="h-9 w-auto"
            />
          ) : (
            <span className="h-9 w-[172px]" aria-hidden />
          )}
        </a>

        <nav className="hidden items-center gap-8 font-sans text-sm text-ink/70 dark:text-cream/70 sm:flex">
          <a href="#" className="transition-colors hover:text-gold">Inbox</a>
          <a href="#" className="transition-colors hover:text-gold">Projecten</a>
          <a href="#" className="transition-colors hover:text-gold">Brainstorm</a>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
