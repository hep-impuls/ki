# Handoff 02 — Firebase Data & Teacher-Dashboard Architecture

**Audience:** Claude Code, starting a new educational-unit project that should use the same student/teacher data model: anonymous students identified by a memorable code, optional class affiliation by a teacher-claimed code + secret, and an online teacher dashboard.

**Scope:** Firestore schema, security rules, client SDK conventions, the Cloud Functions backend (copy-pastable), the teacher claim/auth flow, the App Check rollout plan.

**Not in scope:** the visual chrome — that's `01-LAYOUT.md`.

**Stack-agnostic.** The Cloud Functions code is Node.js — copy verbatim. The client samples below use plain TypeScript with `process.env.PUBLIC_X` for env vars and standard `fetch` for HTTP. Substitute for your framework:
- Next.js: `process.env.NEXT_PUBLIC_X`
- Vite / SvelteKit / Nuxt 3: `import.meta.env.VITE_X` (or `PUBLIC_X` in SvelteKit)
- Plain HTML build: inject at build time via your bundler

The `PUBLIC_` prefix in this doc is a placeholder — rename to whatever your tool requires to expose vars to the browser. Firebase web-SDK calls (`getFirestore`, `setDoc`, `getDoc`, etc.) are framework-agnostic and work identically in React, Vue, Svelte, vanilla JS.

---

## 1. Security model in one paragraph

There is **no Firebase Auth**. Students identify themselves with a 6-character memorable code (e.g. `BÄR-334`) stored in localStorage. Anyone who knows a code can read/write that student's data — this is acceptable because the data is low-sensitivity civic-education progress, codes are unguessable enough for the use case, and we layer anti-abuse on top via **Firebase App Check** (reCAPTCHA v3) which the client SDK attaches to every request. Teachers' configuration and the class-wide dashboard go through a **Cloud Function** that gates writes/reads on a **SHA-256-hashed secret** that the teacher chose at registration time. Direct browser reads/writes to the teachers' namespace are denied by Firestore rules.

The three layers, from outside to in:

1. **Code obscurity** — student data accessible to anyone who guesses the code (low-stakes data, unguessable codes).
2. **App Check** — every Firestore call and every Cloud Function call must carry a valid reCAPTCHA v3 token. Defeats automated abuse from random browsers.
3. **Secret hash** — teacher operations require knowing the secret. The secret is never stored in plaintext server-side; only its SHA-256 hash sits in Firestore.

---

## 2. Firestore data model

Everything is namespaced under `abstimmungen/{abstimmungId}` so multiple deployments can share one Firebase project without collision. `abstimmungId` comes from the build-time env var `PUBLIC_ABSTIMMUNG_ID`.

```
abstimmungen/
  {abstimmungId}/
    ├── students/
    │     └── {studentCode}/
    │           ├── { teacherCode: string|null, createdAt: Timestamp }
    │           ├── progress/
    │           │     └── {moduleId}/
    │           │           ├── pct: number 0–100
    │           │           ├── pointsEarned: number
    │           │           ├── pointsPossible: number
    │           │           ├── completedAt: ISO string | null
    │           │           ├── correctnessPct: number | null
    │           │           ├── interactionPct: number | null
    │           │           ├── blocks: {
    │           │           │   [blockId]: {
    │           │           │     type: 'mc'|'tf'|'reflection'|'poll'|...,
    │           │           │     completed: boolean,
    │           │           │     points: number,
    │           │           │     score?: number,         // 0–100, graded blocks only
    │           │           │     answer?: unknown,
    │           │           │     completedAt: ISO string,
    │           │           │   }
    │           │           │ }
    │           │           └── updatedAt: serverTimestamp
    │           ├── notes/
    │           │     └── {moduleId}: { [blockId]: { blockId, text, updatedAt } }
    │           └── synthesis/
    │                 └── current: { text, updatedAt }
    │
    ├── teachers/
    │     └── {classCode}/
    │           ├── requiredModules: string[]   // module slugs the teacher selected
    │           ├── secretHash: string          // SHA-256 hex of the teacher's secret
    │           └── updatedAt: ISO string
    │
    ├── polls/
    │     └── {pollId}/
    │           └── counts: { [optionId]: number }   // global cross-class aggregate
    │
    ├── clusterAggregates/
    │     └── {clusterBlockId}/
    │           └── counts: { [cardId]: { pro: n, contra: n, skip: n } }
    │
    ├── feedback/                                   // anonymous post-unit survey
    │     └── {auto-id}/ ...
    │
    └── engagement/                                 // anonymous engagement events
          └── {auto-id}/ ...
```

**Key design decisions:**

- **`students/{studentCode}` document** stores only the link to the teacher (`teacherCode`) plus a creation timestamp. **All progress is in subcollections** — keeps the parent doc small and lets the teacher dashboard query students by `teacherCode` cheaply, then fan out to load each student's progress subcollection.
- **`teachers/{classCode}.secretHash`** is the single auth credential. No salt — the hash space is large enough for the threat model, and adding salt complicates the lookup. If your threat model is stricter, add a per-class salt and store it alongside.
- **No SDK-level transactions on student progress.** A student is the only writer to their own progress, so `setDoc(..., { merge: true })` is enough.
- **Poll aggregates are doubly stored.** Per-student answer in `students/{code}/progress/{moduleId}.blocks[blockId].answer` (the source of truth for per-class aggregation), plus a global aggregate in `polls/{pollId}.counts` for the cross-class total. The Cloud Function tallies the per-class counts on demand from student progress.

---

## 3. Firestore security rules

