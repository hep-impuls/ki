"use client";

import { useEffect, useMemo, useState } from "react";
import { GEWICHT_EVENT, leseGewichtungen } from "../_lib/gewichtung";
import { leseInhalte } from "../_lib/inhalte";

/**
 * KontextGewichtung — zeigt im Orakel die Achtsamkeits-Gewichtung der vier
 * Kontext-Bereiche (aus «Die KI im Kontext»): einmal als deine eigene Wahl,
 * einmal als Verteilung aller Nutzenden.
 *
 * «du»  = lokale Gewichtung (`vorhang-auf:achtsamkeit:<gi>`, Stufe 0/1/2).
 * «alle» = read-only Aggregat der pro Code gespiegelten Gewichtungen über die
 *          Route `/api/orakel/kontext` (nur auf dem Server mit Service-Account,
 *          lokal erscheint ein Hinweis). Labels aus der Inhalts-Registry.
 */

const PREFIX = "vorhang-auf:achtsamkeit:";
const STUFEN = ["wenig", "mittel", "viel"] as const;

type AlleDaten =
  | { nutzer: number; aspekte: Record<string, { wenig: number; mittel: number; viel: number }> }
  | { grund: string };

export default function KontextGewichtung({ className = "" }: { className?: string }) {
  const [eigen, setEigen] = useState<Record<number, number>>({});
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [alle, setAlle] = useState<AlleDaten | null>(null);

  useEffect(() => {
    const lade = () => {
      setEigen(leseGewichtungen("vorhang-auf:achtsamkeit"));
      setLabels(leseInhalte());
    };
    lade();
    window.addEventListener(GEWICHT_EVENT, lade);
    window.addEventListener("storage", lade);
    return () => {
      window.removeEventListener(GEWICHT_EVENT, lade);
      window.removeEventListener("storage", lade);
    };
  }, []);

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

  // Alle vorkommenden Aspekt-Indizes (eigene + alle), numerisch sortiert.
  const gis = useMemo(() => {
    const set = new Set<string>();
    Object.keys(eigen).forEach((k) => set.add(String(k)));
    Object.keys(alleAspekte).forEach((k) => set.add(k));
    return [...set].sort((a, b) => Number(a) - Number(b));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eigen, alle]);

  const labelVon = (gi: string) => labels[`${PREFIX}${gi}`] ?? `Aspekt ${gi}`;

  const stufeFarbe = ["bg-outline-variant", "bg-secondary", "bg-tertiary"];
  const pillFarbe = [
    "bg-surface-container-high text-on-surface-variant",
    "bg-secondary-container text-on-secondary-container",
    "bg-tertiary-container text-on-tertiary-container",
  ];

  return (
    <section className={"rounded-2xl border border-outline-variant bg-surface-bright p-md sm:p-lg " + className}>
      <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
        <span className="material-symbols-outlined text-[18px]">tune</span>
        Achtsamkeit auf die Kontexte
      </p>
      <p className="mt-xs max-w-2xl text-body-sm text-on-surface-variant">
        Im Abschnitt «Die KI im Kontext» hast du gewichtet, wie viel Achtsamkeit
        jeder Aspekt verdient. Hier siehst du deine Wahl und daneben, wie alle
        zusammen gewichtet haben.
      </p>

      {/* Legende */}
      <div className="mt-sm flex flex-wrap items-center gap-x-md gap-y-xs text-label-sm text-on-surface-variant">
        {STUFEN.map((s, i) => (
          <span key={s} className="flex items-center gap-xs">
            <span className={"inline-block h-2.5 w-2.5 rounded-full " + stufeFarbe[i]} />
            {s}
          </span>
        ))}
      </div>

      {gis.length === 0 ? (
        <p className="mt-md rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-md text-body-sm text-on-surface-variant">
          Noch keine Gewichtungen. Gewichte im Abschnitt «Die KI im Kontext», wie
          viel Achtsamkeit ein Aspekt verdient, dann erscheinen sie hier.
        </p>
      ) : (
        <ul className="mt-md flex flex-col divide-y divide-outline-variant">
          {gis.map((gi) => {
            const meine = eigen[Number(gi)];
            const a = alleAspekte[gi];
            const total = a ? a.wenig + a.mittel + a.viel : 0;
            const teile = a ? [a.wenig, a.mittel, a.viel] : [0, 0, 0];
            return (
              <li key={gi} className="grid grid-cols-1 gap-xs py-sm sm:grid-cols-[minmax(0,1fr)_auto_10rem] sm:items-center sm:gap-md">
                <span className="min-w-0 truncate text-body-sm text-on-surface" title={labelVon(gi)}>
                  {labelVon(gi)}
                </span>
                {/* du */}
                <span className="flex-shrink-0">
                  {meine === undefined ? (
                    <span className="text-label-sm text-on-surface-variant/60">nicht gewichtet</span>
                  ) : (
                    <span
                      className={
                        "inline-flex items-center rounded-full px-sm py-[2px] text-label-sm " +
                        pillFarbe[Math.max(0, Math.min(2, meine))]
                      }
                    >
                      du: {STUFEN[Math.max(0, Math.min(2, meine))]}
                    </span>
                  )}
                </span>
                {/* alle */}
                <span className="flex items-center gap-sm">
                  {grund ? (
                    <span className="text-label-sm text-on-surface-variant/60">alle: erscheint online</span>
                  ) : total === 0 ? (
                    <span className="text-label-sm text-on-surface-variant/60">alle: noch keine</span>
                  ) : (
                    <>
                      <span className="flex h-2.5 w-24 overflow-hidden rounded-full bg-surface-container">
                        {teile.map((n, i) =>
                          n > 0 ? (
                            <span
                              key={i}
                              className={stufeFarbe[i]}
                              style={{ width: `${(n / total) * 100}%` }}
                            />
                          ) : null,
                        )}
                      </span>
                      <span
                        className="text-label-sm text-on-surface-variant"
                        style={{ fontFamily: "ui-monospace, monospace" }}
                      >
                        {total}
                      </span>
                    </>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
