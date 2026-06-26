# Improv-Plan v3 — Lernseite 1 (KI-Einheit)

> **Zweck:** Handoff für eine **neue Session**. Neun Verbesserungen an der
> KI-Einheit (Lernseite 1, v3-Flow). Jede ist unten einzeln bewertet (Befund ·
> Ursache · betroffene Dateien · Umsetzung · Akzeptanzkriterien). Reihenfolge,
> Owner-/Absprache-Hinweise und die nötigen CLAUDE.md-Updates am Schluss.
>
> **Quelle der Wahrheit:** der **committete** Code auf `origin/main`
> (Commit `894237f`) — die intakte 1029-Zeilen-`StationV3.tsx`. Siehe Phase 0.
>
> **Stilregeln (zwingend, aus CLAUDE.md):** Material Symbols Outlined statt
> Icons/Emojis · nur MD3-Tokens (`text-tertiary`, `bg-surface-bright`, …), keine
> Tailwind-Standardfarben · UI deutsch · **echte Umlaute `ä ö ü`**, **`ß`→`ss`**,
> niemals `ae/oe/ue` · jede Page in `<AppLayout>` + `<ActivityTracker>`.

---

## Phase 0 — Pre-Flight (zwingend, vor jeder Änderung)

Das lokale Working Tree war zwischenzeitlich **beschädigt** (uncommittete
Teil-Writes: 15 Dateien, ~4036 Löschungen — u.a. `StationV3.tsx` 1029→635 Zeilen,
`stationenV3.ts` −2867 Zeilen, gesamter Stations-Content weg). Der **gepushte**
Stand (`origin/main` == `HEAD` == `894237f`) ist **intakt**.

```bash
git fetch origin
git status                 # zeigt evtl. noch kaputte uncommittete Änderungen
# Den intakten committeten Stand wiederherstellen (verwirft die kaputten Edits):
git restore .              # oder gezielt die 15 Dateien
git pull --rebase origin main

# Verifizieren, dass der gute Stand da ist:
wc -l src/app/lernen/lernseite-1/_components/StationV3.tsx   # MUSS 1029 sein
npm run build && npm run lint                                # grüne Baseline
```

Erst wenn `StationV3.tsx` 1029 Zeilen hat und Build/Lint grün sind, mit den
Verbesserungen beginnen. (Pietro hat bestätigt: alles ist gepusht — falls lokal
etwas fehlt, von GitHub holen.)

---

## Architektur-Kontext (Kurzüberblick)

Live-Flow auf `/lernen/lernseite-1` → `page.tsx` → **`KiEinheitV3`** (State-Machine,
Phase in `localStorage` `ki26-v3-phase`):

```
auftakt   → AuftaktV3      (Vorwissen · Reiz · Position-Slider · Haltung(2× 4er-Skala) · Werte(6 Swipe))
stationen → ZeitstrahlMenu → StationV3 (pro Station 7 „Subpages“ → buildFrames())
abschluss → AbschlussV3    (Post-Slider · Haltung-nachher · Landkarte · KlassenSpiegel · Zertifikat ≥3)
```

**`StationV3.buildFrames(station)`** zerlegt eine Station in Frames (1 Item/Frame),
gruppiert nach `SubpageKey` (`auftakt · sonne · schatten · swipe · fakten · quiz ·
befund`). Die Hauptkomponente rendert Kopf, **Fortschrittsbalken + Zähler**,
`SubpageStepper`, `Banner`, Frame-Inhalt und Navigation (Zurück/Weiter).
Auto-Advance via `setTimeout(…, 350)` innerhalb derselben Subpage.

**Persistenz (alles lokal, ki26-konform):**
`_lib/stationStore.ts` (`ki26-v3-*`) — Quiz (gepunktet, erste Antwort bindet),
Swipe-Profil, Faktencheck-Zustand, Poll-Auswahl, Reflexion, **Abschluss +
Badges** (`markStationAbgeschlossen`). `_lib/punkte.ts` ist das ältere
v2-WissenCheck-Punktesystem (vom V3-Flow **nicht** genutzt — relevant ist
`stationStore.quizScore`). Cloud: nur anonyme Aggregat-Zähler über
`_lib/unitPolls.ts` / `@/lib/polls.ts` (`abstimmungen/ki26/polls/{pollId}`).

