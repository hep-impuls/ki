# Quellenauftrag · Lernseite 2 «Eine ganz neue Partnerschaft»

**Paket 07 von 8.** Dieses Dokument enthält 35 Textblöcke eines Lernsets zu
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


## Paket 07 von 8

Jeder Block hier enthält eine prüfbare Behauptung (Zahl, Datum,
Superlativ oder eine Aussage, die jemandem zugeschrieben wird). Deutende
Passagen sind bewusst nicht dabei. Geh die 35 Blöcke einzeln durch.

### Thema 01 · Vorhang auf

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

**[VA-534970]** *(Vertiefung «Mehr lesen» · wahrscheinlichkeitsbasiert)*
Fachleute nennen diese Zahlencodes Vektoren, und sie haben nicht zwei oder drei Dimensionen, sondern sehr viele. Wie viele es sind, hängt vom Modell ab, oft einige hundert bis einige tausend; die Informatikerin Katharina Zweig nennt als Grössenordnung rund 13'000 Richtungen. Einzelne Richtungen lassen sich dabei nicht als je ein ablesbarer Bedeutungsanteil verstehen, erst ihr Zusammenspiel ergibt die Lage eines Wortteils im jeweiligen Satz. Der Philosoph Markus Gabriel nennt diesen Vorgang Vektorisierung und betont, dass die KI dabei nur mit Mustern und Wahrscheinlichkeiten rechnet, ohne wirklich zu verstehen. Wie mutig die KI beim Auswählen dann würfelt, regelt eine Einstellung namens Temperatur. Ein hoher Wert macht die Antworten kreativer und unberechenbarer, ein niedriger vorhersehbarer. Das erklärt auch, warum dieselbe Frage zweimal ganz verschieden beantwortet werden kann.

**[VA-3dbf88]** *(Kartentext · generalisierend)*
Hat eine KI tausende Katzenfotos gesehen, erkennt sie auch eine Katze auf einem Bild, das ihr völlig neu ist. Sie überträgt Gelerntes auf Neues. Aus vielen einzelnen Beispielen zieht sie eine allgemeine Regel. So kann sie sogar Sätze sinnvoll fortsetzen, die noch nie jemand geschrieben hat. Genau das unterscheidet echtes Lernen vom reinen Auswendiglernen.

**[VA-251f64]** *(Kartentext · adaptiv)*
Schreibst du locker und mit Emojis, antwortet die KI oft ebenso locker. Sie passt sich an, an deinen Ton, deine Beispiele und deine Korrekturen. Sagst du «bitte kürzer», wird die nächste Antwort kürzer. Wichtig ist dabei ein Unterschied: Im laufenden Gespräch stellt sie sich auf dich ein, dazulernen tut sie dabei nicht. Ob deine Eingaben später ins Training einfliessen, hängt vom Anbieter, vom Produkt und von deinen Einstellungen ab.

**[VA-02ccbc]** *(Kartentext · Rechen- und Speicherkapazität)*
Leistungsfähige KI braucht sehr viele spezielle Computerchips, Server und Speicher. Diese Anlagen sind teuer und stehen nur wenigen grossen Unternehmen und Staaten zur Verfügung. Wer diese Rechenkraft besitzt, hat einen grossen Vorsprung. So entsteht eine Abhängigkeit von einigen wenigen Anbietern.

**[VA-921987]** *(Kartentext · Arbeitsmarkt)*
KI verändert die Arbeitswelt spürbar. Sie übernimmt vor allem einzelne Aufgaben, selten gleich einen ganzen Beruf. Manche Tätigkeiten fallen weg, andere verändern sich, und neue kommen dazu. Für viele Berufe bedeutet das neue Anforderungen und neues Lernen.

**[VA-225dcb]** *(Kartentext · Kultureller Bias und Technikverständnis)*
KI lernt aus Texten, die oft aus dem englischsprachigen und westlichen Raum stammen. Darum gibt sie häufig westliche Sprachen, Werte und Sichtweisen wieder. Andere Kulturen verstehen Technik, Gemeinschaft und Privatsphäre aber teils ganz anders. «West» und «Ost» sind dabei keine festen Blöcke, sondern grobe Vereinfachungen.

