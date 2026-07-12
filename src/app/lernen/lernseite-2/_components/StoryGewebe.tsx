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
 * StoryGewebe — die KI-Story als wählbares Teil-Gewebe (Vorbild: das «Gewebe»
 * von natalitaet.com).
 *
 * Ablauf: Oben wählt man in einer Knotenauswahl, WELCHE Stationen im Muster
 * erscheinen (nach Themen gruppiert). Der Struktur-Umschalter bestimmt, WIE
 * die gewählten Stationen angeordnet werden:
 *   - «Zeitlich»    → chronologisch (nur die gewählten Punkte), als Serpentine;
 *   - «Mensch · Maschine · Fiktion» → drei Stränge;
 *   - «Technologisch» → vier Stränge (Erzählung, Mechanik, Regeln, Daten).
 * Feine Bögen zeigen Einflüsse, die quer durch die Zeit wirken.
 *
 * Ein Klick auf einen Punkt «aktiviert» ihn: seine Karte (zwei Sätze, ggf.
 * mit Bild) blendet unten ein und bleibt stehen. Die Bilder erscheinen also
 * erst bei Aktivierung. Aktivierte Stationen werden wie überall dreifach
 * registriert (_lib/spuren.ts) und bleiben geräteübergreifend offen.
 *
 * Nur Theme-Tokens, deterministische Koordinaten (Positionen im Effect wären
 * nicht nötig — sie werden rein rechnerisch aus Auswahl × Struktur bestimmt).
 */

export type StoryKat = "erzaehlung" | "mechanik" | "regeln" | "daten";
export type StoryMMF = "fiktion" | "mensch" | "maschine";

export interface StoryStation {
  titel: string;
  /** Kurzform fürs Muster + die Auswahl-Chips. */
  kurz: string;
  jahr: string;
  /** Inhalt der Karte — maximal zwei Sätze. */
  text: string;
  /** Themen-Gruppe (Auswahl + technologischer Strang). */
  kat: StoryKat;
  /** Strang in der Anordnung «Mensch · Maschine · Fiktion». */
  mmf: StoryMMF;
  bild?: { src: string; alt: string; credit: string };
}

/** Einfluss quer durch die Zeit (Index → Index), als feiner Bogen gezeichnet,
 *  wenn beide Enden gewählt sind. */
export interface StoryEinfluss {
  von: number;
  zu: number;
}

const W = 720;
const H = 300;

const KAT_LABEL: Record<StoryKat, string> = {
  erzaehlung: "Mythos & Fiktion",
  mechanik: "Mechanik & Rechnen",
  regeln: "KI & ihre Regeln",
  daten: "Lernen aus Daten",
};
const KAT_ORDER: StoryKat[] = ["erzaehlung", "mechanik", "regeln", "daten"];

