"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { classExists, saveTeacherSetupSecure } from "@/lib/api";

/**
 * Lehrer-Hub (Vorbild: 10mio `teacher.astro`).
 *
 * Chooser: bestehende Klasse → Report oeffnen  |  neue Klasse anlegen.
 * Registrier-Form: Code (eindeutig) + Secret (>= 4 Zeichen), Pre-flight
 * `classExists`, optionaler Backup-`.txt`-Download (einzige Moeglichkeit, das
 * Secret zu sichern — server speichert nur den Hash).
 */

type Mode = "choose" | "register";

export default function LehrpersonPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("choose");

  // Register-Form
  const [code, setCode] = useState("");
  const [secret, setSecret] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Report-open-Form
  const [openCode, setOpenCode] = useState("");
  const [openSecret, setOpenSecret] = useState("");

  /** Beitritts-Link mit vorbefülltem Klassencode (`?class=…` auf /start). */
  const beitrittsLink = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/start?class=${code.trim().toUpperCase()}`;
  }, [code]);

  const downloadBackup = useCallback((c: string, s: string) => {
    const url = typeof window !== "undefined" ? window.location.origin : "";
    const text =
      `Klassencode: ${c}\nSecret: ${s}\n` +
      `Link für die Schüler:innen: ${url}/start?class=${c}\n` +
      `Report-URL: ${url}/lehrperson/report\n\n` +
      `Bewahre diese Datei sicher auf. Das Secret kann nicht wiederhergestellt werden.`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `klassencode-${c}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, []);

  const register = useCallback(
    async (withBackup: boolean) => {
      const c = code.trim().toUpperCase();
      const s = secret.trim();
      if (!c) {
        setError("Bitte gib einen Klassencode ein.");
        return;
      }
      if (s.length < 4) {
        setError("Das Secret muss mindestens 4 Zeichen haben.");
        return;
      }
      setBusy(true);
      setError(null);
      try {
        const exists = await classExists(c);
        if (exists) {
          setError("Dieser Code ist bereits vergeben. Wähle einen anderen.");
          setBusy(false);
          return;
        }
        await saveTeacherSetupSecure(c, s, []);
        if (withBackup) downloadBackup(c, s);
        setDone(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Registrierung fehlgeschlagen.");
      } finally {
        setBusy(false);
      }
    },
    [code, secret, downloadBackup],
  );

  const openReport = useCallback(() => {
    const c = openCode.trim().toUpperCase();
    const s = openSecret.trim();
    if (!c || !s) return;
    const params = new URLSearchParams({ code: c, secret: s });
    router.push(`/lehrperson/report?${params.toString()}`);
  }, [openCode, openSecret, router]);

  return (
    <main className="mx-auto max-w-2xl px-lg py-xl">
      <header className="border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">Lehrpersonen</p>
        <h1 className="mt-sm text-headline-xl text-on-surface">Klasse verwalten</h1>
        <p className="mt-sm text-body-md text-on-surface-variant">
          Lege eine Klasse an oder öffne den Report einer bestehenden Klasse. Der
          Klassencode plus Secret schützt deine Klassendaten.
        </p>
      </header>

      {/* Die beiden Anleitungen stehen bewusst zuoberst und immer sichtbar:
          Wer zum ersten Mal hier landet, soll nicht raten müssen, wie das
          Ganze gedacht ist. */}
      <div className="mt-lg grid gap-sm sm:grid-cols-2">
        <Link
          href="/lehrperson/anleitung"
          className="group flex items-start gap-md rounded-xl border border-outline-variant bg-surface-container-low p-md transition hover:border-primary hover:bg-surface-bright"
        >
          <span className="material-symbols-outlined mt-0.5 text-[22px] text-primary">
            menu_book
          </span>
          <span>
            <span className="block text-label-md text-on-surface">
              Anleitung: Klasse einrichten
            </span>
            <span className="mt-xs block text-body-sm text-on-surface-variant">
              Registrieren, Code teilen, Report öffnen — in 3 Schritten.
            </span>
          </span>
        </Link>
        <Link
          href="/lehrperson/leitfaden"
          className="group flex items-start gap-md rounded-xl border border-outline-variant bg-surface-container-low p-md transition hover:border-tertiary hover:bg-surface-bright"
        >
          <span className="material-symbols-outlined mt-0.5 text-[22px] text-tertiary">
            lightbulb
          </span>
          <span>
            <span className="block text-label-md text-on-surface">
              Inhaltlicher Leitfaden
            </span>
            <span className="mt-xs block text-body-sm text-on-surface-variant">
              Der Bogen der Lernsets, Plenum-Anker, Unterrichts-Szenarien.
            </span>
          </span>
        </Link>
      </div>

      {mode === "choose" && !done && (
        <div className="mt-xl grid gap-md sm:grid-cols-2">
          <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
            <h2 className="text-headline-sm text-on-surface">Bestehende Klasse</h2>
            <p className="mt-xs text-body-sm text-on-surface-variant">
              Report öffnen — Fortschritt deiner Schüler:innen.
            </p>
            <div className="mt-md flex flex-col gap-sm">
              <input
                value={openCode}
                onChange={(e) => setOpenCode(e.target.value)}
                placeholder="Klassencode"
                className="w-full rounded-xl border border-outline-variant bg-surface px-md py-sm text-body-md text-on-surface outline-none focus:border-primary"
              />
              <input
                value={openSecret}
                onChange={(e) => setOpenSecret(e.target.value)}
                type="password"
                placeholder="Secret"
                className="w-full rounded-xl border border-outline-variant bg-surface px-md py-sm text-body-md text-on-surface outline-none focus:border-primary"
              />
              <button
                onClick={openReport}
                className="inline-flex items-center justify-center gap-sm rounded-xl bg-secondary px-lg py-sm text-label-md text-on-secondary shadow-sm transition hover:opacity-90"
              >
                Report öffnen
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
            <h2 className="text-headline-sm text-on-surface">Neue Klasse</h2>
            <p className="mt-xs text-body-sm text-on-surface-variant">
              Code beanspruchen und Secret festlegen.
            </p>
            <button
              onClick={() => {
                setError(null);
                setMode("register");
              }}
              className="mt-md inline-flex items-center justify-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:bg-on-primary-container"
            >
              Klasse anlegen
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>
        </div>
      )}

      {mode === "register" && !done && (
        <div className="mt-xl rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
          <h2 className="text-headline-sm text-on-surface">Klasse registrieren</h2>
          <p className="mt-xs text-body-sm text-on-surface-variant">
            Wähle einen distinktiven Code (z.B. <code>PiRo-FS-A26</code>) und beanspruche
            ihn sofort — bis zur Registrierung könnte ihn jemand anderes belegen.
          </p>
          <div className="mt-md flex flex-col gap-sm">
            <label className="text-label-md text-on-surface-variant">
              Klassencode
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="PiRo-FS-A26"
                className="mt-xs w-full rounded-xl border border-outline-variant bg-surface px-md py-sm text-body-md text-on-surface outline-none focus:border-primary"
              />
            </label>
            <label className="text-label-md text-on-surface-variant">
              Secret (mind. 4 Zeichen)
              <input
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                type="password"
                className="mt-xs w-full rounded-xl border border-outline-variant bg-surface px-md py-sm text-body-md text-on-surface outline-none focus:border-primary"
              />
            </label>
          </div>
          {error && <p className="mt-sm text-body-sm text-error">{error}</p>}
          <div className="mt-lg flex flex-col gap-sm sm:flex-row">
            <button
              disabled={busy}
              onClick={() => register(false)}
              className="inline-flex flex-1 items-center justify-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:bg-on-primary-container disabled:opacity-50"
            >
              Klasse registrieren
            </button>
            <button
              disabled={busy}
              onClick={() => register(true)}
              className="inline-flex flex-1 items-center justify-center gap-sm rounded-xl border border-outline-variant px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-dim disabled:opacity-50"
            >
              Registrieren &amp; Daten sichern
            </button>
          </div>
          <button
            onClick={() => {
              setError(null);
              setMode("choose");
            }}
            className="mt-md text-label-md text-on-surface-variant hover:text-on-surface"
          >
            ← Zurück
          </button>
        </div>
      )}

      {done && (
        <div className="mt-xl rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
            <span className="material-symbols-outlined text-[22px]">check</span>
          </div>
          <h2 className="mt-sm text-headline-sm text-on-surface">Klasse angelegt</h2>
          <p className="mt-xs text-body-md text-on-surface-variant">
            Code <strong className="text-primary">{code.trim().toUpperCase()}</strong> ist
            jetzt aktiv. Gib ihn deinen Schüler:innen. Wähle nun die Pflichtmodule oder
            öffne den Report.
          </p>

          {/* Fertiger Beitritts-Link. Die Startseite kennt `?class=CODE` und
              füllt den Klassencode damit vor; ohne diesen Link musste er von
              Hand abgetippt werden, und wer den Schritt übersprang, kam nicht
              mehr in die Klasse. */}
          <div className="mt-md rounded-xl border border-outline-variant bg-surface-container-low p-md">
            <p className="text-label-md uppercase tracking-wider text-tertiary">
              Link für die Schüler:innen
            </p>
            <p className="mt-xs text-body-sm text-on-surface-variant">
              Wer diesen Link öffnet, bekommt den Klassencode schon eingetragen.
            </p>
            <p
              className="mt-sm break-all rounded-lg bg-surface-bright px-sm py-xs text-body-sm text-on-surface"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              {beitrittsLink}
            </p>
            <button
              type="button"
              onClick={() => void navigator.clipboard?.writeText(beitrittsLink)}
              className="mt-sm inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright px-md py-xs text-label-md text-on-surface-variant transition-colors hover:border-tertiary hover:text-tertiary"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              Link kopieren
            </button>
          </div>
          <div className="mt-lg flex flex-col gap-sm sm:flex-row">
            <button
              onClick={() => {
                const params = new URLSearchParams({
                  code: code.trim().toUpperCase(),
                  secret: secret.trim(),
                });
                router.push(`/lehrperson/setup?${params.toString()}`);
              }}
              className="inline-flex flex-1 items-center justify-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:bg-on-primary-container"
            >
              Pflichtmodule wählen
            </button>
            <button
              onClick={() => {
                const params = new URLSearchParams({
                  code: code.trim().toUpperCase(),
                  secret: secret.trim(),
                });
                router.push(`/lehrperson/report?${params.toString()}`);
              }}
              className="inline-flex flex-1 items-center justify-center gap-sm rounded-xl border border-outline-variant px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-dim"
            >
              Report öffnen
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
