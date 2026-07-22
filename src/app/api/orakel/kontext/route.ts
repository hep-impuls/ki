import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

/**
 * GET → { nutzer, aspekte: { [gi]: { wenig, mittel, viel } } } | { grund }
 *
 * Aggregiert die Kontext-Achtsamkeit ALLER Teilnehmenden: pro Aspekt (flacher
 * Index `gi`) wie oft «wenig» (Stufe 0), «mittel» (1) und «viel» (2) gewählt
 * wurde. Grundlage sind die pro Code gespiegelten Gewichtungen unter
 * `abstimmungen/ki26/students/{code}/progress/lernseite-2-gewichtung` (Feld
 * `werte`, Schlüssel `vorhang-auf:achtsamkeit:<gi>`). Read-only, nur im
 * ki26-Namespace. Ohne Service-Account (lokal) → grund.
 */

const UNIT_ID = process.env.NEXT_PUBLIC_UNIT_ID ?? "ki26";
const GEWICHT_MODUL = "lernseite-2-gewichtung";
const PREFIX = "vorhang-auf:achtsamkeit:";

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

    const aspekte: Record<string, { wenig: number; mittel: number; viel: number }> = {};
    let nutzer = 0;

    await Promise.all(
      studentsSnap.docs.map(async (s) => {
        const doc = await s.ref.collection("progress").doc(GEWICHT_MODUL).get();
        const werte = doc.data()?.werte;
        if (!werte || typeof werte !== "object") return;
        let hatAchtsamkeit = false;
        for (const key of Object.keys(werte)) {
          if (!key.startsWith(PREFIX)) continue;
          const gi = key.slice(PREFIX.length);
          const stufe = Number(werte[key]);
          if (!Number.isFinite(stufe)) continue;
          hatAchtsamkeit = true;
          const a = (aspekte[gi] ??= { wenig: 0, mittel: 0, viel: 0 });
          if (stufe <= 0) a.wenig++;
          else if (stufe === 1) a.mittel++;
          else a.viel++;
        }
        if (hatAchtsamkeit) nutzer++;
      }),
    );

    return NextResponse.json({ nutzer, aspekte });
  } catch (err) {
    console.error("[api/orakel/kontext] unerwarteter Fehler", err);
    return NextResponse.json({ error: "Interner Fehler." }, { status: 500 });
  }
}
