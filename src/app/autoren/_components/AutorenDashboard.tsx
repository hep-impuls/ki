"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { loadPollCounts, type PollCounts } from "@/lib/polls";
import {
  heuteKey,
  leseNutzung,
  leseVerlauf,
  NUTZUNG_POLL_ID,
  VERLAUF_POLL_ID,
  type NutzungsZahlen,
} from "@/app/lernen/lernseite-2/_lib/nutzung";
import {
  SPUREN_POLL_ID,
  spurArt,
  spurBasis,
  zaehleAlleAusPoll,
} from "@/app/lernen/lernseite-2/_lib/spuren";
import {
  leseInhalte,
  zieheInhalteAusCloud,
} from "@/app/lernen/lernseite-2/_lib/inhalte";
import { abschnittFuer, hrefFuer } from "@/app/lernen/lernseite-2/_lib/ziele";

/**
 * AutorenDashboard — was mit den Inhalten von Lernseite 2 passiert.
 *
 * Vier Fragen, in dieser Reihenfolge:
 *  1. Wie viele waren da, und in welchen Themen?
 *  2. Was haben sie getan (Punkte, Vertiefungen, Videos, Bildpunkte, Wünsche)?
 *  3. Welche Inhalte laufen, welche nicht — mit den Nulltreffern eigens.
 *  4. Wie blicken sie auf KI?
 *
 * **Was die Zahlen bedeuten, und was nicht.** Jeder Zähler steigt pro Browser
 * höchstens einmal je Schlüssel (Ausnahme: die PDF-Ausdrucke, die jedes Mal
 * zählen). «7» heisst also «sieben Browser haben das je berührt», nicht «sieben
 * Aufrufe». Ein Wechsel des Geräts oder ein geleerter Browser-Speicher zählt neu.
 * Und Klicks von `localhost` zählen absichtlich nicht mit, sonst würden unsere
 * eigenen Tests die Zahlen verfälschen.
 */

const THEMEN: { slug: string; titel: string }[] = [
  { slug: "hub", titel: "Übersicht (Hub)" },
  { slug: "vorhang-auf", titel: "Vorhang auf" },
  { slug: "philosophische-perspektive", titel: "Philosophische Perspektive" },
  { slug: "kulturelle-perspektive", titel: "Kulturelle Perspektive" },
  { slug: "das-orakel", titel: "Das Orakel" },
];

const BLICK: { id: string; label: string }[] = [
  { id: "neugierig", label: "Neugierig" },
  { id: "pragmatisch", label: "Pragmatisch" },
  { id: "kritisch", label: "Kritisch" },
  { id: "gemischt", label: "Gemischt" },
];

/** Ein Inhaltspunkt mit seiner Reichweite. */
type Posten = {
  id: string;
  titel: string;
  abschnitt: string;
  href?: string;
  punkte: number;
  /** Wie oft die Vertiefung «Mehr lesen» dazu geöffnet wurde. */
  mehr: number;
  /** Wie oft «Mehr dazu wissen» angekreuzt wurde. */
  wunsch: number;
};

function Kennzahl({
  wert,
  label,
  hinweis,
}: {
  wert: number | string;
  label: string;
  hinweis?: string;
}) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-low p-md">
      <p className="text-headline-md text-on-surface">{wert}</p>
      <p className="mt-2xs text-label-md text-on-surface-variant">{label}</p>
      {hinweis && (
        <p className="mt-xs text-label-sm text-on-surface-variant/80">{hinweis}</p>
      )}
    </div>
  );
}

