"use client";

import { useEffect, useState } from "react";
import type { BadgeFamilie, Station } from "../_data/types";
import { ZERTIFIKAT_SCHWELLE } from "../_data/types";
import { STATIONEN_V3 } from "../_data/stationenV3";
import { BADGE_FAMILIEN } from "../_data/badges";
import { abgeschlosseneStationen, badgeSammlung, quizScore } from "../_lib/stationStore";

/**
 * Zertifikat (M5) — **client-seitig** aus dem lokalen Stations-Store abgeleitet
 * (v3 §3/§15.3). Listet die abgeschlossenen Stationen, die gesammelten Badges je
 * Familie (Doppelvergabe → Stufe), das Ausstellungsdatum und die gesamte
 * Quiz-Punktzahl. Wird **ab `ZERTIFIKAT_SCHWELLE` (3)** abgeschlossenen Stationen
 * erzeugt; weitere Stationen ergänzen Badges und Punkte.
 *
 * **ki26-konform:** rein lokal (localStorage), kein eigener Store, **keine**
 * Cloud-Writes. Druckbar (`window.print()` → als PDF speicherbar).
 */

interface ZertifikatDaten {
  stationen: Station[];
  badges: { familie: BadgeFamilie; anzahl: number }[];
  punkte: number;
  max: number;
  datum: string;
}

function ladeDaten(): ZertifikatDaten {
  const ids = abgeschlosseneStationen();
  // Reihenfolge der Stationen stabil = Katalog-Reihenfolge (nicht Abschluss-Zeitpunkt).
  const stationen = STATIONEN_V3.filter((s) => ids.includes(s.id));
  const badges = (Object.entries(badgeSammlung()) as [BadgeFamilie, number][])
    .map(([familie, anzahl]) => ({ familie, anzahl }))
    .sort((a, b) => b.anzahl - a.anzahl);
  let punkte = 0;
  let max = 0;
  for (const id of ids) {
    const s = quizScore(id);
    punkte += s.punkte;
    max += s.max;
  }
  const datum = new Date().toLocaleDateString("de-CH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return { stationen, badges, punkte, max, datum };
}

export default function Zertifikat({ onBack }: { onBack?: () => void }) {
  // Erst nach Mount aus localStorage lesen (SSR-Hydration-sicher).
  const [daten, setDaten] = useState<ZertifikatDaten | null>(null);
  useEffect(() => setDaten(ladeDaten()), []);

  if (!daten) {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg text-body-md text-on-surface-variant">
        Zertifikat wird vorbereitet …
      </div>
    );
  }

  const genug = daten.stationen.length >= ZERTIFIKAT_SCHWELLE;

  if (!genug) {
    return (
      <div className="flex flex-col gap-md">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-xs text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Zurück zum Zeitstrahl
          </button>
        )}
        <div className="flex items-start gap-md rounded-xl border border-outline-variant bg-surface-container-low p-lg">
          <span className="material-symbols-outlined text-[24px] text-tertiary">workspace_premium</span>
          <p className="text-body-md text-on-surface">
            Schliesse mindestens <strong>{ZERTIFIKAT_SCHWELLE}</strong> Stationen ab, um dein
            Zertifikat zu erzeugen. Bisher: <strong>{daten.stationen.length}</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-md">
      {/* Steuerleiste — beim Druck ausgeblendet */}
      <div className="flex items-center justify-between gap-md print:hidden">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-xs text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Zurück zum Zeitstrahl
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-xs rounded-lg bg-primary px-lg py-sm text-label-md text-on-primary transition-opacity hover:opacity-90"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          Drucken / als PDF speichern
        </button>
      </div>

      {/* Die Urkunde */}
      <article className="flex flex-col gap-lg rounded-xl border-2 border-tertiary bg-surface-bright p-lg shadow-sm">
        <header className="flex flex-col items-center gap-sm border-b border-outline-variant pb-lg text-center">
          <span className="material-symbols-outlined text-[40px] text-tertiary">workspace_premium</span>
          <p className="text-label-md uppercase tracking-wider text-tertiary">Zertifikat</p>
          <h2 className="text-headline-lg text-on-surface">KI im Alltag — meine Stationen</h2>
          <p className="text-body-md text-on-surface-variant">
            Ausgestellt am {daten.datum} · {daten.stationen.length} von 7 Stationen abgeschlossen
          </p>
        </header>

        {/* Abgeschlossene Stationen */}
        <section className="flex flex-col gap-sm">
          <h3 className="flex items-center gap-xs text-label-md uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Abgeschlossene Stationen
          </h3>
          <ul className="flex flex-col gap-xs">
            {daten.stationen.map((st) => (
              <li
                key={st.id}
                className="flex items-center gap-sm rounded-lg bg-surface-container-low px-md py-sm text-body-md text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px] text-tertiary">{st.icon}</span>
                <span className="text-label-sm text-on-surface-variant">Station {st.nummer}</span>
                <span>{st.frage}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Gesammelte Badges */}
        <section className="flex flex-col gap-sm">
          <h3 className="flex items-center gap-xs text-label-md uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined text-[18px]">military_tech</span>
            Gesammelte Badges
          </h3>
          <div className="flex flex-wrap gap-md">
            {daten.badges.map(({ familie, anzahl }) => {
              const info = BADGE_FAMILIEN[familie];
              return (
                <div
                  key={familie}
                  className="inline-flex items-center gap-sm rounded-xl border border-outline-variant bg-tertiary-container px-md py-sm text-on-tertiary-container"
                >
                  <span className="material-symbols-outlined text-[22px]">{info.icon}</span>
                  <span className="text-body-md font-semibold">{info.label}</span>
                  {anzahl > 1 && <span className="text-label-md">×{anzahl}</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* Quiz-Punkte */}
        {daten.max > 0 && (
          <section className="flex items-center gap-sm rounded-lg bg-surface-container-low p-md">
            <span className="material-symbols-outlined text-[22px] text-primary">stars</span>
            <p className="text-body-md text-on-surface">
              Quiz gesamt: <span className="font-semibold">{daten.punkte}</span> von {daten.max} Punkten
            </p>
          </section>
        )}

        <footer className="border-t border-outline-variant pt-md text-center text-label-sm text-on-surface-variant">
          Selbstgesteuerte KI-Einheit · alle Angaben lokal auf diesem Gerät erzeugt, keine Bewertung.
        </footer>
      </article>
    </div>
  );
}
