"use client";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import { seg, UNIT_ID } from "@/lib/paths";
import { getSession } from "@/lib/session";

/**
 * Inhalte — kleine ID→Titel-Registry für Lernseite 2. Die Spuren/Poll-Zähler
 * kennen nur strukturelle IDs (z.B. `vorhang-auf:story:5`); für lesbare Labels
 * (Sternenkarte im Orakel) braucht es die Klartext-Titel.
 *
 * Single Source: die Inhalts-Komponenten registrieren beim Rendern ihren Titel
 * über `merkeInhalt(basisId, titel)` (via KartenAktion). So bleibt der Titel
 * dort, wo der Inhalt definiert ist — keine Zweit-Tabelle, die driften könnte.
 * Lokal (localStorage); die Registry ist vollständig, sobald man die jeweilige
 * Seite einmal geöffnet hat (alle Karten rendern, nicht nur besuchte).
 *
 * Zusätzlich wird die Registry pro Nutzer:in nach Firestore gespiegelt
 * (`students/{code}/progress/lernseite-2-inhalte` → `{ titel }`), damit das
 * Klassen-Orakel der Lehrperson die IDs serverseitig in Klartext-Titel auflösen
 * kann. Titel sind reine Inhalts-Metadaten (für alle gleich, nichts Persönliches).
 *
 * `basisId` = Inhalts-ID OHNE `wunsch:`/`mehr:`-Präfix, z.B.
 * `philosophische-perspektive:teppich:3`.
 */

const KEY = "ki26-inhalte-lernseite-2";
/** Modul-Kennung des Pro-Nutzer-Titel-Docs (gespiegelte Registry). */
const INHALTE_MODUL = "lernseite-2-inhalte";
/**
 * Gemeinsames Titel-Verzeichnis, ein Dokument für alle.
 *
 * WARUM ES DAS BRAUCHT, obwohl es den Pro-Nutzer-Spiegel schon gibt: Der
 * Spiegel enthält nur, was DIESE Person je gerendert hat. Die Knotenkarte zeigt
 * aber die Zähler ALLER, und für einen Punkt aus einem Bereich, den man selbst
 * nie geöffnet hat, blieb der Titel darum unbekannt. Gemessen am 2026-08-17:
 * 192 Titel im Browser, davon kein einziger aus «Vorhang auf», und genau dort
 * standen in der Knotenkarte «Punkt 7» statt der Bildtitel (Christofs Meldung,
 * die zweite zu diesem Thema nach dem 2026-08-08).
 *
 * Titel sind reine Inhalts-Metadaten, für alle gleich und nichts Persönliches,
 * darum dürfen sie in einem gemeinsamen Dokument liegen. Der Pfad ist der eines
 * Polls, weil die live deployten Rules genau dort read/write erlauben; aus ki26
 * wird nie ein Rules-Deploy gefahren.
 */
const TITEL_VERZEICHNIS = "titel-lernseite-2";

function verzeichnisRef() {
  const { db } = getFirebase();
  if (!db) return null; // SSR oder fehlende Config → No-op
  return doc(db, "abstimmungen", UNIT_ID, "polls", TITEL_VERZEICHNIS);
}

/**
 * Fremde Titel-Daten säubern, bevor sie in die eigene Registry wandern.
 *
 * Das Verzeichnis ist wie die Poll-Zähler für alle beschreibbar. Es wird nur
 * angezeigt und nie ausgeführt, trotzdem übernimmt diese Funktion ausschliesslich
 * nicht-leere Zeichenketten vernünftiger Länge, damit ein verunglückter oder
 * absichtlich aufgeblähter Eintrag die Anzeige nicht sprengt.
 */
function saubere(rohdaten: unknown): Record<string, string> {
  if (!rohdaten || typeof rohdaten !== "object" || Array.isArray(rohdaten)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(rohdaten as Record<string, unknown>)) {
    if (typeof v === "string" && v.length > 0 && v.length <= 200) out[k] = v;
  }
  return out;
}
/** Meldung, wenn Titel dazugekommen sind (Gegenstück zu SPUR_EVENT). */
export const INHALTE_EVENT = "ki26-inhalte";

function lesen(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    const o = raw ? (JSON.parse(raw) as unknown) : {};
    if (!o || typeof o !== "object" || Array.isArray(o)) return {};
    return o as Record<string, string>;
  } catch {
    return {};
  }
}

function schreiben(o: Record<string, string>): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(o));
  } catch {
    /* Privatmodus → still */
  }
}

/** Debounce fürs Cloud-Spiegeln der Titel-Registry (nicht bei jedem Titel
 *  einzeln schreiben). No-op ohne Code/Config. */
let mirrorTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleMirror(): void {
  if (mirrorTimer) clearTimeout(mirrorTimer);
  mirrorTimer = setTimeout(() => {
    mirrorTimer = null;
    const code = getSession()?.studentCode;
    if (!code) return;
    const { db } = getFirebase();
    if (!db) return;
    const s = seg.progressDoc(code, INHALTE_MODUL);
    const ref = doc(db, s[0], ...s.slice(1));
    void setDoc(
      ref,
      { titel: lesen(), updatedAt: serverTimestamp() },
      { merge: true },
    ).catch((err) => console.warn("[inhalte] mirror failed", err));
  }, 1500);
}

