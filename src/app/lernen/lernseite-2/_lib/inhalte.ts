"use client";

import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import { seg } from "@/lib/paths";
import { getSession } from "@/lib/session";

/**
 * Inhalte — kleine ID→Titel-Registry für Lernseite 2. Die Spuren/Poll-Zähler
 * kennen nur strukturelle IDs (z.B. `vorhang-auf:story:5`); für lesbare Labels
 * (Sternenkarte im Orakel) braucht es die Klartext-Titel.
 *
 * Single Source: die Inhalts-Komponenten registrieren beim Rendern ihren Titel
 * über `merkeInhalt(basisId, titel)` (via KartenAktion). So bleibt der Titel
 * dort, wo der Inhalt definiert ist — keine Zweit-Tabelle, die driften könnte.
 * Lokal (localStorage); die Registry ist vollständig, sobald man die jeweilige
 * Seite einmal geöffnet hat (alle Karten rendern, nicht nur besuchte).
 *
 * Zusätzlich wird die Registry pro Nutzer:in nach Firestore gespiegelt
 * (`students/{code}/progress/lernseite-2-inhalte` → `{ titel }`), damit das
 * Klassen-Orakel der Lehrperson die IDs serverseitig in Klartext-Titel auflösen
 * kann. Titel sind reine Inhalts-Metadaten (für alle gleich, nichts Persönliches).
 *
 * `basisId` = Inhalts-ID OHNE `wunsch:`/`mehr:`-Präfix, z.B.
 * `philosophische-perspektive:teppich:3`.
 */

const KEY = "ki26-inhalte-lernseite-2";
/** Modul-Kennung des Pro-Nutzer-Titel-Docs (gespiegelte Registry). */
const INHALTE_MODUL = "lernseite-2-inhalte";

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

/** Debounce fürs Cloud-Spiegeln der Titel-Registry (nicht bei jedem Titel
 *  einzeln schreiben). No-op ohne Code/Config. */
let mirrorTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleMirror(): void {
  if (mirrorTimer) clearTimeout(mirrorTimer);
  mirrorTimer = setTimeout(() => {
    mirrorTimer = null;
    const code = getSession()?.studentCode;
    if (!code) return;
    const { db } = getFirebase();
    if (!db) return;
    const s = seg.progressDoc(code, INHALTE_MODUL);
    const ref = doc(db, s[0], ...s.slice(1));
    void setDoc(
      ref,
      { titel: lesen(), updatedAt: serverTimestamp() },
      { merge: true },
    ).catch((err) => console.warn("[inhalte] mirror failed", err));
  }, 1500);
}

/** Einen Inhalts-Titel registrieren (idempotent, schreibt nur bei Änderung). */
export function merkeInhalt(basisId: string, titel: string): void {
  if (typeof window === "undefined" || !basisId || !titel) return;
  const o = lesen();
  if (o[basisId] === titel) return;
  o[basisId] = titel;
  schreiben(o);
  scheduleMirror();
}

/** Ganze Registry lesen. */
export function leseInhalte(): Record<string, string> {
  return lesen();
}

/** Titel zu einer Basis-ID (oder undefined). */
export function titelFuer(basisId: string): string | undefined {
  return lesen()[basisId];
}
