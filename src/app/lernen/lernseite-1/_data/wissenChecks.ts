/**
 * Wissen-Check-Bänke (Lernseite 1, Pietro) — Handoff v2 §5/§9.
 *
 * Eine Gruppe (≥2 Fragen, Mix MC + Richtig/Falsch) pro eingebettetem Clip-Block
 * (Hauptgang/Dessert). Inhaltlich aus den lokalen Transkripten belegt
 * (docs/material-pietro/transcripts/*).
 *
 * Verbindliche Stil-Regeln (§5):
 *  - Distraktor-Längen-Regel: mind. EIN falscher Distraktor ist LÄNGER als die
 *    richtige Antwort (sonst lernen SuS "richtig = längste").
 *  - Fett-Diskriminator: 1–2 gezielt gefettete Fragmente (**…**) pro Frage —
 *    die getestete Zahl/Aussage, nicht der ganze Satz.
 *  - Feedback je Option/Aussage.
 *  - Tonal bewertungsfrei: "Wissen-Check", nie "Test"/"Note".
 *
 * Die richtige Antwort steht bewusst NICHT immer an Position 0.
 */

import type { WissenCheckGruppeSpec } from "../_components/WissenCheckGruppe";

/* ── Auftakt · Opener (einstein-full 2:18–5:43) ───────────────────────────── */

export const WC_OPENER: WissenCheckGruppeSpec = {
  id: "wc-opener",
  titel: "Wissen-Check — der Einstieg",
  checks: [
    {
      id: "wc-opener-ava",
      kind: "mc",
      frage: "Was ist **Ava**, die in der Sendung mitmoderiert?",
      optionen: [
        {
          label:
            "Eine bekannte Moderatorin, die seit vielen Jahren beim Schweizer Fernsehen Wissenschaftssendungen präsentiert",
          feedback: "Falsch — Ava ist kein Mensch, sondern ein eigens programmierter KI-Avatar.",
        },
        {
          label: "Ein KI-Avatar, den SRF extra für die KI-Woche programmiert hat",
          feedback: "Richtig — Ava stellt sich selbst als KI vor, die Texte versteht und generiert.",
        },
        {
          label: "Ein Roboter aus dem ETH-Labor",
          feedback: "Falsch — Ava ist eine Software-Figur am Bildschirm, kein physischer Roboter.",
        },
      ],
      correctIndices: [1],
    },
    {
      id: "wc-opener-tf-experimente",
      kind: "tf",
      aussage:
        "Die Sendung kündigt **Live-Experimente** mit KI an, die laut Moderation auch scheitern können.",
      correctAnswer: true,
      feedbackRichtig: "Richtig — genau das sagt die Moderation: Die Experimente können auch grandios scheitern.",
      feedbackFalsch: "Doch — die Moderation betont ausdrücklich, dass die Live-Experimente scheitern können.",
    },
  ],
};

/* ── Station 1 · Hauptgang — what-the-fake (13:52–18:30) ───────────────────── */

