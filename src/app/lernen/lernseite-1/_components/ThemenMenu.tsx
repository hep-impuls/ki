"use client";

import { useEffect, useState } from "react";
import type { BadgeFamilie, Station } from "../_data/types";
import { STATIONEN_V3 } from "../_data/stationenV3";
import { BADGE_FAMILIEN } from "../_data/badges";
import { abgeschlosseneStationen, badgeSammlung } from "../_lib/stationStore";
import { gesamtErfuellung, stationErfuellung, type Erfuellung } from "../_lib/erfuellung";
import type { RouteApi } from "../_lib/route";
import StationV3 from "./StationV3";
import Abschlussbericht from "./Abschlussbericht";
import AbschlussVorschau from "./AbschlussVorschau";
import Erfuellungsbalken from "./Erfuellungsbalken";

/**
 * ThemenMenu (vormals ZeitstrahlMenu) — die sieben Themen als **Karten-Raster**.
 *
 * Umbau 2026-07-28 (Entscheid: freie Wahl statt Fortschritts-Erzählung):
 *   - **Kein Zeitstrahl mehr.** Eine Zeitachse behauptet eine Reihenfolge; ein
 *     Raster nicht. Die Themen sind gleichrangig und frei wählbar.
 *   - **Keine Nummern.** Statt «Station 1 … 7» trägt jedes Thema einen
 *     thematischen Kurznamen («Thema · Arbeit»). Die Nummer lebt nur noch in
 *     der URL (`#/station/1/…`) und in den Storage-Keys weiter.
 *   - **Erfüllungsgrad je Thema** (`_lib/erfuellung.ts`): jede Karte zeigt, wie
 *     viel davon bearbeitet ist — nicht nur das binäre «abgeschlossen».
 *   - **Keine Schwelle für den Bericht.** Der Abschlussbericht ist jederzeit
 *     abrufbar; das frühere «ab 3 Stationen» ist ersatzlos weg.
 *
 * Quelle der Wahrheit bleibt der lokale `stationStore` (localStorage); beim
 * Rücksprung ins Menü wird der Stand neu eingelesen. **Keine** Cloud-Writes.
 */

interface ThemaStand {
  station: Station;
  erfuellung: Erfuellung;
  abgeschlossen: boolean;
}

