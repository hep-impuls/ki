"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { merkeSpur } from "../../_lib/spuren";
import { merkeInhalt } from "../../_lib/inhalte";

/**
 * BildZoom — Vollbild-Viewer im Stil von Google Arts & Culture für die
 * Epochen-Galerien: frei zoombar (Mausrad / Pinch / Doppelklick, Ziehen zum
 * Verschieben) und — wo kuratiert — mit einer «Führung»: die Ansicht fährt
 * animiert von Detail zu Detail, je mit kurzem Erklärtext im Kontext der Seite.
 *
 * Self-contained (kein OpenSeadragon o.ä.): CSS-Transform (translate+scale)
 * über dem contain-gefitteten Bild. Tour-Stopps sind Prozent-Koordinaten auf
 * dem Bild (x/y 0–100, von Hand gesetzt — in den Daten justierbar).
 */

export interface TourStop {
  /** Fokuspunkt in % der Bildbreite/-höhe (0–100). */
  x: number;
  y: number;
  /** Zielzoom (1 = eingepasst). */
  zoom: number;
  title: string;
  text: string;
}

export interface ZoomImg {
  src: string;
  alt: string;
  credit: string;
  caption: string;
  tour?: TourStop[];
  /** Abschluss-Text: verknüpft das Bild mit Technik & Verunsicherung der Epoche. */
  contextNote?: string;
}

interface Props {
  images: ZoomImg[];
  startIdx: number;
  epoch: string;
  onClose: () => void;
  /** Spur-Präfix dieser Galerie, z.B. "philosophische-perspektive:epochen-bild:2".
   *  Jeder besuchte Führungs-Stopp zählt als Bildpunkt (`…:<bildIdx>:hs<stop>`). */
  spurKey?: string;
}

interface View {
  z: number;
  tx: number;
  ty: number;
}

const MIN_Z = 1;
const MAX_Z = 4;

