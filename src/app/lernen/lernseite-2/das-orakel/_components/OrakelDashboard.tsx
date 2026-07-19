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
import { GEWICHT_EVENT, leseGewichtungen } from "../../_lib/gewichtung";

/**
 * Orakel-Dashboard (Thema 03) — «erkenne dich selbst».
 *
 * Rundgang durch die eigene Aktivität in diesem Lernset, aus mehreren
 * Perspektiven — verbunden, wo möglich, mit den anonymen Daten aller.
 * Am Schluss deutet die KI (das Orakel) die eigene Aktivität in wenigen
 * Sätzen, wahlweise wissenschaftlich, literarisch oder fantastisch.
 *
 * Datenschutz:
 *  - DEINS (Wege, Bewertungen, Satz) bleibt im Browser.
 *  - ALLE ist die anonyme Firebase-Sammlung (Aggregat-Zähler + ausdrücklich
 *    geteilte Sätze) — ohne Namen, ohne Code.
 *  - Fürs Orakel schickt der Browser auf Knopfdruck NUR anonyme Kennzahlen
 *    (Zähler, Bewertungs-Verteilungen) an die KI — keinen Namen, keinen Code.
 */

/* ── Findmind-Umfragen ─────────────────────────────────────────────────────
 * Sobald die Umfragen in findmind.ch angelegt sind, hier die jeweilige
 * Einbettungs-/Teilen-URL eintragen. Leer = Platzhalter-Hinweis. */
const FINDMIND_FEEDBACK_URL = "";
const FINDMIND_GEFALLEN_URL = "";

/* ── Bereiche der eigenen Spur (Totale = Anzahl Knoten je Interaktion) ──── */

const BEREICHE: { prefix: string; label: string; total: number; href: string }[] = [
  { prefix: "vorhang-auf:story", label: "Die KI-Story", total: 22, href: "/lernen/lernseite-2/vorhang-auf" },
  { prefix: "vorhang-auf:weisheit", label: "Merkmale der neuen Akteurin", total: 12, href: "/lernen/lernseite-2/vorhang-auf" },
  { prefix: "vorhang-auf:kontext", label: "Die KI im Kontext", total: 12, href: "/lernen/lernseite-2/vorhang-auf" },
  { prefix: "philosophische-perspektive:einstieg", label: "Was ist Philosophie?", total: 4, href: "/lernen/lernseite-2/philosophische-perspektive" },
  { prefix: "philosophische-perspektive:teppich", label: "Der Teppich des Wandels", total: 33, href: "/lernen/lernseite-2/philosophische-perspektive" },
  { prefix: "philosophische-perspektive:epochen", label: "Philosophie in Zeiten der Verunsicherung", total: 24, href: "/lernen/lernseite-2/philosophische-perspektive" },
  { prefix: "video:", label: "Video-Impulse", total: 3, href: "/lernen/lernseite-2" },
];

const GESAMT_TOTAL = BEREICHE.reduce((s, b) => s + b.total, 0);

/* ── Bewertungs-Präfixe (lokal, aus gewichtung.ts) ────────────────────────── */

const P_RELEVANZ = "philosophische-perspektive:relevanz"; // [kaum, etwas, stark]
const P_TECHNIK = "philosophische-perspektive:technikwert"; // [froh, keine Bedeutung, hätte nie]
const P_VERUNSICH = "philosophische-perspektive:verunsicherung-heute"; // [noch heute, ein wenig, gar nicht]
const P_PHILO = "philosophische-perspektive:philo-hilft"; // [hilft, nie so überlegt, kein Sinn]
const P_GESTALT = "vorhang-auf:gestalt"; // [unkenntlich, verschwommen, deutlich]

function zaehleStufe(prefix: string, stufe: number): number {
  return Object.values(leseGewichtungen(prefix)).filter((s) => s === stufe).length;
}

/* ── Blick-Umfrage ────────────────────────────────────────────────────────── */

