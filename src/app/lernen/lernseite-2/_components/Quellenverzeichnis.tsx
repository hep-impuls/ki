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
  /* Zu den Merkmalen: wie eine KI rechnet, lernt und Wahrscheinlichkeiten wählt. */
  {
    titel: "Warum sogar ChatGPT Rechtschreibfehler macht",
    beschreibung:
      "Am Alltagsbeispiel Tippfehler: Die KI lernt aus riesigen Textmengen und wählt einfach das statistisch wahrscheinlichste Wort.",
    quelle: "SRF News",
    url: "https://www.srf.ch/news/kuenstliche-intelligenz-von-wegen-intelligent-auch-chatgpt-macht-rechtschreibfehler",
    modul: "Vorhang auf",
  },
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
    titel: "Nassehi: die Gesellschaft läuft in Mustern",
    beschreibung:
      "Warum die Digitalisierung überhaupt funktioniert: weil wir berechenbarer sind, als wir meinen.",
    quelle: "SRF Kultur",
    url: "https://www.srf.ch/kultur/gesellschaft-religion/muster-von-armin-nassehi-warum-wir-daten-anhaeufen-ohne-ende",
    modul: "Eine philosophische Perspektive",
  },
  /* Zu Gabriel fehlt noch ein Link. Der naheliegende SRF-Beitrag zur «einen
     Moral» ist wieder draussen: Im Lernset steht Gabriel für den «magischen
     Spiegel» und die «ethische Intelligenz» — dass die KI unsere Werte und
     Gefühle aus Daten liest und die eigentliche Frage darum an uns
     zurückgeht. Davon handelt jener Beitrag nicht, er erwähnt KI mit keinem
     Wort. Ein thematisch danebenliegender Link ist schlechter als keiner. */

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
