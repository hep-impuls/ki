/**
 * Stations-Daten der KI-Einheit **v3** (Lernseite 1, Pietro).
 *
 * Massgebend: KI_EINHEIT_GESAMTARCHITEKTUR_v3.md §5/§6/§8/§9 + types.ts.
 * Stand M2: echter deutscher Inhalt aller 7 Stationen — verifizierte Medien-
 * Timecodes, 3 Polls (pre/post, 4er-Skala bzw. Slider St.7), 3 Swipe-Karten,
 * 5–7 Faktencheck-Fakten mit Quelle (aus deepsearch.md), Quiz-Pool 8 (5 MC + 3 W/F,
 * Distraktor-Regel §4.5), 1 Reflexion, Badges (§7), Station-4-Schutz (§4.10).
 * Menschlich lesbarer Abzug je Station: docs/material-pietro/review/station-{n}.md.
 *
 * Datenmodell ki26 (bewertungsfrei): persönliche Resultate nur localStorage;
 * Cloud nur anonyme Aggregat-Zähler (abstimmungen/ki26/polls/{pollId}.counts).
 */

import type {
  FaktenListe,
  FaktencheckFakt,
  MediaBlock,
  PollSkala4,
  QuizMC,
  QuizPool,
  QuizTF,
  Station,
  StationBadges,
  StationPolls,
  StationSubpages,
  StationSwipe,
  SubpageBanner,
  SwipeKarte,
  Vertiefung,
} from "./types";

const station1: Station = {
    id: "station-1",
    nummer: 1,
    frage: "Verändert KI meinen Job — zum Guten?",
    icon: "work",
    tags: ["Wirtschaft", "Politik"],

    subpages: {
      auftakt: {
        inhalt: "Station 1 · Subpage 1/7: Einstieg & Meinung",
        dauerMin: 3,
        lernziel:
          "Du hältst deine Ausgangshaltung zu KI und Arbeit fest, bevor du neue Informationen bekommst.",
        anleitung:
          "Beantworte die drei Fragen so, wie du heute denkst — es gibt kein Richtig oder Falsch. Klick «Weiter» nach jeder Frage.",
      },
      sonne: {
        inhalt: "Station 1 · Subpage 2/7: Sonnenseite",
        dauerMin: 5,
        lernziel:
          "Du kannst erklären, was «KI-Exposition» konkret bedeutet und warum die Demografielücke KI zur Chance macht.",
        anleitung:
          "Hör das Audiofenster an. Achte auf den Unterschied zwischen Aufgabenveränderung und Stellenabbau. Was ist dein erster Gedanke danach?",
      },
      schatten: {
        inhalt: "Station 1 · Subpage 3/7: Schattenseite",
        dauerMin: 5,
        lernziel:
          "Du kannst benennen, welche Berufsgruppen bereits konkrete Jobverluste spüren, und einordnen, warum gerade Softwareentwickler betroffen sind.",
        anleitung:
          "Schau das SRF-Video ab ca. Minute 1. Notiere eine Aussage, die dich überrascht hat — und eine, die du erwartet hättest.",
      },
      swipe: {
        inhalt: "Station 1 · Subpage 4/7: Werte-Karten",
        dauerMin: 2,
        lernziel:
          "Du schärfst deine eigene Haltung zu drei Wertaussagen rund um KI und Arbeit.",
        anleitung:
          "Wische jede Karte nach links (ablehnen) oder rechts (zustimmen). Keine Erklärung nötig — erster Impuls zählt.",
      },
      fakten: {
        inhalt: "Station 1 · Subpage 5/7: Faktencheck",
        dauerMin: 3,
        lernziel:
          "Du kennst fünf belegte Fakten zur KI-Wirkung auf den Schweizer Arbeitsmarkt und kannst verbreitete Missverständnisse korrigieren.",
        anleitung:
          "Lies jeden Fakt kurz durch. Wo weicht die Realität von deiner Erwartung ab?",
      },
      quiz: {
        inhalt: "Station 1 · Subpage 6/7: Quiz",
        dauerMin: 3,
        lernziel:
          "Du überprüfst dein Verständnis der Kernaussagen aus Sonnenseite, Schattenseite und Faktencheck.",
        anleitung:
          "Beantworte jede Frage für dich, bevor du klickst. Das Feedback erklärt, warum eine Antwort richtig oder falsch ist.",
      },
      befund: {
        inhalt: "Station 1 · Subpage 7/7: Befund & Badge",
        dauerMin: 3,
        lernziel:
          "Du vergleichst deine Haltung vor und nach der Station und formulierst in einem Satz, was du mitgenommen hast.",
        anleitung:
          "Beantworte dieselben drei Fragen wie zu Beginn — ehrlich, ohne zurückzublättern. Schreib danach deinen einen Satz.",
      },
    } satisfies StationSubpages,

    polls: [
      {
        id: "st1-leitachse",
        pollId: "st1-leitachse",
        frage: "KI verändert meinen künftigen Beruf zum Guten.",
        format: "skala4",
        optionen: [
          "trifft gar nicht zu",
          "trifft eher nicht zu",
          "trifft eher zu",
          "trifft voll zu",
        ],
        prePost: true,
        landkarteAxis: "arbeit-wirtschaft",
      },
      {
        id: "st1-poll-2",
        pollId: "st1-poll-2",
        frage: "Ich mache mir Sorgen, dass KI Stellen in meinem Berufsfeld abbaut.",
        format: "skala4",
        optionen: [
          "trifft gar nicht zu",
          "trifft eher nicht zu",
          "trifft eher zu",
          "trifft voll zu",
        ],
        prePost: true,
        landkarteAxis: "arbeit-wirtschaft",
      },
      {
        id: "st1-poll-3",
        pollId: "st1-poll-3",
        frage:
          "KI steigert vor allem die Produktivität von Menschen — sie ersetzt sie nicht.",
        format: "skala4",
        optionen: [
          "trifft gar nicht zu",
          "trifft eher nicht zu",
          "trifft eher zu",
          "trifft voll zu",
        ],
        prePost: true,
        landkarteAxis: "arbeit-wirtschaft",
      },
    ] satisfies StationPolls,

    sonnenseite: {
      intro:
        "Eine Studie von «Angestellte Schweiz» hat rund drei Millionen Schweizer Jobs auf KI-Exposition untersucht — hör rein, was die Zahlen wirklich sagen.",
      anleitung:
        "Hör das Audiofenster an. Achte dabei auf den Unterschied zwischen «Jobs unter Druck» und «Jobs, die verschwinden». Notiere dir danach, welche Berufsfelder laut Studie am stärksten betroffen sind.",
      media: [
        {
          kind: "audio",
          src: "/audio/ki-arbeitswelt.mp3",
          title: "SRF News — KI und die Arbeitswelt",
          sourceKey: "news-ki-arbeitsplätze",
          externalUrl: "https://www.srf.ch/sendungen/news/ki-und-arbeitswelt",
          start: 21,
          end: 178,
        },
      ],
    } satisfies MediaBlock,

    schattenseite: {
      intro:
        "Jetzt die andere Seite: Für manche Berufe sind die Veränderungen keine Abstraktion, sondern Alltag. Schau den 10vor10-Beitrag.",
      anleitung:
        "Schau das SRF-Video ab ca. Minute 1. Achte darauf, welche Berufsgruppe besonders betroffen ist und was die Studierenden an der FHNW sagen. Was überrascht dich — und was nicht?",
      media: [
        {
          kind: "srf",
          urn: "urn:srf:video:071a2edb-dd66-4881-a42c-e720451b1b16",
          title: "10vor10 — Putzkräfte sicherer als Softwareentwickler",
          sourceKey: "10v10-ki-informatikjob",
          externalUrl:
            "https://www.srf.ch/news/wirtschaft/arbeitsmarkt-vor-umwaelzungen-ki-und-arbeitswelt-putzkraefte-sicherer-als-softwareentwickler",
          guidance:
            "Schauen Sie ab etwa Minute 1 für rund 4 Minuten. Achten Sie besonders auf die Aussagen zur Arbeitslosigkeit von Softwareentwicklern und was Arbeitsmarktexperte Michael Siegenthaler dazu sagt.",
        },
      ],
    } satisfies MediaBlock,

    swipe: [
      {
        id: "st1-swipe-1",
        aussage:
          "Der Staat soll Firmen vorschreiben, wie sie KI im Arbeitsalltag einsetzen dürfen.",
        achse: { links: "Freiheit", rechts: "Regulierung" },
        profilKey: "regulierung-innovation",
      },
      {
        id: "st1-swipe-2",
        aussage:
          "Bei Entscheidungen, die meinen Job betreffen, soll immer ein Mensch das letzte Wort haben.",
        achse: { links: "Effizienz", rechts: "Mensch im Loop" },
        profilKey: "menschloop-effizienz",
      },
      {
        id: "st1-swipe-3",
        aussage:
          "Ich teile Arbeitsdokumente gerne mit KI-Tools, auch wenn ich nicht genau weiss, wie meine Daten verwendet werden.",
        achse: { links: "Datenschutz", rechts: "Bequemlichkeit" },
        profilKey: "datenschutz-bequemlichkeit",
      },
    ] satisfies StationSwipe,

    fakten: [
      {
        id: "st1-fakt-1",
        claim:
          "In der Schweiz weisen 28% von rund 3 Millionen untersuchten Stellen eine hohe KI-Exposition auf — das bedeutet, die Arbeitsinhalte verändern sich, nicht dass diese Stellen wegfallen.",
        figure: "~28% / >857'000 Jobs",
        sourceName: "Angestellte Schweiz / Denkfabrik einstAIn",
        sourceUrl:
          "https://www.angestellte.ch/medien/medienmitteilungen/nahezu-jeder-dritte-schweizer-job-wegen-ki-unter-druck",
        date: "2025",
      },
      {
        id: "st1-fakt-2",
        claim:
          "Büroberufe sind am stärksten betroffen: In den Bereichen Finanzen und Recht sind 72% der Berufe hoch KI-exponiert. Handwerk und Bau hingegen sind praktisch nicht betroffen.",
        figure: "72% Finanzen/Recht",
        sourceName: "SRF / Angestellte Schweiz",
        sourceUrl:
          "https://www.srf.ch/news/wirtschaft/studie-zur-arbeit-mit-ki-ki-fuehrt-zu-umwaelzung-in-der-welt-der-arbeit",
        date: "2025",
      },
      {
        id: "st1-fakt-3",
        claim:
          "In der Schweiz gehen bis 2029 rund 788'000 Personen in Pension, aber nur 640'000 treten neu ein — eine Lücke von ~148'000 Arbeitskräften, die KI helfen soll zu schliessen.",
        figure: "~148'000 fehlende Arbeitskräfte",
        sourceName: "Angestellte Schweiz / SRF",
        sourceUrl:
          "https://www.angestellte.ch/wie-ki-den-arbeitsmarkt-und-die-arbeitslosigkeit-beeinflusst",
        date: "2025",
      },
      {
        id: "st1-fakt-4",
        claim:
          "Trotz KI-Einfluss wuchs die Gesamtbeschäftigung in der Schweiz seit dem dritten Quartal 2020 um 7,4% — von einer Massenarbeitslosigkeit ist keine Spur.",
        figure: "+7,4%",
        sourceName: "Angestellte Schweiz",
        sourceUrl:
          "https://www.angestellte.ch/wie-ki-den-arbeitsmarkt-und-die-arbeitslosigkeit-beeinflusst",
        date: "2025",
      },
      {
        id: "st1-fakt-5",
        claim:
          "Bei Softwareentwicklerinnen und -entwicklern hat sich die Arbeitslosigkeit in der Schweiz in drei Jahren verdreifacht. Ende 2025 waren 2'500 von ihnen ohne Stelle — besonders betroffen sind die 20- bis 49-Jährigen.",
        figure: "×3 / 2'500 arbeitslos (Ende 2025)",
        sourceName: "KOF ETH Zürich / SRF 10vor10",
        sourceUrl:
          "https://www.srf.ch/news/wirtschaft/arbeitsmarkt-vor-umwaelzungen-ki-und-arbeitswelt-putzkraefte-sicherer-als-softwareentwickler",
        date: "2025-2026",
      },
      {
        id: "st1-fakt-6",
        claim:
          "Ökonomen sind sich uneins: Nobelpreisträger Acemoglu (MIT) schätzt den BIP-Effekt von KI über 10 Jahre auf nur 1,1–1,6%; Goldman Sachs rechnet mit +7%. Die Spannweite zeigt, wie unsicher die Lage ist.",
        figure: "1,1–1,6% vs. +7% BIP über 10 Jahre",
        sourceName: "MIT Economics / MIT Sloan",
        sourceUrl:
          "https://economics.mit.edu/news/daron-acemoglu-what-do-we-know-about-economics-ai",
        date: "2024-2025",
      },
    ] satisfies FaktenListe,

    quizPool: [
      {
        id: "st1-mc-1",
        kind: "mc",
        frage:
          "Was sagt die Studie von «Angestellte Schweiz» zu den rund 28% der untersuchten Schweizer Stellen?",
        optionen: [
          {
            label: "Ihre Arbeitsinhalte verändern sich durch KI.",
            feedback:
              "Richtig. Die Studie spricht von «KI-Exposition» — die Arbeit verändert sich, aber Stellen fallen nicht automatisch weg.",
          },
          {
            label:
              "Diese Stellen werden mittelfristig vollständig durch KI ersetzt und fallen weg, weil Unternehmen nur noch Kosten sparen wollen.",
            feedback:
              "Falsch. «Exposition» bedeutet Veränderung von Aufgaben, nicht Abbau von Stellen. Ausserdem greift «nur Kosten sparen» zu kurz.",
          },
          {
            label:
              "Sie sind ausschliesslich im Handwerk und in der Pflege zu finden.",
            feedback:
              "Falsch. Handwerk und Pflege gehören zu den am wenigsten betroffenen Bereichen; am stärksten betroffen sind Büroberufe.",
          },
          {
            label: "Nur Lernende und Berufseinsteiger sind betroffen.",
            feedback:
              "Falsch. Alle Altersgruppen in Büroberufen sind betroffen; Softwareentwickler 20–49 Jahre besonders stark.",
          },
        ],
        correctIndices: [0],
      },
      {
        id: "st1-mc-2",
        kind: "mc",
        frage:
          "Welcher Berufsbereich ist laut der «Angestellte Schweiz»-Studie am stärksten von KI betroffen?",
        optionen: [
          {
            label: "Handwerk und Bau",
            feedback:
              "Falsch. Diese Berufe sind praktisch nicht von KI-Exposition betroffen, weil körperliche Fähigkeiten und räumliches Urteilen gefragt sind.",
          },
          {
            label: "Gesundheit und Pflege",
            feedback:
              "Falsch. Pflege ist ebenfalls gering betroffen — menschliche Zuwendung und haptische Arbeit sind für KI schwer automatisierbar.",
          },
          {
            label: "Finanzen und Recht",
            feedback:
              "Richtig. In Finanzen und Recht sind bis zu 72% der Berufe hoch KI-exponiert; typisch sind text- und datenbasierte Arbeitsschritte.",
          },
          {
            label: "Gastronomie und Tourismus",
            feedback:
              "Falsch. Gastgewerbe setzt auf physische Dienstleistungen und direkten Kundenkontakt, die KI (noch) nicht ersetzen kann.",
          },
        ],
        correctIndices: [2],
      },
      {
        id: "st1-mc-3",
        kind: "mc",
        frage:
          "Warum sehen viele Fachleute die demografische Lücke in der Schweiz als Argument dafür, KI als Chance zu betrachten?",
        optionen: [
          {
            label:
              "Weil KI günstige Arbeitskräfte aus dem Ausland überflüssig macht",
            feedback:
              "Falsch. Das Argument betrifft den Demografierückgang bei Pensionierten, nicht Konkurrenz aus dem Ausland.",
          },
          {
            label:
              "Weil KI die Produktivität steigern und so die fehlenden Arbeitskräfte teilweise kompensieren kann",
            feedback:
              "Richtig. Bis 2029 entsteht eine Lücke von ~148'000 Arbeitskräften; KI-gestützte Produktivitätsgewinne können das abfedern.",
          },
          {
            label:
              "Weil KI alle Rentner ersetzen und gleichzeitig die Sozialversicherungen sanieren wird, was die Lohnkosten für Firmen um bis zu 40% senkt",
            feedback:
              "Falsch und übertrieben. KI kann Lücken mildern, nicht alle Rentner ersetzen — und keine seriöse Studie nennt 40% Lohnkostenreduktion.",
          },
          {
            label: "Weil junge Menschen keine Lust auf Büroarbeit haben",
            feedback:
              "Falsch. Die Lücke entsteht durch Pensionierungen, nicht durch mangelnde Arbeitsmotivation.",
          },
        ],
        correctIndices: [1],
      },
      {
        id: "st1-mc-4",
        kind: "mc",
        frage:
          "Bei welcher Berufsgruppe hat sich die Arbeitslosigkeit in der Schweiz innerhalb von drei Jahren verdreifacht?",
        optionen: [
          {
            label: "Köchinnen und Köche",
            feedback:
              "Falsch. Gastroberufe sind von KI wenig betroffen; ihr Beschäftigungsniveau blieb stabil.",
          },
          {
            label: "Pflegefachpersonen",
            feedback:
              "Falsch. Pflege hat im Gegenteil Fachkräftemangel; KI gilt hier als Unterstützung, nicht als Konkurrenz.",
          },
          {
            label: "Softwareentwicklerinnen und -entwickler",
            feedback:
              "Richtig. Laut KOF-ETH-Daten verdreifachte sich die Arbeitslosigkeit in dieser Gruppe; Ende 2025 waren 2'500 arbeitslos.",
          },
          {
            label: "Journalistinnen und Journalisten bei regionalen Tageszeitungen",
            feedback:
              "Falsch. Journalismus ist zwar ebenfalls KI-exponiert, aber der 10vor10-Bericht nennt die Verdreifachung konkret für Softwareentwickler.",
          },
        ],
        correctIndices: [2],
      },
      {
        id: "st1-mc-5",
        kind: "mc",
        frage:
          "Wie weit gehen die wirtschaftswissenschaftlichen Prognosen zur BIP-Wirkung von KI über 10 Jahre auseinander?",
        optionen: [
          {
            label: "Alle Ökonomen sind sich einig: +7%",
            feedback:
              "Falsch. Die Meinungen gehen stark auseinander; Goldman Sachs schätzt +7%, Acemoglu (MIT) nur +1,1%.",
          },
          {
            label:
              "Von rund +1% (skeptische Schätzung) bis rund +7% (optimistische Schätzung)",
            feedback:
              "Richtig. Acemoglu schätzt 1,1–1,6%, Goldman Sachs 7% — ein Faktor von 5 bis 7.",
          },
          {
            label:
              "Die Wirkung ist so marginal, dass sie in keiner ernsthaften Studie mehr gemessen wird",
            feedback:
              "Falsch. Viele seriöse Studien messen oder schätzen KI-BIP-Effekte; die Spannweite ist gross, aber das Interesse ist hoch.",
          },
          {
            label:
              "KI wird das globale BIP in 10 Jahren um mehr als 25% steigern — darin sind alle Institutionen einig, und der Effekt ist bereits in den Börsenkursen eingepreist",
            feedback:
              "Falsch. Keine seriöse BIP-Schätzung kommt auf +25% über 10 Jahre, und «alle einig» ist falsch — der Dissens zwischen Acemoglu und Goldman Sachs ist fundamental.",
          },
        ],
        correctIndices: [1],
      },
      {
        id: "st1-tf-1",
        kind: "tf",
        aussage: "Fast jeder dritte Schweizer Job ist stark von KI betroffen.",
        correctAnswer: true,
        feedbackRichtig:
          "Genau. 28% von 3 Mio. untersuchten Stellen entspricht fast jedem dritten Job. «Betroffen» heisst: die Arbeitsinhalte verändern sich — nicht dass Stellen wegfallen.",
        feedbackFalsch:
          "Das stimmt tatsächlich. Die Studie von «Angestellte Schweiz» (2025) ermittelte 28% KI-exponierte Stellen — die Formulierung «fast jeder dritte Job» ist korrekt.",
      },
      {
        id: "st1-tf-2",
        kind: "tf",
        aussage: "KI hat bisher zu Massenarbeitslosigkeit in der Schweiz geführt.",
        correctAnswer: false,
        feedbackRichtig:
          "Richtig verneint. Die Gesamtbeschäftigung in der Schweiz ist seit Q3 2020 sogar um 7,4% gestiegen — von Massenarbeitslosigkeit keine Spur.",
        feedbackFalsch:
          "Falsch. Trotz KI-Einfluss wuchs die Schweizer Gesamtbeschäftigung seit Q3 2020 um 7,4%. Bestimmte Gruppen (z.B. Softwareentwickler) sind stärker betroffen, aber das ist kein Massenphänomen.",
      },
      {
        id: "st1-tf-3",
        kind: "tf",
        aussage:
          "Alle Wirtschaftsforschenden sind sich einig, dass KI riesige Produktivitätsgewinne bringen wird.",
        correctAnswer: false,
        feedbackRichtig:
          "Stimmt — dieser Konsens existiert nicht. Acemoglu (MIT) schätzt nur +1,1% BIP über 10 Jahre und warnt vor steigender Ungleichheit; Goldman Sachs erwartet +7%. Seriöse Ökonomen sind tief gespalten.",
        feedbackFalsch:
          "Falsch. Die Forschung ist alles andere als einig. Nobelpreisträger Acemoglu (MIT) hält die BIP-Gewinne für minimal; Goldman Sachs sieht sie als riesig. Die Spannweite zeigt, wie unsicher die Datenlage ist.",
      },
    ] satisfies QuizPool,

    reflexion:
      "In der Arbeitswelt nützt KI vor allem …, gefährlich wird sie, wenn …",

    badges: [
      { familie: "wirtschaft", anzahl: 2 },
      { familie: "gesellschaft", anzahl: 1 },
    ] satisfies StationBadges,
  };

