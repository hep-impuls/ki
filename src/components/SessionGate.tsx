"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSession } from "@/lib/session";

/**
 * Session-Gate (Vorbild: 10mios `AppLayout` ohne Session → `/`).
 *
 * Wrappt eine Lernseite: ohne Schueler-Session wird nach `/start?next=<pfad>`
 * umgeleitet. Bewusst **opt-in** (Komponente um den Seiteninhalt legen) statt
 * im geteilten `AppLayout` erzwungen — so bleibt die Titelseite frei zugaenglich
 * und Christofs/Pietros Seiten entscheiden selbst, ob sie gaten.
 *
 * Verwendung in einer Client-Page:
 *   <SessionGate><KiEinheitV3 /></SessionGate>
 */
export default function SessionGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (getSession()) {
      setReady(true);
    } else {
      router.replace(`/start?next=${encodeURIComponent(pathname)}`);
    }
  }, [router, pathname]);

  if (!ready) return null;
  return <>{children}</>;
}
