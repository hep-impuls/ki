import { NextResponse, type NextRequest } from "next/server";
import { teacherOrakel } from "@/lib/server/teacherStore";
import { errorResponse } from "@/lib/server/apiResponse";

export const runtime = "nodejs";

/** POST { classCode, secret } → TeacherOrakel (Klassen-Aktivität pro Abschnitt). */
export async function POST(req: NextRequest) {
  try {
    const { classCode, secret } = await req.json();
    if (!classCode || !secret) {
      return NextResponse.json(
        { error: "classCode und secret erforderlich." },
        { status: 400 },
      );
    }
    const orakel = await teacherOrakel(String(classCode), String(secret));
    return NextResponse.json(orakel);
  } catch (err) {
    return errorResponse(err);
  }
}
