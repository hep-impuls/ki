# Handoff: Account-Menü, Klassenbeitritt & Lehrpersonen-Anleitungen

> **Stand 2026-07-27 (Pietro).** Zwei zusammenhängende Arbeiten an derselben
> Naht: Wie kommen Lernende in eine Klasse, und wie findet sich eine Lehrperson
> zurecht? Commits `fa97527`, `9d019c8`, `ec4d7e5` auf `main`.
>
> Verwandte Dokumente: [handoff-firebase-ki26.md](handoff-firebase-ki26.md)
> (Datenmodell, API, Klassencode-Mechanik) · [decisions.md](decisions.md)
> (Einträge vom 2026-07-27).

## TL;DR

| Was | Wo | Status |
|---|---|---|
| Account-Menü oben rechts (Code sehen, Klasse beitreten) | `src/components/layout/AccountMenu.tsx` | neu |
| Sackgasse «Klasse beitreten» behoben | `SideNav.tsx`, `klassenreport/page.tsx` | gefixt |
| Bedienungsanleitung für Lehrpersonen | `/lehrperson/anleitung` | neu |
| Inhaltlicher Leitfaden für Lehrpersonen | `/lehrperson/leitfaden` | neu |
| Einstieg «Für Lehrpersonen» auf der Titelseite | `src/app/page.tsx` | neu |
| Pflichtmodule (`requiredModules`) | `/lehrperson/setup` | **bewusst ohne Wirkung** |

---

## 1 · Das Problem: Klassenbeitritt war eine Sackgasse

Der Klassencode ist im Onboarding (`/start`) optional und überspringbar — das
ist richtig so, denn die Lernsets funktionieren auch ohne Klasse. Er war aber
**nicht nachholbar**:

- `/start` leitet bei bestehender Session sofort auf die Lernseite weiter
  (`src/app/start/page.tsx`, `useEffect` ganz oben). Das ist gewollt: Wer schon
  einen Code hat, soll nicht nochmals durchs Onboarding.
- Der SideNav-Eintrag «Klasse beitreten» verlinkte genau dorthin — und wurde
  darum sofort zurückgeworfen.
- Derselbe Fehler steckte im CTA des Klassenreports («Klassencode eingeben»).

Einziger funktionierender Weg in eine Klasse war der Lehrpersonen-Link
`/start?class=CODE`, weil `/start` diesen Parameter gesondert behandelt und die
Klasse rückwirkend verknüpft.

## 2 · Die Lösung: Account-Menü in der TopAppBar

`src/components/layout/AccountMenu.tsx` — Knopf mit `account_circle` rechts in
der TopAppBar, neben dem hep-Logo. Ein Panel, keine eigene Seite: Der Beitritt
soll den Lernfluss nicht unterbrechen.

**Inhalt des Panels**

1. **Fortschritts-Code** mit Kopieren-Knopf, plus dem Hinweis, dass er auf jedem
   Gerät zurückführt. Ohne Session stattdessen ein Link auf `/start`.
2. **Klasse** — zwei Zustände:
   - *ohne Klasse:* Eingabefeld + «Beitreten». Ablauf: `classExists(code)` →
     bei `false` die Meldung «Code nicht gefunden — frag deine Lehrperson»; bei
     `true` `linkTeacherCode(studentCode, code)` + `saveSession(...)`.
   - *mit Klasse:* «Du bist in der Klasse X» + Link auf `/klassenreport`.

Der Fortschritt wird dabei **nicht angefasst** — es kommt nur `teacherCode` zum
Schüler-Doc dazu (`students/{code}`, merge).

### Zwei Custom-Events

Damit andere Komponenten mitspielen, ohne dass Zustand hochgezogen werden muss:

```ts
export const ACCOUNT_OPEN_EVENT = "ki26-account-open";      // Panel öffnen
export const SESSION_CHANGED_EVENT = "ki26-session-changed"; // nach Beitritt
```

- **`ACCOUNT_OPEN_EVENT`** — wer den Beitritt anbieten will, verlinkt *nicht*
  auf `/start`, sondern feuert dieses Event:
  ```ts
  window.dispatchEvent(new Event(ACCOUNT_OPEN_EVENT));
  ```
  Genutzt von `SideNav.tsx` (Eintrag «Klasse beitreten») und
  `klassenreport/page.tsx` (Leerzustand «no-class»).
- **`SESSION_CHANGED_EVENT`** — wird nach erfolgreichem Beitritt gefeuert.
  `SideNav` hört darauf und wechselt live von «Klasse beitreten» auf
  «Klassenreport», ohne Reload und ohne Navigation.

> **Regel für neue Seiten:** Nie mehr auf `/start` verlinken, um einen
> Klassenbeitritt anzubieten. Immer `ACCOUNT_OPEN_EVENT`. `/start` ist
> ausschliesslich der Erstkontakt (keine Session) oder der Lehrpersonen-Link
> mit `?class=`.

### Layout-Detail

Das Panel ist auf Mobil `fixed left-md right-md top-[4.5rem]` (volle Breite
minus Rand), ab `sm` ein normales `absolute right-0`-Dropdown unter dem Knopf.
Grund: Der Account-Knopf sitzt nicht am rechten Bildrand (Hilfe-Knopf daneben) —
ein rechtsbündiges 22rem-Panel lief auf 375 px um 32 px links aus dem Bild.

### Geteilte Dateien

`TopAppBar.tsx` und `SideNav.tsx` sind laut [CLAUDE.md](../CLAUDE.md)
gemeinsame Dateien. Die Änderungen sind klein und additiv (ein Import + eine
Komponente in der Kopfzeile; im SideNav wird aus einem `<Link>` ein `<button>`),
aber Christof sollte davon wissen.

