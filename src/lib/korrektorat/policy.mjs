/**
 * Korrektorat — Regelwerk: **was** ist ein korrigierbarer Text und **wie**
 * heisst er im Formular.
 *
 * Der Parser ([parser.mjs](./parser.mjs)) kennt keine einzelne Komponente. Er
 * folgt den Listen in dieser Datei. Wer eine neue Komponente mit neuen
 * Text-Props baut, ergänzt hier — nicht im Parser.
 *
 * Grundhaltung, aus dem 10mio-Korrektorat übernommen: **im Zweifel nicht
 * anzeigen**. Ein technischer Wert, den der Korrektor bearbeiten kann, ist ein
 * kaputtes Lernset. Ein Text, den er nicht sieht, ist bloss ein Tippfehler, der
 * bleibt.
 */

/**
 * Objekt-Schlüssel, deren Werte technisch sind: IDs, Pfade, Kennungen, Tokens.
 * Gilt auch für den ganzen Teilbaum darunter (`prefixe: [...]`).
 */
export const SKIP_KEYS = new Set([
  // Kennungen
  "id",
  "ids",
  "key",
  "slug",
  "sourceKey",
  "spurId",
  "spurKey",
  "prefixe",
  "pollId",
  "poll",
  "deckId",
  "lessonId",
  "moduleId",
  "blockId",
  "anker", // muss wörtlich im Text vorkommen — Änderung bricht den Beleg
  "prefix",
  "praefix",
  "storageKey",
  "speicherKey",
  "namespace",
  // Medien / Netz
  "src",
  "href",
  "url",
  "videoId",
  "youtubeId",
  "urn",
  "target",
  "rel",
  "pfad",
  "datei",
  // Darstellung
  "icon",
  "iconName",
  "emoji",
  "className",
  "class",
  "style",
  "layout",
  "accent",
  "farbe",
  "color",
  "variant",
  "kind",
  "art",
  "typ",
  "type",
  // Technik / Logik
  "from",
  "to",
  "start",
  "end",
  "correctIndices",
  "correctAnswer",
  "richtig",
  "punkte",
  "gewicht",
  "min",
  "max",
  "schritt",
  "geprueft", // ISO-Datum der Belegprüfung
]);

/**
 * JSX-Attribute sind **Allowlist**, nicht Blocklist: ein Grossteil aller
 * Attribute im Repo ist `className`, `href` oder `aria-hidden`. Nur was hier
 * steht, wird dem Korrektor gezeigt.
 */
export const JSX_TEXT_ATTRS = new Set([
  "text",
  "titel",
  "title",
  "untertitel",
  "subtitle",
  "unterzeile",
  "label",
  "bereichLabel",
  "achseLinks",
  "achseRechts",
  "leftLabel",
  "rightLabel",
  "frage",
  "aussage",
  "antwort",
  "hinweis",
  "lead",
  "intro",
  "beschreibung",
  "description",
  "kurz",
  "wort",
  "begriff",
  "name",
  "alt",
  "caption",
  "platzhalter",
  "placeholder",
  "cta",
  "buttonLabel",
  "aria-label",
  "note",
  "notiz",
]);

/**
 * Schlüssel, deren Wert längere Prosa ist. Steuert nur die Höhe des Feldes im
 * Editor — inhaltlich behandelt der Parser alle Texte gleich.
 */
export const MARKDOWN_KEYS = new Set([
  "absaetze",
  "beispiel",
  "beschreibung",
  "description",
  "einordnung",
  "erklaerung",
  "feedback",
  "feedbackFalsch",
  "feedbackRichtig",
  "geschichte",
  "hilft",
  "hintergrund",
  "info",
  "intro",
  "lead",
  "leadMehr",
  "lernziele",
  "mehr",
  "situation",
  "stelle",
  "text",
  "verunsicherung",
  "aktivitaet",
  "wasKommt",
]);

/**
 * Deutsche Feldbeschriftungen. Was hier fehlt, erscheint mit dem
 * Schlüsselnamen — kein Fehler, nur weniger schön.
 */
