"use client";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import { seg } from "@/lib/paths";
import { castVote, type PollCounts } from "@/lib/polls";
import { ensureStudent } from "@/lib/db";
import { generateCode, getSession, saveSession } from "@/lib/session";

/**
 * Spuren — das Wege-Gedächtnis für Lernseite 2, dreifach gesichert:
 *
 * 1. **Lokal (localStorage):** WELCHE Knoten DU besucht hast. Sofort, offline.
 * 2. **Anonym (Firebase-Poll):** pro Besuch ein `+1` auf einen Aggregat-Zähler
 *    (`abstimmungen/ki26/polls/spuren-lernseite-2`) — ohne Namen, fürs «alle»
 *    des Orakel-Dashboards.
 * 3. **Pro Nutzer (Firebase, Pietros Code-Modell):** die vollständige Spur-Liste
 *    unter `abstimmungen/ki26/students/{code}/progress/lernseite-2-spuren`.
 *    Damit bleiben die Knoten **geräteübergreifend** offen: Wer denselben
 *    Animal-Code (via /start) eingibt, bekommt seine Spur zurück.
 *
 * Der Code wird bei der ersten Interaktion im Hintergrund erzeugt
 * (`ensureCode`) und in `session.ts` (Pietros Modul) abgelegt — wir *nutzen*
 * dessen API, ohne es zu verändern. Anonymer Aggregat-Zähler und lokaler
 * Store bleiben die schnelle Quelle; der Cloud-Spiegel ist additiv und
 * no-op ohne Firebase-Config.
 */

const KEY = "ki26-spuren-lernseite-2";
/** Dauerhaftes Zähl-Register: welche IDs je anonym gezählt wurden. Übersteht
 *  ein «Muster zurücksetzen», damit erneutes Sammeln die Aggregat-Zähler
 *  nicht aufbläht. */
const KEY_GEZAEHLT = "ki26-spuren-gezaehlt";
/** Eigenes Event, damit offene Ansichten (Muster, Orakel) live mitzählen. */
export const SPUR_EVENT = "ki26-spur";
/** Poll-Doc für die anonymen Aktivitäts-Zähler (counts[spurId] += 1). */
export const SPUREN_POLL_ID = "spuren-lernseite-2";
/** Modul-Kennung des Pro-Nutzer-Fortschritts-Docs. */
const SPUREN_MODUL = "lernseite-2-spuren";

export interface Spur {
  id: string;
  t: number;
}

function lesen(): Spur[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (s): s is Spur =>
        !!s && typeof (s as Spur).id === "string" && typeof (s as Spur).t === "number",
    );
  } catch {
    return [];
  }
}

function schreiben(spuren: Spur[]): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(spuren));
  } catch {
    /* localStorage gesperrt (Privatmodus) → bewusst still */
  }
}

/** Nutzer-Code sicherstellen (Pietros Session). Legt bei Bedarf im Hintergrund
 *  einen an, ohne bestehende Sessions zu überschreiben. */
function ensureCode(): string | null {
  if (typeof window === "undefined") return null;
  const vorhanden = getSession();
  if (vorhanden?.studentCode) return vorhanden.studentCode;
  const studentCode = generateCode();
  saveSession({ studentCode, teacherCode: vorhanden?.teacherCode ?? null });
  // Reales students/{code}-Doc anlegen (nicht nur die Progress-Subcollection),
  // damit der Code klassen-zuordenbar wird (Klassen-Query fragt teacherCode).
  // Fire-and-forget; ensureStudent fängt eigene Fehler ab. Läuft nur beim
  // erstmaligen Erzeugen eines Codes (danach greift der Early-Return oben).
  void ensureStudent(studentCode, vorhanden?.teacherCode ?? null);
  return studentCode;
}

function spurenDocRef(code: string) {
  const { db } = getFirebase();
  if (!db) return null;
  const s = seg.progressDoc(code, SPUREN_MODUL);
  return doc(db, s[0], ...s.slice(1));
}

