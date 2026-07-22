"use client";

import { useEffect, useMemo, useState } from "react";
import { GEWICHT_EVENT, leseGewichtungen } from "../_lib/gewichtung";
import { leseInhalte } from "../_lib/inhalte";

/**
 * KontextGewichtung — zeigt im Orakel die Achtsamkeits-Gewichtung der
 * Kontext-Aspekte (aus «Die KI im Kontext») als zwei Ringdiagramme
 * nebeneinander: links dein eigenes Muster, rechts das aller Nutzenden.
 * Gleiche Bildsprache wie das «Achtsamkeits-Muster» auf der Vorhang-auf-Seite.
 *
 * «du»  = lokale Gewichtung (`vorhang-auf:achtsamkeit:<gi>`, Stufe 0/1/2).
 * «alle» = read-only Aggregat der pro Code gespiegelten Gewichtungen über die
 *          Route `/api/orakel/kontext`; jeder Aspekt wird auf den Durchschnitt
 *          aller Nutzenden eingefärbt. Ohne Service-Account (lokal) erscheint
 *          rechts ein Platzhalter. Labels aus der Inhalts-Registry.
 */

const PREFIX = "vorhang-auf:achtsamkeit:";

/* Warme Skala wie im KontextAkkordeon: mehr Achtsamkeit → farbiger, rötlicher.
 * Anker für die drei Stufen; dazwischen wird interpoliert (fürs Durchschnitts-
 * Muster aller). «nicht bewertet» ist der ruhige Grundton. */
const GRAU = "#ded9cc";
const ANKER = ["#e7c489", "#e58a3c", "#d13417"] as const; // wenig, mittel, viel

function hexMisch(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, k) => Math.round(v + (pb[k] - v) * t));
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("");
}

/** Wert 0..2 (oder null) → Farbe auf der Achtsamkeits-Skala. */
function farbeFuer(v: number | null): string {
  if (v == null || Number.isNaN(v)) return GRAU;
  const x = Math.max(0, Math.min(2, v));
  return x <= 1 ? hexMisch(ANKER[0], ANKER[1], x) : hexMisch(ANKER[1], ANKER[2], x - 1);
}

type AlleDaten =
  | { nutzer: number; aspekte: Record<string, { wenig: number; mittel: number; viel: number }> }
  | { grund: string };

/* ── Ein Ring ─────────────────────────────────────────────────────────────── */

function Ring({
  werte,
  labels,
  ariaLabel,
}: {
  /** Pro Aspekt ein Wert 0..2 (Achtsamkeit) oder null (nicht bewertet). */
  werte: (number | null)[];
  /** Optionaler Klartext-Titel pro Aspekt (für Hover/Screenreader). */
  labels: string[];
  ariaLabel: string;
}) {
  const n = werte.length;
  return (
    <svg viewBox="0 0 220 220" className="h-40 w-40 flex-shrink-0 sm:h-44 sm:w-44" role="img" aria-label={ariaLabel}>
      {werte.map((v, gi) => {
        const step = 360 / n;
        const luecke = n > 1 ? 2.2 : 0;
        const a0 = gi * step - 90 + luecke / 2;
        const a1 = (gi + 1) * step - 90 - luecke / 2;
        const ri = 42;
        const ro = 100;
        const rad = (d: number) => (d * Math.PI) / 180;
        const px = (r: number, d: number) => 110 + r * Math.cos(rad(d));
        const py = (r: number, d: number) => 110 + r * Math.sin(rad(d));
        const gross = a1 - a0 > 180 ? 1 : 0;
        const d = [
          `M ${px(ri, a0)} ${py(ri, a0)}`,
          `L ${px(ro, a0)} ${py(ro, a0)}`,
          `A ${ro} ${ro} 0 ${gross} 1 ${px(ro, a1)} ${py(ro, a1)}`,
          `L ${px(ri, a1)} ${py(ri, a1)}`,
          `A ${ri} ${ri} 0 ${gross} 0 ${px(ri, a0)} ${py(ri, a0)}`,
          "Z",
        ].join(" ");
        return (
          <path
            key={gi}
            d={d}
            fill={farbeFuer(v)}
            className="stroke-surface-bright transition-[fill] duration-500"
            strokeWidth={1.5}
          >
            <title>{labels[gi] ?? `Aspekt ${gi + 1}`}</title>
          </path>
        );
      })}
    </svg>
  );
}

/* ── Platzhalter-Ring (wenn «alle» nur online vorliegt) ─────────────────────── */

function PlatzhalterRing({ text }: { text: string }) {
  return (
    <div className="flex h-40 w-40 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-outline-variant p-md text-center sm:h-44 sm:w-44">
      <span className="text-label-sm text-on-surface-variant">{text}</span>
    </div>
  );
}

/* ── Hauptkomponente ────────────────────────────────────────────────────────── */

