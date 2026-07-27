/** Farbige Hinweisbox — Fehler, Warnung, Erfolg, Hinweis. */

const STIL = {
  fehler: "border-error bg-error-container text-on-error-container",
  warnung: "border-tertiary bg-tertiary-container text-on-tertiary-container",
  erfolg: "border-primary bg-primary-container text-on-primary-container",
  hinweis: "border-outline-variant bg-surface-container text-on-surface-variant",
} as const;

const IKONE = {
  fehler: "error",
  warnung: "warning",
  erfolg: "check_circle",
  hinweis: "info",
} as const;

export default function Meldung({
  art,
  children,
  className = "",
  onSchliessen,
}: {
  art: keyof typeof STIL;
  children: React.ReactNode;
  className?: string;
  onSchliessen?: () => void;
}) {
  return (
    <div
      className={`flex items-start gap-sm rounded-lg border px-md py-sm text-body-sm ${STIL[art]} ${className}`}
      role={art === "fehler" ? "alert" : "status"}
    >
      <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
        {IKONE[art]}
      </span>
      <div className="flex-1">{children}</div>
      {onSchliessen && (
        <button
          type="button"
          onClick={onSchliessen}
          aria-label="Meldung schliessen"
          className="material-symbols-outlined text-[20px] opacity-70 hover:opacity-100"
        >
          close
        </button>
      )}
    </div>
  );
}
