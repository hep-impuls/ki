"use client";

import { getSession } from "@/lib/session";

/**
 * Deutungen — die erzeugten Orakel-Texte, pro Fortschritts-Code im Browser
 * gespeichert (Christofs Wunsch 2026-08-09, Variante A).
 *
 * Vorher lebten beide Stimmen nur im React-Zustand: Seite neu laden, weg. Der
 * einzige Halt war der PDF-Hinweis. Jetzt überleben die Texte den Reload und
 * die Wiederkehr auf demselben Gerät, samt Zeitstempel («Deutung vom …»),
 * damit sichtbar bleibt, dass eine gespeicherte Deutung den Stand von damals
 * beschreibt. Ein erneutes «Neu deuten» überschreibt.
 *
 * BEWUSST NUR LOKAL, kein Cloud-Spiegel: Die Deutung ist ein KI-erzeugter Text
 * über die Person. Der Datenschutz-Kasten verspricht «keine Reflexionstexte,
 * keine Einzelantworten» in der Cloud, und dieses Versprechen soll halten.
 * Variante B (geräteübergreifend) wäre eine eigene Datenschutz-Entscheidung.
 *
 * Pro CODE gespeichert (nicht pro Gerät), aus demselben Grund wie die
 * Blick-Wahl: Auf einem Schulgerät sollen sich zwei Personen nicht
 * gegenseitig die Deutungen zeigen oder überschreiben.
 */

export type DeutungsStimme =
  | "interesse"
  | "wissenschaftlich"
  | "literarisch"
  | "fantastisch";

export interface GespeicherteDeutung {
  text: string;
  zufrieden: boolean | null;
  /** Zeitpunkt der Erzeugung (ISO). */
  wann: string;
}

interface Store {
  deutungen: Partial<Record<DeutungsStimme, GespeicherteDeutung>>;
  /** Zuletzt gewählter Stil der zweiten Stimme, damit der wiederhergestellte
   *  Text auch unter dem Stil steht, in dem er erzeugt wurde. */
  stil?: "wissenschaftlich" | "literarisch" | "fantastisch";
}

const BASIS = "ki26-orakel-deutungen";

/** Ohne Code wird nicht gespeichert; das Orakel liegt hinter dem SessionGate,
 *  der Fall ist also theoretisch. */
function key(): string | null {
  const code = getSession()?.studentCode;
  return code ? `${BASIS}:${code}` : null;
}

export function leseDeutungen(): Store {
  if (typeof window === "undefined") return { deutungen: {} };
  const k = key();
  if (!k) return { deutungen: {} };
  try {
    const roh = window.localStorage.getItem(k);
    const o = roh ? (JSON.parse(roh) as unknown) : null;
    if (!o || typeof o !== "object" || Array.isArray(o)) return { deutungen: {} };
    const s = o as Store;
    if (!s.deutungen || typeof s.deutungen !== "object") return { deutungen: {} };
    return s;
  } catch {
    return { deutungen: {} };
  }
}

function schreiben(s: Store): void {
  const k = key();
  if (!k) return;
  try {
    window.localStorage.setItem(k, JSON.stringify(s));
  } catch {
    /* Privatmodus → still */
  }
}

/** Frisch erzeugten Text ablegen (setzt den Zeitstempel, Zufriedenheit offen). */
export function schreibeDeutung(stimme: DeutungsStimme, text: string): string {
  const wann = new Date().toISOString();
  const s = leseDeutungen();
  s.deutungen[stimme] = { text, zufrieden: null, wann };
  schreiben(s);
  return wann;
}

export function schreibeZufrieden(stimme: DeutungsStimme, wert: boolean): void {
  const s = leseDeutungen();
  const d = s.deutungen[stimme];
  if (!d) return;
  d.zufrieden = wert;
  schreiben(s);
}

export function schreibeStil(
  stil: "wissenschaftlich" | "literarisch" | "fantastisch",
): void {
  const s = leseDeutungen();
  s.stil = stil;
  schreiben(s);
}

/** «9. August 2026, 14:32» — für die Zeile unter der Deutung. */
export function formatiereWann(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("de-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
