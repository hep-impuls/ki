"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  leseSpuren,
  loescheSpur,
  loescheSpuren,
  merkeSpur,
  migriereIndexSpuren,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";
import { migriereIndexGewichtungen } from "../_lib/gewichtung";
import KartenAktion from "./KartenAktion";
import GewichtungWahl from "./GewichtungWahl";
import { GlossarText } from "./Glossar";
import { maschen as berechneMaschen, zaehleGefuellt } from "../_lib/flaechen";
import { melde } from "../_lib/auswertung";
import { merkeInhalt } from "../_lib/inhalte";
import SammelAccordion from "./SammelAccordion";
import SpurZeichen, { SpurZeichenLegende } from "./SpurZeichen";
import { zieheGewichtungAusCloud } from "../_lib/gewichtung";

/**
 * HistorienTeppich («Teppich des Wandels») — vier Fäden durch die Geschichte:
 * Technologie, Entdeckungen, gesellschaftliche Ereignisse und kulturelle
 * Praxen. Die Punkte sind sichtbar;
 * die Fäden weben sich erst durchs Anklicken ein (ein Fadensegment erscheint,
 * sobald beide Endpunkte besucht sind). Die Fäden kreuzen sich zwischendurch,
 * laufen aber auch allein. Karten der besuchten Punkte bleiben unten stehen.
 * Pro Punkt ist ein optionaler «Verunsicherungs-Stopp» vorgesehen
 * (Feld `verunsicherung` — Inhalte folgen). Nur Theme-Tokens (drei
 * Token-Farben für die drei Fäden) und Material Symbols.
 */

export type FadenArt = "technologie" | "entdeckungen" | "ereignisse" | "praxen";

export interface TeppichPunkt {
  /** Stabile Spur-Kennung, NIE ändern und NIE durch den Array-Index ersetzen.
   *  Als die Spuren noch am Index hingen, verschob jeder mitten im Array
   *  eingefügte Punkt die gespeicherten Spuren aller Nutzer, und ein neuer
   *  Punkt an einem belegten Index zählte nie (Rhizom-Meldung Christof,
   *  2026-08-17). Wer einen Punkt entfernt, lässt dessen Slug für immer
   *  unbenutzt. */
  slug: string;
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

/**
 * Zeichenfläche. Beide Masse sind gewachsen, weil der Teppich zu eng geknüpft
 * war: zuerst die Höhe von 300 auf 380, dann die Breite von 720 auf 1020
 * (Christofs Rückmeldungen 2026-08-10).
 *
 * Warum das Seitenverhältnis mitwächst: `preserveAspectRatio="none"` streckt
 * den viewBox auf die Box, die das Seitenverhältnis vorgibt. Stimmen die beiden
 * nicht überein, werden Schrift und Punkte verzerrt. Darum stehen `W`, die
 * viewBox-Höhe `H + RAND_UNTEN` und die Klasse `aspect-[1020/392]` immer im
 * gleichen Verhältnis (siehe `RAND_UNTEN` unten).
 *
 * Und warum die Breite nicht allein genügte: Ein grösserer viewBox in derselben
 * Box ist nur ein Verkleinern, die Beschriftungen schrumpfen mit und die Enge
 * bleibt. Umgekehrt ist eine breitere Box allein nur ein Vergrössern, dann
 * wachsen die Beschriftungen mit und die Enge bleibt ebenfalls. Raum entsteht
 * erst, wenn beides zusammen wächst: Die Zeichnung liegt mit `MIN_BREITE`
 * breiter als die Spalte, in einem seitwärts verschiebbaren Rahmen. Der
 * Teppich wird also wörtlich ausgerollt. Im Druck fällt das weg, dort muss er
 * ganz auf die Seite.
 */
const W = 1020;
const H = 380;
const X_STRECKUNG = W / 720;
const Y_STRECKUNG = H / 300;

/**
 * Luft unter dem Gewebe. `H` ist die Fläche, auf die die Punkte gerechnet
 * werden, ein Punkt bei `y: 300` landet also genau auf 380 und damit auf der
 * Kante. Sein Punkt hat aber einen Radius von 5 bis 6,5 und einen Ring von 9
 * bis 10, die untere Hälfte lag darum ausserhalb und war abgeschnitten
 * (Christofs Rückmeldung 2026-08-16, betroffen waren «Afrikas Bibliotheken»
 * und «Radio und Fernsehen»).
 *
 * Darum wächst der viewBox nach unten, ohne dass sich ein Punkt bewegt und
 * ohne dass etwas neu skaliert wird: `Y_STRECKUNG` bleibt an `H` hängen, die
 * Zeichenfläche ist `H + RAND_UNTEN` hoch. Ein Punkt auf der Kante hat damit
 * 12 Einheiten Platz und liegt ganz im Bild.
 *
 * ACHTUNG, drei Zahlen müssen zusammenpassen: `W`, `H + RAND_UNTEN` und die
 * Klasse `aspect-[1020/392]` weiter unten. Die Klasse muss wörtlich im Code
 * stehen, weil Tailwind die Namen im Quelltext sucht und einen zusammengesetzten
 * String nicht findet. Wer `H` oder `RAND_UNTEN` ändert, ändert sie mit, sonst
 * streckt `preserveAspectRatio="none"` die Zeichnung.
 */
const RAND_UNTEN = 12;

/**
 * Wie breit die Zeichnung mindestens liegt. 1320 Pixel bei einem viewBox von
 * 1020 heisst: rund 1,3 Pixel pro Einheit, gleich viel wie vorher in der Spalte
 * von 929 Pixeln bei 720 Einheiten. Die Schrift bleibt also gleich gross, und
 * der gewonnene Platz liegt vollständig zwischen den Knoten.
 */
const MIN_BREITE = "min-w-[1020px] sm:min-w-[1320px]";

const FADEN_META: Record<
  FadenArt,
  {
    label: string;
    strich: string;
    punkt: string;
    chip: string;
    /** Randfarbe des kleinen Fensters (und des Pfeils daran). */
    rand: string;
    /** Textfarbe für Badge und Zeichenleiste. */
    text: string;
    /** Voll eingewobener Legende-Chip. */
    chipAktiv: string;
  }
> = {
  technologie: {
    label: "Technologie",
    strich: "stroke-tertiary",
    punkt: "fill-tertiary",
    chip: "bg-tertiary",
    rand: "border-tertiary",
    text: "text-tertiary",
    chipAktiv: "border-tertiary bg-tertiary text-on-tertiary",
  },
  entdeckungen: {
    label: "Entdeckungen",
    strich: "stroke-secondary",
    punkt: "fill-secondary",
    chip: "bg-secondary",
    rand: "border-secondary",
    text: "text-secondary",
    chipAktiv: "border-secondary bg-secondary text-on-secondary",
  },
  ereignisse: {
    label: "Gesellschaftliche Ereignisse",
    strich: "stroke-primary",
    punkt: "fill-primary",
    chip: "bg-primary",
    rand: "border-primary",
    text: "text-primary",
    chipAktiv: "border-primary bg-primary text-on-primary",
  },
  praxen: {
    label: "Kulturelle Praxen",
    strich: "stroke-error",
    punkt: "fill-error",
    chip: "bg-error",
    rand: "border-error",
    text: "text-error",
    chipAktiv: "border-error bg-error text-on-error",
  },
};

/** Halbe Breite des kleinen Fensters (px im Wrapper), fürs Einklemmen am Rand. */
const FENSTER_HALB = 150;

/** Ab dieser Breite hängt das Fenster am Punkt, darunter liegt es als Leiste unten. */
const BREIT_AB = "(min-width: 640px)";

function useBreit(): boolean {
  const [breit, setBreit] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(BREIT_AB);
    const setze = () => setBreit(mq.matches);
    setze();
    mq.addEventListener("change", setze);
    return () => mq.removeEventListener("change", setze);
  }, []);
  return breit;
}

