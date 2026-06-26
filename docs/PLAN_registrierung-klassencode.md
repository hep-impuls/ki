# Plan: Registrierung + Klassencode für ki26 (10mio-Parität)

> **Stand 2026-06-26.** Deep-Dive in das 10mio-System + Umsetzungsplan, um in
> ki26 dieselbe Mechanik zu bauen: freie Registrierung → **Animal-Code**
> (`BÄR-334`), optionaler **Klassencode** → Beitritt zur Lehrer-Klasse, plus
> **Lehrer-Report mit Einzel-Schüler-Fortschritt** und Aggregat-Vergleich
> **Klasse vs. alle**.
>
> **Architektur-Entscheid (mit Pietro, 2026-06-26):** volle 10mio-Parität —
> Secret-geschützte Lehrer-Codes (single-owner), Pro-Schüler-Fortschritts-
> dokumente, Activity-Tracker wie 10mio. Das löst ki26 bewusst von der reinen
> «nur anonyme Aggregate»-Linie ab (siehe `docs/decisions.md`, 2026-06-20/24).
> **Wichtig:** ki26 läuft auf **Next.js/Vercel**, nicht Astro — das Backend wird
> als **Next.js Route Handlers + Firebase Admin SDK** gebaut, nicht als Cloud
> Function (Begründung in §3.2).

---

## Teil 1 — Wie 10mio es macht (Deep-Dive)

### 1.1 Schüler-Registrierung & Animal-Code

**Code-Erzeugung** (`src/lib/session.ts`): Format `ANIMAL-NNN`, z.B. `BÄR-334`.

```ts
const ANIMALS = abstimmung.codeAnimals ?? [
  'BÄR','WOLF','FUCHS','LUCHS','GAMS','RABE','HASE','ELCH','DACHS',
  'IGEL','OTTER','ADLER','GEIER','STORCH','UHU','BIBER','HIRSCH','FALKE',
];
export function generateCode(): string {
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = String(Math.floor(Math.random() * 900) + 100);  // 100–999
  return `${animal}-${num}`;
}
```

- **Kein Kollisions-Check.** Raum ≈ 18 Tiere × 900 Zahlen = 16 200 Codes. Für
  Klassengrössen ausreichend; bei Bedarf grösserer Tier-Pool.
- **Session** liegt rein im Browser, namespaced pro Abstimmung:

```ts
export interface Session { studentCode: string; teacherCode: string | null; }
const KEY = `hep-impuls-${abstimmung.id}`;
getSession() / saveSession(s) / clearSession()  // localStorage-CRUD
```

- Eine **zweite, parallele Session** (`hep-auswertung-${id}`) existiert für die
  Post-Abstimmungs-Aufgabe, damit die LMS-Session intakt bleibt. (Für ki26
  vorerst nicht relevant.)

### 1.2 Lehrer-Klassencode: Erstellung & Single-Owner-Modell

Eine Klasse **existiert erst**, wenn eine Lehrperson ihren Code beansprucht. Das
geschieht serverseitig (Cloud Function) mit einem **Secret**:

```js
// functions/index.js → handleTeacherSetup
const ref = getNamespace(abstimmungId).collection('teachers').doc(classCode);
const existing = await ref.get();
const incomingHash = hashSecret(secret);          // SHA-256(secret.trim())
if (existing.exists) {
  const storedHash = existing.data()?.secretHash;
  if (storedHash && storedHash !== incomingHash)
    return json(res, 403, { error: 'Secret is not correct' });  // single-owner
}
await ref.set({ requiredModules, updatedAt: ..., secretHash: incomingHash },
              { merge: true });
```

- **First-claim-wins.** Erster Setup-Call hasht das Secret und legt das Doc an.
- **Jeder spätere Call** muss exakt dasselbe Secret-Hash liefern, sonst **403**.
- **`secretHash` = SHA-256** des getrimmten Secrets (client *und* server, gleiche
  Funktion). Das Klartext-Secret wird **nie** gespeichert → nur die Lehrperson
  kennt es; bei Verlust nicht wiederherstellbar (darum Backup-Datei, §1.4).
