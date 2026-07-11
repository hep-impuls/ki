# Entscheidungen

Wichtige Sprach-, Design- und Inhalts-Entscheidungen für die *Lernumgebung zu
KI*. Jüngste Einträge oben. Format: kurzes Datum + ein Absatz Entscheidung,
optional eine Liste betroffener Stellen.

Wenn etwas geändert oder neu festgelegt wird, das nicht aus dem Code allein
ersichtlich ist (Sprachregelungen, Naming, didaktische Linie, Design-Prinzipien,
Verzicht auf Features) — hier festhalten.

---

## 2026-07-11 — «Vorhang auf» neu dramatisiert: Zitate-Rätsel + KI-Storyboard, Akteurs-Modell entfernt

Neue Dramaturgie des Auftakts (Wunsch Christof):

1. **«Alt — oder von heute?»** (`ZitatReveal.tsx`): fünf Literatur-Zitate,
   die nach heutigem KI-Diskurs klingen, zum Aufdecken (Jahr + Werk +
   Kontext + Quellen-Link). Alle fünf am Quelltext verifiziert
   (2026-07-11): Hoffmann «Der Sandmann» 1816 (de.wikisource, wörtlich),
   Shelley «Frankenstein» 1818 (gutenberg.org #84, übersetzt), Lovelace
   Anmerkung G 1843 (fourmilab.ch, übersetzt), Butler «Erewhon» 1872
   (gutenberg.org #1906, übersetzt), Čapek «R.U.R.» 1920 (gutenberg.org
   #59112, Selver-Übersetzung, übersetzt). Aufdecken zählt als Spur
   (`vorhang-auf:zitat:i`).
2. **«Die KI-Story — ein Storyboard»** (`Storyboard.tsx`): 12 Stationen vom
   Golem zur Gegenwart — 6 gemeinfreie Bilder (public/art/storyboard/,
   Nachweis in CREDITS.md: Aleš-Golem, Simm-Homunkulus, Racknitz-
   Schachtürke, Holst-Frankenstein, Babbage-Holzstich, NASA-Supercomputer)
   + 6 gestaltete Panels im Gewebe-Stil (Dartmouth-Tafelrunde, WENN/DANN,
   Expertensystem-Terminal, KI-Winter, Streudiagramm, Schichten-Netz).
   Danach «Phasen der aktuellen KI» (Wahrnehmung, Verstehen, Generieren,
   Entscheiden) — **die letzten beiden (Kollaborieren, Transzendieren?)
   bewusst offen** (gestrichelte Karten): Kollaborieren ist das Thema des
   Moduls selbst.
3. Danach wie gehabt: drei Szenen, Netz der Akteurin, Weiter-Links.

**Entfernt:** das Einschätzungs-Raster «Akteurs-Modell» (Eigenschaften
Mensch/Werkzeug/KI zuordnen) — Datei gelöscht, Spur-Bereich im
Orakel-Dashboard durch «Zitate aufgedeckt» (5) ersetzt (Gesamt neu 49).

---

## 2026-07-11 — Thema 04 «Das Orakel»: Dashboard, anonyme Zweifach-Sammlung, KI-Querschnitt

Lernseite 2 hat einen **vierten Themenbereich**: `das-orakel` («Das Orakel —
erkenne dich selbst», Delphi-Motto). Persönlicher Rückblick + anonymer
Vergleich + KI-Deutung.

**Datenschutz-Architektur (zweifach gesammelt, wie mit Christof besprochen):**

1. **Lokal (Browser):** die eigenen Spuren (welche Knoten in FadenNetz,
   KnotenNetz, Zeitstrahl-Bausteinen, Akteurs-Modell besucht wurden —
   `lernseite-2/_lib/spuren.ts`, localStorage `ki26-spuren-lernseite-2`),
   der eigene Satz, die eigene Poll-Wahl. Verlässt das Gerät nie.
2. **Anonym (Firebase):** (a) pro besuchtem Knoten nur `+1` auf einen
   Aggregat-Zähler (bestehende Poll-Mechanik,
   `abstimmungen/ki26/polls/spuren-lernseite-2`) — ohne Namen/Code, gleiche
   Klasse wie die bisherigen anonymen Polls; (b) Sätze zur offenen Frage
   NUR auf ausdrücklichen Klick «Anonym teilen»
   (`abstimmungen/ki26/orakel-aussagen`, via Route Handler + Admin SDK,
   ohne studentCode/IP); (c) Poll «orakel-blick».

**KI ohne Datenzugriff:** Die KI greift NIE auf Firestore oder Browser-Daten
zu. `/api/orakel/querschnitt` (Admin SDK) verdichtet die anonyme Sammlung
serverseitig zu einer Text-Zusammenfassung (Zähler + geteilte Sätze) und
reicht nur diese an die Messages API. Der Vergleich «du ↔ alle» wird im
Browser gerechnet (lokales Exemplar neben anonymen Gesamtzahlen).

**Kosten:** Modell `claude-haiku-4-5` (günstigstes geeignetes, Vorgabe
«möglichst wenig Kosten»); Kommentar wird in
`abstimmungen/ki26/orakel-meta/stand` gecacht und höchstens neu erzeugt,
wenn ≥5 neue Sätze UND >30 Min. seit dem letzten Lauf (bzw. beim ersten Mal
ab 3 Sätzen). Aufruf per `fetch` statt SDK — `package.json` ist geteilt,
kein neues Paket ohne Absprache. Server-Env `ANTHROPIC_API_KEY`
(`.env.local.example` ergänzt; in Vercel setzen). Ohne Schlüssel läuft alles,
das Orakel meldet dann, dass es noch schweigt.

Betrifft: `src/app/lernen/lernseite-2/das-orakel/**`, `_lib/spuren.ts`,
FadenNetz/KnotenNetz (`spurKey`), Zeitstrahl-`toggle`, AkteursModell,
`src/app/api/orakel/{aussage,querschnitt}/route.ts`, `unit.ts`
(lernseite-2-Block), Hub-Signatur «orakel».

---

## 2026-07-11 — FadenNetz: individuelle Muster statt Einheits-Faden am Seitenkopf

Der Weisheits-Faden am Kopf der Themenseiten (ein Bogen, überall gleich) ist
durch **FadenNetz** ersetzt (`lernseite-2/_components/FadenNetz.tsx`,
`WeisheitsFaden.tsx` gelöscht): Jede Seite trägt oben ihr **individuelles
Muster aus mehreren Fäden**, denen man einzeln, in beide Richtungen und auf
**unterschiedlichen Wegen** nachfahren kann (pro Faden eigene Spur, kein
Teleport; Knoten zählen auch mitten auf Kreuzungen als erreicht).

- **Vorhang auf — Auftritts-Stern:** 6 Strahlen + 2 Nebenfäden, 7 Weisheiten
  (Zentrum Shakespeare/Bühne; aussen Heraklit, nach Sokrates, Wittgenstein,
  Descartes, Turing 1950 «Können Maschinen denken?», nach Arendt).
- **Philosophische Perspektive — Epochen-Linie:** 5 beschriftete Knoten
  (Antike→Jetzt) mit den Schablonen-Zitaten und Sprung-Knopf zum
  Zeitstrahl-Panel. Der frühere separate Abschnitt «Fünf Epochen im
  Überblick» (KnotenNetz) ist entfernt — war nach dem Umbau ein Duplikat.
- **Kulturelle Perspektive — Gewebe:** 3 Schuss- + 3 Kettfäden, Weisheiten
  an den Kreuzungen (Zentrum Klee; Goethe, Wilde, Schiller, nach da Vinci).

Die KnotenNetz-Abschnitte «Das Netz der neuen Akteurin» (Vorhang auf) und
«Figuren im Gewebe» (Kulturell) bleiben — anderes Thema als die Weisheiten.

---

## 2026-07-11 — KnotenNetz: die Signatur-Symbole gross und bedienbar

Die drei Konstellations-Signaturen vom Hub gibt es jetzt auf ihren Seiten
in gross und **interaktiv** (`lernseite-2/_components/KnotenNetz.tsx`):
Knoten antippen (oder per Tastatur) → Erklär-Karte darunter (aria-live),
besuchte Knoten bleiben markiert, Zähler «n von m Knoten entdeckt»,
Hover lässt Knoten wachsen.

- **Vorhang auf — «Das Netz der neuen Akteurin»** (Auftritts-Signatur):
  Zentrum KI + sechs Fäden zu Nutzer:innen, Sprache, Datencentren,
  Rohstoffen, Unternehmen, Regeln — die Akteur-Netzwerk-Idee zum Antippen
  (spiegelt die «Wir – Netz»-Installation).
- **Philosophische Perspektive — «Fünf Epochen im Überblick»**
  (Epochen-Signatur, beschriftet): je Knoten Denker + Schablone, dazu Knopf
  «Zur Epoche im Zeitstrahl» — springt zum Panel (Anker `epoche-{id}` +
  `scroll-mt` im Zeitstrahl). Wichtig: `scrollIntoView({behavior:"smooth"})`
  ist in manchen Umgebungen wirkungslos → Fallback nach 350 ms hart springen.
- **Kulturelle Perspektive — «Figuren im Gewebe»** (Gewebe-Signatur):
  an den Kreuzungen Golem, Frankenstein, HAL 9000, Samantha («Her»), im
  Zentrum «Dein Blick — heute».

---

## 2026-07-11 — WeisheitsFaden: interaktive Muster auf allen Themenseiten

Das Gewebe-Motiv wird interaktiv: Auf allen drei Themenseiten von Lernseite 2
liegt unter dem Header ein **WeisheitsFaden**
(`lernseite-2/_components/WeisheitsFaden.tsx`) — ein Faden, dem man mit Maus
oder Finger **nachfahren** kann (Akzentfaden zieht mit, Springen ist bewusst
blockiert — nur Vorwärtsbewegung nahe am Faden zählt). An den Knoten
erscheint je eine **Weisheit** (Zitat + Brückensatz zum Seitenthema); Knoten
sind auch direkt antipp- und per Tastatur fokussierbar (aria-live-Karte).
Einladung über Puls am Fadenanfang + Hinweiszeile («Fahr dem Faden nach»),
Zähler «n von m Knoten besucht».

Weisheiten je Seite (gemeinfreie Denker bzw. gekennzeichnete Paraphrase):
- **Vorhang auf:** Shakespeare (Bühne), Heraklit (panta rhei), Wittgenstein
  (Grenzen der Sprache), «nach Hannah Arendt» (Anfangen).
- **Philosophische Perspektive:** die fünf Epochen-Schablonen (Aristoteles,
  Augustinus, Kant, Marx, «Wir — jetzt» als offene Frage) — spiegelt den
  Zeitstrahl darunter.
- **Kulturelle Perspektive:** Klee (macht sichtbar), Goethe (man erblickt,
  was man weiss), Wilde (Leben ahmt Kunst nach).

Zusätzlich reagieren die statischen Muster (GewebeBand, Knoten, FadenDivider,
Signaturen) jetzt auf Hover: Akzentknoten wachsen, Akzentfäden treten hervor
(CSS-only, `motion-reduce` respektiert beim Puls).

---

## 2026-07-11 — Lernseite 2 neu strukturiert: drei Themenbereiche + Gewebe-Design

**Struktur:** Lernseite 2 («Eine ganz neue Partnerschaft») hat neu **drei
Themenbereiche** statt vier Platzhalter-Submodule:

1. **Vorhang auf — eine neue Akteurin** (`vorhang-auf`) — Auftakt in drei
   Szenen (Auftritt, Irritation, Frage) + interaktives Akteurs-Modell
   (aus `sandbox/intro-visual` übernommen).
2. **Philosophische Perspektive** (`philosophische-perspektive`) — der
   Schablonen-Zeitstrahl, aus `sandbox/philosophie-schablonen` ins Modul
   portiert (Komponenten in `_components/`).
3. **Kulturelle Perspektive** (`kulturelle-perspektive`) — neu, im Aufbau:
   Erzählungen/Kunst prägen den Blick auf KI.

Die früheren Platzhalter «Quellen, neu aufgespürt», «Ich bin ganz Ohr» und
«AI-Slop macht kreativ» sind aus der Navigation entfernt (Git-History hat
sie); Teile davon können später in der kulturellen Perspektive aufgehen.
Alte Sandbox-URLs bleiben als Redirects gültig. `sandbox/umfrage`
(Perspektiven-Check) bleibt Werkstatt — vorgesehen für den Auftakt.

**Design:** Neues grafisches Leitmotiv für Lernseite 2 — nicht typische
KI-Symbolik (Roboter/Neuronen-Glow), sondern das **Fadenhafte, Knotenhafte,
Gewebhafte** (Akteure als Knoten, Beziehungen als Fäden; Referenzen:
natalitaet.com, antrhizom.com — hier bewusst noch reduzierter: keine
Gradients, kein Glow, nur feine Linien + Knoten in MD3-Tokens).
Wiederverwendbare SVG-Deko in `lernseite-2/_components/Gewebe.tsx`
(GewebeBand, FadenVertikal, Knoten, FadenDivider, Signatur je Thema); der
Hub zeigt die drei Themen als Stationen an einem durchlaufenden Faden.

Betrifft: `src/config/unit.ts` (nur lernseite-2-Block), `src/app/lernen/lernseite-2/**`,
`src/app/sandbox/{philosophie-schablonen,intro-visual}/page.tsx` (Redirects).

---

## 2026-07-07 — Quellenlinks durchgehend deutschsprachig

Im Submodul „Philosophische Perspektive" (Schablonen-Zeitstrahl) führten die
Belege der drei Bausteine (Technische Errungenschaft / Verunsicherung /
Philosophische Orientierungshilfe) mehrheitlich auf **englische** Seiten (Stanford
Encyclopedia of Philosophy, IEP, en.wikipedia, Britannica, arXiv, CERN, New
Advent). Für eine deutschsprachige Lernumgebung wurde alles auf **deutsche**
Entsprechungen umgestellt: de.wikipedia.org (Existenz je Artikel via
MediaWiki-API geprüft), de.wikisource.org (Kant, „Was ist Aufklärung?") und das
**deutsche Original** des Kommunistischen Manifests auf marxists.org/deutsch.
Statt der englischsprachigen SEP-Artikel zu Technikphilosophie/Cyborg-Manifest
verweisen die Gegenwarts-Belege jetzt direkt auf die im Text genannten Denker:
Akteur-Netzwerk-Theorie (Latour), Donna Haraway, Markus Gabriel. Alle 29 URLs
am 2026-07-07 live auf HTTP 200 geprüft.

Betrifft: `src/app/sandbox/philosophie-schablonen/SchablonenZeitstrahl.tsx`
(`techSources`/`unrestSources`/`orientSources` aller fünf Epochen + Header-Notiz).

---

## 2026-06-27 — FIREBASE_SERVICE_ACCOUNT muss einzeilig sein

Next.js parst `.env.local` zeilenweise. Ein mehrzeiliger Service-Account-JSON-Wert
wird nach der ersten Zeile (`{`) abgeschnitten → Route Handlers antworten mit 503.
Lösung: JSON minifizieren (python one-liner) **oder** als Base64 kodieren. Beides
dokumentiert in `.env.local.example`. `firebaseAdmin.ts` akzeptiert beides
(auto-detect: beginnt mit `{` → roh, sonst Base64).

Betrifft: `.env.local` lokal, Vercel-Env (dort kein Problem, da Secret-Felder
einzeilig gespeichert werden).

---

## 2026-06-26 — Volle 10mio-Parität: Registrierung, Klassencode & Lehrer-Report

Architektur-Kurswechsel (mit Pietro): ki26 bekommt denselben Tier wie 10mio —
freie Registrierung mit **Animal-Code** (`BÄR-334`), optionaler **Klassencode**
(Lehrer-beansprucht, secret-geschützt, single-owner) und ein **Lehrer-Report**
mit Pro-Schüler-Fortschritt plus Klasse-vs-alle-Poll-Aggregaten. Umsetzung von
`docs/PLAN_registrierung-klassencode.md`, Milestones R0–R5. Nicht-offensichtliche
Entscheide:

- **Backend als Next.js Route Handlers + Firebase Admin SDK** (nicht Cloud
  Function): ki26 darf nie ins geteilte `iperka-lms` deployen. Das Admin SDK
  umgeht die Rules → `teachers/*`-Zugriff ohne Rules-Änderung. Service-Account
  als `FIREBASE_SERVICE_ACCOUNT` (Vercel-Env / `.env.local`).
- **Datenschutz revidiert**: Das frühere „nur anonyme Aggregate"-Statement
  (2026-06-20 / 2026-06-24) gilt nicht mehr. ki26 speichert jetzt **pseudonyme
  Pro-Schüler-Daten** (Animal-Code → Fortschritt) unter
  `abstimmungen/ki26/students/{code}`. Persönliche Detaildaten (Reflexionen,
  Werte-Profil, Einzelantworten) bleiben weiterhin **lokal**; gespiegelt wird nur
  ein minimaler Fortschritts-Snapshot (pct, Quiz-Punkte, Stations-Abschluss).
- **Spiegel additiv, localStorage bleibt UX-Quelle**: `progressMirror.ts` +
  `ProgressMirror.tsx` lesen den lokalen Store und schreiben periodisch ein
  `progress/{moduleId}`-Doc. No-op ohne Session → anonyme Nutzung ohne Code bleibt
  möglich.
- **Poll-Klassen-Namespace an echten Code gekoppelt**: `resolveKlasse()` liest
  jetzt zuerst `session.teacherCode` (statt nur `?klasse=`/localStorage). Die
  bestehenden `kp-{klasse}-*`-Zähler bleiben unverändert und füttern den Report.
- **Geteilte Dateien**: Neue `src/lib/*`-Dateien sind „gemeinsam"; `ActivityTracker.tsx`
  wurde **nicht** angefasst (R6 verschoben). Christofs Anbindung steht in
  `docs/handoff-firebase-ki26.md`.
- **Verifikation offen**: Build/Lint/Firestore-Test laufen bei Pietro auf Windows
  (Cowork-Sandbox kann nicht zuverlässig bauen / kein Firestore-Egress).

---

## 2026-06-26 — M10: Hash-Routing für adressierbare Schritte (Lernseite 1)

Der Navigations-Zustand der KI-Einheit v3 lebt jetzt im **URL-Hash**
(`/lernen/lernseite-1#/station/2/fakten/3`). Jeder Schritt ist adressierbar,
reload-fest, über Browser-Zurück/Vor blätterbar und deep-linkbar. Nicht-
offensichtliche Entscheide:

- **Hash statt Query** (Variante B, OPEN DECISIONS 13 liess Query/Hash offen;
  Pietro war unsicher, Claude-Entscheid): Der ganze v3-Flow ist `"use client"`.
  Query-Routing (`useSearchParams`) erzwingt eine `<Suspense>`-Grenze und Scroll-
  Restoration-Eigenheiten; Hash ist rein clientseitig, braucht das nicht, lässt
  `page.tsx` unberührt und verhält sich identisch auf Vercel. In der fragilen
  OneDrive/Build-Umgebung das risikoärmere.
- **Frame-genau (sub + Position), nicht nur Subpage**: Die Acceptance verlangt
  «Neuladen landet auf demselben Schritt» — ein Schritt ist ein Frame. Encodiert
  wird die **1-basierte Position innerhalb der Subpage** (robust gegen Inhalts-
  Umordnung), bei Overflow geklammert.
- **`_lib/route.ts` ist die einzige Stelle mit `history`-Zugriff.** `KiEinheitV3`
  besitzt `useRoute()` und reicht `route` + `push`/`replace` als `nav` durch.
  `pushState` = bewusster Schritt; `replaceState` = Auto-Advance (Browser-Zurück
  überspringt die automatischen Mikro-Schritte). `localStorage` (`ki26-v3-phase`)
  bleibt nur **Fallback** bei leerem Hash.
- **Alle Routing-Props optional.** Ohne `nav` (z.B. `/v3-preview`, das
  `<ZeitstrahlMenu />` ohne Props rendert) bleibt das alte lokale State-Verhalten;
  v2-Komponenten unberührt.
- **ki26-konform:** Der Hash trägt **nur Navigations-State** — keine Antworten,
  Punkte oder Profile. Persönliche Daten bleiben in localStorage.
- **In-Sandbox-`tsc` bestätigt unbrauchbar:** Der Cowork-bash-Mount dehydriert
  per File-Tool editierte OneDrive-Dateien (sah `AbschlussV3.tsx` bei Z.132
  abgeschnitten → Phantom-«JSX no closing tag»-Fehler). Typprüfung manuell;
  build/lint macht Pietro auf Windows (massgeblich).

## 2026-06-26 — v3 Improv-Plan v3: neun UX-/Logik-Verbesserungen an Lernseite 1 (#7 Dark Mode zurückgestellt)

Umsetzung von `docs/improv-plan-v3.md` (Lernseite 1, KI-Einheit). Acht der neun
Punkte umgesetzt; **#7 Dark Mode bewusst zurückgestellt** (berührt `gemeinsam`-
Dateien — erst nach Absprache mit Christof). Nicht-offensichtliche Entscheide:

- **«Subpage» → «Schritt» nur im sichtbaren Text** (#5). In `stationenV3.ts`
  wurden die `inhalt`-Strings ersetzt (`Subpage n/7` → `Schritt n/7`); interne
  Identifier (`SubpageKey`, `SUBPAGE_*`, `subpages`, `StationSubpages`) bleiben.
- **Werte-Karten ohne «wischen»** (#1). Es gibt kein Swipe-Gesture, nur zwei
  Buttons → alle «wische»-Formulierungen entfernt, Buttons «Sehe ich anders /
  Sehe ich auch so» (Icons `thumb_down`/`thumb_up`), `SUBPAGE_ICON.swipe` =
  `touch_app`. Die doppelt gepflegte Karte ist jetzt eine geteilte Komponente
  `_components/WerteKarte.tsx` (Auftakt + Station).
- **Auto-Advance: 850 ms + Einblend-Animation** (#2). Gemeinsame Konstante
  `AUTO_ADVANCE_MS = 850` in `_lib/ui.ts` (kein Magic Number). Neue
  `@keyframes frame-in` + `.animate-frame-in` in `globals.css`, respektiert
  `prefers-reduced-motion`.
- **Faktencheck-Scroll + sticky Navigation** (#3). Nach der Antwort scrollt die
  Auflösung in den Blick; die untere Navigationszeile in `StationV3` ist
  `sticky bottom-0` → «Weiter» bleibt bei langen Frames erreichbar.
- **60 %-Gate + Faktencheck-Bonus + Stations-Reset** (#9). Eine Station gilt erst
  ab **≥ 60 %** der Quiz-Basispunkte als abgeschlossen (`stationErfuellt`,
  `markStationAbgeschlossen` nur dann). Der **Faktencheck zählt nur als Bonus**
  (max. **+10 %** des Stations-Totals, `stationBonus`), **nicht** im 100 %-Nenner.
  Gate pro **Station** (nicht pro Schritt — Pietro-Entscheid). Unter 60 %: klare
  Meldung + **«Station neu starten»** (`resetStation`, löscht nur die lokalen
  Daten **dieser** Station nach Bestätigung; kein Einzelfrage-Retry). Hinweis:
  Reset löscht localStorage-Lernfortschritt, **keine Dateien** — Pietros Regel
  «nichts ohne Zustimmung löschen» bezieht sich auf Dateien.
- **Auswertung nach jeder Poll-Serie** (#8). Neuer geteilter Baustein
  `_components/PollAuswertung.tsx` (aus `KlassenSpiegel` herausgelöst, der ihn nun
  wiederverwendet → keine Doppelpflege). Erscheint nach der Auftakt-Haltung
  (pre) und nach den Befund-Post-Polls jeder Station (post): «Ich · meine Klasse ·
  alle» pro 4er-Skala-Frage. **Pre-Serie (Entscheid a):** kein neues Pre-Aggregat
  gecastet — `PollAuswertung` liest die vorhandenen `{pollId}-pre`-Buckets (von
  `Skala4Frage` ohnehin gecastet) und rendert Klasse/Alle freundlich leer, falls
  noch nichts vorliegt. Nur anonyme Aggregate; persönliche Stufe bleibt lokal.

## 2026-06-26 — v3 M9 QA: §4 voll konform; ActivityTracker-Telemetrie als geteilter-Datei-Entscheid offen

QA-Pass (zwei Sonnet-Subagenten, read-only Audit + Gegenprüfung in der Hauptsession).
Ergebnis und zwei nicht-offensichtliche Entscheidungen:

- **quizBezug-«Overcount» ist kein Defekt.** Für St1 (sonne=3), St3 (schatten=4),
  St6 (schatten=3), St7 (sonne=3) sind mehr als 2 Quizfragen einem Medium getaggt.
  `buildFrames` in `StationV3.tsx` deckelt sonne/schatten aber via
  `.slice(0, FRAGEN_PRO_MEDIUM)` (=2) und routet **jede** überzählige Frage in
  `recapFragen` — nichts geht verloren. Damit ist §4.4 («≤2 unter dem Medium, Rest
  als Recap») zur Laufzeit erfüllt. Tags in `quizBezug.ts` bewusst **nicht**
  reduziert: welche 2 Fragen unter dem Medium stehen, ist eine didaktische
  Kuratierung für Pietro, kein Bugfix.
- **ActivityTracker bleibt vorerst unverändert (Pietro-Entscheid).**
  `src/lib/activity.ts` schreibt pro Seitenaufruf `{uid, userAgent, page}` nach
  Firestore `activities`. Das steht in Spannung zu §4.11 (Cloud nur anonyme
  Aggregate), ist aber (a) eine **geteilte** Basis-App-Datei (Scope-Guard),
  (b) von Hausregel §2 ausdrücklich auf jeder Seite vorgeschrieben, (c) auch in
  Christofs lernseite-2 aktiv. Deshalb in M9 **nicht** eigenmächtig geändert,
  sondern als Entscheid an Pietro übergeben (Optionen A No-op / B cloud-freie
  Variante + Hausregel §2 nachziehen / C behalten + dokumentieren). Details in
  `docs/material-pietro/QA_v3.md` §3.
- **In-Scope-Fix erledigt:** «✔ »-Präfix aus 5 Quiz-Feedbacks in Station 7
  (`stationenV3.ts`) entfernt — Hausregel «keine Emojis», Stil-Angleichung an die
  anderen sechs Stationen.

---

## 2026-06-26 — v3 M10 geplant: Subpages als adressierbare Schritte (Variante B, nach M9)

Pietro-Feedback: jeder Schritt soll eine **eigene URL** haben (reload-/back-/deep-fest),
nicht nur Client-State. Als neuer Milestone **M10** in `DEV_PLAN_v3.md` (§5 + Checkliste)
festgehalten. Entschieden:

- **Reihenfolge: nach M9.** M9 (Inhalts-/Logik-QA) läuft auf dem stabilen
  Navigationsmodell; der strukturelle Routing-Umbau kommt danach.
- **Umsetzung: Variante B** — Schritt-State in die URL der bestehenden Route
  `/lernen/lernseite-1` spiegeln (Query/Hash + `pushState`/`popstate`), additiv in
  `KiEinheitV3` (Phase) + `StationV3` (Frame-Index) + Auftakt/Abschluss. Variante A
  (echte App-Router-Segmente) verworfen — zu grosser Umbau, kollidiert mit dem
  Single-Page-Orchestrator.
- **ki26-konform:** die URL trägt **nur Navigations-State**, keine Antworten.

(Noch nicht umgesetzt — Scoping; Umsetzung in einer eigenen M10-Session nach M9.)

---

## 2026-06-26 — v3 M8 (Teil 4): UX-Verbesserungen (Pietro-Feedback)

Vier Verbesserungen, in dieselbe M8-Arbeit gefaltet (Review: `review/M8-ux.md`):

- **Auto-Advance.** Nach einer **diskreten** Antwort (4er-Skala-Poll *oder*
  Swipe/Werte) springt automatisch die nächste Frame (≈350 ms). Bewusst **nur
  innerhalb derselben Subpage** — der Subpage-Wechsel bleibt ein expliziter
  «Weiter»-Klick. **Slider lösen nie aus** (kontinuierlich). Weiter/Zurück bleiben
  immer nutzbar; Ref-Guard verhindert Doppelsprung. Damit bleibt §4.2 («eine
  Frage/Frame, Weiter blättert») erfüllt — «Weiter» existiert weiterhin.
- **Subpage-Navigation klarer (StationV3).** Anklickbarer **7-Subpage-Stepper**
  (Sprung zur ersten Frame der Subpage), **einheitlicher Subpage-Kopf** (Typ-Icon +
  Name + Position, über alle Stationen gleich), **«Weiter: <Name>»** in Tertiärfarbe
  signalisiert den Übergang in die nächste Subpage. Die bisher frame-internen Zähler
  («Fakt X von Y», «Frage X von Y») wurden in den Subpage-Kopf zusammengeführt — eine
  konsistente Stelle statt mehrerer. Der redundante Subpage-Name im Stations-Kopf
  wurde entfernt (Stepper + Kopf tragen ihn).
- **Auftakt-Opener-Schwanz.** Die zwei optionalen Videos (Musik-Experiment, Robotik)
  stehen **nebeneinander** als beschriftete Karten (Titel, Kurzbeschrieb, «freiwillig»),
  einzeln abspielbar — freie Wahl statt gestapelter Block. Daten:
  `auftakt.ts` → `OPENER_SCHWANZ_KARTEN`.
- **Quiz-Recap-Copy.** «Beantworte fünf Fragen …» / «5 zufällige Fragen aus unserem
  Pool …» → «… die **restlichen** Fragen …» (St. 2 + St. 7). Die Recap-Subpage zeigt
  die übrigen Pool-Fragen (8 − unter den Medien platzierte = 5–8); der harte Zähler
  passte nicht zur «… von 6»-Anzeige.

---

## 2026-06-26 — v3 M8 (Teil 3): Auftakt-Neuinhalt (Swipe-Set + globale 4er-Skala-Pre-Polls)

Letzter offener M8-Punkt (Spec §74). Entscheidungen mit Pietro:

- **Globale 4er-Skala-Pre-Polls = «Pre+Post, voll aggregiert».** Zwei
  übergreifende Haltungsfragen (`global-einschaetzung`,
  `global-gesellschaft`) als 4er-Skala: **Pre** im Auftakt (Schritt «Haltung»),
  **identisches Post** im Abschluss (Sektion «Meine Haltung — nachher»), gleiche
  geteilte Komponente `Skala4Frage` (Spec-§6-Konsistenz). Sie **ergänzen** den
  globalen Chance↔Bedrohung-**Schieberegler** (persönliche Bewegung); die
  4er-Skala dient der **Aggregation** (Ich/Klasse/alle). Erscheinen im
  Klassen-Spiegel als zwei **«Gesamthaltung»-Zeilen vor den Stationen**.
- **Bewusst KEINE Radar-Landkarte-Achse** für die zwei globalen Polls: ihr
  `landkarteAxis` zeigt absichtlich auf eine ID **ausserhalb** `LANDKARTE_ACHSEN`,
  damit `landkarteAchsenMitDaten()` sie nicht ins Radar zieht. Die globale
  Radar-Achse bleibt der Slider (§10) — die zwei Polls leben nur im Spiegel.
- **Auftakt-Swipe-Set = 6 Karten + optionale Aggregate.** Sechs Wertaussagen,
  je 2 pro Werte-Profil-Achse (Regulierung↔Innovation, Mensch-im-Loop↔Effizienz,
  Datenschutz↔Bequemlichkeit). Profil **lokal** unter Pseudo-Station `auftakt`
  (speist `werteProfilBalken`); zusätzlich **optionale** anonyme Aggregat-Zähler
  je Karte (`castSwipe`, Bucket `links`/`rechts`, derzeit nicht angezeigt).
  **Polaritäts-Konvention:** Zustimmen (rechts) = rechter Pol der Achse.
- **Auftakt jetzt 5 paginierte Schritte** (eine Frage/Karte pro Frame, §4):
  Vorwissen · Reiz · Position (Slider) · Haltung (2 Skala-Pre) · Werte (6 Swipe);
  `einheitStarten` ans Ende verschoben, `preGesetzt`-Gate entfernt.
- **Neue Dateien:** `_data/auftaktPolls.ts`, `_data/auftaktSwipe.ts`,
  `_components/Skala4Frage.tsx`. **Geändert:** `AuftaktV3.tsx`, `AbschlussV3.tsx`,
  `KlassenSpiegel.tsx`, `_lib/unitPolls.ts` (`castSkala`, `castSwipe`). Nur
  `lernseite-1`; keine gemeinsamen Dateien. Review: `review/M8-auftakt.md`.

---

## 2026-06-26 — v3 M8 (Teil 2): Medien-Regeln (§9), Station-4-Schutz (§10), a11y

Invarianten-kritische Technik-Politur von M8 (additiv, nur `StationV3.tsx`):

- **§9 Audio:** Der MP3-Renderer war ein nacktes `<audio>` und ignorierte
  `start`/`end`/`segments` — neue Komponente **`AudioClip`** springt zum Start,
  stoppt hart am Ende und spielt **Mehr-Segment-Fenster** (`segments[]`)
  nacheinander, überspringt die Lücken (Station 5 Sonnenseite). Robust gegen
  Scrubben (aktives Fenster pro `timeupdate` neu bestimmt).
- **§9 YouTube:** «Mehr-Segment» bleibt bewusst als **geteilte
  Einzel-Ausschnitte** (zwei Pole auf Sonnen-/Schattenseite) gelöst — **keine**
  YouTube-IFrame-Player-API. §9 ist erfüllt; der harte Stopp via `&end` bleibt
  best-effort, die Caption nennt das Fenster.
- **§9 SRF & Station 7:** unverändert korrekt (iframe immer ganz + `guidance`;
  3Blue1Brown deutsch) — nur bestätigt.
- **§10 Station 4:** `station.warnung` erscheint jetzt **zusätzlich am Einstieg**
  (Auftakt-Subpage), damit man die freiwillige Station vor dem Einlassen skippen
  kann; Opt-in-Vertiefung + Hilfsangebote **143/147** unverändert.
- **a11y:** Fokus wandert bei jedem Frame-Wechsel auf den neuen Inhalt
  (`tabIndex=-1` + `useEffect`, kein Fokus-Klau beim ersten Render),
  `role="progressbar"`, `aria-pressed` (Skala/Swipe-Auswahl), `aria-live`
  (Faktencheck- und Wahr/Falsch-Auflösung).

Verifikation: in-Sandbox `tsc` erneut unbrauchbar (OneDrive-Dehydrierung —
`StationV3.tsx` als 638 statt ~935 Zeilen, Pseudo-Fehler in nicht angefassten
Dateien). Build/lint massgeblich auf Windows (Pietro). Review:
`review/M8-medien-a11y.md`.

---

## 2026-06-26 — v3 M8 (Teil 1): Casting-Kern — erstmals Cloud-Writes (anonyme Aggregate)

M8 in einer abgesprochenen Teil-Lieferung begonnen (mit Pietro: M7 = grün; diese
Session **nur** der Casting-Kern). Ab jetzt schreibt die Einheit erstmals nach
Firestore — **ausschliesslich anonyme Aggregat-Zähler**, die die schon
bestehende Lese-Schicht (`KlassenSpiegel`) füllen.

1. **Was gecastet wird** (`castPollVote`/`voteOnce`, ein Cast pro Browser pro
   Ziel-ID): 4er-Skala-Polls (**nur Post**), die Schieberegler (global + St. 7
   `st7-vertrauen`, **beim Loslassen** — sonst zählt jeder Zwischenwert beim
   Ziehen) und die **Vorwissen**-Auswahl (beim Start). Persönliche Werte bleiben
   strikt lokal.
2. **Bucket-Schema:** 4er-Skala → Basis-Key `{pollId}-post`, Bucket `s0..s3`
   (genau die Keys, die `KlassenSpiegel` liest). Slider → `{pollId}-{phase}`,
   Bucket `scaleBucket(0..100)`. Vorwissen → `aw-{optId}`, Bucket `ja`. Helfer
   zentral in `_lib/unitPolls.ts` (`castSkalaPost`/`castSlider`/`castVorwissen`).
3. **Warum 4er-Skala nur Post:** die Aggregation dient dem Vorher/Nachher-
   Vergleich im Spiegel (liest Post). Pre bleibt persönlich-lokal. Slider casten
   pre **und** post (für spätere Bewegungs-Aggregation; Reader folgt).
4. **Quiz-«% richtig»** bewusst **nicht** gecastet (Spec §6: optional) — bleibt
   für später offen.
5. **Verifikation in der Cowork-Sandbox weiterhin eingeschränkt:** OneDrive
   dehydriert die per File-Tool editierten Dateien (bash las `unitPolls.ts` mit 76
   alten statt ~115 neuen Zeilen) → in-Sandbox `tsc`/`build` prüfen veralteten
   Code und sind unbrauchbar. Edits über das Read-Tool (Windows-Sicht) bestätigt +
   manuell typgeprüft; `npm run build`/`lint` + Firestore-Sichtprüfung macht
   Pietro auf Windows. Details: `docs/material-pietro/review/M8-casting.md`.

---

## 2026-06-26 — v3 M7: volle Verdrahtung, v3 ist live (Auftakt + Zeitstrahl + Abschluss)

M7 macht die Einheit an der echten Adresse `/lernen/lernseite-1` spielbar. Mit
Pietro abgestimmte Festlegungen, die nicht aus dem Code allein ersichtlich sind:

1. **v3 geht live.** `page.tsx` rendert neu `KiEinheitV3` (State-Machine
   `auftakt → stationen → abschluss`, Phase reload-fest in `ki26-v3-phase`). Der
   **v2-Flow** (`KiEinheit`, `Auftakt`, `Abschluss`, `StationenMenu`) **bleibt im
   Repo, ist aber nicht mehr eingebunden** — Entfernen erst in einem späteren
   Aufräum-Schritt (mit Pietro).
2. **Auftakt = «lean local-only» (Option A).** `AuftaktV3`: Vorwissen
   (Mehrfachauswahl + Freitext, lokal) → Hype-Opener (Ava-Video) → globaler
   **Pre-Slider**. **Keine** Cloud-Writes. Bewusst weggelassen und **auf M8
   verschoben**: 1–2 globale 4er-Skala-Pre-Polls (erst mit Casting sinnvoll) und
   ein Auftakt-Swipe-Set (Spec §74; neuer, zu reviewender Inhalt). Eigene
   Lernziel-Karte inline, weil die v2-Karte einen WissenCheck/Stimmungsbild
   verspricht, die der schlanke Auftakt nicht hat — geteilte `auftakt.ts`
   unangetastet.
3. **Abschluss** (`AbschlussV3`): Post-Slider mit Pre→Post-Pfeil + Landkarte +
   Klassen-Spiegel + Zertifikat-Zugang ab 3. Liest Aggregate nur (Klasse/alle
   «n=0» bis Casting in M8).
4. **Additive Prop-Hooks statt Umschreiben** (OneDrive-schonend): `GlobalSlider`
   bekam optional `onChange`, `ZeitstrahlMenu` optional `onWeiterZumAbschluss`
   (→ Button «Zum Abschluss»; ohne Prop unverändert = `/v3-preview`).
5. **Geteilte `src/config/unit.ts`** (mit Pietro abgesprochen): Lernseite-1-
   Beschreibung von v2-Sprache («Kollektiv-Spiegel») auf v3 umformuliert
   (Zeitstrahl, Sonnen-/Schattenseite, Badges, Chancen-Risiken-Landkarte,
   Zertifikat ab drei Stationen).

Verifikation: isolierte `tsc` (echte React-Typen + faithful App-Stubs) → 3 neue
Dateien EXIT 0. Build/lint macht Pietro auf Windows.

---

## 2026-06-26 — v3 M6: Landkarte (Radar) + globaler Slider + Klassen-Spiegel (lesen-only, neue Dateien)

M6 baut die rückwärts aus den Polls designte **Chancen-Risiken-Landkarte**, den
globalen **Bedrohung↔Chance-Slider** und den **Klassen-Spiegel**. Festlegungen,
die nicht aus dem Code allein ersichtlich sind (mit Pietro abgestimmt):

1. **Anonyme Aggregate in M6 NUR LESEN.** Landkarte/Spiegel lesen
   `loadPollCounts`/`subscribePollCounts`; das **Schreiben** (`castPollVote` in
   `PollFrame` + globalem Slider) kommt in **M8**. Bis dahin zeigen «Klasse»/«alle»
   `n=0`. M6 schreibt **nichts** in die Cloud (ki26-konform).
2. **Bucket-Schema für M8 festgelegt (vom KlassenSpiegel bereits gelesen):**
   4er-Skala → `s{Index}` (0..3), Keys `pollId.poll("{pid}-post")` bzw.
   `pollId.klassePoll(code,"{pid}-post")`; globaler Slider → `scaleBucket`.
3. **Landkarte = Radar/Spinnennetz** (SVG, keine Chart-Library); Ich-Fläche ab 3
   Achsen, sonst nur Punkte. Nur Achsen **mit lokalen Daten** werden gezeichnet →
   wächst mit den Stationen. MD3-Farben via `rgb(var(--color-*))`.
4. **Werte-Profil (Swipe, mehrachsig) separat** als links/rechts-Balken, nicht als
   eine Radar-Speiche (3 Achsen liessen sich nicht sinnvoll zu einer Speiche mitteln).
5. **Globaler Slider** lokal unter Pseudo-Station `"global"`, pollId
   `"global-chance-bedrohung"` (= `landkarte.ts`-Achse). Pre = Auftakt, Post =
   Abschluss (in M7 verdrahtet); in M6 beide in der `AbschlussVorschau`, um die
   Pre→Post-Bewegung zu demonstrieren.
6. **Surface = v3-Vorschau** (Button «Meine Landkarte» im `ZeitstrahlMenu`), analog
   M5. Echte Auftakt/Abschluss-Verdrahtung in `KiEinheit` bleibt **M7**.
7. **4er-Skala-Polarität:** Selektor nimmt Optionen **links→rechts entlang der
   Achse** an (Index 0 = linker Pol); in M9 pro Frage gegenprüfen.

Neue Dateien: `_lib/landkarteData.ts`, `_components/Landkarte.tsx`,
`GlobalSlider.tsx`, `KlassenSpiegel.tsx`, `AbschlussVorschau.tsx`. Geändert:
`ZeitstrahlMenu.tsx` (Button), `v3-preview/page.tsx` (Header). Review:
[`review/M6-landkarte-spiegel.md`](material-pietro/review/M6-landkarte-spiegel.md).

---

## 2026-06-26 — v3 M5: Zeitstrahl-Menü + client-seitiges Zertifikat (rein lokal, neue Dateien)

M5 (Timeline + Fortschritt + Zertifikat) bringt die freie Stationswahl und die
Belohnung. Festlegungen, die nicht aus dem Code allein ersichtlich sind:

1. **Neue v3-Komponenten statt Umbau der v2-`StationenMenu`.**
   [`_components/ZeitstrahlMenu.tsx`](../src/app/lernen/lernseite-1/_components/ZeitstrahlMenu.tsx)
   (Zeitstrahl der 7 Stationen, grün bei Abschluss, Fortschrittsbalken,
   Badge-Sammlung, Zertifikat-Gate) und
   [`_components/Zertifikat.tsx`](../src/app/lernen/lernseite-1/_components/Zertifikat.tsx)
   sind **neu**; die v2-`StationenMenu.tsx`/`_lib/fortschritt.ts` bleiben unberührt
   bis zur Migration in M7 (gleiche Linie wie stationenV3/StationV3/stationStore).
2. **M5 liest aus dem v3-Store, nicht aus v2-`fortschritt.ts`.** «grün», Fortschritt
   und Zertifikat speisen sich aus `stationStore.abgeschlosseneStationen` /
   `badgeSammlung` / `quizScore` (Abschluss wird in StationV3/BadgeFrame gesetzt).
   Das Menü liest den Stand beim Rücksprung neu (useEffect, SSR-sicher).
3. **Zertifikat = rein abgeleitet, kein eigener Store; «grün» = `tertiary`-Token.**
   Die Urkunde wird client-seitig aus dem lokalen Store berechnet (Stationen,
   Badges je Familie, Quiz-Punkte-Summe, Datum). **Download vorerst via «Drucken →
   als PDF speichern»** (`window.print()`, Steuerleiste `print:hidden`); echte
   Datei-Generierung ist optional (v3 §15.3 lässt das Layout offen). Das Grün der
   abgeschlossenen Stationen nutzt bewusst das **`tertiary`**-Token (RGB 29 105 64),
   da es im MD3-System die einzige grüne Rolle ist; `primary` bleibt Blau.
4. **Keine Cloud-Writes in M5.** Anonyme Aggregat-Zähler (Poll-Verteilung, Quiz
   «% richtig») bleiben für M6/M8; M5 ist vollständig lokal/ki26-konform.
5. **`v3-preview` rendert ab jetzt das Menü** statt direkt Station 1 — jede Station
   ist über das Menü erreichbar (M4-Durchklick bleibt möglich). M7 ersetzt die
   Vorschau-Route durch die echte Auftakt/Abschluss-Verdrahtung in `KiEinheit`.

---

## 2026-06-26 — v3 M4: lokaler Stations-Store, Persistenz statt Remount-Reset, Aggregate auf M6/M8 verschoben

M4 (Interaktions-Tiefe) legt die stateful Logik unter die M3-Shell. Drei nicht
aus dem Code allein ersichtliche Festlegungen:

1. **Neuer lokaler Store statt Erweiterung von `_lib/punkte.ts`.** Die v3-Logik
   (Quiz-Scoring, Swipe-Profil, Faktencheck-Zustand, Poll-Auswahl, Reflexion,
   Stations-Abschluss + Badge-Sammlung) lebt in der **neuen** Datei
   [`_lib/stationStore.ts`](../src/app/lernen/lernseite-1/_lib/stationStore.ts)
   (localStorage-Präfix `ki26-v3-`). `punkte.ts` (v2, per-qid) bleibt unberührt
   bis zur Migration in M7 — gleiche Linie wie stationenV3/StationV3 (Build-grün >
   wörtlicher Dateiname).
2. **Persistenz hebt den M3-Remount-Reset auf.** In M3 erzwang `key={i}` einen
   Remount, um die „klebende Auswahl“ zu fixen — verlor dabei aber die Antwort.
   Jetzt **hydrieren** die Frames ihren Anfangszustand aus dem Store, sodass
   `key={i}` bleiben kann und Zurück-/Vor-Navigation den Stand zeigt. **Quiz/Fakt
   = erste Antwort bindet** (Lernehrlichkeit); **Swipe = überschreibbar** (Haltung,
   kein richtig/falsch). Faktencheck-Variante (wahr/falsch) wird gespeichert →
   kein Neu-Würfeln beim Zurückblättern.
3. **Anonyme Aggregat-Zähler bewusst nach M6/M8 verschoben.** M4 schreibt **nichts**
   in Firestore — Quiz-«% richtig» und Poll-Verteilung sind im M4-Text explizit als
   optional/„see M6/M8“ markiert; M8 verdrahtet alle `abstimmungen/ki26/…`-Aggregate
   gebündelt. Vorteil: M4 ist rein lokal und in der Sandbox vollständig per
   isolierter `tsc` prüfbar (Voll-build/lint macht Pietro auf Windows). Station
   gilt als abgeschlossen beim Erreichen des Befund-Frames (idempotenter
   `markStationAbgeschlossen`-`useEffect`); `abgeschlosseneStationen` + `badgeSammlung`
   stehen für das Zertifikat in M5 bereit.

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

## 2026-07-05 — Viewer-Fix (Performance/Vollbild) + Kontext-Verknüpfung in Führungen

**Problem (Christof):** Der Vollbild-Viewer wirkte «funktioniert nicht». Zwei
Ursachen behoben:
- **`backdrop-blur-sm` entfernt** → opakes Overlay (`bg-inverse-surface`). Der
  Blur über die ganze Fläche mit grossem Bild dahinter ist teuer und liess den
  Viewer auf manchen Geräten ruckeln/hängen (im Preview reproduzierbar: der
  Screenshot-Renderer blieb hängen).
- **Echtes Vollbild ergänzt:** Fullscreen-API-Toggle (⛶) im Viewer-Kopf —
  `requestFullscreen`/`exitFullscreen` auf dem Dialog-Root, gestengesteuert,
  mit try/catch-Fallback aufs In-Page-Overlay.

**Kontext-Verknüpfung:** Jedes Bild hat neu eine `contextNote`; der Viewer
hängt sie als Schluss-Stopp **«Im Kontext der Zeit»** an die Führung an (Gesamt-
blick). Sie verknüpft das Bild textlich mit der **technischen Errungenschaft**
und der **gesellschaftlichen Verunsicherung** der Epoche — so zeigen die
Führungen nicht nur Bilddetails, sondern ordnen sie ein.

Verifiziert im Preview (DOM): Viewer öffnet, Overlay opak, Vollbild-Button da,
Führung Schule von Athen 6 → 7 Stopps, Marker auf Detail-Stopps sichtbar.

---

## 2026-07-05 — Bild-Viewer mit Zoom + kuratierten Führungen (Arts-&-Culture-Stil)

Die Epochen-Galerien öffnen neu in einem **zoombaren Vollbild-Viewer**
(`BildZoom.tsx`): Mausrad/Pinch/Doppelklick zoomen, Ziehen verschiebt, Buttons
für Zoom/Einpassen. Bewusst **ohne neue Dependencies** (reines React + CSS-
Transforms — `package.json` ist geteilter Bereich).

**Führungen:** Vier Bilder haben kuratierte Touren («Führung starten»): die
Ansicht fährt animiert von Detail zu Detail, mit Titel + Erklärtext und
Fokus-Ring — Schule von Athen (6 Stopps: Platon/Aristoteles, Sokrates,
Pythagoras, Euklid, Ptolemäus/Raffael), Tod des Sokrates (5), Eisenwalzwerk
(5), «Suche nach Bildern» (6). Tour-Stopps sind Prozent-Koordinaten in den
Daten (von Hand gesetzt, leicht justierbar); Thumbnails mit Tour tragen ein
«Führung»-Badge. Weitere Touren können einfach als `tour:[…]` ergänzt werden.

---

## 2026-07-05 — Bausteine quellenbasiert erweitert (Quellen geprüft)

Die drei Bausteine je Epoche haben jetzt **umfangreichere Texte** und je **1–3
geprüfte Quellen** (als Links im aufgeklappten Panel, `target=_blank`). Alle
Quell-URLs wurden am 2026-07-05 per `curl` auf **HTTP 200 / öffentliche
Zugänglichkeit** getestet — nur bestätigte URLs sind eingebaut.

Genutzte Quelltypen (bewusst autoritativ + frei zugänglich): **Stanford
Encyclopedia of Philosophy** (Aristoteles, Sophisten, Sokrates, Augustinus,
Kant, Marx, Philosophie der Technik), **Internet Encyclopedia of Philosophy**,
**Wikipedia**, **Wikisource** (Kant, „Was ist Aufklärung?“ Volltext), **arXiv**
(Transformer-Paper), **CERN** (Geburt des Web), **Royal Museums Greenwich**
(Harrison/Längengrad), **Britannica** (Dampfmaschine), **New Advent** (De
civitate Dei), **marxists.org** (Manifest-Volltext).

Verworfen: projekt-gutenberg-URL für Kants Aufklärungs-Essay (404) → ersetzt
durch die deutsche Wikisource-Ausgabe. **Regel:** neue Quellen vor dem Einbau
auf 200/öffentlich prüfen.

---

## 2026-07-05 — Umbau zu Epochen-Panels + Bausteinen + Galerie je Epoche

Auf Wunsch (Christof) neu strukturiert — weg von der erzwungenen Dramaturgie,
hin zu **modularen, nüchtern betitelten Bausteinen**:

- **Kein globales Bilderset**, sondern **eine Galerie je Epoche** (≥3
  gemeinfreie „Bilder der Zeit", nur innerhalb der Epoche durchblätterbar;
  Vollbild mit ‹/›, Pfeiltasten, Zähler, Caption + Nachweis).
- **Drei einzeln aufklappbare Bausteine pro Epoche**, nüchtern betitelt:
  **Technische Errungenschaft · Verunsicherung · Philosophische
  Orientierungshilfe**. Sie sind aufeinander bezogen, **kein erzwungener
  Kausal-Zusammenhang** — jeder Baustein steht auch für sich. Man klappt auf,
  was man will (Default: alle zu).
- Neue gemeinfreie „Bilder der Zeit": Rembrandt „Aristoteles mit Büste Homers"
  (1653), Très Riches Heures/Oktober (um 1416), Wright „Orrery" (um 1766),
  Loutherbourg „Coalbrookdale bei Nacht" (1801); für die Gegenwart NASA
  „Earth at Night" (2012) und „Blue Marble" (1972, beide US-Gov/PD).
- Hegel-Rahmung entschärft: keine „→ deshalb"-Kausalität mehr; die Idee
  (Philosophie antwortet im Rückblick, sieht nicht voraus) steckt nur noch im
  Text der Orientierungshilfe.

---

## 2026-07-04 — Präzisierung der Hegel-Deutung + Bilderset-Galerie

**Sprachregelung (Christof):** Die Philosophie antwortet **nicht «im
Nachhinein»** im strengen Sinn. Richtig: Sie **sieht nicht voraus**, sondern
antwortet **im Blick auf das, was war, auf die Fragen ihrer Gegenwart** —
populär/wirksam wird die Antwort oft erst später. Entsprechend umformuliert:
Spur-3-Label («Die Philosophie antwortet — im Blick auf das, was war»),
Hegel-Glosse im Seitenkopf, Stations-Texte (Kant antwortet auf seine Gegenwart,
Marx' Antwort wird erst Jahrzehnte später weltweit populär, «Jetzt»-Station).
Spur-1-Label neu: **«Was die Technik wandelt — und neu ordnet»** (statt
«verschiebt die Welt»).

**Bilderset-Galerie:** Alle Kunstwerke des Zeitstrahls lassen sich als Set
durchblättern — Button «Bilderset durchblättern» + ‹/›-Navigation, Pfeiltasten,
Zähler, Epoche/Rolle und Bildnachweis im Vollbild. Reihenfolge erzählerisch:
je Epoche Verunsicherung → Antwort.

---

## 2026-07-04 — Hegel-Dramaturgie: Dreiklang pro Epoche + Verunsicherungs-Bilder

Der Schablonen-Zeitstrahl erzählt jede Epoche jetzt in **drei Schlägen**:
**Technik verschiebt die Welt** (primary) → **die Verunsicherung wächst**
(error-Ton, mit eigenem Kunstwerk) → **die Philosophie antwortet — im
Nachhinein** (tertiary). Rahmung über Hegels Eule der Minerva («beginnt erst
mit der einbrechenden Dämmerung ihren Flug», Rechtsphilosophie-Vorrede) als
Blockzitat im Seitenkopf; die Gegenwarts-Station endet mit «die Eule ist für
unsere Zeit noch nicht gestartet».

Damit hat jede Epoche **mehr als ein Bild**. Neue gemeinfreie Verunsicherungs-
Werke: David «Der Tod des Sokrates» (1787) · Sylvestre «Die Plünderung Roms»
(1890) · Kupferstich «Destruction de Lisbonne» (1755) · Doré «Over London – by
Rail» (1872, aus Buchseiten-Scan zugeschnitten; eine bebilderte Buchseiten-
Reproduktion mit Caption wurde verworfen).

Inhaltliche Umhängung für die Chronologie: **Druckpresse** wandert von der
Augustinus- zur Kant-Station (Druck 1440 → Reformation/Religionskriege →
Aufklärung als Antwort — hegelisch sauber); Augustinus behält die mechanische
Uhr als ordnende Technik des christlichen Zeitalters, seine Verunsicherung ist
der **Fall Roms 410** (De civitate Dei 413–426 als Antwort *nach* dem Schock).

---

## 2026-07-04 — Zwei-Spuren-Zeitstrahl + Marx-Station (Option A)

Der Schablonen-Zeitstrahl (`/sandbox/philosophie-schablonen`) ist jetzt
**zweispurig**: pro Epoche zuerst die **Technik-Spur** (kompakte Ereignis-Karten
aus der [Technik-Zeitachse](skripte/lernseite-2-submodul-1-technik-zeitachse.md),
primary-blau) und darüber gelegt die **Philosophie-Spur** (Stations-Karte mit
Kunstwerk, tertiary-grün). Legende oben erklärt die Spuren.

Neu: **Station „Marx · Industriemoderne"** (Option A) als philosophischer
Gegenpart zu Dampfmaschine, Elektrizität/Elektronik und Telegraf/Seekabel —
Zitat „Alles Ständische und Stehende verdampft", Kunstwerk **Adolph Menzels
„Das Eisenwalzwerk"** (1872–1875, gemeinfrei, Google-Art-Project-Scan; die
zuerst gefundene Reproduktion trug ein Wasserzeichen und wurde verworfen).

Designlinie: klassische Kunstwerke + neutrale Material-Icons statt
KI-Symbolik; MD3-Token, keine Sonderfarben.

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
Vercel-Projekt. Begründun