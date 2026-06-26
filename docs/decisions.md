# Entscheidungen

Wichtige Sprach-, Design- und Inhalts-Entscheidungen für die *Lernumgebung zu
KI*. Jüngste Einträge oben. Format: kurzes Datum + ein Absatz Entscheidung,
optional eine Liste betroffener Stellen.

Wenn etwas geändert oder neu festgelegt wird, das nicht aus dem Code allein
ersichtlich ist (Sprachregelungen, Naming, didaktische Linie, Design-Prinzipien,
Verzicht auf Features) — hier festhalten.

---

## 2026-06-26 — v3 M3-Iteration nach Pietros Test (Companion-Maps statt stationenV3-Umbau)

Nach dem ersten Durchklick der v3-Vorschau: vier Anpassungen.
1. **Bug Auswahl-Übernahme:** Lokaler Antwort-State „klebte“ auf der nächsten Frage (React behält
   State an gleicher Baumposition). Fix: `key={i}` am Frame-Container in `StationV3.tsx` → Remount
   pro Frame, Auswahl wird zurückgesetzt (gilt für Polls und Quiz).
2. **Faktencheck = Wahr/Falsch:** Pro Fakt eine plausible Falsch-Variante; im UI wird zufällig der
   echte `claim` (wahr) oder die Falsch-Variante gezeigt; Auto-Grade bei Klick; Auflösung nennt die
   korrekte Aussage/Zahl + Quelle. Falsch-Varianten in **Companion-Map**
   [`_data/faktenPruefung.ts`](../src/app/lernen/lernseite-1/_data/faktenPruefung.ts).
3. **Verständnisfragen unter dem Medium (statt eigener Quiz-Subpage allein):** Jede Quiz-Frage ist
   per **Companion-Map** [`_data/quizBezug.ts`](../src/app/lernen/lernseite-1/_data/quizBezug.ts)
   einem Bezug zugeordnet (`QuizBezug` in types.ts). Bis zu 2 „sonne“-/„schatten“-Fragen erscheinen
   direkt unter dem jeweiligen Medium; der Rest bleibt als kurzer Recap in der Quiz-Subpage. Das
   weicht von v3 §4.4 („5 von 8 zufällig“) ab — Pietros UX-Entscheidung gewinnt; v3-Plan-STATE ist
   entsprechend vermerkt (Spec-Update bei Gelegenheit).
4. **Auto-Grade / weniger Klicks:** Feedback erscheint bei Auswahl (kein separater Prüf-Klick), dann
   erst „Weiter“.

**Warum Companion-Maps statt Felder direkt in `stationenV3.ts`:** Die 3'200-Zeilen-Datei via
File-Tools zu erweitern ist im OneDrive-Sandbox-Setup fehleranfällig (Mount dehydriert editierte
Dateien). Kleine, additive Maps je ID halten die kanonische Inhaltsdatei unangetastet und sind
leicht prüf- und pflegbar. IDs müssen mit `stationenV3.ts` konsistent bleiben (per-ID-Schlüssel).

## 2026-06-26 — v3 M3: StationV3 als neue Komponente + v3-Vorschau-Route

Analog zu M1 wird die 7-Subpage-Shell als **neue** Komponente
[`_components/StationV3.tsx`](../src/app/lernen/lernseite-1/_components/StationV3.tsx)
gebaut statt das v2-`Station.tsx` in-place zu ersetzen — letzteres wird noch von
`KiEinheit.tsx` mit v2-Props (`hauptgang/dessert/checks`) importiert; ein In-place-Umbau
bräche Build/Lint sofort. Die echte Verdrahtung (Menü/Timeline → `KiEinheit` → `StationV3`)
folgt in M7. Zum Durchklicken/Review dient eine eigene Route
[`v3-preview/page.tsx`](../src/app/lernen/lernseite-1/v3-preview/page.tsx)
(`/lernen/lernseite-1/v3-preview`, rendert Station 1).

