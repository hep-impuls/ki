"use client";

import { useState } from "react";
import { scaleBucket } from "@/lib/polls";
import {
  GLOBAL_AXIS,
  pollId,
  resolveKlasse,
  voteOnce,
} from "../_lib/unitPolls";
import Skala from "./Skala";
import KollektivSpiegel from "./KollektivSpiegel";

/**
 * Abschluss — Handoff §5.3, v2 §3/§4.
 *
 * Globaler Post-Poll (gleiche GLOBAL_AXIS) → Ich-Delta → Kollektiv-Spiegel
 * (Ich / Klasse / alle, live). Danach Angebot: Maschinenraum (optional).
 */

interface AbschlussProps {
  preWert: number | null;
  onPostWert: (v: number) => void;
  onMaschinenraum: () => void;
}

export default function Abschluss({ preWert, onPostWert, onMaschinenraum }: AbschlussProps) {
  const [postWert, setPostWert] = useState<number | null>(null);
  const [ausgewertet, setAusgewertet] = useState(false);

  function auswerten() {
    if (postWert == null) return;
    const klasse = resolveKlasse();
    voteOnce(pollId.globalPost, scaleBucket(postWert));
    voteOnce(pollId.klassePost(klasse), scaleBucket(postWert));
    onPostWert(postWert);
    setAusgewertet(true);
  }

  const delta = preWert != null && postWert != null ? postWert - preWert : null;

  return (
    <div className="flex flex-col gap-lg">
      <header className="border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-primary">Abschluss</p>
        <h1 className="mt-sm text-headline-xl text-on-surface">Wo stehst du jetzt?</h1>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          Du hast mehrere Seiten gesehen — Versprechen und Kehrseiten. Setz deine
          Position ein letztes Mal. Es gibt kein Richtig.
        </p>
      </header>

      <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
        <p className="text-body-md font-semibold text-on-surface">
          Ist KI fuer dich jetzt eher eine Chance oder eher eine Bedrohung?
        </p>
        <div className="mt-sm">
          <Skala
            value={postWert}
            onChange={setPostWert}
            links={GLOBAL_AXIS.links}
            rechts={GLOBAL_AXIS.rechts}
          />
        </div>

        {delta != null && (
          <div className="mt-lg inline-flex items-center gap-sm self-start rounded-xl bg-surface-container-low px-md py-sm text-label-md text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-tertiary">
              {delta === 0 ? "drag_handle" : delta > 0 ? "trending_up" : "trending_down"}
            </span>
            {delta === 0
              ? "Deine Position ist gleich geblieben — auch das ist ein Ergebnis."
              : `Du hast dich um ${Math.abs(delta)} Schritt${Math.abs(delta) === 1 ? "" : "e"} verschoben.`}
          </div>
        )}

        {!ausgewertet && (
          <div className="mt-xl flex justify-end">
            <button
              type="button"
              onClick={auswerten}
              disabled={postWert == null}
              className="inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Kollektiv-Spiegel zeigen
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </button>
          </div>
        )}
      </div>

      {ausgewertet && (
        <>
          <KollektivSpiegel preWert={preWert} postWert={postWert} />

          <section className="rounded-xl border border-outline-variant bg-surface-container-low p-lg">
            <div className="flex items-start gap-md">
              <span className="material-symbols-outlined text-[24px] text-tertiary">settings</span>
              <div className="flex-1">
                <h3 className="text-headline-sm text-on-surface">
                  Maschinenraum (optional)
                </h3>
                <p className="mt-xs text-body-md text-on-surface-variant">
                  Willst du wissen, <em>wie</em> KI eigentlich funktioniert? Ein
                  freiwilliger Technik-Tiefblick — ohne Test, nur fuer dich.
                </p>
                <button
                  type="button"
                  onClick={onMaschinenraum}
                  className="mt-md inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:opacity-90"
                >
                  In den Maschinenraum
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </section>

          <p className="rounded-xl bg-tertiary-container px-lg py-md text-body-md text-on-tertiary-container">
            Das war die Einheit. Danke, dass du deine Position immer wieder geprueft hast.
          </p>
        </>
      )}
    </div>
  );
}
