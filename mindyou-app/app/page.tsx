import { Inbox, Network, Target, CheckCircle2 } from "lucide-react";

const pillars = [
  {
    icon: Inbox,
    title: "Capture anything",
    body: "Ideeën, taken, notities en meer.",
  },
  {
    icon: Network,
    title: "Connect everything",
    body: "Verbind gedachten, projecten en taken.",
  },
  {
    icon: Target,
    title: "Focus on what matters",
    body: "Duidelijkheid in wat belangrijk is.",
  },
  {
    icon: CheckCircle2,
    title: "Turn thoughts into action",
    body: "Van inspiratie naar resultaat.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <section className="flex flex-col items-center gap-6 py-24 text-center sm:py-32">
        <p className="font-sans text-sm uppercase tracking-[0.2em] text-gold">
          Connect your thoughts.
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-medium leading-tight sm:text-6xl">
          Alles wat in je hoofd zit,
          <br /> eindelijk op één plek.
        </h1>
        <p className="max-w-xl font-sans text-base text-ink/60 dark:text-cream/60 sm:text-lg">
          MindYou verbindt je ideeën, taken en actielijsten — van vrije
          brainstorm tot afgeronde actie.
        </p>
        <button className="mt-2 rounded-full bg-ink px-7 py-3 font-sans text-sm font-medium text-cream transition-opacity hover:opacity-90 dark:bg-gold dark:text-ink">
          Begin met MindYou
        </button>
      </section>

      <section className="grid grid-cols-1 gap-8 border-t border-ink/5 py-16 dark:border-cream/10 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex flex-col items-start gap-3">
            <Icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
            <h3 className="font-sans text-sm font-semibold">{title}</h3>
            <p className="font-sans text-sm text-ink/55 dark:text-cream/55">
              {body}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
