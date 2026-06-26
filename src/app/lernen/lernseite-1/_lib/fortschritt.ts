"use client";

/**
 * Fortschritt-Persistenz für die KI-Einheit (Handoff §3).
 *
 * Haelt den Orchestrator-State im Browser (localStorage), damit ein Reload
 * mitten im Flow nichts verliert: aktuelle Phase, globaler Pre-/Post-Wert und
 * die erledigten Stationen. Alles rein lokal — nichts davon geht nach
 * Firestore (dort nur anonyme Aggregat-Zähler, siehe unitPolls).
 */

export type Phase = "auftakt" | "stationen" | "abschluss" | "maschinenraum";

const PREFIX = "ki26-einheit-";

export interface Fortschritt {
  phase: Phase;
  preWert: number | null;
  postWert: number | null;
  erledigteStationen: string[];
}

const DEFAULT: Fortschritt = {
  phase: "auftakt",
  preWert: null,
  postWert: null,
  erledigteStationen: [],
};

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
    /* ignore */
  }
}

export function loadFortschritt(): Fortschritt {
  return {
    phase: read<Phase>("phase", DEFAULT.phase),
    preWert: read<number | null>("preWert", DEFAULT.preWert),
    postWert: read<number | null>("postWert", DEFAULT.postWert),
    erledigteStationen: read<string[]>("erledigteStationen", DEFAULT.erledigteStationen),
  };
}

export function savePhase(phase: Phase): void {
  write("phase", phase);
}

export function savePreWert(v: number): void {
  write("preWert", v);
}

export function savePostWert(v: number): void {
  write("postWert", v);
}

export function saveErledigteStationen(ids: string[]): void {
  write("erledigteStationen", ids);
}
