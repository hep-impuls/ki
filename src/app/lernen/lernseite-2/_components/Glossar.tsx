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
