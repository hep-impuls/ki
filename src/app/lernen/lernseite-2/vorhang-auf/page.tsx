import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import { FadenDivider, Signatur } from "../_components/Gewebe";
import KnotenLandschaft from "../_components/KnotenLandschaft";
import KontextAkkordeon from "../_components/KontextAkkordeon";
import StoryGewebe from "../_components/StoryGewebe";
import BilderAnschauung, { type AnschauBild } from "../_components/BilderAnschauung";
import AktivitaetsNetzFloat from "../_components/AktivitaetsNetzFloat";
import GewebeSpiel from "../_components/GewebeSpiel";
import VideoImpuls from "../_components/VideoImpuls";
import InfoPunkt from "../_components/InfoPunkt";
import Inhaltsverzeichnis from "../_components/Inhaltsverzeichnis";
import Aufgabe from "../_components/Aufgabe";
import ModulMiniNav from "../_components/ModulMiniNav";
import NeustartButton from "../_components/NeustartButton";
import AbschnittKopf from "../_components/AbschnittKopf";
import Abschnitt from "../_components/Abschnitt";
import AkkordeonGruppe from "../_components/AkkordeonGruppe";
import AktivitaetsKopf from "../_components/AktivitaetsKopf";
import Ausklapptext from "../_components/Ausklapptext";
import { GlossarText } from "../_components/Glossar";

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
 *  4. Die KI im Kontext — vier Kontexte mit aufklappbaren Aspekten.
 *
 * Bilder: public/art/storyboard/ (Nachweis in public/art/CREDITS.md).
 */

/**
 * Erste Bilderstrecke (Anschauungsmodus mit Hotspots): ein Bogen durch die
 * KI-Geschichte — vom antiken Auslagern des Denkens (Anden-Quipu) über die
 * mechanischen Illusionen bis zu Turings Code-Knacker und den lernenden
 * Maschinen. Historische gemeinfreie Bilder und eigene Illustrationen
 * gemischt (Nachweis in public/art/CREDITS.md).
 */
