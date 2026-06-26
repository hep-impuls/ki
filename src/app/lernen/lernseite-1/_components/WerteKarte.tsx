"use client";

import type { SwipePick } from "../_lib/stationStore";

/**
 * WerteKarte (#1) — geteilte Werte-/Haltungs-Karte für Auftakt **und** Stationen.
 *
 * Ersetzt die zuvor doppelt gepflegte `SwipeFrame`/`SwipeKarteFrame`-Optik. Es
 * gibt **kein** Wisch-Gesture — nur zwei klar beschriftete Buttons. Die Aussage
 * steht prominent als Karte, darunter zwei gleich grosse Buttons (links «Sehe ich
 * anders», rechts «Sehe ich auch so»; Pol-Labels überschreibbar via `achse`).
 *
 * Rein präsentational: `pick`/`onPick` kommen vom Aufrufer, der Speichern (lokal)
 * und ggf. anonymes Aggregat-Casting selbst übernimmt.
 */
export default function WerteKarte({
  aussage,
  achse,
  pick,
  onPick,
}: {
  aussage: string;
  achse?: { links: string; rechts: string };
  pick: SwipePick | null;
  onPick: (p: SwipePick) => void;
}) {
  const links = achse?.links ?? "Sehe ich anders";
  const rechts = achse?.rechts ?? "Sehe ich auch so";
  return (
    <div className="flex flex-col gap-lg">
      <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg text-center text-body-lg text-on-surface shadow-sm">
        {aussage}
      </div>
      <div className="grid grid-cols-2 gap-md">
        <button
          type="button"
          aria-pressed={pick === "links"}
          onClick={() => onPick("links")}
          className={`inline-flex items-center justify-center gap-xs rounded-lg border p-md text-body-md transition-colors ${
            pick === "links"
              ? "border-primary bg-primary-container text-on-primary-container"
              : "border-outline-variant text-on-surface hover:border-primary"
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">thumb_down</span>
          {links}
        </button>
        <button
          type="button"
          aria-pressed={pick === "rechts"}
          onClick={() => onPick("rechts")}
          className={`inline-flex items-center justify-center gap-xs rounded-lg border p-md text-body-md transition-colors ${
            pick === "rechts"
              ? "border-primary bg-primary-container text-on-primary-container"
              : "border-outline-variant text-on-surface hover:border-primary"
          }`}
        >
          {rechts}
          <span className="material-symbols-outlined text-[20px]">thumb_up</span>
        </button>
      </div>
    </div>
  );
}