- **Race-Window** (jemand beansprucht denselben Code in der Zwischenzeit) ist nur
  per UX entschärft (Hinweis «sofort beanspruchen», distinktive Codes wie
  `PiRo-FS-A26`). Keine Reservierungs-API.

Typ:

```ts
interface TeacherPrefs { requiredModules: string[]; updatedAt: string; secretHash?: string; }
```

### 1.3 Pre-Code / Post-Code Schüler-Einstieg

Onboarding in `src/pages/index.astro` als State-Machine:

1. **Schritt 0** — «Neu starten» vs. «Ich habe bereits einen Code».
2. **Schritt 1** — generierter Code wird angezeigt + «Code kopieren».
3. **Schritt 2** — «Hat dir deine Lehrperson einen Klassencode gegeben?»
   - *Nein* → `ensureStudent(studentCode, null)` + Session speichern → Dashboard.
   - *Ja* → Schritt 2a.
4. **Schritt 2a (Pre-Validierung des Codes):**

```ts
const tc = input.value.trim().toUpperCase();
const ok = await classExists(tc);                 // API-Call (Cloud Function)
if (!ok) { /* «Code nicht gefunden — frag deine Lehrperson» */ return; }
await ensureStudent(studentCode, tc);             // verknüpft Schüler ↔ Klasse
saveSession({ studentCode, teacherCode: tc });
window.location.href = '/dashboard';
```

5. **Returning student** — gibt seinen Code ein → `loadStudent(code)` liest das
   Doc, stellt `teacherCode` + Session wieder her.

`ensureStudent` überschreibt eine bereits gesetzte Klasse **nicht**:

```ts
export async function ensureStudent(studentCode, teacherCode) {
  const ref = studentDoc(studentCode);
  const snap = await getDoc(ref);
  if (!snap.exists()) { await setDoc(ref, { teacherCode, createdAt: serverTimestamp() }); return; }
  if (teacherCode && !snap.data().teacherCode)   // nur nachträglich anhängen
    await setDoc(ref, { teacherCode }, { merge: true });
}
```

### 1.4 Lehrer-Seiten (Registrieren, Setup, Report)

**`/teacher` (Hub)** — Chooser zwischen *Bestehende Klasse → Report öffnen* und
*Neue Klasse anlegen → Code beanspruchen*.

*Registrieren* (`registerClass`):
1. Code (eindeutig) + Secret (≥ 4 Zeichen) eingeben.
2. Pre-flight `classExists(code)` → Fehler «bereits vergeben», falls belegt.
3. `saveTeacherSetupSecure(code, secret, [])` legt die Klasse an.
4. Optional **Backup-Datei** `klassencode-XYZ.txt` (Code + Secret + URL im
   Klartext) zum Download — einzige Möglichkeit, das Secret zu sichern.

*Report öffnen* (`/teacher` Report-Form + `loadTeacherReportSecure`): Code +
Secret → serverseitig verifiziert → Report inkl. Poll-Aggregaten.

**`/teacher-setup`** — Pflichtmodul-Auswahl: lädt aktuelle `requiredModules` via
`loadTeacherPrefsSecure`, speichert via `saveTeacherSetupSecure`. Abgewählte
Module verschwinden danach **vollständig** aus der Schüleransicht (autoritatives
Gate in `module/[slug].astro`, plus client-seitiges Ausblenden in Nav/Listen).

**`/klassenreport` (Schüler-facing, anonymisiert)** — Histogramm der Klassen-
%-Verteilung mit eigenem Quartil markiert + pro Modul Klassen-Ø vs. eigenes Ø.
Backed by `student/class-report`, das **nie** Schüler-Codes zurückgibt (sortierte
Verteilungs-Arrays statt Identität).

### 1.5 Firestore-Datenmodell & Pfade

