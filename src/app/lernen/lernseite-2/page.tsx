import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";

export default function Lernseite2() {
  return (
    <AppLayout>
      <ActivityTracker type="lesson_open" page="lernseite-2" lessonId="lernseite-2" />

      <header className="border-b border-outline-variant pb-lg">
        <div
          aria-hidden
          className="mb-md inline-flex h-14 w-14 items-center justify-center rounded-xl bg-tertiary text-on-tertiary shadow-sm"
        >
          <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
        </div>
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Modul 2
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">Lernseite 2</h1>
        <p className="mt-sm text-body-lg text-on-surface-variant">
          Platzhalter für das zweite Lernmodul.
        </p>
      </header>

      <section className="mt-xl space-y-md text-body-md text-on-surface-variant max-w-3xl">
        <p>
          Hier folgt der Inhalt von Lernseite 2 — Texte, Aufgaben, interaktive
          Elemente.
        </p>
      </section>
    </AppLayout>
  );
}
