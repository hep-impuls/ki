"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  leseSpurenIndices,
  loescheSpuren,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";

/**
 * StoryGewebe — die KI-Story als flexibles Teil-Gewebe (Vorbild: das
 * «Gewebe» von natalitaet.com).
 *
 * Oben wählt man in einer Knotenauswahl (nach Themen gruppierte Chips),
 * WELCHE Stationen erscheinen; «Zufall (3)» zieht drei zufällig. Die
 * gewählten Punkte verknüpfen und kombinieren sich je nach Wahl neu:
 * chronologisch aufeinanderfolgende Stationen hängen am Erzähl-Faden,
 * feine gestrichelte Bögen zeigen Einflüsse quer durch die Zeit.
 *
 * Drei Ansichten:
 *  - «Gewebe» (Standard): freies, federndes Netz — eine Box, in der man
 *    die Punkte selbst VERSCHIEBEN kann (Drag); die Verbindungen bleiben
 *    fix, das Netz schwingt mit. Eigene Mini-Simulation (Abstossung,
 *    Federn, Zentrierung) statt d3-force — package.json ist geteilt,
 *    keine neue Abhängigkeit.
 *  - «Zeitlich»: chronologisch angeordnet — nur die gewählten Punkte.
 *  - «Mensch · Maschine · Fiktion»: drei Stränge.
 *
 * Ein Klick (ohne Ziehen) aktiviert einen Punkt: seine Karte blendet unten
 * ein und bleibt stehen — mit Bild (falls vorhanden) und der längeren
 * Geschichte. Bilder erscheinen also erst bei Aktivierung; Punkte mit Bild
 * tragen im Muster ein kleines Bild-Symbol. Aktivierte Stationen werden
 * dreifach registriert (_lib/spuren.ts) und bleiben geräteübergreifend
 * offen. Nur Theme-Tokens; SSR rendert deterministische Startpositionen
 * (Kreis), die Simulation rechnet erst im Effect.
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
  /** Themen-Gruppe der Auswahl. */
  kat: StoryKat;
  /** Strang in der Ansicht «Mensch · Maschine · Fiktion». */
  mmf: StoryMMF;
  bild?: { src: string; alt: string; credit: string };
}

/** Einfluss quer durch die Zeit (Index → Index), als feiner gestrichelter
 *  Bogen gezeichnet, wenn beide Enden gewählt sind. */
export interface StoryEinfluss {
  von: number;
  zu: number;
}

const W = 720;
const H = 300;
/** Bewegungsraum der Punkte (Labels brauchen unten Platz). */
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
    hinweis: "Chronologisch — nur die gewählten Stationen, von früher nach heute.",
  },
  {
    id: "mmf",
    label: "Mensch · Maschine · Fiktion",
    hinweis: "Drei Stränge: erzählte Wesen, menschliche Erwartungen, gebaute Maschinen.",
  },
] as const;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/** Deterministische Startposition (Kreis um die Boxmitte) — auch das
 *  SSR-Markup nutzt sie; die Simulation übernimmt erst im Browser. */
function startPos(i: number, n: number) {
  const wink = (i / Math.max(1, n)) * 2 * Math.PI - Math.PI / 2;
  return { x: 360 + 150 * Math.cos(wink), y: 148 + 88 * Math.sin(wink) };
}

/** Zielpositionen der geordneten Ansichten (zeit / mmf) — rein rechnerisch
 *  aus der aktuellen Auswahl. */