```
abstimmungen/{id}/
  students/{studentCode}/            teacherCode, createdAt
    progress/{moduleId}              pct, quizScore, completedAt, correctnessPct,
                                     interactionPct, blocks:{ [blockId]: {type,
                                     answer, completed, ...} }
    notes/{moduleId}                 { [blockId]: { text, updatedAt } }
    synthesis/current                text, updatedAt
  teachers/{classCode}               requiredModules[], updatedAt, secretHash
  polls/{pollKey}                    counts: { [optionId]: n }     ← globale Aggregate
  clusterAggregates/{blockId}        counts: {...}
  feedback/{auto-id}                 create-only
  engagement/{auto-id}               type, studentCode, slug, createdAt  (create-only)
```

Pfad-Generatoren in `src/lib/paths.ts` (`studentDoc`, `progressDoc`, `notesDoc`,
`teacherDoc`, `pollDoc`, `engagementCollection`, …).

### 1.6 Security Rules

```
match /abstimmungen/{id}/students/{code} {
  allow read, write: if true;        // Anonymität über Code-Obscurity, kein Auth
  match /progress/{m}  { allow read, write: if true; }
  match /notes/{m}     { allow read, write: if true; }
  match /synthesis/{d} { allow read, write: if true; }
}
match /abstimmungen/{id}/teachers/{code} { allow read, write: if false; }  // nur Admin-SDK
match /abstimmungen/{id}/polls/{p}       { allow read, write: if true; }
match /abstimmungen/{id}/engagement/{e}  { allow create: if <shape-check>; allow read,update,delete: if false; }
```

- Schüler-/Poll-Daten: **offen** (kein Login; der Code ist das «Geheimnis»).
- **`teachers/*` ist für den Browser komplett gesperrt** — jeder Lehrer-Zugriff
  läuft über die Cloud Function (Admin SDK umgeht Rules). Das ist das zentrale
  Sicherheits-Gate für das Secret.

### 1.7 Cloud-Functions-Architektur

Eine einzige `onRequest`-Function (`exports.api`), Region **`europe-west6`**,
CORS an, App Check optional (`APPCHECK_ENFORCE`):

| Pfad | Zweck |
|---|---|
| `teacher/setup` | Klasse anlegen/aktualisieren (single-owner-Secret-Check) |
| `teacher/prefs` | `requiredModules` lesen (secret-gated) |
| `teacher/report` | Lehrer-Report: alle Schüler der Klasse + Poll-Aggregate; `revealCodes` nur bei korrektem Secret |
| `student/class-prefs` | Pflichtmodule für einen Schüler (greyt Module aus) |
| `student/class-report` | Anonymisiertes Klassen-Aggregat für `/klassenreport` |
| `student/class-exists` | Existenz-Check des Klassencodes (Onboarding) |
| `admin/feedback` | Feedback-Dump (passwortgehasht) |

Client-Wrapper `src/lib/api.ts`:

```ts
async function postApi<T>(path, payload) {
  const base = import.meta.env.PUBLIC_FUNCTIONS_API_BASE_URL?.replace(/\/+$/, '');
  const url = base ? `${base}/${path}` : `/api/${path}`;
  const headers = { 'content-type': 'application/json' };
  const t = await getAppCheckHeaderValue(); if (t) headers['X-Firebase-AppCheck'] = t;
  const res = await fetch(url, { method:'POST', headers,
    body: JSON.stringify({ abstimmungId: abstimmung.id, ...payload }) });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `API error (${res.status})`);
  return data as T;
}
```

### 1.8 Poll-Aggregation: Klasse vs. alle

Zwei verschiedene Quellen, serverseitig zusammengeführt:

- **Global** — Schüler schreibt direkt nach `polls/{pollKey}` (transaktionaler
  `increment`); `loadGlobalPollCounts` liest die Doc-Sammlung.
- **Klasse** — die Function `loadClassReport` queryt `students where teacherCode == classCode`,
  iteriert deren `progress/{m}.blocks[blockId]` und zählt jede `entry.type==='poll' && completed`
  Antwort: `classPollCounts[blockId][answer]++`.

