"use client";

import { useEffect } from "react";
import { mirrorProgress } from "@/lib/progressMirror";
import { buildLernseite1Progress } from "../_lib/progressSnapshot";

/**
 * Unsichtbarer Spiegel: schreibt den lokalen Lernfortschritt von Lernseite 1
 * periodisch + bei Sichtbarkeitswechsel als `progress/lernseite-1`-Doc nach
 * Firestore (Lehrer-Report). No-op ohne Schueler-Session.
 *
 * Bewusst entkoppelt vom v3-Orchestrator (kein Eingriff in die Flow-Komponenten):
 * liest nur den localStorage-Stand. In `page.tsx` neben `<ActivityTracker>`
 * eingebettet.
 */
const MODULE_ID = "lernseite-1";

export default function ProgressMirror() {
  useEffect(() => {
    let cancelled = false;
    const sync = () => {
      if (cancelled) return;
      void mirrorProgress(MODULE_ID, buildLernseite1Progress());
    };

    // Initial nach kurzem Delay (Stores hydratisiert), dann alle 30s.
    const first = setTimeout(sync, 4000);
    const interval = setInterval(sync, 30_000);

    const onHidden = () => {
      if (document.visibilityState === "hidden") sync();
    };
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("pagehide", sync);

    return () => {
      cancelled = true;
      clearTimeout(first);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("pagehide", sync);
    };
  }, []);

  return null;
}
