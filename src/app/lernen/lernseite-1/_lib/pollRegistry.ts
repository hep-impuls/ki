/**
 * Poll-Registry (Lernseite 1) — übersetzt die technischen Poll-IDs aus
 * `unitPolls.ts` in menschenlesbare Beschreibungen für den Lehrer-Report:
 * Frage, Ort (Station/Subpage), Format und Options-Beschriftungen.
 *
 * Quelle ist die echte Inhaltsdefinition (`stationenV3`, `auftakt*`,
 * `maschinenraum`) → die Registry bleibt automatisch in sync, wenn Inhalte
 * geändert werden. Reines Daten-Modul (kein "use client", keine Firebase-
 * Importe), damit es in den Report (Client-Komponente) gezogen werden kann.
 *
 * ID-Schemata (nach Strip von `p-` / `kp-{klasse}-` im Report):
 *   `{stationPoll}-post`   4er-Skala je Station (Standortbestimmung)
 *   `{stationPoll}-pre`    (nur falls je als Pre gecastet)
 *   `swipe-{kartenId}`     Werte-Karte (links/rechts)
 *   `wc-{frageId}`         Verständnisfrage (richtig/falsch)
 *   `aw-{optionId}`        Vorwissen-Auswahl (genannt)
 *   `{global}-pre|-post`   Auftakt/Abschluss-Haltungsfragen + Positions-Slider
 *   `mr-*`                 Maschinenraum
 */

import { STATIONEN_V3 } from "../_data/stationenV3";
import { AUFTAKT_SKALA_POLLS } from "../_data/auftaktPolls";
import { VORWISSEN_FRAGE, VORWISSEN_OPTIONEN } from "../_data/auftakt";
import {
  MR_PRE_FRAGE,
  MR_POST_FRAGE,
  MR_INTERESSE_FRAGE,
  MR_PRE_ACHSE,
  MR_INTERESSE_ACHSE,
  MR_VERTRAUEN_FRAGE,
  MR_VERTRAUEN_OPTIONEN,
} from "../_data/maschinenraum";

/**
 * Muss mit `GLOBAL_POLL_ID` aus `./landkarteData` übereinstimmen — bewusst
 * inline gehalten, damit diese Registry kein "use client"-Modul importiert.
 */
const GLOBAL_POLL_ID = "global-chance-bedrohung";

export interface PollMeta {
  /** Die Frage / Aussage, über die abgestimmt wurde. */
  frage: string;
  /** Ort in der Einheit (z.B. "Station 1: … · Standortbestimmung (nachher)"). */
  kontext: string;
  format: "skala4" | "slider" | "swipe" | "wissen" | "auswahl";
  /** Sortierschlüssel für die Report-Reihenfolge (Auftakt → Stationen → MR). */
  sortKey: string;
  /** Bucket-Key (s0, links, richtig, …) → lesbares Label. */
  optionLabel: (bucket: string) => string;
}

const GLOBAL_AXIS = { links: "eher Chance", rechts: "eher Bedrohung" };

/* ── Options-Label-Fabriken ───────────────────────────────────────────────── */

function skala4Label(optionen: readonly string[]) {
  return (bucket: string): string => {
    const m = /^s(\d+)$/.exec(bucket);
    if (m) {
      const i = Number(m[1]);
      if (optionen[i]) return optionen[i];
    }
    return bucket;
  };
}

function sliderLabel(achse: { links: string; rechts: string }) {
  return (bucket: string): string => {
    const m = /^s(\d+)$/.exec(bucket);
    if (m) return `${m[1]}/100 (${achse.links} ↔ ${achse.rechts})`;
    return bucket;
  };
}

function poleLabel(achse?: { links: string; rechts: string }) {
  return (bucket: string): string => {
    if (bucket === "links") return achse?.links ?? "ablehnen";
    if (bucket === "rechts") return achse?.rechts ?? "zustimmen";
    return bucket;
  };
}

function wissenLabel(bucket: string): string {
  if (bucket === "richtig") return "richtig beantwortet";
  if (bucket === "falsch") return "falsch beantwortet";
  return bucket;
}

function mapLabel(map: Record<string, string>, fallback = (b: string) => b) {
  return (bucket: string): string => map[bucket] ?? fallback(bucket);
}

/* ── Registry aufbauen ────────────────────────────────────────────────────── */

