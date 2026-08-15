"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  leseSpuren,
  leseSpurenIndices,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../../_lib/spuren";
import { merkeInhalt } from "../../_lib/inhalte";
import { merkeVertiefung } from "../../_lib/vertiefung";
import Ausklapptext from "../../_components/Ausklapptext";
import GewichtungWahl from "../../_components/GewichtungWahl";
import KartenAktion from "../../_components/KartenAktion";
import { Begriff, BelegStelle } from "../../_components/Glossar";
import { BELEG_NACH_ANKER, type Beleg } from "../../_data/belege";

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
  /**
   * Fallbeispiel aus dem Alltag heutiger Jugendlicher, hinter einem eigenen
   * Knopf «Fallbeispiel». Der Einstieg über die Info bleibt theoretisch; hier
   * wird der Gedanke an einer Situation greifbar, die man kennt.
   *
   * Zählt beim ersten Aufklappen als **Vertiefung** («Mehr lesen») und
   * erscheint darum im Rhizom, in der Knotenkarte und im Orakel — dieselbe
   * Handlung wie das Aufklappen einer Vertiefung im Teppich.
   */
  beispiel?: string;
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
  /** Namen/Begriffe im Fliesstext mit Hover-Kurzerklärung (erstes Vorkommen
   *  je Absatz). */
  absatzBegriffe?: Begriffserklaerung[];
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
    absatzBegriffe: [
      { wort: "Aristoteles", erklaerung: "Griechischer Philosoph, 384 bis 322 v. Chr.; prägte die formale Logik und die Beobachtung als Methode." },
      { wort: "Immanuel Kant", erklaerung: "Deutscher Philosoph, 1724 bis 1804; einer der wirkmächtigsten überhaupt." },
      { wort: "Georg Wilhelm Friedrich Hegel", erklaerung: "Deutscher Philosoph, 1770 bis 1831; Hauptvertreter des deutschen Idealismus." },
      { wort: "Hannah Arendt", erklaerung: "Deutsch-amerikanische politische Philosophin, 1906 bis 1975." },
      { wort: "Martin Heidegger", erklaerung: "Deutscher Philosoph, 1889 bis 1976; Hauptwerk «Sein und Zeit». NSDAP-Mitglied von 1933 bis 1945, sein Werk wird darum kontrovers diskutiert." },
      { wort: "Peter Sloterdijk", erklaerung: "Deutscher Gegenwartsphilosoph, geboren 1947." },
      { wort: "Siri Hustvedt", erklaerung: "US-amerikanische Schriftstellerin und Essayistin, geboren 1955." },
    ],
    denker: [
      {
        slug: "aristoteles",
        name: "Aristoteles",
        leben: "384 bis 322 v. Chr.",
        these: "Der Mensch strebt von Natur aus nach Wissen.",
        info: "Aristoteles stammte aus Stagira, war Schüler Platons und Lehrer Alexanders des Grossen. Er ordnete das Wissen seiner Zeit über fast alle Gebiete, von Logik und Naturkunde bis Ethik und Politik und machte die Beobachtung zur Methode. Seine «Metaphysik» beginnt mit dem Satz, alle Menschen strebten von Natur aus nach Wissen. Neugier ist für ihn kein Zufall, sondern ein Wesenszug. Der Mensch will die Ursachen verstehen, das Warum, nicht nur Fakten sammeln. Wissen ist darum auch im Umgang mit KI mehr als Datenausgabe, es ist verstehen wollen.",
        begriffe: [
          { wort: "Stagira", erklaerung: "Kleine Stadt im Norden des antiken Griechenlands, Geburtsort von Aristoteles." },
          { wort: "Platons", erklaerung: "Platon, athenischer Philosoph (rund 427 bis 347 v. Chr.) und Lehrer von Aristoteles, einer der Begründer der abendländischen Philosophie." },
          { wort: "Alexanders des Grossen", erklaerung: "Alexander der Grosse (356 bis 323 v. Chr.), makedonischer König, der ein Weltreich bis nach Indien eroberte; als Jugendlicher von Aristoteles unterrichtet." },
          { wort: "Staunen", erklaerung: "Bei Aristoteles der Anfang aller Philosophie. Etwas fällt dir auf und du kannst es dir nicht erklären. Aus diesem Zustand entsteht die Frage." },
        ],
        beispiel:
          "Am 12. August 2026 wurde in der Schweiz die Sonne zu über 90 Prozent verdeckt. Schon Tage vorher waren die Schutzbrillen ausverkauft. Ein Optiker in Basel hatte hundert Stück bestellt und alle verkauft, auf Verkaufsplattformen schnellten die Preise für eine Brille hoch, die im Laden fünf bis sechs Franken kostete.\n\nMan kann bezweifeln, dass das Streben nach Wissen wirklich in unserer Natur liegt. Vielleicht wollen wir nur wissen, was nützlich ist, und alles andere lernen wir, weil jemand es verlangt. Dieser Abend spricht dagegen. Es gab keine Note dafür und keinen Nutzen, niemand musste die Leute auffordern. Sie bezahlten von sich aus dafür, etwas sehen zu dürfen, das nichts einbringt.\n\nGenau das nennt Aristoteles das Staunen. Etwas fällt dir auf und du willst wissen, warum. Die erste Antwort findet man heute in Sekunden, der Mond schiebt sich zwischen Erde und Sonne. Interessant wird es danach. Warum passiert das nicht jeden Monat? Weil die Mondbahn gegen die Bahnebene der Erde geneigt ist, um etwa fünf Grad, und der Schatten uns darum selten trifft. Warum bleibt manchmal ein Ring stehen? Weil der Mond dann zu weit weg ist, um die Sonne ganz zu decken. Wann ist in der Schweiz wieder eine totale Finsternis zu sehen? Erst 2081. Jede Antwort öffnet die nächste Frage. Dass eine KI dir diese erste Antwort sofort gibt, nimmt dir nichts weg, sie bringt dich schneller an die Stelle, wo es dich wirklich interessiert.",
      },
      {
        slug: "kant",
        name: "Immanuel Kant",
        leben: "1724 bis 1804",
        these: "Frei und darum verantwortlich.",
        info: "Immanuel Kant lebte sein ganzes Leben in Königsberg und löste mit der «Kritik der reinen Vernunft» eine Wende in der Philosophie aus. Er bündelte sie in vier Fragen, deren letzte, «Was ist der Mensch?», alle anderen zusammenfasst. Er antwortet, der Mensch sei vernunftbegabt und frei, könne aus eigener Einsicht handeln und folge nicht bloss Trieben oder Befehlen. Aus dieser Freiheit folgen Verantwortung und Würde, für sein Tun kann der Mensch einstehen. Entscheidend ist ihm dabei der Unterschied zwischen Befolgen und Einsehen. Wer eine Regel nur befolgt, weil sie befohlen ist, handelt für Kant noch nicht frei. Frei handelt, wer die Regel selbst als richtig erkennt und ihr darum folgt.",
        begriffe: [
          {
            wort: "Landsgemeinde",
            erklaerung:
              "Versammlung aller Stimmberechtigten unter freiem Himmel, in Glarus am ersten Sonntag im Mai. Abgestimmt wird im offenen Handmehr und jede stimmberechtigte Person darf das Wort verlangen, einen Antrag ändern oder ablehnen.",
          },
          {
            wort: "ausgemehrt",
            erklaerung:
              "An der Landsgemeinde werden keine Zettel gezählt. Die Leitung schätzt vom Podium aus, auf welcher Seite die erhobenen Hände in der Mehrheit sind. Ist das nicht klar, wird noch einmal gemehrt, 2007 dreimal.",
          },
          { wort: "Königsberg", erklaerung: "Damals ostpreussische Stadt (heute Kaliningrad, Russland); Kant verliess sie zeitlebens fast nie." },
          { wort: "Kritik der reinen Vernunft", erklaerung: "Kants Hauptwerk (1781). Es untersucht, was der Mensch überhaupt erkennen kann und wo die Grenzen des Wissens liegen." },
        ],
        beispiel:
          "Am 6. Mai 2007 regnete es in Glarus aus Kübeln. Michael Pesaballe, damals 20 und aus Oberurnen, hatte seine Maturaarbeit dem Stimmrechtsalter 16 gewidmet und stand nun an der Landsgemeinde, um für den Antrag zu reden. Der Entscheid war knapp, dreimal musste ausgemehrt werden, dann stand es fest. In Glarus stimmt und wählt man ab 16. Gewählt werden darf man weiterhin erst ab 18. Bis heute ist Glarus der einzige Kanton, der das eingeführt hat. Im Aargau sagten die Stimmenden 2024 mit knapp 80 Prozent Nein.\n\nAb wann jemand mitentscheiden darf, ist überall anders festgelegt, in Österreich, auf Malta und in Brasilien ab 16, in Indonesien ab 17, in den meisten Ländern ab 18. Die Zahl wird gesetzt, nicht gefunden. Kant hat für die Sache ein anderes Wort, Mündigkeit, und er meint damit nichts, was ein Gesetz festlegen könnte. Unmündig ist für ihn, wer seinen Verstand nicht ohne die Leitung eines anderen gebraucht, und schuld daran ist nach ihm meist nicht fehlender Verstand, sondern fehlender Mut. Man kann also abstimmen dürfen und trotzdem andere entscheiden lassen. Und man kann mit 16 Gründe haben.\n\nGenau um diesen Unterschied geht es Kant, eine Regel befolgen oder sie einsehen. An einer Landsgemeinde hebt man die Hand offen, alle sehen es und jemand kann fragen, warum. «Weil es alle so machen» ist dann keine Antwort. Pesaballe hat Leute überzeugt, die ihn hätten überstimmen können. Für die bequeme Seite hat Kant ein Bild, das heute verblüffend nah klingt: ein Buch, das für mich Verstand hat, ein Arzt, der für mich die Diät beurteilt, dann muss ich mich nicht selbst bemühen. Eine KI, die dir die Begründung schreibt, ist nicht verboten und oft nützlich. Der Unterschied zeigt sich erst, wenn jemand nachfragt, denn verteidigen kannst du nur einen Grund, den du selbst verstanden hast.",
      },
      {
        slug: "hegel",
        name: "Georg Wilhelm Friedrich Hegel",
        leben: "1770 bis 1831",
        these: "Denken heisst unterscheiden.",
        info: "Hegel war der Hauptvertreter des deutschen Idealismus und dachte die Wirklichkeit als Entfaltung des «Geistes». Stark verkürzt lässt sich seine Dialektik als Bewegung beschreiben, in der ein Begriff an seinen eigenen inneren Spannungen weiterbestimmt wird. Die berühmte Formel «These, Antithese, Synthese» stammt übrigens nicht von Hegel und trifft sein Verfahren nicht durchgehend, als erste Merkhilfe taugt sie aber. So kommt das Unterscheiden ins Spiel. Ein Gedanke wird nicht dadurch weitergebracht, dass man ihn ganz verwirft, sondern dadurch, dass man an ihm unterscheidet, was hält und was nicht. Hegel nennt das die bestimmte Negation. Was etwas ist, steht darum nicht ein für alle Mal fest, es klärt sich in einem geschichtlichen Gang. Marx baute darauf seine Kritik des Kapitalismus auf und für Adorno wurde dieser Gedanke zum Schlüsselbegriff der Gesellschaftskritik. Später wurde er gegen die Grenzen selbst gewendet. Wenn eine Grenze gezogen wird, dann ist sie gemacht und dann könnte sie auch anders verlaufen. Was selbstverständlich wirkt, hat oft nur eine Geschichte und darum darf man darüber streiten. Das trifft die Grenze zwischen Mensch und Maschine mit. Donna Haraway, weiter unten im Kapitel, hält sie nicht für gefunden, sondern für gezogen und ihr Bild des Cyborgs sprengt die starre Trennung. Erst indem der Mensch auseinanderhält, was ist und was sein soll, kann er urteilen und sich entscheiden. Von hier aus gelesen ist Unterscheiden etwas anderes als Rechnen. Ein Modell lernt aus vielen Beispielen, was gewöhnlich zusammen auftritt. Eine Bestimmung dagegen zieht eine Grenze mit Gründen und genau darum lässt sie sich auch bestreiten. Hauptwerk: «Phänomenologie des Geistes» (1807).",
        begriffe: [
          { wort: "deutschen Idealismus", erklaerung: "Philosophische Strömung um 1800 (Kant, Fichte, Schelling, Hegel), die Denken und Geist ins Zentrum stellt." },
          { wort: "Dialektik", erklaerung: "Denken in Gegensätzen. Ein Gedanke treibt sich durch seine eigenen Widersprüche weiter, statt einfach zu behaupten." },
          { wort: "bestimmte Negation", erklaerung: "Hegels Wort dafür, an einer Sache zu unterscheiden, was hält und was nicht, statt sie im Ganzen zu verwerfen." },
          { wort: "Marx", erklaerung: "Karl Marx, 1818 bis 1883. Er übernahm Hegels Denken in Gegensätzen und stellte es auf die Verhältnisse der Arbeit und des Besitzes um." },
          { wort: "Adorno", erklaerung: "Theodor W. Adorno, 1903 bis 1969, Frankfurter Schule. Für ihn war die bestimmte Negation das Werkzeug der Kritik, nicht alles verwerfen, sondern genau zeigen, was falsch läuft." },
          { wort: "Donna Haraway", erklaerung: "US-amerikanische Wissenschaftshistorikerin und feministische Denkerin, geboren 1944. Ihr «Manifest für Cyborgs» (1985) beschreibt Mensch, Tier und Maschine als verwoben; sie hat im Kapitel eine eigene Stimme." },
        ],
        beispiel:
          "Jedes Jahr wird im deutschsprachigen Raum das Jugendwort des Jahres gekürt, seit 2008, heute per offener Abstimmung. 2024 gewann «Aura», gemeint ist die Ausstrahlung, das Charisma oder der Status einer Person, oft scherzhaft gebraucht. 2025 folgte «das crazy», ein Füllwort für Momente, in denen jemand freundlich bleiben, aber nichts sagen möchte.\n\nWoher hat ein Wort seine Bedeutung? Sie wird nicht ausgerechnet, sie wird im Gebrauch festgesetzt, indem ihr unterscheidet. Aura ist nicht Leistung und nicht Beliebtheit, eher Wirkung ohne Anstrengung. Genau das heisst bei Hegel Unterscheiden. Was etwas ist, zeigt sich an dem, wovon es sich abhebt, und diese Grenzen werden gezogen, nicht gefunden. Darum wandern sie auch. Nächstes Jahr gewinnt ein anderes Wort und deine Sprache bekommt neue Kanten, die niemand aus den alten errechnen konnte.",
      },
      {
        slug: "arendt",
        name: "Hannah Arendt",
        leben: "1906 bis 1975",
        these: "Der Mensch kann neu anfangen.",
        info: "Hannah Arendt, jüdische politische Denkerin, floh vor den Nazis über Frankreich in die USA. Aus der Erfahrung des Totalitarismus fragte sie, was Handeln und Freiheit ausmacht. Ihr Schlüsselbegriff ist die «Natalität», die Gebürtlichkeit. Sie beschreibt damit einen Wesenszug, nicht die blosse Tatsache der Geburt, denn geboren werden auch andere Wesen. Jeder Mensch kommt als jemand Neues zur Welt, den es so noch nie gab, und dieses Neusein hört nicht auf, ein Leben lang kann er Anfänge setzen, die aus dem Bisherigen nicht ableitbar sind. Dazu kommt das Urteilen, das eigenständige Prüfen, auch aus der Sicht anderer. Von Arendt her gelesen setzt eine KI Wahrscheinliches fort und wiederholt Muster; anfangen und urteilen in ihrem Sinn kann sie nicht. Hauptwerk: «Vita activa».",
        begriffe: [
          { wort: "Totalitarismus", erklaerung: "Herrschaftsform, die das ganze Leben kontrollieren will und keine Freiheit zulässt, etwa NS-Diktatur und Stalinismus." },
          { wort: "«Natalität»", erklaerung: "Wörtlich Gebürtlichkeit. Kein Fachwort für die Geburt, sondern für das, was sich an ihr zeigt. Mit jedem Menschen kommt jemand zur Welt, den es so noch nie gab, ein Anfang, der selbst wieder anfangen kann." },
        ],
        beispiel:
          "Am 20. August 2018 setzte sich eine 15-jährige Schülerin mit einem Schild vor das Parlament in Stockholm: «Skolstrejk för klimatet», Schulstreik fürs Klima. Drei Wochen lang sass sie dort jeden Schultag, danach jeden Freitag. Ein halbes Jahr später, am 15. März 2019, streikten nach Angaben der Bewegung weltweit fast 1,8 Millionen Menschen.\n\nNiemand hätte das aus dem Vortag ableiten können. Ein Mädchen, ein Karton, ein Gehsteig. Alles daran war unscheinbar, nur neu war es. Arendt beschreibt diesen Wesenszug mit dem Bild der Geburt und nennt ihn Natalität. Wie jeder Mensch als jemand zur Welt kommt, den es so noch nie gab, so kann er auch später Anfänge setzen, die in keiner Fortsetzung des Bisherigen lagen. Anfangen ist darum immer unwahrscheinlich und immer riskant. Und es bleibt dein Teil. Fortsetzen, hochrechnen und wiederholen lässt sich vieles, anfangen nicht.",
      },
      {
        slug: "heidegger",
        name: "Martin Heidegger",
        leben: "1889 bis 1976",
        these: "Wir sind immer schon mit der Welt beschäftigt.",
        info: "Martin Heidegger gehört zu den einflussreichsten Philosophen des 20. Jahrhunderts und ist zugleich schwer belastet. Er trat am 1. Mai 1933 in die NSDAP ein, war als Rektor an der Gleichschaltung der Universität Freiburg beteiligt und blieb bis 1945 Parteimitglied; in seinen «Schwarzen Heften» stehen antisemitische Äusserungen. Umstritten ist nicht, ob das geschah, sondern wie stark es sein Werk prägt. In «Sein und Zeit» fragte er neu nach dem Sinn von Sein. Den Menschen nennt er «Dasein», seinen Grundzug die «Sorge». Das Wort führt leicht in die Irre, gemeint ist nicht Kummer. Wir sind nie unbeteiligte Zuschauer einer Welt, die uns gegenübersteht, sondern immer schon in ihr beschäftigt. Wir hantieren mit Dingen und haben es mit anderen Menschen zu tun. Ein Hammer zeigt sich als Hammer beim Hämmern, nicht beim Betrachten. Erst in diesem Umgang bekommen die Dinge ihre Bedeutung und erst so entsteht Sinn. Das gilt dann auch für die KI. Sie hat von sich aus keine solche Welt, ihre Bedeutung bekommt sie erst in unserem Umgang mit ihr. Ob sie Werkzeug ist, Gegenüber oder Störung, entscheidet sich nicht in ihrem Innern, sondern in dem, was wir mit ihr tun. Hauptwerk: «Sein und Zeit» (1927).",
        begriffe: [
          { wort: "Gleichschaltung", erklaerung: "Die erzwungene Ausrichtung von Ämtern, Schulen und Vereinen auf die NS-Herrschaft ab 1933; Andersdenkende wurden entfernt." },
          { wort: "«Schwarzen Heften»", erklaerung: "Heideggers private Notizhefte, erst ab 2014 veröffentlicht; sie enthalten antisemitische Passagen und lösten eine neue Debatte über sein Werk aus." },
          { wort: "«Dasein»", erklaerung: "Heideggers Wort für den Menschen, das Wesen, dem es um sein eigenes Sein überhaupt geht." },
          { wort: "«Sorge»", erklaerung: "Nicht Kummer, sondern Heideggers Wort für unsere Grundverfassung, dass wir stets mit Dingen umgehen und mit anderen zu tun haben, statt die Welt bloss zu betrachten." },
        ],
        beispiel:
          "In Tokio standen 2021 zum ersten Mal Skateboards im olympischen Programm. Im Street-Wettbewerb der Frauen gewann die 13-jährige Momiji Nishiya aus Japan Gold, Silber ging an die ebenfalls 13-jährige Rayssa Leal aus Brasilien.\n\nFrag die beiden nicht, wo beim Absprung ihr Gewicht liegt. Beim Fahren ist das Brett kein Gegenstand, über den man nachdenkt. Es verschwindet ins Können, gedacht wird in Linien und Landungen. Erst wenn etwas klemmt, ein Trick misslingt, eine Achse bricht, liegt da wieder ein Ding mit Schrauben. Heidegger meint mit Sorge genau dieses Eingelassensein. Du bist nicht zuerst Zuschauerin der Welt, du bist mit ihr beschäftigt und im Umgang entsteht Verstehen. Ein Erklärvideo hilft, aber gekonnt wird es unter deinen Füssen.",
      },
      {
        slug: "sloterdijk",
        name: "Peter Sloterdijk",
        leben: "geboren 1947",
        these: "Der Mensch ist ein übendes Wesen.",
        info: "Peter Sloterdijk ist einer der bekanntesten deutschsprachigen Gegenwartsphilosophen, bekannt für die «Sphären»-Trilogie und einen essayistischen, oft provokanten Stil. In «Du musst dein Leben ändern» beschreibt er den Menschen als übendes Wesen. Wir werden, wer wir sind, durch Übung, Wiederholung und Selbstformung. Er nennt das «Anthropotechnik». Der Satz ist kein Befehl, sondern der Grundton eines Lebens, das sich immer wieder in Form bringt. Darum kann eine Maschine eine Aufgabe erledigen, aber nicht für uns üben, wer weiter übt, bleibt fähig und urteilsfähig. Hauptwerk: «Du musst dein Leben ändern» (2009).",
        begriffe: [
          { wort: "«Anthropotechnik»", erklaerung: "Sloterdijks Wort für die Techniken, mit denen der Mensch an sich selbst arbeitet und sich formt (Üben, Trainieren, Gewohnheiten)." },
        ],
        beispiel:
          "Der Weltrekord im Lösen des Zauberwürfels liegt unter drei Sekunden, aufgestellt im Februar 2026. Wer das sieht, sagt Talent. Wer hinschaut, sieht Übung, eingeschliffene Fingerabläufe, tausendfach wiederholt, bis die Hände schneller sind als das bewusste Denken.\n\nSloterdijk nennt den Menschen ein übendes Wesen. Du wirst, was du wiederholst, im Sport, in einer Sprache, in der Geduld, auch in dem, was du täglich nebenbei tust. Deine Gewohnheiten sind Übungen, ob du sie so nennst oder nicht. Das entlastet, denn Können ist kein Besitz, sondern ein Weg und der steht allen offen, in kleinen Wiederholungen. Abkürzungen gibt es fürs Ergebnis. Fürs Können gibt es keine.",
      },
      {
        slug: "hustvedt",
        name: "Siri Hustvedt",
        leben: "geboren 1955",
        these: "Der Geist ist kein Computer.",
        info: "Siri Hustvedt ist US-amerikanische Schriftstellerin und Essayistin, die Literatur mit Hirnforschung und Philosophie verbindet. In «Die Illusion der Gewissheit» wendet sie sich gegen das Bild, das Gehirn sei ein Computer. Denken und Fühlen hängen für sie am lebendigen Körper und an gelebter Erfahrung, sie spricht vom «verkörperten Geist». Sie argumentiert, eine KI könne Sprache und Gefühle täuschend echt nachahmen, aber sie erlebe nichts und mache keine Erfahrung. Ihr «produktiver Zweifel» hilft, das flüssige Modell nicht mit der Wirklichkeit zu verwechseln. Hauptwerk: «Die Illusion der Gewissheit» (2018).",
        begriffe: [
          { wort: "«verkörperten Geist»", erklaerung: "Die Idee, dass Denken und Fühlen untrennbar an den lebendigen Körper gebunden sind, nicht bloss ein Rechnen im Kopf." },
        ],
        beispiel:
          "Wer lange Tetris spielt, kennt den Effekt. Beim Einschlafen fallen hinter den Augenlidern weiter Blöcke und im Supermarkt ordnet der Kopf die Schachteln im Regal zu Reihen. Das Phänomen heisst tatsächlich Tetris-Effekt und tritt auch bei anderem auf, das man stundenlang tut.\n\nEin Programm ist beendet, wenn man es schliesst. Dein Denken nicht. Es spielt weiter, in Bildern, im Halbschlaf, im Blick auf die Welt. Was du tust, färbt, wie dir alles erscheint, und gefragt hat dich dabei niemand. Hustvedt sagt darum, der Geist sei kein Computer. Er ist verkörpert, durchzogen von Erfahrung und Gefühl, er lässt sich nicht sauber in Eingabe und Ausgabe zerlegen. Eine Maschine gibt Antworten aus. Erleben, wie eine Antwort in dir weiterarbeitet, kannst nur du.",
      },
    ],
    absaetze: [
      "«Was ist der Mensch?» Diese Frage ist so alt wie die Philosophie selbst. Schon Aristoteles sah den Menschen als Wesen, das von Natur aus nach Wissen strebt, neugierig, fragend, nie ganz fertig. Immanuel Kant machte die Frage zur Kernfrage überhaupt und gab eine Richtung vor. Der Mensch ist frei, er kann aus eigener Einsicht handeln und darum trägt er Verantwortung. Georg Wilhelm Friedrich Hegel fügt hinzu, dass der Mensch ein Wesen ist, das unterscheidet. Erst indem wir Gegensätze auseinanderhalten, was ist und was sein soll, können wir urteilen und uns frei entscheiden. Und was etwas ist, steht für ihn nicht ein für alle Mal fest, es klärt sich in einem geschichtlichen Gang. So bekommt gerade das Unterscheiden und Entscheiden eine zutiefst menschliche Seite.",
      "Hannah Arendt nennt einen weiteren Wesenszug: das Anfangen. Mit jedem Menschen kommt etwas Neues in die Welt, das aus dem Bisherigen nicht ableitbar ist. Und der Mensch urteilt, er hält inne und entscheidet selbst. Martin Heidegger fügt die «Sorge» hinzu, und damit meint er nicht Kummer oder Bekümmerung. Er meint, wir stehen der Welt nie unbeteiligt gegenüber, sondern sind immer schon mit Dingen und Menschen beschäftigt. Erst in diesem Umgang bekommen die Dinge überhaupt eine Bedeutung und erst darin entsteht Sinn.",
      "Peter Sloterdijk beschreibt den Menschen als übendes Wesen. Wir werden, wer wir sind, durch Übung und Wiederholung und niemand kann für uns üben. Siri Hustvedt hält dagegen, der Geist sei kein Computer. Denken und Fühlen hängen für sie am lebendigen Körper und an gelebter Erfahrung. Eine Maschine könne Sprache und Gefühle täuschend echt nachahmen, erlebe dabei aber nichts.",
      "Worauf das alles zielt, ist nicht der Vergleich mit der Maschine. Es geht nicht darum, ob eine KI auch anfangen, urteilen oder unterscheiden könnte. Es geht darum, was uns in unserem Wesen ausmacht. Und diese Züge sind nicht etwas, das wir bloss tun, sondern etwas, das wir sind.",
    ],
    hilft:
      "Wenn dich die schnelle, kluge KI verunsichert, kehr zur Frage zurück, was dich als Mensch ausmacht. Neugier, Anfangen, Urteilen und das Beteiligtsein an der Welt, das bleibt deins, ganz gleich, wie gut die Maschine formuliert. Dafür braucht es am Ende ein Grundvertrauen, dass diese Wesenszüge nicht einfach verschwinden, nur weil eine Maschine gute Sätze schreibt.",
    werk: "Aristoteles, «Metaphysik»; Immanuel Kant, «Logik» (1800); G. W. F. Hegel, «Phänomenologie des Geistes» (1807); Hannah Arendt, «Vita activa»; Martin Heidegger, «Sein und Zeit» (1927); Peter Sloterdijk, «Du musst dein Leben ändern» (2009); Siri Hustvedt, «Die Illusion der Gewissheit» (2018)",
  },
  {
    titel: "Netzwerke und Systeme",
    leitfrage: "Wie wir Orientierung finden, wo niemand mehr das Ganze überblickt.",
    icon: "hub",
    absatzBegriffe: [
      { wort: "Armin Nassehi", erklaerung: "Deutscher Soziologe, geboren 1960; deutet die Gesellschaft mit der Systemtheorie." },
      { wort: "Bruno Latour", erklaerung: "Französischer Soziologe und Philosoph, 1947 bis 2022; Akteur-Netzwerk-Theorie." },
      {
        wort: "Systemtheorie",
        erklaerung:
          "Soziologische Denkschule, bei Nassehi in der Nachfolge von Niklas Luhmann. Die Gesellschaft besteht danach aus Teilsystemen wie Recht, Wirtschaft oder Wissenschaft, die nach je eigener Logik arbeiten, nicht aus der Summe einzelner Absichten.",
      },
      {
        wort: "Akteur-Netzwerk-Theorie",
        erklaerung:
          "Von Latour mitentwickelter Ansatz. Handeln entsteht in Netzwerken aus Menschen und Dingen, auch Geräte, Regeln und Formulare wirken mit, darum zählen sie alle als «Akteure».",
      },
    ],
    denker: [
      {
        slug: "nassehi",
        name: "Armin Nassehi",
        leben: "geboren 1960",
        these: "Die Gesellschaft ist in Mustern gebaut.",
        info: "Armin Nassehi ist ein führender deutscher Soziologe (München) und deutet die Gesellschaft mit der Systemtheorie. In «Muster» dreht er die übliche Frage um: nicht «Was macht die Digitalisierung mit uns?», sondern «Für welches Problem ist sie eine Lösung?». Er antwortet, die moderne Gesellschaft sei längst in «Mustern» organisiert, in Statistiken, Zählungen und Abläufen, die auch ohne Gesamtüberblick funktionieren. Genau darin ist die KI stark, sie erkennt Muster hervorragend, versteht aber keinen Sinn. Wer das begreift, sieht die KI nüchterner und weniger bedrohlich. Werk: «Muster» (2019).",
        begriffe: [
          { wort: "Systemtheorie", erklaerung: "Soziologische Theorie, die die Gesellschaft aus dem Zusammenspiel von Teilbereichen wie Wirtschaft, Recht und Politik erklärt." },
        ],
        beispiel:
          "Anfang Dezember zeigt dir Spotify Wrapped dein Jahr in Zahlen, die meistgehörten Songs, Künstlerinnen und Genres, aufbereitet zum Teilen, und Millionen stellen es dann in ihre Storys. Das gibt es seit 2016, und der seltsame Moment ist jedes Jahr derselbe. Eine Statistik kennt dich.\n\nFür Nassehi wäre das kein Wunder. Die Gesellschaft ist längst in Mustern gebaut, in Zählungen und Abläufen; die Digitalisierung erfindet sie nicht, sie macht sie sichtbar. Dein Musikjahr war immer schon ein Muster, neu ist nur der Spiegel. Sehen kann er allerdings nur Wiederholungen. Warum dich ein einziger Song durch den Sommer getragen hat, steht in keiner Liste, denn das Muster kennt deine Klicks und nicht deine Gründe.",
      },
      {
        slug: "latour",
        name: "Bruno Latour",
        leben: "1947 bis 2022",
        these: "Nichts wirkt allein.",
        info: "Bruno Latour war ein weltweit einflussreicher französischer Soziologe und Philosoph, Mitbegründer der Akteur-Netzwerk-Theorie. Danach entsteht Wirkung nie allein, sondern im Netz aus Menschen und Dingen. Ein Türschliesser, ein Formular oder ein Algorithmus wirken im Verbund mit. Er untersuchte, wie Wissenschaft und Gesellschaft ihre Wahrheiten Schritt für Schritt herstellen. Orientierung heisst darum nicht, alles zu überblicken, sondern das eigene Netz zu kennen. Wovon hänge ich ab, was wirkt mit mir zusammen? Werk: «Existenzweisen» (2012).",
        begriffe: [
          { wort: "Akteur-Netzwerk-Theorie", erklaerung: "Latours Ansatz. Wirkung entsteht im Netz aus Menschen und Dingen, nichts handelt für sich allein." },
        ],
        beispiel:
          "Bubble Tea entstand in den 1980er Jahren in Taiwan, 1987 kamen die Tapiokaperlen dazu; in der Schweiz gibt es ihn seit 2012. Die Perlen bestehen aus der Stärke des Maniok, einer Pflanze aus Südamerika, deren grösster Produzent heute Nigeria ist.\n\nEin Becher, ein Strohhalm. Und daran hängen eine Teekultur aus Taiwan, ein südamerikanisches Wurzelgemüse, Felder in Nigeria, ein Laden an deiner Ecke und ein Trend in deinem Feed. Nichts davon hat den Bubble Tea allein gemacht, gewirkt hat der Verbund. So schaut Latour auf die Welt. Wer verstehen will, was ein Ding ist, fragt, was alles mitwirkt. Die Übung funktioniert bei fast allem, beim Pausenbrot, beim Handy und bei jeder Antwort einer KI. Hinter jedem Einzelnen steht ein Netz.",
      },
    ],
    absaetze: [
      "Moderne Gesellschaften sind unübersichtlich geworden. Niemand überblickt mehr das Ganze, nicht die Wirtschaft, nicht die Verwaltung, nicht die Technik. Aus dem Gefühl, den Überblick verloren zu haben, entsteht schnell Überforderung. Und doch funktioniert erstaunlich vieles. Der Zug fährt, der Lohn kommt, das Spital behandelt. Wie geht das zusammen? Hier helfen zwei Denker, die die Gesellschaft nicht bewerten, sondern erklären.",
      "Armin Nassehi denkt in der Tradition der Systemtheorie, Bruno Latour hat die Akteur-Netzwerk-Theorie mitbegründet. So verschieden die beiden Schulen sind, eines teilen sie. Sie verabschieden ein altes Bild der Philosophie, in dem ein Subjekt, der einzelne denkende Mensch, den Objekten gegenübersteht, also der Welt der Dinge, die er erkennt, benutzt und beherrscht.",
      "An die Stelle dieses Gegenübers tritt ein anderes Bild. Der Mensch handelt nie als autonomes Einzelwesen, das von aussen in die Welt eingreift, er ist immer schon eingebunden, in Systeme wie Recht, Wirtschaft oder Schule und in Netzwerke aus Menschen, Geräten, Regeln und Gewohnheiten. Wichtig wird damit weniger, was ein Einzelner will, und mehr, was zwischen allen Beteiligten geschieht. Wie die beiden das im Einzelnen fassen, zeigen ihre zwei Stimmen unten.",
    ],
    hilft:
      "Wenn dich die Komplexität überfordert, musst du nicht das Ganze verstehen. Es reicht, dein Stück des Netzes zu kennen und zu sehen, welche Muster gerade wirken. Das gibt Boden unter den Füssen, auch wenn niemand mehr alles überblickt. Die Gesellschaft funktioniert nicht trotz, sondern wegen dieser verteilten Muster.",
    werk: "Armin Nassehi, «Muster. Theorie der digitalen Gesellschaft» (2019); Bruno Latour, «Existenzweisen» (2012) und die Akteur-Netzwerk-Theorie",
  },
  {
    titel: "Transformation von Mensch und Maschine",
    leitfrage: "Warum sich Mensch und Maschine nicht sauber trennen lassen.",
    icon: "handshake",
    absatzBegriffe: [
      { wort: "Bruno Latour", erklaerung: "Französischer Soziologe und Philosoph, 1947 bis 2022; Akteur-Netzwerk-Theorie." },
      { wort: "Yasuo Deguchi", erklaerung: "Japanischer Philosoph an der Universität Kyoto; «We-Turn»-Philosophie (Selbst als Wir)." },
      { wort: "Donna Haraway", erklaerung: "US-amerikanische Wissenschaftshistorikerin und feministische Denkerin, geboren 1944." },
      { wort: "Yuval Noah Harari", erklaerung: "Israelischer Historiker, geboren 1976; «Homo Deus»." },
      { wort: "Markus Gabriel", erklaerung: "Deutscher Philosoph, geboren 1980; «Neuer Realismus», «Ethische Intelligenz»." },
    ],
    denker: [
      {
        slug: "latour",
        name: "Bruno Latour",
        leben: "1947 bis 2022",
        these: "Das freie Individuum ist eine Illusion.",
        info: "Mit der Akteur-Netzwerk-Theorie stellt Latour auch das Bild vom ganz freien, unabhängigen Individuum in Frage. Wir handeln nie aus dem Nichts, sondern immer eingebettet in Beziehungen zu Menschen, Werkzeugen, Institutionen und Techniken. Das ist keine Einschränkung, sondern die normale Bedingung des Handelns. Je bewusster man sich die eigenen Abhängigkeiten macht, desto klarer und souveräner wird das eigene Tun, gerade auch im Umgang mit KI.",
        begriffe: [
          { wort: "Akteur-Netzwerk-Theorie", erklaerung: "Latours Ansatz. Wirkung entsteht im Netz aus Menschen und Dingen, nichts handelt für sich allein." },
        ],
        beispiel:
          "«Ocean Eyes» klingt nach einem Alleingang. Ein Mädchen, ein Zimmer, ein Welthit. Tatsächlich hatte ihr Bruder Finneas den Song geschrieben, die 13-jährige Billie Eilish sang ihn und hochgeladen wurde er am 18. November 2015 auf SoundCloud, damit ihr Tanzlehrer ihn für eine Choreografie herunterladen konnte. Über Nacht teilten ihn Fremde, dann meldete sich ein Label.\n\nDas ganz unabhängige Individuum, das aus dem Nichts handelt, gibt es für Latour nicht, auch nicht im Schlafzimmerstudio. Da sind ein Bruder, ein Lehrer mit einem Auftrag, eine Plattform, tausende Teilende. Das macht die Leistung nicht kleiner, es macht sie verständlicher. Und wer das eigene Geflecht kennt, wird dadurch nicht abhängiger, sondern souveräner. Du weisst, was dich trägt, und kannst es pflegen.",
      },
      {
        slug: "deguchi",
        name: "Yasuo Deguchi",
        leben: "zeitgenössisch",
        these: "Nicht «ich» handelt, sondern «wir».",
        info: "Yasuo Deguchi ist Philosophieprofessor an der Universität Kyoto und verbindet westliches mit ostasiatischem Denken. Mit seiner «We-Turn»-Philosophie verlegt er das Handeln vom einzelnen «Ich» auf ein «Wir». Niemand kann etwas ganz allein, jede Handlung wird von vielen getragen, von Menschen, Dingen und heute auch von Maschinen. Der eigentliche Handelnde ist deshalb kein einsames Ich, sondern ein «Selbst als Wir», zu dem die KI dazugehört. Er stützt sich dabei auf einen alten buddhistischen Gedanken, das «abhängige Entstehen». Nichts besteht für sich allein, alles entsteht wechselseitig. Das entlastet, denn Verantwortung verteilt sich auf ein «Wir» mit verschiedenen Rollen, statt ganz auf den Schultern eines einzelnen Ich zu liegen.",
        begriffe: [
          { wort: "Kyoto", erklaerung: "Alte Kaiserstadt in Japan, bekannt für ihre Universität und eine eigene philosophische Schule." },
          { wort: "«We-Turn»", erklaerung: "Deguchis Wendung vom «Ich» zum «Wir». Der eigentliche Handelnde ist ein Wir aus Menschen und Dingen, nicht das einzelne Ich." },
        ],
        beispiel:
          "Seit London 2012 steht der Weltrekord der 4-mal-100-Meter-Staffel bei 36,84 Sekunden, gelaufen von Jamaika. Möglich macht solche Zeiten der fliegende Wechsel. Wer den Stab übernimmt, startet, bevor er da ist, und übernimmt ihn in vollem Lauf. Eine Staffel ist darum schneller, als ihre vier Läufer einzeln zusammen wären.\n\nWem gehört diese Zeit? Keinem der vier allein. Sie entsteht zwischen ihnen, in den Trainingsjahren, in drei Übergaben. Und der Stab läuft mit. Die Staffel ist unser Beispiel, Deguchis eigenes ist noch alltäglicher. In die Pedale trete ich selbst, aber Velofahren kann kein Ich allein, es braucht das Rad, die Strasse, sogar die Schwerkraft. So verlegt er das Handeln vom «ich» zum «wir», einem Geflecht aus Menschen und Dingen, zu dem heute auch Maschinen gehören. Das nimmt dir nichts weg. Wer ehrlich sagen kann, wer und was alles mitgelaufen ist, versteht die eigene Leistung nur besser.",
      },
      {
        slug: "haraway",
        name: "Donna Haraway",
        leben: "geboren 1944",
        these: "Wir sind längst verwoben.",
        info: "Donna Haraway ist US-amerikanische Wissenschaftshistorikerin und feministische Denkerin, ihr «Manifest für Cyborgs» (1985) wurde weltberühmt. Sie denkt Mensch, Tier und Maschine als verwoben. Wir sind in gewissem Sinn schon «Cyborgs», Mischwesen. Statt der Technik als fremder Macht gegenüberzustehen, sollen wir lernen, verantwortlich mit ihr zu leben, sie spricht von «Mit dem Schlamassel bleiben», also die Probleme aushalten und antworten statt fliehen. Damit steht sie Bruno Latour nahe, ergänzt ihn aber um Fürsorge und Verantwortung. Werk: «Unruhig bleiben» (2016).",
        begriffe: [
          { wort: "«Manifest für Cyborgs»", erklaerung: "Haraways berühmter Essay von 1985; das Bild des Cyborgs, eines Mischwesens aus Mensch und Maschine, sprengt die starre Grenze zwischen Mensch, Tier und Technik." },
        ],
        beispiel:
          "Beatrice Vio war elf, als ihr nach einer Meningitis Unterarme und Unterschenkel amputiert wurden. Sie focht weiter. Ihr Florett ist mit einer Prothese am linken Ellbogen befestigt und sie ist die Einzige im Rollstuhlfechten, die ohne Hände und Beine antritt. An den Paralympics in Rio gewann sie mit 19 Gold, in Tokio verteidigte sie den Titel.\n\nWo endet hier der Mensch, wo beginnt das Gerät? Beim Zuschauen wird die Frage sinnlos, denn die Klinge antwortet ihr wie eine Hand. Vio ist unser Beispiel, nicht Haraways eigenes, ihr Punkt aber ist derselbe. So verwoben sind wir alle längst, mit Brille, Impfung und dem Handy als Gedächtnis. Ihre Losung dafür heisst im Original «staying with the trouble», mit dem Schlamassel bleiben, die deutsche Ausgabe trägt den Titel «Unruhig bleiben». Gemeint ist, nicht auf die saubere Lösung zu warten und nicht zu fliehen, sondern in der unübersichtlichen Lage zu antworten und Verantwortung zu übernehmen. Vio zeigt, wie viel Freiheit in dieser Verwobenheit stecken kann.",
      },
      {
        slug: "harari",
        name: "Yuval Noah Harari",
        leben: "geboren 1976",
        these: "Grosse Macht braucht Regeln.",
        info: "Yuval Noah Harari ist ein israelischer Historiker, der mit «Eine kurze Geschichte der Menschheit» und «Homo Deus» weltbekannt wurde. Er erzählt die grossen Linien, wie der Mensch durch gemeinsame Geschichten (Geld, Staaten, Religionen) mächtig wurde und wie Biotechnik und KI ihn nun selbst verändern könnten. Diese Verschmelzung von Mensch und Maschine setzt gewaltige Macht frei, weshalb er eindringlich vor blindem Fortschrittsglauben warnt und klare Regeln fordert. Sein Blick ist weit und mahnend zugleich. Werk: «Homo Deus».",
        begriffe: [
          { wort: "Biotechnik", erklaerung: "Technik, die in Lebendiges eingreift, etwa in Gene, Körper und Gehirn." },
          { wort: "«Homo Deus»", erklaerung: "Hararis Bestseller (2015), ein Ausblick, wie Biotechnik und KI den Menschen selbst umbauen könnten (wörtlich «Gott-Mensch»)." },
        ],
        beispiel:
          "Seit dem 10. Dezember 2025 gilt in Australien als erstem Land der Welt ein Mindestalter von 16 Jahren für Konten auf grossen Plattformen, von Instagram über TikTok bis YouTube. Die Erwachsenen waren in Umfragen deutlich dafür, 77 Prozent. Von 17'000 befragten Jugendlichen sagten 70 Prozent Nein.\n\nHarari erzählt Geschichte als Geschichte wachsender Macht. Werkzeuge, die ganze Gesellschaften umbauen, brauchen Regeln, und zwar bevor alle Folgen bekannt sind. Nur fallen Regeln nicht vom Himmel. Sie werden ausgehandelt, zwischen Generationen, Ländern und Interessen, mit offenem Ausgang. Und andere Länder schauen gerade genau hin. An den zwei Zahlen oben ist darum nicht interessant, wer recht hat, sondern was hier verhandelt wird, die Sorge der einen gegen den Alltag der anderen. Was wäre deine Regel und wie würdest du sie begründen?",
      },
      {
        slug: "gabriel",
        name: "Markus Gabriel",
        leben: "geboren 1980",
        these: "Die KI ist ein Spiegel, entscheiden musst du.",
        info: "Markus Gabriel wurde sehr jung Philosophieprofessor in Bonn und ist ein Hauptvertreter des «Neuen Realismus». Er nennt die KI einen «magischen Spiegel». Sie erkennt in unseren Daten Muster, auch unsere Werte und Gewohnheiten, manchmal genauer, als wir uns selbst kennen. Die eigentliche Revolution ist für ihn darum nicht technisch, sondern ethisch. Sein Vorschlag ist ein «dritter Weg» zwischen Alles-verbieten und Alles-erlauben, die «ethische Intelligenz», also klug und moralisch mitzugestalten. Nicht die Maschine steht auf dem Prüfstand, sondern wir. Werk: «Ethische Intelligenz».",
        begriffe: [
          { wort: "«Neuen Realismus»", erklaerung: "Von Markus Gabriel mitbegründete Richtung. Die Welt und auch Werte sind wirklich, nicht bloss Ansichtssache." },
        ],
        beispiel:
          "Ein Abend auf TikTok. Du wischst schneller, wenn dich etwas langweilt, bleibst hängen, wenn dich etwas trifft, tippst anders, wenn du müde bist. Genau daran liest dich die Maschine, sagt Gabriel, am Tempo des Scrollens, am Tippen, an der Stimme in der Audiofunktion. Aus Verhalten werden Muster und aus den Mustern wird eine Vermutung über deine Gemütslage.\n\nDarum nennt er die KI einen magischen Spiegel, und der spiegelt nicht nur Wissen. Trainiert an menschlichem Ausdruck erkennt sie affektive Muster, also den Zusammenhang zwischen Gefühl und Formulierung, und liest so zwischen den Zeilen. Im Spiegel der KI sehen wir, wie wir wirklich sind, «und die KI vermisst uns». Niemand kennt uns so gut wie diese Systeme, sagt er, jetzt schon. Umso wichtiger ist, was bei dir bleibt. Was du dem Spiegel zeigst und was du aus seinem Bild machst, rechnet er nicht aus. Das entscheidest du.",
      },
    ],
    absaetze: [
      "Mensch und Maschine lassen sich nicht mehr sauber auseinanderdividieren. Wir tippen, suchen, planen und entscheiden längst mit Geräten zusammen. Schon Bruno Latour zeigt, warum das kein neuer Sonderfall ist. Nach seiner Lesart hat es das ganz freie Individuum, das egoistisch nur tut, was es will, nie gegeben. Wir stecken immer in Abhängigkeiten, von Menschen, Werkzeugen, Institutionen. Je klarer man sich diese Abhängigkeiten bewusst macht, desto verständlicher wird das eigene Tun.",
      "Der japanische Philosoph Yasuo Deguchi treibt diesen Gedanken weiter. Seine «We-Turn»-Philosophie verlegt das Handeln vom einzelnen «Ich» auf ein «Wir». Niemand kann etwas ganz allein, jede Handlung wird von vielen anderen getragen, von Menschen, Dingen und heute auch von Maschinen. Der eigentliche Handelnde ist deshalb kein einsames Ich, sondern ein «Wir», zu dem die KI dazugehört. Er stützt sich dabei auf den buddhistischen Gedanken des «abhängigen Entstehens», dass nichts für sich allein besteht, sondern alles miteinander verbunden entsteht.",
      "Was folgt daraus? Donna Haraway sagt, wir sind längst «verwoben», in gewissem Sinn schon Mischwesen aus Mensch und Maschine und sollten das verantwortlich gestalten. Yuval Noah Harari mahnt, dass diese Verschmelzung gewaltige Macht freisetzt und darum klare Regeln braucht. Markus Gabriel setzt auf «ethische Intelligenz», das kluge, moralische Mitgestalten. Zwei Wege zeichnen sich ab, sich auf die Zusammenarbeit einlassen oder den eigenen Weg umso deutlicher markieren, beides gestützt durch Regulation und Ethik.",
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
    absatzBegriffe: [
      { wort: "Rainer Maria Rilke", erklaerung: "Deutschsprachiger Dichter, 1875 bis 1926; von ihm stammt die Zeile «Du musst dein Leben ändern»." },
      { wort: "Stoiker", erklaerung: "Antike Philosophenschule (Epiktet, Seneca, Mark Aurel); Philosophie als tägliche Übung." },
      { wort: "Michel Foucault", erklaerung: "Französischer Philosoph, 1926 bis 1984; «Sorge um sich selbst»." },
      { wort: "Wilhelm Schmid", erklaerung: "Freier Philosoph in Berlin, geboren 1953; «Philosophie der Lebenskunst»." },
      { wort: "Martha Nussbaum", erklaerung: "US-amerikanische Philosophin, geboren 1947; «Fähigkeiten-Ansatz»." },
      { wort: "Maurice Merleau-Ponty", erklaerung: "Französischer Philosoph, 1908 bis 1961; Philosophie des Leibes." },
      { wort: "Hartmut Rosa", erklaerung: "Deutscher Soziologe, geboren 1965; Begriff «Resonanz»." },
    ],
    denker: [
      {
        slug: "stoiker",
        name: "Die Stoiker",
        leben: "Antike",
        these: "Übe, was in deiner Macht steht.",
        info: "Die Stoa war eine der grossen Schulen der Antike; bekannte Vertreter sind der Sklave Epiktet, der Staatsmann Seneca und der Kaiser Mark Aurel. Für sie ist Philosophie kein blosses Wissen, sondern tägliche Übung («Askesis», ursprünglich Übung, nicht Verzicht). Ihr Kern ist die Unterscheidung zwischen dem, was in unserer Macht steht (unser Urteil, unser Handeln) und dem, was nicht (Ereignisse, Meinungen anderer). Gelassenheit entsteht, wenn man seine Kraft auf das Erste richtet. Ein gutes Leben wächst so aus beständiger kleiner Übung, nicht aus einer einmaligen Einsicht.",
        begriffe: [
          { wort: "Stoa", erklaerung: "Antike Philosophenschule (ab rund 300 v. Chr.), benannt nach einer bemalten Säulenhalle in Athen." },
          { wort: "Epiktet", erklaerung: "Griechischer Stoiker (rund 50 bis 138 n. Chr.), als Sklave geboren, später gefeierter Lehrer." },
          { wort: "Seneca", erklaerung: "Römischer Staatsmann und Stoiker (rund 1 bis 65 n. Chr.), Berater des Kaisers Nero." },
          { wort: "Mark Aurel", erklaerung: "Römischer Kaiser (121 bis 180 n. Chr.) und Stoiker; seine «Selbstbetrachtungen» sind bis heute berühmt." },
          { wort: "«Askesis»", erklaerung: "Griechisch für Übung, Training, nicht Verzicht, gemeint ist Philosophie als tägliche Praxis." },
        ],
        beispiel:
          "Im Teamfinal von Tokio 2021 zog sich die US-Turnerin Simone Biles nach einem Sprung zurück, aus Rücksicht auf ihre mentale Gesundheit, nicht wegen einer Verletzung. Drei Jahre später in Paris gewann sie drei Mal Gold und ein Mal Silber.\n\nDie Stoiker unterscheiden zwischen dem, was in deiner Macht steht, und dem, was nicht. Nicht in Biles' Macht standen die Erwartungen eines Weltpublikums, die Schlagzeilen, der Medaillenspiegel. In ihrer Macht standen das eigene Urteil darüber, was jetzt richtig ist, und das Handeln danach, gegen den Druck. Genau das ist die stoische «Askesis», das tägliche Einüben dieser Unterscheidung, bis die eigene Kraft dorthin geht, wo sie wirkt. Das ist kein Rückzug aus der Welt. Wer so unterscheidet, kommt zurück, sobald es wieder die eigene Entscheidung ist.",
      },
      {
        slug: "foucault",
        name: "Michel Foucault",
        leben: "1926 bis 1984",
        these: "Sich selbst formen wie ein Kunstwerk.",
        info: "Michel Foucault war ein französischer Philosoph, der untersuchte, wie Macht und Wissen unser Leben prägen (in Gefängnis, Klinik, Sexualität). In seinem Spätwerk entdeckte er die antike «Sorge um sich selbst» wieder, das Kümmern um das eigene Leben und sein bewusstes Gestalten. Er nennt das eine «Ästhetik der Existenz», das Leben formen wie ein Kunstwerk. Es geht nicht darum, fremden Normen zu gehorchen, sondern die eigene Lebensform aktiv zu wählen und einzuüben. Werk: «Die Sorge um sich» (1984).",
        begriffe: [
          { wort: "«Ästhetik der Existenz»", erklaerung: "Foucaults Idee, das eigene Leben bewusst zu gestalten wie ein Kunstwerk, statt bloss Regeln zu befolgen." },
        ],
        beispiel:
          "Ein Bullet Journal ist ein Notizbuch mit Punkteraster, das Terminplanung, To-do-Listen, Tagebuch und Brainstorming in einem einzigen Heft verbindet. Entwickelt hat es 2013 der Designer Ryder Carroll.\n\nNeu ist die Idee nicht, und das ist das Schöne daran. Foucault hat in seinem Spätwerk die antike Sorge um sich selbst wieder ausgegraben. Solche Hefte gab es nämlich schon damals, sie hiessen Hypomnemata und man sammelte darin Zitate, Gedanken und Vorsätze. Foucault las sie als Werkzeuge der Selbstsorge, Schreiben als Arbeit an sich selbst. Genau das meint seine «Ästhetik der Existenz», ein Leben formen wie ein Kunstwerk. Gemeint ist nicht, sich für fremde Massstäbe zu optimieren, für Noten, Follower und Bestenlisten. Es heisst, selbst zu wählen, woran du arbeitest. Dafür ist ein Heft, das niemand liken kann, ein ziemlich gutes Werkzeug, denn es gehört nur dir.",
      },
      {
        slug: "schmid",
        name: "Wilhelm Schmid",
        leben: "geboren 1953",
        these: "Das Leben ändern, aber wie? In kleinen Schritten.",
        info: "Wilhelm Schmid ist ein freier Philosoph in Berlin und hat die «Philosophie der Lebenskunst» im deutschsprachigen Raum bekannt gemacht. Sein Thema ist der Abstand zwischen Einsicht und Tat, den jeder von den guten Vorsätzen kennt. Was hilft, ist Übung in kleinsten Schritten, täglich, fast beiläufig, aber regelmässig, nicht das ganze Buch auf einmal, sondern jeden Tag eine Seite. Weil Freude stärker wirkt als Zwang, soll man sich am Schönen orientieren, zu dem man Ja sagen kann. So werden neue Gewohnheiten gebildet. Wie lange das dauert, hat die Psychologie untersucht, nicht die Philosophie. Eine oft zitierte Studie fand einen Mittelwert von 66 Tagen, mit sehr grossen Unterschieden je nach Person und Gewohnheit. Werk: «Philosophie der Lebenskunst» (1998).",
        beispiel:
          "Vinted wurde 2008 in Litauen gegründet und ist heute mit über 65 Millionen Mitgliedern eine der grössten Plattformen für Secondhandkleidung, kaufen und verkaufen per App, quer durch Europa und Nordamerika.\n\n«Nachhaltiger leben» ist als Vorsatz so gross, dass er oft schon am Sonntagabend endet. Schmids Philosophie der Lebenskunst fragt darum nicht, was man einsehen, sondern was man einüben kann, und setzt auf kleinste Schritte, täglich, fast beiläufig, aber regelmässig und möglichst am Schönen orientiert statt am Verzicht. Das Ziel nennt er Selbstfreundschaft, mit sich so freundlich umgehen wie mit jemandem, den man gern hat. Eine einzige neue Gewohnheit reicht für den Anfang, zum Beispiel zuerst secondhand schauen und erst dann neu kaufen. Das kostet wenig Überwindung, es macht sogar Spass, das Lieblingsteil für wenige Franken zu finden, und es summiert sich. Nicht das ganze Leben ändern. Eine Gewohnheit.",
      },
      {
        slug: "nussbaum",
        name: "Martha Nussbaum",
        leben: "geboren 1947",
        these: "Gefühle gehören zum guten Leben.",
        info: "Martha Nussbaum ist eine der bekanntesten US-amerikanischen Philosophinnen und verbindet antike Ethik (besonders Aristoteles und die Stoa) mit heutigen Fragen. Sie zeigt, dass Gefühle keine blosse Störung der Vernunft sind, sondern zu einem guten Urteil und einem gelingenden Leben dazugehören. Mit dem «Fähigkeiten-Ansatz» fragt sie konkret, was Menschen wirklich können müssen, um gut zu leben (etwa Gesundheit, Bildung, Bindung, Spiel) und wie eine Gesellschaft das ermöglichen soll. Lebenskunst heisst darum auch, die eigenen Gefühle ernst zu nehmen und gute Bedingungen zu schaffen. Werk: «Fähigkeiten schaffen» (2011).",
        begriffe: [
          { wort: "«Fähigkeiten-Ansatz»", erklaerung: "Nussbaums Frage, was Menschen konkret können müssen, um gut zu leben (Gesundheit, Bildung, Bindung, Spiel), und was eine Gesellschaft ihnen dafür schulden." },
        ],
        beispiel:
          "Im Juli 2023 registrierten Seismographen in Seattle Erschütterungen, ausgelöst von zehntausenden tanzenden Fans an einem Konzert von Taylor Swift, über Stunden hinweg. Dieselbe Tournee wurde später von Guinness World Records als die kommerziell erfolgreichste der Welt anerkannt.\n\nMan kann darüber spotten, so viel Gefühl für ein Popkonzert. Nussbaum widerspricht dem alten Verdacht, Gefühle seien Störungen der Vernunft. Ein starkes Gefühl ist für sie ein Werturteil. Es sagt dir, was dir wichtig ist, lange bevor du es begründen kannst. Wer bei einem Lied weint, denkt nicht zu wenig, sondern erkennt etwas: Das hier betrifft mich. Gefühle ernst zu nehmen heisst, solche Urteile lesen zu lernen, die eigenen und die der anderen, statt sie sich auszureden. Freude, die den Boden zum Zittern bringt, ist eine Auskunft darüber, was zählt. Zu ihrem «Fähigkeiten-Ansatz», der Liste dessen, was Menschen für ein gutes Leben brauchen, gehören neben Gesundheit und Bildung auch Bindung und Spiel. Ein Konzert ist beides.",
      },
      {
        slug: "merleau-ponty",
        name: "Maurice Merleau-Ponty",
        leben: "1908 bis 1961",
        these: "Wir verstehen die Welt mit dem Leib.",
        info: "Maurice Merleau-Ponty war ein französischer Philosoph der Phänomenologie. Sein Thema ist der Leib. Wir erfahren die Welt nicht zuerst mit dem Kopf, sondern leiblich, durch Wahrnehmung, Bewegung, Berührung und Gefühl. Der Körper ist kein Ding, das wir bloss «haben», sondern die Art, wie wir zur Welt gehören. Verstehen und ein gutes Leben sind darum verkörpert, nicht rein rechnerisch. Genau das kann eine körperlose KI nicht, sie verarbeitet Zeichen, aber sie spürt und erlebt nicht. Werk: «Phänomenologie der Wahrnehmung» (1945).",
        begriffe: [
          { wort: "Phänomenologie", erklaerung: "Philosophische Richtung, die genau beschreibt, wie uns die Dinge erscheinen und wie wir sie leiblich erleben." },
        ],
        beispiel:
          "In Paris war 2024 Breaking zum ersten Mal olympische Disziplin, ausgetragen mitten in der Stadt auf der Place de la Concorde. Das erste Gold der B-Girls gewann Ami Yuasa aus Japan, bei den B-Boys siegte der Kanadier Philip Kim.\n\nVersuch, einen Headspin aus einer Beschreibung zu lernen. Du kannst jede Anweisung auswendig aufsagen und fällst trotzdem. Irgendwann, nach vielen Anläufen, «hat» es der Körper. Schwung, Druck und Balance sind dann kein Wissen im Kopf, sondern ein Können im Leib. Für Merleau-Ponty verstehen wir so die Welt überhaupt, zuerst leiblich, dann in Begriffen. Merleau-Ponty unterscheidet darum zwischen Körper und Leib. Den Körper kann man von aussen betrachten und vermessen, der Leib ist der, der du bist, deine Art, zur Welt zu sein. Ein Video zeigt dir jeden Move in Zeitlupe. Verstehen wird ihn dein Rücken.",
      },
      {
        slug: "rosa",
        name: "Hartmut Rosa",
        leben: "geboren 1965",
        these: "Resonanz statt Kontrolle.",
        info: "Hartmut Rosa ist ein deutscher Soziologe, bekannt für die Diagnose der gesellschaftlichen «Beschleunigung». Dagegen setzt er den Begriff «Resonanz». Ein gelingendes Leben entsteht nicht durch mehr Kontrolle, mehr Tempo und mehr Verfügbarkeit, sondern durch ein lebendiges, wechselseitiges Antworten zwischen Mensch und Welt, ein Berührtwerden. Vieles, was zählt, lässt sich gerade nicht erzwingen oder verfügbar machen, es muss einem begegnen. In einer Welt schneller KI erinnert er daran, das Sich-berühren-Lassen nicht zu verlernen. Werke: «Resonanz» (2016), «Unverfügbarkeit» (2018).",
        begriffe: [
          { wort: "«Beschleunigung»", erklaerung: "Rosas Diagnose, dass in der Moderne alles immer schneller wird, Technik, Arbeit, Lebenstempo." },
          { wort: "«Resonanz»", erklaerung: "Bei Rosa ein antwortendes, lebendiges Verhältnis zur Welt, das sich nicht erzwingen lässt, Gegenbegriff zur blossen Beschleunigung." },
        ],
        beispiel:
          "In der Nacht auf den 11. Mai 2024 traf der erste Sonnensturm der höchsten Kategorie seit 2003 die Erde, und für einmal waren Polarlichter bis in die Schweiz zu sehen. Wer zufällig draussen war oder geweckt wurde, stand plötzlich unter einem leuchtenden Himmel.\n\nEs liess sich nicht buchen. Kein Ticket, kein Abo, keine Wiederholung auf Abruf, nicht einmal eine verlässliche Vorhersage. Rosa nennt «Resonanz», was uns gerade deshalb berührt, weil es nicht verfügbar ist, sein Wort dafür ist die Unverfügbarkeit. Die Welt antwortet, aber nicht auf Bestellung. In einem Alltag, in dem fast alles sofort lieferbar ist, der Song, die Serie, die Antwort, sind solche Momente kleine Übungsplätze. Hinstehen, warten dürfen, sich berühren lassen. Mehr Kontrolle würde genau das zerstören, was diesen Abend besonders gemacht hat.",
      },
    ],
    absaetze: [
      "«Du musst dein Leben ändern», heisst es in einem berühmten Gedicht von Rainer Maria Rilke. Ja, aber wie? Das ist die Grundfrage der Lebenskunst. Denn aus einer Einsicht folgt noch lange keine Tat, jeder kennt das von den guten Vorsätzen an Silvester, die am Neujahrsmorgen schon wieder verblasst sind. Dieser Bereich fragt nicht, was der Mensch ist, sondern wie er sein Leben tatsächlich gestalten und ändern kann.",
      "Schon die Stoiker wussten, dass Philosophie tägliche Übung ist, nicht blosses Wissen. Das griechische Wort dafür ist «Askesis», Übung, nicht Verzicht. Michel Foucault nannte das die «Sorge um sich selbst», das Leben bewusst formen wie ein Kunstwerk. Und der Lebenskunst-Philosoph Wilhelm Schmid zeigt konkret, wie das geht, in kleinsten Schritten, täglich, fast beiläufig, aber regelmässig. Nicht das ganze Buch auf einmal, sondern jeden Tag eine Seite. So wird aus einem Vorsatz allmählich eine neue Gewohnheit.",
      "Dabei zählt nicht nur der Kopf. Martha Nussbaum erinnert daran, dass Gefühle zum guten Leben gehören, und Maurice Merleau-Ponty, dass wir die Welt leiblich verstehen, durch Körper und Wahrnehmung. Genau darum wirkt Schönes stärker als Zwang. Wer sich an etwas orientiert, zu dem er Ja sagen kann, verändert sich lieber. Hartmut Rosa nennt dieses lebendige Verhältnis zur Welt «Resonanz».",
      "Und die KI? Sie kann bei der Umsetzung helfen, etwa eine App, die an die kleinen Übungen erinnert und Fortschritte zeigt. Aber gehen muss man den Weg selbst. Kein Werkzeug übt für dich und ein eingeübtes, selbst gestaltetes Leben lässt sich nicht abkürzen. Lebenskunst bleibt Menschensache.",
    ],
    hilft:
      "Wenn du etwas ändern willst, warte nicht auf den grossen Ruck. Nimm dir den kleinstmöglichen Schritt vor, jeden Tag einen und knüpfe ihn an etwas Schönes, zu dem du Ja sagst. Die KI darf dich erinnern und begleiten, aber die Übung, und damit dein Leben, gestaltest du selbst.",
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
 *
 * Mit `belege` kommt eine zweite Schicht dazu: wörtliche Beleg-Anker aus
 * `_data/belege.ts` werden zu Quellen-Verweisen. Gedacht für die Fallbeispiele,
 * die anders als die Einordnungen konkrete Tatsachen behaupten (Zahlen, Daten,
 * Ereignisse) und darum eine Quelle brauchen.
 *
 * Bewusst nur die Belege und nicht das ganze Glossar: `GlossarText` würde alle
 * 239 Glossarbegriffe in diese Texte ziehen, die karteneigenen Begriffe
 * überlagern und eine eigene Kollisionsrunde nötig machen. So bleibt der
 * Eingriff auf die Fallbeispiele beschränkt (Entscheid 2026-08-11).
 *
 * Reihenfolge wie in `GlossarText`: Belege haben Vorrang, danach die Begriffe,
 * Überlappungen fallen weg. Ein Beleg-Anker, der einen Kartenbegriff
 * überdeckt, nimmt ihm also den Hover — darum die Anker so wählen, dass sie
 * die Begriffswörter nicht enthalten.
 */
function InfoText({
  text,
  begriffe,
  belege = false,
}: {
  text: string;
  begriffe?: Begriffserklaerung[];
  /** Zusätzlich Beleg-Anker als Quellen-Verweise auszeichnen. */
  belege?: boolean;
}) {
  const map = new Map((begriffe ?? []).map((b) => [b.wort, b.erklaerung]));
  type Marke = { von: number; bis: number; wort: string; beleg?: Beleg; erklaerung?: string };
  const marken: Marke[] = [];

  if (belege) {
    for (const [anker, beleg] of BELEG_NACH_ANKER) {
      const i = text.indexOf(anker);
      if (i >= 0) marken.push({ von: i, bis: i + anker.length, wort: anker, beleg });
    }
  }
  if (map.size > 0) {
    const terme = [...map.keys()].sort((a, b) => b.length - a.length);
    const re = new RegExp(`(${terme.map(escapeRegExp).join("|")})`, "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      marken.push({
        von: m.index,
        bis: m.index + m[1].length,
        wort: m[1],
        erklaerung: map.get(m[1])!,
      });
    }
  }
  // Nach Position; bei gleichem Start zuerst der Beleg, dann der längere Treffer.
  marken.sort(
    (a, b) =>
      a.von - b.von ||
      Number(Boolean(b.beleg)) - Number(Boolean(a.beleg)) ||
      b.bis - b.von - (a.bis - a.von),
  );

  const teile: React.ReactNode[] = [];
  const schonErklaert = new Set<string>();
  let last = 0;
  for (const k of marken) {
    if (k.von < last) continue; // überlappt einen schon gesetzten Treffer
    if (!k.beleg) {
      if (schonErklaert.has(k.wort)) continue; // jeder Begriff nur einmal
      schonErklaert.add(k.wort);
    }
    if (k.von > last) teile.push(text.slice(last, k.von));
    teile.push(
      k.beleg ? (
        <BelegStelle key={k.von} wort={k.wort} beleg={k.beleg} />
      ) : (
        <Begriff key={k.von} wort={k.wort} erklaerung={k.erklaerung!} />
      ),
    );
    last = k.bis;
  }
  if (last < text.length) teile.push(text.slice(last));

  /* Absätze an der Leerzeile. Kein Treffer läuft über eine Leerzeile hinweg
   * (weder Anker noch Begriff enthalten Zeilenumbrüche), darum genügt es, die
   * reinen Textstücke aufzuteilen. */
  const absaetze: React.ReactNode[][] = [[]];
  for (const teil of teile) {
    if (typeof teil === "string" && teil.includes("\n\n")) {
      teil.split("\n\n").forEach((stueck, i) => {
        if (i > 0) absaetze.push([]);
        if (stueck) absaetze[absaetze.length - 1].push(stueck);
      });
    } else {
      absaetze[absaetze.length - 1].push(teil);
    }
  }

  const gesetzt = (knoten: React.ReactNode[]) =>
    knoten.map((t, i) => <Fragment key={i}>{t}</Fragment>);

  /* Ein Absatz: nur die Auszeichnung zurückgeben, der Aufrufer hat sein eigenes
   * `<p>` (so benutzen es die Einordnungen). Mehrere Absätze: hier die `<p>`
   * setzen, weil ein `<p>` im `<p>` ungültiges HTML wäre. */
  if (absaetze.length === 1) return <>{gesetzt(absaetze[0])}</>;
  return (
    <>
      {absaetze.map((knoten, i) => (
        <p key={i} className={`leading-relaxed${i > 0 ? " mt-sm" : ""}`}>
          {gesetzt(knoten)}
        </p>
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

  /**
   * Zuletzt angesehener Bereich — über Navigation und Neuladen hinweg gemerkt.
   *
   * Ohne das begann «Wege der Orientierung» immer wieder bei Bereich 1: Wer bei
   * Bereich 3 war, aufs Orakel ging und zurückkam, stand wieder am Anfang. Der
   * Abschnitt selbst klappte korrekt auf (`AkkordeonGruppe` merkt sich das),
   * nur die Stelle darin war weg. Christof hat das am 2026-08-08 gemeldet.
   *
   * Gleiches Muster wie `ki26-story-offen:…` in StoryGewebe und
   * `ki26-teppich-offen:…` im HistorienTeppich — diese Komponente war die
   * einzige der drei ohne.
   */
  const standKey = `ki26-denkwege-stand:${spurKey}`;
  const gespeicherterStand = useRef<number | null>(
    (() => {
      if (typeof window === "undefined") return null;
      try {
        const v = window.localStorage.getItem(standKey);
        const num = v === null || v === "" ? NaN : Number(v);
        return Number.isInteger(num) ? num : null;
      } catch {
        return null; // Privatmodus
      }
    })(),
  );
  const [gesehen, setGesehen] = useState<Set<number>>(new Set());
  /* Aufgeklappte Info-Box (nur eine offen), Schlüssel «bereichIdx-denkerIdx». */
  const [offeneBox, setOffeneBox] = useState<string | null>(null);
  /* Welche Denker-Boxen schon aufgeklappt waren — für den Haken. Aus den Spuren
     wiederhergestellt, damit der Haken einen Neustart übersteht. */
  const [gelesenDenker, setGelesenDenker] = useState<Set<string>>(new Set());

  /** Spur-Id einer Denker-Box (ohne das «mehr:» der Vertiefung). */
  const denkerSpur = (bereich: number, slug: string) =>
    `${spurKey}:denker:${bereich}:${slug}`;

  useEffect(() => {
    function restore() {
      const seen = leseSpurenIndices(spurKey).filter((i) => i >= 0 && i < gesamt);
      if (seen.length > 0) {
        setGesehen((prev) => {
          const nx = new Set(prev);
          seen.forEach((i) => nx.add(i));
          return nx;
        });
      }
      // Aufgeklappte Denker aus den Vertiefungs-Spuren zurücklesen.
      const praefix = `mehr:${spurKey}:denker:`;
      const offen = leseSpuren()
        .filter((s) => s.id.startsWith(praefix))
        .map((s) => s.id.slice(praefix.length));
      if (offen.length > 0) {
        setGelesenDenker((prev) => {
          const nx = new Set(prev);
          offen.forEach((k) => nx.add(k));
          return nx;
        });
      }
    }
    restore();
    /* Zuletzt angesehenen Bereich wiederherstellen — nur beim ersten Aufbau,
       darum im selben Effect und gegen `gesamt` geprüft (Bereiche können
       wegfallen, ein alter Stand darf nicht ins Leere zeigen). */
    const g = gespeicherterStand.current;
    if (g !== null && g > 0 && g < gesamt) setIdx(g);
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [spurKey, gesamt]);

  /* Jeden Wechsel merken. Kein eigener Effect für den Erst-Stand nötig: `idx`
     startet auf 0, und 0 zu speichern ist richtig. */
  useEffect(() => {
    try {
      window.localStorage.setItem(standKey, String(idx));
    } catch {
      /* Privatmodus → dann eben ohne Merken */
    }
  }, [standKey, idx]);

  useEffect(() => {
    BEREICHE.forEach((b, i) => {
      merkeInhalt(`${spurKey}:${i}`, b.titel);
      /* Auch die Denkerinnen und Denker gleich registrieren — ALLE, nicht nur
         die aufgeklappten. Vorher schrieb den Titel allein `KartenAktion`, und
         die rendert erst, wenn jemand die Box öffnet. Ergebnis: Von 20 Namen war
         in einem Browser, der die Seite durchgearbeitet hatte, kein einziger
         bekannt. In der Knotenkarte stand darum bei den weiterverfolgten
         Stimmen «Orientierung · Punkt 0».
         ACHTUNG, zwei Kennungen für dieselbe Person: Das Merkzeichen läuft unter
         `philosophische-perspektive:denker:…` (siehe `wunschId` unten), die
         Vertiefung unter `…:denkwege:denker:…` (siehe `denkerSpur`). Beide
         Formen erscheinen in der Knotenkarte — die eine im Register
         «Weiterverfolgt», die andere in «Vertieft» —, darum brauchen beide einen
         Titel. Zusammenlegen würde die gesammelten anonymen Zähler auseinander-
         reissen; das wäre eine Wanderung, nicht eine Korrektur. Der Wortlaut ist
         derselbe wie bei `KartenAktion` und `merkeVertiefung`, sonst gäbe es zwei
         Fassungen desselben Inhalts. */
      b.denker.forEach((p) => {
        const titel = `${p.name}: ${p.these}`;
        merkeInhalt(`philosophische-perspektive:denker:${i}:${p.slug}`, titel);
        merkeInhalt(denkerSpur(i, p.slug), titel);
      });
    });
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

  function boxUmschalten(
    key: string,
    bereich: number,
    person: { slug: string; name: string; these: string },
  ) {
    const wirdGeoeffnet = offeneBox !== key;
    const merkKey = `${bereich}:${person.slug}`;
    // Erst registrieren, dann den State setzen: `merkeVertiefung` feuert
    // SPUR_EVENT, und ein Ereignis aus einem State-Updater heraus würde
    // React die Folge-Aktualisierung anderer Komponenten verwerfen.
    if (wirdGeoeffnet && !gelesenDenker.has(merkKey)) {
      merkeVertiefung(denkerSpur(bereich, person.slug), `${person.name}: ${person.these}`);
      setGelesenDenker((prev) => new Set(prev).add(merkKey));
    }
    // Single-open: dieselbe Box schliesst, eine andere öffnet (schliesst die
    // vorherige).
    setOffeneBox((prev) => (prev === key ? null : key));
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
            <p key={i}>
              <InfoText text={absatz} begriffe={b.absatzBegriffe} />
            </p>
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
              const auf = offeneBox === key;
              const schon = gelesenDenker.has(`${idx}:${p.slug}`);
              return (
                <div key={p.slug} className={i > 0 ? "border-t border-outline-variant" : ""}>
                  <button
                    type="button"
                    onClick={() => boxUmschalten(key, idx, p)}
                    aria-expanded={auf}
                    className="flex w-full items-center gap-sm px-sm py-sm text-left outline-none transition-colors hover:bg-surface-container focus-visible:bg-surface-container"
                  >
                    {/* Nach dem Aufklappen ein Haken statt des Stimmen-Symbols,
                        gleiches Muster wie bei den Epochen-Bausteinen. */}
                    <span className="material-symbols-outlined text-[20px] text-tertiary">
                      {schon ? "check" : "record_voice_over"}
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
                      {p.beispiel && (
                        /* Der Knopf trägt die gleiche Spur-Basis wie das
                           Weiterverfolgen darunter, nur mit «mehr:» statt
                           «wunsch:» — so zählt das Aufklappen als Vertiefung,
                           genau wie ein «Mehr lesen» im Teppich. */
                        <Ausklapptext
                          className="mt-sm"
                          titel="Fallbeispiel"
                          spurId={`mehr:philosophische-perspektive:denker:${idx}:${p.slug}`}
                          spurTitel={`${p.name}: Fallbeispiel`}
                        >
                          {/* `belege` nur hier: Fallbeispiele behaupten
                              Tatsachen (Zahlen, Daten, Ereignisse), die
                              Einordnungen darüber referieren Positionen.

                              Kein `<p>` um den Aufruf: Bei einem Text mit
                              Leerzeilen setzt `InfoText` die Absätze selbst.
                              Ein erster Versuch teilte hier auf und gab allen
                              Absätzen ein gemeinsames Set schon erklärter
                              Begriffe mit — das überlebt den doppelten Aufruf
                              im Entwicklungsmodus nicht, der verworfene erste
                              Durchgang verbraucht die Begriffe und der zweite
                              zeichnet keinen mehr aus. Darum bleibt die
                              Auszeichnung ein Durchgang über den ganzen Text
                              und die Absätze entstehen daraus. */}
                          <InfoText text={p.beispiel} begriffe={p.begriffe} belege />
                        </Ausklapptext>
                      )}
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