const station2: Station = {
    id: "station-2",
    nummer: 2,
    frage: "Kann ich noch glauben, was ich höre und sehe?",
    icon: "visibility",
    tags: ["Technologie", "Gesellschaft", "Recht"],

    subpages: {
      auftakt: {
        inhalt: "Station 2 · Subpage 1/7: Einstieg & Ausgangsmeinung",
        dauerMin: 3,
        lernziel:
          "Du hältst deine aktuelle Einschätzung zur Erkennbarkeit von KI-Fälschungen fest.",
        anleitung:
          "Beantworte drei kurze Fragen — es gibt kein Richtig oder Falsch, wir möchten wissen, was du jetzt denkst.",
      },
      sonne: {
        inhalt: "Station 2 · Subpage 2/7: Sonnenseite — Familien entlarven Fakes",
        dauerMin: 6,
        lernziel:
          "Du erkennst, dass Skepsis, Austausch und unterschiedliche Generationenkompetenzen zusammen Fälschungen sichtbar machen können.",
        anleitung:
          "Schau das Video-Experiment (ca. 4 Min.). Achte darauf, welche Strategie den Familien am meisten hilft, Fakes zu durchschauen. Beantworte danach die Frage im Beobachtungsauftrag.",
      },
      schatten: {
        inhalt: "Station 2 · Subpage 3/7: Schattenseite — Stimmklon in Sekunden",
        dauerMin: 5,
        lernziel:
          "Du verstehst, wie schnell eine Stimme geklont werden kann, und weisst von einem realen Schweizer Betrugsfall.",
        anleitung:
          "Hör den Audiobeitrag (ca. 2 Min.). Achte darauf, wie viele Schritte Luzi Sennhauser braucht, um die Stimme des Reporters zu kopieren. Überlege danach: Hätte mich dieser Anruf getäuscht?",
      },
      swipe: {
        inhalt: "Station 2 · Subpage 4/7: Deine Haltung — drei Aussagen",
        dauerMin: 2,
        lernziel:
          "Du schärfst dein Werte-Profil zu Regulierung, Medien und Datenschutz.",
        anleitung:
          "Wische für jede Aussage nach rechts (stimme zu) oder nach links (lehne ab). Kein Richtig oder Falsch — es geht um deine Haltung.",
      },
      fakten: {
        inhalt: "Station 2 · Subpage 5/7: Was die Forschung sagt",
        dauerMin: 3,
        lernziel:
          "Du kennst fünf belegte Fakten zu Deepfakes, Stimmklon-Betrug und Falschnachrichten.",
        anleitung:
          "Lies jede Faktenkarte durch. Du musst nichts eingeben — das Gehörte wird durch reale Zahlen und Quellen eingeordnet.",
      },
      quiz: {
        inhalt: "Station 2 · Subpage 6/7: Kurzes Quiz",
        dauerMin: 3,
        lernziel:
          "Du überprüfst dein Verständnis zu Deepfakes, Stimmklon und Falschnachrichten.",
        anleitung:
          "Beantworte die restlichen Fragen — eine nach der anderen. Du erhältst sofort Rückmeldung. Die Fragen sind gepunktet, aber kein Zeugnis.",
      },
      befund: {
        inhalt: "Station 2 · Subpage 7/7: Befund & Badge",
        dauerMin: 3,
        lernziel:
          "Du vergleichst deine aktuelle Meinung mit deiner Ausgangsmeinung und formulierst deinen persönlichen Befund in einem Satz.",
        anleitung:
          "Beantworte nochmals die drei Fragen vom Anfang — und sieh, ob sich etwas verschoben hat. Schreib danach deinen Satz. Du erhältst drei Badges.",
      },
    } satisfies StationSubpages,

    polls: [
      {
        id: "st2-leitachse",
        pollId: "st2-leitachse",
        frage: "Ich traue mir zu, KI-Fälschungen zu erkennen.",
        format: "skala4",
        optionen: [
          "trifft gar nicht zu",
          "trifft eher nicht zu",
          "trifft eher zu",
          "trifft voll zu",
        ],
        prePost: true,
        landkarteAxis: "medien-wahrheit",
      },
      {
        id: "st2-poll-2",
        pollId: "st2-poll-2",
        frage: "Ich prüfe Inhalte, bevor ich sie in sozialen Medien teile.",
        format: "skala4",
        optionen: [
          "trifft gar nicht zu",
          "trifft eher nicht zu",
          "trifft eher zu",
          "trifft voll zu",
        ],
        prePost: true,
        landkarteAxis: "medien-wahrheit",
      },
      {
        id: "st2-poll-3",
        pollId: "st2-poll-3",
        frage:
          "Ich mache mir Sorgen, durch eine geklonte Stimme betrogen zu werden.",
        format: "skala4",
        optionen: [
          "trifft gar nicht zu",
          "trifft eher nicht zu",
          "trifft eher zu",
          "trifft voll zu",
        ],
        prePost: true,
        landkarteAxis: "medien-wahrheit",
      },
    ] satisfies StationPolls,

    sonnenseite: {
      intro:
        "Drei Schweizer Familien stellen ihre Fähigkeit auf die Probe, echte von gefälschten Inhalten zu unterscheiden — und merken, dass Skepsis und Gespräch mehr helfen als Technik allein.",
      anleitung:
        "Schau ab Minute 13:52 bis ca. 18:30. Achte darauf, welche Strategie den Familien hilft, Fakes zu entlarven. Überlege danach: Was würde dir in deinem Alltag helfen?",
      media: [
        {
          kind: "youtube",
          youtubeId: "3W3HoK1f7nU",
          title: "Einstein — What the Fake",
          sourceKey: "einstein-what-the-fake",
          externalUrl: "https://www.youtube.com/watch?v=3W3HoK1f7nU",
          start: 832,
          end: 1110,
        },
      ],
    } satisfies MediaBlock,

    schattenseite: {
      intro:
        "Ein Zürcher Cybersicherheits-Experte zeigt live, wie er mit wenigen Klicks die Stimme eines SRF-Reporters klont — und erklärt, wie Betrüger dasselbe nutzen, um Millionen zu ergaunern.",
      anleitung:
        "Hör ab Minute 13:36 bis ca. 15:50. Achte darauf, wie wenige Schritte Luzi Sennhauser braucht. Was überrascht dich? Was macht diesen Angriff so schwer erkennbar?",
      media: [
        {
          kind: "audio",
          src: "https://download-media.srf.ch/world/audio/Regionaljournal-Zuerich-Schaffhausen-radio/2026/03/deepfake.MP3",
          title: "SRF Regionaljournal — Geklonte Stimmen",
          sourceKey: "newsjournal-stimme-klonen",
          externalUrl:
            "https://www.srf.ch/news/schweiz/gefahr-aus-dem-telefonhoerer-geklonte-stimmen-so-geht-eine-zuercher-firma-gegen-ki-gauner-vor",
          start: 816,
          end: 950,
        },
      ],
    } satisfies MediaBlock,

    swipe: [
      {
        id: "st2-swipe-1",
        aussage:
          "Plattformen wie TikTok und Instagram sollten gesetzlich verpflichtet werden, KI-generierte Inhalte zu kennzeichnen.",
        achse: { links: "Freiwilligkeit reicht", rechts: "Gesetz nötig" },
        profilKey: "regulierung-innovation",
      },
      {
        id: "st2-swipe-2",
        aussage:
          "Beim Entlarven von Fakes ist mein gesunder Menschenverstand wichtiger als jedes KI-Werkzeug.",
        achse: { links: "KI entscheidet", rechts: "Mensch entscheidet" },
        profilKey: "menschloop-effizienz",
      },
      {
        id: "st2-swipe-3",
        aussage:
          "Ich akzeptiere, dass Online-Plattformen meine Daten nutzen, solange ich dafür kostenlose Dienste bekomme.",
        achse: { links: "Datenschutz zuerst", rechts: "Bequemlichkeit zuerst" },
        profilKey: "datenschutz-bequemlichkeit",
      },
    ] satisfies StationSwipe,

    fakten: [
      {
        id: "st2-fakt-1",
        claim:
          "Schon 3 Sekunden Audio reichen, um eine Stimme mit 85 % Übereinstimmung zu klonen.",
        figure: "3 Sek. → 85 %, bis 95 % mit mehr Datenmaterial",
        sourceName: "McAfee «The Artificial Imposter», 2023",
        sourceUrl:
          "https://www.mcafee.com/blogs/privacy-identity-protection/artificial-imposters-cybercriminals-turn-to-ai-voice-cloning-for-a-new-breed-of-scam/",
        date: "2023",
      },
      {
        id: "st2-fakt-2",
        claim:
          "Der Ingenieurkonzern Arup verlor 2024 rund 25,6 Mio. $ durch einen Deepfake-Videocall — alle Teilnehmenden ausser dem Opfer waren KI-generiert.",
        figure: "200 Mio. HK$ / ≈ 25,6 Mio. $ — 15 Transaktionen",
        sourceName: "CNN Business, Mai 2024",
        sourceUrl:
          "https://edition.cnn.com/2024/05/16/tech/arup-deepfake-scam-loss-hong-kong-intl-hnk",
        date: "2024-05",
      },
      {
        id: "st2-fakt-3",
        claim:
          "Falschnachrichten verbreiten sich auf Twitter (X) weiter, schneller und tiefer als wahre Nachrichten — schuld sind in erster Linie Menschen, nicht Bots.",
        figure:
          "~126 000 Stories, von ~3 Mio. Menschen 4,5 Mio.-mal geteilt (2006–2017)",
        sourceName: "Vosoughi, Roy & Aral, Science, 9. März 2018",
        sourceUrl: "https://www.science.org/doi/10.1126/science.aap9559",
        date: "2018-03-09",
      },
      {
        id: "st2-fakt-4",
        claim:
          "Die EU-KI-Verordnung (Art. 50) verlangt ab dem 2. August 2026, dass KI-generierte Inhalte und Deepfakes klar gekennzeichnet werden — Bussen bis 15 Mio. € oder 3 % des Umsatzes.",
        figure: "Bussen bis 15 Mio. € / 3 % weltweiter Jahresumsatz",
        sourceName: "EU Artificial Intelligence Act, Art. 50; Greenberg Traurig, Juni 2026",
        sourceUrl: "https://artificialintelligenceact.eu/article/50/",
        date: "2026-08-02",
      },
      {
        id: "st2-fakt-5",
        claim:
          "In Tests erkannten Menschen KI-generierte Stimmen nur in rund 60 % der Fälle korrekt — kaum besser als der Zufall.",
        figure: "~60 % Trefferquote (Zufall wäre 50 %)",
        sourceName: "arXiv «The Age of Sensorial Zero Trust», 2025",
        sourceUrl: "https://arxiv.org/pdf/2507.00907",
        date: "2025",
      },
      {
        id: "st2-fakt-6",
        claim:
          "1 von 4 befragten Erwachsenen hat selbst einen Stimmklon-Betrug erlebt oder kennt jemanden, dem das passiert ist — 77 % der Betroffenen verloren Geld.",
        figure: "25 % betroffen; 77 % Geldverlust",
        sourceName: "McAfee / MSI Research, April 2023 (n = 7 054, 7 Länder)",
        sourceUrl:
          "https://www.mcafee.com/blogs/privacy-identity-protection/artificial-imposters-cybercriminals-turn-to-ai-voice-cloning-for-a-new-breed-of-scam/",
        date: "2023",
      },
    ] satisfies FaktenListe,

    quizPool: [
      {
        id: "st2-mc-1",
        kind: "mc",
        frage:
          "Was braucht ein Angreifer minimal, um eine Stimme überzeugend zu klonen?",
        optionen: [
          {
            label: "3 Sekunden Audioaufnahme",
            feedback:
              "Richtig — McAfee 2023: schon 3 Sek. reichen für 85 % Übereinstimmung.",
          },
          {
            label:
              "Mindestens eine Stunde Studio-Aufnahme in professioneller Qualität.",
            feedback:
              "Falsch — diese Anforderung galt früher für Sprachsynthese, nicht für modernes Voice Cloning.",
          },
          {
            label: "Ein vollständiges Lautinventar (alle Phoneme) der Zielstimme.",
            feedback:
              "Falsch — moderne Modelle brauchen keinen vollständigen Lautsatz.",
          },
          {
            label: "Die explizite Zustimmung der geklonten Person.",
            feedback:
              "Falsch — technisch ist keine Zustimmung nötig; das Fehlen ist ja das Problem.",
          },
        ],
        correctIndices: [0],
      },
      {
        id: "st2-mc-2",
        kind: "mc",
        frage:
          "Wie viel verlor der Ingenieurkonzern Arup 2024 durch einen Deepfake-Videocall?",
        optionen: [
          {
            label: "Rund 2,5 Mio. $",
            feedback:
              "Falsch — zu tief; der tatsächliche Schaden war zehnmal höher.",
          },
          {
            label: "Rund 25,6 Mio. $",
            feedback:
              "Richtig — 200 Mio. HK$, entspricht ca. 25,6 Mio. $. Ausser dem Opfer waren alle Videocall-Teilnehmenden KI-generiert.",
          },
          {
            label: "Rund 250 Mio. $",
            feedback:
              "Falsch — zu hoch; der Betrag war eine Grössenordnung kleiner.",
          },
          {
            label: "Rund 500 000 $ — ein Phishing-Schaden in üblicher Grösse",
            feedback:
              "Falsch — dieser Videocall-Betrug war aussergewöhnlich gross.",
          },
        ],
        correctIndices: [1],
      },
      {
        id: "st2-mc-3",
        kind: "mc",
        frage:
          "Was zeigte die Science-Studie (Vosoughi et al. 2018) über die Verbreitung von Falschnachrichten?",
        optionen: [
          {
            label:
              "Wahre Nachrichten und Falschnachrichten verbreiten sich ungefähr gleich schnell.",
            feedback:
              "Falsch — die Studie zeigte eindeutige Unterschiede zugunsten der Falschnachrichten.",
          },
          {
            label:
              "Bots sind die Haupttreiber der Verbreitung von Falschnachrichten.",
            feedback:
              "Falsch — die Studie kam zum gegenteiligen Schluss: Menschen, nicht Bots, verbreiten Falsches schneller.",
          },
          {
            label:
              "Falschnachrichten verbreiten sich schneller und weiter, primär durch Menschen, nicht Bots.",
            feedback:
              "Richtig — Falsches ist oft neu und überraschend, was Menschen zum Teilen verleitet.",
          },
          {
            label:
              "Politische Falschnachrichten breiten sich deutlich langsamer aus als harmlose Fakes aus dem Unterhaltungsbereich.",
            feedback:
              "Falsch — politische Falschmeldungen waren laut der Studie besonders viral.",
          },
        ],
        correctIndices: [2],
      },
      {
        id: "st2-mc-4",
        kind: "mc",
        frage:
          "Was verlangt die EU-KI-Verordnung (Art. 50) ab August 2026 für Deepfakes?",
        optionen: [
          {
            label: "Deepfakes werden in der EU vollständig verboten.",
            feedback:
              "Falsch — verboten werden sie nicht, aber sie müssen als KI-generiert gekennzeichnet sein.",
          },
          {
            label:
              "Deepfakes müssen klar als KI-generiert gekennzeichnet werden.",
            feedback:
              "Richtig — Transparenz ist Pflicht; Verstösse können mit bis zu 15 Mio. € oder 3 % des Umsatzes gebüsst werden.",
          },
          {
            label:
              "Plattformen müssen vor dem Hochladen jedes Deepfakes eine Behördengenehmigung einholen.",
            feedback:
              "Falsch — eine Vorab-Genehmigung sieht das EU AI Act nicht vor; die Pflicht liegt beim Kennzeichnen, nicht beim Erlauben.",
          },
          {
            label:
              "Die Kennzeichnungspflicht gilt nur für staatliche Akteure.",
            feedback:
              "Falsch — sie gilt für alle Anbieter und Nutzer, die Inhalte veröffentlichen.",
          },
        ],
        correctIndices: [1],
      },
      {
        id: "st2-mc-5",
        kind: "mc",
        frage:
          "Wie gut erkennen Menschen KI-generierte Stimmen laut neueren Tests?",
        optionen: [
          {
            label: "Sehr gut — über 90 % der Fälle korrekt.",
            feedback:
              "Falsch — Menschen überschätzen ihre Fähigkeit; die Trefferquote liegt deutlich tiefer.",
          },
          {
            label: "Kaum besser als der Zufall — rund 60 % korrekt.",
            feedback:
              "Richtig — da der Zufall 50 % wäre, ist der Vorsprung minimal (arXiv 2025).",
          },
          {
            label: "Gut — rund 80 % korrekt.",
            feedback:
              "Falsch — auch 80 % wäre überschätzt; reale Tests zeigen tiefere Werte.",
          },
          {
            label:
              "Gar nicht — sie scheitern in über 80 % der Fälle, weil Stimmen heute perfekt klingen und keinerlei wahrnehmbare Artefakte mehr hinterlassen, die das menschliche Ohr registrieren könnte.",
            feedback:
              "Falsch und zu pessimistisch — rund 60 % richtig liegt über dem Zufall; vollständig unerkennbar sind Klon-Stimmen (noch) nicht.",
          },
        ],
        correctIndices: [1],
      },
      {
        id: "st2-tf-1",
        kind: "tf",
        aussage:
          "Stimmklonen braucht stundenlanges Studio-Aufnahmen in professioneller Qualität.",
        correctAnswer: false,
        feedbackRichtig:
          "Richtig — es reichen schon 3 Sekunden Audio, z. B. ein kurzer Social-Media-Clip (McAfee 2023).",
        feedbackFalsch:
          "Falsch — diese Anforderung gehört der Vergangenheit an. Moderne KI-Modelle klonen eine Stimme aus wenigen Sekunden Audioaufnahme.",
      },
      {
        id: "st2-tf-2",
        kind: "tf",
        aussage:
          "Falschnachrichten verbreiten sich auf sozialen Medien schneller als wahre Nachrichten.",
        correctAnswer: true,
        feedbackRichtig:
          "Richtig — die bahnbrechende Science-Studie (Vosoughi et al. 2018) zeigte: Falsches ist oft neu und überraschend — das verleitet Menschen zum Teilen.",
        feedbackFalsch:
          "Falsch — die Studie zeigte das Gegenteil: Falschnachrichten werden schneller und weiter geteilt. Verantwortlich sind in erster Linie Menschen, nicht Bots.",
      },
      {
        id: "st2-tf-3",
        kind: "tf",
        aussage:
          "Hauptsächlich Bots verbreiten Falschnachrichten auf sozialen Medien.",
        correctAnswer: false,
        feedbackRichtig:
          "Richtig — die Science-Studie (2018) ergab: Menschen, nicht automatisierte Programme, sind der Haupttreiber. Falschnachrichten sind oft neu und überraschend — das reizt zum Teilen.",
        feedbackFalsch:
          "Falsch — die vielzitierte Studie stellte fest, dass Menschen Falschnachrichten schneller verbreiten als Bots. Bots spielen eine Rolle, sind aber nicht die Hauptursache.",
      },
    ] satisfies QuizPool,

    reflexion:
      "Bei Medien hilft mir KI, indem …, sie bedroht mich, indem …",

    badges: [
      { familie: "tech", anzahl: 1 },
      { familie: "gesellschaft", anzahl: 1 },
      { familie: "ethik", anzahl: 1 },
    ] satisfies StationBadges,
  };

