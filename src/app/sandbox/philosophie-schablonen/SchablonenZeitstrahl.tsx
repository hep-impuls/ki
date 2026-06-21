"use client";

import { useState } from "react";

/**
 * Schablonen-Zeitstrahl — Visualisierung für das Submodul "Philosophische
 * Perspektive" (Lernseite 2). Zeigt: In jeder Zeit des Wandels lieferte die
 * Philosophie eine "Schablone" zur Orientierung — und jetzt (digitale
 * Transformation / KI) suchen wir die nächste.
 *
 * Bilder: gemeinfreie Kunstwerke (Wikimedia Commons), lokal unter /public/art,
 * Nachweis in public/art/CREDITS.md.
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
  image?: string; // Pfad unter /public
  imageAlt?: string;
  credit?: string; // Bildnachweis (gemeinfrei)
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
    image: "/art/orrery.jpg",
    imageAlt:
      "Gemälde „A Philosopher Lecturing on the Orrery“ von Joseph Wright of Derby",
    credit:
      "J. Wright of Derby, „A Philosopher Lecturing on the Orrery“, um 1766 · gemeinfrei",
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
    image: "/art/augustine.jpg",
    imageAlt: "Gemälde „Der heilige Augustinus“ von Philippe de Champaigne",
    credit:
      "Ph. de Champaigne, „Der heilige Augustinus“, um 1645 · gemeinfrei",
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
    image: "/art/wanderer.jpg",
    imageAlt:
      "Gemälde „Der Wanderer über dem Nebelmeer“ von Caspar David Friedrich",
    credit:
      "C. D. Friedrich, „Der Wanderer über dem Nebelmeer“, 1818 · gemeinfrei",
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
                "mb-md flex-1 overflow-hidden rounded-xl border bg-surface-bright text-left shadow-sm transition hover:shadow-md " +
                (s.open ? "border-tertiary border-dashed" : "border-outline-variant")
              }
            >
              {/* Bild-Banner (gemeinfrei) bzw. offenes Platzhalterfeld */}
              {s.image ? (
                <figure className="m-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.image}
                    alt={s.imageAlt ?? ""}
                    loading="lazy"
                    className="h-44 w-full object-cover object-top"
                  />
                  {s.credit && (
                    <figcaption className="bg-surface-container-low px-md py-xs text-label-sm text-on-surface-variant">
                      {s.credit}
                    </figcaption>
                  )}
                </figure>
              ) : (
                <div className="flex h-44 w-full flex-col items-center justify-center gap-xs border-b border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant">
                  <span className="material-symbols-outlined text-[32px] text-tertiary">
                    image_search
                  </span>
                  <span className="text-label-sm">Bild noch offen</span>
                </div>
              )}

              <div className="p-lg">
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
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
