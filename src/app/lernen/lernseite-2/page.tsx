import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";

export default function Lernseite2() {
  return (
    <main className="min-h-screen">
      <ActivityTracker type="lesson_open" page="lernseite-2" lessonId="lernseite-2" />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <span aria-hidden>←</span> Zurück zur Übersicht
        </Link>

        <header className="mt-8 border-b border-slate-200 pb-8">
          <div
            aria-hidden
            className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-700 text-white shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8"
            >
              <path d="M12 2.5l2.39 5.74 6.21.49-4.72 4.04 1.45 6.06L12 15.77l-5.33 3.06 1.45-6.06L3.4 8.73l6.21-.49L12 2.5z" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-fuchsia-600">
            Modul 2
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            Lernseite 2
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Platzhalter für das zweite Lernmodul.
          </p>
        </header>

        <section className="mt-8 space-y-4 leading-relaxed text-slate-600">
          <p>
            Hier folgt der Inhalt von Lernseite 2 — Texte, Aufgaben, interaktive
            Elemente.
          </p>
        </section>
      </div>
    </main>
  );
}
