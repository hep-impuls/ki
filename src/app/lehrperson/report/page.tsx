"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadTeacherOrakelSecure, loadTeacherReportSecure } from "@/lib/api";
import { describePoll } from "@/lib/pollLabels";
import { STATIONEN_V3 } from "@/app/lernen/lernseite-1/_data/stationenV3";
import KlassenKontext from "./_components/KlassenKontext";
import KlassenRhizom from "./_components/KlassenRhizom";
import type {
  PollAggregate,
  StationStand,
  TeacherOrakel,
  TeacherOrakelBereich,
  TeacherOrakelThema,
  TeacherReport,
} from "@/lib/types";

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

/** Modul-ID, unter der Lernseite 1 ihren Fortschritt spiegelt (ProgressMirror). */
const LERNSEITE_1 = "lernseite-1";

/**
 * Die Themen von Lernset 1 in Anzeige-Reihenfolge — direkt aus der Inhalts-
 * definition, damit Umbenennungen und ein- oder ausgeschaltete Themen im Report
 * automatisch mitlaufen. (`stationenV3` liegt ueber die Poll-Registry ohnehin
 * schon in diesem Bundle.)
 */
const THEMEN = STATIONEN_V3.map((s) => ({ id: s.id, kurzname: s.kurzname }));

/**
 * Stand eines Themas in einer Tabellenzelle. Drei Zustaende, absichtlich auch
 * ohne Farbe unterscheidbar: nicht begonnen «–», begonnen «42 %»,
 * abgeschlossen «78 %» mit Haken. Prozent und Haken sagen Verschiedenes — der
 * Haken meint das 60-%-Gate auf den Verstaendnisfragen, die Prozentzahl den
 * Anteil bearbeiteter Elemente. Beides zusammen ist die ehrliche Auskunft.
 */
function ThemaZelle({ stand }: { stand?: StationStand }) {
  if (!stand) {
    return (
      <span className="text-on-surface-variant" aria-label="nicht begonnen">
        –
      </span>
    );
  }
  if (stand.completed) {
    return (
      <span className="inline-flex items-center gap-xs font-medium text-on-surface">
        <span className="material-symbols-outlined text-[18px] text-tertiary" aria-hidden>
          check_circle
        </span>
        {pct(stand.pct)}
      </span>
    );
  }
  return <span className="text-on-surface">{pct(stand.pct)}</span>;
}

/**
 * Nicht jeder Eintrag in der `polls`-Sammlung ist eine Abstimmung. Lernseite 2
 * legt dort auch reine **Aktivitätszähler** ab: jede angeklickte Spur, jede
 * geknüpfte Fläche. Ungefiltert landeten die als «Unbekannte Quelle» mit
 * technischen IDs (`lernseite-2:gewebe:0`) und sinnlosen Nullbalken im Report.
 * Diese Zahlen gehören ins Klassen-Orakel, nicht in die Abstimmungen.
 */
function istZaehler(pollId: string): boolean {
  return (
    pollId.startsWith("spuren-") ||
    pollId.startsWith("flaechen-") ||
    pollId.includes("lernseite-2")
  );
}

/**
 * Reihenfolge der Module in Lernset 2 — dieselbe wie im Lernset selbst.
 * «Übergreifend» sammelt, was zu keinem der beiden Module gehört (Auftakt,
 * Orakel); es steht darum zuletzt.
 */
const MODUL_FOLGE: TeacherOrakelBereich["modul"][] = [
  "Vorhang auf",
  "Philosophische Perspektive",
  "Übergreifend",
];

/** Wie das Modul im Report überschrieben wird (voller Titel wie im Lernset). */
const MODUL_TITEL: Record<TeacherOrakelBereich["modul"], string> = {
  "Vorhang auf": "Vorhang auf",
  "Philosophische Perspektive": "Eine philosophische Perspektive",
  "Übergreifend": "Übergreifend",
};

const MODUL_IKON: Record<TeacherOrakelBereich["modul"], string> = {
  "Vorhang auf": "theater_comedy",
  "Philosophische Perspektive": "psychology",
  "Übergreifend": "hub",
};