/** Debounce fürs Cloud-Spiegeln (nicht bei jedem Knoten einzeln schreiben). */
let mirrorTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleMirror(): void {
  if (mirrorTimer) clearTimeout(mirrorTimer);
  mirrorTimer = setTimeout(() => {
    mirrorTimer = null;
    const code = getSession()?.studentCode;
    if (!code) return;
    const ref = spurenDocRef(code);
    if (!ref) return;
    const ids = lesen().map((s) => s.id);
    void setDoc(ref, { ids, updatedAt: serverTimestamp() }, { merge: true }).catch(
      (err) => console.warn("[spuren] mirror failed", err),
    );
  }, 1500);
}

/**
 * Anonym zählen nur ausserhalb der Entwicklung: localhost-Klicks (Tests,
 * Verifikation) würden die echten Kollektiv-Zähler verfälschen — Dev-Server
 * und Produktion teilen sich dasselbe Firestore-Poll-Doc. Lokale Spuren («du»)
 * bleiben davon unberührt.
 */
export function zaehltAnonym(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h !== "localhost" && h !== "127.0.0.1";
}

/**
 * Einmalige Nachzählung nach dem Zähler-Reset vom 2026-07-22: Die anonymen
 * Poll-Zähler wurden genullt, aber die lokalen Zähl-Register der Browser
 * blockierten das erneute Zählen des Bestands — angeklickte Punkte fehlten
 * dauerhaft im «alle». Diese Migration leert die Register EINMAL pro Browser
 * und zählt den aktuellen lokalen Bestand frisch ein (danach greift wieder
 * die normale Einmal-Zählung). Läuft nur in der Produktion (Dev-Guard).
 */
const KEY_NACHZAEHLUNG = "ki26-nachzaehlung-2026-07-22";
function nachzaehlenNachReset(): void {
  if (typeof window === "undefined" || !zaehltAnonym()) return;
  try {
    if (window.localStorage.getItem(KEY_NACHZAEHLUNG)) return;
    window.localStorage.setItem(KEY_NACHZAEHLUNG, "1");
    window.localStorage.removeItem(KEY_GEZAEHLT);
    // Flächen-Register (auswertung.ts) ebenfalls leeren — die nächste
    // melde()-Runde zählt die aktuell geknüpften Flächen dann frisch ein.
    window.localStorage.removeItem("ki26-flaechen-gezaehlt");
    for (const s of lesen()) {
      if (!schonGezaehlt(s.id)) void castVote(SPUREN_POLL_ID, s.id);
    }
  } catch {
    /* Privatmodus → still */
  }
}

/** Wurde die ID schon einmal anonym gezählt? Falls nein: jetzt registrieren. */
function schonGezaehlt(id: string): boolean {
  try {
    const raw = window.localStorage.getItem(KEY_GEZAEHLT);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    const set = new Set(
      Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [],
    );
    if (set.has(id)) return true;
    set.add(id);
    window.localStorage.setItem(KEY_GEZAEHLT, JSON.stringify([...set]));
    return false;
  } catch {
    return false;
  }
}

/**
 * Migration 2026-08-17: Teppich-Spuren hingen am Array-Index. Jeder mitten im
 * Array eingefügte Punkt verschob damit die gespeicherten Spuren aller Nutzer
 * (falsche Punkte leuchteten) und ein neuer Punkt an einem schon belegten
 * Index zählte NIE, weil `merkeSpur` je Kennung nur einmal schreibt — genau so
 * ist es Christof am 17.8. aufgefallen. Seither tragen die Punkte stabile
 * Slugs; diese Funktion wandelt `<spurKey>:<zahl>` samt den abgeleiteten
 * Formen `wunsch:<spurKey>:<zahl>` und `mehr:<spurKey>:<zahl>` (KartenAktion
 * baut beide aus derselben Basis) über die HEUTIGE Reihenfolge in die
 * Slug-Form; Kennungen ausserhalb des Musters bleiben unberührt. Für Klicks aus der Zeit der Verschiebung
 * (16.–17.8.) kann die Zuordnung daneben liegen, die ANZAHL der Spuren — und
 * damit das Rhizom — bleibt exakt erhalten. Auch das anonyme Zähl-Register
 * zieht mit, sonst würde erneutes Anwählen die Kollektiv-Zähler ein zweites
 * Mal hochtreiben. Idempotent; feuert SPUR_EVENT nur bei echter Änderung
 * (der Teppich ruft sie im SPUR_EVENT-Handler auf — beim zweiten Lauf ändert
 * sich nichts mehr, also kein Ereignis-Kreisel).
 */
