import { redirect } from "next/navigation";

/**
 * Die Werkstatt-Visualisierung ist ins Modul umgezogen:
 * Lernseite 2 · Thema 02 «Philosophische Perspektive».
 * Alte Links (z.B. geteilte URLs) bleiben über diesen Redirect gültig.
 */
export default function SandboxPhilosophieSchablonenRedirect() {
  redirect("/lernen/lernseite-2/philosophische-perspektive");
}
