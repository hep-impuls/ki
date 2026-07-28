"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { unit } from "@/config/unit";
import { getSession } from "@/lib/session";
import { ACCOUNT_OPEN_EVENT, SESSION_CHANGED_EVENT } from "./AccountMenu";

export default function SideNav() {
  const pathname = usePathname();

  // Klassenreport-Link nur zeigen, wenn der Schueler einer Klasse beigetreten ist.
  // Client-seitig nachgeladen (Session lebt in localStorage) → kein SSR-Mismatch.
  const [hasClass, setHasClass] = useState(false);
  useEffect(() => {
    const lesen = () => setHasClass(Boolean(getSession()?.teacherCode));
    lesen();
    // Beitritt passiert im Account-Menü, ohne Navigation → hier nachziehen.
    window.addEventListener(SESSION_CHANGED_EVENT, lesen);
    window.addEventListener("storage", lesen);
    return () => {
      window.removeEventListener(SESSION_CHANGED_EVENT, lesen);
      window.removeEventListener("storage", lesen);
    };
  }, [pathname]);

  const isActiveModule = (href: string) => pathname?.startsWith(href);

  return (
    <aside className="bg-surface-container-low h-[calc(100vh-4rem)] w-64 border-r border-outline-variant sticky top-16 flex-shrink-0 hidden lg:flex flex-col overflow-y-auto">
      <nav className="p-md">
        <p className="text-label-sm uppercase tracking-wider text-on-surface-variant px-sm pb-sm">
          Navigation
        </p>
        <Link
          href="/"
          className={
            pathname === "/"
              ? "flex items-center gap-sm px-sm py-sm rounded-lg bg-surface-bright text-primary font-semibold shadow-sm border-r-4 border-primary"
              : "flex items-center gap-sm px-sm py-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          }
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
          <span className="text-body-md">Start</span>
        </Link>
      </nav>

      <nav className="p-md pt-0">
        <p className="text-label-sm uppercase tracking-wider text-on-surface-variant px-sm pb-sm">
          Lernmodule
        </p>
        <ol className="sn-modlist flex flex-col gap-xs">
          {unit.modules.map((m) => {
            const active = isActiveModule(m.href);
            return (
              <li key={m.slug}>
                <Link
                  href={m.href}
                  className={
                    active
                      ? "flex items-center gap-sm px-sm py-sm rounded-lg bg-primary/10 text-primary font-semibold"
                      : "flex items-center gap-sm px-sm py-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                  }
                >
                  {m.icon && (
                    <span className="material-symbols-outlined text-[20px]">{m.icon}</span>
                  )}
                  <span className="text-body-md">{m.title}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="flex-grow" />

      {/* Der Eintrag steht IMMER da. Ohne Klasse öffnet er das Account-Menü in
          der TopAppBar (Beitritt ohne Navigation) — der frühere Link auf
          `/start` war eine Sackgasse: mit bestehender Session leitet `/start`
          sofort wieder auf die Lernseite zurück. */}
      <nav className="p-md pt-0">
        {hasClass ? (
          <Link
            href="/klassenreport"
            className={
              pathname === "/klassenreport"
                ? "flex items-center gap-sm px-sm py-sm rounded-lg bg-primary/10 text-primary font-semibold"
                : "flex items-center gap-sm px-sm py-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            }
          >
            <span className="material-symbols-outlined text-[20px]">groups</span>
            <span className="text-body-md">Klassenreport</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(ACCOUNT_OPEN_EVENT))}
            className="flex w-full items-center gap-sm px-sm py-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">groups</span>
            <span className="text-body-md">Klasse beitreten</span>
          </button>
        )}
      </nav>

      <div className="p-md border-t border-outline-variant">
        <p className="text-label-sm text-on-surface-variant">
          Pietro Rossi &amp; Christof Glaus
        </p>
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-label-sm text-on-surface-variant hover:text-primary underline"
        >
          CC BY 4.0
        </a>
      </div>
    </aside>
  );
}
