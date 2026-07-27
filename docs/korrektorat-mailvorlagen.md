# Korrektorat — Mailvorlagen

Drei Texte zum Kopieren:

1. **An Sebastian** — Zugang und Einstieg, zu Beginn einer Runde.
2. **An Christof** — was er über den Ablauf wissen muss und was er Sebastian
   schicken soll.
3. **Zwischendurch an Sebastian** — wenn während einer laufenden Runde am Inhalt
   gearbeitet werden musste.

Alle drei sind pro Runde wiederverwendbar — nur Runde, Frist und Passcode
anpassen. Ablauf und Einrichtung: [KORREKTORAT.md](KORREKTORAT.md).

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
**Passcode:** ⟨kommt separat⟩

So läuft es:

1. Anmelden. Du siehst eine Übersicht aller Dateien mit Text, gruppiert nach
   Lernseite und Thema.
2. Eine Datei anklicken. Links stehen die Abschnitte in der Reihenfolge, in der
   sie im Lernset vorkommen, rechts die Textstellen zum Korrigieren.
3. Oben rechts auf «Speichern» klicken. Das kannst du so oft tun, wie du willst
   — auch mitten in einer Datei.

**Der schnellste Weg, wenn dir ein Fehler auffällt:** Ganz oben auf der
Übersichtsseite gibt es «Textstelle suchen». Du tippst das falsche Wort ein, und
der Editor durchsucht alle Texte beider Lernseiten auf einmal. Du siehst pro
Treffer den Satz drumherum, und ein Klick öffnet die Stelle direkt. Besonders
praktisch, wenn du denselben Fehler mehrfach vermutest — einmal suchen, Liste
abarbeiten.

Was du tippst, aber noch nicht gespeichert hast, bleibt in deinem Browser
erhalten. Verlassen kannst du dich aber nur auf Gespeichertes, darum am Ende
einer Sitzung bitte speichern.

Der Editor lässt bewusst nur **Wortlaut** zu. Technische Werte wie Verweise,
Bildpfade und Kennungen siehst du gar nicht erst — du kannst dort nichts kaputt
machen. Was auch nicht geht: Struktur ändern, also eine Antwortoption ergänzen
oder Abschnitte umstellen. Wenn dir so etwas auffällt, schreib es uns einfach,
wir machen es im Code. Du musst nicht darauf warten, sondern kannst
weiterkorrigieren.

Vier Schreibweisen, die im Projekt gelten:

- echte Umlaute, nie «ae/oe/ue»
- «ss» statt «ß» (Schweizer Schreibweise): Grösse, heisst, weiss
- «Guillemets» für Anführungen
- die Lernenden werden geduzt

Falls dir davon etwas im Bestand auffällt: bitte gleich mitkorrigieren.

**Wer bei welcher Frage hilft:**

- **Lernseite 1** («Kann KI das? — eine Positionsreise») und alles Technische am
  Editor: ich.
- **Lernseite 2** («Eine ganz neue Partnerschaft», also «Vorhang auf», die
  philosophische Perspektive und das Orakel): Christof Glaus, ⟨MAILADRESSE⟩. Er
  hat diese Seite geschrieben und kann inhaltliche Rückfragen am besten
  beantworten.

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

> **Betreff:** Korrektorat läuft — Ablauf, und was gilt, wenn du noch etwas ändern willst

Lieber Christof

Sebastian macht das Korrektorat für die Lernumgebung zu KI, also auch für deine
Lernseite 2. Weil du mit ihm im Austausch bist, hier das Nötigste — und weiter
unten, was zu beachten ist, wenn du während der Runde noch etwas ändern
möchtest.

### Wie es läuft

Sebastian hat keinen Repo-Zugang. Er arbeitet in einem Editor unter
`/korrektorat`, der ihm ein Formular pro Textstelle zeigt. Jede Speicherung wird
ein Commit auf dem Branch `korrektorat/runde-1`, und daraus wächst **ein Pull
Request pro Runde**. Für dich heisst das: seine Korrekturen an Lernseite 2 kommen
als PR, nicht als direkte Commits. Du reviewst und mergst sie wie jeden anderen
PR.

**Was er ändern kann:** ausschliesslich Wortlaut. Titel, Fliesstexte, Fragen,
Bildunterschriften, Knopfbeschriftungen. Er hat auch eine Volltextsuche über alle
Texte beider Lernseiten, kann also gezielt nach einem Wort suchen und alle
Fundstellen abarbeiten.

**Was er nicht kann** — und was er darum bei dir oder mir anmelden wird:

- Struktur: eine Antwortoption ergänzen, einen Abschnitt umstellen, eine Station
  streichen.
- Technisches: Verweise, Bildpfade, Kennungen, Ikonennamen. Das sieht er gar
  nicht erst, er kann dort nichts kaputt machen.
- Geschweifte Klammern in Fliesstext — die haben im Code eine eigene Bedeutung.

Wenn er dir so etwas vorschlägt: **notieren und selber umsetzen**, nicht an ihn
zurückgeben. Er hat keine Möglichkeit dazu.

