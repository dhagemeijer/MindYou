export const CURRENT_VERSION = "0.3.0";

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
    version: "0.3.0",
    date: "2026-08-11",
    kind: "minor",
    summary: [
      "Navigatie: terug-knop en instellingen-icoon in de header, vaste onderin-navigatie op mobiel (Home, Inbox, Activiteiten, Reminders, Instellingen)",
      "Activiteiten: hoofdscherm toont alleen je routines met een + om nieuwe aan te maken; een routine openen geeft een rustig, full-screen uitvoerscherm met grote stappen",
      "Subtiele, rustige melding zodra alle stappen van een routine zijn afgevinkt",
      "Instellingen → Iconen: pictogrammen aan/uit zetten voor de activiteiten-kiezer, inclusief nieuwe iconen (schooltas, makeup, telefoon) en een uitbreidbare pool",
      "Dark-mode monogram in de footer niet langer afgesneden door de cirkel",
    ],
  },
  {
    version: "0.2.1",
    date: "2026-08-11",
    kind: "patch",
    summary: [
      "iOS-appicoon (opstartscherm) heeft nu een crème achtergrond i.p.v. donker, zodat hij niet meer als een zwarte cirkel op het witte scherm opvalt",
    ],
  },
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
