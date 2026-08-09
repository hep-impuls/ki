/**
 * weiterverfolgen-zaehlen.mjs — zählt, wie viele Merkzeichen «Das verfolge ich
 * weiter» in Lernseite 2 überhaupt möglich sind, und vergleicht das mit
 * `WUNSCH_TOTAL` im Orakel-Dashboard.
 *
 *     node docs/weiterverfolgen-zaehlen.mjs
 *
 * WARUM ES DAS BRAUCHT. Das Orakel zeigt «x / N gesetzt». Das N ist eine
 * Konstante, weil das Dashboard eine eigene Seite ist und die Karten der
 * anderen Seiten nicht sehen kann. Eine handgepflegte Zahl veraltet aber beim
 * ersten neuen Bild, und dann zeigt das Orakel «12 / 87», wo 88 möglich wären.
 * Dieses Skript rechnet die Zahl aus den Daten nach und meldet den Unterschied.
 *
 * WIE GEZÄHLT WIRD. Jede Stelle, die `KartenAktion` rendert, ist ein möglicher
 * Merkpunkt. Gezählt wird darum die Länge der Liste, über die dort gelaufen
 * wird — nicht, was gerade auf dem Schirm steht: In Akkordeons und Führungen
 * rendert React nur das offene Element, möglich sind trotzdem alle.
 *
 * Die Zählung liest die Quelldateien. Sie ist bewusst stur: Findet sie eine
 * Liste nicht, bricht sie mit einer Meldung ab, statt still 0 zu zählen.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const wurzel = join(dirname(fileURLToPath(import.meta.url)), "..");
const lese = (p) => readFileSync(join(wurzel, p), "utf8");

/**
 * Zählt die Elemente eines Array-Literals im Quelltext.
 *
 * `marke` ist der Text direkt vor der öffnenden Klammer, z.B. `stationen={[`.
 * Ab dort wird geklammert gezählt: Jede `{` auf Tiefe 1 des Arrays ist ein
 * Element. Zeichenketten und Kommentare werden übersprungen, sonst zählt eine
 * `{` in einem Text mit (Vorlagen-Ausdrücke `${…}` kommen in diesen Daten vor).
 */
function zaehleElemente(quelle, marke, datei, anker) {
  /* `anker` ist der Komponenten-Aufruf, ab dem gesucht wird, z.B.
   * «<HistorienTeppich». Ohne ihn erwischt `punkte={[` das erste Vorkommen auf
   * der Seite — und das gehörte zu AkkordeonPosten mit 4 statt 33 Punkten. */
  let ab = 0;
  if (anker) {
    ab = quelle.indexOf(anker);
    if (ab < 0) throw new Error(`Anker «${anker}» nicht gefunden in ${datei}`);
  }
  const start = quelle.indexOf(marke, ab);
  if (start < 0) throw new Error(`«${marke}» nicht gefunden in ${datei}`);
  let i = start + marke.length - 1; // steht auf der öffnenden «[»
  if (quelle[i] !== "[") throw new Error(`«${marke}» endet nicht auf «[» (${datei})`);

  let tiefe = 0;
  let elemente = 0;
  let inText = null; // ' " ` oder null
  let inKommentar = null; // "zeile" | "block" | null

  for (; i < quelle.length; i++) {
    const c = quelle[i];
    const naechst = quelle[i + 1];

    if (inKommentar === "zeile") {
      if (c === "\n") inKommentar = null;
      continue;
    }
    if (inKommentar === "block") {
      if (c === "*" && naechst === "/") { inKommentar = null; i++; }
      continue;
    }
    if (inText) {
      if (c === "\\") { i++; continue; }
      if (c === inText) inText = null;
      continue;
    }
    if (c === "/" && naechst === "/") { inKommentar = "zeile"; i++; continue; }
    if (c === "/" && naechst === "*") { inKommentar = "block"; i++; continue; }
    if (c === '"' || c === "'" || c === "`") { inText = c; continue; }

    if (c === "[") { tiefe++; continue; }
    if (c === "]") {
      tiefe--;
      if (tiefe === 0) return elemente;
      continue;
    }
    if (c === "{") {
      if (tiefe === 1) elemente++;
      // Verschachtelte Objekte/Arrays überspringen wir nicht eigens: Ihre «{»
      // liegen auf Tiefe 1 nur, wenn sie direkte Elemente sind. Objekte, die
      // TIEFER liegen, stecken in einem Array-Element und werden von dessen
      // eigener Klammer­bilanz eingefasst — darum hier mitzählen und die
      // Bilanz über die geschweiften Klammern führen.
      let g = 1;
      for (i++; i < quelle.length && g > 0; i++) {
        const d = quelle[i];
        const e = quelle[i + 1];
        if (inKommentar === "zeile") { if (d === "\n") inKommentar = null; continue; }
        if (inKommentar === "block") { if (d === "*" && e === "/") { inKommentar = null; i++; } continue; }
        if (inText) { if (d === "\\") { i++; continue; } if (d === inText) inText = null; continue; }
        if (d === "/" && e === "/") { inKommentar = "zeile"; i++; continue; }
        if (d === "/" && e === "*") { inKommentar = "block"; i++; continue; }
        if (d === '"' || d === "'" || d === "`") { inText = d; continue; }
        if (d === "{") g++;
        else if (d === "}") g--;
      }
      i--;
      continue;
    }
  }
  throw new Error(`Array zu «${marke}» endet nicht (${datei})`);
}

