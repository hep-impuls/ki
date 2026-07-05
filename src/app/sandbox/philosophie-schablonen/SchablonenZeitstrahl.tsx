"use client";

import { useState } from "react";
import BildZoom, { type TourStop } from "./BildZoom";

/**
 * Schablonen-Zeitstrahl — Visualisierung für das Submodul "Philosophische
 * Perspektive" (Lernseite 2).
 *
 * Lernlogik: Jede Epoche ist ein eigenständiges Panel («ein Strang»):
 *   - Bildergalerie der Zeit (≥3 gemeinfreie Werke), nur für diese Epoche
 *     durchblätterbar (Vollbild mit ‹/›, Pfeiltasten, Zähler, Nachweis).
 *   - Drei nüchtern betitelte, EINZELN aufklappbare Bausteine — jeder mit
 *     erweitertem Text und geprüften, öffentlich zugänglichen Quellen:
 *       1. Technische Errungenschaft
 *       2. Verunsicherung
 *       3. Philosophische Orientierungshilfe
 * Die drei sind aufeinander bezogen, stehen aber auch je für sich — kein
 * erzwungener Kausal-Zusammenhang.
 *
 * Quellen: alle URLs wurden am 2026-07-05 auf HTTP 200 / öffentliche
 * Zugänglichkeit geprüft (SEP, IEP, Wikipedia, Wikisource, arXiv, CERN, RMG,
 * Britannica, New Advent, marxists.org).
 *
 * Bilder: lokal unter /public/art (Nachweis in public/art/CREDITS.md).
 *
 * Self-contained Client-Komponente, keine Firebase-/Server-Logik.
 */

interface GalleryImg {
  src: string;
  alt: string;
  credit: string;
  caption: string;
  /** Optionale «Führung» durchs Bild (Koordinaten in %, von Hand justierbar). */
  tour?: TourStop[];
}

interface TechEvent {
  year: string;
  title: string;
  note: string;
  icon: string;
}

interface Source {
  label: string;
  url: string;
}

interface Station {
  id: string;
  epoch: string;
  span: string;
  lead: string;
  icon: string;
  gallery: GalleryImg[];
  techText: string;
  tech: TechEvent[];
  techSources: Source[];
  unrestLead: string;
  unrest: string;
  unrestSources: Source[];
  thinker: string;
  schablone: string;
  quote?: string;
  orientation: string;
  orientSources: Source[];
  open?: boolean;
}

