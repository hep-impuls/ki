import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import ThemenMenu from "../_components/ThemenMenu";

/**
 * v3-Vorschau (M3 → M5) — rendert das **Themenfeld** mit allen 7 Themen (freie
 * Wahl, Erfüllungsgrad je Thema, grün bei Abschluss, Abschlussbericht jederzeit).
 * Über das Menü ist weiterhin jede Themen-Shell (StationV3) erreichbar. Die
 * v2-Einheit (page.tsx → KiEinheit) bleibt unberührt.
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
        <h1 className="mt-sm text-headline-xl text-on-surface">Themenfeld — Durchklick</h1>
        <p className="mt-sm text-body-lg text-on-surface-variant">
          Sieben Themen frei wählbar, jedes mit eigenem Erfüllungsgrad, grün bei
          Abschluss. Über «Meine Landkarte» erreichst du die Abschluss-Vorschau:
          globaler Slider, Chancen-Risiken-Landkarte (Radar) und Klassen-Spiegel.
          Jedes Thema öffnet die 7-Subpage-Shell.
        </p>
      </header>

      <section className="mt-xl">
        <ThemenMenu />
      </section>
    </AppLayout>
  );
}
