"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * WeisheitsFaden — interaktives Gewebe-Muster für die Themenseiten von
 * Lernseite 2.
 *
 * Einladung zum Nachfahren: Wer dem Faden mit Maus oder Finger folgt, zieht
 * einen Akzentfaden hinter sich her; an den Knoten «leuchtet» je eine kurze
 * Weisheit auf (Zitat + Brückensatz zum Thema der Seite). Knoten lassen sich
 * auch direkt antippen (Tastatur: Tab + Enter).
 *
 * Gestaltung wie Gewebe.tsx: nur Theme-Tokens, keine Verläufe/Filter, alle
 * Koordinaten deterministisch (kein Math.random). Messungen mit
 * getTotalLength/getPointAtLength laufen erst im Effect (kein SSR-Mismatch).
 */

export interface Weisheit {
  /** Kurzes Zitat bzw. offene Frage (ohne Anführungszeichen). */
  text: string;
  /** Urheber — bei Paraphrasen «nach …». */
  quelle: string;
  /** Optionaler Brückensatz zum Thema der Seite. */
  kommentar?: string;
}

const VB_W = 720;
const VB_H = 150;
/** Fangradius fürs Nachfahren (in viewBox-Einheiten). */
const FANG = 34;

/** Knotenpunkte: gleichmässig über die Breite, Höhen alternierend (von Hand). */
function knotenPunkte(n: number): [number, number][] {
  const ys = [100, 48, 96, 44, 88, 52];
  return Array.from({ length: n }, (_, i) => {
    const x = n === 1 ? VB_W / 2 : 40 + (i * (VB_W - 80)) / (n - 1);
    return [Math.round(x), ys[i % ys.length]] as [number, number];
  });
}

