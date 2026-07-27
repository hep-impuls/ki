"use client";

/**
 * Drucken-Knopf für die beiden Lehrpersonen-Anleitungen. Eigene Client-
 * Komponente, damit die Anleitungs-Seiten selbst statische Server-Komponenten
 * bleiben — sie enthalten nur Text.
 */
export default function DruckButton({
  label = "Drucken",
  variante = "dezent",
}: {
  label?: string;
  variante?: "dezent" | "umrandet";
}) {
  const klasse =
    variante === "umrandet"
      ? "inline-flex items-center justify-center gap-sm rounded-xl border border-outline-variant px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-dim"
      : "inline-flex items-center gap-xs text-label-md text-on-surface-variant transition-colors hover:text-primary";

  return (
    <button type="button" onClick={() => window.print()} className={klasse}>
      <span className="material-symbols-outlined text-[18px]">print</span>
      {label}
    </button>
  );
}
