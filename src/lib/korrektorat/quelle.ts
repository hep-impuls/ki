import "server-only";

/**
 * Woher der Editor die Texte nimmt — zwei Quellen mit derselben Schnittstelle.
 *
 *  · **github** (Normalbetrieb): liest `main` und den Korrektorat-Branch über
 *    die REST-API, schreibt Commits. Braucht `KORREKTORAT_GITHUB_TOKEN`.
 *  · **lokal** (`KORREKTORAT_QUELLE=lokal`): liest das Arbeitsverzeichnis.
 *    Damit lässt sich der Editor ohne Token und ohne Repo-Zugriff durchklicken
 *    — Übersicht, Abschnitte, Felder, Suche. **Speichern ist gesperrt**, denn
 *    ein Editor, der still ins Arbeitsverzeichnis schreibt, wäre eine
 *    Überraschung, die niemand will.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { GitHub } from "./github";
import type { Konfig } from "./server";

export interface DateiStand {
  content: string;
  /** GitHub-Blob-SHA bzw. lokal `mtime:size`. Nur als Cache-Schlüssel gedacht. */
  kennung: string;
  /** Für den nächsten Commit nötig; lokal leer. */
  sha: string;
}

export interface Quelle {
  art: "github" | "lokal";
  schreibbar: boolean;
  /** Alle Dateipfade, aus denen das Inventar filtert. */
  pfade(): Promise<string[]>;
  /** Existiert der Korrektorat-Branch schon? */
  branchVorhanden(): Promise<boolean>;
  /**
   * Nur die Kennung, ohne den Inhalt zu holen. Bei GitHub steht sie im Baum,
   * der ohnehin schon abgerufen ist — der Aufruf kostet also keine einzige
   * Anfrage. Damit lässt sich der Cache-Schlüssel bilden, BEVOR man Inhalte
   * lädt (siehe `inhaltsIndex` in server.ts).
   */
  kennung(pfad: string, wo: "basis" | "branch"): Promise<string | null>;
  lesen(pfad: string, wo: "basis" | "branch"): Promise<DateiStand | null>;
}

export function quelleFuer(k: Konfig): Quelle {
  return process.env.KORREKTORAT_QUELLE === "lokal" ? lokaleQuelle() : githubQuelle(k);
}

/* ── GitHub ────────────────────────────────────────────────────────────────── */

function githubQuelle(k: Konfig): Quelle {
  const gh = new GitHub(k.token, k.repo);
  // Die Bäume werden pro Anfrage mehrfach gebraucht (Pfadliste, Kennungen,
  // Branch-Existenz) — einmal holen genügt.
  const baeume = new Map<string, Promise<Map<string, string> | null>>();

  function baum(ref: string) {
    let p = baeume.get(ref);
    if (!p) {
      p = gh.baum(ref).then((eintraege) => {
        if (!eintraege) return null;
        return new Map(eintraege.map((e) => [e.path, e.sha]));
      });
      baeume.set(ref, p);
    }
    return p;
  }

  return {
    art: "github",
    schreibbar: true,

    async pfade() {
      const b = await baum(k.basis);
      if (!b) throw new Error(`Branch ${k.basis} nicht gefunden in ${k.repo}`);
      return [...b.keys()];
    },

    async branchVorhanden() {
      return (await baum(k.branch)) !== null;
    },

    async kennung(pfad, wo) {
      const b = await baum(wo === "basis" ? k.basis : k.branch);
      return b?.get(pfad) ?? null;
    },

    async lesen(pfad, wo) {
      const ref = wo === "basis" ? k.basis : k.branch;
      const b = await baum(ref);
      const sha = b?.get(pfad);
      if (!sha) return null;
      // Über den Blob-SHA statt über den Contents-Endpunkt: derselbe Aufwand,
      // aber die Kennung ist schon bekannt.
      const inhalt = await gh.blob(sha);
      if (inhalt === null) return null;
      return { content: inhalt, kennung: sha, sha };
    },
  };
}

/* ── Arbeitsverzeichnis ────────────────────────────────────────────────────── */

function lokaleQuelle(): Quelle {
  // Die `turbopackIgnore`-Kommentare unten unterdrücken die Trace-Warnung des
  // Bundlers. Die Pfade stehen erst zur Laufzeit fest; ohne den Hinweis würde
  // Turbopack sicherheitshalber das ganze Projekt in das Funktionsbündel
  // aufnehmen. Dieser Zweig läuft ausschliesslich lokal — auf Vercel ist
  // `KORREKTORAT_QUELLE` nie `lokal`.
  const wurzel = process.cwd();

  return {
    art: "lokal",
    schreibbar: false,

    async pfade() {
      return sammle(path.join(/* turbopackIgnore: true */ wurzel, "src"));
    },

    async branchVorhanden() {
      return false;
    },

    async kennung(pfad, wo) {
      if (wo === "branch") return null; // lokal gibt es nur einen Stand
      const abs = path.join(/* turbopackIgnore: true */ wurzel, pfad);
      try {
        const stat = await fs.stat(abs);
        return `${stat.mtimeMs}:${stat.size}`;
      } catch {
        return null;
      }
    },

    async lesen(pfad, wo) {
      if (wo === "branch") return null; // lokal gibt es nur einen Stand
      const abs = path.join(/* turbopackIgnore: true */ wurzel, pfad);
      try {
        const [inhalt, stat] = await Promise.all([fs.readFile(abs, "utf8"), fs.stat(abs)]);
        return { content: inhalt, kennung: `${stat.mtimeMs}:${stat.size}`, sha: "" };
      } catch {
        return null;
      }
    },
  };

  async function sammle(dir: string, acc: string[] = []): Promise<string[]> {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      const p = path.join(/* turbopackIgnore: true */ dir, e.name);
      if (e.isDirectory()) await sammle(p, acc);
      else acc.push(path.relative(wurzel, p).split(path.sep).join("/"));
    }
    return acc;
  }
}
