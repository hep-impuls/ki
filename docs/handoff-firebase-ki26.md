# Handoff: Registrierung, Klassencode & Lehrer-Report (ki26)

> **Stand 2026-06-26.** Umsetzung von `docs/PLAN_registrierung-klassencode.md`
> (Milestones R0–R5). Dieses Dokument erklärt **wie** der neue Firebase-Tier
> funktioniert und **wie man Inhalte daran anbindet** — für Pietros *und*
> Christofs Claude-Sessions. Build/Lint/Firestore-Test laufen bei Pietro auf
> Windows (die Cowork-Sandbox kann weder zuverlässig bauen noch zu Firestore).

## TL;DR für Christof (Lernseite 2)

Du musst für deine Submodule fast nichts tun, damit der Lehrer-Report sie
erfasst — nur den lokalen Fortschritt spiegeln:

1. **Session ist schon da.** Schüler:innen kommen über `/start` (Animal-Code +
   optionaler Klassencode). Die Session liegt in `localStorage` unter
   `ki26-session` und wird von `@/lib/session` gelesen. Du brauchst sie nicht
   selbst zu erzeugen.
2. **Gate (optional):** Wickle deinen Seiteninhalt in `<SessionGate>` ein, wenn
   die Seite eine Session verlangen soll:
   ```tsx
   import SessionGate from "@/components/SessionGate";
   // ...
   <SessionGate><DeinSubmodulInhalt /></SessionGate>
   ```
   Ohne Session leitet das nach `/start?next=<pfad>` um.
3. **Fortschritt spiegeln:** Baue eine Snapshot-Funktion, die deinen lokalen
   Store in ein `Progress`-Objekt übersetzt, und ruf `mirrorProgress` damit auf.
   Vorbild: `src/app/lernen/lernseite-1/_lib/progressSnapshot.ts` +
   `_components/ProgressMirror.tsx`.
   ```tsx
   import { mirrorProgress } from "@/lib/progressMirror";
   import type { Progress } from "@/lib/types";

   const snapshot: Progress = {
     pct: 60,                       // 0..100
     quizScore: 4,                  // optional
     completedAt: null,             // ISO-String wenn fertig, sonst null
     blocks: {                      // ein Eintrag je Aktivität
       "intro": { type: "reflexion", completed: true },
       "quiz-1": { type: "mc", completed: true, punkte: 2, max: 3 },
     },
   };
   await mirrorProgress("lernseite-2/submodul-1", snapshot);
   //                    ^ moduleId == unit-Slug (siehe src/config/unit.ts)
   ```
   `mirrorProgress` ist **no-op ohne Session** und schluckt Fehler — es darf die
   UX nie blockieren. Ruf es periodisch / bei Sichtbarkeitswechsel auf (siehe
   `ProgressMirror.tsx`), nicht bei jedem Tastendruck (oder nutze
   `makeDebouncedMirror`).
4. **Klassen-Polls:** Wenn du anonyme Klassen-vs-alle-Polls willst, nutze die
   bestehenden Helfer (`unitPolls.ts` → `castPollVote(id, optionId)`). Die
   Klassen-Namespace-Auflösung (`resolveKlasse()`) liest jetzt automatisch den
   echten Klassencode aus der Session — du musst nichts koppeln.

Das war's. Sobald `pct` je Modul gespiegelt wird, taucht dein Submodul im
Lehrer-Report (`/lehrperson/report`) automatisch als Spalte auf.

## Architektur-Überblick

| Schicht | Datei(en) | Zweck |
|---|---|---|
| Session/Code | `src/lib/session.ts` | Animal-Code (`BÄR-334`), `Session {studentCode, teacherCode}`, localStorage-CRUD (`ki26-session`) |
| Pfade | `src/lib/paths.ts` | Firestore-Pfade unter `abstimmungen/ki26/…` (isomorph, kein Firebase-Import) |
| Typen | `src/lib/types.ts` | `Student`, `Progress`, `TeacherPrefs`, Report-Typen |
| Schüler-DB (Client) | `src/lib/db.ts` | `ensureStudent`, `loadStudent`, `linkTeacherCode`, `saveProgress`, `loadProgress`, `hashSecret` |
| Spiegel | `src/lib/progressMirror.ts` | `mirrorProgress(moduleId, progress)` — schreibt nur mit Session |
| API-Wrapper (Client) | `src/lib/api.ts` | `classExists`, `loadStudentClassPrefs/Report`, secret-gated Lehrer-Calls → `/api/...` |
| Admin (Server) | `src/lib/firebaseAdmin.ts` | Admin-SDK-Singleton aus `FIREBASE_SERVICE_ACCOUNT` |
| Server-Logik | `src/lib/server/teacherStore.ts` | single-owner Secret, Report-Aggregation; umgeht Rules |
| Route Handlers | `src/app/api/{teacher,student}/**/route.ts` | 6 POST-Endpunkte |
| Onboarding | `src/app/start/page.tsx` | Schüler-State-Machine |
| Gate | `src/components/SessionGate.tsx` | opt-in Redirect nach `/start` ohne Session |
| Lehrer-UI | `src/app/lehrperson/{,setup,report}/page.tsx` | anlegen · Pflichtmodule · Report |