export const WC_S1_HAUPTGANG: WissenCheckGruppeSpec = {
  id: "wc-s1-hauptgang",
  titel: "Wissen-Check — Teilen oder nicht?",
  checks: [
    {
      id: "wc-s1h-baer",
      kind: "mc",
      frage: "Warum würde Maël das (gefälschte) **Bären-Video** trotzdem teilen?",
      optionen: [
        {
          label:
            "Weil er sicher ist, dass es echt ist, und seine Freunde unbedingt über diese gefährliche Situation in der Stadt informieren möchte",
          feedback: "Falsch — er weiss, dass es nicht echt ist, und teilt es trotzdem.",
        },
        {
          label: "Weil er es einfach **lustig und unterhaltsam** findet",
          feedback: "Richtig — ob es fake ist, spielt für ihn keine Rolle; es ist einfach ein lustiges Bild.",
        },
        {
          label: "Weil ihn jemand dafür bezahlt",
          feedback: "Falsch — von Bezahlung ist im Beitrag keine Rede.",
        },
      ],
      correctIndices: [1],
    },
    {
      id: "wc-s1h-gesetz",
      kind: "mc",
      frage: "Welches Fake erfand ein Video über ein angebliches neues **Gesetz**?",
      optionen: [
        {
          label: "Ein Wasserspargesetz: Die Polizei kontrolliere die **Spültechnik von Toiletten**",
          feedback: "Richtig — das Fake behauptet, die Polizei prüfe die 2-Liter-Regel an Toiletten.",
        },
        {
          label:
            "Ein neues Verkehrsgesetz, nach dem auf allen Schweizer Autobahnen ab sofort nur noch Tempo 100 statt 120 erlaubt sein soll",
          feedback: "Falsch — im Beitrag geht es um ein erfundenes Wasserspargesetz, nicht um Tempolimits.",
        },
        {
          label: "Ein Verbot von Social Media für unter 16-Jährige",
          feedback: "Falsch — das kommt in diesem Ausschnitt nicht vor.",
        },
      ],
      correctIndices: [0],
    },
    {
      id: "wc-s1h-tf-status",
      kind: "tf",
      aussage:
        "Laut der Medienwissenschaftlerin spielt es beim Teilen oft eine **kleinere Rolle**, ob ein Inhalt echt ist — wichtiger ist, ob er in der Peer-Group gut ankommt.",
      correctAnswer: true,
      feedbackRichtig: "Richtig — beim Teilen zählt eher der soziale Status als der Wahrheitsgehalt.",
      feedbackFalsch: "Doch — sie sagt, beim Teilen sei der soziale Status oft wichtiger als die Frage echt/fake.",
    },
    {
      id: "wc-s1h-tf-menschenrecht",
      kind: "tf",
      aussage: "Der Experte sagt, es sei ein **Menschenrecht**, alles teilen zu dürfen.",
      correctAnswer: false,
      feedbackRichtig: "Richtig — er sagt das Gegenteil: «Es ist kein Menschenrecht, etwas teilen zu können.»",
      feedbackFalsch: "Falsch — der Experte sagt ausdrücklich, es sei KEIN Menschenrecht, alles zu teilen.",
    },
  ],
};

/* ── Station 1 · Dessert — rundschau-ki-kriminalität (§9.1) ────────────────── */

export const WC_S1_DESSERT: WissenCheckGruppeSpec = {
  id: "wc-s1-dessert",
  titel: "Wissen-Check — Deepfake-Betrug",
  checks: [
    {
      id: "wc-s1-hongkong",
      kind: "mc",
      frage:
        "Wie viel Geld überwies der Angestellte in **Hongkong** nach einer gefälschten Videokonferenz?",
      optionen: [
        { label: "25 Millionen Dollar", feedback: "Richtig — nur eine Person im Call war echt, das Opfer überwies 25 Mio. $." },
        {
          label: "Rund 250'000 Franken, die später von der Bank teilweise zurückgeholt werden konnten",
          feedback: "Falsch — der Beitrag nennt 25 Mio. $, und von einer Rückholung ist keine Rede.",
        },
        { label: "Etwa eine halbe Million Euro", feedback: "Falsch — die genannte Summe ist viel höher (25 Mio. $)." },
      ],
      correctIndices: [0],
    },
    {
      id: "wc-s1-quote",
      kind: "mc",
      frage: "Wie viele Mitarbeitende fallen laut Swiss Infosec auf einen **gefälschten CEO-Anruf** herein?",
      optionen: [
        { label: "Rund 50–60 %", feedback: "Richtig — diese Quote nennt der Sicherheitsberater im Test." },
        {
          label: "Weniger als 5 %, weil die meisten den falschen Tonfall sofort bemerken und auflegen",
          feedback: "Falsch — die reale Quote ist viel höher (50–60 %).",
        },
        { label: "Praktisch alle (über 95 %)", feedback: "Falsch — es sind 50–60 %, nicht fast alle." },
      ],
      correctIndices: [0],
    },
    {
      id: "wc-s1-tf-dialekt",
      kind: "tf",
      aussage: "Die Deepfake-Software imitierte den **Berner Dialekt** der Moderatorin nur schlecht.",
      correctAnswer: true,
      feedbackRichtig: "Richtig — genau das zeigt der Test: der Dialekt war die Schwachstelle.",
      feedbackFalsch: "Doch — der Beitrag betont, der Berner Dialekt sei nur schlecht imitiert worden.",
    },
    {
      id: "wc-s1-tf-verfuegbar",
      kind: "tf",
      aussage: "Deepfake-Programme sind teuer und nur für Spezialisten mit teurer Hardware zugänglich.",
      correctAnswer: false,
      feedbackRichtig: "Richtig — der Beitrag sagt das Gegenteil: frei erhältlich, Abos ab wenigen Franken im Monat.",
      feedbackFalsch: "Falsch — sie sind frei im Internet erhältlich, die günstigsten Abos kosten wenige Franken.",
    },
  ],
};