function zielPositionen(
  ansichtId: string,
  gewaehltSortiert: number[],
  stationen: StoryStation[],
): { pos: Map<number, { x: number; y: number }>; labels: { x: number; y: number; text: string }[] } {
  const pos = new Map<number, { x: number; y: number }>();
  const labels: { x: number; y: number; text: string }[] = [];
  const m = gewaehltSortiert.length;
  if (m === 0) return { pos, labels };

  if (ansichtId === "zeit") {
    if (m <= 6) {
      gewaehltSortiert.forEach((id, j) => {
        const x = m === 1 ? 360 : lerp(70, 660, j / (m - 1));
        pos.set(id, { x, y: 150 + (j % 2 === 0 ? -18 : 18) });
      });
    } else {
      const top = Math.ceil(m / 2);
      const bot = m - top;
      gewaehltSortiert.forEach((id, j) => {
        if (j < top) {
          pos.set(id, { x: top === 1 ? 360 : lerp(70, 660, j / (top - 1)), y: 108 });
        } else {
          const k = j - top;
          pos.set(id, {
            x: bot === 1 ? 360 : lerp(70, 660, (bot - 1 - k) / (bot - 1)),
            y: 214,
          });
        }
      });
    }
    labels.push({ x: 12, y: 22, text: "Früher  →  heute" });
    return { pos, labels };
  }

  // «Mensch · Maschine · Fiktion»
  const gruppen = (
    [
      ["fiktion", "Fiktion"],
      ["mensch", "Mensch"],
      ["maschine", "Maschine"],
    ] as const
  ).map(([key, text]) => ({
    text,
    indices: gewaehltSortiert.filter((i) => stationen[i].mmf === key),
  }));
  gruppen.forEach((g, s) => {
    const y = lerp(60, 244, s / (gruppen.length - 1));
    g.indices.forEach((id, j) => {
      const x = g.indices.length === 1 ? 170 : lerp(170, 660, j / (g.indices.length - 1));
      pos.set(id, { x, y });
    });
    labels.push({ x: 12, y: y + 4, text: g.text });
  });
  return { pos, labels };
}

/** Kleines «Bild vorhanden»-Symbol auf einem Knoten (nach natalität). */
function BildSymbol() {
  return (
    <g
      className="stroke-surface-bright"
      fill="none"
      strokeWidth={0.9}
      strokeLinejoin="round"
      strokeLinecap="round"
      style={{ pointerEvents: "none" }}
    >
      <rect x={-3.2} y={-2.5} width={6.4} height={5} rx={1.1} />
      <circle cx={-1.3} cy={-0.9} r={0.7} className="fill-surface-bright" stroke="none" />
      <path d={`M -2.7 1.9 L -0.9 -0.1 L 0.4 1 L 1.6 -0.1 L 2.7 1.6`} />
    </g>
  );
}

type SimPunkt = { x: number; y: number; vx: number; vy: number; fx: number | null; fy: number | null };

