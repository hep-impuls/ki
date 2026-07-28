"use client";

/**
 * Abschlussbericht (2026-07-28) — sammelt **alles**, was die Lernperson in
 * Lernseite 1 lokal hinterlassen hat, zu einem einzigen Dokument: Auftakt
 * (Vorwissen + Freitext, Ausgangsposition, Haltungsfragen, Werte-Karten), jedes
 * bearbeitete Thema (Meinung vorher/nachher, Werte, Faktencheck, jede
 * Verständnisfrage mit der tatsächlich gegebenen Antwort, Reflexionssatz,
 * Badges, Erfüllungsgrad) und die Gesamtbilanz.
 *
 * Ersetzt das frühere «Zertifikat», das nur Stationstitel, Badges und eine
 * Punktzahl zeigte — und das erst ab 3 Stationen existierte. Der Bericht hat
 * **keine Schwelle**: er bildet ab, was da ist.
 *
 * **ki26-konform:** Alles wird **im Browser** aus localStorage gelesen und dort
 * gerendert. Es gibt **keinen** Cloud-Write und keinen Upload — Drucken/PDF und
 * die Markdown-Datei entstehen lokal, und nur die Lernperson entscheidet, ob sie
 * das Dokument weitergibt.
 */

import { VORWISSEN_OPTIONEN } from "../_data/auftakt";
import { AUFTAKT_SKALA_POLLS } from "../_data/auftaktPolls";
import { AUFTAKT_SWIPE_KARTEN, AUFTAKT_SWIPE_STATION } from "../_data/auftaktSwipe";
import { BADGE_FAMILIEN } from "../_data/badges";
import { FAKTEN_FALSCH } from "../_data/faktenPruefung";
import { STATIONEN_V3 } from "../_data/stationenV3";
import type { BadgeFamilie, BadgeRef, PollFrage, QuizFrage, Station } from "../_data/types";
import { GLOBAL_POLL_ID, GLOBAL_STATION_ID } from "./landkarteData";
import { gesamtErfuellung, stationErfuellung, type Erfuellung } from "./erfuellung";
import {
  abschlussDatum,
  badgeSammlung,
  faktZustand,
  istAbgeschlossen,
  pollWahl,
  quizErgebnis,
  quizScore,
  reflexion,
  stationBonus,
  stationErfuellt,
  stationProzent,
  swipePick,
} from "./stationStore";

/* ── Bausteine ─────────────────────────────────────────────────────────────── */

export interface BerichtMeinungPaar {
  frage: string;
  vorher: string | null;
  nachher: string | null;
}

export interface BerichtWert {
  aussage: string;
  antwort: string | null;
}

export interface BerichtFakt {
  /** Aussage, wie sie gezeigt wurde (echt oder verfälscht). */
  gezeigt: string;
  /** Der belegte Sachverhalt. */
  richtigstellung: string;
  /** War die gezeigte Aussage wahr? */
  gezeigtWahr: boolean;
  /** Antwort der Lernperson: «Wahr»/«Falsch»; null = nicht beantwortet. */
  antwort: string | null;
  korrekt: boolean | null;
  quelle: string;
  quelleUrl: string;
}

export interface BerichtFrage {
  frage: string;
  antwort: string | null;
  korrekt: boolean | null;
  punkte: number;
  max: number;
}

export interface BerichtThema {
  id: string;
  kurzname: string;
  frage: string;
  icon: string;
  tags: string[];
  freiwillig: boolean;
  erfuellung: Erfuellung;
  /** Themen-Abschluss (60 %-Quiz-Gate) — vergibt die Badges. */
  abgeschlossen: boolean;
  /** ISO-Zeitpunkt des Abschlusses (oder null). */
  datum: string | null;
  quizPunkte: number;
  quizMax: number;
  quizProzent: number;
  faktenBonus: number;
  badges: BadgeRef[];
  meinungen: BerichtMeinungPaar[];
  werte: BerichtWert[];
  fakten: BerichtFakt[];
  fragen: BerichtFrage[];
  reflexion: string;
}

