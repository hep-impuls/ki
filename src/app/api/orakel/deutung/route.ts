import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * POST { stil, aktivitaet } → { text } | { grund }
 *
 * Das persönliche Orakel: die KI deutet in wenigen Sätzen die EIGENE Aktivität
 * der lernenden Person in diesem Modul — in einem von drei Stilen
 * (wissenschaftlich, literarisch, fantastisch).
 *
 * Datenschutz: Der Browser schickt eine Zusammenfassung der Aktivität (Zähler,
 * Bewertungs-Verteilungen, Blickwahl, Titel der gewählten Inhalte) — keinen
 * Namen, keinen Code, keine Einzeltexte. Weil die Zusammenfassung zu EINER
 * Person gehört, ist sie pseudonym und nicht anonym; das UI benennt sie so
 * (siehe OrakelDashboard, Abschnitt «Datenschutz»). Die Deutung wird auf
 * ausdrückliche Anfrage erzeugt (Knopfdruck), nicht gecacht, und kein Wert wird
 * serverseitig gespeichert. Modell: claude-haiku-4-5
 * (günstigstes geeignetes Modell, Projektvorgabe); Aufruf per fetch, weil
 * package.json geteilt ist (kein neues Paket ohne Absprache).
 */

const MODELL = "claude-haiku-4-5";

type Stil = "wissenschaftlich" | "literarisch" | "fantastisch" | "interesse";

interface Aktivitaet {
  knotenDu: number;
  knotenGesamt: number;
  bereiche: { label: string; du: number; total: number }[];
  wuensche: number;
  kombinationen: number;
  bilder: number;
  videos: number;
  relevanzStark: number;
  relevanzKaum: number;
  technikFroh: number;
  technikAbschaffen: number;
  verunsichertNochHeute: number;
  philoHilft: number;
  philoKeinSinn: number;
  gestaltDeutlich: number;
  blickWahl: string | null;
  flaechenGefuellt?: number;
  flaechenTotal?: number;
  interessen?: { bereich: string; labels: string[] }[];
  /**
   * Besuche je LERNSEITE (nicht je Bereich), für Absatz 1 der ersten Stimme.
   * Der Browser summiert selbst, damit «auf welcher Seite warst du vor allem
   * aktiv» eine gelesene Zahl ist und keine Rechnung im Modell.
   */
  seiten?: { label: string; du: number; total: number }[];
  /** Selbst markierte Punkte («Das verfolge ich weiter»), für Absatz 3. */
  weiterverfolgt?: { abschnitt: string; titel: string[] }[];
  /**
   * Haltungs-Urteile mit Titel, gruppiert nach Etikett («froh über diese
   * Technik», «hätte es nie gebraucht», «hilft mir heute», …). Grundlage für
   * die zweite Stimme: ohne das Woran wäre jede Begründung erfunden.
   */
  haltung?: { urteil: string; titel: string[] }[];
  /**
   * Die anonymen Sammelzahlen, damit die Deutung «du im Verhältnis zu allen»
   * sagen kann (Christofs Vorgabe 2026-08-09). Vorher sah die KI nur die eigenen
   * Zahlen und daneben das MÖGLICHE Total; ein Satz wie «du bist tiefer gegangen
   * als die meisten» war ihr darum verwehrt.
   *
   * Optional: Sind die Zähler noch nicht geladen, fehlt das Feld, und die
   * Deutung fällt auf die reine Eigensicht zurück.
   */
  alle?: {
    /** Verteilung der Blick-Umfrage. Eine Stimme pro Gerät, also echt pro Person. */
    blick: { label: string; stimmen: number }[];
    blickStimmen: number;
    /** Besuche je Bereich, summiert über alle. NICHT pro Person. */
    bereiche: { label: string; besuche: number }[];
  };
}

/**
 * Der Vergleich «du im Verhältnis zu allen» (Christofs Vorgabe 2026-08-09).
 *
 * Was erlaubt ist und was nicht, hängt an der Art der Zahl, und das ist die
 * ganze Schwierigkeit:
 *
 *  · Die BLICK-Umfrage ist eine Stimme pro Gerät. Sie ist damit echt pro Person
 *    und erlaubt Sätze wie «die meisten blicken neugierig, du kritisch».
 *  · Die BEREICHS-Besuche sind Summen über alle Teilnehmenden. Wie viele
 *    Personen dahinterstehen, wissen wir NICHT (die Zähler sind anonym und
 *    zählen Klicks, nicht Köpfe). Ein Durchschnitt pro Person ist daraus nicht
 *    berechenbar, und «du liegst über dem Durchschnitt» wäre erfunden.
 *    Zulässig ist der Vergleich der SCHWERPUNKTE: was bei allen vorn liegt
 *    gegenüber dem, worauf sich diese Person konzentriert hat.
 *
 * Ohne diese Grenze rechnet ein Modell die Summe bereitwillig in einen
 * Durchschnitt um und behauptet eine Rangfolge, die die Daten nicht tragen.
 *
 * Der Satz ist ausdrücklich als PFLICHT formuliert. Die erste Fassung sagte
 * «stell einen Bezug her, aber höchstens in einem Satz» — und im Budget von 60
 * bis 90 Wörtern fiel genau dieser Satz als erster weg. Auf Production kam eine
 * tadellose Eigendeutung zurück, in der die anderen nicht vorkamen. Eine
 * Kann-Bestimmung neben einer knappen Wortzahl ist keine Regel.
 */
