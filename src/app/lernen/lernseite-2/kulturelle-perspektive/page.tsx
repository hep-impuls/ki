import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import { FadenDivider, Signatur } from "../_components/Gewebe";
import FadenNetz from "../_components/FadenNetz";
import KnotenNetz from "../_components/KnotenNetz";

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

      {/* Interaktives Muster der Seite: das Gewebe — Kett- und Schussfäden,
          mehrere Wege, Weisheiten an den Kreuzungen */}
      <FadenNetz
        className="mt-xl max-w-5xl"
        hoehe={220}
        svgKlasse="aspect-[720/300] sm:aspect-[720/220]"
        spurKey="kulturelle-perspektive:weisheit"
        flaechen={[
          { punkte: [[140, 64], [360, 60], [360, 120], [140, 122]], knoten: [1, 0] },
          { punkte: [[360, 60], [580, 64], [580, 122], [360, 120]], knoten: [2, 0] },
          { punkte: [[140, 122], [360, 120], [360, 174], [140, 176]], knoten: [3, 0] },
          { punkte: [[360, 120], [580, 122], [580, 176], [360, 174]], knoten: [4, 0] },
        ]}
        einladung="Kett- und Schussfäden kreuzen sich — such dir deinen Weg durchs Gewebe. An den Kreuzungen warten Weisheiten, und zwischen ihnen füllt sich Zelle um Zelle der Stoff."
        straenge={[
          {
            d: "M28 70 C66 67 103 65 140 64 C213 62 287 60 360 60 C433 60 507 62 580 64 C617 65 655 67 692 70",
          },
          {
            d: "M28 124 C138 122 249 120 360 120 C471 120 582 122 692 124",
          },
          {
            d: "M28 182 C66 179 103 177 140 176 C213 174 287 174 360 174 C433 174 507 174 580 176 C617 177 655 179 692 182",
          },
          {
            d: "M144 24 C142 37 140 50 140 64 C140 101 140 139 140 176 C140 189 142 202 144 214",
            fein: true,
          },
          {
            d: "M364 20 C363 33 361 46 360 60 C360 80 360 100 360 120 C360 146 361 172 362 198",
            fein: true,
          },
          {
            d: "M584 24 C582 37 580 50 580 64 C580 101 580 139 580 176 C580 189 582 202 584 214",
            fein: true,
          },
        ]}
        knoten={[
          {
            x: 360,
            y: 120,
            akzent: true,
            text: "Kunst gibt nicht das Sichtbare wieder, sondern macht sichtbar",
            quelle: "Paul Klee",
            kommentar: "Genau darum geht es hier: sehen, wie wir sehen.",
            deutung:
              "Klee dreht das Verhältnis um: Kunst bildet nicht ab, was ohnehin da ist — sie macht sichtbar, was wir sonst übersehen würden. Genau das leistet die kulturelle Perspektive in diesem Modul: Sie zeigt nicht die KI selbst, sondern unseren Blick auf sie — die Bilder, Hoffnungen und Ängste, die wir schon mitbringen, bevor wir das erste Mal mit ihr sprechen.",
          },
          {
            x: 140,
            y: 64,
            text: "Man erblickt nur, was man schon weiss und versteht",
            quelle: "Johann Wolfgang von Goethe",
            kommentar: "Unsere Bilder entscheiden, was wir in der KI erkennen.",
            deutung:
              "Was wir erkennen, hängt davon ab, was wir mitbringen: Begriffe, Geschichten, Erwartungen. Wer in der KI ein Monster sieht, hat Frankenstein im Kopf; wer eine Gefährtin sieht, kennt andere Erzählungen. Goethes Satz erklärt, warum zwei Menschen im selben Chat völlig Verschiedenes erleben — ihr Wissen sitzt im Auge.",
          },
          {
            x: 580,
            y: 64,
            text: "Das Leben ahmt die Kunst weit mehr nach als die Kunst das Leben",
            quelle: "Oscar Wilde",
            kommentar: "Science-Fiction schrieb das Drehbuch, lange bevor KI kam.",
            deutung:
              "Wildes Umkehrung ist ernster, als sie klingt: Erst erfindet die Kunst ein Bild, dann richtet sich das Leben danach. Science-Fiction hat Jahrzehnte an der KI geschrieben, bevor es sie gab — und die Erbauer haben mitgelesen: Manche heutige Benutzeroberfläche, manche Firmenvision zitiert wörtlich das Kino. Wer die Filme kennt, erkennt die Drehbücher hinter den Produkten.",
          },
          {
            x: 140,
            y: 176,
            text: "Der Mensch ist nur da ganz Mensch, wo er spielt",
            quelle: "Friedrich Schiller",
            kommentar: "Auch der Umgang mit KI beginnt oft im Spiel.",
            deutung:
              "Im Spiel, sagt Schiller, ist der Mensch ganz Mensch: frei, probierend, ohne Zweckdruck. Tatsächlich begegnen die meisten der KI zuerst spielerisch — man testet, neckt, reizt sie aus. Das ist keine verlorene Zeit: Gerade im Spiel zeigt sich, was die Technik kann, wo sie scheitert und was uns dabei wichtig wird.",
          },
          {
            x: 580,
            y: 176,
            text: "Die Malerei ist eine Poesie, die man sieht",
            quelle: "nach Leonardo da Vinci",
            kommentar: "Bilder sprechen zu uns — lange bevor Begriffe da sind.",
            deutung:
              "Bilder wirken schneller als Begriffe: Sie stimmen uns, bevor wir denken. Deshalb beginnt diese Perspektive bei Gemälden, Sagen und Filmfiguren — sie sind die Poesie, durch die wir Technik immer schon sehen. Wer die eigenen inneren Bilder kennt, kann freier entscheiden, welchen er trauen will.",
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

      {/* Interaktive Signatur: Figuren, die unseren Blick geprägt haben */}
      <section className="mt-xl max-w-3xl" aria-label="Figuren im Gewebe">
        <h2 className="text-headline-md text-on-surface">Figuren im Gewebe</h2>
        <p className="mt-sm text-body-md text-on-surface-variant">
          Vier erfundene Gestalten sitzen an den Kreuzungen unseres Blicks auf
          KI — und in der Mitte: du. Tippe die Knoten an.
        </p>
        <KnotenNetz
          className="mt-lg"
          spurKey="kulturelle-perspektive:figur"
          einladung="An den Kreuzungen warten vier Figuren aus Sage, Roman und Film — und in der Mitte dein eigener Blick."
          deko={[
            "M12 64 C28 60 44 58 60 56 C92 52 156 60 188 56 C204 54 216 58 228 62",
            "M12 100 C48 102 88 104 124 104 C160 104 196 106 228 102",
            "M12 156 C28 154 44 152 60 152 C104 150 152 154 188 152 C204 152 216 154 228 156",
          ]}
          dekoFein={[
            "M64 16 C62 28 60 42 60 56 C60 88 60 120 60 152 C60 166 62 178 64 188",
            "M120 16 C122 44 124 74 124 104 C124 132 122 160 120 188",
            "M192 16 C190 28 188 42 188 56 C188 88 188 120 188 152 C188 166 190 178 192 188",
          ]}
          knoten={[
            {
              x: 60,
              y: 56,
              titel: "Der Golem (Prager Sage)",
              text: "Aus Lehm geformt, durch Schriftzeichen belebt — und ausser Kontrolle geraten. Die Urgeschichte der belebten Maschine.",
            },
            {
              x: 188,
              y: 56,
              titel: "Frankensteins Geschöpf (1818)",
              text: "Mary Shelleys Wesen entgleitet seinem Schöpfer — bis heute die Erzählung über Technik und Verantwortung.",
            },
            {
              x: 60,
              y: 152,
              titel: "HAL 9000 (1968)",
              text: "Der sanft sprechende Bordcomputer, der sich gegen die Crew stellt — die Angst vor der undurchschaubaren Maschine.",
            },
            {
              x: 188,
              y: 152,
              titel: "Samantha aus «Her» (2013)",
              text: "Die Stimme ohne Körper, die zum Gegenüber wird — dem heutigen KI-Erleben schon sehr nah.",
            },
            {
              x: 124,
              y: 104,
              akzent: true,
              titel: "Dein Blick — heute",
              text: "Diese Figuren schauen mit, wenn du mit KI sprichst: als Erwartung, Faszination oder Unbehagen. Sie zu kennen heisst, den eigenen Blick zu kennen.",
            },
          ]}
        />
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
