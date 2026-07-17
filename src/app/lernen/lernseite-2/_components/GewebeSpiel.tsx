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
 * GewebeSpiel — das Kopf-Muster einer Seite als kleines interaktives Spiel.
 *
 * Punkte lassen sich an- und wieder abwählen (Toggle); sind alle Ecken eines
 * Feldes aktiv, färbt sich das Feld — die Felder in unterschiedlichen
 * Theme-Farben (tertiary / primary / secondary, sanfte Deckkraft). So webt
 * man spielerisch sein eigenes Muster in den Kopf der Seite.
 *
 * Die Form ist frei: `punkte` + optional `kanten`/`felder` beschreiben die
 * Topologie. Ohne `kanten`/`felder` gilt der Dreiecksstreifen des Zickzack-
 * Bandes (Hub): Kanten (i,i+1) und (i,i+2), Felder (i,i+1,i+2). Die Seite
 * «Vorhang auf» nutzt die Stern-Konstellation ihrer Signatur (Zentrum mit
 * Strahlen), gross nachgebaut.
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
  kanten,
  kantenFein,
  felder,
  akzent,
  hoehe = 132,
}: {
  className?: string;
  /** Spur-Präfix fürs Merken des Musters. */
  spurKey?: string;
  /** Punkte des Musters. */
  punkte?: [number, number][];
  /** Kanten als Index-Paare. Default: Zickzack-Streifen (i,i+1) + (i,i+2). */
  kanten?: [number, number][];
  /** Zusätzliche feine Kanten (dünner, halbtransparent). */
  kantenFein?: [number, number][];
  /** Felder als Index-Listen (füllen sich, wenn alle Ecken aktiv sind).
   *  Default: Streifen-Dreiecke (i, i+1, i+2). */
  felder?: number[][];
  /** Index eines betonten Punkts (Ring + grösserer tertiärer Punkt —
   *  wie das Zentrum der Auftritts-Signatur). */
  akzent?: number;
  /** viewBox-Höhe (Breite fix 720). */
  hoehe?: number;
}) {
  const PUNKTE = punkte;
  const n = PUNKTE.length;
  const KANTEN: [number, number][] =
    kanten ??
    ([
      ...Array.from({ length: n - 1 }, (_, i) => [i, i + 1]),
      ...Array.from({ length: n - 2 }, (_, i) => [i, i + 2]),
    ] as [number, number][]);
  const FEIN: [number, number][] = kantenFein ?? [];
  const FELDER: number[][] =
    felder ?? Array.from({ length: n - 2 }, (_, i) => [i, i + 1, i + 2]);

  const [aktiv, setAktiv] = useState<Set<number>>(new Set());

  // Wiederherstellen: das Muster exakt aus dem Spuren-Bestand übernehmen
  // (beim Laden zuerst lokal, dann Cloud-Union via SPUR_EVENT). Exakt statt
  // Union, damit auch das Abwählen eines Punktes bestehen bleibt.
  useEffect(() => {
    function restore() {
      const idx = leseSpurenIndices(spurKey).filter((i) => i >= 0 && i < n);
      setAktiv(new Set(idx));
    }
    restore();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [spurKey, n]);

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

  const started = aktiv.size > 0;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${VB_W} ${hoehe}`}
        className="block h-auto w-full select-none"
        role="group"
        aria-label="Gewebe-Spiel: Punkte antippen — zwischen aktiven Punkten färben sich die Felder."
      >
        {/* Felder — färben sich, wenn alle Ecken aktiv sind */}
        {FELDER.map((feld, i) => {
          const gefuellt = feld.every((k) => aktiv.has(k));
          return (
            <polygon
              key={`f${i}`}
              points={feld.map((k) => `${PUNKTE[k][0]},${PUNKTE[k][1]}`).join(" ")}
              className={
                "pointer-events-none transition-opacity duration-500 " +
                FARBEN[i % FARBEN.length]
              }
              opacity={gefuellt ? 0.16 : 0}
            />
          );
        })}

        {/* Fäden */}
        {KANTEN.map(([a, b], i) => (
          <line
            key={`k${i}`}
            x1={PUNKTE[a][0]}
            y1={PUNKTE[a][1]}
            x2={PUNKTE[b][0]}
            y2={PUNKTE[b][1]}
            strokeWidth="1"
            className="stroke-outline-variant"
          />
        ))}
        {FEIN.map(([a, b], i) => (
          <line
            key={`fk${i}`}
            x1={PUNKTE[a][0]}
            y1={PUNKTE[a][1]}
            x2={PUNKTE[b][0]}
            y2={PUNKTE[b][1]}
            strokeWidth="0.75"
            className="stroke-outline-variant"
            opacity="0.5"
          />
        ))}

        {/* Punkte — antippen togglet */}
        {PUNKTE.map(([x, y], i) => {
          const an = aktiv.has(i);
          const istAkzent = i === akzent;
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
              <circle cx={x} cy={y} r="16" fill="transparent" />
              {!started && i === (akzent ?? 0) && (
                <circle
                  cx={x}
                  cy={y}
                  r="11"
                  className="fill-tertiary opacity-30 animate-ping origin-center [transform-box:fill-box] motion-reduce:hidden"
                />
              )}
              {(an || istAkzent) && (
                <circle
                  cx={x}
                  cy={y}
                  r={istAkzent ? 10 : 8}
                  fill="none"
                  strokeWidth="1"
                  className="stroke-tertiary"
                  opacity={an ? 0.7 : 0.45}
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={istAkzent ? 5 : 4}
                className={
                  (an || istAkzent ? "fill-tertiary" : "fill-outline") +
                  " origin-center [transform-box:fill-box] transition-transform duration-300 group-hover:scale-125 group-focus-visible:scale-125"
                }
                opacity={an ? 1 : istAkzent ? 0.85 : 0.6}
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
