"use client";

import { useState } from "react";

/**
 * Quellen — Links, die einen Begriff oder ein Thema dieses Lernsets möglichst
 * EINFACH erklären. Steht im Orakel unmittelbar vor dem Datenschutz-Abschnitt.
 *
 * Auswahlregel: aufgenommen wird nur, was jemand ohne Vorwissen lesen kann,
 * auf Deutsch, ohne Bezahlschranke. Fachaufsätze, PDFs und englische
 * Primärliteratur gehören NICHT hierher, auch wenn sie eine Aussage besser
 * belegen würden.
 *
 * Gegliedert nach den Modulen des Lernsets, mit derselben Einteilung und
 * denselben Symbolen wie der Lehrpersonen-Report: Wer im Modul «Vorhang auf»
 * etwas nicht verstanden hat, findet die passenden Erklärungen beieinander,
 * statt in einer langen Liste zu suchen. «Übergreifend» sammelt, was zu keinem
 * der beiden Module allein gehört.
 *
 * Es ist immer nur ein Modul aufgeklappt. Bei drei Gruppen wäre eine
 * Mehrfach-Öffnung nur eine lange Rolle, und die Zahl neben dem Namen sagt
 * ohnehin vorab, was einen erwartet.
 *
 * Erweitern: einen Eintrag an LINKS anhängen, `modul` setzen, URL vorher
 * tatsächlich abrufen. Nur Theme-Tokens, Material Symbols.
 */

type Modul = "Vorhang auf" | "Eine philosophische Perspektive" | "Übergreifend";

interface Erklaerlink {
  titel: string;
  /** Was man dort erfährt, in einem Satz. */
  beschreibung: string;
  /** Wer die Seite betreibt. */
  quelle: string;
  url: string;
  modul: Modul;
}

/** Reihenfolge und Symbol je Gruppe, gleich wie im Lehrpersonen-Report. */
const MODULE: { name: Modul; icon: string }[] = [
  { name: "Vorhang auf", icon: "theater_comedy" },
  { name: "Eine philosophische Perspektive", icon: "psychology" },
  { name: "Übergreifend", icon: "hub" },
];

const LINKS: Erklaerlink[] = [
  /* ── Vorhang auf ───────────────────────────────────────────────────────── */
  {
    titel: "Grosse Sprachmodelle",
    beschreibung:
      "Wie ChatGPT und ähnliche Modelle Wort für Wort einen Text bauen, und was die Transformer-Architektur damit zu tun hat.",
    quelle: "Wikipedia",
    url: "https://de.wikipedia.org/wiki/Large_Language_Model",
    modul: "Vorhang auf",
  },
  {
    titel: "Geschichte der künstlichen Intelligenz",
    beschreibung:
      "Von der Dartmouth-Konferenz 1956 über die KI-Winter bis zu den heutigen Modellen, als durchgehende Erzählung.",
    quelle: "Wikipedia",
    url: "https://de.wikipedia.org/wiki/Geschichte_der_k%C3%BCnstlichen_Intelligenz",
    modul: "Vorhang auf",
  },
  {
    titel: "Können KI-Tools das Urheberrecht verletzen?",
    beschreibung:
      "Die Schweizer Rechtslage in Alltagssprache: Wem gehört ein KI-Bild, und wann wird die Nutzung heikel?",
    quelle: "Eidgenössisches Institut für Geistiges Eigentum",
    url: "https://www.ige.ch/de/blog/blog-artikel/kuenstliche-intelligenz-koennen-ki-tools-urheberrecht-verletzen",
    modul: "Vorhang auf",
  },

  /* ── Eine philosophische Perspektive ───────────────────────────────────── */
  {
    titel: "Philosophie",
    beschreibung:
      "Was das Fach überhaupt ist, welche Grundfragen es stellt und wie seine Epochen zusammenhängen.",
    quelle: "Wikipedia",
    url: "https://de.wikipedia.org/wiki/Philosophie",
    modul: "Eine philosophische Perspektive",
  },

  /* ── Übergreifend ──────────────────────────────────────────────────────── */
  {
    titel: "Künstliche Intelligenz",
    beschreibung:
      "Der Überblicksartikel: was mit KI gemeint ist, welche Teilgebiete es gibt und wo die Debatten verlaufen.",
    quelle: "Wikipedia",
    url: "https://de.wikipedia.org/wiki/K%C3%BCnstliche_Intelligenz",
    modul: "Übergreifend",
  },
];

export default function Quellenverzeichnis({ className = "" }: { className?: string }) {
  const [offen, setOffen] = useState<Modul | null>(null);

  const gruppen = MODULE.map((m) => ({
    ...m,
    links: LINKS.filter((l) => l.modul === m.name),
  })).filter((g) => g.links.length > 0);

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
        das Wichtigste verständlich erklären, geordnet nach den Modulen. Bewusst
        einfache, keine Fachaufsätze.
      </p>

      <ul className="mt-md space-y-xs">
        {gruppen.map((g) => {
          const auf = offen === g.name;
          return (
            <li key={g.name}>
              <button
                type="button"
                onClick={() => setOffen((v) => (v === g.name ? null : g.name))}
                aria-expanded={auf}
                className={
                  "flex w-full items-center gap-sm rounded-lg border bg-surface-bright px-sm py-sm text-left outline-none transition-colors hover:border-tertiary " +
                  (auf ? "border-tertiary" : "border-outline-variant")
                }
              >
                <span className="material-symbols-outlined flex-shrink-0 text-[20px] text-tertiary">
                  {g.icon}
                </span>
                <span className="min-w-0 flex-1 text-body-sm font-medium text-on-surface">
                  {g.name}
                </span>
                <span className="flex-shrink-0 text-label-sm text-on-surface-variant">
                  {g.links.length}
                </span>
                <span
                  className={
                    "material-symbols-outlined flex-shrink-0 text-[20px] text-on-surface-variant transition-transform duration-300 " +
                    (auf ? "rotate-180" : "")
                  }
                >
                  expand_more
                </span>
              </button>

              {auf && (
                <ul className="animate-frame-in mt-xs space-y-xs pl-md">
                  {g.links.map((l) => (
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
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
