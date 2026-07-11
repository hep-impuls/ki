"use client";

import { useState } from "react";
import { merkeSpur } from "../../_lib/spuren";

/**
 * ZitatReveal — der Opener von «Vorhang auf»: ein Ratespiel «Woher stammt
 * das?». Zehn Aussagen über Maschinen, Denken und Automatisierung, alle auf
 * verräterfreie Fragmente gekürzt (kein Techname, kein Jahr, kein Eigenname).
 * Die Lernenden raten die Herkunft:
 *   - «Heute über KI» (2023),
 *   - «Früher, andere Technik» (Leibniz' Rechenmaschine bis Tesla),
 *   - «Aus der Literatur» (erdachte Maschinen und Wesen).
 * Der Clou: Begeisterung wie Furcht klingen quer durch 300 Jahre gleich.
 *
 * Alle Wortlaute wurden am 2026-07-11 an öffentlich zugänglichen Quellen
 * verifiziert (futureoflife.org, Wikiquote, MacTutor, marxists.org,
 * gutenberg.org, technologyreview.com). Nicht-deutsche Originale sind als
 * «übersetzt» gekennzeichnet. Beantwortete Aussagen zählen als lokale Spur
 * fürs Orakel (vorhang-auf:zitat:i).
 */

type Kategorie = "ki" | "technik" | "literatur";

interface Aussage {
  text: string;
  kategorie: Kategorie;
  jahr: string;
  wer: string;
  was: string;
  note: string;
  quelleLabel: string;
  quelleUrl: string;
}

const KATEGORIEN: { id: Kategorie; label: string; kurz: string; icon: string }[] = [
  { id: "ki", label: "Heute über KI", kurz: "Heute über KI", icon: "smart_toy" },
  { id: "technik", label: "Früher, über eine andere Technik", kurz: "Frühere Technik", icon: "precision_manufacturing" },
  { id: "literatur", label: "Aus der Literatur", kurz: "Literatur", icon: "auto_stories" },
];

