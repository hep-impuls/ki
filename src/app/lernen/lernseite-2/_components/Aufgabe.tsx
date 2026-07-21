import type { ReactNode } from "react";

/**
 * Aufgabe — hebt eine Handlungsanweisung klar vom Infotext ab (Vorbild:
 * Pietros «Anleitung» auf Lernseite 1, `assignment`-Icon in eigener Box).
 * Nur diese Markierung ist übernommen. Nur Theme-Tokens.
 */
export default function Aufgabe({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "flex items-start gap-sm rounded-xl border border-tertiary/40 bg-tertiary-container/25 p-md " +
        className
      }
    >
      <span className="material-symbols-outlined mt-[2px] flex-shrink-0 text-[20px] text-tertiary">
        assignment
      </span>
      <div className="min-w-0 text-body-md text-on-surface">
        <p className="text-label-sm uppercase tracking-wider text-tertiary">Aufgabe</p>
        <div className="mt-xs">{children}</div>
      </div>
    </div>
  );
}
