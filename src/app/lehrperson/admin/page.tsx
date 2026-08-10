"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loadAdminReportSecure } from "@/lib/api";
import type { AdminReport } from "@/lib/types";

/**
 * Nutzungsübersicht über alle Klassen und Codes.
 *
 * Anmeldung wie beim Lehrer-Report: Klassencode + eigenes Secret aus den
 * Query-Params; die Berechtigung prüft der Server (`istAdmin` bzw.
 * `ADMIN_CLASS_CODES`). Absichtlich **ohne Fortschritts-Codes** — die Seite
 * zeigt Zahlen und Klassen, keine Einzelpersonen (Entscheid 2026-08-10).
 */

function pct(n: number): string {
  return `${Math.round(n)}%`;
}

/** ISO → «10.08.2026, 14:32», leer wenn nie. */
function zeit(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Kennzahl({
  wert,
  titel,
  hinweis,
}: {
  wert: number | string;
  titel: string;
  hinweis?: string;
}) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-bright p-md">
      <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">{titel}</p>
      <p
        className="mt-xs text-headline-md text-on-surface"
        style={{ fontFamily: "ui-monospace, monospace" }}
      >
        {wert}
      </p>
      {hinweis && <p className="mt-xs text-label-sm text-on-surface-variant">{hinweis}</p>}
    </div>
  );
}

/**
 * Erfüllungsgrad als Balken plus Zahl — oder ein ehrlicher Strich. Lernseite 2
 * spiegelt keinen Prozentwert, sondern eigene Strukturen; dort stünde sonst
 * überall «0 %», obwohl dort gearbeitet wurde.
 */
function Stand({ anteil }: { anteil: number | null }) {
  if (anteil === null) {
    return (
      <span className="text-on-surface-variant" title="Dieses Modul spiegelt keinen Erfüllungsgrad">
        ohne Prozentwert
      </span>
    );
  }
  const breite = Math.max(0, Math.min(100, anteil));
  return (
    <div className="flex items-center gap-sm">
      <div
        className="h-2 w-full rounded-full bg-surface-variant"
        role="img"
        aria-label={`${Math.round(breite)} Prozent`}
      >
        <div className="h-2 rounded-full bg-tertiary" style={{ width: `${breite}%` }} />
      </div>
      <span className="shrink-0 tabular-nums text-on-surface">{pct(breite)}</span>
    </div>
  );
}