/** Gilt für beide Stimmen: was man aus Klick-Summen nicht schliessen darf. */
const VERGLEICH_GRENZE =
  " Die Zahlen aller sind Summen über alle und zählen Klicks, nicht Personen. " +
  "Rechne daraus KEINEN Durchschnitt pro Person, behaupte keinen Rang und " +
  "schreib nie, jemand sei besser, schneller oder fleissiger als andere. " +
  "Beschreib einen Unterschied sachlich und ohne Wörter wie «ignorieren», " +
  "«vernachlässigen» oder «auslassen»; ein anderer Schwerpunkt ist kein " +
  "Versäumnis, und eine andere Haltung ist keine Abweichung. Stehen unter der " +
  "Überschrift ZUM VERGLEICH keine Zahlen, dann erwähne die anderen überhaupt " +
  "nicht.";

/**
 * Vergleichssatz der ERSTEN Stimme: Schwerpunkte, du gegenüber allen.
 *
 * Hier gehört er hin, denn diese Stimme sagt ohnehin, wo jemand war. Der
 * Spitzenreiter aller wird ausdrücklich genannt, damit das Modell ihn nicht aus
 * acht Zahlen selbst herauslesen muss (das ging am 2026-08-09 schief).
 */
const VERGLEICH_ERSTE =
  " Ist unter der Überschrift ZUM VERGLEICH ein Bereich als der bei allen " +
  "häufigste genannt, dann MUSS genau ein Satz im zweiten Absatz diesen Bezug " +
  "herstellen, also den Schwerpunkt aller neben den eigenen stellen. Nicht mehr " +
  "als ein Satz, aber dieser eine fehlt nie. Verlass dich auf den genannten " +
  "Spitzenreiter und ermittle ihn nicht selbst aus den Zahlen." +
  VERGLEICH_GRENZE;

/**
 * Vergleichssatz der ZWEITEN Stimme: nur die Blick-Umfrage, und nur wenn die
 * Person selbst gewählt hat.
 *
 * Der Grund ist die Arbeitsteilung. Die zweite Stimme soll die Haltung deuten
 * und ausdrücklich NICHT nachzählen, wo geklickt wurde. Der frühere gemeinsame
 * Vergleichssatz verlangte aber genau das, weil der Bereichs-Vergleich der
 * einzige immer verfügbare war. Zwei Anweisungen, die einander ausschliessen,
 * ergeben keinen Kompromiss, sondern Zufall.
 *
 * Und die Bedingung ist die eigene Wahl, nicht das Vorhandensein der Umfrage:
 * Ohne eigene Grundhaltung gibt es kein «du gegenüber den anderen», sondern nur
 * eine Fremdstatistik.
 */
const VERGLEICH_ZWEITE =
  " Ist eine selbst gewählte Grundhaltung angegeben UND stehen unter der " +
  "Überschrift ZUM VERGLEICH Zahlen zur Umfrage «Wie blickst du heute auf KI», " +
  "dann stell in genau einem Satz die eigene Haltung neben die häufigste der " +
  "anderen. Fehlt eines von beiden, lass diesen Satz weg. Vergleiche NICHT, " +
  "wo überall geklickt wurde; das ist die Aufgabe der anderen Stimme." +
  VERGLEICH_GRENZE;

/**
 * Typografie-Regel für JEDEN erzeugten Text (Christofs Vorgabe 2026-08-09).
 *
 * Gedankenstrich und beiläufiger Doppelpunkt sind die zwei Zeichen, an denen man
 * maschinell erzeugten Text sofort erkennt. In den handgeschriebenen Texten des
 * Lernsets werden sie längst vermieden; hier entsteht der Text erst zur
 * Laufzeit, also muss die Regel in die Anweisung.
 *
 * Nicht absolut: «nur dort, wo es nötig ist». Ein Doppelpunkt vor einer echten
 * Aufzählung bleibt richtig.
 *
 * Der letzte Satz ist der wichtigste und der am leichtesten zu übersehen: Die
 * Zahlen kommen als «Feld: Wert»-Zeilen. Ein Modell spiegelt den Stil seiner
 * Eingabe, und genau daraus entstand der doppelpunktreiche Ton. Aus demselben
 * Grund sind die Gedankenstriche AUS DEN ANWEISUNGEN SELBST entfernt — eine
 * Regel gegen Gedankenstriche, die in einem Text voller Gedankenstriche steht,
 * hebt sich auf.
 */
