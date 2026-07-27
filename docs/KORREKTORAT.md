# Korrektorat-Workflow (ki26)

Dokumentation des Korrektorat-Editors **für Pietro** — Architektur, Ablauf einer
Runde, Wartung, Fehlersuche. Die Korrekturperson bekommt
[`docs/anleitung-korrektor.md`](anleitung-korrektor.md).

Vorbild ist das Korrektorat des `10mio`-Repos. Zwei Dinge sind hier anders, und
beide folgen aus der Technik von ki26:

| | 10mio | ki26 |
|---|---|---|
| Hosting | eigenes Cloudflare-Pages-Projekt | **in die Next.js-App integriert** (`/korrektorat`, Vercel) |
| Inhalte | MDX mit Komponenten-Whitelist | **TSX/TS** — Daten-Objekte, Inhalts-Arrays, JSX-Text |
| Parser | `mdast-util-mdx` | **TypeScript-Compiler** (Node-Runtime, kein Bundle-Limit) |

Das erspart ein zweites Hosting, ein zweites Deployment und ein zweites Token:
alles läuft über die bestehende Vercel-Umgebung.

## Was ist das?

Ein Editor, mit dem eine externe Korrekturperson **alle Texte der beiden
Lernseiten** korrigiert — ohne Repo-Zugriff, ohne TypeScript-Kenntnisse. Sie
sieht ein Formular pro Textstelle (**3106 Stellen, ~358'000 Zeichen** über 59
Dateien), korrigiert den Wortlaut, klickt Speichern. Jede Speicherung wird ein
Commit auf einem Korrektorat-Branch; daraus wächst **ein** Pull Request pro
Runde.

URL: `https://hep-ki.vercel.app/korrektorat` (nirgends verlinkt, `noindex`).

**Wichtigste Eigenschaft:** Die Korrekturperson meldet sich am **Editor** an
(Passcode), nicht an GitHub. Das Repo-Token liegt ausschliesslich serverseitig in
den Vercel-Umgebungsvariablen. Das Repo bleibt privat, sie wird nie Collaborator.

## Architektur

```
              ┌───────────────────────────────┐
              │  Korrekturperson · Browser    │
              └──────────────┬────────────────┘
                             │ Cookie-Anmeldung (Passcode)
                             ▼
   ┌──────────────────────────────────────────────────────────┐
   │  Next.js-App auf Vercel (dasselbe Deployment wie das     │
   │  Lernset — kein zweites Hosting)                         │
   │                                                          │
   │  /korrektorat                    Client-Oberfläche       │
   │    Anmelden · Übersicht · Feld-Editor                    │
   │    Entwürfe in localStorage                              │
   │                                                          │
   │  /api/korrektorat/*              Route Handlers (nodejs) │
   │    GITHUB-Token nur hier                                 │
   │    me · auth · logout · dateien · datei · suche ·        │
   │    speichern                                             │
   │                                                          │
   │  src/lib/korrektorat/                                    │
   │    parser.mjs    extract() / apply() über TS-AST         │
   │    policy.mjs    was ist Text, was ist Technik           │
   │    inventar.mjs  welche Dateien, welche Titel            │
   └──────────────────────────┬───────────────────────────────┘
                              │ GitHub REST API
                              ▼
   ┌──────────────────────────────────────────────────────────┐
   │  GitHub (hep-impuls/ki)                                  │
   │    main                    ← Produktionsquelle           │
   │    korrektorat/runde-N     ← Korrekturrunde N            │
   │       └── ein PR auf main                                │
   └──────────────────────────────────────────────────────────┘
```

## Bestandteile

