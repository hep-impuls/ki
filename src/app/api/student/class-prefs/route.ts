import { NextResponse, type NextRequest } from "next/server";
import { studentClassPrefs } from "@/lib/server/teacherStore";
import { errorResponse } from "@/lib/server/apiResponse";

export const runtime = "nodejs";

/** POST { studentCode } → { requiredModules: string[] | null }. */
export async function POST(req: NextRequest) {
  try {
    const { studentCode } = await req.json();
    if (!studentCode) {
      return NextResponse.json({ error: "studentCode erforderlich." }, { status: 400 });
    }
    const requiredModules = await studentClassPrefs(String(studentCode));
    return NextResponse.json({ requiredModules });
  } catch (err) {
    return errorResponse(err);
  }
}
