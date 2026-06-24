"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  loadPollCounts,
  subscribePollCounts,
  totalVotes,
  type PollCounts,
} from "@/lib/polls";
import { GLOBAL_AXIS, pollId, resolveKlasse } from "../_lib/unitPolls";

/**
 * KollektivSpiegel — Handoff §5.3, v2 §3/§4.
 *
 * Drei Ebenen auf derselben 1..7-Achse (GLOBAL_AXIS):
 *   - Ich:    eigener Pre→Post-Marker (rein lokal).
 *   - Klasse: Verteilung aus pollId.klassePost (einmalig geladen).
 *   - Alle:   Verteilung aus pollId.globalPost (live via subscribe).
 *
 * Reine CSS/Divs mit MD3-Tokens, keine Chart-Library. Bei n < 5 ein dezenter
 * Hinweis (sanfte k-Anonymitaet fuers Gefuehl).
 */

const STUFEN = [1, 2, 3, 4, 5, 6, 7];

function bucketWert(counts: PollCounts, n: number): number {
  return Number(counts[`s${n}`] ?? 0);
}

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

/* ── Verteilung als Balkenreihe ──────────────────────────────────────────── */

function Verteilung({ counts, farbe }: { counts: PollCounts; farbe: string }) {
  const total = totalVotes(counts);
  return (
    <div className="flex flex-col gap-xs">
      {STUFEN.map((n) => {
        const wert = bucketWert(counts, n);
        const pct = total > 0 ? Math.round((wert / total) * 100) : 0;
        return (
          <div key={n} className="flex items-center gap-sm">
            <span className="w-4 shrink-0 text-right text-label-sm text-on-surface-variant">{n}</span>
            <div className="h-5 flex-1 overflow-hidden rounded-md bg-surface-container">
              <div
                className={`h-full rounded-md ${farbe}`}
                style={{ width: `${pct}%` }}
                aria-hidden
              />
            </div>
            <span className="w-16 shrink-0 text-label-sm text-on-surface-variant">
              {pct}% ({wert})
            </span>
          </div>
        );
      })}
      <div className="mt-xs flex justify-between text-label-sm text-on-surface-variant">
        <span>{GLOBAL_AXIS.links}</span>
        <span>{GLOBAL_AXIS.rechts}</span>
      </div>
      {total < 5 && (
        <p className="mt-xs inline-flex items-center gap-xs text-label-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px] text-tertiary">info</span>
          Noch wenige Daten (n = {total}).
        </p>
      )}
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
    // Klasse: einmalig laden.
    void loadPollCounts(pollId.klassePost(code)).then((c) => {
      if (aktiv) setKlasse(c);
    });
    // Alle: live abonnieren.
    const unsub = subscribePollCounts(pollId.globalPost, setAlle);
    return () => {
      aktiv = false;
      unsub();
    };
  }, []);

  return (
    <div className="flex flex-col gap-md">
      <Block
        icon="person"
        titel="Ich"
        untertitel="Deine Position vorher und nachher — bleibt auf deinem Geraet."
      >
        <IchAchse pre={preWert} post={postWert} />
      </Block>

      <Block
        icon="groups"
        titel="Meine Klasse"
        untertitel="Wo deine Klasse am Ende steht (anonym, aggregiert)."
      >
        <Verteilung counts={klasse} farbe="bg-tertiary" />
      </Block>

      <Block
        icon="public"
        titel="Alle"
        untertitel="Alle Teilnehmenden — fuellt sich live."
      >
        <Verteilung counts={alle} farbe="bg-primary" />
      </Block>

      <p className="rounded-xl bg-surface-container-low px-lg py-md text-body-sm text-on-surface-variant">
        Du bist nicht allein. Auch andere bewegen sich — manche zur Chance, manche
        zur Bedrohung. Deine Klasse, die ganze Gruppe: Spannung aushalten ist normal.
      </p>
    </div>
  );
}
