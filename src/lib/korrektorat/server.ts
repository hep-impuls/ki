import "server-only";

/**
 * Korrektorat — serverseitige Klammer: Konfiguration, Anmelde-Schranke und der
 * Aufbau der Dateiübersicht.
 *
 * Alles hier läuft in Node-Route-Handlers (`runtime = "nodejs"`), weil der
 * TypeScript-Compiler und `Buffer` gebraucht werden. Vorbild ist die
 * Lehrer-Tier-Entscheidung von ki26: Route Handlers statt Cloud Function, damit
 * nichts ins geteilte Firebase-Projekt deployt werden muss.
 */

import { GitHub } from "./github";
import { quelleFuer } from "./quelle";
import { sitzungLesen, type KorrektoratSession } from "./session";
import { dateiInfo, inhaltsDateien } from "./inventar.mjs";
import { extract } from "./parser.mjs";

export interface Konfig {
  token: string;
  repo: string;
  basis: string;
  branch: string;
  passcode: string;
  secret: string;
}

/** Läuft der Editor gegen das Arbeitsverzeichnis statt gegen GitHub? */
export function lokalerModus(): boolean {
  return process.env.KORREKTORAT_QUELLE === "lokal";
}

/** Was fehlt, damit das Korrektorat läuft — leer heisst betriebsbereit. */
export function fehlendeKonfig(): string[] {
  const fehlt: string[] = [];
  if (!process.env.KORREKTORAT_PASSCODE) fehlt.push("KORREKTORAT_PASSCODE");
  if (!process.env.KORREKTORAT_SESSION_SECRET) fehlt.push("KORREKTORAT_SESSION_SECRET");
  // Im lokalen Modus wird nichts committet, also braucht es kein Token.
  if (!process.env.KORREKTORAT_GITHUB_TOKEN && !lokalerModus()) {
    fehlt.push("KORREKTORAT_GITHUB_TOKEN");
  }
  return fehlt;
}

export function konfig(): Konfig {
  const fehlt = fehlendeKonfig();
  if (fehlt.length) throw new KorrektoratFehler(`Nicht konfiguriert: ${fehlt.join(", ")}`, 503);
  return {
    token: process.env.KORREKTORAT_GITHUB_TOKEN || "",
    repo: process.env.KORREKTORAT_REPO || "hep-impuls/ki",
    basis: process.env.KORREKTORAT_BASIS_BRANCH || "main",
    branch: process.env.KORREKTORAT_BRANCH || "korrektorat/runde-1",
    passcode: process.env.KORREKTORAT_PASSCODE!,
    secret: process.env.KORREKTORAT_SESSION_SECRET!,
  };
}

export class KorrektoratFehler extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}

/** Anmelde-Schranke. Gibt die Sitzung zurück oder wirft 401. */
export async function sitzungVerlangen(request: Request): Promise<KorrektoratSession> {
  const secret = process.env.KORREKTORAT_SESSION_SECRET;
  if (!secret) throw new KorrektoratFehler("Nicht konfiguriert: KORREKTORAT_SESSION_SECRET", 503);
  const sitzung = await sitzungLesen(request, secret);
  if (!sitzung) throw new KorrektoratFehler("Nicht angemeldet", 401);
  return sitzung;
}

/** Einheitliche Fehlerausgabe für alle Korrektorat-Routen. */
export function fehlerAntwort(err: unknown): Response {
  if (err instanceof KorrektoratFehler) return json({ fehler: err.message }, err.status);
  const text = err instanceof Error ? err.message : String(err);
  return json({ fehler: "Unerwarteter Fehler", detail: text }, 500);
}

export function githubClient(k: Konfig): GitHub {
  return new GitHub(k.token, k.repo);
}

/* ── Dateiübersicht ────────────────────────────────────────────────────────── */

export interface UebersichtDatei {
  pfad: string;
  titel: string;
  gruppe: string;
  hinweis: string | null;
  felder: number;
  zeichen: number;
  /** Auf dem Korrektorat-Branch schon geändert. */
  bearbeitet: boolean;
}

