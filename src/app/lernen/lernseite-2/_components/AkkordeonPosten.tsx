"use client";

import { useEffect, useState } from "react";
import {
  leseSpurenIndices,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";
import { merkeInhalt } from "../_lib/inhalte";
import { GlossarText } from "./Glossar";

/**
 * AkkordeonPosten — ein einfacher Aktivitätsposten: eine Liste von Punkten,
 * die als Akkordeon aufklappen. Das erste Öffnen eines Punkts wird als Spur
 * registriert (fliesst ins Aktivitätsnetz / Orakel). Ohne Muster, ohne
 * Kapitel — für erklärende Abschnitte (z.B. «Was ist Philosophie?»).
 * Nur Theme-Tokens und Material Symbols.
 */

export interface AkkordeonPunkt {
  titel: string;
  text: string;
}

export default function AkkordeonPosten({
  punkte,
  spurKey,
  begriff = "Punkte",
  ariaLabel = "Aufklappbare Punkte",
  className = "",
  glossar = false,
}: {
  punkte: AkkordeonPunkt[];
  /** Spur-Präfix, z.B. "philosophische-perspektive:einstieg". */
  spurKey: string;
  /** Wort für die Zählung, z.B. "Fragen" oder "Aspekte". */
  begriff?: string;
  ariaLabel?: string;
  className?: string;
  /** true → Punkt-Text läuft durch GlossarText (Hover-Erklärungen für
   *  bekannte Fachbegriffe). */
  glossar?: boolean;
}) {
  const [offen, setOffen] = useState<Set<number>>(new Set());
  const [gelesen, setGelesen] = useState<Set<number>>(new Set());
  const gesamt = punkte.length;

  useEffect(() => {
    function restore() {
      const idx = leseSpurenIndices(spurKey).filter((i) => i >= 0 && i < gesamt);
      if (idx.length === 0) return;
      setGelesen((prev) => {
        const nx = new Set(prev);
        idx.forEach((i) => nx.add(i));
        return nx;
      });
    }
    restore();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [spurKey, gesamt]);

  // Alle Titel registrieren (auch ungeöffnete) — für die Sternenkarte im Orakel.
  useEffect(() => {
    punkte.forEach((p, i) => merkeInhalt(`${spurKey}:${i}`, p.titel));
  }, [punkte, spurKey]);

  function toggle(i: number) {
    setOffen((prev) => {
      const nx = new Set(prev);
      if (nx.has(i)) nx.delete(i);
      else nx.add(i);
      return nx;
    });
    if (!gelesen.has(i)) {
      setGelesen((prev) => new Set(prev).add(i));
      merkeSpur(`${spurKey}:${i}`);
    }
  }

  return (
    <section aria-label={ariaLabel} className={className}>
      <div className="mb-sm flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px] text-tertiary">
          {gelesen.size === gesamt ? "done_all" : "unfold_more"}
        </span>
        {gelesen.size === 0
          ? `${gesamt} ${begriff}, tippe sie auf`
          : `${gelesen.size} von ${gesamt} ${begriff} geöffnet`}
      </div>

      <ul className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-bright divide-y divide-outline-variant">
        {punkte.map((p, i) => {
          const auf = offen.has(i);
          const schonGelesen = gelesen.has(i);
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={auf}
                className="flex w-full items-center gap-sm px-md py-sm text-left outline-none transition-colors hover:bg-surface-container focus-visible:bg-surface-container sm:px-lg"
              >
                <span
                  className={
                    "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border " +
                    (schonGelesen
                      ? "border-tertiary bg-tertiary text-on-tertiary"
                      : "border-outline-variant text-on-surface-variant")
                  }
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {schonGelesen ? "check" : "add"}
                  </span>
                </span>
                <span className="min-w-0 flex-1 text-body-lg font-medium text-on-surface">
                  {p.titel}
                </span>
                <span
                  className={
                    "material-symbols-outlined flex-shrink-0 text-[22px] text-on-surface-variant transition-transform duration-300 " +
                    (auf ? "rotate-180" : "")
                  }
                >
                  expand_more
                </span>
              </button>
              {auf && (
                <div className="animate-frame-in px-md pb-md pl-[3rem] sm:px-lg sm:pl-[3.5rem]">
                  <p className="text-body-md leading-relaxed text-on-surface-variant">
                    {glossar ? <GlossarText text={p.text} /> : p.text}
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
