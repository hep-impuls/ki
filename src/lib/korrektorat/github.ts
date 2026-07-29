import "server-only";

/**
 * Minimaler GitHub-REST-Client fürs Korrektorat. Kein Octokit — die Route
 * Handlers brauchen fünf Endpunkte, nicht ein SDK.
 *
 * Das Token (`KORREKTORAT_GITHUB_TOKEN`) verlässt den Server nie. Sebastian
 * bekommt keinen Repo-Zugriff, sondern schreibt über diesen Umweg auf einen
 * Korrektorat-Branch, aus dem ein Pull Request wird.
 */

const API = "https://api.github.com";

export interface RepoDatei {
  content: string;
  sha: string;
  path: string;
}

export interface BaumEintrag {
  path: string;
  sha: string;
  size: number;
}

export class GitHub {
  constructor(
    private token: string,
    /** `owner/name` */
    private repo: string,
  ) {}

  private async ruf(pfad: string, init: RequestInit = {}): Promise<Response> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "ki26-korrektorat",
      ...((init.headers as Record<string, string>) || {}),
    };
    if (init.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
    const res = await fetch(`${API}${pfad}`, { ...init, headers, cache: "no-store" });
    if (!res.ok && res.status !== 404) {
      const text = await res.text();
      /* Das Stundenlimit ist der einzige Fehler, den die Korrekturperson selbst
         auflösen kann (warten). Darum eine Meldung in Klartext statt der
         GitHub-Rohantwort, samt Zeitpunkt, ab dem es weitergeht. */
      if (res.status === 403 || res.status === 429) {
        const rest = res.headers.get("x-ratelimit-remaining");
        if (rest === "0" || /rate limit/i.test(text)) {
          const reset = Number(res.headers.get("x-ratelimit-reset") || 0);
          const wann = reset
            ? new Date(reset * 1000).toLocaleTimeString("de-CH", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null;
          throw new Error(
            "GitHub lässt vorübergehend keine weiteren Zugriffe zu (Stundenlimit erreicht). " +
              (wann ? `Ab ${wann} Uhr geht es weiter. ` : "In etwa einer Stunde geht es weiter. ") +
              "Bereits gespeicherte Korrekturen sind nicht verloren.",
          );
        }
      }
      throw new Error(`GitHub ${init.method || "GET"} ${pfad} → ${res.status}: ${text}`);
    }
    return res;
  }

  /** Alle Dateien eines Refs in einem Aufruf — Grundlage der Übersicht. */
  async baum(ref: string): Promise<BaumEintrag[] | null> {
    const res = await this.ruf(
      `/repos/${this.repo}/git/trees/${encodeURIComponent(ref)}?recursive=1`,
    );
    if (res.status === 404) return null;
    const daten = (await res.json()) as {
      tree?: Array<{ path: string; type: string; sha: string; size?: number }>;
    };
    if (!daten.tree) return null;
    return daten.tree
      .filter((e) => e.type === "blob")
      .map((e) => ({ path: e.path, sha: e.sha, size: e.size ?? 0 }));
  }

  async datei(pfad: string, ref: string): Promise<RepoDatei | null> {
    const res = await this.ruf(
      `/repos/${this.repo}/contents/${pfadKodieren(pfad)}?ref=${encodeURIComponent(ref)}`,
    );
    if (res.status === 404) return null;
    const daten = (await res.json()) as { type?: string; content?: string; sha: string; path: string };
    if (daten.type !== "file" || !daten.content) return null;
    return { content: base64Dekodieren(daten.content), sha: daten.sha, path: daten.path };
  }

  /** Datei über ihren Blob-SHA holen — spart den Contents-Umweg bei der Übersicht. */
  async blob(sha: string): Promise<string | null> {
    const res = await this.ruf(`/repos/${this.repo}/git/blobs/${sha}`);
    if (res.status === 404) return null;
    const daten = (await res.json()) as { content?: string };
    return daten.content ? base64Dekodieren(daten.content) : null;
  }

  async refSha(branch: string): Promise<string | null> {
    const res = await this.ruf(`/repos/${this.repo}/git/ref/heads/${encodeURIComponent(branch)}`);
    if (res.status === 404) return null;
    const daten = (await res.json()) as { object?: { sha: string } };
    return daten.object?.sha || null;
  }

  /** Branch anlegen, falls er fehlt; gibt den Kopf-SHA zurück. */
  async branchSicherstellen(name: string, basis: string): Promise<string> {
    const da = await this.refSha(name);
    if (da) return da;
    const basisSha = await this.refSha(basis);
    if (!basisSha) throw new Error(`Basis-Branch ${basis} nicht gefunden`);
    await this.ruf(`/repos/${this.repo}/git/refs`, {
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${name}`, sha: basisSha }),
    });
    return basisSha;
  }

  async dateiCommitten(opts: {
    branch: string;
    pfad: string;
    inhalt: string;
    nachricht: string;
    dateiSha?: string;
  }): Promise<{ commit?: { sha?: string } }> {
    const body: Record<string, unknown> = {
      message: opts.nachricht,
      content: base64Kodieren(opts.inhalt),
      branch: opts.branch,
    };
    if (opts.dateiSha) body.sha = opts.dateiSha;
    const res = await this.ruf(`/repos/${this.repo}/contents/${pfadKodieren(opts.pfad)}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    return res.json();
  }

  /** Offenen PR für den Branch finden oder anlegen. Ein PR pro Runde. */
  async prSicherstellen(opts: {
    branch: string;
    basis: string;
    titel: string;
    text: string;
  }): Promise<{ html_url?: string; number?: number }> {
    const [owner] = this.repo.split("/");
    const res = await this.ruf(
      `/repos/${this.repo}/pulls?state=open&head=${encodeURIComponent(`${owner}:${opts.branch}`)}`,
    );
    const offen = (await res.json()) as Array<{ html_url?: string; number?: number }>;
    if (Array.isArray(offen) && offen.length > 0) return offen[0];

    const neu = await this.ruf(`/repos/${this.repo}/pulls`, {
      method: "POST",
      body: JSON.stringify({
        title: opts.titel,
        body: opts.text,
        head: opts.branch,
        base: opts.basis,
      }),
    });
    return neu.json();
  }
}

function pfadKodieren(pfad: string): string {
  return pfad
    .split("/")
    .map((teil) => encodeURIComponent(teil))
    .join("/");
}

function base64Dekodieren(b64: string): string {
  return Buffer.from(b64.replace(/\n/g, ""), "base64").toString("utf8");
}

function base64Kodieren(text: string): string {
  return Buffer.from(text, "utf8").toString("base64");
}
