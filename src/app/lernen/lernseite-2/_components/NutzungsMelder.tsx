"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { merkeSeite } from "../_lib/nutzung";

/**
 * NutzungsMelder — meldet anonym, dass dieses Thema geöffnet wurde.
 *
 * Steht einmal im Layout von Lernseite 2 und gilt damit für alle Themen; den
 * Slug liest er aus dem Pfad, statt ihn auf jeder Seite von Hand mitzugeben
 * (eine Aufrufstelle statt fünf, die auseinanderlaufen können).
 *
 * Gezählt wird höchstens einmal je Browser und Thema, ohne Code und ohne
 * Zeitstempel — die Reichweite, nicht das Verhalten einer Person. Sichtbar
 * gemacht wird sie auf `/autoren`. Details: `_lib/nutzung.ts`.
 */
export default function NutzungsMelder() {
  const pfad = usePathname();
  useEffect(() => {
    if (!pfad) return;
    // "/lernen/lernseite-2"            → Hub
    // "/lernen/lernseite-2/vorhang-auf" → vorhang-auf
    const rest = pfad.replace(/^\/lernen\/lernseite-2\/?/, "");
    merkeSeite(rest === "" ? "hub" : rest.split("/")[0]);
  }, [pfad]);
  return null;
}
