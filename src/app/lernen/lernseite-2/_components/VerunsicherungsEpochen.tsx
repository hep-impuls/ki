"use client";

import { useEffect, useState } from "react";
import {
  leseSpurenIndices,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";
import KartenAktion from "./KartenAktion";
import GewichtungWahl from "./GewichtungWahl";
import InfoPunkt from "./InfoPunkt";
import { GlossarText } from "./Glossar";
import { melde } from "../_lib/auswertung";
import BildZoom, { type TourStop } from "../philosophische-perspektive/_components/BildZoom";

/**
 * VerunsicherungsEpochen — «Philosophie in Zeiten der Verunsicherung».
 * Acht Epochen-Panels, je mit zwei Kunstwerken (frei zoombar via BildZoom) und
 * drei aufklappbaren, bewertbaren Bausteinen: Technologie, Verunsicherung,
 * Philosophie. Jeder Baustein: ausführlicher, belegter Text (mit Quellen-
 * Verweisen) + «Mehr lesen» + «Das verfolge ich weiter» + eine Bewertung.
 * Fachbegriffe werden per Glossar gehovert.
 */

const SPUR = "philosophische-perspektive:epochen";

interface Quelle {
  label: string;
  url: string;
}
interface Bild {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  /** Hintergrund zum Bild (Infopoint unter der Bildunterschrift):
   *  Künstler, Entstehung, Anlass. */
  hintergrund: string;
  /** Kuratierte «Führung» durchs Bild (anklickbare Stellen im Zoom-Viewer). */
  tour?: TourStop[];
  /** Abschluss-Stopp der Führung: verknüpft das Bild mit Technik &
   *  Verunsicherung der Epoche. */
  contextNote?: string;
}
interface Baustein {
  text: string;
  mehr: string;
  quellen: Quelle[];
}
interface Epoche {
  epoche: string;
  span: string;
  lead: string;
  /** Vertiefung im Kopf-Akkordeon «Mehr wissen» — ordnet die Epoche ein. */
  leadMehr: string;
  bilder: [Bild, Bild];
  technologie: Baustein;
  verunsicherung: Baustein;
  philosophie: Baustein;
}

const BAUSTEINE = [
  {
    key: "technologie" as const,
    label: "Technologie",
    icon: "memory",
    gewPrefix: "philosophische-perspektive:technikwert",
    gewFrage: "Diese Technologie —",
    gewStufen: [
      "bin froh, gibt es sie",
      "hat für mich keine Bedeutung",
      "hätte nie eingeführt werden sollen",
    ] as [string, string, string],
  },
  {
    key: "verunsicherung" as const,
    label: "Verunsicherung",
    icon: "psychology_alt",
    gewPrefix: "philosophische-perspektive:verunsicherung-heute",
    gewFrage: "Diese Verunsicherung —",
    gewStufen: ["verunsichert mich noch heute", "ein wenig", "gar nicht mehr"] as [
      string,
      string,
      string,
    ],
  },
  {
    key: "philosophie" as const,
    label: "Philosophie",
    icon: "menu_book",
    gewPrefix: "philosophische-perspektive:philo-hilft",
    gewFrage: "Diese Sichtweise —",
    gewStufen: [
      "hilft mir auch heute",
      "hatte ich noch nie so überlegt",
      "macht für mich keinen Sinn",
    ] as [string, string, string],
  },
];

const w = (lemma: string): string => `https://de.wikipedia.org/wiki/${lemma}`;

const EPOCHEN: Epoche[] = [
  {
    epoche: "Antike",
    span: "Athen & Rom · ~500 v.–500 n. Chr.",
    lead: "Zum ersten Mal ordnen sich Menschen nicht über Herkunft und Mythos, sondern über Bürgerrecht, Markt und Argument. In den griechischen Stadtstaaten und der römischen Republik entsteht die Idee, dass Regeln aushandelbar sind und Bürger mitreden. Wissen soll nicht mehr geglaubt, sondern begründet werden — das ist aufregend und beunruhigend zugleich.",
    leadMehr:
      "«Antike» meint hier rund tausend Jahre — vom klassischen Athen des 5. Jahrhunderts v. Chr. bis zum Ende des Weströmischen Reiches. In dieser Zeit entstehen zentrale Bausteine unserer Welt: Demokratie und Republik, das geschriebene Recht, die Philosophie, die Geometrie, das Theater. Vieles davon war an Sklaverei und den Ausschluss von Frauen gebunden — die Idee der Gleichheit galt nur einem kleinen Kreis. Und doch stammt von hier die Grundüberzeugung, dass sich die Welt mit dem Verstand ordnen und begründen lässt.",
    bilder: [
      {
        src: "/art/athens.jpg",
        alt: "Raffaels Fresko «Die Schule von Athen»",
        caption: "Die Denker der Antike, versammelt im Gespräch",
        credit: "Raffael, «Die Schule von Athen», 1509–1511 · gemeinfrei",
        hintergrund:
          "Raffael malte das Fresko 1509–1511 für die Bibliothek des Papstes im Vatikan. Es zeigt keine reale Szene: Die Renaissance versammelt hier ihre antiken Vorbilder in einer idealen Halle — über fünfzig Denker; am rechten Rand blickt Raffael selbst aus dem Bild.",
        contextNote:
          "Raffaels Halle der Denker ist ein Rückblick der Renaissance auf die Antike — und ein Bild ihrer Antwort auf eine tiefe Verunsicherung. Als in Athen der Mythos seine bindende Kraft verlor und die Sophisten lehrten, dass sich jede Behauptung gegen Bezahlung überzeugend vertreten lässt, drohte Wahrheit zur blossen Rhetorik zu werden. Aristoteles bündelte die Gegenkraft zu einer Methode: beobachten, ordnen, begründen. Genau diese Schablone feiert Raffael, indem er die Denker aller Zeiten in einer Halle versammelt.",
        tour: [
          {
            x: 50,
            y: 45,
            zoom: 1,
            title: "Die versammelte Philosophie",
            text: "Raffael malt 1509–1511 im Vatikan eine ideale Halle, in der sich die griechischen Denker aller Zeiten begegnen. Es ist kein realer Ort und keine reale Szene, sondern ein Bild des Denkens selbst — die Antike, wie die Renaissance sie als ihr eigenes Fundament verehrte.",
          },
          {
            x: 50,
            y: 42,
            zoom: 2.6,
            title: "Platon und Aristoteles",
            text: "Im Zentrum steht der Grundkonflikt der Erkenntnis in einer einzigen Geste: Platon zeigt mit dem Finger nach oben, in die Welt der ewigen Ideen — Aristoteles hält die Hand flach über den Boden, zur beobachtbaren Wirklichkeit. Genau hier beginnt die Schablone, die später die gesamte Wissenschaft trägt.",
          },
          {
            x: 37,
            y: 40,
            zoom: 2.8,
            title: "Sokrates im Gespräch",
            text: "Links, im olivgrünen Gewand, zählt Sokrates an den Fingern seine Argumente ab und führt umringt von Zuhörern sein Frage-und-Antwort-Spiel vor. Diese Methode, alles so lange zu hinterfragen, bis scheinbare Gewissheiten zerbrechen, machte ihn zur unbequemsten Figur Athens — und kostete ihn das Leben.",
          },
          {
            x: 71,
            y: 71,
            zoom: 2.8,
            title: "Euklid an der Tafel",
            text: "Rechts beugt sich Euklid mit einem Zirkel über eine Tafel und führt Jugendlichen einen geometrischen Beweis vor. Die Szene feiert ein neues Ideal: Wissen, das nicht behauptet, sondern Schritt für Schritt bewiesen und darum von jedem nachvollzogen werden kann.",
          },
        ],
      },
      {
        src: "/art/sokrates.jpg",
        alt: "Jacques-Louis David, «Der Tod des Sokrates»",
        caption: "Sokrates, zum Tod verurteilt, bleibt seiner Überzeugung treu",
        credit: "Jacques-Louis David, «Der Tod des Sokrates», 1787 · gemeinfrei",
        hintergrund:
          "Jacques-Louis David malte das Bild 1787 in Paris — zwei Jahre vor der Französischen Revolution. Der Klassizist nutzt die antike Szene als Lehrstück über Standhaftigkeit gegenüber ungerechter Macht; sein Publikum verstand den aktuellen Bezug sehr wohl.",
        contextNote:
          "Der Tod des Sokrates zeigt die Verunsicherung der Antike in einem einzigen Bild: eine Stadt, die ihren klügsten und unbequemsten Frager zum Tode verurteilt, weil der alte Mythos nicht mehr trägt und jede Gewissheit wankt. Die Antwort der Epoche war nicht, das Fragen zu verbieten, sondern es zu ordnen: Aus der sokratischen Methode und der Systematik des Aristoteles entstand das Fundament der Wissenschaft.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Die letzte Stunde",
            text: "399 v. Chr., eine Gefängniszelle in Athen: David malt den Moment, kurz bevor Sokrates den Giftbecher trinkt — ein Lehrstück über Standhaftigkeit. Der klare, gefasste Held im Kreis erschütterter Freunde; die strenge Komposition zeigt: Hier geht es um Haltung, nicht um Rührung.",
          },
          {
            x: 62,
            y: 32,
            zoom: 2.6,
            title: "Der Finger nach oben",
            text: "Noch im Sterben unterrichtet Sokrates weiter: Mit der einen Hand greift er nach dem Becher, mit der anderen hebt er den Finger nach oben — zu dem, was grösser ist als der eigene Tod: das Argument, die Wahrheit. Selbst die Hinrichtung wird zur letzten philosophischen Lektion.",
          },
          {
            x: 47,
            y: 47,
            zoom: 2.8,
            title: "Der Becher",
            text: "Fast beiläufig, ohne hinzusehen, greift Sokrates nach dem Schierlingsbecher. Der Vollstrecker im roten Gewand wendet das Gesicht ab und fasst sich an den Kopf: Er kann nicht mit ansehen, was er tun muss. Der Kontrast macht die Fassung des Verurteilten umso grösser.",
          },
          {
            x: 18,
            y: 56,
            zoom: 2.6,
            title: "Platon am Fussende",
            text: "Gefasst, in sich gekehrt sitzt am Fussende der greise Platon — obwohl er an jenem Tag historisch gar nicht anwesend war. David setzt ihn bewusst dazu: Er wird das Gespräch aufschreiben und über zwei Jahrtausende weitertragen. Ohne diese Überlieferung wüssten wir von Sokrates fast nichts.",
          },
        ],
      },
    ],
    technologie: {
      text: "Zwei Erfindungen tragen den Wandel. Die griechische Alphabetschrift (ab etwa 800 v. Chr.) kommt mit rund zwei Dutzend Zeichen aus — Lesen und Schreiben sind nicht mehr Sache einer Priesterkaste. Und gemünztes Geld (in Kleinasien und Griechenland ab dem 7./6. Jahrhundert v. Chr.) macht Werte zählbar, teilbar und übertragbar, unabhängig von Person und Stand. Durchsetzen konnten sie sich, weil eine see- und handelstreibende Welt Aufzeichnungen, Verträge und ein verlässliches Tauschmittel brauchte: Das Alphabet entstand aus der Handelsschrift der Phönizier, das Silber für die Münzen kam aus Bergwerken wie dem attischen Laurion.",
      mehr: "Mit der Schrift lassen sich Gesetze, Verträge und Argumente festhalten und überprüfen — die Grundlage von Recht und Wissenschaft. Münzgeld beschleunigt Handel und Arbeitsteilung und lässt eine bewegliche Schicht von Kaufleuten neben dem alten Grundbesitz entstehen.",
      quellen: [
        { label: "Griechisches Alphabet (Wikipedia)", url: w("Griechisches_Alphabet") },
        { label: "Geschichte des Geldes (Wikipedia)", url: w("Geschichte_des_Geldes") },
      ],
    },
    verunsicherung: {
      text: "Besonders der alte Geburtsadel verliert den Boden: In der attischen Demokratie (ab ~500 v. Chr.) und der römischen Republik zählen Abstimmung, Amt und öffentliche Rede, nicht mehr allein die Abstammung. Zugleich lehren die Sophisten gegen Bezahlung Redekunst und vertreten, man könne zu jeder Sache das Gegenteil ebenso gut begründen. Der Prozess gegen Sokrates (399 v. Chr.), der mit dem Todesurteil endet, zeigt, wie nervös eine verunsicherte Stadt reagiert.",
      mehr: "Wenn sich alles «weg­reden» lässt, wächst die Angst, dass gar nichts mehr gilt. Sokrates wurde wegen «Verderbnis der Jugend» und «Gottlosigkeit» angeklagt — im Kern, weil sein unermüdliches Fragen die Gewissheiten der Bürger erschütterte.",
      quellen: [
        { label: "Sophisten (Wikipedia)", url: w("Sophisten") },
        { label: "Prozess des Sokrates (Wikipedia)", url: w("Prozess_des_Sokrates") },
      ],
    },
    philosophie: {
      text: "Aristoteles (384–322 v. Chr.) setzt dem eine Methode entgegen: beobachten, unterscheiden, in Begriffe ordnen und aus Voraussetzungen schlüssig folgern (Logik). Nicht wer am besten redet, soll recht behalten, sondern was sich am besten begründen lässt. Im Alltag lebt das als Selbstverständlichkeit fort, dass man Behauptungen belegt («beweis es») und Widersprüche als Fehler gelten.",
      mehr: "Aristoteles' Schriften zur Logik («Organon») blieben bis ins 19. Jahrhundert massgeblich. Seine Trennung von Beobachtung und Begründung ist bis heute das Grundgerüst wissenschaftlichen Arbeitens — und der Grund, warum wir Quellen und Belege verlangen.",
      quellen: [
        { label: "Aristoteles (Wikipedia)", url: w("Aristoteles") },
        { label: "Logik (Wikipedia)", url: w("Logik") },
      ],
    },
  },
  {
    epoche: "Zerbrechen der Ordnung",
    span: "Spätantike & Mittelalter · ~400–1400",
    lead: "Rom zerfällt — und mit den Strassen, Städten und Gesetzen wankt die ganze Weltordnung. Was tausend Jahre selbstverständlich schien, löst sich auf: Handel schrumpft, Städte leeren sich, Wissen zieht sich in die Klöster zurück. Die Menschen suchen einen neuen Halt — und finden ihn nicht mehr im Reich, sondern im Glauben.",
    leadMehr:
      "Der Übergang von der Spätantike ins Mittelalter dauert Jahrhunderte und verläuft nicht überall gleich: Während im Westen die römische Ordnung zerfällt, blühen das oströmische (byzantinische) Reich und wenig später die islamische Welt kulturell auf und bewahren viel antikes Wissen. Im lateinischen Europa wird die Kirche zur wichtigsten Klammer — sie stellt Schrift, Recht, Zeitrechnung und Trost. «Mittelalter» ist ein Sammelbegriff für sehr verschiedene Jahrhunderte, nicht die pauschal «dunkle Zeit», als die es oft dargestellt wird.",
    bilder: [
      {
        src: "/art/rom.jpg",
        alt: "Die Plünderung Roms durch die Barbaren",
        caption: "410: Rom wird geplündert — für viele bricht die Welt zusammen",
        credit: "Joseph-Noël Sylvestre, «Die Plünderung Roms», 1890 · gemeinfrei",
        hintergrund:
          "Joseph-Noël Sylvestre malte die Plünderung 1890 — fast 1500 Jahre nach dem Ereignis. Das Historiengemälde sagt darum mehr über das 19. Jahrhundert als über 410: Es malt die Angst der eigenen Epoche vor dem Untergang einer Zivilisation.",
        contextNote:
          "Der Fall Roms ist die Verunsicherung dieser Epoche in Reinform: Als die Westgoten 410 die «ewige Stadt» plünderten, brach für die Zeitgenossen nicht nur eine Hauptstadt, sondern eine ganze Weltordnung zusammen — man rang um Schuld und Sinn, Heiden wie Christen. Augustinus gab darauf mit dem «Gottesstaat» die Orientierung: Nicht das irdische Reich trägt, sondern eine unsichtbare, geistige Ordnung.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Sylvestre, 1890",
            text: "Ein grosses Historiengemälde des 19. Jahrhunderts inszeniert die Plünderung Roms im Jahr 410. Vor brennender Kulisse stürmen die Westgoten die Stadt — der Maler trifft damit ein Gefühl, das seine eigene, umbruchsreiche Zeit umtrieb: die Angst vor dem Ende einer Zivilisation.",
          },
          {
            x: 52,
            y: 26,
            zoom: 2.2,
            title: "Der Sturz des Kaisers",
            text: "Ein Krieger klettert an der weissen Marmorstatue eines römischen Kaisers hoch und holt zum Schlag aus. Nicht ein Mensch wird gestürzt, sondern das Sinnbild der Macht selbst — buchstäblich vom Sockel gerissen. So sichtbar zerbricht eine Ordnung, die 800 Jahre unantastbar schien.",
          },
          {
            x: 50,
            y: 84,
            zoom: 2.2,
            title: "Viele Hände am Seil",
            text: "Unten ziehen zahlreiche Krieger gemeinsam an einem Seil, um das Standbild zu Fall zu bringen. Die alte Weltordnung stürzt nicht von selbst — sie wird von vielen Händen aktiv niedergerissen: Geschichte als Werk von Menschen, nicht von Schicksal.",
          },
        ],
      },
      {
        src: "/art/augustine.jpg",
        alt: "Der heilige Augustinus",
        caption: "Augustinus verlegt den Halt vom äusseren Reich nach innen",
        credit: "Philippe de Champaigne, «Der heilige Augustinus», um 1645 · gemeinfrei",
        hintergrund:
          "Philippe de Champaigne malte den Kirchenvater um 1645 im barocken Frankreich. Buch, flammendes Herz und Lichtstrahl sind Augustinus' klassische Attribute — das Bild ist ein Programm: Wahrheit kommt von innen und von oben, nicht aus der äusseren Welt.",
        contextNote:
          "Champaignes Augustinus verkörpert die Antwort auf einen epochalen Schock. Als Rom 410 fiel und mit dem Reich für viele die Weltordnung selbst zusammenbrach, verlegte Augustinus den Halt vom äusseren Reich ins Innere des Menschen und in den Glauben: Wahrheit und Orientierung findet man nicht mehr in der vergänglichen Macht, sondern in Gewissen, Erinnerung und Zuwendung zu Gott. Diese nach innen gewandte Ordnung prägte das Abendland ein Jahrtausend lang.",
        tour: [
          {
            x: 50,
            y: 40,
            zoom: 1,
            title: "Champaigne, um 1645",
            text: "Der barocke Maler zeigt Augustinus als Bischof am Schreibpult, umgeben von seinen Sinnbildern: dem Buch, dem brennenden Herzen und einem Lichtstrahl von oben. Das ganze Bild ist um eine Frage gebaut — woher kommt die Wahrheit?",
          },
          {
            x: 60,
            y: 52,
            zoom: 2.4,
            title: "Das brennende Herz",
            text: "In seiner Hand hält Augustinus ein flammendes Herz — sein bekanntestes Attribut. Es steht für eine leidenschaftliche Suche nach Wahrheit, die nicht im kühlen Verstand, sondern im Innersten des Menschen brennt. Die Wahrheit kommt für ihn nicht von aussen, sondern von innen.",
          },
          {
            x: 45,
            y: 18,
            zoom: 2.2,
            title: "Der Strahl der Wahrheit",
            text: "Von oben fällt ein heller Strahl auf Augustinus, dem sein Blick entgegengeht. Er verkörpert Augustins Überzeugung, dass wahre Erkenntnis eine Art göttliche «Erleuchtung» ist: Der Mensch findet die Wahrheit, indem er sich nach innen und nach oben wendet.",
          },
        ],
      },
    ],
    technologie: {
      text: "Hier verunsichert nicht neue, sondern verlorene Technik. Mit dem Weströmischen Reich (476 n. Chr.) verfallen Fernstrassen, Aquädukte, Münzwesen und die staatliche Verwaltung. Fähigkeiten wie Betonbau in römischer Qualität gehen für Jahrhunderte verloren; die Welt wird kleiner, langsamer und unsicherer. Verloren gingen sie, weil ihre Grundlage wegbrach: Ohne Zentralmacht, Steuern und Fernhandel gab es niemanden mehr, der Strassen unterhielt oder Münzen prägte — Technik überlebt nur mit ihrer wirtschaftlichen und politischen Basis.",
      mehr: "Handel und Geldwirtschaft schrumpfen, das Leben zieht sich auf Dorf, Gutshof und Kloster zurück (Naturalwirtschaft). Schriftliches Wissen überlebt vor allem in den Skriptorien der Klöster, wo Mönche antike Texte abschreiben — ein schmaler Faden, an dem die Überlieferung hängt.",
      quellen: [
        { label: "Untergang des Weströmischen Reiches (Wikipedia)", url: w("Untergang_des_Weströmischen_Reiches") },
        { label: "Skriptorium (Wikipedia)", url: w("Skriptorium") },
      ],
    },
    verunsicherung: {
      text: "Betroffen sind alle, besonders die städtischen Eliten: Wer sich auf Rom und seine Ordnung verlassen hatte, steht plötzlich ohne Schutz da. Nach der Plünderung Roms 410 durch die Westgoten geben viele den Christen die Schuld — sie hätten mit dem Abfall von den alten Göttern das Unglück heraufbeschworen.",
      mehr: "Die Erschütterung ist auch eine Sinnkrise: Wenn die «ewige Stadt» fallen kann, worauf ist dann Verlass? Augustinus schreibt gegen den Vorwurf sein Hauptwerk «De civitate Dei» («Vom Gottesstaat»).",
      quellen: [
        { label: "Plünderung Roms (410) (Wikipedia)", url: w("Plünderung_Roms_(410)") },
        { label: "De civitate Dei (Wikipedia)", url: w("De_civitate_Dei") },
      ],
    },
    philosophie: {
      text: "Augustinus (354–430) verlegt den Halt vom äusseren Reich nach innen: Nicht Mauern und Macht tragen, sondern Glaube, Gewissen und Erinnerung. Er unterscheidet den vergänglichen «Gottesstaat» vom irdischen Staat und deutet die Geschichte als Heilsweg. Alltagssprachlich lebt das fort in «hör auf dein Gewissen» und «geh in dich».",
      mehr: "Augustinus macht das Innenleben zum philosophischen Thema; seine «Confessiones» («Bekenntnisse») gelten als erste grosse Autobiografie der Weltliteratur. Aus dem äusseren Reich wird das innere — eine Schablone, die dem lateinischen Europa fast tausend Jahre Orientierung gab.",
      quellen: [
        { label: "Augustinus von Hippo (Wikipedia)", url: w("Augustinus_von_Hippo") },
        { label: "Confessiones (Wikipedia)", url: w("Confessiones") },
      ],
    },
  },
  {
    epoche: "Renaissance & Aufbruch",
    span: "~1400–1600",
    lead: "Neue Welten, neue Medien, neues Geld: Der Mensch rückt sich selbst ins Zentrum — und verliert zugleich seine Mitte im Kosmos. Die Wiederentdeckung der Antike, die Eroberung Amerikas und der Buchdruck lassen das Selbstbewusstsein wachsen: Der Mensch traut sich zu, die Welt zu vermessen und neu zu gestalten. Gleichzeitig zeigt Kopernikus, dass die Erde nicht der Mittelpunkt ist — Grösse und Kränkung liegen dicht beieinander.",
    leadMehr:
      "«Renaissance» heisst «Wiedergeburt» — gemeint war die Rückbesinnung auf Kunst und Wissen der Antike, ausgehend von den reichen Städten Italiens (Florenz, Venedig) ab dem 14. Jahrhundert. Sie ist untrennbar mit dem Humanismus verbunden: der Idee, dass Bildung den Menschen formt. Zugleich ist es die Zeit der Kolonialgewalt, der Hexenverfolgung und der Glaubenskriege — der «Aufbruch» hatte eine sehr dunkle Rückseite. Kunst, Wissenschaft und Kapitalismus nehmen hier gemeinsam Fahrt auf.",
    bilder: [
      {
        src: "/art/bruegel-babel.jpg",
        alt: "Pieter Bruegel, «Der Turmbau zu Babel»",
        caption: "Der Turmbau zu Babel: menschlicher Ehrgeiz, der ins Wanken gerät",
        credit: "Pieter Bruegel d. Ä., «Der Turmbau zu Babel», 1563 · gemeinfrei",
        hintergrund:
          "Pieter Bruegel d. Ä. malte den Turm 1563 in Antwerpen — damals eine der reichsten Handelsstädte Europas. Die biblische Geschichte vom vermessenen Turmbau wird bei ihm zum Panorama der eigenen Gegenwart: Baustelle, Hafen und Stadt sind flämisch, nicht babylonisch.",
        contextNote:
          "Der Turmbau zu Babel ist das Bild der Renaissance-Verunsicherung: Eine Epoche, die mit Buchdruck, Seefahrt und Kapital alles zu können scheint — und ahnt, dass der Ehrgeiz das Fundament überfordern könnte. Die biblische Strafe für den Turm war die Sprachverwirrung; Bruegels Zeit erlebte ihre eigene: die Glaubensspaltung, die Europa in Lager teilte.",
        tour: [
          {
            x: 50,
            y: 45,
            zoom: 1,
            title: "Bruegel, 1563",
            text: "Der Turm füllt das Bild wie ein Gebirge: unten fertig und bewohnt, oben rohes Gestein — eine Baustelle, die in die Wolken wächst. Bruegel malt die biblische Geschichte als Panorama seiner eigenen Zeit, mit Hunderten winziger Arbeiter.",
          },
          {
            x: 57,
            y: 14,
            zoom: 2.4,
            title: "Die Spitze in den Wolken",
            text: "Die obersten Stockwerke stossen buchstäblich in die Wolke — und schon zeigt sich die Schieflage: Die Ebenen stehen schräg, das rote Mauerwerk bleibt roh. Der Ehrgeiz wächst schneller, als das Fundament trägt — ein Bild für Technik-Hybris.",
          },
          {
            x: 15,
            y: 80,
            zoom: 2.4,
            title: "Der Bauherr und die Steinmetze",
            text: "Vorne links besucht König Nimrod die Baustelle; die Steinmetze fallen auf die Knie. Macht, Geld und Technik gehören zusammen: Ohne Herrscher und Kapital kein Turm. Bruegels Zeitgenossen erkannten darin die Grossbaustellen und Handelsherren der eigenen Städte.",
          },
          {
            x: 88,
            y: 62,
            zoom: 2.2,
            title: "Der Hafen",
            text: "Rechts liegen Schiffe und Flösse am Kai: Der Nachschub kommt übers Wasser. Bruegel malt den Turm nicht in Babylon, sondern an einem flämischen Hafen — die Handelswelt seiner Gegenwart, in der Antwerpen zur Weltstadt aufstieg.",
          },
        ],
      },
      {
        src: "/art/holbein-gesandte.jpg",
        alt: "Hans Holbein, «Die Gesandten»",
        caption: "Reichtum und Wissenschaft — und ein verzerrter Totenkopf als Riss im Bild",
        credit: "Hans Holbein d. J., «Die Gesandten», 1533 · gemeinfrei",
        hintergrund:
          "Hans Holbein d. J. malte das Doppelporträt 1533 in London: den französischen Gesandten Jean de Dinteville und Bischof Georges de Selve. Die Gegenstände zwischen ihnen sind ein Inventar des neuen Wissens — und die Risse darin (gerissene Lautensaite, Totenschädel) ein Kommentar zur Glaubensspaltung ihrer Zeit.",
        contextNote:
          "Die «Gesandten» bündeln die Renaissance in einem Bild: das neue Wissen (Instrumente), der neue Reichtum (Pelz, Teppich) — und die Verunsicherung als Riss im Bild: gerissene Saite, Luther-Gesangbuch, verzerrter Schädel. Fortschritt und doppelter Boden gehören in dieser Epoche zusammen.",
        tour: [
          {
            x: 50,
            y: 45,
            zoom: 1,
            title: "Holbein, 1533",
            text: "Zwei junge Männer auf dem Gipfel ihrer Möglichkeiten: der französische Gesandte Jean de Dinteville (links) und sein Freund, Bischof Georges de Selve. Zwischen ihnen ein Regal voller Instrumente — ein Inventar dessen, was ihre Epoche kann und weiss.",
          },
          {
            x: 55,
            y: 27,
            zoom: 2.4,
            title: "Das obere Regal: der Himmel",
            text: "Himmelsglobus, Sonnenuhren, Quadrant: Instrumente zur Vermessung von Himmel und Zeit — das neue Wissen der Epoche. Wer Himmel und Stunde berechnen kann, kann navigieren und handeln: Wissenschaft und Welthandel gehören zusammen.",
          },
          {
            x: 55,
            y: 62,
            zoom: 2.4,
            title: "Das untere Regal: die Erde",
            text: "Erdglobus, Rechenbuch, Laute und Gesangbuch: die irdischen Künste. Doch genau hier sitzt der Riss — an der Laute ist eine Saite gerissen, und das aufgeschlagene Gesangbuch zeigt Luther-Lieder: die zerbrochene Harmonie der Glaubensspaltung.",
          },
          {
            x: 48,
            y: 86,
            zoom: 2.2,
            title: "Der verzerrte Totenkopf",
            text: "Der graue Schrägbalken unten wird erst aus spitzem Winkel lesbar: ein Totenschädel (eine Anamorphose). Mitten im Triumph von Reichtum und Wissen erinnert Holbein an die Vergänglichkeit — der doppelte Boden der ganzen Epoche.",
          },
        ],
      },
    ],
    technologie: {
      text: "Drei Techniken beschleunigen alles. Der Buchdruck mit beweglichen Lettern (Gutenberg, um 1450) macht Texte massenhaft und billig. Kompass und ozeantaugliche Schiffe öffnen die Seewege. Und die doppelte Buchführung (in Italien seit dem 14. Jahrhundert, systematisiert von Luca Pacioli 1494) verwandelt Handel in ein nachprüfbares Rechenwerk. Durchsetzen konnte sich der Buchdruck erst, als billiges Papier (über die islamische Welt aus China) und eine wachsende, lesehungrige Stadt- und Handelsschicht zusammenkamen; die doppelte Buchführung entsprang dem Bedarf der italienischen Handelshäuser, Kredite und Gewinne zu verfolgen.",
      mehr: "Der Buchdruck lässt Auflagen von Tausenden entstehen, wo zuvor einzelne Handschriften standen — Wissen entzieht sich der Kontrolle von Kloster und Hof. Die doppelte Buchführung mit Soll und Haben ist die Rechenmaschine des frühen Kapitalismus: Sie macht Gewinn planbar.",
      quellen: [
        { label: "Buchdruck (Wikipedia)", url: w("Buchdruck") },
        { label: "Doppelte Buchführung (Wikipedia)", url: w("Doppelte_Buchführung") },
      ],
    },
    verunsicherung: {
      text: "Getroffen werden mehrere Gruppen zugleich: die Deutungshüter (Klerus und Handschriften-Kopisten) verlieren ihr Wissensmonopol; die Bauern erheben sich im Deutschen Bauernkrieg (1525); und die Völker Amerikas werden nach 1492 erobert und dezimiert. Zugleich nimmt Kopernikus (1543) der Erde die Mitte des Kosmos.",
      mehr: "In Holbeins «Gesandten» (1533) liegt quer im Bild ein stark verzerrter Totenkopf (eine sogenannte Anamorphose): Mitten in Reichtum und Wissenschaft die Erinnerung an den Tod. Das Bild fasst die Epoche — grosser Aufstieg und untergründige Verunsicherung im selben Rahmen.",
      quellen: [
        { label: "Deutscher Bauernkrieg (Wikipedia)", url: w("Deutscher_Bauernkrieg") },
        { label: "Die Gesandten / Anamorphose (Wikipedia)", url: w("Die_Gesandten_(Holbein)") },
      ],
    },
    philosophie: {
      text: "Pico della Mirandola (1463–1494) formuliert in seiner «Rede über die Würde des Menschen», der Mensch sei nicht auf eine feste Natur festgelegt, sondern forme sich selbst. Montaigne (1533–1592) setzt die skeptische Frage dagegen: «Que sais-je?» — «Was weiss ich schon?». Alltagssprachlich lebt beides fort in «jeder ist seines Glückes Schmied» und im Bekenntnis, etwas zu hinterfragen.",
      mehr: "Erstmals gilt die Selbstformung als Würde des Menschen — eine Wurzel des modernen Individualismus. Montaignes «Essais» begründen zugleich eine neue, prüfende Haltung: erst zweifeln und beobachten, dann urteilen.",
      quellen: [
        { label: "Über die Würde des Menschen (Wikipedia)", url: w("Über_die_Würde_des_Menschen") },
        { label: "Michel de Montaigne (Wikipedia)", url: w("Michel_de_Montaigne") },
      ],
    },
  },
  {
    epoche: "Aufklärung",
    span: "~1600–1800",
    lead: "Die Naturwissenschaft entziffert den Himmel, und die Vernunft klopft bei jeder Autorität an: Warum eigentlich? Immer mehr Menschen wollen nichts mehr einfach glauben, sondern selbst prüfen — in Wissenschaft, Religion und Politik. Aus diesem Selbstdenken erwachsen die Ideen von Menschenrechten, Gewaltenteilung und Fortschritt, die bis heute unsere Demokratien tragen.",
    leadMehr:
      "Die Aufklärung ist eine Bewegung des 17. und 18. Jahrhunderts, getragen von Denkern wie Locke, Voltaire, Rousseau, Diderot und Kant. Ihr Vertrauen in Vernunft und Fortschritt veränderte Europa tiefgreifend und mündete politisch in die Amerikanische und die Französische Revolution. Doch schon Zeitgenossen sahen die Ambivalenz: Dieselbe Vernunft, die befreit, kann auch kühl berechnen und beherrschen — eine Spannung, die bis zu KI und Datenauswertung reicht.",
    bilder: [
      {
        src: "/art/orrery.jpg",
        alt: "Joseph Wright of Derby, Vortrag am Planetenmodell",
        caption: "Wissenschaft als Schauspiel: das Weltall im Modell erklärt",
        credit: "Joseph Wright of Derby, «A Philosopher Lecturing on the Orrery», um 1766 · gemeinfrei",
        hintergrund:
          "Joseph Wright of Derby malte die Szene um 1766 im England der frühen Industrialisierung. Er war der Maler der wissenschaftlichen Abende: Bürgerliche Gesellschaften trafen sich damals, um Experimente vorzuführen — Wissenschaft als öffentliches Ereignis.",
        contextNote:
          "Das Orrery zeigt die technisch-wissenschaftliche Seite des Umbruchs: In einem mechanischen Modell lässt sich der ganze Kosmos vorführen und erklären. Doch derselbe Fortschritt hatte eine erschütternde Kehrseite — mit Kopernikus und dem Teleskop verlor die Erde (und mit ihr der Mensch) den angestammten Platz im Zentrum. Kant machte aus dem Verlust ein Programm: Wenn der Mensch nicht mehr Mittelpunkt eines gottgegebenen Kosmos ist, muss er den Mut haben, mit dem eigenen Verstand Orientierung zu schaffen.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Wright of Derby, um 1766",
            text: "Eine Gruppe von Menschen drängt sich im Dunkeln um ein Orrery — ein mechanisches Tischmodell des Sonnensystems mit kreisenden Planeten. Statt Heiliger oder Herrscher zeigt das Bild gewöhnliche Zuhörer beim wissenschaftlichen Vortrag: ein neues, bürgerliches Bildthema.",
          },
          {
            x: 50,
            y: 52,
            zoom: 2.2,
            title: "Eine Lampe als Sonne",
            text: "Im Zentrum des Modells steht eine Lampe, die die Sonne darstellt; ihr warmes Licht fällt auf die andächtigen Gesichter ringsum. Wright inszeniert die Wissenschaft mit einer Ehrfurcht, die man sonst aus Bildern der Anbetung kennt — die Erkenntnis rückt an die Stelle des Heiligen.",
          },
          {
            x: 36,
            y: 44,
            zoom: 2.2,
            title: "Staunende Kinder",
            text: "Zwei Kinder beugen sich nah ans Modell, die Gesichter hell erleuchtet und voller Staunen. Sie machen das eigentliche Thema sichtbar: das Lernen selbst als erhebendes Erlebnis — die Freude, eine erklärbare Welt zu entdecken.",
          },
        ],
      },
      {
        src: "/art/lissabon.jpg",
        alt: "Die Zerstörung von Lissabon 1755",
        caption: "Das Erdbeben von Lissabon erschüttert den Glauben an einen guten Weltplan",
        credit: "«Zerstörung von Lissabon», Kupferstich, 1755 · gemeinfrei",
        hintergrund:
          "Der Kupferstich entstand noch 1755 als Flugblatt — die Katastrophe war eines der ersten europaweiten Medienereignisse. Solche Stiche verbreiteten Bild und Schrecken innert Wochen über den Kontinent; Fakten und Übertreibung mischten sich dabei.",
        contextNote:
          "Lissabon 1755 ist die Verunsicherung dieser Epoche schlechthin: An Allerheiligen zerstörten Erdbeben, Feuer und Flutwelle innerhalb von Stunden eine der reichsten Städte Europas — viele starben beim Gottesdienst. Der Glaube an einen gütigen, vernünftigen Weltplan zerbrach; ganz Europa stritt (Voltaire gegen Rousseau), wie ein guter Gott so etwas zulassen könne. Kants Ausweg war keine neue Beruhigung, sondern eine Zumutung: der Mut zum eigenen Verstand.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Kupferstich, 1755",
            text: "Ein zeitgenössisches Flugblatt zeigt Lissabon im Moment der dreifachen Katastrophe: Die Erde bebt, die Stadt brennt, aus dem Hafen türmt sich die Flutwelle. Solche Stiche verbreiteten die Nachricht in Windeseile durch Europa.",
          },
          {
            x: 50,
            y: 28,
            zoom: 2.2,
            title: "Die brennende Stadt",
            text: "Im Hintergrund stehen Kirchen und Paläste in Flammen. Weil das Beben an einem hohen Feiertag geschah, waren die Kirchen voller Menschen — gerade die Orte der Frömmigkeit wurden zu Todesfallen. Genau das machte die Katastrophe zur theologischen Zumutung.",
          },
          {
            x: 50,
            y: 66,
            zoom: 2.2,
            title: "Die Flutwelle im Hafen",
            text: "Im Vordergrund kentern Schiffe in der heranrollenden Welle. Wer dem Beben und dem Feuer entkam, den holte oft das Wasser. Das Bild bündelt die Erfahrung, dass keine menschliche Ordnung und kein Gebet vor der blinden Gewalt der Natur schützt.",
          },
        ],
      },
    ],
    technologie: {
      text: "Neue Messinstrumente ordnen die Welt. Teleskop und Mikroskop (ab ~1600) erweitern das Sichtbare nach aussen und innen; die Pendeluhr (Huygens, 1657) macht die Zeit genau messbar. Newtons «Principia» (1687) erklären Himmel und Erde mit denselben Gesetzen — die Welt erscheint als berechenbares Uhrwerk. Möglich wurden diese Instrumente durch das Schleifhandwerk der Linsen (in den Niederlanden), den Buchdruck zur raschen Verbreitung der Funde und handfeste Bedürfnisse wie die Navigation auf See; Newton selbst baute auf Kopernikus, Galilei und Kepler auf.",
      mehr: "Die genaue Uhr taktet zunehmend Arbeit, Handel und Alltag. Und die Enzyklopädie von Diderot und d'Alembert (ab 1751) bündelt das Wissen der Zeit in geordneter, allgemein zugänglicher Form — ein Leitprojekt der Aufklärung.",
      quellen: [
        { label: "Philosophiae Naturalis Principia Mathematica (Wikipedia)", url: w("Philosophiae_Naturalis_Principia_Mathematica") },
        { label: "Encyclopédie (Wikipedia)", url: w("Encyclopédie") },
      ],
    },
    verunsicherung: {
      text: "Die Autoritäten wanken: Kirche und Adel verlieren ihr Monopol auf Wahrheit und Ordnung. Besonders trifft es die fromme Bevölkerung, als am 1. November 1755 ein Erdbeben mit Feuer und Flutwelle Lissabon zerstört — mitten im Gottesdienst, am Allerheiligentag. Wie passt solches Leid zu einem gütigen Gott?",
      mehr: "Das Beben wurde zum Debattenstoff Europas. Voltaire verspottete in «Candide» den Optimismus, alles sei «die beste aller möglichen Welten»; Kant verfasste drei Abhandlungen über mögliche Ursachen und gilt damit als früher Erdbebenforscher.",
      quellen: [
        { label: "Erdbeben von Lissabon 1755 (Wikipedia)", url: w("Erdbeben_von_Lissabon_1755") },
        { label: "Candide (Wikipedia)", url: w("Candide") },
      ],
    },
    philosophie: {
      text: "Kant (1724–1804) fasst die Aufklärung in einem Satz: «Habe Mut, dich deines eigenen Verstandes zu bedienen.» Aufklärung sei der «Ausgang des Menschen aus seiner selbstverschuldeten Unmündigkeit» — verlass dich nicht auf Autoritäten, urteile selbst und trage die Verantwortung. Alltagssprachlich: «das musst du selbst entscheiden», «sei mündig».",
      mehr: "Kant verbindet dieses Selbstdenken mit strenger Vernunftprüfung (seine «Kritik der reinen Vernunft», 1781) und mit einer Ethik der Selbstgesetzgebung (kategorischer Imperativ). Gepaart mit Newtons Naturwissenschaft entsteht das moderne Selbstbild: prüfen, urteilen, verantworten.",
      quellen: [
        { label: "Beantwortung der Frage: Was ist Aufklärung? (Wikipedia)", url: w("Beantwortung_der_Frage:_Was_ist_Aufklärung%3F") },
        { label: "Immanuel Kant (Wikipedia)", url: w("Immanuel_Kant") },
      ],
    },
  },
  {
    epoche: "Industriemoderne",
    span: "~1800–1914",
    lead: "Die Dampfmaschine pflügt die Gesellschaft um: Millionen ziehen in die Fabrikstädte, Fortschritt und Elend wachsen zusammen. Innerhalb weniger Generationen verändert sich das Leben radikaler als in tausend Jahren zuvor — Arbeit, Wohnen, Zeit und Familie werden neu geordnet. Der Wohlstand wächst, und mit ihm eine neue Klasse von Lohnarbeitern, die kaum daran teilhat.",
    leadMehr:
      "Die Industrialisierung begann um 1780 in England (Textil, Kohle, Eisen) und erfasste im 19. Jahrhundert Kontinentaleuropa und die USA. Sie brachte Eisenbahn, Grossstadt und Weltmarkt — und die «soziale Frage»: Wie geht man mit Massenarmut, Kinderarbeit und Ausbeutung um? Aus dieser Zeit stammen die Gewerkschaften, die ersten Sozialgesetze und die grossen politischen Strömungen (Liberalismus, Sozialismus, Konservatismus), die das 20. Jahrhundert prägten.",
    bilder: [
      {
        src: "/art/eisenwalzwerk.jpg",
        alt: "Adolph Menzel, «Das Eisenwalzwerk»",
        caption: "Die neue Arbeitswelt der Fabrik: Hitze, Lärm, Schichtbetrieb",
        credit: "Adolph Menzel, «Das Eisenwalzwerk», 1872–75 · gemeinfrei",
        hintergrund:
          "Adolph Menzel studierte für das Gemälde 1872 wochenlang eine echte Fabrik in Königshütte (Oberschlesien) und füllte Skizzenbücher mit Details. Das Resultat gilt als erstes bedeutendes Industriegemälde der deutschen Kunst.",
        contextNote:
          "Menzels Fabrik zeigt beide Seiten des Umbruchs in einem Bild: die technische Wucht der Dampfmaschine, die glühendes Eisen und Menschenkraft zu einem einzigen Getriebe verbindet — und die soziale Verunsicherung einer Arbeit, die im Schichtbetrieb niemals stillsteht. Genau diesen Umbruch versuchte Marx zu begreifen: Die Verhältnisse, in denen diese Menschen arbeiten, sind kein Naturgesetz, sondern gemacht — und darum veränderbar.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Das erste grosse Fabrikbild",
            text: "Adolph Menzel malt 1872–1875 nach genauen Studien das Innere einer echten Fabrik. Das war neu: Als eines der ersten grossen Gemälde überhaupt nimmt es die Industriearbeit ernst — nicht Götter oder Herrscher, sondern schwitzende Arbeiter zwischen Maschinen füllen die riesige Leinwand.",
          },
          {
            x: 55,
            y: 56,
            zoom: 2.4,
            title: "Das glühende Eisen",
            text: "In der Bildmitte wird ein glühender Eisenblock unter die Walzen geschoben. Sein oranges Leuchten ist die einzige «Sonne» dieser dunklen Halle. Nicht der Mensch, sondern Material und Maschine geben hier Takt, Licht und Richtung vor.",
          },
          {
            x: 32,
            y: 54,
            zoom: 2.4,
            title: "Die Arbeiter an den Zangen",
            text: "Mit langen Zangen und vollem Körpereinsatz dirigiert eine Gruppe von Männern das glühende Eisen. Menzel zeigt keine Helden und keine Opfer, sondern hochkonzentrierte Präzisionsarbeit unter Druck — Menschen, die Teil des Maschinentakts geworden sind.",
          },
          {
            x: 82,
            y: 71,
            zoom: 2.6,
            title: "Essen hinter der Blechwand",
            text: "Rechts isst eine Arbeiterschicht hastig hinter einer notdürftigen Blechwand — mitten in der lärmenden Halle. Das Walzwerk kennt keine Ruhe: Während die einen essen, arbeiten die anderen weiter. Die neue, gnadenlose Zeitordnung der Fabrik wird sichtbar.",
          },
        ],
      },
      {
        src: "/art/london.jpg",
        alt: "Gustave Doré, Londoner Elendsquartiere an der Bahn",
        caption: "Die Kehrseite: Elendsquartiere im Schatten der Viadukte",
        credit: "Gustave Doré, «Over London – by Rail», 1872 · gemeinfrei",
        hintergrund:
          "Der Stich stammt aus «London: A Pilgrimage» (1872), einem Bildband, für den Gustave Doré vier Jahre lang die Metropole durchstreifte — von den Docks bis zu den Salons. Seine Blätter prägen das Bild des viktorianischen London bis heute.",
        contextNote:
          "Dorés Blick über die Londoner Hinterhöfe zeigt die Verunsicherung der Industriemoderne von unten: entwurzelte Massen, zusammengepfercht im Schatten der Eisenbahn. Die Technik trieb den Wandel mit ungeheurer Wucht voran, doch der Fortschritt fuhr im Wortsinn über die Köpfe der Ärmsten hinweg. Marx lieferte die Deutung: Dieses Elend ist kein Naturzustand, sondern Ergebnis gesellschaftlicher Verhältnisse — und damit gestaltbar.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Doré, 1872",
            text: "Der Blick geht über die dicht gedrängten Hinterhöfe des industriellen London, gerahmt vom Bogen eines Eisenbahnviadukts. Doré hielt das Elend und die Wucht der grössten Stadt der Welt fest — eindringlicher als jede Statistik.",
          },
          {
            x: 38,
            y: 52,
            zoom: 2.2,
            title: "Enge Hinterhöfe",
            text: "Reihe an Reihe stehen dicht gedrängte Arbeiterhäuser, dazwischen winzige Höfe mit Wäscheleinen. So sah die Wohnwirklichkeit der Arbeiterfamilien aus: eng, russgeschwärzt, ohne Privatheit. Der Stich lässt die Enge fast körperlich spüren.",
          },
          {
            x: 72,
            y: 22,
            zoom: 2.2,
            title: "Der Zug darüber",
            text: "Oben rauscht auf dem Viadukt eine Eisenbahn vorbei. Das Bild verdichtet daraus ein Sinnbild: Der Fortschritt fährt buchstäblich über die Köpfe der Ärmsten hinweg — nah genug, um ihren Alltag zu verdunkeln, und doch für sie unerreichbar.",
          },
        ],
      },
    ],
    technologie: {
      text: "Die verbesserte Dampfmaschine (James Watt, 1769) setzt erstmals Kraft frei, die nicht von Muskel, Wind oder Wasser stammt. Sie treibt Fabriken, Eisenbahnen und Dampfschiffe; der elektrische Telegraf (ab 1837) trennt die Nachricht vom Boten. Die Fabrikuhr taktet die Arbeit in Schichten. Durchgesetzt hat sich die Dampfmaschine, weil sie ein konkretes Problem löste — das Abpumpen von Wasser aus Kohlebergwerken — und weil in Grossbritannien Kohle, Eisen und Kapital aus dem Kolonialhandel reichlich vorhanden waren; sie verbesserte die ältere Newcomen-Maschine.",
      mehr: "Zum ersten Mal wirken fast alle Züge der Verunsicherung zugleich mit voller Wucht: Beschleunigung, Landflucht, Automatisierung der Arbeit, Lohnabhängigkeit — und, durch Kohle, die ersten grossflächigen Umweltschäden. Die Eisenbahn erzwingt sogar die einheitliche Uhrzeit.",
      quellen: [
        { label: "Industrielle Revolution (Wikipedia)", url: w("Industrielle_Revolution") },
        { label: "Dampfmaschine (Wikipedia)", url: w("Dampfmaschine") },
      ],
    },
    verunsicherung: {
      text: "Besonders getroffen werden Handwerker und Weber, deren Können die Maschine entwertet, und die Landbevölkerung, die in Elendsquartieren der Städte landet. Kinder arbeiten in Fabriken und Bergwerken. In England zerschlagen Weber ab 1811 die Maschinen, die sie arbeitslos machen (die «Ludditen»); 1848 entlädt sich die Spannung in einer Revolutionswelle quer durch Europa.",
      mehr: "Die schlesischen Weber erheben sich 1844 gegen Hungerlöhne — ein Aufstand, den Heinrich Heine und später Gerhart Hauptmann verarbeiten. Die soziale Frage wird zum bestimmenden Thema des 19. Jahrhunderts.",
      quellen: [
        { label: "Maschinenstürmer / Ludditen (Wikipedia)", url: w("Maschinenstürmer") },
        { label: "Weberaufstand 1844 (Wikipedia)", url: w("Weberaufstand") },
      ],
    },
    philosophie: {
      text: "Karl Marx (1818–1883) deutet den Umbruch, während er geschieht: Die gesellschaftlichen Verhältnisse seien nicht Natur oder Schicksal, sondern von Menschen gemacht — und damit veränderbar. Wirtschaft und Klassen bestimmten das Bewusstsein mit. Alltagssprachlich lebt das fort in «das ist doch menschengemacht» und im Ruf nach «gerechten Verhältnissen».",
      mehr: "Ob man Marx' Schlüssen folgt oder nicht: Der Gedanke, dass Ökonomie und Gesellschaft analysierbar und gestaltbar sind, prägt bis heute jede Reformdebatte, die Sozialpolitik und die Gewerkschaften. «Das Kapital» (1867) versucht, die Gesetze dieser neuen Wirtschaft zu fassen.",
      quellen: [
        { label: "Karl Marx (Wikipedia)", url: w("Karl_Marx") },
        { label: "Soziale Frage (Wikipedia)", url: w("Soziale_Frage") },
      ],
    },
  },
  {
    epoche: "Zeitalter der Katastrophen",
    span: "1914–1970",
    lead: "Zwei Weltkriege, Völkermord und die Atombombe zertrümmern den Fortschrittsglauben — der Mensch erlebt sich als fähig zur totalen Zerstörung. Ausgerechnet die technisch fortschrittlichsten Nationen begehen die grössten Verbrechen der Geschichte. Die Gewissheit, dass Wissenschaft und Bildung von selbst zum Guten führen, zerbricht.",
    leadMehr:
      "Der Historiker Eric Hobsbawm nannte die Jahre 1914–1991 das «kurze 20. Jahrhundert» und «Zeitalter der Extreme». In wenigen Jahrzehnten drängen sich Erster Weltkrieg, Weltwirtschaftskrise, Faschismus und Stalinismus, Zweiter Weltkrieg, Schoah und Hiroshima; danach der Kalte Krieg mit der ständigen Drohung atomarer Vernichtung. Aus dem Erschrecken über diese Abgründe entstehen die Vereinten Nationen, die Allgemeine Erklärung der Menschenrechte (1948) und der Gedanke, dass es Grenzen geben muss, die keine Macht überschreiten darf.",
    bilder: [
      {
        src: "/art/kirchner-soldat.jpg",
        alt: "Ernst Ludwig Kirchner, «Selbstbildnis als Soldat»",
        caption: "Der Künstler als Soldat, mit abgeschnittener Hand — seelisch versehrt",
        credit: "Ernst Ludwig Kirchner, «Selbstbildnis als Soldat», 1915 · gemeinfrei",
        hintergrund:
          "Ernst Ludwig Kirchner, Mitgründer der Künstlergruppe «Brücke», meldete sich 1914 freiwillig und zerbrach am Militärdienst. 1915 malte er sich als Soldat mit abgeschnittener Hand — real war die Hand unversehrt: Das Bild zeigt eine innere, keine körperliche Wunde. Die Nazis diffamierten seine Kunst 1937 als «entartet»; 1938 nahm er sich das Leben.",
        contextNote:
          "Kirchners Selbstbildnis zeigt die Verunsicherung des Katastrophenzeitalters von innen: Der industrialisierte Krieg beschädigt Menschen auch dort, wo keine Granate sie trifft. Auf diesen Verlust aller Geländer antwortet später der Existenzialismus — mit der Zumutung, trotzdem zu wählen und zu verantworten.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Kirchner, 1915",
            text: "Der Maler zeigt sich in der Uniform seines Artillerie-Regiments, Zigarette im Mund, im Atelier. Die Farben schreien, die Formen splittern — der Expressionismus malt nicht, wie es aussieht, sondern wie es sich anfühlt.",
          },
          {
            x: 78,
            y: 55,
            zoom: 2.2,
            title: "Der Armstumpf",
            text: "Die rechte Hand — die Malhand — ist abgeschnitten, der Stumpf ragt ins Bild. In Wirklichkeit war Kirchners Hand unversehrt: Der Verlust ist innerlich. Der Krieg, so das Bild, amputiert das Schöpferische am Menschen.",
          },
          {
            x: 33,
            y: 27,
            zoom: 2.2,
            title: "Das ausgehöhlte Gesicht",
            text: "Fahles Gelb, leere Augen ohne Pupillen: Kirchner malt sich als Ausgebrannten. Er hatte sich 1914 freiwillig gemeldet und zerbrach binnen Monaten am Drill — das Porträt entstand nach seiner Entlassung als «dienstuntauglich».",
          },
          {
            x: 60,
            y: 35,
            zoom: 1.9,
            title: "Der Akt im Rücken",
            text: "Hinter dem Soldaten steht ein Aktmodell — die Welt des Ateliers, der Kunst, des früheren Lebens. Sie ist noch da, aber der Maler hat ihr den Rücken zugekehrt: Zwischen Kunst und Krieg ist er nicht mehr Herr über sein Leben.",
          },
        ],
      },
      {
        src: "/art/nussbaum-judenpass.jpg",
        alt: "Felix Nussbaum, «Selbstbildnis mit Judenpass»",
        caption: "Nussbaum zeigt seinen Judenpass — kurz darauf in Auschwitz ermordet",
        credit: "Felix Nussbaum, «Selbstbildnis mit Judenpass», um 1943 · gemeinfrei",
        hintergrund:
          "Felix Nussbaum, Maler aus Osnabrück, lebte ab 1942 im Brüsseler Versteck. Um 1943 malte er sich dort mit hochgeschlagenem Kragen, Judenstern und dem Ausweis mit dem roten Stempel «JUIF-JOOD». 1944 wurde er denunziert, deportiert und in Auschwitz ermordet. Seine Bilder überlebten im Versteck — heute im Felix-Nussbaum-Haus in Osnabrück.",
        contextNote:
          "Das Selbstbildnis mit Judenpass ist das Dokument einer Verunsicherung, die keinen Vergleich hat: Einem Menschen wird per Stempel das Menschsein aberkannt. Hannah Arendts spätere Mahnung, selbst zu urteilen statt mitzulaufen, antwortet genau auf diese Erfahrung — Verwaltung und Gehorsam können zum Werkzeug des Verbrechens werden.",
        tour: [
          {
            x: 50,
            y: 55,
            zoom: 1,
            title: "Nussbaum, um 1943",
            text: "Ein Mann im Versteck: Mauerecke, kahler Baum, tiefer Himmel. Felix Nussbaum malt sich in Brüssel, wo er sich vor der Deportation verbirgt — auf engstem Raum, aber als Maler, der Zeugnis ablegt.",
          },
          {
            x: 63,
            y: 76,
            zoom: 2.4,
            title: "Der Ausweis",
            text: "Die Hand hält den belgischen Fremdenpass mit dem roten Stempel «JUIF-JOOD» (Jude). Name: Nussbaum, Felix. Ein amtliches Dokument, das einen Menschen zur Zielscheibe erklärt — der Verwaltungsakt der Verfolgung, ins Bild gehoben.",
          },
          {
            x: 33,
            y: 82,
            zoom: 2.4,
            title: "Der gelbe Stern",
            text: "Am Mantelkragen der Judenstern, den die Besatzer zu tragen zwangen. Nussbaum schlägt den Kragen hoch, halb verbergend, halb zeigend — die Zwangslage der Verfolgten: gesehen werden heisst gefasst werden.",
          },
          {
            x: 68,
            y: 27,
            zoom: 2,
            title: "Der blühende Baum",
            text: "Über der Mauer ein gekappter Baum, an dem ein Zweig blüht. Mitten im Grau ein winziges Zeichen von Leben — oder von einer Welt, die draussen einfach weitergeht. 1944 wurde Nussbaum deportiert und in Auschwitz ermordet.",
          },
        ],
      },
    ],
    technologie: {
      text: "Technik automatisiert das Töten. Im Ersten Weltkrieg schaffen Maschinengewehr, Artillerie und Giftgas die anonyme Materialschlacht mit Millionen Toten. Der Rundfunk (ab den 1920ern) wird zum Massenmedium — und zum Propaganda-Werkzeug der Diktaturen. 1945 zeigt die Atombombe, dass Menschen die Welt vernichten können. Möglich wurde diese Zerstörungskraft durch die industrielle Massenfertigung und die organisierte Wissenschaft: Der Staat der «totalen Kriege» lenkte Forschung, Fabriken und Rohstoffe auf ein einziges Ziel — die Atombombe entstand im gigantischen «Manhattan-Projekt».",
      mehr: "Dieselbe Physik, die den Atomkern erklärt, baut die Bombe; dieselben Rechenmaschinen, die den Krieg entscheiden helfen (etwa Turings «Bombe» gegen die Enigma), werden zu den ersten Computern. Fortschritt und Vernichtung stammen aus derselben Werkstatt.",
      quellen: [
        { label: "Materialschlacht (Wikipedia)", url: w("Materialschlacht") },
        { label: "Kernwaffe / Atombombe (Wikipedia)", url: w("Kernwaffe") },
      ],
    },
    verunsicherung: {
      text: "Betroffen sind zuerst die Soldaten der Materialschlachten und die von den Nationalsozialisten Verfolgten und Ermordeten — im Völkermord an den europäischen Juden (Schoah) und weiteren Gruppen. Mit der Atombombe wird die Bedrohung schliesslich universell: Erstmals kann die Menschheit sich selbst auslöschen.",
      mehr: "Kirchner malt sich 1915 als Soldat mit abgeschnittener Malhand — Sinnbild der seelischen Versehrung. Nussbaum zeigt sich um 1943 mit dem Stempel im Judenpass, kurz bevor er in Auschwitz ermordet wird: der Mensch, dem das Menschsein amtlich aberkannt wird.",
      quellen: [
        { label: "Holocaust (Wikipedia)", url: w("Holocaust") },
        { label: "Ernst Ludwig Kirchner (Wikipedia)", url: w("Ernst_Ludwig_Kirchner") },
      ],
    },
    philosophie: {
      text: "Der Existenzialismus antwortet auf den Zusammenbruch aller Geländer. Jean-Paul Sartre (1905–1980): Der Mensch sei «zur Freiheit verurteilt» — es gibt keine vorgegebene Natur und keine letzte Autorität mehr, also trägt er die volle Verantwortung für das, was er aus sich macht. Alltagssprachlich: «du hast immer eine Wahl — und musst dazu stehen».",
      mehr: "Daneben: Hannah Arendt mahnt (am Prozess gegen Eichmann) zum eigenen Urteil statt zum Mitlaufen und prägt das Wort von der «Banalität des Bösen»; Wittgenstein fordert, klar zu sagen, was sich klar sagen lässt. (Heidegger denkt die Technik als «Gestell» — bei aller Wirkung mit klarem Blick auf seine Verstrickung in den Nationalsozialismus.)",
      quellen: [
        { label: "Existentialismus (Wikipedia)", url: w("Existentialismus") },
        { label: "Hannah Arendt (Wikipedia)", url: w("Hannah_Arendt") },
      ],
    },
  },
  {
    epoche: "«Ende der Geschichte»",
    span: "1989–~2015",
    lead: "Der Kalte Krieg endet, der Markt scheint zu siegen — und im Überfluss der Möglichkeiten geht die Orientierung gerade dann verloren. Mit dem Fall der Mauer glauben viele, die grossen Konflikte seien vorbei und die liberale Demokratie habe endgültig gewonnen. Doch statt Ruhe kommen Beschleunigung, Vereinzelung und das Gefühl, in lauter Möglichkeiten den Halt zu verlieren.",
    leadMehr:
      "Der Ausdruck «Ende der Geschichte» stammt von Francis Fukuyama (1992): Nach dem Zusammenbruch des Ostblocks schien die liberale Marktdemokratie alternativlos. Es folgten Globalisierung, Internet und ein Boom des Individualismus — «Selbstverwirklichung» wurde zum Leitwert. Rückblickend war es keine Ruhephase, sondern die Startrampe der digitalen Umwälzung. Und die These vom Ende der Geschichte gilt spätestens seit den Krisen der 2010er-Jahre (Finanzkrise, Klima, neue Autoritarismen) als widerlegt.",
    bilder: [
      {
        src: "/art/mauerfall.jpg",
        alt: "Grenzöffnung am Brandenburger Tor 1989",
        caption: "Mauerfall 1989: der Osten öffnet sich, ein System verschwindet über Nacht",
        credit: "Grenzöffnung am Brandenburger Tor, 22.12.1989 · Bundesarchiv Bild 183-1989-1222-016 · CC BY-SA 3.0 de",
        hintergrund:
          "Die Aufnahme stammt vom 22. Dezember 1989 (Fotograf des DDR-Nachrichtendienstes ADN, heute Bundesarchiv): Am Brandenburger Tor hebt ein Kran ein Mauersegment heraus, um den neuen Grenzübergang zu öffnen — sechs Wochen nach der Maueröffnung vom 9. November.",
        contextNote:
          "Das Foto zeigt den Kipp-Punkt der Epoche «Ende der Geschichte»: Ein ganzes System verschwindet friedlich, fast über Nacht. Was als Triumph der Freiheit gefeiert wurde, war für viele Biografien im Osten zugleich ein Boden-Verlust — beides gehört zur Verunsicherung dieser Jahre.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "22. Dezember 1989",
            text: "Nachtaufnahme am Brandenburger Tor: Ein Kran hebt ein Segment aus der Berliner Mauer, Arbeiter und Schaulustige stehen darunter. Sechs Wochen nach dem 9. November wird hier der Übergang am Tor geöffnet — das Symbolbild des Systemwechsels.",
          },
          {
            x: 68,
            y: 42,
            zoom: 2,
            title: "Das schwebende Mauerstück",
            text: "Ein Betonsegment hängt am Haken — die «unüberwindbare» Grenze als Bauteil, das man herausheben kann. 28 Jahre teilte diese Wand die Stadt; jetzt zeigt sich: Auch sie war gemacht, nicht Schicksal.",
          },
          {
            x: 30,
            y: 48,
            zoom: 1.9,
            title: "Das Brandenburger Tor",
            text: "Dahinter die Säulen des Tors, jahrzehntelang im Sperrgebiet zwischen Ost und West. Dass ausgerechnet hier geöffnet wird, macht das Foto historisch: Das eingemauerte Wahrzeichen wird wieder Durchgang.",
          },
          {
            x: 55,
            y: 80,
            zoom: 2.1,
            title: "Die Menschen unten",
            text: "Grenzsoldaten, Arbeiter, Zuschauer — kaum zu unterscheiden, wer hier wen bewacht. Die Ordnung, die eben noch schiessen liess, baut nun selbst ab. Für Millionen beginnt eine Freiheit, die zugleich alle Sicherheiten auflöst.",
          },
        ],
      },
      {
        src: "/art/erde_nacht.jpg",
        alt: "Die Erde bei Nacht, erleuchtet von Städten",
        caption: "Eine vernetzte, elektrifizierte Welt — scheinbar grenzenlos",
        credit: "«Earth at Night» · NASA/NOAA, 2012 · gemeinfrei",
        hintergrund:
          "Das Bild ist eine Montage aus Hunderten Aufnahmen des NASA/NOAA-Satelliten Suomi NPP (2012) — so hat die Erde nie ausgesehen, denn es ist nie überall gleichzeitig Nacht. Gerade als Konstruktion zeigt es, wie die vernetzte Welt sich selbst sichtbar macht.",
        contextNote:
          "Die nächtliche Erde macht die technische Seite der Epoche in einem Bild sichtbar: eine elektrifizierte, vernetzte Welt, deren Städte und Datenströme den Planeten in Lichtadern überziehen. Zugleich zeigt sie die Kehrseite — die grellen Lichtbänder und die weiten dunklen Flächen führen die tiefe Ungleichheit dieser Vernetzung vor Augen.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Die Erde bei Nacht (NASA, 2012)",
            text: "Ein aus vielen Satellitenaufnahmen zusammengesetztes Bild der nächtlichen Erde. Jedes Lichtpünktchen steht für menschliche Besiedlung, für Strom und Energie — die Ausbreitung der Menschheit in einem einzigen Blick.",
          },
          {
            x: 50,
            y: 34,
            zoom: 2.2,
            title: "Lichtbänder des Netzes",
            text: "Grell leuchten Europa, das nördliche Indien, Ostasien und die US-Küsten. Wo Strom fliesst, ist auch das digitale Netz dicht — die hellen Adern zeichnen die Landkarte der vernetzten, industrialisierten Welt nach.",
          },
          {
            x: 55,
            y: 60,
            zoom: 2.2,
            title: "Die dunklen Flächen",
            text: "Weite Teile Afrikas, Südamerikas und Zentralasiens bleiben nahezu dunkel. Diese Schatten erzählen die andere Hälfte der Geschichte: Die Vernetzung ist höchst ungleich verteilt — das globale «Wir» umfasst längst nicht alle in gleicher Weise.",
          },
        ],
      },
    ],
    technologie: {
      text: "Der Personal Computer (ab 1981) und das World Wide Web (freigegeben 1991) bringen Rechenkraft und Information in jeden Haushalt. Der genormte Container macht globalen Warentransport billig und schnell. Zusammen vernetzen und beschleunigen sie Wirtschaft und Alltag fast grenzenlos. Durchsetzen konnten sie sich, weil die Elektronik immer kleiner und billiger wurde (vom Transistor zum Mikrochip), weil militärische Forschung das Netz vorfinanzierte (ARPANET) und weil die Normung des Containers die Kosten des Welthandels einbrechen liess.",
      mehr: "Mit dem Ende des Kalten Krieges wird der Markt zum Leitprinzip fast überall. Der Politikwissenschaftler Francis Fukuyama spricht 1992 vom «Ende der Geschichte» — die liberale Demokratie als Endpunkt. Rückblickend begann stattdessen ein neuer Umbruch: Globalisierung und Digitalisierung.",
      quellen: [
        { label: "World Wide Web (Wikipedia)", url: w("World_Wide_Web") },
        { label: "Das Ende der Geschichte (Wikipedia)", url: w("Das_Ende_der_Geschichte") },
      ],
    },
    verunsicherung: {
      text: "Besonders betroffen sind die Industriearbeiter des Westens, deren Fabriken in Billiglohnländer abwandern (Deindustrialisierung), und die Menschen des früheren Ostblocks, deren gesamtes politisches und wirtschaftliches System über Nacht verschwindet. Sicher geglaubte Biografien werden entwertet.",
      mehr: "Zugleich wächst eine paradoxe Verunsicherung: Wenn alles möglich ist und jeder «sein eigenes Ding» macht, fehlt der gemeinsame Halt. Der Soziologe Hartmut Rosa nennt die Folge soziale Beschleunigung — ein Leben, das immer schneller läuft, ohne dass mehr Zeit entsteht.",
      quellen: [
        { label: "Deindustrialisierung (Wikipedia)", url: w("Deindustrialisierung") },
        { label: "Soziale Beschleunigung (Wikipedia)", url: w("Soziale_Beschleunigung") },
      ],
    },
    philosophie: {
      text: "Die Postmoderne beschreibt diese Lage. Jean-François Lyotard erklärt 1979 das «Ende der grossen Erzählungen»: Es gibt nicht mehr die eine verbindliche Geschichte von Fortschritt oder Heil, sondern viele kleine, nebeneinander. Michel Foucault fragt zugleich, wer die Macht hat zu bestimmen, was als «normal» und «wahr» gilt.",
      mehr: "Alltagssprachlich schlägt sich das nieder in «das ist halt deine Wahrheit» und «jeder nach seiner Fasson». Der Hoch-Individualismus dieser Jahre bringt Freiheit — und die Erschöpfung des Immer-selbst-Wählen-Müssens, an deren Grenze wir heute stehen.",
      quellen: [
        { label: "Postmoderne (Wikipedia)", url: w("Postmoderne") },
        { label: "Michel Foucault (Wikipedia)", url: w("Michel_Foucault") },
      ],
    },
  },
  {
    epoche: "Jetzt: Umwelt & KI",
    span: "heute",
    lead: "Klimakrise und Künstliche Intelligenz zugleich: Der Individualismus allein trägt nicht mehr — es braucht ein neues Wir. Zum ersten Mal sind die Folgen unseres Handelns global und langfristig: Was wir heute tun, entscheidet über das Klima kommender Generationen. Und mit der KI tritt ein Gegenüber auf, das spricht und gestaltet, ohne Mensch zu sein — das zwingt zur Frage, wer eigentlich handelt und wer verantwortlich ist.",
    leadMehr:
      "Zwei Umbrüche fallen zusammen: die ökologische Krise (Klima, Artensterben, Ressourcen) und die digitale (KI, Plattformen, Daten). Beide sind planetar und von keinem Land und keinem Einzelnen allein zu lösen. Forschende sprechen vom «Anthropozän» — einem Erdzeitalter, das der Mensch selbst prägt. Die Leitfrage dieser Lernumgebung: Welche Schablone, welches «Wir» trägt uns durch eine Zeit, in der Menschen, Maschinen und Natur untrennbar verflochten sind?",
    bilder: [
      {
        src: "/art/erde_tag.jpg",
        alt: "«Blue Marble» — die Erde aus dem All",
        caption: "Der eine Planet: verletzlich, geteilt, ohne Ersatz",
        credit: "«Blue Marble» · NASA (Apollo 17), 1972 · gemeinfrei",
        hintergrund:
          "Das Foto entstand am 7. Dezember 1972 aus rund 29 000 km Entfernung, aufgenommen von der Crew von Apollo 17 — der bislang letzten bemannten Mondmission. «Blue Marble» wurde zu einem der meistreproduzierten Fotos der Geschichte und zur Ikone der Umweltbewegung.",
        contextNote:
          "Der «Blue Marble» ist das Bild vom einen, gemeinsamen «Wir»: die Erde als ein einziger, grenzenloser Planet. Genau dieses «Wir» steht heute unter doppeltem Druck — Klimakrise und eine Technik, die Wirklichkeit täuschend echt erzeugen kann. Wie sich aus lauter vernetzten Einzelnen wieder ein tragfähiges Wir bildet, ist die offene Frage, an der die Philosophie der Gegenwart arbeitet.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "«Blue Marble» (NASA, 1972)",
            text: "Aufgenommen von der Besatzung der Apollo-17-Mission auf dem Weg zum Mond: die Erde als ganze, runde Kugel. Das Bild ging um die Welt und veränderte, wie die Menschheit sich selbst und ihren Planeten sieht.",
          },
          {
            x: 50,
            y: 50,
            zoom: 1.7,
            title: "Ein Planet, keine Grenzen",
            text: "Von hier oben sind keine Nationen, keine Grenzen, keine Konflikte zu sehen — nur ein einziger, verletzlicher Planet im schwarzen All. Genau dieser Anblick machte das Bild zur Ikone der Umwelt- und Friedensbewegung.",
          },
          {
            x: 50,
            y: 44,
            zoom: 2,
            title: "Wolken, Meere, Kontinente",
            text: "Wolkenwirbel, Ozeane und Landmassen liegen in einem einzigen Blick beieinander — ein geschlossenes, zusammenhängendes System. Der «Blue Marble» wurde zum Bezugspunkt der Vorstellung eines globalen «Wir».",
          },
        ],
      },
      {
        src: "/art/wir-netz.png",
        alt: "Ein vernetztes «Wir»",
        caption: "Ein Geflecht aus Akteuren — menschlich und nicht-menschlich",
        credit: "«Suche nach Bildern» · Klaus Christ, 2024 · mit Genehmigung",
        hintergrund:
          "Die Installation «Suche nach Bildern» schuf Klaus Christ 2024: Dutzende Figuren und Objekte hängen an Fäden, die in einem alten Computer zusammenlaufen. Das Werk macht sichtbar, was an einer simplen Bildersuche alles beteiligt ist — es wird hier mit Genehmigung des Künstlers gezeigt.",
        contextNote:
          "Das Netz-Werk führt die Fäden der Gegenwart zusammen: Rechner, Kabel, Datencentren und KI, die eine simple Bildersuche möglich machen — und die Verunsicherung, dass in diesem Geflecht kaum noch zu sagen ist, wer eigentlich handelt. Anders als in früheren Epochen gibt es noch keine fertige philosophische Antwort: Die Schablone wird gerade gesucht — bei Latour, Haraway, Rosa und anderen.",
        tour: [
          {
            x: 50,
            y: 48,
            zoom: 1,
            title: "Ein Netz an der Museumswand",
            text: "«Suche nach Bildern» (2024) ist eine Installation über eine alltägliche Handlung: die Bildersuche im Internet. Dutzende Figuren und Objekte sind mit Fäden verbunden, die im Zentrum zusammenlaufen. Was mit einem Klick einfach aussieht, ist das Ergebnis eines riesigen, unsichtbaren Netzwerks.",
          },
          {
            x: 47,
            y: 42,
            zoom: 2.2,
            title: "Der Computer in der Mitte",
            text: "Im Zentrum steht ein alter Röhrenmonitor mit einer Weltkarte, darunter Tastatur und Maus — der Ort der Bildersuche selbst. Von hier laufen die Fäden nach allen Seiten.",
          },
          {
            x: 22,
            y: 26,
            zoom: 2.4,
            title: "Rohstoffe, Bergbau, Recycling",
            text: "Auf der einen Seite hängt die materielle Grundlage der digitalen Welt: Rohstoffe, Bergbau, Transport, Elektronikmüll. Jede Suche hat ein physisches Gewicht — das «Digitale» ist alles andere als körperlos.",
          },
          {
            x: 55,
            y: 14,
            zoom: 2.4,
            title: "Die Menschen im Netz",
            text: "Oben und an den Rändern hängen die Menschen: Programmiererinnen, Künstler, Kabelhersteller, Nutzerinnen. Viele Hände ziehen an denselben Fäden. Das «Wir» von heute ist keine Person, sondern ein Geflecht aus vielen, oft einander unbekannten Beteiligten.",
          },
        ],
      },
    ],
    technologie: {
      text: "Künstliche Intelligenz (mit ChatGPT ab 2022 alltäglich), das Smartphone und globale, digital gesteuerte Lieferketten laufen auf einer noch immer fossilen Infrastruktur. Die Automatisierung erreicht nun Sprache und Kopfarbeit; die Naturzerstörung erreicht mit der Klimakrise erstmals eine überlebensbedrohende Grössenordnung. Die KI setzte sich nicht wegen einer neuen Idee durch — die ist alt —, sondern weil drei Grundlagen zusammenkamen: riesige Datenmengen aus dem Internet, billige Parallel-Rechenleistung (Grafikchips) und die Transformer-Architektur von 2017, dazu enormes privates Kapital.",
      mehr: "Was als jahrtausendealte Phantasie begann — einem Ding Leben einzuhauchen —, ist heute Werkzeug und Gegenüber zugleich. Und der ökologische Fussabdruck der scheinbar «virtuellen» Technik (Rechenzentren, Chips, Strom, Wasser) ist sehr real.",
      quellen: [
        { label: "Künstliche Intelligenz (Wikipedia)", url: w("Künstliche_Intelligenz") },
        { label: "Anthropozän (Wikipedia)", url: w("Anthropozän") },
      ],
    },
    verunsicherung: {
      text: "Betroffen sind die junge Generation (ihre Klimazukunft), die Wissens- und Kreativberufe (durch KI) und der globale Süden, der die Folgen der Erwärmung am härtesten trägt. Und erstmals stehen ausdrücklich auch nicht-menschliche Akteure im Blick: Arten, Klima und Ökosysteme, die nicht mitreden können.",
      mehr: "Zum ersten Mal ist die Verunsicherung planetar: Es geht nicht mehr nur um Berufe und Weltbilder, sondern um die Lebensgrundlagen selbst. Wer trägt Verantwortung, wenn Ursache und Wirkung über den ganzen Globus und über Generationen verteilt sind?",
      quellen: [
        { label: "Klimakrise / globale Erwärmung (Wikipedia)", url: w("Globale_Erwärmung") },
        { label: "Auswirkungen der KI auf die Arbeitswelt (Wikipedia)", url: w("Künstliche_Intelligenz") },
      ],
    },
    philosophie: {
      text: "Bruno Latour (1947–2022) liefert mit der Akteur-Netzwerk-Theorie eine neue Sichtweise: Kein Akteur handelt allein; Wirkung entsteht im Geflecht von Menschen UND Dingen. Um die Krisen zu verstehen, müsse man die Abhängigkeiten ernst nehmen — auch die von dem, was nicht Mensch ist: Klima, Viren, Technik, KI.",
      mehr: "Verwandte Stimmen: Donna Haraway denkt Verbundenheit über Artgrenzen hinweg; Hartmut Rosa setzt der Beschleunigung die «Resonanz» entgegen (ein antwortendes Verhältnis zur Welt); Markus Gabriel streitet für einen «neuen Realismus» und universelle Werte. Die Schablone unserer Zeit ist noch nicht geschrieben — vielleicht schreibst du daran mit.",
      quellen: [
        { label: "Akteur-Netzwerk-Theorie (Wikipedia)", url: w("Akteur-Netzwerk-Theorie") },
        { label: "Bruno Latour (Wikipedia)", url: w("Bruno_Latour") },
      ],
    },
  },
];