export interface BerichtAuftakt {
  /** Gewählte Vorwissen-Optionen als Labels. */
  vorwissen: string[];
  /** Freitext aus dem Auftakt (kann leer sein). */
  freitext: string;
  sliderVor: number | null;
  sliderNach: number | null;
  haltung: BerichtMeinungPaar[];
  werte: BerichtWert[];
}

export interface Bericht {
  /** Erstellungsdatum, formatiert (de-CH). */
  datum: string;
  auftakt: BerichtAuftakt;
  themen: BerichtThema[];
  /** Themen mit mindestens einem bearbeiteten Element. */
  bearbeitet: number;
  /** Themen, die das 60 %-Gate erfüllt haben. */
  abgeschlossen: number;
  gesamt: Erfuellung;
  badges: { familie: BadgeFamilie; label: string; icon: string; anzahl: number }[];
  quizPunkte: number;
  quizMax: number;
}

/* ── Antworten in lesbaren Text übersetzen ─────────────────────────────────── */

const AUFTAKT_STORAGE = "ki26-v3-auftakt";
const SLIDER_LINKS = "Bedrohung";
const SLIDER_RECHTS = "Chance";

/** Poll-Antwort → Text: 4er-Skala als Stufen-Label, Slider als Wert mit Polen. */
function pollText(poll: PollFrage, wert: number | null): string | null {
  if (wert == null) return null;
  if (poll.format === "skala4") return poll.optionen[wert] ?? String(wert);
  return `${wert} von 100 (${poll.achse.links} ↔ ${poll.achse.rechts})`;
}

function swipeText(karte: { achse?: { links: string; rechts: string } }, pick: "links" | "rechts" | null) {
  if (pick == null) return null;
  const links = karte.achse?.links ?? "Sehe ich anders";
  const rechts = karte.achse?.rechts ?? "Sehe ich auch so";
  return pick === "links" ? links : rechts;
}

/** Verständnisfrage + gespeicherte Antwort → Bericht-Eintrag. */
function frageEintrag(stationId: string, frage: QuizFrage): BerichtFrage {
  const e = quizErgebnis(stationId, frage.id);
  const max = frage.punkte ?? 1;
  if (frage.kind === "mc") {
    const antwort =
      e && typeof e.antwort === "number" ? (frage.optionen[e.antwort]?.label ?? null) : null;
    return {
      frage: frage.frage,
      antwort,
      korrekt: e ? e.correct : null,
      punkte: e?.punkte ?? 0,
      max,
    };
  }
  const antwort = e && typeof e.antwort === "boolean" ? (e.antwort ? "Wahr" : "Falsch") : null;
  return {
    frage: frage.aussage,
    antwort,
    korrekt: e ? e.correct : null,
    punkte: e?.punkte ?? 0,
    max,
  };
}

function themaEintrag(station: Station): BerichtThema {
  const score = quizScore(station.id);
  return {
    id: station.id,
    kurzname: station.kurzname,
    frage: station.frage,
    icon: station.icon,
    tags: station.tags,
    freiwillig: !!station.freiwillig,
    erfuellung: stationErfuellung(station),
    abgeschlossen: istAbgeschlossen(station.id) || stationErfuellt(station.id),
    datum: abschlussDatum(station.id),
    quizPunkte: score.punkte,
    quizMax: score.max,
    quizProzent: Math.round(stationProzent(station.id) * 100),
    faktenBonus: Math.round(stationBonus(station.id) * 100),
    badges: station.badges,
    meinungen: station.polls.map((poll) => ({
      frage: poll.frage,
      vorher: pollText(poll, pollWahl(station.id, poll.id, "pre")),
      nachher: pollText(poll, pollWahl(station.id, poll.id, "post")),
    })),
    werte: station.swipe.map((karte) => ({
      aussage: karte.aussage,
      antwort: swipeText(karte, swipePick(station.id, karte.id)?.pick ?? null),
    })),
    fakten: station.fakten.map((fakt) => {
      const z = faktZustand(station.id, fakt.id);
      return {
        gezeigt: z && !z.gezeigtWahr ? (FAKTEN_FALSCH[fakt.id] ?? fakt.claim) : fakt.claim,
        richtigstellung: fakt.figure ? `${fakt.claim} (${fakt.figure})` : fakt.claim,
        gezeigtWahr: z?.gezeigtWahr ?? true,
        antwort: z ? (z.antwort ? "Wahr" : "Falsch") : null,
        korrekt: z ? z.correct : null,
        quelle: `${fakt.sourceName} (${fakt.date})`,
        quelleUrl: fakt.sourceUrl,
      };
    }),
    fragen: station.quizPool.map((q) => frageEintrag(station.id, q)),
    reflexion: reflexion(station.id),
  };
}

