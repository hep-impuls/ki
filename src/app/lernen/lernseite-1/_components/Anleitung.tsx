"use client";

import type { ReactNode } from "react";

/**
 * Anleitung — Regie-/Instruktions-Ton (Handoff v2 §5.2, 10mio
 * "Instruct"-Muster).
 *
 * Knappe Handlungsansage VOR einem Wissen-Check oder einer Aufgabe: *was* zu
 * tun ist ("Schau den Clip, dann beantworte…"). Imperativ, klar, kurz.
 */

export default function Anleitung({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-sm rounded-lg bg-surface-container-low p-md text-body-md text-on-surface">
      <span className="material-symbols-outlined mt-[2px] text-[20px] text-tertiary">
        assignment
      </span>
      <span>{children}</span>
    </p>
  );
}
