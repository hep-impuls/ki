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
    "Eine der ältesten Schriften — keilförmige Zeichen, in feuchten Ton gedrückt.",
  Quipu:
    "Anden-Knotenschnur, die Zahlen und Daten in Knoten speichert — statt in Schrift.",
  Quipus:
    "Anden-Knotenschnüre, die Zahlen und Daten in Knoten speichern — statt in Schrift.",
  Papyrus:
    "Beschreibbares Material aus der Papyrusstaude, im alten Ägypten hergestellt.",
  Stellenwertsystem:
    "Zahlenschreibweise, bei der die Position einer Ziffer ihren Wert bestimmt (Einer, Zehner, Hunderter).",
  Algorithmus:
    "Eine endliche, klar festgelegte Folge von Schritten zum Lösen einer Aufgabe.",
  Heliozentrik:
    "Das Weltbild, in dem die Sonne im Zentrum steht — nicht die Erde.",
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
    "KI-Methode mit vielschichtigen künstlichen neuronalen Netzen — Grundlage heutiger Modelle.",
  Deepfakes:
    "Täuschend echte, mit KI erzeugte oder manipulierte Bilder, Stimmen und Videos.",
  ARPANET:
    "Militärisches Forschungsnetz der USA (1969) — der Vorläufer des Internets.",
  Enigma:
    "Die Chiffriermaschine, mit der die deutsche Wehrmacht ihren Funk verschlüsselte.",
  Container:
    "Genormte Stahlboxen, die weltweiten Warentransport billig und schnell machten.",
  Platon:
    "Athener Philosoph (Schüler des Sokrates); seine Dialoge begründen die abendländische Philosophie.",
  Aristoteles:
    "Griechischer Philosoph (Schüler Platons); prägte die formale Logik und zahlreiche empirisch orientierte Untersuchungen.",
  Philosophie:
    "Wörtlich «Liebe zur Weisheit» — das begründende Nachdenken über die Grundfragen.",
  Völkerwanderung:
    "Umbruchszeit (4.–6. Jh.), in der germanische Verbände ins Römische Reich zogen.",
  Augustinus:
    "Kirchenvater (354–430); verlegte nach dem Fall Roms den Halt nach innen — Glaube und Gewissen.",
  Mittelalter:
    "Epoche zwischen Antike und Neuzeit (~500–1500), geprägt von Christentum und Feudalordnung.",
  Bias: "Systematische Verzerrung — etwa wenn Daten bestimmte Gruppen bevorzugen oder ausblenden.",
  Flugschriften:
    "Billige Druckblätter — das schnelle Massenmedium der Reformationszeit.",
  Algorithmen:
    "Klar festgelegte Folgen von Schritten, nach denen Computer arbeiten; manche ziehen dabei auch den Zufall hinzu.",
  Voltaire:
    "Französischer Aufklärer (1694–1778), scharfzüngiger Kritiker von Kirche und Autoritäten.",
  Terror:
    "Die Schreckensherrschaft 1793/94: Die Revolution liess Tausende unter der Guillotine hinrichten.",
  Kant: "Immanuel Kant (1724–1804): «Habe Mut, dich deines eigenen Verstandes zu bedienen.»",
  Radar: "Ortung per Funkwellen — im Zweiten Weltkrieg entscheidend weiterentwickelt.",
  ENIAC:
    "Einer der ersten elektronischen Computer (USA, 1945), gebaut für Militärberechnungen.",
  Colossus:
    "Britischer Röhrenrechner (1943) zum Knacken deutscher Chiffren — lange geheim gehalten.",
  Sputnik:
    "Der erste Satellit im All (Sowjetunion, 1957) — löste im Westen den «Sputnik-Schock» aus.",
  Ostblock:
    "Die sozialistischen Staaten unter sowjetischer Führung bis 1989/91.",
  Digitalisierung:
    "Die Verlagerung von Information und Abläufen in Computer und Netze.",
  "World Wide Web":
    "Das verlinkte Seitensystem von Tim Berners-Lee: Vorschlag 1989, erste Website 1991, 1993 vom CERN zur freien Nutzung freigegeben.",
  Arbeitsteilung:
    "Aufteilung der Arbeit in spezialisierte Tätigkeiten — Grundlage von Städten und Handel.",
  Mesopotamien:
    "Das Zweistromland (im heutigen Irak) — früher Schauplatz von Schrift, Rad und Stadt.",
  Hochkulturen:
    "Frühe komplexe Gesellschaften mit Städten, Schrift und Verwaltung.",
  Keilschrifttafeln:
    "Tontafeln mit eingedrückten keilförmigen Zeichen — die ältesten Schriftdokumente.",
  Buchdruck:
    "Das Verfahren, Texte mit beweglichen Metalllettern massenhaft zu vervielfältigen; in Europa ab etwa 1450 durch Gutenberg.",
  Jikji: "Koreanische Schrift von 1377 — das älteste erhaltene Buch aus beweglichen Metalllettern.",
  Schiesspulver:
    "In China entwickelte Explosivmischung — veränderte Krieg und Machtverhältnisse weltweit.",
  Lettern: "Einzelne, bewegliche Druckbuchstaben aus Metall.",
  Kompass:
    "Instrument mit Magnetnadel zur Richtungsbestimmung — kam aus China nach Europa.",
  Automatisierung:
    "Maschinen übernehmen Abläufe, die vorher Menschen ausführten.",
  Landflucht: "Massenhafte Abwanderung vom Land in die Städte.",
  Marx: "Karl Marx (1818–1883): analysierte Kapitalismus und Industriegesellschaft — Verhältnisse sind gemacht, also veränderbar.",
  Industriemoderne:
    "Die von Fabrik, Dampfkraft und Stadt geprägte Epoche des 19. Jahrhunderts.",
  V2: "Deutsche Grossrakete des Zweiten Weltkriegs — als Waffe gebaut, technisch der erste Schritt ins All.",
  Satelliten:
    "Künstliche Himmelskörper in der Erdumlaufbahn — für Funk, Navigation, Wetter und Militär.",
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
    "Sigmund Freuds Lehre vom Unbewussten — der Mensch ist «nicht Herr im eigenen Haus».",
  Evolutionstheorie:
    "Darwins Erklärung, wie Arten durch Variation und Auslese entstehen.",
  Atomkern:
    "Das winzige Zentrum des Atoms; seine Spaltung setzt enorme Energie frei.",
  Hiroshima:
    "Japanische Stadt, am 6. August 1945 durch die erste Atombombe zerstört.",
  "neolithische Revolution":
    "Der Übergang zu Ackerbau und Sesshaftigkeit — die tiefste Umwälzung der Menschheitsgeschichte.",
  Eigentum:
    "Rechtlich anerkannte Verfügung über Dinge — entsteht historisch mit Vorräten und Feldern.",
  Karawanen: "Handelszüge aus Lasttieren durch Wüsten und Steppen.",
  "islamische Blütezeit":
    "Etwa 8.–13. Jahrhundert: Wissenschaft und Kultur der islamischen Welt in voller Blüte.",
  Trainingsdaten:
    "Die Beispielsammlungen, aus denen eine KI ihre Muster lernt.",
  Disputation:
    "Das geregelte wissenschaftliche Streitgespräch der mittelalterlichen Universität.",
  institutionalisiert:
    "Etwas bekommt feste Regeln, Ämter und Dauer — es wird zur Einrichtung.",
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
    "Verbreitung von Ton (später Bild) an ein Massenpublikum über Funkwellen — Radio und Fernsehen.",
  Existenzialismus:
    "Philosophie des 20. Jh.: Der Mensch hat kein festes Wesen, sondern macht sich durch seine Wahl.",
  "Banalität des Bösen":
    "Hannah Arendts Befund: Grosse Verbrechen werden oft von unauffälligen Mitläufern begangen, die nicht selbst denken.",
  Postmoderne:
    "Denkrichtung, die «grosse», allgemeingültige Erzählungen bezweifelt und Vielfalt betont.",
  Deindustrialisierung:
    "Rückgang der Fabrikarbeit in einer Region, weil Produktion abwandert oder wegfällt.",
  Resonanz:
    "Bei Hartmut Rosa: ein antwortendes, lebendiges Verhältnis zur Welt — Gegenbegriff zur blossen Beschleunigung.",
  "Akteur-Netzwerk-Theorie":
    "Bruno Latours Ansatz: Wirkung entsteht im Netz aus Menschen UND Dingen — nichts handelt allein.",
  "Manhattan-Projekt":
    "Das geheime US-Grossprojekt (1942–45), das die erste Atombombe baute.",
  Transformer:
    "Die KI-Architektur von 2017; sie setzt ganz auf den schon vorher bekannten Attention-Mechanismus und ist die Grundlage heutiger Sprachmodelle wie ChatGPT.",
  "Newcomen-Maschine":
    "Frühe Dampfmaschine (1712) zum Abpumpen von Grubenwasser — Vorläuferin von Watts Maschine.",
  Humanismus:
    "Bildungsbewegung der Renaissance: Der Mensch und seine Formung durch Bildung rücken ins Zentrum.",
  Gewaltenteilung:
    "Aufteilung der Staatsmacht in Gesetzgebung, Regierung und Gerichte — zum Schutz vor Machtmissbrauch.",
  Anthropozän:
    "Vorgeschlagenes Erdzeitalter, in dem der Mensch die Erde (Klima, Arten, Gestein) prägend verändert.",
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
  Kempelen:
    "Wolfgang von Kempelen (1734 bis 1804); baute den «Schachtürken», einen scheinbar denkenden Automaten mit verstecktem Spieler.",
  "Jaquet-Droz":
    "Schweizer Uhrmacherfamilie aus La Chaux-de-Fonds; ihre Automaten (um 1770) konnten schreiben und Musik spielen.",
  Golem:
    "Prager Sagengestalt: eine aus Lehm geformte Figur, die dienen soll, und ausser Kontrolle gerät.",
  Talos:
    "Bronzeriese der griechischen Sage, der Kreta bewachte; ein antiker Traum von der künstlichen Kreatur.",
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
    "«Bekenntnisse», die Lebensrückschau des Augustinus — eines der ersten Bücher, das den Blick nach innen richtet.",
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
const GLOSSAR_RE = new RegExp(`\\b(${TERME.map(escapeRegExp).join("|")})\\b`, "g");

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

