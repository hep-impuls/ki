# Entscheidungen

Wichtige Sprach-, Design- und Inhalts-Entscheidungen für die *Lernumgebung zu
KI*. Jüngste Einträge oben. Format: kurzes Datum + ein Absatz Entscheidung,
optional eine Liste betroffener Stellen.

Wenn etwas geändert oder neu festgelegt wird, das nicht aus dem Code allein
ersichtlich ist (Sprachregelungen, Naming, didaktische Linie, Design-Prinzipien,
Verzicht auf Features) — hier festhalten.

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
