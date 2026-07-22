"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { generateCode, getSession, saveSession } from "@/lib/session";
import { ensureStudent, loadStudent, linkTeacherCode } from "@/lib/db";
import { classExists } from "@/lib/api";

/**
 * Schueler-Onboarding (Vorbild: 10mio `index.astro`).
 *
 * State-Machine:
 *   intro    → "Neu starten" vs. "Ich habe schon einen Code"
 *   code     → generierter Animal-Code anzeigen + kopieren
 *   klasse   → "Klassencode erhalten?" Nein → fertig; Ja → Code pruefen
 *   returning→ bestehenden Code eingeben → Session wiederherstellen
 *
 * Persoenliche Lerndaten bleiben lokal; der Code ist der Schluessel fuer den
 * Firestore-Fortschritts-Spiegel. Nach Abschluss → Redirect auf ?next (oder /).
 */

type Step = "intro" | "code" | "klasse" | "returning";

function StartFlow() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/lernen/lernseite-1";
  // Vorbefuellter Klassencode aus einem Lehrpersonen-Link (?class=CODE).
  const classParam = (search.get("class") ?? "").trim().toUpperCase();

  const [step, setStep] = useState<Step>("intro");
  const [code, setCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [classInput, setClassInput] = useState(classParam);
  const [returnInput, setReturnInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Schon eingeloggt? → direkt weiter. Kommt die Person über einen
  // vorbefüllten Klassen-Link und hat noch keine Klasse, wird diese
  // rückwirkend verknüpft (der Hintergrund-Code sammelt Spuren schon).
  useEffect(() => {
    const s = getSession();
    if (!s) return;
    if (classParam && !s.teacherCode) {
      void (async () => {
        try {
          if (await classExists(classParam)) {
            await linkTeacherCode(s.studentCode, classParam);
            saveSession({ studentCode: s.studentCode, teacherCode: classParam });
          }
        } catch {
          /* Verknüpfen fehlgeschlagen → trotzdem weiter, Code bleibt gültig */
        }
        router.replace(next);
      })();
      return;
    }
    router.replace(next);
  }, [router, next, classParam]);

  const startNew = useCallback(() => {
    setError(null);
    setCode(generateCode());
    setStep("code");
  }, []);

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* Clipboard blockiert — Code steht ohnehin sichtbar da */
    }
  }, [code]);

  const finishWithoutClass = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await ensureStudent(code, null);
      saveSession({ studentCode: code, teacherCode: null });
      router.replace(next);
    } catch {
      setError("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
      setBusy(false);
    }
  }, [code, next, router]);

  const finishWithClass = useCallback(async () => {
    const tc = classInput.trim().toUpperCase();
    if (!tc) {
      setError("Bitte gib den Klassencode ein.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const ok = await classExists(tc);
      if (!ok) {
        setError("Code nicht gefunden — frag deine Lehrperson.");
        setBusy(false);
        return;
      }
      await ensureStudent(code, tc);
      saveSession({ studentCode: code, teacherCode: tc });
      router.replace(next);
    } catch {
      setError("Konnte den Code nicht pruefen. Bitte versuche es erneut.");
      setBusy(false);
    }
  }, [classInput, code, next, router]);

  const resumeReturning = useCallback(async () => {
    const sc = returnInput.trim().toUpperCase();
    if (!sc) {
      setError("Bitte gib deinen Code ein.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const student = await loadStudent(sc);
      // Kein Doc? Trotzdem zulassen (anonym ohne Cloud-Schreiben) — Code ist der Schluessel.
      saveSession({ studentCode: sc, teacherCode: student?.teacherCode ?? null });
      router.replace(next);
    } catch {
      setError("Konnte den Code nicht laden. Bitte versuche es erneut.");
      setBusy(false);
    }
  }, [returnInput, next, router]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/4 h-[480px] w-[480px] rounded-full bg-primary-container blur-[120px] opacity-60" />
        <div className="absolute top-32 right-0 h-[400px] w-[400px] rounded-full bg-tertiary-container blur-[120px] opacity-50" />
      </div>

      <header className="mx-auto flex max-w-[1280px] items-center justify-between px-lg py-lg">
        <img src="/hep-logo.jpg" alt="hep Verlag" className="h-8 w-auto" />
      </header>

      <section className="mx-auto flex max-w-xl flex-col px-lg pb-xxl pt-lg">
        <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm sm:p-xl">
          {step === "intro" && (
            <>
              <h1 className="text-headline-lg text-on-surface">Willkommen</h1>
              <p className="mt-sm text-body-md text-on-surface-variant">
                Du bekommst einen persönlichen Code, mit dem du deinen Fortschritt
                speicherst und später weitermachen kannst. Kein Login, keine
                E-Mail — der Code ist dein Schlüssel.
              </p>
              <div className="mt-lg flex flex-col gap-sm">
                <button
                  onClick={startNew}
                  className="inline-flex items-center justify-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:bg-on-primary-container"
                >
                  Neu starten
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <button
                  onClick={() => {
                    setError(null);
                    setStep("returning");
                  }}
                  className="inline-flex items-center justify-center gap-sm rounded-xl border border-outline-variant px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-dim"
                >
                  Ich habe schon einen Code
                </button>
              </div>
            </>
          )}

          {step === "code" && (
            <>
              <h1 className="text-headline-lg text-on-surface">Das ist dein Code</h1>
              <p className="mt-sm text-body-md text-on-surface-variant">
                Notiere ihn dir — du brauchst ihn, um später weiterzumachen.
              </p>
              <div className="mt-lg flex items-center justify-between rounded-xl border border-outline-variant bg-surface-dim px-lg py-md">
                <span className="text-headline-md tracking-wider text-primary">{code}</span>
                <button
                  onClick={copyCode}
                  className="inline-flex items-center gap-xs text-label-md text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {copied ? "check" : "content_copy"}
                  </span>
                  {copied ? "Kopiert" : "Kopieren"}
                </button>
              </div>
              <button
                onClick={() => {
                  setError(null);
                  setStep("klasse");
                }}
                className="mt-lg inline-flex w-full items-center justify-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:bg-on-primary-container"
              >
                Weiter
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </>
          )}

          {step === "klasse" && (
            <>
              <h1 className="text-headline-lg text-on-surface">Klassencode?</h1>
              <p className="mt-sm text-body-md text-on-surface-variant">
                Hat dir deine Lehrperson einen Klassencode gegeben? Dann gib ihn
                hier ein. Sonst kannst du diesen Schritt überspringen.
              </p>
              <input
                value={classInput}
                onChange={(e) => setClassInput(e.target.value)}
                placeholder="z.B. PiRo-FS-A26"
                className="mt-lg w-full rounded-xl border border-outline-variant bg-surface px-lg py-sm text-body-md text-on-surface outline-none focus:border-primary"
              />
              {error && <p className="mt-sm text-body-sm text-error">{error}</p>}
              <div className="mt-lg flex flex-col gap-sm sm:flex-row">
                <button
                  disabled={busy}
                  onClick={finishWithClass}
                  className="inline-flex flex-1 items-center justify-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:bg-on-primary-container disabled:opacity-50"
                >
                  Klasse beitreten
                </button>
                <button
                  disabled={busy}
                  onClick={finishWithoutClass}
                  className="inline-flex flex-1 items-center justify-center gap-sm rounded-xl border border-outline-variant px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-dim disabled:opacity-50"
                >
                  Ohne Klasse weiter
                </button>
              </div>
            </>
          )}

          {step === "returning" && (
            <>
              <h1 className="text-headline-lg text-on-surface">Code eingeben</h1>
              <p className="mt-sm text-body-md text-on-surface-variant">
                Gib deinen Code ein, um dort weiterzumachen, wo du aufgehört hast.
              </p>
              <input
                value={returnInput}
                onChange={(e) => setReturnInput(e.target.value)}
                placeholder="z.B. QWEN-34r"
                className="mt-lg w-full rounded-xl border border-outline-variant bg-surface px-lg py-sm text-body-md text-on-surface outline-none focus:border-primary"
              />
              {error && <p className="mt-sm text-body-sm text-error">{error}</p>}
              <div className="mt-lg flex flex-col gap-sm sm:flex-row">
                <button
                  disabled={busy}
                  onClick={resumeReturning}
                  className="inline-flex flex-1 items-center justify-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:bg-on-primary-container disabled:opacity-50"
                >
                  Weitermachen
                </button>
                <button
                  disabled={busy}
                  onClick={() => {
                    setError(null);
                    setStep("intro");
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-sm rounded-xl border border-outline-variant px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-dim disabled:opacity-50"
                >
                  Zurück
                </button>
              </div>
            </>
          )}
        </div>

        <p className="mt-md text-center text-label-sm text-on-surface-variant">
          Dein Fortschritt wird unter deinem Code anonym gespeichert.
        </p>
      </section>
    </main>
  );
}

export default function StartPage() {
  return (
    <Suspense fallback={null}>
      <StartFlow />
    </Suspense>
  );
}
