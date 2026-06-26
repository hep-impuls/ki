/**
 * Chancen-Risiken-Landkarte der KI-Einheit v3 (Lernseite 1, Pietro).
 *
 * Massgebend: KI_EINHEIT_GESAMTARCHITEKTUR_v3.md §10/§11. Die Landkarte wird
 * **rückwärts aus den Polls designt**: zuerst stehen die Achsen fest, daraus
 * folgt, welche Poll-Frage (Format + pollId) sie speist. Sie wächst mit der Zahl
 * der absolvierten Stationen — gerendert werden nur Achsen, zu denen Daten
 * vorliegen (Ich-Punkt lokal; Klasse/alle aus anonymen Aggregaten).
 *
 * `pollIds` sind **Basis-Keys** — die Runtime bildet daraus die konkreten
 * Firestore-Keys (pollId.poll / pollId.klassePoll, siehe _lib/unitPolls.ts).
 * Die hier genannten Basis-Keys müssen mit `PollFrage.pollId` der jeweiligen
 * Station übereinstimmen (in M2 final ausgeschrieben; Skelett nutzt
 * `stN-leitachse`).
 */

import type { LandkarteAxis } from "./types";

export const LANDKARTE_ACHSEN: LandkarteAxis[] = [
  {
    id: "global-chance-bedrohung",
    label: "KI in meinem Leben gesamt: Chance ↔ Bedrohung",
    links: "Bedrohung",
    rechts: "Chance",
    pollIds: ["global-chance-bedrohung"],
    format: "slider",
    quelle: "auftakt",
  },
  {
    id: "arbeit-wirtschaft",
    label: "Arbeit/Wirtschaft: Bedrohung ↔ Chance",
    links: "Bedrohung",
    rechts: "Chance",
    pollIds: ["st1-leitachse"],
    format: "skala4",
    quelle: "station-1",
  },
  {
    id: "medien-wahrheit",
    label: "Medien/Wahrheit: unsicher ↔ kompetent",
    links: "unsicher",
    rechts: "kompetent",
    pollIds: ["st2-leitachse"],
    format: "skala4",
    quelle: "station-2",
  },
  {
    id: "lernen-mensch",
    label: "Lernen/Mensch: unselbständig ↔ klüger",
    links: "unselbständig",
    rechts: "klüger",
    pollIds: ["st3-leitachse"],
    format: "skala4",
    quelle: "station-3",
  },
  {
    id: "beziehung-mensch",
    label: "Beziehung/Mensch: riskant ↔ hilfreich",
    links: "riskant",
    rechts: "hilfreich",
    pollIds: ["st4-leitachse"],
    format: "skala4",
    quelle: "station-4",
  },
  {
    id: "welt-oekologie-ethik",
    label: "Welt/Ökologie-Ethik: schlechter ↔ besser",
    links: "schlechter",
    rechts: "besser",
    pollIds: ["st5-leitachse"],
    format: "skala4",
    quelle: "station-5",
  },
  {
    id: "krieg-politik",
    label: "Krieg/Politik: untragbar ↔ notwendig",
    links: "untragbar",
    rechts: "notwendig",
    pollIds: ["st6-leitachse"],
    format: "skala4",
    quelle: "station-6",
  },
  {
    id: "technik-vertrauen",
    label: "Technik-Vertrauen: skeptisch ↔ zutraulich",
    links: "skeptisch",
    rechts: "zutraulich",
    pollIds: ["st7-vertrauen"],
    format: "slider",
    quelle: "station-7",
  },
  {
    id: "werte-profil",
    label: "Werte-Profil (Regulierung↔Innovation, Mensch-im-Loop↔Effizienz, Datenschutz↔Bequemlichkeit)",
    links: "Regulierung / Mensch / Datenschutz",
    rechts: "Innovation / Effizienz / Bequemlichkeit",
    pollIds: ["swipe-profil"],
    format: "skala4",
    quelle: "swipe",
  },
];