### Was du ihm schicken sollst

Die vollständige Anleitung liegt im Repo und ist die Datei, die er braucht:

**<https://github.com/hep-impuls/ki/blob/main/docs/anleitung-korrektor.md>**

Wenn er dich fragt, wie etwas geht, verweise darauf statt es selbst zu erklären —
so bleibt eine Fassung die gültige. Falls er sie nicht öffnen kann (er hat keinen
Repo-Zugang!), schick sie ihm als PDF oder kopier den Text in die Mail; ich habe
sie ihm mit dem Zugang schon einmal geschickt.

Fertige Textbausteine für die häufigsten Fälle stehen hier:
<https://github.com/hep-impuls/ki/blob/main/docs/korrektorat-mailvorlagen.md>

Was du ihm sonst schreiben kannst:

- **Inhaltliche Rückfragen zu Formulierungen:** direkt beantworten, das ist genau
  sein Auftrag.
- **«Da fehlt etwas» oder «das gehört anders herum»:** aufnehmen, ihm sagen, dass
  du es im Code machst — er soll nicht darauf warten, sondern weiterkorrigieren.
- **«Ich finde diese Stelle nicht im Editor»:** Datei, Abschnitt und Wortlaut
  erfragen. Manche Texte setzen sich erst beim Anzeigen aus mehreren Teilen
  zusammen; die korrigieren wir im Code.

### Wenn du während der Runde noch etwas ändern willst

Das ist der heikle Teil. Der Editor merkt, wenn sich eine Datei unter Sebastian
verändert hat, und **lehnt betroffene Korrekturen ab, statt sie an die falsche
Stelle zu schreiben**. Nichts geht kaputt — aber für ihn bedeutet es Nacharbeit.

**Am besten:** während der laufenden Runde nicht an den *Texten* von Lernseite 2
arbeiten. Neue Bausteine bauen, Layout, Logik, Bilder — alles unproblematisch.
Nur den Wortlaut bestehender Stellen möglichst in Ruhe lassen.

**Wenn es sein muss**, in dieser Reihenfolge:

1. Sag mir kurz Bescheid, damit wir es nicht doppelt tun.
2. Ändere und pushe auf `main` wie gewohnt.
3. Schreib Sebastian eine kurze Zeile: *welche Datei* betroffen ist und dass er
   sie neu laden soll. Vorlage dafür steht in den Mailvorlagen (Abschnitt 3).
   Verloren geht ihm dabei höchstens, was er in dieser Datei getippt, aber noch
   **nicht gespeichert** hatte — Gespeichertes ist sicher.

**Zwei Dinge zusätzlich:**

- **Ändere möglichst keine Stelle, die er schon korrigiert hat.** Sein Branch ist
  von `main` abgezweigt; wenn ihr beide denselben Satz anfasst, gibt es beim
  Mergen einen Konflikt, den ich von Hand auflösen muss. Ein Blick in den offenen
  PR zeigt dir, was er schon angefasst hat.
- **Commite nie in den Branch `korrektorat/runde-N`.** Der gehört ihm. Deine
  Änderungen gehen wie immer über `main` oder einen eigenen PR.

**Wenn du eine neue Komponente mit Text-Props baust:** Die Attributnamen müssen
einmal in `src/lib/korrektorat/policy.mjs` eingetragen werden, sonst sieht
Sebastian die neuen Texte gar nicht. Danach:

```
npm run korrektorat:test        # muss grün sein
npm run korrektorat:inventar    # nach Umbauten: meldet toten Code, der sichtbar wäre
```

Steht auch in der CLAUDE.md. Ist ein Zweizeiler, aber leicht zu vergessen.

### Ein Hinweis zu einer deiner Dateien

`SchablonenZeitstrahl.tsx` taucht bei Sebastian mit dem Vermerk «Noch nicht in
eine Seite eingebunden» auf — immerhin 283 Textstellen. Sie hängt aktuell an
keiner Seite. Wenn das so bleiben soll, sag es mir, dann nehme ich sie raus; wenn
sie noch kommt, lassen wir sie drin und er korrigiert sie gleich mit.

Liebe Grüsse
Pietro

---

## 3 · Zwischendurch an Sebastian

Kurze Nachricht, wenn während der laufenden Runde am Inhalt gearbeitet werden
musste. Von Christof oder mir, je nachdem, wer geändert hat.

> **Betreff:** Kurz zur Datei «⟨DATEITITEL⟩» — bitte neu laden

Lieber Sebastian

Wir haben an ⟨DATEITITEL⟩ noch etwas geändert. Bitte lade die Seite einmal neu,
bevor du dort weiterarbeitest — sonst kann es sein, dass der Editor beim
Speichern einzelne Stellen mit «Quelle hat sich geändert» abweist.

Alles, was du dort schon **gespeichert** hast, ist sicher. Verloren geht
höchstens, was du in dieser Datei getippt und noch nicht gespeichert hattest.

Die anderen Dateien sind nicht betroffen.

Danke und liebe Grüsse
⟨NAME⟩
