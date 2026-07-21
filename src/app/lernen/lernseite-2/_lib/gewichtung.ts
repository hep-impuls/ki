"use client";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import { seg } from "@/lib/paths";
import { generateCode, getSession, saveSession } from "@/lib/session";

/**
 * Gewichtung — mutierbare Bewertungen pro Punkt (anders als die append-only
 * Spuren). Die Lernenden gewichten einzelne Beschreibungen:
 *
 * - **Merkmale → Gestalt** (Präfix `vorhang-auf:gestalt`): Wie deutlich macht
 *   dieses Merkmal die Gestalt der KI? Stufe 0 = unkenntlich, 1 = verschwommen,
 *   2 = deutlich. Mehr «deutlich» → das Geflecht bekommt stärkere Konturen.
 * - **Kontext → Achtsamkeit** (Präfix `vorhang-auf:achtsamkeit`): Wie viel
 *   Achtsamkeit verdient dieser Aspekt? 0 = wenig, 1 = mittel, 2 = viel.
 *   Mehr Achtsamkeit → das Kontext-Muster wird farbiger, rötlicher.
 *
 * Persistenz (wie `spuren.ts`): lokal (localStorage, sofort/offline) UND als
 * Pro-Nutzer-Cloud-Spiegel unter
 * `abstimmungen/ki26/students/{code}/progress/lernseite-2-gewichtung`. Wer
 * denselben Animal-Code eingibt, bekommt seine Bewertungen geräte- und
 * browserübergreifend zurück. Eigenes Event, damit die Muster live reagieren.
 */

const KEY = "ki26-gewichtung-lernseite-2";
export const GEWICHT_EVENT = "ki26-gewichtung";
/** Modul-Kennung des Pro-Nutzer-Fortschritts-Docs. */
const GEWICHT_MODUL = "lernseite-2-gewichtung";

function lesen(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    const o = raw ? (JSON.parse(raw) as unknown) : {};
    if (!o || typeof o !== "object" || Array.isArray(o)) return {};
    return o as Record<string, number>;
  } catch {
    return {};
  }
}

function schreiben(o: Record<string, number>): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(o));
  } catch {
    /* localStorage gesperrt (Privatmodus) → bewusst still */
  }
}

/* ── Cloud-Spiegel (analog spuren.ts) ─────────────────────────────────────── */

/** Nutzer-Code sicherstellen (Pietros Session). Legt bei Bedarf im Hintergrund
 *  einen an, ohne bestehende Sessions zu überschreiben. */
function ensureCode(): string | null {
  if (typeof window === "undefined") return null;
  const vorhanden = getSession();
  if (vorhanden?.studentCode) return vorhanden.studentCode;
  const studentCode = generateCode();
  saveSession({ studentCode, teacherCode: vorhanden?.teacherCode ?? null });
  return studentCode;
}

function gewichtDocRef(code: string) {
  const { db } = getFirebase();
  if (!db) return null;
  const s = seg.progressDoc(code, GEWICHT_MODUL);
  return doc(db, s[0], ...s.slice(1));
}

/** Debounce fürs Cloud-Spiegeln (nicht bei jedem Klick einzeln schreiben). */
let mirrorTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleMirror(): void {
  if (mirrorTimer) clearTimeout(mirrorTimer);
  mirrorTimer = setTimeout(() => {
    mirrorTimer = null;
    const code = getSession()?.studentCode;
    if (!code) return;
    const ref = gewichtDocRef(code);
    if (!ref) return;
    void setDoc(ref, { werte: lesen(), updatedAt: serverTimestamp() }, { merge: true }).catch(
      (err) => console.warn("[gewichtung] mirror failed", err),
    );
  }, 1500);
}

/**
 * Cloud → lokal: die Pro-Nutzer-Bewertungen aus Firestore holen und mit dem
 * lokalen Bestand vereinen (lokale Werte gewinnen bei Konflikt — sie sind die
 * zuletzt auf diesem Gerät gesetzten). Feuert GEWICHT_EVENT, damit offene
 * Ansichten sich neu aufbauen. No-op ohne Code/Config. Idempotent.
 */
export async function zieheGewichtungAusCloud(): Promise<void> {
  if (typeof window === "undefined") return;
  const code = getSession()?.studentCode;
  if (!code) return;
  const ref = gewichtDocRef(code);
  if (!ref) return;
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const remote = snap.data()?.werte;
    if (!remote || typeof remote !== "object" || Array.isArray(remote)) return;
    const lokal = lesen();
    const zusammen: Record<string, number> = { ...(remote as Record<string, number>), ...lokal };
    // Nur schreiben/feuern, wenn sich wirklich etwas ergänzt hat.
    if (JSON.stringify(zusammen) !== JSON.stringify(lokal)) {
      schreiben(zusammen);
      window.dispatchEvent(
        new CustomEvent(GEWICHT_EVENT, { detail: { cloud: true } }),
      );
    }
  } catch (err) {
    console.warn("[gewichtung] cloud pull failed", err);
  }
}

/** Alle Gewichtungen eines Präfixes als {index: stufe}. */
export function leseGewichtungen(prefix: string): Record<number, number> {
  const o = lesen();
  const p = `${prefix}:`;
  const out: Record<number, number> = {};
  for (const k in o) {
    if (k.startsWith(p)) {
      const i = Number(k.slice(p.length));
      if (Number.isInteger(i)) out[i] = o[k];
    }
  }
  return out;
}

/** Eine Gewichtung setzen (oder mit stufe=null löschen). Feuert GEWICHT_EVENT. */
export function setzeGewichtung(prefix: string, index: number, stufe: number | null): void {
  if (typeof window === "undefined") return;
  const o = lesen();
  const key = `${prefix}:${index}`;
  if (stufe === null) delete o[key];
  else o[key] = stufe;
  schreiben(o);
  window.dispatchEvent(
    new CustomEvent(GEWICHT_EVENT, { detail: { prefix, index, stufe } }),
  );
  // Pro-Nutzer-Spiegel (erzeugt bei Bedarf einen Hintergrund-Code).
  ensureCode();
  scheduleMirror();
}

/**
 * Aggregierte Stärke 0..1 eines Präfixes: Summe der Stufen / (Anzahl × 2).
 * Nicht bewertete Punkte zählen als 0 — die Wirkung wächst, je mehr hoch
 * gewichtet wird.
 */
export function gewichtungsStaerke(prefix: string, anzahl: number): number {
  if (anzahl <= 0) return 0;
  const m = leseGewichtungen(prefix);
  let summe = 0;
  for (const i in m) summe += Math.max(0, Math.min(2, m[i]));
  return Math.max(0, Math.min(1, summe / (anzahl * 2)));
}
