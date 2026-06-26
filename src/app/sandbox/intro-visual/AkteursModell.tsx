"use client";

import { useMemo, useState } from "react";

/**
 * Akteurs-Modell — interaktive Visualisierung zur Kernthese des Intro-Submoduls
 * "Eine ganz neue Partnerschaft": KI ist weder klassisches Werkzeug noch Person,
 * sondern etwas Drittes.
 *
 * Die Lernenden ordnen Eigenschaften den drei Akteuren zu (Mehrfachauswahl).
 * Beim Aufdecken des Musters wird sichtbar, dass KI sich mit beiden überlappt,
 * aber mit keinem deckungsgleich ist.
 *
 * Self-contained Client-Komponente — keine Firebase-/Server-Logik, damit sie
 * hosting- und auth-System-agnostisch bleibt und sich später unverändert in
 * src/app/lernen/lernseite-2/submodul-1/page.tsx einbauen lässt.
 */

type ActorKey = "mensch" | "werkzeug" | "ki";

const ACTORS: { key: ActorKey; label: string; icon: string; tint: string }[] = [
  {
    key: "mensch",
    label: "Mensch",
    icon: "person",
    tint: "bg-primary-container text-on-primary-container",
  },
  {
    key: "werkzeug",
    label: "Werkzeug",
    icon: "handyman",
    tint: "bg-secondary-container text-on-secondary-container",
  },
  {
    key: "ki",
    label: "KI",
    icon: "smart_toy",
    tint: "bg-tertiary-container text-on-tertiary-container",
  },
];

// Eigenschaften, die zugeordnet werden. `hint` ist die "typische" Zuordnung —
// dient nur dem Muster-Reveal, nicht als Quiz-Korrektur.
const PROPERTIES: { text: string; hint: ActorKey[] }[] = [
  { text: "Wird vom Menschen geführt", hint: ["werkzeug", "ki"] },
  { text: "Ist ohne Eingabe völlig passiv", hint: ["werkzeug"] },
  { text: "Erzeugt selbst Neues (Text, Bild, Idee)", hint: ["mensch", "ki"] },
  { text: "Antwortet in natürlicher Sprache", hint: ["mensch", "ki"] },
  { text: "Begründet Vorschläge und wägt ab", hint: ["mensch", "ki"] },
  { text: "Erinnert sich an den Kontext", hint: ["mensch", "ki"] },
  { text: "Hat ein Bewusstsein / erlebt etwas", hint: ["mensch"] },
  { text: "Trägt Verantwortung für Entscheidungen", hint: ["mensch"] },
];

