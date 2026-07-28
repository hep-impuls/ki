"use client";

/**
 * Snapshot-Builder fuer Lernseite 1 (KI-Einheit v3): liest die lokalen Stores
 * (stationStore) und baut daraus ein `Progress`-Objekt fuer den Firestore-
 * Spiegel (Lehrer-Report). Rein lesend — keine Cloud-Writes hier.
 *
 * Was gespiegelt wird (bewusst minimal, ki26-konform):
 *   - pct: **Erfuellungsgrad** der Einheit — Anteil der tatsaechlich
 *     bearbeiteten Elemente (Meinungsfragen, Verstaendnisfragen, Werte-Karten,
 *     Faktencheck, Reflexion) ueber alle Themen. Seit 2026-07-28 loest das die
 *     fruehere Zaehlung «Anteil abgeschlossener Stationen» ab: die Lernenden
 *     waehlen frei, wie viele Themen sie bearbeiten, darum sagt eine
 *     Stationen-Quote wenig — der Erfuellungsgrad dagegen zeigt, wie viel
 *     Arbeit tatsaechlich passiert ist.
 *   - quizScore: Summe der Quiz-Punkte ueber alle Themen.
 *   - blocks: pro **begonnenem** Thema ein `{type:"station"}` mit
 *     `completed` (60%-Quiz-Gate erfuellt) plus Quiz-Punkte (`punkte`/`max`).
 *
 * NICHT gespiegelt: Reflexionssaetze, Werte-Profil, Freitext, einzelne
 * Antworten — die bleiben lokal (Datenminimierung) und erscheinen nur im
 * lokalen Abschlussbericht der Lernperson. Anonyme Aggregat-Zaehler laufen
 * separat ueber `unitPolls.ts`.
 */

import { STATIONEN_V3 } from "../_data/stationenV3";
import { gesamtErfuellung, stationErfuellung } from "./erfuellung";
import { istAbgeschlossen, quizScore } from "./stationStore";
import type { Progress } from "@/lib/types";

export function buildLernseite1Progress(): Progress {
  const gesamt = gesamtErfuellung(STATIONEN_V3);

  const blocks: Progress["blocks"] = {};
  let quizPunkte = 0;

  for (const station of STATIONEN_V3) {
    const erfuellung = stationErfuellung(station);
    if (erfuellung.erledigt === 0) continue; // nicht begonnen → kein Eintrag
    const { punkte, max } = quizScore(station.id);
    quizPunkte += punkte;
    blocks[station.id] = {
      type: "station",
      completed: istAbgeschlossen(station.id),
      punkte,
      max,
    };
  }

  return {
    pct: gesamt.prozent,
    quizScore: quizPunkte,
    completedAt: gesamt.prozent >= 100 ? new Date().toISOString() : null,
    blocks,
  };
}
