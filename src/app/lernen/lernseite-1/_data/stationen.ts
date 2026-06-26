/**
 * Stations-Daten für die KI-Einheit (Lernseite 1, Pietro).
 *
 * Data-driven: Die <Station>-Komponente rendert generisch aus diesen Objekten —
 * Inhalt hier pflegen, nie das JSX anfassen. Struktur folgt der Stations-
 * Mechanik aus KI_EINHEIT_GESAMTARCHITEKTUR_v2.md §5/§6:
 *   Versprechen → Position 1 → Hauptgang (affirmativ) → Dessert (dissonant)
 *   → Befund + Position 2 + ein Satz.
 *
 * v2 (Handoff §5/§7): jede Station trägt eine Lernziel-Karte, und Hauptgang/
 * Dessert tragen je eine Wissen-Check-Gruppe (≥2 Fragen, aus den Transkripten
 * belegt — siehe wissenChecks.ts).
 *
 * Start/Ende sind in SEKUNDEN (geschnittene Ausschnitte). Medien-IDs sind
 * vollständig verdrahtet (Handoff §6, getestete URLs).
 */

import type { WissenCheckGruppeSpec } from "../_components/WissenCheckGruppe";
import {
  WC_S1_HAUPTGANG,
  WC_S1_DESSERT,
  WC_S2_HAUPTGANG,
  WC_S2_DESSERT,
  WC_S3_HAUPTGANG,
  WC_S3_DESSERT,
  WC_S4_HAUPTGANG,
  WC_S4_DESSERT,
  WC_S5_HAUPTGANG,
  WC_S5_DESSERT,
} from "./wissenChecks";

export interface MediaSpec {
  kind: "youtube" | "audio" | "srf";
  /** YouTube-Video-ID (kind: "youtube") */
  youtubeId?: string;
  /** mp3-Direkt-URL (kind: "audio") */
  src?: string;
  /** SRF-URN (kind: "srf"), z.B. "urn:srf:video:…" oder "urn:srf:audio:…" */
  urn?: string;
  /** Ausschnitt in Sekunden */
  start: number;
  end: number;
  title: string;
  /** interner Quell-Schlüssel (= Material-Dateiname), nur Doku/Mapping */
  sourceKey?: string;
  /** optionaler Link zur Original-Quelle (z.B. für Placeholder) */
  externalUrl?: string;
}

export interface MediaBlock {
  /** kurze Hinführung (Bridge-Stil), optional */
  intro?: string;
  /** 1..n Ausschnitte (z.B. Audio + Video kombiniert) */
  media: MediaSpec[];
  /** Wissen-Check-Gruppe neben/unter den Clips (Handoff §5/§7) */
  checks?: WissenCheckGruppeSpec;
}

export interface VertiefungConfig extends MediaBlock {
  /** Triggerwarnung, wird VOR dem Opt-in gezeigt */
  warnung: string;
  /** Hilfsangebote, werden am Ende der Vertiefung gezeigt */
  hilfsangebote: string;
}

/** Lernziel-Karte pro Station (Handoff §5.1, 10mio OnboardingCard-Muster). */
export interface StationLernziel {
  titel: string;
  lernziele: string[];
  aktivitaet?: string;
  wasKommt?: string;
}

export interface StationConfig {
  /** Poll-/Storage-Key, stabil halten: "station-1" … */
  id: string;
  nummer: number;
  /** Ich-Frage (Titel) — bewusst KEIN "Aspekt" im UI */
  frage: string;
  /** Material Symbol (Outlined) */
  icon: string;
  /** Lernziel-Karte (öffnet die Station) */
  lernziel: StationLernziel;
  /** Hype-Hook: "das soll KI können" */
  versprechen: string;
  /** Nicht aufrechenbare Pole = Slider-Beschriftung */
  achse: { links: string; rechts: string };
  /** Station 4: strukturell freiwillig */
  freiwillig?: boolean;
  /** optionale Stations-Warnung (Station 4) */
  warnung?: string;
  /** affirmativer Pol — das Versprechen, das weitgehend hält */
  hauptgang: MediaBlock;
  /** dissonanter Pol (Standard) — das Versprechen, das bricht */
  dessert: MediaBlock;
  /** schwerere, opt-in Dessert-Variante (nur Station 4) */
  dessertVertiefung?: VertiefungConfig;
}

