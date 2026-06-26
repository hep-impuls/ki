"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { getSession } from "@/lib/session";
import { loadStudentClassReport } from "@/lib/api";
import type { StudentClassReport } from "@/lib/types";

/**
 * Schueler-facing Klassenreport (Vorbild: 10mio `klassenreport.astro`).
 *
 * Anonymer Vergleich mit der eigenen Klasse: niemand sieht Codes — weder die
 * anderen noch der Aufrufer. Gespeist von `student/class-report` (Admin SDK,
 * k-Anonymitaet n>=5; gibt nie Codes zurueck, nur sortierte Verteilungs-Arrays).
 *
 * Zustaende:
 *   - keine Session    → Hinweis + Link auf /start
 *   - ohne Klassencode → freundlicher Hinweis (Report nur mit Klasse)
 *   - n < 5 / leer     → "noch nicht genug Daten"
 *   - Report           → Summary-Cards · Verteilungs-Histogramm (eigenes Quartil
 *     markiert) · Modul-Vergleich Klasse-Ø vs. eigenes Ø
 */

type LoadState =
  | { kind: "loading" }
  | { kind: "no-session" }
  | { kind: "no-class" }
  | { kind: "empty" }
  | { kind: "error"; message: string }
  | { kind: "ready"; report: StudentClassReport };

