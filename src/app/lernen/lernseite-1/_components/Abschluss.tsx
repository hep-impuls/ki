"use client";

import { useEffect, useState } from "react";
import { loadPollCounts, scaleBucket } from "@/lib/polls";
import {
  GLOBAL_AXIS,
  pollId,
  resolveKlasse,
  voteOnce,
} from "../_lib/unitPolls";
import { STIMMUNG_DECK_POST, STIMMUNG_VORHER } from "../_data/auftakt";
import { load as ladePunkte, summe } from "../_lib/punkte";
import Skala from "./Skala";
import KollektivSpiegel from "./KollektivSpiegel";
import LernzielKarte from "./LernzielKarte";
import PollDeck from "./PollDeck";

/**
 * Abschluss — Handoff §5.3, v2 §7.3.
 *
 * Rückblick → globaler Post-Poll (gleiche GLOBAL_AXIS) → Ich-Delta →
 * Kollektiv-Spiegel (Ich/Klasse/alle, live) → Punkte-Übersicht (ruhig, kein
 * Ranking) → Stimmungsbild-Pre/Post-Vergleich. Danach Angebot: Maschinenraum.
 */

interface AbschlussProps {
  preWert: number | null;
  onPostWert: (v: number) => void;
  onMaschinenraum: () => void;
}

/* Punkte-Übersicht — bewusst unaufgeregt, kein Zeugnis (§4.2). */
function PunkteUebersicht() {
  const [s, setS] = useState({ points: 0, max: 0, beantwortet: 0 });
  const [klassenSchnitt, setKlassenSchnitt] = useState<number | null>(null);

  useEffect(() => {
    setS(summe());
    // Optionaler, dezenter Klassen-Schnitt: Mittel der "richtig"-Anteile über
    // die selbst beantworteten Wissen-Checks (anonyme wc-*-Zähler).
    const qids = Object.keys(ladePunkte());
    if (qids.length === 0) return;
    let aktiv = true;
    void Promise.all(qids.map((q) => loadPollCounts(pollId.wissen(q)))).then((listen) => {
      if (!aktiv) return;
      const anteile: number[] = [];
      for (const c of listen) {
        const r = Number(c["richtig"] ?? 0);
        const f = Number(c["falsch"] ?? 0);
        if (r + f >= 5) anteile.push(r / (r + f)); // nur bei genug Daten
      }
      if (anteile.length > 0) {
        setKlassenSchnitt(Math.round((anteile.reduce((a, b) => a + b, 0) / anteile.length) * 100));
      }
    });
    return () => {
      aktiv = false;
    };
  }, []);

  if (s.beantwortet === 0) return null;

  return (
    <section className="rounded-xl border border-outline-variant bg-surface-bright p-lg">
      <div className="flex items-center gap-sm">
        <span className="material-symbols-outlined text-[22px] text-tertiary">workspace_premium</span>
        <h3 className="text-headline-sm text-on-surface">Deine Punkte</h3>
      </div>
      <p className="mt-md text-headline-md text-on-surface">
        {s.points} <span className="text-on-surface-variant">von {s.max}</span>
      </p>
      <p className="mt-xs text-body-md text-on-surface-variant">
        Du hast {s.beantwortet} Wissen-Check{s.beantwortet === 1 ? "" : "s"} beantwortet. Kein
        Zeugnis, keine Note — nur für dich, als Rückmeldung.
      </p>
      {klassenSchnitt != null && (
        <p className="mt-sm inline-flex items-center gap-xs text-label-md text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
          Klassen-Schnitt über diese Checks: rund {klassenSchnitt} % richtig.
        </p>
      )}
    </section>
  );
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

      <LernzielKarte
        titel="Rückblick"
        lernziele={[
          "Du hast deine Position mehrfach geprüft — nicht einmal, sondern unterwegs.",
          "Du hast Chancen und Kehrseiten nebeneinander ausgehalten.",
        ]}
        wasKommt="Jetzt setzt du deine Schlussposition, siehst die ganze Gruppe, deine Punkte und ob sich dein Stimmungsbild verschoben hat."
      />

      <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
        <p className="text-body-md font-semibold text-on-surface">
          Ist KI für dich jetzt eher eine Chance oder eher eine Bedrohung?
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

          <PunkteUebersicht />

          <PollDeck spec={STIMMUNG_DECK_POST} vorher={STIMMUNG_VORHER} />

          <section className="rounded-xl border border-outline-variant bg-surface-container-low p-lg">
            <div className="flex items-start gap-md">
              <span className="material-symbols-outlined text-[24px] text-tertiary">settings</span>
              <div className="flex-1">
                <h3 className="text-headline-sm text-on-surface">Maschinenraum (optional)</h3>
                <p className="mt-xs text-body-md text-on-surface-variant">
                  Willst du wissen, <em>wie</em> KI eigentlich funktioniert? Ein
                  freiwilliger Technik-Tiefblick — ohne Test, nur für dich.
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
            Das war die Einheit. Danke, dass du deine Position immer wieder geprüft hast.
          </p>
        </>
      )}
    </div>
  );
}
