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
import SeitenNavigation from "../_components/SeitenNavigation";

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
    titel: "Quipu — Knoten der Anden",
    jahr: "Anden, ~1400",
    kurz: "Historische Aufnahme · Rechnen und Erinnern in Knoten",
    quelle:
      "Foto «The Ancient Quipu Plate XXII» · Wikimedia Commons · gemeinfrei (Public Domain)",
    geschichte:
      "Quipus waren das Buchhaltungs- und Erinnerungssystem der Inka und älterer Andenkulturen. Statt Zahlen zu schreiben, knüpfte man sie: An einer Hauptschnur hängen Nebenschnüre, deren Knotenart, -zahl und -höhe Werte im Zehnersystem festhalten; Farbe, Drehrichtung und Anordnung trugen zusätzliche Bedeutung. Eigene Spezialisten — die «Quipucamayocs» — legten sie an und lasen sie vor. Rechnen und Erinnern wurden hier nicht ins Rad, sondern in den Faden ausgelagert: eine Datenbank aus Textil, Jahrhunderte vor dem Computer. Diese Aufnahme zeigt ein erhaltenes Quipu.",
    hotspots: [
      {
        x: 50,
        y: 16,
        titel: "Die Hauptschnur",
        text: "An der waagrechten Trägerschnur oben hängen alle Nebenschnüre. Das Quipu ist ein Speicher aus Fäden — Buchhaltung und Chronik der Inka.",
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
        text: "Dutzende herabhängende Schnüre, teils weiter verzweigt — eine ganze Datenbank aus Textil. Auch Farbe und Drehrichtung der Fäden trugen Bedeutung, lange vor dem Computer.",
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
      "Der «Schachtürke» war ein Schach spielender Automat, den Wolfgang von Kempelen 1770 am Wiener Hof vorführte: eine lebensgrosse, als Türke kostümierte Figur an einer Truhe voller Zahnräder. Er schlug jahrzehntelang prominente Gegner — der Legende nach auch Napoleon und Benjamin Franklin — und liess ganz Europa rätseln, ob eine Maschine denken könne. In Wahrheit sass im Innern ein versteckter Schachmeister, der die Figur über Hebel und Magnete steuerte; beim Öffnen zeigte man geschickt immer nur einen Teil des Kastens. Nach Kempelens Tod tourte Johann Nepomuk Mälzel den Automaten um die Welt, bis er 1854 bei einem Brand zerstört wurde. Dieses Bild ist ein Kupferstich von Joseph Friedrich zu Racknitz (1789), der den vermuteten Mechanismus samt verborgenem Bediener zu erklären versuchte. Der Schachtürke ist bis heute das Sinnbild dafür, wie bereitwillig wir Maschinen Intelligenz zuschreiben — und wie oft «automatische» Leistung in Wahrheit versteckte menschliche Arbeit ist. Nicht zufällig heisst Amazons Klickarbeiter-Plattform «Mechanical Turk».",
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
    kurz: "das erschaffene Wesen",
    quelle:
      "Frontispiz der Frankenstein-Ausgabe, Theodor von Holst, 1831 · Wikimedia Commons · gemeinfrei",
    geschichte:
      "Mary Shelley schrieb «Frankenstein oder der moderne Prometheus» mit achtzehn Jahren; der Roman erschien 1818. Victor Frankenstein erschafft aus toter Materie ein lebendes Wesen — und flieht im Augenblick des Gelingens entsetzt vor seinem Werk. Die Kreatur ist nicht böse geboren; erst Zurückweisung und Einsamkeit machen sie zum Rächer. Der eigentliche Fehler ist also nicht die Schöpfung, sondern die verweigerte Verantwortung. Dieses Bild ist das Frontispiz der Ausgabe von 1831 (Stich nach Theodor von Holst) und zeigt den Moment der Flucht. Bis heute steht «Frankenstein» für die Angst vor Technik, die sich der Kontrolle entzieht — und für die Frage, wer für das Gemachte einsteht.",
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
    kurz: "die programmierbare Rechenmaschine",
    quelle:
      "Holzstich der Differenzmaschine von Charles Babbage, 1853 · Wikimedia Commons · gemeinfrei",
    geschichte:
      "Der Traum vom mechanischen Rechnen reicht von Leibniz' Rechenrad (um 1673) bis zu Charles Babbage. Ab 1837 entwarf Babbage die «Analytical Engine» — eine universelle, programmierbare Maschine, die zu seinen Lebzeiten nie fertig gebaut wurde. Ada Lovelace erkannte 1843, dass eine solche Maschine nicht nur Zahlen, sondern beliebige Symbole verarbeiten könnte, und schrieb das, was oft als erstes Computerprogramm gilt — hielt aber zugleich fest, die Maschine bringe nichts «von sich aus» hervor. Der Holzstich (1853) zeigt einen Teil von Babbages Differenzmaschine: den mechanischen Urahn des Prozessors, angetrieben von Hand.",
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
    src: "/art/bombe.jpg",
    alt: "Historisches Foto der «Bombe»: eine Bedienerin an einer grossen Maschine mit Reihen drehbarer Trommeln, die Enigma-Funksprüche entschlüsselt.",
    titel: "Turings Code-Knacker",
    jahr: "1939–1945",
    kurz: "Alan Turing · die «Bombe» entschlüsselt Enigma",
    quelle:
      "Foto der «Bombe», US National Security Agency · Wikimedia Commons · gemeinfrei (US-Regierung)",
    geschichte:
      "Im Zweiten Weltkrieg verschlüsselte die deutsche Wehrmacht ihren Funk mit der Enigma. In Bletchley Park (England) entwarf Alan Turing die «Bombe» — eine elektromechanische Maschine, die Tausende möglicher Walzenstellungen systematisch durchprobierte und die unmöglichen ausschied. Das Knacken der Enigma verkürzte den Krieg erheblich. Turing hatte 1936 die theoretische Grundlage jedes Computers gelegt und fragte 1950, ob Maschinen denken können. Das Foto zeigt eine US-Version der Bombe mit einer Bedienerin: Die Maschinen liefen rund um die Uhr, bedient meist von Frauen. Aus Turings Idee der universellen Rechenmaschine wurde hier ein reales, kriegsentscheidendes Werkzeug — eine Geburtsstunde des Computers.",
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
        text: "An den oberen Rädchen wird die Maschine eingestellt. Die «Bombe» testet mechanisch Tausende Walzenstellungen und scheidet die unmöglichen aus — Rechnen wird zur Suche.",
      },
      {
        x: 27,
        y: 52,
        titel: "Menschen an der Maschine",
        text: "Bedienerinnen richteten die Bombe ein und lasen sie ab, rund um die Uhr. Aus Turings Idee der universellen Rechenmaschine wird ein reales, kriegsentscheidendes Werkzeug — eine Geburtsstunde des Computers.",
      },
    ],
  },
  {
    src: "/art/eliza.svg",
    alt: "Illustration des Chatbots ELIZA (1966): ein Fernschreiber-Ausdruck mit einem Wechselgespräch zwischen Mensch und Programm.",
    titel: "ELIZA — der erste Chatbot",
    jahr: "1966",
    kurz: "Weizenbaums sprechendes Programm",
    quelle: "Schematische Illustration, mit KI erstellt für dieses Lehrmittel · kein Foto",
    geschichte:
      "ELIZA schrieb Joseph Weizenbaum 1966 am MIT — eines der ersten «sprechenden» Programme. Sein bekanntestes Skript, «DOCTOR», imitierte eine Psychotherapeutin und spiegelte die Eingaben als Fragen zurück («In welcher Weise?»). ELIZA verstand nichts — sie folgte einfachen Mustern —, wirkte aber verblüffend menschlich. Weizenbaum erschrak, wie sehr sich Menschen dem Programm anvertrauten, und wurde später zu einem frühen Kritiker der KI. Der «ELIZA-Effekt» beschreibt bis heute unsere Neigung, hinter flüssiger Sprache echtes Verstehen zu vermuten. (KI-erstellte Illustration eines Fernschreiber-Dialogs.)",
    ki: true,
    hotspots: [
      {
        x: 38,
        y: 37,
        titel: "Die Therapeutin (DOCTOR)",
        text: "Das bekannteste Skript imitierte eine Psychotherapeutin: Es gab Aussagen als Fragen zurück — «In welcher Weise?», «Erzähl mir mehr».",
      },
      {
        x: 62,
        y: 62,
        titel: "Ein Skript, kein Verstehen",
        text: "ELIZA folgte einfachen Mustern und spiegelte Sätze zurück. Sie verstand nichts — und wirkte doch verblüffend menschlich.",
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
      "Ab den 1990er-Jahren verschob sich die KI vom Regeln-Schreiben zum Lernen aus Beispielen. Ein Modell fasst jedes Beispiel als Punkt in einem Raum mit vielen Merkmalen auf — oft Hunderte oder Tausende Dimensionen; Ähnliches liegt nah beieinander. «Lernen» heisst dann, eine Grenze zu finden, die Gruppen trennt: Danach kann das Modell Neues einordnen. Es «versteht» dabei keine Bedeutung, sondern rechnet mit Lage und Abstand. Diese Denkweise ist die Grundlage fast aller heutigen KI. (KI-erstellte, schematische Illustration.)",
    ki: true,
    hotspots: [
      {
        x: 19,
        y: 78,
        titel: "Achsen sind Merkmale",
        text: "Jede Achse steht für ein Merkmal der Daten — oft sind es Hunderte oder Tausende, hier nur drei angedeutet.",
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
        text: "Das Modell sucht eine Fläche, die die Gruppen trennt. «Lernen» heisst: diese Grenze aus Beispielen immer besser ziehen — dann kann es Neues einordnen.",
      },
    ],
  },
  {
    src: "/art/tamagotchi-foto.jpg",
    alt: "Foto eines gelben Tamagotchi (1996): ein eiförmiges Taschengerät mit kleinem Bildschirm, drei Knöpfen und einer Kugelkette.",
    titel: "Tamagotchi — das virtuelle Haustier",
    jahr: "1996",
    kurz: "Bindung an ein digitales Wesen",
    quelle: "Foto: Museum Rotterdam · Wikimedia Commons · CC BY-SA 3.0",
    geschichte:
      "Das Tamagotchi kam 1996 in Japan (Bandai) auf den Markt: ein eiförmiges Taschengerät mit einem digitalen Wesen, das gefüttert, gepflegt und beschäftigt werden wollte — sonst «starb» es. Millionen banden sich emotional an ein paar Bildpunkte; an Schulen wurden die piepsenden Geräte zeitweise verboten. Tamagotchis zeigen, wie leicht wir Maschinen wie Lebewesen behandeln — ein früher Vorläufer der virtuellen Haustiere und der heutigen KI-Begleiter. Dieses Foto zeigt ein erhaltenes Gerät aus einer Museumssammlung.",
    hotspots: [
      {
        x: 53,
        y: 42,
        titel: "Gefühle für Pixel",
        text: "Auf dem kleinen Schirm lebte ein paar Bildpunkte grosses Wesen. Millionen banden sich emotional daran — wir behandeln Maschinen erstaunlich leicht wie Lebewesen.",
      },
      {
        x: 70,
        y: 67,
        titel: "Ein Wesen zum Umsorgen",
        text: "Mit drei Knöpfen wurde gefüttert, gespielt, sauber gemacht — Pflege rund um die Uhr, sonst «starb» das Wesen.",
      },
      {
        x: 22,
        y: 50,
        titel: "Wegbereiter",
        text: "An der Kette hing es immer am Körper. Tamagotchis ebneten den Weg für virtuelle Haustiere und Gefährten — heute für sprechende KI-Begleiter.",
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
      "2013–2015 zeigte «Deep Q-Network» (DeepMind), dass eine KI klassische Arcade-Spiele allein durch Ausprobieren lernen kann — sie sah nur die Bildpunkte des Schirms und den Punktestand, keine Regeln. Über viele Partien hinweg richtete sie ihr Verhalten auf die Belohnung (Punkte) aus und übertraf bei manchen Spielen den Menschen. Dieses «verstärkende Lernen» wurde später zur Grundlage von Systemen wie AlphaGo, das 2016 den weltbesten Go-Spieler schlug. (KI-erstellte, schematische Illustration; kein Originalspiel.)",
    ki: true,
    hotspots: [
      {
        x: 32,
        y: 24,
        titel: "Die Umgebung",
        text: "Das Spiel ist die Umgebung — die KI sieht nur die Bildpunkte des Schirms und den Punktestand, keine Regeln.",
      },
      {
        x: 89,
        y: 50,
        titel: "Belohnung steigt",
        text: "Punkte sind Belohnung. Über viele Spiele hinweg versucht die KI, sie zu maximieren — die Kurve klettert.",
      },
      {
        x: 37,
        y: 80,
        titel: "Versuch und Irrtum",
        text: "Ohne Anleitung lernt sie erstaunliche Strategien — 2013–2015 zeigte «Deep Q-Network», dass Maschinen im Spiel stärker werden als Menschen.",
      },
    ],
  },
  {
    src: "/art/dalle2.jpg",
    alt: "Von DALL·E 2 erzeugtes Bild: ein metallener Roboterarm hält einen Stift und zeichnet die Skizze einer Hand auf Papier.",
    titel: "DALL·E — Bilder aus Worten",
    jahr: "April 2022",
    kurz: "Text wird zum Bild — und das vor ChatGPT",
    quelle:
      "Von DALL·E 2 erzeugtes Bild (2022) · Wikimedia Commons · KI-generiert, urheberrechtlich nicht geschützt",
    geschichte:
      "DALL·E (OpenAI) erzeugt Bilder aus Textbeschreibungen. DALL·E 1 kam im Januar 2021, das deutlich stärkere DALL·E 2 im April 2022 — rund ein halbes Jahr vor ChatGPT. Man gibt einen Satz ein, und das Modell «malt» ein Bild, das so nie fotografiert wurde; es setzt es Punkt für Punkt neu aus Gelerntem zusammen. Damit wurde generative KI erstmals einem breiten Publikum sichtbar. Dieses Bild ist selbst ein DALL·E-2-Ergebnis (eine zeichnende Roboterhand) und als KI-erzeugtes Werk urheberrechtlich nicht geschützt.",
    ki: true,
    hotspots: [
      {
        x: 55,
        y: 20,
        titel: "Sprache als Pinsel",
        text: "Ein Satz genügt als Auftrag — und die Maschine «zeichnet». Mit DALL·E 2 (April 2022) entstand zu jeder Beschreibung ein neues Bild.",
      },
      {
        x: 24,
        y: 58,
        titel: "Erfunden, nicht gefunden",
        text: "Das Bild existiert nirgends; das Modell setzt es Punkt für Punkt neu zusammen — dieses hier hat DALL·E 2 erzeugt, das übrigens urheberrechtlich nicht geschützt ist.",
      },
      {
        x: 45,
        y: 82,
        titel: "Früher als ChatGPT",
        text: "Das vergisst man leicht: Die Bild-KI war zuerst da — DALL·E 2 im April 2022, ein halbes Jahr bevor ChatGPT im November 2022 alle erreichte.",
      },
    ],
  },
  {
    src: "/art/chatgpt.svg",
    alt: "Illustration von ChatGPT (2022): ein Chatfenster mit einer Frage in Alltagssprache und einer flüssig getippten KI-Antwort.",
    titel: "ChatGPT — KI für alle",
    jahr: "November 2022",
    kurz: "der Chatbot, der KI in den Alltag brachte",
    quelle: "Schematische Illustration, mit KI erstellt für dieses Lehrmittel · kein Foto",
    geschichte:
      "ChatGPT (OpenAI) erschien im November 2022 und machte KI für alle bedienbar: ein Chatfenster, normale Sprache, sofort nutzbar. Innert weniger Wochen nutzten es Millionen — der Moment, in dem KI im Alltag ankam. Das Modell setzt Wort für Wort den wahrscheinlich nächsten Textbaustein; das gelingt verblüffend gut, kann aber auch überzeugend falsch sein. Zusätzlich wurde es mit menschlichem Feedback trainiert, um hilfreicher und harmloser zu antworten. (KI-erstellte Illustration eines Chatfensters.)",
    ki: true,
    hotspots: [
      {
        x: 61,
        y: 29,
        titel: "Einfach reden",
        text: "Man tippt eine Frage in ganz normaler Sprache — die KI antwortet flüssig. Keine Fachkenntnis, kein Befehl nötig.",
      },
      {
        x: 40,
        y: 60,
        titel: "Wort für Wort",
        text: "Das Modell setzt immer den wahrscheinlich nächsten Textbaustein — verblüffend gut, aber ohne echtes Wissen. Es kann auch überzeugend irren.",
      },
      {
        x: 50,
        y: 88,
        titel: "Der Durchbruch",
        text: "Innert Wochen nutzten Millionen ChatGPT — der Moment, in dem KI im Alltag vieler Menschen ankam.",
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
          Vom antiken Traum, Dingen Leben einzuhauchen, über die Geschichte des
          Algorithmus bis zu den heutigen Sprachmodellen: zweiundzwanzig
          Stationen, deren Vorstellungen einander quer durch die Zeit
          beeinflussen. <strong>Deine Aufgabe:</strong> Das ganze Gewebe ist
          sichtbar — über die Stichworte oben hebst du einzelne Punkte fett
          hervor, und ihre Verbindungen färben sich ein. Tippe einen Punkt an,
          um seine Geschichte zu lesen; unter jeder Karte kannst du «Mehr lesen»
          aufklappen und mit «Das verfolge ich weiter» ein Merkzeichen setzen.
          Im Gewebe lassen sich die Punkte verschieben, «Zeitlich» reiht die
          hervorgehobenen als Perlenschnur von früher nach heute.
        </p>
        <InfoPunkt className="mt-md" label="Muss ich allen 22 nachgehen?">
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
              titel: "Der Algorithmus wird ausführbar",
              kurz: "Algorithmus",
              kat: "regeln",
              mmf: "maschine",
              jahr: "1936–1950er",
              text: "Ein Algorithmus ist eine Schritt-für-Schritt-Anleitung zum Rechnen. Mit den ersten Computern wird er ausführbar — die Maschine arbeitet das Verfahren selbsttätig ab.",
              geschichte:
                "Das Wort geht auf den Gelehrten al-Chwarizmi (~820) zurück, Verfahren wie Euklids Algorithmus sind noch älter. Doch erst Alan Turings gedankliche «Maschine» (1936) und die ersten elektronischen Rechner der 1940er-Jahre machten Algorithmen zu etwas, das eine Maschine Schritt für Schritt selbst ausführt — nicht mehr ein Mensch mit Papier und Bleistift.",
              mehr:
                "Turing zeigte 1936, dass eine einzige, universelle Maschine jedes berechenbare Verfahren ausführen kann — die theoretische Grundlage jedes Computers. 1950 fragte er in «Computing Machinery and Intelligence», ob Maschinen denken können, und schlug das «Imitationsspiel» (den Turing-Test) vor. Damit wird der Algorithmus vom Rechenrezept zum Motor der KI: Alles, was Computer und später KI tun, ist im Kern das Abarbeiten von Algorithmen.",
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
              titel: "Algorithmen filtern das Internet",
              kurz: "Internet-Filter",
              kat: "daten",
              mmf: "maschine",
              jahr: "1994–1998",
              text: "Als das Web wächst, sortieren Algorithmen die Flut. Empfehlungs- und Rangfolge-Verfahren entscheiden, was wir zuerst sehen.",
              geschichte:
                "1994 schlug das Projekt GroupLens vor, Beiträge automatisch nach dem Geschmack ähnlicher Nutzer zu empfehlen — die Geburt des «kollaborativen Filterns». 1998 ordnete Googles PageRank Webseiten danach, wie viele andere Seiten auf sie verweisen. Zum ersten Mal entschied nicht ein Mensch, sondern ein Algorithmus im grossen Massstab über Reihenfolge und Sichtbarkeit.",
              mehr:
                "GroupLens begann mit Empfehlungen für Usenet-Diskussionen; dasselbe Prinzip steckt heute in Produkt- und Film-Empfehlungen. PageRank machte Google gross, weil es Relevanz aus der Verlinkungsstruktur des Webs errechnete. Beide markieren den Wendepunkt: Der Algorithmus wird vom Werkzeug im Hintergrund zum Türsteher der Aufmerksamkeit — er bestimmt mit, was Millionen Menschen finden und was unsichtbar bleibt.",
            },
            {
              titel: "Algorithmen kuratieren Social Media",
              kurz: "Social-Media-Feed",
              kat: "daten",
              mmf: "maschine",
              jahr: "ab 2006",
              text: "Statt einfach chronologisch zeigt der Feed, was ein Algorithmus für relevant hält. Lernende Ranking-Systeme entscheiden pro Person, welche Beiträge oben stehen.",
              geschichte:
                "2006 führte Facebook den «News Feed» ein — Beiträge wurden gebündelt und gewichtet statt bloss der Reihe nach angezeigt. Später bestimmten lernende Ranking-Systeme anhand jeder Reaktion, jedes Klicks und jeder Verweildauer, was einzelne Nutzer zu sehen bekamen. Aus einer Liste wurde eine für jede Person anders zusammengestellte Bühne.",
              mehr:
                "Ranking-Algorithmen optimieren auf Kennzahlen wie Interaktion und Verweildauer — mit Nebenwirkungen: Was Aufmerksamkeit bindet, wird verstärkt, Polarisierendes oft besonders. Damit ist der Algorithmus nicht mehr nur Filter, sondern Mit-Gestalter des öffentlichen Gesprächs. Genau hier wird die «neue Akteurin» gesellschaftlich wirksam: Sie sieht nichts und versteht nichts — und prägt doch, worüber wir streiten.",
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
              titel: "Der Transformer",
              kurz: "Transformer",
              kat: "daten",
              mmf: "maschine",
              jahr: "2017",
              text: "2017 stellen Google-Forscher die «Transformer»-Architektur vor. Sie lernt, welche Wörter im Satz aufeinander achten müssen — die Grundlage aller heutigen Sprachmodelle.",
              geschichte:
                "Der Aufsatz «Attention Is All You Need» (2017) führte den Aufmerksamkeits-Mechanismus ein: Das Modell gewichtet, welche Teile eines Textes für welche anderen wichtig sind — über lange Passagen hinweg und hochgradig parallel berechenbar. Damit liessen sich Modelle erstmals auf riesige Textmengen skalieren.",
              mehr:
                "«GPT» steht für Generative Pretrained Transformer — der Name trägt die Architektur schon in sich. Der Transformer löste ältere Ansätze ab, weil er Zusammenhänge nicht Wort für Wort, sondern im Ganzen erfasst und sich effizient auf viele Chips verteilen lässt. Fast alle grossen Text-, Bild- und Sprachmodelle der Folgejahre bauen darauf auf.",
            },
            {
              titel: "Die GPT-Welle",
              kurz: "GPT-Welle",
              kat: "daten",
              mmf: "maschine",
              jahr: "2018–2020",
              text: "Sprachmodelle werden grösser und grösser. Mit jeder Stufe — GPT-1, GPT-2, GPT-3 — wächst, was sie ohne eigenes Training für eine Aufgabe können.",
              geschichte:
                "Ab 2018 zeigten OpenAIs GPT-Modelle, dass reines «Vorhersagen des nächsten Wortes» auf riesigen Textmengen erstaunlich weit trägt. GPT-3 (2020) mit 175 Milliarden Parametern konnte Texte schreiben, übersetzen und Fragen beantworten, ohne für jede Aufgabe eigens trainiert zu werden.",
              mehr:
                "Der Sprung kam vor allem durch Grösse — mehr Daten, mehr Parameter, mehr Rechenzeit («Scaling»). Damit tauchten Fähigkeiten auf, die niemand einzeln einprogrammiert hatte. Zugleich zeigten sich die Kehrseiten: Die Modelle geben falsche Auskünfte selbstsicher wieder und übernehmen Verzerrungen aus ihren Trainingsdaten.",
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
                "Riesige Text- und Bildmengen, trainiert in Rechenzentren mit Zehntausenden Chips, wurden zur Voraussetzung der neuen Akteurin. Was danach kam — dialogfähige Chatbots, konkurrierende Modellfamilien, sehende und hörende KI — baut alles auf dieser Infrastruktur auf.",
            },
            {
              titel: "ChatGPT — der Massenmoment",
              kurz: "ChatGPT",
              kat: "daten",
              mmf: "mensch",
              jahr: "November 2022",
              text: "ChatGPT macht Sprach-KI dialogfähig und für alle bedienbar. Innert Wochen nutzen Millionen den Chatbot — KI kommt im Alltag an.",
              geschichte:
                "Im November 2022 veröffentlichte OpenAI ChatGPT: ein auf Gespräch getrimmtes Sprachmodell, das auf einfache Fragen flüssig antwortet. Es erreichte in Rekordzeit hunderte Millionen Nutzer und löste einen weltweiten KI-Wettlauf aus.",
              mehr:
                "Neu war weniger das Modell als die Zugänglichkeit: ein Chatfenster, normale Sprache, sofort nutzbar. Trainiert wurde es zusätzlich mit menschlichem Feedback (RLHF), um hilfreicher und harmloser zu antworten. Aus einer Forschungstechnik wurde ein Alltagswerkzeug — und die Debatte über Verlässlichkeit, Schule und Arbeit begann breit.",
            },
            {
              titel: "Wettbewerb der Modellfamilien",
              kurz: "Modellfamilien",
              kat: "daten",
              mmf: "maschine",
              jahr: "ab 2023",
              text: "Nach ChatGPT entstand ein weltweiter Wettbewerb: Neben den US-Modellen GPT, Claude, Gemini und Llama traten chinesische, europäische und sogar schweizerische Modelle an.",
              geschichte:
                "Ab 2023 rangen viele Familien um die besten Modelle: aus den USA GPT (OpenAI), Claude (Anthropic), Gemini (Google) und das offene Llama (Meta). Anfang 2025 sorgte das chinesische DeepSeek für Aufsehen, weil es mit vergleichsweise wenig Aufwand mithielt; auch Alibabas Qwen zählt dazu. Aus Europa kommt Mistral (Frankreich), und aus der Schweiz das vollständig offene «Apertus» (ETH Zürich, EPFL und das Supercomputer-Zentrum CSCS, 2025).",
              mehr:
                "Der Wettbewerb hat auch eine geopolitische und sprachliche Seite: Wer eigene Modelle baut, macht sich unabhängiger. Ein wichtiger Unterschied ist offen gegen geschlossen — Llama, DeepSeek und Apertus veröffentlichen ihre Gewichte, GPT, Claude und Gemini laufen als Dienste. Apertus legt sogar Trainingsdaten und Methoden offen und deckt über 1000 Sprachen ab, darunter Schweizerdeutsch und Rätoromanisch — ein Beispiel für «souveräne», öffentlich getragene KI neben den grossen kommerziellen Anbietern.",
            },
            {
              titel: "Multimodalität: KI sieht und hört",
              kurz: "Multimodalität",
              kat: "daten",
              mmf: "maschine",
              jahr: "2023–2024",
              text: "Die Modelle bleiben nicht beim Text: Sie verarbeiten auch Bilder, Sprache und teils Video. KI beginnt zu sehen und zu hören.",
              geschichte:
                "Ab 2023/24 wurden führende Systeme multimodal. Claude 3 (2024) konnte Bilder verstehen und beschreiben; GPT-4o (2024) nahm Text, Bild und Ton in einem Modell entgegen und antwortete in Echtzeit gesprochen. Aus dem Textautomaten wird ein Gegenüber, das mehrere Sinne verbindet.",
              mehr:
                "Multimodal heisst: dieselbe Architektur verarbeitet verschiedene «Modalitäten» — geschriebenen Text, Fotos, Diagramme, Sprache, teils bewegte Bilder. Damit kann man ein Foto zeigen und darüber sprechen, statt alles zu tippen. Genau diese Bündelung — sprechen, sehen, hören, erzeugen — macht die «neue Akteurin» aus, um die es in diesem Modul geht.",
            },
          ]}
        />
      </section>

      <FadenDivider className="mt-xl" />

      {/* Bilderstrecke zwischen den Aktivitäten — Anschauungsmodus mit Hotspots */}
      <section className="mt-xl max-w-5xl" aria-label="Bilderstrecke: Bilder zur KI-Geschichte">
        <h2 className="text-headline-lg text-on-surface">Bilder zur KI-Geschichte</h2>
        <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
          Elf Bilder spannen den Bogen: vom Auslagern des Denkens in
          Knotenschnüre über Turings Code-Knacker und den ersten Chatbot ELIZA
          bis zu DALL·E und ChatGPT.{" "}
          <strong>Deine Aufgabe:</strong> Klicke ein Bild an — es öffnet sich
          gross im Anschauungsmodus. Tippe dort die leuchtenden, nummerierten
          Punkte an: Jeder erzählt ein Detail. Mit den Pfeilen (oder den
          Pfeiltasten) blätterst du weiter. Ziel: alle elf Bilder samt ihren
          Punkten.
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
          Was ist da eigentlich aufgetreten? Zwölf Eigenschaften — nicht eine
          allein, ihre Bündelung macht das Neue aus.{" "}
          <strong>Deine Aufgabe:</strong> Tippe die zwölf Punkte im Geflecht
          an — jeder wird beschriftet und zeigt unten seine Definition. Tippe
          auch auf die Verbindungslinien: Das loggt die Verbindung ein und
          öffnet gleich beide Enden. Zwischen besuchten Punkten füllen sich
          die Flächen. Ziel: alle zwölf Merkmale offen — dann erscheint unter
          dem Muster das Fazit.
        </p>
        <KnotenLandschaft
          className="mt-lg"
          ariaLabel="Knotenlandschaft: Die Merkmale"
          hoehe={260}
          svgKlasse="aspect-[720/350] sm:aspect-[720/260]"
          spurKey="vorhang-auf:weisheit"
          kantenSpurKey="vorhang-auf:kanten-weisheit"
          gewichtung={{
            prefix: "vorhang-auf:gestalt",
            frage: "Macht dieses Merkmal die Gestalt der KI …",
            stufen: ["unkenntlich", "verschwommen", "deutlich"],
          }}
          einladung="Zwölf Merkmale, lose verwoben — tippe die Punkte an oder logge Verbindungen ein. Zwischen besuchten Punkten füllen sich die Flächen; ist das Muster gewoben, erscheint darunter das Fazit. Gewichte in jeder Karte, wie deutlich das Merkmal die Gestalt der KI macht — je mehr «deutlich», desto stärker die Konturen."
          abschluss="Diese zwölf Eigenschaften treffen sich in einem einzigen Gegenüber — und darin liegt das eigentlich Neue: Nicht eine einzelne Fähigkeit, sondern ihre Bündelung macht die KI zu einer Akteurin. Sie rechnet, lernt aus Daten, erkennt Muster, wettet auf Wahrscheinlichkeiten, überträgt Gelerntes, liest den Kontext, passt sich an, spricht, arbeitet im Wechselspiel, erzeugt, verbindet die Sinne und handelt — und wird so zu etwas, dem wir mehr Potenzial zurechnen, auf unser Handeln Einfluss zu nehmen, als je einer Technik zuvor."
          knoten={[
            {
              titel: "algorithmisch",
              text: "Im Kern arbeitet sie ein Rechenverfahren ab — Schritt für Schritt, ohne Willkür. Jede Antwort ist das Ergebnis von Berechnungen, nicht von Einsicht. Was wie Spontaneität wirkt, ist ausgeführter Algorithmus.",
              mehr:
                "Ein Algorithmus ist eine eindeutige Schritt-für-Schritt-Anleitung — das Wort geht auf den Bagdader Gelehrten al-Chwarizmi zurück. Auch das «Lernen» der KI ist ein Algorithmus: einer, der Milliarden Zahlenwerte so lange verstellt, bis die Ausgaben passen. Das erdet jede Rede vom «Denken» der Maschine.",
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
            {
              titel: "wahrscheinlichkeitsbasiert",
              text: "Sie rechnet nicht mit Gewissheiten, sondern mit Wahrscheinlichkeiten: Welches Wort folgt am ehesten? Ihre Antworten sind Wetten mit sehr guten Quoten — aber Wetten. Darum kann sie überzeugend klingen und trotzdem falsch liegen.",
              mehr:
                "Für jede Fortsetzung berechnet das Modell eine Wahrscheinlichkeitsverteilung über alle möglichen nächsten Wortbausteine und wählt daraus. Eine Prise eingebauter Zufall (die «Temperatur») macht Antworten lebendig — und erklärt, warum dieselbe Frage zweimal verschieden beantwortet wird.",
            },
            {
              titel: "generalisierend",
              text: "Sie überträgt Gelerntes auf Neues: Auch Sätze, die nie geschrieben wurden, kann sie sinnvoll fortsetzen. Aus Beispielen wird ein allgemeines Muster. Genau das unterscheidet Lernen vom blossen Auswendigwissen.",
              mehr:
                "Generalisierung ist das Herz des maschinellen Lernens: Das Modell soll nicht die Trainingsdaten nachplappern («Überanpassung»), sondern die Regelhaftigkeit dahinter erfassen. Wo Generalisierung gelingt, wirkt die KI klug — wo sie übergeneralisiert, entstehen Klischees und Verzerrungen.",
            },
            {
              titel: "kontextsensitiv",
              text: "Dieselbe Frage — andere Antwort, je nach Zusammenhang. Sie bezieht ein, was vorher gesagt wurde, welche Rolle sie spielen soll, welche Unterlagen vorliegen. Der Kontext ist ihr Arbeitsmaterial.",
              mehr:
                "Technisch heisst das Kontextfenster: alles, was das Modell in einem Gespräch «vor Augen» hat — Anweisungen, bisheriger Dialog, mitgegebene Texte. Die Transformer-Architektur gewichtet laufend, welche Teile davon füreinander wichtig sind («Attention»). Wer den Kontext gestaltet, steuert die Antwort — deshalb ist gutes Prompten eine Kunst.",
            },
            {
              titel: "adaptiv",
              text: "Sie passt sich an — an deinen Ton, deine Beispiele, deine Korrekturen. Aus Rückmeldungen der Nutzenden wird sie laufend nachjustiert. Was du ihr heute zeigst, prägt womöglich ihr Morgen.",
              mehr:
                "Anpassung geschieht auf mehreren Ebenen: im Gespräch (sie greift deinen Stil auf), im Feintuning mit menschlichem Feedback (RLHF) und in neuen Modellversionen, in die Nutzungsdaten einfliessen können. Adaptivität macht sie hilfreich — und wirft die Frage auf, wer da eigentlich wen erzieht.",
            },
            {
              titel: "dialoghaft",
              text: "Man steuert sie mit Alltagssprache — und sie antwortet in Sprache. Das Gespräch selbst ist die Bedienoberfläche: Man fragt, präzisiert, widerspricht, wie bei einem Gegenüber. Keine Menüs, keine Knöpfe — nur Worte.",
              mehr:
                "Bis vor kurzem musste man Computer in Programmiersprachen anweisen. Sprachmodelle kehren das um: Die Anweisung ist normaler Text — «die heisseste neue Programmiersprache ist Englisch», sagt der KI-Forscher Andrej Karpathy. Das macht die Technik für alle bedienbar, verwischt aber auch die Grenze zwischen Befehl und Gespräch.",
            },
            {
              titel: "interaktiv",
              text: "Sie wartet nicht auf ein fertiges Werkstück, sondern arbeitet im Wechselspiel: Vorschlag, Rückmeldung, neuer Vorschlag. Man formt das Ergebnis gemeinsam, in Runden. Aus Bedienen wird Zusammenarbeiten.",
              mehr:
                "Interaktivität unterscheidet die KI vom klassischen Programm: Statt einer Eingabe und einer Ausgabe entsteht eine Schleife aus Versuchen und Verfeinern. Das verändert die Rolle des Menschen — vom Ausführenden zum Anleitenden, Prüfenden und Verantwortenden des Ergebnisses.",
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
              titel: "agentenfähig",
              text: "Sie bleibt nicht beim Antworten stehen: Sie zerlegt ein Ziel in Schritte und greift selbständig zu Werkzeugen — Websuche, Programme, Code. Aus dem Antwortgeber wird ein Akteur, der Dinge erledigt. Genau hier verschwimmt die Grenze zwischen Werkzeug und Gegenüber.",
              mehr:
                "Ein «Agent» ist mehr als ein Antwortgeber: ein Sprachmodell mit Gedächtnis, der Fähigkeit, ein Ziel in Schritte zu zerlegen, und Zugriff auf Werkzeuge — Websuche, Code, andere Programme. Damit handelt die KI eigenständig in der Welt; genau hier verschwimmt die alte Grenze zwischen Werkzeug und Gegenüber.",
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
      </section>

      <FadenDivider className="mt-xl" />

      {/* 3 — Die KI im Kontext: vier Kontexte mit aufklappbaren Aspekten */}
      <section className="mt-xl max-w-5xl" aria-label="Die KI im Kontext">
        <h2 className="text-headline-lg text-on-surface">Die KI im Kontext</h2>
        <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
          Um das Phänomen KI besser zu verstehen, stellt man es in seine
          Kontexte. Vier Blickwinkel — technologisch, wirtschaftlich,
          rechtlich-politisch und kulturell — zeigen, worin die neue Akteurin
          eingebettet ist. <strong>Deine Aufgabe:</strong> Klappe die Aspekte
          auf, die dich interessieren; jeder erklärt einen Faden des Geflechts.
          Gewichte dabei, wie viel Achtsamkeit ein Aspekt verdient — das
          Achtsamkeits-Muster oben wird dadurch farbiger und rötlicher.
        </p>
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
                "KI ist eine Weiterentwicklung der Automatisierung. Wer sie verstehen will, schaut auf ihre materielle Basis — Rechenleistung, Energie und Infrastruktur.",
              punkte: [
                {
                  titel: "Rechen- und Speicherkapazität",
                  text: "Leistungsfähige KI benötigt grosse Mengen an Chips, Servern und Speicher, die nur wenigen Unternehmen und Staaten zur Verfügung stehen.",
                },
                {
                  titel: "Energie und Ressourcen",
                  text: "Training und Betrieb verbrauchen Strom, Kühlwasser und Rohstoffe; Effizienzgewinne stehen einer stark wachsenden Nutzung gegenüber.",
                },
                {
                  titel: "Rechenzentren",
                  text: "Neue Anlagen schaffen digitale Kapazitäten, konkurrieren lokal aber um Energie, Wasser, Fläche und Netzanschlüsse.",
                },
              ],
            },
            {
              icon: "payments",
              titel: "Wirtschaftlicher Kontext",
              intro:
                "In einer kapitalistischen Gesellschaft dient KI der Rationalisierung — Kosten senken, Geld verdienen. Das prägt, wer sie baut, wem sie nützt und wie sich Arbeit verändert.",
              punkte: [
                {
                  titel: "Technologisch-kapitalistische Organisation",
                  text: "Die Entwicklung leistungsfähiger KI ist überwiegend in privatwirtschaftlichen Plattformunternehmen organisiert. Kapital, Daten, Rechenzentren und Patente konzentrieren sich dadurch bei wenigen Akteuren, deren wirtschaftliche Interessen die technische Entwicklung mitbestimmen.",
                },
                {
                  titel: "Zugang",
                  text: "Kosten, Infrastruktur, Sprache und digitale Kompetenzen entscheiden darüber, wer KI nutzen und mitgestalten kann.",
                },
                {
                  titel: "Arbeitsmarkt",
                  text: "KI ersetzt vor allem einzelne Tätigkeiten, verändert Berufsbilder und erzeugt zugleich neue Aufgaben und Qualifikationsanforderungen.",
                },
                {
                  titel: "Rollenverschiebung",
                  text: "Menschen wechseln teilweise vom Ausführen zum Anleiten, Überprüfen und Verantworten maschinell erzeugter Ergebnisse.",
                },
              ],
            },
            {
              icon: "balance",
              titel: "Rechtlicher und politischer Kontext",
              intro:
                "Chancen und Risiken müssen mit rechtlichen Leitplanken kanalisiert werden — und Staaten ringen politisch um Einfluss und Unabhängigkeit.",
              punkte: [
                {
                  titel: "Regulierung",
                  text: "Gesetze sollen Grundrechte, Sicherheit, Datenschutz und Urheberrecht schützen, ohne Forschung und Innovation unverhältnismässig einzuschränken.",
                },
                {
                  titel: "Geopolitik",
                  text: "Staaten und Unternehmen konkurrieren um Chips, Daten, Fachkräfte, Energie, Standards und technologische Unabhängigkeit.",
                },
              ],
            },
            {
              icon: "diversity_3",
              titel: "Kultureller Kontext",
              intro:
                "Je nach Weltbild fällt der Blick auf KI anders aus — westliche und etwa asiatische Kulturen deuten das Phänomen unterschiedlich. Auch der Umgang mit Wissen und Überlieferung steht auf dem Spiel.",
              punkte: [
                {
                  titel: "Kultureller Bias und Technikverständnis",
                  text: "KI-Systeme spiegeln häufig dominante westliche Sprachen, Werte und Wissensordnungen. Gleichzeitig unterscheiden sich kulturelle Vorstellungen von Individualität, Datenschutz, Technik, Staat und Gemeinschaft — wobei «West» und «Ost» keine einheitlichen Blöcke sind.",
                },
                {
                  titel: "Text- und Archivkompetenz",
                  text: "KI erleichtert Suche und Auswertung, ersetzt aber nicht Quellenkritik, Kontextwissen, Herkunftsnachweise und die Kontrolle am Original.",
                },
                {
                  titel: "Wissensmacht",
                  text: "Was digitalisiert, zugänglich und in Trainingsdaten enthalten ist, wird sichtbarer; fehlende oder ausgeschlossene Überlieferungen können weiter an Bedeutung verlieren.",
                },
              ],
            },
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

      <SeitenNavigation
        weiter={{
          href: "/lernen/lernseite-2/philosophische-perspektive",
          label: "Philosophische Perspektive",
        }}
      />
    </AppLayout>
  );
}