export interface Uebersicht {
  runde: string;
  basis: string;
  branchVorhanden: boolean;
  /** `lokal` heisst: Vorschau aus dem Arbeitsverzeichnis, Speichern gesperrt. */
  quelle: "github" | "lokal";
  gruppen: Array<{ titel: string; dateien: UebersichtDatei[] }>;
  felderTotal: number;
  bearbeiteteDateien: number;
}

/**
 * Die Übersicht kostet ~60 Blob-Abrufe und einmal Parsen aller Inhaltsdateien.
 * Darum wird sie im Prozess gehalten, verschlüsselt durch die beiden Baum-SHAs:
 * ändert sich auf `main` oder auf dem Korrektorat-Branch etwas, ist der
 * Schlüssel neu und die Übersicht wird neu gebaut. Kein TTL nötig, keine
 * veralteten Zahlen möglich.
 */
const uebersichtCache = new Map<string, Uebersicht>();

export async function uebersicht(k: Konfig): Promise<Uebersicht> {
  const q = quelleFuer(k);
  const pfade = inhaltsDateien(await q.pfade());
  const branchVorhanden = await q.branchVorhanden();

  const gelesen = await parallel(pfade, 10, async (pfad) => {
    // Gezeigt wird immer der Stand, den Sebastian bearbeitet — also der
    // Korrektorat-Branch, sobald es ihn gibt.
    const [basis, branch] = await Promise.all([
      q.lesen(pfad, "basis"),
      branchVorhanden ? q.lesen(pfad, "branch") : Promise.resolve(null),
    ]);
    return { pfad, basis, branch };
  });

  const schluessel = [
    q.art,
    k.branch,
    ...gelesen.map((g) => `${g.basis?.kennung || ""}:${g.branch?.kennung || ""}`),
  ].join("|");
  const gecacht = uebersichtCache.get(schluessel);
  if (gecacht) return gecacht;

  const dateien: UebersichtDatei[] = [];
  for (const { pfad, basis, branch } of gelesen) {
    const stand = branch || basis;
    if (!stand) continue;
    const { fields } = extract(stand.content, dateiname(pfad));
    if (!fields.length) continue;
    const info = dateiInfo(pfad);
    dateien.push({
      pfad,
      titel: info.titel,
      gruppe: info.gruppe,
      hinweis: info.hinweis,
      felder: fields.length,
      zeichen: fields.reduce((a, f) => a + f.value.length, 0),
      bearbeitet: Boolean(branch) && branch!.kennung !== basis?.kennung,
    });
  }
  const gruppen: Uebersicht["gruppen"] = [];
  for (const d of dateien) {
    let g = gruppen.find((x) => x.titel === d.gruppe);
    if (!g) {
      g = { titel: d.gruppe, dateien: [] };
      gruppen.push(g);
    }
    g.dateien.push(d);
  }

  const ergebnis: Uebersicht = {
    runde: k.branch,
    basis: k.basis,
    branchVorhanden,
    quelle: q.art,
    gruppen,
    felderTotal: dateien.reduce((a, d) => a + d.felder, 0),
    bearbeiteteDateien: dateien.filter((d) => d.bearbeitet).length,
  };
  uebersichtCache.set(schluessel, ergebnis);
  // Der Cache wächst nur mit der Zahl der Repo-Zustände; ein paar Einträge
  // reichen, alles Ältere ist ohnehin nie wieder gefragt.
  if (uebersichtCache.size > 8) {
    uebersichtCache.delete(uebersichtCache.keys().next().value!);
  }
  return ergebnis;
}

/** `extract()` braucht nur die Endung, um TSX von TS zu unterscheiden. */
export function dateiname(pfad: string): string {
  return pfad.split("/").pop() || pfad;
}

/** Begrenzt nebenläufiges Abrufen, damit GitHub nicht mit 60 Anfragen bombardiert wird. */
async function parallel<T, R>(
  items: T[],
  grenze: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let naechster = 0;
  const arbeiter = Array.from({ length: Math.min(grenze, items.length) }, async () => {
    while (naechster < items.length) {
      const i = naechster++;
      out[i] = await fn(items[i]);
    }
  });
  await Promise.all(arbeiter);
  return out;
}