const AUSSAGEN: Aussage[] = [
  {
    text: "Es ist schwer zu sehen, wie man die bösen Akteure daran hindert, sie für schlechte Zwecke einzusetzen.",
    kategorie: "ki",
    jahr: "2023",
    wer: "Geoffrey Hinton, «Pate der KI»",
    was: "im Interview kurz nach seinem Rückzug von Google.",
    note: "Er spricht über KI — doch das «sie» könnte jede mächtige Technik meinen.",
    quelleLabel: "MIT Technology Review (übersetzt)",
    quelleUrl:
      "https://www.technologyreview.com/2023/05/01/1072478/deep-learning-pioneer-geoffrey-hinton-quits-google/",
  },
  {
    text: "Sollen wir riskieren, die Kontrolle über unsere Zivilisation zu verlieren?",
    kategorie: "ki",
    jahr: "2023",
    wer: "Offener Brief «Pause Giant AI Experiments»",
    was: "unterzeichnet u. a. von Bengio, Russell, Musk und Harari (über 30 000 Unterschriften).",
    note: "Gemeint sind grosse KI-Modelle wie GPT-4.",
    quelleLabel: "Future of Life Institute (übersetzt)",
    quelleUrl: "https://futureoflife.org/open-letter/pause-giant-ai-experiments/",
  },
  {
    text: "Sollen wir wirklich alle Arbeitsplätze wegautomatisieren, auch die erfüllenden?",
    kategorie: "ki",
    jahr: "2023",
    wer: "Offener Brief «Pause Giant AI Experiments»",
    was: "aus derselben Reihe rhetorischer Fragen des Briefs.",
    note: "Fast wortgleich mit einer Sorge von 1930 — siehe Keynes in dieser Runde.",
    quelleLabel: "Future of Life Institute (übersetzt)",
    quelleUrl: "https://futureoflife.org/open-letter/pause-giant-ai-experiments/",
  },
  {
    text: "Erhebt sich ein Streit, müssen zwei Denker nicht länger zanken als zwei Rechenmeister: Sie greifen zur Feder und sagen — lasst uns rechnen.",
    kategorie: "technik",
    jahr: "um 1685",
    wer: "Gottfried Wilhelm Leibniz",
    was: "sein Traum von einer Sprache, die jedes Denken auf Rechnen zurückführt — die Idee des Algorithmus.",
    note: "Der Grundgedanke jeder KI: Denken als Rechnen — über 300 Jahre alt.",
    quelleLabel: "Wikiquote (übersetzt)",
    quelleUrl: "https://en.wikiquote.org/wiki/Gottfried_Leibniz",
  },
  {
    text: "Es ist eines vortrefflichen Menschen unwürdig, wie ein Sklave Stunden mit Berechnungen zu verlieren, die man getrost einer Maschine überlassen könnte.",
    kategorie: "technik",
    jahr: "1685",
    wer: "Gottfried Wilhelm Leibniz über seine Rechenmaschine",
    was: "die er selbst gebaut hatte, um Astronomen die stumpfe Rechenarbeit abzunehmen.",
    note: "Die Hoffnung, dass Maschinen uns die Plackerei abnehmen — 340 Jahre alt.",
    quelleLabel: "MacTutor History of Mathematics (übersetzt)",
    quelleUrl: "https://mathshistory.st-andrews.ac.uk/Biographies/Leibniz/quotations/",
  },
  {
    text: "Wir werden von einer neuen Krankheit heimgesucht: Die Arbeit schwindet schneller, als wir neue Beschäftigung dafür finden.",
    kategorie: "technik",
    jahr: "1930",
    wer: "John Maynard Keynes",
    was: "er nennt es «technologische Arbeitslosigkeit».",
    note: "Dieselbe Angst wie heute vor der KI — fast 100 Jahre früher.",
    quelleLabel: "«Economic Possibilities for our Grandchildren» (übersetzt)",
    quelleUrl:
      "https://www.marxists.org/reference/subject/economics/keynes/1930/our-grandchildren.htm",
  },
  {
    text: "Die ganze Erde wird sich in ein einziges riesiges Gehirn verwandeln; über jede Entfernung hinweg werden wir einander sehen und hören.",
    kategorie: "technik",
    jahr: "1926",
    wer: "Nikola Tesla",
    was: "über die drahtlose Zukunft — später gelesen als Vorhersage von Internet und Smartphone.",
    note: "Klingt wie eine globale KI — ist aber fast 100 Jahre alt.",
    quelleLabel: "Wikiquote (Collier's, 1926; übersetzt)",
    quelleUrl: "https://en.wikiquote.org/wiki/Nikola_Tesla",
  },
  {
    text: "Der unwissendste Mensch könnte damit Bücher über Philosophie, Dichtung, Recht und Mathematik verfassen — ganz ohne Genie oder Studium.",
    kategorie: "literatur",
    jahr: "1726",
    wer: "Jonathan Swift, «Gullivers Reisen»",
    was: "über die Schreibmaschine der Akademie von Lagado — als Satire gemeint.",
    note: "Eine Maschine, die auf Knopfdruck Texte erzeugt — 300 Jahre vor ChatGPT.",
    quelleLabel: "Project Gutenberg (übersetzt)",
    quelleUrl: "https://www.gutenberg.org/ebooks/829",
  },
  {
    text: "Es gibt keine Sicherheit dagegen, dass die Maschinen am Ende ein Bewusstsein entwickeln.",
    kategorie: "literatur",
    jahr: "1872",
    wer: "Samuel Butler, «Erewhon»",
    was: "aus dem eingeschobenen «Buch der Maschinen».",
    note: "Die Frage nach dem Maschinenbewusstsein — im Roman, lange vor dem Computer.",
    quelleLabel: "Project Gutenberg (übersetzt)",
    quelleUrl: "https://www.gutenberg.org/ebooks/1906",
  },
  {
    text: "Ich wollte die ganze Menschheit in eine Aristokratie verwandeln — getragen von Millionen mechanischer Sklaven.",
    kategorie: "literatur",
    jahr: "1920",
    wer: "Karel Čapek, «R.U.R.»",
    was: "das Theaterstück, das dem Wort «Roboter» seinen Namen gab.",
    note: "Das Utopie-Versprechen mancher KI-Visionäre — schon 1920 auf der Bühne.",
    quelleLabel: "Project Gutenberg (übersetzt)",
    quelleUrl: "https://www.gutenberg.org/ebooks/59112",
  },
];

function katLabel(id: Kategorie): string {
  return KATEGORIEN.find((k) => k.id === id)!.label;
}

