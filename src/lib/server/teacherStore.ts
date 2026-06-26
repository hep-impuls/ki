import "server-only";

import { getAdminDb, hashSecretNode } from "../firebaseAdmin";
import {
  teacherDocPath,
  studentsPath,
  pollsPath,
} from "../paths";
import type {
  PollAggregate,
  Progress,
  TeacherPrefs,
  TeacherReport,
  TeacherReportStudent,
  StudentClassReport,
} from "../types";

/**
 * Server-seitige Lehrer-/Report-Logik (Admin SDK). Wird von den Route Handlers
 * unter `src/app/api/**` genutzt. Das Admin SDK umgeht die Firestore-Rules →
 * `teachers/*`-Zugriff ohne Rules-Aenderung (ki26 deployt nie Rules).
 */

/** Kanonische Form des Klassencodes (Doc-ID + student.teacherCode): UPPERCASE, getrimmt. */
export function canonicalClassCode(code: string): string {
  return code.trim().toUpperCase();
}

/**
 * Poll-Namespace-Form des Klassencodes — passend zu `unitPolls.resolveKlasse()`
 * (lowercase, nur a-z0-9-, max 24). So matchen die `kp-{klasse}-*`-Zaehler.
 */
export function klasseNamespace(code: string): string {
  return code.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 24) || "ohne-klasse";
}

export class NotConfiguredError extends Error {}
export class SecretMismatchError extends Error {}
export class ClassNotFoundError extends Error {}

function db() {
  const d = getAdminDb();
  if (!d) throw new NotConfiguredError("FIREBASE_SERVICE_ACCOUNT nicht konfiguriert");
  return d;
}

/* ── Setup / Claim ────────────────────────────────────────────────────────── */

/**
 * Klasse anlegen/aktualisieren (single-owner). Erster Call hasht das Secret und
 * legt das Doc an; jeder spaetere Call muss dasselbe Secret-Hash liefern (403).
 */
export async function teacherSetup(
  classCodeRaw: string,
  secret: string,
  requiredModules?: string[],
): Promise<{ requiredModules: string[] }> {
  const classCode = canonicalClassCode(classCodeRaw);
  const ref = db().doc(teacherDocPath(classCode));
  const snap = await ref.get();
  const incomingHash = await hashSecretNode(secret);

  if (snap.exists) {
    const stored = (snap.data() as TeacherPrefs)?.secretHash;
    if (stored && stored !== incomingHash) throw new SecretMismatchError();
  }

  const existing = snap.exists ? (snap.data() as TeacherPrefs) : null;
  const nextModules = requiredModules ?? existing?.requiredModules ?? [];

  await ref.set(
    {
      requiredModules: nextModules,
      updatedAt: new Date().toISOString(),
      secretHash: incomingHash,
    },
    { merge: true },
  );
  return { requiredModules: nextModules };
}

/** Secret gegen das gespeicherte Hash pruefen (wirft bei Fehler). */
async function assertSecret(classCode: string, secret: string): Promise<TeacherPrefs> {
  const ref = db().doc(teacherDocPath(classCode));
  const snap = await ref.get();
  if (!snap.exists) throw new ClassNotFoundError();
  const data = snap.data() as TeacherPrefs;
  const incoming = await hashSecretNode(secret);
  if (data.secretHash && data.secretHash !== incoming) throw new SecretMismatchError();
  return data;
}

/* ── Prefs ────────────────────────────────────────────────────────────────── */

export async function teacherPrefs(
  classCodeRaw: string,
  secret: string,
): Promise<{ requiredModules: string[] }> {
  const classCode = canonicalClassCode(classCodeRaw);
  const data = await assertSecret(classCode, secret);
  return { requiredModules: data.requiredModules ?? [] };
}

/** Existenz-Check (Onboarding) — kein Secret noetig. */
export async function classExists(classCodeRaw: string): Promise<boolean> {
  const classCode = canonicalClassCode(classCodeRaw);
  const snap = await db().doc(teacherDocPath(classCode)).get();
  return snap.exists;
}

/** Pflichtmodule eines Schuelers (greyt Module aus). null wenn ohne Klasse. */
export async function studentClassPrefs(studentCode: string): Promise<string[] | null> {
  const sSnap = await db().doc(`${studentsPath}/${studentCode}`).get();
  if (!sSnap.exists) return null;
  const teacherCode = (sSnap.data() as { teacherCode?: string | null })?.teacherCode;
  if (!teacherCode) return null;
  const tSnap = await db().doc(teacherDocPath(canonicalClassCode(teacherCode))).get();
  if (!tSnap.exists) return null;
  return (tSnap.data() as TeacherPrefs).requiredModules ?? [];
}

/* ── Aggregation ──────────────────────────────────────────────────────────── */

interface StudentProgressBundle {
  code: string;
  progressByModule: Record<string, Progress>;
  lastActive: string | null;
}

