# Korrektorat — Mailvorlagen

Zwei Texte zum Kopieren: einer an die Korrekturperson, einer an Christof. Beide
sind pro Runde wiederverwendbar — nur Runde, Frist und Passcode anpassen.

Ablauf und Einrichtung: [KORREKTORAT.md](KORREKTORAT.md). Die ausführliche
Anleitung zum Anhängen: [anleitung-korrektor.md](anleitung-korrektor.md).

---

## 1 · An Sebastian

> **Betreff:** Korrektorat «Lernumgebung zu KI» — Zugang und Anleitung

Lieber Sebastian

Die Lernumgebung zu KI ist so weit, dass sie ein Korrektorat verträgt. Es sind
zwei Lernseiten mit rund 3100 Textstellen — Fliesstexte, Titel, Fragen,
Bildunterschriften, Knopfbeschriftungen.

Du brauchst dafür weder Programmierkenntnisse noch Zugang zum Quellcode. Es gibt
einen kleinen Web-Editor, der dir ein Feld pro Textstelle zeigt:

**Adresse:** https://hep-ki.vercel.app/korrektorat
**Passcode:** ⟨HIER EINSETZEN⟩

So läuft es:

1. Anmelden. Du siehst eine Übersicht aller Dateien mit Text, gruppiert nach
   Lernseite und Thema.
2. Eine Datei anklicken. Links stehen die Abschnitte in der Reihenfolge, in der
   sie im Lernset vorkommen, rechts die Textstellen zum Korrigieren.
3. Oben rechts auf «Speichern» klicken. Das kannst du so oft tun, wie du willst
   — auch mitten in einer Datei.

Wenn dir ein Fehler auffällt und du nicht weisst, wo er steht: Ganz oben auf der
Übersichtsseite gibt es **«Textstelle suchen»**. Du tippst das falsche Wort ein,
und der Editor durchsucht alle Texte beider Lernseiten auf einmal. Ein Klick auf
einen Treffer öffnet die Stelle direkt. Das ist meist der schnellste Weg,
besonders wenn du denselben Fehler mehrfach vermutest.

Was du tippst, aber noch nicht gespeichert hast, bleibt in deinem Browser
erhalten. Verlassen kannst du dich aber nur auf Gespeichertes, darum am Ende
einer Sitzung bitte speichern.

Der Editor lässt bewusst nur **Wortlaut** zu. Technische Werte wie Verweise,
Bildpfade und Kennungen siehst du gar nicht erst — du kannst dort nichts kaputt
machen. Was auch nicht geht: Struktur ändern, also eine Antwortoption ergänzen
oder Abschnitte umstellen. Wenn dir so etwas auffällt, schreib es mir einfach,
wir machen es im Code.

Vier Schreibweisen, die im Projekt gelten:

- echte Umlaute, nie «ae/oe/ue»
- «ss» statt «ß» (Schweizer Schreibweise): Grösse, heisst, weiss
- «Guillemets» für Anführungen
- die Lernenden werden geduzt

Falls dir davon etwas im Bestand auffällt: bitte gleich mitkorrigieren.

Im Anhang die ausführliche Anleitung — sie erklärt die Suche, den Filter «nur
Geänderte» und was zu tun ist, wenn die Meldung «Quelle hat sich geändert»
auftaucht. Für den Anfang brauchst du sie nicht.

Zeitlich hätten wir gern einen Zwischenstand bis ⟨DATUM⟩ und den Abschluss bis
⟨DATUM⟩. Melde dich, wenn etwas klemmt oder unklar wirkt — auch inhaltlich.

Herzlichen Dank und liebe Grüsse
Pietro

*Anhang: anleitung-korrektor.pdf*

---

## 2 · An Christof

> **Betreff:** Korrektorat läuft — was Sebastian sieht und was du ihm sagen kannst

Lieber Christof

Sebastian macht das Korrektorat für die Lernumgebung zu KI, also auch für deine
Lernseite 2. Weil du mit ihm im Austausch bist, kurz das Nötigste.

**Wie es technisch läuft.** Sebastian hat keinen Repo-Zugang. Er arbeitet in
einem Editor unter `/korrektorat`, der ihm ein Formular pro Textstelle zeigt.
Jede Speicherung wird ein Commit auf einem Korrektorat-Branch, und daraus wächst
**ein Pull Request pro Runde**. Für dich heisst das: seine Korrekturen an
Lernseite 2 kommen als PR, nicht als direkte Commits. Du reviewst und mergst sie
wie jeden anderen PR.

**Was er ändern kann:** ausschliesslich Wortlaut. Titel, Fliesstexte, Fragen,
Bildunterschriften, Knopfbeschriftungen.

**Was er nicht kann** — und was er darum bei dir oder mir anmelden wird:

- Struktur: eine Antwortoption ergänzen, einen Abschnitt umstellen, eine Station
  streichen.
- Technisches: Verweise, Bildpfade, Kennungen, Ikonennamen. Das sieht er gar
  nicht erst, er kann dort nichts kaputt machen.
- Geschweifte Klammern in Fliesstext — die haben im Code eine eigene Bedeutung.

Wenn er dir so etwas vorschlägt: **notieren und selber umsetzen**, nicht an ihn
zurückgeben. Er hat keine Möglichkeit dazu.

**Eine Bitte für die Laufzeit der Runde:** möglichst nicht gleichzeitig an den
Texten von Lernseite 2 arbeiten. Der Editor merkt, wenn sich eine Datei unter
ihm verändert hat, und lehnt betroffene Korrekturen ab, statt sie an die falsche
Stelle zu schreiben — für Sebastian heisst das Nacharbeit. Wenn du dringend
etwas ändern musst, sag mir kurz Bescheid, dann koordinieren wir das.

**Was du ihm schreiben kannst,** wenn er dich zu Lernseite 2 fragt:

- Inhaltliche Rückfragen zu Formulierungen: direkt beantworten, das ist genau
  sein Auftrag.
- «Da fehlt etwas» oder «das gehört anders herum»: aufnehmen, ihm sagen, dass du
  es im Code machst — er soll nicht darauf warten, sondern weiterkorrigieren.
- «Ich finde diese Stelle nicht im Editor»: Datei, Abschnitt und Wortlaut
  erfragen. Manche Texte setzen sich erst beim Anzeigen aus mehreren Teilen
  zusammen; die korrigieren wir im Code.

Ein Hinweis noch: Eine Datei von dir taucht bei ihm mit dem Vermerk «Noch nicht
in eine Seite eingebunden» auf — `SchablonenZeitstrahl.tsx`, immerhin 283
Textstellen. Sie hängt aktuell an keiner Seite. Wenn das so bleiben soll, sag es
mir, dann nehme ich sie raus; wenn sie noch kommt, lassen wir sie drin.

Wenn du beim Bauen neuer Komponenten Text-Props einführst, müssen die einmal in
`src/lib/korrektorat/policy.mjs` eingetragen werden, sonst sieht Sebastian sie
nicht. Steht in der CLAUDE.md, ist ein Zweizeiler.

Liebe Grüsse
Pietro