const vorhang = lese("src/app/lernen/lernseite-2/vorhang-auf/page.tsx");
const philo = lese("src/app/lernen/lernseite-2/philosophische-perspektive/page.tsx");
const epochen = lese("src/app/lernen/lernseite-2/_components/VerunsicherungsEpochen.tsx");
const denkwege = lese(
  "src/app/lernen/lernseite-2/philosophische-perspektive/_components/Denkwege.tsx",
);

/* Epochen: die Bilder liegen je Epoche in `bilder: [`, die Bausteine sind eine
 * feste Liste (BAUSTEINE) und gelten für jede Epoche. */
const epochenAnzahl = (epochen.match(/^\s{4}epoche: "/gm) || []).length;
const epochenBilder = (epochen.match(/^\s{8}src: "/gm) || []).length;
const bausteine = zaehleElemente(epochen, "const BAUSTEINE = [", "VerunsicherungsEpochen.tsx");

const posten = [
  {
    was: "Die KI-Story (StoryGewebe)",
    anzahl: zaehleElemente(vorhang, "stationen={[", "vorhang-auf/page.tsx", "<StoryGewebe"),
    praefix: "wunsch:vorhang-auf:story",
  },
  {
    was: "Merkmale (KnotenLandschaft)",
    anzahl: zaehleElemente(vorhang, "knoten={[", "vorhang-auf/page.tsx", "<KnotenLandschaft"),
    praefix: "wunsch:vorhang-auf:weisheit",
  },
  {
    was: "Bilder zur KI-Story",
    anzahl: zaehleElemente(vorhang, "const BILDER_STORY: AnschauBild[] = [", "vorhang-auf/page.tsx"),
    praefix: "wunsch:vorhang-auf:bild",
  },
  {
    was: "Teppich des Wandels (HistorienTeppich)",
    anzahl: zaehleElemente(philo, "punkte={[", "philosophische-perspektive/page.tsx", "<HistorienTeppich"),
    praefix: "wunsch:philosophische-perspektive:teppich",
  },
  {
    was: `Epochen-Bausteine (${epochenAnzahl} Epochen × ${bausteine})`,
    anzahl: epochenAnzahl * bausteine,
    praefix: "wunsch:philosophische-perspektive:epochen",
  },
  {
    was: "Bilder der Epochen",
    anzahl: epochenBilder,
    praefix: "wunsch:philosophische-perspektive:epochen-bild",
  },
  {
    was: "Denkerinnen und Denker (Denkwege)",
    anzahl: (denkwege.match(/^\s{8}slug: "/gm) || []).length,
    praefix: "wunsch:philosophische-perspektive:denker",
  },
];

const summe = posten.reduce((s, p) => s + p.anzahl, 0);

console.log("Mögliche Merkzeichen «Das verfolge ich weiter»\n");
for (const p of posten) {
  console.log(`  ${String(p.anzahl).padStart(3)}  ${p.was}`);
}
console.log(`  ${"—".repeat(3)}`);
console.log(`  ${String(summe).padStart(3)}  zusammen\n`);

/* Abgleich mit der Konstante im Dashboard. */
const dashPfad = "src/app/lernen/lernseite-2/das-orakel/_components/OrakelDashboard.tsx";
const dash = lese(dashPfad);
const treffer = dash.match(/const WUNSCH_TOTAL = (\d+)/);
if (!treffer) {
  console.error(`FEHLER: «const WUNSCH_TOTAL = …» nicht in ${dashPfad} gefunden.`);
  process.exit(1);
}
const eingetragen = Number(treffer[1]);
if (eingetragen !== summe) {
  console.error(
    `FEHLER: WUNSCH_TOTAL steht auf ${eingetragen}, gezählt sind ${summe}.\n` +
      `        In ${dashPfad} auf ${summe} setzen.`,
  );
  process.exit(1);
}
console.log(`WUNSCH_TOTAL stimmt (${eingetragen}).`);