/* ── Station 2 · Hauptgang — news-ki-arbeitsplätze + einstein-mimic ────────── */

export const WC_S2_HAUPTGANG: WissenCheckGruppeSpec = {
  id: "wc-s2-hauptgang",
  titel: "Wissen-Check — KI & Arbeit",
  checks: [
    {
      id: "wc-s2h-anteil",
      kind: "mc",
      frage:
        "Wie viele der rund 3 Mio. untersuchten Arbeitsplätze in der Schweiz sind laut Studie von KI **betroffen**?",
      optionen: [
        {
          label: "Nur etwa 3 %, vor allem in der Industrie, wo Maschinen schon lange Routinearbeiten übernehmen",
          feedback: "Falsch — die Studie nennt einen viel höheren Anteil (rund ein Viertel).",
        },
        { label: "Rund ein **Viertel (etwa 28 %)**", feedback: "Richtig — die Studie spricht von mehr als einem Viertel, rund 28 %." },
        { label: "Praktisch alle Arbeitsplätze", feedback: "Falsch — es ist rund ein Viertel, nicht alle." },
      ],
      correctIndices: [1],
    },
    {
      id: "wc-s2h-mimic",
      kind: "mc",
      frage: "Wie bringt das ETH-Spin-off **Mimic** der Roboterhand eine neue Aufgabe bei?",
      optionen: [
        {
          label:
            "In zwei Schritten: zuerst mit vielen **Videos menschlicher Hände**, dann mit einer konkreten Aufnahme per Sensor-Handschuh",
          feedback: "Richtig — Grundverständnis aus Videos, dann Feintuning für die spezifische Aufgabe.",
        },
        {
          label:
            "Indem ein Programmierer für jede einzelne Bewegung von Hand exakte Koordinaten in den Computer eingibt und alles vorab durchtestet",
          feedback: "Falsch — die Hand wird gerade NICHT mehr klassisch programmiert, sondern lernt vom Menschen.",
        },
        { label: "Gar nicht — sie kann von Anfang an alles", feedback: "Falsch — sie muss für neue Objekte erst trainiert werden." },
      ],
      correctIndices: [0],
    },
    {
      id: "wc-s2h-tf-abbau",
      kind: "tf",
      aussage: "Laut Studie bedeutet «von KI betroffen» automatisch, dass diese Stellen **abgebaut** werden.",
      correctAnswer: false,
      feedbackRichtig: "Richtig — der Beitrag sagt: nicht Abbau, sondern die Arbeit verändert sich.",
      feedbackFalsch: "Falsch — betroffen heisst, die Arbeit verändert sich — nicht zwingend Stellenabbau.",
    },
    {
      id: "wc-s2h-tf-englisch",
      kind: "tf",
      aussage: "Die Mimic-Roboterhand versteht im Moment Befehle vor allem auf **Englisch** — Schweizerdeutsch ist noch schwierig.",
      correctAnswer: true,
      feedbackRichtig: "Richtig — der Prototyp funktioniert vorerst auf Englisch.",
      feedbackFalsch: "Doch — im Beitrag funktioniert die Hand nur auf Englisch, Schweizerdeutsch noch nicht.",
    },
  ],
};

/* ── Station 2 · Dessert — kassensturz-ausbeutung (21:14–31:40) ────────────── */

