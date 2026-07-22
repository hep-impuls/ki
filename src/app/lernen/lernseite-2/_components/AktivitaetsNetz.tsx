"use client";

import { useEffect, useMemo, useState } from "react";
import {
  SPUR_EVENT,
  SPUREN_POLL_ID,
  zaehleAktivitaet,
  zaehleAlleAusPoll,
  zieheSpurenAusCloud,
} from "../_lib/spuren";
import { AUSWERTUNG_EVENT, FLAECHEN_POLL_ID, zaehleFlaechen } from "../_lib/auswertung";
import {
  loadPollCounts,
  subscribePollCounts,
  totalVotes,
  type PollCounts,
} from "@/lib/polls";

/**
 * AktivitaetsNetz — die eigene und die kollektive Aktivität als **Rhizom**:
 * eine Wurzel, die nach oben wächst und sich verzweigt. Je mehr Aktivität,
 * desto weiter wuchert der jeweilige Trieb.
 *
 *   · Hintergrund (kühler Grundton)  — die Aktivität ALLER Nutzenden, anonym
 *     aus den Aggregat-Zählern (`spuren-lernseite-2` + `flaechen-lernseite-2`).
 *   · Vordergrund (Akzenttöne)       — DEINE Aktivität, darüber verflochten.
 *
 * Vier Triebe, je ein Farbton: Punkte, Flächen, Bildpunkte (durchgegangene
 * Hotspots), Videos. Wuchs ist deterministisch (Seed pro Trieb) — kein
 * Zittern zwischen Renders. Nur Theme-Tokens.
 */

const VB_W = 360;
const VB_H = 300;
const WURZEL = { x: 182, y: 256 }; // Punkt, aus dem alle Triebe sprossen (tief, damit sie hoch wachsen)
const RAD = Math.PI / 180;

type NetzWerte = { punkte: number; flaechen: number; bildpunkte: number; videos: number };

type Trieb = {
  key: keyof NetzWerte;
  label: string;
  /** Grundrichtung des Triebs (Grad, SVG: -90 = nach oben). */
  winkel: number;
  fill: string;
  stroke: string;
  text: string;
};

const TRIEBE: Trieb[] = [
  { key: "flaechen", label: "Flächen", winkel: -150, fill: "fill-primary", stroke: "stroke-primary", text: "text-primary" },
  { key: "punkte", label: "Punkte", winkel: -108, fill: "fill-tertiary", stroke: "stroke-tertiary", text: "text-tertiary" },
  { key: "bildpunkte", label: "Bildpunkte", winkel: -72, fill: "fill-secondary", stroke: "stroke-secondary", text: "text-secondary" },
  { key: "videos", label: "Videos", winkel: -34, fill: "fill-on-surface", stroke: "stroke-on-surface", text: "text-on-surface" },
];

/** Deterministischer PRNG (mulberry32). */
function prng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Seg = { d: string; w: number };
type Blatt = { x: number; y: number; r: number };

/**
 * Ein Trieb wächst rekursiv aus dem Wurzelpunkt: gebogene Segmente, die sich
 * verzweigen, bis Tiefe/Länge erschöpft sind. Endpunkte werden zu Blättern.
 */
function baueTrieb(
  seed: number,
  tiefe: number,
  len0: number,
  breite0: number,
  winkel0: number,
  blattR: number,
): { segs: Seg[]; blaetter: Blatt[] } {
  const rng = prng(seed);
  const segs: Seg[] = [];
  const blaetter: Blatt[] = [];
  let budget = 88; // Sicherheitskappe gegen Verzweigungs-Explosion

  function wachse(x: number, y: number, winkel: number, len: number, w: number, t: number) {
    if (budget <= 0) return;
    if (t <= 0 || len < 4) {
      blaetter.push({ x, y, r: blattR * (0.7 + rng() * 0.7) });
      return;
    }
    budget--;
    const a = winkel * RAD;
    const ex = x + Math.cos(a) * len;
    const ey = y + Math.sin(a) * len;
    const bend = (rng() - 0.5) * len * 0.8;
    const mx = (x + ex) / 2 + Math.cos(a + Math.PI / 2) * bend;
    const my = (y + ey) / 2 + Math.sin(a + Math.PI / 2) * bend;
    segs.push({
      d: `M${x.toFixed(1)} ${y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`,
      w,
    });
    // Hauptrichtung weiter — langsamer Längen-Abbau → lange Verästelungen
    wachse(ex, ey, winkel + (rng() - 0.5) * 26, len * 0.9, Math.max(0.6, w * 0.76), t - 1);
    // Seitentriebe
    if (t >= 2 && rng() < 0.9) {
      const s = rng() < 0.5 ? -1 : 1;
      wachse(ex, ey, winkel + s * (24 + rng() * 22), len * 0.82, Math.max(0.6, w * 0.62), t - 2);
    }
    if (t >= 3 && rng() < 0.55) {
      const s = rng() < 0.5 ? -1 : 1;
      wachse(ex, ey, winkel - s * (26 + rng() * 20), len * 0.74, Math.max(0.6, w * 0.56), t - 3);
    }
    // gelegentlich ein Blatt am Verzweigungspunkt
    if (rng() < 0.22) blaetter.push({ x: ex, y: ey, r: blattR * 0.8 });
  }

  wachse(WURZEL.x, WURZEL.y, winkel0, len0, breite0, tiefe);
  return { segs, blaetter };
}

