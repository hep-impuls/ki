"use client";

import { useEffect, useState } from "react";
import {
  SPUR_EVENT,
  zaehleAktivitaet,
  zieheSpurenAusCloud,
  type AktivitaetsZahlen,
} from "../_lib/spuren";

/**
 * AktivitaetsNetz — ein kleines, schwebendes Netzwerk, das die eigene
 * Aktivität misst und rechnerisch-futuristisch darstellt:
 *   · Knoten        — angeklickte/gelesene Stationen (alle Landschaften)
 *   · Kombinationen — eingeloggte Verbindungen zwischen Knoten
 *   · Bilder        — angeschaute Bilder der Bilderstrecke
 *
 * Drei farbige Naben strahlen vom Kern aus; jede trägt so viele Satelliten,
 * wie die Kennzahl zählt (gedeckelt, die Zahl bleibt exakt). Die Werte kommen
 * live aus dem lokalen Spuren-Bestand (SPUR_EVENT) — dieselbe Komponente wird
 * auf der Auftakt-Seite (schwebend) und zuoberst im Orakel gezeigt.
 *
 * Nur Theme-Tokens; deterministische Koordinaten; monospace-Zahlen fürs
 * «rechnerische» Aussehen.
 */

const VB_W = 360;
const VB_H = 232;
const CORE = { x: 176, y: 116 };
const CAP = 16; // sichtbare Satelliten je Nabe (Zahl bleibt exakt)

type Nabe = {
  key: keyof AktivitaetsZahlen;
  label: string;
  hx: number;
  hy: number;
  /** Fächer-Richtung der Satelliten (Grad). */
  dir: number;
  /** Farb-Klassen (Theme-Token). */
  fill: string;
  stroke: string;
  text: string;
};

const NABEN: Nabe[] = [
  { key: "knoten", label: "Knoten", hx: 176, hy: 40, dir: -90, fill: "fill-tertiary", stroke: "stroke-tertiary", text: "text-tertiary" },
  { key: "kombinationen", label: "Kombinationen", hx: 70, hy: 176, dir: 150, fill: "fill-primary", stroke: "stroke-primary", text: "text-primary" },
  { key: "bilder", label: "Bilder", hx: 282, hy: 176, dir: 30, fill: "fill-secondary", stroke: "stroke-secondary", text: "text-secondary" },
];

const RAD = Math.PI / 180;

/** Satellitenpositionen: Fächer um die Nabe, weg vom Kern. */
function satelliten(nabe: Nabe, anzahl: number) {
  const k = Math.min(anzahl, CAP);
  const spread = 116;
  const out: { x: number; y: number; r: number }[] = [];
  for (let j = 0; j < k; j++) {
    const t = k === 1 ? 0.5 : j / (k - 1);
    const winkel = (nabe.dir + spread * (t - 0.5)) * RAD;
    const r = 24 + (j % 3) * 12;
    out.push({ x: nabe.hx + Math.cos(winkel) * r, y: nabe.hy + Math.sin(winkel) * r, r: j % 2 ? 2 : 2.6 });
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
  const [z, setZ] = useState<AktivitaetsZahlen>({ knoten: 0, kombinationen: 0, bilder: 0 });

  useEffect(() => {
    const lesen = () => setZ(zaehleAktivitaet());
    lesen();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, lesen);
    return () => window.removeEventListener(SPUR_EVENT, lesen);
  }, []);

  const gesamt = z.knoten + z.kombinationen + z.bilder;

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
          {gesamt} Aktionen
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
          aria-label={`Netz mit ${z.knoten} Knoten, ${z.kombinationen} Kombinationen, ${z.bilder} Bildern.`}
        >
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

          {/* Naben mit Satelliten */}
          {NABEN.map((nb) => {
            const wert = z[nb.key];
            const sats = satelliten(nb, wert);
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
                    <circle cx={s.x} cy={s.y} r={s.r} className={nb.fill} opacity="0.85" />
                  </g>
                ))}
                <circle
                  cx={nb.hx}
                  cy={nb.hy}
                  r="7"
                  className={nb.fill}
                  opacity={wert > 0 ? 1 : 0.35}
                />
                <circle
                  cx={nb.hx}
                  cy={nb.hy}
                  r="7"
                  fill="none"
                  strokeWidth="1"
                  className={nb.stroke}
                  opacity="0.5"
                />
                {/* Zahl */}
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

        {/* Rechnerische Legende */}
        <ul className="flex gap-md sm:flex-col sm:gap-sm">
          {NABEN.map((nb) => (
            <li key={nb.key} className="flex items-baseline gap-sm">
              <span
                className={"text-headline-md " + nb.text}
                style={{ fontFamily: "ui-monospace, monospace" }}
              >
                {String(z[nb.key]).padStart(2, "0")}
              </span>
              <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                {nb.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
