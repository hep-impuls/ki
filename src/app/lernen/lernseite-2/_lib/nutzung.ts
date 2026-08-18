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

/**
 * Poll-Doc des Nutzungs-Verlaufs: `counts["<slug>:<JJJJ-MM-TT>"] += 1`,
 * höchstens einmal je Browser und Tag, dazu `alle:<Tag>` für die Gesamtlinie.
 *
 * Das ist die Zeitachse, die Christof am 18.8.2026 fürs Autoren-Dashboard
 * wollte («Verlaufsgrafik, zeitlich eingrenzbar»). Sie bleibt im Rahmen des
 * Aggregat-Modells: Tagessummen über alle, kein Fortschritts-Code, keine
 * Uhrzeit, keine Verweildauer, keine Reihenfolge — deutlich weniger als der
 * abgeschaltete Engagement-Tracker (der schrieb pro Code und Aufruf). Der
 * Verlauf beginnt mit dem Einbau; rückwirkend gibt es nichts, weil die alten
 * Zähler bewusst ohne Zeit angelegt wurden.
 */
export const VERLAUF_POLL_ID = "verlauf-lernseite-2";

/** Heutiges Datum als `JJJJ-MM-TT` in lokaler Zeit (Schweiz, nicht UTC). */
export function heuteKey(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const t = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${t}`;
}

/**
 * Tages-Register: kompakt nur der HEUTIGE Tag mit seinen gezählten Schlüsseln,
 * ein Datumswechsel leert es von selbst. So wächst im localStorage nichts an.
 */
const KEY_TAG = "ki26-nutzung-tag";

function heuteSchonGezaehlt(schluessel: string): boolean {
  try {
    const heute = heuteKey();
    const raw = window.localStorage.getItem(KEY_TAG);
    const o = raw ? (JSON.parse(raw) as { tag?: string; keys?: string[] }) : {};
    const keys = o.tag === heute && Array.isArray(o.keys) ? o.keys : [];
    if (keys.includes(schluessel)) return true;
    window.localStorage.setItem(
      KEY_TAG,
      JSON.stringify({ tag: heute, keys: [...keys, schluessel] }),
    );
    return false;
  } catch {
    /* Privatmodus: lieber nicht zählen als doppelt zählen. */
    return true;
  }
}

/** Verlauf: zählt diesen Schlüssel höchstens einmal je Browser und Tag. */
function einmalHeute(schluessel: string): void {
  if (typeof window === "undefined" || !zaehltAnonym()) return;
  if (heuteSchonGezaehlt(schluessel)) return;
  void castVote(VERLAUF_POLL_ID, `${schluessel}:${heuteKey()}`);
}

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
  // Verlauf: dieselbe Handlung zusätzlich als Tagessumme (Gesamt + Thema).
  einmalHeute("alle");
  if (slug) einmalHeute(slug);
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

/**
 * Verlaufs-Zähler entpacken: Schlüssel → Datum → Browser an diesem Tag.
 * Der Schlüssel ist «alle» oder ein Themen-Slug; getrennt wird am LETZTEN
 * Doppelpunkt, weil Slugs Bindestriche tragen und das Datum immer hinten steht.
 */
export function leseVerlauf(
  counts: PollCounts,
): Record<string, Record<string, number>> {
  const aus: Record<string, Record<string, number>> = {};
  for (const key in counts) {
    const n = Number(counts[key]) || 0;
    if (n <= 0) continue;
    const i = key.lastIndexOf(":");
    if (i <= 0) continue;
    const schluessel = key.slice(0, i);
    const datum = key.slice(i + 1);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) continue;
    (aus[schluessel] ??= {})[datum] = n;
  }
  return aus;
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
