"use client";

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
