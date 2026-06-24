/**
 * Maschinenraum-Daten (optional) — Handoff §5.4, v2 §8.
 *
 * Freiwilliger Technik-Tiefblick, tonal anders. KEIN Wissenstest — nur
 * Selbsteinschaetzung + Interesse (bewertungsfreies Ethos). Die deutsch-
 * synchronisierten 3Blue1Brown-IDs sind nicht zweifelsfrei gesichert
 * (Handoff §12) → styled-Placeholder mit Link zur Original-Quelle.
 */

import type { MediaSpec } from "./stationen";

export const MR_PRE_FRAGE = "Wie gut verstehst du, wie ChatGPT funktioniert?";
export const MR_POST_FRAGE = "Und jetzt — wie gut verstehst du es?";
export const MR_INTERESSE_FRAGE = "Wie sehr interessiert dich die Technik dahinter?";

export const MR_PRE_ACHSE = { links: "gar nicht", rechts: "sehr gut" };
export const MR_INTERESSE_ACHSE = { links: "gar nicht", rechts: "sehr stark" };

/** Haupt-Explainer (~8', deutsch). ID nicht gesichert → Placeholder + Link. */
export const MR_EXPLAINER: MediaSpec = {
  kind: "youtube",
  youtubeId: undefined, // 3Blue1Brown "But what is a GPT?" deutsch — nicht gesichert (§12)
  start: 0,
  end: 480,
  title: "3Blue1Brown: Was ist ein GPT? (deutsch synchronisiert)",
  sourceKey: "3blue1brown-gpt",
  externalUrl: "https://www.youtube.com/watch?v=wjZofJX0v4M",
};

/** Zweiter Explainer ("noch tiefer") — als Link/Ausklapp. */
export const MR_EXPLAINER_TIEFER: MediaSpec = {
  kind: "youtube",
  youtubeId: undefined, // 3Blue1Brown "Neural networks" deutsch — nicht gesichert (§12)
  start: 0,
  end: 1140,
  title: "3Blue1Brown: Was ist ein neuronales Netz? (noch tiefer)",
  sourceKey: "3blue1brown-nn",
  externalUrl: "https://www.youtube.com/watch?v=aircAruvnKk",
};

/** Bruecke zurueck zur Haltung — Mini-Frage. */
export const MR_VERTRAUEN_FRAGE =
  "Jetzt weisst du, dass die KI das naechste Wort raet — aendert das dein Vertrauen?";

export interface VertrauenOption {
  id: string;
  label: string;
  icon: string;
}

export const MR_VERTRAUEN_OPTIONEN: VertrauenOption[] = [
  { id: "ja", label: "Ja, deutlich", icon: "trending_down" },
  { id: "teils", label: "Teils — kommt drauf an", icon: "drag_handle" },
  { id: "nein", label: "Nein, eigentlich nicht", icon: "trending_up" },
];