const station3: Station = {
  id: "station-3",
  nummer: 3,
  frage: "Macht KI mich klüger oder fauler?",
  icon: "psychology",
  tags: ["Individuum", "Psyche", "Bildung"],

  subpages: {
    auftakt: {
      inhalt: "Station 3 · Macht KI mich klüger oder fauler? — Einstieg & Meinung",
      dauerMin: 3,
      lernziel: "Du hältst fest, wie du KI heute beim Lernen und Denken erlebst.",
      anleitung:
        "Beantworte die drei Fragen ehrlich — kein richtig oder falsch, nur deine aktuelle Einschätzung. Klicke danach auf «Weiter».",
    } satisfies SubpageBanner,
    sonne: {
      inhalt: "Station 3 · Sonnenseite — Lisa baut ihre eigene KI",
      dauerMin: 5,
      lernziel:
        "Du erkennst, wie selbst Bauen mit KI echtes Lernen und Selbstwirksamkeit fördern kann.",
      anleitung:
        "Schau das Kurzporträt von Lisa (18) vom ETH AI Center (ca. 2 Min. 30 Sek.). Achte darauf, was sie über ihren Lernprozess sagt — nicht das Produkt, sondern der Weg. Halte danach einen Satz fest: Was hat Lisa gelernt, das sie ohne das Bauen nie gelernt hätte?",
    } satisfies SubpageBanner,
    schatten: {
      inhalt: "Station 3 · Schattenseite — Zuckerflash statt Tiefenspur",
      dauerMin: 5,
      lernziel:
        "Du verstehst, warum KI-Prompting weniger Hirnaktivierung auslöst als eigenes Schreiben — und was das für deine Erinnerung bedeutet.",
      anleitung:
        "Schau den Auswertungs-Abschnitt mit Hirnforscherin Barbara Studer (ca. 2 Min. 20 Sek.). Achte besonders auf den Moment, in dem Tobias gesteht: «Ich fühle nichts». Frage dich: Kenne ich dieses Gefühl? Klicke danach auf «Weiter».",
    } satisfies SubpageBanner,
    swipe: {
      inhalt: "Station 3 · Werte — Was denkst du über KI und eigenes Denken?",
      dauerMin: 2,
      lernziel: "Du schärfst dein Werteprofil zu Selbstständigkeit, Effizienz und Lernen.",
      anleitung:
        "Drei Aussagen — links ablehnen, rechts zustimmen. Es gibt kein richtig oder falsch.",
    } satisfies SubpageBanner,
    fakten: {
      inhalt: "Station 3 · Faktencheck — Was die Forschung wirklich sagt",
      dauerMin: 3,
      lernziel:
        "Du kannst die MIT-Hirnstudie korrekt einordnen und weisst, was sie beweist — und was nicht.",
      anleitung:
        "Lies jeden Fakt aufmerksam. Bei Fakt 2 und 3 ist Genauigkeit besonders wichtig: Vorsicht vor vereinfachten Schlagzeilen. Klicke nach jedem Fakt auf «Weiter».",
    } satisfies SubpageBanner,
    quiz: {
      inhalt: "Station 3 · Quiz — 5 Fragen zum Thema KI & Denken",
      dauerMin: 3,
      lernziel:
        "Du überprüfst dein Verständnis zu Hirnaktivierung, Studienmethodik und kognitivem Lernen.",
      anleitung:
        "Wähle die beste Antwort. Du erhältst nach jeder Frage Feedback, warum sie richtig oder falsch ist.",
    } satisfies SubpageBanner,
    befund: {
      inhalt: "Station 3 · Befund — Deine Meinung jetzt",
      dauerMin: 3,
      lernziel:
        "Du vergleichst deine Einschätzung vor und nach der Station und formulierst einen persönlichen Satz.",
      anleitung:
        "Beantworte dieselben drei Fragen wie am Anfang. Dann schreib deinen einen Satz und hol dir dein Badge.",
    } satisfies SubpageBanner,
  },

  polls: [
    {
      id: "st3-leitachse",
      pollId: "st3-leitachse",
      format: "skala4",
      frage: "KI macht mich auf Dauer klüger.",
      optionen: [
        "trifft gar nicht zu",
        "trifft eher nicht zu",
        "trifft eher zu",
        "trifft voll zu",
      ],
      landkarteAxis: "lernen-mensch",
      prePost: true,
    } satisfies PollSkala4,
    {
      id: "st3-poll-2",
      pollId: "st3-poll-2",
      format: "skala4",
      frage: "Ich merke mir Dinge schlechter, wenn KI sie mir abnimmt.",
      optionen: [
        "trifft gar nicht zu",
        "trifft eher nicht zu",
        "trifft eher zu",
        "trifft voll zu",
      ],
      landkarteAxis: "lernen-mensch",
      prePost: true,
    } satisfies PollSkala4,
    {
      id: "st3-poll-3",
      pollId: "st3-poll-3",
      format: "skala4",
      frage: "Texte und Ideen will ich lieber selbst formulieren, auch wenn es länger dauert.",
      optionen: [
        "trifft gar nicht zu",
        "trifft eher nicht zu",
        "trifft eher zu",
        "trifft voll zu",
      ],
      landkarteAxis: "lernen-mensch",
      prePost: true,
    } satisfies PollSkala4,
  ],

  sonnenseite: {
    intro:
      "KI muss nicht passiv konsumiert werden — man kann sie selbst bauen. Lisa (18) zeigt, wie das Entwickeln einer eigenen KI mehr Lernen auslöst als jedes Prompting.",
    anleitung:
      "Schau den Ausschnitt (ca. 2 Min. 30 Sek.). Achte darauf, was Lisa über den Prozess — nicht das Produkt — sagt. Frage dich danach: Was hat sie gelernt, das sie ohne das Bauen nie gelernt hätte?",
    media: [
      {
        kind: "youtube",
        youtubeId: "U5bLCVTr9_I",
        title: "Einstein — KI im Kopf",
        sourceKey: "einstein-ki-im-kopf",
        externalUrl: "https://www.youtube.com/watch?v=U5bLCVTr9_I",
        start: 694,
        end: 840,
      },
    ],
  } satisfies MediaBlock,

  schattenseite: {
    intro:
      "Zwei Wochen nach dem Experiment: Wer hat den eigenen Text im Kopf — und wer nicht? Das Ergebnis überrascht.",
    anleitung:
      "Schau den Auswertungs-Abschnitt (ca. 2 Min. 20 Sek.). Achte besonders auf den Moment, in dem Tobias gesteht: «Ich fühle nichts». Frage dich: Kenne ich dieses Gefühl?",
    media: [
      {
        kind: "youtube",
        youtubeId: "U5bLCVTr9_I",
        title: "Einstein — KI im Kopf",
        sourceKey: "einstein-ki-im-kopf",
        externalUrl: "https://www.youtube.com/watch?v=U5bLCVTr9_I",
        start: 1917,
        end: 2056,
      },
    ],
  } satisfies MediaBlock,

  swipe: [
    {
      id: "st3-swipe-1",
      aussage:
        "KI darf mir das Schreiben von Texten vollständig abnehmen — Hauptsache, das Ergebnis stimmt.",
      achse: { links: "Eigenleistung zählt", rechts: "Ergebnis zählt" },
      profilKey: "menschloop-effizienz",
    } satisfies SwipeKarte,
    {
      id: "st3-swipe-2",
      aussage:
        "Schulen sollten KI-Hilfsmittel erst dann einsetzen, wenn Kinder grundlegende Denkfähigkeiten aufgebaut haben.",
      achse: { links: "Früher Einsatz", rechts: "Erst Grundlagen" },
      profilKey: "regulierung-innovation",
    } satisfies SwipeKarte,
    {
      id: "st3-swipe-3",
      aussage:
        "Ich bin bereit, meine persönlichen Texte und Fragen an einen kommerziellen Chatbot weiterzugeben.",
      achse: { links: "Datenschutz geht vor", rechts: "Bequemlichkeit geht vor" },
      profilKey: "datenschutz-bequemlichkeit",
    } satisfies SwipeKarte,
  ],

  fakten: [
    {
      id: "st3-fakt-1",
      claim:
        "Wer einen Text ohne jegliche Hilfsmittel selbst schreibt, zeigt laut einem Experiment der Hirnforscherin Barbara Studer etwa 15-mal mehr Hirnaktivierung als jemand, der einen Prompt tippt und das Ergebnis von ChatGPT entgegennimmt.",
      figure: "~15×",
      sourceName: "SRF Einstein — «KI im Kopf» (2025)",
      sourceUrl: "https://www.youtube.com/watch?v=U5bLCVTr9_I",
      date: "2025",
    } satisfies FaktencheckFakt,
    {
      id: "st3-fakt-2",
      claim:
        "Eine MIT-Studie («Your Brain on ChatGPT») fand per EEG, dass ChatGPT-Nutzende beim Essay-Schreiben die schwächste Hirnkonnektivität zeigten. Wichtig: Es handelt sich um einen Preprint (noch nicht peer-reviewed), mit nur 54 Teilnehmenden, einer Aufgabe und einem Tool. Die Autorinnen warnen ausdrücklich vor Schlagzeilen wie «ChatGPT macht dumm» — das behauptet die Studie nicht.",
      figure: "n=54, Preprint arXiv:2506.08872",
      sourceName: "MIT Media Lab, «Your Brain on ChatGPT» (Juni 2025)",
      sourceUrl: "https://media.mit.edu/publications/your-brain-on-chatgpt/",
      date: "2025-06",
    } satisfies FaktencheckFakt,
    {
      id: "st3-fakt-3",
      claim:
        "ChatGPT-Nutzende konnten ihre eigenen Texte nach kurzer Zeit deutlich schlechter zitieren und empfanden weniger «Eigentum» an ihren Formulierungen — das deckt sich mit dem Ergebnis des Einstein-Experiments, in dem Tobias zwei Wochen später keinen einzigen Satz seines KI-generierten Textes erinnern konnte.",
      sourceName: "MIT Media Lab (2025) + SRF Einstein (2025)",
      sourceUrl: "https://media.mit.edu/projects/your-brain-on-chatgpt/overview/",
      date: "2025",
    } satisfies FaktencheckFakt,
    {
      id: "st3-fakt-4",
      claim:
        "Die Reihenfolge der Einführung könnte entscheidend sein: Personen, die zuerst ohne KI schrieben und danach mit KI arbeiteten («Brain-to-LLM»), zeigten höhere Gedächtnisaktivierung als jene, die den umgekehrten Weg gingen. Das deutet darauf hin, dass nicht «KI ja oder nein», sondern «wann und wie» für das Lernen ausschlaggebend ist.",
      sourceName: "MIT Media Lab, «Your Brain on ChatGPT» (2025)",
      sourceUrl: "https://media.mit.edu/projects/your-brain-on-chatgpt/overview/",
      date: "2025",
    } satisfies FaktencheckFakt,
    {
      id: "st3-fakt-5",
      claim:
        "Fachleute empfehlen, KI-Hilfsmittel erst ab etwa der 5. Klasse (ca. 11–12 Jahre) einzusetzen. Das Gehirn muss zuerst grundlegende Strukturen durch echtes Lernen aufbauen — Fremdwörter lernen, ein Instrument üben, selbst schreiben. Nur wer diese Basis hat, kann KI-Outputs kritisch einordnen.",
      sourceName: "SRF Einstein — Bernadette Spieler, PH Zürich (2025)",
      sourceUrl: "https://www.youtube.com/watch?v=U5bLCVTr9_I",
      date: "2025",
    } satisfies FaktencheckFakt,
    {
      id: "st3-fakt-6",
      claim:
        "Eigenes kreatives Schaffen — Schreiben, Entdecken, Ideen entwickeln — löst nachhaltige Dopamin- und Serotonin-Ausschüttung aus (Stunden nach dem Erleben noch messbar). KI-gestütztes Prompten erzeugt dagegen einen «Zuckerflash»: kurzes Belohnungsgefühl, das rasch verpufft — ähnlich wie bei Social-Media-Scrolling.",
      sourceName: "Barbara Studer, Hirnforscherin (SRF Einstein 2025)",
      sourceUrl: "https://www.youtube.com/watch?v=U5bLCVTr9_I",
      date: "2025",
    } satisfies FaktencheckFakt,
    {
      id: "st3-fakt-7",
      claim:
        "Die Langzeitfolgen von KI-Nutzung auf Gedächtnis und Kreativität sind noch nicht erforscht. Die MIT-Autorinnen fordern als nächsten Schritt fMRT-Studien und Längsschnittuntersuchungen. «Kognitive Schulden» («cognitive debt») ist die Metapher der Autorinnen — kein medizinischer Befund.",
      sourceName: "MIT Media Lab Overview (2025) + Transparency Coalition (2025)",
      sourceUrl:
        "https://transparencycoalition.ai/news/learn-about-the-this-is-your-brain-on-chatgpt-study-results-limitations-risks-and-more",
      date: "2025",
    } satisfies FaktencheckFakt,
  ],

  quizPool: [
    // ── 5 × MC ──────────────────────────────────────────────────────────────
    {
      id: "st3-mc-1",
      kind: "mc",
      frage:
        "Wie hoch ist die gemessene Differenz bei der Hirnaktivierung zwischen eigenem Schreiben und KI-Prompten (laut Barbara Studers Experiment)?",
      optionen: [
        {
          label: "Etwa 15-mal mehr Aktivierung beim eigenen Schreiben",
          feedback:
            "Genau — Barbara Studer zitiert diesen Faktor wörtlich im Einstein-Bericht.",
        },
        {
          // LANG — bewusst langer Distraktor
          label:
            "Wer mit ChatGPT arbeitet, zeigt eine um bis zu 80 Prozent verringerte Aktivierung in allen Hirnarealen gleichzeitig, was einem nahezu vollständigen Abschalten des Denkzentrums entspricht",
          feedback:
            "Falsch und übertrieben — die Aussage «~15×» bezieht sich auf Studers Vergleich, nicht auf einen «Komplett-Abschalter».",
        },
        {
          label: "Kaum ein Unterschied — KI aktiviert dieselben Areale",
          feedback:
            "Falsch — das Experiment zeigt einen deutlichen Unterschied, v.a. im limbischen System.",
        },
        {
          label: "Drei- bis fünfmal mehr Aktivierung",
          feedback: "Falsch — der genannte Faktor ist ~15, nicht 3–5.",
        },
      ],
      correctIndices: [0],
    } satisfies QuizMC,
    {
      id: "st3-mc-2",
      kind: "mc",
      frage:
        "Was sagt die MIT-Studie «Your Brain on ChatGPT» über ihre eigenen Grenzen aus?",
      optionen: [
        {
          label: "Die Studie ist vollständig peer-reviewed und gilt für alle Formen des Lernens",
          feedback:
            "Falsch — es ist ein Preprint, noch nicht begutachtet, und deckt nur Essay-Schreiben ab.",
        },
        {
          label:
            "Es ist ein Preprint mit kleiner Stichprobe (n=54), nur einer Aufgabe und nur einem Tool",
          feedback:
            "Korrekt — die Autorinnen betonen diese Grenzen ausdrücklich.",
        },
        {
          label: "Die Studie zeigt endgültig, dass ChatGPT das Gehirn dauerhaft schädigt",
          feedback:
            "Falsch — die Autorinnen lehnen Begriffe wie «Hirnschaden» explizit ab.",
        },
        {
          // LANG — bewusst langer Distraktor
          label:
            "Die Ergebnisse wurden von drei unabhängigen Universitäten repliziert und gelten deshalb als robuste wissenschaftliche Grundlage für schulische Verbote von KI-Hilfsmitteln",
          feedback:
            "Falsch — eine Replikation dieser Studie liegt nicht vor; Schul-Verbote werden von den Autorinnen nicht empfohlen.",
        },
      ],
      correctIndices: [1],
    } satisfies QuizMC,
    {
      id: "st3-mc-3",
      kind: "mc",
      frage: "Was beschreibt der Begriff «Zuckerflash» im Einstein-Experiment?",
      optionen: [
        {
          label:
            "Den Energieschub, den man beim Lesen einer guten KI-Antwort spürt — er hält Stunden an",
          feedback:
            "Falsch — gerade das Gegenteil: der Effekt ist flüchtig.",
        },
        {
          label:
            "Das flüchtige Belohnungsgefühl beim Prompten — rasch da, rasch weg, ohne nachhaltigen Dopamin-Effekt",
          feedback:
            "Korrekt — Barbara Studer beschreibt es als kurzfristige Ausschüttung ohne Nachhaltigkeit.",
        },
        {
          label: "Eine Messgrösse für den Cortisolspiegel nach dem Schreiben",
          feedback:
            "Falsch — Cortisol ist separat erwähnt, hat nichts mit «Zuckerflash» zu tun.",
        },
        {
          // LANG — bewusst langer Distraktor
          label:
            "Das phänomenologische Erleben des Nutzers, wenn ein Sprachmodell eine inhaltlich korrekte und ästhetisch ansprechende Antwort liefert, die das kognitive Belohnungssystem für mehrere Stunden in erhöhter Aktivität hält",
          feedback:
            "Falsch und sachlich verkehrt — der «Zuckerflash» ist gerade das Kurze, nicht das Langanhaltende.",
        },
      ],
      correctIndices: [1],
    } satisfies QuizMC,
    {
      id: "st3-mc-4",
      kind: "mc",
      frage: "Was ist die Hauptaussage des «Brain-to-LLM»-Befunds aus der MIT-Studie?",
      optionen: [
        {
          label: "Wer zuerst mit KI arbeitet, lernt besser für spätere Aufgaben ohne KI",
          feedback:
            "Falsch — das ist das Gegenteil des Befunds (LLM-to-Brain zeigte reduzierte Konnektivität).",
        },
        {
          label:
            "KI und Eigenarbeit lösen identische neuronale Muster aus, wenn man die Reihenfolge umkehrt",
          feedback:
            "Falsch — die Reihenfolge macht einen Unterschied, die Muster bleiben nicht identisch.",
        },
        {
          label:
            "Wer zuerst selbst schreibt und dann KI nutzt, zeigt höhere Gedächtnisaktivierung als umgekehrt",
          feedback:
            "Korrekt — die Reihenfolge der Einführung beeinflusst die Gedächtnisaktivierung.",
        },
        {
          // LANG — bewusst langer Distraktor
          label:
            "Das Gehirn passt sich innerhalb von wenigen Stunden vollständig an den jeweils zuletzt verwendeten Arbeitsmodus an, sodass die ursprüngliche Einführungsreihenfolge nach einer Woche keine messbare Rolle mehr spielt",
          feedback:
            "Falsch — die Studie zeigt anhaltende Unterschiede; diese weitreichende Anpassungs-These ist nicht belegt.",
        },
      ],
      correctIndices: [2],
    } satisfies QuizMC,
    {
      id: "st3-mc-5",
      kind: "mc",
      frage:
        "Ab welcher Schulstufe empfehlen Fachleute den Einsatz von KI-Hilfsmitteln?",
      optionen: [
        {
          label:
            "Ab der 1. Klasse — je früher, desto besser für die digitale Kompetenz",
          feedback:
            "Falsch — Fachleute warnen, dass das Gehirn zuerst Grundstrukturen durch echtes Lernen aufbauen muss.",
        },
        {
          label: "Ab etwa der 5. Klasse (ca. 11–12 Jahre)",
          feedback:
            "Korrekt — das ist die im Video genannte Empfehlung (Bernadette Spieler, PH Zürich).",
        },
        {
          label: "Ab dem Gymnasium, frühestens mit 15 Jahren",
          feedback:
            "Falsch — die Empfehlung liegt bei 11–12 Jahren, nicht erst beim Gymnasium.",
        },
        {
          label: "KI sollte im schulischen Umfeld grundsätzlich nicht eingesetzt werden",
          feedback:
            "Falsch — die Empfehlung ist ein sorgfältiger Einsatz ab einem bestimmten Alter, kein generelles Verbot.",
        },
      ],
      correctIndices: [1],
    } satisfies QuizMC,

    // ── 3 × TF ──────────────────────────────────────────────────────────────
    {
      id: "st3-tf-1",
      kind: "tf",
      aussage:
        "Selbst schreiben und denken erzeugt laut dem Einstein-Experiment rund 15-mal mehr Hirnaktivierung als Prompten.",
      correctAnswer: true,
      feedbackRichtig:
        "Genau — Barbara Studer nennt diesen Faktor wörtlich: «Wer ohne KI arbeitet, hat etwa 15-mal mehr Hirnaktivierung als der, der promptet.»",
      feedbackFalsch:
        "Das stimmt. Barbara Studer nennt im Bericht explizit den Faktor ~15 — kein Zahlendreher, keine Annäherung ins Ungefähre.",
    } satisfies QuizTF,
    {
      id: "st3-tf-2",
      kind: "tf",
      aussage:
        "Die MIT-Studie «Your Brain on ChatGPT» ist endgültig wissenschaftlich bewiesen und gilt als gesicherte Grundlage für den Schulunterricht.",
      correctAnswer: false,
      feedbackRichtig:
        "Korrekt — die Studie ist ein Preprint (noch nicht peer-reviewed), hat nur 54 Teilnehmende, deckt nur Essay-Schreiben ab und wurde nur mit ChatGPT durchgeführt. Die Autorinnen mahnen ausdrücklich zu Vorsicht bei Schlussfolgerungen.",
      feedbackFalsch:
        "Falsch. Es handelt sich um einen Preprint (arXiv:2506.08872), nicht um eine peer-reviewte Publikation. Die Autorinnen selbst betonen die Grenzen der Studie und lehnen vereinfachende Schlagzeilen ab.",
    } satisfies QuizTF,
    {
      id: "st3-tf-3",
      kind: "tf",
      aussage:
        "Eine KI wie ChatGPT hat echte Gefühle und kann deshalb emotionale Prozesse beim Denken genauso ersetzen wie ein Mensch.",
      correctAnswer: false,
      feedbackRichtig:
        "Richtig erkannt. Barbara Studer erklärt im Video: «Menschliche Intelligenz ist immer Denken verknüpft mit Gefühlen. Die künstliche Intelligenz ist nur das Denken — da ist null emotionale Resonanz dabei.» KI simuliert keine Emotionen, sie hat keine.",
      feedbackFalsch:
        "Falsch. KI-Sprachmodelle haben keine Gefühle. Hirnforscherin Barbara Studer formuliert es klar: «Bei der KI ist null emotionale Resonanz dabei» — das ist gerade der Kern, warum eigenes Schreiben anders auf unser Wohlbefinden wirkt als Prompten.",
    } satisfies QuizTF,
  ],

  reflexion: "Beim Lernen will ich KI für … nutzen, aber … unbedingt selbst tun.",

  badges: [
    { familie: "mensch", anzahl: 2 },
    { familie: "tech", anzahl: 1 },
  ],
};

