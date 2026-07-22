"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  castVote,
  loadPollCounts,
  subscribePollCounts,
  totalVotes,
  type PollCounts,
} from "@/lib/polls";
import { FadenDivider } from "../../_components/Gewebe";
import AktivitaetsNetz from "../../_components/AktivitaetsNetz";
import Inhaltsverzeichnis from "../../_components/Inhaltsverzeichnis";
import {
  leseSpuren,
  SPUR_EVENT,
  SPUREN_POLL_ID,
  zieheSpurenAusCloud,
} from "../../_lib/spuren";
import {
  GEWICHT_EVENT,
  leseGewichtungen,
  zieheGewichtungAusCloud,
} from "../../_lib/gewichtung";
import {
  AUSWERTUNG_EVENT,
  leseAuswertung,
  type AuswertungEintrag,
} from "../../_lib/auswertung";

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
const FINDMIND_FEEDBACK_URL = "https://findmind.ch/c/GsVM-ueKo";
const FINDMIND_GEFALLEN_URL = "https://findmind.ch/c/3R8p-jfCD";

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
const BILDER_TOTAL = 11; // Bilderstrecke «Bilder zur KI-Geschichte»
const VIDEO_TOTAL = 3;

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
const KEY_NAME = "ki26-orakel-name";

function summeMitPrefix(counts: PollCounts, prefix: string): number {
  return Object.entries(counts).reduce(
    (s, [id, n]) => (id.startsWith(prefix) ? s + (Number(n) || 0) : s),
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
  const [meineMehr, setMeineMehr] = useState(0);
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
  /* Flächen + Interesse (gemeldet von Teppich & KI-Story) */
  const [auswertung, setAuswertung] = useState<AuswertungEintrag[]>([]);
  /* alle (anonymer Zähler) */
  const [alleSpuren, setAlleSpuren] = useState<PollCounts>({});
  /* Blick-Poll */
  const [blickWahl, setBlickWahl] = useState<string | null>(null);
  const [blickCounts, setBlickCounts] = useState<PollCounts>({});
  /* Teilnehmer-Zahlen (serverseitig gezählt; null = noch nicht/nicht verfügbar) */
  const [teilnehmer, setTeilnehmer] = useState<{
    eingeloggt: number;
    aktivVorhang: number;
    aktivPhilosophie: number;
  } | null>(null);
  /* Orakel */
  const [stil, setStil] = useState<Stil>("wissenschaftlich");
  const [orakel, setOrakel] = useState<Record<Stil, OrakelZustand>>({
    wissenschaftlich: LEER,
    literarisch: LEER,
    fantastisch: LEER,
  });
  /* Interessens-Orakel (die erste der zwei Orakel-Stimmen) */
  const [intOrakel, setIntOrakel] = useState<OrakelZustand>(LEER);
  /* Ausdruck */
  const [name, setName] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* lokale Spuren + Bewertungen lesen + live nachführen */
  const lokalLesen = useCallback(() => {
    const spuren = leseSpuren();
    const proBereich: Record<string, number> = {};
    for (const b of BEREICHE) {
      proBereich[b.prefix] = spuren.filter((s) => s.id.startsWith(b.prefix)).length;
    }
    setMeine(proBereich);
    setMeineWuensche(spuren.filter((s) => s.id.startsWith("wunsch:")).length);
    setMeineMehr(spuren.filter((s) => s.id.startsWith("mehr:")).length);
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
    setAuswertung(leseAuswertung());
  }, []);

  useEffect(() => {
    lokalLesen();
    window.addEventListener(SPUR_EVENT, lokalLesen);
    window.addEventListener(GEWICHT_EVENT, lokalLesen);
    window.addEventListener(AUSWERTUNG_EVENT, lokalLesen);
    window.addEventListener("storage", lokalLesen);
    return () => {
      window.removeEventListener(SPUR_EVENT, lokalLesen);
      window.removeEventListener(GEWICHT_EVENT, lokalLesen);
      window.removeEventListener(AUSWERTUNG_EVENT, lokalLesen);
      window.removeEventListener("storage", lokalLesen);
    };
  }, [lokalLesen]);

  /* Poll-Wahl + Name laden */
  useEffect(() => {
    try {
      setBlickWahl(window.localStorage.getItem(KEY_BLICK));
      setName(window.localStorage.getItem(KEY_NAME) ?? "");
    } catch {
      /* Privatmodus */
    }
  }, []);

  function nameAendern(wert: string) {
    setName(wert);
    try {
      window.localStorage.setItem(KEY_NAME, wert);
    } catch {
      /* Privatmodus */
    }
  }

  /* anonyme Zähler abonnieren (alle) + eigene Cloud-Daten geräteübergreifend
   * zurückholen (Spuren + Bewertungen), damit das Orakel auf jedem Gerät mit
   * demselben Code vollständig ist. */
  useEffect(() => {
    const ab1 = subscribePollCounts(SPUREN_POLL_ID, setAlleSpuren);
    const ab2 = subscribePollCounts(BLICK_POLL_ID, setBlickCounts);
    void loadPollCounts(SPUREN_POLL_ID).then(setAlleSpuren);
    void loadPollCounts(BLICK_POLL_ID).then(setBlickCounts);
    void zieheSpurenAusCloud();
    void zieheGewichtungAusCloud();
    // Teilnehmer-Zahlen serverseitig holen (schlägt lokal ohne Service-Account
    // fehl → bleibt null, der Überblick zeigt dann nur die anonymen Summen).
    void fetch("/api/orakel/teilnehmer")
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.eingeloggt === "number") setTeilnehmer(d);
      })
      .catch(() => {});
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
  /* Wo alle Teilnehmenden am aktivsten waren — Bereiche nach anonymer Summe. */
  const alleTopBereiche = useMemo(
    () =>
      BEREICHE.map((b) => ({ label: b.label, n: summeMitPrefix(alleSpuren, b.prefix) }))
        .filter((x) => x.n > 0)
        .sort((a, b) => b.n - a.n)
        .slice(0, 3),
    [alleSpuren],
  );
  const blickTotal = totalVotes(blickCounts);
  /* Geknüpfte Flächen (Maschen) über alle Weben-Bereiche (Teppich + KI-Story). */
  const flaechenGefuellt = useMemo(
    () => auswertung.reduce((s, a) => s + a.flaechenGefuellt, 0),
    [auswertung],
  );
  const flaechenTotal = useMemo(
    () => auswertung.reduce((s, a) => s + a.flaechenTotal, 0),
    [auswertung],
  );

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
      flaechenGefuellt,
      flaechenTotal,
      interessen: auswertung
        .filter((a) => a.labels.length > 0)
        .map((a) => ({ bereich: a.bereich, labels: a.labels })),
    };
  }, [
    meine,
    meineGesamt,
    meineWuensche,
    meineKombis,
    meineBilder,
    meineVideos,
    bew,
    blickWahl,
    flaechenGefuellt,
    flaechenTotal,
    auswertung,
  ]);

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

  /* Interessens-Orakel: analytische Antwort auf die Interessens-Auswertung. */
  const interesseBefragen = useCallback(async () => {
    setIntOrakel({ text: null, status: "laedt", zufrieden: null });
    try {
      const res = await fetch("/api/orakel/deutung", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ stil: "interesse", aktivitaet: baueAktivitaet() }),
      });
      const data = (await res.json().catch(() => null)) as
        | { text?: string; grund?: string }
        | null;
      if (data?.text) {
        setIntOrakel({ text: data.text, status: "ok", zufrieden: null });
      } else if (data?.grund === "zu-wenig") {
        setIntOrakel({ text: null, status: "zu-wenig", zufrieden: null });
      } else if (data?.grund === "kein-schluessel") {
        setIntOrakel({ text: null, status: "kein-schluessel", zufrieden: null });
      } else {
        throw new Error("leer");
      }
    } catch {
      setIntOrakel({ text: null, status: "fehler", zufrieden: null });
    }
  }, [baueAktivitaet]);

  const aktuell = orakel[stil];

  /* ── Perspektiven-Kacheln ─────────────────────────────────────────────── */
  /* `alle`: die anonyme Aktivität aller (aus den Zählern). `nurDu`: Kennzahl
   *  liegt nur lokal vor (Bewertungen/Flächen) — kein anonymer Vergleich. */
  const perspektiven: {
    icon: string;
    titel: string;
    wert: string;
    text: string;
    alle?: string;
    nurDu?: boolean;
  }[] = [
    {
      icon: "ads_click",
      titel: "Angeklickte Punkte",
      wert: `${meineGesamt} / ${GESAMT_TOTAL}`,
      text: "Knoten hast du auf diesem Gerät geöffnet.",
      alle: `${alleGesamt}× von allen besucht`,
    },
    {
      icon: "dashboard",
      titel: "Flächen geknüpft",
      wert: `${flaechenGefuellt} / ${flaechenTotal || "–"}`,
      text:
        flaechenTotal === 0
          ? "Noch keine Fläche geknüpft — besuche benachbarte Punkte, dann füllen sich Maschen."
          : "Maschen, die du in den Geweben (Teppich, KI-Story, Merkmale, Muster) vollständig geknüpft hast.",
      nurDu: true,
    },
    {
      icon: "imagesmode",
      titel: "Bilder angeschaut",
      wert: `${meineBilder} / ${BILDER_TOTAL}`,
      text: "Bilder der Strecke «Bilder zur KI-Geschichte», die du geöffnet hast.",
      alle: `${summeMitPrefix(alleSpuren, "vorhang-auf:bild")}× von allen geöffnet`,
    },
    {
      icon: "smart_display",
      titel: "Videos geschaut",
      wert: `${meineVideos} / ${VIDEO_TOTAL}`,
      text: "Video-Impulse, die du bis zu Ende angeschaut hast.",
      alle: `${summeMitPrefix(alleSpuren, "video:")}× von allen geschaut`,
    },
    {
      icon: "bookmark_added",
      titel: "Weiterverfolgen",
      wert: `${meineWuensche}`,
      text:
        meineWuensche === 0
          ? "Noch kein «das verfolge ich weiter» gesetzt."
          : "Merkzeichen gesetzt.",
      alle: `${summeMitPrefix(alleSpuren, "wunsch:")}× von allen gesetzt`,
    },
    {
      icon: "menu_book",
      titel: "Mehr gelesen",
      wert: `${meineMehr}`,
      text:
        meineMehr === 0
          ? "Noch keine Vertiefung («Mehr lesen») geöffnet."
          : "Mal hast du «Mehr lesen» geöffnet und in die Tiefe gelesen.",
      alle: `${summeMitPrefix(alleSpuren, "mehr:")}× von allen geöffnet`,
    },
    {
      icon: "favorite",
      titel: "Für dich relevant",
      wert: `${bew.relevanzStark + bew.philoHilft + bew.technikFroh}`,
      text: `Punkte, die dein Leben prägen (${bew.relevanzStark}), Sichtweisen, die dir heute helfen (${bew.philoHilft}), und Technik, über die du froh bist (${bew.technikFroh}).`,
      nurDu: true,
    },
    {
      icon: "do_not_disturb_on",
      titel: "Ohne Bedeutung",
      wert: `${bew.relevanzKaum + bew.philoKeinSinn + bew.technikAbschaffen}`,
      text: `Was du als kaum relevant (${bew.relevanzKaum}), sinnlos (${bew.philoKeinSinn}) oder überflüssig (${bew.technikAbschaffen}) markiert hast.`,
      nurDu: true,
    },
    {
      icon: "sentiment_stressed",
      titel: "Verunsichert dich noch",
      wert: `${bew.verunsichertNochHeute}`,
      text: `Verunsicherungen aus den Epochen, die dich bis heute betreffen. KI-Merkmale, die dir «deutlich» wurden: ${bew.gestaltDeutlich}.`,
      nurDu: true,
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

      {/* Überblick: alle Teilnehmenden — direkt nach der Einleitung */}
      <section
        aria-label="Überblick über alle Teilnehmenden"
        className="mt-lg rounded-xl border border-outline-variant bg-surface-container-low p-md"
      >
        <p className="flex items-center gap-sm text-label-md uppercase tracking-wider text-tertiary">
          <span className="material-symbols-outlined text-[20px]">groups</span>
          Überblick: alle Teilnehmenden
        </p>
        {teilnehmer && (
          <div className="mt-sm flex flex-wrap items-baseline gap-x-lg gap-y-sm">
            <span className="flex items-baseline gap-xs">
              <strong className="text-headline-sm text-on-surface">
                {teilnehmer.eingeloggt.toLocaleString("de-CH")}
              </strong>
              <span className="text-body-sm text-on-surface-variant">
                Teilnehmende insgesamt
              </span>
            </span>
            <span className="flex items-baseline gap-xs">
              <strong className="text-headline-sm text-on-surface">
                {teilnehmer.aktivVorhang.toLocaleString("de-CH")}
              </strong>
              <span className="text-body-sm text-on-surface-variant">auf «Vorhang auf» aktiv</span>
            </span>
            <span className="flex items-baseline gap-xs">
              <strong className="text-headline-sm text-on-surface">
                {teilnehmer.aktivPhilosophie.toLocaleString("de-CH")}
              </strong>
              <span className="text-body-sm text-on-surface-variant">
                auf der Philosophie-Seite aktiv
              </span>
            </span>
          </div>
        )}
        <div className="mt-sm flex flex-wrap items-baseline gap-x-lg gap-y-sm">
          <span className="flex items-baseline gap-xs">
            <strong className="text-headline-sm text-on-surface">
              {gesamtNutzung.toLocaleString("de-CH")}
            </strong>
            <span className="text-body-sm text-on-surface-variant">Interaktionen insgesamt</span>
          </span>
          <span className="flex items-baseline gap-xs">
            <strong className="text-headline-sm text-on-surface">
              {blickTotal.toLocaleString("de-CH")}
            </strong>
            <span className="text-body-sm text-on-surface-variant">
              haben eine Grundhaltung geteilt
            </span>
          </span>
        </div>
        {alleTopBereiche.length > 0 && (
          <p className="mt-sm text-body-sm text-on-surface-variant">
            Am aktivsten waren alle bei:{" "}
            {alleTopBereiche.map((b, i) => (
              <span key={b.label}>
                {i > 0 ? " · " : ""}
                <strong className="text-on-surface">{b.label}</strong> ({b.n}×)
              </span>
            ))}
            .
          </p>
        )}
        <p className="mt-sm text-label-sm text-on-surface-variant">
          Alles anonym gezählt, ohne Namen — die Summe aller Klicks aller
          Teilnehmenden. Einzelne lassen sich hier nicht erkennen.
        </p>
      </section>

      {/* Inhaltsverzeichnis (Navigation) + Klammersymbol oben rechts */}
      <Inhaltsverzeichnis
        className="mt-lg"
        ohneFortschritt
        eintraege={[
          { id: "perspektiven", label: "Perspektiven auf deine Aktivität" },
          { id: "deine-spur", label: "Deine Spur durchs Gewebe" },
          { id: "blick", label: "Wie blickst du heute auf KI?" },
          { id: "orakel-spricht", label: "Das Orakel spricht" },
          { id: "rueckmeldung", label: "Deine Rückmeldung" },
        ]}
      />

      {/* Aktivitätsnetz — dein Weg als Konstellation */}
      <AktivitaetsNetz
        className="mt-xl mb-lg"
        schwebend
        titel="Dein Aktivitätsnetz"
        unterzeile="Was du bisher im Modul getan hast — angeklickte Knoten, geknüpfte Flächen und angeschaute Bilder, zusammen als ein Netz."
      />

      {/* 1 — Perspektiven auf deine Aktivität */}
      <section id="perspektiven" className="mt-xl scroll-mt-24" aria-label="Perspektiven auf deine Aktivität">
        <h2 className="text-headline-md text-on-surface">
          Perspektiven auf deine Aktivität
        </h2>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          Der Gesamtüberblick über deinen Weg. Die Zähler (Punkte, Flächen,
          Bilder, Videos) messen dein Tun; die letzten drei entstehen aus deinen
          eigenen Bewertungen. Weiter unten dann alles pro Aufgabe.
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
              {p.alle && (
                <p className="mt-sm flex items-center gap-xs border-t border-outline-variant/60 pt-sm text-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">groups</span>
                  {p.alle}
                </p>
              )}
              {p.nurDu && (
                <p className="mt-sm flex items-center gap-xs border-t border-outline-variant/60 pt-sm text-label-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant/60">
                    lock
                  </span>
                  Nur bei dir — kein anonymer Vergleich mit allen.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 1b — Was dich besonders interessiert hat (analytisch, aus den
          tatsächlich gewählten Inhalten — oder dem reinen Muster-Bespielen) */}
      {auswertung.some((a) => a.labels.length > 0 || a.flaechenGefuellt > 0) && (
        <section className="mt-xl" aria-label="Was dich besonders interessiert hat">
          <h2 className="text-headline-md text-on-surface">
            Was dich besonders interessiert hat
          </h2>
          <p className="mt-xs text-body-sm text-on-surface-variant">
            Die Inhalte, die du ausgewählt hast — die Grundlage, aus der das
            Orakel dein Interesse deutet.
          </p>
          {!auswertung.some((a) => a.labels.length > 0) && (
            <p className="mt-md rounded-xl border border-outline-variant bg-surface-bright p-md text-body-sm text-on-surface-variant">
              Bisher hast du vor allem die <strong className="text-on-surface">Muster
              bespielt</strong> — {flaechenGefuellt}{" "}
              {flaechenGefuellt === 1 ? "Fläche" : "Flächen"} geknüpft, ohne
              Inhalte zu öffnen. Auch das ist eine Spur, die das Orakel deuten
              kann.
            </p>
          )}
          <div className="mt-md flex flex-col gap-md">
            {auswertung
              .filter((a) => a.labels.length > 0)
              .map((a) => (
                <div
                  key={a.bereich}
                  className="rounded-xl border border-outline-variant bg-surface-bright p-md"
                >
                  <p className="text-label-md uppercase tracking-wider text-tertiary">
                    {a.bereich}
                    <span className="ml-sm normal-case tracking-normal text-on-surface-variant">
                      {a.labels.length}{" "}
                      {a.labels.length === 1 ? "Inhalt" : "Inhalte"}
                    </span>
                  </p>
                  <div className="mt-sm flex flex-wrap gap-xs">
                    {a.labels.map((l, i) => (
                      <span
                        key={`${l}-${i}`}
                        className="rounded-full border border-outline-variant bg-surface-container-low px-sm py-xs text-label-sm text-on-surface"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {/* Das Orakel antwortet direkt auf die Interessens-Auswertung —
              die erste seiner zwei Stimmen (die zweite: die Stil-Deutung
              weiter unten). */}
          <div className="mt-md rounded-xl border border-tertiary/40 bg-tertiary-container/20 p-md">
            {intOrakel.status === "idle" && (
              <div className="flex flex-wrap items-center justify-between gap-sm">
                <p className="flex items-center gap-sm text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px] text-tertiary">
                    insights
                  </span>
                  Das Orakel kann dir dein Interesse kurz deuten.
                </p>
                <button
                  type="button"
                  onClick={() => void interesseBefragen()}
                  className="inline-flex items-center gap-xs rounded-lg bg-tertiary px-md py-xs text-label-md text-on-tertiary shadow-sm transition hover:bg-on-tertiary-container"
                >
                  <span className="material-symbols-outlined text-[16px]">forum</span>
                  Antwort des Orakels
                </button>
              </div>
            )}
            {intOrakel.status === "laedt" && (
              <p className="flex items-center gap-sm text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin text-[18px] text-tertiary">
                  progress_activity
                </span>
                Das Orakel liest dein Interesse …
              </p>
            )}
            {intOrakel.status === "zu-wenig" && (
              <p className="text-body-sm text-on-surface-variant">
                Noch zu wenige Spuren — erkunde erst ein paar Inhalte oder Muster.
              </p>
            )}
            {intOrakel.status === "kein-schluessel" && (
              <p className="text-body-sm text-on-surface-variant">
                Das Orakel schweigt: Auf dem Server ist gerade kein KI-Schlüssel
                hinterlegt.
              </p>
            )}
            {intOrakel.status === "fehler" && (
              <p className="text-body-sm text-error">
                Das Orakel ist gerade nicht erreichbar — versuch es gleich nochmals.
              </p>
            )}
            {intOrakel.status === "ok" && intOrakel.text && (
              <>
                <p className="flex items-center gap-sm text-label-md text-tertiary">
                  <span className="material-symbols-outlined text-[18px]">insights</span>
                  Das Orakel zu deinem Interesse
                </p>
                <p className="mt-xs whitespace-pre-line text-body-md text-on-surface">
                  {intOrakel.text}
                </p>
                <button
                  type="button"
                  onClick={() => void interesseBefragen()}
                  className="mt-sm inline-flex items-center gap-xs rounded-lg px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:text-tertiary"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  Neu deuten
                </button>
              </>
            )}
          </div>
        </section>
      )}

      {/* 2 — Angeklickte Punkte im Detail (du vs alle) */}
      <section id="deine-spur" className="mt-xl scroll-mt-24" aria-label="Angeklickte Punkte im Detail">
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
      <section id="blick" className="mt-xl scroll-mt-24" aria-label="Blick auf KI">
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
      <section id="orakel-spricht" className="mt-xl scroll-mt-24" aria-label="Das Orakel spricht">
        <h2 className="text-headline-md text-on-surface">Das Orakel spricht</h2>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          Das Orakel deutet deine eigene Aktivität in wenigen Sätzen. Wähle eine
          Form — und wenn sie dir nicht zusagt, befrage es in einer anderen. Dazu
          schickt dein Browser nur anonyme Kennzahlen (Zähler, Bewertungen), nie
          deinen Namen.
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

        {/* Ausdruck / PDF — reduzierte Zusammenfassung: Name, Aktivität in
            Zahlen und beide Orakel-Stimmen. Immer verfügbar. */}
        <div className="mt-lg rounded-xl border border-outline-variant bg-surface-container-low p-md">
          <p className="flex items-center gap-sm text-label-md uppercase tracking-wider text-tertiary">
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
            Als PDF ausdrucken
          </p>
          <p className="mt-xs text-body-sm text-on-surface-variant">
            Eine reduzierte Zusammenfassung: dein Name, deine Aktivität in Zahlen
            und die Deutungen des Orakels. Im Druckdialog «Als PDF speichern»
            wählen.
          </p>
          <label htmlFor="orakel-name" className="mt-md block text-body-sm text-on-surface-variant">
            Dein Name für den Ausdruck (bleibt auf diesem Gerät):
          </label>
          <div className="mt-sm flex flex-wrap items-center gap-sm">
            <input
              id="orakel-name"
              type="text"
              value={name}
              onChange={(e) => nameAendern(e.target.value)}
              maxLength={60}
              placeholder="Vor- und Nachname"
              className="min-w-[12rem] flex-1 rounded-xl border border-outline-variant bg-surface-bright px-md py-sm text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:border-tertiary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-sm rounded-xl bg-tertiary px-lg py-sm text-label-md text-on-tertiary shadow-sm transition hover:bg-on-tertiary-container"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              Ausdrucken / PDF
            </button>
          </div>
          {!name.trim() && (
            <p className="mt-xs text-label-sm text-on-surface-variant">
              Tipp: Trage zuerst deinen Namen ein — er erscheint dann auf dem
              Ausdruck.
            </p>
          )}
        </div>
      </section>

      <FadenDivider className="mt-xl" />

      {/* 5 — Rückmeldung: zwei Findmind-Umfragen */}
      <section id="rueckmeldung" className="mt-xl scroll-mt-24" aria-label="Deine Rückmeldung">
        <h2 className="text-headline-md text-on-surface">Deine Rückmeldung</h2>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          Zwei kurze Umfragen helfen uns, das Lernset zu verbessern. Beide sind
          anonym und dauern nur wenige Minuten.
        </p>
        <div className="mt-md flex flex-col gap-lg">
          <UmfrageKarte
            icon="sentiment_satisfied"
            titel="Wie hat dir das Lernset gefallen?"
            text="Ein kurzer Eindruck: Was hat gewirkt, was weniger?"
            url={FINDMIND_GEFALLEN_URL}
          />
          <UmfrageKarte
            icon="rate_review"
            titel="Rückmeldung & Fehler melden"
            text="Konkrete Verbesserungen, Anregungen oder falsche Inhalte? Sag es uns hier."
            url={FINDMIND_FEEDBACK_URL}
          />
        </div>
      </section>

      <FadenDivider className="mt-xl" />

      {/* Datenschutz-Erklärung — ausführlich */}
      <section
        aria-label="Datenschutz"
        className="mt-xl rounded-xl border border-outline-variant bg-surface-container-low p-md sm:p-lg"
      >
        <p className="flex items-center gap-sm text-label-md uppercase tracking-wider text-tertiary">
          <span className="material-symbols-outlined text-[20px]">lock</span>
          So gehen wir mit deinen Daten um
        </p>
        <p className="mt-sm text-body-sm text-on-surface-variant">
          Dieses Lernset kommt <strong className="text-on-surface">ohne Login,
          ohne Namen und ohne Passwort</strong> aus. Trotzdem entstehen Daten —
          und es lohnt sich zu wissen, welche wohin gehen. Es sind vier Ebenen:
        </p>

        <div className="mt-md space-y-sm">
          <div className="rounded-lg border border-outline-variant bg-surface-bright p-md">
            <p className="flex items-center gap-xs text-body-sm font-semibold text-on-surface">
              <span className="material-symbols-outlined text-[18px] text-tertiary">groups</span>
              1 · Anonyme Zähler (der Überblick über alle)
            </p>
            <p className="mt-xs text-body-sm text-on-surface-variant">
              Bei jedem besuchten Knoten, jeder geknüpften Fläche und jeder
              Umfrage-Stimme zählt ein Zähler <strong className="text-on-surface">+1</strong>{" "}
              — <strong className="text-on-surface">ohne Namen, ohne Code, nicht
              rückverfolgbar</strong>. Aus diesen Summen entstehen der Überblick
              «alle Teilnehmenden» und die «du ↔ alle»-Vergleiche. Deine Klicks
              fliessen dort mit ein, aber nur als anonyme Gesamtzahl — niemand
              kann sie dir zuordnen, auch wir nicht.
            </p>
          </div>

          <div className="rounded-lg border border-outline-variant bg-surface-bright p-md">
            <p className="flex items-center gap-xs text-body-sm font-semibold text-on-surface">
              <span className="material-symbols-outlined text-[18px] text-tertiary">badge</span>
              2 · Dein Fortschritt (pseudonym, unter deinem Code)
            </p>
            <p className="mt-xs text-body-sm text-on-surface-variant">
              Damit du auf einem anderen Gerät weitermachen kannst, werden{" "}
              <strong className="text-on-surface">welche Punkte du besucht und wie
              du sie bewertet hast</strong> zusätzlich unter deinem Tier-Code (z.B.
              «BÄR-334») in einer Datenbank (Google Firebase/Firestore)
              gespeichert. Das ist <strong className="text-on-surface">pseudonym</strong>:
              kein Name, keine E-Mail, kein Passwort — der{" "}
              <strong className="text-on-surface">Code ist der Schlüssel</strong>.
              Wer denselben Code eingibt, sieht diesen Fortschritt. Bewahre den
              Code also so auf, dass nur du ihn hast. Reflexionssätze oder
              Einzeltexte werden dabei nicht gespeichert — nur der knappe
              Fortschritt (angetippte Punkte, Bewertungs-Stufen).
            </p>
          </div>

          <div className="rounded-lg border border-outline-variant bg-surface-bright p-md">
            <p className="flex items-center gap-xs text-body-sm font-semibold text-on-surface">
              <span className="material-symbols-outlined text-[18px] text-tertiary">insights</span>
              3 · Was die KI (das Orakel) sieht
            </p>
            <p className="mt-xs text-body-sm text-on-surface-variant">
              Nur wenn du das Orakel <strong className="text-on-surface">ausdrücklich
              befragst</strong>, schickt dein Browser der KI eine{" "}
              <strong className="text-on-surface">anonyme Zusammenfassung in Zahlen</strong>{" "}
              (Zähler, Bewertungs-Summen, die Titel der von dir gewählten Themen) —
              <strong className="text-on-surface"> keinen Namen, keinen Code, keine
              Einzeltexte</strong>. Die KI erhält keinen Zugriff auf die Datenbank
              und speichert nichts; ihre Deutung entsteht im Moment der Anfrage.
            </p>
          </div>

          <div className="rounded-lg border border-outline-variant bg-surface-bright p-md">
            <p className="flex items-center gap-xs text-body-sm font-semibold text-on-surface">
              <span className="material-symbols-outlined text-[18px] text-tertiary">open_in_new</span>
              4 · Die Rückmeldungs-Umfragen (Findmind)
            </p>
            <p className="mt-xs text-body-sm text-on-surface-variant">
              Die beiden Umfragen laufen über den externen Dienst{" "}
              <strong className="text-on-surface">findmind.ch</strong> und sind
              anonym. Sobald du dort etwas eingibst, gelten die
              Datenschutzbestimmungen von Findmind.
            </p>
          </div>
        </div>

        <p className="mt-md text-body-sm text-on-surface-variant">
          <strong className="text-on-surface">Verlust &amp; Kontrolle:</strong> Die
          lokale Kopie auf diesem Gerät geht verloren, wenn du die Website-Daten
          bzw. den Verlauf löschst, im privaten Modus surfst oder Gerät/Browser
          wechselst. Deine Cloud-Kopie unter deinem Code bleibt aber erhalten und
          kehrt zurück, sobald du den Code wieder eingibst. Notierst du den Code
          nie, lässt sich der Fortschritt niemandem — auch dir nicht — erneut
          zuordnen. Willst du deine Deutung dauerhaft behalten, drucke sie aus
          (PDF). Es werden keine Personendaten erhoben; einzig dein selbst
          eingegebener Name für den Ausdruck bleibt lokal auf diesem Gerät.
        </p>
      </section>

      {/* Druck-Stil: beim Drucken nur die Druckansicht zeigen */}
      <style>{`
        @media print {
          body > *:not(#orakel-print-root) { display: none !important; }
          #orakel-print-root { display: block !important; }
        }
      `}</style>

      {/* Druckansicht (Portal auf <body>, damit die App-Rahmen ausgeblendet
          werden können) — reduziert: Name, Aktivität in Zahlen, beide
          Orakel-Stimmen. Immer vorhanden (auch ohne Deutung). */}
      {mounted &&
        createPortal(
          <div
            id="orakel-print-root"
            className="hidden"
            style={{ color: "#111", background: "#fff", padding: "2rem", fontFamily: "Inter, system-ui, sans-serif" }}
          >
            <p style={{ fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", margin: 0 }}>
              Lernumgebung zu KI · Eine ganz neue Partnerschaft · Das Orakel
            </p>
            <h1 style={{ fontSize: "1.6rem", margin: "0.4rem 0 0" }}>Mein Orakel</h1>
            <p style={{ margin: "0.75rem 0 0", fontSize: "1rem" }}>
              <strong>Name:</strong> {name.trim() || "—"}
              {"    "}
              <strong style={{ marginLeft: "1.5rem" }}>Datum:</strong>{" "}
              {new Date().toLocaleDateString("de-CH")}
            </p>

            {/* Aktivitätsnetz als Grafik */}
            <div style={{ margin: "1.25rem 0 0", maxWidth: "26rem" }}>
              <AktivitaetsNetz titel="Dein Aktivitätsnetz" />
            </div>

            {/* Aktivitäts-Boxen */}
            <h2 style={{ fontSize: "1.1rem", margin: "1.5rem 0 0.5rem" }}>Meine Aktivität in Zahlen</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0.5rem",
              }}
            >
              {perspektiven.map((p) => (
                <div
                  key={p.titel}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "0.5rem",
                    padding: "0.55rem 0.65rem",
                  }}
                >
                  <div style={{ fontSize: "0.72rem", color: "#555" }}>{p.titel}</div>
                  <div style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: "0.15rem" }}>{p.wert}</div>
                </div>
              ))}
            </div>

            {intOrakel.status === "ok" && intOrakel.text && (
              <>
                <h2 style={{ fontSize: "1.1rem", margin: "1.75rem 0 0.4rem" }}>
                  Das Orakel zu meinem Interesse
                </h2>
                <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                  {intOrakel.text}
                </p>
              </>
            )}

            {aktuell.status === "ok" && aktuell.text && (
              <>
                <h2 style={{ fontSize: "1.1rem", margin: "1.75rem 0 0.4rem" }}>
                  {STILE.find((s) => s.id === stil)?.label}e Deutung
                </h2>
                <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                  {aktuell.text}
                </p>
              </>
            )}

            {intOrakel.status !== "ok" && aktuell.status !== "ok" && (
              <p style={{ marginTop: "1.5rem", fontSize: "1rem", color: "#444" }}>
                (Befrage das Orakel oben, damit seine Deutungen hier erscheinen.)
              </p>
            )}

            <p style={{ marginTop: "2rem", fontSize: "0.8rem", color: "#666" }}>
              Erstellt im Lernset «Eine ganz neue Partnerschaft». Die Deutungen
              beruhen auf anonymen Kennzahlen der eigenen Aktivität; die
              Detaildaten bleiben auf dem Gerät.
            </p>
          </div>,
          document.body,
        )}
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
      <div className="flex flex-wrap items-center justify-between gap-sm">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-[22px] text-tertiary">{icon}</span>
          <h3 className="text-body-lg font-semibold text-on-surface">{titel}</h3>
        </div>
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-xs rounded-lg border border-outline-variant px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:border-tertiary hover:text-tertiary"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            In neuem Tab
          </a>
        )}
      </div>
      <p className="mt-sm text-body-sm text-on-surface-variant">{text}</p>
      {url ? (
        <div className="mt-md overflow-hidden rounded-lg border border-outline-variant bg-surface">
          <iframe
            src={url}
            title={titel}
            loading="lazy"
            className="block w-full"
            style={{ height: 640, border: 0 }}
          />
        </div>
      ) : (
        <p className="mt-md rounded-lg border border-dashed border-outline-variant px-sm py-xs text-label-sm text-on-surface-variant">
          Umfrage-Link folgt (Findmind).
        </p>
      )}
    </div>
  );
}
