import {
  cookieLoeschen,
  fehlendeKonfig,
  konfig,
  passcodeStimmt,
  sitzungsCookie,
} from "@/lib/autoren/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/autoren/auth — `{ passcode }` → Sitzungs-Cookie für `/autoren`.
 *
 * Ein geteilter Passcode für Pietro und Christof. Bei einem Personalwechsel
 * gehört er rotiert (Vercel → Environment Variables → `AUTOREN_PASSCODE`,
 * danach neu deployen).
 */
export async function POST(request: Request) {
  const k = konfig();
  if (!k) {
    return Response.json(
      { fehler: `Nicht konfiguriert: ${fehlendeKonfig().join(", ")}` },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as { passcode?: string } | null;
  const passcode = (body?.passcode || "").trim();
  if (!passcode) {
    return Response.json({ fehler: "Bitte den Passcode eingeben." }, { status: 400 });
  }
  if (!(await passcodeStimmt(passcode, k.passcode))) {
    return Response.json({ fehler: "Passcode stimmt nicht." }, { status: 401 });
  }

  return Response.json(
    { ok: true },
    { status: 200, headers: { "Set-Cookie": await sitzungsCookie(k.secret) } },
  );
}

/** DELETE /api/autoren/auth — abmelden. */
export async function DELETE() {
  return Response.json(
    { ok: true },
    { status: 200, headers: { "Set-Cookie": cookieLoeschen() } },
  );
}
