"use client";

import { useEffect, useMemo, useState } from "react";
import AktivitaetsNetz, {
  type NetzWerte,
} from "@/app/lernen/lernseite-2/_components/AktivitaetsNetz";
import { SPUREN_POLL_ID, zaehleAlleAusPoll } from "@/app/lernen/lernseite-2/_lib/spuren";
import { FLAECHEN_POLL_ID } from "@/app/lernen/lernseite-2/_lib/auswertung";
import { loadPollCounts, totalVotes, type PollCounts } from "@/lib/polls";
import type { TeacherOrakel } from "@/lib/types";

/**
 * KlassenRhizom — dieselbe Rhizom-Grafik, die die Lernenden von sich selbst
 * sehen, hier mit den Zahlen der Klasse im Vordergrund und allen Teilnehmenden
 * im Hintergrund. Darunter auf Knopfdruck eine KI-Einschätzung
 * (`/api/teacher/rhizom-deutung`), die nur Klassen-Aggregate übergibt.
 */

const LEER: NetzWerte = {
  punkte: 0,
  flaechen: 0,
  bildpunkte: 0,
  videos: 0,
  vertiefungen: 0,
  weiter: 0,
};

export default function KlassenRhizom({ orakel }: { orakel: TeacherOrakel }) {
  const [alle, setAlle] = useState<NetzWerte>(LEER);
  const [deutung, setDeutung] = useState<string | null>(null);
  const [grund, setGrund] = useState<string | null>(null);
  const [laedt, setLaedt] = useState(false);

  /* Hintergrundschicht: alle Teilnehmenden, aus den anonymen Aggregat-Zählern
     — genau die Quelle, aus der auch das Rhizom der Lernenden sein «alle»
     speist. */
  useEffect(() => {
    let ab = false;
    const setzeSpuren = (counts: PollCounts) => {
      if (ab) return;
      const { punkte, bildpunkte, videos, mehr, wuensche } = zaehleAlleAusPoll(counts);
      setAlle((v) => ({ ...v, punkte, bildpunkte, videos, vertiefungen: mehr, weiter: wuensche }));
    };
    const setzeFlaechen = (counts: PollCounts) => {
      if (!ab) setAlle((v) => ({ ...v, flaechen: totalVotes(counts) }));
    };
    void loadPollCounts(SPUREN_POLL_ID).then(setzeSpuren).catch(() => {});
    void loadPollCounts(FLAECHEN_POLL_ID).then(setzeFlaechen).catch(() => {});
    return () => {
      ab = true;
    };
  }, []);

  const vorgabe = useMemo(
    () => ({ vorne: orakel.rhizom as NetzWerte, hinten: alle }),
    [orakel.rhizom, alle],
  );

  const summe = useMemo(
    () => Object.values(orakel.rhizom).reduce((s, v) => s + v, 0),
    [orakel.rhizom],
  );

  async function hole() {
    setLaedt(true);
    setGrund(null);
    try {
      const res = await fetch("/api/teacher/rhizom-deutung", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          n: orakel.n,
          aktiv: orakel.aktiv,
          rhizom: orakel.rhizom,
          module: fasseModule(orakel),
          bereiche: orakel.bereiche,
          themen: [
            ...orakel.topWeiterverfolgen.map((t) => ({ titel: t.titel, art: "weiterverfolgt" })),
            ...orakel.topVertieft.map((t) => ({ titel: t.titel, art: "vertieft" })),
          ],
        }),
      });
      const d = (await res.json()) as { text?: string; grund?: string };
      if (d.text) setDeutung(d.text);
      else setGrund(d.grund ?? "fehler");
    } catch {
      setGrund("fehler");
    } finally {
      setLaedt(false);
    }
  }

  return (
    <div className="mt-md grid gap-md lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
      <AktivitaetsNetz
        titel="Aktivitäts-Rhizom der Klasse"
        unterzeile="Klasse im Vordergrund, alle Teilnehmenden im Hintergrund"
        vorgabe={vorgabe}
        legendeVorne="Klasse"
        legendeHinten="alle"
      />

      <div className="rounded-2xl border border-outline-variant bg-surface-bright p-md sm:p-lg">
        <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
          <span className="material-symbols-outlined text-[18px]">neurology</span>
          Einschätzung
        </p>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          Eine KI liest die sechs Triebe und die Abschnitte der Klasse und sagt,
          was daran auffällt. Übergeben werden nur Klassen-Summen und
          Themen-Titel, keine Codes und keine Einzelantworten. Nichts wird
          gespeichert.
        </p>

        {deutung ? (
          <div className="mt-md space-y-sm text-body-md text-on-surface">
            {deutung.split(/\n{2,}/).map((abs, i) => (
              <p key={i}>{abs}</p>
            ))}
          </div>
        ) : null}

        {grund ? (
          <p className="mt-md rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-md text-body-sm text-on-surface-variant">
            {grund === "zu-wenig"
              ? "Noch zu wenig Aktivität in der Klasse für eine Einschätzung."
              : grund === "kein-schluessel"
                ? "Die Einschätzung erscheint, sobald der Server einen KI-Schlüssel hat (online)."
                : "Die Einschätzung konnte nicht geladen werden."}
          </p>
        ) : null}

        <button
          type="button"
          onClick={hole}
          disabled={laedt || summe < 3}
          className="mt-md inline-flex items-center gap-xs rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary transition hover:bg-on-primary-container disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">
            {laedt ? "hourglass_top" : "auto_awesome"}
          </span>
          {laedt ? "liest …" : deutung ? "neu einschätzen" : "Rhizom einschätzen lassen"}
        </button>
        {summe < 3 && (
          <p className="mt-sm text-label-sm text-on-surface-variant">
            Erst ab etwas Aktivität in der Klasse sinnvoll.
          </p>
        )}
      </div>
    </div>
  );
}

/** Abschnitts-Zahlen zu Modul-Summen bündeln (für die Einschätzung). */
export function fasseModule(orakel: TeacherOrakel) {
  const map = new Map<
    string,
    { modul: string; angeschaut: number; vertieft: number; weiterverfolgen: number }
  >();
  for (const b of orakel.bereiche) {
    const e = map.get(b.modul) ?? {
      modul: b.modul,
      angeschaut: 0,
      vertieft: 0,
      weiterverfolgen: 0,
    };
    e.angeschaut += b.angeschaut;
    e.vertieft += b.vertieft;
    e.weiterverfolgen += b.weiterverfolgen;
    map.set(b.modul, e);
  }
  return [...map.values()];
}
