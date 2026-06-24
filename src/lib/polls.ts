"use client";

import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  increment,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebase } from "./firebase";

/**
 * Lean Poll-/Aggregat-Zähler für die KI-Einheit (bewertungsfrei).
 *
 * Datenmodell:
 *   abstimmungen/{UNIT_ID}/polls/{pollId} = { counts: { [optionId]: number } }
 *
 * Leitplanken (siehe docs/decisions.md, 2026-06-20 + 2026-06-24):
 * - NUR anonyme Aggregat-Zähler (increment(+1)). KEINE Einzelantworten,
 *   KEIN studentCode, KEIN Freitext — Datenminimierung schützt stärker als
 *   jede Rule.
 * - Eigene Antworten (welche Option ICH wählte, mein "ein Satz") gehören
 *   NICHT hierher → bleiben im Browser (localStorage/State).
 * - Lesen/Schreiben sind durch die live iperka-lms-Rules gedeckt
 *   (abstimmungen/{id}/polls: read, write: if true) — kein Auth nötig.
 * - Niemals Rules aus ki26 deployen (würde 10mio überschreiben).
 */

const UNIT_ID = process.env.NEXT_PUBLIC_UNIT_ID ?? "ki26";

export type PollCounts = Record<string, number>;

function pollRef(pollId: string) {
  const { db } = getFirebase();
  if (!db) return null; // SSR oder fehlende Config → No-op
  return doc(db, "abstimmungen", UNIT_ID, "polls", pollId);
}

/**
 * Eine Stimme zählen: counts[optionId] += 1.
 * Doppel-Abstimmen verhindert der Aufrufer (z.B. localStorage-Flag) — der
 * Zähler selbst ist bewusst idempotenz-frei und so simpel wie möglich.
 */
export async function castVote(pollId: string, optionId: string): Promise<void> {
  const ref = pollRef(pollId);
  if (!ref) return;
  try {
    await setDoc(ref, { counts: { [optionId]: increment(1) } }, { merge: true });
  } catch (err) {
    console.warn("[polls] castVote failed", pollId, optionId, err);
  }
}

/** Aktuelle Zähler einmalig laden. Liefert {} wenn der Poll noch leer ist. */
export async function loadPollCounts(pollId: string): Promise<PollCounts> {
  const ref = pollRef(pollId);
  if (!ref) return {};
  try {
    const snap = await getDoc(ref);
    const counts = snap.exists() ? snap.data()?.counts : undefined;
    return counts && typeof counts === "object" ? (counts as PollCounts) : {};
  } catch (err) {
    console.warn("[polls] loadPollCounts failed", pollId, err);
    return {};
  }
}

/**
 * Live abonnieren — ideal für den Kollektiv-Spiegel ("alle Schulen"), der sich
 * in Echtzeit füllt. Gibt eine Unsubscribe-Fn zurück; im useEffect-Cleanup
 * aufrufen. Ohne Config ein No-op (leere Fn).
 */
export function subscribePollCounts(
  pollId: string,
  cb: (counts: PollCounts) => void,
): Unsubscribe {
  const ref = pollRef(pollId);
  if (!ref) return () => {};
  return onSnapshot(
    ref,
    (snap) => {
      const counts = snap.exists() ? snap.data()?.counts : undefined;
      cb(counts && typeof counts === "object" ? (counts as PollCounts) : {});
    },
    (err) => console.warn("[polls] subscribe failed", pollId, err),
  );
}

/** Summe aller Stimmen — für Prozent-Berechnung im Spiegel. */
export function totalVotes(counts: PollCounts): number {
  return Object.values(counts).reduce((sum, n) => sum + (Number(n) || 0), 0);
}

/**
 * Hilfsfunktion: einen 1..steps-Skalenwert (z.B. Slider 1–7) in eine
 * Options-ID für den Zähler übersetzen — so wird aus einer Position ein
 * aggregierbarer Bucket (z.B. "s3").
 */
export function scaleBucket(value: number): string {
  return `s${Math.round(value)}`;
}