const station4: Station = {
  id: "station-4",
  nummer: 4,
  frage: "Kann KI ein:e Freund:in oder Therapeut:in sein?",
  icon: "favorite",
  tags: ["Individuum", "Psyche", "Ethik"],
  freiwillig: true,
  warnung:
    "Diese Station berührt Nähe, Einsamkeit und psychische Gesundheit. Sie ist freiwillig — du kannst sie überspringen und stattdessen eine andere wählen.",

  subpages: {
    auftakt: {
      inhalt: "Station 4 · Nähe & KI — Subpage 1/7: Einstieg + Meinung 1",
      dauerMin: 3,
      lernziel:
        "Du hältst fest, wie du KI als emotionale Stütze einschätzt — bevor du die Belege gesehen hast.",
      anleitung:
        "Beantworte die drei Fragen ehrlich — es gibt kein Richtig oder Falsch. Je eine Frage pro Schritt, dann «Weiter».",
    },
    sonne: {
      inhalt: "Station 4 · Nähe & KI — Subpage 2/7: Sonnenseite",
      dauerMin: 5,
      lernziel:
        "Du erkennst konkrete Situationen, in denen KI als Begleitung echten Nutzen stiften kann.",
      anleitung:
        "Schau die zwei kurzen Clips. Achte darauf, welcher Mehrwert jeweils konkret genannt wird und ob er dich überzeugt. Notiere dir einen Gedanken dazu.",
    },
    schatten: {
      inhalt: "Station 4 · Nähe & KI — Subpage 3/7: Schattenseite",
      dauerMin: 5,
      lernziel:
        "Du erkennst, wie Companion-Bots Nähe simulieren, ohne echtes Verstehen — und was das bedeutet.",
      anleitung:
        "Schau das Video. Achte darauf, wo der Bot «aus der Rolle fällt» und welche Mechanik dahintersteckt. Was davon findest du problematisch?",
    },
    swipe: {
      inhalt: "Station 4 · Nähe & KI — Subpage 4/7: Deine Werte",
      dauerMin: 2,
      lernziel:
        "Du schärfst deine eigene Haltung zu KI, Nähe und menschlicher Beziehung.",
      anleitung:
        "Lies jede Aussage und wische links (ablehnend) oder rechts (zustimmend). Spontan — keine langen Überlegungen.",
    },
    fakten: {
      inhalt: "Station 4 · Nähe & KI — Subpage 5/7: Faktencheck",
      dauerMin: 3,
      lernziel:
        "Du kennst belegte Zahlen und Einschätzungen aus Forschung und Fachverbänden zum Thema KI und psychische Gesundheit.",
      anleitung:
        "Eine Karte nach der anderen. Lies den Fakt, schau dir die Quelle an — und dann «Weiter».",
    },
    quiz: {
      inhalt: "Station 4 · Nähe & KI — Subpage 6/7: Quiz",
      dauerMin: 3,
      lernziel:
        "Du überprüfst, ob du das Gehörte und Gelesene verstanden hast.",
      anleitung:
        "5 Fragen, je eine pro Schritt. Bei jeder Option gibt es ein Feedback — auch wenn du danebenliegst.",
    },
    befund: {
      inhalt: "Station 4 · Nähe & KI — Subpage 7/7: Dein Befund",
      dauerMin: 3,
      lernziel:
        "Du vergleichst deine Meinung von jetzt mit der vom Anfang und hältst in einem Satz fest, was du mitnimmst.",
      anleitung:
        "Beantworte die drei Fragen nochmals (wie am Anfang). Schreib danach einen einzigen Satz. Dann holst du dir deine Badges.",
    },
  },

  polls: [
    {
      id: "st4-leitachse",
      pollId: "st4-leitachse",
      frage: "Eine KI als emotionale Stütze ist hilfreich.",
      format: "skala4",
      optionen: [
        "trifft gar nicht zu",
        "trifft eher nicht zu",
        "trifft eher zu",
        "trifft voll zu",
      ],
      landkarteAxis: "beziehung-mensch",
      prePost: true,
    },
    {
      id: "st4-poll-2",
      pollId: "st4-poll-2",
      frage: "Eine KI versteht mich wirklich.",
      format: "skala4",
      optionen: [
        "trifft gar nicht zu",
        "trifft eher nicht zu",
        "trifft eher zu",
        "trifft voll zu",
      ],
      landkarteAxis: "beziehung-mensch",
      prePost: true,
    },
    {
      id: "st4-poll-3",
      pollId: "st4-poll-3",
      frage: "Wer viel mit einer KI redet, wird dadurch einsamer.",
      format: "skala4",
      optionen: [
        "trifft gar nicht zu",
        "trifft eher nicht zu",
        "trifft eher zu",
        "trifft voll zu",
      ],
      landkarteAxis: "beziehung-mensch",
      prePost: true,
    },
  ],

  sonnenseite: {
    intro:
      "KI ist immer verfügbar — auch um Mitternacht, auch wenn du keine Lust hast, jemandem zur Last zu fallen.",
    anleitung:
      "Schau die zwei Clips. Achte darauf: Welcher Nutzen wird jeweils konkret benannt? Handelt es sich um echten Mehrwert oder um eine wohlklingende Aussage?",
    media: [
      {
        kind: "youtube",
        youtubeId: "jh6Pu-h7rCw",
        title: "Puls — KI als Seelentröster",
        sourceKey: "puls-seelentröster-ki",
        start: 1232,
        end: 1291,
      },
      {
        kind: "youtube",
        youtubeId: "xBT2Mrfhhso",
        title: "Einstein — KI-Freundin",
        sourceKey: "einstein-ki-freundin",
        start: 1158,
        end: 1238,
      },
    ],
  } satisfies MediaBlock,

  schattenseite: {
    intro:
      "Was passiert, wenn Nähe nur simuliert wird — und der Bot das Gespräch am Laufen hält, weil er darauf trainiert ist?",
    anleitung:
      "Schau das Video. Achte darauf, an welchem Punkt der Bot «aus der Rolle fällt». Was davon überrascht dich — und was davon beunruhigt dich?",
    media: [
      {
        kind: "youtube",
        youtubeId: "xBT2Mrfhhso",
        title: "Einstein — KI-Freundin",
        sourceKey: "einstein-ki-freundin",
        start: 1705,
        end: 1903,
      },
    ],
  } satisfies MediaBlock,

  schattenVertiefung: {
    warnung:
      "Triggerwarnung: Das folgende Material behandelt Suizidrisiko und die Verantwortungsfrage. Schau es nur an, wenn du dich dem gewachsen fühlst.",
    hilfsangebote:
      "Wenn dich das Thema beschäftigt: Die Dargebotene Hand — Tel. 143 (rund um die Uhr, vertraulich). Für Jugendliche: Pro Juventute — Tel. 147.",
    intro:
      "Was, wenn ein Mensch in einer Krise ist — und die KI falsch reagiert oder einfach abbricht?",
    anleitung:
      "Schau das Video nur, wenn du dich bereit fühlst. Achte darauf, wie die Fachleute die Verantwortungsfrage beschreiben. Was bräuchte es, damit KI in Krisen sicher wäre?",
    media: [
      {
        kind: "youtube",
        youtubeId: "jh6Pu-h7rCw",
        title: "Puls — KI als Seelentröster (Vertiefung)",
        sourceKey: "puls-seelentröster-ki",
        start: 1324,
        end: 1623,
      },
    ],
  } satisfies Vertiefung,

  swipe: [
    {
      id: "st4-swipe-1",
      aussage:
        "KI-Begleiter sind eine gute Lösung für den Mangel an Therapeut:innen.",
      achse: {
        links: "Nein — das Problem bleibt ungelöst",
        rechts: "Ja — besser als gar nichts",
      },
      profilKey: "regulierung-innovation",
    },
    {
      id: "st4-swipe-2",
      aussage:
        "Ich würde einer KI persönliche Dinge anvertrauen, die ich keinem Menschen sagen würde.",
      achse: {
        links: "Nein — das wäre mir unwohl",
        rechts: "Ja — das ist gerade der Punkt",
      },
      profilKey: "datenschutz-bequemlichkeit",
    },
    {
      id: "st4-swipe-3",
      aussage:
        "Es braucht ein Gesetz, das regelt, wie KI-Apps mit Menschen in psychischen Krisen umgehen dürfen.",
      achse: {
        links: "Nein — Eigenverantwortung reicht",
        rechts: "Ja — der Staat muss handeln",
      },
      profilKey: "regulierung-innovation",
    },
  ],

  fakten: [
    {
      id: "st4-fakt-1",
      claim:
        "Die American Psychological Association (APA) warnt ausdrücklich davor, KI-Chatbots oder Wellness-Apps als Ersatz für Psychotherapie zu nutzen.",
      figure:
        "«Verlassen Sie sich NICHT auf generative KI-Chatbots für Psychotherapie» (Wortlaut APA, Nov 2025)",
      sourceName: "APA, Nov 2025",
      sourceUrl:
        "https://www.apa.org/news/press/releases/2025/11/ai-wellness-apps-mental-health",
      date: "2025-11",
    },
    {
      id: "st4-fakt-2",
      claim:
        "Jede:r dritte US-Teenager nutzt KI-Begleiter für soziale Interaktion, Freundschaft oder romantische Kontakte.",
      figure: "33 % (Befragung 1'060 Teens, 13–17 Jahre)",
      sourceName: "Common Sense Media, Juli 2025",
      sourceUrl:
        "https://www.commonsensemedia.org/research/talk-trust-and-trade-offs",
      date: "2025-07",
    },
    {
      id: "st4-fakt-3",
      claim:
        "Eine randomisierte Studie (MIT/OpenAI, 981 Personen) zeigte: höhere tägliche Chatbot-Nutzung hing mit mehr Einsamkeit, mehr Abhängigkeit und weniger Sozialkontakten zusammen.",
      figure: "RCT, 981 Teilnehmende, >300'000 ausgewertete Nachrichten",
      sourceName: "Fang et al., MIT Media Lab / OpenAI, 2025",
      sourceUrl: "https://www.media.mit.edu",
      date: "2025",
    },
    {
      id: "st4-fakt-4",
      claim:
        "Ein Test von fünf Therapie-Chatbots ergab: Alle behaupteten Vertraulichkeit — die in Wahrheit nicht besteht. Einige rieten zum Absetzen von Antidepressiva.",
      figure: "5 getestete Apps",
      sourceName: "US PIRG Education Fund, 2025",
      sourceUrl: "https://pirg.org/edfund/resources/ai-chatbot-therapy/",
      date: "2025",
    },
    {
      id: "st4-fakt-5",
      claim:
        "Die US-Handelsbehörde FTC eröffnete im September 2025 eine umfassende Untersuchung von KI-Begleiter-Chatbots, angestossen durch Warnungen der APA.",
      sourceName: "APA Services, Sept 2025",
      sourceUrl:
        "https://www.apaservices.org/advocacy/news/federal-trade-commission-chatbot-companions",
      date: "2025-09",
    },
    {
      id: "st4-fakt-6",
      claim:
        "Eine Mutter aus den USA klagte gegen Character.AI, nachdem ihr 14-jähriger Sohn im Februar 2024 Suizid begangen hatte. Ein US-Bundesgericht liess die Klage 2025 zu. (Die Zahlen stammen aus der Klageschrift — gerichtlich noch nicht abschliessend beurteilt.)",
      figure: "Klage Okt 2024; Gericht wies Abweisung ab, Mai 2025",
      sourceName: "Washington Post, Mai 2025",
      sourceUrl:
        "https://www.washingtonpost.com/nation/2025/05/22/sewell-setzer-suicide-ai-character-court-lawsuit/",
      date: "2025-05",
    },
    {
      id: "st4-fakt-7",
      claim:
        "Character.AI verbot Ende Oktober 2025 offene Chats für Nutzer:innen unter 18 Jahren; Google hatte zuvor einer aussergerichtlichen Einigung mit klagenden Familien zugestimmt.",
      figure: "Okt 2025",
      sourceName: "K-12 Dive / CNBC, 2025–2026",
      sourceUrl:
        "https://www.k12dive.com/news/characterai-google-agree-to-mediate-settlements-in-wrongful-teen-death-la/809411/",
      date: "2025-10",
    },
  ],

  quizPool: [
    // MC 1
    {
      id: "st4-mc-1",
      kind: "mc",
      frage:
        "Was sagt die APA (American Psychological Association) über KI-Chatbots als Therapieersatz?",
      optionen: [
        {
          label:
            "Sie warnt ausdrücklich davor, KI-Chatbots für Psychotherapie zu nutzen.",
          feedback:
            "Richtig. Die APA formulierte 2025 explizit: «Verlassen Sie sich NICHT auf generative KI für Psychotherapie.»",
        },
        {
          label:
            "Sie empfiehlt KI-Chatbots als sinnvolle Ergänzung, sobald sie von einer Fachperson eingerichtet wurden.",
          feedback:
            "Falsch. Die APA warnt vor dem Einsatz als Therapieersatz — unabhängig davon, wer die App einrichtet.",
        },
        {
          // langer Distraktor
          label:
            "Sie beurteilt KI-Chatbots als gleichwertigen Ersatz für professionelle Psychotherapie, sofern die App eine Zertifizierung nachweist und der Nutzer oder die Nutzerin freiwillig zustimmt.",
          feedback:
            "Falsch. Die APA erteilt dieser Nutzung eine klare Absage — Zertifizierungen ändern daran nichts.",
        },
        {
          label: "Sie hat sich zu diesem Thema noch nicht geäussert.",
          feedback:
            "Falsch. Die APA hat sich 2025 mit einem ausführlichen Gesundheitshinweis zu Wort gemeldet.",
        },
      ],
      correctIndices: [0],
    },
    // MC 2
    {
      id: "st4-mc-2",
      kind: "mc",
      frage:
        "Was fanden Forschende (Fang et al., MIT/OpenAI 2025) in ihrer randomisierten Studie über tägliche Chatbot-Nutzung?",
      optionen: [
        {
          label:
            "Höhere Nutzung führte zu mehr Sozialkontakten und weniger Einsamkeit.",
          feedback:
            "Falsch. Die Studie fand genau den umgekehrten Zusammenhang.",
        },
        {
          label:
            "Die Nutzung hatte keinen messbaren Effekt auf Einsamkeit oder Sozialkontakte.",
          feedback:
            "Falsch. Die Studie dokumentierte statistisch signifikante Zusammenhänge.",
        },
        {
          label:
            "Höhere tägliche Nutzung hing mit mehr Einsamkeit, mehr Abhängigkeit und weniger Sozialkontakten zusammen.",
          feedback:
            "Richtig. Das ist das Kernergebnis der RCT mit 981 Teilnehmenden.",
        },
        {
          // langer Distraktor
          label:
            "Die Studie stellte fest, dass intensivere Chatbot-Nutzung zwar kurzfristig die Stimmung verbessert, aber nur dann langfristig zu Einsamkeit führt, wenn die Nutzenden keine anderen sozialen Aktivitäten parallel aufrechterhalten.",
          feedback:
            "Falsch. Diese Differenzierung findet sich nicht in den publizierten Befunden; die Korrelation mit Einsamkeit gilt unabhängig davon.",
        },
      ],
      correctIndices: [2],
    },
    // MC 3
    {
      id: "st4-mc-3",
      kind: "mc",
      frage:
        "Was ergab ein Test von fünf Therapie-Chatbots (US PIRG 2025) in Bezug auf Datenschutz?",
      optionen: [
        {
          label:
            "Alle fünf Apps wiesen Nutzer:innen klar darauf hin, dass Gespräche nicht vertraulich sind.",
          feedback: "Falsch. Das Gegenteil war der Fall.",
        },
        {
          label:
            "Alle fünf Apps behaupteten Vertraulichkeit — die in Wahrheit nicht besteht.",
          feedback:
            "Richtig. US PIRG stellte fest, dass sämtliche getesteten Apps Vertraulichkeit versprachen, ohne sie einzuhalten.",
        },
        {
          // langer Distraktor
          label:
            "Drei der fünf Apps versprachen Vertraulichkeit, zwei wiesen hingegen ausdrücklich darauf hin, dass Gesprächsinhalte zu Trainingszwecken oder zur Werbeschaltung weiterverwendet werden könnten.",
          feedback:
            "Falsch. Der Bericht fand bei allen fünf getesteten Apps irreführende Aussagen zur Vertraulichkeit.",
        },
        {
          label: "Die Apps machten keine Aussagen zu Datenschutz.",
          feedback: "Falsch. Sie machten Aussagen — aber falsche.",
        },
      ],
      correctIndices: [1],
    },
    // MC 4
    {
      id: "st4-mc-4",
      kind: "mc",
      frage:
        "Wie gross ist laut Common Sense Media (2025) der Anteil der US-Teenagers, die KI-Begleiter für Freundschaft oder emotionale Unterstützung nutzen?",
      optionen: [
        {
          label: "Etwa jede:r Zehnte (10 %).",
          feedback: "Falsch. Der Anteil ist deutlich höher.",
        },
        {
          label: "Weniger als 5 %.",
          feedback:
            "Falsch. Die Studie zeigt einen erheblich höheren Wert.",
        },
        {
          // langer Distraktor
          label:
            "Etwa die Hälfte aller befragten Jugendlichen zwischen 13 und 17 Jahren gab an, KI-Begleiter mindestens gelegentlich für emotionalen Rückhalt, Freundschaft oder romantische Interaktion zu nutzen.",
          feedback:
            "Falsch. Laut Common Sense Media (Juli 2025) sind es rund 33 % — also etwa ein Drittel, nicht die Hälfte.",
        },
        {
          label: "Etwa ein Drittel (33 %).",
          feedback:
            "Richtig. Die repräsentative Befragung (1'060 Teens, 13–17 Jahre) ergab 33 %.",
        },
      ],
      correctIndices: [3],
    },
    // MC 5
    {
      id: "st4-mc-5",
      kind: "mc",
      frage:
        "Welche Behörde leitete im September 2025 eine Untersuchung von KI-Begleiter-Chatbots ein?",
      optionen: [
        {
          label: "Die US-Handelsbehörde FTC (Federal Trade Commission).",
          feedback:
            "Richtig. Die FTC eröffnete die Untersuchung auf Drängen der APA.",
        },
        {
          label: "Die Europäische Datenschutzbehörde (EDPB).",
          feedback: "Falsch. Es war eine US-Bundesbehörde.",
        },
        {
          label: "Die Weltgesundheitsorganisation (WHO).",
          feedback:
            "Falsch. Die WHO hat KI-Richtlinien veröffentlicht, aber keine direkte Chatbot-Untersuchung eingeleitet.",
        },
        {
          // langer Distraktor
          label:
            "Das US-Ministerium für Gesundheit und Soziales (HHS), das nach Bekanntwerden der Klagen gegen Character.AI eine interne Arbeitsgruppe einsetzte, um Standards für Krisenintervention durch KI-Apps zu entwickeln.",
          feedback:
            "Falsch. Es war die FTC, nicht das HHS, die die Untersuchung eröffnete.",
        },
      ],
      correctIndices: [0],
    },
    // TF 1
    {
      id: "st4-tf-1",
      kind: "tf",
      aussage:
        "Fachleute empfehlen, psychisch kranke Menschen ganz der KI zu überlassen.",
      correctAnswer: false,
      feedbackRichtig:
        "Genau — diese Aussage ist falsch. Sowohl die Puls-Reportage als auch die APA betonen klar: KI ist als Ergänzung denkbar, nie als Ersatz für ausgebildete Fachpersonen.",
      feedbackFalsch:
        "Das ist leider falsch. Fachleute und Fachverbände (APA, Serge Kunz im Puls-Beitrag) sind sich einig: Psychisch kranke Menschen dürfen nicht allein der KI überlassen werden.",
    },
    // TF 2
    {
      id: "st4-tf-2",
      kind: "tf",
      aussage: "Gespräche mit KI-Therapie-Chatbots sind vertraulich.",
      correctAnswer: false,
      feedbackRichtig:
        "Richtig — das ist eine weit verbreitete, aber falsche Annahme. US PIRG (2025) fand, dass alle fünf getesteten Apps Vertraulichkeit behaupteten, ohne sie tatsächlich zu gewährleisten.",
      feedbackFalsch:
        "Das stimmt leider nicht. Tests zeigten, dass Therapie-Chatbots Vertraulichkeit versprechen, ohne sie einzuhalten. Eingaben können zum Training oder für Werbung genutzt werden.",
    },
    // TF 3
    {
      id: "st4-tf-3",
      kind: "tf",
      aussage:
        "Eine Behörde untersucht KI-Begleiter-Apps wegen möglicher Risiken für die psychische Gesundheit.",
      correctAnswer: true,
      feedbackRichtig:
        "Richtig. Die US-Handelsbehörde FTC leitete im September 2025 eine umfassende Untersuchung von KI-Begleiter-Chatbots ein.",
      feedbackFalsch:
        "Das stimmt tatsächlich. Die FTC eröffnete die Untersuchung im September 2025, angestossen durch Warnungen der APA.",
    },
  ],

  reflexion:
    "Eine KI darf für mich …, aber … kann sie nicht ersetzen.",

  badges: [
    { familie: "mensch", anzahl: 2 },
    { familie: "ethik", anzahl: 1 },
  ],
};

