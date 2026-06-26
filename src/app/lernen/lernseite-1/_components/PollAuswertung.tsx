"use client";

import { useEffect, useState } from "react";
import { loadPollCounts, subscribePollCounts, type PollCounts } from "@/lib/polls";
import { pollId, resolveKlasse } from "../_lib/unitPolls";
import { pollWahl } from "../_lib/stationStore";
import { LANDKARTE_ACHSEN } from "../_data/landkarte";
import type { PollSkala4 } from "../_data/types";
import Verteilung, { type VerteilungOption } from "./Verteilung";

/**
 * PollAuswertung (#8) — der geteilte «Ich · meine Klasse · alle»-Baustein für
 * 4er-Skala-Polls. Aus `KlassenSpiegel` herausgelöst, damit er **nach jeder
 * Poll-Serie** wiederverwendet werden kann (Auftakt-Haltung, Station-Befund) und
 * der Abschluss-Spiegel dieselbe Optik nutzt — keine Doppelpflege.
 *
 * **ki26-konform:** liest ausschliesslich anonyme Aggregat-Zähler
 * (`abstimmungen/ki26/polls/{pollId}.counts`). Die persönliche Stufe («Ich»)
 * stammt lokal aus `stationStore` (`pollWahl`). Fehlt das Klassen-/Gesamt-Aggregat
 * (z.B. noch niemand abgestimmt), rendert die Verteilung freundlich leer.
 */

export interface AuswertungEintrag {
  /** Storage-Key der lokalen «Ich»-Wahl (Station-ID oder GLOBAL_STATION_ID). */
  stationId: string;
  /** optionaler Zeilen-Titel (z.B. "Station 3", "Gesamthaltung"). */
  titel?: string;
  /** die 4er-Skala-Frage (liefert id, pollId, optionen). */
  poll: PollSkala4;
  /** pre/post — bestimmt Bucket-Key `{pollId}-{phase}` und lokale Wahl. */
  phase: "pre" | "post";
}

/** Pol-Beschriftung: direkt am Poll (globale Auftakt-Polls) oder via Landkarte-Achse. */
function achseVon(poll: PollSkala4): { links: string; rechts: string } | undefined {
  const direkt = (poll as { achse?: { links: string; rechts: string } }).achse;
  if (direkt) return direkt;
  const a = LANDKARTE_ACHSEN.find((x) => x.id === poll.landkarteAxis);
  return a ? { links: a.links, rechts: a.rechts } : undefined;
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

export function AuswertungZeile({ eintrag }: { eintrag: AuswertungEintrag }) {
  const { stationId, titel, poll, phase } = eintrag;
  const optionen: VerteilungOption[] = poll.optionen.map((label, i) => ({ id: `s${i}`, label }));
  const achse = achseVon(poll);
  const meinIdx = pollWahl(stationId, poll.id, phase);
  const meinPick = meinIdx != null ? `s${meinIdx}` : undefined;
  const key = `${poll.pollId}-${phase}`;

  const [klasse, setKlasse] = useState<PollCounts>({});
  const [alle, setAlle] = useState<PollCounts>({});

  useEffect(() => {
    const code = resolveKlasse();
    let aktiv = true;
    void loadPollCounts(pollId.klassePoll(code, key)).then((c) => {
      if (aktiv) setKlasse(c);
    });
    const unsub = subscribePollCounts(pollId.poll(key), setAlle);
    return () => {
      aktiv = false;
      unsub();
    };
  }, [key]);

  return (
    <section className="flex flex-col gap-md rounded-xl border border-outline-variant bg-surface-bright p-lg">
      <div>
        {titel && <p className="text-label-sm uppercase tracking-wider text-tertiary">{titel}</p>}
        <p className="text-body-md text-on-surface">{poll.frage}</p>
      </div>

      <div className="flex flex-col gap-xs">
        <p className="text-label-sm text-on-surface-variant">Ich</p>
        <IchMarker idx={meinIdx} optionen={optionen} />
      </div>

      <div className="flex flex-col gap-xs">
        <p className="text-label-sm text-on-surface-variant">Meine Klasse (anonym)</p>
        <Verteilung counts={klasse} optionen={optionen} farbe="bg-tertiary" meinPick={meinPick} achse={achse} />
      </div>

      <div className="flex flex-col gap-xs">
        <p className="text-label-sm text-on-surface-variant">Alle Teilnehmenden</p>
        <Verteilung counts={alle} optionen={optionen} farbe="bg-primary" meinPick={meinPick} achse={achse} />
      </div>
    </section>
  );
}

export default function PollAuswertung({
  eintraege,
  titel,
  hinweis,
}: {
  eintraege: AuswertungEintrag[];
  /** optionale Überschrift über der Serie (z.B. "Ich, meine Klasse, alle"). */
  titel?: string;
  /** optionaler Hinweistext unter der Serie. */
  hinweis?: string;
}) {
  if (eintraege.length === 0) return null;
  return (
    <div className="flex flex-col gap-md">
      {titel && (
        <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-tertiary">
          <span className="material-symbols-outlined text-[18px]">groups</span>
          {titel}
        </p>
      )}
      {eintraege.map((e) => (
        <AuswertungZeile key={`${e.stationId}:${e.poll.id}:${e.phase}`} eintrag={e} />
      ))}
      {hinweis && <p className="text-label-sm text-on-surface-variant">{hinweis}</p>}
    </div>
  );
}
