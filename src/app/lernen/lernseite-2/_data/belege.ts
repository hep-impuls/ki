/**
 * Belege — nachgeschlagene Quellen, an eine Textstelle geknüpft.
 *
 * Ein Eintrag hier bedeutet: Die URL wurde **abgerufen** und die Aussage im
 * Lernset-Text **darin kontrolliert**. Nichts hier darf aus dem Gedächtnis
 * eines Modells stammen. Wer einen Eintrag ergänzt, ruft die Seite vorher auf
 * und notiert, an welcher Stelle sie die Aussage stützt.
 *
 * `id` ist die Kennung des Textblocks aus `docs/quellenauftrag-index.json`. Sie
 * ist ein Hash des Textes: Ändert sich der Text, passt die Kennung nicht mehr,
 * und `node docs/belege-pruefen.js` meldet den Beleg als veraltet. Genau so ist
 * es gemeint, denn ein Beleg gilt für einen Wortlaut, nicht für ein Thema.
 *
 * `anker` ist die wörtliche Stelle im Text, an der der Link erscheint. Sie muss
 * im Block vorkommen und sollte so kurz wie möglich sein.
 *
 * Ziel ist ein Beleg pro Textblock, mehrere sind erlaubt, wenn ein Block
 * mehrere prüfbare Behauptungen enthält.
 */

export interface Beleg {
  /** Kennung des Textblocks (siehe docs/quellenauftrag-index.json). */
  id: string;
  /** Wörtliche Textstelle, an die der Link gehängt wird. */
  anker: string;
  url: string;
  /** Kurzname der Quelle, erscheint beim Überfahren. */
  titel: string;
  /** Wo genau in der Quelle: Seite, Abschnitt, Aphorismus. */
  stelle?: string;
  /** Datum, an dem URL und Aussage kontrolliert wurden (ISO). */
  geprueft: string;
}