Weitere M3-Festlegungen:
- **Frame-Modell (v3 §4.2):** Jede Subpage zerfällt in 1..n Frames mit **einer Frage/Karte
  pro Frame** (3 Pre-Polls, Medien, 3 Swipe, 5–7 Fakten, 5 Quiz, 3 Post-Polls + Satz + Badge) —
  paginiert, nie gestapelt. Persistentes Banner (Inhalt · Dauer · Lernziel) + Mikro-Anleitung.
- **v3-Medien-Renderer inline** in `StationV3` (nicht das v2-`MediaBlockView`, dessen `MediaSpec`
  andere Optionalität hat): YouTube-Ausschnitt/Segment, Audio, **SRF-iframe immer ganz + `guidance`
  zur Minute** (§9). Video im Split-Layout (stapelt mobil).
- **Interaktions-Tiefe vertagt:** Quiz 8→5-Zufallsziehung + Scoring, Swipe-Profil, Poll-Aggregate,
  Badge-Vergabe/Zertifikat sind in M3 nur visuell/lokal; Logik folgt M4/M5/M6. **Keine** Cloud-Writes
  in dieser Stufe.

## 2026-06-26 — v3 M2: Inhalt integriert + zwei Distraktor-Fixes (§4.5)

Die in den Review-Drafts (`docs/material-pietro/review/station-{1..7}.md`) ausgeschriebenen
Stations-Inhalte wurden in [`_data/stationenV3.ts`](../src/app/lernen/lernseite-1/_data/stationenV3.ts)
integriert (7 `const stationN: Station` + Export-Array `STATIONEN_V3`); die `[M2]`-Platzhalter sind weg.
Die Review-`.md` bleiben die menschenlesbare Quelle/Abzug. Zwei MC-Fragen verletzten die
Distraktor-Regel §4.5 (mind. ein falscher Distraktor länger als die richtige Antwort), weil die
richtige Antwort die längste war — behoben durch Verlängern je eines plausiblen Distraktors
(`st1-mc-4` «Journalistinnen … bei regionalen Tageszeitungen»; `st2-mc-3` «… harmlose Fakes aus dem
Unterhaltungsbereich»), in TS-Datei **und** Review-`.md` synchron. Verifiziert: `tsc --noEmit`
(strict, gegen echte `types.ts`) grün; programmatische Prüfung aller §4-Zähl-Invarianten + Distraktor-
Regel + Station-4-Schutz (freiwillig/Warnung/143-147) + Station-7-Slider bestanden.

## 2026-06-26 — v3 M1: Typen in neuen Dateien, v2-`stationen.ts` bleibt bis M3

Bei M1 (Daten-Typen) zeigte sich ein Reihenfolge-Konflikt mit dem DEV_PLAN: dieser nennt als
Output ein überschriebenes `_data/stationen.ts` (7 Einträge, neue Form). Die v2-Komponenten
(`Station.tsx`, `KiEinheit.tsx`, `StationenMenu.tsx` …) importieren aber noch die **alte**
Form (`hauptgang/dessert/checks`) — ein Überschreiben würde Build/Lint sofort brechen, und die
Komponenten-Migration ist erst M3. Entscheidung: v3-Typen + Skelette in **neue** Dateien, v2
bleibt unberührt, bis M3 migriert. Build-grün und v3-Spec gewinnen über den wörtlichen Dateinamen.

Neu (alle unter `src/app/lernen/lernseite-1/_data/`):
- [`types.ts`](../src/app/lernen/lernseite-1/_data/types.ts) — alle v3-Typen; Zähl-Invarianten
  (§4.4) als Tupel kodiert: 3 Polls, 3 Swipe, ≥5 Fakten, Quiz-Pool 8 = **5 MC + 3 W/F** (Reihenfolge
  erzwingt die Zusammensetzung), 7 Subpages (`Record<SubpageKey, …>`).
- [`stationenV3.ts`](../src/app/lernen/lernseite-1/_data/stationenV3.ts) — `STATIONEN_V3` (7 Skelette:
  echte Titel/Tags/Icons/Badges/Leit-Poll/Reflexion; Inhalt `[M2]`-Platzhalter).
- [`badges.ts`](../src/app/lernen/lernseite-1/_data/badges.ts) — 5 Familien + §7-Matrix.
- [`landkarte.ts`](../src/app/lernen/lernseite-1/_data/landkarte.ts) — 8 Achsen + Werte-Profil (§10).

