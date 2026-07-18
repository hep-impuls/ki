"use client";

import { useState } from "react";

/**
 * InfoPunkt — ein kleines ⓘ, das beim Klick einen erklärenden Hinweis
 * auf-/zuklappt. Für Nebenbemerkungen, die den Haupttext nicht überladen
 * sollen. Nur Theme-Tokens.
 */
export default function InfoPunkt({
  children,
  label = "Hinweis",
  className = "",
}: {
  children: React.ReactNode;
  /** Kurzer Text neben dem Symbol (klickbar). */
  label?: string;
  className?: string;
}) {
  const [offen, setOffen] = useState(false);
  return (
    <span className={"inline-block " + className}>
      <button
        type="button"
        onClick={() => setOffen((o) => !o)}
        aria-expanded={offen}
        className="inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:border-tertiary hover:text-tertiary"
      >
        <span className="material-symbols-outlined text-[16px] text-tertiary">info</span>
        {label}
      </button>
      {offen && (
        <span className="animate-frame-in mt-sm block max-w-3xl rounded-xl border border-outline-variant bg-surface-container-low p-md text-body-md text-on-surface-variant">
          {children}
        </span>
      )}
    </span>
  );
}
