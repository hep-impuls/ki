"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadTeacherReportSecure } from "@/lib/api";
import { describePoll } from "@/lib/pollLabels";
import type { PollAggregate, TeacherReport } from "@/lib/types";

/**
 * Lehrer-Report (Vorbild: 10mio `teacher.astro`-Report + `klassenreport`).
 *
 * Einzel-Schueler-Tabelle (Code, Fortschritt je Modul, Quiz-Punkte) plus
 * Poll-Aggregate Klasse vs. alle. Statt technischer Poll-IDs zeigt der Report
 * die echte Frage + den Ort in der Einheit (via `describePoll`). Code + Secret
 * aus Query-Params; der Server verifiziert das Secret und liefert die Codes nur
 * bei Erfolg.
 */

function pct(n: number): string {
  return `${Math.round(n)}%`;
}

const sumCounts = (rec: Record<string, number>) =>
  Object.values(rec).reduce((a, b) => a + (Number(b) || 0), 0);

/** Bucket-Reihenfolge: s0..sN numerisch, dann bekannte Pole, sonst alphabetisch. */
function sortBuckets(keys: string[]): string[] {
  const rank = (k: string): [number, number, string] => {
    const m = /^s(\d+)$/.exec(k);
    if (m) return [0, Number(m[1]), ""];
    const fixed: Record<string, number> = {
      richtig: 1, falsch: 2, links: 1, rechts: 2, ja: 1, teils: 2, nein: 3,
    };
    if (fixed[k] != null) return [1, fixed[k], ""];
    return [2, 0, k];
  };
  return [...keys].sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    return ra[0] - rb[0] || ra[1] - rb[1] || ra[2].localeCompare(rb[2]);
  });
}

/** Gewichteter Mittelwert eines Slider-Aggregats (Bucket "sN" → N). */
function sliderAverage(rec: Record<string, number>): { avg: number; n: number } {
  let sum = 0;
  let n = 0;
  for (const [k, c] of Object.entries(rec)) {
    const m = /^s(\d+)$/.exec(k);
    if (!m) continue;
    sum += Number(m[1]) * (Number(c) || 0);
    n += Number(c) || 0;
  }
  return { avg: n ? Math.round(sum / n) : 0, n };
}

function Bar({ label, value, count, tone }: {
  label: string; value: number; count: number; tone: "primary" | "tertiary";
}) {
  return (
    <div className="flex items-center gap-sm">
      <div className="h-3 flex-grow overflow-hidden rounded-full bg-surface-dim">
        <div
          className={tone === "primary" ? "h-full bg-primary" : "h-full bg-tertiary"}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-28 shrink-0 text-label-sm text-on-surface-variant">
        {label} {pct(value)} ({count})
      </span>
    </div>
  );
}

