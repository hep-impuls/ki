"use client";

import { useEffect, useRef, useState } from "react";
import {
  OPENER_FRAGE,
  OPENER_MEDIA,
  OPENER_SCHWANZ_KARTEN,
  VORWISSEN_FRAGE,
  VORWISSEN_OPTIONEN,
} from "../_data/auftakt";
import { AUFTAKT_SKALA_POLLS } from "../_data/auftaktPolls";
import { AUFTAKT_SWIPE_KARTEN, AUFTAKT_SWIPE_STATION } from "../_data/auftaktSwipe";
import type { SwipeKarte } from "../_data/types";
import type { LernzielKarteSpec } from "./LernzielKarte";
import { pollWahl, recordPollWahl, recordSwipe, swipePick } from "../_lib/stationStore";
import { GLOBAL_POLL_ID, GLOBAL_STATION_ID } from "../_lib/landkarteData";
import { castSwipe, castVorwissen } from "../_lib/unitPolls";
import { AUTO_ADVANCE_MS } from "../_lib/ui";
import type { RouteApi } from "../_lib/route";
import LernzielKarte from "./LernzielKarte";
import WerteKarte from "./WerteKarte";
import PollAuswertung from "./PollAuswertung";
import MediaBlockView from "./media/MediaBlockView";
import Hinweis from "./Hinweis";
import Anleitung from "./Anleitung";
import GlobalSlider from "./GlobalSlider";
import Skala4Frage from "./Skala4Frage";

/**
 * AuftaktV3 (M7 + M8-Rest) — der Auftakt der KI-Einheit v3 (Spec §3/§70/§74) als
 * Folge kurzer, paginierter Schritte (eine Frage/Karte pro Frame, §4):
 *
 *   1. Vorwissen — «Wo ist dir KI begegnet?» (Mehrfachauswahl + Freitext)
 *   2. Reiz — Hype-Opener (Ava-Video), optionaler Versprechen-Schwanz
 *   3. Position — globaler Pre-Schieberegler «Bedrohung ↔ Chance»
 *   4. Haltung — 2 globale **4er-Skala**-Pre-Polls (1/Frame), aggregierbar
 *   5. Werte — **6 Swipe-Karten** (1/Frame) bauen das Werte-Profil auf
 *
 * **ki26-konform:** persönliche Auswahl/Freitext/Profil bleiben im Browser
 * (localStorage). In die Cloud gehen nur anonyme Aggregat-Zähler: Vorwissen
 * (`castVorwissen`), Pre-Slider (`castSlider` in `GlobalSlider`), 4er-Skala
 * (`castSkala` in `Skala4Frage`) und optional Swipe (`castSwipe`). Der globale
 * Pre-Wert (GLOBAL_STATION_ID/GLOBAL_POLL_ID) speist den Pre→Post-Pfeil im
 * Abschluss; die 2 Skala-Polls erscheinen post im Abschluss + Klassen-Spiegel.
 */

const STORAGE = "ki26-v3-auftakt";

interface AuftaktState {
  gewaehlt: string[];
  freitext: string;
}

const AUFTAKT_LERNZIEL_V3: LernzielKarteSpec = {
  titel: "Worum es geht",
  lernziele: [
    "Du machst dein KI-Vorwissen sichtbar.",
    "Du legst eine erste Position fest — Chance oder Bedrohung?",
    "Du erkennst, dass es hier kein Richtig oder Falsch gibt.",
  ],
  aktivitaet:
    "Zuerst hältst du fest, wo dir KI begegnet ist. Dann ein gemeinsamer Reiz, deine Ausgangsposition auf dem Schieberegler, zwei kurze Haltungsfragen — und zum Schluss ein paar Wert-Karten.",
  wasKommt:
    "Danach wählst du auf dem Zeitstrahl deine Stationen frei. Am Ende siehst du auf deiner Landkarte, wie sich deine Haltung bewegt hat.",
};

const SCHRITTE = ["Vorwissen", "Reiz", "Position", "Haltung", "Werte"];

