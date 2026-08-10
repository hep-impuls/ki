"use client";

/**
 * Fortschritts-Spiegel: schreibt den lokalen Lernfortschritt zusaetzlich als
 * `students/{code}/progress/{moduleId}`-Doc nach Firestore — die Datenquelle
 * fuer den Lehrer-Report.
 *
 * Leitprinzip: **localStorage bleibt die UX-Quelle** (die Einheit funktioniert
 * komplett ohne Cloud). Dieser Spiegel ist additiv und no-op, solange keine
 * Schueler-Session existiert (anonyme Nutzung ohne Code → kein Cloud-Schreiben).
 *
 * Wiederverwendbar fuer JEDE Lernseite: der Aufrufer baut ein `Progress`-Objekt
 * (z.B. via einer modulspezifischen Snapshot-Funktion) und uebergibt es mit der
 * `moduleId` (= unit-Slug, z.B. "lernseite-1" oder "lernseite-2/submodul-1").
 */

import { getSession } from "./session";
import { saveProgress } from "./db";
import type { Progress } from "./types";

/**
 * Zuletzt erfolgreich geschriebener Stand je Modul (nur im Speicher, pro
 * Seitenaufruf). Der Spiegel laeuft auf einem Taktgeber alle 30 Sekunden —
 * ohne diesen Vergleich schreibt eine offen liegen gelassene Seite stuendlich
 * 120-mal denselben Inhalt. Erst nach erfolgreichem Schreiben merken, damit ein
 * fehlgeschlagener Versuch beim naechsten Takt wiederholt wird.
 */
const zuletztGespiegelt = new Map<string, string>();

/**
 * Einen Fortschritts-Snapshot spiegeln. No-op ohne Session und **no-op, wenn
 * sich seit dem letzten Schreiben nichts geaendert hat**. Fehler werden
 * geschluckt (Spiegel darf die UX nie blockieren).
 */
export async function mirrorProgress(moduleId: string, progress: Progress): Promise<void> {
  const session = getSession();
  if (!session?.studentCode) return;

  // Schluessel enthaelt den Code: nach einem Code-Wechsel im selben Tab soll der
  // erste Schreibvorgang wieder durchgehen.
  const key = `${session.studentCode}::${moduleId}`;
  let stand: string | null = null;
  try {
    stand = JSON.stringify(progress);
  } catch {
    stand = null; // nicht serialisierbar → im Zweifel schreiben
  }
  if (stand !== null && zuletztGespiegelt.get(key) === stand) return;

  try {
    await saveProgress(session.studentCode, moduleId, progress);
    if (stand !== null) zuletztGespiegelt.set(key, stand);
  } catch (err) {
    console.warn("[progressMirror] failed", moduleId, err);
  }
}

/**
 * Debounced-Variante: haengt sich an wiederholte lokale Aenderungen, ohne bei
 * jedem Tastendruck zu schreiben. Gibt eine Funktion zurueck, die den naechsten
 * Schreibvorgang plant.
 */
export function makeDebouncedMirror(moduleId: string, waitMs = 2000) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: Progress | null = null;
  return (progress: Progress) => {
    pending = progress;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (pending) void mirrorProgress(moduleId, pending);
      pending = null;
      timer = null;
    }, waitMs);
  };
}
