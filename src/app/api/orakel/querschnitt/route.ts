import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

/**
 * GET → { anzahl, stichprobe, blick, spuren, orakel, grund }
 *
 * Baut den anonymen Querschnitt für das Orakel-Dashboard (Thema 04):
 *  - anzahl geteilter Sätze + eine Stichprobe (nur Text, ohne jede Metadaten)
 *  - Poll-Zähler «Blick auf KI» und die anonymen Aktivitäts-Zähler
 *  - den gecachten Orakel-Kommentar der KI
 *
 * Datenschutz-Architektur (siehe docs/decisions.md):
 *  Die KI hat KEINEN Zugriff auf Firestore oder gar Browser-Daten. Diese
 *  Route liest die ohnehin anonyme Sammlung, verdichtet sie zu einer
 *  Text-Zusammenfassung (Zähler + geteilte Sätze) und reicht NUR diese an
 *  die Messages API weiter. Der Vergleich «du ↔ alle» passiert im Browser.
 *
 * Kostenbremse: Der Kommentar wird in Firestore gecacht und höchstens neu
 * erzeugt, wenn (a) noch keiner existiert und ≥3 Sätze da sind oder
 * (b) ≥5 neue Sätze dazukamen UND der letzte Lauf >30 Minuten her ist.
 * Modell: claude-haiku-4-5 — bewusst das günstigste geeignete Modell
 * (Projektvorgabe «möglichst wenig Kosten»); Aufruf per fetch statt SDK,
 * weil package.json geteilt ist (kein neues Paket ohne Absprache).
 */

const UNIT_ID = process.env.NEXT_PUBLIC_UNIT_ID ?? "ki26";
const MODELL = "claude-haiku-4-5";
const MIN_AUSSAGEN = 3;
const NEUE_FUER_UPDATE = 5;
const MIN_ALTER_MS = 30 * 60 * 1000;

const ORAKEL_SYSTEM = [
  "Du bist das Orakel eines Lernmoduls über KI und Philosophie an einer",
  "Berufsfachschule (Modul «Eine ganz neue Partnerschaft»). Du erhältst",
  "ausschliesslich eine bereits anonymisierte Sammlung: Aggregat-Zähler und",
  "anonym geteilte Sätze zur offenen Frage «Welche Schablone trägt uns durch",
  "die KI-Zeit?». Du siehst keine Personen und sprichst niemanden einzeln an.",
  "Kommentiere den Querschnitt in 100–140 Wörtern auf Deutsch (Schweizer",
  "Rechtschreibung: ss statt ß): Benenne wiederkehrende Motive und Spannungen,",
  "würdige die Vielfalt, und ende mit EINER offenen, weiterführenden Frage an",
  "alle. Ton: klar, warm, leicht orakelhaft — ohne Kitsch, ohne Aufzählungen,",
  "als ein zusammenhängender Absatz. Zitiere keine Sätze wörtlich.",
].join(" ");

type Counts = Record<string, number>;

async function orakelKommentar(zusammenfassung: string): Promise<string | null> {
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
        max_tokens: 400,
        system: ORAKEL_SYSTEM,
        messages: [{ role: "user", content: zusammenfassung }],
      }),
      signal: AbortSignal.timeout(25000),
    });
    if (!res.ok) {
      const fehler = await res.text().catch(() => "");
      console.error("[api/orakel/querschnitt] Messages API", res.status, fehler.slice(0, 300));
      return null;
    }
    const data = (await res.json()) as {
      content?: { type: string; text?: string }[];
      stop_reason?: string;
    };
    const text = (data.content ?? [])
      .filter((b) => b.type === "text" && typeof b.text === "string")
      .map((b) => b.text)
      .join("\n")
      .trim();
    return text.length > 0 ? text : null;
  } catch (err) {
    console.error("[api/orakel/querschnitt] KI-Aufruf fehlgeschlagen", err);
    return null;
  }
}

