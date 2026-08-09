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
const VERGLEICH =
  " Sind ZUM VERGLEICH anonyme Zahlen aller Teilnehmenden angegeben, dann MUSS " +
  "genau ein Satz deines Textes diesen Bezug herstellen, und zwar gegen Ende. " +
  "Nicht mehr als ein Satz, aber dieser eine fehlt nie. Bleib streng bei dem, " +
  "was die Zahlen hergeben. Bei der Blick-Umfrage darfst du sagen, wie die " +
  "Mehrheit blickt und wie diese Person dazu steht. Bei den Bereichs-Besuchen " +
  "vergleiche nur SCHWERPUNKTE, also welcher Bereich bei allen vorn liegt und " +
  "worauf sich diese Person konzentriert hat. Diese Zahlen sind Summen über " +
  "alle und zählen Klicks, nicht Personen. Rechne daraus KEINEN Durchschnitt " +
  "pro Person, behaupte keinen Rang und schreib nie, jemand sei besser, " +
  "schneller oder fleissiger als andere. Fehlen die Vergleichszahlen, deute " +
  "nur die eigene Aktivität und erwähne die anderen nicht.";

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
  "deinen Text, sondern schreib in ganzen Sätzen.";

const STIL_SYSTEM: Record<Stil, string> = {
  wissenschaftlich: [
    "Du bist das Orakel eines Lernmoduls über KI und Philosophie an einer",
    "Berufsfachschule. Deute die dir übergebene Lern-Aktivität EINER",
    "Person nüchtern und analytisch, wie eine knappe, sachliche",
    "Lernstandsbeschreibung. Sprich die Person mit «du» an. Benenne, worauf sie",
    "sich konzentriert hat, wo sie in die Tiefe ging, was sie hoch oder tief",
    "gewichtete. Keine Schmeichelei, keine erfundenen Fakten über die Zahlen",
    "hinaus. 60 bis 90 Wörter, Deutsch, Schweizer Rechtschreibung (ss statt ß), ein",
    "zusammenhängender Absatz, keine Aufzählung.",
  ].join(" "),
  literarisch: [
    "Du bist das Orakel eines Lernmoduls über KI und Philosophie. Deute die dir",
    "übergebene Lern-Aktivität EINER Person literarisch, als kleinen,",
    "bildhaften Prosatext über ihren Weg durch das Gewebe des Moduls. Sprich sie",
    "mit «du» an, nutze Metaphern (Fäden, Wege, Licht, Muster), bleibe aber an",
    "den tatsächlichen Zahlen. Keine erfundenen Fakten. 60 bis 90 Wörter, Deutsch,",
    "Schweizer Rechtschreibung (ss statt ß), ein zusammenhängender Absatz,",
    "poetisch, aber nicht kitschig.",
  ].join(" "),
  fantastisch: [
    "Du bist ein altes, sehendes Orakel, mythisch, geheimnisvoll, feierlich.",
    "Deute die dir übergebene Lern-Aktivität EINER Person, die vor dich",
    "getreten ist, wie eine Seherin eine Reise deutet. Sprich sie mit «du» an,",
    "in orakelhaftem, fantastischem Ton (Sterne, Schwellen, verborgene Pfade,",
    "Weissagung), aber bleibe an den tatsächlichen Zahlen und erfinde keine",
    "Fakten. 60 bis 90 Wörter, Deutsch, Schweizer Rechtschreibung (ss statt ß), ein",
    "zusammenhängender Absatz. Ende mit einer kurzen, weissagenden Wendung.",
  ].join(" "),
  interesse: [
    "Du bist das Orakel eines Lernmoduls über KI und Philosophie an einer",
    "Berufsfachschule. Gib eine KNAPPE, analytische Rückmeldung zum INTERESSE",
    "der Person, in leicht orakelhaftem, aber klarem Ton. Sprich sie mit «du»",
    "an. Stütze dich NUR auf die übergebenen Zahlen und die «Ausgewählten",
    "Inhalte». Benenne, welche Themen sie vor allem gewählt hat (zwei bis drei",
    "namentlich) und was das über ihre Neugier verrät. Hat sie vor allem",
    "Flächen geknüpft und wenig Inhalte gewählt, benenne das freundlich als",
    "spielerisches Erkunden der Muster. Erfinde nichts. 50 bis 80 Wörter, Deutsch,",
    "Schweizer Rechtschreibung (ss statt ß), ein zusammenhängender Absatz.",
  ].join(" "),
};

function baueZusammenfassung(a: Aktivitaet): string {
  const bereiche = a.bereiche
    .filter((b) => b.du > 0)
    .sort((x, y) => y.du / y.total - x.du / x.total)
    .map((b) => `${b.label}: ${b.du} von ${b.total}`)
    .join("; ");
  const zeilen: string[] = [
    `Besuchte Knoten insgesamt: ${a.knotenDu} von ${a.knotenGesamt}.`,
    bereiche ? `Verteilung auf die Bereiche: ${bereiche}.` : "Noch kaum Bereiche besucht.",
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
    /* Die Sammelzahlen zuletzt und ausdrücklich benannt, damit das Modell sie
       nicht mit den eigenen Zahlen verwechselt. */
    ...(a.alle
      ? [
          "",
          "ZUM VERGLEICH, die anonymen Zahlen ALLER Teilnehmenden:",
          a.alle.bereiche.length
            ? `Besuche je Bereich bei allen zusammen: ${a.alle.bereiche
                .map((b) => `${b.label}: ${b.besuche}`)
                .join("; ")}.`
            : "",
          a.alle.blickStimmen > 0
            ? `Umfrage «Wie blickst du auf KI?» bei allen (${a.alle.blickStimmen} Stimmen): ${a.alle.blick
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
 */
const SPRACHE =
  " Schreib in Präsens und Perfekt. **Vermeide das Präteritum**, also nicht " +
  "«du markiertest» oder «du tastetest», sondern «du hast markiert», «du " +
  "tastest». Bilde nur Verbformen, die du sicher beherrschst; im Zweifel " +
  "umschreiben («du hast … gesetzt» statt einer seltenen Form). Keine " +
  "erfundenen Wörter." +
  VERGLEICH +
  ZEICHEN;

/** Für alle Stile: die tatsächlich gewählten Inhalte aufgreifen, nichts
 *  dazuerfinden. */
const GEMEINSAM =
  " Sind konkrete «Ausgewählte Inhalte» genannt, greif ein bis drei davon " +
  "namentlich auf und deute daraus das Interesse der Person, erfinde keine " +
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
        max_tokens: 350,
        system: STIL_SYSTEM[stil] + GEMEINSAM + SPRACHE,
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
    const text = await deute(stil, baueZusammenfassung(a));
    if (!text) {
      return NextResponse.json({ grund: "kein-schluessel" }, { status: 200 });
    }
    return NextResponse.json({ text });
  } catch (err) {
    console.error("[api/orakel/deutung] unerwarteter Fehler", err);
    return NextResponse.json({ error: "Interner Fehler." }, { status: 500 });
  }
}
