"use client";

/**
 * Erfuellungsbalken (2026-07-28) — zeigt den **Erfüllungsgrad** eines Themas:
 * wie viel von den bearbeitbaren Elementen (Meinungsfragen, Verständnisfragen,
 * Werte-Karten, Faktencheck, Reflexion) tatsächlich bearbeitet wurde.
 *
 * Rein präsentational; die Zahlen kommen aus `_lib/erfuellung.ts`. Bewusst
 * neutral formuliert («bearbeitet»), nicht wertend — es ist kein Notenbalken.
 */
export default function Erfuellungsbalken({
  prozent,
  erledigt,
  gesamt,
  label = "bearbeitet",
  kompakt = false,
}: {
  prozent: number;
  erledigt: number;
  gesamt: number;
  /** Beschriftung hinter der Prozentzahl. */
  label?: string;
  /** Kompakt: ohne die «x von y Elementen»-Zeile. */
  kompakt?: boolean;
}) {
  return (
    <div className="flex w-full flex-col gap-xs">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={prozent}
        aria-label={`${prozent} Prozent ${label}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container"
      >
        <div
          className="h-full rounded-full bg-tertiary transition-all"
          style={{ width: `${Math.max(0, Math.min(100, prozent))}%` }}
        />
      </div>
      <p className="text-label-sm text-on-surface-variant">
        <span className="font-semibold text-on-surface">{prozent} %</span> {label}
        {!kompakt && (
          <>
            {" "}
            · {erledigt} von {gesamt} Elementen
          </>
        )}
      </p>
    </div>
  );
}
