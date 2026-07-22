"use client";

import { useEffect, useMemo, useState } from "react";
import { SPUR_EVENT, SPUREN_POLL_ID, leseSpuren, spurArt } from "../_lib/spuren";
import { GEWICHT_EVENT, leseGewichtungen } from "../_lib/gewichtung";
import { leseInhalte } from "../_lib/inhalte";
import {
  loadPollCounts,
  subscribePollCounts,
  type PollCounts,
} from "@/lib/polls";

/**
 * Knotenkarte — die stärksten Inhalte je Register als Punktwolke: höchstens
 * fünf von Anfang an, darüber hinaus nur Punkte mit über 40 Klicks.
 * Je stärker ein Inhalt, desto grösser sein Punkt (Phyllotaxis-Spirale: das
 * Stärkste in der Mitte). Jeder Bereich hat seine eigene Farbe (KI-Story,
 * Merkmale, Bilder, Teppich, Epochen …) — wie die Triebe des Rhizoms.
 *
 * Vier Register:
 *  · Angeklickt — die am häufigsten angeklickten Punkte (alle Nutzenden).
 *  · Weiterverfolgt — welche Inhalte am meisten «Das verfolge ich weiter»
 *    bekommen (anonym, alle Nutzenden).
 *  · Vertieft — wo am häufigsten «Mehr lesen» geöffnet wurde (alle).
 *  · Bekanntheit — was DU am ehesten kanntest (gross) und am wenigsten (klein).
 *
 * Drei Ebenen (du · Klasse · alle): «du» = lokal, «alle» = anonyme Poll-Zähler
 * (funktioniert überall), «Klasse» = Aggregations-Route (kommt online) — hier
 * als vorbereiteter Platzhalter, damit Pietros Route nur eingehängt wird.
 */

/** Anzeige-Regel je Register: höchstens BASIS_N Punkte von Anfang an —
 *  darüber hinaus nur, was öfter als SCHWELLE angeklickt wurde. */
const BASIS_N = 5;
const SCHWELLE = 40;

type Ansicht = "geklickt" | "weiter" | "vertieft" | "bekannt";

const ANSICHTEN: { id: Ansicht; label: string; icon: string; hinweis: string }[] = [
  {
    id: "geklickt",
    label: "Angeklickt",
    icon: "ads_click",
    hinweis: "Die fünf stärksten Punkte — und alles, was über 40-mal angeklickt wurde: KI-Story, Bilder (gezählt pro Punkt im Bild), Merkmale, Teppich und Epochen.",
  },
  {
    id: "weiter",
    label: "Weiterverfolgt",
    icon: "bookmark",
    hinweis: "Inhalte, die alle am häufigsten weiterverfolgen möchten — dem könntest du nachgehen.",
  },
  {
    id: "vertieft",
    label: "Vertieft",
    icon: "unfold_more",
    hinweis: "Wo am häufigsten «Mehr lesen» geöffnet wurde — die Punkte mit dem grössten Sog in die Tiefe.",
  },
  {
    id: "bekannt",
    label: "Bekanntheit",
    icon: "lightbulb",
    hinweis: "Was du am ehesten kanntest (grosse Punkte) und was am wenigsten (kleine).",
  },
];

/** Bereich (Farbe + Name) aus der Basis-ID ableiten — jeder Bereich hat seine
 *  EIGENE Farbe (wie die Triebe des Rhizoms), damit die Wolke lesbar bleibt. */
const AREAS: { prefix: string; name: string; fill: string; text: string }[] = [
  { prefix: "vorhang-auf:story", name: "KI-Story", fill: "fill-tertiary", text: "text-tertiary" },
  { prefix: "vorhang-auf:weisheit", name: "Merkmale", fill: "fill-secondary", text: "text-secondary" },
  { prefix: "vorhang-auf:bild", name: "Bilder", fill: "fill-error", text: "text-error" },
  { prefix: "vorhang-auf:kontext", name: "Kontext", fill: "fill-surface-tint", text: "text-surface-tint" },
  { prefix: "philosophische-perspektive:teppich", name: "Teppich", fill: "fill-primary", text: "text-primary" },
  { prefix: "philosophische-perspektive:epochen", name: "Epochen", fill: "fill-on-surface", text: "text-on-surface" },
  { prefix: "philosophische-perspektive:einstieg", name: "Philosophie", fill: "fill-outline", text: "text-on-surface-variant" },
  { prefix: "video:", name: "Videos", fill: "fill-inverse-surface", text: "text-inverse-surface" },
];
function areaVon(id: string) {
  return (
    AREAS.find((a) => id.startsWith(a.prefix)) ?? {
      prefix: "",
      name: "Weiteres",
      fill: "fill-outline",
      text: "text-on-surface-variant",
    }
  );
}

