"use client";

import { useMemo, useState } from "react";

/**
 * Perspektiven-Check — Einstiegs-Umfrage für das Submodul "Philosophische
 * Perspektive" (Lernseite 2). Drei Kapitel: Nutzung · Emotion · Chancen.
 *
 * Entwurf zum Erleben der UX. Self-contained Client-Komponente, KEINE Firebase-/
 * Server-Logik — Antworten bleiben im Browser (Datenschutz: Modell A). Der
 * Gruppen-Vergleich und der KI-Kommentar kommen später oben drauf.
 *
 * Fragen/Optionen sind bewusst als Daten (CHAPTERS) gehalten — zum Anpassen
 * nur diese Struktur editieren, nicht das JSX.
 */

type QType = "single" | "multi" | "scale";

interface Question {
  id: string;
  type: QType;
  text: string;
  options?: string[];
  max?: number; // nur multi: max. Anzahl Auswahlen
  scaleMin?: string; // nur scale: linke Beschriftung
  scaleMax?: string; // nur scale: rechte Beschriftung
}

interface Chapter {
  key: string;
  title: string;
  icon: string;
  intro: string;
  questions: Question[];
}

const CHAPTERS: Chapter[] = [
  {
    key: "nutzung",
    title: "Nutzung",
    icon: "tune",
    intro: "Wie nutzt du KI heute?",
    questions: [
      {
        id: "wofuer",
        type: "multi",
        text: "Wofür nutzt du KI?",
        options: [
          "Texte schreiben / überarbeiten",
          "Recherche & Erklären",
          "Ideen / Brainstorming",
          "Zusammenfassen",
          "Lernen & Üben",
          "Bilder erzeugen",
          "Programmieren / Code",
          "Übersetzen",
          "Sprache & Audio",
          "gar nicht",
        ],
      },
      {
        id: "wieoft",
        type: "single",
        text: "Wie oft nutzt du KI?",
        options: [
          "nie",
          "ein paar Mal ausprobiert",
          "monatlich",
          "wöchentlich",
          "täglich",
          "mehrmals täglich",
        ],
      },
      {
        id: "kontext",
        type: "single",
        text: "In welchem Kontext nutzt du KI?",
        options: [
          "nur privat",
          "v.a. privat",
          "privat & beruflich etwa gleich",
          "v.a. beruflich / schulisch",
          "nur beruflich / schulisch",
        ],
      },
    ],
  },
  {
    key: "emotion",
    title: "Emotion",
    icon: "favorite",
    intro: "Was löst KI in dir aus?",
    questions: [
      {
        id: "gefuehle",
        type: "multi",
        max: 3,
        text: "Was löst KI bei dir aus? (höchstens 3)",
        options: [
          "Neugier",
          "Begeisterung",
          "Erleichterung",
          "Stolz",
          "Gleichgültigkeit",
          "Skepsis",
          "Unsicherheit",
          "Sorge / Angst",
          "Überforderung",
          "Misstrauen",
        ],
      },
      {
        id: "zukunftsgefuehl",
        type: "scale",
        text: "Wenn ich an meine eigene Zukunft mit KI denke, bin ich eher …",
        scaleMin: "besorgt",
        scaleMax: "zuversichtlich",
      },
    ],
  },
  {
    key: "chancen",
    title: "Chancen",
    icon: "trending_up",
    intro: "Wie blickst du nach vorn?",
    questions: [
      {
        id: "gesellschaft",
        type: "scale",
        text: "Für die Gesellschaft ist KI insgesamt eher …",
        scaleMin: "ein Risiko",
        scaleMax: "eine Chance",
      },
      {
        id: "veraenderung",
        type: "scale",
        text: "In zehn Jahren wird KI meinen Alltag / Beruf …",
        scaleMin: "kaum verändern",
        scaleMax: "stark verändern",
      },
      {
        id: "chancenfelder",
        type: "multi",
        text: "Wo siehst du die grössten Chancen?",
        options: [
          "Zeit sparen",
          "Neues lernen",
          "Kreativität",
          "schwierige Aufgaben bewältigen",
          "Sprache & Kommunikation",
          "mehr Selbständigkeit",
          "ich sehe wenig Chancen",
        ],
      },
    ],
  },
];

