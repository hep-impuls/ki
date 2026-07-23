"use client";

import { useEffect, useState } from "react";
import {
  SPUR_EVENT,
  leseSpuren,
  zaehleAktivitaet,
  zieheSpurenAusCloud,
} from "../_lib/spuren";
import { AUSWERTUNG_EVENT, zaehleFlaechen } from "../_lib/auswertung";
import { GEWICHT_EVENT } from "../_lib/gewichtung";

/**
 * AktivitaetsKopf — kompaktes Rhizom-Symbol mit einer Aktivitätszahl.
 *
 * Ohne `prefixe`: zeigt die GESAMT-Aktivität (neben dem Seitentitel). Die vier
 * Triebe stehen für Punkte, Bildpunkte, Flächen und Videos; aktive Triebe
 * leuchten.
 *
 * Mit `prefixe`: zeigt die Aktivität EINES Abschnitts (neben dem Abschnittstitel)
 * — gezählt werden die lokalen Spuren, deren Id mit einem der Präfixe beginnt
 * (dieselbe Logik wie das Inhaltsverzeichnis). Je mehr Aktivität, desto mehr
 * Triebe leuchten. Nur Theme-Tokens.
 */

const FARBEN = ["fill-tertiary", "fill-secondary", "fill-primary", "fill-on-surface"];
const POS = [
  { x: 20, y: 6 },
  { x: 34, y: 19 },
  { x: 6, y: 19 },
  { x: 20, y: 33 },
];

function MiniNetz({ aktiv }: { aktiv: boolean[] }) {
  return (
    <svg viewBox="0 0 40 40" className="h-6 w-6" aria-hidden>
      {POS.map((p, i) => (
        <line key={`l${i}`} x1="20" y1="19" x2={p.x} y2={p.y} strokeWidth="1" className="stroke-outline-variant" />
      ))}
      {POS.map((p, i) => (
        <g key={`p${i}`}>
          {aktiv[i] && (
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              className={FARBEN[i] + " opacity-30 animate-ping origin-center [transform-box:fill-box] motion-reduce:hidden"}
            />
          )}
          <circle cx={p.x} cy={p.y} r="3" className={aktiv[i] ? FARBEN[i] : "fill-outline"} opacity={aktiv[i] ? 1 : 0.5} />
        </g>
      ))}
      <circle cx="20" cy="19" r="4.5" className="fill-on-surface" />
    </svg>
  );
}

export default function AktivitaetsKopf({
  className = "",
  prefixe,
}: {
  className?: string;
  /** Wenn gesetzt: nur die Aktivität dieses Abschnitts (Spur-Präfixe). */
  prefixe?: string[];
}) {
  const proAbschnitt = !!prefixe?.length;
  const pfxKey = prefixe ? prefixe.join("|") : "";
  const [aktiv, setAktiv] = useState<boolean[]>([false, false, false, false]);
  const [zahl, setZahl] = useState(0);

  useEffect(() => {
    const lesen = () => {
      if (proAbschnitt) {
        const ids = leseSpuren().map((s) => s.id);
        const n = ids.filter((id) => prefixe!.some((p) => id.startsWith(p))).length;
        setZahl(n);
        setAktiv([n >= 1, n >= 2, n >= 3, n >= 4]);
      } else {
        const a = zaehleAktivitaet();
        const f = zaehleFlaechen().gefuellt;
        setZahl(a.knoten + f + a.bildpunkte + a.videos);
        setAktiv([a.knoten > 0, a.bildpunkte > 0, f > 0, a.videos > 0]);
      }
    };
    lesen();
    // Cloud-Spuren nur einmal (über den Seitentitel-Badge) nachholen; die
    // Abschnitts-Badges aktualisieren sich danach über das Spur-Event.
    if (!proAbschnitt) void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, lesen);
    window.addEventListener(AUSWERTUNG_EVENT, lesen);
    window.addEventListener(GEWICHT_EVENT, lesen);
    window.addEventListener("storage", lesen);
    return () => {
      window.removeEventListener(SPUR_EVENT, lesen);
      window.removeEventListener(AUSWERTUNG_EVENT, lesen);
      window.removeEventListener(GEWICHT_EVENT, lesen);
      window.removeEventListener("storage", lesen);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proAbschnitt, pfxKey]);

  return (
    <span
      className={
        "inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright py-1 pl-1 pr-sm " +
        className
      }
      title={
        proAbschnitt
          ? `Deine Aktivität in diesem Abschnitt: ${zahl}`
          : "Dein Aktivitäts-Rhizom: so aktiv warst du schon"
      }
    >
      <MiniNetz aktiv={aktiv} />
      <span className="text-label-md text-on-surface-variant">
        <strong className="text-on-surface">{zahl}</strong>
        {proAbschnitt ? "" : " aktiv"}
      </span>
    </span>
  );
}
