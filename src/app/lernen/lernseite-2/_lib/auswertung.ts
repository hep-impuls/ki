"use client";

/**
 * Auswertung — kleiner lokaler Melde-Store, mit dem die interaktiven Flächen-/
 * Weben-Komponenten (Teppich des Wandels, KI-Story) dem Orakel-Dashboard ihre
 * Bilanz mitteilen, OHNE dass das Orakel deren Inhaltsdaten kennen muss:
 *
 *  - wie viele Flächen (Maschen) geknüpft sind vs. wie viele möglich wären,
 *  - welche Inhalte (Titel) ausgewählt wurden — für die analytische
 *    Interessens-Rückmeldung.
 *
 * Die Komponenten rufen `melde(...)` bei jeder Änderung; das Orakel liest per
 * `leseAuswertung()` und lauscht auf `AUSWERTUNG_EVENT`. Rein lokal
 * (localStorage), wie `spuren`/`gewichtung`. Kein Cloud-Spiegel.
 */

import { castVote } from "@/lib/polls";
import { zaehltAnonym } from "./spuren";

const KEY = "ki26-auswertung-lernseite-2";
export const AUSWERTUNG_EVENT = "ki26-auswertung";
/** Anonymer Aggregat-Zähler: wie viele Flächen (Maschen) alle zusammen je
 *  geknüpft haben — pro Bereich als Option. Fürs «alle» im Aktivitätsnetz. */
export const FLAECHEN_POLL_ID = "flaechen-lernseite-2";
/** Register (max je Bereich je gezählt), damit ein «Muster zurücksetzen» und
 *  erneutes Weben den anonymen Zähler nicht aufbläht. */
const KEY_FLAECHEN_GEZAEHLT = "ki26-flaechen-gezaehlt";

/**
 * Neu hinzugekommene Flächen eines Bereichs anonym zählen: nur den Zuwachs
 * über den bisher je gezählten Höchststand hinaus (idempotent pro Browser).
 */
function zaehleFlaechenAnonym(key: string, gefuellt: number): void {
  if (typeof window === "undefined" || !zaehltAnonym()) return;
  try {
    const raw = window.localStorage.getItem(KEY_FLAECHEN_GEZAEHLT);
    const reg = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    const prev = typeof reg[key] === "number" ? reg[key] : 0;
    if (gefuellt <= prev) return;
    const zuwachs = gefuellt - prev;
    for (let k = 0; k < zuwachs; k++) void castVote(FLAECHEN_POLL_ID, key);
    reg[key] = gefuellt;
    window.localStorage.setItem(KEY_FLAECHEN_GEZAEHLT, JSON.stringify(reg));
  } catch {
    /* Privatmodus → still */
  }
}

export interface AuswertungEintrag {
  /** Anzeigename des Bereichs, z.B. "Die KI-Story". */
  bereich: string;
  /** Geknüpfte Flächen (Maschen mit allen drei Ecken besucht). */
  flaechenGefuellt: number;
  /** Maximal mögliche Flächen in diesem Bereich. */
  flaechenTotal: number;
  /** Titel der ausgewählten Inhalte (für die Interessens-Analyse). */
  labels: string[];
}

type Store = Record<string, AuswertungEintrag>;

function lesen(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    const o = raw ? (JSON.parse(raw) as unknown) : {};
    if (!o || typeof o !== "object" || Array.isArray(o)) return {};
    return o as Store;
  } catch {
    return {};
  }
}

function schreiben(o: Store): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(o));
  } catch {
    /* Privatmodus → still */
  }
}

/** Bilanz eines Bereichs melden (idempotent überschreibend). Feuert Event nur
 *  bei tatsächlicher Änderung, um Render-Schleifen zu vermeiden. */
export function melde(key: string, eintrag: AuswertungEintrag): void {
  if (typeof window === "undefined" || !key) return;
  const o = lesen();
  const alt = o[key];
  if (
    alt &&
    alt.bereich === eintrag.bereich &&
    alt.flaechenGefuellt === eintrag.flaechenGefuellt &&
    alt.flaechenTotal === eintrag.flaechenTotal &&
    alt.labels.length === eintrag.labels.length &&
    alt.labels.every((l, i) => l === eintrag.labels[i])
  ) {
    return; // unverändert
  }
  o[key] = eintrag;
  schreiben(o);
  // Zuwachs an Flächen anonym mitzählen (fürs «alle» im Aktivitätsnetz).
  zaehleFlaechenAnonym(key, eintrag.flaechenGefuellt);
  window.dispatchEvent(new CustomEvent(AUSWERTUNG_EVENT, { detail: { key } }));
}

/** Alle gemeldeten Bereiche lesen. */
export function leseAuswertung(): AuswertungEintrag[] {
  return Object.values(lesen());
}

/** Wie leseAuswertung, aber mit dem Melde-Schlüssel (z.B. Spur-Präfix). */
export function leseAuswertungMap(): Record<string, AuswertungEintrag> {
  return lesen();
}

/** Geknüpfte Flächen über alle Bereiche — fürs Aktivitätsnetz/Orakel. */
export function zaehleFlaechen(): { gefuellt: number; total: number } {
  return leseAuswertung().reduce(
    (acc, a) => ({
      gefuellt: acc.gefuellt + a.flaechenGefuellt,
      total: acc.total + a.flaechenTotal,
    }),
    { gefuellt: 0, total: 0 },
  );
}