Verifikation in der Cowork-Sandbox: `tsc --noEmit` grün. **`npm run build` / `npm run lint`** konnten
hier nicht laufen (Mount erlaubt kein Datei-Löschen; Next braucht das fürs `.next`-Cleanup) — von Pietro
auf Windows zu bestätigen.

## 2026-06-26 — v3 M0: Zertifikat-Schwelle = 3 (korrigiert «mind. 2»)

Klarstellung beim M0-Gap-Analyse-Pass ([BUILD_NOTES_v3.md](material-pietro/BUILD_NOTES_v3.md)):
Die finale Gesamtarchitektur [v3](material-pietro/KI_EINHEIT_GESAMTARCHITEKTUR_v3.md) (§0/§3) legt
**3 abgeschlossene Stationen** als Schwelle für das Abschluss-Zertifikat fest. Die frühere
Vorschlags-Notiz weiter unten («mind. 2 statt 3 Pflicht») ist damit **überholt** — bei Konflikt gilt
v3. Umsetzung in M5 (Zeitstrahl/Zertifikat). Ebenfalls notiert: DEV_PLAN verweist auf
`src/config/units/lernseite-1.ts`, das nicht existiert — Modul-Metadaten liegen in `src/config/unit.ts`
(shared, nur nach Absprache ändern).

## 2026-06-26 — KI-Einheit v3: Domänen-Wahl + Fakten-Selbst-Check (Vorschlag)

Neuer Architektur-Vorschlag
[KI_EINHEIT_GESAMTARCHITEKTUR_v3.md](material-pietro/KI_EINHEIT_GESAMTARCHITEKTUR_v3.md),
gestützt auf alle 18 Material-Summaries. Behält die v2-Linie (selbstgesteuert,
bewertungsfrei im Kern, Versprechen→Test→Befund, Inkommensurabilität/SK11), aber
richtet die Einheit neu auf das Lernziel «positive *und* negative KI-Wirkungen
**pro Lebensbereich** unterscheiden» aus.

- **7 Stationen statt 5, mind. 2 (statt 3) Pflicht** — mehr Bereiche zur Wahl,
  echtere Interessenleitung. Jede Station trägt sichtbare **Bereich-Tags**
  (Wirtschaft, Politik, Individuum, Psyche, Gesellschaft, Ökologie, Technologie;
  Recht/Ethik querschnittlich).
- **Hybrid-Label:** griffige Ich-Frage + Bereich-Tags (Lernende wählen über die
  Frage, sehen aber die analytische Kategorie).
- **Fakten-Selbst-Check** (2–3 wahr/falsch bzw. MC pro Station) prüft
  *Verständnis*, nicht *Haltung* — bewertungsfrei, Sofort-Feedback, Einzelresultat
  nur localStorage, optional anonyme Aggregat-Quote via `polls.ts`. Konsistent mit
  den bereits in v2 eingeführten `WissenCheck`s.
- **Abschluss = Chancen-Risiken-Landkarte** über die besuchten Bereiche
  (localStorage, kein Handlungsprodukt) + globaler Post-Poll + Klassen-Spiegel.
- **Kultur** bleibt bewusst Stöber-Material (Materialdecke zu dünn).
- Status: Vorschlag — mit Pietro abzustimmen, ob v3 die v2-Didaktik ablöst oder
  als Variante koexistiert.

### Nachtrag 2026-06-26 (Pietros Feinvorgaben in v3 eingearbeitet)

- **Station 7 = 3Blue1Brown** (deutsch synchronisiert); kassensturz-bots nur noch
  Ergänzung/Alt.
- **Badge-System** (5 Familien: KI & Technologie/Ethik/Gesellschaft/Wirtschaft/
  Mensch); eine Station kann eine Familie mehrfach vergeben (Stufen).
- **Zwei getrennte Wissens-Elemente:** ungrader **Faktencheck mit
  deep-search-recherchierten Zusatzdaten** (auch über das Gehörte hinaus) *plus*
  **gepunktetes 5-Fragen-Quiz** pro Station. Damit ist die Haltung weiter
  bewertungsfrei, das Verständnis aber gepunktet. Quiz-Bauregel: plausible
  Distraktoren, **mind. 1 falscher Distraktor länger als die richtige Antwort**.
