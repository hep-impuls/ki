import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import { FadenDivider, Signatur } from "../_components/Gewebe";
import KnotenLandschaft from "../_components/KnotenLandschaft";
import StoryGewebe from "../_components/StoryGewebe";
import BilderAnschauung, { type AnschauBild } from "../_components/BilderAnschauung";
import AktivitaetsNetzFloat from "../_components/AktivitaetsNetzFloat";
import GewebeSpiel from "../_components/GewebeSpiel";
import VideoImpuls from "../_components/VideoImpuls";
import InfoPunkt from "../_components/InfoPunkt";

/**
 * Das Muster dieser Seite: die Auftritts-Signatur (oben rechts im Kopf),
 * gross nachgebaut — ein neuer Knoten tritt ins Netz, Fäden laufen vom
 * Zentrum zu sechs Aussenpunkten (plus zwei feine Aussenkanten, wie in der
 * Signatur). Index 0 = Zentrum (Akzent), 1–6 = Aussenpunkte im Umlauf.
 */
const AUFTRITT_PUNKTE: [number, number][] = [
  [387, 139],
  [198, 58],
  [378, 23],
  [576, 46],
  [585, 226],
  [405, 261],
  [180, 215],
];
const AUFTRITT_KANTEN: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
];
const AUFTRITT_FEIN: [number, number][] = [
  [1, 2],
  [3, 4],
];
const AUFTRITT_FELDER: number[][] = [
  [0, 1, 2],
  [0, 2, 3],
  [0, 3, 4],
  [0, 4, 5],
  [0, 5, 6],
  [0, 6, 1],
];

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

/**
 * Erste Bilderstrecke (Anschauungsmodus mit Hotspots): die gemeinfreien
 * historischen Bilder vom Traum, Dingen Leben einzuhauchen — aus der Story
 * gelöst, jedes mit anklickbaren Hotspots.
 */
