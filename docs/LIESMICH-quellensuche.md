# Quellensuche · Lernseite 2 «Eine ganz neue Partnerschaft»

Alles, was ein Recherche-Modell braucht, um Quellen für ein Lernset zu
Künstlicher Intelligenz und Philosophie (Berufsfachschule, Deutschschweiz)
nachzutragen. Stand: 26. Juli 2026.

## Was ist wo

| Datei | Inhalt |
|---|---|
| `quellenauftrag/paket-01.md` … `paket-08.md` | **Hier anfangen.** Je 35 Textblöcke mit prüfbarer Behauptung, nach Dringlichkeit sortiert. Jedes Paket ist eigenständig und enthält Auftrag und Rückgabeformat. |
| `quellen-lernseite-2.md` | **Was schon belegt ist.** Alle gesetzten Quellen mit Fundstelle und Prüfdatum, alle begründeten Nicht-Belege, und die Aussagen mit Standdatum. Vorher lesen, damit nicht doppelt gesucht wird. |
| `quellenauftrag-lernseite-2.md` | Alle Blöcke zum Nachschlagen, auch die deutenden. Nicht zum Abarbeiten. |
| `inhalte-lernseite-2.md` | Die vollständige Lesefassung des Lernsets für den Zusammenhang. |
| `quellenauftrag-index.json` | Kennung → Datei, Abschnitt, Feld, Text, Dringlichkeit. Für die maschinelle Rückführung. |

## Vorgehen

1. **Ein Paket auf einmal**, nicht alles. Bei über 400 Blöcken gleichzeitig
   wird jede Antwort oberflächlich.
2. **Zuerst `quellen-lernseite-2.md` lesen.** Was dort steht, ist erledigt.
3. Einen Modus nutzen, der **tatsächlich sucht** (Deep Research, Perplexity),
   nicht den normalen Chat. Ein Modell, das URLs aus dem Gedächtnis nennt,
   erfindet sie.
4. Antwort als Markdown-Tabelle zurückgeben, genau im Format aus dem Paket.

## Was besonders gebraucht wird

**Aktuelle Zahlen.** Viele Angaben stammen aus 2023 und 2024, wir sind Mitte
2026. Gesucht sind neuere Stände zu: Stromverbrauch von Rechenzentren, Emissionen
der grossen Anbieter, Marktkonzentration bei Chips, Regulierung, Arbeitsmarkt.
Wo eine Zahl veraltet ist, gehört die neue in die Spalte «Konkretisierung».

**Konkretes statt Allgemeines.** Der Beleg allein ist die halbe Arbeit. Wertvoll
ist die Angabe, die einen zu allgemeinen Satz schärft: eine Zahl, ein Datum, ein
Fallbeispiel.

## Regeln

- **Nichts erfinden.** Keine Quelle gelesen heisst: Block weglassen. Jede
  gemeldete URL wird nachträglich abgerufen und geprüft.
- **Deutschsprachig und frei zugänglich bevorzugt.** Behörden (BFS, EDÖB, IGE,
  EU-Kommission), Statistikämter, öffentliche Medien, Universitäten, Museen.
  Fachaufsätze nur, wenn es nichts Zugänglicheres gibt.
- **Keine Seiten hinter Bezahlschranke oder Bot-Sperre.** Ein Link, der nur mit
  Glück funktioniert, ist unbrauchbar.
- **Standdatum nennen**, wenn eine Angabe altert.

## Was mit der Antwort passiert

Jede URL wird abgerufen und geprüft (`node docs/quellen-pruefen.js antwort.md`):
Existiert die Kennung? Antwortet die URL? Kommen Stichwörter der behaupteten
Aussage auf der Seite vor? Erst was das übersteht, kommt ins Lernset.

Rechne damit, dass etwa die Hälfte durchfällt. Das ist normal und der Grund für
die Prüfung. Ein Beleg, der nicht existiert, ist schlimmer als keiner.
