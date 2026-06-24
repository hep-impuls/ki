"use client";

/**
 * Skala — segmentierte 1..steps-Skala (slider-artig), shared.
 *
 * Aus Station.tsx extrahiert (Handoff §3), damit globaler Auftakt-/Abschluss-
 * Slider und die Stations-Slider exakt dieselbe Optik nutzen. Reine MD3-Tokens.
 */

interface SkalaProps {
  value: number | null;
  onChange: (n: number) => void;
  links: string;
  rechts: string;
  /** Anzahl Stufen (Default 7). */
  steps?: number;
}

export default function Skala({ value, onChange, links, rechts, steps = 7 }: SkalaProps) {
  const skala = Array.from({ length: steps }, (_, i) => i + 1);
  return (
    <div>
      <div className="flex gap-xs">
        {skala.map((n) => {
          const on = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              aria-pressed={on}
              className={
                on
                  ? "flex h-11 flex-1 items-center justify-center rounded-lg bg-primary text-label-md text-on-primary"
                  : "flex h-11 flex-1 items-center justify-center rounded-lg border border-outline-variant bg-surface-bright text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
              }
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-xs flex justify-between text-label-sm text-on-surface-variant">
        <span>{links}</span>
        <span>{rechts}</span>
      </div>
    </div>
  );
}
