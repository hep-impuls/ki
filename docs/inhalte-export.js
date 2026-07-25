/**
 * Exportiert alle Inhalte von Lernseite 2 als Markdown, strukturiert nach
 * Abschnittstiteln. Liest die TSX-Dateien und sammelt positionsgeordnet:
 *  · JSX-Überschriften und -Fliesstexte (Einstiege, Aufgaben, Vorschauen)
 *  · Datenfelder der Inhalts-Arrays (Stationen, Punkte, Epochen, Bereiche)
 * Läuft lokal; nichts davon muss durch den Modell-Kontext.
 */
const fs = require("fs");
const path = require("path");
const REPO = path.resolve(__dirname, "..");
const BASE = path.join(REPO, "src/app/lernen/lernseite-2") + "/";

/* ── Konfiguration: welche Dateien, in welcher Reihenfolge, mit welchem Titel ── */
const DATEIEN = [
  { pfad: "page.tsx", thema: "Übersicht: Eine ganz neue Partnerschaft (Hub)" },
  { pfad: "vorhang-auf/page.tsx", thema: "Thema 01 · Vorhang auf" },
  { pfad: "philosophische-perspektive/page.tsx", thema: "Thema 02 · Philosophische Perspektive" },
  { pfad: "_components/VerunsicherungsEpochen.tsx", thema: "Thema 02 · Bausteine: Philosophie in Zeiten der Verunsicherung (8 Epochen)" },
  { pfad: "philosophische-perspektive/_components/Denkwege.tsx", thema: "Thema 02 · Bausteine: Wege der Orientierung (4 Bereiche)" },
  { pfad: "das-orakel/page.tsx", thema: "Thema 03 · Das Orakel" },
  { pfad: "das-orakel/_components/OrakelDashboard.tsx", thema: "Thema 03 · Bausteine: Orakel-Dashboard" },
  { pfad: "_components/Glossar.tsx", thema: "Glossar (Hover-Erklärungen)", modus: "glossar" },
  { pfad: "../../../config/unit.ts", thema: "Modul-Konfiguration (Titel, Untertitel, Beschreibungen)" },
];

/* ── Feld-Klassifikation ──────────────────────────────────────────────────── */
const H_EINTRAG = new Set(["titel", "title", "epoche", "name"]); // → #### Eintrag
const META = ["jahr", "span", "leben", "kurz", "these", "leitfrage", "credit", "quelle", "alt", "werk", "slug"];
const TEXTE = [
  "lead", "leadMehr", "intro", "text", "mehr", "geschichte", "beispiel", "ki",
  "verunsicherung", "hintergrund", "einordnung", "caption", "contextNote",
  "info", "hilft", "erklaerung", "frage", "wort", "subtitle", "description",
  "beschreibung", "unterzeile",
];
const LABELS = {
  leadMehr: "Mehr wissen", mehr: "Mehr lesen", ki: "KI-Bezug",
  verunsicherung: "Verunsicherungs-Stopp", contextNote: "Im Kontext der Zeit",
  hintergrund: "Hintergrund zum Bild", einordnung: "Kontext & Einordnung",
  caption: "Bildunterschrift", credit: "Bildquelle", quelle: "Quelle",
  alt: "Bildbeschreibung", info: "Zur Philosophie", hilft: "Was dir das jetzt hilft",
  these: "These", leitfrage: "Leitfrage", werk: "Werke", erklaerung: "Erklärung",
  geschichte: "Geschichte", beispiel: "Beispiel", lead: "Einleitung",
  intro: "Einleitung", frage: "Bewertungsfrage", text: "Text",
  subtitle: "Untertitel", description: "Beschreibung", beschreibung: "Beschreibung",
  unterzeile: "Unterzeile", kurz: "Kurzlabel im Gewebe", jahr: "Jahr",
  span: "Zeitraum", leben: "Lebensdaten", slug: "Kennung", title: "Bildstelle",
};
const NUR_KEYS = new Set([...H_EINTRAG, ...META, ...TEXTE]);
const SUB_OBJ = { technologie: "Technologische Errungenschaft", verunsicherung: "Verunsicherung der Gesellschaft", philosophie: "Antwort der Philosophie" };