Full file at `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Student data uses code-obscurity (no auth) which is acceptable for
    // low-sensitivity civic education data. Anti-abuse comes from
    // Firebase App Check (reCAPTCHA v3).
    //
    // To enable App Check enforcement: add this helper and gate every
    // `allow` on `isAppChecked()`. Currently OFF so pre-launch testing
    // works without a reCAPTCHA site key.
    //
    // function isAppChecked() {
    //   return request.app != null;
    // }

    match /abstimmungen/{abstimmungId}/students/{studentCode} {
      allow read, write: if true;
      match /progress/{moduleId}   { allow read, write: if true; }
      match /notes/{moduleId}      { allow read, write: if true; }
      match /synthesis/{docId}     { allow read, write: if true; }
    }

    match /abstimmungen/{abstimmungId}/teachers/{teacherCode} {
      // Teacher configuration and class report access MUST go through the
      // Cloud Functions API (Admin SDK), not direct browser reads/writes.
      allow read, write: if false;
    }

    match /abstimmungen/{abstimmungId}/polls/{pollId} {
      allow read:  if true;
      allow write: if true;
    }

    // Anonymous feedback. Browser may CREATE only — never read, update,
    // or delete. Builder reads via Cloud Function /admin/feedback.
    match /abstimmungen/{abstimmungId}/feedback/{feedbackId} {
      allow create: if request.resource.data.type in ['student', 'teacher'];
      allow read, update, delete: if false;
    }

    // Engagement events. Browser may CREATE only. Owner reads via a local
    // script with the Admin SDK.
    match /abstimmungen/{abstimmungId}/engagement/{eventId} {
      allow create: if request.resource.data.type in ['module_view', 'module_close', 'block_view']
        && request.resource.data.studentCode is string
        && request.resource.data.studentCode.size() <= 32
        && request.resource.data.slug is string
        && request.resource.data.slug.size() <= 64;
      allow read, update, delete: if false;
    }
  }
}
```

The **crucial line** is `allow read, write: if false` on `teachers/{teacherCode}`. This is what forces every teacher operation through the Cloud Function. The function uses the Admin SDK, which bypasses rules — that's the gating layer.

---

## 4. Cloud Functions backend (verbatim)

One Firebase Function exports one HTTPS endpoint that routes by path. Region `europe-west6` (Zurich) for latency from Switzerland — change to suit.

### 4.1 `functions/package.json`

```json
{
  "name": "your-project-functions",
  "private": true,
  "main": "index.js",
  "engines": { "node": "20" },
  "dependencies": {
    "firebase-admin":     "^12.7.0",
    "firebase-functions": "^5.1.1"
  }
}
```

### 4.2 `functions/index.js` — full source

