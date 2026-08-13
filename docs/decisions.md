# Entscheidungen

Wichtige Sprach-, Design- und Inhalts-Entscheidungen für die *Lernumgebung zu
KI*. Jüngste Einträge oben. Format: kurzes Datum + ein Absatz Entscheidung,
optional eine Liste betroffener Stellen.

Wenn etwas geändert oder neu festgelegt wird, das nicht aus dem Code allein
ersichtlich ist (Sprachregelungen, Naming, didaktische Linie, Design-Prinzipien,
Verzicht auf Features) — hier festhalten.

---

## 2026-08-11 — «Wege der Orientierung» bleibt vorerst ohne Belege (Christof)

Beim Ergänzen der Hegel-Karte kam heraus: Die Denker-Karten **und** die
Abschnitts-Absätze in `philosophische-perspektive/_components/Denkwege.tsx`
laufen über `InfoText`, nicht über `GlossarText`. `InfoText` zeichnet
ausschliesslich die mitgegebenen Karten-Begriffe aus (`begriffe`,
`absatzBegriffe`) und kennt weder das globale Glossar noch die Belege.

**Folge:** In diesem Abschnitt kann keine Quelle erscheinen, und es gibt dort
auch keine — null Belege mit `DW`-Kennung, während der Teppich des Wandels 164
trägt. Das ist kein Versehen und soll nicht «repariert» werden.

**Entscheid:** So lassen. Ein Umbau auf `GlossarText` würde das ganze Glossar
(239 Begriffe) in diese Texte hineinziehen, bräuchte eine eigene
Kollisionsrunde und würde die feiner gesetzten Karten-Begriffe überlagern. Der
Nutzen wäre gering, weil die Philosophie-Texte Positionen referieren und keine
prüfbaren Einzelfakten behaupten.

**Woran sich der Inhalt trotzdem hält:** Die Aussagen der Hegel-Karte sind an
der deutschen Wikipedia geprüft («Bestimmte Negation» belegt Hegels Prägung des
Begriffs und die Aufnahme durch Marx' Ideologiekritik und die Kritische
Theorie), nur eben nicht sichtbar verlinkt.

Betroffen: `Denkwege.tsx` (`InfoText`, Zeile ~395), alle sechs Abschnitte von
«Wege der Orientierung».

---

## 2026-08-11 — Keine Maschinen-Aussagen in den Mund der Denker (Christof)

Auf der Kant-Karte stand «Nach Kant führt eine Maschine Regeln aus, ist aber
nicht frei und verantwortet nichts». Kant starb 1804; der Satz gab eine
Folgerung von uns als seine Lehre aus.

**Regel ab jetzt:** Der Brückenschlag zur KI wird sprachlich als *unsere*
Lesart markiert, nie als Aussage der Person. Die bewährten Formeln stehen schon
im Bestand: «Für den Umgang mit KI heisst das» (Aristoteles), «Von Arendt her
gelesen», «Von hier aus argumentieren viele» (Heidegger), «Übertragen auf die
KI» (Sloterdijk), «Von hier aus gelesen» (Hegel). Wer selbst über Computer und
Maschinen geschrieben hat, darf direkt zitiert werden (Hustvedt, Haraway).

Kants Karte endet nun beim Menschen, mit dem Unterschied zwischen Befolgen und
Einsehen.

---

## 2026-08-11 — Kein Secret mehr in der Adresszeile (Pietro)

Bis heute reichte der Lehrer-Hub die Zugangsdaten als Query-Parameter weiter:
`/lehrperson/report?code=PIRO-FS-A26&secret=…`. Damit stand das Secret im
Browserverlauf, in der Adressleisten-Vervollständigung und in jedem Lesezeichen.

**Der Fall, der wehtut, ist der Beamer.** Wer den Klassen-Report im Unterricht
zeigt, projiziert das Secret an die Wand. Und weil der Report die einzelnen
Fortschritts-Codes nennt, könnte danach jede Person aus der Klasse den Report
aller öffnen — genau das, was das Secret verhindern soll.

**Neu:** Beim Absenden landen Code und Secret im `sessionStorage`
(`src/lib/lehrperson/zugang.ts`), die Adresse bleibt `/lehrperson/report`. Wer
eine der drei geschützten Seiten direkt aufruft, bekommt ein kleines
Eingabefeld auf der Seite statt einer Fehlermeldung
(`src/app/lehrperson/_components/ZugangGate.tsx`). Betroffen sind `report/`,
`setup/` und `admin/`.

- **`sessionStorage`, nicht `localStorage`:** Der Zugang soll das Schliessen des
  Tabs nicht überleben. An einem geteilten Schulrechner ist das der Unterschied
  zwischen «ich war kurz im Report» und «der Nächste auch».
- **Kein signiertes Cookie** wie bei `/autoren`: Der Server prüft das Secret
  ohnehin bei jedem Aufruf gegen den Hash. Hier ging es nicht um eine
  zusätzliche Prüfung, sondern nur darum, das Secret aus der Adresszeile zu
  bekommen.
- **Alte Lesezeichen funktionieren weiter.** Stehen die Parameter doch in der
  Adresse, werden sie einmal übernommen und die Adresse per `router.replace`
  sofort bereinigt — kein zusätzlicher Verlaufseintrag.

**Der Preis:** Ein Lesezeichen führt nicht mehr mit einem Klick in den Report,
sondern fragt die zwei Angaben ab. Bewusst in Kauf genommen. Der Hinweis in der
Lehrpersonen-Anleitung, der bisher das Gegenteil empfahl («Lesezeichen setzen,
bedenken Sie aber…»), ist entsprechend umgeschrieben.

---

## 2026-08-10 — Admin-Dashboard: fünf Entscheide (Pietro)

Antworten auf Christofs fünf Fragen aus
[handoff-pietro-admindashboard.md](handoff-pietro-admindashboard.md), am selben
Tag umgesetzt. Eine Woche vor dem öffentlichen Start; Claude riet, nur zu
entscheiden und nach dem Start zu bauen — Entscheid war, beides heute zu machen.

**1 · Anmeldung: kein eigenes Admin-Passwort.** Das Passwort-Management bleibt
bei den Lehrpersonen — sie wählen Klassencode und Secret selbst, wie bisher. Der
Admin-Blick ist keine zweite Anmeldung, sondern eine *Berechtigung*: `istAdmin:
true` am Lehrer-Doc (von Hand in der Firebase-Konsole) oder der Klassencode in
`ADMIN_CLASS_CODES`. Damit fällt beides weg, was Christof vorgeschlagen hatte:
ein ausgestellter Passcode nach Korrektorat-Muster (das ist genau das Modell, das
wir nicht wollen) und Pietros Lehrer-Secret als Generalschlüssel (dann wäre eine
Klasse der Hauptschlüssel für alle). Berechtigung kann sich niemand selbst geben,
sonst sähe jede neu angelegte Klasse alle anderen.

**2 · Reichweite: fest auf `abstimmungen/ki26`.** War strukturell schon so —
`paths.ts` bildet jeden Pfad aus `UNIT_ID` (Env), keine Funktion baut sich einen
Pfad selbst. Als Bauvorschrift festgehalten: **die Admin-Route nimmt keine
Bereichs- oder Pfadangabe aus dem Request entgegen**, und es gibt **keine
`collectionGroup`-Abfragen** im Admin-Tier — die laufen projektweit und würden
`10mio` mitlesen.

**3 · Nutzung wird über `progress.updatedAt` gemessen.** R6 nicht vorziehen —
siehe den eigenen Eintrag weiter unten, R6 war längst gebaut.

**4 · k-Schwelle gilt für Lernende, nicht für Lehrpersonen und Admins.** Die
Schwelle `< 5` bleibt dort, wo sie steht (`studentClassReport`). Für den
Admin-Blick wäre sie Theater: wer `FIREBASE_SERVICE_ACCOUNT` hat, liest ohnehin
jedes Dokument. Stattdessen die Schranke, die etwas kostet und nichts vortäuscht:
**die Übersicht zeigt keine Fortschritts-Codes.** Zahlen und Klassencodes ja,
Einzelpersonen nein — und in eine fremde Klasse sieht man nur mit deren Secret.

**5 · Datenschutz-Aussagen nachgezogen, vor dem Bauen.** Der Satz auf `/start`
nennt jetzt die Gesamtauswertung («nur Zahlen, keine einzelnen Codes»), die
Lehrpersonen-Anleitung hat einen Absatz dazu im Abschnitt «Welche Daten
entstehen». App Check bleibt aus und ist hier nicht das Thema: die Route läuft
über das Admin SDK hinter der Anmeldung.

**Kosten.** Die Übersicht liest die ganze `students`-Sammlung samt Fortschritt.
Kein denormalisiertes Aggregat am Schüler-Doc — das würde bei *jedem*
`mirrorProgress` einen zusätzlichen Schreibvorgang kosten, also die Dauerlast
erhöhen, um eine seltene Leselast zu senken. Stattdessen zehn Minuten
Zwischenspeicher mit sichtbarem Standdatum, und die Unterkollektionen werden
zwanzigfach parallel gelesen statt nacheinander.

---

## 2026-08-10 — Engagement-Tracking ausgeschaltet (Pietro)

`ActivityTracker` schreibt nichts mehr. Die Komponente bleibt auf allen zwölf
Seiten stehen, damit die Aufrufstellen unangetastet sind und das Erfassen mit
einer einzigen Änderung zurückkommt.

Der Befund, der dazu führte: **R6 war seit dem 26. Juni gebaut** (Commit
`efc20a9`), `CLAUDE.md` und Christofs Handoff sagten sechs Wochen lang das
Gegenteil. Der Tracker legte seither pro Seitenaufruf und pro Seitenschluss ein
Ereignis mit Code, Seite, Zeitpunkt und Verweildauer unter
`abstimmungen/ki26/engagement` ab.

Drei Gründe fürs Ausschalten:

- **Niemand liest die Daten.** Keine Auswertung, kein Skript, keine Route im
  ganzen Projekt greift auf `engagement` zu.
- **Ein Teil war tot.** Die Block-Erfassung hängt sich an `[data-block-id]`; das
  Merkmal kommt im ganzen Projekt nur in einem Kommentar vor.
- **Es war die feinkörnigste Datenspur der App** — feiner als das, was
  `CLAUDE.md` als «minimaler Fortschritts-Snapshot» beschreibt, und damit die
  einzige Stelle, an der die Zusage auf `/start` untertrieben hätte.

Wer das Erfassen zurückholt, baut zuerst die Auswertung und zieht die
Datenschutz-Sätze nach. `src/lib/engagement.ts` bleibt unangetastet liegen.

---

## 2026-08-10 — Fortschritts-Spiegel schreibt nur noch bei Änderung (Pietro)

`mirrorProgress()` vergleicht den Schnappschuss mit dem zuletzt erfolgreich
geschriebenen und schreibt bei Gleichheit nicht. Grund: der Spiegel läuft auf
einem 30-Sekunden-Takt; eine offen liegen gelassene Seite schrieb bisher
stündlich 120-mal denselben Inhalt. Gemerkt wird erst *nach* erfolgreichem
Schreiben, damit ein fehlgeschlagener Versuch beim nächsten Takt wiederholt wird.
Gilt für beide Lernseiten, da es in der geteilten Funktion sitzt.

---

## 2026-08-10 — Kein rohes NUL-Byte im Quelltext (Pietro)

`teacherStore.ts` enthielt an einer Stelle ein **echtes NUL-Byte** (0x00) als
Trennzeichen im zusammengesetzten Map-Schlüssel `` `${art}\0${base}` ``. Christof
hat das beim Anfassen der Datei gemeldet. Es steht jetzt als Escape-Sequenz
`\u0000` im Quelltext — **dasselbe Zeichen zur Laufzeit**, identisches Verhalten,
aber die Datei ist wieder reiner Text.

Warum das mehr als Kosmetik war: Git stuft eine Datei mit NUL-Byte als
`-text` ein (`git ls-files --eol` zeigte `i/-text w/-text`) und schaltet damit
die **Zeilenenden-Normalisierung ab**. Die Datei lag deshalb als einzige mit
CRLF im Repo, während der Rest mit LF liegt. Mit dem Wegfall des NUL-Bytes greift
`core.autocrlf` wieder — darum normalisiert derselbe Commit die Datei einmalig
auf LF und erzeugt einen Diff über alle 511 Zeilen. Einmalige Kosten; danach sind
Diffs auf dieser Datei wieder normal lesbar.

**Regel:** Steuerzeichen in Zeichenketten werden als Escape geschrieben
(`\u0000`, `\t`), nie als rohes Byte. Betroffen war nur diese eine Stelle
(`src/lib/server/teacherStore.ts:449`); ein Scan über `src/` und `docs/` fand
sonst keine NUL-Bytes in Quelldateien.

Offen, mit Christof zu besprechen: ein `.gitattributes` mit `* text=auto eol=lf`
würde die Zeilenenden repoweit festnageln — heute liegen zwei, drei Dateien mit
CRLF im Index. Bewusst *nicht* im Alleingang gemacht, da repoweit wirksam.

---

## 2026-08-09 — Die zwei Orakel-Stimmen haben getrennte Aufgaben (Christof)

Bisher deuteten beide Stimmen dasselbe, nämlich die Aktivität, und
unterschieden sich nur im Ton. Zwei Antworten auf eine Frage. Jetzt hat jede
ihre eigene:

- **Erste Stimme** («wo du warst und was noch lohnt») antwortet in **einfacher
  Sprache** und in **drei Absätzen**: auf welcher Seite man vor allem aktiv war,
  was man bevorzugt hat, was sich noch zu verfolgen lohnt.
- **Zweite Stimme** («wie du mit der KI in die Zukunft gehst») fragt, **was für
  ein KI-Typ** man ist, also ob man die KI eher zuversichtlich sieht oder eher
  als Gefahr, mit kurzer Begründung.

**Der wichtigste Einzelbefund ist sachlich, nicht sprachlich.** Die Etiketten,
aus denen sich ein KI-Typ scheinbar begründen liesse, gelten gar nicht der KI:
«froh über diese Technik» und «hätte es nie gebraucht» stammen aus den
Epochen-Bausteinen und meinen den Pflug, den Buchdruck, die Dampfmaschine;
«hilft mir heute» meint eine philosophische Sichtweise. Aus einem Urteil über
den Pflug einen KI-Typ zu machen ist ein Fehlschluss, und ein Fehlschluss in
gepflegter Sprache liest sich wie ein Befund.

**Darum die Rangfolge der Quellen:** Hauptquelle ist die selbst gewählte
Grundhaltung («Wie blickst du heute auf KI»), denn nur sie gilt wirklich der
KI, und sie wird mit dem eigenen Wort wiedergegeben statt in ein Entweder-oder
gepresst. Die übrigen Einordnungen darf das Orakel nur als Muster deuten, wie
jemand auf Wandel überhaupt blickt, und muss das so sagen. Liegt weder eine
Grundhaltung noch eine Einordnung vor, wird nicht geraten: dann sagt die
Stimme, dass die Spuren nicht reichen, und nennt die drei Stellen, wo sich die
Haltung zeigen lässt.

**Und die Lehre, die über diesen Fall hinausgeht: Ein Verbot gegen eine
verlockende Vorlage verliert.** Beide Stimmen bekamen denselben Bericht mit
vierzehn Aktivitätszeilen. Die zweite hat daraufhin die Aktivität nacherzählt,
obwohl es ihr ausdrücklich verboten war, hat «alle vier Lektionen» erfunden und
den Rückfallweg übersprungen. Keine Formulierung hat das behoben. Erst als die
Vorlage wegfiel und jede Stimme nur noch ihre eigenen Daten bekam, stimmte die
Antwort. **Wenn ein Modell etwas nicht tun soll, nimm ihm das Material dafür weg,
statt es zu verbieten.**

Kleinere Lehren aus derselben Runde:

- **Wortzahlen wirken nicht, Satzzahlen wirken.** «Höchstens 150 Wörter» ergab
  167 und 203; die Satzzahl je Absatz hielt das Modell beide Male ein. Länge
  wird über die Satzzahl gesteuert.
- **Widersprüchliche Zahlen machen die weichere Vorgabe wertlos.** Drei Absätze
  mit je zwei Sätzen von höchstens fünfzehn Wörtern ergeben neunzig Wörter,
  verlangt waren mindestens hundertzehn. Aus der Obergrenze wäre die Zielgrösse
  geworden und die einfache Sprache als erste weggefallen.
- **Eine Verbotsliste ist kein Grundsatz.** Untersagt waren «ignorieren»,
  «vernachlässigen», «auslassen» — das Modell schrieb «links liegen gelassen».
  Jetzt steht der Grundsatz da, mit den Wörtern als Beispielen.
- **Was man nicht empfehlen kann, muss man mitliefern.** Absatz 3 soll sagen,
  was sich noch lohnt, durfte aber nur Namen aus dem Bericht nennen, und der
  Bericht filterte die unbesuchten Bereiche heraus. Der Absatz war unerfüllbar,
  bis die Lücke ausdrücklich im Bericht stand.
- **Missverständliche Datenzeilen werden an der Zeile behoben, nicht per Regel.**
  «Davon 11 von 12 noch offen» wurde zu «da fehlen dir nur noch 11 von 12
  Punkten» verdreht. Jetzt steht das Gesehene zuerst.

Gefunden hat das eine adversarische Prüfung mit fünf unabhängigen Lesarten
(Widerspruch, einfache Sprache, Erfindungsrisiko, Rollentrennung, Ton und
Typografie): 44 Befunde, 11 davon schwer. Das war teurer als der Einbau selbst
und hat sich gelohnt, denn drei der schweren Befunde hätten im Unterricht
falsche Aussagen erzeugt, ohne wie ein Fehler auszusehen.

Stellen: [`deutung/route.ts`](../src/app/api/orakel/deutung/route.ts)
(`KI_TYP`, `baueHaltungsbericht`, `VERGLEICH_ERSTE`/`VERGLEICH_ZWEITE`) ·
[`OrakelDashboard.tsx`](../src/app/lernen/lernseite-2/das-orakel/_components/OrakelDashboard.tsx)
(`SEITEN`, `baueAktivitaet`, Beschriftungen der zwei Blöcke).

## 2026-08-09 — KI-Rückmeldungen denken die anderen mit (Christof)

Bisher sah das Orakel nur, was **diese** Person getan hat, und daneben das
*mögliche* Total. Die eigenen Zahlen waren damit ohne Bezugsgrösse: «36 von 114
Knoten» sagt nichts darüber, ob das viel ist. Auf dem Bildschirm stand der
Vergleich «ich / alle» längst — die KI durfte ihn nur nicht deuten.

**Neu bekommt die persönliche Deutung die anonymen Sammelzahlen mit**, die der
Browser für die Ansicht «Alle» ohnehin schon geladen hat: Besuche je Bereich und
die Verteilung der Blick-Umfrage. Kein neuer Datenweg, keine neue
Datenschutzfrage.

**Die Grenze hängt an der Art der Zahl**, und das ist der ganze Punkt:

- Die **Blick-Umfrage** ist eine Stimme pro Gerät, also echt pro Person. Sätze
  wie «die meisten blicken neugierig, du kritisch» sind zulässig.
- Die **Bereichs-Besuche** sind Klick-Summen über alle. Wie viele Personen
  dahinterstehen, wissen wir nicht. Erlaubt ist nur der Vergleich der
  **Schwerpunkte** (was liegt bei allen vorn, worauf hat sich diese Person
  konzentriert). Verboten: Durchschnitt pro Person, Rangfolge, «fleissiger als
  andere». Ohne diese Regel rechnet ein Modell die Summe bereitwillig in einen
  Durchschnitt um und erfindet eine Rangliste, die die Daten nicht tragen.

Fehlen die Vergleichszahlen, deutet das Orakel nur die eigene Aktivität und
erwähnt die anderen nicht.

**Zwei Lehren aus der Prüfung auf Production**, beide teurer als der Einbau
selbst:

1. **Eine Kann-Bestimmung neben einer knappen Wortzahl ist keine Regel.** Erste
   Fassung: «stell einen Bezug her, aber höchstens in einem Satz». Im Budget von
   60 bis 90 Wörtern fiel genau dieser Satz als erster weg, und zurück kam eine
   tadellose Deutung, in der die anderen nicht vorkamen. Jetzt: genau ein Satz,
   gegen Ende, verbindlich.
2. **Was wir selbst ausrechnen können, rechnen wir selbst aus.** Die Bereiche
   gingen in Seitenreihenfolge hinaus. Haiku las aus acht Zahlen den falschen
   Spitzenreiter («Verunsicherung» mit 59 statt «KI-Story» mit 77) und schrieb
   den Irrtum als Tatsache in die Deutung. Jetzt gehen sie absteigend hinaus, der
   Spitzenreiter wird eigens benannt, und die Anweisung sagt ausdrücklich, sich
   darauf zu verlassen statt selbst zu sortieren. Sortieren kostet nichts,
   Kopfrechnen im Modell ist unzuverlässig.

Dazu eine Ton-Schranke: keine Wörter wie «ignorieren» oder «vernachlässigen». Das
Modell schrieb «ignorierst du dagegen … weitgehend». Ein anderer Schwerpunkt ist
kein Versäumnis.

**Die Klassen-Deutung bleibt bei der Lehrperson** (Christofs Entscheid). Für die
Lernenden gibt es damit zwei Ebenen: das eigene Tun und die Gesamtheit aller.
Eine dritte, klassenbezogene KI-Rückmeldung schülerseitig wird nicht gebaut.

Stellen: [`route.ts` der Deutung](../src/app/api/orakel/deutung/route.ts)
(`VERGLEICH`, `Aktivitaet.alle`, `baueZusammenfassung`) ·
[`OrakelDashboard.tsx`](../src/app/lernen/lernseite-2/das-orakel/_components/OrakelDashboard.tsx)
(`baueAktivitaet`).

## 2026-08-09 — Erzeugte Texte ohne KI-Zeichen (Christof)

Doppelpunkt und Gedankenstrich sind die zwei Zeichen, an denen man einen
maschinell geschriebenen Text erkennt, noch vor jeder Formulierung. Weil das
Orakel unmittelbar neben handgeschriebenen Lehrmitteltexten steht, fällt der
Unterschied dort besonders auf.

**Regel für alle drei LLM-Routen:** keine Gedankenstriche («—», «–»), Zahlbereiche
ausgeschrieben («60 bis 90 Wörter»); Doppelpunkte nur, wenn danach wirklich eine
Aufzählung oder ein Zitat folgt, nie als Stilmittel für eine Pause.

**Und die Anweisung selbst hält sich daran.** Das ist der Teil, den man leicht
übersieht: Der Prompt-Stil schlägt auf den Ausgabe-Stil durch. Solange in den
Regeln selbst Gedankenstriche standen, war die Regel durch ihr eigenes Beispiel
entkräftet. Deshalb sind sie aus allen Prompt-Strings entfernt. Ebenso wird
gesagt, dass die übergebenen Zahlen in Zeilen der Form «Feld: Wert» kommen und
diese Schreibweise **nicht** in den Antworttext übernommen werden darf — sonst
wandert der Doppelpunkt über die Daten wieder herein.

Gilt für: [Deutung](../src/app/api/orakel/deutung/route.ts) ·
[Querschnitt](../src/app/api/orakel/querschnitt/route.ts) ·
[Rhizom-Deutung der Lehrperson](../src/app/api/teacher/rhizom-deutung/route.ts).

## 2026-08-08 — Knotenkarte: immer «Bereich · Konkretes» (Christof)

Christofs Regel, und sie ist richtig: In der Rangliste stand «Kaffeehaus &
Öffentlichkeit» ohne jeden Hinweis, woher das kommt — direkt neben einem
«Merkmale · Punkt 4», das den Bereich nannte. Zwei Muster in einer Liste, und
beim ersten weiss man nicht, welcher Abschnitt gemeint ist.

**Jetzt trägt jede Zeile den Bereich vorne.** Angefügt an EINER Stelle
(`titelVon`), nicht in jedem Zweig einzeln — vorher hängte nur der Ersatztext den
Bereich an, der echte Titel nicht. `konkretVon` liefert den konkreten Teil,
`titelVon` setzt den Bereich davor und lässt ihn weg, wenn der Titel schon so
beginnt. Wichtig: Der Hinweis beim Überfahren des Punktes hängte den Bereich
HINTEN an — das musste raus, sonst «Epochen · Antike · Technologie · Epochen».

Der Bereichsname ist der kurze aus `AREAS` («Teppich», «Merkmale»), nicht der
volle Abschnittstitel («Der Teppich des Wandels»): In der schmalen Spalte auf dem
Handy bliebe vom konkreten Teil sonst nichts übrig.

**Dazu zwei weitere Titel, die nur beim Anklicken entstanden** und darum als
«Punkt 0.1» erschienen: die Infopunkte «Hintergrund zum Bild» der Epochen (16).
Jetzt beim Rendern registriert, wie die Bilder selbst. Damit ist in allen vier
Registern kein Ersatztext mehr zu sehen — geprüft in 375 px Breite.

## 2026-08-08 — Die 20 Denker hatten keinen Titel; Ersatztext benannte Verschiedenes gleich (Christof)

Christof mobil: In der Knotenkarte fehlt teils noch der Text. Der Screenshot
zeigte fünf Zeilen, vier ohne Titel und **drei mit demselben** Text
(«Orientierung · Punkt 0»), obwohl es verschiedene Inhalte waren. Zwei Fehler
übereinander:

**1. Kein Titel.** Den Titel einer Person schrieb allein `KartenAktion` — und die
rendert erst, wenn jemand die Box aufklappt. Gemessen: In einem Browser, der die
Seite durchgearbeitet hatte, war von 20 Namen **kein einziger** registriert. Die
anderen Komponenten registrieren ihre Inhalte längst beim Rendern; `Denkwege` tat
es nur für die vier Bereiche, nicht für die Personen. Jetzt für alle.

**2. Ersatztext ohne Unterscheidungskraft.** Er las nur die Ziffern der Kennung,
also wurde `…:denker:0:aristoteles` zu «Punkt 0» — und dasselbe für jede Person
des Bereichs. Neu wird ein sprechendes letztes Segment als Name genommen
(«Orientierung · Aristoteles»); Zähl-Segmente wie `hs0` gehen weiter den
Ziffernweg.

**Wichtig für alle, die hier weiterbauen: Eine Person hat ZWEI Kennungen.**
Das Merkzeichen läuft unter `philosophische-perspektive:denker:{i}:{slug}`, die
Vertiefung unter `…:denkwege:denker:{i}:{slug}`. Beide erscheinen in der
Knotenkarte, in verschiedenen Registern, darum brauchen beide einen Titel — genau
daran ist mein erster Versuch gescheitert, er registrierte nur eine Form.
Zusammenlegen wäre sauberer, würde aber die gesammelten anonymen Zähler
auseinanderreissen; das wäre eine Wanderung, keine Korrektur.

**Regel:** Titel gehören dorthin, wo der Inhalt DEFINIERT ist, und werden beim
Rendern für ALLE Einträge geschrieben — nicht erst beim Anklicken. Sonst kennt
das Orakel nur, was jemand zufällig geöffnet hat.

## 2026-08-08 — «Wege der Orientierung» merkt sich den Bereich; Ebenen-Umschalter pulsiert (Christof)

**Der Standort ging verloren, aber nicht dort, wo es aussah.** Christof: Wer bei
«Wege der Orientierung» war, aufs Orakel ging und zurückkam, war nicht mehr dort.
Nachgemessen: Der Abschnitt klappte korrekt auf und scrollte hin — sowohl über
den Zurück-Knopf des Browsers als auch über die Navigation. Verloren ging die
Stelle INNERHALB des Abschnitts: `Denkwege` hatte `useState(0)` und begann immer
wieder bei Bereich 1 von 4.

`StoryGewebe` (`ki26-story-offen:…`) und `HistorienTeppich`
(`ki26-teppich-offen:…`) merken sich ihre offene Karte längst; `Denkwege` war die
einzige der drei ohne. Jetzt mit `ki26-denkwege-stand:{spurKey}` nach demselben
Muster. **Wer eine neue durchklickbare Komponente baut, denkt daran mit** — sonst
verliert man beim Sprung ins Orakel den Faden.

Diese Ansichts-Schlüssel werden vom «Aktivitäten zurücksetzen» bewusst NICHT
gelöscht: Das löscht Aktivitäten, nicht die Blickposition.

**Der Umschalter «Alle / Nur ich» pulsiert, bis er einmal benutzt wurde**, danach
nie mehr (`ki26-knotenkarte-ebene-benutzt`). Man übersah ihn und merkte nicht,
dass die Karte zwei Blickwinkel hat. Dauerhaftes Pulsieren wäre die schlechtere
Lösung: Was immer blinkt, wird zum Störer.

