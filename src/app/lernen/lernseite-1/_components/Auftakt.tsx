"use client";

import { useEffect, useState } from "react";
import { scaleBucket } from "@/lib/polls";
import {
  GLOBAL_AXIS,
  pollId,
  resolveKlasse,
  voteOnce,
} from "../_lib/unitPolls";
import {
  AUFTAKT_LERNZIEL,
  OPENER_FRAGE,
  OPENER_MEDIA,
  OPENER_SCHWANZ,
  PRE_POLL_FRAGE,
  STIMMUNG_DECK_PRE,
  VORWISSEN_FRAGE,
  VORWISSEN_OPTIONEN,
} from "../_data/auftakt";
import { WC_OPENER } from "../_data/wissenChecks";
import Skala from "./Skala";
import MediaBlockView from "./media/MediaBlockView";
import LernzielKarte from "./LernzielKarte";
import Anleitung from "./Anleitung";
import Hinweis from "./Hinweis";
import WissenCheckGruppe from "./WissenCheckGruppe";
import PollDeck from "./PollDeck";

/**
 * Auftakt — Handoff §5.1, v2 §7.1.
 *
 * Lernziel-Karte → (A) Vorwissen → (B) Hype-Opener + Opener-Wissen-Check →
 * (C) Stimmungsbild-PollDeck → (D) globaler Pre-Poll. Bei Abschluss
 * → onComplete(preWert), Orchestrator wechselt zu "stationen".
 */

const STORAGE = "ki26-auftakt";

interface AuftaktState {
  gewaehlt: string[];
  freitext: string;
}

interface AuftaktProps {
  onComplete: (preWert: number) => void;
}

const SCHRITTE = ["Vorwissen", "Opener", "Stimmung", "Position"];

