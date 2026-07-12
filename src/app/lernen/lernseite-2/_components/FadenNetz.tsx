"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  leseSpurenIndices,
  loescheSpuren,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";

/**
 * FadenNetz — das interaktive Kopf-Muster der Themenseiten von Lernseite 2.
 *
 * Jede Seite trägt ihr individuelles Muster (Auftritts-Stern, Epochen-Linie,
 * Gewebe) aus mehreren Fäden, denen man einzeln und auf unterschiedlichen
 * Wegen mit Maus oder Finger nachfahren kann. Erreicht die Spur einen
 * Knoten — auch mitten auf einer Kreuzung —, wird dessen Weisheit
 * «eingesammelt»: Sie bleibt stehen und wächst zu einer Sammlung unter dem
 * Muster (Zitat + Quelle + ausführliche Deutung). Zwischen besuchten Knoten
 * füllen sich die entstehenden Flächen — abwechselnd mit Farbe, Schraffur
 * und Punktmuster (siehe `flaechen`).
 *
 * Aktivitäten werden zweifach registriert (siehe _lib/spuren.ts): lokal im
 * Browser (fürs Orakel-Dashboard «du») und als anonymer +1-Zähler in
 * Firebase (fürs «alle») — ohne Namen, ohne Code.
 *
 * Gestaltung wie Gewebe.tsx: nur Theme-Tokens, feine Linien + Knoten,
 * keine Verläufe/Filter, deterministische Koordinaten. Vermessung
 * (getTotalLength/getPointAtLength) erst im Effect — kein SSR-Mismatch.
 */

export interface FadenKnoten {
  x: number;
  y: number;
  /** Weisheit / offene Frage (ohne Anführungszeichen). */
  text: string;
  /** Urheber — bei Paraphrasen «nach …». */
  quelle: string;
  /** Kurzer Brückensatz (erscheint unter der Quelle). */
  kommentar?: string;
  /** Ausführliche Deutung (2–4 Sätze) — der Hauptteil der Karte. */
  deutung?: string;
  /** Optionales kurzes Label direkt im SVG (z.B. Epochenname). */
  label?: string;
  /** Hervorgehobener Knoten (Tertiary-Ring). */
  akzent?: boolean;
  /** Optionale DOM-id: Karte zeigt dann einen Sprung-Knopf dorthin. */
  ziel?: string;
}

export interface FadenStrang {
  /** SVG-Pfad des Fadens. */
  d: string;
  /** Feiner Nebenfaden (dünner, halbtransparent) — trotzdem nachfahrbar. */
  fein?: boolean;
}

export interface FadenFlaeche {
  /** Polygon in viewBox-Koordinaten. */
  punkte: [number, number][];
  /** Erscheint, sobald alle diese Knoten (Indizes) besucht sind. */
  knoten: number[];
  /** Füllung: sanfte Farbe, Schraffur oder Punktmuster. */
  muster?: "voll" | "schraffur" | "punkte";
}

const VB_W = 720;
/** Fangradius fürs Nachfahren (viewBox-Einheiten). */
const FANG = 44;
/** Abtastpunkte pro Faden. */
const N = 90;
/** Toleranz (in Abtastpunkten), mit der ein Knoten als erreicht gilt. */
const REICH_EPS = 3;

type Bereich = { lo: number; hi: number } | null;

type Messung = {
  mess: { total: number; samples: { x: number; y: number; len: number }[] }[];
  /** Je Knoten: auf welchen Fäden (Index) er bei welchem Abtastpunkt liegt. */
  adj: { s: number; idx: number }[][];
};

