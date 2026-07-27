/**
 * Wartungsbericht zum Korrektorat-Inventar.
 *
 *   node scripts/korrektorat/inventar.mjs
 *
 * Beantwortet die Frage, die zwischen zwei Korrekturrunden veraltet:
 * **stimmt noch, was Sebastian sieht?** Dazu wird der Import-Graph ab den echten
 * Einstiegspunkten (`page.tsx`, `layout.tsx`) aufgebaut und mit
 * `src/lib/korrektorat/inventar.mjs` verglichen. Gemeldet wird:
 *
 *  · **tot, aber sichtbar** — Datei ist nirgends mehr eingebunden, erscheint
 *    aber im Editor. Sebastian würde Text korrigieren, den niemand liest
 *    → in `AUSGESCHLOSSEN` aufnehmen.
 *  · **lebt, aber versteckt** — Datei ist eingebunden, aber ausgeschlossen
 *    → Ausschluss prüfen.
 *  · **ohne Titel** — Datei mit vielen Feldern und nur abgeleitetem Namen
 *    → in `TITEL` eintragen.
 *
 * Nach Struktur-Umbauten an den Lernseiten laufen lassen.
 */

import fs from "node:fs";
import path from "node:path";
import { extract } from "../../src/lib/korrektorat/parser.mjs";
import {
  UNVERDRAHTET,
  ausschluss,
  ausschlussGrund,
  dateiInfo,
  inhaltsDateien,
  istInhaltsDatei,
} from "../../src/lib/korrektorat/inventar.mjs";

const REPO = path.resolve(import.meta.dirname, "../..");
const EINSTIEGE = [
  "src/app/lernen/lernseite-1/page.tsx",
  "src/app/lernen/lernseite-1/submodul-1/page.tsx",
  "src/app/lernen/lernseite-1/submodul-2/page.tsx",
  "src/app/lernen/lernseite-2/page.tsx",
  "src/app/lernen/lernseite-2/vorhang-auf/page.tsx",
  "src/app/lernen/lernseite-2/philosophische-perspektive/page.tsx",
  "src/app/lernen/lernseite-2/das-orakel/page.tsx",
  "src/config/unit.ts",
  // Der Lehrer-Report greift quer in die Lernseiten hinein (Abstimmungs-
  // Beschriftungen). Ohne diesen Einstieg gälte `pollRegistry.ts` als tot.
  "src/lib/pollLabels.ts",
];

const feldCache = new Map();
const alle = sammle(path.join(REPO, "src")).map(relativ);
const erreichbar = erreichbareDateien(EINSTIEGE);
const sichtbar = inhaltsDateien(alle);

/* ── Zählung ───────────────────────────────────────────────────────────────── */

const zeilen = [];
let felderTotal = 0;
let leer = 0;
const ohneTitel = [];

let gruppe = "";
for (const pfad of sichtbar) {
  const info = dateiInfo(pfad);
  if (info.gruppe !== gruppe) {
    gruppe = info.gruppe;
    zeilen.push(`\n${gruppe}`);
  }
  const src = fs.readFileSync(path.join(REPO, pfad), "utf8");
  const { fields } = extract(src, path.basename(pfad));
  felderTotal += fields.length;
  if (!fields.length) {
    leer++;
    continue;
  }
  const zeichen = fields.reduce((a, f) => a + f.value.length, 0);
  const marke = erreichbar.has(pfad) ? " " : "†";
  zeilen.push(
    `${marke} ${String(fields.length).padStart(4)} Felder ${String(zeichen).padStart(7)} Zeichen  ${info.titel}${info.abgeleitet ? "  ⟨abgeleitet⟩" : ""}`,
  );
  zeilen.push(`                                    ${pfad}`);
  if (info.abgeleitet && fields.length >= 10) ohneTitel.push([pfad, fields.length]);
}

console.log(zeilen.join("\n"));
console.log(
  `\n${sichtbar.length - leer} Dateien mit Inhalt (${leer} ohne Textfelder, im Editor ausgeblendet) · ${felderTotal} Felder`,
);

/* ── Abweichungen ──────────────────────────────────────────────────────────── */

