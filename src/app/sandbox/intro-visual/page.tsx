import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import AkteursModell from "./AkteursModell";

export default function SandboxIntroVisual() {
  return (
    <AppLayout>
      <ActivityTracker
        type="page_view"
        page="sandbox/intro-visual"
      />

      {/* Werkstatt-Hinweis — macht den experimentellen Charakter sichtbar */}
      <div className="flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-container-low px-md py-sm">
        <span className="material-symbols-outlined text-[20px] text-tertiary">
          science
        </span>
        <p className="text-label-md text-on-surface-variant">
          Werkstatt — Visualisierung in Arbeit. Wird später in das Intro-Submodul
          von Lernseite 2 übernommen.
        </p>
      </div>

      <Link
        href="/lernen/lernseite-2"
        className="mt-lg inline-flex items-center gap-xs text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Zu Lernseite 2
      </Link>

      <header className="mt-lg border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Intro · Eine ganz neue Partnerschaft
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">
          Akteur oder Werkzeug?
        </h1>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          Mit KI ist eine neue Art von Akteur auf die Bühne getreten — weder ein
          klassisches Werkzeug noch eine Person. Erarbeite selbst, warum die
          alten Begriffe nicht mehr greifen.
        </p>
      </header>

      <section className="mt-xl max-w-3xl">
        <AkteursModell />
      </section>
    </AppLayout>
  );
}
