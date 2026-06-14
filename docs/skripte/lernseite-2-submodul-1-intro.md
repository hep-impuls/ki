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

## Werkstatt-Seite (entschieden: Sandbox-Route)

Die Visualisierung wird **im selben Repo** als Sandbox-Route entwickelt
(Option B), nicht als separates Vercel-Projekt. Vorteil: eigene URL zum
Experimentieren, kein zweites Repo / Auth-System, und der spätere Einbau ins
Submodul ist nur ein Komponenten-Import.

- **Werkstatt-URL:** `/sandbox/intro-visual`
  ([live](https://hep-ki.vercel.app/sandbox/intro-visual))
- **Seite:** [src/app/sandbox/intro-visual/page.tsx](../../src/app/sandbox/intro-visual/page.tsx)
- **Visualisierungs-Komponente:** [src/app/sandbox/intro-visual/AkteursModell.tsx](../../src/app/sandbox/intro-visual/AkteursModell.tsx)
  — self-contained Client-Komponente, **ohne** Firebase-/Server-Logik, damit
  sie hosting- und auth-System-agnostisch bleibt.

**Erste Visualisierung:** *Akteurs-Modell* — Lernende ordnen Eigenschaften den
drei Akteuren (Mensch · Werkzeug · KI) zu und decken das Muster auf: KI
überlappt mit beiden, deckt sich aber mit keinem → „etwas Drittes".

**Migrationspfad ins Submodul:** Komponente `AkteursModell.tsx` nach
`src/app/lernen/lernseite-2/submodul-1/` verschieben und in deren `page.tsx`
importieren. Sandbox-Route danach löschen oder als Werkstatt behalten. Da die
Komponente keine eigene Firebase-Logik enthält, übersteht sie Pietros
geplanten Auth-/Hosting-Umzug unverändert.

## Quellen / Lektüre

*(zu ergänzen)*

## Notizen / Offenes

*(freies Notizfeld für Christof — alles, was sich noch nicht in eine Sektion
einsortieren lässt)*
