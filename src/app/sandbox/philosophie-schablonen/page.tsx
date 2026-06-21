import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import SchablonenZeitstrahl from "./SchablonenZeitstrahl";

export default function SandboxPhilosophieSchablonen() {
  return (
    <AppLayout>
      <ActivityTracker type="page_view" page="sandbox/philosophie-schablonen" />

      {/* Werkstatt-Hinweis */}
      <div className="flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-container-low px-md py-sm">
        <span className="material-symbols-outlined text-[20px] text-tertiary">
          science
        </span>
        <p className="text-label-md text-on-surface-variant">
          Werkstatt — Visualisierung in Arbeit. Wird ins Submodul „Philosophische
          Perspektive“ übernommen.
        </p>
      </div>

      <Link
        href="/lernen/lernseite-2/submodul-1"
        className="mt-lg inline-flex items-center gap-xs text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Zur Philosophischen Perspektive
      </Link>

      <header className="mt-lg border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Philosophie im Wandel
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">
          Schablonen für den Wandel
        </h1>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          Jede Zeit des Umbruchs fand eine Philosophie, die ihr Orientierung gab —
          eine Schablone, durch die man die Welt neu sehen konnte. Und heute, mit
          KI? Tippe die Stationen an.
        </p>
      </header>

      <section className="mt-xl max-w-3xl">
        <SchablonenZeitstrahl />
      </section>
    </AppLayout>
  );
}
