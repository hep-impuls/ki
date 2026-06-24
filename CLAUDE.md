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

Copy `.env.local.example` to `.env.local` and fill in Firebase credentials from the Firebase Console:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

All variables are `NEXT_PUBLIC_` (browser-visible). `.env.local` is gitignored.

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
- **Christof:** kann Client-Code frei ergaenzen — Reads/Writes auf
  `abstimmungen/ki26/...` sind durch die Rules gedeckt. Er braucht nur ein
  eigenes `ki26/.env.local` mit denselben 6 `NEXT_PUBLIC_FIREBASE_*`-Werten
  (browser-public, gefahrlos teilbar; von Pietro oder aus `10mio/.env.local`).
  Fuer Konsole-Zugriff / eigene Deploys muss Pietro ihn im Projekt hinzufuegen
  (Firebase Console → Nutzer und Berechtigungen).
- **Verifizieren:** lokal `npm run dev`, eine Test-Interaktion ausloesen, in der
  Firestore-Konsole unter `abstimmungen/ki26/` pruefen, ob der Zaehler ankommt.
  (Aus der Cowork-Sandbox nicht testbar — kein Netz-Egress zu Firestore.)

## Design references (authoritative)

Two handoff docs in [design/](design/) define the **target architecture** this repo is being built toward. Read them before generating UI or touching the data layer:

- **[design/handoff-layout.md](design/handoff-layout.md)** — visual system: MD3 color tokens as space-separated RGB CSS variables, Inter + Material Symbols Outlined fonts, custom Tailwind spacing/typography scale, the four layout components (`TopAppBar`, `SideNav`, `MobileNav`, `AppLayout` shell), responsive breakpoints, page inventory, and the GitHub Actions CI/CD pattern.
- **[design/handoff-firebase.md](design/handoff-firebase.md)** — data architecture: anonymous student codes in localStorage (no Firebase Auth), classcode + SHA-256-hashed-secret teacher model, Firestore namespaced under `abstimmungen/{unitId}`, Cloud Functions (`europe-west6`) for all teacher operations, App Check rollout.

**When generating content:** new learning pages live inside the `AppLayout` shell described in [handoff-layout.md §1–§2](design/handoff-layout.md), use the design tokens from §3, and follow the page-inventory conventions in §5 (e.g. `/module/[slug]` is the authoritative gate for required-modules). The unit-config object in §8 is the single source of truth for module metadata.

## Architecture (current state)

The repo is a **starting stub** — the handoff docs describe where it's headed. Today:

- `src/app/` — Next.js App Router pages. `layout.tsx` sets `lang="de"` and global metadata. `page.tsx` is the landing page with module cards. Learning modules live under `lernen/lernseite-{1,2}/page.tsx` and are intentional placeholders.
- `src/components/ActivityTracker.tsx` — invisible client component that signs in anonymously and logs page views. **Will be replaced** by the code+classcode session model from handoff-firebase.md (`lib/session.ts`, `ensureStudent`, no Firebase Auth).
- `src/lib/` — Firebase singleton + `logActivity()` writing to `activities/{uid}/events`. **Will be reorganized** into `firebase.ts` / `paths.ts` / `session.ts` / `db.ts` / `api.ts` per handoff-firebase.md §5.
- `firestore.rules` — currently restricts to the per-uid `activities` collection. **Will be replaced** by the `abstimmungen/{abstimmungId}/...` rules in handoff-firebase.md §3.

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

> **Hinweis (2026-06-24):** Fuer das `ki26`-Lernset (bewertungsfrei, nur
> Aggregat-Zaehler) ist diese Frage **nicht blockierend** — es laeuft rein ueber
> das Firestore-Client-SDK ohne Cloud Functions. Relevant wird sie erst, wenn
> spaeter der Klassencode-/Lehrpersonen-Tier (mit Cloud Functions) ergaenzt wird.

- **Hosting vs. Cloud Function rewrite.** The handoffs assume Firebase Hosting, which provides the `/api/**` → Cloud Function rewrite that `lib/api.ts` depends on (handoff-firebase.md §5.5, handoff-layout.md §6). This repo deploys to **Vercel**. Before wiring up the teacher backend, decide:
  - **Option A** — move hosting to Firebase Hosting (matches the handoffs verbatim; lose Vercel's preview deploys and Next.js edge features).
  - **Option B** — stay on Vercel and replicate the rewrite via `vercel.json` `rewrites` pointing at `https://europe-west6-<project>.cloudfunctions.net/api/:path*` (keeps Vercel; adds a cross-origin hop that needs CORS already enabled in the Cloud Function — it is, in handoff-firebase.md §4.2).
  - **Option C** — skip Cloud Functions entirely and implement the teacher endpoints as Next.js Route Handlers under `src/app/api/`, using the Firebase Admin SDK server-side. Diverges from the handoff but is the most idiomatic Next-on-Vercel choice.
