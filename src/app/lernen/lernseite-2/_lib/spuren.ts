"use client";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import { seg } from "@/lib/paths";
import { castVote } from "@/lib/polls";
import { generateCode, getSession, saveSession } from "@/lib/session";

/**
 * Spuren — das Wege-Gedächtnis für Lernseite 2, dreifach gesichert:
 *
 * 1. **Lokal (localStorage):** WELCHE Knoten DU besucht hast. Sofort, offline.
 * 2. **Anonym (Firebase-Poll):** pro Besuch ein `+1` auf einen Aggregat-Zähler
 *    (`abstimmungen/ki26/polls/spuren-lernseite-2`) — ohne Namen, fürs «alle»
 *    des Orakel-Dashboards.
 * 3. **Pro Nutzer (Firebase, Pietros Code-Modell):** die vollständige Spur-Liste
 *    unter `abstimmungen/ki26/students/{code}/progress/lernseite-2-spuren`.
 *    Damit bleiben die Knoten **geräteübergreifend** offen: Wer denselben
 *    Animal-Code (via /start) eingibt, bekommt seine Spur zurück.
 *
 * Der Code wird bei der ersten Interaktion im Hintergrund erzeugt
 * (`ensureCode`) und in `session.ts` (Pietros Modul) abgelegt — wir *nutzen*
 * dessen API, ohne es zu verändern. Anonymer Aggregat-Zähler und lokaler
 * Store bleiben die schnelle Quelle; der Cloud-Spiegel ist additiv und
 * no-op ohne Firebase-Config.
 */

const KEY = "ki26-spuren-lernseite-2";
/** Eigenes Event, damit offene Ansichten (Muster, Orakel) live mitzählen. */
export const SPUR_EVENT = "ki26-spur";
/** Poll-Doc für die anonymen Aktivitäts-Zähler (counts[spurId] += 1). */
export const SPUREN_POLL_ID = "spuren-lernseite-2";
/** Modul-Kennung des Pro-Nutzer-Fortschritts-Docs. */
const SPUREN_MODUL = "lernseite-2-spuren";

export interface Spur {
  id: string;
  t: number;
}

function lesen(): Spur[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (s): s is Spur =>
        !!s && typeof (s as Spur).id === "string" && typeof (s as Spur).t === "number",
    );
  } catch {
    return [];
  }
}

function schreiben(spuren: Spur[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(spuren));
  } catch {
    /* localStorage gesperrt (Privatmodus) → bewusst still */
  }
}

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

function spurenDocRef(code: string) {
  const { db } = getFirebase();
  if (!db) return null;
  const s = seg.progressDoc(code, SPUREN_MODUL);
  return doc(db, s[0], ...s.slice(1));
}

/** Debounce fürs Cloud-Spiegeln (nicht bei jedem Knoten einzeln schreiben). */
let mirrorTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleMirror(): void {
  if (mirrorTimer) clearTimeout(mirrorTimer);
  mirrorTimer = setTimeout(() => {
    mirrorTimer = null;
    const code = getSession()?.studentCode;
    if (!code) return;
    const ref = spurenDocRef(code);
    if (!ref) return;
    const ids = lesen().map((s) => s.id);
    void setDoc(ref, { ids, updatedAt: serverTimestamp() }, { merge: true }).catch(
      (err) => console.warn("[spuren] mirror failed", err),
    );
  }, 1500);
}

/** Eine Spur setzen (idempotent). Lokal + anonymer Zähler + Cloud-Spiegel. */
export function merkeSpur(id: string): void {
  if (typeof window === "undefined" || !id) return;
  const spuren = lesen();
  if (spuren.some((s) => s.id === id)) return;
  spuren.push({ id, t: Date.now() });
  schreiben(spuren);
  window.dispatchEvent(new CustomEvent(SPUR_EVENT, { detail: { id } }));
  // Anonymer Aggregat-Zähler fürs «alle».
  void castVote(SPUREN_POLL_ID, id);
  // Pro-Nutzer-Spiegel (erzeugt bei Bedarf einen Hintergrund-Code).
  ensureCode();
  scheduleMirror();
}

/** Alle Spuren lesen (nur lokal). */
export function leseSpuren(): Spur[] {
  return lesen();
}

/** Anzahl Spuren mit einem Präfix, z.B. "kulturelle-perspektive:weisheit". */
export function zaehleSpuren(prefix: string): number {
  return lesen().filter((s) => s.id.startsWith(prefix)).length;
}

/**
 * Numerische Indizes der besuchten Knoten eines Musters, z.B. für spurKey
 * "vorhang-auf:weisheit" → [0, 3, 5]. Erlaubt Komponenten, ihren Zustand
 * beim Laden wiederherzustellen (Knoten bleiben offen).
 */
export function leseSpurenIndices(spurKey: string): number[] {
  const prefix = `${spurKey}:`;
  const out: number[] = [];
  for (const s of lesen()) {
    if (s.id.startsWith(prefix)) {
      const n = Number(s.id.slice(prefix.length));
      if (Number.isInteger(n)) out.push(n);
    }
  }
  return out;
}

/**
 * Cloud → lokal: die Pro-Nutzer-Spur aus Firestore holen und mit dem lokalen
 * Bestand vereinen (Union, nie löschen). Feuert danach SPUR_EVENT, damit
 * offene Ansichten sich neu aufbauen. No-op ohne Code/Config. Idempotent.
 */
export async function zieheSpurenAusCloud(): Promise<void> {
  if (typeof window === "undefined") return;
  const code = getSession()?.studentCode;
  if (!code) return; // kein Code → nichts wiederherzustellen
  const ref = spurenDocRef(code);
  if (!ref) return;
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const remote = snap.data()?.ids;
    if (!Array.isArray(remote) || remote.length === 0) return;
    const spuren = lesen();
    const bekannt = new Set(spuren.map((s) => s.id));
    let neu = false;
    for (const id of remote) {
      if (typeof id === "string" && !bekannt.has(id)) {
        spuren.push({ id, t: Date.now() });
        bekannt.add(id);
        neu = true;
      }
    }
    if (neu) {
      schreiben(spuren);
      window.dispatchEvent(new CustomEvent(SPUR_EVENT, { detail: { cloud: true } }));
    }
  } catch (err) {
    console.warn("[spuren] cloud pull failed", err);
  }
}

/** Aktueller Nutzer-Code (oder null) — für die Anzeige «Dein Code». */
export function aktuellerCode(): string | null {
  return getSession()?.studentCode ?? null;
}
