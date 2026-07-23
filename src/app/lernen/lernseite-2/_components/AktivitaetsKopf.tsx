"use client";

import { useEffect, useState } from "react";
import { SPUR_EVENT, zaehleAktivitaet, zieheSpurenAusCloud } from "../_lib/spuren";
import { AUSWERTUNG_EVENT, zaehleFlaechen } from "../_lib/auswertung";

/**
 * AktivitaetsKopf — kompaktes Rhizom-Symbol mit deiner Aktivitätszahl, gedacht
 * neben den Seitentitel. Dieselbe Bildsprache wie das schwebende Symbol: ein
 * kleines Netz aus vier Trieben (Punkte, Bildpunkte, Flächen, Videos), aktive
 * Triebe leuchten. Zeigt auf einen Blick, wie aktiv man schon war.
 */

type Werte = { punkte: number; flaechen: number; bildpunkte: number; videos: number };

function MiniNetz({ z }: { z: Werte }) {
  const punkte = [
    { x: 20, y: 6, cls: "fill-tertiary", aktiv: z.punkte > 0 },
    { x: 34, y: 19, cls: "fill-secondary", aktiv: z.bildpunkte > 0 },
    { x: 6, y: 19, cls: "fill-primary", aktiv: z.flaechen > 0 },
    { x: 20, y: 33, cls: "fill-on-surface", aktiv: z.videos > 0 },
  ];
  return (
    <svg viewBox="0 0 40 40" className="h-6 w-6" aria-hidden>
      {punkte.map((p, i) => (
        <line key={`l${i}`} x1="20" y1="19" x2={p.x} y2={p.y} strokeWidth="1" className="stroke-outline-variant" />
      ))}
      {punkte.map((p, i) => (
        <g key={`p${i}`}>
          {p.aktiv && (
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              className={p.cls + " opacity-30 animate-ping origin-center [transform-box:fill-box] motion-reduce:hidden"}
            />
          )}
          <circle cx={p.x} cy={p.y} r="3" className={p.aktiv ? p.cls : "fill-outline"} opacity={p.aktiv ? 1 : 0.5} />
        </g>
      ))}
      <circle cx="20" cy="19" r="4.5" className="fill-on-surface" />
    </svg>
  );
}

export default function AktivitaetsKopf({ className = "" }: { className?: string }) {
  const [z, setZ] = useState<Werte>({ punkte: 0, flaechen: 0, bildpunkte: 0, videos: 0 });

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
    window.addEventListener("storage", lesen);
    return () => {
      window.removeEventListener(SPUR_EVENT, lesen);
      window.removeEventListener(AUSWERTUNG_EVENT, lesen);
      window.removeEventListener("storage", lesen);
    };
  }, []);

  const gesamt = z.punkte + z.flaechen + z.bildpunkte + z.videos;

  return (
    <span
      className={
        "inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright py-1 pl-1 pr-sm " +
        className
      }
      title="Dein Aktivitäts-Rhizom: so aktiv warst du schon"
    >
      <MiniNetz z={z} />
      <span className="text-label-md text-on-surface-variant">
        <strong className="text-on-surface">{gesamt}</strong> aktiv
      </span>
    </span>
  );
}
