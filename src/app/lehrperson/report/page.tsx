"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadTeacherReportSecure } from "@/lib/api";
import type { PollAggregate, TeacherReport } from "@/lib/types";

/**
 * Lehrer-Report (Vorbild: 10mio `teacher.astro`-Report + `klassenreport`).
 *
 * Einzel-Schueler-Tabelle (Code, Fortschritt je Modul, Quiz-Punkte) plus
 * Poll-Aggregate Klasse vs. alle (zwei Balken pro Option). Code + Secret aus
 * Query-Params; der Server verifiziert das Secret und liefert die Codes nur bei
 * Erfolg.
 */

function pct(n: number): string {
  return `${Math.round(n)}%`;
}

function PollCard({ agg }: { agg: PollAggregate }) {
  const options = useMemo(() => {
    const keys = new Set([...Object.keys(agg.klasse), ...Object.keys(agg.alle)]);
    return Array.from(keys).sort();
  }, [agg]);

  const sum = (rec: Record<string, number>) =>
    Object.values(rec).reduce((a, b) => a + (Number(b) || 0), 0);
  const klasseTotal = sum(agg.klasse);
  const alleTotal = sum(agg.alle);

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
      <h3 className="text-label-md text-on-surface-variant">{agg.pollId}</h3>
      <div className="mt-md space-y-md">
        {options.map((opt) => {
          const k = agg.klasse[opt] ?? 0;
          const a = agg.alle[opt] ?? 0;
          const kPct = klasseTotal ? (k / klasseTotal) * 100 : 0;
          const aPct = alleTotal ? (a / alleTotal) * 100 : 0;
          return (
            <div key={opt}>
              <div className="flex justify-between text-label-sm text-on-surface-variant">
                <span>{opt}</span>
              </div>
              <div className="mt-xs space-y-xs">
                <div className="flex items-center gap-sm">
                  <div className="h-3 flex-grow overflow-hidden rounded-full bg-surface-dim">
                    <div className="h-full bg-primary" style={{ width: `${kPct}%` }} />
                  </div>
                  <span className="w-24 shrink-0 text-label-sm text-on-surface-variant">
                    Klasse {pct(kPct)} ({k})
                  </span>
                </div>
                <div className="flex items-center gap-sm">
                  <div className="h-3 flex-grow overflow-hidden rounded-full bg-surface-dim">
                    <div className="h-full bg-tertiary" style={{ width: `${aPct}%` }} />
                  </div>
                  <span className="w-24 shrink-0 text-label-sm text-on-surface-variant">
                    alle {pct(aPct)} ({a})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
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

          {report.polls.length > 0 && (
            <section className="mt-xl">
              <h2 className="text-headline-sm text-on-surface">
                Abstimmungen — Klasse vs. alle
              </h2>
              <div className="mt-md grid gap-md sm:grid-cols-2">
                {report.polls.map((agg) => (
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
