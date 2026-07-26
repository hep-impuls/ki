/**
 * Erzeugt den «Quellenauftrag»: alle belegfähigen Textblöcke von Lernseite 2,
 * je mit einer stabilen Kennung, zum Weitergeben an ein Recherche-Modell
 * (Gemini o.ä.). Das Modell trägt Quellen nach; die Kennung erlaubt es,
 * die Antwort maschinell wieder der richtigen Stelle im Code zuzuordnen.
 *
 *   node docs/quellenauftrag.js
 *     → docs/quellenauftrag-lernseite-2.md   (das Dokument fürs Modell)
 *     → docs/quellenauftrag-index.json       (Kennung → Datei + Textstelle)
 *
 * Die Kennung ist KEINE Position, sondern ein Hash des Textes selbst
 * (z.B. «VA-a1b2c3»). Sie bleibt darum stabil, wenn woanders etwas
 * eingefügt wird, und ändert sich genau dann, wenn der Text sich ändert.
 * Ändert er sich, gilt der Beleg als veraltet — das ist gewollt.
 *
 * Aufgenommen werden nur Blöcke, die überhaupt etwas behaupten: Fliesstexte,
 * Kartentexte, Vertiefungen, Hintergründe. Draussen bleiben
 * Bildbeschreibungen, Bildnachweise, Kurzlabels, Thesen und Aufgaben, denn
 * dort gibt es nichts zu belegen.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const REPO = path.resolve(__dirname, "..");
const BASE = path.join(REPO, "src/app/lernen/lernseite-2") + "/";

/* ── Welche Dateien, mit welchem Kennungs-Präfix ──────────────────────────── */
const DATEIEN = [
  { pfad: "page.tsx", praefix: "HUB", thema: "Übersicht (Hub)" },
  { pfad: "vorhang-auf/page.tsx", praefix: "VA", thema: "Thema 01 · Vorhang auf" },
  { pfad: "philosophische-perspektive/page.tsx", praefix: "PP", thema: "Thema 02 · Philosophische Perspektive" },
  { pfad: "_components/VerunsicherungsEpochen.tsx", praefix: "EP", thema: "Thema 02 · Die acht Epochen" },
  { pfad: "philosophische-perspektive/_components/Denkwege.tsx", praefix: "DW", thema: "Thema 02 · Wege der Orientierung" },
  { pfad: "das-orakel/_components/OrakelDashboard.tsx", praefix: "OR", thema: "Thema 03 · Das Orakel" },
];

/* ── Belegfähige Felder. Alles andere behauptet nichts. ───────────────────── */
const FELDER = {
  text: "Kartentext",
  mehr: "Vertiefung «Mehr lesen»",
  geschichte: "Bildgeschichte",
  info: "Zur Philosophie",
  lead: "Einleitung",
  leadMehr: "Einleitung, Vertiefung",
  verunsicherung: "Verunsicherungs-Stopp",
  hintergrund: "Hintergrund zum Bild",
  einordnung: "Kontext und Einordnung",
  contextNote: "Im Kontext der Zeit",
  hilft: "Was dir das jetzt hilft",
};
/** Kürzer als das lohnt keine Quellensuche. */
const MIN_LAENGE = 90;

