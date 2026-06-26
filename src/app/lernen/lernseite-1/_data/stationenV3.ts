/**
 * Stations-Daten der KI-Einheit **v3** (Lernseite 1, Pietro) — SKELETT (M1).
 *
 * Massgebend: KI_EINHEIT_GESAMTARCHITEKTUR_v3.md §5/§8/§9. Diese Datei hält die
 * 7 Stationen in der **v3-Form** (siehe types.ts). Stand M1: Struktur + bereits
 * feststehende Schema-Fakten sind echt (Titel, Bereich-Tags, Icon, Badge-Matrix,
 * Leit-Poll + Landkarte-Achse, Reflexions-Prompt, Station-4-Schutz). Eigentlicher
 * **Inhalt** (Medien-Timecodes, 2 weitere Polls, Swipe-Aussagen, 5–7 Fakten,
 * Quiz-Pool 8) wird in **M2** je Station ausgeschrieben — Platzhalter sind mit
 * `[M2]` markiert.
 *
 * Die v2-Datei `stationen.ts` (alte Form) bleibt bis zur Komponenten-Migration
 * (M3) bestehen, damit Build/Lint grün bleiben. Ab M3 konsumieren die
 * Komponenten `STATIONEN_V3` aus dieser Datei.
 */

import type {
  FaktenListe,
  PollFrage,
  QuizPool,
  Skala4Optionen,
  Station,
  StationBadges,
  StationPolls,
  StationSubpages,
  StationSwipe,
  SwipeKarte,
} from "./types";

/* ── Skelett-Helfer (nur M1; in M2 durch echten Inhalt ersetzt) ──────────── */

const TODO = "[M2] noch auszuschreiben";

/** Standard-4er-Skala (v3 §6). */
const SKALA4: Skala4Optionen = [
  "trifft gar nicht zu",
  "trifft eher nicht zu",
  "trifft eher zu",
  "trifft voll zu",
];

/** Leit-Poll einer Station (4er-Skala, speist die Landkarte-Leitachse). */
function leitPoll(n: number, frage: string, landkarteAxis: string): PollFrage {
  return {
    id: `st${n}-leitachse`,
    pollId: `st${n}-leitachse`,
    frage,
    landkarteAxis,
    prePost: true,
    format: "skala4",
    optionen: SKALA4,
  };
}

/** Platzhalter-Poll (4er-Skala) — Frage in M2. */
function phPoll(n: number, idx: number, landkarteAxis: string): PollFrage {
  return {
    id: `st${n}-poll-${idx}`,
    pollId: `st${n}-poll-${idx}`,
    frage: TODO,
    landkarteAxis,
    prePost: true,
    format: "skala4",
    optionen: SKALA4,
  };
}

function phSwipe(n: number, idx: number): SwipeKarte {
  return {
    id: `st${n}-swipe-${idx}`,
    aussage: TODO,
    profilKey: "werte-profil",
  };
}

function phSwipeSet(n: number): StationSwipe {
  return [phSwipe(n, 1), phSwipe(n, 2), phSwipe(n, 3)];
}

function phFakten(n: number): FaktenListe {
  const mk = (idx: number) => ({
    id: `st${n}-fakt-${idx}`,
    claim: TODO,
    sourceName: TODO,
    sourceUrl: "",
    date: "",
  });
  return [mk(1), mk(2), mk(3), mk(4), mk(5)];
}

/** Quiz-Pool-Skelett: 5 MC + 3 W/F (v3 §6) — Inhalt in M2. */
function phQuizPool(n: number): QuizPool {
  const mc = (idx: number) =>
    ({
      id: `st${n}-mc-${idx}`,
      kind: "mc" as const,
      frage: TODO,
      optionen: [
        { label: TODO, feedback: TODO },
        { label: TODO, feedback: TODO },
      ],
      correctIndices: [0],
    });
  const tf = (idx: number) =>
    ({
      id: `st${n}-tf-${idx}`,
      kind: "tf" as const,
      aussage: TODO,
      correctAnswer: true,
      feedbackRichtig: TODO,
      feedbackFalsch: TODO,
    });
  return [mc(1), mc(2), mc(3), mc(4), mc(5), tf(1), tf(2), tf(3)];
}