/* ── Schritt 4: 2 globale 4er-Skala-Pre-Polls, paginiert ───────────────────── */
function HaltungBlock({
  i,
  setI,
  onDone,
  onBack,
}: {
  /** M10: controlled — Index kommt aus der URL (Auftakt-`inner`). */
  i: number;
  setI: (n: number, replace?: boolean) => void;
  onDone: () => void;
  onBack: () => void;
}) {
  const total = AUFTAKT_SKALA_POLLS.length;
  const istAuswertung = i >= total; // Extra-Seite nach den Fragen: Ich/Klasse/alle (#8)
  const poll = istAuswertung ? null : AUFTAKT_SKALA_POLLS[i];
  const letzteFrage = i === total - 1;
  // Auto-Advance nur zwischen den Fragen — nicht in die Auswertung und nicht auf
  // der letzten Frage (dort bleibt «Weiter» bewusst manuell). Weiter/Zurück immer.
  // Stale-Schutz via iRef (falls zwischenzeitlich manuell navigiert wurde).
  const iRef = useRef(i);
  iRef.current = i;
  const advanceRef = useRef(false);
  useEffect(() => {
    advanceRef.current = false;
  }, [i]);
  const onAnswered = () => {
    if (istAuswertung || letzteFrage || advanceRef.current) return;
    advanceRef.current = true;
    const from = i;
    setTimeout(() => {
      if (iRef.current === from) setI(from + 1, true);
    }, AUTO_ADVANCE_MS);
  };
  return (
    <div className="flex flex-col gap-lg">
      <Anleitung>
        Zwei kurze Haltungsfragen. Es gibt kein Richtig oder Falsch — dieselben Fragen
        beantwortest du am Ende noch einmal und siehst, ob sich etwas bewegt hat.
      </Anleitung>
      {istAuswertung ? (
        <div className="animate-frame-in">
          <PollAuswertung
            titel="Ich, meine Klasse, alle"
            eintraege={AUFTAKT_SKALA_POLLS.map((p) => ({
              stationId: GLOBAL_STATION_ID,
              poll: p,
              phase: "pre" as const,
            }))}
            hinweis="Die Klassen- und Gesamtwerte erscheinen, sobald genug abgestimmt haben. Deine eigene Stufe bleibt lokal."
          />
        </div>
      ) : (
        <>
          <p className="text-label-sm text-on-surface-variant">
            Frage {i + 1} von {total}
          </p>
          <div key={poll!.id} className="animate-frame-in">
            <Skala4Frage poll={poll!} phase="pre" onAnswered={onAnswered} />
          </div>
        </>
      )}
      <BlockNav
        zurueck={() => (i > 0 ? setI(i - 1) : onBack())}
        weiter={() => (istAuswertung ? onDone() : setI(i + 1))}
        weiterLabel={istAuswertung ? "Weiter zu den Werten" : "Weiter"}
      />
    </div>
  );
}

/* ── Schritt 5: 6 Swipe-Karten, paginiert (1 Karte/Frame) ──────────────────── */
function SwipeKarteFrame({
  karte,
  onAnswered,
}: {
  karte: SwipeKarte;
  onAnswered?: () => void;
}) {
  const [pick, setPick] = useState<"links" | "rechts" | null>(
    () => swipePick(AUFTAKT_SWIPE_STATION, karte.id)?.pick ?? null,
  );
  const waehlen = (p: "links" | "rechts") => {
    setPick(p);
    recordSwipe(AUFTAKT_SWIPE_STATION, karte.id, p, karte.profilKey);
    castSwipe(karte.id, p); // optionaler anonymer Aggregat-Zähler
    onAnswered?.();
  };
  return <WerteKarte aussage={karte.aussage} achse={karte.achse} pick={pick} onPick={waehlen} />;
}

