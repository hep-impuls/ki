/**
 * Maschinenraum-Daten (optional) — Handoff §5.4, v2 §7.4/§8.
 *
 * Freiwilliger Technik-Tiefblick, tonal anders. KEIN Wissenstest im Pflichtsinn —
 * Selbsteinschätzung + Interesse (bewertungsfreies Ethos) + ein optionaler,
 * leichter Wissen-Check zum Explainer. Die 3Blue1Brown-Videos sind das engl.
 * Original (Handoff §6.1, §11 — bewusst keine deutsche Synchron-Version).
 */

import type { MediaSpec } from "./stationen";
import type { LernzielKarteSpec } from "../_components/LernzielKarte";

/** Lernziel-Karte (freiwillig, kein Test). */
export const MR_LERNZIEL: LernzielKarteSpec = {
  titel: "Maschinenraum · freiwillig",
  lernziele: [
    "Du verstehst grob, dass ein Sprachmodell das nächste Wort vorhersagt.",
    "Du bekommst ein Bild davon, was «Training» und «Parameter» bedeuten.",
  ],
  aktivitaet:
    "Schätz zuerst ein, wie gut du es verstehst. Dann der Explainer, danach schaust du, ob sich etwas verändert hat — und ob es dein Vertrauen beeinflusst.",
  wasKommt:
    "Ein kurzer Erklärfilm öffnet die Haube; danach kannst du «noch tiefer» gehen — und am Ende prüfen, ob das Wissen deine Haltung bewegt.",
  note: "Kein Test, keine Noten — nur für dich.",
};

export const MR_PRE_FRAGE = "Wie gut verstehst du, wie ChatGPT funktioniert?";
export const MR_POST_FRAGE = "Und jetzt — wie gut verstehst du es?";
export const MR_INTERESSE_FRAGE = "Wie sehr interessiert dich die Technik dahinter?";

export const MR_PRE_ACHSE = { links: "gar nicht", rechts: "sehr gut" };
export const MR_INTERESSE_ACHSE = { links: "gar nicht", rechts: "sehr stark" };

/** Haupt-Explainer (~8', engl. Original, getestet — Handoff §6.1). */
export const MR_EXPLAINER: MediaSpec = {
  kind: "youtube",
  youtubeId: "LPZh9BOjkQs", // 3blue1brown-llm-explainer
  start: 0,
  end: 478, // 7:58
  title: "3Blue1Brown: Wie ein grosses Sprachmodell funktioniert (engl.)",
  sourceKey: "3blue1brown-llm-explainer",
};

/** Zweiter Explainer ("noch tiefer") — als Ausklapp. */
export const MR_EXPLAINER_TIEFER: MediaSpec = {
  kind: "youtube",
  youtubeId: "aircAruvnKk", // 3blue1brown-neural-networks
  start: 0,
  end: 1140,
  title: "3Blue1Brown: Was ist ein neuronales Netz? (noch tiefer, engl.)",
  sourceKey: "3blue1brown-neural-networks",
};

/** Brücke zurück zur Haltung — Mini-Frage. */
export const MR_VERTRAUEN_FRAGE =
  "Jetzt weisst du, dass die KI das nächste Wort errät — ändert das dein Vertrauen?";

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