export default function ZitatReveal({ className = "" }: { className?: string }) {
  // Antwort je Aussage-Index: die getippte Kategorie (oder nichts).
  const [antworten, setAntworten] = useState<Record<number, Kategorie>>({});

  function raten(i: number, wahl: Kategorie) {
    if (antworten[i]) return; // eine Antwort pro Aussage
    setAntworten((prev) => ({ ...prev, [i]: wahl }));
    merkeSpur(`vorhang-auf:zitat:${i}`);
  }

  const beantwortet = Object.keys(antworten).length;
  const richtig = Object.entries(antworten).filter(
    ([i, wahl]) => AUSSAGEN[Number(i)].kategorie === wahl,
  ).length;
  const fertig = beantwortet === AUSSAGEN.length;

  return (
    <div className={className}>
      <p className="mb-md flex items-center gap-xs text-label-sm uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[16px] text-tertiary">
          {fertig ? "done_all" : "quiz"}
        </span>
        {beantwortet === 0
          ? "Rate bei jeder Aussage: Woher stammt sie?"
          : `${richtig} von ${beantwortet} richtig${fertig ? " — alle erraten" : ""}`}
      </p>

      <ol className="flex flex-col gap-md">
        {AUSSAGEN.map((a, i) => {
          const wahl = antworten[i];
          const beantwortetI = Boolean(wahl);
          const korrekt = wahl === a.kategorie;
          return (
            <li
              key={i}
              className="overflow-hidden rounded-xl border border-outline-variant bg-surface-bright shadow-sm"
            >
              <div className="p-lg">
                <p className="text-body-lg italic text-on-surface">«{a.text}»</p>
              </div>

              {/* Rate-Knöpfe oder Auflösung */}
              {!beantwortetI ? (
                <div className="border-t border-outline-variant bg-surface-container-low p-md">
                  <p className="mb-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Woher stammt das?
                  </p>
                  <div className="flex flex-col gap-sm sm:flex-row">
                    {KATEGORIEN.map((k) => (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => raten(i, k.id)}
                        className="inline-flex flex-1 items-center justify-center gap-xs rounded-xl border border-outline-variant bg-surface-bright px-md py-sm text-label-md text-on-surface transition hover:-translate-y-0.5 hover:border-tertiary hover:text-tertiary hover:shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {k.icon}
                        </span>
                        {k.kurz}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="animate-frame-in border-t border-outline-variant bg-surface-container-low p-lg">
                  {/* Treffer-Zeile */}
                  <p
                    className={
                      "flex items-center gap-sm text-body-md font-semibold " +
                      (korrekt ? "text-tertiary" : "text-error")
                    }
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {korrekt ? "check_circle" : "cancel"}
                    </span>
                    {korrekt
                      ? "Richtig geraten!"
                      : `Knapp daneben — du tipptest «${katLabel(wahl)}».`}
                  </p>

                  {/* Auflösung */}
                  <div className="mt-sm flex flex-wrap items-baseline gap-x-md gap-y-xs">
                    <span className="text-headline-md text-tertiary">{a.jahr}</span>
                    <span className="text-body-md font-semibold text-on-surface">
                      {a.wer}
                    </span>
                    <span className="rounded-lg bg-tertiary-container px-sm py-xs text-label-sm text-on-tertiary-container">
                      {katLabel(a.kategorie)}
                    </span>
                  </div>
                  <p className="mt-sm text-body-sm text-on-surface-variant">{a.was}</p>
                  <p className="mt-xs text-body-sm text-on-surface">{a.note}</p>
                  <a
                    href={a.quelleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-sm inline-flex items-center gap-xs text-label-sm text-primary underline underline-offset-2 hover:text-on-primary-container"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      open_in_new
                    </span>
                    {a.quelleLabel}
                  </a>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {fertig && (
        <div className="animate-frame-in mt-md rounded-xl border border-tertiary/40 bg-tertiary-container/30 p-lg">
          <p className="text-body-md text-on-surface">
            Egal ob Begeisterung oder Furcht — die Sätze stammen aus{" "}
            <strong>drei Jahrhunderten</strong>, von Leibniz’ Rechenmaschine bis
            zu heutigen KI-Warnungen, und klingen doch fast gleich. Der Traum,
            das Denken an Maschinen zu übergeben — und die Unruhe darüber — ist
            viel älter als die KI. Die Geschichte dazu steht im Storyboard gleich
            unten.
          </p>
        </div>
      )}
    </div>
  );
}
