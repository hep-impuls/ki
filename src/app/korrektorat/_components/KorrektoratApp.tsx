"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiFehler, api, type MeAntwort } from "../_lib/api";
import DateiUebersicht from "./DateiUebersicht";
import FeldEditor from "./FeldEditor";
import Meldung from "./Meldung";

/**
 * Korrektorat-Editor — Zustandsmaschine über drei Ansichten: Anmelden,
 * Dateiübersicht, Feld-Editor.
 *
 * Der Korrektor meldet sich am Editor an, nicht an GitHub. Dass am Ende ein
 * Pull Request entsteht, muss er nicht wissen; darum steht «Runde» statt
 * «Branch» in der Oberfläche.
 */

type Ansicht =
  | { art: "laden" }
  | { art: "anmelden" }
  | { art: "uebersicht" }
  /** `zielFeld` kommt aus der Gesamtsuche: Datei öffnen und direkt hinspringen. */
  | { art: "datei"; pfad: string; zielFeld?: string };

export default function KorrektoratApp() {
  const [ansicht, setAnsicht] = useState<Ansicht>({ art: "laden" });
  const [me, setMe] = useState<MeAntwort | null>(null);
  const [fehler, setFehler] = useState<string | null>(null);

  const pruefen = useCallback(async () => {
    try {
      const antwort = await api.me();
      setMe(antwort);
      setAnsicht({ art: antwort.angemeldet ? "uebersicht" : "anmelden" });
    } catch (err) {
      setFehler(err instanceof Error ? err.message : String(err));
      setAnsicht({ art: "anmelden" });
    }
  }, []);

  useEffect(() => {
    void pruefen();
  }, [pruefen]);

  /** 401 an einer beliebigen Stelle heisst: Sitzung ist abgelaufen. */
  const behandleFehler = useCallback((err: unknown) => {
    if (err instanceof ApiFehler && err.status === 401) {
      setAnsicht({ art: "anmelden" });
      setFehler("Die Anmeldung ist abgelaufen. Bitte den Passcode erneut eingeben.");
      return true;
    }
    return false;
  }, []);

  async function abmelden() {
    await api.abmelden().catch(() => undefined);
    setAnsicht({ art: "anmelden" });
  }

  return (
    <div className="mx-auto min-h-dvh max-w-[1280px] px-md py-lg sm:px-lg">
      <header className="flex flex-wrap items-baseline justify-between gap-md border-b border-outline-variant pb-md">
        <div>
          <p className="text-label-sm uppercase tracking-wider text-tertiary">
            Lernumgebung zu KI · Korrektorat
          </p>
          <h1 className="mt-xs text-headline-md text-on-surface">Texte lesen und korrigieren</h1>
        </div>
        {ansicht.art !== "anmelden" && ansicht.art !== "laden" && (
          <div className="flex items-center gap-md text-body-sm text-on-surface-variant">
            {me?.runde && <span>Runde: {me.runde.replace(/^korrektorat\//, "")}</span>}
            <button
              type="button"
              onClick={abmelden}
              className="rounded-lg border border-outline-variant px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:bg-surface-container"
            >
              Abmelden
            </button>
          </div>
        )}
      </header>

      {fehler && (
        <Meldung art="fehler" className="mt-md" onSchliessen={() => setFehler(null)}>
          {fehler}
        </Meldung>
      )}

      {ansicht.art === "laden" && (
        <p className="mt-xl text-body-md text-on-surface-variant">Lädt …</p>
      )}

      {ansicht.art === "anmelden" && (
        <Anmeldung
          me={me}
          onAngemeldet={() => {
            setFehler(null);
            void pruefen();
          }}
        />
      )}

      {ansicht.art === "uebersicht" && (
        <DateiUebersicht
          onOeffnen={(pfad, zielFeld) => setAnsicht({ art: "datei", pfad, zielFeld })}
          onFehler={behandleFehler}
        />
      )}

      {ansicht.art === "datei" && (
        <FeldEditor
          // Neu montieren, wenn aus der Suche ein anderes Ziel kommt.
          key={`${ansicht.pfad}#${ansicht.zielFeld ?? ""}`}
          pfad={ansicht.pfad}
          zielFeld={ansicht.zielFeld}
          onZurueck={() => setAnsicht({ art: "uebersicht" })}
          onFehler={behandleFehler}
        />
      )}
    </div>
  );
}

/* ── Anmeldung ─────────────────────────────────────────────────────────────── */

function Anmeldung({ me, onAngemeldet }: { me: MeAntwort | null; onAngemeldet: () => void }) {
  const [passcode, setPasscode] = useState("");
  const [laeuft, setLaeuft] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  async function absenden(e: React.FormEvent) {
    e.preventDefault();
    setLaeuft(true);
    setFehler(null);
    try {
      await api.anmelden(passcode);
      setPasscode("");
      onAngemeldet();
    } catch (err) {
      setFehler(err instanceof Error ? err.message : String(err));
    } finally {
      setLaeuft(false);
    }
  }

  if (me && !me.konfiguriert) {
    return (
      <Meldung art="fehler" className="mt-xl">
        Der Editor ist auf diesem Server noch nicht eingerichtet. Es fehlt:{" "}
        {me.fehlendeKonfig.join(", ")}. Die Einrichtung ist in{" "}
        <code className="text-body-sm">docs/KORREKTORAT.md</code> beschrieben.
      </Meldung>
    );
  }

  return (
    <section className="mx-auto mt-xxl max-w-md">
      <h2 className="text-headline-sm text-on-surface">Anmelden</h2>
      <p className="mt-sm text-body-md text-on-surface-variant">
        Bitte den Passcode eingeben, den du per Mail bekommen hast. Die Anmeldung gilt
        eine Woche.
      </p>
      <form onSubmit={absenden} className="mt-lg flex flex-col gap-sm">
        <label htmlFor="passcode" className="text-label-md text-on-surface-variant">
          Passcode
        </label>
        <input
          id="passcode"
          type="password"
          autoComplete="current-password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="rounded-lg border border-outline bg-surface-bright px-md py-sm text-body-md text-on-surface outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={laeuft || !passcode.trim()}
          className="mt-sm rounded-lg bg-primary px-md py-sm text-label-md text-on-primary transition-opacity disabled:opacity-40"
        >
          {laeuft ? "Prüft …" : "Anmelden"}
        </button>
      </form>
      {fehler && (
        <Meldung art="fehler" className="mt-md">
          {fehler}
        </Meldung>
      )}
    </section>
  );
}
