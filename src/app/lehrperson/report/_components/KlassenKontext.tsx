"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ANKER,
  GRAU,
  Ring,
} from "@/app/lernen/lernseite-2/_components/KontextGewichtung";
import type { TeacherOrakelKontext } from "@/lib/types";

/**
 * KlassenKontext — der Kontext-Kreis aus dem Orakel, hier im Vergleich
 * **Klasse gegen alle Teilnehmenden**. Links das Achtsamkeits-Muster der
 * Klasse (Durchschnitt der gespiegelten Gewichtungen, aus dem Klassen-Orakel),
 * rechts das aller Nutzenden (`/api/orakel/kontext`). Gleiche Bildsprache und
 * gleiche Farbskala wie im Lernset, damit Lehrpersonen und Lernende dieselbe
 * Grafik lesen.
 */

const PREFIX = "vorhang-auf:achtsamkeit:";

type AlleDaten =
  | { nutzer: number; aspekte: Record<string, { wenig: number; mittel: number; viel: number }> }
  | { grund: string };

export default function KlassenKontext({ kontext }: { kontext: TeacherOrakelKontext[] }) {
  const [alle, setAlle] = useState<AlleDaten | null>(null);

  useEffect(() => {
    let ab = false;
    fetch("/api/orakel/kontext")
      .then((r) => r.json())
      .then((d) => {
        if (!ab) setAlle(d);
      })
      .catch(() => {
        if (!ab) setAlle({ grund: "fehler" });
      });
    return () => {
      ab = true;
    };
  }, []);

  const alleAspekte = alle && "aspekte" in alle ? alle.aspekte : {};
  const grund = alle && "grund" in alle ? alle.grund : null;
  const nutzer = alle && "nutzer" in alle ? alle.nutzer : 0;

  /* Aspekt-Index aus der Spur-Id ableiten («…:achtsamkeit:3» → 3), damit sich
     Klassen-Werte und globale Werte auf dieselben Ringabschnitte legen. */
  const klasseNachIndex = useMemo(() => {
    const m = new Map<number, TeacherOrakelKontext>();
    for (const k of kontext) {
      const gi = Number(k.id.startsWith(PREFIX) ? k.id.slice(PREFIX.length) : NaN);
      if (Number.isInteger(gi) && gi >= 0) m.set(gi, k);
    }
    return m;
  }, [kontext]);

  const n = useMemo(() => {
    const idx = [
      ...klasseNachIndex.keys(),
      ...Object.keys(alleAspekte).map(Number),
    ].filter((x) => Number.isInteger(x) && x >= 0);
    return idx.length ? Math.max(...idx) + 1 : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [klasseNachIndex, alle]);

  const labels = useMemo(
    () =>
      Array.from(
        { length: n },
        (_, gi) => klasseNachIndex.get(gi)?.titel ?? `Aspekt ${gi + 1}`,
      ),
    [klasseNachIndex, n],
  );

  const werteKlasse = useMemo(
    () => Array.from({ length: n }, (_, gi) => klasseNachIndex.get(gi)?.klasse ?? null),
    [klasseNachIndex, n],
  );

  const werteAlle = useMemo(
    () =>
      Array.from({ length: n }, (_, gi) => {
        const a = alleAspekte[gi];
        if (!a) return null;
        const total = a.wenig + a.mittel + a.viel;
        return total > 0 ? (a.mittel + 2 * a.viel) / total : null;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [alle, n],
  );

  const bewertetKlasse = werteKlasse.filter((v) => v != null).length;
  const inKlasse = kontext.reduce((s, k) => Math.max(s, k.anzahl), 0);

  if (n === 0) {
    return (
      <p className="mt-md rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-md text-body-sm text-on-surface-variant">
        Noch keine Gewichtungen. Sobald die Klasse im Abschnitt «Die KI im
        Kontext» gewichtet, erscheint hier ihr Muster neben dem aller
        Teilnehmenden.
      </p>
    );
  }

  return (
    <div className="mt-md rounded-2xl border border-outline-variant bg-surface-bright p-md sm:p-lg">
      <div className="flex flex-col items-center justify-center gap-lg sm:flex-row sm:gap-xl">
        <figure className="flex flex-col items-center gap-sm">
          <Ring
            werte={werteKlasse}
            labels={labels}
            ariaLabel="Achtsamkeits-Muster der Klasse über die Kontext-Aspekte"
          />
          <figcaption className="text-center">
            <span className="block text-body-md font-medium text-on-surface">Ihre Klasse</span>
            <span className="block text-label-sm text-on-surface-variant">
              {bewertetKlasse} von {n} gewichtet
              {inKlasse > 0
                ? ` · bis zu ${inKlasse} ${inKlasse === 1 ? "Person" : "Personen"}`
                : ""}
            </span>
          </figcaption>
        </figure>

        <figure className="flex flex-col items-center gap-sm">
          {grund ? (
            <div className="flex h-40 w-40 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-outline-variant p-md text-center sm:h-44 sm:w-44">
              <span className="text-label-sm text-on-surface-variant">erscheint online</span>
            </div>
          ) : (
            <Ring
              werte={werteAlle}
              labels={labels}
              ariaLabel="Durchschnittliches Achtsamkeits-Muster aller Teilnehmenden"
            />
          )}
          <figcaption className="text-center">
            <span className="block text-body-md font-medium text-on-surface">
              Alle Teilnehmenden
            </span>
            <span className="block text-label-sm text-on-surface-variant">
              {grund
                ? "auf dem Server sichtbar"
                : nutzer > 0
                  ? `Durchschnitt aus ${nutzer} ${nutzer === 1 ? "Person" : "Personen"}`
                  : "noch keine"}
            </span>
          </figcaption>
        </figure>
      </div>

      <div className="mt-lg flex flex-wrap items-center justify-center gap-md">
        {[
          ["nicht bewertet", GRAU],
          ["wenig", ANKER[0]],
          ["mittel", ANKER[1]],
          ["viel", ANKER[2]],
        ].map(([label, farbe]) => (
          <span
            key={label}
            className="flex items-center gap-xs text-label-sm text-on-surface-variant"
          >
            <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: farbe }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
