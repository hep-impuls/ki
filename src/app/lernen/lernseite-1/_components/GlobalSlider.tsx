"use client";

import { useRef, useState } from "react";
import { pollWahl, recordPollWahl } from "../_lib/stationStore";
import { GLOBAL_POLL_ID, GLOBAL_STATION_ID } from "../_lib/landkarteData";
import { castSlider } from "../_lib/unitPolls";

/**
 * GlobalSlider (M6) — der **globale Schieberegler** «KI in meinem Leben gesamt:
 * Bedrohung ↔ Chance» (v3 §11). Format-Konsistenz: **Slider** dort, wo die
 * **persönliche Bewegung** zählt — Pre im Auftakt, Post im Abschluss, **gleiches
 * Format**. Zeigt nach dem Post die eigene Verschiebung als **Pre→Post-Pfeil**.
 *
 * **ki26-konform:** persönlicher Pre/Post-Wert bleibt rein lokal (localStorage
 * via `recordPollWahl`). M8: zusätzlich **ein** anonymer Aggregat-Zähler je
 * Phase beim Loslassen des Reglers (`castSlider`, Bucket via scaleBucket) —
 * keine personenbezogenen Daten.
 */

const LINKS = "Bedrohung";
const RECHTS = "Chance";

function position(wert: number) {
  return `calc(${Math.max(0, Math.min(100, wert))}% )`;
}

export default function GlobalSlider({
  phase,
  zeigeBewegung = false,
  onChange,
}: {
  phase: "pre" | "post";
  /** Wenn beide Werte vorliegen: Pre→Post-Bewegung anzeigen (typisch im Post). */
  zeigeBewegung?: boolean;
  /** Optional: meldet jede Wert-Setzung nach aussen (z.B. um im Auftakt das
   *  «Weiter» freizuschalten). Rein lokal — der Wert wird ohnehin im Store gehalten. */
  onChange?: (wert: number) => void;
}) {
  const [wert, setWert] = useState<number | null>(() => pollWahl(GLOBAL_STATION_ID, GLOBAL_POLL_ID, phase));
  const pre = pollWahl(GLOBAL_STATION_ID, GLOBAL_POLL_ID, "pre");
  const post = pollWahl(GLOBAL_STATION_ID, GLOBAL_POLL_ID, "post");
  const letzterWert = useRef<number | null>(wert);
  const interagiert = useRef(false);

  const setzen = (v: number) => {
    setWert(v);
    letzterWert.current = v;
    interagiert.current = true;
    recordPollWahl(GLOBAL_STATION_ID, GLOBAL_POLL_ID, phase, v);
    onChange?.(v);
  };

  // Erst beim Loslassen anonym casten (sonst zählt jeder Zwischenwert beim
  // Ziehen); voteOnce in castSlider schützt vor Mehrfach-Casts.
  const release = () => {
    if (interagiert.current && letzterWert.current != null) {
      castSlider(GLOBAL_POLL_ID, phase, letzterWert.current);
    }
  };

  const bewegungBereit = zeigeBewegung && pre != null && post != null;
  const delta = bewegungBereit ? (post as number) - (pre as number) : 0;

  return (
    <div className="flex flex-col gap-md rounded-xl border border-outline-variant bg-surface-bright p-lg">
      <p className="text-label-sm uppercase tracking-wider text-tertiary">
        {phase === "pre" ? "Vorher · meine Haltung" : "Nachher · meine Haltung"}
      </p>
      <p className="text-body-lg text-on-surface">
        KI in meinem Leben gesamt — eher Bedrohung oder eher Chance?
      </p>

      <input
        type="range"
        min={0}
        max={100}
        value={wert ?? 50}
        onChange={(e) => setzen(Number(e.target.value))}
        onPointerUp={release}
        onKeyUp={release}
        className="w-full accent-primary"
        aria-label="Bedrohung bis Chance"
      />
      <div className="flex justify-between text-label-sm text-on-surface-variant">
        <span>{LINKS}</span>
        <span>{RECHTS}</span>
      </div>

      {/* Pre→Post-Bewegung */}
      {bewegungBereit && (
        <div className="flex flex-col gap-sm rounded-lg bg-surface-container-low p-md">
          <p className="flex items-center gap-xs text-label-md text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-tertiary">trending_flat</span>
            Deine Verschiebung
          </p>
          <div className="relative h-7 w-full rounded-full bg-surface-container">
            <div
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-outline bg-surface-bright"
              style={{ left: position(pre as number), marginLeft: "-6px" }}
              title={`vorher: ${pre}`}
              aria-hidden
            />
            <div
              className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-tertiary"
              style={{ left: position(post as number), marginLeft: "-7px" }}
              title={`nachher: ${post}`}
              aria-hidden
            />
          </div>
          <p className="text-label-sm text-on-surface-variant">
            {delta === 0
              ? "Unverändert — deine Haltung ist stabil geblieben."
              : delta > 0
                ? `Um ${delta} Punkte Richtung Chance bewegt.`
                : `Um ${Math.abs(delta)} Punkte Richtung Bedrohung bewegt.`}
          </p>
        </div>
      )}

      <p className="text-label-sm text-on-surface-variant">
        Anonym, kein Richtig oder Falsch. Bleibt auf deinem Gerät.
      </p>
    </div>
  );
}