function AdminFlow() {
  const search = useSearchParams();
  const code = (search.get("code") ?? "").toUpperCase();
  const secret = search.get("secret") ?? "";

  const [report, setReport] = useState<AdminReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const laden = useCallback(
    (frisch: boolean) => {
      if (!code || !secret) {
        setError("Klassencode oder Secret fehlt. Bitte über den Lehrer-Hub öffnen.");
        setLoading(false);
        return;
      }
      setLoading(true);
      loadAdminReportSecure(code, secret, frisch)
        .then((r) => {
          setReport(r);
          setError(null);
        })
        .catch((err) => setError(err instanceof Error ? err.message : "Laden fehlgeschlagen."))
        .finally(() => setLoading(false));
    },
    [code, secret],
  );

  useEffect(() => {
    laden(false);
  }, [laden]);

  return (
    <main className="mx-auto max-w-5xl px-lg py-xl">
      <Link
        href="/lehrperson"
        className="inline-flex items-center gap-xs text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Zurück zum Lehrer-Hub
      </Link>

      <header className="mt-lg border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">Lehrpersonen</p>
        <h1 className="mt-sm text-headline-xl text-on-surface">Nutzung im Überblick</h1>
        <p className="mt-sm text-body-lg text-on-surface-variant">
          Wie viele Personen mit dem Lernset unterwegs sind, wie weit sie kommen und
          wo es liegen bleibt — über alle Klassen hinweg. Einzelne Fortschritts-Codes
          zeigt diese Seite bewusst nicht.
        </p>
      </header>

      {loading && !report && (
        <p className="mt-xl text-body-md text-on-surface-variant">Zahlen werden geladen …</p>
      )}

      {error && (
        <div className="mt-xl rounded-xl border border-outline-variant bg-surface-bright p-lg">
          <p className="text-body-md text-on-surface">{error}</p>
          <p className="mt-sm text-body-sm text-on-surface-variant">
            Die Gesamtübersicht ist nur für freigeschaltete Klassencodes sichtbar. Den
            Klassen-Report öffnest du über den{" "}
            <Link href="/lehrperson" className="underline">
              Lehrer-Hub
            </Link>
            .
          </p>
        </div>
      )}

      {report && (
        <>
          <div className="mt-lg flex flex-wrap items-center justify-between gap-sm">
            <p className="text-label-sm text-on-surface-variant">
              Stand: {zeit(report.stand)}
              {report.ausCache && " · aus dem Zwischenspeicher (max. 10 Minuten alt)"}
            </p>
            <button
              type="button"
              onClick={() => laden(true)}
              disabled={loading}
              className="inline-flex items-center gap-xs rounded-full border border-outline-variant px-md py-xs text-label-md text-on-surface hover:bg-surface-variant disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              {loading ? "Lädt …" : "Neu berechnen"}
            </button>
          </div>

          {/* ── Kopfzahlen ───────────────────────────────────────────────── */}
          <section className="mt-lg">
            <h2 className="text-title-lg text-on-surface">Wer ist unterwegs</h2>
            <div className="mt-md grid gap-sm sm:grid-cols-2 lg:grid-cols-4">
              <Kennzahl
                wert={report.codesGesamt}
                titel="Fortschritts-Codes"
                hinweis={`${report.mitFortschritt} davon mit gespiegeltem Fortschritt`}
              />
              <Kennzahl
                wert={report.codesMitKlasse}
                titel="mit Klasse"
                hinweis={`${report.codesOhneKlasse} ohne Klasse`}
              />
              <Kennzahl
                wert={report.klassenGesamt}
                titel="angelegte Klassen"
                hinweis="inkl. Klassen ohne Beitritte"
              />
              <Kennzahl
                wert={report.aktiv7}
                titel="aktiv (7 Tage)"
                hinweis={`${report.aktiv30} in den letzten 30 Tagen`}
              />
            </div>
            <p className="mt-sm text-body-sm text-on-surface-variant">
              Ein Code entsteht beim ersten Besuch automatisch. Wer keiner Klasse
              beitritt, taucht in keinem Klassen-Report auf — hier schon.
            </p>
          </section>

          {/* ── Module ──────────────────────────────────────────────────── */}
          <section className="mt-xl">
            <h2 className="text-title-lg text-on-surface">Wie weit die Module kommen</h2>
            {report.module.length === 0 ? (
              <p className="mt-md text-body-md text-on-surface-variant">
                Noch kein gespiegelter Fortschritt vorhanden.
              </p>
            ) : (
              <div className="mt-md overflow-x-auto">
                <table className="w-full min-w-[36rem] border-collapse text-body-sm">
                  <thead>
                    <tr className="border-b border-outline-variant text-left">
                      <th className="py-sm pr-md font-medium text-on-surface">Modul</th>
                      <th className="py-sm pr-md font-medium text-on-surface">begonnen</th>
                      <th className="py-sm pr-md font-medium text-on-surface">abgeschlossen</th>
                      <th className="py-sm font-medium text-on-surface">Stand im Mittel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.module.map((m) => (
                      <tr key={m.moduleId} className="border-b border-outline-variant">
                        <td className="py-sm pr-md text-on-surface">{m.moduleId}</td>
                        <td className="py-sm pr-md text-on-surface-variant">{m.begonnen}</td>
                        <td className="py-sm pr-md text-on-surface-variant">
                          {m.abgeschlossen}
                        </td>
                        <td className="py-sm">
                          <Stand anteil={m.pctSchnitt} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className="mt-sm text-body-sm text-on-surface-variant">
              «begonnen» heisst: dieser Code hat in diesem Modul etwas gespiegelt.
              Einen Erfüllungsgrad in Prozent gibt es nur dort, wo das Modul einen
              spiegelt — Lernset 2 hält seinen Stand anders fest, darum steht dort
              «ohne Prozentwert» statt einer erfundenen Null.
            </p>
          </section>

          {/* ── Klassen ─────────────────────────────────────────────────── */}
          <section className="mt-xl">
            <h2 className="text-title-lg text-on-surface">Klassen</h2>
            <div className="mt-md overflow-x-auto">
              <table className="w-full min-w-[40rem] border-collapse text-body-sm">
                <thead>
                  <tr className="border-b border-outline-variant text-left">
                    <th className="py-sm pr-md font-medium text-on-surface">Klasse</th>
                    <th className="py-sm pr-md font-medium text-on-surface">Codes</th>
                    <th className="py-sm pr-md font-medium text-on-surface">aktiv (7 Tage)</th>
                    <th className="py-sm pr-md font-medium text-on-surface">Stand im Mittel</th>
                    <th className="py-sm font-medium text-on-surface">zuletzt aktiv</th>
                  </tr>
                </thead>
                <tbody>
                  {report.klassen.map((k) => (
                    <tr
                      key={k.classCode ?? "__ohne__"}
                      className="border-b border-outline-variant"
                    >
                      <td className="py-sm pr-md text-on-surface">
                        {k.classCode ?? (
                          <span className="text-on-surface-variant">ohne Klasse</span>
                        )}
                      </td>
                      <td className="py-sm pr-md text-on-surface-variant">{k.n}</td>
                      <td className="py-sm pr-md text-on-surface-variant">{k.aktiv7}</td>
                      <td className="py-sm pr-md">
                        {k.n === 0 ? (
                          <span className="text-on-surface-variant">—</span>
                        ) : (
                          <Stand anteil={k.pctSchnitt} />
                        )}
                      </td>
                      <td className="py-sm text-on-surface-variant">
                        {zeit(k.letzteAktivitaet)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-sm text-body-sm text-on-surface-variant">
              Für den Blick in eine einzelne Klasse braucht es deren Klassencode und
              Secret — die Gesamtübersicht öffnet keine fremden Klassen-Reports.
            </p>
          </section>
        </>
      )}
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminFlow />
    </Suspense>
  );
}
