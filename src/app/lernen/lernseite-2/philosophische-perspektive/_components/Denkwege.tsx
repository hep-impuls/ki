"use client";

import { Fragment, useEffect, useState } from "react";
import {
  leseSpurenIndices,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../../_lib/spuren";
import { merkeInhalt } from "../../_lib/inhalte";
import GewichtungWahl from "../../_components/GewichtungWahl";
import KartenAktion from "../../_components/KartenAktion";
import { Begriff } from "../../_components/Glossar";

/**
 * Denkwege — «Wege der Orientierung»: vier Bereiche, in denen die Philosophie
 * beim Umgang mit der KI hilft, als durchklickbare Slides. Jeder Bereich fasst
 * mehrere Denker:innen zusammen, fragt am Ende «Was hilft mir das jetzt?» und
 * bietet pro Person eine aufklappbare Box: eine genauere Beschreibung der
 * Philosophie (mit Hover-Erklärungen für unbekannte Begriffe) und den Knopf
 * «Das verfolge ich weiter» (fliesst ins Orakel).
 *
 *  1. «Was ist der Mensch?» (Aristoteles, Kant, Hegel, Arendt, Heidegger,
 *     Sloterdijk, Hustvedt)
 *  2. «Netzwerke und Systeme» (Nassehi, Latour)
 *  3. «Transformation von Mensch und Maschine» (Latour, Deguchi, Haraway,
 *     Harari, Gabriel) — inkl. Deguchis «We-Turn» (Selbst als Wir) und
 *     Transhumanismus mit religiösen/endzeitlichen Mustern als Gegenschablone.
 *  4. «Lebenskunst» (Stoiker, Foucault, Schmid, Nussbaum, Merleau-Ponty, Rosa) —
 *     das Leben ändern, ja, aber wie?
 *
 * Ein Bereich zählt als Aktivität, sobald man aktiv navigiert (nicht beim
 * Laden). Belege getrennt gepflegt. Nur Theme-Tokens, Material Symbols.
 */

interface Begriffserklaerung {
  wort: string;
  erklaerung: string;
}

interface Denker {
  /** Stabiler Kurzname für die Spur-ID (ascii, keine Umlaute). */
  slug: string;
  name: string;
  leben: string;
  /** Eine Zeile, immer sichtbar (neben den Lebensdaten). */
  these: string;
  /** Genauere Beschreibung der Philosophie, aufklappbar. */
  info: string;
  /** Unbekannte Begriffe im Info-Text (Orte, Figuren, Fachwörter) mit kurzer
   *  Hover-Erklärung; jeweils beim ERSTEN Vorkommen angehängt. */
  begriffe?: Begriffserklaerung[];
}

interface Bereich {
  /** Leitfrage als Titel. */
  titel: string;
  /** Eine Zeile: worum es in diesem Bereich geht. */
  leitfrage: string;
  icon: string;
  /** Die Denker:innen dieses Bereichs (je eine aufklappbare Info-Box). */
  denker: Denker[];
  /** Fliesstext: Grundidee, die Stimmen, neue Begriffe («…»). */
  absaetze: string[];
  /** Die eine Box: Was hilft mir diese Einordnung jetzt? */
  hilft: string;
  /** Quellenzeile (Werke). */
  werk: string;
}

const BEREICHE: Bereich[] = [
  {
    titel: "Was ist der Mensch?",
    leitfrage: "Was uns im Kern ausmacht, ganz unabhängig von der Maschine.",
    icon: "psychology",
    denker: [
      {
        slug: "aristoteles",
        name: "Aristoteles",
        leben: "384 bis 322 v. Chr.",
        these: "Der Mensch strebt von Natur aus nach Wissen.",
        info: "Aristoteles stammte aus Stagira, war Schüler Platons und Lehrer Alexanders des Grossen. Er ordnete das Wissen seiner Zeit über fast alle Gebiete, von Logik und Naturkunde bis Ethik und Politik, und machte die Beobachtung zur Methode. Seine «Metaphysik» beginnt mit dem Satz, alle Menschen strebten von Natur aus nach Wissen: Neugier ist für ihn kein Zufall, sondern Wesenszug. Der Mensch will die Ursachen verstehen, das Warum, nicht nur Fakten sammeln. Für den Umgang mit KI heisst das: Wissen ist mehr als Datenausgabe, es ist verstehen wollen.",
        begriffe: [
          { wort: "Stagira", erklaerung: "Kleine Stadt im Norden des antiken Griechenlands, Geburtsort von Aristoteles." },
          { wort: "Platons", erklaerung: "Platon, athenischer Philosoph (rund 427 bis 347 v. Chr.) und Lehrer von Aristoteles, einer der Begründer der abendländischen Philosophie." },
          { wort: "Alexanders des Grossen", erklaerung: "Alexander der Grosse (356 bis 323 v. Chr.), makedonischer König, der ein Weltreich bis nach Indien eroberte; als Jugendlicher von Aristoteles unterrichtet." },
        ],
      },
      {
        slug: "kant",
        name: "Immanuel Kant",
        leben: "1724 bis 1804",
        these: "Frei und darum verantwortlich.",
        info: "Immanuel Kant lebte sein ganzes Leben in Königsberg und löste mit der «Kritik der reinen Vernunft» eine Wende in der Philosophie aus. Er bündelte sie in vier Fragen, deren letzte, «Was ist der Mensch?», alle anderen zusammenfasst. Seine Antwort: Der Mensch ist vernunftbegabt und frei, er kann aus eigener Einsicht handeln, nicht bloss Trieben oder Befehlen folgen. Aus dieser Freiheit folgen Verantwortung und Würde, für sein Tun kann der Mensch einstehen. Eine Maschine führt Regeln aus, aber sie ist nicht frei und verantwortet nichts, das bleibt beim Menschen.",
        begriffe: [
          { wort: "Königsberg", erklaerung: "Damals ostpreussische Stadt (heute Kaliningrad, Russland); Kant verliess sie zeitlebens fast nie." },
          { wort: "Kritik der reinen Vernunft", erklaerung: "Kants Hauptwerk (1781): Es untersucht, was der Mensch überhaupt erkennen kann und wo die Grenzen des Wissens liegen." },
        ],
      },
      {
        slug: "hegel",
        name: "Georg Wilhelm Friedrich Hegel",
        leben: "1770 bis 1831",
        these: "Denken heisst unterscheiden.",
        info: "Hegel war der Hauptvertreter des deutschen Idealismus und dachte die Wirklichkeit als Entfaltung des «Geistes». Ihr Motor ist das Unterscheiden: Der Geist setzt Gegensätze, hält sie aus und führt sie auf einer höheren Stufe zusammen (verkürzt «These, Antithese, Synthese»). Erst indem der Mensch unterscheidet, was ist und was sein soll, kann er urteilen und sich frei entscheiden. So bekommt gerade das Unterscheiden und Entscheiden eine zutiefst menschliche Seite: Es ist nicht Rechnen, sondern ein bewusster, freier Akt. Hauptwerk: «Phänomenologie des Geistes» (1807).",
        begriffe: [
          { wort: "deutschen Idealismus", erklaerung: "Philosophische Strömung um 1800 (Kant, Fichte, Schelling, Hegel), die Denken und Geist ins Zentrum stellt." },
        ],
      },
      {
        slug: "arendt",
        name: "Hannah Arendt",
        leben: "1906 bis 1975",
        these: "Der Mensch kann neu anfangen.",
        info: "Hannah Arendt, jüdische politische Denkerin, floh vor den Nazis über Frankreich in die USA. Aus der Erfahrung des Totalitarismus fragte sie, was Handeln und Freiheit ausmacht. Ihr Schlüsselbegriff ist die «Natalität»: Weil jeder Mensch geboren wird, kann er etwas Neues anfangen, das aus dem Bisherigen nicht ableitbar ist. Dazu kommt das Urteilen, das eigenständige Prüfen, auch aus der Sicht anderer. Eine KI setzt Wahrscheinliches fort und wiederholt Muster; anfangen und urteilen im menschlichen Sinn kann sie nicht. Werk: «Vita activa».",
        begriffe: [
          { wort: "Totalitarismus", erklaerung: "Herrschaftsform, die das ganze Leben kontrollieren will und keine Freiheit zulässt, etwa NS-Diktatur und Stalinismus." },
          { wort: "«Natalität»", erklaerung: "Arendts Begriff für die Gebürtlichkeit: Weil jeder Mensch neu geboren wird, kann er Neues in die Welt bringen." },
        ],
      },
      {
        slug: "heidegger",
        name: "Martin Heidegger",
        leben: "1889 bis 1976",
        these: "Dem Menschen ist sein Leben nicht gleichgültig.",
        info: "Martin Heidegger, einflussreich und zugleich umstritten wegen seiner Nähe zum Nationalsozialismus, fragte in «Sein und Zeit» neu nach dem Sinn von Sein. Den Menschen nennt er «Dasein», seinen Grundzug die «Sorge»: Uns geht es um unser eigenes Leben, wir kümmern uns, fragen nach Sinn und wissen um unsere Endlichkeit. Einer Maschine ist nichts wichtig, ihr geht es um nichts, sie sorgt sich nicht. Menschlich bleibt dieses Betroffensein vom eigenen Leben, das keine Maschine übernimmt. Hauptwerk: «Sein und Zeit» (1927).",
        begriffe: [
          { wort: "«Dasein»", erklaerung: "Heideggers Wort für den Menschen: das Wesen, dem es um sein eigenes Sein überhaupt geht." },
        ],
      },
      {
        slug: "sloterdijk",
        name: "Peter Sloterdijk",
        leben: "geboren 1947",
        these: "Der Mensch ist ein übendes Wesen.",
        info: "Peter Sloterdijk ist einer der bekanntesten deutschsprachigen Gegenwartsphilosophen, bekannt für die «Sphären»-Trilogie und einen essayistischen, oft provokanten Stil. In «Du musst dein Leben ändern» beschreibt er den Menschen als übendes Wesen: Wir werden, wer wir sind, durch Übung, Wiederholung und Selbstformung, er nennt das «Anthropotechnik». Der Satz ist kein Befehl, sondern der Grundton eines Lebens, das sich immer wieder in Form bringt. Übertragen auf die KI: Eine Maschine kann eine Aufgabe erledigen, aber nicht für uns üben, wer weiter übt, bleibt fähig und urteilsfähig. Werk: «Du musst dein Leben ändern» (2009).",
        begriffe: [
          { wort: "«Anthropotechnik»", erklaerung: "Sloterdijks Wort für die Techniken, mit denen der Mensch an sich selbst arbeitet und sich formt (Üben, Trainieren, Gewohnheiten)." },
        ],
      },
      {
        slug: "hustvedt",
        name: "Siri Hustvedt",
        leben: "geboren 1955",
        these: "Der Geist ist kein Computer.",
        info: "Siri Hustvedt ist US-amerikanische Schriftstellerin und Essayistin, die Literatur mit Hirnforschung und Philosophie verbindet. In «Die Illusion der Gewissheit» wendet sie sich gegen das Bild, das Gehirn sei ein Computer. Denken und Fühlen hängen für sie am lebendigen Körper und an gelebter Erfahrung, sie spricht vom «verkörperten Geist». Eine KI kann Sprache und Gefühle täuschend echt nachahmen, aber sie erlebt nichts, sie macht keine Erfahrung. Ihr «produktiver Zweifel» hilft, das flüssige Modell nicht mit der Wirklichkeit zu verwechseln. Werk: «Die Illusion der Gewissheit» (2018).",
        begriffe: [
          { wort: "«verkörperten Geist»", erklaerung: "Die Idee, dass Denken und Fühlen untrennbar an den lebendigen Körper gebunden sind, nicht bloss ein Rechnen im Kopf." },
        ],
      },
    ],
    absaetze: [
      "«Was ist der Mensch?» Diese Frage ist so alt wie die Philosophie selbst. Schon Aristoteles sah den Menschen als Wesen, das von Natur aus nach Wissen strebt, neugierig, fragend, nie ganz fertig. Immanuel Kant machte die Frage zur Kernfrage überhaupt und gab eine Richtung vor: Der Mensch ist frei, er kann aus eigener Einsicht handeln, und darum trägt er Verantwortung. Georg Wilhelm Friedrich Hegel fügt hinzu, dass der Mensch ein Wesen ist, das unterscheidet. Erst indem wir Gegensätze auseinanderhalten, was ist und was sein soll, können wir urteilen und uns frei entscheiden. So bekommt gerade das Unterscheiden und Entscheiden eine zutiefst menschliche Seite.",
      "Hannah Arendt nennt einen weiteren Wesenszug das Anfangen. Mit jedem Menschen kommt etwas Neues in die Welt, das aus dem Bisherigen nicht ableitbar ist. Und der Mensch urteilt, er hält inne und entscheidet selbst. Martin Heidegger fügt die «Sorge» hinzu: Dem Menschen ist sein eigenes Leben nicht gleichgültig, er kümmert sich, fragt nach Sinn, weiss um seine Endlichkeit.",
      "Peter Sloterdijk beschreibt den Menschen als übendes Wesen. Wir werden, wer wir sind, durch Übung und Wiederholung, und niemand kann für uns üben. Siri Hustvedt erinnert daran, dass der Geist kein Computer ist. Denken und Fühlen hängen am lebendigen Körper und an gelebter Erfahrung. Eine Maschine kann Sprache und Gefühle täuschend echt nachahmen, aber sie erlebt nichts.",
      "Worauf das alles zielt, ist nicht der Vergleich mit der Maschine. Es geht nicht darum, ob eine KI auch anfangen, urteilen oder unterscheiden könnte. Es geht darum, was uns in unserem Wesen ausmacht. Und diese Züge sind nicht etwas, das wir bloss tun, sondern etwas, das wir sind. Wir können gar nicht anders, als neugierig zu sein, anzufangen, zu unterscheiden und uns zu sorgen.",
    ],
    hilft:
      "Wenn dich die schnelle, kluge KI verunsichert, kehr zur Frage zurück, was dich als Mensch ausmacht. Neugier, Anfangen, Urteilen, Sorge, das bleibt deins, ganz gleich, wie gut die Maschine formuliert. Dafür braucht es am Ende ein Grundvertrauen: dass diese Wesenszüge nicht einfach verschwinden, nur weil eine Maschine gute Sätze schreibt.",
    werk: "Aristoteles, «Metaphysik»; Immanuel Kant, «Logik» (1800); G. W. F. Hegel, «Phänomenologie des Geistes» (1807); Hannah Arendt, «Vita activa»; Martin Heidegger, «Sein und Zeit» (1927); Peter Sloterdijk, «Du musst dein Leben ändern» (2009); Siri Hustvedt, «Die Illusion der Gewissheit» (2018)",
  },
  {
    titel: "Netzwerke und Systeme",
    leitfrage: "Wie wir Orientierung finden, wo niemand mehr das Ganze überblickt.",
    icon: "hub",
    denker: [
      {
        slug: "nassehi",
        name: "Armin Nassehi",
        leben: "geboren 1960",
        these: "Die Gesellschaft ist in Mustern gebaut.",
        info: "Armin Nassehi ist ein führender deutscher Soziologe (München) und deutet die Gesellschaft mit der Systemtheorie. In «Muster» dreht er die übliche Frage um: nicht «Was macht die Digitalisierung mit uns?», sondern «Für welches Problem ist sie eine Lösung?». Seine Antwort: Die moderne Gesellschaft ist längst in «Mustern» organisiert, in Statistiken, Zählungen und Abläufen, die auch ohne Gesamtüberblick funktionieren. Genau darin ist die KI stark, sie erkennt Muster hervorragend, versteht aber keinen Sinn. Wer das begreift, sieht die KI nüchterner und weniger bedrohlich. Werk: «Muster» (2019).",
        begriffe: [
          { wort: "Systemtheorie", erklaerung: "Soziologische Theorie, die die Gesellschaft aus dem Zusammenspiel von Teilbereichen wie Wirtschaft, Recht und Politik erklärt." },
        ],
      },
      {
        slug: "latour",
        name: "Bruno Latour",
        leben: "1947 bis 2022",
        these: "Nichts wirkt allein.",
        info: "Bruno Latour war ein weltweit einflussreicher französischer Soziologe und Philosoph, Mitbegründer der Akteur-Netzwerk-Theorie. Danach entsteht Wirkung nie allein, sondern im Netz aus Menschen und Dingen: Ein Türschliesser, ein Formular oder ein Algorithmus wirken im Verbund mit. Er untersuchte, wie Wissenschaft und Gesellschaft ihre Wahrheiten Schritt für Schritt herstellen. Orientierung heisst darum nicht, alles zu überblicken, sondern das eigene Netz zu kennen: Wovon hänge ich ab, was wirkt mit mir zusammen? Werk: «Existenzweisen» (2012).",
        begriffe: [
          { wort: "Akteur-Netzwerk-Theorie", erklaerung: "Latours Ansatz: Wirkung entsteht im Netz aus Menschen und Dingen, nichts handelt für sich allein." },
        ],
      },
    ],
    absaetze: [
      "Moderne Gesellschaften sind unübersichtlich geworden. Niemand überblickt mehr das Ganze, nicht die Wirtschaft, nicht die Verwaltung, nicht die Technik. Aus dem Gefühl, den Überblick verloren zu haben, entsteht schnell Überforderung. Und doch funktioniert erstaunlich vieles: Der Zug fährt, der Lohn kommt, das Spital behandelt. Wie geht das zusammen? Hier helfen zwei Denker, die die Gesellschaft nicht bewerten, sondern erklären.",
      "Armin Nassehi sagt: Unsere Gesellschaft ist längst in «Mustern» gebaut, in Zahlen, Statistiken und Abläufen, die auch ohne einen einzelnen Überblick funktionieren. Kein Mensch muss das Ganze verstehen, damit es läuft, das System trägt sich über seine Muster. Die KI passt genau in diese Welt, denn sie erkennt Muster hervorragend, ohne ihren Sinn zu verstehen. Wer das begreift, sieht die KI nüchterner und weniger bedrohlich.",
      "Bruno Latour ergänzt: Nichts wirkt allein. Jede Handlung hängt an einem Netz aus Menschen, Geräten, Regeln und Gewohnheiten, er nennt es ein Netzwerk von «Akteuren», zu denen auch die Dinge gehören. Orientierung gewinnt man darum nicht, indem man alles überblickt, sondern indem man das eigene Netz kennt: Wovon hänge ich ab, wer und was wirkt hier mit mir zusammen?",
    ],
    hilft:
      "Wenn dich die Komplexität überfordert, musst du nicht das Ganze verstehen. Es reicht, dein Stück des Netzes zu kennen und zu sehen, welche Muster gerade wirken. Das gibt Boden unter den Füssen, auch wenn niemand mehr alles überblickt. Die Gesellschaft funktioniert nicht trotz, sondern wegen dieser verteilten Muster.",
    werk: "Armin Nassehi, «Muster. Theorie der digitalen Gesellschaft» (2019); Bruno Latour, «Existenzweisen» (2012) und die Akteur-Netzwerk-Theorie",
  },
  {
    titel: "Transformation von Mensch und Maschine",
    leitfrage: "Warum sich Mensch und Maschine nicht sauber trennen lassen.",
    icon: "handshake",
    denker: [
      {
        slug: "latour",
        name: "Bruno Latour",
        leben: "1947 bis 2022",
        these: "Das freie Individuum ist eine Illusion.",
        info: "Latour zeigt mit der Akteur-Netzwerk-Theorie auch, dass das ganz freie, unabhängige Individuum eine Illusion ist. Wir handeln nie aus dem Nichts, sondern immer eingebettet in Beziehungen zu Menschen, Werkzeugen, Institutionen und Techniken. Das ist keine Einschränkung, sondern die normale Bedingung des Handelns. Je bewusster man sich die eigenen Abhängigkeiten macht, desto klarer und souveräner wird das eigene Tun, gerade auch im Umgang mit KI.",
        begriffe: [
          { wort: "Akteur-Netzwerk-Theorie", erklaerung: "Latours Ansatz: Wirkung entsteht im Netz aus Menschen und Dingen, nichts handelt für sich allein." },
        ],
      },
      {
        slug: "deguchi",
        name: "Yasuo Deguchi",
        leben: "zeitgenössisch",
        these: "Nicht «ich» handelt, sondern «wir».",
        info: "Yasuo Deguchi ist Philosophieprofessor an der Universität Kyoto und verbindet westliches mit ostasiatischem Denken. Mit seiner «We-Turn»-Philosophie verlegt er das Handeln vom einzelnen «Ich» auf ein «Wir»: Niemand kann etwas ganz allein, jede Handlung wird von vielen getragen, von Menschen, Dingen und heute auch von Maschinen. Der eigentliche Handelnde ist deshalb kein einsames Ich, sondern ein «Selbst als Wir», zu dem die KI dazugehört. Diese Sicht wurzelt im ostasiatischen, buddhistischen Denken, dass nichts für sich allein besteht, sondern alles wechselseitig entsteht. Das entlastet auch: Können und Verantwortung liegen beim «Wir», nicht allein auf den Schultern eines einzelnen Ich.",
        begriffe: [
          { wort: "Kyoto", erklaerung: "Alte Kaiserstadt in Japan, bekannt für ihre Universität und eine eigene philosophische Schule." },
          { wort: "«We-Turn»", erklaerung: "Deguchis Wendung vom «Ich» zum «Wir»: Der eigentliche Handelnde ist ein Wir aus Menschen und Dingen, nicht das einzelne Ich." },
        ],
      },
      {
        slug: "haraway",
        name: "Donna Haraway",
        leben: "geboren 1944",
        these: "Wir sind längst verwoben.",
        info: "Donna Haraway ist US-amerikanische Wissenschaftshistorikerin und feministische Denkerin, ihr «Manifest für Cyborgs» (1985) wurde weltberühmt. Sie denkt Mensch, Tier und Maschine als verwoben: Wir sind in gewissem Sinn schon «Cyborgs», Mischwesen. Statt der Technik als fremder Macht gegenüberzustehen, sollen wir lernen, verantwortlich mit ihr zu leben, sie spricht von «Mit dem Schlamassel bleiben», also die Probleme aushalten und antworten statt fliehen. Damit steht sie Bruno Latour nahe, ergänzt ihn aber um Fürsorge und Verantwortung. Werk: «Unruhig bleiben» (2016).",
        begriffe: [
          { wort: "«Manifest für Cyborgs»", erklaerung: "Haraways berühmter Essay von 1985; das Bild des Cyborgs, eines Mischwesens aus Mensch und Maschine, sprengt die starre Grenze zwischen Mensch, Tier und Technik." },
        ],
      },
      {
        slug: "harari",
        name: "Yuval Noah Harari",
        leben: "geboren 1976",
        these: "Grosse Macht braucht Regeln.",
        info: "Yuval Noah Harari ist ein israelischer Historiker, der mit «Eine kurze Geschichte der Menschheit» und «Homo Deus» weltbekannt wurde. Er erzählt die grossen Linien: wie der Mensch durch gemeinsame Geschichten (Geld, Staaten, Religionen) mächtig wurde und wie Biotechnik und KI ihn nun selbst verändern könnten. Diese Verschmelzung von Mensch und Maschine setzt gewaltige Macht frei, weshalb er eindringlich vor blindem Fortschrittsglauben warnt und klare Regeln fordert. Sein Blick ist weit und mahnend zugleich. Werk: «Homo Deus».",
        begriffe: [
          { wort: "Biotechnik", erklaerung: "Technik, die in Lebendiges eingreift, etwa in Gene, Körper und Gehirn." },
          { wort: "«Homo Deus»", erklaerung: "Hararis Bestseller (2015): Ausblick, wie Biotechnik und KI den Menschen selbst umbauen könnten (wörtlich «Gott-Mensch»)." },
        ],
      },
      {
        slug: "gabriel",
        name: "Markus Gabriel",
        leben: "geboren 1980",
        these: "Die KI ist ein Spiegel, entscheiden musst du.",
        info: "Markus Gabriel wurde sehr jung Philosophieprofessor in Bonn und ist ein Hauptvertreter des «Neuen Realismus». Er nennt die KI einen «magischen Spiegel»: Sie erkennt in unseren Daten Muster, auch unsere Werte und Gewohnheiten, manchmal genauer, als wir uns selbst kennen. Die eigentliche Revolution ist für ihn darum nicht technisch, sondern ethisch. Sein Vorschlag ist ein «dritter Weg» zwischen Alles-verbieten und Alles-erlauben, die «ethische Intelligenz», also klug und moralisch mitzugestalten. Nicht die Maschine steht auf dem Prüfstand, sondern wir. Werk: «Ethische Intelligenz».",
        begriffe: [
          { wort: "«Neuen Realismus»", erklaerung: "Von Markus Gabriel mitbegründete Richtung: Die Welt und auch Werte sind wirklich, nicht bloss Ansichtssache." },
        ],
      },
    ],
    absaetze: [
      "Mensch und Maschine lassen sich nicht mehr sauber auseinanderdividieren. Wir tippen, suchen, planen und entscheiden längst mit Geräten zusammen. Schon Bruno Latour zeigt, warum das kein neuer Sonderfall ist: Das ganz freie Individuum, das egoistisch nur tut, was es will, hat es nie gegeben. Wir stecken immer in Abhängigkeiten, von Menschen, Werkzeugen, Institutionen. Je klarer man sich diese Abhängigkeiten bewusst macht, desto verständlicher wird das eigene Tun.",
      "Der japanische Philosoph Yasuo Deguchi treibt diesen Gedanken weiter. Seine «We-Turn»-Philosophie verlegt das Handeln vom einzelnen «Ich» auf ein «Wir». Niemand kann etwas ganz allein, jede Handlung wird von vielen anderen getragen, von Menschen, Dingen und heute auch von Maschinen. Der eigentliche Handelnde ist deshalb kein einsames Ich, sondern ein «Wir», zu dem die KI dazugehört. Diese Sicht wurzelt im ostasiatischen Denken, in der buddhistischen Einsicht, dass nichts für sich allein besteht, sondern alles miteinander verbunden entsteht.",
      "Was folgt daraus? Donna Haraway sagt, wir sind längst «verwoben», in gewissem Sinn schon Mischwesen aus Mensch und Maschine, und sollten das verantwortlich gestalten. Yuval Noah Harari mahnt, dass diese Verschmelzung gewaltige Macht freisetzt und darum klare Regeln braucht. Markus Gabriel setzt auf «ethische Intelligenz», das kluge, moralische Mitgestalten. Zwei Wege zeichnen sich ab: sich auf die Zusammenarbeit einlassen oder den eigenen Weg umso deutlicher markieren, beides gestützt durch Regulation und Ethik.",
      "Am äussersten Rand steht der «Transhumanismus», die Idee, den Menschen durch Technik grenzenlos zu steigern, vielleicht sogar den Tod zu überwinden. Zum Einordnen helfen zwei ältere Muster als Gegenschablone. Zum einen die religiösen Heilsversprechen, denen der Transhumanismus verblüffend ähnelt, nur dass hier die Technik die Erlösung bringen soll. Zum anderen die endzeitlichen Untergangserzählungen, in denen die KI alles auslöscht. Beides, Erlösung wie Weltuntergang, sind grosse, alte Geschichten. Wer sie erkennt, fällt weder auf den Hype noch auf die Panik herein.",
    ],
    hilft:
      "Du musst dich nicht zwischen Verschmelzung und Verweigerung entscheiden. Es hilft schon, die eigenen Abhängigkeiten zu kennen und zu sehen, dass du immer in einem «Wir» handelst. Zwischen dem Heilsversprechen «Technik rettet uns» und dem Untergang «KI zerstört uns» liegt der nüchterne Alltag, den Regeln und Ethik gestaltbar machen.",
    werk: "Yasuo Deguchi, «We-Turn»-Philosophie (Selbst als Wir); Donna Haraway, «Unruhig bleiben» (2016); Yuval Noah Harari, «Homo Deus»; Markus Gabriel, «Ethische Intelligenz»; mit Bruno Latour, Akteur-Netzwerk-Theorie",
  },
  {
    titel: "Lebenskunst",
    leitfrage: "Das Leben ändern, ja, aber wie?",
    icon: "self_improvement",
    denker: [
      {
        slug: "stoiker",
        name: "Die Stoiker",
        leben: "Antike",
        these: "Übe, was in deiner Macht steht.",
        info: "Die Stoa war eine der grossen Schulen der Antike; bekannte Vertreter sind der Sklave Epiktet, der Staatsmann Seneca und der Kaiser Mark Aurel. Für sie ist Philosophie kein blosses Wissen, sondern tägliche Übung («Askesis», ursprünglich Übung, nicht Verzicht). Ihr Kern ist die Unterscheidung zwischen dem, was in unserer Macht steht (unser Urteil, unser Handeln), und dem, was nicht (Ereignisse, Meinungen anderer). Gelassenheit entsteht, wenn man seine Kraft auf das Erste richtet. Ein gutes Leben wächst so aus beständiger kleiner Übung, nicht aus einer einmaligen Einsicht.",
        begriffe: [
          { wort: "Stoa", erklaerung: "Antike Philosophenschule (ab rund 300 v. Chr.), benannt nach einer bemalten Säulenhalle in Athen." },
          { wort: "Epiktet", erklaerung: "Griechischer Stoiker (rund 50 bis 138 n. Chr.), als Sklave geboren, später gefeierter Lehrer." },
          { wort: "Seneca", erklaerung: "Römischer Staatsmann und Stoiker (rund 1 bis 65 n. Chr.), Berater des Kaisers Nero." },
          { wort: "Mark Aurel", erklaerung: "Römischer Kaiser (121 bis 180 n. Chr.) und Stoiker; seine «Selbstbetrachtungen» sind bis heute berühmt." },
          { wort: "«Askesis»", erklaerung: "Griechisch für Übung, Training, nicht Verzicht: Philosophie als tägliche Praxis." },
        ],
      },
      {
        slug: "foucault",
        name: "Michel Foucault",
        leben: "1926 bis 1984",
        these: "Sich selbst formen wie ein Kunstwerk.",
        info: "Michel Foucault war ein französischer Philosoph, der untersuchte, wie Macht und Wissen unser Leben prägen (in Gefängnis, Klinik, Sexualität). In seinem Spätwerk entdeckte er die antike «Sorge um sich selbst» wieder: sich um das eigene Leben kümmern und es bewusst gestalten. Er nennt das eine «Ästhetik der Existenz», das Leben formen wie ein Kunstwerk. Es geht nicht darum, fremden Normen zu gehorchen, sondern die eigene Lebensform aktiv zu wählen und einzuüben. Werk: «Die Sorge um sich» (1984).",
        begriffe: [
          { wort: "«Ästhetik der Existenz»", erklaerung: "Foucaults Idee, das eigene Leben bewusst zu gestalten wie ein Kunstwerk, statt bloss Regeln zu befolgen." },
        ],
      },
      {
        slug: "schmid",
        name: "Wilhelm Schmid",
        leben: "geboren 1953",
        these: "Das Leben ändern, aber wie? In kleinen Schritten.",
        info: "Wilhelm Schmid ist ein freier Philosoph in Berlin und hat die «Philosophie der Lebenskunst» im deutschsprachigen Raum bekannt gemacht. Sein Thema: Aus einer Einsicht folgt noch keine Tat, das kennt jeder von den guten Vorsätzen. Was hilft, ist Übung in kleinsten Schritten, täglich, fast beiläufig, aber regelmässig, nicht das ganze Buch auf einmal, sondern jeden Tag eine Seite. Weil Freude stärker wirkt als Zwang, soll man sich am Schönen orientieren, zu dem man Ja sagen kann. So werden neue Gewohnheiten gebildet, im Schnitt in rund zwei Monaten. Werk: «Philosophie der Lebenskunst» (1998).",
      },
      {
        slug: "nussbaum",
        name: "Martha Nussbaum",
        leben: "geboren 1947",
        these: "Gefühle gehören zum guten Leben.",
        info: "Martha Nussbaum ist eine der bekanntesten US-amerikanischen Philosophinnen und verbindet antike Ethik (besonders Aristoteles und die Stoa) mit heutigen Fragen. Sie zeigt, dass Gefühle keine blosse Störung der Vernunft sind, sondern zu einem guten Urteil und einem gelingenden Leben dazugehören. Mit dem «Fähigkeiten-Ansatz» fragt sie konkret, was Menschen wirklich können müssen, um gut zu leben (etwa Gesundheit, Bildung, Bindung, Spiel), und wie eine Gesellschaft das ermöglichen soll. Lebenskunst heisst darum auch, die eigenen Gefühle ernst zu nehmen und gute Bedingungen zu schaffen. Werk: «Fähigkeiten schaffen» (2011).",
        begriffe: [
          { wort: "«Fähigkeiten-Ansatz»", erklaerung: "Nussbaums Frage, was Menschen konkret können müssen, um gut zu leben (Gesundheit, Bildung, Bindung, Spiel), und was eine Gesellschaft dafür schulden." },
        ],
      },
      {
        slug: "merleau-ponty",
        name: "Maurice Merleau-Ponty",
        leben: "1908 bis 1961",
        these: "Wir verstehen die Welt mit dem Leib.",
        info: "Maurice Merleau-Ponty war ein französischer Philosoph der Phänomenologie. Sein Thema ist der Leib: Wir erfahren die Welt nicht zuerst mit dem Kopf, sondern leiblich, durch Wahrnehmung, Bewegung, Berührung und Gefühl. Der Körper ist kein Ding, das wir bloss «haben», sondern die Art, wie wir zur Welt gehören. Verstehen und ein gutes Leben sind darum verkörpert, nicht rein rechnerisch. Genau das kann eine körperlose KI nicht: Sie verarbeitet Zeichen, aber sie spürt und leibt nicht. Werk: «Phänomenologie der Wahrnehmung» (1945).",
        begriffe: [
          { wort: "Phänomenologie", erklaerung: "Philosophische Richtung, die genau beschreibt, wie uns die Dinge erscheinen und wie wir sie leiblich erleben." },
        ],
      },
      {
        slug: "rosa",
        name: "Hartmut Rosa",
        leben: "geboren 1965",
        these: "Resonanz statt Kontrolle.",
        info: "Hartmut Rosa ist ein deutscher Soziologe, bekannt für die Diagnose der gesellschaftlichen «Beschleunigung». Dagegen setzt er den Begriff «Resonanz»: Ein gelingendes Leben entsteht nicht durch mehr Kontrolle, mehr Tempo und mehr Verfügbarkeit, sondern durch ein lebendiges, wechselseitiges Antworten zwischen Mensch und Welt, ein Berührtwerden. Vieles, was zählt, lässt sich gerade nicht erzwingen oder verfügbar machen, es muss einem begegnen. In einer Welt schneller KI erinnert er daran, das Sich-berühren-Lassen nicht zu verlernen. Werke: «Resonanz» (2016), «Unverfügbarkeit» (2018).",
        begriffe: [
          { wort: "«Beschleunigung»", erklaerung: "Rosas Diagnose, dass in der Moderne alles immer schneller wird: Technik, Arbeit, Lebenstempo." },
          { wort: "«Resonanz»", erklaerung: "Bei Rosa ein antwortendes, lebendiges Verhältnis zur Welt, das sich nicht erzwingen lässt, Gegenbegriff zur blossen Beschleunigung." },
        ],
      },
    ],
    absaetze: [
      "«Du musst dein Leben ändern», heisst es in einem berühmten Gedicht von Rainer Maria Rilke. Ja, aber wie? Das ist die Grundfrage der Lebenskunst. Denn aus einer Einsicht folgt noch lange keine Tat, jeder kennt das von den guten Vorsätzen an Silvester, die am Neujahrsmorgen schon wieder verblasst sind. Dieser Bereich fragt nicht, was der Mensch ist, sondern wie er sein Leben tatsächlich gestalten und ändern kann.",
      "Schon die Stoiker wussten: Philosophie ist tägliche Übung, nicht blosses Wissen. Das griechische Wort dafür ist «Askesis», Übung, nicht Verzicht. Michel Foucault nannte das die «Sorge um sich selbst», das Leben bewusst formen wie ein Kunstwerk. Und der Lebenskunst-Philosoph Wilhelm Schmid zeigt konkret, wie: in kleinsten Schritten, täglich, fast beiläufig, aber regelmässig. Nicht das ganze Buch auf einmal, sondern jeden Tag eine Seite. So wird aus einem Vorsatz allmählich eine neue Gewohnheit.",
      "Dabei zählt nicht nur der Kopf. Martha Nussbaum erinnert daran, dass Gefühle zum guten Leben gehören, und Maurice Merleau-Ponty, dass wir die Welt leiblich verstehen, durch Körper und Wahrnehmung. Genau darum wirkt Schönes stärker als Zwang: Wer sich an etwas orientiert, zu dem er Ja sagen kann, verändert sich lieber. Hartmut Rosa nennt dieses lebendige Verhältnis zur Welt «Resonanz».",
      "Und die KI? Sie kann bei der Umsetzung helfen, etwa eine App, die an die kleinen Übungen erinnert und Fortschritte zeigt. Aber gehen muss man den Weg selbst. Eine Spritze oder ein Klick nimmt die Anstrengung ab, doch das eingeübte, selbst gestaltete Leben ersetzt sie nicht. Lebenskunst bleibt Menschensache.",
    ],
    hilft:
      "Wenn du etwas ändern willst, warte nicht auf den grossen Ruck. Nimm dir den kleinstmöglichen Schritt vor, jeden Tag einen, und knüpfe ihn an etwas Schönes, zu dem du Ja sagst. Die KI darf dich erinnern und begleiten, aber die Übung, und damit dein Leben, gestaltest du selbst.",
    werk: "Wilhelm Schmid, «Philosophie der Lebenskunst» (1998); Michel Foucault, «Die Sorge um sich» (1984); Martha Nussbaum, «Fähigkeiten schaffen» (2011); Maurice Merleau-Ponty, «Phänomenologie der Wahrnehmung» (1945); Hartmut Rosa, «Resonanz» (2016); dazu die Stoiker (Epiktet, Seneca, Mark Aurel)",
  },
];

const GEW_PREFIX = "philosophische-perspektive:orientierung-hilft";
const GEW_STUFEN: [string, string, string] = ["kaum", "etwas", "stark"];

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Info-Text mit Hover-Erklärungen: Das ERSTE Vorkommen jedes angegebenen
 * Begriffs wird als <Begriff> mit Tooltip gerendert (gleiche Optik wie das
 * Glossar). Ohne `begriffe` einfacher Text.
 */
function InfoText({
  text,
  begriffe,
}: {
  text: string;
  begriffe?: Begriffserklaerung[];
}) {
  if (!begriffe || begriffe.length === 0) return <>{text}</>;
  const map = new Map(begriffe.map((b) => [b.wort, b.erklaerung]));
  const terme = [...map.keys()].sort((a, b) => b.length - a.length);
  const re = new RegExp(`(${terme.map(escapeRegExp).join("|")})`, "g");
  const teile: React.ReactNode[] = [];
  const verwendet = new Set<string>();
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const wort = m[1];
    if (verwendet.has(wort)) continue;
    verwendet.add(wort);
    if (m.index > last) teile.push(text.slice(last, m.index));
    teile.push(<Begriff key={m.index} wort={wort} erklaerung={map.get(wort)!} />);
    last = m.index + wort.length;
  }
  if (last < text.length) teile.push(text.slice(last));
  return (
    <>
      {teile.map((t, i) => (
        <Fragment key={i}>{t}</Fragment>
      ))}
    </>
  );
}

