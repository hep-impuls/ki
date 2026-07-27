/**
 * GET /api/korrektorat/me — bin ich angemeldet, und ist der Editor überhaupt
 * konfiguriert? Wird beim Laden der Seite gefragt, damit die Anmeldemaske nicht
 * kurz aufblitzt.
 */

import { fehlendeKonfig, json } from "@/lib/korrektorat/server";
import { sitzungLesen } from "@/lib/korrektorat/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const fehlt = fehlendeKonfig();
  const sitzung = await sitzungLesen(request, process.env.KORREKTORAT_SESSION_SECRET || "");
  return json({
    angemeldet: Boolean(sitzung),
    konfiguriert: fehlt.length === 0,
    fehlendeKonfig: fehlt,
    runde: process.env.KORREKTORAT_BRANCH || "korrektorat/runde-1",
  });
}
