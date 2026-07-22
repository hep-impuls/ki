"use client";

import { useState } from "react";
import { aktivitaetenLoeschen } from "../_lib/neustart";

/**
 * NeustartButton — «Diese Seite von vorne beginnen». Löscht die Aktivitäten der
 * Seite (Spuren, Gewichtungen, Flächen-Bilanzen) lokal und im Cloud-Spiegel und
 * lädt die Seite danach frisch. Zweistufig (erst fragen, dann löschen), weil es
 * sich nicht rückgängig machen lässt. Nur Theme-Tokens, Material Symbols.
 *
 * `teile` = Teil-Strings, die eine Aktivität dieser Seite zuordnen (siehe
 * `aktivitaetenLoeschen`). `seitenName` = Klartextname für die Rückfrage.
 */
export default function NeustartButton({
  teile,
  seitenName,
  className = "",
}: {
  teile: string[];
  seitenName: string;
  className?: string;
}) {
  const [phase, setPhase] = useState<"idle" | "frage" | "laeuft">("idle");

  async function bestaetigen() {
    setPhase("laeuft");
    try {
      await aktivitaetenLoeschen(teile);
    } finally {
      // Frisch laden — alle Muster und Karten bauen sich leer wieder auf.
      window.location.reload();
    }
  }

  return (
    <section
      aria-label="Aktivitäten dieser Seite zurücksetzen"
      className={
        "rounded-xl border border-outline-variant bg-surface-container-low p-md " + className
      }
    >
      {phase === "idle" && (
        <div className="flex flex-wrap items-center justify-between gap-sm">
          <p className="flex items-center gap-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">restart_alt</span>
            Von vorne beginnen? Das löscht deine Aktivitäten auf dieser Seite.
          </p>
          <button
            type="button"
            onClick={() => setPhase("frage")}
            className="inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright px-md py-xs text-label-md text-on-surface-variant transition-colors hover:border-tertiary hover:text-tertiary"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            Aktivitäten zurücksetzen
          </button>
        </div>
      )}

      {phase === "frage" && (
        <div className="flex flex-col gap-sm">
          <p className="text-body-sm text-on-surface">
            Wirklich zurücksetzen? Deine angeklickten Punkte, geknüpften Flächen
            und Bewertungen auf «{seitenName}» werden gelöscht, auch auf anderen
            Geräten mit deinem Code. Die andere Seite und dein Code bleiben
            erhalten. Das lässt sich nicht rückgängig machen.
          </p>
          <div className="flex flex-wrap gap-sm">
            <button
              type="button"
              onClick={() => void bestaetigen()}
              className="inline-flex items-center gap-xs rounded-full bg-tertiary px-md py-xs text-label-md text-on-tertiary shadow-sm transition hover:bg-on-tertiary-container"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              Ja, zurücksetzen
            </button>
            <button
              type="button"
              onClick={() => setPhase("idle")}
              className="inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright px-md py-xs text-label-md text-on-surface-variant transition-colors hover:border-tertiary"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {phase === "laeuft" && (
        <p className="flex items-center gap-sm text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-[18px] text-tertiary">
            progress_activity
          </span>
          Wird zurückgesetzt …
        </p>
      )}
    </section>
  );
}
