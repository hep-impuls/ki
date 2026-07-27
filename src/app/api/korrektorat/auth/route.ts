/**
 * POST /api/korrektorat/auth — `{ passcode }` → Sitzungs-Cookie.
 *
 * Der Passcode ist ein einziges geteiltes Geheimnis (wie im 10mio-Korrektorat).
 * Bei mehreren Korrektor:innen gehört er rotiert.
 */

import { fehlerAntwort, json, konfig } from "@/lib/korrektorat/server";
import { neueSid, passcodeStimmt, sitzungsCookie } from "@/lib/korrektorat/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const k = konfig();
    const body = (await request.json().catch(() => null)) as { passcode?: string } | null;
    const passcode = (body?.passcode || "").trim();
    if (!passcode) return json({ fehler: "Bitte den Passcode eingeben." }, 400);

    if (!(await passcodeStimmt(passcode, k.passcode))) {
      return json({ fehler: "Passcode stimmt nicht." }, 401);
    }

    return json({ ok: true }, 200, {
      "Set-Cookie": await sitzungsCookie(neueSid(), k.secret),
    });
  } catch (err) {
    return fehlerAntwort(err);
  }
}
