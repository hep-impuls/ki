"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { unit } from "@/config/unit";
import { loadTeacherPrefsSecure, saveTeacherSetupSecure } from "@/lib/api";

/**
 * Pflichtmodul-Auswahl (Vorbild: 10mio `teacher-setup.astro`).
 *
 * Code + Secret kommen als Query-Params (vom Hub weitergereicht). Laedt die
 * aktuellen `requiredModules`, speichert die Auswahl secret-gated. Leere Auswahl
 * = "alle Module sichtbar" (Konvention wie 10mio: keine Einschraenkung).
 */

interface FlatModule {
  slug: string;
  title: string;
  parent?: string;
}

function flatModules(): FlatModule[] {
  const out: FlatModule[] = [];
  for (const m of unit.modules) {
    out.push({ slug: m.slug, title: m.title });
    for (const sub of m.submodules ?? []) {
      out.push({ slug: `${m.slug}/${sub.slug}`, title: sub.title, parent: m.title });
    }
  }
  return out;
}

function SetupFlow() {
  const search = useSearchParams();
  const code = (search.get("code") ?? "").toUpperCase();
  const secret = search.get("secret") ?? "";

  const modules = useMemo(flatModules, []);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!code || !secret) {
      setError("Klassencode oder Secret fehlt. Bitte über den Lehrer-Hub öffnen.");
      setLoading(false);
      return;
    }
    loadTeacherPrefsSecure(code, secret)
      .then((req) => setSelected(new Set(req)))
      .catch((err) => setError(err instanceof Error ? err.message : "Laden fehlgeschlagen."))
      .finally(() => setLoading(false));
  }, [code, secret]);

  const toggle = useCallback((slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const save = useCallback(async () => {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      await saveTeacherSetupSecure(code, secret, Array.from(selected));
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }, [code, secret, selected]);

  return (
    <main className="mx-auto max-w-2xl px-lg py-xl">
      <header className="border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Lehrpersonen · {code || "—"}
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">Pflichtmodule</h1>
        <p className="mt-sm text-body-md text-on-surface-variant">
          Wähle, welche Module deine Klasse bearbeiten soll. Nichts ausgewählt =
          alle Module sichtbar.
        </p>
      </header>

      {loading ? (
        <p className="mt-xl text-body-md text-on-surface-variant">Lädt …</p>
      ) : (
        <>
          <ul className="mt-xl space-y-sm">
            {modules.map((m) => (
              <li key={m.slug}>
                <label className="flex cursor-pointer items-center gap-md rounded-xl border border-outline-variant bg-surface-bright px-lg py-md shadow-sm transition hover:bg-surface-dim">
                  <input
                    type="checkbox"
                    checked={selected.has(m.slug)}
                    onChange={() => toggle(m.slug)}
                    className="h-5 w-5 accent-primary"
                  />
                  <span>
                    <span className="block text-body-md text-on-surface">{m.title}</span>
                    {m.parent && (
                      <span className="block text-label-sm text-on-surface-variant">
                        {m.parent}
                      </span>
                    )}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          {error && <p className="mt-md text-body-sm text-error">{error}</p>}
          {saved && <p className="mt-md text-body-sm text-primary">Gespeichert ✓</p>}

          <button
            disabled={busy || !code || !secret}
            onClick={save}
            className="mt-lg inline-flex items-center justify-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:bg-on-primary-container disabled:opacity-50"
          >
            Auswahl speichern
          </button>
        </>
      )}
    </main>
  );
}

export default function SetupPage() {
  return (
    <Suspense fallback={null}>
      <SetupFlow />
    </Suspense>
  );
}
