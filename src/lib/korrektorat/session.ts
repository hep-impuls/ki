import "server-only";

/**
 * Korrektorat — Anmeldung über Passcode, Sitzung als HMAC-signiertes Cookie.
 *
 * Es gibt hier bewusst **keine** Verbindung zur Schüler-Session
 * ([src/lib/session.ts](../session.ts), Fortschritts-Codes) und keinen
 * GitHub-Account: Sebastian meldet sich am *Editor* an, nicht am Repo. Das
 * Repo-Token liegt ausschliesslich serverseitig.
 *
 * Format: `<payload-b64url>.<signatur-b64url>`, Payload `{ sid, exp }`.
 * Reines Web Crypto, damit derselbe Code auch in einer Edge-Runtime läuft.
 */

const COOKIE_NAME = "ki26_korrektorat";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 Tage

export interface KorrektoratSession {
  sid: string;
  exp: number;
}

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

/** Vergleich ohne Zeitverrat — Länge wird bewusst nicht früh abgebrochen. */
function gleichKonstanteZeit(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let acc = 0;
  for (let i = 0; i < a.length; i++) acc |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return acc === 0;
}

/** Passcode gegen `KORREKTORAT_PASSCODE` prüfen (über SHA-256-Digest). */
export async function passcodeStimmt(eingabe: string, erwartet: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(eingabe)),
    crypto.subtle.digest("SHA-256", enc.encode(erwartet)),
  ]);
  const av = new Uint8Array(a);
  const bv = new Uint8Array(b);
  let acc = 0;
  for (let i = 0; i < av.length; i++) acc |= av[i] ^ bv[i];
  return acc === 0;
}

export function neueSid(): string {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const hex = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** `Set-Cookie`-Wert für eine neue Sitzung. */
export async function sitzungsCookie(sid: string, secret: string): Promise<string> {
  const payload = b64urlEncode(
    new TextEncoder().encode(JSON.stringify({ sid, exp: Date.now() + TTL_MS })),
  );
  const token = `${payload}.${await hmac(payload, secret)}`;
  const sicher = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `${COOKIE_NAME}=${token}; HttpOnly;${sicher} SameSite=Lax; Path=/; Max-Age=${Math.floor(TTL_MS / 1000)}`;
}

export function cookieLoeschen(): string {
  const sicher = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `${COOKIE_NAME}=; HttpOnly;${sicher} SameSite=Lax; Path=/; Max-Age=0`;
}

/** Sitzung aus dem Cookie lesen und die Signatur prüfen. `null` = nicht angemeldet. */
export async function sitzungLesen(
  request: Request,
  secret: string,
): Promise<KorrektoratSession | null> {
  if (!secret) return null;
  const kopf = request.headers.get("Cookie") || "";
  const token = kopf
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  if (!token) return null;

  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  if (!gleichKonstanteZeit(sig, await hmac(payload, secret))) return null;

  try {
    const daten = JSON.parse(new TextDecoder().decode(b64urlDecode(payload))) as KorrektoratSession;
    if (!daten.exp || daten.exp < Date.now()) return null;
    return daten;
  } catch {
    return null;
  }
}
