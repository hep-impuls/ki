import Link from "next/link";
import type { Metadata } from "next";
import DruckButton from "../_components/DruckButton";

/**
 * Schritt-für-Schritt-Anleitung für Lehrpersonen (Vorbild: 10mio
 * `anleitung-lehrperson.astro`). Reine Bedienung: Klasse registrieren, Code
 * teilen, Report öffnen.
 *
 * Bewusst an ki26 angepasst und nicht 1:1 übernommen:
 * - Der **Beitritts-Link** (`/start?class=CODE`) ersetzt das Abtippen des
 *   Codes — den gibt es in 10mio nicht.
 * - **Keine Pflichtmodule.** In ki26 sind die Lernsets auf freie Wahl angelegt;
 *   die Auswahl wird schülerseitig nicht durchgesetzt (siehe
 *   docs/decisions.md, 2026-07-27). Der Schritt entfällt darum hier.
 * - Der Klassencode lässt sich **jederzeit nachtragen** (Account-Menü), nicht
 *   nur beim ersten Start.
 */

export const metadata: Metadata = {
  title: "Anleitung für Lehrpersonen — Lernumgebung zu KI",
};

const INHALT = [
  { href: "#schritt-1", label: "1. Klasse registrieren" },
  { href: "#schritt-2", label: "2. Code mit der Klasse teilen" },
  { href: "#schritt-3", label: "3. Report öffnen" },
  { href: "#lernende", label: "Was Lernende selbst sehen" },
  { href: "#daten", label: "Welche Daten entstehen" },
  { href: "#faq", label: "Häufige Fragen" },
];

/** Nummerierter Schritt-Kopf. */
function SchrittKopf({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="mb-lg flex items-center gap-md">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-headline-sm text-on-primary">
        {n}
      </div>
      <h2 className="text-headline-lg text-on-surface">{children}</h2>
    </div>
  );
}

/** Farbig abgesetzter Hinweis-Kasten. */
function Hinweis({
  ton = "primary",
  titel,
  children,
}: {
  ton?: "primary" | "tertiary" | "error";
  titel?: string;
  children: React.ReactNode;
}) {
  const rahmen = {
    primary: "border-primary bg-primary/5",
    tertiary: "border-tertiary bg-tertiary/5",
    error: "border-error bg-error/5",
  }[ton];
  return (
    <div className={`rounded-r-xl border-l-4 p-md ${rahmen}`}>
      <p className="text-body-sm text-on-surface">
        {titel && <strong>{titel} </strong>}
        {children}
      </p>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="rounded-lg bg-surface-container px-xs py-0.5 text-body-sm text-primary"
      style={{ fontFamily: "ui-monospace, monospace" }}
    >
      {children}
    </code>
  );
}

function Frage({ frage, children }: { frage: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-xl border border-outline-variant bg-surface-bright p-md">
      <summary className="flex cursor-pointer items-center justify-between gap-md text-body-md font-semibold text-on-surface">
        {frage}
        <span className="material-symbols-outlined text-on-surface-variant transition-transform group-open:rotate-180">
          expand_more
        </span>
      </summary>
      <div className="mt-sm space-y-sm text-body-sm text-on-surface-variant">{children}</div>
    </details>
  );
}

