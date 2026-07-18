"use client";

/**
 * Gewichtung — mutierbare Bewertungen pro Punkt (anders als die append-only
 * Spuren). Die Lernenden gewichten einzelne Beschreibungen:
 *
 * - **Merkmale → Gestalt** (Präfix `vorhang-auf:gestalt`): Wie deutlich macht
 *   dieses Merkmal die Gestalt der KI? Stufe 0 = unkenntlich, 1 = verschwommen,
 *   2 = deutlich. Mehr «deutlich» → das Geflecht bekommt stärkere Konturen.
 * - **Kontext → Achtsamkeit** (Präfix `vorhang-auf:achtsamkeit`): Wie viel
 *   Achtsamkeit verdient dieser Aspekt? 0 = wenig, 1 = mittel, 2 = viel.
 *   Mehr Achtsamkeit → das Kontext-Muster wird farbiger, rötlicher.
 *
 * Lokal (localStorage), sofort und offline. Eigenes Event, damit die Muster
 * live reagieren. Bewusst getrennt von `spuren.ts`, weil Werte änderbar sind.
 */

const KEY = "ki26-gewichtung-lernseite-2";
export const GEWICHT_EVENT = "ki26-gewichtung";

function lesen(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    const o = raw ? (JSON.parse(raw) as unknown) : {};
    if (!o || typeof o !== "object" || Array.isArray(o)) return {};
    return o as Record<string, number>;
  } catch {
    return {};
  }
}

function schreiben(o: Record<string, number>): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(o));
  } catch {
    /* localStorage gesperrt (Privatmodus) → bewusst still */
  }
}

/** Alle Gewichtungen eines Präfixes als {index: stufe}. */
export function leseGewichtungen(prefix: string): Record<number, number> {
  const o = lesen();
  const p = `${prefix}:`;
  const out: Record<number, number> = {};
  for (const k in o) {
    if (k.startsWith(p)) {
      const i = Number(k.slice(p.length));
      if (Number.isInteger(i)) out[i] = o[k];
    }
  }
  return out;
}

/** Eine Gewichtung setzen (oder mit stufe=null löschen). Feuert GEWICHT_EVENT. */
export function setzeGewichtung(prefix: string, index: number, stufe: number | null): void {
  if (typeof window === "undefined") return;
  const o = lesen();
  const key = `${prefix}:${index}`;
  if (stufe === null) delete o[key];
  else o[key] = stufe;
  schreiben(o);
  window.dispatchEvent(
    new CustomEvent(GEWICHT_EVENT, { detail: { prefix, index, stufe } }),
  );
}

/**
 * Aggregierte Stärke 0..1 eines Präfixes: Summe der Stufen / (Anzahl × 2).
 * Nicht bewertete Punkte zählen als 0 — die Wirkung wächst, je mehr hoch
 * gewichtet wird.
 */
export function gewichtungsStaerke(prefix: string, anzahl: number): number {
  if (anzahl <= 0) return 0;
  const m = leseGewichtungen(prefix);
  let summe = 0;
  for (const i in m) summe += Math.max(0, Math.min(2, m[i]));
  return Math.max(0, Math.min(1, summe / (anzahl * 2)));
}
