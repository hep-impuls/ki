/**
 * Auftakt-Daten (Lernseite 1, Pietro) — Handoff §5.1, v2 §3/§9.
 *
 * Data-driven: Texte/Optionen/Medien hier pflegen, nie hart ins JSX. Drei
 * Schritte: (A) Vorwissens-Abfrage, (B) Hype-Opener, (C) globaler Pre-Poll.
 * Start/Ende in SEKUNDEN.
 */

import type { MediaSpec } from "./stationen";

/** (A) Vorwissens-Abfrage — Mehrfachauswahl. Freitext separat (rein lokal). */
export interface VorwissenOption {
  /** stabile ID — wird zu Poll-ID aw-<id> */
  id: string;
  label: string;
  icon: string;
}

export const VORWISSEN_FRAGE = "Wo ist dir KI in den letzten 7 Tagen begegnet?";

export const VORWISSEN_OPTIONEN: VorwissenOption[] = [
  { id: "suche", label: "Suchmaschine / Uebersicht oben", icon: "search" },
  { id: "chatbot", label: "ChatGPT o.ae.", icon: "chat" },
  { id: "feed", label: "Social-Media-Feed / Empfehlungen", icon: "dynamic_feed" },
  { id: "medien", label: "Foto-/Video-Filter oder -Generator", icon: "photo_camera" },
  { id: "assistent", label: "Sprachassistent (Siri/Alexa)", icon: "mic" },
  { id: "uebersetzung", label: "Uebersetzung", icon: "translate" },
  { id: "schule_arbeit", label: "Schule / Arbeit", icon: "school" },
  { id: "unbewusst", label: "Gar nicht bewusst", icon: "help" },
];

/** (B) Hype-Opener — gemeinsamer Reiz. */
export const OPENER_FRAGE = "Was kann KI wirklich?";

export const OPENER_MEDIA: MediaSpec = {
  kind: "youtube",
  youtubeId: "U_2RLRh8w4I",
  start: 138, // 2:18
  end: 343, // 5:43
  title: "Einstein: Was kann KI wirklich? (Opener)",
  sourceKey: "einstein-full",
};

/** Optionaler, ausklappbarer "Versprechen-Schwanz" — kurz halten. */
export const OPENER_SCHWANZ: MediaSpec[] = [
  {
    kind: "youtube",
    youtubeId: "U_2RLRh8w4I",
    start: 343, // 5:43
    end: 801, // 13:21
    title: "Einstein: Live-Song aus dem Rechner",
    sourceKey: "einstein-full",
  },
  {
    kind: "youtube",
    youtubeId: "U_2RLRh8w4I",
    start: 3098, // 51:38
    end: 3491, // 58:11
    title: "Einstein: der Roboter, der zugreift",
    sourceKey: "einstein-full",
  },
];

/** (C) Globaler Pre-Poll — Frage ueber der GLOBAL_AXIS-Skala. */
export const PRE_POLL_FRAGE =
  "Bevor du loslegst: Ist KI fuer dich eher eine Chance oder eher eine Bedrohung?";
