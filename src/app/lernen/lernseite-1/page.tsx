import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import KiEinheit from "./_components/KiEinheit";

/**
 * Lernseite 1 — KI-Einheit (Pietro).
 *
 * Ein einziger orchestrierter Flow (Handoff §3): Auftakt → Stationen (mind. 3
 * von 5) → Abschluss mit Kollektiv-Spiegel → optionaler Maschinenraum. Die
 * fruehere Hub-Seite mit Platzhalter-Submodulen ist bewusst ersetzt.
 */

export default function Lernseite1() {
  return (
    <AppLayout>
      <ActivityTracker type="page_view" page="lernseite-1" />
      <KiEinheit />
    </AppLayout>
  );
}
