# Quellenauftrag · Lernseite 2 «Eine ganz neue Partnerschaft»

**Paket 08 von 9.** Dieses Dokument enthält 35 Textblöcke eines Lernsets zu
Künstlicher Intelligenz und Philosophie (Berufsfachschule, Deutschschweiz).
Jeder Block hat eine **Kennung** in eckigen Klammern, z.B. `[VA-a1b2c3]`.

## Auftrag

Suche zu den Blöcken **überprüfbare Quellen**. Wichtig ist nicht Vollständigkeit,
sondern Nützlichkeit: Gesucht sind Belege für Blöcke, die **zu allgemein**
bleiben und durch eine konkrete Angabe (Zahl, Datum, Name, Studie, Fallbeispiel)
gewinnen würden.

## Regeln

1. **Nichts erfinden.** Wenn du keine Quelle kennst, die du wirklich gelesen
   hast, lass den Block weg. Eine erfundene URL ist schlimmer als keine.
   Jede URL wird nachträglich maschinell abgerufen und geprüft.
2. **Bevorzugt deutschsprachig und frei zugänglich.** Wikipedia, Behörden
   (Schweiz: BFS, EDÖB, IGE; EU-Kommission), Statistikämter, öffentliche
   Medien, Universitäten, Museen. Fachaufsätze nur, wenn es nichts
   Zugänglicheres gibt.
3. **Ein Beleg pro Zeile.** Mehrere Belege zum gleichen Block: mehrere Zeilen
   mit derselben Kennung.
4. **Sag, was fehlt.** Wenn ein Block dir zu allgemein erscheinst und du eine
   konkrete Angabe gefunden hast, die ihn schärfen würde, gehört sie in die
   Spalte «Konkretisierung».

## Rückgabeformat (bitte genau so)

Eine einzige Markdown-Tabelle, keine Prosa davor oder danach:

```
| Kennung | URL | Titel der Quelle | Stützt welche Aussage | Konkretisierung |
| --- | --- | --- | --- | --- |
| VA-a1b2c3 | https://… | CERN: The birth of the Web | Freigabe der Web-Software 1993 | statt «Anfang der 90er»: 30. April 1993 |
```

Spalte «Konkretisierung» leer lassen, wenn der Block schon präzise genug ist
und die Quelle ihn nur bestätigt.

---


## Paket 08 von 9

Jeder Block hier enthält eine prüfbare Behauptung (Zahl, Datum,
Superlativ oder eine Aussage, die jemandem zugeschrieben wird). Deutende
Passagen sind bewusst nicht dabei. Geh die 35 Blöcke einzeln durch.

### Thema 01 · Vorhang auf

