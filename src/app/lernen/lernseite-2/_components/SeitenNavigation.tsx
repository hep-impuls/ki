import Link from "next/link";

interface Ziel {
  href: string;
  label: string;
}

/**
 * Fussnavigation am Seitenende: Sprung zur vorigen bzw. nächsten Seite des
 * Moduls (Vorhang → Philosophie → Orakel). Beide Ziele optional — fehlt eines,
 * bleibt die andere Seite bündig aussen stehen.
 */
export default function SeitenNavigation({
  zurueck,
  weiter,
  className = "",
}: {
  zurueck?: Ziel;
  weiter?: Ziel;
  className?: string;
}) {
  return (
    <nav
      aria-label="Seitennavigation"
      className={`mt-2xl flex items-stretch justify-between gap-md border-t border-outline-variant pt-lg ${className}`}
    >
      {zurueck ? (
        <Link
          href={zurueck.href}
          className="group inline-flex flex-1 items-center gap-sm rounded-xl border border-outline-variant bg-surface-bright px-lg py-md transition-colors hover:border-tertiary sm:flex-initial"
        >
          <span className="material-symbols-outlined text-[20px] text-tertiary transition-transform group-hover:-translate-x-1">
            arrow_back
          </span>
          <span className="flex flex-col text-left">
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
              Zurück
            </span>
            <span className="text-label-lg text-on-surface">{zurueck.label}</span>
          </span>
        </Link>
      ) : (
        <span aria-hidden className="flex-1 sm:flex-initial" />
      )}

      {weiter ? (
        <Link
          href={weiter.href}
          className="group inline-flex flex-1 items-center justify-end gap-sm rounded-xl border border-outline-variant bg-surface-bright px-lg py-md transition-colors hover:border-tertiary sm:flex-initial"
        >
          <span className="flex flex-col text-right">
            <span className="text-label-sm uppercase tracking-wider text-on-surface-variant">
              Weiter
            </span>
            <span className="text-label-lg text-on-surface">{weiter.label}</span>
          </span>
          <span className="material-symbols-outlined text-[20px] text-tertiary transition-transform group-hover:translate-x-1">
            arrow_forward
          </span>
        </Link>
      ) : (
        <span aria-hidden className="flex-1 sm:flex-initial" />
      )}
    </nav>
  );
}