type AnswerValue = string | string[] | number;

export default function PerspektivenCheck() {
  // step 0..CHAPTERS.length-1 = Kapitel, danach = Auswertung
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  const isResult = step >= CHAPTERS.length;
  const chapter = CHAPTERS[Math.min(step, CHAPTERS.length - 1)];

  function setSingle(id: string, value: string) {
    setAnswers((p) => ({ ...p, [id]: value }));
  }

  function toggleMulti(id: string, value: string, max?: number) {
    setAnswers((p) => {
      const cur = Array.isArray(p[id]) ? (p[id] as string[]) : [];
      let next: string[];
      if (cur.includes(value)) next = cur.filter((v) => v !== value);
      else if (max && cur.length >= max) next = cur; // Limit erreicht
      else next = [...cur, value];
      return { ...p, [id]: next };
    });
  }

  function setScale(id: string, value: number) {
    setAnswers((p) => ({ ...p, [id]: value }));
  }

  // Stimmungs-Index aus den drei Skalen-Fragen (1–5)
  const moodLabel = useMemo(() => {
    const ids = ["zukunftsgefuehl", "gesellschaft", "veraenderung"];
    const vals = ids
      .map((i) => answers[i])
      .filter((v): v is number => typeof v === "number");
    if (vals.length === 0) return null;
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    if (avg < 2.5) return { text: "eher skeptisch", icon: "sentiment_dissatisfied" };
    if (avg <= 3.5) return { text: "ausgewogen", icon: "sentiment_neutral" };
    return { text: "eher zuversichtlich", icon: "sentiment_satisfied" };
  }, [answers]);

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
      {/* Kapitel-Fortschritt */}
      <div className="flex flex-wrap gap-xs">
        {CHAPTERS.map((c, i) => {
          const done = !isResult && i < step;
          const active = !isResult && i === step;
          return (
            <div
              key={c.key}
              className={
                active
                  ? "inline-flex items-center gap-xs rounded-xl bg-tertiary px-md py-xs text-label-md text-on-tertiary"
                  : done
                  ? "inline-flex items-center gap-xs rounded-xl bg-tertiary-container px-md py-xs text-label-md text-on-tertiary-container"
                  : "inline-flex items-center gap-xs rounded-xl border border-outline-variant px-md py-xs text-label-md text-on-surface-variant"
              }
            >
              <span className="material-symbols-outlined text-[16px]">
                {done ? "check" : c.icon}
              </span>
              {c.title}
            </div>
          );
        })}
      </div>

      {!isResult ? (
        <div className="mt-lg">
          <p className="text-label-md uppercase tracking-wider text-tertiary">
            Kapitel {step + 1} von {CHAPTERS.length}
          </p>
          <h2 className="mt-xs text-headline-md text-on-surface">
            {chapter.title}
          </h2>
          <p className="mt-xs text-body-md text-on-surface-variant">
            {chapter.intro}
          </p>

          <div className="mt-lg flex flex-col gap-lg">
            {chapter.questions.map((q) => (
              <fieldset key={q.id}>
                <legend className="text-body-md font-semibold text-on-surface">
                  {q.text}
                </legend>

                {q.type === "scale" ? (
                  <div className="mt-sm">
                    <div className="flex gap-xs">
                      {[1, 2, 3, 4, 5].map((n) => {
                        const on = answers[q.id] === n;
                        return (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setScale(q.id, n)}
                            aria-pressed={on}
                            className={
                              on
                                ? "flex h-11 flex-1 items-center justify-center rounded-lg bg-tertiary text-label-md text-on-tertiary"
                                : "flex h-11 flex-1 items-center justify-center rounded-lg border border-outline-variant bg-surface-bright text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                            }
                          >
                            {n}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-xs flex justify-between text-label-sm text-on-surface-variant">
                      <span>{q.scaleMin}</span>
                      <span>{q.scaleMax}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-sm flex flex-wrap gap-xs">
                    {q.options!.map((opt) => {
                      const sel =
                        q.type === "multi"
                          ? Array.isArray(answers[q.id]) &&
                            (answers[q.id] as string[]).includes(opt)
                          : answers[q.id] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            q.type === "multi"
                              ? toggleMulti(q.id, opt, q.max)
                              : setSingle(q.id, opt)
                          }
                          aria-pressed={sel}
                          className={
                            sel
                              ? "inline-flex items-center gap-xs rounded-xl bg-tertiary px-md py-sm text-label-md text-on-tertiary transition-colors"
                              : "inline-flex items-center gap-xs rounded-xl border border-outline-variant bg-surface-bright px-md py-sm text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                          }
                        >
                          {q.type === "multi" && (
                            <span className="material-symbols-outlined text-[16px]">
                              {sel ? "check_box" : "check_box_outline_blank"}
                            </span>
                          )}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === "multi" && q.max && (
                  <p className="mt-xs text-label-sm text-on-surface-variant">
                    {(Array.isArray(answers[q.id])
                      ? (answers[q.id] as string[]).length
                      : 0)}{" "}
                    / {q.max} gewählt
                  </p>
                )}
              </fieldset>
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-xl flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-bright px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_back
              </span>
              Zurück
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="inline-flex items-center gap-sm rounded-xl bg-tertiary px-lg py-sm text-label-md text-on-tertiary shadow-sm transition hover:bg-on-tertiary-container"
            >
              {step === CHAPTERS.length - 1 ? "Auswerten" : "Weiter"}
              <span className="material-symbols-outlined text-[18px]">
                {step === CHAPTERS.length - 1 ? "insights" : "arrow_forward"}
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* Auswertung */
        <div className="mt-lg">
          <p className="flex items-center gap-sm text-headline-md text-on-surface">
            <span className="material-symbols-outlined text-tertiary">
              insights
            </span>
            Deine Antworten
          </p>

          {moodLabel && (
            <div className="mt-md inline-flex items-center gap-sm rounded-xl bg-tertiary-container px-md py-sm text-on-tertiary-container">
              <span className="material-symbols-outlined text-[20px]">
                {moodLabel.icon}
              </span>
              <span className="text-label-md">
                Grundstimmung: {moodLabel.text}
              </span>
            </div>
          )}

          <div className="mt-lg flex flex-col gap-lg">
            {CHAPTERS.map((c) => (
              <div key={c.key}>
                <p className="text-label-md uppercase tracking-wider text-tertiary">
                  {c.title}
                </p>
                <dl className="mt-sm flex flex-col gap-sm">
                  {c.questions.map((q) => {
                    const a = answers[q.id];
                    let display: string;
                    if (a === undefined || (Array.isArray(a) && a.length === 0))
                      display = "—";
                    else if (q.type === "scale")
                      display = `${a} / 5  (${q.scaleMin} ↔ ${q.scaleMax})`;
                    else if (Array.isArray(a)) display = a.join(", ");
                    else display = String(a);
                    return (
                      <div
                        key={q.id}
                        className="rounded-lg border border-outline-variant bg-surface-container-low p-md"
                      >
                        <dt className="text-body-sm font-semibold text-on-surface">
                          {q.text}
                        </dt>
                        <dd className="mt-xs text-body-sm text-on-surface-variant">
                          {display}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            ))}
          </div>

          <div className="mt-lg rounded-xl border border-outline-variant bg-surface-container-low p-md">
            <p className="flex items-center gap-sm text-label-md text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px] text-tertiary">
                schedule
              </span>
              Kommt später: Vergleich mit der Gruppe und eine KI-Einschätzung zur
              Gesamtauswertung.
            </p>
          </div>

          <div className="mt-lg">
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setStep(0);
              }}
              className="inline-flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-bright px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[18px]">
                restart_alt
              </span>
              Nochmal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