Umgesetzt mit Tailwinds `animate-ping` — schon bei den Bildpunkten in Gebrauch.
Bewusst KEINE eigene Animation, denn die hätte in die gemeinsame `globals.css`
gemusst, und die wird nur nach Absprache mit Pietro angefasst. Bei reduzierter
Bewegung (`motion-reduce`) bleibt es still.

## 2026-08-08 — Knotenkarte verlinkt; die Adresstabelle liegt jetzt in `_lib/ziele.ts` (Christof)

Schritt 4 der Rückmeldung. Schritt 3 (punkt-genaue Ziele) bleibt zurückgestellt,
Christof: «momentan nicht nötig».

In der Knotenkarte führen jetzt **beide** Darstellungen zum Inhalt: der Titel in
der Rangliste als gewöhnlicher Link (Rechtsklick, neuer Tab, Tastatur) und der
Punkt in der Grafik als Klickfläche. Zweigleisig mit Absicht — im Bild wäre ein
Link nicht auffindbar, in der Liste ist er die verlässliche Bedienung.

**Wer an der Grafik arbeitet, muss zwei Dinge wissen:**

- Die kleinsten Punkte haben Radius 3. Darüber liegt eine unsichtbare
  Trefferfläche von mindestens 12, sonst trifft man sie mit dem Finger nicht.
- Das SVG trägt `role="group"`, nicht mehr `role="img"`. Mit bedienbaren
  Elementen darin würde `role="img"` die Grafik als EIN Bild ausgeben und die
  Links verschweigen. Wer wieder Interaktives einbaut: `role` mitdenken.

**Die Adresstabelle ist aus dem Orakel-Dashboard nach
[`_lib/ziele.ts`](../src/app/lernen/lernseite-2/_lib/ziele.ts) gewandert**, weil
die Knotenkarte sie auch braucht. Sie ist ab jetzt die einzige Stelle, an der
steht, welcher Inhalts-Präfix zu welchem Abschnitt und welcher Adresse gehört.
Wer einen neuen Bereich anlegt, ergänzt dort einen Eintrag — sonst ist der Punkt
in der Karte stumm (bewusst: ohne Adresse bleibt er ein Punkt statt ins Leere zu
führen).

## 2026-08-08 — Titel kamen auf dem zweiten Gerät nicht zurück; drei Orakel-Felder mit Sprungliste (Christof)

**Der Fehler und seine Ursache.** Christof meldete, dass die Punkttitel in der
Knotenkarte «nicht bei allen Browsern» stehen. Es war kein Browser-Problem: Die
Titel-Registry (`_lib/inhalte.ts`) wird pro Browser von den Inhalts-Komponenten
beim Rendern gefüllt, und das Orakel rendert diese Komponenten nicht. `spuren.ts`
und `gewichtung.ts` haben je ein `zieheAusCloud`, mit dem ihre Daten auf einem
neuen Gerät zurückkommen — **bei `inhalte.ts` fehlte dieses Gegenstück**.
Gespiegelt wurde immer schon, nur nie zurückgeholt. Darum kamen die Punkte wieder
und die Namen nicht.

Behoben mit `zieheInhalteAusCloud()` nach demselben Muster (lokale Titel gewinnen,
`INHALTE_EVENT` lässt offene Ansichten sich neu beschriften). Nachgeprüft: alle
195 Titel gelöscht, nur das Orakel geladen, alle 195 wieder da.

**Grenze, die bleibt:** Der Zug geht über den Fortschritts-Code. Ohne Code oder
mit einem anderen Code gibt es nichts zu holen; in der Ansicht «Alle» können
Titel fremder Inhalte weiterhin fehlen, wenn man die Inhaltsseiten in diesem
Browser nie geöffnet hat. Dafür bräuchte es einen erzeugten Titel-Katalog — erst
bauen, wenn es auffällt.

**Wer eine neue Datenart anlegt**, die pro Nutzer:in gespiegelt wird: immer beide
Richtungen bauen. Spiegeln ohne Zurückholen sieht im eigenen Browser vollständig
aus und fehlt auf jedem zweiten Gerät.

**Drei Felder im Orakel sind aufklappbar** («Weiterverfolgen», «Für dich
relevant», «Ohne Bedeutung»), je mit eigenem Rahmen und einer nach Abschnitt
gruppierten Liste von Links. Zwei Dinge dazu:

- Die Links führen zum **Abschnitt**, nicht zum einzelnen Punkt. Das genügt, weil
  `AkkordeonGruppe` am Hash aufklappt und hinscrollt. Punkt-genaue Ziele
  bräuchten in jeder der sechs Inhalts-Komponenten eine eigene
  Aufklapp-Steuerung; bewusst zurückgestellt, bis klar ist, ob es fehlt. Der
  Hinweis unter der Liste sagt das den Lernenden.
- Von einer Bewertung zurück zum Inhalt führt `BEWERTUNGEN` in
  `OrakelDashboard.tsx`. **Falle:** Teppich und Merkmale zählen den Punkt, die
  drei Epochen-Bausteine dagegen die EPOCHE (`index={ei}`), während die
  Inhalts-ID `epochen:{ei*3+ti}` lautet. Ohne diese Umrechnung zeigt eine
  Bewertung der Renaissance auf einen Punkt der Antike.

## 2026-08-08 — «Das verfolge ich weiter» bei jedem Bild, Gesamtzahl 138 (Christof)

Das Merkzeichen sitzt auf der **Vorderseite** jedes Bildes: bei der Bilderstrecke
auf der Karte unter «Punkte zum Entdecken», bei den Epochen unter der
Bildunterschrift. Nicht in der geöffneten Bildansicht — Christofs Begründung:
So lässt sich auch im Nachhinein rasch entscheiden, ohne jedes Bild wieder zu
öffnen.

**Kein Schalter in den Daten.** Kurz gab es ein Feld `weiterverfolgen` pro Bild
(für die Muster-Runde). Es ist wieder weg: Es gibt kein Bild, bei dem man das
Merkzeichen nicht wollen würde, und ein Feld pro Bild wäre nur eine Stelle, die
man beim nächsten vergisst.

**Beim Einbauen auf der Karte:** Die Bildkarte WAR selbst der Knopf. Ein Knopf
im Knopf ist ungültiges HTML, und der Klick aufs Merkzeichen hätte das Bild
geöffnet. Die Karte ist jetzt ein Rahmen, das Öffnen ein eigener Knopf darin.
Wer dort etwas Anklickbares ergänzt: nicht in den Öffnen-Knopf hineinlegen, und
`focus-within` statt `focus-visible` verwenden, weil ein Rahmen keinen Fokus
bekommt.

**Gesamtzahl der möglichen Merkzeichen: 138.** Das Orakel zeigt «x / 138». Die
Zahl ist handgepflegt (`WUNSCH_TOTAL` in `OrakelDashboard.tsx`), weil das
Dashboard eine eigene Seite ist und die Karten der anderen Seiten nicht sehen
kann. Damit sie nicht still veraltet, gibt es
[docs/weiterverfolgen-zaehlen.mjs](weiterverfolgen-zaehlen.mjs): Das Skript
zählt die Merkzeichen aus den Daten nach und bricht mit einer Meldung ab, wenn
die Konstante nicht stimmt. **Nach jedem neuen Bild, jeder neuen Station oder
Denkerin einmal laufen lassen** — gehört ab jetzt zur Prüfkette neben
`belege-pruefen`, `anker-kollision` und `wikilinks-pruefen`.

Zusammensetzung: 22 Stationen der KI-Story · 12 Merkmale · 11 Bilder zur
KI-Story · 33 Punkte im Teppich · 24 Epochen-Bausteine (8 × 3) · 16 Bilder der
Epochen · 20 Denkerinnen und Denker.

## 2026-08-08 — Bildergalerie: die Geschichte trägt den Rahmen, die Punkte tragen die Einzelheiten (Christof)

Anlass: Christof fand den Text zum Schachtürken zu lang und wollte die
Einzelheiten dort, wo man sie auch sieht — bei den nummerierten Bildpunkten.
Danach für alle elf Bilder der Galerie in «Vorhang auf» durchgezogen.

**Die Regel für neue Bilder:** Die `geschichte` beantwortet, *was das ist* —
wer, wann, wie es ausging, was davon bleibt. Alles, was man am Bild zeigen
kann, gehört in den Bildpunkt, der darauf liegt. Ein Satz, der in beiden steht,
gehört nur in den Punkt. Als Grössenordnung tragen die Punkte zusammen jetzt
etwa zwei Drittel des Textes, vorher war es ein Drittel.

Warum überhaupt so: Die Geschichte liest man einmal, die Punkte tippt man
einzeln an. Wissen, das am Bild hängt, bleibt beim Antippen hängen — der lange
Absatz davor wurde eher überflogen.

**Zwei Fallen, die dabei aufgefallen sind:**

- Punkt-Texte liefen als reiner Text, ohne `GlossarText`. Belege und
  Worterklärungen waren dort unsichtbar. Behoben; damit sind alle drei Stellen
  (StoryGewebe, Bildgeschichte, Bildpunkt) gleich.
- Ein Text unter `MIN_LAENGE = 90` (docs/quellenauftrag.js) kommt gar nicht in
  den Quellen-Index und wird nie auf Belege geprüft. Zwei Schachtürke-Punkte
  lagen mit 88 Zeichen knapp darunter. Wer kurze Texte schreibt, die eine
  prüfbare Behauptung enthalten, sollte das wissen.

## 2026-08-05 — Epochen-Prüfung: 386 Aussagen nachgeschlagen, 17 Stellen korrigiert (Christof)

Anlass: Christof fragte beim Hieronymus-Satz, wo das stehe — und der Block
hatte keinen Beleg. Daraufhin wurden alle acht Epochen von «Philosophie in
Zeiten der Verunsicherung» Satz für Satz geprüft: 386 Einzelaussagen, je
Epoche ein Nachschlage-Durchgang und ein Gegen-Durchgang, der jede Quelle
selbst abruft und die Zitate kontrolliert. Nur bestätigte Funde wurden
übernommen.

**Korrigiert (Auswahl, vollständig in den Belegen `EP-…` vom 2026-08-05):**

- Antike beginnt um 800 v. Chr., nicht «von Athen um 450» (Lead).
- Peripatos: Name kommt von der Wandelhalle, nicht vom Herumwandeln beim
  Lehren; gesammelt wurden 158 **Verfassungen**, nicht «Gesetze».
- Sokrates nannte nach dem Prytaneion-Vorschlag noch eine Geldbusse.
- Münzprägung nach 476: geschrumpft, nicht verschwunden (Merowinger).
- Zwölf Artikel: in Memmingen **beschlossen**, gedruckt in Augsburg.
- Montaigne: Sprüche **gemalt/gebrannt**, nicht geschnitzt.
- Kant: **fast** sein ganzes Leben in Königsberg (Hauslehrerjahre um
  1748–1754).
- Watt: «erstmals Kraft» gestrichen — Newcomen lief seit 1712.
- Eisenbahn 1830: schneller, als ein Pferd es **durchhält** (Rocket 47 km/h,
  Vollblut 70 km/h — neu war die Dauer, nicht die Spitze).
