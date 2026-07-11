"use client";

import { useState } from "react";
import { merkeSpur } from "../../_lib/spuren";

/**
 * ZitatReveal — der Opener von «Vorhang auf»: fünf Stimmen über künstliche
 * Wesen, die klingen, als stammten sie aus dem KI-Zeitalter. Erst das
 * Aufdecken zeigt: Alle sind zwischen 1816 und 1920 entstanden.
 *
 * Alle Zitate wurden am 2026-07-11 an öffentlich zugänglichen Quelltexten
 * verifiziert (de.wikisource.org, gutenberg.org, fourmilab.ch); Übersetzungen
 * aus dem Englischen sind als solche gekennzeichnet. Aufgedeckte Zitate
 * zählen als lokale Spur fürs Orakel (vorhang-auf:zitat:i).
 */

interface Zitat {
  text: string;
  /** Brücke: warum das nach heute klingt. */
  heute: string;
  werk: string;
  jahr: string;
  kontext: string;
  quelleLabel: string;
  quelleUrl: string;
}

const ZITATE: Zitat[] = [
  {
    text: "O du herrliche, himmlische Frau! … du tiefes Gemüt, in dem sich mein ganzes Sein spiegelt.",
    heute: "Klingt wie eine Liebeserklärung an einen Companion-Chatbot.",
    werk: "E. T. A. Hoffmann, «Der Sandmann»",
    jahr: "1816",
    kontext:
      "Nathanael schwärmt von Olimpia — einer Automate, die nur «Ach, ach!» seufzt. Die Verwechslung von Maschine und Gegenüber ist über 200 Jahre alt.",
    quelleLabel: "Volltext (Wikisource)",
    quelleUrl: "https://de.wikisource.org/wiki/Der_Sandmann",
  },
  {
    text: "Fast zwei Jahre hatte ich hart gearbeitet — mit dem einzigen Ziel, einem leblosen Körper Leben einzuhauchen.",
    heute: "Könnte aus dem Blog eines KI-Labors stammen.",
    werk: "Mary Shelley, «Frankenstein» (übersetzt)",
    jahr: "1818",
    kontext:
      "Victor Frankenstein über sein Projekt. Kaum lebt das Geschöpf, entzieht sich ihm die Verantwortung — bis heute DIE Erzählung über Technik und ihre Schöpfer.",
    quelleLabel: "Volltext (Project Gutenberg)",
    quelleUrl: "https://www.gutenberg.org/ebooks/84",
  },
  {
    text: "Die Analytische Maschine erhebt keinerlei Anspruch, irgendetwas eigenständig hervorzubringen. Sie kann tun, was immer wir ihr zu befehlen wissen.",
    heute: "Mitten in der heutigen Debatte: Kann KI Eigenes schaffen?",
    werk: "Ada Lovelace, Anmerkung G (übersetzt)",
    jahr: "1843",
    kontext:
      "Die erste Programmiererin der Geschichte — über Babbages Maschine. Ihr Einwand wird bis heute in jeder Diskussion über KI-Kreativität zitiert.",
    quelleLabel: "Originaltext (fourmilab.ch)",
    quelleUrl: "https://www.fourmilab.ch/babbage/sketch.html",
  },
  {
    text: "Dass Maschinen heute wenig Bewusstsein besitzen, ist keine Sicherheit dagegen, dass sie am Ende ein maschinelles Bewusstsein entwickeln.",
    heute: "Liest sich wie ein Leitartikel über künstliche Intelligenz.",
    werk: "Samuel Butler, «Erewhon» (übersetzt)",
    jahr: "1872",
    kontext:
      "Aus dem Kapitel «Das Buch der Maschinen»: ein Roman warnt vor der Evolution der Maschinen — Jahrzehnte vor dem ersten Computer.",
    quelleLabel: "Volltext (Project Gutenberg)",
    quelleUrl: "https://www.gutenberg.org/ebooks/1906",
  },
  {
    text: "Ich wollte die ganze Menschheit in eine Aristokratie der Welt verwandeln — ernährt von Millionen mechanischer Sklaven.",
    heute: "Das Versprechen mancher KI-Visionäre, fast wortgleich.",
    werk: "Karel Čapek, «R.U.R.» (übersetzt)",
    jahr: "1920",
    kontext:
      "Fabrikdirektor Domin in dem Theaterstück, das dem «Roboter» seinen Namen gab. Utopie und Katastrophe liegen darin dicht beieinander.",
    quelleLabel: "Volltext (Project Gutenberg)",
    quelleUrl: "https://www.gutenberg.org/ebooks/59112",
  },
];

export default function ZitatReveal({ className = "" }: { className?: string }) {
  const [offen, setOffen] = useState<Set<number>>(new Set());

  function aufdecken(i: number) {
    setOffen((prev) => {
      if (prev.has(i)) return prev;
      const next = new Set(prev);
      next.add(i);
      return next;
    });
    merkeSpur(`vorhang-auf:zitat:${i}`);
  }

  const alle = offen.size === ZITATE.length;

  return (
    <div className={className}>
      <p className="mb-sm flex items-center gap-xs text-label-sm uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[16px] text-tertiary">
          {alle ? "done_all" : "history_edu"}
        </span>
        {alle
          ? "Alle 5 aufgedeckt — der Traum ist älter als jeder Computer"
          : `${offen.size} von ${ZITATE.length} aufgedeckt`}
      </p>

      <ol className="flex flex-col gap-md">
        {ZITATE.map((z, i) => {
          const ist = offen.has(i);
          return (
            <li
              key={i}
              className="overflow-hidden rounded-xl border border-outline-variant bg-surface-bright shadow-sm"
            >
              <div className="p-lg">
                <p className="text-body-lg italic text-on-surface">«{z.text}»</p>
                <p className="mt-xs text-body-sm text-on-surface-variant">
                  {z.heute}
                </p>
              </div>

              {ist ? (
                <div className="animate-frame-in border-t border-outline-variant bg-surface-container-low p-lg">
                  <div className="flex flex-wrap items-baseline gap-x-md gap-y-xs">
                    <span className="text-headline-md text-tertiary">{z.jahr}</span>
                    <span className="text-body-md font-semibold text-on-surface">
                      {z.werk}
                    </span>
                  </div>
                  <p className="mt-sm text-body-sm text-on-surface-variant">
                    {z.kontext}
                  </p>
                  <a
                    href={z.quelleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-sm inline-flex items-center gap-xs text-label-sm text-primary underline underline-offset-2 hover:text-on-primary-container"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      open_in_new
                    </span>
                    {z.quelleLabel}
                  </a>
                </div>
              ) : (
                <div className="border-t border-outline-variant p-md">
                  <button
                    type="button"
                    onClick={() => aufdecken(i)}
                    className="inline-flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-bright px-lg py-sm text-label-md text-tertiary transition hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      visibility
                    </span>
                    Von wann stammt das? Aufdecken
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {alle && (
        <div className="animate-frame-in mt-md rounded-xl border border-tertiary/40 bg-tertiary-container/30 p-lg">
          <p className="text-body-md text-on-surface">
            Alle fünf Stimmen sind zwischen <strong>1816 und 1920</strong>{" "}
            entstanden. Der Traum, Dingen Leben einzuhauchen — und die Unruhe
            darüber — sind viel älter als der Computer. Die Geschichte dazu
            steht im Storyboard gleich unten.
          </p>
        </div>
      )}
    </div>
  );
}
