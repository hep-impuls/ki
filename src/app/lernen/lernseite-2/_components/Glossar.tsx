"use client";

import { Fragment } from "react";

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
    "Bezahlte Wanderlehrer im antiken Griechenland; für sie war Wahrheit verhandelbar.",
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
    "Eine eindeutige Schritt-für-Schritt-Anleitung zum Lösen einer Aufgabe.",
  Heliozentrik:
    "Das Weltbild, in dem die Sonne im Zentrum steht — nicht die Erde.",
  Karavelle:
    "Wendiges Segelschiff, das die europäischen Ozeanfahrten ab dem 15. Jahrhundert ermöglichte.",
  Reformation:
    "Kirchenspaltung ab 1517: Aus der Kritik Luthers u.a. entstand der Protestantismus.",
  Aufklärung:
    "Geistige Bewegung des 18. Jahrhunderts: Vernunft, Selbstdenken, Kritik an Autoritäten.",
  Kolonialisierung:
    "Eroberung, Beherrschung und Ausbeutung fremder Länder durch europäische Mächte.",
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
    "Griechischer Philosoph (Schüler Platons); Begründer von Logik und beobachtender Wissenschaft.",
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
    "Eindeutige Schritt-für-Schritt-Anleitungen, nach denen Computer arbeiten.",
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
    "Das 1991 freigegebene, verlinkte Seitensystem, das das Internet alltagstauglich machte.",
  Arbeitsteilung:
    "Aufteilung der Arbeit in spezialisierte Tätigkeiten — Grundlage von Städten und Handel.",
  Mesopotamien:
    "Das Zweistromland (im heutigen Irak) — früher Schauplatz von Schrift, Rad und Stadt.",
  Hochkulturen:
    "Frühe komplexe Gesellschaften mit Städten, Schrift und Verwaltung.",
  Keilschrifttafeln:
    "Tontafeln mit eingedrückten keilförmigen Zeichen — die ältesten Schriftdokumente.",
  Buchdruck:
    "Gutenbergs Verfahren (um 1450), Texte mit beweglichen Lettern massenhaft zu vervielfältigen.",
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
    "Die KI-Architektur von 2017 («Attention»), Grundlage heutiger Sprachmodelle wie ChatGPT.",
  "Newcomen-Maschine":
    "Frühe Dampfmaschine (1712) zum Abpumpen von Grubenwasser — Vorläuferin von Watts Maschine.",
};

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Ein einzelner Begriff mit Tooltip (Hover, Fokus/Tap). */
export function Begriff({ wort, erklaerung }: { wort: string; erklaerung: string }) {
  return (
    <span className="group/gl relative inline-block">
      <button
        type="button"
        aria-label={`${wort}: ${erklaerung}`}
        className="cursor-help border-b border-dotted border-tertiary font-medium text-inherit outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-tertiary"
      >
        {wort}
      </button>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-1/2 z-30 mb-1 w-56 -translate-x-1/2 rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs text-left text-label-sm font-normal leading-snug text-on-surface opacity-0 shadow-lg transition-opacity duration-150 group-hover/gl:visible group-hover/gl:opacity-100 group-focus-within/gl:visible group-focus-within/gl:opacity-100"
      >
        {erklaerung}
      </span>
    </span>
  );
}

const TERME = Object.keys(GLOSSAR).sort((a, b) => b.length - a.length);
const GLOSSAR_RE = new RegExp(`\\b(${TERME.map(escapeRegExp).join("|")})\\b`, "g");

/**
 * Text mit Glossar-Begriffen anreichern: Das ERSTE Vorkommen jedes bekannten
 * Begriffs wird als `<Begriff>` mit Tooltip gerendert; alles andere bleibt
 * einfacher Text.
 */
export function GlossarText({ text }: { text: string }) {
  const teile: React.ReactNode[] = [];
  const verwendet = new Set<string>();
  let last = 0;
  let m: RegExpExecArray | null;
  GLOSSAR_RE.lastIndex = 0;
  while ((m = GLOSSAR_RE.exec(text)) !== null) {
    const wort = m[1];
    if (verwendet.has(wort) || !GLOSSAR[wort]) continue;
    verwendet.add(wort);
    if (m.index > last) teile.push(text.slice(last, m.index));
    teile.push(<Begriff key={m.index} wort={wort} erklaerung={GLOSSAR[wort]} />);
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
