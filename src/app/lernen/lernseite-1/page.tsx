import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";

export default function Lernseite1() {
  return (
    <AppLayout>
      <ActivityTracker type="lesson_open" page="lernseite-1" lessonId="lernseite-1" />

      <header className="border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-primary">
          Modul 1
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">Lernseite 1</h1>
        <p className="mt-sm text-body-lg text-on-surface-variant">
          Platzhalter für das erste Lernmodul.
        </p>
      </header>

      <section className="mt-xl space-y-md text-body-md text-on-surface-variant max-w-3xl">
        <p>
          Hier folgt der Inhalt von Lernseite 1 — Texte, Aufgaben, interaktive
          Elemente.
        </p>
      </section>
    </AppLayout>
  );
}
