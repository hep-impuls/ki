/**
 * Typ-Kontrakte für die KI-Einheit **v3** (Lernseite 1, Pietro).
 *
 * Massgebend: docs/material-pietro/KI_EINHEIT_GESAMTARCHITEKTUR_v3.md (§4–§11)
 * + docs/material-pietro/BUILD_NOTES_v3.md §3 (Datenmodell-Plan).
 *
 * Zweck (Milestone M1): **bevor** Inhalt (M2) und UI (M3+) gebaut werden, hier
 * die typisierten Daten-Kontrakte aller v3-Entitäten festschreiben. Die v3-Zähl-
 * Invarianten (§4.4) sind, wo möglich, **direkt im Typsystem kodiert** (Tupel):
 *   - 3 Poll-Fragen / Station   → `[PollFrage, PollFrage, PollFrage]`
 *   - 3 Swipe-Karten / Station  → `[SwipeKarte, SwipeKarte, SwipeKarte]`
 *   - 5–7 Faktencheck-Fakten    → Tupel mit Mindestlänge 5 (`FaktenListe`)
 *   - Quiz-Pool 8 = 5 MC + 3 W/F → `QuizPool` (Reihenfolge erzwingt 5×MC, 3×TF)
 *   - 7 Subpages / Station       → `Record<SubpageKey, SubpageBanner>` (genau 7 Keys)
 *
 * Daten-Modell `ki26` (bewertungsfrei): persönliche Resultate (Quiz-Punkte,
 * Slider-Bewegung, Swipe-Profil, Reflexion, Zertifikat) leben **nur** im Browser
 * (localStorage). In die Cloud gehen ausschliesslich **anonyme Aggregat-Zähler**
 * (`abstimmungen/ki26/polls/{pollId}.counts`, via src/lib/polls.ts).
 *
 * Hinweis: Dies ist die v3-Quelle. Die v2-Datei `stationen.ts` (alte Form
 * `hauptgang/dessert/checks`) bleibt bis zur Komponenten-Migration (M3) bestehen,
 * damit Build/Lint grün bleiben. v3-Skelette liegen in `stationenV3.ts`.
 */

/* ────────────────────────────────────────────────────────────────────────
 * Bereich-Tags (v3 §8) — sichtbar an jeder Station, zwingen keine Taxonomie auf.
 * ──────────────────────────────────────────────────────────────────────── */

export type Bereich =
  | "Wirtschaft"
  | "Politik"
  | "Technologie"
  | "Gesellschaft"
  | "Recht"
  | "Individuum"
  | "Psyche"
  | "Bildung"
  | "Ethik"
  | "Ökologie";

/* ────────────────────────────────────────────────────────────────────────
 * Medien (v3 §4/§9). YouTube: Ausschnitt ODER Mehr-Segment. SRF-iframe: immer
 * ganz eingebettet + Anleitung-zur-Minute (`guidance`), kein Code-Schnitt.
 * MP3: Audio-Player mit Start/Ende.
 * ──────────────────────────────────────────────────────────────────────── */

export interface MediaSegment {
  /** Start in Sekunden */
  start: number;
  /** Ende in Sekunden */
  end: number;
  /** optionale Beschriftung des Fensters (z.B. "Sonnenseite") */
  label?: string;
}

export interface MediaSpec {
  kind: "youtube" | "audio" | "srf";
  /** YouTube-Video-ID (kind: "youtube") */
  youtubeId?: string;
  /** MP3-Direkt-URL (kind: "audio") */
  src?: string;
  /** SRF-URN (kind: "srf"), z.B. "urn:srf:video:…" */
  urn?: string;
  title: string;
  /** interner Quell-Schlüssel (= Material-Dateiname), nur Doku/Mapping */
  sourceKey?: string;
  /** optionaler Link zur Original-Quelle */
  externalUrl?: string;

  /** Einzel-Ausschnitt in Sekunden (youtube/audio). */
  start?: number;
  end?: number;
  /** Mehr-Segment-Wiedergabe (youtube): mehrere Start/Stopp-Fenster nacheinander. */
  segments?: MediaSegment[];
  /**
   * SRF-iframe: Anleitung auf den relevanten Abschnitt statt Code-Schnitt
   * (v3 §4/§9), z.B. "Schauen Sie ab Minute 21 für rund 5 Minuten."
   */
  guidance?: string;
}

