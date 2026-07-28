import Link from "next/link";
import type { Metadata } from "next";
import { unit } from "@/config/unit";
import DruckButton from "../_components/DruckButton";

/**
 * Inhaltlicher Leitfaden für Lehrpersonen (Vorbild: 10mio
 * `einheit-uebersicht-lehrperson.astro`): der didaktische Bogen, die Themen
 * mit je einem Plenum-Anker, Unterrichts-Szenarien, was im Report ankommt.
 *
 * Die Themen-Fragen und die Lernziele stammen aus der kanonischen
 * Inhaltsdefinition (`lernseite-1/_data/stationenV3.ts`); die Plenum-Anker sind
 * die didaktische Zutat dieses Leitfadens. Wenn dort Themen dazukommen oder
 * umformuliert werden, hier mitziehen.
 */

export const metadata: Metadata = {
  title: "Inhaltlicher Leitfaden für Lehrpersonen — Lernumgebung zu KI",
};

const INHALT = [
  { href: "#bogen", label: "Der Bogen der beiden Lernsets" },
  { href: "#lernset-1", label: "Lernset 1 — die 7 Themen mit Plenum-Anker" },
  { href: "#lernset-2", label: "Lernset 2 — die drei Themen" },
  { href: "#szenarien", label: "Drei Unterrichts-Szenarien" },
  { href: "#report", label: "Was im Report ankommt" },
  { href: "#haltung", label: "Kontroverse statt Konsens" },
];

interface Thema {
  /** Thematischer Kurzname — identisch mit `kurzname` in `stationenV3.ts`. */
  kurz: string;
  frage: string;
  tags: string[];
  sonne: string;
  schatten: string;
  anker: string;
}

/** Die 7 Themen von Lernset 1 — Kurznamen, Fragen und Tags wie in `stationenV3.ts`. */
const STATIONEN: Thema[] = [
  {
    kurz: "Arbeit",
    frage: "Verändert KI meinen Job — zum Guten?",
    tags: ["Wirtschaft", "Politik"],
    sonne: "KI-Exposition heisst nicht Stellenabbau; die Demografielücke macht KI zur Chance.",
    schatten: "Erste Berufsgruppen spüren konkrete Verluste — ausgerechnet Softwareentwickler:innen.",
    anker:
      "Welche Aufgabe in eurem Wunschberuf würde eine KI heute schon übernehmen — und was bliebe dann übrig?",
  },
  {
    kurz: "Wahrheit",
    frage: "Kann ich noch glauben, was ich höre und sehe?",
    tags: ["Technologie", "Gesellschaft", "Recht"],
    sonne: "Skepsis, Austausch und unterschiedliche Generationenkompetenzen machen Fälschungen sichtbar.",
    schatten: "Eine Stimme ist in Minuten geklont — mit einem realen Schweizer Betrugsfall.",
    anker:
      "Woran habt ihr zuletzt gemerkt, dass etwas gefälscht war? Und woran hättet ihr es nicht gemerkt?",
  },
  {
    kurz: "Denken",
    frage: "Macht KI mich klüger oder fauler?",
    tags: ["Individuum", "Psyche", "Bildung"],
    sonne: "Selbst bauen mit KI kann echtes Lernen und Selbstwirksamkeit fördern.",
    schatten: "Prompten aktiviert das Hirn weniger als eigenes Schreiben — mit Folgen fürs Erinnern.",
    anker:
      "Bei welcher Aufgabe nehmt ihr KI bewusst NICHT — und warum ausgerechnet dort?",
  },
  {
    kurz: "Nähe",
    frage: "Kann KI ein:e Freund:in oder Therapeut:in sein?",
    tags: ["Individuum", "Psyche", "Ethik"],
    sonne: "Es gibt Situationen, in denen KI als Begleitung echten Nutzen stiftet.",
    schatten: "Companion-Bots simulieren Nähe, ohne zu verstehen.",
    anker:
      "Was kann ein Mensch, das eine KI in einem Gespräch nie können wird? Sammelt Kandidaten — und prüft sie kritisch.",
  },
  {
    kurz: "Welt",
    frage: "Kann KI die Welt besser machen?",
    tags: ["Ökologie", "Wirtschaft", "Ethik"],
    sonne: "Eine Schweizer Bäckerei senkt mit Bestellprognosen die Lebensmittelverschwendung.",
    schatten: "Hinter dem Training stehen menschliche und soziale Kosten, die bei uns unsichtbar bleiben.",
    anker:
      "Wer trägt die Kosten, wer erntet den Nutzen? Zeichnet beides an die Wandtafel — und schaut euch die Lücke an.",
  },
  {
    kurz: "Verantwortung",
    frage: "Wenn Maschinen über Leben entscheiden",
    tags: ["Politik", "Ethik", "Recht"],
    sonne: "Präzisere Lagebilder, schnellere Entscheide, potenziell weniger zivile Opfer.",
    schatten: "«Automation Bias»: Menschen folgen der Maschine auch dann, wenn sie irrt.",
    anker:
      "Wo endet Unterstützung, wo beginnt Entscheidung? Zieht gemeinsam eine Linie — und begründet, warum genau dort.",
  },
  {
    kurz: "Technik",
    frage: "Wie funktioniert das überhaupt?",
    tags: ["Technologie"],
    sonne: "Ein Sprachmodell sagt das nächste Wort voraus, gestützt auf riesige Textmengen.",
    schatten: "Niemand weiss genau, warum ein Modell diese Antwort gibt — daher Halluzinationen.",
    anker:
      "Wenn niemand die Antwort erklären kann: Wo darf so ein System trotzdem eingesetzt werden?",
  },
];