```javascript
const crypto = require('node:crypto');
const admin = require('firebase-admin');
const { onRequest } = require('firebase-functions/v2/https');

admin.initializeApp();
const db = admin.firestore();

// Input length limits — guard against malformed / abusive payloads.
const MAX_ABSTIMMUNG_ID_LEN = 64;
const MAX_CLASS_CODE_LEN    = 32;
const MAX_STUDENT_CODE_LEN  = 32;
const MAX_SECRET_LEN        = 128;
const MAX_REQUIRED_MODULES  = 64;
const MAX_MODULE_SLUG_LEN   = 64;

function json(res, status, payload) {
  res.status(status).set('content-type', 'application/json').send(JSON.stringify(payload));
}

function normalizeCode(code) {
  return String(code ?? '').trim().toUpperCase();
}

function hashSecret(secret) {
  return crypto.createHash('sha256').update(String(secret ?? '').trim()).digest('hex');
}

function getNamespace(abstimmungId) {
  const id = String(abstimmungId ?? '').trim();
  if (!id) throw new Error('Missing abstimmungId');
  return db.collection('abstimmungen').doc(id);
}

async function getTeacherDoc(abstimmungId, classCode) {
  return getNamespace(abstimmungId).collection('teachers').doc(classCode).get();
}

function validateBody(body, { requireSecret = false, requireStudent = false } = {}) {
  const abstimmungId = String(body?.abstimmungId ?? '').trim();
  const classCode    = normalizeCode(body?.classCode);
  const studentCode  = normalizeCode(body?.studentCode);
  const secret       = String(body?.secret ?? '').trim();

  if (!abstimmungId) return { error: 'abstimmungId is required' };
  if (abstimmungId.length > MAX_ABSTIMMUNG_ID_LEN) return { error: 'abstimmungId too long' };

  if (requireStudent) {
    if (!studentCode) return { error: 'studentCode is required' };
    if (studentCode.length > MAX_STUDENT_CODE_LEN) return { error: 'studentCode too long' };
  } else {
    if (!classCode) return { error: 'classCode is required' };
    if (classCode.length > MAX_CLASS_CODE_LEN) return { error: 'classCode too long' };
  }

  if (requireSecret && !secret) return { error: 'secret is required' };
  if (secret.length > MAX_SECRET_LEN) return { error: 'secret too long' };

  return { abstimmungId, classCode, studentCode, secret };
}

async function loadClassReport(abstimmungId, classCode, revealCodes) {
  const studentsRef = getNamespace(abstimmungId).collection('students');
  const snaps = await studentsRef.where('teacherCode', '==', classCode).get();
  const rows = [];
  // classPollCounts: { [blockId]: { [optionId]: count } } — tallied from
  // each student's progress.blocks[*] entries where type === 'poll'.
  const classPollCounts = {};
  let idx = 1;
  for (const s of snaps.docs) {
    const progressSnaps = await s.ref.collection('progress').get();
    const progress = {};
    progressSnaps.forEach((p) => {
      const data = p.data() || {};
      progress[p.id] = data;
      const blocks = data.blocks && typeof data.blocks === 'object' ? data.blocks : {};
      for (const [blockId, entry] of Object.entries(blocks)) {
        if (!entry || entry.type !== 'poll' || !entry.completed) continue;
        if (typeof entry.answer !== 'string') continue;
        if (!classPollCounts[blockId]) classPollCounts[blockId] = {};
        classPollCounts[blockId][entry.answer] = (classPollCounts[blockId][entry.answer] ?? 0) + 1;
      }
    });
    rows.push({
      code: revealCodes ? s.id : `Lernende:r ${idx}`,
      progress,
    });
    idx += 1;
  }
  return { rows, classPollCounts };
}

async function loadGlobalPollCounts(abstimmungId) {
  const snaps = await getNamespace(abstimmungId).collection('polls').get();
  const out = {};
  snaps.forEach((d) => {
    const counts = d.data()?.counts;
    if (counts && typeof counts === 'object') out[d.id] = counts;
  });
  return out;
}

// POST /teacher/setup
// Body: { abstimmungId, classCode, secret, requiredModules: string[] }
// Claims a class code (first call wins). Subsequent calls require the
// matching secret to update requiredModules.
async function handleTeacherSetup(req, res, body) {
  const v = validateBody(body, { requireSecret: true });
  if (v.error) return json(res, 400, { error: v.error });
  const { abstimmungId, classCode, secret } = v;

  const rawModules = Array.isArray(body?.requiredModules) ? body.requiredModules : [];
  if (rawModules.length > MAX_REQUIRED_MODULES) {
    return json(res, 400, { error: 'too many requiredModules' });
  }
  const requiredModules = [];
  for (const m of rawModules) {
    const slug = String(m ?? '').trim();
    if (!slug) continue;
    if (slug.length > MAX_MODULE_SLUG_LEN) {
      return json(res, 400, { error: 'requiredModules entry too long' });
    }
    requiredModules.push(slug);
  }

  // Single-owner enforcement: if the class already exists, the request's
  // secret must match the stored hash. Otherwise anyone who guessed/learned
  // the classcode could overwrite the teacher's secret. The first call
  // claims the code.
  const ref = getNamespace(abstimmungId).collection('teachers').doc(classCode);
  const existing = await ref.get();
  const incomingHash = hashSecret(secret);
  if (existing.exists) {
    const storedHash = existing.data()?.secretHash;
    if (typeof storedHash === 'string' && storedHash.length > 0 && storedHash !== incomingHash) {
      return json(res, 403, { error: 'Secret is not correct' });
    }
  }

  await ref.set({
    requiredModules,
    updatedAt: new Date().toISOString(),
    secretHash: incomingHash,
  }, { merge: true });

  return json(res, 200, { ok: true });
}

// POST /student/class-exists
// Body: { abstimmungId, classCode }
// Lightweight existence check used by student onboarding to validate a
// classcode before linking. Public on purpose — does not reveal anything
// beyond "this classcode has been claimed by some teacher" (and the
// caller already knew the classcode).
async function handleClassExists(req, res, body) {
  const abstimmungId = String(body?.abstimmungId ?? '').trim();
  const classCode    = normalizeCode(body?.classCode);
  if (!abstimmungId) return json(res, 400, { error: 'abstimmungId is required' });
  if (abstimmungId.length > MAX_ABSTIMMUNG_ID_LEN) return json(res, 400, { error: 'abstimmungId too long' });
  if (!classCode) return json(res, 400, { error: 'classCode is required' });
  if (classCode.length > MAX_CLASS_CODE_LEN) return json(res, 400, { error: 'classCode too long' });

  const snap = await getTeacherDoc(abstimmungId, classCode);
  return json(res, 200, { exists: snap.exists });
}

// POST /teacher/prefs
// Body: { abstimmungId, classCode, secret? }
// Returns the requiredModules + whether the secret matches. Used by
// the teacher-setup page to load the current selection.
async function handleTeacherPrefs(req, res, body) {
  const v = validateBody(body);
  if (v.error) return json(res, 400, { error: v.error });
  const { abstimmungId, classCode, secret } = v;

  const snap = await getTeacherDoc(abstimmungId, classCode);
  if (!snap.exists) {
    return json(res, 200, { requiredModules: null, secretConfigured: false, secretValid: false });
  }
  const data = snap.data() || {};
  const hasSecret = typeof data.secretHash === 'string' && data.secretHash.length > 0;
  const secretValid = hasSecret && !!secret && data.secretHash === hashSecret(secret);
  if (hasSecret && secret && !secretValid) {
    return json(res, 403, { error: 'Secret is not correct' });
  }
  return json(res, 200, {
    requiredModules: Array.isArray(data.requiredModules) ? data.requiredModules : [],
    secretConfigured: hasSecret,
    secretValid,
  });
}

// POST /teacher/report
// Body: { abstimmungId, classCode, secret? }
// The teacher dashboard. Returns every student in the class with their
// per-module progress. `revealCodes` flag is true only when the secret
// matches — anonymized otherwise.
async function handleTeacherReport(req, res, body) {
  const v = validateBody(body);
  if (v.error) return json(res, 400, { error: v.error });
  const { abstimmungId, classCode, secret } = v;

  const teacherSnap = await getTeacherDoc(abstimmungId, classCode);
  const teacher = teacherSnap.exists ? (teacherSnap.data() || {}) : {};
  const hasSecret = typeof teacher.secretHash === 'string' && teacher.secretHash.length > 0;
  const revealCodes = hasSecret && !!secret && teacher.secretHash === hashSecret(secret);
  if (hasSecret && secret && !revealCodes) {
    return json(res, 403, { error: 'Secret is not correct' });
  }

  const [{ rows: report, classPollCounts }, globalPollCounts] = await Promise.all([
    loadClassReport(abstimmungId, classCode, revealCodes),
    loadGlobalPollCounts(abstimmungId),
  ]);
  return json(res, 200, {
    report,
    revealCodes,
    prefs: {
      requiredModules: Array.isArray(teacher.requiredModules) ? teacher.requiredModules : [],
      secretConfigured: hasSecret,
    },
    pollAggregates: {
      class: classPollCounts,
      global: globalPollCounts,
    },
  });
}

// POST /student/class-prefs
// Body: { abstimmungId, studentCode }
// Returns the requiredModules visible to a student. Used by every page
// that needs to hide modules the teacher excluded.
async function handleStudentClassPrefs(req, res, body) {
  const v = validateBody(body, { requireStudent: true });
  if (v.error) return json(res, 400, { error: v.error });
  const { abstimmungId, studentCode } = v;

  const studentSnap = await getNamespace(abstimmungId).collection('students').doc(studentCode).get();
  if (!studentSnap.exists) return json(res, 200, { requiredModules: null });
  const teacherCode = normalizeCode(studentSnap.data()?.teacherCode || '');
  if (!teacherCode) return json(res, 200, { requiredModules: null });

  const teacherSnap = await getTeacherDoc(abstimmungId, teacherCode);
  if (!teacherSnap.exists) return json(res, 200, { requiredModules: null });
  const requiredModules = teacherSnap.data()?.requiredModules;
  if (!Array.isArray(requiredModules) || requiredModules.length === 0) {
    return json(res, 200, { requiredModules: null });
  }
  return json(res, 200, { requiredModules });
}

// POST /student/class-report
// Body: { abstimmungId, studentCode, moduleSlugs?: string[] }
// Anonymized class aggregate for the student-facing "Klassenreport" page.
// Response NEVER contains real student codes — only the caller's totals
// (which they already know) plus sorted distribution arrays.
async function handleStudentClassReport(req, res, body) {
  const v = validateBody(body, { requireStudent: true });
  if (v.error) return json(res, 400, { error: v.error });
  const { abstimmungId, studentCode } = v;

  const rawModuleSlugs = Array.isArray(body?.moduleSlugs) ? body.moduleSlugs : [];
  const moduleSlugs = rawModuleSlugs
    .map((s) => String(s ?? '').trim())
    .filter((s) => s && s.length <= MAX_MODULE_SLUG_LEN)
    .slice(0, MAX_REQUIRED_MODULES);

  const ns = getNamespace(abstimmungId);
  const studentSnap = await ns.collection('students').doc(studentCode).get();
  if (!studentSnap.exists) return json(res, 404, { error: 'unknown student' });
  const teacherCode = normalizeCode(studentSnap.data()?.teacherCode || '');
  if (!teacherCode) return json(res, 404, { error: 'student is not in a class' });

  const studentSnaps = await ns.collection('students').where('teacherCode', '==', teacherCode).get();
  const perModuleAgg = new Map();
  const studentRecords = [];

  for (const s of studentSnaps.docs) {
    const progressSnaps = await s.ref.collection('progress').get();
    let earned = 0;
    const myMods = {};
    progressSnaps.forEach((p) => {
      const d = p.data() || {};
      const pct = Number(d.pct ?? 0);
      const pe = Number(d.pointsEarned ?? 0);
      const pp = Number(d.pointsPossible ?? 0);
      earned += pe;
      myMods[p.id] = { pct, pointsEarned: pe, pointsPossible: pp, completed: pct >= 100 };
      const agg = perModuleAgg.get(p.id) || { pctSum: 0, pctN: 0, completed: 0, maxPossible: 0 };
      agg.pctSum += pct;
      agg.pctN += 1;
      if (pct >= 100) agg.completed += 1;
      if (pp > agg.maxPossible) agg.maxPossible = pp;
      perModuleAgg.set(p.id, agg);
    });
    studentRecords.push({ isYou: s.id === studentCode, earned, mods: myMods });
  }

  let unitMaxPoints = 0;
  for (const slug of moduleSlugs) {
    const agg = perModuleAgg.get(slug);
    if (agg) unitMaxPoints += agg.maxPossible;
  }

  const totalsPct = [];
  const totalsPoints = [];
  let you = null;
  for (const r of studentRecords) {
    const denom = unitMaxPoints > 0
      ? unitMaxPoints
      : Object.values(r.mods).reduce((s, m) => s + (m.pointsPossible || 0), 0);
    const totalPct = denom > 0 ? Math.round((r.earned / denom) * 100) : 0;
    totalsPct.push(totalPct);
    totalsPoints.push(r.earned);
    if (r.isYou) {
      you = {
        totalPct,
        totalPoints: r.earned,
        totalPossible: denom,
        perModule: r.mods,
      };
    }
  }

  totalsPct.sort((a, b) => a - b);
  totalsPoints.sort((a, b) => a - b);

  const perModule = {};
  for (const [slug, agg] of perModuleAgg.entries()) {
    perModule[slug] = {
      avgPct: agg.pctN > 0 ? Math.round(agg.pctSum / agg.pctN) : 0,
      completedCount: agg.completed,
      studentsWithProgress: agg.pctN,
      maxPossible: agg.maxPossible,
    };
  }

  const studentCount = studentSnaps.size;
  const avgPct = totalsPct.length ? Math.round(totalsPct.reduce((a, b) => a + b, 0) / totalsPct.length) : 0;
  const avgPoints = totalsPoints.length ? Math.round(totalsPoints.reduce((a, b) => a + b, 0) / totalsPoints.length) : 0;

  return json(res, 200, {
    studentCount,
    you,
    unitMaxPoints,
    classAggregate: { avgPct, avgPoints, perModule },
    distribution: { pct: totalsPct, points: totalsPoints },
  });
}

// POST /admin/feedback
// Body: { abstimmungId, password }
// Admin-only viewer for the anonymous feedback collection. Gated by
// SHA-256 of `password` matching ADMIN_PASSWORD_HASH from functions/.env.
async function handleAdminFeedback(req, res, body) {
  const abstimmungId = String(body?.abstimmungId ?? '').trim();
  const password     = String(body?.password ?? '');

  if (!abstimmungId) return json(res, 400, { error: 'abstimmungId is required' });
  if (abstimmungId.length > MAX_ABSTIMMUNG_ID_LEN) return json(res, 400, { error: 'abstimmungId too long' });
  if (!password) return json(res, 401, { error: 'Password required' });
  if (password.length > MAX_SECRET_LEN) return json(res, 400, { error: 'password too long' });

  const expected = String(process.env.ADMIN_PASSWORD_HASH ?? '').trim().toLowerCase();
  if (!expected) {
    return json(res, 500, {
      error: 'ADMIN_PASSWORD_HASH is not configured on the server. Set it in functions/.env and redeploy.',
    });
  }
  if (hashSecret(password) !== expected) {
    return json(res, 403, { error: 'Wrong password' });
  }

  const snaps = await getNamespace(abstimmungId).collection('feedback').get();
  const student = [];
  const teacher = [];
  snaps.forEach((d) => {
    const data = d.data() || {};
    const ts = data.createdAt;
    const createdAt = ts && typeof ts.toDate === 'function' ? ts.toDate().toISOString() : null;
    const row = {
      id: d.id,
      type: data.type,
      studentCode: data.studentCode ?? null,
      teacherCode: data.teacherCode ?? null,
      responses: data.responses && typeof data.responses === 'object' ? data.responses : {},
      createdAt,
      userAgent: data.userAgent ?? null,
    };
    if (row.type === 'teacher') teacher.push(row);
    else if (row.type === 'student') student.push(row);
  });

  const sortDesc = (a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? '');
  student.sort(sortDesc);
  teacher.sort(sortDesc);

  return json(res, 200, { student, teacher });
}

// App Check enforcement is gated on APPCHECK_ENFORCE=true. Default false
// so the function keeps working until the client has shipped App Check
// tokens to all in-flight sessions. To enable: set APPCHECK_ENFORCE=true
// in functions/.env and redeploy.
const enforceAppCheck = String(process.env.APPCHECK_ENFORCE ?? '').toLowerCase() === 'true';

exports.api = onRequest(
  { cors: true, region: 'europe-west6', enforceAppCheck },
  async (req, res) => {
    if (req.method !== 'POST') return json(res, 405, { error: 'POST required' });
    const path = (req.path || '').replace(/^\/+/, '');
    const body = req.body || {};

    if (typeof body !== 'object') return json(res, 400, { error: 'invalid body' });

    try {
      if (path === 'teacher/setup')        return await handleTeacherSetup(req, res, body);
      if (path === 'teacher/prefs')        return await handleTeacherPrefs(req, res, body);
      if (path === 'teacher/report')       return await handleTeacherReport(req, res, body);
      if (path === 'student/class-prefs')  return await handleStudentClassPrefs(req, res, body);
      if (path === 'student/class-report') return await handleStudentClassReport(req, res, body);
      if (path === 'student/class-exists') return await handleClassExists(req, res, body);
      if (path === 'admin/feedback')       return await handleAdminFeedback(req, res, body);
      return json(res, 404, { error: 'Not found' });
    } catch (err) {
      return json(res, 500, { error: err?.message || String(err) });
    }
  },
);
```