const ZEICHEN =
  " Setze KEINE Gedankenstriche, also kein «—» und kein «–». Wo du einen " +
  "setzen würdest, nimm ein Komma, einen Punkt oder ein Bindewort. " +
  "Doppelpunkte nur, wenn danach wirklich eine Aufzählung oder ein Zitat " +
  "folgt, nie als Stilmittel für eine Pause. Die Zahlen werden dir in Zeilen " +
  "der Form «Feld: Wert» übergeben; übernimm diese Schreibweise nicht in " +
  "deinen Text, sondern schreib in ganzen Sätzen. Trägt ein Titel in " +
  "Anführungszeichen selbst einen Doppelpunkt, lass ihn unverändert stehen; er " +
  "gehört zum Titel und ist keine Stilpause. Setze auch keine Sternchen und " +
  "keine Wörter in Grossbuchstaben.";

/**
 * Aufgabe der ZWEITEN Stimme, gleich für alle drei Stile (Christofs Vorgabe
 * 2026-08-09): nicht mehr die Aktivität beschreiben, sondern die Frage «was für
 * ein KI-Typ bist du, wie gehst du mit der KI in die Zukunft».
 *
 * Die Arbeitsteilung ist der Punkt. Die erste Stimme sagt, WO jemand war und WAS
 * er gewählt hat. Beschrieb die zweite dasselbe nochmals, waren es zwei
 * Antworten auf eine Frage. Jetzt liest sie aus denselben Klicks eine HALTUNG.
 *
 * Drei Schranken, die das Urteil tragen müssen:
 *
 *  · **Es ist eine Lesart, kein Befund.** Wir kennen Klicks, nicht Menschen.
 *    Darum muss der Text sagen, woraus er schliesst, und offenlassen, dass es
 *    auch anders sein kann. Ein Lernset ohne Noten darf niemandem einen
 *    Charakter zuschreiben.
 *  · **Die Begründung braucht das Woran.** Die Zähler sagen, WIE VIEL jemand als
 *    «froh über diese Technik» einordnete, nicht WORAN. Deshalb gehen die Titel
 *    mit, und deshalb wird verlangt, sie zu nennen. Ohne sie klingt jede
 *    Begründung plausibel und ist doch leer.
 *  · **Zu wenig Spuren heisst zu wenig Spuren.** Fehlen die Einordnungen, ist die
 *    ehrliche Antwort, das zu sagen und den Weg zu zeigen. Ein geratener Typ ist
 *    schlimmer als keiner, weil er wie ein Ergebnis aussieht. Die Bedingung hängt
 *    darum an den TITELN, nicht an den Zählern: `technikFroh` und Verwandte
 *    stehen immer im Bericht, die Titel nur, wenn die Registry sie kennt. Wäre
 *    die Ausnahme an den Zählern festgemacht, griffe sie nie.
 *
 * Und die inhaltlich wichtigste Schranke, erst durch eine adversarische Prüfung
 * gefunden: **die Einordnungen gelten nicht der KI.** «Froh über diese Technik»
 * kommt aus dem Epochen-Baustein und meint den Pflug, den Buchdruck, die
 * Dampfmaschine; «hilft mir heute» meint eine philosophische Sichtweise. Aus
 * einem Urteil über den Pflug einen KI-Typ zu machen, ist ein Fehlschluss, und
 * ein Fehlschluss in gepflegter Sprache liest sich wie ein Befund. Zulässig ist
 * nur die schwächere, ehrliche Aussage: So blickt diese Person auf Wandel
 * überhaupt, und das könnte für ihren Blick auf die KI etwas bedeuten. Die
 * einzige Angabe, die wirklich der KI gilt, ist die selbst gewählte
 * Grundhaltung; darum ist sie die Hauptquelle.
 */
