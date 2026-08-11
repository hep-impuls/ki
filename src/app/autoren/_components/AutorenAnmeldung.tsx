"use client";

import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";

/**
 * Anmeldemaske für `/autoren`. Ein geteilter Passcode für Pietro und Christof;
 * geprüft wird serverseitig in `POST /api/autoren/auth`, das ein signiertes
 * Cookie setzt. Der Passcode verlässt den Server nie, und die Seite selbst
 * rendert das Dashboard erst, wenn das Cookie gültig ist.
 */
export default function AutorenAnmeldung({
  nichtKonfiguriert,
}: {
  nichtKonfiguriert?: string[];
}) {
  const [passcode, setPasscode] = useState("");
  const [fehler, setFehler] = useState<string | null>(null);
  const [laeuft, setLaeuft] = useState(false);

  async function anmelden(e: React.FormEvent) {
    e.preventDefault();
    setFehler(null);
    setLaeuft(true);
    try {
      const antwort = await fetch("/api/autoren/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const daten = (await antwort.json().catch(() => ({}))) as { fehler?: string };
      if (!antwort.ok) {
        setFehler(daten.fehler || "Anmeldung fehlgeschlagen.");
        return;
      }
      // Neu laden: Die Seite ist eine Server-Komponente und prüft das Cookie.
      window.location.reload();
    } catch {
      setFehler("Keine Verbindung zum Server.");
    } finally {
      setLaeuft(false);
    }
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-md pt-xl">
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Für Pietro und Christof
        </p>
        <h1 className="mt-sm text-headline-lg text-on-surface">Autoren-Übersicht</h1>

        {nichtKonfiguriert && nichtKonfiguriert.length > 0 ? (
          <div className="mt-lg rounded-xl border border-outline-variant bg-surface-container-low p-lg">
            <p className="text-body-md text-on-surface">
              Diese Umgebung ist noch nicht eingerichtet. Es fehlt:{" "}
              <code>{nichtKonfiguriert.join(", ")}</code>
            </p>
            <p className="mt-sm text-body-sm text-on-surface-variant">
              Beides in Vercel unter «Environment Variables» setzen (und lokal in{" "}
              <code>.env.local</code>), danach neu deployen. Den Schlüssel erzeugt{" "}
              <code>node -e &quot;console.log(require(&apos;crypto&apos;).randomBytes(32).toString(&apos;hex&apos;))&quot;</code>.
            </p>
          </div>
        ) : (
          <form onSubmit={anmelden} className="mt-lg">
            <label htmlFor="passcode" className="text-label-md text-on-surface-variant">
              Passcode
            </label>
            <input
              id="passcode"
              type="password"
              autoComplete="current-password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="mt-xs w-full rounded-xl border border-outline-variant bg-surface-bright px-md py-sm text-body-md text-on-surface focus:border-tertiary focus:outline-none"
            />
            {fehler && (
              <p className="mt-sm text-body-sm text-error" role="alert">
                {fehler}
              </p>
            )}
            <button
              type="submit"
              disabled={laeuft || passcode.trim() === ""}
              className="mt-md inline-flex items-center gap-sm rounded-xl bg-tertiary px-lg py-sm text-label-md text-on-tertiary shadow-sm transition hover:bg-on-tertiary-container disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">lock_open</span>
              {laeuft ? "Prüfen …" : "Anmelden"}
            </button>
          </form>
        )}

        <p className="mt-xl text-label-sm text-on-surface-variant">
          Hier stehen nur anonyme Summen über alle Nutzenden: keine
          Fortschritts-Codes, keine Zeitpunkte, keine einzelnen Personen.
        </p>
      </div>
    </AppLayout>
  );
}
