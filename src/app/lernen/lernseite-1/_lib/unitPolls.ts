"use client";

import { castVote } from "@/lib/polls";

/**
 * Poll-ID-Schema + Klassen-Mechanik fuer die KI-Einheit (Handoff §4).
 *
 * Leitplanken: nur anonyme Aggregat-Zaehler. "Klasse" wird ueber einen
 * Klassen-Code realisiert, der die Poll-IDs namespaced — ohne Login, ohne
 * Einzeldaten. Doppel-Vote-Guard via localStorage (ein Cast pro Poll pro
 * Browser).
 */

export const GLOBAL_AXIS = { links: "eher Chance", rechts: "eher Bedrohung" };

/**
 * Klassen-Code aufloesen (Reihenfolge): URL-Param ?klasse=<code> →
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
};

/**
 * Ein Cast pro Poll-ID pro Browser. Der Zaehler selbst ist bewusst
 * idempotenz-frei — der Aufrufer schuetzt via localStorage-Flag.
 */
export function voteOnce(id: string, optionId: string): void {
  if (typeof window === "undefined") return;
  const flag = "ki26-voted-" + id;
  if (localStorage.getItem(flag)) return;
  void castVote(id, optionId);
  localStorage.setItem(flag, "1");
}

/** Wurde fuer diese Poll-ID in diesem Browser schon abgestimmt? */
export function hasVoted(id: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("ki26-voted-" + id) != null;
}
