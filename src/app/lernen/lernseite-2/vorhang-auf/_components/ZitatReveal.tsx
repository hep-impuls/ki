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
 * Jede Auflösung erzählt ausführlich (Person, Werk, Umfeld, Bezug zu heute) —
 * die Boxen sind je Kategorie leicht unterschiedlich getönt. Alle Wortlaute
 * wurden am 2026-07-11 an öffentlich zugänglichen Quellen verifiziert
 * (futureoflife.org, Wikiquote, MacTutor, marxists.org, gutenberg.org,
 * technologyreview.com). Nicht-deutsche Originale sind als «übersetzt»
 * gekennzeichnet. Beantwortete Aussagen zählen als lokale Spur + anonymer
 * Firebase-Zähler (vorhang-auf:zitat:i, via merkeSpur).
 */

type Kategorie = "ki" | "technik" | "literatur";

interface Aussage {
  text: string;
  kategorie: Kategorie;
  jahr: string;
  wer: string;
  /** Ausführliche Auflösung: Person, Werk, Umfeld, Bezug zu heute. */
  hintergrund: string;
  /** Pointe in einem Satz (hervorgehoben). */
  pointe: string;
  quelleLabel: string;
  quelleUrl: string;
}

const KATEGORIEN: {
  id: Kategorie;
  label: string;
  kurz: string;
  icon: string;
  /** Tönung der Auflösungs-Box + Chip (je Kategorie leicht anders). */
  box: string;
  chip: string;
}[] = [
  {
    id: "ki",
    label: "Heute über KI",
    kurz: "Heute über KI",
    icon: "smart_toy",
    box: "bg-primary-container/25",
    chip: "bg-primary-container text-on-primary-container",
  },
  {
    id: "technik",
    label: "Früher, über eine andere Technik",
    kurz: "Frühere Technik",
    icon: "precision_manufacturing",
    box: "bg-secondary-container/30",
    chip: "bg-secondary-container text-on-secondary-container",
  },
  {
    id: "literatur",
    label: "Aus der Literatur",
    kurz: "Literatur",
    icon: "auto_stories",
    box: "bg-tertiary-container/25",
    chip: "bg-tertiary-container text-on-tertiary-container",
  },
];

