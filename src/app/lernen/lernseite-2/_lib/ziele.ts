/**
 * Ziele — von einer Inhalts-ID zurück zum Inhalt.
 *
 * Die Spuren und Poll-Zähler kennen nur strukturelle IDs
 * (`philosophische-perspektive:teppich:12`). Wer daraus einen Link bauen will —
 * die Felder im Orakel, die Knotenkarte — braucht zwei Dinge: den Namen des
 * Abschnitts und dessen Adresse. Beides steht hier, EINMAL. Vorher lag die
 * Tabelle im Orakel-Dashboard; als die Knotenkarte sie auch brauchte, wäre
 * daraus eine Zweitkopie geworden, die irgendwann auseinanderläuft.
 *
 * Die Adresse führt zum ABSCHNITT, nicht zum einzelnen Punkt. Das trägt, weil
 * `AkkordeonGruppe` den Abschnitt am Hash aufklappt und hinscrollt — man landet
 * mit dem Inhalt vor sich. Punkt-genaue Ziele bräuchten in jeder der sechs
 * Inhalts-Komponenten eine eigene Aufklapp-Steuerung; Entscheid vom 2026-08-08
 * mit Christof: zurückgestellt, bis es fehlt.
 *
 * Die Anker sind gegen die Seiten geprüft: ki-story, bilder, merkmale,
 * ki-kontext, teppich, epochen, denkwege, was-philosophie.
 */

const V = "/lernen/lernseite-2/vorhang-auf";
const P = "/lernen/lernseite-2/philosophische-perspektive";

/** Spezifische Präfixe zuerst — der erste Treffer gewinnt. */
export const ABSCHNITT_PREFIXE: { prefix: string; titel: string; href: string }[] = [
  { prefix: "vorhang-auf:story", titel: "Die KI-Story", href: `${V}#ki-story` },
  { prefix: "vorhang-auf:weisheit", titel: "Merkmale der neuen Akteurin", href: `${V}#merkmale` },
  { prefix: "vorhang-auf:bild", titel: "Bilder zur KI-Story", href: `${V}#bilder` },
  { prefix: "vorhang-auf:kontext", titel: "Die KI im Kontext", href: `${V}#ki-kontext` },
  { prefix: "philosophische-perspektive:teppich", titel: "Der Teppich des Wandels", href: `${P}#teppich` },
  // spezifischer als «…:epochen» → MUSS davor stehen
  { prefix: "philosophische-perspektive:epochen-bild", titel: "Bilder der Verunsicherung", href: `${P}#epochen` },
  { prefix: "philosophische-perspektive:epochen", titel: "Philosophie in Zeiten der Verunsicherung", href: `${P}#epochen` },
  { prefix: "philosophische-perspektive:denker", titel: "Wege der Orientierung", href: `${P}#denkwege` },
  { prefix: "philosophische-perspektive:denkwege", titel: "Wege der Orientierung", href: `${P}#denkwege` },
  { prefix: "philosophische-perspektive:einstieg", titel: "Was ist Philosophie?", href: `${P}#was-philosophie` },
  { prefix: "video:", titel: "Video-Impulse", href: "/lernen/lernseite-2" },
];

/** Abschnitts-Titel einer Basis-ID (ohne `wunsch:`/`mehr:`-Präfix). */
export function abschnittFuer(basisId: string): string {
  return ABSCHNITT_PREFIXE.find((a) => basisId.startsWith(a.prefix))?.titel ?? "Weiteres";
}

/** Adresse des Abschnitts, oder undefined bei unbekanntem Präfix. */
export function hrefFuer(basisId: string): string | undefined {
  return ABSCHNITT_PREFIXE.find((a) => basisId.startsWith(a.prefix))?.href;
}

/** Ein Eintrag in einer Sprungliste. */
export type Sprung = {
  id: string;
  titel: string;
  abschnitt: string;
  href: string;
  /** Woher der Eintrag kommt, z.B. «prägt mein Leben» — wenn ein Feld mehrere
   *  Bewertungen zusammenfasst und ein Punkt mehrfach vorkommen kann. */
  zusatz?: string;
};

/** Nach Abschnitt gruppieren, Reihenfolge der Abschnitte wie in der Tabelle. */
export function gruppiere(eintraege: Sprung[]): { abschnitt: string; posten: Sprung[] }[] {
  const rang = new Map(ABSCHNITT_PREFIXE.map((a, i) => [a.titel, i]));
  const nach = new Map<string, Sprung[]>();
  for (const e of eintraege) {
    const liste = nach.get(e.abschnitt) ?? [];
    liste.push(e);
    nach.set(e.abschnitt, liste);
  }
  return [...nach.entries()]
    .map(([abschnitt, posten]) => ({ abschnitt, posten }))
    .sort((a, b) => (rang.get(a.abschnitt) ?? 99) - (rang.get(b.abschnitt) ?? 99));
}
