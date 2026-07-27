/**
 * Entwürfe im Browser. Wer eine Stunde an einer Datei korrigiert und dann den
 * Tab schliesst, soll nichts verlieren — gespeichert wird nach jedem Tastendruck
 * lokal, nach GitHub erst auf Knopfdruck.
 *
 * Bewusst nur `localStorage`: es geht um Wortlaut-Entwürfe, nicht um Daten, die
 * irgendwo anders hingehören.
 */

const PRAEFIX = "ki26-korrektorat-entwurf:";

export type Entwurf = Record<string, string>;

export function entwurfLesen(pfad: string): Entwurf {
  if (typeof window === "undefined") return {};
  try {
    const roh = window.localStorage.getItem(PRAEFIX + pfad);
    return roh ? (JSON.parse(roh) as Entwurf) : {};
  } catch {
    return {};
  }
}

export function entwurfSchreiben(pfad: string, entwurf: Entwurf): void {
  if (typeof window === "undefined") return;
  try {
    if (Object.keys(entwurf).length === 0) window.localStorage.removeItem(PRAEFIX + pfad);
    else window.localStorage.setItem(PRAEFIX + pfad, JSON.stringify(entwurf));
  } catch {
    // Voller oder gesperrter Speicher — kein Grund, die Arbeit abzubrechen.
  }
}

export function entwurfLoeschen(pfad: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PRAEFIX + pfad);
  } catch {
    /* siehe oben */
  }
}

/** Welche Dateien haben ungespeicherte Entwürfe? Für Marker in der Übersicht. */
export function dateienMitEntwurf(): Record<string, number> {
  if (typeof window === "undefined") return {};
  const out: Record<string, number> = {};
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(PRAEFIX)) continue;
      const roh = window.localStorage.getItem(key);
      if (!roh) continue;
      const anzahl = Object.keys(JSON.parse(roh) as Entwurf).length;
      if (anzahl > 0) out[key.slice(PRAEFIX.length)] = anzahl;
    }
  } catch {
    return out;
  }
  return out;
}