function buildRegistry(): Map<string, PollMeta> {
  const reg = new Map<string, PollMeta>();
  const put = (id: string, meta: PollMeta) => reg.set(id, meta);

  // Auftakt — Vorwissen (ein Zähler je Option).
  VORWISSEN_OPTIONEN.forEach((opt, i) => {
    put(`aw-${opt.id}`, {
      frage: opt.label,
      kontext: `Auftakt · ${VORWISSEN_FRAGE}`,
      format: "auswahl",
      sortKey: `0-aw-${String(i).padStart(2, "0")}`,
      optionLabel: () => "genannt",
    });
  });

  // Auftakt/Abschluss — globale Haltungs-Polls (4er-Skala, pre + post).
  AUFTAKT_SKALA_POLLS.forEach((poll, i) => {
    const base = {
      frage: poll.frage,
      format: "skala4" as const,
      optionLabel: skala4Label(poll.optionen),
    };
    put(`${poll.pollId}-pre`, {
      ...base,
      kontext: `Auftakt · Haltung (vorher) — ${poll.achse.links} ↔ ${poll.achse.rechts}`,
      sortKey: `0-skala-${i}-pre`,
    });
    put(`${poll.pollId}-post`, {
      ...base,
      kontext: `Abschluss · Haltung (nachher) — ${poll.achse.links} ↔ ${poll.achse.rechts}`,
      sortKey: `9-skala-${i}-post`,
    });
  });

  // Auftakt/Abschluss — globaler Positions-Slider (Chance ↔ Bedrohung).
  put(`${GLOBAL_POLL_ID}-pre`, {
    frage: "Deine Position: KI eher Chance oder eher Bedrohung?",
    kontext: "Auftakt · Positions-Slider (vorher)",
    format: "slider",
    sortKey: "0-slider-pre",
    optionLabel: sliderLabel(GLOBAL_AXIS),
  });
  put(`${GLOBAL_POLL_ID}-post`, {
    frage: "Deine Position: KI eher Chance oder eher Bedrohung?",
    kontext: "Abschluss · Positions-Slider (nachher)",
    format: "slider",
    sortKey: "9-slider-post",
    optionLabel: sliderLabel(GLOBAL_AXIS),
  });

  // Stationen — Polls, Swipe-Karten, Verständnisfragen.
  for (const st of STATIONEN_V3) {
    const ort = `Station ${st.nummer}: ${st.frage}`;
    const sk = `2-${String(st.nummer).padStart(2, "0")}`;

    st.polls.forEach((poll, i) => {
      if (poll.format === "skala4") {
        const meta = {
          frage: poll.frage,
          format: "skala4" as const,
          optionLabel: skala4Label(poll.optionen),
        };
        put(`${poll.pollId}-post`, {
          ...meta,
          kontext: `${ort} · Standortbestimmung (nachher)`,
          sortKey: `${sk}-a-poll${i}-post`,
        });
        put(`${poll.pollId}-pre`, {
          ...meta,
          kontext: `${ort} · Standortbestimmung (vorher)`,
          sortKey: `${sk}-a-poll${i}-pre`,
        });
      } else {
        const meta = {
          frage: poll.frage,
          format: "slider" as const,
          optionLabel: sliderLabel(poll.achse),
        };
        put(`${poll.pollId}-pre`, {
          ...meta,
          kontext: `${ort} · Positions-Slider (vorher)`,
          sortKey: `${sk}-a-poll${i}-pre`,
        });
        put(`${poll.pollId}-post`, {
          ...meta,
          kontext: `${ort} · Positions-Slider (nachher)`,
          sortKey: `${sk}-a-poll${i}-post`,
        });
      }
    });

    st.swipe.forEach((karte, i) => {
      put(`swipe-${karte.id}`, {
        frage: karte.aussage,
        kontext: `${ort} · Werte-Karte`,
        format: "swipe",
        sortKey: `${sk}-b-swipe${i}`,
        optionLabel: poleLabel(karte.achse),
      });
    });

    st.quizPool.forEach((q, i) => {
      put(`wc-${q.id}`, {
        frage: q.kind === "mc" ? q.frage : q.aussage,
        kontext: `${ort} · Verständnisfrage`,
        format: "wissen",
        sortKey: `${sk}-c-wc${String(i).padStart(2, "0")}`,
        optionLabel: wissenLabel,
      });
    });
  }

  // Maschinenraum.
  put("mr-verstaendnis-pre", {
    frage: MR_PRE_FRAGE,
    kontext: "Maschinenraum · Verständnis (vorher)",
    format: "slider",
    sortKey: "3-mr-0",
    optionLabel: sliderLabel(MR_PRE_ACHSE),
  });
  put("mr-verstaendnis-post", {
    frage: MR_POST_FRAGE,
    kontext: "Maschinenraum · Verständnis (nachher)",
    format: "slider",
    sortKey: "3-mr-1",
    optionLabel: sliderLabel(MR_PRE_ACHSE),
  });
  put("mr-interesse", {
    frage: MR_INTERESSE_FRAGE,
    kontext: "Maschinenraum · Interesse",
    format: "slider",
    sortKey: "3-mr-2",
    optionLabel: sliderLabel(MR_INTERESSE_ACHSE),
  });
  put("mr-vertrauen", {
    frage: MR_VERTRAUEN_FRAGE,
    kontext: "Maschinenraum · Vertrauen",
    format: "auswahl",
    sortKey: "3-mr-3",
    optionLabel: mapLabel(
      Object.fromEntries(MR_VERTRAUEN_OPTIONEN.map((o) => [o.id, o.label])),
    ),
  });

  return reg;
}

let _registry: Map<string, PollMeta> | null = null;
function registry(): Map<string, PollMeta> {
  if (!_registry) _registry = buildRegistry();
  return _registry;
}

/* ── Öffentliche Lookup-Funktion ──────────────────────────────────────────── */

/** Heuristischer Fallback für unbekannte IDs (prettifiziert den Slug). */
function fallbackMeta(pollId: string): PollMeta {
  let id = pollId;
  let phase = "";
  if (id.endsWith("-pre")) {
    phase = " (vorher)";
    id = id.slice(0, -4);
  } else if (id.endsWith("-post")) {
    phase = " (nachher)";
    id = id.slice(0, -5);
  }
  let kontext = "Unbekannte Quelle";
  if (id.startsWith("wc-")) kontext = "Verständnisfrage";
  else if (id.startsWith("aw-")) kontext = "Auftakt · Vorwissen";
  else if (id.startsWith("swipe-")) kontext = "Werte-Karte";
  else if (id.startsWith("mr-")) kontext = "Maschinenraum";
  else {
    const m = /^st(\d+)-/.exec(id);
    if (m) kontext = `Station ${m[1]}`;
  }
  return {
    frage: pollId,
    kontext: kontext + phase,
    format: "auswahl",
    sortKey: `5-${pollId}`,
    optionLabel: (b) => b,
  };
}

/** Beschreibung eines (gestrippten) Poll-IDs für den Lehrer-Report. */
export function describePoll(pollId: string): PollMeta {
  return registry().get(pollId) ?? fallbackMeta(pollId);
}
