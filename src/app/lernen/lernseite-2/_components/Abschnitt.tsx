"use client";

import { type ReactNode } from "react";
import AbschnittKopf from "./AbschnittKopf";
import { useAkkordeon } from "./AkkordeonGruppe";

/**
 * Abschnitt — ein einklappbarer Themenabschnitt für Lernseite 2.
 *
 * Der Kopf (Titelbild, Titel und Vorschautext) ist IMMER sichtbar, sodass man
 * ohne Klick einen ersten Überblick bekommt. Der Titel ist zugleich der
 * Auf-/Zu-Schalter (Pfeil rechts). Die Interaktion darunter (`children`) wird
 * erst beim Öffnen eingehängt und ist Teil einer `AkkordeonGruppe`, in der immer
 * nur ein Abschnitt offen ist.
 *
 * Nur Theme-Tokens, Material Symbols.
 */
export default function Abschnitt({
  id,
  titel,
  bild,
  vorschau,
  children,
  className = "",
}: {
  /** Anker-Id (für Inhaltsverzeichnis-Links; öffnet das Akkordeon). */
  id: string;
  titel: string;
  /** Pfad zum Titelbild (public/…). */
  bild: string;
  /** Immer sichtbarer Vorschautext (Überblick). */
  vorschau?: ReactNode;
  /** Einklappbare Interaktion. */
  children: ReactNode;
  className?: string;
}) {
  const ak = useAkkordeon();
  const offen = ak ? ak.offen === id : true;
  const umschalten = ak ? () => ak.umschalten(id) : undefined;
  const bodyId = `${id}-inhalt`;

  return (
    <section id={id} aria-label={titel} className={"scroll-mt-24 " + className}>
      <AbschnittKopf bild={bild}>
        <button
          type="button"
          onClick={umschalten}
          aria-expanded={offen}
          aria-controls={bodyId}
          className="group/ab flex w-full items-center justify-between gap-md text-left outline-none"
        >
          <h2 className="text-headline-lg text-on-surface">{titel}</h2>
          <span
            className={
              "material-symbols-outlined flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-bright text-on-surface-variant transition-transform group-hover/ab:text-tertiary " +
              (offen ? "rotate-180" : "")
            }
          >
            expand_more
          </span>
        </button>
        {vorschau}
      </AbschnittKopf>

      {offen && (
        <div id={bodyId} className="mt-md animate-frame-in">
          {children}
        </div>
      )}
    </section>
  );
}
