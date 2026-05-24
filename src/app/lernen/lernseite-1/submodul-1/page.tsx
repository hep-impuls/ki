import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";

export default function Lernseite1Submodul1() {
  return (
    <AppLayout>
      <ActivityTracker
        type="lesson_open"
        page="lernseite-1/submodul-1"
        lessonId="lernseite-1-submodul-1"
      />

      <Link
        href="/lernen/lernseite-1"
        className="inline-flex items-center gap-xs text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Zurück zu Lernseite 1
      </Link>

      <header className="mt-lg border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-primary">
          Lernseite 1 · Submodul 1
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">Submodul 1</h1>
        <p className="mt-sm text-body-lg text-on-surface-variant">
          Platzhalter für das erste Submodul von Lernseite 1.
        </p>
      </header>

      <section className="mt-xl space-y-md text-body-md text-on-surface-variant max-w-3xl">
        <p>Hier folgt der Inhalt — Texte, Aufgaben, interaktive Elemente.</p>
      </section>
    </AppLayout>
  );
}
