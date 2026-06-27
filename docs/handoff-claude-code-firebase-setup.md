# Handoff für Claude Code — ki26 an Firebase anbinden & verifizieren

> **Zweck.** Schritt-für-Schritt-Anleitung für eine **Claude-Code-Session auf
> Pietros Windows-Rechner** (Repo-Zugriff + Terminal; Firebase-Console über
> Pietro). Bringt den in R0–R5 gebauten Registrierungs-/Klassencode-/Lehrer-
> Report-Tier zum Laufen.
>
> Hintergrund + Code-Landkarte: [docs/handoff-firebase-ki26.md](handoff-firebase-ki26.md)
> · Plan: [docs/PLAN_registrierung-klassencode.md](PLAN_registrierung-klassencode.md)

## ⚠️ Harte Leitplanken (nicht verletzen)

1. **NIEMALS `firebase deploy` aus diesem Repo** — schon gar nicht
   `--only firestore:rules` oder `--only functions`. ki26 teilt das Firebase-
   Projekt `iperka-lms` mit `10mio`; ein Deploy überschreibt die live `10mio`-
   Rules/Functions. ki26 braucht **keinen** Firebase-Deploy. Deployment läuft nur
   über **Vercel** (Git-Push).
2. **Service-Account-JSON niemals committen.** Nur als Env-Var (`.env.local`
   lokal, Vercel-Env in der Cloud). `.env.local` ist gitignored — prüfen.
3. **Namespace `abstimmungen/ki26/…`** ist fix (`NEXT_PUBLIC_UNIT_ID=ki26`).
   Nichts unter `abstimmungen/10mio-2026/…` anfassen.
4. **Vor dem ersten Edit `git pull --rebase origin main`**; am Ende committen +
   `git pull --rebase` + `git push` (Repo wird von Pietro & Christof gepflegt,
   siehe `CLAUDE.md`).

## Schritt 0 — Integritätscheck (wichtig)

Die Dateien wurden in einer Cowork-Sandbox erzeugt, deren Mount Dateien
gelegentlich abschneidet. **Zuerst Integrität prüfen**, bevor gebaut wird.

```bash
git status
git diff --stat
```

Erwartete neue/geänderte Dateien:

```
package.json                                  (+ firebase-admin, server-only)
.env.local.example                            (+ UNIT_ID, FIREBASE_SERVICE_ACCOUNT)
src/lib/session.ts paths.ts types.ts db.ts api.ts progressMirror.ts firebaseAdmin.ts
src/lib/server/teacherStore.ts apiResponse.ts
src/app/api/teacher/{setup,prefs,report}/route.ts
src/app/api/student/{class-exists,class-prefs,class-report}/route.ts
src/app/start/page.tsx
src/app/lehrperson/{page.tsx,setup/page.tsx,report/page.tsx}
src/components/SessionGate.tsx
src/app/lernen/lernseite-1/_components/ProgressMirror.tsx
src/app/lernen/lernseite-1/_lib/progressSnapshot.ts
src/app/lernen/lernseite-1/_lib/unitPolls.ts   (resolveKlasse an Session gekoppelt)
src/app/lernen/lernseite-1/page.tsx            (ProgressMirror eingebunden)
docs/handoff-firebase-ki26.md  docs/decisions.md  CLAUDE.md
```

Schnelltest auf abgeschnittene Dateien:

```bash
node -e "require('./package.json'); console.log('package.json OK')"
git ls-files -m -o --exclude-standard | grep -E "\.(ts|tsx)$" | while read f; do
  printf '%-60s last: ' "$f"; awk 'NF{l=$0} END{print l}' "$f";
done
```

Endet eine Datei mitten im Code (nicht mit `}`/`};`) oder parst JSON nicht →
abgeschnitten → mit Pietro klären / aus dem Cowork-Diff neu holen, **bevor**
weitergebaut wird.

## Schritt 1 — Dependencies installieren

`package.json` enthält neu `firebase-admin` (Admin-SDK, Server) und `server-only`.

```bash
npm install
npm ls firebase-admin server-only
```

## Schritt 2 — Service Account beschaffen (Pietro)

Der Lehrer-Tier läuft als **Next.js Route Handlers + Firebase Admin SDK** (kein
Cloud-Function-Deploy — Admin SDK umgeht die Firestore-Rules). Dafür braucht der
Server einen Service-Account-Key.

1. Firebase Console (**iperka-lms**) → ⚙️ Projekteinstellungen → **Dienstkonten**
   → **Neuen privaten Schlüssel generieren** → JSON laden.
2. JSON-Inhalt als **ein String** in `FIREBASE_SERVICE_ACCOUNT`. `firebaseAdmin.ts`
   akzeptiert rohes JSON (beginnt mit `{`) **oder** Base64:
   ```bash
   base64 -w0 service-account.json   # Git-Bash / WSL
   ```

## Schritt 3 — Env-Variablen

### Lokal (`.env.local`, Vorlage `.env.local.example`)

```
NEXT_PUBLIC_FIREBASE_API_KEY=…
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=…
NEXT_PUBLIC_FIREBASE_PROJECT_ID=iperka-lms
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=…
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=…
NEXT_PUBLIC_FIREBASE_APP_ID=…
NEXT_PUBLIC_UNIT_ID=ki26
FIREBASE_SERVICE_ACCOUNT=<rohes JSON ODER base64>
```