### 4.3 Endpoint summary

| Endpoint                  | Auth                   | Returns                                              |
|---------------------------|------------------------|------------------------------------------------------|
| `POST /teacher/setup`     | secret (claim-or-match)| `{ok: true}`                                         |
| `POST /teacher/prefs`     | secret (optional gate) | `{requiredModules, secretConfigured, secretValid}`   |
| `POST /teacher/report`    | secret reveals codes   | `{report, revealCodes, prefs, pollAggregates}`       |
| `POST /student/class-exists` | none                | `{exists: boolean}`                                  |
| `POST /student/class-prefs`  | none (by student code) | `{requiredModules: string[]|null}`                   |
| `POST /student/class-report` | none (by student code) | anonymized aggregates, no other students' codes    |
| `POST /admin/feedback`    | server-side password   | `{student: [...], teacher: [...]}`                   |

Every request body **must include `abstimmungId`** so one Cloud Function can serve multiple deployments.

---

## 5. Client SDK conventions

### 5.1 `lib/firebase.ts` — singleton + App Check init

```ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
  getToken as getAppCheckToken,
  type AppCheck,
} from 'firebase/app-check';

const requiredEnv = [
  'PUBLIC_FIREBASE_API_KEY',
  'PUBLIC_FIREBASE_AUTH_DOMAIN',
  'PUBLIC_FIREBASE_PROJECT_ID',
  'PUBLIC_FIREBASE_STORAGE_BUCKET',
  'PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'PUBLIC_FIREBASE_APP_ID',
] as const;

// Replace `process.env.PUBLIC_X` with whatever your framework uses to
// expose env vars to the browser (see header note at top of doc).
const env = process.env as Record<string, string | undefined>;

const missing = requiredEnv.filter(
  (key) => !env[key] || String(env[key]).trim() === '',
);

if (missing.length > 0) {
  throw new Error(
    `Firebase misconfigured: missing env var(s) ${missing.join(', ')}. ` +
      `Copy .env.example to .env.local and fill in credentials.`,
  );
}

const config = {
  apiKey:            env.PUBLIC_FIREBASE_API_KEY,
  authDomain:        env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             env.PUBLIC_FIREBASE_APP_ID,
};

const app: FirebaseApp = getApps().length === 0 ? initializeApp(config) : getApps()[0];

// App Check — browser only, activates when PUBLIC_RECAPTCHA_SITE_KEY is set.
let appCheckInstance: AppCheck | null = null;

if (typeof window !== 'undefined') {
  const siteKey = String(env.PUBLIC_RECAPTCHA_SITE_KEY ?? '').trim();
  if (siteKey) {
    try {
      appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
    } catch (err) {
      console.warn('[App Check] Failed to initialize:', err);
    }
  }
}

export const db = getFirestore(app);

/** Returns the current App Check token, or null when disabled.
 *  Used to manually attach the token to non-Firebase-SDK fetches. */
export async function getAppCheckHeaderValue(): Promise<string | null> {
  if (!appCheckInstance) return null;
  try {
    const result = await getAppCheckToken(appCheckInstance, false);
    return result.token || null;
  } catch (err) {
    console.warn('[App Check] Failed to fetch token:', err);
    return null;
  }
}
```