- Ludditen: **Textilarbeiter** (Strumpfwirker zuerst), nicht «Weber»; der
  Soldatenvergleich präzisiert: 12'000, mehr als Wellingtons Korps von
  **1808** (1812 bei Salamanca führte er 48'500 Mann).
- Clara Immerwahr: **zehn** Tage nach Ypern, nicht «wenige».
- Fukuyama: Aufsatz **1989**, Buch 1992; geprägt hat er den Ausdruck nicht.
- NOAA ist Wetter- und Ozeanografiebehörde → «US-Behörden NASA und NOAA».
- Apollo 17: letzte bemannte Mond**landung** — seit Artemis 2 (April 2026)
  nicht mehr der letzte bemannte Mondflug.
- «Artificial intelligence»: Begriff stand **1955** im Förderantrag
  (McCarthy), die Dartmouth-Werkstatt lief 1956.

**Verworfen wurde im Gegen-Durchgang** die Korrektur «Kirchner meldete sich
1915 statt 1914»: Der Wikipedia-Hauptartikel und die Sächsische Biografie
stützen 1914, nur der Sanatorien-Artikel sagt 1915. Der Text blieb.

**Sprachregel für Belege präzisiert:** in der Regel deutschsprachig. Bewusst
englisch bleiben Bacon (Original Latein, keine freie deutsche Übersetzung
gefunden), das irische Statistikamt (der Text nennt die Behörde, also
Primärquelle) und der Wellington-Vergleich (steht nur im englischen
Luddite-Artikel) — Begründung jeweils als Kommentar am Beleg. Auf deutsch
umgestellt: EU-AI-Act-Zeitplan (deutsche Fassung des Service Desk) und die
UNESCO-Studie (CIO.de-Bericht, deckt alle Aussagen des Blocks).

Damit tragen jetzt 29 Textblöcke Belege (41 Einträge). Nicht belegbar bleiben
Blöcke, die ohne GlossarText rendern (Epochen-Leads, Bildführungs-Stopps) —
dort greifen nur Textkorrekturen.

---

## 2026-08-04 — Bildführungen: Fokusringe nachgemessen statt geschätzt (Christof)

Rückmeldung des Lektors: Der Ring bei «Lichtbänder des Netzes» lag auf Afrika,
der bei «Das Brandenburger Tor» auf dem Kran, und bei Raffaels «Schule von
Athen» seien die Ringe «teils nicht sehr präzise» — mit der Vermutung, das sei
vielleicht Absicht, um den entscheidenden Ausschnitt nicht zu verdecken.

Es war keine Absicht, sondern geschätzte Koordinaten. Korrigiert:

| Stopp | vorher | nachher | was dort lag |
|---|---|---|---|
| Lichtbänder des Netzes | 50 / 34 | 51 / 22, Zoom 1.9 | Sahara → helles Band über Europa |
| Das Brandenburger Tor | 30 / 48 | 44 / 56 | Kranausleger → Säulenreihe des Tors |
| Platon und Aristoteles | 50 / 42 | 51,3 / 47,5 | Himmel über dem Torbogen → Lücke zwischen beiden, auf Aristoteles' flacher Hand |
| Sokrates im Gespräch | 37 / 40 | 35,5 / 47 | Wandrelief → seine abzählende Hand |
| Euklid an der Tafel | 71 / 71 | 79 / 75 | Rücken eines Zuschauers → Tafel unter dem Zirkel |

**Wie das jetzt bestimmt wird, statt geschätzt:** Der Fokusring ist 48 px auf
dem Schirm und wird gegen den Zoom zurückskaliert, im Bild misst er also
`48/(zoom · fit)` — bei den Werten hier 57 bis 84 Bildpunkte. Er ist damit
gross genug, ein Gesicht zu verdecken, und die Position muss auf ein bis zwei
Prozent stimmen. Vorgehen: Ausschnitt mit Prozentgitter rendern, Zielpunkt
ablesen, Ring in Originalgrösse einzeichnen, ansehen. Die Hilfsskripte dazu
liegen im Scratchpad (`gitter.py`, `ringe.py`), die gemessene Overlay-Grösse
ist 575 × 790 px. Beim NASA-Bild half zusätzlich ein Helligkeitsraster über
die Stadtlichter, das die hellen Ballungen numerisch ausweist.

Die Ringe wurden anschliessend im Browser gegengeprüft: Der Marker landet
exakt auf den eingetragenen Prozentwerten.

**Zwei Ringe blieben unverändert**, weil sie richtig lagen: «Das schwebende
Mauerstück» (68/42) und «Die Menschen unten» (55/80). «Die dunklen Flächen»
(55/60) liegt korrekt über dem südlichen Afrika.

Ebenfalls vom Lektor: Der Link zu «Candide» zeigte auf die
**Begriffsklärungsseite** (Roman, Musical, Oper) statt auf
«Candide oder der Optimismus». Ein Linkcheck findet das nicht, weil die Seite
mit 200 antwortet. Neu prüft [docs/wikilinks-pruefen.mjs](wikilinks-pruefen.mjs)
alle verlinkten Artikel über die Wikipedia-API auf beides: existiert der Titel,
und ist er eine Begriffsklärung. Ergebnis nach der Korrektur: 78 Artikel, alle
in Ordnung, Candide war der einzige Fall dieser Art.

---

## 2026-08-07 — Vercel baut nur einmal pro Commit: main zuerst pushen, Korrektorat-Branch danach (Christof)

Symptom: Der Push von `0603a35` auf `main` erzeugte **kein**
Production-Deployment, die Live-Seite blieb einen Tag auf dem alten Stand.
GitHub zeigte für den Commit nur ein Preview-Deployment (Build erfolgreich,
aber unter einer Preview-URL).

Ursache: Derselbe Commit wurde in einem Zug auf `main` **und** auf
`korrektorat/runde-1` gepusht (Branch-Nachführung für den Korrektorat-Editor).
Vercel dedupliziert Deployments pro Commit — der Branch-Push gewann, wurde als
Preview gebaut, und der `main`-Push wurde als Duplikat übersprungen. An allen
Tagen zuvor ging jeder Push nur auf `main`, darum fiel das nie auf.

**Regel:** Nie denselben Commit gleichzeitig auf `main` und einen zweiten
Branch pushen. Erst `main` pushen, das Production-Deployment abwarten (unter
GitHub → Deployments sichtbar), dann den Korrektorat-Branch nachziehen — dessen
Build darf ruhig übersprungen werden, der Editor liest Git, nicht Vercel.

Behoben durch einen frischen Commit nur auf `main` (dieser Eintrag).

Anlass: Christof fragte bei «Vorher war Schreiben ein Beruf für Spezialisten,
die Hunderte Zeichen lernen mussten», woher die Aussage stammt. Antwort: aus
keiner Quelle. Der Block (damals `EP-058658`) stand weder in `BELEGE` noch in
`OHNE_BELEG` — er war nie durch das Belegsystem gelaufen. Die anschliessende
Prüfung fand drei Fehler:

1. **«Hunderte Zeichen»** — Linear B hat etwa 90 Silbenzeichen (dazu 160
   Zeichen mit Wortbedeutung). Auf Hunderte kommt man erst mit der Keilschrift.
2. **Das «Vorher» hatte kein Vorher** — zwischen dem Ende von Linear B (um
   1200 v. Chr.) und dem Alphabet liegen rund vierhundert schriftlose Jahre.
   Der Satz behauptete eine Ablösung (Spezialisten → alle), wo ein Bruch und
   ein Neuimport von den Phöniziern war.
3. **«wer die Zeit dazu hat»** — es war eine Frage des Geldes: keine
   Schulpflicht, keine Schulhäuser, Unterricht beim Lehrer zuhause, und das
   konnten sich wohlhabende Familien leisten.

Dazu zwei Stellen, nach denen nicht gefragt war:

- **«Vorher tauschte man Ware gegen Ware und handelte jedes Mal neu aus»** —
  der Gegensatz in den Quellen lautet **wiegen → zählen**, nicht feilschen →
  Festpreis. Vor der Münze zahlte man mit abgewogenem Silber. Die Wikipedia zu
  den altgriechischen Münzen sagt es wörtlich: Münzen konnten «statt gewogen
  abgezählt werden». Öffentlich-rechtliche Bildungsseiten erzählen zwar die
  Ware-gegen-Ware-Version, aber die genauere Fassung ist auch die
  anschaulichere.
- **«das Silber für die Münzen kam aus Bergwerken wie dem Laurion»** —
  bezogen auf die ersten Münzen (7./6. Jh.) zu früh. In Laurion war der Abbau
  laut der Uni Heidelberg (pecunia/NumiScience) «bis zum 6. Jahrhundert v. Chr.
  noch sehr gering» und wurde erst ab ca. 520 v. Chr. ergiebig. Laurion bleibt
  im Vertiefungstext, wo es zeitlich hingehört (483 v. Chr., Themistokles).

Der Block hat jetzt sechs Belege (`EP-8b588b`), alle deutschsprachig und frei
zugänglich. Der Kartentext ist dadurch etwa ein Viertel länger — der alte war
kürzer, weil er falsch verkürzte. Neue Glossareinträge: «mykenischen»,
«Lydien», «Aigina».

**Methodisch mitgenommen:** Ein Beleg-Anker, der einen Glossarbegriff
überdeckt, verdeckt dessen Erklärung (Belege haben Vorrang). Das prüft jetzt
ein kleines Skript, statt nur als Kommentar in `belege.ts` zu stehen.

---

## 2026-08-04 — Buchbelege: das Belegsystem nimmt auch Werke ohne URL (Christof)

Anlass: Der Text zu «wahrscheinlichkeitsbasiert» nannte «rund 13'000
Richtungen» und schrieb Markus Gabriel den Begriff «Vektorisierung» zu. Beides
hielt der Prüfung am Buch nicht stand. Zweig schreibt «von Hunderten bis über
10 000 Richtungen»; Gabriel benutzt das Verb «vektorisiert», nicht das
Substantiv. Der Text folgt jetzt dem Wortlaut der Bücher.

**Entscheidung:** `Beleg.url` ist optional. Fehlt es, ist die Quelle ein Buch:
Das Wort im Text wird ein Knopf statt eines Links, und der Hover nennt Autorin
und Titel («Nachgelesen in …», «Im Buch nachgeschlagen am …»). Damit lassen
sich Aussagen auch dann belegen, wenn die Quelle nicht im Netz steht — bisher
war das der Grund, gute Quellen liegen zu lassen.

Dazu drei Löcher geschlossen, die alle dieselbe Ursache hatten
(`filter(b => b.id && b.url)` warf Buchbelege stillschweigend weg):

- `docs/belege-pruefen.js` prüfte sie nicht → jetzt geprüft, nur der
  `--links`-Durchlauf lässt sie aus.
- `docs/quellen-export.js` schrieb sie nicht ins Verzeichnis → jetzt als
  «Quelle (Buch)».
- Das Prüfdatum stand roh als `2026-08-04` im Hover → jetzt `4.8.2026`.
  Bewusst ohne Monatsnamen: Eine Liste von zwölf Namen wären zwölf zusätzliche
  Textfelder im Korrektorat.

Im Orakel-Quellenverzeichnis stehen die drei Bücher als eigene Rubrik am
Schluss, getrennt von den Erklärlinks: Die Links sind Kurztexte für fünf
Minuten, die Bücher sind der Boden darunter. Jäkels «Die intelligente
Täuschung» ist Open Access (CC BY-ND 4.0) und darum verlinkt und als «frei
lesbar» markiert; Zweig und Gabriel stehen ohne Link.

Betroffen: `_data/belege.ts`, `_components/Glossar.tsx` (`BelegStelle`,
`datum()`), `_components/Quellenverzeichnis.tsx` (`BUECHER`),
`vorhang-auf/page.tsx`, `docs/belege-pruefen.js`, `docs/quellen-export.js`.

---

## 2026-07-29 — Lehrer-Report: Fortschritt pro Thema statt nur pro Lernset (Pietro)

Der Report zeigte für Lernseite 1 nur **einen** Prozentwert pro Schüler:in über
das ganze Lernset. Seit die Themen frei wählbar sind und es keine Mindestzahl
mehr gibt (Entscheid 2026-07-28), sagt dieser eine Wert wenig: Er unterscheidet
nicht, ob jemand zwei Themen ganz oder sechs Themen halb bearbeitet hat.

**Neu:** eine Spalte je Thema mit drei unterscheidbaren Zuständen — «–» nicht
begonnen, Prozentzahl begonnen, Prozentzahl mit Haken abgeschlossen. Prozentzahl
und Haken sagen bewusst Verschiedenes: der Haken meint das 60-%-Gate auf den
Verständnisfragen (`stationErfuellt`), die Prozentzahl den Erfüllungsgrad
(`stationErfuellung`). Die Spalte «Zuletzt aktiv» ist entfallen — sie beruhte
auf `completedAt` und war fast immer leer.

Betroffene Stellen:

- `_lib/progressSnapshot.ts` — jeder `type:"station"`-Block spiegelt jetzt
  zusätzlich `pct`. Nicht begonnene Themen haben weiterhin **keinen** Eintrag;
  daraus liest der Report «nicht begonnen».
- `src/lib/types.ts` — `ProgressBlock.pct`, neuer Typ `StationStand`,
  `TeacherReportStudent.stationen`.
- `src/lib/server/teacherStore.ts` — `stationStaende()`; Docs von vor dem
  2026-07-29 haben kein `pct` und fallen auf 100/0 nach `completed` zurück, bis
  der nächste Besuch den Wert nachliefert.
- `src/app/lehrperson/report/page.tsx` — Themen-Spalten aus `STATIONEN_V3`
  (keine zweite Namensliste), Legende, Module ausser `lernseite-1` in einer
  eigenen Tabelle «Weitere Module» statt als technische Spalten-IDs unter der
  Überschrift «Lernset 1».
- `docs/teil-a-lernset-1.md` §A5/§A6 nachgezogen.

## 2026-07-28 — Lernseite 1: Medien-Snippet-Überarbeitung, Station 7 ausgeschaltet (Pietro)

Umsetzung des Medien-Audits (`docs/material-pietro/AUDIT_medien-snippets_2026-07-28.md`,
7 Prüf-Agenten gegen die Voll-Transkripte). Entscheidungen:

**1. Station 7 «Technik» ausgeschaltet.** Daten bleiben in `stationenV3.ts`
(`versteckt: true`), aber die Station erscheint nicht mehr im Frontend — es
gibt **6 sichtbare Themen**. `STATIONEN_V3` exportiert nur sichtbare Stationen
(`STATIONEN_V3_ALLE` behält alle); die Landkarte-Achse `technik-vertrauen` ist
mitgefiltert. Grund: Schatten-Pol aus dem 3Blue1Brown-Material strukturell zu
dünn (43 s tragen die ganze Aussage).

**2. Zeitziel: 5–10 Minuten Medieninhalt pro Pol.** Wo die Quelle das nicht
hergibt (St. 4 Sonne ~3:21, St. 5 Sonne ~3:04 — MP3 enthält nur einen
Sendungs-Ausschnitt), bleibt die Unterschreitung bewusst stehen; es wird kein
neues Material beschafft.

**3. YouTube-Mehr-Segment jetzt echt.** `spec.segments` spielt über die IFrame
Player API wirklich nacheinander (ein Embed pro Quelle, automatisches Springen,
harter Stopp nach dem letzten Fenster) statt nur das erste Fenster.

**4. SRF-iframes: Startpunkt ja, Stopp bei den Lernenden.** `spec.start` setzt
`startTime` im Player; ein **grosses Schaufenster-Banner** («Schauen: Minute X
bis Y — stopp selbst») ersetzt das Kleingedruckte. Kein Code-Stopp möglich.

**5. Freiwillige Zusatz-Ausschnitte.** `MediaBlock.extras` rendert unter dem
Hauptinhalt eine eingeklappte Sektion «Weitere Ausschnitte — freiwillig»
(Muster: Auftakt-Hype-Opener) für ungenutztes starkes Material.

Betroffen: `_data/types.ts`, `_data/stationenV3.ts`, `_data/landkarte.ts`,
`_components/StationV3.tsx`, `_components/ThemenMenu.tsx`, `src/config/unit.ts`,
`lehrperson/leitfaden/page.tsx`, Korrektorat-Labels.

---

## 2026-07-28 — Lernseite 1: Abschlussbericht statt Zertifikat, Themen statt Stationen (Pietro)

Vier zusammenhängende Änderungen am Flow von Lernseite 1. Gemeinsamer Nenner:
die Einheit behauptet keine Abfolge und keine Mindestleistung mehr, sondern
zeigt ehrlich, was tatsächlich bearbeitet wurde.

**1. Zertifikat → Abschlussbericht, ohne Schwelle.** Die Urkunde ist weg. An
ihrer Stelle steht ein **Bericht**, der jederzeit abrufbar ist — die frühere
Bedingung «ab 3 Stationen» (`ZERTIFIKAT_SCHWELLE`) ist ersatzlos gestrichen.
Begründung: Wer frei wählen soll, darf nicht an einer Mindestzahl scheitern; und
eine Urkunde für «3 von 7» ist eine Bewertung, die die Einheit gar nicht abgeben
will.

**2. Der Bericht enthält alle eigenen Daten und Freitexte.** Vorwissen und
Freitext aus dem Auftakt, Ausgangs- und Endposition auf dem Schieberegler, jede
Meinungsfrage vorher/nachher, jede Werte-Karte, jeder Faktencheck (inkl. welche
Variante gezeigt wurde), jede Verständnisfrage mit der gegebenen Antwort und
jeder Reflexionssatz. Ausgabe: Drucken/PDF **und** Download als Markdown-Datei.
Datenschutz unverändert — alles wird lokal aus localStorage gelesen und lokal
gerendert, es gibt keinen Upload; nur die Lernperson entscheidet, ob sie den
Bericht weitergibt. Der Hinweis beim Auftakt-Freitext wurde entsprechend
präzisiert («wird nirgends hochgeladen» statt «wird nie gespeichert»).

**3. «Station 1 … 7» → «Thema · Kurzname».** Nummern erzählen eine Reihenfolge,
die es nicht gibt. Jede Einheit trägt neu einen thematischen Kurznamen
(`kurzname` in `stationenV3.ts`): **Arbeit · Wahrheit · Denken · Nähe · Welt ·
Verantwortung · Technik**. Der «Zeitstrahl» ist ein **Themenfeld** aus
gleichrangigen Karten (Raster statt Achse). Die Nummer lebt nur noch technisch
weiter — in den Deep-Links (`#/station/3/…`) und in den Storage-Keys
(`station-3`), damit alte Lesezeichen und lokale Fortschritte gültig bleiben.

**4. Erfüllungsgrad je Thema.** Neu zeigt jede Themenkarte (und der Kopf jedes
Themas und der Bericht), welcher Anteil der bearbeitbaren Elemente erledigt ist:
Meinungsfragen vorher/nachher, Verständnisfragen, Werte-Karten, Faktencheck,
Reflexionssatz. Das blosse Ansehen der Medien zählt **nicht** mit — dafür gibt es
kein verlässliches Signal, und ein geratener Wert wäre schlechter als keiner. Das
bestehende **60-%-Quiz-Gate** bleibt daneben bestehen und entscheidet weiterhin
über «abgeschlossen» und die Badge-Vergabe: Erfüllungsgrad beantwortet «wie
weit?», das Gate «gut genug?».

Betroffene Stellen: `_lib/erfuellung.ts` + `_lib/bericht.ts` (neu),
`_components/Abschlussbericht.tsx` + `Erfuellungsbalken.tsx` (neu, ersetzen
`Zertifikat.tsx`), `ZeitstrahlMenu.tsx` → `ThemenMenu.tsx`, `StationV3.tsx`,
`AbschlussV3.tsx`, `KiEinheitV3.tsx`, `_lib/route.ts` (Hash-Segment
`zertifikat` → `bericht`, altes Segment bleibt als Alias gültig),
`_lib/progressSnapshot.ts` (Lehrer-Report spiegelt neu den Erfüllungsgrad statt
der Quote abgeschlossener Stationen), `src/config/unit.ts` (Modul-Beschreibung),
`src/app/lehrperson/leitfaden/page.tsx` (Terminologie + Szenarien).

## 2026-07-27 — Korrektorat: in die Next.js-App integriert, nicht als zweites Hosting (Pietro)

Das externe Korrektorat von `ki26` folgt dem Vorbild aus `10mio` (Passcode statt
GitHub-Zugang, Commits auf einen Korrektorat-Branch, ein Pull Request pro Runde),
läuft aber **in dieser App** unter `/korrektorat` statt als eigenes
Cloudflare-Pages-Projekt. Grund: ki26 ist bereits eine Next.js-App auf Vercel;
ein zweites Hosting brächte ein zweites Deployment, ein zweites Token und eine
zweite Stelle, an der Umgebungsvariablen veralten.

Die Technik-Entscheidung dahinter: ki26 hält seine Inhalte in **TSX/TS**, nicht in
MDX. Rückschreiben mit regulären Ausdrücken ist dafür keine Option — der
bestehende Leseexporter `docs/inhalte-export.js` sagt selbst, dass er eine
Näherung ist und Lücken markiert. Weil die Route Handlers in der Node-Runtime
laufen, kann der **echte TypeScript-Compiler** parsen (kein Bundle-Limit wie in
einem Worker); `typescript` ist dafür von `devDependencies` nach `dependencies`
gewandert.

Zwei Festlegungen zum Umfang, die nicht aus dem Code hervorgehen:

- **Nur die Lernseiten** (`src/app/lernen/**` plus `src/config/unit.ts`).
  Titelseite, Onboarding und Lehrpersonen-UI sind aussen vor.
- **Toter Code wird ausgeschlossen.** Der v2-Flow von Lernseite 1 (`KiEinheit`,
  `Auftakt`, `Abschluss`, `Station`, `Maschinenraum`, `PollDeck`, `Skala`,
  `WissenCheck`, `_data/stationen.ts`, `_data/maschinenraum.ts`,
  `_data/wissenChecks.ts`) liegt noch im Repo, ist aber seit M7 nirgends
  eingebunden — rund 400 Textstellen, die niemand liest. `npm run
  korrektorat:inventar` baut den Import-Graphen ab den echten `page.tsx` neu auf
  und meldet, wenn diese Liste veraltet.

Umgekehrt bleiben drei nicht eingebundene Dateien **sichtbar**, mit Hinweis im
Editor — allen voran `SchablonenZeitstrahl.tsx` (283 Textstellen, Lernseite 2):
angefangener Inhalt, an dem noch gearbeitet wird, ist etwas anderes als
abgelöster Code.

- `src/lib/korrektorat/**`, `src/app/api/korrektorat/**`, `src/app/korrektorat/**`
- `scripts/korrektorat/**`, `docs/KORREKTORAT.md`, `docs/anleitung-korrektor.md`

---

## 2026-07-27 — Lehrpersonen-Anleitungen aus 10mio portiert, nicht kopiert (Pietro)

`ki26` bekommt dieselben zwei Lehrpersonen-Dokumente wie das `10mio`-Repo, als
eigene Seiten: `/lehrperson/anleitung` (Bedienung — Vorbild
`anleitung-lehrperson.astro`) und `/lehrperson/leitfaden` (Didaktik — Vorbild
`einheit-uebersicht-lehrperson.astro`). Beide sind von `/lehrperson` aus
verlinkt; die Titelseite hat neu einen Einstieg «Für Lehrpersonen».

**Bewusst nicht 1:1 übernommen**, weil sich ki26 an drei Stellen anders verhält:

- **Kein Pflichtmodul-Schritt.** In 10mio ist das Schritt 3 der Anleitung und
  ein echtes Gate. In ki26 wird die Auswahl schülerseitig nicht durchgesetzt
  (siehe Eintrag «Klassenbeitritt jederzeit» unten) — dokumentiert wird sie
  darum gar nicht. Aus 4 Schritten werden 3.
- **Beitritts-Link statt Code abtippen.** `/start?class=CODE` gibt es in 10mio
  nicht; in der ki26-Anleitung ist er der empfohlene Weg.
- **Klassencode jederzeit nachtragbar** über das Account-Menü — in 10mio läuft
  das übers Profilmenü und ist anders beschrieben.

Die **Plenum-Anker** im Leitfaden (eine Diskussionsfrage je Station) sind die
didaktische Zutat dieses Leitfadens, keine Ableitung aus dem Lernset. Fragen und
Lernziele der Stationen stammen dagegen aus `lernseite-1/_data/stationenV3.ts` —
wenn dort Stationen dazukommen, muss der Leitfaden mitziehen.

- `src/app/lehrperson/{anleitung,leitfaden}/page.tsx`, `_components/DruckButton.tsx`
- `src/app/lehrperson/page.tsx` (zwei Einstiegskarten), `src/app/page.tsx` (Titelseite)

---

## 2026-07-27 — Klassenbeitritt jederzeit: Account-Menü statt `/start` (Pietro)

Der Klassencode bleibt **optional und überspringbar** im Onboarding — aber ab
jetzt jederzeit nachholbar. Bisher war er das nicht: Wer bei `/start` «Ohne
Klasse weiter» wählte, hatte keinen Weg mehr in eine Klasse, weil `/start` bei
bestehender Session sofort auf die Lernseite zurückleitet. Der SideNav-Eintrag
«Klasse beitreten» und der CTA im Klassenreport zeigten beide dorthin und
liefen damit ins Leere.

Neue Stelle dafür ist ein **Account-Menü oben rechts in der TopAppBar**
(`AccountMenu.tsx`, `account_circle`). Es bündelt, was zum Zugang gehört:
Fortschritts-Code zum Notieren und Kopieren, und den Klassenbeitritt mit
Existenz-Check. Bewusst ein Panel und keine eigene Seite — der Beitritt soll
den Lernfluss nicht unterbrechen, und der Fortschritt bleibt unangetastet
(nur `teacherCode` kommt dazu).

Die beiden alten Einstiege verlinken nicht mehr auf `/start`, sondern öffnen
das Panel über ein Custom-Event (`ki26-account-open`); nach dem Beitritt zieht
der SideNav-Eintrag über `ki26-session-changed` live auf «Klassenreport» nach.

**Kein Pflichtmodul-Gate.** Die Lehrperson kann unter `/lehrperson/setup`
weiterhin Pflichtmodule wählen, sie werden aber schülerseitig bewusst nicht
durchgesetzt — `loadStudentClassPrefs()` bleibt ungenutzt. Die Lernsets sind
auf freie Wahl angelegt; ein Gate widerspräche dem.

- `src/components/layout/AccountMenu.tsx` (neu), `TopAppBar.tsx`, `SideNav.tsx`
- `src/app/klassenreport/page.tsx` (CTA öffnet das Panel)

---

## 2026-07-27 — Lehrpersonen-Report: Module getrennt, Klassen-Rhizom, KI-Einschätzung (Christof)

Der Report zu Lernset 2 unterscheidet neu die beiden Module. Bisher stand alles
in einer Abschnittstabelle, in der «Die Epochen» (Vorhang auf) und «Die
Kriterien» (Philosophische Perspektive) nebeneinander lagen, als wären sie vom
gleichen Zuschnitt. Jeder `TeacherOrakelBereich` trägt darum jetzt ein Feld
`modul` mit drei Werten: `Vorhang auf`, `Philosophische Perspektive`,
`Übergreifend`. Die Zuordnung passiert serverseitig in `teacherStore.ts` über
das Spur-Präfix, nicht im UI — so bleibt sie an derselben Stelle wie die
Bereichs-Zuordnung selbst.

**Aktive Schüler:innen je Modul werden nicht aufsummiert**, sondern als Maximum
über die Abschnitte genommen: dieselbe Person ist meist in mehreren Abschnitten
unterwegs, eine Summe zählte sie mehrfach. Der Maximalwert ist die belastbare
Untergrenze und wird als «bis zu N von M aktiv» ausgewiesen.

**Zwei Grafiken statt Zahlenkolonnen.** Der Report zeigt jetzt dieselben zwei
Bilder, die die Lernenden von sich selbst kennen, nur mit Klassenzahlen:

- das **Aktivitäts-Rhizom** (`AktivitaetsNetz`) mit der Klasse im Vordergrund
  und allen Teilnehmenden im Hintergrund,
- den **Kontext-Kreis** (`Ring` aus `KontextGewichtung`) im Vergleich Klasse
  gegen alle Teilnehmenden.

Beide Komponenten wurden dafür fremdsteuerbar gemacht statt kopiert:
`AktivitaetsNetz` nimmt eine optionale `vorgabe` (und dann misst es nicht mehr
selbst), `Ring`/`farbeFuer`/`GRAU`/`ANKER` sind exportiert. Eine zweite
Zeichnung hätte über kurz oder lang anders ausgesehen als die erste — dann
lesen Lehrperson und Lernende nicht mehr dasselbe Bild.

**Dafür musste die Flächen-Bilanz erstmals gespiegelt werden.** Von den sechs
Trieben war «Flächen» der einzige, der nur lokal existierte; im Klassen-Rhizom
wäre er immer null geblieben. `auswertung.ts` schreibt jetzt debounced
`{flaechenGefuellt, flaechenTotal}` ins Modul-Doc `lernseite-2-auswertung` —
nur die Bilanz, nicht die gewählten Titel, die stehen schon in der
Inhalts-Registry.

**KI-Einschätzung des Rhizoms** über die neue Route
`/api/teacher/rhizom-deutung` (Haiku, wie das Orakel). Sie richtet sich an die
Lehrperson statt an die lernende Person: nüchtern, mit Blick auf
Anschlussaufgaben an den weiterverfolgten Themen. Übergeben werden nur
**Klassen-Aggregate** — Summen je Trieb, Summen je Abschnitt, Themen-Titel.
Keine Codes, keine Einzelantworten, nichts wird gespeichert. Ohne
`ANTHROPIC_API_KEY` erscheint dieselbe Ersatzmeldung wie beim Orakel.

Betroffen: `src/lib/types.ts`, `src/lib/server/teacherStore.ts`,
`src/app/lehrperson/report/page.tsx`,
`src/app/lehrperson/report/_components/{KlassenRhizom,KlassenKontext}.tsx`,
`src/app/api/teacher/rhizom-deutung/route.ts`,
`src/app/lernen/lernseite-2/_components/{AktivitaetsNetz,KontextGewichtung}.tsx`,
`src/app/lernen/lernseite-2/_lib/auswertung.ts`.

---

## 2026-07-26 — Nebenwirkung im State-Updater, Herz-Koordinaten (Christof)

**1. «Mehr lesen» wurde geschrieben, aber nicht angezeigt.** Christof meldete
zweimal, die Vertiefung werde nicht vermerkt. Mein erster Test prüfte nur den
`localStorage` und war grün, die Anzeige blieb aber stehen. Ursache: In
`KartenAktion` stand `merkeSpur` **innerhalb** des `setOffen`-Updaters.

```js
setOffen((o) => { if (!o) merkeSpur(mehrId); return !o; });   // falsch
```

Ein Updater läuft in der **Render-Phase**. `merkeSpur` feuert dort `SPUR_EVENT`,
das Aktivitätsnetz ruft daraufhin `setState` — und React verwirft ein
`setState`, das während des Renderns einer anderen Komponente eintrifft. Die
Spur landete im Speicher, der Zähler bewegte sich erst beim Neuaufbau des
Panels. Genau darum sah der Speicher-Test richtig aus.

Neu wird erst registriert, dann der State gesetzt. Ein Scan über alle
`set…(x => {…})`-Blöcke in `lernseite-2` bestätigt: Es war die einzige solche
Stelle. **Regel:** Nebenwirkungen (`merkeSpur`, `merkeInhalt`, `melde`,
`dispatchEvent`) gehören nie in einen State-Updater, immer davor.

**Lehre für die Prüfung:** Ein Test, der nur den Speicher liest, beweist
nichts über die Anzeige. Bei Zählern muss der sichtbare Wert **ohne
Neuaufbau** geprüft werden; verifiziert mit 06 → 07 bei offenem Panel.

**2. Der Rahmen zeigte nicht auf das brennende Herz.** In der Augustinus-Führung
stand der Stopp «Das brennende Herz» auf `x: 60, y: 52`, also mitten im Ornat.
Am Bild (1280×1633) ausgemessen: Herzmitte bei 90/30, das ganze Motiv aus
Flamme, Herz und Hand zentriert bei **86/30**. Nachgeprüft mit einem Ausschnitt
der vermuteten Region, nicht geschätzt.

Ein Koordinatenpaar genügt, weil `BildZoom` daraus **beides** ableitet: den
Zoom-Mittelpunkt (Zeile 181) und die Position des Markierungsrahmens
(Zeile 491). Wer künftig eine Bildstelle korrigiert, ändert nur `x`/`y`.

## 2026-07-26 — Quellenauftrag-Werkzeug, Portal-Tooltips, Kontrolle Runde 2 (Christof)

**1. Neu: Werkzeug für externe Quellenrecherche.** Die Texte bleiben stellenweise
zu allgemein. Statt selbst zu recherchieren, geht die Lesefassung an ein
Recherche-Modell (Gemini), das Quellen nachträgt. Damit die Antwort maschinell
zurückfliessen kann, gibt es zwei neue Skripte:

- [docs/quellenauftrag.js](quellenauftrag.js) erzeugt
  `quellenauftrag-lernseite-2.md` mit allen 461 belegfähigen Textblöcken, jeder
  mit einer **inhaltsadressierten Kennung** (`VA-a1b2c3` = Präfix der Datei plus
  sechs Zeichen SHA-1 des Textes). Sie ist keine Position, bleibt darum stabil,
  wenn woanders etwas eingefügt wird, und wechselt genau dann, wenn der Text
  sich ändert. Ein Beleg zu einem geänderten Text gilt damit automatisch als
  veraltet. Parallel entsteht `quellenauftrag-index.json` (Kennung → Datei,
  Abschnitt, Feld, Text). Nur belegfähige Felder kommen hinein; Bildnachweise,
  Kurzlabels und Aufgaben behaupten nichts.
- [docs/quellen-pruefen.js](quellen-pruefen.js) liest die Antworttabelle und
  prüft **jede** gemeldete Quelle: Ist die Kennung echt? Antwortet die URL?
  Kommen Stichwörter der behaupteten Aussage auf der Seite vor? Ergebnis ist
  `quellenbericht.md`, sortiert nach Verdacht.

**Warum die Prüfung nicht optional ist:** Beim Bauen des Quellenverzeichnisses
hat sich eine plausibel aussehende bpb-URL als 404 erwiesen. Recherche-Modelle
erfinden Belege, die stimmig klingen. Kein gemeldeter Link darf ungeprüft in
ein Lehrmittel.

**2. Tooltips liegen jetzt in einem Portal.** Christof: «Hier verschwindet der
Hoover-Text hinter dem Kartenrahmen.» Ursache: Die Karten haben
`overflow-hidden` für ihre runden Ecken, und das schneidet jeden `absolute`
positionierten Tooltip ab. Neu gibt es [HoverTipp.tsx](../src/app/lernen/lernseite-2/_components/HoverTipp.tsx),
das den Tooltip `fixed` an `document.body` hängt und beim Öffnen an der Position
des Wortes ausmisst (waagrecht zentriert und im Fenster gehalten, senkrecht
dorthin gekippt, wo mehr Platz ist; Nachmessen bei Scroll und Resize).
`Begriff` (Glossar) und `DenkerHover` sind nur noch dünne Hüllen darum.
Gleiches Muster wie beim BildZoom-Fix vom 2026-07-24, jetzt drittes Vorkommen
derselben Ursache; bei künftigen Overlays innerhalb von Karten gleich zum
Portal greifen.

**3. Aufklappen scrollt an den Rand.** Christof: «dann kann ich es nicht direkt
lesen, da ich leicht nach unten fallen und dann wieder nach oben scrollen muss.»
`SammelAccordion` (KI-Story, Merkmale, Teppich) und die Epochen-Bausteine holen
die geöffnete Karte jetzt mit `scrollIntoView({block:"start"})` plus
`scroll-mt-24` an den oberen Rand, wie es `Abschnitt.tsx` schon tat.
**`behavior:"smooth"` wurde verworfen:** im Prüf-Browser ist sanftes Scrollen
wirkungslos, der Aufruf kommt an und bewegt nichts. `"auto"` ist verifizierbar
und im Projekt schon üblich.

**4. Fünf Punkte aus der Kontrolle** (`KontrolleKIAlsPartnerin.docx`): Hub-Text
zur Philosophie durch Christofs Fassung ersetzt (Philosophie als Innehalten und
Ordnen statt als Netzwerk-Aufzählung); Schlusssatz «Und wie ist es heute, mit
KI?» im Philosophie-Einstieg gestrichen; Glossar um Byzanz, Samarkand,
Mongolen, Kalifen und Tigris ergänzt (die grün markierten Begriffe im
Bagdad-Text plus die zwei gleich unklaren daneben).

Die drei mitgelieferten Quellen (Gewürz- und Seidenhandel, Pfeffergeschichte,
SRF zur Pest) sind noch **nicht** eingearbeitet, wie abgesprochen.

## 2026-07-26 — Rhizom mit sechs Trieben, Orientierungsblock, keine Vorbehalte (Christof)

**1. Sprachregelung: keine Vorbehalte, nur belegte Fehler.** Beim Einarbeiten
des Prüfberichts sind Sätze entstanden wie «das ist damit nicht bewiesen»,
«kein Gesetz der Geschichte», «diese Zuspitzung ist unsere». **Verworfen.**
Christofs Vorgabe: Modelle garnieren jeden geprüften Text mit
Genauigkeits-Disclaimern, das verwässert ein Lehrmittel. Eine didaktische
Zuspitzung ist gewollt und braucht keinen Kommentar; korrigiert wird nur, was
ein **belegter Sachfehler** ist, und zwar **ohne den Text zu verlängern**.
Rund 1200 Zeichen reiner Vorbehalt wieder entfernt (Denkwege, Epochen-Vorschau,
Immerwahr, NASA-Nachtbild, Klarna, DALL·E). Die quellengestützten Korrekturen
bleiben unangetastet. Ausnahme: ein knappes **Standdatum** bei zeitabhängigen
Angaben ist eine Tatsache, kein Vorbehalt.

**2. Aktivitäts-Rhizom: sechs Triebe statt vier.** Neu wachsen «Vertiefungen»
(aufgeklappte «Mehr lesen»-Texte, `mehr:`) und «Weiterverfolgen» (Merkzeichen
`wunsch:`) mit. Damit zeigt das Rhizom nicht mehr nur, *wo* jemand war, sondern
auch, *wie tief* er ging. Farben: Vertiefungen in `on-tertiary-container`
(dunkleres Grün, gleiche Familie wie die Punkte), Weiterverfolgen in `error`
(die einzige klar eigene Farbe der Palette; mit Beschriftung liest sie als
«markiert», nicht als Fehler). Winkel neu von -158° bis -23° gefächert.

Kein zusätzlicher Firestore-Verkehr: `mehr:` und `wunsch:` liegen längst im
selben Poll-Dokument wie die Punkte, `zaehleAlleAusPoll()` gibt sie jetzt bloss
mit heraus statt sie zu verwerfen.

Layout musste mit: Bei sechs Einträgen wurde die Legende höher (262 px) als die
Zeichnung (159 px). Jetzt liegt das Rhizom oben in voller Breite (auf 210 px
gedeckelt) und die Kennzahlen darunter in zwei Spalten. Panel damit 536 px, es
passt auf 720p ohne Scrollen.

**3. Orientierungsblock im Hub.** Neu erklärt der Einstieg von Lernseite 2 die
drei Dinge, die auf jeder Seite mitlaufen: das Rhizom unten rechts, die
Abschnittsliste samt Klammersymbol oben rechts (mit Häkchen, wo man tätig war)
und «Der Faden» für den Wechsel zwischen den drei Themen. Ausdrücklich mit dem
Zusatz, dass die Reihenfolge ein Vorschlag ist.

## 2026-07-26 — Externer Prüfbericht eingearbeitet, Quellenverzeichnis sichtbar (Christof)

**Auslöser:** Ein externer Prüfbericht (`pruefbericht-lernseite-2.md`, 26.07.2026)
hat die Lesefassung fachlich durchgesehen und Priorität A und B vergeben. Die
belegten Punkte sind im Quellcode korrigiert, die Lesefassung neu erzeugt.

**1. Datenschutz: «anonym» wird zu «pseudonym».** Die frühere Formel
«Detaildaten bleiben auf dem Gerät» war seit der geräteübergreifenden
Persistenz (Eintrag 2026-07-21) schlicht falsch. Neu heisst es überall:
Der Fortschritts-Code ist ein **Pseudonym**, unter dem Fortschritt, Spuren und
Bewertungen gespeichert werden. Auch die Orakel-Nutzlast wird nicht mehr
«anonyme Kennzahlen» genannt, sondern eine *Zusammenfassung ohne Namen und ohne
Code*: Sie gehört zu einer einzelnen Person und ist damit pseudonym, nicht
anonym (EDÖB-Abgrenzung). Nur die Aggregat-Zähler («alle») bleiben anonym.
Neu ausgewiesen: Empfänger (Anthropic, Claude Haiku), YouTube-Einbindung schon
beim Laden, Findmind extern, Löschweg über den Neustart-Knopf.
Betroffen: `OrakelDashboard.tsx` (Kurz- und Detailtext, PDF-Fussnote),
`api/orakel/deutung/route.ts`, `start/page.tsx`, `app/page.tsx`.

**2. Neu: Quellen im Orakel**, direkt vor dem Datenschutz-Abschnitt, als
Akkordeon wie dieser (`_components/Quellenverzeichnis.tsx`).

Erster Versuch war ein vollständiges Belegverzeichnis mit den 39 Q-Nummern des
Prüfberichts. **Verworfen (Christof):** Belege sind Prüfmaterial, keine
Lernhilfe. Wer im Lernset auf einen unklaren Begriff stösst, ist mit einem
arXiv-Aufsatz oder einer Stanford-Encyclopedia-Seite nicht bedient.

**Auswahlregel neu:** Aufgenommen wird nur, was jemand **ohne Vorwissen** lesen
kann, auf Deutsch, ohne Bezahlschranke. Keine Fachaufsätze, keine PDFs, keine
englische Primärliteratur, auch wenn sie eine Aussage besser belegen würde. Die
Liste startet bewusst mit **fünf** Einträgen und wächst nur, wenn ein Link
wirklich etwas erklärt. Die Q-Belege des Prüfberichts bleiben dort, wo sie
hingehören: im Prüfbericht selbst.

Jede URL wird vor dem Aufnehmen abgerufen und geprüft. (Beim Bauen erwies sich
eine plausibel aussehende bpb-Seite als 404 — ungeprüfte Links gehören nicht
in ein Lehrmittel.)

**3. Sachkorrekturen** (Auswahl): Bombe von Turing *und* Welchman, mit
polnischer Vorarbeit; Attention gab es vor 2017, neu war die Transformer-
Architektur; Kernspaltung Hahn/Strassmann (Befund) und Meitner/Frisch
(Erklärung); der Gottesstaat ist der *bleibende*, nicht der vergängliche; WWW
1989 vorgeschlagen, 1991 erste Website, 1993 vom CERN freigegeben; PC ab Mitte
der 1970er, IBM PC 1981 als Standard; Urheberrecht an KI-Bildern ist
einzelfallabhängig statt pauschal «nicht geschützt».

**4. Zuspitzungen als Zuspitzungen kennzeichnen.** Das Schema «neue Technik →
Verunsicherung → Philosophie gibt Halt» wird im Epochen-Abschnitt ausdrücklich
als *unsere Brille* ausgewiesen, nicht als Gesetz der Geschichte. Sätze wie
«eine Maschine urteilt nicht» sind der jeweiligen Position zugeschrieben
(«Von Arendt her gelesen …», «Ihr Argument: …»). Hegels Dialektik wird nicht
mehr mit «These, Antithese, Synthese» gleichgesetzt; Heideggers NS-Rolle steht
konkret (NSDAP 1933–1945, Rektorat, «Schwarze Hefte») statt als «Nähe zum
Nationalsozialismus». Zeitabhängige Angaben (Preisstufen, Exportkontrollen,
AI-Act-Fristen) tragen ein Standdatum.

**5. Exporter ehrlicher gemacht.** `jsxText()` löschte JSX-Ausdrücke still, was
Satzlücken erzeugte, die wie Inhaltsfehler aussahen. Neu werden textführende
Komponenten (`DenkerHover`, `Begriff`, `GlossarText`) über ihre Props aufgelöst,
verbleibende Ausdrücke als sichtbares **«[…]»** markiert statt verschluckt, und
Treffer aus Template-Literalen per `istCode()` verworfen. Der Lauf endet mit
einer **Selbstprüfung**, die verdächtige Zeilen und markierte Lücken zählt
(aktuell: 0 verdächtige Zeilen, 11 Lücken). Zusätzlich werden `label`/`url`-
Belege als Quellenzeilen exportiert. Das bleibt eine Regex-Näherung und ersetzt
keinen Parser, sagt aber jetzt selbst, wo man ihr nicht trauen darf.

**Nicht übernommen:** Der Bericht nennt den Kyoto-Philosophen «Teruaki
Deguchi»; richtig ist **Yasuo Deguchi**, wie im Code. Seine eigene Quelle (Q37)
belegt das. Der ebenfalls kritisierte `SchablonenZeitstrahl.tsx` ist toter Code
(nirgends importiert) und wurde nicht angefasst.

## 2026-07-25 — Inhalte von Lernseite 2 als Lesefassung exportierbar (Christof)

**Entscheidung:** Die Inhalte von Lernseite 2 gibt es zusätzlich als
Markdown-Lesefassung, [docs/inhalte-lernseite-2.md](inhalte-lernseite-2.md),
erzeugt von [docs/inhalte-export.js](inhalte-export.js) (`node
docs/inhalte-export.js`).

Zweck: Korrekturlesen, didaktische Absprachen und Überblick, ohne durch die
TSX-Dateien zu steigen. Die **Quelle bleibt der Code**, die Datei wird nie von
Hand bearbeitet, sondern neu erzeugt. Sie ist damit bewusst redundant und kann
veralten; nach grösseren Inhaltsänderungen einmal neu generieren.

Der Exporter liest positionsgeordnet die JSX-Überschriften und Fliesstexte
sowie die Inhaltsfelder der Daten-Arrays (`text`, `mehr`, `verunsicherung`,
`hintergrund`, `einordnung`, Epochen-Bausteine, Denkwege-Absätze) und gibt das
Glossar als Tabelle aus. Reine Geometrie- und Technikfelder (`x`, `y`, `zoom`,
`src`, `icon`, `slug`) bleiben draussen.

## 2026-07-22 — Dev-Guard für anonyme Zähler + Zähler-Reset (Christof)

**Problem:** Dev-Server (localhost) und Produktion teilen sich dieselben
Firestore-Poll-Docs (`abstimmungen/ki26/polls/…`). Tage von Entwicklungs- und
Verifikations-Klicks haben die Kollektiv-Zähler verfälscht («alle 12» bei erst
zwei echten Personen).

- **Dev-Guard `zaehltAnonym()`** (in `_lib/spuren.ts`, genutzt auch von
  `auswertung.ts` und dem Blick-Poll): auf `localhost`/`127.0.0.1` wird **nie**
  anonym gezählt. Lokale Spuren («du») funktionieren unverändert — nur der
  `castVote`-Beitrag zum «alle» entfällt in der Entwicklung.
- **Zähler-Reset (mit Christof abgestimmt):** `spuren-lernseite-2`,
  `flaechen-lernseite-2` und `orakel-blick` am 2026-07-22 auf null gesetzt —
  sauberer Start; ab jetzt zählt nur echte Nutzung auf der Vercel-Seite.
  (Hinweis: Bereits gezählte Browser zählen ihre alten Punkte nicht nochmals —
  das lokale Zähl-Register bleibt; neue Klicks zählen normal.)

## 2026-07-22 — Aktivitätsnetz zweischichtig + Sternenkarte (Christof)

**Auftrag Christof:** Kollektiv sichtbar machen. Drei Grafiken im Orakel.

- **Aktivitätsnetz (zwei Schichten):** Hintergrund = Aktivität *aller* (kühler
  Grundton, aus anonymen Poll-Zählern), Vordergrund = *du* (Akzenttöne). Nur noch
  vier Kennzahlen: **Punkte, Flächen, Bildpunkte, Videos** (keine
  Kategorien-Mischung mehr). «Bildpunkte» = durchgegangene Bild-Hotspots, neu als
  Spur `…:hs<n>` erfasst.
- **Anonymer Flächen-Zähler:** Flächen sind berechnete Geometrie (kein Spur) →
  zentral in `auswertung.ts` (`melde`) wird der Zuwachs einmal pro Browser auf den
  Poll `flaechen-lernseite-2` gezählt. So haben auch Flächen ein «alle».
- **Titel-Registry (`_lib/inhalte.ts`):** Spuren/Poll kennen nur IDs; die
  Klartext-Titel werden von den Inhalts-Komponenten via `KartenAktion` (neuer
  Prop `titel`) registriert — Single Source, keine Zweit-Tabelle.
- **Sternenkarte (`_components/Sternenkarte.tsx`):** stärkste Inhalte als
  Punktwolke (grösser = stärker), drei Ansichten (Weiterverfolgt / Vertieft /
  Bekanntheit). **du · Klasse · alle** als Struktur angelegt: «du» lokal, «alle»
  Poll (live, überall), «Klasse» vorbereiteter Platzhalter für Pietros
  Aggregations-Route.
- **`gewichtung.ts`:** `ensureCode()` legt jetzt (wie `spuren.ts`) via
  `ensureStudent` ein reales `students/{code}`-Doc an — damit auch «nur
  gewichtet» klassen-zuordenbar ist. Der Gewichtungs-Spiegel nach
  `students/{code}/progress/lernseite-2-gewichtung` steht → Pietros Route ist
  unblocked.

Offen (verzahnt mit Pietro): Klassencode-Feld im Orakel (§3b-A) + «Klasse»-Werte,
sobald die Aggregations-Route steht. Farbkreis Kontext (Wunsch 3) folgt.

## 2026-07-22 — Login als erster Schritt (Gate über /lernen), Code-Kasten verschoben

**Auftrag Pietro:** Der Fortschritts-Code soll — wie in 10mio — **beim Betreten
der Lernumgebung im ersten Schritt** erzeugt/eingegeben werden, nicht als Kasten
mitten auf der Seite. Ein Code gilt für **das ganze Lernset (Lernseite 1 + 2)**.

- **Neuer Gate `src/app/lernen/layout.tsx`**: wrappt alle `/lernen/**`-Routen
  (beide Lernseiten + alle Submodule) in `SessionGate`. Ohne Session →
  Redirect `/start?next=…` (Onboarding: Code erhalten/eingeben, Klassencode
  optional) — analog 10mios `index.astro`. Ein `ki26-session`-Key, geteilt über
  beide Lernseiten → ein Code fürs ganze Set. Verifiziert: ohne Session leiten
  `/lernen/lernseite-1` und `-2` auf `/start` um; mit Session rendern beide.
- **`FortschrittsCode`-Kasten** von der Lernseite-2-Startseite **entfernt**
  (`page.tsx`) — seine Funktion (Code notieren, auf anderem Gerät via Code
  weitermachen) lebt jetzt im `/start`-Onboarding bzw. der «Ich habe schon einen
  Code»-Flow. Die Komponente `_components/FortschrittsCode.tsx` bleibt liegen
  (ungenutzt) — Christof kann sie löschen/umbauen.
- **Nebeneffekt (positiv):** Lernseite 1 erzeugte bisher **keinen** eigenen Code
  (nur `progressMirror`, no-op ohne Session); durch den Gate bekommen auch
  Lernseite-1-Nutzer einen Code → Fortschritt wird gespiegelt.
- **Tradeoff:** Wie 10mio wird der Code nach dem Onboarding nicht mehr dauerhaft
  angezeigt. Falls gewünscht, später ein kleiner Code-Anzeiger im `AppLayout`.

## 2026-07-22 — Fortschritts-Codes: LLM-Namen + Endbuchstabe; Login-Wiring

**Auftrag Pietro (geteilte Infra, Christof informiert):** Die Fortschritts-Codes
wechseln von Tiernamen auf **LLM-Namen mit angehängtem Buchstaben** — «etwas
krypto-artiger», z.B. `QWEN-34R`, `MINIMAX-69J`, `SONNET-56I`. Parallel wird der
schon vorhandene (aber ungenutzte) Login enger an den Schüler-Fluss gebunden.

- **Format `MODELL-NNX`** (`session.ts`): `MODELS`-Pool (18 LLM-Namen) statt
  `ANIMALS`; 2 Ziffern (10–99) + ein Buchstabe. **Der Buchstabe ist GROSS** —
  bewusst, weil Codes überall mit `toUpperCase()` normalisiert werden und
  Firestore-Doc-IDs case-sensitiv sind; ein Kleinbuchstabe (Pietros erster
  Wunsch) würde beim Wieder-Eingeben zerstört (→ Fortschrittsverlust). Buchstaben
  ohne `I`/`O` (Verwechslung mit 1/0). **Abwärtskompatibel:** alte `BÄR-…`-Codes
  bleiben gültig, keine Migration.
- **Lehrer-Backend war bereits da** (volle 10mio-Parität in `teacherStore.ts`):
  Klassencode mit Passwort erzeugen geht seit R0–R5 über `/lehrperson`. **Kein
  Cloud-Function-Port, kein Rules-Deploy nötig.** Auto-Generieren des
  Lehrer-Codes wurde verworfen — bleibt frei tippbar (sprechende Codes).
- **`/start`**: `?class=CODE` befüllt/verknüpft den Klassencode vor
  (Lehrpersonen-Link); rückwirkendes `linkTeacherCode` für bestehende
  Hintergrund-Codes.
- **`spuren.ts::ensureCode()`** legt jetzt zusätzlich via `ensureStudent()` ein
  **reales** `students/{code}`-Doc an — Voraussetzung, dass ein Code einer Klasse
  zugeordnet werden kann (Klassen-Query findet keine Phantom-Parents).
- **Begleit-Änderungen an Christofs Dateien** (nötig, sonst bricht der
  Geräte-Transfer): `FortschrittsCode.tsx` Regex `…[A-Z]?$` + Texte;
  `OrakelDashboard.tsx` Beispiel-Code kosmetisch.

Plan + 10mio-Analyse: [PLAN_login-llm-codes.md](PLAN_login-llm-codes.md).
Handoff an Christof: [handoff-christof-login-codes.md](handoff-christof-login-codes.md).
**Offen (Christof):** Klassencode-Feld + Vergleich «du ↔ Klasse ↔ alle» im
Orakel; **offen (Pietro):** Aggregations-Route (Admin SDK, k ≥ 5).

## 2026-07-21 — Volle geräteübergreifende Persistenz (Bewertungen gespiegelt)

**Auftrag Christof (mit Pietro abgesprochen):** Die Daten sollen geräte- und
browserübergreifend persistent sein, nicht nur lokal. **Kein grundsätzlicher
Umbau** — die Spuren wurden schon pro Code gespiegelt; es fehlte nur:

- **`gewichtung.ts` bekommt denselben Cloud-Spiegel wie `spuren.ts`**
  (`students/{code}/progress/lernseite-2-gewichtung`, `{werte, updatedAt}`).
  `setzeGewichtung` spiegelt (debounced), `zieheGewichtungAusCloud()` holt +
  merged (lokale Werte gewinnen bei Konflikt). Pull wird beim Laden von
  KnotenLandschaft, KontextAkkordeon, HistorienTeppich, VerunsicherungsEpochen
  und im Orakel-Dashboard ausgelöst.
- **Neue Komponente `FortschrittsCode.tsx`** (auf Hub + Orakel): zeigt den
  Animal-Code zum Notieren und erlaubt, auf einem anderen Gerät denselben Code
  einzugeben → Seite lädt neu, Fortschritt kommt aus der Cloud. Reuse von
  Pietros `session.ts`/`paths.ts` (unverändert).

**Modell-Klarstellung:** «geräteunabhängig» = der **Code IST die Identität**
(kein Passwort). Wer seinen Code kennt und eingibt, bekommt Spuren + Bewertungen
zurück. Nicht gespiegelt bleiben nur Kleinigkeiten (Orakel-Name für den
Ausdruck, Blick-Poll-Wahl). Round-Trip verifiziert (2026-07-21).

## 2026-07-20 — VideoImpuls: direkt sichtbar + «geschaut» erst bei Durchsicht

**Auftrag Christof:** Das Video soll schon **sichtbar/abspielbar** sein, bevor man
klickt, und **erst dann als «geschaut»** vermerkt werden, wenn es wirklich zu Ende
gesehen wurde. Umsetzung: `VideoImpuls` bettet das Video jetzt direkt über die
**YouTube-IFrame-Player-API** ein (Host `youtube-nocookie.com`). Die Spur
`video:…` wird nicht mehr beim Start gesetzt, sondern erst bei Zustand `ENDED`
oder ≥ 92 % Laufzeit. **Datenschutz-Änderung:** Damit fällt die frühere
«Zwei-Klick-Lösung» (nichts von YouTube bis zum Klick) weg — YouTube (nocookie)
wird jetzt beim Laden der Seite eingebunden.

## 2026-07-19 — Orakel-Umbau: deutet die EIGENE Aktivität (3 Stile) + Findmind

**Auftrag Christof:** Das Orakel (Thema 03) wurde stark umgebaut. Es beginnt mit
einer Erklärung und zeigt die eigene Aktivität im Lernset aus sechs Perspektiven
(Angeklicktes, Muster/Kombinationen genutzt, Weiterverfolgen-Merkzeichen, was
relevant war, was ohne Bedeutung blieb, was noch verunsichert) — die ersten drei
neben den anonymen Werten aller (Spuren-/Kanten-/Wunsch-Zähler), die letzten drei
aus den lokalen Bewertungen (`gewichtung.ts`, nur auf dem Gerät).

**Neu — persönliches Orakel:** Die KI deutet die *eigene* Aktivität in wenigen
Sätzen, in einem von drei Stilen (**wissenschaftlich / literarisch /
fantastisch**). Man kann die Deutung bewerten (zufrieden ja/nein) und eine andere
Form wählen. **Datenschutz-Änderung:** Fürs Orakel schickt der Browser auf
Knopfdruck NUR anonyme Kennzahlen (Zähler, Bewertungs-Verteilungen) an die KI —
keinen Namen, keinen Code, keine Einzeltexte. Neue Route
`src/app/api/orakel/deutung/route.ts` (POST, `claude-haiku-4-5`, kein Cache, kein
Speichern). Der frühere Querschnitt-Orakel (Deutung der anonym geteilten Sätze)
ist damit abgelöst; `api/orakel/querschnitt` bleibt vorerst ungenutzt liegen.

**Findmind:** Zwei Umfragen am Seitenende (1× konkrete Rückmeldung/Fehler melden,
1× wie gefällt das Lernset). URLs stehen als Platzhalter-Konstanten oben in
`OrakelDashboard.tsx` (`FINDMIND_FEEDBACK_URL`, `FINDMIND_GEFALLEN_URL`) — leer =
Hinweis «Link folgt».

**Nachtrag (gleicher Tag):** «Die offene Frage» (Satz schreiben + anonym teilen)
komplett entfernt — damit ist `api/orakel/aussage` und der Querschnitt-Orakel
endgültig obsolet. Neu im Orakel-Abschnitt eine Zeile **«Gesamtnutzung aller
Teilnehmenden»** (Summe aller anonymen Zähler). Datenschutz-Text
umgeschrieben/geschärft: klare Trennung zwischen dem **anonymen Zähler** (+1 pro
Knoten, fliesst in «Gesamtnutzung»/«alle», nicht rückverfolgbar) und den
**Detaildaten** (welche Punkte genau, Bewertungen — bleiben nur im Browser).

## 2026-07-19 — Geknüpfte Flächen (Story + Teppich) + Interessens-Analyse

**Auftrag Christof:** (1) Die KI-Story bildet jetzt — wie der «Teppich des
Wandels» — **gefüllte Flächen (Maschen)** zwischen hervorgehobenen Punkten. (2)
Das Orakel-Kästchen «Muster» zeigt neu **«X von Y Flächen geknüpft»** (statt
Kanten), summiert über Teppich + Story. (3) Neue **analytische
Interessens-Rückmeldung**: welche Inhalte vor allem gewählt wurden.

**Architektur-Entscheid (programmierung vs. KI):** hybrid. Die Fakten (welche
Inhalte gewählt, wie viele Flächen) werden **programmatisch** ermittelt — exakt,
gratis, keine Halluzination. Die **Deutung** dieses Interesses macht die KI, aber
nur auf Basis der mitgelieferten Fakten (Prompt: «erfinde keine Inhalte, die
nicht in der Liste stehen»).

- Neue Geometrie-Lib `_lib/flaechen.ts` (Delaunay `trianguliere`, `maschen`,
  `zaehleGefuellt`) — aus `HistorienTeppich` extrahiert, jetzt geteilt.
- Neuer Melde-Store `_lib/auswertung.ts`: Teppich & Story **melden** Flächen-
  Bilanz + gewählte Titel; das Orakel liest sie (kein Datenmodell-Duplikat, kein
  Cloud-Spiegel — rein lokal wie spuren/gewichtung).
- KI-Story-Flächen: feste Topologie aus deterministischem Layout (goldener
  Winkel) → stabile Gesamtzahl; gezeichnet auf den aktuellen (ziehbaren)
  Punktpositionen. Farben: die leuchtenden Perlen-Farben der Story.
- Orakel: Flächen-Kachel, neuer Abschnitt «Was dich besonders interessiert hat»
  (Chips der gewählten Inhalte), und Flächen+Interessen fliessen in den
  Deutungs-Aufruf (`api/orakel/deutung`).

## 2026-07-19 — «Teppich des Wandels» (Naming) + Glossar-Pflicht

**Auftrag Christof:** Das interaktive Vier-Fäden-Gewebe auf der
Philosophie-Seite heisst **«Der Teppich des Wandels»** (nicht mehr
«historischer Teppich»). Zudem gilt für die Teppich-Karten: **mindestens zwei
Glossar-Hover-Begriffe pro Punkt** (Laien-Publikum!) — Fachbegriffe bekommen
eine Kurzerklärung beim Hovern/Antippen (`_components/Glossar.tsx`, ~70
Begriffe). Betroffen: `philosophische-perspektive/page.tsx`,
`_components/HistorienTeppich.tsx`, Orakel-Label.

## 2026-07-18 — Bilderstrecke neu: KI-Geschichte statt Mythen-Set

**Auftrag Christof:** Bilder auswechseln — Golem und Homunkulus raus (nur
Frankenstein bleibt), dafür Anden-Quipu, Turings Code-Knacker, ein Bild vom
maschinellen Lernen (Daten im mehrdimensionalen Raum) und eines vom Lernen
durch Spielen (DQN/Atari).

- **Set neu (7):** Quipu (Anden, ~1400) · Schachtürke (1770) · Frankenstein
  (1818) · Rechenmaschinen (1685–1843) · Turings Code-Knacker (1939–1945) ·
  Maschinelles Lernen (ab 1990er) · Lernen durch Spielen/DQN (2013–2015).
  Golem, Homunkulus und Big-Data-Supercomputer entfernt. Sektion umbenannt
  («Bilder zur KI-Geschichte»).
- **Vier neue Motive als eigene SVG-Illustrationen** (`public/art/quipu.svg`,
  `turing-bombe.svg`, `ml-raum.svg`, `dqn-spiel.svg`) — bewusst KEINE
  heruntergeladenen Fotos (Lizenz/Downloads heikel; Atari-Screenshots
  urheberrechtlich geschützt). DQN-Spiel als generisches Ziegel-Spiel, nicht
  Atari-Original. Jede mit 3 recherchierten Hotspots; CREDITS ergänzt.
  Ersetzbar durch lizenzierte Fotos (datengetriebene Komponente).

## 2026-07-18 — Erste Ebene länger · Merkzeichen umbenannt · Info-Punkt

**Feedback Christof:**

- **Erste Ebene mehr Text:** Die (vorher knappen) Karten von Merkmalen und Netz
  haben jetzt einen fülligeren Basistext (3–4 Sätze, sichtbar ohne Aufklappen);
  «Mehr lesen» bleibt die Vertiefung.
- **Merkzeichen umbenannt:** «Mehr dazu wissen» → **«Das verfolge ich weiter»**
  (aktiv: «Wird weiterverfolgt») — greift «weiter verfolgen» auf und passt zum
  Faden-Motiv. Orakel-Zeile entsprechend «Was du weiterverfolgen willst».
  (Zwischenvariante «Lust auf mehr?» vom User wieder verworfen.)
- **Neue `InfoPunkt.tsx`** (ⓘ zum Aufklappen): In der KI-Story ein Info-Punkt
  «Muss ich allen 14 nachgehen?» — nein, man muss nicht; die Aktivitätsmessung
  registriert aber, was man anschaut/verschiebt/weiterverfolgt, nicht als Note,
  sondern für eine persönliche Rückmeldung im Orakel. Der Begleittext ist dafür
  entschlackt.

## 2026-07-18 — Vertiefung: frühere Geschichten, Merkzeichen, Mehr-lesen

**Auftrag Christof (mehrteilig):**

- **«Womit die Akteurin verwoben ist» entfernt** (zweite Bilderstrecke +
  `BILDER_NETZ`). Die erste Bilderstrecke bleibt.
- **KI-Geschichte-Begleittext:** Hinweis ergänzt, dass man so viel anklicken
  kann wie gewünscht und die Aktivität später (im Orakel) gezeigt wird.
- **Frühere Geschichten + präzise Datierungen (gut recherchiert):** Die Story
  beginnt neu mit zwei antiken Stationen — **Hephaistos & Talos** (Homer,
  ~8. Jh. v. Chr.) und **Yan Shi's Automat** (China, «Liezi», ~4. Jh. n. Chr.,
  eine der frühesten Automaten-Erzählungen) — also 14 statt 12 Stationen. Alle
  vagen Zeitmarken («Sage», «Alchemie», «heute») durch konkrete ersetzt
  (Golem «Prag, 16. Jh.» mit Talmud-Hinweis, Homunkulus «16. Jh.»/Faust 1832,
  Rechenmaschinen «1673–1843», Gegenwart «ab 2020» usw.). Einfluss-Bögen neu
  indexiert.
