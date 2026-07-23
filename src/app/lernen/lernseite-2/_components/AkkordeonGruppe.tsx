"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * AkkordeonGruppe — hält den Zustand «welcher Abschnitt ist offen» für eine
 * Gruppe von `Abschnitt`-Akkordeons. Es ist immer höchstens EINES offen
 * (klickt man ein zweites auf, schliesst das erste). Zu Beginn sind alle zu.
 *
 * Zusätzlich hört die Gruppe auf den URL-Hash: Klickt man im Inhaltsverzeichnis
 * einen Abschnitt an (z.B. #teppich), öffnet sich das passende Akkordeon
 * automatisch. Rein clientseitig, damit die Seiten Server-Komponenten bleiben
 * können; die (teils schweren) Inhalte werden erst beim Öffnen eingehängt.
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

export default function AkkordeonGruppe({ children }: { children: ReactNode }) {
  const [offen, setOffen] = useState<string | null>(null);

  useEffect(() => {
    const ausHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (id) setOffen(id);
    };
    ausHash();
    window.addEventListener("hashchange", ausHash);
    return () => window.removeEventListener("hashchange", ausHash);
  }, []);

  function umschalten(id: string) {
    setOffen((cur) => (cur === id ? null : id));
  }

  return <Ctx.Provider value={{ offen, umschalten }}>{children}</Ctx.Provider>;
}
