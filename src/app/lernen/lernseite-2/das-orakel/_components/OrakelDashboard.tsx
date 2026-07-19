"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  castVote,
  loadPollCounts,
  subscribePollCounts,
  totalVotes,
  type PollCounts,
} from "@/lib/polls";
import { FadenDivider } from "../../_components/Gewebe";
import AktivitaetsNetz from "../../_components/AktivitaetsNetz";
import { leseSpuren, SPUR_EVENT, SPUREN_POLL_ID } from "../../_lib/spuren";

/**
 * Orakel-Dashboard (Thema 03) — «erkenne dich selbst».
 *
 * Zweifach gesammelte Daten, ein Vergleich:
 *  - DEINS bleibt im Browser (Spuren, dein Satz, deine Poll-Wahl).
 *  - ALLE ist die anonyme Firebase-Sammlung (Aggregat-Zähler + ausdrücklich
 *    geteilte Sätze) — ohne Namen, ohne Code.
 *  - Die KI (Orakel) bekommt serverseitig NUR eine Zusammenfassung der
 *    anonymen Sammlung und deutet den Querschnitt.
 *  Die Gegenüberstellung «du ↔ alle» rechnet dieser Browser selbst.
 */

/* ── Bereiche der eigenen Spur (Totale = Anzahl Knoten je Interaktion) ──── */

const BEREICHE: { prefix: string; label: string; total: number; href: string }[] = [
  { prefix: "vorhang-auf:story", label: "Die KI-Story", total: 22, href: "/lernen/lernseite-2/vorhang-auf" },
  { prefix: "vorhang-auf:weisheit", label: "Merkmale der neuen Akteurin", total: 7, href: "/lernen/lernseite-2/vorhang-auf" },
  { prefix: "vorhang-auf:kontext", label: "Die KI im Kontext", total: 12, href: "/lernen/lernseite-2/vorhang-auf" },
  { prefix: "philosophische-perspektive:einstieg", label: "Was ist Philosophie?", total: 4, href: "/lernen/lernseite-2/philosophische-perspektive" },
  { prefix: "philosophische-perspektive:teppich", label: "Der historische Teppich", total: 18, href: "/lernen/lernseite-2/philosophische-perspektive" },
  { prefix: "philosophische-perspektive:baustein", label: "Bausteine im Zeitstrahl", total: 15, href: "/lernen/lernseite-2/philosophische-perspektive" },
  { prefix: "video:", label: "Video-Impulse", total: 3, href: "/lernen/lernseite-2" },
];

const GESAMT_TOTAL = BEREICHE.reduce((s, b) => s + b.total, 0);

/* ── Blick-Umfrage ────────────────────────────────────────────────────────── */

const BLICK_POLL_ID = "orakel-blick";
const BLICK_OPTIONEN: { id: string; label: string; icon: string }[] = [
  { id: "neugierig", label: "Neugierig", icon: "explore" },
  { id: "pragmatisch", label: "Pragmatisch", icon: "handyman" },
  { id: "kritisch", label: "Kritisch", icon: "psychology_alt" },
  { id: "gemischt", label: "Gemischt", icon: "balance" },
];

/* ── lokale Schlüssel ─────────────────────────────────────────────────────── */

const KEY_SATZ = "ki26-orakel-satz";
const KEY_SATZ_GETEILT = "ki26-orakel-satz-geteilt";
const KEY_BLICK = "ki26-orakel-blick";

type Querschnitt = {
  anzahl: number;
  stichprobe: string[];
  blick: PollCounts;
  spuren: PollCounts;
  orakel: { text: string; standMs: number } | null;
  grund: "kein-schluessel" | "zu-wenig" | null;
};

function summeMitPrefix(counts: PollCounts, prefix: string): number {
  return Object.entries(counts).reduce(
    (s, [id, n]) => (id.startsWith(prefix) ? s + (Number(n) || 0) : s),
    0,
  );
}

