"use client";

import { castVote, type PollCounts } from "@/lib/polls";
import { zaehltAnonym } from "./spuren";

/**
 * Nutzung — die drei Zahlen, die die Inhalts-Zähler nicht hergeben:
 * **wie viele Browser** überhaupt hier waren, **welche Themen** sie geöffnet
 * haben und **wie oft ein PDF-Ausdruck gestartet** wurde.
 *
 * Warum ein eigener Poll und nicht `spuren-lernseite-2`: Die Spuren zählen
 * Inhaltspunkte, die eine Person angeklickt hat. Ein Seitenaufruf ist kein
 * Anklicken, und beides im gleichen Zähler zu mischen würde die
 * Orakel-Auswertung verfälschen, die über alle Spur-IDs rechnet.
 *
 * **Was hier NICHT entsteht:** kein Fortschritts-Code, kein Zeitstempel, keine
 * Verweildauer, keine Reihenfolge. Nur `counts[key] += 1` auf einem einzigen
 * Aggregat-Dokument. Das ist bewusst weniger als der Engagement-Tracker, den
 * Pietro am 2026-08-10 abgeschaltet hat (der schrieb Code, Seite, Zeitpunkt und
 * Verweildauer pro Aufruf) — dessen Vermerk verlangt vor dem Wiedereinschalten
 * eine Auswertung, und die ist mit `/autoren` jetzt da.
 *
 * Zwei Zählweisen, absichtlich unterschiedlich:
 *  - `browser` und `seite:<slug>` steigen **einmal je Browser** (Reichweite:
 *    «so viele haben das je geöffnet»).
 *  - `pdf` steigt **bei jedem Mal** (Häufigkeit: «so viele Ausdrucke gestartet»).
 */

/** Poll-Doc unter `abstimmungen/ki26/polls/nutzung-lernseite-2`. */
export const NUTZUNG_POLL_ID = "nutzung-lernseite-2";

/** Register der schon einmal gezählten Reichweiten-Schlüssel (pro Browser). */
const KEY_EINMAL = "ki26-nutzung-einmal";

function schonGezaehlt(key: string): boolean {
  try {
    const raw = window.localStorage.getItem(KEY_EINMAL);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    const set = new Set(
      Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [],
    );
    if (set.has(key)) return true;
    set.add(key);
    window.localStorage.setItem(KEY_EINMAL, JSON.stringify([...set]));
    return false;
  } catch {
    /* Privatmodus: dann lieber nicht zählen als doppelt zählen. */
    return true;
  }
}

/** Reichweite: zählt diesen Schlüssel höchstens einmal pro Browser. */
function einmal(key: string): void {
  if (typeof window === "undefined" || !zaehltAnonym()) return;
  if (schonGezaehlt(key)) return;
  void castVote(NUTZUNG_POLL_ID, key);
}

/**
 * Ein Thema wurde geöffnet. Zählt zugleich den Browser selbst mit, damit die
 * Gesamtzahl nicht von der Reihenfolge der besuchten Themen abhängt.
 * `slug` ist der Ordnername, z.B. «vorhang-auf».
 */
export function merkeSeite(slug: string): void {
  einmal("browser");
  if (slug) einmal(`seite:${slug}`);
}

/** Ein PDF-Ausdruck wurde gestartet. Zählt jedes Mal. */
export function merkeDruck(): void {
  if (typeof window === "undefined" || !zaehltAnonym()) return;
  void castVote(NUTZUNG_POLL_ID, "pdf");
}

export interface NutzungsZahlen {
  /** Browser, die Lernseite 2 je geöffnet haben. */
  browser: number;
  /** Reichweite je Thema (slug → Browser). */
  seiten: Record<string, number>;
  /** Gestartete PDF-Ausdrucke (nicht dasselbe wie gespeicherte PDFs). */
  pdf: number;
}

/** Die Zähler in eine lesbare Form bringen. */
export function leseNutzung(counts: PollCounts): NutzungsZahlen {
  const seiten: Record<string, number> = {};
  for (const key in counts) {
    if (key.startsWith("seite:")) {
      seiten[key.slice("seite:".length)] = Number(counts[key]) || 0;
    }
  }
  return {
    browser: Number(counts.browser) || 0,
    seiten,
    pdf: Number(counts.pdf) || 0,
  };
}
