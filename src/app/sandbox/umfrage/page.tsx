import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import PerspektivenCheck from "./PerspektivenCheck";

export default function SandboxUmfrage() {
  return (
    <AppLayout>
      <ActivityTracker type="page_view" page="sandbox/umfrage" />

      {/* Werkstatt-Hinweis */}
      <div className="flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-container-low px-md py-sm">
        <span className="material-symbols-outlined text-[20px] text-tertiary">
          science
        </span>
        <p className="text-label-md text-on-surface-variant">
          Werkstatt — Umfrage-Entwurf. Antworten bleiben im Browser, kein Speichern.
        </p>
      </div>

      <Link
        href="/lernen/lernseite-2/vorhang-auf"
        className="mt-lg inline-flex items-center gap-xs text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Zum Auftakt «Vorhang auf»
      </Link>

      <header className="mt-lg border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Einstieg · Perspektiven-Check
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">
          Wie blickst du auf KI?
        </h1>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          Drei kurze Kapitel — Nutzung, Emotion, Chancen. Es gibt kein Richtig
          oder Falsch: Die Umfrage macht sichtbar, wie unterschiedlich man auf
          dasselbe blickt.
        </p>
      </header>

      <section className="mt-xl max-w-3xl">
        <PerspektivenCheck />
      </section>
    </AppLayout>
  );
}
