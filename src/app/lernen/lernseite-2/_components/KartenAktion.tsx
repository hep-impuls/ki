"use client";

import { useEffect, useState } from "react";
import { leseSpuren, loescheSpuren, merkeSpur, SPUR_EVENT } from "../_lib/spuren";
import { merkeInhalt } from "../_lib/inhalte";
import { merkeVertiefung } from "../_lib/vertiefung";

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
  titel,
  aufDunkel = false,
}: {
  /** Optionaler Vertiefungstext hinter «Mehr lesen» (Text oder bereits mit
   *  Glossar-Begriffen angereicherter Knoten). */
  mehr?: React.ReactNode;
  /** Spur-ID des Merkzeichens, z.B. "wunsch:vorhang-auf:story:3". */
  wunschId: string;
  /** Klartext-Titel des Inhalts — für lesbare Labels in der Sternenkarte. */
  titel?: string;
  /**
   * Für die Bild-Ansichten, die auf `inverse-surface` liegen (Anschauungsmodus
   * der Bilderstrecke, BildZoom der Epochen). Dort sind die hellen
   * Flächen-Tokens falsch herum: `bg-surface-bright` wäre ein weisser Klotz im
   * abgedunkelten Bild. Gleiche Form, gleiche Beschriftung, nur die Farben
   * gespiegelt.
   */
  aufDunkel?: boolean;
}) {
  const [offen, setOffen] = useState(false);
  const [wunsch, setWunsch] = useState(false);

  /** Basis-ID (ohne `wunsch:`-Präfix) — Schlüssel der Titel-Registry. */
  const basisId = wunschId.startsWith("wunsch:")
    ? wunschId.slice("wunsch:".length)
    : wunschId;
  /** Spur-ID fürs «Mehr gelesen» — aus der Basis-ID abgeleitet, damit das
   *  Vertiefen als Aktivität zählt. */
  const mehrId = `mehr:${basisId}`;

  // Titel registrieren, sobald die Karte rendert (Single Source: hier steht
  // der Inhalt, hier wird der Titel bekannt gemacht).
  useEffect(() => {
    if (titel) merkeInhalt(basisId, titel);
  }, [basisId, titel]);

  useEffect(() => {
    function restore() {
      setWunsch(leseSpuren().some((s) => s.id === wunschId));
    }
    restore();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [wunschId]);

  function toggleMehr() {
    // WICHTIG: erst registrieren, dann den State setzen. Vorher stand
    // `merkeSpur` IM Updater — der läuft in der Render-Phase, und das dort
    // ausgelöste SPUR_EVENT erreichte das Aktivitätsnetz nicht mehr (React
    // verwirft ein setState, das während des Renderns einer anderen Komponente
    // kommt). Die Spur landete im Speicher, die Anzeige blieb stehen.
    // `merkeVertiefung` ist idempotent, mehrfaches Auf/Zu zählt einmal.
    if (!offen) merkeVertiefung(mehrId, titel);
    setOffen((o) => !o);
  }

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
          onClick={toggleMehr}
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
          (aufDunkel
            ? wunsch
              ? "border-tertiary bg-tertiary text-on-tertiary"
              : "border-inverse-on-surface/40 bg-inverse-on-surface/10 text-inverse-on-surface hover:border-tertiary hover:bg-inverse-on-surface/20"
            : wunsch
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
