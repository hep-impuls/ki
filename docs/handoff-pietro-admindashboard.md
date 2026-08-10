# Info an Pietro — Admin-Dashboard für ki26

**Von:** Christof · **Stand:** 2026-08-10 · **Betrifft:** Admin SDK, geteiltes
Firebase-Projekt, Datenschutz-Aussagen → deshalb diese Abstimmung.

## Antwort von Pietro — 2026-08-10: entschieden und gebaut

Danke, das war die richtige Reihenfolge. Alle fünf Fragen sind entschieden, und
das Dashboard steht bereits: `/lehrperson/admin`, Route `POST /api/admin/report`.
Ausführliche Begründungen im [Entscheid-Log](decisions.md), hier die Kurzform.

1. **Kein eigenes Admin-Passwort.** Weder Korrektorat-Muster noch mein
   Lehrer-Secret als Generalschlüssel. Die Anmeldung bleibt für alle gleich —
   Klassencode plus selbstgewähltes Secret, das Passwort-Management gehört den
   Lehrpersonen. Neu ist nur die *Berechtigung*: `istAdmin: true` am Lehrer-Doc
   (Firebase-Konsole) oder der Code in `ADMIN_CLASS_CODES`. Dein Code kann
   freigeschaltet werden, ohne dass du ein Service-Account brauchst.
2. **Reichweite fest auf `abstimmungen/ki26`** — einverstanden. Die Route nimmt
   keine Bereichsangabe aus dem Request entgegen und benutzt keine
   `collectionGroup`-Abfragen (die liefen projektweit und läsen `10mio` mit).
3. **`progress.updatedAt`** — und deine Frage hat sich erledigt: **R6 ist seit
   dem 26. Juni gebaut** (`efc20a9`). `CLAUDE.md` und dieses Dokument waren beide
   veraltet. Der Tracker lief also die ganze Zeit; er ist jetzt *ausgeschaltet*,
   weil niemand die Daten je gelesen hat und die Block-Erfassung ohnehin tot war.
4. **k-Schwelle: für Lernende ja, für Lehrpersonen und Admins nein.** Wer das
   Service-Account hat, liest ohnehin jedes Dokument — die Schwelle wäre dort
   Theater. Die Schranke, die wirklich etwas kostet, ist eine andere: **die
   Übersicht zeigt keine Fortschritts-Codes.** Zahlen und Klassencodes ja,
   Einzelpersonen nein.
5. **Datenschutz-Sätze nachgezogen**, vor dem Bauen: `/start` nennt die
   Gesamtauswertung, die Anleitung hat einen Absatz im Abschnitt «Welche Daten
   entstehen».

**Zu deinen zwei Befunden.** Das NUL-Byte ist raus (`2f2e800`) — und du hattest
mit `ripgrep` recht: nachgemessen gibt `rg` an der alten Fassung nur «binary file
matches» aus und zeigt keine Trefferzeilen. `git grep` funktionierte, `rg` nicht.
Die grössere Nebenwirkung war aber eine andere: das NUL-Byte schaltete Gits
Zeilenenden-Normalisierung ab, die Datei lag als einzige mit CRLF im Index. Der
Commit normalisiert sie darum einmalig — 511 Zeilen im Diff, eine echte Änderung.
`npm run lint` bleibt defekt, `npx tsc --noEmit` ist der Ersatz.

**Zum Kostenpunkt.** Kein Aggregat-Doc: das hiesse bei jedem `mirrorProgress` ein
zusätzlicher Schreibvorgang, also mehr Dauerlast für weniger seltene Leselast.
Stattdessen zehn Minuten Zwischenspeicher mit sichtbarem Standdatum, und die
Fortschritts-Unterkollektionen werden zwanzigfach parallel gelesen statt
nacheinander. Nebenbei: `mirrorProgress` schreibt jetzt nur noch bei echter
Änderung — der 30-Sekunden-Takt hat vorher offene Seiten stündlich 120-mal
denselben Inhalt schreiben lassen.

**Zur Aufteilung.** Deine Beobachtung stimmt und ist in der Route umgesetzt: es
wird die ganze `students`-Sammlung gelesen, `teacherCode: null` erscheint als
eigene Gruppe «ohne Klasse». Beim ersten echten Durchlauf waren das 9 von 15
Codes — ohne diese Gruppe hätte man die Mehrheit übersehen.

