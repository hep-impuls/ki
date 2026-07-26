"use client";

import { useState } from "react";
import { merkeVertiefung } from "../_lib/vertiefung";

/**
 * InfoPunkt — ein kleines ⓘ, das beim Klick einen erklärenden Hinweis
 * auf-/zuklappt. Für Nebenbemerkungen, die den Haupttext nicht überladen
 * sollen. Nur Theme-Tokens.
 *
 * Mit `spurId` zählt das erste Aufklappen als **Vertiefung** (Rhizom, Orakel).
 * Beim «Hintergrund zum Bild» ist das gewollt: Dort steckt ein langer Text.
 */
export default function InfoPunkt({
  children,
  label = "Hinweis",
  spurId,
  spurTitel,
  className = "",
}: {
  children: React.ReactNode;
  /** Kurzer Text neben dem Symbol (klickbar). */
  label?: string;
  /** Gesetzt = erstes Aufklappen zählt als Vertiefung. */
  spurId?: string;
  /** Lesbarer Titel für Knotenkarte und Orakel; sonst wird `label` genommen. */
  spurTitel?: string;
  className?: string;
}) {
  const [offen, setOffen] = useState(false);
  return (
    <span className={"inline-block " + className}>
      <button
        type="button"
        onClick={() => {
          if (!offen && spurId) merkeVertiefung(spurId, spurTitel ?? label);
          setOffen((o) => !o);
        }}
        aria-expanded={offen}
        className="inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:border-tertiary hover:text-tertiary"
      >
        <span className="material-symbols-outlined text-[16px] text-tertiary">info</span>
        {label}
      </button>
      {offen && (
        <span className="animate-frame-in mt-sm block max-w-3xl rounded-xl border border-outline-variant bg-surface-container-low p-md text-body-md text-on-surface-variant">
          {children}
        </span>
      )}
    </span>
  );
}
