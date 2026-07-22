# Plan: LLM-Code-Login + Klassencode (ki26)

Stand: 2026-07-22 · Autor: Pietro (mit Claude) · Betrifft geteilte Infra
(`src/lib/**`, `/start`, `/lehrperson`) → **mit Christof absprechen**, weil
Lernseite 2 dieselben Codes anzeigt.

Referenz: `10mio` (`D:\OneDrive - bbw.ch\+GIT\+hep\10mio`) — dort
Astro + Cloud Function; hier Next.js + Route Handlers.

---

## 0. Ausgangslage — was schon existiert (nicht neu bauen!)

ki26 hat die **volle 10mio-Login-/Lehrer-Struktur bereits portiert** und laut
CLAUDE.md E2E-getestet (R0–R5, Prod `hep-ki.vercel.app`). 10mios
`functions/index.js` (`exports.api`) ist 1:1 in `src/lib/server/teacherStore.ts`
abgebildet:

| 10mio Cloud Function | ki26 | Status |
|---|---|---|
| `handleTeacherSetup` (single-owner secret-hash) | `teacherStore.teacherSetup` | ✅ |
| `handleClassExists` | `teacherStore.classExists` | ✅ |
| `handleTeacherPrefs` | `teacherStore.teacherPrefs` | ✅ |
| `handleTeacherReport` | `teacherStore.teacherReport` | ✅ |
| `handleStudentClassReport` (k≥5) | `teacherStore.studentClassReport` | ✅ |
| `handleStudentClassPrefs` | `teacherStore.studentClassPrefs` | ✅ |
| student onboarding (`index.astro`) | `/start` page | ✅ |
| `teacher.astro` (Code+Secret anlegen) | `/lehrperson` page | ✅ |
| `teacher-setup.astro` (Pflichtmodule) | `/lehrperson/setup` | ✅ |
| Report | `/lehrperson/report`, `/klassenreport` | ✅ |
| `session.ts`, `db.ts`, `paths.ts`, `api.ts` | dieselben Namen | ✅ |

**Der Lehrer kann heute schon einen Klassencode mit Passwort erzeugen:**
`/lehrperson` → «Neue Klasse» → Code (frei wählbar, z.B. `PiRo-FS-A26`) +
Secret (≥4 Zeichen). Single-owner-Claim, `.txt`-Backup. Nichts daran fehlt.

**Kein Cloud-Function-Port nötig, kein Rules-Deploy** (Admin SDK umgeht Rules;
Live-`iperka-lms`-Rules decken `students/*`/`polls/*` ab; ki26 deployt nie Rules).

---

## 1. Der eigentliche Delta (das ist die Arbeit)

1. **Code-Format:** LLM-Namen statt Tiere + angehängter Buchstabe
   (`QWEN-34r`, `MINIMAX-22u`, `SONNET-56i`).
2. **Wiring:** Login tatsächlich in den Schüler-Fluss einbauen. Heute wird
   niemand nach `/start` geleitet, und der Hintergrund-Code aus `spuren.ts`
   erzeugt **kein** klassen-zuordenbares `students/{code}`-Doc.
3. **Optional:** Lehrer-Code automatisch generieren (statt frei tippen).

---

## 2. Code-Format-Umstellung — `src/lib/session.ts`

Einzige Datei mit der Format-Logik. Neu:

```ts
/** Modell-Pool für die Code-Generierung (ASCII-Identifier, Swiss/DE-neutral). */
export const MODELS = [
  "CLAUDE", "SONNET", "OPUS", "HAIKU", "GPT", "GEMINI", "GEMMA", "LLAMA",
  "MISTRAL", "QWEN", "DEEPSEEK", "GROK", "PHI", "FALCON", "COMMAND", "MINIMAX",
  "KIMI", "NOVA",
] as const;

const LETTERS = "abcdefghijkmnpqrstuvwxyz"; // ohne l/o (Verwechslung mit 1/0)

/** Format `MODELL-NNx`: 2 Ziffern (10–99) + Kleinbuchstabe, z.B. `QWEN-34r`. */
export function generateCode(): string {
  const model = MODELS[Math.floor(Math.random() * MODELS.length)];
  const num = String(Math.floor(Math.random() * 90) + 10); // 10..99
  const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
  return `${model}-${num}${letter}`;
}
```

**Raum:** 18 Namen × 90 × 24 ≈ 39 000 Codes. Für Klassengrössen reichlich; kein
Kollisions-Check nötig (wie bisher). Bei Bedarf Pool erweitern.

**Rückwärtskompatibel:** Ändert nur *neue* Codes. Bestehende `BÄR-…`-Codes in
Firestore bleiben gültige Strings — kein Migrations-Bedarf.

**Blast radius (Platzhalter-Texte, sonst nichts):**
- `src/app/start/page.tsx` — «returning»-Input Platzhalter `z.B. BÄR-334`
  → `z.B. QWEN-34r`. (Klassencode-Platzhalter `PiRo-FS-A26` bleibt.)
- `src/app/lernen/lernseite-2/_components/FortschrittsCode.tsx` — zeigt den
  Code nur als String an, keine Format-Annahme; **Christofs Datei**, ihn kurz
  informieren, nichts ändern.
- Kein Test-Suite in ki26 → nichts zu fixen.

---

## 3. Login ins Schüler-Erlebnis einbauen (das Kernstück)

