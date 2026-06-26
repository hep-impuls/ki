/**
 * Auftakt-Daten (Lernseite 1, Pietro) — Handoff §5.1, v2 §3/§7/§9.
 *
 * Data-driven: Texte/Optionen/Medien hier pflegen, nie hart ins JSX. Vier
 * Bausteine: Lernziel-Karte, (A) Vorwissens-Abfrage, (B) Hype-Opener (+ Opener-
 * Wissen-Check), (C) Stimmungsbild-PollDeck + globaler Pre-Poll.
 * Start/Ende in SEKUNDEN.
 */

import type { MediaSpec } from "./stationen";
import type { PollDeckSpec } from "../_components/PollDeck";
import type { LernzielKarteSpec } from "../_components/LernzielKarte";
import type { VerteilungOption } from "../_components/Verteilung";

/** Lernziel-Karte, die die ganze Einheit eröffnet (§7.1). */
export const AUFTAKT_LERNZIEL: LernzielKarteSpec = {
  titel: "Worum es geht",
  lernziele: [
    "Du machst dein KI-Vorwissen sichtbar.",
    "Du legst eine erste Position fest — Chance oder Bedrohung?",
    "Du erkennst, dass es hier kein Richtig oder Falsch gibt.",
  ],
  aktivitaet:
    "Zuerst hältst du fest, wo dir KI begegnet ist. Dann ein gemeinsamer Reiz, ein kurzer Wissen-Check und dein Stimmungsbild. Zum Schluss setzt du deine Position.",
  wasKommt:
    "Erst ein gemeinsamer Reiz, dann deine Position, dann die Stationen — und warum: damit du am Ende deine eigene Bewegung sehen kannst.",
};

/** (A) Vorwissens-Abfrage — Mehrfachauswahl. Freitext separat (rein lokal). */
export interface VorwissenOption {
  /** stabile ID — wird zu Poll-ID aw-<id> */
  id: string;
  label: string;
  icon: string;
}

export const VORWISSEN_FRAGE = "Wo ist dir KI in den letzten 7 Tagen begegnet?";

export const VORWISSEN_OPTIONEN: VorwissenOption[] = [
  { id: "suche", label: "Suchmaschine / Übersicht oben", icon: "search" },
  { id: "chatbot", label: "ChatGPT o.Ä.", icon: "chat" },
  { id: "feed", label: "Social-Media-Feed / Empfehlungen", icon: "dynamic_feed" },
  { id: "medien", label: "Foto-/Video-Filter oder -Generator", icon: "photo_camera" },
  { id: "assistent", label: "Sprachassistent (Siri/Alexa)", icon: "mic" },
  { id: "uebersetzung", label: "Übersetzung", icon: "translate" },
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

/**
 * Die zwei optionalen Opener-Videos als beschriftete Karten — nebeneinander
 * gezeigt, damit klar ist, was jedes enthält, und alle frei wählen können, was
 * sie ansehen (oder eben nicht — beides ist freiwillig).
 */
export interface OpenerKarte {
  media: MediaSpec;
  titel: string;
  beschreibung: string;
  /** Material Symbol (Outlined). */
  icon: string;
}

export const OPENER_SCHWANZ_KARTEN: OpenerKarte[] = [
  {
    media: OPENER_SCHWANZ[0],
    titel: "Musik aus dem Rechner",
    beschreibung: "Eine KI komponiert und spielt live einen Song — hör rein, wie nah das an echter Musik ist.",
    icon: "music_note",
  },
  {
    media: OPENER_SCHWANZ[1],
    titel: "Der Roboter, der zugreift",
    beschreibung: "Ein Roboterarm lernt zu greifen — wie weit ist KI in der echten, körperlichen Welt?",
    icon: "precision_manufacturing",
  },
];

/** (C) Stimmungsbild-PollDeck — 3 Stance-Polls, jede mit Drei-Ebenen-Spiegel. */
const NUTZUNG_OPT: VerteilungOption[] = [
  { id: "taeglich", label: "täglich" },
  { id: "woechentlich", label: "wöchentlich" },
  { id: "selten", label: "selten" },
  { id: "nie", label: "nie" },
];

const VERTRAUEN_OPT: VerteilungOption[] = [1, 2, 3, 4, 5].map((n) => ({
  id: `s${n}`,
  label: `${n}`,
}));

const ZUKUNFT_OPT: VerteilungOption[] = [
  { id: "stark", label: "stark verändern" },
  { id: "etwas", label: "etwas verändern" },
  { id: "kaum", label: "kaum verändern" },
];

export const STIMMUNG_DECK_PRE: PollDeckSpec = {
  titel: "Stimmungsbild — jetzt",
  intro:
    "Drei kurze Fragen. Nach jeder Stimme siehst du, wo du im Verhältnis zu deiner Klasse und allen stehst.",
  fragen: [
    { id: "stimmung-nutzung-pre", frage: "Wie oft nutzt du KI aktiv?", optionen: NUTZUNG_OPT },
    {
      id: "stimmung-vertrauen-pre",
      frage: "Wie sehr vertraust du KI-Antworten?",
      optionen: VERTRAUEN_OPT,
      achse: { links: "gar nicht", rechts: "voll und ganz" },
    },
    { id: "stimmung-zukunft-pre", frage: "KI wird meinen künftigen Beruf …", optionen: ZUKUNFT_OPT },
  ],
};

export const STIMMUNG_DECK_POST: PollDeckSpec = {
  titel: "Stimmungsbild — nachher",
  intro: "Dieselben drei Fragen. Vergleiche, ob sich deine Sicht verschoben hat.",
  fragen: [
    { id: "stimmung-nutzung-post", frage: "Wie oft nutzt du KI aktiv?", optionen: NUTZUNG_OPT },
    {
      id: "stimmung-vertrauen-post",
      frage: "Wie sehr vertraust du KI-Antworten?",
      optionen: VERTRAUEN_OPT,
      achse: { links: "gar nicht", rechts: "voll und ganz" },
    },
    { id: "stimmung-zukunft-post", frage: "KI wird meinen künftigen Beruf …", optionen: ZUKUNFT_OPT },
  ],
};

/** Map post-Frage-ID → pre-Frage-ID, für den Vorher/Jetzt-Vergleich. */
export const STIMMUNG_VORHER: Record<string, string> = {
  "stimmung-nutzung-post": "stimmung-nutzung-pre",
  "stimmung-vertrauen-post": "stimmung-vertrauen-pre",
  "stimmung-zukunft-post": "stimmung-zukunft-pre",
};

/** (C) Globaler Pre-Poll — Frage über der GLOBAL_AXIS-Skala. */
export const PRE_POLL_FRAGE =
  "Bevor du loslegst: Ist KI für dich eher eine Chance oder eher eine Bedrohung?";