Im Lehrer-Report werden beide als **zwei gestapelte Balken pro Option** gerendert
(Klasse = primary/blau, alle = tertiary/orange) mit Prozent + Rohzahl. Der
Schüler-`/klassenreport` rechnet zusätzlich `you` vs. `classAggregate.avgPct` +
eine **sortierte Verteilung** (Quartile) — ohne je Codes zu nennen. Klassen mit
`n < 5` werden im Post-Freeze (`scripts/freeze-analysis.mjs`) verworfen
(k-Anonymität).

### 1.9 Activity-Tracker (Engagement-Events)

`src/lib/engagement.ts`, verdrahtet in `module/[slug].astro`, schreibt
**create-only** nach `abstimmungen/{id}/engagement/{eventId}`:

- `module_view` `{studentCode, slug}` beim Laden,
- `module_close` `{studentCode, slug, sessionMs}` bei `visibilitychange`/`pagehide`
  (Sessions < 1 s verworfen),
- `block_view` `{studentCode, slug, blockId}` via IntersectionObserver, einmal je
  Block je Seitenaufruf.

Block-*Completion* wird **nicht** als Event dupliziert (steht in
`progress.blocks[id].completed`). Drei Owner-only-Dashboards
(`npm run engagement|polls|progress`) lesen via Admin-SDK und rendern HTML.

---

## Teil 2 — ki26 heute & die Lücke

| Bereich | 10mio | ki26 heute |
|---|---|---|
| Schüler-Identität | Animal-Code + Session | **keine** — vollständig anonym |
| Pro-Schüler-Daten | `students/{code}/progress/...` | **keine** — alles in localStorage (`stationStore`, `fortschritt`) |
| Klasse | `teacherCode` im Schüler-Doc, server-gequeried | **freier String** aus `?klasse=` / localStorage (`resolveKlasse`) |
| Lehrer-Code besitzen | Secret + single-owner (Cloud Function) | **nicht vorhanden** — jeder Code funktioniert |
| Klasse vs. alle | server-aggregiert aus Schüler-Docs | **schon vorhanden** via namespaced Counter `kp-{klasse}-{id}` vs `p-{id}` |
| Backend | Cloud Functions (`europe-west6`) | **keines** (bewusst) |
| Activity-Tracker | Engagement-Events namespaced | `src/lib/activity.ts` → top-level `activities` mit anon-Auth-`uid` |
| Rules | im 10mio-Repo verwaltet | **dieselben live Rules** (geteiltes `iperka-lms`) — ki26 darf **nie** deployen |

**Was schon da ist und bleibt:** der Klasse-vs-alle-Vergleich über namespaced
Poll-Counter (`unitPolls.ts` → `castPollVote`, `KollektivSpiegel`,
`KlassenSpiegel`, `PollAuswertung`, `Verteilung`). Den braucht der neue Flow
nicht zu ersetzen — er wird nur an einen **echten Klassencode** statt an einen
freien String gekoppelt.

**Was neu gebaut wird:** Animal-Code + Session-Layer, Pro-Schüler-Fortschritts-
Docs, Secret-geschützte Lehrer-Codes mit Backend, Onboarding-Flow, Lehrer-Seiten
(Registrieren/Setup/Report), Engagement-Tracker-Umbau, ki26-Pfade.

---

## Teil 3 — Umsetzungsplan ki26

### 3.1 Leit-Entscheidungen

1. **Volle Parität, Next.js-nativ.** Gleiche Funktionen wie 10mio, aber idiomatic
   für Next.js/Vercel statt Astro/Cloud-Functions.
2. **Namespace bleibt `abstimmungen/ki26/…`** (via `NEXT_PUBLIC_UNIT_ID`). Kein
   Kollisionsrisiko mit `10mio-2026`.
3. **Bestehender Spiegel wird wiederverwendet**, nur an den echten Code gekoppelt
   (`resolveKlasse()` liest künftig aus der Session statt nur URL/localStorage).

### 3.2 Backend: Next.js Route Handlers + Admin SDK (statt Cloud Function)