- **Neue `KartenAktion.tsx`** (geteilt von Story, Merkmale, Netz): «Mehr
  lesen» klappt einen Vertiefungstext (`mehr`) auf; «Mehr dazu wissen» setzt
  ein Merkzeichen (Spur `wunsch:…`, dreifach registriert). Jede Station/jedes
  Merkmal/jeder Netz-Knoten hat jetzt einen recherchierten `mehr`-Text.
- **Aktivität:** `zaehleAktivitaet()` kennt neu `wuensche` (`wunsch:`-Präfix,
  aus «Knoten» ausgenommen). Im Orakel neue Zeile «Wozu du mehr wissen
  möchtest» (du-Anzahl + anonymer Klassen-Zähler — Hinweis für die Lehrperson,
  was zu vertiefen wäre). Story-Total 12 → 14.

## 2026-07-18 — Perlschnur: Bewegung nur beim Ziehen (Hover-Schwingen raus)

**Feedback Christof:** Die Perlschnur bewegte sich schon beim Drüberfahren zu
stark — einzelne Perlen liessen sich kaum anklicken. Fix: das **Zeiger-
Abstossen (Hover-Repel) komplett entfernt** (`mouse`-Ref und `P_REPEL` weg).
Der Ruhezustand ist jetzt die **senkrecht hängende Kette** (x = Anker), direkt
gesetzt — es läuft KEINE Dauerschleife mehr. Die Verlet-Simulation startet nur
noch **beim Ziehen einer Perle** (`ensureLoop`) und schwingt nach dem Loslassen
zurück ins Lot, dann stoppt sie. So hängt die Kette still und jede Perle ist
einzeln anklickbar (Klick ohne Ziehen = lesen). Verifiziert: Hover bewegt
nichts, Klick liest (1→2/12), Ziehen folgt dem Cursor + Nachbarn + Rückschwung.

## 2026-07-17 — Perlschnur: ruhiger (natalität-Physik) + leuchtende Perlenfarben

**Feedback Christof:** Die Perlschnur (Zeitlich-Ansicht der KI-Story) soll wie
bei natalität weniger stark beweglich sein, und jede Perle bekommt eine eigene,
bewusst **leuchtende** Farbe.

- **Physik exakt wie natalitäts `LogPerlschnur`:** Schwerkraft 0.5→0.42,
  Reibung 0.98→0.97, Abstoss-Radius 46→24, Abstoss-Kraft 7→6,
  Constraint-Iterationen 6→5; der synchrone Zeiger-Schritt läuft nur noch
  1× pro Move (statt 2×) — die Kette schwingt, statt zu zappeln.
- **Perlenfarben:** 12 leuchtende Hex-Farben (warm→kalt, chronologisch nach
  Stationsindex — jede Station behält ihre Farbe unabhängig von der Auswahl).
  **Bewusste, punktuelle Ausnahme von der reinen MD3-Token-Regel** — von
  Christof ausdrücklich gewünscht («hier kannst du tatsächlich einmal
  leuchtendere farben einbauen»); gilt NUR für die Perlen der Perlschnur.
  Darstellung nach natalität: ungelesen = heller Kern mit farbigem Rand,
  gelesen = voll gefüllt (+ farbiger Aussenring).

## 2026-07-17 — Vorhang auf: langer Einstieg, Fächer-Muster, klare Aufgaben, Story-Start = 3

**Auftrag Christof (vier Punkte):**

