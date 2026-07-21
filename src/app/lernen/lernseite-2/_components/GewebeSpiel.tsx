"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  leseSpurenIndices,
  loescheSpuren,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";
import { sparsameMaschen, zufallsLayout } from "../_lib/flaechen";
import { melde } from "../_lib/auswertung";

/** Leuchtende Web-Palette (wie die Perlen der KI-Story) — dokumentierte
 *  Ausnahme von der reinen Token-Palette, nur für die gefüllten Maschen. */
const WEB_FARBEN = [
  "#f94144", "#f3722c", "#f8961e", "#f9c74f", "#90be6d", "#43aa8b",
  "#4d908e", "#577590", "#277da1", "#5e60ce", "#9d4edd", "#d81159",
] as const;

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
  weben = false,
  bereichLabel,
}: {
  className?: string;
  /** Spur-Präfix fürs Merken des Musters. */
  spurKey?: string;
  /** true → Delaunay-Web (wie Teppich/KI-Story/Merkmale): zwischen aktiven
   *  Punkten entstehen Maschen (teils farbig, teils gemustert), statt der
   *  festen `felder`/`kanten`. */
  weben?: boolean;
  /** Wenn gesetzt: Flächen-Bilanz ans Orakel melden (zählt als Aktivität). */
  bereichLabel?: string;
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

  const musterId = useId().replace(/[^a-zA-Z0-9]/g, "");
  // Web-Layout: zufällig, gut verteilt — im Browser gewürfelt (SSR rendert
  // die deterministische Ausgangslage).
  const [posZufall, setPosZufall] = useState<[number, number][] | null>(null);
  useEffect(() => {
    if (weben) setPosZufall(zufallsLayout(n, VB_W, hoehe, Math.min(44, hoehe / 4)));
  }, [weben, n, hoehe]);
  const P = weben && posZufall ? posZufall : PUNKTE;

  // Delaunay-Web (wie Teppich/KI-Story/Merkmale): sparsame Maschen + Netz.
  const autoMaschen = useMemo(
    () => (weben ? sparsameMaschen(P.map(([x, y]) => ({ x, y })), 320, 4) : []),
    [weben, P],
  );
  const webKanten = useMemo(() => {
    const seen = new Set<string>();
    const out: [number, number][] = [];
    for (const [a, b, c] of autoMaschen) {
      for (const [p, q] of [
        [a, b],
        [b, c],
        [c, a],
      ]) {
        const lo = Math.min(p, q);
        const hi = Math.max(p, q);
        const k = `${lo}-${hi}`;
        if (!seen.has(k)) {
          seen.add(k);
          out.push([lo, hi]);
        }
      }
    }
    return out;
  }, [autoMaschen]);

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

  // Inhaltsloses Muster: Als Aktivität zählt es ERST, wenn das ganze Muster
  // aufgedeckt ist (alle Punkte aktiv). Vorher 0 — die Flächen entstehen zwar
  // sichtbar, werden aber noch nicht als Aktivität gutgeschrieben.
  const komplett = weben && aktiv.size === n;
  useEffect(() => {
    if (!bereichLabel) return;
    const fertig = weben && aktiv.size === n;
    melde(spurKey, {
      bereich: bereichLabel,
      flaechenGefuellt: fertig ? autoMaschen.length : 0,
      flaechenTotal: weben ? autoMaschen.length : 0,
      labels: [],
    });
  }, [aktiv, weben, n, autoMaschen, bereichLabel, spurKey]);

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
        {/* Delaunay-Web: feines Netz + gefüllte Maschen (teils farbig, teils
            gemustert) zwischen aktiven Punkten */}
        {weben && (
          <>
            <defs>
              <pattern
                id={`${musterId}-s`}
                width="9"
                height="9"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line x1="0" y1="0" x2="0" y2="9" strokeWidth="1.4" className="stroke-tertiary" opacity="0.35" />
              </pattern>
              <pattern id={`${musterId}-p`} width="11" height="11" patternUnits="userSpaceOnUse">
                <circle cx="3" cy="3" r="1.5" className="fill-tertiary" opacity="0.4" />
              </pattern>
            </defs>
            {webKanten.map(([p, q], i) => {
              const a = P[p];
              const b = P[q];
              const beide = aktiv.has(p) && aktiv.has(q);
              return (
                <line
                  key={`wk${i}`}
                  x1={a[0]}
                  y1={a[1]}
                  x2={b[0]}
                  y2={b[1]}
                  strokeWidth={beide ? 1.1 : 0.8}
                  className={
                    (beide ? "stroke-tertiary" : "stroke-outline-variant") +
                    " transition-all duration-500"
                  }
                  opacity={beide ? 0.5 : 0.18}
                />
              );
            })}
            {autoMaschen.map((t, i) => {
              if (!t.every((v) => aktiv.has(v))) return null;
              const pts = t.map((v) => `${P[v][0]},${P[v][1]}`).join(" ");
              const stil = i % 3; // 0 = farbig, 1 = schraffur, 2 = punkte
              if (stil === 0) {
                const farbe = WEB_FARBEN[i % WEB_FARBEN.length];
                return (
                  <polygon
                    key={`wm${i}`}
                    points={pts}
                    fill={farbe}
                    fillOpacity={0.18}
                    stroke={farbe}
                    strokeOpacity={0.34}
                    strokeWidth={0.6}
                    className="pointer-events-none transition-opacity duration-500"
                  />
                );
              }
              return (
                <polygon
                  key={`wm${i}`}
                  points={pts}
                  fill={`url(#${musterId}-${stil === 1 ? "s" : "p"})`}
                  className="pointer-events-none stroke-tertiary transition-opacity duration-500"
                  strokeWidth={0.5}
                  strokeOpacity={0.3}
                />
              );
            })}
          </>
        )}

        {/* Feste Felder — nur ohne `weben` */}
        {!weben &&
          FELDER.map((feld, i) => {
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

        {/* Feste Fäden — nur ohne `weben` (dann übernimmt das Netz) */}
        {!weben &&
          KANTEN.map(([a, b], i) => (
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
        {!weben &&
          FEIN.map(([a, b], i) => (
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
        {P.map(([x, y], i) => {
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
              {/* Einladung: im Web-Modus blinken ALLE inaktiven Punkte. */}
              {(weben ? !an : !started && i === (akzent ?? 0)) && (
                <circle
                  cx={x}
                  cy={y}
                  r={weben ? 9 : 11}
                  className="fill-tertiary opacity-25 animate-ping origin-center [transform-box:fill-box] motion-reduce:hidden"
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
      {weben ? (
        <div className="mt-sm rounded-lg border border-outline-variant bg-surface-container-low p-sm">
          <p className="flex items-start gap-xs text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined mt-[1px] flex-shrink-0 text-[16px] text-tertiary">
              {komplett ? "check_circle" : "info"}
            </span>
            <span>
              Dieses Muster hat <strong className="text-on-surface">keinen Inhalt</strong> —
              es steht nur für die Idee, dass KI immer in einem Netz aus Bezügen
              steckt. Tippe die Punkte an: Zwischen ihnen entstehen Flächen.{" "}
              {komplett ? (
                <strong className="text-tertiary">
                  Muster vollständig aufgedeckt — als Aktivität erfasst.
                </strong>
              ) : (
                <>
                  Als <strong className="text-on-surface">Aktivität</strong> zählt
                  es aber erst, wenn du das{" "}
                  <strong className="text-on-surface">ganze Muster</strong>{" "}
                  aufgedeckt hast ({aktiv.size}/{n}).
                </>
              )}
            </span>
          </p>
        </div>
      ) : (
        <p className="mt-xs text-label-sm text-on-surface-variant">
          Tippe die Punkte an — zwischen aktiven Punkten färben sich die Felder.
        </p>
      )}
    </div>
  );
}