ki26 darf **keine** Cloud Function oder Rules ins geteilte `iperka-lms`-Projekt
deployen (CLAUDE.md: «Aus ki26 niemals `firebase deploy`»). 10mios Functions
leben im 10mio-Repo. Darum baut ki26 den Lehrer-Tier als **Next.js Route
Handlers** unter `src/app/api/**` mit dem **Firebase Admin SDK** server-seitig
(= Option C aus ki26s «Open questions»). Vorteile:

- Läuft als Vercel Serverless Function, im selben Repo/Deploy — kein zweites
  Backend, kein Cross-Origin-Hop.
- **Admin SDK umgeht Firestore-Rules** → der `teachers/*`-Zugriff funktioniert,
  **ohne** dass die geteilten Rules angefasst werden müssen.
- Secret-Logik (SHA-256, single-owner) bleibt rein server-seitig.

**Nötig:** ein Service-Account-Key als Vercel-Env-Var (z.B.
`FIREBASE_SERVICE_ACCOUNT` JSON), `firebase-admin` als Dependency, ein
`src/lib/firebaseAdmin.ts` (Singleton). Lokal: `.env.local` mit demselben Key.

Endpunkte (1:1 zu 10mio, als `route.ts` `POST`-Handler):

```
src/app/api/teacher/setup/route.ts        → claim/update Klasse (single-owner)
src/app/api/teacher/prefs/route.ts         → requiredModules lesen (secret-gated)
src/app/api/teacher/report/route.ts        → Einzel-Schüler-Report + Poll-Aggregate
src/app/api/student/class-exists/route.ts  → Existenz-Check (Onboarding)
src/app/api/student/class-prefs/route.ts   → Pflichtmodule eines Schülers
src/app/api/student/class-report/route.ts  → anonymes Klassen-Aggregat (Schüler)
```

### 3.3 Rules-Realität (Blocker prüfen)

- **Schüler-Tier braucht keine Rules-Änderung:** Die live Rules erlauben bereits
  `abstimmungen/{id}/students/*` (read/write `if true`) und `polls` — die
  Pro-Schüler-Docs schreibt der Browser direkt, genau wie 10mio.
- **Lehrer-Tier braucht keine Rules-Änderung**, weil das Admin SDK die Rules
  umgeht. Selbst wenn `teachers/*` im Browser default-denied ist, kann der Route
  Handler lesen/schreiben.
- **Einzig zu verifizieren** (Pietro, Firebase-Console): dass die live Rules
  `students/{code}/progress|notes|synthesis` ebenso freigeben wie bei 10mio (laut
  CLAUDE.md decken sie `students/*` ab — Subcollections im Detail prüfen). Falls
  eine Subcollection nicht gedeckt ist → **koordiniert über das 10mio-Repo**
  ergänzen, nicht aus ki26 deployen.

### 3.4 Neue Dateien (lib-Schicht, `src/lib/`)

> Diese Dateien sind **gemeinsame Infrastruktur** (nicht unter `lernseite-1/**`).
> Owner-Mapping beachten → **mit Christof absprechen**, bevor `src/lib/*` neu
> angelegt/geändert wird (CLAUDE.md «gemeinsam»).

| Datei | Inhalt (Vorbild 10mio) |
|---|---|
| `src/lib/session.ts` | `generateCode()` (Tier-Pool), `Session {studentCode, teacherCode}`, `getSession/saveSession/clearSession`, Key `ki26-session` |
| `src/lib/paths.ts` | Pfad-Generatoren unter `abstimmungen/ki26/…` (students, progress, notes, teachers, polls, engagement) |
| `src/lib/types.ts` | `Student`, `Progress`, `TeacherPrefs`, Report-Typen |
| `src/lib/db.ts` | `ensureStudent`, `loadStudent`, `linkTeacherCode`, `saveProgress/loadAllProgress`, `hashSecret` (Web Crypto SHA-256) — Client-SDK |
| `src/lib/api.ts` | `postApi`-Wrapper → `/api/...`; `classExists`, `loadStudentClassPrefs`, `loadStudentClassReport`, `loadTeacherPrefsSecure`, `saveTeacherSetupSecure`, `loadTeacherReportSecure` |
| `src/lib/firebaseAdmin.ts` | Admin-SDK-Singleton (server-only, Service-Account aus Env) |
| `src/lib/engagement.ts` | `module_view/close/block_view` → `abstimmungen/ki26/engagement` (create-only) |

