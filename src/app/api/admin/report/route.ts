import { NextResponse, type NextRequest } from "next/server";
import { adminReport } from "@/lib/server/teacherStore";
import { errorResponse } from "@/lib/server/apiResponse";

export const runtime = "nodejs";

/**
 * POST { classCode, secret, frisch? } → AdminReport (klassenübergreifend).
 *
 * Anmeldung wie bei jeder Lehrperson (Klassencode + eigenes Secret); zusätzlich
 * muss der Code für die Gesamtsicht freigeschaltet sein (`istAdmin` am
 * Lehrer-Doc oder `ADMIN_CLASS_CODES`). Sonst 403.
 *
 * **Die Route nimmt bewusst keine Bereichs-/Pfadangabe entgegen.** Alle Pfade
 * kommen aus `src/lib/paths.ts` und liegen damit fest unter
 * `abstimmungen/${NEXT_PUBLIC_UNIT_ID}`. Das geteilte Firebase-Projekt
 * beherbergt auch `10mio` — an das kommt diese Route nicht heran, und das soll
 * so bleiben (Entscheid 2026-08-10).
 */
export async function POST(req: NextRequest) {
  try {
    const { classCode, secret, frisch } = await req.json();
    if (!classCode || !secret) {
      return NextResponse.json(
        { error: "classCode und secret erforderlich." },
        { status: 400 },
      );
    }
    const report = await adminReport(String(classCode), String(secret), frisch === true);
    return NextResponse.json(report);
  } catch (err) {
    return errorResponse(err);
  }
}
