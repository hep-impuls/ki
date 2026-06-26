"use client";

import { useEffect, useState } from "react";
import WissenCheck, { type WissenCheckProps } from "./WissenCheck";
import { hatBeantwortet } from "../_lib/punkte";

/**
 * WissenCheckGruppe — Container für ≥2 WissenChecks zu einem Clip (Handoff v2
 * §5.3). Titel + dezenter Fortschritt ("2 von 4 beantwortet"). Tonal
 * bewertungsfrei: "Wissen-Check", nie "Test"/"Note".
 */

export interface WissenCheckGruppeSpec {
  id: string;
  titel: string;
  checks: WissenCheckProps[];
}

export default function WissenCheckGruppe({ spec }: { spec: WissenCheckGruppeSpec }) {
  const [beantwortet, setBeantwortet] = useState(0);

  // Fortschritt reload-fest aus localStorage zusammenzählen.
  useEffect(() => {
    const n = spec.checks.filter((c) => hatBeantwortet(c.id)).length;
    setBeantwortet(n);
  }, [spec.checks]);

  return (
    <section className="flex flex-col gap-md rounded-xl border border-outline-variant bg-surface-container-low p-md">
      <div className="flex items-center justify-between gap-sm">
        <h3 className="flex items-center gap-sm text-headline-sm text-on-surface">
          <span className="material-symbols-outlined text-[20px] text-primary">checklist</span>
          {spec.titel}
        </h3>
        <span className="shrink-0 rounded-xl bg-surface-container px-sm py-xs text-label-sm text-on-surface-variant">
          {beantwortet} / {spec.checks.length}
        </span>
      </div>

      <div
        className="flex flex-col gap-md"
        onClickCapture={() => {
          // nach jedem Klick Fortschritt neu zählen (idempotent, billig)
          setBeantwortet(spec.checks.filter((c) => hatBeantwortet(c.id)).length);
        }}
      >
        {spec.checks.map((c) => (
          <WissenCheck key={c.id} {...c} />
        ))}
      </div>
    </section>
  );
}