const BLICK_POLL_ID = "orakel-blick";
const BLICK_OPTIONEN: { id: string; label: string; icon: string }[] = [
  { id: "neugierig", label: "Neugierig", icon: "explore" },
  { id: "pragmatisch", label: "Pragmatisch", icon: "handyman" },
  { id: "kritisch", label: "Kritisch", icon: "psychology_alt" },
  { id: "gemischt", label: "Gemischt", icon: "balance" },
];

/* ── Orakel-Stile ─────────────────────────────────────────────────────────── */

type Stil = "wissenschaftlich" | "literarisch" | "fantastisch";
const STILE: { id: Stil; label: string; icon: string; beschreibung: string }[] = [
  { id: "wissenschaftlich", label: "Wissenschaftlich", icon: "science", beschreibung: "nüchtern, analytisch" },
  { id: "literarisch", label: "Literarisch", icon: "auto_stories", beschreibung: "bildhaft, poetisch" },
  { id: "fantastisch", label: "Fantastisch", icon: "auto_awesome", beschreibung: "mythisch, orakelhaft" },
];

/* ── lokale Schlüssel ─────────────────────────────────────────────────────── */

const KEY_BLICK = "ki26-orakel-blick";

function summeMitPrefix(counts: PollCounts, prefix: string): number {
  return Object.entries(counts).reduce(
    (s, [id, n]) => (id.startsWith(prefix) ? s + (Number(n) || 0) : s),
    0,
  );
}

/* Kombinationen (Kanten) aus den anonymen Zählern zählen. */
function summeKanten(counts: PollCounts): number {
  return Object.entries(counts).reduce(
    (s, [id, n]) => (id.includes(":kanten-") ? s + (Number(n) || 0) : s),
    0,
  );
}

interface OrakelZustand {
  text: string | null;
  status: "idle" | "laedt" | "ok" | "fehler" | "kein-schluessel" | "zu-wenig";
  zufrieden: boolean | null;
}
const LEER: OrakelZustand = { text: null, status: "idle", zufrieden: null };