/** Was gerade im kleinen Fenster steht (Punkt-Index bzw. Faden + Klickstelle). */
type Fenster =
  | { art: "punkt"; i: number }
  | { art: "faden"; faden: FadenArt; anker: { x: number; y: number } | null; neu: number };

/**
 * Rahmen des kleinen Fensters — nach Christofs Ernährungs-Teppich (5.9.2026).
 * Mit Anker (Gewebe-Koordinaten) hängt es am Punkt, mit Pfeil, seitlich in den
 * sichtbaren Scroll-Ausschnitt eingeklemmt; ohne Anker steht es unter der
 * Legende. Auf schmalen Bildschirmen liegt es als Leiste über dem unteren Rand.
 */
function FensterRahmen({
  anker,
  breit,
  wrapperBreite,
  sicht,
  randKlasse,
  beschriftung,
  onClose,
  children,
}: {
  anker: { x: number; y: number } | null;
  breit: boolean;
  wrapperBreite: number;
  /** Sichtbarer Ausschnitt des seitlich scrollbaren Gewebes, in Wrapper-Pixeln. */
  sicht: { links: number; rechts: number } | null;
  randKlasse: string;
  beschriftung: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const inhalt = (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fenster schliessen"
        className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
      {children}
    </>
  );

  if (!breit) {
    return (
      <div
        role="dialog"
        aria-label={beschriftung}
        className={`fixed inset-x-2 bottom-20 z-[60] rounded-xl border bg-surface-bright p-md pr-10 shadow-xl animate-frame-in md:bottom-4 ${randKlasse}`}
        onClick={(e) => e.stopPropagation()}
      >
        {inhalt}
      </div>
    );
  }

  if (!anker) {
    return (
      <div
        role="dialog"
        aria-label={beschriftung}
        className={`relative mb-sm w-full max-w-md rounded-xl border bg-surface-bright p-md pr-10 shadow-lg animate-frame-in ${randKlasse}`}
      >
        {inhalt}
      </div>
    );
  }

  /* Am Punkt: unter dem Punkt öffnen, wenn er oben liegt, sonst darüber.
     Seitlich bleibt das Fenster im sichtbaren Ausschnitt, sonst müsste man
     erst scrollen, um es zu lesen. */
  const px = (anker.x / W) * wrapperBreite;
  const lo = Math.max(FENSTER_HALB, (sicht?.links ?? 0) + FENSTER_HALB);
  const hi = Math.min(wrapperBreite - FENSTER_HALB, (sicht?.rechts ?? wrapperBreite) - FENSTER_HALB);
  const mitte = hi < lo ? px : Math.max(lo, Math.min(hi, px));
  // Linke Kante rechnerisch, kein translateX: animate-frame-in setzt transform.
  const left = mitte - FENSTER_HALB;
  const pfeilX = Math.max(14, Math.min(FENSTER_HALB * 2 - 14, px - left));
  const obenProzent = (anker.y / (H + RAND_UNTEN)) * 100;
  const darueber = anker.y > H / 2;
  return (
    <div
      role="dialog"
      aria-label={beschriftung}
      className={`absolute z-30 w-[300px] rounded-xl border bg-surface-bright p-md pr-10 shadow-xl animate-frame-in ${randKlasse}`}
      style={{
        left,
        ...(darueber
          ? { bottom: `calc(${100 - obenProzent}% + 16px)` }
          : { top: `calc(${obenProzent}% + 16px)` }),
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Pfeil zum Punkt — gleiche Randklasse wie der Rahmen */}
      <span
        aria-hidden
        className={
          `absolute h-3 w-3 rotate-45 bg-surface-bright ${randKlasse} ` +
          (darueber ? "border-b border-r" : "border-l border-t")
        }
        style={{ left: pfeilX - 6, ...(darueber ? { bottom: -7 } : { top: -7 }) }}
      />
      {inhalt}
    </div>
  );
}

/** Weiches Fadensegment zwischen zwei Punkten (horizontal gespannte Kurve). */
function segmentPfad(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  return `M${a.x} ${a.y} C${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

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

export default function HistorienTeppich({
  punkte: punkteRoh,
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
  /* Die Punkte auf die gewachsene Fläche ziehen. Alles Weitere (Maschen, Fäden,
     Beschriftungen) rechnet mit diesen Punkten, also genügt die eine Stelle.
     Die Daten selbst bleiben im ursprünglichen 720×300-Raster stehen. */
  const punkte = useMemo(
    () =>
      punkteRoh.map((p) => ({
        ...p,
        x: Math.round(p.x * X_STRECKUNG),
        y: Math.round(p.y * Y_STRECKUNG),
      })),
    [punkteRoh],
  );
  const n = punkte.length;
  /** Spur-Kennung eines Punkts — der Slug, nie der Index (siehe TeppichPunkt). */
  const spurId = (i: number) => `${spurKey}:${punkte[i].slug}`;
  const slugZuIndex = useMemo(
    () => new Map(punkte.map((p, i) => [p.slug, i] as const)),
    [punkte],
  );
  /* Der Teppich liegt breiter als die Spalte. Ob er wirklich übersteht, hängt
     vom Fenster ab, darum wird gemessen statt geraten, und bei jeder
     Grössenänderung neu. */
  const rahmen = useRef<HTMLDivElement | null>(null);
  const [ragtUeber, setRagtUeber] = useState(false);
  useEffect(() => {
    const el = rahmen.current;
    if (!el) return;
    const pruefe = () => setRagtUeber(el.scrollWidth > el.clientWidth + 4);
    pruefe();
    const beobachter = new ResizeObserver(pruefe);
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, []);
  // Gewebe-Maschen: Delaunay-Dreiecke über die Punkte; nur nicht zu grosse
  // (lokale) Maschen füllen den Teppich, wenn alle drei Ecken besucht sind.
  const maschen = useMemo(
    () => berechneMaschen(punkte.map((p) => ({ x: p.x, y: p.y }))),
    [punkte],
  );
  const [besucht, setBesucht] = useState<Set<number>>(new Set());
  const [reihenfolge, setReihenfolge] = useState<number[]>([]);
  /** Welche Detail-Karte ist aufgeklappt (Accordion; null = keine). */
  const [offeneKarte, setOffeneKarte] = useState<number | null>(null);
  /** Das kleine Fenster am Punkt bzw. zum Faden (Ernährungs-Muster, 5.9.2026). */
  const [fenster, setFenster] = useState<Fenster | null>(null);
  /** Faden unter der Maus — betont die gestrichelte Vorschau. */
  const [hoverFaden, setHoverFaden] = useState<FadenArt | null>(null);
  /** Karte, zu der gerade gesprungen wurde (kurz hervorgehoben). */
  const [hervor, setHervor] = useState<string | null>(null);
  const [sprung, setSprung] = useState<{ slug: string; n: number } | null>(null);
  /** Sortierung der Sammelliste: Besuchsreihenfolge oder Lage im Teppich. */
  const [sortierung, setSortierung] = useState<"besucht" | "zeit">("besucht");
  const [wrapperBreite, setWrapperBreite] = useState(W);
  /** Sichtbarer Ausschnitt des scrollbaren Gewebes, in Wrapper-Pixeln. */
  const [sicht, setSicht] = useState<{ links: number; rechts: number } | null>(null);
  /** Vertieft/weiterverfolgt je Slug — für die Zeichenleiste der Karten. */
  const [mehrSlugs, setMehrSlugs] = useState<Set<string>>(new Set());
  const [wunschSlugs, setWunschSlugs] = useState<Set<string>>(new Set());
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const hervorTimer = useRef<number | null>(null);
  const breit = useBreit();
  // Zuletzt geöffnete Karte über Navigation/Neuladen/Zuklappen hinweg merken.
  const offenKey = spurKey ? `ki26-teppich-offen:${spurKey}` : null;
  const gespeichertOffen = useRef<number | null>(
    (() => {
      if (!offenKey || typeof window === "undefined") return null;
      const v = window.localStorage.getItem(offenKey);
      if (v === null || v === "") return null;
      // Gespeichert wird der Slug; ältere Stände trugen den Index.
      const bySlug = slugZuIndex.get(v);
      if (bySlug !== undefined) return bySlug;
      const num = Number(v);
      return Number.isInteger(num) && num >= 0 && num < n ? num : null;
    })(),
  );
  const ersterSave = useRef(true);
  useEffect(() => {
    // Bereits offene, noch gültige Karte behalten (z.B. nach Cloud-Nachzug);
    // sonst die zuletzt geöffnete (gespeicherte); sonst die neueste.
    setOffeneKarte((cur) => {
      if (!reihenfolge.length) return null;
      if (cur !== null && reihenfolge.includes(cur)) return cur;
      const g = gespeichertOffen.current;
      if (g !== null && reihenfolge.includes(g)) return g;
      return reihenfolge[reihenfolge.length - 1];
    });
  }, [reihenfolge]);
  useEffect(() => {
    // Offene Karte sichern, aber nicht schon beim initialen null-Wert.
    if (ersterSave.current) {
      ersterSave.current = false;
      return;
    }
    if (!offenKey || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        offenKey,
        offeneKarte === null ? "" : punkte[offeneKarte].slug,
      );
    } catch {
      /* Privatmodus */
    }
  }, [offeneKarte]);
  /* Kein Merker für abgewählte Punkte mehr: Ein Abwählen LÖSCHT die Spur
     (Entscheid Christof, 2026-08-10), und eine gelöschte Spur kann der Restore
     nicht zurückbringen. Vorher stand hier ein `useRef`, der den Seitenwechsel
     nicht überstand, weshalb ausgeschaltete Fäden wieder auftauchten. */

  /* Die Bewertungs-Präfixe für die Migration über einen Ref lesen: `bewertungen`
     ist bei jedem Render ein neues Array-Literal und gehört darum nicht in die
     Abhängigkeiten des Restore-Effekts. */
  const bewertungenRef = useRef(bewertungen);
  bewertungenRef.current = bewertungen;

  /** Sichtbaren Ausschnitt des scrollbaren Gewebes messen (Wrapper-Pixel). */
  function messeSicht() {
    const c = rahmen.current;
    const w = wrapperRef.current;
    if (!c || !w) return;
    const links = c.getBoundingClientRect().left - w.getBoundingClientRect().left;
    setSicht({ links, rechts: links + c.clientWidth });
  }

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const messe = () => {
      setWrapperBreite(el.clientWidth || W);
      messeSicht();
    };
    messe();
    const beobachter = new ResizeObserver(messe);
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, []);

  // Escape schliesst das kleine Fenster.
  useEffect(() => {
    if (!fenster) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFenster(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fenster]);

  // «Zum Text»: zur Karte scrollen und sie kurz hervorheben.
  useEffect(() => {
    if (!sprung) return;
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document
      .getElementById(`karte-${sprung.slug}`)
      ?.scrollIntoView({ behavior: ruhig ? "auto" : "smooth", block: "start" });
    setHervor(sprung.slug);
    if (hervorTimer.current) window.clearTimeout(hervorTimer.current);
    hervorTimer.current = window.setTimeout(() => setHervor(null), 2600);
  }, [sprung]);

  useEffect(() => {
    const slugs = punkte.map((p) => p.slug);
    function restore() {
      // Alt-Spuren (Index-Kennungen) zuerst in die Slug-Form bringen — auch
      // nach jedem Cloud-Nachzug, der numerische Kennungen zurückbringen kann.
      migriereIndexSpuren(spurKey, slugs);
      migriereIndexGewichtungen(bewertungenRef.current.map((b) => b.prefix), slugs);
      const praefix = `${spurKey}:`;
      const mehrPraefix = `mehr:${spurKey}:`;
      const wunschPraefix = `wunsch:${wunschKey ?? spurKey}:`;
      const alle = leseSpuren();
      // Vertieft/weiterverfolgt für die Zeichenleiste — immer setzen, auch
      // wenn (noch) kein Punkt besucht ist.
      setMehrSlugs(new Set(alle.filter((s) => s.id.startsWith(mehrPraefix)).map((s) => s.id.slice(mehrPraefix.length))));
      setWunschSlugs(new Set(alle.filter((s) => s.id.startsWith(wunschPraefix)).map((s) => s.id.slice(wunschPraefix.length))));
      const idx = alle
        .filter((s) => s.id.startsWith(praefix))
        .map((s) => slugZuIndex.get(s.id.slice(praefix.length)))
        .filter((i): i is number => i !== undefined);
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
    // Auch der Gewichtungs-Nachzug kann numerische Alt-Schlüssel bringen —
    // er feuert nur GEWICHT_EVENT, darum hier ausdrücklich nachmigrieren.
    void zieheGewichtungAusCloud().then(() =>
      migriereIndexGewichtungen(bewertungenRef.current.map((b) => b.prefix), slugs),
    );
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [spurKey, wunschKey, n, punkte, slugZuIndex]);

  /**
   * Antippen webt den Punkt ein und öffnet das kleine Fenster am Punkt;
   * nochmaliges Antippen schliesst nur das Fenster. Abwählen geht seit dem
   * Ernährungs-Muster (5.9.2026) nur noch bewusst über den Knopf im Fenster —
   * vorher wählte der zweite Klick still ab, und wer nur nochmals lesen
   * wollte, verlor den Punkt.
   */
  function punktKlick(i: number) {
    if (!besucht.has(i)) {
      setBesucht((prev) => new Set(prev).add(i));
      setReihenfolge((prev) => (prev.includes(i) ? prev : [...prev, i]));
      merkeSpur(spurId(i));
    }
    // Zuletzt angeklickter Punkt → sein Accordion unten ist offen.
    setOffeneKarte(i);
    messeSicht();
    setFenster((f) => (f?.art === "punkt" && f.i === i ? null : { art: "punkt", i }));
  }

  /** Bewusstes Abwählen aus dem Fenster heraus. */
  function abwaehlen(i: number) {
    loescheSpur([spurId(i)]);
    setBesucht((prev) => {
      const nx = new Set(prev);
      nx.delete(i);
      return nx;
    });
    setReihenfolge((prev) => prev.filter((x) => x !== i));
    setOffeneKarte((o) => (o === i ? null : o));
    setFenster(null);
  }

  /** Merkzeichen im Fenster — dieselbe Spur wie der Knopf in der Karte. */
  function wunschImFenster(i: number) {
    const slug = punkte[i].slug;
    const id = `wunsch:${wunschKey ?? spurKey}:${slug}`;
    if (wunschSlugs.has(slug)) {
      loescheSpuren(id);
    } else {
      merkeInhalt(`${wunschKey ?? spurKey}:${slug}`, punkte[i].titel);
      merkeSpur(id);
    }
  }

  /** Fenster zu, Karte unten öffnen und hinscrollen. */
  function springeZu(i: number) {
    setOffeneKarte(i);
    setFenster(null);
    setSprung({ slug: punkte[i].slug, n: Date.now() });
  }

  /** Klickstelle im Gewebe in viewBox-Koordinaten (preserveAspectRatio none). */
  function gewebeKoord(e: React.MouseEvent): { x: number; y: number } | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    return {
      x: ((e.clientX - r.left) / r.width) * W,
      y: ((e.clientY - r.top) / r.height) * (H + RAND_UNTEN),
    };
  }

  /** Indizes eines Fadens, in Teppich-Reihenfolge (nach x). */
  function fadenIdx(art: FadenArt): number[] {
    return punkte
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.faden === art)
      .sort((a, b) => a.p.x - b.p.x)
      .map(({ i }) => i);
  }

  /**
   * Linie oder Legende-Chip: ganzen Faden EINweben (alle Punkte zählen) und
   * das Faden-Fenster öffnen. `anker` ist die Klickstelle im Gewebe; ohne
   * Anker (Legende) steht das Fenster unter den Chips. Herausziehen geht nur
   * noch bewusst über den Knopf im Fenster, nicht mehr still per zweitem Klick.
   */
  function fadenKlick(art: FadenArt, anker: { x: number; y: number } | null) {
    const idx = fadenIdx(art);
    const fehlend = idx.filter((i) => !besucht.has(i));
    fehlend.forEach((i) => merkeSpur(spurId(i)));
    if (fehlend.length > 0) {
      setBesucht((prev) => {
        const nx = new Set(prev);
        fehlend.forEach((i) => nx.add(i));
        return nx;
      });
      setReihenfolge((prev) => [...prev, ...fehlend.filter((i) => !prev.includes(i))]);
    }
    messeSicht();
    setFenster((f) =>
      f?.art === "faden" && f.faden === art && !anker && !f.anker
        ? null
        : { art: "faden", faden: art, anker, neu: fehlend.length },
    );
  }

  /** Faden bewusst wieder herausziehen (aus dem Fenster heraus). */
  function fadenHerausziehen(art: FadenArt) {
    const idx = fadenIdx(art);
    loescheSpur(idx.map(spurId));
    setBesucht((prev) => {
      const nx = new Set(prev);
      idx.forEach((i) => nx.delete(i));
      return nx;
    });
    setReihenfolge((prev) => prev.filter((x) => !idx.includes(x)));
    setOffeneKarte((o) => (o !== null && idx.includes(o) ? null : o));
    setFenster(null);
  }

  function zuruecksetzen() {
    loescheSpuren(spurKey);
    if (offenKey) {
      try {
        window.localStorage.removeItem(offenKey);
      } catch {
        /* Privatmodus */
      }
    }
    gespeichertOffen.current = null;
    setBesucht(new Set());
    setReihenfolge([]);
    setOffeneKarte(null);
    setFenster(null);
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

  // Flächen-Bilanz + gewählte Titel ans Orakel melden.
  useEffect(() => {
    const labels = reihenfolge
      .filter((i) => besucht.has(i))
      .map((i) => punkte[i]?.kurz)
      .filter((s): s is string => Boolean(s));
    melde(spurKey, {
      bereich: "Der Teppich des Wandels",
      flaechenGefuellt: zaehleGefuellt(maschen, besucht),
      flaechenTotal: maschen.length,
      labels,
    });
  }, [besucht, reihenfolge, maschen, spurKey, punkte]);

  // Alle Titel registrieren (auch unbesuchte) — für die Sternenkarte im Orakel.
  useEffect(() => {
    punkte.forEach((p) =>
      merkeInhalt(`${wunschKey ?? spurKey}:${p.slug}`, p.titel),
    );
  }, [punkte, spurKey, wunschKey]);

  const alleBesucht = besucht.size === n;
  const gefuellt = zaehleGefuellt(maschen, besucht);

  /** Faden des offenen Fensters — färbt Rahmen, Pfeil und Betonung der Linie. */
  const fensterFaden: FadenArt | null =
    fenster?.art === "faden" ? fenster.faden : fenster?.art === "punkt" ? punkte[fenster.i].faden : null;

  const fensterBeschriftung = !fenster
    ? ""
    : fenster.art === "punkt"
      ? `Punkt: ${punkte[fenster.i].titel}`
      : `Faden: ${FADEN_META[fenster.faden].label}`;

  /** Inhalt des kleinen Fensters, je nach Art (Punkt oder ganzer Faden). */
  function fensterInhalt() {
    if (!fenster) return null;
    if (fenster.art === "punkt") {
      const p = punkte[fenster.i];
      const meta = FADEN_META[p.faden];
      const wunsch = wunschSlugs.has(p.slug);
      return (
        <>
          <span
            className={`inline-block max-w-full truncate rounded-full border px-sm py-[2px] text-label-sm font-semibold ${meta.rand} ${meta.text}`}
          >
            {meta.label}
          </span>
          <p className="mt-xs text-body-md font-semibold leading-snug text-on-surface">
            {p.titel}{" "}
            <span className="whitespace-nowrap font-normal text-on-surface-variant">{p.jahr}</span>
          </p>
          <p className="mt-[3px] line-clamp-3 text-body-sm leading-snug text-on-surface-variant">
            {p.text}
          </p>
          <div className="mt-sm flex flex-wrap items-center gap-xs">
            <button
              type="button"
              onClick={() => springeZu(fenster.i)}
              className="inline-flex items-center gap-xs rounded-full bg-primary px-md py-xs text-label-md font-semibold text-on-primary transition-colors hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              Zum Text
            </button>
            <button
              type="button"
              onClick={() => wunschImFenster(fenster.i)}
              aria-pressed={wunsch}
              aria-label={wunsch ? "Wird weiterverfolgt" : "Das verfolge ich weiter"}
              title={wunsch ? "Wird weiterverfolgt" : "Das verfolge ich weiter"}
              className={
                "grid h-8 w-8 place-items-center rounded-full border transition-colors " +
                (wunsch
                  ? "border-tertiary bg-tertiary-container text-on-tertiary-container"
                  : "border-outline-variant text-on-surface-variant hover:border-tertiary hover:text-tertiary")
              }
            >
              <span className="material-symbols-outlined text-[17px]">
                {wunsch ? "bookmark_added" : "bookmark_add"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => abwaehlen(fenster.i)}
              className="ml-auto inline-flex items-center gap-[3px] rounded-full px-sm py-xs text-label-sm text-on-surface-variant transition-colors hover:text-error"
            >
              <span className="material-symbols-outlined text-[15px]">undo</span>
              Abwählen
            </button>
          </div>
        </>
      );
    }
    const meta = FADEN_META[fenster.faden];
    const idx = fadenIdx(fenster.faden);
    const erster = punkte[idx[0]];
    const letzter = punkte[idx[idx.length - 1]];
    return (
      <>
        <span
          className={`inline-block max-w-full truncate rounded-full border px-sm py-[2px] text-label-sm font-semibold ${meta.rand} ${meta.text}`}
        >
          {meta.label}
        </span>
        <p className="mt-xs text-body-md font-semibold leading-snug text-on-surface">
          {idx.length} Punkte, {erster.jahr} bis {letzter.jahr}
        </p>
        <p className="mt-[3px] text-body-sm leading-snug text-on-surface-variant">
          {fenster.neu > 0
            ? `Der ganze Faden ist eingewoben, ${
                fenster.neu === idx.length
                  ? "alle Punkte zählen jetzt"
                  : fenster.neu === 1
                    ? "ein weiterer Punkt zählt jetzt"
                    : `${fenster.neu} weitere Punkte zählen jetzt`
              }. Der erste Text: «${erster.titel}».`
            : `Dieser Faden ist schon ganz eingewoben. Der erste Text: «${erster.titel}».`}
        </p>
        <div className="mt-sm flex flex-wrap items-center gap-xs">
          <button
            type="button"
            onClick={() => springeZu(idx[0])}
            className="inline-flex items-center gap-xs rounded-full bg-primary px-md py-xs text-label-md font-semibold text-on-primary transition-colors hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
            Zum ersten Text
          </button>
          <button
            type="button"
            onClick={() => fadenHerausziehen(fenster.faden)}
            className="ml-auto inline-flex items-center gap-[3px] rounded-full px-sm py-xs text-label-sm text-on-surface-variant transition-colors hover:text-error"
          >
            <span className="material-symbols-outlined text-[15px]">undo</span>
            Faden herausziehen
          </button>
        </div>
      </>
    );
  }

  return (
    <section aria-label="Teppich des Wandels" className={className}>
      <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
        <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] text-tertiary">
            {alleBesucht ? "done_all" : "touch_app"}
          </span>
          {besucht.size === 0
            ? "Tippe einen Punkt oder eine Linie an, die Fäden weben sich ein"
            : `${besucht.size} von ${n} Punkten besucht · ${gefuellt} von ${maschen.length} Maschen geknüpft`}
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

      {/* Legende — pro Faden ein Chip: Klick webt den ganzen Faden ein und
          öffnet das Faden-Fenster (Sprung zum ersten Text, Herausziehen). */}
      <div className="mb-sm flex flex-wrap items-center gap-sm">
        {(Object.keys(FADEN_META) as FadenArt[]).map((art) => {
          const idx = fadenIdx(art);
          const anz = idx.filter((i) => besucht.has(i)).length;
          const alleAn = idx.length > 0 && anz === idx.length;
          return (
            <button
              key={art}
              type="button"
              onClick={() => fadenKlick(art, null)}
              aria-pressed={alleAn}
              title={
                alleAn
                  ? "Faden ist ganz eingewoben. Klicken für den Sprung zum ersten Text oder zum Herausziehen"
                  : "Ganzen Faden einweben, alle seine Punkte zählen"
              }
              className={
                "flex items-center gap-xs rounded-full border px-sm py-xs text-label-sm transition-colors " +
                (alleAn
                  ? FADEN_META[art].chipAktiv
                  : "border-outline-variant bg-surface-bright text-on-surface-variant hover:bg-surface-container hover:text-on-surface")
              }
            >
              <span
                className={
                  "inline-block h-3 w-3 rounded-full " +
                  (alleAn ? "bg-surface-bright" : FADEN_META[art].chip)
                }
              />
              {FADEN_META[art].label}
              <span className="tabular-nums text-label-sm opacity-80">
                {anz}/{idx.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Faden-Fenster aus der Legende (ohne Anker) steht unter den Chips */}
      {fenster?.art === "faden" && !fenster.anker && breit && (
        <FensterRahmen
          anker={null}
          breit={breit}
          wrapperBreite={wrapperBreite}
          sicht={sicht}
          randKlasse={fensterFaden ? FADEN_META[fensterFaden].rand : "border-outline-variant"}
          beschriftung={fensterBeschriftung}
          onClose={() => setFenster(null)}
        >
          {fensterInhalt()}
        </FensterRahmen>
      )}

      {/* Der Teppich, seitwärts verschiebbar, damit er breiter liegt als die
          Spalte. Der Hinweis erscheint nur, wenn wirklich etwas verdeckt ist. */}
      <div
        ref={rahmen}
        onScroll={() => fenster && messeSicht()}
        className="overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-xl border border-outline-variant bg-surface-container-low/60 p-sm sm:p-md print:overflow-visible"
      >
        <div ref={wrapperRef} className={`relative ${MIN_BREITE} print:min-w-0`}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H + RAND_UNTEN}`}
          preserveAspectRatio="none"
          className="block w-full select-none aspect-[1020/392]"
          role="img"
          aria-label="Teppich des Wandels: vier Fäden (Technologie, Entdeckungen, gesellschaftliche Ereignisse und kulturelle Praxen) weben sich durchs Antippen von Punkten und Linien ein; zwischen besuchten Punkten füllen sich gemusterte Maschen."
          onClick={() => setFenster(null)}
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

          {/* Fadensegmente — unbesucht als gestrichelte Vorschau, besucht
              kräftig durchgezogen; der Faden unterm Zeiger oder im Fenster
              wird betont (Ernährungs-Muster, 5.9.2026) */}
          {faeden.map(({ art, idx }) => {
            const betont = hoverFaden === art || fensterFaden === art;
            return idx.slice(1).map((bIdx, k) => {
              const aIdx = idx[k];
              const sichtbar = besucht.has(aIdx) && besucht.has(bIdx);
              return (
                <path
                  key={`${art}-${k}`}
                  d={segmentPfad(punkte[aIdx], punkte[bIdx])}
                  fill="none"
                  strokeWidth={sichtbar ? 2.4 : betont ? 2 : 1.4}
                  strokeLinecap="round"
                  strokeDasharray={sichtbar ? undefined : "2 7"}
                  className={`${FADEN_META[art].strich} transition-all duration-700`}
                  opacity={sichtbar ? (betont ? 1 : 0.75) : betont ? 0.55 : 0.16}
                />
              );
            });
          })}

          {/* Unsichtbare, breite Klickflächen auf den Linien: ein Klick webt
              den ganzen Faden ein und öffnet das Faden-Fenster an der
              Klickstelle. Die Punkte liegen darüber und gewinnen. */}
          {faeden.map(({ art, idx }) =>
            idx.slice(1).map((bIdx, k) => {
              const aIdx = idx[k];
              const a = punkte[aIdx];
              const b = punkte[bIdx];
              return (
                <path
                  key={`hit-${art}-${k}`}
                  d={segmentPfad(a, b)}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="16"
                  strokeLinecap="round"
                  className="cursor-pointer"
                  style={{ pointerEvents: "stroke" }}
                  aria-hidden
                  onMouseEnter={() => setHoverFaden(art)}
                  onMouseLeave={() => setHoverFaden((h) => (h === art ? null : h))}
                  onClick={(e) => {
                    e.stopPropagation();
                    fadenKlick(art, gewebeKoord(e) ?? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
                  }}
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
            const fensterOffen = fenster?.art === "punkt" && fenster.i === i;
            return (
              <g
                key={i}
                role="button"
                tabIndex={0}
                aria-label={`${p.titel} (${p.jahr}). Antippen webt den Punkt ein und öffnet ein kleines Fenster mit dem Sprung zum Text`}
                aria-pressed={da}
                aria-expanded={fensterOffen}
                onClick={(e) => {
                  e.stopPropagation();
                  punktKlick(i);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    punktKlick(i);
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
                {fensterOffen && (
                  <circle
                    cx="0"
                    cy="0"
                    r="14"
                    fill="none"
                    strokeWidth="2"
                    className={meta.strich}
                    opacity="0.9"
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

        {/* Das kleine Fenster am Punkt bzw. an der Klickstelle auf der Linie */}
        {fenster && breit && (fenster.art === "punkt" || fenster.anker) && (
          <FensterRahmen
            anker={fenster.art === "punkt" ? { x: punkte[fenster.i].x, y: punkte[fenster.i].y } : fenster.anker}
            breit={breit}
            wrapperBreite={wrapperBreite}
            sicht={sicht}
            randKlasse={fensterFaden ? FADEN_META[fensterFaden].rand : "border-outline-variant"}
            beschriftung={fensterBeschriftung}
            onClose={() => setFenster(null)}
          >
            {fensterInhalt()}
          </FensterRahmen>
        )}
        </div>
      </div>

      {/* Auf schmalen Bildschirmen liegt jedes Fenster als Leiste unten */}
      {fenster && !breit && (
        <FensterRahmen
          anker={null}
          breit={false}
          wrapperBreite={wrapperBreite}
          sicht={sicht}
          randKlasse={fensterFaden ? FADEN_META[fensterFaden].rand : "border-outline-variant"}
          beschriftung={fensterBeschriftung}
          onClose={() => setFenster(null)}
        >
          {fensterInhalt()}
        </FensterRahmen>
      )}
      <p className="mt-xs text-label-sm text-on-surface-variant">
        {ragtUeber && (
          <span className="mr-xs inline-flex items-center gap-2xs text-tertiary print:hidden">
            <span className="material-symbols-outlined text-[16px]">swipe</span>
            Der Teppich liegt breiter als die Seite, seitwärts schieben zeigt den
            Rest.
          </span>
        )}
        Punkt antippen webt ihn ein und öffnet ein kleines Fenster mit dem
        Sprung zum Text. Eine gestrichelte Linie oder ein Chip der Legende webt
        den ganzen Faden ein. Abwählen und Herausziehen gehen bewusst über die
        Knöpfe im Fenster.
      </p>

      {/* Besuchte Punkte — bleiben stehen, in Besuchs-Reihenfolge */}
      <div aria-live="polite" className="mt-md">
        {reihenfolge.length === 0 ? (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-lg">
            <p className="flex items-start gap-sm text-body-md text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px] text-tertiary">explore</span>
              So geht es: Im Teppich liegen vier Fäden, gestrichelt
              angedeutet, nämlich Technologie, Entdeckungen, gesellschaftliche
              Ereignisse und kulturelle Praxen.
              Tippe einen Punkt an: Ein kleines Fenster springt zum Text und
              seine Geschichte erscheint hier. Sobald zwei benachbarte Punkte
              desselben Fadens besucht sind, wird das Fadenstück dazwischen
              kräftig. Eine gestrichelte Linie oder ein Chip der Legende webt
              den ganzen Faden auf einmal ein. Abwählen und Herausziehen gehen
              über die Knöpfe im jeweiligen Fenster. Die Fäden kreuzen sich
              zwischendurch und laufen auch allein.
            </p>
          </div>
        ) : (
          <>
          <div className="mb-sm flex flex-wrap items-center gap-sm">
            <p className="flex-1 text-label-md uppercase tracking-wider text-tertiary">
              Deine angeklickten Punkte
            </p>
            {/* Sortierung: eigene Besuchsreihenfolge oder Lage im Teppich.
                «Nach Zeit» sortiert nach der x-Position, denn die Jahres-
                Angaben reichen von «Jungsteinzeit» bis «1956 → 2022» und
                lassen sich nicht verlässlich als Zahl lesen — die gelegte
                Reihenfolge im Teppich IST die Chronologie. */}
            {(
              [
                { id: "besucht", label: "Nach Klick", icon: "footprint" },
                { id: "zeit", label: "Nach Zeit", icon: "timeline" },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSortierung(s.id)}
                aria-pressed={sortierung === s.id}
                className={
                  sortierung === s.id
                    ? "inline-flex items-center gap-xs rounded-full border border-tertiary bg-tertiary-container px-md py-xs text-label-md text-on-tertiary-container"
                    : "inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright px-md py-xs text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
                }
              >
                <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
          <SpurZeichenLegende className="mb-sm" />
          <ol className="flex flex-col gap-sm">
            {(sortierung === "besucht"
              ? reihenfolge
              : [...reihenfolge].sort((a, b) => punkte[a].x - punkte[b].x)
            ).map((idx) => {
              const pos = reihenfolge.indexOf(idx);
              const p = punkte[idx];
              const meta = FADEN_META[p.faden];
              const neuste = pos === reihenfolge.length - 1;
              return (
                <SammelAccordion
                  key={idx}
                  nr={pos + 1}
                  titel={p.titel}
                  jahr={p.jahr}
                  neuste={neuste}
                  id={`karte-${p.slug}`}
                  hervor={hervor === p.slug}
                  status={
                    <SpurZeichen
                      weitergelesen={mehrSlugs.has(p.slug)}
                      weiterverfolgt={wunschSlugs.has(p.slug)}
                      farbKlasse={meta.text}
                    />
                  }
                  offen={offeneKarte === idx}
                  onToggle={() => setOffeneKarte((o) => (o === idx ? null : idx))}
                >
                    <div className="min-w-0">
                      <p className="flex items-center gap-xs text-label-sm text-on-surface-variant">
                        <span className={`inline-block h-2.5 w-2.5 rounded-full ${meta.chip}`} />
                        {meta.label}
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
                        wunschId={`wunsch:${wunschKey ?? spurKey}:${p.slug}`}
                        titel={p.titel}
                      />
                      {bewertungen.length > 0 && (
                        <div className="mt-sm space-y-xs border-t border-outline-variant pt-sm">
                          {bewertungen.map((b) => (
                            <GewichtungWahl
                              key={b.prefix}
                              prefix={b.prefix}
                              index={p.slug}
                              frage={b.frage}
                              stufen={b.stufen}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                </SammelAccordion>
              );
            })}
          </ol>
          </>
        )}
      </div>
    </section>
  );
}
