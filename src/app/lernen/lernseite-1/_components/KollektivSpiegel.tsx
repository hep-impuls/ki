"use client";

import { useEffect, useState, type ReactNode } from "react";
import { loadPollCounts, subscribePollCounts, type PollCounts } from "@/lib/polls";
import { GLOBAL_AXIS, pollId, resolveKlasse } from "../_lib/unitPolls";
import Verteilung, { type VerteilungOption } from "./Verteilung";

/**
 * KollektivSpiegel — Handoff §5.3, v2 §3/§4.
 *
 * Drei Ebenen auf derselben 1..7-Achse (GLOBAL_AXIS):
 *   - Ich:    eigener Pre→Post-Marker (rein lokal).
 *   - Klasse: Verteilung aus pollId.klassePost (einmalig geladen).
 *   - Alle:   Verteilung aus pollId.globalPost (live via subscribe).
 *
 * Die Balken kommen jetzt aus der generischen <Verteilung> — die 1..7-Skala
 * ist nur ein Spezialfall mit 7 Optionen (s1..s7). Bei n < 5 ein dezenter
 * Hinweis (sanfte k-Anonymität fürs Gefühl).
 */

const STUFEN = [1, 2, 3, 4, 5, 6, 7];
const STUFEN_OPTIONEN: VerteilungOption[] = STUFEN.map((n) => ({ id: `s${n}`, label: `${n}` }));

/* ── Ich: Pre→Post-Marker ─────────────────────────────────────────────────── */

function IchAchse({ pre, post }: { pre: number | null; post: number | null }) {
  return (
    <div>
      <div className="flex gap-xs">
        {STUFEN.map((n) => {
          const istPre = pre === n;
          const istPost = post === n;
          const aktiv = istPre || istPost;
          return (
            <div
              key={n}
              className={
                aktiv
                  ? "flex h-11 flex-1 flex-col items-center justify-center rounded-lg bg-primary text-on-primary"
                  : "flex h-11 flex-1 flex-col items-center justify-center rounded-lg border border-outline-variant bg-surface-bright text-on-surface-variant"
              }
            >
              <span className="text-label-sm">{n}</span>
              {aktiv && (
                <span className="text-[10px] leading-none">
                  {istPre && istPost ? "vorher · nachher" : istPre ? "vorher" : "nachher"}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-xs flex justify-between text-label-sm text-on-surface-variant">
        <span>{GLOBAL_AXIS.links}</span>
        <span>{GLOBAL_AXIS.rechts}</span>
      </div>
    </div>
  );
}

function Block({
  icon,
  titel,
  untertitel,
  children,
}: {
  icon: string;
  titel: string;
  untertitel: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-bright p-lg">
      <div className="mb-md flex items-center gap-sm">
        <span className="material-symbols-outlined text-[20px] text-primary">{icon}</span>
        <div>
          <h3 className="text-headline-sm text-on-surface">{titel}</h3>
          <p className="text-label-sm text-on-surface-variant">{untertitel}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

/* ── Spiegel ─────────────────────────────────────────────────────────────── */

interface KollektivSpiegelProps {
  preWert: number | null;
  postWert: number | null;
}

export default function KollektivSpiegel({ preWert, postWert }: KollektivSpiegelProps) {
  const [klasse, setKlasse] = useState<PollCounts>({});
  const [alle, setAlle] = useState<PollCounts>({});

  useEffect(() => {
    const code = resolveKlasse();
    let aktiv = true;
    void loadPollCounts(pollId.klassePost(code)).then((c) => {
      if (aktiv) setKlasse(c);
    });
    const unsub = subscribePollCounts(pollId.globalPost, setAlle);
    return () => {
      aktiv = false;
      unsub();
    };
  }, []);

  const meinPick = postWert != null ? `s${postWert}` : undefined;

  return (
    <div className="flex flex-col gap-md">
      <Block
        icon="person"
        titel="Ich"
        untertitel="Deine Position vorher und nachher — bleibt auf deinem Gerät."
      >
        <IchAchse pre={preWert} post={postWert} />
      </Block>

      <Block
        icon="groups"
        titel="Meine Klasse"
        untertitel="Wo deine Klasse am Ende steht (anonym, aggregiert)."
      >
        <Verteilung
          counts={klasse}
          optionen={STUFEN_OPTIONEN}
          farbe="bg-tertiary"
          meinPick={meinPick}
          achse={GLOBAL_AXIS}
        />
      </Block>

      <Block icon="public" titel="Alle" untertitel="Alle Teilnehmenden — füllt sich live.">
        <Verteilung
          counts={alle}
          optionen={STUFEN_OPTIONEN}
          farbe="bg-primary"
          meinPick={meinPick}
          achse={GLOBAL_AXIS}
        />
      </Block>

      <p className="rounded-xl bg-surface-container-low px-lg py-md text-body-sm text-on-surface-variant">
        Du bist nicht allein. Auch andere bewegen sich — manche zur Chance, manche
        zur Bedrohung. Deine Klasse, die ganze Gruppe: Spannung aushalten ist normal.
      </p>
    </div>
  );
}