export default function AkteursModell() {
  // Zuordnung: Eigenschafts-Index -> Menge der gewählten Akteure
  const [assignments, setAssignments] = useState<Record<number, Set<ActorKey>>>(
    {}
  );
  const [revealed, setRevealed] = useState(false);

  function toggle(propIndex: number, actor: ActorKey) {
    setAssignments((prev) => {
      const next = { ...prev };
      const set = new Set(next[propIndex] ?? []);
      if (set.has(actor)) set.delete(actor);
      else set.add(actor);
      next[propIndex] = set;
      return next;
    });
  }

  const assignedCount = useMemo(
    () =>
      Object.values(assignments).filter((s) => s && s.size > 0).length,
    [assignments]
  );

  // Für den Reveal: Wie oft teilt KI eine Eigenschaft mit Mensch bzw. Werkzeug
  // (gemäss hint, nicht gemäss Nutzer-Eingabe — die Auflösung zeigt das Muster).
  const overlap = useMemo(() => {
    let mitMensch = 0;
    let mitWerkzeug = 0;
    let nurKi = 0;
    for (const p of PROPERTIES) {
      if (!p.hint.includes("ki")) continue;
      if (p.hint.includes("mensch")) mitMensch++;
      if (p.hint.includes("werkzeug")) mitWerkzeug++;
      if (p.hint.length === 1) nurKi++;
    }
    return { mitMensch, mitWerkzeug, nurKi };
  }, []);

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
      {/* Legende der drei Akteure */}
      <div className="grid gap-sm sm:grid-cols-3">
        {ACTORS.map((a) => (
          <div
            key={a.key}
            className="flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-container-low p-md"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.tint}`}
            >
              <span className="material-symbols-outlined text-[22px]">
                {a.icon}
              </span>
            </span>
            <span className="text-headline-sm text-on-surface">{a.label}</span>
          </div>
        ))}
      </div>

      <p className="mt-lg text-body-sm text-on-surface-variant">
        Welche Eigenschaft trifft auf wen zu? Tippe pro Zeile alle Akteure an,
        die passen — Mehrfachauswahl ist erlaubt.
      </p>

      {/* Eigenschafts-Zeilen */}
      <ul className="mt-md flex flex-col gap-sm">
        {PROPERTIES.map((p, i) => {
          const set = assignments[i] ?? new Set<ActorKey>();
          return (
            <li
              key={i}
              className="flex flex-col gap-sm rounded-xl border border-outline-variant bg-surface-container-low p-md sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-body-md text-on-surface">{p.text}</span>
              <div className="flex flex-shrink-0 gap-xs">
                {ACTORS.map((a) => {
                  const on = set.has(a.key);
                  return (
                    <button
                      key={a.key}
                      type="button"
                      onClick={() => toggle(i, a.key)}
                      aria-pressed={on}
                      className={
                        on
                          ? "inline-flex items-center gap-xs rounded-lg bg-primary px-sm py-xs text-label-md text-on-primary transition-colors"
                          : "inline-flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                      }
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {a.icon}
                      </span>
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Steuerung + Reveal */}
      <div className="mt-lg flex flex-wrap items-center gap-sm">
        <button
          type="button"
          onClick={() => setRevealed(true)}
          disabled={assignedCount === 0}
          className="inline-flex items-center gap-sm rounded-xl bg-tertiary px-lg py-sm text-label-md text-on-tertiary shadow-sm transition hover:bg-on-tertiary-container disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[18px]">
            lightbulb
          </span>
          Muster aufdecken
        </button>
        {(assignedCount > 0 || revealed) && (
          <button
            type="button"
            onClick={() => {
              setAssignments({});
              setRevealed(false);
            }}
            className="inline-flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-bright px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[18px]">
              restart_alt
            </span>
            Zurücksetzen
          </button>
        )}
        {!revealed && assignedCount > 0 && (
          <span className="text-label-sm text-on-surface-variant">
            {assignedCount} von {PROPERTIES.length} Eigenschaften zugeordnet
          </span>
        )}
      </div>

      {revealed && (
        <div className="mt-lg rounded-xl border border-tertiary/40 bg-tertiary-container/40 p-lg">
          <p className="flex items-center gap-sm text-headline-sm text-on-surface">
            <span className="material-symbols-outlined text-tertiary">
              auto_awesome
            </span>
            KI ist etwas Drittes
          </p>
          <p className="mt-sm text-body-md text-on-surface-variant">
            Schau auf die Spalte <strong className="text-on-surface">KI</strong>:
            Sie teilt <strong className="text-on-surface">{overlap.mitMensch}</strong>{" "}
            Eigenschaften mit dem Menschen (Sprache, Erzeugen, Begründen,
            Erinnern) und{" "}
            <strong className="text-on-surface">{overlap.mitWerkzeug}</strong> mit
            dem Werkzeug (sie wird geführt). Aber das, was den Menschen
            ausmacht — <em>Bewusstsein</em> und <em>Verantwortung</em> — fehlt
            ihr. Und die Passivität des reinen Werkzeugs hat sie auch nicht.
          </p>
          <p className="mt-sm text-body-md text-on-surface-variant">
            KI fällt also in <strong className="text-on-surface">keine</strong> der
            beiden alten Schubladen. Genau deshalb reicht der Werkzeug-Begriff
            nicht mehr — und genau deshalb brauchen wir neue Fragen, um mit
            diesem neuen Akteur souverän umzugehen.
          </p>
        </div>
      )}
    </div>
  );
}