const station5: Station = {
  id: "station-5",
  nummer: 5,
  frage: "Kann KI die Welt besser machen?",
  icon: "public",
  tags: ["Ökologie", "Wirtschaft", "Ethik"],

  subpages: {
    auftakt: {
      inhalt: "Station 5 · Welt besser — Subpage 1/7: Einstieg & Meinung 1",
      dauerMin: 3,
      lernziel:
        "Du hältst deine Ausgangshaltung fest, ob KI grosse Weltprobleme lösen kann.",
      anleitung:
        "Beantworte die drei kurzen Fragen ehrlich — es gibt kein Richtig oder Falsch. Du siehst sie am Ende der Station noch einmal.",
    },
    sonne: {
      inhalt:
        "Station 5 · Welt besser — Subpage 2/7: Sonnenseite (KI gegen Foodwaste)",
      dauerMin: 5,
      lernziel:
        "Du erkennst, wie KI in einer Schweizer Bäckerei Bestellprognosen verbessert und Lebensmittelverschwendung reduziert.",
      anleitung:
        "Das Bäckerei-Team beschreibt, wie die KI-Prognose ihren Alltag verändert hat. Achte darauf, was die KI kann — und was sie laut dem Projektleiter nie ersetzen wird. Notiere dir eine Zahl oder ein Detail, das dich überrascht.",
    },
    schatten: {
      inhalt:
        "Station 5 · Welt besser — Subpage 3/7: Schattenseite (Datenarbeit in Kenia)",
      dauerMin: 6,
      lernziel:
        "Du kannst benennen, welche menschlichen und sozialen Kosten hinter dem KI-Training stecken, die in Hochlohnländern unsichtbar bleiben.",
      anleitung:
        "Schaue ab Minute 21 für rund 5 Minuten. Wer sind die Menschen, die KI im Hintergrund möglich machen? Achte auf Lohn, Arbeitszeit und psychische Belastung. Was davon wusstest du vorher nicht?",
    },
    swipe: {
      inhalt: "Station 5 · Welt besser — Subpage 4/7: Werte (Swipe)",
      dauerMin: 2,
      lernziel:
        "Du positionierst dich zu drei Aussagen über KI, Ökologie und globale Gerechtigkeit.",
      anleitung:
        "Wische rechts, wenn du zustimmst — links, wenn du ablehnst. Kein Richtig oder Falsch; deine Antworten fliessen in dein persönliches Profil ein.",
    },
    fakten: {
      inhalt: "Station 5 · Welt besser — Subpage 5/7: Faktencheck",
      dauerMin: 3,
      lernziel:
        "Du kennst belegte Zahlen zu Lebensmittelverschwendung, Energieverbrauch und Arbeitsbedingungen in der globalen KI-Lieferkette.",
      anleitung:
        "Lies jede Karte und ihre Quelle. Welcher Fakt überrascht dich am meisten?",
    },
    quiz: {
      inhalt: "Station 5 · Welt besser — Subpage 6/7: Quiz",
      dauerMin: 3,
      lernziel:
        "Du überprüfst, was du über KI, Foodwaste und versteckte Kosten verstanden hast.",
      anleitung:
        "5 Fragen, je eine auf einmal. Du bekommst nach jeder Antwort direktes Feedback.",
    },
    befund: {
      inhalt: "Station 5 · Welt besser — Subpage 7/7: Meinung 2 & Badge",
      dauerMin: 2,
      lernziel:
        "Du vergleichst deine Haltung vor und nach der Station und formulierst deinen Befund in einem Satz.",
      anleitung:
        "Beantworte dieselben drei Fragen wie am Anfang. Hat sich etwas verschoben? Schreibe danach einen Satz — und hol dir deinen Badge.",
    },
  },

  polls: [
    {
      id: "st5-leitachse",
      pollId: "st5-leitachse",
      frage: "Unter dem Strich macht KI die Welt besser.",
      format: "skala4",
      optionen: [
        "trifft gar nicht zu",
        "trifft eher nicht zu",
        "trifft eher zu",
        "trifft voll zu",
      ],
      landkarteAxis: "welt-oekologie-ethik",
      prePost: true,
    },
    {
      id: "st5-poll-2",
      pollId: "st5-poll-2",
      frage:
        "KI kann helfen, den Klimawandel und die Ressourcenverschwendung spürbar zu verringern.",
      format: "skala4",
      optionen: [
        "trifft gar nicht zu",
        "trifft eher nicht zu",
        "trifft eher zu",
        "trifft voll zu",
      ],
      landkarteAxis: "welt-oekologie-ethik",
      prePost: true,
    },
    {
      id: "st5-poll-3",
      pollId: "st5-poll-3",
      frage:
        "Die versteckten menschlichen und ökologischen Kosten von KI sind tragbar, wenn der Nutzen gross genug ist.",
      format: "skala4",
      optionen: [
        "trifft gar nicht zu",
        "trifft eher nicht zu",
        "trifft eher zu",
        "trifft voll zu",
      ],
      landkarteAxis: "welt-oekologie-ethik",
      prePost: true,
    },
  ],

  sonnenseite: {
    intro:
      "In der Schweiz landen jährlich knapp 3 Millionen Tonnen Lebensmittel im Abfall. Ein Zürcher Startup setzt KI ein, um Bäckereien bessere Bestellprognosen zu liefern — und damit Foodwaste zu reduzieren.",
    anleitung:
      "Höre die zwei Ausschnitte aus dem SRF-Espresso-Beitrag. Achte darauf, was die KI tatsächlich leistet — und was der Projektleiter ausdrücklich betont, was sie nie leisten wird.",
    media: [
      {
        kind: "audio",
        src: "https://download-media.srf.ch/world/audio/Espresso_radio/2026/04/Espresso_radio_AUDI20260401_RS_0031_1c87518e7ee14b2998aabc9b326f0de0.mp3",
        title: "SRF Espresso — Foodwaste",
        sourceKey: "espresso-foodwaste",
        externalUrl:
          "https://www.srf.ch/sendungen/kassensturz-espresso/espresso/praezisere-bestellprognosen-eine-ki-sorgt-in-schweizer-baeckereien-fuer-weniger-foodwaste",
        segments: [
          {
            start: 95,
            end: 115,
            label: "Food Waste nimmt ab",
          },
          {
            start: 131,
            end: 185,
            label: "Go Nina — ersetzt nie eine Mitarbeiterin",
          },
        ],
      },
    ],
  },

  schattenseite: {
    intro:
      "Damit KI funktioniert, muss sie trainiert werden — auch mit den schlimmsten Inhalten des Internets. Diese Arbeit erledigen Menschen in Billiglohnländern, oft für einen Hungerlohn und auf Kosten ihrer psychischen Gesundheit.",
    anleitung:
      "Schaue ab Minute 21 für rund 5 Minuten. Wer sind die Menschen, die KI im Hintergrund möglich machen? Achte auf Lohn, Arbeitszeit und psychische Belastung.",
    media: [
      {
        kind: "srf",
        urn: "urn:srf:video:afe37702-e5f5-4466-8427-ab804baa53dc",
        title: "Kassensturz — KI allgegenwärtig, nützlich, aber beängstigend",
        sourceKey: "kassensturz-ausbeutung",
        externalUrl: "https://www.srf.ch/news",
        guidance:
          "Schauen Sie ab Minute 21 für rund 5 Minuten — es geht um Datenarbeiter:innen und Content-Moderation in Kenia.",
      },
    ],
  },

  swipe: [
    {
      id: "st5-swipe-1",
      aussage:
        "KI-Unternehmen sollten für den Strom- und Wasserverbrauch ihrer Modelle eine Umweltabgabe bezahlen.",
      achse: {
        links: "freiwillige Selbstregulierung",
        rechts: "staatliche Regulierung",
      },
      profilKey: "regulierung-innovation",
    },
    {
      id: "st5-swipe-2",
      aussage:
        "Ein KI-System, das Food Waste reduziert, braucht trotzdem immer Menschen, die seine Vorschläge kritisch prüfen.",
      achse: {
        links: "Effizienz zählt",
        rechts: "Mensch bleibt verantwortlich",
      },
      profilKey: "menschloop-effizienz",
    },
    {
      id: "st5-swipe-3",
      aussage:
        "Ich würde eine App nutzen, auch wenn ich weiss, dass ihre Trainingsdaten von schlecht bezahlten Arbeitenden in Kenia stammen.",
      achse: {
        links: "Lieferkette ist mir wichtig",
        rechts: "Bequemlichkeit geht vor",
      },
      profilKey: "datenschutz-bequemlichkeit",
    },
  ],

  fakten: [
    {
      id: "st5-fakt-1",
      claim:
        "In der Schweiz gehen jährlich rund 2.8 Millionen Tonnen Lebensmittel verloren — das entspricht etwa 330 kg vermeidbaren Verlusten pro Person und Jahr.",
      figure: "~2.8 Mio. t / Jahr; ~330 kg/Person",
      sourceName: "BAFU / ZHAW Beretta et al. 2025",
      sourceUrl:
        "https://www.bafu.admin.ch/bafu/en/home/topics/economy-consumption/lebensmittelabfaelle.html",
      date: "2025",
    },
    {
      id: "st5-fakt-2",
      claim:
        "Vermeidbarer Lebensmittelabfall verursacht rund 25 % des gesamten Umwelt-Fussabdrucks des Schweizer Ernährungssystems — ungefähr halb so viel wie der gesamte private Autoverkehr.",
      figure: "25 % des Ernährungs-Fussabdrucks",
      sourceName: "BAFU (Bundesamt für Umwelt)",
      sourceUrl:
        "https://www.bafu.admin.ch/bafu/en/home/topics/economy-consumption/lebensmittelabfaelle.html",
      date: "2025",
    },
    {
      id: "st5-fakt-3",
      claim:
        "Das Zürcher Startup GoNina hat über 60 Bäckereien mit einem KI-Prognose-Tool ausgestattet. Es berechnet Bestellempfehlungen auf Basis von Verkaufsdaten, Wetter und Wochentag. Das Unternehmen gibt bis zu 52 % weniger Abfall an — das ist eine Eigenangabe, nicht unabhängig geprüft.",
      figure: ">60 Standorte; bis 52 % weniger Abfall (Eigenangabe)",
      sourceName: "GoNina / Swiss Food & Nutrition Valley / Migros-Pionierfonds",
      sourceUrl:
        "https://www.swissfoodnutritionvalley.com/gonina-secures-new-funding-from-the-migros-pioneer-fund-in-its-mission-to-reduce-food-waste/",
      date: "2025",
    },
    {
      id: "st5-fakt-4",
      claim:
        "Kenianische Content-Moderatoren, die für Meta toxische Inhalte sichteten, verdienten zwischen 1.46 und 2.20 US-Dollar pro Stunde. Im Kassensturz-Bericht verdient eine Annotatorin rund 180 Franken pro Monat — bei Weitem nicht genug, um in Nairobi über die Runden zu kommen.",
      figure: "~2 $/Std; ~180 Fr./Monat",
      sourceName: "TIME / SRF Kassensturz",
      sourceUrl:
        "https://time.com/6264621/facebook-content-moderators-lawsuit-kenya/",
      date: "2023",
    },
    {
      id: "st5-fakt-5",
      claim:
        "Rechenzentren verbrauchten 2024 weltweit rund 415 TWh Strom (ca. 1.5 % des Weltstroms). Die IEA erwartet bis 2030 eine Verdopplung auf rund 945 TWh — hauptsächlich getrieben durch KI-Workloads.",
      figure: "415 TWh (2024) → ~945 TWh (2030)",
      sourceName: "IEA «Energy and AI» 2025",
      sourceUrl: "https://www.iea.org/reports/energy-and-ai/executive-summary",
      date: "2025",
    },
    {
      id: "st5-fakt-6",
      claim:
        "Das Training von GPT-3 verdunstete schätzungsweise rund 700'000 Liter Süsswasser zur Server-Kühlung. Im laufenden Betrieb «trinkt» GPT-3 ungefähr 500 ml Wasser pro 20–50 mittellange Antworten. (Schätzung; exakte Werte hängen vom Rechenzentrum ab.)",
      figure: "~700'000 L Training; ~500 ml / 20–50 Antworten",
      sourceName: "Li et al. «Making AI Less Thirsty» / CACM 2025",
      sourceUrl:
        "https://cacm.acm.org/sustainability-and-computing/making-ai-less-thirsty/",
      date: "2023 / 2025",
    },
  ],

  quizPool: [
    // ── 5 Multiple-Choice ──────────────────────────────────────────────────
    {
      id: "st5-mc-1",
      kind: "mc",
      frage:
        "Wie viele Tonnen Lebensmittel gehen in der Schweiz jährlich ungefähr verloren?",
      optionen: [
        {
          label: "~280'000 Tonnen",
          feedback:
            "Das wäre nur ein Zehntel der tatsächlichen Zahl. Die Verluste sind deutlich grösser.",
        },
        {
          label: "~2.8 Millionen Tonnen",
          feedback:
            "Richtig. Das BAFU nennt rund 2.8 Mio. t — das entspricht etwa 330 kg pro Person und Jahr.",
        },
        {
          label: "~28 Millionen Tonnen",
          feedback:
            "Das wäre mehr als die gesamte Schweizer Nahrungsmittelproduktion. Zu hoch.",
        },
        {
          label:
            "Schweizer Haushalte werfen kaum Lebensmittel weg, weil die Preise so hoch sind und man sparsam umgeht.",
          feedback:
            "Der Preis hält leider nicht von Verschwendung ab. Die Verluste sind erheblich und betreffen Haushalte, Gastronomie und Handel gleichermassen.",
        },
      ],
      correctIndices: [1],
      punkte: 1,
    },
    {
      id: "st5-mc-2",
      kind: "mc",
      frage:
        "Was ist laut dem SRF-Espresso-Bericht die Hauptursache dafür, dass Bäckereien zu viel oder zu wenig bestellen?",
      optionen: [
        {
          label: "Faulheit der Mitarbeitenden",
          feedback:
            "Das stimmt nicht. Das Personal trifft täglich komplexe Bestellentscheidungen unter Zeitdruck.",
        },
        {
          label: "Schwer vorhersehbare Kundennachfrage",
          feedback:
            "Richtig. Matthieu Ochsner erklärt, die Betriebe hätten gesagt, ein wesentlicher Teil der Verschwendung gehe auf eine Nachfrage zurück, die sehr schwierig vorauszusehen sei.",
        },
        {
          label: "Fehlende digitale Kassensysteme",
          feedback:
            "Kassensysteme existieren; das Problem liegt in der Prognose, nicht in der Erfassung.",
        },
        {
          label:
            "GoNina hat nachgewiesen, dass Bestellprognosen ohne menschliche Kontrolle genauso gut oder besser funktionieren als Entscheidungen von erfahrenem Fachpersonal.",
          feedback:
            "Das Gegenteil ist wahr. Der Projektleiter betont ausdrücklich, ohne das Personal würde das Tool gar nicht funktionieren.",
        },
      ],
      correctIndices: [1],
      punkte: 1,
    },
    {
      id: "st5-mc-3",
      kind: "mc",
      frage:
        "Was verdienen kenianische Content-Moderatoren für westliche Tech-Konzerne gemäss dem Kassensturz-Bericht ungefähr pro Monat?",
      optionen: [
        {
          label:
            "Rund 1'800 Franken — vergleichbar mit einem Schweizer Mindestlohn in der Gastronomie",
          feedback:
            "Das wäre das Zehnfache. Der Bericht nennt rund 180 Franken pro Monat.",
        },
        {
          label: "Rund 900 Franken",
          feedback:
            "Näher dran, aber immer noch fünfmal zu hoch. Der Bericht nennt rund 180 Franken.",
        },
        {
          label: "Rund 180 Franken",
          feedback:
            "Richtig. «Alice» im Kassensturz-Bericht verdient 30'000 Kenya-Schilling — rund 180 Schweizer Franken.",
        },
        {
          label: "Rund 18 Franken",
          feedback:
            "Zu tief. Der genannte Wert liegt bei rund 180 Franken pro Monat.",
        },
      ],
      correctIndices: [2],
      punkte: 1,
    },
    {
      id: "st5-mc-4",
      kind: "mc",
      frage:
        "Was erwartet die Internationale Energieagentur (IEA) für den Stromverbrauch von Rechenzentren bis 2030?",
      optionen: [
        {
          label:
            "Er sinkt, weil KI-Modelle durch Effizienzgewinne immer sparsamer werden und weniger Strom brauchen als ältere Systeme.",
          feedback:
            "Effizienzgewinne gibt es tatsächlich, aber der Gesamtverbrauch steigt trotzdem stark, weil die Nachfrage viel schneller wächst als die Effizienz.",
        },
        {
          label: "Er bleibt ungefähr gleich bei rund 400 TWh",
          feedback:
            "Falsch. Die IEA erwartet eine deutliche Steigerung, keine Stagnation.",
        },
        {
          label: "Er verdoppelt sich auf rund 945 TWh",
          feedback:
            "Richtig. Von 415 TWh (2024) auf ~945 TWh (2030) — hauptsächlich getrieben durch KI-Workloads.",
        },
        {
          label: "Er vervierfacht sich auf über 1'600 TWh",
          feedback:
            "So stark nicht. Die IEA schätzt eine Verdopplung, keine Vervierfachung.",
        },
      ],
      correctIndices: [2],
      punkte: 1,
    },
    {
      id: "st5-mc-5",
      kind: "mc",
      frage:
        "Was sagt der Projektleiter der Bäckerei Meier über GoNinas KI-Prognose im Espresso-Bericht?",
      optionen: [
        {
          label:
            "Die Prognose ist immer sehr genau — damit kann das Personal vollständig entlastet werden und Bestellungen autonom laufen.",
          feedback:
            "Im Bericht wird explizit ein Gegenbeispiel genannt: die Prognose sagte 15 Stück voraus, bestellt wurden 20, verkauft nur 7. Die KI liegt manchmal weit daneben.",
        },
        {
          label:
            "Die KI werde in zwei Jahren alle Bestellentscheidungen selbst übernehmen, da sie schneller und fehlerfreier arbeite als Menschen.",
          feedback:
            "Der Projektleiter sagt das Gegenteil: Menschen bleiben unverzichtbar.",
        },
        {
          label:
            "Die App lohnt sich nur für Grossbäckereien mit mehr als 100 Filialen, weil die Datenbasis zu klein ist.",
          feedback:
            "Bereits rund 60 Bäckereien verschiedener Grössen nutzen das Tool.",
        },
        {
          label:
            "Der Food Waste nimmt ab, aber die KI braucht weiterhin Menschen, die ihre Vorschläge kritisch prüfen und anpassen.",
          feedback:
            "Richtig. «Ohne sie würde das gar nicht funktionieren» — so der Projektleiter wörtlich.",
        },
      ],
      correctIndices: [3],
      punkte: 1,
    },
    // ── 3 Wahr/Falsch ─────────────────────────────────────────────────────
    {
      id: "st5-tf-1",
      kind: "tf",
      aussage:
        "In der Schweiz gehen jährlich rund 2.8 Millionen Tonnen Esswaren verloren.",
      correctAnswer: true,
      feedbackRichtig:
        "Genau. Das BAFU nennt rund 2.8 Mio. t, gestützt auf eine ZHAW-Studie von 2025.",
      feedbackFalsch:
        "Tatsächlich stimmt diese Zahl. Das Bundesamt für Umwelt (BAFU) bestätigt rund 2.8 Mio. t / Jahr.",
      punkte: 1,
    },
    {
      id: "st5-tf-2",
      kind: "tf",
      aussage:
        "Content-Moderation ist eine harmlose Bürotätigkeit ohne nennenswerte psychische Belastung.",
      correctAnswer: false,
      feedbackRichtig:
        "Richtig erkannt: Diese Aussage ist falsch. Im Kassensturz-Bericht beschreiben Moderatoren schwere psychische Folgen, zerstörte Beziehungen und Schlafstörungen.",
      feedbackFalsch:
        "Diese Aussage ist falsch. Content-Moderatoren sichten täglich Hunderte Videos mit Gewalt, Missbrauch und Suizid — mit dokumentierten psychischen Folgen.",
      punkte: 1,
    },
    {
      id: "st5-tf-3",
      kind: "tf",
      aussage:
        "KI-Modelle haben einen messbaren Wasserverbrauch durch die Kühlung ihrer Server.",
      correctAnswer: true,
      feedbackRichtig:
        "Richtig. Das Training von GPT-3 verdunstete schätzungsweise rund 700'000 Liter Wasser vor Ort. Auch der laufende Betrieb braucht Kühlwasser.",
      feedbackFalsch:
        "Das stimmt tatsächlich. Forscher schätzen, dass allein das GPT-3-Training rund 700'000 Liter Süsswasser zur Kühlung verdunstet hat (Li et al. 2023/2025).",
      punkte: 1,
    },
  ],

  reflexion: "KI tut der Welt gut, wenn …; sie schadet, weil …",

  badges: [
    { familie: "gesellschaft", anzahl: 1 },
    { familie: "wirtschaft", anzahl: 1 },
    { familie: "ethik", anzahl: 1 },
  ],
};