const BILDER_STORY: AnschauBild[] = [
  {
    src: "/art/quipu-pd.jpg",
    alt: "Historisches Foto einer Anden-Knotenschnur (Quipu): eine Hauptschnur im Bogen mit vielen herabhängenden, geknoteten Nebenschnüren.",
    titel: "Quipu: Knoten der Anden",
    jahr: "Anden, ~1400",
    kurz: "Historische Aufnahme · Rechnen und Erinnern in Knoten",
    quelle:
      "Foto «The Ancient Quipu Plate XXII» · Wikimedia Commons · gemeinfrei (Public Domain)",
    geschichte:
      "Quipus waren das Buchhaltungs- und Erinnerungssystem der Inka und älterer Andenkulturen. Statt Zahlen zu schreiben, knüpfte man sie. An einer Hauptschnur hängen Nebenschnüre, deren Knotenart, Knotenzahl und Knotenhöhe Werte im Zehnersystem festhalten. Auch Farbe, Drehrichtung und Anordnung trugen Bedeutung. Eigene Spezialisten, die «Quipucamayocs», legten sie an und lasen sie vor. Rechnen und Erinnern wurden hier nicht ins Rad ausgelagert, sondern in den Faden. So entstand eine Datenbank aus Textil, Jahrhunderte vor dem Computer. Diese Aufnahme zeigt ein erhaltenes Quipu.",
    hotspots: [
      {
        x: 50,
        y: 16,
        titel: "Die Hauptschnur",
        text: "An der waagrechten Trägerschnur oben hängen alle Nebenschnüre. Das Quipu ist ein Speicher aus Fäden, eine Buchhaltung und Chronik der Inka.",
      },
      {
        x: 42,
        y: 44,
        titel: "Knoten sind Zahlen",
        text: "Art, Zahl und Höhe der Knoten codieren Werte im Zehnersystem. Rechnen und Erinnern werden hier nicht ins Rad ausgelagert, sondern in den Faden.",
      },
      {
        x: 60,
        y: 70,
        titel: "Ein Gewebe aus Daten",
        text: "Dutzende herabhängende Schnüre, teils weiter verzweigt, ergeben eine ganze Datenbank aus Textil. Auch Farbe und Drehrichtung der Fäden trugen Bedeutung, lange vor dem Computer.",
      },
    ],
  },
  {
    src: "/art/storyboard/schachtuerke.jpg",
    alt: "Kupferstich des Schachtürken von Wolfgang von Kempelen",
    titel: "Der Schachtürke",
    jahr: "1770",
    kurz: "der scheinbar denkende Automat",
    quelle:
      "Kupferstich, Joseph Friedrich zu Racknitz, 1789 · Wikimedia Commons · gemeinfrei",
    geschichte:
      "Der «Schachtürke» war ein Schach spielender Automat, den Wolfgang von Kempelen 1770 am Wiener Hof vorführte. Es war eine lebensgrosse, als Türke kostümierte Figur an einer Truhe voller Zahnräder. Jahrzehntelang schlug er prominente Gegner, der Legende nach auch Napoleon und Benjamin Franklin, und liess ganz Europa rätseln, ob eine Maschine denken könne. In Wahrheit sass im Innern ein versteckter Schachmeister, der die Figur über Hebel und Magnete steuerte. Beim Öffnen zeigte man geschickt immer nur einen Teil des Kastens. Nach Kempelens Tod tourte Johann Nepomuk Mälzel den Automaten um die Welt, bis er 1854 bei einem Brand zerstört wurde. Dieses Bild ist ein Kupferstich von Joseph Friedrich zu Racknitz von 1789, der den vermuteten Mechanismus samt verborgenem Bediener zu erklären versuchte. Der Schachtürke ist bis heute das Sinnbild dafür, wie bereitwillig wir Maschinen Intelligenz zuschreiben und wie oft «automatische» Leistung in Wahrheit versteckte menschliche Arbeit ist. Nicht zufällig heisst Amazons Klickarbeiter-Plattform «Mechanical Turk».",
    hotspots: [
      {
        x: 44,
        y: 18,
        titel: "Der Schein",
        text: "Der «Türke» scheint selbständig Schach zu denken, ein Wunderautomat des 18. Jahrhunderts.",
      },
      {
        x: 57,
        y: 57,
        titel: "Der versteckte Mensch",
        text: "Im Innern kauert ein Mensch und zieht die Fäden. Die «Intelligenz» der Maschine war menschlich. Auch heute steckt oft mehr Handarbeit drin, als man sieht.",
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
    kurz: "das erschaffene Wesen",
    quelle:
      "Frontispiz der Frankenstein-Ausgabe, Theodor von Holst, 1831 · Wikimedia Commons · gemeinfrei",
    geschichte:
      "Mary Shelley schrieb «Frankenstein oder der moderne Prometheus» mit achtzehn Jahren, und der Roman erschien 1818. Victor Frankenstein erschafft aus toter Materie ein lebendes Wesen und flieht im Augenblick des Gelingens entsetzt vor seinem Werk. Die Kreatur ist nicht böse geboren, denn erst Zurückweisung und Einsamkeit machen sie zum Rächer. Der eigentliche Fehler ist also nicht die Schöpfung, sondern die verweigerte Verantwortung. Dieses Bild ist das Frontispiz der Ausgabe von 1831, ein Stich nach Theodor von Holst, und zeigt den Moment der Flucht. Bis heute steht «Frankenstein» für die Angst vor Technik, die sich der Kontrolle entzieht, und für die Frage, wer für das Gemachte einsteht.",
    hotspots: [
      {
        x: 32,
        y: 62,
        titel: "Das erschaffene Wesen",
        text: "Eben belebt, betrachtet die Kreatur sich selbst. Ein neues Wesen ist in der Welt, und niemand hat es gefragt.",
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
        text: "Zu Füssen liegen Buch und Schädel. Sie stehen für das Wissen, das belebt, und für den Tod, der ihm folgt.",
      },
    ],
  },
  {
    src: "/art/storyboard/babbage.jpg",
    alt: "Holzstich der Differenzmaschine von Charles Babbage",
    titel: "Rechenmaschinen",
    jahr: "1685–1843",
    kurz: "die programmierbare Rechenmaschine",
    quelle:
      "Holzstich der Differenzmaschine von Charles Babbage, 1853 · Wikimedia Commons · gemeinfrei",
    geschichte:
      "Der Traum vom mechanischen Rechnen reicht von Leibniz' Rechenrad um 1673 bis zu Charles Babbage. Ab 1837 entwarf Babbage die «Analytical Engine», eine universelle, programmierbare Maschine, die zu seinen Lebzeiten nie fertig gebaut wurde. Ada Lovelace erkannte 1843, dass eine solche Maschine nicht nur Zahlen, sondern beliebige Zeichen verarbeiten könnte, und schrieb das, was oft als erstes Computerprogramm gilt. Zugleich hielt sie fest, dass die Maschine nichts von sich aus hervorbringt. Der Holzstich von 1853 zeigt einen Teil von Babbages Differenzmaschine, den mechanischen Urahn des Prozessors, angetrieben von Hand.",
    hotspots: [
      {
        x: 13,
        y: 9,
        titel: "Von Hand angetrieben",
        text: "Eine Kurbel treibt das Werk an, noch ganz ohne Strom, aber die Rechenlogik ist schon da.",
      },
      {
        x: 45,
        y: 45,
        titel: "Rechnen in Rädern",
        text: "Zahlen werden in Ziffernrädern gespeichert und verrechnet. Das ist der mechanische Urahn des Prozessors.",
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
    src: "/art/bombe.jpg",
    alt: "Historisches Foto der «Bombe»: eine Bedienerin an einer grossen Maschine mit Reihen drehbarer Trommeln, die Enigma-Funksprüche entschlüsselt.",
    titel: "Turings Code-Knacker",
    jahr: "1939–1945",
    kurz: "Alan Turing · die «Bombe» entschlüsselt Enigma",
    quelle:
      "Foto der «Bombe», US National Security Agency · Wikimedia Commons · gemeinfrei (US-Regierung)",
    geschichte:
      "Im Zweiten Weltkrieg verschlüsselte die deutsche Wehrmacht ihren Funk mit der Enigma. In Bletchley Park in England entwarf Alan Turing die «Bombe», eine elektromechanische Maschine, die Tausende möglicher Walzenstellungen systematisch durchprobierte und die unmöglichen ausschied. Das Knacken der Enigma verkürzte den Krieg erheblich. Turing hatte 1936 die theoretische Grundlage jedes Computers gelegt und fragte 1950, ob Maschinen denken können. Das Foto zeigt eine US-Version der Bombe mit einer Bedienerin, denn die Maschinen liefen rund um die Uhr und wurden meist von Frauen bedient. Aus Turings Idee der universellen Rechenmaschine wurde hier ein reales, kriegsentscheidendes Werkzeug und eine Geburtsstunde des Computers.",
    hotspots: [
      {
        x: 55,
        y: 58,
        titel: "Die Trommeln",
        text: "Die Reihen runder Trommeln bilden die Walzen der Enigma nach. Die Maschine ahmt das deutsche Chiffriergerät nach, um es zu überlisten.",
      },
      {
        x: 40,
        y: 29,
        titel: "Systematisch durchprobieren",
        text: "An den oberen Rädchen wird die Maschine eingestellt. Die «Bombe» testet mechanisch Tausende Walzenstellungen und scheidet die unmöglichen aus. Rechnen wird hier zur Suche.",
      },
      {
        x: 27,
        y: 52,
        titel: "Menschen an der Maschine",
        text: "Bedienerinnen richteten die Bombe ein und lasen sie ab, rund um die Uhr. Aus Turings Idee der universellen Rechenmaschine wird ein reales, kriegsentscheidendes Werkzeug und eine Geburtsstunde des Computers.",
      },
    ],
  },
  {
    src: "/art/eliza.svg",
    alt: "Illustration des Chatbots ELIZA (1966): ein Fernschreiber-Ausdruck mit einem Wechselgespräch zwischen Mensch und Programm.",
    titel: "ELIZA: der erste Chatbot",
    jahr: "1966",
    kurz: "Weizenbaums sprechendes Programm",
    quelle: "Schematische Illustration, mit KI erstellt für dieses Lehrmittel · kein Foto",
    geschichte:
      "ELIZA schrieb Joseph Weizenbaum 1966 am MIT. Es war eines der ersten «sprechenden» Programme. Sein bekanntestes Skript hiess «DOCTOR», imitierte eine Psychotherapeutin und spiegelte die Eingaben als Fragen zurück, etwa «In welcher Weise?». ELIZA verstand nichts und folgte nur einfachen Mustern, wirkte aber verblüffend menschlich. Weizenbaum erschrak, wie sehr sich Menschen dem Programm anvertrauten, und wurde später zu einem frühen Kritiker der KI. Der «ELIZA-Effekt» beschreibt bis heute unsere Neigung, hinter flüssiger Sprache echtes Verstehen zu vermuten. Diese Illustration eines Fernschreiber-Dialogs ist mit KI erstellt.",
    ki: true,
    hotspots: [
      {
        x: 38,
        y: 37,
        titel: "Die Therapeutin (DOCTOR)",
        text: "Das bekannteste Skript imitierte eine Psychotherapeutin. Es gab Aussagen als Fragen zurück, etwa «In welcher Weise?» oder «Erzähl mir mehr».",
      },
      {
        x: 62,
        y: 62,
        titel: "Ein Skript, kein Verstehen",
        text: "ELIZA folgte einfachen Mustern und spiegelte Sätze zurück. Sie verstand nichts und wirkte doch verblüffend menschlich.",
      },
      {
        x: 30,
        y: 82,
        titel: "Der ELIZA-Effekt",
        text: "Menschen vertrauten sich dem Programm an wie einem Menschen. Bis heute überschätzen wir gern, was Maschinen «verstehen».",
      },
    ],
  },
  {
    src: "/art/ml-raum.svg",
    alt: "Illustration: Datenpunkte als farbige Cluster in einem dreidimensionalen Merkmalsraum, getrennt durch eine gelernte Grenzfläche.",
    titel: "Maschinelles Lernen",
    jahr: "ab 1990er",
    kurz: "Daten als Punkte im mehrdimensionalen Raum",
    quelle: "Schematische Illustration, mit KI erstellt für dieses Lehrmittel · kein Foto",
    geschichte:
      "Ab den 1990er-Jahren verschob sich die KI vom Regeln-Schreiben zum Lernen aus Beispielen. Ein Modell fasst jedes Beispiel als Punkt in einem Raum mit vielen Merkmalen auf, oft mit Hunderten oder Tausenden Dimensionen, und Ähnliches liegt nah beieinander. «Lernen» heisst dann, eine Grenze zu finden, die Gruppen trennt. Danach kann das Modell Neues einordnen. Es versteht dabei keine Bedeutung, sondern rechnet mit Lage und Abstand. Diese Denkweise ist die Grundlage fast aller heutigen KI. Diese schematische Illustration ist mit KI erstellt.",
    ki: true,
    hotspots: [
      {
        x: 19,
        y: 78,
        titel: "Achsen sind Merkmale",
        text: "Jede Achse steht für ein Merkmal der Daten. Oft sind es Hunderte oder Tausende, hier nur drei angedeutet.",
      },
      {
        x: 33,
        y: 34,
        titel: "Ähnliches liegt nah",
        text: "Verwandte Beispiele landen dicht beieinander und bilden Gruppen. So «versteht» das Modell nicht Bedeutung, sondern Lage im Raum.",
      },
      {
        x: 55,
        y: 48,
        titel: "Die gelernte Grenze",
        text: "Das Modell sucht eine Fläche, die die Gruppen trennt. «Lernen» heisst, diese Grenze aus Beispielen immer besser zu ziehen. Dann kann es Neues einordnen.",
      },
    ],
  },
  {
    src: "/art/tamagotchi-foto.jpg",
    alt: "Foto eines gelben Tamagotchi (1996): ein eiförmiges Taschengerät mit kleinem Bildschirm, drei Knöpfen und einer Kugelkette.",
    titel: "Tamagotchi: das virtuelle Haustier",
    jahr: "1996",
    kurz: "Bindung an ein digitales Wesen",
    quelle: "Foto: Museum Rotterdam · Wikimedia Commons · CC BY-SA 3.0",
    geschichte:
      "Das Tamagotchi kam 1996 in Japan von der Firma Bandai auf den Markt. Es war ein eiförmiges Taschengerät mit einem digitalen Wesen, das gefüttert, gepflegt und beschäftigt werden wollte, sonst «starb» es. Millionen banden sich emotional an ein paar Bildpunkte, und an Schulen wurden die piepsenden Geräte zeitweise verboten. Tamagotchis zeigen, wie leicht wir Maschinen wie Lebewesen behandeln. Sie sind ein früher Vorläufer der virtuellen Haustiere und der heutigen KI-Begleiter. Dieses Foto zeigt ein erhaltenes Gerät aus einer Museumssammlung.",
    hotspots: [
      {
        x: 53,
        y: 42,
        titel: "Gefühle für Pixel",
        text: "Auf dem kleinen Schirm lebte ein wenige Bildpunkte grosses Wesen. Millionen banden sich emotional daran, denn wir behandeln Maschinen erstaunlich leicht wie Lebewesen.",
      },
      {
        x: 70,
        y: 67,
        titel: "Ein Wesen zum Umsorgen",
        text: "Mit drei Knöpfen wurde gefüttert, gespielt und sauber gemacht. Es war Pflege rund um die Uhr, sonst «starb» das Wesen.",
      },
      {
        x: 22,
        y: 50,
        titel: "Wegbereiter",
        text: "An der Kette hing es immer am Körper. Tamagotchis ebneten den Weg für virtuelle Haustiere und Gefährten, heute für sprechende KI-Begleiter.",
      },
    ],
  },
  {
    src: "/art/dqn-spiel.svg",
    alt: "Illustration: eine KI lernt ein einfaches Ziegel-Spiel; eine Belohnungskurve steigt an.",
    titel: "Lernen durch Spielen (DQN)",
    jahr: "2013–2015",
    kurz: "Deep Q-Network lernt Arcade-Spiele selbst",
    quelle: "Schematische Illustration, mit KI erstellt für dieses Lehrmittel · kein Foto",
    geschichte:
      "Zwischen 2013 und 2015 zeigte «Deep Q-Network» von DeepMind, dass eine KI klassische Arcade-Spiele allein durch Ausprobieren lernen kann. Sie sah nur die Bildpunkte des Schirms und den Punktestand, aber keine Regeln. Über viele Partien hinweg richtete sie ihr Verhalten auf die Belohnung durch Punkte aus und übertraf bei manchen Spielen den Menschen. Dieses «verstärkende Lernen» wurde später zur Grundlage von Systemen wie AlphaGo, das 2016 den weltbesten Go-Spieler schlug. Diese schematische Illustration ist mit KI erstellt und zeigt kein Originalspiel.",
    ki: true,
    hotspots: [
      {
        x: 32,
        y: 24,
        titel: "Die Umgebung",
        text: "Das Spiel ist die Umgebung. Die KI sieht nur die Bildpunkte des Schirms und den Punktestand, aber keine Regeln.",
      },
      {
        x: 89,
        y: 50,
        titel: "Belohnung steigt",
        text: "Punkte sind die Belohnung. Über viele Spiele hinweg versucht die KI, sie zu maximieren, und die Kurve klettert.",
      },
      {
        x: 37,
        y: 80,
        titel: "Versuch und Irrtum",
        text: "Ohne Anleitung lernt sie erstaunliche Strategien. Zwischen 2013 und 2015 zeigte «Deep Q-Network», dass Maschinen im Spiel stärker werden können als Menschen.",
      },
    ],
  },
  {
    src: "/art/dalle2.jpg",
    alt: "Von DALL·E 2 erzeugtes Bild: ein metallener Roboterarm hält einen Stift und zeichnet die Skizze einer Hand auf Papier.",
    titel: "DALL·E: Bilder aus Worten",
    jahr: "April 2022",
    kurz: "Text wird zum Bild, schon vor ChatGPT",
    quelle:
      "Von DALL·E 2 erzeugtes Bild (2022) · Wikimedia Commons · KI-generiert, urheberrechtlich nicht geschützt",
    geschichte:
      "DALL·E von OpenAI erzeugt Bilder aus Textbeschreibungen. DALL·E 1 kam im Januar 2021, das deutlich stärkere DALL·E 2 im April 2022, also rund ein halbes Jahr vor ChatGPT. Man gibt einen Satz ein, und das Modell «malt» ein Bild, das so nie fotografiert wurde. Es setzt das Bild Punkt für Punkt neu aus Gelerntem zusammen. Damit wurde generative KI erstmals einem breiten Publikum sichtbar. Dieses Bild ist selbst ein Ergebnis von DALL·E 2, eine zeichnende Roboterhand, und als KI-erzeugtes Werk urheberrechtlich nicht geschützt.",
    ki: true,
    hotspots: [
      {
        x: 55,
        y: 20,
        titel: "Sprache als Pinsel",
        text: "Ein Satz genügt als Auftrag, und die Maschine «zeichnet». Mit DALL·E 2 im April 2022 entstand zu jeder Beschreibung ein neues Bild.",
      },
      {
        x: 24,
        y: 58,
        titel: "Erfunden, nicht gefunden",
        text: "Das Bild existiert nirgends, das Modell setzt es Punkt für Punkt neu zusammen. Dieses hier hat DALL·E 2 erzeugt, und es ist urheberrechtlich nicht geschützt.",
      },
      {
        x: 45,
        y: 82,
        titel: "Früher als ChatGPT",
        text: "Das vergisst man leicht. Die Bild-KI war zuerst da, nämlich DALL·E 2 im April 2022, ein halbes Jahr bevor ChatGPT im November 2022 alle erreichte.",
      },
    ],
  },
  {
    src: "/art/chatgpt.svg",
    alt: "Illustration von ChatGPT (2022): ein Chatfenster mit einer Frage in Alltagssprache und einer flüssig getippten KI-Antwort.",
    titel: "ChatGPT: KI für alle",
    jahr: "November 2022",
    kurz: "der Chatbot, der KI in den Alltag brachte",
    quelle: "Schematische Illustration, mit KI erstellt für dieses Lehrmittel · kein Foto",
    geschichte:
      "ChatGPT von OpenAI erschien im November 2022 und machte KI für alle bedienbar. Es war ein Chatfenster mit normaler Sprache, sofort nutzbar. Innert weniger Wochen nutzten es Millionen. Das war der Moment, in dem KI im Alltag ankam. Das Modell setzt Wort für Wort den wahrscheinlich nächsten Textbaustein. Das gelingt verblüffend gut, kann aber auch überzeugend falsch sein. Zusätzlich wurde es mit menschlichem Feedback trainiert, um hilfreicher und harmloser zu antworten. Diese Illustration eines Chatfensters ist mit KI erstellt.",
    ki: true,
    hotspots: [
      {
        x: 61,
        y: 29,
        titel: "Einfach reden",
        text: "Man tippt eine Frage in ganz normaler Sprache, und die KI antwortet flüssig. Es braucht keine Fachkenntnis und keinen Befehl.",
      },
      {
        x: 40,
        y: 60,
        titel: "Wort für Wort",
        text: "Das Modell setzt immer den wahrscheinlich nächsten Textbaustein. Das ist verblüffend gut, aber ohne echtes Wissen. Es kann auch überzeugend irren.",
      },
      {
        x: 50,
        y: 88,
        titel: "Der Durchbruch",
        text: "Innert Wochen nutzten Millionen ChatGPT. Es war der Moment, in dem KI im Alltag vieler Menschen ankam.",
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

      <ModulMiniNav />

      <Link
        href="/lernen/lernseite-2"
        className="inline-flex items-center gap-xs text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Zurück zu Lernseite 2
      </Link>

      <AbschnittKopf bild="/art/vorhang-kopf.webp" gross className="mt-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Thema 01 · Auftakt
        </p>
        <div className="mt-sm flex flex-wrap items-center gap-md">
          <h1 className="text-headline-xl text-on-surface">
            Vorhang auf: eine neue Akteurin
          </h1>
          <AktivitaetsKopf />
        </div>
        <p className="mt-md max-w-3xl text-body-lg text-on-surface-variant">
          <GlossarText text="Kaum ein Thema ist so präsent wie die Künstliche Intelligenz. Und kaum eines ist so schwer zu fassen. Diese Seite gibt der KI einen Ort, an dem wir ihrer Gestalt nachgehen, statt nur über sie zu reden." />
        </p>
      </AbschnittKopf>
      <Ausklapptext className="mt-md max-w-3xl" titel="Mehr dazu: der Weg durch diese Seite">
        <p>
          <GlossarText text="Um die KI zu verstehen, nähern wir uns ihr aus mehreren Richtungen. Zuerst fragen wir nach der Herkunft, also wie das Phänomen einer denkenden Maschine kulturell und technisch entstanden ist. Das erzählt die KI-Story. Einzelne Stationen werden danach in Bildern greifbar, die begehbare Punkte tragen. Dann treten die Merkmale hervor, jene Eigenschaften, die wir seit November 2022 mit den grossen Sprachmodellen täglich erleben. Zum Schluss geht es um die Kontexte, in denen die neue Akteurin heute steckt. Das Fazit vorweg lautet, dass KI weit mehr ist als das Chatfenster, in das wir unsere Fragen tippen." />
        </p>
      </Ausklapptext>

      {/* Inhaltsverzeichnis + Klammersymbol (oben rechts) */}
      <Inhaltsverzeichnis
        className="mt-xl max-w-3xl"
        eintraege={[
          { id: "einstiegsmuster", label: "Einstiegsmuster", prefixe: ["vorhang-auf:gewebe"] },
          { id: "ki-story", label: "Die KI-Story", prefixe: ["vorhang-auf:story"] },
          { id: "bilder", label: "Bilder zur KI-Geschichte", prefixe: ["vorhang-auf:bild"] },
          { id: "merkmale", label: "Die Merkmale der neuen Akteurin", prefixe: ["vorhang-auf:weisheit"] },
          { id: "ki-kontext", label: "Die KI im Kontext", prefixe: ["vorhang-auf:kontext"] },
        ]}
      />

      {/* Das Muster der Seite — die Auftritts-Signatur gross und interaktiv,
          wie das Gewebe-Spiel der Startseite */}
      <div id="einstiegsmuster" className="scroll-mt-24">
        <GewebeSpiel
          className="mt-xl max-w-5xl"
          spurKey="vorhang-auf:gewebe"
          punkte={AUFTRITT_PUNKTE}
          weben
          bereichLabel="Einstiegsmuster (Auftakt)"
          hoehe={285}
        />
      </div>

      {/* Aktivitätsnetz als mitwanderndes Symbol (schwebt unten rechts, geht
          beim Klick zum vollen Netz auf) */}
      <AktivitaetsNetzFloat />

      {/* Video-Impuls zum Einstieg — YouTube-ID folgt (Prop videoId) */}
      <VideoImpuls
        className="mt-xl"
        spurId="video:vorhang-auf"
        titel="Vorhang auf: die neue Akteurin"
        beschreibung="Ein kurzer Input zum Auftakt. Was ist da auf die Bühne getreten, und warum passt es in keine unserer alten Schubladen?"
      />

      {/* 1 — Die KI-Story als lineare Knotenlandschaft mit Einfluss-Bögen */}
      <AkkordeonGruppe>
      <Abschnitt
        id="ki-story"
        className="mt-xl max-w-5xl"
        bild="/art/vorhang-story.webp"
        titel="Die KI-Story"
        prefixe={["vorhang-auf:story"]}
        vorschau={
          <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
            <GlossarText text="Die KI hat eine lange Vorgeschichte. Schon lange vor dem Computer träumten Menschen davon, künstliche Wesen zu erschaffen. Diese KI-Story führt in zweiundzwanzig Stationen von den antiken Mythen bis zu den heutigen Sprachmodellen." />
          </p>
        }
      >
        <Ausklapptext className="mt-md max-w-4xl" titel="Mehr dazu: die beiden Fäden der Geschichte">
          <p>
            <GlossarText text="Durch die Geschichte laufen zwei Fäden nebeneinander. Der eine Faden ist die Erzählung vom belebten Ding, zum Beispiel beim Golem oder bei Frankensteins Geschöpf. Der andere Faden ist die Technik, die das Rechnen und Denken Schritt für Schritt an Maschinen abgibt. Ein wichtiger Baustein auf diesem Weg ist der Algorithmus. Im Jahr 1950 fragte der Mathematiker Alan Turing, ob Maschinen denken können, und schlug dafür den Turing-Test vor. Im Jahr 1956 gab die Dartmouth-Konferenz dem jungen Forschungsfeld seinen Namen, nämlich künstliche Intelligenz. In den heutigen Sprachmodellen treffen beide Fäden zusammen, die alte Vorstellung vom künstlichen Wesen und die reale Auslagerung des Rechnens." />
          </p>
        </Ausklapptext>
        <Aufgabe className="mt-md max-w-4xl">
          <p>
            <strong className="text-on-surface">Worum es hier geht:</strong> Die
            KI ist nicht aus dem Nichts entstanden. Zwei alte Linien laufen auf
            sie zu. Die eine ist der Traum vom künstlichen Wesen, die andere ist
            die Technik des Rechnens. In diesem Gewebe suchst du die Spuren
            beider Linien.
          </p>
          <p className="mt-sm">
            <strong className="text-on-surface">So gehst du vor:</strong> Oben
            stehen Begriffe, jeder steht für eine Station im Netz. Zu Beginn sind
            zufällig drei Punkte hervorgehoben. Tippst du einen Begriff oder Punkt
            an, öffnet sich seine Geschichte als Karte. Je mehr du öffnest, desto
            mehr farbige Flächen entstehen zwischen den Punkten, das Netz wird
            gewebeartig. So knüpfst du dein eigenes Netz. Mit der Ansicht
            «Zeitlich» ordnest du die Stationen von früher nach heute.
          </p>
          <p className="mt-sm">
            <strong className="text-on-surface">Dein Ziel:</strong> Das Netz
            selbst ist nicht das Ziel. Wichtig ist, dass du den Punkten, die du
            öffnest, auch nachgehst. Lies die Geschichte, vertiefe sie bei «Mehr
            lesen» und halte mit «Das verfolge ich weiter» fest, was dich
            interessiert. Alles, was du anschaust, vertiefst oder weiterverfolgst,
            fliesst in deine Gesamtaktivität ein, die du im Rhizom-Symbol unten
            rechts und im Orakel wiederfindest. Du musst nicht alle zweiundzwanzig
            Stationen öffnen, geh dem nach, was dich neugierig macht, und achte
            darauf, wie Traum und Technik in der heutigen KI zusammenlaufen.
          </p>
        </Aufgabe>
        <InfoPunkt className="mt-md" label="Muss ich allen 22 nachgehen?">
          Nein, du musst nicht jede Station öffnen. Geh dem nach, was dich
          neugierig macht. Die Aktivitätsmessung registriert aber, was du
          anschaust, verschiebst und weiterverfolgst. Das ist keine Note. Es
          dient nur dazu, dir am Ende im Orakel eine persönliche Rückmeldung zu
          deinem Weg durch das Modul zu geben.
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
            { von: 4, zu: 8 },
            { von: 6, zu: 7 },
            { von: 6, zu: 9 },
            { von: 7, zu: 13 },
            { von: 11, zu: 12 },
            { von: 12, zu: 14 },
            { von: 14, zu: 18 },
            { von: 5, zu: 18 },
            { von: 15, zu: 16 },
            { von: 16, zu: 19 },
            { von: 17, zu: 20 },
            { von: 19, zu: 21 },
          ]}
          stationen={[
            {
              titel: "Hephaistos & Talos",
              kurz: "Antike Mythen",
              kat: "erzaehlung",
              mmf: "fiktion",
              jahr: "~8. Jh. v. Chr.",
              text: "Am Anfang steht ein Traum, so alt wie die ältesten Erzählungen des Abendlandes. Schon in der griechischen Antike stellte man sich künstliche Wesen aus Metall vor, die denken und dienen. Der Schmiedegott Hephaistos schuf sich goldene Helferinnen, und der bronzene Riese Talos bewachte eine ganze Insel. Der Wunsch, Verstand in totes Material zu giessen, ist also uralt.",
              geschichte:
                "In Homers «Ilias», dem rund 2800 Jahre alten Heldengedicht, dienen dem Schmiedegott goldene Mägde. Sie besitzen Verstand, Stimme und Kraft, dazu kommen selbstfahrende Dreifüsse, eine Art antiker Roboter. Talos, der bronzene Riese, umkreiste als Wächter die Insel Kreta. Er war ein Automat, lange bevor es das Wort dafür überhaupt gab.",
              mehr:
                "Der bronzene Riese Talos hatte trotz seiner Metallhaut eine einzige verwundbare Stelle. Durch seinen Körper lief nur eine Ader, die am Knöchel von einem Nagel verschlossen war, und in ihr floss das Ichor, das Blut der Götter. Der Sage nach brachte die Zauberin Medea ihn zu Fall, indem sie diesen Nagel löste, worauf das Ichor ausfloss und der Wächter leblos zusammenbrach. Talos soll die Küste Kretas dreimal am Tag umrundet und Fremde mit Felsbrocken vertrieben haben. Bemerkenswert ist, dass der mächtige Wächter also einen winzigen Schwachpunkt besass, an dem sich seine ganze Kraft aufheben liess. Schon dieser früheste Mythos verbindet die künstliche Kraft mit der Frage, wie man sie im Notfall wieder stoppen kann. Dieselbe Sorge um einen sicheren Ausschalter begleitet die Technik bis in heutige Debatten.",
            },
            {
              titel: "Yan Shi's Automat",
              kurz: "Yan Shi",
              kat: "erzaehlung",
              mmf: "fiktion",
              jahr: "~4. Jh. n. Chr.",
              text: "Der Traum vom künstlichen Menschen ist nicht nur europäisch, sondern kehrt in vielen Kulturen wieder. Auch in China erzählte man früh von einer täuschend lebendigen Figur. Ein Handwerker führt sie dem König vor, und niemand erkennt zuerst, dass sie gebaut ist. Schon hier klingt die Frage an, wo die Grenze zwischen echtem und nachgeahmtem Leben verläuft.",
              geschichte:
                "Die Geschichte steht im daoistischen Text «Liezi», der um das 4. Jahrhundert entstand, während die Erzählung selbst viel früher spielt. Der Mechaniker Yan Shi präsentiert dem König Mu von Zhou einen künstlichen Menschen. Die Figur geht, singt und zwinkert den Hofdamen zu. Als der König einen Betrug vermutet, zerlegt Yan Shi sie und zeigt, dass sie nur aus Leder, Holz, Leim und Lack besteht.",
              mehr:
                "Im «Liezi» wird die Figur bis ins Innere beschrieben, denn der Handwerker hatte ihr nachgebildete Organe wie Herz, Lunge, Leber, Nieren, Muskeln und Knochen gegeben. Erstaunlich ist, dass jedes Organ eine eigene Aufgabe trug. Entfernte man das künstliche Herz, verstummte die Figur, nahm man die Leber weg, konnte sie nicht mehr sehen, und ohne die Nieren versagten die Beine. Damit erzählt der Text nicht bloss von einer Puppe, sondern von einem durchdachten künstlichen Körper mit inneren Teilen. Die Episode steht im Kapitel «Tang Wen» und spielt am Hof von König Mu, der von weiten Reisen zurückkehrt. Am Ende zeigt sich der König überzeugt, dass menschliche Geschicklichkeit fast an die Werke der Natur heranreicht. So verhandelt die Erzählung schon vor vielen Jahrhunderten, ob ein Gemachtes dem Gewachsenen gleichkommen kann.",
            },
            {
              titel: "Der Golem",
              kurz: "Golem",
              kat: "erzaehlung",
              mmf: "fiktion",
              jahr: "Prag, 16. Jh.",
              text: "Aus Lehm geformt und durch ein Schriftzeichen zum Leben erweckt, ist der Golem eine der eindrücklichsten Sagen vom künstlichen Wesen. Sie stammt aus der jüdischen Überlieferung und wurde vor allem in Prag berühmt. Der Golem ist ein stummer Diener, der gehorcht, aber nicht selbst urteilt. Er ist ein frühes Sinnbild für etwas, das der Mensch in Gang setzt und dann kaum noch bändigen kann.",
              geschichte:
                "Die Prager Sage schreibt Rabbi Löw, genannt der Maharal, einen Golem zu. Er formt ihn aus Lehm und erweckt ihn durch das Wort «emet», das Wahrheit bedeutet, auf der Stirn. Löscht man einen Buchstaben, so erlischt die Figur wieder. Als der Golem ihm entgleitet, muss der Rabbi ihn stilllegen.",
              mehr:
                "Der Kniff mit dem Wort ist genau überliefert, denn «emet» heisst Wahrheit, und streicht man den ersten Buchstaben, bleibt «met» stehen, das hebräische Wort für tot. So genügt ein einziges Zeichen, um zwischen Leben und Tod der Figur umzuschalten. In der Prager Erzählung soll der Golem die jüdische Gemeinde vor Angriffen und falschen Beschuldigungen schützen. Weltberühmt wurde der Stoff aber erst spät, durch Gustav Meyrinks Roman «Der Golem» von 1915 und den Stummfilm von Paul Wegener aus dem Jahr 1920. Auffällig ist, wie nah das an heutige Technik rückt, denn auch hier steckt die ganze Macht in einer winzigen sprachlichen Anweisung. Das Gleichnis fragt, ob der Schöpfer sein Werk noch beherrscht, sobald es einmal in Bewegung geraten ist.",
            },
            {
              titel: "Der Homunkulus",
              kurz: "Homunkulus",
              kat: "erzaehlung",
              mmf: "fiktion",
              jahr: "16. Jh.",
              text: "Menschen träumten davon, im Labor selbst Leben zu erschaffen. Ein Homunkulus (lateinisch für «kleiner Mensch») ist so ein künstliches Wesen, das in einem Glaskolben heranwachsen sollte.",
              geschichte:
                "Die Idee stammt aus der Alchemie. Das war eine frühe Form der Naturforschung und die Vorläuferin der heutigen Chemie. Um das Jahr 1520 beschrieb der Arzt Paracelsus ein Rezept, um in einem Glaskolben (der «Retorte») ein winziges künstliches Menschlein zu erzeugen. Der Philosoph Ernst Bloch nannte solche Eingriffe später die «älteste gewollte Form von Technik».",
              mehr:
                "Das Rezept des Paracelsus war erstaunlich konkret, denn in der Schrift «De natura rerum» sollte man menschlichen Samen viele Wochen in einem verschlossenen Kolben bei gleichmässiger Körperwärme reifen lassen und mit Blut nähren. Am Ende, so die Vorstellung, entstünde ein winziger, aber vollständiger Mensch. Bei Goethe ist es nicht Faust selbst, sondern sein Gehilfe Wagner, der das leuchtende Wesen im Glas erschafft. Der Homunkulus sehnt sich dort nach einem wirklichen Körper und zerschellt, als er sich ins Meer stürzt. Bemerkenswert ist, dass ein Homunkulus in der Überlieferung oft als überaus klug galt, als künstlicher Geist, der mehr wisse als gewöhnliche Menschen. Genau dieser Gedanke eines gemachten, überlegenen Verstandes verbindet die alte Alchemie mit der heutigen Frage nach künstlicher Intelligenz.",
            },
            {
              titel: "Frühe Automaten",
              kurz: "Automaten",
              kat: "mechanik",
              mmf: "maschine",
              jahr: "1770",
              text: "Im 18. Jahrhundert staunte Europa über kunstvolle Maschinen, die Menschen und Tiere nachahmten. Der berühmte «Schachtürke» schien sogar zu denken und schlug reihenweise seine Gegner. In Wahrheit sass ein Mensch versteckt im Inneren des Kastens. Zum ersten Mal entstand breit der Verdacht, eine Maschine könnte klug sein, und man sieht daran, wie leicht wir das glauben.",
              geschichte:
                "Wolfgang von Kempelens Schach spielender «Türke» schlug ab 1770 Fürsten und Kaiser. Im Innern des Kastens sass jedoch ein verborgener Mensch und lenkte die Figur. Europa stritt trotzdem jahrzehntelang darüber, ob eine Maschine denken könne. Die Täuschung bewies vor allem, wie bereitwillig wir Maschinen einen Verstand zutrauen.",
              mehr:
                "Ein besonders eindrückliches Stück steht in der Schweiz, denn der «Schreiber» von Pierre Jaquet-Droz aus dem 18. Jahrhundert lässt sich im Museum von Neuenburg bis heute in Betrieb bestaunen. Die Figur tunkt die Feder ins Tintenfass und schreibt einen frei einstellbaren Text von bis zu vierzig Zeichen, gesteuert über auswechselbare Nockenscheiben. Weil sich das Geschriebene auf diese Weise verändern lässt, gilt der «Schreiber» als früher Vorbote des programmierbaren Computers. Der Schachtürke wiederum reiste nach Kempelens Tod mit dem Schausteller Johann Nepomuk Mälzel weiter und trat sogar gegen Napoleon an. Der Schriftsteller Edgar Allan Poe versuchte 1836 in einem Aufsatz zu beweisen, dass ein Mensch im Kasten sitzen müsse. Der Apparat verbrannte schliesslich 1854 bei einem Museumsbrand in Philadelphia. So trennen diese Geräte den schönen Schein vom wirklichen Können, eine Unterscheidung, die bei der KI wieder hochaktuell ist.",
            },
            {
              titel: "Frankenstein",
              kurz: "Frankenstein",
              kat: "erzaehlung",
              mmf: "fiktion",
              jahr: "1818",
              text: "Mary Shelley schrieb mit «Frankenstein» einen der ersten grossen Science-Fiction-Romane und stellte darin eine bis heute gültige Frage. Ein Forscher erschafft ein lebendiges Wesen und stösst es im Moment des Gelingens entsetzt von sich. Nicht die Kreatur ist das eigentliche Ungeheuer, sondern die verweigerte Verantwortung. Damit stellt die Literatur die Verantwortungsfrage lange bevor die Technik sie stellte.",
              geschichte:
                "Mary Shelleys Roman von 1818 lässt Victor Frankenstein ein Wesen aus toter Materie erschaffen. Kaum lebt es, verstösst er es aus Ekel und Angst. Das Wesen wird erst durch diese Zurückweisung und die Einsamkeit zum Rächer. Die Geschichte fragt also nicht, ob man Leben schaffen darf, sondern wer für das Geschaffene einsteht.",
              mehr:
                "Die Geschichte entstand im Sommer 1816 am Genfersee, wo Mary Shelley zusammen mit dem Dichter Lord Byron und weiteren Gästen die Villa Diodati bewohnte. Weil ein Vulkanausbruch das Wetter verdüstert hatte, schlug Byron einen Wettbewerb vor, wer die unheimlichste Geschichte schreibe, und aus Marys Beitrag wurde der Roman. Auch im Buch spielt die Schweiz eine grosse Rolle, denn Victor Frankenstein ist Genfer, und er begegnet seinem Geschöpf hoch oben auf dem Eismeer bei Chamonix. Anders als in vielen späteren Verfilmungen ist das Wesen dort nicht sprachlos, sondern klagt in wohlgesetzten Worten sein Elend. Bemerkenswert ist, dass es sich seine Bildung selbst aneignet, indem es heimlich einer Familie zuhört und Bücher liest. Gerade dieses selbstständige Lernen eines künstlichen Wesens macht den alten Stoff für die Frage nach der KI so anschlussfähig.",
            },
            {
              titel: "Rechenmaschinen",
              kurz: "Rechenmaschinen",
              kat: "mechanik",
              mmf: "maschine",
              jahr: "1673–1843",
              text: "Neben dem Traum vom künstlichen Wesen läuft eine zweite Linie, die des Rechnens. Im 17. und 19. Jahrhundert bauten Gelehrte Maschinen, die selbständig rechnen sollten. Von Leibniz' Rechenrad bis zu Babbages programmierbarem Entwurf wird die Idee greifbar, dass sich Denken in klare Schritte zerlegen lässt. Damit wird zum ersten Mal vorstellbar, dass eine Maschine Aufgaben des Geistes übernimmt.",
              geschichte:
                "Der Gelehrte Gottfried Wilhelm Leibniz baute um 1673 eine Maschine für alle vier Grundrechenarten. Er träumte davon, Streitfragen künftig durch Rechnen zu entscheiden. Charles Babbage entwarf im 19. Jahrhundert die «Analytical Engine», eine frei programmierbare Rechenmaschine. Ada Lovelace schrieb 1843 das erste Programm dafür und hielt zugleich fest, dass die Maschine nur ausführen kann, was man ihr aufträgt.",
              mehr:
                "Ein oft übersehener Beitrag von Leibniz ist das Zweiersystem, das er um 1703 ausführlich beschrieb und das mit den Ziffern null und eins auskommt. Genau dieses Binärsystem bildet heute die Grundlage jedes Computers. Babbages Maschine sollte ihre Anweisungen von Lochkarten ablesen, eine Idee, die er von den gemusterten Webstühlen des Joseph-Marie Jacquard übernahm. Ada Lovelace war die Tochter des Dichters Lord Byron, der schon in der Entstehung von Frankenstein vorkommt. In ihren Anmerkungen hielt sie fest, wie sich mit der Maschine die sogenannten Bernoulli-Zahlen berechnen liessen, was viele als das erste Programm der Geschichte betrachten. Sie ahnte zudem, dass eine solche Maschine eines Tages sogar Musik verarbeiten könnte, sofern man Töne in Zahlen fasst. Nach ihr wurde viel später eine Programmiersprache benannt.",
            },
            {
              titel: "Der Algorithmus wird ausführbar",
              kurz: "Algorithmus",
              kat: "regeln",
              mmf: "maschine",
              jahr: "1936–1950er",
              text: "Ein Algorithmus ist nichts anderes als eine genaue Schritt-für-Schritt-Anleitung, um eine Aufgabe zu lösen. Solche Anleitungen kennt die Menschheit seit der Antike. Mit den ersten Computern aber wird der Algorithmus ausführbar, denn nun arbeitet eine Maschine das Verfahren selbsttätig ab. Damit wird aus einer Idee auf Papier eine Kraft, die selbständig handelt.",
              geschichte:
                "Das Wort «Algorithmus» geht auf den Gelehrten al-Chwarizmi zurück, der um 820 in Bagdad wirkte, und die Verfahren selbst sind noch viel älter. Erst Alan Turings gedankliche «Maschine» von 1936 und die ersten elektronischen Rechner der 1940er-Jahre veränderten alles. Von da an führte nicht mehr ein Mensch mit Papier und Bleistift die Schritte aus, sondern die Maschine selbst. Der Algorithmus wurde damit vom blossen Rezept zum Motor der Rechenmaschine.",
              mehr:
                "Ein greifbares Beispiel für den ausführbaren Algorithmus ist die Z3 des Berliner Ingenieurs Konrad Zuse, die 1941 als erster funktionsfähiger programmgesteuerter Rechner gilt. Sie arbeitete bereits mit dem Binärsystem und wurde über einen gelochten Streifen mit Befehlen versorgt. Der Name «Algorithmus» geht auf den Gelehrten al-Chwarizmi zurück, dessen Werk zugleich dem Wort «Algebra» seinen Namen gab. Turings gedankliches Modell von 1936 beschrieb eine Maschine mit einem endlosen Band, die durch einfache Schreib- und Leseschritte jedes berechenbare Problem lösen kann. Im Zweiten Weltkrieg half Turing dann, mit eigens gebauten Maschinen den deutschen Funkschlüssel Enigma zu knacken. So wurde aus einer reinen Denkfigur in wenigen Jahren eine wirklich arbeitende Maschine. Damit war die Grundlage gelegt, auf der jede spätere KI aufbaut.",
            },
            {
              titel: "Geburt der KI",
              kurz: "Dartmouth",
              kat: "regeln",
              mmf: "mensch",
              jahr: "1956",
              text: "1956 bekommt der alte Traum endlich einen Namen. An einem Sommertreffen am Dartmouth College in den USA prägen Forscher den Begriff «Künstliche Intelligenz». Aus verstreuten Ideen und Erzählungen wird ein eigenes Forschungsprogramm mit grossen Zielen. Die Fachleute rechneten damals mit Durchbrüchen innert weniger Jahre.",
              geschichte:
                "Im Sommer 1956 trafen sich am Dartmouth College Forscher um John McCarthy und Marvin Minsky. Ihr Anspruch war es, jede Facette der Intelligenz durch Maschinen nachzubilden. Der alte Traum bekam damit einen Namen und Geld für die Forschung. Man erwartete rasche Erfolge.",
              mehr:
                "Den Namen «Artificial Intelligence» prägte der Mathematiker John McCarthy, der das Treffen organisierte und bewusst einen neutralen Begriff suchte, auch um sich vom älteren Feld der Kybernetik abzugrenzen. Im Antrag von 1955 standen weitere namhafte Forscher, etwa der IBM-Ingenieur Nathaniel Rochester und Claude Shannon, der Begründer der Informationstheorie. Das Treffen fand im Sommer 1956 im Städtchen Hanover im US-Staat New Hampshire statt und war als mehrwöchiger Arbeitsaufenthalt gedacht. Finanziert wurde es zu einem grossen Teil von der Rockefeller-Stiftung. Statt eines einzelnen Durchbruchs brachte der Sommer vor allem viele Einzelideen und dauerhafte Kontakte. Trotzdem gilt Dartmouth als Geburtsstunde des Fachs, weil hier erstmals ein gemeinsamer Name und ein gemeinsames Ziel entstanden. Der erhoffte rasche Erfolg aber liess Jahrzehnte auf sich warten.",
            },
            {
              titel: "Symbolische KI",
              kurz: "Symbolische KI",
              kat: "regeln",
              mmf: "maschine",
              jahr: "1956–1970er",
              text: "Die erste grosse KI-Richtung verstand Denken als das Anwenden klarer Regeln. Wissen wurde in Wenn-dann-Sätze gefasst, und Schliessen bedeutete, aus Regeln neue Sätze abzuleiten. In eng begrenzten Welten wie dem Schach funktionierte das erstaunlich gut. An der offenen, mehrdeutigen Alltagswelt aber scheiterte dieser Weg.",
              geschichte:
                "Die frühe KI baute Intelligenz aus Symbolen und Logik auf. Wissen wurde in Regeln gefasst, und Denken wurde als folgerichtiges Ableiten verstanden. In engen Welten wie Schach, Logikbeweisen oder einfachen Klötzchen-Aufgaben glänzte der Ansatz. An der offenen, mehrdeutigen Alltagswelt aber biss er sich fest.",
              mehr:
                "Ein berühmtes Beispiel ist ELIZA, das Joseph Weizenbaum 1966 am MIT schrieb und das ein Gespräch mit einem Psychotherapeuten nachahmte. Das Programm verstand nichts, sondern spiegelte die Eingaben nach festen Mustern zurück, indem es aus einer Aussage geschickt eine Rückfrage formte. Weizenbaum erschrak selbst, wie schnell Menschen ELIZA für einfühlsam hielten und ihm Persönliches anvertrauten. Ebenfalls bekannt wurde SHRDLU von Terry Winograd um 1970, das in einer erfundenen Welt aus farbigen Klötzen sprachliche Befehle wie «stelle den roten Würfel auf den grünen» ausführte. In dieser eng begrenzten Welt wirkte das Programm klug, doch ausserhalb davon war es hilflos. Genau daran zeigte sich die Grenze der symbolischen KI, denn die wirkliche Welt lässt sich nicht restlos in feste Regeln fassen.",
            },
            {
              titel: "Expertensysteme",
              kurz: "Expertensysteme",
              kat: "regeln",
              mmf: "maschine",
              jahr: "1970er–80er",
              text: "In den 1970er- und 1980er-Jahren setzte man grosse Hoffnungen auf sogenannte Expertensysteme. Fachwissen von Ärztinnen oder Ingenieuren wurde in tausende Regeln gegossen, damit der Computer Spezialaufgaben löst. In ihrer Nische waren diese Systeme durchaus stark. Die erhoffte breite, allgemeine Intelligenz aber blieb aus.",
              geschichte:
                "Systeme wie MYCIN gossen das Wissen von Fachleuten in tausende Wenn-dann-Regeln, etwa für die Diagnose von Infektionen. In ihrem engen Gebiet waren sie nützlich. Doch sie blieben teuer im Unterhalt. Und sie waren starr gegenüber allem, was in keiner Regel stand.",
              mehr:
                "Schon vor MYCIN entstand an der Universität Stanford das System DENDRAL, das aus chemischen Messdaten auf mögliche Molekülstrukturen schloss und als eines der ersten Expertensysteme überhaupt gilt. Den grössten wirtschaftlichen Erfolg hatte in den 1980er-Jahren das Programm XCON der Firma Digital Equipment, das Kundenbestellungen für Grossrechner fehlerfrei zusammenstellte und dem Unternehmen viel Geld sparte. Solche Systeme bestanden aus hunderten bis tausenden von Hand geschriebenen Regeln, die eigens befragte Fachleute lieferten. Dafür entstand sogar ein neuer Beruf, jener des Wissensingenieurs, der das Fachwissen in Regeln übersetzte. Ihre grundsätzliche Schwäche blieb aber, denn sie konnten nicht von selbst dazulernen und wurden mit jeder neuen Regel schwerer zu pflegen. Als gegen Ende der 1980er die teure Spezialtechnik dafür veraltete, verloren viele Firmen das Vertrauen. Damit endete die erste grosse Welle kommerzieller KI.",
            },
            {
              titel: "KI-Winter",
              kurz: "KI-Winter",
              kat: "regeln",
              mmf: "mensch",
              jahr: "1974–1993",
              text: "Zweimal in ihrer Geschichte galt die KI schon als gescheitert. Wenn die grossen Versprechen ausblieben, zogen sich Geldgeber und Öffentlichkeit enttäuscht zurück. Man nennt diese kalten Phasen «KI-Winter», weil Forschungsgelder und Vertrauen gleichsam einfroren. Beide Male überwinterten die Ideen und kehrten später mit einem neuen Ansatz zurück.",
              geschichte:
                "Als die versprochenen Durchbrüche ausblieben, froren die Forschungsgelder ein. Kritische Berichte und gescheiterte Projekte liessen den Glauben an die KI abkühlen. Der Begriff war zeitweise so belastet, dass Forschende ihre Arbeit lieber anders nannten. Aus «Künstlicher Intelligenz» wurde dann zum Beispiel schlicht «Datenanalyse».",
              mehr:
                "Der Ausdruck «KI-Winter» wurde 1984 an einer Fachtagung geprägt, in bewusster Anlehnung an den damals viel diskutierten «nuklearen Winter». In den USA strich die Forschungsagentur DARPA schon in den 1970er-Jahren Gelder, nachdem hoch gesteckte Ziele wie das automatische Verstehen gesprochener Sprache nicht erreicht wurden. Besonders folgenreich war das Buch «Perceptrons» von Marvin Minsky und Seymour Papert aus dem Jahr 1969, das die Grenzen einfacher neuronaler Netze aufzeigte. Danach galt die Forschung an solchen Netzen lange als Sackgasse, und die Mittel flossen in andere Ansätze. Erst viele Jahre später sollten neuronale Netze eine glänzende Rückkehr feiern. Rückblickend zeigen die Winter ein Muster, denn jedes Mal folgten auf überzogene Versprechen zuerst Enttäuschung und Geldentzug. Und jedes Mal kehrte die KI danach mit einer neuen Grundidee stärker zurück.",
            },
            {
              titel: "Statistische KI",
              kurz: "Statistische KI",
              kat: "daten",
              mmf: "mensch",
              jahr: "1990er",
              text: "In den 1990er-Jahren kam die grosse Wende. Statt Regeln von Hand zu schreiben, liess man Maschinen aus vielen Beispielen selbst lernen. Damit wurden die Daten wichtiger als die aufgeschriebene Logik. Die KI begann, Muster zu erraten, statt starre Vorschriften zu befolgen.",
              geschichte:
                "Ab den 1990er-Jahren lernten Maschinen Muster aus Beispielen, etwa um Spam zu erkennen, Handschrift zu lesen oder Sprache zu erraten. Nicht mehr das aufgeschriebene Wissen der Fachleute war entscheidend, sondern die Menge und die Qualität der Daten. Das war ein tiefer Bruch mit der regelbasierten KI. Der Erfolg gab dem neuen Weg recht.",
              mehr:
                "Hinter dieser Wende stand oft ein einfaches mathematisches Werkzeug, der Satz von Bayes, mit dem sich Wahrscheinlichkeiten aus Häufigkeiten berechnen lassen. Ein Spamfilter etwa lernt aus vielen Beispielmails, wie verdächtig einzelne Wörter sind, und schätzt daraus, wie wahrscheinlich eine neue Mail Werbung ist. Auch gesprochene Sprache wurde nun mit statistischen Modellen erkannt, was 1997 zur ersten alltagstauglichen Diktiersoftware für den Heimgebrauch führte. Ähnlich begann man, Übersetzungen nicht mehr über Grammatikregeln, sondern über die Häufigkeit von Wortpaaren in grossen zweisprachigen Textsammlungen zu berechnen. Der gemeinsame Gedanke war, dass die Maschine nichts versteht, sondern aus vielen Fällen die wahrscheinlichste Antwort schätzt. Voraussetzung dafür waren wachsende Rechenkraft und immer grössere Datenmengen. Damit war der Boden für alles bereitet, was danach kam.",
            },
            {
              titel: "Algorithmen filtern das Internet",
              kurz: "Internet-Filter",
              kat: "daten",
              mmf: "maschine",
              jahr: "1994–1998",
              text: "Mit dem wachsenden Internet wurde die schiere Menge zum Problem. Algorithmen begannen, die Flut zu sortieren und zu ordnen. Empfehlungs- und Rangfolge-Verfahren entschieden fortan, was wir zuerst sehen. Zum ersten Mal bestimmte nicht ein Mensch, sondern eine Rechenvorschrift über Sichtbarkeit im grossen Massstab.",
              geschichte:
                "1994 schlug das Projekt GroupLens vor, Beiträge automatisch nach dem Geschmack ähnlicher Nutzer zu empfehlen. So entstand das «kollaborative Filtern». 1998 ordnete Googles PageRank Webseiten danach, wie viele andere Seiten auf sie verweisen. Damit entschied erstmals ein Algorithmus im grossen Massstab über Reihenfolge und Sichtbarkeit.",
              mehr:
                "Der Name PageRank spielt auf Larry Page an, der das Verfahren zusammen mit Sergey Brin an der Universität Stanford entwickelte, wo ihre Suchmaschine anfangs noch «BackRub» hiess. Die Grundidee lehnten die beiden an die Wissenschaft an, denn dort gilt ein Aufsatz als bedeutend, wenn viele andere ihn zitieren. Übertragen aufs Web heisst das, eine Seite ist wichtig, wenn viele wichtige Seiten auf sie verweisen. Fast zeitgleich brachte der Onlinehändler Amazon Ende der 1990er-Jahre Empfehlungen der Art «Kunden, die dies kauften, kauften auch jenes» gross heraus. Beide Ansätze eint, dass nicht mehr ein Mensch, sondern eine Formel über Sichtbarkeit und Reihenfolge entscheidet. Wer weit oben steht, wird gefunden, der Rest verschwindet in der Masse. So wurde der Rang zur eigentlichen Währung im Netz.",
            },
            {
              titel: "Algorithmen kuratieren Social Media",
              kurz: "Social-Media-Feed",
              kat: "daten",
              mmf: "maschine",
              jahr: "ab 2006",
              text: "Wenig später zogen die sozialen Netzwerke nach. Statt Beiträge einfach der Reihe nach zu zeigen, ordnet ein Algorithmus sie nach vermuteter Wichtigkeit. Lernende Systeme entscheiden für jede Person einzeln, was zuoberst steht. Damit formt die Rechenvorschrift mit, worüber eine ganze Gesellschaft spricht.",
              geschichte:
                "2006 führte Facebook den «News Feed» ein. Beiträge wurden nun gebündelt und gewichtet statt bloss chronologisch angezeigt. Später bestimmten lernende Systeme anhand jeder Reaktion, jedes Klicks und jeder Verweildauer, was einzelne Nutzer sahen. Aus einer einfachen Liste wurde eine für jede Person anders zusammengestellte Bühne.",
              mehr:
                "Als Facebook den «News Feed» im September 2006 einführte, gab es zunächst heftige Proteste, denn viele empfanden das automatische Sammeln ihrer Aktivitäten als übergriffig. Wenig später, im Jahr 2009, kam der «Gefällt mir»-Knopf dazu, der dem System laufend verriet, was Anklang findet. Aus solchen Signalen lernten die Netzwerke, wem sie welchen Beitrag zuoberst zeigen sollten. Der Bürgerrechtler Eli Pariser prägte 2011 dafür das Bild der «Filterblase», also einer Nachrichtenwelt, die jedem vor allem das Genehme vorsetzt. Am weitesten treibt es der sogenannte For-You-Feed von TikTok, der fast nur noch aus algorithmisch ausgewählten Videos besteht und ganz ohne Freundesnetz auskommt. Kritiker warnen, dass so besonders starke Gefühle belohnt werden, weil sie die Aufmerksamkeit am längsten fesseln. Was die Systeme messen, formt am Ende mit, worüber eine Gesellschaft spricht.",
            },
            {
              titel: "Deep Learning",
              kurz: "Deep Learning",
              kat: "daten",
              mmf: "maschine",
              jahr: "ab 2012",
              text: "Ab 2012 gelang der Durchbruch mit künstlichen neuronalen Netzen, die dem Gehirn grob nachempfunden sind. Solche Netze mit vielen Schichten lernen, Bilder und Sprache zu erkennen. Der Erfolg kommt gerade aus dieser Tiefe, also aus der grossen Zahl der Schichten. Daher der Name Deep Learning, was tiefes Lernen bedeutet.",
              geschichte:
                "2012 gewann ein tiefes neuronales Netz den grossen ImageNet-Bildwettbewerb mit deutlichem Vorsprung. Trainiert wurde es auf Grafikkarten und mit Millionen von Bildern. Solche Netze lernen Schicht für Schicht ihre eigenen Merkmale, statt sie vorgesagt zu bekommen. Seither bestimmt dieses Prinzip die Bild-, Sprach- und Texterkennung.",
              mehr:
                "Das siegreiche Netz von 2012 trug den Namen «AlexNet» und stammte aus der Arbeitsgruppe von Geoffrey Hinton an der Universität Toronto, der oft als Wegbereiter des Feldes gilt. Wie weit solche Netze reichen, zeigte 2016 das Programm AlphaGo der Firma DeepMind, das den Weltklassespieler Lee Sedol im Brettspiel Go mit vier zu eins besiegte. Das galt als Sensation, weil Go als viel zu vielfältig für blosses Durchrechnen gilt und eher ein Gespür verlangt. Ein Zug im zweiten Spiel war so ungewöhnlich, dass ihn Fachleute zuerst für einen Fehler hielten, bis er sich als geniale Idee erwies. Wenig später lernte eine Nachfolgeversion das Spiel ganz allein, indem sie millionenfach gegen sich selbst antrat. 2018 erhielten drei Pioniere des Deep Learning den Turing Award, die höchste Auszeichnung der Informatik. So wurde aus einer lange belächelten Idee die tragende Technik der heutigen KI.",
            },
            {
              titel: "Der Transformer",
              kurz: "Transformer",
              kat: "daten",
              mmf: "maschine",
              jahr: "2017",
              text: "2017 stellten Forschende bei Google eine neue Bauweise für KI vor, den Transformer. Sein Trick ist die Aufmerksamkeit, denn das Modell lernt, welche Wörter im Satz aufeinander achten müssen. Damit lassen sich sehr grosse Textmengen verarbeiten. Der Transformer ist die gemeinsame Grundlage fast aller heutigen Sprachmodelle.",
              geschichte:
                "Der Aufsatz «Attention Is All You Need» von 2017 führte den Aufmerksamkeits-Mechanismus ein. Das Modell gewichtet, welche Teile eines Textes für welche anderen wichtig sind, und das über lange Passagen hinweg. Diese Berechnung lässt sich stark parallel ausführen. Dadurch liessen sich Modelle erstmals auf riesige Textmengen vergrössern.",
              mehr:
                "Vor dem Transformer verarbeiteten Sprachmodelle einen Satz Wort für Wort und mussten warten, bis ein Wort fertig war, bevor das nächste an die Reihe kam. Bei langen Sätzen ging der Anfang dabei oft verloren. Der Transformer betrachtet dagegen alle Wörter zugleich und berechnet für jedes, wie stark es auf jedes andere achten soll. So erkennt das Modell im Satz «das Tier überquerte die Strasse nicht, weil es müde war», dass sich «es» auf das Tier bezieht und nicht auf die Strasse. Der Aufsatz stammte von einem achtköpfigen Team bei Google und wurde zu einer der meistzitierten Arbeiten der ganzen KI-Forschung. Schon 2018 stellte Google mit BERT einen solchen Transformer vor und baute ihn kurz darauf in seine Suche ein. Von da an wurde die Bauweise zum Standard für fast jedes grosse Sprachmodell.",
            },
            {
              titel: "Die GPT-Welle",
              kurz: "GPT-Welle",
              kat: "daten",
              mmf: "maschine",
              jahr: "2018–2020",
              text: "Zwischen 2018 und 2020 wurden die Sprachmodelle Stufe um Stufe grösser. Mit GPT-1, GPT-2 und GPT-3 wuchs erstaunlicherweise auch das, was sie ganz ohne eigenes Training konnten. Allein aus dem Vorhersagen des nächsten Wortes entstanden neue Fähigkeiten. Grösse allein brachte hier einen Sprung in der Leistung.",
              geschichte:
                "Ab 2018 zeigten die GPT-Modelle der Firma OpenAI, dass das blosse Vorhersagen des nächsten Wortes auf riesigen Textmengen erstaunlich weit trägt. GPT-3 aus dem Jahr 2020 hatte 175 Milliarden einstellbare Werte, sogenannte Parameter. Es konnte Texte schreiben, übersetzen und Fragen beantworten, ohne für jede Aufgabe eigens trainiert zu werden.",
              mehr:
                "Die Grössensprünge lassen sich in Zahlen fassen, denn GPT-1 hatte 2018 rund 117 Millionen einstellbare Werte, GPT-2 im Jahr darauf schon 1,5 Milliarden. GPT-2 hielt OpenAI zunächst teilweise zurück, aus Sorge, es könne massenhaft täuschend echte Falschtexte erzeugen. Ein Jahr später übertraf GPT-3 seinen Vorgänger noch einmal um mehr als das Hundertfache. Besonders verblüffte, dass man GPT-3 eine neue Aufgabe beibringen konnte, indem man ihm einfach zwei, drei Beispiele in die Eingabe schrieb, ganz ohne Nachtraining. Trainiert wurde es auf gewaltigen Textmengen aus dem Internet, aus Büchern und aus Nachschlagewerken. Fachleute beschrieben damals sogenannte Skalierungsgesetze, wonach die Leistung recht verlässlich mit Grösse, Datenmenge und Rechenzeit wächst. Genau dieser Befund löste das Wettrüsten um immer grössere Modelle aus.",
            },
            {
              titel: "Big Data & Gegenwart",
              kurz: "Gegenwart",
              kat: "daten",
              mmf: "maschine",
              jahr: "ab 2020",
              text: "Möglich wurde die heutige KI erst durch zwei Dinge im Übermass, riesige Datenmengen und gewaltige Rechenzentren. Auf dieser Grundlage entstand die neue Akteurin dieses Moduls. Sie kann im Gespräch antworten und selbst Inhalte erzeugen. Und sie durchdringt inzwischen den Alltag von der Suche bis zum Schreiben.",
              geschichte:
                "Heutige Modelle trainieren auf riesigen Text- und Bildmengen, in Rechenzentren mit zehntausenden von Chips. So entstand die neue Akteurin dieses Moduls. Sie ist dialogfähig und kann selbst Texte und Bilder erzeugen. Und sie ist Alltag geworden, von der Suchmaschine bis zum Schreibassistenten.",
              mehr:
                "Das Herz dieser Rechenzentren sind spezielle Grafikchips, wie sie vor allem die Firma Nvidia herstellt, die dadurch zu einem der wertvollsten Unternehmen der Welt wurde. Ein einzelnes grosses Modell zu trainieren kostet viele Millionen Franken und verschlingt enorme Mengen an Strom. Weil die Chips stark heizen, brauchen manche Rechenzentren zudem grosse Mengen Wasser zur Kühlung, was in trockenen Regionen für Streit sorgt. Die Trainingsdaten stammen zu einem grossen Teil aus dem offenen Internet, dazu kommen Bücher und Bilder. Genau das wirft rechtliche Fragen auf, denn seit 2023 klagen Autorinnen, Verlage und Kunstschaffende, weil ihre Werke ohne Erlaubnis genutzt worden seien. Manche Fachleute warnen sogar, der Vorrat an hochwertigen Texten könnte allmählich knapp werden. So hat die scheinbar körperlose KI eine sehr handfeste Seite aus Energie, Rohstoffen und Recht.",
            },
            {
              titel: "ChatGPT: der Massenmoment",
              kurz: "ChatGPT",
              kat: "daten",
              mmf: "mensch",
              jahr: "November 2022",
              text: "Im November 2022 wurde die KI mit einem Schlag für alle greifbar. ChatGPT verpackte ein starkes Sprachmodell in ein einfaches Chatfenster, in dem man ganz normal fragen kann. Innert Wochen nutzten Millionen von Menschen den Chatbot. Von diesem Moment an war die KI im Alltag angekommen.",
              geschichte:
                "Im November 2022 veröffentlichte die Firma OpenAI ChatGPT, ein auf Gespräch getrimmtes Sprachmodell. Es antwortet auf einfache Fragen flüssig und zusammenhängend. In Rekordzeit erreichte es hunderte Millionen Nutzer. Damit löste es einen weltweiten Wettlauf um die beste KI aus.",
              mehr:
                "Das Wachstum war beispiellos, denn ChatGPT erreichte schon fünf Tage nach dem Start am 30. November 2022 eine Million Nutzer und nach rund zwei Monaten hundert Millionen. Damit war es zu diesem Zeitpunkt der am schnellsten wachsende Onlinedienst für Endverbraucher überhaupt. Technisch steckte anfangs das Modell GPT-3.5 dahinter, während das deutlich stärkere GPT-4 erst im März 2023 folgte. Viele Schulen reagierten zunächst mit Verboten, so sperrte etwa die Schulbehörde von New York den Zugang, nahm das Verbot aber nach wenigen Monaten wieder zurück. Diese Kehrtwende steht für die rasche Einsicht, dass sich das Werkzeug kaum aussperren lässt und man den Umgang damit besser übt. Zugleich zeigte sich früh, dass ChatGPT auch falsche Angaben sehr überzeugend formulieren kann. Der Novembertag 2022 markiert so den Moment, an dem die KI endgültig im Alltag ankam.",
            },
            {
              titel: "Wettbewerb der KI-Modelle",
              kurz: "Modell-Wettlauf",
              kat: "daten",
              mmf: "maschine",
              jahr: "ab 2023",
              text: "Nach ChatGPT begann ein weltweiter Wettlauf um die besten Modelle. Neben den US-Modellen wie GPT, Claude, Gemini und Llama traten Modelle aus China, Europa und sogar der Schweiz an. Wer eigene Modelle baut, macht sich unabhängiger von anderen. So bekam die KI auch eine politische und eine sprachliche Bedeutung.",
              geschichte:
                "Ab 2023 rangen viele Anbieter um die besten Modelle. Aus den USA kommen GPT von OpenAI, Claude von Anthropic, Gemini von Google und das offene Llama von Meta. Anfang 2025 sorgte das chinesische DeepSeek für Aufsehen, weil es mit wenig Aufwand mithielt, und auch Alibabas Qwen zählt dazu. Aus Europa stammt Mistral aus Frankreich, und aus der Schweiz das vollständig offene Modell «Apertus» von ETH Zürich, EPFL und dem Rechenzentrum CSCS.",
              mehr:
                "Wie umkämpft das Feld ist, zeigte sich Anfang 2025, als das chinesische Modell DeepSeek für Aufsehen sorgte, weil es mit deutlich geringerem Aufwand trainiert worden sein soll als die US-Konkurrenz. Die Nachricht liess kurzzeitig sogar die Börsenkurse grosser Chiphersteller einbrechen, weil Anleger an den bisherigen Milliardenkosten zu zweifeln begannen. Der praktische Reiz offener Modelle liegt darin, dass man sie auf eigenen Rechnern betreiben kann, ohne Daten an einen fremden Anbieter zu schicken. Für Behörden, Spitäler oder Schulen bedeutet das einen Gewinn an Datenschutz und Unabhängigkeit. Ein Schweizer Modell wie «Apertus» ist gerade deshalb bedeutsam, weil sich damit Anwendungen bauen lassen, die nicht von einzelnen US-Konzernen abhängen. Verglichen werden die vielen Modelle auf öffentlichen Ranglisten, auf denen Menschen die Antworten bewerten. So ist ein rascher Wettlauf entstanden, in dem sich die Rangfolge fast monatlich verschiebt.",
            },
            {
              titel: "Multimodalität: KI sieht und hört",
              kurz: "Multimodalität",
              kat: "daten",
              mmf: "maschine",
              jahr: "2023–2024",
              text: "Zuletzt lernte die KI, mehrere Sinne zu verbinden. Die Modelle bleiben nicht mehr beim Text, sondern verarbeiten auch Bilder, Sprache und teils Video. Damit beginnt die KI gleichsam zu sehen und zu hören. Aus dem reinen Textautomaten wird ein Gegenüber, das verschiedene Eindrücke zusammenführt.",
              geschichte:
                "Ab 2023 und 2024 wurden führende Systeme multimodal, verstanden also mehrere Arten von Eingaben. Claude 3 aus dem Jahr 2024 konnte Bilder verstehen und beschreiben. GPT-4o aus demselben Jahr nahm Text, Bild und Ton in einem Modell entgegen und antwortete in Echtzeit gesprochen. So wird aus dem Textautomaten ein Gegenüber, das mehrere Sinne verbindet.",
              mehr:
                "Besonders sichtbar wurde die erzeugende Seite ab 2022, als Programme wie DALL-E, Midjourney und das offene Stable Diffusion aus einer blossen Textbeschreibung fertige Bilder malten. Kurz darauf folgte die Videoerzeugung, etwa als OpenAI 2024 sein System Sora vorstellte, das aus wenigen Sätzen kurze, verblüffend echt wirkende Filmszenen erzeugt. Umgekehrt kann eine multimodale KI auch Bestehendes deuten, also ein Foto beschreiben, eine Grafik erklären oder eine handschriftliche Notiz entziffern. Ein eindrückliches Beispiel ist eine App für blinde Menschen, die seit 2023 mit Hilfe eines solchen Modells die Umgebung in Worte fasst. So wird die Kamera des Handys zu einer Art vorlesendem Auge. Grundlage dafür ist, dass die Systeme Bild, Text und Ton in derselben inneren Sprache aus Zahlen darstellen. Dadurch lassen sich die Sinne in einem einzigen Modell verbinden, statt für jede Aufgabe ein eigenes Programm zu brauchen.",
            },
          ]}
        />
      </Abschnitt>

      <FadenDivider className="mt-xl" />

      {/* Bilderstrecke zwischen den Aktivitäten — Anschauungsmodus mit Hotspots */}
      <Abschnitt
        id="bilder"
        className="mt-xl max-w-5xl"
        bild="/art/vorhang-bilder.webp"
        titel="Bilder zur KI-Geschichte"
        prefixe={["vorhang-auf:bild"]}
        vorschau={
          <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
            <GlossarText text="Bilder machen abstrakte Ideen anschaulich. Elf Werke spannen den Bogen von den frühen Rechenhilfen bis zu ChatGPT und den heutigen Bildgeneratoren. In jedem Bild kannst du begehbare Punkte antippen und so ein Detail nach dem anderen entdecken." />
          </p>
        }
      >
        <Ausklapptext className="mt-md max-w-4xl" titel="Mehr dazu: was die Bilderstrecke zeigt">
          <p>
            <GlossarText text="Die Strecke beginnt beim Auslagern des Denkens in Knotenschnüre, den Quipus der Anden. Sie führt weiter über Turings Code-Knacker aus dem Zweiten Weltkrieg. Ein weiteres Bild zeigt ELIZA, den ersten Chatbot aus den 1960er-Jahren. Später kommen Bildgeneratoren wie DALL·E und schliesslich ChatGPT dazu. Jedes Bild trägt nummerierte Punkte mit einer kurzen Erklärung. So wird aus einer abstrakten Idee eine konkrete Geschichte. Bildende Kunst hilft dabei, komplexe Zusammenhänge in einer einfachen Ansicht zu zeigen." />
          </p>
        </Ausklapptext>
        <Aufgabe className="mt-md max-w-4xl">
          Klicke ein Bild an, dann öffnet es sich gross im Anschauungsmodus.
          Tippe dort die leuchtenden, nummerierten Punkte an, denn jeder erzählt
          ein Detail. Mit den Pfeilen oder den Pfeiltasten blätterst du weiter.
          Ziel sind alle elf Bilder samt ihren Punkten.
        </Aufgabe>
        <BilderAnschauung
          className="mt-lg"
          bilder={BILDER_STORY}
          spurKey="vorhang-auf:bild"
        />
      </Abschnitt>

      <FadenDivider className="mt-xl" />

      {/* 2 — Die Merkmale als loses Geflecht (ohne Zitate, ohne Zentrum) */}
      <Abschnitt
        id="merkmale"
        className="mt-xl max-w-5xl"
        bild="/art/vorhang-merkmale.webp"
        titel="Die Merkmale der neuen Akteurin"
        prefixe={["vorhang-auf:weisheit"]}
        vorschau={
          <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
            <GlossarText text="Seit November 2022 nutzen wir grosse Sprachmodelle fast täglich. Aber was genau ist da als neue Akteurin aufgetreten? Zwölf Eigenschaften zusammen machen das Neue aus, nicht eine davon allein." />
          </p>
        }
      >
        <Ausklapptext className="mt-md max-w-4xl" titel="Mehr dazu: warum die Bündelung zählt">
          <p>
            <GlossarText text="Jede einzelne dieser Eigenschaften gab es in Ansätzen schon früher. Neu ist, dass sie nun gebündelt in einem System zusammenkommen. Die KI erkennt Muster in riesigen Datenmengen und arbeitet mit Wahrscheinlichkeiten statt mit festen Regeln. Sie reagiert auf den Zusammenhang und passt ihre Antworten daran an. Sie wirkt allgemein einsetzbar, weil sie nicht für eine einzige Aufgabe gebaut ist. Genau diese Kombination macht sie zu einem Werkzeug, das sich wie ein Gegenüber anfühlt. Im Muster unten kannst du die zwölf Merkmale einzeln öffnen und nachlesen." />
          </p>
        </Ausklapptext>
        <Aufgabe className="mt-md max-w-4xl">
          Tippe die zwölf Punkte im Geflecht an. Jeder wird beschriftet und
          zeigt unten seine Definition. Zwischen besuchten Punkten füllen sich
          Flächen, und je mehr Punkte du besuchst, desto dichter wird das
          Gewebe. Ziel ist, alle zwölf Merkmale zu öffnen. Dann erscheint unter
          dem Muster das Fazit.
        </Aufgabe>
        <KnotenLandschaft
          className="mt-lg"
          ariaLabel="Knotenlandschaft: Die Merkmale"
          hoehe={260}
          svgKlasse="aspect-[720/350] sm:aspect-[720/260]"
          spurKey="vorhang-auf:weisheit"
          kantenInteraktiv={false}
          weben
          glossar
          bereichLabel="Die Merkmale der neuen Akteurin"
          gewichtung={{
            prefix: "vorhang-auf:gestalt",
            frage: "Macht dieses Merkmal die Gestalt der KI …",
            stufen: ["unkenntlich", "verschwommen", "deutlich"],
          }}
          einladung="Zwölf Merkmale sind hier lose verwoben. Tippe die Punkte an. Zwischen besuchten Punkten füllen sich die Flächen, und ist das Muster gewoben, erscheint darunter das Fazit. Gewichte in jeder Karte, wie deutlich das Merkmal die Gestalt der KI macht. Je mehr «deutlich» du wählst, desto stärker werden die Konturen."
          abschluss="Diese zwölf Eigenschaften treffen sich in einem einzigen Gegenüber. Und darin liegt das eigentlich Neue. Nicht eine einzelne Fähigkeit, sondern ihre Bündelung macht die KI zu einer Akteurin. Sie rechnet, lernt aus Daten, erkennt Muster, wettet auf Wahrscheinlichkeiten, überträgt Gelerntes, liest den Kontext, passt sich an, spricht, arbeitet im Wechselspiel, erzeugt und verbindet die Sinne. So wird sie zu etwas, dem wir mehr Einfluss auf unser Handeln zutrauen als je einer Technik zuvor."
          knoten={[
            {
              titel: "algorithmisch",
              text: "Stell dir ein sehr genaues Kochrezept vor. Jeder Schritt ist eindeutig, und wer sich daran hält, kommt zum selben Ergebnis. Genau so arbeitet die KI in ihrem Innersten. Sie führt ein Rechenverfahren aus, Schritt für Schritt, ohne Laune und ohne Bauchgefühl. Wenn eine Antwort spontan wirkt, ist sie trotzdem nur das Ergebnis von Berechnungen.",
              mehr:
                "Das Wort Algorithmus geht auf den Gelehrten al-Chwarizmi zurück, der vor rund 1200 Jahren in Bagdad Rechenwege aufschrieb. Ein Algorithmus ist nichts Geheimnisvolles, sondern eine klare Anleitung, wie aus einer Eingabe eine Ausgabe wird. Auch das Lernen der KI ist so eine Anleitung. Beim Training verstellt sie viele Milliarden winziger Zahlenwerte immer wieder ein kleines bisschen, bis ihre Antworten besser passen. Man kann sich das wie das Drehen an Millionen kleiner Regler vorstellen. Das klingt weniger nach Denken und mehr nach Rechnen, und genau das ist es auch.",
            },
            {
              titel: "datenbasiert",
              text: "Eine KI lernt ähnlich wie ein Kind, das tausende Hunde sieht und irgendwann jeden Hund erkennt. Ihre Fähigkeiten wachsen aus riesigen Mengen an Beispielen, nicht aus fest eingebauten Regeln. Hat sie nie ein Gedicht gelesen, kann sie auch keines schreiben. Deshalb kommt es vor allem darauf an, womit sie gefüttert wurde. Und es kommt darauf an, wessen Sichtweise in diesen Daten steckt und wessen darin fehlt.",
              mehr:
                "«Die Lernalgorithmen sind die Samen, die Daten der Boden», sagt der Forscher Pedro Domingos. Ohne guten Boden wächst auch aus dem besten Samen nichts. Ein Beispiel: Wurde eine KI fast nur mit englischen Texten trainiert, antwortet sie auf Deutsch oft schwächer. Zeigten die Bilddaten kaum Menschen mit dunkler Haut, erkennt sie diese schlechter. So werden Lücken und Einseitigkeiten der Daten zu Lücken und Einseitigkeiten der KI. Darum ist die Frage, woher die Daten stammen, keine Nebensache, sondern der Kern.",
            },
            {
              titel: "mustererkennend",
              text: "Tippst du auf dem Handy «Salz und», schlägt die Tastatur «Pfeffer» vor. Die KI macht im Grossen dasselbe. Sie hat in Unmengen von Texten gesehen, was häufig zusammen vorkommt, und hält es darum für zusammengehörig. Warum Salz und Pfeffer zusammenpassen, weiss sie nicht. Sie erkennt das Muster verlässlich, ohne es zu verstehen.",
              mehr:
                "Die Informatikerin Katharina Zweig bringt es nüchtern auf den Punkt. Das System hat bestimmte Wörter einfach oft in bestimmten Zusammenhängen gelesen und leitet daraus statistische Muster ab. Ein Beispiel: Es weiss, dass nach «Es war einmal» meist ein Märchen folgt, weil das millionenfach so dastand. Ein echtes Verständnis von Märchen hat es deswegen nicht. Zweigs Fazit ist deutlich, dass solche Systeme noch gar nicht wirklich intelligent sind. Sie erkennen sehr gut, aber sie begreifen nichts.",
            },
            {
              titel: "wahrscheinlichkeitsbasiert",
              text: "Eine Wetter-App sagt nicht «es regnet», sondern «80 Prozent Regen». Auch die KI rechnet in Wahrscheinlichkeiten, doch sie sucht nicht einfach das nächstbeste Wort. Jedes Wort wird für sie zu einer langen Zahlenreihe, einem sogenannten Vektor, der Bedeutung und Bezüge zu anderen Wörtern festhält. In diesem Raum liegen «Hund» und «Katze» nahe beieinander, «Hund» und «Schraube» weit auseinander. Aus dem Zusammenspiel vieler solcher Bedeutungsebenen berechnet sie, welche Fortsetzung am besten passt. Ihre Antwort ist darum eine Wette mit sehr guten Quoten, aber eben eine Wette.",
              mehr:
                "Fachleute nennen diese Zahlencodes Vektoren, und sie haben nicht zwei oder drei Dimensionen, sondern sehr viele. Die Informatikerin Katharina Zweig spricht von rund 13'000 Richtungen, in denen ein Wort seinen Platz bekommt. Jede Richtung steht für einen winzigen Bedeutungsanteil, und erst alle zusammen ergeben den Sinn eines Wortes im jeweiligen Satz. Der Philosoph Markus Gabriel nennt diesen Vorgang Vektorisierung und betont, dass die KI dabei nur mit Mustern und Wahrscheinlichkeiten rechnet, ohne wirklich zu verstehen. Wie mutig die KI beim Auswählen dann würfelt, regelt eine Einstellung namens Temperatur. Ein hoher Wert macht die Antworten kreativer und unberechenbarer, ein niedriger vorhersehbarer. Das erklärt auch, warum dieselbe Frage zweimal ganz verschieden beantwortet werden kann.",
            },
            {
              titel: "generalisierend",
              text: "Hat eine KI tausende Katzenfotos gesehen, erkennt sie auch eine Katze auf einem Bild, das ihr völlig neu ist. Sie überträgt Gelerntes auf Neues. Aus vielen einzelnen Beispielen zieht sie eine allgemeine Regel. So kann sie sogar Sätze sinnvoll fortsetzen, die noch nie jemand geschrieben hat. Genau das unterscheidet echtes Lernen vom reinen Auswendiglernen.",
              mehr:
                "Dieses Verallgemeinern ist das Herzstück des maschinellen Lernens. Eine KI, die nur ihre Trainingsbeispiele nachplappert, wäre nutzlos, denn im Alltag begegnet ihr ständig Neues. Lernt sie die Beispiele zu genau auswendig, spricht man von Überanpassung, und bei einer neuen Aufgabe versagt sie dann. Gelingt das Verallgemeinern gut, wirkt die KI klug und beweglich. Übertreibt sie es, entstehen plumpe Klischees. Ein Beispiel: Hat sie fast nur männliche Chefs in den Daten gesehen, hält sie das Chefsein fälschlich für eine Männersache.",
            },
            {
              titel: "kontextsensitiv",
              text: "Das Wort «Bank» kann eine Sitzbank oder eine Geldbank sein. Was gemeint ist, verrät erst der Zusammenhang. Die KI achtet genau darauf. Sie bezieht ein, was vorher gesagt wurde, welche Rolle sie übernehmen soll und welche Unterlagen du ihr mitgibst. Dieselbe Frage kann darum je nach Umfeld eine andere Antwort ergeben.",
              mehr:
                "Fachleute nennen das, was die KI gerade vor sich hat, das Kontextfenster. Dazu gehören deine Anweisung, das bisherige Gespräch und alle Texte, die du mitgeschickt hast. Ein Beispiel: Sagst du am Anfang «Erkläre es wie für ein Kind», bleibt dieser Auftrag im Fenster und färbt alle weiteren Antworten. Die zugrunde liegende Technik, der Transformer, gewichtet dabei laufend, welche Wörter füreinander wichtig sind. Diesen Kniff nennt man Attention, auf Deutsch Aufmerksamkeit. Wer den Kontext geschickt setzt, steuert die Antwort, und deshalb ist gutes Fragen eine kleine Kunst.",
            },
            {
              titel: "adaptiv",
              text: "Schreibst du locker und mit Emojis, antwortet die KI oft ebenso locker. Sie passt sich an, an deinen Ton, deine Beispiele und deine Korrekturen. Sagst du «bitte kürzer», wird die nächste Antwort kürzer. Auch über viele Nutzende hinweg wird sie nach und nach nachjustiert. Was du ihr heute zeigst, kann ihr Verhalten von morgen mitprägen.",
              mehr:
                "Anpassung geschieht auf mehreren Ebenen. Im laufenden Gespräch greift die KI deinen Stil auf und merkt sich, was du willst. Beim sogenannten Feintuning wird sie schon vor der Nutzung mit menschlichen Rückmeldungen erzogen, damit sie hilfreicher und höflicher antwortet. Und in neue Versionen können Erfahrungen aus der Nutzung einfliessen. Diese Anpassungsfähigkeit macht sie angenehm und nützlich. Zugleich stellt sich die Frage, wer hier eigentlich wen erzieht, der Mensch die Maschine oder die Maschine den Menschen.",
            },
            {
              titel: "dialoghaft",
              text: "Du bedienst die KI nicht mit Knöpfen und Menüs, sondern mit Worten. Das Gespräch selbst ist die Oberfläche. Du fragst, präzisierst und widersprichst, ganz wie bei einem Gegenüber im Chat. Verstehst du eine Antwort nicht, hakst du einfach nach. Das fühlt sich weniger nach Computer an und mehr nach Unterhaltung.",
              mehr:
                "Früher musste man einem Computer in einer eigenen Programmiersprache genau sagen, was er tun soll. Sprachmodelle drehen das um, denn die Anweisung ist jetzt einfach normaler Text. «Die heisseste neue Programmiersprache ist Englisch», sagt der KI-Forscher Andrej Karpathy und meint genau das. Ein Beispiel: Statt Programmcode zu schreiben, bittest du einfach «Fasse diesen Text in drei Sätzen zusammen». Das macht die Technik für alle bedienbar, auch ohne Vorwissen. Zugleich verwischt es die Grenze zwischen einem Befehl an eine Maschine und einem Gespräch mit einem Gegenüber.",
            },
            {
              titel: "interaktiv",
              text: "Ein Getränkeautomat gibt dir genau das, was du drückst, und damit ist Schluss. Die KI arbeitet anders, nämlich in Runden. Sie macht einen Vorschlag, du gibst Rückmeldung, und sie macht einen besseren. So formt ihr das Ergebnis gemeinsam, Schritt für Schritt. Aus dem Bedienen wird ein Zusammenarbeiten.",
              mehr:
                "Genau diese Schleife unterscheidet die KI vom klassischen Programm. Dort gibt es eine Eingabe und eine Ausgabe, dann ist alles vorbei. Bei der KI entsteht ein Hin und Her aus Versuchen und Verfeinern. Ein Beispiel: Du lässt dir einen Brief schreiben, findest ihn zu förmlich, bittest um einen wärmeren Ton, und der nächste Versuch trifft es besser. Damit verändert sich auch die Rolle des Menschen. Aus dem, der nur ausführt, wird jemand, der anleitet, prüft und am Ende für das Ergebnis geradesteht.",
            },
            {
              titel: "generativ",
              text: "Eine Suchmaschine findet Vorhandenes, und eine Bibliothek reicht dir ein fertiges Buch. Die KI dagegen schreibt selbst, Wort für Wort. Sie erzeugt Neues, also Text, Bild oder Programmcode, statt es nur abzurufen. Bittest du um ein Bild einer Katze im Raumanzug, malt sie eines, das es so noch nie gab. Dasselbe Können bringt aber auch frei Erfundenes hervor.",
              mehr:
                "Generativ heisst herstellend, denn die KI stellt Neues her, statt Fertiges nachzuschlagen. Sie setzt immer das nächste wahrscheinliche Wort, und so wächst Satz um Satz etwas Neues. Dieselbe Fähigkeit, die Brillantes schafft, erzeugt auch überzeugend klingenden Unsinn. Fragst du nach einer Buchquelle, erfindet sie notfalls einen Titel, der täuschend echt aussieht. Die Informatikerin Katharina Zweig schlägt dafür statt «Halluzination» das Wort «Konfabulation» vor. Gemeint ist flüssiges Reden ohne echtes Wissen dahinter.",
            },
            {
              titel: "multimodal",
              text: "Du kannst der KI ein Foto deines Kühlschranks zeigen und nach einem Rezept fragen. Text, Bild und Ton laufen bei ihr in einem einzigen Modell zusammen. Sie liest, sieht und hört und antwortet wahlweise in Wort, Bild oder Stimme. Auch eine Skizze oder ein gesprochener Satz sind für sie eine Eingabe. So nimmt sie die Welt über mehrere Kanäle zugleich auf.",
              mehr:
                "Frühe Programme konnten nur eines, entweder Text oder Bild oder Ton. Multimodale Modelle verbinden diese Kanäle in einem einzigen Netz. Damit rücken sie näher an uns Menschen heran, denn auch wir denken nicht in getrennten Sinnen. Ein Beispiel: Du fotografierst eine Mathe-Aufgabe, und die KI liest sie, rechnet und erklärt den Lösungsweg. Oder du zeigst ihr ein Diagramm, und sie fasst es in Worten zusammen. So wird die Grenze zwischen Lesen, Sehen und Hören für die Maschine durchlässig.",
            },
            {
              titel: "agentenfähig",
              text: "Frag einen Menschen nach dem Weg, und er beschreibt ihn dir. Bitte ihn, dich hinzubringen, und er handelt. Moderne KI kann beides. Sie bleibt nicht beim Antworten stehen, sondern zerlegt ein Ziel in Schritte und nutzt selbständig Werkzeuge wie Websuche, Programme und Code. Aus dem Antwortgeber wird so ein Akteur, der Dinge wirklich erledigt.",
              mehr:
                "Fachleute nennen so ein System einen Agenten. Ein Agent ist mehr als ein Antwortgeber, denn er hat ein Gedächtnis, kann ein Ziel in Teilschritte zerlegen und auf Werkzeuge zugreifen. Ein Beispiel: Statt nur zu erklären, wie man eine Tabelle auswertet, öffnet er die Datei, rechnet und schickt dir das fertige Ergebnis. Damit handelt die KI eigenständig in der Welt und nicht mehr nur im Chatfenster. Das ist mächtig und hilfreich, wenn es gelingt. Und es ist heikel, weil hier die alte Grenze zwischen Werkzeug und Gegenüber endgültig verschwimmt.",
            },
          ]}
          anordnungen={[
            {
              id: "geflecht",
              label: "Geflecht",
              pos: [
                [96, 44],
                [286, 26],
                [470, 34],
                [636, 54],
                [664, 158],
                [548, 232],
                [356, 244],
                [166, 232],
                [56, 148],
                [252, 122],
                [420, 120],
                [336, 182],
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
                { von: 8, zu: 0 },
                { von: 9, zu: 10 },
                { von: 10, zu: 11 },
                { von: 7, zu: 9 },
                { von: 5, zu: 11 },
                { von: 2, zu: 10, fein: true },
                { von: 1, zu: 9, fein: true },
                { von: 0, zu: 9, fein: true },
              ],
            },
          ]}
          flaechen={[
            { punkte: [[96, 44], [286, 26], [252, 122]], knoten: [0, 1, 9] },
            { punkte: [[286, 26], [470, 34], [420, 120]], knoten: [1, 2, 10] },
            { punkte: [[470, 34], [636, 54], [420, 120]], knoten: [2, 3, 10] },
            { punkte: [[636, 54], [664, 158], [336, 182]], knoten: [3, 4, 11] },
            { punkte: [[664, 158], [548, 232], [336, 182]], knoten: [4, 5, 11] },
            { punkte: [[548, 232], [356, 244], [336, 182]], knoten: [5, 6, 11] },
            { punkte: [[356, 244], [166, 232], [252, 122]], knoten: [6, 7, 9] },
            { punkte: [[166, 232], [56, 148], [252, 122]], knoten: [7, 8, 9] },
            { punkte: [[56, 148], [96, 44], [252, 122]], knoten: [8, 0, 9] },
            { punkte: [[252, 122], [420, 120], [336, 182]], knoten: [9, 10, 11] },
          ]}
        />
      </Abschnitt>

      <FadenDivider className="mt-xl" />

      {/* 3 — Die KI im Kontext: vier Kontexte mit aufklappbaren Aspekten */}
      <Abschnitt
        id="ki-kontext"
        className="mt-xl max-w-5xl"
        bild="/art/vorhang-kontext.webp"
        titel="Die KI im Kontext"
        prefixe={["vorhang-auf:kontext"]}
        vorschau={
          <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
            <GlossarText text="KI ist mehr als ein Chatfenster. Um das Phänomen zu verstehen, stellt man es in seine Zusammenhänge. Vier Blickwinkel zeigen, worin die neue Akteurin eingebettet ist." />
          </p>
        }
      >
        <Ausklapptext className="mt-md max-w-4xl" titel="Mehr dazu: die vier Blickwinkel">
          <p>
            <GlossarText text="Der erste Blickwinkel ist der technologische, also Rechenkraft, Daten und die Modelle selbst. Der zweite ist der wirtschaftliche, denn Entwicklung und Betrieb kosten viel Geld und schaffen neue Märkte. Der dritte ist der rechtlich-politische, etwa Fragen nach Regeln, Haftung und Macht. Der vierte ist der kulturelle, also wie wir mit KI leben, arbeiten und über sie sprechen. Diese vier Blickwinkel wirken zusammen und lassen sich nicht sauber trennen. Erst gemeinsam ergeben sie ein Bild davon, was KI heute ist." />
          </p>
        </Ausklapptext>
        <Aufgabe className="mt-md max-w-4xl">
          Klappe die Aspekte auf, die dich interessieren, denn jeder erklärt
          einen Faden des Geflechts. Gewichte dabei, wie viel Achtsamkeit ein
          Aspekt verdient. Das Achtsamkeits-Muster oben wird dadurch farbiger
          und rötlicher.
        </Aufgabe>
        <KontextAkkordeon
          className="mt-lg"
          spurKey="vorhang-auf:kontext"
          gewichtung={{
            prefix: "vorhang-auf:achtsamkeit",
            frage: "Wie viel Achtsamkeit verdient dieser Aspekt?",
            stufen: ["wenig", "mittel", "viel"],
          }}
          kapitel={[
            {
              icon: "memory",
              titel: "Technologischer Kontext",
              intro:
                "KI ist eine Weiterentwicklung der Automatisierung. Wer sie verstehen will, schaut auf ihre materielle Basis, also auf Rechenleistung, Energie und Infrastruktur.",
              punkte: [
                {
                  titel: "Rechen- und Speicherkapazität",
                  text: "Leistungsfähige KI braucht sehr viele spezielle Computerchips, Server und Speicher. Diese Anlagen sind teuer und stehen nur wenigen grossen Unternehmen und Staaten zur Verfügung. Wer diese Rechenkraft besitzt, hat einen grossen Vorsprung. So entsteht eine Abhängigkeit von einigen wenigen Anbietern.",
                  beispiel:
                    "Die meisten KI-Chips kommen von einer einzigen Firma, dem US-Konzern Nvidia. Weil alle diese Chips wollen, stieg Nvidia 2024 zeitweise zum wertvollsten Unternehmen der Welt auf. Wer keine solchen Chips bekommt, kann bei den grossen Modellen kaum mithalten.",
                },
                {
                  titel: "Energie und Ressourcen",
                  text: "Eine KI zu trainieren und zu betreiben verbraucht viel Strom und Kühlwasser. Dazu kommen seltene Rohstoffe für die Chips. Zwar werden die Geräte immer sparsamer, doch die Nutzung wächst noch schneller. Deshalb steigt der Gesamtverbrauch weiter an.",
                  beispiel:
                    "Google meldete in seinem Umweltbericht 2024, dass seine Treibhausgas-Emissionen seit 2019 um rund 48 Prozent gestiegen sind. Als Hauptgrund nennt der Konzern den wachsenden Stromhunger seiner Rechenzentren für KI. Ein Wert, der eigentlich sinken sollte, zeigt also nach oben.",
                },
                {
                  titel: "Rechenzentren",
                  text: "Für KI entstehen überall neue Rechenzentren, also grosse Hallen voller Computer. Sie schaffen digitale Kapazität für ein ganzes Land. Vor Ort brauchen sie aber viel Energie, Wasser, Fläche und einen starken Stromanschluss. Damit konkurrieren sie mit anderen Bedürfnissen einer Region.",
                  beispiel:
                    "In Irland verbrauchten die Rechenzentren 2023 bereits 21 Prozent des gesamten Stroms im Land, mehr als alle städtischen Haushalte zusammen. Das meldet das irische Statistikamt. Manche Regionen bremsen deshalb den Bau neuer Zentren.",
                },
              ],
            },
            {
              icon: "payments",
              titel: "Wirtschaftlicher Kontext",
              intro:
                "In einer kapitalistischen Gesellschaft dient KI der Rationalisierung, also dem Kostensenken und Geldverdienen. Das prägt, wer sie baut, wem sie nützt und wie sich Arbeit verändert.",
              punkte: [
                {
                  titel: "Technologisch-kapitalistische Organisation",
                  text: "Die stärkste KI wird fast nur von grossen privaten Technologiekonzernen entwickelt. Bei ihnen sammeln sich Geld, Daten, Rechenzentren und Patente. Dadurch liegt viel Macht bei wenigen Firmen. Deren Geschäftsinteressen bestimmen mit, in welche Richtung sich die Technik entwickelt.",
                  beispiel:
                    "Der Software-Riese Microsoft hat rund 13 Milliarden Dollar in die Firma OpenAI gesteckt, die hinter ChatGPT steht. Damit hängt eine der wichtigsten KI-Firmen eng an einem einzelnen Grosskonzern. So bündelt sich viel Macht bei wenigen Unternehmen.",
                },
                {
                  titel: "Zugang",
                  text: "Nicht alle können KI gleichermassen nutzen. Kosten, technische Ausstattung, Sprache und digitale Erfahrung entscheiden mit. Wer gut ausgestattet ist, profitiert stärker. So kann KI bestehende Ungleichheiten sogar vergrössern.",
                  beispiel:
                    "Bei ChatGPT gibt es das stärkere Modell vor allem im Bezahl-Abo für rund 20 Dollar im Monat, während die Gratis-Version schwächer ist. Wer zahlen kann, arbeitet also mit der besseren KI. Schon beim Zugang entsteht so ein Unterschied zwischen Menschen.",
                },
                {
                  titel: "Arbeitsmarkt",
                  text: "KI verändert die Arbeitswelt spürbar. Sie übernimmt vor allem einzelne Aufgaben, selten gleich einen ganzen Beruf. Manche Tätigkeiten fallen weg, andere verändern sich, und neue kommen dazu. Für viele Berufe bedeutet das neue Anforderungen und neues Lernen.",
                  beispiel:
                    "Die Bezahlfirma Klarna meldete 2024, ihr KI-Assistent erledige die Arbeit von rund 700 Kundendienst-Mitarbeitenden. Kurz darauf stellte sie aber wieder Menschen ein, weil die Qualität nicht überall reichte. Das zeigt, wie schnell und zugleich unsicher dieser Wandel verläuft.",
                },
                {
                  titel: "Rollenverschiebung",
                  text: "Die Rolle des Menschen verschiebt sich. Statt eine Arbeit selbst auszuführen, leitet man die KI an und prüft ihr Ergebnis. Am Ende trägt der Mensch die Verantwortung für das, was er übernimmt. Aus dem Ausführenden wird also eher ein Anleiter und Kontrolleur.",
                  beispiel:
                    "Wer heute programmiert, lässt sich von einem Werkzeug wie GitHub Copilot ganze Code-Abschnitte vorschlagen. Die eigentliche Arbeit ist dann, diese Vorschläge zu lesen, zu prüfen und zu verbessern. Aus dem Selberschreiben wird ein Anleiten und Kontrollieren.",
                },
              ],
            },
            {
              icon: "balance",
              titel: "Rechtlicher und politischer Kontext",
              intro:
                "Chancen und Risiken müssen mit rechtlichen Leitplanken gelenkt werden. Zugleich ringen Staaten politisch um Einfluss und Unabhängigkeit.",
              punkte: [
                {
                  titel: "Regulierung",
                  text: "Der Staat versucht, KI mit Gesetzen zu lenken. Solche Regeln sollen Grundrechte, Sicherheit, Datenschutz und Urheberrecht schützen. Zugleich sollen sie Forschung und Innovation nicht unnötig behindern. Diese Balance ist schwierig, und die Regeln entstehen erst nach und nach.",
                  beispiel:
                    "Die Europäische Union hat 2024 den AI Act beschlossen, das weltweit erste umfassende KI-Gesetz. Es teilt KI-Anwendungen nach ihrem Risiko in Stufen ein, von frei erlaubt bis ganz verboten. Gefährliche Einsätze sollen so gestoppt und riskante streng geprüft werden.",
                },
                {
                  titel: "Geopolitik",
                  text: "Um KI ist ein weltweiter Wettbewerb entbrannt. Staaten und Unternehmen ringen um Chips, Daten, Fachkräfte und Energie. Auch technische Standards und Unabhängigkeit stehen auf dem Spiel. Wer hier vorne liegt, gewinnt wirtschaftliche und politische Macht.",
                  beispiel:
                    "Seit 2022 verbieten die USA den Export ihrer stärksten KI-Chips nach China. Der Hersteller Nvidia baute daraufhin absichtlich langsamere Chips, nur um weiter liefern zu dürfen. An diesem Streit sieht man, dass KI längst ein Machtthema zwischen Staaten ist.",
                },
              ],
            },
            {
              icon: "diversity_3",
              titel: "Kultureller Kontext",
              intro:
                "Je nach Weltbild fällt der Blick auf KI anders aus, denn etwa westliche und asiatische Kulturen deuten das Phänomen unterschiedlich. Auch der Umgang mit Wissen und Überlieferung steht auf dem Spiel.",
              punkte: [
                {
                  titel: "Kultureller Bias und Technikverständnis",
                  text: "KI lernt aus Texten, die oft aus dem englischsprachigen und westlichen Raum stammen. Darum gibt sie häufig westliche Sprachen, Werte und Sichtweisen wieder. Andere Kulturen verstehen Technik, Gemeinschaft und Privatsphäre aber teils ganz anders. «West» und «Ost» sind dabei keine festen Blöcke, sondern grobe Vereinfachungen.",
                  beispiel:
                    "Eine UNESCO-Studie von 2024 prüfte bekannte Sprachmodelle und fand klare Klischees. Frauen wurden viel häufiger mit «Familie» und «Haushalt» verbunden, Männer mit «Karriere» und «Gehalt». Die KI gibt also die Vorurteile ihrer Trainingstexte wieder.",
                },
                {
                  titel: "Text- und Archivkompetenz",
                  text: "KI hilft, grosse Textmengen zu durchsuchen und zusammenzufassen. Sie ersetzt aber nicht das kritische Prüfen von Quellen. Wichtig bleiben die Herkunft, der Zusammenhang und der Blick ins Original. Ohne dieses Prüfen sitzt man leicht Fehlern und Erfindungen auf.",
                  beispiel:
                    "2023 reichte ein New Yorker Anwalt einen Schriftsatz ein, für den er ChatGPT genutzt hatte. Die KI hatte sechs Gerichtsurteile frei erfunden, die es nie gab, und der Anwalt bekam eine Geldstrafe. Ohne Prüfen an der Quelle wird aus flüssigem Text schnell ein teurer Fehler.",
                },
                {
                  titel: "Wissensmacht",
                  text: "Sichtbar wird vor allem, was digital vorliegt und in den Trainingsdaten steckt. Was fehlt oder nie digitalisiert wurde, gerät leichter in Vergessenheit. So entscheidet die Auswahl der Daten mit, welches Wissen zählt. Das ist eine Form von Macht über das Wissen.",
                  beispiel:
                    "Die Trainingsdaten der grossen Modelle bestehen zu einem sehr grossen Teil aus englischen Texten. Wissen aus kleineren Sprachen, etwa vielen afrikanischen, ist kaum vertreten, und dort antwortet die KI schwächer oder erfindet mehr. So entscheidet die Datenmenge mit, wessen Wissen sichtbar bleibt.",
                },
              ],
            },
          ]}
        />
      </Abschnitt>
      </AkkordeonGruppe>

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

      <NeustartButton
        className="mt-xl max-w-3xl"
        teile={["vorhang-auf"]}
        seitenName="Vorhang auf"
      />
    </AppLayout>
  );
}
