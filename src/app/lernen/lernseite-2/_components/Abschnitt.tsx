"use client";

import { useRef, type ReactNode } from "react";
import AbschnittKopf from "./AbschnittKopf";
import { useAkkordeon } from "./AkkordeonGruppe";
import AktivitaetsKopf from "./AktivitaetsKopf";

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
  prefixe,
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
  /** Spur-Präfixe dieses Abschnitts → Rhizom-Badge mit dessen Aktivität. */
  prefixe?: string[];
}) {
  const ak = useAkkordeon();
  const offen = ak ? ak.offen === id : true;
  const bodyId = `${id}-inhalt`;
  const sektionRef = useRef<HTMLElement>(null);

  function beiKlick() {
    if (!ak) return;
    const wirdGeoeffnet = !offen;
    ak.umschalten(id);
    // Beim Öffnen an den Anfang dieses Abschnitts scrollen, damit man ihn von
    // oben durchgehen kann. Sonst verschiebt das gleichzeitige Zuklappen des
    // vorher offenen Abschnitts (weiter oben) die Sicht nach unten.
    if (wirdGeoeffnet) {
      // Nach dem Commit scrollen (setTimeout statt requestAnimationFrame, weil
      // rAF in Hintergrund-Tabs pausiert). block:start berücksichtigt scroll-mt.
      setTimeout(
        () => sektionRef.current?.scrollIntoView({ behavior: "auto", block: "start" }),
        0,
      );
    }
  }

  return (
    <section ref={sektionRef} id={id} aria-label={titel} className={"scroll-mt-24 " + className}>
      <AbschnittKopf bild={bild}>
        <button
          type="button"
          onClick={beiKlick}
          aria-expanded={offen}
          aria-controls={bodyId}
          className="group/ab flex w-full items-center justify-between gap-md text-left outline-none"
        >
          <span className="flex min-w-0 flex-wrap items-center gap-sm">
            <h2 className="text-headline-lg text-on-surface">{titel}</h2>
            {prefixe?.length ? <AktivitaetsKopf prefixe={prefixe} /> : null}
          </span>
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