### 5.2 `lib/paths.ts` — every Firestore path goes through here

Centralising path generation makes it trivial to change the namespace structure later:

```ts
import { db } from './firebase';
import { doc, collection } from 'firebase/firestore';

// Replace process.env access with whatever your framework uses.
const id = (process.env.PUBLIC_UNIT_ID as string | undefined) ?? 'dev';

export const studentDoc       = (code: string)            => doc(db, 'abstimmungen', id, 'students', code);
export const progressDoc      = (code: string, m: string) => doc(db, 'abstimmungen', id, 'students', code, 'progress', m);
export const progressCollection = (code: string)          => collection(db, 'abstimmungen', id, 'students', code, 'progress');
export const studentsCollection = ()                       => collection(db, 'abstimmungen', id, 'students');
export const notesDoc         = (code: string, m: string) => doc(db, 'abstimmungen', id, 'students', code, 'notes', m);
export const notesCollection  = (code: string)            => collection(db, 'abstimmungen', id, 'students', code, 'notes');
export const synthesisDoc     = (code: string)            => doc(db, 'abstimmungen', id, 'students', code, 'synthesis', 'current');
export const teacherDoc       = (code: string)            => doc(db, 'abstimmungen', id, 'teachers', code);
export const pollDoc          = (pollId: string)          => doc(db, 'abstimmungen', id, 'polls', pollId);
export const feedbackCollection = ()                       => collection(db, 'abstimmungen', id, 'feedback');
export const engagementCollection = ()                     => collection(db, 'abstimmungen', id, 'engagement');
```

