/**
 * Prüfung der Speicher-Schranken (`pruefeEdits`).
 *
 *   node scripts/korrektorat/speichern-test.mjs
 *
 * Das ist die Logik, die verhindert, dass eine Korrektur an der falschen Stelle
 * landet. Sie hängt an einer echten Inhaltsdatei, nicht an einem Kunstbeispiel,
 * damit die Fälle so aussehen wie im Betrieb.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { apply, extract, pruefeEdits } from "../../src/lib/korrektorat/parser.mjs";

const REPO = path.resolve(import.meta.dirname, "../..");
const PROBE = "src/app/lernen/lernseite-1/_data/auftakt.ts";

const src = fs.readFileSync(path.join(REPO, PROBE), "utf8");
const { fields } = extract(src, path.basename(PROBE));

let fehler = 0;

function pruefe(name, bedingung, detail = "") {
  if (bedingung) {
    console.log(`  ok      ${name}`);
  } else {
    console.log(`  FEHLER  ${name}${detail ? ` — ${detail}` : ""}`);
    fehler++;
  }
}

console.log(`${PROBE} — ${fields.length} Felder\n`);

/* Unveränderte Eingaben ergeben keine Änderung. */
{
  const { anzuwenden, uebersprungen } = pruefeEdits(
    fields,
    fields.map((f) => ({ id: f.id, value: f.value, loc: f.loc })),
  );
  pruefe(
    "unveränderte Werte werden nicht committet",
    anzuwenden.length === 0 && uebersprungen.length === 0,
    `${anzuwenden.length} angewandt, ${uebersprungen.length} übersprungen`,
  );
}

/* Veraltete Positionen werden abgelehnt. */
{
  const feld = fields[0];
  const { anzuwenden, uebersprungen } = pruefeEdits(fields, [
    { id: feld.id, value: feld.value + " geändert", loc: { start: feld.loc.start + 7, end: feld.loc.end + 7 } },
  ]);
  pruefe(
    "verschobene Positionen werden abgelehnt",
    anzuwenden.length === 0 && uebersprungen[0]?.grund.includes("neu laden"),
    JSON.stringify(uebersprungen),
  );
}

/* Unbekannte Feld-Kennungen werden abgelehnt. */
{
  const { anzuwenden, uebersprungen } = pruefeEdits(fields, [
    { id: "gibt/es/nicht", value: "Text", loc: { start: 0, end: 1 } },
  ]);
  pruefe(
    "unbekannte Feld-Kennung wird abgelehnt",
    anzuwenden.length === 0 && uebersprungen[0]?.grund.includes("nicht mehr"),
    JSON.stringify(uebersprungen),
  );
}

/* Leerer Text löscht keinen Inhalt. */
{
  const feld = fields[0];
  const { anzuwenden, uebersprungen } = pruefeEdits(fields, [
    { id: feld.id, value: "   ", loc: feld.loc },
  ]);
  pruefe(
    "leerer Text wird nicht gespeichert",
    anzuwenden.length === 0 && uebersprungen[0]?.grund.includes("leerer Text"),
    JSON.stringify(uebersprungen),
  );
}

/* Der Client kann keine Positionen diktieren: übernommen wird das frische Feld. */
{
  const feld = fields[0];
  const { anzuwenden } = pruefeEdits(fields, [
    { id: feld.id, value: "Neuer Wortlaut", loc: feld.loc },
  ]);
  pruefe(
    "Positionen kommen aus dem frischen Parse",
    anzuwenden.length === 1 &&
      anzuwenden[0].loc.start === feld.loc.start &&
      anzuwenden[0].literal === feld.literal &&
      anzuwenden[0].raw === feld.raw,
  );
}

/* Eine echte Änderung kommt sauber in der Datei an. */
{
  const feld = fields.find((f) => f.kind === "markdown") || fields[0];
  const neu = 'Kontrolltext mit "Anführung", einem \\ und einem Umlaut: Grösse.';
  const { anzuwenden } = pruefeEdits(fields, [{ id: feld.id, value: neu, loc: feld.loc }]);
  const geschrieben = apply(src, anzuwenden);
  const wieder = extract(geschrieben, path.basename(PROBE)).fields.find((f) => f.id === feld.id);
  pruefe(
    "Änderung wird korrekt geschrieben und wieder gelesen",
    wieder?.value === neu,
    JSON.stringify(wieder?.value),
  );
  pruefe(
    "nur die geänderte Stelle bewegt sich",
    geschrieben.length === src.length - feld.value.length + escapeLaenge(neu),
    `${geschrieben.length} vs. erwartet ${src.length - feld.value.length + escapeLaenge(neu)}`,
  );
}

console.log(fehler === 0 ? "\nAlle Schranken halten." : `\n${fehler} Prüfung(en) fehlgeschlagen.`);
if (fehler) process.exit(1);

/** Der Backslash wird beim Schreiben verdoppelt — das zählt für die Länge. */
function escapeLaenge(wert) {
  return wert.length + (wert.match(/[\\"\n\r\t]/g) || []).length;
}