`src/lib/polls.ts` bleibt unverändert (globale Counter); `castVote` ist schon da.

### 3.5 Onboarding-Flow (Schüler)

Neue Route **`src/app/start/page.tsx`** (Client-Component) — *nicht* die geteilte
Titelseite `page.tsx` anfassen. State-Machine analog `index.astro`:

1. Neu vs. «habe Code».
2. Code generieren + anzeigen + kopieren.
3. Klassencode? Nein → `ensureStudent(code, null)`. Ja → 3a.
4. 3a: `classExists(tc)` → bei Erfolg `ensureStudent(code, tc)` + Session, sonst
   freundlicher Fehler «Code nicht gefunden — frag deine Lehrperson».
5. Returning: `loadStudent(code)` → Session wiederherstellen.

**Gate:** `AppLayout`/`KiEinheit` prüfen künftig `getSession()` und leiten ohne
Session nach `/start` um (wie 10mios `AppLayout` ohne Session → `/`).

### 3.6 Lehrer-Seiten

| Route (neu) | Vorbild | Inhalt |
|---|---|---|
| `src/app/lehrperson/page.tsx` | `teacher.astro` | Chooser: Report öffnen vs. Klasse anlegen; Registrier-Form (Code + Secret ≥ 4) mit `classExists`-Pre-flight + Backup-`.txt`-Download |
| `src/app/lehrperson/setup/page.tsx` | `teacher-setup.astro` | Pflichtmodul-Auswahl (`loadTeacherPrefsSecure`/`saveTeacherSetupSecure`) |
| `src/app/lehrperson/report/page.tsx` | `teacher.astro`-Report | **Einzel-Schüler-Tabelle** (Code, Fortschritt je Modul, Quiz-Punkte) + Poll-Aggregate Klasse vs. alle |
| `src/app/klassenreport/page.tsx` | `klassenreport.astro` | Schüler-facing anonymisiert (Histogramm/Quartil) — optional, da Spiegel das teils abdeckt |

### 3.7 Pro-Schüler-Fortschritt verdrahten

Heute lebt der Fortschritt lokal (`stationStore` mit Präfix `ki26-v3-`,
`fortschritt.ts`). Für den Lehrer-Report muss er **zusätzlich** als
`progress/{moduleId}`-Doc gespiegelt werden:

- Beim Stations-Abschluss / Quiz-Score / Poll-Antwort: zusätzlich
  `saveProgress(studentCode, 'lernseite-1', { pct, quizScore, completedAt,
  blocks: {...} })` aufrufen (analog 10mio `blocks[blockId] = {type, answer,
  completed}`).
- **Schreibweg:** Browser → Firestore direkt (Rules erlauben `students/*`).
- localStorage bleibt die UX-Quelle; Firestore ist der Report-Spiegel. Konflikt-
  arm, weil ein Schüler i.d.R. ein Gerät nutzt.
- **Poll-Aggregation Klasse vs. alle** kann jetzt **zwei** Wege gehen:
  (a) bestehender namespaced Counter (sofort, kein Server) **oder** (b) 10mio-Weg
  (Report-Function zählt aus `progress.blocks`). Empfehlung: **(a) behalten** für
  den Live-Spiegel; **(b)** zusätzlich im Lehrer-Report, weil der ohnehin alle
  Schüler-Docs liest. So bleibt der Schüler-Spiegel server-frei.

### 3.8 Activity-Tracker angleichen

