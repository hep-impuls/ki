"use client";

import { useEffect, useState } from "react";
import { leseSpuren, loescheSpuren, merkeSpur, SPUR_EVENT } from "../_lib/spuren";

/**
 * KartenAktion — die zwei wiederkehrenden Aktionen unter einer Inhalts-Karte
 * (KI-Geschichte, Merkmale, Netz):
 *
 *  1. «Mehr lesen» — klappt einen längeren Vertiefungstext (`mehr`) auf/zu.
 *  2. «Das verfolge ich weiter» — ein Merkzeichen: diesen Faden möchte ich
 *     weiterverfolgen. Wird als Spur `wunsch:…` registriert (lokal + anonymer
 *     Zähler + Cloud-Spiegel wie alles) und im Orakel gezeigt; erneutes
 *     Antippen nimmt das Merkzeichen zurück.
 *
 * Nur Theme-Tokens.
 */
export default function KartenAktion({
  mehr,
  wunschId,
}: {
  /** Optionaler Vertiefungstext hinter «Mehr lesen». */
  mehr?: string;
  /** Spur-ID des Merkzeichens, z.B. "wunsch:vorhang-auf:story:3". */
  wunschId: string;
}) {
  const [offen, setOffen] = useState(false);
  const [wunsch, setWunsch] = useState(false);

  useEffect(() => {
    function restore() {
      setWunsch(leseSpuren().some((s) => s.id === wunschId));
    }
    restore();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [wunschId]);

  function toggleWunsch() {
    if (wunsch) {
      loescheSpuren(wunschId);
      setWunsch(false);
    } else {
      merkeSpur(wunschId);
      setWunsch(true);
    }
  }

  return (
    <div className="mt-md flex flex-wrap items-center gap-sm">
      {mehr && (
        <button
          type="button"
          onClick={() => setOffen((o) => !o)}
          aria-expanded={offen}
          className="inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright px-md py-xs text-label-md text-on-surface-variant transition-colors hover:border-tertiary hover:text-tertiary"
        >
          <span className="material-symbols-outlined text-[16px]">
            {offen ? "expand_less" : "add"}
          </span>
          {offen ? "Weniger" : "Mehr lesen"}
        </button>
      )}
      <button
        type="button"
        onClick={toggleWunsch}
        aria-pressed={wunsch}
        className={
          "inline-flex items-center gap-xs rounded-full border px-md py-xs text-label-md transition-colors " +
          (wunsch
            ? "border-tertiary bg-tertiary-container text-on-tertiary-container"
            : "border-outline-variant bg-surface-bright text-on-surface-variant hover:border-tertiary hover:text-tertiary")
        }
      >
        <span className="material-symbols-outlined text-[16px]">
          {wunsch ? "bookmark_added" : "bookmark_add"}
        </span>
        {wunsch ? "Wird weiterverfolgt" : "Das verfolge ich weiter"}
      </button>

      {mehr && offen && (
        <p className="animate-frame-in w-full text-body-md text-on-surface-variant">
          {mehr}
        </p>
      )}
    </div>
  );
}