Die sechs `NEXT_PUBLIC_FIREBASE_*`-Werte sind browser-public und aus
`10mio/.env.local` übernehmbar (Astro `PUBLIC_*` → Next `NEXT_PUBLIC_*`).

> Fehlt `FIREBASE_SERVICE_ACCOUNT`, antworten die `/api/teacher|student`-Routen
> sauber mit **503** statt zu crashen. Der Schüler-Flow (Code, Fortschritt,
> Polls) läuft auch ohne — der nutzt nur das Client-SDK.

### Vercel (Production + Preview)

Settings → Environment Variables: dieselben acht Variablen für **Production** und
**Preview**, `FIREBASE_SERVICE_ACCOUNT` als Secret. Danach redeployen.

## Schritt 4 — Typecheck & Build

```bash
npm run build
```

Stolpersteine:
- **„Module not found: firebase-admin"** → Schritt 1 vergessen.
- **„server-only cannot be imported from a Client Component"** → etwas importiert
  `src/lib/server/*` oder `firebaseAdmin.ts` in eine `"use client"`-Datei. Diese
  gehören nur in die Route Handlers (`src/app/api/**`).
- Route Handlers haben bewusst `export const runtime = "nodejs"` (Admin SDK läuft
  nicht in der Edge-Runtime) — nicht entfernen.

## Schritt 5 — Firestore-Rules verifizieren (nur lesen, NICHT deployen)

Live `iperka-lms`-Rules werden aus dem **10mio-Repo** verwaltet. Nur prüfen
(Console → Firestore → Regeln), dass frei ist:

```
abstimmungen/{id}/students/{code}                read, write: if true
abstimmungen/{id}/students/{code}/progress/{m}   read, write: if true
abstimmungen/{id}/polls/{p}                       read, write: if true
abstimmungen/{id}/teachers/{code}                 Browser denied — egal (Admin SDK umgeht Rules)
```

Falls `students/{code}/progress` nicht gedeckt ist: **über das 10mio-Repo**
ergänzen, **nie aus ki26 deployen**.

## Schritt 6 — End-to-End-Test (lokal, zwei Browser)

```bash
npm run dev   # http://localhost:3000
```

1. **Lehrer:in (Browser A)** → `/lehrperson` → „Klasse anlegen" → Code (z.B.
   `PiRo-FS-A26`) + Secret (≥4) → „Registrieren & Daten sichern" (lädt
   `klassencode-….txt`). → Erfolgs-Card.
2. Firestore-Console: Doc `abstimmungen/ki26/teachers/PIRO-FS-A26` mit
   `secretHash` + `requiredModules: []`.
3. **Pflichtmodule** → „Pflichtmodule wählen" → ankreuzen → speichern.
4. **Schüler:in (Browser B, inkognito)** → `/start` → „Neu starten" → Code merken
   → Klassencode `PIRO-FS-A26` → „Klasse beitreten". → Redirect auf
   `/lernen/lernseite-1`; Doc `abstimmungen/ki26/students/{ANIMAL-NNN}` mit
   `teacherCode: "PIRO-FS-A26"`.
5. Ein paar Stationen abschliessen, ~30 s warten (oder Tab wechseln →
   ProgressMirror feuert bei `visibilitychange`). → Doc
   `students/{code}/progress/lernseite-1` mit `pct`, `blocks`.
6. **Report (Browser A)** → `/lehrperson/report?code=PIRO-FS-A26&secret=<secret>`
   → Schüler:in in der Tabelle mit `pct` je Modul. Falsches Secret → **403**.
7. **Single-owner:** in Browser B `/lehrperson` → denselben Code mit anderem
   Secret → „Code ist bereits vergeben" (Pre-flight) bzw. 403 serverseitig.

## Schritt 7 — Optionales Session-Gate

Standard: Lernseite frei zugänglich (anonym ohne Cloud-Schreiben). Soll eine
Session erzwungen werden, Inhalt wrappen:

```tsx
import SessionGate from "@/components/SessionGate";
<SessionGate><KiEinheitV3 /></SessionGate>   // ohne Session → Redirect /start
```

`KiEinheitV3` ist aktuell **nicht** gegated — mit Pietro entscheiden.

## Schritt 8 — Commit & Push

```bash
git add -A
git pull --rebase origin main
git commit -m "feat(ki26): Registrierung, Klassencode & Lehrer-Report (R0-R5) an Firebase angebunden"
git push origin main
```

Vercel baut automatisch. Nach dem Deploy Schritt 6 auf der Vercel-URL wiederholen.

## Anhang — Endpunkt-Referenz

| Route (POST) | Body | Antwort |
|---|---|---|
| `/api/teacher/setup` | `{classCode, secret, requiredModules?}` | `{ok, requiredModules}` · 403 falsches Secret |
| `/api/teacher/prefs` | `{classCode, secret}` | `{requiredModules}` |
| `/api/teacher/report` | `{classCode, secret}` | `TeacherReport` |
| `/api/student/class-exists` | `{classCode}` | `{exists}` |
| `/api/student/class-prefs` | `{studentCode}` | `{requiredModules: string[]\|null}` |
| `/api/student/class-report` | `{studentCode}` | `{report: StudentClassReport\|null}` (k≥5) |

Fehlercodes: `400` fehlende Felder · `403` Secret falsch · `404` Klasse nicht
gefunden · `503` Service-Account nicht konfiguriert.
