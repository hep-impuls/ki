# Handoff an Christof (+ seine Claude-Code-Session) — Login/Code-Umstellung

Stand: 2026-07-22 · Von: Pietro (mit Claude) · Betrifft: geteilte Infra
(`src/lib/session.ts`, `/start`) + zwei deiner lernseite-2-Dateien.

## TL;DR

Ich habe das Fortschritts-Code-System umgestellt (**LLM-Namen + Endbuchstabe**
statt Tiere) und den Login enger an den Schüler-Fluss gebunden. Ist **schon auf
`main` gepusht**. Zwei deiner Dateien musste ich minimal mitziehen, sonst wäre
dein «anderes Gerät»-Feature gebrochen. **Bitte zuerst `git pull --rebase`,
bevor du an lernseite-2 weiterarbeitest.**

---

## Was sich geändert hat (schon live)

1. **Code-Format** — `src/lib/session.ts`
   - Neu `MODELS`-Pool (LLM-Namen: CLAUDE, SONNET, QWEN, MINIMAX, …) statt
     `ANIMALS`.
   - Format `MODELL-NNX`: 2 Ziffern + **Grossbuchstabe**, z.B. `QWEN-34R`.
   - ⚠️ **Der Endbuchstabe ist bewusst GROSS.** Codes werden überall mit
     `toUpperCase()` normalisiert (Firestore-Doc-IDs sind case-sensitiv). Ein
     Kleinbuchstabe würde beim Wieder-Eingeben zerstört. **Baue nichts, das
     Codes klein erwartet oder den Suffix klein macht.**

2. **`/start`** — vorbefüllter Klassen-Link
   - `/start?class=CODE` befüllt das Klassencode-Feld vor; hat die Person schon
     einen (Hintergrund-)Code ohne Klasse, wird die Klasse **rückwirkend**
     verknüpft (`linkTeacherCode`). Für Lehrpersonen-Links gedacht.

3. **`FortschrittsCode.tsx`** (deine Datei) — nötige Begleit-Änderung
   - Validierungs-Regex akzeptiert jetzt das neue Format:
     `/^[A-ZÄÖÜ]+-\d{2,4}[A-Z]?$/` — **abwärtskompatibel**, alte `BÄR-334`
     gelten weiter. Plus Platzhalter/Fehlertext auf `QWEN-34R`.

4. **`spuren.ts`** (deine Datei) — §3a des Plans
   - `ensureCode()` ruft jetzt zusätzlich `ensureStudent(code, null)` (aus
     `@/lib/db`). Damit entsteht ein **reales** `students/{code}`-Doc, nicht nur
     die Progress-Subcollection. **Das ist die Voraussetzung dafür, dass der
     Code einer Klasse zugeordnet werden kann** (die Klassen-Query fragt
     `where("teacherCode","==",…)` — Phantom-Docs ohne echtes Parent-Doc werden
     nicht gefunden).

5. **`OrakelDashboard.tsx`** (deine Datei) — nur kosmetisch: Beispiel-Code im
   Datenschutz-Erklärtext «BÄR-334» → «QWEN-34R».

Details + Analyse: [docs/PLAN_login-llm-codes.md](PLAN_login-llm-codes.md).

---

## Was du (bzw. deine Claude-Session) tun solltest

1. **`git pull --rebase origin main`** — zwingend vor dem nächsten Edit.
2. **Kurz gegenlesen**, ob dir an `FortschrittsCode.tsx` / `OrakelDashboard.tsx`
   etwas nicht passt (ich habe nur das Nötigste angefasst). Bei Umbau-Wünschen
   melde dich — es sind geteilte bzw. deine Dateien.
3. **Deine offene Aufgabe — der Klassenvergleich im Orakel** (aus eurer
   ursprünglichen Abstimmung): Die Datengrundlage steht jetzt (Codes sind
   klassen-zuordenbar). Was noch fehlt und **dein Terrain** ist:
   - **§3b-A — Klassencode-Feld im Orakel** («🔒 Klassencode eingeben, um deine
     Klasse zu sehen» → `linkTeacherCode` + Session-Update). Sinnvoll erst
     zusammen mit der Anzeige, sonst ist das Feld ohne sichtbaren Effekt.
   - **Anzeige pro Box: du ↔ Klasse ↔ alle.** «du» = lokal, «alle» =
     anonyme Poll-Zähler (hast du schon), «Klasse» = neue Aggregations-Route.
   - **Gewichtungs-Spiegel** (falls noch nicht): `gewichtung.ts` analog
     `spuren.ts` nach `students/{code}/progress/lernseite-2-gewichtung`
     spiegeln, damit die bewertungsbasierten Boxen einen Klassenschnitt haben.
4. **Pietros Teil (nicht deiner):** die **Aggregations-Route** (Admin SDK), die
   pro Klasse die `lernseite-2-spuren`/`-gewichtung` zusammenzählt (analog
   `studentClassReport`, k-Anonymität ≥ 5). Sag Bescheid, sobald dein
   Gewichtungs-Spiegel steht und klar ist, welche Boxen aggregiert werden —
   dann baut Pietro die Route.

## Konventionen, die du beim Bauen einhalten musst

- Codes immer via `getSession()`/`session.ts` behandeln, nie das Format
  hardcoden. Nach `toUpperCase()` normalisieren (der Suffix ist gross).
- Klassencode setzen **nur** über `linkTeacherCode(studentCode, classCode)`
  (aus `@/lib/db`) + `saveSession(...)` — nicht direkt schreiben.
- k-Anonymität ≥ 5 für jede Klassen-Anzeige (wie `studentClassReport`).
