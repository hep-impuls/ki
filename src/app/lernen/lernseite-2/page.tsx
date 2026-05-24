import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import { unit } from "@/config/unit";

export default function Lernseite2Hub() {
  const mod = unit.modules.find((m) => m.slug === "lernseite-2");
  if (!mod) return null;
  const submodules = mod.submodules ?? [];

  return (
    <AppLayout>
      <ActivityTracker type="page_view" page="lernseite-2" />

      <header className="border-b border-outline-variant pb-lg">
        <div
          aria-hidden
          className="mb-md inline-flex h-14 w-14 items-center justify-center rounded-xl bg-tertiary text-on-tertiary shadow-sm"
        >
          <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
        </div>
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Modul 2
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">{mod.title}</h1>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          {mod.description}
        </p>
      </header>

      <section className="mt-xl">
        <div className="mb-lg">
          <h2 className="text-headline-md text-on-surface">Submodule</h2>
          <p className="mt-xs text-body-sm text-on-surface-variant">
            {submodules.length} Submodul{submodules.length === 1 ? "" : "e"} verfügbar.
          </p>
        </div>

        <div className="grid gap-md sm:grid-cols-2">
          {submodules.map((s) => (
            <Link
              key={s.slug}
              href={s.href}
              className="group relative overflow-hidden rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-tertiary" />
              {s.icon && (
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary-container text-on-tertiary-container">
                  <span className="material-symbols-outlined text-[22px]">{s.icon}</span>
                </div>
              )}
              {s.subtitle && (
                <p className="mt-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  {s.subtitle}
                </p>
              )}
              <h3 className="mt-xs text-headline-sm text-on-surface">{s.title}</h3>
              {s.description && (
                <p className="mt-sm text-body-sm text-on-surface-variant">
                  {s.description}
                </p>
              )}
              <div className="mt-lg inline-flex items-center gap-sm text-label-md text-tertiary">
                Öffnen
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
