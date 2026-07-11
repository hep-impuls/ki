import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import FadenNetz from "../_components/FadenNetz";
import { Signatur } from "../_components/Gewebe";
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
        <div className="flex items-end justify-between gap-md">
          <div className="min-w-0">
            <p className="text-label-md uppercase tracking-wider text-tertiary">
              Thema 02 · Orientierung
            </p>
            <h1 className="mt-sm text-headline-xl text-on-surface">
              Philosophische Perspektive
            </h1>
            <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
              Technische Umbrüche verunsichern — das ist nicht neu. Der
              Zeitstrahl zeigt fünf Epochen, jede als eigenes Panel: zuerst die
              Bilder der Zeit, dann drei Bausteine zum Aufklappen —{" "}
              <strong>Technische Errungenschaft</strong>,{" "}
              <strong>Verunsicherung</strong> und{" "}
              <strong>Philosophische Orientierungshilfe</strong>. Sie sind
              aufeinander bezogen, lassen sich aber auch einzeln lesen. Öffne,
              was dich interessiert. Und heute, mit KI?
            </p>
          </div>
          <Signatur variante="epochen" className="hidden flex-shrink-0 sm:block" />
        </div>
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

      {/* Interaktives Muster der Seite: die Epochen-Linie — von der Antike
          bis heute, jeder Knoten mit Schablone und Sprung ins Panel */}
      <FadenNetz
        className="mt-xl max-w-5xl"
        hoehe={210}
        svgKlasse="aspect-[720/290] sm:aspect-[720/210]"
        spurKey="philosophische-perspektive:weisheit"
        einladung="Fahr der Zeitlinie nach — von der Antike bis heute. Jede Epoche zeigt ihre Schablone; unter der Linie wächst mit jedem Schritt die Silhouette der Geschichte."
        sprungLabel="Zur Epoche im Zeitstrahl"
        straenge={[
          { d: "M60 176 C110 162 160 152 210 140" },
          { d: "M210 140 C260 130 310 121 360 112" },
          { d: "M360 112 C410 103 460 92 510 82" },
          { d: "M510 82 C560 72 610 57 660 44" },
        ]}
        flaechen={[
          { punkte: [[60, 176], [210, 140], [210, 200], [60, 200]], knoten: [0, 1] },
          { punkte: [[210, 140], [360, 112], [360, 200], [210, 200]], knoten: [1, 2] },
          { punkte: [[360, 112], [510, 82], [510, 200], [360, 200]], knoten: [2, 3] },
          { punkte: [[510, 82], [660, 44], [660, 200], [510, 200]], knoten: [3, 4] },
        ]}
        knoten={[
          {
            x: 60,
            y: 176,
            label: "Antike",
            text: "Alle Menschen streben von Natur aus nach Wissen",
            quelle: "Aristoteles · Antike",
            kommentar: "Schablone: beobachten, ordnen, begründen.",
            deutung:
              "Als der Mythos seine Bindekraft verlor und die Sophisten jede Wahrheit verkäuflich machten, gründete Aristoteles das Wissen neu: beobachten, ordnen, begründen. Diese Schablone trug die Antike durch ihre Verunsicherung — und trägt bis heute jede Wissenschaft. Im Zeitstrahl unten siehst du die Bilder, die Technik und die Unruhe, aus denen sie entstand.",
            ziel: "epoche-antike",
          },
          {
            x: 210,
            y: 140,
            label: "Mittelalter",
            text: "Im inneren Menschen wohnt die Wahrheit",
            quelle: "Augustinus · Spätantike",
            kommentar: "Schablone: Innerlichkeit, Glaube, Heilsgeschichte.",
            deutung:
              "Rom fällt, und mit der Stadt wankt für die Zeitgenossen die Weltordnung selbst. Augustinus verlegt den Halt vom äusseren Reich nach innen: Nicht Macht und Mauern tragen, sondern Glaube, Gewissen, Erinnerung. Eine Schablone, die dem Abendland tausend Jahre Orientierung gab — und die Frage stellt, wo wir heute unseren Halt suchen.",
            ziel: "epoche-augustinus",
          },
          {
            x: 360,
            y: 112,
            label: "Aufklärung",
            text: "Habe Mut, dich deines eigenen Verstandes zu bedienen",
            quelle: "Immanuel Kant · Aufklärung",
            kommentar: "Schablone: Autonomie und Selbstdenken.",
            deutung:
              "Kopernikus nimmt der Erde die Mitte, der Buchdruck spaltet den Glauben, und das Erdbeben von Lissabon zertrümmert den gütigen Weltplan. Kants Antwort ist keine Beruhigung, sondern eine Zumutung: Verlass dich nicht auf Autoritäten — denke selbst, urteile selbst, trage Verantwortung. Das mündige Individuum wird zur Schablone der Moderne.",
            ziel: "epoche-kant",
          },
          {
            x: 510,
            y: 82,
            label: "Moderne",
            text: "Alles Ständische und Stehende verdampft",
            quelle: "Karl Marx · Industriemoderne",
            kommentar: "Schablone: den Umbruch begreifen — und gestalten.",
            deutung:
              "Die Dampfmaschine pflügt die Gesellschaft um: Millionen ziehen in die Städte, Elend und Fortschritt wachsen zusammen, 1848 explodiert die Spannung. Marx begreift den Umbruch, während er geschieht — und zieht den Schluss, dass gesellschaftliche Verhältnisse gemacht sind, kein Schicksal: Wer sie versteht, kann sie verändern.",
            ziel: "epoche-marx",
          },
          {
            x: 660,
            y: 44,
            label: "Jetzt",
            akzent: true,
            text: "Welche Schablone trägt uns durch die Zeit der KI?",
            quelle: "Wir — jetzt",
            kommentar: "Die Antwort entsteht gerade.",
            deutung:
              "Fünf Epochen, vier fertige Schablonen — und heute? Alles ist vernetzt, Bilder und Stimmen lassen sich täuschend echt erzeugen, und mit der KI tritt eine neue Akteurin auf. Die Antwort unserer Zeit ist noch nicht geschrieben; Denkerinnen und Denker wie Latour, Haraway und Gabriel arbeiten daran. Genau deshalb lohnt der Blick zurück: Der Zeitstrahl unten zeigt, wie Orientierung schon viermal gelungen ist.",
            ziel: "epoche-jetzt",
          },
        ]}
      />

      <section className="mt-xl max-w-3xl">
        <SchablonenZeitstrahl />
      </section>
    </AppLayout>
  );
}