const STATIONS: Station[] = [
  {
    id: "antike",
    epoch: "Antike",
    span: "5. Jh. v. Chr. – Spätantike",
    lead: "Vom Mythos zum Wissen.",
    icon: "account_balance",
    gallery: [
      {
        src: "/art/athens.jpg",
        alt: "Fresko „Die Schule von Athen“ von Raffael",
        credit: "Raffael, „Die Schule von Athen“, 1509–1511 · gemeinfrei",
        caption:
          "Platon zeigt nach oben in die Welt der Ideen, Aristoteles die Hand flach zur Erde: Wissen beginnt im genauen Hinsehen.",
        tour: [
          {
            x: 50,
            y: 45,
            zoom: 1,
            title: "Die versammelte Philosophie",
            text: "Raffael malt 1509–1511 im Vatikan eine ideale Halle, in der sich die griechischen Denker aller Zeiten begegnen — kein realer Ort, sondern ein Bild des Denkens selbst.",
          },
          {
            x: 50,
            y: 42,
            zoom: 2.6,
            title: "Platon und Aristoteles",
            text: "Im Zentrum der Grundkonflikt der Erkenntnis in einer Geste: Platon zeigt nach oben in die Welt der Ideen — Aristoteles hält die Hand flach zur Erde, zum Beobachtbaren. Genau hier beginnt die Schablone der Empirie.",
          },
          {
            x: 37,
            y: 40,
            zoom: 2.8,
            title: "Sokrates im Gespräch",
            text: "Links im grünen Gewand: Sokrates, an den Fingern seine Argumente abzählend — das Frage-und-Antwort-Spiel, das Athen so provozierte, dass es ihn zum Tod verurteilte.",
          },
          {
            x: 21,
            y: 64,
            zoom: 2.8,
            title: "Pythagoras",
            text: "Vorne links schreibt Pythagoras, umringt von Schülern — ihm wird eine Harmonie-Tafel vorgehalten: die Idee, dass Zahl und Proportion die Welt ordnen.",
          },
          {
            x: 71,
            y: 71,
            zoom: 2.8,
            title: "Euklid an der Tafel",
            text: "Rechts beugt sich Euklid mit dem Zirkel über eine Tafel und führt einen Beweis vor — Raffael gab ihm die Züge des Baumeisters Bramante. Geometrie als lehrbares, prüfbares Wissen.",
          },
          {
            x: 84,
            y: 62,
            zoom: 2.6,
            title: "Der Blick in den Kosmos — und aus dem Bild",
            text: "Ptolemäus hält den Erdglobus, ihm gegenüber die Himmelskugel. Und ganz am Rand blickt ein junger Mann direkt zu uns heraus: Raffael selbst — der Maler stellt sich unter die Denker.",
          },
        ],
      },
      {
        src: "/art/aristoteles_rembrandt.jpg",
        alt: "Gemälde „Aristoteles mit einer Büste Homers“ von Rembrandt",
        credit:
          "Rembrandt, „Aristoteles mit einer Büste Homers“, 1653 · gemeinfrei",
        caption:
          "Der Philosoph, die Hand auf dem Kopf des Dichters: Denken im Zwiegespräch mit der Überlieferung.",
      },
      {
        src: "/art/sokrates.jpg",
        alt: "Gemälde „Der Tod des Sokrates“ von Jacques-Louis David",
        credit: "J.-L. David, „Der Tod des Sokrates“, 1787 · gemeinfrei",
        caption:
          "Athen verurteilt den unbequemen Frager zum Tod — das Denken selbst wird gefährlich.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Die letzte Stunde",
            text: "399 v. Chr., eine Zelle in Athen: David malt 1787 den Moment, bevor Sokrates das Gift trinkt — und macht daraus ein Lehrstück über Haltung.",
          },
          {
            x: 62,
            y: 32,
            zoom: 2.6,
            title: "Der Finger nach oben",
            text: "Noch im Sterben unterrichtet Sokrates: Der erhobene Finger verweist auf das, was grösser ist als der Tod — das Argument, die Wahrheit, die Ideen.",
          },
          {
            x: 47,
            y: 47,
            zoom: 2.8,
            title: "Der Becher",
            text: "Beiläufig, ohne hinzusehen, greift Sokrates nach dem Schierlingsbecher — der Vollstrecker im roten Gewand wendet sich ab, er kann nicht hinschauen.",
          },
          {
            x: 18,
            y: 56,
            zoom: 2.6,
            title: "Platon am Fussende",
            text: "Gefasst, nach innen gekehrt, sitzt am Fussende der gealterte Platon — historisch war er nicht dabei. David setzt ihn dazu: Er ist es, der das Gespräch aufschreiben und weitertragen wird.",
          },
          {
            x: 82,
            y: 50,
            zoom: 2.5,
            title: "Die Verzweiflung der Schüler",
            text: "Rechts zerbrechen die Schüler fast an ihrer Trauer. Der Kontrast zur Ruhe des Sokrates ist Davids Botschaft: Vernunft und Haltung gegen die Verzweiflung.",
          },
        ],
      },
    ],
    techText:
      "In der Antike wird aus dem Staunen ein Verfahren. Handwerker und Astronomen bauen Instrumente, die den Lauf der Gestirne nicht nur deuten, sondern berechnen — und arabische Gelehrte machen daraus Jahrhunderte später eine prüfbare Methode.",
    tech: [
      {
        year: "~150–100 v. Chr.",
        title: "Antikythera-Mechanismus",
        note: "Ein bronzenes Zahnrad-Getriebe, das Sonnen- und Mondstände sowie Finsternisse vorausberechnet — der älteste bekannte „Analogcomputer“. Der Himmel wird berechenbar.",
        icon: "settings",
      },
      {
        year: "um 1011–1021",
        title: "Buch der Optik (Ibn al-Haytham)",
        note: "Mit der Camera obscura prüft al-Haytham das Sehen im Experiment (Beobachtung → Hypothese → Versuch). Ein früher Kern der empirischen Methode — lange vor Newton.",
        icon: "visibility",
      },
    ],
    techSources: [
      {
        label: "Antikythera-Mechanismus (Wikipedia)",
        url: "https://en.wikipedia.org/wiki/Antikythera_mechanism",
      },
      {
        label: "Book of Optics (Wikipedia)",
        url: "https://en.wikipedia.org/wiki/Book_of_Optics",
      },
    ],
    unrestLead: "Der Logos entzaubert den Mythos.",
    unrest:
      "Im Athen des 5. Jahrhunderts v. Chr. verliert der Mythos seine bindende Kraft. Wandernde Lehrer — die Sophisten — bringen gegen Bezahlung bei, wie man jede Position überzeugend vertritt; Wahrheit droht zur Sache der Rhetorik zu werden. Als Sokrates die Bürger mit hartnäckigem Fragen bloßstellt, verurteilt ihn die Stadt 399 v. Chr. wegen „Gottlosigkeit“ und „Verderb der Jugend“ zum Tod. Das Denken selbst wird als Bedrohung erlebt.",
    unrestSources: [
      {
        label: "Die Sophisten (Stanford Encyclopedia)",
        url: "https://plato.stanford.edu/entries/sophists/",
      },
      {
        label: "Sokrates (Stanford Encyclopedia)",
        url: "https://plato.stanford.edu/entries/socrates/",
      },
    ],
    thinker: "Aristoteles",
    schablone: "Beobachten, ordnen, begründen",
    quote: "„Alle Menschen streben von Natur aus nach Wissen.“",
    orientation:
      "Aristoteles (384–322 v. Chr.) antwortet mit einer beispiellosen Ordnungsleistung: Er gliedert die Wissenschaften (Logik, Physik, Biologie, Ethik, Politik, Metaphysik), entwickelt mit der Logik ein Werkzeug des gültigen Schließens und gründet Wissen auf Beobachtung und Ursachenanalyse. Nicht fertige Wahrheiten, sondern eine Methode: beobachten, ordnen, begründen — die Schablone, auf der die europäische Wissenschaft aufbaut.",
    orientSources: [
      {
        label: "Aristoteles (Stanford Encyclopedia)",
        url: "https://plato.stanford.edu/entries/aristotle/",
      },
      {
        label: "Aristotle (Internet Encyclopedia of Philosophy)",
        url: "https://iep.utm.edu/aristotle/",
      },
    ],
  },
  {
    id: "augustinus",
    epoch: "Spätantike → Mittelalter",
    span: "5.–15. Jahrhundert",
    lead: "Eine Weltordnung zerbricht — und wird neu.",
    icon: "church",
    gallery: [
      {
        src: "/art/augustine.jpg",
        alt: "Gemälde „Der heilige Augustinus“ von Philippe de Champaigne",
        credit:
          "Ph. de Champaigne, „Der heilige Augustinus“, um 1645 · gemeinfrei",
        caption:
          "Ein Lichtstrahl der Wahrheit trifft das brennende Herz: Der Blick wendet sich nach innen — zu Glaube und Gewissen.",
      },
      {
        src: "/art/mittelalter_stundenbuch.jpg",
        alt: "Buchmalerei „Oktober“ aus den Très Riches Heures des Duc de Berry",
        credit:
          "Brüder Limburg, „Très Riches Heures“ (Oktober), um 1416 · gemeinfrei",
        caption:
          "Die mittelalterliche Ordnung: Burg, Feldarbeit und Kalender — das Leben im Kreis von Jahreszeit und Glaube.",
      },
      {
        src: "/art/rom.jpg",
        alt: "Gemälde „Die Plünderung Roms durch die Barbaren im Jahr 410“ von Joseph-Noël Sylvestre",
        credit:
          "J.-N. Sylvestre, „Die Plünderung Roms durch die Barbaren“, 1890 · gemeinfrei",
        caption:
          "410 stürzen die Statuen: Mit dem Fall Roms fällt die Gewissheit einer ganzen Weltordnung.",
      },
    ],
    techText:
      "Im Mittelalter gibt ein Ding der Zeit eine neue Ordnung: die mechanische Uhr. Zuerst regelt sie in den Klöstern die Gebetszeiten, dann schlägt sie von den Stadttürmen für alle — Alltag, Arbeit und Handel richten sich fortan nicht mehr nach Sonne und Gefühl, sondern nach abstrakten, gleichen Stunden.",
    tech: [
      {
        year: "13.–14. Jh.",
        title: "Die mechanische Uhr",
        note: "Die früheste Räderuhr entsteht in klösterlichem Umfeld und wandert auf die Stadttürme. Sie zerlegt den Tag in gleiche Stunden und diszipliniert Gebet, Arbeit und Handel — der Beginn der getakteten Gesellschaft.",
        icon: "schedule",
      },
    ],
    techSources: [
      {
        label: "Geschichte der Zeitmessung (Wikipedia)",
        url: "https://en.wikipedia.org/wiki/History_of_timekeeping_devices",
      },
    ],
    unrestLead: "Rom fällt — wem gehört die Zukunft?",
    unrest:
      "Am 24. August 410 plündern Alarichs Westgoten Rom — zum ersten Mal seit rund 800 Jahren fällt die Stadt an einen äußeren Feind. Der Schock hallt durch das ganze Reich: Für viele bricht mit Rom die Weltordnung selbst zusammen. Heiden machen den neuen christlichen Glauben verantwortlich — man habe die alten Götter verlassen; Christen ringen mit der Frage, warum Gott seine Stadt nicht geschützt habe.",
    unrestSources: [
      {
        label: "Plünderung Roms 410 (Wikipedia)",
        url: "https://en.wikipedia.org/wiki/Sack_of_Rome_(410)",
      },
    ],
    thinker: "Augustinus",
    schablone: "Innerlichkeit, Glaube, Heilsgeschichte",
    quote: "„Im inneren Menschen wohnt die Wahrheit.“",
    orientation:
      "Augustinus (354–430) antwortet mit „De civitate Dei“ (Vom Gottesstaat, 413–426): Er unterscheidet den vergänglichen „Staat der Menschen“ vom „Staat Gottes“. Nicht das irdische Reich trägt, sondern der Glaube und das Innere des Menschen — „im inneren Menschen wohnt die Wahrheit“. Diese Schablone wendet den Blick von der äußeren Ordnung nach innen (Gewissen, Heilsgeschichte) und gibt einem ganzen Zeitalter Halt.",
    orientSources: [
      {
        label: "Augustinus (Stanford Encyclopedia)",
        url: "https://plato.stanford.edu/entries/augustine/",
      },
      {
        label: "De civitate Dei / City of God (New Advent)",
        url: "https://www.newadvent.org/fathers/1201.htm",
      },
    ],
  },
  {
    id: "kant",
    epoch: "Frühe Neuzeit → Aufklärung",
    span: "16.–18. Jahrhundert",
    lead: "Der Mensch verliert die Mitte — und wird mündig.",
    icon: "lightbulb",
    gallery: [
      {
        src: "/art/wanderer.jpg",
        alt: "Gemälde „Der Wanderer über dem Nebelmeer“ von Caspar David Friedrich",
        credit:
          "C. D. Friedrich, „Der Wanderer über dem Nebelmeer“, 1818 · gemeinfrei",
        caption:
          "Ein Einzelner deutet die Welt selbst — das mündige Individuum. Friedrich malt es Jahrzehnte nach Kant.",
      },
      {
        src: "/art/orrery.jpg",
        alt: "Gemälde „A Philosopher Lecturing on the Orrery“ von Joseph Wright of Derby",
        credit:
          "J. Wright of Derby, „A Philosopher … on the Orrery“, um 1766 · gemeinfrei",
        caption:
          "Im Kerzenlicht staunt eine Runde über das Modell des Sonnensystems: Wissenschaft wird zum neuen Zentrum.",
      },
      {
        src: "/art/lissabon.jpg",
        alt: "Kupferstich der Zerstörung Lissabons durch Erdbeben, Feuer und Flutwelle 1755",
        credit: "Kupferstich „Destruction de Lisbonne“, 1755 · gemeinfrei",
        caption:
          "1755 zertrümmert das Erdbeben von Lissabon den Glauben an eine gütige Ordnung der Welt.",
      },
    ],
    techText:
      "Zwischen dem 15. und 18. Jahrhundert häufen sich die Umwälzungen: Der Buchdruck vervielfältigt Wissen, das Teleskop rückt den Kosmos zurecht, präzise Uhren vermessen die Erde. Beobachtung, Rechnung und Maschine verändern, was Menschen wissen können — und wie schnell sich das Wissen verbreitet.",
    tech: [
      {
        year: "um 1440",
        title: "Gutenbergs Druckpresse",
        note: "Bewegliche Lettern erlauben ~3 600 Seiten am Tag statt einer Handvoll. Wissen, Bibeln und Streitschriften erreichen erstmals die Masse — Voraussetzung für Reformation und wissenschaftliche Revolution.",
        icon: "print",
      },
      {
        year: "1543 → 1609 → 1687",
        title: "Kopernikanische Wende",
        note: "Kopernikus stellt die Sonne ins Zentrum, Galileos Teleskop liefert 1609/10 den sichtbaren Beweis, Newton (1687) das Gesetz. Die Erde ist nicht mehr Mittelpunkt.",
        icon: "star",
      },
      {
        year: "1761",
        title: "Navigation & Chronometer",
        note: "John Harrisons Schiffsuhr H4 hält die Zeit auf See exakt mit und löst das Längengrad-Problem — die Welt wird vermessen und global.",
        icon: "explore",
      },
    ],
    techSources: [
      {
        label: "Druckpresse (Wikipedia)",
        url: "https://en.wikipedia.org/wiki/Printing_press",
      },
      {
        label: "Kopernikanische Wende (Wikipedia)",
        url: "https://en.wikipedia.org/wiki/Copernican_Revolution",
      },
      {
        label: "Harrison & das Längengrad-Problem (Royal Museums Greenwich)",
        url: "https://www.rmg.co.uk/stories/topics/harrisons-clocks-longitude-problem",
      },
    ],
    unrestLead: "Glaubensspaltung, Kopernikus, Lissabon.",
    unrest:
      "Die Erschütterungen kommen von allen Seiten: Der Buchdruck trägt Luthers Thesen in die Welt, die Christenheit spaltet sich, Religionskriege verwüsten Europa. Kopernikus und Galileo nehmen der Erde — und damit dem Menschen — die Mitte des Kosmos; Pascal notiert erschrocken über „das ewige Schweigen dieser unendlichen Räume“. Und am 1. November 1755 zerstört ein Erdbeben mit Feuer und Flutwelle Lissabon und tötet Zehntausende — der Streit um einen gütigen Weltplan (Voltaire, Rousseau) bricht offen aus.",
    unrestSources: [
      {
        label: "Erdbeben von Lissabon 1755 (Wikipedia)",
        url: "https://en.wikipedia.org/wiki/1755_Lisbon_earthquake",
      },
    ],
    thinker: "Kant",
    schablone: "Autonomie und Selbstdenken",
    quote:
      "„Sapere aude! Habe Mut, dich deines eigenen Verstandes zu bedienen.“",
    orientation:
      "Kant (1724–1804) bündelt die Antwort der Aufklärung in einer Formel: „Aufklärung ist der Ausgang des Menschen aus seiner selbstverschuldeten Unmündigkeit“ (Beantwortung der Frage: Was ist Aufklärung?, 1784). Wenn weder Kirche noch überlieferte Autorität sicheren Halt geben, muss der Mensch selbst denken, urteilen — und Verantwortung tragen. Kants Schablone ist das autonome, mündige Individuum, das der Moderne ihr Selbstbild gibt.",
    orientSources: [
      {
        label: "Immanuel Kant (Stanford Encyclopedia)",
        url: "https://plato.stanford.edu/entries/kant/",
      },
      {
        label: "„Was ist Aufklärung?“ — Volltext (Wikisource)",
        url: "https://de.wikisource.org/wiki/Beantwortung_der_Frage:_Was_ist_Aufkl%C3%A4rung%3F",
      },
    ],
  },
  {
    id: "marx",
    epoch: "Industriemoderne",
    span: "19. Jahrhundert",
    lead: "Die Maschine ordnet die Gesellschaft neu.",
    icon: "factory",
    gallery: [
      {
        src: "/art/eisenwalzwerk.jpg",
        alt: "Gemälde „Das Eisenwalzwerk (Moderne Cyklopen)“ von Adolph Menzel",
        credit: "A. Menzel, „Das Eisenwalzwerk“, 1872–1875 · gemeinfrei",
        caption:
          "Glühendes Eisen, Räder, Riemen — und Menschen im Takt der Maschine. Die Arbeit steht nie still.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Das erste grosse Fabrikbild",
            text: "Adolph Menzel malt 1872–1875 nach Studien in einem oberschlesischen Walzwerk das Innere einer Fabrik — als eines der ersten grossen Gemälde überhaupt nimmt es Industriearbeit ernst.",
          },
          {
            x: 55,
            y: 56,
            zoom: 2.4,
            title: "Das glühende Eisen",
            text: "In der Bildmitte wird der glühende Block unter die Walzen geschoben. Sein Licht ist die einzige Sonne dieser Halle — die Maschine gibt Takt, Licht und Richtung vor.",
          },
          {
            x: 32,
            y: 54,
            zoom: 2.4,
            title: "Die Arbeiter an den Zangen",
            text: "Mit langen Zangen und ganzem Körpereinsatz dirigieren die Arbeiter das Eisen. Hitze, Lärm und Gefahr sind fast körperlich spürbar — Präzisionsarbeit unter Druck.",
          },
          {
            x: 82,
            y: 71,
            zoom: 2.6,
            title: "Essen hinter der Blechwand",
            text: "Rechts isst eine Schicht hastig hinter einem Blech — mitten in der Halle, denn das Walzwerk kennt keine Pause. Menzel zeigt die neue Zeitordnung der Fabrik.",
          },
          {
            x: 37,
            y: 33,
            zoom: 2.2,
            title: "Das Räderwerk im Hintergrund",
            text: "Hinter allem: Schwungräder, Wellen, Transmissionsriemen — die Dampfkraft. Der eigentliche Herrscher der Halle ist nicht der Meister, sondern die Maschine.",
          },
        ],
      },
      {
        src: "/art/coalbrookdale.jpg",
        alt: "Gemälde „Coalbrookdale bei Nacht“ von Philippe-Jacques de Loutherbourg",
        credit:
          "P.-J. de Loutherbourg, „Coalbrookdale bei Nacht“, 1801 · gemeinfrei",
        caption:
          "Die Hochöfen färben den Nachthimmel feurig: das erhabene, unheimliche Gesicht der frühen Industrie.",
      },
      {
        src: "/art/london.jpg",
        alt: "Stich „Over London – by Rail“ von Gustave Doré",
        credit: "G. Doré, „Over London – by Rail“, 1872 · gemeinfrei",
        caption:
          "Enge Hinterhöfe im Schatten des Bahnviadukts: die Kehrseite des Fortschritts.",
      },
    ],
    techText:
      "Das 19. Jahrhundert wird von Maschinen umgepflügt: Die Dampfmaschine treibt Fabriken und Eisenbahnen, Elektrizität und Verstärker-Röhre eröffnen ein neues Zeitalter von Energie und Kommunikation, Telegraf und Seekabel verbinden erstmals die Kontinente in Minuten.",
    tech: [
      {
        year: "1712 / 1769",
        title: "Die Dampfmaschine",
        note: "Newcomen pumpt Bergwerke leer, Watts verbesserte Maschine (1769) macht die Fabrik überall möglich — Industrialisierung, Eisenbahn, Urbanisierung.",
        icon: "local_fire_department",
      },
      {
        year: "1831–1906",
        title: "Elektrizität & Elektronik",
        note: "Faraday (Induktion 1831), Edison und Tesla elektrifizieren die Welt; De Forests Verstärker-Röhre (1906) eröffnet Radio und Ferntelefonie.",
        icon: "bolt",
      },
      {
        year: "1844 / 1866",
        title: "Telegraf & Seekabel",
        note: "Morse sendet 1844 die erste Ferndepesche; 1866 verbindet ein dauerhaftes Atlantik-Kabel die Kontinente. Bis heute laufen rund 99 % des Internets durch Kabel im Meer.",
        icon: "cable",
      },
    ],
    techSources: [
      {
        label: "Watt-Dampfmaschine (Britannica)",
        url: "https://www.britannica.com/technology/steam-engine",
      },
      {
        label: "Transatlantisches Telegrafenkabel (Wikipedia)",
        url: "https://en.wikipedia.org/wiki/Transatlantic_telegraph_cable",
      },
    ],
    unrestLead: "Fabrik, Elend, Revolution 1848.",
    unrest:
      "Die Industrialisierung reisst die alte Gesellschaft auseinander: Millionen ziehen vom Land in die Städte, arbeiten 14 Stunden am Tag, Kinder in Fabriken und Bergwerken; Elendsquartiere wachsen im Schatten der Viadukte. Ständische Sicherheiten sowie Dorf- und Familienordnungen lösen sich auf. 1848 entlädt sich die Spannung in einer Welle von Revolutionen quer durch Europa.",
    unrestSources: [
      {
        label: "Revolutionen von 1848 (Wikipedia)",
        url: "https://en.wikipedia.org/wiki/Revolutions_of_1848",
      },
    ],
    thinker: "Marx",
    schablone: "Den Umbruch begreifen — und gestalten",
    quote: "„Alles Ständische und Stehende verdampft.“",
    orientation:
      "Marx (1818–1883) begreift den Umbruch, während er geschieht: Im „Manifest der Kommunistischen Partei“ (1848, mit Friedrich Engels) beschreibt er, wie der Kapitalismus „alles Ständische und Stehende verdampfen“ lässt — und zieht daraus den Schluss, dass gesellschaftliche Verhältnisse nicht Natur oder Schicksal sind, sondern gemacht und darum veränderbar. Weltweite Wirkung entfaltet diese Antwort erst Jahrzehnte später.",
    orientSources: [
      {
        label: "Karl Marx (Stanford Encyclopedia)",
        url: "https://plato.stanford.edu/entries/marx/",
      },
      {
        label: "Manifest der Kommunistischen Partei — Volltext (marxists.org)",
        url: "https://www.marxists.org/archive/marx/works/1848/communist-manifesto/",
      },
    ],
  },
  {
    id: "jetzt",
    epoch: "Digitale Transformation",
    span: "Gegenwart",
    lead: "Alles wird vernetzt — KI tritt auf.",
    icon: "hub",
    gallery: [
      {
        src: "/art/wir-netz.png",
        alt: "Installation „Suche nach Bildern“ von Klaus Christ: ein Netz aus Fäden verbindet Figuren und Objekte rund um einen alten Computer.",
        credit: "Klaus Christ, „Suche nach Bildern“, 2024",
        caption:
          "Das „Wir“ von heute: kein Einzelner, sondern ein Netz aus Menschen und Dingen — Rohstoffe, Datacenter, Nutzer:innen, alle an denselben Fäden.",
        tour: [
          {
            x: 50,
            y: 48,
            zoom: 1,
            title: "Ein Netz an der Museumswand",
            text: "«Wir – Netz und Praxis» (2024): eine Installation über eine ganz alltägliche Handlung — die Suche nach Bildern im Internet. Was einfach aussieht, hängt an unzähligen Fäden.",
          },
          {
            x: 47,
            y: 42,
            zoom: 2.2,
            title: "Der Computer in der Mitte",
            text: "Im Zentrum ein alter Monitor mit Weltkarte, darunter Tastatur und Maus: die Bildersuche. Von hier laufen die Fäden zu allem, was sie möglich macht.",
          },
          {
            x: 22,
            y: 26,
            zoom: 2.4,
            title: "Rohstoffe, Bergbau, Recycling",
            text: "Links die materielle Seite der digitalen Welt: Rohstoffe, Bergbau, Transport, Recycling, Elektronikmüll. Jede Suche hat ein Gewicht — Geräte, Minen, Abfall.",
          },
          {
            x: 80,
            y: 30,
            zoom: 2.4,
            title: "Netz-Infrastruktur",
            text: "Rechts die unsichtbare Technik: Netzwerkinfrastruktur, Kabel, Datencentren, Satelliten. Ohne sie kein Bild — sie sind die stillen Mit-Akteure jeder Suche.",
          },
          {
            x: 55,
            y: 14,
            zoom: 2.4,
            title: "Die Menschen im Netz",
            text: "Oben und an den Seiten die Menschen: Programmier:innen, Künstler:innen, Kabelhersteller, Arbeiter:innen, KI-Expert:innen, Nutzer:innen — viele Hände an denselben Fäden.",
          },
          {
            x: 88,
            y: 55,
            zoom: 2.6,
            title: "Das Museumsetikett",
            text: "Das Label erklärt das Werk: Eine Bildersuche erscheint einfach — doch sie ist das Ergebnis eines komplexen Netzwerks. Genau das ist die Frage des Moduls: Wer handelt hier eigentlich alles mit?",
          },
        ],
      },
      {
        src: "/art/erde_nacht.jpg",
        alt: "Satellitenbild der Erde bei Nacht mit den Lichtern der Städte",
        credit: "NASA/NOAA, „Earth at Night“, 2012 · gemeinfrei (US-Gov)",
        caption:
          "Die elektrifizierte Erde bei Nacht: Städte und Netze zeichnen die vernetzte Welt in Lichtadern.",
      },
      {
        src: "/art/erde_tag.jpg",
        alt: "Foto der Erde aus dem All („Blue Marble“, Apollo 17)",
        credit: "NASA, „Blue Marble“ (Apollo 17), 1972 · gemeinfrei (US-Gov)",
        caption:
          "Der „Blaue Planet“ — eine Welt ohne Grenzen von aussen gesehen: Bezugspunkt eines globalen „Wir“.",
      },
    ],
    techText:
      "Die digitale Welle folgt in rascher Kette: Der Transistor macht Rechner klein und zuverlässig, ARPANET und World Wide Web machen Information ortlos, und seit 2017 erzeugen Systeme auf Basis der Transformer-Architektur selbst Sprache, Bilder und Code.",
    tech: [
      {
        year: "1945 / 1947",
        title: "Computer & Transistor",
        note: "ENIAC rechnet elektronisch (1945), der Transistor (Bell Labs 1947) macht Maschinen klein und zuverlässig — das digitale Zeitalter beginnt.",
        icon: "memory",
      },
      {
        year: "1969–1991",
        title: "ARPANET & World Wide Web",
        note: "Erst vier vernetzte Rechner (1969), dann Tim Berners-Lees Web für alle (1989/91) — Information wird ortlos, getragen von den Kabeln in den Meeren.",
        icon: "language",
      },
      {
        year: "2017–2022",
        title: "Generative KI",
        note: "Die Transformer-Architektur („Attention Is All You Need“, 2017) und darauf aufbauend ChatGPT (2022): Maschinen erzeugen Sprache, Bilder und Code.",
        icon: "chat",
      },
    ],
    techSources: [
      {
        label: "„Attention Is All You Need“ — Transformer-Paper (arXiv)",
        url: "https://arxiv.org/abs/1706.03762",
      },
      {
        label: "Die Geburt des Web (CERN)",
        url: "https://www.home.cern/science/computing/birth-web",
      },
    ],
    unrestLead: "Was ist noch echt? Das „Wir“ zerfällt.",
    unrest:
      "Die Verunsicherung ist neuer Art: Bilder, Stimmen und Videos lassen sich täuschend echt fälschen (Deepfakes), Suchergebnisse und Texte sind womöglich maschinell erzeugt. Was ist noch echt, worauf kann man sich verlassen, welche Fähigkeiten lohnen sich noch — und wer hat etwas gemacht: ich, die Maschine, beide? Alles ist vernetzt und beschleunigt sich; viele erleben sich als getrieben, und das gemeinsame „Wir“ droht zu zerfallen.",
    unrestSources: [
      {
        label: "Deepfake (Wikipedia)",
        url: "https://en.wikipedia.org/wiki/Deepfake",
      },
    ],
    thinker: "Wir — jetzt",
    schablone: "??? — das suchen wir gerade",
    orientation:
      "Für unsere Zeit entsteht die Antwort gerade erst. Die Philosophie sieht nicht voraus — sie denkt im Blick auf das, was geschieht: Wie sollen wir mit einem nicht-menschlichen Akteur wie der KI umgehen (Bruno Latour), wie leben wir mit dem Technischen verflochten (Donna Haraway, „A Cyborg Manifesto“), woran halten wir moralisch fest (Markus Gabriel)? Die Schablone ist noch offen — genau daran arbeitet dieses Submodul.",
    orientSources: [
      {
        label: "Philosophie der Technik (Stanford Encyclopedia)",
        url: "https://plato.stanford.edu/entries/technology/",
      },
      {
        label: "A Cyborg Manifesto (Wikipedia)",
        url: "https://en.wikipedia.org/wiki/A_Cyborg_Manifesto",
      },
    ],
    open: true,
  },
];