export default function ThemenMenu({
  nav,
  onWeiterZumAbschluss,
}: {
  /** M10: im orchestrierten Flow (KiEinheitV3) gesetzt — offenes Thema +
   *  Bericht-Ansicht + Frame kommen dann aus der URL. Ohne `nav`
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
  const [berichtLocal, setBerichtLocal] = useState(false);
  const [abschlussLocal, setAbschlussLocal] = useState(false);

  const [staende, setStaende] = useState<ThemaStand[]>([]);
  const [gesamt, setGesamt] = useState<Erfuellung | null>(null);
  const [badges, setBadges] = useState<[BadgeFamilie, number][]>([]);

  // Aktuelle Ansicht: aus der URL (routed) oder aus lokalem State (Preview).
  const offen: Station | null = istRouted
    ? routed?.phase === "station"
      ? STATIONEN_V3.find((s) => s.nummer === routed.nummer) ?? null
      : null
    : offenLocal;
  const zeigeBericht = istRouted
    ? routed?.phase === "stationen" && routed.view === "bericht"
    : berichtLocal;
  const zeigeAbschluss = istRouted ? false : abschlussLocal;

  // Navigations-Helfer: im routed-Modus in die URL, sonst lokaler State.
  const themaOeffnen = (st: Station) =>
    istRouted
      ? nav!.push({ phase: "station", nummer: st.nummer, sub: "auftakt", pos: 1 })
      : setOffenLocal(st);
  const zumMenu = () => {
    if (istRouted) nav!.push({ phase: "stationen", view: "menu" });
    else {
      setOffenLocal(null);
      setBerichtLocal(false);
      setAbschlussLocal(false);
    }
  };
  const berichtOeffnen = () =>
    istRouted ? nav!.push({ phase: "stationen", view: "bericht" }) : setBerichtLocal(true);
  const abschlussOeffnen = () =>
    onWeiterZumAbschluss ? onWeiterZumAbschluss() : setAbschlussLocal(true);

  // Beim Mount und nach jedem Rücksprung ins Menü den lokalen Stand neu lesen
  // (Abschluss wird in StationV3 gesetzt). SSR-sicher: erst nach Mount.
  useEffect(() => {
    if (!offen && !zeigeBericht && !zeigeAbschluss) {
      const fertig = abgeschlosseneStationen();
      setStaende(
        STATIONEN_V3.map((station) => ({
          station,
          erfuellung: stationErfuellung(station),
          abgeschlossen: fertig.includes(station.id),
        })),
      );
      setGesamt(gesamtErfuellung(STATIONEN_V3));
      setBadges(Object.entries(badgeSammlung()) as [BadgeFamilie, number][]);
    }
  }, [offen, zeigeBericht, zeigeAbschluss]);

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

  if (zeigeBericht) {
    return <Abschlussbericht onBack={zumMenu} />;
  }

  if (zeigeAbschluss) {
    return <AbschlussVorschau onBack={() => setAbschlussLocal(false)} />;
  }

  const fertigAnzahl = staende.filter((s) => s.abgeschlossen).length;
  const begonnen = staende.filter((s) => s.erfuellung.erledigt > 0).length;

  return (
    <div className="flex flex-col gap-lg">
      <header className="border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-primary">Themenfeld</p>
        <h1 className="mt-sm text-headline-xl text-on-surface">Wähle deine Themen</h1>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          Sieben KI-Themen, alle gleichrangig — es gibt keine vorgegebene Reihenfolge und keine
          Mindestzahl. Du entscheidest, was dich interessiert und wie tief du gehst. Jede Karte
          zeigt dir, wie viel du darin schon bearbeitet hast. Dein Abschlussbericht ist jederzeit
          abrufbar und enthält alles, was du festgehalten hast.
        </p>
      </header>

      {/* Gesamtstand */}
      {gesamt && (
        <div className="flex flex-col gap-sm rounded-xl bg-surface-container-low px-lg py-md">
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-[22px] text-tertiary">insights</span>
            <p className="text-body-md text-on-surface">
              <strong>{begonnen}</strong> von {STATIONEN_V3.length} Themen begonnen ·{" "}
              <strong>{fertigAnzahl}</strong> abgeschlossen
            </p>
          </div>
          <Erfuellungsbalken
            prozent={gesamt.prozent}
            erledigt={gesamt.erledigt}
            gesamt={gesamt.gesamt}
            label="der ganzen Einheit bearbeitet"
          />
        </div>
      )}

      {/* Die 7 Themen als gleichrangiges Raster (keine Achse, keine Nummern) */}
      <ul className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
        {staende.map(({ station, erfuellung, abgeschlossen }) => (
          <li key={station.id} className="flex">
            <button
              type="button"
              onClick={() => themaOeffnen(station)}
              aria-label={`Thema ${station.kurzname}: ${station.frage}${
                abgeschlossen ? " (abgeschlossen)" : ""
              } — ${erfuellung.prozent} Prozent bearbeitet`}
              className="group flex w-full flex-col gap-sm rounded-xl border border-outline-variant bg-surface-bright p-lg text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
            >
              <span className="flex items-center justify-between gap-sm">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                    abgeschlossen
                      ? "bg-tertiary text-on-tertiary"
                      : "bg-primary-container text-on-primary-container"
                  }`}
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {abgeschlossen ? "check" : station.icon}
                  </span>
                </span>
                {station.freiwillig && (
                  <span className="rounded-lg bg-tertiary-container px-sm py-[2px] text-label-sm text-on-tertiary-container">
                    freiwillig
                  </span>
                )}
              </span>

              <span className="text-label-sm uppercase tracking-wider text-tertiary">
                Thema · {station.kurzname}
              </span>
              <span className="text-body-lg font-medium text-on-surface">{station.frage}</span>
              <span className="text-label-sm text-on-surface-variant">
                {station.tags.join(" · ")}
              </span>

              <span className="mt-auto flex flex-col gap-xs pt-sm">
                <Erfuellungsbalken
                  prozent={erfuellung.prozent}
                  erledigt={erfuellung.erledigt}
                  gesamt={erfuellung.gesamt}
                  kompakt
                />
                <span
                  className={`inline-flex items-center gap-xs text-label-md ${
                    abgeschlossen ? "text-tertiary" : "text-primary"
                  }`}
                >
                  {abgeschlossen
                    ? "Abgeschlossen — nochmals ansehen"
                    : erfuellung.erledigt > 0
                      ? "Weitermachen"
                      : "Starten"}
                  <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-0.5">
                    arrow_forward
                  </span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

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

      {/* Abschluss + Bericht — beides jederzeit erreichbar */}
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
          onClick={berichtOeffnen}
          className="inline-flex items-center gap-sm rounded-xl bg-tertiary px-lg py-sm text-label-md text-on-tertiary shadow-sm transition hover:opacity-90"
        >
          <span className="material-symbols-outlined text-[18px]">description</span>
          Abschlussbericht ansehen
        </button>
      </div>
    </div>
  );
}
