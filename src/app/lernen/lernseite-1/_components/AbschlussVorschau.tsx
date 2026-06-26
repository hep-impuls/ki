"use client";

import GlobalSlider from "./GlobalSlider";
import Landkarte from "./Landkarte";
import KlassenSpiegel from "./KlassenSpiegel";

/**
 * AbschlussVorschau (M6) — Vorschau auf den **Abschluss** der Einheit (v3 §2/§10):
 * der globale **Bedrohung↔Chance-Slider** (Post, mit Pre→Post-Bewegung), die
 * **Chancen-Risiken-Landkarte** (Radar, wächst mit den Stationen) und der
 * **Klassen-Spiegel** (Ich vs. Klasse vs. alle auf den 4er-Skalen).
 *
 * In M6 als eigenständige Vorschau über das Zeitstrahl-Menü erreichbar (analog
 * zum Zertifikat). Die echte Verdrahtung in `Auftakt`/`Abschluss` (KiEinheit)
 * folgt in M7; das Schreiben der anonymen Aggregate (Klasse/alle) in M8.
 */
export default function AbschlussVorschau({ onBack }: { onBack?: () => void }) {
  return (
    <div className="flex flex-col gap-xl">
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

      <header className="border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">Abschluss-Vorschau</p>
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
          Der gleiche Schieberegler wie im Auftakt — so wird die persönliche Verschiebung sichtbar.
        </p>
        <GlobalSlider phase="pre" />
        <GlobalSlider phase="post" zeigeBewegung />
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
    </div>
  );
}
