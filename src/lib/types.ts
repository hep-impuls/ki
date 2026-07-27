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

/* ── Klassen-Orakel (ki26 Lernseite 2: Spuren pro Abschnitt) ─────────────────── */

/** Aktivitaet einer Klasse in einem Abschnitt (aus den Spuren aggregiert). */
export interface TeacherOrakelBereich {
  bereich: string;
  /** Zu welchem Modul der Abschnitt gehört (fürs getrennte Ausweisen). */
  modul: "Vorhang auf" | "Philosophische Perspektive" | "Übergreifend";
  /** Angeschaute Punkte/Inhalte (Summe ueber alle Schueler:innen). */
  angeschaut: number;
  /** «Mehr lesen»-Vertiefungen. */
  vertieft: number;
  /** «Das verfolge ich weiter»-Merkzeichen. */
  weiterverfolgen: number;
  /** Wie viele Schueler:innen in diesem Abschnitt aktiv waren. */
  aktiveSchueler: number;
}

/** Ein konkretes Thema (mit Klartext-Titel) im Klassen-Orakel. */
export interface TeacherOrakelThema {
  /** Klartext-Titel (aus der gespiegelten Registry) oder Fallback. */
  titel: string;
  /** Abschnitt, zu dem das Thema gehört. */
  bereich: string;
  /** Wie oft in der Klasse (Summe über alle Schueler:innen). */
  anzahl: number;
}

/**
 * Die sechs Triebe des Aktivitäts-Rhizoms, aufsummiert über die Klasse.
 * Gleiche Grössen wie im Rhizom der Lernenden, damit die Grafik im
 * Lehrpersonen-Report dieselbe ist, nur mit Klassenzahlen.
 */
export interface TeacherOrakelRhizom {
  punkte: number;
  flaechen: number;
  bildpunkte: number;
  videos: number;
  vertiefungen: number;
  weiter: number;
}

/** Ein Aspekt der Achtsamkeits-Gewichtung im Vergleich Klasse gegen alle. */
export interface TeacherOrakelKontext {
  /** Spur-/Gewichtungs-Id, z.B. "vorhang-auf:achtsamkeit:3". */
  id: string;
  /** Klartext-Titel aus der gespiegelten Registry, sonst die Id. */
  titel: string;
  /** Durchschnitt der Klasse, 0..2, oder null wenn niemand bewertet hat. */
  klasse: number | null;
  /** Wie viele aus der Klasse diesen Aspekt bewertet haben. */
  anzahl: number;
}

/** Klassen-Orakel: wo die Klasse in Lernseite 2 unterwegs ist. */
export interface TeacherOrakel {
  classCode: string;
  /** Schueler:innen in der Klasse. */
  n: number;
  /** davon mit mindestens einer Spur. */
  aktiv: number;
  bereiche: TeacherOrakelBereich[];
  /** Die sechs Triebe, aufsummiert über die Klasse. */
  rhizom: TeacherOrakelRhizom;
  /** Achtsamkeits-Gewichtung der Klasse je Aspekt (für den Kontext-Kreis). */
  kontext: TeacherOrakelKontext[];
  /** Konkrete Themen (Titel), nach Häufigkeit — je Signal die stärksten. */
  topAngeschaut: TeacherOrakelThema[];
  topVertieft: TeacherOrakelThema[];
  topWeiterverfolgen: TeacherOrakelThema[];
}
