/**
 * Bezug jeder Verständnisfrage zum konsumierten Inhalt (v3-Erweiterung nach
 * Pietro-Feedback 2026-06-26): Verständnisfragen werden direkt unter dem Medium
 * gezeigt, das sie prüfen (Sonnenseite/Schattenseite), der Rest als kurzer Recap
 * in der Quiz-Subpage.
 *
 * Companion-Map (Schlüssel = `quizFrage.id` aus stationenV3.ts), damit die
 * kanonische Inhaltsdatei unangetastet bleibt. Werte: siehe QuizBezug in types.ts.
 */
import type { QuizBezug } from "./types";

export const QUIZ_BEZUG: Record<string, QuizBezug> = {
  "st1-mc-1": "sonne",
  "st1-mc-2": "fakten",
  "st1-mc-3": "sonne",
  "st1-mc-4": "schatten",
  "st1-mc-5": "fakten",
  "st1-tf-1": "sonne",
  "st1-tf-2": "fakten",
  "st1-tf-3": "fakten",
  "st2-mc-1": "schatten",
  "st2-mc-2": "fakten",
  "st2-mc-3": "fakten",
  "st2-mc-4": "fakten",
  "st2-mc-5": "fakten",
  "st2-tf-1": "schatten",
  "st2-tf-2": "fakten",
  "st2-tf-3": "fakten",
  "st3-mc-1": "schatten",
  "st3-mc-2": "fakten",
  "st3-mc-3": "schatten",
  "st3-mc-4": "fakten",
  "st3-mc-5": "sonne",
  "st3-tf-1": "schatten",
  "st3-tf-2": "fakten",
  "st3-tf-3": "schatten",
  "st4-mc-1": "fakten",
  "st4-mc-2": "fakten",
  "st4-mc-3": "fakten",
  "st4-mc-4": "fakten",
  "st4-mc-5": "fakten",
  "st4-tf-1": "sonne",
  "st4-tf-2": "fakten",
  "st4-tf-3": "fakten",
  "st5-mc-1": "fakten",
  "st5-mc-2": "sonne",
  "st5-mc-3": "schatten",
  "st5-mc-4": "fakten",
  "st5-mc-5": "sonne",
  "st5-tf-1": "fakten",
  "st5-tf-2": "schatten",
  "st5-tf-3": "fakten",
  "st6-mc-1": "sonne",
  "st6-mc-2": "schatten",
  "st6-mc-3": "fakten",
  "st6-mc-4": "schatten",
  "st6-mc-5": "fakten",
  "st6-tf-1": "sonne",
  "st6-tf-2": "schatten",
  "st6-tf-3": "fakten",
  "st7-mc-1": "sonne",
  "st7-mc-2": "schatten",
  "st7-mc-3": "fakten",
  "st7-mc-4": "fakten",
  "st7-mc-5": "sonne",
  "st7-tf-1": "fakten",
  "st7-tf-2": "schatten",
  "st7-tf-3": "sonne",
};
