"use client";

import { useState } from "react";
import { scaleBucket } from "@/lib/polls";
import { pollId, voteOnce } from "../_lib/unitPolls";
import {
  MR_EXPLAINER,
  MR_EXPLAINER_TIEFER,
  MR_INTERESSE_ACHSE,
  MR_INTERESSE_FRAGE,
  MR_PRE_ACHSE,
  MR_PRE_FRAGE,
  MR_POST_FRAGE,
  MR_VERTRAUEN_FRAGE,
  MR_VERTRAUEN_OPTIONEN,
} from "../_data/maschinenraum";
import Skala from "./Skala";
import MediaBlockView from "./media/MediaBlockView";

/**
 * Maschinenraum (optional) — Handoff §5.4, v2 §8.
 *
 * Ablauf: Selbsteinschaetzung vorher (1-5) → Explainer → Selbsteinschaetzung
 * nachher + Interesse (1-5) → Bruecke zurueck zur Haltung. KEIN Wissenstest.
 * Persoenliche Werte bleiben lokal; nur anonyme Aggregat-Zaehler gehen raus.
 */

interface MaschinenraumProps {
  onZurueck: () => void;
}

export default function Maschinenraum({ onZurueck }: MaschinenraumProps) {
  const [pre, setPre] = useState<number | null>(null);
  const [post, setPost] = useState<number | null>(null);
  const [interesse, setInteresse] = useState<number | null>(null);
  const [vertrauen, setVertrauen] = useState<string | null>(null);
  const [tieferOffen, setTieferOffen] = useState(false);

  function setPreCast(v: number) {
    setPre(v);
    voteOnce(pollId.mrPre, scaleBucket(v));
  }
  function setPostCast(v: number) {
    setPost(v);
    voteOnce(pollId.mrPost, scaleBucket(v));
  }
  function setInteresseCast(v: number) {
    setInteresse(v);
    voteOnce(pollId.mrInteresse, scaleBucket(v));
  }
  function setVertrauenCast(id: string) {
    setVertrauen(id);
    voteOnce(pollId.mrVertrauen, id);
  }

  return (
    <div className="flex flex-col gap-lg">
      <header className="border-b border-outline-variant pb-lg">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-[22px] text-tertiary">settings</span>
          <p className="text-label-md uppercase tracking-wider text-tertiary">
            Maschinenraum · freiwillig
          </p>
        </div>
        <h1 className="mt-sm text-headline-xl text-on-surface">Wie funktioniert das eigentlich?</h1>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          Kein Test, keine Noten. Nur ein Blick unter die Haube — und danach
          schaust du, ob sich fuer dich etwas veraendert hat.
        </p>
      </header>

      {/* 1 — Selbsteinschaetzung vorher */}
      <section className="rounded-xl border border-outline-variant bg-surface-bright p-lg">
        <p className="text-body-md font-semibold text-on-surface">{MR_PRE_FRAGE}</p>
        <div className="mt-sm">
          <Skala
            value={pre}
            onChange={setPreCast}
            links={MR_PRE_ACHSE.links}
            rechts={MR_PRE_ACHSE.rechts}
            steps={5}
          />
        </div>
      </section>

      {/* 2 — Explainer */}
      <section className="flex flex-col gap-md rounded-xl border border-outline-variant bg-surface-bright p-lg">
        <h2 className="text-headline-sm text-on-surface">Der Explainer (~8 Min.)</h2>
        <MediaBlockView block={{ media: [MR_EXPLAINER] }} />
        <div className="rounded-lg border border-outline-variant bg-surface-container-low p-md">
          {!tieferOffen ? (
            <button
              type="button"
              onClick={() => setTieferOffen(true)}
              className="inline-flex items-center gap-sm text-label-md text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Noch tiefer (freiwillig)
            </button>
          ) : (
            <MediaBlockView block={{ media: [MR_EXPLAINER_TIEFER] }} />
          )}
        </div>
      </section>

      {/* 3 — Selbsteinschaetzung nachher + Interesse */}
      <section className="flex flex-col gap-lg rounded-xl border border-outline-variant bg-surface-bright p-lg">
        <div>
          <p className="text-body-md font-semibold text-on-surface">{MR_POST_FRAGE}</p>
          <div className="mt-sm">
            <Skala
              value={post}
              onChange={setPostCast}
              links={MR_PRE_ACHSE.links}
              rechts={MR_PRE_ACHSE.rechts}
              steps={5}
            />
          </div>
        </div>
        <div>
          <p className="text-body-md font-semibold text-on-surface">{MR_INTERESSE_FRAGE}</p>
          <div className="mt-sm">
            <Skala
              value={interesse}
              onChange={setInteresseCast}
              links={MR_INTERESSE_ACHSE.links}
              rechts={MR_INTERESSE_ACHSE.rechts}
              steps={5}
            />
          </div>
        </div>
      </section>

      {/* 4 — Bruecke zurueck zur Haltung */}
      <section className="rounded-xl border border-outline-variant bg-surface-bright p-lg">
        <p className="text-body-md font-semibold text-on-surface">{MR_VERTRAUEN_FRAGE}</p>
        <div className="mt-sm flex flex-wrap gap-sm">
          {MR_VERTRAUEN_OPTIONEN.map((o) => {
            const on = vertrauen === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setVertrauenCast(o.id)}
                aria-pressed={on}
                className={
                  on
                    ? "inline-flex items-center gap-sm rounded-xl bg-primary px-md py-sm text-label-md text-on-primary"
                    : "inline-flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-bright px-md py-sm text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                }
              >
                <span className="material-symbols-outlined text-[18px]">{o.icon}</span>
                {o.label}
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex justify-between border-t border-outline-variant pt-lg">
        <button
          type="button"
          onClick={onZurueck}
          className="inline-flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-bright px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Zurueck zum Abschluss
        </button>
        <button
          type="button"
          onClick={onZurueck}
          className="inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:opacity-90"
        >
          Fertig
          <span className="material-symbols-outlined text-[18px]">check</span>
        </button>
      </div>
    </div>
  );
}
