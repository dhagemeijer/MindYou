import { Lightbulb } from "lucide-react";

export default function BrainstormPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-6 py-24 text-center">
      <Lightbulb className="h-8 w-8 text-gold" strokeWidth={1.5} />
      <h1 className="font-display text-2xl font-medium text-ink dark:text-cream">Brainstorm</h1>
      <p className="font-sans text-sm text-ink/55 dark:text-cream/55">
        Vrij canvas met promoveren naar ideeën/todo's/acties — nog te bouwen.
      </p>
    </div>
  );
}
