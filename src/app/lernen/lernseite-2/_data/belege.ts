/**
 * Belege — nachgeschlagene Quellen, an eine Textstelle geknüpft.
 *
 * Ein Eintrag hier bedeutet: Die URL wurde **abgerufen** und die Aussage im
 * Lernset-Text **darin kontrolliert**. Nichts hier darf aus dem Gedächtnis
 * eines Modells stammen. Wer einen Eintrag ergänzt, ruft die Seite vorher auf
 * und notiert, an welcher Stelle sie die Aussage stützt.
 *
 * `id` ist die Kennung des Textblocks aus `docs/quellenauftrag-index.json`. Sie
 * ist ein Hash des Textes: Ändert sich der Text, passt die Kennung nicht mehr,
 * und `node docs/belege-pruefen.js` meldet den Beleg als veraltet. Genau so ist
 * es gemeint, denn ein Beleg gilt für einen Wortlaut, nicht für ein Thema.
 *
 * `anker` ist die wörtliche Stelle im Text, an der der Link erscheint. Sie muss
 * im Block vorkommen und sollte so kurz wie möglich sein.
 *
 * Ziel ist ein Beleg pro Textblock, mehrere sind erlaubt, wenn ein Block
 * mehrere prüfbare Behauptungen enthält.
 */

export interface Beleg {
  /** Kennung des Textblocks (siehe docs/quellenauftrag-index.json). */
  id: string;
  /** Wörtliche Textstelle, an die der Link gehängt wird. */
  anker: string;
  /**
   * Fehlt bei **Buchbelegen**: Ein gedrucktes Werk hat keine Adresse, die man
   * anklicken kann. Das Wort wird dann ein Knopf statt eines Links, und der
   * Hinweis nennt Autorin und Titel (siehe `BelegStelle` in Glossar.tsx).
   */
  url?: string;
  /** Kurzname der Quelle, erscheint beim Überfahren. */
  titel: string;
  /** Wo genau in der Quelle: Seite, Abschnitt, Aphorismus. */
  stelle?: string;
  /** Datum, an dem URL und Aussage kontrolliert wurden (ISO). */
  geprueft: string;
}