**Theming:** alle Farben sind **MD3-Tokens als CSS-Variablen** auf `:root` in
`src/app/globals.css` (`--color-*` als „R G B"), gemappt in `tailwind.config.ts`.
→ Dark Mode = ein zweiter Variablen-Block, **keine** Komponenten-Änderungen nötig.

---

## Die 9 Verbesserungen

### 1 · Werte-Karten: Layout + „wischen"-Wording entfernen

**Befund.** Die Werte-/Swipe-Karten texten „**Wische** … nach links/rechts",
obwohl es kein Swipe-Gesture gibt — nur zwei Buttons. Verwirrend.

**Ursache.** Anleitungs-Texte + Icon suggerieren Wischen:
- `AuftaktV3.tsx` → `WerteBlock`: `<Anleitung>Sechs Wert-Karten. Wische — also tippe — nach links …</Anleitung>`.
- `stationenV3.ts`: in den `swipe`-`banner.anleitung` der Stationen stehen ähnliche „wische"-Formulierungen.
- `StationV3.tsx`: `SUBPAGE_ICON.swipe = "swipe"` und `SUBPAGE_LABEL.swipe = "Werte"`.
- Layout: `SwipeFrame` (in `AuftaktV3.tsx` **und** `StationV3.tsx`) hat bereits Karte + 2 Buttons, ist aber optisch dünn.

**Dateien.** `AuftaktV3.tsx`, `StationV3.tsx`, `_data/stationenV3.ts`.

**Umsetzung.**
1. Alle „wische/Wische/wischen"-Formulierungen ersetzen durch klare Button-Sprache,
   z.B. *„Sechs Wert-Karten. Tippe an, ob du eher zustimmst oder eher anders
   denkst — das baut dein Werte-Profil."* (in `WerteBlock` **und** allen
   `swipe`-`banner.anleitung` in `stationenV3.ts`).
2. `SUBPAGE_ICON.swipe`: `"swipe"` → `"touch_app"` (keine Wisch-Konnotation).
3. Karten-Layout vereinheitlichen/verstärken (eine geteilte `WerteKarte`-Optik):
   - Aussage prominent als Karte (`rounded-xl border border-outline-variant bg-surface-bright p-lg text-center text-body-lg shadow-sm`).
   - Darunter **zwei gleich grosse Buttons** im `grid grid-cols-2 gap-md`; linker
     = „Sehe ich anders" (Icon `arrow_back`/`thumb_down`), rechter = „Sehe ich
     auch so" (`thumb_up`/`arrow_forward`). Aktiver Zustand über
     `border-primary bg-primary-container text-on-primary-container` (wie heute).
   - `aria-pressed` beibehalten. Pol-Labels weiter aus `karte.achse` mit
     Fallback „Sehe ich anders" / „Sehe ich auch so".
4. **DRY-Empfehlung:** Die identischen `SwipeFrame`-Implementierungen in
   `AuftaktV3.tsx` und `StationV3.tsx` in eine geteilte Komponente
   `_components/WerteKarte.tsx` ziehen (Props: `aussage`, `achse`, `pick`,
   `onPick`). Reduziert Doppelpflege.

**Akzeptanzkriterien.** Kein „wisch"-Wort mehr in der Unit · Karte zeigt Aussage
+ zwei klar beschriftete Buttons · Auswahl sichtbar markiert · Verhalten
(Speichern, Auto-Advance) unverändert.

---

### 2 · Auto-Advance animieren + 0,5 s mehr Wartezeit

**Befund.** Beim automatischen Weiterspringen (nach diskreter Antwort) fehlt eine
Übergangs-Animation, und der Sprung kommt für manche zu schnell.

