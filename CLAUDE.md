# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow & Kollaboration (zwingend)

Das Repo wird von **zwei Personen** gepflegt (Pietro Rossi, Christof Glaus). Diese
Regeln sind verpflichtend für jede Claude-Session — sie minimieren Merge-Konflikte
und halten den Code-Stil konsistent.

### Zu Session-Beginn

1. **Diese CLAUDE.md zuerst vollständig lesen.**
2. **`git pull --rebase origin main`** ausführen, bevor irgendetwas editiert wird.

### Zu Session-Ende

1. Geänderte Dateien mit aussagekräftiger Commit-Message committen.
2. **`git pull --rebase origin main`** direkt vor dem Push.
3. **`git push origin main`** — auch wenn der User es nicht explizit verlangt.

### Owner-Mapping (Default)

Wer was editiert, ohne sich vorher abzusprechen:

| Owner | Pfade |
|---|---|
| **Pietro** | `src/app/lernen/lernseite-1/**`, `src/config/units/lernseite-1.ts` |
| **Christof** | `src/app/lernen/lernseite-2/**`, `src/config/units/lernseite-2.ts` |
| **gemeinsam** | Layout-Komponenten (`src/components/layout/**`), `src/app/page.tsx` (Titelseite), `src/app/layout.tsx`, `globals.css`, `tailwind.config.ts`, `src/config/unit.ts` (Aggregator), `firestore.rules`, `package.json` — **nur nach Absprache** ändern. |

Die Titelseite (`src/app/page.tsx`) wird **am Ende** gemacht — vorher nicht
inhaltlich anfassen.

### Stil-Bibliothek (verbindlich)

Damit beide Claude-Sessions identischen Code produzieren:

- **Icons:** Material Symbols Outlined via `<span className="material-symbols-outlined">name</span>`. Keine Inline-SVGs, keine Emojis.
- **Farben / Spacings / Typografie:** ausschliesslich die MD3-Tokens aus
  [tailwind.config.ts](tailwind.config.ts) + [src/app/globals.css](src/app/globals.css) — z.B. `text-tertiary`,
  `bg-surface-bright`, `border-outline-variant`, `text-headline-xl`, `gap-md`,
  `pb-lg`. **Keine** Tailwind-Standardfarben (`slate-`, `fuchsia-`, `brand-`)
  in neuen Komponenten.
- **Sprache:** UI-Texte auf Deutsch.
- **Umlaute & Eszett (zwingend):** In **jedem** produktiven Text — UI-Strings,
  `_data/*`-Inhalte, Kommentare, Commit-Messages — werden **echte Umlaute
  `ä ö ü` (und `Ä Ö Ü`)** geschrieben, **niemals** die Ersatzschreibung
  `ae/oe/ue` (kein «Zurueck», «moechte», «fuer», «Geraet» → richtig: «Zurück»,
  «möchte», «für», «Gerät»). Einzige Ausnahme: technische Identifier, bei denen
  Umlaute nicht erlaubt/erwünscht sind (Datei-/Variablennamen, `slug`s,
  Firestore-Doc-IDs, `sourceKey`). Das **Eszett `ß` wird zu `ss`** (Swiss
  Standard German). Bei jeder Änderung mitlaufend korrigieren, falls noch
  `ae/oe/ue` im Bestand auftaucht.
- **Datei-Layout:** jede Modul-Hub- und Submodul-Page wird in `<AppLayout>`
  gewrappt und beginnt mit `<ActivityTracker type=... page=... />`.

### Submodul-Template

Eine neue Submodul-Page (`src/app/lernen/lernseite-{1,2}/{slug}/page.tsx`) sieht
exakt so aus — nur `slug`, `Titel`, `Subtitel` und Inhalt anpassen:

```tsx
import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";

export default function Lernseite2SubmodulX() {
  return (
    <AppLayout>
      <ActivityTracker
        type="lesson_open"
        page="lernseite-2/<slug>"
        lessonId="lernseite-2-<slug>"
      />

      <Link
        href="/lernen/lernseite-2"
        className="inline-flex items-center gap-xs text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Zurück zu Lernseite 2
      </Link>

      <header className="mt-lg border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Lernseite 2 · <Titel>
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface"><Titel></h1>
        <p className="mt-sm text-body-lg text-on-surface-variant">
          <Kurzbeschreibung>
        </p>
      </header>

      <section className="mt-xl space-y-md text-body-md text-on-surface-variant max-w-3xl">
        <p>Inhalt …</p>
      </section>
    </AppLayout>
  );
}
```

