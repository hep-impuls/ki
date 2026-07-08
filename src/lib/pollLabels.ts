/**
 * Einheitlicher Einstiegspunkt für menschenlesbare Poll-Beschriftungen im
 * Lehrer-Report. Bündelt die lernseiten-spezifischen Registries, damit der
 * Report nur EINE Quelle kennt.
 *
 * Christof (Lernseite 2): wenn deine Submodule eigene Polls casten, lege analog
 * zu `src/app/lernen/lernseite-1/_lib/pollRegistry.ts` eine eigene Registry an
 * und mische sie hier ein (erst lernseite-1, dann lernseite-2; bei ID-Kollision
 * gewinnt der erste Treffer — Poll-IDs sollten ohnehin eindeutig sein).
 */

import { describePoll as describeLernseite1, type PollMeta } from
  "@/app/lernen/lernseite-1/_lib/pollRegistry";

export type { PollMeta };

/**
 * Einen (im Report bereits von `p-`/`kp-{klasse}-` befreiten) Poll-ID in eine
 * lesbare Beschreibung übersetzen. Fällt heuristisch auf einen prettifizierten
 * Slug zurück, wenn keine Registry den ID kennt.
 */
export function describePoll(pollId: string): PollMeta {
  return describeLernseite1(pollId);
  // Künftig z.B.:
  // const hit = lernseite1.tryDescribe(pollId) ?? lernseite2.tryDescribe(pollId);
  // return hit ?? fallback(pollId);
}