export const BELEGE: Beleg[] = [
  {
    id: "PP-8fa9ca",
    anker: "daoistische Alchemisten",
    url: "https://de.wikipedia.org/wiki/Schwarzpulver",
    titel: "Schwarzpulver (Wikipedia)",
    stelle:
      "Abschnitt «Geschichte»: Chinesische Alchemisten fanden die explosive Mischung bei Versuchen zur Herstellung eines Lebenselixiers.",
    geprueft: "2026-07-26",
  },
  {
    id: "PP-8fa9ca",
    anker: "Francis Bacon",
    // Bewusst englisch: Das Original ist Latein, und eine frei zugängliche
    // deutsche Übersetzung des «Novum Organum» haben wir nicht gefunden
    // (zeno.org war bei der Prüfung am 2026-08-05 nicht erreichbar).
    url: "https://www.earlymoderntexts.com/assets/pdfs/bacon1620.pdf",
    titel: "Bacon, «Novum Organum» (1620), Übersetzung Jonathan Bennett",
    stelle:
      "Erstes Buch, Aphorismus 129, Seite 46: «printing, gunpowder, and the nautical compass. These three have changed the whole aspect and state of things throughout the world».",
    geprueft: "2026-07-26",
  },

  /* ── Fallbeispiele der Kriterien («Die KI im Kontext») ────────────────────
   * Alle URLs am 2026-07-26 abgerufen, die Zahlen in der Quelle nachgelesen. */
  {
    id: "VA-e3c2cd",
    anker: "Nvidia",
    url: "https://www.wiwo.de/unternehmen/it/us-boersen-nvidia-jetzt-wertvollste-aktiengesellschaft-der-welt/30072326.html",
    titel: "WirtschaftsWoche: Nvidia wertvollste Aktiengesellschaft der Welt",
    stelle:
      "5. November 2024, Börsenwert 3,4 Billionen Dollar. Im Juni 2024 stand Nvidia schon einmal an der Spitze, konnte den Platz aber nur einen Tag halten. Darum «zeitweise».",
    geprueft: "2026-07-26",
  },
  {
    id: "VA-0210fd",
    anker: "48 Prozent",
    url: "https://www.ingenieur.de/technik/fachbereiche/umwelt/energiehungrige-google-ki-treibt-emissionen-um-48-in-die-hoehe/",
    titel: "ingenieur.de zum Google-Umweltbericht 2024",
    stelle:
      "«Treibhausgasemissionen in den letzten fünf Jahren um 48 % zugenommen haben, was hauptsächlich auf den hohen Stromverbrauch der Rechenzentren und der Lieferkette zurückzuführen ist.»",
    geprueft: "2026-07-26",
  },
  {
    id: "VA-ed6696",
    anker: "irische Statistikamt",
    // Bewusst englisch: Der Text nennt die Behörde ausdrücklich, darum die
    // Primärquelle statt eines deutschen Berichts darüber.
    url: "https://www.cso.ie/en/releasesandpublications/ep/p-dcmec/datacentresmeteredelectricityconsumption2024/keyfindings/",
    titel: "CSO Ireland: Rechenzentren und Stromverbrauch 2024",
    stelle:
      "«rose to 22% in 2024»; städtische Haushalte 18 Prozent, ländliche Haushalte 10 Prozent. Für 2023 nennt der Vorjahresbericht 21 Prozent bei gleichen Haushaltswerten.",
    geprueft: "2026-07-26",
  },
  {
    id: "VA-aff821",
    anker: "Klarna",
    // Bewusst die Mitteilung des Unternehmens selbst: Der Text sagt ja gerade,
    // dass die Zahl eine Selbstauskunft ist. Der Reuters-Bericht zur späteren
    // Kurskorrektur lag hinter einer Bot-Sperre (403) und ist darum draussen.
    url: "https://www.klarna.com/international/press/der-ki-kundenassistent-von-klarna-bearbeitet-im-ersten-monat-zwei-drittel-aller-kundendienst-anfragen/",
    titel: "Klarna, Medienmitteilung vom 27. Februar 2024",
    stelle:
      "Klarnas eigene Angabe: Der KI-Assistent führte 2,3 Millionen Unterhaltungen, zwei Drittel aller Kundendienst-Chats, und leiste damit die Arbeit von 700 Vollzeitmitarbeitenden. Unabhängig nachgemessen wurde das nicht.",
    geprueft: "2026-07-26",
  },
  {
    id: "VA-eb3a6b",
    anker: "gestaffelt",
    // Bis 2026-08-05 stand hier die englische Fassung derselben Seite; die
    // deutsche trägt denselben Zeitplan.
    url: "https://ai-act-service-desk.ec.europa.eu/de/ai-act/timeline/zeitplan-fuer-die-umsetzung-des-eu-ki-gesetzes",
    titel: "AI-Act-Service-Desk der EU: Zeitplan für die Umsetzung",
    stelle:
      "«Die Rechtsvorschriften des KI-Gesetzes der EU gelten schrittweise, wobei eine vollständige Einführung bis zum 2. August 2027 vorgesehen ist.» In Kraft am 1. August 2024, Verbote ab 2. Februar 2025, Regeln für Allzweckmodelle ab 2. August 2025, die meisten Vorschriften samt Transparenz (Artikel 50) ab 2. August 2026.",
    geprueft: "2026-08-05",
  },
  {
    id: "VA-7dc30e",
    anker: "OpenAI Group PBC",
    url: "https://de.wikipedia.org/wiki/OpenAI",
    titel: "OpenAI (Wikipedia)",
    stelle:
      "Umstrukturierung im Oktober 2025: «OpenAI Group PBC», die in «OpenAI Foundation» umbenannte Non-Profit hält 26 Prozent der Anteile. Microsoft ist grösster Einzelinvestor, aber nur nicht-stimmberechtigter Beobachter im Verwaltungsrat.",
    geprueft: "2026-07-26",
  },
  {
    id: "VA-6068d8",
    anker: "UNESCO",
    // Bis 2026-08-05 stand hier die englische UNESCO-Seite. Der deutsche
    // Fachbericht deckt alle Aussagen des Textblocks; die Studie selbst
    // (englisch) bleibt über den Artikel auffindbar.
    url: "https://www.cio.de/article/3696289/ki-sprachmodelle-bedienen-geschlechterstereotype.html",
    titel: "CIO.de zur UNESCO-Studie über Geschlechterstereotype in Sprachmodellen",
    stelle:
      "«Frauen würden bis zu viermal häufiger mit Hausarbeit in Verbindung gebracht als Männer … Sie stünden häufig im Kontext von Begriffen wie ‹Haus›, ‹Familie› und ‹Kinder›, während bei Männern die Begriffe ‹Firma›, ‹Führungskraft›, ‹Gehalt› und ‹Karriere› im Vordergrund stünden.»",
    geprueft: "2026-08-05",
  },

  /* ── Antike («Philosophie in Zeiten der Verunsicherung») ──────────────────
   * Alle URLs am 2026-07-29 abgerufen und die Aussage darin nachgelesen.
   * Die Anker liegen bewusst NEBEN den Glossarbegriffen (nicht auf «Solon»,
   * «Themistokles», «Laurion»): Bei einer Überlappung gewinnt der Beleg, und
   * die Begriffserklärung im Hover wäre verdeckt. */
  {
    id: "EP-a6e85e",
    anker: "drehbar an Pflöcken befestigt waren",
    url: "https://de.wikipedia.org/wiki/Solon",
    titel: "Solon (Wikipedia)",
    stelle:
      "Abschnitt «Solons Gesetzgebung»: Das Gesetzeswerk wurde auf Holztafeln (Axones) gesichert, «in der Art heutiger Postkartenständer drehbar an Pflöcken befestigt». Aufbewahrt wurden sie im Prytaneion — darum nennt der Lernset-Text keinen Ort.",
    geprueft: "2026-07-29",
  },
  {
    id: "EP-a6e85e",
    anker: "nach ihrem Münzbild nannte",
    url: "https://de.wikipedia.org/wiki/Altgriechische_M%C3%BCnzen",
    titel: "Altgriechische Münzen (Wikipedia)",
    stelle:
      "Zu den Münzbildern: «Lange blieben die Münzen aus Aigina («Schildkröten» genannt) sowie die aus Korinth («Fohlen») und Athen («Eulen»)» die beherrschenden Zahlungsmittel des frühen Griechenland.",
    geprueft: "2026-07-29",
  },
  {
    id: "EP-a6e85e",
    anker: "wollten die Athener den Überschuss unter sich aufteilen",
    url: "https://de.wikipedia.org/wiki/Perserkriege",
    titel: "Perserkriege (Wikipedia)",
    stelle:
      "Zur Vorgeschichte von Salamis: «man sich von Themistokles überzeugen liess, Überschusseinnahmen aus dem Silberabbau in Laurion von 483 v. Chr. an nicht unter die Bürger zu verteilen, sondern in den Schiffsbau zu investieren».",
    geprueft: "2026-07-29",
  },

  /* ── Buchbelege: «wahrscheinlichkeitsbasiert» ─────────────────────────────
   * Alle drei am 2026-08-04 im Buch selbst nachgeschlagen (E-Book-Volltext),
   * nicht aus dem Gedächtnis. Ohne `url`, weil es gedruckte Werke sind.
   *
   * Anlass: Der Text nannte «rund 13'000 Richtungen» und schrieb Gabriel den
   * Begriff «Vektorisierung» zu. Beides hielt der Prüfung nicht stand, siehe
   * die Fundstellen unten. */
  {
    id: "VA-9f6b84",
    anker: "Hochmut kommt vor dem",
    titel: "Frank Jäkel, «Die intelligente Täuschung» (transcript 2025)",
    stelle:
      "Kapitel 2: «Der Computer verarbeitet einen Text Wort für Wort und versucht aus den bisherigen Wörtern das nächste Wort vorherzusagen. Das können Sie auch! Welches Wort folgt auf die Wörter ›Hochmut kommt vor dem …‹?» Dort auch das zweite Beispiel mit «Mensa» und «Stadt».",
    geprueft: "2026-08-04",
  },
  // Die Zahl im Lernset-Text folgt genau dieser Stelle. «Rund 13'000
  // Richtungen», wie es vorher hiess, steht so nirgends bei Zweig.
  {
    id: "VA-e41f4b",
    anker: "Hunderte bis über zehntausend Richtungen",
    titel: "Katharina Zweig, «Weiss die KI, dass sie nichts weiss?» (Heyne 2025)",
    stelle:
      "Wörtlich: «wir sprechen nicht von drei Dimensionen wie im Planetarium und nicht von 100 Dimensionen wie beim ersten, einfachen neuronalen Netzwerk von Bengio et al., sondern von Hunderten bis über 10 000 Richtungen.»",
    geprueft: "2026-08-04",
  },
  // Gabriel benutzt das VERB und erklärt es am Beispiel eines Katzenfotos. Das
  // Substantiv «Vektorisierung» kommt im Buch nicht vor — darum steht im
  // Lernset-Text «vektorisieren», nicht «Vektorisierung».
  {
    id: "VA-e41f4b",
    anker: "«vektorisieren»",
    titel: "Markus Gabriel, «Ethische Intelligenz» (Ullstein 2026)",
    stelle:
      "Wörtlich: «Eine KI vektorisiert ein digitales Sinnfeld und übersetzt den Inhalt des Felds auf diese Weise in Mathematik.»",
    geprueft: "2026-08-04",
  },

  /* ── Antike, Technologie ──────────────────────────────────────────────────
   * Dieser Block war lange ohne Beleg, und er hatte es nötig. Drei Aussagen
   * hielten der Prüfung am 2026-08-04 nicht stand und sind korrigiert:
   *
   *  1. «Vorher war Schreiben ein Beruf für Spezialisten, die Hunderte Zeichen
   *     lernen mussten» — falsch in zwei Punkten. Linear B hat etwa 90
   *     Silbenzeichen, nicht Hunderte (auf Hunderte kommt man erst mit der
   *     Keilschrift). Und es gab kein «Vorher»: Zwischen dem Ende von Linear B
   *     (um 1200 v. Chr.) und dem Alphabet liegen vierhundert schriftlose
   *     Jahre. Der Satz verkaufte eine Ablösung, wo ein Bruch war.
   *  2. «jetzt kann es lernen, wer die Zeit dazu hat» — es war eine Frage des
   *     Geldes, nicht der Zeit: keine Schulpflicht, kein Schulhaus, Unterricht
   *     beim Lehrer zuhause.
   *  3. «Vorher tauschte man Ware gegen Ware und handelte jedes Mal neu aus»
   *     — der Gegensatz in den Quellen lautet wiegen → zählen, nicht feilschen
   *     → Festpreis. Vor der Münze zahlte man mit abgewogenem Silber.
   *
   * Ebenfalls gestrichen: «das Silber für die Münzen kam aus Bergwerken wie
   * dem Laurion». Bezogen auf die ersten Münzen (7./6. Jh.) ist das zu früh —
   * in Laurion war der Silberabbau laut der Lehrplattform pecunia/NumiScience
   * der Universität Heidelberg «bis zum 6. Jahrhundert v. Chr. noch sehr
   * gering» und wurde erst ab ca. 520 v. Chr. ergiebig
   * (https://pecunia.zaw.uni-heidelberg.de/NumiScience/phasen-des-silberabbaus,
   * abgerufen 2026-08-04). Laurion bleibt im Vertiefungstext, wo es zeitlich
   * hingehört: beim Silberfund von 483 v. Chr. und Themistokles. */
  {
    id: "EP-8b588b",
    anker: "etwa 90 Lautzeichen",
    url: "https://de.wikipedia.org/wiki/Linearschrift_B",
    titel: "Linearschrift B (Wikipedia)",
    stelle:
      "«Bekannt sind etwa 90 Silbenzeichen, 160 Zeichen mit Wortbedeutung sowie diverse Zahlzeichen.» Zum Gebrauch: «Die Funde sind keine literarischen Texte, sondern hauptsächlich Notizen zu wirtschaftlichen und Verwaltungszwecken.»",
    geprueft: "2026-08-04",
  },
  {
    id: "EP-8b588b",
    anker: "vierhundert Jahre lang wird in Griechenland nicht geschrieben",
    url: "https://de.wikipedia.org/wiki/Dunkle_Jahrhunderte_(Antike)",
    titel: "Dunkle Jahrhunderte (Antike) (Wikipedia)",
    stelle:
      "«Die Bezeichnung ‹Dunkles Zeitalter› für die Zeit von ca. 1200 bis 750 v. Chr. lässt sich allerdings weiterhin mit der Schriftlosigkeit dieser Periode begründen.» Der Zeitraum beginnt «ab ca. 1200 v. Chr., dem Ende der sogenannten Mykenischen Palastzeit».",
    geprueft: "2026-08-04",
  },
  {
    id: "EP-8b588b",
    anker: "keine Schulpflicht und keine Schulhäuser",
    url: "https://de.wikipedia.org/wiki/Schule",
    titel: "Schule (Wikipedia), Abschnitt zur Antike",
    stelle:
      "«Dennoch gab es auch in Athen weder eine Schulpflicht noch öffentliche Schulgebäude, sondern die Kinder wurden beim Lehrer zuhause unterrichtet.» Davor: «konnten die Kinder wohlhabender Familien Athens allgemein bildende Schulen besuchen».",
    geprueft: "2026-08-04",
  },
  {
    id: "EP-8b588b",
    anker: "Dazu kommen Münzen",
    url: "https://de.wikipedia.org/wiki/Altgriechische_M%C3%BCnzen",
    titel: "Altgriechische Münzen (Wikipedia)",
    stelle:
      "«Die ersten Münzen wurden von den Lydern im Westen der heutigen Türkei zwischen 650 und ca. 620 v. Chr. als Zahlungsmittel geprägt.» Und: «Die ersten Silbermünzen wurden um 550 v. Chr. in Kleinasien und auf der Insel Aigina geprägt.»",
    geprueft: "2026-08-04",
  },
  {
    id: "EP-8b588b",
    anker: "man zählt sie",
    url: "https://de.wikipedia.org/wiki/Altgriechische_M%C3%BCnzen",
    titel: "Altgriechische Münzen (Wikipedia)",
    stelle:
      "Der entscheidende Gegensatz, wörtlich: Münzen «hatten den Vorteil, immer gleiche Größe, gleiches Gewicht und gleiches Aussehen zu besitzen und statt gewogen abgezählt werden zu können».",
    geprueft: "2026-08-04",
  },
  {
    id: "EP-8b588b",
    anker: "auf die Waage legte",
    url: "https://de.wikipedia.org/wiki/Hacksilber",
    titel: "Hacksilber (Wikipedia)",
    stelle:
      "Zum Bezahlen vor der Münze: «Der Handelswert wurde entsprechend dem Metallwert zerkleinert, abgewogen und eingetauscht. Zu diesem Zweck wurden zum Teil auch künstlerisch wertvolle Arbeiten zerkleinert und auf ihren reinen Metallwert reduziert.»",
    geprueft: "2026-08-04",
  },

  /* ── Hieronymus beim Fall Roms ────────────────────────────────────────────
   * Christof fragte am 2026-08-04, woher der Satz stamme, Hieronymus habe
   * «fern in Bethlehem an seiner Bibelübersetzung» gearbeitet. Der Ort und die
   * Arbeit liessen sich belegen, das Zitat nicht: Der Text liess ihn schreiben,
   * «mit dieser einen Stadt sei der ganze Erdkreis untergegangen», und er habe
   * «tagelang nicht zur Arbeit zurück» gefunden.
   *
   * Beides hielt nicht. Der Gedanke vom Erdkreis, der in einer Stadt untergeht,
   * steht im Vorwort zu Hieronymus' Ezechiel-Kommentar («in una urbe totus
   * orbis interiit»); zitierfähig auf Deutsch fand sich davon nichts. Was sich
   * wörtlich belegen liess, ist die andere, stärkere Stelle aus Brief 127,12 —
   * und die sagt etwas anderes: nicht der Erdkreis ging unter, sondern die
   * Stadt, die den Erdkreis besiegt hatte, wurde eingenommen. Der Text folgt
   * jetzt dieser Stelle. Die Arbeitsunterbrechung ist gestrichen, weil keine
   * der abgerufenen deutschsprachigen Quellen sie hergibt. */
  {
    id: "EP-fb7e60",
    anker: "die Stimme stocke ihm",
    url: "https://de.wikipedia.org/wiki/Pl%C3%BCnderung_Roms_(410)",
    titel: "Plünderung Roms (410) (Wikipedia)",
    stelle:
      "Wörtlich zu Hieronymus' Reaktion: «Die Stimme stockt mir, und vor Schluchzen kann ich nicht weiterdiktieren: Die Stadt Rom ist eingenommen, die zuvor die ganze Welt besiegt hatte.» Der Artikel weist die Stelle als Briefe 127,12 nach.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-fb7e60",
    anker: "fern in Bethlehem an seiner Bibelübersetzung arbeitete",
    url: "https://de.wikipedia.org/wiki/Vulgata",
    titel: "Vulgata (Wikipedia)",
    stelle:
      "«Nach dem Tod des Papstes 384 siedelte Hieronymus nach Bethlehem über und wandte sich der Übersetzung des Alten Testaments zu.» Der Artikel «Hieronymus (Kirchenvater)» ergänzt, dass die von ihm geleitete Gruppe sich in Bethlehem niederliess, wo Paula ein Kloster finanzierte: «Hier konnte sich Hieronymus seiner bibelwissenschaftlichen Arbeit widmen.»",
    geprueft: "2026-08-05",
  },
  /* Anker bewusst auf den Achthundert-Jahre-Satz und nicht auf das Zitat:
   * Beleg-Anker werden nach Wortlaut gesucht, nicht nach Block. Beide Texte
   * enden gleich, ein Anker auf dem Zitat würde darum im Epochen-Block ein
   * zweites Mal auf dieselbe Quelle verlinken. Der Achthundert-Jahre-Satz
   * kommt nur hier vor und war ohnehin unbelegt. */
  {
    id: "PP-ed973f",
    anker: "seit rund achthundert Jahren hatte kein Feind sie eingenommen",
    url: "https://de.wikipedia.org/wiki/Pl%C3%BCnderung_Roms_(410)",
    titel: "Plünderung Roms (410) (Wikipedia)",
    stelle:
      "«Dies war die erste Einnahme Roms seit dem Einfall der Kelten rund 800 Jahre zuvor.» Die Plünderung selbst datiert der Artikel auf den 24. bis 27. August 410. Dort steht auch das Hieronymus-Zitat aus Brief 127,12, dem der Schlusssatz dieses Blocks folgt.",
    geprueft: "2026-08-05",
  },

  /* ── Zerbrechen der Ordnung ───────────────────────────────────────────────
   * 537 belagerten die OSTgoten Rom, nicht die Westgoten von 410. Der Text
   * nannte vorher nur «Goten», was beide Völker verschmolz. */
  {
    id: "EP-c167d2",
    anker: "zerstörten sie die Wasserleitungen",
    url: "https://de.wikipedia.org/wiki/Wasserversorgung_im_R%C3%B6mischen_Reich",
    titel: "Wasserversorgung im Römischen Reich (Wikipedia)",
    stelle:
      "Zur Belagerung Roms: «Bei der vorangegangenen Belagerung wurden die in die Stadt führenden Aquädukte zerstört», worauf der Betrieb der grossen Thermen endgültig zum Erliegen kam und auch die städtischen Mühlen ausfielen. Datierung und Zuordnung zu den Ostgoten (Januar 537 bis März 538) über den Artikel «Gotenkrieg (535–554)».",
    geprueft: "2026-07-29",
  },

  /* ── Epochen-Prüfung vom 2026-08-05 ───────────────────────────────────────
   * Anlass: Christofs Frage, woher die Hieronymus-Aussage stammt — von
   * nirgends, wie sich zeigte. Darauf wurden alle acht Epochen von
   * «Philosophie in Zeiten der Verunsicherung» Satz für Satz nachgeschlagen
   * (386 Einzelaussagen, jede Quelle doppelt abgerufen: einmal beim Finden,
   * einmal beim Gegenprüfen). Die Belege hier gehören zu den 17 dabei
   * korrigierten Stellen. Zwei Korrekturen (Kirchner 1914→1915) wurden im
   * Gegendurchgang VERWORFEN, weil Hauptartikel und Sächsische Biografie
   * 1914 stützen — der Text blieb dort unverändert. */
  {
    id: "EP-54ba47",
    anker: "die Verfassungen von 158 griechischen Städten",
    url: "https://de.wikipedia.org/wiki/Aristoteles",
    titel: "Aristoteles (Wikipedia)",
    stelle:
      "«Die Fülle des Materials, das Aristoteles sammelte (etwa zu den 158 Verfassungen der griechischen Stadtstaaten), lässt darauf schliessen, dass er über zahlreiche Mitarbeiter verfügte.» Vorher stand hier «Gesetze von über 150 Städten» — gesammelt wurden Verfassungen, das erhaltene Stück heisst «Die Verfassung der Athener».",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-54ba47",
    anker: "nach dessen Wandelhalle",
    url: "https://de.wikipedia.org/wiki/Peripatos",
    titel: "Peripatos (Wikipedia)",
    stelle:
      "Der Schulname kommt vom Ort: «leitet sich ihr Name von dem Ort ab, an dem der Unterricht stattfand, in diesem Fall vom Peripatos (Wandelhalle)». Die Herleitung vom Herumwandeln beim Lehren, die vorher hier stand, nennt der Artikel eine populäre Etymologie, die «daher nicht zu[trifft]».",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-9ad93c",
    anker: "nur zu einer Geldbusse herab",
    url: "https://de.wikipedia.org/wiki/Sokrates",
    titel: "Sokrates (Wikipedia)",
    stelle:
      "Nach dem Vorschlag der Speisung im Prytaneion nannte Sokrates laut Platons Apologie doch noch eine Geldstrafe (eine Mine, von Freunden auf dreissig aufgestockt); im «Phaidon»-Artikel: «bot Kriton vergeblich an, sich bei Verhängung einer Geldstrafe für deren Zahlung zu verbürgen». Vorher fehlte dieser Zwischenschritt.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-fbded4",
    anker: "die Münzprägung schrumpfte auf einen Bruchteil",
    url: "https://de.wikipedia.org/wiki/Merowinger",
    titel: "Merowinger (Wikipedia)",
    stelle:
      "Die Prägung brach nicht ab, sie schrumpfte und wechselte den Herrn: «Um 585 stellte man so die Praxis ein, Münzen im Namen des Kaisers zu prägen.» Theudebert I. liess schon vorher Goldmünzen mit eigenem Bild schlagen. Vorher behauptete der Text, es habe niemand mehr Münzen geprägt.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-9d10fe",
    anker: "beschlossen aufständische Bauern in Memmingen",
    url: "https://www.historisches-lexikon-bayerns.de/Lexikon/Zw%C3%B6lf_Artikel",
    titel: "Historisches Lexikon Bayerns: Zwölf Artikel",
    stelle:
      "Memmingen ist der Ort der Beratung und Verabschiedung («verfassunggebende Bauernversammlung», Peter Blickle), gedruckt wurde «in der Augsburger Druckerei des Melchior Ramminger». Vorher stand hier «druckten … in Memmingen».",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-8aaf1a",
    // Anker NEBEN «Skeptiker» — das Wort trägt eine Glossar-Erklärung, und
    // ein Beleg darüber würde sie verdecken (docs/anker-kollision.mjs).
    anker: "Deckenbalken seiner Bibliothek",
    url: "https://de.wikipedia.org/wiki/Michel_de_Montaignes_Turmbibliothek",
    titel: "Michel de Montaignes Turmbibliothek (Wikipedia)",
    stelle:
      "Die Sentenzen wurden gemalt beziehungsweise «in die Balken gebrannt», nicht geschnitzt. Die Skeptiker stimmen: 14 der griechischen Texte gehen auf Sextus Empiricus und Diogenes Laertios zurück, aus denen Montaigne den Pyrrhonismus kannte.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-f04382",
    anker: "fast sein ganzes Leben",
    url: "https://de.wikipedia.org/wiki/Immanuel_Kant",
    titel: "Immanuel Kant (Wikipedia)",
    stelle:
      "Das «fast» ist nötig: Um 1748–1754 war Kant Hauslehrer auf dem Land, «bei dem reformierten Prediger Daniel Ernst Andersch … in Judtschen bei Gumbinnen» und danach «auf dem Gut des Majors Bernhard Friedrich von Hülsen auf Gross-Arnsdorf bei Mohrungen».",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-426ea1",
    anker: "als ein Pferd es durchhält",
    url: "https://de.wikipedia.org/wiki/Rocket_(Lokomotive)",
    titel: "Rocket (Lokomotive) (Wikipedia)",
    stelle:
      "Die Rocket erreichte 47 km/h Höchstgeschwindigkeit; ein Englisches Vollblut läuft laut dem Artikel «Hauspferd» bis zu 70 km/h. Neu war also nicht die Spitze, sondern das Durchhalten — vorher behauptete der Text «schneller, als je ein Pferd gelaufen war».",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-ba67cc",
    anker: "Textilarbeiter",
    url: "https://de.wikipedia.org/wiki/Maschinenst%C3%BCrmer",
    titel: "Maschinenstürmer (Wikipedia)",
    stelle:
      "Die Bewegung begann 1811 in Nottingham bei den Strumpfwirkern; dazu kamen «Tuchscherer (West Riding of Yorkshire), Baumwollweber (Süd-Lancashire) und Strumpfwirker (Nottingham)». Die Verengung auf «Weber», die vorher hier stand, traf nur einen Teil.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-991c07",
    anker: "12'000 Soldaten",
    url: "https://de.wikipedia.org/wiki/Maschinenst%C3%BCrmer",
    titel: "Maschinenstürmer (Wikipedia)",
    stelle:
      "«1811/1812 kam es zu einem regelrechten Aufruhr in Nottingham, den der englische Staat durch 12.000 Soldaten niederschlagen liess.»",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-991c07",
    anker: "mehr als Wellington 1808",
    // Bewusst englisch: Der Vergleich mit Wellingtons Armee steht nur im
    // englischen Artikel — und er gilt für 1808. Der Text sagte vorher «als
    // auf der iberischen Halbinsel gegen Napoleon», also zeitgleich 1812;
    // bei Salamanca führte Wellington damals aber 48'500 Mann.
    url: "https://en.wikipedia.org/wiki/Luddite",
    titel: "Luddite (englische Wikipedia)",
    stelle:
      "«The 12,000 troops deployed against the Luddites greatly exceeded in size the army which Wellington took into the Peninsula in 1808.»",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-108bc5",
    anker: "zehn Tage danach",
    url: "https://de.wikipedia.org/wiki/Clara_Immerwahr",
    titel: "Clara Immerwahr (Wikipedia)",
    stelle:
      "«Clara Haber erschoss sich am 2. Mai 1915.» Der Giftgasangriff bei Ypern war am 22. April 1915 (Artikel «Fritz Haber») — zehn Tage, nicht «wenige Tage», wie vorher hier stand.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-ca525c",
    anker: "1989 in einem Aufsatz und 1992 im gleichnamigen Buch",
    url: "https://de.wikipedia.org/wiki/Ende_der_Geschichte",
    titel: "Ende der Geschichte (Wikipedia)",
    stelle:
      "Bekannt wurde die These «durch einen im Sommer 1989 veröffentlichten Artikel in der Zeitschrift The National Interest und ein Buch mit diesem Titel (1992)». Geprägt hat Fukuyama den Ausdruck nicht: Er «wiederholt insbesondere Gedanken, die Alexandre Kojève in den 1930er und 40er Jahren formuliert hatte».",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-f1ce65",
    anker: "US-Behörden NASA und NOAA",
    url: "https://de.wikipedia.org/wiki/National_Oceanic_and_Atmospheric_Administration",
    titel: "NOAA (Wikipedia)",
    stelle:
      "Die NOAA ist die «Wetter- und Ozeanografiebehörde der Vereinigten Staaten», keine Weltraumbehörde — so nannte der Text vorher beide.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-3794d6",
    anker: "letzten bemannten Mondlandung",
    url: "https://de.wikipedia.org/wiki/Apollo_17",
    titel: "Apollo 17 (Wikipedia)",
    stelle:
      "«Mit Apollo 17 landeten zum sechsten und vorerst letzten Mal Menschen auf dem Mond.» Als letzte bemannte MondMISSION gilt sie seit April 2026 nicht mehr: «Apollo 17 blieb bis zur Mission Artemis 2 im Jahr 2026 der letzte bemannte Mondflug» — Artemis 2 umrundete den Mond, landete aber nicht.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-92640b",
    anker: "stand 1955 erstmals im Antrag",
    url: "https://de.wikipedia.org/wiki/Dartmouth_Conference",
    titel: "Dartmouth Conference (Wikipedia)",
    stelle:
      "Der Antrag von 1955: «We propose that a 2 month, 10 man study of artificial intelligence be carried out during the summer of 1956 at Dartmouth College.» Die Werkstatt selbst lief «im Sommer 1956 vom 19. Juni bis zum 16. August». Vorher liess der Text den Begriff 1956 entstehen.",
    geprueft: "2026-08-05",
  },

  /* ── Container und Web: die Kosten der Distanz ────────────────────────────
   * Nachgetragen am 2026-08-05 auf Christofs Wunsch. Die Container-Geschichte
   * stand in zwei Blöcken («Ende der Geschichte» und «Grenzenloser
   * Welthandel») und in beiden ohne Beleg.
   *
   * Nicht belegt werden konnte die Kostenangabe («auf einen Bruchteil»), sie
   * steht als begründeter Nicht-Beleg weiter unten. */
  {
    id: "EP-b08d96",
    anker: "58 Stahlkisten von Newark nach Houston",
    url: "https://de.wikipedia.org/wiki/Malcom_McLean",
    titel: "Malcom McLean (Wikipedia)",
    stelle:
      "«Am 26. April 1956 verliess schliesslich das erste seiner Containerschiffe, die Ideal X, den Hafen von Newark (New Jersey) mit dem Ziel Houston in Texas.» Zuvor hatte McLean «zwei gebrauchte Tanker von der US-Marine» erworben, die «zu Containerschiffen umgebaut wurden». Die Zahl 58 steht im Artikel «Ideal X» in den Schiffsdaten (Container = 58), das Schiff dort als «zum Containerfrachter umgebauter T2-SE-A1 Tanker».",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-b08d96",
    anker: "amerikanische Spediteur",
    url: "https://de.wikipedia.org/wiki/Malcom_McLean",
    titel: "Malcom McLean (Wikipedia)",
    stelle:
      "McLean kaufte 1935 «von dem gesparten Geld einen gebrauchten LKW» und gründete mit seinen Geschwistern «eine kleine Spedition»; die Einleitung nennt ihn «Reeder und Transportunternehmer». Schon «1937 ärgerte sich McLean … über die langen Wartezeiten, die beim Entladen» anfielen.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-b08d96",
    anker: "«vage, aber aufregend»",
    url: "https://blog.hnf.de/wolkig-aber-aufregend-wie-das-web-geboren-wurde/",
    titel: "Heinz Nixdorf MuseumsForum: Wolkig aber aufregend, wie das Web geboren wurde",
    stelle:
      "«Laut Überlieferung stellte Berners-Lee den Vorschlag am 12. März 1989 fertig … verteilte er ihn an die Kollegen bis hinauf zum Leiter seiner Arbeitsgruppe, den englischen Physiker Mike Sendall.» Und: «In den World-Wide-Web-Mythos gingen zwei Notizen von Mike Sendall ein: das ‹Vague but exciting› … auf dem Cover.» Das Original ist englisch; die deutschen Wiedergaben schwanken (das HNF schreibt «wolkig aber aufregend», die Computerwoche «Vage, aber hochinteressant»).",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-b08d96",
    anker: "1993 gab das CERN diese Technik zur freien Nutzung frei",
    url: "https://de.wikipedia.org/wiki/World_Wide_Web",
    titel: "World Wide Web (Wikipedia)",
    stelle:
      "«Am 30. April 1993 gab das Direktorium des europäischen Kernforschungszentrums CERN das World Wide Web kostenlos für die Öffentlichkeit frei.» Zur Gebührenfreiheit auch: Das WWW «baut … auf einem freien Protokoll auf, was die Entwicklung von Servern und Clients ohne Beschränkungen durch Lizenzen möglich machte».",
    geprueft: "2026-08-05",
  },
  {
    id: "PP-08cebe",
    anker: "1956 erstmals genormte Stahlkisten auf ein umgebautes Schiff heben",
    url: "https://de.wikipedia.org/wiki/Ideal_X",
    titel: "Ideal X (Wikipedia)",
    stelle:
      "«Die Jungfernfahrt als Containerschiff fand am 26. April 1956 auf der Route von Newark (New Jersey) nach Houston statt und wurde sowohl von Ladungsbeteiligten als auch von Gewerkschaften und Regierungsvertretern genau beobachtet.» Das Schiff war ein umgebauter T2-Tanker mit 58 Containern.",
    geprueft: "2026-08-05",
  },
  {
    // Nachgetragen am 2026-08-05: Der Block war mit «Umwelt & KI»
    // überschrieben, nannte aber keine der Techniken, die die Umwelt
    // gefährden. Der ergänzte Satz braucht darum einen Beleg.
    id: "EP-43dad6",
    anker: "Kraftwerken, Fahrzeugen und Heizungen",
    url: "https://de.wikipedia.org/wiki/Globale_Erw%C3%A4rmung",
    titel: "Globale Erwärmung (Wikipedia)",
    stelle:
      "Für 2019, bei 59 Milliarden Tonnen CO₂-Äquivalent gesamt: «Die wichtigste Emissionsquelle war die Kohlendioxidfreisetzung aus fossilen Energieträgern und Industrieprozessen mit 38 ± 3 Mrd. Tonnen, gefolgt von Methanfreisetzung (11 ± 3,2 Mrd. Tonnen), Kohlendioxidemissionen aus Landnutzungsänderungen wie Entwaldung (6,6 ± 4,6 Mrd. Tonnen).» Die Aufzählung «Kraftwerke, Fahrzeuge, Heizungen» ist die alltagssprachliche Auflösung von «fossile Energieträger», die der Artikel nicht einzeln aufschlüsselt.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-43dad6",
    anker: "das Methan der Viehhaltung und die Rodung der Wälder",
    url: "https://de.wikipedia.org/wiki/Globale_Erw%C3%A4rmung",
    titel: "Globale Erwärmung (Wikipedia)",
    stelle:
      "Die Erwärmung wird «hauptsächlich durch Treibhausgase (Verbrennung von fossilen Energieträgern, Methanausstoß bei der Viehhaltung, Freisetzung von CO₂ bei der Zementherstellung) sowie durch die Rodungen von Waldgebieten verursacht».",
    geprueft: "2026-08-05",
  },
  {
    id: "PP-b4342b",
    anker: "vage, aber aufregend",
    url: "https://blog.hnf.de/wolkig-aber-aufregend-wie-das-web-geboren-wurde/",
    titel: "Heinz Nixdorf MuseumsForum: Wolkig aber aufregend, wie das Web geboren wurde",
    stelle:
      "Der Vermerk stammt von Mike Sendall, dem Leiter der Arbeitsgruppe, auf dem Deckblatt des Vorschlags vom 12. März 1989: «Vague but exciting». Das Papier hiess «Information Management: A Proposal».",
    geprueft: "2026-08-05",
  },
];

