"use client";

import { useState } from "react";
import type { GlobalSkalaPoll } from "../_data/auftaktPolls";
import { GLOBAL_STATION_ID } from "../_lib/landkarteData";
import { pollWahl, recordPollWahl } from "../_lib/stationStore";
import { castSkala } from "../_lib/unitPolls";

/**
 * Skala4Frage (M8) — eine globale **4er-Skala**-Frage (`AUFTAKT_SKALA_POLLS`),
 * geteilt zwischen Auftakt (`phase="pre"`) und Abschluss (`phase="post"`), damit
 * dieselbe Frage **format-identisch** pre/post erscheint (Spec §6).
 *
 * **ki26-konform:** persönliche Stufe lokal (`recordPollWahl`, Pseudo-Station
 * `GLOBAL_STATION_ID`); zusätzlich ein anonymer Aggregat-Zähler je Stufe
 * (`castSkala`, `voteOnce`-geschützt → erste Wahl pro Browser zählt). Auswahl wird
 * beim Mount hydriert (back-/reload-fest). UI spiegelt `PollFrame` in `StationV3`.
 */
export default function Skala4Frage({
  poll,
  phase,
  onAnswered,
}: {
  poll: GlobalSkalaPoll;
  phase: "pre" | "post";
  /** Optional: meldet jede Auswahl nach aussen (z.B. Auto-Advance im Auftakt). */
  onAnswered?: () => void;
}) {
  const [wert, setWert] = useState<number | null>(() =>
    pollWahl(GLOBAL_STATION_ID, poll.id, phase),
  );

  const setzen = (i: number) => {
    setWert(i);
    recordPollWahl(GLOBAL_STATION_ID, poll.id, phase, i);
    castSkala(poll.pollId, phase, i);
    onAnswered?.();
  };

  return (
    <div className="flex flex-col gap-md" aria-live="polite">
      <p className="text-label-sm uppercase tracking-wider text-tertiary">
        {phase === "pre" ? "Deine Haltung jetzt" : "Deine Haltung nachher"}
      </p>
      <p className="text-body-lg text-on-surface">{poll.frage}</p>
      <div className="grid gap-sm sm:grid-cols-2">
        {poll.optionen.map((opt, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={wert === i}
            onClick={() => setzen(i)}
            className={`rounded-lg border p-md text-left text-body-md transition-colors ${
              wert === i
                ? "border-primary bg-primary-container text-on-primary-container"
                : "border-outline-variant bg-surface-bright text-on-surface hover:border-primary"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-label-sm text-on-surface-variant">
        <span>{poll.achse.links}</span>
        <span>{poll.achse.rechts}</span>
      </div>
      <p className="text-label-sm text-on-surface-variant">
        Anonym, kein Richtig oder Falsch. Nur deine Stufe zählt — ohne Namen — in die
        Klassen-Statistik.
      </p>
    </div>
  );
}
