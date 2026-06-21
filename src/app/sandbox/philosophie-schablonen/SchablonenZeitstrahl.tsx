"use client";

import { useState } from "react";

/**
 * Schablonen-Zeitstrahl — Visualisierung für das Submodul "Philosophische
 * Perspektive" (Lernseite 2). Zeigt: In jeder Zeit des Wandels lieferte die
 * Philosophie eine "Schablone" zur Orientierung — und jetzt (digitale
 * Transformation / KI) suchen wir die nächste.
 *
 * Self-contained Client-Komponente, keine Firebase-/Server-Logik
 * (hosting-/auth-agnostisch, migrationsbereit). Inhalte als Datenstruktur unten.
 */

interface Station {
  id: string;
  epoch: string;
  wandel: string;
  thinker: string;
  icon: string;
  schablone: string;
  quote?: string;
  enabled: string;
  open?: boolean; // offene Gegenwarts-Station
}

const STATIONS: Station[] = [
  {
    id: "aristoteles",
    epoch: "Antike",
    wandel: "Vom Mythos zum Wissen",
    thinker: "Aristoteles",
    icon: "science",
    schablone: "Beobachten, ordnen, begründen",
    quote: "„Alle Menschen streben von Natur aus nach Wissen.“",
    enabled: "Das Fundament von Wissenschaft und Empirie.",
  },
  {
    id: "augustinus",
    epoch: "Spätantike → Mittelalter",
    wandel: "Eine Welt wird christlich",
    thinker: "Augustinus",
    icon: "church",
    schablone: "Innerlichkeit, Glaube, Heilsgeschichte",
    quote: "„Im inneren Menschen wohnt die Wahrheit.“",
    enabled:
      "Orientierung für ein christliches Zeitalter — und die Entdeckung des inneren Selbst.",
  },
  {
    id: "kant",
    epoch: "Aufklärung",
    wandel: "Der Mensch wird mündig",
    thinker: "Kant",
    icon: "lightbulb",
    schablone: "Autonomie und Selbstdenken",
    quote:
      "„Sapere aude! Habe Mut, dich deines eigenen Verstandes zu bedienen.“",
    enabled: "Das selbstbestimmte Individuum der Moderne.",
  },
  {
    id: "jetzt",
    epoch: "Digitale Transformation",
    wandel: "Alles wird vernetzt — KI tritt auf",
    thinker: "Wir — jetzt",
    icon: "hub",
    schablone: "??? — das suchen wir gerade",
    enabled:
      "Genau hier setzt dieses Submodul an: die Schablonen finden, die uns mit KI und einem neuen „Wir“ orientieren (Latour, Haraway, Gabriel …).",
    open: true,
  },
];

export default function SchablonenZeitstrahl() {
  const [openId, setOpenId] = useState<string | null>("aristoteles");

  return (
    <ol className="flex flex-col gap-md">
      {STATIONS.map((s, i) => {
        const isOpen = openId === s.id;
        const isLast = i === STATIONS.length - 1;
        return (
          <li key={s.id} className="flex gap-md">
            {/* Rail: Icon-Knoten + Verbindungslinie */}
            <div className="flex flex-col items-center">
              <span
                className={
                  s.open
                    ? "flex h-11 w-11 items-center justify-center rounded-xl bg-tertiary text-on-tertiary shadow-sm"
                    : "flex h-11 w-11 items-center justify-center rounded-xl bg-tertiary-container text-on-tertiary-container"
                }
              >
                <span className="material-symbols-outlined text-[24px]">
                  {s.icon}
                </span>
              </span>
              {!isLast && <span className="w-px flex-1 bg-outline-variant" />}
            </div>

            {/* Karte */}
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : s.id)}
              aria-expanded={isOpen}
              className={
                "mb-md flex-1 rounded-xl border bg-surface-bright p-lg text-left shadow-sm transition hover:shadow-md " +
                (s.open ? "border-tertiary border-dashed" : "border-outline-variant")
              }
            >
              <div className="flex items-center justify-between gap-sm">
                <span className="inline-flex items-center gap-xs rounded-xl bg-surface-container px-sm py-xs text-label-sm text-on-surface-variant">
                  {s.epoch}
                </span>
                <span
                  className={
                    "material-symbols-outlined text-[20px] text-on-surface-variant transition-transform " +
                    (isOpen ? "rotate-180" : "")
                  }
                >
                  expand_more
                </span>
              </div>

              <p className="mt-sm text-label-sm uppercase tracking-wider text-tertiary">
                {s.wandel}
              </p>
              <h3 className="mt-xs text-headline-sm text-on-surface">
                {s.thinker}
              </h3>

              <p className="mt-sm flex items-start gap-sm text-body-md text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-tertiary">
                  bookmark
                </span>
                <span>
                  <span className="text-on-surface-variant">Schablone: </span>
                  <strong>{s.schablone}</strong>
                </span>
              </p>

              {isOpen && (
                <div className="mt-md border-t border-outline-variant pt-md">
                  {s.quote && (
                    <p className="text-body-md italic text-on-surface-variant">
                      {s.quote}
                    </p>
                  )}
                  <p className="mt-sm flex items-start gap-sm text-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px] text-tertiary">
                      {s.open ? "trending_flat" : "check_circle"}
                    </span>
                    <span>{s.enabled}</span>
                  </p>
                </div>
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
