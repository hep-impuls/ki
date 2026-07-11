"use client";

import { useEffect, useRef, useState } from "react";

/**
 * FadenNetz — das interaktive Kopf-Muster der Themenseiten von Lernseite 2.
 *
 * Nachfolger des einfachen Weisheits-Fadens (ein einzelner Bogen, für alle
 * Seiten gleich): Statt einem Faden trägt jede Seite ihr individuelles
 * Muster (Auftritts-Stern, Epochen-Linie, Gewebe) — aus mehreren Fäden,
 * denen man einzeln und auf
 * unterschiedlichen Wegen mit Maus oder Finger nachfahren kann. Der
 * Akzentfaden wächst dort, wo man entlangfährt (in beide Richtungen,
 * ohne Teleport-Sprünge). Erreicht die Spur einen Knoten — auch mitten
 * auf einer Kreuzung —, erscheint dessen Weisheit in der Karte darunter.
 * Knoten sind zusätzlich direkt antipp- und per Tastatur bedienbar;
 * optional springt ein Knopf zu einem Ziel-Anker (z.B. Epochen-Panel).
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
  /** Optionaler Brückensatz zum Seitenthema. */
  kommentar?: string;
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

const VB_W = 720;
/** Fangradius fürs Nachfahren (viewBox-Einheiten). */
const FANG = 36;
/** Abtastpunkte pro Faden. */
const N = 90;
/** Toleranz (in Abtastpunkten), mit der ein Knoten als erreicht gilt. */
const REICH_EPS = 3;
/** Max. Sprung (in Abtastpunkten) beim Weiterfahren auf demselben Faden. */
const SPRUNG = 10;

type Bereich = { lo: number; hi: number } | null;

type Messung = {
  mess: { total: number; samples: { x: number; y: number; len: number }[] }[];
  /** Je Knoten: auf welchen Fäden (Index) er bei welchem Abtastpunkt liegt. */
  adj: { s: number; idx: number }[][];
};

export default function FadenNetz({
  knoten,
  straenge,
  hoehe = 220,
  einladung,
  sprungLabel = "Hinspringen",
  svgKlasse = "",
  className = "",
}: {
  knoten: FadenKnoten[];
  straenge: FadenStrang[];
  /** viewBox-Höhe (Breite fix 720). */
  hoehe?: number;
  einladung: string;
  sprungLabel?: string;
  /** Aspekt-Klassen fürs SVG (Literalstrings der Seite, z.B. "aspect-[720/300] sm:aspect-[720/220]"). */
  svgKlasse?: string;
  className?: string;
}) {
  const n = knoten.length;
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const messRef = useRef<Messung | null>(null);

  const [ready, setReady] = useState(false);
  const [painted, setPainted] = useState<Bereich[]>(() =>
    straenge.map(() => null)
  );
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<number | null>(null);

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

    setPainted((prev) => {
      const cur = prev[bs];
      let neu: Bereich;
      if (!cur) {
        neu = { lo: bi, hi: bi };
      } else if (bi >= cur.lo - SPRUNG && bi <= cur.hi + SPRUNG) {
        neu = { lo: Math.min(cur.lo, bi), hi: Math.max(cur.hi, bi) };
        if (neu.lo === cur.lo && neu.hi === cur.hi) return prev;
      } else {
        return prev; // kein Teleport innerhalb eines Fadens
      }
      const next = prev.slice();
      next[bs] = neu;

      // Erreichte Knoten einsammeln (Spur berührt ihren Abtastpunkt).
      let zuletzt: number | null = null;
      const dazu: number[] = [];
      m.adj.forEach((list, k) => {
        if (visited.has(k)) return;
        const erreicht = list.some(({ s, idx }) => {
          const b = next[s];
          return b !== null && idx >= b.lo - REICH_EPS && idx <= b.hi + REICH_EPS;
        });
        if (erreicht) {
          dazu.push(k);
          zuletzt = k;
        }
      });
      if (dazu.length > 0) {
        setVisited((v) => {
          const nx = new Set(v);
          dazu.forEach((k) => nx.add(k));
          return nx;
        });
        setActive(zuletzt);
      }
      return next;
    });
  }

  function reveal(i: number) {
    setVisited((prev) => new Set(prev).add(i));
    setActive(i);
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

  const done = visited.size === n;
  const started = visited.size > 0 || painted.some((b) => b !== null);
  const aktiv = active !== null ? knoten[active] : null;

  return (
    <section aria-label="Muster zum Nachfahren" className={className}>
      <p className="mb-sm flex items-center gap-xs text-label-sm uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[16px] text-tertiary">
          {done ? "done_all" : "swipe"}
        </span>
        {done
          ? `Alle ${n} Knoten besucht`
          : started
          ? `${visited.size} von ${n} Knoten besucht`
          : "Fahr den Fäden nach — mehrere Wege sind möglich"}
      </p>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${hoehe}`}
        preserveAspectRatio="none"
        onPointerMove={handlePointer}
        onPointerDown={handlePointer}
        className={"block w-full select-none touch-pan-y " + svgKlasse}
      >
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
          const isActive = active === i;
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
              {isActive && (
                <circle
                  cx={k.x}
                  cy={k.y}
                  r="14"
                  fill="none"
                  strokeWidth="1"
                  className="stroke-tertiary"
                  opacity="0.5"
                />
              )}
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
                  fontSize="11"
                  className="fill-on-surface-variant"
                >
                  {k.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Weisheits-Karte */}
      <div
        aria-live="polite"
        className="mt-sm min-h-[104px] rounded-xl border border-outline-variant bg-surface-container-low p-md"
      >
        {aktiv === null ? (
          <p className="flex items-start gap-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-tertiary">
              explore
            </span>
            {einladung}
          </p>
        ) : (
          <blockquote key={active} className="animate-frame-in">
            <p className="text-body-md italic text-on-surface">«{aktiv.text}»</p>
            <footer className="mt-xs text-label-sm text-on-surface-variant">
              — {aktiv.quelle}
              {aktiv.kommentar && <> · {aktiv.kommentar}</>}
            </footer>
            {aktiv.ziel && (
              <button
                type="button"
                onClick={() => springe(aktiv.ziel!)}
                className="mt-sm inline-flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs text-label-md text-tertiary transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[16px]">
                  arrow_downward
                </span>
                {sprungLabel}
              </button>
            )}
          </blockquote>
        )}
      </div>
    </section>
  );
}
