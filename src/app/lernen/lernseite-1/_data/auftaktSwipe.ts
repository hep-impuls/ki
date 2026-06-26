/**
 * Auftakt-Swipe-Set (v3 §3/§6/§74) — Lernseite 1.
 *
 * 6 Wertaussagen (links ablehnen / rechts zustimmen), je **2 pro Werte-Profil-
 * Achse**, bauen schon im Auftakt das mehrachsige **Werte-Profil** auf, das die
 * Landkarte ergänzt (`werteProfilBalken`). Die `profilKey`s müssen exakt den
 * Schlüsseln in `landkarteData.PROFIL_LABELS` entsprechen:
 *   - `regulierung-innovation`        (links Regulierung · rechts Innovation)
 *   - `menschloop-effizienz`          (links Mensch im Loop · rechts Effizienz)
 *   - `datenschutz-bequemlichkeit`    (links Datenschutz · rechts Bequemlichkeit)
 *
 * **Polaritäts-Konvention (wichtig fürs Profil):** jede Aussage ist so formuliert,
 * dass **Zustimmen (rechts)** den **rechten Pol** der Achse meint und **Ablehnen
 * (links)** den linken. So bleibt `rechtsAnteil` im Balken eindeutig deutbar.
 *
 * **ki26-konform:** Profil lokal (`recordSwipe` unter Pseudo-Station `auftakt`);
 * zusätzlich **optionale** anonyme Aggregat-Zähler je Karte (`castSwipe`,
 * Bucket links/rechts) — keine personenbezogenen Daten.
 */

import type { SwipeKarte } from "./types";

/** Pseudo-Stations-ID für die Auftakt-Swipes im lokalen Store. */
export const AUFTAKT_SWIPE_STATION = "auftakt";

export const AUFTAKT_SWIPE_KARTEN: SwipeKarte[] = [
  // ── Regulierung ↔ Innovation ──────────────────────────────────────────────
  {
    id: "swipe-auftakt-regulierung-1",
    aussage: "Neue KI sollte man zuerst ausprobieren — Regeln können später kommen.",
    achse: { links: "Lieber zuerst Regeln", rechts: "Lieber zuerst ausprobieren" },
    profilKey: "regulierung-innovation",
  },
  {
    id: "swipe-auftakt-regulierung-2",
    aussage: "Tempo beim KI-Fortschritt ist wichtiger als perfekte Vorschriften.",
    achse: { links: "Vorschriften zuerst", rechts: "Tempo zuerst" },
    profilKey: "regulierung-innovation",
  },
  // ── Mensch im Loop ↔ Effizienz ────────────────────────────────────────────
  {
    id: "swipe-auftakt-menschloop-1",
    aussage: "Wenn eine KI schneller und besser entscheidet als Menschen, soll sie das auch dürfen.",
    achse: { links: "Mensch entscheidet", rechts: "KI entscheidet" },
    profilKey: "menschloop-effizienz",
  },
  {
    id: "swipe-auftakt-menschloop-2",
    aussage: "Bei klaren Routine-Entscheidungen braucht es keine menschliche Kontrolle mehr.",
    achse: { links: "Kontrolle behalten", rechts: "Kontrolle abgeben" },
    profilKey: "menschloop-effizienz",
  },
  // ── Datenschutz ↔ Bequemlichkeit ──────────────────────────────────────────
  {
    id: "swipe-auftakt-datenschutz-1",
    aussage: "Wenn eine KI-App wirklich praktisch ist, gebe ich gern ein paar Daten preis.",
    achse: { links: "Daten schützen", rechts: "Daten preisgeben" },
    profilKey: "datenschutz-bequemlichkeit",
  },
  {
    id: "swipe-auftakt-datenschutz-2",
    aussage: "Bequemlichkeit ist mir wichtiger als maximaler Datenschutz.",
    achse: { links: "Datenschutz zuerst", rechts: "Bequemlichkeit zuerst" },
    profilKey: "datenschutz-bequemlichkeit",
  },
];