export async function GET() {
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json(
        { error: "Server nicht konfiguriert (Service-Account fehlt)." },
        { status: 503 },
      );
    }
    const unit = db.collection("abstimmungen").doc(UNIT_ID);

    // 1) Anonyme Sammlung lesen (Sätze, Poll-Zähler, Aktivitäts-Zähler)
    const [anzahlSnap, aussagenSnap, blickSnap, spurenSnap, metaSnap] =
      await Promise.all([
        unit.collection("orakel-aussagen").count().get(),
        unit.collection("orakel-aussagen").orderBy("t", "desc").limit(40).get(),
        unit.collection("polls").doc("orakel-blick").get(),
        unit.collection("polls").doc("spuren-lernseite-2").get(),
        unit.collection("orakel-meta").doc("stand").get(),
      ]);

    const anzahl = anzahlSnap.data().count;
    const aussagen = aussagenSnap.docs
      .map((d) => d.data()?.text)
      .filter((t): t is string => typeof t === "string" && t.length > 0);
    const blick = (blickSnap.data()?.counts ?? {}) as Counts;
    const spuren = (spurenSnap.data()?.counts ?? {}) as Counts;

    // 2) Orakel-Kommentar: Cache lesen, nur bei Bedarf neu erzeugen
    const meta = (metaSnap.data() ?? {}) as {
      kommentar?: string;
      standMs?: number;
      aussagenBeiStand?: number;
    };
    let kommentar = typeof meta.kommentar === "string" ? meta.kommentar : null;
    let standMs = typeof meta.standMs === "number" ? meta.standMs : 0;

    const hatSchluessel = Boolean(process.env.ANTHROPIC_API_KEY);
    const brauchtNeu =
      hatSchluessel &&
      anzahl >= MIN_AUSSAGEN &&
      (!kommentar ||
        ((anzahl - (meta.aussagenBeiStand ?? 0) >= NEUE_FUER_UPDATE) &&
          Date.now() - standMs > MIN_ALTER_MS));

    if (brauchtNeu) {
      // Anonymisierte Zusammenfassung — NUR das sieht die KI.
      const blickZeile = Object.entries(blick)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      const aktivitaet = Object.entries(
        Object.entries(spuren).reduce<Counts>((acc, [id, n]) => {
          const bereich = id.split(":").slice(0, 2).join(":");
          acc[bereich] = (acc[bereich] ?? 0) + (Number(n) || 0);
          return acc;
        }, {}),
      )
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `${k}: ${v} Besuche`)
        .join(", ");
      const zusammenfassung = [
        `Anonyme Sammlung des Moduls (${anzahl} geteilte Sätze insgesamt).`,
        blickZeile ? `Umfrage «Wie blickst du auf KI?» — Zähler: ${blickZeile}.` : "",
        aktivitaet ? `Anonyme Aktivitäts-Zähler (besuchte Knoten): ${aktivitaet}.` : "",
        "Die neuesten geteilten Sätze zur offenen Frage:",
        ...aussagen.map((t, i) => `${i + 1}. ${t}`),
      ]
        .filter(Boolean)
        .join("\n");

      const neu = await orakelKommentar(zusammenfassung);
      if (neu) {
        kommentar = neu;
        standMs = Date.now();
        await unit
          .collection("orakel-meta")
          .doc("stand")
          .set({ kommentar, standMs, aussagenBeiStand: anzahl });
      }
    }

    const grund = !hatSchluessel
      ? "kein-schluessel"
      : anzahl < MIN_AUSSAGEN
      ? "zu-wenig"
      : null;

    return NextResponse.json({
      anzahl,
      stichprobe: aussagen.slice(0, 12),
      blick,
      spuren,
      orakel: kommentar ? { text: kommentar, standMs } : null,
      grund: kommentar ? null : grund,
    });
  } catch (err) {
    console.error("[api/orakel/querschnitt] unerwarteter Fehler", err);
    return NextResponse.json({ error: "Interner Fehler." }, { status: 500 });
  }
}