/** 7 Subpage-Banner (v3 §5). Lernziel/Anleitung pro Subpage werden in M2 fein justiert. */
function subpages(n: number, lernzielSonne: string, lernzielSchatten: string): StationSubpages {
  const inhalt = (i: number, name: string) => `Station ${n} · Subpage ${i}/7: ${name}`;
  return {
    auftakt: {
      inhalt: inhalt(1, "Auftakt"),
      dauerMin: 3,
      lernziel: "Du hältst deine Ausgangshaltung fest, bevor du beide Seiten siehst.",
      anleitung: "Lies das Versprechen. Beantworte danach die drei Fragen — ehrlich, es gibt kein Richtig.",
    },
    sonne: {
      inhalt: inhalt(2, "Sonnenseite"),
      dauerMin: 6,
      lernziel: lernzielSonne,
      anleitung: TODO,
    },
    schatten: {
      inhalt: inhalt(3, "Schattenseite"),
      dauerMin: 5,
      lernziel: lernzielSchatten,
      anleitung: TODO,
    },
    swipe: {
      inhalt: inhalt(4, "Werte (Swipe)"),
      dauerMin: 2,
      lernziel: "Du schärfst dein Werte-Profil — links ablehnen, rechts zustimmen.",
      anleitung: "Wische jede Karte. Es zählt dein Bauchgefühl, nicht die richtige Antwort.",
    },
    fakten: {
      inhalt: inhalt(5, "Faktencheck"),
      dauerMin: 3,
      lernziel: "Du ergänzt das Gehörte um recherchierte Fakten mit Quelle.",
      anleitung: "Blättere durch die Fakten. Achte auf die Quelle — woher stammt die Zahl?",
    },
    quiz: {
      inhalt: inhalt(6, "Quiz"),
      dauerMin: 3,
      lernziel: "Du prüfst dein Verständnis mit 5 zufälligen Fragen (mit Feedback).",
      anleitung: "Beantworte die fünf Fragen. Das Feedback erklärt, warum eine Option stimmt.",
    },
    befund: {
      inhalt: inhalt(7, "Befund"),
      dauerMin: 3,
      lernziel: "Du verortest deine Haltung neu, schreibst einen Satz und erhältst Badges.",
      anleitung: "Beantworte dieselben drei Fragen erneut, schreibe deinen Satz und sichere dir die Badges.",
    },
  };
}

/** Leerer Medien-Block (Timecodes/Clips folgen in M2). */
function phMedia(hinweis: string): { intro: string; anleitung: string; media: [] } {
  return { intro: `[M2] ${hinweis}`, anleitung: TODO, media: [] };
}

/* ── Die 7 Stationen (Skelett) ───────────────────────────────────────────── */

