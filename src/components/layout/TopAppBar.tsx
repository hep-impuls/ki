"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { unit } from "@/config/unit";

const navLinks = [
  { href: "/", label: "Start" },
  { href: "/lernen/lernseite-1", label: "Module" },
];

export default function TopAppBar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header className="bg-surface-bright border-b border-outline-variant shadow-[0_4px_12px_rgba(0,0,0,0.05)] sticky top-0 z-50">
      <div className="flex justify-between items-center h-16 px-lg md:px-xl w-full max-w-[1440px] mx-auto">
        <div className="flex items-center gap-md">
          <Link href="/" className="flex items-center gap-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm">
              <span className="text-label-md font-bold">{unit.shortTitle}</span>
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-body-sm font-semibold text-on-surface">{unit.title}</p>
              {unit.subtitle && (
                <p className="text-label-sm text-on-surface-variant">{unit.subtitle}</p>
              )}
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-lg ml-lg">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    active
                      ? "text-primary border-b-2 border-primary pb-1 text-body-md font-bold"
                      : "text-on-surface-variant hover:text-on-surface transition-colors text-body-md font-medium"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-sm">
          <button
            type="button"
            aria-label="Hilfe"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
          </button>
        </div>
      </div>
    </header>
  );
}
