"use client";

import { useCallback, useEffect, useState } from "react";
import type { SubpageKey } from "../_data/types";

/**
 * route.ts (M10) — **Hash-Routing-Kern** der KI-Einheit v3.
 *
 * Jeder Schritt der Einheit ist eine **adressierbare** Stelle: der
 * Navigations-Zustand (Phase · Auftakt-Schritt · offene Station · Subpage +
 * Position · Abschluss-Ansicht) wird in den **URL-Hash** gespiegelt
 * (`/lernen/lernseite-1#/station/2/fakten/3`). Das macht jeden Schritt
 * **reload-fest** (Neuladen landet auf demselben Schritt), **Browser-Zurück/Vor**
 * blättert Schritte und **Deep-Links** öffnen exakt diese Stelle.
 *
 * **Warum Hash statt Query?** Der ganze v3-Flow ist `"use client"`. Hash-Routing
 * ist rein clientseitig — keine `<Suspense>`-Grenze um `useSearchParams`, keine
 * SSR-/Scroll-Restoration-Fallstricke, `page.tsx` bleibt unangetastet. Verhält
 * sich identisch auf Vercel.
 *
 * **ki26-konform:** Der Hash trägt **nur Navigations-Zustand** — niemals
 * Antworten, Punkte oder Profil. Persönliche Daten bleiben in localStorage.
 *
 * `history`-Zugriff passiert **ausschliesslich** hier (eine Quelle der Wahrheit):
 * `KiEinheitV3` besitzt den `useRoute()`-Hook und reicht `route` + `navigate`
 * nach unten durch.
 */

export type Route =
  | { phase: "auftakt"; schritt: number; inner: number }
  | { phase: "stationen"; view: "menu" | "zertifikat" }
  | { phase: "station"; nummer: number; sub: SubpageKey; pos: number }
  | { phase: "abschluss"; view: "landkarte" | "zertifikat" };

/** Oberste Orchestrator-Phase (KiEinheitV3 rendert «station» innerhalb «stationen»). */
export type TopPhase = "auftakt" | "stationen" | "abschluss";

export const DEFAULT_ROUTE: Route = { phase: "auftakt", schritt: 0, inner: 0 };

const SUBPAGE_KEYS: SubpageKey[] = [
  "auftakt",
  "sonne",
  "schatten",
  "swipe",
  "fakten",
  "quiz",
  "befund",
];

function istSubpageKey(s: string): s is SubpageKey {
  return (SUBPAGE_KEYS as string[]).includes(s);
}

/** Die oberste Phase für die Phasen-Leiste (station ⇒ stationen). */
export function topPhase(route: Route): TopPhase {
  return route.phase === "station" ? "stationen" : route.phase;
}

/** Ganzzahl aus einem Pfadsegment, mit Fallback (tolerant gegen Müll). */
function intOr(seg: string | undefined, fallback: number): number {
  const n = Number(seg);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
}

/**
 * Hash → Route. Tolerant: unbekannte/leere Hashes ⇒ `null` (Aufrufer nimmt dann
 * den localStorage-Fallback bzw. DEFAULT_ROUTE).
 */
export function parseHash(hash: string): Route | null {
  const clean = hash.replace(/^#/, "").replace(/^\//, "");
  if (!clean) return null;
  const parts = clean.split("/").filter(Boolean);
  const [head, ...rest] = parts;

  switch (head) {
    case "auftakt":
      return { phase: "auftakt", schritt: intOr(rest[0], 0), inner: intOr(rest[1], 0) };
    case "stationen":
      return { phase: "stationen", view: rest[0] === "zertifikat" ? "zertifikat" : "menu" };
    case "station": {
      const nummer = intOr(rest[0], 1);
      const sub: SubpageKey = rest[1] && istSubpageKey(rest[1]) ? rest[1] : "auftakt";
      const pos = Math.max(1, intOr(rest[2], 1));
      return { phase: "station", nummer, sub, pos };
    }
    case "abschluss":
      return { phase: "abschluss", view: rest[0] === "zertifikat" ? "zertifikat" : "landkarte" };
    default:
      return null;
  }
}

/** Route → Hash (immer mit führendem `#/`). */
export function toHash(route: Route): string {
  switch (route.phase) {
    case "auftakt":
      return `#/auftakt/${route.schritt}/${route.inner}`;
    case "stationen":
      return route.view === "zertifikat" ? "#/stationen/zertifikat" : "#/stationen";
    case "station":
      return `#/station/${route.nummer}/${route.sub}/${route.pos}`;
    case "abschluss":
      return route.view === "zertifikat" ? "#/abschluss/zertifikat" : "#/abschluss";
  }
}

export interface RouteApi {
  /** `null` bis zur Hydration (SSR-sicher). */
  route: Route | null;
  /** Neuer History-Eintrag (bewusster Schritt: Weiter/Zurück/Sprung). */
  push: (route: Route) => void;
  /** History-Eintrag ersetzen (z.B. Auto-Advance — verschmutzt die Historie nicht). */
  replace: (route: Route) => void;
}

/**
 * useRoute — liest den aktuellen Hash, hält ihn als State und schreibt
 * Navigationswechsel zurück. Reagiert auf `popstate` (Browser-Zurück/Vor) und
 * `hashchange` (manuelle URL-Änderung). `history.pushState`/`replaceState`
 * lösen **kein** `hashchange` aus, daher keine Doppelverarbeitung der eigenen
 * Schreibvorgänge.
 */
export function useRoute(): RouteApi {
  const [route, setRoute] = useState<Route | null>(null);

  useEffect(() => {
    const lesen = () => setRoute(parseHash(window.location.hash));
    lesen();
    window.addEventListener("popstate", lesen);
    window.addEventListener("hashchange", lesen);
    return () => {
      window.removeEventListener("popstate", lesen);
      window.removeEventListener("hashchange", lesen);
    };
  }, []);

  const push = useCallback((next: Route) => {
    window.history.pushState(null, "", toHash(next));
    setRoute(next);
  }, []);

  const replace = useCallback((next: Route) => {
    window.history.replaceState(null, "", toHash(next));
    setRoute(next);
  }, []);

  return { route, push, replace };
}
