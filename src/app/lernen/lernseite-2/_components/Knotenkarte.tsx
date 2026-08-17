"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SPUR_EVENT, SPUREN_POLL_ID, leseSpuren, spurArt } from "../_lib/spuren";
import { GEWICHT_EVENT, leseGewichtungen } from "../_lib/gewichtung";
import { INHALTE_EVENT, leseInhalte, zieheInhalteAusCloud } from "../_lib/inhalte";
import { hrefFuer } from "../_lib/ziele";
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
    hinweis: "Die fünf stärksten Punkte und alles, was über 40-mal angeklickt wurde: KI-Story, Bilder (gezählt pro Punkt im Bild), Merkmale, Teppich und Epochen.",
  },
  {
    id: "weiter",
    label: "Weiterverfolgt",
    icon: "bookmark",
    hinweis: "Inhalte, die alle am häufigsten weiterverfolgen möchten, dem könntest du nachgehen.",
  },
  {
    id: "vertieft",
    label: "Vertieft",
    icon: "unfold_more",
    hinweis: "Wo am häufigsten «Mehr lesen» geöffnet wurde: die Punkte mit dem grössten Sog in die Tiefe.",
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
  { prefix: "vorhang-auf:bild", name: "Bilder KI-Story", fill: "fill-error", text: "text-error" },
  { prefix: "vorhang-auf:kontext", name: "Kontext", fill: "fill-surface-tint", text: "text-surface-tint" },
  { prefix: "philosophische-perspektive:teppich", name: "Teppich", fill: "fill-primary", text: "text-primary" },
  // spezifischer als «…:epochen» → MUSS davor stehen (erster Treffer gewinnt)
  { prefix: "philosophische-perspektive:epochen-bild", name: "Bilder Verunsicherung", fill: "fill-on-error-container", text: "text-on-error-container" },
  { prefix: "philosophische-perspektive:epochen", name: "Epochen", fill: "fill-on-surface", text: "text-on-surface" },
  { prefix: "philosophische-perspektive:einstieg", name: "Philosophie", fill: "fill-outline", text: "text-on-surface-variant" },
  // Orientierung: die Denkwege-Bereiche und die einzelnen Philosoph:innen
  // (weiterverfolgte «Stimmen»). Vor «…:einstieg»? Nein — kein Präfix-Konflikt.
  { prefix: "philosophische-perspektive:denker", name: "Orientierung", fill: "fill-surface-tint", text: "text-surface-tint" },
  { prefix: "philosophische-perspektive:denkwege", name: "Orientierung", fill: "fill-surface-tint", text: "text-surface-tint" },
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

/** Merker: Ebenen-Umschalter schon benutzt → Pulsieren aus. */
const EBENE_BENUTZT_KEY = "ki26-knotenkarte-ebene-benutzt";

const VB_W = 360;
const VB_H = 260;
const CENTER = { x: 180, y: 128 };
const GOLDWINKEL = 2.399963229728653; // 137.5° in rad

/**
 * Titel als Link — oder als schlichter Text, wenn es keine Adresse gibt.
 *
 * Ohne Adresse (unbekanntes Präfix) bleibt es Text: Ein Link, der nirgendwohin
 * führt, ist schlimmer als kein Link.
 */
function MaybeLink({
  href,
  className,
  titel,
  children,
}: {
  href?: string;
  className: string;
  titel: string;
  children: React.ReactNode;
}) {
  if (!href) {
    return (
      <span className={className} title={titel}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={
        className +
        " underline decoration-outline-variant underline-offset-2 hover:text-tertiary hover:decoration-tertiary"
      }
      title={`${titel}, zum Abschnitt springen`}
    >
      {children}
    </Link>
  );
}

export default function Knotenkarte({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [ansicht, setAnsicht] = useState<Ansicht>("geklickt");
  /* Ebene: «alle» = Kollektiv (anonyme Zähler), «du» = nur die eigenen Punkte. */
  const [ebene, setEbene] = useState<"alle" | "du">("alle");
  const [counts, setCounts] = useState<PollCounts>({});
  const [lokal, setLokal] = useState<{ spurIds: Set<string>; bekannt: Record<string, number> }>({
    spurIds: new Set(),
    bekannt: {},
  });
  const [inhalte, setInhalte] = useState<Record<string, string>>({});
  /* Wurde der Ebenen-Umschalter «Alle / Nur ich» schon benutzt? Steuert nur das
     Pulsieren. Erst nach dem Aufbau aus dem Speicher lesen, damit Server- und
     Browser-Fassung beim ersten Rendern übereinstimmen (sonst Hydrations-Streit). */
  const [ebeneBenutzt, setEbeneBenutzt] = useState(true);
  useEffect(() => {
    try {
      setEbeneBenutzt(window.localStorage.getItem(EBENE_BENUTZT_KEY) === "1");
    } catch {
      setEbeneBenutzt(false); // Privatmodus: dann pulsiert es eben jedes Mal
    }
  }, []);
  function ebeneBenutztMerken() {
    setEbeneBenutzt(true);
    try {
      window.localStorage.setItem(EBENE_BENUTZT_KEY, "1");
    } catch {
      /* Privatmodus */
    }
  }

  useEffect(() => {
    const lade = () => {
      setLokal({
        spurIds: new Set(leseSpuren().map((s) => s.id)),
        bekannt: leseGewichtungen("philosophische-perspektive:bekanntheit"),
      });
      setInhalte(leseInhalte());
    };
    lade();
    /* Titel aus der Cloud nachholen. Ohne das fehlten sie auf jedem zweiten
       Gerät: Die Punkte kommen über `zieheSpurenAusCloud` zurück, die Namen
       lagen aber nur im Browser, in dem die Inhaltsseiten gerendert hatten. */
    void zieheInhalteAusCloud();
    window.addEventListener(SPUR_EVENT, lade);
    window.addEventListener(GEWICHT_EVENT, lade);
    window.addEventListener(INHALTE_EVENT, lade);
    return () => {
      window.removeEventListener(SPUR_EVENT, lade);
      window.removeEventListener(GEWICHT_EVENT, lade);
      window.removeEventListener(INHALTE_EVENT, lade);
    };
  }, []);

  useEffect(() => {
    void loadPollCounts(SPUREN_POLL_ID).then(setCounts);
    return subscribePollCounts(SPUREN_POLL_ID, setCounts);
  }, []);

  /**
   * Titel zu einer Punkt-ID.
   *
   * Die Registry (`leseInhalte`) wird PRO BROWSER gefüllt, und zwar nur für
   * Inhalte, die hier auch besucht wurden. Die Ansicht «alle» zeigt aber
   * Zähler aus allen Browsern — für Punkte, die man selbst nie geöffnet hat,
   * ist der Titel darum unbekannt. Auf einem frischen Gerät betrifft das
   * fast alles.
   *
   * Vorher stand als Ersatz `id.split(":").slice(-2).join(" ")`, was aus
   * einer ID wie «…:teppich:5:1» die Zeichenfolge «5 1» machte: sah wie eine
   * Zahlenangabe aus und war keine. Jetzt sagt der Ersatztext, was er weiss —
   * den Bereich — und was er nicht weiss.
   */
  /** Nur der konkrete Teil des Namens, OHNE Bereich. */
  const konkretVon = (id: string) => {
    const bekannt = inhalte[id];
    if (bekannt) return bekannt;
    /* Steckt ein sprechender Name in der Kennung, ist er der beste Ersatz.
       «…:denker:0:aristoteles» wurde vorher zu «Punkt 0», und zwar für JEDE
       Person dieses Bereichs — drei Zeilen der Rangliste hiessen gleich, obwohl
       sie verschiedene Inhalte waren. Ausgeschlossen sind reine Zähl-Segmente
       wie «hs0» oder «12». */
    const letztes = id.split(":").pop() ?? "";
    if (/^[a-zäöüéèà][a-zäöüéèà-]{2,}$/i.test(letztes)) {
      return letztes
        .split("-")
        .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
        .join("-");
    }
    /* Sonst alle Ziffernfolgen, nicht nur die letzte: «…:bilder:2:hs0» und
       «…:bilder:3:hs0» enden beide auf 0 und wären sonst gleich beschriftet. */
    const zahlen = [...id.matchAll(/\d+/g)].map((m) => m[0]);
    return zahlen.length ? `Punkt ${zahlen.join(".")}` : "noch nicht besucht";
  };

  /**
   * Anzeigename: IMMER «Bereich · Konkretes».
   *
   * Christofs Regel vom 2026-08-08, und sie ist richtig: Vorher trugen nur die
   * Ersatztexte den Bereich, die echten Titel nicht. In der Rangliste stand dann
   * «Kaffeehaus & Öffentlichkeit» ohne jeden Hinweis, woher das kommt — neben
   * einem «Merkmale · Punkt 4», das den Bereich nannte. Zwei Muster in einer
   * Liste. Jetzt setzt der Bereich immer vorne, an EINER Stelle angefügt statt in
   * jedem Zweig einzeln.
   *
   * Der Bereichsname ist der kurze aus AREAS («Teppich», «Merkmale»), nicht der
   * volle Abschnittstitel («Der Teppich des Wandels»): In einer schmalen Spalte
   * auf dem Handy bliebe vom konkreten Teil sonst nichts übrig.
   */
  const titelVon = (id: string) => {
    const konkret = konkretVon(id);
    const bereich = areaVon(id).name;
    return konkret.startsWith(bereich) ? konkret : `${bereich} · ${konkret}`;
  };

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

  // Ebene «du» blendet auf die eigenen Punkte, «alle» zeigt das Kollektiv.
  const gefiltert = ebene === "du" ? punkte.filter((p) => p.du) : punkte;
  const maxStaerke = Math.max(1, ...gefiltert.map((p) => p.staerke));
  // «alle»: höchstens BASIS_N Punkte von Anfang an, darüber hinaus nur, was
  // öfter als SCHWELLE angeklickt wurde. «du»: alle eigenen zeigen.
  const gezeigt =
    ebene === "du"
      ? gefiltert
      : gefiltert.filter((p, i) => i < BASIS_N || p.alle > SCHWELLE);
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
        {/* Ebene: nur die eigenen Punkte oder alle einblenden.
            Der Umschalter pulsiert, bis er einmal benutzt wurde — man übersieht
            ihn sonst und merkt nicht, dass die Karte zwei Blickwinkel hat.
            Danach ist Ruhe: Ein Element, das dauernd blinkt, wird zum Störer.
            `animate-ping` ist Tailwind-Bordgut und schon bei den Bildpunkten in
            Gebrauch; eine eigene Animation hätte in die gemeinsame globals.css
            gemusst. Bei reduzierter Bewegung bleibt es still. */}
        <span className="relative inline-flex">
          {!ebeneBenutzt && (
            <span
              aria-hidden="true"
              className="absolute -inset-1 animate-ping rounded-full bg-tertiary/20 motion-reduce:hidden"
            />
          )}
          <span className="relative inline-flex overflow-hidden rounded-full border border-outline-variant bg-surface-bright">
            {([["alle", "Alle"], ["du", "Nur ich"]] as const).map(([e, label]) => (
              <button
                key={e}
                type="button"
                onClick={() => {
                  setEbene(e);
                  ebeneBenutztMerken();
                }}
                aria-pressed={ebene === e}
                className={
                  "px-md py-xs text-label-sm transition-colors " +
                  (ebene === e
                    ? "bg-tertiary-container text-on-tertiary-container"
                    : "bg-surface-bright text-on-surface-variant hover:text-tertiary")
                }
              >
                {label}
              </button>
            ))}
          </span>
        </span>
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
          Klasse, mit Klassencode (online)
        </span>
        <span className="flex items-center gap-xs">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-outline" />
          alle
        </span>
        {/* Dass die Punkte führen, sieht man ihnen nicht an — darum sagen. */}
        <span className="flex items-center gap-xs text-tertiary">
          <span className="material-symbols-outlined text-[16px]">ads_click</span>
          Punkt oder Titel anklicken führt zum Inhalt
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

      {gefiltert.length === 0 ? (
        <p className="mt-md rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-md text-body-sm text-on-surface-variant">
          {ebene === "du"
            ? "Hier hast du noch nichts markiert. Sobald du Punkte anklickst, weiterverfolgst oder vertiefst, erscheinen sie hier. Wechsle auf «Alle», um das Kollektiv zu sehen."
            : ansicht === "bekannt"
              ? "Noch keine Bekanntheits-Bewertungen. Bewerte im «Teppich des Wandels», was dir bekannt war."
              : ansicht === "geklickt"
                ? "Noch keine Klicks gezählt. Sobald Punkte angeklickt werden, erscheinen hier die stärksten."
                : "Noch keine Daten. Sobald Inhalte weiterverfolgt oder vertieft werden, erscheinen hier die stärksten."}
        </p>
      ) : (
        /* `grid-cols-1` ist hier nicht Zierde: Ohne Spaltenangabe ist die
           implizite Spalte «auto», also so breit wie ihr längster Inhalt — und
           seit die Bildpunkte ihre vollen Titel tragen, schob das die Liste
           samt Punktwolke aus dem Bild (auf 412 px: 657 px Dokumentbreite).
           Tailwinds `grid-cols-1` heisst `minmax(0, 1fr)` und darf darum
           schrumpfen, womit das `truncate` der Titel wieder greift. */
        <div className="mt-md grid grid-cols-1 items-center gap-lg lg:grid-cols-[minmax(0,1fr)_20rem]">
          {/* Punktwolke */}
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="block w-full"
            /* `role="group"`, nicht `role="img"`: Seit die Punkte Links sind,
               enthält die Grafik bedienbare Elemente. Ein `role="img"` würde sie
               als EIN Bild ausgeben und die Links verschweigen. Wer vorlesen
               lässt, findet dieselben Ziele ohnehin in der Rangliste darunter —
               dort als gewöhnliche Links mit Text. */
            role="group"
            aria-label={`Punktwolke: ${gefiltert.length} Inhalte, Grösse nach Stärke (${aktInfo.label}, ${ebene === "du" ? "nur ich" : "alle"}). Jeder Punkt führt zu seinem Abschnitt.`}
          >
            {sichtbar.map((p, i) => {
              const r = 3 + 13 * Math.sqrt(p.staerke / maxStaerke);
              const rad = 13 * Math.sqrt(i);
              const x = CENTER.x + rad * Math.cos(i * GOLDWINKEL);
              const y = CENTER.y + rad * Math.sin(i * GOLDWINKEL);
              const href = hrefFuer(p.id);
              /* Der Bereich steckt seit 2026-08-08 schon vorne im Titel — hier
                 nicht noch einmal anhängen, sonst «Epochen · Antike · … · Epochen». */
              const beschriftung = `${p.titel}${
                ansicht === "bekannt" ? "" : ` · alle ${p.alle}`
              }${p.du ? " · du" : ""}`;
              const inhalt = (
                <>
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
                  {/* Unsichtbare, grössere Trefferfläche: Die kleinsten Punkte
                      haben Radius 3, das trifft man mit dem Finger nicht. */}
                  {href && <circle cx={x} cy={y} r={Math.max(r + 6, 12)} fill="transparent" />}
                  <title>{beschriftung}</title>
                </>
              );
              /* Ohne Adresse (unbekanntes Präfix) bleibt der Punkt ein Punkt —
                 lieber nicht klickbar als ins Leere führend. */
              if (!href) return <g key={p.id}>{inhalt}</g>;
              return (
                <a
                  key={p.id}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(href);
                  }}
                  aria-label={`Zum Abschnitt: ${beschriftung}`}
                  className="cursor-pointer outline-none focus-visible:opacity-70"
                >
                  {inhalt}
                </a>
              );
            })}
          </svg>

          {/* Rangliste (Top 10) */}
          <ol className="flex flex-col gap-xs">
            {top.map((p, i) => (
              <li key={p.id} className="flex items-start gap-sm">
                <span
                  className="w-5 flex-shrink-0 text-right text-label-sm text-on-surface-variant"
                  style={{ fontFamily: "ui-monospace, monospace" }}
                >
                  {i + 1}
                </span>
                <span className={"mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full " + p.area.fill.replace("fill-", "bg-")} />
                {/* Titel + kleines «du»-Häkchen direkt daneben (nicht in der Zahlenspalte) */}
                <span className="flex min-w-0 flex-1 items-start gap-xs">
                  {/* Der Titel ist ein Link zum Abschnitt. In der Liste ein echtes
                      `a` (Rechtsklick, neuer Tab, Tastatur), im Bild oben nur eine
                      Klickfläche — dort wäre ein Link pro Punkt nicht auffindbar. */}
                  <MaybeLink
                    href={hrefFuer(p.id)}
                    className={
                      /* Zwei Zeilen statt einer: Christof sah «Jetzt: Umwelt & KI ·
                         Phil…» und konnte nicht erkennen, welcher Punkt gemeint war.
                         Titel wie «Antike · Raffaels Fresko ‹Die Schule von Athen›»
                         passen nie in eine Zeile dieser Spalte. `title` bleibt für
                         den ganz langen Fall. */
                      "line-clamp-2 text-body-sm " +
                      (p.du ? "font-medium text-on-surface" : "text-on-surface")
                    }
                    titel={p.titel}
                  >
                    {p.titel}
                  </MaybeLink>
                  {p.du && (
                    <span
                      className="material-symbols-outlined mt-0.5 flex-shrink-0 text-[15px] text-tertiary"
                      title="von dir angeklickt"
                      aria-label="von dir angeklickt"
                    >
                      check_circle
                    </span>
                  )}
                </span>
                {/* Zahlenspalte: fixe Breite, rechtsbündig */}
                <span
                  className="w-16 flex-shrink-0 pt-0.5 text-right text-label-sm text-on-surface-variant"
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