| Bestandteil | Pfad | Aufgabe |
|---|---|---|
| Parser | [`src/lib/korrektorat/parser.mjs`](../src/lib/korrektorat/parser.mjs) | `extract()` zerlegt TSX/TS in Felder mit Offsets; `apply()` schreibt zurück; `pruefeEdits()` prüft Positionen |
| Regelwerk | [`src/lib/korrektorat/policy.mjs`](../src/lib/korrektorat/policy.mjs) | Skip-/Allow-Listen, Beschriftungen, Abschnittsnamen — **hier** wird erweitert, nicht im Parser |
| Inventar | [`src/lib/korrektorat/inventar.mjs`](../src/lib/korrektorat/inventar.mjs) | Umfang, Ausschlüsse (toter Code!), Gruppen, Dateititel |
| Quelle | [`src/lib/korrektorat/quelle.ts`](../src/lib/korrektorat/quelle.ts) | GitHub oder Arbeitsverzeichnis, gleiche Schnittstelle |
| Serverklammer | [`src/lib/korrektorat/server.ts`](../src/lib/korrektorat/server.ts) | Konfiguration, Anmelde-Schranke, Aufbau der Übersicht (mit Cache) |
| Anmeldung | [`src/lib/korrektorat/session.ts`](../src/lib/korrektorat/session.ts) | HMAC-signiertes Cookie, 7 Tage |
| GitHub-Client | [`src/lib/korrektorat/github.ts`](../src/lib/korrektorat/github.ts) | Minimal-REST, kein Octokit |
| Routen | [`src/app/api/korrektorat/`](../src/app/api/korrektorat/) | 7 Handler, alle `runtime = "nodejs"` |
| Oberfläche | [`src/app/korrektorat/`](../src/app/korrektorat/) | eigenes Layout (kein `AppLayout`, kein `SessionGate`) |
| Rundlauf-Prüfung | [`scripts/korrektorat/roundtrip-test.mjs`](../scripts/korrektorat/roundtrip-test.mjs) | Identität, Syntax nach Änderung, Wiederfinden — über alle Dateien |
| Speicher-Prüfung | [`scripts/korrektorat/speichern-test.mjs`](../scripts/korrektorat/speichern-test.mjs) | die Schranken von `pruefeEdits()` |
| Wartungsbericht | [`scripts/korrektorat/inventar.mjs`](../scripts/korrektorat/inventar.mjs) | Inventar gegen Import-Graph, Feldzahlen je Datei |
| Anleitung | [`docs/anleitung-korrektor.md`](anleitung-korrektor.md) | die Datei, die du der Korrekturperson schickst |

## Einrichtung (einmalig)

### 1. GitHub Fine-grained PAT

1. <https://github.com/settings/personal-access-tokens/new>
2. **Resource owner:** `hep-impuls`
3. **Repository access** → *Only select repositories* → `hep-impuls/ki`
4. **Permissions:** *Contents* → **Read and write**, *Pull requests* → **Read and
   write** (Metadata read-only kommt automatisch)
5. **Expiration:** max. 1 Jahr → **Termin in den Kalender**, es gibt kein
   Auto-Renew.

### 2. Umgebungsvariablen in Vercel

Project Settings → Environment Variables (Production **und** Preview):

| Variable | Wert |
|---|---|
| `KORREKTORAT_PASSCODE` | Passwort für die Korrekturperson |
| `KORREKTORAT_SESSION_SECRET` | 32 zufällige Bytes hex (s.u.) |
| `KORREKTORAT_GITHUB_TOKEN` | der PAT aus Schritt 1 |
| `KORREKTORAT_BRANCH` | `korrektorat/runde-1` — pro Runde hochzählen |

Optional, mit diesen Vorgaben: `KORREKTORAT_REPO=hep-impuls/ki`,
`KORREKTORAT_BASIS_BRANCH=main`.

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Nach dem Setzen **neu deployen** — Umgebungsvariablen greifen erst im nächsten
Build.

### 3. Lokal prüfen, ohne Token

```bash
# in .env.local:
#   KORREKTORAT_QUELLE=lokal
#   KORREKTORAT_PASSCODE=…
#   KORREKTORAT_SESSION_SECRET=…
npm run dev     # → http://localhost:3000/korrektorat
```

Der Editor liest dann das Arbeitsverzeichnis statt GitHub: Übersicht,
Abschnitte, Felder, Suche — alles klickbar, **Speichern ist gesperrt**. Gut, um
nach inhaltlichen Änderungen zu sehen, was die Korrekturperson zu sehen bekommt.

## Ablauf einer Korrekturrunde

### Vorher

1. **Prüfungen laufen lassen** — muss grün sein:
   ```bash
   npm run korrektorat:test
   ```
2. **Inventar prüfen** — meldet toten Code, der sichtbar wäre, und Dateien ohne
   gepflegten Titel:
   ```bash
   npm run korrektorat:inventar
   ```
3. **`main` ist aktuell.** Was redaktionell gefixt werden soll, gehört vor
   Rundenstart auf `main`. Was danach gepusht wird, kann bei der Korrekturperson
   «Quelle hat sich geändert» auslösen (siehe Fehlersuche).
4. **`KORREKTORAT_BRANCH` zeigt auf einen Namen, den es noch nicht gibt** —
   z.B. `korrektorat/runde-2`, wenn Runde 1 gemerged ist.
5. **Selbst durchklicken:** anmelden, eine Mini-Korrektur in einer Datei,
   speichern, PR auf GitHub prüfen. Danach Test-PR schliessen und Branch
   löschen, damit die Runde sauber beginnt.
6. **Korrekturperson benachrichtigen** mit URL, Passcode (sicherer Kanal) und
   [`docs/anleitung-korrektor.md`](anleitung-korrektor.md).

### Während

- Beliebig oft speichern. Jede Speicherung = ein Commit auf
  `KORREKTORAT_BRANCH`; **ein** PR pro Runde, der mitwächst.
