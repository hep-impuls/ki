"use client";

import { useEffect, useState } from "react";
import {
  OPENER_FRAGE,
  OPENER_MEDIA,
  OPENER_SCHWANZ,
  VORWISSEN_FRAGE,
  VORWISSEN_OPTIONEN,
} from "../_data/auftakt";
import type { LernzielKarteSpec } from "./LernzielKarte";
import { pollWahl, recordPollWahl } from "../_lib/stationStore";
import { GLOBAL_POLL_ID, GLOBAL_STATION_ID } from "../_lib/landkarteData";
import LernzielKarte from "./LernzielKarte";
import MediaBlockView from "./media/MediaBlockView";
import Hinweis from "./Hinweis";
import Anleitung from "./Anleitung";
import GlobalSlider from "./GlobalSlider";

/**
 * AuftaktV3 (M7) — schlanker, **rein lokaler** Auftakt der KI-Einheit v3
 * (Spec §70/§62, «lean local-only»). Drei kurze Schritte:
 *
 *   1. Vorwissen — «Wo ist dir KI begegnet?» (Mehrfachauswahl + Freitext)
 *   2. Reiz — Hype-Opener (Ava-Video), optionaler Versprechen-Schwanz
 *   3. Position — globaler Pre-Slider «Bedrohung ↔ Chance»
 *
 * **ki26-konform:** alles bleibt im Browser (localStorage). **Keine** Cloud-
 * Writes — die anonyme Aggregation (Vorwissen-Zähler, globaler Mittelwert,
 * 4er-Skala-Pre-Polls) und ein Auftakt-Swipe-Set folgen in M8. Der globale
 * Pre-Wert wird über `GlobalSlider` (Store: GLOBAL_STATION_ID/GLOBAL_POLL_ID)
 * festgehalten und speist später den Pre→Post-Pfeil im Abschluss.
 */

const STORAGE = "ki26-v3-auftakt";

interface AuftaktState {
  gewaehlt: string[];
  freitext: string;
}

const AUFTAKT_LERNZIEL_V3: LernzielKarteSpec = {
  titel: "Worum es geht",
  lernziele: [
    "Du machst dein KI-Vorwissen sichtbar.",
    "Du legst eine erste Position fest — Chance oder Bedrohung?",
    "Du erkennst, dass es hier kein Richtig oder Falsch gibt.",
  ],
  aktivitaet:
    "Zuerst hältst du fest, wo dir KI begegnet ist. Dann ein gemeinsamer Reiz — und zum Schluss setzt du deine Ausgangsposition auf dem Schieberegler.",
  wasKommt:
    "Danach wählst du auf dem Zeitstrahl deine Stationen frei. Am Ende siehst du auf deiner Landkarte, wie sich deine Haltung bewegt hat.",
};

const SCHRITTE = ["Vorwissen", "Reiz", "Position"];

export default function AuftaktV3({ onComplete }: { onComplete: () => void }) {
  const [schritt, setSchritt] = useState(0);
  const [s, setS] = useState<AuftaktState>({ gewaehlt: [], freitext: "" });
  const [schwanzOffen, setSchwanzOffen] = useState(false);
  const [preGesetzt, setPreGesetzt] = useState(false);

  // Lokalen Stand laden (nur Client). Pre-Wert evtl. schon gesetzt → Gate offen.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setS((p) => ({ ...p, ...JSON.parse(raw) }));
    } catch {
      /* ignore */
    }
    if (pollWahl(GLOBAL_STATION_ID, GLOBAL_POLL_ID, "pre") != null) setPreGesetzt(true);
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

  function einheitStarten() {
    // Falls der Regler nie bewegt wurde: neutrale 50 festhalten, damit der
    // Pre→Post-Pfeil im Abschluss eine Basis hat. Rein lokal.
    if (pollWahl(GLOBAL_STATION_ID, GLOBAL_POLL_ID, "pre") == null) {
      recordPollWahl(GLOBAL_STATION_ID, GLOBAL_POLL_ID, "pre", 50);
    }
    onComplete();
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

      <LernzielKarte {...AUFTAKT_LERNZIEL_V3} />

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
        {/* 1 — Vorwissen */}
        {schritt === 0 && (
          <div className="flex flex-col gap-lg">
            <div>
              <p className="text-body-md font-semibold text-on-surface">{VORWISSEN_FRAGE}</p>
              <p className="mt-xs text-body-sm text-on-surface-variant">
                Mehrfachauswahl möglich. Deine Auswahl bleibt auf deinem Gerät.
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
              <label htmlFor="auftakt-v3-freitext" className="text-body-md font-semibold text-on-surface">
                Fällt dir noch etwas ein? (freiwillig)
              </label>
              <input
                id="auftakt-v3-freitext"
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

        {/* 2 — Hype-Opener */}
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
          </div>
        )}

        {/* 3 — Globaler Pre-Slider */}
        {schritt === 2 && (
          <div className="flex flex-col gap-lg">
            <Anleitung>
              Setze deine Ausgangsposition. Bewege den Regler dorthin, wo du heute stehst — am Ende
              siehst du auf deiner Landkarte, ob sich etwas verschoben hat.
            </Anleitung>
            <GlobalSlider phase="pre" onChange={() => setPreGesetzt(true)} />
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

          {schritt < 2 && (
            <button
              type="button"
              onClick={() => setSchritt((x) => x + 1)}
              className="inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:opacity-90"
            >
              Weiter
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}
          {schritt === 2 && (
            <button
              type="button"
              onClick={einheitStarten}
              className="inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:opacity-90"
            >
              {preGesetzt ? "Zu den Stationen" : "Ohne Position weiter"}
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