- **Zeitstrahl-Wahl**, abgeschlossene Stationen werden **grün**; **Zertifikat ab 3
  Stationen** (client-seitig, mit Stationen + Badges).
- **Landkarte rückwärts aus Polls designt** (Vorwissen → Schluss); mehr Stationen
  = vollständigere Landkarte; je Achse eine `pollId`.
- **Poll-Mix:** Schieberegler für persönliche Bewegung, **4er-Skala** für
  Aggregation (Ich/Klasse/alle 500+); Format pro Frage über pre/post konstant.
  Zusätzlich **Swipe-Karten** (links/rechts) fürs Werte-Profil.
- **Layout-Regeln:** max. ~2 Bildschirmhöhen pro Seite → Stationen in 3–4
  **Subpages**; **Banner** (Inhalt/Dauer/Lernziele) auf jeder Seite;
  **Mikro-Anleitungen** zwischen Schritten; **Video im Split** mit Begleittext.
- **Medien-Regeln:** YouTube = Ausschnitt/Mehr-Segment; SRF-iframe = nur ganz
  (lange iframes → Text-Ausschnitt); MP3 = Audio-Player.

## 2026-06-24 — KI-Einheit v2: Wissen-Checks, Punkte, Lernziele, alle Medien

Die KI-Einheit (Lernseite 1, Pietro) ist vom MVP auf das inhaltliche
Reichtum-Niveau der 10mio-Einheit gehoben (Handoff
[HANDOFF_ki-einheit_tech_v2.md](material-pietro/HANDOFF_ki-einheit_tech_v2.md)).

- **Lernziel-Karten** (`LernzielKarte`) eröffnen jede Phase/Station: 2–3
  Lernziele + Aktivitäts-Ansage + «was kommt als Nächstes und warum». Führende
  Übergänge via `Hinweis` (Erzähler) und `Anleitung` (Regie).
- **Wissen-Checks** (`WissenCheck` / `WissenCheckGruppe`): pro eingebettetem
  Hauptgang/Dessert ≥2 Fragen (Mix MC + Richtig/Falsch), inhaltlich aus den
  lokalen Transkripten belegt (`_data/wissenChecks.ts`). Stil-Regeln:
  Distraktor-Längen-Regel (mind. 1 falscher Distraktor länger als die richtige
  Antwort), Fett-Diskriminator, Feedback je Option. Bewusst **kein** Check auf
  der Station-4-Vertiefung (Suizid-Fall — tonal unpassend).
- **Punkte** (`_lib/punkte.ts`): lokal (localStorage `ki26-punkte`), erster
  Versuch bindend (idempotent). Abschluss zeigt eine ruhige Punkte-Übersicht
  («X von Y», kein Zeugnis) + optionalen Klassen-Schnitt aus den `wc-*`-Zählern.
- **Generische Polls** (`PollFrage` / `PollDeck`) mit Drei-Ebenen-Spiegel
  (Ich / Klasse / alle). Auftakt + Abschluss zeigen dasselbe Stimmungsbild
  (3 Stance-Polls) mit Pre/Post-Vergleich. `Verteilung` aus `KollektivSpiegel`
  herausgezogen (generisch; 1..7 ist nur ein Spezialfall).
- **Poll-/Punkte-IDs** (`unitPolls.ts`): neu `pollId.poll`/`klassePoll`
  (generisch) + `pollId.wissen` (anonym richtig/falsch). `castPollVote` zählt
  global + Klasse. Datenschutz unverändert: nur anonyme Aggregat-Zähler in
  Firestore; Position, Punkte, Freitext bleiben im Browser.