Zusätzlich den passenden Eintrag in `src/config/units/lernseite-{1,2}.ts`
ergänzen (`slug`, `title`, `href`, `icon`, `subtitle`, `description`). Die
Aggregator-Datei `src/config/unit.ts` zieht das automatisch ein.

### Inhalts-Skripte

Inhaltliche Skripte (didaktische Grundlage pro Submodul — Lernziele,
Schwerpunkte, Reflexionsfragen, Visualisierungsideen) leben in
[docs/skripte/](docs/skripte/) als Markdown, ein File pro Submodul mit dem
Namensmuster `lernseite-{n}-submodul-{m}-{kurzname}.md`. Wird vom Owner
gepflegt und fortlaufend ergänzt. Die `page.tsx` ist die *Umsetzung*; das
Skript ist die *Quelle*.

## Commands

```bash
npm run dev      # Dev server at http://localhost:3000 (Turbopack)
npm run build    # Production build
npm start        # Start production server
npm run lint     # ESLint via Next.js
```

No test suite is configured yet.

## Environment

Copy `.env.local.example` to `.env.local`. Vorlage enthält alle Kommentare:

```
NEXT_PUBLIC_FIREBASE_API_KEY=…
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=…
NEXT_PUBLIC_FIREBASE_PROJECT_ID=iperka-lms
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=…
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=…
NEXT_PUBLIC_FIREBASE_APP_ID=…
NEXT_PUBLIC_UNIT_ID=ki26
FIREBASE_SERVICE_ACCOUNT=<minifiziertes JSON oder Base64>   ← server-only, nur Pietro
```

Die sechs `NEXT_PUBLIC_FIREBASE_*`-Werte und `NEXT_PUBLIC_UNIT_ID` sind
browser-public und für Christof gefahrlos teilbar (direkt aus Pietros
`.env.local` übernehmen). `FIREBASE_SERVICE_ACCOUNT` braucht nur Pietro
(Lehrer-Tier / Route Handlers). `.env.local` ist gitignored.

**⚠️ `FIREBASE_SERVICE_ACCOUNT` muss einzeilig sein.** Next.js liest `.env.local`
zeilenweise — mehrzeiliger JSON-Wert wird nach `{` abgeschnitten → 503.
Minifizieren: `python -c "import json,sys; print(json.dumps(json.load(open('sa.json')),separators=(',',':')))"`
oder als Base64. `firebaseAdmin.ts` akzeptiert beides (auto-detect).

### Firebase-Projekt (gemeinsam genutzt — Stand 2026-06-24, Pietro)

Wir nutzen **kein eigenes** Firebase-Projekt fuer `ki26`, sondern **teilen das
bestehende Projekt `iperka-lms`** (Pietros Account, dasselbe wie `10mio`). Die
Web-Config wurde aus `10mio/.env.local` uebernommen (Astro-`PUBLIC_*` →
Next-`NEXT_PUBLIC_*` gemappt) und liegt in `ki26/.env.local` (gitignored).

- **Namespace:** `NEXT_PUBLIC_UNIT_ID=ki26`. **Alle** Firestore-Pfade dieses
  Lernsets liegen unter `abstimmungen/ki26/...` und kollidieren nie mit
  `10mio` (`abstimmungen/10mio-2026/...`).
- **Keine Rules-Aenderung noetig.** Die *live deployten* `iperka-lms`-Rules
  erlauben bereits `abstimmungen/{beliebigeId}/polls` (read/write) und
  `abstimmungen/{beliebigeId}/students/*` — beides deckt `ki26` ohne weiteres ab.
- **⚠️ Rules sind projektweit und werden aus dem `10mio`-Repo verwaltet.**
  Aus `ki26` **niemals** `firebase deploy --only firestore:rules` ausfuehren —
  das wuerde die live `10mio`-Rules ueberschreiben. `ki26` braucht keinen
  Rules-Deploy. (Das `ki26/firestore.rules`-File ist daher nur ein lokaler Stub,
  nicht die deployte Quelle.)
- **Datenmodell `ki26` (bewertungsfrei):** nur anonyme **Aggregat-Zaehler**
  (Poll-`counts` via `increment(+1)`) unter `abstimmungen/ki26/polls/{pollId}`;
  Einzelantworten / „ein Satz" bleiben im Browser (localStorage). Kein
  Points-/Progress-Modell, **kein Cloud Function**, App Check vorerst aus.
