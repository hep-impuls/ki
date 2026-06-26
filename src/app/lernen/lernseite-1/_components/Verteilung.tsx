"use client";

import { totalVotes, type PollCounts } from "@/lib/polls";

/**
 * Verteilung — generische Balken-Verteilung (Handoff v2 §8, Refactor aus
 * KollektivSpiegel).
 *
 * Zeigt für eine beliebige Options-Liste den Anteil je Bucket. Optional wird
 * der eigene Pick (`meinPick`) markiert. Reine CSS/Divs mit MD3-Tokens, keine
 * Chart-Library. Bei n < 5 ein dezenter "wenige Daten"-Hinweis.
 *
 * Die 1..7-Skala (KollektivSpiegel) ist nur ein Spezialfall mit 7 Optionen.
 */

export interface VerteilungOption {
  id: string;
  label: string;
}

interface VerteilungProps {
  counts: PollCounts;
  optionen: VerteilungOption[];
  /** Tailwind-Bg-Token für den Balken, z.B. "bg-primary" / "bg-tertiary". */
  farbe: string;
  /** Options-ID meiner eigenen Stimme — wird markiert. */
  meinPick?: string;
  /** Achsen-Beschriftung unter den Balken (optional, für Skalen-Optik). */
  achse?: { links: string; rechts: string };
}

export default function Verteilung({ counts, optionen, farbe, meinPick, achse }: VerteilungProps) {
  const total = totalVotes(counts);
  return (
    <div className="flex flex-col gap-xs">
      {optionen.map((o) => {
        const wert = Number(counts[o.id] ?? 0);
        const pct = total > 0 ? Math.round((wert / total) * 100) : 0;
        const istMeiner = meinPick === o.id;
        return (
          <div key={o.id} className="flex items-center gap-sm">
            <span
              className={
                istMeiner
                  ? "flex w-40 shrink-0 items-center gap-xs text-label-sm font-semibold text-on-surface"
                  : "w-40 shrink-0 text-label-sm text-on-surface-variant"
              }
            >
              {istMeiner && (
                <span className="material-symbols-outlined text-[16px] text-primary">person</span>
              )}
              {o.label}
            </span>
            <div className="h-5 flex-1 overflow-hidden rounded-md bg-surface-container">
              <div className={`h-full rounded-md ${farbe}`} style={{ width: `${pct}%` }} aria-hidden />
            </div>
            <span className="w-16 shrink-0 text-right text-label-sm text-on-surface-variant">
              {pct}% ({wert})
            </span>
          </div>
        );
      })}

      {achse && (
        <div className="mt-xs flex justify-between text-label-sm text-on-surface-variant">
          <span>{achse.links}</span>
          <span>{achse.rechts}</span>
        </div>
      )}

      {total < 5 && (
        <p className="mt-xs inline-flex items-center gap-xs text-label-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-tertiary">info</span>
          Noch wenige Daten (n = {total}).
        </p>
      )}
    </div>
  );
}