export const BELEGE: Beleg[] = [
  {
    id: "PP-8fa9ca",
    anker: "daoistische Alchemisten",
    url: "https://de.wikipedia.org/wiki/Schwarzpulver",
    titel: "Schwarzpulver (Wikipedia)",
    stelle:
      "Abschnitt «Geschichte»: Chinesische Alchemisten fanden die explosive Mischung bei Versuchen zur Herstellung eines Lebenselixiers.",
    geprueft: "2026-07-26",
  },
  {
    id: "PP-8fa9ca",
    anker: "Francis Bacon",
    url: "https://www.earlymoderntexts.com/assets/pdfs/bacon1620.pdf",
    titel: "Bacon, «Novum Organum» (1620), Übersetzung Jonathan Bennett",
    stelle:
      "Erstes Buch, Aphorismus 129, Seite 46: «printing, gunpowder, and the nautical compass. These three have changed the whole aspect and state of things throughout the world».",
    geprueft: "2026-07-26",
  },

  /* ── Fallbeispiele der Kriterien («Die KI im Kontext») ────────────────────
   * Alle URLs am 2026-07-26 abgerufen, die Zahlen in der Quelle nachgelesen. */
  {
    id: "VA-e3c2cd",
    anker: "Nvidia",
    url: "https://www.wiwo.de/unternehmen/it/us-boersen-nvidia-jetzt-wertvollste-aktiengesellschaft-der-welt/30072326.html",
    titel: "WirtschaftsWoche: Nvidia wertvollste Aktiengesellschaft der Welt",
    stelle:
      "5. November 2024, Börsenwert 3,4 Billionen Dollar. Im Juni 2024 stand Nvidia schon einmal an der Spitze, konnte den Platz aber nur einen Tag halten. Darum «zeitweise».",
    geprueft: "2026-07-26",
  },
  {
    id: "VA-0210fd",
    anker: "48 Prozent",
    url: "https://www.ingenieur.de/technik/fachbereiche/umwelt/energiehungrige-google-ki-treibt-emissionen-um-48-in-die-hoehe/",
    titel: "ingenieur.de zum Google-Umweltbericht 2024",
    stelle:
      "«Treibhausgasemissionen in den letzten fünf Jahren um 48 % zugenommen haben, was hauptsächlich auf den hohen Stromverbrauch der Rechenzentren und der Lieferkette zurückzuführen ist.»",
    geprueft: "2026-07-26",
  },
  {
    id: "VA-ed6696",
    anker: "irische Statistikamt",
    url: "https://www.cso.ie/en/releasesandpublications/ep/p-dcmec/datacentresmeteredelectricityconsumption2024/keyfindings/",
    titel: "CSO Ireland: Rechenzentren und Stromverbrauch 2024",
    stelle:
      "«rose to 22% in 2024»; städtische Haushalte 18 Prozent, ländliche 10 Prozent. Für 2023 nennt der Vorjahresbericht 21 Prozent bei gleichen Haushaltswerten.",
    geprueft: "2026-07-26",
  },
  {
    id: "VA-aff821",
    anker: "Klarna",
    // Bewusst die Mitteilung des Unternehmens selbst: Der Text sagt ja gerade,
    // dass die Zahl eine Selbstauskunft ist. Der Reuters-Bericht zur späteren
    // Kurskorrektur lag hinter einer Bot-Sperre (403) und ist darum draussen.
    url: "https://www.klarna.com/international/press/der-ki-kundenassistent-von-klarna-bearbeitet-im-ersten-monat-zwei-drittel-aller-kundendienst-anfragen/",
    titel: "Klarna, Medienmitteilung vom 27. Februar 2024",
    stelle:
      "Klarnas eigene Angabe: Der KI-Assistent führte 2,3 Millionen Unterhaltungen, zwei Drittel aller Kundendienst-Chats, und leiste damit die Arbeit von 700 Vollzeitmitarbeitenden. Unabhängig nachgemessen wurde das nicht.",
    geprueft: "2026-07-26",
  },
  {
    id: "VA-eb3a6b",
    anker: "gestaffelt",
    url: "https://ai-act-service-desk.ec.europa.eu/en/ai-act/eu-ai-act-implementation-timeline",
    titel: "EU AI Act Service Desk: Zeitplan der Anwendung",
    stelle:
      "In Kraft am 1. August 2024. Verbote ab 2. Februar 2025, Regeln für Allzweckmodelle ab 2. August 2025, Transparenzpflichten (Artikel 50) ab 2. August 2026, Hochrisiko-Systeme ab Dezember 2027 bzw. August 2028.",
    geprueft: "2026-07-26",
  },
  {
    id: "VA-7dc30e",
    anker: "OpenAI Group PBC",
    url: "https://de.wikipedia.org/wiki/OpenAI",
    titel: "OpenAI (Wikipedia)",
    stelle:
      "Umstrukturierung im Oktober 2025: «OpenAI Group PBC», die in «OpenAI Foundation» umbenannte Non-Profit hält 26 Prozent der Anteile. Microsoft ist grösster Einzelinvestor, aber nur nicht-stimmberechtigter Beobachter im Verwaltungsrat.",
    geprueft: "2026-07-26",
  },
  {
    id: "VA-6068d8",
    anker: "UNESCO",
    url: "https://www.unesco.org/en/articles/generative-ai-unesco-study-reveals-alarming-evidence-regressive-gender-stereotypes",
    titel: "UNESCO: Studie zu Geschlechterstereotypen in Sprachmodellen",
    stelle:
      "Untersucht wurden GPT-2, GPT-3.5 und Llama 2. Ein Modell beschrieb Frauen viermal häufiger in häuslichen Rollen als Männer; bei Llama 2 häuften sich in Männergeschichten Wörter wie «treasure» und «adventurous», in Frauengeschichten «garden» und «love».",
    geprueft: "2026-07-26",
  },

  /* ── Antike («Philosophie in Zeiten der Verunsicherung») ──────────────────
   * Alle URLs am 2026-07-29 abgerufen und die Aussage darin nachgelesen.
   * Die Anker liegen bewusst NEBEN den Glossarbegriffen (nicht auf «Solon»,
   * «Themistokles», «Laurion»): Bei einer Überlappung gewinnt der Beleg, und
   * die Begriffserklärung im Hover wäre verdeckt. */
  {
    id: "EP-a6e85e",
    anker: "drehbar an Pflöcken befestigt waren",
    url: "https://de.wikipedia.org/wiki/Solon",
    titel: "Solon (Wikipedia)",
    stelle:
      "Abschnitt «Solons Gesetzgebung»: Das Gesetzeswerk wurde auf Holztafeln (Axones) gesichert, «in der Art heutiger Postkartenständer drehbar an Pflöcken befestigt». Aufbewahrt wurden sie im Prytaneion — darum nennt der Lernset-Text keinen Ort.",
    geprueft: "2026-07-29",
  },
  {
    id: "EP-a6e85e",
    anker: "nach ihrem Münzbild nannte",
    url: "https://de.wikipedia.org/wiki/Altgriechische_M%C3%BCnzen",
    titel: "Altgriechische Münzen (Wikipedia)",
    stelle:
      "Zu den Münzbildern: «Lange blieben die Münzen aus Aigina («Schildkröten» genannt) sowie die aus Korinth («Fohlen») und Athen («Eulen»)» die beherrschenden Zahlungsmittel des frühen Griechenland.",
    geprueft: "2026-07-29",
  },
  {
    id: "EP-a6e85e",
    anker: "wollten die Athener den Überschuss unter sich aufteilen",
    url: "https://de.wikipedia.org/wiki/Perserkriege",
    titel: "Perserkriege (Wikipedia)",
    stelle:
      "Zur Vorgeschichte von Salamis: «man sich von Themistokles überzeugen liess, Überschusseinnahmen aus dem Silberabbau in Laurion von 483 v. Chr. an nicht unter die Bürger zu verteilen, sondern in den Schiffsbau zu investieren».",
    geprueft: "2026-07-29",
  },

  /* ── Zerbrechen der Ordnung ───────────────────────────────────────────────
   * 537 belagerten die OSTgoten Rom, nicht die Westgoten von 410. Der Text
   * nannte vorher nur «Goten», was beide Völker verschmolz. */
  {
    id: "EP-03c465",
    anker: "zerstörten sie die Wasserleitungen",
    url: "https://de.wikipedia.org/wiki/Wasserversorgung_im_R%C3%B6mischen_Reich",
    titel: "Wasserversorgung im Römischen Reich (Wikipedia)",
    stelle:
      "Zur Belagerung Roms: «Bei der vorangegangenen Belagerung wurden die in die Stadt führenden Aquädukte zerstört», worauf der Betrieb der grossen Thermen endgültig zum Erliegen kam und auch die städtischen Mühlen ausfielen. Datierung und Zuordnung zu den Ostgoten (Januar 537 bis März 538) über den Artikel «Gotenkrieg (535–554)».",
    geprueft: "2026-07-29",
  },
];

