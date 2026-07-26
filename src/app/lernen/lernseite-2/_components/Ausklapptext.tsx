"use client";

import { useState, type ReactNode } from "react";
import { merkeVertiefung } from "../_lib/vertiefung";

/**
 * Ausklapptext — teilt einen Infotext in einen sichtbaren Kern und eine
 * anklickbare Erweiterung. Der Kern steht immer da; die Erweiterung
 * («Mehr dazu») klappt auf Wunsch auf. Nur Theme-Tokens.
 *
 * Mit `spurId` zählt das erste Aufklappen als **Vertiefung** (Rhizom, Orakel).
 * Ohne `spurId` bleibt es ungezählt, für Aufklapper, die nicht zum Lernweg
 * gehören (Datenschutz-Details, Quellenverzeichnis).
 */
export default function Ausklapptext({
  titel = "Mehr dazu",
  children,
  spurId,
  spurTitel,
  className = "",
}: {
  /** Beschriftung des Aufklapp-Knopfes. */
  titel?: string;
  children: ReactNode;
  /** Gesetzt = erstes Aufklappen zählt als Vertiefung, z.B. "vorhang-auf:vertiefung:faeden". */
  spurId?: string;
  /** Lesbarer Titel für Knotenkarte und Orakel; sonst wird `titel` genommen. */
  spurTitel?: string;
  className?: string;
}) {
  const [offen, setOffen] = useState(false);
  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => {
          if (!offen && spurId) merkeVertiefung(spurId, spurTitel ?? titel);
          setOffen((o) => !o);
        }}
        aria-expanded={offen}
        className="inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright px-md py-xs text-label-md text-on-surface-variant transition-colors hover:border-tertiary hover:text-tertiary"
      >
        <span className="material-symbols-outlined text-[16px] text-tertiary">
          {offen ? "expand_less" : "menu_book"}
        </span>
        {offen ? "Weniger" : titel}
      </button>
      {offen && (
        <div className="animate-frame-in mt-sm space-y-sm text-body-md text-on-surface-variant">
          {children}
        </div>
      )}
    </div>
  );
}
