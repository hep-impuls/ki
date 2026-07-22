"use client";

/**
 * Inhalte — kleine ID→Titel-Registry für Lernseite 2. Die Spuren/Poll-Zähler
 * kennen nur strukturelle IDs (z.B. `vorhang-auf:story:5`); für lesbare Labels
 * (Sternenkarte im Orakel) braucht es die Klartext-Titel.
 *
 * Single Source: die Inhalts-Komponenten registrieren beim Rendern ihren Titel
 * über `merkeInhalt(basisId, titel)` (via KartenAktion). So bleibt der Titel
 * dort, wo der Inhalt definiert ist — keine Zweit-Tabelle, die driften könnte.
 * Rein lokal (localStorage); die Registry ist vollständig, sobald man die
 * jeweilige Seite einmal geöffnet hat (alle Karten rendern, nicht nur besuchte).
 *
 * `basisId` = Inhalts-ID OHNE `wunsch:`/`mehr:`-Präfix, z.B.
 * `philosophische-perspektive:teppich:3`.
 */

const KEY = "ki26-inhalte-lernseite-2";

function lesen(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    const o = raw ? (JSON.parse(raw) as unknown) : {};
    if (!o || typeof o !== "object" || Array.isArray(o)) return {};
    return o as Record<string, string>;
  } catch {
    return {};
  }
}

function schreiben(o: Record<string, string>): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(o));
  } catch {
    /* Privatmodus → still */
  }
}

/** Einen Inhalts-Titel registrieren (idempotent, schreibt nur bei Änderung). */
export function merkeInhalt(basisId: string, titel: string): void {
  if (typeof window === "undefined" || !basisId || !titel) return;
  const o = lesen();
  if (o[basisId] === titel) return;
  o[basisId] = titel;
  schreiben(o);
}

/** Ganze Registry lesen. */
export function leseInhalte(): Record<string, string> {
  return lesen();
}

/** Titel zu einer Basis-ID (oder undefined). */
export function titelFuer(basisId: string): string | undefined {
  return lesen()[basisId];
}
