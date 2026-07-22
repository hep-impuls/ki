import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

/**
 * GET → { eingeloggt, aktivVorhang, aktivPhilosophie } | { grund }
 *
 * Teilnehmer-Zahlen (Personen, nicht Aktionen) für den Orakel-Überblick:
 *  - eingeloggt        = Anzahl Teilnehmer-Codes (students-Docs) im Namespace
 *  - aktivVorhang      = davon mit mindestens einer Spur auf «Vorhang auf»
 *  - aktivPhilosophie  = davon mit mindestens einer Spur auf der Philosophie-Seite
 *
 * Grundlage sind die pro Code gespiegelten Spuren
 * (students/{code}/progress/lernseite-2-spuren, Feld `ids`). Read-only,
 * ausschliesslich im ki26-Namespace. Ohne Service-Account (lokal) → grund.
 */

const UNIT_ID = process.env.NEXT_PUBLIC_UNIT_ID ?? "ki26";
const SPUREN_MODUL = "lernseite-2-spuren";

export async function GET() {
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json({ grund: "kein-server" }, { status: 200 });
    }
    const studentsSnap = await db
      .collection("abstimmungen")
      .doc(UNIT_ID)
      .collection("students")
      .get();

    const eingeloggt = studentsSnap.size;
    let aktivVorhang = 0;
    let aktivPhilosophie = 0;

    await Promise.all(
      studentsSnap.docs.map(async (s) => {
        const spur = await s.ref.collection("progress").doc(SPUREN_MODUL).get();
        const ids = spur.data()?.ids;
        if (!Array.isArray(ids)) return;
        const strings = ids.filter((x): x is string => typeof x === "string");
        if (strings.some((x) => x.startsWith("vorhang-auf:"))) aktivVorhang++;
        if (strings.some((x) => x.startsWith("philosophische-perspektive:")))
          aktivPhilosophie++;
      }),
    );

    return NextResponse.json({ eingeloggt, aktivVorhang, aktivPhilosophie });
  } catch (err) {
    console.error("[api/orakel/teilnehmer] unerwarteter Fehler", err);
    return NextResponse.json({ error: "Interner Fehler." }, { status: 500 });
  }
}
