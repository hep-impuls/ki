import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";

const lessons = [
  {
    id: "lernseite-1",
    title: "Lernseite 1",
    subtitle: "Platzhalter",
    description:
      "Hier entsteht das erste Lernmodul. Inhalt, Aufgaben und interaktive Elemente folgen.",
    href: "/lernen/lernseite-1",
    accent: "from-brand-500 to-brand-700",
  },
  {
    id: "lernseite-2",
    title: "Lernseite 2",
    subtitle: "Platzhalter",
    description:
      "Hier entsteht das zweite Lernmodul. Inhalt, Aufgaben und interaktive Elemente folgen.",
    href: "/lernen/lernseite-2",
    accent: "from-fuchsia-500 to-purple-700",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ActivityTracker type="page_view" page="home" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(52,120,246,0.18),transparent_70%),radial-gradient(40%_40%_at_80%_30%,rgba(192,38,211,0.12),transparent_70%)]"
      />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <span className="text-lg font-bold">KI</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">KI-Lernumgebung</p>
            <p className="text-xs text-slate-500">Interaktive Lehrmittel</p>
          </div>
        </div>
        <nav className="hidden gap-6 text-sm font-medium text-slate-600 sm:flex">
          <a className="hover:text-slate-900" href="#module">
            Module
          </a>
          <a className="hover:text-slate-900" href="#about">
            Über
          </a>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-10 sm:pt-16">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Lernplattform · Beta
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Künstliche Intelligenz{" "}
            <span className="bg-gradient-to-r from-brand-600 to-fuchsia-600 bg-clip-text text-transparent">
              verständlich entdecken
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Eine kompakte Lernumgebung mit interaktiven Modulen rund um KI. Wähle
            unten ein Modul, um direkt loszulegen.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#module"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              Jetzt starten
              <span aria-hidden>→</span>
            </Link>
            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              Mehr erfahren
            </a>
          </div>
        </div>
      </section>

      <section id="module" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Lernmodule
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Zwei Platzhalter — Inhalte folgen.
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {lessons.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                aria-hidden
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${l.accent}`}
              />
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {l.subtitle}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {l.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {l.description}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                Modul öffnen
                <span
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Über die Lernumgebung</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Diese Plattform bündelt interaktive Module zum Thema Künstliche
            Intelligenz. Lernfortschritt und Aktivitäten werden anonym in Firebase
            gespeichert, sodass du jederzeit dort weitermachen kannst, wo du
            aufgehört hast.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white/60 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} KI-Lernumgebung</p>
          <p>Hosted on Vercel · Aktivitäten via Firebase</p>
        </div>
      </footer>
    </main>
  );
}