export default function VerunsicherungsEpochen({ className = "" }: { className?: string }) {
  const gesamt = EPOCHEN.length * BAUSTEINE.length;
  const [offen, setOffen] = useState<Set<number>>(new Set());
  const [gelesen, setGelesen] = useState<Set<number>>(new Set());
  const [leadOffen, setLeadOffen] = useState<Set<number>>(new Set());
  const [zoom, setZoom] = useState<{ ep: number; bild: number } | null>(null);

  useEffect(() => {
    function restore() {
      const idx = leseSpurenIndices(SPUR).filter((i) => i >= 0 && i < gesamt);
      if (idx.length === 0) return;
      setGelesen((prev) => {
        const nx = new Set(prev);
        idx.forEach((i) => nx.add(i));
        return nx;
      });
    }
    restore();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [gesamt]);

  // Welche Epochen inhaltlich betreten wurden (mind. ein Baustein geöffnet) —
  // ans Orakel melden, damit die KI den inhaltlichen Weg mitdeuten kann.
  useEffect(() => {
    const eiSet = new Set<number>();
    gelesen.forEach((gi) => eiSet.add(Math.floor(gi / BAUSTEINE.length)));
    const labels = [...eiSet]
      .sort((a, b) => a - b)
      .map((ei) => EPOCHEN[ei]?.epoche)
      .filter((s): s is string => Boolean(s));
    melde(SPUR, {
      bereich: "Philosophie in Zeiten der Verunsicherung",
      flaechenGefuellt: 0,
      flaechenTotal: 0,
      labels,
    });
  }, [gelesen]);

  function toggle(gi: number) {
    setOffen((prev) => {
      const nx = new Set(prev);
      if (nx.has(gi)) nx.delete(gi);
      else nx.add(gi);
      return nx;
    });
    if (!gelesen.has(gi)) {
      setGelesen((prev) => new Set(prev).add(gi));
      merkeSpur(`${SPUR}:${gi}`);
    }
  }

  return (
    <section aria-label="Philosophie in Zeiten der Verunsicherung" className={className}>
      <div className="mb-md flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px] text-tertiary">
          {gelesen.size === gesamt ? "done_all" : "unfold_more"}
        </span>
        {gelesen.size === 0
          ? `${EPOCHEN.length} Epochen, je drei Bausteine zum Aufklappen und Bewerten`
          : `${gelesen.size} von ${gesamt} Bausteinen geöffnet`}
      </div>

      <div className="space-y-lg">
        {EPOCHEN.map((e, ei) => (
          <article
            key={ei}
            className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-bright"
          >
            {/* Kopf */}
            <div className="border-b border-outline-variant bg-surface-container-low p-md sm:p-lg">
              <p className="text-label-sm uppercase tracking-wider text-tertiary">{e.span}</p>
              <h3 className="mt-xs text-headline-sm text-on-surface">{e.epoche}</h3>
              <p className="mt-xs max-w-3xl text-body-md text-on-surface-variant">{e.lead}</p>
              <button
                type="button"
                onClick={() =>
                  setLeadOffen((prev) => {
                    const nx = new Set(prev);
                    if (nx.has(ei)) nx.delete(ei);
                    else nx.add(ei);
                    return nx;
                  })
                }
                aria-expanded={leadOffen.has(ei)}
                className="mt-sm inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:border-tertiary hover:text-tertiary"
              >
                <span className="material-symbols-outlined text-[16px] text-tertiary">
                  {leadOffen.has(ei) ? "expand_less" : "menu_book"}
                </span>
                {leadOffen.has(ei) ? "Weniger" : "Mehr wissen"}
              </button>
              {leadOffen.has(ei) && (
                <p className="animate-frame-in mt-sm max-w-3xl text-body-md leading-relaxed text-on-surface-variant">
                  <GlossarText text={e.leadMehr} />
                </p>
              )}
            </div>

            {/* Zwei Kunstwerke — anklicken öffnet den Zoom-Viewer */}
            <div className="grid gap-md p-md sm:grid-cols-2 sm:p-lg">
              {e.bilder.map((b, bi) => (
                <figure key={bi} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => setZoom({ ep: ei, bild: bi })}
                    aria-label={`${b.alt} — vergrössern und zoomen`}
                    className="group relative block w-full overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low outline-none focus-visible:ring-2 focus-visible:ring-tertiary"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={b.src}
                      alt={b.alt}
                      loading="lazy"
                      className="max-h-72 w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-inverse-surface/75 px-2 py-1 text-label-sm text-inverse-on-surface shadow-sm transition-transform group-hover:scale-105">
                      <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                      Anklicken &amp; Bildstellen entdecken
                    </span>
                  </button>
                  <figcaption className="mt-xs text-body-sm text-on-surface">
                    {b.caption}
                    <span className="mt-0.5 block text-label-sm text-on-surface-variant opacity-80">
                      {b.credit}
                    </span>
                    <InfoPunkt className="mt-xs" label="Hintergrund zum Bild">
                      <GlossarText text={b.hintergrund} />
                    </InfoPunkt>
                  </figcaption>
                </figure>
              ))}
            </div>

            {/* Drei bewertbare Bausteine */}
            <ul className="divide-y divide-outline-variant border-t border-outline-variant">
              {BAUSTEINE.map((bs, ti) => {
                const gi = ei * BAUSTEINE.length + ti;
                const auf = offen.has(gi);
                const schon = gelesen.has(gi);
                const inhalt = e[bs.key];
                return (
                  <li key={ti}>
                    <button
                      type="button"
                      onClick={() => toggle(gi)}
                      aria-expanded={auf}
                      className="flex w-full items-center gap-sm px-md py-sm text-left outline-none transition-colors hover:bg-surface-container focus-visible:bg-surface-container sm:px-lg"
                    >
                      <span
                        className={
                          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full " +
                          (schon
                            ? "bg-tertiary text-on-tertiary"
                            : "bg-tertiary-container text-on-tertiary-container")
                        }
                      >
                        <span className="material-symbols-outlined text-[17px]">{bs.icon}</span>
                      </span>
                      <span className="min-w-0 flex-1 text-body-lg font-medium text-on-surface">
                        {bs.label}
                      </span>
                      <span
                        className={
                          "material-symbols-outlined flex-shrink-0 text-[22px] text-on-surface-variant transition-transform duration-300 " +
                          (auf ? "rotate-180" : "")
                        }
                      >
                        expand_more
                      </span>
                    </button>
                    {auf && (
                      <div className="animate-frame-in px-md pb-md pl-[3.25rem] sm:px-lg sm:pl-[4rem]">
                        <p className="text-body-md leading-relaxed text-on-surface">
                          <GlossarText text={inhalt.text} />
                        </p>
                        <GewichtungWahl
                          className="mt-md"
                          stapeln
                          prefix={bs.gewPrefix}
                          index={ei}
                          frage={bs.gewFrage}
                          stufen={bs.gewStufen}
                        />
                        <KartenAktion
                          mehr={
                            <span className="block">
                              <GlossarText text={inhalt.mehr} />
                              {inhalt.quellen.length > 0 && (
                                <span className="mt-sm block text-label-sm text-on-surface-variant">
                                  Verweise:{" "}
                                  {inhalt.quellen.map((q, qi) => (
                                    <span key={qi}>
                                      {qi > 0 && " · "}
                                      <a
                                        href={q.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-tertiary underline underline-offset-2 hover:text-on-surface"
                                      >
                                        {q.label}
                                      </a>
                                    </span>
                                  ))}
                                </span>
                              )}
                            </span>
                          }
                          wunschId={`wunsch:${SPUR}:${gi}`}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>

      {zoom && (
        <BildZoom
          images={EPOCHEN[zoom.ep].bilder.map((b) => ({
            src: b.src,
            alt: b.alt,
            caption: b.caption,
            credit: b.credit,
            tour: b.tour,
            contextNote: b.contextNote,
          }))}
          startIdx={zoom.bild}
          epoch={EPOCHEN[zoom.ep].epoche}
          onClose={() => setZoom(null)}
        />
      )}
    </section>
  );
}
