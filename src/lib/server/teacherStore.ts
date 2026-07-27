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
  TeacherOrakel,
  TeacherOrakelBereich,
  TeacherOrakelKontext,
  TeacherOrakelRhizom,
  TeacherOrakelThema,
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

/* ── Klassen-Orakel (Lernseite 2: Spuren pro Abschnitt) ─────────────────────── */

/** Modul-Doc mit der gespiegelten ID→Titel-Registry (aus inhalte.ts). */
const INHALTE_MODUL = "lernseite-2-inhalte";

/** Präfix → Abschnittstitel (spezifische Präfixe zuerst; erster Treffer gewinnt). */
const BEREICH_PREFIXE: { prefix: string; bereich: string }[] = [
  { prefix: "vorhang-auf:story", bereich: "Die KI-Story" },
  { prefix: "vorhang-auf:weisheit", bereich: "Merkmale der neuen Akteurin" },
  { prefix: "vorhang-auf:bild", bereich: "Bilder zur KI-Geschichte" },
  { prefix: "vorhang-auf:kontext", bereich: "Die KI im Kontext" },
  { prefix: "philosophische-perspektive:teppich", bereich: "Der Teppich des Wandels" },
  { prefix: "philosophische-perspektive:epochen-bild", bereich: "Bilder der Verunsicherung" },
  { prefix: "philosophische-perspektive:epochen", bereich: "Philosophie in Zeiten der Verunsicherung" },
  { prefix: "philosophische-perspektive:denker", bereich: "Wege der Orientierung" },
  { prefix: "philosophische-perspektive:denkwege", bereich: "Wege der Orientierung" },
  { prefix: "philosophische-perspektive:einstieg", bereich: "Was ist Philosophie?" },
  { prefix: "video:", bereich: "Video-Impulse" },
];

function bereichFuer(base: string): string {
  return BEREICH_PREFIXE.find((b) => base.startsWith(b.prefix))?.bereich ?? "Weiteres";
}

/** Abschnitt → Modul. Videos und Unbekanntes laufen unter «Übergreifend». */
function modulFuer(base: string): TeacherOrakelBereich["modul"] {
  if (base.startsWith("vorhang-auf:")) return "Vorhang auf";
  if (base.startsWith("philosophische-perspektive:")) return "Philosophische Perspektive";
  return "Übergreifend";
}

/** Gewichtungs-Präfix der Achtsamkeits-Frage in «Die KI im Kontext». */
const ACHTSAMKEIT_PREFIX = "vorhang-auf:achtsamkeit:";
/** Modul-Docs mit Bewertungen bzw. Flächen-Bilanz. */
const GEWICHT_MODUL = "lernseite-2-gewichtung";
const AUSWERTUNG_MODUL = "lernseite-2-auswertung";

/**
 * Klassen-Orakel: aggregiert die Spuren aller Klassen-Schueler:innen aus dem
 * Modul-Doc `lernseite-2-spuren` ({ ids }) pro Abschnitt — wie viel angeschaut,
 * vertieft («mehr:») und weiterverfolgt («wunsch:») wurde. Secret-gated.
 */
