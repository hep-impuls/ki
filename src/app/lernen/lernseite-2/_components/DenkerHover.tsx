"use client";

/**
 * DenkerHover — der Name einer Denkerin oder eines Denkers als Hover mit einer
 * Kurzbiografie (Leben, Werk, Bedeutung). Reagiert auf Hover, Fokus und Tap.
 * Gleiches Muster wie das Glossar, nur etwas breiter für die Biografie.
 *
 * Der Tooltip ist links am Namen verankert und öffnet standardmässig nach unten.
 * «oben» eignet sich, wenn darunter kein Platz ist, etwa am unteren Rand eines
 * Kopfbilds. Nur Theme-Tokens.
 */
export default function DenkerHover({
  name,
  bio,
  richtung = "unten",
}: {
  name: string;
  bio: string;
  richtung?: "oben" | "unten";
}) {
  const pos = richtung === "oben" ? "bottom-full mb-1" : "top-full mt-1";
  return (
    <span className="group/dh relative inline-block">
      <button
        type="button"
        aria-label={`${name}: ${bio}`}
        className="cursor-help border-b border-dotted border-tertiary font-medium text-inherit outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-tertiary"
      >
        {name}
      </button>
      <span
        role="tooltip"
        className={
          "pointer-events-none invisible absolute left-0 z-30 w-72 max-w-[70vw] rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs text-left text-label-sm font-normal leading-snug text-on-surface opacity-0 shadow-lg transition-opacity duration-150 group-hover/dh:visible group-hover/dh:opacity-100 group-focus-within/dh:visible group-focus-within/dh:opacity-100 " +
          pos
        }
      >
        {bio}
      </span>
    </span>
  );
}
