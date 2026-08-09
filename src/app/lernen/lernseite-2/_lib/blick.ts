"use client";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import { seg } from "@/lib/paths";
import { getSession } from "@/lib/session";

/**
 * Blick — die selbst gewählte Grundhaltung zur KI («Wie blickst du heute auf
 * KI?»), pro FORTSCHRITTS-CODE gespeichert und in die Cloud gespiegelt.
 *
 * Vorher lag die Wahl unter einem gerätweiten localStorage-Schlüssel, also
 * «eine Stimme pro Gerät». Auf einem Schulgerät heisst das: Die zweite Person,
 * die sich mit ihrem eigenen Code anmeldet, sieht die Wahl der ersten, ihre
 * Knöpfe sind gesperrt, und ihr Klick wird verworfen. Genau das hat Christof
 * am 2026-08-09 gemeldet («wieso steht dann (1)?»): Die zweite
 * «kritisch»-Stimme kam nie im Zähler an. Und umgekehrt fehlte die eigene Wahl
 * auf dem zweiten Gerät, obwohl das Orakel sie als Hauptquelle für den KI-Typ
 * braucht.
 *
 * Jetzt gilt: eine Stimme pro Code. Lokal unter `ki26-orakel-blick:{code}`,
 * gespiegelt nach `students/{code}/progress/lernseite-2-blick`.
 *
 * ÜBERNAHME des alten Schlüssels: Ein vorhandener Geräte-Eintrag wird der
 * ZUERST angemeldeten Person zugeschrieben (sie hat ihn fast immer gesetzt)
 * und dann entfernt, damit die nächste Person am selben Gerät frei wählen
 * kann. Für die übernommene Wahl wird KEINE neue Stimme gezählt, die alte
 * steckt schon im Zähler.
 */

const LEGACY_KEY = "ki26-orakel-blick";
const MODUL = "lernseite-2-blick";

function key(code: string | null): string {
  return code ? `${LEGACY_KEY}:${code}` : LEGACY_KEY;
}

function docRef(code: string) {
  const { db } = getFirebase();
  if (!db) return null;
  const s = seg.progressDoc(code, MODUL);
  return doc(db, s[0], ...s.slice(1));
}

/** Wahl dieses Codes lesen (mit einmaliger Übernahme des alten Geräte-Eintrags). */
export function leseBlick(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const code = getSession()?.studentCode ?? null;
    const eigene = window.localStorage.getItem(key(code));
    if (eigene) return eigene;
    if (!code) return null;
    const alt = window.localStorage.getItem(LEGACY_KEY);
    if (alt) {
      window.localStorage.setItem(key(code), alt);
      window.localStorage.removeItem(LEGACY_KEY);
      spiegeln(code, alt);
      return alt;
    }
    return null;
  } catch {
    return null;
  }
}

/** Wahl dieses Codes speichern (lokal und in der Cloud). */
export function schreibeBlick(wahl: string): void {
  if (typeof window === "undefined" || !wahl) return;
  const code = getSession()?.studentCode ?? null;
  try {
    window.localStorage.setItem(key(code), wahl);
  } catch {
    /* Privatmodus → still */
  }
  if (code) spiegeln(code, wahl);
}

function spiegeln(code: string, wahl: string): void {
  const ref = docRef(code);
  if (!ref) return;
  void setDoc(ref, { wahl, updatedAt: serverTimestamp() }, { merge: true }).catch(
    (err) => console.warn("[blick] mirror failed", err),
  );
}

/**
 * Cloud → lokal: die Wahl dieses Codes zurückholen (zweites Gerät). Lokale
 * Wahl gewinnt. Gibt die dann gültige Wahl zurück; für eine aus der Cloud
 * übernommene Wahl wird KEINE neue Stimme gezählt, sie steckt schon im Zähler.
 */
export async function zieheBlickAusCloud(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const code = getSession()?.studentCode ?? null;
  if (!code) return null;
  const lokal = leseBlick();
  if (lokal) return lokal;
  const ref = docRef(code);
  if (!ref) return null;
  try {
    const snap = await getDoc(ref);
    const wahl = snap.exists() ? snap.data()?.wahl : null;
    if (typeof wahl !== "string" || !wahl) return null;
    try {
      window.localStorage.setItem(key(code), wahl);
    } catch {
      /* Privatmodus → still */
    }
    return wahl;
  } catch (err) {
    console.warn("[blick] cloud pull failed", err);
    return null;
  }
}