/** Tiefe aus einer Kennzahl (relativ zum Maximum der Schicht). */
function tiefeVon(wert: number, max: number, basis: number, spanne: number, deckel: number) {
  if (wert <= 0) return 0;
  return Math.min(deckel, basis + Math.round(spanne * Math.sqrt(wert / max)));
}

export default function AktivitaetsNetz({
  titel = "Dein Aktivitätsnetz",
  unterzeile,
  schwebend = false,
  className = "",
}: {
  titel?: string;
  unterzeile?: string;
  schwebend?: boolean;
  className?: string;
}) {
  const [z, setZ] = useState<NetzWerte>({ punkte: 0, flaechen: 0, bildpunkte: 0, videos: 0 });
  const [alle, setAlle] = useState<NetzWerte>({ punkte: 0, flaechen: 0, bildpunkte: 0, videos: 0 });

  useEffect(() => {
    const lesen = () => {
      const a = zaehleAktivitaet();
      setZ({
        punkte: a.knoten,
        flaechen: zaehleFlaechen().gefuellt,
        bildpunkte: a.bildpunkte,
        videos: a.videos,
      });
    };
    lesen();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, lesen);
    window.addEventListener(AUSWERTUNG_EVENT, lesen);
    return () => {
      window.removeEventListener(SPUR_EVENT, lesen);
      window.removeEventListener(AUSWERTUNG_EVENT, lesen);
    };
  }, []);

  useEffect(() => {
    const setzeSpuren = (counts: PollCounts) =>
      setAlle((v) => ({ ...v, ...zaehleAlleAusPoll(counts) }));
    const setzeFlaechen = (counts: PollCounts) =>
      setAlle((v) => ({ ...v, flaechen: totalVotes(counts) }));
    void loadPollCounts(SPUREN_POLL_ID).then(setzeSpuren);
    void loadPollCounts(FLAECHEN_POLL_ID).then(setzeFlaechen);
    const ab1 = subscribePollCounts(SPUREN_POLL_ID, setzeSpuren);
    const ab2 = subscribePollCounts(FLAECHEN_POLL_ID, setzeFlaechen);
    return () => {
      ab1();
      ab2();
    };
  }, []);

  const gesamt = z.punkte + z.flaechen + z.bildpunkte + z.videos;
  const gesamtAlle = alle.punkte + alle.flaechen + alle.bildpunkte + alle.videos;

  // Rhizom-Geometrie deterministisch aus den Kennzahlen ableiten (memoisiert).
  const { bg, fg } = useMemo(() => {
    const maxFg = Math.max(z.punkte, z.flaechen, z.bildpunkte, z.videos, 1);
    const maxBg = Math.max(alle.punkte, alle.flaechen, alle.bildpunkte, alle.videos, 1);
    const bgTriebe = TRIEBE.map((t, i) => ({
      trieb: t,
      ...baueTrieb(1009 + i * 53, tiefeVon(alle[t.key], maxBg, 3, 3.6, 8), 40, 5, t.winkel, 2.2),
    }));
    const fgTriebe = TRIEBE.map((t, i) => ({
      trieb: t,
      ...baueTrieb(4201 + i * 71, tiefeVon(z[t.key], maxFg, 2, 3.6, 7), 34, 3.6, t.winkel, 2.6),
    }));
    return { bg: bgTriebe, fg: fgTriebe };
  }, [z, alle]);

  return (
    <section
      aria-label="Aktivitätsnetz"
      className={
        "rounded-2xl border border-outline-variant p-md sm:p-lg " +
        (schwebend ? "bg-surface-bright shadow-lg " : "bg-surface-container-low ") +
        className
      }
      style={
        schwebend
          ? {
              backgroundImage:
                "radial-gradient(rgb(var(--color-tertiary) / 0.10) 1px, transparent 1.4px)",
              backgroundSize: "16px 16px",
            }
          : undefined
      }
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-md gap-y-xs">
        <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
          <span className="material-symbols-outlined text-[18px]">forest</span>
          {titel}
        </p>
        <p
          className="text-label-sm text-on-surface-variant"
          style={{ fontFamily: "ui-monospace, monospace" }}
        >
          {gesamt} du · {gesamtAlle} alle
        </p>
      </div>
      {unterzeile && (
        <p className="mt-xs text-body-sm text-on-surface-variant">{unterzeile}</p>
      )}

      <div className="mt-sm grid items-center gap-md sm:grid-cols-[minmax(0,1fr)_auto]">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="block w-full"
          role="img"
          aria-label={
            `Rhizom aus zwei Schichten. Du: ${z.punkte} Punkte, ${z.flaechen} Flächen, ` +
            `${z.bildpunkte} Bildpunkte, ${z.videos} Videos. Alle zusammen: ` +
            `${alle.punkte} Punkte, ${alle.flaechen} Flächen, ${alle.bildpunkte} Bildpunkte, ${alle.videos} Videos.`
          }
        >
          {/* Wurzel-Stamm (gemeinsame Basis, aus der alles sprosst) */}
          <path
            d={`M186 ${VB_H - 6} Q180 ${VB_H - 40} ${WURZEL.x} ${WURZEL.y}`}
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            className="stroke-on-surface"
            opacity="0.75"
          />

          {/* ── Schicht 1: Kollektiv (Hintergrund, kühler Grundton) ── */}
          {bg.map(({ trieb, segs, blaetter }) => (
            <g key={`bg-${trieb.key}`} opacity="0.32">
              {segs.map((s, i) => (
                <path
                  key={i}
                  d={s.d}
                  fill="none"
                  strokeWidth={s.w}
                  strokeLinecap="round"
                  className="stroke-outline"
                />
              ))}
              {blaetter.map((b, i) => (
                <circle key={`l${i}`} cx={b.x} cy={b.y} r={b.r} className="fill-outline" />
              ))}
            </g>
          ))}

          {/* ── Schicht 2: du (Vordergrund, Akzenttöne) ── */}
          {fg.map(({ trieb, segs, blaetter }) => (
            <g key={`fg-${trieb.key}`}>
              {segs.map((s, i) => (
                <path
                  key={i}
                  d={s.d}
                  fill="none"
                  strokeWidth={s.w}
                  strokeLinecap="round"
                  className={trieb.stroke}
                  opacity="0.85"
                />
              ))}
              {blaetter.map((b, i) => (
                <circle key={`l${i}`} cx={b.x} cy={b.y} r={b.r} className={trieb.fill} opacity="0.95" />
              ))}
            </g>
          ))}

          {/* Wurzel-Knollen am Ansatz */}
          <circle cx={WURZEL.x} cy={WURZEL.y} r="6" className="fill-on-surface" />
          <circle
            cx={WURZEL.x}
            cy={WURZEL.y}
            r="10"
            fill="none"
            strokeWidth="1"
            className="stroke-on-surface"
            opacity="0.3"
          />
          <circle
            cx={WURZEL.x}
            cy={WURZEL.y}
            r="12"
            className="fill-tertiary opacity-20 animate-ping origin-center [transform-box:fill-box] motion-reduce:hidden"
          />
        </svg>

        {/* Rechnerische Legende: du (Akzent) + alle (gedämpft) */}
        <ul className="flex flex-wrap gap-md sm:flex-col sm:gap-sm">
          {TRIEBE.map((t) => (
            <li key={t.key} className="flex items-baseline gap-sm">
              <span
                className={"text-headline-md " + t.text}
                style={{ fontFamily: "ui-monospace, monospace" }}
              >
                {String(z[t.key]).padStart(2, "0")}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                  {t.label}
                </span>
                <span
                  className="text-label-sm text-on-surface-variant/70"
                  style={{ fontFamily: "ui-monospace, monospace" }}
                >
                  alle {alle[t.key]}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Legende der beiden Schichten */}
      <div className="mt-sm flex flex-wrap items-center gap-x-md gap-y-xs text-label-sm text-on-surface-variant">
        <span className="flex items-center gap-xs">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-outline opacity-60" />
          Hintergrund: alle Nutzenden
        </span>
        <span className="flex items-center gap-xs">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-tertiary" />
          Vordergrund: du
        </span>
      </div>
    </section>
  );
}
