"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * PunktFenster — der Rahmen des kleinen Fensters am Gewebe, nach Christofs
 * Ernährungs-Teppich (übernommen 5.9.2026). Gemeinsamer Baustein für den
 * Teppich des Wandels und die KI-Story: Mit Anker (viewBox-Koordinaten des
 * jeweiligen Gewebes) hängt es am Punkt, mit Pfeil, seitlich in den sichtbaren
 * Scroll-Ausschnitt eingeklemmt; ohne Anker steht es dort, wo es eingehängt
 * wird (z.B. unter der Legende). Auf schmalen Bildschirmen liegt es als Leiste
 * über dem unteren Rand. Nur Theme-Tokens; die Randfarbe kommt als Klasse.
 */

/** Halbe Breite des Fensters (px im Wrapper), fürs Einklemmen am Rand. */
const FENSTER_HALB = 150;

/** Ab dieser Breite hängt das Fenster am Punkt, darunter liegt es als Leiste. */
const BREIT_AB = "(min-width: 640px)";

export function useBreit(): boolean {
  const [breit, setBreit] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(BREIT_AB);
    const setze = () => setBreit(mq.matches);
    setze();
    mq.addEventListener("change", setze);
    return () => mq.removeEventListener("change", setze);
  }, []);
  return breit;
}

export default function FensterRahmen({
  anker,
  gewebe,
  breit,
  wrapperBreite,
  sicht,
  randKlasse,
  beschriftung,
  onClose,
  children,
}: {
  /** Position im Gewebe (viewBox-Koordinaten) oder null für freistehend. */
  anker: { x: number; y: number } | null;
  /** viewBox-Masse des Gewebes, auf das sich der Anker bezieht. */
  gewebe: { w: number; h: number };
  breit: boolean;
  wrapperBreite: number;
  /** Sichtbarer Ausschnitt des seitlich scrollbaren Gewebes, in Wrapper-Pixeln. */
  sicht: { links: number; rechts: number } | null;
  randKlasse: string;
  beschriftung: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const inhalt = (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fenster schliessen"
        className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
      {children}
    </>
  );

  if (!breit) {
    return (
      <div
        role="dialog"
        aria-label={beschriftung}
        className={`fixed inset-x-2 bottom-20 z-[60] rounded-xl border bg-surface-bright p-md pr-10 shadow-xl animate-frame-in md:bottom-4 ${randKlasse}`}
        onClick={(e) => e.stopPropagation()}
      >
        {inhalt}
      </div>
    );
  }

  if (!anker) {
    return (
      <div
        role="dialog"
        aria-label={beschriftung}
        className={`relative mb-sm w-full max-w-md rounded-xl border bg-surface-bright p-md pr-10 shadow-lg animate-frame-in ${randKlasse}`}
      >
        {inhalt}
      </div>
    );
  }

  /* Am Punkt: unter dem Punkt öffnen, wenn er oben liegt, sonst darüber.
     Seitlich bleibt das Fenster im sichtbaren Ausschnitt, sonst müsste man
     erst scrollen, um es zu lesen. */
  const px = (anker.x / gewebe.w) * wrapperBreite;
  const lo = Math.max(FENSTER_HALB, (sicht?.links ?? 0) + FENSTER_HALB);
  const hi = Math.min(wrapperBreite - FENSTER_HALB, (sicht?.rechts ?? wrapperBreite) - FENSTER_HALB);
  const mitte = hi < lo ? px : Math.max(lo, Math.min(hi, px));
  // Linke Kante rechnerisch, kein translateX: animate-frame-in setzt transform.
  const left = mitte - FENSTER_HALB;
  const pfeilX = Math.max(14, Math.min(FENSTER_HALB * 2 - 14, px - left));
  const obenProzent = (anker.y / gewebe.h) * 100;
  const darueber = anker.y > gewebe.h / 2;
  return (
    <div
      role="dialog"
      aria-label={beschriftung}
      className={`absolute z-30 w-[300px] rounded-xl border bg-surface-bright p-md pr-10 shadow-xl animate-frame-in ${randKlasse}`}
      style={{
        left,
        ...(darueber
          ? { bottom: `calc(${100 - obenProzent}% + 16px)` }
          : { top: `calc(${obenProzent}% + 16px)` }),
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Pfeil zum Punkt — gleiche Randklasse wie der Rahmen */}
      <span
        aria-hidden
        className={
          `absolute h-3 w-3 rotate-45 bg-surface-bright ${randKlasse} ` +
          (darueber ? "border-b border-r" : "border-l border-t")
        }
        style={{ left: pfeilX - 6, ...(darueber ? { bottom: -7 } : { top: -7 }) }}
      />
      {inhalt}
    </div>
  );
}
