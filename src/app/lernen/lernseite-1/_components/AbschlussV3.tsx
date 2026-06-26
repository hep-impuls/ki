"use client";

import { useEffect, useState } from "react";
import { ZERTIFIKAT_SCHWELLE } from "../_data/types";
import { AUFTAKT_SKALA_POLLS } from "../_data/auftaktPolls";
import { abgeschlosseneStationen } from "../_lib/stationStore";
import GlobalSlider from "./GlobalSlider";
import Skala4Frage from "./Skala4Frage";
import Landkarte from "./Landkarte";
import KlassenSpiegel from "./KlassenSpiegel";
import Zertifikat from "./Zertifikat";

/**
 * AbschlussV3 (M7) — die echte **Abschluss-Phase** der Einheit (Spec §64/§10):
 * globaler **Post-Slider** (mit Pre→Post-Bewegung), die **Chancen-Risiken-
 * Landkarte** (Radar, wächst mit den Stationen), der **Klassen-Spiegel**
 * (Ich vs. Klasse vs. alle) und der Zugang zum **Zertifikat** ab
 * {@link ZERTIFIKAT_SCHWELLE} abgeschlossenen Stationen.
 *
 * Unterschied zur M6-`AbschlussVorschau`: dies ist die in `KiEinheitV3`
 * verdrahtete Phase (echte Überschrift, Zertifikat-Zugang, Rücksprung zum
 * Zeitstrahl) — die Vorschau bleibt für /v3-preview bestehen.
 *
 * **ki26-konform:** Aggregate werden hier nur **gelesen**; geschrieben wird
 * anonym an der Quelle (Polls/Slider/Vorwissen, seit M8). Persönliche Werte
 * (Slider-Bewegung, Landkarte-Ich) bleiben rein lokal.
 */
export default function AbschlussV3({ onBack }: { onBack?: () => void }) {
  const [anzahl, setAnzahl] = useState(0);
  const [zeigeZertifikat, setZeigeZertifikat] = useState(false);

  useEffect(() => {
    setAnzahl(abgeschlosseneStationen().length);
  }, []);

  if (zeigeZertifikat) {
    return <Zertifikat onBack={() => setZeigeZertifikat(false)} />;
  }

  const genug = anzahl >= ZERTIFIKAT_SCHWELLE;

  return (
    <div className="flex flex-col gap-xl">
      <header className="border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">Abschluss</p>
        <h2 className="mt-sm text-headline-lg text-on-surface">Meine Landkarte &amp; meine Bewegung</h2>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          Wo stehst du nach deinen Stationen? Halte deine Gesamthaltung fest, sieh deine
          Chancen-Risiken-Landkarte wachsen und vergleiche dich anonym mit anderen.
        </p>
      </header>

      <section className="flex flex-col gap-md">
        <h3 className="flex items-center gap-xs text-headline-sm text-on-surface">
          <span className="material-symbols-outlined text-[22px] text-tertiary">trending_flat</span>
          Meine Gesamthaltung
        </h3>
        <p className="text-body-sm text-on-surface-variant">
          Der gleiche Schieberegler wie im Auftakt — so wird deine persönliche Verschiebung sichtbar.
        </p>
        <GlobalSlider phase="post" zeigeBewegung />
      </section>

      <section className="flex flex-col gap-md">
        <h3 className="flex items-center gap-xs text-headline-sm text-on-surface">
          <span className="material-symbols-outlined text-[22px] text-tertiary">balance</span>
          Meine Haltung — nachher
        </h3>
        <p className="text-body-sm text-on-surface-variant">
          Dieselben zwei Fragen wie im Auftakt. Im Klassen-Spiegel siehst du gleich, wie du
          im Vergleich zu deiner Klasse und allen stehst.
        </p>
        <div className="flex flex-col gap-lg">
          {AUFTAKT_SKALA_POLLS.map((poll) => (
            <div key={poll.id} className="rounded-xl border border-outline-variant bg-surface-bright p-lg">
              <Skala4Frage poll={poll} phase="post" />
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-md">
        <h3 className="flex items-center gap-xs text-headline-sm text-on-surface">
          <span className="material-symbols-outlined text-[22px] text-tertiary">explore</span>
          Meine Chancen-Risiken-Landkarte
        </h3>
        <Landkarte />
      </section>

      <section className="flex flex-col gap-md">
        <h3 className="flex items-center gap-xs text-headline-sm text-on-surface">
          <span className="material-symbols-outlined text-[22px] text-tertiary">groups</span>
          Ich, meine Klasse, alle
        </h3>
        <KlassenSpiegel />
      </section>

      {/* Zertifikat-Zugang + Rücksprung */}
      <div className="flex flex-wrap items-center justify-between gap-sm border-t border-outline-variant pt-lg">
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
          onClick={() => setZeigeZertifikat(true)}
          disabled={!genug}
          className="inline-flex items-center gap-sm rounded-xl bg-tertiary px-lg py-sm text-label-md text-on-tertiary shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          title={genug ? undefined : `Erst ab ${ZERTIFIKAT_SCHWELLE} abgeschlossenen Stationen`}
        >
          <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
          {genug
            ? "Zertifikat ansehen"
            : `Noch ${ZERTIFIKAT_SCHWELLE - anzahl} bis zum Zertifikat`}
        </button>
      </div>
    </div>
  );
}
