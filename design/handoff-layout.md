# Handoff 01 — Layout, Design Tokens & CI/CD

**Audience:** Claude Code, starting a new educational-unit project that should *feel* like hep imPuls but uses a framework of your choice.

**Scope:** the visual chrome — page regions, navigation patterns, color/spacing/type tokens, build & deploy pipeline. Stack-agnostic: anything that produces static HTML + a touch of vanilla JS works (Next.js, SvelteKit, Nuxt, plain HTML+Tailwind, etc.). Code samples use generic HTML/JS/TS; adapt to your framework's component syntax.

**Not in scope:** content blocks (Quiz, Poll, Reflection, etc.), didactic patterns, copy.

**Env-var note:** samples below access env vars as `process.env.PUBLIC_X`. If your framework uses a different convention, substitute accordingly:
- Next.js: `process.env.NEXT_PUBLIC_X`
- Vite / SvelteKit / Nuxt 3: `import.meta.env.VITE_X` (or `PUBLIC_X` in SvelteKit)
- Plain HTML build: inject at build time via your bundler
The `PUBLIC_` prefix in this doc is a placeholder — rename to whatever your tool requires to expose vars to the browser.

---

## 1. Page-region anatomy

Every authenticated student page renders the same outer shell:

```
┌─────────────────────────────────────────────────────────────────┐
│ TopAppBar                              h-16, sticky, z-50       │  ← always
├─────────────────────────────────────────────────────────────────┤
│ ProgressRail (optional, sticky under header)                    │  ← module pages only
├──────────────┬──────────────────────────────────────────────────┤
│              │                                                  │
│  SideNav     │                                                  │
│  w-64        │            <main>   (slot)                       │
│  sticky      │            flex-grow p-8 md:p-xl                 │
│  hidden      │            max-width centered                    │
│  lg:flex     │                                                  │
│              │                                                  │
│              │                                                  │
├──────────────┴──────────────────────────────────────────────────┤
│ MobileNav   bottom fixed, h-16, md:hidden, z-50                 │  ← mobile only
└─────────────────────────────────────────────────────────────────┘
                                outer flex container: max-w-[1440px] mx-auto
```

Wrapper composition (`AppLayout` is the authenticated shell, `Layout` is the bare HTML wrapper):

```
Layout (HTML, <head>, theme CSS vars, fonts)
└── AppLayout
    ├── <script>redirect to / if no session</script>
    ├── TopAppBar
    ├── ProgressRail (conditional)
    ├── <div class="flex max-w-[1440px] mx-auto w-full">
    │     ├── SideNav (slot "extra")
    │     └── <main><slot /></main>
    │   </div>
    ├── MobileNav
    └── spacer div for fixed-bar clearance
```

Auth gate is dumb-simple: `<script>` block in `AppLayout` reads `localStorage` and calls `window.location.replace('/')` if no session. No SSR, no token verification — see `02-FIREBASE-ARCHITECTURE.md` for why.

### Unauthenticated pages (`/`, `/teacher`, `/anleitung-lehrperson`)

These bypass `AppLayout` entirely and render their own header inside `Layout`. Pattern:

- Center single card on `min-h-screen` with two soft blurred blobs in the background (`-z-10`, `blur-[120px]`, `bg-surface-container-high`).
- Card: `bg-white border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)]`.
- Stepped flow inside the card via `display: hidden` toggling between `<div id="step-N">` blocks driven by vanilla JS.

---

## 2. The five layout components

### 2.1 `TopAppBar`

**Purpose:** brand + primary horizontal nav + tools cluster on the right.

**Structure:**
- Left: logo (clickable → `/dashboard`) + horizontal link list (`Module`, `Glossar`, `Notizen`, `Ergebnisse`). Hidden on mobile (`hidden md:flex`).
- Right cluster:
  - Module **prev/next arrows** (only on `/module/[slug]`), 32×32 outlined buttons with `chevron_left` / `chevron_right` icons.
  - Optional initiative subtitle as small uppercase pill.
  - Help button (32×32 circle, `help_outline`) — dispatches a custom event for the onboarding tour.
  - User menu button (32×32 avatar, `person`) — opens a 288px-wide popover containing:
    - Student code (mono, with copy button)
    - Klassencode input + save button (writes to localStorage + Firestore)
    - Links: Klassenreport (conditional), Feedback, Reset progress, Logout