export async function teacherOrakel(
  classCodeRaw: string,
  secret: string,
): Promise<TeacherOrakel> {
  const classCode = canonicalClassCode(classCodeRaw);
  await assertSecret(classCode, secret); // wirft bei falschem Secret
  const students = await loadClassStudents(classCode);

  // Titel-Registry der Klasse zusammenführen (für alle gleich → einfach mergen).
  const titelMap: Record<string, string> = {};
  for (const s of students) {
    const inh = s.progressByModule[INHALTE_MODUL] as unknown as
      | { titel?: Record<string, string> }
      | undefined;
    if (inh?.titel && typeof inh.titel === "object") Object.assign(titelMap, inh.titel);
  }

  interface Agg {
    angeschaut: number;
    vertieft: number;
    weiterverfolgen: number;
    schueler: Set<string>;
  }
  const perBereich = new Map<string, Agg>();
  const ensure = (b: string): Agg => {
    let a = perBereich.get(b);
    if (!a) {
      a = { angeschaut: 0, vertieft: 0, weiterverfolgen: 0, schueler: new Set() };
      perBereich.set(b, a);
    }
    return a;
  };
  // Konkrete Themen (art + Basis-ID) für die Top-Listen mit Titel.
  interface Item {
    art: "angeschaut" | "vertieft" | "weiterverfolgen";
    base: string;
    anzahl: number;
  }
  const perItem = new Map<string, Item>();

  /* Die sechs Triebe des Rhizoms, aufsummiert über die Klasse. */
  const rhizom: TeacherOrakelRhizom = {
    punkte: 0,
    flaechen: 0,
    bildpunkte: 0,
    videos: 0,
    vertiefungen: 0,
    weiter: 0,
  };
  /* Achtsamkeits-Gewichtung: Summe und Anzahl je Aspekt. */
  const kontextAgg = new Map<string, { summe: number; anzahl: number }>();

  let aktiv = 0;
  for (const s of students) {
    // Flächen-Bilanz und Bewertungen liegen in eigenen Modul-Docs.
    const ausw = s.progressByModule[AUSWERTUNG_MODUL] as unknown as
      | { flaechenGefuellt?: unknown }
      | undefined;
    if (typeof ausw?.flaechenGefuellt === "number") {
      rhizom.flaechen += ausw.flaechenGefuellt;
    }
    const gew = s.progressByModule[GEWICHT_MODUL] as unknown as
      | { werte?: Record<string, unknown> }
      | undefined;
    if (gew?.werte && typeof gew.werte === "object") {
      for (const [k, v] of Object.entries(gew.werte)) {
        if (!k.startsWith(ACHTSAMKEIT_PREFIX) || typeof v !== "number") continue;
        const a = kontextAgg.get(k) ?? { summe: 0, anzahl: 0 };
        a.summe += v;
        a.anzahl += 1;
        kontextAgg.set(k, a);
      }
    }

    const doc = s.progressByModule["lernseite-2-spuren"] as unknown as
      | { ids?: unknown }
      | undefined;
    const ids = Array.isArray(doc?.ids)
      ? (doc!.ids as unknown[]).filter((x): x is string => typeof x === "string")
      : [];
    if (ids.length === 0) continue;
    aktiv += 1;
    for (const id of ids) {
      // Rhizom-Triebe: dieselbe Klassifikation wie clientseitig in spurArt().
      if (id.startsWith("wunsch:")) rhizom.weiter += 1;
      else if (id.startsWith("mehr:")) rhizom.vertiefungen += 1;
      else if (id.startsWith("video:")) rhizom.videos += 1;
      else if (/:hs\d+$/.test(id)) rhizom.bildpunkte += 1;
      else if (!id.includes(":kanten-") && !id.includes(":gewebe")) rhizom.punkte += 1;

      let art: "angeschaut" | "vertieft" | "weiterverfolgen";
      let base = id;
      if (id.startsWith("wunsch:")) {
        art = "weiterverfolgen";
        base = id.slice("wunsch:".length);
      } else if (id.startsWith("mehr:")) {
        art = "vertieft";
        base = id.slice("mehr:".length);
      } else if (id.includes(":kanten-") || id.includes(":gewebe")) {
        continue; // Kanten/Muster sind kein angeschauter Inhalt
      } else {
        art = "angeschaut";
        base = id.replace(/:hs\d+$/, ""); // Bild-Hotspots aufs Bild aggregieren
      }
      const agg = ensure(bereichFuer(base));
      agg[art] += 1;
      agg.schueler.add(s.code);
      const key = `${art} ${base}`;
      const vorhanden = perItem.get(key);
      if (vorhanden) vorhanden.anzahl += 1;
      else perItem.set(key, { art, base, anzahl: 1 });
    }
  }

  // Reihenfolge wie im Lernset; «Weiteres» ans Ende.
  const order = [...new Set(BEREICH_PREFIXE.map((b) => b.bereich)), "Weiteres"];
  /* Abschnitt → Modul: über das Präfix, das den Abschnitt benannt hat. */
  const modulJeBereich = new Map<string, TeacherOrakelBereich["modul"]>();
  for (const b of BEREICH_PREFIXE) {
    if (!modulJeBereich.has(b.bereich)) modulJeBereich.set(b.bereich, modulFuer(b.prefix));
  }
  const bereiche: TeacherOrakelBereich[] = [...perBereich.entries()]
    .map(([bereich, a]) => ({
      bereich,
      modul: modulJeBereich.get(bereich) ?? ("Übergreifend" as const),
      angeschaut: a.angeschaut,
      vertieft: a.vertieft,
      weiterverfolgen: a.weiterverfolgen,
      aktiveSchueler: a.schueler.size,
    }))
    .sort((x, y) => order.indexOf(x.bereich) - order.indexOf(y.bereich));

  // Konkrete Themen mit Titel (aus der gespiegelten Registry), je Signal die
  // häufigsten. Fallback auf die letzten ID-Segmente, falls (noch) kein Titel.
  const titelFuer = (base: string): string =>
    titelMap[base] ?? base.split(":").slice(-2).join(":");
  const themen = (art: Item["art"], limit = 12): TeacherOrakelThema[] =>
    [...perItem.values()]
      .filter((it) => it.art === art)
      .sort((a, b) => b.anzahl - a.anzahl)
      .slice(0, limit)
      .map((it) => ({
        titel: titelFuer(it.base),
        bereich: bereichFuer(it.base),
        anzahl: it.anzahl,
      }));

  /* Achtsamkeits-Aspekte, nach Id sortiert (entspricht der Reihenfolge im
     Lernset). Titel aus derselben Registry wie die Themen. */
  const kontext: TeacherOrakelKontext[] = [...kontextAgg.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "de", { numeric: true }))
    .map(([id, a]) => ({
      id,
      titel: titelFuer(id),
      klasse: a.anzahl ? a.summe / a.anzahl : null,
      anzahl: a.anzahl,
    }));

  return {
    classCode,
    n: students.length,
    aktiv,
    bereiche,
    rhizom,
    kontext,
    topAngeschaut: themen("angeschaut"),
    topVertieft: themen("vertieft"),
    topWeiterverfolgen: themen("weiterverfolgen"),
  };
}
