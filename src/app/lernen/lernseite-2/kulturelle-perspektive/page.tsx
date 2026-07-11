import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import { FadenDivider, Signatur } from "../_components/Gewebe";
import WeisheitsFaden from "../_components/WeisheitsFaden";

/**
 * Thema 03 — «Kulturelle Perspektive» (im Aufbau).
 *
 * Grundgedanke: Kunst und Erzählungen machen sichtbar, WIE wir sehen —
 * sie prägen unseren Blick auf KI, lange bevor wir sie begriffen haben.
 * Inhalt wird laufend ausgebaut (Skript folgt in docs/skripte/).
 */

export default function Lernseite2KulturellePerspektive() {
  return (
    <AppLayout>
      <ActivityTracker
        type="lesson_open"
        page="lernseite-2/kulturelle-perspektive"
        lessonId="lernseite-2-kulturelle-perspektive"
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
              Thema 03 · Bilder &amp; Erzählungen
            </p>
            <h1 className="mt-sm text-headline-xl text-on-surface">
              Kulturelle Perspektive
            </h1>
            <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
              Kunst macht unseren Blick sichtbar — sie zeigt uns, was wir
              sehen. Erzählungen und Bilder prägen, was wir in der KI
              erkennen, lange bevor wir sie begriffen haben.
            </p>
          </div>
          <Signatur variante="gewebe" className="hidden flex-shrink-0 sm:block" />
        </div>
      </header>

      {/* Interaktives Muster: dem Faden nachfahren, Weisheiten einsammeln */}
      <WeisheitsFaden
        className="mt-xl max-w-3xl"
        weisheiten={[
          {
            text: "Kunst gibt nicht das Sichtbare wieder, sondern macht sichtbar",
            quelle: "Paul Klee",
            kommentar: "Genau darum geht es hier: sehen, wie wir sehen.",
          },
          {
            text: "Man erblickt nur, was man schon weiss und versteht",
            quelle: "Johann Wolfgang von Goethe",
            kommentar: "Unsere Bilder entscheiden, was wir in der KI erkennen.",
          },
          {
            text: "Das Leben ahmt die Kunst weit mehr nach als die Kunst das Leben",
            quelle: "Oscar Wilde",
            kommentar: "Science-Fiction schrieb das Drehbuch, lange bevor KI kam.",
          },
        ]}
      />

      <section className="mt-xl max-w-3xl space-y-md text-body-md text-on-surface-variant">
        <p>
          Wer heute mit KI spricht, tut das nie unvoreingenommen: Der Golem,
          Frankensteins Geschöpf, HAL 9000 oder Data — die Kultur hat die
          Begegnung mit künstlichen Gegenübern hundertfach durchgespielt,
          zwischen Faszination und Bedrohung. Diese Bilder sitzen tief und
          färben, wie wir der neuen Akteurin begegnen: als Wundermaschine, als
          Konkurrentin, als unheimlichem Wesen.
        </p>
        <p>
          Zugleich arbeitet die Gegenwartskunst längst <em>mit</em> und{" "}
          <em>über</em> KI — und hält uns damit den Spiegel vor: Sie macht
          sichtbar, welche Daten, welche Menschen und welche Vorannahmen in den
          Systemen stecken. Dieser Themenbereich folgt beiden Spuren — den
          alten Erzählungen und den neuen Werken.
        </p>
      </section>

      <FadenDivider className="mt-xl" />

      <div className="mt-xl flex max-w-3xl items-center gap-sm rounded-xl border border-outline-variant bg-surface-container-low px-md py-sm">
        <span className="material-symbols-outlined text-[20px] text-tertiary">
          construction
        </span>
        <p className="text-label-md text-on-surface-variant">
          Im Aufbau — die Inhalte dieses Themenbereichs entstehen gerade und
          werden laufend ergänzt.
        </p>
      </div>
    </AppLayout>
  );
}
