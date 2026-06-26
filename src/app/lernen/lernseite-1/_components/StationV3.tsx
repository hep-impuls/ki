"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  BadgeFamilie,
  FaktencheckFakt,
  MediaBlock,
  MediaSegment,
  MediaSpec,
  PollFrage,
  PollSkala4,
  QuizFrage,
  Station,
  SubpageBanner,
  SubpageKey,
  SwipeKarte,
  Vertiefung,
} from "../_data/types";
import Anleitung from "./Anleitung";
import Hinweis from "./Hinweis";
import WerteKarte from "./WerteKarte";
import PollAuswertung from "./PollAuswertung";
import { AUTO_ADVANCE_MS } from "../_lib/ui";
import { FAKTEN_FALSCH } from "../_data/faktenPruefung";
import { QUIZ_BEZUG } from "../_data/quizBezug";
import { castSkalaPost, castSlider } from "../_lib/unitPolls";
import {
  faktScore,
  faktZustand,
  markStationAbgeschlossen,
  pollWahl,
  quizErgebnis,
  quizScore,
  recordFakt,
  recordPollWahl,
  recordQuiz,
  recordSwipe,
  reflexion as ladeReflexion,
  resetStation,
  saveReflexion,
  stationBonus,
  stationErfuellt,
  stationProfil,
  stationProzent,
  swipePick,
} from "../_lib/stationStore";

/**
 * StationV3 — die v3-Stations-Reise als **7 Subpages** (v3 §5), jede ≤ ~2
 * Bildschirmhöhen, mit **einer Frage/Karte pro Frame** (v3 §4.2, paginiert,
 * nie gestapelt). Persistentes **Banner** (Inhalt · Dauer · Lernziel) +
 * **Mikro-Anleitung** zwischen den Schritten (v3 §4.3). Video im **Split-Layout**
 * (stapelt mobil).
 *
 * Stand M4 (Interaktions-Tiefe): Navigation + Banner + Guidance + Medien (M3) plus
 * **Quiz-Scoring + lokale Persistenz**, **Swipe-Werte-Profil**, Faktencheck-/Poll-/
 * Reflexions-Zustand und **Badge-Vergabe + Stations-Abschluss** — alles über
 * `_lib/stationStore` (localStorage). Frames hydrieren ihren Zustand aus dem Store,
 * sodass `key={i}`-Remounts/Zurück-Navigation nichts mehr verlieren. Zertifikat +
 * Zeitstrahl-«grün» folgen in **M5**, anonyme Poll-/Quiz-Aggregate in **M6/M8**.
 * Persönliche Eingaben bleiben **lokal**; **keine** Cloud-Writes in dieser Stufe.
 *
 * Reine MD3-Tokens + Material Symbols Outlined, deutsche UI, echte Umlaute.
 */

/* ── Reihenfolge der 7 Subpages (v3 §5) ───────────────────────────────────── */
const SUBPAGE_ORDER: SubpageKey[] = [
  "auftakt",
  "sonne",
  "schatten",
  "swipe",
  "fakten",
  "quiz",
  "befund",
];

const SUBPAGE_LABEL: Record<SubpageKey, string> = {
  auftakt: "Auftakt",
  sonne: "Sonnenseite",
  schatten: "Schattenseite",
  swipe: "Werte",
  fakten: "Faktencheck",
  quiz: "Quiz",
  befund: "Befund",
};

/** Material-Symbol je Subpage-Typ — macht jede Subpage über alle Stationen
 *  konsistent erkennbar (Stepper + Subpage-Kopf). */
const SUBPAGE_ICON: Record<SubpageKey, string> = {
  auftakt: "flag",
  sonne: "wb_sunny",
  schatten: "nightlight",
  swipe: "touch_app",
  fakten: "fact_check",
  quiz: "quiz",
  befund: "emoji_events",
};

/** Max. Verständnisfragen, die direkt unter einem Medium gezeigt werden (Rest → Recap). */
const FRAGEN_PRO_MEDIUM = 2;

const BADGE_INFO: Record<BadgeFamilie, { label: string; icon: string }> = {
  tech: { label: "KI & Technologie", icon: "memory" },
  ethik: { label: "Ethik", icon: "balance" },
  gesellschaft: { label: "Gesellschaft", icon: "groups" },
  wirtschaft: { label: "Wirtschaft", icon: "payments" },
  mensch: { label: "Mensch", icon: "diversity_3" },
};

/** Lesbare Pol-Labels der Werte-Profil-Achsen (v3 §10); Fallback = roher Key. */
const PROFIL_LABEL: Record<string, { links: string; rechts: string }> = {
  "regulierung-innovation": { links: "Regulierung", rechts: "Innovation" },
  "menschloop-effizienz": { links: "Mensch-im-Loop", rechts: "Effizienz" },
  "datenschutz-bequemlichkeit": { links: "Datenschutz", rechts: "Bequemlichkeit" },
};

/* ── Frame-Modell: jede Subpage zerfällt in 1..n Frames (1 Item pro Frame) ─── */
type Frame =
  | { sub: SubpageKey; kind: "poll"; phase: "pre" | "post"; poll: PollFrage }
  | {
      sub: SubpageKey;
      kind: "media";
      block: MediaBlock;
      vertiefung?: Vertiefung;
      warnung?: string;
      /** Verständnisfragen, die direkt unter diesem Medium gezeigt werden (v3-Erweiterung). */
      fragen?: QuizFrage[];
    }
  | { sub: SubpageKey; kind: "swipe"; karte: SwipeKarte }
  | { sub: SubpageKey; kind: "fakt"; fakt: FaktencheckFakt; index: number; total: number }
  | { sub: SubpageKey; kind: "quiz"; frage: QuizFrage; index: number; total: number }
  | { sub: SubpageKey; kind: "auswertung" }
  | { sub: SubpageKey; kind: "reflexion" }
  | { sub: SubpageKey; kind: "befund-badge" };

