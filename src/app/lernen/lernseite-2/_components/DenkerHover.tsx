"use client";

import HoverTipp from "./HoverTipp";

/**
 * DenkerHover — der Name einer Denkerin oder eines Denkers als Hover mit einer
 * Kurzbiografie (Leben, Werk, Bedeutung). Reagiert auf Hover, Fokus und Tap.
 * Gleiches Muster wie das Glossar, nur etwas breiter für die Biografie.
 *
 * Die Richtung wird nicht mehr von Hand gesetzt: `HoverTipp` öffnet dorthin, wo
 * im Fenster mehr Platz ist, und hält den Tooltip in einem Portal, damit ihn
 * kein Kartenrahmen abschneidet. Das Prop `richtung` bleibt der Kompatibilität
 * wegen erhalten und wird ignoriert.
 */
export default function DenkerHover({
  name,
  bio,
}: {
  name: string;
  bio: string;
  richtung?: "oben" | "unten";
}) {
  return <HoverTipp wort={name} inhalt={bio} breite={288} />;
}
