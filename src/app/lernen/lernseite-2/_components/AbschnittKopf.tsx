import type { ReactNode } from "react";

/**
 * AbschnittKopf — hinterlegt einen Titel (Kopf / Abschnitts-Überschrift) mit
 * einem leicht transparenten Aquarell, analog zu den Orakel-Blöcken. Der Text
 * links bleibt über einen Verlauf (Hintergrundfarbe → transparent) lesbar,
 * während das Bild rechts durchscheint. Nur Theme-Tokens.
 */
export default function AbschnittKopf({
  bild,
  className = "",
  children,
  gross = false,
}: {
  /** Pfad zum Hintergrundbild (public/…). */
  bild: string;
  className?: string;
  children: ReactNode;
  /** true → mehr vertikale Höhe/Padding (für den Seitenkopf). */
  gross?: boolean;
}) {
  return (
    <div
      className={
        "relative overflow-hidden rounded-2xl border border-outline-variant " + className
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bild}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
      />
      {/* Lesbarkeits-Verlauf: links deckt die Hintergrundfarbe, rechts scheint
          das Bild durch. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30"
        aria-hidden
      />
      <div className={"relative " + (gross ? "p-lg sm:p-xl" : "p-lg")}>{children}</div>
    </div>
  );
}