**Classes worth copying:**
- Sticky bar: `bg-white border-b border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] sticky top-0 z-50`
- Active link: `text-primary border-b-2 border-primary pb-1 font-bold`
- Inactive link: `text-slate-600 hover:text-slate-900 transition-colors`
- Inner container: `flex justify-between items-center h-16 px-10 w-full max-w-[1440px] mx-auto`

### 2.2 `SideNav`

**Purpose:** vertical nav with three regions stacked top to bottom inside a `flex flex-col h-full`:

1. **Brand block** — square icon-on-primary + short title + subtitle.
2. **Primary nav** — Dashboard / Alle Module / Meine Ergebnisse. Active row uses a white pill with a right-side `border-r-4 border-primary` accent and `shadow-sm`.
3. **Module list (`<ol class="sn-modlist">`)** — flat items + collapsible groups using native `<details>/<summary>`. Active row: `bg-primary/10 text-primary font-semibold`. Sub-items inside groups indent with `ml-6 border-l border-slate-200 pl-2`.
4. **Footer** — `<div class="flex-grow">` pushes a footer block (Klassenreport link) to the bottom.

**Container classes:**
```
aside class="bg-slate-50 h-[calc(100vh-4rem)] w-64 border-r border-slate-200
             sticky top-16 flex-shrink-0 hidden lg:flex flex-col overflow-y-auto"
```

**Grouping pattern.** Adjacent modules sharing a `groupSlug + groupTitle` collapse into one `<details>` block. Auto-opens when the active module is inside it. Chevron rotates via CSS:

```css
.sn-group > summary { list-style: none; }
.sn-group > summary::-webkit-details-marker { display: none; }
.sn-group[open] > summary .sn-chevron { transform: rotate(180deg); }
```

### 2.3 `MobileNav`

Three-item bottom bar — Home / Module / Ergebnisse — each as a column with a Material icon over a 10px label. Fixed to viewport:

```
md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200
z-50 px-6 h-16 flex items-center justify-between
```

Active state: just swap `text-slate-500` → `text-primary`.

### 2.4 `ProgressRail` (optional, module pages only)

Sticky horizontal strip below TopAppBar. Surfaces module-level progress meters. Hidden via the `hideRail` prop on pages where it's off-topic (e.g. `/klassenreport`).

### 2.5 `OnboardingTour`

Hidden until triggered by `document.dispatchEvent(new CustomEvent('hep:open-tour'))` from the help button. Uses `data-tour="<key>"` attributes scattered through the nav components to anchor each step. Replaceable with any tour lib.

---

## 3. Design tokens

### 3.1 Colors — Material Design 3

