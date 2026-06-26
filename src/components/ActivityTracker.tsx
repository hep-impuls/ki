"use client";

import { useEffect } from "react";
import { initEngagement } from "@/lib/engagement";

/**
 * ActivityTracker — geteilte Komponente (lernseite-1 *und* lernseite-2).
 *
 * **Umbau R6:** schreibt nicht mehr in die top-level `activities`-Collection
 * (anon-Auth-`uid`), sondern richtet den neuen Engagement-Tracker
 * (`src/lib/engagement.ts`) ein: `module_view`/`module_close`/`block_view`
 * namespaced unter `abstimmungen/ki26/engagement`, getragen vom Animal-Code der
 * Session statt einer anonymen `uid`. No-op ohne Schueler-Session.
 *
 * **Prop-API unveraendert** (Drop-in fuer alle bestehenden Call-Sites):
 *   <ActivityTracker type="page_view" page="lernseite-1" />
 * - `page`     → Engagement-`slug` (Modul-Kennung).
 * - `type`/`lessonId` werden weiterhin akzeptiert, sind aber im Engagement-
 *   Modell nicht mehr noetig (das Engagement-Setup erledigt view/close/block in
 *   einem). Sie bleiben Teil der Signatur, damit kein Call-Site angefasst werden
 *   muss; `block_view` haengt automatisch an `[data-block-id]`-Elementen.
 */

export type ActivityType = "page_view" | "lesson_open" | "lesson_complete";

type Props = {
  type?: ActivityType;
  page: string;
  lessonId?: string;
};

export default function ActivityTracker({ page }: Props) {
  useEffect(() => {
    // initEngagement gibt eine Cleanup-Funktion zurueck (Listener entfernen +
    // letzte Session flushen). No-op ohne Session/Code.
    const cleanup = initEngagement({ slug: page });
    return cleanup;
  }, [page]);

  return null;
}
