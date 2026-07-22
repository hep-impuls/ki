"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  leseSpuren,
  leseSpurenIndices,
  loescheSpuren,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";
import KartenAktion from "./KartenAktion";
import GewichtungWahl from "./GewichtungWahl";
import { GEWICHT_EVENT, gewichtungsStaerke, zieheGewichtungAusCloud } from "../_lib/gewichtung";
import { melde } from "../_lib/auswertung";
import { merkeInhalt } from "../_lib/inhalte";
import SammelAccordion from "./SammelAccordion";
import { sparsameMaschen, zaehleGefuellt, zufallsLayout } from "../_lib/flaechen";

/** Leuchtende Web-Palette (wie die Perlen der KI-Story) — dokumentierte
 *  Ausnahme von der reinen Token-Palette, nur für die gefüllten Maschen. */
const WEB_FARBEN = [
  "#f94144", "#f3722c", "#f8961e", "#f9c74f", "#90be6d", "#43aa8b",
  "#4d908e", "#577590", "#277da1", "#5e60ce", "#9d4edd", "#d81159",
] as const;

/**
 * KnotenLandschaft — die einheitliche Interaktion der Auftakt-Seite:
 * Punkte verbinden, Inhalte einblenden.
 *
 * Überall gleicher Ablauf: Ein Klick auf einen **Punkt** beschriftet ihn und
 * blendet seinen kurzen Inhalt ein (maximal zwei Sätze, ohne Zitat). Ein
 * Klick auf eine **Verbindungslinie** loggt sie ein (sie färbt sich und
 * bleibt stehen) und öffnet die Inhalte an ihren beiden Enden — kein
 * Nachfahren/Streifen mehr nötig. Zwischen besuchten Knoten füllen sich
 * optionale Flächen. Sind alle Punkte besucht, erscheint direkt unter dem
 * Muster das Abschluss-Feld (dezent schraffiert).
 *
 * Eine Landschaft kann mehrere **Anordnungen** derselben Knoten haben
 * (z.B. zeitlich / thematisch / technologisch): Ein Umschalter lässt die
 * Punkte an ihre neuen Plätze gleiten; besuchte Knoten und Karten bleiben.
 * Optional blendet ein Zufalls-Knopf n zufällige Punkte ein («ziehen»).
 *
 * Keine Landschaft hat ein Zentrum — lose, unregelmässige Geflechte.
 *
 * Aktivitäten werden wie überall dreifach registriert (_lib/spuren.ts):
 * lokal, als anonymer Firebase-Zähler und im Pro-Nutzer-Spiegel. Besuchte
 * Punkte (spurKey) und eingeloggte Verbindungen (kantenSpurKey) bleiben so
 * auch beim Wiederkommen und geräteübergreifend offen.
 *
 * Gestaltung wie Gewebe.tsx: nur Theme-Tokens, feine Linien + Knoten,
 * deterministische Koordinaten; die Bühnen-Tönung (`buehneKlasse`) ist je
 * Landschaft leicht anders.
 */

export interface LandKnoten {
  /** Titel der Karte und Beschriftung am Punkt (Kurzform via `kurz`). */
  titel: string;
  /** Kürzere Beschriftung im Muster (Default: titel). */
  kurz?: string;
  /** Kleine Zeitmarke im Kartenkopf (z.B. «1818», «Sage»). */
  jahr?: string;
  /** Inhalt der Karte. */
  text: string;
  /** Vertiefung hinter «Mehr lesen». */
  mehr?: string;
  /** Optionales kleines Bild in der Karte (mit Nachweis). */
  bild?: { src: string; alt: string; credit: string };
}

export interface LandKante {
  von: number;
  zu: number;
  /** Feiner Einfluss-Faden (dünner, halbtransparent). */
  fein?: boolean;
  /** Krümmung: vertikaler Versatz des Kontrollpunkts (− nach oben, + nach
   *  unten) — für Einfluss-Bögen, die nicht auf der Linie liegen. */
  bogen?: number;
}

export interface LandFlaeche {
  /** Polygon in viewBox-Koordinaten (gilt für die erste Anordnung). */
  punkte: [number, number][];
  /** Erscheint, sobald alle diese Knoten (Indizes) besucht sind. */
  knoten: number[];
  /** Füllung: sanfte Farbe, Schraffur oder Punktmuster. */
  muster?: "voll" | "schraffur" | "punkte";
}

