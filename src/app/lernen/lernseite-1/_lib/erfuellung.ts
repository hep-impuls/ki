"use client";

/**
 * Erfüllungsgrad je Thema (2026-07-28) — «wie viel von diesem Thema habe ich
 * tatsächlich bearbeitet?», als Anteil erledigter Elemente.
 *
 * Warum: seit die Themen frei wählbar sind und es keine Mindestzahl mehr gibt
 * (kein «ab 3 Stationen»), braucht jede Themenkarte eine eigene, ehrliche
 * Fortschritts-Aussage. Der binäre «abgeschlossen»-Zustand (60 %-Quiz-Gate in
 * `stationStore.stationErfuellt`) bleibt daneben bestehen und entscheidet
 * weiterhin über Badges — er beantwortet aber eine andere Frage («gut genug?»)
 * als dieser Wert («wie weit?»).
 *
 * Gezählt wird nur, was messbar ist: Meinungsfragen (vorher/nachher),
 * Verständnisfragen, Werte-Karten, Faktencheck, Reflexionssatz. **Nicht**
 * gezählt wird das blosse Ansehen der Medien — dafür gibt es kein verlässliches
 * Signal, und ein erratener Wert wäre schlechter als keiner.
 *
 * **ki26-konform:** rein lesend aus localStorage, keine Cloud-Writes.
 */

import type { Station } from "../_data/types";
import { faktZustand, pollWahl, quizErgebnis, reflexion, swipePick } from "./stationStore";

export interface ErfuellungTeil {
  key: "meinung-vor" | "quiz" | "werte" | "fakten" | "meinung-nach" | "reflexion";
  label: string;
  /** Material Symbol (Outlined). */
  icon: string;
  erledigt: number;
  gesamt: number;
}

export interface Erfuellung {
  teile: ErfuellungTeil[];
  erledigt: number;
  gesamt: number;
  /** 0–100, gerundet. */
  prozent: number;
}

/** Erfüllungsgrad eines Themas — nur nach Mount aufrufen (liest localStorage). */
export function stationErfuellung(station: Station): Erfuellung {
  const zaehle = <T>(items: T[], erledigt: (item: T) => boolean) => ({
    erledigt: items.filter(erledigt).length,
    gesamt: items.length,
  });

  const teile: ErfuellungTeil[] = [
    {
      key: "meinung-vor",
      label: "Meinung vorher",
      icon: "flag",
      ...zaehle(station.polls, (p) => pollWahl(station.id, p.id, "pre") != null),
    },
    {
      key: "quiz",
      label: "Verständnisfragen",
      icon: "quiz",
      ...zaehle(station.quizPool, (q) => quizErgebnis(station.id, q.id) != null),
    },
    {
      key: "werte",
      label: "Werte-Karten",
      icon: "touch_app",
      ...zaehle(station.swipe, (k) => swipePick(station.id, k.id) != null),
    },
    {
      key: "fakten",
      label: "Faktencheck",
      icon: "fact_check",
      ...zaehle(station.fakten, (f) => faktZustand(station.id, f.id) != null),
    },
    {
      key: "meinung-nach",
      label: "Meinung nachher",
      icon: "trending_flat",
      ...zaehle(station.polls, (p) => pollWahl(station.id, p.id, "post") != null),
    },
    {
      key: "reflexion",
      label: "Reflexionssatz",
      icon: "edit_note",
      erledigt: reflexion(station.id).trim() !== "" ? 1 : 0,
      gesamt: 1,
    },
  ];

  const erledigt = teile.reduce((s, t) => s + t.erledigt, 0);
  const gesamt = teile.reduce((s, t) => s + t.gesamt, 0);
  return { teile, erledigt, gesamt, prozent: gesamt > 0 ? Math.round((erledigt / gesamt) * 100) : 0 };
}

/**
 * Erfüllungsgrad über **alle** Themen (Element-gewichtet, nicht Themen-gewichtet):
 * ein zu einem Drittel bearbeitetes Thema zählt auch als ein Drittel.
 */
export function gesamtErfuellung(stationen: Station[]): Erfuellung {
  const einzeln = stationen.map(stationErfuellung);
  const erledigt = einzeln.reduce((s, e) => s + e.erledigt, 0);
  const gesamt = einzeln.reduce((s, e) => s + e.gesamt, 0);
  return {
    teile: [],
    erledigt,
    gesamt,
    prozent: gesamt > 0 ? Math.round((erledigt / gesamt) * 100) : 0,
  };
}
