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
import { maschen as berechneMaschen, zaehleGefuellt } from "../_lib/flaechen";
import { melde } from "../_lib/auswertung";
import { merkeInhalt } from "../_lib/inhalte";
import SammelAccordion from "./SammelAccordion";

/**
 * StoryGewebe — die KI-Story als flexibles Teil-Gewebe (Vorbild: das
 * «Gewebe» und «Log» von natalitaet.com).
 *
 * Oben wählt man in einer flachen Liste, WELCHE Stationen erscheinen;
 * «Zufall (3)» zieht drei zufällig, «Alle» zeigt alle. Zwei Ansichten:
 *
 *  - «Gewebe» (Standard): freies, federndes Netz — eine Box, in der man
 *    die Punkte selbst VERSCHIEBEN kann; die Verbindungen bleiben fix, das
 *    Netz schwingt mit. Chronologisch aufeinanderfolgende Stationen hängen
 *    am Erzähl-Faden, feine Bögen zeigen Einflüsse quer durch die Zeit.
 *  - «Zeitlich»: eine hängende PERLENSCHNUR (nach natalitäts «Log») — die
 *    Stationen als Perlen von oben (früher) nach unten (heute) aufgereiht.
 *    Bewegt man den Zeiger durchs Muster, schwingt die Kette hin und her;
 *    eine Perle lässt sich auch direkt ziehen.
 *
 * Ein Klick/Tipp (ohne Ziehen) aktiviert eine Station: ihre Karte blendet
 * unten ein und bleibt stehen — mit Bild (falls vorhanden) und der längeren
 * Geschichte. Bilder erscheinen also erst bei Aktivierung; Punkte mit Bild
 * tragen ein kleines Bild-Symbol. Aktivierte Stationen werden dreifach
 * registriert (_lib/spuren.ts) und bleiben geräteübergreifend offen.
 *
 * Nur Theme-Tokens; eigene Mini-Physik (kein d3 — package.json ist geteilt).
 * SSR rendert deterministische Startpositionen; die Simulation rechnet erst
 * im Browser (kein Hydration-Mismatch).
 */

export type StoryKat = "erzaehlung" | "mechanik" | "regeln" | "daten";
export type StoryMMF = "fiktion" | "mensch" | "maschine";

export interface StoryStation {
  titel: string;
  /** Kurzform fürs Muster + die Auswahl-Chips. */
  kurz: string;
  jahr: string;
  /** Kurzer Einstieg (zwei Sätze). */
  text: string;
  /** Die längere Geschichte — erscheint in der Karte unter dem Einstieg. */
  geschichte?: string;
  /** Vertiefung hinter «Mehr lesen». */
  mehr?: string;
  /** Ehemalige Gruppierungs-/Strang-Metadaten — aktuell ungenutzt. */
  kat?: StoryKat;
  mmf?: StoryMMF;
  bild?: { src: string; alt: string; credit: string };
}

/** Einfluss quer durch die Zeit (Index → Index), als feiner gestrichelter
 *  Bogen gezeichnet, wenn beide Enden gewählt sind (nur «Gewebe»). */
export interface StoryEinfluss {
  von: number;
  zu: number;
}

/* Gewebe-Box */
const W = 720;
const H = 300;
const RAND = { x0: 44, x1: 676, y0: 34, y1: 258 };

const ANSICHTEN = [
  {
    id: "gewebe",
    label: "Gewebe",
    hinweis:
      "Freies Netz — zieh die Punkte mit Maus oder Finger, das Gewebe federt mit. Verbunden bleibt, was zusammengehört.",
  },
  {
    id: "zeit",
    label: "Zeitlich",
    hinweis:
      "Eine Perlenschnur von früher (oben) nach heute (unten). Bewege den Zeiger durchs Muster — die Kette schwingt; tippe eine Perle zum Lesen.",
  },
] as const;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/** Deterministische Startposition im Gewebe (Kreis um die Boxmitte). */
function startPos(i: number, n: number) {
  const wink = (i / Math.max(1, n)) * 2 * Math.PI - Math.PI / 2;
  return { x: 360 + 150 * Math.cos(wink), y: 148 + 88 * Math.sin(wink) };
}

/* ══════════════════════════════════ Perlenschnur (Ansicht «Zeitlich») ═══ */

type Verlet = { x: number; y: number; ox: number; oy: number };

const P_W = 720;
const P_SEG = 40;
const P_AX = 210;
const P_AY = 24;
/** Physik wie bei natalitäts «Log»-Perlschnur — ruhig, nicht fahrig.
 *  Bewegung entsteht NUR beim Ziehen einer Perle (kein Zeiger-Abstossen),
 *  damit die Kette im Ruhezustand still hängt und anklickbar bleibt. */
const P_GRAV = 0.42;
const P_FRIC = 0.97;

