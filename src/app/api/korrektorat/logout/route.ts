/** POST /api/korrektorat/logout — Cookie löschen. */

import { json } from "@/lib/korrektorat/server";
import { cookieLoeschen } from "@/lib/korrektorat/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  return json({ ok: true }, 200, { "Set-Cookie": cookieLoeschen() });
}