type Punkt = {
  id: string;
  titel: string;
  area: ReturnType<typeof areaVon>;
  staerke: number;
  du: boolean;
  alle: number;
};

const VB_W = 360;
const VB_H = 260;
const CENTER = { x: 180, y: 128 };
const GOLDWINKEL = 2.399963229728653; // 137.5° in rad

export default function Knotenkarte({ className = "" }: { className?: string }) {
  const [ansicht, setAnsicht] = useState<Ansicht>("geklickt");
  const [counts, setCounts] = useState<PollCounts>({});
  const [lokal, setLokal] = useState<{ spurIds: Set<string>; bekannt: Record<number, number> }>({
    spurIds: new Set(),
    bekannt: {},
  });
  const [inhalte, setInhalte] = useState<Record<string, string>>({});

  useEffect(() => {
    const lade = () => {
      setLokal({
        spurIds: new Set(leseSpuren().map((s) => s.id)),
        bekannt: leseGewichtungen("philosophische-perspektive:bekanntheit"),
      });
      setInhalte(leseInhalte());
    };
    lade();
    window.addEventListener(SPUR_EVENT, lade);
    window.addEventListener(GEWICHT_EVENT, lade);
    return () => {
      window.removeEventListener(SPUR_EVENT, lade);
      window.removeEventListener(GEWICHT_EVENT, lade);
    };
  }, []);

  useEffect(() => {
    void loadPollCounts(SPUREN_POLL_ID).then(setCounts);
    return subscribePollCounts(SPUREN_POLL_ID, setCounts);
  }, []);

  const titelVon = (id: string) => inhalte[id] ?? id.split(":").slice(-2).join(" ");

  const punkte = useMemo<Punkt[]>(() => {
    if (ansicht === "geklickt") {
      // Die angeklickten Inhalts-Punkte: KI-Story-Stationen, Merkmale,
      // Teppich-Punkte, Epochen-Aspekte, Videos — und BILDER als je EIN
      // Eintrag (Bezeichnung des Bildes), gezählt pro angeklicktem Punkt
      // (Hotspot) im Bild. Draussen bleiben: inhaltslose Einstiegsmuster
      // (`…:gewebe…`), «Die KI im Kontext» (hat keine Punkte), Kanten und
      // das blosse Öffnen eines Bildes.
      const zielBasis = (id: string): string | null => {
        if (id.includes(":gewebe")) return null;
        if (id.startsWith("vorhang-auf:kontext")) return null;
        const art = spurArt(id);
        if (art === "bildpunkt") return id.replace(/:hs\d+$/, ""); // → aufs Bild
        if (art === "bild") return null;
        if (art === "punkt" || art === "video") return id;
        return null;
      };
      const acc = new Map<string, { alle: number; du: boolean }>();
      for (const key in counts) {
        const base = zielBasis(key);
        if (!base) continue;
        const n = Number(counts[key]) || 0;
        if (n <= 0) continue;
        const e = acc.get(base) ?? { alle: 0, du: false };
        e.alle += n;
        acc.set(base, e);
      }
      for (const s of lokal.spurIds) {
        const base = zielBasis(s);
        if (!base) continue;
        const e = acc.get(base) ?? { alle: 0, du: false };
        e.du = true;
        acc.set(base, e);
      }
      return [...acc.entries()]
        .map(([id, e]) => ({
          id,
          titel: titelVon(id),
          area: areaVon(id),
          staerke: Math.max(e.alle, e.du ? 1 : 0),
          du: e.du,
          alle: e.alle,
        }))
        .sort((a, b) => b.staerke - a.staerke);
    }
    if (ansicht === "bekannt") {
      // Eigene Bekanntheit (Teppich-Bewertung «Das war mir bekannt»): Stufe
      // 0..2 → Stärke. Nur bewertete Punkte.
      return Object.entries(lokal.bekannt)
        .map(([i, stufe]) => {
          const base = `philosophische-perspektive:teppich:${i}`;
          return {
            id: base,
            titel: titelVon(base),
            area: areaVon(base),
            staerke: Math.max(0, Math.min(2, Number(stufe))) + 0.4,
            du: true,
            alle: 0,
          };
        })
        .sort((a, b) => b.staerke - a.staerke);
    }
    // weiter / vertieft: aus den anonymen Poll-Zählern (Präfix wunsch:/mehr:).
    const praefix = ansicht === "weiter" ? "wunsch:" : "mehr:";
    const map = new Map<string, Punkt>();
    for (const key in counts) {
      if (!key.startsWith(praefix)) continue;
      const base = key.slice(praefix.length);
      const alle = Number(counts[key]) || 0;
      if (alle <= 0) continue;
      map.set(base, {
        id: base,
        titel: titelVon(base),
        area: areaVon(base),
        staerke: alle,
        du: lokal.spurIds.has(`${praefix}${base}`),
        alle,
      });
    }
    // Eigene, die (noch) niemand sonst hat, ergänzen.
    for (const s of lokal.spurIds) {
      if (!s.startsWith(praefix)) continue;
      const base = s.slice(praefix.length);
      if (!map.has(base)) {
        map.set(base, {
          id: base,
          titel: titelVon(base),
          area: areaVon(base),
          staerke: 1,
          du: true,
          alle: 0,
        });
      }
    }
    return [...map.values()].sort((a, b) => b.staerke - a.staerke);
  }, [ansicht, counts, lokal, inhalte]);

  const maxStaerke = Math.max(1, ...punkte.map((p) => p.staerke));
  // Höchstens BASIS_N Punkte von Anfang an; darüber hinaus nur, was öfter als
  // SCHWELLE angeklickt wurde (Liste ist nach Stärke sortiert).
  const gezeigt = punkte.filter((p, i) => i < BASIS_N || p.alle > SCHWELLE);
  const sichtbar = gezeigt; // SVG-Wolke
  const top = gezeigt; // Rangliste
  const aktInfo = ANSICHTEN.find((a) => a.id === ansicht)!;
  /** Bereiche, die in der aktuellen Ansicht vorkommen — für die Farb-Legende. */
  const legendeAreas = AREAS.filter((a) => sichtbar.some((p) => p.area.prefix === a.prefix));

  return (
    <section className={"rounded-2xl border border-outline-variant bg-surface-bright p-md sm:p-lg " + className}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-md gap-y-xs">
        <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
          <span className="material-symbols-outlined text-[18px]">scatter_plot</span>
          Knotenkarte der Inhalte
        </p>
      </div>

      {/* Ansichts-Umschalter */}
      <div className="mt-sm flex flex-wrap gap-xs">
        {ANSICHTEN.map((a) => {
          const aktiv = a.id === ansicht;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setAnsicht(a.id)}
              aria-pressed={aktiv}
              className={
                "inline-flex items-center gap-xs rounded-full border px-md py-xs text-label-md transition-colors " +
                (aktiv
                  ? "border-tertiary bg-tertiary-container text-on-tertiary-container"
                  : "border-outline-variant bg-surface-bright text-on-surface-variant hover:border-tertiary hover:text-tertiary")
              }
            >
              <span className="material-symbols-outlined text-[16px]">{a.icon}</span>
              {a.label}
            </button>
          );
        })}
      </div>
      <p className="mt-sm max-w-2xl text-body-sm text-on-surface-variant">{aktInfo.hinweis}</p>

      {/* du · Klasse · alle */}
      <div className="mt-sm flex flex-wrap items-center gap-x-md gap-y-xs text-label-sm text-on-surface-variant">
        <span className="flex items-center gap-xs">
          <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-tertiary" />
          von dir angeklickt
        </span>
        <span className="flex items-center gap-xs opacity-70">
          <span className="material-symbols-outlined text-[16px]">group</span>
          Klasse — mit Klassencode (online)
        </span>
        <span className="flex items-center gap-xs">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-outline" />
          alle
        </span>
      </div>

      {/* Bereichs-Farben (wie die Triebe des Rhizoms: jeder Bereich ein Ton) */}
      {legendeAreas.length > 0 && (
        <div className="mt-xs flex flex-wrap items-center gap-x-md gap-y-xs text-label-sm text-on-surface-variant">
          {legendeAreas.map((a) => (
            <span key={a.prefix} className="flex items-center gap-xs">
              <span className={"inline-block h-2.5 w-2.5 rounded-full " + a.fill.replace("fill-", "bg-")} />
              {a.name}
            </span>
          ))}
        </div>
      )}

      {punkte.length === 0 ? (
        <p className="mt-md rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-md text-body-sm text-on-surface-variant">
          {ansicht === "bekannt"
            ? "Noch keine Bekanntheits-Bewertungen — bewerte im «Teppich des Wandels», was dir bekannt war."
            : ansicht === "geklickt"
              ? "Noch keine Klicks gezählt — sobald Punkte angeklickt werden, erscheinen hier die stärksten."
              : "Noch keine Daten — sobald Inhalte weiterverfolgt oder vertieft werden, erscheinen hier die stärksten."}
        </p>
      ) : (
        <div className="mt-md grid items-center gap-lg lg:grid-cols-[minmax(0,1fr)_20rem]">
          {/* Punktwolke */}
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="block w-full"
            role="img"
            aria-label={`Punktwolke: ${punkte.length} Inhalte, Grösse nach Stärke (${aktInfo.label}).`}
          >
            {sichtbar.map((p, i) => {
              const r = 3 + 13 * Math.sqrt(p.staerke / maxStaerke);
              const rad = 13 * Math.sqrt(i);
              const x = CENTER.x + rad * Math.cos(i * GOLDWINKEL);
              const y = CENTER.y + rad * Math.sin(i * GOLDWINKEL);
              return (
                <g key={p.id}>
                  <circle cx={x} cy={y} r={r} className={p.area.fill} opacity={0.55} />
                  {p.du && (
                    <circle
                      cx={x}
                      cy={y}
                      r={r + 2.5}
                      fill="none"
                      strokeWidth="1.6"
                      className="stroke-tertiary"
                    />
                  )}
                  <title>
                    {p.titel} · {p.area.name}
                    {ansicht === "bekannt" ? "" : ` · alle ${p.alle}`}
                    {p.du ? " · du" : ""}
                  </title>
                </g>
              );
            })}
          </svg>

          {/* Rangliste (Top 10) */}
          <ol className="flex flex-col gap-xs">
            {top.map((p, i) => (
              <li key={p.id} className="flex items-center gap-sm">
                <span
                  className="w-5 flex-shrink-0 text-right text-label-sm text-on-surface-variant"
                  style={{ fontFamily: "ui-monospace, monospace" }}
                >
                  {i + 1}
                </span>
                <span className={"h-2.5 w-2.5 flex-shrink-0 rounded-full " + p.area.fill.replace("fill-", "bg-")} />
                {/* Titel + kleines «du»-Häkchen direkt daneben (nicht in der Zahlenspalte) */}
                <span className="flex min-w-0 flex-1 items-center gap-xs">
                  <span
                    className={
                      "truncate text-body-sm " +
                      (p.du ? "font-medium text-on-surface" : "text-on-surface")
                    }
                    title={p.titel}
                  >
                    {p.titel}
                  </span>
                  {p.du && (
                    <span
                      className="material-symbols-outlined flex-shrink-0 text-[15px] text-tertiary"
                      title="von dir angeklickt"
                      aria-label="von dir angeklickt"
                    >
                      check_circle
                    </span>
                  )}
                </span>
                {/* Zahlenspalte: fixe Breite, rechtsbündig */}
                <span
                  className="w-16 flex-shrink-0 text-right text-label-sm text-on-surface-variant"
                  style={{ fontFamily: "ui-monospace, monospace" }}
                >
                  {ansicht === "bekannt"
                    ? ["gar nicht", "etwas", "gut"][Math.round(p.staerke - 0.4)] ?? ""
                    : `alle ${p.alle}`}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