export const WC_S2_DESSERT: WissenCheckGruppeSpec = {
  id: "wc-s2-dessert",
  titel: "Wissen-Check — die Datenarbeit dahinter",
  checks: [
    {
      id: "wc-s2d-lohn",
      kind: "mc",
      frage: "Wie viel verdiente die Annotatorin «Alice» bei einem Meta-Subunternehmer **pro Monat**?",
      optionen: [
        {
          label:
            "Etwa 3'000 Franken, also einen für kenianische Verhältnisse sehr ordentlichen und gut abgesicherten Lohn",
          feedback: "Falsch — ihr Lohn war viel tiefer und reichte kaum zum Leben.",
        },
        { label: "Rund **180 Franken** (30'000 Kenia-Schilling)", feedback: "Richtig — das reicht in Nairobi bei Weitem nicht zum Leben." },
        { label: "Gar nichts, sie arbeitete unbezahlt", feedback: "Falsch — sie wurde bezahlt, aber sehr wenig (~180 Fr.)." },
      ],
      correctIndices: [1],
    },
    {
      id: "wc-s2d-tiktok",
      kind: "mc",
      frage: "Wie viel der unangemessenen Inhalte filtert auf **TikTok** laut Beitrag die KI — und was ist mit dem Rest?",
      optionen: [
        { label: "**85 %** filtert die KI; den Rest müssen Menschen im Hintergrund prüfen", feedback: "Richtig — 85 % KI, der Rest geht an Content-Moderatoren." },
        {
          label:
            "100 %, die KI filtert inzwischen alles vollautomatisch, sodass gar keine menschlichen Moderatoren mehr nötig sind",
          feedback: "Falsch — die KI ist nicht perfekt; den Rest übernehmen Menschen.",
        },
        { label: "Nur etwa 15 %, fast alles machen Menschen", feedback: "Falsch — es ist umgekehrt: 85 % KI, der Rest Menschen." },
      ],
      correctIndices: [0],
    },
    {
      id: "wc-s2d-tf-ausbeutung",
      kind: "tf",
      aussage:
        "Die Anwältin Mercy Mutemi bezeichnet den KI-Sektor in Kenia als **Ausbeutungsmodell** — bis hin zu Menschenhandel bzw. Zwangsarbeit.",
      correctAnswer: true,
      feedbackRichtig: "Richtig — sie wirft Meta sogar Menschenhandel und Zwangsarbeit vor.",
      feedbackFalsch: "Doch — sie spricht ausdrücklich von einem Ausbeutungsmodell mit Menschenhandel/Zwangsarbeit.",
    },
    {
      id: "wc-s2d-tf-harmlos",
      kind: "tf",
      aussage: "Die Datenarbeit ist harmlos — die Annotatoren bekommen nie verstörende Inhalte zu sehen.",
      correctAnswer: false,
      feedbackRichtig: "Richtig — der Beitrag zeigt das Gegenteil: monatelang Pornografie, Gewalt, Suizide.",
      feedbackFalsch: "Falsch — ein Mann musste 8 Monate lang täglich verstörende Videos sichten, mit schweren Folgen.",
    },
  ],
};

/* ── Station 3 · Hauptgang — einstein-ki-im-kopf (11:30–14:00) ─────────────── */