export default function OrakelDashboard() {
  /* deine Spur (lokal) */
  const [meine, setMeine] = useState<Record<string, number>>({});
  const [meineWuensche, setMeineWuensche] = useState(0);
  const [meineKombis, setMeineKombis] = useState(0);
  const [meineBilder, setMeineBilder] = useState(0);
  const [meineVideos, setMeineVideos] = useState(0);
  /* deine Bewertungen (lokal) */
  const [bew, setBew] = useState({
    relevanzStark: 0,
    relevanzKaum: 0,
    technikFroh: 0,
    technikAbschaffen: 0,
    verunsichertNochHeute: 0,
    philoHilft: 0,
    philoKeinSinn: 0,
    gestaltDeutlich: 0,
  });
  /* alle (anonymer Zähler) */
  const [alleSpuren, setAlleSpuren] = useState<PollCounts>({});
  /* Blick-Poll */
  const [blickWahl, setBlickWahl] = useState<string | null>(null);
  const [blickCounts, setBlickCounts] = useState<PollCounts>({});
  /* Orakel */
  const [stil, setStil] = useState<Stil>("wissenschaftlich");
  const [orakel, setOrakel] = useState<Record<Stil, OrakelZustand>>({
    wissenschaftlich: LEER,
    literarisch: LEER,
    fantastisch: LEER,
  });

  /* lokale Spuren + Bewertungen lesen + live nachführen */
  const lokalLesen = useCallback(() => {
    const spuren = leseSpuren();
    const proBereich: Record<string, number> = {};
    for (const b of BEREICHE) {
      proBereich[b.prefix] = spuren.filter((s) => s.id.startsWith(b.prefix)).length;
    }
    setMeine(proBereich);
    setMeineWuensche(spuren.filter((s) => s.id.startsWith("wunsch:")).length);
    setMeineKombis(spuren.filter((s) => s.id.includes(":kanten-")).length);
    setMeineBilder(spuren.filter((s) => s.id.includes(":bild")).length);
    setMeineVideos(spuren.filter((s) => s.id.startsWith("video:")).length);
    setBew({
      relevanzStark: zaehleStufe(P_RELEVANZ, 2),
      relevanzKaum: zaehleStufe(P_RELEVANZ, 0),
      technikFroh: zaehleStufe(P_TECHNIK, 0),
      technikAbschaffen: zaehleStufe(P_TECHNIK, 2),
      verunsichertNochHeute: zaehleStufe(P_VERUNSICH, 0),
      philoHilft: zaehleStufe(P_PHILO, 0),
      philoKeinSinn: zaehleStufe(P_PHILO, 2),
      gestaltDeutlich: zaehleStufe(P_GESTALT, 2),
    });
  }, []);

  useEffect(() => {
    lokalLesen();
    window.addEventListener(SPUR_EVENT, lokalLesen);
    window.addEventListener(GEWICHT_EVENT, lokalLesen);
    window.addEventListener("storage", lokalLesen);
    return () => {
      window.removeEventListener(SPUR_EVENT, lokalLesen);
      window.removeEventListener(GEWICHT_EVENT, lokalLesen);
      window.removeEventListener("storage", lokalLesen);
    };
  }, [lokalLesen]);

  /* Poll-Wahl laden */
  useEffect(() => {
    try {
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

  /* abgeleitete Werte */
  const meineGesamt = useMemo(
    () => Object.values(meine).reduce((s, n) => s + n, 0),
    [meine],
  );
  const alleGesamt = useMemo(
    () => BEREICHE.reduce((s, b) => s + summeMitPrefix(alleSpuren, b.prefix), 0),
    [alleSpuren],
  );
  /* Gesamtnutzung aller: Summe sämtlicher anonymer Zähler (Knoten, Kanten,
   * Bilder, Videos, Merkzeichen) — so viele Interaktionen aller zusammen. */
  const gesamtNutzung = useMemo(
    () => Object.values(alleSpuren).reduce((s, n) => s + (Number(n) || 0), 0),
    [alleSpuren],
  );
  const blickTotal = totalVotes(blickCounts);

  /* Aktivitäts-Snapshot fürs Orakel bauen */
  const baueAktivitaet = useCallback(() => {
    return {
      knotenDu: meineGesamt,
      knotenGesamt: GESAMT_TOTAL,
      bereiche: BEREICHE.map((b) => ({
        label: b.label,
        du: meine[b.prefix] ?? 0,
        total: b.total,
      })),
      wuensche: meineWuensche,
      kombinationen: meineKombis,
      bilder: meineBilder,
      videos: meineVideos,
      ...bew,
      blickWahl,
    };
  }, [meine, meineGesamt, meineWuensche, meineKombis, meineBilder, meineVideos, bew, blickWahl]);

  /* Aktionen — Blick-Poll */
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

  /* Aktionen — Orakel befragen */
  const orakelBefragen = useCallback(
    async (welcher: Stil) => {
      setOrakel((prev) => ({ ...prev, [welcher]: { ...prev[welcher], status: "laedt", zufrieden: null } }));
      try {
        const res = await fetch("/api/orakel/deutung", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ stil: welcher, aktivitaet: baueAktivitaet() }),
        });
        const data = (await res.json().catch(() => null)) as
          | { text?: string; grund?: string }
          | null;
        if (data?.text) {
          setOrakel((prev) => ({ ...prev, [welcher]: { text: data.text!, status: "ok", zufrieden: null } }));
        } else if (data?.grund === "zu-wenig") {
          setOrakel((prev) => ({ ...prev, [welcher]: { text: null, status: "zu-wenig", zufrieden: null } }));
        } else if (data?.grund === "kein-schluessel") {
          setOrakel((prev) => ({ ...prev, [welcher]: { text: null, status: "kein-schluessel", zufrieden: null } }));
        } else {
          throw new Error("leer");
        }
      } catch {
        setOrakel((prev) => ({ ...prev, [welcher]: { text: null, status: "fehler", zufrieden: null } }));
      }
    },
    [baueAktivitaet],
  );

  function zufriedenSetzen(welcher: Stil, wert: boolean) {
    setOrakel((prev) => ({ ...prev, [welcher]: { ...prev[welcher], zufrieden: wert } }));
  }

  const aktuell = orakel[stil];

  /* ── Perspektiven-Kacheln ─────────────────────────────────────────────── */
  const perspektiven: {
    icon: string;
    titel: string;
    wert: string;
    text: string;
  }[] = [
    {
      icon: "ads_click",
      titel: "Angeklickte Punkte",
      wert: `${meineGesamt} / ${GESAMT_TOTAL}`,
      text: `Knoten hast du auf diesem Gerät geöffnet. Alle zusammen waren ${alleGesamt}× unterwegs.`,
    },
    {
      icon: "hub",
      titel: "Muster genutzt",
      wert: `${meineKombis}`,
      text:
        meineKombis === 0
          ? "Du hast die Punkte einzeln erkundet — noch keine Verbindung im Muster eingeloggt."
          : `Verbindungen hast du im Muster verknüpft. Alle zusammen: ${summeKanten(alleSpuren)}×.`,
    },
    {
      icon: "bookmark_added",
      titel: "Weiterverfolgen",
      wert: `${meineWuensche}`,
      text:
        meineWuensche === 0
          ? "Noch kein «das verfolge ich weiter» gesetzt."
          : `Merkzeichen gesetzt. Klassenweit: ${summeMitPrefix(alleSpuren, "wunsch:")}×.`,
    },
    {
      icon: "favorite",
      titel: "Für dich relevant",
      wert: `${bew.relevanzStark + bew.philoHilft + bew.technikFroh}`,
      text: `Punkte, die dein Leben prägen (${bew.relevanzStark}), Sichtweisen, die dir heute helfen (${bew.philoHilft}), und Technik, über die du froh bist (${bew.technikFroh}).`,
    },
    {
      icon: "do_not_disturb_on",
      titel: "Ohne Bedeutung",
      wert: `${bew.relevanzKaum + bew.philoKeinSinn + bew.technikAbschaffen}`,
      text: `Was du als kaum relevant (${bew.relevanzKaum}), sinnlos (${bew.philoKeinSinn}) oder überflüssig (${bew.technikAbschaffen}) markiert hast.`,
    },
    {
      icon: "sentiment_stressed",
      titel: "Verunsichert dich noch",
      wert: `${bew.verunsichertNochHeute}`,
      text: `Verunsicherungen aus den Epochen, die dich bis heute betreffen. KI-Merkmale, die dir «deutlich» wurden: ${bew.gestaltDeutlich}.`,
    },
  ];

  return (
    <div className="max-w-3xl">
      {/* 0 — Was passiert hier? */}
      <section aria-label="Worum es hier geht">
        <p className="text-body-lg text-on-surface-variant">
          Hier laufen deine Spuren zusammen. Das Orakel zeigt, was du in diesem
          Lernset getan hast — <strong className="text-on-surface">wo du
          weitergehen möchtest</strong>, was du{" "}
          <strong className="text-on-surface">vertieft</strong> hast, wo du{" "}
          <strong className="text-on-surface">Relevanz</strong> sahst und was
          für dich <strong className="text-on-surface">ohne Bedeutung</strong>{" "}
          blieb, welche Punkte du angeklickt und ob du die Aktivitäten im Muster
          verbunden hast. Mehrere Perspektiven auf dieselben Daten — jeweils, wo
          es geht, neben den anonymen Werten aller. Zum Schluss deutet die KI
          deinen Weg in wenigen Sätzen.
        </p>
      </section>

      {/* Aktivitätsnetz — dein Weg als Konstellation */}
      <AktivitaetsNetz
        className="mt-xl mb-lg"
        schwebend
        titel="Dein Aktivitätsnetz"
        unterzeile="Was du bisher im Modul getan hast — angeklickte Knoten, eingeloggte Kombinationen und angeschaute Bilder, zusammen als ein Netz."
      />

      {/* 1 — Perspektiven auf deine Aktivität */}
      <section className="mt-xl" aria-label="Perspektiven auf deine Aktivität">
        <h2 className="text-headline-md text-on-surface">
          Perspektiven auf deine Aktivität
        </h2>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          Sechs Blickwinkel auf deinen Weg. Die ersten drei stehen neben den
          anonymen Zahlen aller; die letzten drei entstehen aus deinen eigenen
          Bewertungen und bleiben auf diesem Gerät.
        </p>
        <div className="mt-md grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
          {perspektiven.map((p) => (
            <div
              key={p.titel}
              className="rounded-xl border border-outline-variant bg-surface-bright p-md"
            >
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-[20px] text-tertiary">
                  {p.icon}
                </span>
                <span className="text-label-md text-on-surface-variant">
                  {p.titel}
                </span>
              </div>
              <p className="mt-sm text-headline-sm text-on-surface">{p.wert}</p>
              <p className="mt-xs text-body-sm text-on-surface-variant">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2 — Angeklickte Punkte im Detail (du vs alle) */}
      <section className="mt-xl" aria-label="Angeklickte Punkte im Detail">
        <h2 className="text-headline-md text-on-surface">
          Deine Spur durchs Gewebe
        </h2>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          {meineGesamt} von {GESAMT_TOTAL} Knoten hast du besucht — daneben, wie
          oft alle zusammen dort waren. Tippe einen Bereich an, um dorthin
          zurückzukehren.
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

      {/* 4 — Das Orakel: KI deutet deine Aktivität */}
      <section className="mt-xl" aria-label="Das Orakel spricht">
        <h2 className="text-headline-md text-on-surface">Das Orakel spricht</h2>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          Das Orakel deutet deine eigene Aktivität in wenigen Sätzen. Wähle eine
          Form — und wenn sie dir nicht zusagt, befrage es in einer anderen. Dazu
          schickt dein Browser nur anonyme Kennzahlen (Zähler, Bewertungen), nie
          deinen Namen.
        </p>

        {/* Gesamtnutzung aller Teilnehmenden */}
        <p className="mt-md flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-container-low px-md py-sm text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px] text-tertiary">
            groups
          </span>
          <span>
            Gesamtnutzung aller Teilnehmenden:{" "}
            <strong className="text-on-surface">{gesamtNutzung.toLocaleString("de-CH")}</strong>{" "}
            Interaktionen in diesem Lernset — anonym gezählt, ohne Namen.
          </span>
        </p>

        {/* Stil-Wahl */}
        <div className="mt-md grid grid-cols-1 gap-sm sm:grid-cols-3">
          {STILE.map((s) => {
            const aktivGewaehlt = stil === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStil(s.id)}
                aria-pressed={aktivGewaehlt}
                className={
                  "rounded-xl border p-md text-left transition " +
                  (aktivGewaehlt
                    ? "border-tertiary bg-tertiary-container/40"
                    : "border-outline-variant bg-surface-bright hover:border-tertiary")
                }
              >
                <span className="flex items-center gap-sm text-body-md text-on-surface">
                  <span className="material-symbols-outlined text-[20px] text-tertiary">
                    {s.icon}
                  </span>
                  {s.label}
                </span>
                <span className="mt-xs block text-label-sm text-on-surface-variant">
                  {s.beschreibung}
                </span>
              </button>
            );
          })}
        </div>

        {/* Befragen / Ergebnis */}
        <div className="mt-md rounded-xl border border-tertiary/40 bg-tertiary-container/30 p-lg">
          {aktuell.status === "idle" && (
            <div className="flex flex-col items-start gap-sm">
              <p className="text-body-md text-on-surface-variant">
                Bereit für die <strong className="text-on-surface">{STILE.find((s) => s.id === stil)?.label.toLowerCase()}e</strong>{" "}
                Deutung deiner Aktivität?
              </p>
              <button
                type="button"
                onClick={() => void orakelBefragen(stil)}
                className="inline-flex items-center gap-sm rounded-xl bg-tertiary px-lg py-sm text-label-md text-on-tertiary shadow-sm transition hover:bg-on-tertiary-container"
              >
                <span className="material-symbols-outlined text-[18px]">insights</span>
                Das Orakel befragen
              </button>
            </div>
          )}

          {aktuell.status === "laedt" && (
            <p className="flex items-center gap-sm text-body-md text-on-surface-variant">
              <span className="material-symbols-outlined animate-spin text-[20px] text-tertiary">
                progress_activity
              </span>
              Das Orakel deutet deine Spuren …
            </p>
          )}

          {aktuell.status === "zu-wenig" && (
            <p className="text-body-md text-on-surface-variant">
              Für eine Deutung braucht das Orakel erst ein paar Spuren. Geh durch
              das Modul, klicke Punkte an — dann kehr zurück.
            </p>
          )}

          {aktuell.status === "kein-schluessel" && (
            <p className="text-body-md text-on-surface-variant">
              Das Orakel schweigt: Auf dem Server ist gerade kein KI-Schlüssel
              hinterlegt. Sobald er gesetzt ist, deutet es deine Aktivität hier.
            </p>
          )}

          {aktuell.status === "fehler" && (
            <div className="flex flex-col items-start gap-sm">
              <p className="text-body-md text-error">
                Das Orakel ist gerade nicht erreichbar. Versuch es gleich nochmals.
              </p>
              <button
                type="button"
                onClick={() => void orakelBefragen(stil)}
                className="inline-flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                Nochmals versuchen
              </button>
            </div>
          )}

          {aktuell.status === "ok" && aktuell.text && (
            <>
              <p className="flex items-center gap-sm text-label-md text-tertiary">
                <span className="material-symbols-outlined text-[18px]">
                  {STILE.find((s) => s.id === stil)?.icon}
                </span>
                {STILE.find((s) => s.id === stil)?.label}e Deutung
              </p>
              <p className="mt-sm whitespace-pre-line text-body-lg text-on-surface">
                {aktuell.text}
              </p>

              {/* Zufriedenheit */}
              <div className="mt-lg border-t border-outline-variant/60 pt-md">
                {aktuell.zufrieden === null ? (
                  <div className="flex flex-wrap items-center gap-sm">
                    <span className="text-body-sm text-on-surface-variant">
                      Zufrieden mit dieser Deutung?
                    </span>
                    <button
                      type="button"
                      onClick={() => zufriedenSetzen(stil, true)}
                      className="inline-flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs text-label-md text-on-surface transition-colors hover:border-tertiary"
                    >
                      <span className="material-symbols-outlined text-[16px] text-tertiary">
                        thumb_up
                      </span>
                      Ja
                    </button>
                    <button
                      type="button"
                      onClick={() => zufriedenSetzen(stil, false)}
                      className="inline-flex items-center gap-xs rounded-lg border border-outline-variant bg-surface-bright px-sm py-xs text-label-md text-on-surface transition-colors hover:border-tertiary"
                    >
                      <span className="material-symbols-outlined text-[16px] text-tertiary">
                        thumb_down
                      </span>
                      Nein
                    </button>
                    <button
                      type="button"
                      onClick={() => void orakelBefragen(stil)}
                      className="inline-flex items-center gap-xs rounded-lg px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:text-tertiary"
                    >
                      <span className="material-symbols-outlined text-[16px]">refresh</span>
                      Neu deuten
                    </button>
                  </div>
                ) : aktuell.zufrieden ? (
                  <p className="flex items-center gap-xs text-body-sm text-tertiary">
                    <span className="material-symbols-outlined text-[18px]">
                      check_circle
                    </span>
                    Schön — das Orakel hat dich gesehen.
                  </p>
                ) : (
                  <p className="text-body-sm text-on-surface-variant">
                    Kein Problem — wähle oben eine{" "}
                    <strong className="text-on-surface">andere Form</strong> des
                    Orakels und befrage es erneut.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <FadenDivider className="mt-xl" />

      {/* 5 — Rückmeldung: zwei Findmind-Umfragen */}
      <section className="mt-xl" aria-label="Deine Rückmeldung">
        <h2 className="text-headline-md text-on-surface">Deine Rückmeldung</h2>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          Zwei kurze Umfragen helfen uns, das Lernset zu verbessern. Beide sind
          anonym und dauern nur wenige Minuten.
        </p>
        <div className="mt-md grid grid-cols-1 gap-md md:grid-cols-2">
          <UmfrageKarte
            icon="rate_review"
            titel="Rückmeldung & Fehler melden"
            text="Konkrete Verbesserungen, Anregungen oder falsche Inhalte? Sag es uns hier."
            url={FINDMIND_FEEDBACK_URL}
          />
          <UmfrageKarte
            icon="sentiment_satisfied"
            titel="Wie hat dir das Lernset gefallen?"
            text="Ein kurzer Eindruck: Was hat gewirkt, was weniger?"
            url={FINDMIND_GEFALLEN_URL}
          />
        </div>
      </section>

      <FadenDivider className="mt-xl" />

      {/* Datenschutz-Erklärung */}
      <div className="mt-xl flex items-start gap-sm rounded-xl border border-outline-variant bg-surface-container-low p-md">
        <span className="material-symbols-outlined mt-xs text-[20px] text-tertiary">
          lock
        </span>
        <p className="text-body-sm text-on-surface-variant">
          <strong className="text-on-surface">So funktioniert das Orakel:</strong>{" "}
          Es werden zwei Dinge unterschieden.{" "}
          <strong className="text-on-surface">Ein anonymer Zähler</strong> zählt
          bei jedem besuchten Knoten eine 1 dazu — ohne Namen, ohne Code, nicht
          rückverfolgbar. Diese Zähler ergeben die «Gesamtnutzung aller» und die
          «alle»-Vergleiche; deine Klicks fliessen dort also mit ein, aber nur als
          anonyme Summe.{" "}
          <strong className="text-on-surface">Die Detaildaten</strong> — welche
          Punkte genau du besucht und wie du sie bewertet hast — bleiben allein in
          diesem Browser (localStorage) und werden nirgends personenbezogen
          gespeichert. Fragst du das Orakel, schickt dein Browser der KI
          ausschliesslich diese anonymen Kennzahlen (Zähler, Bewertungs-Summen) —
          keinen Namen, keinen Code, keine Einzeltexte.
        </p>
      </div>
    </div>
  );
}

/* ── Findmind-Umfrage-Karte ───────────────────────────────────────────────── */

function UmfrageKarte({
  icon,
  titel,
  text,
  url,
}: {
  icon: string;
  titel: string;
  text: string;
  url: string;
}) {
  return (
    <div className="flex flex-col rounded-xl border border-outline-variant bg-surface-bright p-md">
      <div className="flex items-center gap-sm">
        <span className="material-symbols-outlined text-[22px] text-tertiary">{icon}</span>
        <h3 className="text-body-lg font-semibold text-on-surface">{titel}</h3>
      </div>
      <p className="mt-sm flex-1 text-body-sm text-on-surface-variant">{text}</p>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-md inline-flex items-center gap-sm self-start rounded-xl bg-tertiary px-lg py-sm text-label-md text-on-tertiary shadow-sm transition hover:bg-on-tertiary-container"
        >
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          Umfrage öffnen
        </a>
      ) : (
        <p className="mt-md rounded-lg border border-dashed border-outline-variant px-sm py-xs text-label-sm text-on-surface-variant">
          Umfrage-Link folgt (Findmind).
        </p>
      )}
    </div>
  );
}