function BelegStelle({ wort, beleg }: { wort: string; beleg: Beleg }) {
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
 * Text auszeichnen: Das ERSTE Vorkommen jedes Glossar-Begriffs bekommt eine
 * Hover-Erklärung, jeder Beleg-Anker einen Quellenlink. Beide werden in einem
 * Durchgang gesucht, dann nach Position sortiert; überlappende Treffer werden
 * verworfen, damit nichts doppelt ausgezeichnet wird. Belege haben Vorrang,
 * weil sie die genauere Auszeichnung sind.
 */
export function GlossarText({ text }: { text: string }) {
  const marken: Marke[] = [];

  // 1) Belege: wörtliche Anker, längste zuerst (siehe BELEG_NACH_ANKER).
  for (const [anker, beleg] of BELEG_NACH_ANKER) {
    const i = text.indexOf(anker);
    if (i >= 0) marken.push({ von: i, bis: i + anker.length, wort: anker, beleg });
  }

  // 2) Glossar-Begriffe, je erstes Vorkommen.
  const verwendet = new Set<string>();
  let m: RegExpExecArray | null;
  GLOSSAR_RE.lastIndex = 0;
  while ((m = GLOSSAR_RE.exec(text)) !== null) {
    const wort = m[1];
    if (verwendet.has(wort) || !GLOSSAR[wort]) continue;
    verwendet.add(wort);
    marken.push({ von: m.index, bis: m.index + wort.length, wort, erklaerung: GLOSSAR[wort] });
  }

  // Nach Position, bei gleichem Start zuerst der Beleg, dann der längere Treffer.
  marken.sort(
    (a, b) =>
      a.von - b.von ||
      Number(Boolean(b.beleg)) - Number(Boolean(a.beleg)) ||
      b.bis - b.von - (a.bis - a.von),
  );

  const teile: React.ReactNode[] = [];
  let last = 0;
  for (const k of marken) {
    if (k.von < last) continue; // überlappt einen schon gesetzten Treffer
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

  return (
    <>
      {teile.map((t, i) => (
        <Fragment key={i}>{t}</Fragment>
      ))}
    </>
  );
}
