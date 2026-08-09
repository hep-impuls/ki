"use client";

/**
 * Auswertung — kleiner lokaler Melde-Store, mit dem die interaktiven Flächen-/
 * Weben-Komponenten (Teppich des Wandels, KI-Story) dem Orakel-Dashboard ihre
 * Bilanz mitteilen, OHNE dass das Orakel deren Inhaltsdaten kennen muss:
 *
 *  - wie viele Flächen (Maschen) geknüpft sind vs. wie viele möglich wären,
 *  - welche Inhalte (Titel) ausgewählt wurden — für die analytische
 *    Interessens-Rückmeldung.
 *
 * Die Komponenten rufen `melde(...)` bei jeder Änderung; das Orakel liest per
 * `leseAuswertung()` und lauscht auf `AUSWERTUNG_EVENT`.
 *
 * SPIEGEL (seit 2026-08-09 vollständig). Vorher ging nur die Flächen-BILANZ in
 * die Cloud, für den Trieb «Flächen» in der Lehrpersonen-Ansicht, und
 * zurückgeholt wurde nichts. Die Einträge selbst, also auch die Titel der
 * gewählten Inhalte, lebten allein in diesem Browser.
 *
 * Das hatte eine Folge, die nicht wie ein Fehler aussah: Der Abschnitt «Was dich
 * besonders interessiert hat» im Orakel wird nur gerendert, wenn hier Einträge
 * liegen, und in ihm steckt die erste Orakel-Stimme. Auf einem zweiten Gerät
 * kamen die besuchten Punkte und die Bewertungen brav zurück, dieser Abschnitt
 * aber fehlte samt seiner Stimme. Keine Meldung, nur eine leere Stelle.
 *
 * Jetzt geht der ganze Store mit und `zieheAuswertungAusCloud()` holt ihn zurück.
 */

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import { getSession } from "@/lib/session";
import { seg } from "@/lib/paths";
import { castVote } from "@/lib/polls";
import { zaehltAnonym } from "./spuren";

const KEY = "ki26-auswertung-lernseite-2";
export const AUSWERTUNG_EVENT = "ki26-auswertung";
/** Anonymer Aggregat-Zähler: wie viele Flächen (Maschen) alle zusammen je
 *  geknüpft haben — pro Bereich als Option. Fürs «alle» im Aktivitätsnetz. */
export const FLAECHEN_POLL_ID = "flaechen-lernseite-2";
/** Register (max je Bereich je gezählt), damit ein «Muster zurücksetzen» und
 *  erneutes Weben den anonymen Zähler nicht aufbläht. */
const KEY_FLAECHEN_GEZAEHLT = "ki26-flaechen-gezaehlt";
/** Modul-Doc für den Pro-Nutzer-Spiegel (wie `spuren`/`gewichtung`). */
const AUSWERTUNG_MODUL = "lernseite-2-auswertung";

function auswertungDocRef(code: string) {
  const { db } = getFirebase();
  if (!db) return null;
  const s = seg.progressDoc(code, AUSWERTUNG_MODUL);
  return doc(db, s[0], ...s.slice(1));
}

/**
 * Cloud-Spiegel schreiben.
 *
 * Zwei Felder mit verschiedenen Aufgaben:
 *
 *  - `flaechenGefuellt` / `flaechenTotal` — die Bilanz, die die
 *    Lehrpersonen-Ansicht serverseitig liest (Trieb «Flächen» im Klassen-Rhizom).
 *    Namen und Form bleiben unverändert, sonst bricht `teacherStore.ts`.
 *  - `bereicheJson` — der ganze Store, damit er auf einem zweiten Gerät
 *    zurückkommt.
 *
 * Warum der Store als JSON-ZEICHENKETTE und nicht als Firestore-Map: `setDoc`
 * mit `merge: true` vereinigt verschachtelte Maps Schlüssel für Schlüssel. Ein
 * Eintrag, den «Seite von vorne beginnen» lokal löscht, bliebe in der Cloud
 * stehen und käme beim nächsten Herunterholen zurück. Eine Zeichenkette wird
 * ganz ersetzt, damit wirkt ein Löschen auch dort. Die Inhalts-Registry
 * (`inhalte.ts`) darf eine Map sein, weil aus ihr nie etwas verschwindet.
 */