export const LABELS = {
  absaetze: "Absatz",
  achseLinks: "Achse links",
  achseRechts: "Achse rechts",
  aktivitaet: "Was du tust",
  alt: "Bildbeschreibung",
  antwort: "Antwort",
  aussage: "Aussage",
  begriff: "Begriff",
  beispiel: "Beispiel",
  beschreibung: "Beschreibung",
  bereichLabel: "Bereichsname",
  caption: "Bildunterschrift",
  contextNote: "Im Kontext der Zeit",
  credit: "Bildquelle",
  cta: "Knopfbeschriftung",
  description: "Beschreibung",
  einordnung: "Kontext & Einordnung",
  epoche: "Epoche",
  erklaerung: "Erklärung",
  feedback: "Rückmeldung",
  feedbackFalsch: "Rückmeldung (falsch)",
  feedbackRichtig: "Rückmeldung (richtig)",
  frage: "Frage",
  geschichte: "Geschichte",
  gruppe: "Gruppe",
  hilft: "Was dir das jetzt hilft",
  hintergrund: "Hintergrund zum Bild",
  hinweis: "Hinweis",
  info: "Zur Philosophie",
  intro: "Einleitung",
  jahr: "Jahr",
  ki: "KI-Bezug",
  kurz: "Kurzlabel",
  label: "Beschriftung",
  lead: "Einleitung",
  leadMehr: "Mehr wissen",
  leben: "Lebensdaten",
  leitfrage: "Leitfrage",
  lernziele: "Lernziel",
  mehr: "Mehr lesen",
  name: "Name",
  note: "Notiz",
  notiz: "Notiz",
  optionen: "Antwortoption",
  placeholder: "Platzhalter",
  platzhalter: "Platzhalter",
  quelle: "Quelle",
  situation: "Situation",
  span: "Zeitraum",
  stelle: "Stelle in der Quelle",
  subtitle: "Untertitel",
  text: "Text",
  these: "These",
  title: "Titel",
  titel: "Titel",
  unterzeile: "Unterzeile",
  untertitel: "Untertitel",
  verunsicherung: "Verunsicherung",
  wasKommt: "Was kommt",
  werk: "Werk",
  wort: "Wort",
};

/**
 * Schlüssel, die einen Eintrag **benennen**. Findet der Parser einen davon in
 * einem Objekt, wird der Wert zur Abschnittsüberschrift für alle Felder dieses
 * Objekts — so wird die Seitenleiste im Editor lesbar («Quipu: Knoten der
 * Anden» statt «BILDER_STORY[0]»). Reihenfolge = Priorität.
 */
export const TITLE_KEYS = ["titel", "title", "epoche", "begriff", "name", "wort", "frage", "label"];

/** JSX-Komponenten, deren `titel`-Attribut einen Abschnitt eröffnet. */
export const SECTION_COMPONENTS = new Set([
  "Abschnitt",
  "AbschnittKopf",
  "Ausklapptext",
  "AkkordeonGruppe",
  "AkkordeonPosten",
  "Aufgabe",
  "VideoImpuls",
  "SammelAccordion",
  "InfoPunkt",
]);

/** JSX-Tags, deren Textinhalt eine Überschrift ist (setzt den Abschnitt). */
export const HEADING_TAGS = new Set(["h1", "h2", "h3"]);

/**
 * Grossgeschriebene Konstanten mit sprechendem Abschnittsnamen. Was hier fehlt,
 * wird aus dem Namen abgeleitet (`BILDER_STORY` → «Bilder Story»).
 */