const totSichtbar = sichtbar.filter(
  (p) => !erreichbar.has(p) && !UNVERDRAHTET[p] && feldZahl(p) > 0,
);
// Nur melden, wenn die Datei wirklich Text enthält — eine ausgeschlossene
// Logikdatei ohne Felder ist kein Befund.
const lebtVersteckt = alle.filter(
  (p) =>
    erreichbar.has(p) &&
    !istInhaltsDatei(p) &&
    ausschlussGrund(p) &&
    !ausschluss(p).nurKennungen &&
    feldZahl(p) > 0,
);

melde(
  "† tot, aber im Editor sichtbar — in AUSGESCHLOSSEN oder UNVERDRAHTET aufnehmen",
  totSichtbar.map((p) => `  ${String(feldZahl(p)).padStart(4)} Felder  ${p}`),
);
melde(
  "lebt, ist aber ausgeschlossen — Ausschluss prüfen",
  lebtVersteckt.map((p) => `  ${p}  (${ausschlussGrund(p)})`),
);
melde(
  "viele Felder, aber nur abgeleiteter Titel — in TITEL eintragen",
  ohneTitel.map(([p, n]) => `  ${String(n).padStart(4)} Felder  ${p}`),
);

if (!totSichtbar.length && !lebtVersteckt.length && !ohneTitel.length) {
  console.log("\nInventar und Import-Graph stimmen überein.");
}

/* ── Hilfen ────────────────────────────────────────────────────────────────── */

function feldZahl(pfad) {
  if (feldCache.has(pfad)) return feldCache.get(pfad);
  const abs = path.join(REPO, pfad);
  let n = 0;
  if (fs.existsSync(abs)) {
    n = extract(fs.readFileSync(abs, "utf8"), path.basename(pfad)).fields.length;
  }
  feldCache.set(pfad, n);
  return n;
}

function melde(titel, eintraege) {
  if (!eintraege.length) return;
  console.log(`\n${titel}:`);
  console.log(eintraege.join("\n"));
}

function relativ(abs) {
  return path.relative(REPO, abs).split(path.sep).join("/");
}

function sammle(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) sammle(p, acc);
    else if (/\.tsx?$/.test(e.name)) acc.push(p);
  }
  return acc;
}

/**
 * Import-Graph ab den Einstiegspunkten. Aufgelöst werden relative Pfade und der
 * `@/`-Alias; Pakete werden ignoriert. Reine Typ-Importe (`import type`) zählen
 * **nicht** als Einbindung — sonst gälte der tote v2-Flow als lebendig, bloss
 * weil noch ein Interface aus ihm gelesen wird.
 */
function erreichbareDateien(einstiege) {
  const gesehen = new Set();
  const rand = [...einstiege];
  while (rand.length) {
    const pfad = rand.pop();
    if (gesehen.has(pfad)) continue;
    const abs = path.join(REPO, pfad);
    if (!fs.existsSync(abs)) continue;
    gesehen.add(pfad);
    const src = fs.readFileSync(abs, "utf8");
    for (const ziel of importe(src)) {
      const aufgeloest = aufloesen(ziel, pfad);
      if (aufgeloest) rand.push(aufgeloest);
    }
  }
  return gesehen;
}

function importe(src) {
  const ziele = [];
  const re = /^\s*import\s+(?!type\s)([\s\S]*?)from\s+"([^"]+)"/gm;
  let m;
  while ((m = re.exec(src))) {
    // `import { type A, B }` bindet ein; `import { type A }` allein nicht.
    const namen = m[1].trim();
    if (namen.startsWith("{") && /^\{\s*type\s[^,}]*\}$/.test(namen)) continue;
    ziele.push(m[2]);
  }
  const dyn = /import\("([^"]+)"\)/g;
  while ((m = dyn.exec(src))) ziele.push(m[1]);
  return ziele;
}

function aufloesen(ziel, vonPfad) {
  let basis;
  if (ziel.startsWith("@/")) basis = path.join(REPO, "src", ziel.slice(2));
  else if (ziel.startsWith(".")) basis = path.resolve(REPO, path.dirname(vonPfad), ziel);
  else return null;
  for (const kandidat of [
    basis + ".tsx",
    basis + ".ts",
    path.join(basis, "index.tsx"),
    path.join(basis, "index.ts"),
  ]) {
    if (fs.existsSync(kandidat) && fs.statSync(kandidat).isFile()) return relativ(kandidat);
  }
  return null;
}