**[VA-6b2709]** *(Vertiefung «Mehr lesen» · Yan Shi's Automat)*
Im «Liezi» wird die Figur bis ins Innere beschrieben, denn der Handwerker hatte ihr nachgebildete Organe wie Herz, Lunge, Leber, Nieren, Muskeln und Knochen gegeben. Erstaunlich ist, dass jedes Organ eine eigene Aufgabe trug. Entfernte man das künstliche Herz, verstummte die Figur, nahm man die Leber weg, konnte sie nicht mehr sehen und ohne die Nieren versagten die Beine. Damit erzählt der Text nicht bloss von einer Puppe, sondern von einem durchdachten künstlichen Körper mit inneren Teilen. Die Episode steht im Kapitel «Tang Wen» und spielt am Hof von König Mu, der von weiten Reisen zurückkehrt. Am Ende zeigt sich der König überzeugt, dass menschliche Geschicklichkeit fast an die Werke der Natur heranreicht. So verhandelt die Erzählung schon vor vielen Jahrhunderten, ob ein Gemachtes dem Gewachsenen gleichkommen kann.

**[VA-47b959]** *(Bildgeschichte · Expertensysteme)*
Systeme wie MYCIN gossen das Wissen von Fachleuten in tausende Wenn-dann-Regeln, etwa für die Diagnose von Infektionen. In ihrem engen Gebiet waren sie nützlich. Doch sie blieben teuer im Unterhalt. Und sie waren starr gegenüber allem, was in keiner Regel stand.

> **Belegt** («für die Diagnose von Infektionen»): [Mycin, Expertensystem (Wikipedia)](https://de.wikipedia.org/wiki/Mycin_(Expertensystem)) — «Mycin ist ein seit 1972 an der Stanford University in der Programmiersprache Lisp entwickeltes Expertensystem, das zur Diagnose und Therapie von Infektionskrankheiten durch Antibiotika eingesetzt wurde.» *(geprüft 2026-08-10)*

**[VA-744c71]** *(Kartentext · Statistische KI)*
In den 1990er-Jahren kam die grosse Wende. Statt Regeln von Hand zu schreiben, liess man Maschinen aus vielen Beispielen selbst lernen. Damit wurden die Daten wichtiger als die aufgeschriebene Logik. Die KI begann, Muster zu erraten, statt starre Vorschriften zu befolgen.

**[VA-67c82e]** *(Bildgeschichte · Statistische KI)*
Ab den 1990er-Jahren lernten Maschinen Muster aus Beispielen, etwa um Spam zu erkennen, Handschrift zu lesen oder Sprache zu erraten. Nicht mehr das aufgeschriebene Wissen der Fachleute war entscheidend, sondern die Menge und die Qualität der Daten. Das war ein tiefer Bruch mit der regelbasierten KI. Der Erfolg gab dem neuen Weg recht.

**[VA-22ca4c]** *(Vertiefung «Mehr lesen» · Algorithmen filtern das Internet)*
Der Name PageRank spielt auf Larry Page an, der das Verfahren zusammen mit Sergey Brin an der Universität Stanford entwickelte, wo ihre Suchmaschine anfangs noch «BackRub» hiess. Die Grundidee lehnten die beiden an die Wissenschaft an, denn dort gilt ein Aufsatz als bedeutend, wenn viele andere ihn zitieren. Übertragen aufs Web heisst das, eine Seite ist wichtig, wenn viele wichtige Seiten auf sie verweisen. Fast zeitgleich brachte der Onlinehändler Amazon Ende der 1990er-Jahre Empfehlungen der Art «Kunden, die dies kauften, kauften auch jenes» gross heraus. Beide Ansätze eint, dass nicht mehr ein Mensch, sondern eine Formel über Sichtbarkeit und Reihenfolge entscheidet. Wer weit oben steht, wird gefunden, der Rest verschwindet in der Masse. So wurde der Rang zur eigentlichen Währung im Netz.

**[VA-6d5b0a]** *(Vertiefung «Mehr lesen» · datenbasiert)*
«Die Lernalgorithmen sind die Samen, die Daten der Boden», sagt der Forscher Pedro Domingos. Ohne guten Boden wächst auch aus dem besten Samen nichts. Ein Beispiel: Wurde eine KI fast nur mit englischen Texten trainiert, antwortet sie auf Deutsch oft schwächer. Zeigten die Bilddaten kaum Menschen mit dunkler Haut, erkennt sie diese schlechter. So werden Lücken und Einseitigkeiten der Daten zu Lücken und Einseitigkeiten der KI. Darum ist die Frage, woher die Daten stammen, keine Nebensache, sondern der Kern.

**[VA-9e5c9f]** *(Kartentext · mustererkennend)*
Tippst du auf dem Handy «Salz und», schlägt die Tastatur «Pfeffer» vor. Die KI macht im Grossen dasselbe. Sie hat in Unmengen von Texten gesehen, was häufig zusammen vorkommt, und hält es darum für zusammengehörig. Warum Salz und Pfeffer zusammenpassen, weiss sie nicht. Sie erkennt das Muster verlässlich, ohne es zu verstehen.

**[VA-ad6512]** *(Vertiefung «Mehr lesen» · mustererkennend)*
Die Informatikerin Katharina Zweig bringt es nüchtern auf den Punkt. Das System hat bestimmte Wörter einfach oft in bestimmten Zusammenhängen gelesen und leitet daraus statistische Muster ab. Ein Beispiel: Es weiss, dass nach «Es war einmal» meist ein Märchen folgt, weil das millionenfach so dastand. Ein echtes Verständnis von Märchen hat es deswegen nicht. Zweigs Fazit ist deutlich, dass solche Systeme noch gar nicht wirklich intelligent sind. Sie erkennen sehr gut, aber sie begreifen nichts.

**[VA-9f6b84]** *(Kartentext · wahrscheinlichkeitsbasiert)*
Welches Wort folgt auf «Hochmut kommt vor dem …»? Da fällt allen dasselbe ein. Genau so arbeitet die KI: Sie sagt aus dem Bisherigen das nächste Wort voraus. Meist ist die Fortsetzung aber nicht eindeutig. Nach «Nach der Vorlesung gehe ich in die …» ist «Mensa» wahrscheinlich, «Stadt» auch möglich, «Schule» kaum. Die KI berechnet für viele Möglichkeiten eine Wahrscheinlichkeit und greift dann zu. Ihre Antwort ist darum eine Wette mit sehr guten Quoten, aber eben eine Wette.

**[VA-e41f4b]** *(Vertiefung «Mehr lesen» · wahrscheinlichkeitsbasiert)*
Damit die KI überhaupt rechnen kann, wird jedes Wort, genauer jeder Wortteil, in eine lange Zahlenreihe übersetzt. Solche Zahlenreihen heissen Vektoren. Man darf sich einen Vektor als Ort in einem Raum vorstellen: «Hund» und «Katze» liegen dort nah beieinander, «Hund» und «Schraube» weit auseinander. Dieser Raum hat allerdings nicht drei Richtungen wie unserer, sondern sehr viele. Die Informatikerin Katharina Zweig nennt Hunderte bis über zehntausend Richtungen. Was eine einzelne davon bedeutet, kann niemand ablesen; erst ihr Zusammenspiel ergibt die Lage eines Wortteils. Der Philosoph Markus Gabriel nennt dieses Übersetzen in Mathematik «vektorisieren». Am Ende bleibt es ein Rechnen mit Lagen und Abständen, kein Verstehen. Wie «mutig» die KI beim Auswählen würfelt, regelt eine Einstellung namens Temperatur. Ein hoher Wert macht die Antworten kreativer und unberechenbarer, ein niedriger vorhersehbarer. Darum kann dieselbe Frage zweimal ganz verschieden beantwortet werden.

**[VA-3dbf88]** *(Kartentext · generalisierend)*
Hat eine KI tausende Katzenfotos gesehen, erkennt sie auch eine Katze auf einem Bild, das ihr völlig neu ist. Sie überträgt Gelerntes auf Neues. Aus vielen einzelnen Beispielen zieht sie eine allgemeine Regel. So kann sie sogar Sätze sinnvoll fortsetzen, die noch nie jemand geschrieben hat. Genau das unterscheidet echtes Lernen vom reinen Auswendiglernen.

**[VA-251f64]** *(Kartentext · adaptiv)*
Schreibst du locker und mit Emojis, antwortet die KI oft ebenso locker. Sie passt sich an, an deinen Ton, deine Beispiele und deine Korrekturen. Sagst du «bitte kürzer», wird die nächste Antwort kürzer. Wichtig ist dabei ein Unterschied: Im laufenden Gespräch stellt sie sich auf dich ein, dazulernen tut sie dabei nicht. Ob deine Eingaben später ins Training einfliessen, hängt vom Anbieter, vom Produkt und von deinen Einstellungen ab.

**[VA-02ccbc]** *(Kartentext · Rechen- und Speicherkapazität)*
Leistungsfähige KI braucht sehr viele spezielle Computerchips, Server und Speicher. Diese Anlagen sind teuer und stehen nur wenigen grossen Unternehmen und Staaten zur Verfügung. Wer diese Rechenkraft besitzt, hat einen grossen Vorsprung. So entsteht eine Abhängigkeit von einigen wenigen Anbietern.

**[VA-62c30a]** *(Kartentext · Arbeitsmarkt)*
KI verändert die Arbeitswelt spürbar. Sie übernimmt vor allem einzelne Aufgaben, selten gleich einen ganzen Beruf. Manche Tätigkeiten fallen weg, andere verändern sich und neue kommen dazu. Für viele Berufe bedeutet das neue Anforderungen und neues Lernen.

**[VA-225dcb]** *(Kartentext · Kultureller Bias und Technikverständnis)*
KI lernt aus Texten, die oft aus dem englischsprachigen und westlichen Raum stammen. Darum gibt sie häufig westliche Sprachen, Werte und Sichtweisen wieder. Andere Kulturen verstehen Technik, Gemeinschaft und Privatsphäre aber teils ganz anders. «West» und «Ost» sind dabei keine festen Blöcke, sondern grobe Vereinfachungen.

**[VA-2717c6]** *(Fallbeispiel · Wissensmacht)*
Die Trainingsdaten der grossen Modelle bestehen zu einem sehr grossen Teil aus englischen Texten. Wissen aus kleineren Sprachen, etwa vielen afrikanischen, ist kaum vertreten und dort antwortet die KI schwächer oder erfindet mehr. So entscheidet die Datenmenge mit, wessen Wissen sichtbar bleibt.

### Thema 02 · Philosophische Perspektive

**[PP-ff5fc3]** *(Kartentext · Die KI stellt diese Frage neu und dringlich)*
Wörtlich wird «Was ist der Mensch?» laut Google Trends kaum häufiger gesucht als früher. Aber in unzähligen Reden und Texten über KI kehrt die Frage in konkreter Form wieder. Müssen wir überhaupt noch selbst denken und schreiben? Wie verändert uns die tägliche Nutzung? Und welche Rolle bekommen wir neben der Maschine, eher anleitend, prüfend und verantwortend statt ausführend? So taucht die alte philosophische Frage nach dem Menschen mitten im Alltag neu auf.

**[PP-f89d1d]** *(Kartentext · Sie gibt keine Rezepte, sondern Orientierung)*
Philosophie liefert keine Bedienungsanleitung und keine Prognose. Sie ordnet Begriffe, deckt verborgene Annahmen auf und wägt Gründe ab. So hilft sie zu klären, worüber wir eigentlich streiten. Hegels Bild der «Eule der Minerva» oben sagt, dass Verstehen oft erst im Rückblick kommt. Genau dieses Begreifen brauchen wir aber, um die Gegenwart zu gestalten.

**[PP-d95ea2]** *(Fliesstext · Der Teppich des Wandels)*
Der Teppich zeigt Ereignisse, die technologisch, gesellschaftlich, kulturell oder erfinderisch sind. Sie bilden vier Fäden, die nebeneinander durch die Zeit laufen, von Pflug, Rad und Schrift bis zur KI. Das Entscheidende ist ihre Wechselwirkung, denn sie hängen voneinander ab. Eisenbahn und Schifffahrt etwa hätten sich nie so verbreitet, wenn nicht auch kulturell das Interesse bestanden hätte, zu reisen, Handel zu treiben und neue Länder zu besitzen.

**[PP-52d713]** *(Vertiefung «Mehr lesen» · Der Fall Roms)*
Rom galt als die ewige Stadt, seit rund achthundert Jahren hatte kein Feind sie eingenommen, dann plünderten 410 die Westgoten unter Alarich drei Tage lang in ihren Strassen. Die Nachricht lief durch das ganze Reich, der Gelehrte Hieronymus schrieb aus Bethlehem, eingenommen sei die Stadt, die zuvor die ganze Welt besiegt hatte. Der eigentliche Schlusspunkt kam leise: 476 setzte der Heerführer Odoaker den letzten weströmischen Kaiser ab, einen Jungen namens Romulus Augustulus und schickte die Kaiserinsignien nach Konstantinopel. Viele Menschen merkten zunächst kaum einen Unterschied, doch über die Jahrzehnte zerfielen Strassen, Wasserleitungen und Verwaltung, Städte schrumpften, Wissen ging verloren. Der Fall Roms zeigt, dass grosse Ordnungen selten mit einem Knall enden, sondern in einem langen Ausfransen, das die Menschen erst im Rückblick als Epochenbruch erkennen.

> **Belegt** («seit rund achthundert Jahren hatte kein Feind sie eingenommen»): [Plünderung Roms (410) (Wikipedia)](https://de.wikipedia.org/wiki/Pl%C3%BCnderung_Roms_(410)) — «Dies war die erste Einnahme Roms seit dem Einfall der Kelten rund 800 Jahre zuvor.» Die Plünderung selbst datiert der Artikel auf den 24. bis 27. August 410. Dort steht auch das Hieronymus-Zitat aus Brief 127,12, dem der Schlusssatz dieses Blocks folgt. *(geprüft 2026-08-05)*

**[PP-a89d23]** *(Kartentext · Zweiter Weltkrieg)*
Der industrialisierte Krieg und die Schoah erschüttern den Glauben an den Fortschritt im Kern. Zugleich treibt der Krieg Technologien voran, etwa Radar, Rakete und Computer.

**[PP-4d58a4]** *(Vertiefung «Mehr lesen» · Die Schrift)*
Am Anfang standen Zählsteine und Ritzzeichen, mit denen Tempelverwalter in Uruk festhielten, wer wie viel Gerste oder wie viele Schafe abgeliefert hatte. Aus den Bildzeichen wurde die Keilschrift, in feuchten Ton gedrückt und mit ihr entstand ein neuer Beruf, der Schreiber, der seine Kunst in jahrelanger Schule lernte und damit zu einer kleinen Elite gehörte. Bald speicherte die Schrift nicht mehr nur Vorräte, sondern Verträge, Gesetze wie die Stele des Hammurabi und Geschichten wie das Gilgamesch-Epos, das älteste grosse Erzählwerk der Menschheit. Interessant ist, dass schon damals gewarnt wurde: Platon überliefert die Sorge, wer schreibe, verlasse sich auf tote Zeichen und übe sein Gedächtnis nicht mehr. Die Klage klingt vertraut, sie begleitet seither jede Technik, die dem Kopf Arbeit abnimmt, vom Taschenrechner bis zur KI.

> **Belegt** («die Stele des Hammurabi»): [Codex Hammurapi (Wikipedia)](https://de.wikipedia.org/wiki/Codex_Hammurapi) — «Als Codex Hammurapi … bezeichnet man eine babylonische Sammlung von Rechtssprüchen aus dem 18. Jahrhundert v. Chr. Sie gilt zugleich als eines der wichtigsten und bekanntesten literarischen Werke des antiken Mesopotamiens und als bedeutende Quelle keilschriftlich überlieferter Rechtsordnungen.» *(geprüft 2026-08-10)*

> **Belegt** («das Gilgamesch-Epos, das älteste grosse Erzählwerk»): [Gilgamesch-Epos (Wikipedia)](https://de.wikipedia.org/wiki/Gilgamesch-Epos) — «Das Gilgamesch-Epos … ist der Inhalt einer Gruppe literarischer Werke, die vor allem aus dem babylonischen Raum stammt und eine der ältesten überlieferten, schriftlich fixierten Dichtungen enthält.» Die Quelle sagt «eine der ältesten», nicht «das älteste»; im Text steht darum «das älteste grosse Erzählwerk», bezogen auf den Umfang. *(geprüft 2026-08-10)*

**[PP-312b05]** *(Vertiefung «Mehr lesen» · Ozeantaugliche Schiffe)*
Der portugiesische Prinz Heinrich der Seefahrer liess im 15. Jahrhundert systematisch Küsten erkunden, Karten sammeln und Schiffe verbessern. So entstand die Karavelle, die mit ihren dreieckigen Segeln auch gegen den Wind kreuzen konnte. Damit wagten sich Seeleute erstmals planmässig auf offene Ozeanrouten, auf denen man wochenlang kein Land sah und nach Sternen und Kompass steuerte. Dabei war Europa spät dran. Die chinesischen Flotten des Admirals Zheng He waren schon Jahrzehnte zuvor mit Schiffen bis Ostafrika gesegelt, gegen die eine Karavelle winzig wirkte. Doch der Kaiserhof brach die teuren Fahrten ab und verbot die Hochseefahrt. In Europa dagegen konkurrierten viele Königreiche. Wer eine neue Route fand, wurde reich, also rüsteten alle weiter. So entschied nicht das beste Schiff über den Lauf der Geschichte, sondern die Frage, welche Gesellschaft ihre Schiffe wohin schickte und wozu.

> **Belegt** («Prinz Heinrich der Seefahrer»): [Heinrich der Seefahrer (Wikipedia)](https://de.wikipedia.org/wiki/Heinrich_der_Seefahrer) — «Heinrich der Seefahrer … war Initiator, Schirmherr und Auftraggeber der portugiesischen Entdeckungsreisen in der ersten Hälfte des 15. Jahrhunderts. Die von ihm initiierten Entdeckungsfahrten entlang der westafrikanischen Küste begründeten» den portugiesischen Seeweg nach Süden. *(geprüft 2026-08-10)*

> **Belegt** («Flotten des Admirals Zheng He»): [Zheng He (Wikipedia)](https://de.wikipedia.org/wiki/Zheng_He) — «Zheng He … war ein chinesischer Admiral. Zheng He unternahm mit grossen Flotten zwischen 1405 und 1433 von der ostchinesischen Stadt Nanjing aus sieben grosse Expeditionen in den Pazifik und den Indischen Ozean.» Die Jahre 1405 bis 1433 liegen vor Heinrichs Fahrten, was das «Jahrzehnte zuvor» im Text stützt. *(geprüft 2026-08-10)*

**[PP-dca913]** *(Vertiefung «Mehr lesen» · Die Erde wird vermessen)*
Eratosthenes leitete die berühmte Bibliothek von Alexandria und trug den Spitznamen «Beta», weil er in vielen Fächern der Zweitbeste war, in keinem der Erste. Er wusste aus Berichten, dass die Mittagssonne im südlichen Syene zur Sommersonnenwende senkrecht steht, während sie in Alexandria zur selben Stunde um ein Fünfzigstel eines Vollkreises schräg einfällt. Also brauchte er nur noch die Distanz zwischen beiden Städten, die geschulte Schrittzähler abgemessen hatten, und multiplizierte sie mit fünfzig. Je nach angenommener Länge des antiken Längenmasses lag sein Ergebnis nur wenige Prozent neben dem heutigen Wert. Ausgerechnet Kolumbus rechnete anderthalb Jahrtausende später mit einem viel zu kleinen Erdumfang, sonst hätte er die Fahrt nach Westen wohl nie gewagt. Gute Messungen können Weltbilder tragen und falsche können Weltgeschichte machen.

> **Belegt** («leitete die berühmte Bibliothek von Alexandria und trug den Spitznamen»): [Eratosthenes (Wikipedia)](https://de.wikipedia.org/wiki/Eratosthenes) — «Im Auftrag der ägyptischen Könige aus der Dynastie der Ptolemäer leitete er rund ein halbes Jahrhundert lang die Bibliothek von Alexandria, die bedeutendste Bibliothek der Antike.» Und zum Spitznamen: «Auch der Spitzname Beta – ‹der Zweite› im Sinne von ‹zweitrangig› – war gebräuchlich.» Die Begründung «in vielen Fächern der Zweitbeste, in keinem der Erste» gehört bei der Quelle genau genommen zum zweiten Spitznamen «Fünfkämpfer»; beide standen für dasselbe Urteil. *(geprüft 2026-08-11)*

> **Belegt** («rechnete anderthalb Jahrtausende später mit einem viel zu kleinen Erdumfang»): [Christoph Kolumbus (Wikipedia)](https://de.wikipedia.org/wiki/Christoph_Kolumbus) — «Da er zudem für die Entfernung zwischen den Längengraden eine zu kleine Zahl annahm, erhielt er einen Abstand von unter 4.500 km zwischen den Kanaren und Japan. Der wirkliche Abstand beträgt fast 20.000 km, doch aufgrund seiner falschen Zahlen hielt Kolumbus die von ihm später entdeckten Inseln in der Karibik für dem chinesischen Festland nahe.» *(geprüft 2026-08-11)*

**[PP-7c7442]** *(Kartentext · Grenzenloser Welthandel)*
Container, Freihandelsabkommen und das Internet verflechten die Weltwirtschaft fast grenzenlos: Waren, Kapital und Daten zirkulieren rund um den Planeten. Es ist die jüngste und dichteste Form der Globalisierung.

### Thema 02 · Die acht Epochen

**[EP-a1d2b4]** *(Einleitung, Vertiefung · Antike)*
«Antike» ist ein Sammelname für weit über tausend Jahre, von etwa 800 v. Chr. bis zum Ende des Römischen Reiches im Westen um 500 n. Chr. In dieser Zeit entsteht überraschend viel, was uns heute normal vorkommt: Abstimmungen, Gesetze, die man nachlesen kann, das Theater, die Geometrie, die Philosophie. Trotzdem war das keine gerechte Welt. Die schwere Arbeit machten zu einem grossen Teil Sklaven, Frauen durften nicht mitbestimmen, und wenn die alten Texte «alle Bürger» sagen, sind damit nur die freien Männer der Stadt gemeint. Geblieben ist eine Idee: Man kann die Welt selber verstehen und nachprüfen, statt sie einfach hinzunehmen.

**[EP-d33896]** *(Vertiefung «Mehr lesen» · Antike)*
Wie das im Alltag aussah, zeigt Athen. Solons Gesetze standen auf hölzernen Tafeln, die drehbar an Pflöcken befestigt waren, etwa wie ein Kartenständer und jeder konnte sie einsehen. Wer lesen konnte, war nicht mehr darauf angewiesen, dass ihm jemand vorlas und dabei die Wahrheit sagte, sondern konnte selber nachschauen, was gilt. Auf der Agora wurde dann darüber gestritten. Im Hafen Piräus prüften Händler Verträge und zahlten mit den silbernen «Eulen», wie man Athens Münzen nach ihrem Münzbild nannte. Das Silber dafür kam aus den Bergwerken von Laurion. Als dort ab 483 v. Chr. mehr Silber anfiel, wollten die Athener den Überschuss unter sich aufteilen. Themistokles überzeugte sie, davon Kriegsschiffe zu bauen. Wenige Jahre später retteten genau diese Schiffe die Stadt gegen die Perser. Und noch etwas verschob sich: Wer schreiben und rechnen konnte, kam voran, auch ohne vornehme Familie. Nicht mehr nur die Herkunft zählte, sondern das Können.

> **Belegt** («drehbar an Pflöcken befestigt waren»): [Solon (Wikipedia)](https://de.wikipedia.org/wiki/Solon) — Abschnitt «Solons Gesetzgebung»: Das Gesetzeswerk wurde auf Holztafeln (Axones) gesichert, «in der Art heutiger Postkartenständer drehbar an Pflöcken befestigt». Aufbewahrt wurden sie im Prytaneion. Darum nennt der Lernset-Text keinen Ort. *(geprüft 2026-07-29)*

> **Belegt** («nach ihrem Münzbild nannte»): [Altgriechische Münzen (Wikipedia)](https://de.wikipedia.org/wiki/Altgriechische_M%C3%BCnzen) — Zu den Münzbildern: «Lange blieben die Münzen aus Aigina («Schildkröten» genannt) sowie die aus Korinth («Fohlen») und Athen («Eulen»)» die beherrschenden Zahlungsmittel des frühen Griechenland. *(geprüft 2026-07-29)*

> **Belegt** («wollten die Athener den Überschuss unter sich aufteilen»): [Perserkriege (Wikipedia)](https://de.wikipedia.org/wiki/Perserkriege) — Zur Vorgeschichte von Salamis: «man sich von Themistokles überzeugen liess, Überschusseinnahmen aus dem Silberabbau in Laurion von 483 v. Chr. an nicht unter die Bürger zu verteilen, sondern in den Schiffsbau zu investieren». *(geprüft 2026-07-29)*

**[EP-94e98f]** *(Kartentext · Antike)*
Wer seine Stellung von Geburt hatte, verliert den Boden. In Athen (ab etwa 500 v. Chr.) und in Rom entscheiden Abstimmungen, Ämter und öffentliche Reden, nicht mehr allein die Familie. Wer gut reden kann, kommt nach oben. Genau da setzen die Sophisten an. Sie ziehen von Stadt zu Stadt und bringen jungen Männern gegen Bezahlung bei, wie man eine Rede aufbaut und ein Publikum überzeugt. Ihre Kernbotschaft ist heikel: Zu jeder Sache lässt sich genauso gut das Gegenteil begründen. Damit steht eine unangenehme Frage im Raum: Wenn sich alles begründen lässt, gilt dann überhaupt noch etwas? Der Prozess gegen Sokrates (399 v. Chr.), der mit dem Todesurteil endet, zeigt, wie nervös eine verunsicherte Stadt reagiert.

**[EP-54ba47]** *(Vertiefung «Mehr lesen» · Antike)*
Aristoteles sammelte zuerst und ordnete dann. In einer Lagune auf der Insel Lesbos untersuchte er Fische, Kraken und Seeigel und beschrieb, wie sie gebaut sind. Seine Schule trug die Verfassungen von 158 griechischen Städten zusammen. In Athen unterrichtete er im Lykeion; nach dessen Wandelhalle, dem «Peripatos», wurde seine Schule später benannt. Aus dem vielen Material zog er Regeln des Schliessens. Ein Beispiel: Alle Menschen sind sterblich. Sokrates ist ein Mensch. Also ist Sokrates sterblich. Das stimmt, egal wer es sagt, egal wie sympathisch oder mächtig diese Person ist. Genau das war die Antwort an die Redekünstler: Ein Schluss stimmt oder stimmt nicht, geschicktes Reden ändert daran nichts. Über arabische Gelehrte und mittelalterliche Klosterschulen kam diese Haltung bis in unsere Schulzimmer.

> **Belegt** («die Verfassungen von 158 griechischen Städten»): [Aristoteles (Wikipedia)](https://de.wikipedia.org/wiki/Aristoteles) — «Die Fülle des Materials, das Aristoteles sammelte (etwa zu den 158 Verfassungen der griechischen Stadtstaaten), lässt darauf schliessen, dass er über zahlreiche Mitarbeiter verfügte.» Vorher stand hier «Gesetze von über 150 Städten». Gesammelt wurden Verfassungen, das erhaltene Stück heisst «Die Verfassung der Athener». *(geprüft 2026-08-05)*

> **Belegt** («nach dessen Wandelhalle»): [Peripatos (Wikipedia)](https://de.wikipedia.org/wiki/Peripatos) — Der Schulname kommt vom Ort: «leitet sich ihr Name von dem Ort ab, an dem der Unterricht stattfand, in diesem Fall vom Peripatos (Wandelhalle)». Die Herleitung vom Herumwandeln beim Lehren, die vorher hier stand, nennt der Artikel eine populäre Etymologie, die «daher nicht zu[trifft]». *(geprüft 2026-08-05)*

**[EP-8cc8f0]** *(Kartentext · Zerbrechen der Ordnung)*
Unten ziehen zahlreiche Krieger gemeinsam an einem Seil, um das Standbild zu Fall zu bringen. Die alte Weltordnung stürzt nicht von selbst. Sie wird von vielen Händen aktiv niedergerissen: Geschichte als Werk von Menschen, nicht von Schicksal.

**[EP-cc795b]** *(Im Kontext der Zeit · Zerbrechen der Ordnung)*
Champaignes Augustinus verkörpert die Antwort auf einen epochalen Schock. Als Rom 410 fiel und mit dem Reich für viele die Weltordnung selbst zusammenbrach, verlegte Augustinus den Halt vom äusseren Reich ins Innere des Menschen und in den Glauben: Wahrheit und Orientierung findet man nicht mehr in der vergänglichen Macht, sondern in Gewissen, Erinnerung und Zuwendung zu Gott. Diese nach innen gewandte Ordnung prägte das Abendland ein Jahrtausend lang.

**[EP-112f69]** *(Vertiefung «Mehr lesen» · Zerbrechen der Ordnung)*
Rom selbst zeigt den Absturz in Zahlen: Die Stadt zählte auf ihrem Höhepunkt gegen eine Million Einwohnerinnen und Einwohner und schrumpfte nach Kriegen und Plünderungen auf wenige Zehntausend. Als die Ostgoten die Stadt 537 belagerten, zerstörten sie die Wasserleitungen. Brunnen und Thermen versiegten und das Leben zog sich auf Dauer ans Ufer des Tibers zurück, wo man Wasser holen konnte. Die gewaltige Betonkuppel des Pantheons blieb über tausend Jahre unübertroffen: Niemand hätte sie mehr bauen können. Zur gleichen Zeit begann die Rettung im Kleinen. Der Gelehrte Cassiodorus gründete um 550 in Süditalien das Kloster Vivarium, in dem Mönche antike Handschriften abschrieben und bald gehörte dieses Kopieren in vielen Klöstern zum Tagewerk. Was wir heute von Cicero oder Vergil lesen, ist fast ausnahmslos durch solche Schreibstuben gegangen. Eine Zivilisation kann eben nicht nur Neues erfinden, sie kann Können auch wieder verlieren.

> **Belegt** («zerstörten sie die Wasserleitungen»): [Wasserversorgung im Römischen Reich (Wikipedia)](https://de.wikipedia.org/wiki/Wasserversorgung_im_R%C3%B6mischen_Reich) — Zur Belagerung Roms: «Bei der vorangegangenen Belagerung wurden die in die Stadt führenden Aquädukte zerstört», worauf der Betrieb der grossen Thermen endgültig zum Erliegen kam und auch die städtischen Mühlen ausfielen. Datierung und Zuordnung zu den Ostgoten (Januar 537 bis März 538) über den Artikel «Gotenkrieg (535–554)». *(geprüft 2026-07-29)*

**[EP-9d34d6]** *(Kartentext · Zerbrechen der Ordnung)*
Betroffen sind alle, besonders die städtischen Eliten: Wer sich auf Rom und seine Ordnung verlassen hatte, steht plötzlich ohne Schutz da. Nach der Plünderung Roms 410 durch die Westgoten geben viele den Christen die Schuld. Sie hätten mit dem Abfall von den alten Göttern das Unglück heraufbeschworen.

**[EP-ddde72]** *(Vertiefung «Mehr lesen» · Zerbrechen der Ordnung)*
Wie tief der Schock sass, zeigt der Gelehrte Hieronymus, der fern in Bethlehem an seiner Bibelübersetzung arbeitete: Als ihn die Nachricht erreichte, schrieb er, die Stimme stocke ihm und vor Schluchzen könne er nicht weiterdiktieren: Eingenommen sei die Stadt, die zuvor die ganze Welt besiegt hatte. Übers Meer flohen ausgeplünderte Senatorenfamilien nach Nordafrika, wo manche als Bittsteller in Hippo ankamen, der Bischofsstadt des Augustinus. Dort hörte er beide Vorwürfe: Die Anhänger der alten Götter gaben dem Christengott die Schuld und die Christen fragten, warum er sie nicht geschützt hatte. Augustinus antwortete nicht mit einer schnellen Streitschrift, sondern arbeitete von 413 bis 426 an den zweiundzwanzig Büchern seines «Gottesstaats». Dass eine Katastrophe sofort einen Schuldigen braucht, hat sich seither kaum geändert, es wechseln nur die Adressaten.

> **Belegt** («die Stimme stocke ihm»): [Plünderung Roms (410) (Wikipedia)](https://de.wikipedia.org/wiki/Pl%C3%BCnderung_Roms_(410)) — Wörtlich zu Hieronymus' Reaktion: «Die Stimme stockt mir und vor Schluchzen kann ich nicht weiterdiktieren: Die Stadt Rom ist eingenommen, die zuvor die ganze Welt besiegt hatte.» Der Artikel weist die Stelle als Briefe 127,12 nach. *(geprüft 2026-08-05)*

> **Belegt** («fern in Bethlehem an seiner Bibelübersetzung arbeitete»): [Vulgata (Wikipedia)](https://de.wikipedia.org/wiki/Vulgata) — «Nach dem Tod des Papstes 384 siedelte Hieronymus nach Bethlehem über und wandte sich der Übersetzung des Alten Testaments zu.» Der Artikel «Hieronymus (Kirchenvater)» ergänzt, dass die von ihm geleitete Gruppe sich in Bethlehem niederliess, wo Paula ein Kloster finanzierte: «Hier konnte sich Hieronymus seiner bibelwissenschaftlichen Arbeit widmen.» *(geprüft 2026-08-05)*

**[EP-5455c7]** *(Kartentext · Aufklärung)*
Im Vordergrund kentern Schiffe in der heranrollenden Welle. Wer dem Beben und dem Feuer entkam, den holte oft das Wasser. Das Bild bündelt die Erfahrung, dass keine menschliche Ordnung und kein Gebet vor der blinden Gewalt der Natur schützt.
