"use client";

/**
 * Engagement-Tracker fuer ki26 (Vorbild: 10mio `src/lib/engagement.ts`).
 *
 * Schreibt anonyme Engagement-Events **create-only** nach
 * `abstimmungen/ki26/engagement/{eventId}` — die Datenquelle fuer ein
 * Owner-only-Dashboard (analog `npm run engagement` in 10mio). Anders als der
 * fruehere `activity.ts` (top-level `activities` + anon-Auth-`uid`) sind die
 * Events jetzt unter dem ki26-Namespace abgelegt und tragen den **Animal-Code**
 * (`studentCode`) statt einer anonymen Firebase-`uid`.
 *
 * Events:
 *   - `module_view`  → einmal beim Laden der Seite,
 *   - `module_close` → bei `visibilitychange=hidden` / `pagehide`, mit `sessionMs`
 *     (Sessions < 1 s werden als Rauschen verworfen),
 *   - `block_view`   → erstes Mal, dass ein `[data-block-id]` in den Viewport
 *     kommt (IntersectionObserver, einmal je Block je Seitenaufruf).
 *
 * Block-*Completion* wird bewusst NICHT als Event dupliziert — das steht bereits
 * im gespiegelten `progress.blocks[id].completed` (siehe `progressMirror.ts`).
 *
 * Best-effort: alle Schreibvorgaenge sind in try/catch gekapselt und duerfen die
 * Seite nie blockieren. No-op ohne Schueler-Session (anonyme Nutzung ohne Code →
 * kein Cloud-Schreiben) und ohne Firebase-Config.
 */

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebase } from "./firebase";
import { seg, UNIT_ID } from "./paths";
import { currentStudentCode } from "./session";

type EventType = "module_view" | "module_close" | "block_view";

interface BaseEvent {
  type: EventType;
  studentCode: string;
  slug: string;
}
interface ModuleViewEvent extends BaseEvent { type: "module_view" }
interface ModuleCloseEvent extends BaseEvent { type: "module_close"; sessionMs: number }
interface BlockViewEvent extends BaseEvent { type: "block_view"; blockId: string }
type EngagementEvent = ModuleViewEvent | ModuleCloseEvent | BlockViewEvent;

async function emit(evt: EngagementEvent): Promise<void> {
  try {
    const { db } = getFirebase();
    if (!db) return;
    const colRef = collection(db, ...seg.engagementCol());
    await addDoc(colRef, {
      ...evt,
      unitId: UNIT_ID,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    // Engagement ist best-effort — nie die Seite brechen.
    if (typeof console !== "undefined") console.warn("[engagement] emit failed", err);
  }
}

export interface InitOptions {
  slug: string;
  /** Optionaler expliziter Code; default = aktueller Session-Code. */
  studentCode?: string;
}

/**
 * Engagement-Tracking fuer eine Seite einrichten. Gibt eine Cleanup-Funktion
 * zurueck (Listener entfernen, letzte Session flushen) — fuer den React-
 * `useEffect`-Cleanup. No-op (gibt eine leere Cleanup-Funktion zurueck), wenn
 * kein Schueler-Code vorliegt oder kein DOM verfuegbar ist.
 */
export function initEngagement({ slug, studentCode }: InitOptions): () => void {
  const code = studentCode ?? currentStudentCode();
  if (!code || !slug || typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  const base = { studentCode: code, slug };

  // ── Session-Timing ──────────────────────────────────────────────────
  // visibleSince = ms-Zeitstempel, als die Seite zuletzt sichtbar wurde.
  // null = Seite verborgen oder Session bereits geflusht.
  let visibleSince: number | null =
    document.visibilityState === "visible" ? Date.now() : null;

  function flushSession(): void {
    if (visibleSince == null) return;
    const sessionMs = Date.now() - visibleSince;
    visibleSince = null;
    if (sessionMs < 1000) return; // < 1 s — vermutlich Sofort-Schliessung, Rauschen
    void emit({ type: "module_close", sessionMs, ...base });
  }

  function onVisibilityChange(): void {
    if (document.visibilityState === "visible") {
      if (visibleSince == null) visibleSince = Date.now();
    } else {
      flushSession();
    }
  }

  document.addEventListener("visibilitychange", onVisibilityChange);
  // `pagehide` feuert zuverlaessig browseruebergreifend beim Wegnavigieren/Schliessen.
  window.addEventListener("pagehide", flushSession);

  // Initiales module_view — einmal pro Seitenaufruf.
  void emit({ type: "module_view", ...base });

  // ── Block-View (IntersectionObserver, einmal je id je Session) ──────
  const seen = new Set<string>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        const blockId = el.dataset.blockId;
        if (!blockId || seen.has(blockId)) continue;
        seen.add(blockId);
        io.unobserve(el);
        void emit({ type: "block_view", blockId, ...base });
      }
    },
    { threshold: 0.4 },
  );

  // Beobachtung bis zum naechsten Frame verschieben — Block-Komponenten sind
  // zum Script-Eval-Zeitpunkt evtl. noch nicht gemountet.
  const raf = requestAnimationFrame(() => {
    document
      .querySelectorAll<HTMLElement>("[data-block-id]")
      .forEach((el) => io.observe(el));
  });

  // ── Cleanup ─────────────────────────────────────────────────────────
  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("pagehide", flushSession);
    flushSession(); // letzte sichtbare Session beim Unmount mitnehmen
  };
}