function spiegeln(): void {
  const code = getSession()?.studentCode;
  if (!code) return;
  const ref = auswertungDocRef(code);
  if (!ref) return;
  const { gefuellt, total } = zaehleFlaechen();
  void setDoc(
    ref,
    {
      flaechenGefuellt: gefuellt,
      flaechenTotal: total,
      bereicheJson: JSON.stringify(lesen()),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  ).catch((err) => console.warn("[auswertung] mirror failed", err));
}

/** Debounce fürs Spiegeln, damit nicht jede Masche einzeln schreibt. */
let mirrorTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleMirror(): void {
  if (mirrorTimer) clearTimeout(mirrorTimer);
  mirrorTimer = setTimeout(() => {
    mirrorTimer = null;
    spiegeln();
  }, 1500);
}

/**
 * Cloud → lokal: den gespiegelten Store zurückholen, lokale Einträge gewinnen.
 *
 * Lokal gewinnt, weil ein lokaler Eintrag von einer Komponente stammt, die in
 * diesem Browser gerade gerendert hat, und damit aktueller ist als der Spiegel.
 * Fehlt ein Bereich lokal, kommt er aus der Cloud, und genau das füllt den
 * Abschnitt «Was dich besonders interessiert hat» auf einem zweiten Gerät.
 *
 * Feuert `AUSWERTUNG_EVENT`, damit offene Ansichten nachziehen. No-op ohne Code
 * oder Firebase-Konfiguration. Idempotent.
 */
export async function zieheAuswertungAusCloud(): Promise<void> {
  if (typeof window === "undefined") return;
  const code = getSession()?.studentCode;
  if (!code) return;
  const ref = auswertungDocRef(code);
  if (!ref) return;
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const roh = snap.data()?.bereicheJson;
    if (typeof roh !== "string" || roh.length === 0) return;
    const remote = JSON.parse(roh) as unknown;
    if (!remote || typeof remote !== "object" || Array.isArray(remote)) return;
    const lokal = lesen();
    const zusammen: Store = { ...(remote as Store), ...lokal };
    if (JSON.stringify(zusammen) === JSON.stringify(lokal)) return;
    schreiben(zusammen);
    window.dispatchEvent(new CustomEvent(AUSWERTUNG_EVENT, { detail: { cloud: true } }));
  } catch (err) {
    console.warn("[auswertung] cloud pull failed", err);
  }
}

/**
 * Neu hinzugekommene Flächen eines Bereichs anonym zählen: nur den Zuwachs
 * über den bisher je gezählten Höchststand hinaus (idempotent pro Browser).
 */
function zaehleFlaechenAnonym(key: string, gefuellt: number): void {
  if (typeof window === "undefined" || !zaehltAnonym()) return;
  try {
    const raw = window.localStorage.getItem(KEY_FLAECHEN_GEZAEHLT);
    const reg = raw ? (JSON.parse(raw) as Record<string, number>) : {};
    const prev = typeof reg[key] === "number" ? reg[key] : 0;
    if (gefuellt <= prev) return;
    const zuwachs = gefuellt - prev;
    for (let k = 0; k < zuwachs; k++) void castVote(FLAECHEN_POLL_ID, key);
    reg[key] = gefuellt;
    window.localStorage.setItem(KEY_FLAECHEN_GEZAEHLT, JSON.stringify(reg));
  } catch {
    /* Privatmodus → still */
  }
}

export interface AuswertungEintrag {
  /** Anzeigename des Bereichs, z.B. "Die KI-Story". */
  bereich: string;
  /** Geknüpfte Flächen (Maschen mit allen drei Ecken besucht). */
  flaechenGefuellt: number;
  /** Maximal mögliche Flächen in diesem Bereich. */
  flaechenTotal: number;
  /** Titel der ausgewählten Inhalte (für die Interessens-Analyse). */
  labels: string[];
}

