"use client";

import { useEffect, useState } from "react";
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
 * AktivitaetsNetz — ein schwebendes Netzwerk in ZWEI Schichten:
 *
 *   · Hintergrund (kühler Grundton)  — die Aktivität ALLER Nutzenden,
 *     anonym aus den Aggregat-Zählern (`spuren-lernseite-2` +
 *     `flaechen-lernseite-2`). Ein diffuses Kollektiv-Muster.
 *   · Vordergrund (Akzenttöne)       — DEINE eigene Aktivität, klar darüber
 *     gelegt, sodass sich beide verflechten.
 *
 * Vier Arten, je Arm ein Farbton: Punkte, Flächen, Bildpunkte (durchgegangene
 * Hotspots), Videos. Nur Theme-Tokens; deterministische Koordinaten;
 * monospace-Zahlen fürs «rechnerische» Aussehen.
 */

const VB_W = 360;
const VB_H = 252;
const CORE = { x: 176, y: 118 };
const CAP = 16; // sichtbare eigene Satelliten je Arm (Zahl bleibt exakt)
const CAP_BG = 26; // maximale Hintergrund-Punkte je Arm (normalisiert)

type NetzWerte = { punkte: number; flaechen: number; bildpunkte: number; videos: number };

type Nabe = {
  key: keyof NetzWerte;
  label: string;
  hx: number;
  hy: number;
  /** Fächer-Richtung der Satelliten (Grad). */
  dir: number;
  /** Farb-Klassen (Theme-Token) für den Vordergrund (du). */
  fill: string;
  stroke: string;
  text: string;
};

const NABEN: Nabe[] = [
  { key: "punkte", label: "Punkte", hx: 176, hy: 38, dir: -90, fill: "fill-tertiary", stroke: "stroke-tertiary", text: "text-tertiary" },
  { key: "flaechen", label: "Flächen", hx: 62, hy: 118, dir: 180, fill: "fill-primary", stroke: "stroke-primary", text: "text-primary" },
  { key: "bildpunkte", label: "Bildpunkte", hx: 290, hy: 118, dir: 0, fill: "fill-secondary", stroke: "stroke-secondary", text: "text-secondary" },
  { key: "videos", label: "Videos", hx: 176, hy: 198, dir: 90, fill: "fill-on-surface", stroke: "stroke-on-surface", text: "text-on-surface" },
];

const RAD = Math.PI / 180;

/** Deterministischer Fächer um die Nabe, weg vom Kern. */
function fächer(
  nabe: Nabe,
  anzahl: number,
  opt: { cap: number; spread: number; rBasis: number; rHub: number },
) {
  const k = Math.min(anzahl, opt.cap);
  const out: { x: number; y: number; r: number }[] = [];
  for (let j = 0; j < k; j++) {
    const t = k === 1 ? 0.5 : j / (k - 1);
    const winkel = (nabe.dir + opt.spread * (t - 0.5)) * RAD;
    const r = opt.rBasis + (j % 4) * opt.rHub;
    out.push({
      x: nabe.hx + Math.cos(winkel) * r,
      y: nabe.hy + Math.sin(winkel) * r,
      r: j % 2 ? 2 : 2.6,
    });
  }
  return out;
}

