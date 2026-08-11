"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { CURRENT_VERSION } from "@/lib/version";
import { ChangelogModal } from "./ChangelogModal";

export function Footer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <footer className="hidden border-t border-ink/5 dark:border-cream/10 sm:block">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-12 text-center">
        {mounted && (
          <Image
            src={isDark ? "/logo/mark-dark-square.png" : "/logo/mark-light.png"}
            alt="MindYou monogram"
            width={512}
            height={512}
            className="h-11 w-11 rounded-full"
          />
        )}
        <p className="font-sans text-xs tracking-wide text-ink/50 dark:text-cream/50">
          MindYou. — Connect your thoughts.
        </p>
        <div className="flex items-center gap-3 font-sans text-xs text-ink/35 dark:text-cream/35">
          <span>© {new Date().getFullYear()} MindYou</span>
          <span aria-hidden>·</span>
          <button
            onClick={() => setChangelogOpen(true)}
            className="underline decoration-dotted underline-offset-2 transition-colors hover:text-gold"
          >
            v{CURRENT_VERSION}
          </button>
        </div>
      </div>

      {changelogOpen && <ChangelogModal onClose={() => setChangelogOpen(false)} />}
    </footer>
  );
}
