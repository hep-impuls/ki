"use client";

import { castVote } from "@/lib/polls";

/**
 * Spuren — das Wege-Gedächtnis für Lernseite 2, zweifach gesammelt:
 *
 * 1. **Lokal (localStorage):** WELCHE Knoten DU besucht hast — Weisheiten am
 *    FadenNetz, Knoten im KnotenNetz, aufgeklappte Bausteine im Zeitstrahl,
 *    das aufgedeckte Akteurs-Modell. Verlässt das Gerät nie.
 * 2. **Anonym (Firebase):** pro Besuch nur ein `+1` auf einen Aggregat-Zähler
 *    (Poll-Mechanik, abstimmungen/ki26/polls/spuren-lernseite-2) — ohne
 *    Namen, ohne Code, ohne Zeit-Personen-Bezug. Daraus entsteht das «alle»,
 *    mit dem sich das Orakel-Dashboard (Thema 04) vergleicht und auf das
 *    sich die KI (nur als Zusammenfassung!) bezieht.
 *
 * Der Vergleich «du ↔ der Rest» passiert ausschliesslich im Browser: dein
 * lokales Exemplar neben den anonymen Gesamtzahlen. Die KI sieht nie
 * lokale Daten und nie Einzelpersonen.
 *
 * Spur-IDs sind flach und sprechend: `${seite}:${art}:${kennung}`, z.B.
 * "philosophische-perspektive:weisheit:2" oder
 * "philosophische-perspektive:baustein:kant:orientation".
 */

const KEY = "ki26-spuren-lernseite-2";
/** Poll-Doc für die anonymen Aktivitäts-Zähler (counts[spurId] += 1). */
export const SPUREN_POLL_ID = "spuren-lernseite-2";
/** Eigenes Event, damit offene Ansichten (Orakel-Dashboard) live mitzählen. */
export const SPUR_EVENT = "ki26-spur";

export interface Spur {
  id: string;
  t: number;
}

function lesen(): Spur[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (s): s is Spur =>
        !!s && typeof (s as Spur).id === "string" && typeof (s as Spur).t === "number",
    );
  } catch {
    return [];
  }
}

/** Eine Spur setzen (idempotent — jede Kennung zählt nur einmal).
 *  Lokal speichern + anonym `+1` in den Firebase-Aggregat-Zähler. */
export function merkeSpur(id: string): void {
  if (typeof window === "undefined" || !id) return;
  try {
    const spuren = lesen();
    if (spuren.some((s) => s.id === id)) return;
    spuren.push({ id, t: Date.now() });
    window.localStorage.setItem(KEY, JSON.stringify(spuren));
    window.dispatchEvent(new CustomEvent(SPUR_EVENT, { detail: { id } }));
    // Anonymer Zähler fürs «alle» — fire-and-forget, castVote fängt Fehler ab.
    void castVote(SPUREN_POLL_ID, id);
  } catch {
    /* localStorage gesperrt (z.B. Privatmodus) → bewusst still */
  }
}

/** Alle Spuren lesen (nur lokal). */
export function leseSpuren(): Spur[] {
  return lesen();
}

/** Anzahl Spuren mit einem Präfix, z.B. "kulturelle-perspektive:weisheit". */
export function zaehleSpuren(prefix: string): number {
  return lesen().filter((s) => s.id.startsWith(prefix)).length;
}