const KI_TYP =
  " DEINE AUFGABE ist die Frage, wie diese Person mit der KI in die Zukunft " +
  "geht, also was für ein KI-Typ sie ist. " +
  "PRÜFE ZUERST die Datenlage. Steht im Bericht «Keine eigene Grundhaltung zur " +
  "KI gewählt» UND «Keine einzelnen Inhalte eingeordnet», dann rate nicht. " +
  "Schreib dann NUR, dass die Spuren für diese Frage noch nicht reichen, und " +
  "nenn die drei Stellen, an denen sich die Haltung zeigen lässt, nämlich die " +
  "Umfrage «Wie blickst du heute auf KI» gleich oberhalb dieser Deutung, die " +
  "Bewertungen im «Teppich des Wandels» und die Einordnungen in «Philosophie in " +
  "Zeiten der Verunsicherung». Dieser Text ist dann kurz, nämlich zwei bis drei " +
  "Sätze, und das ist richtig so. Deute in diesem Fall nichts und nenn keine " +
  "Inhalte. " +
  "Steht dagegen eine Grundhaltung oder eine Einordnung da, gilt das Folgende. " +
  "Sag im ERSTEN Satz, wie diese Person auf die KI blickt, ob eher " +
  "zuversichtlich, eher besorgt oder beides zugleich. Ohne diesen Satz ist die " +
  "Antwort unbrauchbar. " +
  "Woraus du schliessen darfst, und woraus nicht, ist hier entscheidend. " +
  "Ist eine SELBST GEWÄHLTE GRUNDHALTUNG angegeben, ist sie deine Hauptquelle. " +
  "Gib sie mit dem angegebenen Wort wieder, also neugierig, pragmatisch, " +
  "kritisch oder gemischt, und press sie nicht in ein Entweder-oder aus gut und " +
  "gefährlich. " +
  "Die Einordnungen «froh über diese Technik» und «hätte es nie gebraucht» " +
  "betreffen NICHT die KI, sondern Techniken früherer Zeiten, und «hilft mir " +
  "heute» und «ergibt für mich keinen Sinn» betreffen philosophische " +
  "Sichtweisen. Behandle sie darum als das, was sie sind, nämlich als Muster, " +
  "wie diese Person auf technischen und geistigen Wandel überhaupt blickt, und " +
  "sag das auch so. Schreib zum Beispiel, dass jemand bei früheren Techniken " +
  "eher das Gewinnende gesehen hat, und was das für seinen Blick auf die KI " +
  "bedeuten könnte. Behaupte NIE, ein Urteil über eine frühere Technik sei ein " +
  "Urteil über die KI. " +
  "Nenn ein bis zwei dieser Einordnungen. Heisst ein Titel nur «Epoche mal " +
  "Rubrik», etwa «Antike · Technologie», dann gib ihn in eigenen Worten wieder " +
  "als «die Technik der Antike» und erfinde keine Technik dazu, die nicht " +
  "dasteht. " +
  "Schliess mit einem Satz dazu, wie sie mit der KI in die Zukunft geht. " +
  "Halt drei Dinge ein. ERSTENS, es ist eine Lesart ihrer Klicks und kein " +
  "Befund über sie; sag das im ersten Satz mit einer Wendung wie «so wie es " +
  "aussieht» und lass offen, dass es auch anders sein kann. Formulier keine " +
  "Aussage über ihr Wesen, sondern über das, was ihre Spuren zeigen. ZWEITENS, " +
  "gib ihr kein Etikett, das wertet, und stell keine Haltung über eine andere; " +
  "Zuversicht ist nicht besser als Sorge, und Sorge ist nicht klüger als " +
  "Zuversicht. DRITTENS, stell nie dar, dass etwas fehlt oder versäumt wurde. " +
  "Keine Wendung, die ein Nicht-Angeschautes als Mangel zeichnet, also weder " +
  "«ignoriert» noch «vernachlässigt», «ausgelassen», «links liegen gelassen» " +
  "oder «kaum beachtet». Sag, wo der Schwerpunkt liegt, nicht, wo er fehlt. " +
  "Zum Schluss zwei Formsachen. Verwende für Titel die Zeichen « und », keine " +
  "geraden Anführungszeichen. Und schreib nichts über Zahlen, die nicht im " +
  "Bericht stehen; erfinde keine Anzahl von Kapiteln, Lektionen oder Epochen.";

const STIL_SYSTEM: Record<Stil, string> = {
  wissenschaftlich:
    [
      "Du bist das Orakel eines Lernmoduls über KI und Philosophie an einer",
      "Berufsfachschule. Antworte EINER Person nüchtern und analytisch, wie eine",
      "knappe, sachliche Einschätzung. Sprich sie mit «du» an. Keine",
      "Schmeichelei, keine erfundenen Fakten über die Angaben hinaus. 80 bis 120",
      "Wörter, Deutsch, Schweizer Rechtschreibung (ss statt ß), ein",
      "zusammenhängender Absatz, keine Aufzählung.",
    ].join(" ") + KI_TYP,
  literarisch:
    [
      "Du bist das Orakel eines Lernmoduls über KI und Philosophie. Antworte",
      "EINER Person literarisch, als kleinen, bildhaften Prosatext. Sprich sie",
      "mit «du» an, nutze Metaphern (Fäden, Wege, Licht, Muster), bleibe aber an",
      "den tatsächlichen Angaben. Keine erfundenen Fakten. 80 bis 120 Wörter,",
      "Deutsch, Schweizer Rechtschreibung (ss statt ß), ein zusammenhängender",
      "Absatz, poetisch, aber nicht kitschig.",
    ].join(" ") + KI_TYP,
  fantastisch:
    [
      "Du bist ein altes, sehendes Orakel, mythisch, geheimnisvoll, feierlich.",
      "Vor dich getreten ist EINE Person. Sprich sie mit «du» an, in",
      "orakelhaftem, fantastischem Ton (Sterne, Schwellen, verborgene Pfade,",
      "Weissagung), aber bleibe an den tatsächlichen Angaben und erfinde keine",
      "Fakten. 80 bis 120 Wörter, Deutsch, Schweizer Rechtschreibung (ss statt",
      "ß), ein zusammenhängender Absatz. Der Schlusssatz über den Weg in die",
      "Zukunft ist zugleich deine Weissagung; sprich ihn als Möglichkeit, nicht",
      "als Gewissheit, denn eine Weissagung darf nicht mehr behaupten, als die",
      "Spuren tragen.",
    ].join(" ") + KI_TYP,
  interesse: [
    "Du bist das Orakel eines Lernmoduls über KI und Philosophie an einer",
    "Berufsfachschule. Sprich die Person mit «du» an, freundlich und klar.",
    "Stütze dich NUR auf die übergebenen Angaben und erfinde nichts.",
    "Schreib GENAU DREI ABSÄTZE, getrennt durch eine leere Zeile, in dieser",
    "Reihenfolge und ohne Überschriften.",
    "Im ERSTEN Absatz sagst du, wo sie am meisten angeschaut hat. Nimm dafür die",
    "Seite, die dir als aktivste genannt wird, und sag mit den Zahlen, wie viel sie",
    "dort und wie viel sie auf der anderen Seite angeschaut hat. Steht im Bericht,",
    "dass keine Seite vorn liegt, dann sag genau das.",
    "Im ZWEITEN Absatz sagst du, was sie bevorzugt hat. Greif zwei bis drei der",
    "«Ausgewählten Inhalte» beim Namen auf und sag, was daran ihr Interesse zeigt.",
    "Hat sie vor allem Flächen geknüpft und wenig Inhalte gewählt, nenn das",
    "freundlich ein spielerisches Erkunden der Muster.",
    "Im DRITTEN Absatz sagst du, was sich für sie noch lohnt. Mach zwei bis drei",
    "konkrete Vorschläge und knüpf sie an ihre gewählten Punkte an. Nimm dafür",
    "die Bereiche, die im Bericht als noch nicht besucht aufgeführt sind. Hat sie",
    "Punkte mit «Das verfolge ich weiter» markiert, greif diese zuerst auf. Du",
    "darfst NUR Bereiche und Titel nennen, die im Bericht vorkommen; empfiehl",
    "nichts, was sie schon vollständig gesehen hat, und nimm nie einen Namen aus",
    "den Zahlen der anderen als Empfehlung für sie.",
    "Schreib in EINFACHER SPRACHE. Kurze Sätze mit höchstens fünfzehn Wörtern.",
    "Ein Gedanke pro Satz. Alltagswörter statt Fachwörter; brauchst du doch ein",
    "Fachwort, erklär es in drei bis vier Wörtern. Sag «du hast … angeschaut» und",
    "nicht «die Auseinandersetzung mit …»; also lieber ein Tätigkeitswort als eine",
    "Wortkette. Statt «Knoten» schreib «Punkte». Keine Einschübe in Klammern.",
    "Je Absatz GENAU DREI kurze Sätze, also neun Sätze im ganzen Text. Deutsch,",
    "Schweizer Rechtschreibung (ss statt ß).",
  ].join(" "),
};

