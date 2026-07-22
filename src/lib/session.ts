"use client";

/**
 * Schueler-Session + Animal-Code fuer ki26 (Vorbild: 10mio `src/lib/session.ts`).
 *
 * Format `ANIMAL-NNN`, z.B. `BÄR-334`. Die Session liegt rein im Browser
 * (localStorage), namespaced pro Lernset (`ki26-session`). Sie haelt nur den
 * `studentCode` und optional den `teacherCode` (Klassencode). Persoenliche
 * Lerndaten bleiben weiterhin in den lokalen Stores (stationStore/fortschritt);
 * der Code dient als Schluessel fuer den Firestore-Fortschritts-Spiegel.
 */

const UNIT_ID = process.env.NEXT_PUBLIC_UNIT_ID ?? "ki26";
const KEY = `${UNIT_ID}-session`;

/** Modell-Pool fuer die Code-Generierung (ASCII-Identifier — bewusst ohne
 *  Umlaute, da Teil einer Doc-ID). LLM-Namen statt Tiere. */
export const MODELS = [
  "CLAUDE", "SONNET", "OPUS", "HAIKU", "GPT", "GEMINI", "GEMMA", "LLAMA",
  "MISTRAL", "QWEN", "DEEPSEEK", "GROK", "PHI", "FALCON", "COMMAND", "MINIMAX",
  "KIMI", "NOVA",
] as const;

/** Buchstaben-Pool fuer das Code-Suffix — GROSSbuchstaben ohne `I`/`O`
 *  (Verwechslung mit 1/0). Gross, damit das ueberall genutzte `toUpperCase()`
 *  beim Wieder-Eingeben den Code nicht veraendert (Firestore-Doc-IDs sind
 *  case-sensitiv). */
const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";

export interface Session {
  studentCode: string;
  teacherCode: string | null;
}

/**
 * Memorierbaren Code erzeugen: `MODELL-NNX` — 2 Ziffern (10..99) + Grossbuchstabe,
 * z.B. `QWEN-34R`. Kein Kollisions-Check (Raum ~ 18 x 90 x 24 = 38 880 — fuer
 * Klassengroessen ausreichend; bei Bedarf Modell-Pool erweitern).
 */
export function generateCode(): string {
  const model = MODELS[Math.floor(Math.random() * MODELS.length)];
  const num = String(Math.floor(Math.random() * 90) + 10);
  const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  return `${model}-${num}${letter}`;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Session>;
    if (!parsed.studentCode) return null;
    return { studentCode: parsed.studentCode, teacherCode: parsed.teacherCode ?? null };
  } catch {
    return null;
  }
}

export function saveSession(s: Session): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore (privater Modus / Quota) */
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Bequemer Lesezugriff auf den aktuellen Code (oder null). */
export function currentStudentCode(): string | null {
  return getSession()?.studentCode ?? null;
}

/** Bequemer Lesezugriff auf den aktuellen Klassencode (oder null). */
export function currentTeacherCode(): string | null {
  return getSession()?.teacherCode ?? null;
}