export default function KontextGewichtung({ className = "" }: { className?: string }) {
  const [eigen, setEigen] = useState<Record<number, number>>({});
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [alle, setAlle] = useState<AlleDaten | null>(null);

  useEffect(() => {
    const lade = () => {
      setEigen(leseGewichtungen("vorhang-auf:achtsamkeit"));
      setLabels(leseInhalte());
    };
    lade();
    window.addEventListener(GEWICHT_EVENT, lade);
    window.addEventListener("storage", lade);
    return () => {
      window.removeEventListener(GEWICHT_EVENT, lade);
      window.removeEventListener("storage", lade);
    };
  }, []);

  useEffect(() => {
    let ab = false;
    fetch("/api/orakel/kontext")
      .then((r) => r.json())
      .then((d) => {
        if (!ab) setAlle(d);
      })
      .catch(() => {
        if (!ab) setAlle({ grund: "fehler" });
      });
    return () => {
      ab = true;
    };
  }, []);

  const alleAspekte = alle && "aspekte" in alle ? alle.aspekte : {};
  const grund = alle && "grund" in alle ? alle.grund : null;
  const nutzer = alle && "nutzer" in alle ? alle.nutzer : 0;

  // Anzahl Aspekte robust ableiten (eigene, alle, registrierte Labels).
  const n = useMemo(() => {
    const idx = [
      ...Object.keys(eigen),
      ...Object.keys(alleAspekte),
      ...Object.keys(labels)
        .filter((k) => k.startsWith(PREFIX))
        .map((k) => k.slice(PREFIX.length)),
    ]
      .map(Number)
      .filter((x) => Number.isInteger(x) && x >= 0);
    return idx.length ? Math.max(...idx) + 1 : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eigen, alle, labels]);

  const labelArr = useMemo(
    () => Array.from({ length: n }, (_, gi) => labels[`${PREFIX}${gi}`] ?? `Aspekt ${gi + 1}`),
    [labels, n],
  );

  // Dein Muster: exakt deine Stufe je Aspekt (oder null).
  const werteDu = useMemo(
    () => Array.from({ length: n }, (_, gi) => (gi in eigen ? eigen[gi] : null)),
    [eigen, n],
  );

  // Muster aller: Durchschnitts-Achtsamkeit je Aspekt (0..2) oder null.
  const werteAlle = useMemo(
    () =>
      Array.from({ length: n }, (_, gi) => {
        const a = alleAspekte[gi];
        if (!a) return null;
        const total = a.wenig + a.mittel + a.viel;
        return total > 0 ? (a.mittel + 2 * a.viel) / total : null;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [alle, n],
  );

  const duGewichtet = werteDu.filter((v) => v != null).length;
  const alleHatDaten = !grund && werteAlle.some((v) => v != null);
  const leer = n === 0 || (duGewichtet === 0 && !alleHatDaten && !grund);

  return (
    <section className={"rounded-2xl border border-outline-variant bg-surface-bright p-md sm:p-lg " + className}>
      <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
        <span className="material-symbols-outlined text-[18px]">tune</span>
        Achtsamkeit auf die Kontexte
      </p>
      <p className="mt-xs max-w-2xl text-body-sm text-on-surface-variant">
        Im Abschnitt «Die KI im Kontext» hast du gewichtet, wie viel Achtsamkeit
        jeder Aspekt verdient. Jeder Ringabschnitt steht für einen Aspekt. Links
        dein Muster, rechts das aller Nutzenden.
      </p>

      {leer ? (
        <p className="mt-md rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-md text-body-sm text-on-surface-variant">
          Noch keine Gewichtungen. Gewichte im Abschnitt «Die KI im Kontext», wie
          viel Achtsamkeit ein Aspekt verdient, dann erscheint dein Muster hier.
        </p>
      ) : (
        <>
          <div className="mt-lg flex flex-col items-center justify-center gap-lg sm:flex-row sm:gap-xl">
            {/* Dein Muster */}
            <figure className="flex flex-col items-center gap-sm">
              <Ring werte={werteDu} labels={labelArr} ariaLabel="Dein Achtsamkeits-Muster über die Kontext-Aspekte" />
              <figcaption className="text-center">
                <span className="block text-body-md font-medium text-on-surface">Du</span>
                <span className="block text-label-sm text-on-surface-variant">
                  {duGewichtet} von {n} gewichtet
                </span>
              </figcaption>
            </figure>

            {/* Muster aller */}
            <figure className="flex flex-col items-center gap-sm">
              {grund ? (
                <PlatzhalterRing text="erscheint online" />
              ) : (
                <Ring
                  werte={werteAlle}
                  labels={labelArr}
                  ariaLabel="Durchschnittliches Achtsamkeits-Muster aller Nutzenden"
                />
              )}
              <figcaption className="text-center">
                <span className="block text-body-md font-medium text-on-surface">Alle Nutzenden</span>
                <span className="block text-label-sm text-on-surface-variant">
                  {grund
                    ? "auf dem Server sichtbar"
                    : nutzer > 0
                      ? `Durchschnitt aus ${nutzer} ${nutzer === 1 ? "Person" : "Personen"}`
                      : "noch keine"}
                </span>
              </figcaption>
            </figure>
          </div>

          {/* Legende */}
          <div className="mt-lg flex flex-wrap items-center justify-center gap-md">
            {[
              ["nicht bewertet", GRAU],
              ["wenig", ANKER[0]],
              ["mittel", ANKER[1]],
              ["viel", ANKER[2]],
            ].map(([label, farbe]) => (
              <span key={label} className="flex items-center gap-xs text-label-sm text-on-surface-variant">
                <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: farbe }} />
                {label}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
