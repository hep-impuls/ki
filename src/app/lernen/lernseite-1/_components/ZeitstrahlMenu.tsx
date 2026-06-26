"use client";

import { useEffect, useState } from "react";
import type { BadgeFamilie, Station } from "../_data/types";
import { ZERTIFIKAT_SCHWELLE } from "../_data/types";
import { STATIONEN_V3 } from "../_data/stationenV3";
import { BADGE_FAMILIEN } from "../_data/badges";
import { abgeschlosseneStationen, badgeSammlung } from "../_lib/stationStore";
import type { RouteApi } from "../_lib/route";
import StationV3 from "./StationV3";
import Zertifikat from "./Zertifikat";
import AbschlussVorschau from "./AbschlussVorschau";

/**
 * ZeitstrahlMenu (M5) — die sieben Stationen als Punkte auf einem horizontalen
 * **Zeitstrahl** (v3 §3). Freie Wahl der Reihenfolge; **abgeschlossene Stationen
 * färben sich grün** (`tertiary`-Token), der Fortschrittsbalken füllt sich. **Ab
 * `ZERTIFIKAT_SCHWELLE` (3)** abgeschlossenen Stationen wird das **Zertifikat**
 * freigeschaltet (client-seitig, lokal). Weitere Stationen ergänzen Badge-Sammlung
 * und später die Landkarte (M6).
 *
 * Quelle der Wahrheit ist der lokale `stationStore` (localStorage): der Abschluss
 * wird in `StationV3` (BadgeFrame) markiert; beim Rücksprung ins Menü liest dieses
 * den Stand neu ein. **Keine** Cloud-Writes — ki26-konform. Ersetzt wird dieser
 * Vorschau-Orchestrator in M7 durch die echte Auftakt/Abschluss-Verdrahtung.
 */

