import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import { FadenDivider, Signatur } from "../_components/Gewebe";
import KnotenLandschaft from "../_components/KnotenLandschaft";
import StoryGewebe from "../_components/StoryGewebe";
import BilderSet, { type Bild } from "../_components/BilderSet";
import AktivitaetsNetzFloat from "../_components/AktivitaetsNetzFloat";

/**
 * Thema 01 — «Vorhang auf: eine neue Akteurin».
 *
 * Ein schwebendes Aktivitätsnetz misst laufend, was man tut (Knoten,
 * Kombinationen, Bilder). Darunter drei interaktive Landschaften, dazwischen
 * eine Bilderstrecke:
 *
 *  1. Die KI-Story — als flexibles Gewebe (frei ziehbar) oder als hängende
 *     Perlenschnur (zeitlich); Punkte antippen öffnet die Geschichte.
 *  2. Bilderstrecke — die gemeinfreien historischen Bilder als Set zum
 *     Durchgehen; Hover erklärt, Ansehen zählt fürs Aktivitätsnetz.
 *  3. Die Merkmale der neuen Akteurin — loses Geflecht aus sieben Punkten.
 *  4. Das Netz der Akteurin — die KI als ein Knoten unter sieben.
 *
 * Bilder: public/art/storyboard/ (Nachweis in public/art/CREDITS.md).
 */

