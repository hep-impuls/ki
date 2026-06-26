"use client";

/**
 * LernzielKarte — Onboarding-/Lernziel-Karte (Handoff v2 §5.1, 10mio
 * "OnboardingCard"-Muster).
 *
 * Jede Phase/Station beginnt damit: 2-3 Lernziele ("Du erkennst…", "Du
 * kannst…"), eine kurze Aktivitäts-Ansage und vor allem "Was kommt als
 * Nächstes und warum". Verbose, führend, motivierend — nicht karg.
 *
 * Reine MD3-Tokens, Material Symbols, echte Umlaute.
 */

export interface LernzielKarteSpec {
  titel: string;
  lernziele: string[];
  /** kurze Ansage, was du in dieser Phase konkret tust */
  aktivitaet?: string;
  /** "Was kommt als Nächstes und warum" — die führende Brücke */
  wasKommt?: string;
  /** dezenter Zusatzhinweis (z.B. "freiwillig, kein Test") */
  note?: string;
}

export default function LernzielKarte({
  titel,
  lernziele,
  aktivitaet,
  wasKommt,
  note,
}: LernzielKarteSpec) {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
      <div className="flex items-center gap-sm">
        <span className="material-symbols-outlined text-[22px] text-primary">flag</span>
        <p className="text-label-md uppercase tracking-wider text-primary">{titel}</p>
      </div>

      <p className="mt-md text-body-md font-semibold text-on-surface">Das nimmst du mit:</p>
      <ul className="mt-sm flex flex-col gap-sm">
        {lernziele.map((z, i) => (
          <li key={i} className="flex items-start gap-sm text-body-md text-on-surface">
            <span className="material-symbols-outlined mt-[2px] text-[20px] text-tertiary">
              check_circle
            </span>
            <span>{z}</span>
          </li>
        ))}
      </ul>

      {aktivitaet && (
        <p className="mt-md flex items-start gap-sm rounded-lg bg-surface-container-low p-md text-body-md text-on-surface-variant">
          <span className="material-symbols-outlined mt-[2px] text-[20px] text-primary">
            touch_app
          </span>
          <span>{aktivitaet}</span>
        </p>
      )}

      {wasKommt && (
        <p className="mt-md flex items-start gap-sm rounded-lg bg-tertiary-container p-md text-body-md text-on-tertiary-container">
          <span className="material-symbols-outlined mt-[2px] text-[20px]">arrow_forward</span>
          <span>
            <span className="font-semibold">Was als Nächstes kommt — und warum:</span> {wasKommt}
          </span>
        </p>
      )}

      {note && (
        <p className="mt-md inline-flex items-center gap-xs text-label-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-tertiary">info</span>
          {note}
        </p>
      )}
    </section>
  );
}
