"use client";

/**
 * v3 lokaler Stations-Store (M4) — Interaktions-Tiefe hinter den M3-Shells.
 *
 * Hält pro Station **lokal** (localStorage): Quiz-Punkte, Swipe-Picks (+ daraus
 * abgeleitetes Werte-Profil), Faktencheck-Zustand, lokale Poll-Auswahl,
 * Reflexionssatz sowie Stations-Abschluss + Badge-Sammlung.
 *
 * **ki26-konform:** persönliche Resultate (Punkte, Profil, Reflexion, Zertifikat)
 * bleiben ausschliesslich im Browser. **Keine** Cloud-Writes hier — anonyme
 * Aggregat-Zähler (Quiz «% richtig», Poll-Verteilung) folgen separat in M6/M8
 * über `_lib/unitPolls.ts`.
 *
 * Zweck u.a.: die `key={i}`-Remounts der Frames verloren bisher die Auswahl.
 * Frames hydrieren ihren Anfangszustand jetzt aus diesem Store → Zurück-Navigation
 * zeigt den bereits gewählten Stand (Quiz/Swipe/Fakt/Poll/Reflexion).
 */

import type { BadgeFamilie, BadgeRef } from "../_data/types";

const PREFIX = "ki26-v3-";

/* ── Low-Level localStorage (SSR-sicher, fehler-tolerant) ──────────────────── */
function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw != null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* ignore (privater Modus, Quota …) */
  }
}

/* ── Quiz (gepunktet, erste Antwort bindet) ───────────────────────────────── */
export interface QuizErgebnis {
  /** gewählter MC-Index oder W/F-Antwort. */
  antwort: number | boolean;
  correct: boolean;
  punkte: number;
  max: number;
}

type QuizStore = Record<string, QuizErgebnis>; // Key: `${stationId}:${qid}`

const quizKey = (stationId: string, qid: string) => `${stationId}:${qid}`;

/**
 * Quiz-Antwort festhalten. **Nur der erste Versuch zählt** (idempotent pro
 * stationId+qid) → verhindert «klicken bis richtig», Lernehrlichkeit.
 */
export function recordQuiz(
  stationId: string,
  qid: string,
  antwort: number | boolean,
  correct: boolean,
  max = 1,
): void {
  const store = read<QuizStore>("quiz", {});
  const k = quizKey(stationId, qid);
  if (store[k]) return; // erster Versuch bindet
  store[k] = { antwort, correct, punkte: correct ? max : 0, max };
  write("quiz", store);
}

/** Bereits festgehaltenes Quiz-Ergebnis (oder null) — für reload-/back-festes Rendering. */
export function quizErgebnis(stationId: string, qid: string): QuizErgebnis | null {
  return read<QuizStore>("quiz", {})[quizKey(stationId, qid)] ?? null;
}

/** Quiz-Punktestand einer Station (für Zertifikat in M5). */
export function quizScore(stationId: string): { punkte: number; max: number; beantwortet: number } {
  const store = read<QuizStore>("quiz", {});
  let punkte = 0;
  let max = 0;
  let beantwortet = 0;
  for (const [k, e] of Object.entries(store)) {
    if (!k.startsWith(stationId + ":")) continue;
    punkte += e.punkte;
    max += e.max;
    beantwortet++;
  }
  return { punkte, max, beantwortet };
}

/* ── Swipe (Werte-Profil; überschreibbar — Haltung, kein richtig/falsch) ───── */
export type SwipePick = "links" | "rechts";

export interface SwipeEintrag {
  pick: SwipePick;
  /** Profil-Achse, die diese Karte speist (z.B. "regulierung-innovation"). */
  profilKey: string;
}

type SwipeStore = Record<string, SwipeEintrag>; // Key: `${stationId}:${cardId}`

const swipeKey = (stationId: string, cardId: string) => `${stationId}:${cardId}`;

/** Swipe-Pick festhalten (überschreibbar — Haltung darf revidiert werden). */
export function recordSwipe(
  stationId: string,
  cardId: string,
  pick: SwipePick,
  profilKey: string,
): void {
  const store = read<SwipeStore>("swipe", {});
  store[swipeKey(stationId, cardId)] = { pick, profilKey };
  write("swipe", store);
}

/** Gespeicherter Swipe-Pick (oder null). */
export function swipePick(stationId: string, cardId: string): SwipeEintrag | null {
  return read<SwipeStore>("swipe", {})[swipeKey(stationId, cardId)] ?? null;
}

export interface ProfilAchse {
  links: number;
  rechts: number;
}

/** Werte-Profil über **alle** Stationen aggregieren (speist die Landkarte in M6). */
export function aggregateProfil(): Record<string, ProfilAchse> {
  const store = read<SwipeStore>("swipe", {});
  const out: Record<string, ProfilAchse> = {};
  for (const e of Object.values(store)) {
    const achse = (out[e.profilKey] ??= { links: 0, rechts: 0 });
    if (e.pick === "links") achse.links++;
    else achse.rechts++;
  }
  return out;
}

