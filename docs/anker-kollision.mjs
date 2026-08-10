/**
 * Deckt ein Beleg-Anker einen Glossarbegriff ab, gewinnt der Beleg. Ob die
 * Begriffserklärung damit verloren ist, hängt aber vom Text ab, und genau das
 * prüft dieses Skript.
 *
 * `GlossarText` sammelt seit dem 2026-08-10 ALLE Vorkommen eines Begriffs und
 * zeichnet das erste freie aus. Kommt ein verdeckter Begriff im selben Block
 * noch einmal ausserhalb aller Anker vor, rutscht die Erklärung dorthin, und
 * nichts geht verloren. Vorher verglich dieses Skript nur Zeichenketten und
 * meldete jede Überschneidung als Kollision. Das war nach dem Umbau ein
 * Fehlalarm, und ein Prüfer, der falsch meldet, verdeckt bald die echten Fälle.
 *
 * Darum jetzt in zwei Stufen:
 *   · verdeckt und im Block sonst nirgends frei  → KOLLISION (Erklärung ist weg)
 *   · verdeckt, aber im Block noch frei vorhanden → harmlos, nur gemeldet
 */
import fs from "node:fs";

import path from "node:path";
import { fileURLToPath } from "node:url";
const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const g = fs.readFileSync(`${REPO}/src/app/lernen/lernseite-2/_components/Glossar.tsx`, "utf8");
const start = g.indexOf("export const GLOSSAR");
const ende = g.indexOf("\n};", start);
const terme = [...g.slice(start, ende).matchAll(/^ {2}"?([A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß -]*?)"?:\s/gm)].map(
  (m) => m[1],
);

const b = fs.readFileSync(`${REPO}/src/app/lernen/lernseite-2/_data/belege.ts`, "utf8");
/* Anker mit ihrer Block-Kennung, damit sich «im selben Block» prüfen lässt.
 *
 * Gepaart wird bis zur NÄCHSTEN Kennung, nicht über ein Zeichenfenster. Ein
 * erster Versuch mit «höchstens 400 Zeichen zwischen id und anker» verlor
 * genau einen Beleg, weil dort ein längerer Kommentar dazwischenstand. Ein
 * Prüfer, der unbemerkt einen Eintrag überspringt, ist schlimmer als keiner,
 * darum wird unten auch die Zahl gegengerechnet. */
const kennungen = [...b.matchAll(/id:\s*"([^"]+)"/g)];
const belege = [];
for (let i = 0; i < kennungen.length; i++) {
  const von = kennungen[i].index;
  const bis = i + 1 < kennungen.length ? kennungen[i + 1].index : b.length;
  const m = /anker:\s*"([^"]+)"/.exec(b.slice(von, bis));
  if (m) belege.push({ id: kennungen[i][1], anker: m[1] });
}
const anker = belege.map((x) => x.anker);

/* Gegenrechnung: Jeder im File vorkommende Anker muss gepaart sein. */
const alleAnker = [...b.matchAll(/anker:\s*"([^"]+)"/g)].map((m) => m[1]);
if (alleAnker.length !== belege.length) {
  const fehlend = alleAnker.filter((a) => !anker.includes(a));
  console.log(
    `WARNUNG: ${alleAnker.length} Anker im File, aber nur ${belege.length} einer Kennung zugeordnet.` +
      (fehlend.length ? ` Nicht zugeordnet: ${fehlend.map((f) => `«${f}»`).join(", ")}` : ""),
  );
}

/** Block-Texte aus dem Quellen-Index (von docs/quellenauftrag.js gebaut). */
let bloecke = {};
try {
  bloecke = JSON.parse(fs.readFileSync(`${REPO}/docs/quellenauftrag-index.json`, "utf8"));
} catch {
  console.log(
    "Hinweis: docs/quellenauftrag-index.json fehlt. Erst `node docs/quellenauftrag.js` laufen lassen, sonst prüft dieses Skript nur die Zeichenketten.",
  );
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Kommt `term` im Blocktext vor, ohne von einem Anker dieses Blocks verdeckt zu sein? */
function nochFrei(id, term) {
  const text = bloecke[id]?.text;
  if (!text) return null; // unbekannt, dann nicht behaupten
  let rest = text;
  for (const x of belege.filter((y) => y.id === id)) {
    rest = rest.split(x.anker).join(" ".repeat(x.anker.length));
  }
  return new RegExp(`\\b${esc(term)}\\b`).test(rest);
}

let echte = 0;
const harmlos = [];
for (const { id, anker: a } of belege) {
  for (const t of terme) {
    if (!new RegExp(`\\b${esc(t)}\\b`).test(a)) continue;
    const frei = nochFrei(id, t);
    if (frei === true) {
      harmlos.push(`Anker «${a}» verdeckt «${t}», der Begriff kommt im Block aber frei vor`);
    } else {
      console.log(
        `KOLLISION: Anker «${a}» verdeckt Glossarbegriff «${t}»` +
          (frei === null ? " (Blocktext unbekannt)" : " und kommt sonst nicht frei vor"),
      );
      echte++;
    }
  }
}

if (harmlos.length) {
  console.log("\nVerdeckt, aber nicht verloren:");
  for (const z of harmlos) console.log(`  ${z}`);
  console.log("");
}
console.log(
  `${terme.length} Glossarbegriffe · ${anker.length} Anker · ${echte} Kollisionen · ${harmlos.length} harmlos verdeckt`,
);