/**
 * Blöcke, für die bewusst KEIN Link gesetzt wird, mit Begründung. Das ist
 * genauso wichtig wie ein Beleg: Es hält fest, dass gesucht und nichts
 * Brauchbares gefunden wurde, damit niemand später aus Verlegenheit eine
 * ungefähr passende Quelle einsetzt.
 */
export interface KeinBeleg {
  id: string;
  /** Worum es in dem Block geht, für die Lesbarkeit des Berichts. */
  betrifft: string;
  grund: string;
  notiert: string;
}

export const OHNE_BELEG: KeinBeleg[] = [
  {
    id: "PP-8fa9ca",
    betrifft:
      "«mit magnetischen Löffeln richteten Wahrsager Häuser und Gräber günstig aus»",
    grund:
      "Die Wahrsage-Herkunft des Kompasses ist in der Fachliteratur (Needham) belegt, aber wir haben keine frei zugängliche deutschsprachige Seite gefunden, die genau den Löffel-Kompass der Wahrsager beschreibt. Der Wikipedia-Artikel «Kompass» erwähnt ihn nur beiläufig. Bis eine tragfähige Quelle da ist, bleibt die Stelle ohne Link.",
    notiert: "2026-07-26",
  },
  {
    id: "PP-8fa9ca",
    betrifft: "«der Legende nach auch Napoleon und Benjamin Franklin»",
    grund:
      "Steht so nicht in diesem Block, sondern beim Schachtürken; hier nur als Hinweis, dass Legenden-Zuschreibungen grundsätzlich keinen Beleg bekommen. Sie sind im Text bereits als Legende gekennzeichnet.",
    notiert: "2026-07-26",
  },
  {
    id: "VA-03d91c",
    betrifft: "Geopolitik: «Seit Januar 2026 werden bestimmte Ausfuhren wieder fallweise geprüft»",
    grund:
      "Die US-Behörde BIS veröffentlicht solche Kurswechsel als Pressemitteilungen, deren Adressen sich ändern. Wir haben keine dauerhaft stabile, frei zugängliche Seite gefunden, die den Stand von Januar 2026 belegt. Statt einen Link zu setzen, der bald ins Leere führt, bleibt die Stelle unbelegt und trägt im Text ihr Standdatum.",
    notiert: "2026-07-26",
  },
  {
    id: "VA-2907aa",
    betrifft: "Zugang: Gratisstufe gegenüber Abo bei den grossen Chatbots",
    grund:
      "Die Preis- und Limitseiten der Anbieter ändern sich laufend, ein Beleg wäre in Monaten falsch. Der Text nennt darum kein einzelnes Produkt mehr und trägt das Standdatum 2026. Absichtlich ohne Link.",
    notiert: "2026-07-26",
  },
];

/** Alle Belege eines Textblocks. */
export function belegeVon(id: string): Beleg[] {
  return BELEGE.filter((b) => b.id === id);
}

/** Anker → Beleg, längste Anker zuerst, damit sie beim Suchen gewinnen. */
export const BELEG_NACH_ANKER: [string, Beleg][] = BELEGE.map(
  (b) => [b.anker, b] as [string, Beleg],
).sort((a, b) => b[0].length - a[0].length);
