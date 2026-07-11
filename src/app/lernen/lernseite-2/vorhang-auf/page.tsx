import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import { FadenDivider, Signatur } from "../_components/Gewebe";
import WeisheitsFaden from "../_components/WeisheitsFaden";
import AkteursModell from "./_components/AkteursModell";

/**
 * Thema 01 — «Vorhang auf: eine neue Akteurin».
 *
 * Auftakt von Lernseite 2: In drei kurzen Szenen (Auftritt, Irritation,
 * Frage) wird gezeigt, dass mit KI etwas aufgetreten ist, das weder in die
 * Werkzeug- noch in die Personen-Schublade passt. Das interaktive
 * Akteurs-Modell lässt die Lernenden das selbst herausarbeiten; am Ende
 * öffnen sich die zwei Perspektiven (philosophisch, kulturell).
 */

const SZENEN = [
  {
    label: "Der Auftritt",
    text: "Technik hat bisher gerechnet, gespeichert, übertragen. Im November 2022 ging ein Vorhang auf: Mit ChatGPT trat etwas auf die Bühne, das in unserer Sprache antwortet — es schreibt Briefe, erklärt Aufgaben, entwirft Bilder und Ideen. Innerhalb weniger Wochen benutzten es Millionen von Menschen.",
  },
  {
    label: "Die Irritation",
    text: "Für Werkzeuge haben wir Regeln: Man benutzt sie, und sie bleiben stumm. Für Personen haben wir auch Regeln: Man begegnet ihnen, sie tragen Verantwortung. Die neue Akteurin passt in keine der beiden Schubladen — sie wird geführt wie ein Werkzeug und antwortet wie ein Gegenüber.",
  },
  {
    label: "Die Frage",
    text: "Wie umgehen mit etwas, das kein Werkzeug und keine Person ist? Genau hier setzt dieses Modul an. Zwei Perspektiven helfen bei der Einordnung: Die philosophische klärt Begriffe und stiftet Orientierung, die kulturelle zeigt, welche Bilder und Erzählungen unseren Blick längst geprägt haben.",
  },
];

export default function Lernseite2VorhangAuf() {
  return (
    <AppLayout>
      <ActivityTracker
        type="lesson_open"
        page="lernseite-2/vorhang-auf"
        lessonId="lernseite-2-vorhang-auf"
      />

      <Link
        href="/lernen/lernseite-2"
        className="inline-flex items-center gap-xs text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Zurück zu Lernseite 2
      </Link>

      <header className="mt-lg border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Thema 01 · Auftakt
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">
          Vorhang auf — eine neue Akteurin
        </h1>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          Mit KI ist eine neue Art von Akteurin aufgetreten — weder ein
          klassisches Werkzeug noch eine Person. Bevor wir sie einordnen,
          schauen wir hin: Was genau ist da eigentlich auf die Bühne getreten?
        </p>
      </header>

      {/* Interaktives Muster: dem Faden nachfahren, Weisheiten einsammeln */}
      <WeisheitsFaden
        className="mt-xl max-w-3xl"
        weisheiten={[
          {
            text: "Die ganze Welt ist Bühne, und alle Frauen und Männer blosse Spieler",
            quelle: "William Shakespeare, «Wie es euch gefällt»",
            kommentar: "Vorhang auf — welche Rolle geben wir der neuen Akteurin?",
          },
          {
            text: "Alles fliesst",
            quelle: "Heraklit",
            kommentar: "Panta rhei: auch der Werkzeug-Begriff bleibt nicht stehen.",
          },
          {
            text: "Die Grenzen meiner Sprache bedeuten die Grenzen meiner Welt",
            quelle: "Ludwig Wittgenstein",
            kommentar: "Was verschiebt sich, wenn Maschinen sprechen?",
          },
          {
            text: "Mit jedem Anfang kommt etwas Neues in die Welt",
            quelle: "nach Hannah Arendt",
            kommentar: "Anfangen können — vielleicht die menschlichste aller Fähigkeiten.",
          },
        ]}
      />

      {/* Drei Szenen am Faden */}
      <section className="mt-xl max-w-3xl" aria-label="Drei Szenen">
        <ol className="flex flex-col gap-lg">
          {SZENEN.map((sz, i) => (
            <li key={sz.label} className="flex gap-md">
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="mt-xs h-6 w-6 flex-shrink-0"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  fill="none"
                  strokeWidth="1"
                  className="stroke-tertiary"
                  opacity="0.45"
                />
                <circle cx="12" cy="12" r="3.5" className="fill-tertiary" />
              </svg>
              <div className="min-w-0">
                <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Szene {i + 1}
                </p>
                <h2 className="mt-xs text-headline-sm text-on-surface">
                  {sz.label}
                </h2>
                <p className="mt-sm text-body-md text-on-surface-variant">
                  {sz.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <FadenDivider className="mt-xl" />

      {/* Interaktion: Akteur oder Werkzeug? */}
      <section className="mt-xl max-w-3xl" aria-label="Akteurs-Modell">
        <h2 className="text-headline-md text-on-surface">
          Akteurin oder Werkzeug? Ordne selbst zu
        </h2>
        <p className="mt-sm text-body-md text-on-surface-variant">
          Erarbeite selbst, warum die alten Begriffe nicht mehr greifen: Ordne
          jede Eigenschaft den Akteuren zu, auf die sie zutrifft — und decke
          dann das Muster auf.
        </p>
        <div className="mt-lg">
          <AkteursModell />
        </div>
      </section>

      <FadenDivider className="mt-xl" />

      {/* Der Faden läuft weiter */}
      <section className="mt-xl max-w-3xl" aria-label="Weiter im Modul">
        <h2 className="text-headline-md text-on-surface">Der Faden läuft weiter</h2>
        <p className="mt-sm text-body-md text-on-surface-variant">
          Zwei Perspektiven nehmen die neue Akteurin in den Blick:
        </p>
        <div className="mt-lg grid gap-md sm:grid-cols-2">
          <Link
            href="/lernen/lernseite-2/philosophische-perspektive"
            className="group flex items-start justify-between gap-md rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="min-w-0">
              <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                Thema 02
              </p>
              <h3 className="mt-xs text-headline-sm text-on-surface">
                Philosophische Perspektive
              </h3>
              <span className="mt-md inline-flex items-center gap-sm text-label-md text-tertiary">
                Öffnen
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
            </div>
            <Signatur variante="epochen" className="hidden flex-shrink-0 sm:block" />
          </Link>
          <Link
            href="/lernen/lernseite-2/kulturelle-perspektive"
            className="group flex items-start justify-between gap-md rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="min-w-0">
              <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                Thema 03
              </p>
              <h3 className="mt-xs text-headline-sm text-on-surface">
                Kulturelle Perspektive
              </h3>
              <span className="mt-md inline-flex items-center gap-sm text-label-md text-tertiary">
                Öffnen
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
            </div>
            <Signatur variante="gewebe" className="hidden flex-shrink-0 sm:block" />
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}