export default function ZeitstrahlMenu({
  nav,
  onWeiterZumAbschluss,
}: {
  /** M10: im orchestrierten Flow (KiEinheitV3) gesetzt — offene Station +
   *  Zertifikat-Ansicht + Stations-Frame kommen dann aus der URL. Ohne `nav`
   *  (z.B. /v3-preview) bleibt der lokale State-Fallback. */
  nav?: RouteApi;
  /** Im orchestrierten Flow gesetzt: «Zum Abschluss» führt in die echte
   *  Abschluss-Phase statt in die eingebettete Vorschau. */
  onWeiterZumAbschluss?: () => void;
} = {}) {
  const routed = nav?.route ?? null;
  const istRouted = nav != null;

  // Lokaler Fallback-State (nur ohne nav, z.B. /v3-preview).
  const [offenLocal, setOffenLocal] = useState<Station | null>(null);
  const [zertLocal, setZertLocal] = useState(false);
  const [abschlussLocal, setAbschlussLocal] = useState(false);

  const [abgeschlossen, setAbgeschlossen] = useState<string[]>([]);
  const [badges, setBadges] = useState<[BadgeFamilie, number][]>([]);

  // Aktuelle Ansicht: aus der URL (routed) oder aus lokalem State (Preview).
  const offen: Station | null = istRouted
    ? routed?.phase === "station"
      ? STATIONEN_V3.find((s) => s.nummer === routed.nummer) ?? null
      : null
    : offenLocal;
  const zeigeZertifikat = istRouted
    ? routed?.phase === "stationen" && routed.view === "zertifikat"
    : zertLocal;
  const zeigeAbschluss = istRouted ? false : abschlussLocal;

  // Navigations-Helfer: im routed-Modus in die URL, sonst lokaler State.
  const stationOeffnen = (st: Station) =>
    istRouted
      ? nav!.push({ phase: "station", nummer: st.nummer, sub: "auftakt", pos: 1 })
      : setOffenLocal(st);
  const zumMenu = () => {
    if (istRouted) nav!.push({ phase: "stationen", view: "menu" });
    else {
      setOffenLocal(null);
      setZertLocal(false);
      setAbschlussLocal(false);
    }
  };
  const zertOeffnen = () =>
    istRouted ? nav!.push({ phase: "stationen", view: "zertifikat" }) : setZertLocal(true);
  const abschlussOeffnen = () =>
    onWeiterZumAbschluss ? onWeiterZumAbschluss() : setAbschlussLocal(true);

  // Beim Mount und nach jedem Rücksprung ins Menü den lokalen Stand neu lesen
  // (Abschluss wird in StationV3 gesetzt). SSR-sicher: erst nach Mount.
  useEffect(() => {
    if (!offen && !zeigeZertifikat && !zeigeAbschluss) {
      setAbgeschlossen(abgeschlosseneStationen());
      setBadges(Object.entries(badgeSammlung()) as [BadgeFamilie, number][]);
    }
  }, [offen, zeigeZertifikat, zeigeAbschluss]);

  if (offen) {
    return istRouted && routed?.phase === "station" ? (
      <StationV3
        station={offen}
        onBack={zumMenu}
        frameSub={routed.sub}
        framePos={routed.pos}
        onFrame={(sub, pos, replace) =>
          replace
            ? nav!.replace({ phase: "station", nummer: offen.nummer, sub, pos })
            : nav!.push({ phase: "station", nummer: offen.nummer, sub, pos })
        }
      />
    ) : (
      <StationV3 station={offen} onBack={zumMenu} />
    );
  }

  if (zeigeZertifikat) {
    return <Zertifikat onBack={zumMenu} />;
  }

  if (zeigeAbschluss) {
    return <AbschlussVorschau onBack={() => setAbschlussLocal(false)} />;
  }

  const anzahl = abgeschlossen.length;
  const genug = anzahl >= ZERTIFIKAT_SCHWELLE;
  const fortschritt = Math.round((anzahl / STATIONEN_V3.length) * 100);

  return (
    <div className="flex flex-col gap-lg">
      <header className="border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-primary">Zeitstrahl</p>
        <h1 className="mt-sm text-headline-xl text-on-surface">Wähle deine Stationen</h1>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          Sieben KI-Themen, frei wählbar in deiner Reihenfolge. Abgeschlossene Stationen
          werden grün. Ab <strong>{ZERTIFIKAT_SCHWELLE}</strong> Stationen erhältst du dein
          Zertifikat — weitere ergänzen deine Badge-Sammlung.
        </p>
      </header>

      {/* Fortschrittsbalken */}
      <div className="flex flex-col gap-sm rounded-xl bg-surface-container-low px-lg py-md">
        <div className="flex items-center gap-md">
          <span className="material-symbols-outlined text-[22px] text-tertiary">
            {genug ? "workspace_premium" : "trending_up"}
          </span>
          <p className="text-body-md text-on-surface">
            <strong>{anzahl}</strong> von {STATIONEN_V3.length} Stationen abgeschlossen
            {genug
              ? " — Zertifikat freigeschaltet."
              : ` — noch ${ZERTIFIKAT_SCHWELLE - anzahl} bis zum Zertifikat.`}
          </p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-bright">
          <div
            className="h-full rounded-full bg-tertiary transition-all"
            style={{ width: `${fortschritt}%` }}
          />
        </div>
      </div>

      {/* Zeitstrahl der 7 Stationen */}
      <div className="relative">
        <div aria-hidden className="absolute inset-x-2 top-6 h-0.5 bg-outline-variant" />
        <ol className="relative flex gap-md overflow-x-auto pb-md">
          {STATIONEN_V3.map((st) => {
            const fertig = abgeschlossen.includes(st.id);
            return (
              <li key={st.id} className="flex w-44 shrink-0 flex-col items-center text-center">
                <button
                  type="button"
                  onClick={() => stationOeffnen(st)}
                  aria-label={`Station ${st.nummer}: ${st.frage}${fertig ? " (abgeschlossen)" : ""}`}
                  className="group flex w-full flex-col items-center gap-sm"
                >
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-sm transition group-hover:-translate-y-0.5 ${
                      fertig
                        ? "border-tertiary bg-tertiary text-on-tertiary"
                        : "border-outline-variant bg-primary-container text-on-primary-container group-hover:border-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">
                      {fertig ? "check" : st.icon}
                    </span>
                  </span>
                  <span className="flex flex-col gap-xs rounded-xl border border-outline-variant bg-surface-bright p-sm shadow-sm transition group-hover:shadow-lg">
                    <span className="flex items-center justify-center gap-xs">
                      <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                        Station {st.nummer}
                      </span>
                      {st.freiwillig && (
                        <span className="rounded-lg bg-tertiary-container px-xs text-label-sm text-on-tertiary-container">
                          freiwillig
                        </span>
                      )}
                    </span>
                    <span className="text-body-sm font-medium text-on-surface">{st.frage}</span>
                    <span className="text-label-sm text-on-surface-variant">{st.tags.join(" · ")}</span>
                    <span
                      className={`mt-xs inline-flex items-center justify-center gap-xs text-label-md ${
                        fertig ? "text-tertiary" : "text-primary"
                      }`}
                    >
                      {fertig ? "Nochmals ansehen" : "Starten"}
                      <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-0.5">
                        arrow_forward
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Badge-Sammlung (Vorschau) */}
      {badges.length > 0 && (
        <div className="flex flex-col gap-sm rounded-xl border border-outline-variant bg-surface-container-low p-lg">
          <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
            <span className="material-symbols-outlined text-[18px]">military_tech</span>
            Deine Badge-Sammlung
          </p>
          <div className="flex flex-wrap gap-sm">
            {badges.map(([familie, anzahl]) => {
              const info = BADGE_FAMILIEN[familie];
              return (
                <div
                  key={familie}
                  className="inline-flex items-center gap-xs rounded-xl bg-tertiary-container px-md py-sm text-on-tertiary-container"
                >
                  <span className="material-symbols-outlined text-[20px]">{info.icon}</span>
                  <span className="text-body-sm font-semibold">{info.label}</span>
                  {anzahl > 1 && <span className="text-label-sm">×{anzahl}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Abschluss-Vorschau + Zertifikat-Zugang */}
      <div className="flex flex-wrap justify-end gap-sm border-t border-outline-variant pt-lg">
        <button
          type="button"
          onClick={abschlussOeffnen}
          className="inline-flex items-center gap-sm rounded-xl border border-tertiary px-lg py-sm text-label-md text-tertiary transition hover:bg-tertiary-container"
        >
          <span className="material-symbols-outlined text-[18px]">explore</span>
          {onWeiterZumAbschluss ? "Zum Abschluss" : "Meine Landkarte"}
        </button>
        <button
          type="button"
          onClick={zertOeffnen}
          disabled={!genug}
          className="inline-flex items-center gap-sm rounded-xl bg-tertiary px-lg py-sm text-label-md text-on-tertiary shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          title={genug ? undefined : `Erst ab ${ZERTIFIKAT_SCHWELLE} abgeschlossenen Stationen`}
        >
          <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
          Zertifikat ansehen
        </button>
      </div>
    </div>
  );
}