`src/lib/activity.ts` (top-level `activities` + anon-Auth-`uid`) auf das
10mio-Modell umstellen: `engagement`-Events namespaced unter
`abstimmungen/ki26/engagement`, mit `studentCode` statt anon-`uid`. `ActivityTracker.tsx`
entsprechend anpassen (in jeder Page weiterhin gemäss Hausregel §2 eingebettet).
**Achtung:** `ActivityTracker.tsx` ist geteilt (auch in Christofs lernseite-2) →
Umbau koordinieren (offener Entscheid aus QA_v3 §3).

### 3.9 Reihenfolge / Milestones

1. **R0 — Infra:** `firebaseAdmin.ts`, Service-Account-Env in Vercel, `hashSecret`.
   Rules-Realität (§3.3) mit Pietro verifizieren.
2. **R1 — Session & Code:** `session.ts`, `paths.ts`, `types.ts`, `db.ts`
   (`ensureStudent`/`loadStudent`). Unit-Tests für `generateCode`/Session.
3. **R2 — Onboarding:** `/start`-Flow + Session-Gate in `AppLayout`.
4. **R3 — Lehrer-Backend:** Route Handlers `teacher/setup|prefs|report`,
   `student/class-exists|class-prefs`. `api.ts`-Wrapper.
5. **R4 — Lehrer-Seiten:** `/lehrperson`, `/lehrperson/setup`, `/lehrperson/report`
   (Einzel-Schüler-Tabelle + Poll-Aggregate).
6. **R5 — Fortschritts-Spiegel:** `saveProgress`-Aufrufe in `stationStore`-Hooks.
7. **R6 — Engagement-Tracker** angleichen (koordiniert wegen geteilter Datei).
8. **R7 — Verifikation:** lokal `npm run build` + Firestore-Sichtprüfung (Pietro,
   Windows — Sandbox kann nicht zu Firestore). Onboarding→Klasse→Report
   end-to-end mit zwei Browsern testen.

### 3.10 Risiken & offene Punkte

- **Geteilte Dateien** (`src/lib/*` neu, `ActivityTracker.tsx`, evtl. `AppLayout`,
  `firestore.rules`): Owner = «gemeinsam» → Absprache mit Christof zwingend.
- **Datenschutz-Kurswechsel:** ki26 speichert neu identifizierbare Pro-Schüler-
  Daten (Code → Fortschritt). Entscheid in `docs/decisions.md` festhalten und das
  «nur anonyme Aggregate»-Statement (2026-06-20/24) explizit revidieren. Hinweis-
  text für Lernende erwägen.
- **Service-Account in Vercel:** Secret sicher als Env-Var; nie ins Repo.
- **Rules nicht aus ki26 deployen** — falls Subcollection-Freigabe fehlt, über
  10mio-Repo koordinieren.
- **Code-Kollision** bei grossen Kohorten: optional `ensureStudent` mit
  Existenz-Check + Re-Roll härten.
- **Sandbox-Build unzuverlässig** (OneDrive-Dehydrierung, mehrfach dokumentiert)
  → Build/Lint/Firestore-Test laufen bei Pietro auf Windows.

---

## Anhang — 10mio → ki26 Datei-Mapping

| 10mio (Astro) | ki26 (Next.js) |
|---|---|
| `src/lib/session.ts` | `src/lib/session.ts` |
| `src/lib/db.ts` | `src/lib/db.ts` |
| `src/lib/api.ts` | `src/lib/api.ts` |
| `src/lib/paths.ts` | `src/lib/paths.ts` |
| `src/lib/types.ts` | `src/lib/types.ts` |
| `functions/index.js` (Cloud Function) | `src/app/api/**/route.ts` + `src/lib/firebaseAdmin.ts` |
| `src/pages/index.astro` (Onboarding) | `src/app/start/page.tsx` |
| `src/pages/teacher.astro` | `src/app/lehrperson/page.tsx` |
| `src/pages/teacher-setup.astro` | `src/app/lehrperson/setup/page.tsx` |
| `src/pages/klassenreport.astro` | `src/app/lehrperson/report/page.tsx` (+ optional `src/app/klassenreport/page.tsx`) |
| `src/lib/engagement.ts` | `src/lib/engagement.ts` (+ `ActivityTracker.tsx`-Umbau) |
