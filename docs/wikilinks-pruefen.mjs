/**
 * Prüft alle verlinkten Wikipedia-Artikel auf zwei Fehler, die man im Browser
 * leicht übersieht, weil die Seite ja aufgeht:
 *
 *  1. **Existiert nicht** — der Titel ist erfunden oder falsch geschrieben.
 *  2. **Begriffsklärung** — der Link landet auf einer Auswahlliste statt im
 *     Artikel. Genau das war der Fall bei «Candide» (Roman, Musical, Oper);
 *     gemeint war «Candide oder der Optimismus». Ein 200er-Statuscode entlarvt
 *     das nicht, ein reiner Linkcheck also auch nicht.
 *
 * Zusätzlich werden Weiterleitungen gemeldet. Die sind harmlos, verraten aber,
 * wo der Artikel inzwischen anders heisst.
 *
 *     node docs/wikilinks-pruefen.mjs
 *
 * Gefunden werden sowohl die Kurzform `w("Titel")` als auch ganze URLs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WURZEL = path.join(REPO, "src");

/** Alle .ts/.tsx-Dateien unter src/ einsammeln. */
function dateien(ordner) {
  const raus = [];
  for (const e of fs.readdirSync(ordner, { withFileTypes: true })) {
    const p = path.join(ordner, e.name);
    if (e.isDirectory()) raus.push(...dateien(p));
    else if (/\.tsx?$/.test(e.name)) raus.push(p);
  }
  return raus;
}

/**
 * Viele Artikeltitel tragen selbst Klammern («Dunkle Jahrhunderte (Antike)»).
 * Beim Herausschneiden aus dem Quelltext darf man darum nicht einfach bei der
 * ersten `)` abbrechen — sonst meldet die Prüfung genau diese Titel als
 * nicht existierend. Stattdessen bis zum Anführungszeichen lesen und nur
 * überzählige Schlussklammern abschneiden.
 */
function saeubere(roh) {
  let s = roh;
  while (s.endsWith(")")) {
    const auf = (s.match(/\(/g) ?? []).length;
    const zu = (s.match(/\)/g) ?? []).length;
    if (zu <= auf) break;
    s = s.slice(0, -1);
  }
  return decodeURIComponent(s).replace(/_/g, " ");
}

const titel = new Set();
for (const d of dateien(WURZEL)) {
  const s = fs.readFileSync(d, "utf8");
  for (const m of s.matchAll(/\bw\("([^"]+)"\)/g)) titel.add(saeubere(m[1]));
  for (const m of s.matchAll(/de\.wikipedia\.org\/wiki\/([^"'\s]+)/g)) titel.add(saeubere(m[1]));
}
/* Die Definition des `w()`-Helfers enthält selbst eine Wikipedia-Adresse mit
   Platzhalter. Der ist kein Artikel. */
for (const t of titel) if (t.includes("${")) titel.delete(t);

const liste = [...titel].sort();
const fehlt = [];
const bkl = [];
const weiter = [];
let ok = 0;

for (let i = 0; i < liste.length; i += 40) {
  const teil = liste.slice(i, i + 40);
  const url =
    "https://de.wikipedia.org/w/api.php?action=query&format=json&redirects=1" +
    "&prop=pageprops&ppprop=disambiguation&titles=" +
    encodeURIComponent(teil.join("|"));
  const r = await fetch(url, {
    headers: { "user-agent": "ki-lernumgebung Linkpruefung (Bildungsprojekt)" },
  });
  if (!r.ok) {
    console.error(`API-Fehler ${r.status} — abgebrochen.`);
    process.exit(1);
  }
  const j = await r.json();
  for (const w of j.query?.redirects ?? []) weiter.push(`${w.from} → ${w.to}`);
  for (const p of Object.values(j.query?.pages ?? {})) {
    if (p.invalid !== undefined) fehlt.push(`${p.title ?? teil[0]} (ungültiger Titel)`);
    else if (p.missing !== undefined) fehlt.push(p.title);
    else if (p.pageprops && "disambiguation" in p.pageprops) bkl.push(p.title);
    else ok++;
  }
}

/* Weiterleitungen fassen zwei Titel zu einer Seite zusammen. Die Summe der
   geprüften Seiten liegt darum unter der Zahl der abgefragten Titel — das ist
   kein Verlust, muss aber sichtbar sein, sonst sieht es nach einem
   verschluckten Ergebnis aus. */
const geprueft = ok + fehlt.length + bkl.length;
console.log(
  `Abgefragt: ${liste.length} Titel · geprüfte Seiten: ${geprueft} ` +
    `(${liste.length - geprueft} durch Weiterleitung zusammengefallen) · in Ordnung: ${ok}`,
);
if (fehlt.length) console.log("\nEXISTIERT NICHT:\n  " + fehlt.join("\n  "));
if (bkl.length)
  console.log("\nBEGRIFFSKLÄRUNG — der Link führt auf eine Liste:\n  " + bkl.join("\n  "));
if (weiter.length) console.log("\nWeiterleitungen (harmlos):\n  " + weiter.join("\n  "));
if (fehlt.length || bkl.length) process.exitCode = 1;
