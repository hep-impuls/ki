# Quellensuche · Lernseite 2 «Eine ganz neue Partnerschaft»

Dieses Paket enthält alles, was ein Recherche-Modell braucht, um Quellen für ein
Lernset zu Künstlicher Intelligenz und Philosophie (Berufsfachschule,
Deutschschweiz) nachzutragen.

## Was ist wo

| Datei | Inhalt |
|---|---|
| `quellenauftrag/paket-01.md` … `paket-08.md` | **Hier anfangen.** Je 35 Textblöcke mit prüfbarer Behauptung, nach Dringlichkeit sortiert. Jedes Paket ist eigenständig und enthält Auftrag und Rückgabeformat. |
| `quellenauftrag-lernseite-2.md` | Alle 462 Blöcke zum Nachschlagen, auch die deutenden. Nicht zum Abarbeiten. |
| `inhalte-lernseite-2.md` | Die vollständige Lesefassung des Lernsets, nach Abschnitten geordnet, für den Zusammenhang. |
| `quellenauftrag-index.json` | Kennung → Datei, Abschnitt, Feld, Text, Dringlichkeit. Für die maschinelle Rückführung. |

## Vorgehen

1. **Ein Paket auf einmal**, nicht alles. Bei 462 Blöcken gleichzeitig wird jede
   Antwort oberflächlich.
2. Nutze einen Modus, der **tatsächlich sucht** (Gemini Deep Research,
   Perplexity), nicht den normalen Chat. Ein Modell, das URLs aus dem Gedächtnis
   nennt, erfindet sie.
3. Antwort als Markdown-Tabelle zurückgeben, genau im Format, das im Paket steht.

## Die wichtigste Spalte

«Konkretisierung». Der Beleg selbst ist nur die halbe Arbeit. Wertvoll ist die
konkrete Angabe, die einen zu allgemeinen Satz schärft: eine Zahl, ein Datum,
ein Fallbeispiel. Genau daran fehlt es den Texten.

## Was mit der Antwort passiert

Jede gemeldete URL wird abgerufen und geprüft (`node docs/quellen-pruefen.js
antwort.md`). Kontrolliert wird: Existiert die Kennung? Antwortet die URL?
Kommen Stichwörter der behaupteten Aussage auf der Seite vor? Erst was diese
Prüfung übersteht, kommt ins Lernset.

Rechne damit, dass etwa die Hälfte durchfällt. Das ist normal und der Grund für
die Prüfung. Ein Beleg, der nicht existiert, ist schlimmer als keiner.

## Bereits belegte Stellen

Im Quellenauftrag stehen unter manchen Blöcken schon Zeilen mit **Belegt** oder
**Kein Beleg**. Dort ist die Arbeit getan: «Belegt» heisst, die Quelle wurde
abgerufen und die Aussage darin kontrolliert. «Kein Beleg» heisst, es wurde
gesucht und nichts Brauchbares gefunden, mit Begründung. Beides bitte nicht
überschreiben.