/** Titel einzeln in Anführungszeichen, damit ihr eigener Doppelpunkt sichtbar
 *  zum Titel gehört und nicht wie ein Feldtrenner aussieht. */
function zitiere(titel: string[]): string {
  return titel.map((t) => `«${t}»`).join(", ");
}

/**
 * Bericht für die ZWEITE Stimme: nur was zur Haltung gehört.
 *
 * Der wichtigste Befund der Prüfung auf Production, und er liess sich mit keiner
 * Regel beheben: Beide Stimmen bekamen denselben Bericht mit vierzehn
 * Aktivitätszeilen. Die zweite hat daraufhin die Aktivität nacherzählt, obwohl
 * `KI_TYP` das ausdrücklich verbietet, hat «alle vier Lektionen» erfunden und den
 * Rückfallweg «dann rate nicht» übersprungen, obwohl weder eine Grundhaltung noch
 * eine Einordnung vorlag.
 *
 * Ein Verbot gegen eine verlockende Vorlage verliert. Also nehmen wir die Vorlage
 * weg. Was hier fehlt, kann nicht nacherzählt werden, und wenn nichts übrig
 * bleibt, ist die einzige mögliche Antwort die ehrliche.
 *
 * Absichtlich NICHT dabei: Seiten, Bereiche, Bilder, Videos, Flächen, die
 * Merkzeichen-Titel (die gehören zum Interesse, nicht zur Haltung) und die
 * blossen Zähler wie `technikFroh`. Letztere sagen, WIE VIEL jemand eingeordnet
 * hat, nicht WORAN, und genau daraus entstand die erfundene Begründung.
 */
function baueHaltungsbericht(a: Aktivitaet): string {
  const zeilen: string[] = [
    a.blickWahl
      ? `Selbst gewählte Grundhaltung zur KI: ${a.blickWahl}.`
      : "Keine eigene Grundhaltung zur KI gewählt.",
    ...(a.haltung?.length
      ? a.haltung.map((x) => `Eingeordnet als «${x.urteil}»: ${zitiere(x.titel)}.`)
      : ["Keine einzelnen Inhalte eingeordnet."]),
    a.gestaltDeutlich > 0
      ? `KI-Merkmale, die als «deutlich» gewichtet wurden: ${a.gestaltDeutlich}.`
      : "",
    a.verunsichertNochHeute > 0
      ? `Frühere Verunsicherungen, die diese Person noch heute betreffen: ${a.verunsichertNochHeute}.`
      : "",
    ...(a.alle && a.alle.blickStimmen > 0
      ? [
          "",
          "ZUM VERGLEICH, die anonymen Zahlen ALLER Teilnehmenden:",
          `Umfrage «Wie blickst du heute auf KI» bei allen, ${a.alle.blickStimmen} ${
            a.alle.blickStimmen === 1 ? "Stimme" : "Stimmen"
          }: ${a.alle.blick.map((b) => `${b.label}: ${b.stimmen}`).join("; ")}.`,
        ]
      : []),
  ];
  return zeilen.filter(Boolean).join("\n");
}

