# Skript: Intro — Eine ganz neue Partnerschaft

> **Pfad in der App:** `/lernen/lernseite-2/submodul-1`
> **Datei:** [src/app/lernen/lernseite-2/submodul-1/page.tsx](../../src/app/lernen/lernseite-2/submodul-1/page.tsx)
> **Owner:** Christof
> **Status:** Skelett — wird ergänzt
> **Letzte Bearbeitung:** 2026-06-14

Dieses Skript ist die inhaltliche Grundlage für das Intro-Submodul von
*Lernseite 2 — Eine ganz neue Partnerschaft*. Es wird hier (versioniert im
Repo) gepflegt und dient als Vorlage für die spätere Umsetzung in der
Submodul-Page. Christof ergänzt fortlaufend; jede Änderung ist via `git log`
nachvollziehbar.

---

## Kernthese

KI ist nicht nur ein neues Werkzeug — sie ist ein **neuer Akteur** auf der
Bühne. Diese Unterscheidung (Akteur vs. Werkzeug) zu erfassen, ist der zentrale
Lernschritt. Die Veränderung passierte schnell; entsprechend wichtig ist es,
sie nicht aus Reflex weiter mit alten Begriffen (Werkzeug, Maschine, Programm)
zu beschreiben.

## Lernziele

- Die Lernenden erkennen KI als **neuen Akteur** und können benennen, was sie
  von einem Werkzeug unterscheidet.
- Sie reflektieren, was diese Verschiebung für ihren **persönlichen Alltag**
  bedeutet (Kommunikation, Recherche, Entscheidungen, Kreativität).
- Sie verstehen, was sie für den **beruflichen Alltag** bedeutet (Rollen, Skills,
  Verantwortlichkeiten — branchenübergreifend).
- Sie verstehen, **warum philosophisches Denken wieder an Bedeutung gewinnt**,
  obwohl es im Curriculum (noch) nicht entsprechend gewichtet ist.

## Schwerpunkte

### 1. Ein neuer Akteur tritt auf

Plötzlich gibt es Systeme, die

- in natürlicher Sprache antworten,
- selbst Texte, Bilder, Code, Musik *erzeugen*,
- Vorschläge machen, abwägen, „begründen",
- sich an Kontext erinnern und mitziehen.

Sie sind weder klassisches **Werkzeug** (passiv, vom Menschen geführt) noch
**Person** (mit Bewusstsein, Rechten, Verantwortung). Sie sind etwas Drittes —
und die Sprache dafür fehlt vielen noch.

**Leitfrage:** Warum reicht der Werkzeug-Begriff nicht mehr? Und was ist die
Konsequenz, wenn wir trotzdem so über KI sprechen?

### 2. Was heisst das für den persönlichen Alltag?

*(zu ergänzen — konkrete Szenen aus dem Alltag der Lernenden: Schreiben,
Lernen, Recherchieren, Beraten lassen, kreativ sein, sich orientieren)*

### 3. Was heisst das für den beruflichen Alltag?

*(zu ergänzen — Beispiele aus verschiedenen Branchen; veränderte Rollen,
neue Skills; was bleibt menschlich, was wird delegiert)*

### 4. Renaissance der Philosophie

Obwohl im aktuellen ABU-Curriculum nicht entsprechend gewichtet: KI macht
philosophisches Denken **wichtiger**, nicht entbehrlicher. Fragen, die jetzt
*jeden* betreffen:

- Was ist **Wissen** — und wann genügt es?
- Was ist **Wahrheit** — und wer entscheidet darüber?
- Was ist **Verantwortung** — wenn ein System mitentscheidet?
- Was ist eigentlich **mein eigener Anteil** an einem Ergebnis?

Diese Fragen sind nicht akademisch. Sie sind die operativen Werkzeuge, um mit
KI souverän umzugehen.

**Leitfrage:** Warum gerade jetzt? Was kann Philosophie, was Informatik
strukturell nicht leisten kann?

## Reflexionsfragen für die Lernenden

*(zu ergänzen — sollen unterrichtsfähig sein, also kurz, offen, anschlussfähig)*

## Mögliche Visualisierungen / Interaktionen

Ideen, was sich in der Submodul-Page interaktiv umsetzen liesse:

- **Akteurs-Modell** — Vergleich Mensch · Werkzeug · KI als drei Spalten, die
  Lernenden ordnen Eigenschaften zu.
- **Skill-Shift-Diagramm** — was an Routine-Arbeit wegfällt, was an
  Urteilsarbeit dazukommt.
- **„Wer entscheidet?"-Slider** — Szenarien (Bewerbung, Diagnose, Auswahl von
  Bildern für ein Projekt …), Lernende positionieren wer/was hier wieviel
  entscheidet.
- **Begriffs-Tausch** — denselben Satz mit „Werkzeug", „KI" und „Akteur"
  formulieren, Wirkung vergleichen.

## Mögliche separate Vercel-Seite (offen)

Christof hat erwogen, eine eigenständige Visualisierungs-Seite zu bauen
(eigenes Vercel-Projekt oder Sandbox-Route), um die Kernthese visuell
durchzuspielen, bevor sie ins Hauptprojekt einfliesst.

Drei Anschluss-Optionen, wenn die Visualisierung fertig ist:

1. **iframe-Einbettung** in `submodul-1/page.tsx` — schnell, lose gekoppelt.
2. **Komponente extrahieren** und direkt einbauen — sauber, aber Refactoring nötig.
3. **Inline-Implementation** hier im Repo bauen, separate Vercel-Seite weglassen
   — am wenigsten Overhead, wenn das Konzept gefestigt ist.

Entscheidung steht noch aus — siehe nachfolgenden Vorschlag im Chat oder
direkter Eintrag in [../decisions.md](../decisions.md), sobald getroffen.

## Quellen / Lektüre

*(zu ergänzen)*

## Notizen / Offenes

*(freies Notizfeld für Christof — alles, was sich noch nicht in eine Sektion
einsortieren lässt)*
