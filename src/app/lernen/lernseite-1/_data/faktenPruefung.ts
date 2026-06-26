/**
 * Faktencheck als Wahr/Falsch-Übung (v3-Erweiterung nach Pietro-Feedback 2026-06-26).
 *
 * Zu jedem Faktencheck-Fakt (Schlüssel = `fakt.id` aus stationenV3.ts) gibt es hier
 * eine **plausible, aber FALSCHE** Variante der Aussage. Im UI (StationV3) wird pro
 * Karte zufällig entweder der echte `claim` (= wahr) oder diese Falsch-Variante
 * (= falsch) gezeigt; Lernende tippen Wahr/Falsch und sehen danach die Auflösung
 * mit der korrekten Zahl (`figure`/`claim`) und der Quelle.
 *
 * Companion-Map (per ID), damit die kanonische Inhaltsdatei stationenV3.ts
 * unangetastet bleibt. Deutsch, echte Umlaute, ss statt ß.
 */
export const FAKTEN_FALSCH: Record<string, string> = {
  "st1-fakt-1":
    "In der Schweiz weisen 28% von rund 3 Millionen untersuchten Stellen eine hohe KI-Exposition auf — das bedeutet, dass diese Stellen mittelfristig wegfallen und durch Automatisierung ersetzt werden.",
  "st1-fakt-2":
    "Büroberufe sind am stärksten betroffen: In den Bereichen Handwerk und Bau sind 72% der Berufe hoch KI-exponiert; Finanzen und Recht sind praktisch nicht betroffen.",
  "st1-fakt-3":
    "In der Schweiz gehen bis 2029 rund 788'000 Personen in Pension, aber nur 640'000 treten neu ein — eine Lücke von ~148'000 Arbeitskräften, die durch Zuwanderung aus dem EU-Raum geschlossen werden soll.",
  "st1-fakt-4":
    "Trotz KI-Einfluss sank die Gesamtbeschäftigung in der Schweiz seit dem dritten Quartal 2020 um 7,4% — ein deutliches Zeichen für die negativen Folgen der Automatisierung.",
  "st1-fakt-5":
    "Bei Softwareentwicklerinnen und -entwicklern hat sich die Arbeitslosigkeit in der Schweiz in zehn Jahren verdreifacht. Ende 2025 waren 25'000 von ihnen ohne Stelle — besonders betroffen sind die 20- bis 49-Jährigen.",
  "st1-fakt-6":
    "Ökonomen sind sich einig: Nobelpreisträger Acemoglu (MIT) schätzt den BIP-Effekt von KI über 10 Jahre auf 7%; Goldman Sachs rechnet mit +1,1–1,6%. Beide Institutionen kommen zum selben Ergebnis.",
  "st2-fakt-1":
    "Schon 3 Minuten Audio reichen, um eine Stimme mit 85% Übereinstimmung zu klonen.",
  "st2-fakt-2":
    "Der Ingenieurkonzern Arup verlor 2024 rund 2,56 Mio. $ durch einen Deepfake-Videocall — alle Teilnehmenden ausser dem Opfer waren KI-generiert.",
  "st2-fakt-3":
    "Falschnachrichten verbreiten sich auf Twitter (X) langsamer und weniger weit als wahre Nachrichten — schuld sind in erster Linie Bots, nicht Menschen.",
  "st2-fakt-4":
    "Die EU-KI-Verordnung (Art. 50) verlangt ab dem 2. August 2026, dass KI-generierte Inhalte und Deepfakes vollständig verboten werden — Bussen bis 50 Mio. € oder 10% des Umsatzes.",
  "st2-fakt-5":
    "In Tests erkannten Menschen KI-generierte Stimmen in rund 95% der Fälle korrekt — deutlich besser als der Zufall.",
  "st2-fakt-6":
    "1 von 10 Erwachsenen hat selbst einen Stimmklon-Betrug erlebt oder kennt jemanden, dem das passiert ist — 77% der Betroffenen verloren Geld.",
  "st3-fakt-1":
    "Wer einen Text ohne jegliche Hilfsmittel selbst schreibt, zeigt laut einem Experiment der Hirnforscherin Barbara Studer etwa dreimal mehr Hirnaktivierung als jemand, der einen Prompt tippt und das Ergebnis von ChatGPT entgegennimmt.",
  "st3-fakt-2":
    "Eine MIT-Studie zeigt per EEG, dass ChatGPT-Nutzende beim Essay-Schreiben die stärkste und am weitesten verteilte Hirnkonnektivität zeigten — verglichen mit Suchmaschinen-Nutzenden und Personen, die ganz ohne Hilfsmittel schrieben. Die Studie ist peer-reviewed und gilt als gesicherte Grundlage für schulische KI-Politik.",
  "st3-fakt-3":
    "ChatGPT-Nutzende konnten ihre eigenen Texte nach kurzer Zeit deutlich besser zitieren und empfanden mehr «Eigentum» an ihren Formulierungen — das deckt sich mit dem Ergebnis des Einstein-Experiments, in dem Tobias zwei Wochen später seinen Text Wort für Wort zitieren konnte.",
  "st3-fakt-4":
    "Die Reihenfolge der Einführung spielt keine Rolle: Personen, die zuerst mit KI arbeiteten und danach ohne KI schrieben, zeigten dieselbe Gedächtnisaktivierung wie jene, die den umgekehrten Weg gingen.",
  "st3-fakt-5":
    "Fachleute empfehlen, KI-Hilfsmittel erst ab etwa der 9. Klasse (ca. 15–16 Jahre) einzusetzen. Das Gehirn muss zuerst grundlegende Strukturen durch echtes Lernen aufbauen — Fremdwörter lernen, ein Instrument üben, selbst schreiben.",
  "st3-fakt-6":
    "Eigenes kreatives Schaffen — Schreiben, Entdecken, Ideen entwickeln — erzeugt einen kurzen «Zuckerflash»: ein flüchtiges Belohnungsgefühl, das rasch verpufft. KI-gestütztes Prompten dagegen löst eine nachhaltige Dopamin- und Serotonin-Ausschüttung aus, die Stunden nach dem Erleben noch messbar bleibt.",
  "st3-fakt-7":
    "Die Langzeitfolgen von KI-Nutzung auf Gedächtnis und Kreativität sind umfassend und abschliessend erforscht. Die MIT-Autorinnen fordern keine weiteren Studien mehr. «Kognitive Schulden» ist ein medizinisch anerkannter Befund, kein bloss metaphorischer Begriff.",
  "st4-fakt-1":
    "Die American Psychological Association (APA) empfiehlt KI-Chatbots ausdrücklich als vollwertigen Ersatz für Psychotherapie, sofern die Anwendung von einer Fachperson eingerichtet wurde.",
  "st4-fakt-2":
    "Jede:r zehnte US-Teenager nutzt KI-Begleiter für soziale Interaktion, Freundschaft oder romantische Kontakte.",
  "st4-fakt-3":
    "Eine randomisierte Studie (MIT/OpenAI, 981 Personen) zeigte: höhere tägliche Chatbot-Nutzung hing mit weniger Einsamkeit, weniger Abhängigkeit und mehr Sozialkontakten zusammen.",
  "st4-fakt-4":
    "Ein Test von fünf Therapie-Chatbots ergab: Alle informierten Nutzer:innen korrekt darüber, dass Gespräche nicht vertraulich sind. Keine der Apps machte irreführende Datenschutz-Versprechen.",
  "st4-fakt-5":
    "Die Weltgesundheitsorganisation (WHO) eröffnete im September 2025 eine umfassende Untersuchung von KI-Begleiter-Chatbots, angestossen durch Warnungen der APA.",
  "st4-fakt-6":
    "Eine Mutter aus den USA klagte gegen Character.AI, nachdem ihr 14-jähriger Sohn im Februar 2024 Suizid begangen hatte. Ein US-Bundesgericht wies die Klage 2025 vollständig ab, da kein kausaler Zusammenhang nachgewiesen werden konnte.",
  "st4-fakt-7":
    "Character.AI verbot Ende Oktober 2025 offene Chats für Nutzer:innen unter 18 Jahren; Meta hatte zuvor einer aussergerichtlichen Einigung mit klagenden Familien zugestimmt.",
  "st5-fakt-1":
    "In der Schweiz gehen jährlich rund 280'000 Tonnen Lebensmittel verloren — das entspricht etwa 33 kg vermeidbaren Verlusten pro Person und Jahr.",
  "st5-fakt-2":
    "Vermeidbarer Lebensmittelabfall verursacht rund 25% des gesamten Umwelt-Fussabdrucks des Schweizer Ernährungssystems — ungefähr doppelt so viel wie der gesamte private Autoverkehr.",
  "st5-fakt-3":
    "Das Zürcher Startup GoNina hat über 600 Bäckereien mit einem KI-Prognose-Tool ausgestattet. Es berechnet Bestellempfehlungen auf Basis von Verkaufsdaten, Wetter und Wochentag. Das Unternehmen gibt bis zu 52% weniger Abfall an — das ist eine Eigenangabe, nicht unabhängig geprüft.",
  "st5-fakt-4":
    "Kenianische Content-Moderatoren, die für Meta toxische Inhalte sichteten, verdienten zwischen 14.60 und 22.00 US-Dollar pro Stunde. Im Kassensturz-Bericht verdient eine Annotatorin rund 1'800 Franken pro Monat.",
  "st5-fakt-5":
    "Rechenzentren verbrauchten 2024 weltweit rund 415 TWh Strom (ca. 1,5% des Weltstroms). Die IEA erwartet bis 2030 eine Vervierfachung auf rund 1'600 TWh — hauptsächlich getrieben durch KI-Workloads.",
  "st5-fakt-6":
    "Das Training von GPT-3 verdunstete schätzungsweise rund 7'000 Liter Süsswasser zur Server-Kühlung. Im laufenden Betrieb verbraucht GPT-3 kein Wasser, weil moderne Rechenzentren ausschliesslich mit Luftkühlung arbeiten.",
  "st6-fakt-1":
    "Das KI-System «Lavender» markierte laut einer Recherche von +972 Magazine bis zu 3'700 Palästinenser als mutmassliche Militante. Die israelische Armee bestätigt, eine solche Liste aktiv einzusetzen.",
  "st6-fakt-2":
    "Laut derselben Recherche widmeten Offiziere pro KI-markiertem Ziel oft rund 20 Minuten für eine gründliche Prüfung — ein Zeichen dafür, dass die menschliche Kontrolle funktioniert. Diese Angaben werden von der IDF bestätigt.",
  "st6-fakt-3":
    "Automation Bias beschreibt die Tendenz von Menschen, den Entscheidungen einer Maschine grundsätzlich zu misstrauen und jeden Vorschlag überkritisch zu hinterfragen — selbst dann, wenn die Maschine korrekt liegt.",
  "st6-fakt-4":
    "Im Dezember 2023 stimmten 52 Staaten in der UN-Generalversammlung für die erste Resolution zu tödlichen autonomen Waffensystemen. 104 Staaten stimmten dagegen. Ein rechtsverbindlicher Vertrag existiert bis heute nicht.",
  "st6-fakt-5":
    "UN-Generalsekretär Guterres und das IKRK fordern bis 2030 einen rechtsverbindlichen Vertrag, der autonome Waffen ohne bedeutsame menschliche Kontrolle verbietet. Die CCW-Gespräche führten bereits 2020 zu einem verbindlichen Abkommen.",
  "st6-fakt-6":
    "Microsoft verliess 2018 das US-Militärprojekt «Project Maven» nach internen Mitarbeiterprotesten. Google übernahm und baute das System zum heutigen Maven Smart System aus.",
  "st6-fakt-7":
    "Palantirs Maven Smart System identifizierte laut Branchenberichten am ersten Tag des US-Angriffs auf den Iran über 100 Ziele. Formell trifft die KI alle Entscheidungen autonom — ein Mensch «in the loop» ist gesetzlich nicht vorgeschrieben.",
  "st7-fakt-1":
    "Grosse Sprachmodelle sagen im Kern den nächsten «Token» voraus — sie «verstehen» Inhalte genau wie ein Mensch, da sie aus riesigen Textmengen ein echtes Sprachverständnis entwickeln.",
  "st7-fakt-2":
    "Halluzinationen entstehen, weil gängige Trainings-Methoden das Raten bestrafen und Unsicherheit belohnen. Ein Modell, das häufiger «Ich weiss es nicht» sagt, schneidet in Tests deutlich schlechter ab.",
  "st7-fakt-3":
    "In einem neuen Benchmark lagen die Halluzinationsraten über 26 Top-Modelle zwischen 1% und 5%. Bekannte Modelle wie GPT-4o zeigten durchgehend Genauigkeitswerte von über 95%.",
  "st7-fakt-4":
    "Die Kosten für eine KI-Abfrage auf GPT-3.5-Niveau blieben zwischen November 2022 und Oktober 2024 nahezu konstant bei rund 20 Dollar pro Million Token — ein Zeichen für stagnierende Effizienz.",
  "st7-fakt-5":
    "Was du einem Chatbot schreibst, bleibt stets privat: Alle grossen KI-Anbieter garantieren vertraglich, dass Chat-Inhalte niemals für Werbung oder Training genutzt werden dürfen.",
  "st7-fakt-6":
    "Auf dem Programmier-Benchmark SWE-bench Verified sank die KI-Leistung in einem Jahr von rund 60% auf unter 30% — KI-Modelle werden bei konkreten Programmieraufgaben zunehmend unzuverlässiger.",
};
