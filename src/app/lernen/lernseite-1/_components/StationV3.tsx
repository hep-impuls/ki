"use client";

import { useMemo, useState } from "react";
import type {
  BadgeFamilie,
  FaktencheckFakt,
  MediaBlock,
  MediaSpec,
  PollFrage,
  QuizFrage,
  Station,
  SubpageBanner,
  SubpageKey,
  SwipeKarte,
  Vertiefung,
} from "../_data/types";
import Anleitung from "./Anleitung";
import Hinweis from "./Hinweis";
import { FAKTEN_FALSCH } from "../_data/faktenPruefung";
import { QUIZ_BEZUG } from "../_data/quizBezug";

/**
 * StationV3 — die v3-Stations-Reise als **7 Subpages** (v3 §5), jede ≤ ~2
 * Bildschirmhöhen, mit **einer Frage/Karte pro Frame** (v3 §4.2, paginiert,
 * nie gestapelt). Persistentes **Banner** (Inhalt · Dauer · Lernziel) +
 * **Mikro-Anleitung** zwischen den Schritten (v3 §4.3). Video im **Split-Layout**
 * (stapelt mobil).
 *
 * Stand M3 (Shell): Navigation + Banner + Guidance + Medien stehen; die
 * Interaktions-Tiefe (Quiz 8→5 zufällig + Scoring, Swipe-Profil, Poll-Aggregate,
 * Badge-Vergabe, Zertifikat) folgt in **M4/M5/M6**. Persönliche Eingaben bleiben
 * lokal (React-State); **keine** Cloud-Writes in dieser Stufe.
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

/** Max. Verständnisfragen, die direkt unter einem Medium gezeigt werden (Rest → Recap). */
const FRAGEN_PRO_MEDIUM = 2;

const BADGE_INFO: Record<BadgeFamilie, { label: string; icon: string }> = {
  tech: { label: "KI & Technologie", icon: "memory" },
  ethik: { label: "Ethik", icon: "balance" },
  gesellschaft: { label: "Gesellschaft", icon: "groups" },
  wirtschaft: { label: "Wirtschaft", icon: "payments" },
  mensch: { label: "Mensch", icon: "diversity_3" },
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
  // 7 Befund — 3 Post-Polls + 1 Satz + Badges (je 1 pro Frame)
  station.polls.forEach((poll) => frames.push({ sub: "befund", kind: "poll", phase: "post", poll }));
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
  // audio
  if (!spec.src) return <MediaPlatzhalter spec={spec} />;
  return <audio src={spec.src} controls preload="metadata" className="w-full" />;
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

/* ── Frame-Inhalte ─────────────────────────────────────────────────────────── */
function PollFrame({ poll, phase }: { poll: PollFrage; phase: "pre" | "post" }) {
  const [wert, setWert] = useState<number | null>(null);
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
              onClick={() => setWert(i)}
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
            onChange={(e) => setWert(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-label-sm text-on-surface-variant">
            <span>{poll.achse.links}</span>
            <span>{poll.achse.rechts}</span>
          </div>
        </div>
      )}
      <p className="text-label-sm text-on-surface-variant">
        Anonym, kein Richtig oder Falsch. (Aggregat-Zähler folgt in einem späteren Schritt.)
      </p>
    </div>
  );
}

