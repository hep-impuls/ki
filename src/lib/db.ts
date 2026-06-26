"use client";

/**
 * Schueler-Datenzugriff (Client-SDK) fuer ki26 — Vorbild: 10mio `src/lib/db.ts`.
 *
 * Schreibt/liest die Pro-Schueler-Docs direkt aus dem Browser. Das ist durch
 * die live `iperka-lms`-Rules gedeckt (`abstimmungen/{id}/students/*`:
 * read/write `if true` — Anonymitaet ueber Code-Obscurity, kein Login).
 *
 * Der Lehrer-Tier (`teachers/*`) laeuft NICHT hierueber, sondern ueber die
 * Route Handlers + Admin SDK (`src/lib/api.ts`), weil `teachers/*` im Browser
 * gesperrt ist.
 */

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebase } from "./firebase";
import { seg } from "./paths";
import type { Progress, Student } from "./types";

function refFromSegments(segments: readonly string[]) {
  const { db } = getFirebase();
  if (!db) return null;
  // doc(db, ...segments) — segments hat immer gerade Laenge (Doc-Pfad)
  return doc(db, segments[0], ...segments.slice(1));
}

/**
 * Schueler anlegen oder (nachtraeglich) mit einer Klasse verknuepfen.
 * Ueberschreibt eine bereits gesetzte Klasse NICHT (analog 10mio).
 */
export async function ensureStudent(
  studentCode: string,
  teacherCode: string | null,
): Promise<void> {
  const ref = refFromSegments(seg.studentDoc(studentCode));
  if (!ref) return;
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, { teacherCode: teacherCode ?? null, createdAt: serverTimestamp() });
      return;
    }
    // nur nachtraeglich anhaengen, nie ueberschreiben
    const existing = snap.data() as Student;
    if (teacherCode && !existing.teacherCode) {
      await setDoc(ref, { teacherCode }, { merge: true });
    }
  } catch (err) {
    console.warn("[db] ensureStudent failed", err);
  }
}

export async function loadStudent(studentCode: string): Promise<Student | null> {
  const ref = refFromSegments(seg.studentDoc(studentCode));
  if (!ref) return null;
  try {
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Student) : null;
  } catch (err) {
    console.warn("[db] loadStudent failed", err);
    return null;
  }
}

/** Nachtraeglich einen Klassencode anhaengen (Existenz vorher via api.classExists pruefen). */
export async function linkTeacherCode(
  studentCode: string,
  teacherCode: string,
): Promise<void> {
  const ref = refFromSegments(seg.studentDoc(studentCode));
  if (!ref) return;
  try {
    await setDoc(ref, { teacherCode }, { merge: true });
  } catch (err) {
    console.warn("[db] linkTeacherCode failed", err);
  }
}

/**
 * Pro-Modul-Fortschritt schreiben (merge). Spiegelt den lokalen Lernfortschritt
 * fuer den Lehrer-Report. localStorage bleibt die UX-Quelle.
 */
export async function saveProgress(
  studentCode: string,
  moduleId: string,
  data: Progress,
): Promise<void> {
  const ref = refFromSegments(seg.progressDoc(studentCode, moduleId));
  if (!ref) return;
  try {
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.warn("[db] saveProgress failed", moduleId, err);
  }
}

export async function loadProgress(
  studentCode: string,
  moduleId: string,
): Promise<Progress | null> {
  const ref = refFromSegments(seg.progressDoc(studentCode, moduleId));
  if (!ref) return null;
  try {
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as Progress) : null;
  } catch (err) {
    console.warn("[db] loadProgress failed", moduleId, err);
    return null;
  }
}

/**
 * SHA-256-Hash des getrimmten Secrets (Web Crypto — Client-Seite). Identisch
 * zur server-seitigen `hashSecretNode`, damit Client und Server denselben Hash
 * erzeugen. Wird hier z.B. fuer optionale Client-Vorpruefungen genutzt; die
 * autoritative Pruefung passiert server-seitig im Route Handler.
 */
export async function hashSecret(secret: string): Promise<string> {
  const data = new TextEncoder().encode(secret.trim());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