export interface MediaBlock {
  /** kurze Hinführung (Bridge-Stil), optional */
  intro?: string;
  /** Mikro-Anleitung: Was tun → Worauf achten → Was danach (v3 §4) */
  anleitung?: string;
  /** 1..n Clips (z.B. Audio + Video kombiniert) */
  media: MediaSpec[];
}

export interface Vertiefung extends MediaBlock {
  /** Triggerwarnung, vor dem Opt-in gezeigt (Station 4) */
  warnung: string;
  /** Hilfsangebote am Ende (Station 4: Tel. 143 / Tel. 147) */
  hilfsangebote: string;
}

/* ────────────────────────────────────────────────────────────────────────
 * Subpages (v3 §5) — genau 7 pro Station, jede ≤ ~2 Bildschirmhöhen.
 * Banner je Subpage: Inhalt · Dauer · Lernziel (+ optionale Mikro-Anleitung).
 * ──────────────────────────────────────────────────────────────────────── */

export type SubpageKey =
  | "auftakt" // 1 — Banner · Versprechen · Meinung 1 (3 Polls, pre)
  | "sonne" // 2 — Sonnenseite (affirmativer Pol)
  | "schatten" // 3 — Schattenseite (dissonanter Pol)
  | "swipe" // 4 — 3 Swipe-Karten
  | "fakten" // 5 — 5–7 Faktencheck-Fakten
  | "quiz" // 6 — 5 zufällige aus dem 8er-Pool
  | "befund"; // 7 — Meinung 2 (post) · 1 Satz · Badge-Vergabe

export interface SubpageBanner {
  /** Inhalt/Thema, z.B. "Subpage 2/7: Sonnenseite" */
  inhalt: string;
  /** Dauer dieser Seite in Minuten */
  dauerMin: number;
  /** Lernziel dieser Seite (1 Satz) */
  lernziel: string;
  /** Mikro-Anleitung (Was tun → Worauf achten → Was danach) */
  anleitung?: string;
}

/** Genau 7 Subpages: jeder Key ist Pflicht. */
export type StationSubpages = Record<SubpageKey, SubpageBanner>;

/* ────────────────────────────────────────────────────────────────────────
 * Polls (v3 §6/§11). Format-Mix: 4er-Skala (Aggregation Ich/Klasse/alle) +
 * Slider (persönliche Bewegung). Dieselbe Frage behält pre/post das Format.
 * Jede Frage trägt `pollId` (Aggregat-Key) + `landkarteAxis` (Achsen-Zuordnung).
 * ──────────────────────────────────────────────────────────────────────── */

export type PollFormat = "skala4" | "slider";

/** Die 4 Stufen einer 4er-Skala (z.B. "trifft gar nicht / eher nicht / eher / voll zu"). */
export type Skala4Optionen = [string, string, string, string];

interface PollBasis {
  /** stabiler Basis-Key → Runtime nutzt pollId.poll(id) / klassePoll(k,id). */
  id: string;
  pollId: string;
  frage: string;
  /** ID einer Landkarte-Achse (v3 §10), die diese Frage speist. */
  landkarteAxis: string;
  /** pre auf Subpage 1, post auf Subpage 7 — identisches Format. */
  prePost: true;
}

export interface PollSkala4 extends PollBasis {
  format: "skala4";
  optionen: Skala4Optionen;
}

export interface PollSlider extends PollBasis {
  format: "slider";
  /** Pol-Beschriftung des Sliders (0..100). */
  achse: { links: string; rechts: string };
}

export type PollFrage = PollSkala4 | PollSlider;

/** Genau 3 Poll-Fragen pro Station (v3 §4.4/§11). */
export type StationPolls = [PollFrage, PollFrage, PollFrage];

