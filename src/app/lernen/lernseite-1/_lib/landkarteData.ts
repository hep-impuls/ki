"use client";

/**
 * Landkarte-Datenschicht (M6) — leitet aus dem lokalen Stations-Store
 * (`stationStore`) die **renderbaren Landkarte-Achsen** ab. Massgebend:
 * KI_EINHEIT_GESAMTARCHITEKTUR_v3.md §10/§11.
 *
 * Backward-Design (v3 §10): Die Achsen stehen in `_data/landkarte.ts` fest; jede
 * Achse nennt ihre speisende `pollId` (Basis-Key) + `format`. Diese Schicht liest
 * die **lokal** gespeicherten Pre/Post-Werte (Ich) und meldet **nur** die Achsen
 * zurück, zu denen Daten vorliegen → die Landkarte **wächst mit der Zahl der
 * absolvierten Stationen**. Klasse/alle (anonyme Aggregate) kommen separat über
 * `polls.ts` (Lesen ab M6, Schreiben/`castPollVote` ab M8) — diese Datei bleibt
 * rein lokal und cloud-frei.
 *
 * Normierung pro Achse auf **0..1** (0 = linker Pol, 1 = rechter Pol):
 *   - `skala4`: gespeicherter Index 0..3 → idx/3 (Optionen sind links→rechts
 *     entlang der Achse ausgeschrieben, vgl. PollFrame/Verteilung).
 *   - `slider`: gespeicherter Wert 0..100 → /100.
 *
 * Das Werte-Profil (`quelle: "swipe"`) ist **mehrachsig** und wird nicht als eine
 * Radar-Speiche, sondern separat als links/rechts-Balken dargestellt
 * (`werteProfilBalken`).
 */

import type { LandkarteAxis } from "../_data/types";
import { LANDKARTE_ACHSEN } from "../_data/landkarte";
import { aggregateProfil, pollWahl, type ProfilAchse } from "./stationStore";

/** Pseudo-Stations-ID für globale (Auftakt/Abschluss) Polls im lokalen Store. */
export const GLOBAL_STATION_ID = "global";

/** Die globale Chance↔Bedrohung-Achse (Slider). Stabiler Basis-Key. */
export const GLOBAL_POLL_ID = "global-chance-bedrohung";

/** Eine renderbare Achse mit lokalem Ich-Wert (0..1). */
export interface AchsenWert {
  axis: LandkarteAxis;
  /** Kurzlabel (Teil vor dem ":") für enge Radar-Beschriftung. */
  kurz: string;
  /** Ich-Position 0..1 (Post bevorzugt, sonst Pre). */
  ich: number;
  /** Ich-Position vorher 0..1 (nur wenn Pre vorhanden) — für Slider-Bewegung. */
  ichPre?: number;
  /** Liegt ein Post-Wert vor? (sonst nur Pre = Auftakt-Stand). */
  hatPost: boolean;
}

/** quelle → lokale Stations-ID im Store. `swipe` wird separat behandelt. */
function stationIdFuer(axis: LandkarteAxis): string | null {
  if (axis.quelle === "swipe") return null;
  if (axis.quelle === "auftakt" || axis.quelle === "abschluss") return GLOBAL_STATION_ID;
  return axis.quelle; // "station-1" … "station-7"
}

/** Rohwert (Index 0..3 bzw. 0..100) auf 0..1 normieren. */
function normiere(format: LandkarteAxis["format"], roh: number): number {
  if (format === "skala4") return Math.max(0, Math.min(3, roh)) / 3;
  return Math.max(0, Math.min(100, roh)) / 100; // slider
}

/** Kurzlabel: alles vor dem ersten ":" (sonst das ganze Label). */
function kurzLabel(label: string): string {
  const i = label.indexOf(":");
  return i > 0 ? label.slice(0, i).trim() : label;
}

/**
 * Alle Landkarte-Achsen, zu denen **lokale Ich-Daten** vorliegen — in der
 * Katalog-Reihenfolge aus `_data/landkarte.ts`. Das Werte-Profil (`swipe`) ist
 * ausgenommen (siehe `werteProfilBalken`).
 */
export function landkarteAchsenMitDaten(): AchsenWert[] {
  const out: AchsenWert[] = [];
  for (const axis of LANDKARTE_ACHSEN) {
    const sid = stationIdFuer(axis);
    if (!sid) continue;
    const pid = axis.pollIds[0];
    const pre = pollWahl(sid, pid, "pre");
    const post = pollWahl(sid, pid, "post");
    if (pre == null && post == null) continue;
    const roh = post ?? (pre as number);
    out.push({
      axis,
      kurz: kurzLabel(axis.label),
      ich: normiere(axis.format, roh),
      ichPre: pre != null ? normiere(axis.format, pre) : undefined,
      hatPost: post != null,
    });
  }
  return out;
}

/* ── Werte-Profil (Swipe, mehrachsig) ──────────────────────────────────────── */

/** Anzeige-Labels + Pol-Beschriftung der drei Profil-Achsen (Swipe-Karten). */
export const PROFIL_LABELS: Record<string, { label: string; links: string; rechts: string }> = {
  "regulierung-innovation": { label: "Regulierung ↔ Innovation", links: "Regulierung", rechts: "Innovation" },
  "menschloop-effizienz": { label: "Mensch-im-Loop ↔ Effizienz", links: "Mensch im Loop", rechts: "Effizienz" },
  "datenschutz-bequemlichkeit": { label: "Datenschutz ↔ Bequemlichkeit", links: "Datenschutz", rechts: "Bequemlichkeit" },
};

export interface ProfilBalken {
  key: string;
  label: string;
  links: string;
  rechts: string;
  /** Anzahl links-Picks. */
  linksN: number;
  /** Anzahl rechts-Picks. */
  rechtsN: number;
  /** Neigung 0..1 (Anteil rechts) — für die Balken-Position. */
  rechtsAnteil: number;
}

/**
 * Werte-Profil aus allen Swipe-Picks (über alle Stationen) als links/rechts-
 * Balken. Nur Achsen mit mindestens einem Pick erscheinen — wächst ebenfalls
 * mit der Zahl der gespielten Stationen.
 */
export function werteProfilBalken(): ProfilBalken[] {
  const agg: Record<string, ProfilAchse> = aggregateProfil();
  const reihenfolge = Object.keys(PROFIL_LABELS);
  const out: ProfilBalken[] = [];
  for (const key of reihenfolge) {
    const a = agg[key];
    if (!a) continue;
    const summe = a.links + a.rechts;
    if (summe === 0) continue;
    const meta = PROFIL_LABELS[key];
    out.push({
      key,
      label: meta.label,
      links: meta.links,
      rechts: meta.rechts,
      linksN: a.links,
      rechtsN: a.rechts,
      rechtsAnteil: a.rechts / summe,
    });
  }
  return out;
}
