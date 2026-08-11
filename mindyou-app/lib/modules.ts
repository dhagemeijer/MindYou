import { Inbox, FolderKanban, Lightbulb, ListChecks, type LucideIcon } from "lucide-react";

export interface ModuleDef {
  key: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

// De vaste lijst van app-onderdelen. ModuleSetting in de database bepaalt
// per key of hij zichtbaar is en in welke volgorde hij op het hoofdscherm staat.
export const MODULES: ModuleDef[] = [
  {
    key: "inbox",
    label: "Inbox",
    description: "Vang ideeën, todo's en acties op.",
    href: "/inbox",
    icon: Inbox,
  },
  {
    key: "projecten",
    label: "Projecten",
    description: "Alles gegroepeerd per project.",
    href: "/projecten",
    icon: FolderKanban,
  },
  {
    key: "brainstorm",
    label: "Brainstorm",
    description: "Vrij denken, later ordenen.",
    href: "/brainstorm",
    icon: Lightbulb,
  },
  {
    key: "activiteiten",
    label: "Activiteiten",
    description: "Routines met stappen en pictogrammen.",
    href: "/activiteiten",
    icon: ListChecks,
  },
];

export function getModuleDef(key: string): ModuleDef | undefined {
  return MODULES.find((m) => m.key === key);
}
