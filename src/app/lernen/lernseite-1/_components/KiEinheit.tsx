"use client";

import { useEffect, useState } from "react";
import {
  loadFortschritt,
  savePhase,
  savePreWert,
  savePostWert,
  saveErledigteStationen,
  type Phase,
} from "../_lib/fortschritt";
import Auftakt from "./Auftakt";
import StationenMenu from "./StationenMenu";
import Abschluss from "./Abschluss";
import Maschinenraum from "./Maschinenraum";

/**
 * KiEinheit — Orchestrator (Handoff §3).
 *
 * Eine einzige State-Machine für den ganzen Flow auf /lernen/lernseite-1:
 *   auftakt → stationen (>=3 von 5) → abschluss (+ Kollektiv-Spiegel)
 *           → maschinenraum (optional).
 *
 * Geteilter State (preWert für das Ich-Delta im Abschluss, erledigte
 * Stationen für das "mind. 3"-Gate) lebt hier und wird in localStorage
 * persistiert, damit ein Reload mitten im Flow nichts verliert.
 */

const SCHRITTE: { phase: Phase; label: string; icon: string }[] = [
  { phase: "auftakt", label: "Auftakt", icon: "flag" },
  { phase: "stationen", label: "Stationen", icon: "explore" },
  { phase: "abschluss", label: "Abschluss", icon: "done_all" },
];

export default function KiEinheit() {
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<Phase>("auftakt");
  const [preWert, setPreWert] = useState<number | null>(null);
  const [, setPostWert] = useState<number | null>(null);
  const [erledigte, setErledigte] = useState<string[]>([]);

  // Fortschritt aus localStorage laden (nur Client).
  useEffect(() => {
    const f = loadFortschritt();
    setPhase(f.phase);
    setPreWert(f.preWert);
    setPostWert(f.postWert);
    setErledigte(f.erledigteStationen);
    setHydrated(true);
  }, []);

  function gotoPhase(p: Phase) {
    setPhase(p);
    savePhase(p);
  }

  function auftaktFertig(v: number) {
    setPreWert(v);
    savePreWert(v);
    gotoPhase("stationen");
  }

  function stationFertig(id: string) {
    setErledigte((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      saveErledigteStationen(next);
      return next;
    });
  }

  function postWertFertig(v: number) {
    setPostWert(v);
    savePostWert(v);
  }

  function neuStarten() {
    setErledigte([]);
    saveErledigteStationen([]);
    gotoPhase("stationen");
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

  const aktiverIndex = SCHRITTE.findIndex(
    (s) => s.phase === (phase === "maschinenraum" ? "abschluss" : phase),
  );

  return (
    <div className="flex flex-col gap-lg">
      {/* Phasen-Leiste */}
      <nav aria-label="Fortschritt" className="flex flex-wrap items-center gap-xs">
        {SCHRITTE.map((s, i) => {
          const aktiv = i === aktiverIndex;
          const erledigtPhase = i < aktiverIndex;
          return (
            <span
              key={s.phase}
              className={
                aktiv
                  ? "inline-flex items-center gap-xs rounded-xl bg-primary px-md py-xs text-label-sm text-on-primary"
                  : erledigtPhase
                    ? "inline-flex items-center gap-xs rounded-xl bg-primary-container px-md py-xs text-label-sm text-on-primary-container"
                    : "inline-flex items-center gap-xs rounded-xl border border-outline-variant px-md py-xs text-label-sm text-on-surface-variant"
              }
            >
              <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
              {s.label}
            </span>
          );
        })}
      </nav>

      {phase === "auftakt" && <Auftakt onComplete={auftaktFertig} />}

      {phase === "stationen" && (
        <StationenMenu
          erledigte={erledigte}
          onComplete={stationFertig}
          onAbschluss={() => gotoPhase("abschluss")}
        />
      )}

      {phase === "abschluss" && (
        <div className="flex flex-col gap-md">
          <Abschluss
            preWert={preWert}
            onPostWert={postWertFertig}
            onMaschinenraum={() => gotoPhase("maschinenraum")}
          />
          <button
            type="button"
            onClick={() => gotoPhase("stationen")}
            className="inline-flex items-center gap-xs self-start text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Zurück zu den Stationen
          </button>
        </div>
      )}

      {phase === "maschinenraum" && (
        <Maschinenraum onZurueck={() => gotoPhase("abschluss")} />
      )}

      {/* Dezenter Neustart der Stationen-Auswahl */}
      {phase === "stationen" && erledigte.length > 0 && (
        <button
          type="button"
          onClick={neuStarten}
          className="inline-flex items-center gap-xs self-start text-label-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          Auswahl zurücksetzen
        </button>
      )}
    </div>
  );
}
