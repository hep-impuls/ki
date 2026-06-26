import { NextResponse, type NextRequest } from "next/server";
import { teacherReport } from "@/lib/server/teacherStore";
import { errorResponse } from "@/lib/server/apiResponse";

export const runtime = "nodejs";

/** POST { classCode, secret } → TeacherReport (Einzel-Schueler + Poll-Aggregate). */
export async function POST(req: NextRequest) {
  try {
    const { classCode, secret } = await req.json();
    if (!classCode || !secret) {
      return NextResponse.json({ error: "classCode und secret erforderlich." }, { status: 400 });
    }
    const report = await teacherReport(String(classCode), String(secret));
    return NextResponse.json(report);
  } catch (err) {
    return errorResponse(err);
  }
}