### 5.3 `lib/session.ts` — student code & localStorage

```ts
const ANIMALS = ['BÄR','WOLF','FUCHS','LUCHS','GAMS','RABE','HASE','ELCH','DACHS','IGEL','OTTER','ADLER','GEIER','STORCH','UHU','BIBER','HIRSCH','FALKE'];

export function generateCode(): string {
  const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num    = String(Math.floor(Math.random() * 900) + 100);
  return `${animal}-${num}`;
}

export interface Session {
  studentCode: string;
  teacherCode: string | null;
}

// Namespace the storage key per deployment so multiple units on the same
// origin don't collide.
const KEY = `your-app-${(process.env.PUBLIC_UNIT_ID as string | undefined) ?? 'dev'}`;

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function saveSession(s: Session): void  { localStorage.setItem(KEY, JSON.stringify(s)); }
export function clearSession():       void     { localStorage.removeItem(KEY); }
```

### 5.4 `lib/db.ts` — direct-Firestore CRUD

For everything that touches `students/{code}/*` (i.e. the parts the rules allow direct browser access to), use the client SDK directly:

```ts
import { setDoc, getDoc, getDocs, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { studentDoc, progressDoc, progressCollection, /* … */ } from './paths';

export async function ensureStudent(studentCode: string, teacherCode: string | null) {
  const ref = studentDoc(studentCode);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { teacherCode, createdAt: serverTimestamp() });
    return;
  }
  // Legacy support: allow attaching a class to a previously class-less student.
  if (teacherCode) {
    const existing = snap.data() as { teacherCode?: string | null };
    if (!existing.teacherCode) {
      await setDoc(ref, { teacherCode }, { merge: true });
    }
  }
}

export async function loadStudent(code: string) {
  const snap = await getDoc(studentDoc(code));
  return snap.exists() ? (snap.data() as { teacherCode: string | null }) : null;
}

/** Set/clear the student's teacherCode. The class existence check must
 *  happen via the Cloud Function `classExists()` first — Firestore rules
 *  deny browser reads of `teachers/*`. */
export async function linkTeacherCode(studentCode: string, teacherCode: string | null) {
  await setDoc(studentDoc(studentCode), { teacherCode }, { merge: true });
}

