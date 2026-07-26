/**
 * Prüft die Antwort eines Recherche-Modells auf den Quellenauftrag.
 *
 *   node docs/quellen-pruefen.js <antwort.md>
 *     → docs/quellenbericht.md
 *
 * Recherche-Modelle erfinden URLs, die plausibel aussehen und ins Leere führen.
 * Genau eine solche Falle hat dieses Projekt schon getroffen (eine bpb-Seite,
 * die es nie gab). Darum wird hier JEDE gemeldete Quelle geprüft, bevor sie
 * irgendwo in den Code darf:
 *
 *   1. Ist die Kennung echt, also im Quellenauftrag vergeben?
 *   2. Passt sie noch zum aktuellen Text? (Kennung = Hash des Textes; ändert
 *      sich der Text, ist der Beleg veraltet.)
 *   3. Antwortet die URL überhaupt, und mit welchem Status?
 *   4. Kommen die Stichwörter der gestützten Aussage auf der Seite vor?
 *
 * Punkt 4 ist ein grober Hinweis, kein Beweis: Er findet Seiten, die nichts mit
 * der Behauptung zu tun haben, kann aber nicht beurteilen, ob eine Seite eine
 * Aussage tatsächlich stützt. Das bleibt Handarbeit; das Skript sortiert nur
 * die Kandidaten vor.
 *
 * Erwartetes Eingabeformat (Markdown-Tabelle):
 *   | Kennung | URL | Titel der Quelle | Stützt welche Aussage | Konkretisierung |
 */
const fs = require("fs");
const path = require("path");

const INDEX = path.join(__dirname, "quellenauftrag-index.json");
const ZIEL = path.join(__dirname, "quellenbericht.md");
const ANTWORT = process.argv[2];

if (!ANTWORT) {
  console.error("Aufruf: node docs/quellen-pruefen.js <antwort.md>");
  process.exit(1);
}
if (!fs.existsSync(INDEX)) {
  console.error("Index fehlt. Zuerst: node docs/quellenauftrag.js");
  process.exit(1);
}

const index = JSON.parse(fs.readFileSync(INDEX, "utf8"));

/* ── Tabelle einlesen ─────────────────────────────────────────────────────── */
function leseTabelle(text) {
  const zeilen = [];
  for (const roh of text.split("\n")) {
    const z = roh.trim();
    if (!z.startsWith("|")) continue;
    const felder = z.split("|").slice(1, -1).map((f) => f.trim());
    if (felder.length < 2) continue;
    if (/^-{2,}$/.test(felder[0].replace(/\s/g, ""))) continue; // Trennzeile
    if (/^kennung$/i.test(felder[0])) continue; // Kopfzeile
    const [kennung, url, titel = "", stuetzt = "", konkret = ""] = felder;
    // URL aus Markdown-Link herausschälen, falls das Modell einen baut.
    const m = url.match(/\((https?:\/\/[^\s)]+)\)/) || url.match(/(https?:\/\/\S+)/);
    zeilen.push({ kennung, url: m ? m[1] : url, titel, stuetzt, konkret });
  }
  return zeilen;
}

/** Inhaltswörter der gestützten Aussage, für die Stichwortprobe. */
function stichwoerter(s) {
  const stopp = new Set([
    "der","die","das","und","oder","dass","ist","sind","war","waren","ein","eine",
    "einen","einem","eines","dem","den","des","mit","von","für","auf","bei","als",
    "nicht","aus","zum","zur","auch","wird","werden","hat","haben","sich","nach",
    "über","durch","aber","kann","wie","was","dies","diese","dieser","noch","nur",
  ]);
  return [...new Set(
    s.toLowerCase()
      .replace(/[^\wäöüß\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 5 && !stopp.has(w)),
  )].slice(0, 6);
}

async function hole(url) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "ki-lernumgebung Quellenpruefung" },
      signal: AbortSignal.timeout(20000),
    });
    const typ = res.headers.get("content-type") || "";
    let text = "";
    if (res.ok && /text\/html|text\/plain|application\/json/.test(typ)) {
      text = (await res.text()).slice(0, 400000);
    }
    return { status: res.status, ok: res.ok, endUrl: res.url, typ, text };
  } catch (err) {
    return { status: 0, ok: false, fehler: String(err.message || err), text: "" };
  }
}

