import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import { FadenDivider, Signatur } from "../_components/Gewebe";
import KnotenLandschaft from "../_components/KnotenLandschaft";

/**
 * Thema 01 — «Vorhang auf: eine neue Akteurin».
 *
 * Drei Knotenlandschaften, überall derselbe Ablauf: Punkte antippen oder
 * Verbindungen einloggen — die Inhalte (maximal zwei Sätze, ohne Zitat)
 * blenden sich ein, die Punkte werden beschriftet. Kein Zentrum, nirgends.
 *
 *  1. Die KI-Story — linear erzählt (Serpentine), aber mit feinen
 *     Einfluss-Bögen zwischen Stationen, die einander prägen; per Zufall
 *     lassen sich drei Stationen ziehen, und die Anordnung ist umschaltbar
 *     (zeitlich / Mensch·Maschine·Fiktion / technologisch).
 *  2. Die Merkmale der neuen Akteurin — loses Geflecht aus sieben Punkten,
 *     zwischen besuchten Punkten füllen sich die Flächen.
 *  3. Das Netz der Akteurin — die KI als ein Knoten unter sieben, ohne
 *     Zentrum: Wer mit ihr spricht, zieht am ganzen Geflecht.
 *
 * Jede Landschaft hat eine leicht andere Bühnen-Tönung (Theme-Tokens).
 * Bilder: public/art/storyboard/ (Nachweis in public/art/CREDITS.md).
 */

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
        <div className="flex items-end justify-between gap-md">
          <div className="min-w-0">
            <p className="text-label-md uppercase tracking-wider text-tertiary">
              Thema 01 · Auftakt
            </p>
            <h1 className="mt-sm text-headline-xl text-on-surface">
              Vorhang auf — eine neue Akteurin
            </h1>
            <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
              Mit KI ist eine neue Art von Akteurin aufgetreten — weder ein
              klassisches Werkzeug noch eine Person. Drei Knotenlandschaften
              zum Verbinden: ihre Geschichte, ihre Merkmale, ihr Netz.
            </p>
          </div>
          <Signatur variante="auftritt" className="hidden flex-shrink-0 sm:block" />
        </div>
      </header>

      {/* 1 — Die KI-Story als lineare Knotenlandschaft mit Einfluss-Bögen */}
      <section className="mt-xl max-w-5xl" aria-label="Die KI-Story">
        <h2 className="text-headline-lg text-on-surface">Die KI-Story</h2>
        <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
          Vom Traum, Dingen Leben einzuhauchen, bis zur Gegenwart: zwölf
          Stationen. Die Geschichte ist linear — aber ihre Vorstellungen
          beeinflussen einander quer durch die Zeit.
        </p>
        <KnotenLandschaft
          className="mt-lg"
          ariaLabel="Knotenlandschaft: Die KI-Story"
          hoehe={260}
          svgKlasse="aspect-[720/360] sm:aspect-[720/260]"
          buehneKlasse="bg-primary-container/20"
          spurKey="vorhang-auf:story"
          kantenSpurKey="vorhang-auf:kanten-story"
          zufall={3}
          zufallLabel="Drei Stationen ziehen"
          einladung="Zwölf Stationen — ziehe drei per Zufall oder tippe Punkte und Verbindungen direkt an. Wechsle die Anordnung: zeitlich, Mensch · Maschine · Fiktion oder technologisch."
          abschluss="Der Traum vom belebten Ding ist viel älter als der Computer: Was heute auftritt, trägt Mythen, Mechanik, Regeln und Daten in sich. Die Linie läuft weiter — ihr nächstes Stück ist offen."
          knoten={[
            {
              titel: "Der Golem",
              kurz: "Golem",
              jahr: "Sage",
              text: "Aus Lehm geformt, durch Schriftzeichen belebt. Die Ursage vom Menschen, der einem Ding Leben einhaucht.",
              bild: {
                src: "/art/storyboard/golem.jpg",
                alt: "Zeichnung: Rabbi Löw erweckt den Golem",
                credit: "Mikoláš Aleš, 1899 · gemeinfrei",
              },
            },
            {
              titel: "Der Homunkulus",
              kurz: "Homunkulus",
              jahr: "Alchemie",
              text: "Leben aus der Retorte, im Labor erschaffen. Der Traum, Schöpfung technisch herzustellen.",
              bild: {
                src: "/art/storyboard/homunkulus.jpg",
                alt: "Stich: Wagner und Mephisto vor dem Homunkulus in der Phiole (Faust II)",
                credit: "F. Simm, Illustration zu «Faust II» · gemeinfrei",
              },
            },
            {
              titel: "Frühe Automaten",
              kurz: "Automaten",
              jahr: "1770",
              text: "Der «Schachtürke» scheint zu denken — und täuscht ganz Europa. Mechanik weckt erstmals den Verdacht, Maschinen könnten klug sein.",
              bild: {
                src: "/art/storyboard/schachtuerke.jpg",
                alt: "Kupferstich des Schachtürken von Wolfgang von Kempelen",
                credit: "J. F. zu Racknitz, 1789 · gemeinfrei",
              },
            },
            {
              titel: "Frankenstein",
              kurz: "Frankenstein",
              jahr: "1818",
              text: "Das erschaffene Wesen entgleitet seinem Schöpfer. Die Literatur stellt die Verantwortungsfrage — lange vor der Technik.",
              bild: {
                src: "/art/storyboard/frankenstein.jpg",
                alt: "Frontispiz der Frankenstein-Ausgabe von 1831",
                credit: "Th. von Holst, Frontispiz 1831 · gemeinfrei",
              },
            },
            {
              titel: "Rechenmaschinen",
              kurz: "Rechenmaschinen",
              jahr: "1685–1843",
              text: "Von Leibniz' Rechenrad zu Babbage und Lovelace: Die programmierbare Maschine wird gedacht. Denken als Rechnen wird vorstellbar.",
              bild: {
                src: "/art/storyboard/babbage.jpg",
                alt: "Holzstich der Differenzmaschine von Charles Babbage",
                credit: "Holzstich, 1853 · gemeinfrei",
              },
            },
            {
              titel: "Geburt der KI",
              kurz: "Dartmouth",
              jahr: "1956",
              text: "In Dartmouth wird der Begriff «Künstliche Intelligenz» geprägt. Aus alten Träumen wird ein Forschungsprogramm.",
            },
            {
              titel: "Symbolische KI",
              kurz: "Symbolische KI",
              jahr: "1960er",
              text: "Intelligenz als Regelwerk: WENN–DANN-Systeme dominieren. Logik gilt als Königsweg.",
            },
            {
              titel: "Expertensysteme",
              kurz: "Expertensysteme",
              jahr: "1970/80er",
              text: "Fachwissen wird in Regeln gegossen und löst Spezialaufgaben. Die erhoffte breite Intelligenz bleibt aus.",
            },
            {
              titel: "KI-Winter",
              kurz: "KI-Winter",
              jahr: "1980/90er",
              text: "Enttäuschte Erwartungen: Geld und Glaube frieren ein. Die grossen Versprechen überwintern.",
            },
            {
              titel: "Statistische KI",
              kurz: "Statistische KI",
              jahr: "1990er",
              text: "Die Wende: Maschinen lernen aus Beispielen statt aus Regeln. Daten werden wichtiger als Logik.",
            },
            {
              titel: "Deep Learning",
              kurz: "Deep Learning",
              jahr: "ab 2012",
              text: "Neuronale Netze mit vielen Schichten erkennen Bilder und Sprache. Der Durchbruch kommt über die Tiefe.",
            },
            {
              titel: "Big Data & Gegenwart",
              kurz: "Gegenwart",
              jahr: "heute",
              text: "Riesige Datenmengen und Rechenzentren machen die neue Akteurin möglich. KI durchdringt den Alltag.",
              bild: {
                src: "/art/storyboard/supercomputer.jpg",
                alt: "Rechnerreihen des Pleiades-Supercomputers der NASA",
                credit: "NASA (Pleiades) · gemeinfrei (US-Gov)",
              },
            },
          ]}
          anordnungen={[
            {
              id: "zeit",
              label: "Zeitlich",
              hinweis:
                "Die Geschichte als Linie — feine Bögen zeigen, wo Vorstellungen einander beeinflussen.",
              pos: [
                [66, 56],
                [182, 56],
                [298, 56],
                [414, 56],
                [530, 56],
                [646, 56],
                [646, 186],
                [530, 186],
                [414, 186],
                [298, 186],
                [182, 186],
                [66, 186],
              ],
              kanten: [
                { von: 0, zu: 1 },
                { von: 1, zu: 2 },
                { von: 2, zu: 3 },
                { von: 3, zu: 4 },
                { von: 4, zu: 5 },
                { von: 5, zu: 6 },
                { von: 6, zu: 7 },
                { von: 7, zu: 8 },
                { von: 8, zu: 9 },
                { von: 9, zu: 10 },
                { von: 10, zu: 11 },
                { von: 0, zu: 3, fein: true, bogen: -46 },
                { von: 2, zu: 5, fein: true, bogen: -30 },
                { von: 4, zu: 6, fein: true },
                { von: 9, zu: 11, fein: true, bogen: -50 },
              ],
            },
            {
              id: "mmf",
              label: "Mensch · Maschine · Fiktion",
              hinweis:
                "Drei Stränge: erzählte Wesen, menschliche Erwartungen, gebaute Maschinen.",
              pos: [
                [96, 70],
                [70, 150],
                [478, 42],
                [150, 205],
                [600, 58],
                [320, 60],
                [668, 120],
                [560, 120],
                [350, 160],
                [486, 190],
                [600, 200],
                [676, 215],
              ],
              kanten: [
                { von: 0, zu: 1 },
                { von: 1, zu: 3 },
                { von: 5, zu: 8 },
                { von: 2, zu: 4 },
                { von: 4, zu: 6 },
                { von: 6, zu: 7 },
                { von: 7, zu: 9 },
                { von: 9, zu: 10 },
                { von: 10, zu: 11 },
                { von: 0, zu: 5, fein: true },
                { von: 5, zu: 6, fein: true },
                { von: 8, zu: 9, fein: true },
              ],
              beschriftungen: [
                { x: 64, y: 26, text: "Fiktion" },
                { x: 296, y: 26, text: "Mensch" },
                { x: 520, y: 20, text: "Maschine" },
              ],
            },
            {
              id: "tech",
              label: "Technologisch",
              hinweis:
                "Vier Stränge: Erzählungen, Mechanik, Regeln, Daten — Einflüsse springen über.",
              pos: [
                [110, 42],
                [280, 42],
                [180, 108],
                [450, 42],
                [400, 108],
                [140, 174],
                [330, 174],
                [520, 174],
                [660, 174],
                [200, 232],
                [420, 232],
                [640, 232],
              ],
              kanten: [
                { von: 0, zu: 1 },
                { von: 1, zu: 3 },
                { von: 2, zu: 4 },
                { von: 5, zu: 6 },
                { von: 6, zu: 7 },
                { von: 7, zu: 8 },
                { von: 9, zu: 10 },
                { von: 10, zu: 11 },
                { von: 1, zu: 2, fein: true },
                { von: 4, zu: 6, fein: true },
                { von: 8, zu: 9, fein: true },
              ],
              beschriftungen: [
                { x: 36, y: 22, text: "Erzählung" },
                { x: 36, y: 90, text: "Mechanik" },
                { x: 36, y: 156, text: "Regeln & Symbole" },
                { x: 36, y: 214, text: "Daten & Lernen" },
              ],
            },
          ]}
        />
      </section>

      <FadenDivider className="mt-xl" />

      {/* 2 — Die Merkmale als loses Geflecht (ohne Zitate, ohne Zentrum) */}
      <section className="mt-xl max-w-5xl" aria-label="Die Merkmale der neuen Akteurin">
        <h2 className="text-headline-lg text-on-surface">
          Die Merkmale der neuen Akteurin
        </h2>
        <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
          Was ist da eigentlich aufgetreten? Sieben Eigenschaften — nicht eine
          allein, ihre Bündelung macht das Neue aus.
        </p>
        <KnotenLandschaft
          className="mt-lg"
          ariaLabel="Knotenlandschaft: Die Merkmale"
          hoehe={230}
          svgKlasse="aspect-[720/310] sm:aspect-[720/230]"
          spurKey="vorhang-auf:weisheit"
          kantenSpurKey="vorhang-auf:kanten-weisheit"
          einladung="Sieben Merkmale, lose verwoben — tippe die Punkte an oder logge Verbindungen ein. Zwischen besuchten Punkten füllen sich die Flächen; ist das Muster gewoben, erscheint darunter das Fazit."
          abschluss="Diese sieben Eigenschaften treffen sich in einem einzigen Gegenüber — und darin liegt das eigentlich Neue: Nicht eine einzelne Fähigkeit, sondern ihre Bündelung macht die KI zu einer Akteurin. Sie spricht, erzeugt, erkennt, lernt, erinnert, handelt und verbindet die Sinne — und wird so zu etwas, dem wir mehr Potenzial zurechnen, auf unser Handeln Einfluss zu nehmen, als je einer Technik zuvor."
          knoten={[
            {
              titel: "dialoghaft",
              text: "Man steuert sie mit Alltagssprache — und sie antwortet in Sprache. Das Gespräch selbst ist die Bedienoberfläche.",
            },
            {
              titel: "generativ",
              text: "Sie erzeugt laufend Neues — Text, Bild, Code — durch Vorhersage des nächsten Bausteins. Erzeugen und Erfinden liegen dabei dicht beieinander.",
            },
            {
              titel: "multimodal",
              text: "Text, Bild und Ton laufen in einem einzigen Modell zusammen. Sie liest, sieht und hört — und antwortet in allen drei Formen.",
            },
            {
              titel: "agentenhaft",
              text: "Sie zerlegt Ziele in Schritte und greift selbständig zu Werkzeugen. Aus dem Antwortgeber wird ein handelnder Akteur.",
            },
            {
              titel: "speicherabhängig",
              text: "Ihr ganzes Können steckt in gespeicherten Gewichten — wo kein Speicher, da kein Training. Auch im Betrieb braucht sie Kurz- und Langzeitgedächtnis.",
            },
            {
              titel: "datenbasiert",
              text: "Ihre Fähigkeiten wachsen aus riesigen Datenmengen, nicht aus einprogrammierten Regeln. Ohne Daten bleibt der beste Algorithmus leer.",
            },
            {
              titel: "mustererkennend",
              text: "Sie liest statistische Muster aus Daten und wendet sie verlässlich an. Warum etwas passt, versteht sie nicht.",
            },
          ]}
          anordnungen={[
            {
              id: "geflecht",
              label: "Geflecht",
              pos: [
                [300, 26],
                [598, 40],
                [652, 150],
                [430, 196],
                [196, 190],
                [64, 128],
                [108, 50],
              ],
              kanten: [
                { von: 6, zu: 1 },
                { von: 5, zu: 0 },
                { von: 0, zu: 3 },
                { von: 5, zu: 3 },
                { von: 1, zu: 2 },
                { von: 2, zu: 4 },
                { von: 4, zu: 6 },
                { von: 3, zu: 1, fein: true },
                { von: 0, zu: 2, fein: true },
              ],
            },
          ]}
          flaechen={[
            { punkte: [[64, 128], [300, 26], [430, 196]], knoten: [5, 0, 3] },
            { punkte: [[300, 26], [598, 40], [430, 196]], knoten: [0, 1, 3] },
            { punkte: [[598, 40], [652, 150], [430, 196]], knoten: [1, 2, 3] },
            { punkte: [[108, 50], [300, 26], [64, 128]], knoten: [6, 0, 5] },
            { punkte: [[196, 190], [430, 196], [64, 128]], knoten: [4, 3, 5] },
          ]}
        />
      </section>

      <FadenDivider className="mt-xl" />

      {/* 3 — Das Netz der Akteurin: die KI als ein Knoten unter sieben */}
      <section className="mt-xl max-w-5xl" aria-label="Das Netz der Akteurin">
        <h2 className="text-headline-lg text-on-surface">Das Netz der Akteurin</h2>
        <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
          Die neue Akteurin steht nie allein: Wer mit ihr spricht, zieht an
          einem ganzen Geflecht — und sie ist darin ein Knoten unter Knoten.
        </p>
        <KnotenLandschaft
          className="mt-lg"
          ariaLabel="Knotenlandschaft: Das Netz der Akteurin"
          hoehe={230}
          svgKlasse="aspect-[720/310] sm:aspect-[720/230]"
          buehneKlasse="bg-secondary-container/25"
          spurKey="vorhang-auf:netz"
          kantenSpurKey="vorhang-auf:kanten-netz"
          einladung="Sieben Knoten, kein Zentrum — tippe an, wer und was mitzieht, wenn du mit der Akteurin sprichst."
          abschluss="Wer mit der neuen Akteurin spricht, zieht am ganzen Geflecht: an Menschen und ihrer Sprache, an Hallen voller Rechner, an Minen, Firmen und Gesetzen. Sie hat kein Zentrum — sie ist das Netz."
          knoten={[
            {
              titel: "KI — die neue Akteurin",
              kurz: "KI",
              text: "Sie steht nie allein: Was sie kann, hängt am ganzen Geflecht. Kein Zentrum — ein Knoten unter Knoten.",
            },
            {
              titel: "Nutzer:innen",
              text: "Deine Fragen und Formulierungen führen sie; ohne Eingabe bleibt sie stumm. Mit dir wird sie zur Mitspielerin.",
            },
            {
              titel: "Sprache",
              text: "Gelernt aus Milliarden Sätzen — unsere Wörter sind ihr Material. Auch unsere Fehler stecken darin.",
            },
            {
              titel: "Datencentren",
              text: "Jede Antwort läuft durch riesige Rechenhallen. Strom, Kühlung und Seekabel inklusive.",
            },
            {
              titel: "Rohstoffe",
              text: "Chips brauchen Metalle, Minen und Fabriken. Die Akteurin hat ein materielles Gewicht.",
            },
            {
              titel: "Unternehmen",
              text: "Firmen bauen, trainieren und steuern sie — mit eigenen Zielen und Geschäftsmodellen.",
            },
            {
              titel: "Regeln",
              text: "Gesetze und Abmachungen bestimmen, was sie darf. Und wer haftet, wenn etwas schiefgeht.",
            },
          ]}
          anordnungen={[
            {
              id: "netz",
              label: "Netz",
              pos: [
                [430, 96],
                [120, 52],
                [306, 34],
                [642, 58],
                [596, 188],
                [330, 198],
                [92, 162],
              ],
              kanten: [
                { von: 1, zu: 2 },
                { von: 2, zu: 0 },
                { von: 0, zu: 3 },
                { von: 3, zu: 4 },
                { von: 4, zu: 5 },
                { von: 5, zu: 0 },
                { von: 5, zu: 6 },
                { von: 6, zu: 1 },
                { von: 2, zu: 5, fein: true },
                { von: 0, zu: 4, fein: true },
              ],
            },
          ]}
          flaechen={[
            { punkte: [[306, 34], [430, 96], [330, 198]], knoten: [2, 0, 5] },
            { punkte: [[430, 96], [642, 58], [596, 188]], knoten: [0, 3, 4] },
            { punkte: [[120, 52], [306, 34], [92, 162]], knoten: [1, 2, 6] },
            { punkte: [[92, 162], [330, 198], [120, 52]], knoten: [6, 5, 1] },
          ]}
        />
      </section>

      <FadenDivider className="mt-xl" />

      {/* Der Faden läuft weiter */}
      <section className="mt-xl max-w-3xl" aria-label="Weiter im Modul">
        <h2 className="text-headline-md text-on-surface">Der Faden läuft weiter</h2>
        <p className="mt-sm text-body-md text-on-surface-variant">
          Die philosophische Perspektive nimmt die neue Akteurin in den Blick:
        </p>
        <div className="mt-lg">
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
        </div>
      </section>
    </AppLayout>
  );
}