const AUSSAGEN: Aussage[] = [
  {
    text: "Es ist schwer zu sehen, wie man die bösen Akteure daran hindert, sie für schlechte Zwecke einzusetzen.",
    kategorie: "ki",
    jahr: "2023",
    wer: "Geoffrey Hinton, «Pate der KI»",
    hintergrund:
      "Geoffrey Hinton gilt als «Pate der KI»: Seine Arbeiten zu neuronalen Netzen legten die Grundlage für die heutigen Systeme — 2018 erhielt er dafür den Turing-Award, 2024 den Physik-Nobelpreis. Im Mai 2023 verliess er Google, um frei über die Risiken seiner eigenen Erfindung sprechen zu können; einen Teil seines Lebenswerks, sagte er, bereue er. Der Satz fiel im Gespräch mit der New York Times und ging um die Welt.",
    pointe:
      "Bemerkenswert ist, wie zeitlos der Satz formuliert ist: Er würde auf Buchdruck, Dynamit oder das Internet genauso passen — genau darum ist er so schwer zuzuordnen.",
    quelleLabel: "MIT Technology Review (übersetzt)",
    quelleUrl:
      "https://www.technologyreview.com/2023/05/01/1072478/deep-learning-pioneer-geoffrey-hinton-quits-google/",
  },
  {
    text: "Sollen wir riskieren, die Kontrolle über unsere Zivilisation zu verlieren?",
    kategorie: "ki",
    jahr: "2023",
    wer: "Offener Brief «Pause Giant AI Experiments»",
    hintergrund:
      "Im März 2023 — vier Monate nach dem Start von ChatGPT — forderte dieser offene Brief des Future of Life Institute eine sechsmonatige Pause für das Training der grössten KI-Modelle. Über 30 000 Menschen unterschrieben, darunter KI-Pioniere wie Yoshua Bengio und Stuart Russell, aber auch Elon Musk und Yuval Noah Harari. Die Pause kam nie. Der Brief machte aber eine Frage öffentlich, die vorher nur in Fachkreisen diskutiert wurde: Wer entscheidet eigentlich, wie schnell diese Technik entwickelt wird?",
    pointe:
      "Der Satz ist eine von vier rhetorischen Fragen im Kern des Briefs — bewusst so gross formuliert, dass niemand «ja» sagen möchte.",
    quelleLabel: "Future of Life Institute (übersetzt)",
    quelleUrl: "https://futureoflife.org/open-letter/pause-giant-ai-experiments/",
  },
  {
    text: "Sollen wir wirklich alle Arbeitsplätze wegautomatisieren, auch die erfüllenden?",
    kategorie: "ki",
    jahr: "2023",
    wer: "Offener Brief «Pause Giant AI Experiments»",
    hintergrund:
      "Auch diese Frage stammt aus dem «Pause»-Brief vom März 2023 — sie steht dort direkt neben der Frage nach dem Kontrollverlust. Interessant ist das kleine Wort «erfüllend»: Die Sorge gilt nicht mehr nur der Fliessbandarbeit, sondern gerade den Tätigkeiten, die Menschen gerne tun — Schreiben, Gestalten, Programmieren. Damit kehrt sich die alte Automatisierungserzählung um: Die Maschine nimmt nicht zuerst das Mühsame, sondern womöglich das Sinnstiftende.",
    pointe:
      "Vergleiche diese Sorge mit der Diagnose von Keynes aus dem Jahr 1930 in dieser Runde — fast ein Jahrhundert liegt dazwischen.",
    quelleLabel: "Future of Life Institute (übersetzt)",
    quelleUrl: "https://futureoflife.org/open-letter/pause-giant-ai-experiments/",
  },
  {
    text: "Erhebt sich ein Streit, müssen zwei Denker nicht länger zanken als zwei Rechenmeister: Sie greifen zur Feder und sagen — lasst uns rechnen.",
    kategorie: "technik",
    jahr: "um 1685",
    wer: "Gottfried Wilhelm Leibniz",
    hintergrund:
      "Gottfried Wilhelm Leibniz — Philosoph, Mathematiker, Erfinder — träumte von einer «characteristica universalis»: einer Zeichensprache, in der sich jeder Gedanke so exakt ausdrücken lässt, dass Streitfragen durch blosses Rechnen entschieden werden können. «Calculemus!» — lasst uns rechnen — ist die berühmteste Verdichtung dieses Traums. Es ist die Geburtsidee des Algorithmus: Denken als regelgeleitetes Verarbeiten von Zeichen.",
    pointe:
      "Jedes heutige Sprachmodell steht in der Nachfolge dieser Idee — es tut buchstäblich, was Leibniz vorschwebte: Es rechnet mit Sprache.",
    quelleLabel: "Wikiquote (übersetzt)",
    quelleUrl: "https://en.wikiquote.org/wiki/Gottfried_Leibniz",
  },
  {
    text: "Es ist eines vortrefflichen Menschen unwürdig, wie ein Sklave Stunden mit Berechnungen zu verlieren, die man getrost einer Maschine überlassen könnte.",
    kategorie: "technik",
    jahr: "1685",
    wer: "Gottfried Wilhelm Leibniz über seine Rechenmaschine",
    hintergrund:
      "Leibniz baute ab 1673 eine der ersten Rechenmaschinen der Geschichte, die alle vier Grundrechenarten beherrschte — gedacht unter anderem für Astronomen, die damals Wochen ihres Lebens mit Zahlenkolonnen verbrachten. Der Satz begründet die Erfindung: Kluge Köpfe sollen ihre Zeit nicht mit mechanischer Arbeit vergeuden, die eine Maschine übernehmen kann. Das ist das Urversprechen jeder Automatisierung, von der Waschmaschine bis zum Sprachmodell: Die Maschine übernimmt das Stumpfe, der Mensch behält das Schöpferische.",
    pointe:
      "Ob diese Rechnung aufgeht, ist seit 340 Jahren die offene Frage — sie ist der rote Faden dieses Moduls.",
    quelleLabel: "MacTutor History of Mathematics (übersetzt)",
    quelleUrl: "https://mathshistory.st-andrews.ac.uk/Biographies/Leibniz/quotations/",
  },
  {
    text: "Wir werden von einer neuen Krankheit heimgesucht: Die Arbeit schwindet schneller, als wir neue Beschäftigung dafür finden.",
    kategorie: "technik",
    jahr: "1930",
    wer: "John Maynard Keynes",
    hintergrund:
      "Der Ökonom John Maynard Keynes schrieb 1930 — mitten in der Weltwirtschaftskrise — einen erstaunlich optimistischen Essay über die «wirtschaftlichen Möglichkeiten unserer Enkelkinder». Darin prägte er den Begriff der «technologischen Arbeitslosigkeit»: Maschinen ersetzen Arbeit schneller, als neue entsteht. Keynes hielt das ausdrücklich für eine vorübergehende «Anpassungskrankheit» und sagte für unsere Gegenwart die Fünfzehn-Stunden-Woche voraus — das eigentliche Problem werde sein, was wir mit all der freien Zeit anfangen.",
    pointe:
      "Die Diagnose kehrt seither bei jeder Technikwelle wieder — zuletzt fast wortgleich in den KI-Debatten von 2023.",
    quelleLabel: "«Economic Possibilities for our Grandchildren» (übersetzt)",
    quelleUrl:
      "https://www.marxists.org/reference/subject/economics/keynes/1930/our-grandchildren.htm",
  },
  {
    text: "Die ganze Erde wird sich in ein einziges riesiges Gehirn verwandeln; über jede Entfernung hinweg werden wir einander sehen und hören.",
    kategorie: "technik",
    jahr: "1926",
    wer: "Nikola Tesla",
    hintergrund:
      "Der Erfinder Nikola Tesla gab 1926 dem Magazin Collier's ein grosses Interview über die drahtlose Zukunft. Seine Vision: Die Erde wird ein einziges Gehirn, jeder Mensch erreicht jeden, und das Gerät dafür passt in die Westentasche — weshalb der Text heute gern als Vorhersage des Smartphones gelesen wird. Tesla sprach aus Begeisterung, nicht aus Angst: Für ihn war die totale Vernetzung ein Versprechen von Verständigung und Frieden.",
    pointe:
      "Ein weltumspannendes «Gehirn» aus Technik — die Metapher klingt nach KI, meinte aber Funktechnik. Die Euphorie der Vernetzung ist hundert Jahre älter als das Internet.",
    quelleLabel: "Wikiquote (Collier's, 1926; übersetzt)",
    quelleUrl: "https://en.wikiquote.org/wiki/Nikola_Tesla",
  },
  {
    text: "Der unwissendste Mensch könnte damit Bücher über Philosophie, Dichtung, Recht und Mathematik verfassen — ganz ohne Genie oder Studium.",
    kategorie: "literatur",
    jahr: "1726",
    wer: "Jonathan Swift, «Gullivers Reisen»",
    hintergrund:
      "In «Gullivers Reisen» besucht Gulliver die Akademie von Lagado, wo ein Professor eine Maschine vorführt: einen Rahmen voller Wörter, der durch Kurbeln immer neue Satzbruchstücke erzeugt — daraus soll ein vollständiges Wissen aller Künste und Wissenschaften entstehen. Jonathan Swift meinte das als beissende Satire auf die Wissenschaftsgläubigkeit seiner Zeit und auf die Idee, Erkenntnis liesse sich mechanisch herstellen.",
    pointe:
      "Dreihundert Jahre später existiert die Maschine wirklich — und Swifts Spott liest sich wie eine Produktbeschreibung. Dass Satire zur Realität wird, sagt weniger über Swift als über uns.",
    quelleLabel: "Project Gutenberg (übersetzt)",
    quelleUrl: "https://www.gutenberg.org/ebooks/829",
  },
  {
    text: "Es gibt keine Sicherheit dagegen, dass die Maschinen am Ende ein Bewusstsein entwickeln.",
    kategorie: "literatur",
    jahr: "1872",
    wer: "Samuel Butler, «Erewhon»",
    hintergrund:
      "Samuel Butler schob in seinen Roman «Erewhon» das «Buch der Maschinen» ein: Ein fiktives Land hat alle Maschinen verboten, weil sie sich — nach Darwins Logik — weiterentwickeln und eines Tages Bewusstsein erlangen könnten. Butler schrieb nur gut ein Jahrzehnt nach Darwins «Entstehung der Arten» und übertrug als Erster die Evolutionstheorie auf die Technik: Auch Maschinen haben Vorfahren, Varianten, Auslese. Sein Erzähler argumentiert: Dass Maschinen heute wenig Bewusstsein haben, beweist nichts — eine Muschel hat auch nicht viel davon.",
    pointe:
      "Das Argument kehrt heute in jeder Debatte über Maschinenbewusstsein wieder — es ist 150 Jahre alt und immer noch unentschieden.",
    quelleLabel: "Project Gutenberg (übersetzt)",
    quelleUrl: "https://www.gutenberg.org/ebooks/1906",
  },
  {
    text: "Ich wollte die ganze Menschheit in eine Aristokratie verwandeln — getragen von Millionen mechanischer Sklaven.",
    kategorie: "literatur",
    jahr: "1920",
    wer: "Karel Čapek, «R.U.R.»",
    hintergrund:
      "Karel Čapeks Theaterstück «R.U.R. — Rossums Universal-Roboter» schenkte der Welt das Wort «Roboter», abgeleitet vom tschechischen robota: Frondienst, Zwangsarbeit. Fabrikdirektor Domin spricht den Satz als aufrichtige Utopie: Künstliche Arbeiter befreien die Menschheit von aller Mühsal, niemand muss mehr dienen, alle werden Aristokraten des Geistes. Im Stück endet das Versprechen im Aufstand der Roboter — und im Untergang der Menschen.",
    pointe:
      "Utopie und Katastrophe im selben Satz: Dieses Muster begleitet die Automatisierungsdebatte bis heute — man hört es in mancher KI-Vision fast wortgleich.",
    quelleLabel: "Project Gutenberg (übersetzt)",
    quelleUrl: "https://www.gutenberg.org/ebooks/59112",
  },
];