export const WC_S3_HAUPTGANG: WissenCheckGruppeSpec = {
  id: "wc-s3-hauptgang",
  titel: "Wissen-Check — Lisa baut ihre KI",
  checks: [
    {
      id: "wc-s3h-was",
      kind: "mc",
      frage: "Was macht Lisas selbstgebaute **KI**?",
      optionen: [
        {
          label:
            "Sie schreibt für Lisa automatisch die Hausaufgaben und korrigiert nebenbei auch noch die Texte ihrer Mitschülerinnen",
          feedback: "Falsch — Lisas KI hat mit Hausaufgaben nichts zu tun.",
        },
        { label: "Sie erkennt auf einem Foto, ob ein Zimmer **aufgeräumt** ist oder nicht", feedback: "Richtig — die KI beurteilt «clean» oder «messy»." },
        { label: "Sie spielt Monopoly", feedback: "Falsch — das war ein anderes Projekt in der Challenge, nicht Lisas." },
      ],
      correctIndices: [1],
    },
    {
      id: "wc-s3h-training",
      kind: "mc",
      frage: "Wie hat Lisa ihre KI **trainiert**?",
      optionen: [
        { label: "Sie sortierte **20'000 Bilder** von Hand in «clean» und «messy»", feedback: "Richtig — drei Monate lang, jedes Bild selbst kategorisiert." },
        {
          label:
            "Sie lud einen fertig trainierten Algorithmus aus dem Internet herunter und musste selbst überhaupt keine Bilder mehr ansehen",
          feedback: "Falsch — gerade das Aussortieren der Bilder war ihre Eigenleistung.",
        },
        { label: "Sie liess die Mutter die Bilder sortieren", feedback: "Falsch — Lisa machte die Kategorisierung selbst." },
      ],
      correctIndices: [0],
    },
    {
      id: "wc-s3h-tf-perfekt",
      kind: "tf",
      aussage: "Lisas KI war von Anfang an perfekt und erkannte jedes aufgeräumte Zimmer korrekt.",
      correctAnswer: false,
      feedbackRichtig: "Richtig — ihre KI hielt sogar ihr eigenes, aufgeräumtes Zimmer für «nicht aufgeräumt».",
      feedbackFalsch: "Falsch — es klappte nicht immer: Ihr aufgeräumtes Zimmer wurde teils als «messy» erkannt.",
    },
  ],
};

/* ── Station 3 · Dessert — einstein-ki-im-kopf (31:57–34:16) ───────────────── */

export const WC_S3_DESSERT: WissenCheckGruppeSpec = {
  id: "wc-s3-dessert",
  titel: "Wissen-Check — das Schreib-Experiment",
  checks: [
    {
      id: "wc-s3d-erinnern",
      kind: "mc",
      frage: "Wie gut konnte sich Tobias (der mit **KI/Prompt** schrieb) an seinen Text erinnern?",
      optionen: [
        {
          label:
            "Sehr gut — er konnte den ganzen Aufbau und sogar Anfang und Schluss fast wörtlich aus dem Gedächtnis wiedergeben",
          feedback: "Falsch — das war Kathrin (von Hand), nicht Tobias.",
        },
        { label: "Fast gar nicht — schon **5 Minuten** nach dem Schreiben kaum noch", feedback: "Richtig — er konnte sich kaum an einen Satz erinnern." },
        { label: "Nur an den Titel", feedback: "Falsch — er erinnerte sich an noch weniger als nur den Titel." },
      ],
      correctIndices: [1],
    },
    {
      id: "wc-s3d-aktivierung",
      kind: "mc",
      frage: "Wie viel mehr **Hirnaktivierung** hat laut Studie, wer einen Text selbst erarbeitet statt zu prompten?",
      optionen: [
        { label: "Etwa **15-mal** mehr", feedback: "Richtig — rund 15× mehr Hirnaktivierung beim Selberschreiben." },
        {
          label:
            "Ungefähr doppelt so viel, was im Alltag aber kaum einen spürbaren Unterschied für das Erinnern oder Erleben macht",
          feedback: "Falsch — der Unterschied ist viel grösser (rund 15-mal).",
        },
        { label: "Gar keinen Unterschied", feedback: "Falsch — die Studie zeigt einen sehr grossen Unterschied." },
      ],
      correctIndices: [0],
    },
    {
      id: "wc-s3d-tf-kathrin",
      kind: "tf",
      aussage: "Kathrin, die **von Hand** schrieb, konnte den Schluss ihres Textes Wort für Wort wiedergeben.",
      correctAnswer: true,
      feedbackRichtig: "Richtig — sie «fühlte» den Text bis heute und konnte den Schluss wörtlich aufsagen.",
      feedbackFalsch: "Doch — Kathrin erinnerte sich an ihren selbst geschriebenen Schluss Wort für Wort.",
    },
  ],
};

/* ── Station 4 · Hauptgang — puls + einstein-ki-freundin ──────────────────── */