- **Alle Medien verdrahtet** (Handoff §6): SRF-Embeds via `kind:"srf"`/`urn`
  (Rundschau S1, Kassensturz/ABE S2, 10vor10 S5), remote-mp3 (Regionaljournal
  S1, Espresso S2-Audio bzw. S5), YouTube (Einstein/Puls), 3Blue1Brown engl.
  Original (`LPZh9BOjkQs`, `aircAruvnKk`). Keine `youtubeId:"TODO"`/Placeholder
  mehr. Bewusst offen (§11): Espresso-Offset (mp3 startet ~6:00 vs.
  Transkript-Marken) — beim Verdrahten 1× zu verifizieren.
- **Umlaut-Bereinigung:** `ae/oe/ue`→`ä/ö/ü` im gesamten `lernseite-1/**` (UI,
  `_data/*`, Kommentare) + die v1-Einträge hier. Technische Identifier
  unverändert.
- **⚠️ Build-Verifikation:** In der Cowork-Sandbox **nicht** durchführbar — der
  OneDrive-On-Demand-Mount liefert dem Linux-Sandbox teils gekürzte Dateien
  (deterministisch, nicht-NUL), sodass `tsc`/`next build` dort unzuverlässig
  sind. Die Dateien auf Disk sind vollständig (über das Read-Tool/Cloud
  verifiziert). **`npm run build` lokal bei Pietro/Christof ausführen**, bevor
  committet wird.

## 2026-06-24 — KI-Einheit als zusammenhängender Flow gebaut (MVP)

Die KI-Einheit (Lernseite 1, Pietro) ist als ein einziger orchestrierter Flow
auf `/lernen/lernseite-1` umgesetzt (Handoff
[HANDOFF_ki-einheit_tech_v1.md](material-pietro/HANDOFF_ki-einheit_tech_v1.md)).
Die frühere Hub-Seite mit Platzhalter-Submodulen ist ersetzt.

- **Orchestrator:** `_components/KiEinheit.tsx` — State-Machine
  `auftakt → stationen (>=3 von 5) → abschluss → maschinenraum (optional)`,
  Fortschritt (Phase, Pre-Wert, erledigte Stationen) in localStorage
  (`_lib/fortschritt.ts`), Reload-fest.
- **Phasen:** `Auftakt` (Vorwissen + Hype-Opener + globaler Pre-Poll),
  `StationenMenu` (freie Wahl, Station-4-Badge „freiwillig", Gate bei 3),
  `Abschluss` + `KollektivSpiegel` (Ich / Klasse / alle — Klasse einmalig,
  alle live), `Maschinenraum` (Selbsteinschätzung + Interesse + Vertrauens-
  Brücke, kein Test).
- **Refactor:** `Skala` und `MediaBlockView` (YouTube/Audio/SRF/Placeholder)
  aus `Station.tsx` in shared-Dateien extrahiert; `MediaSpec` um `kind:"srf"`
  + `urn` + `externalUrl` erweitert.
- **Poll-IDs/Klasse:** `_lib/unitPolls.ts` (Schema, `resolveKlasse`,
  `voteOnce`-Guard). Klassen-Code via `?klasse=<code>` → localStorage.
- **Medien verdrahtet:** YouTube-IDs (einstein-full/what-the-fake/ki-im-kopf/
  ki-freundin, puls), SRF-urn Rundschau (Station 1 alt. Dessert), mp3 nach
  `public/audio/ki-arbeitswelt.mp3` (Station 2).
- **Bewusst offen (20 %, §12):** Placeholder für `newsjournal-stimme-klonen`,
  `kassensturz-ausbeutung`, `espresso-foodwaste`, `10v10-ki-krieg`; 3Blue1Brown
  deutsch-synchron (Placeholder + Link zum Original); harter Clip-Stop bei
  SRF-/YouTube-Embeds (nur Startzeit) — späteres Upgrade via Player-API.
- **unit.ts:** nur der `lernseite-1`-Eintrag chirurgisch angepasst (Titel
  „Kann KI das? — eine Positionsreise", Platzhalter-Submodule entfernt).
  Die verwaisten `submodul-1/2/page.tsx` bleiben stehen (nicht löschen).
- **Verifikation aus der Cowork-Sandbox:** nur `tsc --noEmit` (Windows-natives
  `next build` nicht ausführbar). `npm run build`/`npm run lint` + Firestore-
  Test laufen bei Pietro lokal.

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
