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

const KEY = "ki26-auswertung-lernseite-2";
export const AUSWERTUNG_EVENT = "ki26-auswertung";

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
  window.dispatchEvent(new CustomEvent(AUSWERTUNG_EVENT, { detail: { key } }));
}

/** Alle gemeldeten Bereiche lesen. */
export function leseAuswertung(): AuswertungEintrag[] {
  return Object.values(lesen());
}
