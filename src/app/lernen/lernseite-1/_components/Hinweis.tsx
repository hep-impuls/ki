"use client";

import type { ReactNode } from "react";

/**
 * Hinweis — Erzähler-/Brücken-Ton (Handoff v2 §5.2, 10mio "Bridge"-Muster).
 *
 * Führender Übergang VOR einem Clip oder Abschnitt: kurz und sinnstiftend
 * sagen, *warum* das Folgende kommt. Sparsam, aber an jedem Phasenwechsel.
 */

export default function Hinweis({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-sm border-l-4 border-primary pl-md text-body-lg text-on-surface-variant">
      <span className="material-symbols-outlined mt-[2px] text-[20px] text-primary">
        auto_stories
      </span>
      <span>{children}</span>
    </p>
  );
}
