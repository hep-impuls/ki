/**
 * GET /api/korrektorat/dateien — Übersicht aller Inhaltsdateien mit Feldzahl
 * und der Angabe, welche in dieser Runde schon bearbeitet wurden.
 *
 * Der erste Abruf nach einem Repo-Stand dauert ein paar Sekunden (alle Dateien
 * holen und parsen), danach kommt er aus dem Prozess-Cache — siehe
 * `uebersicht()` in [server.ts](../../../../lib/korrektorat/server.ts).
 */

import { fehlerAntwort, json, konfig, sitzungVerlangen, uebersicht } from "@/lib/korrektorat/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    await sitzungVerlangen(request);
    return json(await uebersicht(konfig()));
  } catch (err) {
    return fehlerAntwort(err);
  }
}
