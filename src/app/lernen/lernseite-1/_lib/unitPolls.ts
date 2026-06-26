"use client";

import { castVote, scaleBucket } from "@/lib/polls";

/**
 * Poll-ID-Schema + Klassen-Mechanik für die KI-Einheit (Handoff §4).
 *
 * Leitplanken: nur anonyme Aggregat-Zähler. "Klasse" wird über einen
 * Klassen-Code realisiert, der die Poll-IDs namespaced — ohne Login, ohne
 * Einzeldaten. Doppel-Vote-Guard via localStorage (ein Cast pro Poll pro
 * Browser).
 */

export const GLOBAL_AXIS = { links: "eher Chance", rechts: "eher Bedrohung" };

/**
 * Klassen-Code auflösen (Reihenfolge): URL-Param ?klasse=<code> →
 * localStorage (ki26-klasse) → Fallback "ohne-klasse". Sanitisiert zu sauberen
 * Firestore-Doc-IDs.
 */
export function resolveKlasse(): string {
  if (typeof window === "undefined") return "ohne-klasse";
  const url = new URLSearchParams(window.location.search).get("klasse");
  const raw = url ?? localStorage.getItem("ki26-klasse") ?? "";
  const code = raw.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 24) || "ohne-klasse";
  if (url) localStorage.setItem("ki26-klasse", code);
  return code;
}

export const pollId = {
  // v1 — Pre/Post-Klammer + Stations-Position + Vorwissen + Maschinenraum:
  globalPre: "g-pos-pre",
  globalPost: "g-pos-post",
  klassePre: (k: string) => `k-${k}-pos-pre`,
  klassePost: (k: string) => `k-${k}-pos-post`,
  stationPost: (n: number) => `st${n}-pos-post`,
  vorwissen: (opt: string) => `aw-${opt}`,
  mrPre: "mr-verstaendnis-pre",
  mrPost: "mr-verstaendnis-post",
  mrInteresse: "mr-interesse",
  mrVertrauen: "mr-vertrauen",

  // v2 — generische Stimmungs-/Positions-Polls (beliebige Optionen):
  poll: (id: string) => `p-${id}`, // global
  klassePoll: (k: string, id: string) => `kp-${k}-${id}`, // pro Klasse

  // v2 — Wissen-Check Korrektheit (anonym, Bucket "richtig"/"falsch"):
  wissen: (qid: string) => `wc-${qid}`,
};

/**
 * Ein Cast pro Poll-ID pro Browser. Der Zähler selbst ist bewusst
 * idempotenz-frei — der Aufrufer schützt via localStorage-Flag.
 */
export function voteOnce(id: string, optionId: string): void {
  if (typeof window === "undefined") return;
  const flag = "ki26-voted-" + id;
  if (localStorage.getItem(flag)) return;
  void castVote(id, optionId);
  localStorage.setItem(flag, "1");
}

/** Wurde für diese Poll-ID in diesem Browser schon abgestimmt? */
export function hasVoted(id: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("ki26-voted-" + id) != null;
}

/**
 * Eine generische Poll-Stimme casten (PollFrage, §4.1): zählt sowohl den
 * globalen als auch den klassenweiten Zähler — je ein Cast pro Browser.
 * `optionId` ist der Bucket-Key (= Options-ID).
 */
export function castPollVote(id: string, optionId: string): void {
  const klasse = resolveKlasse();
  voteOnce(pollId.poll(id), optionId);
  voteOnce(pollId.klassePoll(klasse, id), optionId);
}

/* ── v3 Casting-Helfer (M8): anonyme Aggregate je Interaktionstyp ─────────────
 *
 * Bucket-Schema (DEV_PLAN_v3 §STATE / OPEN DECISIONS 3):
 *   4er-Skala  → Bucket "s{Index}" (0..3) unter Basis-Key "{pollId}-post"
 *                — genau diese Keys liest der KlassenSpiegel.
 *   Slider     → scaleBucket(0..100) unter Basis-Key "{pollId}-{phase}"
 *                (pre/post getrennt → spätere Bewegungs-Aggregation).
 *   Vorwissen  → ein Zähler je gewählte Option (pollId.vorwissen).
 *
 * Alle laufen über `castPollVote`/`voteOnce` → **ein** Cast pro Browser pro
 * Ziel-ID, rein anonyme Aggregat-Zähler (ki26-konform). Persönliche Werte
 * bleiben lokal (stationStore). */

/** 4er-Skala-Stimme — nur **Post** casten (das liest der KlassenSpiegel). */
export function castSkalaPost(basePollId: string, index: number): void {
  castPollVote(`${basePollId}-post`, scaleBucket(index));
}

/**
 * 4er-Skala-Stimme **mit Phase** (pre/post) — für die globalen Auftakt/Abschluss-
 * Polls (`AUFTAKT_SKALA_POLLS`), die als Pre/Post-Paar aggregiert werden. Bucket
 * `s{Index}` unter `{basePollId}-{phase}` — identisches Schema wie `castSkalaPost`
 * (für post deckungsgleich), `voteOnce`-geschützt (erste Stufe pro Browser zählt).
 */
export function castSkala(basePollId: string, phase: "pre" | "post", index: number): void {
  castPollVote(`${basePollId}-${phase}`, scaleBucket(index));
}

/**
 * Swipe-Karte optional anonym aggregieren — ein Zähler im Bucket "links"/"rechts"
 * unter `swipe-{cardId}`, einmal pro Browser. Persönliches Profil bleibt lokal
 * (stationStore); dies ist nur der optionale Aggregat-Zähler (Spec §6).
 */
export function castSwipe(cardId: string, pick: "links" | "rechts"): void {
  castPollVote(`swipe-${cardId}`, pick);
}

/** Slider-Stimme (Pre/Post getrennt; Wert 0..100 → scaleBucket). */
export function castSlider(basePollId: string, phase: "pre" | "post", value: number): void {
  castPollVote(`${basePollId}-${phase}`, scaleBucket(value));
}

/** Vorwissen: zählt jede gewählte Option einmal pro Browser. */
export function castVorwissen(optId: string): void {
  voteOnce(pollId.vorwissen(optId), "ja");
}