## Warum Route Handlers statt Cloud Function

ki26 teilt das Firebase-Projekt `iperka-lms` mit `10mio` und darf **nie** Rules
oder Functions deployen (würde 10mio überschreiben). Darum läuft der Lehrer-Tier
als **Next.js Route Handlers + Firebase Admin SDK** im selben Vercel-Deploy. Das
Admin SDK **umgeht die Firestore-Rules** → `teachers/*`-Zugriff ohne
Rules-Änderung. Die Secret-Logik (SHA-256, single-owner) bleibt server-seitig.

## Datenmodell (Firestore)

```
abstimmungen/ki26/
  students/{studentCode}            teacherCode, createdAt
    progress/{moduleId}             pct, quizScore, completedAt, blocks{...}
  teachers/{classCode}              requiredModules[], updatedAt, secretHash
  polls/{pollId}                    counts:{[optionId]:n}   ← global + kp-{klasse}-* (Klasse)
  engagement/{id}                   (create-only, optional/R6)
```

- **Schüler-Docs**: Browser schreibt direkt (live Rules erlauben `students/*`).
- **teachers/***: nur Admin SDK (server). Klartext-Secret wird **nie**
  gespeichert (nur `secretHash`). Verlust = nicht wiederherstellbar → Backup-
  `.txt` beim Anlegen.
- **Poll-Aggregate Klasse vs. alle**: kommen aus der `polls`-Collection. Global
  = `p-*`/`g-*`/…; Klasse = `kp-{klasseNamespace(classCode)}-*`. Der Report
  trennt sie über das Präfix.

## Endpunkte (alle POST, JSON)

| Pfad | Body | Antwort |
|---|---|---|
| `/api/teacher/setup` | `{classCode, secret, requiredModules?}` | `{ok, requiredModules}` — single-owner (403 bei falschem Secret) |
| `/api/teacher/prefs` | `{classCode, secret}` | `{requiredModules}` |
| `/api/teacher/report` | `{classCode, secret}` | `TeacherReport` (Einzel-Schüler + Poll-Aggregate) |
| `/api/student/class-exists` | `{classCode}` | `{exists}` |
| `/api/student/class-prefs` | `{studentCode}` | `{requiredModules: string[]|null}` |
| `/api/student/class-report` | `{studentCode}` | `{report: StudentClassReport|null}` (k≥5) |

## Setup-Checkliste (Pietro, Windows)

1. **Dependencies installieren:** `npm install` (zieht `firebase-admin` +
   `server-only`, neu in `package.json`).
2. **Service-Account:** Firebase Console → Projekteinstellungen → Dienstkonten →
   „Neuen privaten Schlüssel generieren". Den JSON-Inhalt als Env-Var setzen:
   - lokal in `.env.local`: `FIREBASE_SERVICE_ACCOUNT=<json oder base64>`
   - in Vercel: Project → Settings → Environment Variables (Production+Preview).
   `NEXT_PUBLIC_UNIT_ID=ki26` ebenfalls setzen (falls noch nicht).
3. **Build/Lint:** `npm run build` (typecheckt alles; die Cowork-Sandbox kann das
   nicht zuverlässig — bitte hier prüfen).
4. **Rules verifizieren** (Console): live `iperka-lms`-Rules müssen
   `students/{code}/progress` freigeben. Laut CLAUDE.md decken sie `students/*`
   ab — Subcollection im Detail prüfen. Falls eine Subcollection fehlt: **über
   das 10mio-Repo** ergänzen, **nie** aus ki26 deployen.
5. **End-to-end-Test:** zwei Browser. (a) `/lehrperson` → Klasse anlegen
   (Code+Secret) → Backup-Datei. (b) `/start` → Code → Klassencode eingeben →
   Lernseite. (c) `/lehrperson/report?code=…&secret=…` → Schüler erscheint, `pct`
   füllt sich nach ~30 s.

## Bekannte Grenzen / offene Punkte

- **R6 (Engagement-Tracker-Umbau)** und ein eigener Schüler-`/klassenreport`
  sind **nicht** Teil dieser Umsetzung (Scope R0–R5). `ActivityTracker.tsx`
  bleibt unverändert (geteilte Datei).
- **Code-Kollision**: `generateCode()` hat keinen Kollisions-Check (Raum ~16k).
  Für Pilot-Klassengrößen unkritisch.
- **Datenschutz**: ki26 speichert neu pseudonyme Pro-Schüler-Daten (Code →
  Fortschritt). Siehe `docs/decisions.md` (2026-06-26) — das frühere „nur
  anonyme Aggregate"-Statement ist damit revidiert.
