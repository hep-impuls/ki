import { NextResponse, type NextRequest } from "next/server";
import { teacherPrefs } from "@/lib/server/teacherStore";
import { errorResponse } from "@/lib/server/apiResponse";

export const runtime = "nodejs";

/** POST { classCode, secret } → { requiredModules } (secret-gated). */
export async function POST(req: NextRequest) {
  try {
    const { classCode, secret } = await req.json();
    if (!classCode || !secret) {
      return NextResponse.json({ error: "classCode und secret erforderlich." }, { status: 400 });
    }
    const result = await teacherPrefs(String(classCode), String(secret));
    return NextResponse.json(result);
  } catch (err) {
    return errorResponse(err);
  }
}
