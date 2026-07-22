import Link from "next/link";

/**
 * ModulMiniNav — kleine, mitschwebende Navigation (oben rechts) auf die drei
 * Seiten des Moduls. Gedacht für den Hub «Eine ganz neue Partnerschaft»;
 * auf den Unterseiten übernimmt das Inhaltsverzeichnis-Klammersymbol.
 * Nur Theme-Tokens; auf schmalen Screens ausgeblendet (dort trägt die
 * Themen-Liste der Seite selbst).
 */
const SEITEN = [
  { nr: "01", label: "Vorhang auf", href: "/lernen/lernseite-2/vorhang-auf" },
  { nr: "02", label: "Philosophie", href: "/lernen/lernseite-2/philosophische-perspektive" },
  { nr: "03", label: "Das Orakel", href: "/lernen/lernseite-2/das-orakel" },
];

export default function ModulMiniNav() {
  return (
    <nav
      aria-label="Die drei Seiten des Moduls"
      className="fixed right-4 top-20 z-40 hidden w-44 rounded-2xl border border-outline-variant bg-surface-bright p-sm shadow-lg md:right-6 lg:block"
    >
      <p className="px-sm pb-xs text-label-sm uppercase tracking-wider text-tertiary">
        Der Faden
      </p>
      {SEITEN.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          className="group flex items-center gap-sm rounded-lg px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
        >
          <span
            className="text-label-sm text-tertiary"
            style={{ fontFamily: "ui-monospace, monospace" }}
          >
            {s.nr}
          </span>
          {s.label}
          <span className="material-symbols-outlined ml-auto text-[16px] text-on-surface-variant/50 transition-transform group-hover:translate-x-0.5 group-hover:text-tertiary">
            arrow_forward
          </span>
        </Link>
      ))}
    </nav>
  );
}