function kat(id: Kategorie) {
  return KATEGORIEN.find((k) => k.id === id)!;
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
      <p className="mb-md flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px] text-tertiary">
          {fertig ? "done_all" : "quiz"}
        </span>
        {beantwortet === 0
          ? "Rate bei jeder Aussage: Woher stammt sie?"
          : `${richtig} von ${beantwortet} richtig${fertig ? " — alle erraten" : ""}`}
      </p>

      <ol className="flex flex-col gap-lg">
        {AUSSAGEN.map((a, i) => {
          const wahl = antworten[i];
          const beantwortetI = Boolean(wahl);
          const korrekt = wahl === a.kategorie;
          const loesung = kat(a.kategorie);
          return (
            <li
              key={i}
              className={
                "overflow-hidden rounded-xl border border-outline-variant shadow-sm " +
                (i % 2 === 0 ? "bg-surface-bright" : "bg-surface-container-low")
              }
            >
              <div className="flex items-start gap-md p-lg">
                <span className="mt-xs hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-surface-container-high text-label-md text-on-surface-variant sm:flex">
                  {i + 1}
                </span>
                <p className="text-headline-sm italic text-on-surface">
                  «{a.text}»
                </p>
              </div>

              {/* Rate-Knöpfe oder Auflösung */}
              {!beantwortetI ? (
                <div className="border-t border-outline-variant bg-surface-container/60 p-md sm:p-lg">
                  <p className="mb-sm text-label-md uppercase tracking-wider text-on-surface-variant">
                    Woher stammt das?
                  </p>
                  <div className="flex flex-col gap-sm sm:flex-row">
                    {KATEGORIEN.map((k) => (
                      <button
                        key={k.id}
                        type="button"
                        onClick={() => raten(i, k.id)}
                        className="inline-flex flex-1 items-center justify-center gap-sm rounded-xl border border-outline-variant bg-surface-bright px-md py-md text-label-md text-on-surface transition hover:-translate-y-0.5 hover:border-tertiary hover:text-tertiary hover:shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {k.icon}
                        </span>
                        {k.kurz}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className={
                    "animate-frame-in border-t border-outline-variant p-lg " +
                    loesung.box
                  }
                >
                  {/* Treffer-Zeile */}
                  <p
                    className={
                      "flex items-center gap-sm text-body-lg font-semibold " +
                      (korrekt ? "text-tertiary" : "text-error")
                    }
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {korrekt ? "check_circle" : "cancel"}
                    </span>
                    {korrekt
                      ? "Richtig geraten!"
                      : `Knapp daneben — du tipptest «${kat(wahl).label}».`}
                  </p>

                  {/* Auflösung */}
                  <div className="mt-md flex flex-wrap items-baseline gap-x-md gap-y-xs">
                    <span className="text-headline-lg text-tertiary">{a.jahr}</span>
                    <span className="text-headline-sm text-on-surface">{a.wer}</span>
                    <span
                      className={
                        "inline-flex items-center gap-xs rounded-lg px-sm py-xs text-label-md " +
                        loesung.chip
                      }
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {loesung.icon}
                      </span>
                      {loesung.label}
                    </span>
                  </div>
                  <p className="mt-md max-w-4xl text-body-md text-on-surface-variant">
                    {a.hintergrund}
                  </p>
                  <p className="mt-sm max-w-4xl text-body-md font-semibold text-on-surface">
                    {a.pointe}
                  </p>
                  <a
                    href={a.quelleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-md inline-flex items-center gap-xs text-label-md text-primary underline underline-offset-2 hover:text-on-primary-container"
                  >
                    <span className="material-symbols-outlined text-[16px]">
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
        <div className="animate-frame-in mt-lg rounded-xl border border-tertiary/40 bg-tertiary-container/30 p-lg">
          <p className="text-body-lg text-on-surface">
            Egal ob Begeisterung oder Furcht — die Sätze stammen aus{" "}
            <strong>drei Jahrhunderten</strong>, von Leibniz’ Rechenmaschine bis
            zu heutigen KI-Warnungen, und klingen doch fast gleich. Der Traum,
            das Denken an Maschinen zu übergeben — und die Unruhe darüber — ist
            viel älter als die KI. Die Geschichte dazu steht im Storyboard
            gleich unten.
          </p>
        </div>
      )}
    </div>
  );
}
