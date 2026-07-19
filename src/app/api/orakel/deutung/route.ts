import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * POST { stil, aktivitaet } → { text } | { grund }
 *
 * Das persönliche Orakel: die KI deutet in wenigen Sätzen die EIGENE Aktivität
 * der lernenden Person in diesem Modul — in einem von drei Stilen
 * (wissenschaftlich, literarisch, fantastisch).
 *
 * Datenschutz: Der Browser schickt ausschliesslich anonyme Kennzahlen (Zähler,
 * Bewertungs-Verteilungen) — keinen Namen, keinen Code, keine Einzeltexte. Die
 * Deutung wird auf ausdrückliche Anfrage erzeugt (Knopfdruck), nicht gecacht,
 * und kein Wert wird serverseitig gespeichert. Modell: claude-haiku-4-5
 * (günstigstes geeignetes Modell, Projektvorgabe); Aufruf per fetch, weil
 * package.json geteilt ist (kein neues Paket ohne Absprache).
 */

const MODELL = "claude-haiku-4-5";

type Stil = "wissenschaftlich" | "literarisch" | "fantastisch";

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
}

const STIL_SYSTEM: Record<Stil, string> = {
  wissenschaftlich: [
    "Du bist das Orakel eines Lernmoduls über KI und Philosophie an einer",
    "Berufsfachschule. Deute die dir übergebene, anonyme Lern-Aktivität EINER",
    "Person nüchtern und analytisch — wie eine knappe, sachliche",
    "Lernstandsbeschreibung. Sprich die Person mit «du» an. Benenne, worauf sie",
    "sich konzentriert hat, wo sie in die Tiefe ging, was sie hoch oder tief",
    "gewichtete. Keine Schmeichelei, keine erfundenen Fakten über die Zahlen",
    "hinaus. 60–90 Wörter, Deutsch, Schweizer Rechtschreibung (ss statt ß), ein",
    "zusammenhängender Absatz, keine Aufzählung.",
  ].join(" "),
  literarisch: [
    "Du bist das Orakel eines Lernmoduls über KI und Philosophie. Deute die dir",
    "übergebene, anonyme Lern-Aktivität EINER Person literarisch — als kleinen,",
    "bildhaften Prosatext über ihren Weg durch das Gewebe des Moduls. Sprich sie",
    "mit «du» an, nutze Metaphern (Fäden, Wege, Licht, Muster), bleibe aber an",
    "den tatsächlichen Zahlen. Keine erfundenen Fakten. 60–90 Wörter, Deutsch,",
    "Schweizer Rechtschreibung (ss statt ß), ein zusammenhängender Absatz,",
    "poetisch, aber nicht kitschig.",
  ].join(" "),
  fantastisch: [
    "Du bist ein altes, sehendes Orakel — mythisch, geheimnisvoll, feierlich.",
    "Deute die dir übergebene, anonyme Lern-Aktivität EINER Person, die vor dich",
    "getreten ist, wie eine Seherin eine Reise deutet. Sprich sie mit «du» an,",
    "in orakelhaftem, fantastischem Ton (Sterne, Schwellen, verborgene Pfade,",
    "Weissagung), aber bleibe an den tatsächlichen Zahlen und erfinde keine",
    "Fakten. 60–90 Wörter, Deutsch, Schweizer Rechtschreibung (ss statt ß), ein",
    "zusammenhängender Absatz. Ende mit einer kurzen, weissagenden Wendung.",
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
  ];
  return zeilen.filter(Boolean).join("\n");
}

/** Für alle Stile: die tatsächlich gewählten Inhalte aufgreifen, nichts
 *  dazuerfinden. */
const GEMEINSAM =
  " Sind konkrete «Ausgewählte Inhalte» genannt, greif ein bis drei davon " +
  "namentlich auf und deute daraus das Interesse der Person — erfinde keine " +
  "Inhalte, die nicht in der Liste stehen.";

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
        system: STIL_SYSTEM[stil] + GEMEINSAM,
        messages: [
          {
            role: "user",
            content: `Hier die anonyme Lern-Aktivität der Person:\n\n${zusammenfassung}`,
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

const STILE: Stil[] = ["wissenschaftlich", "literarisch", "fantastisch"];

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
    if ((a.knotenDu ?? 0) < 1) {
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
