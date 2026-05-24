"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { unit } from "@/config/unit";

export default function SideNav() {
  const pathname = usePathname();

  const isActiveModule = (href: string) => pathname?.startsWith(href);

  return (
    <aside className="bg-surface-container-low h-[calc(100vh-4rem)] w-64 border-r border-outline-variant sticky top-16 flex-shrink-0 hidden lg:flex flex-col overflow-y-auto">
      <div className="p-lg border-b border-outline-variant">
        <div className="flex items-center gap-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary">
            <span className="material-symbols-outlined text-[20px]">school</span>
          </div>
          <div className="leading-tight">
            <p className="text-body-sm font-semibold text-on-surface">{unit.shortTitle}</p>
            {unit.subtitle && (
              <p className="text-label-sm text-on-surface-variant">{unit.subtitle}</p>
            )}
          </div>
        </div>
      </div>

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