/* ────────────────────────────────────────────────────────────────────────
 * Swipe-Karten (v3 §6/§11) — 3 pro Station; Werte-Profil lokal (localStorage),
 * optional anonyme Aggregat-Zähler.
 * ──────────────────────────────────────────────────────────────────────── */

export interface SwipeKarte {
  id: string;
  aussage: string;
  /** Pol-Beschriftung (links ablehnen / rechts zustimmen), optional. */
  achse?: { links: string; rechts: string };
  /** Profil-Achse, die diese Karte speist (z.B. "regulierung-innovation"). */
  profilKey: string;
}

/** Genau 3 Swipe-Karten pro Station (v3 §4.4). */
export type StationSwipe = [SwipeKarte, SwipeKarte, SwipeKarte];

/* ────────────────────────────────────────────────────────────────────────
 * Faktencheck (v3 §6) — 5–7 recherchierte Fakten (aus deepsearch.md), ungradet,
 * reine Anzeige, je mit Quelle.
 * ──────────────────────────────────────────────────────────────────────── */

export interface FaktencheckFakt {
  id: string;
  /** Kernaussage des Fakts. */
  claim: string;
  /** optionale Schlüsselzahl (z.B. "~28 %", "180 Fr./Monat"). */
  figure?: string;
  /** Quellenname (z.B. "Angestellte Schweiz, 2025"). */
  sourceName: string;
  /** Quell-URL. */
  sourceUrl: string;
  /** Datum/Stand der Quelle (z.B. "2025-11"). */
  date: string;
}

/** 5–7 Fakten: Tupel mit Mindestlänge 5 (Obergrenze 7 als Konvention/Review). */
export type FaktenListe = [
  FaktencheckFakt,
  FaktencheckFakt,
  FaktencheckFakt,
  FaktencheckFakt,
  FaktencheckFakt,
  ...FaktencheckFakt[],
];

/* ────────────────────────────────────────────────────────────────────────
 * Quiz (v3 §6) — Pool 8 = 5 MC + 3 wahr/falsch; ausgeliefert 5 zufällig.
 * Form bewusst kompatibel mit `WissenCheckProps` (Reuse der Render-Logik in M4).
 * Bauregel §4.5 (plausible Distraktoren, ≥1 Distraktor länger als die richtige
 * Antwort, Feedback je Option) lebt in den Daten → Review in M2 (+ Lint-Idee M9).
 * ──────────────────────────────────────────────────────────────────────── */

export interface QuizOption {
  label: string;
  feedback: string;
}

export interface QuizMC {
  id: string;
  kind: "mc";
  frage: string;
  optionen: QuizOption[];
  /** Indizes der korrekten Option(en). */
  correctIndices: number[];
  punkte?: number;
}

export interface QuizTF {
  id: string;
  kind: "tf";
  aussage: string;
  correctAnswer: boolean;
  feedbackRichtig: string;
  feedbackFalsch: string;
  punkte?: number;
}

export type QuizFrage = QuizMC | QuizTF;

/**
 * Bezug einer Verständnisfrage zum konsumierten Inhalt (v3-Erweiterung nach
 * Pietro-Feedback 2026-06-26): Verständnisfragen werden direkt unter dem Medium
 * gezeigt, das sie prüfen — nicht nur in der separaten Quiz-Subpage.
 *   - "sonne"     → prüft die Sonnenseite (affirmativer Pol)
 *   - "schatten"  → prüft die Schattenseite (dissonanter Pol)
 *   - "fakten"    → prüft den Faktencheck
 *   - "allgemein" → übergreifend / Recap
 * Zuordnung liegt als Companion-Map in `_data/quizBezug.ts` (per Frage-ID).
 */
export type QuizBezug = "sonne" | "schatten" | "fakten" | "allgemein";

/**
 * Quiz-Pool: genau 8 Fragen, **5 MC gefolgt von 3 wahr/falsch** (v3 §6).
 * Die Reihenfolge erzwingt die 5+3-Zusammensetzung bereits im Typsystem.
 */
export type QuizPool = [QuizMC, QuizMC, QuizMC, QuizMC, QuizMC, QuizTF, QuizTF, QuizTF];