- **Nicht in den Branch hineincommitten** — der gehört der Korrekturperson.
  Eigene Korrekturen als separater PR auf `main`.
- Zwischenstand im PR anschauen ist in Ordnung. Inline-Kommentare sieht die
  Korrekturperson nicht — die kommen per Mail.

### Nachher

1. PR im *Files changed*-Tab durchgehen, bei Bedarf direkt im PR nachfassen.
2. Merge in `main`, **Branch löschen**. Wichtig: solange ein Branch mit dem Namen
   aus `KORREKTORAT_BRANCH` existiert, liest der Editor von dort statt von `main`.
3. `KORREKTORAT_BRANCH` in Vercel hochzählen (`runde-2` → `runde-3`).
4. **Wenn die Zusammenarbeit endet:** `KORREKTORAT_PASSCODE` ändern und den PAT
   auf GitHub löschen.

## Was der Editor kann und nicht kann

### Kann

- Wortlaut in 3106 Textstellen: Datenfelder (`titel`, `text`, `geschichte`,
  `mehr`, `lead` …), String-Arrays (`lernziele`, `absaetze`), JSX-Attribute
  (`titel=`, `text=` von `<GlossarText>`, `aria-label=`) und Text zwischen Tags.
- Pro Feld: Änderung verwerfen, und wo in dieser Runde schon geändert wurde,
  «Ursprung wiederherstellen» (Wortlaut auf `main`).
- Entwürfe in `localStorage` je Datei — Tab schliessen kostet nichts.
- **Volltextsuche über alle 3106 Textstellen** beider Lernseiten, mit
  Direktsprung auf das gefundene Feld — der übliche Weg zur Fehlerstelle, wenn
  die Korrekturperson im Lernset etwas sieht und nicht weiss, in welcher Datei
  es steht. Optional nur ganze Wörter. Innerhalb einer Datei zusätzlich Suche
  und Filter «nur Geänderte».
- Positions-Prüfung: veraltete Änderungen werden abgelehnt, nicht falsch
  geschrieben.

### Kann nicht (so gewollt)

- **Struktur ändern:** keine neue Antwortoption, keine neue Station, keine
  Umordnung. Wenn die Korrekturperson so etwas vorschlägt, machst du es selbst.
- **Technische Werte ändern:** IDs, Slugs, URLs, Bildpfade, Ikonennamen,
  Tailwind-Klassen, Abstimmungs-Kennungen, das `anker`-Feld der Belege, Datumsangaben
  in `geprueft`.
- **Geschweifte Klammern in Fliesstext** — `{` und `}` sind dort JSX-Syntax. Der
  Editor weist das mit einer Meldung ab (`&` `<` `>` werden automatisch maskiert).
- **Zwei Korrektor:innen gleichzeitig in einer Datei.** Der zweite Speichervorgang
  bekommt «Quelle hat sich geändert».

## Wie der Parser entscheidet

Der Parser kennt keine einzelne Komponente. Er folgt den Listen in
[`policy.mjs`](../src/lib/korrektorat/policy.mjs) — und zwar mit zwei
verschiedenen Richtungen, je nachdem, wo der Text steht:

| Ort im Code | Regel | Liste |
|---|---|---|
| Objekt-Schlüssel (`titel: "…"`) | **Blocklist** — alles ist Text, ausser technischen Schlüsseln | `SKIP_KEYS` |
| JSX-Attribut mit Zeichenkette (`titel="…"`) | **Allowlist** — nur benannte Attribute | `JSX_TEXT_ATTRS` |
| JSX-Attribut mit Ausdruck (`eintraege={[…]}`) | Blocklist, dann wie Objekt | `SKIP_KEYS` |
| Text zwischen Tags | immer Text, ausser er sieht technisch aus | `istTechnisch()` |

Zweite Verteidigungslinie ist `istTechnisch()`: Kennungen ohne Leerzeichen,
URLs und Pfade, Tailwind-Klassenketten, reine Zahlen, ISO-Daten und Farbwerte
fallen heraus, auch wenn niemand den Schlüssel auf eine Liste gesetzt hat.
Grundhaltung: **im Zweifel nicht anzeigen.**

Wenn eine **neue Komponente** dazukommt:

1. Trägt sie Text in einem JSX-Attribut? → Attributnamen in `JSX_TEXT_ATTRS`.
2. Trägt sie technische Props in Objekten? → Schlüssel in `SKIP_KEYS`.
3. Ist der Text längere Prosa? → Schlüssel in `MARKDOWN_KEYS` (grösseres Feld).
4. Soll ihr Datenblock eine sprechende Überschrift haben? → in `CONST_SECTIONS`.
5. Danach immer:
   ```bash
   npm run korrektorat:test
   ```