/** Alle Schueler einer Klasse + ihre progress-Docs laden. */
async function loadClassStudents(classCode: string): Promise<StudentProgressBundle[]> {
  const q = await db()
    .collection(studentsPath)
    .where("teacherCode", "==", classCode)
    .get();

  const out: StudentProgressBundle[] = [];
  for (const docSnap of q.docs) {
    const progSnap = await docSnap.ref.collection("progress").get();
    const progressByModule: Record<string, Progress> = {};
    let lastActive: string | null = null;
    for (const p of progSnap.docs) {
      const data = p.data() as Progress;
      progressByModule[p.id] = data;
      const ts = data.completedAt ?? null;
      if (ts && (!lastActive || ts > lastActive)) lastActive = ts;
    }
    out.push({ code: docSnap.id, progressByModule, lastActive });
  }
  return out;
}

/** Poll-Aggregate aus der `polls`-Collection: global (alle) vs. `kp-{klasse}-*` (Klasse). */
async function loadPollAggregates(classCode: string): Promise<PollAggregate[]> {
  const ns = klasseNamespace(classCode);
  const snap = await db().collection(pollsPath).get();

  // Sammle global + klasse pro logischer Poll-ID.
  const byId: Record<string, PollAggregate> = {};
  const ensure = (id: string) =>
    (byId[id] ??= { pollId: id, klasse: {}, alle: {} });

  for (const d of snap.docs) {
    const id = d.id;
    const counts = ((d.data() as { counts?: Record<string, number> })?.counts) ?? {};
    if (id.startsWith(`kp-${ns}-`)) {
      ensure(id.slice(`kp-${ns}-`.length)).klasse = counts;
    } else if (id.startsWith("k-") || id.startsWith("kp-")) {
      // anderer Klassen-Namespace → ignorieren
      continue;
    } else if (id.startsWith("p-")) {
      ensure(id.slice("p-".length)).alle = counts;
    } else {
      // sonstige globale Zaehler (g-*, st*, mr-*, wc-*, swipe-*)
      ensure(id).alle = counts;
    }
  }
  return Object.values(byId).filter(
    (a) => Object.keys(a.alle).length || Object.keys(a.klasse).length,
  );
}

function quizTotals(progressByModule: Record<string, Progress>) {
  let punkte = 0;
  let max = 0;
  const modulePct: Record<string, number> = {};
  for (const [moduleId, prog] of Object.entries(progressByModule)) {
    if (typeof prog.pct === "number") modulePct[moduleId] = prog.pct;
    for (const block of Object.values(prog.blocks ?? {})) {
      if (typeof block.punkte === "number") punkte += block.punkte;
      if (typeof block.max === "number") max += block.max;
    }
  }
  return { punkte, max, modulePct };
}

export async function teacherReport(
  classCodeRaw: string,
  secret: string,
): Promise<TeacherReport> {
  const classCode = canonicalClassCode(classCodeRaw);
  await assertSecret(classCode, secret); // wirft bei falschem Secret
  const students = await loadClassStudents(classCode);
  const polls = await loadPollAggregates(classCode);

  const rows: TeacherReportStudent[] = students.map((s) => {
    const { punkte, max, modulePct } = quizTotals(s.progressByModule);
    return {
      code: s.code, // Secret war korrekt → Codes sichtbar
      modulePct,
      quizPunkte: punkte,
      quizMax: max,
      lastActive: s.lastActive,
    };
  });

  return {
    classCode,
    n: rows.length,
    students: rows,
    polls,
    revealCodes: true,
  };
}

/** Anonymes Klassen-Aggregat fuer die Schueler-Ansicht (kein Secret). */
export async function studentClassReport(studentCode: string): Promise<StudentClassReport | null> {
  const sSnap = await db().doc(`${studentsPath}/${studentCode}`).get();
  if (!sSnap.exists) return null;
  const teacherCode = (sSnap.data() as { teacherCode?: string | null })?.teacherCode;
  if (!teacherCode) return null;
  const classCode = canonicalClassCode(teacherCode);

  const students = await loadClassStudents(classCode);
  if (students.length < 5) return null; // k-Anonymitaet

  const moduleSums: Record<string, { sum: number; n: number }> = {};
  const overallPct: number[] = [];
  let you: Record<string, number> = {};

  for (const s of students) {
    const { modulePct } = quizTotals(s.progressByModule);
    const vals = Object.values(modulePct);
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    overallPct.push(Math.round(avg));
    for (const [m, pct] of Object.entries(modulePct)) {
      const acc = (moduleSums[m] ??= { sum: 0, n: 0 });
      acc.sum += pct;
      acc.n += 1;
    }
    if (s.code === studentCode) you = modulePct;
  }

  const classAvg: Record<string, number> = {};
  for (const [m, acc] of Object.entries(moduleSums)) {
    classAvg[m] = acc.n ? Math.round(acc.sum / acc.n) : 0;
  }

  return {
    classCode,
    n: students.length,
    you,
    classAvg,
    distribution: overallPct.sort((a, b) => a - b),
  };
}