export default function Denkwege({
  spurKey,
  className = "",
}: {
  /** Spur-Präfix, z.B. "philosophische-perspektive:denkwege". */
  spurKey: string;
  className?: string;
}) {
  const gesamt = BEREICHE.length;
  const [idx, setIdx] = useState(0);
  const [gesehen, setGesehen] = useState<Set<number>>(new Set());
  /* Aufgeklappte Info-Boxen, Schlüssel «bereichIdx-denkerIdx». */
  const [offeneBox, setOffeneBox] = useState<Set<string>>(new Set());

  useEffect(() => {
    function restore() {
      const seen = leseSpurenIndices(spurKey).filter((i) => i >= 0 && i < gesamt);
      if (seen.length === 0) return;
      setGesehen((prev) => {
        const nx = new Set(prev);
        seen.forEach((i) => nx.add(i));
        return nx;
      });
    }
    restore();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [spurKey, gesamt]);

  useEffect(() => {
    BEREICHE.forEach((b, i) => merkeInhalt(`${spurKey}:${i}`, b.titel));
  }, [spurKey]);

  function geheZu(ziel: number) {
    const i = Math.max(0, Math.min(gesamt - 1, ziel));
    const neu = [idx, i].filter((n) => !gesehen.has(n));
    if (neu.length > 0) {
      neu.forEach((n) => merkeSpur(`${spurKey}:${n}`));
      setGesehen((prev) => {
        const nx = new Set(prev);
        neu.forEach((n) => nx.add(n));
        return nx;
      });
    }
    setIdx(i);
  }

  function boxUmschalten(key: string) {
    setOffeneBox((prev) => {
      const nx = new Set(prev);
      if (nx.has(key)) nx.delete(key);
      else nx.add(key);
      return nx;
    });
  }

  const b = BEREICHE[idx];

  return (
    <section aria-label="Wege der Orientierung" className={className}>
      <div className="mb-md flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px] text-tertiary">
          {gesehen.size === gesamt ? "done_all" : "explore"}
        </span>
        {gesehen.size === 0
          ? `${gesamt} Bereiche, klick dich durch`
          : `${gesehen.size} von ${gesamt} Bereichen angeschaut`}
      </div>

      <div className="rounded-2xl border border-outline-variant bg-surface-bright p-md sm:p-lg">
        <div className="flex flex-wrap items-center justify-between gap-sm">
          <span className="inline-flex items-center gap-xs rounded-full bg-tertiary-container/50 px-sm py-xs text-label-sm text-on-tertiary-container">
            Orientierung
          </span>
          <span className="text-label-sm text-on-surface-variant">
            Bereich {idx + 1} von {gesamt}
          </span>
        </div>

        <div className="mt-md flex items-start gap-md">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container">
            <span className="material-symbols-outlined text-[24px]">{b.icon}</span>
          </span>
          <div className="min-w-0">
            <h3 className="text-headline-sm text-on-surface">{b.titel}</h3>
            <p className="mt-xs text-body-sm text-on-surface-variant">{b.leitfrage}</p>
          </div>
        </div>

        {/* Fliesstext: Grundidee, die Stimmen, neue Begriffe («…») */}
        <div className="mt-md space-y-sm text-body-md leading-relaxed text-on-surface-variant">
          {b.absaetze.map((absatz, i) => (
            <p key={i}>{absatz}</p>
          ))}
        </div>

        {/* Pro Person eine aufklappbare Box: genauere Beschreibung (mit
            Hover-Erklärungen) + der Knopf «Das verfolge ich weiter». */}
        <div className="mt-lg">
          <p className="mb-sm flex items-center gap-xs text-label-sm uppercase tracking-wider text-tertiary">
            <span className="material-symbols-outlined text-[16px]">groups</span>
            Die Stimmen, zum Nachgehen
          </p>
          <div className="overflow-hidden rounded-xl border border-outline-variant">
            {b.denker.map((p, i) => {
              const key = `${idx}-${i}`;
              const auf = offeneBox.has(key);
              return (
                <div key={p.slug} className={i > 0 ? "border-t border-outline-variant" : ""}>
                  <button
                    type="button"
                    onClick={() => boxUmschalten(key)}
                    aria-expanded={auf}
                    className="flex w-full items-center gap-sm px-sm py-sm text-left outline-none transition-colors hover:bg-surface-container focus-visible:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-[20px] text-tertiary">
                      record_voice_over
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-body-md font-medium text-on-surface">
                        {p.name}
                      </span>
                      <span className="block text-label-sm text-on-surface-variant">
                        {p.leben} · {p.these}
                      </span>
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
                    <div className="animate-frame-in px-sm pb-md pl-[2.75rem]">
                      <p className="text-body-sm leading-relaxed text-on-surface-variant">
                        <InfoText text={p.info} begriffe={p.begriffe} />
                      </p>
                      <KartenAktion
                        wunschId={`wunsch:philosophische-perspektive:denker:${idx}:${p.slug}`}
                        titel={`${p.name}: ${p.these}`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Die eine Box: Was hilft mir diese Einordnung jetzt? */}
        <div className="mt-lg rounded-xl bg-tertiary-container/40 p-md sm:p-lg">
          <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-on-tertiary-container">
            <span className="material-symbols-outlined text-[18px]">explore</span>
            Was dir das jetzt hilft
          </p>
          <p className="mt-xs text-body-md leading-relaxed text-on-surface">{b.hilft}</p>
        </div>

        {/* Bewertung */}
        <GewichtungWahl
          className="mt-md border-t border-outline-variant pt-md"
          prefix={GEW_PREFIX}
          index={idx}
          frage="Wie sehr hilft dir dieser Zugang, dich zu orientieren?"
          stufen={GEW_STUFEN}
        />

        {/* Quelle */}
        <p className="mt-md flex items-start gap-xs text-label-sm text-on-surface-variant opacity-80">
          <span className="material-symbols-outlined text-[15px]">menu_book</span>
          <span className="min-w-0">{b.werk}</span>
        </p>

        {/* Navigation */}
        <div className="mt-lg flex items-center justify-between gap-sm">
          <button
            type="button"
            onClick={() => geheZu(idx - 1)}
            disabled={idx === 0}
            className="inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright px-md py-xs text-label-md text-on-surface transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Zurück
          </button>
          <div className="flex flex-wrap items-center justify-center gap-xs">
            {BEREICHE.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => geheZu(i)}
                aria-label={`Bereich ${i + 1}`}
                className={
                  "h-2.5 rounded-full transition-all " +
                  (i === idx
                    ? "w-5 bg-tertiary"
                    : gesehen.has(i)
                      ? "w-2.5 bg-tertiary/50"
                      : "w-2.5 bg-outline-variant")
                }
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => geheZu(idx + 1)}
            disabled={idx === gesamt - 1}
            className="inline-flex items-center gap-xs rounded-full bg-tertiary px-md py-xs text-label-md text-on-tertiary transition hover:bg-on-tertiary-container disabled:cursor-not-allowed disabled:opacity-40"
          >
            Weiter
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
