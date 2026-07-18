"use client";

import { useEffect, useState } from "react";
import { GEWICHT_EVENT, leseGewichtungen, setzeGewichtung } from "../_lib/gewichtung";

/**
 * GewichtungWahl — ein kleiner Drei-Stufen-Schalter, mit dem eine einzelne
 * Beschreibung gewichtet wird (z.B. Gestalt: unkenntlich/verschwommen/deutlich
 * oder Achtsamkeit: wenig/mittel/viel). Speichert lokal via `gewichtung.ts` und
 * reagiert live auf Änderungen. Nur Theme-Tokens.
 */
export default function GewichtungWahl({
  prefix,
  index,
  frage,
  stufen,
  className = "",
}: {
  prefix: string;
  index: number;
  /** Kurze Frage/Beschriftung vor dem Schalter. */
  frage: string;
  /** Genau drei Stufenbezeichnungen, aufsteigend (schwach → stark). */
  stufen: [string, string, string];
  className?: string;
}) {
  const [stufe, setStufe] = useState<number | null>(null);

  useEffect(() => {
    function load() {
      const m = leseGewichtungen(prefix);
      setStufe(index in m ? m[index] : null);
    }
    load();
    window.addEventListener(GEWICHT_EVENT, load);
    return () => window.removeEventListener(GEWICHT_EVENT, load);
  }, [prefix, index]);

  function waehle(s: number) {
    const neu = stufe === s ? null : s;
    setzeGewichtung(prefix, index, neu);
    setStufe(neu);
  }

  return (
    <div className={"flex flex-wrap items-center gap-sm " + className}>
      <span className="flex items-center gap-xs text-label-sm text-on-surface-variant">
        <span className="material-symbols-outlined text-[16px] text-tertiary">tune</span>
        {frage}
      </span>
      <div
        role="group"
        aria-label={frage}
        className="inline-flex overflow-hidden rounded-lg border border-outline-variant"
      >
        {stufen.map((st, i) => (
          <button
            key={i}
            type="button"
            onClick={() => waehle(i)}
            aria-pressed={stufe === i}
            className={
              "px-sm py-xs text-label-sm transition-colors " +
              (stufe === i
                ? "bg-tertiary text-on-tertiary"
                : "bg-surface-bright text-on-surface-variant hover:bg-surface-container hover:text-on-surface") +
              (i > 0 ? " border-l border-outline-variant" : "")
            }
          >
            {st}
          </button>
        ))}
      </div>
    </div>
  );
}
