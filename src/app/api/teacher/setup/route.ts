import { NextResponse, type NextRequest } from "next/server";
import { teacherSetup } from "@/lib/server/teacherStore";
import { errorResponse } from "@/lib/server/apiResponse";

export const runtime = "nodejs";

/** POST { classCode, secret, requiredModules? } → Klasse anlegen/aktualisieren (single-owner). */
export async function POST(req: NextRequest) {
  try {
    const { classCode, secret, requiredModules } = await req.json();
    if (!classCode || !secret || String(secret).trim().length < 4) {
      return NextResponse.json(
        { error: "Klassencode und Secret (mind. 4 Zeichen) erforderlich." },
        { status: 400 },
      );
    }
    const result = await teacherSetup(
      String(classCode),
      String(secret),
      Array.isArray(requiredModules) ? requiredModules.map(String) : undefined,
    );
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return errorResponse(err);
  }
}
