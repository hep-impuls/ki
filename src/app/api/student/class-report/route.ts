import { NextResponse, type NextRequest } from "next/server";
import { studentClassReport } from "@/lib/server/teacherStore";
import { errorResponse } from "@/lib/server/apiResponse";

export const runtime = "nodejs";

/** POST { studentCode } → StudentClassReport | { report: null } (anonym, k>=5). */
export async function POST(req: NextRequest) {
  try {
    const { studentCode } = await req.json();
    if (!studentCode) {
      return NextResponse.json({ error: "studentCode erforderlich." }, { status: 400 });
    }
    const report = await studentClassReport(String(studentCode));
    return NextResponse.json({ report });
  } catch (err) {
    return errorResponse(err);
  }
}
