"use client";

/**
 * Schueler-Session + Animal-Code fuer ki26 (Vorbild: 10mio `src/lib/session.ts`).
 *
 * Format `ANIMAL-NNN`, z.B. `BÄR-334`. Die Session liegt rein im Browser
 * (localStorage), namespaced pro Lernset (`ki26-session`). Sie haelt nur den
 * `studentCode` und optional den `teacherCode` (Klassencode). Persoenliche
 * Lerndaten bleiben weiterhin in den lokalen Stores (stationStore/fortschritt);
 * der Code dient als Schluessel fuer den Firestore-Fortschritts-Spiegel.
 */

const UNIT_ID = process.env.NEXT_PUBLIC_UNIT_ID ?? "ki26";
const KEY = `${UNIT_ID}-session`;

/** Tier-Pool fuer die Code-Generierung (echte Umlaute, Swiss German). */
export const ANIMALS = [
  "BÄR", "WOLF", "FUCHS", "LUCHS", "GAMS", "RABE", "HASE", "ELCH", "DACHS",
  "IGEL", "OTTER", "ADLER", "GEIER", "STORCH", "UHU", "BIBER", "HIRSCH", "FALKE",
] as const;

export interface Session {
  studentCode: string;
  teacherCode: string | null;
}

/**
 * Memorierbaren Code erzeugen: `ANIMAL-NNN` (NNN = 100..999).
 * Kein Kollisions-Check (Raum ~ 18 x 900 = 16 200 — fuer Klassengroessen
 * ausreichend; bei Bedarf Tier-Pool erweitern).
 */
export function generateCode(): string {
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = String(Math.floor(Math.random() * 900) + 100);
  return `${animal}-${num}`;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (!parsed.studentCode) return null;
    return { studentCode: parsed.studentCode, teacherCode: parsed.teacherCode ?? null };
  } catch {
    return null;
  }
}

export function saveSession(s: Session): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore (privater Modus / Quota) */
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Bequemer Lesezugriff auf den aktuellen Code (oder null). */
export function currentStudentCode(): string | null {
  return getSession()?.studentCode ?? null;
}

/** Bequemer Lesezugriff auf den aktuellen Klassencode (oder null). */
export function currentTeacherCode(): string | null {
  return getSession()?.teacherCode ?? null;
}
