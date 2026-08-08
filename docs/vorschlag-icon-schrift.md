# Vorschlag: Icon-Schrift — Wortblitzer und überstimmte Grössen

**Für Pietro, von Christof · 2026-08-08 · betrifft `src/app/layout.tsx` und
`src/app/globals.css` (gemeinsame Dateien, darum als Vorschlag)**

> **Stand 2026-08-08: Befund 1 ist erledigt** — auf Christofs Zuruf umgesetzt,
> `&display=swap` → `&display=block` bei der Material-Symbols-Zeile in
> `layout.tsx`. Nachgeprüft: Die Seite fordert `display=block`, Google liefert
> `font-display: block`, Inter bleibt auf `swap`, alle Icons rendern weiterhin
> als Glyphe (24 px breit, nicht als Wort).
>
> **Befund 2 ist offen** und braucht deinen Entscheid, weil er das Aussehen
> beider Lernseiten verändert.

Zwei Befunde an derselben Stelle. Beide sind an der Quelle nachgeprüft, nicht
vermutet — die Nachweise stehen jeweils dabei.

---

## Befund 1 — «arrow_back» blitzt kurz auf

**Symptom.** Beim Aufrufen einer Seite liest man für einen Moment das Wort
`arrow_back`, `arrow_forward` oder `data_object` anstelle des Symbols.
Besonders auf dem Handy im Mobilfunk, am Rechner kaum.

**Ursache.** Jedes Icon steht als Wort im DOM, und die Icon-Schrift macht daraus
per Ligatur das Symbol:

```tsx
<span className="material-symbols-outlined">arrow_back</span>
```

Am Schrift-Aufruf in [`src/app/layout.tsx`](../src/app/layout.tsx) Zeile 24
hängt `&display=swap`. Google gibt das unverändert in die `@font-face`-Regel
weiter — abgerufen am 2026-08-08:

```css
@font-face {
  font-family: 'Material Symbols Outlined';
  font-display: swap;          /* ← kommt von unserem &display=swap */
  src: url(https://fonts.gstatic.com/s/materialsymbolsoutlined/…woff2);
}
```

`swap` heisst: Text sofort in einer Ersatzschrift zeigen, später austauschen.
Bei einer Textschrift ist das genau richtig. Bei einer **Icon**-Schrift ist es
falsch, weil es keine sinnvolle Ersatzschrift gibt — der Browser zeigt brav den
Ersatz, und der Ersatz ist das nackte Wort.

**Behebung, eine Zeile.** In `layout.tsx` bei der Material-Symbols-Zeile
`&display=swap` → `&display=block`. Geprüft: Google liefert dann
`font-display: block`, der Browser hält die Stelle rund drei Sekunden leer statt
das Wort zu zeigen. Ein kurz fehlendes Icon ist deutlich weniger irritierend als
ein Wort, das wie ein Fehler aussieht.

Die Inter-Zeile darüber bleibt auf `swap` — dort ist es korrekt.

---

## Befund 2 — alle Icons sind 24 px, egal was im Code steht

**Symptom.** Im Code stehen 354 Icons mit eigener Grössenangabe
(`text-[16px]`, `text-[18px]`, `text-[20px]` …). **Keine davon wirkt.** Alle
367 Icons im Projekt rendern mit 24 px.

**Nachweis.** Im Browser gemessen, vierzehn Icons quer über die Seite:

| im Code | tatsächlich |
|---|---|
| `text-[20px]` (Navigation) | 24 px |
| `text-[18px]` (Fortschrittspunkte) | 24 px |
| `text-[16px]` (Pfeile) | 24 px |

**Ursache.** Googles Stylesheet liefert nicht nur die `@font-face`-Regel,
sondern auch eine **Hilfsklasse** mit — wörtlich aus der Antwort vom
2026-08-08:

```css
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-size: 24px;      /* ← überstimmt jede Tailwind-Grössenklasse */
  line-height: 1;
  …
}
```

Diese Regel steht in einem **fremden Stylesheet und in keiner Kaskadenschicht**.
Tailwinds Grössenklassen liegen in `@layer utilities`. Ungeschichtetes CSS
gewinnt gegen geschichtetes, unabhängig von der Reihenfolge — darum verliert
`text-[18px]` immer. Im Repo gibt es keine eigene Definition dieser Klasse; sie
kommt vollständig von Google.

Nebeneffekt derselben Regel: `line-height: 1`. Das hat in dieser Session schon
zweimal Text abgeschnitten (die Legende «FLÄCHEN» im Aktivitäts-Rhizom und die
Pille «frei lesbar» im Quellenverzeichnis), beides musste einzeln mit
`!leading-snug` geflickt werden.

**Warum ein einfacher Gegen-Eintrag in `globals.css` nicht reicht.** Ich habe
die naheliegenden Wege durchgedacht, sie führen alle in eine Sackgasse:

- Regel in `@layer base` → verliert gegen ungeschichtetes Google-CSS.
- Höhere Spezifität, z.B. `span.material-symbols-outlined { font-size: inherit }`
  → gewinnt gegen Google, **aber auch gegen Tailwind**; dann wirken die 354
  Grössenangaben erst recht nicht.
- `!important` an jede der 354 Stellen → kein Weg.

**Behebung: Schrift selbst ausliefern.** Mit `next/font/google` lädt Next.js die
Schriftdatei beim Bauen herunter und erzeugt eine eigene `@font-face`-Regel.
Googles Hilfsklasse kommt damit nie ins Projekt; wir definieren
`.material-symbols-outlined` in `globals.css` selbst — **ohne** `font-size` und
ohne `line-height`. Danach wirken die Tailwind-Klassen wie geschrieben, und
`display: 'block'` aus Befund 1 setzt man dort gleich mit. Ein Fremd-Abruf pro
Seitenaufruf fällt weg, was auf dem Handy zusätzlich hilft.

**Das ist eine sichtbare Änderung.** Alle Icons werden auf ihre gemeinten
Grössen schrumpfen, teils von 24 auf 16 px. Das ist die Absicht, heisst aber:
Es braucht einen Durchgang über beide Lernseiten, ob nichts zu klein wirkt.
Darum liegt es bei dir, nicht bei mir.

---

## Vorschlag zum Vorgehen

1. **Sofort und risikolos:** `&display=swap` → `&display=block` bei Material
   Symbols. Behebt Befund 1 allein, ändert sonst nichts.
2. **Wenn du Zeit für einen Sichtdurchgang hast:** Umstellung auf `next/font`,
   eigene Icon-Klasse ohne `font-size`/`line-height`. Behebt Befund 2, macht
   die beiden `!leading-snug`-Flicken überflüssig und erspart uns den nächsten.

Schritt 1 kann ich auf Zuruf machen, es ist eine Zeile. Schritt 2 würde ich
gerne mit dir zusammen ansehen, weil er das Aussehen beider Lernseiten
berührt.
