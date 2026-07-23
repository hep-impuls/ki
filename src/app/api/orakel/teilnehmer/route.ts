import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

/**
 * GET → { teilgenommen, aktivVorhang, aktivPhilosophie } | { grund }
 *
 * Teilnehmer-Zahlen (Personen, nicht Aktionen) für den Orakel-Überblick.
 * Gezählt werden NUR Codes, die in diesem Lernset («Eine ganz neue
 * Partnerschaft») mindestens eine Aktivität gemacht haben, nicht alle je
 * erzeugten Codes:
 *  - teilgenommen      = Codes mit mindestens einer Spur in diesem Lernset
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

    let teilgenommen = 0;
    let aktivVorhang = 0;
    let aktivPhilosophie = 0;

    await Promise.all(
      studentsSnap.docs.map(async (s) => {
        const spur = await s.ref.collection("progress").doc(SPUREN_MODUL).get();
        const ids = spur.data()?.ids;
        if (!Array.isArray(ids)) return;
        const strings = ids.filter((x): x is string => typeof x === "string");
        // Mindestens eine Aktivität in diesem Lernset (irgendeine Spur im
        // lernseite-2-Spuren-Doc). Codes ohne Aktivität zählen nicht mit.
        if (strings.length === 0) return;
        teilgenommen++;
        if (strings.some((x) => x.includes("vorhang-auf"))) aktivVorhang++;
        // «philosoph» erfasst sowohl «philosophische-perspektive:…» als auch
        // die Video-Spur «video:philosophie».
        if (strings.some((x) => x.includes("philosoph"))) aktivPhilosophie++;
      }),
    );

    return NextResponse.json({ teilgenommen, aktivVorhang, aktivPhilosophie });
  } catch (err) {
    console.error("[api/orakel/teilnehmer] unerwarteter Fehler", err);
    return NextResponse.json({ error: "Interner Fehler." }, { status: 500 });
  }
}