### Thema 02 · Philosophische Perspektive

**[PP-ff5fc3]** *(Kartentext · Die KI stellt diese Frage neu und dringlich)*
Wörtlich wird «Was ist der Mensch?» laut Google Trends kaum häufiger gesucht als früher. Aber in unzähligen Reden und Texten über KI kehrt die Frage in konkreter Form wieder. Müssen wir überhaupt noch selbst denken und schreiben? Wie verändert uns die tägliche Nutzung? Und welche Rolle bekommen wir neben der Maschine, eher anleitend, prüfend und verantwortend statt ausführend? So taucht die alte philosophische Frage nach dem Menschen mitten im Alltag neu auf.

**[PP-f89d1d]** *(Kartentext · Sie gibt keine Rezepte, sondern Orientierung)*
Philosophie liefert keine Bedienungsanleitung und keine Prognose. Sie ordnet Begriffe, deckt verborgene Annahmen auf und wägt Gründe ab. So hilft sie zu klären, worüber wir eigentlich streiten. Hegels Bild der «Eule der Minerva» oben sagt, dass Verstehen oft erst im Rückblick kommt. Genau dieses Begreifen brauchen wir aber, um die Gegenwart zu gestalten.

**[PP-d95ea2]** *(Fliesstext · Der Teppich des Wandels)*
Der Teppich zeigt Ereignisse, die technologisch, gesellschaftlich, kulturell oder erfinderisch sind. Sie bilden vier Fäden, die nebeneinander durch die Zeit laufen, von Pflug, Rad und Schrift bis zur KI. Das Entscheidende ist ihre Wechselwirkung, denn sie hängen voneinander ab. Eisenbahn und Schifffahrt etwa hätten sich nie so verbreitet, wenn nicht auch kulturell das Interesse bestanden hätte, zu reisen, Handel zu treiben und neue Länder zu besitzen.

**[PP-94d15d]** *(Vertiefung «Mehr lesen» · Der Fall Roms)*
Rom galt als die ewige Stadt, seit rund achthundert Jahren hatte kein Feind sie eingenommen, dann standen 410 die Westgoten unter Alarich drei Tage lang plündernd in ihren Strassen. Die Nachricht lief durch das ganze Reich, der Gelehrte Hieronymus schrieb aus Bethlehem, mit dieser einen Stadt scheine der ganze Erdkreis unterzugehen. Der eigentliche Schlusspunkt kam leise, 476 setzte der Heerführer Odoaker den letzten weströmischen Kaiser ab, einen Jungen namens Romulus Augustulus, und schickte die Kaiserinsignien nach Konstantinopel. Viele Menschen merkten zunächst kaum einen Unterschied, doch über Jahrzehnte zerfielen Strassen, Wasserleitungen und Verwaltung, Städte schrumpften, Wissen ging verloren. Der Fall Roms zeigt, dass grosse Ordnungen selten mit einem Knall enden, sondern in einem langen Ausfransen, das die Menschen erst im Rückblick als Epochenbruch erkennen.

**[PP-a89d23]** *(Kartentext · Zweiter Weltkrieg)*
Der industrialisierte Krieg und die Schoah erschüttern den Glauben an den Fortschritt im Kern. Zugleich treibt der Krieg Technologien voran, etwa Radar, Rakete und Computer.

**[PP-aaac3a]** *(Vertiefung «Mehr lesen» · Die Schrift)*
Am Anfang standen Zählsteine und Ritzzeichen, mit denen Tempelverwalter in Uruk festhielten, wer wie viel Gerste oder wie viele Schafe abgeliefert hatte. Aus den Bildzeichen wurde die Keilschrift, in feuchten Ton gedrückt, und mit ihr entstand ein neuer Beruf, der Schreiber, der seine Kunst in jahrelanger Schule lernte und damit zu einer kleinen Elite gehörte. Bald speicherte die Schrift nicht mehr nur Vorräte, sondern Verträge, Gesetze wie die Stele des Hammurabi und Geschichten wie das Gilgamesch-Epos, das älteste grosse Erzählwerk der Menschheit. Interessant ist, dass schon damals gewarnt wurde, Platon überliefert die Sorge, wer schreibe, verlasse sich auf tote Zeichen und übe sein Gedächtnis nicht mehr. Die Klage klingt vertraut, sie begleitet seither jede Technik, die dem Kopf Arbeit abnimmt, vom Taschenrechner bis zur KI.