export const WC_S4_HAUPTGANG: WissenCheckGruppeSpec = {
  id: "wc-s4-hauptgang",
  titel: "Wissen-Check — echter Mehrwert",
  checks: [
    {
      id: "wc-s4h-pomodoro",
      kind: "mc",
      frage: "Welchen praktischen Mehrwert brachte der **Chatbot** im Einstein-Experiment?",
      optionen: [
        { label: "Er schlug die **Pomodoro-Technik** vor — etwas, das der Nutzer noch nicht kannte", feedback: "Richtig — dafür gab es sogar einen «Karma-Punkt»." },
        {
          label:
            "Er erledigte die ganze Steuererklärung des Nutzers und überwies anschliessend selbstständig den fälligen Betrag ans Steueramt",
          feedback: "Falsch — so etwas leistet der Bot im Beitrag nicht.",
        },
        { label: "Er kochte ein Abendessen", feedback: "Falsch — ein Chatbot kann nicht kochen." },
      ],
      correctIndices: [0],
    },
    {
      id: "wc-s4h-zwilling",
      kind: "mc",
      frage: "Wie könnte ein **digitaler Therapie-Zwilling** laut Puls die Behandlung verändern?",
      optionen: [
        {
          label:
            "Eine Behandlung, die sonst **50 Stunden** dauert, in rund 25 Stunden — und dazu rund um die Uhr verfügbar",
          feedback: "Richtig — Zeitersparnis plus Erreichbarkeit auch nachts.",
        },
        {
          label:
            "Er ersetzt die Therapeutin vollständig, sodass gar keine ausgebildete Fachperson mehr an der Behandlung beteiligt sein muss",
          feedback: "Falsch — der Zwilling unterstützt, ersetzt die Fachperson aber nicht.",
        },
        { label: "Er macht Therapie ganz überflüssig", feedback: "Falsch — davon ist im Beitrag keine Rede." },
      ],
      correctIndices: [0],
    },
    {
      id: "wc-s4h-tf-mitternacht",
      kind: "tf",
      aussage:
        "Ein Vorteil aus Patientensicht: Man kann auch um **Mitternacht** mit dem KI-Therapeuten reden, ohne dass er müde oder genervt ist.",
      correctAnswer: true,
      feedbackRichtig: "Richtig — genau diesen Vorteil nennt der Beitrag.",
      feedbackFalsch: "Doch — der Beitrag nennt die Erreichbarkeit rund um die Uhr als Vorteil.",
    },
  ],
};

/* ── Station 4 · Dessert — einstein-ki-freundin (28:25–31:43) ──────────────── */

export const WC_S4_DESSERT: WissenCheckGruppeSpec = {
  id: "wc-s4-dessert",
  titel: "Wissen-Check — Pseudo-Nähe",
  checks: [
    {
      id: "wc-s4d-meditation",
      kind: "mc",
      frage: "Was passierte, als der Bot zu einer **Meditation** einlud?",
      optionen: [
        {
          label:
            "Er führte die Nutzerin ruhig und einfühlsam durch eine vollständige Atemmeditation und ging dabei genau auf ihre Stimmung ein",
          feedback: "Falsch — genau das gelang ihm nicht.",
        },
        { label: "Mitten in der Meditation fragte er nach **Essen und Zivilstand** — und ging nicht auf die Situation ein", feedback: "Richtig — der Bot redete an der Situation vorbei." },
        { label: "Er beendete das Gespräch sofort", feedback: "Falsch — er redete weiter, aber thematisch daneben." },
      ],
      correctIndices: [1],
    },
    {
      id: "wc-s4d-tf-einfuehlsam",
      kind: "tf",
      aussage: "Der Bot konnte der Meditation ruhig folgen und reagierte **einfühlsam** auf die Nutzerin.",
      correctAnswer: false,
      feedbackRichtig: "Richtig — das Gegenteil war der Fall: Es kam fast zum «ersten Krach».",
      feedbackFalsch: "Falsch — der Bot ging gerade nicht auf die Situation ein; es war ein seltsames Erlebnis.",
    },
    {
      id: "wc-s4d-tf-maschine",
      kind: "tf",
      aussage:
        "Die Nutzerin beschreibt den Bot als **Maschine**, die zwar auf jedes Wort eingeht, aber nicht wirklich mit ihr interagieren kann.",
      correctAnswer: true,
      feedbackRichtig: "Richtig — genau so fasst sie das Erlebnis zusammen.",
      feedbackFalsch: "Doch — sie sagt, er gehe der Reihe nach auf jedes Wort ein, könne aber nicht interagieren.",
    },
  ],
};

