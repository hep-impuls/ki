"use client";

import { useEffect, useState } from "react";
import { landkarteAchsenMitDaten, werteProfilBalken, type AchsenWert, type ProfilBalken } from "../_lib/landkarteData";

/**
 * Landkarte (M6) — die **Chancen-Risiken-Landkarte** als Radar/Spinnennetz
 * (v3 §10). **Rückwärts aus den Polls designt:** jede Speiche ist eine Achse aus
 * `_data/landkarte.ts`, gespeist durch die lokal gespeicherten Pre/Post-Werte.
 * Es werden **nur Achsen mit Daten** gezeichnet → die Karte **wächst mit der
 * Zahl der absolvierten Stationen**. Der **Ich-Punkt** kommt rein lokal
 * (localStorage); Klasse/alle (anonyme Aggregate) folgen über den
 * Klassen-Spiegel und ab M8. Das mehrachsige **Werte-Profil** (Swipe) erscheint
 * darunter als links/rechts-Balken.
 *
 * SVG ohne Chart-Library, MD3-Farb-Token via `rgb(var(--color-*))`.
 */

const SIZE = 360;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 116;
const RINGE = [0.25, 0.5, 0.75, 1];

interface Punkt {
  x: number;
  y: number;
}

/** Wert (0..1) auf der Achse i (von N) in SVG-Koordinaten. Start oben (-90°). */
function koord(value: number, i: number, n: number): Punkt {
  const theta = (-90 + (i * 360) / n) * (Math.PI / 180);
  return {
    x: CX + value * R * Math.cos(theta),
    y: CY + value * R * Math.sin(theta),
  };
}

function polygon(points: Punkt[]): string {
  return points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

function Radar({ achsen }: { achsen: AchsenWert[] }) {
  const n = achsen.length;
  const ringPunkte = (level: number) => achsen.map((_, i) => koord(level, i, n));
  const ichPunkte = achsen.map((a, i) => koord(a.ich, i, n));
  const genugFuerFlaeche = n >= 3;

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-auto w-full max-w-md" role="img" aria-label="Chancen-Risiken-Landkarte als Radar">
      {/* Gitterringe */}
      {RINGE.map((level) => (
        <polygon
          key={level}
          points={polygon(ringPunkte(level))}
          fill="none"
          stroke="rgb(var(--color-outline-variant))"
          strokeWidth={1}
        />
      ))}

      {/* Speichen + Labels */}
      {achsen.map((a, i) => {
        const aussen = koord(1, i, n);
        const label = koord(1.16, i, n);
        const anchor = label.x > CX + 4 ? "start" : label.x < CX - 4 ? "end" : "middle";
        return (
          <g key={a.axis.id}>
            <line
              x1={CX}
              y1={CY}
              x2={aussen.x}
              y2={aussen.y}
              stroke="rgb(var(--color-outline-variant))"
              strokeWidth={1}
            />
            <text
              x={label.x}
              y={label.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={10}
              fill="rgb(var(--color-on-surface-variant))"
            >
              {a.kurz}
            </text>
          </g>
        );
      })}

      {/* Ich-Fläche (ab 3 Achsen) */}
      {genugFuerFlaeche && (
        <polygon
          points={polygon(ichPunkte)}
          fill="rgb(var(--color-tertiary))"
          fillOpacity={0.18}
          stroke="rgb(var(--color-tertiary))"
          strokeWidth={2}
        />
      )}

      {/* Ich-Punkte */}
      {ichPunkte.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="rgb(var(--color-tertiary))" />
      ))}
    </svg>
  );
}

function ProfilBalkenAnzeige({ balken }: { balken: ProfilBalken[] }) {
  return (
    <div className="flex flex-col gap-md">
      {balken.map((b) => (
        <div key={b.key} className="flex flex-col gap-xs">
          <p className="text-label-md text-on-surface">{b.label}</p>
          <div className="relative h-6 w-full overflow-hidden rounded-full bg-surface-container">
            {/* Position der Neigung als Marker */}
            <div
              className="absolute top-0 h-full w-1.5 rounded-full bg-tertiary"
              style={{ left: `calc(${Math.round(b.rechtsAnteil * 100)}% - 3px)` }}
              aria-hidden
            />
          </div>
          <div className="flex justify-between text-label-sm text-on-surface-variant">
            <span>{b.links} ({b.linksN})</span>
            <span>{b.rechts} ({b.rechtsN})</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Landkarte() {
  // Erst nach Mount aus localStorage lesen (SSR-Hydration-sicher).
  const [achsen, setAchsen] = useState<AchsenWert[] | null>(null);
  const [profil, setProfil] = useState<ProfilBalken[]>([]);
  useEffect(() => {
    setAchsen(landkarteAchsenMitDaten());
    setProfil(werteProfilBalken());
  }, []);

  if (achsen == null) {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg text-body-md text-on-surface-variant">
        Landkarte wird vorbereitet …
      </div>
    );
  }

  if (achsen.length === 0 && profil.length === 0) {
    return (
      <div className="flex items-start gap-md rounded-xl border border-outline-variant bg-surface-container-low p-lg">
        <span className="material-symbols-outlined text-[24px] text-tertiary">explore</span>
        <p className="text-body-md text-on-surface">
          Deine Landkarte ist noch leer. Beantworte in den Stationen die Meinungs-Fragen und
          Swipe-Karten — mit jeder Station kommt eine Achse dazu.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg">
      {achsen.length > 0 && (
        <div className="flex flex-col items-center gap-md rounded-xl border border-outline-variant bg-surface-bright p-lg">
          <Radar achsen={achsen} />
          <p className="flex items-center gap-xs text-label-sm text-on-surface-variant">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-tertiary" aria-hidden />
            Mein Standpunkt · je weiter aussen, desto mehr zum rechten Pol der Achse.
          </p>
          <p className="text-label-sm text-on-surface-variant">
            {achsen.length} von 8 Achsen sichtbar — mehr Stationen ergänzen die Karte.
          </p>
        </div>
      )}

      {profil.length > 0 && (
        <div className="flex flex-col gap-md rounded-xl border border-outline-variant bg-surface-bright p-lg">
          <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Mein Werte-Profil
          </p>
          <ProfilBalkenAnzeige balken={profil} />
        </div>
      )}
    </div>
  );
}
