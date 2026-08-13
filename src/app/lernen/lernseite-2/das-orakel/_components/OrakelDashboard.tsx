"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  castVote,
  loadPollCounts,
  subscribePollCounts,
  totalVotes,
  type PollCounts,
} from "@/lib/polls";
import { FadenDivider } from "../../_components/Gewebe";
import AktivitaetsNetz from "../../_components/AktivitaetsNetz";
import Knotenkarte from "../../_components/Knotenkarte";
import KontextGewichtung from "../../_components/KontextGewichtung";
import Ausklapptext from "../../_components/Ausklapptext";
import Quellenverzeichnis from "../../_components/Quellenverzeichnis";
import Inhaltsverzeichnis from "../../_components/Inhaltsverzeichnis";
import DenkerHover from "../../_components/DenkerHover";
import {
  leseSpuren,
  SPUR_EVENT,
  SPUREN_POLL_ID,
  spurArt,
  type SpurArt,
  zaehleAktivitaet,
  zaehleAlleAusPoll,
  zaehltAnonym,
  zieheSpurenAusCloud,
} from "../../_lib/spuren";
import {
  GEWICHT_EVENT,
  leseGewichtungen,
  zieheGewichtungAusCloud,
} from "../../_lib/gewichtung";
import {
  AUSWERTUNG_EVENT,
  FLAECHEN_POLL_ID,
  leseAuswertung,
  zieheAuswertungAusCloud,
  type AuswertungEintrag,
} from "../../_lib/auswertung";
import { INHALTE_EVENT, leseInhalte, zieheInhalteAusCloud } from "../../_lib/inhalte";
import { leseBlick, schreibeBlick, zieheBlickAusCloud } from "../../_lib/blick";
import { merkeDruck } from "../../_lib/nutzung";
import {
  formatiereWann,
  leseDeutungen,
  schreibeDeutung,
  schreibeStil,
  schreibeZufrieden,
  type GespeicherteDeutung,
} from "../../_lib/deutungen";
import { abschnittFuer, gruppiere, hrefFuer, type Sprung } from "../../_lib/ziele";

/**
 * Orakel-Dashboard (Thema 03) — «erkenne dich selbst».
 *
 * Rundgang durch die eigene Aktivität in diesem Lernset, aus mehreren
 * Perspektiven — verbunden, wo möglich, mit den anonymen Daten aller.
 * Am Schluss deutet die KI (das Orakel) die eigene Aktivität in wenigen
 * Sätzen, wahlweise wissenschaftlich, literarisch oder fantastisch.
 *
 * Datenschutz:
 *  - DEINS (Wege, Bewertungen, Satz) liegt im Browser und wird zusätzlich unter
 *    dem Fortschritts-Code nach Firestore gespiegelt (pseudonym, nicht anonym).
 *  - ALLE ist die anonyme Firebase-Sammlung (Aggregat-Zähler + ausdrücklich
 *    geteilte Sätze) — ohne Namen, ohne Code.
 *  - Fürs Orakel schickt der Browser auf Knopfdruck eine Zusammenfassung der
 *    eigenen Aktivität (Zähler, Bewertungs-Verteilungen, Titel der gewählten
 *    Inhalte) an die KI — ohne Namen, ohne Code. Weil sie zu einer einzelnen
 *    Person gehört, ist sie pseudonym, nicht anonym; im UI so benannt.
 */

/* ── Findmind-Umfragen ─────────────────────────────────────────────────────
 * Sobald die Umfragen in findmind.ch angelegt sind, hier die jeweilige
 * Einbettungs-/Teilen-URL eintragen. Leer = Platzhalter-Hinweis. */
const FINDMIND_FEEDBACK_URL = "https://findmind.ch/c/GsVM-ueKo";
const FINDMIND_GEFALLEN_URL = "https://findmind.ch/c/3R8p-jfCD";

/* ── Bereiche der eigenen Spur (Totale = Anzahl Knoten je Interaktion) ──── */

const BEREICHE: { prefix: string; label: string; total: number; href: string }[] = [
  { prefix: "vorhang-auf:story", label: "Die KI-Story", total: 22, href: "/lernen/lernseite-2/vorhang-auf#ki-story" },
  { prefix: "vorhang-auf:weisheit", label: "Merkmale der neuen Akteurin", total: 12, href: "/lernen/lernseite-2/vorhang-auf#merkmale" },
  { prefix: "vorhang-auf:kontext", label: "Die KI im Kontext", total: 12, href: "/lernen/lernseite-2/vorhang-auf#ki-kontext" },
  { prefix: "philosophische-perspektive:einstieg", label: "Was ist Philosophie?", total: 4, href: "/lernen/lernseite-2/philosophische-perspektive#was-philosophie" },
  { prefix: "philosophische-perspektive:teppich", label: "Der Teppich des Wandels", total: 33, href: "/lernen/lernseite-2/philosophische-perspektive#teppich" },
  { prefix: "philosophische-perspektive:epochen", label: "Philosophie in Zeiten der Verunsicherung", total: 24, href: "/lernen/lernseite-2/philosophische-perspektive#epochen" },
  { prefix: "philosophische-perspektive:denkwege", label: "Wege der Orientierung", total: 4, href: "/lernen/lernseite-2/philosophische-perspektive#denkwege" },
  { prefix: "video:", label: "Video-Impulse", total: 3, href: "/lernen/lernseite-2" },
];

/* ── Seiten des Lernsets ───────────────────────────────────────────────────
 * Für die erste Orakel-Stimme, die sagt, WO man vor allem aktiv war. Der
 * Schlüssel ist der erste Teil des Spur-Präfixes, die Bereiche summieren sich
 * darüber zu Seiten.
 *
 * Die Bezeichnungen sind absichtlich kurz und ohne Gedankenstrich. Die vollen
 * Titel heissen «Vorhang auf — eine neue Akteurin» und «Das Orakel — erkenne
 * dich selbst»; das Modell zitiert, was wir ihm geben, und würde den
 * Gedankenstrich mitschleppen, den die Typografie-Regel verbietet.
 *
 * Die Video-Impulse fehlen mit Absicht: sie liegen auf der Übersichtsseite und
 * sind keine eigene Lernseite. Sie stehen ohnehin als eigene Zahl im Bericht. */
const SEITEN: { schluessel: string; label: string }[] = [
  { schluessel: "vorhang-auf", label: "Vorhang auf" },
  {
    schluessel: "philosophische-perspektive",
    label: "Philosophische Perspektive",
  },
];

const GESAMT_TOTAL = BEREICHE.reduce((s, b) => s + b.total, 0);
const BILDER_TOTAL = 11; // Bilderstrecke «Bilder zur KI-Story»
const VIDEO_TOTAL = 3;

/**
 * Wie viele Merkzeichen «Das verfolge ich weiter» überhaupt möglich sind.
 *
 * Zusammensetzung (Stand 2026-08-08): 22 Stationen der KI-Story · 12 Merkmale ·
 * 11 Bilder zur KI-Story · 33 Punkte im Teppich · 24 Epochen-Bausteine (8 × 3) ·
 * 16 Bilder der Epochen · 20 Denkerinnen und Denker.
 *
 * Handgepflegt, weil das Dashboard eine eigene Seite ist und die Karten der
 * anderen Seiten nicht sehen kann. Damit die Zahl nicht still veraltet, rechnet
 * `node docs/weiterverfolgen-zaehlen.mjs` sie aus den Daten nach und meldet
 * jede Abweichung — bei neuen Bildern, Stationen oder Denkerinnen also dort
 * nachsehen, nicht hier raten.
 */
const WUNSCH_TOTAL = 138;


/* ── Bewertungs-Präfixe (lokal, aus gewichtung.ts) ────────────────────────── */

const P_RELEVANZ = "philosophische-perspektive:relevanz"; // [kaum, etwas, stark]
const P_TECHNIK = "philosophische-perspektive:technikwert"; // [froh, keine Bedeutung, hätte nie]
const P_VERUNSICH = "philosophische-perspektive:verunsicherung-heute"; // [noch heute, ein wenig, gar nicht]
const P_PHILO = "philosophische-perspektive:philo-hilft"; // [hilft, nie so überlegt, kein Sinn]
const P_GESTALT = "vorhang-auf:gestalt"; // [unkenntlich, verschwommen, deutlich]

function zaehleStufe(prefix: string, stufe: number): number {
  return Object.values(leseGewichtungen(prefix)).filter((s) => s === stufe).length;
}

