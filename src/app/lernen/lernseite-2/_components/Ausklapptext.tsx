"use client";

import { useState, type ReactNode } from "react";

/**
 * Ausklapptext — teilt einen Infotext in einen sichtbaren Kern und eine
 * anklickbare Erweiterung. Der Kern steht immer da; die Erweiterung
 * («Mehr dazu») klappt auf Wunsch auf. Nur Theme-Tokens.
 */
export default function Ausklapptext({
  titel = "Mehr dazu",
  children,
  className = "",
}: {
  /** Beschriftung des Aufklapp-Knopfes. */
  titel?: string;
  children: ReactNode;
  className?: string;
}) {
  const [offen, setOffen] = useState(false);
  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOffen((o) => !o)}
        aria-expanded={offen}
        className="inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright px-md py-xs text-label-md text-on-surface-variant transition-colors hover:border-tertiary hover:text-tertiary"
      >
        <span className="material-symbols-outlined text-[16px] text-tertiary">
          {offen ? "expand_less" : "menu_book"}
        </span>
        {offen ? "Weniger" : titel}
      </button>
      {offen && (
        <div className="animate-frame-in mt-sm space-y-sm text-body-md text-on-surface-variant">
          {children}
        </div>
      )}
    </div>
  );
}
