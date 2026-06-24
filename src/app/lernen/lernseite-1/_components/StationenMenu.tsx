"use client";

import { useState } from "react";
import { STATIONEN, type StationConfig } from "../_data/stationen";
import { pollId } from "../_lib/unitPolls";
import Station from "./Station";

/**
 * StationenMenu — Handoff §5.2, v2 §5/§6/§7.
 *
 * Karten-Menue der 5 Ich-Fragen. Freie Auswahl, mind. 3 von 5. Erledigte
 * markiert, Station 4 traegt ein "freiwillig"-Badge. Der Abschluss-Button
 * aktiviert sich erst bei >= 3 erledigten Stationen. Kein Wort "Aspekt" im UI.
 */

const MIN_STATIONEN = 3;

interface StationenMenuProps {
  erledigte: string[];
  onComplete: (id: string) => void;
  onAbschluss: () => void;
}

export default function StationenMenu({ erledigte, onComplete, onAbschluss }: StationenMenuProps) {
  const [offen, setOffen] = useState<StationConfig | null>(null);

  if (offen) {
    return (
      <Station
        station={offen}
        reportPollId={pollId.stationPost(offen.nummer)}
        onBack={() => setOffen(null)}
        onComplete={() => {
          onComplete(offen.id);
          setOffen(null);
        }}
      />
    );
  }

  const anzahl = erledigte.length;
  const genug = anzahl >= MIN_STATIONEN;

  return (
    <div className="flex flex-col gap-lg">
      <header className="border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-primary">Stationen</p>
        <h1 className="mt-sm text-headline-xl text-on-surface">Waehle deine Fragen</h1>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          Fuenf Fragen, fuenf kurze Stationen. Such dir aus, was dich interessiert —
          mindestens drei, bevor es zum Abschluss geht. Die Reihenfolge bestimmst du.
        </p>
      </header>

      {/* Fortschritt */}
      <div className="flex items-center gap-md rounded-xl bg-surface-container-low px-lg py-md">
        <span className="material-symbols-outlined text-[22px] text-tertiary">
          {genug ? "task_alt" : "checklist"}
        </span>
        <p className="text-body-md text-on-surface">
          <strong>{anzahl}</strong> von mindestens {MIN_STATIONEN} Stationen erledigt
          {genug && " — du kannst jederzeit abschliessen."}
        </p>
      </div>

      <div className="grid gap-md sm:grid-cols-2">
        {STATIONEN.map((st) => {
          const fertig = erledigte.includes(st.id);
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setOffen(st)}
              className="group relative flex flex-col items-start gap-sm overflow-hidden rounded-xl border border-outline-variant bg-surface-bright p-lg text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-primary" />
              <div className="flex w-full items-start justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
                  <span className="material-symbols-outlined text-[22px]">{st.icon}</span>
                </div>
                <div className="flex items-center gap-xs">
                  {st.freiwillig && (
                    <span className="rounded-xl bg-tertiary-container px-sm py-xs text-label-sm text-on-tertiary-container">
                      freiwillig
                    </span>
                  )}
                  {fertig && (
                    <span className="inline-flex items-center gap-xs rounded-xl bg-primary-container px-sm py-xs text-label-sm text-on-primary-container">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      erledigt
                    </span>
                  )}
                </div>
              </div>
              <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                Station {st.nummer}
              </p>
              <h3 className="text-headline-sm text-on-surface">{st.frage}</h3>
              <span className="mt-sm inline-flex items-center gap-sm text-label-md text-primary">
                {fertig ? "Nochmal ansehen" : "Station starten"}
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end border-t border-outline-variant pt-lg">
        <button
          type="button"
          onClick={onAbschluss}
          disabled={!genug}
          className="inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          title={genug ? undefined : `Erst nach ${MIN_STATIONEN} Stationen`}
        >
          Zum Abschluss
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