Die **Anzeige ist ein Erstentwurf von mir**, nicht dein Terrain besetzt: vier
Kennzahlen, eine Modul-Tabelle, eine Klassen-Tabelle. Nimm sie gern auseinander.
Ein Detail, über das ich beim Bauen gestolpert bin und das du kennen solltest:
Lernset 2 spiegelt kein `pct`, sondern eigene Strukturen (`ids`, `werte`). Ein
fehlendes Feld als 0 % zu lesen wies deine Module als unbearbeitet aus, obwohl
dort gearbeitet wurde — die Spalte sagt dort jetzt «ohne Prozentwert». Wenn du
für Lernset 2 einen Erfüllungsgrad definieren willst, wäre das die Stelle.

**Freischalten deines Codes:** in der Firebase-Konsole unter
`abstimmungen/ki26/teachers/{DEIN-CODE}` das Feld `istAdmin` auf `true` setzen.
Sag Bescheid, ich mache das.

---

## Worum es geht

Wir möchten eine Übersicht über die Nutzung des Lernsets, quer über alle Klassen
und Codes: wie viele Personen unterwegs sind, wie weit sie kommen, welche Themen
liegen bleiben. Heute gibt es das nur **pro Klasse** (`/lehrperson/report`) und
nur für die Person, die den Klassencode besitzt.

Ich kann das nicht allein bauen, weil jede Aggregation über das Admin SDK läuft
und weil die Reichweite einer solchen Sicht eine Datenschutz-Entscheidung ist.
Kurzfassung: **Technisch ist fast alles schon da, aber fünf Entscheide sind
deine.**

## Die harte Vorgabe: alles serverseitig

Die Firestore-Rules sind **projektweit** und werden aus dem `10mio`-Repo
verwaltet. Ein `firebase deploy --only firestore:rules` aus `ki26` würde die live
`10mio`-Rules überschreiben. Das Admin-Dashboard darf darum **keinen einzigen
neuen Client-Lesezugriff** brauchen; alles läuft über Route Handlers, wo das
Admin SDK die Rules ohnehin umgeht. Genau so läuft der Lehrer-Tier heute schon.

Daraus folgt: Ohne dich geht es nicht, denn `FIREBASE_SERVICE_ACCOUNT` liegt nur
bei dir. Und es muss einzeilig bleiben, sonst liest Next.js den JSON-Wert nach
`{` ab und die Route antwortet 503.

## Was heute schon vorhanden ist

- **`src/lib/server/teacherStore.ts`** mit neun exportierten Funktionen:
  `canonicalClassCode`, `klasseNamespace`, `teacherSetup`, `teacherPrefs`,
  `classExists`, `studentClassPrefs`, `teacherReport`, `studentClassReport`,
  `teacherOrakel`. `studentClassReport` aggregiert eine Klasse bereits anonym.
- **Pfade** (`src/lib/paths.ts`): alles unter `abstimmungen/ki26/` mit
  `students`, `teachers`, `polls`, `engagement`; pro Person
  `students/{code}/progress/{moduleId}`, dazu `notes/{moduleId}` und
  `synthesis/current`.
- **20 Route Handlers**, alle `POST`, alle `runtime="nodejs"`.
- **k-Anonymität** ist gesetzt: `if (students.length < 5) return null`.
- **Ein Login-Vorbild im Haus:** das Korrektorat mit Passcode und
  Sitzungs-Cookie (`src/app/api/korrektorat/auth/route.ts`), Geheimnisse in
  `KORREKTORAT_PASSCODE` und `KORREKTORAT_SESSION_SECRET`.

## Was neu gebaut werden muss

1. **Ein Admin-Login.** Der Lehrer-Tier prüft Klassencode plus SHA-256-Secret,
   single-owner. Für eine Sicht *über* Klassen passt das nicht.
2. **Eine Aggregations-Route über die ganze `students`-Collection.** Nicht pro
   Klasse, aus dem Grund im nächsten Abschnitt.
3. **Die Anzeige.** Das mache ich, wie beim Klassenvergleich.

### Wichtig: pro Klasse zählen würde die Mehrheit übersehen

