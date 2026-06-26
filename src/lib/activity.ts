"use client";

/**
 * @deprecated Seit R6 (2026-06-26) abgeloest durch `src/lib/engagement.ts`.
 *
 * Diese Datei schrieb Events in die top-level `activities`-Collection mit einer
 * anonymen Firebase-Auth-`uid`. Der `ActivityTracker` nutzt diese Funktion nicht
 * mehr — er richtet stattdessen den namespaced Engagement-Tracker ein
 * (`abstimmungen/ki26/engagement`, getragen vom Animal-Code). `logActivity`
 * bleibt vorerst als Fallback erhalten, sollte aber in neuem Code nicht mehr
 * verwendet werden.
 */

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ensureAnonymousUser, getFirebase } from "./firebase";

export type ActivityType = "page_view" | "lesson_open" | "lesson_complete";

export async function logActivity(type: ActivityType, payload: Record<string, unknown> = {}) {
  try {
    const { db } = getFirebase();
    if (!db) return;
    const uid = await ensureAnonymousUser();
    if (!uid) return;
    await addDoc(collection(db, "activities"), {
      uid,
      type,
      ...payload,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("[activity] log failed", err);
  }
}
