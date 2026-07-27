"use client";

import { useEffect, useRef, useState } from "react";
import { api, type SuchErgebnis, type Treffer } from "../_lib/api";
import Meldung from "./Meldung";

/**
 * Suche über **alle** Textstellen beider Lernseiten.
 *
 * Gedacht für den häufigsten Weg zur Fehlerstelle: Die Korrekturperson liest im
 * Lernset, stolpert über ein Wort und weiss nicht, in welcher Datei es steht.
 * Sie tippt das Wort hier ein und springt mit einem Klick direkt auf das Feld.
 *
 * Getippt wird laufend, geschickt erst nach einer kurzen Pause — jede Anfrage
 * geht über den ganzen Index, und der Server bricht die vorige ab, sobald die
 * nächste kommt.
 */

export default function GesamtSuche({
  onOeffnen,
}: {
  onOeffnen: (pfad: string, feldId: string) => void;
}) {
  const [begriff, setBegriff] = useState("");
  const [ganzeWoerter, setGanzeWoerter] = useState(false);
  const [ergebnis, setErgebnis] = useState<SuchErgebnis | null>(null);
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const abbruch = useRef<AbortController | null>(null);

  useEffect(() => {
    const gesucht = begriff.trim();
    abbruch.current?.abort();
    if (gesucht.length < 2) {
      setErgebnis(null);
      setLaeuft(false);
      setFehler(null);
      return;
    }

    const steuerung = new AbortController();
    abbruch.current = steuerung;
    setLaeuft(true);
    const timer = setTimeout(() => {
      api
        .suchen(gesucht, ganzeWoerter, steuerung.signal)
        .then((antwort) => {
          if (steuerung.signal.aborted) return;
          setErgebnis(antwort);
          setFehler(null);
        })
        .catch((err) => {
          if (steuerung.signal.aborted || err?.name === "AbortError") return;
          setFehler(err instanceof Error ? err.message : String(err));
          setErgebnis(null);
        })
        .finally(() => {
          if (!steuerung.signal.aborted) setLaeuft(false);
        });
    }, 350);

    return () => {
      clearTimeout(timer);
      steuerung.abort();
    };
  }, [begriff, ganzeWoerter]);

  return (
    <section className="rounded-lg border border-outline-variant bg-surface-container-low p-md">
      <label htmlFor="gesamtsuche" className="text-label-md text-on-surface">
        Textstelle suchen
      </label>
      <p className="mt-xs text-body-sm text-on-surface-variant">
        Sucht das Wort in allen Texten beider Lernseiten. Ein Klick auf einen Treffer öffnet
        die Stelle direkt.
      </p>

      <div className="mt-sm flex flex-wrap items-center gap-md">
        <input
          id="gesamtsuche"
          type="search"
          value={begriff}
          onChange={(e) => setBegriff(e.target.value)}
          placeholder="z.B. Grösse, dass, Künstliche Intelligenz …"
          className="min-w-0 flex-1 rounded-lg border border-outline bg-surface-bright px-md py-sm text-body-md text-on-surface outline-none focus:border-primary"
        />
        <label className="flex items-center gap-xs text-label-md text-on-surface-variant">
          <input
            type="checkbox"
            checked={ganzeWoerter}
            onChange={(e) => setGanzeWoerter(e.target.checked)}
          />
          nur ganze Wörter
        </label>
      </div>

      {fehler && (
        <Meldung art="fehler" className="mt-sm">
          {fehler}
        </Meldung>
      )}

      {laeuft && !ergebnis && (
        <p className="mt-sm text-body-sm text-on-surface-variant">Sucht …</p>
      )}

      {ergebnis && <Ergebnisliste ergebnis={ergebnis} laeuft={laeuft} onOeffnen={onOeffnen} />}
    </section>
  );
}

function Ergebnisliste({
  ergebnis,
  laeuft,
  onOeffnen,
}: {
  ergebnis: SuchErgebnis;
  laeuft: boolean;
  onOeffnen: (pfad: string, feldId: string) => void;
}) {
  if (ergebnis.gesamt === 0) {
    return (
      <p className="mt-sm text-body-sm text-on-surface-variant">
        Keine Textstelle enthält «{ergebnis.begriff}».
      </p>
    );
  }

  // Treffer nach Datei bündeln, damit die Liste der Übersicht folgt.
  const nachDatei: Array<{ pfad: string; titel: string; gruppe: string; treffer: Treffer[] }> = [];
  for (const t of ergebnis.treffer) {
    let d = nachDatei.find((x) => x.pfad === t.pfad);
    if (!d) {
      d = { pfad: t.pfad, titel: t.dateiTitel, gruppe: t.gruppe, treffer: [] };
      nachDatei.push(d);
    }
    d.treffer.push(t);
  }

  return (
    <div className={laeuft ? "opacity-60 transition-opacity" : "transition-opacity"}>
      <p className="mt-md text-body-sm text-on-surface-variant">
        {ergebnis.gesamt} {ergebnis.gesamt === 1 ? "Textstelle" : "Textstellen"} in{" "}
        {ergebnis.dateien} {ergebnis.dateien === 1 ? "Datei" : "Dateien"}.
        {ergebnis.gekuerzt && (
          <> Angezeigt werden die ersten {ergebnis.treffer.length} — bitte genauer suchen.</>
        )}
      </p>

      <div className="mt-sm max-h-[60vh] overflow-y-auto pr-xs">
        {nachDatei.map((datei) => (
          <div key={datei.pfad} className="mt-md first:mt-0">
            <p className="text-label-md text-on-surface">
              {datei.titel}{" "}
              <span className="text-label-sm font-normal text-on-surface-variant">
                · {datei.gruppe}
              </span>
            </p>
            <ul className="mt-xs flex flex-col gap-xs">
              {datei.treffer.map((t) => (
                <li key={t.feldId}>
                  <button
                    type="button"
                    onClick={() => onOeffnen(t.pfad, t.feldId)}
                    className="w-full rounded border border-outline-variant bg-surface-bright px-sm py-xs text-left transition-colors hover:border-primary hover:bg-surface-container"
                  >
                    <span className="block text-label-sm text-on-surface-variant">
                      {t.section} · {t.label}
                      {t.anzahl > 1 && ` · ${t.anzahl}×`}
                    </span>
                    <span className="mt-xs block text-body-sm text-on-surface">
                      {t.auszug.slice(0, t.von)}
                      <mark className="rounded-sm bg-tertiary-container px-[2px] text-on-tertiary-container">
                        {t.auszug.slice(t.von, t.bis)}
                      </mark>
                      {t.auszug.slice(t.bis)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