function WerteBlock({
  i,
  setI,
  onDone,
  onBack,
}: {
  /** M10: controlled — Index kommt aus der URL (Auftakt-`inner`). */
  i: number;
  setI: (n: number, replace?: boolean) => void;
  onDone: () => void;
  onBack: () => void;
}) {
  const karte = AUFTAKT_SWIPE_KARTEN[i];
  const letzte = i === AUFTAKT_SWIPE_KARTEN.length - 1;
  // Auto-Advance wie im HaltungBlock — letzte Karte bleibt manuell. Stale-Schutz
  // via iRef (falls zwischenzeitlich manuell navigiert wurde).
  const iRef = useRef(i);
  iRef.current = i;
  const advanceRef = useRef(false);
  useEffect(() => {
    advanceRef.current = false;
  }, [i]);
  const onAnswered = () => {
    if (letzte || advanceRef.current) return;
    advanceRef.current = true;
    const from = i;
    setTimeout(() => {
      if (iRef.current === from) setI(from + 1, true);
    }, AUTO_ADVANCE_MS);
  };
  return (
    <div className="flex flex-col gap-lg">
      <Anleitung>
        Sechs Wert-Karten. Tippe an, ob du eher zustimmst («Sehe ich auch so») oder eher
        anders denkst («Sehe ich anders»). Daraus entsteht dein Werte-Profil auf der Landkarte.
      </Anleitung>
      <p className="text-label-sm text-on-surface-variant">
        Karte {i + 1} von {AUFTAKT_SWIPE_KARTEN.length}
      </p>
      <div key={karte.id} className="animate-frame-in">
        <SwipeKarteFrame karte={karte} onAnswered={onAnswered} />
      </div>
      <BlockNav
        zurueck={() => (i > 0 ? setI(i - 1) : onBack())}
        weiter={() => (letzte ? onDone() : setI(i + 1))}
        weiterLabel={letzte ? "Zu den Stationen" : "Weiter"}
      />
    </div>
  );
}

/* ── Geteilte Navigationszeile für die paginierten Blöcke ──────────────────── */
function BlockNav({
  zurueck,
  weiter,
  weiterLabel,
}: {
  zurueck: () => void;
  weiter: () => void;
  weiterLabel: string;
}) {
  return (
    <div className="mt-md flex items-center justify-between">
      <button
        type="button"
        onClick={zurueck}
        className="inline-flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-bright px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-container"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Zurück
      </button>
      <button
        type="button"
        onClick={weiter}
        className="inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:opacity-90"
      >
        {weiterLabel}
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </button>
    </div>
  );
}