const station6: Station = {
  id: "station-6",
  nummer: 6,
  frage: "Wenn Maschinen über Leben entscheiden",
  icon: "smart_toy",
  tags: ["Politik", "Ethik", "Recht"],

  subpages: {
    auftakt: {
      inhalt:
        "Station 6 · Maschinen über Leben — Subpage 1/7: Einstieg & Meinung 1",
      dauerMin: 3,
      lernziel:
        "Du hältst deine Ausgangshaltung fest, wie du den Einsatz von KI in militärischen Entscheidungen einschätzt.",
      anleitung:
        "Beantworte die drei Fragen ehrlich — es gibt kein Richtig oder Falsch. Du siehst sie am Ende der Station noch einmal, um deine Haltung zu vergleichen.",
    },
    sonne: {
      inhalt:
        "Station 6 · Maschinen über Leben — Subpage 2/7: Sonnenseite (KI als Präzisionswerkzeug)",
      dauerMin: 5,
      lernziel:
        "Du kannst erklären, was das KI-System Maven leistet und welches Versprechen es im Krieg gibt — mehr Präzision, schnellere Lagebilder, potenziell weniger Zivilopfer.",
      anleitung:
        "Schaue ab Minute 12 für rund 2 Minuten. Was kann Maven laut Bericht? Achte auf die Formulierung «könnte zivile Opfer reduzieren» — was setzt das voraus? Notiere dir einen Gedanken.",
    },
    schatten: {
      inhalt:
        "Station 6 · Maschinen über Leben — Subpage 3/7: Schattenseite (Automation Bias & Mädchenschule)",
      dauerMin: 5,
      lernziel:
        "Du kannst den Begriff «Automation Bias» erklären und an einem konkreten Beispiel zeigen, welche Folgen er im Krieg haben kann.",
      anleitung:
        "Schaue ab Minute 13, Sekunde 50, für rund 1 Minute. Was ist Automation Bias? Was war das Ergebnis im Fall der Mädchenschule? Wie alt waren die Daten in der Datenbank?",
    },
    swipe: {
      inhalt:
        "Station 6 · Maschinen über Leben — Subpage 4/7: Werte (Swipe)",
      dauerMin: 2,
      lernziel:
        "Du positionierst dich zu drei Aussagen über menschliche Kontrolle, Regulierung und Vertrauen in KI-Entscheidungen.",
      anleitung:
        "Wische rechts, wenn du zustimmst — links, wenn du ablehnst. Kein Richtig oder Falsch; deine Antworten fliessen in dein persönliches Profil ein.",
    },
    fakten: {
      inhalt:
        "Station 6 · Maschinen über Leben — Subpage 5/7: Faktencheck",
      dauerMin: 3,
      lernziel:
        "Du kennst belegte Zahlen zum KI-Einsatz im Krieg, zur internationalen Rechtslage und zum Begriff «meaningful human control».",
      anleitung:
        "Lies jede Karte und ihre Quelle. Welcher Fakt überrascht dich am meisten? Achte bei den Lavender-Daten auf den Hinweis zur Quellenlage.",
    },
    quiz: {
      inhalt:
        "Station 6 · Maschinen über Leben — Subpage 6/7: Quiz",
      dauerMin: 3,
      lernziel:
        "Du überprüfst, was du über KI im Krieg, Automation Bias und internationale Regulierung verstanden hast.",
      anleitung:
        "5 Fragen, je eine auf einmal. Du bekommst nach jeder Antwort direktes Feedback.",
    },
    befund: {
      inhalt:
        "Station 6 · Maschinen über Leben — Subpage 7/7: Meinung 2 & Badge",
      dauerMin: 2,
      lernziel:
        "Du vergleichst deine Haltung vor und nach der Station und formulierst deinen Befund in einem Satz.",
      anleitung:
        "Beantworte dieselben drei Fragen wie am Anfang. Hat sich etwas verschoben? Schreibe danach einen Satz — und hol dir deinen Badge.",
    },
  },

  polls: [
    {
      id: "st6-leitachse",
      pollId: "st6-leitachse",
      frage: "KI im Krieg ist ein notwendiges Werkzeug.",
      format: "skala4",
      optionen: [
        "trifft gar nicht zu",
        "trifft eher nicht zu",
        "trifft eher zu",
        "trifft voll zu",
      ],
      landkarteAxis: "krieg-politik",
      prePost: true,
    },
    {
      id: "st6-poll-2",
      pollId: "st6-poll-2",
      frage:
        "Über den Einsatz tödlicher Gewalt muss immer ein Mensch die letzte Entscheidung treffen.",
      format: "skala4",
      optionen: [
        "trifft gar nicht zu",
        "trifft eher nicht zu",
        "trifft eher zu",
        "trifft voll zu",
      ],
      landkarteAxis: "krieg-politik",
      prePost: true,
    },
    {
      id: "st6-poll-3",
      pollId: "st6-poll-3",
      frage:
        "Ich vertraue darauf, dass KI-Systeme zivile Opfer im Krieg zuverlässig reduzieren können.",
      format: "skala4",
      optionen: [
        "trifft gar nicht zu",
        "trifft eher nicht zu",
        "trifft eher zu",
        "trifft voll zu",
      ],
      landkarteAxis: "krieg-politik",
      prePost: true,
    },
  ],

  sonnenseite: {
    intro:
      "KI macht Kriege schneller — könnte sie sie auch präziser und damit menschlicher machen? Das Maven-System von Palantir verspricht Echtzeit-Lagebilder und bessere Zielauswahl. Was das bedeutet, zeigt ein 10vor10-Bericht.",
    anleitung:
      "Schaue ab Minute 12 für rund 2 Minuten. Was kann Maven laut Bericht leisten? Achte auf die Formulierung «könnte zivile Opfer reduzieren» — was würde das voraussetzen?",
    media: [
      {
        kind: "srf",
        urn: "urn:srf:video:07d69605-e3b7-4d55-994e-c98dd6e5acec",
        title: "10vor10 — KI im Krieg",
        sourceKey: "10v10-ki-krieg",
        externalUrl:
          "https://www.srf.ch/news/international/nahost/ki-im-krieg-wenn-im-krieg-maschinen-statt-menschen-entscheiden",
        guidance:
          "Schauen Sie ab Minute 12 für rund 2 Minuten — es geht darum, was das KI-System Maven leisten kann und was Fachleute sich davon versprechen (Echtzeit-Lagebild, Ziel- und Waffenvorschläge, potenzielle Reduktion von Zivilopfern).",
      },
    ],
  },

  schattenseite: {
    intro:
      "Dasselbe System, das Präzision verspricht, kann durch Automation Bias und veraltete Daten zur Katastrophe führen. Im Süd-Iran traf ein Angriff eine Mädchenschule — 165 Kinder und 26 Lehrer starben.",
    anleitung:
      "Schaue ab Minute 13, Sekunde 50, für rund 1 Minute. Was ist Automation Bias? Welche Rolle spielten veraltete Daten im Fall der Mädchenschule? Was folgt daraus für den Begriff «menschliche Kontrolle»?",
    media: [
      {
        kind: "srf",
        urn: "urn:srf:video:07d69605-e3b7-4d55-994e-c98dd6e5acec",
        title: "10vor10 — KI im Krieg",
        sourceKey: "10v10-ki-krieg",
        externalUrl:
          "https://www.srf.ch/news/international/nahost/ki-im-krieg-wenn-im-krieg-maschinen-statt-menschen-entscheiden",
        guidance:
          "Schauen Sie ab Minute 13 Sekunde 50 für rund 1 Minute — es geht um Automation Bias (Menschen vertrauen der Maschine mehr als ihrer eigenen Intuition) und den Fall der getroffenen Mädchenschule im Süd-Iran (165 Kinder, veraltete Datenbank).",
      },
    ],
  },

  swipe: [
    {
      id: "st6-swipe-1",
      aussage:
        "Autonome Waffensysteme, die ohne menschliche Freigabe töten können, sollten international verboten werden.",
      achse: {
        links: "nationale Souveränität geht vor",
        rechts: "internationales Verbot nötig",
      },
      profilKey: "regulierung-innovation",
    },
    {
      id: "st6-swipe-2",
      aussage:
        "Ein KI-System, das in 20 Sekunden ein Ziel freigibt, bietet keine echte menschliche Kontrolle mehr.",
      achse: {
        links: "Effizienz zählt",
        rechts: "Mensch bleibt verantwortlich",
      },
      profilKey: "menschloop-effizienz",
    },
    {
      id: "st6-swipe-3",
      aussage:
        "Wenn KI Kriege schneller und präziser macht, ist das trotz Risiken insgesamt ein Fortschritt.",
      achse: {
        links: "Risiko überwiegt",
        rechts: "Fortschritt trotz Kosten",
      },
      profilKey: "menschloop-effizienz",
    },
  ],

  fakten: [
    {
      id: "st6-fakt-1",
      claim:
        "Das KI-System «Lavender» markierte laut einer Recherche von +972 Magazine bis zu 37'000 Palästinenser als mutmassliche Militante. Die Angaben stammen aus anonymen Geheimdienstquellen — die israelische Armee bestreitet, dass eine solche «Kill-Liste» existiert.",
      figure: "~37'000 (bestritten; anonyme Quellen)",
      sourceName: "+972 Magazine / Local Call, April 2024",
      sourceUrl: "https://972mag.com/lavender-ai-israeli-army-gaza/",
      date: "2024",
    },
    {
      id: "st6-fakt-2",
      claim:
        "Laut derselben Recherche widmeten Offiziere pro KI-markiertem Ziel oft nur rund 20 Sekunden — ein «Gummistempel» für die Maschine statt echter Prüfung. Auch diese Zahl stammt aus anonymen Quellen und wird von der IDF bestritten.",
      figure: "~20 Sekunden pro Ziel (bestritten; anonyme Quellen)",
      sourceName: "+972 Magazine, 2024",
      sourceUrl: "https://972mag.com/lavender-ai-israeli-army-gaza/",
      date: "2024",
    },
    {
      id: "st6-fakt-3",
      claim:
        "Automation Bias: Menschen neigen dazu, KI-Entscheidungen unkritisch zu übernehmen — selbst wenn sie ahnen, dass etwas nicht stimmt. Im Kriegseinsatz ist das besonders gefährlich, weil die Fehlerkosten unumkehrbar sind.",
      sourceName: "The Cairo Review of Global Affairs, 2024",
      sourceUrl:
        "https://thecairoreview.com/essays/gaza-israels-ai-human-laboratory/",
      date: "2024",
    },
    {
      id: "st6-fakt-4",
      claim:
        "Im Dezember 2023 stimmten 152 Staaten in der UN-Generalversammlung für die erste Resolution zu tödlichen autonomen Waffensystemen. Nur 4 Staaten stimmten dagegen. Ein rechtsverbindlicher Vertrag existiert bis heute nicht.",
      figure: "152 dafür / 4 dagegen",
      sourceName: "Human Rights Watch / UN-Generalversammlung",
      sourceUrl:
        "https://hrw.org/news/2024/01/03/killer-robots-un-vote-should-spur-action-treaty",
      date: "2023 / 2024",
    },
    {
      id: "st6-fakt-5",
      claim:
        "UN-Generalsekretär Guterres und das IKRK fordern bis 2026 einen rechtsverbindlichen Vertrag, der autonome Waffen ohne bedeutsame menschliche Kontrolle («meaningful human control») verbietet. Die CCW-Gespräche laufen seit 2014 — ohne substanzielles Ergebnis.",
      figure: "Verhandlungen seit 2014; kein Ergebnis",
      sourceName: "Human Rights Watch / UN News, Mai 2025",
      sourceUrl:
        "https://hrw.org/news/2025/05/21/un-start-talks-treaty-ban-killer-robots",
      date: "2025",
    },
    {
      id: "st6-fakt-6",
      claim:
        "Google verliess 2018 das US-Militärprojekt «Project Maven» nach internen Mitarbeiterprotesten. Palantir übernahm und baute das System zum heutigen Maven Smart System aus, das den Targeting-Prozess von 8–9 separaten Systemen auf eines reduzierte.",
      figure: "2018: Google-Austritt nach Mitarbeiterprotesten",
      sourceName: "Wikipedia «Project Maven»",
      sourceUrl: "https://en.wikipedia.org/wiki/Project_Maven",
      date: "2025",
    },
    {
      id: "st6-fakt-7",
      claim:
        "Palantirs Maven Smart System identifizierte laut Branchenberichten am ersten Tag des US-Angriffs auf den Iran über 1'000 Ziele. Formell bleibt ein Mensch «in the loop» — die Kritik richtet sich gegen die Geschwindigkeit und die nur scheinbare Kontrolle bei Tausenden von Zielen.",
      figure: "1'000 Ziele am ersten Tag (Branchenquelle, contested)",
      sourceName: "The Register, März 2026",
      sourceUrl:
        "https://theregister.com/2026/03/13/palantirs_maven_smart_system_iran/",
      date: "2026",
    },
  ],

  quizPool: [
    // ── 5 Multiple-Choice ──────────────────────────────────────────────────
    {
      id: "st6-mc-1",
      kind: "mc",
      frage:
        "Was leistet das KI-System Maven (Palantir) laut dem 10vor10-Bericht im Krieg?",
      optionen: [
        {
          label:
            "Es übernimmt eigenständig die Entscheidung zum Abschuss — ohne menschliche Freigabe und ohne Rückfrage beim Kommando.",
          feedback:
            "Falsch. Formell bleibt ein Mensch «in the loop». Die Kritik richtet sich nicht dagegen, dass die KI allein schiesst, sondern dass die menschliche Kontrolle in der Praxis nur noch oberflächlich ist.",
        },
        {
          label:
            "Es analysiert Satelliten- und Funkdaten in Echtzeit, erstellt ein digitales Lagebild und schlägt Waffensysteme vor.",
          feedback:
            "Richtig. Maven wertet Satellitenbilder, Funksignale und Social-Media-Daten aus und liefert innerhalb von Stunden ein Lagebild mit Ziel- und Waffenvorschlägen.",
        },
        {
          label:
            "Es ersetzt nur die Kommunikation zwischen Einheiten, trifft aber keine Ziel-Entscheidungen.",
          feedback:
            "Falsch. Maven identifiziert und priorisiert Ziele aktiv — das ist sein Kernzweck.",
        },
        {
          label:
            "Es ist ausschliesslich für Logistik zuständig — Munitionsnachschub und Truppenbewegungen.",
          feedback:
            "Falsch. Maven ist ein Targeting-System, kein Logistiksystem.",
        },
      ],
      correctIndices: [1],
      punkte: 1,
    },
    {
      id: "st6-mc-2",
      kind: "mc",
      frage:
        "Was bedeutet «Automation Bias» im Kontext von KI-gestützten Waffensystemen?",
      optionen: [
        {
          label:
            "Die Maschine wird mit der Zeit selbstständiger und braucht weniger menschliche Eingaben.",
          feedback:
            "Das beschreibt eher maschinelles Lernen, nicht Automation Bias.",
        },
        {
          label:
            "Soldaten misstrauen der KI grundsätzlich und prüfen jeden Vorschlag überkritisch nach.",
          feedback:
            "Das ist das Gegenteil. Automation Bias bedeutet, der Maschine mehr zu vertrauen als der eigenen Intuition.",
        },
        {
          label:
            "Menschen neigen dazu, KI-Entscheidungen unkritisch zu übernehmen — selbst wenn sie ahnen, dass etwas falsch sein könnte.",
          feedback:
            "Richtig. Die Expertin im Bericht erklärt: «Wir sagen, da ist irgendwas falsch bei uns und nicht beim System» — das wird im Kriegseinsatz besonders gefährlich.",
        },
        {
          label:
            "Automatisierte Systeme entwickeln mit zunehmender Nutzungsdauer eine Voreingenommenheit gegenüber bestimmten Gruppen, weil ihre Trainingsdaten nicht repräsentativ sind und systematisch bestimmte Bevölkerungsgruppen benachteiligen.",
          feedback:
            "Das beschreibt algorithmische Diskriminierung, nicht Automation Bias. Letzterer bezeichnet das menschliche Verhaltensmuster, Maschinenentscheidungen zu wenig zu hinterfragen.",
        },
      ],
      correctIndices: [2],
      punkte: 1,
    },
    {
      id: "st6-mc-3",
      kind: "mc",
      frage:
        "Wie viele Staaten stimmten im Dezember 2023 in der UN-Generalversammlung für die erste Resolution zu tödlichen autonomen Waffensystemen?",
      optionen: [
        {
          label: "27",
          feedback:
            "Zu wenig. Die Zustimmung war weit breiter — eine grosse Mehrheit der UN-Mitglieder.",
        },
        {
          label: "82",
          feedback:
            "Näher dran, aber immer noch zu tief. Die Mehrheit war deutlich grösser.",
        },
        {
          label: "152",
          feedback:
            "Richtig. 152 Staaten stimmten dafür, 4 dagegen (Belarus, Indien, Mali, Russland), 11 enthielten sich.",
        },
        {
          label:
            "152 Staaten stimmten zwar dafür, aber die Resolution ist rechtlich nicht bindend und enthält kein konkretes Verbot — sie ist im Wesentlichen eine Absichtserklärung ohne Durchsetzungsmechanismus.",
          feedback:
            "Dieser Satz ist inhaltlich korrekt, beantwortet aber nicht die gestellte Frage. Die Frage lautete: Wie viele Staaten stimmten dafür? Antwort: 152.",
        },
      ],
      correctIndices: [2],
      punkte: 1,
    },
    {
      id: "st6-mc-4",
      kind: "mc",
      frage:
        "Was war laut Pentagon-Untersuchungen die Ursache dafür, dass eine Mädchenschule im Süd-Iran getroffen wurde?",
      optionen: [
        {
          label:
            "Das Gebäude war in veralteten Datenbanken noch als Militärstützpunkt eingetragen.",
          feedback:
            "Richtig. Laut 10vor10-Bericht hatte die Datenbank das Gebäude nicht aktualisiert — eine Schule wurde so als Militärziel klassifiziert.",
        },
        {
          label: "Ein Hackerangriff manipulierte die Zieldaten in Echtzeit.",
          feedback:
            "Das wurde nicht als Ursache genannt. Der Bericht verweist auf fehlerhafte, veraltete Datenbankeinträge.",
        },
        {
          label:
            "Die KI erkannte die Schule korrekt, aber der Befehlshaber entschied sich trotzdem für den Angriff.",
          feedback:
            "Das widerspricht dem Bericht. Das Problem lag in den Eingabedaten der Datenbank, nicht in einer bewussten menschlichen Entscheidung gegen einen KI-Warnhinweis.",
        },
        {
          label:
            "Die Piloten ignorierten einen automatischen KI-Warnhinweis auf zivile Präsenz, weil der Zeitdruck zu gross war und die Einsatzdoktrin keine klare Verpflichtung zur Überprüfung solcher Warnungen enthielt.",
          feedback:
            "Das geht zu weit. Der Bericht nennt veraltete Datenbankeinträge als Ursache — es gab keinen überfahrenen Warnhinweis.",
        },
      ],
      correctIndices: [0],
      punkte: 1,
    },
    {
      id: "st6-mc-5",
      kind: "mc",
      frage:
        "Welches Unternehmen stieg 2018 nach Mitarbeiterprotesten aus dem US-Militärprojekt «Project Maven» aus?",
      optionen: [
        {
          label: "Meta",
          feedback: "Falsch. Meta war nicht an Project Maven beteiligt.",
        },
        {
          label: "Microsoft",
          feedback:
            "Falsch. Microsoft blieb Verteidigungsauftragnehmer. Das gesuchte Unternehmen ist ein anderer Tech-Konzern.",
        },
        {
          label: "Palantir",
          feedback:
            "Umgekehrt: Palantir stieg nach dem Austritt ein und übernahm die Arbeit.",
        },
        {
          label: "Google",
          feedback:
            "Richtig. Google verliess Project Maven 2018, nachdem Tausende Mitarbeitende einen offenen Brief unterzeichnet hatten, der den KI-Einsatz für militärisches Targeting ablehnte.",
        },
      ],
      correctIndices: [3],
      punkte: 1,
    },
    // ── 3 Wahr/Falsch ─────────────────────────────────────────────────────
    {
      id: "st6-tf-1",
      kind: "tf",
      aussage:
        "Das Maven-System erfasst Ziele und schlägt passende Waffensysteme vor.",
      correctAnswer: true,
      feedbackRichtig:
        "Richtig. Der 10vor10-Bericht beschreibt Maven genau so: Satellitenbilder, Funksignale und Social-Media-Daten fliessen ein — heraus kommen Zielvorschläge inklusive empfohlener Waffensysteme.",
      feedbackFalsch:
        "Diese Aussage ist wahr. Maven erstellt ein Echtzeit-Lagebild und schlägt sogar passende Waffensysteme vor — was früher Wochen dauerte, erledigt das System in Stunden.",
      punkte: 1,
    },
    {
      id: "st6-tf-2",
      kind: "tf",
      aussage:
        "Automation Bias bedeutet, dass Menschen einer Maschine grundsätzlich misstrauen und ihre Vorschläge immer kritisch hinterfragen.",
      correctAnswer: false,
      feedbackRichtig:
        "Richtig erkannt: Diese Aussage ist falsch. Automation Bias ist das Gegenteil — Menschen vertrauen Maschinen oft mehr als der eigenen Intuition und übernehmen deren Entscheidungen unkritisch.",
      feedbackFalsch:
        "Diese Aussage ist falsch. Automation Bias beschreibt die Tendenz, der Maschine zu viel zu vertrauen — nicht zu wenig. Die Expertin im Bericht: «Wir sagen, da ist irgendwas falsch bei uns und nicht beim System.»",
      punkte: 1,
    },
    {
      id: "st6-tf-3",
      kind: "tf",
      aussage:
        "Es gibt bereits ein rechtsverbindliches internationales Abkommen, das den Einsatz autonomer Waffensysteme verbietet.",
      correctAnswer: false,
      feedbackRichtig:
        "Richtig erkannt: Diese Aussage ist falsch. Trotz breiter UN-Unterstützung (152 Staaten, 2023) existiert bisher kein bindender Vertrag. UN und IKRK fordern einen solchen bis 2026.",
      feedbackFalsch:
        "Diese Aussage ist falsch. Es gibt keine bindende internationale Regelung. Die UN-Gespräche (CCW) laufen seit 2014 ohne substanzielles Ergebnis; Grossmächte blockieren via Konsensprinzip.",
      punkte: 1,
    },
  ],

  reflexion: "KI im Krieg könnte theoretisch …, real fürchte ich …",

  badges: [
    { familie: "ethik", anzahl: 2 },
    { familie: "gesellschaft", anzahl: 1 },
  ],
};