function SwipeFrame({ karte }: { karte: SwipeKarte }) {
  const [pick, setPick] = useState<"links" | "rechts" | null>(null);
  const links = karte.achse?.links ?? "Ablehnen";
  const rechts = karte.achse?.rechts ?? "Zustimmen";
  return (
    <div className="flex flex-col gap-lg">
      <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg text-center text-body-lg text-on-surface shadow-sm">
        {karte.aussage}
      </div>
      <div className="grid grid-cols-2 gap-md">
        <button
          type="button"
          onClick={() => setPick("links")}
          className={`inline-flex items-center justify-center gap-xs rounded-lg border p-md text-body-md transition-colors ${
            pick === "links"
              ? "border-primary bg-primary-container text-on-primary-container"
              : "border-outline-variant text-on-surface hover:border-primary"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          {links}
        </button>
        <button
          type="button"
          onClick={() => setPick("rechts")}
          className={`inline-flex items-center justify-center gap-xs rounded-lg border p-md text-body-md transition-colors ${
            pick === "rechts"
              ? "border-primary bg-primary-container text-on-primary-container"
              : "border-outline-variant text-on-surface hover:border-primary"
          }`}
        >
          {rechts}
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

function FaktFrame({ fakt, index, total }: { fakt: FaktencheckFakt; index: number; total: number }) {
  const falsch = FAKTEN_FALSCH[fakt.id];
  // Beim Mount (Frame remountet via key={i}) einmalig zufällig wahr/falsch zeigen.
  const [zeigeWahr] = useState(() => (falsch ? Math.random() < 0.5 : true));
  const [antwort, setAntwort] = useState<boolean | null>(null);
  const aussage = zeigeWahr ? fakt.claim : (falsch ?? fakt.claim);
  const korrekt = antwort != null && antwort === zeigeWahr;

  return (
    <div className="flex flex-col gap-md">
      <p className="text-label-sm uppercase tracking-wider text-tertiary">
        Fakt {index} von {total} · Stimmt das?
      </p>
      <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg text-body-lg text-on-surface shadow-sm">
        {aussage}
      </div>
      <div className="grid grid-cols-2 gap-md">
        {[true, false].map((val) => (
          <button
            key={String(val)}
            type="button"
            disabled={antwort !== null}
            onClick={() => setAntwort(val)}
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
        <div className="flex flex-col gap-sm rounded-lg bg-surface-container-low p-md">
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

function QuizFrameView({
  frage,
  index,
  total,
}: {
  frage: QuizFrage;
  index?: number;
  total?: number;
}) {
  const [gewaehlt, setGewaehlt] = useState<number | null>(null);
  const [tf, setTf] = useState<boolean | null>(null);
  return (
    <div className="flex flex-col gap-md">
      {total != null && (
        <p className="text-label-sm uppercase tracking-wider text-tertiary">
          Frage {index} von {total}
        </p>
      )}
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
                  onClick={() => setGewaehlt(i)}
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
                onClick={() => setTf(val)}
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
            <p className="rounded-lg bg-surface-container-low p-md text-body-md text-on-surface-variant">
              {tf === frage.correctAnswer ? frage.feedbackRichtig : frage.feedbackFalsch}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function ReflexionFrame({ prompt }: { prompt: string }) {
  const [text, setText] = useState("");
  return (
    <div className="flex flex-col gap-md">
      <p className="text-body-lg text-on-surface">{prompt}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Dein Satz …"
        className="w-full rounded-lg border border-outline-variant bg-surface-bright p-md text-body-md text-on-surface"
      />
      <p className="text-label-sm text-on-surface-variant">Bleibt nur bei dir (lokal gespeichert).</p>
    </div>
  );
}

function BadgeFrame({ station }: { station: Station }) {
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
      <p className="text-label-sm text-on-surface-variant">
        Vergabe, Fortschritt und Zertifikat folgen in einem späteren Schritt (M5).
      </p>
    </div>
  );
}

/* ── Hauptkomponente ───────────────────────────────────────────────────────── */
export default function StationV3({
  station,
  onBack,
}: {
  station: Station;
  onBack?: () => void;
}) {
  const frames = useMemo(() => buildFrames(station), [station]);
  const [i, setI] = useState(0);
  const [vertiefungOffen, setVertiefungOffen] = useState(false);

  const frame = frames[i];
  const banner = station.subpages[frame.sub];
  const erste = i === 0;
  const letzte = i === frames.length - 1;

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
              {station.freiwillig && " · freiwillig"} · {SUBPAGE_LABEL[frame.sub]}
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

      {/* Fortschritt */}
      <div className="flex items-center gap-sm">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-low">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((i + 1) / frames.length) * 100}%` }}
          />
        </div>
        <span className="text-label-sm text-on-surface-variant">
          {i + 1}/{frames.length}
        </span>
      </div>

      {/* Banner (persistent je Subpage) */}
      <Banner banner={banner} />

      {/* Mikro-Anleitung (für Nicht-Medien-Frames; Medien-Frames zeigen sie im Split) */}
      {frame.kind !== "media" && banner.anleitung && <Anleitung>{banner.anleitung}</Anleitung>}

      {/* Frame-Inhalt — key={i} erzwingt Remount pro Frame (setzt lokalen
          Antwort-State zurück; sonst „klebt“ die Auswahl auf der nächsten Frage). */}
      <div key={i} className="min-h-[160px]">
        {frame.kind === "poll" && <PollFrame poll={frame.poll} phase={frame.phase} />}
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
                  <QuizFrameView key={q.id} frage={q} />
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
        {frame.kind === "swipe" && <SwipeFrame karte={frame.karte} />}
        {frame.kind === "fakt" && (
          <FaktFrame fakt={frame.fakt} index={frame.index} total={frame.total} />
        )}
        {frame.kind === "quiz" && (
          <QuizFrameView frage={frame.frage} index={frame.index} total={frame.total} />
        )}
        {frame.kind === "reflexion" && <ReflexionFrame prompt={station.reflexion} />}
        {frame.kind === "befund-badge" && <BadgeFrame station={station} />}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-md border-t border-outline-variant pt-md">
        <button
          type="button"
          onClick={() => setI((p) => Math.max(0, p - 1))}
          disabled={erste}
          className="inline-flex items-center gap-xs rounded-lg px-md py-sm text-label-md text-on-surface-variant transition-colors enabled:hover:text-on-surface disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Zurück
        </button>
        {!letzte ? (
          <button
            type="button"
            onClick={() => setI((p) => Math.min(frames.length - 1, p + 1))}
            className="inline-flex items-center gap-xs rounded-lg bg-primary px-lg py-sm text-label-md text-on-primary transition-opacity hover:opacity-90"
          >
            Weiter
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
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
