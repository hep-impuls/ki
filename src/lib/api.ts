"use client";

/**
 * Client-Wrapper fuer die Next.js Route Handlers (`src/app/api/**`).
 *
 * Anders als 10mio (Cloud Function + Cross-Origin) laufen die Endpunkte hier
 * als same-origin Next.js Route Handlers — `fetch('/api/...')` reicht, kein
 * `PUBLIC_FUNCTIONS_API_BASE_URL`, kein App-Check-Header.
 *
 * Alles, was den `teachers/*`-Namespace beruehrt, MUSS hierueber laufen (der
 * Browser darf `teachers/*` nicht direkt lesen/schreiben — Admin SDK only).
 */

import type { StudentClassReport, TeacherReport } from "./types";

async function postApi<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  const res = await fetch(`/api/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* leere/nicht-JSON Antwort */
  }
  if (!res.ok) {
    const msg = (data as { error?: string } | null)?.error ?? `API-Fehler (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

/* ── Schueler ─────────────────────────────────────────────────────────────── */

export async function classExists(classCode: string): Promise<boolean> {
  const { exists } = await postApi<{ exists: boolean }>("student/class-exists", { classCode });
  return exists;
}

export async function loadStudentClassPrefs(studentCode: string): Promise<string[] | null> {
  const { requiredModules } = await postApi<{ requiredModules: string[] | null }>(
    "student/class-prefs",
    { studentCode },
  );
  return requiredModules;
}

export async function loadStudentClassReport(
  studentCode: string,
): Promise<StudentClassReport | null> {
  const { report } = await postApi<{ report: StudentClassReport | null }>(
    "student/class-report",
    { studentCode },
  );
  return report;
}

/* ── Lehrer (secret-gated) ───────────────────────────────────────────────── */

export async function saveTeacherSetupSecure(
  classCode: string,
  secret: string,
  requiredModules: string[],
): Promise<{ requiredModules: string[] }> {
  return postApi<{ ok: true; requiredModules: string[] }>("teacher/setup", {
    classCode,
    secret,
    requiredModules,
  });
}

export async function loadTeacherPrefsSecure(
  classCode: string,
  secret: string,
): Promise<string[]> {
  const { requiredModules } = await postApi<{ requiredModules: string[] }>("teacher/prefs", {
    classCode,
    secret,
  });
  return requiredModules;
}

export async function loadTeacherReportSecure(
  classCode: string,
  secret: string,
): Promise<TeacherReport> {
  return postApi<TeacherReport>("teacher/report", { classCode, secret });
}
