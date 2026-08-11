import "server-only";

import { neueSid, passcodeStimmt } from "@/lib/korrektorat/session";

/**
 * Autoren-Übersicht (`/autoren`) — Anmeldung über einen geteilten Passcode,
 * Sitzung als HMAC-signiertes Cookie.
 *
 * Warum eine eigene Sitzung und nicht die des Korrektorats: Es sind
 * verschiedene Personen mit verschiedenen Rechten. Eine Korrekturperson soll
 * nicht in die Nutzungszahlen sehen, und wer die Zahlen liest, soll keine Texte
 * ändern können. Darum ein eigener Cookie-Name und ein eigener Passcode.
 *
 * Wiederverwendet werden nur zwei Bausteine aus dem Korrektorat, die von
 * Cookie-Namen unabhängig sind: der Passcode-Vergleich in konstanter Zeit und
 * die Sitzungs-Kennung. Alles Cookie-Nahe steht hier, damit an Pietros Modul
 * nichts geändert werden muss.
 *
 * Und was dieser Schutz NICHT leistet: Er hält die *Seite* privat, nicht die
 * *Zahlen*. Die Aggregat-Zähler liegen in Firestore mit öffentlichem Lesezugriff
 * (dieselben Zähler speisen das «alle» im Orakel der Lernenden). Wer die
 * Web-Config kennt, könnte sie direkt abfragen. Wer auch die Zahlen selbst
 * schützen will, braucht eine Route mit dem Admin SDK, und damit Pietro.
 */

const COOKIE_NAME = "ki26_autoren";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 Tage — wir schauen selten hin

export interface AutorenKonfig {
  passcode: string;
  secret: string;
}

/** Welche Umgebungsvariablen fehlen? Leer = konfiguriert. */
export function fehlendeKonfig(): string[] {
  const fehlt: string[] = [];
  if (!process.env.AUTOREN_PASSCODE) fehlt.push("AUTOREN_PASSCODE");
  if (!process.env.AUTOREN_SESSION_SECRET) fehlt.push("AUTOREN_SESSION_SECRET");
  return fehlt;
}

export function konfig(): AutorenKonfig | null {
  if (fehlendeKonfig().length) return null;
  return {
    passcode: process.env.AUTOREN_PASSCODE!,
    secret: process.env.AUTOREN_SESSION_SECRET!,
  };
}

/* ── Krypto (Web Crypto, damit es auch in einer Edge-Runtime läuft) ──────── */

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(nachricht: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(nachricht));
  return b64urlEncode(new Uint8Array(sig));
}

/** Vergleich ohne Zeitverrat. */
function gleichKonstanteZeit(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let acc = 0;
  for (let i = 0; i < a.length; i++) acc |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return acc === 0;
}

/* ── Cookie ──────────────────────────────────────────────────────────────── */

export const AUTOREN_COOKIE = COOKIE_NAME;

/** `Set-Cookie`-Wert für eine neue Sitzung. */
export async function sitzungsCookie(secret: string): Promise<string> {
  const payload = b64urlEncode(
    new TextEncoder().encode(JSON.stringify({ sid: neueSid(), exp: Date.now() + TTL_MS })),
  );
  const token = `${payload}.${await hmac(payload, secret)}`;
  const sicher = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `${COOKIE_NAME}=${token}; HttpOnly;${sicher} SameSite=Lax; Path=/; Max-Age=${Math.floor(
    TTL_MS / 1000,
  )}`;
}

export function cookieLoeschen(): string {
  const sicher = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `${COOKIE_NAME}=; HttpOnly;${sicher} SameSite=Lax; Path=/; Max-Age=0`;
}

/**
 * Ist dieser Cookie-Wert eine gültige, nicht abgelaufene Sitzung?
 *
 * Nimmt den Wert statt eines `Request`, damit dieselbe Prüfung sowohl in einem
 * Route Handler als auch in einer Server-Komponente (`cookies()`) läuft.
 */
export async function sitzungGueltig(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token || !secret) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  if (!gleichKonstanteZeit(sig, await hmac(payload, secret))) return false;
  try {
    const daten = JSON.parse(new TextDecoder().decode(b64urlDecode(payload))) as {
      exp?: number;
    };
    return Boolean(daten.exp && daten.exp > Date.now());
  } catch {
    return false;
  }
}

export { passcodeStimmt };
