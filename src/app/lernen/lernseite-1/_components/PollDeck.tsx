"use client";

import PollFrage, { type PollFrageSpec } from "./PollFrage";

/**
 * PollDeck — mehrere PollFragen nacheinander (Handoff v2 §5.7, §7.1/§7.3).
 *
 * Im Auftakt das "Stimmungsbild" (3 Stance-Polls), im Abschluss dieselben
 * Fragen mit Pre/Post-Vergleich (`vorherId` je Frage). Jede Frage zeigt den
 * eigenen Drei-Ebenen-Spiegel (Ich / Klasse / alle).
 */

export interface PollDeckSpec {
  titel: string;
  intro?: string;
  fragen: PollFrageSpec[];
}

export default function PollDeck({
  spec,
  /** Map fragen[i].id → Pre-Frage-ID (nur Abschluss). */
  vorher,
}: {
  spec: PollDeckSpec;
  vorher?: Record<string, string>;
}) {
  return (
    <section className="flex flex-col gap-md">
      <div>
        <h2 className="flex items-center gap-sm text-headline-sm text-on-surface">
          <span className="material-symbols-outlined text-[22px] text-primary">poll</span>
          {spec.titel}
        </h2>
        {spec.intro && (
          <p className="mt-xs text-body-md text-on-surface-variant">{spec.intro}</p>
        )}
      </div>

      {spec.fragen.map((f) => (
        <PollFrage key={f.id} spec={f} vorherId={vorher?.[f.id]} />
      ))}
    </section>
  );
}
