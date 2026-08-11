export const CURRENT_VERSION = "0.2.0";

export type ChangelogKind = "major" | "minor" | "patch";

export interface ChangelogEntry {
  version: string;
  date: string; // YYYY-MM-DD
  kind: ChangelogKind;
  summary: string[];
}

// Newest first. Bump CURRENT_VERSION and add an entry here on each release —
// not on every code change, only when a new zip actually goes out.
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "0.2.0",
    date: "2026-08-11",
    kind: "minor",
    summary: [
      "Inbox: ideeën/todo's/acties vastleggen met type, tags en project-koppeling (Postgres/Prisma)",
      "Activiteiten: routines met stappen, pictogrammen, sleep-volgorde en afvinken (dagelijks of eenmalig)",
      "Reminders: meldingen op een vast tijdstip (eenmalig/dagelijks/wekelijks)",
      "Instellingen: modules aan/uit zetten en herordenen op het hoofdscherm",
      "Hoofdscherm is nu een dashboard van de zichtbare modules",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-08-09",
    kind: "minor",
    summary: [
      "Huisstijl doorgevoerd: logo (header + footer), kleuren en typografie",
      "Licht/donker-thema met zon/maan-toggle",
      "Basis startpagina met de vier kernwaarden",
    ],
  },
];
