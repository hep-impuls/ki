"use client";

import { useEffect, useState } from "react";
import AuftaktV3 from "./AuftaktV3";
import ZeitstrahlMenu from "./ZeitstrahlMenu";
import AbschlussV3 from "./AbschlussV3";

/**
 * KiEinheitV3 — Orchestrator der KI-Einheit **v3** (M7, Spec §2/§5).
 *
 * Eine schlanke State-Machine über den ganzen Flow auf /lernen/lernseite-1:
 *   auftakt → stationen (Zeitstrahl, 7 frei wählbar) → abschluss
 *           (Landkarte · Post-Slider · Klassen-Spiegel · Zertifikat ≥3).
 *
 * Die Phase wird in localStorage gehalten (Reload-fest); **alle** persönlichen
 * Daten liegen ohnehin lokal (Auftakt-Vorwissen, globaler Pre/Post, Stations-
 * Fortschritt, Badges, Zertifikat). **Keine** Cloud-Writes — anonyme Aggregate
 * (Casting) folgen in M8. Löst v2 `KiEinheit` als Live-Flow ab; v2 bleibt im
 * Repo, aber ungenutzt.
 */

type PhaseV3 = "auftakt" | "stationen" | "abschluss";

const STORAGE = "ki26-v3-phase";

const SCHRITTE: { phase: PhaseV3; label: string; icon: string }[] = [
  { phase: "auftakt", label: "Auftakt", icon: "flag" },
  { phase: "stationen", label: "Stationen", icon: "explore" },
  { phase: "abschluss", label: "Abschluss", icon: "done_all" },
];

export default function KiEinheitV3() {
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<PhaseV3>("auftakt");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw === "auftakt" || raw === "stationen" || raw === "abschluss") {
        setPhase(raw);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  function goto(p: PhaseV3) {
    setPhase(p);
    try {
      localStorage.setItem(STORAGE, p);
    } catch {
      /* ignore */
    }
  }

  // Vor der Hydration ein dezentes Skelett — verhindert SSR/Client-Mismatch.
  if (!hydrated) {
    return (
      <div className="flex flex-col gap-md">
        <div className="h-8 w-2/3 rounded-lg bg-surface-container" />
        <div className="h-40 w-full rounded-xl bg-surface-container" />
      </div>
    );
  }

  const aktiverIndex = SCHRITTE.findIndex((s) => s.phase === phase);

  return (
    <div className="flex flex-col gap-lg">
      {/* Phasen-Leiste (anklickbar — freie Bewegung zwischen den Phasen) */}
      <nav aria-label="Phasen" className="flex flex-wrap items-center gap-xs">
        {SCHRITTE.map((s, i) => {
          const aktiv = i === aktiverIndex;
          const erledigtPhase = i < aktiverIndex;
          return (
            <button
              key={s.phase}
              type="button"
              onClick={() => goto(s.phase)}
              aria-current={aktiv ? "step" : undefined}
              className={
                aktiv
                  ? "inline-flex items-center gap-xs rounded-xl bg-primary px-md py-xs text-label-sm text-on-primary"
                  : erledigtPhase
                    ? "inline-flex items-center gap-xs rounded-xl bg-primary-container px-md py-xs text-label-sm text-on-primary-container transition hover:opacity-90"
                    : "inline-flex items-center gap-xs rounded-xl border border-outline-variant px-md py-xs text-label-sm text-on-surface-variant transition hover:bg-surface-container"
              }
            >
              <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
              {s.label}
            </button>
          );
        })}
      </nav>

      {phase === "auftakt" && <AuftaktV3 onComplete={() => goto("stationen")} />}

      {phase === "stationen" && (
        <ZeitstrahlMenu onWeiterZumAbschluss={() => goto("abschluss")} />
      )}

      {phase === "abschluss" && <AbschlussV3 onBack={() => goto("stationen")} />}
    </div>
  );
}