/* ── Hilfsfunktionen ──────────────────────────────────────────────────────── */
function entstringe(lit) {
  try {
    return JSON.parse(lit);
  } catch {
    return lit.slice(1, -1);
  }
}
function jsxText(roh) {
  return roh
    .replace(/\{"\s*"\}|\{" "\}/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\{[^{}]*\}/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function istSatz(s) {
  return s.length > 30 && /[a-zäöü]/.test(s) && s.includes(" ");
}

/* ── Extraktion je Datei ──────────────────────────────────────────────────── */
function extrahiere(src) {
  const funde = [];

  // 1) Datenfelder: key: "string"
  const kvRe = /\b([a-zA-Z]+):\s*("(?:[^"\\]|\\.)*")/g;
  let m;
  while ((m = kvRe.exec(src))) {
    const key = m[1];
    if (!NUR_KEYS.has(key)) continue;
    const wert = entstringe(m[2]);
    if (!wert || wert.length < 2) continue;
    funde.push({
      pos: m.index,
      art: key === "epoche" ? "abschnitt" : H_EINTRAG.has(key) ? "eintrag" : META.includes(key) ? "meta" : "text",
      key,
      wert,
    });
  }

  // 2) Unter-Objekte der Epochen (technologie/verunsicherung/philosophie: {)
  const subRe = /\b(technologie|verunsicherung|philosophie):\s*\{/g;
  while ((m = subRe.exec(src))) {
    funde.push({ pos: m.index, art: "sub", key: m[1], wert: SUB_OBJ[m[1]] });
  }

  // 3) String-Arrays (absaetze) als Absatzfolge
  const arrRe = /\b(absaetze):\s*\[/g;
  while ((m = arrRe.exec(src))) {
    const start = m.index + m[0].length;
    let tiefe = 1, i = start;
    while (i < src.length && tiefe > 0) {
      if (src[i] === "[") tiefe++;
      else if (src[i] === "]") tiefe--;
      i++;
    }
    const block = src.slice(start, i - 1);
    const strRe = /"((?:[^"\\]|\\.)*)"/g;
    let s, n = 0;
    while ((s = strRe.exec(block))) {
      funde.push({ pos: m.index + n++, art: "absatz", key: "absaetze", wert: entstringe('"' + s[1] + '"') });
    }
  }

  // 4) JSX-Überschriften-Props (Abschnitt, Ausklapptext, VideoImpuls …)
  const propRe = /\b(titel)="((?:[^"\\]|\\.)*)"/g;
  while ((m = propRe.exec(src))) {
    const wert = m[2];
    funde.push({
      pos: m.index,
      art: /^Mehr dazu/.test(wert) ? "ausklapp" : "abschnitt",
      key: "titel",
      wert,
    });
  }

  // 5) JSX-Überschriften-Tags
  const hRe = /<h([123])\b[^>]*>([\s\S]*?)<\/h\1>/g;
  while ((m = hRe.exec(src))) {
    const t = jsxText(m[2]);
    // Kleinbuchstabe am Anfang = Rest eines Template-Ausdrucks (z.B. «…e Deutung»)
    if (t.length > 2 && !/^[a-zäöü]/.test(t))
      funde.push({ pos: m.index, art: m[1] === "1" ? "thema" : "abschnitt", key: "h", wert: t });
  }

  // 5b) Inhalts-Arrays am Dateianfang (vor dem JSX) benennen
  const constRe = /^const ([A-Z][A-Z_0-9]*)\s*(?::[^=]+)?=\s*\[/gm;
  const CONST_TITEL = {
    BILDER_STORY: "Bilderstrecke «Bilder zur KI-Geschichte» (Daten)",
    EPOCHEN: "Die acht Epochen (Daten)",
    BEREICHE: "Die Bereiche (Daten)",
  };
  while ((m = constRe.exec(src))) {
    const titel = CONST_TITEL[m[1]];
    if (titel) funde.push({ pos: m.index, art: "abschnitt", key: "const", wert: titel });
  }

  // 6) JSX-Fliesstexte (<p>) und Aufgaben
  const pRe = /<p\b[^>]*>([\s\S]*?)<\/p>/g;
  while ((m = pRe.exec(src))) {
    const t = jsxText(m[1]);
    if (istSatz(t)) funde.push({ pos: m.index, art: "prosa", key: "p", wert: t });
  }
  const aufRe = /<Aufgabe\b[^>]*>([\s\S]*?)<\/Aufgabe>/g;
  while ((m = aufRe.exec(src))) {
    const t = jsxText(m[1]);
    if (t.length > 10) funde.push({ pos: m.index, art: "aufgabe", key: "aufgabe", wert: t });
  }

  funde.sort((a, b) => a.pos - b.pos);
  // Duplikate (gleiche Position/Wert) entfernen
  const raus = [];
  const gesehen = new Set();
  for (const f of funde) {
    const k = f.art + "|" + f.wert;
    if (gesehen.has(k)) continue;
    gesehen.add(k);
    raus.push(f);
  }
  return raus;
}