**Ursache.** Drei Stellen mit `setTimeout(… , 350)` und hartem Frame-Wechsel
(`key={i}`-Remount ohne Transition):
- `StationV3.tsx` → `autoAdvance()` (Haupt-Frames).
- `AuftaktV3.tsx` → `HaltungBlock` (4er-Skala) und `WerteBlock` (Swipe).

**Dateien.** `StationV3.tsx`, `AuftaktV3.tsx`, `globals.css` (Keyframes).

**Umsetzung.**
1. Verzögerung **+500 ms**: `350` → **`850`** an allen drei Stellen. (Eine
   gemeinsame Konstante `AUTO_ADVANCE_MS = 850` einführen, z.B. in
   `stationStore.ts` oder einem `_lib/ui.ts`, und überall importieren — kein
   Magic Number.)
2. **Entrance-Animation** beim Frame-Wechsel: in `globals.css` Keyframes
   ergänzen und als Utility nutzen:
   ```css
   @keyframes frame-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
   .animate-frame-in { animation: frame-in 0.3s ease-out both; }
   @media (prefers-reduced-motion: reduce) { .animate-frame-in { animation: none; } }
   ```
   Den Frame-Inhalts-Container (der `key={i}`-`div` mit `inhaltRef` in
   `StationV3.tsx`, analog die paginierten Blöcke in `AuftaktV3.tsx`) mit
   `animate-frame-in` versehen, damit jeder neue Frame sanft einblendet.
3. `prefers-reduced-motion` respektieren (siehe oben).

**Akzeptanzkriterien.** Nach einer Antwort vergeht spürbar länger (~0,85 s) bis
zum nächsten Frame · neuer Frame blendet animiert ein · manuelles Weiter/Zurück
weiterhin sofort nutzbar · bei reduzierter Bewegung keine Animation.

---

### 3 · Faktencheck: Weiter-Button wird aus dem Bild geschoben

**Befund.** Nach der Wahr/Falsch-Antwort erscheint der Feedback-Block (Auflösung +
Quelle). Die Karte wächst, der **Weiter-Button** rutscht unter den Viewport — man
muss scrollen, um zum nächsten Fakt zu kommen.

**Ursache.** `StationV3.tsx` → `FaktFrame` rendert das Feedback (`antwort !== null`)
**unterhalb** des Inhalts; die globale Navigationszeile (Zurück/Weiter) sitzt ganz
unten in der Hauptkomponente. Kein Auto-Scroll, kein Sticky.

**Dateien.** `StationV3.tsx` (`FaktFrame` + Navigationszeile).

**Umsetzung (empfohlen: A + B).**
- **A — Feedback nach Antwort einscrollen:** im `FaktFrame` einen `ref` auf den
  Feedback-Block setzen und in einem `useEffect([antwort])`
  `ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })` aufrufen,
  sobald `antwort !== null`. So kommt Auflösung **und** der darunterliegende Weiter
  in Sicht.
- **B — Navigationszeile sticky machen:** die untere Nav in `StationV3` mit
  `sticky bottom-0 z-10 bg-surface-bright` (+ kleiner Top-Border/Shadow) fixieren,
  damit Weiter immer erreichbar bleibt — gilt dann für **alle** Frames, nicht nur
  Faktencheck (auch bei langen Medien-Frames hilfreich).
- Optional: Feedback-Text straffen (Auflösung + „Tatsächlich gilt" + Quelle in
  kompakterer Form), damit weniger Höhe entsteht.

**Akzeptanzkriterien.** Nach Beantworten eines Fakts ist der Weiter-Button ohne
manuelles Scrollen erreichbar (Mobile + Desktop) · Auflösung bleibt sichtbar ·
Verhalten der anderen Frames unbeschädigt.

---

### 4 · Verständnisfragen rahmen statt stapeln

**Befund.** Die „Verständnis — direkt zum eben Gesehenen"-Fragen unter einem
Medium liegen als blanke, gestapelte Blöcke untereinander. Gewünscht: jede Frage
**in einem Rahmen** wie die Poll-Fragen.

