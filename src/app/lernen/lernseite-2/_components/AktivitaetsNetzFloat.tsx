"use client";

import { useEffect, useState } from "react";
import {
  SPUR_EVENT,
  zaehleAktivitaet,
  zieheSpurenAusCloud,
} from "../_lib/spuren";
import { AUSWERTUNG_EVENT, zaehleFlaechen } from "../_lib/auswertung";
import AktivitaetsNetz from "./AktivitaetsNetz";

/** Die vier angezeigten Kennzahlen (wie im grossen Netz). */
type NetzWerte = { knoten: number; flaechen: number; bilder: number; videos: number };

/**
 * AktivitaetsNetzFloat — das Aktivitätsnetz als mitwanderndes Symbol.
 *
 * Unten rechts schwebt ein kleines Netz, dessen Punkte pulsieren (je mehr
 * Aktivität, desto mehr leuchtende Punkte). Es bleibt beim Scrollen sichtbar
 * und misst still mit. Ein Klick lässt das volle Aktivitätsnetz «aufgehen»
 * (Panel mit Kern, Naben und Kennzahlen). Über der mobilen Bottom-Nav
 * platziert (bottom-20), damit nichts überlappt.
 */

/** Mini-Netz fürs Symbol: Kern + vier farbige Punkte, die pulsieren. */
function MiniNetz({ zahlen }: { zahlen: NetzWerte }) {
  const punkte = [
    { x: 20, y: 6, cls: "fill-tertiary", aktiv: zahlen.knoten > 0 },
    { x: 34, y: 19, cls: "fill-secondary", aktiv: zahlen.bilder > 0 },
    { x: 6, y: 19, cls: "fill-primary", aktiv: zahlen.flaechen > 0 },
    { x: 20, y: 33, cls: "fill-on-surface", aktiv: zahlen.videos > 0 },
  ];
  return (
    <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden>
      {punkte.map((p, i) => (
        <line
          key={`l${i}`}
          x1="20"
          y1="19"
          x2={p.x}
          y2={p.y}
          strokeWidth="1"
          className="stroke-outline-variant"
        />
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

export default function AktivitaetsNetzFloat() {
  const [offen, setOffen] = useState(false);
  const [z, setZ] = useState<NetzWerte>({
    knoten: 0,
    flaechen: 0,
    bilder: 0,
    videos: 0,
  });

  useEffect(() => {
    const lesen = () => {
      const a = zaehleAktivitaet();
      setZ({
        knoten: a.knoten,
        flaechen: zaehleFlaechen().gefuellt,
        bilder: a.bilder,
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
    if (!offen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOffen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [offen]);

  const gesamt = z.knoten + z.flaechen + z.bilder + z.videos;

  return (
    <>
      {offen && (
        <div
          className="fixed inset-0 z-40 bg-inverse-surface/20"
          onClick={() => setOffen(false)}
          aria-hidden
        />
      )}
      <div className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6">
        {offen && (
          <div className="absolute bottom-full right-0 mb-3 w-[min(92vw,26rem)]">
            <div className="relative max-h-[76vh] overflow-y-auto rounded-2xl">
              <AktivitaetsNetz
                schwebend
                titel="Dein Aktivitätsnetz"
                unterzeile="Angeklickte Knoten, geknüpfte Flächen und angeschaute Bilder — zusammen als ein Netz."
              />
              <button
                type="button"
                onClick={() => setOffen(false)}
                aria-label="Aktivitätsnetz schliessen"
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface-bright text-on-surface-variant shadow-sm transition-colors hover:bg-surface-container hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOffen((o) => !o)}
          aria-expanded={offen}
          aria-label={offen ? "Aktivitätsnetz schliessen" : "Aktivitätsnetz öffnen"}
          className="relative flex items-center gap-sm rounded-full border border-outline-variant bg-surface-bright py-2 pl-2 pr-sm shadow-lg transition-transform hover:-translate-y-0.5"
        >
          <MiniNetz zahlen={z} />
          <span
            className="pr-1 text-label-md text-on-surface-variant"
            style={{ fontFamily: "ui-monospace, monospace" }}
          >
            {gesamt}
          </span>
          {gesamt > 0 && !offen && (
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-tertiary" />
            </span>
          )}
        </button>
      </div>
    </>
  );
}