export default function AnleitungLehrperson() {
  return (
    <main className="mx-auto max-w-3xl px-lg py-xl">
      <div className="flex items-center justify-between gap-md print:hidden">
        <Link
          href="/lehrperson"
          className="inline-flex items-center gap-xs text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Zum Lehrpersonen-Bereich
        </Link>
        <DruckButton />
      </div>

      <header className="mt-lg border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Lehrpersonen · Bedienung
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">
          Klasse einrichten in 3 Schritten
        </h1>
        <p className="mt-sm text-body-lg text-on-surface-variant">
          Von der Registrierung des Klassencodes bis zum ersten Report. Lesezeit:
          rund 5 Minuten.
        </p>
      </header>

      <nav className="mt-xl rounded-xl border border-outline-variant bg-surface-container-low p-lg print:hidden">
        <p className="text-label-md text-on-surface">Auf dieser Seite</p>
        <ol className="mt-sm space-y-xs text-body-sm">
          {INHALT.map((i) => (
            <li key={i.href}>
              <a href={i.href} className="text-primary hover:underline">
                {i.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ── Schritt 1 ────────────────────────────────────────────────── */}
      <section id="schritt-1" className="mt-xxl scroll-mt-lg">
        <SchrittKopf n={1}>Klasse registrieren</SchrittKopf>

        <p className="text-body-md text-on-surface">
          Gehen Sie auf{" "}
          <Link href="/lehrperson" className="font-semibold text-primary hover:underline">
            /lehrperson
          </Link>
          . Dort stehen zwei Karten: links der Report einer bestehenden Klasse,
          rechts «Neue Klasse». Klicken Sie rechts auf{" "}
          <strong>«Klasse anlegen»</strong>.
        </p>

        <h3 className="mt-xl text-headline-sm text-on-surface">Klassencode wählen</h3>
        <p className="mt-sm text-body-md text-on-surface">
          Wählen Sie einen Code, den Sie sich merken können und der Ihnen gehört —
          z.B. <Code>PiRo-FS-A26</Code> (Initialen, Fach, Semester). Erlaubt sind
          Buchstaben, Zahlen und Bindestriche. Gross-/Kleinschreibung spielt keine
          Rolle, der Code wird intern in Grossbuchstaben geführt.
        </p>
        <p className="mt-sm text-body-md text-on-surface">
          Der Code ist <strong>einmalig vergeben</strong>: Ist er schon belegt,
          erscheint «Dieser Code ist bereits vergeben». Distinktive Codes mit
          Initialen und Semester senken das Risiko praktisch auf null.
        </p>

        <h3 className="mt-xl text-headline-sm text-on-surface">Secret festlegen</h3>
        <p className="mt-sm text-body-md text-on-surface">
          Das Secret ist Ihr Passwort für diesen Code. Es schützt den Report vor
          Lernenden, die den Klassencode ohnehin kennen. Mindestens 4 Zeichen.
        </p>
        <div className="mt-md">
          <Hinweis ton="error" titel="Wichtig:">
            Das Secret liegt auf dem Server nur als Hash — niemand kann es im
            Klartext einsehen, und es lässt sich <strong>nicht</strong>{" "}
            zurücksetzen.
          </Hinweis>
        </div>

        <h3 className="mt-xl text-headline-sm text-on-surface">
          Mit oder ohne Sicherungsdatei?
        </h3>
        <ul className="mt-sm space-y-sm text-body-md text-on-surface">
          <li className="flex gap-sm">
            <span className="material-symbols-outlined flex-shrink-0 text-[20px] text-tertiary">
              lock
            </span>
            <span>
              <strong>Klasse registrieren</strong> — legt die Klasse an, sonst
              nichts.
            </span>
          </li>
          <li className="flex gap-sm">
            <span className="material-symbols-outlined flex-shrink-0 text-[20px] text-tertiary">
              download
            </span>
            <span>
              <strong>Registrieren &amp; Daten sichern</strong> — dasselbe, plus
              eine Textdatei <Code>klassencode-XYZ.txt</Code> mit Code, Secret und
              den beiden Links im Klartext.
            </span>
          </li>
        </ul>
        <div className="mt-md">
          <Hinweis ton="tertiary" titel="Empfehlung:">
            «Daten sichern» wählen und die Datei im Schul-Drive oder
            Passwort-Manager ablegen. Das Secret ist sonst nicht
            wiederherstellbar.
          </Hinweis>
        </div>
      </section>

      {/* ── Schritt 2 ────────────────────────────────────────────────── */}
      <section id="schritt-2" className="mt-xxl scroll-mt-lg">
        <SchrittKopf n={2}>Code mit der Klasse teilen</SchrittKopf>

        <p className="text-body-md text-on-surface">
          Erst <strong>nach</strong> der Registrierung geben Sie den Klassencode
          weiter. Das Secret behalten Sie für sich.
        </p>

        <p className="mt-md text-body-md text-on-surface">
          Direkt nach dem Anlegen zeigt die Seite einen <strong>fertigen
          Beitritts-Link</strong> in der Form <Code>…/start?class=IHR-CODE</Code>.
          Wer ihn öffnet, hat den Klassencode bereits eingetragen und muss nichts
          abtippen. Verteilen Sie ihn per Mail, Klassen-Tool oder QR-Code — das
          ist der zuverlässigste Weg.
        </p>

        <h3 className="mt-xl text-headline-sm text-on-surface">
          Was die Lernenden erleben
        </h3>
        <ol className="mt-sm space-y-sm text-body-md text-on-surface">
          <li className="flex gap-sm">
            <span className="text-label-md text-tertiary">1</span>
            <span>
              Sie bekommen einen persönlichen <strong>Fortschritts-Code</strong>{" "}
              in der Form <Code>QWEN-34R</Code> — ein LLM-Name plus zwei Ziffern
              und ein Buchstabe. Kein Login, keine E-Mail-Adresse, kein Name.
            </span>
          </li>
          <li className="flex gap-sm">
            <span className="text-label-md text-tertiary">2</span>
            <span>
              Der Klassencode ist bereits eingetragen (oder wird von Hand
              eingegeben) — dann geht es direkt in die Lernsets.
            </span>
          </li>
          <li className="flex gap-sm">
            <span className="text-label-md text-tertiary">3</span>
            <span>
              Dieser eine Code gilt für <strong>beide Lernsets</strong> und für
              jedes Gerät: wer ihn auf einem anderen Browser eingibt, bekommt
              seinen Fortschritt zurück.
            </span>
          </li>
        </ol>

        <div className="mt-md">
          <Hinweis titel="Nicht registrierte Codes:">
            Tippt jemand einen Klassencode ein, den es nicht gibt, erscheint «Code
            nicht gefunden — frag deine Lehrperson». Phantomklassen können also
            nicht entstehen.
          </Hinweis>
        </div>

        <h3 className="mt-xl text-headline-sm text-on-surface">
          Nachzügler und Vergessliche
        </h3>
        <p className="mt-sm text-body-md text-on-surface">
          Der Klassencode ist <strong>jederzeit nachtragbar</strong>: Lernende
          klicken oben rechts auf das <strong>Account-Symbol</strong>{" "}
          <span className="material-symbols-outlined align-middle text-[18px] text-on-surface-variant">
            account_circle
          </span>{" "}
          und tragen ihn dort ein. Der bisherige Fortschritt bleibt dabei
          vollständig erhalten. Dort steht auch der eigene Fortschritts-Code zum
          Notieren.
        </p>
      </section>

      {/* ── Schritt 3 ────────────────────────────────────────────────── */}
      <section id="schritt-3" className="mt-xxl scroll-mt-lg">
        <SchrittKopf n={3}>Report öffnen</SchrittKopf>

        <p className="text-body-md text-on-surface">
          Auf{" "}
          <Link href="/lehrperson" className="font-semibold text-primary hover:underline">
            /lehrperson
          </Link>{" "}
          die linke Karte «Bestehende Klasse» ausfüllen: Code + Secret →{" "}
          <strong>«Report öffnen»</strong>. Der Report ist nach den beiden
          Lernsets gegliedert.
        </p>

        <h3 className="mt-xl text-headline-sm text-on-surface">
          Lernset 1 — «Kann KI das?»
        </h3>
        <div className="mt-sm overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead>
              <tr className="border-b border-outline-variant text-label-sm uppercase tracking-wider text-on-surface-variant">
                <th className="py-sm pr-md">Bereich</th>
                <th className="py-sm">Was Sie sehen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-on-surface">
              <tr>
                <td className="py-sm pr-md font-medium">Fortschritt pro Schüler:in</td>
                <td className="py-sm">
                  Tabelle mit Fortschritts-Code, Prozent je Modul, Quiz-Punkten
                  und dem Datum der letzten Aktivität.
                </td>
              </tr>
              <tr>
                <td className="py-sm pr-md font-medium">Abstimmungen</td>
                <td className="py-sm">
                  Jede Umfrage aus dem Lernset im Vergleich — <strong>Ihre
                  Klasse</strong> gegen <strong>alle Klassen zusammen</strong>.
                  Der ideale Gesprächsanker fürs Plenum.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="mt-xl text-headline-sm text-on-surface">
          Lernset 2 — «Eine ganz neue Partnerschaft»
        </h3>
        <p className="mt-sm text-body-md text-on-surface">
          Hier gibt es keine Punkte, sondern Spuren: dieselbe Auswertung, die die
          Lernenden am Ende von sich selbst sehen, für die ganze Klasse und
          anonym aggregiert.
        </p>
        <ul className="mt-sm space-y-sm text-body-md text-on-surface">
          <li className="flex gap-sm">
            <span className="material-symbols-outlined flex-shrink-0 text-[20px] text-primary">
              query_stats
            </span>
            <span>
              <strong>Die Klasse in Zahlen</strong> — wie viele aktiv waren, wie
              viel angeschaut, vertieft und weiterverfolgt wurde.
            </span>
          </li>
          <li className="flex gap-sm">
            <span className="material-symbols-outlined flex-shrink-0 text-[20px] text-primary">
              hub
            </span>
            <span>
              <strong>Das Aktivitäts-Rhizom</strong> — sechs Triebe zeigen, wo
              die Klasse war und wie tief sie ging, im Hintergrund das Rhizom
              aller Teilnehmenden.
            </span>
          </li>
          <li className="flex gap-sm">
            <span className="material-symbols-outlined flex-shrink-0 text-[20px] text-primary">
              balance
            </span>
            <span>
              <strong>Achtsamkeit auf die Kontexte</strong> — wie Ihre Klasse die
              Aspekte gewichtet hat, neben dem Muster aller.
            </span>
          </li>
          <li className="flex gap-sm">
            <span className="material-symbols-outlined flex-shrink-0 text-[20px] text-primary">
              format_list_bulleted
            </span>
            <span>
              <strong>Konkrete Themen</strong> — was am meisten weiterverfolgt,
              vertieft und angeschaut wurde, mit echten Titeln. Dort hängen die
              Anschlussaufgaben.
            </span>
          </li>
          <li className="flex gap-sm">
            <span className="material-symbols-outlined flex-shrink-0 text-[20px] text-primary">
              auto_awesome
            </span>
            <span>
              <strong>KI-Einschätzung</strong> — auf Knopfdruck ein kurzer,
              didaktisch gefasster Text zum Klassen-Rhizom. Übergeben werden nur
              Aggregate, nichts wird gespeichert.
            </span>
          </li>
        </ul>

        <div className="mt-md">
          <Hinweis titel="Das Secret steht nie in der Adresszeile:">
            Code und Secret bleiben im Browser-Tab und verschwinden, sobald Sie
            ihn schliessen. Ein Lesezeichen auf{" "}
            <Code>/lehrperson/report</Code> ist deshalb gefahrlos — es fragt beim
            nächsten Mal einfach wieder nach den beiden Angaben. Das ist
            Absicht: Wer den Report am Beamer zeigt, soll nicht sein Secret an
            die Wand projizieren.
          </Hinweis>
        </div>
      </section>

      {/* ── Was Lernende sehen ───────────────────────────────────────── */}
      <section id="lernende" className="mt-xxl scroll-mt-lg">
        <h2 className="text-headline-lg text-on-surface">Was Lernende selbst sehen</h2>
        <p className="mt-sm text-body-md text-on-surface">
          Lernende Ihrer Klasse finden in der Seitenleiste den{" "}
          <strong>Klassenreport</strong>. Er zeigt ausschliesslich Aggregate:
        </p>
        <ul className="mt-sm space-y-xs text-body-md text-on-surface">
          <li className="flex gap-sm">
            <span className="material-symbols-outlined flex-shrink-0 text-[20px] text-primary">
              groups
            </span>
            Anzahl Lernende und Klassendurchschnitt
          </li>
          <li className="flex gap-sm">
            <span className="material-symbols-outlined flex-shrink-0 text-[20px] text-primary">
              bar_chart
            </span>
            Verteilung als Histogramm, mit der eigenen Position markiert
          </li>
          <li className="flex gap-sm">
            <span className="material-symbols-outlined flex-shrink-0 text-[20px] text-primary">
              menu_book
            </span>
            Pro Modul: Klassenschnitt gegen den eigenen Stand
          </li>
        </ul>
        <div className="mt-md">
          <Hinweis titel="Datenschutz:">
            Der Klassenreport erscheint erst ab <strong>fünf</strong> Lernenden in
            der Klasse und gibt niemals Codes preis — auch technisch versierte
            Lernende können nicht auf einzelne Personen schliessen.
          </Hinweis>
        </div>
      </section>

      {/* ── Daten ───────────────────────────────────────────────────── */}
      <section id="daten" className="mt-xxl scroll-mt-lg">
        <h2 className="text-headline-lg text-on-surface">Welche Daten entstehen</h2>
        <p className="mt-sm text-body-md text-on-surface">
          Die Lernumgebung kommt ohne Namen, E-Mail-Adressen und Konten aus. Der
          Fortschritts-Code ist ein Pseudonym: Wer ihn kennt, sieht diesen
          Fortschritt — mehr steckt nicht dahinter.
        </p>
        <div className="mt-md overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead>
              <tr className="border-b border-outline-variant text-label-sm uppercase tracking-wider text-on-surface-variant">
                <th className="py-sm pr-md">Bleibt auf dem Gerät</th>
                <th className="py-sm">Wird gespeichert</th>
              </tr>
            </thead>
            <tbody className="text-on-surface">
              <tr className="align-top">
                <td className="py-sm pr-md">
                  Freitexte, Reflexionen, Notizen, das eigene Profil, alle
                  Einzelantworten
                </td>
                <td className="py-sm">
                  Ein minimaler Fortschritts-Schnappschuss pro Modul (Prozent,
                  Quiz-Punkte), die Zugehörigkeit zum Klassencode sowie anonyme
                  Zähler: Abstimmungen, angeklickte Inhalte, geöffnete Themen und
                  gestartete Ausdrucke — jeweils ohne Code und ohne Zeitpunkt
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-md text-body-sm text-on-surface-variant">
          Die Klasse selbst wird bewertungsfrei geführt: keine Noten, keine
          richtigen Antworten bei den Haltungsfragen. Die Quiz-Punkte in Lernset 1
          dienen der Selbstkontrolle, nicht der Beurteilung.
        </p>
        <p className="mt-md text-body-sm text-on-surface-variant">
          Über alle Klassen hinweg gibt es zusätzlich eine Nutzungsübersicht für
          die Autoren des Lernsets: wie viele Codes es gibt, wie weit die Module
          im Mittel kommen, wann zuletzt gearbeitet wurde. Diese Übersicht zeigt
          Zahlen und Klassencodes, aber <strong>keine Fortschritts-Codes</strong>{" "}
          und keine Einzelwerte. In eine fremde Klasse hineinsehen kann damit
          niemand — dafür braucht es weiterhin deren Klassencode und Secret.
          Daneben sehen die Autoren, welche Inhalte wie oft angeklickt wurden,
          welche Themen geöffnet werden und wie oft ein Ausdruck gestartet wird.
          Das sind reine Summen über alle Nutzenden, damit sich das Lernmittel
          verbessern lässt: Ein Zähler steigt pro Gerät nur einmal, und weder
          Code noch Zeitpunkt gehören dazu.
        </p>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section id="faq" className="mt-xxl scroll-mt-lg">
        <h2 className="text-headline-lg text-on-surface">Häufige Fragen</h2>
        <div className="mt-lg space-y-md">
          <Frage frage="Muss ich den Klassencode zuerst registrieren?">
            <p>
              Ja. Auf <Link href="/lehrperson" className="text-primary hover:underline">/lehrperson</Link>{" "}
              → «Klasse anlegen» → Code + Secret → «Klasse registrieren». Erst
              danach den Code oder den Beitritts-Link teilen.
            </p>
          </Frage>

          <Frage frage="Was, wenn jemand anders «meinen» Code zuerst registriert hat?">
            <p>
              Sie bekommen die Meldung «Dieser Code ist bereits vergeben».
              Lösung: einen anderen Code wählen und der Klasse den neuen Link
              geben. Codes mit Initialen und Semester machen das praktisch
              unmöglich.
            </p>
          </Frage>

          <Frage frage="Können mehrere Lehrpersonen denselben Code verwenden?">
            <p>
              Ja, sofern alle dasselbe Secret kennen. Praktisch für Ko-Teaching:
              gemeinsamer Code, gemeinsames Secret, gleicher Report.
            </p>
          </Frage>

          <Frage frage="Ich habe mein Secret vergessen.">
            <p>
              Das Secret kann nicht wiederhergestellt werden — es existiert
              serverseitig nur als Hash. Vorgehen:
            </p>
            <ol className="list-decimal space-y-1 pl-lg">
              <li>
                Neue Klasse mit einem anderen Code registrieren, z.B. mit dem
                Zusatz <Code>-V2</Code>.
              </li>
              <li>Diesmal «Registrieren &amp; Daten sichern» wählen.</li>
              <li>
                Den neuen Beitritts-Link verteilen. Lernende tragen den neuen
                Klassencode im Account-Menü ein — ihr Fortschritt bleibt
                erhalten.
              </li>
            </ol>
          </Frage>

          <Frage frage="Eine Person hat ihren Fortschritts-Code verloren.">
            <p>
              Ohne Code gibt es keinen Weg zurück zum alten Stand — das ist der
              Preis dafür, dass niemand Namen hinterlegen muss. Die Person startet
              neu und tritt der Klasse wieder bei. Tipp für den Unterricht: den
              Code gleich zu Beginn in die Agenda oder ins Etui schreiben lassen.
            </p>
          </Frage>

          <Frage frage="Muss die Klasse beide Lernsets bearbeiten?">
            <p>
              Nein. Die beiden Lernsets sind unabhängig und in beliebiger
              Reihenfolge bearbeitbar; auch innerhalb der Lernsets wählen die
              Lernenden selbst. Der Report zeigt jeweils nur, was tatsächlich
              bearbeitet wurde.
            </p>
          </Frage>

          <Frage frage="Sehen Lernende den Fortschritt der anderen?">
            <p>
              Codes und Einzelwerte: nein. Klassen-Aggregate (Durchschnitt,
              Verteilung, Modulschnitt): ja, anonymisiert und erst ab fünf
              Lernenden.
            </p>
          </Frage>

          <Frage frage="Der Report bleibt leer, obwohl die Klasse gearbeitet hat.">
            <p>
              Häufigster Grund: Die Lernenden sind der Klasse nicht beigetreten —
              sie haben zwar einen Fortschritts-Code, aber keinen Klassencode
              eingetragen. Lassen Sie sie den Beitritts-Link öffnen oder den Code
              im Account-Menü nachtragen; der bisherige Fortschritt zählt dann
              mit.
            </p>
          </Frage>
        </div>
      </section>

      {/* ── Footer-CTA ──────────────────────────────────────────────── */}
      <div className="mt-xxl border-t border-outline-variant pt-xl print:hidden">
        <div className="flex flex-col gap-sm sm:flex-row sm:justify-center">
          <Link
            href="/lehrperson"
            className="inline-flex items-center justify-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:bg-on-primary-container"
          >
            <span className="material-symbols-outlined text-[18px]">school</span>
            Zum Lehrpersonen-Bereich
          </Link>
          <Link
            href="/lehrperson/leitfaden"
            className="inline-flex items-center justify-center gap-sm rounded-xl border border-outline-variant px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-dim"
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            Inhaltlicher Leitfaden
          </Link>
          <DruckButton label="Anleitung drucken" variante="umrandet" />
        </div>
      </div>
    </main>
  );
}
