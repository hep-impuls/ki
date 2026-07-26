"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * HoverTipp — ein unterstrichenes Wort, das bei Hover, Fokus oder Antippen eine
 * Kurzerklärung zeigt. Grundlage für das Glossar (`Begriff`) und die
 * Kurzbiografien (`DenkerHover`).
 *
 * **Warum ein Portal.** Ein `absolute` positionierter Tooltip wird von jedem
 * Vorfahren mit `overflow-hidden` abgeschnitten, und genau das haben die Karten
 * dieses Lernsets, damit ihre runden Ecken sauber bleiben. Der Tooltip
 * verschwand darum hinter dem Kartenrahmen. Er wird deshalb `fixed` an
 * `document.body` gehängt und bei jedem Öffnen an der Position des Wortes
 * ausgemessen. Beim Scrollen und bei Grössenänderungen wird nachgemessen.
 *
 * Die Erklärung steht zusätzlich im `aria-label` des Knopfes; für Screenreader
 * ist der Tooltip damit reine Doppelung und bleibt `pointer-events-none`.
 */

const RAND = 8;

export default function HoverTipp({
  wort,
  inhalt,
  breite = 224,
  className = "",
}: {
  /** Das sichtbare, unterstrichene Wort. */
  wort: string;
  /** Die Kurzerklärung im Tooltip. */
  inhalt: string;
  /** Wunschbreite des Tooltips in px; wird auf die Fensterbreite begrenzt. */
  breite?: number;
  className?: string;
}) {
  const [offen, setOffen] = useState(false);
  const [rahmen, setRahmen] = useState<{
    left: number;
    top: number;
    breite: number;
    nachOben: boolean;
  } | null>(null);
  const ref = useRef<HTMLButtonElement>(null);

  const messen = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const b = Math.min(breite, window.innerWidth - 2 * RAND);
    // Waagrecht am Wort zentrieren, aber im Fenster halten.
    const mitte = r.left + r.width / 2;
    const left = Math.min(
      Math.max(RAND, mitte - b / 2),
      Math.max(RAND, window.innerWidth - b - RAND),
    );
    // Dorthin öffnen, wo mehr Platz ist.
    const nachOben = r.top > window.innerHeight - r.bottom;
    setRahmen({ left, breite: b, nachOben, top: nachOben ? r.top - RAND : r.bottom + RAND });
  }, [breite]);

  useEffect(() => {
    if (!offen) return;
    messen();
    const beiEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOffen(false);
    };
    // `true` = auch beim Scrollen in inneren Containern nachmessen.
    window.addEventListener("scroll", messen, true);
    window.addEventListener("resize", messen);
    window.addEventListener("keydown", beiEscape);
    return () => {
      window.removeEventListener("scroll", messen, true);
      window.removeEventListener("resize", messen);
      window.removeEventListener("keydown", beiEscape);
    };
  }, [offen, messen]);

  return (
    <span className={"relative inline-block " + className}>
      <button
        ref={ref}
        type="button"
        aria-label={`${wort}: ${inhalt}`}
        aria-expanded={offen}
        onMouseEnter={() => setOffen(true)}
        onMouseLeave={() => setOffen(false)}
        onFocus={() => setOffen(true)}
        onBlur={() => setOffen(false)}
        onClick={(e) => {
          e.preventDefault();
          setOffen((o) => !o);
        }}
        className="cursor-help border-b border-dotted border-tertiary font-medium text-inherit outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-tertiary"
      >
        {wort}
      </button>

      {offen &&
        rahmen &&
        createPortal(
          <span
            role="tooltip"
            style={{
              left: rahmen.left,
              top: rahmen.top,
              width: rahmen.breite,
              transform: rahmen.nachOben ? "translateY(-100%)" : undefined,
            }}
            className="pointer-events-none fixed z-[110] rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs text-left text-label-sm font-normal leading-snug text-on-surface shadow-lg"
          >
            {inhalt}
          </span>,
          document.body,
        )}
    </span>
  );
}
