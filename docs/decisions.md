# Entscheidungen

Wichtige Sprach-, Design- und Inhalts-Entscheidungen für die *Lernumgebung zu
KI*. Jüngste Einträge oben. Format: kurzes Datum + ein Absatz Entscheidung,
optional eine Liste betroffener Stellen.

Wenn etwas geändert oder neu festgelegt wird, das nicht aus dem Code allein
ersichtlich ist (Sprachregelungen, Naming, didaktische Linie, Design-Prinzipien,
Verzicht auf Features) — hier festhalten.

---

## 2026-06-14 — Sprachregelung: „Lernumgebung zu KI"

Die Plattform wird durchgehend mit **„Lernumgebung zu KI"** bezeichnet — nicht
„KI-Lernumgebung". Klingt offener und weniger als Komposita-Klotz.

Angepasst in:
- [src/app/layout.tsx](../src/app/layout.tsx) — Metadata-`title`
- [src/config/unit.ts](../src/config/unit.ts) — `unit.title`
- [README.md](../README.md) — H1

Gilt für alle künftigen Texte (UI, Doku, README, Commit-Messages).
