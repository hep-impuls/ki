"use client";

import { loescheSpurenEnthaltend } from "./spuren";
import { loescheGewichtungenEnthaltend } from "./gewichtung";
import { loescheAuswertungEnthaltend } from "./auswertung";

/**
 * Neustart — die Aktivitäten EINER Modul-Seite löschen (Vorhang auf bzw.
 * Philosophische Perspektive), damit man frisch beginnen kann.
 *
 * Gelöscht werden lokal UND im Cloud-Spiegel: die Spuren (angeklickte Punkte,
 * Bildpunkte, Videos, Merkzeichen, «Mehr gelesen»), die Gewichtungen
 * (Bewertungen) und die Auswertungs-Bilanzen (geknüpfte Flächen, gewählte
 * Inhalte) dieser Seite.
 *
 * NICHT betroffen (bewusst):
 *  - der Fortschritts-Code selbst (man bleibt dieselbe Person),
 *  - die jeweils ANDERE Seite und Lernseite 1,
 *  - die anonymen Kollektiv-Zähler samt ihren «schon-gezählt»-Registern —
 *    sonst würde erneutes Durchgehen das «alle» im Orakel aufblähen.
 *
 * `teile` = Liste von Teil-Strings; eine Spur/Gewichtung/Bilanz wird gelöscht,
 * wenn ihr Schlüssel einen davon enthält (z.B. ["vorhang-auf"] oder
 * ["philosophische-perspektive", "video:philosophie"]).
 */
export async function aktivitaetenLoeschen(teile: string[]): Promise<void> {
  loescheAuswertungEnthaltend(teile);
  await Promise.all([
    loescheSpurenEnthaltend(teile),
    loescheGewichtungenEnthaltend(teile),
  ]);
}
