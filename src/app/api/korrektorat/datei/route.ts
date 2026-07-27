/**
 * POST /api/korrektorat/datei — `{ pfad }` → alle Felder dieser Datei.
 *
 * POST statt GET, weil der Pfad Schrägstriche enthält (gleiche Linie wie die
 * übrigen ki26-Routen, die alle POST sind).
 *
 * Gelesen wird vom Korrektorat-Branch, sobald es ihn gibt — so sieht Sebastian
 * seine gesammelte Arbeit. Wo sein Stand von `main` abweicht, wird der
 * ursprüngliche Wortlaut als `mainValue` mitgeliefert, damit sich ein einzelnes
 * Feld zurücksetzen lässt.
 */

import { dateiname, fehlerAntwort, json, konfig, sitzungVerlangen } from "@/lib/korrektorat/server";
import { quelleFuer } from "@/lib/korrektorat/quelle";
import { dateiInfo, istInhaltsDatei } from "@/lib/korrektorat/inventar.mjs";
import { extract } from "@/lib/korrektorat/parser.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await sitzungVerlangen(request);
    const k = konfig();
    const body = (await request.json().catch(() => null)) as { pfad?: string } | null;
    const pfad = (body?.pfad || "").trim();

    // Schranke: nur Inhaltsdateien. Ohne diese Prüfung wäre die Route ein
    // Leseloch ins ganze Repo.
    if (!pfad || !istInhaltsDatei(pfad)) {
      return json({ fehler: "Diese Datei gehört nicht zum Korrektorat." }, 400);
    }

    const q = quelleFuer(k);
    const [basisDatei, branchDatei] = await Promise.all([
      q.lesen(pfad, "basis"),
      q.lesen(pfad, "branch"), // null solange der Branch nicht existiert
    ]);
    if (!basisDatei) return json({ fehler: "Datei nicht gefunden." }, 404);

    const stand = branchDatei || basisDatei;
    const { fields } = extract(stand.content, dateiname(pfad));

    // Wortlaut auf `main` anhängen, wo der Branch abweicht.
    if (branchDatei && branchDatei.content !== basisDatei.content) {
      const basisWerte = new Map(
        extract(basisDatei.content, dateiname(pfad)).fields.map((f) => [f.id, f.value]),
      );
      for (const f of fields) {
        const vorher = basisWerte.get(f.id);
        if (vorher !== undefined && vorher !== f.value) f.mainValue = vorher;
      }
    }

    const info = dateiInfo(pfad);
    return json({
      pfad,
      titel: info.titel,
      gruppe: info.gruppe,
      hinweis: info.hinweis,
      sha: stand.sha,
      vomBranch: Boolean(branchDatei),
      nurLesen: !q.schreibbar,
      felder: fields,
    });
  } catch (err) {
    return fehlerAntwort(err);
  }
}
