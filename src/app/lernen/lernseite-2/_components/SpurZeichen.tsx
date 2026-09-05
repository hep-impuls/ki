"use client";

/**
 * SpurZeichen — die drei Zeichen am Kopf einer eingesammelten Karte:
 * angeklickt (Fussspur), weitergelesen (Buch), weiterverfolgt (Merkzeichen).
 *
 * Noch nicht Getanes bleibt blass stehen, damit sichtbar ist, was an diesem
 * Punkt noch möglich wäre — Christofs Muster aus dem Ernährungs-Teppich
 * (2026-09-05), übernommen für Teppich, KI-Story und Wege der Orientierung.
 * Die Zeichen sind reine Anzeige, geklickt wird auf der Karte selbst; für
 * Screenreader fasst ein unsichtbarer Satz den Stand zusammen.
 */
export default function SpurZeichen({
  angeklickt = true,
  weitergelesen,
  weiterverfolgt,
  /** Faden-/Themenfarbe der getanen Zeichen, als Text-Token-Klasse. */
  farbKlasse = "text-tertiary",
  className = "",
}: {
  angeklickt?: boolean;
  weitergelesen: boolean;
  weiterverfolgt: boolean;
  farbKlasse?: string;
  className?: string;
}) {
  const zeichen = [
    { getan: angeklickt, icon: "footprint", was: "angeklickt" },
    { getan: weitergelesen, icon: "menu_book", was: "weitergelesen" },
    { getan: weiterverfolgt, icon: "bookmark_added", was: "weiterverfolgt" },
  ] as const;
  return (
    <span className={"flex flex-shrink-0 items-center gap-[2px] " + className}>
      {zeichen.map((z) => (
        <span
          key={z.icon}
          title={z.getan ? z.was : `noch nicht ${z.was}`}
          aria-hidden="true"
          className={
            "material-symbols-outlined text-[17px] " +
            (z.getan ? farbKlasse : "text-outline-variant opacity-60")
          }
        >
          {z.icon}
        </span>
      ))}
      <span className="sr-only">
        {zeichen
          .filter((z) => z.getan)
          .map((z) => z.was)
          .join(", ") || "noch nichts davon"}
      </span>
    </span>
  );
}

/** Die Legende zu den drei Zeichen, einmal über der Liste. */
export function SpurZeichenLegende({ className = "" }: { className?: string }) {
  return (
    <p
      className={
        "flex flex-wrap items-center gap-x-md gap-y-xs text-label-sm text-on-surface-variant " +
        className
      }
    >
      {(
        [
          { icon: "footprint", text: "angeklickt" },
          { icon: "menu_book", text: "weitergelesen" },
          { icon: "bookmark_added", text: "weiterverfolgt" },
        ] as const
      ).map((z) => (
        <span key={z.icon} className="inline-flex items-center gap-[3px]">
          <span className="material-symbols-outlined text-[15px]">{z.icon}</span>
          {z.text}
        </span>
      ))}
      <span className="opacity-70">Blass heisst noch offen.</span>
    </p>
  );
}
