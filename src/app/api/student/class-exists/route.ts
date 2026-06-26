import { NextResponse, type NextRequest } from "next/server";
import { classExists } from "@/lib/server/teacherStore";
import { errorResponse } from "@/lib/server/apiResponse";

export const runtime = "nodejs";

/** POST { classCode } → { exists } (Onboarding-Pre-Validierung). */
export async function POST(req: NextRequest) {
  try {
    const { classCode } = await req.json();
    if (!classCode) {
      return NextResponse.json({ error: "classCode erforderlich." }, { status: 400 });
    }
    const exists = await classExists(String(classCode));
    return NextResponse.json({ exists });
  } catch (err) {
    return errorResponse(err);
  }
}
