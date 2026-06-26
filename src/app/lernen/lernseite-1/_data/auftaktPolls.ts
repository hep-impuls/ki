/**
 * Globale 4er-Skala-Pre/Post-Polls des Auftakts (v3 §3/§6/§74) — Lernseite 1.
 *
 * Spec §74 verlangt 1–2 globale **4er-Skala**-Fragen (Pre) im Auftakt; §6 will
 * dasselbe Format **pre & post**. Diese zwei übergreifenden Haltungsfragen ergänzen
 * den globalen Chance↔Bedrohung-**Schieberegler** (der die persönliche Bewegung
 * misst): hier geht es um **Aggregation** (Ich vs. Klasse vs. alle 500+), darum
 * 4er-Skala statt Slider.
 *
 * Wiring (M8-Rest):
 *   - **Pre** im Auftakt (Schritt «Haltung»), **Post** im Abschluss — gleiche
 *     Frage, gleiches Format (`Skala4Frage`, phase pre/post).
 *   - Persönliche Stufe lokal (`stationStore`, Pseudo-Station `GLOBAL_STATION_ID`).
 *   - Anonymer Aggregat-Zähler je Stufe (`castSkala`, Bucket `s{Index}` unter
 *     `{pollId}-{phase}`). Der **Klassen-Spiegel** zeigt sie als zwei globale
 *     Zeilen (Post-Buckets, exakt wie die Stationen).
 *
 * **Bewusst KEINE Radar-Landkarte-Achse:** `landkarteAxis` zeigt auf eine ID, die
 * NICHT in `LANDKARTE_ACHSEN` steht → `landkarteAchsenMitDaten()` nimmt sie nicht
 * auf. Die globale Radar-Achse bleibt der Slider (§10); diese zwei Polls leben nur
 * im Klassen-Spiegel.
 */

import type { PollSkala4 } from "./types";

/** 4er-Skala-Poll mit Pol-Beschriftung (für die Verteilungs-Achse im Spiegel). */
export interface GlobalSkalaPoll extends PollSkala4 {
  /** Pol-Beschriftung links→rechts (Kontext an den Enden der Verteilung). */
  achse: { links: string; rechts: string };
}

/** Einheitliche 4 Stufen (links→rechts entlang der Zustimmungs-Achse). */
const ZUSTIMMUNG: PollSkala4["optionen"] = [
  "trifft gar nicht zu",
  "trifft eher nicht zu",
  "trifft eher zu",
  "trifft voll zu",
];

export const AUFTAKT_SKALA_POLLS: GlobalSkalaPoll[] = [
  {
    id: "global-einschaetzung",
    pollId: "global-einschaetzung",
    frage: "Ich kann gut einschätzen, was KI heute kann und was nicht.",
    landkarteAxis: "global-einschaetzung", // bewusst nicht in LANDKARTE_ACHSEN
    prePost: true,
    format: "skala4",
    optionen: ZUSTIMMUNG,
    achse: { links: "unsicher", rechts: "sicher" },
  },
  {
    id: "global-gesellschaft",
    pollId: "global-gesellschaft",
    frage: "KI wird unsere Gesellschaft insgesamt verbessern.",
    landkarteAxis: "global-gesellschaft", // bewusst nicht in LANDKARTE_ACHSEN
    prePost: true,
    format: "skala4",
    optionen: ZUSTIMMUNG,
    achse: { links: "verschlechtern", rechts: "verbessern" },
  },
];