/* ── Markdown bauen ───────────────────────────────────────────────────────── */
let md =
  `# Lernumgebung zu KI · Lernseite 2 «Eine ganz neue Partnerschaft»\n\n` +
  `Alle Inhalte dieses Lernsets, aus dem Code extrahiert und nach Abschnittstiteln\n` +
  `geordnet. Gedacht zum Lesen, Korrigieren und Absprechen, nicht zum Bearbeiten:\n` +
  `Die Quelle bleibt der Code.\n\n` +
  `**Neu erzeugen:** \`node docs/inhalte-export.js\` (schreibt diese Datei neu).\n\n` +
  `**Lesehilfe:** \`##\` Thema oder Bausteindatei, \`###\` Abschnitt, \`####\` einzelner\n` +
  `Inhaltspunkt. «Text» ist die Kurzinfo auf der Karte, «Mehr lesen» die\n` +
  `Vertiefung dahinter.\n`;
let statistik = [];

for (const d of DATEIEN) {
  const pfad = BASE + d.pfad;
  if (!fs.existsSync(pfad)) {
    statistik.push(`${d.pfad}: FEHLT`);
    continue;
  }
  const src = fs.readFileSync(pfad, "utf8");
  md += `\n---\n\n## ${d.thema}\n\n*Quelle: \`${d.pfad}\`*\n`;

  // Glossar: jeder Eintrag ist «Begriff: "Erklärung"» — eigene Behandlung.
  if (d.modus === "glossar") {
    const gRe = /^\s{2}(?:"([^"]+)"|([A-Za-zÄÖÜäöüß0-9\-.'_]+)):\s*\n?\s*"((?:[^"\\]|\\.)*)"/gm;
    let g, anzahl = 0;
    md += "\n| Begriff | Erklärung |\n| --- | --- |\n";
    while ((g = gRe.exec(src))) {
      const begriff = g[1] || g[2];
      const erkl = entstringe('"' + g[3] + '"').replace(/\|/g, "\\|");
      md += `| **${begriff}** | ${erkl} |\n`;
      anzahl++;
    }
    statistik.push(`${d.pfad}: ${anzahl} Glossar-Einträge`);
    continue;
  }

  const funde = extrahiere(src);
  let n = 0;
  for (const f of funde) {
    n++;
    switch (f.art) {
      case "thema":
      case "abschnitt":
        md += `\n### ${f.wert}\n`;
        break;
      case "ausklapp":
        md += `\n#### ${f.wert}\n`;
        break;
      case "eintrag":
        md += `\n#### ${f.wert}\n`;
        break;
      case "sub":
        md += `\n**${f.wert}**\n`;
        break;
      case "meta":
        md += `\n- *${LABELS[f.key] ?? f.key}:* ${f.wert}\n`;
        break;
      case "aufgabe":
        md += `\n> **Aufgabe:** ${f.wert}\n`;
        break;
      case "prosa":
      case "absatz":
        md += `\n${f.wert}\n`;
        break;
      case "text":
        md += `\n**${LABELS[f.key] ?? f.key}:** ${f.wert}\n`;
        break;
    }
  }
  statistik.push(`${d.pfad}: ${n} Blöcke`);
}

const ZIEL = path.join(__dirname, "inhalte-lernseite-2.md");
fs.writeFileSync(ZIEL, md, "utf8");
console.log(statistik.join("\n"));
console.log("\nZiel:", ZIEL);
console.log("Zeichen:", md.length, "| Zeilen:", md.split("\n").length);