/* ── Hauptlauf ────────────────────────────────────────────────────────────── */
(async () => {
  const eintraege = leseTabelle(fs.readFileSync(ANTWORT, "utf8"));
  if (!eintraege.length) {
    console.error("Keine Tabellenzeilen erkannt. Format prüfen.");
    process.exit(1);
  }
  console.log(`${eintraege.length} gemeldete Belege, prüfe …\n`);

  const ergebnisse = [];
  // Höflich der Reihe nach, nicht alles gleichzeitig gegen fremde Server.
  for (const [i, e] of eintraege.entries()) {
    const bekannt = Object.prototype.hasOwnProperty.call(index, e.kennung);
    const res = await hole(e.url);
    const woerter = stichwoerter(e.stuetzt || e.titel);
    const gefunden = res.text
      ? woerter.filter((w) => res.text.toLowerCase().includes(w))
      : [];
    let urteil;
    if (!bekannt) urteil = "KENNUNG UNBEKANNT";
    else if (!res.ok) urteil = res.status ? `NICHT ERREICHBAR (${res.status})` : "NICHT ERREICHBAR";
    else if (!res.text) urteil = "erreichbar, nicht lesbar";
    else if (woerter.length && gefunden.length === 0) urteil = "PASST VERMUTLICH NICHT";
    else urteil = "zu prüfen";
    ergebnisse.push({ ...e, bekannt, res, woerter, gefunden, urteil });
    process.stdout.write(
      `  ${String(i + 1).padStart(3)}/${eintraege.length}  ${e.kennung.padEnd(12)} ${urteil}\n`,
    );
  }

  /* ── Bericht ─────────────────────────────────────────────────────────────── */
  const rang = { "KENNUNG UNBEKANNT": 0, "NICHT ERREICHBAR": 1, "PASST VERMUTLICH NICHT": 2 };
  const wert = (u) => (u.startsWith("NICHT ERREICHBAR") ? 1 : rang[u] ?? 9);
  ergebnisse.sort((a, b) => wert(a.urteil) - wert(b.urteil));

  const zaehler = {};
  for (const r of ergebnisse) {
    const k = r.urteil.startsWith("NICHT ERREICHBAR") ? "NICHT ERREICHBAR" : r.urteil;
    zaehler[k] = (zaehler[k] ?? 0) + 1;
  }

  let md = `# Quellenbericht\n\nGeprüft: \`${path.basename(ANTWORT)}\`, ${eintraege.length} gemeldete Belege.\n\n`;
  md += `## Bilanz\n\n`;
  for (const k of Object.keys(zaehler).sort()) md += `- **${k}:** ${zaehler[k]}\n`;
  md += `\nNur Zeilen mit «zu prüfen» sind Kandidaten. Alles darüber ist auszusortieren:\n`;
  md += `Eine unbekannte Kennung heisst, das Modell hat sie erfunden oder der Text hat\n`;
  md += `sich seither geändert. «Passt vermutlich nicht» heisst, kein Stichwort der\n`;
  md += `behaupteten Aussage kommt auf der Seite vor.\n`;

  for (const r of ergebnisse) {
    md += `\n---\n\n## ${r.kennung} — ${r.urteil}\n\n`;
    md += `- **URL:** ${r.url}\n`;
    if (r.res.endUrl && r.res.endUrl !== r.url) md += `- **Weitergeleitet auf:** ${r.res.endUrl}\n`;
    md += `- **Status:** ${r.res.status || "keine Antwort"}${r.res.fehler ? ` (${r.res.fehler})` : ""}\n`;
    if (r.titel) md += `- **Titel laut Modell:** ${r.titel}\n`;
    if (r.stuetzt) md += `- **Soll stützen:** ${r.stuetzt}\n`;
    if (r.konkret) md += `- **Konkretisierung:** ${r.konkret}\n`;
    if (r.woerter.length) {
      md += `- **Stichwortprobe:** ${r.gefunden.length}/${r.woerter.length} gefunden`;
      md += r.gefunden.length ? ` (${r.gefunden.join(", ")})\n` : `\n`;
    }
    if (r.bekannt) {
      const b = index[r.kennung];
      md += `- **Stelle im Code:** \`${b.datei}\` › ${b.ort} › ${b.feld}\n`;
      md += `\n> ${b.text}\n`;
    } else {
      md += `\n> Kennung steht nicht im Quellenauftrag. Nicht verwenden.\n`;
    }
  }

  fs.writeFileSync(ZIEL, md, "utf8");
  console.log("\nBilanz:");
  for (const k of Object.keys(zaehler).sort()) console.log(`  ${k}: ${zaehler[k]}`);
  console.log("\nBericht:", ZIEL);
})();
