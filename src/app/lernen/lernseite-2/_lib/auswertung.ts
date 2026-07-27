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
 * `leseAuswertung()` und lauscht auf `AUSWERTUNG_EVENT`. Rein lokal
 * (localStorage), wie `spuren`/`gewichtung`. Kein Cloud-Spiegel.
 */

import { doc, serverTimestamp, setDoc } from "firebase/firestore";
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
 * Debounce fürs Cloud-Spiegeln. Gespiegelt wird nur die **Bilanz** (wie viele
 * Flächen von wie vielen), nicht die gewählten Titel: Die stehen schon in der
 * Inhalts-Registry, und das Klassen-Rhizom braucht bloss die Zahl. Ohne diesen
 * Spiegel fehlte der Lehrpersonen-Ansicht der Trieb «Flächen», den die
 * Lernenden in ihrem eigenen Rhizom sehen.
 */
let mirrorTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleMirror(): void {
  if (mirrorTimer) clearTimeout(mirrorTimer);
  mirrorTimer = setTimeout(() => {
    mirrorTimer = null;
    const code = getSession()?.studentCode;
    if (!code) return;
    const ref = auswertungDocRef(code);
    if (!ref) return;
    const { gefuellt, total } = zaehleFlaechen();
    void setDoc(
      ref,
      { flaechenGefuellt: gefuellt, flaechenTotal: total, updatedAt: serverTimestamp() },
      { merge: true },
    ).catch((err) => console.warn("[auswertung] mirror failed", err));
  }, 1500);
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
 * Teil-Strings enthält («Seite von vorne beginnen»). Rein lokal (kein
 * Cloud-Spiegel). Der anonyme Flächen-Zähler und sein Register bleiben
 * unberührt, damit erneutes Weben die Kollektiv-Werte nicht aufbläht.
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