Every color is a CSS variable holding **space-separated RGB triples** (so Tailwind's `<alpha-value>` interpolation works):

```css
/* src/styles/global.css */
:root {
  --color-primary:                   2 67 123;     /* HEP blue #02437b */
  --color-on-primary:                255 255 255;
  --color-primary-container:         217 232 244;
  --color-on-primary-container:      8 42 76;
  --color-primary-fixed:             217 232 244;
  --color-primary-fixed-dim:         170 198 226;
  --color-on-primary-fixed:          8 42 76;
  --color-on-primary-fixed-variant:  2 67 123;
  --color-inverse-primary:           170 198 226;
  --color-surface-tint:              2 67 123;

  --color-secondary:                 90 95 101;
  --color-on-secondary:              255 255 255;
  --color-secondary-container:       222 227 235;
  --color-on-secondary-container:    49 56 64;
  /* …secondary-fixed / on-secondary-fixed variants… */

  --color-tertiary:                  29 105 64;    /* HEP green */
  --color-on-tertiary:               255 255 255;
  --color-tertiary-container:        205 234 215;
  --color-on-tertiary-container:     16 64 36;
  /* …tertiary-fixed variants… */

  --color-error:                     186 26 26;
  --color-on-error:                  255 255 255;
  --color-error-container:           255 218 214;
  --color-on-error-container:        147 0 10;

  --color-background:                250 251 253;
  --color-on-background:             24 28 34;
  --color-surface:                   250 251 253;
  --color-on-surface:                24 28 34;
  --color-surface-variant:           226 232 240;
  --color-on-surface-variant:        71 85 105;
  --color-surface-dim:               220 226 235;
  --color-surface-bright:            255 255 255;
  --color-surface-container-lowest:  255 255 255;
  --color-surface-container-low:     245 248 251;
  --color-surface-container:         239 243 248;
  --color-surface-container-high:    232 238 245;
  --color-surface-container-highest: 226 233 241;
  --color-inverse-surface:           45 55 72;
  --color-inverse-on-surface:        237 242 248;

  --color-outline:                   100 116 139;
  --color-outline-variant:           203 213 225;
}
```

**Tailwind binding** (so `bg-primary`, `text-on-surface`, etc. just work):

```js
// tailwind.config.js
colors: {
  'primary':              'rgb(var(--color-primary) / <alpha-value>)',
  'on-primary':           'rgb(var(--color-on-primary) / <alpha-value>)',
  'primary-container':    'rgb(var(--color-primary-container) / <alpha-value>)',
  // …repeat for every token above…
}
```

**Per-unit theme override.** The base palette is derived to harmonise with `#02437b`. To re-skin for a new unit, override `--color-primary` and `--color-on-primary` inline on `<html>` so it always beats `:root` regardless of stylesheet order:

```ts
// Run this at render time (server-side template, React/Vue/Svelte
// component, build-time HTML injection — any moment that yields the
// <html> tag). Output the resulting string as the `style` attribute
// on <html>.
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
}

function buildThemeStyle(theme: { primary: string; onPrimary: string; accent?: string }): string {
  const parts = [
    `--color-primary: ${hexToRgb(theme.primary)};`,
    `--color-on-primary: ${hexToRgb(theme.onPrimary)};`,
    theme.accent ? `--color-surface-tint: ${hexToRgb(theme.accent)};` : '',
  ].filter(Boolean);
  return `overflow-y: scroll; ${parts.join(' ')}`;
}

// Rendered output (whatever templating you use):
// <html class="light" lang="de" style="overflow-y: scroll; --color-primary: 2 67 123; --color-on-primary: 255 255 255;">
```

**Caveat.** Container/surface tokens were hand-tuned for the navy primary. A radically different hue (red, magenta) needs the containers re-derived — consider `color-mix()` in modern CSS, or just generate a fresh MD3 palette via the [Material Theme Builder](https://material-foundation.github.io/material-theme-builder/) and replace the CSS variables.

### 3.2 Spacing

Custom Tailwind tokens (every padding/gap in the layout uses these):

```js
spacing: {
  'xs':            '4px',
  'sm':            '8px',
  'md':            '16px',
  'lg':            '24px',
  'xl':            '40px',
  'xxl':           '64px',
  'unit':          '4px',     // base unit, for rare arithmetic
  'gutter':        '24px',
  'container-max': '1280px',
}
```

Layouts use `max-w-[1440px]` for the outer flex (TopAppBar + nav row), `max-w-[1280px]` for content containers inside `<main>`.

### 3.3 Typography

Single font family — **Inter** via Google Fonts, weights 400–900:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
```

Eight semantic sizes (each ships with its own line-height and weight, so you write `text-headline-md` and forget about the rest):

| Token         | Size | Line | Weight | Use                          |
|---------------|------|------|--------|------------------------------|
| `headline-xl` | 48px | 1.1  | 700    | Page heroes                  |
| `headline-lg` | 32px | 1.2  | 600    | Page titles                  |
| `headline-md` | 24px | 1.3  | 600    | Section titles               |
| `headline-sm` | 20px | 1.4  | 600    | Card titles, sub-sections    |
| `body-lg`     | 18px | 1.6  | 400    | Lead paragraphs              |
| `body-md`     | 16px | 1.6  | 400    | Default body                 |
| `body-sm`     | 14px | 1.5  | 400    | Captions, secondary text     |
| `label-md`    | 14px | 1    | 600    | Buttons, form labels         |
| `label-sm`    | 12px | 1    | 500    | Pills, small uppercase tags  |

Used both as `text-*` (size) and `font-*` (the same name binds to a font-family in `fontFamily`, which is currently all Inter — so `font-headline-md` is a no-op aliased for parallel naming).

### 3.4 Border radius

```js
borderRadius: {
  DEFAULT: '0.125rem',  // 2px
  lg:      '0.25rem',   // 4px
  xl:      '0.5rem',    // 8px
  full:    '0.75rem',   // 12px (used on cards)
}
```

Cards and primary surfaces are always `rounded-xl`. Buttons typically `rounded-lg`.

### 3.5 Icons

**Material Symbols Outlined** via Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
```

Default fill is outlined. To render filled, set inline:

```html
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">account_balance</span>
```

Common sizing classes: `text-sm` (14px), `text-base` (16px), `text-xl` (20px), `text-3xl` (30px). Use ad-hoc `text-[15px]` when needed inside nav rows.

---

## 4. Responsive breakpoints

Tailwind defaults are used unchanged:

| Breakpoint | Px      | Used for                                          |
|------------|---------|---------------------------------------------------|
| `md`       | ≥768px  | Show TopAppBar horizontal nav; hide MobileNav.    |
| `lg`       | ≥1024px | Show SideNav (`hidden lg:flex`).                  |

So three layout regimes:

- **<768px (mobile)**: TopAppBar (logo + tools only) → main → MobileNav fixed bottom.
- **768–1023px (tablet)**: TopAppBar (full nav) → main, no SideNav, no MobileNav.
- **≥1024px (desktop)**: TopAppBar → SideNav + main, no MobileNav.

Bottom-spacer div in `AppLayout` reserves room for the stacked mobile bars so content doesn't hide behind them. Conditional on whether the optional `ProgressRail` is visible:

```html
<!-- when ProgressRail is shown (module pages, etc.) -->
<div class="h-[7rem] md:h-14"></div>

<!-- when ProgressRail is hidden -->
<div class="h-16 md:hidden"></div>
```

---

## 5. Page inventory (what to build for an MVP)

Minimum set to match the student flow:

| Path                     | Layout         | Purpose                                                        |
|--------------------------|----------------|----------------------------------------------------------------|
| `/`                      | bare `Layout`  | Onboarding: new student → code generation → optional class code |
| `/dashboard`             | `AppLayout`    | Student hub: module list, progress bars, optional synthesis    |
| `/modules`               | `AppLayout`    | Full module listing with progress indicators                   |
| `/module/[slug]`         | `AppLayout`    | Module renderer. **Authoritative gate**: redirect to `/dashboard` if slug isn't in teacher's required list |
| `/results`               | `AppLayout`    | Per-module scores + PDF export link                            |
| `/teacher`               | bare `Layout`  | Teacher hub: chooser between "open existing class" and "register new class" |
| `/teacher-setup`         | bare `Layout`  | Pflichtmodule (required-modules) selection                     |
| `/klassenreport`         | `AppLayout` (`hideRail`) | Student-facing anonymized class aggregate           |
| `/anleitung-lehrperson`  | bare `Layout`  | Printable HTML teacher onboarding guide                        |

Optional pages used in the production unit but not strictly required: `/glossary`, `/notes`, `/export` (PDF report), `/feedback`.

---

## 6. CI / CD

GitHub Actions, two jobs. The full file lives at `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm install --no-audit --no-fund

      # Optional: any project-specific content validation
      # - name: Validate content
      #   run: npm run check

      - name: Type check
        run: npm run typecheck   # tsc --noEmit / framework-specific equivalent

      - name: Unit tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          # Placeholder values so the build succeeds without leaking real secrets.
          PUBLIC_FIREBASE_API_KEY: placeholder
          PUBLIC_FIREBASE_AUTH_DOMAIN: placeholder.firebaseapp.com
          PUBLIC_FIREBASE_PROJECT_ID: placeholder
          PUBLIC_FIREBASE_STORAGE_BUCKET: placeholder.appspot.com
          PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '000000000000'
          PUBLIC_FIREBASE_APP_ID: '1:000000000000:web:000000'
          PUBLIC_ABSTIMMUNG_ID: ci-build

  deploy:
    needs: ci
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm install --no-audit --no-fund

      - name: Build
        run: npm run build
        env:
          PUBLIC_FIREBASE_API_KEY:             ${{ secrets.PUBLIC_FIREBASE_API_KEY }}
          PUBLIC_FIREBASE_AUTH_DOMAIN:         ${{ secrets.PUBLIC_FIREBASE_AUTH_DOMAIN }}
          PUBLIC_FIREBASE_PROJECT_ID:          ${{ secrets.PUBLIC_FIREBASE_PROJECT_ID }}
          PUBLIC_FIREBASE_STORAGE_BUCKET:      ${{ secrets.PUBLIC_FIREBASE_STORAGE_BUCKET }}
          PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
          PUBLIC_FIREBASE_APP_ID:              ${{ secrets.PUBLIC_FIREBASE_APP_ID }}
          PUBLIC_ABSTIMMUNG_ID:                ${{ secrets.PUBLIC_ABSTIMMUNG_ID }}

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken:             ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_IPERKA_LMS }}
          channelId: live
          projectId: iperka-lms
```

**Two-job split rationale.** The `ci` job runs on every push *and* every PR with placeholder env vars — so PR forks can't extract real Firebase credentials. The `deploy` job only runs on `main` after `ci` passes, and only it has access to the real secrets.

**Required GitHub secrets for `deploy`:** all six `PUBLIC_FIREBASE_*`, `PUBLIC_ABSTIMMUNG_ID`, and `FIREBASE_SERVICE_ACCOUNT_<PROJECT>` (the service-account JSON content, obtained via the `FirebaseExtended/action-hosting-deploy` setup wizard or via Firebase Console → Project Settings → Service accounts).

**Firebase Hosting config** — `firebase.json` rewrites `/api/**` to a Cloud Function so the frontend can call a same-origin path:

```json
{
  "functions": { "source": "functions" },
  "firestore": { "rules": "firestore.rules" },
  "hosting": [{
    "target": "<your-target>",
    "public": "dist",
    "cleanUrls": true,
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "/api/**", "function": "api" }
    ]
  }]
}
```

The build output directory (`dist` above) depends on your framework — adjust accordingly.

**Functions are not deployed by CI.** They ship via manual `firebase deploy --only functions` (or via a separate workflow). The build job only ships hosting because functions deploys are infrequent and benefit from a human-in-the-loop.

---

## 7. Environment variables

Two files:

**`.env.local`** — client config (committed example: `.env.example`):
```
PUBLIC_FIREBASE_API_KEY=...
PUBLIC_FIREBASE_AUTH_DOMAIN=...
PUBLIC_FIREBASE_PROJECT_ID=...
PUBLIC_FIREBASE_STORAGE_BUCKET=...
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
PUBLIC_FIREBASE_APP_ID=...

# Identifies this deployment — namespaces all Firestore paths + the
# localStorage session key. Required.
PUBLIC_ABSTIMMUNG_ID=your-unit-id

# Optional for local dev without Firebase Hosting rewrites. The /api/**
# rewrite is a Firebase Hosting feature — dev servers don't proxy it,
# so /api/** calls 404 locally unless you point straight at the function.
PUBLIC_FUNCTIONS_API_BASE_URL=https://europe-west6-<project-id>.cloudfunctions.net/api

# Optional — App Check reCAPTCHA v3 site key. Empty = App Check off.
PUBLIC_RECAPTCHA_SITE_KEY=
```

`PUBLIC_` prefix means the value is inlined into the client bundle — Firebase config values are designed to be public, but never put a real secret behind a `PUBLIC_` prefix. The framework convention may differ (Next.js: `NEXT_PUBLIC_`, Vite: `VITE_`) — rename accordingly.

**`functions/.env`** — server config, gitignored:
```
# Toggle App Check enforcement on Cloud Functions. Default false.
APPCHECK_ENFORCE=false

# SHA-256 hash of the admin password for /admin/feedback.
# Generate: node -e "console.log(require('crypto').createHash('sha256').update('YOUR-PASSWORD').digest('hex'))"
ADMIN_PASSWORD_HASH=
```

---

## 8. Per-unit configuration

Centralise unit-specific data in one module. Every layout component reads from this object — change one value here, the whole UI follows.

```ts
// e.g. src/config/unit.ts
export interface ModuleRef {
  slug: string;
  title: string;
  estimatedMinutes: number;
  icon?: string;
  groupSlug?: string;
  groupTitle?: string;
  optional?: boolean;
}

export interface UnitConfig {
  id: string;              // PUBLIC_UNIT_ID — Firestore namespace + session key
  title: string;
  shortTitle: string;
  subtitle?: string;       // colloquial name, surfaces in SideNav + TopAppBar
  publishDate: string;     // ISO date
  description: string;
  hero: { image?: string; badge?: string; };
  theme: {
    primary: string;       // hex, e.g. '#02437b'
    onPrimary: string;
    accent?: string;
  };
  modules: ModuleRef[];
  features: {
    teacherSelectsModules: boolean;
    showSynthesisCard:     boolean;
    showMyNotes:           boolean;
    glossaryPage:          boolean;
  };
  codeAnimals?: string[];  // for memorable student-code generation
}

// Read the namespace ID from your framework's env mechanism — see top of doc.
const UNIT_ID: string = process.env.PUBLIC_UNIT_ID ?? 'dev';

export const unit: UnitConfig = {
  id: UNIT_ID,
  title: 'Full unit title',
  shortTitle: 'app brand',
  subtitle: 'optional secondary label',
  publishDate: '2026-06-14',
  description: '...',
  hero: { badge: 'Optional hero badge' },
  theme: { primary: '#02437b', onPrimary: '#ffffff' },
  modules: [
    { slug: 'module-1', title: 'Module 1', estimatedMinutes: 5, icon: 'how_to_vote', groupSlug: 'intro', groupTitle: 'Intro' },
    // …
  ],
  features: {
    teacherSelectsModules: true,
    showSynthesisCard:     true,
    showMyNotes:           true,
    glossaryPage:          true,
  },
};
```

---

## 9. Quick build checklist for a new project

1. **Scaffold** the framework of choice. Static-export-capable + can host a `<script>`-augmented page.
2. **Install Tailwind** with the config from §3. Drop in `global.css` with the CSS variables.
3. **Add Google Fonts links** for Inter and Material Symbols Outlined in the document `<head>`.
4. **Build the four layout components** (TopAppBar, SideNav, MobileNav, AppLayout). Copy class strings verbatim from the source repo — they're the load-bearing part of the visual identity.
5. **Wire the localStorage auth gate** in `AppLayout` (one inline script, redirect to `/` if no session).
6. **Create the unit config file** (§8) — every page reads from it.
7. **Stand up the Firebase project** and copy the data model + Cloud Functions code from `02-FIREBASE-ARCHITECTURE.md`.
8. **Build the onboarding flow at `/`** — steps 0 → 1 → 2 → 2a, switching visible `<div>` blocks via vanilla JS. See the data flow in [`02-FIREBASE-ARCHITECTURE.md`](02-FIREBASE-ARCHITECTURE.md) §6.1.
9. **Build the teacher hub at `/teacher`** — chooser → register-form / report-form → report view. Data flow in [`02-FIREBASE-ARCHITECTURE.md`](02-FIREBASE-ARCHITECTURE.md) §6.3–§6.4.
10. **Wire `firebase.json` and the GitHub Actions workflow.** Smoke-test the deploy with the placeholder env vars before adding real secrets.