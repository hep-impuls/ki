/**
 * Stations-Daten für die KI-Einheit (Lernseite 1, Pietro).
 *
 * Data-driven: Die <Station>-Komponente rendert generisch aus diesen Objekten —
 * Inhalt hier pflegen, nie das JSX anfassen. Struktur folgt der Stations-
 * Mechanik aus KI_EINHEIT_GESAMTARCHITEKTUR_v2.md §5/§6:
 *   Versprechen → Position 1 → Hauptgang (affirmativ) → Dessert (dissonant)
 *   → Befund + Position 2 + ein Satz.
 *
 * Start/Ende sind in SEKUNDEN (geschnittene Ausschnitte). Die YouTube-IDs bzw.
 * mp3-Direkt-URLs sind noch TODO — Quellen siehe
 * docs/material-pietro/urls.md (Schlüssel = `sourceKey`).
 */

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
  /** optionaler Link zur Original-Quelle (z.B. fuer Placeholder) */
  externalUrl?: string;
}

export interface MediaBlock {
  /** kurze Hinführung (Bridge-Stil), optional */
  intro?: string;
  /** 1..n Ausschnitte (z.B. Audio + Video kombiniert) */
  media: MediaSpec[];
}

export interface VertiefungConfig extends MediaBlock {
  /** Triggerwarnung, wird VOR dem Opt-in gezeigt */
  warnung: string;
  /** Hilfsangebote, werden am Ende der Vertiefung gezeigt */
  hilfsangebote: string;
}

export interface StationConfig {
  /** Poll-/Storage-Key, stabil halten: "station-1" … */
  id: string;
  nummer: number;
  /** Ich-Frage (Titel) — bewusst KEIN "Aspekt" im UI */
  frage: string;
  /** Material Symbol (Outlined) */
  icon: string;
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
    versprechen:
      "KI macht perfekte Bilder und Videos — und hilft dir zugleich, Fälschungen zu durchschauen.",
    achse: {
      links: "kreative Ermächtigung & Erkennen",
      rechts: "Vertrauensverlust & Manipulation",
    },
    hauptgang: {
      intro:
        "Drei Generationen einer Familie testen im Spiel, was Fake ist — du siehst, wie man lernt, hinzuschauen.",
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
    },
    dessert: {
      intro:
        "Dieselbe Technik, die Spass macht, klont live eine Reporterstimme — und dient dem Betrug.",
      media: [
        {
          kind: "audio",
          src: undefined, // TODO: mp3-Direktlink
          start: 816, // 13:36
          end: 950, // 15:50
          title: "Newsjournal: Stimme klonen",
          sourceKey: "newsjournal-stimme-klonen",
        },
        {
          kind: "srf",
          urn: "urn:srf:video:8184d9b5-410e-412f-9a67-4194b2f3ecd2",
          start: 2641, // 44:01
          end: 2809, // 46:49
          title: "Rundschau: KI-Kriminalitaet — CEO-Betrug per Stimmklon",
          sourceKey: "rundschau-ki-kriminalität",
        },
      ],
    },
  },
  {
    id: "station-2",
    nummer: 2,
    frage: "Verändert KI meinen Job zum Guten?",
    icon: "work",
    versprechen:
      "KI nimmt dir die mühsame Arbeit ab und macht dich produktiver.",
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
    },
    dessert: {
      intro:
        "Hinter der Produktivität: ausgebeutete Datenarbeiter:innen in Kenia.",
      media: [
        {
          kind: "youtube",
          youtubeId: "TODO", // kassensturz-ausbeutung (alt.: Vollvideo/Text)
          start: 1274, // 21:14
          end: 1900, // 31:40
          title: "Kassensturz: Ausbeutung der Datenarbeit",
          sourceKey: "kassensturz-ausbeutung",
        },
      ],
    },
  },
  {
    id: "station-3",
    nummer: 3,
    frage: "Macht KI mich klüger oder unselbständig?",
    icon: "psychology",
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
      hilfsangebote:
        "Wenn dich das Thema beschäftigt: Die Dargebotene Hand — Tel. 143 (rund um die Uhr, vertraulich). Für Jugendliche: Pro Juventute — Tel. 147.",
    },
  },
  {
    id: "station-5",
    nummer: 5,
    frage: "Kann KI die Welt besser machen?",
    icon: "public",
    versprechen: "KI löst die grossen Probleme — Foodwaste, Klima, Sicherheit.",
    achse: { links: "Retten", rechts: "Töten" },
    hauptgang: {
      intro:
        "Zwei konkrete «KI fürs Gute»-Fälle: ein Start-up gegen Foodwaste und KI für sehbehinderte Menschen.",
      media: [
        {
          kind: "audio",
          src: undefined, // TODO (zwei Clips derselben Quelle)
          start: 309, // 05:09
          end: 352, // 05:52
          title: "Espresso: Foodwaste — Go Nina (Teil 1)",
          sourceKey: "espresso-foodwaste",
        },
        {
          kind: "audio",
          src: undefined, // TODO
          start: 491, // 08:11
          end: 545, // 09:05
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
    },
    dessert: {
      intro:
        "Dieselbe Technologie, die rettet, tötet anderswo: Automation Bias, eine getroffene Mädchenschule.",
      media: [
        {
          kind: "youtube",
          youtubeId: "TODO", // 10v10-ki-krieg (alt.: rundschau-ki-krieg)
          start: 831, // 13:51
          end: 882, // 14:42
          title: "10vor10: KI im Krieg (Palantir)",
          sourceKey: "10v10-ki-krieg",
        },
      ],
    },
  },
];
