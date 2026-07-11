"use client";

import { useState } from "react";

/**
 * KnotenNetz — die Signatur-Konstellationen (Gewebe.tsx) in gross und
 * interaktiv bedienbar: Jeder Knoten lässt sich antippen (oder per Tastatur
 * fokussieren) und zeigt in der Karte darunter seine Bedeutung; besuchte
 * Knoten bleiben markiert («n von m Knoten entdeckt»). Optional trägt ein
 * Knoten ein Sprungziel (DOM-id) — dann bietet die Karte einen
 * «Hinspringen»-Knopf (z.B. zur Epoche im Zeitstrahl).
 *
 * Gestaltung wie Gewebe.tsx: nur Theme-Tokens, feine Linien + Knoten, keine
 * Verläufe/Filter, alle Koordinaten deterministisch (viewBox 240×192 —
 * die Signaturen im Massstab 2:1).
 */

export interface NetzKnoten {
  x: number;
  y: number;
  /** Kurzer Titel (erscheint in der Karte, optional als Beschriftung). */
  titel: string;
  /** Erklärtext in der Karte. */
  text: string;
  /** Hervorgehobener Knoten (Tertiary statt Outline). */
  akzent?: boolean;
  /** Optionales Beschriftungs-Label direkt im SVG (kurz halten). */
  label?: string;
  /** Optionale DOM-id: Karte zeigt dann einen Sprung-Knopf dorthin. */
  ziel?: string;
}

export default function KnotenNetz({
  knoten,
  deko,
  dekoFein = [],
  einladung,
  sprungLabel = "Hinspringen",
  className = "",
}: {
  knoten: NetzKnoten[];
  /** Fäden als SVG-Pfade (stroke-outline-variant). */
  deko: string[];
  /** Feinere Nebenfäden (halbtransparent). */
  dekoFein?: string[];
  /** Text der Karte, solange noch kein Knoten gewählt ist. */
  einladung: string;
  sprungLabel?: string;
  className?: string;
}) {
  const n = knoten.length;
  const [active, setActive] = useState<number | null>(null);
  const [visited, setVisited] = useState<Set<number>>(new Set());

  function reveal(i: number) {
    setVisited((prev) => new Set(prev).add(i));
    setActive(i);
  }

  function springe(ziel: string) {
    const el = document.getElementById(ziel);
    if (!el) return;
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "start" });
    if (ruhig) return;
    // Fallback: manche Umgebungen ignorieren behavior:"smooth" komplett —
    // wenn sich nach kurzer Zeit nichts bewegt hat, hart springen.
    const vorher = el.getBoundingClientRect().top;
    window.setTimeout(() => {
      const nachher = el.getBoundingClientRect().top;
      if (Math.abs(nachher - vorher) < 2 && Math.abs(nachher) > 160) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }, 350);
  }

  const done = visited.size === n;
  const aktiv = active !== null ? knoten[active] : null;

  return (
    <div className={className}>
      <p className="mb-sm flex items-center gap-xs text-label-sm uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[16px] text-tertiary">
          {done ? "done_all" : "touch_app"}
        </span>
        {done
          ? `Alle ${n} Knoten entdeckt`
          : visited.size > 0
          ? `${visited.size} von ${n} Knoten entdeckt`
          : "Tippe die Knoten an"}
      </p>

      <svg
        viewBox="0 0 240 192"
        className="block h-44 w-auto max-w-full select-none sm:h-52"
        role="group"
        aria-label="Interaktive Knoten-Konstellation"
      >
        {deko.map((d, i) => (
          <path
            key={`d${i}`}
            d={d}
            fill="none"
            strokeWidth="1"
            className="stroke-outline-variant"
          />
        ))}
        {dekoFein.map((d, i) => (
          <path
            key={`f${i}`}
            d={d}
            fill="none"
            strokeWidth="0.75"
            className="stroke-outline-variant"
            opacity="0.5"
          />
        ))}

        {knoten.map((k, i) => {
          const reached = visited.has(i);
          const isActive = active === i;
          const ton = k.akzent || reached;
          return (
            <g
              key={i}
              tabIndex={0}
              role="button"
              aria-label={`Knoten ${i + 1} von ${n}: ${k.titel}`}
              onClick={() => reveal(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  reveal(i);
                }
              }}
              className="group cursor-pointer outline-none"
            >
              {/* grosszügige unsichtbare Trefferfläche */}
              <circle cx={k.x} cy={k.y} r="22" fill="transparent" />
              {isActive && (
                <circle
                  cx={k.x}
                  cy={k.y}
                  r="15"
                  fill="none"
                  strokeWidth="1"
                  className="stroke-tertiary"
                  opacity="0.5"
                />
              )}
              {k.akzent && (
                <circle
                  cx={k.x}
                  cy={k.y}
                  r="11"
                  fill="none"
                  strokeWidth="1"
                  className="stroke-tertiary transition-opacity duration-300 group-hover:opacity-90"
                  opacity="0.45"
                />
              )}
              <circle
                cx={k.x}
                cy={k.y}
                r={k.akzent ? 6.5 : 5}
                className={
                  (ton ? "fill-tertiary" : "fill-outline") +
                  " origin-center [transform-box:fill-box] transition-transform duration-300 group-hover:scale-125 group-focus-visible:scale-125"
                }
                opacity={ton ? 1 : 0.65}
              />
              {k.label && (
                <text
                  x={k.x}
                  y={k.y + 22}
                  textAnchor="middle"
                  fontSize="11"
                  className="fill-on-surface-variant"
                >
                  {k.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Erklär-Karte */}
      <div
        aria-live="polite"
        className="mt-sm min-h-[104px] max-w-3xl rounded-xl border border-outline-variant bg-surface-container-low p-md"
      >
        {aktiv === null ? (
          <p className="flex items-start gap-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-tertiary">
              explore
            </span>
            {einladung}
          </p>
        ) : (
          <div key={active} className="animate-frame-in">
            <p className="text-body-md font-semibold text-on-surface">
              {aktiv.titel}
            </p>
            <p className="mt-xs text-body-sm text-on-surface-variant">
              {aktiv.text}
            </p>
            {aktiv.ziel && (
              <button
                type="button"
                onClick={() => springe(aktiv.ziel!)}
                className="mt-sm inline-flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs text-label-md text-tertiary transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[16px]">
                  arrow_downward
                </span>
                {sprungLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
