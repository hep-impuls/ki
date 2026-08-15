"use client";

import { Fragment } from "react";
import HoverTipp from "./HoverTipp";
import { BELEG_NACH_ANKER, type Beleg } from "../_data/belege";

/**
 * Glossar — Fachbegriffe mit Kurzerklärung beim Hovern (Desktop) bzw. Antippen
 * (Touch/Fokus). `GlossarText` durchsucht einen Text nach bekannten Begriffen
 * und hängt beim ERSTEN Vorkommen je Begriff eine Erklärung an. Nur
 * Theme-Tokens. Erklärungen bewusst laienverständlich und kurz.
 */

export const GLOSSAR: Record<string, string> = {
  Sesshaftigkeit:
    "Der Übergang vom umherziehenden Jagen und Sammeln zum festen Wohnen mit Ackerbau.",
  Sophisten:
    "Bezahlte Wanderlehrer im antiken Griechenland; Platon warf ihnen vor, Wahrheit sei bei ihnen verhandelbar.",
  Keilschrift:
    "Eine der ältesten Schriften: keilförmige Zeichen, in feuchten Ton gedrückt.",
  Quipu:
    "Anden-Knotenschnur, die Zahlen und Daten in Knoten speichert, statt in Schrift.",
  Quipus:
    "Anden-Knotenschnüre, die Zahlen und Daten in Knoten speichern, statt in Schrift.",
  Papyrus:
    "Beschreibbares Material aus der Papyrusstaude, im alten Ägypten hergestellt.",
  Stellenwertsystem:
    "Zahlenschreibweise, bei der die Position einer Ziffer ihren Wert bestimmt (Einer, Zehner, Hunderter).",
  Algorithmus:
    "Eine endliche, klar festgelegte Folge von Schritten zum Lösen einer Aufgabe.",
  Heliozentrik:
    "Das Weltbild, in dem die Sonne im Zentrum steht, nicht die Erde.",
  Karavelle:
    "Wendiges Segelschiff, das die europäischen Ozeanfahrten ab dem 15. Jahrhundert ermöglichte.",
  Reformation:
    "Kirchenspaltung ab 1517: Aus der Kritik Luthers u.a. entstand der Protestantismus.",
  Aufklärung:
    "Geistige Bewegung des 18. Jahrhunderts: Vernunft, Selbstdenken, Kritik an Autoritäten.",
  Kolonialisierung:
    "Eroberung, Beherrschung und Ausbeutung fremder Länder; hier gemeint ist die europäische Expansion ab 1492.",
  Industrialisierung:
    "Der Übergang zur maschinellen Fabrikproduktion ab dem späten 18. Jahrhundert.",
  Schoah:
    "Der von Nazi-Deutschland begangene Völkermord an den europäischen Jüdinnen und Juden.",
  Globalisierung:
    "Die weltweite Verflechtung von Wirtschaft, Politik und Kultur.",
  "Dartmouth-Konferenz":
    "Treffen 1956, bei dem der Begriff «künstliche Intelligenz» geprägt wurde.",
  "KI-Winter":
    "Phasen, in denen Geldgeber und Öffentlichkeit den Glauben an die KI verloren.",
  "Deep Learning":
    "KI-Methode mit vielschichtigen künstlichen neuronalen Netzen, die Grundlage heutiger Modelle.",
  Deepfakes:
    "Täuschend echte, mit KI erzeugte oder manipulierte Bilder, Stimmen und Videos.",
  ARPANET:
    "Militärisches Forschungsnetz der USA (1969), der Vorläufer des Internets.",
  Enigma:
    "Die Chiffriermaschine, mit der die deutsche Wehrmacht ihren Funk verschlüsselte.",
  Container:
    "Genormte Stahlboxen, die weltweiten Warentransport billig und schnell machten.",
  Platon:
    "Athener Philosoph (Schüler des Sokrates); seine Dialoge begründen die abendländische Philosophie.",
  Aristoteles:
    "Griechischer Philosoph (Schüler Platons); prägte die formale Logik und zahlreiche empirisch orientierte Untersuchungen.",
  Philosophie:
    "Wörtlich «Liebe zur Weisheit»: das begründende Nachdenken über die Grundfragen.",
  Völkerwanderung:
    "Umbruchszeit (4.–6. Jh.), in der germanische Verbände ins Römische Reich zogen.",
  Augustinus:
    "Kirchenvater (354–430); verlegte nach dem Fall Roms den Halt nach innen: Glaube und Gewissen.",
  Mittelalter:
    "Epoche zwischen Antike und Neuzeit (~500–1500), geprägt von Christentum und Feudalordnung.",
  Bias: "Systematische Verzerrung, etwa wenn Daten bestimmte Gruppen bevorzugen oder ausblenden.",
  Flugschriften:
    "Billige Druckblätter, das schnelle Massenmedium der Reformationszeit.",
  Algorithmen:
    "Klar festgelegte Folgen von Schritten, nach denen Computer arbeiten; manche ziehen dabei auch den Zufall hinzu.",
  Voltaire:
    "Französischer Aufklärer (1694–1778), scharfzüngiger Kritiker von Kirche und Autoritäten.",
  Terror:
    "Die Schreckensherrschaft 1793/94: Die Revolution liess Tausende unter der Guillotine hinrichten.",
  Kant: "Immanuel Kant (1724–1804): «Habe Mut, dich deines eigenen Verstandes zu bedienen.»",
  Radar: "Ortung per Funkwellen, im Zweiten Weltkrieg entscheidend weiterentwickelt.",
  ENIAC:
    "Einer der ersten elektronischen Computer (USA, 1945), gebaut für Militärberechnungen.",
  Colossus:
    "Britischer Röhrenrechner (1943) zum Knacken deutscher Chiffren, lange geheim gehalten.",
  Sputnik:
    "Der erste Satellit im All (Sowjetunion, 1957). Er löste im Westen den «Sputnik-Schock» aus.",
  Ostblock:
    "Die sozialistischen Staaten unter sowjetischer Führung bis 1989/91.",
  Digitalisierung:
    "Die Verlagerung von Information und Abläufen in Computer und Netze.",
  "World Wide Web":
    "Das verlinkte Seitensystem von Tim Berners-Lee: Vorschlag 1989, erste Website 1991, 1993 vom CERN zur freien Nutzung freigegeben.",
  Arbeitsteilung:
    "Aufteilung der Arbeit in spezialisierte Tätigkeiten, die Grundlage von Städten und Handel.",
  Mesopotamien:
    "Das Zweistromland (im heutigen Irak), früher Schauplatz von Schrift, Rad und Stadt.",
  /* Zweiter Schlüssel in der gebeugten Form, weil die Auszeichnung wörtlich
     sucht: Beim Pflug steht «in den frühen Städten Mesopotamiens». */
  Mesopotamiens:
    "Das Zweistromland (im heutigen Irak), früher Schauplatz von Schrift, Rad und Stadt.",
  Uruk:
    "Eine der ältesten Städte der Welt, im Süden des heutigen Irak. Dort entstanden die frühesten bekannten Schriftzeichen.",
  Hochkulturen:
    "Frühe komplexe Gesellschaften mit Städten, Schrift und Verwaltung.",
  Keilschrifttafeln:
    "Tontafeln mit eingedrückten keilförmigen Zeichen, die ältesten Schriftdokumente.",
  Buchdruck:
    "Das Verfahren, Texte mit beweglichen Metalllettern massenhaft zu vervielfältigen; in Europa ab etwa 1450 durch Gutenberg.",
  Jikji: "Koreanische Schrift von 1377, das älteste erhaltene Buch aus beweglichen Metalllettern.",
  Schiesspulver:
    "In China entwickelte Explosivmischung. Sie veränderte Krieg und Machtverhältnisse weltweit.",
  Lettern: "Einzelne, bewegliche Druckbuchstaben aus Metall.",
  Kompass:
    "Instrument mit Magnetnadel zur Richtungsbestimmung. Es kam aus China nach Europa.",
  Automatisierung:
    "Maschinen übernehmen Abläufe, die vorher Menschen ausführten.",
  Landflucht: "Massenhafte Abwanderung vom Land in die Städte.",
  Marx: "Karl Marx (1818–1883): analysierte Kapitalismus und Industriegesellschaft. Verhältnisse sind gemacht, also veränderbar.",
  Industriemoderne:
    "Die von Fabrik, Dampfkraft und Stadt geprägte Epoche des 19. Jahrhunderts.",
  V2: "Deutsche Grossrakete des Zweiten Weltkriegs, als Waffe gebaut, technisch der erste Schritt ins All.",
  Satelliten:
    "Künstliche Himmelskörper in der Erdumlaufbahn, für Funk, Navigation, Wetter und Militär.",
  ChatGPT: "Der 2022 veröffentlichte Chatbot von OpenAI, der KI massentauglich machte.",
  Expertensysteme:
    "Frühe KI der 1970er/80er, die Fachwissen in Wenn-dann-Regeln goss.",
  Eratosthenes:
    "Griechischer Gelehrter in Alexandria (~276–194 v. Chr.); berechnete den Erdumfang.",
  Geometrie: "Mathematik der Formen, Flächen und Winkel.",
  Kolumbus:
    "Genuesischer Seefahrer in spanischem Dienst; erreichte 1492 Amerika.",
  "al-Chwarizmi":
    "Gelehrter in Bagdad (~780–850); aus seinem Namen entstand das Wort «Algorithmus».",
  Informatik: "Die Wissenschaft der automatischen Informationsverarbeitung.",
  Kopernikus:
    "Astronom (1473–1543); setzte die Sonne ins Zentrum des Weltbilds.",
  Psychoanalyse:
    "Sigmund Freuds Lehre vom Unbewussten: Der Mensch ist «nicht Herr im eigenen Haus».",
  Evolutionstheorie:
    "Darwins Erklärung, wie Arten durch Variation und Auslese entstehen.",
  Atomkern:
    "Das winzige Zentrum des Atoms; seine Spaltung setzt enorme Energie frei.",
  Hiroshima:
    "Japanische Stadt, am 6. August 1945 durch die erste Atombombe zerstört.",
  "neolithische Revolution":
    "Der Übergang zu Ackerbau und Sesshaftigkeit, die tiefste Umwälzung der Menschheitsgeschichte.",
  Eigentum:
    "Rechtlich anerkannte Verfügung über Dinge. Sie entsteht historisch mit Vorräten und Feldern.",
  /* Der Schlüssel trägt die gebeugte Form, weil die Auszeichnung wörtlich
     sucht: Im Text steht «im sogenannten Fruchtbaren Halbmond». */
  "Fruchtbaren Halbmond":
    "Landstreifen am Rand der Syrischen Wüste, von Israel über Syrien bis in den Irak und Iran. Eines der Gebiete, in denen Ackerbau und Viehzucht entstanden.",
  "Çatalhöyük":
    "Jungsteinzeitliche Siedlung in der heutigen Türkei, bewohnt zwischen etwa 7500 und 5700 v. Chr. Sie gilt als die erste Grosssiedlung der Weltgeschichte.",
  Pfahlbaudörfer:
    "Holzhäuser auf Pfählen an Seeufern und in Feuchtgebieten. Rund um die Alpen führt die UNESCO 111 solche Fundstellen als Welterbe, 56 davon in der Schweiz.",
  /* Teppich des Wandels, Fäden «Gesellschaftliche Ereignisse» und
     «Entdeckungen» (Christofs Kontrollrunde 2026-08-11). */
  Odoaker:
    "Weströmischer Offizier germanischer Herkunft. Setzte 476 den letzten weströmischen Kaiser ab und wurde König von Italien.",
  "Romulus Augustulus":
    "Der letzte weströmische Kaiser, noch ein Jugendlicher. 476 von Odoaker abgesetzt.",
  Azteken:
    "Hochkultur im Tal von Mexiko, 14. bis frühes 16. Jahrhundert, mit der Hauptstadt Tenochtitlan.",
  Inka:
    "Indigene Kultur in Südamerika. Ihr Reich reichte um 1530 vom heutigen Ecuador bis nach Chile.",
  "La Malinche":
    "Dolmetscherin und Vermittlerin des Eroberers Cortés. Ohne sie hätte er mit den Verbündeten kaum verhandeln können.",
  Ablassbriefe:
    "Kirchliche Schreiben gegen Geld, die zeitliche Sündenstrafen erlassen sollten. Ihr Verkauf löste 1517 Luthers Thesen aus.",
  "Huldrych Zwingli":
    "Der erste Zürcher Reformator (1484–1531). Aus der Zürcher und der Genfer Reformation gingen die reformierten Kirchen hervor.",
  Pombal:
    "Sebastião de Melo, Marquês de Pombal, Erster Minister Portugals. Baute Lissabon nach dem Beben von 1755 planvoll wieder auf.",
  Robespierre:
    "Anführer der radikalen Phase der Französischen Revolution. Organisierte den Terror und wurde 1794 selbst hingerichtet.",
  "Hannah Arendt":
    "Politische Denkerin (1906–1975), floh vor den Nazis in die USA. Untersuchte, wie totalitäre Herrschaft funktioniert.",
  "Margaret Hamilton":
    "Informatikerin am MIT. Leitete die Entwicklung der Bordsoftware für die Apollo-Mondlandungen.",
  "Juri Gagarin":
    "Sowjetischer Kosmonaut. Am 12. April 1961 als erster Mensch im Weltraum.",
  "Michail Gorbatschow":
    "Letzter Präsident der Sowjetunion. Seine Reformen Glasnost und Perestroika leiteten das Ende des Ostblocks ein.",
  /* Teppich, Faden «Kulturelle Praxen» (Abschluss der Kontrollrunde). */
  Plinius:
    "Plinius der Ältere, römischer Gelehrter (23/24 bis 79 n. Chr.). Seine «Naturalis historia» ist eine Naturkunde in 37 Büchern.",
  Pest:
    "Der «Schwarze Tod» ab 1347: eine Seuchenwelle, die in Europa einen grossen Teil der Bevölkerung tötete.",
  Zunft:
    "Zusammenschluss von Handwerkern desselben Gewerbes, mit eigenen Regeln, Ausbildungsstufen und Rechten.",
  "Karl II.":
    "Englischer König von 1660 bis 1685. Sein Versuch, die Kaffeehäuser zu schliessen, scheiterte am Widerstand.",
  Karawanen: "Handelszüge aus Lasttieren durch Wüsten und Steppen.",
  "islamische Blütezeit":
    "Etwa 8.–13. Jahrhundert: Wissenschaft und Kultur der islamischen Welt in voller Blüte.",
  Trainingsdaten:
    "Die Beispielsammlungen, aus denen eine KI ihre Muster lernt.",
  Disputation:
    "Das geregelte wissenschaftliche Streitgespräch der mittelalterlichen Universität.",
  institutionalisiert:
    "Etwas bekommt feste Regeln, Ämter und Dauer, es wird zur Einrichtung.",
  Öffentlichkeit:
    "Der Raum, in dem Bürgerinnen und Bürger gemeinsam über Angelegenheiten aller verhandeln.",
  Lieferketten:
    "Die weltweiten Stationen, die ein Produkt vom Rohstoff bis in den Laden durchläuft.",
  Freihandelsabkommen:
    "Verträge, die Zölle und Handelsschranken zwischen Staaten abbauen.",
  Naturalwirtschaft:
    "Wirtschaft ohne Geld: Man tauscht Waren und Dienste direkt, statt zu kaufen und verkaufen.",
  Skriptorien:
    "Schreibstuben mittelalterlicher Klöster, in denen Mönche Bücher von Hand abschrieben.",
  Anamorphose:
    "Ein absichtlich verzerrtes Bild, das erst aus einem bestimmten Blickwinkel richtig erscheint.",
  Enzyklopädie:
    "Grosses Nachschlagewerk, das das Wissen einer Zeit geordnet zusammenfasst.",
  "kategorischer Imperativ":
    "Kants Grundregel der Moral: Handle so, dass dein Handeln allgemeines Gesetz sein könnte.",
  Materialschlacht:
    "Massenschlacht des industrialisierten Kriegs, in der Menschenleben gegen Material «verrechnet» werden.",
  Ludditen:
    "Englische Arbeiter, die ab 1811 Maschinen zerstörten, weil sie ihre Arbeit vernichteten.",
  Rundfunk:
    "Verbreitung von Ton (später Bild) an ein Massenpublikum über Funkwellen: Radio und Fernsehen.",
  Existenzialismus:
    "Philosophie des 20. Jh.: Der Mensch hat kein festes Wesen, sondern macht sich durch seine Wahl.",
  "Banalität des Bösen":
    "Hannah Arendts Befund: Grosse Verbrechen werden oft von unauffälligen Mitläufern begangen, die nicht selbst denken.",
  Postmoderne:
    "Denkrichtung, die «grosse», allgemeingültige Erzählungen bezweifelt und Vielfalt betont.",
  Deindustrialisierung:
    "Rückgang der Fabrikarbeit in einer Region, weil Produktion abwandert oder wegfällt.",
  Resonanz:
    "Bei Hartmut Rosa: ein antwortendes, lebendiges Verhältnis zur Welt, der Gegenbegriff zur blossen Beschleunigung.",
  "Akteur-Netzwerk-Theorie":
    "Bruno Latours Ansatz: Wirkung entsteht im Netz aus Menschen UND Dingen, nichts handelt allein.",
  /* «Bernoulli-Rechnung» ist die Wendung im Lernset-Text, «Bernoulli-Zahlen»
     die Sache selbst — beide brauchen einen Eintrag, weil auf Wortgrenze
     gesucht wird. */
  "Bernoulli-Zahlen":
    "Eine Zahlenfolge aus der Mathematik, benannt nach ihrem Entdecker Jakob I Bernoulli; sie taucht unter anderem in der Zahlentheorie auf.",
  "Bernoulli-Rechnung":
    "Das Rechenbeispiel in Lovelaces Anmerkungen; sie zeigte Schritt für Schritt, wie die Maschine die Bernoulli-Zahlen ermitteln würde, eine Zahlenfolge aus der Mathematik.",
  Programmiersprache:
    "Eine künstliche Sprache, in der Menschen einem Computer Anweisungen aufschreiben.",
  Nimrod:
    "In der biblischen Überlieferung ein gewaltiger Jäger und König in Babel. Zum Bauherrn des Turms machten ihn erst spätere Erzählungen ausserhalb der Bibel, im Buch Genesis selbst hat der Turmbau keinen namentlichen Bauherrn.",
  Natalität:
    "Arendts Wort für die Gebürtlichkeit, einen Wesenszug des Menschen, nicht die blosse Geburt, denn geboren werden auch andere Wesen. Jeder Mensch kommt als jemand Neues zur Welt und dieses Neusein hört nicht auf, Menschen können ihr Leben lang Anfänge setzen, die aus dem Bisherigen nicht ableitbar sind.",
  "Manhattan-Projekt":
    "Das geheime US-Grossprojekt (1942–45), das die erste Atombombe baute.",
  Transformer:
    "Die KI-Architektur von 2017; sie setzt ganz auf den schon vorher bekannten Attention-Mechanismus und ist die Grundlage heutiger Sprachmodelle wie ChatGPT.",
  "Newcomen-Maschine":
    "Frühe Dampfmaschine (1712) zum Abpumpen von Grubenwasser, die Vorläuferin von Watts Maschine.",
  Humanismus:
    "Bildungsbewegung der Renaissance: Der Mensch und seine Formung durch Bildung rücken ins Zentrum.",
  Gewaltenteilung:
    "Aufteilung der Staatsmacht in Gesetzgebung, Regierung und Gerichte, zum Schutz vor Machtmissbrauch.",
  Anthropozän:
    "Vorgeschlagenes Erdzeitalter, in dem der Mensch die Erde (Klima, Arten, Gestein) prägend verändert.",
  Erdüberlastungstag:
    "Der Tag im Jahr, an dem die Menschheit mehr verbraucht hat, als die Erde in diesem Jahr nachliefern kann; berechnet wird er von der Organisation Global Footprint Network, englisch heisst er «Earth Overshoot Day».",
  /* Beugungsformen brauchen je einen eigenen Eintrag, weil auf Wortgrenze
     gesucht wird. Im Bestand steht derzeit nur «fossilen»; die übrigen Formen
     sind Vorsorge, damit der Hover nicht beim nächsten Satz ausfällt. */
  fossilen:
    "Kohle, Erdöl und Erdgas: Brennstoffe aus toten Pflanzen und Tieren der Erdvorzeit; beim Verbrennen geben sie den Kohlenstoff als CO₂ frei, den die Erde über Millionen Jahre eingelagert hat.",
  fossile:
    "Kohle, Erdöl und Erdgas: Brennstoffe aus toten Pflanzen und Tieren der Erdvorzeit; beim Verbrennen geben sie den Kohlenstoff als CO₂ frei, den die Erde über Millionen Jahre eingelagert hat.",
  fossiler:
    "Kohle, Erdöl und Erdgas: Brennstoffe aus toten Pflanzen und Tieren der Erdvorzeit; beim Verbrennen geben sie den Kohlenstoff als CO₂ frei, den die Erde über Millionen Jahre eingelagert hat.",
  Sprachmodelle:
    "Programme, die aus riesigen Textmengen gelernt haben, das nächste Wort vorherzusagen, und so selbst Texte schreiben.",
  Sprachmodellen:
    "Programme, die aus riesigen Textmengen gelernt haben, das nächste Wort vorherzusagen, und so selbst Texte schreiben.",
  "Turing-Test":
    "Ein von Alan Turing 1950 vorgeschlagenes Gespräch, das prüft, ob man eine Maschine für einen Menschen hält.",
  Temperatur:
    "Eine Einstellung der KI. Sie steuert, wie viel Zufall in der Wortwahl steckt. Ein hoher Wert macht die Antworten kreativer und unberechenbarer, ein niedriger vorhersehbarer.",
  Vektor:
    "Ein langer Zahlencode. Modelle stellen damit Wortteile und andere Daten so dar, dass Nähe und Ähnlichkeit messbar werden. Wie viele Zahlen dazugehören, hängt vom Modell ab.",
  Gutenberg:
    "Johannes Gutenberg (um 1400 bis 1468); entwickelte in Mainz das erste wirtschaftlich erfolgreiche Verfahren des Buchdrucks mit gegossenen Metalllettern.",
  Gutenbergs:
    "Johannes Gutenberg (um 1400 bis 1468); entwickelte in Mainz das erste wirtschaftlich erfolgreiche Verfahren des Buchdrucks mit gegossenen Metalllettern.",
  Sokrates:
    "Athener Philosoph (469 bis 399 v. Chr.); fragte hartnäckig nach. Das berühmte «Ich weiss, dass ich nichts weiss» ist eine spätere Kurzformel.",
  Antike:
    "Zeit der Griechen und Römer (rund 800 v. Chr. bis 500 n. Chr.), Wiege von Philosophie, Demokratie und Wissenschaft.",
  Renaissance:
    "«Wiedergeburt» der Antike im 15./16. Jahrhundert, Aufbruch in Kunst, Wissenschaft und Menschenbild.",
  Spätantike:
    "Übergangszeit vom Römischen Reich zum Mittelalter (etwa 300 bis 600).",
  "Mary Shelley":
    "Britische Schriftstellerin (1797 bis 1851); begann «Frankenstein» mit 18 Jahren, erschienen ist der Roman 1818.",
  "Ada Lovelace":
    "Britische Mathematikerin (1815 bis 1852); ihre Notizen zu Babbages Rechenmaschine gelten oft als erstes Computerprogramm.",
  Babbage:
    "Charles Babbage (1791 bis 1871), englischer Mathematiker; entwarf die erste programmierbare Rechenmaschine.",
  Babbages:
    "Charles Babbage (1791 bis 1871), englischer Mathematiker; entwarf die erste programmierbare Rechenmaschine.",
  Turing:
    "Alan Turing (1912 bis 1954), britischer Mathematiker; half die Enigma zu knacken und legte mit der Turingmaschine eine Grundlage der theoretischen Informatik.",
  Turings:
    "Alan Turing (1912 bis 1954), britischer Mathematiker; half die Enigma zu knacken und legte mit der Turingmaschine eine Grundlage der theoretischen Informatik.",
  Weizenbaum:
    "Joseph Weizenbaum (1923 bis 2008), Informatiker am MIT; baute ELIZA und wurde zum Kritiker blinder Computergläubigkeit.",
  ELIZA:
    "Frühes Chatprogramm (1966) von Joseph Weizenbaum; ahmte eine Gesprächstherapeutin nach und verblüffte die Nutzenden.",
  Hinton:
    "Geoffrey Hinton (geboren 1947), Pionier der künstlichen neuronalen Netze; gilt als «Pate» des Deep Learning.",
  "Lee Sedol":
    "Südkoreanischer Go-Meister; verlor 2016 gegen die KI AlphaGo, ein Wendepunkt der KI-Geschichte.",
  AlphaGo:
    "KI der Firma DeepMind; schlug 2016 den Go-Meister Lee Sedol.",
  DeepMind:
    "Londoner KI-Firma (heute Teil von Google); baute AlphaGo.",
  McCarthy:
    "John McCarthy (1927 bis 2011), US-Informatiker; prägte 1956 den Begriff «künstliche Intelligenz».",
  /* Die drei Namen aus dem Dartmouth-Text, auf Christofs Wunsch mit
     Hover-Erklärung (2026-08-10). Angaben geprüft an der deutschen Wikipedia. */
  "Marvin Minsky":
    "Marvin Minsky (1927 bis 2016), US-Forscher; begründete 1956 in Dartmouth mit McCarthy, Rochester und Shannon den Begriff der künstlichen Intelligenz und später das KI-Labor am MIT.",
  Informationstheorie:
    "Von Claude Shannon begründete mathematische Theorie, die Information messbar macht; sie behandelt Übertragung, Kompression und Kodierung von Nachrichten.",
  "Rockefeller-Stiftung":
    "1913 von John D. Rockefeller gegründete US-Stiftung in New York, die Gesundheitswesen, Wissenschaft und Kultur fördert; sie finanzierte auch das Dartmouth-Treffen von 1956.",
  /* Die vier Stellen aus dem Homunkulus-Text, auf Christofs Wunsch mit
     Hover-Erklärung (2026-08-10). Angaben an der deutschen Wikipedia geprüft.

     «Faust II» statt «Faust»: Die Auszeichnung nimmt immer das ERSTE Vorkommen
     eines Begriffs, und «Faust» steht zuerst im Werktitel «Faust II». Ein
     Eintrag «Faust» hätte darum die Hälfte des Titels unterstrichen und den
     zweiten «Faust», den die Figur meint, unberührt gelassen. Der Eintrag am
     ganzen Titel erklärt beides, Werk und Figur. */
  "Ernst Bloch":
    "Ernst Bloch (1885 bis 1977), deutscher Philosoph in der Tradition von Karl Marx; sein Hauptwerk «Das Prinzip Hoffnung» denkt über Utopie und noch nicht Verwirklichtes nach.",
  Goethe:
    "Johann Wolfgang von Goethe (1749 bis 1832), deutscher Dichter, Politiker und Naturforscher; einer der bedeutendsten Schöpfer deutschsprachiger Dichtung.",
  "Faust II":
    "Zweiter Teil von Goethes Tragödie «Faust» (1832). Faust ist darin der Gelehrte, der mit dem Teufel paktiert; der zweite Teil weitet die Geschichte zu einer Parabel über die Menschheit aus.",
  Phiole:
    "Birnenförmiges Glasgefäss mit langem, engem Hals, wie es schon die Alchemisten der Antike benutzten.",
  Theoreme:
    "Bewiesene Sätze der Mathematik oder Logik. Ein Theorem gilt erst, wenn es lückenlos aus Annahmen hergeleitet ist.",
  Perzeptron:
    "Sehr einfaches künstliches Nervennetz, 1957 von Frank Rosenblatt vorgestellt. Es lernt aus Beispielen, statt Regeln vorgesetzt zu bekommen.",
  Psychotherapeuten:
    "Fachperson, die seelische Belastungen im Gespräch behandelt. ELIZA ahmte eine Gesprächsform nach, in der vor allem zurückgefragt wird.",
  SHRDLU:
    "Programm von 1972, das Sprachverstehen und planvolles Handeln verband; es bewegte auf Befehl farbige Klötze in einer erfundenen Welt.",
  "Terry Winograd":
    "US-amerikanischer Informatiker, Professor in Stanford; entwickelte SHRDLU und wurde später als Kritiker überhöhter KI-Erwartungen bekannt.",
  Kempelen:
    "Wolfgang von Kempelen (1734 bis 1804); baute den «Schachtürken», einen scheinbar denkenden Automaten mit verstecktem Spieler.",
  "Jaquet-Droz":
    "Schweizer Uhrmacherfamilie aus La Chaux-de-Fonds; ihre Automaten (um 1770) konnten schreiben und Musik spielen.",
  Golem:
    "Prager Sagengestalt: eine aus Lehm geformte Figur, die dienen soll, und ausser Kontrolle gerät.",
  Talos:
    "Bronzeriese der griechischen Sage, der Kreta bewachte. Erzählt wird er vor allem in der «Argonautika» des Apollonios von Rhodos, nicht in der «Ilias».",
  Binärsystem:
    "Zahlensystem mit nur zwei Ziffern, null und eins. Computer rechnen damit, weil Strom entweder fliesst oder nicht.",
  MYCIN:
    "Expertensystem, ab 1972 in Stanford entwickelt. Es sollte Infektionskrankheiten erkennen und die Behandlung mit Antibiotika vorschlagen.",
  "Satz von Bayes":
    "Rechenregel der Wahrscheinlichkeit. Sie sagt, wie sich eine Einschätzung ändert, sobald ein neuer Hinweis dazukommt.",
  /* Der Schlüssel trägt die gebeugte Form, weil die Auszeichnung wörtlich
     sucht: Im Text steht «erster funktionsfähiger programmgesteuerter Rechner». */
  "programmgesteuerter Rechner":
    "Maschine, die ein gespeichertes Programm Schritt für Schritt abarbeitet, also ein Computer. Sie rechnet nicht nur, sie führt Anweisungen aus.",
  Descartes:
    "René Descartes (1596 bis 1650), französischer Philosoph, «Ich denke, also bin ich».",
  Hegel:
    "G. W. F. Hegel (1770 bis 1831), deutscher Philosoph; dachte Denken als Unterscheiden und Zusammenführen von Gegensätzen.",
  Hegels:
    "G. W. F. Hegel (1770 bis 1831), deutscher Philosoph; dachte Denken als Unterscheiden und Zusammenführen von Gegensätzen.",
  Luther:
    "Martin Luther (1483 bis 1546); seine 95 Thesen (1517) lösten die Reformation aus.",
  Luthers:
    "Martin Luther (1483 bis 1546); seine 95 Thesen (1517) lösten die Reformation aus.",
  "James Watt":
    "Schottischer Ingenieur (1736 bis 1819); seine verbesserte Dampfmaschine trieb die Industrialisierung an.",
  Watts:
    "James Watt (1736 bis 1819), schottischer Ingenieur; seine verbesserte Dampfmaschine trieb die Industrialisierung an.",
  Darwin:
    "Charles Darwin (1809 bis 1882), britischer Naturforscher; erklärte die Entstehung der Arten durch Evolution.",
  Darwins:
    "Charles Darwin (1809 bis 1882), britischer Naturforscher; erklärte die Entstehung der Arten durch Evolution.",
  Freud:
    "Sigmund Freud (1856 bis 1939), Wiener Arzt; begründete die Psychoanalyse.",
  Newton:
    "Isaac Newton (1643 bis 1727), englischer Physiker; beschrieb Gravitation und Bewegungsgesetze.",
  Newtons:
    "Isaac Newton (1643 bis 1727), englischer Physiker; beschrieb Gravitation und Bewegungsgesetze.",
  Galilei:
    "Galileo Galilei (1564 bis 1642), italienischer Astronom; stützte das heliozentrische Weltbild und geriet in Konflikt mit der Kirche.",
  Diderot:
    "Denis Diderot (1713 bis 1784), französischer Aufklärer; Herausgeber der grossen Enzyklopädie.",
  Nussbaum:
    "Felix Nussbaum (1904 bis 1944), deutsch-jüdischer Maler; malte seine Verfolgung und wurde in Auschwitz ermordet.",
  Menzel:
    "Adolph Menzel (1815 bis 1905), deutscher Maler; sein «Eisenwalzwerk» zeigt als erstes grosses Gemälde die Fabrikarbeit.",
  Menzels:
    "Adolph Menzel (1815 bis 1905), deutscher Maler; sein «Eisenwalzwerk» zeigt als erstes grosses Gemälde die Fabrikarbeit.",
  "Kalter Krieg":
    "Machtkampf zwischen USA und Sowjetunion (1947 bis 1991), ausgetragen ohne direkten Krieg, mit Wettrüsten und Stellvertreterkriegen.",
  "Kalten Krieg":
    "Machtkampf zwischen USA und Sowjetunion (1947 bis 1991), ausgetragen ohne direkten Krieg, mit Wettrüsten und Stellvertreterkriegen.",
  "Kalten Kriegs":
    "Machtkampf zwischen USA und Sowjetunion (1947 bis 1991), ausgetragen ohne direkten Krieg, mit Wettrüsten und Stellvertreterkriegen.",
  "Blue Marble":
    "Berühmtes Foto der ganzen Erde, aufgenommen von Apollo 17 (1972); machte die Verletzlichkeit des Planeten sichtbar.",
  Byzanz:
    "Das oströmische Reich mit Hauptstadt Konstantinopel (heute Istanbul); bewahrte antikes griechisches Wissen über tausend Jahre.",
  Samarkand:
    "Handelsstadt an der Seidenstrasse (heute Usbekistan); über sie kam die Papierherstellung aus China nach Westen.",
  Mongolen:
    "Reitervolk aus Zentralasien; eroberte im 13. Jahrhundert das grösste Landreich der Geschichte, 1258 auch Bagdad.",
  Kalifen:
    "Herrscher der islamischen Welt, die sich als Nachfolger Mohammeds verstanden.",
  Tigris:
    "Grosser Fluss im heutigen Irak; Bagdad wurde an seinem Ufer gebaut.",
  Perceptron:
    "Frühes lernendes Kunstneuron (1958, Frank Rosenblatt); Urahn der heutigen neuronalen Netze.",
  Perceptrons:
    "Frühes lernendes Kunstneuron (1958, Frank Rosenblatt); Urahn der heutigen neuronalen Netze.",

  /* Antike — Orte, Personen und Begriffe, die ohne Geschichtsunterricht nichts
     sagen. Bewusst in Alltagssprache, ein Satz, kein Lexikonton. */
  Agora:
    "Der Markt- und Versammlungsplatz mitten in einer griechischen Stadt: Einkaufen, Politik und Gerichtsverhandlungen an einem Ort.",
  Laurion:
    "Silberbergwerke südlich von Athen; aus diesem Silber wurden Athens Münzen geprägt. Gearbeitet haben dort vor allem Sklaven.",
  Themistokles:
    "Athener Politiker (um 524–459 v. Chr.); setzte durch, dass Athen vom Silberfund eine Kriegsflotte baute statt das Geld zu verteilen.",
  /* Beugungsformen brauchen einen eigenen Eintrag: Gesucht wird auf
     Wortgrenze, «Solon» trifft in «Solons» darum nicht. */
  Solon:
    "Athener Staatsmann (um 640 bis um 560 v. Chr.); liess seine Gesetze öffentlich aufstellen, damit sie jeder nachlesen konnte.",
  Solons:
    "Athener Staatsmann (um 640 bis um 560 v. Chr.); liess seine Gesetze öffentlich aufstellen, damit sie jeder nachlesen konnte.",
  Piräus: "Der Hafen von Athen, wenige Kilometer von der Stadt entfernt.",
  mykenischen:
    "Die erste griechische Hochkultur (etwa 1600 bis 1200 v. Chr.), benannt nach der Burg Mykene; regiert von Palästen, die alles in Listen erfassten.",
  Lydien:
    "Reich im Westen der heutigen Türkei; dort wurden die ersten Münzen der Welt geprägt.",
  Aigina:
    "Insel im Golf von Athen; prägte eine der ersten griechischen Silbermünzen, mit einer Seeschildkröte darauf.",
  Phönizier:
    "Handelsvolk an der Küste des heutigen Libanon; von seiner Schrift stammen unsere Buchstaben ab.",
  Phöniziern:
    "Handelsvolk an der Küste des heutigen Libanon; von seiner Schrift stammen unsere Buchstaben ab.",
  Protagoras:
    "Der bekannteste Sophist (um 490–420 v. Chr.); von ihm stammt der Satz, der Mensch sei «das Mass aller Dinge».",
  Logik:
    "Die Regeln des sauberen Schliessens: Was folgt zwingend aus was, unabhängig davon, wer es sagt.",
  Republik:
    "Staat ohne König: Die Macht liegt bei gewählten Ämtern und Versammlungen, nicht bei einer Herrscherfamilie.",
  Perser:
    "Grossreich im heutigen Iran; griff Griechenland zweimal an (490 und 480 v. Chr.) und wurde beide Male zurückgeschlagen.",
  "Dreissig Tyrannen":
    "Gewaltherrschaft von dreissig Männern, die Athen 404/403 v. Chr. nach der Kriegsniederlage regierten und viele Bürger töteten.",
  Lykeion:
    "Die Schule des Aristoteles in Athen; nach ihr heisst heute das «Lyzeum» in manchen Ländern.",
  Schierlingsbecher:
    "Der Gifttrank aus der Pflanze Schierling, mit dem in Athen Todesurteile vollstreckt wurden.",
  Euklid:
    "Griechischer Mathematiker (um 300 v. Chr.); ordnete die Geometrie so, dass jeder Satz aus dem vorherigen bewiesen wird.",

  /* Zerbrechen der Ordnung (Spätantike & Mittelalter). West- und Ostgoten
     bewusst getrennt erklärt: Es sind zwei verschiedene Völker in zwei
     verschiedenen Jahrhunderten, im Text leicht zu verwechseln. */
  Westgoten:
    "Germanisches Volk; plünderte 410 die Stadt Rom. Nicht zu verwechseln mit den Ostgoten gut hundert Jahre später.",
  Ostgoten:
    "Germanisches Volk; herrschte ab 493 über Italien und belagerte 537/538 Rom, wobei die Wasserleitungen zerstört wurden.",
  Aquädukte:
    "Römische Wasserleitungen, oft auf Bogenbrücken über Täler geführt; versorgten Städte mit Frischwasser.",
  Tiber: "Der Fluss, an dem Rom liegt.",
  Tibers: "Der Fluss, an dem Rom liegt.",
  Pantheon:
    "Tempelbau in Rom mit gewaltiger Betonkuppel; seine Bauweise konnte über tausend Jahre niemand nachmachen.",
  Pantheons:
    "Tempelbau in Rom mit gewaltiger Betonkuppel; seine Bauweise konnte über tausend Jahre niemand nachmachen.",
  Cassiodorus:
    "Römischer Gelehrter und Beamter; gründete um 550 das Kloster Vivarium, in dem Mönche antike Handschriften abschrieben.",
  Cicero:
    "Römischer Redner und Politiker; seine Reden und Briefe gelten als Vorbild lateinischer Sprache.",
  Vergil: "Römischer Dichter; schrieb die «Aeneis», das grosse Epos über Roms Ursprung.",
  Hieronymus:
    "Gelehrter (um 347 bis 420); übersetzte die Bibel ins Lateinische. Diese Fassung prägte das Abendland.",
  Hippo:
    "Hafenstadt in Nordafrika, im heutigen Algerien; dort war Augustinus Bischof.",
  Vandalen:
    "Germanisches Volk; eroberte Nordafrika und belagerte 430 die Stadt Hippo.",
  Manichäer:
    "Anhänger einer damals verbreiteten Religion, die die Welt als Kampf zwischen Licht und Finsternis deutete.",
  Confessiones:
    "«Bekenntnisse», die Lebensrückschau des Augustinus und zugleich eines der ersten Bücher, das den Blick nach innen richtet.",
  Rhetorikprofessor:
    "Lehrer der Redekunst; im Römischen Reich ein angesehener und gut bezahlter Beruf.",
  Gottesstaat:
    "Augustinus' Schrift «De civitate Dei»: Sie stellt dem vergänglichen irdischen Staat eine bleibende geistige Gemeinschaft gegenüber.",
  Gottesstaats:
    "Augustinus' Schrift «De civitate Dei»: Sie stellt dem vergänglichen irdischen Staat eine bleibende geistige Gemeinschaft gegenüber.",

  /* Umbruch der Neuzeit (Buchdruck, Reformation, Entdeckungen). */
  Klerus: "Die Geistlichen einer Kirche, also Priester, Mönche und Bischöfe.",
  "Handschriften-Kopisten":
    "Schreiber, die Bücher von Hand abschrieben. Vor dem Buchdruck entstand so jedes Exemplar einzeln.",
  Montaigne:
    "Michel de Montaigne (1533 bis 1592), französischer Denker; erfand den «Essai» und machte das Zweifeln zur Methode.",
  Skeptiker:
    "Denkerinnen und Denker, die jede Behauptung erst prüfen und mit einem Urteil bewusst zurückhalten.",
};

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Ein einzelner Begriff mit Tooltip (Hover, Fokus/Tap). Der Tooltip liegt in
 *  einem Portal, sonst schneiden ihn die Karten mit `overflow-hidden` ab. */