/**
 * Von einer Bewertung zurück zum bewerteten Inhalt.
 *
 * Die Bewertungen liegen als `{index: stufe}` je Präfix. Was der Index bedeutet,
 * hängt an der Komponente, die die Bewertung anbietet — und da liegt eine Falle:
 *
 *  · Teppich und Merkmale zählen den PUNKT (Index = Punkt-Nummer).
 *  · Die drei Epochen-Bausteine zählen die EPOCHE (`index={ei}`), nicht den
 *    Baustein. Die Inhalts-ID der Bausteine ist aber `epochen:{ei*3+ti}`, mit
 *    ti = 0 Technologie, 1 Verunsicherung, 2 Philosophie (Reihenfolge von
 *    BAUSTEINE in VerunsicherungsEpochen.tsx). Ohne diese Umrechnung zeigte
 *    eine Bewertung der Renaissance auf einen Punkt der Antike.
 *
 * `was` benennt, WELCHE Frage so beantwortet wurde — nötig, weil ein Feld drei
 * verschiedene Bewertungen zusammenfasst und ein Punkt mehrfach vorkommen kann.
 */
const BEWERTUNGEN: {
  prefix: string;
  /** Stufe, die als «relevant» bzw. «ohne Bedeutung» gilt. */
  stufe: number;
  /** Feld, in dem der Eintrag erscheint. */
  feld: "relevant" | "ohne";
  was: string;
  inhaltsId: (index: number) => string;
}[] = [
  { prefix: P_RELEVANZ, stufe: 2, feld: "relevant", was: "prägt mein Leben", inhaltsId: (i) => `philosophische-perspektive:teppich:${i}` },
  { prefix: P_PHILO, stufe: 0, feld: "relevant", was: "hilft mir heute", inhaltsId: (i) => `philosophische-perspektive:epochen:${i * 3 + 2}` },
  { prefix: P_TECHNIK, stufe: 0, feld: "relevant", was: "froh über diese Technik", inhaltsId: (i) => `philosophische-perspektive:epochen:${i * 3}` },
  { prefix: P_RELEVANZ, stufe: 0, feld: "ohne", was: "kaum relevant", inhaltsId: (i) => `philosophische-perspektive:teppich:${i}` },
  { prefix: P_PHILO, stufe: 2, feld: "ohne", was: "ergibt für mich keinen Sinn", inhaltsId: (i) => `philosophische-perspektive:epochen:${i * 3 + 2}` },
  { prefix: P_TECHNIK, stufe: 2, feld: "ohne", was: "hätte es nie gebraucht", inhaltsId: (i) => `philosophische-perspektive:epochen:${i * 3}` },
];

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

const KEY_NAME = "ki26-orakel-name";

function summeMitPrefix(counts: PollCounts, prefix: string): number {
  return Object.entries(counts).reduce(
    (s, [id, n]) => (id.startsWith(prefix) ? s + (Number(n) || 0) : s),
    0,
  );
}

/** Nur inhaltliche Punkte zählen (Knoten/Videos): ohne Bildpunkte (`:hs`),
 *  Kanten, geöffnete Bilder und Einstiegsmuster (`:gewebe`). Damit zählt
 *  z.B. «Epochen» nicht die Bild-Hotspots von «epochen-bild» mit und die
 *  Bereichszahlen passen zur Zählweise des Rhizoms. */
function istInhaltsPunkt(id: string): boolean {
  if (id.includes(":gewebe")) return false;
  const art = spurArt(id);
  return art === "punkt" || art === "video";
}

/** Anonyme Zähler mit Präfix, gefiltert nach Spur-Art. */
function summeMitArt(counts: PollCounts, prefix: string, arten: SpurArt[]): number {
  return Object.entries(counts).reduce((s, [id, n]) => {
    if (!id.startsWith(prefix) || id.includes(":gewebe")) return s;
    return arten.includes(spurArt(id)) ? s + (Number(n) || 0) : s;
  }, 0);
}

interface OrakelZustand {
  text: string | null;
  status: "idle" | "laedt" | "ok" | "fehler" | "kein-schluessel" | "zu-wenig";
  zufrieden: boolean | null;
  /** Wann der Text erzeugt wurde (ISO). Eine wiederhergestellte Deutung
   *  beschreibt den Stand von damals; die Zeile «Deutung vom …» sagt das. */
  wann: string | null;
}
const LEER: OrakelZustand = { text: null, status: "idle", zufrieden: null, wann: null };