/** Werte-Profil nur dieser Station (kompakte Befund-Anzeige). */
export function stationProfil(stationId: string): Record<string, ProfilAchse> {
  const store = read<SwipeStore>("swipe", {});
  const out: Record<string, ProfilAchse> = {};
  for (const [k, e] of Object.entries(store)) {
    if (!k.startsWith(stationId + ":")) continue;
    const achse = (out[e.profilKey] ??= { links: 0, rechts: 0 });
    if (e.pick === "links") achse.links++;
    else achse.rechts++;
  }
  return out;
}

/* ── Faktencheck (lokal, ungradet — nur Zustand merken) ────────────────────── */
export interface FaktZustand {
  /** Welche Variante wurde gezeigt: echte Aussage (true) oder Falsch-Variante (false)? */
  gezeigtWahr: boolean;
  /** Antwort der/des Lernenden (Wahr=true / Falsch=false). */
  antwort: boolean;
  correct: boolean;
}

type FaktStore = Record<string, FaktZustand>; // Key: `${stationId}:${faktId}`

const faktKey = (stationId: string, faktId: string) => `${stationId}:${faktId}`;

/** Faktencheck-Zustand festhalten (erste Antwort bindet — die Variante bleibt stabil). */
export function recordFakt(
  stationId: string,
  faktId: string,
  gezeigtWahr: boolean,
  antwort: boolean,
): void {
  const store = read<FaktStore>("fakt", {});
  const k = faktKey(stationId, faktId);
  if (store[k]) return;
  store[k] = { gezeigtWahr, antwort, correct: antwort === gezeigtWahr };
  write("fakt", store);
}

/** Gespeicherter Faktencheck-Zustand (oder null). */
export function faktZustand(stationId: string, faktId: string): FaktZustand | null {
  return read<FaktStore>("fakt", {})[faktKey(stationId, faktId)] ?? null;
}

/* ── Poll (nur lokale Auswahl; Aggregat folgt M6/M8) ──────────────────────── */
type PollStore = Record<string, number>; // Key: `${stationId}:${pollId}:${phase}`

const pollKey = (stationId: string, pid: string, phase: "pre" | "post") =>
  `${stationId}:${pid}:${phase}`;

/** Lokale Poll-Auswahl merken (Skala-Index oder Slider-Wert). */
export function recordPollWahl(
  stationId: string,
  pid: string,
  phase: "pre" | "post",
  wert: number,
): void {
  const store = read<PollStore>("poll", {});
  store[pollKey(stationId, pid, phase)] = wert;
  write("poll", store);
}

/** Gespeicherte Poll-Auswahl (oder null). */
export function pollWahl(stationId: string, pid: string, phase: "pre" | "post"): number | null {
  const store = read<PollStore>("poll", {});
  const v = store[pollKey(stationId, pid, phase)];
  return v ?? null;
}

/* ── Reflexion (1 Satz, nur lokal) ─────────────────────────────────────────── */
type ReflexionStore = Record<string, string>; // Key: stationId

export function saveReflexion(stationId: string, text: string): void {
  const store = read<ReflexionStore>("reflexion", {});
  store[stationId] = text;
  write("reflexion", store);
}

export function reflexion(stationId: string): string {
  return read<ReflexionStore>("reflexion", {})[stationId] ?? "";
}

/* ── Abschluss + Badge-Sammlung ────────────────────────────────────────────── */
interface AbschlussEintrag {
  datum: string; // ISO
  badges: BadgeRef[];
}

type AbschlussStore = Record<string, AbschlussEintrag>; // Key: stationId

/**
 * Station als abgeschlossen markieren und ihre Badges vergeben (idempotent —
 * Datum + Badges werden nur beim ersten Mal gesetzt). Speist Zeitstrahl (grün),
 * Badge-Sammlung und Zertifikat (M5).
 */
export function markStationAbgeschlossen(stationId: string, badges: BadgeRef[]): void {
  const store = read<AbschlussStore>("abschluss", {});
  if (store[stationId]) return;
  store[stationId] = { datum: new Date().toISOString(), badges };
  write("abschluss", store);
}

export function istAbgeschlossen(stationId: string): boolean {
  return !!read<AbschlussStore>("abschluss", {})[stationId];
}

/** IDs aller abgeschlossenen Stationen (für Zertifikat-Schwelle ≥3 in M5). */
export function abgeschlosseneStationen(): string[] {
  return Object.keys(read<AbschlussStore>("abschluss", {}));
}

/**
 * Gesammelte Badges über alle abgeschlossenen Stationen, je Familie summiert
 * (Doppelvergabe erlaubt → Stufe). Familien ohne Badge fehlen im Resultat.
 */
export function badgeSammlung(): Partial<Record<BadgeFamilie, number>> {
  const store = read<AbschlussStore>("abschluss", {});
  const out: Partial<Record<BadgeFamilie, number>> = {};
  for (const eintrag of Object.values(store)) {
    for (const b of eintrag.badges) {
      out[b.familie] = (out[b.familie] ?? 0) + b.anzahl;
    }
  }
  return out;
}
