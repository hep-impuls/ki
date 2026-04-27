import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";

export default function Lernseite1() {
  return (
    <main className="min-h-screen">
      <ActivityTracker type="lesson_open" page="lernseite-1" lessonId="lernseite-1" />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <span aria-hidden>←</span> Zurück zur Übersicht
        </Link>

        <header className="mt-8 border-b border-slate-200 pb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Modul 1
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Lernseite 1
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Platzhalter für das erste Lernmodul.
          </p>
        </header>

        <section className="mt-8 space-y-4 leading-relaxed text-slate-600">
          <p>
            Hier folgt der Inhalt von Lernseite 1 — Texte, Aufgaben, interaktive
            Elemente.
          </p>
        </section>
      </div>
    </main>
  );
}
