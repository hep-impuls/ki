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

/** Eine Datei im Index, mit ihren Texten in Dokumentreihenfolge. */
interface IndexDatei {
  pfad: string;
  titel: string;
  gruppe: string;
  hinweis: string | null;
  bearbeitet: boolean;
  zeichen: number;
  /** Nur was Übersicht und Suche brauchen — nicht die vollen Felder. */
  felder: Array<{ id: string; section: string; label: string; value: string }>;
}

/**
 * Index aller Inhaltsdateien: ~60 Blob-Abrufe und einmal Parsen. Er trägt
 * sowohl die Übersicht als auch die Volltextsuche — beide sollen sich **einen**
 * Durchgang teilen.
 *
 * Gehalten wird er im Prozess, verschlüsselt durch die Kennungen aller Dateien:
 * ändert sich auf `main` oder auf dem Korrektorat-Branch irgendetwas, ist der
 * Schlüssel neu und der Index wird gebaut. Kein TTL nötig, keine veralteten
 * Zahlen und keine veralteten Treffer möglich.
 */
const indexCache = new Map<string, IndexDatei[]>();

interface Index {
  dateien: IndexDatei[];
  branchVorhanden: boolean;
  art: "github" | "lokal";
}

async function inhaltsIndex(k: Konfig): Promise<Index> {
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
  const gecacht = indexCache.get(schluessel);
  if (gecacht) return { dateien: gecacht, branchVorhanden, art: q.art };

  const dateien: IndexDatei[] = [];
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
      bearbeitet: Boolean(branch) && branch!.kennung !== basis?.kennung,
      zeichen: fields.reduce((a, f) => a + f.value.length, 0),
      felder: fields.map((f) => ({
        id: f.id,
        section: f.section,
        label: f.label,
        value: f.value,
      })),
    });
  }

  indexCache.set(schluessel, dateien);
  // Der Cache wächst nur mit der Zahl der Repo-Zustände; ein paar Einträge
  // reichen, alles Ältere ist ohnehin nie wieder gefragt.
  if (indexCache.size > 4) {
    indexCache.delete(indexCache.keys().next().value!);
  }
  return { dateien, branchVorhanden, art: q.art };
}

export async function uebersicht(k: Konfig): Promise<Uebersicht> {
  const { dateien, branchVorhanden, art } = await inhaltsIndex(k);

  const gruppen: Uebersicht["gruppen"] = [];
  for (const d of dateien) {
    let g = gruppen.find((x) => x.titel === d.gruppe);
    if (!g) {
      g = { titel: d.gruppe, dateien: [] };
      gruppen.push(g);
    }
    g.dateien.push({
      pfad: d.pfad,
      titel: d.titel,
      gruppe: d.gruppe,
      hinweis: d.hinweis,
      felder: d.felder.length,
      zeichen: d.zeichen,
      bearbeitet: d.bearbeitet,
    });
  }

  return {
    runde: k.branch,
    basis: k.basis,
    branchVorhanden,
    quelle: art,
    gruppen,
    felderTotal: dateien.reduce((a, d) => a + d.felder.length, 0),
    bearbeiteteDateien: dateien.filter((d) => d.bearbeitet).length,
  };
}

/* ── Volltextsuche ─────────────────────────────────────────────────────────── */

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
  /** Wie oft der Begriff in dieser Textstelle vorkommt. */
  anzahl: number;
}

export interface SuchErgebnis {
  begriff: string;
  treffer: Treffer[];
  /** Gefundene Textstellen insgesamt — kann grösser sein als `treffer.length`. */
  gesamt: number;
  /** Betroffene Dateien insgesamt. */
  dateien: number;
  /** Liste wurde gekürzt. */
  gekuerzt: boolean;
}

const MAX_TREFFER = 200;
const AUSZUG_RAND = 60;

/**
 * Sucht eine Zeichenfolge in **allen** Textstellen aller Inhaltsdateien.
 *
 * Der Zweck ist der Alltag der Korrekturperson: Sie sieht im Lernset einen
 * Fehler und weiss nicht, in welcher der 59 Dateien er steht. Gesucht wird
 * darum in dem, was sie sieht — im Text —, nicht in Dateinamen oder Kennungen.
 *
 * Ohne Beachtung der Gross-/Kleinschreibung; auf Wunsch nur ganze Wörter, damit
 * «das» nicht in «Datensatz» anschlägt.
 */
export async function suchen(
  k: Konfig,
  begriff: string,
  optionen: { ganzeWoerter?: boolean } = {},
): Promise<SuchErgebnis> {
  const gesucht = begriff.trim();
  if (gesucht.length < 2) {
    return { begriff: gesucht, treffer: [], gesamt: 0, dateien: 0, gekuerzt: false };
  }

  const { dateien } = await inhaltsIndex(k);
  const muster = new RegExp(
    optionen.ganzeWoerter ? `(?<![\\p{L}\\p{N}])${maskieren(gesucht)}(?![\\p{L}\\p{N}])` : maskieren(gesucht),
    "giu",
  );

  const treffer: Treffer[] = [];
  let gesamt = 0;
  let betroffeneDateien = 0;

  for (const datei of dateien) {
    let inDatei = 0;
    for (const feld of datei.felder) {
      muster.lastIndex = 0;
      const funde = [...feld.value.matchAll(muster)];
      if (funde.length === 0) continue;
      gesamt++;
      inDatei++;
      if (treffer.length >= MAX_TREFFER) continue;

      const erster = funde[0];
      const start = erster.index ?? 0;
      const ende = start + erster[0].length;
      const vonAuszug = Math.max(0, start - AUSZUG_RAND);
      const bisAuszug = Math.min(feld.value.length, ende + AUSZUG_RAND);
      const vorne = vonAuszug > 0 ? "…" : "";
      const hinten = bisAuszug < feld.value.length ? "…" : "";

      treffer.push({
        pfad: datei.pfad,
        dateiTitel: datei.titel,
        gruppe: datei.gruppe,
        feldId: feld.id,
        section: feld.section,
        label: feld.label,
        auszug: vorne + feld.value.slice(vonAuszug, bisAuszug) + hinten,
        von: vorne.length + (start - vonAuszug),
        bis: vorne.length + (ende - vonAuszug),
        anzahl: funde.length,
      });
    }
    if (inDatei > 0) betroffeneDateien++;
  }

  return {
    begriff: gesucht,
    treffer,
    gesamt,
    dateien: betroffeneDateien,
    gekuerzt: gesamt > treffer.length,
  };
}

/** Suchbegriffe sind Text, keine regulären Ausdrücke. */
function maskieren(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