export const CONST_SECTIONS = {
  AUFTAKT_LERNZIEL: "Lernziel-Karte (Auftakt)",
  AUFTAKT_LERNZIEL_V3: "Lernziel-Karte (Auftakt)",
  AUFTAKT_SKALA_POLLS: "Auftakt: Skalen-Abstimmungen",
  AUFTAKT_SWIPE_KARTEN: "Auftakt: Swipe-Karten",
  AUFTAKT_SWIPE_STATION: "Auftakt: Swipe-Station",
  BADGE_FAMILIEN: "Badge-Familien",
  BAUSTEINE: "Bausteine",
  BEREICHE: "Wege der Orientierung (Bereiche)",
  BELEGE: "Belege (geprüfte Quellen)",
  BILDER_STORY: "Bilderstrecke zur KI-Geschichte",
  BLICK_OPTIONEN: "Blickrichtungen",
  EPOCHEN: "Die acht Epochen",
  FAKTEN_FALSCH: "Faktenprüfung: falsche Behauptungen",
  GLOBAL_AXIS: "Globale Positions-Achse",
  GLOSSAR: "Glossar (Hover-Erklärungen)",
  KONTEXTE: "Die KI im Kontext",
  LANDKARTE_ACHSEN: "Landkarte: Achsen",
  MERKMALE: "Merkmale der neuen Akteurin",
  NUTZUNG_OPT: "Antwortoptionen: Nutzung",
  OPENER_FRAGE: "Hype-Opener",
  OPENER_MEDIA: "Hype-Opener: Video",
  OPENER_SCHWANZ: "Hype-Opener: Nachspann",
  OPENER_SCHWANZ_KARTEN: "Hype-Opener: Nachspann-Karten",
  PRE_POLL_FRAGE: "Positions-Abstimmung (vorher)",
  PROFIL_LABEL: "Profil-Beschriftungen",
  PROFIL_LABELS: "Profil-Beschriftungen",
  QUIZ_BEZUG: "Quiz-Bezüge",
  STATION_BADGES: "Badges je Station",
  STATIONEN_V3: "Die sieben Stationen",
  STIMMUNG_DECK_POST: "Stimmungsbild (nachher)",
  STIMMUNG_DECK_PRE: "Stimmungsbild (vorher)",
  STIMMUNG_VORHER: "Stimmungsbild (vorher)",
  STUFEN_OPTIONEN: "Antwortoptionen: Stufen",
  SUBPAGE_LABEL: "Beschriftungen der Unterseiten",
  TERME: "Begriffe im Gewebe",
  VERTRAUEN_OPT: "Antwortoptionen: Vertrauen",
  VORWISSEN_FRAGE: "Vorwissens-Abfrage",
  VORWISSEN_OPTIONEN: "Vorwissens-Abfrage",
  WISSEN_CHECKS: "Wissen-Checks",
  ZUKUNFT_OPT: "Antwortoptionen: Zukunft",
  unit: "Modul-Konfiguration",
};

/**
 * Sieht der Wert nach Technik statt nach Inhalt aus? Zweite Verteidigungslinie
 * hinter {@link SKIP_KEYS} — greift auch bei Schlüsseln, die niemand auf die
 * Liste gesetzt hat.
 */
export function istTechnisch(wert) {
  const s = wert.trim();
  if (s.length < 2) return true;
  // Kennung / Slug / Icon-Name / Speicher-Präfix: keine Leerzeichen, nur
  // Kleinbuchstaben-Technik (auch mit offenem Trennzeichen am Ende).
  if (!/\s/.test(s) && /^[a-z0-9]+([-_:.]+[a-z0-9]*)*$/.test(s)) return true;
  // Pfade, URLs, Anker, Data-URIs
  if (/^(https?:|\/\/|\/|\.\/|\.\.\/|#|data:|mailto:|tel:)/.test(s)) return true;
  // Reine Zahlen, Masse, Farben, Daten
  if (/^[\d\s.,:+×–-]*$/.test(s)) return true;
  if (/^#[0-9a-f]{3,8}$/i.test(s)) return true;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return true;
  // Tailwind-Klassenketten
  if (istKlassenkette(s)) return true;
  // Kein einziger Buchstabe = kein Text
  if (!/[A-Za-zÄÖÜäöüß]/.test(s)) return true;
  return false;
}

/** Mehrere Tokens, alle im Tailwind-Format — z.B. «mt-lg flex text-body-md». */
function istKlassenkette(s) {
  const tokens = s.split(/\s+/);
  if (tokens.length < 2) return false;
  const tailwindish = /^[a-z0-9:!\[\]/.%-]+$/;
  if (!tokens.every((t) => tailwindish.test(t))) return false;
  return /(^|\s)(text-|bg-|border|flex|grid|gap-|mt-|mb-|ml-|mr-|p[xytblr]?-|m[xytblr]?-|w-|h-|max-|min-|rounded|absolute|relative|items-|justify-|hover:|md:|sm:|lg:)/.test(
    s,
  );
}

/** Feldart für die Darstellung: kurzes Feld oder Fliesstext-Feld. */
export function kindFor(key, wert) {
  if (MARKDOWN_KEYS.has(key)) return "markdown";
  if (wert.length > 140) return "markdown";
  if (wert.includes("\n")) return "markdown";
  return "text";
}

/** Deutsche Beschriftung für einen Schlüssel. */
export function labelFor(key) {
  return LABELS[key] || key;
}

/** `BILDER_STORY` → «Bilder Story»; `unit` → «Unit». */
export function humanizeConst(name) {
  if (CONST_SECTIONS[name]) return CONST_SECTIONS[name];
  return name
    .split(/[_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}
