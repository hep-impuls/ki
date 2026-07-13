"use client";

import { useEffect, useState } from "react";
import {
  leseSpurenIndices,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";

/**
 * BilderAnschauung — eine Bilderstrecke, die sich in einen Anschauungsmodus
 * öffnet: Ein Klick auf ein Bild legt es gross über die Seite (Lightbox);
 * darauf leuchten Hotspots, die man antippt — jeder erzählt etwas. Das
 * Ansehen eines Bildes wird registriert (fliesst als «Bilder» ins
 * Aktivitätsnetz). Nur Theme-Tokens; Bilder aus public/art (Nachweis je Bild).
 */

export interface AnschauHotspot {
  /** Position in Prozent der Bildfläche. */
  x: number;
  y: number;
  titel: string;
  text: string;
}

export interface AnschauBild {
  src: string;
  alt: string;
  titel: string;
  jahr: string;
  /** Kurze Bildunterschrift (Urheber / Motiv). */
  kurz: string;
  hotspots: AnschauHotspot[];
}

export default function BilderAnschauung({
  bilder,
  spurKey,
  className = "",
}: {
  bilder: AnschauBild[];
  /** Spur-Präfix, z.B. "vorhang-auf:bildnetz". */
  spurKey: string;
  className?: string;
}) {
  const [angeschaut, setAngeschaut] = useState<Set<number>>(new Set());
  const [offen, setOffen] = useState<number | null>(null);
  const [hot, setHot] = useState<number | null>(null);

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

  function oeffnen(i: number) {
    setOffen(i);
    setHot(null);
    if (!angeschaut.has(i)) {
      setAngeschaut((prev) => new Set(prev).add(i));
      merkeSpur(`${spurKey}:${i}`);
    }
  }
  function wechseln(richtung: number) {
    if (offen === null) return;
    const next = (offen + richtung + bilder.length) % bilder.length;
    setOffen(next);
    setHot(null);
    if (!angeschaut.has(next)) {
      setAngeschaut((prev) => new Set(prev).add(next));
      merkeSpur(`${spurKey}:${next}`);
    }
  }

  // Escape schliesst, Pfeiltasten blättern; Body-Scroll sperren, solange offen.
  useEffect(() => {
    if (offen === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOffen(null);
      else if (e.key === "ArrowRight") wechseln(1);
      else if (e.key === "ArrowLeft") wechseln(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offen, bilder.length]);

  const bild = offen !== null ? bilder[offen] : null;

  return (
    <section aria-label="Bilder im Anschauungsmodus" className={className}>
      <div className="mb-sm flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px] text-tertiary">
          gallery_thumbnail
        </span>
        {angeschaut.size === bilder.length
          ? `Alle ${bilder.length} Bilder angeschaut`
          : `${angeschaut.size} von ${bilder.length} Bildern angeschaut`}
      </div>

      <div className="grid gap-md sm:grid-cols-3">
        {bilder.map((b, i) => {
          const gesehen = angeschaut.has(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => oeffnen(i)}
              aria-label={`${b.titel} (${b.jahr}) im Anschauungsmodus öffnen`}
              className="group relative overflow-hidden rounded-xl border border-outline-variant bg-surface-bright text-left shadow-sm outline-none transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:-translate-y-0.5 focus-visible:shadow-lg"
            >
              <div className="relative aspect-[4/3] bg-surface-container-low">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.src}
                  alt={b.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-inverse-surface/0 transition-colors group-hover:bg-inverse-surface/25">
                  <span className="flex items-center gap-xs rounded-full bg-surface-bright/90 px-md py-xs text-label-md text-on-surface opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="material-symbols-outlined text-[18px] text-tertiary">
                      zoom_in
                    </span>
                    Anschauen
                  </span>
                </span>
                {gesehen && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-tertiary text-on-tertiary shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </span>
                )}
              </div>
              <div className="border-t border-outline-variant p-sm">
                <p className="flex items-baseline justify-between gap-sm">
                  <span className="truncate text-body-sm font-medium text-on-surface">
                    {b.titel}
                  </span>
                  <span className="flex-shrink-0 text-label-sm text-tertiary">{b.jahr}</span>
                </p>
                <p className="mt-xs flex items-center gap-xs text-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">
                    location_on
                  </span>
                  {b.hotspots.length} Punkte zum Entdecken
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="mt-xs text-label-sm text-on-surface-variant">
        Bild anklicken öffnet den Anschauungsmodus · darin die leuchtenden Punkte antippen
      </p>

      {/* ── Anschauungsmodus (Lightbox mit Hotspots) ──────────────────────── */}
      {bild && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-inverse-surface/95"
          role="dialog"
          aria-modal="true"
          aria-label={`${bild.titel} — Anschauungsmodus`}
        >
          {/* Kopfzeile */}
          <div className="flex items-center justify-between gap-md px-md py-sm text-inverse-on-surface">
            <div className="min-w-0">
              <p className="truncate text-body-lg font-medium">
                {bild.titel}
                <span className="ml-sm text-label-md opacity-70">{bild.jahr}</span>
              </p>
              <p className="truncate text-label-sm opacity-70">{bild.kurz}</p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-sm">
              <span
                className="text-label-md opacity-80"
                style={{ fontFamily: "ui-monospace, monospace" }}
              >
                {(offen ?? 0) + 1}/{bilder.length}
              </span>
              <button
                type="button"
                onClick={() => setOffen(null)}
                aria-label="Anschauungsmodus schliessen"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-inverse-on-surface/30 text-inverse-on-surface transition-colors hover:bg-inverse-on-surface/15"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          {/* Bildbühne */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 sm:px-md">
            {bilder.length > 1 && (
              <button
                type="button"
                onClick={() => wechseln(-1)}
                aria-label="Vorheriges Bild"
                className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-inverse-on-surface/30 bg-inverse-surface/40 text-inverse-on-surface transition-colors hover:bg-inverse-surface/70 sm:left-4"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
            )}

            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bild.src}
                alt={bild.alt}
                className="block max-h-[64vh] max-w-[88vw] rounded-lg object-contain"
              />
              {bild.hotspots.map((h, hi) => {
                const aktiv = hot === hi;
                return (
                  <button
                    key={hi}
                    type="button"
                    onClick={() => setHot(aktiv ? null : hi)}
                    aria-label={`Hotspot: ${h.titel}`}
                    aria-pressed={aktiv}
                    className="absolute -translate-x-1/2 -translate-y-1/2 outline-none"
                    style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  >
                    <span className="relative flex h-7 w-7 items-center justify-center">
                      {!aktiv && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-50 motion-reduce:hidden" />
                      )}
                      <span
                        className={
                          "relative flex h-7 w-7 items-center justify-center rounded-full border-2 text-label-sm font-semibold shadow-md transition-transform " +
                          (aktiv
                            ? "scale-110 border-on-tertiary bg-tertiary text-on-tertiary"
                            : "border-surface-bright bg-tertiary/90 text-on-tertiary hover:scale-110")
                        }
                        style={{ fontFamily: "ui-monospace, monospace" }}
                      >
                        {hi + 1}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {bilder.length > 1 && (
              <button
                type="button"
                onClick={() => wechseln(1)}
                aria-label="Nächstes Bild"
                className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-inverse-on-surface/30 bg-inverse-surface/40 text-inverse-on-surface transition-colors hover:bg-inverse-surface/70 sm:right-4"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            )}
          </div>

          {/* Erzähl-Leiste unten */}
          <div className="min-h-[92px] border-t border-inverse-on-surface/15 px-md py-md">
            {hot !== null && bild.hotspots[hot] ? (
              <div className="animate-frame-in mx-auto flex max-w-3xl items-start gap-md text-inverse-on-surface">
                <span
                  className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-tertiary text-on-tertiary"
                  style={{ fontFamily: "ui-monospace, monospace" }}
                >
                  {hot + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-body-md font-semibold">{bild.hotspots[hot].titel}</p>
                  <p className="mt-xs text-body-sm leading-relaxed opacity-90">
                    {bild.hotspots[hot].text}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mx-auto flex max-w-3xl items-center gap-sm text-body-sm text-inverse-on-surface opacity-75">
                <span className="material-symbols-outlined text-[20px]">touch_app</span>
                Tippe die leuchtenden Punkte an — jeder erzählt etwas über das,
                worin die neue Akteurin verwoben ist.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