/** Datum «JJJJ-MM-TT» ↔ lokale Zeit, plus Tages-Arithmetik für den Zeitraum. */
function tagPlus(datum: string, tage: number): string {
  const [j, m, d] = datum.split("-").map(Number);
  const dt = new Date(j, m - 1, d + tage);
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}-${mm}-${dd}`;
}

/** Anzeige «18.8.» für die X-Achse. */
function kurzDatum(datum: string): string {
  const [, m, d] = datum.split("-").map(Number);
  return `${d}.${m}.`;
}

const VERLAUF_LINIEN: { key: string; titel: string; strich: string; chip: string }[] = [
  { key: "alle", titel: "Gesamt", strich: "stroke-on-surface", chip: "bg-on-surface" },
  { key: "hub", titel: "Übersicht (Hub)", strich: "stroke-primary", chip: "bg-primary" },
  { key: "vorhang-auf", titel: "Vorhang auf", strich: "stroke-secondary", chip: "bg-secondary" },
  { key: "philosophische-perspektive", titel: "Philosophische Perspektive", strich: "stroke-tertiary", chip: "bg-tertiary" },
  { key: "kulturelle-perspektive", titel: "Kulturelle Perspektive", strich: "stroke-outline", chip: "bg-outline" },
  { key: "das-orakel", titel: "Das Orakel", strich: "stroke-error", chip: "bg-error" },
];

/**
 * Verlaufsgrafik: Browser pro Tag, eine Linie je Thema plus Gesamt, mit frei
 * wählbarem Zeitraum. Die Daten sind Tagessummen aus `verlauf-lernseite-2`
 * (einmal je Browser und Tag) — es gibt keine Uhrzeiten und keine Personen.
 */
function VerlaufsSektion({ counts }: { counts: PollCounts }) {
  const daten = useMemo(() => leseVerlauf(counts), [counts]);
  const alleTage = useMemo(
    () => Object.values(daten).flatMap((o) => Object.keys(o)).sort(),
    [daten],
  );
  const heute = heuteKey();
  const fruehestes = alleTage[0] ?? heute;
  const [von, setVon] = useState(() => {
    const vor13 = tagPlus(heute, -13);
    return fruehestes > vor13 ? fruehestes : vor13;
  });
  const [bis, setBis] = useState(heute);
  const [aktiv, setAktiv] = useState<Set<string>>(
    () => new Set(VERLAUF_LINIEN.map((l) => l.key)),
  );

  /* Tage des Zeitraums ausrollen, Tage ohne Zähler zählen als 0. Die Schranke
     von 400 Tagen hält das SVG handlich, «Alles» bleibt darunter, solange das
     Lernset nicht länger als gut ein Jahr läuft. */
  const tage = useMemo(() => {
    const aus: string[] = [];
    let d = von;
    for (let i = 0; i < 400 && d <= bis; i++) {
      aus.push(d);
      d = tagPlus(d, 1);
    }
    return aus;
  }, [von, bis]);

  const reihen = useMemo(
    () =>
      VERLAUF_LINIEN.filter((l) => aktiv.has(l.key)).map((l) => ({
        ...l,
        werte: tage.map((tag) => daten[l.key]?.[tag] ?? 0),
      })),
    [tage, daten, aktiv],
  );
  const maxY = Math.max(3, ...reihen.flatMap((r) => r.werte));

  const B = 640;
  const H = 200;
  const PAD_L = 34;
  const PAD_R = 10;
  const PAD_O = 10;
  const PAD_U = 26;
  const x = (i: number) =>
    PAD_L + (tage.length > 1 ? (i * (B - PAD_L - PAD_R)) / (tage.length - 1) : (B - PAD_L - PAD_R) / 2);
  const y = (v: number) => PAD_O + (H - PAD_O - PAD_U) * (1 - v / maxY);

  const leer = alleTage.length === 0;

  return (
    <section className="mt-xl">
      <h2 className="text-headline-md text-on-surface">Verlauf</h2>
      <p className="mt-xs max-w-3xl text-body-md text-on-surface-variant">
        Browser pro Tag, je Thema und gesamt. Gezählt wird höchstens einmal je
        Browser und Tag; Uhrzeiten und Personen gibt es hier nicht.
      </p>

      {leer ? (
        <p className="mt-md max-w-3xl rounded-xl border border-outline-variant bg-surface-container-low p-md text-body-md text-on-surface-variant">
          Noch keine Verlaufsdaten: Der Tages-Zähler ist neu und beginnt mit dem
          nächsten Deploy. Rückwirkend gibt es nichts, die bisherigen Zähler
          sind bewusst ohne Zeitachse angelegt, und{" "}
          <code>localhost</code> zählt nie.
        </p>
      ) : (
        <>
          <div className="mt-md flex flex-wrap items-center gap-sm">
            <label className="flex items-center gap-xs text-label-md text-on-surface-variant">
              von
              <input
                type="date"
                value={von}
                min={fruehestes}
                max={bis}
                onChange={(e) => e.target.value && setVon(e.target.value)}
                className="rounded-lg border border-outline-variant bg-surface-bright px-sm py-2xs text-body-sm text-on-surface"
              />
            </label>
            <label className="flex items-center gap-xs text-label-md text-on-surface-variant">
              bis
              <input
                type="date"
                value={bis}
                min={von}
                max={heute}
                onChange={(e) => e.target.value && setBis(e.target.value)}
                className="rounded-lg border border-outline-variant bg-surface-bright px-sm py-2xs text-body-sm text-on-surface"
              />
            </label>
            {[
              { label: "7 Tage", von: tagPlus(heute, -6) },
              { label: "30 Tage", von: tagPlus(heute, -29) },
              { label: "Alles", von: fruehestes },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setVon(p.von < fruehestes ? fruehestes : p.von);
                  setBis(heute);
                }}
                className="rounded-lg border border-outline-variant px-sm py-2xs text-label-md text-on-surface-variant transition hover:text-on-surface"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-sm flex flex-wrap gap-xs">
            {VERLAUF_LINIEN.map((l) => {
              const an = aktiv.has(l.key);
              return (
                <button
                  key={l.key}
                  type="button"
                  aria-pressed={an}
                  onClick={() =>
                    setAktiv((prev) => {
                      const nx = new Set(prev);
                      if (nx.has(l.key)) nx.delete(l.key);
                      else nx.add(l.key);
                      return nx;
                    })
                  }
                  className={
                    "inline-flex items-center gap-xs rounded-lg border px-sm py-2xs text-label-md transition " +
                    (an
                      ? "border-outline-variant text-on-surface"
                      : "border-outline-variant/50 text-on-surface-variant/60")
                  }
                >
                  <span className={`inline-block h-2 w-2 rounded-full ${l.chip} ${an ? "" : "opacity-30"}`} />
                  {l.titel}
                </button>
              );
            })}
          </div>

          <div className="mt-md overflow-x-auto rounded-xl border border-outline-variant bg-surface-container-low p-md">
            <svg
              viewBox={`0 0 ${B} ${H}`}
              className="h-52 w-full min-w-[32rem]"
              role="img"
              aria-label={`Verlauf vom ${von} bis ${bis}, höchster Tageswert ${maxY} Browser`}
            >
              {[0, 0.5, 1].map((f) => {
                const wert = Math.round(maxY * f);
                return (
                  <g key={f}>
                    <line
                      x1={PAD_L}
                      x2={B - PAD_R}
                      y1={y(wert)}
                      y2={y(wert)}
                      className="stroke-outline-variant"
                      strokeWidth="1"
                      strokeDasharray={f === 0 ? undefined : "3 4"}
                    />
                    <text
                      x={PAD_L - 6}
                      y={y(wert) + 3}
                      textAnchor="end"
                      className="fill-on-surface-variant text-[10px]"
                    >
                      {wert}
                    </text>
                  </g>
                );
              })}
              {[0, Math.floor((tage.length - 1) / 2), tage.length - 1]
                .filter((i, pos, arr) => arr.indexOf(i) === pos)
                .map((i) => (
                  <text
                    key={i}
                    x={x(i)}
                    y={H - 8}
                    textAnchor="middle"
                    className="fill-on-surface-variant text-[10px]"
                  >
                    {kurzDatum(tage[i])}
                  </text>
                ))}
              {reihen.map((r) => (
                <g key={r.key}>
                  <polyline
                    fill="none"
                    strokeWidth={r.key === "alle" ? 2.5 : 1.5}
                    className={r.strich}
                    points={r.werte.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
                  />
                  {r.werte.map((v, i) =>
                    v > 0 ? (
                      <circle key={i} cx={x(i)} cy={y(v)} r="2.5" className={r.strich.replace("stroke-", "fill-")}>
                        <title>{`${r.titel} · ${kurzDatum(tage[i])} · ${v} Browser`}</title>
                      </circle>
                    ) : null,
                  )}
                </g>
              ))}
            </svg>
          </div>
        </>
      )}
    </section>
  );
}

export default function AutorenDashboard() {
  const [nutzung, setNutzung] = useState<NutzungsZahlen | null>(null);
  const [verlauf, setVerlauf] = useState<PollCounts | null>(null);
  const [spuren, setSpuren] = useState<PollCounts | null>(null);
  const [blick, setBlick] = useState<PollCounts | null>(null);
  const [inhalte, setInhalte] = useState<Record<string, string>>({});
  const [fehler, setFehler] = useState<string | null>(null);
  const [geladen, setGeladen] = useState(false);

  useEffect(() => {
    let abgebrochen = false;
    (async () => {
      try {
        // Die Titel-Registry liegt lokal; der Cloud-Zug holt dazu, was auf
        // anderen Geräten registriert wurde.
        await zieheInhalteAusCloud().catch(() => undefined);
        const [n, s, b, v] = await Promise.all([
          loadPollCounts(NUTZUNG_POLL_ID),
          loadPollCounts(SPUREN_POLL_ID),
          loadPollCounts("orakel-blick"),
          loadPollCounts(VERLAUF_POLL_ID),
        ]);
        if (abgebrochen) return;
        setNutzung(leseNutzung(n));
        setSpuren(s);
        setBlick(b);
        setVerlauf(v);
        setInhalte(leseInhalte());
      } catch (err) {
        if (!abgebrochen) setFehler(String(err));
      } finally {
        if (!abgebrochen) setGeladen(true);
      }
    })();
    return () => {
      abgebrochen = true;
    };
  }, []);

  const taten = useMemo(
    () => (spuren ? zaehleAlleAusPoll(spuren) : null),
    [spuren],
  );

  /**
   * Inhaltspunkte zusammenführen: Grundlage ist das **Inventar** (alle je
   * registrierten Titel), nicht die Zählerliste — nur so werden die Nulltreffer
   * überhaupt sichtbar. Die Zähler liefern die Reichweite dazu.
   */
  const posten = useMemo<Posten[]>(() => {
    if (!spuren) return [];
    const nach = new Map<string, Posten>();
    const hol = (basis: string): Posten => {
      let p = nach.get(basis);
      if (!p) {
        p = {
          id: basis,
          titel: inhalte[basis] ?? basis,
          abschnitt: abschnittFuer(basis),
          href: hrefFuer(basis),
          punkte: 0,
          mehr: 0,
          wunsch: 0,
        };
        nach.set(basis, p);
      }
      return p;
    };
    // 1. Inventar aufspannen (auch was nie berührt wurde).
    for (const basis in inhalte) {
      if (basis.includes(":gewebe")) continue; // inhaltsloses Muster
      hol(basis);
    }
    // 2. Zähler eintragen.
    for (const key in spuren) {
      const n = Number(spuren[key]) || 0;
      if (n <= 0) continue;
      if (key.includes(":gewebe")) continue;
      const art = spurArt(key);
      // Bild-Hotspots aufs Bild aggregieren, wie im Orakel.
      const basis = spurBasis(key).replace(/:hs\d+$/, "");
      const p = hol(basis);
      if (art === "mehr") p.mehr += n;
      else if (art === "wunsch") p.wunsch += n;
      else p.punkte += n;
    }
    return [...nach.values()];
  }, [spuren, inhalte]);

  const nachAbschnitt = useMemo(() => {
    const nach = new Map<string, Posten[]>();
    for (const p of posten) {
      const liste = nach.get(p.abschnitt) ?? [];
      liste.push(p);
      nach.set(p.abschnitt, liste);
    }
    return [...nach.entries()]
      .map(([abschnitt, liste]) => ({
        abschnitt,
        liste: [...liste].sort((a, b) => b.punkte - a.punkte || a.titel.localeCompare(b.titel)),
        summe: liste.reduce((s, p) => s + p.punkte, 0),
      }))
      .sort((a, b) => b.summe - a.summe);
  }, [posten]);

  const nulltreffer = useMemo(
    () => posten.filter((p) => p.punkte === 0),
    [posten],
  );

  const blickTotal = useMemo(
    () => (blick ? BLICK.reduce((s, o) => s + (Number(blick[o.id]) || 0), 0) : 0),
    [blick],
  );

  return (
    <AppLayout>
      <header className="border-b border-outline-variant pb-lg">
        <div className="flex flex-wrap items-start justify-between gap-md">
          <p className="text-label-md uppercase tracking-wider text-tertiary">
            Für Pietro und Christof
          </p>
          <button
            type="button"
            onClick={async () => {
              await fetch("/api/autoren/auth", { method: "DELETE" });
              window.location.reload();
            }}
            className="inline-flex items-center gap-xs rounded-lg border border-outline-variant px-sm py-2xs text-label-md text-on-surface-variant transition hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Abmelden
          </button>
        </div>
        <h1 className="mt-sm text-headline-xl text-on-surface">
          Was mit Lernseite 2 geschieht
        </h1>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          Diese Seite liest nur anonyme Summen. Es gibt hier keine
          Fortschritts-Codes und keine einzelnen Personen, nur Zähler auf
          Inhalten und Tagessummen je Thema.
        </p>
      </header>

      {!geladen && (
        <p className="mt-xl text-body-md text-on-surface-variant">Zähler werden geladen …</p>
      )}

      {fehler && (
        <div className="mt-xl rounded-xl border border-outline-variant bg-surface-container-low p-lg">
          <p className="text-body-md text-on-surface">
            Die Zähler liessen sich nicht laden. Ohne Firebase-Konfiguration
            (`.env.local`) bleibt diese Seite leer.
          </p>
          <p className="mt-xs text-label-sm text-on-surface-variant">{fehler}</p>
        </div>
      )}

      {geladen && nutzung && taten && (
        <>
          {/* ── 1. Reichweite ──────────────────────────────────────────── */}
          <section className="mt-xl">
            <h2 className="text-headline-md text-on-surface">Wie viele waren da</h2>
            {nutzung.browser === 0 && (
              /* Ohne diesen Hinweis liest man die beiden Nullen als Defekt. Die
                 Inhalts-Zähler laufen seit Monaten, die Reichweiten-Zähler sind
                 neu (2026-08-10) und beginnen mit dem nächsten Deploy. */
              <p className="mt-sm max-w-3xl rounded-xl border border-outline-variant bg-surface-container-low p-md text-body-md text-on-surface-variant">
                Noch keine Zahlen: Die beiden Zähler für Reichweite und Ausdrucke
                sind neu und beginnen erst mit dem nächsten Deploy zu laufen. Auf
                <code className="mx-2xs">localhost</code> zählen sie nie. Die
                Inhaltszahlen weiter unten sind davon unberührt, die laufen seit
                Beginn.
              </p>
            )}
            <div className="mt-md grid gap-md sm:grid-cols-3">
              <Kennzahl
                wert={nutzung.browser}
                label="Browser mit geöffneter Lernseite 2"
                hinweis="Seit dem Einbau des Zählers. Ein zweites Gerät derselben Person zählt erneut."
              />
              <Kennzahl
                wert={nutzung.pdf}
                label="gestartete PDF-Ausdrucke"
                hinweis="Gezählt wird der Klick auf «Ausdrucken / PDF». Ob daraus eine Datei wurde, verrät der Druckdialog dem Browser nicht."
              />
              <Kennzahl
                wert={taten.punkte + taten.bildpunkte + taten.videos}
                label="berührte Inhaltspunkte insgesamt"
                hinweis="Punkte, Bildpunkte und Videos zusammen."
              />
            </div>

            <h3 className="mt-lg text-title-md text-on-surface">Nach Thema</h3>
            <div className="mt-sm overflow-x-auto">
              <table className="w-full min-w-[32rem] text-body-md">
                <thead>
                  <tr className="border-b border-outline-variant text-left text-label-md text-on-surface-variant">
                    <th className="py-xs pr-md font-normal">Thema</th>
                    <th className="py-xs pr-md text-right font-normal">Browser</th>
                    <th className="py-xs text-right font-normal">Anteil</th>
                  </tr>
                </thead>
                <tbody>
                  {THEMEN.map((t) => {
                    const n = nutzung.seiten[t.slug] ?? 0;
                    const anteil = nutzung.browser > 0 ? Math.round((n / nutzung.browser) * 100) : 0;
                    return (
                      <tr key={t.slug} className="border-b border-outline-variant/50">
                        <td className="py-xs pr-md text-on-surface">{t.titel}</td>
                        <td className="py-xs pr-md text-right tabular-nums text-on-surface">{n}</td>
                        <td className="py-xs text-right tabular-nums text-on-surface-variant">
                          {nutzung.browser > 0 ? `${anteil} %` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {verlauf && <VerlaufsSektion counts={verlauf} />}

          {/* ── 2. Was getan wurde ─────────────────────────────────────── */}
          <section className="mt-xl">
            <h2 className="text-headline-md text-on-surface">Was sie getan haben</h2>
            <div className="mt-md grid gap-md sm:grid-cols-3 lg:grid-cols-5">
              <Kennzahl wert={taten.punkte} label="Punkte angeklickt" />
              <Kennzahl wert={taten.mehr} label="Vertiefungen geöffnet" />
              <Kennzahl wert={taten.bildpunkte} label="Bildpunkte" />
              <Kennzahl wert={taten.videos} label="Videos" />
              <Kennzahl wert={taten.wuensche} label="«Mehr dazu wissen»" />
            </div>
            <p className="mt-sm max-w-3xl text-label-md text-on-surface-variant">
              Das Verhältnis von Vertiefungen zu Punkten sagt, wie tief gelesen
              wird:{" "}
              <strong className="text-on-surface">
                {taten.punkte > 0
                  ? `${Math.round((taten.mehr / taten.punkte) * 100)} Vertiefungen auf 100 Punkte`
                  : "noch keine Punkte"}
              </strong>
              . Die Wünsche zeigen, wo Neugier offen blieb.
            </p>
          </section>

          {/* ── 3. Welche Inhalte laufen ───────────────────────────────── */}
          <section className="mt-xl">
            <h2 className="text-headline-md text-on-surface">Welche Inhalte laufen</h2>
            <p className="mt-xs max-w-3xl text-body-md text-on-surface-variant">
              Grundlage ist das Inventar aller Inhaltspunkte, nicht die Zählerliste.
              Nur so tauchen auch die auf, die niemand angeklickt hat. Das Inventar
              füllt sich beim Öffnen der Themen: Was du in diesem Browser noch nie
              geöffnet hast, fehlt hier.
            </p>

            {nulltreffer.length > 0 && (
              <div className="mt-md rounded-xl border border-outline-variant bg-surface-container-low p-lg">
                <p className="text-title-md text-on-surface">
                  Blinde Flecken: {nulltreffer.length} von {posten.length} Punkten
                  ohne einen einzigen Klick
                </p>
                <ul className="mt-sm flex flex-wrap gap-xs">
                  {nulltreffer.slice(0, 40).map((p) => (
                    <li
                      key={p.id}
                      className="rounded-lg border border-outline-variant px-sm py-2xs text-label-md text-on-surface-variant"
                      title={`${p.abschnitt} · ${p.id}`}
                    >
                      {p.href ? (
                        <Link href={p.href} className="hover:text-on-surface">
                          {p.titel}
                        </Link>
                      ) : (
                        p.titel
                      )}
                    </li>
                  ))}
                </ul>
                {nulltreffer.length > 40 && (
                  <p className="mt-sm text-label-md text-on-surface-variant">
                    … und {nulltreffer.length - 40} weitere.
                  </p>
                )}
              </div>
            )}

            {nachAbschnitt.map((gruppe) => (
              <div key={gruppe.abschnitt} className="mt-lg">
                <h3 className="text-title-md text-on-surface">
                  {gruppe.abschnitt}{" "}
                  <span className="text-label-md text-on-surface-variant">
                    · {gruppe.summe} Klicks auf {gruppe.liste.length} Punkte
                  </span>
                </h3>
                <div className="mt-sm overflow-x-auto">
                  <table className="w-full min-w-[36rem] text-body-md">
                    <thead>
                      <tr className="border-b border-outline-variant text-left text-label-md text-on-surface-variant">
                        <th className="py-xs pr-md font-normal">Punkt</th>
                        <th className="py-xs pr-md text-right font-normal">Klicks</th>
                        <th className="py-xs pr-md text-right font-normal">Vertiefung</th>
                        <th className="py-xs text-right font-normal">Wunsch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gruppe.liste.map((p) => (
                        <tr
                          key={p.id}
                          className={
                            "border-b border-outline-variant/50 " +
                            (p.punkte === 0 ? "text-on-surface-variant/70" : "")
                          }
                        >
                          <td className="py-xs pr-md">
                            {p.href ? (
                              <Link href={p.href} className="hover:text-tertiary">
                                {p.titel}
                              </Link>
                            ) : (
                              p.titel
                            )}
                          </td>
                          <td className="py-xs pr-md text-right tabular-nums">{p.punkte}</td>
                          <td className="py-xs pr-md text-right tabular-nums">
                            {p.mehr || "—"}
                          </td>
                          <td className="py-xs text-right tabular-nums">{p.wunsch || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </section>

          {/* ── 4. Haltung ─────────────────────────────────────────────── */}
          <section className="mt-xl">
            <h2 className="text-headline-md text-on-surface">Wie sie auf KI blicken</h2>
            <p className="mt-xs text-body-md text-on-surface-variant">
              Aus der Umfrage im Orakel, {blickTotal}{" "}
              {blickTotal === 1 ? "Stimme" : "Stimmen"}. Eine Stimme pro
              Fortschritts-Code.
            </p>
            <div className="mt-md grid gap-md sm:grid-cols-4">
              {BLICK.map((o) => {
                const n = Number(blick?.[o.id]) || 0;
                return (
                  <Kennzahl
                    key={o.id}
                    wert={blickTotal > 0 ? `${Math.round((n / blickTotal) * 100)} %` : "—"}
                    label={o.label}
                    hinweis={`${n} ${n === 1 ? "Stimme" : "Stimmen"}`}
                  />
                );
              })}
            </div>
          </section>

          <section className="mt-xl border-t border-outline-variant pt-lg">
            <h2 className="text-title-md text-on-surface">Was diese Zahlen nicht sagen</h2>
            <ul className="mt-sm max-w-3xl list-disc space-y-xs pl-lg text-body-md text-on-surface-variant">
              <li>
                Ein Zähler steigt pro Browser höchstens einmal. Die Zahlen sind
                Reichweiten, keine Aufrufe. Nur die PDF-Ausdrucke zählen jedes Mal.
              </li>
              <li>
                Klicks von <code>localhost</code> zählen nicht mit, unsere Tests
                verfälschen also nichts.
              </li>
              <li>
                Die Zeitachse kennt nur Tagessummen je Thema, und das erst seit
                ihrem Einbau. Uhrzeiten, Verweildauern und die Frage, wer wann da
                war, werden nicht erfasst.
              </li>
              <li>
                Wie viele Fortschritts-Codes es insgesamt gibt und wie weit die
                einzelnen kommen, steht nicht hier, sondern in{" "}
                <Link href="/lehrperson/admin" className="text-tertiary hover:underline">
                  Pietros Admin-Übersicht
                </Link>{" "}
                — die liest mit dem Service-Account die Codes selbst.
              </li>
            </ul>
          </section>
        </>
      )}
    </AppLayout>
  );
}
