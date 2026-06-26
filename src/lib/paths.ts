/**
 * Zentrale Firestore-Pfad-Generatoren fuer ki26 (Vorbild: 10mio
 * `src/lib/paths.ts`). Alles liegt unter `abstimmungen/{UNIT_ID}/...` und
 * kollidiert damit nie mit `10mio-2026`.
 *
 * Diese Datei ist **isomorph** (kein "use client", keine Firebase-Imports) —
 * sie liefert nur Pfad-Segmente als String-Arrays/Strings, damit sie sowohl im
 * Client-SDK (`doc(db, ...segments)`) als auch im Admin-SDK
 * (`db.doc(path)` / `db.collection(path)`) genutzt werden kann.
 */

export const UNIT_ID = process.env.NEXT_PUBLIC_UNIT_ID ?? "ki26";

/** Basis-Pfad des Namespace. */
export const unitBase = `abstimmungen/${UNIT_ID}`;

/* ── Schueler ─────────────────────────────────────────────────────────────── */
export const studentsPath = `${unitBase}/students`;
export const studentPath = (code: string) => `${studentsPath}/${code}`;

export const progressPath = (code: string) => `${studentPath(code)}/progress`;
export const progressDocPath = (code: string, moduleId: string) =>
  `${progressPath(code)}/${moduleId}`;

export const notesPath = (code: string) => `${studentPath(code)}/notes`;
export const notesDocPath = (code: string, moduleId: string) =>
  `${notesPath(code)}/${moduleId}`;

export const synthesisDocPath = (code: string) => `${studentPath(code)}/synthesis/current`;

/* ── Lehrer ───────────────────────────────────────────────────────────────── */
export const teachersPath = `${unitBase}/teachers`;
export const teacherDocPath = (classCode: string) => `${teachersPath}/${classCode}`;

/* ── Polls + Engagement ───────────────────────────────────────────────────── */
export const pollsPath = `${unitBase}/polls`;
export const pollDocPath = (pollId: string) => `${pollsPath}/${pollId}`;

export const engagementPath = `${unitBase}/engagement`;

/**
 * Segment-Varianten fuer das Client-SDK (`doc(db, ...segs)` / `collection(db,
 * ...segs)`), das einzelne Pfadsegmente statt eines Slash-Strings erwartet.
 */
export const seg = {
  studentDoc: (code: string) => ["abstimmungen", UNIT_ID, "students", code] as const,
  progressCol: (code: string) =>
    ["abstimmungen", UNIT_ID, "students", code, "progress"] as const,
  progressDoc: (code: string, moduleId: string) =>
    ["abstimmungen", UNIT_ID, "students", code, "progress", moduleId] as const,
  notesDoc: (code: string, moduleId: string) =>
    ["abstimmungen", UNIT_ID, "students", code, "notes", moduleId] as const,
  engagementCol: () => ["abstimmungen", UNIT_ID, "engagement"] as const,
};
