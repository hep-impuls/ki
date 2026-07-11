import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import KnotenNetz from "../_components/KnotenNetz";
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

      {/* Interaktive Signatur: fünf Epochen als anklickbare Karte */}
      <section className="mt-xl max-w-3xl" aria-label="Fünf Epochen im Überblick">
        <h2 className="text-headline-md text-on-surface">
          Fünf Epochen im Überblick
        </h2>
        <p className="mt-sm text-body-md text-on-surface-variant">
          Die Zeitlinie steigt von der Antike bis heute. Tippe eine Epoche an —
          und spring von dort direkt zu ihrem Panel im Zeitstrahl.
        </p>
        <KnotenNetz
          className="mt-lg"
          einladung="Fünf Knoten, fünf Epochen — tippe einen an, um Denker und Schablone zu sehen."
          sprungLabel="Zur Epoche im Zeitstrahl"
          deko={[
            "M24 144 C44 132 56 124 72 116 C88 108 104 104 120 100 C136 96 152 88 168 80 C184 72 200 62 216 52",
          ]}
          knoten={[
            {
              x: 24,
              y: 144,
              label: "Antike",
              titel: "Antike — Aristoteles",
              text: "Der Mythos trägt nicht mehr, die Sophisten machen jede Wahrheit verkäuflich — Aristoteles antwortet mit der Schablone: beobachten, ordnen, begründen.",
              ziel: "epoche-antike",
            },
            {
              x: 72,
              y: 116,
              label: "Mittelalter",
              titel: "Spätantike & Mittelalter — Augustinus",
              text: "Rom fällt, eine Weltordnung zerbricht — Augustinus verlegt den Halt nach innen: Glaube, Gewissen, Heilsgeschichte.",
              ziel: "epoche-augustinus",
            },
            {
              x: 120,
              y: 100,
              label: "Aufklärung",
              titel: "Aufklärung — Kant",
              text: "Kopernikus und Lissabon erschüttern den Weltplan — Kant fordert: Habe Mut, dich deines eigenen Verstandes zu bedienen.",
              ziel: "epoche-kant",
            },
            {
              x: 168,
              y: 80,
              label: "Moderne",
              titel: "Industriemoderne — Marx",
              text: "Die Maschine ordnet die Gesellschaft neu — Marx begreift den Umbruch als menschengemacht und darum veränderbar.",
              ziel: "epoche-marx",
            },
            {
              x: 216,
              y: 52,
              label: "Jetzt",
              akzent: true,
              titel: "Gegenwart — wir",
              text: "Alles ist vernetzt, KI tritt auf — die Schablone unserer Zeit ist noch offen. Genau daran arbeitet dieses Modul.",
              ziel: "epoche-jetzt",
            },
          ]}
        />
      </section>

      <section className="mt-xl max-w-3xl">
        <SchablonenZeitstrahl />
      </section>
    </AppLayout>
  );
}
