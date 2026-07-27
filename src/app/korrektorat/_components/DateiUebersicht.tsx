"use client";

import { useEffect, useState } from "react";
import { api, type Uebersicht } from "../_lib/api";
import { dateienMitEntwurf } from "../_lib/entwuerfe";
import GesamtSuche from "./GesamtSuche";
import Meldung from "./Meldung";

/**
 * Übersicht aller Inhaltsdateien, nach Lernseite und Thema gruppiert.
 *
 * Drei Marken pro Datei: **bearbeitet** (in dieser Runde schon gespeichert),
 * **Entwurf** (lokal getippt, noch nicht gespeichert) und ein Hinweis, wenn ein
 * Text im Lernset gar nicht angezeigt wird.
 */

export default function DateiUebersicht({
  onOeffnen,
  onFehler,
}: {
  onOeffnen: (pfad: string, feldId?: string) => void;
  onFehler: (err: unknown) => boolean;
}) {
  const [daten, setDaten] = useState<Uebersicht | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);
  const [entwuerfe, setEntwuerfe] = useState<Record<string, number>>({});

  useEffect(() => {
    setEntwuerfe(dateienMitEntwurf());
    let abgebrochen = false;
    api
      .dateien()
      .then((d) => {
        if (!abgebrochen) setDaten(d);
      })
      .catch((err) => {
        if (abgebrochen || onFehler(err)) return;
        setFehler(err instanceof Error ? err.message : String(err));
      });
    return () => {
      abgebrochen = true;
    };
  }, [onFehler]);

  if (fehler) {
    return (
      <Meldung art="fehler" className="mt-lg">
        {fehler}
      </Meldung>
    );
  }

  if (!daten) {
    return (
      <p className="mt-xl text-body-md text-on-surface-variant">
        Liest die Inhalte aus dem Repository … das dauert beim ersten Mal ein paar Sekunden.
      </p>
    );
  }

  const entwurfDateien = Object.keys(entwuerfe).length;

  return (
    <div className="mt-lg">
      {daten.quelle === "lokal" && (
        <Meldung art="warnung" className="mb-md">
          Vorschau aus dem Arbeitsverzeichnis (<code>KORREKTORAT_QUELLE=lokal</code>). Texte
          sind lesbar, Speichern ist gesperrt.
        </Meldung>
      )}
      <GesamtSuche onOeffnen={onOeffnen} />

      <p className="mt-lg text-body-md text-on-surface-variant">
        {daten.felderTotal.toLocaleString("de-CH")} Textstellen in{" "}
        {daten.gruppen.reduce((a, g) => a + g.dateien.length, 0)} Dateien.
        {daten.bearbeiteteDateien > 0 && (
          <>
            {" "}
            Bereits gespeichert in {daten.bearbeiteteDateien}{" "}
            {daten.bearbeiteteDateien === 1 ? "Datei" : "Dateien"}.
          </>
        )}
        {entwurfDateien > 0 && (
          <>
            {" "}
            Ungespeicherte Entwürfe in {entwurfDateien}{" "}
            {entwurfDateien === 1 ? "Datei" : "Dateien"}.
          </>
        )}
      </p>

      {daten.gruppen.map((gruppe) => (
        <section key={gruppe.titel} className="mt-xl">
          <h2 className="text-headline-sm text-on-surface">{gruppe.titel}</h2>
          <ul className="mt-md flex flex-col gap-sm">
            {gruppe.dateien.map((datei) => (
              <li key={datei.pfad}>
                <button
                  type="button"
                  onClick={() => onOeffnen(datei.pfad)}
                  className="flex w-full flex-wrap items-baseline justify-between gap-sm rounded-lg border border-outline-variant bg-surface-bright px-md py-sm text-left transition-colors hover:border-primary hover:bg-surface-container-low"
                >
                  <span className="flex-1">
                    <span className="text-body-md text-on-surface">{datei.titel}</span>
                    {datei.hinweis && (
                      <span className="mt-xs block text-label-sm text-tertiary">
                        {datei.hinweis}
                      </span>
                    )}
                  </span>
                  <span className="flex shrink-0 items-center gap-sm text-label-sm">
                    {entwuerfe[datei.pfad] && (
                      <span className="rounded bg-tertiary-container px-xs py-[2px] text-on-tertiary-container">
                        Entwurf: {entwuerfe[datei.pfad]}
                      </span>
                    )}
                    {datei.bearbeitet && (
                      <span className="rounded bg-primary-container px-xs py-[2px] text-on-primary-container">
                        bearbeitet
                      </span>
                    )}
                    <span className="text-on-surface-variant">
                      {datei.felder} {datei.felder === 1 ? "Stelle" : "Stellen"}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
