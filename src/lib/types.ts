/**
 * Geteilte TypeScript-Interfaces fuer den ki26-Schueler-/Lehrer-Tier
 * (Vorbild: 10mio `src/lib/types.ts`). Isomorph — keine Runtime-Importe.
 */

/* ── Schueler ─────────────────────────────────────────────────────────────── */

export interface Student {
  teacherCode: string | null;
  createdAt?: unknown; // serverTimestamp() (client) bzw. Timestamp (admin)
}

/** Ein einzelner interaktiver Block innerhalb eines Moduls. */
export interface ProgressBlock {
  /** "mc" | "tf" | "poll" | "slider" | "swipe" | "reflexion" | "station" | ... */
  type: string;
  /** Gewaehlte Antwort/Bucket (Index, Bool, String oder Wert). */
  answer?: unknown;
  completed?: boolean;
  /** Optionaler Punktwert (z.B. Quiz). */
  punkte?: number;
  max?: number;
}

/** Pro-Modul-Fortschritt (ein Firestore-Doc je moduleId). */
export interface Progress {
  pct?: number;
  quizScore?: number;
  correctnessPct?: number;
  interactionPct?: number;
  completedAt?: string | null;
  updatedAt?: unknown;
  blocks?: Record<string, ProgressBlock>;
}

/* ── Lehrer ───────────────────────────────────────────────────────────────── */

export interface TeacherPrefs {
  requiredModules: string[];
  updatedAt: string;
  /** SHA-256(secret.trim()) — Klartext wird nie gespeichert. */
  secretHash?: string;
}

/* ── Report-Typen ─────────────────────────────────────────────────────────── */

/** Eine Zeile in der Lehrer-Einzel-Schueler-Tabelle. */
export interface TeacherReportStudent {
  /** Nur bei korrektem Secret befuellt (sonst anonymisiert). */
  code?: string;
  /** pct je moduleId. */
  modulePct: Record<string, number>;
  /** Summe Quiz-Punkte ueber alle Module. */
  quizPunkte: number;
  quizMax: number;
  lastActive?: string | null;
}

/** Poll-Aggregat: Klasse vs. alle, pro Option. */
export interface PollAggregate {
  pollId: string;
  /** counts[optionId] — nur die Klasse (aus den progress.blocks gezaehlt). */
  klasse: Record<string, number>;
  /** counts[optionId] — global (aus polls/{pollId}.counts). */
  alle: Record<string, number>;
}

export interface TeacherReport {
  classCode: string;
  n: number;
  students: TeacherReportStudent[];
  polls: PollAggregate[];
  /** true, wenn das Secret korrekt war → Codes sind sichtbar. */
  revealCodes: boolean;
}

/** Anonymes Klassen-Aggregat fuer die Schueler-Ansicht (/klassenreport). */
export interface StudentClassReport {
  classCode: string;
  n: number;
  /** eigenes pct je Modul (vom Aufrufer). */
  you: Record<string, number>;
  /** Klassen-Durchschnitt je Modul. */
  classAvg: Record<string, number>;
  /** sortierte pct-Verteilung (ohne Codes) fuer das Histogramm. */
  distribution: number[];
}
