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
];

/** Alle Belege eines Textblocks. */
export function belegeVon(id: string): Beleg[] {
  return BELEGE.filter((b) => b.id === id);
}

/** Anker → Beleg, längste Anker zuerst, damit sie beim Suchen gewinnen. */
export const BELEG_NACH_ANKER: [string, Beleg][] = BELEGE.map(
  (b) => [b.anker, b] as [string, Beleg],
).sort((a, b) => b[0].length - a[0].length);
