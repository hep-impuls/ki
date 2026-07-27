"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getSession, saveSession } from "@/lib/session";
import { linkTeacherCode } from "@/lib/db";
import { classExists } from "@/lib/api";

/**
 * Account-Menü in der TopAppBar — die eine Stelle, an der Lernende ihren Zugang
 * sehen und verwalten.
 *
 * Warum es das braucht: Der Klassencode ist im Onboarding (`/start`) optional
 * und überspringbar. Wer ihn übersprungen hat, kam bisher nicht mehr in eine
 * Klasse — `/start` leitet bei bestehender Session sofort weiter, der SideNav-
 * Eintrag «Klasse beitreten» lief damit ins Leere. Hier ist der Beitritt
 * nachträglich möglich, ohne Navigation und ohne den Fortschritt anzufassen.
 *
 * Inhalt: Fortschritts-Code (zum Notieren/Kopieren) · Klasse beitreten bzw.
 * beigetretene Klasse + Link auf den Klassenreport.
 */

/** SideNav & Co. können das Menü öffnen, statt auf `/start` zu verlinken. */
export const ACCOUNT_OPEN_EVENT = "ki26-account-open";
/** Wird nach einem Klassenbeitritt gefeuert, damit die Navigation nachzieht. */
export const SESSION_CHANGED_EVENT = "ki26-session-changed";

