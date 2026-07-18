"use client";

import { useEffect, useMemo, useState } from "react";
import {
  leseSpurenIndices,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";

/**
 * KontextAkkordeon — «Die KI im Kontext». Vier Kontext-Kapitel (technologisch,
 * wirtschaftlich, rechtlich/politisch, kulturell); unter jedem Kapitel klappen
 * die einzelnen Aspekte als Akkordeon auf. Das erste Öffnen eines Aspekts wird
 * als Spur registriert (fliesst ins Aktivitätsnetz / Orakel). Nur Theme-Tokens
 * und Material Symbols.
 */

export interface KontextPunkt {
  titel: string;
  text: string;
}

export interface KontextKapitel {
  /** Material-Symbols-Name. */
  icon: string;
  titel: string;
  intro: string;
  punkte: KontextPunkt[];
}

export default function KontextAkkordeon({
  kapitel,
  spurKey,
  className = "",
}: {
  kapitel: KontextKapitel[];
  /** Spur-Präfix, z.B. "vorhang-auf:kontext". */
  spurKey: string;
  className?: string;
}) {
  // Flache, stabile globale Indizes (Kapitel- dann Punkt-Reihenfolge).
  const flach = useMemo(() => {
    const out: { ki: number; pi: number }[] = [];
    kapitel.forEach((k, ki) => k.punkte.forEach((_, pi) => out.push({ ki, pi })));
    return out;
  }, [kapitel]);
  const gesamt = flach.length;
  const indexVon = (ki: number, pi: number) =>
    flach.findIndex((f) => f.ki === ki && f.pi === pi);

  const [offen, setOffen] = useState<Set<number>>(new Set());
  const [gelesen, setGelesen] = useState<Set<number>>(new Set());

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

  function toggle(gi: number) {
    setOffen((prev) => {
      const nx = new Set(prev);
      if (nx.has(gi)) nx.delete(gi);
      else nx.add(gi);
      return nx;
    });
    if (!gelesen.has(gi)) {
      setGelesen((prev) => new Set(prev).add(gi));
      merkeSpur(`${spurKey}:${gi}`);
    }
  }

  return (
    <section aria-label="Die KI im Kontext" className={className}>
      <div className="mb-md flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px] text-tertiary">
          {gelesen.size === gesamt ? "done_all" : "unfold_more"}
        </span>
        {gelesen.size === 0
          ? `${gesamt} Aspekte in vier Kontexten — tippe sie auf`
          : `${gelesen.size} von ${gesamt} Aspekten geöffnet`}
      </div>

      <div className="space-y-lg">
        {kapitel.map((k, ki) => (
          <div
            key={ki}
            className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-bright"
          >
            {/* Kapitel-Kopf */}
            <div className="flex items-start gap-md border-b border-outline-variant bg-surface-container-low p-md sm:p-lg">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container">
                <span className="material-symbols-outlined text-[22px]">{k.icon}</span>
              </span>
              <div className="min-w-0">
                <h3 className="text-headline-sm text-on-surface">{k.titel}</h3>
                <p className="mt-xs text-body-md text-on-surface-variant">{k.intro}</p>
              </div>
            </div>

            {/* Aspekte als Akkordeon */}
            <ul className="divide-y divide-outline-variant">
              {k.punkte.map((p, pi) => {
                const gi = indexVon(ki, pi);
                const auf = offen.has(gi);
                const schonGelesen = gelesen.has(gi);
                return (
                  <li key={pi}>
                    <button
                      type="button"
                      onClick={() => toggle(gi)}
                      aria-expanded={auf}
                      className="flex w-full items-center gap-sm px-md py-sm text-left outline-none transition-colors hover:bg-surface-container focus-visible:bg-surface-container sm:px-lg"
                    >
                      <span
                        className={
                          "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-[15px] " +
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
                          {p.text}
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
