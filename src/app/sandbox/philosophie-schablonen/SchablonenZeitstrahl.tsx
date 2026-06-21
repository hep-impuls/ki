"use client";

import { useState } from "react";

/**
 * Schablonen-Zeitstrahl — Visualisierung für das Submodul "Philosophische
 * Perspektive" (Lernseite 2). Zeigt: In jeder Zeit des Wandels lieferte die
 * Philosophie eine "Schablone" zur Orientierung — und jetzt (digitale
 * Transformation / KI) suchen wir die nächste.
 *
 * Bilder: gemeinfreie Kunstwerke (Wikimedia Commons), lokal unter /public/art,
 * Nachweis in public/art/CREDITS.md. Das ganze Werk wird gezeigt (object-contain,
 * nichts beschnitten). Jede Station erklärt im aufgeklappten Zustand, WARUM
 * gerade dieses Bild gewählt wurde ("Kunst macht sichtbar").
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
  imageWhy?: string; // "Warum dieses Bild?" — einfach, spannend
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
    image: "/art/athens.jpg",
    imageAlt: "Fresko „Die Schule von Athen“ von Raffael",
    credit: "Raffael, „Die Schule von Athen“, 1509–1511 · gemeinfrei",
    imageWhy:
      "In der Mitte zwei Denker: Platon zeigt nach oben, in die Welt der Ideen — Aristoteles streckt die Hand flach nach unten, zur Erde, zum Beobachtbaren. Genau das ist seine Schablone: Wissen beginnt nicht im Himmel, sondern im genauen Hinsehen. Raffael hält den Moment fest, in dem sich das Denken der Welt zuwendet.",
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
    credit: "Ph. de Champaigne, „Der heilige Augustinus“, um 1645 · gemeinfrei",
    imageWhy:
      "Ein Lichtstrahl der Wahrheit trifft Augustinus mitten ins Herz, das er brennend in der Hand hält. Die Wahrheit kommt für ihn nicht von außen aus der Welt, sondern von innen. Das Bild macht sichtbar, was das christliche Zeitalter neu setzte: Der Blick wendet sich nach innen — zu Glaube und Gewissen.",
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
    imageWhy:
      "Ein einzelner Mensch steht auf dem Gipfel und blickt über ein Nebelmeer — niemand sagt ihm, was er sehen soll, er deutet die Welt selbst. Das ist Kants Schablone: Habe Mut, dich deines eigenen Verstandes zu bedienen. Friedrich malt den mündigen, auf sich gestellten Einzelnen der Moderne.",
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
    imageWhy:
      "Hier bleibt der Rahmen bewusst leer. Für unsere Zeit — total vernetzt, von KI durchdrungen — gibt es noch kein fertiges Bild und keine fertige Schablone. Genau sie suchen wir in diesem Modul.",
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
              {/* Bild-Banner: ganzes Werk sichtbar (object-contain), gemeinfrei */}
              {s.image ? (
                <figure className="m-0">
                  <div className="flex h-72 items-center justify-center bg-surface-container-low p-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.image}
                      alt={s.imageAlt ?? ""}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  {s.credit && (
                    <figcaption className="border-t border-outline-variant bg-surface-container-low px-md py-xs text-label-sm text-on-surface-variant">
                      {s.credit}
                    </figcaption>
                  )}
                </figure>
              ) : (
                <div className="flex h-72 w-full flex-col items-center justify-center gap-xs border-b border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant">
                  <span className="material-symbols-outlined text-[36px] text-tertiary">
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

                {!isOpen && (
                  <p className="mt-md inline-flex items-center gap-xs text-label-sm text-tertiary">
                    <span className="material-symbols-outlined text-[16px]">
                      visibility
                    </span>
                    Warum dieses Bild? — antippen
                  </p>
                )}

                {isOpen && (
                  <div className="mt-md space-y-md border-t border-outline-variant pt-md">
                    <div>
                      <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-tertiary">
                        <span className="material-symbols-outlined text-[16px]">
                          visibility
                        </span>
                        Warum dieses Bild?
                      </p>
                      <p className="mt-xs text-body-md text-on-surface-variant">
                        {s.imageWhy}
                      </p>
                    </div>

                    {s.quote && (
                      <p className="text-body-md italic text-on-surface-variant">
                        {s.quote}
                      </p>
                    )}

                    <p className="flex items-start gap-sm text-body-sm text-on-surface-variant">
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
