# Entscheidungen

Wichtige Sprach-, Design- und Inhalts-Entscheidungen für die *Lernumgebung zu
KI*. Jüngste Einträge oben. Format: kurzes Datum + ein Absatz Entscheidung,
optional eine Liste betroffener Stellen.

Wenn etwas geändert oder neu festgelegt wird, das nicht aus dem Code allein
ersichtlich ist (Sprachregelungen, Naming, didaktische Linie, Design-Prinzipien,
Verzicht auf Features) — hier festhalten.

---

## 2026-06-24 — Poll-/Stations-Architektur (lean, bewertungsfrei)

Erste Bausteine der KI-Einheit (Lernseite 1, Pietro) nach
[KI_EINHEIT_GESAMTARCHITEKTUR_v2.md](material-pietro/KI_EINHEIT_GESAMTARCHITEKTUR_v2.md):

- **[src/lib/polls.ts](../src/lib/polls.ts)** — anonymer Aggregat-Zähler.
  API: `castVote(pollId, optionId)`, `loadPollCounts`, `subscribePollCounts`
  (live), `totalVotes`, `scaleBucket`. Pfad
  `abstimmungen/ki26/polls/{pollId}.counts`. Kein Auth, durch die live Rules
  gedeckt; reused `getFirebase()`.
- **Stationen data-driven:**
  [_data/stationen.ts](../src/app/lernen/lernseite-1/_data/stationen.ts)
  (`StationConfig` + alle 5 Stationen; Zeitfenster in Sekunden; YouTube-IDs /
  mp3-URLs noch `TODO` → `material-pietro/urls.md`) +
  [_components/Station.tsx](../src/app/lernen/lernseite-1/_components/Station.tsx)
  (5-Schritt-Mechanik, geschnittene YouTube-/Audio-Player, opt-in Station 4).
- **Datenschutz:** Position 1/2 und der „eine Satz" bleiben im Browser
  (localStorage). Nur die optionale Prop `reportPollId` erhöht EINEN anonymen
  Aggregat-Zähler — kein Einzeldatensatz.
- **Gemeinsame Konvention:** Christofs Perspektiven-Check kann denselben
  `polls.ts`-Helfer + die `polls`-Collection (unter ki26-Namespace) nutzen —
  eine gemeinsame Zähler-Konvention statt zwei.

Privat-Ordner (`_data`, `_components`) werden vom Next-Router ignoriert (kein
Route). Liegen unter Pietros Owner-Pfad `lernseite-1/**` — kein Konflikt mit
Christof.

---

## 2026-06-24 — Firebase: bestehendes Projekt `iperka-lms` teilen

`ki26` bekommt **kein eigenes** Firebase-Projekt, sondern nutzt das bestehende
**`iperka-lms`** (Pietros Account, dasselbe wie `10mio`). Web-Config aus
`10mio/.env.local` uebernommen und nach `ki26/.env.local` gemappt
(`PUBLIC_*` → `NEXT_PUBLIC_*`, gitignored).

- **Trennung ueber Namespace:** `NEXT_PUBLIC_UNIT_ID=ki26` → alle Daten unter
  `abstimmungen/ki26/...`, nie Kollision mit `abstimmungen/10mio-2026/...`.
- **Keine `firestore.rules`-Aenderung:** die live `iperka-lms`-Rules erlauben
  bereits `abstimmungen/{id}/polls` + `students/*`. **Aus `ki26` nie Rules
  deployen** (wuerde `10mio` ueberschreiben — Rules sind projektweit, verwaltet
  im `10mio`-Repo).
- **Modell (bewertungsfrei):** nur anonyme Aggregat-Zaehler (`polls.counts`,
  `increment`); Freitext/„ein Satz" bleibt im Browser. Kein Cloud Function fuer
  diese Einheit; Klassencode-/LP-Tier kommt spaeter, hat keine Prioritaet.
- **Christof:** Client-Code frei moeglich (Rules decken `abstimmungen/ki26/*`);
  braucht eigenes `ki26/.env.local` (gleiche 6 `NEXT_PUBLIC_FIREBASE_*`-Werte,
  browser-public). Konsole/Deploy-Zugriff → Pietro fuegt ihn im Projekt hinzu.

Betroffen: `ki26/.env.local` (neu, gitignored), [CLAUDE.md](../CLAUDE.md#firebase-projekt-gemeinsam-genutzt--stand-2026-06-24-pietro)
(Environment + Open questions). Hintergrund-Plan:
[docs/material-pietro/KI_EINHEIT_GESAMTARCHITEKTUR_v2.md](material-pietro/KI_EINHEIT_GESAMTARCHITEKTUR_v2.md).

---

## 2026-06-21 — Bildlizenzen Schablonen-Zeitstrahl

Die historischen Stationen nutzen **gemeinfreie** Werke (Wikimedia Commons:
Raffael, Champaigne, C. D. Friedrich). Die **Gegenwarts-Station** („Wir von
heute") zeigt ein **zeitgenössisches** Werk — Klaus Christ, „Suche nach Bildern",
2024 — das **mit Genehmigung des Urhebers** verwendet wird (nicht gemeinfrei).
Die gemeinfrei-Regel ist damit bewusst und dokumentiert für genau dieses eine
Bild ausgenommen; die CC-BY-4.0-Lizenz der Seite bleibt gewahrt. Nachweis:
[public/art/CREDITS.md](../public/art/CREDITS.md).

---

## 2026-06-20 — Philosophische Verortung von Submodul 1 (Denk-Landkarte)

Das Submodul „Philosophische Perspektive" erhält ein **theoretisches Gerüst** mit
vier Stationen in didaktischer Sequenz: **Nassehi/Systemtheorie** (Diagnose: was
ist Digitalisierung, KI dort einordnen) → **Latour/Akteur-Netzwerk-Theorie**
(gute Praxis = nicht-menschliche Akteure und ihren „Zwang" sehen; Unterbau des
Akteurs-Modells) → **Haraway + nicht-westliche/asiatische Philosophien**
(Verflechtung Mensch–Nichtmensch; alternative, nicht subjekt/objekt-basierte
Traditionen) → **Gabriel/Neuer Realismus** (Umgang & Ethik, Mensch bleibt im
Urteil).

Didaktisches Herzstück ist die **Streitfrage** „Ist KI ein Akteur mit
Handlungsmacht — oder ist das ein Kategorienfehler?" (Spannung Latour/Haraway ↔
Gabriel). Inhaltliche Linie kommt von Christof (Fach); Details im
[Skript](skripte/lernseite-2-submodul-1-intro.md#philosophische-verortung--die-denk-landkarte).
Werkangaben dort sind noch zu prüfen.

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