export function Begriff({ wort, erklaerung }: { wort: string; erklaerung: string }) {
  return <HoverTipp wort={wort} inhalt={erklaerung} breite={224} />;
}

const TERME = Object.keys(GLOSSAR).sort((a, b) => b.length - a.length);

/**
 * Wortgrenze, aber unicode-fähig — **nicht** `\b`.
 *
 * In JavaScript kennt `\b` nur `[A-Za-z0-9_]`. Ein Begriff, der mit einem
 * Nicht-ASCII-Buchstaben beginnt oder endet, hat dort deshalb keine Wortgrenze
 * und wird **nie** gefunden. Zwei Einträge waren dadurch stumm, ohne dass es
 * jemand sah: «Çatalhöyük» und «Öffentlichkeit» (gefunden 2026-08-11, als der
 * Hover zu Çatalhöyük nicht erschien).
 *
 * Die zweite, umgekehrte Wirkung: Zwischen einem ASCII-Buchstaben und einem
 * Umlaut sieht `\b` eine Grenze, wo keine ist. «Container» würde also mitten in
 * «Containerübergabe» markiert. Im Bestand kommt das derzeit nicht vor, mit der
 * Unicode-Grenze kann es auch nicht mehr vorkommen.
 */
const GLOSSAR_RE = new RegExp(
  `(?<![\\p{L}\\p{N}_])(${TERME.map(escapeRegExp).join("|")})(?![\\p{L}\\p{N}_])`,
  "gu",
);

