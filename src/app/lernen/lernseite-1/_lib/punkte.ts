"use client";

/**
 * Lokales Punkte-System für die Wissen-Checks (Handoff v2 §4.2).
 *
 * Leitplanken (bewertungsfrei): Punkte leben NUR im Browser (localStorage
 * "ki26-punkte"). Nichts Individuelles geht nach Firestore — dort landet pro
 * Wissen-Check nur ein anonymer Aggregat-Zähler "richtig"/"falsch" (siehe
 * unitPolls.pollId.wissen). Punkte sind persoenliches Feedback, kein Ranking,
 * keine Note.
 *
 * Erste Antwort ist bindend (idempotent): verhindert "so lange klicken bis
 * richtig" — Lernehrlichkeit. Reload-fest.
 */

const KEY = "ki26-punkte";

export interface PunkteEintrag {
  correct: boolean;
  points: number;
  max: number;
}

type Store = Record<string, PunkteEintrag>; // pro questionId

export function load(): Store {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as Store;
  } catch {
    return {};
  }
}

/**
 * Eine Antwort festhalten. Nur der erste Versuch zaehlt (idempotent) — ein
 * späterer Aufruf für dieselbe qid wird ignoriert.
 */
export function recordAnswer(qid: string, correct: boolean, max = 1): void {
  if (typeof window === "undefined") return;
  const s = load();
  if (s[qid]) return; // nur erster Versuch zaehlt
  s[qid] = { correct, points: correct ? max : 0, max };
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

/** Wurde diese Frage in diesem Browser schon beantwortet? */
export function hatBeantwortet(qid: string): boolean {
  return !!load()[qid];
}

/** Bereits festgehaltener Eintrag (oder null) — für reload-festes Rendering. */
export function eintrag(qid: string): PunkteEintrag | null {
  return load()[qid] ?? null;
}

/** Gesammelte Punkte / mögliche Punkte / Anzahl beantworteter Fragen. */
export function summe(): { points: number; max: number; beantwortet: number } {
  const s = load();
  let points = 0,
    max = 0,
    beantwortet = 0;
  for (const e of Object.values(s)) {
    points += e.points;
    max += e.max;
    beantwortet++;
  }
  return { points, max, beantwortet };
}