/* ── Hilfsfunktionen ──────────────────────────────────────────────────────── */
function entstringe(lit) {
  try {
    return JSON.parse(lit);
  } catch {
    return lit.slice(1, -1);
  }
}
function jsxText(roh) {
  let t = roh
    .replace(/\{"\s*"\}|\{" "\}/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/<(?:DenkerHover|Begriff)\b[^>]*?\b(?:name|wort)="((?:[^"\\]|\\.)*)"[^>]*?\/?>/g, "$1")
    .replace(/<GlossarText\b[^>]*?\btext="((?:[^"\\]|\\.)*)"[^>]*?\/?>/g, "$1")
    .replace(/\{\s*"((?:[^"\\]|\\.)*)"\s*\}/g, "$1");
  for (let i = 0; i < 6 && /\{[^{}]*\}/.test(t); i++) t = t.replace(/\{[^{}]*\}/g, " [AUSDRUCK] ");
  return t
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .replace(/(\[AUSDRUCK\]\s*)+/g, "[…] ")
    .replace(/\s+([.,;:!?])/g, "$1")
    .trim();
}
function istCode(s) {
  return (
    /\$\{|`|=>|\(\)|\)\}|^\s*[)\]}]/.test(s) ||
    /^(set|use|handle|on)[A-Z]/.test(s) ||
    /^[a-zA-Z_$][\w$]*\(/.test(s)
  );
}
/** Inhaltsadressierte Kennung: gleicher Text → gleiche Kennung, immer. */
function kennung(praefix, text) {
  const h = crypto.createHash("sha1").update(text, "utf8").digest("hex");
  return `${praefix}-${h.slice(0, 6)}`;
}

/* ── Blöcke je Datei sammeln, mit Überschrift als Ortsangabe ─────────────── */
function sammle(src, praefix) {
  const rohe = [];

  // Überschriften mitführen, damit jeder Block einen Ort bekommt.
  const marken = [];
  let m;
  const hRe = /<h([123])\b[^>]*>([\s\S]*?)<\/h\1>/g;
  // Eine Überschrift taugt nur als Ortsangabe, wenn sie echte Wörter enthält;
  // rein dynamische Titel werden zu «[…]» und wären als Wegweiser wertlos.
  const brauchbar = (t) => t.length > 2 && /[A-Za-zÄÖÜäöü]{3}/.test(t.replace(/\[…\]/g, ""));
  while ((m = hRe.exec(src))) {
    const t = jsxText(m[2]);
    if (brauchbar(t) && !/^[a-zäöü]/.test(t)) marken.push({ pos: m.index, ort: t });
  }
  const titelRe = /\b(?:titel|epoche)(?:=|:\s*)"((?:[^"\\]|\\.)*)"/g;
  while ((m = titelRe.exec(src))) {
    if (brauchbar(m[1])) marken.push({ pos: m.index, ort: m[1] });
  }
  marken.sort((a, b) => a.pos - b.pos);
  const ortBei = (pos) => {
    let ort = "(ohne Abschnitt)";
    for (const k of marken) {
      if (k.pos > pos) break;
      ort = k.ort;
    }
    return ort;
  };

  // Datenfelder
  const kvRe = /\b([a-zA-Z]+):\s*("(?:[^"\\]|\\.)*")/g;
  while ((m = kvRe.exec(src))) {
    if (!FELDER[m[1]]) continue;
    const wert = entstringe(m[2]);
    if (wert.length < MIN_LAENGE || istCode(wert)) continue;
    rohe.push({ pos: m.index, feld: FELDER[m[1]], text: wert });
  }

  // absaetze-Arrays (Denkwege-Fliesstexte)
  const arrRe = /\b(absaetze):\s*\[/g;
  while ((m = arrRe.exec(src))) {
    const start = m.index + m[0].length;
    let tiefe = 1, i = start;
    while (i < src.length && tiefe > 0) {
      if (src[i] === "[") tiefe++;
      else if (src[i] === "]") tiefe--;
      i++;
    }
    const strRe = /"((?:[^"\\]|\\.)*)"/g;
    let s;
    while ((s = strRe.exec(src.slice(start, i - 1)))) {
      const wert = entstringe('"' + s[1] + '"');
      if (wert.length < MIN_LAENGE || istCode(wert)) continue;
      rohe.push({ pos: m.index, feld: "Fliesstext", text: wert });
    }
  }

  // JSX-Fliesstexte
  const pRe = /<p\b[^>]*>([\s\S]*?)<\/p>/g;
  while ((m = pRe.exec(src))) {
    const t = jsxText(m[1]);
    if (t.length < MIN_LAENGE || istCode(t)) continue;
    rohe.push({ pos: m.index, feld: "Fliesstext", text: t });
  }

  rohe.sort((a, b) => a.pos - b.pos);

  const raus = [];
  const gesehen = new Set();
  for (const r of rohe) {
    const id = kennung(praefix, r.text);
    if (gesehen.has(id)) continue; // gleicher Text zweimal → eine Kennung
    gesehen.add(id);
    raus.push({ id, ort: ortBei(r.pos), feld: r.feld, text: r.text });
  }
  return raus;
}

/* ── Dokument bauen ───────────────────────────────────────────────────────── */
const ANLEITUNG = `# Quellenauftrag · Lernseite 2 «Eine ganz neue Partnerschaft»

Dieses Dokument enthält alle belegfähigen Textblöcke eines Lernsets zu
Künstlicher Intelligenz und Philosophie (Berufsfachschule, Deutschschweiz).
Jeder Block hat eine **Kennung** in eckigen Klammern, z.B. \`[VA-a1b2c3]\`.

## Auftrag

Suche zu den Blöcken **überprüfbare Quellen**. Wichtig ist nicht Vollständigkeit,
sondern Nützlichkeit: Gesucht sind Belege für Blöcke, die **zu allgemein**
bleiben und durch eine konkrete Angabe (Zahl, Datum, Name, Studie, Fallbeispiel)
gewinnen würden.

## Regeln

1. **Nichts erfinden.** Wenn du keine Quelle kennst, die du wirklich gelesen
   hast, lass den Block weg. Eine erfundene URL ist schlimmer als keine.
   Jede URL wird nachträglich maschinell abgerufen und geprüft.
2. **Bevorzugt deutschsprachig und frei zugänglich.** Wikipedia, Behörden
   (Schweiz: BFS, EDÖB, IGE; EU-Kommission), Statistikämter, öffentliche
   Medien, Universitäten, Museen. Fachaufsätze nur, wenn es nichts
   Zugänglicheres gibt.
3. **Ein Beleg pro Zeile.** Mehrere Belege zum gleichen Block: mehrere Zeilen
   mit derselben Kennung.
4. **Sag, was fehlt.** Wenn ein Block dir zu allgemein erscheinst und du eine
   konkrete Angabe gefunden hast, die ihn schärfen würde, gehört sie in die
   Spalte «Konkretisierung».

## Rückgabeformat (bitte genau so)

Eine einzige Markdown-Tabelle, keine Prosa davor oder danach:

\`\`\`
| Kennung | URL | Titel der Quelle | Stützt welche Aussage | Konkretisierung |
| --- | --- | --- | --- | --- |
| VA-a1b2c3 | https://… | CERN: The birth of the Web | Freigabe der Web-Software 1993 | statt «Anfang der 90er»: 30. April 1993 |
\`\`\`

Spalte «Konkretisierung» leer lassen, wenn der Block schon präzise genug ist
und die Quelle ihn nur bestätigt.

---

`;

let md = ANLEITUNG;
const index = {};
const statistik = [];
let gesamt = 0;

for (const d of DATEIEN) {
  const pfad = BASE + d.pfad;
  if (!fs.existsSync(pfad)) {
    statistik.push(`${d.pfad}: FEHLT`);
    continue;
  }
  const bloecke = sammle(fs.readFileSync(pfad, "utf8"), d.praefix);
  md += `\n## ${d.thema}\n`;
  let letzterOrt = null;
  for (const b of bloecke) {
    if (b.ort !== letzterOrt) {
      md += `\n### ${b.ort}\n`;
      letzterOrt = b.ort;
    }
    md += `\n**[${b.id}]** *(${b.feld})*\n${b.text}\n`;
    index[b.id] = { datei: d.pfad, ort: b.ort, feld: b.feld, text: b.text };
  }
  statistik.push(`${d.pfad}: ${bloecke.length} Blöcke`);
  gesamt += bloecke.length;
}

const ZIEL_MD = path.join(__dirname, "quellenauftrag-lernseite-2.md");
const ZIEL_IX = path.join(__dirname, "quellenauftrag-index.json");
fs.writeFileSync(ZIEL_MD, md, "utf8");
fs.writeFileSync(ZIEL_IX, JSON.stringify(index, null, 1), "utf8");

console.log(statistik.join("\n"));
console.log(`\nBlöcke gesamt: ${gesamt}`);
console.log("Dokument:", ZIEL_MD);
console.log("Index:   ", ZIEL_IX);
console.log(`Zeichen: ${md.length} (~${Math.round(md.length / 4000) / 1} k Tokens grob)`);

/* Selbstprüfung: doppelte Kennungen über Dateien hinweg wären fatal. */
const ids = Object.keys(index);
const doppelt = ids.length !== new Set(ids).size;
console.log("Kennungen eindeutig:", doppelt ? "NEIN" : "ja");
const leer = ids.filter((k) => !index[k].text || index[k].text.length < MIN_LAENGE);
if (leer.length) console.log("Zu kurze Blöcke durchgerutscht:", leer.length);