type Store = Record<string, AuswertungEintrag>;

function lesen(): Store {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    const o = raw ? (JSON.parse(raw) as unknown) : {};
    if (!o || typeof o !== "object" || Array.isArray(o)) return {};
    return o as Store;
  } catch {
    return {};
  }
}

function schreiben(o: Store): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(o));
  } catch {
    /* Privatmodus → still */
  }
}

/** Bilanz eines Bereichs melden (idempotent überschreibend). Feuert Event nur
 *  bei tatsächlicher Änderung, um Render-Schleifen zu vermeiden. */
export function melde(key: string, eintrag: AuswertungEintrag): void {
  if (typeof window === "undefined" || !key) return;
  const o = lesen();
  const alt = o[key];
  if (
    alt &&
    alt.bereich === eintrag.bereich &&
    alt.flaechenGefuellt === eintrag.flaechenGefuellt &&
    alt.flaechenTotal === eintrag.flaechenTotal &&
    alt.labels.length === eintrag.labels.length &&
    alt.labels.every((l, i) => l === eintrag.labels[i])
  ) {
    return; // unverändert
  }
  o[key] = eintrag;
  schreiben(o);
  // Zuwachs an Flächen anonym mitzählen (fürs «alle» im Aktivitätsnetz).
  zaehleFlaechenAnonym(key, eintrag.flaechenGefuellt);
  scheduleMirror();
  window.dispatchEvent(new CustomEvent(AUSWERTUNG_EVENT, { detail: { key } }));
}

/**
 * Auswertungs-Bilanzen löschen, deren Schlüssel (Spur-Präfix) einen der
 * Teil-Strings enthält («Seite von vorne beginnen»). Der anonyme Flächen-Zähler
 * und sein Register bleiben unberührt, damit erneutes Weben die Kollektiv-Werte
 * nicht aufbläht.
 *
 * Das Löschen geht SOFORT in die Cloud, nicht über den Debounce. Sonst hätte der
 * Spiegel dem Zurücksetzen widersprochen: das nächste `zieheAuswertungAusCloud`
 * hätte die gelöschten Bereiche wieder hereingeholt, und ein Zurücksetzen, das
 * sich selbst rückgängig macht, ist schlimmer als keines. Ein Spiegel muss beide
 * Richtungen kennen, auch die des Verschwindens.
 */
export function loescheAuswertungEnthaltend(teile: string[]): void {
  if (typeof window === "undefined" || teile.length === 0) return;
  const o = lesen();
  let geaendert = false;
  for (const k of Object.keys(o)) {
    if (teile.some((t) => k.includes(t))) {
      delete o[k];
      geaendert = true;
    }
  }
  if (!geaendert) return;
  schreiben(o);
  if (mirrorTimer) {
    clearTimeout(mirrorTimer);
    mirrorTimer = null;
  }
  spiegeln();
  window.dispatchEvent(new CustomEvent(AUSWERTUNG_EVENT, { detail: { neustart: true } }));
}

/** Alle gemeldeten Bereiche lesen. */
export function leseAuswertung(): AuswertungEintrag[] {
  return Object.values(lesen());
}

/** Wie leseAuswertung, aber mit dem Melde-Schlüssel (z.B. Spur-Präfix). */
export function leseAuswertungMap(): Record<string, AuswertungEintrag> {
  return lesen();
}

/** Geknüpfte Flächen über alle Bereiche — fürs Aktivitätsnetz/Orakel. */
export function zaehleFlaechen(): { gefuellt: number; total: number } {
  return leseAuswertung().reduce(
    (acc, a) => ({
      gefuellt: acc.gefuellt + a.flaechenGefuellt,
      total: acc.total + a.flaechenTotal,
    }),
    { gefuellt: 0, total: 0 },
  );
}