/** Ein Quellenlink an einer Textstelle. Öffnet die geprüfte Quelle. */
/**
 * «2026-08-04» → «4.8.2026». Im Datenfile bleibt das Datum ISO (kurz,
 * sortierbar, maschinenlesbar), gelesen wird die hiesige Schreibweise.
 *
 * Bewusst ohne Monatsnamen: Eine Liste von zwölf Namen wäre zwölf zusätzliche
 * Textfelder im Korrektorat, die niemand korrigieren soll. Und bewusst ohne
 * `Date`, damit Server und Browser dasselbe ausgeben.
 */
function datum(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  return `${Number(m[3])}.${Number(m[2])}.${m[1]}`;
}

/**
 * Exportiert, weil auch `InfoText` in den Denkwegen Belege setzen soll. Dort
 * läuft die Auszeichnung über die karteneigenen Begriffe statt über das
 * Glossar; die Quellen-Darstellung soll aber überall dieselbe sein.
 */
export function BelegStelle({ wort, beleg }: { wort: string; beleg: Beleg }) {
  /* Buchbelege haben keine URL. Dann wird das Wort ein Knopf statt eines Links,
     und der Hinweis nennt das Werk statt eines Prüfdatums: Ein Buch ruft man
     nicht ab, man schlägt darin nach. */
  const istBuch = !beleg.url;
  return (
    <HoverTipp
      wort={wort}
      href={beleg.url}
      breite={300}
      vorlesen={`${istBuch ? "Nachgelesen in " : ""}${beleg.titel}${beleg.stelle ? ". " + beleg.stelle : ""}`}
      inhalt={
        <>
          <span className="block font-medium text-on-surface">
            {istBuch ? "Nachgelesen in" : "Quelle"}: {beleg.titel}
          </span>
          {beleg.stelle && (
            <span className="mt-[2px] block text-on-surface-variant">{beleg.stelle}</span>
          )}
          <span className="mt-xs block text-on-surface-variant opacity-70">
            {istBuch
              ? `Im Buch nachgeschlagen am ${datum(beleg.geprueft)}.`
              : `Abgerufen und geprüft am ${datum(beleg.geprueft)}. Klicken öffnet die Quelle.`}
          </span>
        </>
      }
    />
  );
}

