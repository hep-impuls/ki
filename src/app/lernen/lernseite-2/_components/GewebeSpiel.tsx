"use client";

import { useEffect, useState } from "react";
import {
  leseSpurenIndices,
  loescheSpuren,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";

/**
 * GewebeSpiel — das Kopf-Muster des Hubs als kleines interaktives Spiel.
 *
 * Ein Band aus Punkten, im Zickzack zu einem Gewebe trianguliert. Punkte
 * lassen sich an- und wieder abwählen (Toggle); sind alle drei Ecken eines
 * Feldes aktiv, färbt sich das Feld — die Felder in unterschiedlichen
 * Theme-Farben (tertiary / primary / secondary, sanfte Deckkraft). So webt
 * man spielerisch sein eigenes Muster in den Titel der Seite.
 *
 * Das gewobene Muster BLEIBT: Jeder Punkt wird als Spur gemerkt
 * (_lib/spuren.ts — lokal, anonymer Zähler, Pro-Nutzer-Cloud-Spiegel) und
 * beim Wiederkommen wiederhergestellt, auch geräteübergreifend. Abwählen
 * löscht die einzelne Spur wieder. Nur Theme-Tokens, deterministische
 * Koordinaten.
 */

const VB_W = 720;

/** Zickzack-Band (Default, Hub): gerade Indizes unten, ungerade oben. */
const BAND: [number, number][] = [
  [26, 82],
  [80, 30],
  [148, 96],
  [212, 24],
  [278, 86],
  [342, 34],
  [408, 98],
  [472, 26],
  [536, 90],
  [600, 32],
  [660, 94],
  [700, 38],
];

/** Füllfarben der Felder, rotierend (Theme-Tokens). */
const FARBEN = ["fill-tertiary", "fill-primary", "fill-secondary"] as const;

export default function GewebeSpiel({
  className = "",
  spurKey = "lernseite-2:gewebe",
  punkte = BAND,
  hoehe = 132,
}: {
  className?: string;
  /** Spur-Präfix fürs Merken des Musters. */
  spurKey?: string;
  /** Punktfolge des Musters (Dreiecksstreifen i, i+1, i+2) — jede Seite
   *  kann ihre eigene Form tragen (Band, Fächer, …). */
  punkte?: [number, number][];
  /** viewBox-Höhe (Breite fix 720). */
  hoehe?: number;
}) {
  const PUNKTE = punkte;
  const [aktiv, setAktiv] = useState<Set<number>>(new Set());

  // Wiederherstellen: das Muster exakt aus dem Spuren-Bestand übernehmen
  // (beim Laden zuerst lokal, dann Cloud-Union via SPUR_EVENT). Exakt statt
  // Union, damit auch das Abwählen eines Punktes bestehen bleibt.
  useEffect(() => {
    function restore() {
      const idx = leseSpurenIndices(spurKey).filter((i) => i >= 0 && i < PUNKTE.length);
      setAktiv(new Set(idx));
    }
    restore();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [spurKey, PUNKTE.length]);

  function toggle(i: number) {
    setAktiv((prev) => {
      const nx = new Set(prev);
      if (nx.has(i)) nx.delete(i);
      else nx.add(i);
      return nx;
    });
    // Spur setzen bzw. gezielt wieder löschen (id-genau) — lokal + Cloud.
    if (aktiv.has(i)) loescheSpuren(`${spurKey}:${i}`);
    else merkeSpur(`${spurKey}:${i}`);
  }

  const n = PUNKTE.length;
  const started = aktiv.size > 0;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${VB_W} ${hoehe}`}
        className="block h-auto w-full select-none"
        role="group"
        aria-label="Gewebe-Spiel: Punkte antippen — zwischen aktiven Punkten färben sich die Felder."
      >
        {/* Felder: Dreiecksstreifen (i, i+1, i+2) — färben sich, wenn alle
            drei Ecken aktiv sind, jedes Feld in einer anderen Farbe */}
        {Array.from({ length: n - 2 }, (_, i) => {
          const gefuellt =
            aktiv.has(i) && aktiv.has(i + 1) && aktiv.has(i + 2);
          const [a, b, c] = [PUNKTE[i], PUNKTE[i + 1], PUNKTE[i + 2]];
          return (
            <polygon
              key={`f${i}`}
              points={`${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]}`}
              className={
                "pointer-events-none transition-opacity duration-500 " +
                FARBEN[i % FARBEN.length]
              }
              opacity={gefuellt ? 0.16 : 0}
            />
          );
        })}

        {/* Fäden */}
        {Array.from({ length: n - 1 }, (_, i) => (
          <line
            key={`z${i}`}
            x1={PUNKTE[i][0]}
            y1={PUNKTE[i][1]}
            x2={PUNKTE[i + 1][0]}
            y2={PUNKTE[i + 1][1]}
            strokeWidth="1"
            className="stroke-outline-variant"
          />
        ))}
        {Array.from({ length: n - 2 }, (_, i) => (
          <line
            key={`s${i}`}
            x1={PUNKTE[i][0]}
            y1={PUNKTE[i][1]}
            x2={PUNKTE[i + 2][0]}
            y2={PUNKTE[i + 2][1]}
            strokeWidth="0.8"
            className="stroke-outline-variant"
            opacity="0.6"
          />
        ))}

        {/* Punkte — antippen togglet */}
        {PUNKTE.map(([x, y], i) => {
          const an = aktiv.has(i);
          return (
            <g
              key={i}
              role="button"
              tabIndex={0}
              aria-pressed={an}
              aria-label={`Punkt ${i + 1} von ${n} ${an ? "abwählen" : "anwählen"}`}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(i);
                }
              }}
              className="group cursor-pointer outline-none"
            >
              <circle cx={x} cy={y} r="14" fill="transparent" />
              {!started && i === 0 && (
                <circle
                  cx={x}
                  cy={y}
                  r="10"
                  className="fill-tertiary opacity-30 animate-ping origin-center [transform-box:fill-box] motion-reduce:hidden"
                />
              )}
              {an && (
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="none"
                  strokeWidth="1"
                  className="stroke-tertiary"
                  opacity="0.5"
                />
              )}
              <circle
                cx={x}
                cy={y}
                r="4"
                className={
                  (an ? "fill-tertiary" : "fill-outline") +
                  " origin-center [transform-box:fill-box] transition-transform duration-300 group-hover:scale-125 group-focus-visible:scale-125"
                }
                opacity={an ? 1 : 0.6}
              />
            </g>
          );
        })}
      </svg>
      <p className="mt-xs text-label-sm text-on-surface-variant">
        Tippe die Punkte an — zwischen aktiven Punkten färben sich die Felder.
      </p>
    </div>
  );
}
