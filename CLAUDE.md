# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Open questions

- **Hosting vs. Cloud Function rewrite.** The handoffs assume Firebase Hosting, which provides the `/api/**` → Cloud Function rewrite that `lib/api.ts` depends on (handoff-firebase.md §5.5, handoff-layout.md §6). This repo deploys to **Vercel**. Before wiring up the teacher backend, decide:
  - **Option A** — move hosting to Firebase Hosting (matches the handoffs verbatim; lose Vercel's preview deploys and Next.js edge features).
  - **Option B** — stay on Vercel and replicate the rewrite via `vercel.json` `rewrites` pointing at `https://europe-west6-<project>.cloudfunctions.net/api/:path*` (keeps Vercel; adds a cross-origin hop that needs CORS already enabled in the Cloud Function — it is, in handoff-firebase.md §4.2).
  - **Option C** — skip Cloud Functions entirely and implement the teacher endpoints as Next.js Route Handlers under `src/app/api/`, using the Firebase Admin SDK server-side. Diverges from the handoff but is the most idiomatic Next-on-Vercel choice.
