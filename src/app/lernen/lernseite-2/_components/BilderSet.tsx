"use client";

import { useEffect, useState } from "react";
import {
  leseSpurenIndices,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";

/**
 * BilderSet — eine Bilderstrecke zwischen den Aktivitäten: die gemeinfreien
 * historischen Bilder als Set, das man seitwärts durchgeht. Fährt man über
 * ein Bild (oder fokussiert/tippt es), erscheint die Erklärung und das Bild
 * gilt als «angeschaut». Jedes angeschaute Bild wird dreifach registriert
 * (_lib/spuren.ts) und fliesst als «Bilder» ins Aktivitätsnetz.
 *
 * Nur Theme-Tokens; Bilder aus public/art/storyboard (Nachweis je Bild).
 */

export interface Bild {
  src: string;
  alt: string;
  titel: string;
  jahr: string;
  erklaerung: string;
  credit: string;
}

export default function BilderSet({
  bilder,
  spurKey,
  className = "",
}: {
  bilder: Bild[];
  /** Spur-Präfix, z.B. "vorhang-auf:bild". */
  spurKey: string;
  className?: string;
}) {
  const [angeschaut, setAngeschaut] = useState<Set<number>>(new Set());

  useEffect(() => {
    function restore() {
      const idx = leseSpurenIndices(spurKey).filter((i) => i >= 0 && i < bilder.length);
      if (idx.length === 0) return;
      setAngeschaut((prev) => {
        const nx = new Set(prev);
        idx.forEach((i) => nx.add(i));
        return nx;
      });
    }
    restore();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [spurKey, bilder.length]);

  function ansehen(i: number) {
    if (angeschaut.has(i)) return;
    setAngeschaut((prev) => new Set(prev).add(i));
    merkeSpur(`${spurKey}:${i}`);
  }

  return (
    <section aria-label="Bilderstrecke" className={className}>
      <div className="mb-sm flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px] text-tertiary">
          photo_library
        </span>
        {angeschaut.size === bilder.length
          ? `Alle ${bilder.length} Bilder angeschaut`
          : `${angeschaut.size} von ${bilder.length} Bildern angeschaut`}
      </div>

      <div className="-mx-sm flex snap-x snap-mandatory gap-md overflow-x-auto px-sm pb-sm">
        {bilder.map((b, i) => {
          const gesehen = angeschaut.has(i);
          return (
            <figure
              key={i}
              tabIndex={0}
              onMouseEnter={() => ansehen(i)}
              onFocus={() => ansehen(i)}
              onClick={() => ansehen(i)}
              className="group relative w-60 flex-shrink-0 snap-start overflow-hidden rounded-xl border border-outline-variant bg-surface-bright shadow-sm outline-none transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:-translate-y-0.5 focus-visible:shadow-lg"
            >
              <div className="relative aspect-[4/3] bg-surface-container-low">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.src}
                  alt={b.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {/* Erklärung — auf Hover/Fokus */}
                <figcaption className="absolute inset-0 flex flex-col justify-end bg-inverse-surface/85 p-md text-inverse-on-surface opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <p className="text-label-sm uppercase tracking-wider opacity-80">
                    {b.jahr}
                  </p>
                  <p className="text-body-md font-semibold">{b.titel}</p>
                  <p className="mt-xs text-body-sm leading-relaxed">{b.erklaerung}</p>
                </figcaption>
                {/* «angeschaut»-Marke */}
                {gesehen && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-tertiary text-on-tertiary shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </span>
                )}
              </div>
              {/* Titelzeile — immer sichtbar */}
              <figcaption className="flex items-baseline justify-between gap-sm border-t border-outline-variant p-sm">
                <span className="truncate text-body-sm font-medium text-on-surface">
                  {b.titel}
                </span>
                <span className="flex-shrink-0 text-label-sm text-tertiary">{b.jahr}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <p className="mt-xs text-label-sm text-on-surface-variant">
        Über ein Bild fahren erklärt es · seitwärts blättern, um durchzugehen
      </p>
    </section>
  );
}
