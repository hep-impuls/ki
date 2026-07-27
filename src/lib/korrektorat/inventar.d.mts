/** Typen zu [inventar.mjs](./inventar.mjs). */

export interface Ausschluss {
  muster: string;
  grund: string;
  /** Datei ist noch erreichbar, aber nur wegen Typen oder IDs — Texte sind tot. */
  nurKennungen?: boolean;
}

export interface DateiInfo {
  pfad: string;
  gruppe: string;
  titel: string;
  /** Titel wurde aus dem Dateinamen abgeleitet, nicht gepflegt. */
  abgeleitet: boolean;
  /** Hinweis für den Korrektor, z.B. «noch nicht eingebunden». */
  hinweis: string | null;
}

export const UMFANG: string[];
export const AUSGESCHLOSSEN: Ausschluss[];
export const UNVERDRAHTET: Record<string, string>;
export const GRUPPEN: Array<{ muster: string; titel: string }>;
export const TITEL: Record<string, string>;

export function istInhaltsDatei(pfad: string): boolean;
export function ausschlussGrund(pfad: string): string | null;
export function ausschluss(pfad: string): Ausschluss | undefined;
export function inhaltsDateien(alle: string[]): string[];
export function dateiInfo(pfad: string): DateiInfo;
