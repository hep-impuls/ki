"use client";

import { useEffect, useState } from "react";
import { getSession, saveSession } from "@/lib/session";
import { SPUR_EVENT } from "../_lib/spuren";

/**
 * FortschrittsCode — macht die geräte-/browserübergreifende Persistenz nutzbar.
 *
 * Im anonymen Code-Modell (kein Passwort) IST der Animal-Code die Identität:
 * Alle Spuren und Bewertungen werden pro Code in Firestore gespiegelt
 * (`spuren.ts` / `gewichtung.ts`). Diese Box zeigt den eigenen Code (zum
 * Notieren) und erlaubt, auf einem anderen Gerät denselben Code einzugeben —
 * danach lädt die Seite neu und holt den Fortschritt aus der Cloud.
 */
export default function FortschrittsCode({ className = "" }: { className?: string }) {
  const [code, setCode] = useState<string | null>(null);
  const [eingabeOffen, setEingabeOffen] = useState(false);
  const [eingabe, setEingabe] = useState("");
  const [kopiert, setKopiert] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  useEffect(() => {
    const lade = () => setCode(getSession()?.studentCode ?? null);
    lade();
    // Sobald bei der ersten Interaktion ein Code entsteht, hier nachziehen.
    window.addEventListener(SPUR_EVENT, lade);
    window.addEventListener("storage", lade);
    return () => {
      window.removeEventListener(SPUR_EVENT, lade);
      window.removeEventListener("storage", lade);
    };
  }, []);

  function kopieren() {
    if (!code) return;
    try {
      void navigator.clipboard?.writeText(code);
      setKopiert(true);
      window.setTimeout(() => setKopiert(false), 1800);
    } catch {
      /* ohne Clipboard-Zugriff: kein Feedback, kein Fehler */
    }
  }

  function laden() {
    const neu = eingabe.trim().toUpperCase();
    // Akzeptiert alt (BÄR-334) UND neu (QWEN-34R) — der optionale End-Buchstabe
    // gehört zum neuen Modell-Code-Format aus session.ts.
    if (!/^[A-ZÄÖÜ]+-\d{2,4}[A-Z]?$/.test(neu)) {
      setFehler("Bitte einen gültigen Code eingeben, z.B. QWEN-34R.");
      return;
    }
    const vorhanden = getSession();
    saveSession({ studentCode: neu, teacherCode: vorhanden?.teacherCode ?? null });
    // Neu laden: beim Mount holen alle Ansichten Spuren + Bewertungen aus der
    // Cloud für den neuen Code.
    window.location.reload();
  }

  return (
    <div
      className={
        "rounded-xl border border-outline-variant bg-surface-container-low p-md " + className
      }
    >
      <p className="flex items-center gap-sm text-label-md uppercase tracking-wider text-tertiary">
        <span className="material-symbols-outlined text-[18px]">badge</span>
        Dein Fortschritts-Code
      </p>

      {code ? (
        <div className="mt-sm flex flex-wrap items-center gap-sm">
          <span
            className="rounded-lg border border-outline-variant bg-surface-bright px-md py-sm text-headline-sm text-on-surface"
            style={{ fontFamily: "ui-monospace, monospace", letterSpacing: "0.05em" }}
          >
            {code}
          </span>
          <button
            type="button"
            onClick={kopieren}
            className="inline-flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:border-tertiary hover:text-tertiary"
          >
            <span className="material-symbols-outlined text-[16px]">
              {kopiert ? "check" : "content_copy"}
            </span>
            {kopiert ? "Kopiert" : "Kopieren"}
          </button>
        </div>
      ) : (
        <p className="mt-sm text-body-sm text-on-surface-variant">
          Sobald du die erste Aufgabe machst, bekommst du automatisch einen Code —
          er erscheint dann hier.
        </p>
      )}

      <p className="mt-sm text-body-sm text-on-surface-variant">
        Notiere dir diesen Code. Gibst du ihn auf einem{" "}
        <strong className="text-on-surface">anderen Gerät oder Browser</strong> ein,
        bekommst du deinen ganzen Fortschritt (angeklickte Punkte, Flächen,
        Bewertungen) zurück. Es gibt kein Passwort — der Code ist dein Schlüssel.
      </p>

      {eingabeOffen ? (
        <div className="mt-sm">
          <label htmlFor="code-eingabe" className="block text-label-sm text-on-surface-variant">
            Bestehenden Code eingeben (lädt den Fortschritt und ersetzt den Stand
            auf diesem Gerät):
          </label>
          <div className="mt-xs flex flex-wrap items-center gap-sm">
            <input
              id="code-eingabe"
              type="text"
              value={eingabe}
              onChange={(e) => {
                setEingabe(e.target.value);
                setFehler(null);
              }}
              placeholder="z.B. QWEN-34R"
              className="w-40 rounded-lg border border-outline-variant bg-surface-bright px-md py-sm text-body-md text-on-surface uppercase placeholder:text-on-surface-variant/60 placeholder:normal-case focus:border-tertiary focus:outline-none"
              style={{ fontFamily: "ui-monospace, monospace" }}
            />
            <button
              type="button"
              onClick={laden}
              className="inline-flex items-center gap-xs rounded-lg bg-tertiary px-md py-sm text-label-md text-on-tertiary shadow-sm transition hover:bg-on-tertiary-container"
            >
              <span className="material-symbols-outlined text-[16px]">cloud_download</span>
              Fortschritt laden
            </button>
            <button
              type="button"
              onClick={() => {
                setEingabeOffen(false);
                setFehler(null);
              }}
              className="text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
            >
              Abbrechen
            </button>
          </div>
          {fehler && <p className="mt-xs text-label-sm text-error">{fehler}</p>}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEingabeOffen(true)}
          className="mt-sm inline-flex items-center gap-xs text-label-md text-tertiary transition-colors hover:underline"
        >
          <span className="material-symbols-outlined text-[16px]">devices</span>
          Auf einem anderen Gerät weitermachen
        </button>
      )}
    </div>
  );
}
