"use client";

import { usePathname } from "next/navigation";
import { Home as HomeIcon, Inbox, ListChecks, Bell, Settings } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/inbox", label: "Drop it!", icon: Inbox },
  { href: "/activiteiten", label: "Activiteiten", icon: ListChecks },
  { href: "/reminders", label: "Reminders", icon: Bell },
  { href: "/instellingen", label: "Instellingen", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-ink/8 bg-cream/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] dark:border-cream/10 dark:bg-ink/95 sm:hidden"
      aria-label="Hoofdnavigatie"
    >
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <a
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
            aria-current={active ? "page" : undefined}
          >
            <Icon
              className={`h-5 w-5 ${active ? "text-gold" : "text-ink/45 dark:text-cream/45"}`}
              strokeWidth={active ? 2.25 : 1.75}
            />
            <span
              className={`font-sans text-[10px] ${
                active ? "font-medium text-gold" : "text-ink/45 dark:text-cream/45"
              }`}
            >
              {label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
