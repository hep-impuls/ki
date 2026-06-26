"use client";

import { useEffect, useState } from "react";
import { loadPollCounts, subscribePollCounts, type PollCounts } from "@/lib/polls";
import { pollId, resolveKlasse } from "../_lib/unitPolls";
import { pollWahl } from "../_lib/stationStore";
import { GLOBAL_STATION_ID } from "../_lib/landkarteData";
import { STATIONEN_V3 } from "../_data/stationenV3";
import { AUFTAKT_SKALA_POLLS } from "../_data/auftaktPolls";
import { LANDKARTE_ACHSEN } from "../_data/landkarte";
import type { PollSkala4 } from "../_data/types";
import Verteilung, { type VerteilungOption } from "./Verteilung";

/**
 * KlassenSpiegel (M6) — **Ich vs. Klasse vs. alle** auf den **4er-Skala**-Achsen
 * der Stationen (v3 §6/§11: Slider für Bewegung, 4er-Skala für Aggregation). Pro
 * absolvierter Station mit lokalem Post-Wert eine Zeile: mein Punkt (lokal) plus
 * die anonymen Verteilungen der Klasse und aller Teilnehmenden.
 *
 * **ki26-konform:** liest nur anonyme Aggregat-Zähler (`polls.ts`,
 * `abstimmungen/ki26/polls/{pollId}.counts`). Das **Schreiben** dieser Zähler
 * ist seit M8 verdrahtet (`castSkalaPost` in PollFrame, Post-Phase). Bucket-
 * Schema: `s{Index}` (0..3) je 4er-Skala-Option; gelesen unter
 * `pollId.poll("{pid}-post")` bzw. `pollId.klassePoll(code,"{pid}-post")`.
 */

interface SkalaAchse {
  stationId: string;
  /** Zeilen-Titel, z.B. "Station 1" oder "Gesamthaltung". */
  titel: string;
  poll: PollSkala4;
  optionen: VerteilungOption[];
  achse?: { links: string; rechts: string };
}

/**
 * Globale Auftakt/Abschluss-4er-Skala-Polls (übergreifende Gesamthaltung). Stehen
 * im Spiegel **vor** den Stationen; lokaler Wert unter `GLOBAL_STATION_ID`.
 */
function globaleAchsen(): SkalaAchse[] {
  return AUFTAKT_SKALA_POLLS.map((poll) => ({
    stationId: GLOBAL_STATION_ID,
    titel: "Gesamthaltung",
    poll,
    optionen: poll.optionen.map((label, i) => ({ id: `s${i}`, label })),
    achse: poll.achse,
  }));
}

/** Statische Liste: je Station die erste 4er-Skala-Frage (Aggregations-Achse). */
function skalaAchsen(): SkalaAchse[] {
  const out: SkalaAchse[] = [];
  for (const st of STATIONEN_V3) {
    const poll = st.polls.find((p): p is PollSkala4 => p.format === "skala4");
    if (!poll) continue;
    const axis = LANDKARTE_ACHSEN.find((a) => a.id === poll.landkarteAxis);
    out.push({
      stationId: st.id,
      titel: `Station ${st.nummer}`,
      poll,
      optionen: poll.optionen.map((label, i) => ({ id: `s${i}`, label })),
      achse: axis ? { links: axis.links, rechts: axis.rechts } : undefined,
    });
  }
  return out;
}

/** Globale Gesamthaltung zuerst, dann die Stationen. */
function alleAchsen(): SkalaAchse[] {
  return [...globaleAchsen(), ...skalaAchsen()];
}

function IchMarker({ idx, optionen }: { idx: number | null; optionen: VerteilungOption[] }) {
  return (
    <div className="flex gap-xs">
      {optionen.map((o, i) => (
        <div
          key={o.id}
          className={
            idx === i
              ? "flex h-9 flex-1 items-center justify-center rounded-lg bg-primary px-xs text-center text-label-sm text-on-primary"
              : "flex h-9 flex-1 items-center justify-center rounded-lg border border-outline-variant bg-surface-bright px-xs text-center text-label-sm text-on-surface-variant"
          }
        >
          {idx === i ? "ich" : i + 1}
        </div>
      ))}
    </div>
  );
}

function AchsenZeile({ achse }: { achse: SkalaAchse }) {
  const [klasse, setKlasse] = useState<PollCounts>({});
  const [alle, setAlle] = useState<PollCounts>({});
  const meinIdx = pollWahl(achse.stationId, achse.poll.id, "post");
  const meinPick = meinIdx != null ? `s${meinIdx}` : undefined;
  const postId = `${achse.poll.pollId}-post`;

  useEffect(() => {
    const code = resolveKlasse();
    let aktiv = true;
    void loadPollCounts(pollId.klassePoll(code, postId)).then((c) => {
      if (aktiv) setKlasse(c);
    });
    const unsub = subscribePollCounts(pollId.poll(postId), setAlle);
    return () => {
      aktiv = false;
      unsub();
    };
  }, [postId]);

  return (
    <section className="flex flex-col gap-md rounded-xl border border-outline-variant bg-surface-bright p-lg">
      <div>
        <p className="text-label-sm uppercase tracking-wider text-tertiary">{achse.titel}</p>
        <p className="text-body-md text-on-surface">{achse.poll.frage}</p>
      </div>

      <div className="flex flex-col gap-xs">
        <p className="text-label-sm text-on-surface-variant">Ich</p>
        <IchMarker idx={meinIdx} optionen={achse.optionen} />
      </div>

      <div className="flex flex-col gap-xs">
        <p className="text-label-sm text-on-surface-variant">Meine Klasse (anonym)</p>
        <Verteilung counts={klasse} optionen={achse.optionen} farbe="bg-tertiary" meinPick={meinPick} achse={achse.achse} />
      </div>

      <div className="flex flex-col gap-xs">
        <p className="text-label-sm text-on-surface-variant">Alle Teilnehmenden</p>
        <Verteilung counts={alle} optionen={achse.optionen} farbe="bg-primary" meinPick={meinPick} achse={achse.achse} />
      </div>
    </section>
  );
}

export default function KlassenSpiegel() {
  // Erst nach Mount: welche Achsen haben einen lokalen Post-Wert?
  const [achsen, setAchsen] = useState<SkalaAchse[] | null>(null);
  useEffect(() => {
    setAchsen(alleAchsen().filter((a) => pollWahl(a.stationId, a.poll.id, "post") != null));
  }, []);

  if (achsen == null) {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg text-body-md text-on-surface-variant">
        Klassen-Spiegel wird vorbereitet …
      </div>
    );
  }

  if (achsen.length === 0) {
    return (
      <div className="flex items-start gap-md rounded-xl border border-outline-variant bg-surface-container-low p-lg">
        <span className="material-symbols-outlined text-[24px] text-tertiary">groups</span>
        <p className="text-body-md text-on-surface">
          Sobald du eine Station bis zur «Meinung nachher» abschliesst, vergleichst du dich hier
          anonym mit deiner Klasse und allen Teilnehmenden.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-md">
      {achsen.map((a) => (
        <AchsenZeile key={`${a.stationId}:${a.poll.id}`} achse={a} />
      ))}
    </div>
  );
}
