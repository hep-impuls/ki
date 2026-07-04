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
          Immer derselbe Dreiklang: Die Technik verschiebt die Welt, die
          Verunsicherung wächst — und die Philosophie antwortet, immer erst im
          Nachhinein. Die Kunst jeder Epoche macht beides sichtbar: die
          Erschütterung und die neue Schablone. Und heute, mit KI?
        </p>
        <blockquote className="mt-md max-w-3xl border-l-4 border-tertiary pl-md">
          <p className="text-body-md italic text-on-surface-variant">
            «Die Eule der Minerva beginnt erst mit der einbrechenden Dämmerung
            ihren Flug.»
          </p>
          <footer className="mt-xs text-label-sm text-on-surface-variant">
            G. W. F. Hegel — die Philosophie begreift eine Gestalt des Lebens
            erst, wenn sie alt geworden ist.
          </footer>
        </blockquote>
      </header>

      <section className="mt-xl max-w-3xl">
        <SchablonenZeitstrahl />
      </section>
    </AppLayout>
  );
}
