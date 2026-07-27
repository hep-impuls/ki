/**
 * Erzeugt das Quellendokument: alle gesetzten Belege und alle begründeten
 * Nicht-Belege, je mit dem Textblock, auf den sie sich beziehen.
 *
 *   node docs/quellen-export.js   →   docs/quellen-lernseite-2.md
 *
 * Gedacht zum Weitergeben: Wer prüfen oder ergänzen will, sieht auf einen
 * Blick, welche Aussage womit belegt ist, wo bewusst nichts gesetzt wurde und
 * welche Angaben ein Standdatum tragen und darum altern.
 *
 * Quelle der Wahrheit bleibt `src/.../_data/belege.ts`; diese Datei wird nie
 * von Hand bearbeitet, sondern neu erzeugt.
 */
const fs = require("fs");
const path = require("path");

const REPO = path.resolve(__dirname, "..");
const INDEX = path.join(__dirname, "quellenauftrag-index.json");
const BELEGE_TS = path.join(REPO, "src/app/lernen/lernseite-2/_data/belege.ts");
const ZIEL = path.join(__dirname, "quellen-lernseite-2.md");

if (!fs.existsSync(INDEX)) {
  console.error("Index fehlt. Zuerst: node docs/quellenauftrag.js");
  process.exit(1);
}
const index = JSON.parse(fs.readFileSync(INDEX, "utf8"));
const src = fs.readFileSync(BELEGE_TS, "utf8");

const FELD = /\b([a-zA-Z]+):\s*("(?:[^"\\]|\\.)*")/g;
const felder = (block) => {
  const o = {};
  let m;
  FELD.lastIndex = 0;
  while ((m = FELD.exec(block))) o[m[1]] = JSON.parse(m[2]);
  return o;
};
const teil = (name) => {
  const i = src.indexOf("export const " + name);
  if (i < 0) return [];
  const ende = src.indexOf("\n];", i);
  return src
    .slice(i, ende < 0 ? undefined : ende)
    .split("\n  {")
    .slice(1)
    .map(felder);
};

const belege = teil("BELEGE").filter((b) => b.id && b.url);
const ohne = teil("OHNE_BELEG").filter((b) => b.id && b.grund);

/* Nach Datei/Thema gruppieren, damit das Dokument der Seite folgt. */
const THEMA = {
  "page.tsx": "Übersicht (Hub)",
  "vorhang-auf/page.tsx": "Thema 01 · Vorhang auf",
  "philosophische-perspektive/page.tsx": "Thema 02 · Philosophische Perspektive",
  "_components/VerunsicherungsEpochen.tsx": "Thema 02 · Die acht Epochen",
  "philosophische-perspektive/_components/Denkwege.tsx": "Thema 02 · Wege der Orientierung",
  "das-orakel/_components/OrakelDashboard.tsx": "Thema 03 · Das Orakel",
};
const themaVon = (id) => THEMA[index[id]?.datei] ?? "Ohne Zuordnung";

const gruppen = new Map();
for (const b of belege) {
  const t = themaVon(b.id);
  if (!gruppen.has(t)) gruppen.set(t, []);
  gruppen.get(t).push(b);
}

/* Standdatum-Angaben aufspüren: Texte, die ausdrücklich altern. */
const mitStand = Object.entries(index).filter(([, b]) => /\(Stand [^)]+\)/.test(b.text));

let md = `# Quellen · Lernseite 2 «Eine ganz neue Partnerschaft»

Alle Belege, die im Lernset an einer Textstelle hängen, und alle Stellen, an
denen bewusst **kein** Beleg gesetzt wurde.

**Was ein Eintrag bedeutet:** Die URL wurde abgerufen und die Aussage darin
kontrolliert. Nichts hier stammt aus dem Gedächtnis eines Modells. Jeder Beleg
gilt für einen **Wortlaut**, nicht für ein Thema: Die Kennung (z.B. \`VA-e3c2cd\`)
ist ein Hash des Textes. Ändert sich der Text, passt der Beleg nicht mehr, und
\`node docs/belege-pruefen.js\` meldet das.

**Neu erzeugen:** \`node docs/quellen-export.js\`

| | |
| --- | --- |
| Belege | ${belege.length} |
| Belegte Textblöcke | ${new Set(belege.map((b) => b.id)).size} |
| Begründete Nicht-Belege | ${ohne.length} |
| Aussagen mit Standdatum | ${mitStand.length} |

---

`;

for (const [thema, liste] of gruppen) {
  md += `## ${thema}\n`;
  for (const b of liste) {
    const block = index[b.id];
    md += `\n### ${block?.ort ?? "?"} · ${b.anker}\n\n`;
    md += `- **Kennung:** \`${b.id}\` (${block?.feld ?? "?"})\n`;
    md += `- **Quelle:** [${b.titel}](${b.url})\n`;
    if (b.stelle) md += `- **Fundstelle:** ${b.stelle}\n`;
    md += `- **Geprüft:** ${b.geprueft ?? "ohne Datum"}\n`;
    if (block) md += `\n> ${block.text}\n`;
  }
  md += `\n---\n\n`;
}

md += `## Bewusst ohne Beleg\n\nHier wurde gesucht und nichts Brauchbares gefunden. Das ist festgehalten, damit
niemand später aus Verlegenheit eine ungefähr passende Quelle einsetzt.\n`;
for (const o of ohne) {
  md += `\n### ${index[o.id]?.ort ?? o.id}\n\n`;
  md += `- **Kennung:** \`${o.id}\`${index[o.id] ? "" : "  ⚠ Kennung unbekannt, Text hat sich geändert"}\n`;
  md += `- **Betrifft:** ${o.betrifft ?? "—"}\n`;
  md += `- **Grund:** ${o.grund}\n`;
  md += `- **Notiert:** ${o.notiert ?? "ohne Datum"}\n`;
}

md += `\n---\n\n## Aussagen mit Standdatum\n\nDiese Stellen nennen ausdrücklich einen Stand und altern darum planmässig.
Beim nächsten Durchgang prüfen, ob die Angabe noch trägt.\n\n`;
for (const [id, b] of mitStand) {
  const stand = (b.text.match(/\(Stand [^)]+\)/) || [""])[0];
  md += `- \`${id}\` · ${b.ort} ${stand}\n`;
}

fs.writeFileSync(ZIEL, md, "utf8");
console.log(`Belege: ${belege.length} · Nicht-Belege: ${ohne.length} · Standdaten: ${mitStand.length}`);
console.log("Ziel:", ZIEL);
