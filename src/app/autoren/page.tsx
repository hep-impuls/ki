import { cookies } from "next/headers";
import AutorenAnmeldung from "./_components/AutorenAnmeldung";
import AutorenDashboard from "./_components/AutorenDashboard";
import {
  AUTOREN_COOKIE,
  fehlendeKonfig,
  konfig,
  sitzungGueltig,
} from "@/lib/autoren/session";

export const metadata = {
  title: "Autoren-Übersicht · Lernumgebung zu KI",
  // Nicht in Suchmaschinen und nirgends verlinkt — eine Arbeitsseite für uns zwei.
  robots: { index: false, follow: false },
};

/** Immer frisch prüfen; ein Cookie darf nicht wegoptimiert werden. */
export const dynamic = "force-dynamic";

/**
 * `/autoren` — die Nutzungsübersicht für Pietro und Christof.
 *
 * Abgrenzung zu `/lehrperson/admin`: Das ist Pietros Sicht auf **Klassen und
 * Codes** (Admin SDK, Service-Account). Diese Seite fragt das Umgekehrte, nämlich
 * was mit den **Inhalten** passiert, und kommt dafür ohne Server-Route aus: Sie
 * liest nur die anonymen Aggregat-Zähler unter `abstimmungen/ki26/polls`, die die
 * deployten Rules bereits fürs Lesen freigeben.
 *
 * Der Zugang ist ein geteilter Passcode (`AUTOREN_PASSCODE`), geprüft **hier auf
 * dem Server**, bevor das Dashboard überhaupt gerendert wird. Ein Gate im Client
 * wäre keines: Der Code läge im Browser. Nicht hinter `SessionGate`, weil eine
 * Autorenseite keinen Fortschritts-Code braucht.
 *
 * Grenze des Schutzes, siehe `src/lib/autoren/session.ts`: Er hält die Seite
 * privat, nicht die Zahlen — die Zähler sind in Firestore öffentlich lesbar,
 * weil dieselben Werte das «alle» im Orakel der Lernenden speisen.
 */
export default async function AutorenSeite() {
  const k = konfig();
  if (!k) return <AutorenAnmeldung nichtKonfiguriert={fehlendeKonfig()} />;

  const token = (await cookies()).get(AUTOREN_COOKIE)?.value;
  if (!(await sitzungGueltig(token, k.secret))) return <AutorenAnmeldung />;

  return <AutorenDashboard />;
}