/**
 * Fehlende oder abweichende lokale Titel ins gemeinsame Verzeichnis schieben
 * (debounced, liest zuerst und schreibt nur das Delta). Anders als die
 * anonymen Zähler läuft das AUCH aus der Entwicklung: Ein Dev-Render schiebt
 * dieselben korrekten Titel wie die Produktion, das füllt das Verzeichnis,
 * statt es zu verfälschen.
 */
let verzeichnisTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleVerzeichnisPush(): void {
  if (verzeichnisTimer) clearTimeout(verzeichnisTimer);
  verzeichnisTimer = setTimeout(() => {
    verzeichnisTimer = null;
    const ref = verzeichnisRef();
    if (!ref) return;
    void (async () => {
      try {
        const snap = await getDoc(ref);
        const fern = saubere(snap.exists() ? snap.data()?.titel : {});
        const lokal = lesen();
        const delta: Record<string, string> = {};
        for (const [k, v] of Object.entries(lokal)) {
          if (fern[k] !== v) delta[k] = v;
        }
        if (Object.keys(delta).length === 0) return;
        /* setDoc mit merge vereinigt verschachtelte Maps schlüsselweise, es
           gehen also nur die Delta-Schlüssel über die Leitung und parallele
           Schreiberinnen löschen einander nichts. Feldpfad-Syntax (updateDoc
           mit Punktnotation) ginge hier nicht, die Schlüssel enthalten
           Doppelpunkte. */
        await setDoc(ref, { titel: delta, updatedAt: serverTimestamp() }, { merge: true });
      } catch (err) {
        console.warn("[inhalte] verzeichnis push failed", err);
      }
    })();
  }, 4000);
}

/** Einen Inhalts-Titel registrieren (idempotent, schreibt nur bei Änderung). */
export function merkeInhalt(basisId: string, titel: string): void {
  if (typeof window === "undefined" || !basisId || !titel) return;
  const o = lesen();
  if (o[basisId] === titel) return;
  o[basisId] = titel;
  schreiben(o);
  scheduleMirror();
  scheduleVerzeichnisPush();
}

/**
 * Cloud → lokal: die gespiegelte Titel-Registry zurückholen und mit dem lokalen
 * Bestand vereinen (lokale Titel gewinnen — sie kommen aus dem gerade
 * gerenderten Code und sind damit die aktuellen).
 *
 * WARUM ES DAS BRAUCHT. Die Registry wird PRO BROWSER gefüllt, und zwar nur von
 * Komponenten, die dort gerendert haben. Das Orakel rendert die Inhalte der
 * anderen Seiten nicht. Auf einem zweiten Gerät kamen darum die Punkte zurück
 * (`zieheSpurenAusCloud`) und die Bewertungen (`zieheGewichtungAusCloud`), die
 * NAMEN aber nicht — die Knotenkarte zeigte «Epochen · Punkt 4.0» statt des
 * Titels. Das Spiegeln gab es schon, nur das Zurückholen fehlte. Christof hat
 * das am 2026-08-08 als «bei manchen Browsern fehlen die Titel» gemeldet.
 *
 * Feuert INHALTE_EVENT, damit offene Ansichten sich neu beschriften. No-op ohne
 * Code/Config. Idempotent.
 */
export async function zieheInhalteAusCloud(): Promise<void> {
  if (typeof window === "undefined") return;
  const lokal = lesen();
  const zusammen: Record<string, string> = { ...lokal };

  /* 1) Gemeinsames Verzeichnis — deckt Bereiche ab, die DIESE Person nie
     gerendert hat (Christofs «Punkt 7» in der Knotenkarte, 2026-08-17). Es
     liegt am schwächsten in der Rangfolge: eigener Spiegel und lokaler
     Bestand überschreiben es. */
  try {
    const ref = verzeichnisRef();
    if (ref) {
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const fern = saubere(snap.data()?.titel);
        for (const [k, v] of Object.entries(fern)) {
          if (!(k in zusammen)) zusammen[k] = v;
        }
      }
    }
  } catch (err) {
    console.warn("[inhalte] verzeichnis pull failed", err);
  }

  /* 2) Eigener Pro-Nutzer-Spiegel (wie bisher; lokale Titel gewinnen). */
  const code = getSession()?.studentCode;
  const { db } = getFirebase();
  if (code && db) {
    try {
      const s = seg.progressDoc(code, INHALTE_MODUL);
      const snap = await getDoc(doc(db, s[0], ...s.slice(1)));
      if (snap.exists()) {
        const remote = snap.data()?.titel;
        if (remote && typeof remote === "object" && !Array.isArray(remote)) {
          for (const [k, v] of Object.entries(remote as Record<string, string>)) {
            if (typeof v === "string" && !(k in lokal)) zusammen[k] = v;
          }
        }
      }
    } catch (err) {
      console.warn("[inhalte] cloud pull failed", err);
    }
  }

  if (JSON.stringify(zusammen) !== JSON.stringify(lokal)) {
    schreiben(zusammen);
    window.dispatchEvent(new CustomEvent(INHALTE_EVENT, { detail: { cloud: true } }));
  }
  /* Nachschub in die Gegenrichtung: Was hier bekannt ist und dem Verzeichnis
     fehlt, wird hochgeschoben — so füllt jede Besucherin es für alle. */
  scheduleVerzeichnisPush();
}

/** Ganze Registry lesen. */
export function leseInhalte(): Record<string, string> {
  return lesen();
}

/** Titel zu einer Basis-ID (oder undefined). */
export function titelFuer(basisId: string): string | undefined {
  return lesen()[basisId];
}