export const STATIONEN_V3: Station[] = [
  {
    id: "station-1",
    nummer: 1,
    frage: "Verändert KI meinen Job — zum Guten?",
    icon: "work",
    tags: ["Wirtschaft", "Politik"],
    subpages: subpages(
      1,
      "Du erkennst, wie KI Arbeit produktiver macht und Stellen verändert statt abschafft.",
      "Du siehst, welche Berufe KI verdrängt und wie schnell das gehen kann.",
    ),
    polls: [
      leitPoll(1, "KI verändert meinen künftigen Beruf zum Guten.", "arbeit-wirtschaft"),
      phPoll(1, 2, "arbeit-wirtschaft"),
      phPoll(1, 3, "arbeit-wirtschaft"),
    ] as StationPolls,
    sonnenseite: phMedia("news-ki-arbeitsplätze (MP3) — Produktivität & Demografielücke"),
    schattenseite: phMedia("10v10-ki-informatikjob (iframe) — Entwickler-Arbeitslosigkeit"),
    swipe: phSwipeSet(1),
    fakten: phFakten(1),
    quizPool: phQuizPool(1),
    reflexion: "In der Arbeitswelt nützt KI vor allem …, gefährlich wird sie, wenn …",
    badges: [
      { familie: "wirtschaft", anzahl: 2 },
      { familie: "gesellschaft", anzahl: 1 },
    ] as StationBadges,
  },
  {
    id: "station-2",
    nummer: 2,
    frage: "Kann ich noch glauben, was ich höre und sehe?",
    icon: "visibility",
    tags: ["Technologie", "Gesellschaft", "Recht"],
    subpages: subpages(
      2,
      "Du erkennst, wie man KI-Fälschungen entlarvt und sich schützt.",
      "Du verstehst, wie Stimmklon & Deepfakes für Betrug genutzt werden.",
    ),
    polls: [
      leitPoll(2, "Ich traue mir zu, KI-Fälschungen zu erkennen.", "medien-wahrheit"),
      phPoll(2, 2, "medien-wahrheit"),
      phPoll(2, 3, "medien-wahrheit"),
    ] as StationPolls,
    sonnenseite: phMedia("einstein-what-the-fake (YT) — Familie entlarvt Fakes"),
    schattenseite: phMedia("newsjournal-stimme-klonen (MP3) — Millionen-Betrug Schwyz"),
    swipe: phSwipeSet(2),
    fakten: phFakten(2),
    quizPool: phQuizPool(2),
    reflexion: "Bei Medien hilft mir KI, indem …, sie bedroht mich, indem …",
    badges: [
      { familie: "tech", anzahl: 1 },
      { familie: "gesellschaft", anzahl: 1 },
      { familie: "ethik", anzahl: 1 },
    ] as StationBadges,
  },
  {
    id: "station-3",
    nummer: 3,
    frage: "Macht KI mich klüger oder fauler?",
    icon: "psychology",
    tags: ["Individuum", "Psyche", "Bildung"],
    subpages: subpages(
      3,
      "Du erkennst, wie KI den Lernzugang öffnet (Lisa baut ihre eigene KI).",
      "Du verstehst, was Prompten mit Gedächtnis und Hirnaktivierung macht.",
    ),
    polls: [
      leitPoll(3, "KI macht mich auf Dauer klüger.", "lernen-mensch"),
      phPoll(3, 2, "lernen-mensch"),
      phPoll(3, 3, "lernen-mensch"),
    ] as StationPolls,
    sonnenseite: phMedia("einstein-ki-im-kopf (YT, Segment A) — Lisa baut ihre KI"),
    schattenseite: phMedia("einstein-ki-im-kopf (YT, Segment B) — ~15× weniger Hirnaktivierung"),
    swipe: phSwipeSet(3),
    fakten: phFakten(3),
    quizPool: phQuizPool(3),
    reflexion: "Beim Lernen will ich KI für … nutzen, aber … unbedingt selbst tun.",
    badges: [
      { familie: "mensch", anzahl: 2 },
      { familie: "tech", anzahl: 1 },
    ] as StationBadges,
  },
  {
    id: "station-4",
    nummer: 4,
    frage: "Kann KI ein:e Freund:in oder Therapeut:in sein?",
    icon: "favorite",
    tags: ["Individuum", "Psyche", "Ethik"],
    freiwillig: true,
    warnung:
      "Diese Station berührt Nähe, Einsamkeit und psychische Gesundheit. Sie ist freiwillig — du kannst sie überspringen und stattdessen eine andere wählen.",
    subpages: subpages(
      4,
      "Du erkennst, wo ein KI-Begleiter echten Mehrwert bringt (verfügbar „um Mitternacht“).",
      "Du erkennst die Grenze: Pseudo-Nähe statt echtem Verstehen.",
    ),
    polls: [
      leitPoll(4, "Eine KI als emotionale Stütze ist hilfreich.", "beziehung-mensch"),
      phPoll(4, 2, "beziehung-mensch"),
      phPoll(4, 3, "beziehung-mensch"),
    ] as StationPolls,
    sonnenseite: phMedia("puls-seelentröster + einstein-ki-freundin (YT) — echter Mehrwert"),
    schattenseite: phMedia("einstein-ki-freundin (YT) — Meditations-Eklat, Pseudo-Nähe"),
    schattenVertiefung: {
      warnung:
        "Triggerwarnung: Das folgende Material behandelt Suizidrisiko und die Verantwortungsfrage. Schau es nur an, wenn du dich dem gewachsen fühlst.",
      intro: "[M2] puls-seelentröster — Vertiefung (opt-in): Suizidrisiko/Verantwortung",
      anleitung: TODO,
      media: [],
      hilfsangebote:
        "Wenn dich das Thema beschäftigt: Die Dargebotene Hand — Tel. 143 (rund um die Uhr, vertraulich). Für Jugendliche: Pro Juventute — Tel. 147.",
    },
    swipe: phSwipeSet(4),
    fakten: phFakten(4),
    quizPool: phQuizPool(4),
    reflexion: "Eine KI darf für mich …, aber … kann sie nicht ersetzen.",
    badges: [
      { familie: "mensch", anzahl: 2 },
      { familie: "ethik", anzahl: 1 },
    ] as StationBadges,
  },
  {
    id: "station-5",
    nummer: 5,
    frage: "Kann KI die Welt besser machen?",
    icon: "public",
    tags: ["Ökologie", "Wirtschaft", "Ethik"],
    subpages: subpages(
      5,
      "Du erkennst an einem Fall, wie KI ein echtes Problem (Foodwaste) angeht.",
      "Du siehst die versteckten Kosten: Datenarbeit in Kenia, ~180 Fr./Monat.",
    ),
    polls: [
      leitPoll(5, "Unter dem Strich macht KI die Welt besser.", "welt-oekologie-ethik"),
      phPoll(5, 2, "welt-oekologie-ethik"),
      phPoll(5, 3, "welt-oekologie-ethik"),
    ] as StationPolls,
    sonnenseite: phMedia("espresso-foodwaste (MP3) — „Go Nina“ senkt Foodwaste"),
    schattenseite: phMedia("kassensturz-ausbeutung (iframe, geführt ab ~Min. 21) — Datenarbeit Kenia"),
    swipe: phSwipeSet(5),
    fakten: phFakten(5),
    quizPool: phQuizPool(5),
    reflexion: "KI tut der Welt gut, wenn …; sie schadet, weil …",
    badges: [
      { familie: "gesellschaft", anzahl: 1 },
      { familie: "wirtschaft", anzahl: 1 },
      { familie: "ethik", anzahl: 1 },
    ] as StationBadges,
  },
  {
    id: "station-6",
    nummer: 6,
    frage: "Wenn Maschinen über Leben entscheiden",
    icon: "smart_toy",
    tags: ["Politik", "Ethik", "Recht"],
    subpages: subpages(
      6,
      "Du verstehst das Versprechen: Präzision, „Maven“, theoretischer Zivilschutz.",
      "Du erkennst Automation Bias und den Kontrollverlust (getroffene Mädchenschule).",
    ),
    polls: [
      leitPoll(6, "KI im Krieg ist ein notwendiges Werkzeug.", "krieg-politik"),
      phPoll(6, 2, "krieg-politik"),
      phPoll(6, 3, "krieg-politik"),
    ] as StationPolls,
    sonnenseite: phMedia("10v10-ki-krieg (iframe) — „Maven“/Palantir, Echtzeit-Lagebild"),
    schattenseite: phMedia("10v10-ki-krieg (iframe) — Automation Bias, veraltete Datenbank"),
    swipe: phSwipeSet(6),
    fakten: phFakten(6),
    quizPool: phQuizPool(6),
    reflexion: "KI im Krieg könnte theoretisch …, real fürchte ich …",
    badges: [
      { familie: "ethik", anzahl: 2 },
      { familie: "gesellschaft", anzahl: 1 },
    ] as StationBadges,
  },
  {
    id: "station-7",
    nummer: 7,
    frage: "Wie funktioniert das überhaupt?",
    icon: "neurology",
    tags: ["Technologie"],
    subpages: subpages(
      7,
      "Du verstehst, wie ein Sprachmodell das nächste Wort vorhersagt.",
      "Du verstehst, warum es halluzinieren kann und was „Verstehen“ hier (nicht) heisst.",
    ),
    polls: [
      // Station 7: Mini-Slider „Technik-Vertrauen“ (v3 §10/§11) statt 4er-Skala.
      {
        id: "st7-vertrauen",
        pollId: "st7-vertrauen",
        frage: "Jetzt weisst du, dass die KI das nächste Wort rät — wie sehr vertraust du ihr?",
        landkarteAxis: "technik-vertrauen",
        prePost: true,
        format: "slider",
        achse: { links: "skeptisch", rechts: "zutraulich" },
      },
      phPoll(7, 2, "technik-vertrauen"),
      phPoll(7, 3, "technik-vertrauen"),
    ] as StationPolls,
    sonnenseite: phMedia("3Blue1Brown DE — „Grosse Sprachmodelle kurz erklärt“ (youtubeId LPZh9BOjkQs)"),
    schattenseite: phMedia("3Blue1Brown DE — Halluzination / „Verstehen“ (Segment aus LPZh9BOjkQs)"),
    swipe: phSwipeSet(7),
    fakten: phFakten(7),
    quizPool: phQuizPool(7),
    reflexion: "Jetzt, wo ich weiss, dass KI Wörter „rät“, vertraue ich ihr bei … und misstraue ihr bei …",
    badges: [{ familie: "tech", anzahl: 2 }] as StationBadges,
  },
];
