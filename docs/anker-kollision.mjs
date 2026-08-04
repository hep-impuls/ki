/**
 * Deckt ein Beleg-Anker einen Glossarbegriff ab, gewinnt der Beleg — die
 * Begriffserklärung im Hover wäre dann unerreichbar. Das prüft das hier.
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
const anker = [...b.matchAll(/anker: "([^"]+)"/g)].map((m) => m[1]);

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
let treffer = 0;
for (const a of anker) {
  for (const t of terme) {
    if (new RegExp(`\\b${esc(t)}\\b`).test(a)) {
      console.log(`KOLLISION: Anker «${a}» verdeckt Glossarbegriff «${t}»`);
      treffer++;
    }
  }
}
console.log(`${terme.length} Glossarbegriffe · ${anker.length} Anker · ${treffer} Kollisionen`);