**Ursache.** `StationV3.tsx`, Media-Frame:
`frame.fragen.map((q) => <QuizFrameView … />)` rendert die `QuizFrameView` ohne
Container. Referenz-Optik („wie die Poll-Fragen"): in `AbschlussV3.tsx` sind die
Skala-Polls je in `rounded-xl border border-outline-variant bg-surface-bright p-lg`
gewrappt.

**Dateien.** `StationV3.tsx` (Media-Frame `fragen`-Rendering). Optional
`QuizFrameView` selbst.

**Umsetzung.**
- Jede Verständnisfrage in einen Rahmen setzen:
  ```tsx
  {frame.fragen.map((q) => (
    <div key={q.id} className="rounded-xl border border-outline-variant bg-surface-bright p-lg">
      <QuizFrameView stationId={station.id} frage={q} />
    </div>
  ))}
  ```
- Bei >1 Frage zusätzlich vertikaler Abstand (`gap-md`, bereits vorhanden).
- Konsistenz: dieselbe Rahmen-Optik auch im Quiz-Recap-Frame erwägen (dort ist es
  je 1 Frage/Frame, also weniger dringend, aber einheitlich).

**Akzeptanzkriterien.** Verständnisfragen erscheinen als einzeln gerahmte Karten
(gleiche Optik wie Poll-Fragen im Abschluss), nicht als nackter Stapel · Antwort-
/Scoring-Verhalten unverändert.

---

### 5 · Wort „Subpage" entfernen → „Schritt"/„Schritten"

**Befund.** In den Stations-Bannern steht sichtbar „**Subpage** n/7" (z.B.
„Station 1 · Subpage 1/7: Einstieg & Meinung").

**Ursache.** `_data/stationenV3.ts` — die `subpages.*.inhalt`-Strings (7 Subpages ×
7 Stationen ≈ **49 Strings**) enthalten „Subpage". `banner.inhalt` wird im
`Banner` (Icon `menu_book`) angezeigt.

**Dateien.** `_data/stationenV3.ts` (Pflicht). Optional Kommentare in
`StationV3.tsx`, `quizBezug.ts` (nicht user-facing, kosmetisch).

**Umsetzung.**
- In allen `inhalt`-Strings „`Subpage`" → „`Schritt`" ersetzen
  (Replace-all über die Datei): *„Station 1 · Schritt 1/7: Einstieg & Meinung"*.
- Prüfen, ob „Subpage" sonst irgendwo **sichtbar** auftaucht
  (`grep -rn "Subpage" src/app/lernen/lernseite-1` und Treffer in JSX-Text /
  Daten-Strings korrigieren). Interne Identifier (`SubpageKey`, `SubpageBanner`,
  `SUBPAGE_*`, `subpages`-Feldname) **bleiben** — nur User-Text ändern.
- Wo „die Subpage(s)" als Fliesstext stünde: Plural „Schritten" nutzen.

**Akzeptanzkriterien.** Kein sichtbares „Subpage" mehr in der Unit · interne
Typen/Keys unverändert (Build grün).

---

### 6 · Zähler „3/25" aus der Stationsleiste entfernen (Balken behalten)

**Befund.** Über jeder Station steht neben dem Fortschrittsbalken ein Zähler
`{i+1}/{frames.length}` (z.B. „3/25"). Gewünscht: nur der Balken.

**Ursache.** `StationV3.tsx`, Fortschritts-Block:
```tsx
<span className="text-label-sm text-on-surface-variant">{i + 1}/{frames.length}</span>
```

**Dateien.** `StationV3.tsx`.

**Umsetzung.**
- Den `<span>{i+1}/{frames.length}</span>` entfernen.
- Den Balken behalten und auf volle Breite setzen (das umschliessende
  `flex items-center gap-sm` ggf. zu nur dem `progressbar`-`div` vereinfachen,
  `flex-1` kann entfallen).
- **a11y nicht verlieren:** `role="progressbar"` mit `aria-valuenow/min/max` und
  `aria-label="Schritt {i+1} von {frames.length}"` **behalten** — die Zahl bleibt
  für Screenreader, nur die visuelle Anzeige entfällt.

**Akzeptanzkriterien.** Kein sichtbarer „n/25"-Zähler mehr · Fortschrittsbalken
bleibt und füllt sich · Screenreader nennt weiterhin den Schritt.

---

### 7 · Dark Mode für die **ganze** Unit (nicht nur Lernseite 1) + CLAUDE.md

**Befund/Ziel.** Manueller Dark-Mode-Umschalter, **Light als Default** (Pietros
Entscheid), wirksam für die gesamte Anwendung.

**Ursache/Hebel.** Alle Farben sind CSS-Variablen-Tokens auf `:root`
(`globals.css`) → ein `.dark`-Override-Block reicht, **keine** Komponenten müssen
angefasst werden.

**Dateien (mehrere „gemeinsam" — Absprache mit Christof, siehe unten):**
`src/app/globals.css`, `tailwind.config.ts`, `src/app/layout.tsx`,
`src/components/layout/TopAppBar.tsx`, **neu** `src/components/ThemeToggle.tsx`,
plus **beide** `CLAUDE.md` + `docs/decisions.md`.

**Umsetzung.**
1. **Dark-Tokens** in `globals.css`: einen `.dark { … }`-Block mit dem MD3-Dark-
   Palette-Gegenstück **aller** `--color-*`-Variablen (dunkle Surfaces, helle
   On-Farben, gedimmtes Primary/Tertiary/Error, passende Container). `:root`
   bleibt Light (`color-scheme: light`), `.dark` setzt `color-scheme: dark`.
   Strategie: **Class-based** (`html.dark`), nicht nur Media-Query, damit der
   Toggle override kann.
2. `tailwind.config.ts`: `darkMode: "class"` ergänzen (für eventuelle gezielte
   `dark:`-Ausnahmen; das Token-Swapping allein braucht es nicht, schadet aber
   nicht).
3. **`ThemeToggle.tsx`** (Client): liest/setzt `localStorage["ki26-theme"]`
   (`"light"`/`"dark"`), toggelt `document.documentElement.classList`. Button im
   MD3-Stil mit Material Symbol (`dark_mode`/`light_mode`), `aria-label`
   „Dunkelmodus umschalten". In `TopAppBar.tsx` rechts **neben** den
   „Hilfe"-Button setzen (gleiche `h-8 w-8 rounded-full border …`-Optik).
4. **No-Flash-Script** in `layout.tsx` `<head>`: ein kleines inline
   `<script>`, das vor dem Paint `ki26-theme` liest und ggf. `dark` auf `<html>`
   setzt (verhindert Light→Dark-Flackern). Da Default = Light: nur dann `dark`
   setzen, wenn `localStorage` explizit `"dark"` enthält (System-Setting wird
   **nicht** automatisch gefolgt — Pietros Entscheid).
5. **Sichtprüfung:** Auftakt, Station (alle Frame-Typen inkl. Medien-iframes,
   Faktencheck-Feedback, error-container-Warnungen), Abschluss, Zertifikat,
   Landing-Page, SideNav/MobileNav — Kontraste prüfen, besonders
   `error-container`/`tertiary-container` und Slider-`accent-primary`.
6. **CLAUDE.md aktualisieren** (siehe Abschnitt „CLAUDE.md-Updates").

**Akzeptanzkriterien.** Toggle in der TopAppBar auf jeder Seite · Default Light ·
Auswahl persistiert über Reload/Navigation · kein Flackern beim Laden · alle
Seiten der Unit in Dark gut lesbar (Tokens, keine Hardcodes) · CLAUDE.md +
decisions.md dokumentieren den Dark-Mode-Standard.

---

### 8 · Auswertung nach jeder Poll-Serie (Ich · meine Klasse · alle)

**Befund/Ziel.** Wie im Abschluss (`KlassenSpiegel`: „Ich vs. Klasse vs. alle")
soll **nach jeder Poll-Serie** eine **Auswertungs-Seite** kommen, die die
Ergebnisse **aller** Fragen dieser Serie zeigt. Serien:
- **Auftakt → Haltung:** die 2 globalen 4er-Skala-Pre-Polls (`AUFTAKT_SKALA_POLLS`).
- **Station → Befund:** die 3 Post-Polls der Station (skala4/slider).

**Ursache/Hebel.** `KlassenSpiegel.tsx` kann das schon — aber nur **gesammelt am
Ende** und über **alle** Achsen. Die `AchsenZeile`-Komponente (Ich-Marker +
`Verteilung` Klasse + `Verteilung` alle, liest `@/lib/polls`-Aggregate) ist genau
der Baustein. Aggregate werden an der Quelle gecastet:
`PollFrame`/`Skala4Frage` casten **post** (`castSkalaPost`), Slider beim Loslassen.

**Dateien.** **Neu** `_components/PollAuswertung.tsx` (Refactor von `AchsenZeile`
aus `KlassenSpiegel.tsx` heraus, dann dort wiederverwenden), `StationV3.tsx`
(Befund-Frame), `AuftaktV3.tsx` (nach `HaltungBlock`). Evtl. `unitPolls.ts`
(falls Pre-Aggregat gecastet werden soll, s.u.).

**Umsetzung.**
1. `AchsenZeile` + die Achsen-Helfer aus `KlassenSpiegel.tsx` in eine
   **wiederverwendbare** `PollAuswertung`-Komponente extrahieren, die eine
   **Teilmenge** Polls + `stationId` + Phase entgegennimmt und je Poll eine
   Ich/Klasse/Alle-Zeile rendert. `KlassenSpiegel` nutzt sie danach mit der vollen
   Achsenliste (Verhalten unverändert).
2. **Station-Befund:** in `buildFrames` nach den 3 Post-Poll-Frames (vor
   `reflexion`) einen neuen Frame `{ kind: "auswertung", sub: "befund" }` einfügen,
   der `PollAuswertung` für die Post-Polls dieser Station rendert
   (Überschrift „Ich, meine Klasse, alle"). Frame-Union-Typ + Render-Switch in
   `StationV3` ergänzen.
3. **Auftakt-Haltung:** nach Abschluss des `HaltungBlock` einen Auswertungs-Schritt
   einschieben (eigener Schritt in `AuftaktV3` zwischen „Haltung" und „Werte", oder
   am Ende von `HaltungBlock` vor `onDone`), der `PollAuswertung` für die 2
   Skala-Pre-Polls zeigt.
4. **Aggregat-Abhängigkeit (wichtig):** `KlassenSpiegel` liest die **`{pid}-post`**-
   Buckets. Für die **Station-Post**-Auswertung passt das direkt (post wird
   gecastet). Für die **Auftakt-Pre**-Serie gibt es ggf. **kein** Pre-Aggregat in
   der Cloud → dann zeigt die Auswertung nur „Ich" + leere Klasse/Alle. **Entscheid
   nötig:** entweder (a) `PollAuswertung` für Pre auf „Ich + (sofern vorhanden)
   Aggregat" auslegen und freundlich leer rendern, oder (b) im Auftakt zusätzlich
   ein **Pre-Aggregat** casten (`unitPolls`/`Skala4Frage` um `phase`-Bucket
   erweitern) — minimaler, ki26-konformer Aggregat-Zähler. Empfehlung: (b) für
   sinnvolle Klassen-Auswertung schon im Auftakt; mit Pietro kurz bestätigen.
5. Leerzustände & „wird vorbereitet"-Fallbacks aus `KlassenSpiegel` übernehmen.

**Akzeptanzkriterien.** Nach der Haltungs-Serie (Auftakt) **und** nach den
Befund-Post-Polls (Station) erscheint eine Auswertungsseite mit Ich/Klasse/Alle
pro Frage der Serie · Optik wie der Abschluss-`KlassenSpiegel` · nur anonyme
Aggregate gelesen, persönlicher Wert lokal · keine Doppel-Pflege (ein geteilter
`PollAuswertung`-Baustein).

---

### 9 · Punktesystem: Abschluss an ≥ 60 % gebunden, Faktencheck als Bonus (max +10 %)

**Befund/Ziel.**
- Eine **Subpage/Station gilt erst als abgeschlossen, wenn ≥ 60 %** der Punkte
  erreicht sind.
- **Faktencheck** zählt als **Bonus**: **nicht** Teil der 100 %, aber korrekte
  Fakten zählen mit **bis zu +10 %** des Stations-Totals oben drauf.
- **Gate = hart**, aber die Schülerin kann die **Station neu starten** (Pietros
  Entscheid) — kein Einzelfrage-Retry, sondern Stations-Reset.

**Ursache.** `StationV3.tsx` → `BadgeFrame` ruft `markStationAbgeschlossen`
**bedingungslos** beim Erreichen des Befunds. `stationStore.quizScore(stationId)`
liefert `{punkte, max, beantwortet}` (Basis = Verständnis- + Quiz-Recap-Fragen).
Faktencheck liegt separat im `FaktStore` (`recordFakt` mit `correct`), aktuell
**ungewertet**. Quiz bindet erste Antwort (`recordQuiz` idempotent) → ohne Reset
kommt man nach Fehlern nicht über 60 %.

**Dateien.** `stationStore.ts` (Score-/Reset-Helfer), `StationV3.tsx`
(`BadgeFrame`-Gate + UI, „Station neu starten"), evtl. `ZeitstrahlMenu.tsx`
(Status-Anzeige). Decision-Log.

**Umsetzung.**
1. **Score-Modell** (in `stationStore.ts` kapseln):
   - `basis = quizScore(stationId)` → `prozent = max>0 ? punkte/max : 0`.
   - `faktScore(stationId)` neu: zählt korrekte/Gesamt-Fakten der Station
     (über `FaktStore`-Keys `stationId:*`).
   - **Bonus** = `min(0.10, faktRichtig/faktGesamt * 0.10)` — also volle +10 %
     nur bei allen Fakten richtig; gedeckelt; **nicht** im 100 %-Nenner.
   - `stationErfuellt(stationId) = prozent >= 0.60` (nur Basis entscheidet über
     das Gate; Bonus verbessert nur die Anzeige/Gesamtpunkte).
2. **Hartes Gate** in `BadgeFrame`:
   - `markStationAbgeschlossen` **nur** aufrufen, wenn `stationErfuellt` true.
   - Wenn erfüllt: Badges + „Geschafft" + Punktestand inkl. Bonus anzeigen
     („Quiz: X von Y · Bonus Faktencheck: +Z %").
   - Wenn **nicht** erfüllt: klare Meldung *„Du hast P %. Für den Abschluss
     brauchst du mindestens 60 %."* + Button **„Station neu starten"**.
3. **Stations-Reset** (neuer Helfer `resetStation(stationId)` in `stationStore.ts`):
   entfernt für diese `stationId` die Einträge aus `quiz`, `fakt`, `poll`,
   `swipe`, `reflexion`, `abschluss` (nur diese Station, andere bleiben). Danach
   `StationV3` auf Frame 0 zurücksetzen (`setI(0)`) bzw. zurück ins Menü und
   Station neu öffnen. Bestätigungs-Dialog, damit nicht versehentlich gelöscht.
   *(Hinweis: Reset = Löschen lokaler Daten → in der UI klar kommunizieren; Pietros
   CLAUDE.md „nichts ohne Zustimmung löschen" betrifft Dateien, nicht
   localStorage-Lernfortschritt — der Reset ist eine bewusste Nutzeraktion.)*
4. **Begriffe.** „Subpage" wird laut #5 zu „Schritt"; im Gate-Text „Station"
   verwenden (das Gate gilt pro Station). Falls Pietro das Gate **pro Schritt**
   statt pro Station meint → kurz rückfragen; dieser Plan gateet pro **Station**
   (eine Station = eine abgeschlossene Lern-Einheit, passt zu
   `markStationAbgeschlossen`/Zertifikat-Schwelle).
5. **Zertifikat-Schwelle** (`ZERTIFIKAT_SCHWELLE = 3`) bleibt — zählt jetzt nur
   noch **erfüllte** (≥60 %) Stationen, da `markStationAbgeschlossen` gated ist.
   Im `ZeitstrahlMenu` „grün" = erfüllt; optional „begonnen, <60 %" visuell
   abgrenzen.

**Akzeptanzkriterien.** Station wird nur bei ≥ 60 % Basis-Punkten als
abgeschlossen markiert (grün/Zertifikat-zählend) · Faktencheck fliesst **nicht**
in die 100 % ein, hebt die Gesamtpunktzahl aber um max. +10 % · unter 60 %:
verständliche Meldung + funktionierender „Station neu starten" (setzt nur diese
Station zurück) · keine Endlos-Klick-Lücke (erste Antwort bindet weiterhin
innerhalb eines Durchlaufs).

---

## Empfohlene Reihenfolge

1. **Phase 0** (Restore + grüne Baseline). *Blockiert alles.*
2. **Schnelle, isolierte Text-/CSS-Fixes:** #5 (Subpage→Schritt), #6 (Zähler weg),
   #1 (Wording + Karten), #4 (Rahmen). Geringes Risiko, schnelle Wins.
3. **Interaktions-Feinschliff:** #2 (Animation + Timing), #3 (Faktencheck-Scroll).
4. **Logik/Datenfluss:** #9 (Punktesystem/Gate/Reset), #8 (Auswertung —
   `PollAuswertung`-Refactor).
5. **Querschnitt zuletzt:** #7 (Dark Mode) — berührt `gemeinsam`-Dateien, am Ende
   testen, wenn alle neuen UI-Teile existieren (Dark gleich mitprüfen).

## Owner / Absprache (CLAUDE.md-Regeln)

- #1–#6, #8, #9 liegen in `src/app/lernen/lernseite-1/**` → **Pietro** (kein
  Konflikt mit Christofs Lernseite 2).
- #7 (Dark Mode) berührt **gemeinsame** Dateien (`globals.css`, `layout.tsx`,
  `src/components/layout/**`, `tailwind.config.ts`) → **vor** Umsetzung mit
  **Christof absprechen**. Token-Swap betrifft Lernseite 2 automatisch mit.
- Session-Start: `git pull --rebase origin main`. Session-Ende: commit +
  `git pull --rebase` + `git push origin main`.

## CLAUDE.md-Updates (Teil von #7)

- **`D:\Dev\ki26\CLAUDE.md` → „Stil-Bibliothek"**: Dark Mode als verbindlichen
  Standard ergänzen — Farben **immer** über MD3-Tokens (nie Hardcodes), damit der
  `.dark`-Token-Swap automatisch greift; Toggle/Persistenz (`ki26-theme`,
  Default Light) dokumentieren.
- **`docs/decisions.md`** (jüngste oben): je ein Eintrag (Datum 2026-06-26) zu
  Dark Mode (Class-based, Light-Default, Token-Swap), Punktesystem (60 %-Hard-Gate
  + Faktencheck-Bonus ≤10 % + Stations-Reset), „Subpage→Schritt", Auto-Advance-
  Timing (850 ms) und Poll-Auswertungs-Seiten.
- **`~/.claude/CLAUDE.md`** (Pietros global): nur falls gewünscht — i.d.R. nicht
  nötig.

## Verifikation (Abschluss der neuen Session)

- `npm run build` + `npm run lint` grün.
- Manuelle Durchklick-Prüfung: Auftakt (Haltung-Auswertung), eine Station
  (Werte-Karten, Verständnis-Rahmen, Faktencheck-Scroll, Quiz, Befund-Auswertung,
  60 %-Gate + Reset), Abschluss, Zertifikat — je **Light und Dark**.
- Umlaut-/`ß`-Check über geänderte Strings (keine `ae/oe/ue`, kein `ß`).
- a11y: Fortschritt-`aria-label` vorhanden trotz entferntem Zähler;
  `prefers-reduced-motion` schaltet Animation aus; Toggle hat `aria-label`.
- Mobile-Check (gestapelte Layouts, sticky Nav stört nicht).
