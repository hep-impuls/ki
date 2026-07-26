"use client";

import Ausklapptext from "./Ausklapptext";

/**
 * Quellenverzeichnis — die geprüften Belege des Lernsets, nach Themen geordnet
 * und aufklappbar. Steht im Orakel unmittelbar vor dem Datenschutz-Abschnitt.
 *
 * Die Q-Nummern folgen dem externen Prüfbericht vom 26. Juli 2026; sie machen
 * nachvollziehbar, welche Quelle welche Aussage stützt. Bewusst keine
 * Vollbibliografie: aufgeführt sind die Belege, die einzeln kontrolliert
 * wurden. Nur Theme-Tokens, Material Symbols.
 */

interface Quelle {
  /** Kennung aus dem Prüfbericht, z.B. «Q1». */
  id: string;
  /** Wofür die Quelle einsteht (kurz). */
  thema: string;
  /** Was sie belegt. */
  stuetzt: string;
  links: { label: string; url: string }[];
}

interface Gruppe {
  titel: string;
  hinweis?: string;
  quellen: Quelle[];
}

const ABRUFDATUM = "26. Juli 2026";

const GRUPPEN: Gruppe[] = [
  {
    titel: "Übergreifend: Recht und Datenschutz",
    hinweis: "Diese Quellen stützen Aussagen, die an mehreren Stellen vorkommen.",
    quellen: [
      {
        id: "Q10",
        thema: "KI und Urheberrecht (Schweiz)",
        stuetzt:
          "Ob ein KI-Ergebnis geschützt ist, hängt vom menschlichen Gestaltungsbeitrag ab.",
        links: [
          {
            label: "IGE: Künstliche Intelligenz und Urheberrecht (2023)",
            url: "https://www.ige.ch/de/blog/blog-artikel/kuenstliche-intelligenz-koennen-ki-tools-urheberrecht-verletzen",
          },
        ],
      },
      {
        id: "Q11",
        thema: "Training und Einsatz von KI",
        stuetzt: "Aktualisierte rechtliche Einordnung zu Training und Nutzung.",
        links: [
          {
            label: "IGE: Urheberrechtliche Fragen beim Training (2025)",
            url: "https://www.ige.ch/de/blog/blog-artikel/urheberrechtliche-fragen-beim-training-und-beim-einsatz-von-kuenstlicher-intelligenz",
          },
        ],
      },
      {
        id: "Q12",
        thema: "Anonymisierung",
        stuetzt:
          "Anonym heisst: eine Rückverfolgung ist praktisch ausgeschlossen. Sonst ist es pseudonym.",
        links: [
          {
            label: "EDÖB: Datenschutz in der Forschung",
            url: "https://www.edoeb.admin.ch/de/datenschutz-in-der-forschung",
          },
        ],
      },
      {
        id: "Q13",
        thema: "Pseudonymisierung",
        stuetzt:
          "Ein Code, der den Namen ersetzt, ist ein Pseudonym. Genau so arbeitet der Fortschritts-Code hier.",
        links: [
          {
            label: "EDÖB: Leitfaden zu technischen und organisatorischen Massnahmen (PDF)",
            url: "https://www.edoeb.admin.ch/dam/edoeb/de/Dokumente/aDSG/guideTOM_de.pdf.download.pdf/guideTOM_de.pdf",
          },
        ],
      },
    ],
  },
  {
    titel: "Thema 01 · Vorhang auf: KI-Geschichte und Technik",
    quellen: [
      {
        id: "Q1",
        thema: "Enigma und die «Bombe»",
        stuetzt:
          "Die britische Bombe geht auf Alan Turing und Gordon Welchman zurück, mit polnischen Vorarbeiten.",
        links: [
          {
            label: "Bletchley Park: Teacher Notes (PDF)",
            url: "https://bletchleypark.org.uk/wp-content/uploads/2021/10/teachers-notes-ks2-2019.pdf",
          },
        ],
      },
      {
        id: "Q2",
        thema: "Transformer",
        stuetzt:
          "Neu war 2017 die Architektur, nicht der Attention-Mechanismus. Den gab es schon vorher.",
        links: [
          { label: "Vaswani et al.: Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" },
        ],
      },
      {
        id: "Q3",
        thema: "Verstärkendes Lernen (DQN)",
        stuetzt:
          "Das System lernte Atari-Spiele aus Bilddaten und Belohnung und erreichte bei mehreren menschliches Niveau.",
        links: [
          {
            label: "Mnih et al.: Human-level control through deep reinforcement learning (Nature)",
            url: "https://www.nature.com/articles/nature14236",
          },
        ],
      },
      {
        id: "Q4",
        thema: "Skalierung",
        stuetzt: "Modellgrösse, Datenmenge und Rechenaufwand wirken zusammen, nicht die Grösse allein.",
        links: [
          { label: "Kaplan et al.: Scaling Laws for Neural Language Models", url: "https://arxiv.org/abs/2001.08361" },
        ],
      },
      {
        id: "Q5",
        thema: "«Emergente» Fähigkeiten",
        stuetzt: "Ob Fähigkeiten wirklich sprunghaft auftauchen, ist methodisch umstritten.",
        links: [
          { label: "Schaeffer et al.: Are Emergent Abilities a Mirage?", url: "https://arxiv.org/abs/2304.15004" },
        ],
      },
      {
        id: "Q6",
        thema: "Vektoren und Embeddings",
        stuetzt:
          "Die Zahl der Dimensionen hängt vom Modell ab; einzelne Dimensionen sind nicht als Bedeutungsanteil lesbar.",
        links: [
          { label: "OpenAI: New embedding models", url: "https://openai.com/index/new-embedding-models-and-api-updates/" },
        ],
      },
      {
        id: "Q7",
        thema: "Llama-Lizenz",
        stuetzt: "Zugängliche Gewichte sind nicht dasselbe wie Open Source.",
        links: [
          {
            label: "Open Source Initiative: Meta's Llama license is not Open Source",
            url: "https://opensource.org/blog/metas-llama-license-is-still-not-open-source",
          },
        ],
      },
      {
        id: "Q8",
        thema: "Apertus",
        stuetzt: "Das Schweizer Modell wird als vollständig offen und transparent veröffentlicht.",
        links: [
          {
            label: "ETH Zürich: Apertus",
            url: "https://ethz.ch/en/news-and-events/eth-news/news/2025/09/press-release-apertus-a-fully-open-transparent-multilingual-language-model.html",
          },
        ],
      },
      {
        id: "Q9",
        thema: "Eingaben und Training",
        stuetzt:
          "Ob deine Eingaben ins Training einfliessen, hängt von Anbieter, Produkt und Einstellungen ab.",
        links: [
          { label: "OpenAI: Data Controls FAQ", url: "https://help.openai.com/en/articles/7730893-data-controls-faq" },
        ],
      },
      {
        id: "Q39",
        thema: "Frühe ChatGPT-Nutzung",
        stuetzt:
          "Eine Million Nutzende nach fünf Tagen, rund hundert Millionen nach zwei Monaten: Schätzungen, keine amtliche Statistik.",
        links: [
          {
            label: "Reuters/UBS-Schätzung zum Nutzerwachstum",
            url: "https://www.investing.com/news/economy/chatgpt-sets-record-for-fastestgrowing-user-base--analyst-note-2993773",
          },
        ],
      },
    ],
  },
  {
    titel: "Thema 01 · Vorhang auf: Umwelt, Wirtschaft, Recht",
    quellen: [
      {
        id: "Q14",
        thema: "Googles Emissionen",
        stuetzt:
          "Plus 48 Prozent gegenüber 2019 (Bezugsjahr 2023); Ursachen sind Rechenzentren und Lieferkette.",
        links: [
          { label: "Google: 2024 Environmental Report", url: "https://sustainability.google/reports/google-2024-environmental-report/" },
        ],
      },
      {
        id: "Q15",
        thema: "Rechenzentren in Irland",
        stuetzt: "21 Prozent des gemessenen Stroms 2023, 22 Prozent 2024.",
        links: [
          {
            label: "CSO Ireland: Daten für 2023",
            url: "https://www.cso.ie/en/releasesandpublications/ep/p-dcmec/datacentresmeteredelectricityconsumption2023/keyfindings/",
          },
          {
            label: "CSO Ireland: Daten für 2024",
            url: "https://www.cso.ie/en/releasesandpublications/ep/p-dcmec/datacentresmeteredelectricityconsumption2024/keyfindings/",
          },
        ],
      },
      {
        id: "Q16",
        thema: "Verzerrungen (Bias)",
        stuetzt: "Regressive Geschlechterstereotype in untersuchten Sprachmodellen.",
        links: [
          {
            label: "UNESCO: Studie zu Geschlechterstereotypen (2024)",
            url: "https://www.unesco.org/en/articles/generative-ai-unesco-study-reveals-alarming-evidence-regressive-gender-stereotypes",
          },
        ],
      },
      {
        id: "Q17",
        thema: "EU AI Act",
        stuetzt: "Risikobasierter Rechtsrahmen mit eigenen Regeln für Allzweckmodelle.",
        links: [
          {
            label: "Europäische Kommission: Regulatory framework for AI",
            url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
          },
        ],
      },
      {
        id: "Q18",
        thema: "Geltung des AI Act",
        stuetzt: "In Kraft seit 1. August 2024, die Pflichten greifen gestaffelt.",
        links: [
          {
            label: "EU AI Act Service Desk: Implementation timeline",
            url: "https://ai-act-service-desk.ec.europa.eu/en/ai-act/eu-ai-act-implementation-timeline",
          },
        ],
      },
      {
        id: "Q19",
        thema: "Chip-Exportkontrollen ab 2022",
        stuetzt: "Verschärfte Ausfuhrregeln für fortgeschrittene Rechenchips.",
        links: [
          {
            label: "US Bureau of Industry and Security (2022)",
            url: "https://www.bis.gov/press-release/commerce-implements-new-export-controls-advanced-computing-semiconductor-manufacturing-items-peoples",
          },
        ],
      },
      {
        id: "Q20",
        thema: "Rechtsstand 2026",
        stuetzt: "Bestimmte Ausfuhren nach China werden seit Januar 2026 fallweise geprüft.",
        links: [
          {
            label: "US Bureau of Industry and Security: revidierte Lizenzprüfung",
            url: "https://www.bis.gov/press-release/department-commerce-revises-license-review-policy-semiconductors-exported-china",
          },
        ],
      },
      {
        id: "Q21",
        thema: "Zugang und Preise",
        stuetzt: "Was die Gratisstufe kann und was ein Abo ändert; die Stufen ändern laufend.",
        links: [{ label: "OpenAI: ChatGPT Pricing", url: "https://openai.com/chatgpt/pricing/" }],
      },
      {
        id: "Q22",
        thema: "Klarna",
        stuetzt:
          "700 Vollzeitäquivalente als Unternehmensangabe, dazu die spätere Kurskorrektur im Kundendienst.",
        links: [
          {
            label: "Klarna: Unternehmensunterlagen (PDF)",
            url: "https://d18rn0p25nwr6d.cloudfront.net/CIK-0002003292/67991e36-4112-4c68-a771-e3feae27b281.pdf",
          },
          {
            label: "Reuters: Klarna bremst bei Chatbots",
            url: "https://www.investing.com/news/stock-market-news/europes-ai-poster-child-klarna-taps-the-brakes-on-chatbots-4233976",
          },
        ],
      },
    ],
  },
  {
    titel: "Thema 02 · Philosophie in Zeiten der Verunsicherung",
    quellen: [
      {
        id: "Q23",
        thema: "Eroberung Mexikos",
        stuetzt: "Indigene Verbündete, Vermittlung durch La Malinche und die Pocken waren entscheidend.",
        links: [
          { label: "Smithsonian Institution: Mexican America", url: "https://www.si.edu/spotlight/mexican-america/history" },
        ],
      },
      {
        id: "Q24",
        thema: "Ablass",
        stuetzt: "Erlass zeitlicher Strafe für bereits vergebene Schuld, nicht Kauf der Vergebung.",
        links: [
          {
            label: "Katechismus der katholischen Kirche: Ablässe",
            url: "https://www.vatican.va/content/catechism/en/part_two/section_two/chapter_two/article_4/x_indulgences.html",
          },
        ],
      },
      {
        id: "Q25",
        thema: "Olympe de Gouges",
        stuetzt:
          "Forderte 1791 gleiche Rechte für Frauen, 1793 hingerichtet wegen ihrer politischen Schriften.",
        links: [
          {
            label: "Assemblée nationale: Erklärung der Rechte der Frau",
            url: "https://www.assemblee-nationale.fr/dyn/histoire-et-patrimoine/revolution-francaise/declaration-des-droits-de-la-femme-et-de-la-citoyenne",
          },
          {
            label: "Assemblée nationale: biografische Dokumentation (PDF)",
            url: "https://www2.assemblee-nationale.fr/static/evenements/plaquetteOdeGouges.pdf",
          },
        ],
      },
      {
        id: "Q26",
        thema: "Kernspaltung",
        stuetzt:
          "Hahn und Strassmann fanden den Befund, Meitner und Frisch erklärten und benannten die Spaltung.",
        links: [
          { label: "Nobel Prize: Otto Hahn, Facts", url: "https://www.nobelprize.org/prizes/chemistry/1944/hahn/facts/" },
        ],
      },
      {
        id: "Q27",
        thema: "Augustinus",
        stuetzt:
          "«Civitas Dei» und «civitas terrena» und ihr Verhältnis zu Kirche und Staat; der Gottesstaat ist nicht der vergängliche.",
        links: [
          { label: "Stanford Encyclopedia of Philosophy: Augustine", url: "https://plato.stanford.edu/entries/augustine/" },
        ],
      },
      {
        id: "Q28",
        thema: "Kant und Lissabon",
        stuetzt: "Kants Erdbebenschriften von 1756; der Aufruf zum Selbstdenken kam 1784.",
        links: [
          {
            label: "Stanford Encyclopedia of Philosophy: Kant's development",
            url: "https://plato.stanford.edu/archives/spr2012/entries/kant-development/",
          },
        ],
      },
      {
        id: "Q31",
        thema: "World Wide Web",
        stuetzt: "Erfindung 1989, erste Umsetzung 1990/91, Freigabe durch das CERN 1993.",
        links: [{ label: "CERN: The birth of the Web", url: "https://home.cern/science/computing/the-birth-of-the-web/" }],
      },
      {
        id: "Q32",
        thema: "Personal Computer",
        stuetzt: "Persönliche Mikrocomputer ab Mitte der 1970er; der IBM PC von 1981 standardisierte den Markt.",
        links: [
          { label: "Computer History Museum: 1975", url: "https://www.computerhistory.org/timeline/1975/" },
          { label: "Computer History Museum: The IBM PC", url: "https://www.computerhistory.org/revolution/personal-computers/17/301" },
        ],
      },
      {
        id: "Q33",
        thema: "Die Erde bei Nacht",
        stuetzt:
          "Die Bilder zeigen Licht, Besiedlung und Elektrifizierung, nicht direkt die Dichte digitaler Netze.",
        links: [
          { label: "NASA: Earth at Night", url: "https://svs.gsfc.nasa.gov/30028/" },
          { label: "NASA: Night Lights", url: "https://svs.gsfc.nasa.gov/11146/" },
        ],
      },
      {
        id: "Q34",
        thema: "Clara Immerwahr",
        stuetzt: "Die Deutung ihres Suizids als Protest gegen den Gaskrieg ist umstritten.",
        links: [
          {
            label: "Max-Planck-Repositorium: A Life in the Shadow (PDF)",
            url: "https://pure.mpg.de/pubman/item/item_2454986_15/component/file_2518068/10.1007_978-3-319-51664-6_4.pdf",
          },
        ],
      },
      {
        id: "Q35",
        thema: "«Ende der Geschichte»",
        stuetzt:
          "Fukuyamas These meinte den möglichen Endpunkt der ideologischen Entwicklung, nicht das Ende der Ereignisse.",
        links: [
          { label: "Stanford Encyclopedia of Philosophy: Progress", url: "https://plato.stanford.edu/archives/sum2022/entries/progress/" },
        ],
      },
    ],
  },
  {
    titel: "Thema 02 · Wege der Orientierung",
    quellen: [
      {
        id: "Q29",
        thema: "Hegels Dialektik",
        stuetzt: "Die Formel «These, Antithese, Synthese» bildet sein Verfahren nicht durchgehend ab.",
        links: [
          {
            label: "Stanford Encyclopedia of Philosophy: Hegel's Dialectics",
            url: "https://plato.stanford.edu/archives/fall2025/entries/hegel-dialectics/",
          },
        ],
      },
      {
        id: "Q30",
        thema: "Heidegger und der Nationalsozialismus",
        stuetzt:
          "NSDAP-Eintritt 1933, Rektorat und Gleichschaltung, Mitgliedschaft bis 1945, dokumentierter Antisemitismus.",
        links: [
          {
            label: "Stanford Encyclopedia of Philosophy: Martin Heidegger",
            url: "https://plato.stanford.edu/archives/win2025/entries/heidegger/",
          },
        ],
      },
      {
        id: "Q36",
        thema: "Wie lange eine Gewohnheit braucht",
        stuetzt: "Mittelwert 66 Tage, mit sehr grosser Spannweite; aus der Psychologie, nicht der Philosophie.",
        links: [
          { label: "University College London: How long does it take to form a habit?", url: "https://www.ucl.ac.uk/news/2009/aug/how-long-does-it-take-form-habit" },
          { label: "Lally et al., European Journal of Social Psychology", url: "https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674" },
        ],
      },
      {
        id: "Q37",
        thema: "Yasuo Deguchi und der «We-Turn»",
        stuetzt: "Mensch-KI-Systeme und verteilte Verantwortung; individuelle Verantwortung entfällt nicht.",
        links: [
          { label: "Universität Kyoto: Profil", url: "https://www.philosophy.bun.kyoto-u.ac.jp/staff/deguchi/" },
          {
            label: "Publikation zum WE-turn",
            url: "https://repository.kulib.kyoto-u.ac.jp/items/ef0e0c04-83b7-4ecd-84a0-d0cd5f9faff8",
          },
        ],
      },
      {
        id: "Q38",
        thema: "Sophisten",
        stuetzt:
          "Eine heterogene Gruppe; der Relativismus lässt sich nicht allen zuschreiben, das ist weitgehend Platons Sicht.",
        links: [
          { label: "Stanford Encyclopedia of Philosophy: The Sophists", url: "https://plato.stanford.edu/entries/sophists/" },
        ],
      },
    ],
  },
];

