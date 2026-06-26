"use client";

import { useEffect, useState } from "react";
import { loadPollCounts } from "@/lib/polls";
import { pollId, voteOnce } from "../_lib/unitPolls";
import { recordAnswer, eintrag } from "../_lib/punkte";

/**
 * WissenCheck — eine Frage (MC oder Richtig/Falsch) zum Inhalt eines Clips
 * (Handoff v2 §5, §8).
 *
 * Verhalten: auswählen → bestätigen → sperren. Danach Feedback je Option /
 * Aussage. Erster Versuch ist bindend (recordAnswer idempotent, lokale Punkte)
 * und castet anonym voteOnce(pollId.wissen(id), "richtig"|"falsch"). Danach
 * wird der Klassen-Anteil "richtig" geladen und angezeigt.
 *
 * Distraktor-Längen-Regel & Fett-Diskriminator liegen in den Daten, nicht hier.
 */

export interface WissenCheckOption {
  label: string;
  feedback: string;
}

export type WissenCheckProps =
  | {
      id: string;
      kind: "mc";
      frage: string;
      optionen: WissenCheckOption[];
      correctIndices: number[];
      punkte?: number;
    }
  | {
      id: string;
      kind: "tf";
      aussage: string;
      correctAnswer: boolean;
      feedbackRichtig: string;
      feedbackFalsch: string;
      punkte?: number;
    };

/** Fett-Diskriminator: **…** im Datentext → <strong>. */
function renderMitFett(text: string) {
  const teile = text.split(/(\*\*[^*]+\*\*)/g);
  return teile.map((t, i) =>
    t.startsWith("**") && t.endsWith("**") ? (
      <strong key={i} className="font-semibold text-on-surface">
        {t.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{t}</span>
    ),
  );
}

const PICK_KEY = (id: string) => `ki26-wc-pick-${id}`;

export default function WissenCheck(props: WissenCheckProps) {
  const punkte = props.punkte ?? 1;
  const [pick, setPick] = useState<number | null>(null);
  const [gesperrt, setGesperrt] = useState(false);
  const [warRichtig, setWarRichtig] = useState<boolean | null>(null);
  const [klasse, setKlasse] = useState<{ richtig: number; total: number } | null>(null);

  // Reload-fest: bereits beantwortet? Pick + Korrektheit wiederherstellen.
  useEffect(() => {
    const e = eintrag(props.id);
    if (e) {
      setGesperrt(true);
      setWarRichtig(e.correct);
      try {
        const raw = localStorage.getItem(PICK_KEY(props.id));
        if (raw != null) setPick(Number(raw));
      } catch {
        /* ignore */
      }
      void ladeKlasse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);

  async function ladeKlasse() {
    const c = await loadPollCounts(pollId.wissen(props.id));
    const richtig = Number(c["richtig"] ?? 0);
    const falsch = Number(c["falsch"] ?? 0);
    setKlasse({ richtig, total: richtig + falsch });
  }

  function bestaetigen() {
    if (pick == null || gesperrt) return;
    const correct =
      props.kind === "mc"
        ? props.correctIndices.includes(pick)
        : (pick === 1) === props.correctAnswer; // tf: 1 = "Richtig", 0 = "Falsch"
    setWarRichtig(correct);
    setGesperrt(true);
    recordAnswer(props.id, correct, punkte);
    try {
      localStorage.setItem(PICK_KEY(props.id), String(pick));
    } catch {
      /* ignore */
    }
    voteOnce(pollId.wissen(props.id), correct ? "richtig" : "falsch");
    void ladeKlasse();
  }

  // Options-Liste vereinheitlichen (MC = echte Optionen, TF = Richtig/Falsch).
  const optionen =
    props.kind === "mc"
      ? props.optionen.map((o) => o.label)
      : ["Falsch", "Richtig"]; // Index 0 = Falsch, 1 = Richtig

  function istKorrekt(i: number): boolean {
    return props.kind === "mc"
      ? props.correctIndices.includes(i)
      : (i === 1) === props.correctAnswer;
  }

  function feedbackFuer(i: number): string {
    if (props.kind === "mc") return props.optionen[i]?.feedback ?? "";
    const richtigGewaehlt = i === 1;
    const korrekt = richtigGewaehlt === props.correctAnswer;
    return korrekt ? props.feedbackRichtig : props.feedbackFalsch;
  }

  const frageText = props.kind === "mc" ? props.frage : props.aussage;

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-bright p-md">
      <p className="flex items-start gap-sm text-body-md text-on-surface">
        <span className="material-symbols-outlined mt-[2px] text-[20px] text-primary">
          {props.kind === "tf" ? "rule" : "quiz"}
        </span>
        <span>{renderMitFett(frageText)}</span>
      </p>

      <div className="mt-md flex flex-col gap-xs">
        {optionen.map((label, i) => {
          const gewaehlt = pick === i;
          const korrekt = istKorrekt(i);
          let cls =
            "flex items-start gap-sm rounded-lg border px-md py-sm text-left text-body-sm transition-colors ";
          if (!gesperrt) {
            cls += gewaehlt
              ? "border-primary bg-primary-container text-on-primary-container"
              : "border-outline-variant bg-surface-bright text-on-surface-variant hover:bg-surface-container";
          } else if (korrekt) {
            cls += "border-tertiary bg-tertiary-container text-on-tertiary-container";
          } else if (gewaehlt && !korrekt) {
            cls += "border-error bg-error-container text-on-error-container";
          } else {
            cls += "border-outline-variant bg-surface-bright text-on-surface-variant opacity-70";
          }
          return (
            <div key={i}>
              <button
                type="button"
                disabled={gesperrt}
                aria-pressed={gewaehlt}
                onClick={() => setPick(i)}
                className={cls + " w-full"}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {gesperrt
                    ? korrekt
                      ? "check_circle"
                      : gewaehlt
                        ? "cancel"
                        : "radio_button_unchecked"
                    : gewaehlt
                      ? "radio_button_checked"
                      : "radio_button_unchecked"}
                </span>
                <span>{label}</span>
              </button>
              {gesperrt && (korrekt || gewaehlt) && (
                <p className="mt-xs pl-md text-label-sm text-on-surface-variant">
                  {feedbackFuer(i)}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!gesperrt ? (
        <button
          type="button"
          onClick={bestaetigen}
          disabled={pick == null}
          className="mt-md inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Antwort bestätigen
          <span className="material-symbols-outlined text-[18px]">check</span>
        </button>
      ) : (
        <div className="mt-md flex flex-col gap-xs">
          <p
            className={
              warRichtig
                ? "inline-flex items-center gap-xs text-label-md text-tertiary"
                : "inline-flex items-center gap-xs text-label-md text-error"
            }
          >
            <span className="material-symbols-outlined text-[18px]">
              {warRichtig ? "task_alt" : "info"}
            </span>
            {warRichtig ? `Richtig — +${punkte} Punkt${punkte === 1 ? "" : "e"}.` : "Diesmal nicht — kein Problem, das gehört dazu."}
          </p>
          {klasse && (
            <p className="inline-flex items-center gap-xs text-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-primary">groups</span>
              {klasse.total >= 5
                ? `Klasse: ${Math.round((klasse.richtig / klasse.total) * 100)} % richtig · n = ${klasse.total}`
                : `Gruppe: noch wenige Antworten (n = ${klasse.total}).`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
