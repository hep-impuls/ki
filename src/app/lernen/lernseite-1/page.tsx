import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import KiEinheitV3 from "./_components/KiEinheitV3";

/**
 * Lernseite 1 — KI-Einheit **v3** (Pietro).
 *
 * Live ist seit M7 der v3-Orchestrator: Auftakt → Zeitstrahl (7 Stationen frei
 * wählbar) → Abschluss (Landkarte · Post-Slider · Klassen-Spiegel · Zertifikat
 * ab 3). Der v2-Flow (`KiEinheit`) bleibt im Repo, ist aber nicht mehr
 * eingebunden. Datenmodell ki26: persönliche Daten nur lokal, Cloud nur anonyme
 * Aggregate (Casting ab M8).
 */

export default function Lernseite1() {
  return (
    <AppLayout>
      <ActivityTracker type="page_view" page="lernseite-1" />
      <KiEinheitV3 />
    </AppLayout>
  );
}
