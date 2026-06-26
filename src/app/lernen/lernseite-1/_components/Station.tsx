"use client";

import { useEffect, useState } from "react";
import {
  castVote,
  loadPollCounts,
  subscribePollCounts,
  scaleBucket,
  type PollCounts,
} from "@/lib/polls";
import type { StationConfig, MediaBlock } from "../_data/stationen";
import Skala from "./Skala";
import MediaBlockView from "./media/MediaBlockView";
import LernzielKarte from "./LernzielKarte";
import Anleitung from "./Anleitung";
import WissenCheckGruppe from "./WissenCheckGruppe";
import Verteilung, { type VerteilungOption } from "./Verteilung";

/**
 * Station — generische Umsetzung der Stations-Mechanik (v2 §5/§7).
 *
 * Vier Schritte (Lernziele + Versprechen + Position 1 sind der Einstieg):
 *   0 Lernziele + Versprechen → Position 1 (Festlegung erzeugt Investment)
 *   1 Hauptgang   (affirmativer Pol)  + Wissen-Check-Gruppe (50/50)
 *   2 Kehrseite   (dissonanter Pol; Station 4: opt-in Vertiefung) + Wissen-Check
 *   3 Befund      (Position 2 + ein Satz + Δ + Stations-Mini-Spiegel)
 *
 * Datenschutz (decisions.md, Modell A): Position 1/2 und der "eine Satz"
 * bleiben IM BROWSER (localStorage). Nur wenn `reportPollId` gesetzt ist, wird
 * EIN anonymer Aggregat-Zähler der End-Position erhöht (kein Einzeldatensatz).
 * Wissen-Checks vergeben lokale Punkte + casten anonym richtig/falsch.
 */

const SCHRITTE = ["Start", "Hauptgang", "Kehrseite", "Befund"];

const STUFEN_OPTIONEN: VerteilungOption[] = [1, 2, 3, 4, 5, 6, 7].map((n) => ({
  id: `s${n}`,
  label: `${n}`,
}));

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
  /** Optional: zurück zum Stations-Menü. */
  onBack?: () => void;
}

function storageKey(id: string) {
  return `ki26-${id}`;
}

/** Medien links, Wissen-Checks rechts (50/50, stapelt mobil) — Handoff §5.3. */
function GangMitChecks({ block, anleitung }: { block: MediaBlock; anleitung: string }) {
  if (!block.checks) return <MediaBlockView block={block} />;
  return (
    <div className="grid gap-lg lg:grid-cols-2">
      <div className="min-w-0">
        <MediaBlockView block={block} />
      </div>
      <div className="flex min-w-0 flex-col gap-md">
        <Anleitung>{anleitung}</Anleitung>
        <WissenCheckGruppe spec={block.checks} />
      </div>
    </div>
  );
}

export default function Station({ station, onComplete, reportPollId, onBack }: StationProps) {
  const [step, setStep] = useState(0);
  const [s, setS] = useState<StationState>({
    pos1: null,
    pos2: null,
    satz: "",
    vertiefung: false,
    completed: false,
  });
  const [warnungOffen, setWarnungOffen] = useState(false);
  const [spiegel, setSpiegel] = useState<PollCounts>({});

  // localStorage laden (einmalig, client-seitig)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(station.id));
      if (raw) setS((p) => ({ ...p, ...JSON.parse(raw) }));
    } catch {
      /* ignore */
    }
  }, [station.id]);

  // Mini-Spiegel: Verteilung der Stations-Endposition (live), sobald im Befund.
  useEffect(() => {
    if (step !== 3 || !reportPollId) return;
    let aktiv = true;
    void loadPollCounts(reportPollId).then((c) => {
      if (aktiv) setSpiegel(c);
    });
    const unsub = subscribePollCounts(reportPollId, setSpiegel);
    return () => {
      aktiv = false;
      unsub();
    };
  }, [step, reportPollId]);

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
  const meinPick = s.pos2 != null ? `s${s.pos2}` : undefined;

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
      {/* Kopf */}
      <div className="flex items-start justify-between gap-md border-b border-outline-variant pb-md">
        <div className="flex items-start gap-md">
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
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex shrink-0 items-center gap-xs text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
            Menü
          </button>
        )}
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
        {/* 0 — Lernziele + Versprechen + Position 1 */}
        {step === 0 && (
          <div className="flex flex-col gap-lg">
            <LernzielKarte {...station.lernziel} />

            {station.warnung && (
              <p className="flex items-start gap-sm rounded-lg border border-outline-variant bg-surface-container-low p-md text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px] text-tertiary">info</span>
                {station.warnung}
              </p>
            )}

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

        {/* 1 — Hauptgang + Wissen-Check */}
        {step === 1 && (
          <GangMitChecks
            block={station.hauptgang}
            anleitung="Schau die Clips an — danach beantwortest du die Fragen zum Inhalt. Der erste Versuch zählt für deine Punkte."
          />
        )}

        {/* 2 — Kehrseite (+ Station 4: opt-in Vertiefung) + Wissen-Check */}
        {step === 2 && (
          <div className="flex flex-col gap-lg">
            <GangMitChecks
              block={station.dessert}
              anleitung="Auch hier: erst schauen, dann die Fragen zum Inhalt beantworten."
            />

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

        {/* 3 — Befund + Position 2 + ein Satz + Mini-Spiegel */}
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

            {/* Stations-Mini-Spiegel: meine Position vs. alle (live) */}
            {reportPollId && (s.completed || meinPick) && (
              <section className="rounded-lg border border-outline-variant bg-surface-container-low p-md">
                <p className="mb-sm flex items-center gap-sm text-label-md text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
                  Deine Position vs. alle, die diese Station gemacht haben
                </p>
                <Verteilung
                  counts={spiegel}
                  optionen={STUFEN_OPTIONEN}
                  farbe="bg-primary"
                  meinPick={meinPick}
                  achse={station.achse}
                />
                <p className="mt-sm text-label-sm text-on-surface-variant">
                  Sichtbar wird deine Stimme, sobald du die Station abschliesst.
                </p>
              </section>
            )}
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