export default function AccountMenu() {
  const [offen, setOffen] = useState(false);
  const [studentCode, setStudentCode] = useState<string | null>(null);
  const [teacherCode, setTeacherCode] = useState<string | null>(null);

  const [eingabe, setEingabe] = useState("");
  const [busy, setBusy] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  const [kopiert, setKopiert] = useState(false);

  const wrapper = useRef<HTMLDivElement>(null);

  const lesen = useCallback(() => {
    const s = getSession();
    setStudentCode(s?.studentCode ?? null);
    setTeacherCode(s?.teacherCode ?? null);
  }, []);

  // Session lebt in localStorage → erst clientseitig lesen (kein SSR-Mismatch).
  useEffect(() => {
    lesen();
    const oeffnen = () => {
      lesen();
      setOffen(true);
    };
    window.addEventListener(ACCOUNT_OPEN_EVENT, oeffnen);
    window.addEventListener("storage", lesen);
    return () => {
      window.removeEventListener(ACCOUNT_OPEN_EVENT, oeffnen);
      window.removeEventListener("storage", lesen);
    };
  }, [lesen]);

  // Klick daneben und Escape schliessen das Panel.
  useEffect(() => {
    if (!offen) return;
    const klick = (e: MouseEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOffen(false);
    };
    const taste = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOffen(false);
    };
    document.addEventListener("mousedown", klick);
    document.addEventListener("keydown", taste);
    return () => {
      document.removeEventListener("mousedown", klick);
      document.removeEventListener("keydown", taste);
    };
  }, [offen]);

  const kopieren = useCallback(() => {
    if (!studentCode) return;
    void navigator.clipboard?.writeText(studentCode);
    setKopiert(true);
    window.setTimeout(() => setKopiert(false), 1800);
  }, [studentCode]);

  const beitreten = useCallback(async () => {
    const tc = eingabe.trim().toUpperCase();
    if (!tc) {
      setFehler("Bitte gib den Klassencode ein.");
      return;
    }
    if (!studentCode) {
      setFehler("Du hast noch keinen Fortschritts-Code.");
      return;
    }
    setBusy(true);
    setFehler(null);
    try {
      if (!(await classExists(tc))) {
        setFehler("Code nicht gefunden — frag deine Lehrperson.");
        return;
      }
      await linkTeacherCode(studentCode, tc);
      saveSession({ studentCode, teacherCode: tc });
      setTeacherCode(tc);
      setEingabe("");
      window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
    } catch {
      setFehler("Konnte den Code nicht prüfen. Bitte versuche es erneut.");
    } finally {
      setBusy(false);
    }
  }, [eingabe, studentCode]);

  return (
    <div ref={wrapper} className="relative">
      <button
        type="button"
        aria-label="Mein Zugang"
        aria-expanded={offen}
        aria-haspopup="dialog"
        onClick={() => {
          lesen();
          setOffen((v) => !v);
        }}
        className={
          offen
            ? "flex h-8 w-8 items-center justify-center rounded-full border border-primary bg-primary-container text-on-primary-container transition-colors"
            : "flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
        }
      >
        <span className="material-symbols-outlined text-[20px]">account_circle</span>
      </button>

      {offen && (
        <div
          role="dialog"
          aria-label="Mein Zugang"
          /* Mobil über die ganze Breite (der Button sitzt nicht am Rand — ein
             rechtsbündiges Panel würde links aus dem Bild laufen), ab sm als
             klassisches Dropdown unter dem Button. */
          className="fixed left-md right-md top-[4.5rem] z-50 rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-lg sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+0.5rem)] sm:w-[22rem]"
        >
          <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
            <span className="material-symbols-outlined text-[18px]">badge</span>
            Dein Fortschritts-Code
          </p>

          {studentCode ? (
            <div className="mt-sm flex flex-wrap items-center gap-sm">
              <span
                className="rounded-lg border border-outline-variant bg-surface px-md py-xs text-headline-sm text-on-surface"
                style={{ fontFamily: "ui-monospace, monospace", letterSpacing: "0.05em" }}
              >
                {studentCode}
              </span>
              <button
                type="button"
                onClick={kopieren}
                className="inline-flex items-center gap-xs rounded-lg border border-outline-variant px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:border-tertiary hover:text-tertiary"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {kopiert ? "check" : "content_copy"}
                </span>
                {kopiert ? "Kopiert" : "Kopieren"}
              </button>
            </div>
          ) : (
            <p className="mt-sm text-body-sm text-on-surface-variant">
              Du hast noch keinen Code.{" "}
              <Link href="/start" className="text-tertiary hover:underline">
                Hier starten
              </Link>
              .
            </p>
          )}

          <p className="mt-sm text-body-sm text-on-surface-variant">
            Notiere ihn dir — mit diesem Code kommst du auf jedem Gerät zu deinem
            Fortschritt zurück. Es gibt kein Passwort.
          </p>

          <hr className="my-md border-outline-variant" />

          <p className="flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
            <span className="material-symbols-outlined text-[18px]">groups</span>
            Klasse
          </p>

          {teacherCode ? (
            <>
              <p className="mt-sm text-body-sm text-on-surface-variant">
                Du bist in der Klasse{" "}
                <strong className="text-on-surface">{teacherCode}</strong>.
              </p>
              <Link
                href="/klassenreport"
                onClick={() => setOffen(false)}
                className="mt-sm inline-flex items-center gap-xs text-label-md text-tertiary transition-colors hover:underline"
              >
                <span className="material-symbols-outlined text-[16px]">insights</span>
                Klassenreport öffnen
              </Link>
            </>
          ) : (
            <>
              <p className="mt-sm text-body-sm text-on-surface-variant">
                Hast du von deiner Lehrperson einen Klassencode bekommen? Trag ihn
                hier ein — dein Fortschritt bleibt erhalten.
              </p>
              <div className="mt-sm flex flex-wrap items-center gap-sm">
                <input
                  type="text"
                  value={eingabe}
                  onChange={(e) => {
                    setEingabe(e.target.value);
                    setFehler(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") void beitreten();
                  }}
                  placeholder="z.B. PiRo-FS-A26"
                  aria-label="Klassencode"
                  className="min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface px-md py-sm text-body-md text-on-surface uppercase placeholder:normal-case placeholder:text-on-surface-variant/60 focus:border-tertiary focus:outline-none"
                  style={{ fontFamily: "ui-monospace, monospace" }}
                />
                <button
                  type="button"
                  disabled={busy || !studentCode}
                  onClick={() => void beitreten()}
                  className="inline-flex items-center gap-xs rounded-lg bg-tertiary px-md py-sm text-label-md text-on-tertiary shadow-sm transition hover:bg-on-tertiary-container disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">group_add</span>
                  Beitreten
                </button>
              </div>
              {fehler && <p className="mt-xs text-label-sm text-error">{fehler}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