export default function Auftakt({ onComplete }: AuftaktProps) {
  const [schritt, setSchritt] = useState(0);
  const [s, setS] = useState<AuftaktState>({ gewaehlt: [], freitext: "" });
  const [preWert, setPreWert] = useState<number | null>(null);
  const [schwanzOffen, setSchwanzOffen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setS((p) => ({ ...p, ...JSON.parse(raw) }));
    } catch {
      /* ignore */
    }
  }, []);

  function persist(next: AuftaktState) {
    setS(next);
    try {
      localStorage.setItem(STORAGE, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function toggle(id: string) {
    const gewaehlt = s.gewaehlt.includes(id)
      ? s.gewaehlt.filter((x) => x !== id)
      : [...s.gewaehlt, id];
    persist({ ...s, gewaehlt });
  }

  function vorwissenAbsenden() {
    // Aggregat pro angekreuzter Option; Freitext NIE casten.
    for (const optId of s.gewaehlt) voteOnce(pollId.vorwissen(optId), "1");
    setSchritt(1);
  }

  function einheitStarten() {
    if (preWert == null) return;
    const klasse = resolveKlasse();
    voteOnce(pollId.globalPre, scaleBucket(preWert));
    voteOnce(pollId.klassePre(klasse), scaleBucket(preWert));
    onComplete(preWert);
  }

  return (
    <div className="flex flex-col gap-lg">
      <header className="border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-primary">Auftakt</p>
        <h1 className="mt-sm text-headline-xl text-on-surface">
          Kann KI das? — eine Positionsreise
        </h1>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          Du entscheidest selbst, was du dir ansiehst — und wo du am Ende stehst.
          Es gibt keine Noten, keine richtigen Antworten. Nur deine Position.
        </p>
      </header>

      <LernzielKarte {...AUFTAKT_LERNZIEL} />

      {/* Schritt-Anzeige */}
      <div className="flex flex-wrap gap-xs">
        {SCHRITTE.map((label, i) => (
          <span
            key={label}
            className={
              i === schritt
                ? "rounded-xl bg-primary px-md py-xs text-label-sm text-on-primary"
                : i < schritt
                  ? "rounded-xl bg-primary-container px-md py-xs text-label-sm text-on-primary-container"
                  : "rounded-xl border border-outline-variant px-md py-xs text-label-sm text-on-surface-variant"
            }
          >
            {label}
          </span>
        ))}
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
        {/* A — Vorwissen */}
        {schritt === 0 && (
          <div className="flex flex-col gap-lg">
            <div>
              <p className="text-body-md font-semibold text-on-surface">{VORWISSEN_FRAGE}</p>
              <p className="mt-xs text-body-sm text-on-surface-variant">
                Mehrfachauswahl möglich. Bleibt auf deinem Gerät — gezählt wird
                nur anonym, wie oft jede Antwort gewählt wurde.
              </p>
            </div>
            <div className="flex flex-wrap gap-sm">
              {VORWISSEN_OPTIONEN.map((o) => {
                const on = s.gewaehlt.includes(o.id);
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggle(o.id)}
                    aria-pressed={on}
                    className={
                      on
                        ? "inline-flex items-center gap-sm rounded-xl bg-primary px-md py-sm text-label-md text-on-primary"
                        : "inline-flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-bright px-md py-sm text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                    }
                  >
                    <span className="material-symbols-outlined text-[18px]">{o.icon}</span>
                    {o.label}
                  </button>
                );
              })}
            </div>
            <div>
              <label htmlFor="auftakt-freitext" className="text-body-md font-semibold text-on-surface">
                Fällt dir noch etwas ein? (freiwillig)
              </label>
              <input
                id="auftakt-freitext"
                type="text"
                value={s.freitext}
                onChange={(e) => persist({ ...s, freitext: e.target.value })}
                placeholder="z.B. eine konkrete Situation …"
                className="mt-sm w-full rounded-lg border border-outline-variant bg-surface-bright p-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
              />
              <p className="mt-xs text-label-sm text-on-surface-variant">
                Freitext bleibt nur auf deinem Gerät — wird nie gespeichert oder geteilt.
              </p>
            </div>
          </div>
        )}

        {/* B — Hype-Opener + Opener-Wissen-Check */}
        {schritt === 1 && (
          <div className="flex flex-col gap-lg">
            <div className="rounded-lg bg-tertiary-container p-md text-on-tertiary-container">
              <p className="flex items-center gap-sm text-label-md uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                Die Rahmenfrage
              </p>
              <p className="mt-xs text-headline-sm">{OPENER_FRAGE}</p>
            </div>
            <Hinweis>
              Bevor du deine Position festlegst: ein gemeinsamer Reiz. Schau den Ausschnitt — er zeigt,
              was KI heute alles kann.
            </Hinweis>
            <MediaBlockView block={{ media: [OPENER_MEDIA] }} />

            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-md">
              {!schwanzOffen ? (
                <button
                  type="button"
                  onClick={() => setSchwanzOffen(true)}
                  className="inline-flex items-center gap-sm text-label-md text-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Mehr Versprechen sehen (freiwillig)
                </button>
              ) : (
                <MediaBlockView block={{ media: OPENER_SCHWANZ }} />
              )}
            </div>

            <Anleitung>Kurzer Wissen-Check zum Einstieg — der erste Versuch zählt für deine Punkte.</Anleitung>
            <WissenCheckGruppe spec={WC_OPENER} />
          </div>
        )}

        {/* C — Stimmungsbild-PollDeck */}
        {schritt === 2 && (
          <div className="flex flex-col gap-lg">
            <Hinweis>
              Bevor es zu deiner Grundposition geht: ein Stimmungsbild. Du siehst nach jeder Stimme,
              wo du im Verhältnis zu Klasse und allen stehst.
            </Hinweis>
            <PollDeck spec={STIMMUNG_DECK_PRE} />
          </div>
        )}

        {/* D — Globaler Pre-Poll */}
        {schritt === 3 && (
          <div className="flex flex-col gap-lg">
            <p className="text-body-md font-semibold text-on-surface">{PRE_POLL_FRAGE}</p>
            <Skala
              value={preWert}
              onChange={setPreWert}
              links={GLOBAL_AXIS.links}
              rechts={GLOBAL_AXIS.rechts}
            />
            <p className="text-label-sm text-on-surface-variant">
              Deine Position bleibt lokal. Anonym gezählt wird nur, wo die ganze
              Gruppe steht — das siehst du am Ende im Kollektiv-Spiegel.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-xl flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSchritt((x) => Math.max(0, x - 1))}
            disabled={schritt === 0}
            className="inline-flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-bright px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Zurück
          </button>

          {schritt === 0 && (
            <button
              type="button"
              onClick={vorwissenAbsenden}
              className="inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:opacity-90"
            >
              Weiter
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}
          {(schritt === 1 || schritt === 2) && (
            <button
              type="button"
              onClick={() => setSchritt((x) => x + 1)}
              className="inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:opacity-90"
            >
              Weiter
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}
          {schritt === 3 && (
            <button
              type="button"
              onClick={einheitStarten}
              disabled={preWert == null}
              className="inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Zu den Stationen
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
