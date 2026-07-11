import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import { Signatur } from "../_components/Gewebe";
import OrakelDashboard from "./_components/OrakelDashboard";

/**
 * Thema 04 — «Das Orakel — erkenne dich selbst».
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

      <Link
        href="/lernen/lernseite-2"
        className="inline-flex items-center gap-xs text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Zurück zu Lernseite 2
      </Link>

      <header className="mt-lg border-b border-outline-variant pb-lg">
        <div className="flex items-end justify-between gap-md">
          <div className="min-w-0">
            <p className="text-label-md uppercase tracking-wider text-tertiary">
              Thema 04 · Rückblick &amp; Vergleich
            </p>
            <h1 className="mt-sm text-headline-xl text-on-surface">
              Das Orakel — erkenne dich selbst
            </h1>
            <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
              «Erkenne dich selbst» stand über dem Orakel von Delphi. Hier
              laufen die Fäden zusammen: deine Wege durchs Modul, deine Antwort
              auf die offene Frage — und daneben der anonyme Querschnitt aller,
              gedeutet vom Orakel.
            </p>
          </div>
          <Signatur variante="orakel" className="hidden flex-shrink-0 sm:block" />
        </div>
      </header>

      <section className="mt-xl">
        <OrakelDashboard />
      </section>
    </AppLayout>
  );
}