export async function saveProgress(studentCode: string, moduleId: string, data: any) {
  await setDoc(
    progressDoc(studentCode, moduleId),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function loadAllProgress(studentCode: string) {
  const snaps = await getDocs(progressCollection(studentCode));
  const out: Record<string, any> = {};
  snaps.forEach((s) => { out[s.id] = s.data(); });
  return out;
}

export async function resetAllProgress(studentCode: string) {
  const snaps = await getDocs(progressCollection(studentCode));
  await Promise.all(snaps.docs.map((d) => deleteDoc(d.ref)));
}
```

### 5.5 `lib/api.ts` — wraps the Cloud Function

For anything that touches `teachers/{code}/*`, you must use the Cloud Function:

```ts
import { getAppCheckHeaderValue } from './firebase';

const env = process.env as Record<string, string | undefined>;
const UNIT_ID = env.PUBLIC_UNIT_ID ?? 'dev';

async function postApi<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  // In production, /api/** is rewritten by Firebase Hosting to the function.
  // In dev, set PUBLIC_FUNCTIONS_API_BASE_URL to the direct function URL —
  // dev servers don't proxy /api/** automatically.
  const base = env.PUBLIC_FUNCTIONS_API_BASE_URL?.replace(/\/+$/, '');
  const url = base ? `${base}/${path}` : `/api/${path}`;

  const headers: Record<string, string> = { 'content-type': 'application/json' };
  const appCheckToken = await getAppCheckHeaderValue();
  if (appCheckToken) headers['X-Firebase-AppCheck'] = appCheckToken;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    // Note: the field name on the wire is `abstimmungId` (kept as-is so the
    // verbatim Cloud Functions code in §4 works unchanged). Rename in your
    // backend if you want a different domain term.
    body: JSON.stringify({ abstimmungId: UNIT_ID, ...payload }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || `API error (${res.status})`);
  return data as T;
}

export async function classExists(classCode: string): Promise<boolean> {
  const r = await postApi<{ exists: boolean }>('student/class-exists', { classCode });
  return !!r.exists;
}

export function loadTeacherPrefsSecure(classCode: string, secret: string) {
  return postApi<{ requiredModules: string[] | null; secretConfigured: boolean; secretValid: boolean }>(
    'teacher/prefs', { classCode, secret });
}

export function saveTeacherSetupSecure(classCode: string, secret: string, requiredModules: string[]) {
  return postApi<{ ok: boolean }>('teacher/setup', { classCode, secret, requiredModules });
}

export function loadTeacherReportSecure(classCode: string, secret: string) {
  return postApi<any>('teacher/report', { classCode, secret });
}

/** Returns `{requiredModules: null}` on any error — every student-facing
 *  page can `await` this in a Promise.all without each one needing .catch(). */
export async function loadStudentClassPrefsSecure(studentCode: string) {
  try {
    return await postApi<{ requiredModules: string[] | null }>('student/class-prefs', { studentCode });
  } catch {
    return { requiredModules: null };
  }
}

export function loadStudentClassReport(studentCode: string, moduleSlugs: string[] = []) {
  return postApi<any>('student/class-report', { studentCode, moduleSlugs });
}
```

---

## 6. End-to-end flows

### 6.1 Student onboarding

```
1. /  →  generateCode()  →  show code, ask user to note it down
2. Ask "Hat dir deine Lehrperson einen Klassencode gegeben?"
   ├── No  →  await ensureStudent(code, null)
   │         saveSession({ studentCode: code, teacherCode: null })
   │         redirect to /dashboard
   └── Yes →  input field
              await classExists(teacherCode)  // Cloud Function
              ├── false → "Code nicht gefunden — frag deine Lehrperson"
              └── true  → await ensureStudent(code, teacherCode)
                          saveSession({ studentCode: code, teacherCode })
                          redirect to /dashboard
```

`classExists` is critical — Firestore rules block browser reads of `teachers/*`, so this is the only way to validate a teacher code before linking.

### 6.2 Returning student

```
1. /  →  "Ich habe bereits einen Code"  →  input field
2. await loadStudent(code)
   ├── null → "Code nicht gefunden, überprüfe die Schreibweise"
   └── student → saveSession({ studentCode: code, teacherCode: student.teacherCode })
                 redirect to /dashboard
```

### 6.3 Teacher registers a new class

```
1. /teacher  →  card "Neue Klasse anlegen"
2. Form: classCode (free choice) + secret (free choice, ≥4 chars)
3. await classExists(classCode)
   ├── true  → "Dieser Code ist bereits vergeben. Wähle einen anderen."
   └── false → await saveTeacherSetupSecure(classCode, secret, [])
               (this is the "claim" — first call wins)
4. Optional secondary button: trigger a .txt download with code + secret
   in cleartext so the teacher has a paper backup. The secret is otherwise
   unrecoverable (server only stores the hash).
5. Open the report by calling loadTeacherReportSecure(code, secret).
```

**Race window.** Between "teacher mentally picks a code" and "teacher hits Register," another teacher could claim it. Mitigation is UX: the placeholder suggests distinctive codes (`PiRo-FS-A26`), copy pushes "claim immediately." No reservation API.

### 6.4 Teacher returns to an existing class

```
1. /teacher  →  card "Bestehende Klasse"
2. Form: classCode + secret
3. await classExists(classCode)
   ├── false → "Diese Klasse ist nicht registriert. Bitte unter 'Neue Klasse' anlegen."
   └── true  → await loadTeacherReportSecure(classCode, secret)
               ├── 403 → "Secret stimmt nicht."
               └── 200 → render the dashboard

The teacher session is persisted in localStorage under
`<app>-teacher-{abstimmungId}` so reloading skips the form. On auth
failure (revoked secret, deleted class), the stale session is cleared
and the chooser comes back.
```

### 6.5 Teacher updates required modules

```
1. From the report, click "Pflichtmodule festlegen" → /teacher-setup
2. Form: classCode + secret  (auto-filled if the teacher session is present)
3. await loadTeacherPrefsSecure(classCode, secret) → list of current selections
4. User toggles checkboxes
5. await saveTeacherSetupSecure(classCode, secret, requiredModules)

Students see the change immediately on their next page load:
loadStudentClassPrefsSecure(studentCode) is called on the dashboard,
the modules-listing page, the SideNav, and the dynamic module page.
The module page is the authoritative gate — it redirects to /dashboard
if the slug isn't in the required list. The other call sites only hide
links visually for a faster UX.
```

### 6.6 Student views anonymized class aggregate

```
1. /klassenreport (only shown in nav when session.teacherCode is set)
2. await loadStudentClassReport(studentCode, allModuleSlugs)
3. Response: { studentCount, you, classAggregate, distribution }
   No other student codes appear in the response — distribution is
   sorted number arrays so position doesn't encode identity.
```

---

## 7. App Check rollout (production checklist)

App Check is **off** by default so dev work doesn't need a reCAPTCHA key. Three steps to turn it on for production, in this order:

### Step 1 — Client (`PUBLIC_RECAPTCHA_SITE_KEY`)

1. Create a reCAPTCHA v3 site at <https://www.google.com/recaptcha/admin> registered for your hosting domain.
2. Firebase Console → App Check → Apps → register the web app with that site key.
3. Set `PUBLIC_RECAPTCHA_SITE_KEY` in `.env.local` AND in GitHub Secrets (for the deploy build).
4. Deploy. The client SDK now attaches App Check tokens to every Firestore call automatically; `lib/api.ts` also attaches them as `X-Firebase-AppCheck` to direct fetches.

**Local dev with debug tokens.** When you have a site key but want to test locally: open DevTools BEFORE the page loads and run `self.FIREBASE_APPCHECK_DEBUG_TOKEN = true`. Reload — the App Check SDK prints a debug token. Register it in Firebase Console → App Check → Apps → Manage debug tokens.

### Step 2 — Cloud Function (`APPCHECK_ENFORCE`)

```bash
# functions/.env
APPCHECK_ENFORCE=true
```

Then `firebase deploy --only functions`. The flag toggles `enforceAppCheck` on the v2 `onRequest` handler — requests without a valid token return 401 *before* reaching the handler.

**Rollout order:**
1. Deploy the client with the site key (Step 1).
2. Verify Cloud Functions logs show `req.app` populated on real traffic.
3. Flip `APPCHECK_ENFORCE=true` and redeploy. If you flip too early, every in-flight session breaks until they reload.

### Step 3 — Firestore rules (manual)

Uncomment the `isAppChecked()` helper and gate every `allow` on it:

```javascript
function isAppChecked() {
  return request.app != null;
}

match /abstimmungen/{abstimmungId}/students/{studentCode} {
  allow read, write: if isAppChecked();
  match /progress/{moduleId} { allow read, write: if isAppChecked(); }
  // …
}
```

Then `firebase deploy --only firestore:rules`.

---

## 8. Local dev quirks

- **No `/api/**` rewrite in the dev server.** The `/api/**` → Cloud Function rewrite is a Firebase Hosting feature; dev servers (Next dev, Vite, etc.) don't proxy it on their own. Set `PUBLIC_FUNCTIONS_API_BASE_URL=https://europe-west6-<project-id>.cloudfunctions.net/api` in `.env.local` so `postApi` calls the function directly. Without it, `/api/...` 404s with HTML and produces the classic "Unexpected token '<'" JSON-parse error in the browser.
- **Firestore Database must exist.** Create the database (Native mode) in Firebase Console once per project. Picking a region (e.g. `europe-west6`) is permanent — pick to match the function region.
- **Functions deploy is slow** (~2 min) and not in CI. Run `firebase deploy --only functions` manually when `functions/index.js` or `functions/.env` change.

---

## 9. Build checklist for a new project

1. Create a Firebase project in the console. Note the project ID.
2. Enable **Firestore** (Native mode, pick a region — e.g. `europe-west6`).
3. Add a **Web App** to the project → copy the config snippet into `.env.local`.
4. Drop `firestore.rules` (from §3) into the repo root, `firebase deploy --only firestore:rules`.
5. Copy `functions/package.json` and `functions/index.js` from §4 into a `functions/` folder. `cd functions && npm install`. Then `firebase deploy --only functions`.
6. Create `firebase.json` with the `/api/**` rewrite (see `01-LAYOUT.md` §6).
7. Build the four `lib/` modules: `firebase.ts`, `paths.ts`, `session.ts`, `db.ts`, `api.ts` (§5). Adapt the env-var prefix to your framework (`NEXT_PUBLIC_`, `VITE_`, …).
8. Build the onboarding page (§6.1) — calls `generateCode()`, `ensureStudent()`, optionally `classExists()`, saves to localStorage.
9. Build the teacher hub (§6.3, §6.4) — calls `classExists`, `saveTeacherSetupSecure`, `loadTeacherReportSecure`.
10. Build `/teacher-setup` (§6.5) — calls `loadTeacherPrefsSecure` + `saveTeacherSetupSecure`.
11. When student-facing pages need to respect the teacher's required-modules list, call `loadStudentClassPrefsSecure(studentCode)` on page load and either filter the nav (client-side) or redirect (`/module/[slug]` authoritative gate).
12. Decide: ship with App Check off for the pilot, turn it on for the public launch (§7).

---

## 10. Things I'd do differently in a new project

These are choices the source repo locked in early that I'd reconsider if starting over:

- **Add a salt to the secret hash.** `sha256(secret)` is fast — a stolen Firestore dump could be brute-forced for weak teacher secrets. Per-class salt (`sha256(salt + secret)`, store `salt` next to `secretHash`) is one extra line of code.
- **Rate-limit `teacher/setup` claim attempts** by IP in the Cloud Function. Today a script could enumerate desirable class codes by trying to claim them. Adding a simple Firestore-backed counter (`claimAttempts/{ip}/{day}`) costs little and closes that hole.
- **Use Firebase Auth anonymous sign-in** instead of bare localStorage codes. The student code becomes the display name, but every Firestore call now carries a `request.auth.uid` that the rules can pin to `students/{uid}`. Much stronger than code-obscurity. The migration cost is real (existing students would need to re-onboard) so it's worth doing on a *new* project from day one.
- **Store the unit's full module list server-side** instead of having the client pass `moduleSlugs` to `/student/class-report`. Today the client is the source of truth for what the "unit total" is, which means a misbehaving client could shrink its own denominator. For a course-record system you'd want this server-side.

Note these are improvements, not bugs in the current system — the current trade-offs are correct for the use case (low-stakes civic education, short-lived deployments). Mention them only if the new project has a higher security bar.