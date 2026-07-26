"use client";

import { useRef, type ReactNode } from "react";
import { zeigeBeimOeffnen } from "../_lib/scrollen";

/**
 * SammelAccordion — eine eingesammelte Station/Punkt unter einem Muster, als
 * platzsparendes Accordion: Kopfzeile (Nummer + Titel) immer sichtbar, der
 * Inhalt klappt auf/zu. Gedacht für die «gesammelt»-Listen von KI-Story,
 * Merkmalen und Teppich — der Elternteil steuert, welche Karte offen ist
 * (üblich: die neueste). Nur Theme-Tokens.
 *
 * Beim Öffnen wird die Karte an den oberen Rand geholt, aber nur wenn sie sonst
 * nicht lesbar wäre (siehe `_lib/scrollen.ts`). Ohne das landet man unterhalb
 * des neuen Textes, weil gleichzeitig die vorher offene Karte weiter oben
 * zuklappt und alles nach oben rutscht. `scroll-mt-24` hält Abstand zur
 * klebenden Kopfzeile.
 */
export default function SammelAccordion({
  nr,
  titel,
  jahr,
  offen,
  onToggle,
  neuste = false,
  children,
}: {
  /** Anzeige-Nummer (1-basiert). */
  nr: number;
  titel: string;
  jahr?: string;
  offen: boolean;
  onToggle: () => void;
  /** Zuletzt eingesammelt — leichte Hervorhebung. */
  neuste?: boolean;
  children: ReactNode;
}) {
  const liRef = useRef<HTMLLIElement>(null);

  function beiKlick() {
    const wirdGeoeffnet = !offen;
    onToggle();
    if (wirdGeoeffnet) zeigeBeimOeffnen(liRef.current);
  }

  return (
    <li
      ref={liRef}
      className={
        "scroll-mt-24 overflow-hidden rounded-xl border transition-colors " +
        (neuste
          ? "border-tertiary/50 bg-tertiary-container/25"
          : "border-outline-variant bg-surface-bright")
      }
    >
      <button
        type="button"
        onClick={beiKlick}
        aria-expanded={offen}
        className="flex w-full items-center gap-sm p-md text-left outline-none transition-colors hover:bg-surface-container focus-visible:bg-surface-container sm:px-lg"
      >
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-tertiary-container text-label-md text-on-tertiary-container">
          {nr}
        </span>
        <span className="min-w-0 flex-1 text-body-lg font-medium text-on-surface">
          {titel}
          {jahr && (
            <span className="ml-sm text-label-md font-normal text-tertiary">{jahr}</span>
          )}
        </span>
        <span
          className={
            "material-symbols-outlined flex-shrink-0 text-[22px] text-on-surface-variant transition-transform duration-300 " +
            (offen ? "rotate-180" : "")
          }
        >
          expand_more
        </span>
      </button>
      {offen && (
        <div className="animate-frame-in px-md pb-md pl-[3.25rem] sm:px-lg sm:pl-[4rem]">
          {children}
        </div>
      )}
    </li>
  );
}
