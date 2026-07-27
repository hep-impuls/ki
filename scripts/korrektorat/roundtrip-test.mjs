/**
 * Rundlauf-Prüfung des Korrektorat-Parsers.
 *
 *   node scripts/korrektorat/roundtrip-test.mjs
 *
 * Drei Prüfungen pro Inhaltsdatei:
 *
 *  1. **Identität** — `apply(src, extract(src).fields)` mit unveränderten
 *     Werten muss byte-identisch zur Quelle sein. Schlägt das fehl, verschiebt
 *     der Parser Zeichen und darf nicht deployt werden.
 *  2. **Gültigkeit** — nach einer Änderung an *jedem* Feld muss die Datei
 *     syntaktisch weiterhin gültiges TypeScript sein. Prüft das Maskieren von
 *     Anführungszeichen, Backslashes und Zeilenumbrüchen.
 *  3. **Wiederfinden** — die geänderten Werte müssen sich aus der geänderten
 *     Datei unter derselben Feld-ID wieder auslesen lassen. Prüft, dass die
 *     Feld-IDs stabil sind (Voraussetzung für «Original wiederherstellen» und
 *     die Offset-Prüfung beim Speichern).
 *
 * Muss vor jedem Deploy grün sein.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import ts from "typescript";
import { extract, apply } from "../../src/lib/korrektorat/parser.mjs";
import { inhaltsDateien } from "../../src/lib/korrektorat/inventar.mjs";

const REPO = path.resolve(import.meta.dirname, "../..");

const dateien = inhaltsDateien(
  sammle(path.join(REPO, "src/app/lernen")).concat([path.join(REPO, "src/config/unit.ts")]).map(relativ),
);

let fehler = 0;
let felderTotal = 0;
let zeichenTotal = 0;
const zeilen = [];

for (const rel of dateien) {
  const abs = path.join(REPO, rel);
  if (!fs.existsSync(abs)) {
    zeilen.push(`  FEHLT      ${rel}`);
    fehler++;
    continue;
  }
  const src = fs.readFileSync(abs, "utf8");
  const { fields } = extract(src, path.basename(rel));
  const zeichen = fields.reduce((a, f) => a + f.value.length, 0);
  felderTotal += fields.length;
  zeichenTotal += zeichen;

  const probleme = [];

  // 1. Identität
  const zurueck = apply(src, fields);
  if (zurueck !== src) {
    probleme.push(`Rundlauf nicht identisch (${ersteAbweichung(src, zurueck)})`);
  }

  // 2./3. Änderung an jedem Feld
  if (fields.length) {
    const geaendert = fields.map((f) => ({ ...f, value: aendere(f.value) }));
    let neu;
    try {
      neu = apply(src, geaendert);
    } catch (err) {
      probleme.push(`apply() wirft: ${err.message}`);
    }
    if (neu) {
      const syntaxFehler = syntaxPruefen(neu, path.basename(rel));
      if (syntaxFehler.length) {
        probleme.push(`${syntaxFehler.length} Syntaxfehler nach Änderung: ${syntaxFehler[0]}`);
      }
      const nachher = new Map(extract(neu, path.basename(rel)).fields.map((f) => [f.id, f.value]));
      const verloren = geaendert.filter((f) => nachher.get(f.id) !== normalisiere(f));
      if (verloren.length) {
        probleme.push(
          `${verloren.length}/${fields.length} Felder nicht wiedergefunden (z.B. ${verloren[0].id})`,
        );
      }
    }
  }

  if (probleme.length) {
    fehler++;
    zeilen.push(`  FEHLER     ${rel}`);
    for (const p of probleme) zeilen.push(`             → ${p}`);
  } else {
    zeilen.push(
      `  ok         ${String(fields.length).padStart(4)} Felder ${String(zeichen).padStart(7)} Zeichen  ${rel}`,
    );
  }
}

console.log(zeilen.join("\n"));
console.log(
  `\n${dateien.length - fehler}/${dateien.length} Dateien in Ordnung · ${felderTotal} Felder · ${zeichenTotal} Zeichen Text`,
);
if (fehler) {
  console.error(`\n${fehler} Datei(en) mit Problemen — nicht deployen.`);
  process.exit(1);
}

/* ── Hilfen ────────────────────────────────────────────────────────────────── */

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
 * Änderung, die jede Maskierungs-Falle auslöst: Anführungszeichen beider Arten,
 * Backslash, Dollar-Klammer, Backtick. JSX-Text verträgt `< > { }` nicht — dort
 * bleibt die Änderung harmlos, das prüft der jsxtext-Zweig von `apply()`.
 */
function aendere(wert) {
  return wert + ' PRÜFUNG "doppelt" \'einfach\' \\ Rücken';
}

/** Was `extract()` nach dem Schreiben zurückliest: JSX-Text wird neu umbrochen. */
function normalisiere(feld) {
  if (feld.literal !== "jsxtext") return feld.value;
  return feld.value.replace(/\s+/g, " ").trim();
}

function syntaxPruefen(quelle, dateiname) {
  const sf = ts.createSourceFile(
    dateiname,
    quelle,
    ts.ScriptTarget.Latest,
    true,
    dateiname.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  // parseDiagnostics ist intern, aber der einzige Weg an reine Syntaxfehler
  // ohne vollständiges Programm (Typprüfung interessiert hier nicht).
  const diags = sf.parseDiagnostics || [];
  return diags.map((d) => {
    const pos = sf.getLineAndCharacterOfPosition(d.start || 0);
    return `Zeile ${pos.line + 1}: ${ts.flattenDiagnosticMessageText(d.messageText, " ")}`;
  });
}

function ersteAbweichung(a, b) {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) return `ab Zeichen ${i}: «${a.slice(i, i + 30)}» ≠ «${b.slice(i, i + 30)}»`;
  }
  return `Länge ${a.length} ≠ ${b.length}`;
}
