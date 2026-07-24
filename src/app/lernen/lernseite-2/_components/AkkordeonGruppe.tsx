"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * AkkordeonGruppe — hält den Zustand «welcher Abschnitt ist offen» für eine
 * Gruppe von `Abschnitt`-Akkordeons. Es ist immer höchstens EINES offen
 * (klickt man ein zweites auf, schliesst das erste).
 *
 * Der zuletzt geöffnete Abschnitt wird PRO SEITE gemerkt (localStorage, Schlüssel
 * aus dem Pfad) und beim Wiederkommen oder Neuladen wieder geöffnet. Schliesst
 * man den offenen Abschnitt, bleibt beim nächsten Besuch alles zu.
 *
 * Ein Deep-Link über den URL-Hash (z.B. #teppich aus dem Inhaltsverzeichnis) hat
 * Vorrang und wird ebenfalls gemerkt. Rein clientseitig, damit die Seiten
 * Server-Komponenten bleiben können; die (teils schweren) Inhalte werden erst
 * beim Öffnen eingehängt.
 */

interface AkkordeonCtx {
  offen: string | null;
  umschalten: (id: string) => void;
}

const Ctx = createContext<AkkordeonCtx | null>(null);

/** Hook für `Abschnitt`. Ausserhalb einer Gruppe → null (Abschnitt bleibt offen). */
export function useAkkordeon(): AkkordeonCtx | null {
  return useContext(Ctx);
}

function speicherKey(): string {
  return "ki26-akkordeon:" + (typeof window !== "undefined" ? window.location.pathname : "");
}

export default function AkkordeonGruppe({ children }: { children: ReactNode }) {
  const [offen, setOffen] = useState<string | null>(null);

  useEffect(() => {
    const key = speicherKey();
    const hash = window.location.hash.replace(/^#/, "");
    let zuOeffnen: string | null = null;
    if (hash) {
      // Deep-Link / Inhaltsverzeichnis gewinnt und wird gemerkt.
      zuOeffnen = hash;
      try {
        localStorage.setItem(key, hash);
      } catch {
        /* Privatmodus */
      }
    } else {
      // Sonst den zuletzt geöffneten Abschnitt dieser Seite wiederherstellen.
      try {
        const gespeichert = localStorage.getItem(key);
        if (gespeichert) zuOeffnen = gespeichert;
      } catch {
        /* Privatmodus */
      }
    }
    if (zuOeffnen) {
      setOffen(zuOeffnen);
      // Beim Wiederkommen an die zuletzt offene Stelle scrollen, damit man
      // wieder bei seiner Aufgabe landet (block:start berücksichtigt scroll-mt).
      const ziel = zuOeffnen;
      setTimeout(() => document.getElementById(ziel)?.scrollIntoView({ block: "start" }), 250);
    }
    const ausHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      setOffen(id);
      try {
        localStorage.setItem(speicherKey(), id);
      } catch {
        /* Privatmodus */
      }
    };
    window.addEventListener("hashchange", ausHash);
    return () => window.removeEventListener("hashchange", ausHash);
  }, []);

  function umschalten(id: string) {
    const next = offen === id ? null : id;
    setOffen(next);
    try {
      localStorage.setItem(speicherKey(), next ?? "");
    } catch {
      /* Privatmodus */
    }
  }

  return <Ctx.Provider value={{ offen, umschalten }}>{children}</Ctx.Provider>;
}