const SZENARIEN = [
  {
    dauer: "1 Lektion · 45 Min",
    titel: "Positionsreise im Schnelldurchlauf",
    text: "Auftakt gemeinsam, dann zwei frei gewählte Themen, Abschluss mit Landkarte. Der Abschlussbericht bleibt aussen vor — dafür bleibt Zeit für ein Plenum.",
    module: "Lernset 1: Auftakt · 2 Themen · Abschluss",
  },
  {
    dauer: "2 Lektionen · 90 Min",
    titel: "Lernset 1 vollständig",
    text: "Der vorgesehene Umfang: Auftakt, drei bis vier Themen nach eigener Wahl, Abschluss mit Landkarte, Klassen-Spiegel und Abschlussbericht. Ein Plenum-Anker pro bearbeitetem Thema.",
    module: "Lernset 1 komplett",
  },
  {
    dauer: "Halbtag oder zwei Doppellektionen",
    titel: "Beide Lernsets",
    text: "Lernset 1 als Positionsbildung, danach Lernset 2 als Vertiefung: von «Was halte ich davon?» zu «Was ist da überhaupt aufgetreten?». Der Report zeigt beide Teile getrennt.",
    module: "Lernset 1 + Lernset 2",
  },
];

function Karte({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
      {children}
    </div>
  );
}