export default function FadenNetz({
  knoten,
  straenge,
  flaechen = [],
  nabe,
  abschluss,
  hoehe = 220,
  einladung,
  sprungLabel = "Hinspringen",
  svgKlasse = "",
  className = "",
  spurKey,
}: {
  knoten: FadenKnoten[];
  straenge: FadenStrang[];
  /** Flächen, die sich beim Einsammeln der Knoten füllen. */
  flaechen?: FadenFlaeche[];
  /** Dekorative Nabe (Ring + Punkt), in der die Fäden zusammenlaufen —
   *  kein Knoten, nicht anklickbar. */
  nabe?: [number, number];
  /** Erklärendes Abschluss-Feld unter dem Muster, sobald alle Knoten
   *  besucht sind. */
  abschluss?: string;
  /** viewBox-Höhe (Breite fix 720). */
  hoehe?: number;
  einladung: string;
  sprungLabel?: string;
  /** Aspekt-Klassen fürs SVG (Literalstrings der Seite, z.B. "aspect-[720/300] sm:aspect-[720/220]"). */
  svgKlasse?: string;
  className?: string;
  /** Optionaler Spur-Präfix (z.B. "vorhang-auf:weisheit") — besuchte Knoten
   *  werden lokal + als anonymer Firebase-Zähler gemerkt. */
  spurKey?: string;
}) {
  const n = knoten.length;
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const messRef = useRef<Messung | null>(null);
  const musterId = useId().replace(/[^a-zA-Z0-9]/g, "");

  const [ready, setReady] = useState(false);
  const [painted, setPainted] = useState<Bereich[]>(() =>
    straenge.map(() => null)
  );
  const [visited, setVisited] = useState<Set<number>>(new Set());
  /** Einsammel-Reihenfolge — die Karten bleiben in dieser Ordnung stehen. */
  const [gesammelt, setGesammelt] = useState<number[]>([]);

  // Fäden vermessen + Knoten den Fäden zuordnen (auch Kreuzungen mittendrin).
  useEffect(() => {
    const els = pathRefs.current.slice(0, straenge.length);
    if (els.length !== straenge.length || els.some((p) => !p)) return;
    const mess = els.map((p) => {
      const total = p!.getTotalLength();
      const samples = Array.from({ length: N + 1 }, (_, i) => {
        const pt = p!.getPointAtLength((total * i) / N);
        return { x: pt.x, y: pt.y, len: (total * i) / N };
      });
      return { total, samples };
    });
    const adj = knoten.map((k) => {
      const list: { s: number; idx: number }[] = [];
      mess.forEach((m, s) => {
        let bi = 0;
        let bd = Infinity;
        m.samples.forEach((sm, i) => {
          const dd = (sm.x - k.x) ** 2 + (sm.y - k.y) ** 2;
          if (dd < bd) {
            bd = dd;
            bi = i;
          }
        });
        if (Math.sqrt(bd) < 10) list.push({ s, idx: bi });
      });
      return list;
    });
    messRef.current = { mess, adj };
    setReady(true);
  }, [straenge, knoten]);

  // Nachfahren: nächsten Abtastpunkt über ALLE Fäden suchen, Spur ausdehnen.
  function handlePointer(e: React.PointerEvent<SVGSVGElement>) {
    const m = messRef.current;
    const svg = svgRef.current;
    if (!m || !svg) return;
    const r = svg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * VB_W;
    const y = ((e.clientY - r.top) / r.height) * hoehe;

    let bs = -1;
    let bi = 0;
    let bd = Infinity;
    m.mess.forEach((seg, s) => {
      seg.samples.forEach((sm, i) => {
        const dd = (sm.x - x) ** 2 + (sm.y - y) ** 2;
        if (dd < bd) {
          bd = dd;
          bs = s;
          bi = i;
        }
      });
    });
    if (bs < 0 || Math.sqrt(bd) > FANG) return;

    // Nur die Spur ausdehnen — Knoten-Erkennung macht der Effect darunter
    // (setState-Updater müssen pur bleiben). Union bis zum berührten Punkt:
    // kein Sprung-Limit mehr — genau das erzeugte beim schnellen Fahren die
    // Lücken. Die Spur wächst lückenlos auf dem berührten Faden.
    setPainted((prev) => {
      const cur = prev[bs];
      const neu = cur
        ? { lo: Math.min(cur.lo, bi), hi: Math.max(cur.hi, bi) }
        : { lo: bi, hi: bi };
      if (cur && neu.lo === cur.lo && neu.hi === cur.hi) return prev;
      const next = prev.slice();
      next[bs] = neu;
      return next;
    });
  }

  // Erreichte Knoten einsammeln (Spur berührt ihren Abtastpunkt).
  useEffect(() => {
    const m = messRef.current;
    if (!m) return;
    const dazu: number[] = [];
    m.adj.forEach((list, k) => {
      if (visited.has(k)) return;
      const erreicht = list.some(({ s, idx }) => {
        const b = painted[s];
        return b !== null && idx >= b.lo - REICH_EPS && idx <= b.hi + REICH_EPS;
      });
      if (erreicht) dazu.push(k);
    });
    if (dazu.length === 0) return;
    setVisited((v) => {
      const nx = new Set(v);
      dazu.forEach((k) => nx.add(k));
      return nx;
    });
    setGesammelt((g) => [...g, ...dazu.filter((k) => !g.includes(k))]);
    if (spurKey) dazu.forEach((k) => merkeSpur(`${spurKey}:${k}`));
  }, [painted, visited, spurKey]);

  // Wiederherstellen: besuchte Knoten aus der gespeicherten Spur öffnen —
  // damit sie beim erneuten (und geräteübergreifenden) Zugriff offen bleiben.
  // Beim Mounten zuerst die Cloud-Spur ziehen (feuert SPUR_EVENT), dann aus
  // dem lokalen Bestand die Indizes übernehmen; auf SPUR_EVENT nachführen.
  useEffect(() => {
    if (!spurKey) return;
    function restore() {
      const idx = leseSpurenIndices(spurKey!).filter((i) => i >= 0 && i < n);
      if (idx.length === 0) return;
      setVisited((prev) => {
        const nx = new Set(prev);
        idx.forEach((i) => nx.add(i));
        return nx;
      });
      setGesammelt((g) => {
        const fehlend = idx.filter((i) => !g.includes(i));
        return fehlend.length ? [...g, ...fehlend] : g;
      });
    }
    restore();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [spurKey, n]);

  function reveal(i: number) {
    if (!visited.has(i)) {
      setVisited((prev) => new Set(prev).add(i));
      setGesammelt((g) => (g.includes(i) ? g : [...g, i]));
      if (spurKey) merkeSpur(`${spurKey}:${i}`);
    }
  }

  function springe(ziel: string) {
    const el = document.getElementById(ziel);
    if (!el) return;
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "start" });
    if (ruhig) return;
    // Fallback: manche Umgebungen ignorieren behavior:"smooth" komplett.
    const vorher = el.getBoundingClientRect().top;
    window.setTimeout(() => {
      const nachher = el.getBoundingClientRect().top;
      if (Math.abs(nachher - vorher) < 2 && Math.abs(nachher) > 160) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }, 350);
  }

  /** «Muster zurücksetzen»: Spuren des Musters löschen, von vorn beginnen —
   *  die Karten sammeln sich danach in neuer Reihenfolge. */
  function zuruecksetzen() {
    setPainted(straenge.map(() => null));
    setVisited(new Set());
    setGesammelt([]);
    if (spurKey) loescheSpuren(spurKey);
  }

  const done = visited.size === n;
  const started = visited.size > 0 || painted.some((b) => b !== null);

  return (
    <section aria-label="Muster zum Nachfahren" className={className}>
      <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
        <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] text-tertiary">
            {done ? "done_all" : "swipe"}
          </span>
          {done
            ? `Alle ${n} Knoten besucht — das Muster ist gewoben`
            : started
            ? `${visited.size} von ${n} Knoten besucht`
            : "Fahr den Fäden nach — mehrere Wege sind möglich"}
        </p>
        {started && (
          <button
            type="button"
            onClick={zuruecksetzen}
            className="inline-flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[16px]">
              restart_alt
            </span>
            Muster zurücksetzen
          </button>
        )}
      </div>

      {/* Muster-Bühne: eigener, leicht abgesetzter Grund */}
      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low/60 p-sm sm:p-md">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${hoehe}`}
          preserveAspectRatio="none"
          onPointerMove={handlePointer}
          onPointerDown={handlePointer}
          className={"block w-full select-none touch-pan-y " + svgKlasse}
        >
          <defs>
            <pattern
              id={`${musterId}-schraffur`}
              width="9"
              height="9"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="9"
                strokeWidth="1.4"
                className="stroke-tertiary"
                opacity="0.30"
              />
            </pattern>
            <pattern
              id={`${musterId}-punkte`}
              width="11"
              height="11"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="3" cy="3" r="1.4" className="fill-tertiary" opacity="0.32" />
            </pattern>
          </defs>

          {/* Flächen — füllen sich, sobald ihre Knoten eingesammelt sind */}
          {flaechen.map((f, i) => {
            const aktiv = f.knoten.every((k) => visited.has(k));
            const art = f.muster ?? (["voll", "schraffur", "punkte"] as const)[i % 3];
            const fill =
              art === "voll"
                ? undefined
                : `url(#${musterId}-${art === "schraffur" ? "schraffur" : "punkte"})`;
            return (
              <polygon
                key={`f${i}`}
                points={f.punkte.map(([x, y]) => `${x},${y}`).join(" ")}
                fill={fill}
                className={
                  "transition-opacity duration-700 " +
                  (art === "voll" ? "fill-tertiary" : "")
                }
                opacity={aktiv ? (art === "voll" ? 0.09 : 1) : 0}
              />
            );
          })}

          {/* Grundfäden */}
          {straenge.map((st, s) => (
            <path
              key={`b${s}`}
              ref={(el) => {
                pathRefs.current[s] = el;
              }}
              d={st.d}
              fill="none"
              strokeWidth={st.fein ? 0.9 : 1.25}
              className="stroke-outline-variant"
              opacity={st.fein ? 0.6 : 1}
            />
          ))}
          {/* Nachgefahrene Spuren */}
          {ready &&
            straenge.map((st, s) => {
              const b = painted[s];
              const m = messRef.current!.mess[s];
              if (!b) return null;
              const loLen = m.samples[b.lo].len;
              const hiLen = m.samples[b.hi].len;
              if (hiLen - loLen < 0.5) return null;
              return (
                <path
                  key={`p${s}`}
                  d={st.d}
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${hiLen - loLen} ${m.total + 10}`}
                  strokeDashoffset={-loLen}
                  style={{
                    transition:
                      "stroke-dashoffset 90ms linear, stroke-dasharray 90ms linear",
                  }}
                  className="stroke-tertiary"
                  opacity="0.85"
                />
              );
            })}
          {/* Dekorative Nabe: hier laufen die Fäden zusammen (kein Knoten) */}
          {nabe && (
            <g aria-hidden>
              <circle
                cx={nabe[0]}
                cy={nabe[1]}
                r="11"
                fill="none"
                strokeWidth="1"
                className="stroke-tertiary"
                opacity="0.4"
              />
              <circle cx={nabe[0]} cy={nabe[1]} r="4.5" className="fill-tertiary" opacity="0.75" />
            </g>
          )}
          {/* Puls am ersten Knoten als Einladung */}
          {!started && (
            <circle
              cx={knoten[0].x}
              cy={knoten[0].y}
              r="11"
              className="fill-tertiary opacity-30 animate-ping origin-center [transform-box:fill-box] motion-reduce:hidden"
            />
          )}
          {/* Knoten */}
          {knoten.map((k, i) => {
            const reached = visited.has(i);
            // Kurze Bezeichnung für den Hover-Tooltip: aus dem
            // «Merkmal: …»-Kommentar der Name vor dem Gedankenstrich.
            const merk =
              k.kommentar && /^Merkmal:/.test(k.kommentar)
                ? k.kommentar
                    .replace(/^Merkmal:\s*/, "")
                    .split("—")[0]
                    .replace(/\.\s*$/, "")
                    .trim()
                : null;
            const tipW = merk ? Math.max(46, merk.length * 7 + 18) : 0;
            const tipAbove = k.y >= 46;
            const tipY = tipAbove ? k.y - 38 : k.y + 14;
            const tipX = merk
              ? Math.min(VB_W - tipW - 3, Math.max(3, k.x - tipW / 2))
              : 0;
            return (
              <g
                key={i}
                tabIndex={0}
                role="button"
                aria-label={`Weisheit ${i + 1} von ${n}: ${k.quelle}`}
                onClick={() => reveal(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    reveal(i);
                  }
                }}
                className="group cursor-pointer outline-none"
              >
                <circle cx={k.x} cy={k.y} r="22" fill="transparent" />
                {(reached || k.akzent) && (
                  <circle
                    cx={k.x}
                    cy={k.y}
                    r="9"
                    fill="none"
                    strokeWidth="1"
                    className="stroke-tertiary"
                    opacity="0.45"
                  />
                )}
                <circle
                  cx={k.x}
                  cy={k.y}
                  r={k.akzent ? 5.5 : 4.5}
                  className={
                    (reached || k.akzent ? "fill-tertiary" : "fill-outline") +
                    " origin-center [transform-box:fill-box] transition-transform duration-300 group-hover:scale-125 group-focus-visible:scale-125"
                  }
                  opacity={reached || k.akzent ? 1 : 0.65}
                />
                {k.label && (
                  <text
                    x={k.x}
                    y={k.y + 22}
                    textAnchor="middle"
                    fontSize="12"
                    className="fill-on-surface-variant"
                  >
                    {k.label}
                  </text>
                )}
                {merk && (
                  <g className="pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <rect
                      x={tipX}
                      y={tipY}
                      width={tipW}
                      height="24"
                      rx="6"
                      className="fill-inverse-surface"
                    />
                    <text
                      x={tipX + tipW / 2}
                      y={tipY + 16}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="600"
                      className="fill-inverse-on-surface"
                    >
                      {merk}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Erklärendes Abschluss-Feld — direkt unter dem Muster, dezent
          schraffiert statt farbig */}
      {abschluss && done && (
        <div
          className="animate-frame-in mt-md rounded-xl border border-outline-variant bg-surface-bright p-lg"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgb(var(--color-tertiary) / 0.07) 0px, rgb(var(--color-tertiary) / 0.07) 2px, transparent 2px, transparent 10px)",
          }}
        >
          <p className="flex items-center gap-sm text-headline-sm text-on-surface">
            <span className="material-symbols-outlined text-tertiary">
              done_all
            </span>
            Das Muster ist gewoben
          </p>
          <p className="mt-sm text-body-lg text-on-surface">{abschluss}</p>
        </div>
      )}

      {/* Eingesammelte Weisheiten — bleiben stehen, in Einsammel-Reihenfolge */}
      <div aria-live="polite" className="mt-md">
        {gesammelt.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-lg">
            <p className="flex items-start gap-sm text-body-md text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px] text-tertiary">
                explore
              </span>
              {einladung}
            </p>
          </div>
        ) : (
          <ol className="flex flex-col gap-md">
            {gesammelt.map((idx, pos) => {
              const k = knoten[idx];
              const neuste = pos === gesammelt.length - 1;
              return (
                <li
                  key={idx}
                  className={
                    "rounded-xl border p-lg " +
                    (neuste
                      ? "animate-frame-in border-tertiary/50 bg-tertiary-container/25"
                      : pos % 2 === 0
                      ? "border-outline-variant bg-surface-bright"
                      : "border-outline-variant bg-surface-container-low")
                  }
                >
                  <div className="flex items-start gap-md">
                    <span className="mt-xs flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-tertiary-container text-label-md text-on-tertiary-container">
                      {pos + 1}
                    </span>
                    <div className="min-w-0">
                      <blockquote>
                        <p className="text-body-lg italic text-on-surface">
                          «{k.text}»
                        </p>
                        <footer className="mt-xs text-label-md text-tertiary">
                          — {k.quelle}
                          {k.kommentar && (
                            <span className="text-on-surface-variant">
                              {" "}
                              · {k.kommentar}
                            </span>
                          )}
                        </footer>
                      </blockquote>
                      {k.deutung && (
                        <p className="mt-sm text-body-md text-on-surface-variant">
                          {k.deutung}
                        </p>
                      )}
                      {k.ziel && (
                        <button
                          type="button"
                          onClick={() => springe(k.ziel!)}
                          className="mt-md inline-flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-bright px-md py-xs text-label-md text-tertiary transition-colors hover:bg-surface-container"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            arrow_downward
                          </span>
                          {sprungLabel}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