export default function Quellenverzeichnis({ className = "" }: { className?: string }) {
  const anzahl = GRUPPEN.reduce((n, g) => n + g.quellen.length, 0);

  return (
    <section
      aria-label="Quellenverzeichnis"
      className={
        "rounded-xl border border-outline-variant bg-surface-container-low p-md sm:p-lg " + className
      }
    >
      <p className="flex items-center gap-sm text-label-md uppercase tracking-wider text-tertiary">
        <span className="material-symbols-outlined text-[20px]">menu_book</span>
        Quellen
      </p>
      <p className="mt-sm text-body-sm text-on-surface-variant">
        Die Inhalte dieses Lernsets wurden extern geprüft. Hier stehen die{" "}
        <strong className="text-on-surface">{anzahl} Belege</strong>, die dabei
        einzeln kontrolliert wurden, mit dem Hinweis, welche Aussage sie stützen.
        Das ist keine vollständige Bibliografie, sondern eine Möglichkeit,
        nachzusehen, worauf sich eine Angabe stützt. Abrufdatum aller Weblinks:{" "}
        {ABRUFDATUM}.
      </p>

      <Ausklapptext className="mt-sm" titel="Quellenverzeichnis öffnen">
        <div className="space-y-lg">
          {GRUPPEN.map((g) => (
            <div key={g.titel}>
              <h3 className="text-body-lg font-semibold text-on-surface">{g.titel}</h3>
              {g.hinweis && (
                <p className="mt-xs text-label-sm text-on-surface-variant">{g.hinweis}</p>
              )}
              <ul className="mt-sm space-y-sm">
                {g.quellen.map((q) => (
                  <li
                    key={q.id}
                    className="rounded-lg border border-outline-variant bg-surface-bright p-sm"
                  >
                    <p className="flex flex-wrap items-baseline gap-xs">
                      <span className="rounded-full bg-tertiary-container/50 px-xs text-label-sm font-semibold text-tertiary">
                        {q.id}
                      </span>
                      <span className="text-body-sm font-medium text-on-surface">{q.thema}</span>
                    </p>
                    <p className="mt-xs text-label-sm text-on-surface-variant">{q.stuetzt}</p>
                    <ul className="mt-xs space-y-[2px]">
                      {q.links.map((l) => (
                        <li key={l.url}>
                          <a
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-start gap-xs text-label-sm text-on-surface-variant underline decoration-outline-variant underline-offset-2 transition-colors hover:text-tertiary hover:decoration-tertiary"
                          >
                            <span className="material-symbols-outlined mt-[1px] text-[14px] flex-shrink-0">
                              open_in_new
                            </span>
                            <span>{l.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Ausklapptext>
    </section>
  );
}