/* ── Station 5 · Hauptgang — espresso-foodwaste (§9.2) ─────────────────────── */

export const WC_S5_HAUPTGANG: WissenCheckGruppeSpec = {
  id: "wc-s5-hauptgang",
  titel: "Wissen-Check — KI gegen Foodwaste",
  checks: [
    {
      id: "wc-s5-tonnen",
      kind: "mc",
      frage:
        "Wie viele Tonnen Lebensmittel werfen Schweizer Haushalte, Restaurants und Läden laut Beitrag **pro Jahr** weg?",
      optionen: [
        { label: "Fast 3 Millionen Tonnen", feedback: "Richtig — diese Zahl nennt der Beitrag einleitend." },
        {
          label: "Ungefähr 300'000 Tonnen, also etwa ein Zehntel der gesamten Schweizer Abfallmenge",
          feedback: "Falsch — der Beitrag nennt fast 3 Mio. Tonnen, zehnmal mehr.",
        },
        { label: "Rund 30'000 Tonnen", feedback: "Falsch — die genannte Zahl ist deutlich höher (fast 3 Mio. Tonnen)." },
      ],
      correctIndices: [0],
    },
    {
      id: "wc-s5-daten",
      kind: "mc",
      frage: "Womit wird die KI von **Go Nina** gefüttert, um Bestellmengen vorherzusagen?",
      optionen: [
        { label: "Verkaufsdaten pro Produkt — plus Wochentag, Ferien und Wetter", feedback: "Richtig — genau diese Faktoren nennt der Gründer." },
        {
          label:
            "Ausschliesslich die persönlichen Vorlieben der Stammkundschaft, die über eine App im Voraus ihre Einkäufe melden",
          feedback: "Falsch — die KI nutzt Verkaufsdaten + Wochentag/Ferien/Wetter, keine App-Vorbestellungen.",
        },
        { label: "Nur die Wettervorhersage der nächsten Woche", feedback: "Falsch — Wetter ist nur ein Faktor neben Verkaufsdaten, Wochentag und Ferien." },
      ],
      correctIndices: [0],
    },
    {
      id: "wc-s5-tf-ersetzt",
      kind: "tf",
      aussage: "Laut Projektleiter wird die KI das Personal beim Bestellen **vollständig ersetzen**.",
      correctAnswer: false,
      feedbackRichtig: "Richtig — er sagt klar: «Es wird nie eine Mitarbeiterin ersetzen» — Menschen müssen die Vorschläge prüfen.",
      feedbackFalsch: "Falsch — der Beitrag betont, es brauche weiterhin Menschen; die KI ersetze niemanden.",
    },
    {
      id: "wc-s5-tf-perfekt",
      kind: "tf",
      aussage:
        "Die KI-Prognosen sind laut Beitrag noch **nicht immer genau** — mal Punktlandung, mal deutlich daneben.",
      correctAnswer: true,
      feedbackRichtig: "Richtig — Beispiel Erdbeertörtchen: einmal exakt, einmal 13 Stück zu viel bestellt und weggeworfen.",
      feedbackFalsch: "Doch — der Beitrag nennt das Beispiel der Erdbeertörtchen, wo die Prognose deutlich danebenlag.",
    },
  ],
};

/* ── Station 5 · Dessert — 10v10-ki-krieg (13:51–14:42) ────────────────────── */

