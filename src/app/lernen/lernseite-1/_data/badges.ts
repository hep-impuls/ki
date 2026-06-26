/**
 * Badge-System der KI-Einheit v3 (Lernseite 1, Pietro).
 *
 * Massgebend: KI_EINHEIT_GESAMTARCHITEKTUR_v3.md §7. Fünf Familien; jede Station
 * vergibt 1–3 Badges, eine Familie kann pro Station **mehrfach** vergeben werden
 * (→ höhere Stufe). Badges erscheinen am Zeitstrahl und im Zertifikat.
 *
 * Datenmodell: Badge-Sammlung lebt **lokal** (localStorage, via _lib/fortschritt
 * in M5). Hier nur die statische Definition (Familien + Station→Badge-Matrix).
 */

import type { BadgeFamilie, BadgeFamilieInfo, BadgeRef } from "./types";

/** Die fünf Badge-Familien (v3 §7) mit Label + Material-Symbol. */
export const BADGE_FAMILIEN: Record<BadgeFamilie, BadgeFamilieInfo> = {
  tech: { label: "KI & Technologie", icon: "memory" },
  ethik: { label: "KI & Ethik", icon: "balance" },
  gesellschaft: { label: "KI & Gesellschaft", icon: "groups" },
  wirtschaft: { label: "KI & Wirtschaft", icon: "payments" },
  mensch: { label: "KI & Mensch", icon: "self_improvement" },
};

/**
 * Station → vergebene Badges (exakt aus v3 §7-Tabelle).
 *   1 Job        : Wirtschaft ×2, Gesellschaft
 *   2 Glauben    : Technologie, Gesellschaft, Ethik
 *   3 Denken     : Mensch ×2, Technologie
 *   4 Nähe ⚠️    : Mensch ×2, Ethik
 *   5 Welt besser: Gesellschaft, Wirtschaft, Ethik
 *   6 Krieg      : Ethik ×2, Gesellschaft
 *   7 Technik    : Technologie ×2
 */
export const STATION_BADGES: Record<string, BadgeRef[]> = {
  "station-1": [
    { familie: "wirtschaft", anzahl: 2 },
    { familie: "gesellschaft", anzahl: 1 },
  ],
  "station-2": [
    { familie: "tech", anzahl: 1 },
    { familie: "gesellschaft", anzahl: 1 },
    { familie: "ethik", anzahl: 1 },
  ],
  "station-3": [
    { familie: "mensch", anzahl: 2 },
    { familie: "tech", anzahl: 1 },
  ],
  "station-4": [
    { familie: "mensch", anzahl: 2 },
    { familie: "ethik", anzahl: 1 },
  ],
  "station-5": [
    { familie: "gesellschaft", anzahl: 1 },
    { familie: "wirtschaft", anzahl: 1 },
    { familie: "ethik", anzahl: 1 },
  ],
  "station-6": [
    { familie: "ethik", anzahl: 2 },
    { familie: "gesellschaft", anzahl: 1 },
  ],
  "station-7": [{ familie: "tech", anzahl: 2 }],
};
