import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import KiEinheitV3 from "./_components/KiEinheitV3";
import ProgressMirror from "./_components/ProgressMirror";

/**
 * Lernseite 1 — KI-Einheit v3 (Pietro).
 *
 * Live ist seit M7 der v3-Orchestrator: Auftakt → Themenfeld (7 Themen frei
 * wählbar, je mit Erfüllungsgrad) → Abschluss (Landkarte · Post-Slider ·
 * Klassen-Spiegel · Abschlussbericht, jederzeit und ohne Schwelle). Der v2-Flow
 * (`KiEinheit`) bleibt im Repo, ist aber nicht mehr eingebunden. Datenmodell ki26: persönliche Daten nur lokal, Cloud nur anonyme
 * Aggregate (Casting ab M8). ProgressMirror spiegelt den lokalen Fortschritt
 * zusätzlich anonym-pseudonym (Animal-Code) für den Lehrer-Report.
 */

export default function Lernseite1() {
  return (
    <AppLayout>
      <ActivityTracker type="page_view" page="lernseite-1" />
      <ProgressMirror />
      <KiEinheitV3 />
    </AppLayout>
  );
}
