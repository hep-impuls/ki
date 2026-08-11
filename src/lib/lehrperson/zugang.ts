"use client";

/**
 * Zugangsdaten der Lehrperson (Klassencode + Secret) für die Dauer eines
 * Browser-Tabs.
 *
 * **Warum es das gibt.** Bis 2026-08-11 reichte der Lehrer-Hub beides als
 * Query-Parameter weiter: `/lehrperson/report?code=…&secret=…`. Damit stand das
 * Secret in der Adresszeile — also im Verlauf, in der Adressleisten-
 * Vervollständigung und in jedem Lesezeichen. Der Fall, der wehtut, ist aber der
 * Beamer: Wer den Report der Klasse zeigt, projiziert das Secret an die Wand,
 * und weil der Report die einzelnen Fortschritts-Codes nennt, kann danach jede
 * Person den Report der ganzen Klasse öffnen. Genau das soll das Secret
 * verhindern.
 *
 * **Warum `sessionStorage` und nicht `localStorage`.** Der Zugang soll das
 * Schliessen des Tabs nicht überleben — an einem geteilten Schulrechner ist das
 * der Unterschied zwischen «ich war kurz im Report» und «der Nächste auch».
 * Neuladen und Navigieren innerhalb des Tabs funktionieren weiterhin.
 *
 * **Warum kein Cookie.** Ein Cookie müsste serverseitig signiert werden (wie bei
 * `/autoren`), und der Server prüft das Secret ohnehin bei jedem Aufruf gegen den
 * gespeicherten Hash. Hier geht es nicht um eine zusätzliche Prüfung, sondern nur
 * darum, das Secret aus der Adresszeile zu bekommen.
 */

const KEY = "ki26-lehrperson-zugang";

export interface Zugang {
  code: string;
  secret: string;
}

export function speichereZugang(zugang: Zugang): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(zugang));
  } catch {
    /* Privatmodus o.ä. — dann eben pro Seite neu eingeben. */
  }
}

export function leseZugang(): Zugang | null {
  if (typeof window === "undefined") return null;
  try {
    const roh = window.sessionStorage.getItem(KEY);
    if (!roh) return null;
    const z = JSON.parse(roh) as Partial<Zugang>;
    if (!z?.code || !z?.secret) return null;
    return { code: String(z.code).toUpperCase(), secret: String(z.secret) };
  } catch {
    return null;
  }
}

export function loescheZugang(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* egal */
  }
}