function baueZusammenfassung(a: Aktivitaet): string {
  const bereiche = a.bereiche
    .filter((b) => b.du > 0)
    .sort((x, y) => y.du / y.total - x.du / x.total)
    .map((b) => `${b.label}: ${b.du} von ${b.total}`)
    .join("; ");
  /* Die aktivste Seite ausrechnen und benennen, nicht das Modell rechnen
     lassen. Bei Gleichstand gewinnt die zuerst genannte, das ist willkürlich
     aber harmlos; ein «gleich viel auf beiden» sagt die Regel selbst. */
  const seiten = (a.seiten ?? []).filter((s) => s.total > 0);
  const seitenRang = [...seiten].sort((x, y) => y.du - x.du);
  const fuehrend =
    seitenRang.length > 1 && seitenRang[0].du > 0
      ? seitenRang[0].du === seitenRang[1].du
        ? null
        : seitenRang[0]
      : (seitenRang[0]?.du ?? 0) > 0
        ? seitenRang[0]
        : null;
  const zeilen: string[] = [
    `Besuchte Knoten insgesamt: ${a.knotenDu} von ${a.knotenGesamt}.`,
    ...(seiten.length
      ? [
          `Besuche je Lernseite: ${seiten
            .map((s) => `${s.label}: ${s.du} von ${s.total}`)
            .join("; ")}.`,
          fuehrend
            ? `Am aktivsten war diese Person auf der Seite «${fuehrend.label}».`
            : "Auf beiden Seiten etwa gleich aktiv, keine Seite liegt vorn.",
        ]
      : []),
    bereiche ? `Verteilung auf die Bereiche: ${bereiche}.` : "Noch kaum Bereiche besucht.",
    /* Die LÜCKE ausdrücklich mitliefern, nicht nur das Erreichte. Absatz 3 der
       ersten Stimme soll sagen, was sich noch lohnt, darf aber nur Namen aus dem
       Bericht nennen. Solange nur besuchte Bereiche im Bericht standen, war
       dieser Absatz unerfüllbar: das Modell musste entweder etwas empfehlen, was
       die Person schon kennt, oder einen Namen aus den Zahlen der anderen
       nehmen, oder erfinden. Von einer adversarischen Prüfung gefunden. */
    ...(() => {
      const offen = a.bereiche.filter((b) => b.du === 0).map((b) => b.label);
      const angefangen = a.bereiche
        .filter((b) => b.du > 0 && b.du < b.total)
        /* Ohne Klammer geschrieben, weil die erste Stimme Klammer-Einschübe nicht
           verwenden darf und ein Modell die Form seiner Eingabe nachahmt.

           Und mit dem Gesehenen zuerst. Die knappere Fassung «davon 11 von 12
           noch offen» wurde auf Production zu «da fehlen dir nur noch 11 von 12
           Punkten» verdreht, was den Sinn umkehrt; nennt man erst das Gesehene,
           ist die Richtung eindeutig. */
        .map(
          (b) =>
            `${b.label}, dort ${b.du} von ${b.total} gesehen, ${b.total - b.du} noch offen`,
        );
      return [
        offen.length ? `Noch gar nicht besucht: ${offen.join("; ")}.` : "",
        angefangen.length
          ? `Angefangen, aber nicht fertig: ${angefangen.join("; ")}.`
          : "",
      ];
    })(),
    `Verbindungen/Kombinationen im Muster genutzt: ${a.kombinationen}.`,
    `Angeschaute Bilder: ${a.bilder}. Geschaute Video-Impulse: ${a.videos}.`,
    `Merkzeichen «das verfolge ich weiter»: ${a.wuensche}.`,
    `Als stark lebensrelevant markiert: ${a.relevanzStark}; als kaum relevant: ${a.relevanzKaum}.`,
    `Technologien, über die froh: ${a.technikFroh}; die man nie hätte einführen sollen: ${a.technikAbschaffen}.`,
    `Verunsicherungen, die noch heute betreffen: ${a.verunsichertNochHeute}.`,
    `Philosophische Sichtweisen, die heute helfen: ${a.philoHilft}; die keinen Sinn ergeben: ${a.philoKeinSinn}.`,
    `KI-Merkmale, die als «deutlich» gewichtet wurden: ${a.gestaltDeutlich}.`,
    `Geknüpfte Flächen im Gewebe: ${a.flaechenGefuellt ?? 0} von ${a.flaechenTotal ?? 0}.`,
    a.blickWahl ? `Selbst gewählte Grundhaltung zur KI: ${a.blickWahl}.` : "",
    ...(a.interessen?.length
      ? a.interessen.map(
          (x) => `Ausgewählte Inhalte in «${x.bereich}»: ${x.labels.join(", ")}.`,
        )
      : []),
    /* Titel in Anführungszeichen, weil manche selbst einen Doppelpunkt tragen
       («ChatGPT: der Massenmoment»). Nackt aufgelistet war für das Modell nicht
       erkennbar, wo der Feldtrenner endet und der Titel beginnt, und die
       Typografie-Regel gegen die «Feld: Wert»-Schreibweise geriet mit der Pflicht
       ins Gehege, Titel wörtlich zu nennen. */
    ...(a.weiterverfolgt?.length
      ? a.weiterverfolgt.map(
          (x) =>
            `Selbst mit «Das verfolge ich weiter» markiert, in «${x.abschnitt}»: ${zitiere(x.titel)}.`,
        )
      : []),
    /* Die Haltungs-Urteile mit ihrem Etikett, Grundlage der zweiten Stimme. */
    ...(a.haltung?.length
      ? a.haltung.map((x) => `Eingeordnet als «${x.urteil}»: ${zitiere(x.titel)}.`)
      : []),
    /* Die Sammelzahlen zuletzt und ausdrücklich benannt, damit das Modell sie
       nicht mit den eigenen Zahlen verwechselt.

       Die Bereiche gehen ABSTEIGEND hinaus und der Spitzenreiter wird eigens
       genannt. Grund: In der ersten Fassung standen sie in Seitenreihenfolge,
       und Haiku hat aus acht Zahlen den falschen Spitzenreiter gelesen (es nannte
       «Verunsicherung» mit 59 statt «KI-Story» mit 77) und diesen Irrtum als
       Tatsache in die Deutung geschrieben. Sortieren ist billig, Rechnen im
       Modell ist unzuverlässig: Was wir selbst ausrechnen können, rechnen wir
       selbst aus. */
    /* Den Kopf nur setzen, wenn wirklich Zahlen darunter stehen. Der Client
       schickt `alle` immer mit, und solange die Firestore-Zähler noch nicht da
       sind, sind beide Listen leer. Dann stand die Überschrift allein, während
       die Regel einen Vergleichssatz verlangte, und das Modell hätte ihn
       erfinden müssen. Von einer adversarischen Prüfung gefunden. */
    ...(a.alle && (a.alle.bereiche.length > 0 || a.alle.blickStimmen > 0)
      ? [
          "",
          "ZUM VERGLEICH, die anonymen Zahlen ALLER Teilnehmenden:",
          a.alle.bereiche.length
            ? `Am häufigsten besucht bei allen zusammen ist «${
                [...a.alle.bereiche].sort((x, y) => y.besuche - x.besuche)[0]
                  .label
              }».`
            : "",
          a.alle.bereiche.length
            ? `Besuche je Bereich bei allen zusammen, absteigend geordnet: ${[
                ...a.alle.bereiche,
              ]
                .sort((x, y) => y.besuche - x.besuche)
                .map((b) => `${b.label}: ${b.besuche}`)
                .join("; ")}.`
            : "",
          a.alle.blickStimmen > 0
            ? `Umfrage «Wie blickst du heute auf KI» bei allen, ${a.alle.blickStimmen} ${a.alle.blickStimmen === 1 ? "Stimme" : "Stimmen"}: ${a.alle.blick
                .map((b) => `${b.label}: ${b.stimmen}`)
                .join("; ")}.`
            : "",
        ]
      : []),
  ];
  return zeilen.filter(Boolean).join("\n");
}

