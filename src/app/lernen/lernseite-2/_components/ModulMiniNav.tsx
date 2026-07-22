"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * ModulMiniNav — kleine, mitschwebende Navigation (oben rechts) auf die drei
 * Seiten des Moduls. Liegt auf jeder Modul-Seite; die aktuelle Seite ist
 * hervorgehoben. Direkt darunter sitzt (auf den Unterseiten) die Klammer,
 * die Navigation *innerhalb* der Seite (siehe Inhaltsverzeichnis.tsx).
 * Nur Theme-Tokens; auf schmalen Screens ausgeblendet (dort trägt die
 * Themen-/Abschnittsliste der Seite selbst).
 */
const SEITEN = [
  { nr: "01", label: "Vorhang auf", href: "/lernen/lernseite-2/vorhang-auf" },
  { nr: "02", label: "Philosophie", href: "/lernen/lernseite-2/philosophische-perspektive" },
  { nr: "03", label: "Das Orakel", href: "/lernen/lernseite-2/das-orakel" },
];

export default function ModulMiniNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Die drei Seiten des Moduls"
      className="fixed right-4 top-20 z-40 hidden w-44 rounded-2xl border border-outline-variant bg-surface-bright p-sm shadow-lg md:right-6 lg:block"
    >
      <p className="px-sm pb-xs text-label-sm uppercase tracking-wider text-tertiary">
        Der Faden
      </p>
      {SEITEN.map((s) => {
        const aktiv = pathname === s.href;
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-current={aktiv ? "page" : undefined}
            className={
              "group flex items-center gap-sm rounded-lg px-sm py-xs text-label-md transition-colors " +
              (aktiv
                ? "bg-tertiary-container/50 text-on-surface"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface")
            }
          >
            <span
              className={aktiv ? "text-label-sm text-tertiary" : "text-label-sm text-tertiary/70"}
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              {s.nr}
            </span>
            {s.label}
            {aktiv ? (
              <span className="material-symbols-outlined ml-auto text-[16px] text-tertiary">
                my_location
              </span>
            ) : (
              <span className="material-symbols-outlined ml-auto text-[16px] text-on-surface-variant/50 transition-transform group-hover:translate-x-0.5 group-hover:text-tertiary">
                arrow_forward
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