**Problem heute:** `spuren.ts::ensureCode()` legt nur eine localStorage-Session
an (via `saveSession`), ruft aber **nicht** `ensureStudent()`. Dadurch
existiert kein `students/{code}`-Doc, nur die Progress-Subcollection darunter.
Firestore-Queries (`where('teacherCode','==',…)`) finden solche «Phantom»-Codes
nicht → Klassenvergleich unmöglich.

**Zwei Bausteine (aus der Login-Options-Diskussion, Empfehlung A+B):**

### 3a. Hintergrund-Code sichtbar machen — `spuren.ts`
`ensureCode()` zusätzlich `ensureStudent(code, null)` aufrufen lassen (aus
`@/lib/db`), damit das Student-Doc real existiert. Dann ist es später per
`linkTeacherCode` klassen-zuordenbar. Minimal, additiv, kein UX-Bruch.

### 3b. Klassencode einsammeln — sanft, rückwirkend
Das Zuordnen ist **rückwirkend** (Spuren/Gewichtungen liegen schon unter dem
Code; `linkTeacherCode` hängt nur die Klasse an). Deshalb kein harter Zwang:

- **B — vorbefüllter Link/QR (Lehrperson):** `/start` liest `?class=<CODE>` und
  füllt/verlinkt automatisch. Lehrperson verteilt einen Link
  `…/start?class=PiRo-FS-A26&next=/lernen/lernseite-2`. Kleine Ergänzung in
  `start/page.tsx` (Query-Param lesen, in `classInput` vorbelegen bzw.
  auto-`finishWithClass`).
- **A — Klassencode-Feld am Orakel (Auffangnetz):** Inline-Feld «🔒 Klassencode
  eingeben» → `linkTeacherCode` + Session-Update. Christofs Terrain (Anzeige).

`SessionGate` bleibt **optional/ungenutzt** — Lernseiten frei zugänglich. Falls
später doch Zwang gewünscht: `SessionGate` müsste gezielt `teacherCode` prüfen,
nicht nur `getSession()` (heute besteht ein klassen-loser Hintergrund-Code den
Gate).

---

## 4. Optional — Lehrer-Code automatisch generieren

Heute tippt die Lehrperson den Code frei (`/lehrperson`, z.B. `PiRo-FS-A26`) —
das ist bewusst so (sprechende, verteilbare Codes) und deckt sich mit 10mio.
Falls «generate class-code» *automatisch* gemeint war: ein «Code vorschlagen»-
Button, der z.B. `HEP-KI-<4 Zeichen>` erzeugt und ins Feld schreibt (Claim-Flow
unverändert). **Offene Frage an Pietro** (siehe §6). Empfehlung: frei tippbar
lassen + optionalen Vorschlags-Button — nicht erzwingen.

---

## 5. Betroffene Dateien (Zusammenfassung)

| Datei | Änderung | Owner |
|---|---|---|
| `src/lib/session.ts` | `MODELS`-Pool + neues `generateCode`-Format | gemeinsam |
| `src/app/start/page.tsx` | Platzhalter; `?class=`-Param lesen (§3b-B) | gemeinsam |
| `src/app/lernen/lernseite-2/_lib/spuren.ts` | `ensureStudent` in `ensureCode` (§3a) | Christof (absprechen) |
| Orakel-Anzeige (Klassencode-Feld, §3b-A) | neu | Christof |
| `/lehrperson` (optionaler Vorschlags-Button, §4) | optional | gemeinsam |

Alles unter `src/lib/**` + `/start` + `/lehrperson` ist laut CLAUDE.md
**«gemeinsam — nur nach Absprache»**. §2 + §3b-B + §4 = Pietro; §3a + §3b-A =
Christof. Vor dem Merge kurz synchronisieren.

---

## 6. Entscheidungen (2026-07-22 getroffen)

1. **Modell-Pool** (§2): ✅ Liste übernommen (18 Namen).
2. **Buchstaben-Pool:** ✅ `l`/`o` weggelassen.
3. **Lehrer-Code** (§4): ✅ frei tippbar lassen (wie heute) — Auto-Generieren
   verworfen, §4 entfällt.
4. **Onboarding-Härte** (§3b): A+B sanft (Empfehlung) — final am Christof-Termin.

---

## 7. Reihenfolge der Umsetzung

1. ✅ `session.ts` Format + `/start`-Platzhalter (§2) — umgesetzt & im Browser
   verifiziert. Endbuchstabe ist GROSS (`QWEN-34R`), wegen `toUpperCase()`.
2. ✅ `spuren.ts::ensureStudent` (§3a) — umgesetzt (mit Pietros Go, Christof
   informiert via Handoff); verifiziert: Klick erzeugt Code `MINIMAX-69J` +
   Spur, `ensureStudent`-Pfad läuft fehlerfrei. Firestore-Doc-Check: Konsole.
3. ✅ `/start ?class=`-Param (§3b-B) — umgesetzt & verifiziert (Prefill +
   rückwirkendes `linkTeacherCode` für bestehende Sessions).
4. ⏳ Orakel-Klassencode-Feld (§3b-A) — **Christof** (an Handoff übergeben).
5. ~~Lehrer-Code-Vorschlag (§4)~~ — verworfen.

Handoff für Christofs Session: [handoff-christof-login-codes.md](handoff-christof-login-codes.md).

Nach jedem Schritt: `npm run dev`, Test-Interaktion, in Firestore-Konsole
`abstimmungen/ki26/students/{code}` prüfen.