- **Christof:** braucht nur ein eigenes `ki26/.env.local` mit den 7
  `NEXT_PUBLIC_*`-Werten (von Pietro übernehmen — browser-public). Kein
  `FIREBASE_SERVICE_ACCOUNT` nötig für `lernseite-2`-Arbeit. Fortschritt
  spiegeln via `mirrorProgress("lernseite-2/…", snapshot)` — Vorbild:
  `src/app/lernen/lernseite-1/_lib/progressSnapshot.ts` +
  `_components/ProgressMirror.tsx`. Vollständige Anleitung:
  [docs/handoff-firebase-ki26.md § TL;DR für Christof](docs/handoff-firebase-ki26.md).
- **Verifizieren:** lokal `npm run dev`, eine Test-Interaktion ausloesen, in der
  Firestore-Konsole unter `abstimmungen/ki26/` pruefen, ob der Zaehler ankommt.

## Design references (authoritative)

Two handoff docs in [design/](design/) define the **target architecture** this repo is being built toward. Read them before generating UI or touching the data layer:

- **[design/handoff-layout.md](design/handoff-layout.md)** — visual system: MD3 color tokens as space-separated RGB CSS variables, Inter + Material Symbols Outlined fonts, custom Tailwind spacing/typography scale, the four layout components (`TopAppBar`, `SideNav`, `MobileNav`, `AppLayout` shell), responsive breakpoints, page inventory, and the GitHub Actions CI/CD pattern.
- **[design/handoff-firebase.md](design/handoff-firebase.md)** — data architecture: anonymous student codes in localStorage (no Firebase Auth), classcode + SHA-256-hashed-secret teacher model, Firestore namespaced under `abstimmungen/{unitId}`, Cloud Functions (`europe-west6`) for all teacher operations, App Check rollout.

**When generating content:** new learning pages live inside the `AppLayout` shell described in [handoff-layout.md §1–§2](design/handoff-layout.md), use the design tokens from §3, and follow the page-inventory conventions in §5 (e.g. `/module/[slug]` is the authoritative gate for required-modules). The unit-config object in §8 is the single source of truth for module metadata.

## Architecture (current state)

- `src/app/` — Next.js App Router pages. `layout.tsx` setzt `lang="de"` und globale Metadaten. `page.tsx` ist die Titelseite. Lernmodule unter `lernen/lernseite-{1,2}/`.
- `src/lib/` — geteilte Infrastruktur: `firebase.ts` (Client-Singleton), `session.ts` (Fortschritts-Code `MODELL-NNX`, z.B. `QWEN-34R` — LLM-Name + 2 Ziffern + Grossbuchstabe; früher Tier-Codes, alte gelten weiter — + localStorage), `paths.ts` (Firestore-Pfade), `types.ts`, `db.ts` (Client-SDK-Ops), `api.ts` (Route-Handler-Wrapper), `progressMirror.ts`, `polls.ts` (Aggregat-Zähler). Server-only: `firebaseAdmin.ts`, `server/teacherStore.ts`, `server/apiResponse.ts`.
- `src/app/api/` — 6 Route Handlers (teacher/setup, teacher/prefs, teacher/report, student/class-exists, student/class-prefs, student/class-report). Alle `POST`, alle `runtime="nodejs"` (Admin SDK).
- `src/app/start/` — Schüler-Onboarding (Fortschritts-Code generieren, Klassencode optional; `?class=CODE` befüllt/verknüpft einen Klassencode vorab, für Lehrpersonen-Links).
- `src/app/lehrperson/` — Lehrer-UI: Klasse anlegen, Pflichtmodule, Report.
- `src/components/ActivityTracker.tsx` — bleibt vorerst unverändert (R6 verschoben).
- `src/components/SessionGate.tsx` — Gate: ohne Session → Redirect `/start`. Aktiv über `src/app/lernen/layout.tsx` für **alle** `/lernen/**`-Routen (Lernseite 1 + 2). Der Fortschritts-Code wird damit im ersten Schritt (`/start`) erzeugt/eingegeben; ein Code fürs ganze Set.
- **KI-Einheit (Lernseite 1, Pietro)** — vollständige Umsetzung unter `src/app/lernen/lernseite-1/`: Auftakt, 5 Stationen, Abschluss, Landkarte, Zertifikat. Fortschritt wird via `ProgressMirror.tsx` nach Firestore gespiegelt.

**Path alias:** `@/*` resolves to `./src/*` (configured in `tsconfig.json`).

## Tech Stack

