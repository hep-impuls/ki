# Info an Pietro — Admin-Dashboard für ki26

**Von:** Christof · **Stand:** 2026-08-10 · **Betrifft:** Admin SDK, geteiltes
Firebase-Projekt, Datenschutz-Aussagen → deshalb diese Abstimmung.

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
