"use client";

/**
 * Snapshot-Builder fuer Lernseite 1 (KI-Einheit v3): liest die lokalen Stores
 * (stationStore) und baut daraus ein `Progress`-Objekt fuer den Firestore-
 * Spiegel (Lehrer-Report). Rein lesend — keine Cloud-Writes hier.
 *
 * Was gespiegelt wird (bewusst minimal, ki26-konform):
 *   - pct: Anteil abgeschlossener Stationen am Total.
 *   - quizScore: Summe der Quiz-Punkte ueber alle Stationen.
 *   - blocks: pro abgeschlossener Station ein `{type:"station", completed:true}`
 *     plus aggregierte Quiz-Punkte je Station (`punkte`/`max`).
 *
 * NICHT gespiegelt: Reflexionssaetze, Werte-Profil, einzelne Antworten — die
 * bleiben lokal (Datenminimierung). Anonyme Aggregat-Zaehler laufen separat
 * ueber `unitPolls.ts`.
 */

import { STATIONEN_V3 } from "../_data/stationenV3";
import { abgeschlosseneStationen, quizScore } from "./stationStore";
import type { Progress } from "@/lib/types";

export function buildLernseite1Progress(): Progress {
  const total = STATIONEN_V3.length || 1;
  const fertig = abgeschlosseneStationen();
  const pct = Math.round((fertig.length / total) * 100);

  const blocks: Progress["blocks"] = {};
  let quizPunkte = 0;
  let quizMax = 0;

  for (const stationId of fertig) {
    const { punkte, max } = quizScore(stationId);
    quizPunkte += punkte;
    quizMax += max;
    blocks[stationId] = {
      type: "station",
      completed: true,
      punkte,
      max,
    };
  }

  return {
    pct,
    quizScore: quizPunkte,
    completedAt: fertig.length >= total ? new Date().toISOString() : null,
    blocks,
  };
}
