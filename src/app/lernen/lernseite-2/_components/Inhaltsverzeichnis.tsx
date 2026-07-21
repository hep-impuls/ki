"use client";

import { useEffect, useState } from "react";
import { leseSpuren, SPUR_EVENT } from "../_lib/spuren";
import { GEWICHT_EVENT } from "../_lib/gewichtung";

/**
 * Inhaltsverzeichnis — gibt jeder Seite Struktur:
 *
 *  1. Ein kleines, inline gerendertes Verzeichnis der Abschnitte/Aufgaben
 *     (nach dem Einstiegstext), mit Anker-Sprung zu jedem Abschnitt.
 *  2. Oben rechts ein immer sichtbares «Klammersymbol» ({ }), das auf Klick
 *     ein Panel öffnet — es zeigt, welche Aufgaben man schon angetippt hat
 *     bzw. wo man schon tätig war (Häkchen), und wie viele insgesamt.
 *
 * Aktivität wird aus den lokalen Spuren erkannt (ein Abschnitt gilt als
 * «tätig», sobald eine Spur mit einem seiner Präfixe existiert). Nur
 * Theme-Tokens + Material Symbols.
 */

export interface TocEintrag {
  /** DOM-id des Abschnitts (Anker-Sprung). */
  id: string;
  /** Anzeigename. */
  label: string;
  /** Spur-Präfixe, die «Aktivität» in diesem Abschnitt bedeuten. */
  prefixe?: string[];
}

function istAktiv(ids: string[], eintrag: TocEintrag): boolean {
  if (!eintrag.prefixe?.length) return false;
  return ids.some((id) => eintrag.prefixe!.some((p) => id.startsWith(p)));
}

export default function Inhaltsverzeichnis({
  eintraege,
  className = "",
  ohneFortschritt = false,
}: {
  eintraege: TocEintrag[];
  className?: string;
  /** true → reine Sprung-Navigation ohne Aktivitäts-Häkchen/Zähler
   *  (z.B. auf der Orakel-Rückblick-Seite). */
  ohneFortschritt?: boolean;
}) {
  const [ids, setIds] = useState<string[]>([]);
  const [offen, setOffen] = useState(false);

  useEffect(() => {
    const lade = () => setIds(leseSpuren().map((s) => s.id));
    lade();
    window.addEventListener(SPUR_EVENT, lade);
    window.addEventListener(GEWICHT_EVENT, lade);
    window.addEventListener("storage", lade);
    return () => {
      window.removeEventListener(SPUR_EVENT, lade);
      window.removeEventListener(GEWICHT_EVENT, lade);
      window.removeEventListener("storage", lade);
    };
  }, []);

  const aktiv = eintraege.filter((e) => istAktiv(ids, e)).length;

  function springe(id: string) {
    setOffen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /** Eine Zeile — als Anker (inline) oder Button (Panel). */
  function Zeile({ e, alsButton }: { e: TocEintrag; alsButton?: boolean }) {
    const an = !ohneFortschritt && istAktiv(ids, e);
    const inhalt = (
      <>
        <span
          className={
            "material-symbols-outlined text-[18px] " +
            (an ? "text-tertiary" : "text-on-surface-variant/50")
          }
        >
          {ohneFortschritt ? "chevron_right" : an ? "check_circle" : "radio_button_unchecked"}
        </span>
        <span className={an ? "text-on-surface" : "text-on-surface-variant"}>{e.label}</span>
      </>
    );
    const cls =
      "flex w-full items-center gap-sm rounded-lg px-sm py-xs text-left text-body-sm transition-colors hover:bg-surface-container";
    return alsButton ? (
      <button type="button" onClick={() => springe(e.id)} className={cls}>
        {inhalt}
      </button>
    ) : (
      <a href={`#${e.id}`} className={cls}>
        {inhalt}
      </a>
    );
  }

  return (
    <>
      {/* Inline-Verzeichnis */}
      <nav
        aria-label="Auf dieser Seite"
        className={
          "rounded-xl border border-outline-variant bg-surface-container-low p-md " + className
        }
      >
        <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
          <span className="material-symbols-outlined text-[18px]">toc</span>
          Auf dieser Seite
          {!ohneFortschritt && (
            <span className="ml-auto normal-case tracking-normal text-on-surface-variant">
              {aktiv}/{eintraege.length} bearbeitet
            </span>
          )}
        </p>
        <div className="mt-sm grid gap-x-md sm:grid-cols-2">
          {eintraege.map((e) => (
            <Zeile key={e.id} e={e} />
          ))}
        </div>
      </nav>

      {/* Oben rechts: Klammersymbol mit Fortschritt */}
      <div className="fixed right-4 top-20 z-40 md:right-6">
        {offen && (
          <>
            <div
              className="fixed inset-0 z-[-1]"
              aria-hidden
              onClick={() => setOffen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-[min(84vw,20rem)] rounded-2xl border border-outline-variant bg-surface-bright p-md shadow-lg">
              <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
                <span className="material-symbols-outlined text-[18px]">
                  {ohneFortschritt ? "toc" : "checklist"}
                </span>
                {ohneFortschritt ? "Auf dieser Seite" : "Dein Stand auf dieser Seite"}
              </p>
              {!ohneFortschritt && (
                <p className="mt-xs text-body-sm text-on-surface-variant">
                  {aktiv} von {eintraege.length} Aufgaben angetippt.
                </p>
              )}
              <div className="mt-sm flex flex-col">
                {eintraege.map((e) => (
                  <Zeile key={e.id} e={e} alsButton />
                ))}
              </div>
            </div>
          </>
        )}
        <button
          type="button"
          onClick={() => setOffen((o) => !o)}
          aria-expanded={offen}
          aria-label={
            ohneFortschritt
              ? "Inhaltsverzeichnis dieser Seite"
              : `Seiten-Stand: ${aktiv} von ${eintraege.length} Aufgaben angetippt`
          }
          className="relative flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright py-2 pl-3 pr-sm shadow-lg transition-transform hover:-translate-y-0.5"
        >
          <span className="material-symbols-outlined text-[22px] text-tertiary">data_object</span>
          {!ohneFortschritt && (
            <span
              className="text-label-md text-on-surface-variant"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              {aktiv}/{eintraege.length}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