**[PP-f56548]** *(Vertiefung «Mehr lesen» · Ozeantaugliche Schiffe)*
Der portugiesische Prinz Heinrich der Seefahrer liess im 15. Jahrhundert systematisch Küsten erkunden, Karten sammeln und Schiffe verbessern, so entstand die Karavelle, die mit ihren dreieckigen Segeln auch gegen den Wind kreuzen konnte. Damit wagten sich Seeleute erstmals planmässig auf offene Ozeanrouten, auf denen man wochenlang kein Land sah und nach Sternen und Kompass steuerte. Dabei war Europa spät dran, die chinesischen Flotten des Admirals Zheng He waren schon Jahrzehnte zuvor mit Schiffen bis Ostafrika gesegelt, gegen die eine Karavelle winzig wirkte, doch der Kaiserhof brach die teuren Fahrten ab und verbot die Hochseefahrt. In Europa dagegen konkurrierten viele Königreiche, wer eine neue Route fand, wurde reich, also rüsteten alle weiter. So entschied nicht das beste Schiff über den Lauf der Geschichte, sondern die Frage, welche Gesellschaft ihre Schiffe wohin schickte und wozu.

**[PP-adee46]** *(Vertiefung «Mehr lesen» · Die Erde wird vermessen)*
Eratosthenes leitete die berühmte Bibliothek von Alexandria und trug den Spitznamen «Beta», weil er in vielen Fächern der Zweitbeste war, in keinem der Erste. Er wusste aus Berichten, dass die Mittagssonne im südlichen Syene zur Sommersonnenwende senkrecht steht, während sie in Alexandria zur selben Stunde um ein Fünfzigstel eines Vollkreises schräg einfällt. Also brauchte er nur noch die Distanz zwischen beiden Städten, die geschulte Schrittzähler abgemessen hatten, und multiplizierte sie mit fünfzig. Je nach angenommener Länge des antiken Längenmasses lag sein Ergebnis nur wenige Prozent neben dem heutigen Wert. Ausgerechnet Kolumbus rechnete anderthalb Jahrtausende später mit einem viel zu kleinen Erdumfang, sonst hätte er die Fahrt nach Westen wohl nie gewagt. Gute Messungen können Weltbilder tragen, und falsche können Weltgeschichte machen.

**[PP-7c7442]** *(Kartentext · Grenzenloser Welthandel)*
Container, Freihandelsabkommen und das Internet verflechten die Weltwirtschaft fast grenzenlos: Waren, Kapital und Daten zirkulieren rund um den Planeten. Es ist die jüngste und dichteste Form der Globalisierung.

### Thema 02 · Die acht Epochen

**[EP-9f86f4]** *(Einleitung, Vertiefung · Antike)*
«Antike» meint hier rund tausend Jahre, vom klassischen Athen des 5. Jahrhunderts v. Chr. bis zum Ende des Weströmischen Reiches. In dieser Zeit entstehen zentrale Bausteine unserer Welt: Demokratie und Republik, das geschriebene Recht, die Philosophie, die Geometrie, das Theater. Vieles davon war an Sklaverei und den Ausschluss von Frauen gebunden. Die Idee der Gleichheit galt nur einem kleinen Kreis. Und doch stammt von hier die Grundüberzeugung, dass sich die Welt mit dem Verstand ordnen und begründen lässt.

**[EP-07de36]** *(Kartentext · Antike)*
Zwei Erfindungen tragen den Wandel. Die griechische Alphabetschrift (ab etwa 800 v. Chr.) kommt mit rund zwei Dutzend Zeichen aus. Lesen und Schreiben sind nicht mehr Sache einer Priesterkaste. Und gemünztes Geld (in Kleinasien und Griechenland ab dem 7./6. Jahrhundert v. Chr.) macht Werte zählbar, teilbar und übertragbar, unabhängig von Person und Stand. Durchsetzen konnten sie sich, weil eine see- und handelstreibende Welt Aufzeichnungen, Verträge und ein verlässliches Tauschmittel brauchte: Das Alphabet entstand aus der Handelsschrift der Phönizier, das Silber für die Münzen kam aus Bergwerken wie dem attischen Laurion.