export default function StoryGewebe({
  stationen,
  einfluesse = [],
  spurKey,
  className = "",
  buehneKlasse = "bg-primary-container/20",
}: {
  stationen: StoryStation[];
  einfluesse?: StoryEinfluss[];
  /** Spur-Präfix für aktivierte Stationen (z.B. "vorhang-auf:story"). */
  spurKey?: string;
  className?: string;
  /** Hintergrund-Tönung der Muster-Bühne (Theme-Token-Klasse). */
  buehneKlasse?: string;
}) {
  const n = stationen.length;
  const alle = useMemo(() => stationen.map((_, i) => i), [stationen]);

  const [gewaehlt, setGewaehlt] = useState<Set<number>>(() => new Set(alle));
  const [ansicht, setAnsicht] = useState(0);
  const [gesammelt, setGesammelt] = useState<number[]>([]);

  const svgRef = useRef<SVGSVGElement>(null);
  /** Simulation/Positionen — eine Quelle für alle Ansichten. */
  const simRef = useRef<Map<number, SimPunkt>>(new Map());
  const rafRef = useRef<number | null>(null);
  const alphaRef = useRef(0);
  const dragRef = useRef<{ id: number; startX: number; startY: number; moved: boolean } | null>(null);
  const [, force] = useState(0);
  /** Während Drag/Nachschwingen keine CSS-Transition (sonst schwammig). */
  const [live, setLive] = useState(false);

  const ansichtId = ANSICHTEN[ansicht].id;
  const gewaehltSortiert = useMemo(() => alle.filter((i) => gewaehlt.has(i)), [alle, gewaehlt]);

  const ziel = useMemo(
    () => zielPositionen(ansichtId, gewaehltSortiert, stationen),
    [ansichtId, gewaehltSortiert, stationen],
  );

  /** Kanten: Erzähl-Faden (chronologisch aufeinanderfolgende gewählte) +
   *  Einfluss-Bögen — in der MMF-Ansicht Strang-Fäden statt Erzähl-Faden. */
  const kanten = useMemo(() => {
    const out: { a: number; b: number; fein: boolean }[] = [];
    if (ansichtId === "mmf") {
      (["fiktion", "mensch", "maschine"] as const).forEach((key) => {
        const strang = gewaehltSortiert.filter((i) => stationen[i].mmf === key);
        for (let i = 1; i < strang.length; i++)
          out.push({ a: strang[i - 1], b: strang[i], fein: false });
      });
    } else {
      for (let i = 1; i < gewaehltSortiert.length; i++)
        out.push({ a: gewaehltSortiert[i - 1], b: gewaehltSortiert[i], fein: false });
    }
    einfluesse.forEach((e) => {
      if (gewaehlt.has(e.von) && gewaehlt.has(e.zu)) out.push({ a: e.von, b: e.zu, fein: true });
    });
    return out;
  }, [ansichtId, gewaehltSortiert, gewaehlt, einfluesse, stationen]);

  function punktVon(i: number): SimPunkt {
    let p = simRef.current.get(i);
    if (!p) {
      const s = startPos(i, n);
      p = { x: s.x, y: s.y, vx: 0, vy: 0, fx: null, fy: null };
      simRef.current.set(i, p);
    }
    return p;
  }

  /** Ein Simulationsschritt (nur «Gewebe»): Abstossung, Federn entlang der
   *  Kanten, sanfte Zentrierung, Boxgrenzen. */
  function simSchritt() {
    const alpha = alphaRef.current;
    const pts = gewaehltSortiert.map((i) => ({ i, p: punktVon(i) }));
    // Abstossung (n ist klein — O(n²) ist unkritisch)
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
        const f = (5200 * alpha) / d2;
        const d = Math.sqrt(d2);
        const ux = dx / d;
        const uy = dy / d;
        P.vx -= ux * f;
        P.vy -= uy * f;
        Q.vx += ux * f;
        Q.vy += uy * f;
      }
    }
    // Federn entlang der Kanten (Ziel-Länge 120; Einflüsse weicher)
    kanten.forEach((k) => {
      const P = punktVon(k.a);
      const Q = punktVon(k.b);
      const dx = Q.x - P.x;
      const dy = Q.y - P.y;
      const d = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      const f = (d - 120) * (k.fein ? 0.008 : 0.02) * alpha * 6;
      const ux = dx / d;
      const uy = dy / d;
      P.vx += ux * f;
      P.vy += uy * f;
      Q.vx -= ux * f;
      Q.vy -= uy * f;
    });
    // Zentrierung + Integration
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

  /** Gewebe synchron einschwingen lassen (wie natalitäts sim.tick(320)). */
  function einschwingen() {
    alphaRef.current = 1;
    for (let t = 0; t < 300; t++) {
      simSchritt();
      alphaRef.current *= 0.985;
    }
    alphaRef.current = 0;
  }

  /** rAF-Loop während Drag/Nachschwingen. */
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

  // Ansicht/Auswahl anwenden: Gewebe → einschwingen; zeit/mmf → Zielplätze.
  const auswahlKey = gewaehltSortiert.join(",");
  useEffect(() => {
    if (ansichtId === "gewebe") {
      gewaehltSortiert.forEach((i) => {
        punktVon(i).fx = null;
        punktVon(i).fy = null;
      });
      einschwingen();
    } else {
      gewaehltSortiert.forEach((i) => {
        const z = ziel.pos.get(i);
        const p = punktVon(i);
        if (z) {
          p.x = z.x;
          p.y = z.y;
          p.vx = 0;
          p.vy = 0;
          p.fx = null;
          p.fy = null;
        }
      });
    }
    force((c) => c + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ansichtId, auswahlKey]);

  /* ── Zeigerlogik: Ziehen verschiebt, Tippen liest ─────────────────────── */

  function toSvg(e: React.PointerEvent) {
    const r = svgRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) / r.width) * W,
      y: ((e.clientY - r.top) / r.height) * H,
    };
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
    // Der gezogene Punkt folgt dem Zeiger DIREKT (nicht erst im nächsten
    // Simulationsschritt — sonst hinkt er, und ein schnelles Ziehen+Loslassen
    // verpuffte ganz); die Simulation federt nur die Nachbarn nach.
    p.fx = clamp(s.x, RAND.x0, RAND.x1);
    p.fy = clamp(s.y, RAND.y0, RAND.y1);
    p.x = p.fx;
    p.y = p.fy;
    p.vx = 0;
    p.vy = 0;
    if (ansichtId === "gewebe") {
      // Nachbarn synchron nachfedern lassen — unabhängig davon, ob
      // requestAnimationFrame gerade läuft (Hintergrund-Tabs drosseln es).
      alphaRef.current = Math.max(alphaRef.current, 0.4);
      simSchritt();
      simSchritt();
    }
    force((c) => c + 1);
  }
  function onUp(e: React.PointerEvent) {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    const p = punktVon(d.id);
    if (!d.moved) {
      p.fx = null;
      p.fy = null;
      aktiviere(d.id);
      return;
    }
    if (ansichtId === "gewebe") {
      // loslassen: das Netz federt nach — der Punkt bleibt ungefähr liegen.
      // Synchron ausfedern (falls requestAnimationFrame gedrosselt ist),
      // der Loop macht es nur noch flüssig.
      p.fx = null;
      p.fy = null;
      alphaRef.current = Math.max(alphaRef.current, 0.3);
      for (let t = 0; t < 36; t++) {
        simSchritt();
        alphaRef.current *= 0.94;
      }
      force((c) => c + 1);
      loopStart();
    } else {
      // geordnete Ansichten: liegt, wo abgelegt (bis zur nächsten Anordnung)
      p.fx = null;
      p.fy = null;
      setLive(false);
    }
    void e;
  }

  /* ── Lesen, Auswahl, Zufall, Reset ────────────────────────────────────── */

  function aktiviere(i: number) {
    if (!gesammelt.includes(i)) {
      setGesammelt((g) => [...g, i]);
      if (spurKey) merkeSpur(`${spurKey}:${i}`);
    }
  }

  function toggleWahl(i: number) {
    setGewaehlt((prev) => {
      const nx = new Set(prev);
      if (nx.has(i)) nx.delete(i);
      else nx.add(i);
      return nx;
    });
  }

  function zufall(k: number) {
    const ids = alle.slice();
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    setGewaehlt(new Set(ids.slice(0, Math.min(k, n))));
  }

  useEffect(() => {
    if (!spurKey) return;
    function restore() {
      const idx = leseSpurenIndices(spurKey!).filter((i) => i >= 0 && i < n);
      if (idx.length === 0) return;
      setGesammelt((g) => {
        const fehlend = idx.filter((i) => !g.includes(i));
        return fehlend.length ? [...g, ...fehlend] : g;
      });
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
    setGesammelt([]);
    setGewaehlt(new Set(alle));
    setAnsicht(0);
    simRef.current.clear();
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
            ? `${gesammelt.length} von ${n} Stationen gelesen`
            : "Stationen wählen, ziehen — und antippen zum Lesen"}
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
          aria-label="Anordnung der Punkte"
          className="inline-flex flex-wrap overflow-hidden rounded-lg border border-outline-variant"
        >
          {ANSICHTEN.map((a, i) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAnsicht(i)}
              aria-pressed={i === ansicht}
              className={
                "px-sm py-xs text-label-md transition-colors " +
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
        <p className="mt-xs text-label-md text-on-surface-variant">
          {ANSICHTEN[ansicht].hinweis}
        </p>
      </div>

      {/* Knotenauswahl — welche Stationen im Gewebe hängen */}
      <div className="mb-sm rounded-xl border border-outline-variant bg-surface-container-low/60 p-md">
        <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
          <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
            <span className="material-symbols-outlined text-[16px]">filter_alt</span>
            Wähle Stationen — sie verknüpfen sich neu
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

      {/* Die Box: das Gewebe */}
      <div
        className={
          "overflow-hidden rounded-xl border border-outline-variant p-sm sm:p-md " +
          buehneKlasse
        }
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          className="block w-full select-none aspect-[720/400] sm:aspect-[720/300]"
          role="img"
          aria-label="Teil-Gewebe der gewählten KI-Stationen — Punkte lassen sich ziehen und antippen."
        >
          {/* Strang-/Zeit-Beschriftungen der geordneten Ansichten */}
          {ansichtId !== "gewebe" &&
            ziel.labels.map((l, i) => (
              <text
                key={`l${ansichtId}-${i}`}
                x={l.x}
                y={l.y}
                fontSize="11"
                letterSpacing="0.06em"
                className="fill-on-surface-variant uppercase"
                opacity="0.75"
              >
                {l.text}
              </text>
            ))}

          {/* Verbindungen — fix; nur ihre Enden bewegen sich */}
          {kanten.map((k, i) => {
            const a = punktVon(k.a);
            const b = punktVon(k.b);
            if (k.fein) {
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2 - Math.min(60, Math.abs(b.x - a.x) * 0.25 + 14);
              return (
                <path
                  key={`k${i}`}
                  d={`M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`}
                  fill="none"
                  strokeWidth="0.9"
                  strokeDasharray="3 4"
                  className="stroke-tertiary"
                  opacity="0.5"
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
                strokeWidth="1.25"
                className="stroke-outline-variant"
              />
            );
          })}

          {/* Punkte — ziehen verschiebt, tippen liest */}
          {gewaehltSortiert.map((i) => {
            const p = punktVon(i);
            const st = stationen[i];
            const gelesen = gesammelt.includes(i);
            const name = st.kurz;
            const halb = (name.length * 5.7) / 2;
            const labelX = clamp(p.x, halb + 6, W - halb - 6) - p.x;
            return (
              <g
                key={i}
                role="button"
                tabIndex={0}
                aria-label={`${st.titel} (${st.jahr}) — antippen zum Lesen, ziehen zum Verschieben`}
                aria-pressed={gelesen}
                onPointerDown={(e) => onDown(e, i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    aktiviere(i);
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
                  <circle
                    cx="0"
                    cy="0"
                    r="9"
                    fill="none"
                    strokeWidth="1"
                    className="stroke-tertiary"
                    opacity="0.45"
                  />
                )}
                <circle
                  cx="0"
                  cy="0"
                  r="5.5"
                  className={
                    (gelesen ? "fill-tertiary" : "fill-outline") +
                    " origin-center [transform-box:fill-box] transition-transform duration-300 group-hover:scale-125 group-focus-visible:scale-125"
                  }
                  opacity={gelesen ? 1 : 0.7}
                />
                {st.bild && <BildSymbol />}
                <text
                  x={labelX}
                  y="22"
                  textAnchor="middle"
                  fontSize="11"
                  className={
                    (gelesen ? "fill-on-surface" : "fill-on-surface-variant") +
                    " pointer-events-none"
                  }
                >
                  {name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mt-xs text-label-sm text-on-surface-variant">
        Punkte ziehen · antippen für die Geschichte
      </p>

      {/* Gelesene Stationen — bleiben stehen, in Lese-Reihenfolge */}
      <div aria-live="polite" className="mt-md">
        {gesammelt.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-lg">
            <p className="flex items-start gap-sm text-body-md text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px] text-tertiary">
                explore
              </span>
              Wähle oben Stationen und tippe einen Punkt an — seine Karte
              (Geschichte, teils mit Bild) blendet hier ein und bleibt stehen.
              Im Gewebe kannst du die Punkte auch selbst verschieben.
            </p>
          </div>
        ) : (
          <ol className="flex flex-col gap-sm">
            {gesammelt.map((idx, pos) => {
              const st = stationen[idx];
              const neuste = pos === gesammelt.length - 1;
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
                    {st.bild && (
                      <div className="hidden flex-shrink-0 rounded-lg border border-outline-variant bg-surface-bright p-xs sm:block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={st.bild.src}
                          alt={st.bild.alt}
                          loading="lazy"
                          className="block w-28 rounded-md object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-body-lg font-medium text-on-surface">
                        {st.titel}
                        <span className="ml-sm text-label-md font-normal text-tertiary">
                          {st.jahr}
                        </span>
                      </p>
                      <p className="mt-xs text-body-md text-on-surface">{st.text}</p>
                      {st.geschichte && (
                        <p className="mt-sm text-body-md text-on-surface-variant">
                          {st.geschichte}
                        </p>
                      )}
                      {st.bild && (
                        <p className="mt-sm text-label-sm text-on-surface-variant opacity-70">
                          {st.bild.credit}
                        </p>
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