`loadClassStudents()` fragt `students` mit
`.where("teacherCode", "==", classCode)` ab. Ein Code entsteht aber automatisch
im Hintergrund, und `ensureStudent()` legt ihn mit `teacherCode: null` an
(`src/lib/db.ts`, Zeile 45). Der Klassencode kommt nur dazu, wenn die Person ihn
auf `/start` oder im Account-Panel eingibt.

Heisst: Wer nie einer Klasse beitritt, ist in **jeder** Klassenabfrage
unsichtbar. Für eine Nutzungsübersicht sind das vermutlich die meisten. Die
Route muss darum die ganze `students`-Collection lesen und `teacherCode: null`
als eigene Gruppe führen («ohne Klasse»).

### Und ein Kostenpunkt

`loadClassStudents()` liest pro Schüler die `progress`-Unterkollektion einzeln.
Bei 500 Codes sind das 501 Firestore-Reads pro Aufruf des Dashboards. Für eine
Klasse ist das egal, für eine Gesamtsicht nicht. Entweder ein Aggregat-Doc, das
bei jedem `mirrorProgress` mitgeschrieben wird, oder ein Cache mit Standdatum.
Was ist dir lieber?

## Fragen an dich

1. **Wie meldet sich ein Admin an?** Eigenes Geheimnis analog Korrektorat
   (`ADMIN_PASSCODE` + `ADMIN_SESSION_SECRET`), oder soll dein Lehrer-Secret
   gelten?
2. **Wie weit reicht der Blick?** `ki26` und `10mio` liegen im selben
   Firebase-Projekt, ein Admin könnte technisch beides lesen. Ich würde den
   Namespace hart auf `abstimmungen/ki26` festnageln. Einverstanden?
3. **Was zählt als «Nutzung»?** Anzahl Codes, Anzahl Klassen aus der
   `teachers`-Collection, letzte Aktivität, Fortschritt pro Modul und Thema. Die
   `engagement`-Collection ist im Pfadmodul vorgesehen, aber der
   `ActivityTracker` ist unverändert (R6 verschoben, geteilte Datei). Messen wir
   Nutzung vorerst über `progress.updatedAt`, oder soll R6 zuerst kommen?
4. **Gilt die 5er-Schwelle auch für den Admin?** Bei einer Klasse mit drei
   Personen ist sonst der Rückschluss auf Einzelne möglich. Ich wäre dafür, sie
   beizubehalten und stattdessen «zu klein für eine Auswertung» anzuzeigen.
5. **Datenschutz-Aussagen nachziehen.** `ki26` speichert pseudonyme
   Pro-Schüler-Daten, das frühere «nur anonyme Aggregate» ist schon revidiert
   (Decision-Log 2026-06-26). Eine Sicht über alle Codes ist eine weitere Stufe
   und gehört in die Aussagen gegenüber Lernenden und Lehrpersonen, bevor wir
   sie bauen. App Check ist übrigens aus.

## Zwei Befunde, die ich vorziehen würde

**Ein echtes NUL-Byte in `teacherStore.ts`.** An Byte 17258 steht
`const key = \`${art}<NUL>${base}\`` — als Trennzeichen gedacht, aber als rohes
Byte im Quelltext statt als `\0`-Escape. Folge: `grep` und `ripgrep` halten die
Datei für binär und überspringen sie **stillschweigend**. Wer beim Bauen nach
den neun Funktionen sucht, findet sie nicht; die Datei existiert für jede
Codesuche praktisch nicht. Ein Zeichen ändern, Problem weg. Das würde ich vor
dem Dashboard machen, nicht danach.

**`npm run lint` ist defekt.** Next 16 hat `next lint` entfernt, der Befehl
interpretiert «lint» als Projektverzeichnis. Ersatz bis zur Migration auf die
ESLint-CLI: `npx tsc --noEmit`.

## Aufteilung

Nach dem Muster des Klassenvergleichs: Du das Admin-SDK- und Rules-nahe, also
Login und Aggregations-Route; ich die Anzeige. Einverstanden?

## Wenn wir es kleiner halten wollen

Eine einzige Zahlenübersicht ohne Klassenbezug: Anzahl Codes, davon mit und ohne
Klasse, Fortschritt pro Modul als Mittelwert, letzte Aktivität. Das braucht
genau eine Route und keinerlei Personenbezug, und es beantwortet die eigentliche
Frage «wird das Lernset benutzt» schon. Klassen-Ranglisten und Einzelsichten
könnten später folgen, sobald Frage 5 geklärt ist.
