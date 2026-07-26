/**
 * Prüft die gesetzten Belege gegen den aktuellen Text.
 *
 *   node docs/belege-pruefen.js
 *
 * Drei Fragen, die alle stimmen müssen, damit ein Beleg im Lernset erscheint:
 *
 *  1. **Kennung gültig?** Steht sie im Quellenauftrag-Index? Die Kennung ist ein
 *     Hash des Textes. Ändert sich der Text, passt sie nicht mehr, und der
 *     Beleg gilt für einen Wortlaut, den es nicht mehr gibt.
 *  2. **Anker im Text?** Der Link hängt an einer wörtlichen Stelle. Fehlt sie,
 *     wird stillschweigend nichts gerendert; genau das soll hier auffallen.
 *  3. **Erreichbar?** Mit `--links` wird jede URL abgerufen.
 *
 * Auch die begründeten Nicht-Belege werden geprüft: Ihre Kennung muss ebenfalls
 * gültig sein, sonst bezieht sich die Begründung auf einen alten Text.
 */
const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const INDEX = path.join(__dirname, "quellenauftrag-index.json");
const BELEGE_TS = path.join(REPO, "src/app/lernen/lernseite-2/_data/belege.ts");

if (!fs.existsSync(INDEX)) {
  console.error("Index fehlt. Zuerst: node docs/quellenauftrag.js");
  process.exit(1);
}
const index = JSON.parse(fs.readFileSync(INDEX, "utf8"));
const src = fs.readFileSync(BELEGE_TS, "utf8");

const FELD = /\b([a-zA-Z]+):\s*("(?:[^"\\]|\\.)*")/g;
function felder(block) {
  const o = {};
  let m;
  FELD.lastIndex = 0;
  while ((m = FELD.exec(block))) o[m[1]] = JSON.parse(m[2]);
  return o;
}
function teil(name) {
  const i = src.indexOf("export const " + name);
  if (i < 0) return [];
  const ende = src.indexOf("\n];", i);
  return src
    .slice(i, ende < 0 ? undefined : ende)
    .split("\n  {")
    .slice(1)
    .map(felder);
}

const belege = teil("BELEGE").filter((b) => b.id && b.url);
const ohne = teil("OHNE_BELEG").filter((b) => b.id && b.grund);

const fehler = [];
const warnung = [];

for (const b of belege) {
  const block = index[b.id];
  if (!block) {
    fehler.push(`${b.id}: Kennung unbekannt. Text geändert? Beleg «${b.anker}» prüfen.`);
    continue;
  }
  if (!b.anker) {
    fehler.push(`${b.id}: kein Anker gesetzt.`);
    continue;
  }
  if (!block.text.includes(b.anker)) {
    fehler.push(
      `${b.id}: Anker «${b.anker}» kommt im Text nicht vor, der Link erscheint nicht.\n` +
        `        Text beginnt: ${block.text.slice(0, 90)}…`,
    );
    continue;
  }
  if (!b.geprueft) warnung.push(`${b.id}: kein Prüfdatum.`);
  if (!b.stelle) warnung.push(`${b.id}: keine Fundstelle in der Quelle angegeben.`);
}

for (const o of ohne) {
  if (!index[o.id]) {
    warnung.push(`${o.id} (Nicht-Beleg): Kennung unbekannt, Begründung betrifft alten Text.`);
  }
}

/* Mehrere Belege am gleichen Anker im gleichen Block gewinnen einander weg. */
const gesehen = new Set();
for (const b of belege) {
  const k = b.id + "|" + b.anker;
  if (gesehen.has(k)) fehler.push(`${b.id}: Anker «${b.anker}» doppelt vergeben.`);
  gesehen.add(k);
}

console.log(`Belege: ${belege.length} · begründete Nicht-Belege: ${ohne.length}`);
const nachBlock = new Map();
for (const b of belege) nachBlock.set(b.id, (nachBlock.get(b.id) ?? 0) + 1);
console.log(`Belegte Textblöcke: ${nachBlock.size}`);
console.log();

if (fehler.length) {
  console.log("FEHLER:");
  fehler.forEach((f) => console.log("  " + f));
} else {
  console.log("Alle Kennungen gültig, alle Anker im Text gefunden.");
}
if (warnung.length) {
  console.log("\nHinweise:");
  warnung.forEach((w) => console.log("  " + w));
}

/* Optional: URLs abrufen. Modelle erfinden Links, darum nie ungeprüft glauben. */
if (process.argv.includes("--links")) {
  (async () => {
    console.log("\nURLs abrufen …");
    for (const b of belege) {
      try {
        const res = await fetch(b.url, {
          redirect: "follow",
          headers: { "user-agent": "ki-lernumgebung Belegpruefung" },
          signal: AbortSignal.timeout(20000),
        });
        console.log(`  ${res.ok ? "ok  " : "FEHL"} ${res.status}  ${b.id}  ${b.url.slice(0, 70)}`);
      } catch (err) {
        console.log(`  FEHL  --   ${b.id}  ${String(err.message || err).slice(0, 50)}`);
      }
    }
  })();
} else {
  console.log("\n(URLs nicht abgerufen. Mit --links prüfen.)");
  if (fehler.length) process.exitCode = 1;
}