/** Die gemeinfreien Bilder als eigenständige Strecke (aus der Story gelöst). */
const BILDER: Bild[] = [
  {
    src: "/art/storyboard/golem.jpg",
    alt: "Zeichnung: Rabbi Löw erweckt den Golem",
    titel: "Der Golem",
    jahr: "Sage",
    erklaerung:
      "Aus Lehm geformt, durch Schriftzeichen belebt — und wieder stillgelegt, als er entgleitet. Die Ursage vom belebten Ding handelt schon vom Kontrollverlust.",
    credit: "Mikoláš Aleš, 1899 · gemeinfrei",
  },
  {
    src: "/art/storyboard/homunkulus.jpg",
    alt: "Stich: Wagner und Mephisto vor dem Homunkulus in der Phiole (Faust II)",
    titel: "Der Homunkulus",
    jahr: "Alchemie",
    erklaerung:
      "Künstliches Leben aus der Retorte — bei Paracelsus und in Goethes «Faust II». Der Traum, Schöpfung nicht zu empfangen, sondern selbst herzustellen.",
    credit: "F. Simm, Illustration zu «Faust II» · gemeinfrei",
  },
  {
    src: "/art/storyboard/schachtuerke.jpg",
    alt: "Kupferstich des Schachtürken von Wolfgang von Kempelen",
    titel: "Der Schachtürke",
    jahr: "1770",
    erklaerung:
      "Ein Automat schlägt Fürsten im Schach — im Innern sass ein versteckter Mensch. Die Täuschung zeigt, wie bereitwillig wir Maschinen Denken zutrauen.",
    credit: "J. F. zu Racknitz, 1789 · gemeinfrei",
  },
  {
    src: "/art/storyboard/frankenstein.jpg",
    alt: "Frontispiz der Frankenstein-Ausgabe von 1831",
    titel: "Frankenstein",
    jahr: "1818",
    erklaerung:
      "Victor Frankenstein verstösst sein Geschöpf im Augenblick des Gelingens. Das Ungeheuer ist die verweigerte Verantwortung — nicht die Kreatur.",
    credit: "Th. von Holst, Frontispiz 1831 · gemeinfrei",
  },
  {
    src: "/art/storyboard/babbage.jpg",
    alt: "Holzstich der Differenzmaschine von Charles Babbage",
    titel: "Rechenmaschinen",
    jahr: "1685–1843",
    erklaerung:
      "Von Leibniz' Rechenrad zu Babbages Analytical Engine und Ada Lovelaces erstem Programm: Denken wird als Rechnen vorstellbar.",
    credit: "Holzstich, 1853 · gemeinfrei",
  },
  {
    src: "/art/storyboard/supercomputer.jpg",
    alt: "Rechnerreihen des Pleiades-Supercomputers der NASA",
    titel: "Big Data & Gegenwart",
    jahr: "heute",
    erklaerung:
      "Riesige Datenmengen in Rechenzentren mit Zehntausenden von Chips machen die neue Akteurin möglich — dialogfähig und generativ.",
    credit: "NASA (Pleiades) · gemeinfrei (US-Gov)",
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

      {/* Aktivitätsnetz als mitwanderndes Symbol (schwebt unten rechts, geht
          beim Klick zum vollen Netz auf) */}
      <AktivitaetsNetzFloat />

      {/* 1 — Die KI-Story als lineare Knotenlandschaft mit Einfluss-Bögen */}
      <section className="mt-xl max-w-5xl" aria-label="Die KI-Story">
        <h2 className="text-headline-lg text-on-surface">Die KI-Story</h2>
        <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
          Vom Traum, Dingen Leben einzuhauchen, bis zur Gegenwart: zwölf
          Stationen. Die Geschichte ist linear — aber ihre Vorstellungen
          beeinflussen einander quer durch die Zeit.
        </p>
        <StoryGewebe
          className="mt-lg"
          spurKey="vorhang-auf:story"
          buehneKlasse="bg-primary-container/20"
          einfluesse={[
            { von: 0, zu: 3 },
            { von: 1, zu: 3 },
            { von: 2, zu: 5 },
            { von: 4, zu: 6 },
            { von: 8, zu: 9 },
            { von: 3, zu: 11 },
          ]}
          stationen={[
            {
              titel: "Der Golem",
              kurz: "Golem",
              kat: "erzaehlung",
              mmf: "fiktion",
              jahr: "Sage",
              text: "Aus Lehm geformt, durch Schriftzeichen belebt. Die Ursage vom Menschen, der einem Ding Leben einhaucht.",
              geschichte:
                "Die Prager Sage erzählt von Rabbi Löw, der aus Lehm eine Gestalt formt und sie durch Schriftzeichen zum Leben erweckt — und der sie wieder stilllegen muss, als sie ihm entgleitet. Schon die Ursage handelt nicht nur vom Erschaffen, sondern vom Kontrollverlust: Wer belebt, muss hüten können.",
            },
            {
              titel: "Der Homunkulus",
              kurz: "Homunkulus",
              kat: "erzaehlung",
              mmf: "fiktion",
              jahr: "Alchemie",
              text: "Leben aus der Retorte, im Labor erschaffen. Der Traum, Schöpfung technisch herzustellen.",
              geschichte:
                "Alchemisten wie Paracelsus beschrieben Rezepte, um künstliches Leben in der Retorte zu zeugen; in Goethes «Faust II» leuchtet der Homunkulus als Menschlein in der Phiole. Der Traum dahinter: Schöpfung nicht mehr empfangen, sondern selbst herstellen — im Labor, aus Wissen und Handwerk.",
            },
            {
              titel: "Frühe Automaten",
              kurz: "Automaten",
              kat: "mechanik",
              mmf: "maschine",
              jahr: "1770",
              text: "Der «Schachtürke» scheint zu denken — und täuscht ganz Europa. Mechanik weckt erstmals den Verdacht, Maschinen könnten klug sein.",
              geschichte:
                "Wolfgang von Kempelens Schach spielender «Türke» schlug ab 1770 Fürsten und Kaiser — im Innern sass ein verborgener Mensch. Europa stritt jahrzehntelang darüber, ob eine Maschine denken könne; die Täuschung bewies vor allem eines: wie bereitwillig wir es glauben.",
            },
            {
              titel: "Frankenstein",
              kurz: "Frankenstein",
              kat: "erzaehlung",
              mmf: "fiktion",
              jahr: "1818",
              text: "Das erschaffene Wesen entgleitet seinem Schöpfer. Die Literatur stellt die Verantwortungsfrage — lange vor der Technik.",
              geschichte:
                "Mary Shelleys Roman von 1818 lässt Victor Frankenstein ein Wesen erschaffen, das er im Augenblick des Gelingens verstösst. Das eigentliche Ungeheuer der Geschichte ist nicht die Kreatur, sondern die verweigerte Verantwortung — eine Frage, die seither jede Schöpfungstechnik begleitet.",
            },
            {
              titel: "Rechenmaschinen",
              kurz: "Rechenmaschinen",
              kat: "mechanik",
              mmf: "maschine",
              jahr: "1685–1843",
              text: "Von Leibniz' Rechenrad zu Babbage und Lovelace: Die programmierbare Maschine wird gedacht. Denken als Rechnen wird vorstellbar.",
              geschichte:
                "Leibniz baute um 1673 eine Maschine für alle vier Grundrechenarten und träumte davon, Streitfragen durchs Rechnen zu entscheiden. Babbage entwarf die programmierbare Analytical Engine; Ada Lovelace schrieb 1843 dazu das erste Programm — und hielt zugleich fest, die Maschine könne nur, was man ihr aufzutragen weiss.",
            },
            {
              titel: "Geburt der KI",
              kurz: "Dartmouth",
              kat: "regeln",
              mmf: "mensch",
              jahr: "1956",
              text: "In Dartmouth wird der Begriff «Künstliche Intelligenz» geprägt. Aus alten Träumen wird ein Forschungsprogramm.",
              geschichte:
                "Im Sommer 1956 trafen sich am Dartmouth College Forscher um John McCarthy und Marvin Minsky mit dem Anspruch, jede Facette der Intelligenz maschinell nachzubilden. Der alte Traum bekam einen Namen und ein Budget — und man rechnete mit Durchbrüchen binnen weniger Jahre.",
            },
            {
              titel: "Symbolische KI",
              kurz: "Symbolische KI",
              kat: "regeln",
              mmf: "maschine",
              jahr: "1960er",
              text: "Intelligenz als Regelwerk: WENN–DANN-Systeme dominieren. Logik gilt als Königsweg.",
              geschichte:
                "Die frühe KI baute Intelligenz aus Symbolen und Logik: Wissen wurde in Regeln gefasst, Schliessen als Ableiten verstanden. In engen Welten — Schach, Logikbeweise, Klötzchenwelten — glänzte der Ansatz; an der offenen, mehrdeutigen Alltagswelt biss er sich fest.",
            },
            {
              titel: "Expertensysteme",
              kurz: "Expertensysteme",
              kat: "regeln",
              mmf: "maschine",
              jahr: "1970/80er",
              text: "Fachwissen wird in Regeln gegossen und löst Spezialaufgaben. Die erhoffte breite Intelligenz bleibt aus.",
              geschichte:
                "Systeme wie MYCIN gossen in den 1970er- und 80er-Jahren das Wissen von Fachleuten in Tausende Regeln — etwa für die Diagnose von Infektionen. In ihrer Nische stark, blieben sie teuer im Unterhalt und starr gegenüber allem, was in keiner Regel stand.",
            },
            {
              titel: "KI-Winter",
              kurz: "KI-Winter",
              kat: "regeln",
              mmf: "mensch",
              jahr: "1980/90er",
              text: "Enttäuschte Erwartungen: Geld und Glaube frieren ein. Die grossen Versprechen überwintern.",
              geschichte:
                "Als die grossen Versprechen ausblieben, froren Forschungsgelder ein: Kritische Berichte und gescheiterte Projekte liessen den Glauben an die KI abkühlen. Der Begriff war zeitweise so belastet, dass Forschende ihre Arbeit lieber anders nannten.",
            },
            {
              titel: "Statistische KI",
              kurz: "Statistische KI",
              kat: "daten",
              mmf: "mensch",
              jahr: "1990er",
              text: "Die Wende: Maschinen lernen aus Beispielen statt aus Regeln. Daten werden wichtiger als Logik.",
              geschichte:
                "Statt Regeln von Hand zu schreiben, liess man Maschinen ab den 1990er-Jahren Muster aus Beispielen lernen — Spam erkennen, Handschrift lesen, Sprache erraten. Die Wende: Nicht mehr das aufgeschriebene Wissen der Fachleute zählte, sondern die Menge und Qualität der Daten.",
            },
            {
              titel: "Deep Learning",
              kurz: "Deep Learning",
              kat: "daten",
              mmf: "maschine",
              jahr: "ab 2012",
              text: "Neuronale Netze mit vielen Schichten erkennen Bilder und Sprache. Der Durchbruch kommt über die Tiefe.",
              geschichte:
                "2012 gewann ein tiefes neuronales Netz den ImageNet-Bildwettbewerb mit grossem Vorsprung — trainiert auf Grafikkarten, gefüttert mit Millionen Bildern. Schicht für Schicht lernen solche Netze eigene Merkmale, statt sie vorgesagt zu bekommen; seither dominiert das Prinzip die Bild-, Sprach- und Texterkennung.",
            },
            {
              titel: "Big Data & Gegenwart",
              kurz: "Gegenwart",
              kat: "daten",
              mmf: "maschine",
              jahr: "heute",
              text: "Riesige Datenmengen und Rechenzentren machen die neue Akteurin möglich. KI durchdringt den Alltag.",
              geschichte:
                "Heutige Modelle trainieren auf riesigen Text- und Bildmengen, in Rechenzentren mit Zehntausenden von Chips. So entstand die neue Akteurin dieses Moduls: dialogfähig, generativ — und Alltag von der Suchmaschine bis zum Schreibassistenten.",
            },
          ]}
        />
      </section>

      <FadenDivider className="mt-xl" />

      {/* Bilderstrecke zwischen den Aktivitäten */}
      <section className="mt-xl max-w-5xl" aria-label="Bilderstrecke">
        <h2 className="text-headline-lg text-on-surface">Bilder der Vorstellung</h2>
        <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
          Lange bevor es KI gab, hat sich die Menschheit ausgemalt, Dingen Leben
          einzuhauchen. Geh die Bilder durch — fahr über eines, dann erzählt es
          seine Geschichte.
        </p>
        <BilderSet className="mt-lg" bilder={BILDER} spurKey="vorhang-auf:bild" />
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
