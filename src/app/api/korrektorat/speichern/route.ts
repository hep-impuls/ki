/**
 * POST /api/korrektorat/speichern — `{ pfad, felder }` → Commit auf den
 * Korrektorat-Branch, Pull Request anlegen oder mitwachsen lassen.
 *
 * Ablauf und Sicherheitsnetze:
 *
 *  1. Nur Inhaltsdateien (dieselbe Schranke wie beim Lesen).
 *  2. Branch anlegen, falls es die Runde noch nicht gibt.
 *  3. Datei **frisch** holen und neu parsen. Positionen und Feld-IDs des
 *     Clients werden dagegen geprüft: Wer mit veralteten Positionen speichert
 *     (weil in der Zwischenzeit auf `main` gepusht wurde), bekommt das Feld
 *     abgelehnt statt an die falsche Stelle geschrieben.
 *  4. Übernommen wird die Feld-Beschreibung aus dem *frischen* Parse, vom
 *     Client kommt nur der neue Wortlaut. Damit kann kein Client Offsets,
 *     Literal-Art oder Maskierung diktieren.
 */

import {
  dateiname,
  fehlerAntwort,
  githubClient,
  json,
  konfig,
  lokalerModus,
  sitzungVerlangen,
} from "@/lib/korrektorat/server";
import { istInhaltsDatei } from "@/lib/korrektorat/inventar.mjs";
import { apply, extract, pruefeEdits } from "@/lib/korrektorat/parser.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface FeldEingabe {
  id?: string;
  value?: string;
  loc?: { start?: number; end?: number };
}

export async function POST(request: Request) {
  try {
    await sitzungVerlangen(request);
    const k = konfig();
    const body = (await request.json().catch(() => null)) as
      | { pfad?: string; felder?: FeldEingabe[] }
      | null;
    const pfad = (body?.pfad || "").trim();
    const eingaben = Array.isArray(body?.felder) ? body!.felder! : null;

    if (lokalerModus()) {
      return json(
        {
          fehler:
            "Vorschau aus dem Arbeitsverzeichnis (KORREKTORAT_QUELLE=lokal) — Speichern ist hier gesperrt.",
        },
        409,
      );
    }
    if (!pfad || !istInhaltsDatei(pfad)) {
      return json({ fehler: "Diese Datei gehört nicht zum Korrektorat." }, 400);
    }
    if (!eingaben) return json({ fehler: "felder[] fehlt." }, 400);

    const gh = githubClient(k);
    await gh.branchSicherstellen(k.branch, k.basis);
    const datei = (await gh.datei(pfad, k.branch)) || (await gh.datei(pfad, k.basis));
    if (!datei) return json({ fehler: "Datei nicht gefunden." }, 404);

    const frisch = extract(datei.content, dateiname(pfad));
    const { anzuwenden, uebersprungen } = pruefeEdits(frisch.fields, eingaben);

    if (anzuwenden.length === 0) {
      return json({ ok: true, angewandt: 0, uebersprungen, hinweis: "Keine Änderungen." });
    }

    let neuerInhalt: string;
    try {
      neuerInhalt = apply(datei.content, anzuwenden);
    } catch (err) {
      return json({ fehler: err instanceof Error ? err.message : String(err) }, 400);
    }

    const liste = anzuwenden
      .slice(0, 6)
      .map((f) => `- ${f.section} · ${f.label}`)
      .join("\n");
    const mehr = anzuwenden.length > 6 ? `\n… und ${anzuwenden.length - 6} weitere` : "";
    await gh.dateiCommitten({
      branch: k.branch,
      pfad,
      inhalt: neuerInhalt,
      dateiSha: datei.sha,
      nachricht: `Korrektorat: ${pfad} (${anzuwenden.length} ${anzuwenden.length === 1 ? "Änderung" : "Änderungen"})\n\n${liste}${mehr}`,
    });

    const pr = await gh.prSicherstellen({
      branch: k.branch,
      basis: k.basis,
      titel: `Korrektorat — ${k.branch}`,
      text:
        "Korrekturen aus dem Korrektorat-Editor (`/korrektorat`).\n\n" +
        "Pro Datei ein Commit je Speichervorgang. Der Editor ändert nur Wortlaut — " +
        "keine Struktur, keine IDs, keine Links.",
    });

    return json({
      ok: true,
      angewandt: anzuwenden.length,
      uebersprungen,
      prUrl: pr.html_url || null,
      prNummer: pr.number || null,
      runde: k.branch,
    });
  } catch (err) {
    return fehlerAntwort(err);
  }
}
