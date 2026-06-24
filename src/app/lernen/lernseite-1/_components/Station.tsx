"use client";

import { useEffect, useRef, useState } from "react";
import { castVote, scaleBucket } from "@/lib/polls";
import type { MediaBlock, MediaSpec, StationConfig } from "../_data/stationen";

/**
 * Station — generische Umsetzung der Stations-Mechanik (v2 §5).
 *
 * Vier Schritte (Versprechen + Position 1 sind bewusst ein Screen):
 *   0 Versprechen → Position 1 (Festlegung erzeugt Investment)
 *   1 Hauptgang   (affirmativer Pol)
 *   2 Kehrseite   (dissonanter Pol; Station 4: opt-in Vertiefung mit Warnung)
 *   3 Befund      (Position 2 + ein Satz + Δ)
 *
 * Datenschutz (decisions.md, Modell A): Position 1/2 und der "eine Satz"
 * bleiben IM BROWSER (localStorage). Nur wenn `reportPollId` gesetzt ist, wird
 * EIN anonymer Aggregat-Zähler der End-Position erhöht (kein Einzeldatensatz).
 */

const SKALA = [1, 2, 3, 4, 5, 6, 7];
const SCHRITTE = ["Versprechen", "Hauptgang", "Kehrseite", "Befund"];

interface StationState {
  pos1: number | null;
  pos2: number | null;
  satz: string;
  vertiefung: boolean;
  completed: boolean;
}

interface StationProps {
  station: StationConfig;
  /** Wird beim Abschliessen aufgerufen (z.B. Station als erledigt markieren). */
  onComplete?: (r: { pos1: number; pos2: number; satz: string }) => void;
  /** Optional: anonymer Aggregat-Zähler der End-Position (polls.ts). */
  reportPollId?: string;
}

function storageKey(id: string) {
  return `ki26-${id}`;
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ── Media ──────────────────────────────────────────────────────────────── */

function YouTubeClip({ spec }: { spec: MediaSpec }) {
  if (!spec.youtubeId || spec.youtubeId === "TODO") return <MediaPlaceholder spec={spec} />;
  // Hinweis: für einen harten Stopp am Ende ist die IFrame Player API
  // zuverlässiger als der &end-Parameter — für den Entwurf genügt der Param.
  const url = `https://www.youtube-nocookie.com/embed/${spec.youtubeId}?start=${spec.start}&end=${spec.end}&rel=0`;
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border border-outline-variant">
      <iframe
        src={url}
        title={spec.title}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

function AudioClip({ spec }: { spec: MediaSpec }) {
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onLoaded = () => {
      if (spec.start) el.currentTime = spec.start;
    };
    const onTime = () => {
      if (spec.end && el.currentTime >= spec.end) el.pause();
    };
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
    };
  }, [spec]);

  if (!spec.src) return <MediaPlaceholder spec={spec} />;
  return <audio ref={ref} src={spec.src} controls preload="metadata" className="w-full" />;
}

function MediaPlaceholder({ spec }: { spec: MediaSpec }) {
  return (
    <div className="flex items-center gap-sm rounded-lg border border-dashed border-outline-variant bg-surface-container-low p-md text-body-sm text-on-surface-variant">
      <span className="material-symbols-outlined text-[20px] text-tertiary">link_off</span>
      <span>
        Quelle noch zu hinterlegen — <strong>{spec.sourceKey}</strong>, Ausschnitt{" "}
        {fmt(spec.start)}–{fmt(spec.end)} (siehe <code>docs/material-pietro/urls.md</code>).
      </span>
    </div>
  );
}

