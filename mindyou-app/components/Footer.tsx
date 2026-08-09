"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function Footer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <footer className="border-t border-ink/5 dark:border-cream/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-12 text-center">
        {mounted && (
          <Image
            src={isDark ? "/logo/mark-dark.png" : "/logo/mark-light.png"}
            alt="MindYou monogram"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full"
          />
        )}
        <p className="font-sans text-xs tracking-wide text-ink/50 dark:text-cream/50">
          MindYou. — Connect your thoughts.
        </p>
        <p className="font-sans text-xs text-ink/35 dark:text-cream/35">
          © {new Date().getFullYear()} MindYou
        </p>
      </div>
    </footer>
  );
}
