"use client";

import { useEffect, useState } from "react";
import AuftaktV3 from "./AuftaktV3";
import ZeitstrahlMenu from "./ZeitstrahlMenu";
import AbschlussV3 from "./AbschlussV3";
import {
  DEFAULT_ROUTE,
  topPhase,
  useRoute,
  type Route,
  type TopPhase,
} from "../_lib/route";

/**
 * KiEinheitV3 — Orchestrator der KI-Einheit **v3** (M7, Spec §2/§5; M10-Routing).
 *
 * Eine schlanke State-Machine über den ganzen Flow auf /lernen/lernseite-1:
 *   auftakt → stationen (Zeitstrahl, 7 frei wählbar) → abschluss
 *           (Landkarte · Post-Slider · Klassen-Spiegel · Zertifikat ≥3).
 *
 * **M10:** Der Navigations-Zustand lebt jetzt im **URL-Hash** (`_lib/route.ts`):
 * jeder Schritt ist adressierbar, reload-fest und über Browser-Zurück/Vor
 * blätterbar. Dieser Orchestrator **besitzt** den `useRoute()`-Hook (einzige
 * Stelle mit history-Zugriff) und reicht `route` + `push`/`replace` als `nav` an
 * AuftaktV3 / ZeitstrahlMenu / AbschlussV3 durch. localStorage (`ki26-v3-phase`)
 * bleibt nur **Fallback**, wenn der Hash leer ist (Erstaufruf).
 *
 * **ki26-konform:** Der Hash trägt nur Navigations-Zustand; **alle** persönlichen
 * Daten liegen lokal. Cloud-Writes nur anonyme Aggregate (Casting an der Quelle).
 */

type PhaseV3 = TopPhase;

const STORAGE = "ki26-v3-phase";

const SCHRITTE: { phase: PhaseV3; label: string; icon: string }[] = [
  { phase: "auftakt", label: "Auftakt", icon: "flag" },
  { phase: "stationen", label: "Stationen", icon: "explore" },
  { phase: "abschluss", label: "Abschluss", icon: "done_all" },
];

/** Phasen-Leisten-Klick → konkrete Einstiegs-Route der Phase. */
function phaseRoute(p: PhaseV3): Route {
  if (p === "stationen") return { phase: "stationen", view: "menu" };
  if (p === "abschluss") return { phase: "abschluss", view: "landkarte" };
  return DEFAULT_ROUTE;
}

export default function KiEinheitV3() {
  const { route, push, replace } = useRoute();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Hash ⇄ localStorage-Fallback. Ist der Hash gesetzt, spiegeln wir nur die
  // grobe Phase nach localStorage (für Alt-Lesepfade). Ist er leer/ungültig,
  // rekonstruieren wir die Phase aus localStorage bzw. nehmen den Default und
  // schreiben sie via `replace` in den Hash (kein zusätzlicher History-Eintrag).
  useEffect(() => {
    if (!hydrated) return;
    if (route !== null) {
      try {
        localStorage.setItem(STORAGE, topPhase(route));
      } catch {
        /* ignore */
      }
      return;
    }
    let p: PhaseV3 = "auftakt";
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw === "auftakt" || raw === "stationen" || raw === "abschluss") p = raw;
    } catch {
      /* ignore */
    }
    replace(phaseRoute(p));
  }, [hydrated, route, replace]);

  // Vor der Hydration / vor gesetztem Hash ein dezentes Skelett (SSR-sicher).
  if (!hydrated || route === null) {
    return (
      <div className="flex flex-col gap-md">
        <div className="h-8 w-2/3 rounded-lg bg-surface-container" />
        <div className="h-40 w-full rounded-xl bg-surface-container" />
      </div>
    );
  }

  const aktivePhase = topPhase(route);
  const aktiverIndex = SCHRITTE.findIndex((s) => s.phase === aktivePhase);
  const nav = { route, push, replace };

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
              onClick={() => push(phaseRoute(s.phase))}
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

      {route.phase === "auftakt" && (
        <AuftaktV3 nav={nav} onComplete={() => push({ phase: "stationen", view: "menu" })} />
      )}

      {(route.phase === "stationen" || route.phase === "station") && (
        <ZeitstrahlMenu
          nav={nav}
          onWeiterZumAbschluss={() => push({ phase: "abschluss", view: "landkarte" })}
        />
      )}

      {route.phase === "abschluss" && (
        <AbschlussV3 nav={nav} onBack={() => push({ phase: "stationen", view: "menu" })} />
      )}
    </div>
  );
}