export default function AktivitaetsNetz({
  titel = "Dein Aktivitätsnetz",
  unterzeile,
  schwebend = false,
  className = "",
}: {
  titel?: string;
  unterzeile?: string;
  /** Auf der Lernseite: leicht abgehoben (Schatten, dezenter Punktgrund). */
  schwebend?: boolean;
  className?: string;
}) {
  const [z, setZ] = useState<NetzWerte>({ punkte: 0, flaechen: 0, bildpunkte: 0, videos: 0 });
  const [alle, setAlle] = useState<NetzWerte>({ punkte: 0, flaechen: 0, bildpunkte: 0, videos: 0 });

  // Eigene Aktivität (lokal, live).
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

  // Kollektiv (anonyme Poll-Zähler, live). Zwei Polls: Spuren + Flächen.
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
  const maxAlle = Math.max(alle.punkte, alle.flaechen, alle.bildpunkte, alle.videos, 1);

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
          <span className="material-symbols-outlined text-[18px]">hub</span>
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
            `Netz aus zwei Schichten. Du: ${z.punkte} Punkte, ${z.flaechen} Flächen, ` +
            `${z.bildpunkte} Bildpunkte, ${z.videos} Videos. Alle zusammen: ` +
            `${alle.punkte} Punkte, ${alle.flaechen} Flächen, ${alle.bildpunkte} Bildpunkte, ${alle.videos} Videos.`
          }
        >
          {/* ── Schicht 1: Kollektiv (Hintergrund, kühler Grundton) ── */}
          {NABEN.map((nb) => {
            const wert = alle[nb.key];
            if (wert <= 0) return null;
            const bgAnzahl = Math.max(1, Math.round((wert / maxAlle) * CAP_BG));
            const wolke = fächer(nb, bgAnzahl, { cap: CAP_BG, spread: 150, rBasis: 20, rHub: 15 });
            return (
              <g key={`bg-${nb.key}`}>
                {wolke.map((s, i) => (
                  <circle
                    key={i}
                    cx={s.x}
                    cy={s.y}
                    r={s.r}
                    className="fill-outline"
                    opacity="0.28"
                  />
                ))}
              </g>
            );
          })}

          {/* Verbindungen Kern → Naben */}
          {NABEN.map((nb) => (
            <line
              key={`c${nb.key}`}
              x1={CORE.x}
              y1={CORE.y}
              x2={nb.hx}
              y2={nb.hy}
              strokeWidth="1"
              className="stroke-outline-variant"
            />
          ))}

          {/* ── Schicht 2: du (Vordergrund, Akzenttöne) ── */}
          {NABEN.map((nb) => {
            const wert = z[nb.key];
            const sats = fächer(nb, wert, { cap: CAP, spread: 116, rBasis: 24, rHub: 12 });
            return (
              <g key={nb.key}>
                {sats.map((s, i) => (
                  <g key={i}>
                    <line
                      x1={nb.hx}
                      y1={nb.hy}
                      x2={s.x}
                      y2={s.y}
                      strokeWidth="0.7"
                      className={nb.stroke}
                      opacity="0.4"
                    />
                    <circle cx={s.x} cy={s.y} r={s.r} className={nb.fill} opacity="0.9" />
                  </g>
                ))}
                <circle cx={nb.hx} cy={nb.hy} r="7" className={nb.fill} opacity={wert > 0 ? 1 : 0.35} />
                <circle
                  cx={nb.hx}
                  cy={nb.hy}
                  r="7"
                  fill="none"
                  strokeWidth="1"
                  className={nb.stroke}
                  opacity="0.5"
                />
                <text
                  x={nb.hx}
                  y={nb.hy + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                  fontWeight="700"
                  style={{ fontFamily: "ui-monospace, monospace" }}
                  className="fill-inverse-on-surface"
                >
                  {wert}
                </text>
              </g>
            );
          })}

          {/* Kern */}
          <circle
            cx={CORE.x}
            cy={CORE.y}
            r="12"
            className="fill-tertiary opacity-20 animate-ping origin-center [transform-box:fill-box] motion-reduce:hidden"
          />
          <circle cx={CORE.x} cy={CORE.y} r="6" className="fill-on-surface" />
          <circle cx={CORE.x} cy={CORE.y} r="11" fill="none" strokeWidth="1" className="stroke-on-surface" opacity="0.3" />
        </svg>

        {/* Rechnerische Legende: du (Akzent) + alle (gedämpft) */}
        <ul className="flex flex-wrap gap-md sm:flex-col sm:gap-sm">
          {NABEN.map((nb) => (
            <li key={nb.key} className="flex items-baseline gap-sm">
              <span
                className={"text-headline-md " + nb.text}
                style={{ fontFamily: "ui-monospace, monospace" }}
              >
                {String(z[nb.key]).padStart(2, "0")}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                  {nb.label}
                </span>
                <span
                  className="text-label-sm text-on-surface-variant/70"
                  style={{ fontFamily: "ui-monospace, monospace" }}
                >
                  alle {alle[nb.key]}
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
