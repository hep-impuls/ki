import "server-only";

import {
  initializeApp,
  getApps,
  cert,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Firebase Admin SDK Singleton — **nur server-seitig** (Route Handlers).
 *
 * Warum Admin SDK statt Client-SDK fuer den Lehrer-Tier?
 * - Das Admin SDK **umgeht** die Firestore-Rules. So funktioniert der
 *   `teachers/*`-Zugriff, OHNE dass die geteilten live `iperka-lms`-Rules
 *   angefasst werden muessen (ki26 darf NIE Rules deployen — wuerde 10mio
 *   ueberschreiben; siehe CLAUDE.md).
 * - Die Secret-Logik (SHA-256, single-owner) bleibt damit rein server-seitig.
 *
 * Service-Account-Key kommt aus einer Env-Var (Vercel Project Settings → Env,
 * bzw. lokal `.env.local`):
 *   FIREBASE_SERVICE_ACCOUNT = <vollstaendiges Service-Account-JSON als String>
 * Niemals ins Repo committen. Generieren via Firebase Console → Projekt-
 * einstellungen → Dienstkonten → "Neuen privaten Schluessel generieren".
 *
 * Akzeptiert wahlweise rohes JSON oder Base64-kodiertes JSON (manche Hoster
 * moegen keine mehrzeiligen Env-Werte → Base64 ist robuster).
 */

let cachedApp: App | null = null;

function loadServiceAccount(): Record<string, unknown> | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  const text = raw.trim().startsWith("{")
    ? raw
    : Buffer.from(raw, "base64").toString("utf8");
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch (err) {
    console.error("[firebaseAdmin] FIREBASE_SERVICE_ACCOUNT konnte nicht geparst werden", err);
    return null;
  }
}

/**
 * Admin-App holen (oder null, wenn kein Service-Account konfiguriert ist — die
 * Route Handlers antworten dann mit einem klaren 503 statt zu crashen).
 */
export function getAdminApp(): App | null {
  if (cachedApp) return cachedApp;
  if (getApps().length) {
    cachedApp = getApps()[0]!;
    return cachedApp;
  }
  const sa = loadServiceAccount();
  if (!sa) return null;
  cachedApp = initializeApp({
    credential: cert(sa as Parameters<typeof cert>[0]),
  });
  return cachedApp;
}

/** Admin-Firestore-Instanz (oder null, wenn nicht konfiguriert). */
export function getAdminDb(): Firestore | null {
  const app = getAdminApp();
  if (!app) return null;
  return getFirestore(app);
}

/** SHA-256-Hash des getrimmten Secrets (server-seitig, Node crypto). */
export async function hashSecretNode(secret: string): Promise<string> {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(secret.trim()).digest("hex");
}
