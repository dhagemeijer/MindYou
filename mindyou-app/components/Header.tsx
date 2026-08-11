"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, Settings } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const pathname = usePathname();
  const router = useRouter();

  const isDark = mounted && resolvedTheme === "dark";
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/80 backdrop-blur-md dark:border-cream/10 dark:bg-ink/80">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 sm:px-6">
        {!isHome && (
          <button
            onClick={() => router.back()}
            aria-label="Terug"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink dark:text-cream/60 dark:hover:bg-cream/10 dark:hover:text-cream"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
        )}

        <a href="/" className="flex flex-1 items-center justify-center sm:flex-none sm:justify-start" aria-label="MindYou — home">
          {mounted ? (
            <Image
              src={isDark ? "/logo/wordmark-dark-transparent.png" : "/logo/wordmark-light-transparent.png"}
              alt="MindYou. Connect your thoughts."
              width={1265}
              height={361}
              priority
              className="h-10 w-auto sm:h-16 lg:h-20"
            />
          ) : (
            <span className="h-10 w-[157px] sm:h-16 sm:w-[251px] lg:h-20 lg:w-[314px]" aria-hidden />
          )}
        </a>

        <nav className="hidden flex-1 items-center justify-center gap-7 font-sans text-sm text-ink/70 dark:text-cream/70 sm:flex">
          <a href="/inbox" className="transition-colors hover:text-gold">Drop it!</a>
          <a href="/projecten" className="transition-colors hover:text-gold">Projecten</a>
          <a href="/brainstorm" className="transition-colors hover:text-gold">Brainstorm</a>
          <a href="/activiteiten" className="transition-colors hover:text-gold">Activiteiten</a>
          <a href="/reminders" className="transition-colors hover:text-gold">Reminders</a>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5">
          <a
            href="/instellingen"
            aria-label="Instellingen"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink dark:text-cream/60 dark:hover:bg-cream/10 dark:hover:text-cream"
          >
            <Settings className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
