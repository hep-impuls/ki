import { redirect } from "next/navigation";

/**
 * Das Akteurs-Modell ist ins Modul umgezogen:
 * Lernseite 2 · Thema 01 «Vorhang auf — eine neue Akteurin».
 * Alte Links bleiben über diesen Redirect gültig.
 */
export default function SandboxIntroVisualRedirect() {
  redirect("/lernen/lernseite-2/vorhang-auf");
}
