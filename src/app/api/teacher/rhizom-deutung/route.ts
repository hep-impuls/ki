import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

/**
 * POST { rhizom, module, bereiche, themen, n, aktiv } → { text } | { grund }
 *
 * Die KI-Einschätzung des **Klassen-Rhizoms** für die Lehrperson. Anders als
 * `/api/orakel/deutung` (deutet EINER Person ihre eigene Aktivität, in drei
 * Stilen) richtet sich dieser Text an die Lehrperson: nüchtern, didaktisch, mit
 * Blick auf Anschlussaufgaben.
 *
 * Datenschutz: Übergeben werden ausschliesslich **Klassen-Aggregate** — Summen
 * je Trieb, Summen je Abschnitt, Titel der häufigsten Themen. Keine Codes,
 * keine Einzelantworten, keine Zuordnung zu Personen. Nichts wird gespeichert;
 * der Text entsteht auf Knopfdruck. Modell: claude-haiku-4-5 (Projektvorgabe),
 * Aufruf per fetch, weil package.json geteilt ist.
 */

const MODELL = "claude-haiku-4-5";

interface Rhizom {
  punkte: number;
  flaechen: number;
  bildpunkte: number;
  videos: number;
  vertiefungen: number;
  weiter: number;
}

interface ModulZahl {
  modul: string;
  angeschaut: number;
  vertieft: number;
  weiterverfolgen: number;
}

interface BereichZahl {
  bereich: string;
  modul: string;
  angeschaut: number;
  vertieft: number;
  weiterverfolgen: number;
  aktiveSchueler: number;
}

interface Anfrage {
  n: number;
  aktiv: number;
  rhizom: Rhizom;
  module: ModulZahl[];
  bereiche: BereichZahl[];
  themen: { titel: string; art: string }[];
}

const SYSTEM = [
  "Du wertest für eine Lehrperson an einer Berufsfachschule aus, wie sich ihre",
  "Klasse durch ein Lernset über KI und Philosophie bewegt hat. Grundlage ist",
  "ein «Aktivitäts-Rhizom»: sechs Triebe, die zeigen, WO die Klasse war",
  "(Punkte, Flächen, Bildpunkte, Videos) und WIE TIEF sie ging (Vertiefungen =",
  "aufgeklappte «Mehr lesen»-Texte, Weiterverfolgen = Merkzeichen «das verfolge",
  "ich weiter»).",
  "",
  "Schreib der Lehrperson eine knappe Einschätzung: Welche Triebe sind stark,",
  "welche schwach, und was heisst das für den Unterricht? Unterscheide dabei die",
  "beiden Module, wenn die Zahlen es hergeben. Nenne am Schluss ein bis zwei",
  "konkrete Anschlussmöglichkeiten, die an den weiterverfolgten Themen ansetzen",
  "— nur an solchen, die in den Daten wirklich vorkommen.",
  "",
  "Bleib streng an den übergebenen Zahlen, erfinde keine Themen und keine",
  "Ursachen. Sind die Zahlen dünn, sag das ruhig. Sprich die Lehrperson mit",
  "«Sie» an. 90–140 Wörter, Deutsch, Schweizer Rechtschreibung (ss statt ß),",
  "zwei kurze Absätze, keine Aufzählung, keine Schmeichelei.",
  "",
  "Schreib in Präsens und Perfekt, vermeide das Präteritum.",
].join(" ");

function baueZusammenfassung(a: Anfrage): string {
  const r = a.rhizom;
  const zeilen: string[] = [
    `Klasse: ${a.n} Schüler:innen, davon ${a.aktiv} mit mindestens einer Spur.`,
    "Die sechs Triebe des Klassen-Rhizoms (Summen über alle Schüler:innen):",
    `  Punkte (geöffnete Inhalts-Knoten): ${r.punkte}`,
    `  Flächen (geknüpfte Maschen im Gewebe): ${r.flaechen}`,
    `  Bildpunkte (angeschaute Bildstellen): ${r.bildpunkte}`,
    `  Videos: ${r.videos}`,
    `  Vertiefungen («Mehr lesen» aufgeklappt): ${r.vertiefungen}`,
    `  Weiterverfolgen (Merkzeichen): ${r.weiter}`,
  ];
  if (a.module.length > 0) {
    zeilen.push("Verteilung auf die Module:");
    for (const m of a.module) {
      zeilen.push(
        `  ${m.modul}: ${m.angeschaut} angeschaut, ${m.vertieft} vertieft, ` +
          `${m.weiterverfolgen} weiterverfolgt.`,
      );
    }
  }
  const stark = [...a.bereiche].sort((x, y) => y.aktiveSchueler - x.aktiveSchueler).slice(0, 4);
  const schwach = [...a.bereiche].sort((x, y) => x.aktiveSchueler - y.aktiveSchueler).slice(0, 3);
  if (stark.length > 0) {
    zeilen.push(
      "Am meisten bearbeitete Abschnitte: " +
        stark.map((b) => `${b.bereich} (${b.modul}, ${b.aktiveSchueler} aktiv)`).join("; ") +
        ".",
    );
  }
  if (schwach.length > 0) {
    zeilen.push(
      "Am wenigsten bearbeitete Abschnitte: " +
        schwach.map((b) => `${b.bereich} (${b.modul}, ${b.aktiveSchueler} aktiv)`).join("; ") +
        ".",
    );
  }
  const nachArt = (art: string) =>
    a.themen.filter((t) => t.art === art).map((t) => t.titel);
  const w = nachArt("weiterverfolgt");
  const v = nachArt("vertieft");
  if (w.length > 0) zeilen.push(`Am häufigsten weiterverfolgte Themen: ${w.join(", ")}.`);
  if (v.length > 0) zeilen.push(`Am häufigsten vertiefte Themen: ${v.join(", ")}.`);
  return zeilen.join("\n");
}

async function deute(zusammenfassung: string): Promise<string | null> {
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
        max_tokens: 500,
        system: SYSTEM,
        messages: [
          {
            role: "user",
            content: `Hier die Aktivität der Klasse:\n\n${zusammenfassung}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) {
      const fehler = await res.text().catch(() => "");
      console.error("[api/teacher/rhizom-deutung] Messages API", res.status, fehler.slice(0, 300));
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
    console.error("[api/teacher/rhizom-deutung] KI-Aufruf fehlgeschlagen", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ grund: "kein-schluessel" }, { status: 200 });
    }
    const a = (await req.json().catch(() => null)) as Anfrage | null;
    if (!a || typeof a !== "object" || !a.rhizom || typeof a.rhizom !== "object") {
      return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
    }
    const summe = Object.values(a.rhizom).reduce(
      (s, v) => s + (typeof v === "number" ? v : 0),
      0,
    );
    if (summe < 3) {
      return NextResponse.json({ grund: "zu-wenig" }, { status: 200 });
    }
    const text = await deute(
      baueZusammenfassung({
        n: a.n ?? 0,
        aktiv: a.aktiv ?? 0,
        rhizom: a.rhizom,
        module: Array.isArray(a.module) ? a.module : [],
        bereiche: Array.isArray(a.bereiche) ? a.bereiche : [],
        themen: Array.isArray(a.themen) ? a.themen : [],
      }),
    );
    if (!text) {
      return NextResponse.json({ grund: "kein-schluessel" }, { status: 200 });
    }
    return NextResponse.json({ text });
  } catch (err) {
    console.error("[api/teacher/rhizom-deutung] unerwarteter Fehler", err);
    return NextResponse.json({ error: "Interner Fehler." }, { status: 500 });
  }
}
