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
 * Quellen: durchgehend deutschsprachig. Alle URLs wurden am 2026-07-07 auf
 * Existenz / HTTP 200 geprüft (de.wikipedia.org via MediaWiki-API,
 * de.wikisource.org, marxists.org/deutsch).
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
  /** Schluss-Stopp der Führung: verknüpft das Bild mit Technik & Verunsicherung. */
  contextNote?: string;
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
        contextNote:
          "Raffaels Halle der Denker ist ein Rückblick der Renaissance auf die Antike — und ein Bild ihrer Antwort auf eine tiefe Verunsicherung. Als in Athen der Mythos seine bindende Kraft verlor und die Sophisten lehrten, dass sich jede Behauptung gegen Bezahlung überzeugend vertreten lässt, drohte Wahrheit zur blossen Rhetorik zu werden. Die technische Seite derselben Zeit — Instrumente wie der Antikythera-Mechanismus, später die experimentelle Optik — zeigt dieselbe Haltung von der anderen Seite: die Welt lässt sich beobachten, messen, berechnen. Aristoteles bündelt beides zu einer Methode: beobachten, ordnen, begründen. Genau diese Schablone feiert Raffael, indem er die Denker aller Zeiten in einer Halle versammelt.",
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
            text: "Raffael malt 1509–1511 im Vatikan eine ideale Halle, in der sich die griechischen Denker aller Zeiten begegnen. Es ist kein realer Ort und keine reale Szene, sondern ein Bild des Denkens selbst — die Antike, wie die Renaissance sie als ihr eigenes Fundament verehrte. Über fünfzig Figuren stehen, gehen und streiten in einer Architektur, die an einen antiken Tempel des Wissens erinnert.",
          },
          {
            x: 50,
            y: 42,
            zoom: 2.6,
            title: "Platon und Aristoteles",
            text: "Im Zentrum steht der Grundkonflikt der Erkenntnis in einer einzigen Geste: Platon zeigt mit dem Finger nach oben, in die Welt der ewigen Ideen — Aristoteles hält die Hand flach über den Boden, zur beobachtbaren Wirklichkeit. Der eine sucht die Wahrheit im reinen Denken, der andere im Hinsehen und Ordnen. Genau hier beginnt die Schablone der Empirie, die später die gesamte Wissenschaft trägt.",
          },
          {
            x: 37,
            y: 40,
            zoom: 2.8,
            title: "Sokrates im Gespräch",
            text: "Links, im olivgrünen Gewand, zählt Sokrates an den Fingern seine Argumente ab und umringt von Zuhörern führt er sein berühmtes Frage-und-Antwort-Spiel vor. Diese Methode, alles so lange zu hinterfragen, bis scheinbare Gewissheiten zerbrechen, machte ihn zur unbequemsten Figur Athens — und kostete ihn schliesslich das Leben.",
          },
          {
            x: 21,
            y: 64,
            zoom: 2.8,
            title: "Pythagoras",
            text: "Vorne links schreibt Pythagoras konzentriert in ein Buch, umringt von Schülern; einer hält ihm eine Tafel mit Harmonie- und Zahlenverhältnissen hin. Er steht für eine folgenreiche Idee: dass sich die Welt durch Zahl und Proportion ordnen lässt — dass hinter dem Chaos der Erscheinungen eine mathematische Struktur liegt.",
          },
          {
            x: 71,
            y: 71,
            zoom: 2.8,
            title: "Euklid an der Tafel",
            text: "Rechts beugt sich Euklid mit einem Zirkel über eine Tafel und führt einer Gruppe Jugendlicher einen geometrischen Beweis vor. Raffael gab ihm die Züge des Baumeisters Bramante. Die Szene feiert ein neues Ideal: Wissen, das nicht behauptet, sondern Schritt für Schritt bewiesen und darum von jedem nachvollzogen und gelehrt werden kann.",
          },
          {
            x: 84,
            y: 62,
            zoom: 2.6,
            title: "Der Blick in den Kosmos — und aus dem Bild",
            text: "Rechts hält Ptolemäus den Erdglobus, ihm gegenüber steht eine Figur mit der Himmelskugel: die Vermessung von Erde und Sternen. Und ganz am Rand blickt ein junger Mann mit dunkler Mütze direkt aus dem Bild zu uns heraus — es ist Raffael selbst. Der Maler stellt sich bescheiden unter die grossen Denker und bindet so seine eigene Zeit an das antike Erbe.",
          },
        ],
      },
      {
        src: "/art/aristoteles_rembrandt.jpg",
        contextNote:
          "Rembrandts nachdenklicher Aristoteles verkörpert die Schablone dieser Epoche in einer einzigen Figur. Als Mythos und Sophistik den Athenern den sicheren Boden entzogen — niemand wusste mehr, welcher Erzählung, welcher Autorität noch zu trauen sei —, gründete Aristoteles das Wissen neu: auf genaue Beobachtung, auf Logik und auf die Frage nach den Ursachen. Dieselbe geduldige, ordnende Haltung steckt in den technischen Errungenschaften der Zeit, vom rechnenden Antikythera-Getriebe bis zur experimentellen Optik. Rembrandt zeigt nicht die Tat, sondern das Innehalten davor — das Denken selbst als Antwort auf eine Welt, die ihre Selbstverständlichkeit verloren hat.",
        tour: [
          {
            x: 50,
            y: 42,
            zoom: 1,
            title: "Rembrandt, 1653",
            text: "Aristoteles steht in kostbarem Gewand, nachdenklich, im warmen Halbdunkel — ein Nachtstück des Denkens. Rembrandt malt keine Handlung und keine Anekdote, sondern einen Menschen im Augenblick der Reflexion. Licht und Schatten führen den Blick wie in einer Meditation von der prächtigen Erscheinung zur inneren Sammlung.",
          },
          {
            x: 30,
            y: 72,
            zoom: 2.3,
            title: "Die Hand auf Homers Büste",
            text: "Sanft legt Aristoteles die Hand auf den Kopf des blinden Dichters Homer. Die Geste ist voller Ehrfurcht: Der Philosoph verankert sein eigenes Denken in der Überlieferung, auf der es aufbaut. Wissen entsteht nicht aus dem Nichts, sondern im Gespräch mit dem, was frühere Generationen gedacht und gedichtet haben.",
          },
          {
            x: 52,
            y: 30,
            zoom: 2.2,
            title: "Der Blick nach innen",
            text: "Die Augen gehen ins Leere — nicht auf einen Gegenstand in der Welt gerichtet, sondern nach innen, in Gedanken versunken. Rembrandt macht damit das Unsichtbare sichtbar: den Vorgang des Nachdenkens. Genau dieses stille Abwägen ist die Haltung, aus der bei Aristoteles geordnetes, begründetes Wissen erwächst.",
          },
        ],
        alt: "Gemälde „Aristoteles mit einer Büste Homers“ von Rembrandt",
        credit:
          "Rembrandt, „Aristoteles mit einer Büste Homers“, 1653 · gemeinfrei",
        caption:
          "Der Philosoph, die Hand auf dem Kopf des Dichters: Denken im Zwiegespräch mit der Überlieferung.",
      },
      {
        src: "/art/sokrates.jpg",
        contextNote:
          "Der Tod des Sokrates zeigt die Verunsicherung der Antike in einem einzigen Bild: eine Stadt, die ihren klügsten und unbequemsten Frager zum Tode verurteilt, weil der alte Mythos nicht mehr trägt und jede Gewissheit wankt. Sokrates wird zum Sinnbild dafür, wie gefährlich das Denken werden kann, wenn es Selbstverständliches in Frage stellt. Die Antwort der Epoche darauf war nicht, das Fragen zu verbieten, sondern es zu ordnen: Aus der sokratischen Methode und der Systematik des Aristoteles entstand das Fundament der Wissenschaft — dieselbe prüfende Haltung, die auch die technischen Errungenschaften der Zeit trägt, vom Rechengerät bis zum optischen Experiment.",
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
            text: "399 v. Chr., eine Gefängniszelle in Athen: David malt 1787, am Vorabend der Französischen Revolution, den Moment kurz bevor Sokrates den Giftbecher trinkt. Er macht daraus ein Lehrstück über Standhaftigkeit — der klare, gefasste Held im Kreis erschütterter Freunde. Die strenge, fast bühnenhafte Komposition zeigt: Hier geht es um Haltung, nicht um Rührung.",
          },
          {
            x: 62,
            y: 32,
            zoom: 2.6,
            title: "Der Finger nach oben",
            text: "Noch im Sterben unterrichtet Sokrates weiter: Mit der einen Hand greift er nach dem Becher, mit der anderen hebt er den Finger nach oben. Die Geste verweist auf das, was grösser ist als der eigene Tod — das Argument, die Wahrheit, die Idee des Guten. Selbst die Hinrichtung wird für ihn zur letzten philosophischen Lektion.",
          },
          {
            x: 47,
            y: 47,
            zoom: 2.8,
            title: "Der Becher",
            text: "Fast beiläufig, ohne hinzusehen, greift Sokrates nach dem Schierlingsbecher — so ruhig, als reiche man ihm einen Trunk Wasser. Der Vollstrecker im roten Gewand hält ihm den Becher hin, wendet aber das Gesicht ab und fasst sich an den Kopf: Er kann nicht mit ansehen, was er tun muss. Der Kontrast macht die Fassung des Verurteilten umso grösser.",
          },
          {
            x: 18,
            y: 56,
            zoom: 2.6,
            title: "Platon am Fussende",
            text: "Gefasst, in sich gekehrt, den Blick zu Boden, sitzt am Fussende der greise Platon — obwohl der historische Platon an jenem Tag gar nicht anwesend war. David setzt ihn bewusst dazu: Er ist es, der das Gespräch später aufschreiben und über zwei Jahrtausende weitertragen wird. Ohne diese Überlieferung wüssten wir von Sokrates so gut wie nichts.",
          },
          {
            x: 82,
            y: 50,
            zoom: 2.5,
            title: "Die Verzweiflung der Schüler",
            text: "Rechts zerbrechen die Schüler fast an ihrer Trauer: der eine schlägt die Hände zusammen, ein anderer wendet sich weinend ab, wieder ein anderer klammert sich an die Wand. Ihr Aufruhr ist Davids Gegenbild zur Ruhe des Sokrates. Die Botschaft: Vernunft und innere Haltung setzen sich gegen die Verzweiflung — auch angesichts des Todes.",
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
        label: "Mechanismus von Antikythera (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Mechanismus_von_Antikythera",
      },
      {
        label: "Alhazen / Buch der Optik (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Alhazen",
      },
    ],
    unrestLead: "Der Logos entzaubert den Mythos.",
    unrest:
      "Im Athen des 5. Jahrhunderts v. Chr. verliert der Mythos seine bindende Kraft. Wandernde Lehrer — die Sophisten — bringen gegen Bezahlung bei, wie man jede Position überzeugend vertritt; Wahrheit droht zur Sache der Rhetorik zu werden. Als Sokrates die Bürger mit hartnäckigem Fragen bloßstellt, verurteilt ihn die Stadt 399 v. Chr. wegen „Gottlosigkeit“ und „Verderb der Jugend“ zum Tod. Das Denken selbst wird als Bedrohung erlebt.",
    unrestSources: [
      {
        label: "Sophisten (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Sophisten",
      },
      {
        label: "Sokrates (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Sokrates",
      },
    ],
    thinker: "Aristoteles",
    schablone: "Beobachten, ordnen, begründen",
    quote: "„Alle Menschen streben von Natur aus nach Wissen.“",
    orientation:
      "Aristoteles (384–322 v. Chr.) antwortet mit einer beispiellosen Ordnungsleistung: Er gliedert die Wissenschaften (Logik, Physik, Biologie, Ethik, Politik, Metaphysik), entwickelt mit der Logik ein Werkzeug des gültigen Schließens und gründet Wissen auf Beobachtung und Ursachenanalyse. Nicht fertige Wahrheiten, sondern eine Methode: beobachten, ordnen, begründen — die Schablone, auf der die europäische Wissenschaft aufbaut.",
    orientSources: [
      {
        label: "Aristoteles (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Aristoteles",
      },
      {
        label: "Metaphysik des Aristoteles (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Metaphysik_(Aristoteles)",
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
        contextNote:
          "Champaignes Augustinus verkörpert die Antwort auf einen epochalen Schock. Als Rom 410 fiel und mit dem Reich für viele die Weltordnung selbst zusammenbrach (die Verunsicherung), verlegte Augustinus den Halt vom äusseren Reich ins Innere des Menschen und in den Glauben: Wahrheit und Orientierung findet man nicht mehr in der vergänglichen Macht, sondern in Gewissen, Erinnerung und Zuwendung zu Gott. Diese neue, nach innen gewandte Ordnung prägte das Abendland ein Jahrtausend lang — und wurde später sogar technisch hörbar: im gleichmässigen Stundenschlag der Klosteruhr, die Gebet und Arbeit in einen festen Takt brachte.",
        tour: [
          {
            x: 50,
            y: 40,
            zoom: 1,
            title: "Champaigne, um 1645",
            text: "Der barocke Maler Philippe de Champaigne zeigt Augustinus als Bischof am Schreibpult, umgeben von seinen Sinnbildern: dem Buch, dem brennenden Herzen und einem Lichtstrahl von oben. Das ganze Bild ist um eine Frage gebaut — woher kommt die Wahrheit? Farben und Komposition führen den Blick zwischen Himmel, Herz und Feder hin und her.",
          },
          {
            x: 60,
            y: 52,
            zoom: 2.4,
            title: "Das brennende Herz",
            text: "In seiner Hand hält Augustinus ein flammendes Herz — sein bekanntestes Attribut. Es steht für die von Gott entzündete Liebe und für eine leidenschaftliche Suche nach Wahrheit, die nicht im kühlen Verstand, sondern im Innersten des Menschen brennt. Die Wahrheit kommt für ihn nicht von aussen aus der Welt, sondern von innen.",
          },
          {
            x: 45,
            y: 18,
            zoom: 2.2,
            title: "Der Strahl der Wahrheit",
            text: "Von oben fällt ein heller Strahl auf Augustinus, dem sein Blick entgegengeht. Er verkörpert Augustins Überzeugung, dass wahre Erkenntnis eine Art göttliche „Erleuchtung“ ist: Der Mensch findet die Wahrheit, indem er sich nach innen und nach oben wendet — nicht durch das blosse Beobachten der äusseren Dinge.",
          },
        ],
        alt: "Gemälde „Der heilige Augustinus“ von Philippe de Champaigne",
        credit:
          "Ph. de Champaigne, „Der heilige Augustinus“, um 1645 · gemeinfrei",
        caption:
          "Ein Lichtstrahl der Wahrheit trifft das brennende Herz: Der Blick wendet sich nach innen — zu Glaube und Gewissen.",
      },
      {
        src: "/art/mittelalter_stundenbuch.jpg",
        contextNote:
          "Das Kalenderblatt zeigt die stabile, in sich ruhende Welt, die nach dem Zusammenbruch Roms über Jahrhunderte entstand: Burg, Feldarbeit und Kirchenjahr fügen sich zu einem geordneten Kreislauf, getragen von Glaube und Stand. Doch genau in diese Ordnung greift eine leise technische Revolution ein — die mechanische Uhr. Zuerst regelt sie in den Klöstern die Gebetszeiten, dann zerlegt sie von den Stadttürmen aus den Tag für alle in gleiche, abstrakte Stunden. Das Leben richtet sich nicht mehr allein nach Sonne, Jahreszeit und Gefühl, sondern nach dem Takt der Maschine — ein früher Vorbote der getakteten, modernen Gesellschaft.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Ein Kalenderblatt, um 1416",
            text: "Der Monat Oktober aus dem berühmtesten Stundenbuch des Mittelalters, den „Très Riches Heures“ der Brüder Limburg. Der Aufbau spiegelt das Weltbild der Zeit: oben der Himmel mit den Tierkreiszeichen, in der Mitte die Herrschaft, unten die Arbeit. Alles hat seinen festen Platz in einer gottgegebenen Ordnung.",
          },
          {
            x: 50,
            y: 40,
            zoom: 2.1,
            title: "Die Burg in der Mitte",
            text: "Prächtig und wehrhaft erhebt sich der mittelalterliche Louvre in Paris mit Türmen, Zinnen und Fahnen. Er steht für das feste Zentrum von Herrschaft und Ordnung — die weltliche Macht, die nach dem Chaos der Völkerwanderung wieder Sicherheit verspricht. Über der Burg wacht der Himmel, unter ihr arbeitet das Volk.",
          },
          {
            x: 52,
            y: 80,
            zoom: 2.2,
            title: "Sämann und Feldarbeit",
            text: "Im Vordergrund sät ein Bauer im blauen Kittel das Wintergetreide, ein Reiter zieht eine Egge über den Acker, Vögel picken die frisch gestreuten Körner. Diese ruhige, ewig wiederkehrende Arbeit zeigt das Lebensgefühl der Epoche: Der Mensch fügt sich in den Kreislauf der Jahreszeiten und des Kirchenjahres, statt die Welt umzugestalten.",
          },
        ],
        alt: "Buchmalerei „Oktober“ aus den Très Riches Heures des Duc de Berry",
        credit:
          "Brüder Limburg, „Très Riches Heures“ (Oktober), um 1416 · gemeinfrei",
        caption:
          "Die mittelalterliche Ordnung: Burg, Feldarbeit und Kalender — das Leben im Kreis von Jahreszeit und Glaube.",
      },
      {
        src: "/art/rom.jpg",
        contextNote:
          "Der Fall Roms ist die Verunsicherung dieser Epoche in Reinform: Als die Westgoten 410 die „ewige Stadt“ plünderten, brach für die Zeitgenossen nicht nur eine Hauptstadt, sondern eine ganze Weltordnung zusammen — man rang um Schuld und Sinn, Heiden wie Christen. Augustinus gab darauf mit dem „Gottesstaat“ die Orientierung: Nicht das irdische Reich trägt, sondern eine unsichtbare, geistige Ordnung. Die neue, vom Kloster ausgehende und von der mechanischen Uhr getaktete Zeit wurde später das leise technische Rückgrat dieser über ein Jahrtausend prägenden Antwort.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Sylvestre, 1890",
            text: "Ein grosses Historiengemälde des 19. Jahrhunderts inszeniert die Plünderung Roms im Jahr 410. Vor brennender Kulisse stürmen die Westgoten die Stadt — der Maler Joseph-Noël Sylvestre malt den Untergang als dramatisches Schauspiel und trifft damit ein Gefühl, das seine eigene, ebenfalls umbruchsreiche Zeit umtrieb: die Angst vor dem Ende einer Zivilisation.",
          },
          {
            x: 52,
            y: 26,
            zoom: 2.2,
            title: "Der Sturz des Kaisers",
            text: "Ein muskulöser Krieger klettert an der weissen Marmorstatue eines römischen Kaisers hoch und holt zum Schlag aus. Das Bild verdichtet den Untergang in ein Symbol: Nicht ein Mensch wird gestürzt, sondern das Sinnbild der Macht selbst — buchstäblich vom Sockel gerissen. So sichtbar zerbricht eine Ordnung, die 800 Jahre unantastbar schien.",
          },
          {
            x: 50,
            y: 84,
            zoom: 2.2,
            title: "Viele Hände am Seil",
            text: "Unten im Bild ziehen zahlreiche Krieger gemeinsam an einem Seil, um das Standbild zu Fall zu bringen. Die alte Weltordnung stürzt nicht von selbst — sie wird von vielen Händen aktiv niedergerissen. Der Bildaufbau lenkt den Blick von diesem gemeinsamen Kraftakt hinauf zur kippenden Statue: Geschichte als Werk von Menschen, nicht von Schicksal.",
          },
        ],
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
        label: "Räderuhr (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/R%C3%A4deruhr",
      },
      {
        label: "Turmuhr (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Turmuhr",
      },
    ],
    unrestLead: "Rom fällt — wem gehört die Zukunft?",
    unrest:
      "Am 24. August 410 plündern Alarichs Westgoten Rom — zum ersten Mal seit rund 800 Jahren fällt die Stadt an einen äußeren Feind. Der Schock hallt durch das ganze Reich: Für viele bricht mit Rom die Weltordnung selbst zusammen. Heiden machen den neuen christlichen Glauben verantwortlich — man habe die alten Götter verlassen; Christen ringen mit der Frage, warum Gott seine Stadt nicht geschützt habe.",
    unrestSources: [
      {
        label: "Plünderung Roms (410) (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Pl%C3%BCnderung_Roms_(410)",
      },
    ],
    thinker: "Augustinus",
    schablone: "Innerlichkeit, Glaube, Heilsgeschichte",
    quote: "„Im inneren Menschen wohnt die Wahrheit.“",
    orientation:
      "Augustinus (354–430) antwortet mit „De civitate Dei“ (Vom Gottesstaat, 413–426): Er unterscheidet den vergänglichen „Staat der Menschen“ vom „Staat Gottes“. Nicht das irdische Reich trägt, sondern der Glaube und das Innere des Menschen — „im inneren Menschen wohnt die Wahrheit“. Diese Schablone wendet den Blick von der äußeren Ordnung nach innen (Gewissen, Heilsgeschichte) und gibt einem ganzen Zeitalter Halt.",
    orientSources: [
      {
        label: "Augustinus von Hippo (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Augustinus_von_Hippo",
      },
      {
        label: "Vom Gottesstaat / De civitate Dei (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/De_civitate_Dei",
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
        contextNote:
          "Friedrichs einsamer Wanderer ist das Sinnbild der Antwort, die Kant der Aufklärung gab. Zuvor hatten mehrere Erschütterungen die alten Gewissheiten weggerissen: Der Buchdruck hatte die Glaubensspaltung befeuert, Kopernikus und das Teleskop hatten der Erde die Mitte des Kosmos genommen, und das Erdbeben von Lissabon 1755 hatte den Glauben an einen gütigen Weltplan zerstört (die Verunsicherung). Wenn aber weder Kirche noch überlieferte Autorität mehr sicheren Halt geben, dann bleibt nur eines: Der Mensch muss die Welt selbst deuten und aus eigenem Verstand urteilen. Friedrich malt genau diesen mündigen, auf sich gestellten Einzelnen — Jahrzehnte nach Kant, aber ganz in seinem Geist.",
        tour: [
          {
            x: 50,
            y: 45,
            zoom: 1,
            title: "Friedrich, 1818",
            text: "Ein Mann in dunklem Gehrock steht allein auf einem Felsgipfel und blickt über ein wogendes Meer aus Nebel, aus dem ferne Berge ragen. Es ist eines der berühmtesten Bilder der Romantik — und ein Porträt eines Lebensgefühls: der Mensch, klein und doch aufrecht, allein der unermesslichen Welt gegenüber.",
          },
          {
            x: 50,
            y: 38,
            zoom: 2.2,
            title: "Der Blick über die Schulter",
            text: "Wir sehen den Wanderer nur von hinten — sein Gesicht bleibt verborgen. Dadurch blickt er gleichsam stellvertretend für uns in die Landschaft, und wir treten an seine Stelle. Der Einzelne stellt sich der Welt und muss sie selbst deuten; niemand nimmt ihm dieses Sehen und Urteilen ab.",
          },
          {
            x: 50,
            y: 66,
            zoom: 2,
            title: "Das Nebelmeer",
            text: "Der Nebel zu Füssen des Wanderers verhüllt mehr, als er zeigt: Die Welt liegt nicht klar und geordnet da, sondern als offene, ungewisse Aufgabe. Genau darin liegt das moderne Lebensgefühl — Freiheit und Unsicherheit zugleich. Wer keine feste Ordnung mehr geschenkt bekommt, muss sich im Ungewissen selbst orientieren.",
          },
        ],
        alt: "Gemälde „Der Wanderer über dem Nebelmeer“ von Caspar David Friedrich",
        credit:
          "C. D. Friedrich, „Der Wanderer über dem Nebelmeer“, 1818 · gemeinfrei",
        caption:
          "Ein Einzelner deutet die Welt selbst — das mündige Individuum. Friedrich malt es Jahrzehnte nach Kant.",
      },
      {
        src: "/art/orrery.jpg",
        contextNote:
          "Das Orrery zeigt die technisch-wissenschaftliche Seite des Umbruchs: In einem mechanischen Modell lässt sich der ganze Kosmos vorführen und erklären. Doch genau dieser Fortschritt hatte eine erschütternde Kehrseite — mit Kopernikus und dem Teleskop verlor die Erde (und mit ihr der Mensch) ihren angestammten Platz im Zentrum der Schöpfung (die Verunsicherung). Wo früher das Heilige stand, steht nun eine Lampe als Sonne. Kant machte aus diesem Verlust ein Programm: Wenn der Mensch nicht mehr Mittelpunkt eines gottgegebenen Kosmos ist, dann muss er den Mut haben, mit dem eigenen Verstand Orientierung zu schaffen.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Wright of Derby, um 1766",
            text: "Joseph Wright of Derby malt eine Gruppe von Menschen, die sich im Dunkeln um ein Orrery drängen — ein mechanisches Tischmodell des Sonnensystems mit kreisenden Planeten. Statt Heiliger oder Herrscher zeigt das Bild ganz gewöhnliche Zuhörer beim wissenschaftlichen Vortrag: ein neues, bürgerliches Bildthema.",
          },
          {
            x: 50,
            y: 52,
            zoom: 2.2,
            title: "Eine Lampe als Sonne",
            text: "Im Zentrum des Modells steht eine Lampe, die die Sonne darstellt; ihr warmes Licht fällt auf die andächtigen Gesichter ringsum. Wright inszeniert die Wissenschaft mit einer Ehrfurcht, die man sonst aus Bildern der Anbetung kennt. Die Erkenntnis rückt buchstäblich an die Stelle, wo früher das Heilige leuchtete.",
          },
          {
            x: 36,
            y: 44,
            zoom: 2.2,
            title: "Staunende Kinder",
            text: "Zwei Kinder beugen sich nah ans Modell, ihre Gesichter hell erleuchtet und voller Staunen. Sie machen das eigentliche Thema sichtbar: das Lernen selbst als erhebendes Erlebnis. Aufklärung ist hier kein trockener Unterricht, sondern die Freude, eine erklärbare, durchschaubare Welt zu entdecken.",
          },
        ],
        alt: "Gemälde „A Philosopher Lecturing on the Orrery“ von Joseph Wright of Derby",
        credit:
          "J. Wright of Derby, „A Philosopher … on the Orrery“, um 1766 · gemeinfrei",
        caption:
          "Im Kerzenlicht staunt eine Runde über das Modell des Sonnensystems: Wissenschaft wird zum neuen Zentrum.",
      },
      {
        src: "/art/lissabon.jpg",
        contextNote:
          "Lissabon 1755 ist die Verunsicherung dieser Epoche schlechthin: An Allerheiligen zerstörten Erdbeben, Feuer und Flutwelle innerhalb von Stunden eine der reichsten Städte Europas und töteten Zehntausende — viele beim Gottesdienst. Während Buchdruck und Teleskop das Weltbild ohnehin erschütterten, zerbrach nun auch der Glaube an einen gütigen, vernünftigen Weltenplan; ganz Europa stritt (Voltaire gegen Rousseau) über die Frage, wie ein guter Gott so etwas zulassen könne. Kants Ausweg aus dieser Krise war nicht eine neue Beruhigung, sondern eine Zumutung an den Menschen: den Mut zum eigenen Verstand.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Kupferstich, 1755",
            text: "Ein zeitgenössisches Flugblatt zeigt Lissabon im Moment der dreifachen Katastrophe: Die Erde bebt, die Stadt brennt, und aus dem Hafen türmt sich die Flutwelle. Solche Stiche verbreiteten die Nachricht in Windeseile durch Europa — die Katastrophe wurde zum ersten grossen „Medienereignis“ der Neuzeit.",
          },
          {
            x: 50,
            y: 28,
            zoom: 2.2,
            title: "Die brennende Stadt",
            text: "Im Hintergrund stehen Kirchen und Paläste in Flammen und stürzen ein. Weil das Beben an einem hohen Feiertag geschah, waren die Kirchen voller Menschen — gerade die Orte der Frömmigkeit wurden zu Todesfallen. Genau das machte die Katastrophe zur theologischen Zumutung.",
          },
          {
            x: 50,
            y: 66,
            zoom: 2.2,
            title: "Die Flutwelle im Hafen",
            text: "Im Vordergrund kentern Schiffe in der heranrollenden Welle, Menschen versuchen sich in kleine Boote zu retten. Wer dem Beben und dem Feuer entkam, den holte oft das Wasser. Das Bild bündelt die Erfahrung, dass keine menschliche Ordnung und kein Gebet vor der blinden Gewalt der Natur schützt — und stellt die Frage nach dem Sinn neu.",
          },
        ],
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
        label: "Buchdruck (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Buchdruck",
      },
      {
        label: "Kopernikanische Wende (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Kopernikanische_Wende",
      },
      {
        label: "Das Längenproblem (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/L%C3%A4ngenproblem",
      },
    ],
    unrestLead: "Glaubensspaltung, Kopernikus, Lissabon.",
    unrest:
      "Die Erschütterungen kommen von allen Seiten: Der Buchdruck trägt Luthers Thesen in die Welt, die Christenheit spaltet sich, Religionskriege verwüsten Europa. Kopernikus und Galileo nehmen der Erde — und damit dem Menschen — die Mitte des Kosmos; Pascal notiert erschrocken über „das ewige Schweigen dieser unendlichen Räume“. Und am 1. November 1755 zerstört ein Erdbeben mit Feuer und Flutwelle Lissabon und tötet Zehntausende — der Streit um einen gütigen Weltplan (Voltaire, Rousseau) bricht offen aus.",
    unrestSources: [
      {
        label: "Erdbeben von Lissabon 1755 (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Erdbeben_von_Lissabon_1755",
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
        label: "Immanuel Kant (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Immanuel_Kant",
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
        contextNote:
          "Menzels Fabrik zeigt beide Seiten des Umbruchs in einem Bild: die technische Wucht der Dampfmaschine, die glühendes Eisen und Menschenkraft zu einem einzigen Getriebe verbindet — und die soziale Verunsicherung einer Arbeit, die im Schichtbetrieb niemals stillsteht. Genau diesen Umbruch versuchte Marx zu begreifen. Seine Schablone: Die Verhältnisse, in denen diese Menschen arbeiten, sind kein Naturgesetz und kein Schicksal, sondern von Menschen gemacht — und deshalb auch von Menschen veränderbar. Das Gemälde macht sichtbar, was er analysierte: eine Gesellschaft, die von der Maschine her neu geordnet wird.",
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
            text: "Adolph Menzel malt 1872–1875 nach genauen Studien in einem oberschlesischen Walzwerk das Innere einer echten Fabrik. Das war neu: Als eines der ersten grossen Gemälde überhaupt nimmt es die Industriearbeit als Thema ernst — nicht Götter, Herrscher oder Landschaften, sondern schwitzende Arbeiter zwischen Maschinen füllen die riesige Leinwand.",
          },
          {
            x: 55,
            y: 56,
            zoom: 2.4,
            title: "Das glühende Eisen",
            text: "In der Bildmitte wird ein glühender Eisenblock unter die Walzen geschoben. Sein oranges Leuchten ist die einzige „Sonne“ dieser dunklen Halle und taucht die ganze Szene in ein unwirkliches Licht. Nicht der Mensch, sondern das Material und die Maschine geben hier Takt, Licht und Richtung vor.",
          },
          {
            x: 32,
            y: 54,
            zoom: 2.4,
            title: "Die Arbeiter an den Zangen",
            text: "Mit langen Zangen und vollem Körpereinsatz dirigiert eine Gruppe von Männern das glühende Eisen. Hitze, Lärm und Gefahr sind fast körperlich spürbar. Menzel zeigt keine Helden und keine Opfer, sondern hochkonzentrierte Präzisionsarbeit unter Druck — Menschen, die zu einem Teil des Maschinentakts geworden sind.",
          },
          {
            x: 82,
            y: 71,
            zoom: 2.6,
            title: "Essen hinter der Blechwand",
            text: "Rechts im Bild isst eine Arbeiterschicht hastig hinter einer notdürftigen Blechwand — mitten in der lärmenden Halle, ohne eigenen Pausenraum. Das Walzwerk kennt keine Ruhe: Während die einen essen, arbeiten die anderen weiter. Menzel macht damit die neue, gnadenlose Zeitordnung der Fabrik sichtbar.",
          },
          {
            x: 37,
            y: 33,
            zoom: 2.2,
            title: "Das Räderwerk im Hintergrund",
            text: "Hinter allem drehen sich Schwungräder, Wellen und Transmissionsriemen, die die Dampfkraft in die ganze Halle verteilen. Sie sind der eigentliche Herrscher dieses Ortes. Nicht ein Meister oder Besitzer bestimmt den Rhythmus, sondern die Maschine — und alle Menschen im Bild ordnen sich ihr unter.",
          },
        ],
      },
      {
        src: "/art/coalbrookdale.jpg",
        contextNote:
          "Coalbrookdale zeigt die Dampfmaschine als ganze Landschaft — die technische Errungenschaft der Epoche, die einen stillen Talgrund in ein glühendes, rauchendes Industriezentrum verwandelt. Doch dieselbe Kraft, die Wohlstand und Fortschritt versprach, hatte eine dunkle Kehrseite: entwurzelte Menschen, Elend in den Städten, soziale Spannungen, die sich 1848 in Revolutionen entluden (die Verunsicherung). Marx suchte genau diese Zweiseitigkeit zu begreifen: Fortschritt und Elend sind für ihn nicht Zufall, sondern zwei Seiten desselben Systems — und weil dieses System von Menschen gemacht ist, lässt es sich auch verändern.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Loutherbourg, 1801",
            text: "Das Eisenwerk von Coalbrookdale in England — eine der Wiegen der Industrialisierung — bei Nacht. Loutherbourg malt es als düsteres, fast erhabenes Schauspiel: Die junge Industrie erscheint schön und bedrohlich zugleich, wie ein Naturereignis, das der Mensch entfesselt, aber kaum noch beherrscht.",
          },
          {
            x: 52,
            y: 56,
            zoom: 2.2,
            title: "Die künstliche Sonne",
            text: "Der Feuerschein der Hochöfen färbt den Nachthimmel in glühendes Orange und übertönt das Mondlicht. Die Fabrik macht die Nacht zum Tag — eine künstliche Sonne, die niemals untergeht. Darin liegt das ganze Versprechen und die ganze Unheimlichkeit der Industrie: Sie kennt keine natürlichen Grenzen mehr.",
          },
          {
            x: 40,
            y: 82,
            zoom: 2.2,
            title: "Last im Schlamm",
            text: "Im dunklen Vordergrund schleppen Pferde ein Fuhrwerk mit gegossenen Zylindern durch den aufgewühlten Morast. Neben dem erhabenen Feuerschauspiel steht so die harte, schmutzige, mühsame Wirklichkeit — die menschliche und tierische Arbeit, die den Fortschritt erst in Bewegung hält.",
          },
        ],
        alt: "Gemälde „Coalbrookdale bei Nacht“ von Philippe-Jacques de Loutherbourg",
        credit:
          "P.-J. de Loutherbourg, „Coalbrookdale bei Nacht“, 1801 · gemeinfrei",
        caption:
          "Die Hochöfen färben den Nachthimmel feurig: das erhabene, unheimliche Gesicht der frühen Industrie.",
      },
      {
        src: "/art/london.jpg",
        contextNote:
          "Dorés Blick über die Londoner Hinterhöfe zeigt die Verunsicherung der Industriemoderne von unten: entwurzelte Massen, zusammengepfercht in engen Quartieren im Schatten der Eisenbahn. Die technischen Errungenschaften der Zeit — Dampfmaschine, Schiene, Telegraf — trieben den Wandel mit ungeheurer Wucht voran, doch der Fortschritt fuhr im Wortsinn über die Köpfe der Ärmsten hinweg. Marx lieferte dazu die Deutung: Dieses Elend ist kein Naturzustand, sondern das Ergebnis bestimmter gesellschaftlicher Verhältnisse — und damit gestaltbar. Das Bild und die Analyse gehören zusammen wie Anschauung und Begriff.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Doré, 1872",
            text: "Der Blick geht über die dicht gedrängten Hinterhöfe des industriellen London, gerahmt vom Bogen eines Eisenbahnviadukts. Der Stich stammt aus dem Bildband „London: A Pilgrimage“, in dem Gustave Doré das Elend und die Wucht der grössten Stadt der Welt festhielt — eindringlicher als jede Statistik.",
          },
          {
            x: 38,
            y: 52,
            zoom: 2.2,
            title: "Enge Hinterhöfe",
            text: "Reihe an Reihe stehen dicht gedrängte Arbeiterhäuser, dazwischen winzige Höfe mit Wäscheleinen, kaum ein Streifen Licht dringt hinunter. So sah die Wohnwirklichkeit der Arbeiterfamilien aus: eng, rußgeschwärzt, ohne Privatheit. Der Kupferstich lässt die Enge fast körperlich spüren.",
          },
          {
            x: 72,
            y: 22,
            zoom: 2.2,
            title: "Der Zug darüber",
            text: "Oben rauscht auf dem Viadukt eine Eisenbahn vorbei und stößt Rauch aus. Das Bild verdichtet daraus ein Sinnbild: Der Fortschritt fährt buchstäblich über die Köpfe der Ärmsten hinweg — nah genug, um ihren Alltag zu verdunkeln, und doch für sie unerreichbar.",
          },
        ],
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
        label: "Dampfmaschine (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Dampfmaschine",
      },
      {
        label: "Transatlantisches Telegrafenkabel (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Transatlantisches_Telegrafenkabel",
      },
    ],
    unrestLead: "Fabrik, Elend, Revolution 1848.",
    unrest:
      "Die Industrialisierung reisst die alte Gesellschaft auseinander: Millionen ziehen vom Land in die Städte, arbeiten 14 Stunden am Tag, Kinder in Fabriken und Bergwerken; Elendsquartiere wachsen im Schatten der Viadukte. Ständische Sicherheiten sowie Dorf- und Familienordnungen lösen sich auf. 1848 entlädt sich die Spannung in einer Welle von Revolutionen quer durch Europa.",
    unrestSources: [
      {
        label: "Revolutionen 1848/1849 (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Revolutionen_1848/1849",
      },
    ],
    thinker: "Marx",
    schablone: "Den Umbruch begreifen — und gestalten",
    quote: "„Alles Ständische und Stehende verdampft.“",
    orientation:
      "Marx (1818–1883) begreift den Umbruch, während er geschieht: Im „Manifest der Kommunistischen Partei“ (1848, mit Friedrich Engels) beschreibt er, wie der Kapitalismus „alles Ständische und Stehende verdampfen“ lässt — und zieht daraus den Schluss, dass gesellschaftliche Verhältnisse nicht Natur oder Schicksal sind, sondern gemacht und darum veränderbar. Weltweite Wirkung entfaltet diese Antwort erst Jahrzehnte später.",
    orientSources: [
      {
        label: "Karl Marx (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Karl_Marx",
      },
      {
        label: "Manifest der Kommunistischen Partei — Volltext, deutsch (marxists.org)",
        url: "https://www.marxists.org/deutsch/archiv/marx-engels/1848/manifest/index.htm",
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
        contextNote:
          "Das Netz-Werk führt die beiden Fäden dieser Epoche zusammen. Die technische Seite: Rechner, Kabel, Datencentren und KI, die eine simple Bildersuche überhaupt erst möglich machen. Und die Verunsicherung: In diesem dichten Geflecht ist kaum noch zu sagen, wer eigentlich handelt und was echt ist — Mensch und Maschine ziehen an denselben Fäden. Anders als in den früheren Epochen gibt es hier noch keine fertige philosophische Antwort. Die Schablone, die uns in dieser vernetzten Welt Orientierung geben könnte, wird gerade erst gesucht — und genau daran arbeitet dieses Submodul mit Denkern wie Latour, Haraway und Gabriel.",
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
            text: "«Wir – Netz und Praxis» (2024) ist eine Installation über eine ganz alltägliche Handlung: die Suche nach Bildern im Internet. Dutzende kleine Figuren und Objekte sind mit Fäden verbunden, die alle im Zentrum zusammenlaufen. Was mit einem Klick einfach aussieht, entpuppt sich als Ergebnis eines riesigen, unsichtbaren Netzwerks.",
          },
          {
            x: 47,
            y: 42,
            zoom: 2.2,
            title: "Der Computer in der Mitte",
            text: "Im Zentrum steht ein alter Röhrenmonitor mit einer Weltkarte, darunter Tastatur und Maus — der Ort der Bildersuche selbst. Von hier laufen die Fäden nach allen Seiten. Das Werk stellt die scheinbar simple Handlung ins Zentrum, um zu zeigen, wie viel daran hängt.",
          },
          {
            x: 22,
            y: 26,
            zoom: 2.4,
            title: "Rohstoffe, Bergbau, Recycling",
            text: "Auf der einen Seite hängt die materielle Grundlage der digitalen Welt: Rohstoffe, Bergbau, Transport, Recycling, Elektronikmüll. Jede Suche hat ein physisches Gewicht — sie braucht seltene Metalle, Minen, Fabriken und hinterlässt am Ende Abfall. Das „Digitale“ ist alles andere als körperlos.",
          },
          {
            x: 80,
            y: 30,
            zoom: 2.4,
            title: "Netz-Infrastruktur",
            text: "Auf der anderen Seite die unsichtbare Technik: Netzwerkinfrastruktur, Kabel, Datencentren, Satelliten. Ohne dieses Rückgrat erscheint kein einziges Bild auf dem Schirm. Die Installation macht diese stillen Mit-Akteure sichtbar, die im Alltag völlig aus dem Blick geraten.",
          },
          {
            x: 55,
            y: 14,
            zoom: 2.4,
            title: "Die Menschen im Netz",
            text: "Oben und an den Rändern hängen die Menschen: Programmier:innen, Künstler:innen, Kabelhersteller, Arbeiter:innen, KI-Expert:innen und Nutzer:innen. Viele Hände ziehen an denselben Fäden. Das „Wir“ von heute ist keine Person und keine Gemeinschaft im alten Sinn, sondern ein Geflecht aus vielen, oft einander unbekannten Beteiligten.",
          },
          {
            x: 88,
            y: 55,
            zoom: 2.6,
            title: "Das Museumsetikett",
            text: "Rechts erklärt das Museumsschild das Werk: Eine Bildersuche wirke einfach, sei aber das Ergebnis eines komplexen Netzwerks. Genau das ist die Leitfrage dieses Moduls — wer und was handelt hier eigentlich alles mit, wenn ich scheinbar nur „ein Bild suche“? Das Etikett verwandelt die Installation in eine Denkaufgabe.",
          },
        ],
      },
      {
        src: "/art/erde_nacht.jpg",
        contextNote:
          "Die nächtliche Erde macht die technische Errungenschaft der Gegenwart in einem Bild sichtbar: eine total elektrifizierte, vernetzte Welt, deren Städte und Datenströme den Planeten in Lichtadern überziehen. Zugleich zeigt sie deren Kehrseite — die grellen Lichtbänder und die weiten dunklen Flächen führen die tiefe Ungleichheit dieser Vernetzung vor Augen. Und mitten in diese Welt tritt die Verunsicherung: Wenn sich Bilder, Stimmen und Texte täuschend echt fälschen lassen, was hält ein gemeinsames „Wir“ dann überhaupt noch zusammen? Diese Frage ist offen — sie zu beantworten, ist Aufgabe der Philosophie unserer Zeit.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "Die Erde bei Nacht (NASA, 2012)",
            text: "Ein aus vielen Satellitenaufnahmen zusammengesetztes Bild der nächtlichen Erde. Jedes Lichtpünktchen steht für menschliche Besiedlung, für Strom und Energie. Zum ersten Mal in der Geschichte lässt sich die Ausbreitung der Menschheit über den ganzen Planeten in einem einzigen Blick erfassen.",
          },
          {
            x: 50,
            y: 34,
            zoom: 2.2,
            title: "Lichtbänder des Netzes",
            text: "Grell leuchten Europa, das nördliche Indien, Ostasien und die US-Küsten. Wo Strom fliesst, ist auch das digitale Netz dicht — die hellen Adern zeichnen die Landkarte der vernetzten, industrialisierten Welt nach. Man sieht förmlich, wo das „Immer-online“ zu Hause ist.",
          },
          {
            x: 55,
            y: 60,
            zoom: 2.2,
            title: "Die dunklen Flächen",
            text: "Weite Teile Afrikas, Südamerikas und Zentralasiens bleiben nahezu dunkel. Diese Schatten erzählen die andere Hälfte der Geschichte: Die Vernetzung ist höchst ungleich verteilt. Auch das gehört zum „Wir“ von heute — es umfasst längst nicht alle in gleicher Weise, obwohl alle vom selben Netz abhängen.",
          },
        ],
        alt: "Satellitenbild der Erde bei Nacht mit den Lichtern der Städte",
        credit: "NASA/NOAA, „Earth at Night“, 2012 · gemeinfrei (US-Gov)",
        caption:
          "Die elektrifizierte Erde bei Nacht: Städte und Netze zeichnen die vernetzte Welt in Lichtadern.",
      },
      {
        src: "/art/erde_tag.jpg",
        contextNote:
          "Der „Blue Marble“ ist das Bild vom einen, gemeinsamen „Wir“: die Erde als ein einziger, grenzenloser Planet, von aussen gesehen. Es wurde zur Ikone der Umwelt- und Menschheitsbewegung, weil es eine Idee anschaulich macht — dass wir alle im selben Boot sitzen. Doch dieses „Wir“ steht heute unter Druck: Eine Technik, die alles miteinander vernetzt, verunsichert zugleich (Deepfakes, Beschleunigung, Zerfall gemeinsamer Wirklichkeit). Wie sich aus lauter vernetzten Einzelnen wieder ein tragfähiges gemeinsames „Wir“ bilden lässt, ist die grosse offene Frage — und die philosophische Orientierung dazu entsteht gerade erst.",
        tour: [
          {
            x: 50,
            y: 50,
            zoom: 1,
            title: "„Blue Marble“ (NASA, 1972)",
            text: "Aufgenommen von der Besatzung der Apollo-17-Mission auf dem Weg zum Mond: die Erde als ganze, runde Kugel, zum ersten Mal so mit eigenen Augen und Kameras von Menschen fotografiert. Das Bild ging um die Welt und veränderte, wie die Menschheit sich selbst und ihren Planeten sieht.",
          },
          {
            x: 50,
            y: 50,
            zoom: 1.7,
            title: "Ein Planet, keine Grenzen",
            text: "Von hier oben sind keine Nationen, keine Grenzen, keine Konflikte zu sehen — nur ein einziger, verletzlicher Planet im schwarzen All. Genau dieser Anblick machte das Bild zur Ikone der Umwelt- und Friedensbewegung: Es zeigt anschaulich die Idee einer gemeinsamen Menschheit.",
          },
          {
            x: 50,
            y: 44,
            zoom: 2,
            title: "Wolken, Meere, Kontinente",
            text: "Wolkenwirbel, Ozeane und Landmassen liegen in einem einzigen Blick beieinander — ein geschlossenes, zusammenhängendes System. Der „Blue Marble“ wurde so zum Bezugspunkt für die Vorstellung eines globalen „Wir“: die Einsicht, dass alles auf diesem Planeten miteinander verbunden ist.",
          },
        ],
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
        label: "Transformer (Maschinelles Lernen) (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Transformer_(Maschinelles_Lernen)",
      },
      {
        label: "Geschichte des Internets (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Geschichte_des_Internets",
      },
    ],
    unrestLead: "Was ist noch echt? Das „Wir“ zerfällt.",
    unrest:
      "Die Verunsicherung ist neuer Art: Bilder, Stimmen und Videos lassen sich täuschend echt fälschen (Deepfakes), Suchergebnisse und Texte sind womöglich maschinell erzeugt. Was ist noch echt, worauf kann man sich verlassen, welche Fähigkeiten lohnen sich noch — und wer hat etwas gemacht: ich, die Maschine, beide? Alles ist vernetzt und beschleunigt sich; viele erleben sich als getrieben, und das gemeinsame „Wir“ droht zu zerfallen.",
    unrestSources: [
      {
        label: "Deepfake (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Deepfake",
      },
    ],
    thinker: "Wir — jetzt",
    schablone: "??? — das suchen wir gerade",
    orientation:
      "Für unsere Zeit entsteht die Antwort gerade erst. Die Philosophie sieht nicht voraus — sie denkt im Blick auf das, was geschieht: Wie sollen wir mit einem nicht-menschlichen Akteur wie der KI umgehen (Bruno Latour), wie leben wir mit dem Technischen verflochten (Donna Haraway, „A Cyborg Manifesto“), woran halten wir moralisch fest (Markus Gabriel)? Die Schablone ist noch offen — genau daran arbeitet dieses Submodul.",
    orientSources: [
      {
        label: "Akteur-Netzwerk-Theorie — Latour (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Akteur-Netzwerk-Theorie",
      },
      {
        label: "Donna Haraway — Manifest für Cyborgs (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Donna_Haraway",
      },
      {
        label: "Markus Gabriel (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Markus_Gabriel",
      },
      {
        label: "Technikphilosophie (Wikipedia)",
        url: "https://de.wikipedia.org/wiki/Technikphilosophie",
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
            <li key={s.id} id={`epoche-${s.id}`} className="flex scroll-mt-[96px] gap-md">
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