export function migriereIndexSpuren(spurKey: string, slugs: string[]): void {
  if (typeof window === "undefined" || slugs.length === 0) return;
  const kern = spurKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^((?:wunsch|mehr):)?${kern}:(\\d+)$`);
  const wandle = (id: string): string | null => {
    const m = re.exec(id);
    if (!m) return id;
    const i = Number(m[2]);
    return i < slugs.length ? `${m[1] ?? ""}${spurKey}:${slugs[i]}` : null;
  };

  const alt = lesen();
  const gesehen = new Set<string>();
  const neu: Spur[] = [];
  let geaendert = false;
  for (const s of alt) {
    const id = wandle(s.id);
    if (id !== s.id) geaendert = true;
    if (id === null || gesehen.has(id)) continue;
    gesehen.add(id);
    neu.push(id === s.id ? s : { id, t: s.t });
  }

  try {
    const raw = window.localStorage.getItem(KEY_GEZAEHLT);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    if (Array.isArray(arr)) {
      let regGeaendert = false;
      const reg = new Set<string>();
      for (const x of arr) {
        if (typeof x !== "string") continue;
        const id = wandle(x);
        if (id !== x) regGeaendert = true;
        if (id) reg.add(id);
      }
      if (regGeaendert) {
        window.localStorage.setItem(KEY_GEZAEHLT, JSON.stringify([...reg]));
      }
    }
  } catch {
    /* Privatmodus → still */
  }

  if (!geaendert) return;
  schreiben(neu);
  window.dispatchEvent(new CustomEvent(SPUR_EVENT, { detail: { migriert: spurKey } }));
  // Cloud-Spiegel nachziehen: `ids` ist ein Array-Feld, setDoc ersetzt es als
  // Ganzes — die numerischen Kennungen verschwinden also auch dort.
  scheduleMirror();
}

/** Eine Spur setzen (idempotent). Lokal + anonymer Zähler + Cloud-Spiegel. */
export function merkeSpur(id: string): void {
  if (typeof window === "undefined" || !id) return;
  const spuren = lesen();
  if (spuren.some((s) => s.id === id)) return;
  spuren.push({ id, t: Date.now() });
  schreiben(spuren);
  window.dispatchEvent(new CustomEvent(SPUR_EVENT, { detail: { id } }));
  // Anonymer Aggregat-Zähler fürs «alle» — nur beim allerersten Mal (das
  // Register übersteht ein «Muster zurücksetzen») und nie aus der Entwicklung.
  if (zaehltAnonym() && !schonGezaehlt(id)) void castVote(SPUREN_POLL_ID, id);
  // Pro-Nutzer-Spiegel (erzeugt bei Bedarf einen Hintergrund-Code).
  ensureCode();
  scheduleMirror();
}

/**
 * Alle Spuren eines Musters löschen («Muster zurücksetzen»): lokal entfernen,
 * Cloud-Spiegel SOFORT überschreiben (damit kein späterer Pull sie
 * zurückbringt) und SPUR_EVENT feuern. Das Zähl-Register bleibt bestehen —
 * erneutes Sammeln zählt anonym nicht doppelt.
 */
export function loescheSpuren(prefix: string): void {
  if (typeof window === "undefined" || !prefix) return;
  const rest = lesen().filter(
    (s) => s.id !== prefix && !s.id.startsWith(`${prefix}:`),
  );
  schreiben(rest);
  window.dispatchEvent(
    new CustomEvent(SPUR_EVENT, { detail: { geloescht: prefix } }),
  );
  const code = getSession()?.studentCode;
  if (!code) return;
  const ref = spurenDocRef(code);
  if (!ref) return;
  void setDoc(
    ref,
    { ids: rest.map((s) => s.id), updatedAt: serverTimestamp() },
    { merge: true },
  ).catch((err) => console.warn("[spuren] reset mirror failed", err));
}

/**
 * Alle Spuren löschen, deren ID einen der Teil-Strings enthält («Seite von
 * vorne beginnen»): lokal entfernen, den Cloud-Spiegel mit dem VOLLEN Rest
 * überschreiben (der `ids`-Array wird bei merge ersetzt) und SPUR_EVENT feuern.
 * Das anonyme Zähl-Register (`KEY_GEZAEHLT`) bleibt bewusst bestehen, damit
 * erneutes Durchgehen die Kollektiv-Zähler nicht aufbläht. Gibt das
 * Cloud-Schreiben als Promise zurück, damit der Aufrufer vor einem Reload
 * warten kann.
 */
export async function loescheSpurenEnthaltend(teile: string[]): Promise<void> {
  if (typeof window === "undefined" || teile.length === 0) return;
  const rest = lesen().filter((s) => !teile.some((t) => s.id.includes(t)));
  schreiben(rest);
  window.dispatchEvent(new CustomEvent(SPUR_EVENT, { detail: { neustart: true } }));
  const code = getSession()?.studentCode;
  if (!code) return;
  const ref = spurenDocRef(code);
  if (!ref) return;
  try {
    await setDoc(
      ref,
      { ids: rest.map((s) => s.id), updatedAt: serverTimestamp() },
      { merge: true },
    );
  } catch (err) {
    console.warn("[spuren] neustart mirror failed", err);
  }
}

/**
 * Einzelne Spuren wieder entfernen — ein abgewählter Punkt zählt nicht mehr.
 *
 * Entscheid Christof, 2026-08-10: Wer einen Faden wieder herausnimmt, soll auch
 * dessen Punkte zurückgenommen bekommen. Vorher blieb die Zählung stehen und
 * nur die Anzeige verschwand, was die Zahl im Rhizom unberechenbar machte
 * (Punkte kumulierten, Flächen folgten der Anzeige).
 *
 * Der Cloud-Spiegel wird SOFORT mit dem vollen Rest überschrieben, sonst
 * brächte der nächste Pull die Spur zurück (er vereinigt und löscht nie).
 *
 * Das anonyme Zähl-Register (`KEY_GEZAEHLT`) bleibt bewusst stehen: Die
 * Kollektiv-Zähler im «alle» laufen nicht rückwärts, und erneutes Anwählen darf
 * sie nicht ein zweites Mal hochtreiben.
 */
export function loescheSpur(ids: string[]): void {
  if (typeof window === "undefined" || ids.length === 0) return;
  const weg = new Set(ids);
  const rest = lesen().filter((s) => !weg.has(s.id));
  schreiben(rest);
  window.dispatchEvent(new CustomEvent(SPUR_EVENT, { detail: { entfernt: ids } }));
  const code = getSession()?.studentCode;
  if (!code) return;
  const ref = spurenDocRef(code);
  if (!ref) return;
  void setDoc(
    ref,
    { ids: rest.map((s) => s.id), updatedAt: serverTimestamp() },
    { merge: true },
  ).catch((err) => console.warn("[spuren] loescheSpur mirror failed", err));
}

/** Alle Spuren lesen (nur lokal). */
export function leseSpuren(): Spur[] {
  return lesen();
}

/** Anzahl Spuren mit einem Präfix, z.B. "philosophische-perspektive:weisheit". */
export function zaehleSpuren(prefix: string): number {
  return lesen().filter((s) => s.id.startsWith(prefix)).length;
}

/**
 * Numerische Indizes der besuchten Knoten eines Musters, z.B. für spurKey
 * "vorhang-auf:weisheit" → [0, 3, 5]. Erlaubt Komponenten, ihren Zustand
 * beim Laden wiederherzustellen (Knoten bleiben offen).
 */
export function leseSpurenIndices(spurKey: string): number[] {
  const prefix = `${spurKey}:`;
  const out: number[] = [];
  for (const s of lesen()) {
    if (s.id.startsWith(prefix)) {
      const n = Number(s.id.slice(prefix.length));
      if (Number.isInteger(n)) out.push(n);
    }
  }
  return out;
}

/**
 * Cloud → lokal: die Pro-Nutzer-Spur aus Firestore holen und mit dem lokalen
 * Bestand vereinen (Union, nie löschen). Feuert danach SPUR_EVENT, damit
 * offene Ansichten sich neu aufbauen. No-op ohne Code/Config. Idempotent.
 */
export async function zieheSpurenAusCloud(): Promise<void> {
  if (typeof window === "undefined") return;
  // Einmalige Bestands-Nachzählung (Reset 2026-07-22) — hier, weil jede
  // relevante Ansicht diese Funktion beim Laden aufruft.
  nachzaehlenNachReset();
  const code = getSession()?.studentCode;
  if (!code) return; // kein Code → nichts wiederherzustellen
  const ref = spurenDocRef(code);
  if (!ref) return;
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const remote = snap.data()?.ids;
    if (!Array.isArray(remote) || remote.length === 0) return;
    const spuren = lesen();
    const bekannt = new Set(spuren.map((s) => s.id));
    let neu = false;
    for (const id of remote) {
      if (typeof id === "string" && !bekannt.has(id)) {
        spuren.push({ id, t: Date.now() });
        bekannt.add(id);
        neu = true;
      }
    }
    if (neu) {
      schreiben(spuren);
      window.dispatchEvent(new CustomEvent(SPUR_EVENT, { detail: { cloud: true } }));
    }
  } catch (err) {
    console.warn("[spuren] cloud pull failed", err);
  }
}

/** Aktueller Nutzer-Code (oder null) — für die Anzeige «Dein Code». */
export function aktuellerCode(): string | null {
  return getSession()?.studentCode ?? null;
}

export interface AktivitaetsZahlen {
  /** Angeklickte/gelesene Knoten (alle Landschaften). */
  knoten: number;
  /** Eingeloggte Verbindungen (Kombinationen aus zwei Knoten). */
  kombinationen: number;
  /** Angeschaute Bilder der Bilderstrecken (geöffnete Bilder). */
  bilder: number;
  /** Durchgegangene Bild-Hotspots (Bildpunkte). */
  bildpunkte: number;
  /** Geschaute Video-Impulse. */
  videos: number;
  /** «Mehr dazu wissen»-Merkzeichen (Wünsche nach Vertiefung). */
  wuensche: number;
  /** Aufgeklappte «Mehr lesen»-Vertiefungen. */
  mehr: number;
}

/** Art einer Spur — zentrale Klassifikation (lokal wie anonym gleich genutzt). */
export type SpurArt =
  | "wunsch"
  | "mehr"
  | "video"
  | "bildpunkt"
  | "kante"
  | "bild"
  | "punkt";

/**
 * Eine Spur-ID einer Art zuordnen. Reihenfolge ist wichtig: Hotspots
 * (`…:hs<n>`) enthalten auch `:bild`, müssen also VOR `:bild` geprüft werden.
 */
export function spurArt(id: string): SpurArt {
  if (id.startsWith("wunsch:")) return "wunsch";
  if (id.startsWith("mehr:")) return "mehr";
  if (id.startsWith("video:")) return "video";
  if (id.includes(":hs")) return "bildpunkt";
  if (id.includes(":kanten-")) return "kante";
  if (id.includes(":bild")) return "bild";
  return "punkt";
}

/**
 * Die Spur-ID ohne führende Art-Kennung.
 *
 * `mehr:` und `wunsch:` stehen VORNE in der ID, der Abschnitt dahinter:
 * `mehr:philosophische-perspektive:epochen:2`. Ein `startsWith`-Vergleich mit
 * dem Abschnitts-Präfix `philosophische-perspektive:epochen` schlägt darum fehl,
 * und Vertiefungen sowie Merkzeichen fielen aus den Abschnitts-Zählern heraus.
 * Wer eine Spur einem Abschnitt zuordnet, vergleicht mit `spurBasis(id)`.
 *
 * `video:` bleibt stehen: Video-Spuren haben keinen Abschnitts-Teil, und die
 * Knotenkarte führt «Videos» als eigenen Bereich über genau dieses Präfix.
 */
export function spurBasis(id: string): string {
  if (id.startsWith("wunsch:")) return id.slice("wunsch:".length);
  if (id.startsWith("mehr:")) return id.slice("mehr:".length);
  return id;
}

/**
 * Aktivitäts-Kennzahlen aus dem lokalen Spuren-Bestand — fürs Aktivitätsnetz.
 * Hotspot-Spuren (`…:hs…`) zählen als Bildpunkte, Bild-Spuren (`…:bild…`) als
 * geöffnete Bilder, Kanten (`…:kanten-…`) als Kombinationen, Video-Spuren
 * (`video:…`) als geschaute Videos, alles Übrige als Knoten.
 */
export function zaehleAktivitaet(): AktivitaetsZahlen {
  let knoten = 0;
  let kombinationen = 0;
  let bilder = 0;
  let bildpunkte = 0;
  let videos = 0;
  let wuensche = 0;
  let mehr = 0;
  for (const s of lesen()) {
    switch (spurArt(s.id)) {
      case "wunsch": wuensche++; break;
      case "mehr": mehr++; break;
      case "video": videos++; break;
      case "bildpunkt": bildpunkte++; break;
      case "kante": kombinationen++; break;
      case "bild": bilder++; break;
      default: knoten++;
    }
  }
  return { knoten, kombinationen, bilder, bildpunkte, videos, wuensche, mehr };
}

/**
 * Aus den anonymen Poll-Zählern (`spuren-lernseite-2`, counts[id] += 1 pro
 * Browser) die Kollektiv-Kennzahlen für das Aktivitätsnetz herausrechnen —
 * dieselbe Klassifikation wie lokal. Flächen liegen NICHT hier (berechnete
 * Geometrie) → eigener Zähler in `auswertung.ts`.
 */
/**
 * Die meistbesuchten Inhalts-Punkte aus den anonymen Poll-Zählern — gleiche
 * Regeln wie die Orakel-Auswertung: inhaltslose Muster (`…:gewebe…`) und
 * «Die KI im Kontext» bleiben draussen, Bild-Hotspots werden aufs Bild
 * aggregiert. Fürs Rhizom (beschriftete «Blüten») und Vergleiche.
 */
export function meistBesuchteAusPoll(
  counts: PollCounts,
  limit = 5,
): { id: string; alle: number }[] {
  const acc = new Map<string, number>();
  for (const key in counts) {
    if (key.includes(":gewebe")) continue;
    if (key.startsWith("vorhang-auf:kontext")) continue;
    const art = spurArt(key);
    let base: string | null = null;
    if (art === "bildpunkt") base = key.replace(/:hs\d+$/, "");
    else if (art === "punkt" || art === "video") base = key;
    if (!base) continue;
    const n = Number(counts[key]) || 0;
    if (n > 0) acc.set(base, (acc.get(base) ?? 0) + n);
  }
  return [...acc.entries()]
    .map(([id, alle]) => ({ id, alle }))
    .sort((a, b) => b.alle - a.alle)
    .slice(0, limit);
}

export function zaehleAlleAusPoll(counts: PollCounts): {
  punkte: number;
  bildpunkte: number;
  videos: number;
  mehr: number;
  wuensche: number;
} {
  let punkte = 0;
  let bildpunkte = 0;
  let videos = 0;
  let mehr = 0;
  let wuensche = 0;
  for (const id in counts) {
    const n = Number(counts[id]) || 0;
    if (n <= 0) continue;
    switch (spurArt(id)) {
      case "video": videos += n; break;
      case "bildpunkt": bildpunkte += n; break;
      case "punkt": punkte += n; break;
      case "mehr": mehr += n; break;
      case "wunsch": wuensche += n; break;
      // bild (geöffnete Bilder) und kante (Kombinationen) sind keine
      // Netz-Kennzahlen.
      default: break;
    }
  }
  return { punkte, bildpunkte, videos, mehr, wuensche };
}