const station7: Station = {
  id: "station-7",
  nummer: 7,
  frage: "Wie funktioniert das überhaupt?",
  icon: "neurology",
  tags: ["Technologie"],

  subpages: {
    auftakt: {
      inhalt: "Station 7 · Technologie — Subpage 1/7: Auftakt",
      dauerMin: 3,
      lernziel:
        "Du hältst deine erste Vermutung fest: Weiss die KI, was sie dir antwortet — oder rät sie nur?",
      anleitung:
        "Beantworte die drei kurzen Fragen. Deine Antwort ist anonym — es gibt kein Richtig oder Falsch.",
    },
    sonne: {
      inhalt: "Station 7 · Technologie — Subpage 2/7: Sonnenseite",
      dauerMin: 5,
      lernziel:
        "Du kannst in eigenen Worten erklären, wie ein Sprachmodell das nächste Wort vorhersagt und warum es sich dabei auf riesige Textmengen stützt.",
      anleitung:
        "Schau den Ausschnitt (ca. 3 min, deutsche Audiospur). Achte darauf, was «Training» und «Gewichte» konkret bedeuten. Danach notiere dir einen Satz: «Ein Sprachmodell macht eigentlich …»",
    },
    schatten: {
      inhalt: "Station 7 · Technologie — Subpage 3/7: Schattenseite",
      dauerMin: 4,
      lernziel:
        "Du erkennst, warum kein Mensch — nicht einmal die Entwickler:innen — genau weiss, warum ein Modell genau diese Antwort gibt, und was das für Halluzinationen bedeutet.",
      anleitung:
        "Schau den zweiten Ausschnitt (ca. 45 s). Der Satz «Es ist unglaublich schwer zu sagen, warum das Modell diese Vorhersage macht» ist der Kern. Überlege danach: Was bedeutet das für eine Antwort, die falsch klingt, aber überzeugend wirkt?",
    },
    swipe: {
      inhalt: "Station 7 · Technologie — Subpage 4/7: Werte",
      dauerMin: 2,
      lernziel:
        "Du verortest dich zu drei Aussagen über Technik-Vertrauen und Transparenz.",
      anleitung:
        "Wische nach rechts (zustimmen) oder links (ablehnen). Kein Richtig oder Falsch — es geht um deine Haltung.",
    },
    fakten: {
      inhalt: "Station 7 · Technologie — Subpage 5/7: Faktencheck",
      dauerMin: 3,
      lernziel:
        "Du kennst 5–6 belegte Zahlen und Befunde dazu, wie zuverlässig Sprachmodelle sind — und wo sie systematisch scheitern.",
      anleitung:
        "Lies jede Karte in Ruhe. Quelle und Datum stehen unten. Diese Fakten sind unbenotet — sie ergänzen das Video.",
    },
    quiz: {
      inhalt: "Station 7 · Technologie — Subpage 6/7: Quiz",
      dauerMin: 3,
      lernziel:
        "Du prüfst, ob du die Kernbegriffe (Token, Training, Halluzination, Wahrscheinlichkeit) anwenden kannst.",
      anleitung:
        "Beantworte die restlichen Fragen aus dem Pool — eine nach der anderen. Lies die Rückmeldung nach jeder Frage; sie erklärt, warum die Antwort stimmt oder nicht.",
    },
    befund: {
      inhalt: "Station 7 · Technologie — Subpage 7/7: Befund",
      dauerMin: 2,
      lernziel:
        "Du vergleichst deine heutige Einschätzung mit der vom Anfang und erhältst dein Tech-Badge.",
      anleitung:
        "Beantworte dieselben drei Fragen wie zu Beginn. Dann schreibe einen Satz — er bleibt nur bei dir. Danach gibt es dein Badge.",
    },
  },

  polls: [
    // poll[0] — PollSlider (Leit-Frage, Technik-Vertrauen)
    {
      id: "st7-vertrauen",
      pollId: "st7-vertrauen",
      frage:
        "Jetzt weisst du, dass die KI das nächste Wort rät — wie sehr vertraust du ihr?",
      landkarteAxis: "technik-vertrauen",
      prePost: true,
      format: "slider",
      achse: { links: "skeptisch", rechts: "zutraulich" },
    },
    // poll[1] — PollSkala4
    {
      id: "st7-poll-2",
      pollId: "st7-poll-2",
      frage: "Ich verstehe jetzt grob, wie ein Sprachmodell funktioniert.",
      landkarteAxis: "technik-vertrauen",
      prePost: true,
      format: "skala4",
      optionen: [
        "trifft gar nicht zu",
        "eher nicht zu",
        "eher zu",
        "trifft voll zu",
      ],
    },
    // poll[2] — PollSkala4
    {
      id: "st7-poll-3",
      pollId: "st7-poll-3",
      frage: "Ich vertraue darauf, dass die Antworten der KI stimmen.",
      landkarteAxis: "technik-vertrauen",
      prePost: true,
      format: "skala4",
      optionen: [
        "trifft gar nicht zu",
        "eher nicht zu",
        "eher zu",
        "trifft voll zu",
      ],
    },
  ],

  sonnenseite: {
    intro:
      "Chatbots klingen so, als würden sie verstehen, was du schreibst. Was steckt wirklich dahinter?",
    anleitung:
      "Schau den Ausschnitt (ca. 3 min). Achte darauf, was «Training» und «Gewichte» bedeuten. Danach: Kannst du in einem Satz erklären, was ein Sprachmodell eigentlich macht?",
    media: [
      {
        kind: "youtube",
        youtubeId: "LPZh9BOjkQs",
        title:
          "3Blue1Brown — Grosse Sprachmodelle kurz erklärt (deutsch)",
        sourceKey: "3blue1brown-llm-explainer",
        externalUrl: "https://www.youtube.com/watch?v=LPZh9BOjkQs",
        // 0:33 – 3:45 (s): «When you interact with a chatbot…» bis Ende Backpropagation
        start: 33,
        end: 225,
      },
    ],
  },

  schattenseite: {
    intro:
      "Das Modell klingt immer überzeugend. Aber niemand — nicht einmal die Entwickler:innen — kann genau sagen, warum es diese Antwort gewählt hat.",
    anleitung:
      "Schau den kurzen Abschnitt am Ende des Videos. Dann überleg: Was bedeutet «emergentes Verhalten» für eine Antwort, die falsch ist, aber überzeugend wirkt?",
    media: [
      {
        kind: "youtube",
        youtubeId: "LPZh9BOjkQs",
        title:
          "3Blue1Brown — Grosse Sprachmodelle kurz erklärt (deutsch)",
        sourceKey: "3blue1brown-llm-explainer",
        externalUrl: "https://www.youtube.com/watch?v=LPZh9BOjkQs",
        // 6:22 – 7:05 (s): Wahrscheinlichkeit bleibt Wahrscheinlichkeit + «incredibly challenging to determine why»
        start: 382,
        end: 425,
      },
    ],
  },

  swipe: [
    {
      id: "st7-swipe-1",
      aussage:
        "Wenn eine KI Fehler macht, sollte der Staat eingreifen und Standards erzwingen.",
      achse: { links: "Firmen selbst regulieren", rechts: "Staat muss eingreifen" },
      profilKey: "regulierung-innovation",
    },
    {
      id: "st7-swipe-2",
      aussage:
        "Bei wichtigen Entscheidungen sollte immer ein Mensch die KI-Antwort prüfen — auch wenn es länger dauert.",
      achse: { links: "Effizienz zählt mehr", rechts: "Mensch muss kontrollieren" },
      profilKey: "menschloop-effizienz",
    },
    {
      id: "st7-swipe-3",
      aussage:
        "Mir ist egal, ob ein Chatbot meine Eingaben für Werbung nutzt — solange er mir hilft.",
      achse: { links: "Datenschutz zuerst", rechts: "Bequemlichkeit zuerst" },
      profilKey: "datenschutz-bequemlichkeit",
    },
  ],

  fakten: [
    {
      id: "st7-fakt-1",
      claim:
        "Grosse Sprachmodelle sagen im Kern das nächste «Token» (Wortteil) voraus — sie «verstehen» Inhalte nicht wie ein Mensch, sondern berechnen statistische Wahrscheinlichkeiten.",
      sourceName: "OpenAI, «Why Language Models Hallucinate», arXiv:2509.04664",
      sourceUrl: "https://arxiv.org/abs/2509.04664",
      date: "2025-09",
    },
    {
      id: "st7-fakt-2",
      claim:
        "Halluzinationen entstehen, weil gängige Trainings-Methoden das Raten belohnen und Unsicherheit bestrafen. Ein Modell mit 75 % Fehlerquote enthielt sich nur bei 1 % der Fragen — ein Modell, das öfter «Ich weiss es nicht» sagt, macht deutlich weniger Fehler.",
      figure: "75 % Fehler / 1 % Enthaltung (OpenAI-Vergleichsmodell)",
      sourceName: "OpenAI, «Why Language Models Hallucinate», arXiv:2509.04664",
      sourceUrl: "https://arxiv.org/abs/2509.04664",
      date: "2025-09",
    },
    {
      id: "st7-fakt-3",
      claim:
        "In einem neuen Benchmark lagen die Halluzinationsraten über 26 Top-Modelle zwischen 22 % und 94 %. Selbst bekannte Modelle wie GPT-4o fielen von 98,2 % auf 64,4 % Genauigkeit — KI klingt immer überzeugend, auch wenn sie falsch liegt.",
      figure: "22–94 % Halluzinationsrate (Stanford AI Index 2026)",
      sourceName: "Stanford HAI, AI Index 2026",
      sourceUrl: "https://hai.stanford.edu/ai-index/2026-ai-index-report/responsible-ai",
      date: "2026",
    },
    {
      id: "st7-fakt-4",
      claim:
        "Die Kosten für eine KI-Abfrage auf GPT-3.5-Niveau fielen von 20 Dollar (November 2022) auf 0,07 Dollar pro Million Token (Oktober 2024) — über 280-mal günstiger in weniger als zwei Jahren.",
      figure: "> 280-fache Kostenreduktion",
      sourceName: "Stanford HAI, «AI Index 2025: State of AI in 10 Charts»",
      sourceUrl: "https://hai.stanford.edu/news/ai-index-2025-state-of-ai-in-10-charts",
      date: "2025",
    },
    {
      id: "st7-fakt-5",
      claim:
        "Was du einem Chatbot schreibst, bleibt nicht immer privat: Meta nutzt Chat-Inhalte seiner KI ab Dezember 2025 zur Werbeschaltung. Prüfe die Datenschutz-Einstellungen, bevor du persönliche Dinge eintippst.",
      sourceName: "US PIRG Education Fund, «AI Chatbot Therapy»",
      sourceUrl: "https://pirg.org/edfund/resources/ai-chatbot-therapy/",
      date: "2025",
    },
    {
      id: "st7-fakt-6",
      claim:
        "Auf dem Programmier-Benchmark SWE-bench Verified stieg die KI-Leistung in einem Jahr von rund 60 % auf nahezu 100 %. Sprachmodelle verbessern sich bei konkreten Aufgaben rasant — die Entwicklung steht nicht still.",
      figure: "~60 % → ~100 % in einem Jahr",
      sourceName: "Stanford HAI, AI Index 2026",
      sourceUrl: "https://hai.stanford.edu/ai-index/2026-ai-index-report",
      date: "2026",
    },
  ],

  quizPool: [
    // ─── 5 MC ───────────────────────────────────────────────────────────────
    {
      id: "st7-mc-1",
      kind: "mc",
      frage: "Was macht ein grosses Sprachmodell (LLM) im Kern?",
      optionen: [
        {
          label: "Es berechnet für jedes mögliche nächste Wort eine Wahrscheinlichkeit.",
          feedback:
            "✔ Genau: Das Modell gibt keine feste Antwort zurück, sondern eine Verteilung über alle möglichen nächsten Wörter.",
        },
        {
          // LANGER DISTRAKTOR
          label:
            "Es durchsucht eine gespeicherte Datenbank aller je geschriebenen Sätze und gibt den passendsten zurück.",
          feedback:
            "Falsch: LLMs haben keine Datenbank, die sie «nachschlagen». Sie berechnen Wahrscheinlichkeiten anhand erlernter Muster — gespeicherte Sätze werden nicht direkt abgerufen.",
        },
        {
          label:
            "Es übersetzt Fragen in eine formale Logiksprache und berechnet die korrekte Antwort.",
          feedback:
            "Falsch: LLMs arbeiten nicht mit formaler Logik, sondern mit statistischen Mustern aus Trainingsdaten.",
        },
        {
          label: "Es fragt bei jedem Schritt eine externe Wissensdatenbank an.",
          feedback:
            "Falsch: Standard-LLMs haben keinen Live-Zugriff auf externe Quellen; sie greifen nur auf Trainingsmuster zurück.",
        },
      ],
      correctIndices: [0],
    },
    {
      id: "st7-mc-2",
      kind: "mc",
      frage: "Warum halluzinieren Sprachmodelle?",
      optionen: [
        {
          label:
            "Weil beim Training das Raten belohnt und das Eingestehen von Unsicherheit bestraft wurde.",
          feedback:
            "✔ OpenAI erklärt genau das: Modelle werden auf «eine Antwort geben» trainiert, nicht auf «ich weiss es nicht» — das fördert Halluzinationen.",
        },
        {
          // LANGER DISTRAKTOR
          label:
            "Weil die Entwicklerinnen und Entwickler absichtlich falsche Informationen ins Training einspeisen, um die Reaktionen der Nutzerinnen und Nutzer zu testen und die Modelle schrittweise zu verbessern.",
          feedback:
            "Falsch: Halluzinationen sind kein absichtliches Feature. Sie entstehen aus dem Trainingsverfahren, nicht aus eingespeisten Fehlern.",
        },
        {
          label: "Weil die Modelle zu wenig Daten hatten.",
          feedback:
            "Falsch: Halluzinationen treten auch bei sehr grossen Modellen mit riesigen Datensätzen auf — das Problem liegt im Verfahren, nicht allein im Datenumfang.",
        },
        {
          label: "Weil sie nach jedem Update neu trainiert werden müssen.",
          feedback:
            "Falsch: Halluzinationen hängen nicht vom Update-Zyklus ab, sondern von der Grundstruktur des Trainings.",
        },
      ],
      correctIndices: [0],
    },
    {
      id: "st7-mc-3",
      kind: "mc",
      frage:
        "Wie stark schwankten die Halluzinationsraten über 26 Top-Modelle im Stanford-AI-Index-2026-Benchmark?",
      optionen: [
        {
          label: "Von 22 % bis 94 %.",
          feedback:
            "✔ Genau diese Spannweite ermittelte der Stanford AI Index 2026 — auch bekannte Modelle lagen weit auseinander.",
        },
        {
          label: "Von 1 % bis 5 %.",
          feedback:
            "Falsch: Solch niedrige Werte werden im Benchmark nicht erreicht. Halluzinationsraten sind deutlich höher.",
        },
        {
          // LANGER DISTRAKTOR
          label:
            "Zwischen 10 % und 15 %, also in einem engen Band, das zeigt, dass alle aktuellen Modelle ein ähnlich hohes Qualitätsniveau erreicht haben.",
          feedback:
            "Falsch: Die Spannweite ist mit 22–94 % ausserordentlich gross — von einem einheitlichen Qualitätsniveau kann keine Rede sein.",
        },
        {
          label: "Von 50 % bis 60 %.",
          feedback:
            "Falsch: Das trifft die Mitte des Bereichs, aber die Extremwerte liegen viel weiter auseinander.",
        },
      ],
      correctIndices: [0],
    },
    {
      id: "st7-mc-4",
      kind: "mc",
      frage:
        "Um wie viel sanken die Kosten für eine KI-Abfrage auf GPT-3.5-Niveau zwischen November 2022 und Oktober 2024?",
      optionen: [
        {
          label:
            "Um mehr als das 280-Fache — von 20 $ auf 0,07 $ pro Million Token.",
          feedback:
            "✔ Laut Stanford HAI AI Index 2025 fielen die Kosten in knapp zwei Jahren über 280-fach. Das zeigt, wie schnell KI-Nutzung für viele erschwinglich wird.",
        },
        {
          label: "Um rund 10 %.",
          feedback:
            "Falsch: Die Kostenreduktion war dramatisch — weit mehr als 10 %.",
        },
        {
          // LANGER DISTRAKTOR
          label:
            "Um das Doppelte, was zwar erheblich ist, aber in der Tech-Branche als normale jährliche Effizienzsteigerung gilt und keinen besonderen Kommentar verdient.",
          feedback:
            "Falsch: Eine Verdopplung wäre noch keine Besonderheit — aber eine 280-fache Reduktion in zwei Jahren ist aussergewöhnlich und spricht für ein fundamentales Skalierungspotenzial.",
        },
        {
          label: "Um rund das 10-Fache.",
          feedback:
            "Falsch: Die tatsächliche Reduktion war mit über 280-fach erheblich stärker.",
        },
      ],
      correctIndices: [0],
    },
    {
      id: "st7-mc-5",
      kind: "mc",
      frage:
        "Was bezeichnet der Begriff «Token» im Kontext von Sprachmodellen?",
      optionen: [
        {
          label:
            "Eine Einheit aus Text, die kleiner als ein Wort sein kann — z. B. ein Wortteil oder ein Satzzeichen.",
          feedback:
            "✔ Genau: Ein Token kann ein ganzes Wort, aber auch nur ein Wortteil oder ein einzelnes Zeichen sein. Modelle verarbeiten Texte als Folge von Tokens.",
        },
        {
          label:
            "Ein Sicherheitsschlüssel, den Nutzerinnen und Nutzer eingeben müssen, um auf ein KI-Modell zuzugreifen.",
          feedback:
            "Falsch: «Token» als Authentifizierungs-Schlüssel ist ein anderer Begriff. Im Sprachmodell-Kontext ist ein Token eine Texteinheit.",
        },
        {
          // LANGER DISTRAKTOR
          label:
            "Ein Qualitäts-Zertifikat, das eine Aufsichtsbehörde einem Sprachmodell erteilt, nachdem es einen definierten Sicherheitstest bestanden hat und für den Einsatz in der Öffentlichkeit zugelassen wurde.",
          feedback:
            "Falsch: Token hat in diesem Kontext nichts mit Zertifizierung zu tun. Es ist schlicht die kleinste Verarbeitungseinheit im Modell — ungefähr ein Wortteil oder ein Zeichen.",
        },
        {
          label:
            "Die endgültige, korrekte Antwort, die ein Modell nach der Berechnung ausgibt.",
          feedback:
            "Falsch: Ein Token ist nicht die fertige Antwort, sondern ein kleiner Textbaustein. Die Antwort entsteht durch viele nacheinander erzeugte Tokens.",
        },
      ],
      correctIndices: [0],
    },
    // ─── 3 TF ────────────────────────────────────────────────────────────────
    {
      id: "st7-tf-1",
      kind: "tf",
      aussage:
        "Ein Sprachmodell, das öfter «Ich weiss es nicht» sagt, macht tendenziell weniger Fehler.",
      correctAnswer: true,
      feedbackRichtig:
        "Genau — OpenAI zeigt in ihrem Halluzinations-Paper, dass Modelle, die sich enthalten dürfen, deutlich niedrigere Fehlerquoten erreichen. «Ich weiss es nicht» ist ein Zeichen von Qualität, nicht von Schwäche.",
      feedbackFalsch:
        "Schau nochmals auf Faktencheck-Karte 2: Das OpenAI-Papier zeigt genau das Gegenteil — ein Modell, das sich öfter enthält, macht deutlich weniger Fehler.",
    },
    {
      id: "st7-tf-2",
      kind: "tf",
      aussage:
        "Ein grosses Sprachmodell versteht Inhalte so, wie ein Mensch sie versteht.",
      correctAnswer: false,
      feedbackRichtig:
        "Richtig — ein LLM berechnet Wahrscheinlichkeiten für das nächste Token. Es hat kein Bewusstsein, kein Faktenwissen im menschlichen Sinn und kein «Verstehen» im kognitiven Sinn.",
      feedbackFalsch:
        "Das klingt plausibel — aber ein LLM «versteht» nicht. Es berechnet, welches Token als nächstes am wahrscheinlichsten ist. Das Resultat wirkt verständig, ohne es zu sein.",
    },
    {
      id: "st7-tf-3",
      kind: "tf",
      aussage:
        "Ein grosses Sprachmodell berechnet bei jedem Schritt das wahrscheinlichste nächste Wort (Token).",
      correctAnswer: true,
      feedbackRichtig:
        "Genau — das ist der Kern. Das Modell gibt eine Wahrscheinlichkeitsverteilung über alle möglichen Tokens zurück und wählt (mit einem kontrollierten Zufallselement) daraus aus.",
      feedbackFalsch:
        "Das Modell «rät» das nächste Wort anhand gelernter Wahrscheinlichkeiten — das ist sein Kern-Mechanismus. Schau die ersten 30 Sekunden des Clips noch einmal.",
    },
  ],

  reflexion:
    "Jetzt, wo ich weiss, dass KI Wörter «rät», vertraue ich ihr bei … und misstraue ihr bei …",

  badges: [{ familie: "tech", anzahl: 2 }],
};

export const STATIONEN_V3: Station[] = [
  station1,
  station2,
  station3,
  station4,
  station5,
  station6,
  station7,
];
