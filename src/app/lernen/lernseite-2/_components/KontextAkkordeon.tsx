"use client";

import { useEffect, useMemo, useState } from "react";
import {
  leseSpurenIndices,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";
import { GEWICHT_EVENT, leseGewichtungen } from "../_lib/gewichtung";
import GewichtungWahl from "./GewichtungWahl";

/** Warme Skala für das Achtsamkeits-Muster: mehr Achtsamkeit → farbiger,
 *  rötlicher. Bewusste Ausnahme von der reinen Token-Palette (wie die
 *  leuchtenden Perlenfarben), weil die Farbe hier die Bedeutung trägt. */
const ACHTSAMKEIT_FARBEN = ["#ded9cc", "#e7c489", "#e58a3c", "#d13417"] as const;
// Index: 0 = nicht bewertet/wenig-Grundton … hier separat gehandhabt.

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
  gewichtung,
  className = "",
}: {
  kapitel: KontextKapitel[];
  /** Spur-Präfix, z.B. "vorhang-auf:kontext". */
  spurKey: string;
  /** Optional: pro Aspekt eine Drei-Stufen-Achtsamkeits-Gewichtung; sie färbt
   *  das Kontext-Muster (mehr Achtsamkeit → farbiger, rötlicher). */
  gewichtung?: { prefix: string; frage: string; stufen: [string, string, string] };
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
  const [gewichtungen, setGewichtungen] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!gewichtung) return;
    const lade = () => setGewichtungen(leseGewichtungen(gewichtung.prefix));
    lade();
    window.addEventListener(GEWICHT_EVENT, lade);
    return () => window.removeEventListener(GEWICHT_EVENT, lade);
  }, [gewichtung]);

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

      {/* Achtsamkeits-Muster — je mehr Aspekte hoch gewichtet sind, desto
          farbiger und rötlicher wird der Ring. */}
      {gewichtung && (
        <div className="mb-lg flex flex-col items-center gap-sm rounded-2xl border border-outline-variant bg-surface-container-low p-md sm:flex-row sm:gap-lg sm:p-lg">
          <svg
            viewBox="0 0 220 220"
            className="h-40 w-40 flex-shrink-0"
            role="img"
            aria-label="Achtsamkeits-Muster: jeder Ringabschnitt steht für einen Aspekt; mehr Achtsamkeit färbt ihn rötlicher."
          >
            {flach.map((_, gi) => {
              const step = 360 / gesamt;
              const luecke = 2.2;
              const a0 = gi * step - 90 + luecke / 2;
              const a1 = (gi + 1) * step - 90 - luecke / 2;
              const ri = 42;
              const ro = 100;
              const rad = (d: number) => (d * Math.PI) / 180;
              const px = (r: number, d: number) => 110 + r * Math.cos(rad(d));
              const py = (r: number, d: number) => 110 + r * Math.sin(rad(d));
              const d = [
                `M ${px(ri, a0)} ${py(ri, a0)}`,
                `L ${px(ro, a0)} ${py(ro, a0)}`,
                `A ${ro} ${ro} 0 0 1 ${px(ro, a1)} ${py(ro, a1)}`,
                `L ${px(ri, a1)} ${py(ri, a1)}`,
                `A ${ri} ${ri} 0 0 0 ${px(ri, a0)} ${py(ri, a0)}`,
                "Z",
              ].join(" ");
              const s = gewichtungen[gi];
              const farbe = ACHTSAMKEIT_FARBEN[s == null ? 0 : s + 1];
              return (
                <path
                  key={gi}
                  d={d}
                  fill={farbe}
                  className="stroke-surface-container-low transition-[fill] duration-500"
                  strokeWidth={1.5}
                />
              );
            })}
          </svg>
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-body-md font-medium text-on-surface">
              Dein Achtsamkeits-Muster
            </p>
            <p className="mt-xs text-body-sm text-on-surface-variant">
              Jeder Abschnitt steht für einen Aspekt (im Uhrzeigersinn, Kapitel
              für Kapitel). Je mehr Achtsamkeit du ihm gibst, desto farbiger und
              rötlicher wird er.
            </p>
            <div className="mt-sm flex flex-wrap items-center justify-center gap-md sm:justify-start">
              {[
                ["nicht bewertet", ACHTSAMKEIT_FARBEN[0]],
                ["wenig", ACHTSAMKEIT_FARBEN[1]],
                ["mittel", ACHTSAMKEIT_FARBEN[2]],
                ["viel", ACHTSAMKEIT_FARBEN[3]],
              ].map(([label, farbe]) => (
                <span key={label} className="flex items-center gap-xs text-label-sm text-on-surface-variant">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: farbe as string }}
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

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
                        {gewichtung && (
                          <GewichtungWahl
                            className="mt-sm"
                            prefix={gewichtung.prefix}
                            index={gi}
                            frage={gewichtung.frage}
                            stufen={gewichtung.stufen}
                          />
                        )}
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