/** Eine gefundene Stelle im Text, die ausgezeichnet werden soll. */
type Marke = {
  von: number;
  bis: number;
  wort: string;
  /** Beleg gesetzt = Quellenlink, sonst Glossar-Erklärung. */
  beleg?: Beleg;
  erklaerung?: string;
};

/**
 * `**fett**` aus dem Text lösen: gibt den Text OHNE die Sternchen zurück und
 * die Bereiche, die fett werden, in den Koordinaten dieses sauberen Textes.
 *
 * Warum überhaupt eine Auszeichnung im String und nicht `<strong>` im JSX: Die
 * Korrekturperson bearbeitet im Korrektorat genau EIN Feld je Textstelle. Würde
 * man den Satz für ein fettes Wort in mehrere `GlossarText` und `<strong>`
 * zerschneiden, zerfiele er dort in lauter Bruchstücke, und der Zusammenhang
 * wäre beim Korrigieren nicht mehr zu sehen.
 */
function loeseFett(text: string): { sauber: string; fett: { von: number; bis: number }[] } {
  const fett: { von: number; bis: number }[] = [];
  let sauber = "";
  let i = 0;
  while (i < text.length) {
    const auf = text.indexOf("**", i);
    if (auf < 0) {
      sauber += text.slice(i);
      break;
    }
    const zu = text.indexOf("**", auf + 2);
    if (zu < 0) {
      // Einzelnes «**» ohne Gegenstück: unverändert stehen lassen.
      sauber += text.slice(i);
      break;
    }
    sauber += text.slice(i, auf);
    const von = sauber.length;
    sauber += text.slice(auf + 2, zu);
    fett.push({ von, bis: sauber.length });
    i = zu + 2;
  }
  return { sauber, fett };
}

