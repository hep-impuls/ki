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

## Architecture

A minimal Next.js 16 App Router learning platform for teaching AI concepts, deployed to Vercel with Firebase for anonymous tracking.

**Three-layer structure:**

- `src/app/` — Next.js App Router pages and root layout. `layout.tsx` sets `lang="de"` and global metadata. `page.tsx` is the landing page with module cards. Learning modules live under `lernen/lernseite-{1,2}/page.tsx`.
- `src/components/ActivityTracker.tsx` — invisible client component (`"use client"`) mounted on each page; triggers anonymous sign-in and logs page-view events to Firestore.
- `src/lib/` — Firebase singleton (`firebase.ts`) with lazy init guarded against SSR, and `logActivity()` helper (`activity.ts`) that writes to Firestore under `activities/{uid}/events`.

**Data flow:** On first page load, `ActivityTracker` calls `signInAnonymously`, gets a UID, then calls `logActivity(type, payload)` which writes a Firestore document. `firestore.rules` restricts each user to writing only their own activity documents.

**Path alias:** `@/*` resolves to `./src/*` (configured in `tsconfig.json`).

## Tech Stack

- **Next.js 16** (App Router, Turbopack, React 19, TypeScript strict mode)
- **Firebase 11** — Anonymous Auth + Firestore (client SDK only, no Admin SDK)
- **Tailwind CSS 3** with a custom `brand` color palette (`tailwind.config.ts`)
- **Vercel** for deployment (`vercel.json` pins the Next.js framework preset)

## Content Customization

New learning modules go under `src/app/lernen/`. Each module is a standard Next.js page file; add `<ActivityTracker page="..." />` to log visits. The existing `lernseite-1` and `lernseite-2` pages are intentional placeholders.