export default function BildZoom({ images, startIdx, epoch, onClose, spurKey }: Props) {
  const [idx, setIdx] = useState(startIdx);
  const img = images[idx];
  // Effektive Führung: an eine kuratierte Tour wird — wenn vorhanden — ein
  // abschliessender «Im Kontext der Zeit»-Stopp angehängt, der das Bild mit der
  // technischen Errungenschaft und der gesellschaftlichen Verunsicherung der
  // Epoche verknüpft (Gesamtblick, zoom 1).
  const tour = useMemo(() => {
    if (!img.tour) return null;
    if (!img.contextNote) return img.tour;
    return [
      ...img.tour,
      {
        x: 50,
        y: 50,
        zoom: 1,
        title: "Im Kontext der Zeit",
        text: img.contextNote,
      },
    ];
  }, [img]);

  const [tourIdx, setTourIdx] = useState<number | null>(null);
  const [view, setView] = useState<View>({ z: 1, tx: 0, ty: 0 });
  const [animate, setAnimate] = useState(false);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isFs, setIsFs] = useState(false);
  const viewRef = useRef(view);
  viewRef.current = view;
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDist = useRef<number | null>(null);

  // Echtes Vollbild (Fullscreen-API) — Status spiegeln, beim Schliessen verlassen
  useEffect(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);

  const toggleFs = useCallback(() => {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else rootRef.current?.requestFullscreen?.();
    } catch {
      /* Fullscreen nicht verfügbar — In-Page-Overlay bleibt bestehen. */
    }
  }, []);

  // Container-Grösse beobachten
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () =>
      setBox({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Contain-Fit des Bilds im Container (Letterbox-Offsets)
  const fit =
    natural && box
      ? (() => {
          const s = Math.min(box.w / natural.w, box.h / natural.h);
          const w = natural.w * s;
          const h = natural.h * s;
          return { w, h, x: (box.w - w) / 2, y: (box.h - h) / 2 };
        })()
      : null;
  const fitRef = useRef(fit);
  fitRef.current = fit;

  /** Translation so klemmen, dass das Bild sichtbar/zentriert bleibt. */
  const clamp = useCallback((v: View): View => {
    const f = fitRef.current;
    const el = containerRef.current;
    if (!f || !el) return v;
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    const sw = f.w * v.z;
    const sh = f.h * v.z;
    let tx = v.tx;
    let ty = v.ty;
    if (sw <= cw) tx = cw / 2 - v.z * (f.x + f.w / 2);
    else tx = Math.min(-v.z * f.x, Math.max(cw - v.z * (f.x + f.w), tx));
    if (sh <= ch) ty = ch / 2 - v.z * (f.y + f.h / 2);
    else ty = Math.min(-v.z * f.y, Math.max(ch - v.z * (f.y + f.h), ty));
    return { z: v.z, tx, ty };
  }, []);

  /** Um einen Bildschirmpunkt herum zoomen. */
  const zoomAt = useCallback(
    (cx: number, cy: number, nextZ: number, withAnim = false) => {
      const v = viewRef.current;
      const z = Math.min(MAX_Z, Math.max(MIN_Z, nextZ));
      const k = z / v.z;
      setAnimate(withAnim);
      setView(
        clamp({ z, tx: cx - (cx - v.tx) * k, ty: cy - (cy - v.ty) * k })
      );
    },
    [clamp]
  );

  /** Auf einen Tour-Stopp fahren (Bildpunkt in % → Bildschirmmitte). */
  const focusStop = useCallback(
    (stop: TourStop) => {
      const f = fitRef.current;
      const el = containerRef.current;
      if (!f || !el) return;
      const X = f.x + (stop.x / 100) * f.w;
      const Y = f.y + (stop.y / 100) * f.h;
      const z = Math.min(MAX_Z, Math.max(MIN_Z, stop.zoom));
      setAnimate(true);
      setView(
        clamp({
          z,
          tx: el.clientWidth / 2 - z * X,
          ty: el.clientHeight / 2 - z * Y,
        })
      );
    },
    [clamp]
  );

  const resetView = useCallback((withAnim = true) => {
    setAnimate(withAnim);
    setView({ z: 1, tx: 0, ty: 0 });
  }, []);

  // Bildwechsel: Ansicht + Tour zurücksetzen
  const gotoImage = useCallback(
    (next: number) => {
      setIdx((next + images.length) % images.length);
      setTourIdx(null);
      setNatural(null);
      setAnimate(false);
      setView({ z: 1, tx: 0, ty: 0 });
    },
    [images.length]
  );

  // Tour-Navigation
  const startTour = useCallback(() => {
    if (!tour || tour.length === 0) return;
    setTourIdx(0);
    focusStop(tour[0]);
  }, [tour, focusStop]);

  const stepTour = useCallback(
    (dir: 1 | -1) => {
      if (!tour || tourIdx === null) return;
      const next = tourIdx + dir;
      if (next < 0) return;
      if (next >= tour.length) {
        setTourIdx(null);
        resetView();
        return;
      }
      setTourIdx(next);
      focusStop(tour[next]);
    },
    [tour, tourIdx, focusStop, resetView]
  );

  // Tastatur
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        if (tourIdx !== null) stepTour(1);
        else gotoImage(idx + 1);
      }
      if (e.key === "ArrowLeft") {
        if (tourIdx !== null) stepTour(-1);
        else gotoImage(idx - 1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, tourIdx, stepTour, gotoImage, idx]);

  // Jeder besuchte Führungs-Stopp zählt als Bildpunkt (wie die Hotspots der
  // KI-Geschichte). Basis-ID pro Bild wird mit dem Bildtitel registriert, damit
  // die Knotenkarte den Punkt konkret benennen kann.
  useEffect(() => {
    if (!spurKey || tourIdx === null) return;
    const base = `${spurKey}:${idx}`;
    merkeInhalt(base, `${epoch} — ${img.alt}`);
    merkeSpur(`${base}:hs${tourIdx}`);
    // img.alt (primitiv) statt img (bei jedem Render neue Referenz) → der
    // Effekt läuft nur bei echtem Bild-/Stopp-Wechsel, nicht beim Zoomen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spurKey, idx, tourIdx, epoch, img.alt]);

  // Body-Scroll sperren, solange offen — und die Scrollposition merken/
  // wiederherstellen, damit man beim Schliessen NICHT an den Seitenanfang
  // zurückfällt, sondern bei der Epoche bleibt. Nur einmal (Mount/Unmount).
  useEffect(() => {
    const y = window.scrollY;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      window.scrollTo(0, y);
    };
  }, []);

  // Mausrad-Zoom (non-passive, um Seiten-Scroll zu verhindern)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const v = viewRef.current;
      zoomAt(
        e.clientX - rect.left,
        e.clientY - rect.top,
        v.z * Math.exp(-e.deltaY * 0.0018)
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // Ziehen + Pinch
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) setDragging(true);
    pinchDist.current = null;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const p = pointers.current.get(e.pointerId);
    if (!p) return;
    const els = containerRef.current;
    if (!els) return;

    if (pointers.current.size === 2) {
      // Pinch-Zoom
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [a, b] = Array.from(pointers.current.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const rect = els.getBoundingClientRect();
      const midX = (a.x + b.x) / 2 - rect.left;
      const midY = (a.y + b.y) / 2 - rect.top;
      if (pinchDist.current !== null && pinchDist.current > 0) {
        zoomAt(midX, midY, viewRef.current.z * (dist / pinchDist.current));
      }
      pinchDist.current = dist;
      return;
    }

    // Ziehen
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const v = viewRef.current;
    setAnimate(false);
    setView(clamp({ z: v.z, tx: v.tx + dx, ty: v.ty + dy }));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) setDragging(false);
    pinchDist.current = null;
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const v = viewRef.current;
    if (v.z > 1.05) resetView();
    else
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, 2.4, true);
  };

  const stop = tour && tourIdx !== null ? tour[tourIdx] : null;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${img.alt} — Vollbild`}
      className="fixed inset-0 z-[100] flex flex-col bg-inverse-surface"
    >
      {/* Kopfzeile */}
      <div className="flex flex-wrap items-center gap-sm p-md">
        <span className="rounded-xl bg-inverse-on-surface/10 px-md py-sm text-label-md text-inverse-on-surface">
          {epoch} · {idx + 1} / {images.length}
        </span>
        {tour && tourIdx === null && (
          <button
            type="button"
            onClick={startTour}
            className="inline-flex items-center gap-xs rounded-xl bg-tertiary px-md py-sm text-label-md text-on-tertiary shadow-sm transition hover:bg-on-tertiary-container"
          >
            <span className="material-symbols-outlined text-[18px]">tour</span>
            Führung starten
          </button>
        )}
        <span className="hidden text-label-sm text-inverse-on-surface/70 md:inline">
          Ziehen zum Verschieben · Scrollen/Pinch zum Zoomen · Doppelklick
        </span>
        <span className="ml-auto flex items-center gap-xs">
          <button
            type="button"
            onClick={() => {
              const el = containerRef.current;
              if (!el) return;
              zoomAt(el.clientWidth / 2, el.clientHeight / 2, viewRef.current.z * 1.5, true);
            }}
            aria-label="Hineinzoomen"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-inverse-on-surface/10 text-inverse-on-surface transition hover:bg-inverse-on-surface/20"
          >
            <span className="material-symbols-outlined text-[20px]">zoom_in</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const el = containerRef.current;
              if (!el) return;
              zoomAt(el.clientWidth / 2, el.clientHeight / 2, viewRef.current.z / 1.5, true);
            }}
            aria-label="Herauszoomen"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-inverse-on-surface/10 text-inverse-on-surface transition hover:bg-inverse-on-surface/20"
          >
            <span className="material-symbols-outlined text-[20px]">zoom_out</span>
          </button>
          <button
            type="button"
            onClick={() => resetView()}
            aria-label="Ansicht einpassen"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-inverse-on-surface/10 text-inverse-on-surface transition hover:bg-inverse-on-surface/20"
          >
            <span className="material-symbols-outlined text-[20px]">
              fit_screen
            </span>
          </button>
          <button
            type="button"
            onClick={toggleFs}
            aria-label={isFs ? "Vollbild verlassen" : "Ganzer Bildschirm"}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-inverse-on-surface/10 text-inverse-on-surface transition hover:bg-inverse-on-surface/20"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isFs ? "fullscreen_exit" : "fullscreen"}
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Ansicht schliessen"
            className="inline-flex items-center gap-xs rounded-xl bg-inverse-on-surface/10 px-md py-sm text-label-md text-inverse-on-surface transition hover:bg-inverse-on-surface/20"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
            Schliessen
          </button>
        </span>
      </div>

      {/* Bühne */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={onDoubleClick}
          className="absolute inset-0 overflow-hidden"
          style={{
            touchAction: "none",
            cursor: dragging ? "grabbing" : "grab",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.z})`,
              transformOrigin: "0 0",
              transition: animate
                ? "transform 800ms cubic-bezier(0.4, 0, 0.2, 1)"
                : "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt}
              draggable={false}
              onLoad={(e) =>
                setNatural({
                  w: e.currentTarget.naturalWidth,
                  h: e.currentTarget.naturalHeight,
                })
              }
              className="absolute select-none"
              style={
                fit
                  ? { left: fit.x, top: fit.y, width: fit.w, height: fit.h }
                  : { opacity: 0 }
              }
            />
            {/* Fokus-Marker während der Führung */}
            {stop && fit && (
              <span
                aria-hidden
                className="pointer-events-none absolute"
                style={{
                  left: fit.x + (stop.x / 100) * fit.w,
                  top: fit.y + (stop.y / 100) * fit.h,
                  transform: `translate(-50%, -50%) scale(${1 / view.z})`,
                }}
              >
                <span className="relative flex h-16 w-16 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-inverse-surface/40" />
                  {/* Heller Ring mit dunkler Kontur innen+aussen — sichtbar auf
                      hellen wie dunklen Bildpartien (z.B. Fresko vs. Fabrikhalle). */}
                  <span
                    className="relative inline-flex h-12 w-12 rounded-full border-2 border-inverse-on-surface"
                    style={{
                      boxShadow:
                        "0 0 0 2.5px rgb(var(--color-inverse-surface) / 0.9), inset 0 0 0 2.5px rgb(var(--color-inverse-surface) / 0.9)",
                    }}
                  />
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Galerie-Pfeile (nur ausserhalb der Führung) */}
        {tourIdx === null && images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => gotoImage(idx - 1)}
              aria-label="Vorheriges Bild"
              className="absolute left-md top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-inverse-on-surface/10 text-inverse-on-surface transition hover:bg-inverse-on-surface/20"
            >
              <span className="material-symbols-outlined text-[24px]">
                chevron_left
              </span>
            </button>
            <button
              type="button"
              onClick={() => gotoImage(idx + 1)}
              aria-label="Nächstes Bild"
              className="absolute right-md top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-inverse-on-surface/10 text-inverse-on-surface transition hover:bg-inverse-on-surface/20"
            >
              <span className="material-symbols-outlined text-[24px]">
                chevron_right
              </span>
            </button>
          </>
        )}
      </div>

      {/* Fusszeile: Führung ODER Bildunterschrift */}
      <div className="p-md">
        {stop ? (
          <div className="mx-auto max-w-2xl rounded-xl bg-surface-bright p-lg shadow-lg">
            <div className="flex items-center justify-between gap-sm">
              <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-tertiary">
                <span className="material-symbols-outlined text-[16px]">tour</span>
                Führung · {tourIdx! + 1} / {tour!.length}
              </p>
              <button
                type="button"
                onClick={() => {
                  setTourIdx(null);
                  resetView();
                }}
                className="text-label-sm text-on-surface-variant underline underline-offset-2 hover:text-on-surface"
              >
                Führung beenden
              </button>
            </div>
            <h4 className="mt-sm text-headline-sm text-on-surface">
              {stop.title}
            </h4>
            <p className="mt-xs text-body-md text-on-surface-variant">
              {stop.text}
            </p>
            <div className="mt-md flex items-center justify-between">
              <button
                type="button"
                onClick={() => stepTour(-1)}
                disabled={tourIdx === 0}
                className="inline-flex items-center gap-xs rounded-xl border border-outline-variant px-md py-sm text-label-md text-on-surface transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-[18px]">
                  arrow_back
                </span>
                Zurück
              </button>
              <div className="flex items-center gap-xs">
                {tour!.map((_, i) => (
                  <span
                    key={i}
                    className={
                      "h-2 w-2 rounded-full " +
                      (i === tourIdx ? "bg-tertiary" : "bg-outline-variant")
                    }
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => stepTour(1)}
                className="inline-flex items-center gap-xs rounded-xl bg-tertiary px-md py-sm text-label-md text-on-tertiary transition hover:bg-on-tertiary-container"
              >
                {tourIdx === tour!.length - 1 ? "Abschliessen" : "Weiter"}
                <span className="material-symbols-outlined text-[18px]">
                  {tourIdx === tour!.length - 1 ? "check" : "arrow_forward"}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-body-sm text-inverse-on-surface">{img.caption}</p>
            <p className="mt-xs text-label-sm text-inverse-on-surface/80">
              {img.credit}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