**[EP-1de6e6]** *(Vertiefung «Mehr lesen» · Antike)*
Aristoteles war zuerst Sammler und dann Systematiker: In der Lagune von Pyrrha auf Lesbos untersuchte er Fische, Kraken und Seeigel, und seine Schule trug die Verfassungen von über 150 griechischen Städten zusammen. In Athen lehrte er im Lykeion, der Überlieferung nach oft im Umhergehen, weshalb man seine Schüler «Peripatetiker» nannte, die Umherwandelnden. Aus dem vielen Material destillierte er Regeln des Schliessens: Wenn alle Menschen sterblich sind und Sokrates ein Mensch ist, dann ist Sokrates sterblich, und das gilt unabhängig davon, wer es ausspricht. Genau darin lag die Spitze gegen die Redekünstler, denn ein Schluss stimmt oder stimmt nicht, Charme ändert daran nichts. Diese Haltung wanderte über arabische Gelehrte und mittelalterliche Klosterschulen bis in unsere Schulzimmer, und noch jede Prüfung, die eine Begründung verlangt, steht in ihrer Tradition.

**[EP-8cc8f0]** *(Kartentext · Zerbrechen der Ordnung)*
Unten ziehen zahlreiche Krieger gemeinsam an einem Seil, um das Standbild zu Fall zu bringen. Die alte Weltordnung stürzt nicht von selbst. Sie wird von vielen Händen aktiv niedergerissen: Geschichte als Werk von Menschen, nicht von Schicksal.

**[EP-cc795b]** *(Im Kontext der Zeit · Zerbrechen der Ordnung)*
Champaignes Augustinus verkörpert die Antwort auf einen epochalen Schock. Als Rom 410 fiel und mit dem Reich für viele die Weltordnung selbst zusammenbrach, verlegte Augustinus den Halt vom äusseren Reich ins Innere des Menschen und in den Glauben: Wahrheit und Orientierung findet man nicht mehr in der vergänglichen Macht, sondern in Gewissen, Erinnerung und Zuwendung zu Gott. Diese nach innen gewandte Ordnung prägte das Abendland ein Jahrtausend lang.

**[EP-770409]** *(Vertiefung «Mehr lesen» · Zerbrechen der Ordnung)*
Rom selbst zeigt den Absturz in Zahlen: Die Stadt, die auf ihrem Höhepunkt gegen eine Million Einwohner zählte, schrumpfte nach Kriegen und Plünderungen auf wenige Zehntausend. Als belagernde Goten im Jahr 537 die grossen Wasserleitungen kappten, versiegten Brunnen und Thermen, und auf Dauer zog sich das Leben der geschrumpften Stadt ans Ufer des Tibers zurück. Die gewaltige Betonkuppel des Pantheons blieb über tausend Jahre unübertroffen, niemand hätte sie mehr bauen können. Zur gleichen Zeit begann die Rettung im Kleinen: Der Gelehrte Cassiodorus gründete um 550 in Süditalien das Kloster Vivarium, in dem Mönche antike Handschriften abschrieben, und bald gehörte das Kopieren in vielen Klöstern zum Tagewerk. Was wir heute von Cicero oder Vergil lesen, ist fast ausnahmslos durch solche Schreibstuben gegangen. Eine Zivilisation kann eben nicht nur Neues erfinden, sie kann Können auch wieder verlieren.

**[EP-9d34d6]** *(Kartentext · Zerbrechen der Ordnung)*
Betroffen sind alle, besonders die städtischen Eliten: Wer sich auf Rom und seine Ordnung verlassen hatte, steht plötzlich ohne Schutz da. Nach der Plünderung Roms 410 durch die Westgoten geben viele den Christen die Schuld. Sie hätten mit dem Abfall von den alten Göttern das Unglück heraufbeschworen.

