import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import OrakelDashboard from "./_components/OrakelDashboard";
import SeitenNavigation from "../_components/SeitenNavigation";
import ModulMiniNav from "../_components/ModulMiniNav";
import AbschnittKopf from "../_components/AbschnittKopf";

/**
 * Thema 03 — «Das Orakel — erkenne dich selbst».
 *
 * Persönlicher Rückblick (Wege, eigene Antwort) im anonymen Vergleich mit
 * allen; die KI deutet als Orakel den Querschnitt der anonymen Sammlung.
 * Architektur & Datenschutz: siehe _components/OrakelDashboard.tsx und
 * docs/decisions.md.
 */

export default function Lernseite2DasOrakel() {
  return (
    <AppLayout>
      <ActivityTracker
        type="lesson_open"
        page="lernseite-2/das-orakel"
        lessonId="lernseite-2-das-orakel"
      />

      <ModulMiniNav />

      <Link
        href="/lernen/lernseite-2"
        className="inline-flex items-center gap-xs text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Zurück zu Lernseite 2
      </Link>

      <AbschnittKopf bild="/art/orakel-kopf.webp" gross className="mt-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Thema 03 · Rückblick &amp; Vergleich
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">
          Das Orakel — erkenne dich selbst
        </h1>
        <p className="mt-md max-w-3xl text-body-lg text-on-surface-variant">
          «Erkenne dich selbst» stand über dem Orakel von Delphi. Hier laufen
          die Fäden zusammen: deine Wege durchs Modul und dein Interesse an den
          Inhalten — daneben der anonyme Querschnitt aller, gedeutet vom Orakel.
        </p>
      </AbschnittKopf>

      <section className="mt-xl">
        <OrakelDashboard />
      </section>

      <SeitenNavigation
        zurueck={{
          href: "/lernen/lernseite-2/philosophische-perspektive",
          label: "Philosophische Perspektive",
        }}
      />
    </AppLayout>
  );
}
