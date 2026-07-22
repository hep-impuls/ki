import SessionGate from "@/components/SessionGate";

/**
 * Gate für die gesamte Lernumgebung (Lernseite 1 + 2, inkl. aller Submodule).
 *
 * Erster Schritt beim Betreten: ohne Session → Redirect nach `/start?next=…`
 * (Onboarding: Fortschritts-Code erhalten/eingeben, Klassencode optional) —
 * analog 10mios `index.astro`. Der Code ist eine Identität für das ganze
 * Lernset (ein `ki26-session`-localStorage-Key, geteilt über beide Lernseiten).
 *
 * Vorher stand der Fortschritts-Code als Kasten mitten auf Lernseite 2; er ist
 * jetzt Teil dieses ersten Schritts (`/start`).
 */
export default function LernenLayout({ children }: { children: React.ReactNode }) {
  return <SessionGate>{children}</SessionGate>;
}
