"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SEITEN as MODUL_SEITEN } from "./ModulMiniNav";
import { leseSpuren, spurBasis, SPUR_EVENT } from "../_lib/spuren";
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
  // Über `spurBasis`, damit Vertiefungen (`mehr:…`) und Merkzeichen
  // (`wunsch:…`) mitzählen: bei ihnen steht die Art vor dem Abschnitt.
  return ids.some((id) => eintrag.prefixe!.some((p) => spurBasis(id).startsWith(p)));
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
  const pathname = usePathname();
  const router = useRouter();
  /** Ziel eines abgefangenen Seitenwechsels — null = keine Meldung offen. */
  const [wechselZiel, setWechselZiel] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

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
  const offeneAbschnitte = eintraege.filter((e) => !istAktiv(ids, e));

  function springe(id: string) {
    setOffen(false);
    setWechselZiel(null);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /**
   * Seitenwechsel abfangen und den Stand zeigen.
   *
   * Christofs Wunsch vom 2026-08-08: Beim Wechsel der Seite kurz sagen, was
   * erledigt ist und was nicht — auf Abschnittsebene —, und man kann trotzdem
   * weiter oder direkt in einen offenen Abschnitt springen.
   *
   * Der App Router hat keinen Weg, eine Navigation zu bremsen. Darum hören wir
   * in der ABFANG-Phase auf Klicks: Dort kommen wir vor `next/link` dran, und
   * `preventDefault` lässt dessen Handler aussteigen.
   *
   * Bewusst NICHT abgefangen: Klicks mit Zusatztaste oder mittlerer Maustaste
   * (neuer Tab — wer das tut, will die Seite gar nicht verlassen), Links mit
   * eigenem Ziel oder Download, Sprünge INNERHALB der Seite, alles ausserhalb
   * dieses Moduls und Klicks aus der Meldung selbst.
   *
   * Und höchstens EINMAL pro Seite und Sitzung. Eine Meldung, die bei jedem
   * Wechsel erscheint, ist keine Hilfe mehr, sondern ein Schalter, den man
   * wegklickt, ohne zu lesen.
   */
  useEffect(() => {
    if (ohneFortschritt) return;
    const merkKey = `ki26-wechselhinweis:${pathname}`;

    function beiKlick(ev: MouseEvent) {
      if (ev.defaultPrevented || ev.button !== 0) return;
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
      const ziel = ev.target as HTMLElement | null;
      if (!ziel || dialogRef.current?.contains(ziel)) return;
      const a = ziel.closest("a");
      if (!a) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;
      const href = a.getAttribute("href") ?? "";
      /* Nur modul-interne Seitenwechsel. Ein «#anker» oder ein Link auf die
         eigene Seite ist kein Wechsel, eine fremde Adresse nicht unsere Sache. */
      if (!href.startsWith("/lernen/lernseite-2")) return;
      const zielPfad = href.split("#")[0].replace(/\/$/, "");
      if (zielPfad === pathname.replace(/\/$/, "")) return;
      /* Alles erledigt → nichts zu melden, einfach durchlassen. */
      if (offeneAbschnitte.length === 0) return;
      try {
        if (window.sessionStorage.getItem(merkKey) === "1") return;
        window.sessionStorage.setItem(merkKey, "1");
      } catch {
        /* Privatmodus: dann eben bei jedem Wechsel */
      }
      ev.preventDefault();
      ev.stopPropagation();
      setOffen(false);
      setWechselZiel(href);
    }

    document.addEventListener("click", beiKlick, true);
    return () => document.removeEventListener("click", beiKlick, true);
  }, [ohneFortschritt, pathname, offeneAbschnitte.length]);

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

  /** Wohin der abgefangene Klick wollte — für die Beschriftung des Weiter-Knopfs. */
  const zielSeite = MODUL_SEITEN.find(
    (s) => wechselZiel && wechselZiel.split("#")[0].replace(/\/$/, "") === s.href.replace(/\/$/, ""),
  );

  return (
    <>
      {/* Meldung beim Seitenwechsel: der Stand auf Abschnittsebene */}
      {wechselZiel && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-inverse-surface/40 p-md sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Dein Stand auf dieser Seite"
          onClick={(e) => {
            if (e.target === e.currentTarget) setWechselZiel(null);
          }}
        >
          <div
            ref={dialogRef}
            className="animate-frame-in max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-outline-variant bg-surface-bright p-lg shadow-lg"
          >
            <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
              <span className="material-symbols-outlined text-[18px]">checklist</span>
              Bevor du weitergehst
            </p>
            <p className="mt-sm text-body-lg text-on-surface">
              Auf dieser Seite hast du {aktiv} von {eintraege.length} Abschnitten bearbeitet.
              {offeneAbschnitte.length === 1
                ? " Einer ist noch offen."
                : ` ${offeneAbschnitte.length} sind noch offen.`}
            </p>

            <ul className="mt-md space-y-xs">
              {eintraege.map((e) => {
                const an = istAktiv(ids, e);
                return (
                  <li key={e.id}>
                    {an ? (
                      <span className="flex items-center gap-sm px-sm py-xs text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px] text-tertiary">
                          check_circle
                        </span>
                        {e.label}
                      </span>
                    ) : (
                      /* Offene Abschnitte sind Knöpfe: ein Klick bleibt auf der
                         Seite und scrollt hin — genau der zweite Weg, den
                         Christof wollte. */
                      <button
                        type="button"
                        onClick={() => {
                          /* Zwei Schritte, und beide sind nötig.
                             1. Der Hash KLAPPT den Abschnitt auf, weil
                                AkkordeonGruppe auf «hashchange» hört. Ein Sprung,
                                der nur zur zugeklappten Überschrift scrollt,
                                hilft hier nicht — man will IM Abschnitt landen.
                             2. Danach selbst scrollen. Der Browser springt zum
                                Anker, BEVOR der Abschnitt aufgeklappt ist; das
                                Aufklappen verschiebt dann alles darunter, und man
                                stand 4000 px daneben. Die Verzögerung wartet auf
                                das Aufklappen, wie es AkkordeonGruppe beim
                                Wiederkommen auch tut. */
                          setWechselZiel(null);
                          setOffen(false);
                          window.location.hash = e.id;
                          setTimeout(
                            () =>
                              document
                                .getElementById(e.id)
                                ?.scrollIntoView({ block: "start" }),
                            300,
                          );
                        }}
                        className="flex w-full items-center gap-sm rounded-lg px-sm py-xs text-left text-body-sm text-on-surface transition-colors hover:bg-surface-container hover:text-tertiary"
                      >
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant/60">
                          radio_button_unchecked
                        </span>
                        <span className="min-w-0 flex-1">{e.label}</span>
                        <span className="material-symbols-outlined flex-shrink-0 text-[16px] text-tertiary">
                          arrow_forward
                        </span>
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-lg flex flex-wrap items-center gap-sm border-t border-outline-variant pt-md">
              <button
                type="button"
                onClick={() => {
                  const ziel = wechselZiel;
                  setWechselZiel(null);
                  if (ziel) router.push(ziel);
                }}
                className="inline-flex items-center gap-xs rounded-full bg-tertiary px-md py-sm text-label-md text-on-tertiary transition-colors hover:bg-on-tertiary-container"
              >
                Trotzdem weiter{zielSeite ? ` zu «${zielSeite.label}»` : ""}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <button
                type="button"
                onClick={() => setWechselZiel(null)}
                className="inline-flex items-center gap-xs rounded-full border border-outline-variant px-md py-sm text-label-md text-on-surface-variant transition-colors hover:border-tertiary hover:text-tertiary"
              >
                Hier bleiben
              </button>
              <span className="text-label-sm text-on-surface-variant opacity-70">
                Diese Meldung erscheint einmal pro Seite.
              </span>
            </div>
          </div>
        </div>
      )}

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

      {/* Oben rechts: Klammersymbol mit Fortschritt — auf grossen Screens
          direkt unter der ModulMiniNav («Der Faden»), auf kleineren (dort ist
          die Mini-Nav ausgeblendet) oben bei top-20. */}
      <div className="fixed right-4 top-20 z-40 md:right-6 lg:top-56">
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

              {/* Der Faden, nur auf schmalen Schirmen. Dort ist die
                  schwebende ModulMiniNav ausgeblendet, und diese Liste führt
                  bloss INNERHALB der Seite — ein Wechsel zwischen den drei
                  Modulen war auf dem Handy damit gar nicht möglich. Auf
                  grossen Schirmen bleibt er weg, sonst stünde er zweimal da. */}
              <div className="mt-md border-t border-outline-variant pt-sm lg:hidden">
                <p className="flex items-center gap-xs px-sm pb-xs text-label-sm uppercase tracking-wider text-tertiary">
                  <span className="material-symbols-outlined text-[16px]">linear_scale</span>
                  Der Faden
                </p>
                {MODUL_SEITEN.map((s) => {
                  const hier = pathname === s.href;
                  return (
                    <Link
                      key={s.href}
                      href={s.href}
                      onClick={() => setOffen(false)}
                      aria-current={hier ? "page" : undefined}
                      className={
                        "flex items-center gap-sm rounded-lg px-sm py-xs text-label-md transition-colors " +
                        (hier
                          ? "bg-tertiary-container/50 text-on-surface"
                          : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface")
                      }
                    >
                      <span
                        className="text-label-sm text-tertiary/70"
                        style={{ fontFamily: "ui-monospace, monospace" }}
                      >
                        {s.nr}
                      </span>
                      {s.label}
                      <span
                        className={
                          "material-symbols-outlined ml-auto text-[16px] " +
                          (hier ? "text-tertiary" : "text-on-surface-variant/50")
                        }
                      >
                        {hier ? "my_location" : "arrow_forward"}
                      </span>
                    </Link>
                  );
                })}
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
