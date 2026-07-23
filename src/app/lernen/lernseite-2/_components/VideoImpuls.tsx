"use client";

import { useEffect, useRef, useState } from "react";
import {
  leseSpuren,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";
import { merkeInhalt } from "../_lib/inhalte";

/**
 * VideoImpuls — ein kurzes Erklär-Video als Einstieg/Impuls einer Seite.
 *
 * Das Video ist direkt sichtbar und abspielbar (eingebettet über die
 * YouTube-IFrame-Player-API, Host `youtube-nocookie.com`). Als «geschaut»
 * wird es NICHT schon beim Start markiert, sondern erst, wenn es wirklich zu
 * Ende gesehen wurde — technisch: Zustand ENDED oder ≥ 92 % der Laufzeit. Erst
 * dann wird die Spur `video:…` gesetzt (dreifach registriert wie alles: lokal,
 * anonymer Zähler, Cloud-Spiegel) und zählt im Aktivitätsnetz/Orakel.
 *
 * Ohne `videoId` zeigt die Komponente einen deutlichen Platzhalter
 * («Video folgt») — die YouTube-ID wird später einfach als Prop ergänzt.
 */

/** Anteil der Laufzeit, ab dem das Video als «durchgesehen» gilt. */
const SCHWELLE = 0.92;

interface YTPlayer {
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}
interface YTNamespace {
  Player: new (
    el: HTMLElement,
    opts: Record<string, unknown>,
  ) => YTPlayer;
  PlayerState: { ENDED: number; PLAYING: number };
}
function ytGlobal(): YTNamespace | null {
  const w = window as unknown as { YT?: YTNamespace };
  return w.YT && w.YT.Player ? w.YT : null;
}

/** IFrame-API einmalig laden; Promise löst auf, sobald `window.YT` bereit ist. */
let ytBereit: Promise<void> | null = null;
function ladeYT(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (ytGlobal()) return Promise.resolve();
  if (ytBereit) return ytBereit;
  ytBereit = new Promise<void>((resolve) => {
    const w = window as unknown as { onYouTubeIframeAPIReady?: () => void };
    const vorher = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      vorher?.();
      resolve();
    };
    if (!document.getElementById("yt-iframe-api")) {
      const s = document.createElement("script");
      s.id = "yt-iframe-api";
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  });
  return ytBereit;
}

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
  const [geschaut, setGeschaut] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const geschautRef = useRef(false);

  useEffect(() => {
    function restore() {
      if (leseSpuren().some((s) => s.id === spurId)) {
        geschautRef.current = true;
        setGeschaut(true);
      }
    }
    restore();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [spurId]);

  // Titel registrieren — für die Sternenkarte im Orakel.
  useEffect(() => {
    merkeInhalt(spurId, titel);
  }, [spurId, titel]);

  useEffect(() => {
    if (!videoId || !holderRef.current) return;
    let abgebrochen = false;

    function markiereGeschaut() {
      if (geschautRef.current) return;
      geschautRef.current = true;
      setGeschaut(true);
      merkeSpur(spurId);
    }

    function stopTimer() {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    void ladeYT().then(() => {
      const YT = ytGlobal();
      if (abgebrochen || !YT || !holderRef.current) return;
      playerRef.current = new YT.Player(holderRef.current, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (e: { data: number }) => {
            const p = playerRef.current;
            if (e.data === YT.PlayerState.ENDED) {
              markiereGeschaut();
              stopTimer();
            } else if (e.data === YT.PlayerState.PLAYING) {
              stopTimer();
              // Während des Abspielens prüfen, ob ≥ 92 % erreicht sind
              // (falls die letzten Sekunden nicht ganz zu Ende laufen).
              timerRef.current = setInterval(() => {
                if (!p) return;
                const dauer = p.getDuration();
                if (dauer > 0 && p.getCurrentTime() / dauer >= SCHWELLE) {
                  markiereGeschaut();
                  stopTimer();
                }
              }, 2000);
            } else {
              stopTimer();
            }
          },
        },
      });
    });

    return () => {
      abgebrochen = true;
      stopTimer();
      try {
        playerRef.current?.destroy();
      } catch {
        /* Player evtl. schon weg */
      }
      playerRef.current = null;
    };
  }, [videoId, spurId]);

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
          {videoId ? (
            /* YT.Player ersetzt dieses Element durch das iframe. */
            <div ref={holderRef} className="absolute inset-0 h-full w-full" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-sm">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
                <span className="material-symbols-outlined text-[36px]">play_arrow</span>
              </span>
              <span className="rounded-full border border-dashed border-outline-variant bg-surface-bright/85 px-md py-xs text-label-md text-on-surface-variant">
                Platzhalter, Video folgt
              </span>
            </div>
          )}
        </div>
        <div className="border-t border-outline-variant p-md">
          <p className="text-body-md font-medium text-on-surface">{titel}</p>
          {beschreibung && (
            <p className="mt-xs text-body-sm text-on-surface-variant">{beschreibung}</p>
          )}
          {videoId && !geschaut && (
            <p className="mt-sm flex items-center gap-xs text-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              Wird als «geschaut» vermerkt, sobald du es zu Ende angeschaut hast.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