/**
 * Sprachregeln für alle Stile.
 *
 * Das Modell (Haiku, günstigste Stufe) bildet im **Präteritum** unzuverlässige
 * Verbformen: «marktest» statt «markiert hast», «tastast» statt «tastest».
 * Beobachtet in einer literarischen Deutung. Die Fehler sammeln sich genau dort,
 * darum wird das Präteritum untersagt; Perfekt und Präsens sind ohnehin die
 * natürlicheren Formen im gesprochenen Deutsch. Hilft das nicht, bleibt der
 * Wechsel auf ein stärkeres Modell.
 *
 * Nachtrag 2026-08-09, Länge: Wortzahlen wirken bei diesem Modell nicht. Die
 * erste Stimme bekam «insgesamt höchstens 150 Wörter» und lieferte 167 und 203.
 * Die Satzzahl je Absatz hielt sie dagegen beide Male ein. Länge wird darum über
 * die Satzzahl gesteuert, nicht über die Wortzahl.
 *
 * Nachtrag 2026-08-09: Auch das Perfekt ist nicht überall sicher. Beobachtet
 * «du hast durcharbeitet» statt «durchgearbeitet» — bei trennbaren Präfixen
 * fällt dem Modell das «ge» heraus. Darum ausdrücklich genannt, mit dem
 * Ausweichweg, ein einfaches Verb zu nehmen.
 */