**[EP-517312]** *(Vertiefung «Mehr lesen» · Zerbrechen der Ordnung)*
Wie tief der Schock sass, zeigt der Gelehrte Hieronymus, der fern in Bethlehem an seiner Bibelübersetzung arbeitete: Als ihn die Nachricht erreichte, schrieb er, mit dieser einen Stadt sei der ganze Erdkreis untergegangen, und er fand tagelang nicht zur Arbeit zurück. Übers Meer flohen ausgeplünderte Senatorenfamilien nach Nordafrika, wo manche als Bittsteller in Hippo ankamen, der Bischofsstadt des Augustinus. Dort hörte er beide Vorwürfe: Die Anhänger der alten Götter gaben dem Christengott die Schuld, und die Christen fragten, warum er sie nicht geschützt hatte. Augustinus antwortete nicht mit einer schnellen Streitschrift, sondern arbeitete von 413 bis 426 an den zweiundzwanzig Büchern seines «Gottesstaats». Dass eine Katastrophe sofort einen Schuldigen braucht, hat sich seither kaum geändert, es wechseln nur die Adressaten.

**[EP-5455c7]** *(Kartentext · Aufklärung)*
Im Vordergrund kentern Schiffe in der heranrollenden Welle. Wer dem Beben und dem Feuer entkam, den holte oft das Wasser. Das Bild bündelt die Erfahrung, dass keine menschliche Ordnung und kein Gebet vor der blinden Gewalt der Natur schützt.

**[EP-269c62]** *(Einleitung · «Ende der Geschichte»)*
Der Kalte Krieg endet, der Markt scheint zu siegen, und im Überfluss der Möglichkeiten geht die Orientierung gerade dann verloren. Mit dem Fall der Mauer glauben viele, die grossen Konflikte seien vorbei und die liberale Demokratie habe endgültig gewonnen. Doch statt Ruhe kommen Beschleunigung, Vereinzelung und das Gefühl, in lauter Möglichkeiten den Halt zu verlieren.

**[EP-6db558]** *(Im Kontext der Zeit · «Ende der Geschichte»)*
Das Foto zeigt den Kipp-Punkt der Epoche «Ende der Geschichte»: Ein ganzes System verschwindet friedlich, fast über Nacht. Was als Triumph der Freiheit gefeiert wurde, war für viele Biografien im Osten zugleich ein Boden-Verlust. Beides gehört zur Verunsicherung dieser Jahre.

**[EP-ba374a]** *(Kartentext · Jetzt: Umwelt & KI)*
Oben und an den Rändern hängen die Menschen: Programmiererinnen, Künstler, Kabelhersteller, Nutzerinnen. Viele Hände ziehen an denselben Fäden. Das «Wir» von heute ist keine Person, sondern ein Geflecht aus vielen, oft einander unbekannten Beteiligten.

### Thema 02 · Wege der Orientierung

**[DW-8c01fb]** *(Fliesstext · Netzwerke und Systeme)*
Moderne Gesellschaften sind unübersichtlich geworden. Niemand überblickt mehr das Ganze, nicht die Wirtschaft, nicht die Verwaltung, nicht die Technik. Aus dem Gefühl, den Überblick verloren zu haben, entsteht schnell Überforderung. Und doch funktioniert erstaunlich vieles: Der Zug fährt, der Lohn kommt, das Spital behandelt. Wie geht das zusammen? Hier helfen zwei Denker, die die Gesellschaft nicht bewerten, sondern erklären.

**[DW-3c0f3b]** *(Zur Philosophie · Transformation von Mensch und Maschine)*
Yasuo Deguchi ist Philosophieprofessor an der Universität Kyoto und verbindet westliches mit ostasiatischem Denken. Mit seiner «We-Turn»-Philosophie verlegt er das Handeln vom einzelnen «Ich» auf ein «Wir»: Niemand kann etwas ganz allein, jede Handlung wird von vielen getragen, von Menschen, Dingen und heute auch von Maschinen. Der eigentliche Handelnde ist deshalb kein einsames Ich, sondern ein «Selbst als Wir», zu dem die KI dazugehört. Er stützt sich dabei auf einen alten buddhistischen Gedanken, das «abhängige Entstehen»: Nichts besteht für sich allein, alles entsteht wechselseitig. Das entlastet: Verantwortung verteilt sich auf ein «Wir» mit verschiedenen Rollen, statt ganz auf den Schultern eines einzelnen Ich zu liegen.
