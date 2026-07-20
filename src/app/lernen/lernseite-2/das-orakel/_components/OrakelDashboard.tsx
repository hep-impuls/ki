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
import { leseSpuren, SPUR_EVENT, SPUREN_POLL_ID } from "../../_lib/spuren";
import { GEWICHT_EVENT, leseGewichtungen } from "../../_lib/gewichtung";
import {
  AUSWERTUNG_EVENT,
  leseAuswertung,
  leseAuswertungMap,
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

/* ── Aufgaben-Konfiguration fürs Pro-Aufgabe-Accordion ─────────────────────
 * Jede Aufgabe: Spur-Präfix (besuchte Punkte), Total, optional Flächen-
 * Bereichsschlüssel (aus dem Auswertungs-Store) und Bewertungs-Dimensionen
 * (aus gewichtung.ts, für die Stufen-Verteilung). */
interface RatingDim {
  prefix: string;
  frage: string;
  stufen: [string, string, string];
}
interface Aufgabe {
  prefix: string;
  label: string;
  href: string;
  total: number;
  /** Zähl-Einheit der besuchten Punkte. */
  einheit?: string;
  /** Auswertungs-Schlüssel für Flächen (können mehrere sein). */
  flaechen?: string[];
  ratings?: RatingDim[];
  /** true → keine «besucht»-Zeile (z.B. Einstiegsmuster: nur Flächen). */
  nurFlaechen?: boolean;
}
const AUFGABEN_GRUPPEN: { gruppe: string; href: string; items: Aufgabe[] }[] = [
  {
    gruppe: "Vorhang auf",
    href: "/lernen/lernseite-2/vorhang-auf",
    items: [
      { prefix: "vorhang-auf:story", label: "Die KI-Story", href: "/lernen/lernseite-2/vorhang-auf", total: 22, einheit: "Stationen", flaechen: ["vorhang-auf:story"] },
      { prefix: "vorhang-auf:bild", label: "Bilder zur KI-Geschichte", href: "/lernen/lernseite-2/vorhang-auf", total: BILDER_TOTAL, einheit: "Bilder" },
      {
        prefix: "vorhang-auf:weisheit",
        label: "Merkmale der neuen Akteurin",
        href: "/lernen/lernseite-2/vorhang-auf",
        total: 12,
        einheit: "Merkmale",
        flaechen: ["vorhang-auf:weisheit"],
        ratings: [{ prefix: "vorhang-auf:gestalt", frage: "Macht die Gestalt der KI", stufen: ["unkenntlich", "verschwommen", "deutlich"] }],
      },
      {
        prefix: "vorhang-auf:kontext",
        label: "Die KI im Kontext",
        href: "/lernen/lernseite-2/vorhang-auf",
        total: 12,
        einheit: "Aspekte",
        ratings: [{ prefix: "vorhang-auf:achtsamkeit", frage: "Verdient Achtsamkeit", stufen: ["wenig", "mittel", "viel"] }],
      },
      { prefix: "lernseite-2:gewebe", label: "Einstiegsmuster", href: "/lernen/lernseite-2", total: 0, nurFlaechen: true, flaechen: ["lernseite-2:gewebe", "vorhang-auf:gewebe"] },
    ],
  },
  {
    gruppe: "Philosophische Perspektive",
    href: "/lernen/lernseite-2/philosophische-perspektive",
    items: [
      { prefix: "philosophische-perspektive:einstieg", label: "Was ist Philosophie?", href: "/lernen/lernseite-2/philosophische-perspektive", total: 4, einheit: "Fragen" },
      {
        prefix: "philosophische-perspektive:teppich",
        label: "Der Teppich des Wandels",
        href: "/lernen/lernseite-2/philosophische-perspektive",
        total: 33,
        einheit: "Punkte",
        flaechen: ["philosophische-perspektive:teppich"],
        ratings: [
          { prefix: "philosophische-perspektive:bekanntheit", frage: "War mir bekannt", stufen: ["gar nicht", "etwas", "gut"] },
          { prefix: "philosophische-perspektive:relevanz", frage: "Mein Leben ohne diesen Punkt", stufen: ["kaum", "etwas", "stark"] },
        ],
      },
      {
        prefix: "philosophische-perspektive:epochen",
        label: "Philosophie in Zeiten der Verunsicherung",
        href: "/lernen/lernseite-2/philosophische-perspektive",
        total: 24,
        einheit: "Bausteine",
        ratings: [
          { prefix: "philosophische-perspektive:technikwert", frage: "Diese Technologie", stufen: ["bin froh", "keine Bedeutung", "nie einführen"] },
          { prefix: "philosophische-perspektive:verunsicherung-heute", frage: "Diese Verunsicherung", stufen: ["noch heute", "ein wenig", "gar nicht"] },
          { prefix: "philosophische-perspektive:philo-hilft", frage: "Diese Sichtweise", stufen: ["hilft heute", "neu für mich", "kein Sinn"] },
        ],
      },
    ],
  },
  {
    gruppe: "Das Orakel",
    href: "/lernen/lernseite-2/das-orakel",
    items: [
      { prefix: "video:", label: "Video-Impulse", href: "/lernen/lernseite-2", total: VIDEO_TOTAL, einheit: "Videos" },
    ],
  },
];

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
  /* alle Spur-IDs (roh) + Flächen-Map keyed — fürs Pro-Aufgabe-Accordion */
  const [spurIds, setSpurIds] = useState<string[]>([]);
  const [ausMap, setAusMap] = useState<Record<string, AuswertungEintrag>>({});
  const [offeneAufgabe, setOffeneAufgabe] = useState<Set<string>>(new Set());
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
    setSpurIds(spuren.map((s) => s.id));
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
    setAuswertung(leseAuswertung());
    setAusMap(leseAuswertungMap());
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
      icon: "dashboard",
      titel: "Flächen geknüpft",
      wert: `${flaechenGefuellt} / ${flaechenTotal || "–"}`,
      text:
        flaechenTotal === 0
          ? "Noch keine Fläche geknüpft — besuche im Teppich und in der KI-Story benachbarte Punkte, dann füllen sich Maschen."
          : `Maschen, die du in den Geweben (Teppich, KI-Story, Merkmale, Muster) vollständig geknüpft hast — je mehr benachbarte Punkte du besuchst, desto mehr Flächen entstehen.`,
    },
    {
      icon: "imagesmode",
      titel: "Bilder angeschaut",
      wert: `${meineBilder} / ${BILDER_TOTAL}`,
      text: "Bilder der Strecke «Bilder zur KI-Geschichte», die du im Anschauungsmodus geöffnet hast.",
    },
    {
      icon: "smart_display",
      titel: "Videos geschaut",
      wert: `${meineVideos} / ${VIDEO_TOTAL}`,
      text: "Video-Impulse, die du bis zu Ende angeschaut hast.",
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

  /* ── Helfer fürs Pro-Aufgabe-Accordion ────────────────────────────────── */
  const zaehleSpurPrefix = (prefix: string) =>
    spurIds.filter((id) => id.startsWith(prefix)).length;
  const flaechenVon = (keys?: string[]) =>
    (keys ?? []).reduce(
      (acc, k) => ({
        g: acc.g + (ausMap[k]?.flaechenGefuellt ?? 0),
        t: acc.t + (ausMap[k]?.flaechenTotal ?? 0),
      }),
      { g: 0, t: 0 },
    );
  const ratingVerteilung = (prefix: string): [number, number, number] => {
    const m = leseGewichtungen(prefix);
    const v: [number, number, number] = [0, 0, 0];
    for (const s of Object.values(m)) if (s >= 0 && s <= 2) v[s]++;
    return v;
  };
  const aufgabeAktiv = (a: Aufgabe) =>
    (a.nurFlaechen ? 0 : zaehleSpurPrefix(a.prefix)) +
    flaechenVon(a.flaechen).g +
    (a.ratings ?? []).reduce((s, r) => s + ratingVerteilung(r.prefix).reduce((x, y) => x + y, 0), 0);
  const toggleAufgabe = (p: string) =>
    setOffeneAufgabe((prev) => {
      const nx = new Set(prev);
      if (nx.has(p)) nx.delete(p);
      else nx.add(p);
      return nx;
    });

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

      {/* Gesamtnutzung aller — direkt nach der Einleitung */}
      <div className="mt-lg flex flex-wrap items-center gap-x-lg gap-y-sm rounded-xl border border-outline-variant bg-surface-container-low px-md py-md">
        <span className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-[24px] text-tertiary">groups</span>
          <span className="text-label-md text-on-surface-variant">
            So oft wurde das Lernset schon genutzt
          </span>
        </span>
        <span className="flex items-baseline gap-xs">
          <strong className="text-headline-sm text-on-surface">
            {gesamtNutzung.toLocaleString("de-CH")}
          </strong>
          <span className="text-body-sm text-on-surface-variant">Interaktionen</span>
        </span>
        <span className="flex items-baseline gap-xs">
          <strong className="text-headline-sm text-on-surface">
            {blickTotal.toLocaleString("de-CH")}
          </strong>
          <span className="text-body-sm text-on-surface-variant">
            Teilnehmende mit Grundhaltung
          </span>
        </span>
        <span className="w-full text-label-sm text-on-surface-variant">
          Anonym gezählt, ohne Namen — die Summe aller Klicks aller
          Teilnehmenden.
        </span>
      </div>

      {/* Aktivitätsnetz — dein Weg als Konstellation */}
      <AktivitaetsNetz
        className="mt-xl mb-lg"
        schwebend
        titel="Dein Aktivitätsnetz"
        unterzeile="Was du bisher im Modul getan hast — angeklickte Knoten, geknüpfte Flächen und angeschaute Bilder, zusammen als ein Netz."
      />

      {/* 1 — Perspektiven auf deine Aktivität */}
      <section className="mt-xl" aria-label="Perspektiven auf deine Aktivität">
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

      {/* 2 — Deine Aktivität pro Aufgabe (aufklappbar) */}
      <section className="mt-xl" aria-label="Deine Aktivität pro Aufgabe">
        <h2 className="text-headline-md text-on-surface">
          Deine Aktivität pro Aufgabe
        </h2>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          {meineGesamt} von {GESAMT_TOTAL} Knoten besucht — hier aufgeschlüsselt
          nach Aufgabe. Tippe eine Aufgabe an, um Details zu sehen (besuchte
          Punkte neben den anonymen Zahlen aller, geknüpfte Flächen, deine
          Bewertungen).
        </p>
        <div className="mt-md space-y-lg">
          {AUFGABEN_GRUPPEN.map((grp) => (
            <div key={grp.gruppe}>
              <p className="mb-sm flex items-center gap-xs text-label-md uppercase tracking-wider text-tertiary">
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                {grp.gruppe}
              </p>
              <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-bright">
                {grp.items.map((a, i) => {
                  const offen = offeneAufgabe.has(a.prefix);
                  const besucht = zaehleSpurPrefix(a.prefix);
                  const alle = summeMitPrefix(alleSpuren, a.prefix);
                  const fl = flaechenVon(a.flaechen);
                  const labels = ausMap[a.prefix]?.labels ?? [];
                  const aktiv = aufgabeAktiv(a);
                  const teile: string[] = [];
                  if (!a.nurFlaechen) teile.push(`${besucht}/${a.total} ${a.einheit ?? "Punkte"}`);
                  if (fl.t > 0) teile.push(`${fl.g}/${fl.t} Flächen`);
                  return (
                    <div key={a.prefix} className={i > 0 ? "border-t border-outline-variant" : ""}>
                      <button
                        type="button"
                        onClick={() => toggleAufgabe(a.prefix)}
                        aria-expanded={offen}
                        className="flex w-full items-center gap-sm p-md text-left transition-colors hover:bg-surface-container-low"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-sm">
                            <span className="text-body-sm font-semibold text-on-surface">{a.label}</span>
                            {aktiv > 0 && (
                              <span className="flex h-2 w-2 flex-shrink-0 rounded-full bg-tertiary" aria-hidden />
                            )}
                          </span>
                          <span className="mt-xs block text-label-sm text-on-surface-variant">
                            {teile.length ? teile.join(" · ") : "noch nichts getan"}
                          </span>
                        </span>
                        <span
                          className={
                            "material-symbols-outlined flex-shrink-0 text-[22px] text-on-surface-variant transition-transform duration-300 " +
                            (offen ? "rotate-180" : "")
                          }
                        >
                          expand_more
                        </span>
                      </button>
                      {offen && (
                        <div className="animate-frame-in space-y-sm border-t border-outline-variant/60 px-md pb-md pt-sm">
                          {!a.nurFlaechen && (
                            <div>
                              <div className="flex items-baseline justify-between gap-md text-label-sm">
                                <span className="text-on-surface-variant">Besucht</span>
                                <span className="text-on-surface-variant">
                                  du {besucht}/{a.total} · alle {alle}×
                                </span>
                              </div>
                              <div className="mt-xs h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                                <div
                                  className="h-full rounded-full bg-tertiary transition-[width] duration-500"
                                  style={{ width: `${Math.min(1, a.total ? besucht / a.total : 0) * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                          {fl.t > 0 && (
                            <p className="flex items-center gap-xs text-label-sm text-on-surface-variant">
                              <span className="material-symbols-outlined text-[16px] text-tertiary">dashboard</span>
                              Flächen geknüpft: {fl.g} von {fl.t}
                            </p>
                          )}
                          {(a.ratings ?? []).map((r) => {
                            const v = ratingVerteilung(r.prefix);
                            const bewertet = v[0] + v[1] + v[2];
                            return (
                              <p key={r.prefix} className="text-label-sm text-on-surface-variant">
                                <span className="text-on-surface">{r.frage}:</span>{" "}
                                {bewertet === 0
                                  ? "noch nicht bewertet"
                                  : r.stufen.map((s, si) => `${s} ${v[si]}`).join(" · ")}
                              </p>
                            );
                          })}
                          {labels.length > 0 && (
                            <div className="flex flex-wrap gap-xs pt-xs">
                              {labels.map((l, li) => (
                                <span
                                  key={`${l}-${li}`}
                                  className="rounded-full border border-outline-variant bg-surface-container-low px-sm py-xs text-label-sm text-on-surface"
                                >
                                  {l}
                                </span>
                              ))}
                            </div>
                          )}
                          <a
                            href={a.href}
                            className="inline-flex items-center gap-xs pt-xs text-label-md text-tertiary hover:underline"
                          >
                            Zur Aufgabe
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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

              {/* Ausdrucken — Name eingeben, dann drucken */}
              <div className="mt-lg border-t border-outline-variant/60 pt-md">
                <label
                  htmlFor="orakel-name"
                  className="block text-body-sm text-on-surface-variant"
                >
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
                    Deutung ausdrucken
                  </button>
                </div>
                {!name.trim() && (
                  <p className="mt-xs text-label-sm text-on-surface-variant">
                    Tipp: Trage zuerst deinen Namen ein — er erscheint dann auf dem
                    Ausdruck.
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
          keinen Namen, keinen Code, keine Einzeltexte.{" "}
          <strong className="text-on-surface">Achtung:</strong> Weil diese
          Detaildaten nur in diesem Browser liegen, gehen sie verloren, wenn du
          den Browserverlauf bzw. die Website-Daten löschst, im privaten Modus
          surfst oder das Gerät bzw. den Browser wechselst. Willst du deine
          Deutung behalten, drucke sie aus.
        </p>
      </div>

      {/* Druck-Stil: beim Drucken nur die Druckansicht zeigen */}
      <style>{`
        @media print {
          body > *:not(#orakel-print-root) { display: none !important; }
          #orakel-print-root { display: block !important; }
        }
      `}</style>

      {/* Druckansicht (Portal auf <body>, damit die App-Rahmen ausgeblendet
          werden können). Nur mit vorhandener Deutung. */}
      {mounted &&
        aktuell.status === "ok" &&
        aktuell.text &&
        createPortal(
          <div
            id="orakel-print-root"
            className="hidden"
            style={{ color: "#111", background: "#fff", padding: "2rem", fontFamily: "Inter, system-ui, sans-serif" }}
          >
            <p style={{ fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", margin: 0 }}>
              Lernumgebung zu KI · Eine ganz neue Partnerschaft · Das Orakel
            </p>
            <h1 style={{ fontSize: "1.6rem", margin: "0.4rem 0 0" }}>Meine Orakel-Deutung</h1>
            <p style={{ margin: "0.75rem 0 0", fontSize: "1rem" }}>
              <strong>Name:</strong> {name.trim() || "—"}
              {"    "}
              <strong style={{ marginLeft: "1.5rem" }}>Datum:</strong>{" "}
              {new Date().toLocaleDateString("de-CH")}
            </p>
            <p style={{ margin: "0.25rem 0 0", fontSize: "1rem" }}>
              <strong>Form:</strong> {STILE.find((s) => s.id === stil)?.label}
            </p>

            <h2 style={{ fontSize: "1.1rem", margin: "1.5rem 0 0.4rem" }}>Die Deutung</h2>
            <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.6, whiteSpace: "pre-line" }}>
              {aktuell.text}
            </p>

            <h2 style={{ fontSize: "1.1rem", margin: "1.75rem 0 0.4rem" }}>Meine Aktivität in Zahlen</h2>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "1rem", lineHeight: 1.7 }}>
              {perspektiven.map((p) => (
                <li key={p.titel}>
                  <strong>{p.titel}:</strong> {p.wert}
                </li>
              ))}
            </ul>

            <p style={{ marginTop: "2rem", fontSize: "0.8rem", color: "#666" }}>
              Erstellt im Lernset «Eine ganz neue Partnerschaft». Die Deutung
              beruht auf anonymen Kennzahlen der eigenen Aktivität; die
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