export interface LandAnordnung {
  id: string;
  /** Beschriftung im Umschalter. */
  label: string;
  /** Kleine Erklärzeile unter dem Umschalter. */
  hinweis?: string;
  /** Position je Knoten (gleiche Reihenfolge wie `knoten`). */
  pos: [number, number][];
  kanten: LandKante[];
  /** Dezente Gruppen-Beschriftungen im Muster (z.B. Strang-Namen). */
  beschriftungen?: { x: number; y: number; text: string }[];
}

const VB_W = 720;

/** Pfad einer Kante: Gerade oder sanfter Bogen (quadratische Kurve). */
function kantenPfad(a: [number, number], b: [number, number], bogen?: number): string {
  if (!bogen) return `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2 + bogen;
  return `M${a[0]} ${a[1]} Q${mx} ${my} ${b[0]} ${b[1]}`;
}

/** Eine klickbare Verbindung: Grundfaden + Hover-Vorschau + eingeloggte,
 *  sich einzeichnende Spur + breite unsichtbare Klickfläche. */
function Kante({
  d,
  fein,
  aktiv,
  onKlick,
  ariaLabel,
}: {
  d: string;
  fein?: boolean;
  aktiv: boolean;
  onKlick: () => void;
  ariaLabel: string;
}) {
  const messRef = useRef<SVGPathElement>(null);
  const [len, setLen] = useState<number | null>(null);
  const [gezeichnet, setGezeichnet] = useState(false);

  useEffect(() => {
    if (messRef.current) setLen(messRef.current.getTotalLength());
  }, [d]);

  // Einzeichnen erst einen Tick nach dem Aktivieren — so läuft die
  // stroke-dashoffset-Transition sichtbar ab (auch beim Wiederherstellen).
  useEffect(() => {
    if (!aktiv) {
      setGezeichnet(false);
      return;
    }
    const t = window.setTimeout(() => setGezeichnet(true), 30);
    return () => window.clearTimeout(t);
  }, [aktiv]);

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-pressed={aktiv}
      onClick={onKlick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onKlick();
        }
      }}
      className="group/kante cursor-pointer outline-none"
    >
      {/* Grundfaden */}
      <path
        d={d}
        fill="none"
        strokeWidth={fein ? 0.9 : 1.25}
        className="stroke-outline-variant"
        opacity={fein ? 0.6 : 1}
      />
      {/* Hover-/Fokus-Vorschau: so würde die eingeloggte Verbindung liegen */}
      <path
        ref={messRef}
        d={d}
        fill="none"
        strokeWidth="2.4"
        className={
          "stroke-tertiary transition-opacity duration-200 " +
          (aktiv
            ? "opacity-0"
            : "opacity-0 group-hover/kante:opacity-30 group-focus-visible/kante:opacity-30")
        }
      />
      {/* Eingeloggte Verbindung — zeichnet sich ein */}
      {aktiv && len !== null && (
        <path
          d={d}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-tertiary"
          opacity="0.85"
          strokeDasharray={len}
          strokeDashoffset={gezeichnet ? 0 : len}
          style={{ transition: "stroke-dashoffset 600ms ease" }}
        />
      )}
      {/* Breite Klickfläche */}
      <path d={d} fill="none" strokeWidth="22" stroke="transparent" />
    </g>
  );
}

export default function KnotenLandschaft({
  knoten,
  anordnungen,
  flaechen = [],
  zufall,
  zufallLabel,
  hoehe = 220,
  einladung,
  abschluss,
  buehneKlasse = "bg-surface-container-low/60",
  svgKlasse = "",
  className = "",
  spurKey,
  kantenSpurKey,
  wunschKey,
  ariaLabel = "Knotenlandschaft",
  gewichtung,
  kantenInteraktiv = true,
  bereichLabel,
  weben = false,
}: {
  knoten: LandKnoten[];
  /** Eine oder mehrere Anordnungen; bei mehreren erscheint ein Umschalter. */
  anordnungen: LandAnordnung[];
  /** Flächen, die sich beim Besuchen der Knoten füllen — nur sinnvoll bei
   *  genau einer Anordnung (Positionen sind fix). */
  flaechen?: LandFlaeche[];
  /** «n Punkte ziehen»-Knopf: blendet n zufällige Punkte ein. */
  zufall?: number;
  zufallLabel?: string;
  /** viewBox-Höhe (Breite fix 720). */
  hoehe?: number;
  einladung: string;
  /** Erklärendes Abschluss-Feld unter dem Muster, sobald alles besucht ist. */
  abschluss?: string;
  /** Hintergrund-Tönung der Muster-Bühne (Theme-Token-Klasse). */
  buehneKlasse?: string;
  /** Aspekt-Klassen fürs SVG (z.B. "aspect-[720/300] sm:aspect-[720/220]"). */
  svgKlasse?: string;
  className?: string;
  /** Spur-Präfix für besuchte Punkte (z.B. "vorhang-auf:story"). */
  spurKey?: string;
  /** Eigener Spur-Präfix für eingeloggte Verbindungen — getrennt vom
   *  spurKey, damit die Orakel-Zählung der Punkte stimmt. */
  kantenSpurKey?: string;
  /** Präfix für die «Mehr dazu wissen»-Merkzeichen (Default: spurKey). */
  wunschKey?: string;
  ariaLabel?: string;
  /** Optional: pro Knoten eine Drei-Stufen-Gewichtung in der Karte; ihre
   *  aggregierte Stärke verstärkt die Konturen des Musters (Gestalt). */
  gewichtung?: { prefix: string; frage: string; stufen: [string, string, string] };
  /** false → Verbindungslinien sind nur sichtbare Fäden, nicht anklickbar
   *  (kein Einloggen/Zählen). Der Fokus liegt auf Punkten + Flächen. */
  kantenInteraktiv?: boolean;
  /** Wenn gesetzt: Flächen-Bilanz + gewählte Titel ans Orakel melden. */
  bereichLabel?: string;
  /** true → statt handgesetzter `flaechen`/Kanten ein Delaunay-Web (wie
   *  «Teppich des Wandels» / KI-Story): feines Netz über die Punkte, in dem
   *  sich zwischen besuchten Punkten farbige Maschen füllen. Nur bei genau
   *  einer Anordnung sinnvoll (feste Positionen). */
  weben?: boolean;
}) {
  const n = knoten.length;
  // Aggregierte Kontur-Stärke (0..1) aus den Gewichtungen — live.
  const [konturStaerke, setKonturStaerke] = useState(0);
  useEffect(() => {
    if (!gewichtung) return;
    const lade = () => setKonturStaerke(gewichtungsStaerke(gewichtung.prefix, n));
    lade();
    window.addEventListener(GEWICHT_EVENT, lade);
    return () => window.removeEventListener(GEWICHT_EVENT, lade);
  }, [gewichtung, n]);
  const musterId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const anordnungenRef = useRef(anordnungen);
  anordnungenRef.current = anordnungen;

  const [modus, setModus] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  /** Einsammel-Reihenfolge — die Karten bleiben in dieser Ordnung stehen. */
  const [gesammelt, setGesammelt] = useState<number[]>([]);
  /** Welche Detail-Karte ist aufgeklappt (Accordion; null = keine). */
  const [offeneKarte, setOffeneKarte] = useState<number | null>(null);
  /** Eingeloggte Verbindungen, Schlüssel `${anordnungsIndex}:${kantenIndex}`. */
  const [kantenAktiv, setKantenAktiv] = useState<Set<string>>(new Set());

  // Immer die zuletzt eingesammelte Karte offen zeigen (Rest zugeklappt).
  useEffect(() => {
    setOffeneKarte(gesammelt.length ? gesammelt[gesammelt.length - 1] : null);
  }, [gesammelt]);

  const anordnung = anordnungen[Math.min(modus, anordnungen.length - 1)];

  // Web-Layout: zufällig, gut verteilt — im Browser erzeugt (SSR rendert die
  // deterministische Ausgangslage) und beim Zurücksetzen neu gewürfelt.
  const [webPos, setWebPos] = useState<[number, number][] | null>(null);
  useEffect(() => {
    if (weben) setWebPos(zufallsLayout(n, VB_W, hoehe, 48));
  }, [weben, n, hoehe]);
  const posVon = (i: number): [number, number] =>
    (weben && webPos ? webPos[i] : anordnung.pos[i]) ?? [0, 0];

  // Delaunay-Web: sparsame Maschen (pro Punkt gedeckelt) + Netz-Kanten.
  const autoMaschen = useMemo(() => {
    if (!weben) return [];
    const quelle = webPos ?? anordnung.pos;
    return sparsameMaschen(quelle.map(([x, y]) => ({ x, y })), 300, 4);
  }, [weben, webPos, anordnung]);
  const webKanten = useMemo(() => {
    const seen = new Set<string>();
    const out: [number, number][] = [];
    for (const [a, b, c] of autoMaschen) {
      for (const [p, q] of [
        [a, b],
        [b, c],
        [c, a],
      ]) {
        const lo = Math.min(p, q);
        const hi = Math.max(p, q);
        const k = `${lo}-${hi}`;
        if (!seen.has(k)) {
          seen.add(k);
          out.push([lo, hi]);
        }
      }
    }
    return out;
  }, [autoMaschen]);

  function reveal(i: number) {
    if (i < 0 || i >= n) return;
    setVisited((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
    setGesammelt((g) => (g.includes(i) ? g : [...g, i]));
    // Zuletzt angeklickter Punkt → sein Accordion ist offen (auch wenn er
    // schon eingesammelt war).
    setOffeneKarte(i);
    if (spurKey) merkeSpur(`${spurKey}:${i}`);
  }

  /** Klick auf eine Verbindungslinie: einloggen + beide Enden einblenden. */
  function kanteKlick(ki: number) {
    const kante = anordnung.kanten[ki];
    if (!kante) return;
    const key = `${modus}:${ki}`;
    setKantenAktiv((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
    if (kantenSpurKey) merkeSpur(`${kantenSpurKey}:${modus}-${ki}`);
    reveal(kante.von);
    reveal(kante.zu);
  }

  /** «n Punkte ziehen»: zufällige, noch nicht besuchte Punkte einblenden. */
  function zufallZiehen() {
    const anzahl = zufall ?? 3;
    const pool = knoten.map((_, i) => i).filter((i) => !visited.has(i));
    for (let z = 0; z < anzahl && pool.length > 0; z++) {
      const j = Math.floor(Math.random() * pool.length);
      reveal(pool.splice(j, 1)[0]);
    }
  }

  // Wiederherstellen: besuchte Punkte + eingeloggte Verbindungen aus der
  // gespeicherten Spur öffnen (lokal, dann Cloud-Union via SPUR_EVENT).
  useEffect(() => {
    if (!spurKey && !kantenSpurKey) return;
    function restore() {
      if (spurKey) {
        const idx = leseSpurenIndices(spurKey).filter((i) => i >= 0 && i < n);
        if (idx.length > 0) {
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
      }
      if (kantenSpurKey) {
        const prefix = `${kantenSpurKey}:`;
        const keys: string[] = [];
        for (const s of leseSpuren()) {
          if (!s.id.startsWith(prefix)) continue;
          const teile = s.id.slice(prefix.length).split("-");
          const a = Number(teile[0]);
          const k = Number(teile[1]);
          const anordn = anordnungenRef.current[a];
          if (Number.isInteger(a) && Number.isInteger(k) && anordn && k >= 0 && k < anordn.kanten.length) {
            keys.push(`${a}:${k}`);
          }
        }
        if (keys.length > 0) {
          setKantenAktiv((prev) => {
            const nx = new Set(prev);
            keys.forEach((k) => nx.add(k));
            return nx;
          });
        }
      }
    }
    restore();
    void zieheSpurenAusCloud();
    void zieheGewichtungAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [spurKey, kantenSpurKey, n]);

  /** «Muster zurücksetzen»: alles löschen, von vorn beginnen — die Karten
   *  sammeln sich danach in neuer Reihenfolge. Wichtig: erst BEIDE
   *  Spur-Präfixe löschen, dann den State leeren — loescheSpuren feuert
   *  SPUR_EVENT, und das Restore würde sonst aus dem noch nicht gelöschten
   *  zweiten Präfix sofort wieder auffüllen. */
  function zuruecksetzen() {
    if (spurKey) loescheSpuren(spurKey);
    if (kantenSpurKey) loescheSpuren(kantenSpurKey);
    setVisited(new Set());
    setGesammelt([]);
    setKantenAktiv(new Set());
    // Web-Modus: die Punkte würfeln sich neu — ein frisches Gewebe.
    if (weben) setWebPos(zufallsLayout(n, VB_W, hoehe, 48));
  }

  const done = visited.size === n;
  const started = visited.size > 0 || kantenAktiv.size > 0;
  const offenAnzahl = n - visited.size;
  const mehrereAnordnungen = anordnungen.length > 1;

  // Flächen-Bilanz + gewählte Titel ans Orakel melden (falls bereichLabel).
  useEffect(() => {
    if (!bereichLabel) return;
    const gefuellt = weben
      ? zaehleGefuellt(autoMaschen, visited)
      : flaechen.filter((f) => f.knoten.every((k) => visited.has(k))).length;
    const total = weben ? autoMaschen.length : flaechen.length;
    const labels = gesammelt
      .map((i) => knoten[i]?.kurz ?? knoten[i]?.titel)
      .filter((s): s is string => Boolean(s));
    melde(spurKey ?? bereichLabel, {
      bereich: bereichLabel,
      flaechenGefuellt: gefuellt,
      flaechenTotal: total,
      labels,
    });
    // knoten/flaechen sind stabile Props → nicht in die Deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visited, gesammelt, bereichLabel, spurKey, weben, autoMaschen]);

  // Alle Titel registrieren (auch unbesuchte) — für die Sternenkarte im Orakel.
  useEffect(() => {
    knoten.forEach((k, i) =>
      merkeInhalt(`${wunschKey ?? spurKey ?? "knoten"}:${i}`, k.titel),
    );
  }, [knoten, spurKey, wunschKey]);

  return (
    <section aria-label={ariaLabel} className={className}>
      <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
        <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] text-tertiary">
            {done ? "done_all" : "touch_app"}
          </span>
          {done
            ? `Alle ${n} Punkte besucht — das Muster ist gewoben`
            : started
            ? `${visited.size} von ${n} Punkten besucht${
                kantenAktiv.size > 0 ? ` · ${kantenAktiv.size} Verbindungen` : ""
              }`
            : kantenInteraktiv
            ? "Punkte antippen, Verbindungen einloggen"
            : "Punkte antippen — zwischen ihnen füllen sich Flächen"}
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

      {(mehrereAnordnungen || (zufall && offenAnzahl > 0)) && (
        <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
          {mehrereAnordnungen ? (
            <div className="min-w-0">
              <div
                role="group"
                aria-label="Anordnung der Punkte"
                className="inline-flex overflow-hidden rounded-lg border border-outline-variant"
              >
                {anordnungen.map((a, i) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setModus(i)}
                    aria-pressed={i === modus}
                    className={
                      "px-sm py-xs text-label-md transition-colors " +
                      (i === modus
                        ? "bg-tertiary-container text-on-tertiary-container"
                        : "bg-surface-bright text-on-surface-variant hover:bg-surface-container hover:text-on-surface") +
                      (i > 0 ? " border-l border-outline-variant" : "")
                    }
                  >
                    {a.label}
                  </button>
                ))}
              </div>
              {anordnung.hinweis && (
                <p className="mt-xs text-label-md text-on-surface-variant">
                  {anordnung.hinweis}
                </p>
              )}
            </div>
          ) : (
            <span />
          )}
          {zufall && offenAnzahl > 0 && (
            <button
              type="button"
              onClick={zufallZiehen}
              className="inline-flex items-center gap-xs rounded-lg bg-tertiary-container px-md py-xs text-label-md text-on-tertiary-container transition-opacity hover:opacity-85"
            >
              <span className="material-symbols-outlined text-[16px]">shuffle</span>
              {zufallLabel ?? `${Math.min(zufall, offenAnzahl)} Punkte ziehen`}
            </button>
          )}
        </div>
      )}

      {/* Muster-Bühne: eigener, je Landschaft leicht anders getönter Grund */}
      <div
        className={
          "overflow-hidden rounded-xl border border-outline-variant p-sm sm:p-md " +
          buehneKlasse
        }
      >
        <svg
          viewBox={`0 0 ${VB_W} ${hoehe}`}
          preserveAspectRatio="none"
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

          {/* Delaunay-Web: feines Netz + gefüllte Maschen zwischen besuchten
              Punkten (wie Teppich/KI-Story) */}
          {weben && (
            <>
              {webKanten.map(([p, q], i) => {
                const a = posVon(p);
                const b = posVon(q);
                const beide = visited.has(p) && visited.has(q);
                return (
                  <line
                    key={`wk${i}`}
                    x1={a[0]}
                    y1={a[1]}
                    x2={b[0]}
                    y2={b[1]}
                    strokeWidth={beide ? 1.1 : 0.8}
                    className={
                      (beide ? "stroke-tertiary" : "stroke-outline-variant") +
                      " transition-all duration-500"
                    }
                    opacity={beide ? 0.5 : 0.18}
                  />
                );
              })}
              {autoMaschen.map((t, i) => {
                if (!t.every((v) => visited.has(v))) return null;
                const farbe = WEB_FARBEN[i % WEB_FARBEN.length];
                const pts = t
                  .map((v) => {
                    const p = posVon(v);
                    return `${p[0]},${p[1]}`;
                  })
                  .join(" ");
                return (
                  <polygon
                    key={`wm${i}`}
                    points={pts}
                    fill={farbe}
                    fillOpacity={0.17}
                    stroke={farbe}
                    strokeOpacity={0.33}
                    strokeWidth={0.6}
                    className="pointer-events-none transition-opacity duration-500"
                  />
                );
              })}
            </>
          )}

          {/* Flächen — füllen sich, sobald ihre Knoten besucht sind */}
          {!weben &&
            !mehrereAnordnungen &&
            flaechen.map((f, i) => {
              const aktiv = f.knoten.every((k) => visited.has(k));
              const art = f.muster ?? (["voll", "schraffur", "punkte"] as const)[i % 3];
              const fill =
                art === "voll"
                  ? undefined
                  : `url(#${musterId}-${art === "schraffur" ? "schraffur" : "punkte"})`;
              // Gestalt-Gewichtung verstärkt Füllung UND zeichnet eine Kontur:
              // mehr «deutlich» → deutlichere Umrisse.
              const grundOpazitaet = art === "voll" ? 0.09 : 1;
              const fuellOpazitaet = gewichtung
                ? grundOpazitaet * (0.55 + 0.9 * konturStaerke)
                : grundOpazitaet;
              return (
                <polygon
                  key={`f${i}`}
                  points={f.punkte.map(([x, y]) => `${x},${y}`).join(" ")}
                  fill={fill}
                  className={
                    "pointer-events-none transition-all duration-700 " +
                    (art === "voll" ? "fill-tertiary " : "") +
                    (gewichtung ? "stroke-tertiary" : "")
                  }
                  strokeWidth={gewichtung ? 0.4 + 2.2 * konturStaerke : 0}
                  strokeOpacity={gewichtung ? Math.min(1, 0.15 + 0.85 * konturStaerke) : 0}
                  opacity={aktiv ? Math.min(1, fuellOpazitaet) : 0}
                />
              );
            })}

          {/* Dezente Gruppen-Beschriftungen der Anordnung */}
          {anordnung.beschriftungen?.map((b, i) => (
            <text
              key={`b${modus}-${i}`}
              x={b.x}
              y={b.y}
              fontSize="11"
              letterSpacing="0.08em"
              className="fill-on-surface-variant uppercase"
              opacity="0.75"
            >
              {b.text}
            </text>
          ))}

          {/* Verbindungen — interaktiv: anklicken loggt sie ein und öffnet
              beide Enden. Nicht-interaktiv: nur sichtbare Fäden im Geflecht.
              Bei `weben` übernimmt das Delaunay-Netz die Fäden. */}
          {!weben &&
            anordnung.kanten.map((ka, ki) => {
            const a = anordnung.pos[ka.von];
            const b = anordnung.pos[ka.zu];
            if (!a || !b) return null;
            const d = kantenPfad(a, b, ka.bogen);
            if (!kantenInteraktiv) {
              return (
                <path
                  key={`${anordnung.id}-${ki}`}
                  d={d}
                  fill="none"
                  strokeWidth={ka.fein ? 0.9 : 1.25}
                  className="stroke-outline-variant"
                  opacity={ka.fein ? 0.6 : 1}
                />
              );
            }
            const key = `${modus}:${ki}`;
            return (
              <Kante
                key={`${anordnung.id}-${ki}`}
                d={d}
                fein={ka.fein}
                aktiv={kantenAktiv.has(key)}
                onKlick={() => kanteKlick(ki)}
                ariaLabel={`Verbindung ${knoten[ka.von]?.kurz ?? knoten[ka.von]?.titel} – ${
                  knoten[ka.zu]?.kurz ?? knoten[ka.zu]?.titel
                } einloggen`}
              />
            );
          })}

          {/* Punkte — gleiten beim Umschalten an ihre neue Position */}
          {knoten.map((k, i) => {
            const [x, y] = posVon(i);
            const reached = visited.has(i);
            const name = k.kurz ?? k.titel;
            // Beschriftung unterm Punkt: horizontal so eingemittet, dass sie
            // im Bild bleibt (grobe Breitenschätzung reicht).
            const halb = (name.length * 5.7) / 2;
            const labelX = Math.max(halb + 6, Math.min(VB_W - halb - 6, x)) - x;
            // Hover-Tooltip (vor dem Besuch): Titel über/unter dem Punkt.
            const tipW = Math.max(46, name.length * 7 + 18);
            const tipAbove = y >= 46;
            const tipYRel = tipAbove ? -38 : 14;
            const tipXRel = Math.min(VB_W - tipW - 3, Math.max(3, x - tipW / 2)) - x;
            return (
              <g
                key={i}
                role="button"
                tabIndex={0}
                aria-label={`${k.titel} — Punkt ${i + 1} von ${n}`}
                onClick={() => reveal(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    reveal(i);
                  }
                }}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  transition: "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="group cursor-pointer outline-none"
              >
                <circle cx="0" cy="0" r="22" fill="transparent" />
                {/* Einladung: im Web-Modus blinken ALLE unbesuchten Punkte,
                    sonst der erste bis zum Start. */}
                {(weben ? !reached : !started && i === 0) && (
                  <circle
                    cx="0"
                    cy="0"
                    r={weben ? 9 : 11}
                    className="fill-tertiary opacity-25 animate-ping origin-center [transform-box:fill-box] motion-reduce:hidden"
                  />
                )}
                {reached && (
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
                  r="4.5"
                  className={
                    (reached ? "fill-tertiary" : "fill-outline") +
                    " origin-center [transform-box:fill-box] transition-transform duration-300 group-hover:scale-125 group-focus-visible:scale-125"
                  }
                  opacity={reached ? 1 : 0.65}
                />
                {/* Beschriftung — erscheint mit dem Besuch */}
                {reached && (
                  <text
                    x={labelX}
                    y="22"
                    textAnchor="middle"
                    fontSize="11"
                    className="fill-on-surface-variant animate-frame-in"
                  >
                    {name}
                  </text>
                )}
                {/* Tooltip vor dem Besuch */}
                {!reached && (
                  <g className="pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <rect
                      x={tipXRel}
                      y={tipYRel}
                      width={tipW}
                      height="24"
                      rx="6"
                      className="fill-inverse-surface"
                    />
                    <text
                      x={tipXRel + tipW / 2}
                      y={tipYRel + 16}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="600"
                      className="fill-inverse-on-surface"
                    >
                      {name}
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
            <span className="material-symbols-outlined text-tertiary">done_all</span>
            Das Muster ist gewoben
          </p>
          <p className="mt-sm text-body-lg text-on-surface">{abschluss}</p>
        </div>
      )}

      {/* Eingeblendete Inhalte — bleiben stehen, in Einsammel-Reihenfolge */}
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
          <ol className="flex flex-col gap-sm">
            {gesammelt.map((idx, pos) => {
              const k = knoten[idx];
              const neuste = pos === gesammelt.length - 1;
              return (
                <SammelAccordion
                  key={idx}
                  nr={pos + 1}
                  titel={k.titel}
                  jahr={k.jahr}
                  neuste={neuste}
                  offen={offeneKarte === idx}
                  onToggle={() => setOffeneKarte((o) => (o === idx ? null : idx))}
                >
                  <div className="flex items-start gap-md">
                    {k.bild && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={k.bild.src}
                        alt={k.bild.alt}
                        loading="lazy"
                        className="h-16 w-16 flex-shrink-0 rounded-lg border border-outline-variant object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-body-md text-on-surface-variant">{k.text}</p>
                      {k.bild && (
                        <p className="mt-xs text-label-sm text-on-surface-variant opacity-70">
                          {k.bild.credit}
                        </p>
                      )}
                      <KartenAktion
                        mehr={k.mehr}
                        wunschId={`wunsch:${wunschKey ?? spurKey ?? "knoten"}:${idx}`}
                        titel={k.titel}
                      />
                      {gewichtung && (
                        <GewichtungWahl
                          className="mt-sm border-t border-outline-variant pt-sm"
                          prefix={gewichtung.prefix}
                          index={idx}
                          frage={gewichtung.frage}
                          stufen={gewichtung.stufen}
                        />
                      )}
                    </div>
                  </div>
                </SammelAccordion>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
