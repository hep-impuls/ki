import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import ZeitstrahlMenu from "../_components/ZeitstrahlMenu";

/**
 * v3-Vorschau (M3 → M5) — rendert jetzt den **Zeitstrahl** mit allen 7 Stationen
 * (freie Wahl, grün bei Abschluss, Fortschritt, Zertifikat ab 3). Über das Menü
 * ist weiterhin jede Stations-Shell (StationV3) erreichbar. Die v2-Einheit
 * (page.tsx → KiEinheit) bleibt unberührt. Wird in M7 durch die echte
 * Auftakt/Abschluss-Verdrahtung ersetzt.
 */
export default function Lernseite1V3Preview() {
  return (
    <AppLayout>
      <ActivityTracker
        type="lesson_open"
        page="lernseite-1/v3-preview"
        lessonId="lernseite-1-v3-preview"
      />

      <Link
        href="/lernen/lernseite-1"
        className="inline-flex items-center gap-xs text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Zurück zu Lernseite 1
      </Link>

      <header className="mt-lg border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Lernseite 1 · v3-Vorschau (M6)
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">Zeitstrahl — Durchklick</h1>
        <p className="mt-sm text-body-lg text-on-surface-variant">
          Sieben Stationen frei wählbar, grün bei Abschluss, mit Fortschritt und
          Zertifikat ab drei Stationen. Über «Meine Landkarte» erreichst du die
          Abschluss-Vorschau: globaler Slider, Chancen-Risiken-Landkarte (Radar)
          und Klassen-Spiegel. Jede Station öffnet die 7-Subpage-Shell.
        </p>
      </header>

      <section className="mt-xl">
        <ZeitstrahlMenu />
      </section>
    </AppLayout>
  );
}