const SPRACHE =
  " Schreib in Präsens und Perfekt. VERMEIDE DAS PRÄTERITUM, also nicht " +
  "«du markiertest» oder «du tastetest», sondern «du hast markiert», «du " +
  "tastest». Ausgenommen sind die Hilfsverben sein und haben, deren Formen " +
  "«war», «warst» und «hattest» erlaubt bleiben, weil das Perfekt davon steif " +
  "klingt. Bilde nur Verbformen, die du sicher beherrschst; im Zweifel " +
  "umschreiben («du hast … gesetzt» statt einer seltenen Form). Achte bei " +
  "Verben mit trennbarem Präfix auf das «ge» im Partizip, also «du hast " +
  "durchgearbeitet», nicht «du hast durcharbeitet»; bist du unsicher, nimm ein " +
  "einfaches Verb wie «gelesen» oder «angeschaut». Keine " +
  "erfundenen Wörter und keine erfundenen Wortschöpfungen. " +
  "Schreib nicht, was die Person will, fühlt oder sicher denkt; du siehst ihre " +
  "Zahlen, nicht ihre Absichten. Also nicht «du möchtest sicher mehr wissen», " +
  "sondern «dort ist noch viel offen»." +
  /* Der Vergleichssatz sitzt NICHT mehr hier, sondern wird in deute() je Stimme
     gewählt: die erste vergleicht Schwerpunkte, die zweite nur die Blick-Umfrage. */
  ZEICHEN;

/**
 * Nur für die ERSTE Stimme: nichts dazuerfinden, und der behutsame Fall.
 *
 * Die Aufforderung, ein bis drei Inhalte namentlich aufzugreifen, stand hier
 * doppelt: Absatz 2 der ersten Stimme verlangt zwei bis drei, dieser Block ein
 * bis drei. Zwei Untergrenzen für dieselbe Pflicht sind eine Untergrenze zu
 * viel, darum steht sie jetzt nur noch dort, wo der Absatz beschrieben wird.
 *
 * Seit die zweite Stimme nach dem KI-Typ fragt (2026-08-09), darf dieser Block
 * nicht mehr an alle Stile gehen. Er verlangt genau das, was `KI_TYP` untersagt,
 * nämlich die gewählten Inhalte aufzuzählen und daraus das Interesse zu deuten.
 * Zwei Anweisungen, die einander widersprechen, ergeben keinen Kompromiss,
 * sondern Zufall.
 */
const GEMEINSAM =
  " Erfinde keine " +
  "Inhalte, die nicht in der Liste stehen. Sind viele Flächen geknüpft, aber " +
  "kaum Inhalte ausgewählt, deute das behutsam als «vor allem die Muster " +
  "bespielt», spielerisch erkundet, inhaltlich noch offen.";

async function deute(stil: Stil, zusammenfassung: string): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODELL,
        /* Reichlich bemessen. Die erste Stimme darf 150 Wörter lang werden, das
           sind auf Deutsch gut 300 Tokens; bei den früheren 350 hätte ein etwas
           längerer Text mitten im Satz geendet, und ein abgeschnittener Absatz
           sieht nicht wie ein Fehler aus, sondern wie ein schlechter Text. */
        max_tokens: 700,
        /* Der Vergleichssatz ist je Stimme ein anderer, darum hier verzweigt und
           nicht mehr in SPRACHE eingebettet. Der frühere gemeinsame Satz
           verlangte von der zweiten Stimme genau die Klick-Beschreibung, die
           `KI_TYP` ihr verbietet. */
        system:
          STIL_SYSTEM[stil] +
          (stil === "interesse" ? GEMEINSAM + VERGLEICH_ERSTE : VERGLEICH_ZWEITE) +
          SPRACHE,
        messages: [
          {
            role: "user",
            content: `Hier die Lern-Aktivität der Person:\n\n${zusammenfassung}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) {
      const fehler = await res.text().catch(() => "");
      console.error("[api/orakel/deutung] Messages API", res.status, fehler.slice(0, 300));
      return null;
    }
    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = (data.content ?? [])
      .filter((b) => b.type === "text" && typeof b.text === "string")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return text.length > 0 ? text : null;
  } catch (err) {
    console.error("[api/orakel/deutung] KI-Aufruf fehlgeschlagen", err);
    return null;
  }
}

const STILE: Stil[] = ["wissenschaftlich", "literarisch", "fantastisch", "interesse"];

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ grund: "kein-schluessel" }, { status: 200 });
    }
    const body = (await req.json().catch(() => null)) as
      | { stil?: unknown; aktivitaet?: Aktivitaet }
      | null;
    const stil = STILE.includes(body?.stil as Stil) ? (body!.stil as Stil) : null;
    const a = body?.aktivitaet;
    if (!stil || !a || typeof a !== "object") {
      return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
    }
    // Auch reines Muster-Bespielen (Flächen ohne Inhalts-Knoten) zählt.
    if ((a.knotenDu ?? 0) < 1 && (a.flaechenGefuellt ?? 0) < 1) {
      return NextResponse.json({ grund: "zu-wenig" }, { status: 200 });
    }
    /* Jede Stimme bekommt nur ihre eigenen Daten. Die erste den vollen
       Aktivitätsbericht, die zweite ausschliesslich das, was zur Haltung
       gehört. */
    const bericht =
      stil === "interesse" ? baueZusammenfassung(a) : baueHaltungsbericht(a);
    const text = await deute(stil, bericht);
    if (!text) {
      return NextResponse.json({ grund: "kein-schluessel" }, { status: 200 });
    }
    return NextResponse.json({ text });
  } catch (err) {
    console.error("[api/orakel/deutung] unerwarteter Fehler", err);
    return NextResponse.json({ error: "Interner Fehler." }, { status: 500 });
  }
}
