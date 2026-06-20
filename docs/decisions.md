# Entscheidungen

Wichtige Sprach-, Design- und Inhalts-Entscheidungen für die *Lernumgebung zu
KI*. Jüngste Einträge oben. Format: kurzes Datum + ein Absatz Entscheidung,
optional eine Liste betroffener Stellen.

Wenn etwas geändert oder neu festgelegt wird, das nicht aus dem Code allein
ersichtlich ist (Sprachregelungen, Naming, didaktische Linie, Design-Prinzipien,
Verzicht auf Features) — hier festhalten.

---

## 2026-06-20 — Submodul 1 „Intro" → „Philosophische Perspektive"

Das erste Submodul von Lernseite 2 heisst neu **„Philosophische Perspektive"**
(vorher „Intro"). Inhaltlicher roter Faden: **digitale Transformation** (erklären)
→ **wachsende Unsicherheit** (Beispiele) → **Philosophie schafft Orientierung**
(Begriffe & Perspektiven klären) → **neuer Akteur** (Begriffsarbeit, Akteurs-
Modell). Die **Umfrage** (Perspektiven-Check) ist der **Einstieg** dieses
Submoduls.

Slug bleibt `submodul-1` (stabil; nur Anzeige-Titel/Icon geändert). Angepasst in
[src/config/unit.ts](../src/config/unit.ts) (icon `psychology`, subtitle
„Orientierung") und [submodul-1/page.tsx](../src/app/lernen/lernseite-2/submodul-1/page.tsx).
Skript-Datei behält Namen `…-intro.md` (per submodul-1 verschlüsselt), Inhalt
neu strukturiert.

**Bewertungs-Schleife** als didaktischer Kern: KI kommentiert die
Gesamtauswertung → Teilnehmende bewerten den Kommentar → KI gibt eine
Meta-Einschätzung zu dieser Bewertung. Macht sichtbar, dass am Ende der Mensch
urteilt (auch über die KI). KI-Aufrufe nur auf Aggregat-Ebene, selten ausgelöst,
günstiges Modell — Details im
[Skript](skripte/lernseite-2-submodul-1-intro.md#bewertungs-schleife-teilnehmende--ki).

---

## 2026-06-20 — Anonymität der Einstiegs-Umfrage: Datenminimierung (Modell A)

Die Einstiegs-Umfrage (Perspektiven-Check, Lernseite 2 / Intro) wird so gebaut,
dass **Einzelantworten möglichst nicht individuell rückführbar** sind. Leitsatz:
**Datenminimierung schützt stärker als jede Security Rule** — wer Console-/
Admin-Zugriff hat, umgeht Rules; was nie gespeichert wird, kann niemand
auswerten (auch kein Admin, auch kein Leck).

**Gewähltes Modell A — nur Aggregat:**
- Eigene Antworten bleiben **im Browser** (localStorage/State), verlassen das
  Gerät nicht als verknüpfter Datensatz.
- Firestore speichert **nur Zähler** (pro Frage/Option `increment(+1)`),
  inkl. Likes und einer groben Perspektiven-Kategorie — **keine
  Einzeldatensätze**, also nichts zum Re-Identifizieren.
- Persönlicher Vergleich „du vs. Gruppe" wird **client-seitig** gegen die
  öffentlichen Aggregat-Zähler gerechnet.
- KI kommentiert nur das Aggregat (ein Aufruf) → auch kostengünstig.

**Falls je Einzeldocs nötig (Modell B), dann mit allen Schichten:** create-only/
kein-read in Rules · Shape-Validierung (`keys().hasOnly([...])`, keine
Identitätsfelder) · Zeitstempel vergröbern (Datum/Stunde) · k-Anonymität bei
Anzeige (≥ 5) · kein Freitext in den anonymen Daten · App Check · optional
ephemer (Function aggregiert, löscht Rohdoc).

**Zuständigkeit:** `firestore.rules` ist gemeinsam/Pietro — Rules werden nach
diesem Konzept koordiniert gebaut. Umfrage-Inhalt + Anonymitäts-Konzept sind
Christofs Bereich. Umfrage-Entwurf:
[skripte/lernseite-2-submodul-1-intro.md](skripte/lernseite-2-submodul-1-intro.md#einstiegs-umfrage--perspektiven-check).

---

## 2026-06-14 — Visualisierungen als Sandbox-Route (Option B)

Inhaltliche Visualisierungen werden vor dem Einbau ins Submodul **im selben
Repo unter `/sandbox/**`** als Werkstatt-Route entwickelt — nicht als separates
Vercel-Projekt. Begründung: eigene URL zum Iterieren, kein zweites Repo / kein
doppeltes Auth-System, minimaler Migrationspfad (Komponenten-Import).

Konvention für solche Visualisierungs-Komponenten: **self-contained Client-
Komponenten ohne Firebase-/Server-Logik**, damit sie Pietros geplanten Auth-/
Hosting-Umzug unverändert überstehen.

Erstes Beispiel: `/sandbox/intro-visual` (Akteurs-Modell für das Intro-Submodul
von Lernseite 2). Sandbox-Routen tauchen nicht in der SideNav auf (die liest
nur `unit.modules`).

---

## 2026-06-14 — Inhalts-Skripte in `docs/skripte/`

Jedes Submodul bekommt vor der Umsetzung in `page.tsx` ein **inhaltliches
Skript** als Markdown unter `docs/skripte/lernseite-{n}-submodul-{m}-{kurzname}.md`.
Das Skript enthält Kernthese, Lernziele, Schwerpunkte, Reflexionsfragen,
Visualisierungsideen und Notizen — wird vom Owner fortlaufend ergänzt und
ist via `git log` versioniert (= „safe abgelegt").

Erstes Beispiel: [skripte/lernseite-2-submodul-1-intro.md](skripte/lernseite-2-submodul-1-intro.md).

---

## 2026-06-14 — Co-Autoren-Workflow + Owner-Mapping

Verbindliche Regeln zur kollaborativen Arbeit zwischen Pietro und Christof
sind in [CLAUDE.md](../CLAUDE.md#workflow--kollaboration-zwingend) festgehalten:
Session-Start-Routine (CLAUDE.md lesen + `git pull --rebase`), Session-Ende
(commit + pull --rebase + push), Owner-Mapping pro Lernseite, verbindliche
Stil-Bibliothek (Material Symbols, MD3-Tokens), Submodul-Template.

Auf Feature-Branches wird vorerst verzichtet — Aufwand vs. Nutzen passt für
ein 2-Personen-Setup nicht.

---

## 2026-06-14 — Sprachregelung: „Lernumgebung zu KI"

Die Plattform wird durchgehend mit **„Lernumgebung zu KI"** bezeichnet — nicht
„KI-Lernumgebung". Klingt offener und weniger als Komposita-Klotz.

Angepasst in:
- [src/app/layout.tsx](../src/app/layout.tsx) — Metadata-`title`
- [src/config/unit.ts](../src/config/unit.ts) — `unit.title`
- [README.md](../README.md) — H1

Gilt für alle künftigen Texte (UI, Doku, README, Commit-Messages).
