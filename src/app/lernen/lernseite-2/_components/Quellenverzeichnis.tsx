"use client";

import { useLayoutEffect, useRef, useState } from "react";

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
  /* Zu den Merkmalen: was die Fachwoerter des Lernsets bedeuten. */
  {
    titel: "KI-Glossar: die Begriffe kurz erklärt",
    beschreibung:
      "Maschinelles Lernen, Deep Learning, Sprachmodell, Halluzination: je zwei bis drei Sätze zum Nachschlagen.",
    quelle: "SRF Wissen",
    url: "https://www.srf.ch/wissen/kuenstliche-intelligenz/ki-glossar-wichtige-begriffe-rund-um-ki-einfach-erklaert",
    modul: "Vorhang auf",
  },
  {
    titel: "KI-Agenten: wenn die KI selbständig handelt",
    beschreibung:
      "Was «agentenfähig» heisst, an Beispielen wie einen Flug buchen oder E-Mails sortieren.",
    quelle: "Bundesamt für Sicherheit in der Informationstechnik",
    url: "https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/Informationen-und-Empfehlungen/Technologien_sicher_gestalten/Kuenstliche-Intelligenz/KI-Agenten/ki-agenten_node.html",
    modul: "Vorhang auf",
  },
  /* Zu den Kontextbereichen: Technik und Ressourcen, Recht, Arbeitsmarkt. */
  {
    titel: "Stille Stromfresser: Rechenzentren in der Schweiz",
    beschreibung:
      "Wie viel Strom die Rechenzentren hierzulande ziehen und wie viel Trinkwasser ihre Kühlung braucht.",
    quelle: "SRF News",
    url: "https://www.srf.ch/news/wirtschaft/digitale-infrastruktur-stille-stromfresser-immer-mehr-rechenzentren-in-der-schweiz",
    modul: "Vorhang auf",
  },
  {
    titel: "KI-Rechenzentren und das Wasser",
    beschreibung:
      "Warum KI zweimal Wasser kostet: direkt für die Kühlung und noch einmal über die Stromerzeugung.",
    quelle: "SWI swissinfo.ch",
    url: "https://www.swissinfo.ch/ger/schweizer-ki/ki-rechenzentren-setzen-schweizer-wasserressourcen-unter-druck/91322903",
    modul: "Vorhang auf",
  },
  {
    titel: "Das KI-Gesetz der EU und seine Risikostufen",
    beschreibung:
      "Was der AI Act regelt: verbotene Anwendungen, Hochrisiko-Systeme und Transparenzpflichten, je nach Risiko gestaffelt.",
    quelle: "Europäisches Parlament",
    url: "https://www.europarl.europa.eu/topics/de/article/20230601STO93804/ki-gesetz-erste-regulierung-der-kunstlichen-intelligenz",
    modul: "Vorhang auf",
  },
  {
    titel: "Wie die Schweiz KI reguliert",
    beschreibung:
      "Kein eigenes KI-Gesetz, sondern angepasste bestehende Gesetze. Mit dem Vergleich zur EU.",
    quelle: "SRF",
    url: "https://www.srf.ch/radio-srf-1/kuenstliche-intelligenz-ki-regulierung-braucht-es-rasch-strengere-massnahmen",
    modul: "Vorhang auf",
  },
  {
    titel: "KI und Jobs: Putzkräfte sicherer als Softwareentwickler",
    beschreibung:
      "Ein ETH-Ökonom erklärt, welche Tätigkeiten die KI übernimmt, welche Berufe sicherer sind und was das für Junge heisst.",
    quelle: "SRF News",
    url: "https://www.srf.ch/news/wirtschaft/arbeitsmarkt-vor-umwaelzungen-ki-und-arbeitswelt-putzkraefte-sicherer-als-softwareentwickler",
    modul: "Vorhang auf",
  },
  {
    titel: "Ein Viertel der Schweizer Stellen ist betroffen",
    beschreibung:
      "Eine Studie über drei Millionen Arbeitsplätze: stark betroffen sind Büro, Banken und Versicherungen, kaum das Handwerk.",
    quelle: "SRF News",
    url: "https://www.srf.ch/news/wirtschaft/studie-zur-arbeit-mit-ki-ki-fuehrt-zu-umwaelzung-in-der-welt-der-arbeit",
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
  {
    /* Der Text nennt den Fachbegriff «Natalität» nicht, er verhandelt den
       Gedanken unter «Pluralität». Als Erklärung der SACHE ist er stark: Er
       führt das Anfangen an einer 15-Jährigen vor und fragt ausdrücklich, ob
       Jugendliche in diesem Alter politisch handeln dürfen. */
    titel: "Arendt: jeder Mensch kann etwas anfangen",
    beschreibung:
      "Am Beispiel einer 15-Jährigen, die einen Schulstreik beginnt: warum Handeln für Arendt heisst, einen Anfang zu setzen.",
    quelle: "philosophie.ch",
    url: "https://www.philosophie.ch/2020-04-24-robaszkiewicz",
    modul: "Eine philosophische Perspektive",
  },
  {
    /* Bewusst der Anker #Überblick: Die Einleitung darüber ist deutlich
       schwerer (Durkheim, Ethnografie, Semiotik), und der Abschnitt
       «Aktanten» weiter unten ist Uni-Soziologie. Nur dieser eine Abschnitt
       ist laientauglich, und er trägt das Universitäts-Beispiel. */
    titel: "Latour: auch Dinge handeln mit",
    beschreibung:
      "Am Beispiel einer Universität: Studierende, Stühle, Laptops und Stifte bilden zusammen ein Netz, das als Ganzes handelt.",
    quelle: "Wikipedia",
    url: "https://de.wikipedia.org/wiki/Akteur-Netzwerk-Theorie#%C3%9Cberblick",
    modul: "Eine philosophische Perspektive",
  },
  {
    titel: "Der Berliner Schlüssel",
    beschreibung:
      "Latours bekanntestes Beispiel: ein Schlüssel, der einen zwingt, hinter sich abzuschliessen. Ein Ding, das Verhalten vorschreibt.",
    quelle: "Wikipedia",
    url: "https://de.wikipedia.org/wiki/Der_Berliner_Schl%C3%BCssel",
    modul: "Eine philosophische Perspektive",
  },
  {
    titel: "Nassehi: die Gesellschaft läuft in Mustern",
    beschreibung:
      "Warum die Digitalisierung überhaupt funktioniert: weil wir berechenbarer sind, als wir meinen.",
    quelle: "SRF Kultur",
    url: "https://www.srf.ch/kultur/gesellschaft-religion/muster-von-armin-nassehi-warum-wir-daten-anhaeufen-ohne-ende",
    modul: "Eine philosophische Perspektive",
  },
  {
    /* Gabriel spricht hier selbst, statt dass jemand über ihn schreibt. Das
       war die Lehre aus zwei verworfenen Kandidaten: Eine Rezension zitiert am
       Ende den Rezensenten, und die naheliegende SRF-Seite zur «einen Moral»
       erwähnt KI mit keinem Wort.

       Nicht gedeckt und darum in der Beschreibung nicht behauptet: dass Ethik
       von jeher eine emotionale Grundlage habe. Das Interview sagt, die KI
       LESE Gefühle — über die Grundlage der Ethik sagt es nichts. */
    titel: "Gabriel: die KI ist ein Spiegel von uns",
    beschreibung:
      "Im Interview: Sie wird zum Terminator, wenn wir den Terminator hineinspiegeln, und zu Gandhi, wenn wir Gandhi spiegeln.",
    quelle: "watson.ch",
    url: "https://www.watson.ch/wissen/digital/128883092-ki-philosoph-markus-gabriel-ueber-superintelligenz-und-silicon-valley",
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

/**
 * Bücher, aus denen dieses Lernset schöpft. Eine eigene Rubrik, weil sie die
 * Auswahlregel der Links oben nicht erfüllen: keine Kurztexte für fünf
 * Minuten, und zwei der drei sind nicht frei zugänglich. Sie stehen hier,
 * damit nachvollziehbar ist, woher die Aussagen kommen, und für die, die
 * weiterlesen wollen.
 *
 * Die einzelnen Fundstellen hängen als Beleg an der jeweiligen Textstelle
 * (siehe `_data/belege.ts`) und erscheinen dort beim Überfahren.
 *
 * `url` nur, wenn das Buch tatsächlich frei zu lesen ist — bei Jäkel Open
 * Access (CC BY-ND 4.0) über den Verlag, geprüft am 4. August 2026.
 */
const BUECHER: {
  autor: string;
  titel: string;
  verlag: string;
  wofuer: string;
  url?: string;
  frei?: string;
}[] = [
  {
    autor: "Frank Jäkel",
    titel: "Die intelligente Täuschung",
    verlag: "transcript 2025",
    wofuer:
      "Warum das Vorhersagen des nächsten Wortes noch kein Verstehen ist, erklärt am Satz «Hochmut kommt vor dem …».",
    url: "https://www.transcript-verlag.de/978-3-8376-7752-2/die-intelligente-taeuschung/",
    frei: "frei lesbar (Open Access)",
  },
  {
    autor: "Katharina Zweig",
    titel: "Weiss die KI, dass sie nichts weiss?",
    verlag: "Heyne 2025",
    wofuer:
      "Wie Sprachmodelle rechnen: Wörter werden zu Zahlenreihen in einem Raum mit Hunderten bis über zehntausend Richtungen.",
  },
  {
    autor: "Markus Gabriel",
    titel: "Ethische Intelligenz",
    verlag: "Ullstein 2026",
    wofuer:
      "Was es heisst, dass eine KI ein Sinnfeld «vektorisiert», also in Mathematik übersetzt.",
  },
];

export default function Quellenverzeichnis({ className = "" }: { className?: string }) {
  const [offen, setOffen] = useState<Modul | null>(null);
  const [buecherOffen, setBuecherOffen] = useState(false);

  /* Beim Umschalten den angeklickten Kopf an seiner Bildschirmposition halten.
     Es ist immer nur eine Gruppe offen. Klickt man eine untere Gruppe an,
     während weiter oben eine offene zusammenklappt, verschwinden über dem
     Finger etliche Zeilen: Die Seite rutscht nach oben, der Blick landet
     unterhalb des Akkordeons statt beim gewählten Kapitel (Christofs Meldung
     2026-08-09). Darum wird die Kopf-Position vor dem Umschalten gemerkt und
     im useLayoutEffect zurückgeschoben. Der läuft synchron nach dem Neuaufbau
     und vor dem Zeichnen, anders als requestAnimationFrame, das in
     Hintergrund-Tabs gar nicht feuert. */
  const korrektur = useRef<{ el: HTMLElement; top: number } | null>(null);
  const stabilHalten = (el: HTMLElement, umschalten: () => void) => {
    korrektur.current = { el, top: el.getBoundingClientRect().top };
    umschalten();
  };
  useLayoutEffect(() => {
    if (!korrektur.current) return;
    const { el, top } = korrektur.current;
    korrektur.current = null;
    const delta = el.getBoundingClientRect().top - top;
    if (delta !== 0) {
      const roller = document.scrollingElement ?? document.documentElement;
      roller.scrollTop += delta;
    }
  }, [offen, buecherOffen]);

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
                onClick={(e) =>
                  stabilHalten(e.currentTarget, () =>
                    setOffen((v) => (v === g.name ? null : g.name)),
                  )
                }
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

      {/* Die Bücher als eigener Block, mit Trennlinie: Sie sind keine
          Erklärlinks fürs schnelle Nachschlagen, sondern der Boden, auf dem
          die Texte stehen. */}
      <div className="mt-md border-t border-outline-variant pt-md">
        <button
          type="button"
          onClick={(e) => stabilHalten(e.currentTarget, () => setBuecherOffen((o) => !o))}
          aria-expanded={buecherOffen}
          className={
            "flex w-full items-center gap-sm rounded-lg border bg-surface-bright px-sm py-sm text-left outline-none transition-colors hover:border-tertiary " +
            (buecherOffen ? "border-tertiary" : "border-outline-variant")
          }
        >
          <span className="material-symbols-outlined flex-shrink-0 text-[20px] text-tertiary">
            auto_stories
          </span>
          <span className="min-w-0 flex-1 text-body-sm font-medium text-on-surface">
            Bücher, aus denen dieses Lernset schöpft
          </span>
          <span className="flex-shrink-0 text-label-sm text-on-surface-variant">
            {BUECHER.length}
          </span>
          <span
            className={
              "material-symbols-outlined flex-shrink-0 text-[20px] text-on-surface-variant transition-transform duration-300 " +
              (buecherOffen ? "rotate-180" : "")
            }
          >
            expand_more
          </span>
        </button>

        {buecherOffen && (
          <div className="animate-frame-in mt-xs pl-md">
            <p className="mb-xs text-label-sm text-on-surface-variant">
              Keine Fünf-Minuten-Texte, aber hier kommen die Aussagen her. Wo
              genau, steht beim Überfahren der jeweiligen Textstelle im Lernset.
            </p>
            <ul className="space-y-xs">
              {BUECHER.map((b) => {
                const inhalt = (
                  <>
                    <p className="text-body-sm font-medium text-on-surface">
                      {b.autor}: «{b.titel}»
                    </p>
                    <p className="mt-[2px] text-label-sm text-on-surface-variant">{b.wofuer}</p>
                    <p className="mt-xs flex items-center gap-xs text-label-sm text-on-surface-variant">
                      <span className="opacity-70">{b.verlag}</span>
                      {b.frei && (
                        /* !leading-snug: text-label-sm setzt line-height 1, die
                           Pille wäre 12 px hoch und der Text ragte oben und
                           unten heraus. */
                        <span className="rounded-full bg-tertiary-container px-xs py-[1px] text-label-sm !leading-snug text-on-tertiary-container">
                          {b.frei}
                        </span>
                      )}
                    </p>
                  </>
                );

                return (
                  <li key={b.titel}>
                    {b.url ? (
                      <a
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-lg border border-outline-variant bg-surface-bright p-sm outline-none transition-colors hover:border-tertiary"
                      >
                        {inhalt}
                        <span className="mt-xs inline-flex items-center gap-[2px] text-label-sm text-tertiary">
                          Beim Verlag öffnen
                          <span className="material-symbols-outlined text-[14px] transition-transform group-hover:translate-x-[2px]">
                            open_in_new
                          </span>
                        </span>
                      </a>
                    ) : (
                      <div className="rounded-lg border border-outline-variant bg-surface-bright p-sm">
                        {inhalt}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