export default function OrakelDashboard() {
  /* deine Spur (lokal) */
  const [meine, setMeine] = useState<Record<string, number>>({});
  const [meineWuensche, setMeineWuensche] = useState(0);
  /* alle (anonymer Zähler) */
  const [alleSpuren, setAlleSpuren] = useState<PollCounts>({});
  /* Satz */
  const [satz, setSatz] = useState("");
  const [geteilt, setGeteilt] = useState(false);
  const [teilStatus, setTeilStatus] = useState<"idle" | "laeuft" | "fehler">("idle");
  const [teilFehler, setTeilFehler] = useState<string | null>(null);
  /* Blick-Poll */
  const [blickWahl, setBlickWahl] = useState<string | null>(null);
  const [blickCounts, setBlickCounts] = useState<PollCounts>({});
  /* Querschnitt & Orakel */
  const [quer, setQuer] = useState<Querschnitt | null>(null);
  const [querStatus, setQuerStatus] = useState<"laedt" | "ok" | "fehler">("laedt");

  /* lokale Spuren lesen + live nachführen */
  const spurenLesen = useCallback(() => {
    const spuren = leseSpuren();
    const proBereich: Record<string, number> = {};
    for (const b of BEREICHE) {
      proBereich[b.prefix] = spuren.filter((s) => s.id.startsWith(b.prefix)).length;
    }
    setMeine(proBereich);
    setMeineWuensche(spuren.filter((s) => s.id.startsWith("wunsch:")).length);
  }, []);

  useEffect(() => {
    spurenLesen();
    window.addEventListener(SPUR_EVENT, spurenLesen);
    window.addEventListener("storage", spurenLesen);
    return () => {
      window.removeEventListener(SPUR_EVENT, spurenLesen);
      window.removeEventListener("storage", spurenLesen);
    };
  }, [spurenLesen]);

  /* lokalen Satz + Poll-Wahl laden */
  useEffect(() => {
    try {
      setSatz(window.localStorage.getItem(KEY_SATZ) ?? "");
      setGeteilt(window.localStorage.getItem(KEY_SATZ_GETEILT) === "1");
      setBlickWahl(window.localStorage.getItem(KEY_BLICK));
    } catch {
      /* Privatmodus */
    }
  }, []);

  /* anonyme Zähler abonnieren (alle) */
  useEffect(() => {
    const ab1 = subscribePollCounts(SPUREN_POLL_ID, setAlleSpuren);
    const ab2 = subscribePollCounts(BLICK_POLL_ID, setBlickCounts);
    void loadPollCounts(SPUREN_POLL_ID).then(setAlleSpuren);
    void loadPollCounts(BLICK_POLL_ID).then(setBlickCounts);
    return () => {
      ab1();
      ab2();
    };
  }, []);

  /* Querschnitt (+ Orakel) laden */
  const querschnittLaden = useCallback(async () => {
    setQuerStatus("laedt");
    try {
      const res = await fetch("/api/orakel/querschnitt");
      if (!res.ok) throw new Error(String(res.status));
      setQuer((await res.json()) as Querschnitt);
      setQuerStatus("ok");
    } catch {
      setQuerStatus("fehler");
    }
  }, []);

  useEffect(() => {
    void querschnittLaden();
  }, [querschnittLaden]);

  /* Aktionen */
  function satzAendern(wert: string) {
    setSatz(wert);
    try {
      window.localStorage.setItem(KEY_SATZ, wert);
    } catch {
      /* Privatmodus */
    }
  }

  async function satzTeilen() {
    const text = satz.trim();
    if (text.length < 3) {
      setTeilFehler("Bitte zuerst einen Satz schreiben (mind. 3 Zeichen).");
      setTeilStatus("fehler");
      return;
    }
    setTeilStatus("laeuft");
    setTeilFehler(null);
    try {
      const res = await fetch("/api/orakel/aussage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(data?.error ?? `Fehler ${res.status}`);
      setGeteilt(true);
      setTeilStatus("idle");
      try {
        window.localStorage.setItem(KEY_SATZ_GETEILT, "1");
      } catch {
        /* Privatmodus */
      }
      void querschnittLaden();
    } catch (err) {
      setTeilFehler(err instanceof Error ? err.message : "Teilen fehlgeschlagen.");
      setTeilStatus("fehler");
    }
  }

  function blickWaehlen(id: string) {
    if (blickWahl) return; // eine Stimme pro Gerät
    setBlickWahl(id);
    try {
      window.localStorage.setItem(KEY_BLICK, id);
    } catch {
      /* Privatmodus */
    }
    void castVote(BLICK_POLL_ID, id);
  }

  /* abgeleitete Werte */
  const meineGesamt = useMemo(
    () => Object.values(meine).reduce((s, n) => s + n, 0),
    [meine],
  );
  const blickTotal = totalVotes(blickCounts);

  return (
    <div className="max-w-3xl">
      {/* Aktivitätsnetz — gleich zu Beginn, dein Weg als Konstellation */}
      <AktivitaetsNetz
        className="mb-xl"
        schwebend
        titel="Dein Aktivitätsnetz"
        unterzeile="Was du bisher im Modul getan hast — angeklickte Knoten, eingeloggte Kombinationen und angeschaute Bilder, zusammen als ein Netz."
      />

      {/* Datenschutz-Erklärung — die Architektur in drei Sätzen */}
      <div className="flex items-start gap-sm rounded-xl border border-outline-variant bg-surface-container-low p-md">
        <span className="material-symbols-outlined mt-xs text-[20px] text-tertiary">
          lock
        </span>
        <p className="text-body-sm text-on-surface-variant">
          <strong className="text-on-surface">So funktioniert das Orakel:</strong>{" "}
          Deine Wege und dein Satz bleiben auf diesem Gerät. Nach Firebase geht
          nur Anonymes — Zähler ohne Namen (+1 pro besuchtem Knoten) und die
          Sätze, die du ausdrücklich teilst. Die KI sieht nie Einzelne: Sie
          erhält eine bereits anonymisierte Zusammenfassung und deutet den
          Querschnitt. Den Vergleich «du ↔ alle» rechnet dein Browser selbst.
        </p>
      </div>

      {/* 1 — Deine Spur */}
      <section className="mt-xl" aria-label="Deine Spur">
        <h2 className="text-headline-md text-on-surface">Deine Spur durchs Gewebe</h2>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          {meineGesamt} von {GESAMT_TOTAL} Knoten hast du auf diesem Gerät
          besucht — daneben, wie oft alle zusammen dort waren.
        </p>
        <div className="mt-md overflow-hidden rounded-xl border border-outline-variant bg-surface-bright">
          {BEREICHE.map((b, i) => {
            const mein = meine[b.prefix] ?? 0;
            const alle = summeMitPrefix(alleSpuren, b.prefix);
            const anteil = Math.min(1, mein / b.total);
            return (
              <a
                key={b.prefix}
                href={b.href}
                className={
                  "block p-md transition-colors hover:bg-surface-container-low" +
                  (i > 0 ? " border-t border-outline-variant" : "")
                }
              >
                <div className="flex items-baseline justify-between gap-md">
                  <span className="text-body-sm font-semibold text-on-surface">
                    {b.label}
                  </span>
                  <span className="flex-shrink-0 text-label-sm text-on-surface-variant">
                    du {mein}/{b.total} · alle {alle}×
                  </span>
                </div>
                <div className="mt-sm h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                  <div
                    className="h-full rounded-full bg-tertiary transition-[width] duration-500"
                    style={{ width: `${anteil * 100}%` }}
                  />
                </div>
              </a>
            );
          })}
        </div>

        {/* Merkzeichen «Mehr dazu wissen» */}
        <div className="mt-md flex items-start gap-sm rounded-xl border border-outline-variant bg-surface-container-low p-md">
          <span className="material-symbols-outlined mt-xs text-[20px] text-tertiary">
            bookmark_added
          </span>
          <p className="text-body-sm text-on-surface-variant">
            <strong className="text-on-surface">Was du weiterverfolgen willst:</strong>{" "}
            {meineWuensche === 0
              ? "Du hast noch kein Merkzeichen gesetzt. Setze bei einer Karte «Das verfolge ich weiter», wenn ein Punkt dich neugierig macht."
              : `${meineWuensche} Merkzeichen gesetzt`}
            {" · "}
            <span className="text-on-surface-variant">
              alle zusammen {summeMitPrefix(alleSpuren, "wunsch:")}×
            </span>
            . Deine Merkzeichen bleiben auf dem Gerät; anonym zählt nur, wie oft
            ein Thema klassenweit weiterverfolgt werden möchte — ein Hinweis für
            die Lehrperson, was zu vertiefen wäre.
          </p>
        </div>
      </section>

      <FadenDivider className="mt-xl" />

      {/* 2 — Die offene Frage */}
      <section className="mt-xl" aria-label="Die offene Frage">
        <h2 className="text-headline-md text-on-surface">Die offene Frage</h2>
        <blockquote className="mt-sm border-l-4 border-tertiary pl-md">
          <p className="text-body-lg italic text-on-surface">
            «Welche Schablone trägt uns durch die KI-Zeit?»
          </p>
        </blockquote>
        <p className="mt-sm text-body-sm text-on-surface-variant">
          Antworte in einem Satz. Er bleibt hier auf dem Gerät — bis du ihn
          ausdrücklich anonym in den Querschnitt gibst.
        </p>
        <textarea
          value={satz}
          onChange={(e) => satzAendern(e.target.value)}
          maxLength={220}
          rows={3}
          placeholder="Mein Satz …"
          className="mt-md w-full rounded-xl border border-outline-variant bg-surface-bright p-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:border-tertiary focus:outline-none"
        />
        <div className="mt-sm flex flex-wrap items-center gap-sm">
          <button
            type="button"
            onClick={() => void satzTeilen()}
            disabled={teilStatus === "laeuft" || satz.trim().length < 3}
            className="inline-flex items-center gap-sm rounded-xl bg-tertiary px-lg py-sm text-label-md text-on-tertiary shadow-sm transition hover:bg-on-tertiary-container disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            {teilStatus === "laeuft" ? "Wird geteilt …" : "Anonym teilen"}
          </button>
          <span className="text-label-sm text-on-surface-variant">
            {satz.length}/220
            {geteilt && (
              <>
                {" · "}
                <span className="text-tertiary">bereits einmal geteilt ✓</span>
              </>
            )}
          </span>
        </div>
        {teilFehler && (
          <p className="mt-sm text-body-sm text-error">{teilFehler}</p>
        )}
      </section>

      <FadenDivider className="mt-xl" />

      {/* 3 — Blick-Umfrage: du vs. alle */}
      <section className="mt-xl" aria-label="Blick auf KI">
        <h2 className="text-headline-md text-on-surface">
          Wie blickst du heute auf KI?
        </h2>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          {blickWahl
            ? `${blickTotal} ${blickTotal === 1 ? "Stimme" : "Stimmen"} insgesamt — deine ist markiert.`
            : "Wähle eine Haltung — danach siehst du, wie alle geantwortet haben."}
        </p>
        <div className="mt-md flex flex-col gap-sm">
          {BLICK_OPTIONEN.map((o) => {
            const n = Number(blickCounts[o.id] ?? 0);
            const anteil = blickTotal > 0 ? n / blickTotal : 0;
            const meineWahl = blickWahl === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => blickWaehlen(o.id)}
                disabled={Boolean(blickWahl)}
                className={
                  "relative overflow-hidden rounded-xl border p-md text-left transition " +
                  (meineWahl
                    ? "border-tertiary bg-tertiary-container/40"
                    : "border-outline-variant bg-surface-bright") +
                  (blickWahl ? "" : " hover:-translate-y-0.5 hover:shadow-sm")
                }
              >
                {blickWahl && (
                  <div
                    aria-hidden
                    className="absolute inset-y-0 left-0 bg-tertiary/10 transition-[width] duration-700"
                    style={{ width: `${anteil * 100}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between gap-md">
                  <span className="inline-flex items-center gap-sm text-body-md text-on-surface">
                    <span className="material-symbols-outlined text-[20px] text-tertiary">
                      {o.icon}
                    </span>
                    {o.label}
                    {meineWahl && (
                      <span className="rounded-lg bg-tertiary px-sm py-xs text-label-sm text-on-tertiary">
                        du
                      </span>
                    )}
                  </span>
                  {blickWahl && (
                    <span className="text-label-sm text-on-surface-variant">
                      {Math.round(anteil * 100)} % ({n})
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <FadenDivider className="mt-xl" />

      {/* 4 — Querschnitt & Orakel */}
      <section className="mt-xl" aria-label="Das Orakel spricht">
        <div className="flex items-center justify-between gap-md">
          <h2 className="text-headline-md text-on-surface">Das Orakel spricht</h2>
          <button
            type="button"
            onClick={() => void querschnittLaden()}
            className="inline-flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Aktualisieren
          </button>
        </div>

        {querStatus === "laedt" && (
          <p className="mt-md text-body-sm text-on-surface-variant">
            Der Querschnitt wird geholt …
          </p>
        )}
        {querStatus === "fehler" && (
          <p className="mt-md text-body-sm text-error">
            Der Querschnitt ist gerade nicht erreichbar — später nochmals
            versuchen.
          </p>
        )}

        {querStatus === "ok" && quer && (
          <>
            {/* Orakel-Karte */}
            <div className="mt-md rounded-xl border border-tertiary/40 bg-tertiary-container/30 p-lg">
              <p className="flex items-center gap-sm text-headline-sm text-on-surface">
                <span className="material-symbols-outlined text-tertiary">
                  insights
                </span>
                Der Blick aufs Ganze
              </p>
              {quer.orakel ? (
                <>
                  <p className="mt-sm whitespace-pre-line text-body-md text-on-surface">
                    {quer.orakel.text}
                  </p>
                  <p className="mt-sm text-label-sm text-on-surface-variant">
                    KI-Deutung des anonymen Querschnitts ({quer.anzahl} Sätze) —
                    ohne Zugriff auf Einzeldaten. Stand:{" "}
                    {new Date(quer.orakel.standMs).toLocaleString("de-CH")}
                  </p>
                </>
              ) : (
                <p className="mt-sm text-body-md text-on-surface-variant">
                  {quer.grund === "zu-wenig"
                    ? `Das Orakel wartet, bis mindestens 3 Sätze geteilt sind (aktuell ${quer.anzahl}). Teile deinen — dann beginnt es zu sprechen.`
                    : quer.grund === "kein-schluessel"
                    ? "Das Orakel schweigt noch: Auf dem Server ist kein KI-Schlüssel (ANTHROPIC_API_KEY) hinterlegt. Sobald er gesetzt ist, deutet es hier den Querschnitt."
                    : "Das Orakel sammelt noch — später nochmals vorbeischauen."}
                </p>
              )}
            </div>

            {/* Stimmen aus dem Querschnitt */}
            {quer.stichprobe.length > 0 && (
              <div className="mt-lg">
                <h3 className="text-headline-sm text-on-surface">
                  Stimmen aus dem Querschnitt
                </h3>
                <p className="mt-xs text-body-sm text-on-surface-variant">
                  Die neuesten anonym geteilten Sätze — vielleicht ist deiner
                  darunter.
                </p>
                <ul className="mt-md flex flex-col gap-sm">
                  {quer.stichprobe.map((t, i) => (
                    <li
                      key={i}
                      className="rounded-xl border border-outline-variant bg-surface-bright p-md text-body-md italic text-on-surface-variant"
                    >
                      «{t}»
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
