"use client";

import Ausklapptext from "./Ausklapptext";

/**
 * Quellen — eine kurze, bewusst kleine Liste von Links, die einen Begriff oder
 * ein Thema dieses Lernsets möglichst EINFACH erklären. Steht im Orakel
 * unmittelbar vor dem Datenschutz-Abschnitt, als Akkordeon wie dieser.
 *
 * Auswahlregel: aufgenommen wird nur, was jemand ohne Vorwissen lesen kann,
 * auf Deutsch, ohne Bezahlschranke. Fachaufsätze, PDFs und englische
 * Primärliteratur gehören NICHT hierher, auch wenn sie eine Aussage besser
 * belegen würden. Die Liste soll klein bleiben und wächst nur, wenn ein Link
 * wirklich etwas erklärt.
 *
 * Erweitern: einen Eintrag an LINKS anhängen, URL vorher im Browser prüfen.
 * Nur Theme-Tokens, Material Symbols.
 */

interface Erklaerlink {
  titel: string;
  /** Was man dort erfährt, in einem Satz. */
  beschreibung: string;
  /** Wer die Seite betreibt. */
  quelle: string;
  url: string;
}

const LINKS: Erklaerlink[] = [
  {
    titel: "Künstliche Intelligenz",
    beschreibung:
      "Der Überblicksartikel: was mit KI gemeint ist, welche Teilgebiete es gibt und wo die Debatten verlaufen.",
    quelle: "Wikipedia",
    url: "https://de.wikipedia.org/wiki/K%C3%BCnstliche_Intelligenz",
  },
  {
    titel: "Grosse Sprachmodelle",
    beschreibung:
      "Wie ChatGPT und ähnliche Modelle Wort für Wort einen Text bauen, und was die Transformer-Architektur damit zu tun hat.",
    quelle: "Wikipedia",
    url: "https://de.wikipedia.org/wiki/Large_Language_Model",
  },
  {
    titel: "Geschichte der künstlichen Intelligenz",
    beschreibung:
      "Von der Dartmouth-Konferenz 1956 über die KI-Winter bis zu den heutigen Modellen, als durchgehende Erzählung.",
    quelle: "Wikipedia",
    url: "https://de.wikipedia.org/wiki/Geschichte_der_k%C3%BCnstlichen_Intelligenz",
  },
  {
    titel: "Können KI-Tools das Urheberrecht verletzen?",
    beschreibung:
      "Die Schweizer Rechtslage in Alltagssprache: Wem gehört ein KI-Bild, und wann wird die Nutzung heikel?",
    quelle: "Eidgenössisches Institut für Geistiges Eigentum",
    url: "https://www.ige.ch/de/blog/blog-artikel/kuenstliche-intelligenz-koennen-ki-tools-urheberrecht-verletzen",
  },
  {
    titel: "Philosophie",
    beschreibung:
      "Was das Fach überhaupt ist, welche Grundfragen es stellt und wie seine Epochen zusammenhängen.",
    quelle: "Wikipedia",
    url: "https://de.wikipedia.org/wiki/Philosophie",
  },
];

export default function Quellenverzeichnis({ className = "" }: { className?: string }) {
  return (
    <section
      aria-label="Quellen"
      className={
        "rounded-xl border border-outline-variant bg-surface-container-low p-md sm:p-lg " + className
      }
    >
      <p className="flex items-center gap-sm text-label-md uppercase tracking-wider text-tertiary">
        <span className="material-symbols-outlined text-[20px]">menu_book</span>
        Quellen
      </p>
      <p className="mt-sm text-body-sm text-on-surface-variant">
        Wenn dir ein Begriff aus diesem Lernset unklar geblieben ist: Hier sind{" "}
        <strong className="text-on-surface">{LINKS.length} Seiten</strong>, die
        das Wichtigste verständlich erklären. Bewusst wenige und bewusst
        einfache, keine Fachaufsätze. Die Liste wächst mit der Zeit.
      </p>

      <Ausklapptext className="mt-sm" titel="Quellen öffnen">
        <ul className="space-y-sm">
          {LINKS.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/ql flex items-start gap-sm rounded-lg border border-outline-variant bg-surface-bright p-sm transition-colors hover:border-tertiary"
              >
                <span className="material-symbols-outlined mt-[2px] flex-shrink-0 text-[18px] text-tertiary">
                  open_in_new
                </span>
                <span className="min-w-0">
                  <span className="block text-body-sm font-medium text-on-surface group-hover/ql:text-tertiary">
                    {l.titel}
                  </span>
                  <span className="mt-[2px] block text-label-sm text-on-surface-variant">
                    {l.beschreibung}
                  </span>
                  <span className="mt-xs block text-label-sm text-on-surface-variant opacity-70">
                    {l.quelle}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Ausklapptext>
    </section>
  );
}