export default function LeitfadenLehrperson() {
  const lernset2 = unit.modules.find((m) => m.slug === "lernseite-2");

  return (
    <main className="mx-auto max-w-4xl px-lg py-xl">
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
          Lehrpersonen · Inhaltlicher Leitfaden
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">{unit.title}</h1>
        <p className="mt-sm text-body-lg text-on-surface-variant">
          {unit.description}
        </p>
        <p className="mt-sm text-body-sm text-on-surface-variant">
          Lesezeit: rund 10 Minuten. Dieser Leitfaden ersetzt das eigene
          Durchspielen nicht, gibt Ihnen aber genug, um die Lernsets didaktisch
          zu vertreten und gezielte Plenumsphasen zu setzen. Die Bedienung (Klasse
          registrieren, Code teilen, Report öffnen) steht in der{" "}
          <Link href="/lehrperson/anleitung" className="font-semibold text-primary hover:underline">
            Schritt-für-Schritt-Anleitung
          </Link>
          .
        </p>
      </header>

      {/* ── In 30 Sekunden ──────────────────────────────────────────── */}
      <section className="mt-xl rounded-xl border border-primary/20 bg-primary/5 p-lg">
        <p className="text-label-md uppercase tracking-wider text-primary">In 30 Sekunden</p>
        <ul className="mt-sm space-y-sm text-body-md text-on-surface">
          <li>
            <strong>Umfang:</strong> zwei unabhängige Lernsets, in beliebiger
            Reihenfolge · Lernset 1 rund 90 Minuten · Lernset 2 frei erkundbar
          </li>
          <li>
            <strong>Prinzip:</strong> selbstgesteuert und bewertungsfrei — keine
            Noten, bei den Haltungsfragen kein Richtig oder Falsch
          </li>
          <li>
            <strong>Lernziel-Trias:</strong> <em>informieren — positionieren —
            reflektieren</em> (nicht: überzeugen)
          </li>
          <li>
            <strong>Voraussetzung der Klasse:</strong> keine — die Lernsets bauen
            ihr Vokabular selbst auf
          </li>
          <li>
            <strong>Ihr Beitrag:</strong> die Plenumsphasen. Die Lernsets
            liefern das Material, das Gespräch entsteht im Raum
          </li>
        </ul>
      </section>

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

      {/* ── Bogen ───────────────────────────────────────────────────── */}
      <section id="bogen" className="mt-xxl scroll-mt-lg">
        <h2 className="text-headline-lg text-on-surface">Der Bogen der beiden Lernsets</h2>
        <p className="mt-sm text-body-md text-on-surface-variant">
          Die beiden Lernsets stellen dieselbe Sache aus zwei Richtungen: Lernset 1
          fragt <em>«Was halte ich davon?»</em>, Lernset 2 fragt <em>«Was ist da
          überhaupt aufgetreten?»</em>. Beide funktionieren allein; zusammen
          ergeben sie Positionsbildung plus Begriffsarbeit.
        </p>

        <div className="mt-lg grid gap-md md:grid-cols-2">
          <Karte>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-on-primary-container">
              <span className="material-symbols-outlined text-[22px]">explore</span>
            </div>
            <h3 className="mt-sm text-headline-sm text-on-surface">
              Lernset 1 · Positionsreise
            </h3>
            <ol className="mt-md space-y-sm text-body-sm text-on-surface">
              <li>
                <strong>Auftakt</strong> — Vorwissen sichtbar machen, ein
                gemeinsamer Reiz, die Ausgangsposition auf dem Schieberegler,
                zwei Haltungsfragen, Wert-Karten.
              </li>
              <li>
                <strong>Themenfeld</strong> — 7 Themen, frei wählbar, ohne
                Reihenfolge und ohne Mindestzahl. Jedes Thema läuft in 7
                Schritten: Meinung → Sonnenseite → Schattenseite → Wert-Karten →
                Faktencheck → Quiz → Befund und Badge. Jede Themenkarte zeigt
                ihren Erfüllungsgrad — den Anteil der bearbeiteten Elemente.
              </li>
              <li>
                <strong>Abschluss</strong> — Chancen-Risiken-Landkarte,
                Post-Slider im Vergleich zum Start, Klassen-Spiegel und der
                Abschlussbericht: jederzeit abrufbar, mit allen eigenen
                Eingaben, druck- und speicherbar.
              </li>
            </ol>
            <p className="mt-md text-body-sm text-on-surface-variant">
              Die fünf Badge-Felder — Technologie, Ethik, Gesellschaft,
              Wirtschaft, Mensch — machen sichtbar, in welche Richtungen jemand
              gegangen ist.
            </p>
          </Karte>

          <Karte>
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary-container text-on-tertiary-container">
              <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
            </div>
            <h3 className="mt-sm text-headline-sm text-on-surface">
              Lernset 2 · Eine ganz neue Partnerschaft
            </h3>
            <ol className="mt-md space-y-sm text-body-sm text-on-surface">
              <li>
                <strong>Vorhang auf</strong> — die KI tritt als neue Akteurin
                auf: ihre Geschichte, ihre Merkmale, ihr Netz, ihre Kontexte.
              </li>
              <li>
                <strong>Philosophische Perspektive</strong> — technische
                Umbrüche verunsichern seit der Antike. Epochen und Denkwege als
                Orientierung.
              </li>
              <li>
                <strong>Das Orakel</strong> — Rückblick auf die eigenen Wege, die
                eigene Antwort auf die offene Frage, anonymer Vergleich mit
                allen.
              </li>
            </ol>
            <p className="mt-md text-body-sm text-on-surface-variant">
              Statt Punkten sammelt Lernset 2 <strong>Spuren</strong>: jeder
              geöffnete Punkt, jede geknüpfte Fläche, jede Vertiefung. Daraus
              wächst das Rhizom, das die Lernenden am Ende von sich sehen — und
              Sie von der Klasse.
            </p>
          </Karte>
        </div>
      </section>

      {/* ── Lernset 1 Themen ────────────────────────────────────────── */}
      <section id="lernset-1" className="mt-xxl scroll-mt-lg">
        <h2 className="text-headline-lg text-on-surface">
          Lernset 1 — die 7 Themen mit Plenum-Anker
        </h2>
        <p className="mt-sm text-body-md text-on-surface-variant">
          Jedes Thema stellt eine Frage und beantwortet sie zweimal: einmal von
          der Sonnenseite, einmal von der Schattenseite. Genau dieser Widerspruch
          ist das Material fürs Plenum. Zu jedem Thema darum{" "}
          <strong>eine</strong> Frage, die Sie aufgreifen können, sobald die
          Klasse dort war — nicht drei Optionen, eine gesetzte Frage.
        </p>

        <div className="mt-lg space-y-md">
          {STATIONEN.map((s) => (
            <div
              key={s.kurz}
              className="break-inside-avoid rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm"
            >
              <div className="flex items-start gap-md">
                <div className="flex flex-shrink-0 items-center justify-center rounded-full bg-primary-container px-md py-xs text-label-md uppercase tracking-wider text-on-primary-container">
                  {s.kurz}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-headline-sm text-on-surface">{s.frage}</h3>
                  <div className="mt-xs flex flex-wrap gap-xs">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-outline-variant bg-surface-container px-sm py-0.5 text-label-sm text-on-surface-variant"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-md grid gap-sm sm:grid-cols-2">
                <div>
                  <p className="text-label-sm uppercase tracking-wider text-tertiary">
                    Sonnenseite
                  </p>
                  <p className="mt-xs text-body-sm text-on-surface">{s.sonne}</p>
                </div>
                <div>
                  <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Schattenseite
                  </p>
                  <p className="mt-xs text-body-sm text-on-surface">{s.schatten}</p>
                </div>
              </div>

              <div className="mt-md rounded-r-xl border-l-4 border-primary bg-primary/5 p-md">
                <p className="inline-flex items-center gap-xs text-label-sm uppercase tracking-wider text-primary">
                  <span className="material-symbols-outlined text-[16px]">forum</span>
                  Plenum-Anker
                </p>
                <p className="mt-xs text-body-md text-on-surface">{s.anker}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-lg text-body-sm text-on-surface-variant">
          Weil die Klasse frei wählt, sind selten alle beim selben Thema. Zwei
          bewährte Umgänge damit: entweder Sie greifen im Plenum nur die Themen
          auf, die im Report am häufigsten bearbeitet wurden — oder Sie
          lassen bewusst in Gruppen berichten, wer wo war. Der zweite Weg macht
          die Streuung zum Thema statt zum Problem.
        </p>
      </section>

      {/* ── Lernset 2 ───────────────────────────────────────────────── */}
      <section id="lernset-2" className="mt-xxl scroll-mt-lg">
        <h2 className="text-headline-lg text-on-surface">Lernset 2 — die drei Themen</h2>
        <p className="mt-sm text-body-md text-on-surface-variant">
          Lernset 2 arbeitet nicht mit Quizfragen, sondern mit Erkundung: Die
          Lernenden öffnen Knoten, knüpfen Flächen, vertiefen einzelne Punkte und
          markieren, was sie weiterverfolgen möchten. Genau diese drei Signale —{" "}
          <em>angeschaut</em>, <em>vertieft</em>, <em>weiterverfolgt</em> — sehen
          Sie später im Report.
        </p>

        <div className="mt-lg space-y-md">
          {(lernset2?.submodules ?? []).map((sub, i) => (
            <div
              key={sub.slug}
              className="break-inside-avoid rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm"
            >
              <div className="flex items-start gap-md">
                {sub.icon && (
                  <div className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-tertiary-container text-on-tertiary-container">
                    <span className="material-symbols-outlined text-[22px]">{sub.icon}</span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Thema {String(i + 1).padStart(2, "0")} · {sub.subtitle}
                  </p>
                  <h3 className="mt-xs text-headline-sm text-on-surface">{sub.title}</h3>
                </div>
              </div>
              {sub.description && (
                <p className="mt-md text-body-md text-on-surface">{sub.description}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-lg rounded-r-xl border-l-4 border-tertiary bg-tertiary/5 p-md">
          <p className="text-body-sm text-on-surface">
            <strong>Plenum-Anker für Lernset 2:</strong> Nehmen Sie die Liste
            «Am meisten weiterverfolgt» aus dem Report und lesen Sie sie vor.
            Die Frage dazu: <em>Warum ausgerechnet diese Themen? Und was fehlt in
            dieser Liste?</em> Das macht die Auswahl der Klasse selbst zum
            Gegenstand.
          </p>
        </div>
      </section>

      {/* ── Szenarien ───────────────────────────────────────────────── */}
      <section id="szenarien" className="mt-xxl scroll-mt-lg">
        <h2 className="text-headline-lg text-on-surface">Drei Unterrichts-Szenarien</h2>
        <p className="mt-sm text-body-md text-on-surface-variant">
          Je nach verfügbarer Zeit. Die Angaben sind Richtwerte — weil die
          Lernenden selbst wählen, streut die tatsächliche Dauer.
        </p>
        <div className="mt-lg grid gap-md md:grid-cols-3">
          {SZENARIEN.map((s) => (
            <Karte key={s.titel}>
              <p className="text-label-sm uppercase tracking-wider text-primary">{s.dauer}</p>
              <h3 className="mt-xs text-headline-sm text-on-surface">{s.titel}</h3>
              <p className="mt-sm text-body-sm text-on-surface-variant">{s.text}</p>
              <p className="mt-md border-t border-outline-variant pt-sm text-label-sm text-on-surface-variant">
                {s.module}
              </p>
            </Karte>
          ))}
        </div>
      </section>

      {/* ── Report ──────────────────────────────────────────────────── */}
      <section id="report" className="mt-xxl scroll-mt-lg">
        <h2 className="text-headline-lg text-on-surface">Was im Report ankommt</h2>
        <p className="mt-sm text-body-md text-on-surface-variant">
          Damit Sie die Plenumsphasen datengestützt setzen können — etwa: «Beim
          Thema Denken ist die Klasse 60 zu 30 auseinandergegangen. Woran liegt
          das?»
        </p>
        <div className="mt-lg overflow-x-auto rounded-xl border border-outline-variant">
          <table className="w-full text-left text-body-sm">
            <thead>
              <tr className="bg-surface-dim text-label-sm uppercase tracking-wider text-on-surface-variant">
                <th className="px-md py-sm">Element im Lernset</th>
                <th className="px-md py-sm">Was Sie sehen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-on-surface">
              <tr>
                <td className="px-md py-sm font-medium">Umfragen und Schieberegler</td>
                <td className="px-md py-sm">
                  Verteilung je Antwort — Ihre Klasse gegen alle Klassen zusammen
                </td>
              </tr>
              <tr>
                <td className="px-md py-sm font-medium">Quiz und Faktencheck</td>
                <td className="px-md py-sm">Punktestand pro Fortschritts-Code</td>
              </tr>
              <tr>
                <td className="px-md py-sm font-medium">Erfüllungsgrad</td>
                <td className="px-md py-sm">
                  Prozent der bearbeiteten Elemente pro Modul und Datum der
                  letzten Aktivität
                </td>
              </tr>
              <tr>
                <td className="px-md py-sm font-medium">Spuren in Lernset 2</td>
                <td className="px-md py-sm">
                  Klassen-Rhizom, Achtsamkeits-Gewichtung und die konkreten Titel
                  der meistbearbeiteten Themen
                </td>
              </tr>
              <tr>
                <td className="px-md py-sm font-medium">
                  Reflexionen, Freitexte, Profil, Landkarte
                </td>
                <td className="px-md py-sm text-on-surface-variant">
                  Bleiben auf dem Gerät der Lernenden — bewusst nicht im Report
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-md text-body-sm text-on-surface-variant">
          Der letzte Punkt ist eine didaktische Entscheidung, kein technisches
          Versäumnis: Wer weiss, dass die eigene Reflexion gelesen wird, schreibt
          anders. Wenn Sie an die Texte wollen, lassen Sie sie im Unterricht
          vorlesen oder abgeben — freiwillig und im Wissen darum.
        </p>
      </section>

      {/* ── Haltung ─────────────────────────────────────────────────── */}
      <section id="haltung" className="mt-xxl scroll-mt-lg">
        <h2 className="text-headline-lg text-on-surface">Kontroverse statt Konsens</h2>
        <Karte>
          <p className="text-body-md text-on-surface">
            Die Lernsets folgen den Prinzipien des{" "}
            <strong>Beutelsbacher Konsens</strong> der politischen Bildung:
          </p>
          <ul className="mt-md list-inside list-disc space-y-sm text-body-sm text-on-surface">
            <li>
              <strong>Überwältigungsverbot:</strong> KI wird nicht bewertet. Jedes
              Thema zeigt Sonnen- <em>und</em> Schattenseite am selben
              Gegenstand — auch dort, wo eine Seite bequemer wäre.
            </li>
            <li>
              <strong>Kontroversitätsgebot:</strong> Beide Seiten kommen im
              gleichen Format, mit gleichem Gewicht und aus vergleichbaren
              Quellen.
            </li>
            <li>
              <strong>Schülerorientierung:</strong> Die Lernenden wählen ihre
              Themen selbst — ohne Mindestzahl —, und die Abschlussfrage misst
              keine Richtigkeit,
              sondern die eigene Bewegung — von der Ausgangsposition zur
              Endposition.
            </li>
          </ul>
          <p className="mt-md text-body-sm text-on-surface-variant">
            Daraus folgt eine Bitte für die Plenumsphasen: Die Plenum-Anker oben
            sind als Fragen formuliert, nicht als Thesen. Ziel ist die bewusste
            Justierung einer Haltung, nicht die richtige Antwort.
          </p>
        </Karte>
      </section>

      {/* ── Footer-CTA ──────────────────────────────────────────────── */}
      <div className="mt-xxl border-t border-outline-variant pt-xl print:hidden">
        <div className="flex flex-col gap-sm sm:flex-row sm:justify-center">
          <Link
            href="/lehrperson/anleitung"
            className="inline-flex items-center justify-center gap-sm rounded-xl bg-primary px-lg py-sm text-label-md text-on-primary shadow-sm transition hover:bg-on-primary-container"
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            Zur Schritt-für-Schritt-Anleitung
          </Link>
          <Link
            href="/lernen/lernseite-1"
            className="inline-flex items-center justify-center gap-sm rounded-xl border border-outline-variant px-lg py-sm text-label-md text-on-surface transition hover:bg-surface-dim"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            Lernset selbst durchspielen
          </Link>
          <DruckButton label="Leitfaden drucken" variante="umrandet" />
        </div>
      </div>
    </main>
  );
}
