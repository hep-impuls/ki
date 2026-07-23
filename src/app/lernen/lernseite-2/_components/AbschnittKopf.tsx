import type { ReactNode } from "react";

/**
 * AbschnittKopf — hinterlegt einen Titel (Kopf / Abschnitts-Überschrift) mit
 * einem Aquarell. Das Bild scheint kräftig durch (rechts fast voll), links
 * schützt ein Verlauf (Hintergrundfarbe → transparent) den Text, sodass er
 * lesbar bleibt und zugleich die Farbe des Titelhintergrunds zur Geltung kommt.
 * Nur Theme-Tokens.
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
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70"
      />
      {/* Lesbarkeits-Verlauf: links deckt die Hintergrundfarbe den Text, rechts
          läuft er auf durchsichtig aus, damit die Bildfarbe voll durchkommt. */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent"
        aria-hidden
      />
      <div className={"relative " + (gross ? "p-lg sm:p-xl" : "p-lg")}>{children}</div>
    </div>
  );
}
