/** Client-Seite des Korrektorats: Typen und die vier API-Aufrufe. */

export interface Feld {
  id: string;
  label: string;
  section: string;
  kind: "text" | "markdown";
  origin: "objekt" | "jsx-attribut" | "jsx-text" | "konstante";
  literal: "quoted" | "template" | "jsxattr" | "jsxtext";
  value: string;
  original: string;
  /** Wortlaut auf `main`, falls in dieser Runde schon geändert. */
  mainValue?: string;
  /** Bei Text zwischen Tags: der ganze Satz drumherum, als Lesehilfe. */
  context?: string;
  loc: { start: number; end: number };
}

export interface UebersichtDatei {
  pfad: string;
  titel: string;
  gruppe: string;
  hinweis: string | null;
  felder: number;
  zeichen: number;
  bearbeitet: boolean;
}

export interface Uebersicht {
  runde: string;
  basis: string;
  branchVorhanden: boolean;
  /** `lokal` = Vorschau aus dem Arbeitsverzeichnis, Speichern gesperrt. */
  quelle: "github" | "lokal";
  gruppen: Array<{ titel: string; dateien: UebersichtDatei[] }>;
  felderTotal: number;
  bearbeiteteDateien: number;
}

export interface DateiAntwort {
  pfad: string;
  titel: string;
  gruppe: string;
  hinweis: string | null;
  sha: string;
  vomBranch: boolean;
  /** Vorschaumodus: Felder sind lesbar, Speichern ist gesperrt. */
  nurLesen?: boolean;
  felder: Feld[];
}

export interface SpeichernAntwort {
  ok: true;
  angewandt: number;
  uebersprungen: Array<{ id: string; grund: string }>;
  prUrl?: string | null;
  prNummer?: number | null;
  runde?: string;
  hinweis?: string;
}

export interface Treffer {
  pfad: string;
  dateiTitel: string;
  gruppe: string;
  feldId: string;
  section: string;
  label: string;
  /** Ausschnitt um den ersten Fund, mit «…» wo gekürzt wurde. */
  auszug: string;
  /** Lage des Funds im Auszug, zum Hervorheben. */
  von: number;
  bis: number;
  anzahl: number;
}

export interface SuchErgebnis {
  begriff: string;
  treffer: Treffer[];
  gesamt: number;
  dateien: number;
  gekuerzt: boolean;
}

export interface MeAntwort {
  angemeldet: boolean;
  konfiguriert: boolean;
  fehlendeKonfig: string[];
  runde: string;
}

/** Fehler mit der Meldung, die der Server geschickt hat. */
export class ApiFehler extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function ruf<T>(pfad: string, init?: RequestInit): Promise<T> {
  const res = await fetch(pfad, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const text = await res.text();
  let daten: unknown = null;
  try {
    daten = text ? JSON.parse(text) : null;
  } catch {
    // Kein JSON — dann zählt der Statuscode.
  }
  if (!res.ok) {
    const meldung =
      (daten as { fehler?: string; detail?: string } | null)?.fehler ||
      `Server antwortete mit ${res.status}`;
    const detail = (daten as { detail?: string } | null)?.detail;
    throw new ApiFehler(detail ? `${meldung} — ${detail}` : meldung, res.status);
  }
  return daten as T;
}

export const api = {
  me: () => ruf<MeAntwort>("/api/korrektorat/me"),

  anmelden: (passcode: string) =>
    ruf<{ ok: true }>("/api/korrektorat/auth", {
      method: "POST",
      body: JSON.stringify({ passcode }),
    }),

  abmelden: () => ruf<{ ok: true }>("/api/korrektorat/logout", { method: "POST" }),

  dateien: () => ruf<Uebersicht>("/api/korrektorat/dateien"),

  suchen: (begriff: string, ganzeWoerter: boolean, signal?: AbortSignal) =>
    ruf<SuchErgebnis>("/api/korrektorat/suche", {
      method: "POST",
      body: JSON.stringify({ begriff, ganzeWoerter }),
      signal,
    }),

  datei: (pfad: string) =>
    ruf<DateiAntwort>("/api/korrektorat/datei", {
      method: "POST",
      body: JSON.stringify({ pfad }),
    }),

  speichern: (pfad: string, felder: Feld[]) =>
    ruf<SpeichernAntwort>("/api/korrektorat/speichern", {
      method: "POST",
      body: JSON.stringify({
        pfad,
        // Nur Kennung, Wortlaut und Position — alles andere bestimmt der Server
        // aus seinem eigenen, frischen Parse.
        felder: felder.map((f) => ({ id: f.id, value: f.value, loc: f.loc })),
      }),
    }),
};