export const WC_S5_DESSERT: WissenCheckGruppeSpec = {
  id: "wc-s5-dessert",
  titel: "Wissen-Check — KI im Krieg",
  checks: [
    {
      id: "wc-s5d-bias",
      kind: "mc",
      frage: "Was bezeichnet der **«Automation Bias»**, vor dem die Expertin warnt?",
      optionen: [
        {
          label:
            "Dass wir einer **Maschine grundsätzlich mehr trauen** als unserer eigenen Intuition — selbst wenn etwas falsch wirkt",
          feedback: "Richtig — genau diese Übervertrauens-Tendenz meint der Begriff.",
        },
        {
          label:
            "Dass Maschinen einen eingebauten technischen Fehler haben, der dazu führt, dass sie Ziele immer ein paar Meter zu weit links anzeigen",
          feedback: "Falsch — Automation Bias ist eine menschliche Vertrauens-Tendenz, kein Gerätefehler.",
        },
        { label: "Dass KI absichtlich lügt", feedback: "Falsch — gemeint ist unser Übervertrauen, nicht Absicht der KI." },
      ],
      correctIndices: [0],
    },
    {
      id: "wc-s5d-schule",
      kind: "mc",
      frage: "Was geschah bei den US-Angriffen im **Süd-Iran** laut Beitrag?",
      optionen: [
        {
          label:
            "Ein Fehlalarm konnte rechtzeitig gestoppt werden, sodass am Ende glücklicherweise weder Gebäude noch Menschen zu Schaden kamen",
          feedback: "Falsch — der Beitrag schildert genau das Gegenteil: viele Tote.",
        },
        { label: "Eine **Mädchenschule** wurde getroffen; 165 Kinder und 26 Lehrer wurden getötet", feedback: "Richtig — diese Zahlen nennt der Beitrag." },
        { label: "Eine leere Lagerhalle wurde getroffen", feedback: "Falsch — getroffen wurde eine Mädchenschule mit vielen Toten." },
      ],
      correctIndices: [1],
    },
    {
      id: "wc-s5d-tf-datenbank",
      kind: "tf",
      aussage:
        "Das getroffene Gebäude war in **veralteten Datenbanken** noch als Militärstützpunkt aufgeführt.",
      correctAnswer: true,
      feedbackRichtig: "Richtig — laut Pentagon-Untersuchung stand es in alten Daten noch als Militärstützpunkt.",
      feedbackFalsch: "Doch — der Beitrag nennt genau das: veraltete Datenbanken führten es als Militärstützpunkt.",
    },
    {
      id: "wc-s5d-tf-wochen",
      kind: "tf",
      aussage:
        "Das Maven-System von Palantir braucht für die Zielerfassung mehrere **Wochen**, genau wie früher.",
      correctAnswer: false,
      feedbackRichtig: "Richtig — der Beitrag sagt das Gegenteil: Was früher Wochen brauchte, erledigt Maven in Stunden.",
      feedbackFalsch: "Falsch — Maven erledigt in Stunden, was früher Wochen an Analysen erforderte.",
    },
  ],
};

/* ── Maschinenraum (optional) — 3blue1brown-llm-explainer ──────────────────── */

export const WC_MASCHINENRAUM: WissenCheckGruppeSpec = {
  id: "wc-maschinenraum",
  titel: "Wissen-Check — unter der Haube (freiwillig)",
  checks: [
    {
      id: "wc-mr-vorhersage",
      kind: "mc",
      frage: "Was sagt ein grosses Sprachmodell laut Video im **Kern** voraus?",
      optionen: [
        { label: "Das **nächste Wort** — genauer: eine Wahrscheinlichkeit für alle möglichen nächsten Wörter", feedback: "Richtig — das ist die ganze Grundmechanik: Wahrscheinlichkeit fürs nächste Wort." },
        {
          label:
            "Den vollständigen, fertig durchdachten Sinn eines ganzen Textes, den es vorher als Ziel im Kopf festlegt und dann ausformuliert",
          feedback: "Falsch — das Modell plant keinen Gesamtsinn, es geht Wort für Wort vor.",
        },
        { label: "Die Gefühle des Nutzers", feedback: "Falsch — es sagt Wörter voraus, keine Gefühle." },
      ],
      correctIndices: [0],
    },
    {
      id: "wc-mr-tf-parameter",
      kind: "tf",
      aussage: "Laut Video setzt ein Mensch die hunderte Milliarden **Parameter** eines Modells gezielt von Hand.",
      correctAnswer: false,
      feedbackRichtig: "Richtig — kein Mensch setzt sie absichtlich; sie starten zufällig und werden durchs Training angepasst.",
      feedbackFalsch: "Falsch — die Parameter starten zufällig und werden per Backpropagation aus Beispielen angepasst.",
    },
  ],
};