function auftaktEintrag(): BerichtAuftakt {
  let gewaehlt: string[] = [];
  let freitext = "";
  try {
    const raw = localStorage.getItem(AUFTAKT_STORAGE);
    if (raw) {
      const s = JSON.parse(raw) as { gewaehlt?: string[]; freitext?: string };
      gewaehlt = s.gewaehlt ?? [];
      freitext = s.freitext ?? "";
    }
  } catch {
    /* ignore (privater Modus, kaputter Eintrag) */
  }
  return {
    vorwissen: gewaehlt.map((id) => VORWISSEN_OPTIONEN.find((o) => o.id === id)?.label ?? id),
    freitext,
    sliderVor: pollWahl(GLOBAL_STATION_ID, GLOBAL_POLL_ID, "pre"),
    sliderNach: pollWahl(GLOBAL_STATION_ID, GLOBAL_POLL_ID, "post"),
    haltung: AUFTAKT_SKALA_POLLS.map((poll) => ({
      frage: poll.frage,
      vorher: pollText(poll, pollWahl(GLOBAL_STATION_ID, poll.id, "pre")),
      nachher: pollText(poll, pollWahl(GLOBAL_STATION_ID, poll.id, "post")),
    })),
    werte: AUFTAKT_SWIPE_KARTEN.map((karte) => ({
      aussage: karte.aussage,
      antwort: swipeText(karte, swipePick(AUFTAKT_SWIPE_STATION, karte.id)?.pick ?? null),
    })),
  };
}

/** Den vollständigen Bericht bauen — nur nach Mount aufrufen (liest localStorage). */
export function buildBericht(): Bericht {
  const themen = STATIONEN_V3.map(themaEintrag);
  const sammlung = badgeSammlung();
  return {
    datum: new Date().toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    auftakt: auftaktEintrag(),
    themen,
    bearbeitet: themen.filter((t) => t.erfuellung.erledigt > 0).length,
    abgeschlossen: themen.filter((t) => t.abgeschlossen).length,
    gesamt: gesamtErfuellung(STATIONEN_V3),
    badges: (Object.entries(sammlung) as [BadgeFamilie, number][])
      .map(([familie, anzahl]) => ({
        familie,
        label: BADGE_FAMILIEN[familie].label,
        icon: BADGE_FAMILIEN[familie].icon,
        anzahl,
      }))
      .sort((a, b) => b.anzahl - a.anzahl),
    quizPunkte: themen.reduce((s, t) => s + t.quizPunkte, 0),
    quizMax: themen.reduce((s, t) => s + t.quizMax, 0),
  };
}

/* ── Markdown-Export (Download als .md — rein lokal erzeugt) ───────────────── */

const strich = (s: string | null) => (s && s.trim() !== "" ? s : "—");

function sliderText(wert: number | null) {
  return wert == null ? "—" : `${wert} von 100 (${SLIDER_LINKS} ↔ ${SLIDER_RECHTS})`;
}

