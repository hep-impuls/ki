import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import { unit } from "@/config/unit";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <ActivityTracker type="page_view" page="home" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-32 left-1/4 h-[480px] w-[480px] rounded-full bg-primary-container blur-[120px] opacity-60" />
        <div className="absolute top-32 right-0 h-[400px] w-[400px] rounded-full bg-tertiary-container blur-[120px] opacity-50" />
      </div>

      <header className="mx-auto flex max-w-[1280px] items-center justify-between px-lg py-lg">
        <img src="/hep-logo.jpg" alt="hep Verlag" className="h-8 w-auto" />
        <nav className="hidden gap-lg text-body-sm font-medium text-on-surface-variant sm:flex">
          <a className="hover:text-on-surface transition-colors" href="#module">
            Module
          </a>
          <a className="hover:text-on-surface transition-colors" href="#about">
            Über
          </a>
        </nav>
      </header>

      <section className="mx-auto max-w-[1280px] px-lg pb-xl pt-lg sm:pt-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-xxl">
          {/* Left: text */}
          <div className="flex-1">
            <h1 className="text-headline-xl text-on-surface">
              Künstliche Intelligenz{" "}
              <span className="text-primary">verständlich entdecken</span>
            </h1>
            <p className="mt-md max-w-2xl text-body-lg text-on-surface-variant">
              {unit.description} Wähle unten ein Modul, um direkt loszulegen.
            </p>
            <div className="mt-lg flex flex-wrap gap-sm">
              <Link
                href="#module"
                className="inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:bg-on-primary-container"
              >
                Jetzt starten
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Right: hep logo */}
          <div className="hidden lg:flex items-center justify-center flex-shrink-0">
            <div className="flex h-64 w-64 items-center justify-center rounded-3xl border border-outline-variant bg-surface-bright/80 shadow-lg backdrop-blur p-xl">
              <img src="/hep-logo.jpg" alt="hep Verlag" className="max-h-full max-w-full w-auto h-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      <section id="module" className="mx-auto max-w-[1280px] px-lg pb-xxl">
        <div className="mb-lg flex items-end justify-between">
          <div>
            <h2 className="text-headline-lg text-on-surface">Lernmodule</h2>
            <p className="mt-xs text-body-sm text-on-surface-variant">
              {unit.modules.length} Platzhalter — Inhalte folgen.
            </p>
          </div>
        </div>

        <div className="grid gap-md sm:grid-cols-2">
          {unit.modules.map((m) => (
            <Link
              key={m.slug}
              href={m.href}
              className="group relative overflow-hidden rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 bg-primary"
              />
              {m.icon && (
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
                  <span className="material-symbols-outlined text-[22px]">{m.icon}</span>
                </div>
              )}
              <h3 className="mt-sm text-headline-sm text-on-surface">{m.title}</h3>
              {m.description && (
                <p className="mt-sm text-body-sm text-on-surface-variant">
                  {m.description}
                </p>
              )}
              <div className="mt-lg inline-flex items-center gap-sm text-label-md text-primary">
                Modul öffnen
                <span
                  className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1"
                >
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="about" className="mx-auto max-w-[1280px] px-lg pb-xxl">
        <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
          <h2 className="text-headline-sm text-on-surface">Über die Lernumgebung</h2>
          <p className="mt-sm max-w-3xl text-body-sm text-on-surface-variant">
            Diese Plattform bündelt interaktive Module zum Thema Künstliche
            Intelligenz. Lernfortschritt und Aktivitäten werden anonym in Firebase
            gespeichert, sodass du jederzeit dort weitermachen kannst, wo du
            aufgehört hast.
          </p>
        </div>
      </section>

      <footer className="border-t border-outline-variant bg-surface-bright/60 py-md">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-lg text-label-sm text-on-surface-variant">
          <p>Pietro Rossi &amp; Christof Glaus</p>
          <p>
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-on-surface underline"
            >
              CC BY 4.0
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