export default function AuftaktV3({
  nav,
  onComplete,
}: {
  /** M10: im orchestrierten Flow gesetzt — Auftakt-Schritt + Innen-Index kommen
   *  dann aus der URL (`#/auftakt/<schritt>/<inner>`). Ohne `nav` lokaler State. */
  nav?: RouteApi;
  onComplete: () => void;
}) {
  const routed = nav?.route ?? null;
  const istRouted = nav != null;
  const aRoute = routed?.phase === "auftakt" ? routed : null;

  const [schrittLocal, setSchrittLocal] = useState(0);
  const [innerLocal, setInnerLocal] = useState(0);
  const schritt = istRouted ? Math.min(Math.max(0, aRoute?.schritt ?? 0), 4) : schrittLocal;
  const inner = istRouted ? aRoute?.inner ?? 0 : innerLocal;

  // Schritt-Wechsel (äussere Navigation) — setzt den Innen-Index zurück.
  const setSchritt = (ziel: number, innerStart = 0) => {
    if (istRouted) nav!.push({ phase: "auftakt", schritt: ziel, inner: innerStart });
    else {
      setSchrittLocal(ziel);
      setInnerLocal(innerStart);
    }
  };
  // Innen-Index (Haltung/Werte): replace = Auto-Advance, sonst bewusster Schritt.
  const setInner = (n: number, replace = false) => {
    if (!istRouted) {
      setInnerLocal(n);
      return;
    }
    const schreiben = replace ? nav!.replace : nav!.push;
    schreiben({ phase: "auftakt", schritt, inner: n });
  };

  const [s, setS] = useState<AuftaktState>({ gewaehlt: [], freitext: "" });
  const [schwanzOffen, setSchwanzOffen] = useState(false);

  // Lokalen Stand laden (nur Client).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setS((p) => ({ ...p, ...JSON.parse(raw) }));
    } catch {
      /* ignore */
    }
  }, []);

  function persist(next: AuftaktState) {
    setS(next);
    try {
      localStorage.setItem(STORAGE, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function toggle(id: string) {
    const gewaehlt = s.gewaehlt.includes(id)
      ? s.gewaehlt.filter((x) => x !== id)
      : [...s.gewaehlt, id];
    persist({ ...s, gewaehlt });
  }

  function einheitStarten() {
    // Falls der Regler nie bewegt wurde: neutrale 50 festhalten, damit der
    // Pre→Post-Pfeil im Abschluss eine Basis hat. Rein lokal.
    if (pollWahl(GLOBAL_STATION_ID, GLOBAL_POLL_ID, "pre") == null) {
      recordPollWahl(GLOBAL_STATION_ID, GLOBAL_POLL_ID, "pre", 50);
    }
    // Vorwissen anonym aggregieren — ein Zähler je gewählte Option, einmal pro
    // Browser (voteOnce). Die Auswahl selbst + Freitext bleiben lokal.
    for (const optId of s.gewaehlt) castVorwissen(optId);
    onComplete();
  }

  return (
    <div className="flex flex-col gap-lg">
      <header className="border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-primary">Auftakt</p>
        <h1 className="mt-sm text-headline-xl text-on-surface">
          Kann KI das? — eine Positionsreise
        </h1>
        <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
          Du entscheidest selbst, was du dir ansiehst — und wo du am Ende stehst.
          Es gibt keine Noten, keine richtigen Antworten. Nur deine Position.
        </p>
      </header>

      <LernzielKarte {...AUFTAKT_LERNZIEL_V3} />

      {/* Schritt-Anzeige */}
      <div className="flex flex-wrap gap-xs">
        {SCHRITTE.map((label, i) => (
          <span
            key={label}
            className={
              i === schritt
                ? "rounded-xl bg-primary px-md py-xs text-label-sm text-on-primary"
                : i < schritt
                  ? "rounded-xl bg-primary-container px-md py-xs text-label-sm text-on-primary-container"
                  : "rounded-xl border border-outline-variant px-md py-xs text-label-sm text-on-surface-variant"
            }
          >
            {label}
          </span>
        ))}
      </div>

      <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
        {/* 1 — Vorwissen */}
        {schritt === 0 && (
          <div className="flex flex-col gap-lg">
            <div>
              <p className="text-body-md font-semibold text-on-surface">{VORWISSEN_FRAGE}</p>
              <p className="mt-xs text-body-sm text-on-surface-variant">
                Mehrfachauswahl möglich. Deine Auswahl bleibt auf deinem Gerät.
              </p>
            </div>
            <div className="flex flex-wrap gap-sm">
              {VORWISSEN_OPTIONEN.map((o) => {
                const on = s.gewaehlt.includes(o.id);
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggle(o.id)}
                    aria-pressed={on}
                    className={
                      on
                        ? "inline-flex items-center gap-sm rounded-xl bg-primary px-md py-sm text-label-md text-on-primary"
                        : "inline-flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-bright px-md py-sm text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                    }
                  >
                    <span className="material-symbols-outlined text-[18px]">{o.icon}</span>
                    {o.label}
                  </button>
                );
              })}
            </div>
            <div>
              <label htmlFor="auftakt-v3-freitext" className="text-body-md font-semibold text-on-surface">
                Fällt dir noch etwas ein? (freiwillig)
              </label>
              <input
                id="auftakt-v3-freitext"
                type="text"
                value={s.freitext}
                onChange={(e) => persist({ ...s, freitext: e.target.value })}
                placeholder="z.B. eine konkrete Situation …"
                className="mt-sm w-full rounded-lg border border-outline-variant bg-surface-bright p-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
              />
              <p className="mt-xs text-label-sm text-on-surface-variant">
                Freitext bleibt nur auf deinem Gerät — wird nie gespeichert oder geteilt.
              </p>
            </div>
          </div>
        )}

        {/* 2 — Hype-Opener */}
        {schritt === 1 && (
          <div className="flex flex-col gap-lg">
            <div className="rounded-lg bg-tertiary-container p-md text-on-tertiary-container">
              <p className="flex items-center gap-sm text-label-md uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                Die Rahmenfrage
              </p>
              <p className="mt-xs text-headline-sm">{OPENER_FRAGE}</p>
            </div>
            <Hinweis>
              Bevor du deine Position festlegst: ein gemeinsamer Reiz. Schau den Ausschnitt — er zeigt,
              was KI heute alles kann.
            </Hinweis>
            <MediaBlockView block={{ media: [OPENER_MEDIA] }} />

            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-md">
              <p className="flex items-center gap-xs text-label-md text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-tertiary">movie</span>
                Zwei weitere Ausschnitte — freiwillig. Schau dir an, was dich interessiert.
              </p>
              {!schwanzOffen ? (
                <button
                  type="button"
                  onClick={() => setSchwanzOffen(true)}
                  className="mt-sm inline-flex items-center gap-sm text-label-md text-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Videos anzeigen
                </button>
              ) : (
                <div className="mt-md grid gap-md md:grid-cols-2">
                  {OPENER_SCHWANZ_KARTEN.map((k) => (
                    <div
                      key={k.media.title}
                      className="flex flex-col gap-sm rounded-lg border border-outline-variant bg-surface-bright p-md"
                    >
                      <p className="flex items-center gap-xs text-body-md font-semibold text-on-surface">
                        <span className="material-symbols-outlined text-[20px] text-tertiary">{k.icon}</span>
                        {k.titel}
                      </p>
                      <p className="text-body-sm text-on-surface-variant">{k.beschreibung}</p>
                      <span className="inline-flex w-fit items-center gap-xs rounded-full bg-surface-container px-sm py-[2px] text-label-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">redeem</span>
                        freiwillig
                      </span>
                      <MediaBlockView block={{ media: [k.media] }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3 — Globaler Pre-Slider */}
        {schritt === 2 && (
          <div className="flex flex-col gap-lg">
            <Anleitung>
              Setze deine Ausgangsposition. Bewege den Regler dorthin, wo du heute stehst — am Ende
              siehst du auf deiner Landkarte, ob sich etwas verschoben hat.
            </Anleitung>
            <GlobalSlider phase="pre" />
          </div>
        )}

        {/* 4 — Haltung (2 globale 4er-Skala-Pre-Polls) */}
        {schritt === 3 && (
          <HaltungBlock
            i={Math.min(Math.max(0, inner), AUFTAKT_SKALA_POLLS.length)}
            setI={setInner}
            onDone={() => setSchritt(4)}
            onBack={() => setSchritt(2)}
          />
        )}

        {/* 5 — Werte (6 Swipe-Karten) */}
        {schritt === 4 && (
          <WerteBlock
            i={Math.min(Math.max(0, inner), AUFTAKT_SWIPE_KARTEN.length - 1)}
            setI={setInner}
            onDone={einheitStarten}
            onBack={() => setSchritt(3)}
          />
        )}

        {/* Äussere Navigation nur für die Schritte 1–3 (Blöcke 4/5 führen selbst). */}
        {schritt <= 2 && (
          <div className="mt-xl flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSchritt(Math.max(0, schritt - 1))}
              disabled={schritt === 0}
              className="inline-flex items-center gap-sm rounded-xl border border-outline-variant bg-surface-bright px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Zurück
            </button>
            <button
              type="button"
              onClick={() => setSchritt(schritt + 1)}
              className="inline-flex items-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:opacity-90"
            >
              Weiter
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
