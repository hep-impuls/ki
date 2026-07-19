"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  leseSpurenIndices,
  loescheSpuren,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";
import KartenAktion from "./KartenAktion";
import GewichtungWahl from "./GewichtungWahl";
import { GlossarText } from "./Glossar";

/**
 * HistorienTeppich — drei Fäden durch die Geschichte: Technologie,
 * Entdeckungen und gesellschaftliche Ereignisse. Die Punkte sind sichtbar;
 * die Fäden weben sich erst durchs Anklicken ein (ein Fadensegment erscheint,
 * sobald beide Endpunkte besucht sind). Die Fäden kreuzen sich zwischendurch,
 * laufen aber auch allein. Karten der besuchten Punkte bleiben unten stehen.
 * Pro Punkt ist ein optionaler «Verunsicherungs-Stopp» vorgesehen
 * (Feld `verunsicherung` — Inhalte folgen). Nur Theme-Tokens (drei
 * Token-Farben für die drei Fäden) und Material Symbols.
 */

export type FadenArt = "technologie" | "entdeckungen" | "ereignisse" | "praxen";

export interface TeppichPunkt {
  faden: FadenArt;
  /** Position im 720×300-Gewebe. */
  x: number;
  y: number;
  titel: string;
  kurz: string;
  jahr: string;
  text: string;
  mehr?: string;
  /** Beschriftung über statt unter dem Punkt (zur Kollisionsvermeidung). */
  labelOben?: boolean;
  /** Verunsicherungs-Stopp — verknüpft den Punkt mit der Verunsicherung
   *  seiner Zeit (abgestimmt auf den Epochen-Zeitstrahl darunter). */
  verunsicherung?: string;
}

const W = 720;
const H = 300;

const FADEN_META: Record<
  FadenArt,
  { label: string; strich: string; punkt: string; chip: string }
> = {
  technologie: {
    label: "Technologie",
    strich: "stroke-tertiary",
    punkt: "fill-tertiary",
    chip: "bg-tertiary",
  },
  entdeckungen: {
    label: "Entdeckungen",
    strich: "stroke-secondary",
    punkt: "fill-secondary",
    chip: "bg-secondary",
  },
  ereignisse: {
    label: "Gesellschaftliche Ereignisse",
    strich: "stroke-primary",
    punkt: "fill-primary",
    chip: "bg-primary",
  },
  praxen: {
    label: "Kulturelle Praxen",
    strich: "stroke-error",
    punkt: "fill-error",
    chip: "bg-error",
  },
};

