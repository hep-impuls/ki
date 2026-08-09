"use client";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
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
/** Meldung, wenn Titel dazugekommen sind (Gegenstück zu SPUR_EVENT). */
export const INHALTE_EVENT = "ki26-inhalte";

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

/**
 * Cloud → lokal: die gespiegelte Titel-Registry zurückholen und mit dem lokalen
 * Bestand vereinen (lokale Titel gewinnen — sie kommen aus dem gerade
 * gerenderten Code und sind damit die aktuellen).
 *
 * WARUM ES DAS BRAUCHT. Die Registry wird PRO BROWSER gefüllt, und zwar nur von
 * Komponenten, die dort gerendert haben. Das Orakel rendert die Inhalte der
 * anderen Seiten nicht. Auf einem zweiten Gerät kamen darum die Punkte zurück
 * (`zieheSpurenAusCloud`) und die Bewertungen (`zieheGewichtungAusCloud`), die
 * NAMEN aber nicht — die Knotenkarte zeigte «Epochen · Punkt 4.0» statt des
 * Titels. Das Spiegeln gab es schon, nur das Zurückholen fehlte. Christof hat
 * das am 2026-08-08 als «bei manchen Browsern fehlen die Titel» gemeldet.
 *
 * Feuert INHALTE_EVENT, damit offene Ansichten sich neu beschriften. No-op ohne
 * Code/Config. Idempotent.
 */
export async function zieheInhalteAusCloud(): Promise<void> {
  if (typeof window === "undefined") return;
  const code = getSession()?.studentCode;
  if (!code) return;
  const { db } = getFirebase();
  if (!db) return;
  try {
    const s = seg.progressDoc(code, INHALTE_MODUL);
    const snap = await getDoc(doc(db, s[0], ...s.slice(1)));
    if (!snap.exists()) return;
    const remote = snap.data()?.titel;
    if (!remote || typeof remote !== "object" || Array.isArray(remote)) return;
    const lokal = lesen();
    const zusammen: Record<string, string> = {
      ...(remote as Record<string, string>),
      ...lokal,
    };
    if (JSON.stringify(zusammen) !== JSON.stringify(lokal)) {
      schreiben(zusammen);
      window.dispatchEvent(new CustomEvent(INHALTE_EVENT, { detail: { cloud: true } }));
    }
  } catch (err) {
    console.warn("[inhalte] cloud pull failed", err);
  }
}

/** Ganze Registry lesen. */
export function leseInhalte(): Record<string, string> {
  return lesen();
}

/** Titel zu einer Basis-ID (oder undefined). */
export function titelFuer(basisId: string): string | undefined {
  return lesen()[basisId];
}