const BAUSTEINE = [
  {
    key: "tech",
    label: "Technische Errungenschaft",
    icon: "precision_manufacturing",
    chip: "bg-primary-container text-on-primary-container",
  },
  {
    key: "unrest",
    label: "Verunsicherung",
    icon: "warning",
    chip: "bg-error-container text-on-error-container",
  },
  {
    key: "orientation",
    label: "Philosophische Orientierungshilfe",
    icon: "explore",
    chip: "bg-tertiary-container text-on-tertiary-container",
  },
] as const;

function Quellen({ items }: { items: Source[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-md flex flex-wrap items-center gap-x-md gap-y-xs border-t border-outline-variant pt-sm">
      <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
        Quellen
      </span>
      {items.map((s) => (
        <a
          key={s.url}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-xs text-label-sm text-primary underline underline-offset-2 hover:text-on-primary-container"
        >
          <span className="material-symbols-outlined text-[14px]">
            open_in_new
          </span>
          {s.label}
        </a>
      ))}
    </div>
  );
}

type Viewer = { station: number; idx: number };

export default function SchablonenZeitstrahl() {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());
  const [viewer, setViewer] = useState<Viewer | null>(null);

  const toggle = (key: string) =>
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <>
      <ol className="flex flex-col gap-xl">
        {STATIONS.map((s, si) => {
          const isLast = si === STATIONS.length - 1;
          return (
            <li key={s.id} className="flex gap-md">
              <div className="flex flex-col items-center">
                <span
                  className={
                    s.open
                      ? "flex h-11 w-11 items-center justify-center rounded-xl bg-tertiary text-on-tertiary shadow-sm"
                      : "flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant"
                  }
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {s.icon}
                  </span>
                </span>
                {!isLast && <span className="w-px flex-1 bg-outline-variant" />}
              </div>

              <div
                className={
                  "min-w-0 flex-1 overflow-hidden rounded-xl border bg-surface-bright shadow-sm " +
                  (s.open ? "border-tertiary border-dashed" : "border-outline-variant")
                }
              >
                {/* Kopf */}
                <div className="border-b border-outline-variant p-lg">
                  <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                    {s.span}
                  </p>
                  <h3 className="mt-xs text-headline-md text-on-surface">
                    {s.epoch}
                  </h3>
                  <p className="mt-xs text-body-md text-on-surface-variant">
                    {s.lead}
                  </p>
                </div>

                {/* Bildergalerie */}
                <div className="bg-surface-container-low p-lg">
                  <p className="mb-sm flex items-center gap-xs text-label-sm uppercase tracking-wider text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">
                      photo_library
                    </span>
                    Bilder der Zeit · {s.gallery.length}
                  </p>
                  <div className="grid grid-cols-2 gap-sm sm:grid-cols-3">
                    {s.gallery.map((g, gi) => (
                      <button
                        key={g.src}
                        type="button"
                        onClick={() => setViewer({ station: si, idx: gi })}
                        aria-label={`${g.alt} — im Vollbild öffnen`}
                        className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-outline-variant bg-surface-bright"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={g.src}
                          alt={g.alt}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute right-xs top-xs inline-flex items-center justify-center rounded-lg bg-inverse-surface/70 p-xs text-inverse-on-surface opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="material-symbols-outlined text-[16px]">
                            fullscreen
                          </span>
                        </span>
                        {g.tour && (
                          <span className="absolute bottom-xs left-xs inline-flex items-center gap-xs rounded-lg bg-tertiary px-sm py-xs text-label-sm text-on-tertiary shadow-sm">
                            <span className="material-symbols-outlined text-[14px]">
                              tour
                            </span>
                            Führung
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Drei Bausteine */}
                <div className="divide-y divide-outline-variant border-t border-outline-variant">
                  {BAUSTEINE.map((b) => {
                    const key = `${s.id}:${b.key}`;
                    const isOpen = openKeys.has(key);
                    const teaser =
                      b.key === "tech"
                        ? s.tech.map((t) => t.title).join(" · ")
                        : b.key === "unrest"
                        ? s.unrestLead
                        : `${s.thinker}: ${s.schablone}`;
                    return (
                      <div key={b.key}>
                        <button
                          type="button"
                          onClick={() => toggle(key)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center gap-md p-lg text-left transition-colors hover:bg-surface-container-low"
                        >
                          <span
                            className={
                              "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg " +
                              b.chip
                            }
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {b.icon}
                            </span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-body-md font-semibold text-on-surface">
                              {b.label}
                            </span>
                            <span className="block truncate text-body-sm text-on-surface-variant">
                              {teaser}
                            </span>
                          </span>
                          <span
                            className={
                              "material-symbols-outlined flex-shrink-0 text-[22px] text-on-surface-variant transition-transform " +
                              (isOpen ? "rotate-180" : "")
                            }
                          >
                            expand_more
                          </span>
                        </button>

                        {isOpen && (
                          <div className="px-lg pb-lg">
                            {b.key === "tech" && (
                              <>
                                <p className="mb-md text-body-md text-on-surface-variant">
                                  {s.techText}
                                </p>
                                <div className="grid gap-sm sm:grid-cols-2">
                                  {s.tech.map((t) => (
                                    <div
                                      key={t.title}
                                      className="rounded-lg border border-outline-variant bg-surface-container-low p-md"
                                    >
                                      <div className="flex items-center gap-sm">
                                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
                                          <span className="material-symbols-outlined text-[18px]">
                                            {t.icon}
                                          </span>
                                        </span>
                                        <div className="min-w-0">
                                          <p className="text-label-sm text-primary">
                                            {t.year}
                                          </p>
                                          <p className="text-body-sm font-semibold text-on-surface">
                                            {t.title}
                                          </p>
                                        </div>
                                      </div>
                                      <p className="mt-sm text-body-sm text-on-surface-variant">
                                        {t.note}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                <Quellen items={s.techSources} />
                              </>
                            )}

                            {b.key === "unrest" && (
                              <>
                                <p className="border-l-4 border-error/40 pl-md text-body-md text-on-surface-variant">
                                  {s.unrest}
                                </p>
                                <Quellen items={s.unrestSources} />
                              </>
                            )}

                            {b.key === "orientation" && (
                              <>
                                <div className="space-y-sm">
                                  <p className="flex items-start gap-sm text-body-md text-on-surface">
                                    <span className="material-symbols-outlined text-[18px] text-tertiary">
                                      bookmark
                                    </span>
                                    <span>
                                      <span className="text-on-surface-variant">
                                        {s.thinker} · Schablone:{" "}
                                      </span>
                                      <strong>{s.schablone}</strong>
                                    </span>
                                  </p>
                                  {s.quote && (
                                    <p className="text-body-md italic text-on-surface-variant">
                                      {s.quote}
                                    </p>
                                  )}
                                  <p className="text-body-md text-on-surface-variant">
                                    {s.orientation}
                                  </p>
                                </div>
                                <Quellen items={s.orientSources} />
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Vollbild-Viewer: freies Zoomen + kuratierte Führungen (pro Epoche) */}
      {viewer && (
        <BildZoom
          images={STATIONS[viewer.station].gallery}
          startIdx={viewer.idx}
          epoch={STATIONS[viewer.station].epoch}
          onClose={() => setViewer(null)}
        />
      )}
    </>
  );
}
