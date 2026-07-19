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
import { GlossarText } from "./Glossar";
import BildZoom from "../philosophische-perspektive/_components/BildZoom";

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
    lead: "Zum ersten Mal ordnen sich Menschen nicht über Herkunft und Mythos, sondern über Bürgerrecht, Markt und Argument.",
    bilder: [
      {
        src: "/art/athens.jpg",
        alt: "Raffaels Fresko «Die Schule von Athen»",
        caption: "Die Denker der Antike, versammelt im Gespräch",
        credit: "Raffael, «Die Schule von Athen», 1509–1511 · gemeinfrei",
      },
      {
        src: "/art/sokrates.jpg",
        alt: "Jacques-Louis David, «Der Tod des Sokrates»",
        caption: "Sokrates, zum Tod verurteilt, bleibt seiner Überzeugung treu",
        credit: "Jacques-Louis David, «Der Tod des Sokrates», 1787 · gemeinfrei",
      },
    ],
    technologie: {
      text: "Zwei Erfindungen tragen den Wandel. Die griechische Alphabetschrift (ab etwa 800 v. Chr.) kommt mit rund zwei Dutzend Zeichen aus — Lesen und Schreiben sind nicht mehr Sache einer Priesterkaste. Und gemünztes Geld (in Kleinasien und Griechenland ab dem 7./6. Jahrhundert v. Chr.) macht Werte zählbar, teilbar und übertragbar, unabhängig von Person und Stand.",
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
    lead: "Rom zerfällt — und mit den Strassen, Städten und Gesetzen wankt die ganze Weltordnung.",
    bilder: [
      {
        src: "/art/rom.jpg",
        alt: "Die Plünderung Roms durch die Barbaren",
        caption: "410: Rom wird geplündert — für viele bricht die Welt zusammen",
        credit: "Joseph-Noël Sylvestre, «Die Plünderung Roms», 1890 · gemeinfrei",
      },
      {
        src: "/art/augustine.jpg",
        alt: "Der heilige Augustinus",
        caption: "Augustinus verlegt den Halt vom äusseren Reich nach innen",
        credit: "Philippe de Champaigne, «Der heilige Augustinus», um 1645 · gemeinfrei",
      },
    ],
    technologie: {
      text: "Hier verunsichert nicht neue, sondern verlorene Technik. Mit dem Weströmischen Reich (476 n. Chr.) verfallen Fernstrassen, Aquädukte, Münzwesen und die staatliche Verwaltung. Fähigkeiten wie Betonbau in römischer Qualität gehen für Jahrhunderte verloren; die Welt wird kleiner, langsamer und unsicherer.",
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
    lead: "Neue Welten, neue Medien, neues Geld: Der Mensch rückt sich selbst ins Zentrum — und verliert zugleich seine Mitte im Kosmos.",
    bilder: [
      {
        src: "/art/bruegel-babel.jpg",
        alt: "Pieter Bruegel, «Der Turmbau zu Babel»",
        caption: "Der Turmbau zu Babel: menschlicher Ehrgeiz, der ins Wanken gerät",
        credit: "Pieter Bruegel d. Ä., «Der Turmbau zu Babel», 1563 · gemeinfrei",
      },
      {
        src: "/art/holbein-gesandte.jpg",
        alt: "Hans Holbein, «Die Gesandten»",
        caption: "Reichtum und Wissenschaft — und ein verzerrter Totenkopf als Riss im Bild",
        credit: "Hans Holbein d. J., «Die Gesandten», 1533 · gemeinfrei",
      },
    ],
    technologie: {
      text: "Drei Techniken beschleunigen alles. Der Buchdruck mit beweglichen Lettern (Gutenberg, um 1450) macht Texte massenhaft und billig. Kompass und ozeantaugliche Schiffe öffnen die Seewege. Und die doppelte Buchführung (in Italien seit dem 14. Jahrhundert, systematisiert von Luca Pacioli 1494) verwandelt Handel in ein nachprüfbares Rechenwerk.",
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
    lead: "Die Naturwissenschaft entziffert den Himmel, und die Vernunft klopft bei jeder Autorität an: Warum eigentlich?",
    bilder: [
      {
        src: "/art/orrery.jpg",
        alt: "Joseph Wright of Derby, Vortrag am Planetenmodell",
        caption: "Wissenschaft als Schauspiel: das Weltall im Modell erklärt",
        credit: "Joseph Wright of Derby, «A Philosopher Lecturing on the Orrery», um 1766 · gemeinfrei",
      },
      {
        src: "/art/lissabon.jpg",
        alt: "Die Zerstörung von Lissabon 1755",
        caption: "Das Erdbeben von Lissabon erschüttert den Glauben an einen guten Weltplan",
        credit: "«Zerstörung von Lissabon», Kupferstich, 1755 · gemeinfrei",
      },
    ],
    technologie: {
      text: "Neue Messinstrumente ordnen die Welt. Teleskop und Mikroskop (ab ~1600) erweitern das Sichtbare nach aussen und innen; die Pendeluhr (Huygens, 1657) macht die Zeit genau messbar. Newtons «Principia» (1687) erklären Himmel und Erde mit denselben Gesetzen — die Welt erscheint als berechenbares Uhrwerk.",
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
    lead: "Die Dampfmaschine pflügt die Gesellschaft um: Millionen ziehen in die Fabrikstädte, Fortschritt und Elend wachsen zusammen.",
    bilder: [
      {
        src: "/art/eisenwalzwerk.jpg",
        alt: "Adolph Menzel, «Das Eisenwalzwerk»",
        caption: "Die neue Arbeitswelt der Fabrik: Hitze, Lärm, Schichtbetrieb",
        credit: "Adolph Menzel, «Das Eisenwalzwerk», 1872–75 · gemeinfrei",
      },
      {
        src: "/art/london.jpg",
        alt: "Gustave Doré, Londoner Elendsquartiere an der Bahn",
        caption: "Die Kehrseite: Elendsquartiere im Schatten der Viadukte",
        credit: "Gustave Doré, «Over London – by Rail», 1872 · gemeinfrei",
      },
    ],
    technologie: {
      text: "Die verbesserte Dampfmaschine (James Watt, 1769) setzt erstmals Kraft frei, die nicht von Muskel, Wind oder Wasser stammt. Sie treibt Fabriken, Eisenbahnen und Dampfschiffe; der elektrische Telegraf (ab 1837) trennt die Nachricht vom Boten. Die Fabrikuhr taktet die Arbeit in Schichten.",
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
    lead: "Zwei Weltkriege, Völkermord und die Atombombe zertrümmern den Fortschrittsglauben — der Mensch erlebt sich als fähig zur totalen Zerstörung.",
    bilder: [
      {
        src: "/art/kirchner-soldat.jpg",
        alt: "Ernst Ludwig Kirchner, «Selbstbildnis als Soldat»",
        caption: "Der Künstler als Soldat, mit abgeschnittener Hand — seelisch versehrt",
        credit: "Ernst Ludwig Kirchner, «Selbstbildnis als Soldat», 1915 · gemeinfrei",
      },
      {
        src: "/art/nussbaum-judenpass.jpg",
        alt: "Felix Nussbaum, «Selbstbildnis mit Judenpass»",
        caption: "Nussbaum zeigt seinen Judenpass — kurz darauf in Auschwitz ermordet",
        credit: "Felix Nussbaum, «Selbstbildnis mit Judenpass», um 1943 · gemeinfrei",
      },
    ],
    technologie: {
      text: "Technik automatisiert das Töten. Im Ersten Weltkrieg schaffen Maschinengewehr, Artillerie und Giftgas die anonyme Materialschlacht mit Millionen Toten. Der Rundfunk (ab den 1920ern) wird zum Massenmedium — und zum Propaganda-Werkzeug der Diktaturen. 1945 zeigt die Atombombe, dass Menschen die Welt vernichten können.",
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
    lead: "Der Kalte Krieg endet, der Markt scheint zu siegen — und im Überfluss der Möglichkeiten geht die Orientierung gerade dann verloren.",
    bilder: [
      {
        src: "/art/mauerfall.jpg",
        alt: "Grenzöffnung am Brandenburger Tor 1989",
        caption: "Mauerfall 1989: der Osten öffnet sich, ein System verschwindet über Nacht",
        credit: "Grenzöffnung am Brandenburger Tor, 22.12.1989 · Bundesarchiv Bild 183-1989-1222-016 · CC BY-SA 3.0 de",
      },
      {
        src: "/art/erde_nacht.jpg",
        alt: "Die Erde bei Nacht, erleuchtet von Städten",
        caption: "Eine vernetzte, elektrifizierte Welt — scheinbar grenzenlos",
        credit: "«Earth at Night» · NASA/NOAA, 2012 · gemeinfrei",
      },
    ],
    technologie: {
      text: "Der Personal Computer (ab 1981) und das World Wide Web (freigegeben 1991) bringen Rechenkraft und Information in jeden Haushalt. Der genormte Container macht globalen Warentransport billig und schnell. Zusammen vernetzen und beschleunigen sie Wirtschaft und Alltag fast grenzenlos.",
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
    lead: "Klimakrise und Künstliche Intelligenz zugleich: Der Individualismus allein trägt nicht mehr — es braucht ein neues Wir.",
    bilder: [
      {
        src: "/art/erde_tag.jpg",
        alt: "«Blue Marble» — die Erde aus dem All",
        caption: "Der eine Planet: verletzlich, geteilt, ohne Ersatz",
        credit: "«Blue Marble» · NASA (Apollo 17), 1972 · gemeinfrei",
      },
      {
        src: "/art/wir-netz.png",
        alt: "Ein vernetztes «Wir»",
        caption: "Ein Geflecht aus Akteuren — menschlich und nicht-menschlich",
        credit: "«Suche nach Bildern» · Klaus Christ, 2024 · mit Genehmigung",
      },
    ],
    technologie: {
      text: "Künstliche Intelligenz (mit ChatGPT ab 2022 alltäglich), das Smartphone und globale, digital gesteuerte Lieferketten laufen auf einer noch immer fossilen Infrastruktur. Die Automatisierung erreicht nun Sprache und Kopfarbeit; die Naturzerstörung erreicht mit der Klimakrise erstmals eine überlebensbedrohende Grössenordnung.",
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
                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-inverse-surface/70 px-2 py-0.5 text-label-sm text-inverse-on-surface opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      <span className="material-symbols-outlined text-[15px]">zoom_in</span>
                      zoomen
                    </span>
                  </button>
                  <figcaption className="mt-xs text-body-sm text-on-surface">
                    {b.caption}
                    <span className="mt-0.5 block text-label-sm text-on-surface-variant opacity-80">
                      {b.credit}
                    </span>
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
          }))}
          startIdx={zoom.bild}
          epoch={EPOCHEN[zoom.ep].epoche}
          onClose={() => setZoom(null)}
        />
      )}
    </section>
  );
}