### Toter Code

Lernseite 1 lief bis M7 über einen v2-Flow (`KiEinheit`, `Auftakt`, `Abschluss`,
`Station`, `Maschinenraum`, `PollDeck`, `wissenChecks.ts` …), der im Repo
geblieben, aber nirgends mehr eingebunden ist. Er ist in
[`inventar.mjs`](../src/lib/korrektorat/inventar.mjs) ausgeschlossen — sonst
korrigierte die Korrekturperson Texte, die niemand liest. `npm run
korrektorat:inventar` baut den Import-Graphen ab den echten `page.tsx` neu auf
und meldet Abweichungen. **Nach Struktur-Umbauten laufen lassen.**

Drei Dateien sind bewusst sichtbar, aber als «noch nicht eingebunden» markiert
(`UNVERDRAHTET`) — allen voran
`philosophische-perspektive/_components/SchablonenZeitstrahl.tsx` mit 283
Textstellen. Der Hinweis erscheint im Editor, damit die Korrekturperson weiss,
dass diese Texte aktuell niemand zu sehen bekommt.

## Fehlersuche

### «Editor zeigt veraltete Inhalte»

Ein Branch mit dem Namen aus `KORREKTORAT_BRANCH` existiert noch mit altem
Stand. Der Editor liest bewusst von dort, damit die Korrekturperson ihre
gesammelte Arbeit sieht. **Lösung:** alten Branch löschen oder
`KORREKTORAT_BRANCH` auf einen neuen Namen setzen und neu deployen.

### «Quelle hat sich geändert — Seite neu laden»

Die Datei hat sich geändert, seit die Korrekturperson sie geöffnet hat (du hast
auf `main` gepusht, oder der Branch ist weitergewandert). Die mitgeschickten
Positionen passen nicht mehr, und das Feld wird abgelehnt statt an die falsche
Stelle geschrieben. Der Editor lädt nach dem Speichern automatisch neu; verloren
sind nur die **noch nicht gespeicherten** Änderungen der betroffenen Felder.
Vermeiden: während einer laufenden Runde nicht am Inhalt arbeiten.

### Übersicht oder Suche braucht lange

Beide stützen sich auf denselben Index: Der erste Abruf nach jedem Repo-Stand
holt alle 59 Dateien und parst sie (~3–5 s). Danach kommt alles aus dem
Prozess-Cache, dessen Schlüssel aus allen Blob-SHAs gebildet ist — veraltete
Zahlen und veraltete Treffer sind damit ausgeschlossen. Nach einem Deployment
oder einem Kaltstart ist der erste Abruf wieder langsam, der zweite nicht mehr.

### 503 «Nicht konfiguriert»

Eine der drei Pflichtvariablen fehlt in der Umgebung, in der du gerade bist
(Production *oder* Preview) — die Anmeldemaske sagt, welche. Nach dem Nachtragen
neu deployen.

### Anmeldung schlägt fehl / Sitzung läuft dauernd ab

`KORREKTORAT_SESSION_SECRET` unterscheidet sich zwischen Production und Preview
oder wurde geändert; bestehende Cookies gelten dann nicht mehr. Einmal neu
anmelden genügt.

## Sicherheit

- ✅ GitHub-Token nur serverseitig, nie im Browser.
- ✅ Passcode wird über SHA-256-Digest in konstanter Zeit verglichen.
- ✅ Cookie ist HMAC-signiert, `HttpOnly`, `Secure`, `SameSite=Lax`, 7 Tage.
- ✅ Lese- **und** Schreibroute prüfen jeden Pfad gegen `istInhaltsDatei()` —
  ohne diese Schranke wäre die Route ein Leseloch ins ganze Repo.
- ✅ Vom Client kommt nur der Wortlaut. Positionen, Literal-Art und Maskierung
  bestimmt der Server aus seinem eigenen, frischen Parse.
- ✅ `/korrektorat` ist `noindex, nofollow` und nirgends verlinkt.
- ⚠️ Der PAT muss spätestens nach einem Jahr rotiert werden.
- ⚠️ `KORREKTORAT_PASSCODE` ist ein einziges geteiltes Geheimnis — bei mehreren
  Korrektor:innen rotieren.

## Verwandte Dokumente

- [`docs/anleitung-korrektor.md`](anleitung-korrektor.md) — Anleitung zum Verschicken
- [`docs/inhalte-lernseite-2.md`](inhalte-lernseite-2.md) — reine Lesefassung von
  Lernseite 2 (`node docs/inhalte-export.js`), Näherung per Regex, **nur lesen**
- [`CLAUDE.md`](../CLAUDE.md) — Projektregeln, u.a. echte Umlaute und `ss` statt `ß`