/* ────────────────────────────────────────────────────────────────────────
 * Badges (v3 §7) — 5 Familien, je Station 1–3 Badges, Doppelvergabe möglich.
 * ──────────────────────────────────────────────────────────────────────── */

export type BadgeFamilie = "tech" | "ethik" | "gesellschaft" | "wirtschaft" | "mensch";

export interface BadgeRef {
  familie: BadgeFamilie;
  /** wie oft diese Familie diese Station vergibt (1–3). */
  anzahl: number;
}

/** Mindestens 1 Badge pro Station. */
export type StationBadges = [BadgeRef, ...BadgeRef[]];

export interface BadgeFamilieInfo {
  label: string;
  /** Material Symbol (Outlined). */
  icon: string;
}

/* ────────────────────────────────────────────────────────────────────────
 * Station (v3 §5) — die vollständige Mini-Reise.
 * ──────────────────────────────────────────────────────────────────────── */

export interface Station {
  /** Poll-/Storage-Key, stabil: "station-1" … "station-7". */
  id: string;
  nummer: number;
  /** griffige Ich-Frage (Lernenden-Titel). */
  frage: string;
  /** Material Symbol (Outlined). */
  icon: string;
  /** sichtbare Bereich-Tags (v3 §8). */
  tags: Bereich[];
  /** Station 4: strukturell freiwillig. */
  freiwillig?: boolean;
  /** optionale Stations-Warnung (Station 4). */
  warnung?: string;

  /** 7 Subpage-Banner. */
  subpages: StationSubpages;
  /** 3 Poll-Fragen (4er-Skala, pre auf Subpage 1 / post auf Subpage 7). */
  polls: StationPolls;
  /** affirmativer Pol — das Versprechen, das hält. */
  sonnenseite: MediaBlock;
  /** dissonanter Pol (Standard) — das Versprechen, das bricht. */
  schattenseite: MediaBlock;
  /** schwerere, opt-in Vertiefung (nur Station 4). */
  schattenVertiefung?: Vertiefung;
  /** 3 Swipe-Karten. */
  swipe: StationSwipe;
  /** 5–7 Faktencheck-Fakten. */
  fakten: FaktenListe;
  /** Quiz-Pool 8 (5 MC + 3 W/F). */
  quizPool: QuizPool;
  /** Reflexions-Prompt (1 Satz, Freitext, nur lokal). */
  reflexion: string;
  /** vergebene Badges (1–3, aus §7-Matrix). */
  badges: StationBadges;
}

/* ────────────────────────────────────────────────────────────────────────
 * Landkarte (v3 §10) — rückwärts aus den Polls designt; jede Achse ↔ ein pollId.
 * ──────────────────────────────────────────────────────────────────────── */

export interface LandkarteAxis {
  /** Achsen-ID (= `landkarteAxis` der speisenden Poll-Frage(n)). */
  id: string;
  /** Anzeige-Label, z.B. "Arbeit/Wirtschaft: Bedrohung ↔ Chance". */
  label: string;
  /** linker Pol. */
  links: string;
  /** rechter Pol. */
  rechts: string;
  /** Basis-`pollId`(s), die diese Achse füllen. */
  pollIds: string[];
  format: PollFormat;
  /** woher die Achse gespeist wird. */
  quelle: "auftakt" | "abschluss" | `station-${number}` | "swipe";
}

/* ────────────────────────────────────────────────────────────────────────
 * Zertifikat (v3 §3) — rein abgeleitet, KEIN eigener Store; client-seitig aus
 * fortschritt + punkte + badges berechnet (ab ≥3 abgeschlossenen Stationen).
 * ──────────────────────────────────────────────────────────────────────── */

export interface Certificate {
  /** abgeschlossene Stationen (IDs). */
  stationen: string[];
  /** gesammelte Badges (aggregiert über Familien). */
  badges: BadgeRef[];
  /** Ausstellungsdatum (ISO). */
  datum: string;
  /** optionale Quiz-Punkte gesamt. */
  quizPunkte?: number;
}

/** Schwelle für die Zertifikats-Erzeugung (v3 §3/§0). */
export const ZERTIFIKAT_SCHWELLE = 3 as const;
