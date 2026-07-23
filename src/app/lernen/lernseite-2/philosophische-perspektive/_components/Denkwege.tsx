"use client";

import { useEffect, useState } from "react";
import {
  leseSpurenIndices,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../../_lib/spuren";
import { merkeInhalt } from "../../_lib/inhalte";

/**
 * Denkwege — «Wege der Orientierung»: fünf philosophische Ansätze, die mit der
 * Verunsicherung durch die KI umgehen, als durchklickbare Slides. Zwei Fragen
 * gliedern sie: «Was ist der Mensch?» (Arendt, Heidegger) und «Wie umgehen mit
 * der KI?» (Latour, Nassehi, Gabriel). Jeder Slide hat eine einfach erklärte
 * Grundidee und ein Fallbeispiel.
 *
 * Ein Slide zählt als Aktivität (Spur `…:denkwege:<i>`), sobald man aktiv
 * dorthin navigiert (nicht schon beim blossen Laden der Seite). Nur
 * Theme-Tokens und Material Symbols.
 */

interface Denkweg {
  gruppe: string;
  denker: string;
  leben: string;
  these: string;
  kern: string;
  beispiel: string;
  icon: string;
}

const DENKWEGE: Denkweg[] = [
  {
    gruppe: "Was ist der Mensch?",
    denker: "Hannah Arendt",
    leben: "1906 bis 1975",
    these: "Der Mensch kann neu anfangen",
    icon: "restart_alt",
    kern: "Hannah Arendt stellt nicht den Tod ins Zentrum, sondern die Geburt. Mit jedem Menschen kommt ein neuer Anfang in die Welt. Weil wir handeln können, können wir etwas beginnen, das vorher nicht da war und das niemand genau vorhersagen kann. Diese Fähigkeit, neu anzufangen, ist für Arendt der Kern unserer Freiheit.",
    beispiel:
      "Eine KI setzt fort, was schon da ist, denn sie rechnet mit dem Wahrscheinlichen. Der Mensch kann davon abweichen. Wenn eine Klasse den Vorschlag der KI beiseitelegt und stattdessen beschliesst, die eigenen Grosseltern zu befragen, beginnt sie etwas Neues, das aus den Daten nicht folgt.",
  },
  {
    gruppe: "Was ist der Mensch?",
    denker: "Martin Heidegger",
    leben: "1889 bis 1976",
    these: "Dem Menschen geht es um etwas",
    icon: "favorite",
    kern: "Martin Heidegger fragt, was das Leben des Menschen ausmacht. Seine Antwort nennt er die Sorge. Gemeint ist nicht die Alltagssorge, sondern dass dem Menschen sein eigenes Leben nicht gleichgültig ist. Wir kümmern uns, wir fragen nach dem Sinn und wir wissen um unsere Endlichkeit. Eine Maschine rechnet, aber ihr ist nichts wichtig.",
    beispiel:
      "Eine KI kann einen einfühlsamen Trauertext oder einen Pflegeplan fehlerfrei formulieren. Ihr selbst geht es dabei um nichts. Der Mensch, der wirklich um einen Angehörigen trauert oder einen Patienten pflegt, sorgt sich. Genau dieses Sich-Sorgen bleibt menschlich.",
  },
  {
    gruppe: "Wie umgehen mit der KI?",
    denker: "Bruno Latour",
    leben: "1947 bis 2022",
    these: "Nicht ich allein, das Netz handelt",
    icon: "hub",
    kern: "Bruno Latour sagt, dass nicht nur Menschen handeln, sondern auch Dinge. Wirkung entsteht selten durch einen allein, sondern in einem Netz aus Menschen und Dingen. Sein Beispiel ist der Mensch mit der Waffe. Weder der Mensch allein noch die Waffe allein handelt, sondern beide zusammen. Diesen Ansatz nennt man die Akteur-Netzwerk-Theorie.",
    beispiel:
      "Wer einen Text mit KI schreibt, ist weder allein die Autorin noch bloss Nutzer. Mensch, Modell, Trainingsdaten und die eigene Eingabe bilden zusammen ein Netz, in dem der Text entsteht. Statt zu fragen, wer allein schuld oder allein Urheber ist, lohnt der Blick auf dieses ganze Netz.",
  },
  {
    gruppe: "Wie umgehen mit der KI?",
    denker: "Armin Nassehi",
    leben: "geboren 1960",
    these: "Die KI passt zu einer Gesellschaft der Muster",
    icon: "pattern",
    kern: "Armin Nassehi betrachtet die Digitalisierung als Soziologe. Seine These lautet, dass unsere Gesellschaft schon lange in Mustern denkt, längst bevor es Computer gab. Volkszählungen, Statistiken und Versicherungen ordnen die Welt seit über zweihundert Jahren nach Regelmässigkeiten. Die KI ist darum kein fremder Eindringling, sondern passt zu einer Gesellschaft, die immer schon nach Mustern funktioniert hat.",
    beispiel:
      "Eine Versicherung rechnet seit jeher aus Mustern aus, wie wahrscheinlich ein Schaden ist. Eine KI macht im Grunde dasselbe, nur schneller und mit mehr Daten. Wer das erkennt, gerät weniger in Panik und kann nüchterner fragen, wo diese Musterei nützt und wo sie schadet.",
  },
  {
    gruppe: "Wie umgehen mit der KI?",
    denker: "Markus Gabriel",
    leben: "geboren 1980",
    these: "Die KI hat keinen Geist, wir behalten die Verantwortung",
    icon: "balance",
    kern: "Markus Gabriel betont, dass die KI keinen Geist und kein echtes Verständnis hat, sondern nur Muster berechnet. Trotzdem sieht er sie nicht als Bedrohung, sondern als Werkzeug, das uns menschlicher machen kann. Denn die KI wirkt wie ein Spiegel unserer Werte und zwingt uns, klarer zu sagen, was uns wichtig ist. Die Entscheidung, was gut und gerecht ist, bleibt beim Menschen.",
    beispiel:
      "Eine KI kann vorschlagen, wer eine Stelle oder ein Stipendium bekommt, indem sie Bewerbungen nach Mustern ordnet. Ob dieser Vorschlag gerecht ist, ist aber eine Wertfrage. Die kann keine Maschine beantworten, sondern nur der Mensch, der dafür die Verantwortung trägt.",
  },
];

export default function Denkwege({
  spurKey,
  className = "",
}: {
  /** Spur-Präfix, z.B. "philosophische-perspektive:denkwege". */
  spurKey: string;
  className?: string;
}) {
  const gesamt = DENKWEGE.length;
  const [idx, setIdx] = useState(0);
  const [gesehen, setGesehen] = useState<Set<number>>(new Set());

  // Bereits gesehene Slides (für die Fortschrittspunkte) wiederherstellen.
  useEffect(() => {
    function restore() {
      const seen = leseSpurenIndices(spurKey).filter((i) => i >= 0 && i < gesamt);
      if (seen.length === 0) return;
      setGesehen((prev) => {
        const nx = new Set(prev);
        seen.forEach((i) => nx.add(i));
        return nx;
      });
    }
    restore();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [spurKey, gesamt]);

  // Alle Titel registrieren (auch ungesehene) — für die Knotenkarte im Orakel.
  useEffect(() => {
    DENKWEGE.forEach((d, i) => merkeInhalt(`${spurKey}:${i}`, `${d.denker}: ${d.these}`));
  }, [spurKey]);

  // Aktiv angesteuerter Slide zählt als Aktivität (nicht schon beim Laden der
  // Seite). Auch der eben gelesene Slide, den man verlässt, wird registriert.
  function geheZu(ziel: number) {
    const i = Math.max(0, Math.min(gesamt - 1, ziel));
    const neu = [idx, i].filter((n) => !gesehen.has(n));
    if (neu.length > 0) {
      neu.forEach((n) => merkeSpur(`${spurKey}:${n}`));
      setGesehen((prev) => {
        const nx = new Set(prev);
        neu.forEach((n) => nx.add(n));
        return nx;
      });
    }
    setIdx(i);
  }

  const d = DENKWEGE[idx];

  return (
    <section aria-label="Wege der Orientierung" className={className}>
      <div className="mb-md flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px] text-tertiary">
          {gesehen.size === gesamt ? "done_all" : "menu_book"}
        </span>
        {gesehen.size === 0
          ? `${gesamt} Denkwege, klick dich durch`
          : `${gesehen.size} von ${gesamt} Denkwegen angeschaut`}
      </div>

      <div className="rounded-2xl border border-outline-variant bg-surface-bright p-md sm:p-lg">
        <div className="flex flex-wrap items-center justify-between gap-sm">
          <span className="inline-flex items-center gap-xs rounded-full bg-tertiary-container/50 px-sm py-xs text-label-sm text-on-tertiary-container">
            {d.gruppe}
          </span>
          <span className="text-label-sm text-on-surface-variant">
            Denkweg {idx + 1} von {gesamt}
          </span>
        </div>

        <div className="mt-md flex items-start gap-md">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container">
            <span className="material-symbols-outlined text-[24px]">{d.icon}</span>
          </span>
          <div className="min-w-0">
            <p className="text-label-sm text-on-surface-variant">
              {d.denker} · {d.leben}
            </p>
            <h3 className="text-headline-sm text-on-surface">{d.these}</h3>
          </div>
        </div>

        <p className="mt-md text-body-md leading-relaxed text-on-surface-variant">{d.kern}</p>

        <div className="mt-md rounded-xl border border-outline-variant bg-surface-container-low p-sm sm:p-md">
          <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-tertiary">
            <span className="material-symbols-outlined text-[16px]">lightbulb</span>
            Fallbeispiel
          </p>
          <p className="mt-xs text-body-md leading-relaxed text-on-surface-variant">
            {d.beispiel}
          </p>
        </div>

        <div className="mt-lg flex items-center justify-between gap-sm">
          <button
            type="button"
            onClick={() => geheZu(idx - 1)}
            disabled={idx === 0}
            className="inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright px-md py-xs text-label-md text-on-surface transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Zurück
          </button>
          <div className="flex items-center gap-xs">
            {DENKWEGE.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => geheZu(i)}
                aria-label={`Denkweg ${i + 1}`}
                className={
                  "h-2.5 rounded-full transition-all " +
                  (i === idx
                    ? "w-5 bg-tertiary"
                    : gesehen.has(i)
                      ? "w-2.5 bg-tertiary/50"
                      : "w-2.5 bg-outline-variant")
                }
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => geheZu(idx + 1)}
            disabled={idx === gesamt - 1}
            className="inline-flex items-center gap-xs rounded-full bg-tertiary px-md py-xs text-label-md text-on-tertiary transition hover:bg-on-tertiary-container disabled:cursor-not-allowed disabled:opacity-40"
          >
            Weiter
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
