import { NextResponse, type NextRequest } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

/**
 * POST { text } → { ok: true }
 *
 * Nimmt EINEN anonym geteilten Satz zur offenen Frage des Orakels entgegen
 * («Welche Schablone trägt uns durch die KI-Zeit?») und legt ihn in
 * abstimmungen/{UNIT}/orakel-aussagen ab — bewusst OHNE studentCode, ohne
 * Session, ohne IP: Es gibt serverseitig keinerlei Personenbezug.
 *
 * Läuft über das Admin SDK (umgeht die geteilten iperka-lms-Rules — kein
 * Rules-Deploy nötig, siehe CLAUDE.md). Der Browser schreibt hier nie direkt.
 */

const UNIT_ID = process.env.NEXT_PUBLIC_UNIT_ID ?? "ki26";
/** Obergrenze der Sammlung — Schutz vor Fluten (Schulkontext, kein Login). */
const MAX_AUSSAGEN = 2000;

function bereinige(text: unknown): string | null {
  if (typeof text !== "string") return null;
  const t = text
    .replace(/https?:\/\/\S+/gi, "") // keine Links
    .replace(/[\u0000-\u001f\u007f]/g, " ") // keine Steuerzeichen
    .replace(/\s+/g, " ")
    .trim();
  if (t.length < 3 || t.length > 220) return null;
  return t;
}

export async function POST(req: NextRequest) {
  try {
    const db = getAdminDb();
    if (!db) {
      return NextResponse.json(
        { error: "Server nicht konfiguriert (Service-Account fehlt)." },
        { status: 503 },
      );
    }
    const body = (await req.json().catch(() => null)) as { text?: unknown } | null;
    const text = bereinige(body?.text);
    if (!text) {
      return NextResponse.json(
        { error: "Bitte einen Satz mit 3–220 Zeichen, ohne Links." },
        { status: 400 },
      );
    }

    const sammlung = db
      .collection("abstimmungen")
      .doc(UNIT_ID)
      .collection("orakel-aussagen");

    const anzahl = (await sammlung.count().get()).data().count;
    if (anzahl >= MAX_AUSSAGEN) {
      return NextResponse.json(
        { error: "Die Sammlung ist voll — das Orakel hat genug gehört." },
        { status: 429 },
      );
    }

    await sammlung.add({ text, t: FieldValue.serverTimestamp() });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/orakel/aussage] unerwarteter Fehler", err);
    return NextResponse.json({ error: "Interner Fehler." }, { status: 500 });
  }
}
