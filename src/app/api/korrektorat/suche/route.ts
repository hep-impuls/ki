/**
 * POST /api/korrektorat/suche — `{ begriff, ganzeWoerter? }` → Fundstellen über
 * **alle** Inhaltsdateien.
 *
 * Der Fall, für den es das gibt: Die Korrekturperson sieht im Lernset einen
 * Fehler und weiss nicht, in welcher der 59 Dateien er steht. Sie sucht das
 * falsche Wort und springt direkt an die Textstelle.
 *
 * Die Suche greift auf denselben Index zu wie die Übersicht — der erste Abruf
 * nach einem Repo-Stand ist langsam, danach kommt beides aus dem Prozess-Cache.
 */

import { fehlerAntwort, json, konfig, sitzungVerlangen, suchen } from "@/lib/korrektorat/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    await sitzungVerlangen(request);
    const body = (await request.json().catch(() => null)) as
      | { begriff?: string; ganzeWoerter?: boolean }
      | null;
    const begriff = (body?.begriff || "").trim();
    if (begriff.length < 2) {
      return json({ fehler: "Bitte mindestens zwei Zeichen eingeben." }, 400);
    }
    return json(await suchen(konfig(), begriff, { ganzeWoerter: Boolean(body?.ganzeWoerter) }));
  } catch (err) {
    return fehlerAntwort(err);
  }
}