---

## 3 · Lehrpersonen-Anleitungen

Portiert aus dem `10mio`-Repo (`src/pages/anleitung-lehrperson.astro` und
`einheit-uebersicht-lehrperson.astro`), inhaltlich an ki26 angepasst.

### `/lehrperson/anleitung` — Bedienung

`src/app/lehrperson/anleitung/page.tsx`. «Klasse einrichten in 3 Schritten»:

1. Klasse registrieren (Codewahl, Secret, Sicherungsdatei)
2. Code mit der Klasse teilen (Beitritts-Link, was Lernende erleben, Nachzügler)
3. Report öffnen (Lernset 1 und Lernset 2 getrennt erklärt)

Dazu: «Was Lernende selbst sehen» (Klassenreport, k ≥ 5) · «Welche Daten
entstehen» (lokal vs. gespeichert) · acht FAQ-Einträge.

### `/lehrperson/leitfaden` — Didaktik

`src/app/lehrperson/leitfaden/page.tsx`. «In 30 Sekunden» · der Bogen beider
Lernsets · **die 7 Stationen von Lernset 1 mit je einem Plenum-Anker** · die
drei Themen von Lernset 2 · drei Unterrichts-Szenarien · was im Report ankommt ·
Beutelsbacher Konsens.

### Verlinkung

- `/lehrperson` — zwei Einstiegskarten zuoberst, immer sichtbar
- Titelseite (`src/app/page.tsx`) — «Für Lehrpersonen» in der Kopfzeile **und**
  als zweiter Knopf im Hero (die Kopfzeilen-Navigation ist auf dem Handy
  ausgeblendet)
- Die beiden Anleitungen verlinken gegenseitig aufeinander
- `_components/DruckButton.tsx` — kleine Client-Komponente, damit die
  Anleitungs-Seiten selbst statische Server-Komponenten bleiben. Navigation und
  CTAs tragen `print:hidden`.

### Was bewusst abweicht

| 10mio | ki26 | Warum |
|---|---|---|
| Schritt 3: Pflichtmodule als Gate | entfällt (3 statt 4 Schritte) | in ki26 nicht durchgesetzt, siehe §4 |
| Code von Hand abtippen | Beitritts-Link `/start?class=CODE` | gibt es in 10mio nicht |
| Klassencode im Profilmenü | Account-Menü, jederzeit nachtragbar | siehe §2 |
| CSV-/xlsx-Export, Namensliste | nicht erwähnt | gibt es im ki26-Report nicht |

### Wartung

Die Stationsfragen, Tags und Sonnen-/Schattenseiten im Leitfaden sind aus
`src/app/lernen/lernseite-1/_data/stationenV3.ts` übernommen — sie stehen im
Leitfaden als **Kopie**, nicht als Import (der Leitfaden erzählt sie anders
zugespitzt, als der Lernset-Code sie braucht). **Wenn dort Stationen dazukommen
oder umformuliert werden, muss das Array `STATIONEN` in
`leitfaden/page.tsx` mitziehen.** Die Themen von Lernset 2 kommen dagegen live
aus `src/config/unit.ts` und pflegen sich selbst.

Die **Plenum-Anker** (eine Diskussionsfrage je Station) sind neu geschrieben und
haben keine Entsprechung im Lernset — sie sind die didaktische Zutat des
Leitfadens.

---

## 4 · Pflichtmodule: vorhanden, aber ohne Wirkung

Entscheid vom 2026-07-27 (Pietro): **kein Pflichtmodul-Gate.** Die Lernsets sind
auf freie Wahl angelegt.

Der Stand im Code:

- `/lehrperson/setup` funktioniert und schreibt `requiredModules` nach
  `teachers/{classCode}`.
- `/api/student/class-prefs` und `loadStudentClassPrefs()` (`src/lib/api.ts`)
  existieren, **haben aber keinen einzigen Aufrufer**. Schülerseitig passiert
  also nichts: keine Nav-Filterung, kein Redirect.
- Die Anleitungen dokumentieren den Schritt darum gar nicht.

> **Offen:** `/lehrperson` bietet nach der Registrierung weiterhin den Knopf
> «Pflichtmodule wählen» an. Der führt auf eine funktionierende Auswahlseite,
> deren Ergebnis nichts bewirkt — eine Lehrperson kann das für ein Feature
> halten. Entweder den Knopf entfernen (Seite bliebe per URL erreichbar) oder
> das Gate doch bauen. Bis dahin ist das die einzige bekannte Inkonsistenz im
> Lehrpersonen-Bereich.

---

## 5 · Verifikation

Alles im laufenden Dev-Server geprüft (`npm run dev`, Browser-Pane), Konsole
fehlerfrei, `npx tsc --noEmit` sauber:

- Account-Knopf sichtbar, Panel zeigt den Fortschritts-Code
- SideNav «Klasse beitreten» und Klassenreport-CTA öffnen das Panel
- Unbekannter Klassencode → API antwortet 200, Fehlermeldung erscheint
- Beitritt → `teacherCode` in der Session, Panel und SideNav wechseln live
- Titelseite → `/lehrperson` → beide Anleitungen rendern vollständig
- 375 px: kein horizontaler Überlauf; Desktop: Dropdown bündig unter dem Knopf

> **Hinweis:** `npm run lint` ist im Repo defekt — `next lint` interpretiert
> «lint» als Projektverzeichnis (Next 16 hat den Befehl entfernt). Als Ersatz
> `npx tsc --noEmit` verwenden. Die dabei gemeldeten Fehler aus `.next/types/`
> sind stale und verschwinden nach `rm -rf .next`.