/**
 * Jede Perle hat ihre eigene, bewusst LEUCHTENDE Farbe (chronologisch von
 * warm nach kalt) — auf Wunsch eine punktuelle Ausnahme von der reinen
 * Token-Palette, nur hier in der Perlschnur.
 */
const PERLEN_FARBEN = [
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

function StoryPerlschnur({
  stationen,
  reihe,
  gesammelt,
  onRead,
}: {
  stationen: StoryStation[];
  /** Gewählte Stationen, chronologisch geordnet (Index-Liste). */
  reihe: number[];
  gesammelt: number[];
  onRead: (i: number) => void;
}) {
  const N = reihe.length;
  const P_H = P_AY + Math.max(1, N) * P_SEG + 46;
  const svgRef = useRef<SVGSVGElement>(null);
  const pts = useRef<Verlet[]>([]);
  const drag = useRef<{ k: number; moved: boolean; sx: number; sy: number } | null>(null);
  const raf = useRef<number | null>(null);
  const stepRef = useRef<() => void>(() => {});
  const [, force] = useState(0);

  // Kette (neu) aufbauen, wenn sich die Anzahl der Perlen ändert.
  useEffect(() => {
    // Ruhelage = senkrecht hängende Kette (still, sofort anklickbar).
    pts.current = Array.from({ length: N + 1 }, (_, k) => {
      const x = P_AX;
      const y = P_AY + k * P_SEG;
      return { x, y, ox: x, oy: y };
    });
    force((c) => c + 1);
  }, [N]);

  // Ein Physik-Schritt (Verlet + Constraints + Grenzen). Wird sowohl vom
  // rAF-Loop als auch synchron bei Zeiger-Events aufgerufen — Letzteres,
  // damit Schwingen/Ziehen auch dort funktioniert, wo rAF gedrosselt wird
  // (z.B. in eingebetteten Vorschau-Panes).
  stepRef.current = () => {
    const P = pts.current;
    const dg = drag.current;
    const pinned = dg && dg.moved ? dg.k : -1;
    for (let k = 1; k <= N; k++) {
      const p = P[k];
      if (!p || k === pinned) continue;
      const vx = (p.x - p.ox) * P_FRIC;
      const vy = (p.y - p.oy) * P_FRIC;
      p.ox = p.x;
      p.oy = p.y;
      p.x += vx;
      p.y += vy + P_GRAV;
    }
    for (let it = 0; it < 5; it++) {
      if (P[0]) {
        P[0].x = P_AX;
        P[0].y = P_AY;
      }
      for (let k = 1; k <= N; k++) {
        const a = P[k - 1];
        const b = P[k];
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 0.001;
        const diff = (d - P_SEG) / d;
        const aFix = k - 1 === 0 || k - 1 === pinned;
        const bFix = k === pinned;
        if (aFix && !bFix) {
          b.x -= dx * diff;
          b.y -= dy * diff;
        } else if (bFix && !aFix) {
          a.x += dx * diff;
          a.y += dy * diff;
        } else if (!aFix && !bFix) {
          a.x += dx * diff * 0.5;
          a.y += dy * diff * 0.5;
          b.x -= dx * diff * 0.5;
          b.y -= dy * diff * 0.5;
        }
      }
    }
    for (let k = 1; k <= N; k++) {
      const p = P[k];
      if (!p) continue;
      p.x = clamp(p.x, 40, P_W - 40);
      p.y = clamp(p.y, P_AY, P_H - 12);
    }
  };

  // Schleife läuft NUR während/nach dem Ziehen (Ausschwingen ins Lot); im
  // Ruhezustand steht sie still — so bleibt jede Perle einzeln anklickbar.
  function ensureLoop() {
    if (raf.current !== null) return;
    const tick = () => {
      stepRef.current();
      let bewegt = false;
      for (let k = 1; k <= N; k++) {
        const p = pts.current[k];
        if (p && (Math.abs(p.x - p.ox) > 0.05 || Math.abs(p.y - p.oy) > 0.05)) {
          bewegt = true;
          break;
        }
      }
      force((c) => c + 1);
      if (bewegt || drag.current) {
        raf.current = requestAnimationFrame(tick);
      } else {
        raf.current = null;
      }
    };
    raf.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    return () => {
      if (raf.current !== null) {
        cancelAnimationFrame(raf.current);
        raf.current = null;
      }
    };
  }, []);

  function toSvg(e: React.PointerEvent) {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * P_W, y: ((e.clientY - r.top) / r.height) * P_H };
  }
  function onMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return; // ohne aktiven Zug: keine Bewegung (Perlen bleiben anklickbar)
    if (!d.moved) {
      const dx = e.clientX - d.sx;
      const dy = e.clientY - d.sy;
      if (dx * dx + dy * dy >= 16) d.moved = true;
    }
    if (!d.moved) return;
    const p = pts.current[d.k];
    const s = toSvg(e);
    p.x = clamp(s.x, 40, P_W - 40);
    p.y = clamp(s.y, P_AY, P_H - 12);
    p.ox = p.x;
    p.oy = p.y;
    stepRef.current(); // Nachbarn folgen synchron (auch bei gedrosseltem rAF)
    ensureLoop();
    force((c) => c + 1);
  }
  function onDown(e: React.PointerEvent, k: number) {
    drag.current = { k, moved: false, sx: e.clientX, sy: e.clientY };
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      /* synthetische Events ohne gültige pointerId */
    }
  }
  function onUp() {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved) {
      onRead(reihe[d.k - 1]); // reiner Klick ohne Ziehen → lesen
      return;
    }
    // Loslassen: zurück ins Lot schwingen lassen.
    for (let t = 0; t < 20; t++) stepRef.current();
    force((c) => c + 1);
    ensureLoop();
  }

  const P = pts.current;
  const pfad = P.slice(0, N + 1)
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${P_W} ${P_H}`}
      preserveAspectRatio="xMidYMid meet"
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      className="mx-auto block w-full max-w-[560px] touch-none select-none"
      role="img"
      aria-label="Die KI-Story als hängende Perlenschnur — von früher (oben) nach heute (unten)."
    >
      <text x={P_AX + 12} y={P_AY - 8} fontSize="11" letterSpacing="0.08em" className="fill-on-surface-variant uppercase" opacity="0.7">
        früher
      </text>
      <text x={P_AX + 12} y={P_H - 8} fontSize="11" letterSpacing="0.08em" className="fill-on-surface-variant uppercase" opacity="0.7">
        heute
      </text>
      {/* Faden */}
      <path d={pfad} fill="none" strokeWidth="1.1" className="stroke-outline-variant" />
      {/* Aufhängung */}
      <circle cx={P_AX} cy={P_AY} r="2.5" className="fill-on-surface-variant" opacity="0.7" />
      {/* Perlen */}
      {reihe.map((idx, i) => {
        const p = P[i + 1];
        if (!p) return null;
        const st = stationen[idx];
        const gelesen = gesammelt.includes(idx);
        const farbe = PERLEN_FARBEN[idx % PERLEN_FARBEN.length];
        return (
          <g
            key={idx}
            role="button"
            tabIndex={0}
            aria-label={`${st.titel} (${st.jahr}). Antippen zum Lesen, ziehen zum Schwingen`}
            aria-pressed={gelesen}
            onPointerDown={(e) => onDown(e, i + 1)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onRead(idx);
              }
            }}
            className="group cursor-grab touch-none outline-none active:cursor-grabbing"
          >
            {gelesen && (
              <circle cx={p.x} cy={p.y} r="10" fill="none" strokeWidth="1" stroke={farbe} opacity="0.5" />
            )}
            {/* Perle in ihrer eigenen Farbe — ungelesen als heller Kern mit
                farbigem Rand, gelesen voll gefüllt (nach natalität) */}
            <circle
              cx={p.x}
              cy={p.y}
              r="6.5"
              fill={gelesen ? farbe : "rgb(var(--color-surface-bright))"}
              stroke={gelesen ? "rgb(var(--color-surface-bright))" : farbe}
              strokeWidth={gelesen ? 1.4 : 1.8}
            />
            {/* grössere Trefferfläche */}
            <circle cx={p.x} cy={p.y} r="15" fill="transparent" />
            <text
              x={p.x + 13}
              y={p.y + 4}
              fontSize="12"
              className={
                (gelesen ? "fill-on-surface" : "fill-on-surface-variant") + " pointer-events-none"
              }
            >
              {st.kurz}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════ Haupt-Komponente ═══ */

type SimPunkt = { x: number; y: number; vx: number; vy: number; fx: number | null; fy: number | null };

export default function StoryGewebe({
  stationen,
  einfluesse = [],
  spurKey,
  wunschKey,
  className = "",
  buehneKlasse = "bg-primary-container/20",
}: {
  stationen: StoryStation[];
  einfluesse?: StoryEinfluss[];
  spurKey?: string;
  /** Präfix für die «Mehr dazu wissen»-Merkzeichen (Default: spurKey). */
  wunschKey?: string;
  className?: string;
  buehneKlasse?: string;
}) {
  const n = stationen.length;
  const alle = useMemo(() => stationen.map((_, i) => i), [stationen]);

  // Start: LEER auf dem Server (deterministisch, kein Hydration-Mismatch) —
  // im Browser werden gleich drei Stationen per Zufall gewählt; den Rest
  // holt man sich aktiv selbst dazu. Läuft VOR dem Restore-Effect, damit
  // bereits gelesene Stationen danach per Union wieder dazukommen.
  const [gewaehlt, setGewaehlt] = useState<Set<number>>(() => new Set());
  const [ansicht, setAnsicht] = useState(0);

  useEffect(() => {
    const ids = stationen.map((_, i) => i);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    const start = ids.slice(0, Math.min(3, ids.length));
    setGewaehlt(new Set(start));
    setOffeneKarte(start[start.length - 1] ?? null);
    // Auch automatisch eingeblendete Stationen zählen als Aktivität — ihre
    // Karten stehen ja sichtbar da (Spur → Zähler/Orakel/Rhizom).
    if (spurKey) start.forEach((i) => merkeSpur(`${spurKey}:${i}`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const svgRef = useRef<SVGSVGElement>(null);
  const simRef = useRef<Map<number, SimPunkt>>(new Map());
  const rafRef = useRef<number | null>(null);
  const alphaRef = useRef(0);
  const dragRef = useRef<{ id: number; startX: number; startY: number; moved: boolean } | null>(null);
  const [, force] = useState(0);
  const [live, setLive] = useState(false);

  const ansichtId = ANSICHTEN[ansicht].id;
  const gewaehltSortiert = useMemo(() => alle.filter((i) => gewaehlt.has(i)), [alle, gewaehlt]);
  // Hervorgehoben = geöffnet: jede gewählte Station zeigt ihre Karte unten.
  const gesammelt = gewaehltSortiert;
  /** Welche Detail-Karte ist aufgeklappt (Accordion; null = keine) — immer
   *  der zuletzt ANGEKLICKTE Punkt (nicht der letzte in Stations-Reihenfolge);
   *  gesetzt in aktiviere/punktTippen/toggleWahl/zufall. */
  const [offeneKarte, setOffeneKarte] = useState<number | null>(null);

  /** Das GANZE Gewebe (immer sichtbar): Erzähl-Faden über ALLE Stationen der
   *  Reihe nach + feine Einfluss-Bögen. `aktiv` = beide Enden sind gewählt →
   *  die Kante wird beim Zeichnen leicht eingefärbt. */
  const kanten = useMemo(() => {
    const out: { a: number; b: number; fein: boolean }[] = [];
    for (let i = 1; i < alle.length; i++) out.push({ a: alle[i - 1], b: alle[i], fein: false });
    einfluesse.forEach((e) => out.push({ a: e.von, b: e.zu, fein: true }));
    return out;
  }, [alle, einfluesse]);

  /** Flächen-Topologie (feste Maschen wie beim «Teppich des Wandels»): über
   *  ein deterministisches, flächig füllendes Layout trianguliert — so bleibt
   *  die ZAHL der möglichen Flächen stabil, während die Maschen beim Zeichnen
   *  den aktuellen (gezogenen) Punktpositionen folgen. */
  const storyMaschen = useMemo(() => {
    const cx = 360, cy = 148, rx = 285, ry = 118;
    const coords = Array.from({ length: n }, (_, i) => {
      const r = Math.sqrt((i + 0.5) / Math.max(1, n));
      const ang = i * 2.399963229; // goldener Winkel → gleichmässige Streuung
      return { x: cx + rx * r * Math.cos(ang), y: cy + ry * r * Math.sin(ang) };
    });
    return berechneMaschen(coords);
  }, [n]);

  // Flächen-Bilanz + gewählte Titel ans Orakel melden.
  useEffect(() => {
    if (!spurKey) return;
    const labels = gewaehltSortiert
      .map((i) => stationen[i]?.kurz)
      .filter((s): s is string => Boolean(s));
    melde(spurKey, {
      bereich: "Die KI-Story",
      flaechenGefuellt: zaehleGefuellt(storyMaschen, gewaehlt),
      flaechenTotal: storyMaschen.length,
      labels,
    });
  }, [gewaehlt, gewaehltSortiert, storyMaschen, spurKey, stationen]);

  // Alle Titel registrieren (nicht nur gesammelte) — damit die Sternenkarte
  // im Orakel auch Inhalte konkret benennen kann, die man selbst nie öffnete.
  // Konkreter voller Stationstitel (wie die Karten-Überschrift), nicht das
  // Kurz-Chip: «Der Golem», «Geburt der KI» statt «Golem», «Dartmouth».
  useEffect(() => {
    stationen.forEach((st, i) =>
      merkeInhalt(`${wunschKey ?? spurKey ?? "story"}:${i}`, st.titel),
    );
  }, [stationen, spurKey, wunschKey]);

  function punktVon(i: number): SimPunkt {
    let p = simRef.current.get(i);
    if (!p) {
      const s = startPos(i, n);
      p = { x: s.x, y: s.y, vx: 0, vy: 0, fx: null, fy: null };
      simRef.current.set(i, p);
    }
    return p;
  }

  // Selbst gebrachte Form des Gewebes über Navigation/Neuladen hinweg merken.
  const posKey = spurKey ? `ki26-gewebe:${spurKey}` : null;

  /** Gespeicherte Positionen in simRef laden. true, wenn welche vorlagen. */
  function ladePositionen(): boolean {
    if (!posKey || typeof window === "undefined") return false;
    try {
      const raw = window.localStorage.getItem(posKey);
      if (!raw) return false;
      const o = JSON.parse(raw) as Record<string, { x: number; y: number; fx?: number; fy?: number }>;
      if (!o || typeof o !== "object") return false;
      let vorhanden = false;
      for (const k of Object.keys(o)) {
        const i = Number(k);
        const p = o[k];
        if (Number.isInteger(i) && i >= 0 && i < n && p && typeof p.x === "number" && typeof p.y === "number") {
          simRef.current.set(i, {
            x: p.x,
            y: p.y,
            vx: 0,
            vy: 0,
            fx: typeof p.fx === "number" ? p.fx : null,
            fy: typeof p.fy === "number" ? p.fy : null,
          });
          vorhanden = true;
        }
      }
      return vorhanden;
    } catch {
      return false;
    }
  }

  /** Aktuelle Positionen (inklusive angehefteter) sichern. */
  function speicherePositionen(): void {
    if (!posKey || typeof window === "undefined") return;
    try {
      const o: Record<number, { x: number; y: number; fx: number | null; fy: number | null }> = {};
      alle.forEach((i) => {
        const p = simRef.current.get(i);
        if (p) o[i] = { x: p.x, y: p.y, fx: p.fx, fy: p.fy };
      });
      window.localStorage.setItem(posKey, JSON.stringify(o));
    } catch {
      /* Privatmodus */
    }
  }

  function simSchritt() {
    const alpha = alphaRef.current;
    const pts = alle.map((i) => ({ i, p: punktVon(i) }));
    for (let a = 0; a < pts.length; a++) {
      for (let b = a + 1; b < pts.length; b++) {
        const P = pts[a].p;
        const Q = pts[b].p;
        let dx = Q.x - P.x;
        let dy = Q.y - P.y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 1) {
          dx = (a - b) * 0.7;
          dy = 0.5;
          d2 = 1;
        }
        const f = (2600 * alpha) / d2;
        const d = Math.sqrt(d2);
        const ux = dx / d;
        const uy = dy / d;
        P.vx -= ux * f;
        P.vy -= uy * f;
        Q.vx += ux * f;
        Q.vy += uy * f;
      }
    }
    kanten.forEach((k) => {
      const P = punktVon(k.a);
      const Q = punktVon(k.b);
      const dx = Q.x - P.x;
      const dy = Q.y - P.y;
      const d = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const f = (d - 78) * (k.fein ? 0.006 : 0.018) * alpha * 6;
      const ux = dx / d;
      const uy = dy / d;
      P.vx += ux * f;
      P.vy += uy * f;
      Q.vx -= ux * f;
      Q.vy -= uy * f;
    });
    pts.forEach(({ p }) => {
      p.vx += (360 - p.x) * 0.004 * alpha * 6;
      p.vy += (148 - p.y) * 0.006 * alpha * 6;
      p.vx *= 0.82;
      p.vy *= 0.82;
      if (p.fx !== null) {
        p.x = p.fx;
        p.y = p.fy!;
        p.vx = 0;
        p.vy = 0;
      } else {
        p.x = clamp(p.x + p.vx, RAND.x0, RAND.x1);
        p.y = clamp(p.y + p.vy, RAND.y0, RAND.y1);
      }
    });
  }

  function einschwingen() {
    alphaRef.current = 1;
    for (let t = 0; t < 300; t++) {
      simSchritt();
      alphaRef.current *= 0.985;
    }
    alphaRef.current = 0;
  }

  function loopStart() {
    if (rafRef.current !== null) return;
    setLive(true);
    const step = () => {
      simSchritt();
      if (dragRef.current === null) alphaRef.current *= 0.94;
      force((c) => c + 1);
      if (dragRef.current !== null || alphaRef.current > 0.01) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
        setLive(false);
        speicherePositionen();
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }
  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  useEffect(() => {
    if (ansichtId === "gewebe") {
      // Selbst gebrachte Form aus dem Speicher laden; sonst einmal einschwingen
      // und sichern. Angeheftete (gezogene) Punkte bleiben, wo sie sind. Auswahl
      // ändert nur die Hervorhebung, nicht das Layout.
      if (!ladePositionen()) {
        einschwingen();
        speicherePositionen();
      }
      force((c) => c + 1);
    } else if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setLive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ansichtId]);

  /* ── Gewebe-Zeiger: Ziehen verschiebt, Tippen liest ───────────────────── */

  function toSvg(e: React.PointerEvent) {
    const r = svgRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  }
  function onDown(e: React.PointerEvent, i: number) {
    dragRef.current = { id: i, startX: e.clientX, startY: e.clientY, moved: false };
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {
      /* synthetische Events ohne gültige pointerId */
    }
  }
  function onMove(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    if (!d.moved) {
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      if (dx * dx + dy * dy < 16) return;
      d.moved = true;
      alphaRef.current = Math.max(alphaRef.current, 0.5);
      loopStart();
    }
    const p = punktVon(d.id);
    const s = toSvg(e);
    p.fx = clamp(s.x, RAND.x0, RAND.x1);
    p.fy = clamp(s.y, RAND.y0, RAND.y1);
    p.x = p.fx;
    p.y = p.fy;
    p.vx = 0;
    p.vy = 0;
    alphaRef.current = Math.max(alphaRef.current, 0.4);
    simSchritt();
    simSchritt();
    force((c) => c + 1);
  }
  function onUp() {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    const p = punktVon(d.id);
    if (!d.moved) {
      p.fx = null;
      p.fy = null;
      punktTippen(d.id);
      return;
    }
    // Gezogen: Position ANGEHEFTET lassen (fx/fy bleiben gesetzt), damit die
    // selbst gebrachte Form hält und nicht in die alte zurückschwingt. Nur die
    // übrigen, nicht angehefteten Punkte ordnen sich kurz nach.
    alphaRef.current = Math.max(alphaRef.current, 0.3);
    for (let t = 0; t < 36; t++) {
      simSchritt();
      alphaRef.current *= 0.94;
    }
    force((c) => c + 1);
    loopStart();
    speicherePositionen();
  }

  /* ── Lesen, Auswahl, Zufall, Reset ────────────────────────────────────── */

  function aktiviere(i: number) {
    // Antippen öffnet die Station: hebt sie hervor (fett + eingefärbte Kanten)
    // UND zeigt ihre Karte unten — als zuletzt angeklickte offen.
    if (!gewaehlt.has(i)) {
      setGewaehlt((prev) => new Set(prev).add(i));
      if (spurKey) merkeSpur(`${spurKey}:${i}`);
    }
    setOffeneKarte(i);
  }
  /** Antippen eines Punkts IM GEWEBE togglet: schaltet ihn frei bzw. wieder ab.
   *  Abwählen löscht auch die Spur, damit der Punkt beim Wiederkommen offen
   *  bleibt. */
  function punktTippen(i: number) {
    const drin = gewaehlt.has(i);
    setGewaehlt((prev) => {
      const nx = new Set(prev);
      if (drin) nx.delete(i);
      else nx.add(i);
      return nx;
    });
    setOffeneKarte((o) => (drin ? (o === i ? null : o) : i));
    if (spurKey) {
      if (drin) loescheSpuren(`${spurKey}:${i}`);
      else merkeSpur(`${spurKey}:${i}`);
    }
  }
  function toggleWahl(i: number) {
    const neu = !gewaehlt.has(i);
    setGewaehlt((prev) => {
      const nx = new Set(prev);
      if (nx.has(i)) nx.delete(i);
      else nx.add(i);
      return nx;
    });
    setOffeneKarte((o) => (neu ? i : o === i ? null : o));
    // Auswahl eines Stichworts zählt als Öffnen → Karte + Aktivität; Abwählen
    // löscht die Spur wieder (bleibt dann auch nach Neuladen abgewählt).
    if (spurKey) {
      if (neu) merkeSpur(`${spurKey}:${i}`);
      else loescheSpuren(`${spurKey}:${i}`);
    }
  }
  function zufall(k: number) {
    const ids = alle.slice();
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    const wahl = ids.slice(0, Math.min(k, n));
    setGewaehlt(new Set(wahl));
    setOffeneKarte(wahl[wahl.length - 1] ?? null);
    // Automatisch gezogene Stationen zählen ebenfalls (Karten sind sichtbar).
    if (spurKey) wahl.forEach((i) => merkeSpur(`${spurKey}:${i}`));
  }

  useEffect(() => {
    if (!spurKey) return;
    function restore() {
      const idx = leseSpurenIndices(spurKey!).filter((i) => i >= 0 && i < n);
      if (idx.length === 0) return;
      setGewaehlt((prev) => {
        const nx = new Set(prev);
        idx.forEach((i) => nx.add(i));
        return nx;
      });
    }
    restore();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [spurKey, n]);

  function zuruecksetzen() {
    if (spurKey) loescheSpuren(spurKey);
    if (posKey) {
      try {
        window.localStorage.removeItem(posKey);
      } catch {
        /* Privatmodus */
      }
    }
    simRef.current.clear();
    zufall(3);
    setAnsicht(0);
    einschwingen();
    speicherePositionen();
    force((c) => c + 1);
  }

  const started = gesammelt.length > 0;

  return (
    <section aria-label="Knotenlandschaft: Die KI-Story" className={className}>
      <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
        <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] text-tertiary">
            {gesammelt.length === n ? "done_all" : "touch_app"}
          </span>
          {started
            ? `${gesammelt.length} von ${n} Stationen hervorgehoben`
            : "Stichworte oben antippen, um Stationen hervorzuheben"}
        </p>
        {started && (
          <button
            type="button"
            onClick={zuruecksetzen}
            className="inline-flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            Muster zurücksetzen
          </button>
        )}
      </div>

      {/* Ansicht-Umschalter */}
      <div className="mb-sm">
        <div
          role="group"
          aria-label="Anordnung der Stationen"
          className="inline-flex overflow-hidden rounded-lg border border-outline-variant"
        >
          {ANSICHTEN.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAnsicht(i)}
              aria-pressed={i === ansicht}
              className={
                "px-md py-xs text-label-md transition-colors " +
                (i === ansicht
                  ? "bg-tertiary-container text-on-tertiary-container"
                  : "bg-surface-bright text-on-surface-variant hover:bg-surface-container hover:text-on-surface") +
                (i > 0 ? " border-l border-outline-variant" : "")
              }
            >
              {a.label}
            </button>
          ))}
        </div>
        <p className="mt-xs text-label-md text-on-surface-variant">{ANSICHTEN[ansicht].hinweis}</p>
      </div>

      {/* Knotenauswahl — flache Liste aller Stationen */}
      <div className="mb-sm rounded-xl border border-outline-variant bg-surface-container-low/60 p-md">
        <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
          <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
            <span className="material-symbols-outlined text-[16px]">filter_alt</span>
            Drei Stationen sind per Zufall gesetzt — hol dir die übrigen dazu
          </p>
          <div className="flex gap-xs">
            <button
              type="button"
              onClick={() => zufall(3)}
              className="inline-flex items-center gap-xs rounded-full border border-outline-variant px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:border-tertiary hover:text-tertiary"
            >
              <span className="material-symbols-outlined text-[16px]">casino</span>
              Zufall (3)
            </button>
            <button
              type="button"
              onClick={() => setGewaehlt(new Set(alle))}
              className="inline-flex items-center gap-xs rounded-full border border-outline-variant px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:border-tertiary hover:text-tertiary"
            >
              <span className="material-symbols-outlined text-[16px]">select_all</span>
              Alle
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-xs">
          {alle.map((i) => {
            const on = gewaehlt.has(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggleWahl(i)}
                aria-pressed={on}
                className={
                  "rounded-full border px-sm py-xs text-label-md transition-colors " +
                  (on
                    ? "border-tertiary bg-tertiary-container text-on-tertiary-container"
                    : "border-outline-variant bg-surface-bright text-on-surface-variant hover:bg-surface-container hover:text-on-surface")
                }
              >
                {stationen[i].kurz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Die Box */}
      <div
        className={
          "overflow-hidden rounded-xl border border-outline-variant p-sm sm:p-md " + buehneKlasse
        }
      >
        {ansichtId === "gewebe" ? (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
            className="block w-full select-none aspect-[720/400] sm:aspect-[720/300]"
            role="img"
            aria-label="Teil-Gewebe der gewählten KI-Stationen. Punkte lassen sich ziehen und antippen, und zwischen hervorgehobenen Punkten entstehen gefüllte Flächen."
          >
            {/* Gefüllte Flächen (Maschen): erscheinen, sobald alle drei Ecken
                hervorgehoben sind — leuchtend wie die Perlen der Story */}
            {storyMaschen.map((t, i) => {
              if (!t.every((v) => gewaehlt.has(v))) return null;
              const farbe = PERLEN_FARBEN[i % PERLEN_FARBEN.length];
              const pts = t
                .map((v) => {
                  const p = punktVon(v);
                  return `${p.x},${p.y}`;
                })
                .join(" ");
              return (
                <polygon
                  key={`m${i}`}
                  points={pts}
                  fill={farbe}
                  fillOpacity={0.16}
                  stroke={farbe}
                  strokeOpacity={0.32}
                  strokeWidth={0.6}
                  className="transition-opacity duration-500"
                />
              );
            })}
            {kanten.map((k, i) => {
              const a = punktVon(k.a);
              const b = punktVon(k.b);
              // aktiv = beide Enden gewählt → Verbindung leicht einfärben,
              // sonst blass im Hintergrund (das ganze Gewebe bleibt sichtbar).
              const aktiv = gewaehlt.has(k.a) && gewaehlt.has(k.b);
              if (k.fein) {
                const mx = (a.x + b.x) / 2;
                const my = (a.y + b.y) / 2 - Math.min(60, Math.abs(b.x - a.x) * 0.25 + 14);
                return (
                  <path
                    key={`k${i}`}
                    d={`M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`}
                    fill="none"
                    strokeWidth={aktiv ? 1.1 : 0.7}
                    strokeDasharray="3 4"
                    className="stroke-tertiary transition-opacity duration-300"
                    opacity={aktiv ? 0.55 : 0.12}
                  />
                );
              }
              return (
                <line
                  key={`k${i}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  strokeWidth={aktiv ? 1.6 : 1}
                  className={
                    (aktiv ? "stroke-tertiary" : "stroke-outline-variant") +
                    " transition-opacity duration-300"
                  }
                  opacity={aktiv ? 0.5 : 0.18}
                />
              );
            })}
            {alle.map((i) => {
              const p = punktVon(i);
              const st = stationen[i];
              const gelesen = gesammelt.includes(i);
              const gewaehltJa = gewaehlt.has(i);
              const hervor = gelesen || gewaehltJa; // fett markiert
              const name = st.kurz;
              const halb = (name.length * 5.7) / 2;
              const labelX = clamp(p.x, halb + 6, W - halb - 6) - p.x;
              const r = gelesen ? 6 : gewaehltJa ? 5.5 : 3.4;
              return (
                <g
                  key={i}
                  role="button"
                  tabIndex={0}
                  aria-label={`${st.titel} (${st.jahr}). Antippen zum Öffnen/Schliessen, ziehen zum Verschieben`}
                  aria-pressed={gelesen}
                  onPointerDown={(e) => onDown(e, i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      punktTippen(i);
                    }
                  }}
                  style={{
                    transform: `translate(${p.x}px, ${p.y}px)`,
                    transition: live ? "none" : "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  className="group cursor-grab touch-none outline-none active:cursor-grabbing"
                >
                  <circle cx="0" cy="0" r="18" fill="transparent" />
                  {gelesen && (
                    <circle cx="0" cy="0" r="9" fill="none" strokeWidth="1" className="stroke-tertiary" opacity="0.45" />
                  )}
                  <circle
                    cx="0"
                    cy="0"
                    r={r}
                    className={
                      (hervor ? "fill-tertiary" : "fill-outline") +
                      " origin-center [transform-box:fill-box] transition-all duration-300 group-hover:scale-125 group-focus-visible:scale-125"
                    }
                    opacity={gelesen ? 1 : gewaehltJa ? 0.9 : 0.4}
                  />
                  {hervor ? (
                    <text
                      x={labelX}
                      y="22"
                      textAnchor="middle"
                      fontSize="11"
                      className="fill-on-surface font-semibold pointer-events-none"
                    >
                      {name}
                    </text>
                  ) : (
                    <text
                      x={labelX}
                      y="22"
                      textAnchor="middle"
                      fontSize="11"
                      className="fill-on-surface-variant pointer-events-none opacity-0 group-hover:opacity-70 group-focus-visible:opacity-70"
                    >
                      {name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        ) : (
          <StoryPerlschnur
            stationen={stationen}
            reihe={gewaehltSortiert}
            gesammelt={gesammelt}
            onRead={aktiviere}
          />
        )}
      </div>
      <p className="mt-xs text-label-sm text-on-surface-variant">
        {ansichtId === "gewebe"
          ? "Das ganze Gewebe ist sichtbar · Stichworte oben heben Punkte hervor · Punkt antippen liest die Geschichte · ziehen verschiebt"
          : "Zeiger durchs Muster bewegen lässt die Kette schwingen · Perle antippen für die Geschichte"}
      </p>

      {/* Gelesene Stationen — bleiben stehen, in Lese-Reihenfolge */}
      <div aria-live="polite" className="mt-md">
        {gesammelt.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-lg">
            <p className="flex items-start gap-sm text-body-md text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px] text-tertiary">explore</span>
              So geht es: Das ganze Gewebe ist sichtbar — drei Punkte sind
              schon hervorgehoben. Über die Stichworte oben hebst du weitere
              Punkte fett hervor, und ihre Verbindungen färben sich ein. Tippe
              einen Punkt an — seine Geschichte erscheint hier und bleibt
              stehen. Im Gewebe lassen sich die Punkte auch ziehen; «Zeitlich»
              reiht die hervorgehobenen Stationen als Perlenschnur von früher
              nach heute.
            </p>
          </div>
        ) : (
          <ol className="flex flex-col gap-sm">
            {gesammelt.map((idx, pos) => {
              const st = stationen[idx];
              const neuste = pos === gesammelt.length - 1;
              return (
                <SammelAccordion
                  key={idx}
                  nr={pos + 1}
                  titel={st.titel}
                  jahr={st.jahr}
                  neuste={neuste}
                  offen={offeneKarte === idx}
                  onToggle={() => setOffeneKarte((o) => (o === idx ? null : idx))}
                >
                  <p className="text-body-md text-on-surface">{st.text}</p>
                  {st.geschichte && (
                    <p className="mt-sm text-body-md text-on-surface-variant">{st.geschichte}</p>
                  )}
                  <KartenAktion
                    mehr={st.mehr}
                    wunschId={`wunsch:${wunschKey ?? spurKey ?? "story"}:${idx}`}
                    titel={st.titel}
                  />
                </SammelAccordion>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