/**
 * Blöcke, für die bewusst KEIN Link gesetzt wird, mit Begründung. Das ist
 * genauso wichtig wie ein Beleg: Es hält fest, dass gesucht und nichts
 * Brauchbares gefunden wurde, damit niemand später aus Verlegenheit eine
 * ungefähr passende Quelle einsetzt.
 */
export interface KeinBeleg {
  id: string;
  /** Worum es in dem Block geht, für die Lesbarkeit des Berichts. */
  betrifft: string;
  grund: string;
  notiert: string;
}

export const OHNE_BELEG: KeinBeleg[] = [
  {
    id: "EP-b08d96",
    betrifft:
      "«die Kosten für das Verladen einer Tonne Fracht sanken dadurch auf einen Bruchteil» (gleichlautend in PP-08cebe: «senkte die Verladekosten auf einen Bruchteil»)",
    grund:
      "Die Zahl hinter dieser Aussage (rund 5.83 Dollar je Tonne im Stückgutbetrieb gegen etwa 16 Cent auf der Ideal X) geht auf Marc Levinsons «The Box» (2006) zurück. Weder die deutsche noch die englische Wikipedia führt sie, und eine frei zugängliche deutschsprachige Darstellung mit dieser Angabe haben wir am 2026-08-05 nicht gefunden. Das Buch selbst liegt uns nicht vor, und aus dem Gedächtnis wird hier nichts belegt. Die Aussage bleibt darum unbelegt stehen, statt sie in eine unscharfe Formulierung umzubauen: Belegt ist der Anlass (McLean ärgerte sich über die Wartezeiten beim Entladen), nicht die Höhe der Ersparnis.",
    notiert: "2026-08-05",
  },
  {
    id: "PP-8fa9ca",
    betrifft:
      "«mit magnetischen Löffeln richteten Wahrsager Häuser und Gräber günstig aus»",
    grund:
      "Die Wahrsage-Herkunft des Kompasses ist in der Fachliteratur (Needham) belegt, aber wir haben keine frei zugängliche deutschsprachige Seite gefunden, die genau den Löffel-Kompass der Wahrsager beschreibt. Der Wikipedia-Artikel «Kompass» erwähnt ihn nur beiläufig. Bis eine tragfähige Quelle da ist, bleibt die Stelle ohne Link.",
    notiert: "2026-07-26",
  },
  {
    id: "PP-8fa9ca",
    betrifft: "«der Legende nach auch Napoleon und Benjamin Franklin»",
    grund:
      "Steht so nicht in diesem Block, sondern beim Schachtürken; hier nur als Hinweis, dass Legenden-Zuschreibungen grundsätzlich keinen Beleg bekommen. Sie sind im Text bereits als Legende gekennzeichnet.",
    notiert: "2026-07-26",
  },
  {
    id: "VA-03d91c",
    betrifft: "Geopolitik: «Seit Januar 2026 werden bestimmte Ausfuhren wieder fallweise geprüft»",
    grund:
      "Die US-Behörde BIS veröffentlicht solche Kurswechsel als Pressemitteilungen, deren Adressen sich ändern. Wir haben keine dauerhaft stabile, frei zugängliche Seite gefunden, die den Stand von Januar 2026 belegt. Statt einen Link zu setzen, der bald ins Leere führt, bleibt die Stelle unbelegt und trägt im Text ihr Standdatum.",
    notiert: "2026-07-26",
  },
  {
    id: "VA-4a5fb5",
    betrifft: "Zugang: Gratisstufe gegenüber Abo bei den grossen Chatbots",
    grund:
      "Die Preis- und Limitseiten der Anbieter ändern sich laufend, ein Beleg wäre in Monaten falsch. Der Text nennt darum kein einzelnes Produkt mehr und trägt das Standdatum 2026. Absichtlich ohne Link.",
    notiert: "2026-07-26",
  },
];

/** Alle Belege eines Textblocks. */
export function belegeVon(id: string): Beleg[] {
  return BELEGE.filter((b) => b.id === id);
}

/** Anker → Beleg, längste Anker zuerst, damit sie beim Suchen gewinnen. */
export const BELEG_NACH_ANKER: [string, Beleg][] = BELEGE.map(
  (b) => [b.anker, b] as [string, Beleg],
).sort((a, b) => b[0].length - a[0].length);
