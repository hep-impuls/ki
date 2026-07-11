import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import WeisheitsFaden from "../_components/WeisheitsFaden";
import SchablonenZeitstrahl from "./_components/SchablonenZeitstrahl";

/**
 * Thema 02 — «Philosophische Perspektive».
 *
 * Kernstück: der Schablonen-Zeitstrahl (fünf Epochen — Bilder der Zeit,
 * Technische Errungenschaft, Verunsicherung, Philosophische
 * Orientierungshilfe), portiert aus der Sandbox-Werkstatt
 * (/sandbox/philosophie-schablonen, dort jetzt Redirect hierhin).
 */

export default function Lernseite2PhilosophischePerspektive() {
  return (
    <AppLayout>
      <ActivityTracker
        type="lesson_open"
        page="lernseite-2/philosophische-perspektive"
        lessonId="lernseite-2-philosophische-perspektive"
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
          Thema 02 · Orientierung
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">
          Philosophische Perspektive
        </h1>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          Technische Umbrüche verunsichern — das ist nicht neu. Der Zeitstrahl
          zeigt fünf Epochen, jede als eigenes Panel: zuerst die Bilder der
          Zeit, dann drei Bausteine zum Aufklappen —{" "}
          <strong>Technische Errungenschaft</strong>,{" "}
          <strong>Verunsicherung</strong> und{" "}
          <strong>Philosophische Orientierungshilfe</strong>. Sie sind
          aufeinander bezogen, lassen sich aber auch einzeln lesen. Öffne, was
          dich interessiert. Und heute, mit KI?
        </p>
        <blockquote className="mt-md max-w-3xl border-l-4 border-tertiary pl-md">
          <p className="text-body-md italic text-on-surface-variant">
            «Die Eule der Minerva beginnt erst mit der einbrechenden Dämmerung
            ihren Flug.»
          </p>
          <footer className="mt-xs text-label-sm text-on-surface-variant">
            G. W. F. Hegel — die Philosophie sieht nicht voraus: Sie begreift,
            was war, und gewinnt daraus Antworten für die Gegenwart.
          </footer>
        </blockquote>
      </header>

      {/* Interaktives Muster: fünf Epochen-Knoten, je eine Schablone */}
      <WeisheitsFaden
        className="mt-xl max-w-3xl"
        weisheiten={[
          {
            text: "Alle Menschen streben von Natur aus nach Wissen",
            quelle: "Aristoteles · Antike",
            kommentar: "Schablone: beobachten, ordnen, begründen.",
          },
          {
            text: "Im inneren Menschen wohnt die Wahrheit",
            quelle: "Augustinus · Spätantike",
            kommentar: "Schablone: Innerlichkeit, Glaube, Heilsgeschichte.",
          },
          {
            text: "Habe Mut, dich deines eigenen Verstandes zu bedienen",
            quelle: "Immanuel Kant · Aufklärung",
            kommentar: "Schablone: Autonomie und Selbstdenken.",
          },
          {
            text: "Alles Ständische und Stehende verdampft",
            quelle: "Karl Marx · Industriemoderne",
            kommentar: "Schablone: den Umbruch begreifen — und gestalten.",
          },
          {
            text: "Welche Schablone trägt uns durch die Zeit der KI?",
            quelle: "Wir — jetzt",
            kommentar: "Die Antwort entsteht gerade — unten im Zeitstrahl.",
          },
        ]}
      />

      <section className="mt-xl max-w-3xl">
        <SchablonenZeitstrahl />
      </section>
    </AppLayout>
  );
}