function buildFrames(station: Station): Frame[] {
  const frames: Frame[] = [];

  // Verständnisfragen nach Bezug aufteilen (v3-Erweiterung): die zum jeweiligen
  // Medium passenden Fragen werden direkt darunter gezeigt, der Rest als Recap.
  const bezugVon = (id: string) => QUIZ_BEZUG[id] ?? "allgemein";
  const sonneFragen = station.quizPool
    .filter((q) => bezugVon(q.id) === "sonne")
    .slice(0, FRAGEN_PRO_MEDIUM);
  const schattenFragen = station.quizPool
    .filter((q) => bezugVon(q.id) === "schatten")
    .slice(0, FRAGEN_PRO_MEDIUM);
  const gezeigt = new Set([...sonneFragen, ...schattenFragen].map((q) => q.id));
  const recapFragen = station.quizPool.filter((q) => !gezeigt.has(q.id));

  // 1 Auftakt — 3 Pre-Polls (je 1 pro Frame)
  station.polls.forEach((poll) => frames.push({ sub: "auftakt", kind: "poll", phase: "pre", poll }));
  // 2 Sonnenseite — Medienblock + zugehörige Verständnisfragen (direkt darunter)
  frames.push({ sub: "sonne", kind: "media", block: station.sonnenseite, fragen: sonneFragen });
  // 3 Schattenseite — Medienblock (+ opt-in Vertiefung bei Station 4) + Verständnisfragen
  frames.push({
    sub: "schatten",
    kind: "media",
    block: station.schattenseite,
    vertiefung: station.schattenVertiefung,
    warnung: station.warnung,
    fragen: schattenFragen,
  });
  // 4 Swipe — 3 Karten (je 1 pro Frame)
  station.swipe.forEach((karte) => frames.push({ sub: "swipe", kind: "swipe", karte }));
  // 5 Faktencheck — 5–7 Fakten (Wahr/Falsch, je 1 pro Frame)
  station.fakten.forEach((fakt, i) =>
    frames.push({ sub: "fakten", kind: "fakt", fakt, index: i + 1, total: station.fakten.length }),
  );
  // 6 Quiz-Recap — die noch nicht unter den Medien gezeigten Fragen (je 1 pro Frame)
  recapFragen.forEach((frage, i) =>
    frames.push({ sub: "quiz", kind: "quiz", frage, index: i + 1, total: recapFragen.length }),
  );
  // 7 Befund — 3 Post-Polls + Auswertung (Ich/Klasse/alle) + 1 Satz + Badges
  station.polls.forEach((poll) => frames.push({ sub: "befund", kind: "poll", phase: "post", poll }));
  if (station.polls.some((p) => p.format === "skala4")) {
    frames.push({ sub: "befund", kind: "auswertung" });
  }
  frames.push({ sub: "befund", kind: "reflexion" });
  frames.push({ sub: "befund", kind: "befund-badge" });
  return frames;
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/* ── v3-Medien-Renderer (YouTube-Ausschnitt/Segmente · Audio · SRF ganz) ───── */
function MediaPlatzhalter({ spec }: { spec: MediaSpec }) {
  return (
    <div className="flex items-center gap-sm rounded-lg border border-dashed border-outline-variant bg-surface-container-low p-md text-body-sm text-on-surface-variant">
      <span className="material-symbols-outlined text-[20px] text-tertiary">link_off</span>
      <span>
        Quelle noch zu hinterlegen — <strong>{spec.sourceKey ?? spec.title}</strong>.
      </span>
    </div>
  );
}

/**
 * AudioClip — MP3-Player mit Fenster-Logik (v3 §9: «Audio-Player mit Start/Stopp;
 * Zeitfenster über gesetzten Startpunkt und Hinweis steuerbar»). Unterstützt:
 *  - Einzel-Ausschnitt (`spec.start`/`spec.end`) → springt zum Start, stoppt am Ende;
 *  - Mehr-Segment (`spec.segments`) → spielt die Fenster nacheinander, überspringt
 *    die Lücken dazwischen und pausiert nach dem letzten Fenster.
 * Robust gegen manuelles Scrubben: das aktive Fenster wird pro Tick aus der
 * aktuellen Position neu bestimmt. Caption (MediaFenster) nennt die Fenster.
 */
function AudioClip({ spec }: { spec: MediaSpec }) {
  const ref = useRef<HTMLAudioElement>(null);
  const fenster: MediaSegment[] = useMemo(() => {
    if (spec.segments && spec.segments.length > 0) return spec.segments;
    if (spec.start != null) {
      return [{ start: spec.start, end: spec.end ?? Number.POSITIVE_INFINITY }];
    }
    return [];
  }, [spec]);

  useEffect(() => {
    const el = ref.current;
    if (!el || fenster.length === 0) return;
    const onLoaded = () => {
      el.currentTime = fenster[0].start;
    };
    const onTime = () => {
      const t = el.currentTime;
      // Sind wir in einem Fenster? Sonst zum nächsten springen bzw. stoppen.
      const drin = fenster.some((f) => t >= f.start && t < f.end);
      if (drin) return;
      const naechstes = fenster.find((f) => f.start > t);
      if (naechstes) el.currentTime = naechstes.start;
      else el.pause();
    };
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    return () => {
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
    };
  }, [fenster]);

  if (!spec.src) return <MediaPlatzhalter spec={spec} />;
  return (
    <audio
      ref={ref}
      src={spec.src}
      controls
      preload="metadata"
      aria-label={spec.title}
      className="w-full"
    />
  );
}

function MediaItem({ spec }: { spec: MediaSpec }) {
  if (spec.kind === "youtube") {
    if (!spec.youtubeId) return <MediaPlatzhalter spec={spec} />;
    const start = spec.segments?.[0]?.start ?? spec.start ?? 0;
    const end = spec.segments?.[0]?.end ?? spec.end;
    const endParam = end ? `&end=${end}` : "";
    const url = `https://www.youtube-nocookie.com/embed/${spec.youtubeId}?start=${start}${endParam}&rel=0`;
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-outline-variant">
        <iframe
          src={url}
          title={spec.title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }
  if (spec.kind === "srf") {
    // v3 §9: SRF-iframe wird IMMER ganz eingebettet (kein Code-Schnitt);
    // die Anleitung-zur-Minute steht in spec.guidance.
    if (!spec.urn) return <MediaPlatzhalter spec={spec} />;
    const url = `https://www.srf.ch/play/embed?urn=${encodeURIComponent(spec.urn)}&subdivisions=false`;
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-outline-variant">
        <iframe
          src={url}
          title={spec.title}
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    );
  }
  // audio (MP3) — Fenster-Logik in AudioClip (v3 §9)
  return <AudioClip spec={spec} />;
}

function MediaFenster({ spec }: { spec: MediaSpec }) {
  const fenster =
    spec.segments && spec.segments.length > 0
      ? spec.segments.map((s) => `${fmt(s.start)}–${fmt(s.end)}`).join(", ")
      : spec.start != null && spec.end != null
        ? `${fmt(spec.start)}–${fmt(spec.end)}`
        : null;
  return (
    <figure className="flex flex-col gap-xs">
      <MediaItem spec={spec} />
      <figcaption className="text-label-sm text-on-surface-variant">
        {spec.title}
        {fenster && <> · {fenster}</>}
        {spec.externalUrl && (
          <>
            {" · "}
            <a href={spec.externalUrl} target="_blank" rel="noreferrer" className="text-primary underline">
              Original
            </a>
          </>
        )}
      </figcaption>
      {spec.kind === "srf" && spec.guidance && (
        <p className="rounded-lg bg-surface-container-low p-sm text-label-md text-on-surface-variant">
          <span className="material-symbols-outlined mr-xs align-[-3px] text-[16px] text-tertiary">schedule</span>
          {spec.guidance}
        </p>
      )}
    </figure>
  );
}

/** Medienblock im Split-Layout: Video links, Hinweis/Anleitung rechts (stapelt mobil). */
function MediaSplit({ block, anleitung }: { block: MediaBlock; anleitung?: string }) {
  return (
    <div className="grid gap-lg lg:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-md">
        {block.media.map((m, i) => (
          <MediaFenster key={i} spec={m} />
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-md">
        {block.intro && <Hinweis>{block.intro}</Hinweis>}
        {(block.anleitung ?? anleitung) && <Anleitung>{block.anleitung ?? anleitung}</Anleitung>}
      </div>
    </div>
  );
}

/* ── Banner (Inhalt · Dauer · Lernziel) — persistent je Subpage (v3 §4.3) ──── */
function Banner({ banner }: { banner: SubpageBanner }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-low p-md">
      <div className="flex flex-wrap items-center gap-x-md gap-y-xs text-label-md">
        <span className="inline-flex items-center gap-xs text-primary">
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          {banner.inhalt}
        </span>
        <span className="inline-flex items-center gap-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">schedule</span>
          {banner.dauerMin} Min.
        </span>
      </div>
      <p className="mt-sm flex items-start gap-xs text-body-md text-on-surface">
        <span className="material-symbols-outlined mt-[2px] text-[18px] text-tertiary">flag</span>
        <span>
          <span className="font-semibold">Lernziel:</span> {banner.lernziel}
        </span>
      </p>
    </div>
  );
}

/* ── Subpage-Stepper: die 7 Subpages als anklickbare Chips (v3 §5) ──────────── */
type Subgruppe = { sub: SubpageKey; indices: number[] };

function SubpageStepper({
  gruppen,
  aktivIdx,
  onJump,
}: {
  gruppen: Subgruppe[];
  aktivIdx: number;
  onJump: (frameIndex: number) => void;
}) {
  return (
    <nav aria-label="Abschnitte dieser Station" className="flex flex-wrap gap-xs">
      {gruppen.map((g, idx) => {
        const aktiv = idx === aktivIdx;
        const erledigt = idx < aktivIdx;
        return (
          <button
            key={g.sub}
            type="button"
            onClick={() => onJump(g.indices[0])}
            aria-current={aktiv ? "step" : undefined}
            className={`inline-flex items-center gap-xs rounded-full px-sm py-[3px] text-label-sm transition-colors ${
              aktiv
                ? "bg-primary text-on-primary"
                : erledigt
                  ? "bg-primary-container text-on-primary-container hover:opacity-90"
                  : "border border-outline-variant text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {erledigt ? "check" : SUBPAGE_ICON[g.sub]}
            </span>
            {SUBPAGE_LABEL[g.sub]}
          </button>
        );
      })}
    </nav>
  );
}

/* ── Subpage-Kopf: einheitlicher Typ-Marker + Position innerhalb der Subpage ── */
function SubpageKopf({ sub, pos, count }: { sub: SubpageKey; pos: number; count: number }) {
  return (
    <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-tertiary">
      <span className="material-symbols-outlined text-[18px]">{SUBPAGE_ICON[sub]}</span>
      {SUBPAGE_LABEL[sub]}
      {count > 1 && <span className="text-on-surface-variant">· {pos} von {count}</span>}
    </p>
  );
}

/* ── Frame-Inhalte ─────────────────────────────────────────────────────────── */
function PollFrame({
  stationId,
  poll,
  phase,
  onAnswered,
}: {
  stationId: string;
  poll: PollFrage;
  phase: "pre" | "post";
  /** Optional: nach diskreter 4er-Skala-Wahl gemeldet (Auto-Advance; Slider nicht). */
  onAnswered?: () => void;
}) {
  // Auswahl lokal hydrieren (back-/reload-fest). M8: zusätzlich anonymes Casting
  // — 4er-Skala sofort (Post), Slider erst beim Loslassen (sonst zählt jeder
  // Zwischenwert beim Ziehen). Persönlicher Wert bleibt lokal (stationStore).
  const [wert, setWert] = useState<number | null>(() => pollWahl(stationId, poll.id, phase));
  const letzterWert = useRef<number | null>(wert);
  const interagiert = useRef(false);
  const setzen = (v: number) => {
    setWert(v);
    letzterWert.current = v;
    interagiert.current = true;
    recordPollWahl(stationId, poll.id, phase, v);
    // 4er-Skala: diskrete Wahl → sofort anonym casten (nur Post = Spiegel-Key).
    if (poll.format === "skala4" && phase === "post") castSkalaPost(poll.pollId, v);
    // Auto-Advance nur bei diskreter 4er-Skala-Wahl — beim Slider (kontinuierlich)
    // wäre das fatal (jede Bewegung würde weiterblättern).
    if (poll.format === "skala4") onAnswered?.();
  };
  // Slider: erst beim Loslassen casten (PointerUp/KeyUp), voteOnce-geschützt.
  const sliderRelease = () => {
    if (poll.format === "slider" && interagiert.current && letzterWert.current != null) {
      castSlider(poll.pollId, phase, letzterWert.current);
    }
  };
  return (
    <div className="flex flex-col gap-md">
      <p className="text-label-sm uppercase tracking-wider text-tertiary">
        {phase === "pre" ? "Deine Meinung jetzt" : "Deine Meinung nach der Station"}
      </p>
      <p className="text-body-lg text-on-surface">{poll.frage}</p>
      {poll.format === "skala4" ? (
        <div className="grid gap-sm sm:grid-cols-2">
          {poll.optionen.map((opt, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={wert === i}
              onClick={() => setzen(i)}
              className={`rounded-lg border p-md text-left text-body-md transition-colors ${
                wert === i
                  ? "border-primary bg-primary-container text-on-primary-container"
                  : "border-outline-variant bg-surface-bright text-on-surface hover:border-primary"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-xs">
          <input
            type="range"
            min={0}
            max={100}
            value={wert ?? 50}
            onChange={(e) => setzen(Number(e.target.value))}
            onPointerUp={sliderRelease}
            onKeyUp={sliderRelease}
            aria-label={`${poll.achse.links} bis ${poll.achse.rechts}`}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-label-sm text-on-surface-variant">
            <span>{poll.achse.links}</span>
            <span>{poll.achse.rechts}</span>
          </div>
        </div>
      )}
      <p className="text-label-sm text-on-surface-variant">
        Anonym, kein Richtig oder Falsch. Nur deine Stufe zählt — ohne Namen — in die Klassen-Statistik.
      </p>
    </div>
  );
}

function SwipeFrame({
  stationId,
  karte,
  onAnswered,
}: {
  stationId: string;
  karte: SwipeKarte;
  onAnswered?: () => void;
}) {
  // Pick lokal hydrieren; überschreibbar (Haltung, kein richtig/falsch). Speist
  // das Werte-Profil (stationStore.aggregateProfil) für die Landkarte (M6).
  const [pick, setPick] = useState<"links" | "rechts" | null>(
    () => swipePick(stationId, karte.id)?.pick ?? null,
  );
  const waehlen = (p: "links" | "rechts") => {
    setPick(p);
    recordSwipe(stationId, karte.id, p, karte.profilKey);
    onAnswered?.();
  };
  return <WerteKarte aussage={karte.aussage} achse={karte.achse} pick={pick} onPick={waehlen} />;
}

function FaktFrame({ stationId, fakt }: { stationId: string; fakt: FaktencheckFakt }) {
  const falsch = FAKTEN_FALSCH[fakt.id];
  // Gespeicherten Zustand einmalig beim Mount lesen → gezeigte Variante + Antwort
  // bleiben bei Zurück-Navigation stabil (kein Neu-Würfeln).
  const [gespeichert] = useState(() => faktZustand(stationId, fakt.id));
  const [zeigeWahr] = useState(() =>
    gespeichert ? gespeichert.gezeigtWahr : falsch ? Math.random() < 0.5 : true,
  );
  const [antwort, setAntwort] = useState<boolean | null>(gespeichert ? gespeichert.antwort : null);
  const beantworten = (val: boolean) => {
    setAntwort(val);
    recordFakt(stationId, fakt.id, zeigeWahr, val);
  };
  const aussage = zeigeWahr ? fakt.claim : (falsch ?? fakt.claim);
  const korrekt = antwort != null && antwort === zeigeWahr;

  // #3: Nach dem Beantworten die Auflösung (und den darunterliegenden Weiter-
  // Button) in den sichtbaren Bereich scrollen — sonst wird Weiter aus dem Bild
  // geschoben. `block: "nearest"` scrollt nur so weit wie nötig.
  const feedbackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (antwort !== null) {
      feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [antwort]);

  return (
    <div className="flex flex-col gap-md">
      <p className="text-label-sm uppercase tracking-wider text-tertiary">Stimmt das?</p>
      <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg text-body-lg text-on-surface shadow-sm">
        {aussage}
      </div>
      <div className="grid grid-cols-2 gap-md">
        {[true, false].map((val) => (
          <button
            key={String(val)}
            type="button"
            disabled={antwort !== null}
            onClick={() => beantworten(val)}
            className={`rounded-lg border p-md text-body-md transition-colors ${
              antwort !== null && val === zeigeWahr
                ? "border-primary bg-primary-container text-on-primary-container"
                : antwort === val
                  ? "border-error bg-error-container text-on-error-container"
                  : "border-outline-variant text-on-surface hover:border-primary"
            }`}
          >
            {val ? "Wahr" : "Falsch"}
          </button>
        ))}
      </div>
      {antwort !== null && (
        <div ref={feedbackRef} aria-live="polite" className="flex flex-col gap-sm rounded-lg bg-surface-container-low p-md">
          <p className="text-body-md font-semibold text-on-surface">
            {korrekt ? "Richtig erkannt." : "Nicht ganz."}{" "}
            {zeigeWahr ? "Die Aussage stimmt." : "Die Aussage ist falsch."}
          </p>
          <p className="text-body-md text-on-surface-variant">
            <span className="font-semibold">Tatsächlich gilt:</span> {fakt.claim}
            {fakt.figure && <> ({fakt.figure})</>}
          </p>
          <p className="text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined mr-xs align-[-3px] text-[16px] text-tertiary">
              verified
            </span>
            Quelle:{" "}
            <a href={fakt.sourceUrl} target="_blank" rel="noreferrer" className="text-primary underline">
              {fakt.sourceName}
            </a>{" "}
            ({fakt.date})
          </p>
        </div>
      )}
    </div>
  );
}

function QuizFrameView({ stationId, frage }: { stationId: string; frage: QuizFrage }) {
  // Gepunktet, erste Antwort bindet (stationStore). Hydrieren → back-/reload-fest.
  const [gespeichert] = useState(() => quizErgebnis(stationId, frage.id));
  const [gewaehlt, setGewaehlt] = useState<number | null>(
    gespeichert && typeof gespeichert.antwort === "number" ? gespeichert.antwort : null,
  );
  const [tf, setTf] = useState<boolean | null>(
    gespeichert && typeof gespeichert.antwort === "boolean" ? gespeichert.antwort : null,
  );
  const waehleMc = (i: number) => {
    setGewaehlt(i);
    recordQuiz(stationId, frage.id, i, frage.kind === "mc" && frage.correctIndices.includes(i), frage.punkte ?? 1);
  };
  const waehleTf = (val: boolean) => {
    setTf(val);
    recordQuiz(stationId, frage.id, val, frage.kind === "tf" && val === frage.correctAnswer, frage.punkte ?? 1);
  };
  return (
    <div className="flex flex-col gap-md">
      {frage.kind === "mc" ? (
        <>
          <p className="text-body-lg text-on-surface">{frage.frage}</p>
          <div className="flex flex-col gap-sm">
            {frage.optionen.map((opt, i) => {
              const istKorrekt = frage.correctIndices.includes(i);
              const zeigen = gewaehlt !== null;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={zeigen}
                  onClick={() => waehleMc(i)}
                  className={`rounded-lg border p-md text-left text-body-md transition-colors ${
                    zeigen && istKorrekt
                      ? "border-primary bg-primary-container text-on-primary-container"
                      : zeigen && gewaehlt === i
                        ? "border-error bg-error-container text-on-error-container"
                        : "border-outline-variant text-on-surface hover:border-primary"
                  }`}
                >
                  {opt.label}
                  {zeigen && (gewaehlt === i || istKorrekt) && (
                    <span className="mt-xs block text-label-sm text-on-surface-variant">{opt.feedback}</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <p className="text-body-lg text-on-surface">{frage.aussage}</p>
          <div className="grid grid-cols-2 gap-md">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                disabled={tf !== null}
                onClick={() => waehleTf(val)}
                className={`rounded-lg border p-md text-body-md transition-colors ${
                  tf !== null && val === frage.correctAnswer
                    ? "border-primary bg-primary-container text-on-primary-container"
                    : tf === val
                      ? "border-error bg-error-container text-on-error-container"
                      : "border-outline-variant text-on-surface hover:border-primary"
                }`}
              >
                {val ? "Wahr" : "Falsch"}
              </button>
            ))}
          </div>
          {tf !== null && (
            <p aria-live="polite" className="rounded-lg bg-surface-container-low p-md text-body-md text-on-surface-variant">
              {tf === frage.correctAnswer ? frage.feedbackRichtig : frage.feedbackFalsch}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function ReflexionFrame({ stationId, prompt }: { stationId: string; prompt: string }) {
  const [text, setText] = useState(() => ladeReflexion(stationId));
  const aendern = (v: string) => {
    setText(v);
    saveReflexion(stationId, v);
  };
  return (
    <div className="flex flex-col gap-md">
      <p className="text-body-lg text-on-surface">{prompt}</p>
      <textarea
        value={text}
        onChange={(e) => aendern(e.target.value)}
        rows={3}
        placeholder="Dein Satz …"
        className="w-full rounded-lg border border-outline-variant bg-surface-bright p-md text-body-md text-on-surface"
      />
      <p className="text-label-sm text-on-surface-variant">Bleibt nur bei dir (lokal gespeichert).</p>
    </div>
  );
}

function BadgeFrame({ station, onReset }: { station: Station; onReset: () => void }) {
  // #9: Station erst bei erfülltem 60%-Gate als abgeschlossen markieren + Badges
  // vergeben (idempotent, lokal). Speist Zeitstrahl-«grün», Badge-Sammlung und
  // Zertifikat. Der Faktencheck zählt nur als Bonus (max. +10 %), nicht ins Gate.
  const erfuellt = stationErfuellt(station.id);
  const prozent = Math.round(stationProzent(station.id) * 100);
  const bonus = Math.round(stationBonus(station.id) * 100);
  const score = quizScore(station.id);
  const fakt = faktScore(station.id);
  const profil = Object.entries(stationProfil(station.id));

  useEffect(() => {
    if (erfuellt) markStationAbgeschlossen(station.id, station.badges);
  }, [erfuellt, station]);

  // Gate nicht erfüllt → klare Meldung + Stations-Reset (kein Einzelfrage-Retry).
  if (!erfuellt) {
    return (
      <div className="flex flex-col gap-md">
        <p className="flex items-start gap-sm rounded-lg bg-error-container p-md text-body-md text-on-error-container">
          <span className="material-symbols-outlined mt-[2px] text-[20px]">info</span>
          <span>
            Du hast <span className="font-semibold">{prozent} %</span> der Quizpunkte. Für den
            Abschluss dieser Station brauchst du mindestens 60 %. Du kannst die Station neu starten
            und die Fragen noch einmal beantworten.
          </span>
        </p>
        {score.beantwortet > 0 && (
          <p className="text-body-sm text-on-surface-variant">
            Quiz: {score.punkte} von {score.max} Punkten · {score.beantwortet} Fragen beantwortet.
          </p>
        )}
        <button
          type="button"
          onClick={() => {
            const ok = window.confirm(
              "Station neu starten? Dein Fortschritt in dieser Station (Quiz, Faktencheck, Werte, Meinung, Reflexion) wird gelöscht. Andere Stationen bleiben erhalten.",
            );
            if (ok) {
              resetStation(station.id);
              onReset();
            }
          }}
          className="inline-flex w-fit items-center gap-xs rounded-lg bg-primary px-lg py-sm text-label-md text-on-primary transition hover:opacity-90"
        >
          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
          Station neu starten
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-md">
      <p className="text-body-lg text-on-surface">Geschafft! Diese Station vergibt:</p>
      <div className="flex flex-wrap gap-md">
        {station.badges.map((b, i) => {
          const info = BADGE_INFO[b.familie];
          return (
            <div
              key={i}
              className="inline-flex items-center gap-sm rounded-xl border border-outline-variant bg-tertiary-container px-md py-sm text-on-tertiary-container"
            >
              <span className="material-symbols-outlined text-[22px]">{info.icon}</span>
              <span className="text-body-md font-semibold">{info.label}</span>
              {b.anzahl > 1 && <span className="text-label-md">×{b.anzahl}</span>}
            </div>
          );
        })}
      </div>

      {/* Quiz-Punktestand + Faktencheck-Bonus (#9, lokal, gepunktet) */}
      {score.beantwortet > 0 && (
        <div className="flex flex-col gap-xs rounded-lg bg-surface-container-low p-md">
          <p className="flex items-center gap-sm text-body-md text-on-surface">
            <span className="material-symbols-outlined text-[22px] text-primary">military_tech</span>
            <span>
              Quiz: <span className="font-semibold">{score.punkte}</span> von {score.max} Punkten
              <span className="text-on-surface-variant"> · {prozent} %</span>
            </span>
          </p>
          {fakt.gesamt > 0 && (
            <p className="flex items-center gap-sm text-body-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px] text-tertiary">fact_check</span>
              Bonus Faktencheck: +{bonus} % ({fakt.richtig} von {fakt.gesamt} richtig)
            </p>
          )}
        </div>
      )}

      {/* Werte-Profil-Echo dieser Station (lokal; speist die Landkarte in M6) */}
      {profil.length > 0 && (
        <div className="flex flex-col gap-sm rounded-lg bg-surface-container-low p-md">
          <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-tertiary">
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Dein Werte-Profil (lokal)
          </p>
          {profil.map(([key, achse]) => {
            const label = PROFIL_LABEL[key] ?? { links: key, rechts: key };
            const tendenz =
              achse.links === achse.rechts
                ? "ausgewogen"
                : achse.links > achse.rechts
                  ? label.links
                  : label.rechts;
            return (
              <p key={key} className="text-body-sm text-on-surface-variant">
                {label.links} ↔ {label.rechts}:{" "}
                <span className="font-semibold text-on-surface">Tendenz {tendenz}</span>
              </p>
            );
          })}
        </div>
      )}

      <p className="text-label-sm text-on-surface-variant">
        Alles bleibt lokal. Deine Station zählt ab 60 % der Quizpunkte als abgeschlossen.
      </p>
    </div>
  );
}

/* ── Hauptkomponente ───────────────────────────────────────────────────────── */
export default function StationV3({
  station,
  onBack,
  frameSub,
  framePos,
  onFrame,
}: {
  station: Station;
  onBack?: () => void;
  /** M10: controlled-Frame-Routing. Sind die drei gesetzt, kommt der Frame-Index
   *  aus der URL (Subpage + Position) statt aus lokalem State; jede Navigation
   *  meldet via `onFrame` zurück (`replace` = Auto-Advance, sonst bewusster
   *  Schritt). Ohne sie (z.B. /v3-preview) bleibt der lokale State-Fallback. */
  frameSub?: SubpageKey;
  framePos?: number;
  onFrame?: (sub: SubpageKey, pos: number, replace?: boolean) => void;
}) {
  const frames = useMemo(() => buildFrames(station), [station]);

  // Frames zu Subpage-Gruppen bündeln (aufeinanderfolgende gleiche `sub`).
  const gruppen = useMemo<Subgruppe[]>(() => {
    const out: Subgruppe[] = [];
    frames.forEach((f, idx) => {
      const last = out[out.length - 1];
      if (last && last.sub === f.sub) last.indices.push(idx);
      else out.push({ sub: f.sub, indices: [idx] });
    });
    return out;
  }, [frames]);

  // M10: Mapping Frame-Index ⇄ (Subpage, Position). Die URL trägt sub+pos
  // (robust gegen Inhalts-Umordnung, clamp gegen Overflow); intern bleibt der
  // lineare Index `i`.
  const subPosToIndex = (sub: SubpageKey, pos: number): number => {
    const g = gruppen.find((x) => x.sub === sub) ?? gruppen[0];
    const k = Math.min(Math.max(0, pos - 1), g.indices.length - 1);
    return g.indices[k];
  };
  const indexToSubPos = (idx: number): { sub: SubpageKey; pos: number } => {
    const g = gruppen.find((x) => x.indices.includes(idx)) ?? gruppen[0];
    return { sub: g.sub, pos: g.indices.indexOf(idx) + 1 };
  };

  const controlled = onFrame != null && frameSub != null && framePos != null;
  const [iLocal, setILocal] = useState(0);
  const i = controlled ? subPosToIndex(frameSub!, framePos!) : iLocal;

  const [vertiefungOffen, setVertiefungOffen] = useState(false);

  // Einheitliche Frame-Navigation: im controlled-Modus in die URL (push/replace),
  // sonst lokaler State. `replace` = Auto-Advance (kein History-Eintrag).
  const gotoIndex = (idx: number, replace = false) => {
    const clamped = Math.min(Math.max(0, idx), frames.length - 1);
    if (controlled) {
      const { sub, pos } = indexToSubPos(clamped);
      onFrame!(sub, pos, replace);
    } else {
      setILocal(clamped);
    }
  };

  // a11y: bei jedem Frame-Wechsel (Weiter/Zurück) den Fokus auf den neuen
  // Inhalt setzen, damit Tastatur-/Screenreader-Nutzende mitwandern. Beim ersten
  // Render NICHT fokussieren (kein Scroll-Sprung / Fokus-Klau beim Seitenaufbau).
  const inhaltRef = useRef<HTMLDivElement>(null);
  const gemountet = useRef(false);
  useEffect(() => {
    if (gemountet.current) inhaltRef.current?.focus();
    else gemountet.current = true;
  }, [i]);

  const frame = frames[i];
  const banner = station.subpages[frame.sub];
  const erste = i === 0;
  const letzte = i === frames.length - 1;

  const aktivGruppe = gruppen.findIndex((g) => g.indices.includes(i));
  const gruppe = gruppen[aktivGruppe];
  const posInSub = gruppe.indices.indexOf(i) + 1;
  const countInSub = gruppe.indices.length;
  const next = frames[i + 1];
  const wechselt = next != null && next.sub !== frame.sub; // nächster Schritt = neue Subpage?

  // Auto-Advance: nach einer diskreten Poll-/Swipe-Antwort automatisch zum nächsten
  // Frame — aber NUR innerhalb derselben Subpage (Subpage-Wechsel bleibt ein
  // bewusster «Weiter»-Klick). Weiter/Zurück bleiben jederzeit nutzbar. Stale-
  // Schutz via iRef, falls zwischenzeitlich manuell navigiert wurde.
  const iRef = useRef(i);
  iRef.current = i;
  const autoRef = useRef(false);
  useEffect(() => {
    autoRef.current = false;
  }, [i]);
  const autoAdvance = () => {
    if (autoRef.current || !next || next.sub !== frame.sub) return;
    autoRef.current = true;
    const from = i;
    setTimeout(() => {
      if (iRef.current === from) gotoIndex(from + 1, true);
    }, AUTO_ADVANCE_MS);
  };

  return (
    <div className="flex flex-col gap-lg rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
      {/* Kopf */}
      <div className="flex items-start justify-between gap-md border-b border-outline-variant pb-md">
        <div className="flex items-start gap-md">
          <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
            <span className="material-symbols-outlined text-[24px]">{station.icon}</span>
          </div>
          <div>
            <p className="text-label-md uppercase tracking-wider text-primary">
              Station {station.nummer}
              {station.freiwillig && " · freiwillig"}
            </p>
            <h2 className="mt-xs text-headline-md text-on-surface">{station.frage}</h2>
          </div>
        </div>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex shrink-0 items-center gap-xs text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
            Menü
          </button>
        )}
      </div>

      {/* Fortschritt — nur der Balken; der sichtbare Zähler entfällt (#6).
          Die Schritt-Position bleibt für Screenreader über aria-label erhalten. */}
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={frames.length}
        aria-valuenow={i + 1}
        aria-label={`Schritt ${i + 1} von ${frames.length}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-low"
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${((i + 1) / frames.length) * 100}%` }}
        />
      </div>

      {/* Subpage-Stepper — die 7 Abschnitte, anklickbar (freie Navigation, v3 §5) */}
      <SubpageStepper gruppen={gruppen} aktivIdx={aktivGruppe} onJump={(idx) => gotoIndex(idx)} />

      {/* Banner (persistent je Subpage) */}
      <Banner banner={banner} />

      {/* Station-Warnung (Station 4, freiwillig) — bereits am Einstieg (Auftakt-
          Subpage), damit man die Station vor dem Einlassen überspringen kann (v3 §10). */}
      {frame.sub === "auftakt" && station.warnung && (
        <p className="flex items-start gap-sm rounded-lg bg-error-container p-md text-body-md text-on-error-container">
          <span className="material-symbols-outlined mt-[2px] text-[20px]">warning</span>
          <span>{station.warnung}</span>
        </p>
      )}

      {/* Mikro-Anleitung (für Nicht-Medien-Frames; Medien-Frames zeigen sie im Split) */}
      {frame.kind !== "media" && banner.anleitung && <Anleitung>{banner.anleitung}</Anleitung>}

      {/* Frame-Inhalt — key={i} erzwingt Remount pro Frame (setzt lokalen
          Antwort-State zurück; sonst „klebt“ die Auswahl auf der nächsten Frage).
          ref+tabIndex: a11y-Fokusziel bei Frame-Wechsel (siehe useEffect oben). */}
      <div ref={inhaltRef} tabIndex={-1} key={i} className="animate-frame-in flex min-h-[160px] flex-col gap-md focus:outline-none">
        {/* Einheitlicher Subpage-Kopf: Typ-Marker + Position (über alle Stationen gleich) */}
        <SubpageKopf sub={frame.sub} pos={posInSub} count={countInSub} />
        {frame.kind === "poll" && (
          <PollFrame
            stationId={station.id}
            poll={frame.poll}
            phase={frame.phase}
            onAnswered={autoAdvance}
          />
        )}
        {frame.kind === "media" && (
          <div className="flex flex-col gap-md">
            {frame.warnung && (
              <p className="flex items-start gap-sm rounded-lg bg-error-container p-md text-body-md text-on-error-container">
                <span className="material-symbols-outlined mt-[2px] text-[20px]">warning</span>
                <span>{frame.warnung}</span>
              </p>
            )}
            <MediaSplit block={frame.block} anleitung={banner.anleitung} />
            {frame.fragen && frame.fragen.length > 0 && (
              <div className="flex flex-col gap-md border-t border-outline-variant pt-md">
                <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-tertiary">
                  <span className="material-symbols-outlined text-[18px]">quiz</span>
                  Verständnis — direkt zum eben Gesehenen
                </p>
                {frame.fragen.map((q) => (
                  <div
                    key={q.id}
                    className="rounded-xl border border-outline-variant bg-surface-bright p-lg"
                  >
                    <QuizFrameView stationId={station.id} frage={q} />
                  </div>
                ))}
              </div>
            )}
            {frame.vertiefung && (
              <div className="rounded-xl border border-outline-variant bg-surface-container-low p-md">
                {!vertiefungOffen ? (
                  <button
                    type="button"
                    onClick={() => setVertiefungOffen(true)}
                    className="inline-flex items-center gap-xs text-label-md text-primary hover:underline"
                  >
                    <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    Vertiefung anzeigen (freiwillig)
                  </button>
                ) : (
                  <div className="flex flex-col gap-md">
                    <p className="flex items-start gap-sm rounded-lg bg-error-container p-md text-body-md text-on-error-container">
                      <span className="material-symbols-outlined mt-[2px] text-[20px]">crisis_alert</span>
                      <span>{frame.vertiefung.warnung}</span>
                    </p>
                    <MediaSplit block={frame.vertiefung} />
                    <p className="flex items-start gap-sm rounded-lg bg-tertiary-container p-md text-body-md text-on-tertiary-container">
                      <span className="material-symbols-outlined mt-[2px] text-[20px]">support_agent</span>
                      <span>{frame.vertiefung.hilfsangebote}</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {frame.kind === "swipe" && (
          <SwipeFrame stationId={station.id} karte={frame.karte} onAnswered={autoAdvance} />
        )}
        {frame.kind === "fakt" && <FaktFrame stationId={station.id} fakt={frame.fakt} />}
        {frame.kind === "quiz" && <QuizFrameView stationId={station.id} frage={frame.frage} />}
        {frame.kind === "auswertung" && (
          <PollAuswertung
            titel="Ich, meine Klasse, alle"
            eintraege={station.polls
              .filter((p): p is PollSkala4 => p.format === "skala4")
              .map((poll) => ({ stationId: station.id, poll, phase: "post" as const }))}
            hinweis="Nur anonyme Aggregate werden gezeigt. Deine eigene Stufe bleibt lokal."
          />
        )}
        {frame.kind === "reflexion" && (
          <ReflexionFrame stationId={station.id} prompt={station.reflexion} />
        )}
        {frame.kind === "befund-badge" && <BadgeFrame station={station} onReset={() => gotoIndex(0)} />}
      </div>

      {/* Navigation — sticky am unteren Rand (#3), damit Weiter bei langen
          Frames (Faktencheck-Auflösung, Medien) immer erreichbar bleibt. */}
      <div className="sticky bottom-0 z-10 -mx-lg -mb-lg flex items-center justify-between gap-md border-t border-outline-variant bg-surface-bright px-lg pb-lg pt-md">
        <button
          type="button"
          onClick={() => gotoIndex(i - 1)}
          disabled={erste}
          className="inline-flex items-center gap-xs rounded-lg px-md py-sm text-label-md text-on-surface-variant transition-colors enabled:hover:text-on-surface disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Zurück
        </button>
        {!letzte ? (
          <button
            type="button"
            onClick={() => gotoIndex(i + 1)}
            className={`inline-flex items-center gap-xs rounded-lg px-lg py-sm text-label-md transition-opacity hover:opacity-90 ${
              wechselt
                ? "bg-tertiary text-on-tertiary"
                : "bg-primary text-on-primary"
            }`}
          >
            {wechselt ? `Weiter: ${SUBPAGE_LABEL[next.sub]}` : "Weiter"}
            <span className="material-symbols-outlined text-[18px]">
              {wechselt ? "keyboard_double_arrow_right" : "arrow_forward"}
            </span>
          </button>
        ) : (
          <span className="inline-flex items-center gap-xs rounded-lg bg-primary-container px-lg py-sm text-label-md text-on-primary-container">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Station beendet
          </span>
        )}
      </div>
    </div>
  );
}
