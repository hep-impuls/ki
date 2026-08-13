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
    id: "PP-f6cce2",
    anker: "Daoistische Alchemisten",
    url: "https://de.wikipedia.org/wiki/Schwarzpulver",
    titel: "Schwarzpulver (Wikipedia)",
    stelle:
      "Abschnitt «Geschichte»: Chinesische Alchemisten fanden die explosive Mischung bei Versuchen zur Herstellung eines Lebenselixiers.",
    geprueft: "2026-07-26",
  },
  {
    id: "PP-f6cce2",
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
    /* Nicht bloss «Nvidia»: Der Name kommt in drei Blöcken vor (auch in «Big
       Data & Gegenwart» und «Geopolitik»), und die Anker-Zuordnung ist global.
       Ein kurzer Anker hängt seine Quelle darum an fremde Aussagen. */
    anker: "stieg Nvidia 2024 zeitweise zum wertvollsten Unternehmen der Welt auf",
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
      "Klarnas eigene Angabe: Der KI-Assistent führte 2,3 Millionen Unterhaltungen, zwei Drittel aller Kundendienst-Chats und leiste damit die Arbeit von 700 Vollzeitmitarbeitenden. Unabhängig nachgemessen wurde das nicht.",
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
    /* Nicht bloss «UNESCO»: Das Wort steht auch im Teppich, wo die Pfahlbauten
       zum UNESCO-Welterbe gehören. Weil die Anker-Zuordnung global ist, hing
       dort bis 2026-08-11 diese Studie über Geschlechterstereotype — Christof
       hat den Fehler gefunden («komisch, dass das Geschlecht vernetzt ist»). */
    anker: "Eine UNESCO-Studie von 2024",
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
    id: "EP-d33896",
    anker: "drehbar an Pflöcken befestigt waren",
    url: "https://de.wikipedia.org/wiki/Solon",
    titel: "Solon (Wikipedia)",
    stelle:
      "Abschnitt «Solons Gesetzgebung»: Das Gesetzeswerk wurde auf Holztafeln (Axones) gesichert, «in der Art heutiger Postkartenständer drehbar an Pflöcken befestigt». Aufbewahrt wurden sie im Prytaneion. Darum nennt der Lernset-Text keinen Ort.",
    geprueft: "2026-07-29",
  },
  {
    id: "EP-d33896",
    anker: "nach ihrem Münzbild nannte",
    url: "https://de.wikipedia.org/wiki/Altgriechische_M%C3%BCnzen",
    titel: "Altgriechische Münzen (Wikipedia)",
    stelle:
      "Zu den Münzbildern: «Lange blieben die Münzen aus Aigina («Schildkröten» genannt) sowie die aus Korinth («Fohlen») und Athen («Eulen»)» die beherrschenden Zahlungsmittel des frühen Griechenland.",
    geprueft: "2026-07-29",
  },
  {
    id: "EP-d33896",
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
    id: "EP-f0377d",
    anker: "etwa 90 Lautzeichen",
    url: "https://de.wikipedia.org/wiki/Linearschrift_B",
    titel: "Linearschrift B (Wikipedia)",
    stelle:
      "«Bekannt sind etwa 90 Silbenzeichen, 160 Zeichen mit Wortbedeutung sowie diverse Zahlzeichen.» Zum Gebrauch: «Die Funde sind keine literarischen Texte, sondern hauptsächlich Notizen zu wirtschaftlichen und Verwaltungszwecken.»",
    geprueft: "2026-08-04",
  },
  {
    id: "EP-f0377d",
    anker: "vierhundert Jahre lang wird in Griechenland nicht geschrieben",
    url: "https://de.wikipedia.org/wiki/Dunkle_Jahrhunderte_(Antike)",
    titel: "Dunkle Jahrhunderte (Antike) (Wikipedia)",
    stelle:
      "«Die Bezeichnung ‹Dunkles Zeitalter› für die Zeit von ca. 1200 bis 750 v. Chr. lässt sich allerdings weiterhin mit der Schriftlosigkeit dieser Periode begründen.» Der Zeitraum beginnt «ab ca. 1200 v. Chr., dem Ende der sogenannten Mykenischen Palastzeit».",
    geprueft: "2026-08-04",
  },
  {
    id: "EP-f0377d",
    anker: "keine Schulpflicht und keine Schulhäuser",
    url: "https://de.wikipedia.org/wiki/Schule",
    titel: "Schule (Wikipedia), Abschnitt zur Antike",
    stelle:
      "«Dennoch gab es auch in Athen weder eine Schulpflicht noch öffentliche Schulgebäude, sondern die Kinder wurden beim Lehrer zuhause unterrichtet.» Davor: «konnten die Kinder wohlhabender Familien Athens allgemein bildende Schulen besuchen».",
    geprueft: "2026-08-04",
  },
  {
    id: "EP-f0377d",
    anker: "Dazu kommen Münzen",
    url: "https://de.wikipedia.org/wiki/Altgriechische_M%C3%BCnzen",
    titel: "Altgriechische Münzen (Wikipedia)",
    stelle:
      "«Die ersten Münzen wurden von den Lydern im Westen der heutigen Türkei zwischen 650 und ca. 620 v. Chr. als Zahlungsmittel geprägt.» Und: «Die ersten Silbermünzen wurden um 550 v. Chr. in Kleinasien und auf der Insel Aigina geprägt.»",
    geprueft: "2026-08-04",
  },
  {
    id: "EP-f0377d",
    anker: "man zählt sie",
    url: "https://de.wikipedia.org/wiki/Altgriechische_M%C3%BCnzen",
    titel: "Altgriechische Münzen (Wikipedia)",
    stelle:
      "Der entscheidende Gegensatz, wörtlich: Münzen «hatten den Vorteil, immer gleiche Größe, gleiches Gewicht und gleiches Aussehen zu besitzen und statt gewogen abgezählt werden zu können».",
    geprueft: "2026-08-04",
  },
  {
    id: "EP-f0377d",
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
    id: "EP-ddde72",
    anker: "die Stimme stocke ihm",
    url: "https://de.wikipedia.org/wiki/Pl%C3%BCnderung_Roms_(410)",
    titel: "Plünderung Roms (410) (Wikipedia)",
    stelle:
      "Wörtlich zu Hieronymus' Reaktion: «Die Stimme stockt mir und vor Schluchzen kann ich nicht weiterdiktieren: Die Stadt Rom ist eingenommen, die zuvor die ganze Welt besiegt hatte.» Der Artikel weist die Stelle als Briefe 127,12 nach.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-ddde72",
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
    id: "PP-52d713",
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
    id: "EP-112f69",
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
      "«Die Fülle des Materials, das Aristoteles sammelte (etwa zu den 158 Verfassungen der griechischen Stadtstaaten), lässt darauf schliessen, dass er über zahlreiche Mitarbeiter verfügte.» Vorher stand hier «Gesetze von über 150 Städten». Gesammelt wurden Verfassungen, das erhaltene Stück heisst «Die Verfassung der Athener».",
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
    id: "EP-ba3edc",
    anker: "nur zu einer Geldbusse herab",
    url: "https://de.wikipedia.org/wiki/Sokrates",
    titel: "Sokrates (Wikipedia)",
    stelle:
      "Nach dem Vorschlag der Speisung im Prytaneion nannte Sokrates laut Platons Apologie doch noch eine Geldstrafe (eine Mine, von Freunden auf dreissig aufgestockt); im «Phaidon»-Artikel: «bot Kriton vergeblich an, sich bei Verhängung einer Geldstrafe für deren Zahlung zu verbürgen». Vorher fehlte dieser Zwischenschritt.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-9b7189",
    anker: "die Münzprägung schrumpfte auf einen Bruchteil",
    url: "https://de.wikipedia.org/wiki/Merowinger",
    titel: "Merowinger (Wikipedia)",
    stelle:
      "Die Prägung brach nicht ab, sie schrumpfte und wechselte den Herrn: «Um 585 stellte man so die Praxis ein, Münzen im Namen des Kaisers zu prägen.» Theudebert I. liess schon vorher Goldmünzen mit eigenem Bild schlagen. Vorher behauptete der Text, es habe niemand mehr Münzen geprägt.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-b390cc",
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
    id: "EP-f9ae19",
    anker: "fast sein ganzes Leben",
    url: "https://de.wikipedia.org/wiki/Immanuel_Kant",
    titel: "Immanuel Kant (Wikipedia)",
    stelle:
      "Das «fast» ist nötig: Um 1748–1754 war Kant Hauslehrer auf dem Land, «bei dem reformierten Prediger Daniel Ernst Andersch … in Judtschen bei Gumbinnen» und danach «auf dem Gut des Majors Bernhard Friedrich von Hülsen auf Gross-Arnsdorf bei Mohrungen».",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-cada84",
    anker: "als ein Pferd es durchhält",
    url: "https://de.wikipedia.org/wiki/Rocket_(Lokomotive)",
    titel: "Rocket (Lokomotive) (Wikipedia)",
    stelle:
      "Die Rocket erreichte 47 km/h Höchstgeschwindigkeit; ein Englisches Vollblut läuft laut dem Artikel «Hauspferd» bis zu 70 km/h. Neu war also nicht die Spitze, sondern das Durchhalten; vorher behauptete der Text «schneller, als je ein Pferd gelaufen war».",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-b8a47b",
    anker: "Textilarbeiter",
    url: "https://de.wikipedia.org/wiki/Maschinenst%C3%BCrmer",
    titel: "Maschinenstürmer (Wikipedia)",
    stelle:
      "Die Bewegung begann 1811 in Nottingham bei den Strumpfwirkern; dazu kamen «Tuchscherer (West Riding of Yorkshire), Baumwollweber (Süd-Lancashire) und Strumpfwirker (Nottingham)». Die Verengung auf «Weber», die vorher hier stand, traf nur einen Teil.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-c6ae89",
    anker: "12'000 Soldaten",
    url: "https://de.wikipedia.org/wiki/Maschinenst%C3%BCrmer",
    titel: "Maschinenstürmer (Wikipedia)",
    stelle:
      "«1811/1812 kam es zu einem regelrechten Aufruhr in Nottingham, den der englische Staat durch 12.000 Soldaten niederschlagen liess.»",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-c6ae89",
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
    id: "EP-30fb42",
    anker: "zehn Tage danach",
    url: "https://de.wikipedia.org/wiki/Clara_Immerwahr",
    titel: "Clara Immerwahr (Wikipedia)",
    stelle:
      "«Clara Haber erschoss sich am 2. Mai 1915.» Der Giftgasangriff bei Ypern war am 22. April 1915 (Artikel «Fritz Haber»), also zehn Tage, nicht «wenige Tage», wie vorher hier stand.",
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
      "Die NOAA ist die «Wetter- und Ozeanografiebehörde der Vereinigten Staaten», keine Weltraumbehörde. So nannte der Text vorher beide.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-53e8e4",
    anker: "letzten bemannten Mondlandung",
    url: "https://de.wikipedia.org/wiki/Apollo_17",
    titel: "Apollo 17 (Wikipedia)",
    stelle:
      "«Mit Apollo 17 landeten zum sechsten und vorerst letzten Mal Menschen auf dem Mond.» Als letzte bemannte MondMISSION gilt sie seit April 2026 nicht mehr: «Apollo 17 blieb bis zur Mission Artemis 2 im Jahr 2026 der letzte bemannte Mondflug». Artemis 2 umrundete den Mond, landete aber nicht.",
    geprueft: "2026-08-05",
  },
  /* ── Der Schachtürke ──────────────────────────────────────────────────────
   * Ergänzt am 2026-08-08 auf Christofs Hinweis: «als Türke kostümierte Figur»
   * liess offen, wer oder was der «Türke» überhaupt ist — eine Person? ein
   * Volk? Jetzt steht da, dass es eine Puppe ist und woher der Name kommt.
   * Beim Nachschlagen kam dazu, dass der gezeigte Kupferstich den Mechanismus
   * falsch darstellt; das stand vorher nicht im Text, obwohl genau dieses Bild
   * daneben liegt.
   *
   * Am selben Tag umgezogen: Christof fand die Bildgeschichte zu lang. Die
   * Einzelheiten stehen jetzt bei den drei Bildpunkten, wo man sie an der Sache
   * selbst sieht — Turban bei Punkt 1 (VA-c4ea88), versteckter Mann bei Punkt 2
   * (VA-0fb159), offenes Fach bei Punkt 3 (VA-03a61c). Beim Verschieben fiel
   * eine Ungenauigkeit auf: Es hiess, der Bediener habe die Figur «über Hebel
   * und Magnete» gesteuert. Die Magnete dienten dem Erkennen der gegnerischen
   * Züge, der Arm lief über einen Pantographen. Beides jetzt getrennt. */
  {
    id: "VA-c4ea88",
    anker: "osmanischem Gewand und Turban",
    url: "https://de.wikipedia.org/wiki/Schacht%C3%BCrke",
    titel: "Schachtürke (Wikipedia)",
    stelle:
      "Abschnitt «Funktionsweise»: «Die Maschine bestand aus einem lebensgroßen Modell eines menschlichen Kopfes und Oberkörpers mit schwarzem Bart und grauen Augen, welcher in osmanische Gewändern und einen Turban gekleidet war.» In der Einleitung: «eine lebensgroße, orientalisch gekleidete Figur, die hinter einem Schachbrett saß», und der Automat wurde «auch kurz ‹Türke› genannt».",
    geprueft: "2026-08-08",
  },
  {
    id: "VA-c4ea88",
    anker: "eines orientalischen Zauberers",
    url: "https://de.wikipedia.org/wiki/Schacht%C3%BCrke",
    titel: "Schachtürke (Wikipedia), zur Wirkung des Kostüms",
    stelle:
      "Die Kleidung war laut dem dort zitierten Autor Tom Standage «die traditionelle Kleidung eines orientalischen Zauberers». Das Kostüm gehörte also zur Schaustellerei, nicht zur Mechanik.",
    geprueft: "2026-08-08",
  },
  {
    id: "VA-c4ea88",
    anker: "später ein Sprechwerk dazu",
    url: "https://de.wikipedia.org/wiki/Schacht%C3%BCrke",
    titel: "Schachtürke (Wikipedia), zum Sprechwerk",
    stelle:
      "«Nach dem Erwerb durch Mälzel wurde ein Sprachmodul hinzugefügt, das der Maschine erlaubte, während einer Partie ‹Échec!› (französisch für ‹Schach!›) zu sagen.» Im Lernset «Sprechwerk», weil «Modul» hier moderner klingt als die Sache ist.",
    geprueft: "2026-08-08",
  },
  {
    id: "VA-0fb159",
    anker: "an Magneten unter den Figuren",
    url: "https://de.wikipedia.org/wiki/Schacht%C3%BCrke",
    titel: "Schachtürke (Wikipedia), zur Mechanik",
    stelle:
      "Zum Erkennen der Züge: «Jede Schachfigur hatte einen kleinen, starken Magneten an ihrer Unterseite. Wenn sie auf das Brett gestellt wurden, zogen sie jeweils einen darunter befestigten Magneten an, der mit einer Schnur verbunden war. So konnte der Operator im Inneren erkennen, wenn Figuren bewegt wurden.» Dazu waren die Felder innen mit 1 bis 64 markiert. Zum Arm: «Im Inneren der Maschine befand sich außerdem ein Steckbrett-Schachfeld, das über eine pantographenartige Hebelmechanik mit dem linken Arm des Modells verbunden war.»",
    geprueft: "2026-08-08",
  },
  {
    id: "VA-0fb159",
    anker: "für deren Rauch eine Lüftung eingebaut war",
    url: "https://de.wikipedia.org/wiki/Schacht%C3%BCrke",
    titel: "Schachtürke (Wikipedia), zur Kerze im Kasten",
    stelle:
      "«Dem Operator war dies alles mithilfe einer einfachen Kerze sichtbar, für die ein Belüftungssystem im Inneren des Modells integriert war.»",
    geprueft: "2026-08-08",
  },
  {
    id: "VA-03a61c",
    anker: "Zahnräder und Uhrwerk",
    url: "https://de.wikipedia.org/wiki/Schacht%C3%BCrke",
    titel: "Schachtürke (Wikipedia), zur Vorführung des offenen Kastens",
    stelle:
      "«Beim Öffnen der linken Seite wurden Zahnräder und Uhrwerkmechanismen sichtbar. Dieser Bereich war so konstruiert, dass man durch die gesamte Maschine hindurchsehen konnte, wenn gleichzeitig auch die hinteren Türen geöffnet wurden.» Und zum verschiebbaren Sitz: «Mithilfe eines ausgeklügelten Systems aus Magneten, Hebeln und beweglichen Sitzvorrichtungen konnte sich die versteckte Person im Gehäuse so positionieren, dass sie bei den Vorführungen nicht entdeckt wurde.»",
    geprueft: "2026-08-08",
  },
  {
    id: "VA-03a61c",
    anker: "Seine Rekonstruktion gilt als unmöglich",
    url: "https://de.wikipedia.org/wiki/Schacht%C3%BCrke",
    titel: "Schachtürke (Wikipedia), zur Racknitz-Darstellung",
    stelle:
      "Bildlegende zum Kupferstich: «Die Darstellung basiert auf Racknitz' Berechnungen und gilt aufgrund der Proportionen der tatsächlichen Apparatur als unmöglich.»",
    geprueft: "2026-08-08",
  },

  /* ── Quipu und Frankenstein ───────────────────────────────────────────────
   * Ergänzt am 2026-08-08, als Christof das Verhältnis von Bildgeschichte zu
   * Bildpunkten in der ganzen Galerie verschoben haben wollte (kürzere
   * Geschichte, gehaltvollere Punkte — so wie beim Schachtürken). Umgeschichtet
   * wurde vor allem Vorhandenes; wo ein Punkt danach zu dünn geblieben wäre,
   * kam Neues dazu, und das ist hier belegt. */
  {
    id: "VA-e54444",
    anker: "Eine Null ist ein Abschnitt ohne Knoten",
    url: "https://de.wikipedia.org/wiki/Quipu",
    titel: "Quipu (Wikipedia), zum Stellenwert der Knoten",
    stelle:
      "«Die Stellen (Zehnerpotenzen) wurden in der Reihenfolge ihrer Höhe vom Ansatz zum freien Ende hin abgelesen, also: Tausender-Hunderter-Zehner-Einer. Die Ziffer Null wurde für alle Stellen als knotenfreier Gruppenabschnitt geschrieben.»",
    geprueft: "2026-08-08",
  },
  {
    id: "VA-e32c4a",
    anker: "ist bis heute nicht entziffert",
    url: "https://de.wikipedia.org/wiki/Quipu",
    titel: "Quipu (Wikipedia), zum Entschlüsselungsstand",
    stelle:
      "«Nach heutiger Erkenntnis gab es zwei verschiedene Schriftsysteme: eines zur zahlenmäßigen Erfassung von Mengen […] und ein phonetisch orientiertes System für Nachrichtenverkehr, wie Briefwechseln.» Und dazu: «Die Knotenschrift für den Schriftverkehr ist bis heute nicht entziffert.»",
    geprueft: "2026-08-08",
  },
  {
    id: "VA-f8feb4",
    // Achtung beim Nachschlagen: «Frankenstein oder Der moderne Prometheus»
    // ist eine Weiterleitung, der Artikel liegt unter «Frankenstein (Roman)».
    anker: "es lernt durch blosses Zuhören sprechen",
    url: "https://de.wikipedia.org/wiki/Frankenstein_(Roman)",
    titel: "Frankenstein (Roman) (Wikipedia), zum Geschöpf",
    stelle:
      "Abschnitt «Übersicht»: «Es hat in seinen zwei Lebensjahren durch bloßes Zuhören sprechen gelernt und eine erstaunliche Bildung erworben.» Zur Lektüre: «Miltons Paradise Lost löst in ihm Reflexionen über sein Dasein aus (Kap. 15)», dazu in der Anmerkung Volneys «Les Ruines» und «Goethes Werther», und Plutarchs Doppelbiographien, «mit Hilfe derer Frankensteins Geschöpf versucht, die Menschheit zu ergründen». Zur Forderung nach Gemeinschaft: «Es fordert von seinem Schöpfer, seine Einsamkeit durch eine ihm entsprechende Gefährtin zu beenden.» Und im Wortlaut des Geschöpfs: «Ich war gütig und gut. Nur das Elend ließ mich böse werden.»",
    geprueft: "2026-08-08",
  },
  {
    id: "VA-ec8745",
    anker: "den Blick auf den Schöpfer, nicht auf das Geschöpf",
    url: "https://de.wikipedia.org/wiki/Frankenstein_(Roman)",
    titel: "Frankenstein (Roman) (Wikipedia), Abschnitt «Prometheus-Motiv»",
    stelle:
      "«Im Gegensatz zum Populärverständnis fokussiert der Titel die Aufmerksamkeit nicht auf das Geschöpf, sondern auf seinen Schöpfer.»",
    geprueft: "2026-08-08",
  },
  {
    // Auf Christofs Wunsch, damit «überwachtes Lernen» im Bildpunkt anklickbar
    // ist und nicht nur die Kurzfassung im Nebensatz dasteht.
    id: "VA-bbf698",
    anker: "überwachten Lernens",
    url: "https://de.wikipedia.org/wiki/%C3%9Cberwachtes_Lernen",
    titel: "Überwachtes Lernen (Wikipedia)",
    stelle:
      "«Überwachtes Lernen (englisch supervised learning) ist eine wichtige Kategorie des Maschinellen Lernens. Dabei wird ein Lernalgorithmus mit Datensätzen trainiert und validiert, die für jede Eingabe einen passenden Ausgabewert enthalten. Man bezeichnet solche Datensätze als markiert oder gelabelt.» Beispiel dort: Bilder von Katzen und Hunden, denen «in der Regel ein Mensch» das Label beigefügt hat, im Lernset «vorsortierte Beispiele». Abgegrenzt wird es vom unüberwachten Lernen, «bei dem das Modell selbst ohne Vorgaben Muster oder Strukturen identifiziert».",
    geprueft: "2026-08-08",
  },

  /* ── Rechenmaschinen: Leibniz, Babbage, Lovelace ─────────────────────────
   * Geprüft am 2026-08-05, weil Christof den Eindruck hatte, Babbage und
   * Lovelace stünden zu nah beieinander und womöglich fehlerhaft da. Er hatte
   * in beidem recht. Korrigiert wurden drei Punkte:
   *
   *  1. «Ada Lovelace schrieb 1843 das erste Programm dafür» stand als
   *     Tatsache da, ist aber ausdrücklich umstritten — und der Lernset-Text
   *     widersprach sich selbst, weil die Vertiefung schon «was viele
   *     betrachten» schrieb. Jetzt steht der Einwand mit im Text.
   *  2. Leibniz «baute» die Maschine — sie wurde nie ganz gebrauchsfähig.
   *  3. «Ab 1837 entwarf Babbage» — 1837/38 ist das Datum der erhaltenen
   *     Programmtabellen, nicht des Entwurfs.
   *
   * Der Grund für den Eindruck der Nähe war eine Auslassung: Lovelace
   * übersetzte einen Aufsatz von Menabrea über Babbages Maschine und hängte
   * eigene Anmerkungen an. Ohne diesen Schritt sieht es aus, als hätten die
   * zwei gemeinsam an einem Tisch gesessen. */
  {
    id: "VA-282d51",
    anker: "ganz gebrauchsfähig wurde sie nie",
    url: "https://de.wikipedia.org/wiki/Staffelwalze",
    titel: "Staffelwalze (Wikipedia)",
    stelle:
      "«Die erste Rechenmaschine nach dem Staffelwalzenprinzip entwickelte Gottfried Wilhelm Leibniz (1646–1716). Das Prinzip stellte er 1673 der Royal Society in London vor. Die daraus entwickelte Maschine war nahezu gebrauchsfähig, das heisst, auf ihr wurden einige Beispielaufgaben zur Funktionsprüfung gerechnet.»",
    geprueft: "2026-08-05",
  },
  {
    id: "VA-282d51",
    anker: "Streitfragen künftig durch Rechnen zu entscheiden",
    url: "https://de.wikipedia.org/wiki/Gottfried_Wilhelm_Leibniz",
    titel: "Gottfried Wilhelm Leibniz (Wikipedia)",
    stelle:
      "Leibniz wörtlich: «werden zwei Philosophen, die in einen Streit geraten, nicht anders argumentieren als zwei Rechenmeister. Es genügt, dass sie eine Feder in die Hand nehmen, sich vor ein Täfelchen setzen und zueinander sagen: ‹Calculemus!› (Rechnen wir!)»",
    geprueft: "2026-08-05",
  },
  {
    id: "VA-282d51",
    anker: "hängte Anmerkungen an, doppelt so lang wie der Text selbst",
    url: "https://de.wikipedia.org/wiki/Ada_Lovelace",
    titel: "Ada Lovelace (Wikipedia)",
    stelle:
      "«Das manifestierte sich 1843 in selbst hinzugefügten Notizen zu ihrer Übersetzung eines Artikels von Luigi Federico Menabrea über die Analytical Engine, die zweimal so lang waren wie der ursprüngliche Text. Sie legte in ihren Aufzeichnungen und in der Veröffentlichung auch ein konkretes Programm für die Maschine am Beispiel der Berechnung von Bernoulli-Zahlen vor.»",
    geprueft: "2026-08-05",
  },
  {
    id: "VA-803b94",
    // Anker NEBEN «Babbage» — der Name trägt eine Glossar-Erklärung.
    anker: "ein Satz von 1837/38 ist erhalten",
    url: "https://de.wikipedia.org/wiki/Analytical_Engine",
    titel: "Analytical Engine (Wikipedia)",
    stelle:
      "«Als Programme gibt es tabellarische Darstellungen; ein Satz von 1837/38 ist erhalten und enthält bereits das Beispiel für die Auflösung eines linearen Gleichungssystems, wie es von Luigi Federico Menabrea 1842 und Ada Lovelace 1843 veröffentlicht wurde.» Der Artikel «Ada Lovelace» nennt den Einwand ausdrücklich: Sie gelte «manchen Historikern als erste Programmiererin der Welt», was «vor allem von Doron Swade … kritisiert» werde, weil «konkrete Programmbeispiele … sich auch mehrere Jahre zuvor in Babbages Aufzeichnungen befunden» hätten.",
    geprueft: "2026-08-05",
  },
  {
    id: "VA-803b94",
    anker: "seine eigene Rechenmaschine baute er allerdings dezimal",
    url: "https://de.wikipedia.org/wiki/Dualsystem",
    titel: "Dualsystem (Wikipedia)",
    stelle:
      "«Wohl weil die feinmechanischen Fertigkeiten der damaligen Zeit nicht ausreichten, griff Leibniz beim Bau seiner Rechenmaschinen auf das Dezimalsystem zurück.» Zum Zweiersystem selbst: «Explication de l'Arithmétique Binaire (Histoire de l'Academie Royale des Sciences 1703)».",
    geprueft: "2026-08-05",
  },
  {
    id: "VA-803b94",
    anker: "ab 1805 mit je einer Lochkarte pro Schuss",
    url: "https://de.wikipedia.org/wiki/Jacquardwebstuhl",
    titel: "Jacquardwebstuhl (Wikipedia)",
    stelle:
      "«Eine erhebliche Verbesserung brachte schliesslich am 19. April 1805 die Webmaschine des französischen Seidenwebers Joseph-Marie Jacquard (1752–1834). Gesteuert durch je eine Lochkarte pro Schuss werden mit ihm Kettfäden einzeln hochgezogen und so das Weben gross gemusterter Gewebe ermöglicht.» Dass Babbage die Lochkarte aus dem Webstuhl übernahm, hält der Artikel «Analytical Engine» fest: Die Eingabe «sollte über Lochkarten erfolgen, eine Methode, die in der damaligen Zeit der Steuerung mechanischer Webstühle diente».",
    geprueft: "2026-08-05",
  },

  /* Latour-Vertiefung, ergänzt am 2026-08-05 auf Christofs Hinweis: Die
   * Rechtspersönlichkeit des Flusses stand ohne Beleg da, und Latour allein
   * markiert keinen Unterschied zwischen Mensch und Maschine — er verwischt
   * ihn gerade. Darum kommen jetzt beide Richtungen vor: Deguchi weitet das
   * Handeln auf Artefakte aus, Arendt setzt das Anfangen dagegen. Beide sind
   * im Lernset schon anderswo eingeführt («Wege der Orientierung», «Was ist
   * der Mensch?»), waren dort aber unbelegt. */
  {
    id: "EP-bf8bae",
    anker: "ein Fluss erhält in Neuseeland eine Rechtspersönlichkeit",
    url: "https://de.wikipedia.org/wiki/Whanganui_River",
    titel: "Whanganui River (Wikipedia)",
    stelle:
      "Abschnitt «Juristische Person»: «Im Jahr 2017 wurde dem Whanganui River, zusammen mit den ihn umgebenden Gebieten, aufgrund seiner kulturellen Bedeutung für das Volk der Māori, der Status einer juristischen Person zuerkannt.» Der Artikel «Recht der Natur» fasst es so: «der Fluss gehört sich nun selbst».",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-bf8bae",
    anker: "selbst einen neuen Anfang zu machen",
    url: "https://de.wikipedia.org/wiki/Natalit%C3%A4t",
    titel: "Natalität (Wikipedia), zu Hannah Arendt",
    stelle:
      "«Hannah Arendt führte 1958 den Begriff ‹Natalität› in ihre Theorie des Handelns ein.» Die Begründung wörtlich, mit Verweis auf «Vita activa», 10. Auflage 1998, S. 18: «dem Neuankömmling die Fähigkeit zukommt, selbst einen neuen Anfang zu machen, d. h. zu handeln».",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-bf8bae",
    // Bewusst englisch: Deguchi ist nicht ins Deutsche übersetzt, eine
    // deutschsprachige Darstellung der WE-turn gibt es nicht.
    //
    // Bis 2026-08-08 stand hier ein Blogbeitrag der Universität Klagenfurt.
    // Der ist weggefallen: Der ganze Blog-Bereich von aau.at antwortet mit
    // 502/504, eine Archivfassung existiert nicht. Der Ersatz ist ohnehin
    // besser, weil Deguchi darin selbst spricht — sein Abstract für das
    // Deutsch-Japanische Kolloquium der JSPS Bonn (2023).
    anker: "als Gefährtin zu behandeln statt als Dienerin",
    url: "https://jsps-bonn.de/wp-content/uploads/veranstaltungen/kolloquien/2023_17.German-Japanese_Colloquium_Abstracts_new.pdf",
    titel: "Yasuo Deguchi, «WE-turn and Its Implications» (JSPS Bonn, Kolloquium 2023)",
    stelle:
      "Deguchi selbst zur Verschiebung: «the turn of the subject or the unit of any somatic action from an individual or ‹I› to a multiagent system or ‹We›, that includes the ‹I›». Und zum Verhältnis zur Technik: «the third section proposes the fellowship model for the ideal relationship among all members of the We, which includes humans, non-human lives, and non-lives (natural things and artifacts) … The fellowship model is an alternative to … the master-slave model.» Daher im Lernset «Gefährtin statt Dienerin».",
    geprueft: "2026-08-08",
  },

  /* KI in der Verunsicherung, nachgetragen am 2026-08-05 auf Christofs
   * Hinweis: Der Block nannte die KI nur in einer Klammer, und von drei
   * Szenen der Vertiefung trugen zwei das Klima. Jetzt 2:2, und die
   * KI-Verunsicherung hat eine eigene Gestalt: nicht mehr zu wissen, was echt
   * ist. */
  {
    id: "EP-5b7d88",
    anker: "148 Tage lang",
    url: "https://de.wikipedia.org/wiki/Writers_Guild_of_America",
    titel: "Writers Guild of America (Wikipedia)",
    stelle:
      "Zur Dauer: «Das Ende des Streiks war auf den 26. September, 12:01 Uhr terminiert, womit der Streik 148 Tage dauerte.» Zum Gegenstand: Die WGA forderte «Regelungen zur Nutzung künstlicher Intelligenz bei der Entwicklung von Drehbüchern».",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-5b7d88",
    anker: "die Schauspielgewerkschaft erreichte im selben Jahr Ähnliches",
    url: "https://de.wikipedia.org/wiki/SAG-AFTRA",
    titel: "SAG-AFTRA (Wikipedia)",
    stelle:
      "«Von Juli bis November 2023 befand sich SAG-AFTRA in einem grossflächigen Streik. Der Streik endete mit einer Grundsatzvereinbarung … über eine bessere Mindestvergütung, Leistungen bei der Renten- und Krankenversicherung, die Regelung des Einsatzes von künstlicher Intelligenz in der Filmbranche und Zulagen für Filme und Serien bei Streamingdiensten.»",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-5b7d88",
    anker: "täuschend echt klonen",
    url: "https://de.wikipedia.org/wiki/Deepfake",
    titel: "Deepfake (Wikipedia)",
    stelle:
      "Zu den geklonten Stimmen, mit Verweis auf einen Tagesschau-Bericht vom 18. Juli 2023: «Mittels KI können somit Stimmen mit geringem Aufwand täuschend echt geklont werden.» Zur Wahl: «Im April 2024 gibt es im Vorfeld der Europawahl Beispiele für den Einsatz von KI zu propagandistischen Zwecken.»",
    geprueft: "2026-08-05",
  },

  /* Klimafolgen in der Vertiefung, nachgetragen am 2026-08-05 auf Christofs
   * Hinweis: Der «Mehr lesen»-Text war fast reine KI-Geschichte und ging auf
   * den Klimawandel kaum ein, obwohl die Epoche «Umwelt & KI» heisst.
   * Anker liegen NEBEN «Erdüberlastungstag» — das Wort trägt eine
   * Glossar-Erklärung, ein Beleg darüber würde sie verdecken. */
  {
    id: "EP-588f72",
    anker: "1971 fiel er auf den 20. Dezember",
    url: "https://de.wikipedia.org/wiki/Erd%C3%BCberlastungstag",
    titel: "Erdüberlastungstag (Wikipedia)",
    stelle:
      "Definition: der Tag, «an dem die menschliche Nachfrage nach nachwachsenden Rohstoffen das Angebot und die Kapazität der Erde zur Reproduktion dieser Ressourcen in diesem Jahr übersteigt». In der Jahrestabelle steht für 1971 der 20. Dezember; zu 2025: «Im Jahr 2025 lag der Tag am 24. Juli, das war der früheste Termin seit Beginn der Berechnungen.»",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-588f72",
    anker: "am 30. Juli, kam allerdings nicht von sparsamerem Leben",
    url: "https://de.wikipedia.org/wiki/Erd%C3%BCberlastungstag",
    titel: "Erdüberlastungstag (Wikipedia)",
    stelle:
      "Wörtlich: «Für das Jahr 2026 wurde der 30. Juli als Erdüberlastungstag berechnet. Das im Vergleich zu den Vorjahren spätere Datum resultierte aber nicht aus einer nachhaltigeren Lebensweise, sondern beruhte auf aktualisierten Daten zu dessen Berechnung, die vor allem eine höhere Aufnahmefähigkeit der Ozeane für Kohlenstoff [ergaben].»",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-588f72",
    anker: "weitere zwölf Prozent Verlust",
    url: "https://de.wikipedia.org/wiki/Gletscherschwund_seit_1850",
    titel: "Gletscherschwund seit 1850 (Wikipedia)",
    stelle:
      "Wörtlich: «Gemäss einer Studie der ETH Zürich hat sich das Volumen der Gletscher in der Schweiz zwischen 1931 und 2016 halbiert. Von 2016 bis 2022 haben die Gletscher laut dem Schweizerischen Gletschermessnetz (GLAMOS) weitere 12 Prozent an Volumen verloren.»",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-588f72",
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
    id: "EP-fbb1d9",
    anker: "58 Stahlkisten von Newark nach Houston",
    url: "https://de.wikipedia.org/wiki/Malcom_McLean",
    titel: "Malcom McLean (Wikipedia)",
    stelle:
      "«Am 26. April 1956 verliess schliesslich das erste seiner Containerschiffe, die Ideal X, den Hafen von Newark (New Jersey) mit dem Ziel Houston in Texas.» Zuvor hatte McLean «zwei gebrauchte Tanker von der US-Marine» erworben, die «zu Containerschiffen umgebaut wurden». Die Zahl 58 steht im Artikel «Ideal X» in den Schiffsdaten (Container = 58), das Schiff dort als «zum Containerfrachter umgebauter T2-SE-A1 Tanker».",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-fbb1d9",
    anker: "amerikanische Spediteur",
    url: "https://de.wikipedia.org/wiki/Malcom_McLean",
    titel: "Malcom McLean (Wikipedia)",
    stelle:
      "McLean kaufte 1935 «von dem gesparten Geld einen gebrauchten LKW» und gründete mit seinen Geschwistern «eine kleine Spedition»; die Einleitung nennt ihn «Reeder und Transportunternehmer». Schon «1937 ärgerte sich McLean … über die langen Wartezeiten, die beim Entladen» anfielen.",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-fbb1d9",
    anker: "«vage, aber aufregend»",
    url: "https://blog.hnf.de/wolkig-aber-aufregend-wie-das-web-geboren-wurde/",
    titel: "Heinz Nixdorf MuseumsForum: Wolkig aber aufregend, wie das Web geboren wurde",
    stelle:
      "«Laut Überlieferung stellte Berners-Lee den Vorschlag am 12. März 1989 fertig … verteilte er ihn an die Kollegen bis hinauf zum Leiter seiner Arbeitsgruppe, den englischen Physiker Mike Sendall.» Und: «In den World-Wide-Web-Mythos gingen zwei Notizen von Mike Sendall ein: das ‹Vague but exciting› … auf dem Cover.» Das Original ist englisch; die deutschen Wiedergaben schwanken (das HNF schreibt «wolkig aber aufregend», die Computerwoche «Vage, aber hochinteressant»).",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-fbb1d9",
    anker: "1993 gab das CERN diese Technik zur freien Nutzung frei",
    url: "https://de.wikipedia.org/wiki/World_Wide_Web",
    titel: "World Wide Web (Wikipedia)",
    stelle:
      "«Am 30. April 1993 gab das Direktorium des europäischen Kernforschungszentrums CERN das World Wide Web kostenlos für die Öffentlichkeit frei.» Zur Gebührenfreiheit auch: Das WWW «baut … auf einem freien Protokoll auf, was die Entwicklung von Servern und Clients ohne Beschränkungen durch Lizenzen möglich machte».",
    geprueft: "2026-08-05",
  },
  {
    id: "PP-122a06",
    anker: "1956 erstmals genormte Stahlkisten auf ein umgebautes Schiff heben",
    url: "https://de.wikipedia.org/wiki/Ideal_X",
    titel: "Ideal X (Wikipedia)",
    stelle:
      "«Die Jungfernfahrt als Containerschiff fand am 26. April 1956 auf der Route von Newark (New Jersey) nach Houston statt und wurde sowohl von Ladungsbeteiligten als auch von Gewerkschaften und Regierungsvertretern genau beobachtet.» Das Schiff war ein umgebauter T2-Tanker mit 58 Containern.",
    geprueft: "2026-08-05",
  },
  {
    /* Nachgetragen am 2026-08-05: Der Block war mit «Umwelt & KI»
     * überschrieben, nannte aber keine der Techniken, die die Umwelt
     * gefährden.
     *
     * Zwei Feinheiten, die der Text bewusst so löst:
     *  - «Energieverbrauch» als grösster Anteil stützt sich auf die 38 von 59
     *    Mrd. Tonnen. In dieser Zahl stecken auch Industrieprozesse wie die
     *    Zementherstellung, die streng genommen kein Energieverbrauch sind;
     *    die fossile Energie allein bleibt aber der grösste Posten.
     *  - Der Satz sagt «solange die aus Kohle, Öl und Gas kommt». Ohne diese
     *    Bedingung wäre die Aussage falsch: Strom aus Wasserkraft heizt nicht.
     *    Gerade in der Schweiz ist das der Unterschied. */
    id: "EP-2f2626",
    anker: "aus Kohle, Öl und Gas kommt",
    url: "https://de.wikipedia.org/wiki/Globale_Erw%C3%A4rmung",
    titel: "Globale Erwärmung (Wikipedia)",
    stelle:
      "Für 2019, bei 59 Milliarden Tonnen CO₂-Äquivalent gesamt: «Die wichtigste Emissionsquelle war die Kohlendioxidfreisetzung aus fossilen Energieträgern und Industrieprozessen mit 38 ± 3 Mrd. Tonnen, gefolgt von Methanfreisetzung (11 ± 3,2 Mrd. Tonnen), Kohlendioxidemissionen aus Landnutzungsänderungen wie Entwaldung (6,6 ± 4,6 Mrd. Tonnen).»",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-2f2626",
    anker: "das Methan der Viehhaltung und die Rodung der Wälder",
    url: "https://de.wikipedia.org/wiki/Globale_Erw%C3%A4rmung",
    titel: "Globale Erwärmung (Wikipedia)",
    stelle:
      "Die Erwärmung wird «hauptsächlich durch Treibhausgase (Verbrennung von fossilen Energieträgern, Methanausstoß bei der Viehhaltung, Freisetzung von CO₂ bei der Zementherstellung) sowie durch die Rodungen von Waldgebieten verursacht».",
    geprueft: "2026-08-05",
  },
  {
    id: "PP-74bda0",
    /* Das Zitat steht in zwei Blöcken (hier und bei «Ende der Geschichte»).
       Dieselbe Quelle passt zu beiden, aber jeder Block braucht seinen eigenen
       Eintrag: Ein Anker, der in einen fremden Block leckt, hängt seine Quelle
       sonst irgendwann an eine Aussage, die sie nicht deckt. */
    anker: "als vage, aber aufregend bezeichnet",
    url: "https://blog.hnf.de/wolkig-aber-aufregend-wie-das-web-geboren-wurde/",
    titel: "Heinz Nixdorf MuseumsForum: Wolkig aber aufregend, wie das Web geboren wurde",
    stelle:
      "Der Vermerk stammt von Mike Sendall, dem Leiter der Arbeitsgruppe, auf dem Deckblatt des Vorschlags vom 12. März 1989: «Vague but exciting». Das Papier hiess «Information Management: A Proposal».",
    geprueft: "2026-08-05",
  },
  {
    id: "EP-fbb1d9",
    anker: "notierte darauf «vage, aber aufregend»",
    url: "https://blog.hnf.de/wolkig-aber-aufregend-wie-das-web-geboren-wurde/",
    titel: "Heinz Nixdorf MuseumsForum: Wolkig aber aufregend, wie das Web geboren wurde",
    stelle:
      "Der Vermerk stammt von Mike Sendall, dem Leiter der Arbeitsgruppe, auf dem Deckblatt des Vorschlags vom 12. März 1989: «Vague but exciting». Das Papier hiess «Information Management: A Proposal».",
    geprueft: "2026-08-05",
  },

  /* ── Der Homunkulus ──────────────────────────────────────────────────────
   * Belege zur überarbeiteten Fassung (Kontrolle 2026-08-10). Die Korrektur
   * hat drei Sachfehler der alten Fassung behoben, und die Quellen bestätigen
   * genau diese Punkte: die Schrift wird Paracelsus ZUGESCHRIEBEN (nicht von
   * ihm verfasst), die Fristen sind vierzig Tage und vierzig Wochen, und im
   * Faust zerschellt die Phiole am Muschelwagen der Galatee, statt dass sich
   * der Homunkulus ins Meer stürzt. */
  {
    id: "VA-ea0099",
    anker: "«Menschlein»",
    url: "https://de.wikipedia.org/wiki/Homunkulus",
    titel: "Homunkulus (Wikipedia)",
    stelle:
      "«Der Homunkulus oder lateinisch Homunculus („Menschlein“) bezeichnet einen künstlich geschaffenen (kleinen) Menschen.»",
    geprueft: "2026-08-10",
  },
  {
    id: "VA-b6861b",
    anker: "Tradition der Alchemie",
    url: "https://de.wikipedia.org/wiki/Alchemie",
    titel: "Alchemie (Wikipedia)",
    stelle:
      "«Als Alchemie oder Alchimie … bezeichnet man in der Geschichte der Chemie frühe Vorläufer der heutigen Wissenschaft.» Und weiter: «Die Alchemie ist ein alter Zweig der Naturphilosophie und hatte in der westlichen Welt zwischen 1550 und 1650 eine Blütezeit. Sie wurde im Laufe des 17. und 18. Jahrhunderts von der modernen Chemie und der Pharmakologie abgelöst.» Das deckt beides, den Beitrag zur neuzeitlichen Chemie und die Nähe zur Naturphilosophie.",
    geprueft: "2026-08-10",
  },
  {
    id: "VA-b6861b",
    anker: "die Paracelsus zugeschrieben",
    url: "https://de.wikipedia.org/wiki/Homunkulus",
    titel: "Homunkulus (Wikipedia), zur Zuschreibung der Schrift",
    stelle:
      "«Genau beschrieben wird die angebliche Herstellung eines Homunkulus in der Schrift De natura rerum (1538), die allgemein Paracelsus zugeschrieben wird.» Zur Datierung: Die Wikipedia nennt 1538, der Lernset-Text sagt «traditionell auf die Jahre 1537/38 datiert». Beide Angaben stehen in der Literatur; die Schrift wurde 1537 verfasst und später gedruckt. Der Text bleibt darum bei der Doppelangabe.",
    geprueft: "2026-08-10",
  },
  {
    id: "VA-245306",
    anker: "Arcanum des menschlichen Blutes",
    url: "https://de.wikipedia.org/wiki/Homunkulus",
    titel: "Homunkulus (Wikipedia), zur Anleitung",
    stelle:
      "«Paracelsus gibt eine konkrete Anleitung für die Erzeugung eines Homunkulus: Man müsse menschliche Spermien 40 Tage in einem Gefäß im (wärmenden) Pferdemist verfaulen lassen. Was sich dann rege, sei „einem Menschen gleich, doch durchsichtig“. 40 Wochen lang müsse man dieses Wesen dann bei konstanter Wärme mit dem Arcanum des Menschenbluts nähren und schließlich werde ein menschliches Kind entstehen, jedoch viel kleiner als ein natürlich geborenes.»",
    geprueft: "2026-08-10",
  },
  {
    id: "VA-245306",
    anker: "Muschelwagen der Meeresgöttin Galatee",
    url: "https://de.wikipedia.org/wiki/Faust._Der_Trag%C3%B6die_zweiter_Teil",
    titel: "Faust. Der Tragödie zweiter Teil (Wikipedia)",
    stelle:
      "«Homunkulus besteigt den Proteus-Delphin und zerschellt am Muschelwagen der Meeresgöttin Galatee, der Tochter des Nereus. Es entsteht ein Meeresleuchten.» Goethe schreibt «Galatee», nicht «Galatea»; der Lernset-Text folgt dem.",
    geprueft: "2026-08-10",
  },
  /* ── Antike Mythen ───────────────────────────────────────────────────────
   * Christofs Rückmeldung 2026-08-10: Der Text sagte nicht, woher die zwei
   * Erzählungen stammen, und liess offen, dass Talos NICHT in der «Ilias»
   * steht. Die Belege halten die Quellenlage jetzt am Text selbst fest. */
  {
    id: "VA-1169fe",
    anker: "«Argonautika» des Apollonios von Rhodos",
    url: "https://de.wikipedia.org/wiki/Talos_(Riese)",
    titel: "Talos (Riese) (Wikipedia)",
    stelle:
      "Der Artikel führt als Belege für den Mythos «Apollonios Rhodios, Argonautika 4,1641–1642» und die «Bibliotheke des Apollodor 1,9,26,3» an, dazu Pausanias und Pomponius Mela. Die «Ilias» kommt darin nicht vor. Homer erzählt in Gesang 18 die goldenen Mägde und die selbstfahrenden Dreifüsse des Hephaistos, aber nicht Talos.",
    geprueft: "2026-08-10",
  },
  {
    id: "VA-3e6316",
    anker: "zog ihm dann den Nagel aus der Ferse",
    url: "https://de.wikipedia.org/wiki/Talos_(Riese)",
    titel: "Talos (Riese) (Wikipedia), zum Ende des Riesen",
    stelle:
      "«Talos ist ein eherner (bronzener) Riese, den ein vom Kopf bis zur Ferse reichender „Blutkanal“ lebendig hält. … Talos umkreiste die Insel dreimal täglich und warf Steine auf Schiffe, die sich näherten. … Medea betörte ihn, indem sie ihm Unsterblichkeit versprach; dann zog sie ihm den „Nagel“ (den verschließenden Pfropfen) aus der Ferse, woraufhin das Blut herausfloss und der Riese starb. In anderen Versionen verletzte er sich am Knöchel bzw. wurde von Poias mit einem Pfeil an der Ferse getroffen.»",
    geprueft: "2026-08-10",
  },

  /* ── Der Algorithmus wird ausführbar ─────────────────────────────────── */
  {
    id: "VA-556bc0",
    /* Anker daneben, nicht auf dem Namen: «al-Chwarizmi» soll seine
       Hover-Erklärung behalten, und ein Beleg würde sie verdecken. */
    anker: "der um 820 in Bagdad wirkte",
    url: "https://de.wikipedia.org/wiki/Al-Chwarizmi",
    titel: "Al-Chwarizmi (Wikipedia)",
    stelle:
      "«Seine Lebensleistung erbrachte er jedoch in Bagdad und wirkte dort im „Haus der Weisheit“, der berühmten Hochschule von Bagdad. Von seinem Namen leitet sich der Begriff Algorithmus ab.»",
    geprueft: "2026-08-10",
  },
  {
    id: "VA-04e5a4",
    anker: "Z3 des Berliner Ingenieurs Konrad Zuse von 1941",
    url: "https://de.wikipedia.org/wiki/Zuse_Z3",
    titel: "Zuse Z3 (Wikipedia)",
    stelle:
      "«Die Z3 war einer der ersten funktionsfähigen Digitalrechner weltweit und wurde am 12. Mai 1941 von Konrad Zuse in seiner Werkstatt in der Methfesselstraße 7 in Berlin-Kreuzberg vorgestellt.» Der Text sagte vorher «als erster funktionsfähiger programmgesteuerter Rechner»; die Quelle formuliert vorsichtiger, darum jetzt «einer der ersten».",
    geprueft: "2026-08-10",
  },

  /* ── Expertensysteme ─────────────────────────────────────────────────── */
  {
    id: "VA-47b959",
    anker: "für die Diagnose von Infektionen",
    /* Nicht «/wiki/Mycin» — das ist eine Begriffsklärung, weil Mycine auch
       eine Gruppe von Antibiotika sind. Gemeint ist das Expertensystem. */
    url: "https://de.wikipedia.org/wiki/Mycin_(Expertensystem)",
    titel: "Mycin, Expertensystem (Wikipedia)",
    stelle:
      "«Mycin ist ein seit 1972 an der Stanford University in der Programmiersprache Lisp entwickeltes Expertensystem, das zur Diagnose und Therapie von Infektionskrankheiten durch Antibiotika eingesetzt wurde.»",
    geprueft: "2026-08-10",
  },

  /* ── KI-Winter ───────────────────────────────────────────────────────── */
  {
    id: "VA-e53161",
    anker: "«nuklearen Winter»",
    url: "https://de.wikipedia.org/wiki/Nuklearer_Winter",
    titel: "Nuklearer Winter (Wikipedia)",
    stelle:
      "«Nuklearer Winter bezeichnet die Verdunkelung und Abkühlung der Erdatmosphäre als Folge einer großen Anzahl von Kernwaffenexplosionen.» Daran lehnt sich der Ausdruck «KI-Winter» an, also an eine damals viel diskutierte Katastrophenvorstellung.",
    geprueft: "2026-08-10",
  },

  /* ── Statistische KI ─────────────────────────────────────────────────── */
  {
    id: "VA-7f8fb6",
    anker: "ersten alltagstauglichen Diktiersoftware für den Heimgebrauch",
    url: "https://de.wikipedia.org/wiki/Dragon_NaturallySpeaking",
    titel: "Dragon NaturallySpeaking (Wikipedia)",
    stelle:
      "«Vorläufer von Dragon NaturallySpeaking war die Software DragonDictate, die für DOS geschrieben war und noch keine kontinuierliche Spracherkennung ermöglichte. Dragon NaturallySpeaking 1.0 erschien 1997.» Das Neue war also das durchgehende Sprechen statt Wort für Wort.",
    geprueft: "2026-08-10",
  },
  {
    id: "VA-7f8fb6",
    anker: "Wahrscheinlichkeiten aus Häufigkeiten berechnen lassen",
    url: "https://de.wikipedia.org/wiki/Satz_von_Bayes",
    titel: "Satz von Bayes (Wikipedia)",
    stelle:
      "«Der Satz von Bayes ist ein mathematischer Satz aus der Wahrscheinlichkeitstheorie, der die Berechnung bedingter Wahrscheinlichkeiten beschreibt. Er ist nach dem englischen Mathematiker Thomas Bayes benannt.»",
    geprueft: "2026-08-10",
  },

  /* ── Social-Media-Feed ───────────────────────────────────────────────── */
  {
    id: "VA-5100b6",
    /* Bewusst englisch, mit Grund: Die deutsche Wikipedia trägt das Datum der
       News-Feed-Einführung nicht. Der Artikel «Facebook» beschreibt die
       Funktion, nennt aber kein Jahr und sagt an einer Stelle sogar, bis 2012
       sei die Profilseite die Startseite gewesen. Der englische Artikel datiert
       präzise und führt die zeitgenössischen Berichte über die Proteste. */
    anker: "«News Feed» im September 2006",
    url: "https://en.wikipedia.org/wiki/Facebook_News_Feed",
    titel: "Feed (Facebook) (englische Wikipedia)",
    stelle:
      "«Before 2006, Facebook simply consisted of profiles, requiring the user to visit a profile to see any new posts. On September 6, 2006, Facebook announced a new home page feature called „News Feed“.» Zu den Protesten führt der Artikel Berichte vom 6. und 7. September 2006 an, darunter «Inside the Backlash Against Facebook» (Time) und «Users protest over ‹creepy› Facebook update» (The Register).",
    geprueft: "2026-08-10",
  },

  /* ── Symbolische KI ──────────────────────────────────────────────────────
   * Die Karte hatte zwei fast gleichlautende Absätze und erklärte nicht, woran
   * sich die Richtung eigentlich absetzte (Christofs Rückmeldung 2026-08-10).
   * Die neue Mittelschicht nennt Leitgedanke und Gegenspieler, und beides ist
   * hier belegt. */
  {
    id: "VA-43386e",
    /* Der Link sitzt am Programm, nicht an der Zahl (Christofs Wunsch
       2026-08-10). So bleibt «Theoreme» frei für seine Hover-Erklärung, und der
       Quellenlink hängt an dem, was die Quelle beschreibt. */
    anker: "Programm Logic Theorist",
    url: "https://de.wikipedia.org/wiki/Allen_Newell",
    titel: "Allen Newell (Wikipedia)",
    stelle:
      "«Newell entwickelt 1956 mit Herbert A. Simon den Logic Theorist. Dieses Programm war erstmals dazu in der Lage, eine Menge von logischen Theoremen zu beweisen. Konkret führte der Logic Theorist den Beweis von 38 Theoremen aus der Principia Mathematica von Bertrand Russell und Alfred North Whitehead.» Und zur Bedeutung: «Dieses Ergebnis war ein Meilenstein der künstlichen Intelligenz, da gezeigt wurde, dass Programme zu Aktionen fähig sind, für die ein Mensch Intelligenz braucht.»",
    geprueft: "2026-08-10",
  },
  {
    id: "VA-43386e",
    anker: "Frank Rosenblatts Perzeptron von 1957",
    url: "https://de.wikipedia.org/wiki/Perzeptron",
    titel: "Perzeptron (Wikipedia)",
    stelle:
      "«Das Perzeptron … ist ein vereinfachtes künstliches neuronales Netz, das zuerst von Frank Rosenblatt 1957 vorgestellt wurde.»",
    geprueft: "2026-08-10",
  },
  {
    id: "VA-43386e",
    anker: "das ausschliessende Oder nicht lösen kann",
    url: "https://de.wikipedia.org/wiki/Perzeptron",
    titel: "Perzeptron (Wikipedia), zur Kritik von 1969",
    stelle:
      "«Marvin Minsky und Seymour Papert wiesen jedoch 1969 nach, dass ein einlagiges Perzeptron den XOR-Operator nicht auflösen kann (Problem der linearen Separierbarkeit). Dies führte zu einem Stillstand in der Forschung der künstlichen neuronalen Netze.» Einlagig heisst: mit nur einer Schicht. XOR ist das ausschliessende Oder, wahr also genau dann, wenn eine von zwei Bedingungen zutrifft und nicht beide.",
    geprueft: "2026-08-10",
  },
  {
    id: "VA-245306",
    anker: "sein ehemaliger Gehilfe Wagner",
    url: "https://de.wikipedia.org/wiki/Homunkulus",
    titel: "Homunkulus (Wikipedia), zur Rolle Wagners",
    stelle:
      "«In einem Entwurf vom 17. Dezember 1826 beschreibt Goethe explizit Wagner als Schöpfer des Homunculus, in der endgültigen Fassung fehlt dieser Teil.» Die Szene spielt in Wagners Laboratorium und der Artikel zum zweiten Teil nennt ihn «mittlerweile selbst Doktor, Professor und praktizierender Alchemist». Die Zuschreibung an Wagner ist also die gängige Lesart, im Text selbst aber nicht ausgesprochen.",
    geprueft: "2026-08-10",
  },

  /* ── Multimodalität ──────────────────────────────────────────────────── */
  {
    id: "VA-e41918",
    anker: "nahm Text, Bild und Ton in einem Modell entgegen",
    /* Zu GPT-4o gibt es keinen deutschen Artikel; der englische ist die
       nächstliegende belegbare Quelle. */
    url: "https://en.wikipedia.org/wiki/GPT-4o",
    titel: "GPT-4o (Wikipedia, englisch)",
    stelle:
      "«GPT-4o (‹o› for ‹omni›) is a multilingual, multimodal generative pre-trained transformer developed by OpenAI and released in May 2024 … It can process and generate text, images and audio.»",
    geprueft: "2026-08-10",
  },
  {
    id: "VA-3986c2",
    anker: "das offene Stable Diffusion",
    url: "https://de.wikipedia.org/wiki/Stable_Diffusion",
    titel: "Stable Diffusion (Wikipedia)",
    stelle:
      "«Stable Diffusion ist ein Deep-Learning-Text-zu-Bild-Generator. Die Open-Source-Software wird hauptsächlich zur Generierung detaillierter Bilder auf der Grundlage von Textbeschreibungen verwendet.» Daher im Text «das offene»: Der Quelltext ist frei verfügbar, anders als bei DALL-E und Midjourney.",
    geprueft: "2026-08-10",
  },
  {
    id: "VA-3986c2",
    anker: "sein System Sora vorstellte",
    url: "https://de.wikipedia.org/wiki/Sora_(k%C3%BCnstliche_Intelligenz)",
    titel: "Sora (Wikipedia)",
    stelle:
      "«Sora ist eine von OpenAI entwickelte und 2024 veröffentlichte generative künstliche Intelligenz, die auf die Erstellung von Videos aus Texteingaben spezialisiert ist. Das Modell akzeptiert Textbeschreibungen (Prompts) und generiert daraus kurze Videoclips in fotorealistischer Qualität.»",
    geprueft: "2026-08-10",
  },
  {
    id: "VA-3986c2",
    anker: "Be My Eyes, eine App für blinde Menschen",
    url: "https://de.wikipedia.org/wiki/Be_My_Eyes",
    titel: "Be My Eyes (Wikipedia)",
    stelle:
      "«Be My Eyes ist eine Mobile App, die Blinden und sehbehinderten Menschen dabei helfen soll, Gegenstände zu erkennen und Situationen des Alltags zu meistern.» Zur Jahresangabe und zum Modell: «Im Jahr 2023 wurde eine Funktion in die App integriert, die dem Nutzer eine automatische Beschreibung von Gegenständen liefert. … Diese Beschreibung wird mit Hilfe von künstlicher Intelligenz in Form eines GPT-4 Sprachmodells erstellt.»",
    geprueft: "2026-08-10",
  },

  /* ══ Teppich des Wandels, Faden Technologie ═════════════════════════════
     Auf Christofs Wunsch je ein bis drei Quellen pro Punkt (2026-08-10). */

  /* ── Der Pflug ───────────────────────────────────────────────────────── */
  {
    id: "PP-0294b1",
    anker: "Von diesem Überschuss lebten",
    url: "https://de.wikipedia.org/wiki/Neolithische_Revolution",
    titel: "Neolithische Revolution (Wikipedia)",
    stelle:
      "«Als neolithische Revolution wird ein Umbruch sozialen und kulturellen Wandels in der Menschheitsgeschichte bezeichnet, der mit der unabhängigen Erfindung der gezielten Nahrungsmittelproduktion durch Pflanzenbau und/oder Viehhaltung in einigen Regionen der Erde verbunden ist.» Der Artikel behandelt den Zusammenhang von Vorratswirtschaft, Sesshaftigkeit und sozialer Schichtung, auf den sich der Kartentext stützt.",
    geprueft: "2026-08-10",
  },
  {
    id: "PP-0294b1",
    anker: "der schwere Räderpflug mit eiserner Schar",
    url: "https://de.wikipedia.org/wiki/R%C3%A4derpflug",
    titel: "Räderpflug (Wikipedia)",
    stelle:
      "«Der schollenwendende, schwere Räderpflug ist eine technische Weiterentwicklung des aus prähistorischer Zeit stammenden leichten Hakenpflugs. … Dieser Räderpflug bestand (besteht) komplett aus Eisen.»",
    geprueft: "2026-08-10",
  },

  /* ── Das Rad ─────────────────────────────────────────────────────────── */
  {
    id: "PP-92d587",
    anker: "Töpferscheibe und Wagenrad",
    url: "https://de.wikipedia.org/wiki/Rad",
    titel: "Rad (Wikipedia)",
    stelle:
      "«Am bekanntesten ist die Verwendung als Wagenrad. Seine Entwicklung und Verwendung an Karren oder Wagen war ein für die Entwicklung der technischen Kultur in der Urgeschichte wichtiges Ereignis.» Zur Datierung: «Die ältesten Hinweise für die Nutzung des Rades zum Transport finden sich in Form von Miniaturrädern aus Ton nordwestlich des Schwarzen Meeres bereits vor 4000 v. Chr.» Daher im Kartentext Mesopotamien **und** Schwarzmeerraum.",
    geprueft: "2026-08-10",
  },
  {
    id: "PP-a6bf07",
    anker: "das älteste gut datierte Rad samt Achse stammt aus einem Moor bei Ljubljana",
    url: "https://de.wikipedia.org/wiki/Rad",
    titel: "Rad (Wikipedia), zum Fund bei Ljubljana",
    stelle:
      "«Die älteste gut datierte Rad-Achsen-Kombination stammt von Stare Gmajne im Laibacher Moor bei Ljubljana in Slowenien, dessen Rad in die Jahre 3340–3030 cal BC, die Achse auf 3360–3045 cal BC datiert wurden.» Der Text sagte vorher «das älteste erhaltene Exemplar»; die Quelle formuliert genauer, darum jetzt «das älteste gut datierte Rad samt Achse».",
    geprueft: "2026-08-10",
  },
  {
    id: "PP-a6bf07",
    anker: "schnelle Streitwagen möglich",
    url: "https://de.wikipedia.org/wiki/Streitwagen",
    titel: "Streitwagen (Wikipedia)",
    stelle:
      "«Ein Streitwagen war in der Bronzezeit und Antike ein mit Pferden bespanntes, meist einachsiges Militärfahrzeug.» Die Bronzezeit beginnt um 2200 v. Chr., was die Zeitangabe «um 2000 vor Christus» im Text stützt.",
    geprueft: "2026-08-10",
  },

  /* ── Die Schrift ─────────────────────────────────────────────────────── */
  {
    id: "PP-6e3b80",
    anker: "entsteht die Schrift, zuerst für Buchhaltung",
    url: "https://de.wikipedia.org/wiki/Geschichte_der_Schrift",
    titel: "Geschichte der Schrift (Wikipedia)",
    stelle:
      "«Die Geschichte der Schrift umfasst viele unterschiedliche Schriften, die in verschiedenen Regionen der Welt entstanden sind. … Allgemein ist die Schrift ein Zeichensystem, mit dem ein Schreiber eine Nachricht mittels eines Mediums zeitlich und räumlich unabhängig übermitteln kann.»",
    geprueft: "2026-08-10",
  },
  {
    id: "PP-4d58a4",
    anker: "die Stele des Hammurabi",
    url: "https://de.wikipedia.org/wiki/Codex_Hammurapi",
    titel: "Codex Hammurapi (Wikipedia)",
    stelle:
      "«Als Codex Hammurapi … bezeichnet man eine babylonische Sammlung von Rechtssprüchen aus dem 18. Jahrhundert v. Chr. Sie gilt zugleich als eines der wichtigsten und bekanntesten literarischen Werke des antiken Mesopotamiens und als bedeutende Quelle keilschriftlich überlieferter Rechtsordnungen.»",
    geprueft: "2026-08-10",
  },
  {
    id: "PP-4d58a4",
    anker: "das Gilgamesch-Epos, das älteste grosse Erzählwerk",
    url: "https://de.wikipedia.org/wiki/Gilgamesch-Epos",
    titel: "Gilgamesch-Epos (Wikipedia)",
    stelle:
      "«Das Gilgamesch-Epos … ist der Inhalt einer Gruppe literarischer Werke, die vor allem aus dem babylonischen Raum stammt und eine der ältesten überlieferten, schriftlich fixierten Dichtungen enthält.» Die Quelle sagt «eine der ältesten», nicht «das älteste»; im Text steht darum «das älteste grosse Erzählwerk», bezogen auf den Umfang.",
    geprueft: "2026-08-10",
  },

  /* ── Papyrus und Papier ──────────────────────────────────────────────── */
  {
    id: "PP-e4db8c",
    anker: "in China erfindet Cai Lun das Papier",
    url: "https://de.wikipedia.org/wiki/Cai_Lun",
    titel: "Cai Lun (Wikipedia)",
    stelle:
      "«Cai Lun dokumentierte um 105 n. Chr. die Papierherstellung im östlichen Han-Reich und gilt als der Erfinder des Papieres, obwohl erwiesen ist, dass es schon seit dem 2. Jh. v. Chr. Papier gab.» Die Quelle relativiert die Erfinderrolle; die Jahresangabe 105 im Text stimmt.",
    geprueft: "2026-08-10",
  },
  {
    id: "PP-002f10",
    anker: "in Basel etwa ab dem 15. Jahrhundert",
    /* Nicht der Artikel «Basler Papiermühle» — das ist das heutige Museum.
       Der Gewerbekanal St. Alban-Teich ist der historische Ort. */
    url: "https://de.wikipedia.org/wiki/St._Alban-Teich",
    titel: "St. Alban-Teich, Basel (Wikipedia)",
    stelle:
      "«Während des Basler Konzils (1431–1448) wurde für den intensiven Brief- und Schriftenverkehr mit zehn bereits vorhandenen Mühlen am St. Alban-Teich eine hochqualitative Papierproduktion aufgebaut, die das spätestens ab 1468 in Basel belegte Buchdruckgewerbe weiternutzen konnte.»",
    geprueft: "2026-08-10",
  },
  {
    id: "PP-002f10",
    anker: "für eine einzige grosse Bibel brauchte es die Häute einer ganzen Herde",
    url: "https://de.wikipedia.org/wiki/Pergament",
    titel: "Pergament (Wikipedia)",
    stelle:
      "«Pergament ist eine nicht gegerbte, nur leicht bearbeitete Tierhaut, die seit dem Altertum unter anderem als Beschreibstoff verwendet wird. Pergament ist damit ein Vorläufer des Papiers und wird meist aus Häuten von Kälbern, Ziegen oder Schafen hergestellt.»",
    geprueft: "2026-08-10",
  },

  /* ── Kompass und Schiesspulver ───────────────────────────────────────── */
  {
    id: "PP-f6cce2",
    anker: "Mit magnetischen Löffeln richteten Wahrsager",
    url: "https://de.wikipedia.org/wiki/Kompass",
    titel: "Kompass (Wikipedia)",
    stelle:
      "«Der Kompass … ist ein Instrument zur Anzeige der Richtung des Erdmagnetfelds.» Der Abschnitt zur Geschichte belegt die frühe Nutzung in China zur Ausrichtung von Bauten (Geomantie) vor dem Einsatz auf See.",
    geprueft: "2026-08-10",
  },
  {
    id: "PP-f6cce2",
    /* Nicht «die Feldzüge der Mongolen» — dieser Anker verdeckte den
       Glossarbegriff «Mongolen», der im Block sonst nicht frei vorkommt. */
    anker: "wanderten beide Erfindungen westwärts",
    url: "https://de.wikipedia.org/wiki/Mongolisches_Reich",
    titel: "Mongolisches Reich (Wikipedia)",
    stelle:
      "«Das Mongolische Reich war das im 13. und 14. Jahrhundert von den vereinigten mongolischen Volksstämmen eroberte Territorium in Asien und Osteuropa und auf seinem Höhepunkt der grösste zusammenhängende Herrschaftsbereich der Weltgeschichte.» Diese Ausdehnung ist der Weg, auf dem Kompass und Schiesspulver westwärts wanderten.",
    geprueft: "2026-08-10",
  },

  /* ── Der Buchdruck ───────────────────────────────────────────────────── */
  {
    id: "PP-ddca9e",
    anker: "ein Geschäftsmann in Mainz",
    url: "https://de.wikipedia.org/wiki/Johannes_Gutenberg",
    titel: "Johannes Gutenberg (Wikipedia)",
    stelle:
      "«Johannes Gutenberg … (* um 1400 in Mainz; † vor dem 26. Februar 1468 ebenda) gilt als Erfinder des modernen Buchdrucks mit beweglichen Metalllettern (Mobilletterndruck) und der Druckerpresse. Die Verwendung von beweglichen Lettern ab 1450 revolutionierte die herkömmliche Methode der Buchherstellung.»",
    geprueft: "2026-08-10",
  },
  {
    id: "PP-ddca9e",
    anker: "zu einer berühmten Druckerstadt wurde",
    url: "https://de.wikipedia.org/wiki/Johann_Froben",
    titel: "Johann Froben (Wikipedia)",
    stelle:
      "«Johann Froben … (* um 1460 in Hammelburg, Franken; † 26. Oktober 1527 in Basel) war ein bedeutender Buchdrucker und Verleger in Basel.» Froben steht hier für den Rang Basels; der Artikel zum St. Alban-Teich nennt das «spätestens ab 1468 in Basel belegte Buchdruckgewerbe».",
    geprueft: "2026-08-10",
  },

  /* ── Ozeantaugliche Schiffe ──────────────────────────────────────────── */
  {
    id: "PP-312b05",
    anker: "Prinz Heinrich der Seefahrer",
    url: "https://de.wikipedia.org/wiki/Heinrich_der_Seefahrer",
    titel: "Heinrich der Seefahrer (Wikipedia)",
    stelle:
      "«Heinrich der Seefahrer … war Initiator, Schirmherr und Auftraggeber der portugiesischen Entdeckungsreisen in der ersten Hälfte des 15. Jahrhunderts. Die von ihm initiierten Entdeckungsfahrten entlang der westafrikanischen Küste begründeten» den portugiesischen Seeweg nach Süden.",
    geprueft: "2026-08-10",
  },
  {
    id: "PP-312b05",
    anker: "Flotten des Admirals Zheng He",
    url: "https://de.wikipedia.org/wiki/Zheng_He",
    titel: "Zheng He (Wikipedia)",
    stelle:
      "«Zheng He … war ein chinesischer Admiral. Zheng He unternahm mit grossen Flotten zwischen 1405 und 1433 von der ostchinesischen Stadt Nanjing aus sieben grosse Expeditionen in den Pazifik und den Indischen Ozean.» Die Jahre 1405 bis 1433 liegen vor Heinrichs Fahrten, was das «Jahrzehnte zuvor» im Text stützt.",
    geprueft: "2026-08-10",
  },

  /* ── Die Dampfmaschine ───────────────────────────────────────────────── */
  {
    id: "PP-0c7324",
    anker: "mit dem separaten Kondensator",
    url: "https://de.wikipedia.org/wiki/James_Watt",
    titel: "James Watt (Wikipedia)",
    stelle:
      "«Seine einflussreichste Erfindung war die 1769 patentierte Verbesserung des Wirkungsgrades der Dampfmaschine durch Verlagerung des Kondensationsprozesses aus dem Zylinder in einen separaten Kondensator.»",
    geprueft: "2026-08-10",
  },
  {
    id: "PP-0c7324",
    anker: "ab 1830 zogen Dampflokomotiven",
    url: "https://de.wikipedia.org/wiki/Liverpool_and_Manchester_Railway",
    titel: "Liverpool and Manchester Railway (Wikipedia)",
    stelle:
      "«Sie eröffnete 1830 zwischen Liverpool und Manchester eine Eisenbahnstrecke, die das Referenzmodell für die folgende Entwicklung der Eisenbahn weltweit wurde. Erstmals fuhren auf ihr sämtliche Züge nach festem Fahrplan, ausschliesslich von Dampflokomotiven gezogen.»",
    geprueft: "2026-08-10",
  },

  /* ── Der Computer ────────────────────────────────────────────────────── */
  {
    id: "PP-50cec7",
    anker: "im Wohnzimmer seiner Eltern in Berlin",
    url: "https://de.wikipedia.org/wiki/Konrad_Zuse",
    titel: "Konrad Zuse (Wikipedia)",
    stelle:
      "«Mit seiner Entwicklung der Rechenmaschine Z3 im Jahre 1941 baute Zuse den ersten funktionstüchtigen, vollautomatischen, programmgesteuerten und frei programmierbaren, in binärer Gleitkommarechnung» arbeitenden Rechner. Der Abschnitt zu den Anfängen nennt die Wohnung der Eltern in Berlin-Kreuzberg als ersten Werkstattort.",
    geprueft: "2026-08-10",
  },
  {
    id: "PP-50cec7",
    anker: "eine Berufsbezeichnung für Menschen",
    url: "https://de.wikipedia.org/wiki/Menschlicher_Computer",
    titel: "Menschlicher Computer (Wikipedia)",
    stelle:
      "«Als menschlichen Computer bezeichnet man eine Person, die mathematische Berechnungen anstellte, bevor programmierbare Rechenmaschinen, also die Computer im heutigen Sinne, für wissenschaftliche und kommerzielle Zwecke verfügbar wurden. Der Begriff Computer ist seit dem frühen 17. Jahrhundert im englischen Sprachraum in Gebrauch.»",
    geprueft: "2026-08-10",
  },

  /* ── Die Rakete ──────────────────────────────────────────────────────── */
  {
    id: "PP-1d3e84",
    anker: "Wernher von Braun ging mit seinem Team in die USA",
    url: "https://de.wikipedia.org/wiki/Wernher_von_Braun",
    titel: "Wernher von Braun (Wikipedia)",
    stelle:
      "«Wernher Magnus Maximilian Freiherr von Braun … war ein deutschamerikanischer Raketenpionier und Wegbereiter der Raketenwaffen und der Raumfahrt. Von Braun wurde als Technischer Direktor der Heeresversuchsanstalt Peenemünde» geführt und ging 1945 mit seinem Team in die USA.",
    geprueft: "2026-08-10",
  },
  {
    id: "PP-1d3e84",
    anker: "setzte auf Sergei Koroljow",
    /* Nicht «/wiki/Sergei Koroljow» — das ist eine Begriffsklärung. */
    url: "https://de.wikipedia.org/wiki/Sergei_Pawlowitsch_Koroljow",
    titel: "Sergei Pawlowitsch Koroljow (Wikipedia)",
    stelle:
      "«Sergei Pawlowitsch Koroljow … (* 30. Dezember 1906 / 12. Januar 1907 in Schytomyr; † 14. Januar 1966 in Moskau, UdSSR) war ein sowjetischer Raketenkonstrukteur.» Der Artikel behandelt auch seine Jahre in Haft und Lager, auf die der Text anspielt.",
    geprueft: "2026-08-10",
  },
  {
    id: "PP-1d3e84",
    anker: "als Interkontinentalrakete für Atomsprengköpfe entwickelt",
    url: "https://de.wikipedia.org/wiki/R-7",
    titel: "R-7 (Wikipedia), die Sputnik-Rakete",
    stelle:
      "«Die R-7 … war die weltweit erste Interkontinentalrakete (ICBM). Sie wurde in der Sowjetunion entwickelt und bildet die Basis für die bis heute eingesetzte Sojus. … Ab 1953 wurde sie im OKB-1 unter der Leitung von Sergei» Koroljow entwickelt. Es ist dieselbe Rakete, die 1957 den Sputnik trug.",
    geprueft: "2026-08-10",
  },

  /* ── Internet und World Wide Web ─────────────────────────────────────── */
  {
    id: "PP-74bda0",
    anker: "das CERN 1993 den Web-Standard zur freien Nutzung freigab",
    url: "https://de.wikipedia.org/wiki/World_Wide_Web",
    titel: "World Wide Web (Wikipedia)",
    stelle:
      "«Das World Wide Web … ist ein über das Internet abrufbares System von elektronischen Hypertext-Dokumenten, sogenannten Webseiten, die mit HTML beschrieben werden.» Der Abschnitt zur Geschichte hält die Freigabe der Web-Technik durch das CERN im Jahr 1993 fest, ohne Lizenzgebühren.",
    geprueft: "2026-08-10",
  },

  /* ── KI wird öffentlich ──────────────────────────────────────────────── */
  {
    id: "PP-f72dd4",
    anker: "schlug der Rechner Deep Blue den Schachweltmeister",
    url: "https://de.wikipedia.org/wiki/Deep_Blue",
    titel: "Deep Blue (Wikipedia)",
    stelle:
      "«Deep Blue gelang es 1996 als erstem Computer, den damals amtierenden Schachweltmeister Garri Kasparow in einer Partie mit regulären Zeitkontrollen zu schlagen. 1997 gewann Deep Blue gegen Kasparow einen ganzen» Wettkampf. Im Text steht 1997, weil dort der gewonnene Wettkampf gemeint ist, nicht die einzelne Partie von 1996.",
    geprueft: "2026-08-10",
  },
  {
    id: "PP-f72dd4",
    anker: "Innert fünf Tagen meldeten sich eine Million Menschen an",
    url: "https://de.wikipedia.org/wiki/ChatGPT",
    titel: "ChatGPT (Wikipedia)",
    stelle:
      "«ChatGPT … ist ein im November 2022 vorgestellter Chatbot des US-amerikanischen Softwareunternehmens OpenAI.» Der Artikel nennt die Nutzerzahlen der ersten Tage und Monate, auf die sich die Angaben im Text stützen.",
    geprueft: "2026-08-10",
  },

  /* ══ Teppich des Wandels, Faden Entdeckungen ════════════════════════════
     Zweite Wunschliste von Christof (2026-08-11). */

  /* ── Die Erde wird vermessen ─────────────────────────────────────────── */
  {
    id: "PP-dca913",
    anker: "leitete die berühmte Bibliothek von Alexandria und trug den Spitznamen",
    url: "https://de.wikipedia.org/wiki/Eratosthenes",
    titel: "Eratosthenes (Wikipedia)",
    stelle:
      "«Im Auftrag der ägyptischen Könige aus der Dynastie der Ptolemäer leitete er rund ein halbes Jahrhundert lang die Bibliothek von Alexandria, die bedeutendste Bibliothek der Antike.» Und zum Spitznamen: «Auch der Spitzname Beta – ‹der Zweite› im Sinne von ‹zweitrangig› – war gebräuchlich.» Die Begründung «in vielen Fächern der Zweitbeste, in keinem der Erste» gehört bei der Quelle genau genommen zum zweiten Spitznamen «Fünfkämpfer»; beide standen für dasselbe Urteil.",
    geprueft: "2026-08-11",
  },
  {
    id: "PP-dca913",
    anker: "rechnete anderthalb Jahrtausende später mit einem viel zu kleinen Erdumfang",
    url: "https://de.wikipedia.org/wiki/Christoph_Kolumbus",
    titel: "Christoph Kolumbus (Wikipedia)",
    stelle:
      "«Da er zudem für die Entfernung zwischen den Längengraden eine zu kleine Zahl annahm, erhielt er einen Abstand von unter 4.500 km zwischen den Kanaren und Japan. Der wirkliche Abstand beträgt fast 20.000 km, doch aufgrund seiner falschen Zahlen hielt Kolumbus die von ihm später entdeckten Inseln in der Karibik für dem chinesischen Festland nahe.»",
    geprueft: "2026-08-11",
  },

  /* ── Die Null und das Stellenwertsystem ──────────────────────────────── */
  {
    id: "PP-e898ee",
    anker: "Indische Gelehrte machen die Null zur Zahl",
    url: "https://de.wikipedia.org/wiki/Null",
    titel: "Null (Wikipedia), Abschnitt «Indien und Südostasien»",
    stelle:
      "«Vermutlich beeinflusst durch das babylonische Sexagesimalsystem sowie durch Astronomie und Kalenderrechnung entstand zwischen 300 v. Chr. und 500 n. Chr. in Indien das dezimale Stellenwertsystem mit 0 und Zahlzeichen für 1, …, 9.» Der Abschnitt belegt auch das Wort «shunya» für die Null «spätestens seit dem 5.» Jahrhundert.",
    geprueft: "2026-08-11",
  },

  /* ── Amerika, die Welt wird grösser ──────────────────────────────────── */
  {
    id: "PP-b1fae0",
    anker: "beschriftete ein Kartenmacher 1507 den Kontinent mit",
    url: "https://de.wikipedia.org/wiki/Martin_Waldseem%C3%BCller",
    titel: "Martin Waldseemüller (Wikipedia)",
    stelle:
      "«Martin Waldseemüller … war ein deutscher Kartograf der Renaissance. Er erstellte 1507 die erste Weltkarte, auf der die Landmassen im Westen als eigenständiger Kontinent und nach Amerigo Vespucci mit dem Namen ‹America› [bezeichnet wurden].»",
    geprueft: "2026-08-11",
  },
  {
    id: "PP-b1fae0",
    anker: "Mais, Kartoffel, Tomate und Kakao kamen nach Europa",
    /* Die deutsche Wikipedia führt den Artikel unter dem englischen Titel. */
    url: "https://de.wikipedia.org/wiki/Columbian_Exchange",
    titel: "Columbian Exchange (Wikipedia)",
    stelle:
      "«Columbian Exchange (englisch für Kolumbianischer Austausch) ist ein auf Forschungsarbeiten des US-amerikanischen Historikers Alfred W. Crosby zurückgehender Ausdruck, der seit den 1970er Jahren verwendet wird, um die enorme Verbreitung und Wechselwirkung von für die jeweiligen Kontinente zunächst neuartigen landwirtschaftlichen» Pflanzen und Tiere zu bezeichnen.",
    geprueft: "2026-08-11",
  },

  /* ── Die Erde verliert die Mitte ─────────────────────────────────────── */
  {
    id: "PP-6d48f8",
    anker: "Jupitermonde und die Phasen der Venus sah",
    url: "https://de.wikipedia.org/wiki/Galileische_Monde",
    titel: "Galileische Monde (Wikipedia)",
    stelle:
      "«Die Galileischen Monde … sind die vier grössten Monde des Planeten Jupiter: Io, Europa, Ganymed, Kallisto. Durch die Bezeichnung als Galileische Monde wird der italienische Astronom und Naturforscher Galileo Galilei geehrt, der sie 1610 als Erster beschrieb.» Im Text steht «ab 1609», weil Galilei in jenem Jahr mit den Beobachtungen begann; die Monde beschrieb er 1610.",
    geprueft: "2026-08-11",
  },
  {
    id: "PP-6d48f8",
    anker: "seiner Überzeugung abzuschwören",
    url: "https://de.wikipedia.org/wiki/Galileo_Galilei",
    titel: "Galileo Galilei (Wikipedia), zum Prozess von 1633",
    stelle:
      "Einen eigenen Artikel zum Prozess gibt es auf der deutschen Wikipedia nicht; der Personenartikel führt das Verfahren aus. Er belegt den Weg dorthin: «Daraufhin eröffnete die Römische Inquisition nach Vorarbeit des bedeutenden Kirchenlehrers Kardinal Robert Bellarmin … ein Untersuchungsverfahren.»",
    geprueft: "2026-08-11",
  },

  /* ── Die Evolution ───────────────────────────────────────────────────── */
  {
    id: "PP-a0320e",
    anker: "Alfred Russel Wallace ihm 1858 dieselbe Idee in einem Brief schickte",
    url: "https://de.wikipedia.org/wiki/Alfred_Russel_Wallace",
    titel: "Alfred Russel Wallace (Wikipedia)",
    stelle:
      "«Alfred Russel Wallace … war ein weitgehend autodidaktisch gebildeter britischer Naturforscher. … Bei seinem Aufenthalt im Malaiischen Archipel erkannte» er unabhängig von Darwin das Prinzip der natürlichen Auslese; der Artikel schildert den Brief von 1858, der Darwin zur Veröffentlichung bewegte.",
    geprueft: "2026-08-11",
  },
  {
    id: "PP-a0320e",
    /* Nicht «… an Darwins Verteidiger» — das verdeckte den Glossarbegriff
       «Darwins», der im Block sonst nicht frei vorkommt. */
    anker: "Berühmt wurde die Spottfrage",
    url: "https://de.wikipedia.org/wiki/Huxley-Wilberforce-Debatte",
    titel: "Huxley-Wilberforce-Debatte (Wikipedia)",
    stelle:
      "«Dabei soll es zu einem Wortgefecht zwischen Thomas Henry Huxley … und Samuel Wilberforce, Bischof von Oxford, gekommen sein, bei dem Wilberforce fragte, ob Huxley lieber väterlicher- oder mütterlicherseits von Affen abstamme.» Die Quelle datiert die Debatte auf den 30. Juni 1860 und schreibt bewusst «soll»: Es gibt keinen Wortlaut, nur Erinnerungen der Anwesenden.",
    geprueft: "2026-08-11",
  },

  /* ── Die Kernspaltung ────────────────────────────────────────────────── */
  {
    id: "PP-0c8b04",
    anker: "Otto Hahn und Fritz Strassmann finden im bestrahlten Uran",
    url: "https://de.wikipedia.org/wiki/Kernspaltung",
    titel: "Kernspaltung (Wikipedia)",
    stelle:
      "«Otto Hahn und seinem Assistenten Fritz Straßmann gelang dann am 17. Dezember 1938 am Berliner Kaiser-Wilhelm-Institut für Chemie der Beweis einer neutroneninduzierten Kernspaltung von Uran durch den radiochemischen Nachweis des Spaltprodukts Barium.» Die Quelle schreibt «Straßmann», im Text steht «Strassmann» nach Schweizer Rechtschreibung.",
    geprueft: "2026-08-11",
  },

  /* ── Teppich, Faden kulturelle Praxen: Ackerbau ──────────────────────── */
  {
    id: "PP-3c0394",
    /* Bewusst kurz vor «im sogenannten Fruchtbaren Halbmond»: Diese Wörter
       tragen den Glossar-Hover, ein längerer Anker würde ihn verdecken. */
    anker: "Die ältesten Bauerndörfer entstanden um 9500 v. Chr.",
    url: "https://de.wikipedia.org/wiki/Jungsteinzeit",
    titel: "Jungsteinzeit (Wikipedia)",
    stelle:
      "«Nach derzeitigem Kenntnisstand begann das Neolithikum zuerst um 9500 v. Chr. im Fruchtbaren Halbmond Vorderasiens (vor allem an den Südrändern des Zagros- und Taurusgebirges).» Und zur zweiten Jahresangabe im Text: «Das Beginndatum wird allerdings grundsätzlich auf die betrachtete Region bezogen, so dass die Jungsteinzeit etwa in Mittel- und Nordwesteuropa erst zwischen 5800 und 4000 v. Chr.» beginnt.",
    geprueft: "2026-08-11",
  },

  /* ══ Teppich des Wandels, Faden gesellschaftliche Ereignisse ════════════
     Kontrollrunde auf Christofs Wunsch (2026-08-11): mindestens eine Quelle
     je Karte, wo etwas behauptet wird. */

  /* ── Der Prozess des Sokrates ────────────────────────────────────────── */
  {
    id: "PP-28bc86",
    anker: "trank den Giftbecher",
    url: "https://de.wikipedia.org/wiki/Sokrates",
    titel: "Sokrates (Wikipedia)",
    stelle:
      "«Gut gesichert ist das Jahr seines Prozesses und Todes, 399 v. Chr.» Und zum Giftbecher: «Bis zur Hinrichtung durch den Schierlingsbecher beschäftigten ihn und die zu Besuch im Gefängnis weilenden Freunde und Schüler philosophische Fragen.» Der Giftbecher im Text ist dieser Schierlingsbecher.",
    geprueft: "2026-08-11",
  },

  /* ── Kolonialisierung ────────────────────────────────────────────────── */
  {
    id: "PP-815d58",
    anker: "im Vertrag von Tordesillas eine Linie",
    url: "https://de.wikipedia.org/wiki/Vertrag_von_Tordesillas",
    titel: "Vertrag von Tordesillas (Wikipedia)",
    stelle:
      "«Im Vertrag von Tordesillas, abgeschlossen am 7. Juni 1494 in der spanischen Stadt Tordesillas, wurden die Herrschaftsbereiche Portugals und Kastiliens im Atlantik … neu abgegrenzt.» Die Quelle sagt Kastilien, der Text Spanien: Kastilien war der Kern des entstehenden Spanien.",
    geprueft: "2026-08-11",
  },
  {
    id: "PP-815d58",
    anker: "Der Mönch Bartolomé de Las Casas",
    url: "https://de.wikipedia.org/wiki/Bartolom%C3%A9_de_Las_Casas",
    titel: "Bartolomé de Las Casas (Wikipedia)",
    stelle:
      "«… war ein spanischer Theologe, Dominikaner und Historiker sowie der erste Bischof von Chiapas im heutigen Mexiko. … wurde ab 1514 dann aber einer der schärfsten und meistbeachteten Kritiker der Conquista sowie Streiter für die Würde der Indigenen Völker Amerikas.» Als Dominikaner war er Ordensmann, daher «Mönch» im Text.",
    geprueft: "2026-08-11",
  },

  /* ── Reformation ─────────────────────────────────────────────────────── */
  {
    id: "PP-b6b641",
    anker: "mit seinen 95 Thesen zunächst eine Gelehrtendebatte",
    url: "https://de.wikipedia.org/wiki/95_Thesen",
    titel: "95 Thesen (Wikipedia)",
    stelle:
      "«Martin Luthers 95 Thesen …, in denen er sich gegen den Missbrauch des Ablasses und besonders gegen den geschäftsmässigen Handel mit Ablassbriefen aussprach, wurden am 31. Oktober 1517 als Beifügung an einen Brief an den Erzbischof von Mainz und Magdeburg, Albrecht von Brandenburg, erstmals in Umlauf gebracht.»",
    geprueft: "2026-08-11",
  },

  /* ── Das Erdbeben von Lissabon ───────────────────────────────────────── */
  {
    id: "PP-39fd0b",
    anker: "Am Morgen des 1. November 1755",
    url: "https://de.wikipedia.org/wiki/Erdbeben_von_Lissabon_1755",
    titel: "Erdbeben von Lissabon 1755 (Wikipedia)",
    stelle:
      "«Das Erdbeben von Lissabon am 1. November 1755 zerstörte zusammen mit einem Grossbrand und einem Tsunami die portugiesische Hauptstadt Lissabon fast vollständig. Mit 30.000 bis 100.000 Todesopfern war dieses Erdbeben eine der verheerendsten Naturkatastrophen der europäischen Geschichte.»",
    geprueft: "2026-08-11",
  },
  {
    id: "PP-39fd0b",
    anker: "verschickte Fragebögen über den Ablauf des Bebens",
    url: "https://de.wikipedia.org/wiki/Erdbeben_von_Lissabon_1755",
    titel: "Erdbeben von Lissabon 1755 (Wikipedia), zur Erdbebenforschung",
    stelle:
      "«Der Premierminister sorgte nicht nur für den Wiederaufbau, sondern ordnete auch eine Umfrage bei allen Pfarrern an, um Fakten über das Beben und seine Auswirkungen zu sammeln.» Der Abschnitt heisst «Erdbebenforschung» — daher die Formulierung im Text, dies sei ein Anfang der modernen Erdbebenforschung.",
    geprueft: "2026-08-11",
  },

  /* ── Französische Revolution ─────────────────────────────────────────── */
  {
    id: "PP-ed6671",
    anker: "befreite zwar nur sieben Gefangene",
    url: "https://de.wikipedia.org/wiki/Sturm_auf_die_Bastille",
    titel: "Sturm auf die Bastille (Wikipedia)",
    stelle:
      "«Sie befreite die Gefangenen: vier Urkundenfälscher, zwei Geisteskranke und vermutlich den adligen Schriftsteller Marquis de Sade, den seine Familie wegen seines wüsten Lebenswandels in der Bastille hatte festsetzen lassen.» Die Aufzählung ergibt sieben.",
    geprueft: "2026-08-11",
  },
  {
    id: "PP-ed6671",
    anker: "Die Schriftstellerin Olympe de Gouges forderte 1791",
    url: "https://de.wikipedia.org/wiki/Olympe_de_Gouges",
    titel: "Olympe de Gouges (Wikipedia)",
    stelle:
      "«Olympe de Gouges … (* 7. Mai 1748 in Montauban; † 3. November 1793 in Paris) war eine Revolutionärin, Frauenrechtlerin und Schriftstellerin im Zeitalter der Aufklärung. Sie ist die Verfasserin der Erklärung der Rechte der Frau und Bürgerin von 1791.» Ihre Hinrichtung während des Terrors schildert der Artikel im Abschnitt zum Prozess.",
    geprueft: "2026-08-11",
  },

  /* ── Zweiter Weltkrieg ───────────────────────────────────────────────── */
  {
    id: "PP-72d801",
    anker: "Verbrechen gegen die Menschlichkeit",
    url: "https://de.wikipedia.org/wiki/N%C3%BCrnberger_Prozesse",
    titel: "Nürnberger Prozesse (Wikipedia)",
    stelle:
      "«Die Nürnberger Prozesse wurden nach dem Zweiten Weltkrieg gegen führende Repräsentanten des NS-Staates durchgeführt. Sie fanden zwischen dem 20. November 1945 und dem 14. April 1949 im Justizpalast Nürnberg statt.» Der Artikel beginnt den Bedeutungs-Absatz mit «Zum ersten Mal in der Geschichte» — darauf stützt sich das «erstmals» im Text.",
    geprueft: "2026-08-11",
  },
  {
    id: "PP-72d801",
    /* Mit «UNO beschloss 1948» davor: Der kurze Anker käme auch im
       Epochen-Block «Weltkriege» vor und würde dort lecken. */
    anker: "UNO beschloss 1948 die Allgemeine Erklärung der Menschenrechte",
    url: "https://de.wikipedia.org/wiki/Allgemeine_Erkl%C3%A4rung_der_Menschenrechte",
    titel: "Allgemeine Erklärung der Menschenrechte (Wikipedia)",
    stelle:
      "«Die Allgemeine Erklärung der Menschenrechte … ist eine rechtlich nicht bindende Resolution der Generalversammlung der Vereinten Nationen zu den Menschenrechten. Sie wurde am 10. Dezember 1948 im Palais de Chaillot in Paris verkündet.»",
    geprueft: "2026-08-11",
  },

  /* ── Mondfahrt im Kalten Krieg ───────────────────────────────────────── */
  {
    id: "PP-39c9bb",
    anker: "rund 600 Millionen Menschen am Fernseher",
    url: "https://de.wikipedia.org/wiki/Apollo_11",
    titel: "Apollo 11 (Wikipedia)",
    stelle:
      "«Weltweit verfolgten rund 600 Millionen Menschen die Fernsehübertragung der Mondlandung 1969.»",
    geprueft: "2026-08-11",
  },

  /* ── Zusammenbruch der Sowjetunion ───────────────────────────────────── */
  {
    id: "PP-dea58d",
    anker: "scheiterte in Moskau ein Putsch der alten Garde",
    url: "https://de.wikipedia.org/wiki/Zerfall_der_Sowjetunion",
    titel: "Zerfall der Sowjetunion (Wikipedia)",
    stelle:
      "«Deren Zerfall in fünfzehn unabhängige Staaten begann mit der Unabhängigkeitserklärung Litauens am 11. März 1990, beschleunigte sich nach dem gescheiterten Augustputsch in Moskau 1991 und endete am 8. Dezember 1991 mit den Belowescher Vereinbarungen.» Zum Datum im Text: «Nach dem Rücktritt des letzten Präsidenten der UdSSR Michail Gorbatschow am 25. Dezember 1991 endete ihre Existenz am 26. Dezember.»",
    geprueft: "2026-08-11",
  },

  /* ══ Teppich, Faden Entdeckungen: Nachzügler der Kontrollrunde ══════════ */

  /* ── Die Null, Vertiefung ────────────────────────────────────────────── */
  {
    id: "PP-3a1b29",
    anker: "Der indische Gelehrte Brahmagupta beschrieb im Jahr 628",
    url: "https://de.wikipedia.org/wiki/Brahmagupta",
    titel: "Brahmagupta (Wikipedia)",
    stelle:
      "«… verfasste … das Buch Brahmasphutasiddhanta … im Jahre 628.» Und: «Darüber hinaus stellte Brahmagupta in diesem Werk Regeln für die Arithmetik mit negativen Zahlen und mit der Zahl 0 auf, die schon weitgehend unserem modernen Verständnis entsprechen.»",
    geprueft: "2026-08-11",
  },

  /* ── Die Erde verliert die Mitte, Vertiefung ─────────────────────────── */
  {
    id: "PP-6d48f8",
    anker: "schob ungefragt ein Vorwort ein",
    url: "https://de.wikipedia.org/wiki/De_revolutionibus_orbium_coelestium",
    titel: "De revolutionibus orbium coelestium (Wikipedia)",
    stelle:
      "«Andreas Osiander … fügte dem Manuskript ein anonymes Vorwort hinzu, wonach die heliozentrische Weltsicht weder wahr noch plausibel sein müsse.» Dass es ohne Zustimmung geschah, zeigt die Folge: «Johannes Kepler entlarvte Osianders ‹Fälschung› anhand von Notizen im Exemplar des Nürnberger Astronomen Hieronymus Schreiber.»",
    geprueft: "2026-08-11",
  },

  /* ── Die Evolution, Vertiefung ───────────────────────────────────────── */
  {
    id: "PP-a0320e",
    anker: "war am ersten Tag vergriffen",
    url: "https://de.wikipedia.org/wiki/%C3%9Cber_die_Entstehung_der_Arten",
    titel: "Über die Entstehung der Arten (Wikipedia)",
    stelle:
      "«Die erste Auflage von 1250 Exemplaren kam am 22. November 1859 in den Handel, aber die Zahl der Bestellungen war bereits grösser, daher war diese Auflage sofort vergriffen.» Genauer als der Text: Sie war schon durch Vorbestellungen überzeichnet.",
    geprueft: "2026-08-11",
  },

  /* ── Die Kernspaltung, Vertiefung ────────────────────────────────────── */
  {
    id: "PP-2dfab2",
    anker: "Den Nobelpreis dafür erhielt 1944 Hahn allein",
    url: "https://de.wikipedia.org/wiki/Lise_Meitner",
    titel: "Lise Meitner (Wikipedia)",
    stelle:
      "«Für ihre Errungenschaften erhielt Lise Meitner zahlreiche Ehrungen, jedoch weder den Nobelpreis für Chemie noch den Nobelpreis für Physik, obwohl sie für beide Nobelpreise vielfach nominiert wurde.» Und: «Nachdem Otto Hahn den Chemie-Nobelpreis des Jahres 1944 erhalten hatte, nominierte er Lise Meitner 1948 für den Physik-Nobelpreis.» Zum Bomben-Satz im Text: Die Quelle fasst es allgemeiner («In der Nachkriegszeit stellte Lise Meitner die Entwicklung der Kernwaffen in Frage»); das wörtliche Nein zur Mitarbeit stammt aus ihrer Biografie.",
    geprueft: "2026-08-11",
  },

  /* ══ Teppich des Wandels, Faden kulturelle Praxen ═══════════════════════
     Abschluss der Kontrollrunde (2026-08-11); Ackerbau ist oben versorgt. */

  /* ── Gewürz- und Seidenhandel ────────────────────────────────────────── */
  {
    id: "PP-c9ffe5",
    /* Ohne das Wort «Pest» im Anker: Das trägt den neuen Glossar-Hover und
       kommt im Block nur einmal vor. */
    anker: "1347 erreichte über die Handelswege",
    url: "https://de.wikipedia.org/wiki/Seidenstra%C3%9Fe",
    titel: "Seidenstrasse (Wikipedia)",
    stelle:
      "«Das in Europa wohl bekannteste und folgenreichste Beispiel für die Verbreitung von Krankheiten entlang der Seidenstrasse ist die Ausbreitung der Pest im 14. Jahrhundert. … Durch diesen regen Austausch wurden auch Pestbakterien, die vor allem in wild lebenden Nagetierpopulationen Asiens vorkommen, nach Europa gebracht.» Die Quelle datiert die Welle ins 14. Jahrhundert; 1347 ist das übliche Jahr ihrer Ankunft in Europa.",
    geprueft: "2026-08-11",
  },

  /* ── Das Haus der Weisheit ───────────────────────────────────────────── */
  {
    id: "PP-08e272",
    anker: "Haus der Weisheit",
    /* Nicht «/wiki/Haus der Weisheit» — das führt auf eine Begriffsklärung.
       Der Bagdader Artikel trägt den Klammerzusatz. */
    url: "https://de.wikipedia.org/wiki/Haus_der_Weisheit_(Bagdad)",
    titel: "Haus der Weisheit, Bagdad (Wikipedia)",
    stelle:
      "«Das Haus der Weisheit … war eine Art Akademie, die im Jahr 825 von dem Abbasiden-Kalifen al-Ma'mūn in Bagdad gegründet wurde. … Im Haus der Weisheit arbeiteten zeitweise rund 90 Menschen an wissenschaftlichen Übersetzungen, vor allem aus dem Griechischen.» Der Artikel datiert die Gründung auf 825; die Jahresangabe «~820» der Karte trägt darum die Tilde.",
    geprueft: "2026-08-11",
  },
  {
    id: "PP-0ca4a1",
    /* Nicht «Hier arbeitete al-Chwarizmi»: «al-Chwarizmi» trägt den
       Glossar-Hover und kommt im Block nur dort frei vor. */
    anker: "der Algebra den Namen gab",
    url: "https://de.wikipedia.org/wiki/Al-Chwarizmi",
    titel: "Al-Chwarizmi (Wikipedia)",
    stelle:
      "«Chwarizmi, der vor allem als einer der Begründer der Algebra bekannt ist, gilt als einer der bedeutendsten Mathematiker.» Und zur zweiten Behauptung des Satzes: «Von seinem Namen leitet sich der Begriff Algorithmus ab.»",
    geprueft: "2026-08-11",
  },
  {
    id: "PP-0ca4a1",
    /* Ohne «die Mongolen» im Anker: Der Begriff trägt den Glossar-Hover und
       kommt im Block nur an dieser Stelle vor. */
    anker: "Bagdad 1258 eroberten",
    url: "https://de.wikipedia.org/wiki/Eroberung_von_Bagdad",
    titel: "Eroberung von Bagdad (Wikipedia)",
    stelle:
      "«Die mongolische Eroberung Bagdads fand am 10. Februar 1258 statt. Die Mongolen unter Hülegü eroberten und zerstörten die Hauptstadt der abbasidischen Kalifen.» Die Tigris-Erzählung führt der Text selbst als Chronisten-Bericht, nicht als Tatsache.",
    geprueft: "2026-08-11",
  },

  /* ── Die Universität ─────────────────────────────────────────────────── */
  {
    id: "PP-d94a91",
    anker: "In Bologna, Paris und Oxford entsteht eine neue Praxis",
    url: "https://de.wikipedia.org/wiki/Universit%C3%A4t",
    titel: "Universität (Wikipedia)",
    stelle:
      "«An den damals neu gegründeten Institutionen von Bologna (gegründet 1088), Paris (gegründet um 1150) oder Oxford (gegründet im 12. Jahrhundert)» entwickelte sich der Lehrbetrieb. Zum Wort: «vom lateinischen universitas magistrorum et scolarium, ‹Gemeinschaft der Lehrer und Schüler›».",
    geprueft: "2026-08-11",
  },
  {
    id: "PP-1aae8d",
    anker: "In Bologna hatten sogar die Studenten das Sagen",
    url: "https://de.wikipedia.org/wiki/Universit%C3%A4t_Bologna",
    titel: "Universität Bologna (Wikipedia)",
    stelle:
      "«Um 1350 begann die Stadt auch, die Professoren zu besolden. Davor waren sie von den Studenten bezahlt worden.» Der Artikel beschreibt die frühe Universität als Zusammenschluss der Studentenschaft mit eigener Gerichtsbarkeit.",
    geprueft: "2026-08-11",
  },
  {
    id: "PP-1aae8d",
    anker: "ihre erste Universität 1460 in Basel",
    url: "https://de.wikipedia.org/wiki/Universit%C3%A4t_Basel",
    titel: "Universität Basel (Wikipedia)",
    stelle:
      "«Die Universität Basel … wurde im Jahr 1460 gegründet und ist somit die älteste Universität der Schweiz.»",
    geprueft: "2026-08-11",
  },

  /* ── Kaffeehaus-Öffentlichkeit ───────────────────────────────────────── */
  {
    id: "PP-eddc6f",
    anker: "trafen sich Reeder und Kaufleute",
    url: "https://de.wikipedia.org/wiki/Lloyd%E2%80%99s_of_London",
    titel: "Lloyd's of London (Wikipedia)",
    stelle:
      "«Lloyd's of London mit Sitz in London ist ein internationaler Versicherungsmarkt. … keine Firma oder Kapitalgesellschaft, sondern eine Börse, an der mit Versicherungen gehandelt wird.» Zum Ursprung im Kaffeehaus: Der Artikel verweist auf «die gemeinsamen Anfänge in Lloyd's Kaffeehaus».",
    geprueft: "2026-08-11",
  },

  /* ── Grenzenloser Welthandel ─────────────────────────────────────────── */
  {
    id: "PP-122a06",
    anker: "die Welthandelsorganisation entstand 1995",
    url: "https://de.wikipedia.org/wiki/Welthandelsorganisation",
    titel: "Welthandelsorganisation (Wikipedia)",
    stelle:
      "«Die Welthandelsorganisation … ist eine internationale Organisation mit Sitz in Genf, die sich mit der Regelung von Handels- und Wirtschaftsbeziehungen beschäftigt.» Gegründet wurde sie im April 1994, und: «Januar 1995 nahm sie ihre Arbeit in Genf auf.» Das «entstand 1995» im Text meint diese Arbeitsaufnahme.",
    geprueft: "2026-08-11",
  },
  {
    id: "PP-122a06",
    anker: "China trat 2001 bei",
    url: "https://de.wikipedia.org/wiki/China-Schock",
    titel: "China-Schock (Wikipedia)",
    stelle:
      "«… nach dem Beitritt Chinas zur Welthandelsorganisation (WTO) im Dezember 2001.» Und zur Folge: «Der erste China-Schock entstand aus der Verbindung von Chinas WTO-Beitritt 2001, niedrigen Produktionskosten, einer rasch wachsenden Exportindustrie und der Öffnung westlicher Märkte.»",
    geprueft: "2026-08-11",
  },
  {
    id: "PP-122a06",
    anker: "quer stehendes Containerschiff im Suezkanal",
    url: "https://de.wikipedia.org/wiki/Ever_Given",
    titel: "Ever Given (Wikipedia)",
    stelle:
      "Die Ever Given wurde bekannt, als sie «am 23. März 2021 im Suezkanal bei starkem Wind an einer Uferböschung des Kanals auf Grund lief, sich schräg stellte und dadurch die Schifffahrtsrinne des Kanals sechs Tage lang blockierte.»",
    geprueft: "2026-08-11",
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
    id: "EP-fbb1d9",
    betrifft:
      "«die Kosten für das Verladen einer Tonne Fracht sanken dadurch auf einen Bruchteil» (gleichlautend in PP-08cebe: «senkte die Verladekosten auf einen Bruchteil»)",
    grund:
      "Die Zahl hinter dieser Aussage (rund 5.83 Dollar je Tonne im Stückgutbetrieb gegen etwa 16 Cent auf der Ideal X) geht auf Marc Levinsons «The Box» (2006) zurück. Weder die deutsche noch die englische Wikipedia führt sie und eine frei zugängliche deutschsprachige Darstellung mit dieser Angabe haben wir am 2026-08-05 nicht gefunden. Das Buch selbst liegt uns nicht vor und aus dem Gedächtnis wird hier nichts belegt. Die Aussage bleibt darum unbelegt stehen, statt sie in eine unscharfe Formulierung umzubauen: Belegt ist der Anlass (McLean ärgerte sich über die Wartezeiten beim Entladen), nicht die Höhe der Ersparnis.",
    notiert: "2026-08-05",
  },
  {
    id: "PP-f6cce2",
    betrifft:
      "«mit magnetischen Löffeln richteten Wahrsager Häuser und Gräber günstig aus»",
    grund:
      "Die Wahrsage-Herkunft des Kompasses ist in der Fachliteratur (Needham) belegt, aber wir haben keine frei zugängliche deutschsprachige Seite gefunden, die genau den Löffel-Kompass der Wahrsager beschreibt. Der Wikipedia-Artikel «Kompass» erwähnt ihn nur beiläufig. Bis eine tragfähige Quelle da ist, bleibt die Stelle ohne Link.",
    notiert: "2026-07-26",
  },
  {
    id: "PP-f6cce2",
    betrifft: "«der Legende nach auch Napoleon und Benjamin Franklin»",
    grund:
      "Steht so nicht in diesem Block, sondern beim Schachtürken; hier nur als Hinweis, dass Legenden-Zuschreibungen grundsätzlich keinen Beleg bekommen. Sie sind im Text bereits als Legende gekennzeichnet.",
    notiert: "2026-07-26",
  },
  {
    id: "VA-af83af",
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
  {
    id: "VA-245306",
    betrifft:
      "«Der Philosoph Ernst Bloch sah in der alchemistischen Werkstatt eine frühe, bewusst auf Veränderung gerichtete Form der Technik.»",
    grund:
      "Der Gedanke steht bei Bloch im «Prinzip Hoffnung», wo die Alchemie als vorwegnehmende, auf Verwandlung zielende Praxis erscheint. Belegen können wir das am 2026-08-10 nicht: Der Wikipedia-Artikel zu Ernst Bloch erwähnt die Alchemie nicht, der Artikel «Alchemie» erwähnt Bloch nicht und eine frei zugängliche deutschsprachige Seite mit dieser Aussage haben wir nicht gefunden. Das Werk selbst liegt uns nicht vor und aus dem Gedächtnis wird hier nichts belegt. Die frühere Fassung enthielt sogar ein wörtliches Zitat («älteste gewollte Form von Technik»); die Kontrolle hat es zur Paraphrase entschärft, was ohne Quelle die richtige Wahl ist. Ein Zitat verlangt eine Fundstelle, eine Paraphrase trägt sich als Deutung selbst.",
    notiert: "2026-08-10",
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
