"use client";

import { useEffect, useState } from "react";
import { pollWahl } from "../_lib/stationStore";
import { GLOBAL_STATION_ID } from "../_lib/landkarteData";
import { STATIONEN_V3 } from "../_data/stationenV3";
import { AUFTAKT_SKALA_POLLS } from "../_data/auftaktPolls";
import type { PollSkala4 } from "../_data/types";
import PollAuswertung, { type AuswertungEintrag } from "./PollAuswertung";

/**
 * KlassenSpiegel (M6) — **Ich vs. Klasse vs. alle** auf den **4er-Skala**-Achsen
 * der globalen Gesamthaltung und der Stationen. Seit #8 auf dem geteilten
 * `PollAuswertung`-Baustein aufgebaut (gleiche Optik wie die Serien-Auswertungen
 * im Auftakt und nach jeder Station).
 *
 * **ki26-konform:** liest nur anonyme Aggregat-Zähler (Post-Buckets); die
 * persönliche Stufe stammt lokal aus `stationStore`.
 */

/** Globale Gesamthaltung zuerst, dann je Station die erste 4er-Skala-Frage (Post). */
function alleEintraege(): AuswertungEintrag[] {
  const out: AuswertungEintrag[] = [];
  for (const poll of AUFTAKT_SKALA_POLLS) {
    out.push({ stationId: GLOBAL_STATION_ID, titel: "Gesamthaltung", poll, phase: "post" });
  }
  for (const st of STATIONEN_V3) {
    const poll = st.polls.find((p): p is PollSkala4 => p.format === "skala4");
    if (!poll) continue;
    out.push({ stationId: st.id, titel: `Station ${st.nummer}`, poll, phase: "post" });
  }
  return out;
}

export default function KlassenSpiegel() {
  // Erst nach Mount: welche Achsen haben einen lokalen Post-Wert?
  const [eintraege, setEintraege] = useState<AuswertungEintrag[] | null>(null);
  useEffect(() => {
    setEintraege(alleEintraege().filter((e) => pollWahl(e.stationId, e.poll.id, "post") != null));
  }, []);

  if (eintraege == null) {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg text-body-md text-on-surface-variant">
        Klassen-Spiegel wird vorbereitet …
      </div>
    );
  }

  if (eintraege.length === 0) {
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

  return <PollAuswertung eintraege={eintraege} />;
}
