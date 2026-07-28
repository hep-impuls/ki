"use client";

import { useEffect, useState } from "react";
import { AUFTAKT_SKALA_POLLS } from "../_data/auftaktPolls";
import { STATIONEN_V3 } from "../_data/stationenV3";
import { gesamtErfuellung } from "../_lib/erfuellung";
import type { RouteApi } from "../_lib/route";
import GlobalSlider from "./GlobalSlider";
import Skala4Frage from "./Skala4Frage";
import Landkarte from "./Landkarte";
import KlassenSpiegel from "./KlassenSpiegel";
import Abschlussbericht from "./Abschlussbericht";

/**
 * AbschlussV3 (M7) — die echte **Abschluss-Phase** der Einheit (Spec §64/§10):
 * globaler **Post-Slider** (mit Pre→Post-Bewegung), die **Chancen-Risiken-
 * Landkarte** (Radar, wächst mit den Themen), der **Klassen-Spiegel**
 * (Ich vs. Klasse vs. alle) und der Zugang zum **Abschlussbericht**.
 *
 * 2026-07-28: Der Bericht (früher «Zertifikat») ist **ohne Schwelle** abrufbar —
 * die frühere Bedingung «ab 3 Stationen» ist weg, weil die Lernenden frei
 * wählen, was sie bearbeiten.
 *
 * Unterschied zur M6-`AbschlussVorschau`: dies ist die in `KiEinheitV3`
 * verdrahtete Phase (echte Überschrift, Bericht-Zugang, Rücksprung ins
 * Themenfeld) — die Vorschau bleibt für /v3-preview bestehen.
 *
 * **ki26-konform:** Aggregate werden hier nur **gelesen**; geschrieben wird
 * anonym an der Quelle (Polls/Slider/Vorwissen, seit M8). Persönliche Werte
 * (Slider-Bewegung, Landkarte-Ich) bleiben rein lokal.
 */
export default function AbschlussV3({
  nav,
  onBack,
}: {
  /** M10: im orchestrierten Flow gesetzt — die Bericht-Ansicht kommt dann aus
   *  der URL (`#/abschluss/bericht`). Ohne `nav` lokaler State-Fallback. */
  nav?: RouteApi;
  onBack?: () => void;
}) {
  const routed = nav?.route ?? null;
  const istRouted = nav != null;
  const [prozent, setProzent] = useState(0);
  const [berichtLocal, setBerichtLocal] = useState(false);

  useEffect(() => {
    setProzent(gesamtErfuellung(STATIONEN_V3).prozent);
  }, []);

  const zeigeBericht = istRouted
    ? routed?.phase === "abschluss" && routed.view === "bericht"
    : berichtLocal;
  const berichtOeffnen = () =>
    istRouted ? nav!.push({ phase: "abschluss", view: "bericht" }) : setBerichtLocal(true);
  const berichtSchliessen = () =>
    istRouted ? nav!.push({ phase: "abschluss", view: "landkarte" }) : setBerichtLocal(false);

  if (zeigeBericht) {
    return <Abschlussbericht onBack={berichtSchliessen} />;
  }

  return (
    <div className="flex flex-col gap-xl">
      <header className="border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">Abschluss</p>
        <h2 className="mt-sm text-headline-lg text-on-surface">Meine Landkarte &amp; meine Bewegung</h2>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          Wo stehst du nach deinen Themen? Halte deine Gesamthaltung fest, sieh deine
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

      {/* Bericht-Zugang + Rücksprung — der Bericht ist immer abrufbar */}
      <div className="flex flex-wrap items-center justify-between gap-sm border-t border-outline-variant pt-lg">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-xs text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Zurück zu den Themen
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={berichtOeffnen}
          className="inline-flex items-center gap-sm rounded-xl bg-tertiary px-lg py-sm text-label-md text-on-tertiary shadow-sm transition hover:opacity-90"
          title={`Enthält alles, was du bisher festgehalten hast — aktuell ${prozent} % der Einheit bearbeitet`}
        >
          <span className="material-symbols-outlined text-[18px]">description</span>
          Abschlussbericht ansehen
        </button>
      </div>
    </div>
  );
}
