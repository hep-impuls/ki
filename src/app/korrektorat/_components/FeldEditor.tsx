"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api, type DateiAntwort, type Feld, type SpeichernAntwort } from "../_lib/api";
import { entwurfLesen, entwurfSchreiben, type Entwurf } from "../_lib/entwuerfe";
import Meldung from "./Meldung";

/**
 * Der eigentliche Korrektur-Editor für eine Datei: links die Abschnitte, rechts
 * ein Feld pro Textstelle.
 *
 * Die grössten Dateien haben mehrere Hundert Textstellen. Darum wird immer nur
 * **ein Abschnitt** gezeigt (oder, beim Suchen, die Treffer über alle
 * Abschnitte). Das ist schneller und entspricht dem Arbeiten: Abschnitt für
 * Abschnitt durchgehen.
 */

export default function FeldEditor({
  pfad,
  zielFeld,
  onZurueck,
  onFehler,
}: {
  pfad: string;
  /** Feld-Kennung aus der Gesamtsuche — wird angesprungen und hervorgehoben. */
  zielFeld?: string;
  onZurueck: () => void;
  onFehler: (err: unknown) => boolean;
}) {
  const [daten, setDaten] = useState<DateiAntwort | null>(null);
  const [werte, setWerte] = useState<Record<string, string>>({});
  const [abschnitt, setAbschnitt] = useState<string | null>(null);
  const [suche, setSuche] = useState("");
  const [nurGeaendert, setNurGeaendert] = useState(false);
  const [speichert, setSpeichert] = useState(false);
  const [ergebnis, setErgebnis] = useState<SpeichernAntwort | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);

  const laden = useCallback(
    async (behalteEntwurf: boolean) => {
      setDaten(null);
      try {
        const antwort = await api.datei(pfad);
        const entwurf = behalteEntwurf ? entwurfLesen(pfad) : {};
        const start: Record<string, string> = {};
        for (const f of antwort.felder) start[f.id] = entwurf[f.id] ?? f.value;
        setDaten(antwort);
        setWerte(start);
        // Kommt die Datei aus der Gesamtsuche, wird der Abschnitt der gesuchten
        // Stelle geöffnet statt der erste.
        const ziel = zielFeld ? antwort.felder.find((f) => f.id === zielFeld) : undefined;
        setAbschnitt(ziel?.section ?? antwort.felder[0]?.section ?? null);
      } catch (err) {
        if (onFehler(err)) return;
        setFehler(err instanceof Error ? err.message : String(err));
      }
    },
    [pfad, zielFeld, onFehler],
  );

  useEffect(() => {
    void laden(true);
  }, [laden]);

  const felder = daten?.felder ?? [];

  const geaenderteIds = useMemo(
    () => felder.filter((f) => (werte[f.id] ?? f.value) !== f.original).map((f) => f.id),
    [felder, werte],
  );

  // Entwurf bei jeder Änderung mitschreiben, damit ein geschlossener Tab nichts
  // kostet.
  useEffect(() => {
    if (!daten) return;
    const entwurf: Entwurf = {};
    for (const id of geaenderteIds) entwurf[id] = werte[id];
    entwurfSchreiben(pfad, entwurf);
  }, [daten, geaenderteIds, werte, pfad]);

  useEffect(() => {
    if (geaenderteIds.length === 0) return;
    const warnen = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warnen);
    return () => window.removeEventListener("beforeunload", warnen);
  }, [geaenderteIds.length]);

  // Aus der Gesamtsuche kommend: an die gesuchte Stelle rollen und sie kurz
  // hervorheben, damit sie zwischen Dutzenden Feldern sofort ins Auge fällt.
  const [hervorgehoben, setHervorgehoben] = useState<string | null>(null);
  const gesprungen = useRef(false);
  useEffect(() => {
    // Nur beim ersten Laden springen — nach einem Speichervorgang lädt die
    // Datei neu, und dann soll der Blick bleiben, wo er ist.
    if (!daten || !zielFeld || gesprungen.current) return;
    gesprungen.current = true;
    const knoten = document.getElementById(feldDomId(zielFeld));
    if (!knoten) return;
    knoten.scrollIntoView({ block: "center", behavior: "smooth" });
    knoten.querySelector<HTMLElement>("textarea, input")?.focus({ preventScroll: true });
    setHervorgehoben(zielFeld);
    const timer = setTimeout(() => setHervorgehoben(null), 4000);
    return () => clearTimeout(timer);
  }, [daten, zielFeld]);

  const abschnitte = useMemo(() => {
    const map = new Map<string, { titel: string; anzahl: number; geaendert: number }>();
    for (const f of felder) {
      const eintrag = map.get(f.section) || { titel: f.section, anzahl: 0, geaendert: 0 };
      eintrag.anzahl++;
      if ((werte[f.id] ?? f.value) !== f.original) eintrag.geaendert++;
      map.set(f.section, eintrag);
    }
    return [...map.values()];
  }, [felder, werte]);

  const suchend = suche.trim().length > 1 || nurGeaendert;
  const sichtbar = useMemo(() => {
    const begriff = suche.trim().toLowerCase();
    return felder.filter((f) => {
      if (nurGeaendert && (werte[f.id] ?? f.value) === f.original) return false;
      if (begriff.length > 1) {
        const heu = `${f.label} ${f.section} ${werte[f.id] ?? f.value}`.toLowerCase();
        if (!heu.includes(begriff)) return false;
      } else if (!suchend && f.section !== abschnitt) return false;
      return true;
    });
  }, [felder, werte, suche, nurGeaendert, suchend, abschnitt]);

  async function speichern() {
    if (!daten || geaenderteIds.length === 0) return;
    setSpeichert(true);
    setFehler(null);
    setErgebnis(null);
    try {
      const zuSenden = felder
        .filter((f) => geaenderteIds.includes(f.id))
        .map((f) => ({ ...f, value: werte[f.id] }));
      const antwort = await api.speichern(pfad, zuSenden);
      setErgebnis(antwort);
      // Nach dem Commit haben sich alle Positionen dahinter verschoben — neu
      // laden, statt mit veralteten Offsets weiterzuarbeiten.
      await laden(false);
    } catch (err) {
      if (!onFehler(err)) setFehler(err instanceof Error ? err.message : String(err));
    } finally {
      setSpeichert(false);
    }
  }

  if (fehler && !daten) {
    return (
      <div className="mt-lg">
        <ZurueckKnopf onZurueck={onZurueck} />
        <Meldung art="fehler" className="mt-md">
          {fehler}
        </Meldung>
      </div>
    );
  }

  if (!daten) {
    return (
      <div className="mt-lg">
        <ZurueckKnopf onZurueck={onZurueck} />
        <p className="mt-md text-body-md text-on-surface-variant">Lädt die Textstellen …</p>
      </div>
    );
  }

  return (
    <div className="mt-lg">
      <ZurueckKnopf onZurueck={onZurueck} />

      <div className="mt-md flex flex-wrap items-end justify-between gap-md border-b border-outline-variant pb-md">
        <div>
          <p className="text-label-sm uppercase tracking-wider text-tertiary">{daten.gruppe}</p>
          <h2 className="mt-xs text-headline-sm text-on-surface">{daten.titel}</h2>
          <p className="mt-xs text-body-sm text-on-surface-variant">
            {felder.length} {felder.length === 1 ? "Textstelle" : "Textstellen"}
            {geaenderteIds.length > 0 && ` · ${geaenderteIds.length} geändert`}
          </p>
        </div>
        <button
          type="button"
          onClick={speichern}
          disabled={speichert || geaenderteIds.length === 0 || Boolean(daten.nurLesen)}
          className="rounded-lg bg-primary px-md py-sm text-label-md text-on-primary transition-opacity disabled:opacity-40"
        >
          {daten.nurLesen
            ? "Vorschau — Speichern gesperrt"
            : speichert
              ? "Speichert …"
              : geaenderteIds.length === 0
                ? "Nichts zu speichern"
                : `${geaenderteIds.length} ${geaenderteIds.length === 1 ? "Änderung" : "Änderungen"} speichern`}
        </button>
      </div>

      {daten.hinweis && (
        <Meldung art="warnung" className="mt-md">
          {daten.hinweis}
        </Meldung>
      )}

      {ergebnis && <SpeicherErgebnis ergebnis={ergebnis} onSchliessen={() => setErgebnis(null)} />}

      {fehler && (
        <Meldung art="fehler" className="mt-md" onSchliessen={() => setFehler(null)}>
          {fehler}
        </Meldung>
      )}

      <div className="mt-md flex flex-col gap-lg lg:flex-row">
        <nav className="lg:w-72 lg:shrink-0" aria-label="Abschnitte">
          <div className="lg:sticky lg:top-md">
            <input
              type="search"
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              placeholder="Im Text suchen …"
              className="w-full rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs text-body-sm text-on-surface outline-none focus:border-primary"
            />
            <label className="mt-sm flex items-center gap-xs text-label-md text-on-surface-variant">
              <input
                type="checkbox"
                checked={nurGeaendert}
                onChange={(e) => setNurGeaendert(e.target.checked)}
              />
              nur Geänderte
            </label>

            <ul className="mt-md max-h-[70vh] overflow-y-auto pr-xs">
              {abschnitte.map((a) => {
                const aktiv = !suchend && a.titel === abschnitt;
                return (
                  <li key={a.titel}>
                    <button
                      type="button"
                      onClick={() => {
                        setSuche("");
                        setNurGeaendert(false);
                        setAbschnitt(a.titel);
                      }}
                      className={`flex w-full items-baseline justify-between gap-sm rounded px-sm py-xs text-left text-body-sm transition-colors ${
                        aktiv
                          ? "bg-secondary-container text-on-secondary-container"
                          : "text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      <span className="line-clamp-2">{a.titel}</span>
                      <span className="shrink-0 text-label-sm tabular-nums">
                        {a.geaendert > 0 && (
                          <span className="text-primary">✎{a.geaendert} / </span>
                        )}
                        {a.anzahl}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <div className="min-w-0 flex-1">
          {sichtbar.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">Keine Treffer.</p>
          ) : (
            <ul className="flex flex-col gap-md">
              {sichtbar.map((feld, i) => (
                <FeldZeile
                  key={feld.id}
                  feld={feld}
                  wert={werte[feld.id] ?? feld.value}
                  abschnittZeigen={suchend && sichtbar[i - 1]?.section !== feld.section}
                  hervorgehoben={hervorgehoben === feld.id}
                  onAendern={(neu) => setWerte((v) => ({ ...v, [feld.id]: neu }))}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Einzelnes Feld ────────────────────────────────────────────────────────── */

function FeldZeile({
  feld,
  wert,
  abschnittZeigen,
  hervorgehoben,
  onAendern,
}: {
  feld: Feld;
  wert: string;
  abschnittZeigen: boolean;
  hervorgehoben: boolean;
  onAendern: (neu: string) => void;
}) {
  const geaendert = wert !== feld.original;
  const zeilen = Math.min(20, Math.max(2, Math.ceil(wert.length / 90) + 1));

  return (
    <li id={feldDomId(feld.id)} className="scroll-mt-lg">
      {abschnittZeigen && (
        <p className="mb-xs mt-md text-label-sm uppercase tracking-wider text-tertiary">
          {feld.section}
        </p>
      )}
      <div
        className={`rounded-lg border bg-surface-bright p-md transition-shadow ${
          geaendert ? "border-primary" : "border-outline-variant"
        } ${hervorgehoben ? "ring-2 ring-tertiary" : ""}`}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-sm">
          <span className="text-label-md text-on-surface">{feld.label}</span>
          <span className="flex items-center gap-sm text-label-sm text-on-surface-variant">
            {feld.origin === "jsx-text" && <span title="Text im Seitenfluss">im Fliesstext</span>}
            {geaendert && (
              <button
                type="button"
                onClick={() => onAendern(feld.original)}
                className="text-primary hover:underline"
              >
                Änderung verwerfen
              </button>
            )}
            {feld.mainValue !== undefined && (
              <button
                type="button"
                onClick={() => onAendern(feld.mainValue!)}
                title={feld.mainValue}
                className="hover:underline"
              >
                Ursprung wiederherstellen
              </button>
            )}
          </span>
        </div>

        {feld.context && (
          <p className="mt-xs text-body-sm italic text-on-surface-variant">
            Im Satz: {feld.context}
          </p>
        )}

        {feld.kind === "markdown" ? (
          <textarea
            value={wert}
            rows={zeilen}
            onChange={(e) => onAendern(e.target.value)}
            aria-label={`${feld.section} · ${feld.label}`}
            className="mt-sm w-full resize-y rounded border border-outline-variant bg-surface px-sm py-xs text-body-md leading-relaxed text-on-surface outline-none focus:border-primary"
          />
        ) : (
          <input
            type="text"
            value={wert}
            onChange={(e) => onAendern(e.target.value)}
            aria-label={`${feld.section} · ${feld.label}`}
            className="mt-sm w-full rounded border border-outline-variant bg-surface px-sm py-xs text-body-md text-on-surface outline-none focus:border-primary"
          />
        )}

        {feld.literal === "jsxtext" && /[{}]/.test(wert) && (
          <p className="mt-xs text-body-sm text-error">
            Geschweifte Klammern sind an dieser Stelle nicht möglich — bitte umschreiben.
          </p>
        )}
      </div>
    </li>
  );
}

/* ── Kleinteile ────────────────────────────────────────────────────────────── */

/**
 * Feld-Kennungen enthalten `/`, `[`, `@` und `<` — als DOM-Kennung zulässig,
 * aber nicht als CSS-Selektor. Darum wird ausschliesslich über
 * `getElementById` zugegriffen, und das Präfix hält sie von fremden Kennungen
 * auf der Seite fern.
 */
function feldDomId(feldId: string): string {
  return `korrektorat-feld:${feldId}`;
}

function ZurueckKnopf({ onZurueck }: { onZurueck: () => void }) {
  return (
    <button
      type="button"
      onClick={onZurueck}
      className="inline-flex items-center gap-xs text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
    >
      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
        arrow_back
      </span>
      Zurück zur Übersicht
    </button>
  );
}

function SpeicherErgebnis({
  ergebnis,
  onSchliessen,
}: {
  ergebnis: SpeichernAntwort;
  onSchliessen: () => void;
}) {
  if (ergebnis.angewandt === 0 && ergebnis.uebersprungen.length === 0) {
    return (
      <Meldung art="hinweis" className="mt-md" onSchliessen={onSchliessen}>
        Es gab nichts zu speichern.
      </Meldung>
    );
  }
  return (
    <div className="mt-md flex flex-col gap-sm">
      {ergebnis.angewandt > 0 && (
        <Meldung art="erfolg" onSchliessen={onSchliessen}>
          {ergebnis.angewandt} {ergebnis.angewandt === 1 ? "Änderung" : "Änderungen"} gespeichert.
          Deine Korrekturen sind gesichert; die Redaktion sieht sie gesammelt.
        </Meldung>
      )}
      {ergebnis.uebersprungen.length > 0 && (
        <Meldung art="warnung">
          {ergebnis.uebersprungen.length}{" "}
          {ergebnis.uebersprungen.length === 1 ? "Stelle wurde" : "Stellen wurden"} nicht
          gespeichert:
          <ul className="mt-xs list-disc pl-md">
            {ergebnis.uebersprungen.slice(0, 8).map((u) => (
              <li key={u.id}>{u.grund}</li>
            ))}
          </ul>
          {ergebnis.uebersprungen.some((u) => u.grund.includes("neu laden")) && (
            <p className="mt-xs">
              Am Lernset wurde in der Zwischenzeit gearbeitet. Diese Seite ist gerade neu
              geladen worden — bitte die betroffenen Stellen noch einmal korrigieren.
            </p>
          )}
        </Meldung>
      )}
    </div>
  );
}