- **Längerer Einstiegstext** (2 Absätze): Die Seite veranschaulicht KI und ihre
  Geschichte entlang einer doppelten Spur — (a) KI als alte Phantasie des
  Menschen, die ihn umtreibt und in Kunstprodukten sichtbar wird (Golem,
  Homunkulus, Frankenstein); (b) die technische Auslagerung kognitiver
  Leistungen: Rechnen in Maschinen (Leibniz' Rechenrad), Zählen/Erinnern in
  den **Knotenschnüren (Quipus) der Andenkulturen** (Christofs
  «Knotenteppiche» — korrekte Bezeichnung Quipus verwendet; passt zum
  Faden-Leitmotiv).
- **Grosses interaktives Seiten-Muster nach dem Text** (wie auf der
  Startseite): `GewebeSpiel` generalisiert — Props `punkte`, `kanten`,
  `kantenFein`, `felder`, `akzent`, `hoehe`; ohne Topologie-Props gilt der
  Zickzack-Streifen des Hubs. Auf vorhang-auf ist es **exakt die
  Auftritts-Signatur, gross nachgebaut** (Feedback Christof mit Screenshot,
  ersetzt den ersten Fächer-Entwurf): Zentrum mit sechs Strahlen, zwei feine
  Aussenkanten, sechs Sektor-Felder, Zentrum als Akzent (tertiärer Punkt mit
  Ring). Eigener Spur-Key `vorhang-auf:gewebe`, Persistenz wie beim Hub-Band.
- **Aufgaben genauer beschrieben:** alle fünf Sektionen von vorhang-auf haben
  jetzt einen «Deine Aufgabe: …»-Block (was tun, wie, Ziel); ebenso die
  Epochen-Einladung auf der Philosophie-Seite.
- **KI-Story startet mit 3 Zufalls-Stationen** statt allen zwölf (wie
  natalitäts START_SEEDS): Mount-Effect wählt 3 zufällig (SSR rendert leer —
  kein Hydration-Mismatch), gelesene Stationen kommen per Union zurück, der
  Rest wird aktiv dazugeholt; «Muster zurücksetzen» zieht wieder 3 neue.

## 2026-07-17 — Video-Impulse (Hub, Vorhang auf, Philosophie) + Videos im Aktivitätsnetz

**Auftrag Christof:** Auf Startseite (Hub), «Vorhang auf» und «Philosophische
Perspektive» je ein kurzes Erklär-Video nach Einstiegstext bzw. -muster; im
Orakel sichtbar, ob geschaut; zählt zur Aktivität.

- **Neue `VideoImpuls.tsx`:** datenschutzfreundliche **Zwei-Klick-Lösung**
  (Schulkontext) — beim Laden wird nichts von YouTube geladen, nur eine eigene
  Vorschau-Fläche; erst der Play-Klick lädt den iframe von
  `youtube-nocookie.com` und setzt die Spur. Ohne `videoId`-Prop zeigt die
  Komponente einen deutlichen Platzhalter («Video folgt», Play deaktiviert) —
  **die drei YouTube-IDs trägt Christof später als Prop ein** (je eine Zeile
  in den drei page.tsx).
- **Platzierung:** Hub nach Text + Gewebe-Spiel (`video:hub`), Vorhang auf nach
  dem Header (`video:vorhang-auf`), Philosophie nach dem Epochen-Muster
  (`video:philosophie`).
- **Aktivität:** `zaehleAktivitaet()` kennt neu die Kategorie **videos**
  (`video:`-Präfix); das Aktivitätsnetz hat eine **vierte Nabe «Videos»**
  (fill-on-surface, unten), das Mini-Symbol einen vierten Puls-Punkt.
- **Orakel:** neue Bereichs-Zeile «Video-Impulse» (Präfix `video:`, total 3)
  → Gesamt-Total 46 → **49**.

## 2026-07-16 — Gewebe-Spiel bleibt gespeichert

**Nachfrage Christof:** Das gewobene Muster im Hub-Kopf bleibt jetzt erhalten.
`GewebeSpiel` hängt am Spuren-Gedächtnis (`_lib/spuren.ts`, Präfix
`lernseite-2:gewebe`): Anwählen setzt eine Spur (lokal + anonymer Zähler +
Pro-Nutzer-Cloud-Spiegel), Abwählen löscht **gezielt die eine Spur**
(`loescheSpuren` mit id-genauem Präfix). Wiederherstellung beim Laden **exakt**
(Set statt Union), damit auch Abwahlen bestehen bleiben; Cloud-Pull via
SPUR_EVENT wie überall — das Muster kommt auch geräteübergreifend zurück.
Die Punkte zählen im Aktivitätsnetz als «Knoten» mit (bewusst: es sind
bewusste Interaktionen); im Orakel-Bereichs-Vergleich tauchen sie nicht auf
(kein BEREICHE-Eintrag).

## 2026-07-16 — Hub: neuer Partnerschafts-Text + Gewebe-Spiel im Kopf

**Auftrag Christof:** Für den Hub von Lernseite 2 einen tragenden Text zur
«ganz neuen Partnerschaft» (5–10 Sätze) und das Kopf-Muster als interaktives
Spiel.

- **Text (7 Sätze, zwei Absätze, direkt in `lernseite-2/page.tsx`):** Bezug auf
  die Komplexität einer Welt in Transformation, auf berufliche wie private
  Lebenswelt, und auf den Kern: keine Partnerschaft mit einem blossen Werkzeug,
  sondern mit einer Technologie, die interaktiver und sprachlicher ist als
  alles bisher Gekannte («Sie spricht unsere Sprache, sie antwortet, sie
  schlägt vor, sie handelt»). Schluss: Partnerschaft verlangt Kennen des
  Gegenübers — und wird davon geprägt, wie wir sie gestalten. Die kurze
  `description` in `unit.ts` bleibt unverändert (für Karten-Kontexte).
- **Neues `GewebeSpiel.tsx`** ersetzt das statische `GewebeBand` im Hub-Kopf:
  ein Zickzack-Band aus 12 Punkten (Dreiecksstreifen, 10 Felder). Punkte sind
  an-/abwählbar (Toggle); sind alle drei Ecken eines Feldes aktiv, füllt es
  sich — die Felder rotierend in **tertiary / primary / secondary** (Deckkraft
  0.16). Rein spielerisch, kein Tracking. `GewebeBand` bleibt in `Gewebe.tsx`
  (aktuell ungenutzt).

## 2026-07-13 — Erste Bilderstrecke auf denselben Anschauungsmodus umgestellt

**Feedback Christof:** Die «Bilder der Vorstellung» sollen gleich funktionieren
wie «Womit die Akteurin verwoben ist». Die erste Strecke nutzt jetzt ebenfalls
`BilderAnschauung` (Klick → Lightbox → Hotspots) statt des alten Hover-Streifens.
Die sechs `storyboard/`-Bilder haben je drei Hotspots bekommen (Koordinaten
anhand der tatsächlichen Bildinhalte gesetzt — Bilder dafür angeschaut):
Golem (Wort/Schöpfer/Beschwörung), Homunkulus (Glas/Macher/Preis), Schachtürke
(Schein/versteckter Mensch/Attrappe), Frankenstein (Wesen/Flucht/Wissen),
Rechenmaschinen (Kurbel/Ziffernräder/Programm), Supercomputer (Rechenhallen/
Datenströme/Kühlung). `BilderSet.tsx` (Hover-Streifen) ist damit verwaist und
gelöscht. spurKey bleibt `vorhang-auf:bild` (Zählung im Aktivitätsnetz
unverändert).

## 2026-07-13 — Zweite Bilderstrecke mit Anschauungsmodus + Hotspots (vor dem Netz)

**Auftrag Christof:** Die «Bilder der Vorstellung» kommen ein zweites Mal —
andere Bilder, direkt vor dem «Netz der Akteurin». Klick öffnet einen
Anschauungsmodus (Lightbox); auf den Bildern sind Hotspots anklickbar, die
etwas erzählen.

- **Neue `BilderAnschauung.tsx`:** Thumbnail-Raster → Klick öffnet eine
  Vollbild-Lightbox (z-[60], Body-Scroll gesperrt) mit dem Bild gross und
  nummerierten, pulsierenden Hotspots (Position in %). Ein Hotspot-Klick zeigt
  seinen Text in einer Erzähl-Leiste unten; Prev/Next + Pfeiltasten blättern,
  Escape/X/Zähler schliessen. Ansehen eines Bildes → Spur
  `vorhang-auf:bildnetz:{i}` (zählt als «Bilder» im Aktivitätsnetz).
- **Platzierung:** eigene Sektion «Womit die Akteurin verwoben ist» zwischen
  Merkmalen und «Das Netz der Akteurin».
- **Bilder (gemeinfrei, schon im Repo, mit Hotspots zur KI-Infrastruktur):**
  Menzel «Eisenwalzwerk» (Material/Maschine/Arbeit), NASA «Erde bei Nacht»
  (Energie/Netz/Ungleichheit), Doré «Over London — by Rail» (Infrastruktur/
  Kehrseite). Hotspot-Koordinaten anhand der tatsächlichen Bildinhalte gesetzt.
- **`zaehleAktivitaet()`** zählt neu `:bild` als Substring — beide Bild-Sets
  (`:bild:` und `:bildnetz:`) fliessen als «Bilder» ins Aktivitätsnetz.
- Fix: `wechseln()` rief `merkeSpur`/`setState` im `setOffen`-Updater auf →
  „setState während Render" (SPUR_EVENT → Aktivitätsnetz). Seiteneffekte aus dem
  Updater in den Handler gezogen; im frischen Tab keine Konsolenfehler mehr.

## 2026-07-13 — Aktivitätsnetz als mitwanderndes Symbol (Auftakt)

**Feedback Christof:** Das Aktivitätsnetz soll mitwandern — ein kleines Symbol
mit pulsierenden Punkten, das beim Scrollen sichtbar bleibt und beim Klick zum
vollen Netz «aufgeht». Neue `AktivitaetsNetzFloat.tsx`: unten rechts schwebendes
Mini-Netz (Kern + drei farbige Punkte, die pulsieren, wenn die jeweilige
Kennzahl > 0 ist) mit Gesamt-Zähler; Klick öffnet ein Panel mit dem vollen
`AktivitaetsNetz` (schliessen per X, Backdrop oder Escape). Über der mobilen
Bottom-Nav platziert (`bottom-20 md:bottom-6`, z-50). Auf der Auftakt-Seite
ersetzt das schwebende Symbol die frühere Inline-Karte; im Orakel bleibt das
volle Netz zuoberst inline (das «aufgegangene» Netz als Ziel/Rückblick).

## 2026-07-13 — Bilderstrecke ausgelagert · Aktivitätsnetz (Auftakt + Orakel)

**Auftrag Christof:** Die Bilder ganz aus der KI-Story lösen, als eigene
durchgeh-bare Strecke zwischen die Aktivitäten setzen (Hover erklärt), und ein
schwebendes «Aktivitätsnetz» ergänzen, das die Aktivität misst — auch zuoberst
im Orakel.

- **Bilder raus aus `StoryGewebe`:** kein Bild-Symbol auf den Knoten, keine
  Bilder/Credits in den Story-Karten mehr (`bild`-Felder aus den Story-Stationen
  entfernt; die Story-Karten zeigen nur noch Titel/Jahr/Text/Geschichte).
- **Neue `BilderSet.tsx`:** die sechs gemeinfreien Bilder als seitwärts
  durchblätterbare Strecke (Filmstrip, snap-scroll), platziert zwischen KI-Story
  und Merkmalen. Hover/Fokus zeigt die Erklärung als Overlay; das erste Ansehen
  eines Bildes wird als Spur `vorhang-auf:bild:{i}` registriert (dreifach wie
  gehabt) und mit «angeschaut»-Häkchen markiert.
- **Neue `AktivitaetsNetz.tsx`:** ein kleines, futuristisch-rechnerisches
  Netzwerk (Kern + drei farbige Naben mit Satelliten, monospace-Zahlen), das
  aus dem lokalen Spuren-Bestand live drei Kennzahlen zeigt: **Knoten**
  (angeklickte Stationen), **Kombinationen** (eingeloggte Verbindungen,
  `…:kanten-…`), **Bilder** (angeschaute Bilder, `…:bild:…`). Neu in
  `_lib/spuren.ts`: `zaehleAktivitaet()`. Das Netz steht schwebend zuoberst auf
  der Auftakt-Seite (misst live beim Tun) und **gleich zu Beginn im Orakel**.
- Verifiziert: Bilder aus der Story weg, Strecke mit 6 Bildern + Zähler,
  Ansehen erhöht Netz-Bilder live (03), Knoten-Klick erhöht Netz-Knoten live,
  Netz als erste Section im Orakel. `zufall`/MMF unberührt.

## 2026-07-13 — Zeitlich = hängende Perlenschnur · MMF-Ansicht entfernt

**Feedback Christof (Screenshots Zeitlich + MMF):** Die «Zeitlich»-Ansicht ist
neu eine **hängende Perlenschnur** nach dem Vorbild von natalitäts «Log»
(`LogPerlschnur.tsx`): die Stationen als Perlen von oben (früher) nach unten
(heute) an einem Faden aufgereiht, mit Verlet-Physik — bewegt man den Zeiger
durchs Muster, schwingt die Kette hin und her; eine Perle lässt sich auch
direkt ziehen, das Antippen öffnet die Karte. Die Ansicht **«Mensch · Maschine
· Fiktion» ist entfernt** — ohne Strang-Struktur wäre sie nur eine Kopie des
Gewebes («und es sieht wie beim Gewebe aus»). Es bleiben zwei Ansichten:
**Gewebe** (frei, federnd) und **Zeitlich** (Perlenschnur). Das Feld `mmf`
bleibt als ungenutzte Metadaten.

**Technik-Detail (wichtig für Pane-Tests):** Die Perlschnur rechnet ihre Physik
sowohl im `requestAnimationFrame`-Loop als auch **synchron bei jedem
Zeiger-Event** (ein `stepRef`, den beide aufrufen). Grund: eingebettete
Vorschau-Panes drosseln rAF, dann fror die Kette am Startpunkt ein. Verifiziert
mit synthetischen Events: Perle folgt beim Ziehen dem Cursor (235→385), Nachbar
zieht mit, Zeiger-Näherung schiebt Perlen weg (351→272). Rücklauf in die
Senkrechte nach dem Loslassen braucht rAF (nur im echten Browser sichtbar).

## 2026-07-13 — Story-Auswahl: Themen-Gruppierung entfernt (flache Liste)

**Feedback Christof (Screenshot mit Kreis um die Kategorien):** Die
Themen-Gruppierung der Knotenauswahl (Mythos & Fiktion / Mechanik & Rechnen /
KI & ihre Regeln / Lernen aus Daten) war zu komplex und musste weg. Die
Auswahl ist jetzt eine **schlichte, flache Liste aller zwölf Stationen** in
chronologischer Reihenfolge (plus «Zufall (3)» / «Alle»). `KAT_LABEL` und
`KAT_ORDER` entfernt; das Feld `kat` bleibt als (aktuell ungenutzte)
Metadaten im Datenmodell stehen. Die «Technologisch»-Ansicht war bereits im
Commit zuvor (3f9f495) entfernt — der Screenshot zeigte eine gecachte
Vorversion.

## 2026-07-12 — KI-Story: flexibles Gewebe mit Drag, Bilder + Geschichten zurück

**Nachschärfung Christof («wirklich wie natalität»):** Die Story-Box ist jetzt
ein **flexibles, federndes Gewebe**: Punkte lassen sich mit Maus/Finger
**selbst verschieben** (Drag), die Verbindungen bleiben fix — das Netz
schwingt mit. Eigene Mini-Simulation (Abstossung, Federn entlang der Kanten,
Zentrierung, Boxgrenzen) statt d3-force, weil `package.json` geteilt ist
(keine neue Abhängigkeit ohne Absprache). Tippen ohne Ziehen (< 4 px) öffnet
die Karte — Unterscheidung wie bei natalität.

- **Ansichten neu:** «Gewebe» (frei, Standard) · «Zeitlich» (chronologisch,
  nur gewählte) · «Mensch · Maschine · Fiktion». Die Ansicht **«Technologisch»
  (vier Stränge) ist gestrichen** — «zu komplex» (Christof). Die
  Themen-Gruppierung der Auswahl-Chips bleibt (sie strukturiert nur die Wahl).
- **Bilder + längere Geschichten zurück:** Jede Station trägt neben dem
  Zwei-Satz-Einstieg wieder eine ausführlichere `geschichte` (2–3 Sätze,
  Lehrbuchwissen ohne Zitate) und ggf. die gemeinfreie Bildtafel — beides
  erscheint **erst bei Aktivierung** des Knotens in der Karte (Bild jetzt
  grösser, natalität-Panel-Stil, auf Mobile ausgeblendet).
- **Robustheit:** Der gezogene Punkt folgt dem Zeiger direkt; Nachfedern der
  Nachbarn läuft zusätzlich synchron pro Move/Release (requestAnimationFrame
  wird in Hintergrund-Tabs gedrosselt — der Loop macht es nur flüssiger).
  SSR rendert deterministische Kreis-Startpositionen; die Simulation rechnet
  erst im Effect (kein Hydration-Mismatch). `touch-none` nur auf den Knoten,
  damit die Seite über der Box scrollbar bleibt.

## 2026-07-12 — KI-Story als wählbares Gewebe (Vorbild natalität)

**Auftrag Christof (Verweis auf natalitaet.com/gewebe):** Die KI-Story wird zum
wählbaren Teil-Gewebe. Neue Komponente `_components/StoryGewebe.tsx` (ersetzt
für die Story die `KnotenLandschaft`; Merkmale + Netz behalten `KnotenLandschaft`).

- **Knotenauswahl oben** (wie natalität): nach Themen gruppierte Chips —
  *Mythos & Fiktion · Mechanik & Rechnen · KI & ihre Regeln · Lernen aus Daten*.
  Man wählt, WELCHE Stationen erscheinen; «Zufall (3)» zieht drei zufällig,
  «Alle» zeigt alle. Start: alle gewählt.
- **Anordnung nach Strukturwahl** (auf die gewählten Punkte angewendet):
  *Zeitlich* = chronologisch (Serpentine ab 7 Punkten), *Mensch · Maschine ·
  Fiktion* = 3 Stränge, *Technologisch* = 4 Stränge. Positionen werden rein
  rechnerisch aus Auswahl × Struktur bestimmt (kein d3-force wie natalität —
  bewusst strukturiert statt organisch; keine neue Abhängigkeit). Feine Bögen
  zeigen Einflüsse quer durch die Zeit (Golem→Frankenstein, Automaten→Dartmouth,
  Rechenmaschinen→Symbolische KI, KI-Winter→Statistische KI, Frankenstein→
  Gegenwart).
- **Bilder erst bei Aktivierung:** Ein Klick auf einen Punkt blendet seine Karte
  (zwei Sätze, ggf. mit Bild) unten ein; Punkte mit Bild tragen im Muster ein
  kleines Bild-Symbol (nach natalität). Bilder werden also nicht vorab gezeigt.
- **Spuren unverändert kompatibel:** Aktivierte Stationen → `vorhang-auf:story:N`
  (12, Orakel-Total bleibt 56). Kein Kanten-Einloggen mehr in der Story; der
  frühere `vorhang-auf:kanten-story`-Präfix ist ungenutzt (harmlos). Auswahl ist
  ephemer (nicht gespiegelt); gelesene Karten bleiben geräteübergreifend offen.

## 2026-07-12 — Kulturelle Perspektive entfernt · Orakel-KI live

**Kulturelle Perspektive gestrichen (Auftrag Christof):** Thema 03 «Kulturelle
Perspektive» komplett entfernt. Gelöscht: `kulturelle-perspektive/page.tsx`
und das dadurch verwaiste `_components/KnotenNetz.tsx` (wurde nur dort noch
genutzt — vorhang-auf hatte es beim Knotenlandschaft-Umbau bereits verloren).
Betroffene Anpassungen: `src/config/unit.ts` (Submodul-Eintrag raus,
Modul-Beschreibung ohne «kulturelle»), Hub `lernseite-2/page.tsx`
(SIGNATUREN-Map, Intro), `vorhang-auf/page.tsx` («Der Faden läuft weiter» nur
noch philosophische), Orakel-Dashboard (Bereiche «Gewebe-Weisheiten» + «Figuren
im Gewebe» raus → Gesamt-Total 56 → **46**), Doc-Kommentare in `Gewebe.tsx`/
`spuren.ts`. **Orakel neu Thema 03** (vorher 04) — Nummerierung überall
angeglichen. Alte `kulturelle-perspektive:*`-Spuren bleiben harmlos liegen.
Das Modul hat neu zwei inhaltliche Bereiche (Auftakt, philosophische
Perspektive) plus das Orakel als Rückblick.

**Orakel-KI ist scharf:** Live-Check `/api/orakel/querschnitt` liefert neu
`grund: "zu-wenig"` (vorher `"kein-schluessel"`). Laut Route-Logik wird
`"zu-wenig"` **nur bei gesetztem Key** zurückgegeben (sonst `"kein-schluessel"`)
— Pietro hat den `ANTHROPIC_API_KEY` in Vercel also hinterlegt. Das Orakel
spricht, sobald **≥3 Sätze** anonym geteilt wurden (aktuell 0). Der Kommentar
wird dann in `orakel-meta/stand` gecacht (Modell `claude-haiku-4-5`).

## 2026-07-12 — Vorhang auf: drei Knotenlandschaften, Klicken statt Streifen

**Grosser Umbau (Auftrag Christof):** Die Auftakt-Seite besteht neu aus **drei
Knotenlandschaften mit überall gleichem Ablauf** — Punkte antippen (werden
beschriftet, Inhalt blendet ein) oder **Verbindungslinien anklicken**
(«einloggen»: Linie färbt sich und öffnet beide Enden). Das Nachfahren/
Streifen entfällt auf dieser Seite komplett. Inhalte radikal reduziert:
**maximal zwei Sätze, ohne Zitat** (die verifizierten Zitate bleiben in der
Git-Historie dokumentiert). Reihenfolge: **KI-Story → Merkmale → Netz**.

- **Entfernt:** Ratespiel «Woher stammt das?» (`ZitatReveal.tsx` gelöscht),
  «Phasen der aktuellen KI», die drei Szenen (Auftritt/Irritation/Frage),
  `Storyboard.tsx` (Grid) und die `KnotenNetz`-Verwendung auf vorhang-auf
  (Komponente bleibt — die Kultur-Seite nutzt sie weiter).
- **Neu `_components/KnotenLandschaft.tsx`:** Klick-Interaktion, klickbare
  Kanten mit Einzeichen-Animation, Flächen wie gehabt, Abschluss-Feld
  (schraffiert) direkt unterm Muster, Reset. **Mehrere Anordnungen** pro
  Landschaft (Umschalter, Punkte gleiten per CSS-Transform) und
  **Zufalls-Knopf** («n Punkte ziehen» — Idee «Gewebe der Natalität»).
- **KI-Story (12 Stationen, `vorhang-auf:story`):** linear als Serpentine,
  feine **Einfluss-Bögen** zwischen Stationen, die einander prägen (Golem→
  Frankenstein, Automaten→Dartmouth, Rechenmaschinen→Symbolische KI,
  Statistik→Gegenwart); Anordnungen **Zeitlich / Mensch·Maschine·Fiktion /
  Technologisch**; die sechs gemeinfreien Bilder als Thumbnails in den Karten.
- **Netz der Akteurin:** neu ohne Zentrum — die KI ist *ein Knoten unter
  sieben* (Latour-konformer: sie steht *im* Netz). Spur-Keys
  `vorhang-auf:weisheit`/`netz` bleiben kompatibel (gleiche Indizes).
- **Bühnen-Tönung je Landschaft** (neues Prop `buehneKlasse`): Story
  `bg-primary-container/20`, Merkmale neutral, Netz `bg-secondary-container/25`.
- **Kanten-Spuren:** eigener Präfix `vorhang-auf:kanten-{story,weisheit,netz}`
  (mit `-`, nicht `:` — kollidiert so nie mit der `startsWith`-Zählung der
  Punkte im Orakel). Reset-Detail: erst *beide* Präfixe löschen, dann State
  leeren — `loescheSpuren` feuert `SPUR_EVENT`, dessen Restore sonst aus dem
  zweiten Präfix sofort wieder auffüllt.
- **Orakel-Dashboard:** Zeile «Ratespiel» (10) raus, «Die KI-Story» (12) rein
  → Gesamt-Total 56. Alte `vorhang-auf:zitat`-Spuren bleiben harmlos liegen.

## 2026-07-12 — Lückenloses Nachfahren + geräteübergreifende Persistenz der Knoten

**Lücken-Fix (Feedback Christof):** Beim Nachfahren der Fäden entstanden
Lücken. Ursache war ein Sprung-Limit (`SPRUNG`) im `handlePointer`, das bei
schnellem Ziehen Extensions verwarf. Neu: die Spur wächst als **Union** bis
zum berührten Punkt (kein Limit mehr) → lückenlos; Fangradius leicht erhöht
(36 → 44). Betrifft `_components/FadenNetz.tsx`.

**Knoten bleiben offen — auch geräteübergreifend:** `_lib/spuren.ts` spiegelt
die Spur jetzt zusätzlich pro Nutzer nach Firestore, nach **Pietros
Code-Modell** (ohne dessen `src/lib` zu ändern — nur `session.ts`/`paths.ts`/
`firebase.ts` *genutzt*): bei der ersten Interaktion wird im Hintergrund ein
Animal-Code erzeugt (`ensureCode`, via `saveSession`), die vollständige
Spur-Liste landet unter `students/{code}/progress/lernseite-2-spuren`
(debounced). Beim Laden zieht `zieheSpurenAusCloud()` die Spur (Union, nie
löschen) und feuert `SPUR_EVENT`; FadenNetz und KnotenNetz stellen ihre
besuchten Knoten daraus wieder her (`leseSpurenIndices`). Wer denselben Code
via /start eingibt, bekommt seine offenen Knoten auf jedem Gerät zurück.
Dreistufig: lokal (sofort) · anonymer Aggregat-Zähler (fürs «alle») ·
pro-Nutzer-Spiegel (fürs Wiedererkennen). No-op ohne Firebase-Config.

**Status API-Key:** Live-Check `/api/orakel/querschnitt` → `grund:
"kein-schluessel"` — Pietro hat `ANTHROPIC_API_KEY` in Vercel noch **nicht**
hinterlegt; das Orakel schweigt bis dahin (alles andere läuft).

**Merkmal-Geflecht statt Heptagon (2026-07-12, Feedback Christof):** Das
regelmässige Siebeneck mit Nabe wirkte zu «aufeinander bezogen». Neu: ein
**loses, unregelmässiges Geflecht ohne Zentrum** (9 Fäden, 7 davon kreuzen
sich mehrfach; 5 unterschiedlich gefüllte Flächen zwischen Knoten-Tripeln).
Neu in FadenNetz: **«Muster zurücksetzen»**-Knopf (erscheint sobald
begonnen) — leert Spur/Karten/Flächen; die Karten sammeln sich danach in
neuer Reihenfolge. Dazu `loescheSpuren(prefix)` in spuren.ts (lokal löschen +
Cloud-Spiegel sofort überschreiben) und ein dauerhaftes Zähl-Register
(`ki26-spuren-gezaehlt`), damit erneutes Sammeln die anonymen
Aggregat-Zähler nicht aufbläht. Das Abschluss-Feld «Das Muster ist gewoben»
steht jetzt **direkt unter dem Muster** (vor der Kartenliste) und ist
dezent schraffiert (repeating-linear-gradient, tertiary 7 %) statt farbig.

**Auftritts-Stern final (überholt durch Geflecht, 2026-07-12):** Sieben getrennte
Merkmal-Strahlen aus einer dekorativen **Nabe** (Zentrum ist kein anklickbarer
Knoten mehr — die frühere Übersichts-Karte «5» wirkte wie ein Kommentar).
dialoghaft (Karpathy) und generativ (Zweig «Konfabulation») wieder getrennt;
dazu mustererkennend (Zweig), datenbasiert (Domingos), speicherabhängig
(Spektrum), agentenhaft (Weng), multimodal (OpenAI). Neu in FadenNetz: Prop
`nabe` (dekorativer Hub) und `abschluss` (erklärendes Feld unter dem Muster,
sobald alle Knoten besucht) — Text: die KI als Akteurin, deren *gebündelte*
Eigenschaften ihr mehr Potenzial zurechnen, auf unser Handeln Einfluss zu
nehmen als je zuvor. Hover/Fokus über einem Knoten zeigt neu einen Tooltip
mit der Kurz-Bezeichnung (aus dem «Merkmal:»-Kommentar abgeleitet). Geometrie
neu (Heptagon, 7 Rays + 7 Umfang-Nebenfäden, 7 Sektor-Flächen).

**Merkmale-Feinschliff (2026-07-12, Feedback Christof):** Auftritts-Stern
umstrukturiert, bleibt bei 6 Strahlen: (1) «dialoghaft & generativ»
zusammengefasst (Karpathy «Englisch als Programmiersprache»; Zweigs
Konfabulations-Kritik in die Deutung gefaltet); (2) Mustererkennung —
Katharina Zweig; (3) datenbasiert — Domingos; (4) neu «speicherabhängig —
wo kein Speicher, kein Training» (Zitat zum Training der Gewichte,
Spektrum Edition KI 2026); (5) agentenhaft — Lilian Weng; (6) neu
«multimodal» (OpenAI zur GPT-4o-Vorstellung 2024, «über Audio, Bild und
Text hinweg in Echtzeit»). Alle Zitate kurz + zugeschrieben, Deutungen als
Paraphrase; Geometrie/Fäden/Flächen unverändert.

**Auftritts-Stern zeigt neu die KI-Merkmale** (Feedback Christof: die
philosophischen Zitate waren fehl am Platz — Philosophie kommt in Thema 2):
Die sechs Strahlen betonen jetzt, was sich an der KI *verstärkt* hat, belegt
mit **technisch-anschaulichen Aussagen aus der KI-Community selbst** (Wunsch:
Fachleute, nicht zwingend prominent; alle Wortlaute am 2026-07-12
verifiziert, Nicht-Deutsche als «übersetzt»):
- dialoghaft — Andrej Karpathy, «Die heisseste neue Programmiersprache ist
  Englisch» (2023);
- Mustererkennung/Lernen — François Chollet, «Schichten immer bedeutungs-
  vollerer Repräsentationen aus Daten» (2018);
- datenbasiert — Pedro Domingos, «Samen/Boden/Pflanzen» (Master Algorithm,
  2015);
- gedächtnisbedürftig — Lilian Weng, Kurz-/Langzeitgedächtnis (2023);
- agentenhaft — Lilian Weng, «Agent = LLM + Gedächtnis + Planung +
  Werkzeuggebrauch» (2023);
- generativ — Andrej Karpathy, «hallucination is all LLMs do … dream
  machines» (2023), mit Brücke zu Ada Lovelace im Ratespiel.
Zentrum = Leitfrage-Hub. Jede Karte mit ausführlicher Deutung. spurKey
unverändert (vorhang-auf:weisheit); Orakel-Dashboard-Label →
«Merkmale der neuen Akteurin».

---

## 2026-07-11 — Ausbau II: reiche Auflösungen, webende Flächen, bleibende Karten

Feedback Christof, zwei Stränge:

**1. Ratespiel («Einschätzungsaufgabe») — «ein Satz ist zu wenig»:** Jede
Auflösung erzählt jetzt ausführlich (`hintergrund`, 3–5 Sätze: Person, Werk,
Umfeld, Bezug zu heute) plus eine hervorgehobene `pointe`. Design: Zitate in
headline-sm (20 px), Karten alternieren im Grund (bright /
surface-container-low), die Auflösungs-Box ist **je Kategorie getönt**
(Heute über KI → primary-container/25, Frühere Technik →
secondary-container/30, Literatur → tertiary-container/25), Kategorie-Chip
mit Icon. Sektionen auf max-w-5xl verbreitert (Storyboard neu lg:grid-cols-4).

**2. FadenNetz — Flächen & bleibende Zitate:** Zwischen besuchten Knoten
füllen sich die entstehenden **Flächen** (neues Prop `flaechen`: Polygon +
Knoten-Bedingung), abwechselnd mit sanfter Farbe (tertiary 9 %),
**Schraffur** und **Punktmuster** (SVG-`<pattern>`, nur Tokens): beim Stern
sechs Sektoren, bei der Epochen-Linie die wachsende Silhouette unter der
Kurve, beim Gewebe vier Stoff-Zellen. Eingesammelte Weisheiten **bleiben
stehen** (nummerierte Sammel-Liste in Einsammel-Reihenfolge, neuste
hervorgehoben, alternierende Grundflächen) und tragen neu eine ausführliche
`deutung` (2–4 Sätze) — 17 Deutungen über die drei Seiten geschrieben.
Muster liegt auf eigener «Bühne» (rounded, surface-container-low/60).

Firebase: bereits abgedeckt — jeder Knoten-/Zitat-Kontakt läuft über
merkeSpur (lokal + anonymer +1 in polls/spuren-lernseite-2), keine
Code-Änderung nötig.

---

## 2026-07-11 — Vorhang-Opener: Ratespiel «Woher stammt das?» (3 Herkünfte, verräterfrei)

Der Zitat-Opener von «Vorhang auf» ist von «aufdecken» zu einem echten
**Ratespiel** geworden (`ZitatReveal.tsx`): 10 Aussagen über Maschinen,
Denken und Arbeit — Hoffnung *und* Furcht. Pro Karte rät man die Herkunft
aus drei Kategorien:
- **Heute über KI** (2023): Hinton (NYT), «Pause Giant AI Experiments» ×2.
- **Früher, andere Technik**: Leibniz «Calculemus» (~1685) + Leibniz über
  seine Rechenmaschine (1685) — die Wurzel des Algorithmus, auf Wunsch
  Christof ergänzt; Keynes «technologische Arbeitslosigkeit» (1930); Tesla
  «riesiges Gehirn» (Collier's 1926).
- **Aus der Literatur**: Swift/Lagado-Schreibmaschine (1726), Butler
  «Erewhon» (1872), Čapek «R.U.R.» (1920).

**Kernprinzip (Feedback Christof):** die Fragmente sind bewusst
**verräterfrei** — kein Techname, kein Jahr, kein Eigenname, neutraler Stil —
damit man wirklich raten muss. Genau das ist die Pointe: Euphorie wie Angst
klingen quer durch 300 Jahre gleich. Auflösung je Karte mit Jahr, Urheber,
Technik, Einordnung und Quelle; Punktezähler «x von y richtig». Alle
Wortlaute am 2026-07-11 an öffentlichen Quellen verifiziert (futureoflife,
Wikiquote, MacTutor, marxists.org, gutenberg.org, technologyreview),
Nicht-Deutsche als «übersetzt» markiert.

Ersetzt den früheren «Alt — oder von heute?»-Aufdecker. Orakel-Spur bleibt
`vorhang-auf:zitat:i` (Total im Dashboard 5→10). Das Elisabeth-I.-Zitat
(Strumpfwirkstuhl) wurde **verworfen** — laut Historikern eine Erfindung
des 19. Jh.

---

## 2026-07-11 — «Vorhang auf» neu dramatisiert: Zitate-Rätsel + KI-Storyboard, Akteurs-Modell entfernt

Neue Dramaturgie des Auftakts (Wunsch Christof):

1. **«Alt — oder von heute?»** (`ZitatReveal.tsx`): fünf Literatur-Zitate,
   die nach heutigem KI-Diskurs klingen, zum Aufdecken (Jahr + Werk +
   Kontext + Quellen-Link). Alle fünf am Quelltext verifiziert
   (2026-07-11): Hoffmann «Der Sandmann» 1816 (de.wikisource, wörtlich),
   Shelley «Frankenstein» 1818 (gutenberg.org #84, übersetzt), Lovelace
   Anmerkung G 1843 (fourmilab.ch, übersetzt), Butler «Erewhon» 1872
   (gutenberg.org #1906, übersetzt), Čapek «R.U.R.» 1920 (gutenberg.org
   #59112, Selver-Übersetzung, übersetzt). Aufdecken zählt als Spur
   (`vorhang-auf:zitat:i`).
2. **«Die KI-Story — ein Storyboard»** (`Storyboard.tsx`): 12 Stationen vom
   Golem zur Gegenwart — 6 gemeinfreie Bilder (public/art/storyboard/,
   Nachweis in CREDITS.md: Aleš-Golem, Simm-Homunkulus, Racknitz-
   Schachtürke, Holst-Frankenstein, Babbage-Holzstich, NASA-Supercomputer)
   + 6 gestaltete Panels im Gewebe-Stil (Dartmouth-Tafelrunde, WENN/DANN,
   Expertensystem-Terminal, KI-Winter, Streudiagramm, Schichten-Netz).
   Danach «Phasen der aktuellen KI» (Wahrnehmung, Verstehen, Generieren,
   Entscheiden) — **die letzten beiden (Kollaborieren, Transzendieren?)
   bewusst offen** (gestrichelte Karten): Kollaborieren ist das Thema des
   Moduls selbst.
3. Danach wie gehabt: drei Szenen, Netz der Akteurin, Weiter-Links.

**Entfernt:** das Einschätzungs-Raster «Akteurs-Modell» (Eigenschaften
Mensch/Werkzeug/KI zuordnen) — Datei gelöscht, Spur-Bereich im
Orakel-Dashboard durch «Zitate aufgedeckt» (5) ersetzt (Gesamt neu 49).

---

## 2026-07-11 — Thema 04 «Das Orakel»: Dashboard, anonyme Zweifach-Sammlung, KI-Querschnitt

Lernseite 2 hat einen **vierten Themenbereich**: `das-orakel` («Das Orakel —
erkenne dich selbst», Delphi-Motto). Persönlicher Rückblick + anonymer
Vergleich + KI-Deutung.

**Datenschutz-Architektur (zweifach gesammelt, wie mit Christof besprochen):**

1. **Lokal (Browser):** die eigenen Spuren (welche Knoten in FadenNetz,
   KnotenNetz, Zeitstrahl-Bausteinen, Akteurs-Modell besucht wurden —
   `lernseite-2/_lib/spuren.ts`, localStorage `ki26-spuren-lernseite-2`),
   der eigene Satz, die eigene Poll-Wahl. Verlässt das Gerät nie.
2. **Anonym (Firebase):** (a) pro besuchtem Knoten nur `+1` auf einen
   Aggregat-Zähler (bestehende Poll-Mechanik,
   `abstimmungen/ki26/polls/spuren-lernseite-2`) — ohne Namen/Code, gleiche
   Klasse wie die bisherigen anonymen Polls; (b) Sätze zur offenen Frage
   NUR auf ausdrücklichen Klick «Anonym teilen»
   (`abstimmungen/ki26/orakel-aussagen`, via Route Handler + Admin SDK,
   ohne studentCode/IP); (c) Poll «orakel-blick».

**KI ohne Datenzugriff:** Die KI greift NIE auf Firestore oder Browser-Daten
zu. `/api/orakel/querschnitt` (Admin SDK) verdichtet die anonyme Sammlung
serverseitig zu einer Text-Zusammenfassung (Zähler + geteilte Sätze) und
reicht nur diese an die Messages API. Der Vergleich «du ↔ alle» wird im
Browser gerechnet (lokales Exemplar neben anonymen Gesamtzahlen).

**Kosten:** Modell `claude-haiku-4-5` (günstigstes geeignetes, Vorgabe
«möglichst wenig Kosten»); Kommentar wird in
`abstimmungen/ki26/orakel-meta/stand` gecacht und höchstens neu erzeugt,
wenn ≥5 neue Sätze UND >30 Min. seit dem letzten Lauf (bzw. beim ersten Mal
ab 3 Sätzen). Aufruf per `fetch` statt SDK — `package.json` ist geteilt,
kein neues Paket ohne Absprache. Server-Env `ANTHROPIC_API_KEY`
(`.env.local.example` ergänzt; in Vercel setzen). Ohne Schlüssel läuft alles,
das Orakel meldet dann, dass es noch schweigt.

Betrifft: `src/app/lernen/lernseite-2/das-orakel/**`, `_lib/spuren.ts`,
FadenNetz/KnotenNetz (`spurKey`), Zeitstrahl-`toggle`, AkteursModell,
`src/app/api/orakel/{aussage,querschnitt}/route.ts`, `unit.ts`
(lernseite-2-Block), Hub-Signatur «orakel».

---

## 2026-07-11 — FadenNetz: individuelle Muster statt Einheits-Faden am Seitenkopf

Der Weisheits-Faden am Kopf der Themenseiten (ein Bogen, überall gleich) ist
durch **FadenNetz** ersetzt (`lernseite-2/_components/FadenNetz.tsx`,
`WeisheitsFaden.tsx` gelöscht): Jede Seite trägt oben ihr **individuelles
Muster aus mehreren Fäden**, denen man einzeln, in beide Richtungen und auf
**unterschiedlichen Wegen** nachfahren kann (pro Faden eigene Spur, kein
Teleport; Knoten zählen auch mitten auf Kreuzungen als erreicht).

- **Vorhang auf — Auftritts-Stern:** 6 Strahlen + 2 Nebenfäden, 7 Weisheiten
  (Zentrum Shakespeare/Bühne; aussen Heraklit, nach Sokrates, Wittgenstein,
  Descartes, Turing 1950 «Können Maschinen denken?», nach Arendt).
- **Philosophische Perspektive — Epochen-Linie:** 5 beschriftete Knoten
  (Antike→Jetzt) mit den Schablonen-Zitaten und Sprung-Knopf zum
  Zeitstrahl-Panel. Der frühere separate Abschnitt «Fünf Epochen im
  Überblick» (KnotenNetz) ist entfernt — war nach dem Umbau ein Duplikat.
- **Kulturelle Perspektive — Gewebe:** 3 Schuss- + 3 Kettfäden, Weisheiten
  an den Kreuzungen (Zentrum Klee; Goethe, Wilde, Schiller, nach da Vinci).

Die KnotenNetz-Abschnitte «Das Netz der neuen Akteurin» (Vorhang auf) und
«Figuren im Gewebe» (Kulturell) bleiben — anderes Thema als die Weisheiten.

---

## 2026-07-11 — KnotenNetz: die Signatur-Symbole gross und bedienbar

Die drei Konstellations-Signaturen vom Hub gibt es jetzt auf ihren Seiten
in gross und **interaktiv** (`lernseite-2/_components/KnotenNetz.tsx`):
Knoten antippen (oder per Tastatur) → Erklär-Karte darunter (aria-live),
besuchte Knoten bleiben markiert, Zähler «n von m Knoten entdeckt»,
Hover lässt Knoten wachsen.

- **Vorhang auf — «Das Netz der neuen Akteurin»** (Auftritts-Signatur):
  Zentrum KI + sechs Fäden zu Nutzer:innen, Sprache, Datencentren,
  Rohstoffen, Unternehmen, Regeln — die Akteur-Netzwerk-Idee zum Antippen
  (spiegelt die «Wir – Netz»-Installation).
- **Philosophische Perspektive — «Fünf Epochen im Überblick»**
  (Epochen-Signatur, beschriftet): je Knoten Denker + Schablone, dazu Knopf
  «Zur Epoche im Zeitstrahl» — springt zum Panel (Anker `epoche-{id}` +
  `scroll-mt` im Zeitstrahl). Wichtig: `scrollIntoView({behavior:"smooth"})`
  ist in manchen Umgebungen wirkungslos → Fallback nach 350 ms hart springen.
- **Kulturelle Perspektive — «Figuren im Gewebe»** (Gewebe-Signatur):
  an den Kreuzungen Golem, Frankenstein, HAL 9000, Samantha («Her»), im
  Zentrum «Dein Blick — heute».

---

## 2026-07-11 — WeisheitsFaden: interaktive Muster auf allen Themenseiten

Das Gewebe-Motiv wird interaktiv: Auf allen drei Themenseiten von Lernseite 2
liegt unter dem Header ein **WeisheitsFaden**
(`lernseite-2/_components/WeisheitsFaden.tsx`) — ein Faden, dem man mit Maus
oder Finger **nachfahren** kann (Akzentfaden zieht mit, Springen ist bewusst
blockiert — nur Vorwärtsbewegung nahe am Faden zählt). An den Knoten
erscheint je eine **Weisheit** (Zitat + Brückensatz zum Seitenthema); Knoten
sind auch direkt antipp- und per Tastatur fokussierbar (aria-live-Karte).
Einladung über Puls am Fadenanfang + Hinweiszeile («Fahr dem Faden nach»),
Zähler «n von m Knoten besucht».

Weisheiten je Seite (gemeinfreie Denker bzw. gekennzeichnete Paraphrase):
- **Vorhang auf:** Shakespeare (Bühne), Heraklit (panta rhei), Wittgenstein
  (Grenzen der Sprache), «nach Hannah Arendt» (Anfangen).
- **Philosophische Perspektive:** die fünf Epochen-Schablonen (Aristoteles,
  Augustinus, Kant, Marx, «Wir — jetzt» als offene Frage) — spiegelt den
  Zeitstrahl darunter.
- **Kulturelle Perspektive:** Klee (macht sichtbar), Goethe (man erblickt,
  was man weiss), Wilde (Leben ahmt Kunst nach).

Zusätzlich reagieren die statischen Muster (GewebeBand, Knoten, FadenDivider,
Signaturen) jetzt auf Hover: Akzentknoten wachsen, Akzentfäden treten hervor
(CSS-only, `motion-reduce` respektiert beim Puls).

---

## 2026-07-11 — Lernseite 2 neu strukturiert: drei Themenbereiche + Gewebe-Design

**Struktur:** Lernseite 2 («Eine ganz neue Partnerschaft») hat neu **drei
Themenbereiche** statt vier Platzhalter-Submodule:

1. **Vorhang auf — eine neue Akteurin** (`vorhang-auf`) — Auftakt in drei
   Szenen (Auftritt, Irritation, Frage) + interaktives Akteurs-Modell
   (aus `sandbox/intro-visual` übernommen).
2. **Philosophische Perspektive** (`philosophische-perspektive`) — der
   Schablonen-Zeitstrahl, aus `sandbox/philosophie-schablonen` ins Modul
   portiert (Komponenten in `_components/`).
3. **Kulturelle Perspektive** (`kulturelle-perspektive`) — neu, im Aufbau:
   Erzählungen/Kunst prägen den Blick auf KI.

Die früheren Platzhalter «Quellen, neu aufgespürt», «Ich bin ganz Ohr» und
«AI-Slop macht kreativ» sind aus der Navigation entfernt (Git-History hat
sie); Teile davon können später in der kulturellen Perspektive aufgehen.
Alte Sandbox-URLs bleiben als Redirects gültig. `sandbox/umfrage`
(Perspektiven-Check) bleibt Werkstatt — vorgesehen für den Auftakt.

**Design:** Neues grafisches Leitmotiv für Lernseite 2 — nicht typische
KI-Symbolik (Roboter/Neuronen-Glow), sondern das **Fadenhafte, Knotenhafte,
Gewebhafte** (Akteure als Knoten, Beziehungen als Fäden; Referenzen:
natalitaet.com, antrhizom.com — hier bewusst noch reduzierter: keine
Gradients, kein Glow, nur feine Linien + Knoten in MD3-Tokens).
Wiederverwendbare SVG-Deko in `lernseite-2/_components/Gewebe.tsx`
(GewebeBand, FadenVertikal, Knoten, FadenDivider, Signatur je Thema); der
Hub zeigt die drei Themen als Stationen an einem durchlaufenden Faden.

Betrifft: `src/config/unit.ts` (nur lernseite-2-Block), `src/app/lernen/lernseite-2/**`,
`src/app/sandbox/{philosophie-schablonen,intro-visual}/page.tsx` (Redirects).

---

## 2026-07-07 — Quellenlinks durchgehend deutschsprachig

Im Submodul „Philosophische Perspektive" (Schablonen-Zeitstrahl) führten die
Belege der drei Bausteine (Technische Errungenschaft / Verunsicherung /
Philosophische Orientierungshilfe) mehrheitlich auf **englische** Seiten (Stanford
Encyclopedia of Philosophy, IEP, en.wikipedia, Britannica, arXiv, CERN, New
Advent). Für eine deutschsprachige Lernumgebung wurde alles auf **deutsche**
Entsprechungen umgestellt: de.wikipedia.org (Existenz je Artikel via
MediaWiki-API geprüft), de.wikisource.org (Kant, „Was ist Aufklärung?") und das
**deutsche Original** des Kommunistischen Manifests auf marxists.org/deutsch.
Statt der englischsprachigen SEP-Artikel zu Technikphilosophie/Cyborg-Manifest
verweisen die Gegenwarts-Belege jetzt direkt auf die im Text genannten Denker:
Akteur-Netzwerk-Theorie (Latour), Donna Haraway, Markus Gabriel. Alle 29 URLs
am 2026-07-07 live auf HTTP 200 geprüft.

Betrifft: `src/app/sandbox/philosophie-schablonen/SchablonenZeitstrahl.tsx`
(`techSources`/`unrestSources`/`orientSources` aller fünf Epochen + Header-Notiz).

---

## 2026-06-27 — FIREBASE_SERVICE_ACCOUNT muss einzeilig sein

Next.js parst `.env.local` zeilenweise. Ein mehrzeiliger Service-Account-JSON-Wert
wird nach der ersten Zeile (`{`) abgeschnitten → Route Handlers antworten mit 503.
Lösung: JSON minifizieren (python one-liner) **oder** als Base64 kodieren. Beides
dokumentiert in `.env.local.example`. `firebaseAdmin.ts` akzeptiert beides
(auto-detect: beginnt mit `{` → roh, sonst Base64).

Betrifft: `.env.local` lokal, Vercel-Env (dort kein Problem, da Secret-Felder
einzeilig gespeichert werden).

---

## 2026-06-26 — Volle 10mio-Parität: Registrierung, Klassencode & Lehrer-Report

Architektur-Kurswechsel (mit Pietro): ki26 bekommt denselben Tier wie 10mio —
freie Registrierung mit **Animal-Code** (`BÄR-334`), optionaler **Klassencode**
(Lehrer-beansprucht, secret-geschützt, single-owner) und ein **Lehrer-Report**
mit Pro-Schüler-Fortschritt plus Klasse-vs-alle-Poll-Aggregaten. Umsetzung von
`docs/PLAN_registrierung-klassencode.md`, Milestones R0–R5. Nicht-offensichtliche
Entscheide:

- **Backend als Next.js Route Handlers + Firebase Admin SDK** (nicht Cloud
  Function): ki26 darf nie ins geteilte `iperka-lms` deployen. Das Admin SDK
  umgeht die Rules → `teachers/*`-Zugriff ohne Rules-Änderung. Service-Account
  als `FIREBASE_SERVICE_ACCOUNT` (Vercel-Env / `.env.local`).
- **Datenschutz revidiert**: Das frühere „nur anonyme Aggregate"-Statement
  (2026-06-20 / 2026-06-24) gilt nicht mehr. ki26 speichert jetzt **pseudonyme
  Pro-Schüler-Daten** (Animal-Code → Fortschritt) unter
  `abstimmungen/ki26/students/{code}`. Persönliche Detaildaten (Reflexionen,
  Werte-Profil, Einzelantworten) bleiben weiterhin **lokal**; gespiegelt wird nur
  ein minimaler Fortschritts-Snapshot (pct, Quiz-Punkte, Stations-Abschluss).
- **Spiegel additiv, localStorage bleibt UX-Quelle**: `progressMirror.ts` +
  `ProgressMirror.tsx` lesen den lokalen Store und schreiben periodisch ein
  `progress/{moduleId}`-Doc. No-op ohne Session → anonyme Nutzung ohne Code bleibt
  möglich.
- **Poll-Klassen-Namespace an echten Code gekoppelt**: `resolveKlasse()` liest
  jetzt zuerst `session.teacherCode` (statt nur `?klasse=`/localStorage). Die
  bestehenden `kp-{klasse}-*`-Zähler bleiben unverändert und füttern den Report.
- **Geteilte Dateien**: Neue `src/lib/*`-Dateien sind „gemeinsam"; `ActivityTracker.tsx`
  wurde **nicht** angefasst (R6 verschoben). Christofs Anbindung steht in
  `docs/handoff-firebase-ki26.md`.
- **Verifikation offen**: Build/Lint/Firestore-Test laufen bei Pietro auf Windows
  (Cowork-Sandbox kann nicht zuverlässig bauen / kein Firestore-Egress).

---

## 2026-06-26 — M10: Hash-Routing für adressierbare Schritte (Lernseite 1)

Der Navigations-Zustand der KI-Einheit v3 lebt jetzt im **URL-Hash**
(`/lernen/lernseite-1#/station/2/fakten/3`). Jeder Schritt ist adressierbar,
reload-fest, über Browser-Zurück/Vor blätterbar und deep-linkbar. Nicht-
offensichtliche Entscheide:

- **Hash statt Query** (Variante B, OPEN DECISIONS 13 liess Query/Hash offen;
  Pietro war unsicher, Claude-Entscheid): Der ganze v3-Flow ist `"use client"`.
  Query-Routing (`useSearchParams`) erzwingt eine `<Suspense>`-Grenze und Scroll-
  Restoration-Eigenheiten; Hash ist rein clientseitig, braucht das nicht, lässt
  `page.tsx` unberührt und verhält sich identisch auf Vercel. In der fragilen
  OneDrive/Build-Umgebung das risikoärmere.
- **Frame-genau (sub + Position), nicht nur Subpage**: Die Acceptance verlangt
  «Neuladen landet auf demselben Schritt» — ein Schritt ist ein Frame. Encodiert
  wird die **1-basierte Position innerhalb der Subpage** (robust gegen Inhalts-
  Umordnung), bei Overflow geklammert.
- **`_lib/route.ts` ist die einzige Stelle mit `history`-Zugriff.** `KiEinheitV3`
  besitzt `useRoute()` und reicht `route` + `push`/`replace` als `nav` durch.
  `pushState` = bewusster Schritt; `replaceState` = Auto-Advance (Browser-Zurück
  überspringt die automatischen Mikro-Schritte). `localStorage` (`ki26-v3-phase`)
  bleibt nur **Fallback** bei leerem Hash.
- **Alle Routing-Props optional.** Ohne `nav` (z.B. `/v3-preview`, das
  `<ZeitstrahlMenu />` ohne Props rendert) bleibt das alte lokale State-Verhalten;
  v2-Komponenten unberührt.
- **ki26-konform:** Der Hash trägt **nur Navigations-State** — keine Antworten,
  Punkte oder Profile. Persönliche Daten bleiben in localStorage.
- **In-Sandbox-`tsc` bestätigt unbrauchbar:** Der Cowork-bash-Mount dehydriert
  per File-Tool editierte OneDrive-Dateien (sah `AbschlussV3.tsx` bei Z.132
  abgeschnitten → Phantom-«JSX no closing tag»-Fehler). Typprüfung manuell;
  build/lint macht Pietro auf Windows (massgeblich).

## 2026-06-26 — v3 Improv-Plan v3: neun UX-/Logik-Verbesserungen an Lernseite 1 (#7 Dark Mode zurückgestellt)

Umsetzung von `docs/improv-plan-v3.md` (Lernseite 1, KI-Einheit). Acht der neun
Punkte umgesetzt; **#7 Dark Mode bewusst zurückgestellt** (berührt `gemeinsam`-
Dateien — erst nach Absprache mit Christof). Nicht-offensichtliche Entscheide:

- **«Subpage» → «Schritt» nur im sichtbaren Text** (#5). In `stationenV3.ts`
  wurden die `inhalt`-Strings ersetzt (`Subpage n/7` → `Schritt n/7`); interne
  Identifier (`SubpageKey`, `SUBPAGE_*`, `subpages`, `StationSubpages`) bleiben.
- **Werte-Karten ohne «wischen»** (#1). Es gibt kein Swipe-Gesture, nur zwei
  Buttons → alle «wische»-Formulierungen entfernt, Buttons «Sehe ich anders /
  Sehe ich auch so» (Icons `thumb_down`/`thumb_up`), `SUBPAGE_ICON.swipe` =
  `touch_app`. Die doppelt gepflegte Karte ist jetzt eine geteilte Komponente
  `_components/WerteKarte.tsx` (Auftakt + Station).
- **Auto-Advance: 850 ms + Einblend-Animation** (#2). Gemeinsame Konstante
  `AUTO_ADVANCE_MS = 850` in `_lib/ui.ts` (kein Magic Number). Neue
  `@keyframes frame-in` + `.animate-frame-in` in `globals.css`, respektiert
  `prefers-reduced-motion`.
- **Faktencheck-Scroll + sticky Navigation** (#3). Nach der Antwort scrollt die
  Auflösung in den Blick; die untere Navigationszeile in `StationV3` ist
  `sticky bottom-0` → «Weiter» bleibt bei langen Frames erreichbar.
- **60 %-Gate + Faktencheck-Bonus + Stations-Reset** (#9). Eine Station gilt erst
  ab **≥ 60 %** der Quiz-Basispunkte als abgeschlossen (`stationErfuellt`,
  `markStationAbgeschlossen` nur dann). Der **Faktencheck zählt nur als Bonus**
  (max. **+10 %** des Stations-Totals, `stationBonus`), **nicht** im 100 %-Nenner.
  Gate pro **Station** (nicht pro Schritt — Pietro-Entscheid). Unter 60 %: klare
  Meldung + **«Station neu starten»** (`resetStation`, löscht nur die lokalen
  Daten **dieser** Station nach Bestätigung; kein Einzelfrage-Retry). Hinweis:
  Reset löscht localStorage-Lernfortschritt, **keine Dateien** — Pietros Regel
  «nichts ohne Zustimmung löschen» bezieht sich auf Dateien.
- **Auswertung nach jeder Poll-Serie** (#8). Neuer geteilter Baustein
  `_components/PollAuswertung.tsx` (aus `KlassenSpiegel` herausgelöst, der ihn nun
  wiederverwendet → keine Doppelpflege). Erscheint nach der Auftakt-Haltung
  (pre) und nach den Befund-Post-Polls jeder Station (post): «Ich · meine Klasse ·
  alle» pro 4er-Skala-Frage. **Pre-Serie (Entscheid a):** kein neues Pre-Aggregat
  gecastet — `PollAuswertung` liest die vorhandenen `{pollId}-pre`-Buckets (von
  `Skala4Frage` ohnehin gecastet) und rendert Klasse/Alle freundlich leer, falls
  noch nichts vorliegt. Nur anonyme Aggregate; persönliche Stufe bleibt lokal.

## 2026-06-26 — v3 M9 QA: §4 voll konform; ActivityTracker-Telemetrie als geteilter-Datei-Entscheid offen

QA-Pass (zwei Sonnet-Subagenten, read-only Audit + Gegenprüfung in der Hauptsession).
Ergebnis und zwei nicht-offensichtliche Entscheidungen:

- **quizBezug-«Overcount» ist kein Defekt.** Für St1 (sonne=3), St3 (schatten=4),
  St6 (schatten=3), St7 (sonne=3) sind mehr als 2 Quizfragen einem Medium getaggt.
  `buildFrames` in `StationV3.tsx` deckelt sonne/schatten aber via
  `.slice(0, FRAGEN_PRO_MEDIUM)` (=2) und routet **jede** überzählige Frage in
  `recapFragen` — nichts geht verloren. Damit ist §4.4 («≤2 unter dem Medium, Rest
  als Recap») zur Laufzeit erfüllt. Tags in `quizBezug.ts` bewusst **nicht**
  reduziert: welche 2 Fragen unter dem Medium stehen, ist eine didaktische
  Kuratierung für Pietro, kein Bugfix.
- **ActivityTracker bleibt vorerst unverändert (Pietro-Entscheid).**
  `src/lib/activity.ts` schreibt pro Seitenaufruf `{uid, userAgent, page}` nach
  Firestore `activities`. Das steht in Spannung zu §4.11 (Cloud nur anonyme
  Aggregate), ist aber (a) eine **geteilte** Basis-App-Datei (Scope-Guard),
  (b) von Hausregel §2 ausdrücklich auf jeder Seite vorgeschrieben, (c) auch in
  Christofs lernseite-2 aktiv. Deshalb in M9 **nicht** eigenmächtig geändert,
  sondern als Entscheid an Pietro übergeben (Optionen A No-op / B cloud-freie
  Variante + Hausregel §2 nachziehen / C behalten + dokumentieren). Details in
  `docs/material-pietro/QA_v3.md` §3.
- **In-Scope-Fix erledigt:** «✔ »-Präfix aus 5 Quiz-Feedbacks in Station 7
  (`stationenV3.ts`) entfernt — Hausregel «keine Emojis», Stil-Angleichung an die
  anderen sechs Stationen.

---

## 2026-06-26 — v3 M10 geplant: Subpages als adressierbare Schritte (Variante B, nach M9)

Pietro-Feedback: jeder Schritt soll eine **eigene URL** haben (reload-/back-/deep-fest),
nicht nur Client-State. Als neuer Milestone **M10** in `DEV_PLAN_v3.md` (§5 + Checkliste)
festgehalten. Entschieden:

- **Reihenfolge: nach M9.** M9 (Inhalts-/Logik-QA) läuft auf dem stabilen
  Navigationsmodell; der strukturelle Routing-Umbau kommt danach.
- **Umsetzung: Variante B** — Schritt-State in die URL der bestehenden Route
  `/lernen/lernseite-1` spiegeln (Query/Hash + `pushState`/`popstate`), additiv in
  `KiEinheitV3` (Phase) + `StationV3` (Frame-Index) + Auftakt/Abschluss. Variante A
  (echte App-Router-Segmente) verworfen — zu grosser Umbau, kollidiert mit dem
  Single-Page-Orchestrator.
- **ki26-konform:** die URL trägt **nur Navigations-State**, keine Antworten.

(Noch nicht umgesetzt — Scoping; Umsetzung in einer eigenen M10-Session nach M9.)

---

## 2026-06-26 — v3 M8 (Teil 4): UX-Verbesserungen (Pietro-Feedback)

Vier Verbesserungen, in dieselbe M8-Arbeit gefaltet (Review: `review/M8-ux.md`):

- **Auto-Advance.** Nach einer **diskreten** Antwort (4er-Skala-Poll *oder*
  Swipe/Werte) springt automatisch die nächste Frame (≈350 ms). Bewusst **nur
  innerhalb derselben Subpage** — der Subpage-Wechsel bleibt ein expliziter
  «Weiter»-Klick. **Slider lösen nie aus** (kontinuierlich). Weiter/Zurück bleiben
  immer nutzbar; Ref-Guard verhindert Doppelsprung. Damit bleibt §4.2 («eine
  Frage/Frame, Weiter blättert») erfüllt — «Weiter» existiert weiterhin.
- **Subpage-Navigation klarer (StationV3).** Anklickbarer **7-Subpage-Stepper**
  (Sprung zur ersten Frame der Subpage), **einheitlicher Subpage-Kopf** (Typ-Icon +
  Name + Position, über alle Stationen gleich), **«Weiter: <Name>»** in Tertiärfarbe
  signalisiert den Übergang in die nächste Subpage. Die bisher frame-internen Zähler
  («Fakt X von Y», «Frage X von Y») wurden in den Subpage-Kopf zusammengeführt — eine
  konsistente Stelle statt mehrerer. Der redundante Subpage-Name im Stations-Kopf
  wurde entfernt (Stepper + Kopf tragen ihn).
- **Auftakt-Opener-Schwanz.** Die zwei optionalen Videos (Musik-Experiment, Robotik)
  stehen **nebeneinander** als beschriftete Karten (Titel, Kurzbeschrieb, «freiwillig»),
  einzeln abspielbar — freie Wahl statt gestapelter Block. Daten:
  `auftakt.ts` → `OPENER_SCHWANZ_KARTEN`.
- **Quiz-Recap-Copy.** «Beantworte fünf Fragen …» / «5 zufällige Fragen aus unserem
  Pool …» → «… die **restlichen** Fragen …» (St. 2 + St. 7). Die Recap-Subpage zeigt
  die übrigen Pool-Fragen (8 − unter den Medien platzierte = 5–8); der harte Zähler
  passte nicht zur «… von 6»-Anzeige.

---

## 2026-06-26 — v3 M8 (Teil 3): Auftakt-Neuinhalt (Swipe-Set + globale 4er-Skala-Pre-Polls)

Letzter offener M8-Punkt (Spec §74). Entscheidungen mit Pietro:

- **Globale 4er-Skala-Pre-Polls = «Pre+Post, voll aggregiert».** Zwei
  übergreifende Haltungsfragen (`global-einschaetzung`,
  `global-gesellschaft`) als 4er-Skala: **Pre** im Auftakt (Schritt «Haltung»),
  **identisches Post** im Abschluss (Sektion «Meine Haltung — nachher»), gleiche
  geteilte Komponente `Skala4Frage` (Spec-§6-Konsistenz). Sie **ergänzen** den
  globalen Chance↔Bedrohung-**Schieberegler** (persönliche Bewegung); die
  4er-Skala dient der **Aggregation** (Ich/Klasse/alle). Erscheinen im
  Klassen-Spiegel als zwei **«Gesamthaltung»-Zeilen vor den Stationen**.
- **Bewusst KEINE Radar-Landkarte-Achse** für die zwei globalen Polls: ihr
  `landkarteAxis` zeigt absichtlich auf eine ID **ausserhalb** `LANDKARTE_ACHSEN`,
  damit `landkarteAchsenMitDaten()` sie nicht ins Radar zieht. Die globale
  Radar-Achse bleibt der Slider (§10) — die zwei Polls leben nur im Spiegel.
- **Auftakt-Swipe-Set = 6 Karten + optionale Aggregate.** Sechs Wertaussagen,
  je 2 pro Werte-Profil-Achse (Regulierung↔Innovation, Mensch-im-Loop↔Effizienz,
  Datenschutz↔Bequemlichkeit). Profil **lokal** unter Pseudo-Station `auftakt`
  (speist `werteProfilBalken`); zusätzlich **optionale** anonyme Aggregat-Zähler
  je Karte (`castSwipe`, Bucket `links`/`rechts`, derzeit nicht angezeigt).
  **Polaritäts-Konvention:** Zustimmen (rechts) = rechter Pol der Achse.
- **Auftakt jetzt 5 paginierte Schritte** (eine Frage/Karte pro Frame, §4):
  Vorwissen · Reiz · Position (Slider) · Haltung (2 Skala-Pre) · Werte (6 Swipe);
  `einheitStarten` ans Ende verschoben, `preGesetzt`-Gate entfernt.
- **Neue Dateien:** `_data/auftaktPolls.ts`, `_data/auftaktSwipe.ts`,
  `_components/Skala4Frage.tsx`. **Geändert:** `AuftaktV3.tsx`, `AbschlussV3.tsx`,
  `KlassenSpiegel.tsx`, `_lib/unitPolls.ts` (`castSkala`, `castSwipe`). Nur
  `lernseite-1`; keine gemeinsamen Dateien. Review: `review/M8-auftakt.md`.

---

## 2026-06-26 — v3 M8 (Teil 2): Medien-Regeln (§9), Station-4-Schutz (§10), a11y

Invarianten-kritische Technik-Politur von M8 (additiv, nur `StationV3.tsx`):

- **§9 Audio:** Der MP3-Renderer war ein nacktes `<audio>` und ignorierte
  `start`/`end`/`segments` — neue Komponente **`AudioClip`** springt zum Start,
  stoppt hart am Ende und spielt **Mehr-Segment-Fenster** (`segments[]`)
  nacheinander, überspringt die Lücken (Station 5 Sonnenseite). Robust gegen
  Scrubben (aktives Fenster pro `timeupdate` neu bestimmt).
- **§9 YouTube:** «Mehr-Segment» bleibt bewusst als **geteilte
  Einzel-Ausschnitte** (zwei Pole auf Sonnen-/Schattenseite) gelöst — **keine**
  YouTube-IFrame-Player-API. §9 ist erfüllt; der harte Stopp via `&end` bleibt
  best-effort, die Caption nennt das Fenster.
- **§9 SRF & Station 7:** unverändert korrekt (iframe immer ganz + `guidance`;
  3Blue1Brown deutsch) — nur bestätigt.
- **§10 Station 4:** `station.warnung` erscheint jetzt **zusätzlich am Einstieg**
  (Auftakt-Subpage), damit man die freiwillige Station vor dem Einlassen skippen
  kann; Opt-in-Vertiefung + Hilfsangebote **143/147** unverändert.
- **a11y:** Fokus wandert bei jedem Frame-Wechsel auf den neuen Inhalt
  (`tabIndex=-1` + `useEffect`, kein Fokus-Klau beim ersten Render),
  `role="progressbar"`, `aria-pressed` (Skala/Swipe-Auswahl), `aria-live`
  (Faktencheck- und Wahr/Falsch-Auflösung).

Verifikation: in-Sandbox `tsc` erneut unbrauchbar (OneDrive-Dehydrierung —
`StationV3.tsx` als 638 statt ~935 Zeilen, Pseudo-Fehler in nicht angefassten
Dateien). Build/lint massgeblich auf Windows (Pietro). Review:
`review/M8-medien-a11y.md`.

---

## 2026-06-26 — v3 M8 (Teil 1): Casting-Kern — erstmals Cloud-Writes (anonyme Aggregate)

M8 in einer abgesprochenen Teil-Lieferung begonnen (mit Pietro: M7 = grün; diese
Session **nur** der Casting-Kern). Ab jetzt schreibt die Einheit erstmals nach
Firestore — **ausschliesslich anonyme Aggregat-Zähler**, die die schon
bestehende Lese-Schicht (`KlassenSpiegel`) füllen.

1. **Was gecastet wird** (`castPollVote`/`voteOnce`, ein Cast pro Browser pro
   Ziel-ID): 4er-Skala-Polls (**nur Post**), die Schieberegler (global + St. 7
   `st7-vertrauen`, **beim Loslassen** — sonst zählt jeder Zwischenwert beim
   Ziehen) und die **Vorwissen**-Auswahl (beim Start). Persönliche Werte bleiben
   strikt lokal.
2. **Bucket-Schema:** 4er-Skala → Basis-Key `{pollId}-post`, Bucket `s0..s3`
   (genau die Keys, die `KlassenSpiegel` liest). Slider → `{pollId}-{phase}`,
   Bucket `scaleBucket(0..100)`. Vorwissen → `aw-{optId}`, Bucket `ja`. Helfer
   zentral in `_lib/unitPolls.ts` (`castSkalaPost`/`castSlider`/`castVorwissen`).
3. **Warum 4er-Skala nur Post:** die Aggregation dient dem Vorher/Nachher-
   Vergleich im Spiegel (liest Post). Pre bleibt persönlich-lokal. Slider casten
   pre **und** post (für spätere Bewegungs-Aggregation; Reader folgt).
4. **Quiz-«% richtig»** bewusst **nicht** gecastet (Spec §6: optional) — bleibt
   für später offen.
5. **Verifikation in der Cowork-Sandbox weiterhin eingeschränkt:** OneDrive
   dehydriert die per File-Tool editierten Dateien (bash las `unitPolls.ts` mit 76
   alten statt ~115 neuen Zeilen) → in-Sandbox `tsc`/`build` prüfen veralteten
   Code und sind unbrauchbar. Edits über das Read-Tool (Windows-Sicht) bestätigt +
   manuell typgeprüft; `npm run build`/`lint` + Firestore-Sichtprüfung macht
   Pietro auf Windows. Details: `docs/material-pietro/review/M8-casting.md`.

---

## 2026-06-26 — v3 M7: volle Verdrahtung, v3 ist live (Auftakt + Zeitstrahl + Abschluss)

M7 macht die Einheit an der echten Adresse `/lernen/lernseite-1` spielbar. Mit
Pietro abgestimmte Festlegungen, die nicht aus dem Code allein ersichtlich sind:

1. **v3 geht live.** `page.tsx` rendert neu `KiEinheitV3` (State-Machine
   `auftakt → stationen → abschluss`, Phase reload-fest in `ki26-v3-phase`). Der
   **v2-Flow** (`KiEinheit`, `Auftakt`, `Abschluss`, `StationenMenu`) **bleibt im
   Repo, ist aber nicht mehr eingebunden** — Entfernen erst in einem späteren
   Aufräum-Schritt (mit Pietro).
2. **Auftakt = «lean local-only» (Option A).** `AuftaktV3`: Vorwissen
   (Mehrfachauswahl + Freitext, lokal) → Hype-Opener (Ava-Video) → globaler
   **Pre-Slider**. **Keine** Cloud-Writes. Bewusst weggelassen und **auf M8
   verschoben**: 1–2 globale 4er-Skala-Pre-Polls (erst mit Casting sinnvoll) und
   ein Auftakt-Swipe-Set (Spec §74; neuer, zu reviewender Inhalt). Eigene
   Lernziel-Karte inline, weil die v2-Karte einen WissenCheck/Stimmungsbild
   verspricht, die der schlanke Auftakt nicht hat — geteilte `auftakt.ts`
   unangetastet.
3. **Abschluss** (`AbschlussV3`): Post-Slider mit Pre→Post-Pfeil + Landkarte +
   Klassen-Spiegel + Zertifikat-Zugang ab 3. Liest Aggregate nur (Klasse/alle
   «n=0» bis Casting in M8).
4. **Additive Prop-Hooks statt Umschreiben** (OneDrive-schonend): `GlobalSlider`
   bekam optional `onChange`, `ZeitstrahlMenu` optional `onWeiterZumAbschluss`
   (→ Button «Zum Abschluss»; ohne Prop unverändert = `/v3-preview`).
5. **Geteilte `src/config/unit.ts`** (mit Pietro abgesprochen): Lernseite-1-
   Beschreibung von v2-Sprache («Kollektiv-Spiegel») auf v3 umformuliert
   (Zeitstrahl, Sonnen-/Schattenseite, Badges, Chancen-Risiken-Landkarte,
   Zertifikat ab drei Stationen).

Verifikation: isolierte `tsc` (echte React-Typen + faithful App-Stubs) → 3 neue
Dateien EXIT 0. Build/lint macht Pietro auf Windows.

---

## 2026-06-26 — v3 M6: Landkarte (Radar) + globaler Slider + Klassen-Spiegel (lesen-only, neue Dateien)

M6 baut die rückwärts aus den Polls designte **Chancen-Risiken-Landkarte**, den
globalen **Bedrohung↔Chance-Slider** und den **Klassen-Spiegel**. Festlegungen,
die nicht aus dem Code allein ersichtlich sind (mit Pietro abgestimmt):

1. **Anonyme Aggregate in M6 NUR LESEN.** Landkarte/Spiegel lesen
   `loadPollCounts`/`subscribePollCounts`; das **Schreiben** (`castPollVote` in
   `PollFrame` + globalem Slider) kommt in **M8**. Bis dahin zeigen «Klasse»/«alle»
   `n=0`. M6 schreibt **nichts** in die Cloud (ki26-konform).
2. **Bucket-Schema für M8 festgelegt (vom KlassenSpiegel bereits gelesen):**
   4er-Skala → `s{Index}` (0..3), Keys `pollId.poll("{pid}-post")` bzw.
   `pollId.klassePoll(code,"{pid}-post")`; globaler Slider → `scaleBucket`.
3. **Landkarte = Radar/Spinnennetz** (SVG, keine Chart-Library); Ich-Fläche ab 3
   Achsen, sonst nur Punkte. Nur Achsen **mit lokalen Daten** werden gezeichnet →
   wächst mit den Stationen. MD3-Farben via `rgb(var(--color-*))`.
4. **Werte-Profil (Swipe, mehrachsig) separat** als links/rechts-Balken, nicht als
   eine Radar-Speiche (3 Achsen liessen sich nicht sinnvoll zu einer Speiche mitteln).
5. **Globaler Slider** lokal unter Pseudo-Station `"global"`, pollId
   `"global-chance-bedrohung"` (= `landkarte.ts`-Achse). Pre = Auftakt, Post =
   Abschluss (in M7 verdrahtet); in M6 beide in der `AbschlussVorschau`, um die
   Pre→Post-Bewegung zu demonstrieren.
6. **Surface = v3-Vorschau** (Button «Meine Landkarte» im `ZeitstrahlMenu`), analog
   M5. Echte Auftakt/Abschluss-Verdrahtung in `KiEinheit` bleibt **M7**.
7. **4er-Skala-Polarität:** Selektor nimmt Optionen **links→rechts entlang der
   Achse** an (Index 0 = linker Pol); in M9 pro Frage gegenprüfen.

Neue Dateien: `_lib/landkarteData.ts`, `_components/Landkarte.tsx`,
`GlobalSlider.tsx`, `KlassenSpiegel.tsx`, `AbschlussVorschau.tsx`. Geändert:
`ZeitstrahlMenu.tsx` (Button), `v3-preview/page.tsx` (Header). Review:
[`review/M6-landkarte-spiegel.md`](material-pietro/review/M6-landkarte-spiegel.md).

---

## 2026-06-26 — v3 M5: Zeitstrahl-Menü + client-seitiges Zertifikat (rein lokal, neue Dateien)

M5 (Timeline + Fortschritt + Zertifikat) bringt die freie Stationswahl und die
Belohnung. Festlegungen, die nicht aus dem Code allein ersichtlich sind:

1. **Neue v3-Komponenten statt Umbau der v2-`StationenMenu`.**
   [`_components/ZeitstrahlMenu.tsx`](../src/app/lernen/lernseite-1/_components/ZeitstrahlMenu.tsx)
   (Zeitstrahl der 7 Stationen, grün bei Abschluss, Fortschrittsbalken,
   Badge-Sammlung, Zertifikat-Gate) und
   [`_components/Zertifikat.tsx`](../src/app/lernen/lernseite-1/_components/Zertifikat.tsx)
   sind **neu**; die v2-`StationenMenu.tsx`/`_lib/fortschritt.ts` bleiben unberührt
   bis zur Migration in M7 (gleiche Linie wie stationenV3/StationV3/stationStore).
2. **M5 liest aus dem v3-Store, nicht aus v2-`fortschritt.ts`.** «grün», Fortschritt
   und Zertifikat speisen sich aus `stationStore.abgeschlosseneStationen` /
   `badgeSammlung` / `quizScore` (Abschluss wird in StationV3/BadgeFrame gesetzt).
   Das Menü liest den Stand beim Rücksprung neu (useEffect, SSR-sicher).
3. **Zertifikat = rein abgeleitet, kein eigener Store; «grün» = `tertiary`-Token.**
   Die Urkunde wird client-seitig aus dem lokalen Store berechnet (Stationen,
   Badges je Familie, Quiz-Punkte-Summe, Datum). **Download vorerst via «Drucken →
   als PDF speichern»** (`window.print()`, Steuerleiste `print:hidden`); echte
   Datei-Generierung ist optional (v3 §15.3 lässt das Layout offen). Das Grün der
   abgeschlossenen Stationen nutzt bewusst das **`tertiary`**-Token (RGB 29 105 64),
   da es im MD3-System die einzige grüne Rolle ist; `primary` bleibt Blau.
4. **Keine Cloud-Writes in M5.** Anonyme Aggregat-Zähler (Poll-Verteilung, Quiz
   «% richtig») bleiben für M6/M8; M5 ist vollständig lokal/ki26-konform.
5. **`v3-preview` rendert ab jetzt das Menü** statt direkt Station 1 — jede Station
   ist über das Menü erreichbar (M4-Durchklick bleibt möglich). M7 ersetzt die
   Vorschau-Route durch die echte Auftakt/Abschluss-Verdrahtung in `KiEinheit`.

---

## 2026-06-26 — v3 M4: lokaler Stations-Store, Persistenz statt Remount-Reset, Aggregate auf M6/M8 verschoben

M4 (Interaktions-Tiefe) legt die stateful Logik unter die M3-Shell. Drei nicht
aus dem Code allein ersichtliche Festlegungen:

1. **Neuer lokaler Store statt Erweiterung von `_lib/punkte.ts`.** Die v3-Logik
   (Quiz-Scoring, Swipe-Profil, Faktencheck-Zustand, Poll-Auswahl, Reflexion,
   Stations-Abschluss + Badge-Sammlung) lebt in der **neuen** Datei
   [`_lib/stationStore.ts`](../src/app/lernen/lernseite-1/_lib/stationStore.ts)
   (localStorage-Präfix `ki26-v3-`). `punkte.ts` (v2, per-qid) bleibt unberührt
   bis zur Migration in M7 — gleiche Linie wie stationenV3/StationV3 (Build-grün >
   wörtlicher Dateiname).
2. **Persistenz hebt den M3-Remount-Reset auf.** In M3 erzwang `key={i}` einen
   Remount, um die „klebende Auswahl“ zu fixen — verlor dabei aber die Antwort.
   Jetzt **hydrieren** die Frames ihren Anfangszustand aus dem Store, sodass
   `key={i}` bleiben kann und Zurück-/Vor-Navigation den Stand zeigt. **Quiz/Fakt
   = erste Antwort bindet** (Lernehrlichkeit); **Swipe = überschreibbar** (Haltung,
   kein richtig/falsch). Faktencheck-Variante (wahr/falsch) wird gespeichert →
   kein Neu-Würfeln beim Zurückblättern.
3. **Anonyme Aggregat-Zähler bewusst nach M6/M8 verschoben.** M4 schreibt **nichts**
   in Firestore — Quiz-«% richtig» und Poll-Verteilung sind im M4-Text explizit als
   optional/„see M6/M8“ markiert; M8 verdrahtet alle `abstimmungen/ki26/…`-Aggregate
   gebündelt. Vorteil: M4 ist rein lokal und in der Sandbox vollständig per
   isolierter `tsc` prüfbar (Voll-build/lint macht Pietro auf Windows). Station
   gilt als abgeschlossen beim Erreichen des Befund-Frames (idempotenter
   `markStationAbgeschlossen`-`useEffect`); `abgeschlosseneStationen` + `badgeSammlung`
   stehen für das Zertifikat in M5 bereit.

---

## 2026-06-26 — v3 M3-Iteration nach Pietros Test (Companion-Maps statt stationenV3-Umbau)

Nach dem ersten Durchklick der v3-Vorschau: vier Anpassungen.
1. **Bug Auswahl-Übernahme:** Lokaler Antwort-State „klebte“ auf der nächsten Frage (React behält
   State an gleicher Baumposition). Fix: `key={i}` am Frame-Container in `StationV3.tsx` → Remount
   pro Frame, Auswahl wird zurückgesetzt (gilt für Polls und Quiz).
2. **Faktencheck = Wahr/Falsch:** Pro Fakt eine plausible Falsch-Variante; im UI wird zufällig der
   echte `claim` (wahr) oder die Falsch-Variante gezeigt; Auto-Grade bei Klick; Auflösung nennt die
   korrekte Aussage/Zahl + Quelle. Falsch-Varianten in **Companion-Map**
   [`_data/faktenPruefung.ts`](../src/app/lernen/lernseite-1/_data/faktenPruefung.ts).
3. **Verständnisfragen unter dem Medium (statt eigener Quiz-Subpage allein):** Jede Quiz-Frage ist
   per **Companion-Map** [`_data/quizBezug.ts`](../src/app/lernen/lernseite-1/_data/quizBezug.ts)
   einem Bezug zugeordnet (`QuizBezug` in types.ts). Bis zu 2 „sonne“-/„schatten“-Fragen erscheinen
   direkt unter dem jeweiligen Medium; der Rest bleibt als kurzer Recap in der Quiz-Subpage. Das
   weicht von v3 §4.4 („5 von 8 zufällig“) ab — Pietros UX-Entscheidung gewinnt; v3-Plan-STATE ist
   entsprechend vermerkt (Spec-Update bei Gelegenheit).
4. **Auto-Grade / weniger Klicks:** Feedback erscheint bei Auswahl (kein separater Prüf-Klick), dann
   erst „Weiter“.

**Warum Companion-Maps statt Felder direkt in `stationenV3.ts`:** Die 3'200-Zeilen-Datei via
File-Tools zu erweitern ist im OneDrive-Sandbox-Setup fehleranfällig (Mount dehydriert editierte
Dateien). Kleine, additive Maps je ID halten die kanonische Inhaltsdatei unangetastet und sind
leicht prüf- und pflegbar. IDs müssen mit `stationenV3.ts` konsistent bleiben (per-ID-Schlüssel).

## 2026-06-26 — v3 M3: StationV3 als neue Komponente + v3-Vorschau-Route

Analog zu M1 wird die 7-Subpage-Shell als **neue** Komponente
[`_components/StationV3.tsx`](../src/app/lernen/lernseite-1/_components/StationV3.tsx)
gebaut statt das v2-`Station.tsx` in-place zu ersetzen — letzteres wird noch von
`KiEinheit.tsx` mit v2-Props (`hauptgang/dessert/checks`) importiert; ein In-place-Umbau
bräche Build/Lint sofort. Die echte Verdrahtung (Menü/Timeline → `KiEinheit` → `StationV3`)
folgt in M7. Zum Durchklicken/Review dient eine eigene Route
[`v3-preview/page.tsx`](../src/app/lernen/lernseite-1/v3-preview/page.tsx)
(`/lernen/lernseite-1/v3-preview`, rendert Station 1).

Weitere M3-Festlegungen:
- **Frame-Modell (v3 §4.2):** Jede Subpage zerfällt in 1..n Frames mit **einer Frage/Karte
  pro Frame** (3 Pre-Polls, Medien, 3 Swipe, 5–7 Fakten, 5 Quiz, 3 Post-Polls + Satz + Badge) —
  paginiert, nie gestapelt. Persistentes Banner (Inhalt · Dauer · Lernziel) + Mikro-Anleitung.
- **v3-Medien-Renderer inline** in `StationV3` (nicht das v2-`MediaBlockView`, dessen `MediaSpec`
  andere Optionalität hat): YouTube-Ausschnitt/Segment, Audio, **SRF-iframe immer ganz + `guidance`
  zur Minute** (§9). Video im Split-Layout (stapelt mobil).
- **Interaktions-Tiefe vertagt:** Quiz 8→5-Zufallsziehung + Scoring, Swipe-Profil, Poll-Aggregate,
  Badge-Vergabe/Zertifikat sind in M3 nur visuell/lokal; Logik folgt M4/M5/M6. **Keine** Cloud-Writes
  in dieser Stufe.

## 2026-06-26 — v3 M2: Inhalt integriert + zwei Distraktor-Fixes (§4.5)

Die in den Review-Drafts (`docs/material-pietro/review/station-{1..7}.md`) ausgeschriebenen
Stations-Inhalte wurden in [`_data/stationenV3.ts`](../src/app/lernen/lernseite-1/_data/stationenV3.ts)
integriert (7 `const stationN: Station` + Export-Array `STATIONEN_V3`); die `[M2]`-Platzhalter sind weg.
Die Review-`.md` bleiben die menschenlesbare Quelle/Abzug. Zwei MC-Fragen verletzten die
Distraktor-Regel §4.5 (mind. ein falscher Distraktor länger als die richtige Antwort), weil die
richtige Antwort die längste war — behoben durch Verlängern je eines plausiblen Distraktors
(`st1-mc-4` «Journalistinnen … bei regionalen Tageszeitungen»; `st2-mc-3` «… harmlose Fakes aus dem
Unterhaltungsbereich»), in TS-Datei **und** Review-`.md` synchron. Verifiziert: `tsc --noEmit`
(strict, gegen echte `types.ts`) grün; programmatische Prüfung aller §4-Zähl-Invarianten + Distraktor-
Regel + Station-4-Schutz (freiwillig/Warnung/143-147) + Station-7-Slider bestanden.

## 2026-06-26 — v3 M1: Typen in neuen Dateien, v2-`stationen.ts` bleibt bis M3

Bei M1 (Daten-Typen) zeigte sich ein Reihenfolge-Konflikt mit dem DEV_PLAN: dieser nennt als
Output ein überschriebenes `_data/stationen.ts` (7 Einträge, neue Form). Die v2-Komponenten
(`Station.tsx`, `KiEinheit.tsx`, `StationenMenu.tsx` …) importieren aber noch die **alte**
Form (`hauptgang/dessert/checks`) — ein Überschreiben würde Build/Lint sofort brechen, und die
Komponenten-Migration ist erst M3. Entscheidung: v3-Typen + Skelette in **neue** Dateien, v2
bleibt unberührt, bis M3 migriert. Build-grün und v3-Spec gewinnen über den wörtlichen Dateinamen.

Neu (alle unter `src/app/lernen/lernseite-1/_data/`):
- [`types.ts`](../src/app/lernen/lernseite-1/_data/types.ts) — alle v3-Typen; Zähl-Invarianten
  (§4.4) als Tupel kodiert: 3 Polls, 3 Swipe, ≥5 Fakten, Quiz-Pool 8 = **5 MC + 3 W/F** (Reihenfolge
  erzwingt die Zusammensetzung), 7 Subpages (`Record<SubpageKey, …>`).
- [`stationenV3.ts`](../src/app/lernen/lernseite-1/_data/stationenV3.ts) — `STATIONEN_V3` (7 Skelette:
  echte Titel/Tags/Icons/Badges/Leit-Poll/Reflexion; Inhalt `[M2]`-Platzhalter).
- [`badges.ts`](../src/app/lernen/lernseite-1/_data/badges.ts) — 5 Familien + §7-Matrix.
- [`landkarte.ts`](../src/app/lernen/lernseite-1/_data/landkarte.ts) — 8 Achsen + Werte-Profil (§10).

Verifikation in der Cowork-Sandbox: `tsc --noEmit` grün. **`npm run build` / `npm run lint`** konnten
hier nicht laufen (Mount erlaubt kein Datei-Löschen; Next braucht das fürs `.next`-Cleanup) — von Pietro
auf Windows zu bestätigen.

## 2026-06-26 — v3 M0: Zertifikat-Schwelle = 3 (korrigiert «mind. 2»)

Klarstellung beim M0-Gap-Analyse-Pass ([BUILD_NOTES_v3.md](material-pietro/BUILD_NOTES_v3.md)):
Die finale Gesamtarchitektur [v3](material-pietro/KI_EINHEIT_GESAMTARCHITEKTUR_v3.md) (§0/§3) legt
**3 abgeschlossene Stationen** als Schwelle für das Abschluss-Zertifikat fest. Die frühere
Vorschlags-Notiz weiter unten («mind. 2 statt 3 Pflicht») ist damit **überholt** — bei Konflikt gilt
v3. Umsetzung in M5 (Zeitstrahl/Zertifikat). Ebenfalls notiert: DEV_PLAN verweist auf
`src/config/units/lernseite-1.ts`, das nicht existiert — Modul-Metadaten liegen in `src/config/unit.ts`
(shared, nur nach Absprache ändern).

## 2026-06-26 — KI-Einheit v3: Domänen-Wahl + Fakten-Selbst-Check (Vorschlag)

Neuer Architektur-Vorschlag
[KI_EINHEIT_GESAMTARCHITEKTUR_v3.md](material-pietro/KI_EINHEIT_GESAMTARCHITEKTUR_v3.md),
gestützt auf alle 18 Material-Summaries. Behält die v2-Linie (selbstgesteuert,
bewertungsfrei im Kern, Versprechen→Test→Befund, Inkommensurabilität/SK11), aber
richtet die Einheit neu auf das Lernziel «positive *und* negative KI-Wirkungen
**pro Lebensbereich** unterscheiden» aus.

- **7 Stationen statt 5, mind. 2 (statt 3) Pflicht** — mehr Bereiche zur Wahl,
  echtere Interessenleitung. Jede Station trägt sichtbare **Bereich-Tags**
  (Wirtschaft, Politik, Individuum, Psyche, Gesellschaft, Ökologie, Technologie;
  Recht/Ethik querschnittlich).
- **Hybrid-Label:** griffige Ich-Frage + Bereich-Tags (Lernende wählen über die
  Frage, sehen aber die analytische Kategorie).
- **Fakten-Selbst-Check** (2–3 wahr/falsch bzw. MC pro Station) prüft
  *Verständnis*, nicht *Haltung* — bewertungsfrei, Sofort-Feedback, Einzelresultat
  nur localStorage, optional anonyme Aggregat-Quote via `polls.ts`. Konsistent mit
  den bereits in v2 eingeführten `WissenCheck`s.
- **Abschluss = Chancen-Risiken-Landkarte** über die besuchten Bereiche
  (localStorage, kein Handlungsprodukt) + globaler Post-Poll + Klassen-Spiegel.
- **Kultur** bleibt bewusst Stöber-Material (Materialdecke zu dünn).
- Status: Vorschlag — mit Pietro abzustimmen, ob v3 die v2-Didaktik ablöst oder
  als Variante koexistiert.

### Nachtrag 2026-06-26 (Pietros Feinvorgaben in v3 eingearbeitet)

- **Station 7 = 3Blue1Brown** (deutsch synchronisiert); kassensturz-bots nur noch
  Ergänzung/Alt.
- **Badge-System** (5 Familien: KI & Technologie/Ethik/Gesellschaft/Wirtschaft/
  Mensch); eine Station kann eine Familie mehrfach vergeben (Stufen).
- **Zwei getrennte Wissens-Elemente:** ungrader **Faktencheck mit
  deep-search-recherchierten Zusatzdaten** (auch über das Gehörte hinaus) *plus*
  **gepunktetes 5-Fragen-Quiz** pro Station. Damit ist die Haltung weiter
  bewertungsfrei, das Verständnis aber gepunktet. Quiz-Bauregel: plausible
  Distraktoren, **mind. 1 falscher Distraktor länger als die richtige Antwort**.
- **Zeitstrahl-Wahl**, abgeschlossene Stationen werden **grün**; **Zertifikat ab 3
  Stationen** (client-seitig, mit Stationen + Badges).
- **Landkarte rückwärts aus Polls designt** (Vorwissen → Schluss); mehr Stationen
  = vollständigere Landkarte; je Achse eine `pollId`.
- **Poll-Mix:** Schieberegler für persönliche Bewegung, **4er-Skala** für
  Aggregation (Ich/Klasse/alle 500+); Format pro Frage über pre/post konstant.
  Zusätzlich **Swipe-Karten** (links/rechts) fürs Werte-Profil.
- **Layout-Regeln:** max. ~2 Bildschirmhöhen pro Seite → Stationen in 3–4
  **Subpages**; **Banner** (Inhalt/Dauer/Lernziele) auf jeder Seite;
  **Mikro-Anleitungen** zwischen Schritten; **Video im Split** mit Begleittext.
- **Medien-Regeln:** YouTube = Ausschnitt/Mehr-Segment; SRF-iframe = nur ganz
  (lange iframes → Text-Ausschnitt); MP3 = Audio-Player.

## 2026-06-24 — KI-Einheit v2: Wissen-Checks, Punkte, Lernziele, alle Medien

Die KI-Einheit (Lernseite 1, Pietro) ist vom MVP auf das inhaltliche
Reichtum-Niveau der 10mio-Einheit gehoben (Handoff
[HANDOFF_ki-einheit_tech_v2.md](material-pietro/HANDOFF_ki-einheit_tech_v2.md)).

- **Lernziel-Karten** (`LernzielKarte`) eröffnen jede Phase/Station: 2–3
  Lernziele + Aktivitäts-Ansage + «was kommt als Nächstes und warum». Führende
  Übergänge via `Hinweis` (Erzähler) und `Anleitung` (Regie).
- **Wissen-Checks** (`WissenCheck` / `WissenCheckGruppe`): pro eingebettetem
  Hauptgang/Dessert ≥2 Fragen (Mix MC + Richtig/Falsch), inhaltlich aus den
  lokalen Transkripten belegt (`_data/wissenChecks.ts`). Stil-Regeln:
  Distraktor-Längen-Regel (mind. 1 falscher Distraktor länger als die richtige
  Antwort), Fett-Diskriminator, Feedback je Option. Bewusst **kein** Check auf
  der Station-4-Vertiefung (Suizid-Fall — tonal unpassend).
- **Punkte** (`_lib/punkte.ts`): lokal (localStorage `ki26-punkte`), erster
  Versuch bindend (idempotent). Abschluss zeigt eine ruhige Punkte-Übersicht
  («X von Y», kein Zeugnis) + optionalen Klassen-Schnitt aus den `wc-*`-Zählern.
- **Generische Polls** (`PollFrage` / `PollDeck`) mit Drei-Ebenen-Spiegel
  (Ich / Klasse / alle). Auftakt + Abschluss zeigen dasselbe Stimmungsbild
  (3 Stance-Polls) mit Pre/Post-Vergleich. `Verteilung` aus `KollektivSpiegel`
  herausgezogen (generisch; 1..7 ist nur ein Spezialfall).
- **Poll-/Punkte-IDs** (`unitPolls.ts`): neu `pollId.poll`/`klassePoll`
  (generisch) + `pollId.wissen` (anonym richtig/falsch). `castPollVote` zählt
  global + Klasse. Datenschutz unverändert: nur anonyme Aggregat-Zähler in
  Firestore; Position, Punkte, Freitext bleiben im Browser.
- **Alle Medien verdrahtet** (Handoff §6): SRF-Embeds via `kind:"srf"`/`urn`
  (Rundschau S1, Kassensturz/ABE S2, 10vor10 S5), remote-mp3 (Regionaljournal
  S1, Espresso S2-Audio bzw. S5), YouTube (Einstein/Puls), 3Blue1Brown engl.
  Original (`LPZh9BOjkQs`, `aircAruvnKk`). Keine `youtubeId:"TODO"`/Placeholder
  mehr. Bewusst offen (§11): Espresso-Offset (mp3 startet ~6:00 vs.
  Transkript-Marken) — beim Verdrahten 1× zu verifizieren.
- **Umlaut-Bereinigung:** `ae/oe/ue`→`ä/ö/ü` im gesamten `lernseite-1/**` (UI,
  `_data/*`, Kommentare) + die v1-Einträge hier. Technische Identifier
  unverändert.
- **⚠️ Build-Verifikation:** In der Cowork-Sandbox **nicht** durchführbar — der
  OneDrive-On-Demand-Mount liefert dem Linux-Sandbox teils gekürzte Dateien
  (deterministisch, nicht-NUL), sodass `tsc`/`next build` dort unzuverlässig
  sind. Die Dateien auf Disk sind vollständig (über das Read-Tool/Cloud
  verifiziert). **`npm run build` lokal bei Pietro/Christof ausführen**, bevor
  committet wird.

## 2026-06-24 — KI-Einheit als zusammenhängender Flow gebaut (MVP)

Die KI-Einheit (Lernseite 1, Pietro) ist als ein einziger orchestrierter Flow
auf `/lernen/lernseite-1` umgesetzt (Handoff
[HANDOFF_ki-einheit_tech_v1.md](material-pietro/HANDOFF_ki-einheit_tech_v1.md)).
Die frühere Hub-Seite mit Platzhalter-Submodulen ist ersetzt.

- **Orchestrator:** `_components/KiEinheit.tsx` — State-Machine
  `auftakt → stationen (>=3 von 5) → abschluss → maschinenraum (optional)`,
  Fortschritt (Phase, Pre-Wert, erledigte Stationen) in localStorage
  (`_lib/fortschritt.ts`), Reload-fest.
- **Phasen:** `Auftakt` (Vorwissen + Hype-Opener + globaler Pre-Poll),
  `StationenMenu` (freie Wahl, Station-4-Badge „freiwillig", Gate bei 3),
  `Abschluss` + `KollektivSpiegel` (Ich / Klasse / alle — Klasse einmalig,
  alle live), `Maschinenraum` (Selbsteinschätzung + Interesse + Vertrauens-
  Brücke, kein Test).
- **Refactor:** `Skala` und `MediaBlockView` (YouTube/Audio/SRF/Placeholder)
  aus `Station.tsx` in shared-Dateien extrahiert; `MediaSpec` um `kind:"srf"`
  + `urn` + `externalUrl` erweitert.
- **Poll-IDs/Klasse:** `_lib/unitPolls.ts` (Schema, `resolveKlasse`,
  `voteOnce`-Guard). Klassen-Code via `?klasse=<code>` → localStorage.
- **Medien verdrahtet:** YouTube-IDs (einstein-full/what-the-fake/ki-im-kopf/
  ki-freundin, puls), SRF-urn Rundschau (Station 1 alt. Dessert), mp3 nach
  `public/audio/ki-arbeitswelt.mp3` (Station 2).
- **Bewusst offen (20 %, §12):** Placeholder für `newsjournal-stimme-klonen`,
  `kassensturz-ausbeutung`, `espresso-foodwaste`, `10v10-ki-krieg`; 3Blue1Brown
  deutsch-synchron (Placeholder + Link zum Original); harter Clip-Stop bei
  SRF-/YouTube-Embeds (nur Startzeit) — späteres Upgrade via Player-API.
- **unit.ts:** nur der `lernseite-1`-Eintrag chirurgisch angepasst (Titel
  „Kann KI das? — eine Positionsreise", Platzhalter-Submodule entfernt).
  Die verwaisten `submodul-1/2/page.tsx` bleiben stehen (nicht löschen).
- **Verifikation aus der Cowork-Sandbox:** nur `tsc --noEmit` (Windows-natives
  `next build` nicht ausführbar). `npm run build`/`npm run lint` + Firestore-
  Test laufen bei Pietro lokal.

---

## 2026-06-24 — Poll-/Stations-Architektur (lean, bewertungsfrei)

Erste Bausteine der KI-Einheit (Lernseite 1, Pietro) nach
[KI_EINHEIT_GESAMTARCHITEKTUR_v2.md](material-pietro/KI_EINHEIT_GESAMTARCHITEKTUR_v2.md):

- **[src/lib/polls.ts](../src/lib/polls.ts)** — anonymer Aggregat-Zähler.
  API: `castVote(pollId, optionId)`, `loadPollCounts`, `subscribePollCounts`
  (live), `totalVotes`, `scaleBucket`. Pfad
  `abstimmungen/ki26/polls/{pollId}.counts`. Kein Auth, durch die live Rules
  gedeckt; reused `getFirebase()`.
- **Stationen data-driven:**
  [_data/stationen.ts](../src/app/lernen/lernseite-1/_data/stationen.ts)
  (`StationConfig` + alle 5 Stationen; Zeitfenster in Sekunden; YouTube-IDs /
  mp3-URLs noch `TODO` → `material-pietro/urls.md`) +
  [_components/Station.tsx](../src/app/lernen/lernseite-1/_components/Station.tsx)
  (5-Schritt-Mechanik, geschnittene YouTube-/Audio-Player, opt-in Station 4).
- **Datenschutz:** Position 1/2 und der „eine Satz" bleiben im Browser
  (localStorage). Nur die optionale Prop `reportPollId` erhöht EINEN anonymen
  Aggregat-Zähler — kein Einzeldatensatz.
- **Gemeinsame Konvention:** Christofs Perspektiven-Check kann denselben
  `polls.ts`-Helfer + die `polls`-Collection (unter ki26-Namespace) nutzen —
  eine gemeinsame Zähler-Konvention statt zwei.

Privat-Ordner (`_data`, `_components`) werden vom Next-Router ignoriert (kein
Route). Liegen unter Pietros Owner-Pfad `lernseite-1/**` — kein Konflikt mit
Christof.

---

## 2026-06-24 — Firebase: bestehendes Projekt `iperka-lms` teilen

`ki26` bekommt **kein eigenes** Firebase-Projekt, sondern nutzt das bestehende
**`iperka-lms`** (Pietros Account, dasselbe wie `10mio`). Web-Config aus
`10mio/.env.local` uebernommen und nach `ki26/.env.local` gemappt
(`PUBLIC_*` → `NEXT_PUBLIC_*`, gitignored).

- **Trennung ueber Namespace:** `NEXT_PUBLIC_UNIT_ID=ki26` → alle Daten unter
  `abstimmungen/ki26/...`, nie Kollision mit `abstimmungen/10mio-2026/...`.
- **Keine `firestore.rules`-Aenderung:** die live `iperka-lms`-Rules erlauben
  bereits `abstimmungen/{id}/polls` + `students/*`. **Aus `ki26` nie Rules
  deployen** (wuerde `10mio` ueberschreiben — Rules sind projektweit, verwaltet
  im `10mio`-Repo).
- **Modell (bewertungsfrei):** nur anonyme Aggregat-Zaehler (`polls.counts`,
  `increment`); Freitext/„ein Satz" bleibt im Browser. Kein Cloud Function fuer
  diese Einheit; Klassencode-/LP-Tier kommt spaeter, hat keine Prioritaet.
- **Christof:** Client-Code frei moeglich (Rules decken `abstimmungen/ki26/*`);
  braucht eigenes `ki26/.env.local` (gleiche 6 `NEXT_PUBLIC_FIREBASE_*`-Werte,
  browser-public). Konsole/Deploy-Zugriff → Pietro fuegt ihn im Projekt hinzu.

Betroffen: `ki26/.env.local` (neu, gitignored), [CLAUDE.md](../CLAUDE.md#firebase-projekt-gemeinsam-genutzt--stand-2026-06-24-pietro)
(Environment + Open questions). Hintergrund-Plan:
[docs/material-pietro/KI_EINHEIT_GESAMTARCHITEKTUR_v2.md](material-pietro/KI_EINHEIT_GESAMTARCHITEKTUR_v2.md).

---

## 2026-07-05 — Viewer-Fix (Performance/Vollbild) + Kontext-Verknüpfung in Führungen

**Problem (Christof):** Der Vollbild-Viewer wirkte «funktioniert nicht». Zwei
Ursachen behoben:
- **`backdrop-blur-sm` entfernt** → opakes Overlay (`bg-inverse-surface`). Der
  Blur über die ganze Fläche mit grossem Bild dahinter ist teuer und liess den
  Viewer auf manchen Geräten ruckeln/hängen (im Preview reproduzierbar: der
  Screenshot-Renderer blieb hängen).
- **Echtes Vollbild ergänzt:** Fullscreen-API-Toggle (⛶) im Viewer-Kopf —
  `requestFullscreen`/`exitFullscreen` auf dem Dialog-Root, gestengesteuert,
  mit try/catch-Fallback aufs In-Page-Overlay.

**Kontext-Verknüpfung:** Jedes Bild hat neu eine `contextNote`; der Viewer
hängt sie als Schluss-Stopp **«Im Kontext der Zeit»** an die Führung an (Gesamt-
blick). Sie verknüpft das Bild textlich mit der **technischen Errungenschaft**
und der **gesellschaftlichen Verunsicherung** der Epoche — so zeigen die
Führungen nicht nur Bilddetails, sondern ordnen sie ein.

Verifiziert im Preview (DOM): Viewer öffnet, Overlay opak, Vollbild-Button da,
Führung Schule von Athen 6 → 7 Stopps, Marker auf Detail-Stopps sichtbar.

---

## 2026-07-05 — Bild-Viewer mit Zoom + kuratierten Führungen (Arts-&-Culture-Stil)

Die Epochen-Galerien öffnen neu in einem **zoombaren Vollbild-Viewer**
(`BildZoom.tsx`): Mausrad/Pinch/Doppelklick zoomen, Ziehen verschiebt, Buttons
für Zoom/Einpassen. Bewusst **ohne neue Dependencies** (reines React + CSS-
Transforms — `package.json` ist geteilter Bereich).

**Führungen:** Vier Bilder haben kuratierte Touren («Führung starten»): die
Ansicht fährt animiert von Detail zu Detail, mit Titel + Erklärtext und
Fokus-Ring — Schule von Athen (6 Stopps: Platon/Aristoteles, Sokrates,
Pythagoras, Euklid, Ptolemäus/Raffael), Tod des Sokrates (5), Eisenwalzwerk
(5), «Suche nach Bildern» (6). Tour-Stopps sind Prozent-Koordinaten in den
Daten (von Hand gesetzt, leicht justierbar); Thumbnails mit Tour tragen ein
«Führung»-Badge. Weitere Touren können einfach als `tour:[…]` ergänzt werden.

---

## 2026-07-05 — Bausteine quellenbasiert erweitert (Quellen geprüft)

Die drei Bausteine je Epoche haben jetzt **umfangreichere Texte** und je **1–3
geprüfte Quellen** (als Links im aufgeklappten Panel, `target=_blank`). Alle
Quell-URLs wurden am 2026-07-05 per `curl` auf **HTTP 200 / öffentliche
Zugänglichkeit** getestet — nur bestätigte URLs sind eingebaut.

Genutzte Quelltypen (bewusst autoritativ + frei zugänglich): **Stanford
Encyclopedia of Philosophy** (Aristoteles, Sophisten, Sokrates, Augustinus,
Kant, Marx, Philosophie der Technik), **Internet Encyclopedia of Philosophy**,
**Wikipedia**, **Wikisource** (Kant, „Was ist Aufklärung?“ Volltext), **arXiv**
(Transformer-Paper), **CERN** (Geburt des Web), **Royal Museums Greenwich**
(Harrison/Längengrad), **Britannica** (Dampfmaschine), **New Advent** (De
civitate Dei), **marxists.org** (Manifest-Volltext).

Verworfen: projekt-gutenberg-URL für Kants Aufklärungs-Essay (404) → ersetzt
durch die deutsche Wikisource-Ausgabe. **Regel:** neue Quellen vor dem Einbau
auf 200/öffentlich prüfen.

---

## 2026-07-05 — Umbau zu Epochen-Panels + Bausteinen + Galerie je Epoche

Auf Wunsch (Christof) neu strukturiert — weg von der erzwungenen Dramaturgie,
hin zu **modularen, nüchtern betitelten Bausteinen**:

- **Kein globales Bilderset**, sondern **eine Galerie je Epoche** (≥3
  gemeinfreie „Bilder der Zeit", nur innerhalb der Epoche durchblätterbar;
  Vollbild mit ‹/›, Pfeiltasten, Zähler, Caption + Nachweis).
- **Drei einzeln aufklappbare Bausteine pro Epoche**, nüchtern betitelt:
  **Technische Errungenschaft · Verunsicherung · Philosophische
  Orientierungshilfe**. Sie sind aufeinander bezogen, **kein erzwungener
  Kausal-Zusammenhang** — jeder Baustein steht auch für sich. Man klappt auf,
  was man will (Default: alle zu).
- Neue gemeinfreie „Bilder der Zeit": Rembrandt „Aristoteles mit Büste Homers"
  (1653), Très Riches Heures/Oktober (um 1416), Wright „Orrery" (um 1766),
  Loutherbourg „Coalbrookdale bei Nacht" (1801); für die Gegenwart NASA
  „Earth at Night" (2012) und „Blue Marble" (1972, beide US-Gov/PD).
- Hegel-Rahmung entschärft: keine „→ deshalb"-Kausalität mehr; die Idee
  (Philosophie antwortet im Rückblick, sieht nicht voraus) steckt nur noch im
  Text der Orientierungshilfe.

---

## 2026-07-04 — Präzisierung der Hegel-Deutung + Bilderset-Galerie

**Sprachregelung (Christof):** Die Philosophie antwortet **nicht «im
Nachhinein»** im strengen Sinn. Richtig: Sie **sieht nicht voraus**, sondern
antwortet **im Blick auf das, was war, auf die Fragen ihrer Gegenwart** —
populär/wirksam wird die Antwort oft erst später. Entsprechend umformuliert:
Spur-3-Label («Die Philosophie antwortet — im Blick auf das, was war»),
Hegel-Glosse im Seitenkopf, Stations-Texte (Kant antwortet auf seine Gegenwart,
Marx' Antwort wird erst Jahrzehnte später weltweit populär, «Jetzt»-Station).
Spur-1-Label neu: **«Was die Technik wandelt — und neu ordnet»** (statt
«verschiebt die Welt»).

**Bilderset-Galerie:** Alle Kunstwerke des Zeitstrahls lassen sich als Set
durchblättern — Button «Bilderset durchblättern» + ‹/›-Navigation, Pfeiltasten,
Zähler, Epoche/Rolle und Bildnachweis im Vollbild. Reihenfolge erzählerisch:
je Epoche Verunsicherung → Antwort.

---

## 2026-07-04 — Hegel-Dramaturgie: Dreiklang pro Epoche + Verunsicherungs-Bilder

Der Schablonen-Zeitstrahl erzählt jede Epoche jetzt in **drei Schlägen**:
**Technik verschiebt die Welt** (primary) → **die Verunsicherung wächst**
(error-Ton, mit eigenem Kunstwerk) → **die Philosophie antwortet — im
Nachhinein** (tertiary). Rahmung über Hegels Eule der Minerva («beginnt erst
mit der einbrechenden Dämmerung ihren Flug», Rechtsphilosophie-Vorrede) als
Blockzitat im Seitenkopf; die Gegenwarts-Station endet mit «die Eule ist für
unsere Zeit noch nicht gestartet».

Damit hat jede Epoche **mehr als ein Bild**. Neue gemeinfreie Verunsicherungs-
Werke: David «Der Tod des Sokrates» (1787) · Sylvestre «Die Plünderung Roms»
(1890) · Kupferstich «Destruction de Lisbonne» (1755) · Doré «Over London – by
Rail» (1872, aus Buchseiten-Scan zugeschnitten; eine bebilderte Buchseiten-
Reproduktion mit Caption wurde verworfen).

Inhaltliche Umhängung für die Chronologie: **Druckpresse** wandert von der
Augustinus- zur Kant-Station (Druck 1440 → Reformation/Religionskriege →
Aufklärung als Antwort — hegelisch sauber); Augustinus behält die mechanische
Uhr als ordnende Technik des christlichen Zeitalters, seine Verunsicherung ist
der **Fall Roms 410** (De civitate Dei 413–426 als Antwort *nach* dem Schock).

---

## 2026-07-04 — Zwei-Spuren-Zeitstrahl + Marx-Station (Option A)

Der Schablonen-Zeitstrahl (`/sandbox/philosophie-schablonen`) ist jetzt
**zweispurig**: pro Epoche zuerst die **Technik-Spur** (kompakte Ereignis-Karten
aus der [Technik-Zeitachse](skripte/lernseite-2-submodul-1-technik-zeitachse.md),
primary-blau) und darüber gelegt die **Philosophie-Spur** (Stations-Karte mit
Kunstwerk, tertiary-grün). Legende oben erklärt die Spuren.

Neu: **Station „Marx · Industriemoderne"** (Option A) als philosophischer
Gegenpart zu Dampfmaschine, Elektrizität/Elektronik und Telegraf/Seekabel —
Zitat „Alles Ständische und Stehende verdampft", Kunstwerk **Adolph Menzels
„Das Eisenwalzwerk"** (1872–1875, gemeinfrei, Google-Art-Project-Scan; die
zuerst gefundene Reproduktion trug ein Wasserzeichen und wurde verworfen).

Designlinie: klassische Kunstwerke + neutrale Material-Icons statt
KI-Symbolik; MD3-Token, keine Sonderfarben.

---

## 2026-06-21 — Bildlizenzen Schablonen-Zeitstrahl

Die historischen Stationen nutzen **gemeinfreie** Werke (Wikimedia Commons:
Raffael, Champaigne, C. D. Friedrich). Die **Gegenwarts-Station** („Wir von
heute") zeigt ein **zeitgenössisches** Werk — Klaus Christ, „Suche nach Bildern",
2024 — das **mit Genehmigung des Urhebers** verwendet wird (nicht gemeinfrei).
Die gemeinfrei-Regel ist damit bewusst und dokumentiert für genau dieses eine
Bild ausgenommen; die CC-BY-4.0-Lizenz der Seite bleibt gewahrt. Nachweis:
[public/art/CREDITS.md](../public/art/CREDITS.md).

---

## 2026-06-20 — Philosophische Verortung von Submodul 1 (Denk-Landkarte)

Das Submodul „Philosophische Perspektive" erhält ein **theoretisches Gerüst** mit
vier Stationen in didaktischer Sequenz: **Nassehi/Systemtheorie** (Diagnose: was
ist Digitalisierung, KI dort einordnen) → **Latour/Akteur-Netzwerk-Theorie**
(gute Praxis = nicht-menschliche Akteure und ihren „Zwang" sehen; Unterbau des
Akteurs-Modells) → **Haraway + nicht-westliche/asiatische Philosophien**
(Verflechtung Mensch–Nichtmensch; alternative, nicht subjekt/objekt-basierte
Traditionen) → **Gabriel/Neuer Realismus** (Umgang & Ethik, Mensch bleibt im
Urteil).

Didaktisches Herzstück ist die **Streitfrage** „Ist KI ein Akteur mit
Handlungsmacht — oder ist das ein Kategorienfehler?" (Spannung Latour/Haraway ↔
Gabriel). Inhaltliche Linie kommt von Christof (Fach); Details im
[Skript](skripte/lernseite-2-submodul-1-intro.md#philosophische-verortung--die-denk-landkarte).
Werkangaben dort sind noch zu prüfen.

---

## 2026-06-20 — Submodul 1 „Intro" → „Philosophische Perspektive"

Das erste Submodul von Lernseite 2 heisst neu **„Philosophische Perspektive"**
(vorher „Intro"). Inhaltlicher roter Faden: **digitale Transformation** (erklären)
→ **wachsende Unsicherheit** (Beispiele) → **Philosophie schafft Orientierung**
(Begriffe & Perspektiven klären) → **neuer Akteur** (Begriffsarbeit, Akteurs-
Modell). Die **Umfrage** (Perspektiven-Check) ist der **Einstieg** dieses
Submoduls.

Slug bleibt `submodul-1` (stabil; nur Anzeige-Titel/Icon geändert). Angepasst in
[src/config/unit.ts](../src/config/unit.ts) (icon `psychology`, subtitle
„Orientierung") und [submodul-1/page.tsx](../src/app/lernen/lernseite-2/submodul-1/page.tsx).
Skript-Datei behält Namen `…-intro.md` (per submodul-1 verschlüsselt), Inhalt
neu strukturiert.

**Bewertungs-Schleife** als didaktischer Kern: KI kommentiert die
Gesamtauswertung → Teilnehmende bewerten den Kommentar → KI gibt eine
Meta-Einschätzung zu dieser Bewertung. Macht sichtbar, dass am Ende der Mensch
urteilt (auch über die KI). KI-Aufrufe nur auf Aggregat-Ebene, selten ausgelöst,
günstiges Modell — Details im
[Skript](skripte/lernseite-2-submodul-1-intro.md#bewertungs-schleife-teilnehmende--ki).

---

## 2026-06-20 — Anonymität der Einstiegs-Umfrage: Datenminimierung (Modell A)

Die Einstiegs-Umfrage (Perspektiven-Check, Lernseite 2 / Intro) wird so gebaut,
dass **Einzelantworten möglichst nicht individuell rückführbar** sind. Leitsatz:
**Datenminimierung schützt stärker als jede Security Rule** — wer Console-/
Admin-Zugriff hat, umgeht Rules; was nie gespeichert wird, kann niemand
auswerten (auch kein Admin, auch kein Leck).

**Gewähltes Modell A — nur Aggregat:**
- Eigene Antworten bleiben **im Browser** (localStorage/State), verlassen das
  Gerät nicht als verknüpfter Datensatz.
- Firestore speichert **nur Zähler** (pro Frage/Option `increment(+1)`),
  inkl. Likes und einer groben Perspektiven-Kategorie — **keine
  Einzeldatensätze**, also nichts zum Re-Identifizieren.
- Persönlicher Vergleich „du vs. Gruppe" wird **client-seitig** gegen die
  öffentlichen Aggregat-Zähler gerechnet.
- KI kommentiert nur das Aggregat (ein Aufruf) → auch kostengünstig.

**Falls je Einzeldocs nötig (Modell B), dann mit allen Schichten:** create-only/
kein-read in Rules · Shape-Validierung (`keys().hasOnly([...])`, keine
Identitätsfelder) · Zeitstempel vergröbern (Datum/Stunde) · k-Anonymität bei
Anzeige (≥ 5) · kein Freitext in den anonymen Daten · App Check · optional
ephemer (Function aggregiert, löscht Rohdoc).

**Zuständigkeit:** `firestore.rules` ist gemeinsam/Pietro — Rules werden nach
diesem Konzept koordiniert gebaut. Umfrage-Inhalt + Anonymitäts-Konzept sind
Christofs Bereich. Umfrage-Entwurf:
[skripte/lernseite-2-submodul-1-intro.md](skripte/lernseite-2-submodul-1-intro.md#einstiegs-umfrage--perspektiven-check).

---

## 2026-06-14 — Visualisierungen als Sandbox-Route (Option B)

Inhaltliche Visualisierungen werden vor dem Einbau ins Submodul **im selben
Repo unter `/sandbox/**`** als Werkstatt-Route entwickelt — nicht als separates
Vercel-Projekt. Begründun