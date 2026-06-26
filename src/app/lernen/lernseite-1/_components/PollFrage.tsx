"use client";

import { useEffect, useState } from "react";
import {
  loadPollCounts,
  subscribePollCounts,
  type PollCounts,
} from "@/lib/polls";
import { pollId, resolveKlasse, castPollVote } from "../_lib/unitPolls";
import Verteilung, { type VerteilungOption } from "./Verteilung";

/**
 * PollFrage — eine generische Stimmungs-/Positions-Frage mit Drei-Ebenen-
 * Spiegel (Handoff v2 §5.7, §8): nach dem Abstimmen siehst du deine Position
 * im Verhältnis zu Ich / Klasse / allen.
 *
 * Castet zwei Zähler (global + klasse) je einmal pro Browser (castPollVote).
 * Eigene Wahl bleibt lokal (localStorage) — reload-fest und für den Pre/Post-
 * Vergleich. Bewertungsfrei: kein "richtig"/"falsch".
 */

export interface PollFrageSpec {
  id: string;
  frage: string;
  optionen: VerteilungOption[];
  achse?: { links: string; rechts: string };
}

const PICK_KEY = (id: string) => `ki26-poll-pick-${id}`;

function readPick(id: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(PICK_KEY(id));
  } catch {
    return null;
  }
}

export default function PollFrage({
  spec,
  /** optionale Pre-Frage-ID für den Vorher/Jetzt-Vergleich (Abschluss). */
  vorherId,
}: {
  spec: PollFrageSpec;
  vorherId?: string;
}) {
  const [pick, setPick] = useState<string | null>(null);
  const [vorherPick, setVorherPick] = useState<string | null>(null);
  const [klasse, setKlasse] = useState<PollCounts>({});
  const [alle, setAlle] = useState<PollCounts>({});

  useEffect(() => {
    setPick(readPick(spec.id));
    if (vorherId) setVorherPick(readPick(vorherId));
  }, [spec.id, vorherId]);

  // Spiegel laden, sobald abgestimmt wurde.
  useEffect(() => {
    if (!pick) return;
    const code = resolveKlasse();
    let aktiv = true;
    void loadPollCounts(pollId.klassePoll(code, spec.id)).then((c) => {
      if (aktiv) setKlasse(c);
    });
    const unsub = subscribePollCounts(pollId.poll(spec.id), setAlle);
    return () => {
      aktiv = false;
      unsub();
    };
  }, [pick, spec.id]);

  function abstimmen(optId: string) {
    if (pick) return;
    castPollVote(spec.id, optId);
    try {
      localStorage.setItem(PICK_KEY(spec.id), optId);
    } catch {
      /* ignore */
    }
    setPick(optId);
  }

  const meinLabel = spec.optionen.find((o) => o.id === pick)?.label;
  const vorherLabel = spec.optionen.find((o) => o.id === vorherPick)?.label;

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg">
      <p className="text-body-md font-semibold text-on-surface">{spec.frage}</p>

      {!pick ? (
        <div className="mt-md flex flex-wrap gap-sm">
          {spec.optionen.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => abstimmen(o.id)}
              className="inline-flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-bright px-md py-sm text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
            >
              {o.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-md flex flex-col gap-md">
          <div className="flex flex-wrap items-center gap-sm text-label-md">
            <span className="inline-flex items-center gap-xs rounded-xl bg-primary-container px-md py-xs text-on-primary-container">
              <span className="material-symbols-outlined text-[16px]">person</span>
              Deine Wahl: {meinLabel}
            </span>
            {vorherId && vorherLabel && vorherLabel !== meinLabel && (
              <span className="inline-flex items-center gap-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">history</span>
                vorher: {vorherLabel}
              </span>
            )}
          </div>

          <div>
            <p className="mb-xs text-label-sm uppercase tracking-wider text-tertiary">Meine Klasse</p>
            <Verteilung counts={klasse} optionen={spec.optionen} farbe="bg-tertiary" meinPick={pick} achse={spec.achse} />
          </div>
          <div>
            <p className="mb-xs text-label-sm uppercase tracking-wider text-primary">
              Alle · füllt sich live
            </p>
            <Verteilung counts={alle} optionen={spec.optionen} farbe="bg-primary" meinPick={pick} achse={spec.achse} />
          </div>
        </div>
      )}
    </div>
  );
}