function PollCard({ agg }: { agg: PollAggregate }) {
  const meta = useMemo(() => describePoll(agg.pollId), [agg.pollId]);
  const klasseTotal = sumCounts(agg.klasse);
  const alleTotal = sumCounts(agg.alle);

  const options = useMemo(
    () => sortBuckets([...new Set([...Object.keys(agg.klasse), ...Object.keys(agg.alle)])]),
    [agg],
  );

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
      <p className="text-label-sm uppercase tracking-wider text-tertiary">{meta.kontext}</p>
      <h3 className="mt-xs text-body-md font-medium text-on-surface">{meta.frage}</h3>

      {meta.format === "slider" ? (
        (() => {
          const k = sliderAverage(agg.klasse);
          const a = sliderAverage(agg.alle);
          return (
            <div className="mt-md space-y-xs">
              <Bar label="Klasse Ø" value={k.avg} count={k.n} tone="primary" />
              <Bar label="alle Ø" value={a.avg} count={a.n} tone="tertiary" />
              <p className="pt-xs text-label-sm text-on-surface-variant">
                {meta.optionLabel("s0").replace(/^0\/100 \(|\)$/g, "")} · Skala 0–100
              </p>
            </div>
          );
        })()
      ) : (
        <div className="mt-md space-y-md">
          {options.map((opt) => {
            const k = agg.klasse[opt] ?? 0;
            const a = agg.alle[opt] ?? 0;
            const kPct = klasseTotal ? (k / klasseTotal) * 100 : 0;
            const aPct = alleTotal ? (a / alleTotal) * 100 : 0;
            return (
              <div key={opt}>
                <div className="text-label-sm text-on-surface">{meta.optionLabel(opt)}</div>
                <div className="mt-xs space-y-xs">
                  <Bar label="Klasse" value={kPct} count={k} tone="primary" />
                  <Bar label="alle" value={aPct} count={a} tone="tertiary" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ReportFlow() {
  const search = useSearchParams();
  const code = (search.get("code") ?? "").toUpperCase();
  const secret = search.get("secret") ?? "";

  const [report, setReport] = useState<TeacherReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code || !secret) {
      setError("Klassencode oder Secret fehlt. Bitte über den Lehrer-Hub öffnen.");
      setLoading(false);
      return;
    }
    loadTeacherReportSecure(code, secret)
      .then(setReport)
      .catch((err) => setError(err instanceof Error ? err.message : "Laden fehlgeschlagen."))
      .finally(() => setLoading(false));
  }, [code, secret]);

  const moduleIds = useMemo(() => {
    if (!report) return [];
    const set = new Set<string>();
    for (const s of report.students) for (const m of Object.keys(s.modulePct)) set.add(m);
    return Array.from(set).sort();
  }, [report]);

  const polls = useMemo(() => {
    if (!report) return [];
    return [...report.polls].sort((a, b) =>
      describePoll(a.pollId).sortKey.localeCompare(describePoll(b.pollId).sortKey),
    );
  }, [report]);

  return (
    <main className="mx-auto max-w-5xl px-lg py-xl">
      <header className="border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Lehrpersonen · Report
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">Klasse {code || "—"}</h1>
        {report && (
          <p className="mt-sm text-body-md text-on-surface-variant">
            {report.n} Schüler:innen
          </p>
        )}
      </header>

      {loading && <p className="mt-xl text-body-md text-on-surface-variant">Lädt …</p>}
      {error && <p className="mt-xl text-body-md text-error">{error}</p>}

      {report && !loading && (
        <>
          <section className="mt-xl">
            <h2 className="text-headline-sm text-on-surface">Fortschritt pro Schüler:in</h2>
            {report.students.length === 0 ? (
              <p className="mt-sm text-body-md text-on-surface-variant">
                Noch keine Schüler:innen in dieser Klasse.
              </p>
            ) : (
              <div className="mt-md overflow-x-auto rounded-xl border border-outline-variant">
                <table className="w-full border-collapse text-body-sm">
                  <thead>
                    <tr className="bg-surface-dim text-left text-label-sm text-on-surface-variant">
                      <th className="px-md py-sm">Code</th>
                      {moduleIds.map((m) => (
                        <th key={m} className="px-md py-sm">{m}</th>
                      ))}
                      <th className="px-md py-sm">Quiz</th>
                      <th className="px-md py-sm">Zuletzt aktiv</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.students.map((s, i) => (
                      <tr key={s.code ?? i} className="border-t border-outline-variant">
                        <td className="px-md py-sm font-medium text-on-surface">
                          {s.code ?? "—"}
                        </td>
                        {moduleIds.map((m) => (
                          <td key={m} className="px-md py-sm text-on-surface-variant">
                            {s.modulePct[m] != null ? pct(s.modulePct[m]) : "–"}
                          </td>
                        ))}
                        <td className="px-md py-sm text-on-surface-variant">
                          {s.quizMax > 0 ? `${s.quizPunkte}/${s.quizMax}` : "–"}
                        </td>
                        <td className="px-md py-sm text-on-surface-variant">
                          {s.lastActive ? s.lastActive.slice(0, 10) : "–"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {polls.length > 0 && (
            <section className="mt-xl">
              <h2 className="text-headline-sm text-on-surface">
                Abstimmungen — Klasse vs. alle
              </h2>
              <p className="mt-xs text-body-sm text-on-surface-variant">
                Blau = deine Klasse · Orange = alle Klassen zusammen.
              </p>
              <div className="mt-md grid gap-md sm:grid-cols-2">
                {polls.map((agg) => (
                  <PollCard key={agg.pollId} agg={agg} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={null}>
      <ReportFlow />
    </Suspense>
  );
}