function MediaBlockView({ block }: { block: MediaBlock }) {
  return (
    <div className="flex flex-col gap-md">
      {block.intro && (
        <p className="border-l-4 border-primary pl-md text-body-lg text-on-surface-variant">
          {block.intro}
        </p>
      )}
      {block.media.map((m, i) => (
        <figure key={i} className="flex flex-col gap-xs">
          {m.kind === "youtube" ? <YouTubeClip spec={m} /> : <AudioClip spec={m} />}
          <figcaption className="text-label-sm text-on-surface-variant">
            {m.title} · {fmt(m.start)}–{fmt(m.end)}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/* ── Slider (segmentierte 1–7-Skala, slider-artig) ──────────────────────── */

function Skala({
  value,
  onChange,
  links,
  rechts,
}: {
  value: number | null;
  onChange: (n: number) => void;
  links: string;
  rechts: string;
}) {
  return (
    <div>
      <div className="flex gap-xs">
        {SKALA.map((n) => {
          const on = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-pressed={on}
              className={
                on
                  ? "flex h-11 flex-1 items-center justify-center rounded-lg bg-primary text-label-md text-on-primary"
                  : "flex h-11 flex-1 items-center justify-center rounded-lg border border-outline-variant bg-surface-bright text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
              }
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-xs flex justify-between text-label-sm text-on-surface-variant">
        <span>{links}</span>
        <span>{rechts}</span>
      </div>
    </div>
  );
}

/* ── Station ────────────────────────────────────────────────────────────── */

export default function Station({ station, onComplete, reportPollId }: StationProps) {
  const [step, setStep] = useState(0);
  const [s, setS] = useState<StationState>({
    pos1: null,
    pos2: null,
    satz: "",
    vertiefung: false,
    completed: false,
  });
  const [warnungOffen, setWarnungOffen] = useState(false);

  // localStorage laden (einmalig, client-seitig)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(station.id));
      if (raw) setS((p) => ({ ...p, ...JSON.parse(raw) }));
    } catch {
      /* ignore */
    }
  }, [station.id]);

  function persist(next: StationState) {
    setS(next);
    try {
      localStorage.setItem(storageKey(station.id), JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function abschliessen() {
    if (s.pos1 == null || s.pos2 == null) return;
    const next = { ...s, completed: true };
    persist(next);
    if (reportPollId) void castVote(reportPollId, scaleBucket(s.pos2));
    onComplete?.({ pos1: s.pos1, pos2: s.pos2, satz: s.satz.trim() });
  }

  const delta = s.pos1 != null && s.pos2 != null ? s.pos2 - s.pos1 : null;

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
      {/* Kopf */}
      <div className="flex items-start gap-md border-b border-outline-variant pb-md">
        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
          <span className="material-symbols-outlined text-[24px]">{station.icon}</span>
        </div>
        <div>
          <p className="text-label-md uppercase tracking-wider text-primary">
            Station {station.nummer}
            {station.freiwillig && " · freiwillig"}
          </p>
          <h2 className="mt-xs text-headline-md text-on-surface">{station.frage}</h2>
        </div>
      </div>

      {/* Schritt-Anzeige */}
      <div className="mt-md flex flex-wrap gap-xs">
        {SCHRITTE.map((label, i) => (
          <span
            key={label}
            className={
              i === step
                ? "rounded-xl bg-primary px-md py-xs text-label-sm text-on-primary"
                : i < step
                  ? "rounded-xl bg-primary-container px-md py-xs text-label-sm text-on-primary-container"
                  : "rounded-xl border border-outline-variant px-md py-xs text-label-sm text-on-surface-variant"
            }
          >
            {label}
          </span>
        ))}
      </div>

      <div className="mt-lg">
        {/* 0 — Versprechen + Position 1 */}
        {step === 0 && (
          <div className="flex flex-col gap-lg">
            <div className="rounded-lg bg-tertiary-container p-md text-on-tertiary-container">
              <p className="flex items-center gap-sm text-label-md uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                Das Versprechen
              </p>
              <p className="mt-xs text-body-lg">{station.versprechen}</p>
            </div>
            <div>
              <p className="text-body-md font-semibold text-on-surface">
                Wo stehst du — jetzt, bevor du etwas gesehen hast?
              </p>
              <div className="mt-sm">
                <Skala
                  value={s.pos1}
                  onChange={(n) => persist({ ...s, pos1: n })}
                  links={station.achse.links}
                  rechts={station.achse.rechts}
                />
              </div>
            </div>
          </div>
        )}

        {/* 1 — Hauptgang */}
        {step === 1 && <MediaBlockView block={station.hauptgang} />}

        {/* 2 — Kehrseite (+ Station 4: opt-in Vertiefung) */}
        {step === 2 && (
          <div className="flex flex-col gap-lg">
            <MediaBlockView block={station.dessert} />

            {station.dessertVertiefung && !s.vertiefung && (
              <div className="rounded-lg border border-outline-variant bg-surface-container-low p-md">
                {!warnungOffen ? (
                  <button
                    type="button"
                    onClick={() => setWarnungOffen(true)}
                    className="inline-flex items-center gap-sm text-label-md text-primary"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Vertiefung anzeigen (freiwillig)
                  </button>
                ) : (
                  <div className="flex flex-col gap-sm">
                    <p className="flex items-start gap-sm text-body-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px] text-error">warning</span>
                      {station.dessertVertiefung.warnung}
                    </p>
                    <div className="flex gap-sm">
                      <button
                        type="button"
                        onClick={() => persist({ ...s, vertiefung: true })}
                        className="rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary"
                      >
                        Ich möchte sie sehen
                      </button>
                      <button
                        type="button"
                        onClick={() => setWarnungOffen(false)}
                        className="rounded-xl border border-outline-variant px-lg py-sm text-label-md text-on-surface"
                      >
                        Lieber nicht
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {station.dessertVertiefung && s.vertiefung && (
              <div className="flex flex-col gap-md rounded-lg border border-outline-variant p-md">
                <MediaBlockView block={station.dessertVertiefung} />
                <p className="flex items-start gap-sm rounded-lg bg-tertiary-container p-md text-body-sm text-on-tertiary-container">
                  <span className="material-symbols-outlined text-[20px]">support</span>
                  {station.dessertVertiefung.hilfsangebote}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 3 — Befund + Position 2 + ein Satz */}
        {step === 3 && (
          <div className="flex flex-col gap-lg">
            <div>
              <p className="text-body-md font-semibold text-on-surface">
                Und jetzt — wo stehst du nach Hauptgang und Kehrseite?
              </p>
              <p className="mt-xs text-body-sm text-on-surface-variant">
                Beide Pole lassen sich nicht gegeneinander verrechnen. Halte die Spannung aus.
              </p>
              <div className="mt-sm">
                <Skala
                  value={s.pos2}
                  onChange={(n) => persist({ ...s, pos2: n })}
                  links={station.achse.links}
                  rechts={station.achse.rechts}
                />
              </div>
            </div>

            {delta != null && (
              <div className="inline-flex items-center gap-sm self-start rounded-xl bg-surface-container-low px-md py-sm text-label-md text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-tertiary">
                  {delta === 0 ? "drag_handle" : delta > 0 ? "trending_up" : "trending_down"}
                </span>
                {delta === 0
                  ? "Deine Position ist gleich geblieben."
                  : `Du hast dich um ${Math.abs(delta)} Schritt${Math.abs(delta) === 1 ? "" : "e"} verschoben.`}
              </div>
            )}

            <div>
              <label htmlFor={`satz-${station.id}`} className="text-body-md font-semibold text-on-surface">
                In einem Satz: Was bleibt bei dir hängen?
              </label>
              <textarea
                id={`satz-${station.id}`}
                value={s.satz}
                onChange={(e) => persist({ ...s, satz: e.target.value })}
                rows={2}
                placeholder="Ein Satz genügt …"
                className="mt-sm w-full rounded-lg border border-outline-variant bg-surface-bright p-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
              />
              <p className="mt-xs text-label-sm text-on-surface-variant">
                Bleibt nur auf deinem Gerät — wird nicht gespeichert oder geteilt.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-xl flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((x) => Math.max(0, x - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-bright px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Zurück
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((x) => x + 1)}
            disabled={step === 0 && s.pos1 == null}
            className="inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Weiter
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={abschliessen}
            disabled={s.pos2 == null}
            className="inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {s.completed ? "Aktualisieren" : "Station abschliessen"}
            <span className="material-symbols-outlined text-[18px]">check</span>
          </button>
        )}
      </div>
    </div>
  );
}