function pct(n: number): string {
  return `${Math.round(n)}%`;
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

/** 5 Buckets a 20 % (0–19, 20–39, …, 80–100). */
const BUCKETS = [
  { lo: 0, hi: 19, label: "0–19" },
  { lo: 20, hi: 39, label: "20–39" },
  { lo: 40, hi: 59, label: "40–59" },
  { lo: 60, hi: 79, label: "60–79" },
  { lo: 80, hi: 100, label: "80–100" },
];

function bucketIndex(value: number): number {
  const i = BUCKETS.findIndex((b) => value >= b.lo && value <= b.hi);
  return i === -1 ? BUCKETS.length - 1 : i;
}

export default function KlassenreportPage() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    const session = getSession();
    if (!session?.studentCode) {
      setState({ kind: "no-session" });
      return;
    }
    if (!session.teacherCode) {
      setState({ kind: "no-class" });
      return;
    }
    const code = session.studentCode;
    let cancelled = false;
    loadStudentClassReport(code)
      .then((report) => {
        if (cancelled) return;
        if (!report) setState({ kind: "empty" });
        else setState({ kind: "ready", report });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          kind: "error",
          message: err instanceof Error ? err.message : "Laden fehlgeschlagen.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-4xl flex-col gap-xl">
        <header className="flex flex-col gap-sm border-b border-outline-variant pb-lg">
          <div className="flex items-center gap-sm">
            <span
              className="material-symbols-outlined text-2xl text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              groups
            </span>
            <h1 className="text-headline-lg text-on-surface">Klassenreport</h1>
          </div>
          <p className="text-body-md text-on-surface-variant">
            Anonymer Vergleich mit deiner Klasse. Niemand sieht deinen Code — und
            du siehst auch keine anderen Codes.
          </p>
        </header>

        {state.kind === "loading" && (
          <div className="rounded-xl border border-outline-variant bg-surface-bright p-xl text-center text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-2xl">
              progress_activity
            </span>
            <p className="mt-sm text-body-md">Lade Klassendaten …</p>
          </div>
        )}

        {state.kind === "no-session" && (
          <EmptyCard
            icon="key"
            text="Du brauchst zuerst einen persönlichen Code, um deinen Fortschritt mit der Klasse zu vergleichen."
            cta={{ href: "/start", label: "Code erstellen" }}
          />
        )}

        {state.kind === "no-class" && (
          <EmptyCard
            icon="school"
            text="Du bist noch keiner Klasse beigetreten. Mit einem Klassencode deiner Lehrperson siehst du hier den anonymen Vergleich."
            cta={{ href: "/start", label: "Klassencode eingeben" }}
          />
        )}

        {state.kind === "empty" && (
          <EmptyCard
            icon="hourglass_empty"
            text="Noch nicht genug Daten in deiner Klasse — der Vergleich erscheint, sobald mindestens fünf Lernende angefangen haben (Anonymität)."
            cta={{ href: "/lernen/lernseite-1", label: "Zur Lerneinheit" }}
          />
        )}

        {state.kind === "error" && (
          <div className="rounded-xl border border-error/30 bg-error/5 p-lg text-body-md text-error">
            {state.message}
          </div>
        )}

        {state.kind === "ready" && <Report report={state.report} />}
      </div>
    </AppLayout>
  );
}

function EmptyCard({
  icon,
  text,
  cta,
}: {
  icon: string;
  text: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center gap-md rounded-xl border border-outline-variant bg-surface-bright p-xl text-center">
      <span className="material-symbols-outlined text-3xl text-on-surface-variant">
        {icon}
      </span>
      <p className="max-w-md text-body-md text-on-surface-variant">{text}</p>
      <Link
        href={cta.href}
        className="inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:bg-on-primary-container"
      >
        {cta.label}
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </Link>
    </div>
  );
}

function Report({ report }: { report: StudentClassReport }) {
  const youOverall = useMemo(() => average(Object.values(report.you)), [report.you]);
  const classOverall = useMemo(
    () => average(report.distribution),
    [report.distribution],
  );
  const hasYou = Object.keys(report.you).length > 0;

  // Quartil/Perzentil des eigenen Werts in der sortierten Verteilung.
  const percentile = useMemo(() => {
    const d = report.distribution;
    if (!d.length || !hasYou) return null;
    const below = d.filter((v) => v < youOverall).length;
    return Math.round((below / d.length) * 100);
  }, [report.distribution, youOverall, hasYou]);

  // Histogramm-Buckets.
  const histogram = useMemo(() => {
    const counts = BUCKETS.map(() => 0);
    for (const v of report.distribution) counts[bucketIndex(v)] += 1;
    const maxCount = Math.max(1, ...counts);
    return { counts, maxCount };
  }, [report.distribution]);

  const youBucket = hasYou ? bucketIndex(youOverall) : -1;

  const moduleIds = useMemo(() => {
    const set = new Set<string>([
      ...Object.keys(report.you),
      ...Object.keys(report.classAvg),
    ]);
    return Array.from(set).sort();
  }, [report.you, report.classAvg]);

  return (
    <div className="flex flex-col gap-xl">
      {/* Summary-Cards */}
      <div className="grid grid-cols-2 gap-md md:grid-cols-3">
        <StatCard label="Lernende" value={String(report.n)} tone="surface" />
        <StatCard label="Klasse Ø" value={pct(classOverall)} tone="primary" />
        <StatCard
          label="Du"
          value={hasYou ? pct(youOverall) : "–"}
          tone="tertiary"
        />
      </div>

      {percentile != null && (
        <p className="text-body-sm text-on-surface-variant">
          Du liegst über{" "}
          <span className="font-semibold text-on-surface">{percentile}%</span> deiner
          Klasse.
        </p>
      )}

      {/* Verteilungs-Histogramm */}
      <section className="rounded-xl border border-outline-variant bg-surface-bright p-lg">
        <h2 className="text-headline-sm text-on-surface">Verteilung in der Klasse</h2>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          Wie viele Lernende in welchem Fortschritts-Bereich liegen
          {hasYou && " — dein Bereich ist hervorgehoben"}.
        </p>
        <div className="mt-lg flex items-end justify-between gap-sm sm:gap-md">
          {BUCKETS.map((b, i) => {
            const count = histogram.counts[i];
            const h = Math.round((count / histogram.maxCount) * 100);
            const isYou = i === youBucket;
            return (
              <div key={b.label} className="flex flex-1 flex-col items-center gap-xs">
                <span className="text-label-sm text-on-surface-variant">{count}</span>
                <div className="flex h-32 w-full items-end">
                  <div
                    className={
                      isYou
                        ? "w-full rounded-t-md bg-tertiary"
                        : "w-full rounded-t-md bg-primary/30"
                    }
                    style={{ height: `${Math.max(h, count > 0 ? 6 : 2)}%` }}
                  />
                </div>
                <span
                  className={
                    isYou
                      ? "text-label-sm font-semibold text-tertiary"
                      : "text-label-sm text-on-surface-variant"
                  }
                >
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modul-Vergleich */}
      {moduleIds.length > 0 && (
        <section className="rounded-xl border border-outline-variant bg-surface-bright p-lg">
          <h2 className="text-headline-sm text-on-surface">
            Pro Modul — du vs. Klasse
          </h2>
          <div className="mt-lg flex flex-col gap-lg">
            {moduleIds.map((m) => {
              const you = report.you[m];
              const klasse = report.classAvg[m] ?? 0;
              return (
                <div key={m}>
                  <p className="text-label-md text-on-surface">{m}</p>
                  <div className="mt-sm space-y-xs">
                    <CompareBar
                      label="Du"
                      value={you}
                      tone="tertiary"
                      empty={you == null}
                    />
                    <CompareBar label="Klasse Ø" value={klasse} tone="primary" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <p className="text-center text-label-sm text-on-surface-variant">
        Klasse {report.classCode} · {report.n} Lernende · anonymisiert (k ≥ 5)
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "surface" | "primary" | "tertiary";
}) {
  const valueClass =
    tone === "primary"
      ? "text-primary"
      : tone === "tertiary"
        ? "text-tertiary"
        : "text-on-surface";
  return (
    <div className="flex flex-col gap-xs rounded-xl border border-outline-variant bg-surface-bright p-lg">
      <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
        {label}
      </span>
      <span className={`text-headline-lg ${valueClass}`}>{value}</span>
    </div>
  );
}

function CompareBar({
  label,
  value,
  tone,
  empty = false,
}: {
  label: string;
  value: number | undefined;
  tone: "primary" | "tertiary";
  empty?: boolean;
}) {
  const barClass = tone === "primary" ? "bg-primary" : "bg-tertiary";
  const w = empty ? 0 : Math.max(0, Math.min(100, value ?? 0));
  return (
    <div className="flex items-center gap-sm">
      <span className="w-20 shrink-0 text-label-sm text-on-surface-variant">{label}</span>
      <div className="h-3 flex-grow overflow-hidden rounded-full bg-surface-dim">
        <div className={`h-full ${barClass}`} style={{ width: `${w}%` }} />
      </div>
      <span className="w-12 shrink-0 text-right text-label-sm text-on-surface-variant">
        {empty ? "–" : pct(value ?? 0)}
      </span>
    </div>
  );
}
