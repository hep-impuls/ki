"use client";

import { useEffect, useState } from "react";
import {
  leseSpuren,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";

/**
 * VideoImpuls — ein kurzes Erklär-Video als Einstieg/Impuls einer Seite.
 *
 * Datenschutzfreundliche Zwei-Klick-Lösung (Schulkontext): Beim Laden der
 * Seite wird NICHTS von YouTube geladen — nur eine eigene Vorschau-Fläche
 * mit Play-Knopf (Theme-Tokens). Erst der Klick lädt das Video als iframe
 * von youtube-nocookie.com und markiert es als «geschaut» (Spur `video:…`,
 * dreifach registriert wie alles: lokal, anonymer Zähler, Cloud-Spiegel).
 * Das Schauen zählt als eigene Kategorie im Aktivitätsnetz und erscheint
 * im Orakel-Dashboard.
 *
 * Ohne `videoId` zeigt die Komponente einen deutlichen Platzhalter
 * («Video folgt») — die YouTube-ID wird später einfach als Prop ergänzt.
 */

export default function VideoImpuls({
  titel,
  beschreibung,
  videoId,
  spurId,
  className = "",
}: {
  titel: string;
  beschreibung?: string;
  /** YouTube-Video-ID (der Teil nach `watch?v=`). Fehlt sie: Platzhalter. */
  videoId?: string;
  /** Spur-ID fürs «geschaut», z.B. "video:hub". */
  spurId: string;
  className?: string;
}) {
  const [laeuft, setLaeuft] = useState(false);
  const [geschaut, setGeschaut] = useState(false);

  useEffect(() => {
    function restore() {
      if (leseSpuren().some((s) => s.id === spurId)) setGeschaut(true);
    }
    restore();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [spurId]);

  function abspielen() {
    if (!videoId) return;
    setLaeuft(true);
    if (!geschaut) {
      setGeschaut(true);
      merkeSpur(spurId);
    }
  }

  return (
    <section aria-label={`Video: ${titel}`} className={className}>
      <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
        <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
          <span className="material-symbols-outlined text-[18px]">smart_display</span>
          Video-Impuls
        </p>
        {geschaut && (
          <p className="flex items-center gap-xs text-label-md text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-tertiary">
              check_circle
            </span>
            geschaut
          </p>
        )}
      </div>

      <div className="max-w-3xl overflow-hidden rounded-xl border border-outline-variant bg-surface-bright shadow-sm">
        <div className="relative aspect-video bg-surface-container-low">
          {laeuft && videoId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              title={titel}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={abspielen}
              disabled={!videoId}
              aria-label={
                videoId
                  ? `Video «${titel}» abspielen (lädt YouTube)`
                  : "Video folgt — noch kein Video hinterlegt"
              }
              className={
                "group absolute inset-0 flex flex-col items-center justify-center gap-sm " +
                (videoId ? "cursor-pointer" : "cursor-default")
              }
            >
              {/* dezentes Gewebe im Hintergrund der Vorschau */}
              <svg
                viewBox="0 0 320 180"
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 130 L60 40 L130 140 L200 30 L265 135 L320 55"
                  fill="none"
                  strokeWidth="1"
                  className="stroke-outline-variant"
                />
                <circle cx="60" cy="40" r="3" className="fill-outline" opacity="0.5" />
                <circle cx="200" cy="30" r="3" className="fill-outline" opacity="0.5" />
                <circle cx="265" cy="135" r="3" className="fill-outline" opacity="0.5" />
              </svg>
              <span
                className={
                  "relative flex h-16 w-16 items-center justify-center rounded-full shadow-md transition-transform " +
                  (videoId
                    ? "bg-tertiary text-on-tertiary group-hover:scale-110 group-focus-visible:scale-110"
                    : "bg-surface-container-high text-on-surface-variant")
                }
              >
                <span className="material-symbols-outlined text-[36px]">play_arrow</span>
              </span>
              {!videoId && (
                <span className="relative rounded-full border border-dashed border-outline-variant bg-surface-bright/85 px-md py-xs text-label-md text-on-surface-variant">
                  Platzhalter — Video folgt
                </span>
              )}
              {videoId && (
                <span className="relative text-label-md text-on-surface-variant">
                  Abspielen lädt das Video von YouTube
                </span>
              )}
            </button>
          )}
        </div>
        <div className="border-t border-outline-variant p-md">
          <p className="text-body-md font-medium text-on-surface">{titel}</p>
          {beschreibung && (
            <p className="mt-xs text-body-sm text-on-surface-variant">{beschreibung}</p>
          )}
        </div>
      </div>
    </section>
  );
}