export const STATIONEN: StationConfig[] = [
  {
    id: "station-1",
    nummer: 1,
    frage: "Kann ich noch glauben, was ich sehe?",
    icon: "visibility",
    lernziel: {
      titel: "Station 1 · Glauben, was ich sehe?",
      lernziele: [
        "Du erkennst, woran man KI-Fälschungen festmachen kann — und wo das schwierig wird.",
        "Du kannst beschreiben, warum wir Inhalte teilen, auch wenn wir sie für fake halten.",
        "Du legst eine eigene Position fest, statt nur «echt» oder «fake» zu rufen.",
      ],
      aktivitaet:
        "Du setzt zuerst deine Position, schaust dann ein Mitmach-Experiment und seine Kehrseite — und prüfst mit kurzen Wissen-Checks, was hängen geblieben ist.",
      wasKommt:
        "Zuerst die Chancen-Seite (Fälschungen erkennen lernen), dann die Kehrseite (derselbe Trick fürs Verbrechen) — damit du am Ende eine begründete eigene Position hast.",
    },
    versprechen:
      "KI macht perfekte Bilder und Videos — und hilft dir zugleich, Fälschungen zu durchschauen.",
    achse: {
      links: "kreative Ermächtigung & Erkennen",
      rechts: "Vertrauensverlust & Manipulation",
    },
    hauptgang: {
      intro:
        "Drei Generationen einer Familie testen im Spiel, was Fake ist — und wann sie etwas trotzdem teilen würden.",
      media: [
        {
          kind: "youtube",
          youtubeId: "3W3HoK1f7nU", // einstein-what-the-fake
          start: 832, // 13:52
          end: 1110, // 18:30
          title: "Einstein: What the Fake — Mitmach-Experiment",
          sourceKey: "einstein-what-the-fake",
        },
      ],
      checks: WC_S1_HAUPTGANG,
    },
    dessert: {
      intro:
        "Dieselbe Technik, die Spass macht, klont live eine Reporterstimme — und dient dem Betrug.",
      media: [
        {
          kind: "srf",
          urn: "urn:srf:video:8184d9b5-410e-412f-9a67-4194b2f3ecd2",
          start: 2641, // 44:01
          end: 2809, // 46:49
          title: "Rundschau: KI-Kriminalität — CEO-Betrug per Stimmklon",
          sourceKey: "rundschau-ki-kriminalität",
        },
        {
          kind: "audio",
          src: "https://download-media.srf.ch/world/audio/Regionaljournal-Zuerich-Schaffhausen-radio/2026/03/deepfake.MP3",
          start: 0,
          end: 180,
          title: "Regionaljournal: Stimme klonen (Beilage)",
          sourceKey: "newsjournal-stimme-klonen",
        },
      ],
      checks: WC_S1_DESSERT,
    },
  },
  {
    id: "station-2",
    nummer: 2,
    frage: "Verändert KI meinen Job zum Guten?",
    icon: "work",
    lernziel: {
      titel: "Station 2 · KI & dein Job",
      lernziele: [
        "Du erkennst, in welchem Ausmass KI Schweizer Arbeitsplätze verändert.",
        "Du kannst erklären, wie eine KI-Roboterhand vom Menschen lernt.",
        "Du siehst, auf wessen Arbeit die «produktive» KI tatsächlich aufbaut.",
      ],
      aktivitaet:
        "Position setzen → Chancen-Seite (Studie + ETH-Roboterhand) mit Wissen-Check → Kehrseite (Datenarbeit in Kenia) mit Wissen-Check → Position aktualisieren.",
      wasKommt:
        "Erst die Entlastung und Produktivität, dann die verborgene Datenarbeit dahinter — damit «zum Guten?» eine ehrliche Frage bleibt.",
    },
    versprechen: "KI nimmt dir die mühsame Arbeit ab und macht dich produktiver.",
    achse: {
      links: "Produktivität & Entlastung",
      rechts: "Menschenwürde & Job-Erosion",
    },
    hauptgang: {
      intro:
        "Die volkswirtschaftliche Chance — plus eine ETH-Roboterhand, die lästige Hantierarbeit übernimmt.",
      media: [
        {
          kind: "audio",
          src: "/audio/ki-arbeitswelt.mp3",
          start: 21, // 0:21
          end: 178, // 2:58
          title: "News: KI & Arbeitsplätze",
          sourceKey: "news-ki-arbeitsplätze",
        },
        {
          kind: "youtube",
          youtubeId: "U_2RLRh8w4I", // einstein-full (Mimic-Segment)
          start: 3098, // 51:38
          end: 3491, // 58:11
          title: "Einstein: Mimic-Roboterhand (ETH)",
          sourceKey: "einstein-full",
        },
      ],
      checks: WC_S2_HAUPTGANG,
    },
    dessert: {
      intro:
        "Hinter der Produktivität: ausgebeutete Datenarbeiter:innen in Kenia.",
      media: [
        {
          kind: "srf",
          urn: "urn:srf:video:afe37702-e5f5-4466-8427-ab804baa53dc",
          start: 1274, // 21:14
          end: 1900, // 31:40
          title: "Kassensturz / A Bon Entendeur: Ausbeutung der Datenarbeit",
          sourceKey: "kassensturz-ausbeutung",
        },
      ],
      checks: WC_S2_DESSERT,
    },
  },
  {
    id: "station-3",
    nummer: 3,
    frage: "Macht KI mich klüger oder unselbständig?",
    icon: "psychology",
    lernziel: {
      titel: "Station 3 · Klüger oder unselbständig?",
      lernziele: [
        "Du erkennst, wie viel Eigenleistung in einer selbstgebauten KI steckt.",
        "Du kannst erklären, was beim Selberdenken im Kopf anders läuft als beim Prompten.",
        "Du wägst ab, wann KI dich entlastet und wann sie dir etwas wegnimmt.",
      ],
      aktivitaet:
        "Position setzen → Lisa baut ihre eigene KI (Wissen-Check) → das Hirn-Experiment zum Schreiben mit/ohne KI (Wissen-Check) → Position aktualisieren.",
      wasKommt:
        "Erst der kreative, selbstbestimmte Umgang mit KI, dann das Schreib-Experiment mit ~15× mehr Hirnaktivierung — damit du «klüger oder unselbständig?» für dich beantworten kannst.",
    },
    versprechen: "Mit KI lernst und schreibst du schneller und besser.",
    achse: {
      links: "Lernzugang & Entlastung",
      rechts: "Denk-Autonomie & Erleben",
    },
    hauptgang: {
      intro: "Die 18-jährige Lisa baut ihre eigene KI (ETH-Challenge).",
      media: [
        {
          kind: "youtube",
          youtubeId: "U5bLCVTr9_I", // einstein-ki-im-kopf
          start: 690, // 11:30
          end: 840, // 14:00
          title: "Einstein: KI im Kopf — Lisa baut ihre KI",
          sourceKey: "einstein-ki-im-kopf",
        },
      ],
      checks: WC_S3_HAUPTGANG,
    },
    dessert: {
      intro:
        "Dieselbe Sendung: Wer promptet, hat ~15× weniger Hirnaktivierung — und erinnert sich an nichts.",
      media: [
        {
          kind: "youtube",
          youtubeId: "U5bLCVTr9_I", // einstein-ki-im-kopf
          start: 1917, // 31:57
          end: 2056, // 34:16
          title: "Einstein: KI im Kopf — das Schreib-Experiment",
          sourceKey: "einstein-ki-im-kopf",
        },
      ],
      checks: WC_S3_DESSERT,
    },
  },
  {
    id: "station-4",
    nummer: 4,
    frage: "Ist KI ein Freund?",
    icon: "favorite",
    freiwillig: true,
    warnung:
      "Diese Station berührt Nähe, Einsamkeit und psychische Gesundheit. Sie ist freiwillig — du kannst sie überspringen und stattdessen eine andere wählen.",
    lernziel: {
      titel: "Station 4 · Ist KI ein Freund?",
      lernziele: [
        "Du erkennst, wo ein KI-Begleiter echten Mehrwert bringt — und wo nur Pseudo-Nähe.",
        "Du kannst benennen, was einem Chatbot für echte Beziehung fehlt.",
        "Du entscheidest selbst, wie nah du dieses Thema an dich heranlässt.",
      ],
      aktivitaet:
        "Position setzen → echter Mehrwert (Therapie-Zwilling, nützlicher Tipp) mit Wissen-Check → Pseudo-Nähe (Meditations-Eklat) mit Wissen-Check → optionale, getriggerte Vertiefung → Position aktualisieren.",
      wasKommt:
        "Erst die Entlastung, die KI-Begleiter bieten können, dann ihre Grenze im echten Gespräch — alles freiwillig, in deinem Tempo.",
    },
    versprechen: "KI ist immer für dich da — als Coach, Tröster, Freund:in.",
    achse: {
      links: "Verfügbarkeit & Trost",
      rechts: "Authentizität & Abhängigkeit",
    },
    hauptgang: {
      intro:
        "Reale Entlastung: ein digitaler Therapie-Zwilling, ein Bot, der mit echtem Mehrwert überrascht.",
      media: [
        {
          kind: "youtube",
          youtubeId: "jh6Pu-h7rCw", // puls-seelentröster
          start: 1232, // 20:32
          end: 1291, // 21:31
          title: "Puls: Seelentröster — Therapie-Zwilling",
          sourceKey: "puls-seelentröster-ki",
        },
        {
          kind: "youtube",
          youtubeId: "xBT2Mrfhhso", // einstein-ki-freundin
          start: 1158, // 19:18
          end: 1238, // 20:38
          title: "Einstein: KI-Freundin — echter Mehrwert",
          sourceKey: "einstein-ki-freundin",
        },
      ],
      checks: WC_S4_HAUPTGANG,
    },
    dessert: {
      intro:
        "Pseudo-Nähe: Der Bot reagiert — versteht aber nicht (Meditations-Eklat).",
      media: [
        {
          kind: "youtube",
          youtubeId: "xBT2Mrfhhso", // einstein-ki-freundin
          start: 1705, // 28:25
          end: 1903, // 31:43
          title: "Einstein: KI-Freundin — Pseudo-Nähe",
          sourceKey: "einstein-ki-freundin",
        },
      ],
      checks: WC_S4_DESSERT,
    },
    dessertVertiefung: {
      warnung:
        "Triggerwarnung: Das folgende Material behandelt einen Suizid-Fall (Adam Raine) und die Verantwortungsfrage. Schau es nur an, wenn du dich dem gewachsen fühlst.",
      intro: "Der Fall Adam Raine — die Verantwortungsfrage in ihrer schärfsten Form.",
      media: [
        {
          kind: "youtube",
          youtubeId: "jh6Pu-h7rCw", // puls-seelentröster
          start: 1324, // 22:04
          end: 1623, // 27:03
          title: "Puls: Seelentröster — Fall Adam Raine",
          sourceKey: "puls-seelentröster-ki",
        },
      ],
      // Bewusst KEIN Wissen-Check: ein Quiz über einen Suizid-Fall wäre tonal
      // unpassend (Handoff §5.8, Datenschutz/Wohlbefinden).
      hilfsangebote:
        "Wenn dich das Thema beschäftigt: Die Dargebotene Hand — Tel. 143 (rund um die Uhr, vertraulich). Für Jugendliche: Pro Juventute — Tel. 147.",
    },
  },
  {
    id: "station-5",
    nummer: 5,
    frage: "Kann KI die Welt besser machen?",
    icon: "public",
    lernziel: {
      titel: "Station 5 · KI für die Welt?",
      lernziele: [
        "Du erkennst an einem konkreten Fall, wie KI ein echtes Problem (Foodwaste) angeht.",
        "Du kannst den «Automation Bias» erklären und warum er im Krieg gefährlich wird.",
        "Du hältst aus, dass dieselbe Technologie rettet und tötet.",
      ],
      aktivitaet:
        "Position setzen → «KI fürs Gute» (Foodwaste, Inklusion) mit Wissen-Check → die tödliche Kehrseite (KI im Krieg) mit Wissen-Check → Position aktualisieren.",
      wasKommt:
        "Erst zwei «KI rettet»-Fälle, dann «KI tötet» — damit «besser machen?» die ganze Spannweite umfasst.",
    },
    versprechen: "KI löst die grossen Probleme — Foodwaste, Klima, Sicherheit.",
    achse: { links: "Retten", rechts: "Töten" },
    hauptgang: {
      intro:
        "Zwei konkrete «KI fürs Gute»-Fälle: ein Start-up gegen Foodwaste und KI für sehbehinderte Menschen.",
      media: [
        {
          kind: "audio",
          // Hinweis (Handoff §11, bewusst offener Punkt): Transkript-Marken vs.
          // «mp3 startet Minute 6:00» — Offset beim Verdrahten 1× verifizieren;
          // Fenster ggf. anpassen. Aus der Sandbox nicht testbar (kein Netz).
          src: "https://download-media.srf.ch/world/audio/Espresso_radio/2026/04/Espresso_radio_AUDI20260401_RS_0031_1c87518e7ee14b2998aabc9b326f0de0.mp3",
          start: 309, // ~05:09 (Transkript-relativ)
          end: 352, // ~05:52
          title: "Espresso: Foodwaste — Go Nina (Teil 1)",
          sourceKey: "espresso-foodwaste",
        },
        {
          kind: "audio",
          src: "https://download-media.srf.ch/world/audio/Espresso_radio/2026/04/Espresso_radio_AUDI20260401_RS_0031_1c87518e7ee14b2998aabc9b326f0de0.mp3",
          start: 491, // ~08:11
          end: 545, // ~09:05
          title: "Espresso: Foodwaste — Go Nina (Teil 2)",
          sourceKey: "espresso-foodwaste",
        },
        {
          kind: "youtube",
          youtubeId: "U_2RLRh8w4I", // einstein-full (Inklusions-Segment)
          start: 4413, // 1:13:33
          end: 4850, // 1:20:50
          title: "Einstein: KI für Sehbehinderte",
          sourceKey: "einstein-full",
        },
      ],
      checks: WC_S5_HAUPTGANG,
    },
    dessert: {
      intro:
        "Dieselbe Technologie, die rettet, tötet anderswo: Automation Bias, eine getroffene Mädchenschule.",
      media: [
        {
          kind: "srf",
          urn: "urn:srf:video:07d69605-e3b7-4d55-994e-c98dd6e5acec",
          start: 831, // 13:51
          end: 882, // 14:42
          title: "10vor10: KI im Krieg (Palantir / Maven)",
          sourceKey: "10v10-ki-krieg",
        },
      ],
      checks: WC_S5_DESSERT,
    },
  },
];
