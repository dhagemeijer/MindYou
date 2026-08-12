export const CURRENT_VERSION = "0.5.1";

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
    version: "0.5.1",
    date: "2026-08-11",
    kind: "patch",
    summary: [
      "Iconenweergave in het uitvoerscherm: pictogrammen staan nu onder elkaar (1 kolom), groter en gecentreerd (~80% breed) in plaats van een rooster",
    ],
  },
  {
    version: "0.5.0",
    date: "2026-08-11",
    kind: "minor",
    summary: [
      "Activiteiten-uitvoerscherm heeft nu een tweede weergave: schakel tussen de tekst-lijst en een pure iconenweergave",
      "Je gekozen weergave wordt onthouden",
    ],
  },
  {
    version: "0.4.1",
    date: "2026-08-11",
    kind: "patch",
    summary: [
      "Bugfix: activiteiten openen/bewerken gaf een crash door een verkeerd geplaatste React-hook — verholpen",
      "Drop it!-items hebben nu ook een bewerk-knop (potloodje), net als de andere onderdelen",
    ],
  },
  {
    version: "0.4.0",
    date: "2026-08-11",
    kind: "minor",
    summary: [
      "Drop it! — Inbox heeft een nieuwe naam, overal in de app",
      "Brainstorm is nu een echte radiale mindmap: centraal onderwerp met takken, knooppunten promoveren naar Drop it!",
      "Activiteiten: afgevinkte stappen zakken naar onderen, en het scherm scrollt vanzelf naar boven zodra alles klaar is",
      "Activiteiten resetten: 3 knoppen per routine (reset, bewerken, verwijderen), plus 'Opnieuw beginnen' in de felicitatie-melding",
      "Reminders: echte achtergrond-pushmeldingen (ook als de app dicht is), plus een bewerk-knop per reminder",
      "iOS-opstartscherm gebruikt nu het originele lichte monogram, geen zelfgemaakte compositie meer",
    ],
  },
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