export default function OrakelDashboard() {
  /* deine Spur (lokal) */
  const [meine, setMeine] = useState<Record<string, number>>({});
  const [meineWuensche, setMeineWuensche] = useState(0);
  const [meineMehr, setMeineMehr] = useState(0);
  const [meineKombis, setMeineKombis] = useState(0);
  const [meineBilder, setMeineBilder] = useState(0);
  const [meineVideos, setMeineVideos] = useState(0);
  /* Angeklickte Punkte (Knoten) nach Spur-Art — gleiche Quelle wie das Rhizom,
   * damit beide Anzeigen dieselbe Zahl zeigen. */
  const [meineKnoten, setMeineKnoten] = useState(0);
  /* Punkte, die noch vertieft werden möchten («das verfolge ich weiter»),
   * je mit Titel, Abschnitt und Adresse (PDF-Liste UND das aufklappbare Feld). */
  const [vertiefteTitel, setVertiefteTitel] = useState<Sprung[]>([]);
  /* Bewertete Punkte für die zwei Bewertungs-Felder. */
  const [bewertet, setBewertet] = useState<{ relevant: Sprung[]; ohne: Sprung[] }>({
    relevant: [],
    ohne: [],
  });
  /* Welches Feld ist aufgeklappt (höchstens eines, wie bei den Abschnitten). */
  const [feldOffen, setFeldOffen] = useState<string | null>(null);
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
  /* alle geknüpften Flächen (anonymer Zähler) — für den Vergleich in der Karte */
  const [alleFlaechen, setAlleFlaechen] = useState<PollCounts>({});
  /* Blick-Poll */
  const [blickWahl, setBlickWahl] = useState<string | null>(null);
  const [blickCounts, setBlickCounts] = useState<PollCounts>({});
  /* Teilnehmer-Zahlen (serverseitig gezählt; null = noch nicht/nicht verfügbar) */
  const [teilnehmer, setTeilnehmer] = useState<{
    teilgenommen: number;
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
      proBereich[b.prefix] = spuren.filter(
        (s) => istInhaltsPunkt(s.id) && s.id.startsWith(b.prefix),
      ).length;
    }
    setMeine(proBereich);
    setMeineWuensche(spuren.filter((s) => s.id.startsWith("wunsch:")).length);
    setMeineMehr(spuren.filter((s) => s.id.startsWith("mehr:")).length);
    setMeineKombis(spuren.filter((s) => s.id.includes(":kanten-")).length);
    setMeineBilder(spuren.filter((s) => spurArt(s.id) === "bild").length);
    setMeineVideos(spuren.filter((s) => s.id.startsWith("video:")).length);
    setMeineKnoten(zaehleAktivitaet().knoten);
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
    const reg = leseInhalte();
    /* Titel aus der Registry; wo sie fehlt (fremder Browser, Inhaltsseite dort
     * nie geöffnet), holt `zieheInhalteAusCloud` unten nach und diese Funktion
     * läuft über INHALTE_EVENT erneut. Ohne Titel kein Eintrag — ein Link
     * «Punkt 4.0» hilft niemandem. */
    const wunschEintraege = spuren
      .filter((s) => s.id.startsWith("wunsch:"))
      .map((s) => {
        const base = s.id.slice(7);
        const titel = reg[base];
        const href = hrefFuer(base);
        return titel && href
          ? { id: base, titel, abschnitt: abschnittFuer(base), href }
          : null;
      })
      .filter((e): e is Sprung => Boolean(e));
    setVertiefteTitel(wunschEintraege);

    /* Die bewerteten Punkte für «Für dich relevant» und «Ohne Bedeutung». */
    const gesammelt: { relevant: Sprung[]; ohne: Sprung[] } = { relevant: [], ohne: [] };
    for (const b of BEWERTUNGEN) {
      for (const [index, stufe] of Object.entries(leseGewichtungen(b.prefix))) {
        if (stufe !== b.stufe) continue;
        const id = b.inhaltsId(Number(index));
        const titel = reg[id];
        const href = hrefFuer(id);
        if (!titel || !href) continue;
        gesammelt[b.feld].push({
          id,
          titel,
          abschnitt: abschnittFuer(id),
          href,
          zusatz: b.was,
        });
      }
    }
    setBewertet(gesammelt);
    setAuswertung(leseAuswertung());
  }, []);

  useEffect(() => {
    lokalLesen();
    /* Die Titel-Registry aus der Cloud nachholen. Das Orakel rendert die
       Inhalts-Komponenten nicht und kennt darum nur, was in DIESEM Browser
       einmal gerendert hat. Ohne diesen Zug blieben die Listen auf einem
       zweiten Gerät leer, obwohl die Merkzeichen da sind. */
    void zieheInhalteAusCloud();
    /* Und die gemeldeten Bereiche selbst. Ohne diesen Zug fehlte auf einem
       zweiten Gerät der ganze Abschnitt «Was dich besonders interessiert hat»
       und mit ihm die erste Orakel-Stimme, die darin steckt. */
    void zieheAuswertungAusCloud();
    window.addEventListener(SPUR_EVENT, lokalLesen);
    window.addEventListener(GEWICHT_EVENT, lokalLesen);
    window.addEventListener(AUSWERTUNG_EVENT, lokalLesen);
    window.addEventListener(INHALTE_EVENT, lokalLesen);
    window.addEventListener("storage", lokalLesen);
    return () => {
      window.removeEventListener(SPUR_EVENT, lokalLesen);
      window.removeEventListener(GEWICHT_EVENT, lokalLesen);
      window.removeEventListener(AUSWERTUNG_EVENT, lokalLesen);
      window.removeEventListener(INHALTE_EVENT, lokalLesen);
      window.removeEventListener("storage", lokalLesen);
    };
  }, [lokalLesen]);

  /* Poll-Wahl + Name laden */
  useEffect(() => {
    try {
      /* Pro Fortschritts-Code, nicht pro Gerät: leseBlick übernimmt einmalig
         den alten Geräte-Eintrag, zieheBlickAusCloud holt die eigene Wahl auf
         einem zweiten Gerät nach (ohne neue Stimme, die steckt schon im
         Zähler). */
      setBlickWahl(leseBlick());
      void zieheBlickAusCloud().then((wahl) => {
        if (wahl) setBlickWahl(wahl);
      });
      setName(window.localStorage.getItem(KEY_NAME) ?? "");
      /* Gespeicherte Deutungen wiederherstellen (pro Code, nur dieses Gerät).
         Der Stil zuerst, damit der Text unter dem Stil steht, in dem er
         erzeugt wurde. */
      const gespeichert = leseDeutungen();
      if (gespeichert.stil) setStil(gespeichert.stil);
      const wieder = (d?: GespeicherteDeutung): OrakelZustand =>
        d
          ? { text: d.text, status: "ok", zufrieden: d.zufrieden, wann: d.wann }
          : LEER;
      if (gespeichert.deutungen.interesse) {
        setIntOrakel(wieder(gespeichert.deutungen.interesse));
      }
      setOrakel({
        wissenschaftlich: wieder(gespeichert.deutungen.wissenschaftlich),
        literarisch: wieder(gespeichert.deutungen.literarisch),
        fantastisch: wieder(gespeichert.deutungen.fantastisch),
      });
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
    const ab3 = subscribePollCounts(FLAECHEN_POLL_ID, setAlleFlaechen);
    void loadPollCounts(SPUREN_POLL_ID).then(setAlleSpuren);
    void loadPollCounts(BLICK_POLL_ID).then(setBlickCounts);
    void loadPollCounts(FLAECHEN_POLL_ID).then(setAlleFlaechen);
    void zieheSpurenAusCloud();
    void zieheGewichtungAusCloud();
    // Teilnehmer-Zahlen serverseitig holen (schlägt lokal ohne Service-Account
    // fehl → bleibt null, der Überblick zeigt dann nur die anonymen Summen).
    void fetch("/api/orakel/teilnehmer")
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.teilgenommen === "number") setTeilnehmer(d);
      })
      .catch(() => {});
    return () => {
      ab1();
      ab2();
      ab3();
    };
  }, []);

  /* abgeleitete Werte */
  const meineGesamt = useMemo(
    () => Object.values(meine).reduce((s, n) => s + n, 0),
    [meine],
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
  /* Alle-Vergleich in derselben Zählweise wie das Rhizom: angeklickte Punkte
   * (Knoten) aus dem Spuren-Poll, Flächen aus dem Flächen-Poll. */
  const allePunkte = useMemo(() => zaehleAlleAusPoll(alleSpuren).punkte, [alleSpuren]);
  const flaechenAlle = useMemo(() => totalVotes(alleFlaechen), [alleFlaechen]);
  /* Vertiefen-Wünsche nach Abschnitt gruppiert (für den PDF-Ausdruck). */
  const vertiefteGruppen = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const e of vertiefteTitel) {
      const arr = m.get(e.abschnitt) ?? [];
      if (!arr.includes(e.titel)) arr.push(e.titel);
      m.set(e.abschnitt, arr);
    }
    return [...m.entries()].map(([abschnitt, titel]) => ({ abschnitt, titel }));
  }, [vertiefteTitel]);

  /* Aktivitäts-Snapshot fürs Orakel bauen */
  const baueAktivitaet = useCallback(() => {
    /* Die Bereichszahlen sind gedeckelt, `meineGesamt` war es nicht. Bei
       Altbestand aus einer früheren Spur-Struktur hätte im Bericht «120 von 114
       Knoten» gestanden, also genau der Unsinn, den die Deckelung eine Zeile
       weiter unten verhindert. Darum die Gesamtzahl aus den gedeckelten Werten
       bilden, nicht aus der Rohsumme. */
    const bereiche = BEREICHE.map((b) => ({
      label: b.label,
      du: Math.min(meine[b.prefix] ?? 0, b.total),
      total: b.total,
    }));
    return {
      knotenDu: bereiche.reduce((n, b) => n + b.du, 0),
      knotenGesamt: GESAMT_TOTAL,
      // Gedeckelt: Spuren aus einer früheren Struktur können den Bereich
      // sonst über 100 Prozent treiben, und die KI deutet dann «8 von 4».
      bereiche,
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
      /* Für die erste Stimme, Absatz 1: auf WELCHER Seite war die Person vor
         allem aktiv. Wir summieren selbst, statt das Modell acht Bereichszahlen
         zu Seiten addieren zu lassen (siehe Decision-Log 2026-08-09: es hat aus
         acht Zahlen schon den falschen Spitzenreiter gelesen). */
      seiten: SEITEN.map((s) => {
        const teile = BEREICHE.filter((b) =>
          b.prefix.startsWith(`${s.schluessel}:`),
        );
        return {
          label: s.label,
          du: teile.reduce(
            (n, b) => n + Math.min(meine[b.prefix] ?? 0, b.total),
            0,
          ),
          total: teile.reduce((n, b) => n + b.total, 0),
        };
      }),
      /* Für die erste Stimme, Absatz 3: die Punkte, die die Person selbst mit
         «Das verfolge ich weiter» markiert hat, mit Titel statt bloss als Zahl.
         Ohne die Titel könnte das Orakel nur «zwei Merkzeichen» sagen und müsste
         sich für einen Vorschlag etwas ausdenken. */
      weiterverfolgt: vertiefteGruppen.map((g) => ({
        abschnitt: g.abschnitt,
        titel: g.titel,
      })),
      /* Für die zweite Stimme: die Haltungs-Urteile mit Titel, gruppiert nach
         dem Etikett («froh über diese Technik», «hätte es nie gebraucht», …).
         Die blossen Zähler `technikFroh`/`technikAbschaffen` sagen, WIE VIEL
         jemand so eingeordnet hat, aber nicht WORAN, und ohne das Woran bleibt
         jede Begründung eine Behauptung. */
      haltung: (() => {
        const m = new Map<string, string[]>();
        for (const e of [...bewertet.relevant, ...bewertet.ohne]) {
          if (!e.zusatz) continue;
          const arr = m.get(e.zusatz) ?? [];
          if (!arr.includes(e.titel)) arr.push(e.titel);
          m.set(e.zusatz, arr);
        }
        return [...m.entries()].map(([urteil, titel]) => ({ urteil, titel }));
      })(),
      /* Die anonymen Sammelzahlen mitgeben, damit die Deutung «du im Verhältnis
         zu allen» sagen kann (Christofs Vorgabe 2026-08-09). Vorher sah die KI
         neben den eigenen Zahlen nur das MÖGLICHE Total, nie das Verhalten der
         anderen; der Vergleich «du ↔ alle» wurde bloss angezeigt, nicht gedeutet.
         Es sind dieselben Zahlen, die auf dieser Seite ohnehin stehen, also kein
         neuer Datenweg und keine neue Datenschutzfrage.
         Absichtlich NICHT dabei: eine Zahl der Teilnehmenden. Die Zähler zählen
         Klicks, nicht Köpfe; was man daraus nicht rechnen darf, sagt die Regel
         `VERGLEICH` in der Route. */
      alle: {
        bereiche: BEREICHE.map((b) => ({
          label: b.label,
          besuche: summeMitArt(alleSpuren, b.prefix, ["punkt", "video"]),
        })).filter((b) => b.besuche > 0),
        blick: BLICK_OPTIONEN.map((o) => ({
          label: o.label,
          stimmen: blickCounts[o.id] ?? 0,
        })).filter((b) => b.stimmen > 0),
        blickStimmen: blickTotal,
      },
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
    alleSpuren,
    blickCounts,
    blickTotal,
    vertiefteGruppen,
    bewertet,
  ]);

  /* Aktionen — Blick-Poll */
  function blickWaehlen(id: string) {
    if (blickWahl) return; // eine Stimme pro Fortschritts-Code
    setBlickWahl(id);
    schreibeBlick(id);
    // Nie aus der Entwicklung zählen (localhost teilt sich die Zähler mit
    // der Produktion).
    if (zaehltAnonym()) void castVote(BLICK_POLL_ID, id);
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
          const wann = schreibeDeutung(welcher, data.text);
          setOrakel((prev) => ({ ...prev, [welcher]: { text: data.text!, status: "ok", zufrieden: null, wann } }));
        } else if (data?.grund === "zu-wenig") {
          setOrakel((prev) => ({ ...prev, [welcher]: { text: null, status: "zu-wenig", zufrieden: null, wann: null } }));
        } else if (data?.grund === "kein-schluessel") {
          setOrakel((prev) => ({ ...prev, [welcher]: { text: null, status: "kein-schluessel", zufrieden: null, wann: null } }));
        } else {
          throw new Error("leer");
        }
      } catch {
        setOrakel((prev) => ({ ...prev, [welcher]: { text: null, status: "fehler", zufrieden: null, wann: null } }));
      }
    },
    [baueAktivitaet],
  );

  function zufriedenSetzen(welcher: Stil, wert: boolean) {
    setOrakel((prev) => ({ ...prev, [welcher]: { ...prev[welcher], zufrieden: wert } }));
    schreibeZufrieden(welcher, wert);
  }

  /* Interessens-Orakel: analytische Antwort auf die Interessens-Auswertung. */
  const interesseBefragen = useCallback(async () => {
    setIntOrakel({ text: null, status: "laedt", zufrieden: null, wann: null });
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
        const wann = schreibeDeutung("interesse", data.text);
        setIntOrakel({ text: data.text, status: "ok", zufrieden: null, wann });
      } else if (data?.grund === "zu-wenig") {
        setIntOrakel({ text: null, status: "zu-wenig", zufrieden: null, wann: null });
      } else if (data?.grund === "kein-schluessel") {
        setIntOrakel({ text: null, status: "kein-schluessel", zufrieden: null, wann: null });
      } else {
        throw new Error("leer");
      }
    } catch {
      setIntOrakel({ text: null, status: "fehler", zufrieden: null, wann: null });
    }
  }, [baueAktivitaet]);

  const aktuell = orakel[stil];

  /* ── Perspektiven-Kacheln ─────────────────────────────────────────────── */
  /* `alle`: die anonyme Aktivität aller (aus den Zählern). `nurDu`: Kennzahl
   *  liegt nur lokal vor (Bewertungen/Flächen) — kein anonymer Vergleich. */
  /**
   * Am stärksten und am schwächsten bearbeitete Abschnitte, nach Anteil des
   * Bereichs (nicht nach absoluter Zahl, sonst gewinnt immer der grösste
   * Abschnitt). Bereiche ohne jede Aktivität stehen bei den schwächsten oben:
   * Gerade das «noch gar nicht» ist der nützliche Hinweis.
   */
  const bereichsAnteile = BEREICHE.map((b) => {
    // Gegen Altbestand aus früheren Strukturen deckeln: mehr als 100 Prozent
    // eines Bereichs kann niemand bearbeitet haben.
    const du = Math.min(meine[b.prefix] ?? 0, b.total);
    return { label: b.label, du, total: b.total, anteil: b.total ? du / b.total : 0 };
  });
  const staerkste = [...bereichsAnteile].sort((a, b) => b.anteil - a.anteil).slice(0, 2);
  const schwaechste = [...bereichsAnteile].sort((a, b) => a.anteil - b.anteil).slice(0, 2);

  /* Steht der Abschnitt der ersten Stimme? Einmal berechnet, weil sowohl die
     Navigation als auch der Abschnitt selbst daran hängen und die beiden nicht
     auseinanderlaufen dürfen. */
  const ersteStimmeDa = auswertung.some(
    (a) => a.labels.length > 0 || a.flaechenGefuellt > 0,
  );

  /* Die drei Felder mit Sprungliste bekommen je einen eigenen Rahmen, damit man
     sieht, dass hier etwas dahinter steckt. Die Farbe folgt der Bedeutung
     (Akzent = weiterverfolgen, positiv = relevant, gedämpft = ohne Bedeutung).
     Farbe allein genügt nicht: Wer Farben schlecht unterscheidet, erkennt das
     Aufklappen am Pfeil und an der Beschriftung «… anzeigen». */
  const RAHMEN = {
    akzent: "border-tertiary/60 bg-tertiary-container/10",
    positiv: "border-primary/50 bg-primary-container/10",
    gedaempft: "border-outline bg-surface-container-low/40",
  } as const;

  const perspektiven: {
    icon: string;
    titel: string;
    wert: string;
    text: string;
    alle?: string;
    nurDu?: boolean;
    /** Rahmenfarbe — nur bei Feldern mit Sprungliste. */
    rahmen?: keyof typeof RAHMEN;
    /** Aufklappbare Liste mit Links zu den Abschnitten. */
    liste?: Sprung[];
  }[] = [
    {
      icon: "ads_click",
      titel: "Angeklickte Punkte",
      wert: `${meineKnoten} / ${GESAMT_TOTAL}`,
      text: "Knoten hast du auf diesem Gerät geöffnet.",
      alle: `${allePunkte}× von allen besucht`,
    },
    {
      icon: "dashboard",
      titel: "Flächen geknüpft",
      wert: `${flaechenGefuellt} / ${flaechenTotal || "–"}`,
      text:
        flaechenTotal === 0
          ? "Noch keine Fläche geknüpft. Besuche benachbarte Punkte, dann füllen sich Maschen."
          : "Maschen, die du in den Geweben (Teppich, KI-Story, Merkmale, Muster) vollständig geknüpft hast.",
      alle: `${flaechenAlle}× von allen geknüpft`,
    },
    {
      icon: "imagesmode",
      titel: "Bilder angeschaut",
      wert: `${meineBilder} / ${BILDER_TOTAL}`,
      text: "Bilder der Strecke «Bilder zur KI-Story», die du geöffnet hast.",
      alle: `${summeMitArt(alleSpuren, "vorhang-auf:bild", ["bild"])}× von allen geöffnet`,
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
      wert: `${meineWuensche} / ${WUNSCH_TOTAL}`,
      text:
        meineWuensche === 0
          ? `Noch kein «das verfolge ich weiter» gesetzt, möglich wären ${WUNSCH_TOTAL}.`
          : `Merkzeichen gesetzt, von ${WUNSCH_TOTAL} möglichen.`,
      alle: `${summeMitPrefix(alleSpuren, "wunsch:")}× von allen gesetzt`,
      rahmen: "akzent",
      liste: vertiefteTitel,
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
      text: `Punkte, die dein Leben prägen (${bew.relevanzStark}), Sichtweisen, die dir heute helfen (${bew.philoHilft}) und Technik, über die du froh bist (${bew.technikFroh}).`,
      nurDu: true,
      rahmen: "positiv",
      liste: bewertet.relevant,
    },
    {
      icon: "do_not_disturb_on",
      titel: "Ohne Bedeutung",
      wert: `${bew.relevanzKaum + bew.philoKeinSinn + bew.technikAbschaffen}`,
      text: `Was du als kaum relevant (${bew.relevanzKaum}), sinnlos (${bew.philoKeinSinn}) oder überflüssig (${bew.technikAbschaffen}) markiert hast.`,
      nurDu: true,
      rahmen: "gedaempft",
      liste: bewertet.ohne,
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
      {/* Warum «Orakel»? — die Metapher erklärt: Antike (Umgang mit Komplexität
          vor der Wissenschaft) und der Grund für den Namen hier (Muster statt
          Allwissen). */}
      <section
        aria-label="Warum Orakel"
        className="rounded-xl border border-outline-variant bg-surface-container-low p-md"
      >
        <p className="flex items-center gap-sm text-label-md uppercase tracking-wider text-tertiary">
          <span className="material-symbols-outlined text-[20px]">account_balance</span>
          Warum «Orakel»?
        </p>
        <div className="mt-sm space-y-sm text-body-md text-on-surface-variant">
          <p>
            Vor über zweieinhalbtausend Jahren stiegen Menschen aus der ganzen
            griechischen Welt nach{" "}
            <DenkerHover
              name="Delphi"
              bio="Heiligtum des Gottes Apollon in Mittelgriechenland, am Hang des Bergs Parnass. Über Jahrhunderte die wichtigste Orakelstätte der griechischen Welt."
            />{" "}
            hinauf, um das berühmteste Orakel der Antike zu befragen. Dort sass
            die Priesterin{" "}
            <DenkerHover
              name="Pythia"
              bio="Titel der Priesterin, die in Delphi für den Gott Apollon sprach. Sie galt als Vermittlerin zwischen Göttern und Menschen; ihre Sprüche waren oft mehrdeutig."
            />{" "}
            auf einem{" "}
            <DenkerHover
              name="Dreifuss"
              bio="Dreibeiniger Kultsitz über der Erdspalte, auf dem die Pythia ihre Sprüche äusserte. In der Antike ein Sinnbild des Heiligtums von Delphi."
            />{" "}
            über einer Erdspalte und gab, oft in dunklen, deutbaren Worten,
            Antwort. Ganze Städte fragten sie, bevor sie in den Krieg zogen oder
            eine Kolonie gründeten. Dem lydischen König{" "}
            <DenkerHover
              name="Krösus"
              bio="Letzter König von Lydien (heute Westtürkei), rund 595 bis 546 v. Chr. Galt als sagenhaft reich, «reich wie Krösus». Sein Feldzug gegen das Perserreich endete mit dem Verlust des eigenen Reichs."
            />{" "}
            soll sie gesagt haben, wenn er über den Grenzfluss ziehe, werde er
            ein grosses Reich zerstören. Er zog los, verlor und zerstörte sein
            eigenes. Das Orakel war ein Ort, an dem eine unübersichtliche Welt
            gedeutet wurde, lange bevor es Wissenschaft gab.
          </p>
          <p>
            Über dem Tempeleingang stand «Erkenne dich selbst». Für den
            Philosophen{" "}
            <DenkerHover
              name="Sokrates"
              bio="Griechischer Philosoph in Athen, rund 469 bis 399 v. Chr. Bekannt für hartnäckiges Nachfragen und den Satz «Ich weiss, dass ich nichts weiss». Überliefert ist er vor allem durch seinen Schüler Platon."
            />{" "}
            wurde dieser Satz zur Lebensaufgabe. Als das Orakel ihn den weisesten
            Menschen nannte, verstand er das so, dass echte Weisheit darin liegt,
            die eigenen Grenzen zu kennen. Aus der Götterbefragung wurde damit
            eine Aufforderung, sich selbst zu prüfen. Genau darum geht es auch
            hier: nicht um eine höhere Wahrheit, sondern um einen ehrlichen Blick
            auf den eigenen Weg.
          </p>
          <p>
            Wir nennen diesen Rückblick trotzdem «Orakel», aber aus einem anderen
            Grund. Seine Deutungen kommen nicht aus dem allwissenden Blick der
            Götter. Sie sind musterhaft, genau wie die KI arbeitet. Wo die Pythia
            Zeichen deutete, erkennt die KI Muster in den gesammelten Spuren und
            spiegelt sie dir zurück. Kein höheres Wissen, sondern erkannte
            Regelmässigkeit. Und wie schon in Delphi gilt: entscheiden musst am
            Ende du selbst.
          </p>
        </div>
      </section>

      {/* 0 — Was passiert hier? */}
      <section aria-label="Worum es hier geht" className="mt-lg">
        <p className="text-body-lg text-on-surface-variant">
          Hier laufen deine Spuren zusammen. Das Orakel zeigt, was du in diesem
          Lernset getan hast: <strong className="text-on-surface">wo du
          weitergehen möchtest</strong>, was du{" "}
          <strong className="text-on-surface">vertieft</strong> hast, wo du{" "}
          <strong className="text-on-surface">Relevanz</strong> sahst und was
          für dich <strong className="text-on-surface">ohne Bedeutung</strong>{" "}
          blieb, welche Punkte du angeklickt und ob du die Aktivitäten im Muster
          verbunden hast. Mehrere Perspektiven auf dieselben Daten, jeweils, wo
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
                {teilnehmer.teilgenommen.toLocaleString("de-CH")}
              </strong>
              <span className="text-body-sm text-on-surface-variant">
                in diesem Lernset aktiv
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
        <p className="mt-sm text-label-sm text-on-surface-variant">
          Gezählt wird pro Fortschritts-Code, der hier mindestens eine Aktivität
          gemacht hat. Wer sich nur eingeloggt, aber nichts geöffnet hat, zählt
          nicht mit. Jede Person zählt so einmal, ganz ohne Namen.
        </p>
      </section>

      {/* Inhaltsverzeichnis (Navigation) + Klammersymbol oben rechts.
          Die einzige Navigation dieser Seite; in `page.tsx` stand dieselbe
          Liste ein zweites Mal.

          Die erste Orakel-Stimme kommt nur in die Liste, wenn ihr Abschnitt
          auch gerendert wird. Er hängt an gewählten Inhalten oder geknüpften
          Flächen, und ein Eintrag ohne Ziel wäre ein Blindgänger: Der Sprung
          sucht per getElementById, findet nichts und tut still nichts. */}
      <Inhaltsverzeichnis
        className="mt-lg"
        ohneFortschritt
        eintraege={[
          { id: "perspektiven", label: "Perspektiven auf deine Aktivität" },
          ...(ersteStimmeDa
            ? [
                {
                  id: "orakel-erste-stimme",
                  label: "Das Orakel spricht, erste Stimme",
                },
              ]
            : []),
          { id: "deine-spur", label: "Deine Spur durchs Gewebe" },
          { id: "knotenkarte", label: "Knotenkarte der Inhalte" },
          { id: "achtsamkeit", label: "Achtsamkeit auf die Kontexte" },
          { id: "blick", label: "Wie blickst du heute auf KI?" },
          { id: "orakel-spricht", label: "Das Orakel spricht, zweite Stimme" },
          { id: "rueckmeldung", label: "Deine Rückmeldung" },
        ]}
      />

      {/* Aktivitätsnetz — dein Weg als wachsendes Rhizom */}
      <AktivitaetsNetz
        className="mt-xl mb-lg"
        schwebend
        titel="Dein Aktivitäts-Rhizom"
        unterzeile="Aus einer Wurzel wächst dein Tun: vier Triebe (Punkte, Flächen, Bildpunkte, Videos) verzweigen sich. Im Hintergrund das Rhizom aller, im Vordergrund deins."
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
              className={
                "rounded-xl border p-md " +
                (p.rahmen ? RAHMEN[p.rahmen] : "border-outline-variant bg-surface-bright")
              }
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
              {p.liste && p.liste.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => setFeldOffen(feldOffen === p.titel ? null : p.titel)}
                    aria-expanded={feldOffen === p.titel}
                    className="mt-sm inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright px-md py-xs text-label-sm text-on-surface-variant transition-colors hover:border-tertiary hover:text-tertiary"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {feldOffen === p.titel ? "expand_less" : "expand_more"}
                    </span>
                    {feldOffen === p.titel
                      ? "Liste schliessen"
                      : `${p.liste.length === 1 ? "Punkt" : "Punkte"} anzeigen`}
                  </button>
                  {feldOffen === p.titel && (
                    <div className="animate-frame-in mt-sm space-y-sm border-t border-outline-variant/60 pt-sm">
                      {gruppiere(p.liste).map((g) => (
                        <div key={g.abschnitt}>
                          <p className="text-label-sm uppercase tracking-wider text-on-surface-variant opacity-70">
                            {g.abschnitt}
                          </p>
                          <ul className="mt-xs space-y-xs">
                            {g.posten.map((s, i) => (
                              <li key={`${s.id}-${s.zusatz ?? ""}-${i}`}>
                                <Link
                                  href={s.href}
                                  className="group flex items-start gap-xs text-body-sm text-on-surface hover:text-tertiary"
                                >
                                  <span className="material-symbols-outlined mt-0.5 flex-shrink-0 text-[16px] text-tertiary">
                                    arrow_forward
                                  </span>
                                  <span className="min-w-0">
                                    <span className="underline decoration-outline-variant underline-offset-2 group-hover:decoration-tertiary">
                                      {s.titel}
                                    </span>
                                    {s.zusatz && (
                                      <span className="ml-xs text-label-sm text-on-surface-variant">
                                        · {s.zusatz}
                                      </span>
                                    )}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <p className="flex items-start gap-xs text-label-sm text-on-surface-variant opacity-80">
                        <span className="material-symbols-outlined mt-px text-[14px]">info</span>
                        Der Link öffnet den Abschnitt an der richtigen Stelle. Den einzelnen
                        Punkt suchst du dort noch selbst.
                      </p>
                    </div>
                  )}
                </>
              )}
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
                  Nur bei dir, kein anonymer Vergleich mit allen.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 1b — Was dich besonders interessiert hat (analytisch, aus den
          tatsächlich gewählten Inhalten — oder dem reinen Muster-Bespielen) */}
      {ersteStimmeDa && (
        <section
          className="mt-xl"
          aria-label="Was dich besonders interessiert hat und die erste Orakel-Stimme"
        >
          <h2 className="text-headline-md text-on-surface">
            Was dich besonders interessiert hat
          </h2>
          <p className="mt-xs text-body-sm text-on-surface-variant">
            Die Inhalte, die du ausgewählt hast: die Grundlage, aus der das
            Orakel dein Interesse deutet.
          </p>
          {!auswertung.some((a) => a.labels.length > 0) && (
            <p className="mt-md rounded-xl border border-outline-variant bg-surface-bright p-md text-body-sm text-on-surface-variant">
              Bisher hast du vor allem die <strong className="text-on-surface">Muster
              bespielt</strong>: {flaechenGefuellt}{" "}
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

        </section>
      )}

      {/* Die erste Orakel-Stimme als EIGENER Abschnitt, gebaut wie die zweite:
          Hauptüberschrift «Das Orakel spricht», darunter die Kleinzeile mit der
          Stimme und ihrem Gegenstand.

          Zwei Meldungen Christofs vom 2026-08-09 führen hierher. Erstens sass
          der Sprung-Anker am Abschnitt «Was dich besonders interessiert hat»;
          die Stimme steht an seinem Fuss, also landete der Sprung oben und der
          angeklickte Titel weit unten im Bild. Ein Navigationseintrag muss das
          an den obersten Rand bringen, was er benennt. Zweitens war die erste
          Stimme nur eine Kleinzeile in einer Karte, während die zweite eine
          Hauptüberschrift trug: zwei Stimmen desselben Orakels, ungleich
          gewichtet. Beides löst derselbe Schnitt. */}
      {ersteStimmeDa && (
        <section
          id="orakel-erste-stimme"
          className="mt-xl scroll-mt-24"
          aria-label="Das Orakel spricht, erste Stimme"
        >
          <h2 className="text-headline-md text-on-surface">Das Orakel spricht</h2>
          <p className="mt-xs text-label-md uppercase tracking-wider text-tertiary">
            Erste Stimme: wo du warst und was noch lohnt
          </p>
          <p className="mt-xs max-w-3xl text-body-sm text-on-surface-variant">
            In einfacher Sprache und drei Absätzen: wo du vor allem aktiv warst,
            was du bevorzugt hast, und was sich für dich noch lohnt. Grundlage
            sind deine Zahlen und die Inhalte, die du oben ausgewählt hast.
          </p>
          <div className="relative mt-md overflow-hidden rounded-xl border border-tertiary/40 bg-surface-bright">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/art/orakel-umgebung-2.webp"
              alt=""
              aria-hidden
              loading="lazy"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
            />
            <div className="relative p-md">
            <div>
            {intOrakel.status === "idle" && (
              <div className="flex flex-wrap items-center justify-between gap-sm">
                <p className="flex items-center gap-sm text-body-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px] text-tertiary">
                    insights
                  </span>
                  Bereit für die erste Stimme?
                </p>
                <button
                  type="button"
                  onClick={() => void interesseBefragen()}
                  className="orakel-glitzer relative inline-flex items-center gap-xs overflow-hidden rounded-lg bg-tertiary px-md py-xs text-label-md text-on-tertiary shadow-sm transition hover:bg-on-tertiary-container"
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
                Noch zu wenige Spuren. Erkunde erst ein paar Inhalte oder Muster.
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
                Das Orakel ist gerade nicht erreichbar, versuch es gleich nochmals.
              </p>
            )}
            {intOrakel.status === "ok" && intOrakel.text && (
              <>
                <p className="whitespace-pre-line text-body-lg text-on-surface">
                  {intOrakel.text}
                </p>
                <div className="mt-sm flex flex-wrap items-center gap-md">
                  {intOrakel.wann && (
                    /* Eine wiederhergestellte Deutung beschreibt den Stand von
                       damals; das Datum macht das sichtbar. */
                    <span className="text-label-sm text-on-surface-variant opacity-80">
                      Deutung vom {formatiereWann(intOrakel.wann)}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => void interesseBefragen()}
                    className="inline-flex items-center gap-xs rounded-lg px-sm py-xs text-label-md text-on-surface-variant transition-colors hover:text-tertiary"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    Neu deuten
                  </button>
                </div>
              </>
            )}
            </div>
            </div>
          </div>
        </section>
      )}

      {/* 2 — Angeklickte Punkte im Detail (du vs alle) */}
      <section id="deine-spur" className="mt-xl scroll-mt-24" aria-label="Angeklickte Punkte im Detail">
        <h2 className="text-headline-md text-on-surface">
          Deine Spur durchs Gewebe
        </h2>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          {meineGesamt} von {GESAMT_TOTAL} Knoten hast du besucht; daneben
          steht, wie oft alle zusammen dort waren. Tippe einen Bereich an, um dorthin
          zurückzukehren.
        </p>
        <div className="mt-md overflow-hidden rounded-xl border border-outline-variant bg-surface-bright">
          {BEREICHE.map((b, i) => {
            // Gedeckelt, damit kein Balken über die Marke hinausläuft und nicht
            // «du 8/4» steht (Altbestand früherer Spur-Strukturen).
            const mein = Math.min(meine[b.prefix] ?? 0, b.total);
            const alle = summeMitArt(alleSpuren, b.prefix, ["punkt", "video"]);
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

      {/* 3b — Knotenkarte: die stärksten Inhalte je Register (max. 5, mehr nur
          ab >40 Klicks), Bereiche farblich getrennt (wie die Rhizom-Triebe) */}
      <section id="knotenkarte" className="mt-xl scroll-mt-24" aria-label="Knotenkarte der Inhalte">
        <h2 className="text-headline-md text-on-surface">Knotenkarte der Inhalte</h2>
        <p className="mt-xs max-w-3xl text-body-sm text-on-surface-variant">
          Die stärksten Knoten im Gewebe: je grösser der Punkt, desto häufiger.
          Gezeigt werden höchstens fünf pro Register, darüber hinaus nur, was
          über 40-mal angeklickt wurde. Jeder Bereich in seiner Farbe.
        </p>
        <Knotenkarte className="mt-md" />
      </section>

      <FadenDivider className="mt-xl" />

      {/* 3c — Achtsamkeit auf die Kontexte: deine Gewichtung neben der aller */}
      <section id="achtsamkeit" className="mt-xl scroll-mt-24" aria-label="Achtsamkeit auf die Kontexte">
        <h2 className="text-headline-md text-on-surface">Achtsamkeit auf die Kontexte</h2>
        <p className="mt-xs max-w-3xl text-body-sm text-on-surface-variant">
          Bei «Die KI im Kontext» hast du für jeden Aspekt gewählt, wie viel
          Achtsamkeit er verdient. Hier steht deine Wahl neben der Verteilung
          aller Nutzenden.
        </p>
        <KontextGewichtung className="mt-md" />
      </section>

      <FadenDivider className="mt-xl" />

      {/* Blick-Umfrage — direkt VOR dem zweiten Orakel, denn die selbst
          gewählte Grundhaltung ist dessen Hauptquelle. Erst fragen, dann
          deuten (Christofs Vorgabe 2026-08-09; vorher stand die Umfrage weit
          unten bei den Findmind-Umfragen, und das Orakel musste auf eine Wahl
          verweisen, die man noch gar nicht gesehen hatte). */}
      <section id="blick" className="mt-xl scroll-mt-24" aria-label="Blick auf KI">
        <h2 className="text-headline-md text-on-surface">
          Wie blickst du heute auf KI?
        </h2>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          {blickWahl
            ? `${blickTotal} ${blickTotal === 1 ? "Stimme" : "Stimmen"} insgesamt, deine ist markiert.`
            : "Wähle eine Haltung, danach siehst du, wie alle geantwortet haben. Das Orakel unten bezieht deine Wahl in seine Deutung ein."}
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
        <p className="mt-xs text-label-md uppercase tracking-wider text-tertiary">
          Zweite Stimme: wie du mit der KI in die Zukunft gehst
        </p>
        <p className="mt-xs text-body-sm text-on-surface-variant">
          Was für ein KI-Typ bist du? Das Orakel liest aus deinen Einordnungen,
          ob du die KI eher zuversichtlich siehst oder eher als Gefahr, und sagt
          dir kurz, woran es das festmacht. Es ist eine Lesart deiner Klicks,
          kein Urteil über dich. Wähle eine Form, und wenn sie dir nicht zusagt,
          befrage es in einer anderen. Dazu schickt dein Browser eine
          Zusammenfassung deiner Aktivität: Zähler, Bewertungen und die Titel der
          Punkte, die du gewählt hast. Ohne Namen und ohne deinen
          Fortschritts-Code.
        </p>

        {/* Stil-Wahl */}
        <div className="mt-md grid grid-cols-1 gap-sm sm:grid-cols-3">
          {STILE.map((s) => {
            const aktivGewaehlt = stil === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setStil(s.id);
                  schreibeStil(s.id);
                }}
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

        {/* Befragen / Ergebnis — Ambient: KI-Aquarell als stille Umgebung */}
        <div className="relative mt-md overflow-hidden rounded-xl border border-tertiary/40 bg-surface-bright">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/art/orakel-umgebung-4.webp"
            alt=""
            aria-hidden
            loading="lazy"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div className="relative p-lg">
          {aktuell.status === "idle" && (
            <div className="flex flex-col items-start gap-sm">
              <p className="text-body-md text-on-surface-variant">
                Bereit für die <strong className="text-on-surface">{STILE.find((s) => s.id === stil)?.label.toLowerCase()}e</strong>{" "}
                Antwort auf die Frage, was für ein KI-Typ du bist?
              </p>
              <button
                type="button"
                onClick={() => void orakelBefragen(stil)}
                className="orakel-glitzer relative inline-flex items-center gap-sm overflow-hidden rounded-xl bg-tertiary px-lg py-sm text-label-md text-on-tertiary shadow-sm transition hover:bg-on-tertiary-container"
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
              Das Orakel liest deine Haltung …
            </p>
          )}

          {aktuell.status === "zu-wenig" && (
            <p className="text-body-md text-on-surface-variant">
              Dafür braucht das Orakel erst deine Einordnungen. Wähle gleich
              oberhalb deine Grundhaltung zur KI, oder bewerte im «Teppich des
              Wandels» und bei «Philosophie in Zeiten der Verunsicherung», dann
              kehr zurück.
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
              {aktuell.wann && (
                <p className="mt-sm text-label-sm text-on-surface-variant opacity-80">
                  Deutung vom {formatiereWann(aktuell.wann)}
                </p>
              )}

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
                    Schön, das Orakel hat dich gesehen.
                  </p>
                ) : (
                  <p className="text-body-sm text-on-surface-variant">
                    Kein Problem, wähle oben eine{" "}
                    <strong className="text-on-surface">andere Form</strong> des
                    Orakels und befrage es erneut.
                  </p>
                )}
              </div>
            </>
          )}
          </div>
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
              onClick={() => {
                // Anonym mitzählen, wie oft ein Ausdruck gestartet wird. Ob
                // daraus wirklich ein gespeichertes PDF wird, weiss der Browser
                // uns nicht zu sagen — der Druckdialog gehört dem System.
                merkeDruck();
                window.print();
              }}
              className="inline-flex items-center gap-sm rounded-xl bg-tertiary px-lg py-sm text-label-md text-on-tertiary shadow-sm transition hover:bg-on-tertiary-container"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              Ausdrucken / PDF
            </button>
          </div>
          {!name.trim() && (
            <p className="mt-xs text-label-sm text-on-surface-variant">
              Tipp: Trage zuerst deinen Namen ein, er erscheint dann auf dem
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

      {/* Quellenverzeichnis — die geprüften Belege, Details im Accordion */}
      <Quellenverzeichnis className="mt-xl" />

      {/* Datenschutz — das Wesentliche, Details im Accordion */}
      <section
        aria-label="Datenschutz"
        className="mt-xl rounded-xl border border-outline-variant bg-surface-container-low p-md sm:p-lg"
      >
        <p className="flex items-center gap-sm text-label-md uppercase tracking-wider text-tertiary">
          <span className="material-symbols-outlined text-[20px]">lock</span>
          Datenschutz in Kürze
        </p>
        <p className="mt-sm text-body-sm text-on-surface-variant">
          Du meldest dich nur mit einem <strong className="text-on-surface">Code</strong>{" "}
          an (z.B. «QWEN-34R»): <strong className="text-on-surface">kein Name,
          keine E-Mail, kein Passwort</strong>. Namen werden nirgends erhoben.
          Anonym ist das aber nicht, sondern{" "}
          <strong className="text-on-surface">pseudonym</strong>: Unter deinem
          Code werden dein Fortschritt, deine Spuren und deine Bewertungen
          gespeichert, damit sie auf einem anderen Gerät wieder verfügbar sind.
          Wer deinen Code kennt, sieht diesen Fortschritt. Bewahre ihn also für
          dich auf.
        </p>

        <Ausklapptext className="mt-sm" titel="Datenschutz im Detail">
          <ul className="ml-md list-disc space-y-xs text-body-sm text-on-surface-variant">
            <li>
              <strong className="text-on-surface">Anonyme Zähler:</strong> Jeder
              Klick zählt <strong className="text-on-surface">+1</strong> auf einen
              Zähler ohne Code. Daraus entstehen «alle», Knotenkarte und Rhizom.
              Nicht rückverfolgbar.
            </li>
            <li>
              <strong className="text-on-surface">Dein Fortschritt:</strong> welche
              Punkte du besucht, welche Inhalte du ausgewählt und wie du bewertet
              hast, liegt zusätzlich unter deinem Code in der Cloud (Google
              Firebase), damit du geräteübergreifend weitermachen kannst. Keine
              Reflexionstexte, keine Einzelantworten.
            </li>
            <li>
              <strong className="text-on-surface">Klassencode (optional):</strong>{" "}
              Gibst du den Klassencode deiner Lehrperson ein, wird dein Code der
              Klasse zugeordnet, weiterhin ohne deinen Namen.
            </li>
            <li>
              <strong className="text-on-surface">Das Orakel:</strong> bekommt nur
              auf Knopfdruck eine Zusammenfassung deiner Aktivität, nämlich Zähler,
              Bewertungen und die Titel der Punkte, die du gewählt hast. Ohne
              Namen und ohne deinen Code. Verarbeitet wird sie vom KI-Dienst
              Anthropic (Modell Claude Haiku), einzig um den Deutungstext zu
              erzeugen. Wir speichern die Anfrage nicht und es entsteht kein
              Profil daraus. Weil die Zusammenfassung zu einer einzelnen Person
              gehört, nennen wir sie <em>pseudonym</em>, nicht anonym.
            </li>
            <li>
              <strong className="text-on-surface">Video-Impulse:</strong> laufen über
              YouTube im Modus «nocookie». Der Player wird schon beim Laden der
              Seite eingebunden, deshalb erfährt YouTube davon, auch wenn du nicht
              abspielst. Cookies setzt er in diesem Modus keine.
            </li>
            <li>
              <strong className="text-on-surface">Findmind-Umfragen:</strong> laufen
              extern über findmind.ch und ohne deinen Code. Für sie gilt die
              Datenschutzerklärung von Findmind.
            </li>
            <li>
              <strong className="text-on-surface">Löschen &amp; Kontrolle:</strong>{" "}
              Am Ende jeder Seite kannst du deine Aktivitäten zurücksetzen, lokal
              und im Cloud-Spiegel. Die lokale Kopie geht ausserdem bei gelöschtem
              Verlauf, Privatmodus oder Gerätewechsel verloren; die Cloud-Kopie
              kehrt mit deinem Code zurück. Die Deutungen des Orakels bleiben
              nur auf diesem Gerät gespeichert und kommen nicht in die Cloud;
              willst du sie dauerhaft behalten, drucke sie als PDF aus.
            </li>
          </ul>
        </Ausklapptext>
      </section>

      {/* Glitzern der beiden Orakel-Buttons: ein heller Schimmer wandert durch,
          dazu ein sanftes Pulsieren im Tertiär-Ton — damit sie nicht übersehen
          werden. Bei «reduzierter Bewegung» statisch (nur ein leichtes Leuchten). */}
      <style>{`
        @keyframes orakelSchimmer {
          0%   { transform: translateX(-160%) skewX(-18deg); }
          100% { transform: translateX(320%) skewX(-18deg); }
        }
        @keyframes orakelGlow {
          0%, 100% { box-shadow: 0 1px 3px rgb(0 0 0 / 0.14); }
          50%      { box-shadow: 0 0 18px rgb(var(--color-tertiary) / 0.6); }
        }
        .orakel-glitzer { animation: orakelGlow 2.6s ease-in-out infinite; }
        .orakel-glitzer::before {
          content: "";
          position: absolute;
          top: 0; bottom: 0; left: 0;
          width: 45%;
          background: linear-gradient(100deg, transparent 0%, rgb(255 255 255 / 0.65) 50%, transparent 100%);
          filter: blur(1px);
          animation: orakelSchimmer 2.6s ease-in-out infinite;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .orakel-glitzer { animation: none; box-shadow: 0 0 12px rgb(var(--color-tertiary) / 0.5); }
          .orakel-glitzer::before { display: none; }
        }
      `}</style>

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

            {/* Aktivitätsnetz als Grafik. `breakInside: avoid`, weil ein quer
                durchgeschnittenes SVG der hässlichste aller Umbrüche ist: Läuft
                Seite 1 über (anderes Papier, andere Skalierung, längere Texte),
                rutscht der ganze Block auf die nächste Seite statt zu reissen.
                Christofs Meldung 2026-08-09: «pdf-Seiten z.T. falsch
                umbrochen». */}
            <div
              style={{
                margin: "1.25rem 0 0",
                maxWidth: "26rem",
                breakInside: "avoid",
                pageBreakInside: "avoid",
              }}
            >
              <AktivitaetsNetz titel="Dein Aktivitätsnetz" />
            </div>

            {/* Kontextkreise (du / alle) als Grafik, ebenfalls unteilbar */}
            <div
              style={{
                margin: "1.5rem 0 0",
                breakInside: "avoid",
                pageBreakInside: "avoid",
              }}
            >
              <KontextGewichtung />
            </div>

            {/* Aktivitäts-Boxen — Teil 2 des Ausdrucks beginnt auf einer neuen
                Seite (Aktivität in Zahlen, Deutungen, Vertiefungen). */}
            <h2
              style={{
                fontSize: "1.1rem",
                margin: "0 0 0.5rem",
                breakBefore: "page",
                pageBreakBefore: "always",
              }}
            >
              Meine Aktivität in Zahlen
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "0.5rem",
                breakInside: "avoid",
                pageBreakInside: "avoid",
              }}
            >
              {perspektiven.map((p, i) => (
                <div
                  key={p.titel}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "0.5rem",
                    padding: "0.55rem 0.65rem",
                    // Marmoriert wie die Orakel-Umgebung: das Aquarell liegt
                    // blass hinter der Zahl, vier Motive im Wechsel. Beim
                    // Drucken müssen Hintergrundbilder erlaubt sein
                    // («Hintergrundgrafiken» im Druckdialog).
                    backgroundImage: `url(/art/orakel-umgebung-${(i % 4) + 1}.webp)`,
                    backgroundSize: "cover",
                    backgroundPosition: `${(i * 37) % 100}% ${(i * 53) % 100}%`,
                    printColorAdjust: "exact",
                    WebkitPrintColorAdjust: "exact",
                  }}
                >
                  <div
                    style={{
                      /* Weisser Schleier, damit die Zahl auf jedem Motiv lesbar
                         bleibt; ohne ihn verschwindet sie in dunklen Partien. */
                      background: "rgba(255,255,255,0.82)",
                      borderRadius: "0.35rem",
                      padding: "0.3rem 0.4rem",
                    }}
                  >
                    <div style={{ fontSize: "0.72rem", color: "#555" }}>{p.titel}</div>
                    <div style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: "0.15rem" }}>{p.wert}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Zweites Element auf Seite 2: wo am meisten und am wenigsten
                gearbeitet wurde. Nach Anteil des Abschnitts, nicht nach
                absoluter Zahl. */}
            <div
              style={{
                marginTop: "0.9rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.6rem",
                breakInside: "avoid",
                pageBreakInside: "avoid",
              }}
            >
              {[
                { titel: "Am meisten bearbeitet", eintraege: staerkste },
                { titel: "Am wenigsten bearbeitet", eintraege: schwaechste },
              ].map((sp) => (
                <div
                  key={sp.titel}
                  style={{ border: "1px solid #ccc", borderRadius: "0.5rem", padding: "0.55rem 0.65rem" }}
                >
                  <div style={{ fontSize: "0.72rem", color: "#555" }}>{sp.titel}</div>
                  <ul style={{ margin: "0.25rem 0 0", paddingLeft: "1.1rem", fontSize: "0.95rem", lineHeight: 1.5 }}>
                    {sp.eintraege.map((e) => (
                      <li key={e.label}>
                        {e.label}{" "}
                        <span style={{ color: "#555" }}>
                          ({e.du} von {e.total})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Seite 3: die Deutungen des Orakels. Der Umbruch sitzt auf dem
                Behälter, damit er auch greift, wenn nur eine Deutung vorliegt. */}
            <div style={{ breakBefore: "page", pageBreakBefore: "always" }}>
            {intOrakel.status === "ok" && intOrakel.text && (
              <>
                {/* Titel wie in der Navigation, Gegenstand als Unterzeile:
                    «erste Stimme» sagt, WELCHE der zwei Stimmen spricht, die
                    Unterzeile sagt, WOVON. Beides zusammen, weil der Ausdruck
                    ohne die Seite gelesen wird. */}
                <h2 style={{ fontSize: "1.1rem", margin: "0 0 0.1rem" }}>
                  Das Orakel spricht, erste Stimme
                </h2>
                <p style={{ margin: "0 0 0.4rem", fontSize: "0.85rem", color: "#555" }}>
                  Wo ich aktiv war und was sich noch lohnt
                </p>
                <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                  {intOrakel.text}
                </p>
                {intOrakel.wann && (
                  /* Ohne diese Zeile trüge eine gestern erzeugte Deutung nur
                     das heutige Druckdatum im Kopf, als wäre sie von heute. */
                  <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "#555" }}>
                    Deutung vom {formatiereWann(intOrakel.wann)}
                  </p>
                )}
              </>
            )}

            {aktuell.status === "ok" && aktuell.text && (
              <>
                {/* Der Ausdruck bleibt bei den Lernenden, darum nennt die
                    Unterzeile den Gegenstand und die gewählte Form. «Wissen-
                    schaftliche Deutung» allein sagte nicht, wovon. */}
                <h2 style={{ fontSize: "1.1rem", margin: "1.75rem 0 0.1rem" }}>
                  Das Orakel spricht, zweite Stimme
                </h2>
                <p style={{ margin: "0 0 0.4rem", fontSize: "0.85rem", color: "#555" }}>
                  Mein KI-Typ, {STILE.find((s) => s.id === stil)?.label.toLowerCase()} gedeutet
                </p>
                <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                  {aktuell.text}
                </p>
                {aktuell.wann && (
                  <p style={{ margin: "0.3rem 0 0", fontSize: "0.8rem", color: "#555" }}>
                    Deutung vom {formatiereWann(aktuell.wann)}
                  </p>
                )}
              </>
            )}

            {intOrakel.status !== "ok" && aktuell.status !== "ok" && (
              <p style={{ margin: 0, fontSize: "1rem", color: "#444" }}>
                (Befrage das Orakel oben, damit seine Deutungen hier erscheinen.)
              </p>
            )}
            </div>

            {/* Seite 4: was weiterverfolgt werden möchte. */}
            <h2
              style={{
                fontSize: "1.1rem",
                margin: "0 0 0.4rem",
                breakBefore: "page",
                pageBreakBefore: "always",
              }}
            >
              Diese Punkte möchte ich noch vertiefen
            </h2>
            {vertiefteGruppen.length > 0 ? (
              vertiefteGruppen.map((g) => (
                <div
                  key={g.abschnitt}
                  style={{
                    marginTop: "0.5rem",
                    breakInside: "avoid",
                    pageBreakInside: "avoid",
                  }}
                >
                  <p style={{ margin: "0 0 0.15rem", fontSize: "0.85rem", fontWeight: 700, color: "#333" }}>
                    {g.abschnitt}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "1rem", lineHeight: 1.6 }}>
                    {g.titel.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p style={{ margin: 0, fontSize: "1rem", color: "#444" }}>
                Nichts wurde gewählt.
              </p>
            )}

            <p style={{ marginTop: "2rem", fontSize: "0.8rem", color: "#666" }}>
              Erstellt im Lernset «Eine ganz neue Partnerschaft». Die Deutungen
              beruhen auf einer Zusammenfassung der eigenen Aktivität, die ohne
              Namen und ohne Fortschritts-Code an den KI-Dienst übermittelt
              wurde. Der Fortschritt selbst liegt unter dem Fortschritts-Code
              gespeichert, damit er auf einem anderen Gerät wieder verfügbar ist.
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
