# Info an Pietro — Klassenvergleich im Orakel (Lernseite 2)

**Von:** Christof · **Stand:** 2026-07-19 · **Betrifft:** geteilte Infrastruktur
(`session.ts`, `teachers/*`, `api/teacher/*`) → deshalb diese Abstimmung.

## Worum es geht

Das Orakel (Thema 03 auf Lernseite 2) wertet neu die **eigene Aktivität** einer
Person im Lernset aus — aus sechs Perspektiven («Boxen»): Angeklicktes,
Muster/Kombinationen genutzt, Weiterverfolgen, was relevant war, was ohne
Bedeutung blieb, was noch verunsichert. Wunsch: pro Box ein Dreiervergleich
**du ↔ deine Klasse ↔ alle**.

Ich möchte das nicht allein bauen, weil es dein Registrierungs-/Klassencode-Modell
und das Admin-SDK berührt. Kurzfassung: **Die Klick-Hälfte ginge fast sofort, die
Bewertungs-Hälfte braucht einen kleinen Zusatz.**

## Was heute schon vorhanden ist

- **Pro-Nutzer-Spur in Firestore:** `spuren.ts` spiegelt bereits die vollständige
  Liste der angeklickten Knoten pro Code nach
  `abstimmungen/ki26/students/{code}/progress/lernseite-2-spuren` (`{ids,
  updatedAt}`). Der Code wird via `ensureCode()` (deine `session.ts`) im
  Hintergrund erzeugt.
- **Anonyme Aggregate:** die Poll-Zähler (`polls/spuren-lernseite-2`,
  `polls/orakel-blick`) liefern das «alle» — ohne Personenbezug.
- **Klassen-Aggregation:** `teacherStore.loadClassStudents(classCode)` lädt schon
  alle Schüler einer Klasse samt `progress`-Docs; `studentClassReport()` macht
  bereits einen anonymen Klassenschnitt (mit k-Anonymität ≥ 5). Beides aber
  aktuell auf Quiz-Punkte/`pct` ausgelegt — es liest die Spur-`ids` noch nicht.

## Was für den Klassenvergleich fehlt

1. **Bewertungen spiegeln.** Die Gewichtungen (`gewichtung.ts`: relevanz,
   technikwert, verunsicherung-heute, philo-hilft, gestalt, achtsamkeit) liegen
   **nur lokal**. Für die drei bewertungsbasierten Boxen müsste ein Cloud-Spiegel
   analog `spuren.ts` dazu (Vorschlag:
   `students/{code}/progress/lernseite-2-gewichtung` mit `{values, updatedAt}`).
   → Das könnte ich auf der Lernseite-2-Seite bauen; ich frage nur, ob dir das
   Datenmodell/der Pfad so passt.

2. **Aggregations-Route (Admin SDK).** Eine Route, die per `teacherCode` alle
   Schüler einer Klasse lädt und deren `lernseite-2-spuren`/`-gewichtung`
   pro Box zusammenzählt → Klassen-Aggregat (analog `studentClassReport`, gleiche
   k-Anonymitäts-Schwelle). → Das ist Server-/Rules-nahe und dein Terrain.

3. **Anzeige im Orakel.** Pro Box `du ↔ Klasse ↔ alle`. → Mache ich clientseitig.

## Fragen an dich

- **Darf `gewichtung.ts` einen Cloud-Spiegel bekommen** (neues progress-Doc)? Es
  sind pseudonyme Selbsteinschätzungen (keine Noten) — passt das zum
  bewertungsfreien Anspruch von ki26, so wie die Spuren schon gespiegelt werden?
- **k-Anonymität:** `studentClassReport` nutzt ≥ 5. Gleiche Schwelle für die
  Orakel-Boxen?
- **Login-Realität:** Der Code entsteht heute automatisch im Hintergrund. Für
  einen echten *Klassen*vergleich muss die Person den **Klassencode** via `/start`
  eingeben (`linkTeacherCode`). Sollen wir das Onboarding auf Lernseite 2 aktiver
  bewerben (z.B. Hinweis am Anfang / SessionGate)?
- **Aufteilung:** Ich mache Spiegel (falls ok) + Anzeige; du die
  Aggregations-Route + alles Rules-/Admin-SDK-nahe. Einverstanden?

## Wenn wir es kleiner halten wollen

Nur die **Klick-Boxen** (Angeklicktes, Muster, Weiterverfolgen, Bilder, Videos)
vergleichen — die Daten dafür liegen schon pro Code in Firestore. Das gäbe bereits
einen sinnvollen `du ↔ Klasse ↔ alle`-Vergleich, ohne `gewichtung.ts` anzufassen.
Die Bewertungs-Boxen blieben dann vorerst «nur du» (lokal).