/** Catmull-Rom-Spline durch alle Punkte als kubischer Bezier-Pfad. */
function fadenPfad(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  const p = (i: number) => pts[Math.max(0, Math.min(pts.length - 1, i))];
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = p(i - 1);
    const p1 = p(i);
    const p2 = p(i + 1);
    const p3 = p(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

type Messung = {
  total: number;
  samples: { x: number; y: number; f: number }[];
  knotF: number[];
};

export default function WeisheitsFaden({
  weisheiten,
  className = "",
}: {
  weisheiten: Weisheit[];
  className?: string;
}) {
  const n = weisheiten.length;
  const pts = useMemo(() => knotenPunkte(n), [n]);
  const d = useMemo(() => fadenPfad(pts), [pts]);

  const svgRef = useRef<SVGSVGElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const messRef = useRef<Messung | null>(null);

  const [total, setTotal] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<number | null>(null);

  // Pfad vermessen (nur im Browser; fürs Rendern des Grundfadens unnötig).
  useEffect(() => {
    const el = baseRef.current;
    if (!el) return;
    const t = el.getTotalLength();
    const N = 160;
    const samples = Array.from({ length: N + 1 }, (_, i) => {
      const p = el.getPointAtLength((t * i) / N);
      return { x: p.x, y: p.y, f: i / N };
    });
    const knotF = pts.map(([kx, ky]) => {
      let bf = 0;
      let bd = Infinity;
      for (const s of samples) {
        const dist = (s.x - kx) ** 2 + (s.y - ky) ** 2;
        if (dist < bd) {
          bd = dist;
          bf = s.f;
        }
      }
      return bf;
    });
    messRef.current = { total: t, samples, knotF };
    setTotal(t);
  }, [pts]);

  // Nachfahren: nächstliegenden Pfadpunkt suchen, Fortschritt monoton erhöhen.
  function handlePointer(e: React.PointerEvent<SVGSVGElement>) {
    const mess = messRef.current;
    const svg = svgRef.current;
    if (!mess || !svg) return;
    const r = svg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * VB_W;
    const y = ((e.clientY - r.top) / r.height) * VB_H;
    let bf = 0;
    let bd = Infinity;
    for (const s of mess.samples) {
      const dist = (s.x - x) ** 2 + (s.y - y) ** 2;
      if (dist < bd) {
        bd = dist;
        bf = s.f;
      }
    }
    if (Math.sqrt(bd) > FANG) return;
    // nur vorwärts und ohne grosse Sprünge — man soll wirklich nachfahren
    setProgress((prev) => (bf > prev && bf - prev < 0.2 ? bf : prev));
  }

  // Erreichte Knoten einsammeln; der zuletzt erreichte zeigt seine Weisheit.
  useEffect(() => {
    const mess = messRef.current;
    if (!mess || progress <= 0.001) return;
    let neu: number | null = null;
    mess.knotF.forEach((kf, i) => {
      if (progress >= kf - 0.01 && !visited.has(i)) neu = i;
    });
    if (neu !== null) {
      setVisited((prev) => {
        const nx = new Set(prev);
        mess.knotF.forEach((kf, i) => {
          if (progress >= kf - 0.01) nx.add(i);
        });
        return nx;
      });
      setActive(neu);
    }
  }, [progress, visited]);

  function reveal(i: number) {
    setVisited((prev) => new Set(prev).add(i));
    setActive(i);
  }

  const done = visited.size === n;
  const started = progress > 0.02 || visited.size > 0;

  return (
    <section aria-label="Weisheits-Faden zum Nachfahren" className={className}>
      <p className="mb-sm flex items-center gap-xs text-label-sm uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[16px] text-tertiary">
          {done ? "done_all" : "swipe"}
        </span>
        {done
          ? `Alle ${n} Knoten besucht`
          : started
          ? `${visited.size} von ${n} Knoten besucht`
          : "Fahr dem Faden nach — mit Maus oder Finger"}
      </p>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        onPointerMove={handlePointer}
        onPointerDown={handlePointer}
        className="block w-full select-none touch-pan-y aspect-[720/210] sm:aspect-[720/150]"
      >
        {/* Grundfaden */}
        <path
          ref={baseRef}
          d={d}
          fill="none"
          strokeWidth="1.25"
          className="stroke-outline-variant"
        />
        {/* Nachgefahrener Akzentfaden */}
        {total > 0 && (
          <path
            d={d}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={total}
            strokeDashoffset={total * (1 - progress)}
            style={{ transition: "stroke-dashoffset 90ms linear" }}
            className="stroke-tertiary"
            opacity="0.85"
          />
        )}
        {/* Puls am Fadenanfang als Einladung */}
        {!started && (
          <circle
            cx={pts[0][0]}
            cy={pts[0][1]}
            r="10"
            className="fill-tertiary opacity-30 animate-ping origin-center [transform-box:fill-box] motion-reduce:hidden"
          />
        )}
        {/* Knoten (antippbar, fokussierbar) */}
        {pts.map(([x, y], i) => {
          const reached = visited.has(i);
          const isActive = active === i;
          return (
            <g
              key={i}
              tabIndex={0}
              role="button"
              aria-label={`Weisheit ${i + 1} von ${n}: ${weisheiten[i].quelle}`}
              onClick={() => reveal(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  reveal(i);
                }
              }}
              className="cursor-pointer outline-none"
            >
              {/* grosszügige unsichtbare Trefferfläche */}
              <circle cx={x} cy={y} r="20" fill="transparent" />
              {isActive && (
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill="none"
                  strokeWidth="1"
                  className="stroke-tertiary"
                  opacity="0.5"
                />
              )}
              {reached ? (
                <>
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="none"
                    strokeWidth="1"
                    className="stroke-tertiary"
                    opacity="0.45"
                  />
                  <circle cx={x} cy={y} r="4.5" className="fill-tertiary" />
                </>
              ) : (
                <>
                  <circle
                    cx={x}
                    cy={y}
                    r="6.5"
                    fill="none"
                    strokeWidth="1"
                    className="stroke-outline transition-opacity duration-300 hover:opacity-100"
                    opacity="0.7"
                  />
                  <circle cx={x} cy={y} r="2" className="fill-outline" opacity="0.6" />
                </>
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
        {active === null ? (
          <p className="flex items-start gap-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-tertiary">
              explore
            </span>
            An den Knoten warten kurze Weisheiten — fahr dem Faden nach oder
            tippe einen Knoten an.
          </p>
        ) : (
          <blockquote key={active} className="animate-frame-in">
            <p className="text-body-md italic text-on-surface">
              «{weisheiten[active].text}»
            </p>
            <footer className="mt-xs text-label-sm text-on-surface-variant">
              — {weisheiten[active].quelle}
              {weisheiten[active].kommentar && (
                <> · {weisheiten[active].kommentar}</>
              )}
            </footer>
          </blockquote>
        )}
      </div>
    </section>
  );
}