/** Weiches Fadensegment zwischen zwei Punkten (horizontal gespannte Kurve). */
function segmentPfad(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  return `M${a.x} ${a.y} C${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

type XY = { x: number; y: number };

/**
 * Teppich-Palette: Jede Masche bekommt ihre eigene, bewusst LEUCHTENDE Farbe
 * plus Webtextur — je mehr Zwischenfelder gefüllt sind, desto vielfältiger
 * wird der Teppich. Wie die Perlenfarben der KI-Story eine dokumentierte,
 * punktuelle Ausnahme von der reinen Token-Palette (die Farbe trägt hier die
 * Teppich-Ästhetik).
 */
const MASCHEN_FARBEN = [
  "#f94144",
  "#f3722c",
  "#f8961e",
  "#f9c74f",
  "#90be6d",
  "#43aa8b",
  "#4d908e",
  "#577590",
  "#277da1",
  "#5e60ce",
  "#9d4edd",
  "#d81159",
] as const;

/** Vier Webtexturen (Schuss-Richtungen), zyklisch mit den Farben kombiniert. */
function MaschenPattern({ id, farbe, variante }: { id: string; farbe: string; variante: number }) {
  return (
    <pattern id={id} patternUnits="userSpaceOnUse" width="10" height="10">
      <rect width="10" height="10" fill={farbe} opacity="0.08" />
      {variante === 0 && (
        <path d="M0 10 L10 0 M-2.5 2.5 L2.5 -2.5 M7.5 12.5 L12.5 7.5" stroke={farbe} strokeWidth="1.2" opacity="0.22" />
      )}
      {variante === 1 && (
        <path d="M0 0 L10 10 M-2.5 7.5 L2.5 12.5 M7.5 -2.5 L12.5 2.5" stroke={farbe} strokeWidth="1.2" opacity="0.22" />
      )}
      {variante === 2 && <circle cx="5" cy="5" r="1.6" fill={farbe} opacity="0.3" />}
      {variante === 3 && (
        <path d="M5 1.5 L5 8.5 M1.5 5 L8.5 5" stroke={farbe} strokeWidth="1.1" opacity="0.22" />
      )}
    </pattern>
  );
}

/** Umkreis-Mittelpunkt + Radius² dreier Punkte (für Delaunay). */
function umkreis(a: XY, b: XY, c: XY) {
  const ad = a.x * a.x + a.y * a.y;
  const bd = b.x * b.x + b.y * b.y;
  const cd = c.x * c.x + c.y * c.y;
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-9) return { x: 0, y: 0, r2: Infinity };
  const x = (ad * (b.y - c.y) + bd * (c.y - a.y) + cd * (a.y - b.y)) / d;
  const y = (ad * (c.x - b.x) + bd * (a.x - c.x) + cd * (b.x - a.x)) / d;
  const r2 = (a.x - x) ** 2 + (a.y - y) ** 2;
  return { x, y, r2 };
}

/**
 * Delaunay-Triangulation (Bowyer–Watson) über die Punkte — liefert Tripel von
 * Punkt-Indizes. Bei ≤ ein paar Dutzend Punkten problemlos. Deterministisch.
 */
function trianguliere(pts: XY[]): [number, number, number][] {
  const n = pts.length;
  if (n < 3) return [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of pts) {
    minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
  }
  const dmax = Math.max(maxX - minX, maxY - minY) || 1;
  const midX = (minX + maxX) / 2, midY = (minY + maxY) / 2;
  const verts: XY[] = [
    ...pts,
    { x: midX - 20 * dmax, y: midY - dmax },
    { x: midX, y: midY + 20 * dmax },
    { x: midX + 20 * dmax, y: midY - dmax },
  ];
  let tris: [number, number, number][] = [[n, n + 1, n + 2]];
  for (let i = 0; i < n; i++) {
    const p = verts[i];
    const kaputt: [number, number, number][] = [];
    tris = tris.filter((t) => {
      const cc = umkreis(verts[t[0]], verts[t[1]], verts[t[2]]);
      const drin = (p.x - cc.x) ** 2 + (p.y - cc.y) ** 2 <= cc.r2;
      if (drin) kaputt.push(t);
      return !drin;
    });
    const kanten: [number, number][] = [];
    kaputt.forEach((t) => {
      kanten.push([t[0], t[1]], [t[1], t[2]], [t[2], t[0]]);
    });
    kanten.forEach((e, idx) => {
      const geteilt = kanten.some(
        (f, j) =>
          j !== idx &&
          ((f[0] === e[0] && f[1] === e[1]) || (f[0] === e[1] && f[1] === e[0])),
      );
      if (!geteilt) tris.push([e[0], e[1], i]);
    });
  }
  return tris.filter((t) => t.every((v) => v < n));
}

export default function HistorienTeppich({
  punkte,
  spurKey,
  wunschKey,
  bewertungen = [],
  className = "",
}: {
  punkte: TeppichPunkt[];
  /** Spur-Präfix, z.B. "philosophische-perspektive:teppich". */
  spurKey: string;
  wunschKey?: string;
  /** Bewertungs-Zeilen pro Karte (z.B. Bekanntheit, Lebensrelevanz) —
   *  jeweils eine Drei-Stufen-Gewichtung mit eigenem Präfix. */
  bewertungen?: { prefix: string; frage: string; stufen: [string, string, string] }[];
  className?: string;
}) {
  const n = punkte.length;
  // Gewebe-Maschen: Delaunay-Dreiecke über die Punkte; nur nicht zu grosse
  // (lokale) Maschen füllen den Teppich, wenn alle drei Ecken besucht sind.
  const maschen = useMemo(() => {
    const xy = punkte.map((p) => ({ x: p.x, y: p.y }));
    const MAX_KANTE = 260;
    return trianguliere(xy).filter((t) => {
      const [a, b, c] = t.map((i) => xy[i]);
      const e = (p: XY, q: XY) => Math.hypot(p.x - q.x, p.y - q.y);
      return Math.max(e(a, b), e(b, c), e(c, a)) <= MAX_KANTE;
    });
  }, [punkte]);
  const [besucht, setBesucht] = useState<Set<number>>(new Set());
  const [reihenfolge, setReihenfolge] = useState<number[]>([]);
  /** Bewusst wieder weggeklickte Punkte — bleiben beim Spur-Restore draussen,
   *  damit die Leiste unten nicht überquillt (die Aktivität bleibt gezählt). */
  const abgewaehlt = useRef<Set<number>>(new Set());

  useEffect(() => {
    function restore() {
      const idx = leseSpurenIndices(spurKey).filter(
        (i) => i >= 0 && i < n && !abgewaehlt.current.has(i),
      );
      if (idx.length === 0) return;
      setBesucht((prev) => {
        const nx = new Set(prev);
        idx.forEach((i) => nx.add(i));
        return nx;
      });
      setReihenfolge((prev) => {
        const fehlend = idx.filter((i) => !prev.includes(i));
        return fehlend.length ? [...prev, ...fehlend] : prev;
      });
    }
    restore();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [spurKey, n]);

  /** Antippen wählt an — erneutes Antippen wählt wieder ab. */
  function besuche(i: number) {
    if (besucht.has(i)) {
      abgewaehlt.current.add(i);
      setBesucht((prev) => {
        const nx = new Set(prev);
        nx.delete(i);
        return nx;
      });
      setReihenfolge((prev) => prev.filter((x) => x !== i));
      return;
    }
    abgewaehlt.current.delete(i);
    setBesucht((prev) => new Set(prev).add(i));
    setReihenfolge((prev) => (prev.includes(i) ? prev : [...prev, i]));
    merkeSpur(`${spurKey}:${i}`);
  }

  /** Legende: ganzen Faden an- oder abwählen. */
  function toggleFaden(art: FadenArt) {
    const idx = punkte.map((p, i) => ({ p, i })).filter(({ p }) => p.faden === art).map(({ i }) => i);
    const alleAn = idx.every((i) => besucht.has(i));
    if (alleAn) {
      idx.forEach((i) => abgewaehlt.current.add(i));
      setBesucht((prev) => {
        const nx = new Set(prev);
        idx.forEach((i) => nx.delete(i));
        return nx;
      });
      setReihenfolge((prev) => prev.filter((x) => !idx.includes(x)));
    } else {
      idx.forEach((i) => {
        abgewaehlt.current.delete(i);
        if (!besucht.has(i)) merkeSpur(`${spurKey}:${i}`);
      });
      setBesucht((prev) => {
        const nx = new Set(prev);
        idx.forEach((i) => nx.add(i));
        return nx;
      });
      setReihenfolge((prev) => [...prev, ...idx.filter((i) => !prev.includes(i))]);
    }
  }

  function zuruecksetzen() {
    loescheSpuren(spurKey);
    abgewaehlt.current = new Set();
    setBesucht(new Set());
    setReihenfolge([]);
  }

  // Fäden: Indizes je Fadenart, nach x sortiert (chronologisch).
  const faeden = (Object.keys(FADEN_META) as FadenArt[]).map((art) => ({
    art,
    idx: punkte
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.faden === art)
      .sort((a, b) => a.p.x - b.p.x)
      .map(({ i }) => i),
  }));

  const alleBesucht = besucht.size === n;

  return (
    <section aria-label="Historischer Teppich" className={className}>
      <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
        <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] text-tertiary">
            {alleBesucht ? "done_all" : "touch_app"}
          </span>
          {besucht.size === 0
            ? "Tippe die Punkte an — die Fäden weben sich ein"
            : `${besucht.size} von ${n} Punkten besucht`}
        </p>
        {besucht.size > 0 && (
          <button
            type="button"
            onClick={zuruecksetzen}
            className="inline-flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            Teppich zurücksetzen
          </button>
        )}
      </div>

      {/* Legende — pro Faden ein Schalter: ganzen Faden an- oder abwählen */}
      <div className="mb-sm flex flex-wrap items-center gap-sm">
        {(Object.keys(FADEN_META) as FadenArt[]).map((art) => {
          const idx = punkte
            .map((p, i) => ({ p, i }))
            .filter(({ p }) => p.faden === art)
            .map(({ i }) => i);
          const alleAn = idx.length > 0 && idx.every((i) => besucht.has(i));
          return (
            <button
              key={art}
              type="button"
              onClick={() => toggleFaden(art)}
              aria-pressed={alleAn}
              className={
                "flex items-center gap-xs rounded-full border px-sm py-xs text-label-sm transition-colors " +
                (alleAn
                  ? "border-tertiary bg-tertiary-container text-on-tertiary-container"
                  : "border-outline-variant bg-surface-bright text-on-surface-variant hover:bg-surface-container hover:text-on-surface")
              }
            >
              <span className={`inline-block h-3 w-3 rounded-full ${FADEN_META[art].chip}`} />
              {FADEN_META[art].label}
              <span className="material-symbols-outlined text-[14px]">
                {alleAn ? "check" : "add"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Der Teppich */}
      <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low/60 p-sm sm:p-md">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="block w-full select-none aspect-[720/430] sm:aspect-[720/300]"
          role="img"
          aria-label="Historischer Teppich: vier Fäden — Technologie, Entdeckungen, gesellschaftliche Ereignisse und kulturelle Praxen — weben sich durchs Antippen der Punkte ein; zwischen besuchten Punkten füllen sich gemusterte Maschen."
        >
          {/* Webmuster — 12 leuchtende Farb-/Textur-Kombinationen; jede neue
              Masche bringt die nächste, so wächst die Vielfalt mit dem Füllen */}
          <defs>
            {MASCHEN_FARBEN.map((farbe, i) => (
              <MaschenPattern key={i} id={`tpat-${i}`} farbe={farbe} variante={i % 4} />
            ))}
          </defs>

          {/* Kettfäden des Teppichs (feiner Hintergrund) */}
          {Array.from({ length: 13 }, (_, i) => 40 + i * 53).map((x) => (
            <line
              key={`k${x}`}
              x1={x}
              y1={16}
              x2={x}
              y2={H - 16}
              strokeWidth="0.6"
              className="stroke-outline-variant"
              opacity="0.35"
            />
          ))}

          {/* Gewebe-Maschen: gefüllt + gemustert, sobald alle drei Ecken
              besucht sind — jede Masche mit eigener Farbe/Textur aus der
              Teppich-Palette, die Vielfalt wächst mit jedem Feld */}
          {maschen.map((t, i) => {
            const sichtbar = t.every((v) => besucht.has(v));
            const k = i % MASCHEN_FARBEN.length;
            const pts = t.map((v) => `${punkte[v].x},${punkte[v].y}`).join(" ");
            return (
              <polygon
                key={`m${i}`}
                points={pts}
                fill={`url(#tpat-${k})`}
                stroke={MASCHEN_FARBEN[k]}
                strokeWidth="0.5"
                strokeOpacity="0.15"
                className="transition-opacity duration-700"
                opacity={sichtbar ? 1 : 0}
              />
            );
          })}

          {/* Fadensegmente — erscheinen, wenn beide Endpunkte besucht sind */}
          {faeden.map(({ art, idx }) =>
            idx.slice(1).map((bIdx, k) => {
              const aIdx = idx[k];
              const sichtbar = besucht.has(aIdx) && besucht.has(bIdx);
              return (
                <path
                  key={`${art}-${k}`}
                  d={segmentPfad(punkte[aIdx], punkte[bIdx])}
                  fill="none"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  className={`${FADEN_META[art].strich} transition-opacity duration-700`}
                  opacity={sichtbar ? 0.75 : 0}
                />
              );
            }),
          )}

          {/* Punkte */}
          {punkte.map((p, i) => {
            const da = besucht.has(i);
            const meta = FADEN_META[p.faden];
            const beschriftung = `${p.kurz} · ${p.jahr}`;
            const halb = (beschriftung.length * 5) / 2;
            const labelX = Math.max(halb + 4, Math.min(W - halb - 4, p.x)) - p.x;
            const labelUnten = !p.labelOben;
            return (
              <g
                key={i}
                role="button"
                tabIndex={0}
                aria-label={`${p.titel} (${p.jahr}) — antippen zum Lesen, erneut antippen zum Abwählen`}
                aria-pressed={da}
                onClick={() => besuche(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    besuche(i);
                  }
                }}
                transform={`translate(${p.x}, ${p.y})`}
                className="group cursor-pointer outline-none"
              >
                <circle cx="0" cy="0" r="16" fill="transparent" />
                {!da && (
                  <circle
                    cx="0"
                    cy="0"
                    r="9"
                    fill="none"
                    strokeWidth="1"
                    className={`${meta.strich} animate-ping opacity-30 motion-reduce:hidden`}
                  />
                )}
                {da && (
                  <circle
                    cx="0"
                    cy="0"
                    r="10"
                    fill="none"
                    strokeWidth="1.2"
                    className={meta.strich}
                    opacity="0.5"
                  />
                )}
                <circle
                  cx="0"
                  cy="0"
                  r={da ? 6.5 : 5}
                  className={`${meta.punkt} origin-center [transform-box:fill-box] transition-transform duration-300 group-hover:scale-125 group-focus-visible:scale-125`}
                  opacity={da ? 1 : 0.75}
                />
                <text
                  x={labelX}
                  y={labelUnten ? 22 : -14}
                  textAnchor="middle"
                  fontSize="10"
                  className={
                    (da
                      ? "fill-on-surface font-semibold"
                      : "fill-on-surface-variant opacity-80") + " pointer-events-none"
                  }
                >
                  {beschriftung}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-xs text-label-sm text-on-surface-variant">
        Punkt antippen liest die Geschichte und webt den Faden ein — sichtbar
        wird ein Fadenstück, sobald seine beiden Enden besucht sind. Erneutes
        Antippen wählt einen Punkt wieder ab; die Legende oben schaltet ganze
        Fäden an und aus.
      </p>

      {/* Besuchte Punkte — bleiben stehen, in Besuchs-Reihenfolge */}
      <div aria-live="polite" className="mt-md">
        {reihenfolge.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-lg">
            <p className="flex items-start gap-sm text-body-md text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px] text-tertiary">explore</span>
              So geht es: Im Teppich liegen vier Fäden verborgen — Technologie,
              Entdeckungen, gesellschaftliche Ereignisse und kulturelle Praxen.
              Tippe einen Punkt an: Seine Geschichte erscheint hier, und sobald
              zwei benachbarte Punkte desselben Fadens besucht sind, wird das
              Fadenstück dazwischen sichtbar. Über die Legende oben lassen sich
              ganze Fäden ein- und ausblenden; erneutes Antippen wählt einen
              Punkt wieder ab. Die Fäden kreuzen sich zwischendurch — und laufen
              auch allein.
            </p>
          </div>
        ) : (
          <ol className="flex flex-col gap-sm">
            {reihenfolge.map((idx, pos) => {
              const p = punkte[idx];
              const meta = FADEN_META[p.faden];
              const neuste = pos === reihenfolge.length - 1;
              return (
                <li
                  key={idx}
                  className={
                    "rounded-xl border p-md sm:p-lg " +
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
                      <p className="flex flex-wrap items-baseline gap-x-sm text-body-lg font-medium text-on-surface">
                        {p.titel}
                        <span className="text-label-md font-normal text-tertiary">{p.jahr}</span>
                        <span className="flex items-center gap-xs text-label-sm font-normal text-on-surface-variant">
                          <span className={`inline-block h-2.5 w-2.5 rounded-full ${meta.chip}`} />
                          {meta.label}
                        </span>
                      </p>
                      <p className="mt-xs text-body-md text-on-surface">
                        <GlossarText text={p.text} />
                      </p>
                      {p.verunsicherung && (
                        <div className="mt-sm rounded-lg border border-outline-variant bg-surface-container-low p-sm">
                          <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-tertiary">
                            <span className="material-symbols-outlined text-[16px]">
                              psychology_alt
                            </span>
                            Verunsicherungs-Stopp
                          </p>
                          <p className="mt-xs text-body-sm text-on-surface-variant">
                            <GlossarText text={p.verunsicherung} />
                          </p>
                        </div>
                      )}
                      <KartenAktion
                        mehr={p.mehr ? <GlossarText text={p.mehr} /> : undefined}
                        wunschId={`wunsch:${wunschKey ?? spurKey}:${idx}`}
                      />
                      {bewertungen.length > 0 && (
                        <div className="mt-sm space-y-xs border-t border-outline-variant pt-sm">
                          {bewertungen.map((b) => (
                            <GewichtungWahl
                              key={b.prefix}
                              prefix={b.prefix}
                              index={idx}
                              frage={b.frage}
                              stufen={b.stufen}
                            />
                          ))}
                        </div>
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