const STRUKTUREN: {
  id: string;
  label: string;
  hinweis: string;
}[] = [
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
  {
    id: "tech",
    label: "Technologisch",
    hinweis: "Vier Stränge: Erzählung, Mechanik, Regeln & Symbole, Daten & Lernen.",
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type Pos = Map<number, { x: number; y: number }>;
type Layout = {
  pos: Pos;
  /** Strang-Beschriftungen (links im Muster). */
  labels: { x: number; y: number; text: string }[];
  /** Sequenz-Fäden: geordnete Indexketten je Strang. */
  ketten: number[][];
};

/** Positionen rein rechnerisch aus (Struktur × Auswahl). Nur gewählte
 *  Stationen, chronologisch geordnet. */
function baueLayout(
  strukturId: string,
  gewaehltSortiert: number[],
  stationen: StoryStation[],
): Layout {
  const pos: Pos = new Map();
  const m = gewaehltSortiert.length;
  if (m === 0) return { pos, labels: [], ketten: [] };

  if (strukturId === "zeit") {
    if (m <= 6) {
      gewaehltSortiert.forEach((id, j) => {
        const x = m === 1 ? 365 : lerp(70, 660, j / (m - 1));
        const y = 150 + (j % 2 === 0 ? -18 : 18);
        pos.set(id, { x, y });
      });
    } else {
      // Serpentine: obere Reihe links→rechts, untere rechts→links.
      const top = Math.ceil(m / 2);
      const bot = m - top;
      gewaehltSortiert.forEach((id, j) => {
        if (j < top) {
          const x = top === 1 ? 365 : lerp(70, 660, j / (top - 1));
          pos.set(id, { x, y: 108 });
        } else {
          const k = j - top;
          const x = bot === 1 ? 365 : lerp(70, 660, (bot - 1 - k) / (bot - 1));
          pos.set(id, { x, y: 210 });
        }
      });
    }
    return {
      pos,
      labels: [{ x: 12, y: 22, text: "Früher  →  heute" }],
      ketten: [gewaehltSortiert],
    };
  }

  // Mehr-Strang-Anordnungen (mmf / tech)
  const gruppen: { text: string; indices: number[] }[] =
    strukturId === "mmf"
      ? (
          [
            ["fiktion", "Fiktion"],
            ["mensch", "Mensch"],
            ["maschine", "Maschine"],
          ] as const
        ).map(([key, text]) => ({
          text,
          indices: gewaehltSortiert.filter((i) => stationen[i].mmf === key),
        }))
      : KAT_ORDER.map((key) => ({
          text:
            key === "erzaehlung"
              ? "Erzählung"
              : key === "mechanik"
                ? "Mechanik"
                : key === "regeln"
                  ? "Regeln"
                  : "Daten",
          indices: gewaehltSortiert.filter((i) => stationen[i].kat === key),
        }));

  const ns = gruppen.length;
  const labels: Layout["labels"] = [];
  gruppen.forEach((g, s) => {
    const y = ns === 1 ? H / 2 : lerp(56, 244, s / (ns - 1));
    const mm = g.indices.length;
    g.indices.forEach((id, j) => {
      const x = mm === 1 ? 150 : lerp(150, 660, j / (mm - 1));
      pos.set(id, { x, y });
    });
    labels.push({ x: 12, y: y + 4, text: g.text });
  });

  return { pos, labels, ketten: gruppen.map((g) => g.indices) };
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

  // Auswahl (welche Knoten erscheinen) — Start: alle. Getrennt von der
  // Aktivierung (welche Karten gelesen sind).
  const [gewaehlt, setGewaehlt] = useState<Set<number>>(() => new Set(alle));
  const [struktur, setStruktur] = useState(0);
  const [gesammelt, setGesammelt] = useState<number[]>([]);
  const [aktiv, setAktiv] = useState<number | null>(null);

  const strukturId = STRUKTUREN[struktur].id;
  const gewaehltSortiert = useMemo(
    () => alle.filter((i) => gewaehlt.has(i)),
    [alle, gewaehlt],
  );

  const layout = useMemo(
    () => baueLayout(strukturId, gewaehltSortiert, stationen),
    [strukturId, gewaehltSortiert, stationen],
  );

  const kanten = useMemo(() => {
    const out: { a: number; b: number; fein: boolean }[] = [];
    layout.ketten.forEach((k) => {
      for (let i = 1; i < k.length; i++) out.push({ a: k[i - 1], b: k[i], fein: false });
    });
    einfluesse.forEach((e) => {
      if (gewaehlt.has(e.von) && gewaehlt.has(e.zu))
        out.push({ a: e.von, b: e.zu, fein: true });
    });
    return out;
  }, [layout, einfluesse, gewaehlt]);

  function aktiviere(i: number) {
    setAktiv(i);
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

  // Wiederherstellen: gelesene Stationen aus der Spur öffnen (lokal, dann
  // Cloud-Union via SPUR_EVENT). Gelesene werden auch wieder eingeblendet.
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
    setAktiv(null);
    setGewaehlt(new Set(alle));
    setStruktur(0);
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
            : "Stationen wählen, dann antippen und lesen"}
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

      {/* Struktur-Umschalter */}
      <div className="mb-sm">
        <div
          role="group"
          aria-label="Anordnung der Stationen"
          className="inline-flex flex-wrap overflow-hidden rounded-lg border border-outline-variant"
        >
          {STRUKTUREN.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStruktur(i)}
              aria-pressed={i === struktur}
              className={
                "px-sm py-xs text-label-md transition-colors " +
                (i === struktur
                  ? "bg-tertiary-container text-on-tertiary-container"
                  : "bg-surface-bright text-on-surface-variant hover:bg-surface-container hover:text-on-surface") +
                (i > 0 ? " border-l border-outline-variant" : "")
              }
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="mt-xs text-label-md text-on-surface-variant">
          {STRUKTUREN[struktur].hinweis}
        </p>
      </div>

      {/* Knotenauswahl — welche Stationen erscheinen */}
      <div className="mb-sm rounded-xl border border-outline-variant bg-surface-container-low/60 p-md">
        <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
          <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
            <span className="material-symbols-outlined text-[16px]">filter_alt</span>
            Wähle Stationen — angeordnet nach deiner Strukturwahl
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
        <div className="flex flex-col gap-sm">
          {KAT_ORDER.map((kat) => (
            <div key={kat} className="flex flex-wrap items-center gap-xs">
              <span className="mr-xs w-full text-label-sm uppercase tracking-wider text-on-surface-variant sm:w-auto sm:min-w-[8.5rem]">
                {KAT_LABEL[kat]}
              </span>
              {alle
                .filter((i) => stationen[i].kat === kat)
                .map((i) => {
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
          ))}
        </div>
      </div>

      {/* Muster-Bühne */}
      <div
        className={
          "overflow-hidden rounded-xl border border-outline-variant p-sm sm:p-md " +
          buehneKlasse
        }
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="block w-full select-none touch-pan-y aspect-[720/400] sm:aspect-[720/300]"
          role="img"
          aria-label="Teil-Gewebe der gewählten KI-Stationen, angeordnet nach der Strukturwahl."
        >
          {/* Strang-Beschriftungen */}
          {layout.labels.map((l, i) => (
            <text
              key={`l${strukturId}-${i}`}
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

          {/* Verbindungen: Sequenz-Fäden + feine Einfluss-Bögen */}
          {kanten.map((k, i) => {
            const a = layout.pos.get(k.a);
            const b = layout.pos.get(k.b);
            if (!a || !b) return null;
            if (k.fein) {
              // sanfter Bogen für Einflüsse quer durch die Zeit
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2 - Math.min(70, Math.abs(b.x - a.x) * 0.28);
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

          {/* Punkte */}
          {gewaehltSortiert.map((i) => {
            const p = layout.pos.get(i);
            if (!p) return null;
            const st = stationen[i];
            const gelesen = gesammelt.includes(i);
            const istAktiv = aktiv === i;
            const name = st.kurz;
            const halb = (name.length * 5.7) / 2;
            const labelX = Math.max(halb + 6, Math.min(W - halb - 6, p.x)) - p.x;
            return (
              <g
                key={i}
                role="button"
                tabIndex={0}
                aria-label={`${st.titel} (${st.jahr}) — Station lesen`}
                aria-pressed={gelesen}
                onClick={() => aktiviere(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    aktiviere(i);
                  }
                }}
                style={{
                  transform: `translate(${p.x}px, ${p.y}px)`,
                  transition: "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="group cursor-pointer outline-none"
              >
                <circle cx="0" cy="0" r="18" fill="transparent" />
                {(gelesen || istAktiv) && (
                  <circle
                    cx="0"
                    cy="0"
                    r="9"
                    fill="none"
                    strokeWidth="1"
                    className="stroke-tertiary"
                    opacity={istAktiv ? 0.7 : 0.45}
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
                  className={gelesen ? "fill-on-surface" : "fill-on-surface-variant"}
                >
                  {name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Gelesene Stationen — bleiben stehen, in Lese-Reihenfolge */}
      <div aria-live="polite" className="mt-md">
        {gesammelt.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-lg">
            <p className="flex items-start gap-sm text-body-md text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px] text-tertiary">
                explore
              </span>
              Wähle oben Stationen und tippe einen Punkt an — seine Karte (zwei
              Sätze, teils mit Bild) blendet hier ein und bleibt stehen. Mit dem
              Umschalter ordnest du die gewählten Stationen neu.
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
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={st.bild.src}
                        alt={st.bild.alt}
                        loading="lazy"
                        className="h-16 w-16 flex-shrink-0 rounded-lg border border-outline-variant object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-body-lg font-medium text-on-surface">
                        {st.titel}
                        <span className="ml-sm text-label-md font-normal text-tertiary">
                          {st.jahr}
                        </span>
                      </p>
                      <p className="mt-xs text-body-md text-on-surface-variant">{st.text}</p>
                      {st.bild && (
                        <p className="mt-xs text-label-sm text-on-surface-variant opacity-70">
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
