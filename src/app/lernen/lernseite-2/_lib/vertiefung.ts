import { merkeSpur } from "./spuren";
import { merkeInhalt } from "./inhalte";

/**
 * Eine Vertiefung als Aktivität vermerken.
 *
 * «Vertiefung» heisst im Rhizom und im Orakel: Jemand hat einen längeren Text
 * hinter einem Knopf aufgeklappt. Das gab es bisher nur bei `KartenAktion`
 * («Mehr lesen»), obwohl es dieselbe Handlung auch bei `Ausklapptext`
 * («Mehr dazu», «Mehr wissen») und bei `InfoPunkt` («Hintergrund zum Bild»)
 * gibt. Wer dort aufklappte, vertiefte, ohne dass es gezählt wurde.
 *
 * `merkeSpur` ist idempotent: Auf- und Zuklappen zählt genau einmal.
 *
 * Nicht jedes Aufklappen ist eine Vertiefung. Datenschutz-Details und das
 * Quellenverzeichnis bleiben bewusst ungezählt, sie gehören zur Verwaltung der
 * Seite und nicht zum Lernweg. Darum ist `spurId` überall optional: Ohne sie
 * verhält sich die Komponente wie vorher.
 */
export function merkeVertiefung(spurId: string, titel?: string) {
  const basis = spurId.startsWith("mehr:") ? spurId.slice("mehr:".length) : spurId;
  if (titel) merkeInhalt(basis, titel);
  merkeSpur(`mehr:${basis}`);
}
