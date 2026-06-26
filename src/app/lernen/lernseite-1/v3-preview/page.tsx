import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import StationV3 from "../_components/StationV3";
import { STATIONEN_V3 } from "../_data/stationenV3";

/**
 * v3-Vorschau (M3) — rendert die neue 7-Subpage-Stations-Shell mit echten
 * Daten aus stationenV3.ts (Station 1). Diente nur zum Durchklicken/Review der
 * Shell; die v2-Einheit (page.tsx → KiEinheit) bleibt unberührt. Wird in M7
 * durch die echte Verdrahtung (Menü/Timeline → KiEinheit) ersetzt.
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
          Lernseite 1 · v3-Vorschau (M3)
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">Stations-Shell — Durchklick</h1>
        <p className="mt-sm text-body-lg text-on-surface-variant">
          7 Subpages, eine Frage bzw. Karte pro Frame, mit Banner und
          Mikro-Anleitung. Inhalte aus Station 1 (KI &amp; Arbeit).
        </p>
      </header>

      <section className="mt-xl">
        <StationV3 station={STATIONEN_V3[0]} />
      </section>
    </AppLayout>
  );
}
