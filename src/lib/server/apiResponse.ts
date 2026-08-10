import "server-only";

import { NextResponse } from "next/server";
import {
  NotConfiguredError,
  SecretMismatchError,
  ClassNotFoundError,
  NotAdminError,
} from "./teacherStore";

/** Einheitliche Fehler-Antwort fuer die Route Handlers. */
export function errorResponse(err: unknown): NextResponse {
  if (err instanceof NotConfiguredError) {
    return NextResponse.json(
      { error: "Server nicht konfiguriert (Service-Account fehlt)." },
      { status: 503 },
    );
  }
  if (err instanceof SecretMismatchError) {
    return NextResponse.json({ error: "Secret ist nicht korrekt." }, { status: 403 });
  }
  if (err instanceof ClassNotFoundError) {
    return NextResponse.json({ error: "Klasse nicht gefunden." }, { status: 404 });
  }
  if (err instanceof NotAdminError) {
    return NextResponse.json(
      { error: "Dieser Klassencode ist nicht für die Gesamtübersicht freigeschaltet." },
      { status: 403 },
    );
  }
  console.error("[api] unerwarteter Fehler", err);
  return NextResponse.json({ error: "Interner Fehler." }, { status: 500 });
}