- **Next.js 16** (App Router, Turbopack, React 19, TypeScript strict mode)
- **Firebase 11** — Firestore client SDK; Cloud Functions for teacher operations (per handoff target). No Admin SDK in the browser.
- **Tailwind CSS 3** — current config uses a `brand` palette; the target is the MD3 token system in handoff-layout.md §3.
- **Vercel** for deployment (`vercel.json` pins the Next.js framework preset). Note: handoff-layout.md §6 describes a Firebase Hosting + GitHub Actions deploy — Vercel is the current choice for this repo; the `/api/**` rewrite to the Cloud Function is the only Firebase-Hosting-specific piece to reconcile.

## Decision log

Sprach-, Naming-, Design- und Inhalts-Entscheidungen, die nicht direkt aus dem
Code ersichtlich sind, werden in [docs/decisions.md](docs/decisions.md)
festgehalten. Wenn Claude eine solche Entscheidung trifft oder vom User
mitgeteilt bekommt: dort einen kurzen Eintrag (Datum + Entscheidung + betroffene
Stellen) ergänzen — jüngste oben.

## Open questions

- **R6 — Engagement-Tracker-Umbau** (`ActivityTracker.tsx` → Session-basiert): verschoben, geteilte Datei → mit Christof koordinieren.
- ~~**SessionGate auf lernseite-1**~~: **erledigt 2026-07-22** — Gate über `src/app/lernen/layout.tsx` für ganz `/lernen/**` aktiv (Login als erster Schritt, ein Code für Lernseite 1 + 2).

## Registrierung, Klassencode & Lehrer-Report (Stand 2026-06-26)

Umsetzung von `docs/PLAN_registrierung-klassencode.md` (R0–R5). **Volle
10mio-Parität**: Fortschritts-Code-Registrierung (Format `MODELL-NNX`, seit
2026-07-22 LLM-Namen statt Tiere — siehe `docs/PLAN_login-llm-codes.md`),
secret-geschützte Klassencodes (single-owner), Pro-Schüler-Fortschritts-Docs,
Lehrer-Report. Vollständige Anleitung (inkl. „wie binde ich Inhalte an Firebase
an" für Christof): [docs/handoff-firebase-ki26.md](docs/handoff-firebase-ki26.md).

**Neue Infrastruktur (geteilt, `src/lib/`):**

- `session.ts` — `generateCode()`, `Session {studentCode, teacherCode}`,
  localStorage-CRUD (`ki26-session`).
- `paths.ts` — Firestore-Pfade unter `abstimmungen/ki26/…` (isomorph).
- `types.ts` — `Student`, `Progress`, `TeacherPrefs`, Report-Typen.
- `db.ts` — Client-SDK: `ensureStudent`, `loadStudent`, `linkTeacherCode`,
  `saveProgress`, `loadProgress`, `hashSecret`.
- `progressMirror.ts` — `mirrorProgress(moduleId, progress)`; no-op ohne Session.
- `api.ts` — Client-Wrapper für die Route Handlers (`/api/...`).
- `firebaseAdmin.ts` — **server-only** Admin-SDK-Singleton aus
  `FIREBASE_SERVICE_ACCOUNT`.
- `server/teacherStore.ts` + `server/apiResponse.ts` — Server-Logik (single-owner
  Secret, Report-Aggregation; umgeht Rules via Admin SDK).

**Neue Routen:** `src/app/api/{teacher/setup,teacher/prefs,teacher/report,student/class-exists,student/class-prefs,student/class-report}/route.ts`
· `src/app/start/page.tsx` (Onboarding) · `src/app/lehrperson/{,setup,report}/page.tsx`
· `src/components/SessionGate.tsx` (opt-in Gate).

**Backend-Entscheid:** Lehrer-Tier läuft als **Next.js Route Handlers + Firebase
Admin SDK** (nicht Cloud Function) — kein Deploy ins geteilte `iperka-lms`, Admin
SDK umgeht die Rules. Setup abgeschlossen (2026-06-27): `firebase-admin 13.10.0`
installiert, `FIREBASE_SERVICE_ACCOUNT` in `.env.local` (einzeilig) und Vercel,
E2E-Test lokal + Production (`https://hep-ki.vercel.app`) bestanden.

**Datenschutz:** ki26 speichert jetzt pseudonyme Pro-Schüler-Daten (Code →
Fortschritt). Das frühere „nur anonyme Aggregate"-Statement ist revidiert
(siehe Decision-Log 2026-06-26). Detaildaten (Reflexion, Profil, Einzelantworten)
bleiben lokal; gespiegelt wird nur ein minimaler Fortschritts-Snapshot.

**ActivityTracker.tsx unverändert** (R6 — Engagement-Umbau — verschoben, geteilte
Datei → mit Christof koordinieren).
