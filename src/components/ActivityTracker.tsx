"use client";

/**
 * ActivityTracker — geteilte Komponente (lernseite-1 *und* lernseite-2).
 *
 * **Seit 2026-08-10 schreibt diese Komponente nichts mehr.** Sie steht bewusst
 * weiter auf allen zwölf Seiten, damit die Aufrufstellen unangetastet bleiben
 * und das Erfassen mit einer einzigen Änderung wieder eingeschaltet werden kann.
 *
 * Warum aus (Entscheid 2026-08-10, siehe `docs/decisions.md`):
 * - Der Engagement-Tracker (`src/lib/engagement.ts`) legte pro Seitenaufruf und
 *   pro Seitenschluss ein Ereignis mit Code, Seite, Zeitpunkt und Verweildauer
 *   unter `abstimmungen/ki26/engagement` ab.
 * - **Niemand hat diese Daten je gelesen** — es gibt keine Auswertung, kein
 *   Skript, keine Route dafür.
 * - Es war zugleich die feinkörnigste Datenspur der ganzen App und damit die
 *   einzige, die den Satz «dein Fortschritt wird unter deinem Code gespeichert»
 *   auf `/start` untertrieben hätte.
 * - Die Block-Erfassung war ohnehin tot: das Merkmal `data-block-id`, an das sie
 *   sich hängt, kommt im ganzen Projekt nicht vor.
 *
 * Wer das Erfassen wieder will, baut zuerst die Auswertung und zieht die
 * Datenschutz-Sätze nach (`/start`, `lehrperson/anleitung`,
 * `lehrperson/leitfaden`) — dann hier `initEngagement` wieder einhängen.
 *
 * **Prop-API unverändert** (Drop-in für alle bestehenden Aufrufstellen):
 *   <ActivityTracker type="page_view" page="lernseite-1" />
 */

export type ActivityType = "page_view" | "lesson_open" | "lesson_complete";

type Props = {
  type?: ActivityType;
  page: string;
  lessonId?: string;
};

export default function ActivityTracker(_props: Props) {
  return null;
}