/**
 * Text auszeichnen: Das ERSTE Vorkommen jedes Glossar-Begriffs bekommt eine
 * Hover-Erklärung, jeder Beleg-Anker einen Quellenlink. Beide werden in einem
 * Durchgang gesucht, dann nach Position sortiert; überlappende Treffer werden
 * verworfen, damit nichts doppelt ausgezeichnet wird. Belege haben Vorrang,
 * weil sie die genauere Auszeichnung sind.
 *
 * Zusätzlich wird `**so markiertes**` fett gesetzt. Das läuft als eigene,
 * ÄUSSERE Schicht über dem Ergebnis, nicht als weiterer Konkurrent in der
 * Marken-Liste: Sonst würde ein fett gesetzter Glossar-Begriff seine
 * Hover-Erklärung verlieren, und zwar unbemerkt.
 */
export function GlossarText({ text: rohText }: { text: string }) {
  const { sauber: text, fett } = loeseFett(rohText);
  const marken: Marke[] = [];

  // 1) Belege: wörtliche Anker, längste zuerst (siehe BELEG_NACH_ANKER).
  for (const [anker, beleg] of BELEG_NACH_ANKER) {
    const i = text.indexOf(anker);
    if (i >= 0) marken.push({ von: i, bis: i + anker.length, wort: anker, beleg });
  }

  /* 2) Glossar-Begriffe. ALLE Vorkommen werden gesammelt, ausgezeichnet wird
     später das erste, das frei ist.

     Vorher wurde nur das erste Vorkommen aufgenommen. Lag es innerhalb eines
     Beleg-Ankers, verwarf die Ausgabe-Schleife es als Überlappung, und der
     Begriff blieb im ganzen Text ohne Erklärung. Aufgefallen an «Perzeptron»:
     Das erste Vorkommen steckt im Anker «Frank Rosenblatts Perzeptron von
     1957», und die zweite Nennung, an der die Erklärung gebraucht wird, ging
     leer aus. Ein stiller Verlust, den niemand sieht. */
  let m: RegExpExecArray | null;
  GLOSSAR_RE.lastIndex = 0;
  while ((m = GLOSSAR_RE.exec(text)) !== null) {
    const wort = m[1];
    if (!GLOSSAR[wort]) continue;
    marken.push({ von: m.index, bis: m.index + wort.length, wort, erklaerung: GLOSSAR[wort] });
  }

  // Nach Position, bei gleichem Start zuerst der Beleg, dann der längere Treffer.
  marken.sort(
    (a, b) =>
      a.von - b.von ||
      Number(Boolean(b.beleg)) - Number(Boolean(a.beleg)) ||
      b.bis - b.von - (a.bis - a.von),
  );

  /* Stücke mit ihrer Position im Text sammeln, damit die Fett-Schicht danach
     weiss, was in einem `**…**`-Bereich liegt. */
  const stuecke: { von: number; bis: number; knoten: React.ReactNode }[] = [];
  let last = 0;
  /* Jeder Glossar-Begriff wird höchstens EINMAL erklärt. Weil oben alle
     Vorkommen gesammelt sind, rutscht die Erklärung automatisch auf die nächste
     Nennung, wenn die erste in einem Beleg-Anker steckt. */
  const erklaert = new Set<string>();
  for (const k of marken) {
    if (k.von < last) continue; // überlappt einen schon gesetzten Treffer
    if (!k.beleg) {
      if (erklaert.has(k.wort)) continue;
      erklaert.add(k.wort);
    }
    if (k.von > last) {
      stuecke.push({ von: last, bis: k.von, knoten: text.slice(last, k.von) });
    }
    stuecke.push({
      von: k.von,
      bis: k.bis,
      knoten: k.beleg ? (
        <BelegStelle key={k.von} wort={k.wort} beleg={k.beleg} />
      ) : (
        <Begriff key={k.von} wort={k.wort} erklaerung={k.erklaerung!} />
      ),
    });
    last = k.bis;
  }
  if (last < text.length) {
    stuecke.push({ von: last, bis: text.length, knoten: text.slice(last) });
  }

  /* Fett-Schicht. Reiner Text wird an den Bereichsgrenzen weiter zerlegt, damit
     genau die markierten Wörter fett werden. Eine Glossar- oder Beleg-Stelle
     wird als Ganzes fett, wenn ihr Anfang im Bereich liegt: Sie ist ein eigenes
     Element und lässt sich nicht mitten im Wort aufteilen. */
  const imFett = (p: number) => fett.some((f) => p >= f.von && p < f.bis);
  const teile: React.ReactNode[] = [];
  for (const s of stuecke) {
    if (typeof s.knoten !== "string") {
      teile.push(imFett(s.von) ? <strong>{s.knoten}</strong> : s.knoten);
      continue;
    }
    if (fett.length === 0) {
      teile.push(s.knoten);
      continue;
    }
    // Grenzen innerhalb dieses Text-Stücks, aufsteigend und ohne Dubletten.
    const grenzen = [
      s.von,
      ...fett.flatMap((f) => [f.von, f.bis]).filter((g) => g > s.von && g < s.bis),
      s.bis,
    ].sort((a, b) => a - b);
    for (let i = 0; i < grenzen.length - 1; i++) {
      const a = grenzen[i];
      const b = grenzen[i + 1];
      if (a === b) continue;
      const stueck = text.slice(a, b);
      teile.push(imFett(a) ? <strong>{stueck}</strong> : stueck);
    }
  }

  return (
    <>
      {teile.map((t, i) => (
        <Fragment key={i}>{t}</Fragment>
      ))}
    </>
  );
}