/** Eine Kennzahl der Klasse, im Zuschnitt des Lernenden-PDF. */
function Kennzahl({ wert, titel, hinweis }: { wert: number | string; titel: string; hinweis?: string }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-bright p-md">
      <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">{titel}</p>
      <p className="mt-xs text-headline-md text-on-surface" style={{ fontFamily: "ui-monospace, monospace" }}>
        {wert}
      </p>
      {hinweis && <p className="mt-xs text-label-sm text-on-surface-variant">{hinweis}</p>}
    </div>
  );
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

/** Liste der häufigsten konkreten Themen (mit Titel + Abschnitt + Anzahl). */
function ThemenListe({
  titel,
  items,
}: {
  titel: string;
  items: TeacherOrakelThema[];
}) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-bright p-md">
      <p className="text-label-sm uppercase tracking-wider text-tertiary">{titel}</p>
      {items.length === 0 ? (
        <p className="mt-sm text-body-sm text-on-surface-variant">Noch nichts.</p>
      ) : (
        <ol className="mt-sm flex flex-col gap-sm">
          {items.map((t, i) => (
            <li key={i} className="flex items-baseline justify-between gap-sm">
              <span className="min-w-0">
                <span className="block text-body-sm text-on-surface">{t.titel}</span>
                <span className="block text-label-sm text-on-surface-variant">{t.bereich}</span>
              </span>
              <span
                className="shrink-0 text-label-sm text-on-surface-variant"
                style={{ fontFamily: "ui-monospace, monospace" }}
              >
                {t.anzahl}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function ReportFlow() {
  const search = useSearchParams();
  const code = (search.get("code") ?? "").toUpperCase();
  const secret = search.get("secret") ?? "";

  const [report, setReport] = useState<TeacherReport | null>(null);
  const [orakel, setOrakel] = useState<TeacherOrakel | null>(null);
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
    // Klassen-Orakel separat laden (Fehler blockiert den Report nicht).
    loadTeacherOrakelSecure(code, secret)
      .then(setOrakel)
      .catch(() => {});
  }, [code, secret]);

  /**
   * Module ausser Lernseite 1. Die standen frueher als zusaetzliche Spalten
   * mit ihrer technischen ID unter der Ueberschrift «Lernset 1» — sie bekommen
   * jetzt eine eigene kleine Tabelle darunter.
   */
  const weitereModule = useMemo(() => {
    if (!report) return [];
    const set = new Set<string>();
    for (const s of report.students) for (const m of Object.keys(s.modulePct)) set.add(m);
    set.delete(LERNSEITE_1);
    return Array.from(set).sort();
  }, [report]);

  const polls = useMemo(() => {
    if (!report) return [];
    return [...report.polls]
      .filter((p) => !istZaehler(p.pollId))
      .sort((a, b) =>
        describePoll(a.pollId).sortKey.localeCompare(describePoll(b.pollId).sortKey),
      );
  }, [report]);

  /**
   * Klassen-Kennzahlen im Zuschnitt des Lernenden-PDF. Für «am meisten» und
   * «am wenigsten bearbeitet» wird nach der Zahl der dort aktiven
   * Schüler:innen sortiert, nicht nach Klicks: Ein grosser Abschnitt sammelt
   * sonst allein durch seine Grösse die meisten Treffer.
   */
  const klassenbild = useMemo(() => {
    if (!orakel || orakel.bereiche.length === 0) return null;
    // Lokale Bindung: In der Typ-Annotation unten greift die Null-Prüfung von
    // `orakel` nicht mehr, `bereiche` schon.
    const bereiche = orakel.bereiche;
    const summe = (f: (b: TeacherOrakelBereich) => number) =>
      bereiche.reduce((s, b) => s + f(b), 0);
    const nachAktiven = [...bereiche].sort(
      (a, b) => b.aktiveSchueler - a.aktiveSchueler || b.angeschaut - a.angeschaut,
    );
    return {
      angeschaut: summe((b) => b.angeschaut),
      vertieft: summe((b) => b.vertieft),
      weiterverfolgen: summe((b) => b.weiterverfolgen),
      staerkste: nachAktiven.slice(0, 2),
      schwaechste: nachAktiven.slice(-2).reverse(),
    };
  }, [orakel]);

  /**
   * Die Abschnitte nach Modul getrennt. Lernset 2 besteht aus zwei Modulen mit
   * ganz unterschiedlichem Zuschnitt — «Vorhang auf» erzählt die Geschichte,
   * «Eine philosophische Perspektive» arbeitet an den Begriffen. In einer
   * gemeinsamen Tabelle verschwimmt das; getrennt sieht man, wo die Klasse
   * wirklich stand.
   */
  const nachModul = useMemo(() => {
    if (!orakel || orakel.bereiche.length === 0) return [];
    const bereiche = orakel.bereiche;
    return MODUL_FOLGE.map((modul) => {
      const teil = bereiche.filter((b) => b.modul === modul);
      const summe = (f: (b: TeacherOrakelBereich) => number) =>
        teil.reduce((s, b) => s + f(b), 0);
      return {
        modul,
        bereiche: teil,
        angeschaut: summe((b) => b.angeschaut),
        vertieft: summe((b) => b.vertieft),
        weiterverfolgen: summe((b) => b.weiterverfolgen),
        /* Nicht aufsummieren: dieselbe Person ist in mehreren Abschnitten
           aktiv. Der grösste Abschnittswert ist die belastbare Untergrenze. */
        aktiveSchueler: teil.reduce((m, b) => Math.max(m, b.aktiveSchueler), 0),
      };
    }).filter((g) => g.bereiche.length > 0);
  }, [orakel]);

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
        <section className="mt-xl">
          <h2 className="text-headline-md text-on-surface">
            Lernset 1 · Kann KI das? Eine Positionsreise
          </h2>
          <h3 className="mt-lg text-headline-sm text-on-surface">
            Fortschritt pro Schüler:in und Thema
          </h3>
          {report.students.length === 0 ? (
            <p className="mt-sm text-body-md text-on-surface-variant">
              Noch keine Schüler:innen in dieser Klasse.
            </p>
          ) : (
            <>
              <div className="mt-md overflow-x-auto rounded-xl border border-outline-variant">
                <table className="w-full border-collapse text-body-sm">
                  <thead>
                    <tr className="bg-surface-dim text-left text-label-sm text-on-surface-variant">
                      <th className="px-md py-sm">Code</th>
                      {THEMEN.map((t) => (
                        <th key={t.id} className="px-md py-sm whitespace-nowrap">
                          {t.kurzname}
                        </th>
                      ))}
                      <th className="px-md py-sm border-l border-outline-variant">Gesamt</th>
                      <th className="px-md py-sm">Quiz</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.students.map((s, i) => (
                      <tr key={s.code ?? i} className="border-t border-outline-variant">
                        <td className="px-md py-sm font-medium text-on-surface">{s.code ?? "—"}</td>
                        {THEMEN.map((t) => (
                          <td key={t.id} className="px-md py-sm">
                            <ThemaZelle stand={s.stationen?.[t.id]} />
                          </td>
                        ))}
                        <td className="px-md py-sm border-l border-outline-variant text-on-surface-variant">
                          {s.modulePct[LERNSEITE_1] != null ? pct(s.modulePct[LERNSEITE_1]) : "–"}
                        </td>
                        <td className="px-md py-sm text-on-surface-variant">
                          {s.quizMax > 0 ? `${s.quizPunkte}/${s.quizMax}` : "–"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined align-[-4px] text-[18px] text-tertiary">
                  check_circle
                </span>{" "}
                abgeschlossen (Verständnisfragen ab 60 %) · Prozentzahl = Anteil der
                bearbeiteten Elemente dieses Themas · «–» = nicht begonnen. «Gesamt» ist
                derselbe Anteil über alle Themen zusammen.
              </p>

              {weitereModule.length > 0 && (
                <>
                  <h3 className="mt-xl text-headline-sm text-on-surface">Weitere Module</h3>
                  <div className="mt-md overflow-x-auto rounded-xl border border-outline-variant">
                    <table className="w-full border-collapse text-body-sm">
                      <thead>
                        <tr className="bg-surface-dim text-left text-label-sm text-on-surface-variant">
                          <th className="px-md py-sm">Code</th>
                          {weitereModule.map((m) => (
                            <th key={m} className="px-md py-sm">{m}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {report.students.map((s, i) => (
                          <tr key={s.code ?? i} className="border-t border-outline-variant">
                            <td className="px-md py-sm font-medium text-on-surface">
                              {s.code ?? "—"}
                            </td>
                            {weitereModule.map((m) => (
                              <td key={m} className="px-md py-sm text-on-surface-variant">
                                {s.modulePct[m] != null ? pct(s.modulePct[m]) : "–"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}

          {polls.length > 0 && (
            <>
              <h3 className="mt-xl text-headline-sm text-on-surface">
                Abstimmungen — Klasse gegen alle
              </h3>
              <p className="mt-xs text-body-sm text-on-surface-variant">
                Blau = deine Klasse · Orange = alle Klassen zusammen.
              </p>
              <div className="mt-md grid gap-md sm:grid-cols-2">
                {polls.map((agg) => (
                  <PollCard key={agg.pollId} agg={agg} />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {orakel && !loading && (
        <section className="mt-xl border-t border-outline-variant pt-xl">
          <h2 className="text-headline-md text-on-surface">
            Lernset 2 · Eine ganz neue Partnerschaft
          </h2>
          <p className="mt-xs max-w-3xl text-body-sm text-on-surface-variant">
            Dieselbe Auswertung, die Ihre Schüler:innen am Ende als PDF erhalten,
            hier für die ganze Klasse. Anonym aggregiert, keine Einzelzuordnung.
          </p>

          <h3 className="mt-lg text-headline-sm text-on-surface">Die Klasse in Zahlen</h3>
          {klassenbild ? (
            <div className="mt-md grid gap-md sm:grid-cols-2 lg:grid-cols-4">
              <Kennzahl
                titel="Aktiv"
                wert={`${orakel.aktiv} / ${orakel.n}`}
                hinweis="Schüler:innen mit mindestens einer Spur"
              />
              <Kennzahl
                titel="Angeschaut"
                wert={klassenbild.angeschaut}
                hinweis="geöffnete Punkte, gesamte Klasse"
              />
              <Kennzahl
                titel="Vertieft"
                wert={klassenbild.vertieft}
                hinweis="aufgeklappte «Mehr lesen»-Texte"
              />
              <Kennzahl
                titel="Weiterverfolgen"
                wert={klassenbild.weiterverfolgen}
                hinweis="Merkzeichen für die Zeit danach"
              />
            </div>
          ) : null}

          {klassenbild && (
            <div className="mt-md grid gap-md sm:grid-cols-2">
              {[
                { titel: "Am meisten bearbeitet", eintraege: klassenbild.staerkste },
                { titel: "Am wenigsten bearbeitet", eintraege: klassenbild.schwaechste },
              ].map((sp) => (
                <div
                  key={sp.titel}
                  className="rounded-xl border border-outline-variant bg-surface-bright p-md"
                >
                  <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                    {sp.titel}
                  </p>
                  <ul className="mt-sm space-y-xs text-body-sm text-on-surface">
                    {sp.eintraege.map((b) => (
                      <li key={b.bereich}>
                        {b.bereich}{" "}
                        <span className="text-on-surface-variant">
                          ({b.aktiveSchueler} von {orakel.n} aktiv)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <h3 className="mt-xl text-headline-sm text-on-surface">Die beiden Module</h3>
          <p className="mt-xs max-w-3xl text-body-sm text-on-surface-variant">
            Angeschaute Punkte, Vertiefungen («Mehr lesen») und Merkzeichen
            («Das verfolge ich weiter») — getrennt nach «Vorhang auf» und «Eine
            philosophische Perspektive».
          </p>
          {nachModul.length === 0 ? (
            <p className="mt-sm text-body-md text-on-surface-variant">
              Noch keine Aktivität in dieser Klasse.
            </p>
          ) : (
            <div className="mt-md space-y-lg">
              {nachModul.map((g) => (
                <div key={g.modul}>
                  <div className="flex flex-wrap items-baseline justify-between gap-sm">
                    <h4 className="flex items-center gap-xs text-body-lg font-medium text-on-surface">
                      <span className="material-symbols-outlined text-[20px] text-tertiary">
                        {MODUL_IKON[g.modul]}
                      </span>
                      {MODUL_TITEL[g.modul]}
                    </h4>
                    <p className="text-label-sm text-on-surface-variant">
                      {g.angeschaut} angeschaut · {g.vertieft} vertieft ·{" "}
                      {g.weiterverfolgen} weiterverfolgt · bis zu {g.aktiveSchueler} von{" "}
                      {orakel.n} aktiv
                    </p>
                  </div>
                  <div className="mt-sm overflow-x-auto rounded-xl border border-outline-variant">
                    <table className="w-full border-collapse text-body-sm">
                      <thead>
                        <tr className="bg-surface-dim text-left text-label-sm text-on-surface-variant">
                          <th className="px-md py-sm">Abschnitt</th>
                          <th className="px-md py-sm">Angeschaut</th>
                          <th className="px-md py-sm">Vertieft</th>
                          <th className="px-md py-sm">Weiterverfolgen</th>
                          <th className="px-md py-sm">Aktive</th>
                        </tr>
                      </thead>
                      <tbody>
                        {g.bereiche.map((b) => (
                          <tr key={b.bereich} className="border-t border-outline-variant">
                            <td className="px-md py-sm font-medium text-on-surface">
                              {b.bereich}
                            </td>
                            <td className="px-md py-sm text-on-surface-variant">{b.angeschaut}</td>
                            <td className="px-md py-sm text-on-surface-variant">{b.vertieft}</td>
                            <td className="px-md py-sm text-on-surface-variant">
                              {b.weiterverfolgen}
                            </td>
                            <td className="px-md py-sm text-on-surface-variant">
                              {b.aktiveSchueler}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Dieselbe Grafik, die die Lernenden von sich selbst sehen — hier
              mit den Zahlen der Klasse, dazu eine KI-Einschätzung. */}
          <h3 className="mt-xl text-headline-sm text-on-surface">
            Das Aktivitäts-Rhizom der Klasse
          </h3>
          <p className="mt-xs max-w-3xl text-body-sm text-on-surface-variant">
            Sechs Triebe: Punkte, Flächen, Bildpunkte und Videos zeigen, wo die
            Klasse war; Vertiefungen und Weiterverfolgen zeigen, wie tief sie
            ging. Im Hintergrund dasselbe Rhizom aller Teilnehmenden.
          </p>
          <KlassenRhizom orakel={orakel} />

          <h3 className="mt-xl text-headline-sm text-on-surface">
            Achtsamkeit auf die Kontexte
          </h3>
          <p className="mt-xs max-w-3xl text-body-sm text-on-surface-variant">
            Im Abschnitt «Die KI im Kontext» gewichten die Lernenden, wie viel
            Achtsamkeit jeder Aspekt verdient. Links das Muster Ihrer Klasse,
            rechts das aller Teilnehmenden.
          </p>
          <KlassenKontext kontext={orakel.kontext} />
          {/* Wie im Lernenden-PDF: die konkreten Titel, nicht nur Zahlen. Das
              «weiterverfolgt» steht zuerst, denn dort hängen die
              Anschlussaufgaben. */}
          <h3 className="mt-xl text-headline-sm text-on-surface">
            Konkrete Themen der Klasse
          </h3>
          <div className="mt-md grid gap-md sm:grid-cols-3">
            <ThemenListe titel="Am meisten weiterverfolgt" items={orakel.topWeiterverfolgen} />
            <ThemenListe titel="Am meisten vertieft" items={orakel.topVertieft} />
            <ThemenListe titel="Am meisten angeschaut" items={orakel.topAngeschaut} />
          </div>
        </section>
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