/** Den Bericht als Markdown-Text serialisieren (für den Datei-Download). */
export function berichtAlsMarkdown(b: Bericht): string {
  const z: string[] = [];
  z.push("# Mein Abschlussbericht — KI im Alltag");
  z.push("");
  z.push(`Erstellt am ${b.datum}`);
  z.push("");
  z.push(
    `Bearbeitet: ${b.bearbeitet} von ${b.themen.length} Themen · Erfüllungsgrad gesamt: ${b.gesamt.prozent} % · Verständnisfragen: ${b.quizPunkte} von ${b.quizMax} Punkten`,
  );
  if (b.badges.length > 0) {
    z.push("");
    z.push(`Badges: ${b.badges.map((x) => `${x.label}${x.anzahl > 1 ? ` ×${x.anzahl}` : ""}`).join(", ")}`);
  }

  z.push("");
  z.push("## Auftakt");
  z.push("");
  z.push(`**Wo mir KI begegnet ist:** ${b.auftakt.vorwissen.length ? b.auftakt.vorwissen.join(", ") : "—"}`);
  z.push("");
  z.push(`**Mein Freitext:** ${strich(b.auftakt.freitext)}`);
  z.push("");
  z.push(`**Ausgangsposition:** ${sliderText(b.auftakt.sliderVor)}`);
  z.push(`**Position am Ende:** ${sliderText(b.auftakt.sliderNach)}`);
  if (b.auftakt.sliderVor != null && b.auftakt.sliderNach != null) {
    const d = b.auftakt.sliderNach - b.auftakt.sliderVor;
    z.push(
      `**Verschiebung:** ${
        d === 0
          ? "unverändert"
          : d > 0
            ? `${d} Punkte Richtung ${SLIDER_RECHTS}`
            : `${Math.abs(d)} Punkte Richtung ${SLIDER_LINKS}`
      }`,
    );
  }
  z.push("");
  z.push("### Haltungsfragen");
  for (const h of b.auftakt.haltung) {
    z.push("");
    z.push(`- **${h.frage}**`);
    z.push(`  - vorher: ${strich(h.vorher)}`);
    z.push(`  - nachher: ${strich(h.nachher)}`);
  }
  z.push("");
  z.push("### Werte-Karten");
  for (const w of b.auftakt.werte) {
    z.push(`- ${w.aussage} → ${strich(w.antwort)}`);
  }

  for (const t of b.themen) {
    if (t.erfuellung.erledigt === 0) continue;
    z.push("");
    z.push(`## Thema · ${t.kurzname} — ${t.frage}`);
    z.push("");
    z.push(
      `${t.erfuellung.prozent} % bearbeitet (${t.erfuellung.erledigt} von ${t.erfuellung.gesamt} Elementen) · ${
        t.abgeschlossen ? "abgeschlossen" : "noch offen"
      } · Verständnisfragen: ${t.quizPunkte} von ${t.quizMax} Punkten (${t.quizProzent} %)`,
    );

    z.push("");
    z.push("### Meine Meinung — vorher und nachher");
    for (const m of t.meinungen) {
      z.push("");
      z.push(`- **${m.frage}**`);
      z.push(`  - vorher: ${strich(m.vorher)}`);
      z.push(`  - nachher: ${strich(m.nachher)}`);
    }

    z.push("");
    z.push("### Meine Werte-Karten");
    for (const w of t.werte) z.push(`- ${w.aussage} → ${strich(w.antwort)}`);

    z.push("");
    z.push("### Faktencheck");
    for (const f of t.fakten) {
      const urteil =
        f.antwort == null ? "nicht beantwortet" : f.korrekt ? "richtig erkannt" : "nicht erkannt";
      z.push(`- ${f.richtigstellung} — meine Antwort: ${strich(f.antwort)} (${urteil}); Quelle: ${f.quelle}`);
    }

    z.push("");
    z.push("### Verständnisfragen");
    for (const q of t.fragen) {
      const urteil =
        q.antwort == null ? "nicht beantwortet" : q.korrekt ? "richtig" : "falsch";
      z.push(`- ${q.frage}`);
      z.push(`  - meine Antwort: ${strich(q.antwort)} (${urteil})`);
    }

    z.push("");
    z.push("### Mein Satz zum Thema");
    z.push("");
    z.push(strich(t.reflexion));
  }

  z.push("");
  z.push("---");
  z.push("");
  z.push(
    "Selbstgesteuerte KI-Einheit · alle Angaben lokal auf diesem Gerät erzeugt, keine Bewertung.",
  );
  return z.join("\n");
}