const BILDER_STORY: AnschauBild[] = [
  {
    src: "/art/storyboard/golem.jpg",
    alt: "Zeichnung: Rabbi Löw erweckt den Golem",
    titel: "Der Golem",
    jahr: "Sage",
    kurz: "Mikoláš Aleš, 1899 · die Ursage vom belebten Ding",
    hotspots: [
      {
        x: 28,
        y: 14,
        titel: "Das belebende Wort",
        text: "Ein Schriftzeichen auf der Stirn erweckt den Golem — nimmt man es weg, erstarrt er. Wie ein Programm, das eine Maschine belebt oder anhält.",
      },
      {
        x: 60,
        y: 23,
        titel: "Der Schöpfer",
        text: "Rabbi Löw beschwört das Wesen — und muss es hüten. Wer belebt, trägt Verantwortung für das, was er in die Welt setzt.",
      },
      {
        x: 22,
        y: 67,
        titel: "Die Beschwörung",
        text: "Aus Rauch und Ritual steigt die Gestalt. Der Traum, aus Totem Lebendiges zu machen, ist uralt.",
      },
    ],
  },
  {
    src: "/art/storyboard/homunkulus.jpg",
    alt: "Stich: Wagner und Mephisto vor dem Homunkulus in der Phiole (Faust II)",
    titel: "Der Homunkulus",
    jahr: "Alchemie",
    kurz: "F. Simm zu «Faust II» · Leben aus dem Labor",
    hotspots: [
      {
        x: 25,
        y: 46,
        titel: "Leben im Glas",
        text: "Im leuchtenden Kolben regt sich künstliches Leben. Der Homunkulus ist im Labor gemacht, nicht geboren.",
      },
      {
        x: 47,
        y: 53,
        titel: "Der Macher",
        text: "Der Gelehrte Wagner erschafft Leben durch Wissen und Handwerk — der Mensch als Konstrukteur.",
      },
      {
        x: 68,
        y: 38,
        titel: "Der Preis",
        text: "Mephisto steht daneben und grinst: Hinter dem Wunder lauert der Handel. Jede Macht hat ihren Preis.",
      },
    ],
  },
  {
    src: "/art/storyboard/schachtuerke.jpg",
    alt: "Kupferstich des Schachtürken von Wolfgang von Kempelen",
    titel: "Der Schachtürke",
    jahr: "1770",
    kurz: "J. F. zu Racknitz, 1789 · der scheinbar denkende Automat",
    hotspots: [
      {
        x: 44,
        y: 18,
        titel: "Der Schein",
        text: "Der «Türke» scheint selbständig Schach zu denken — ein Wunderautomat des 18. Jahrhunderts.",
      },
      {
        x: 57,
        y: 57,
        titel: "Der versteckte Mensch",
        text: "Im Innern kauert ein Mensch und zieht die Fäden. Die «Intelligenz» der Maschine war menschlich — auch heute steckt oft mehr Handarbeit drin, als man sieht.",
      },
      {
        x: 20,
        y: 55,
        titel: "Die Attrappe",
        text: "Links dreht sich Getriebe bloss zur Schau. Vorsicht vor der Illusion der Selbständigkeit.",
      },
    ],
  },
  {
    src: "/art/storyboard/frankenstein.jpg",
    alt: "Frontispiz der Frankenstein-Ausgabe von 1831",
    titel: "Frankenstein",
    jahr: "1818",
    kurz: "Th. von Holst, 1831 · das erschaffene Wesen",
    hotspots: [
      {
        x: 32,
        y: 62,
        titel: "Das erschaffene Wesen",
        text: "Eben belebt, betrachtet die Kreatur sich selbst. Ein neues Wesen ist in der Welt — und niemand hat es gefragt.",
      },
      {
        x: 72,
        y: 30,
        titel: "Die Flucht des Schöpfers",
        text: "Victor Frankenstein flieht entsetzt vor seinem Werk. Das eigentliche Unheil ist die verweigerte Verantwortung.",
      },
      {
        x: 24,
        y: 90,
        titel: "Wissen und sein Preis",
        text: "Zu Füssen liegen Buch und Schädel: das Wissen, das belebt — und der Tod, der ihm folgt.",
      },
    ],
  },
  {
    src: "/art/storyboard/babbage.jpg",
    alt: "Holzstich der Differenzmaschine von Charles Babbage",
    titel: "Rechenmaschinen",
    jahr: "1685–1843",
    kurz: "Holzstich, 1853 · die programmierbare Rechenmaschine",
    hotspots: [
      {
        x: 13,
        y: 9,
        titel: "Von Hand angetrieben",
        text: "Eine Kurbel treibt das Werk — noch ohne Strom, aber die Rechenlogik ist schon da.",
      },
      {
        x: 45,
        y: 45,
        titel: "Rechnen in Rädern",
        text: "Zahlen werden in Ziffernrädern gespeichert und verrechnet — der mechanische Urahn des Prozessors.",
      },
      {
        x: 52,
        y: 17,
        titel: "Das Programm",
        text: "«Calculation complete»: Die Maschine führt eine feste Folge von Schritten aus. Ada Lovelace sah, dass sie Anweisungen folgen kann.",
      },
    ],
  },
  {
    src: "/art/storyboard/supercomputer.jpg",
    alt: "Rechnerreihen des Pleiades-Supercomputers der NASA",
    titel: "Big Data & Gegenwart",
    jahr: "heute",
    kurz: "NASA (Pleiades) · die Rechenhallen der Gegenwart",
    hotspots: [
      {
        x: 62,
        y: 38,
        titel: "Die Rechenhallen",
        text: "Reihe um Reihe von Prozessoren — hier «denkt» die KI tatsächlich, in riesigen Rechenzentren.",
      },
      {
        x: 45,
        y: 17,
        titel: "Datenströme",
        text: "Kabel und Netze verbinden alles. Ohne diese Ströme keine Antwort.",
      },
      {
        x: 24,
        y: 52,
        titel: "Kühlung & Strom",
        text: "Solche Maschinen brauchen ständig Strom und Kühlung — der unsichtbare Energiehunger der Rechenleistung.",
      },
    ],
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
            <div className="mt-sm max-w-3xl space-y-sm text-body-lg text-on-surface-variant">
              <p>
                Auf dieser Seite veranschaulichen wir die KI und ihre
                Geschichte. Denn die Vorstellung, Dingen Denken oder Leben
                einzuhauchen, ist viel älter als jeder Computer: Sie ist eine
                alte Phantasie des Menschen, die ihn umtreibt — und die er
                immer wieder in Kunstprodukten sichtbar gemacht hat, vom Golem
                über den Homunkulus bis zu Frankensteins Geschöpf.
              </p>
              <p>
                Daneben läuft eine zweite, technische Spur: Seit Jahrhunderten
                lagert der Mensch kognitive Leistungen in Dinge aus — das
                Rechnen in Maschinen wie Leibniz&apos; Rechenrad, das Zählen
                und Erinnern in die Knotenschnüre (Quipus) der Andenkulturen.
                In der heutigen KI laufen beide Spuren zusammen: die erzählte
                Phantasie vom belebten Ding und die reale Auslagerung des
                Denkens. Die Landschaften und Bilderstrecken dieser Seite
                folgen dieser doppelten Spur — bis zum Netz, in dem die neue
                Akteurin hängt.
              </p>
            </div>
          </div>
          <Signatur variante="auftritt" className="hidden flex-shrink-0 sm:block" />
        </div>
      </header>

      {/* Das Muster der Seite — die Auftritts-Signatur gross und interaktiv,
          wie das Gewebe-Spiel der Startseite */}
      <GewebeSpiel
        className="mt-xl max-w-5xl"
        spurKey="vorhang-auf:gewebe"
        punkte={AUFTRITT_PUNKTE}
        kanten={AUFTRITT_KANTEN}
        kantenFein={AUFTRITT_FEIN}
        felder={AUFTRITT_FELDER}
        akzent={0}
        hoehe={285}
      />

      {/* Aktivitätsnetz als mitwanderndes Symbol (schwebt unten rechts, geht
          beim Klick zum vollen Netz auf) */}
      <AktivitaetsNetzFloat />

      {/* Video-Impuls zum Einstieg — YouTube-ID folgt (Prop videoId) */}
      <VideoImpuls
        className="mt-xl"
        spurId="video:vorhang-auf"
        titel="Vorhang auf — die neue Akteurin"
        beschreibung="Ein kurzer Input zum Auftakt: Was ist da auf die Bühne getreten — und warum passt es in keine unserer alten Schubladen?"
      />

      {/* 1 — Die KI-Story als lineare Knotenlandschaft mit Einfluss-Bögen */}
      <section className="mt-xl max-w-5xl" aria-label="Die KI-Story">
        <h2 className="text-headline-lg text-on-surface">Die KI-Story</h2>
        <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
          Vom antiken Traum, Dingen Leben einzuhauchen, bis zur Gegenwart:
          vierzehn Stationen, deren Vorstellungen einander quer durch die Zeit
          beeinflussen. <strong>Deine Aufgabe:</strong> Drei Stationen sind per
          Zufall eingeblendet — hole dir in der Auswahl weitere dazu, die dich
          interessieren. Tippe einen Punkt an, um seine Geschichte zu lesen;
          unter jeder Karte kannst du «Mehr lesen» aufklappen und mit «Das
          verfolge ich weiter» ein Merkzeichen setzen. Im Gewebe lassen sich die
          Punkte verschieben, «Zeitlich» reiht sie als Perlenschnur von früher
          nach heute.
        </p>
        <InfoPunkt className="mt-md" label="Muss ich allen 14 nachgehen?">
          Nein — du musst nicht jede Station öffnen. Geh dem nach, was dich
          neugierig macht. Die Aktivitätsmessung registriert aber, was du
          anschaust, verschiebst und weiterverfolgst — nicht als Note, sondern
          um dir am Ende im Orakel eine persönliche Rückmeldung zu deinem Weg
          durchs Modul zu geben.
        </InfoPunkt>
        <StoryGewebe
          className="mt-lg"
          spurKey="vorhang-auf:story"
          buehneKlasse="bg-primary-container/20"
          einfluesse={[
            { von: 0, zu: 2 },
            { von: 1, zu: 4 },
            { von: 2, zu: 5 },
            { von: 3, zu: 5 },
            { von: 4, zu: 7 },
            { von: 6, zu: 8 },
            { von: 10, zu: 11 },
            { von: 5, zu: 13 },
          ]}
          stationen={[
            {
              titel: "Hephaistos & Talos",
              kurz: "Antike Mythen",
              kat: "erzaehlung",
              mmf: "fiktion",
              jahr: "~8. Jh. v. Chr.",
              text: "Schon in der griechischen Antike träumte man von künstlichen Wesen aus Metall. Der Schmiedegott Hephaistos schuf sich denkende Helferinnen aus Gold.",
              geschichte:
                "In Homers «Ilias» (um das 8. Jahrhundert v. Chr.) dienen dem Schmiedegott goldene Mägde, die Verstand, Stimme und Kraft besitzen, sowie selbstfahrende Dreifüsse. Und Talos, der bronzene Riese, umkreiste als Wächter die Insel Kreta — ein Automat, lange bevor es das Wort dafür gab.",
              mehr:
                "Diese Mythen zeigen: Die Idee gebauter, quasi-lebendiger Diener und Wächter ist rund 3000 Jahre alt. Schon damals verband sich damit beides — die Faszination der nützlichen Kraft und die Angst vor dem Wächter, der ausser Kontrolle gerät und Fremde mit glühendem Körper erschlägt.",
            },
            {
              titel: "Yan Shi's Automat",
              kurz: "Yan Shi",
              kat: "erzaehlung",
              mmf: "fiktion",
              jahr: "~4. Jh. n. Chr.",
              text: "Auch in China erzählt man früh von einem künstlichen Menschen. Ein Handwerker führt dem König eine täuschend lebendige Figur vor.",
              geschichte:
                "Im daoistischen «Liezi» (Text um das 4. Jahrhundert n. Chr., die Erzählung spielt weit früher) präsentiert der Mechaniker Yan Shi dem König Mu von Zhou einen künstlichen Menschen, der geht, singt und den Hofdamen zuzwinkert. Als der König Betrug vermutet, zerlegt Yan Shi ihn — er besteht aus Leder, Holz, Leim und Lack.",
              mehr:
                "Es ist eine der frühesten Automaten-Erzählungen überhaupt — und erstaunlich modern: Sie handelt vom Verdacht, ob hinter der Maschine nicht doch ein Mensch stecke, und von der Grenze zwischen echtem und nachgeahmtem Leben. Dieselbe Frage kehrt beim Schachtürken und bei heutiger KI wieder.",
            },
            {
              titel: "Der Golem",
              kurz: "Golem",
              kat: "erzaehlung",
              mmf: "fiktion",
              jahr: "Prag, 16. Jh.",
              text: "Aus Lehm geformt, durch ein Schriftzeichen belebt: der Golem. Die Ursage vom Menschen, der einem Ding Leben einhaucht.",
              geschichte:
                "Die Prager Sage schreibt Rabbi Löw (dem Maharal, ~1520–1609) einen Golem zu, den er aus Lehm formt und durch das Wort «emet» (Wahrheit) auf der Stirn erweckt — löscht man einen Buchstaben, erlischt er. Als die Gestalt ihm entgleitet, muss er sie stilllegen.",
              mehr:
                "Die Idee ist älter als Prag: Schon der Talmud (Spätantike) erzählt, der Gelehrte Rava habe einen künstlichen Menschen erschaffen. Der Golem gilt oft als Urbild der KI — belebt durch ein Zeichen wie ein Programm, fleissig, aber ohne eigenes Urteil; das Gleichnis warnt vor dem, was man in Gang setzt, ohne es hüten zu können.",
            },
            {
              titel: "Der Homunkulus",
              kurz: "Homunkulus",
              kat: "erzaehlung",
              mmf: "fiktion",
              jahr: "16. Jh.",
              text: "Leben aus der Retorte, im Labor erschaffen. Der Traum, Schöpfung technisch herzustellen.",
              geschichte:
                "Der Arzt und Alchemist Paracelsus beschrieb im 16. Jahrhundert ein Rezept, um in der Retorte ein winziges künstliches Menschlein zu «zeugen». In Goethes «Faust II» (1832) leuchtet der Homunkulus als kluges Wesen in der gläsernen Phiole.",
              mehr:
                "Im Homunkulus verschiebt sich der Traum: Nicht mehr ein Gott oder ein Rabbi belebt Totes, sondern der Mensch als Wissenschaftler und Konstrukteur. Damit rückt die Schöpfung ins Labor — und die Frage, wer für das Gemachte Verantwortung trägt, wird zu einer menschlichen.",
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
              mehr:
                "Das 18. Jahrhundert war das Zeitalter der Automaten: Vaucansons «Ente» verdaute scheinbar, Jaquet-Droz baute schreibende Puppen. Der Schachtürke trieb es auf die Spitze — und wurde erst nach Jahrzehnten als Trick entlarvt. Die Lehre: Wir schreiben Maschinen sehr schnell echtes Denken zu, auch wo keines ist.",
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
              mehr:
                "Mary Shelley schrieb den Roman mit achtzehn Jahren; der Untertitel «Der moderne Prometheus» verweist auf den Titanen, der den Menschen das Feuer brachte und dafür büsste. Frankenstein verschiebt die Warnung von der Schöpfung zur Fürsorge: Das Unglück kommt nicht daher, dass das Wesen erschaffen, sondern dass es verstossen und allein gelassen wird.",
            },
            {
              titel: "Rechenmaschinen",
              kurz: "Rechenmaschinen",
              kat: "mechanik",
              mmf: "maschine",
              jahr: "1673–1843",
              text: "Von Leibniz' Rechenrad zu Babbage und Lovelace: Die programmierbare Maschine wird gedacht. Denken als Rechnen wird vorstellbar.",
              geschichte:
                "Leibniz baute um 1673 eine Maschine für alle vier Grundrechenarten und träumte davon, Streitfragen durchs Rechnen zu entscheiden. Babbage entwarf die programmierbare Analytical Engine; Ada Lovelace schrieb 1843 dazu das erste Programm — und hielt zugleich fest, die Maschine könne nur, was man ihr aufzutragen weiss.",
              mehr:
                "Leibniz träumte von einer «characteristica universalis», mit der sich jeder Streit durchs Rechnen klären liesse — «Lasst uns rechnen!». Babbages «Analytical Engine» (ab 1837) war als universelle, programmierbare Maschine gedacht; Ada Lovelace erkannte, dass sie nicht nur Zahlen, sondern beliebige Symbole verarbeiten könnte — und dass sie doch nichts «von sich aus» hervorbringe.",
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
              mehr:
                "Der Förderantrag von 1955 behauptete kühn, jeder Aspekt des Lernens lasse sich so präzise beschreiben, dass eine Maschine ihn nachahmen könne. Aus der Konferenz stammt der Name «Artificial Intelligence» — und ein Optimismus, der schon bald mit der Wirklichkeit kollidierte.",
            },
            {
              titel: "Symbolische KI",
              kurz: "Symbolische KI",
              kat: "regeln",
              mmf: "maschine",
              jahr: "1956–1970er",
              text: "Intelligenz als Regelwerk: WENN–DANN-Systeme dominieren. Logik gilt als Königsweg.",
              geschichte:
                "Die frühe KI baute Intelligenz aus Symbolen und Logik: Wissen wurde in Regeln gefasst, Schliessen als Ableiten verstanden. In engen Welten — Schach, Logikbeweise, Klötzchenwelten — glänzte der Ansatz; an der offenen, mehrdeutigen Alltagswelt biss er sich fest.",
              mehr:
                "Programme wie der «Logic Theorist» oder der «General Problem Solver» bewiesen Sätze und lösten Rätsel durch Regelanwendung. Der Ansatz — später «Good Old-Fashioned AI» genannt — setzt darauf, dass Intelligenz aus manipulierbaren Symbolen besteht. Er scheiterte an allem, was Kontext, Mehrdeutigkeit und Alltagswissen verlangt.",
            },
            {
              titel: "Expertensysteme",
              kurz: "Expertensysteme",
              kat: "regeln",
              mmf: "maschine",
              jahr: "1970er–80er",
              text: "Fachwissen wird in Regeln gegossen und löst Spezialaufgaben. Die erhoffte breite Intelligenz bleibt aus.",
              geschichte:
                "Systeme wie MYCIN gossen in den 1970er- und 80er-Jahren das Wissen von Fachleuten in Tausende Regeln — etwa für die Diagnose von Infektionen. In ihrer Nische stark, blieben sie teuer im Unterhalt und starr gegenüber allem, was in keiner Regel stand.",
              mehr:
                "In der Blüte der 1980er investierten Firmen und Staaten Milliarden — Japans «Fifth Generation Project» war das bekannteste. Doch Wissen liess sich nur mühsam von Hand in Regeln fassen, und die Systeme konnten nicht dazulernen. Als der Aufwand den Nutzen überstieg, brach der Markt ein.",
            },
            {
              titel: "KI-Winter",
              kurz: "KI-Winter",
              kat: "regeln",
              mmf: "mensch",
              jahr: "1974–1993",
              text: "Enttäuschte Erwartungen: Geld und Glaube frieren ein. Die grossen Versprechen überwintern.",
              geschichte:
                "Als die grossen Versprechen ausblieben, froren Forschungsgelder ein: Kritische Berichte und gescheiterte Projekte liessen den Glauben an die KI abkühlen. Der Begriff war zeitweise so belastet, dass Forschende ihre Arbeit lieber anders nannten.",
              mehr:
                "«KI-Winter» heissen die Phasen, in denen Förderung und Erwartungen einbrachen — ausgelöst unter anderem durch den kritischen Lighthill-Report (1973) und später den Zusammenbruch des Expertensystem-Marktes. Zweimal galt die KI als gescheitert — und kehrte doch zurück, jedes Mal mit einem neuen Ansatz.",
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
              mehr:
                "Statistische Verfahren lernen Wahrscheinlichkeiten aus Beispielen, statt Regeln vorgegeben zu bekommen. Mit wachsender Rechenkraft wurde das überlegen — sichtbar 1997, als IBMs «Deep Blue» den Schachweltmeister Kasparow schlug: nicht durch Verstehen, sondern durch Rechnen und Erfahrung.",
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
              mehr:
                "Künstliche neuronale Netze gab es seit den 1950er-Jahren; erst Grafikkarten und riesige Datensätze machten «tiefe» Netze praktikabel. 2017 kam die «Transformer»-Architektur dazu — die Grundlage heutiger Sprachmodelle: Sie gewichtet Zusammenhänge über lange Textpassagen hinweg.",
            },
            {
              titel: "Big Data & Gegenwart",
              kurz: "Gegenwart",
              kat: "daten",
              mmf: "maschine",
              jahr: "ab 2020",
              text: "Riesige Datenmengen und Rechenzentren machen die neue Akteurin möglich. KI durchdringt den Alltag.",
              geschichte:
                "Heutige Modelle trainieren auf riesigen Text- und Bildmengen, in Rechenzentren mit Zehntausenden von Chips. So entstand die neue Akteurin dieses Moduls: dialogfähig, generativ — und Alltag von der Suchmaschine bis zum Schreibassistenten.",
              mehr:
                "Mit GPT-3 (2020) und ChatGPT (Ende 2022) wurde Sprach-KI erstmals einer breiten Öffentlichkeit zugänglich — und alltagstauglich. Was als jahrtausendealte Phantasie begann, ist heute Werkzeug und Gegenüber zugleich: Genau das macht es zum Thema dieser Einheit.",
            },
          ]}
        />
      </section>

      <FadenDivider className="mt-xl" />

      {/* Bilderstrecke zwischen den Aktivitäten — Anschauungsmodus mit Hotspots */}
      <section className="mt-xl max-w-5xl" aria-label="Bilderstrecke: Bilder der Vorstellung">
        <h2 className="text-headline-lg text-on-surface">Bilder der Vorstellung</h2>
        <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
          Lange bevor es KI gab, hat sich die Menschheit ausgemalt, Dingen
          Leben einzuhauchen — und hat diese Phantasie in Kunstwerken sichtbar
          gemacht. <strong>Deine Aufgabe:</strong> Klicke jedes der sechs
          Bilder an — es öffnet sich gross im Anschauungsmodus. Tippe dort die
          leuchtenden, nummerierten Punkte an: Jeder erzählt ein Detail des
          Bildes. Mit den Pfeilen (oder den Pfeiltasten) blätterst du zum
          nächsten Bild. Ziel: alle sechs Bilder samt ihren Punkten.
        </p>
        <BilderAnschauung
          className="mt-lg"
          bilder={BILDER_STORY}
          spurKey="vorhang-auf:bild"
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
          allein, ihre Bündelung macht das Neue aus.{" "}
          <strong>Deine Aufgabe:</strong> Tippe die sieben Punkte im Geflecht
          an — jeder wird beschriftet und zeigt unten seine Definition. Tippe
          auch auf die Verbindungslinien: Das loggt die Verbindung ein und
          öffnet gleich beide Enden. Zwischen besuchten Punkten füllen sich
          die Flächen. Ziel: alle sieben Merkmale offen — dann erscheint unter
          dem Muster das Fazit.
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
              text: "Man steuert sie mit Alltagssprache — und sie antwortet in Sprache. Das Gespräch selbst ist die Bedienoberfläche: Man fragt, präzisiert, widerspricht, wie bei einem Gegenüber. Keine Menüs, keine Knöpfe — nur Worte.",
              mehr:
                "Bis vor kurzem musste man Computer in Programmiersprachen anweisen. Sprachmodelle kehren das um: Die Anweisung ist normaler Text — «die heisseste neue Programmiersprache ist Englisch», sagt der KI-Forscher Andrej Karpathy. Das macht die Technik für alle bedienbar, verwischt aber auch die Grenze zwischen Befehl und Gespräch.",
            },
            {
              titel: "generativ",
              text: "Sie erzeugt laufend Neues — Text, Bild, Code — statt Fertiges nur abzurufen. Jedes Wort ist die wahrscheinlichste Fortsetzung des Vorherigen. So entsteht Verblüffendes ebenso wie frei Erfundenes: Erzeugen und Erfinden liegen dicht beieinander.",
              mehr:
                "«Generativ» heisst: Sie stellt Neues her, statt nur Vorhandenes abzurufen — Wort für Wort als wahrscheinlichste Fortsetzung. Dieselbe Fähigkeit bringt Brillantes wie Erfundenes hervor; die Informatikerin Katharina Zweig schlägt statt «Halluzination» das Wort «Konfabulation» vor: flüssig geredet, ohne Wissen dahinter.",
            },
            {
              titel: "multimodal",
              text: "Text, Bild und Ton laufen in einem einzigen Modell zusammen. Sie liest, sieht und hört — und antwortet wahlweise in Wort, Bild oder Stimme. Man kann ihr ein Foto zeigen, eine Skizze oder einen gesprochenen Satz; sie nimmt die Welt in mehreren Kanälen zugleich auf.",
              mehr:
                "Frühe Modelle konnten entweder Text oder Bild oder Ton. Multimodale Modelle verbinden diese Kanäle in einem Netz und rücken damit näher an die menschliche Wahrnehmung, die auch nicht in getrennten Sinnen denkt. Ein Foto, eine Skizze, ein gesprochener Satz — alles kann Eingabe sein.",
            },
            {
              titel: "agentenhaft",
              text: "Sie bleibt nicht beim Antworten stehen: Sie zerlegt ein Ziel in Schritte und greift selbständig zu Werkzeugen — Websuche, Programme, Code. Aus dem Antwortgeber wird ein Akteur, der Dinge erledigt. Genau hier verschwimmt die Grenze zwischen Werkzeug und Gegenüber.",
              mehr:
                "Ein «Agent» ist mehr als ein Antwortgeber: ein Sprachmodell mit Gedächtnis, der Fähigkeit, ein Ziel in Schritte zu zerlegen, und Zugriff auf Werkzeuge — Websuche, Code, andere Programme. Damit handelt die KI eigenständig in der Welt; genau hier verschwimmt die alte Grenze zwischen Werkzeug und Gegenüber.",
            },
            {
              titel: "speicherabhängig",
              text: "Ihr ganzes Können steckt in gespeicherten Zahlen, den «Gewichten» — wo kein Speicher, da kein Training. Auch im Betrieb braucht sie Gedächtnis: den Kontext des Gesprächs und durchsuchbare Ablagen. Ohne Speichern gäbe es weder Lernen noch Erinnern.",
              mehr:
                "Alles, was ein Modell «kann», steckt in Milliarden gespeicherten Zahlen, den Gewichten. Training heisst, diese Werte so lange zu verstellen, bis die Antworten stimmen — ohne Speicher kein Lernen. Und im Betrieb braucht es weiter Speicher: als Kurzzeitgedächtnis (den Kontext) und als durchsuchbare Ablage fürs Langzeitgedächtnis.",
            },
            {
              titel: "datenbasiert",
              text: "Ihre Fähigkeiten wachsen aus riesigen Datenmengen, nicht aus einprogrammierten Regeln. Ohne Daten bleibt der beste Algorithmus leer. Darum ist entscheidend, wessen Daten sie gelernt hat — und welche Einseitigkeiten darin stecken.",
              mehr:
                "«Die Lernalgorithmen sind die Samen, die Daten der Boden», schreibt der Forscher Pedro Domingos. Ohne riesige Datenmengen bleibt die klügste Methode unfruchtbar. Deshalb dreht sich in der KI alles um Daten — und um die Frage, wessen Daten das sind und welche Verzerrungen in ihnen stecken.",
            },
            {
              titel: "mustererkennend",
              text: "Sie liest statistische Muster aus Unmengen von Beispielen und wendet sie verlässlich an. Was oft zusammen vorkommt, hält sie für zusammengehörig. Warum etwas passt, versteht sie dabei nicht — sie erkennt, ohne zu begreifen.",
              mehr:
                "Mustererkennung wird gern als reine Wahrscheinlichkeitsrechnung abgetan. Katharina Zweig schärft das Bild: Das System leitet aus Daten statistische Muster ab und hat bestimmte Wörter schlicht oft in bestimmten Kontexten gelesen — es erkennt verlässlich, versteht aber nicht, warum. Ihr nüchternes Fazit: Noch seien diese Systeme gar nicht intelligent.",
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
          einem ganzen Geflecht — und sie ist darin ein Knoten unter Knoten.{" "}
          <strong>Deine Aufgabe:</strong> Tippe alle sieben Knoten an und lies,
          wer oder was mitzieht — oder tippe auf eine Verbindungslinie, das
          öffnet gleich beide Enden. Ziel: alle sieben besucht — dann erscheint
          das Fazit.
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
              text: "Sie steht nie allein: Was sie kann, hängt am ganzen Geflecht — an Menschen, Sprache, Rechnern, Rohstoffen, Firmen und Regeln. Kein Zentrum, das für sich funktioniert; die KI ist ein Knoten unter Knoten. Wer mit ihr spricht, zieht immer am ganzen Netz mit.",
              mehr:
                "In der Akteur-Netzwerk-Theorie (Bruno Latour) handelt nie ein Ding allein — Wirkung entsteht im Geflecht von Menschen und Dingen. So gesehen ist «die KI» kein Kasten, sondern ein Knotenpunkt, an dem Sprache, Rechner, Rohstoffe, Firmen und Regeln zusammenlaufen.",
            },
            {
              titel: "Nutzer:innen",
              text: "Deine Fragen und Formulierungen führen sie; ohne Eingabe bleibt sie stumm. Wie du fragst, formt, was zurückkommt — mit dir wird sie zur Mitspielerin, nicht zur blossen Auskunft. Und oft fliessen deine Eingaben und Rückmeldungen ins nächste Training zurück.",
              mehr:
                "Ein Sprachmodell tut von sich aus nichts — es wartet auf eine Eingabe. Wie du fragst (der «Prompt»), formt die Antwort stark; damit bist du Teil des Systems, nicht bloss Zuschauerin. Auch deine Rückmeldungen fliessen oft ins nächste Training zurück.",
            },
            {
              titel: "Sprache",
              text: "Gelernt aus Milliarden Sätzen — unsere Wörter, Geschichten und Begriffe sind ihr Material. Sie gibt zurück, was Menschen geschrieben haben. Also stecken auch unsere Vorurteile, Lücken und Fehler mit darin.",
              mehr:
                "Trainiert wird auf riesigen Textmengen aus dem Internet, aus Büchern und Foren. Darin steckt viel Wissen der Menschheit — aber auch ihre Vorurteile, Lücken und Fehler, die das Modell mitlernt und weitergibt.",
            },
            {
              titel: "Datencentren",
              text: "Jede Antwort läuft durch riesige Rechenhallen voller Chips. Sie brauchen viel Strom und Wasser zur Kühlung — und Seekabel, die die Kontinente verbinden. Die Wolke ist in Wahrheit sehr handfest.",
              mehr:
                "Rechenzentren verbrauchen enorm viel Strom und Wasser zur Kühlung; ihr Energiebedarf wächst mit der KI rasant. Physisch hängt jede Antwort an Serverhallen, Stromnetzen und den Seekabeln, die die Kontinente verbinden.",
            },
            {
              titel: "Rohstoffe",
              text: "Chips brauchen Silizium, seltene Erden und Metalle wie Kobalt — aus Minen und Fabriken rund um die Welt. Die scheinbar virtuelle KI hat damit ein sehr reales Gewicht. Und der Abbau geschieht oft unter harten Bedingungen.",
              mehr:
                "Chips brauchen Silizium, seltene Erden und Metalle wie Kobalt — abgebaut in Minen, oft unter harten Bedingungen. Die scheinbar «virtuelle» KI hat damit einen sehr realen ökologischen und sozialen Fussabdruck.",
            },
            {
              titel: "Unternehmen",
              text: "Die grossen Modelle bauen wenige, kapitalstarke Firmen — mit eigenen Zielen und Geschäftsmodellen. Wer eine KI trainiert und betreibt, entscheidet mit, was sie darf und was sie kostet. Damit steckt in jeder Antwort auch ein Interesse.",
              mehr:
                "Die grossen Modelle bauen wenige, kapitalstarke Firmen — mit eigenen Zielen und Geschäftsmodellen. Wer eine KI trainiert und betreibt, entscheidet mit, was sie darf, was sie kostet und wessen Interessen sie dient.",
            },
            {
              titel: "Regeln",
              text: "Gesetze und Abmachungen bestimmen, was sie darf — und wer haftet, wenn etwas schiefgeht. Die EU-KI-Verordnung versucht das seit 2024 zu ordnen. Doch die Technik ist oft schneller als die Regeln.",
              mehr:
                "Gesetze wie die EU-KI-Verordnung (AI Act, ab 2024) versuchen, Risiken einzuhegen und Verantwortung zu klären. Doch die Technik ist oft schneller als die Regulierung — und die Frage, wer haftet, wenn eine KI Schaden anrichtet, ist vielerorts noch offen.",
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
