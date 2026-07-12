import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import { FadenDivider, Signatur } from "../_components/Gewebe";
import FadenNetz from "../_components/FadenNetz";
import KnotenNetz from "../_components/KnotenNetz";
import Storyboard from "./_components/Storyboard";
import ZitatReveal from "./_components/ZitatReveal";

/**
 * Thema 01 — «Vorhang auf: eine neue Akteurin».
 *
 * Dramaturgie des Auftakts:
 *  1. Zitate-Rätsel «Alt — oder von heute?» (alte Literatur, die nach
 *     KI-Zeitalter klingt — zum Aufdecken, Quellen verifiziert),
 *  2. die KI-Story als Storyboard (vom Golem bis zur Gegenwart, die
 *     letzten Phasen bewusst offen),
 *  3. drei kurze Szenen (Auftritt, Irritation, Frage),
 *  4. das Netz der neuen Akteurin — dann öffnen sich die zwei
 *     Perspektiven (philosophisch, kulturell).
 */

const SZENEN = [
  {
    label: "Der Auftritt",
    text: "Technik hat bisher gerechnet, gespeichert, übertragen. Im November 2022 ging ein Vorhang auf: Mit ChatGPT trat etwas auf die Bühne, das in unserer Sprache antwortet — es schreibt Briefe, erklärt Aufgaben, entwirft Bilder und Ideen. Innerhalb weniger Wochen benutzten es Millionen von Menschen.",
  },
  {
    label: "Die Irritation",
    text: "Für Werkzeuge haben wir Regeln: Man benutzt sie, und sie bleiben stumm. Für Personen haben wir auch Regeln: Man begegnet ihnen, sie tragen Verantwortung. Die neue Akteurin passt in keine der beiden Schubladen — sie wird geführt wie ein Werkzeug und antwortet wie ein Gegenüber.",
  },
  {
    label: "Die Frage",
    text: "Wie umgehen mit etwas, das kein Werkzeug und keine Person ist? Genau hier setzt dieses Modul an. Zwei Perspektiven helfen bei der Einordnung: Die philosophische klärt Begriffe und stiftet Orientierung, die kulturelle zeigt, welche Bilder und Erzählungen unseren Blick längst geprägt haben.",
  },
];

export default function Lernseite2VorhangAuf() {
  return (
    <AppLayout>
      <ActivityTracker
        type="lesson_open"
        page="lernseite-2/vorhang-auf"
        lessonId="lernseite-2-vorhang-auf"
      />

      <Link
        href="/lernen/lernseite-2"
        className="inline-flex items-center gap-xs text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Zurück zu Lernseite 2
      </Link>

      <header className="mt-lg border-b border-outline-variant pb-lg">
        <div className="flex items-end justify-between gap-md">
          <div className="min-w-0">
            <p className="text-label-md uppercase tracking-wider text-tertiary">
              Thema 01 · Auftakt
            </p>
            <h1 className="mt-sm text-headline-xl text-on-surface">
              Vorhang auf — eine neue Akteurin
            </h1>
            <p className="mt-sm max-w-3xl text-body-lg text-on-surface-variant">
              Mit KI ist eine neue Art von Akteurin aufgetreten — weder ein
              klassisches Werkzeug noch eine Person. Bevor wir sie einordnen,
              schauen wir hin: Was genau ist da eigentlich auf die Bühne
              getreten?
            </p>
          </div>
          <Signatur variante="auftritt" className="hidden flex-shrink-0 sm:block" />
        </div>
      </header>

      {/* Interaktives Muster der Seite: der Auftritts-Stern — sieben Merkmale
          als Strahlen aus einer dekorativen Nabe. Zwischen besuchten Knoten
          füllen sich die Flächen (Farbe / Schraffur / Punkte); ist das Muster
          gewoben, erscheint darunter das erklärende Abschluss-Feld. */}
      <FadenNetz
        className="mt-xl max-w-5xl"
        hoehe={220}
        svgKlasse="aspect-[720/300] sm:aspect-[720/220]"
        spurKey="vorhang-auf:weisheit"
        einladung="Sieben Merkmale der neuen Akteurin — fahr die Fäden von der Nabe nach aussen. Ist das Muster gewoben, fügt sich unten das Bild zusammen."
        nabe={[360, 112]}
        abschluss="Diese sieben Eigenschaften treffen sich in einem einzigen Gegenüber — und darin liegt das eigentlich Neue: Nicht eine einzelne Fähigkeit, sondern ihre Bündelung macht die KI zu einer Akteurin. Sie spricht, erzeugt, erkennt, lernt, erinnert, handelt und verbindet die Sinne — und wird so zu etwas, dem wir mehr Potenzial zurechnen, auf unser Handeln Einfluss zu nehmen, als je einer Technik zuvor."
        straenge={[
          { d: "M360 112 L360 20" },
          { d: "M360 112 L602 55" },
          { d: "M360 112 L662 132" },
          { d: "M360 112 L495 195" },
          { d: "M360 112 L226 195" },
          { d: "M360 112 L58 133" },
          { d: "M360 112 L118 55" },
          { d: "M360 20 L602 55", fein: true },
          { d: "M602 55 L662 132", fein: true },
          { d: "M662 132 L495 195", fein: true },
          { d: "M495 195 L226 195", fein: true },
          { d: "M226 195 L58 133", fein: true },
          { d: "M58 133 L118 55", fein: true },
          { d: "M118 55 L360 20", fein: true },
        ]}
        flaechen={[
          { punkte: [[360, 112], [360, 20], [602, 55]], knoten: [0, 1] },
          { punkte: [[360, 112], [602, 55], [662, 132]], knoten: [1, 2] },
          { punkte: [[360, 112], [662, 132], [495, 195]], knoten: [2, 3] },
          { punkte: [[360, 112], [495, 195], [226, 195]], knoten: [3, 4] },
          { punkte: [[360, 112], [226, 195], [58, 133]], knoten: [4, 5] },
          { punkte: [[360, 112], [58, 133], [118, 55]], knoten: [5, 6] },
          { punkte: [[360, 112], [118, 55], [360, 20]], knoten: [6, 0] },
        ]}
        knoten={[
          {
            x: 360,
            y: 20,
            text: "Die heisseste neue Programmiersprache ist Englisch.",
            quelle: "Andrej Karpathy (OpenAI/Tesla), 2023 · übersetzt",
            kommentar: "Merkmal: dialoghaft.",
            deutung:
              "Früher steuerte man Computer über Code; heute genügt ein Satz Alltagssprache. Karpathy bringt es auf den Punkt: Die Schnittstelle ist die Sprache selbst. Das Dialoghafte ist das Erste, was uns an KI berührt — wir weisen sie an, fragen nach, widersprechen, wie einem Gegenüber.",
          },
          {
            x: 602,
            y: 55,
            text: "Eigentlich sollte man von Konfabulationen sprechen.",
            quelle: "Katharina Zweig, «Spektrum der Wissenschaft», Edition KI, 2026",
            kommentar: "Merkmal: generativ.",
            deutung:
              "Ein Sprachmodell erzeugt fortlaufend neuen Text, indem es das nächste Wort vorhersagt — es besitzt aber keine Wissensdatenbank zum Nachschlagen. Wo es danebenliegt, spricht man von «Halluzination»; Katharina Zweig hält das für psychologisch falsch und schlägt «Konfabulation» vor — wie bei Menschen, die flüssig Wörter aneinanderreihen, ohne Wissen dahinter. Erzeugen und Erfinden sind hier dieselbe Münze.",
          },
          {
            x: 662,
            y: 132,
            text: "Ein Modell, das über Audio, Bild und Text hinweg in Echtzeit denkt.",
            quelle: "OpenAI, zur Vorstellung von GPT-4o, 2024 · übersetzt",
            kommentar: "Merkmal: multimodal.",
            deutung:
              "Lange konnte ein System entweder Text oder Bild oder Ton. Multimodale Modelle verbinden diese Sinne in einem einzigen Netz: Sie lesen, sehen und hören — und antworten wahlweise mit Text, Bild oder Stimme. Damit rückt die Maschine näher an die Art, wie Menschen die Welt aufnehmen: nicht in getrennten Kanälen, sondern zusammen. Aus dem Textautomaten wird ein Gegenüber, das eine Skizze, ein Foto oder einen gesprochenen Satz versteht.",
          },
          {
            x: 495,
            y: 195,
            text: "Agent = LLM + Gedächtnis + Planung + Werkzeuggebrauch.",
            quelle: "Lilian Weng (OpenAI), 2023 · übersetzt",
            kommentar: "Merkmal: agentenhaft.",
            deutung:
              "Weng fasst die agentenhafte KI in eine Formel: ein Sprachmodell als «Gehirn», dazu Gedächtnis, die Fähigkeit, ein Ziel in Schritte zu zerlegen, und der Griff zu Werkzeugen — Websuche, Code, andere Programme. So wird aus dem Antwortgeber ein Akteur, der eigenständig handelt. Genau hier verschwimmt die alte Grenze zwischen Werkzeug und Gegenüber.",
          },
          {
            x: 226,
            y: 195,
            text: "Während des Trainings werden die Gewichte so angepasst, dass sie eine Aufgabe möglichst gut erfüllen.",
            quelle: "«Spektrum der Wissenschaft», Edition KI, 2026",
            kommentar: "Merkmal: speicherabhängig — wo kein Speicher, kein Training.",
            deutung:
              "Alles, was ein Modell «kann», steckt in Milliarden gespeicherten Zahlen — den Gewichten. Training heisst nichts anderes, als diese Werte so lange zu verstellen, bis die Antworten stimmen: Ohne Speicher gäbe es nichts festzuhalten — also auch kein Lernen. Und im Betrieb braucht es weiter Speicher: als Kurzzeitgedächtnis (den Kontext) und als durchsuchbare Ablage fürs Langzeitgedächtnis. Speicher ist damit nicht Zubehör, sondern Voraussetzung.",
          },
          {
            x: 58,
            y: 133,
            text: "Die Lernalgorithmen sind die Samen, die Daten der Boden, die gelernten Programme die Pflanzen.",
            quelle: "Pedro Domingos, «The Master Algorithm», 2015 · übersetzt",
            kommentar: "Merkmal: datenbasiert.",
            deutung:
              "Der Machine-Learning-Forscher Pedro Domingos vergleicht das Lernen mit Landwirtschaft: Der Algorithmus ist nur das Saatgut — wachsen lässt ihn erst der Boden aus Daten. Ohne riesige Datenmengen bleibt die klügste Methode unfruchtbar. Deshalb dreht sich in der KI alles um Daten — und um die Frage, wessen Daten das sind und was in ihnen steckt.",
          },
          {
            x: 118,
            y: 55,
            text: "Die Maschine versteht nicht, warum welches Wort in welchen Kontext passt.",
            quelle: "Katharina Zweig, «Spektrum der Wissenschaft», Edition KI, 2026",
            kommentar: "Merkmal: mustererkennend.",
            deutung:
              "Mustererkennung wird gern als blosse Wahrscheinlichkeitsrechnung abgetan. Die Informatikerin Katharina Zweig schärft das Bild: Das System leitet aus grossen Datenmengen statistische Muster als Regeln ab und hat bestimmte Wörter schlicht häufig in bestimmten Kontexten gelesen. Es erkennt Muster verlässlich — versteht aber nicht, warum. Ihr nüchternes Fazit: Noch seien diese Systeme gar nicht intelligent.",
          },
        ]}
      />

      {/* 1 — Ratespiel: Woher stammt das? */}
      <section className="mt-xl max-w-5xl" aria-label="Woher stammt das?">
        <h2 className="text-headline-lg text-on-surface">Woher stammt das?</h2>
        <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
          Zehn Aussagen über Maschinen, Denken und Arbeit — Hoffnung wie Furcht.
          Rate bei jeder: Ist das <strong>heute über KI</strong> gesagt, stammt es
          von <strong>früher über eine andere Technik</strong>, oder{" "}
          <strong>aus der Literatur</strong>? Achtung — sie klingen alle
          verblüffend aktuell.
        </p>
        <ZitatReveal className="mt-lg" />
      </section>

      <FadenDivider className="mt-xl" />

      {/* 2 — Die KI-Story als Storyboard */}
      <section className="mt-xl max-w-5xl" aria-label="Die KI-Story">
        <h2 className="text-headline-lg text-on-surface">
          Die KI-Story — ein Storyboard
        </h2>
        <p className="mt-sm max-w-4xl text-body-lg text-on-surface-variant">
          Vom Traum, Dingen Leben einzuhauchen, bis zur Gegenwart: zwölf
          Stationen — und Phasen, deren letzte noch niemand kennt.
        </p>
        <Storyboard className="mt-lg" />
      </section>

      <FadenDivider className="mt-xl" />

      {/* Drei Szenen am Faden */}
      <section className="mt-xl max-w-3xl" aria-label="Drei Szenen">
        <ol className="flex flex-col gap-lg">
          {SZENEN.map((sz, i) => (
            <li key={sz.label} className="flex gap-md">
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="mt-xs h-6 w-6 flex-shrink-0"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  fill="none"
                  strokeWidth="1"
                  className="stroke-tertiary"
                  opacity="0.45"
                />
                <circle cx="12" cy="12" r="3.5" className="fill-tertiary" />
              </svg>
              <div className="min-w-0">
                <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Szene {i + 1}
                </p>
                <h2 className="mt-xs text-headline-sm text-on-surface">
                  {sz.label}
                </h2>
                <p className="mt-sm text-body-md text-on-surface-variant">
                  {sz.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <FadenDivider className="mt-xl" />

      {/* Interaktive Signatur: das Netz der neuen Akteurin */}
      <section className="mt-xl max-w-3xl" aria-label="Das Netz der neuen Akteurin">
        <h2 className="text-headline-md text-on-surface">
          Das Netz der neuen Akteurin
        </h2>
        <p className="mt-sm text-body-md text-on-surface-variant">
          Die neue Akteurin steht nie allein: Wer mit ihr spricht, zieht an
          einem ganzen Geflecht. Tippe die Knoten an — wer oder was zieht mit?
        </p>
        <KnotenNetz
          className="mt-lg"
          spurKey="vorhang-auf:netz"
          einladung="Sechs Fäden laufen im Zentrum zusammen — tippe die Knoten an und entdecke, wer alles mitzieht."
          deko={[
            "M120 96 L36 40",
            "M120 96 L116 16",
            "M120 96 L204 32",
            "M120 96 L28 148",
            "M120 96 L128 180",
            "M120 96 L208 156",
          ]}
          dekoFein={["M36 40 L116 16", "M204 32 L208 156"]}
          knoten={[
            {
              x: 120,
              y: 96,
              akzent: true,
              titel: "KI — die neue Akteurin",
              text: "Sie steht nie allein: Von ihr laufen Fäden zu Menschen, Material und Regeln. Genau dieses Geflecht macht sie zur Akteurin — nicht ein einzelner Chip.",
            },
            {
              x: 36,
              y: 40,
              titel: "Nutzer:innen",
              text: "Deine Fragen und Formulierungen führen die Akteurin. Ohne Eingabe bleibt sie stumm — mit dir wird sie zur Mitspielerin.",
            },
            {
              x: 116,
              y: 16,
              titel: "Sprache",
              text: "Gelernt aus Milliarden Sätzen: Unsere Wörter, Geschichten und auch unsere Fehler sind ihr Material.",
            },
            {
              x: 204,
              y: 32,
              titel: "Datencentren",
              text: "Jede Antwort läuft durch riesige Rechenhallen — Strom, Kühlung und Seekabel inklusive.",
            },
            {
              x: 28,
              y: 148,
              titel: "Rohstoffe",
              text: "Chips brauchen Metalle, Minen und Fabriken. Die Akteurin hat ein materielles Gewicht.",
            },
            {
              x: 128,
              y: 180,
              titel: "Unternehmen",
              text: "Firmen bauen, trainieren und steuern sie — mit eigenen Zielen und Geschäftsmodellen.",
            },
            {
              x: 208,
              y: 156,
              titel: "Regeln",
              text: "Gesetze und Abmachungen entscheiden, was sie darf — und wer haftet, wenn etwas schiefgeht.",
            },
          ]}
        />
      </section>

      <FadenDivider className="mt-xl" />

      {/* Der Faden läuft weiter */}
      <section className="mt-xl max-w-3xl" aria-label="Weiter im Modul">
        <h2 className="text-headline-md text-on-surface">Der Faden läuft weiter</h2>
        <p className="mt-sm text-body-md text-on-surface-variant">
          Zwei Perspektiven nehmen die neue Akteurin in den Blick:
        </p>
        <div className="mt-lg grid gap-md sm:grid-cols-2">
          <Link
            href="/lernen/lernseite-2/philosophische-perspektive"
            className="group flex items-start justify-between gap-md rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="min-w-0">
              <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                Thema 02
              </p>
              <h3 className="mt-xs text-headline-sm text-on-surface">
                Philosophische Perspektive
              </h3>
              <span className="mt-md inline-flex items-center gap-sm text-label-md text-tertiary">
                Öffnen
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
            </div>
            <Signatur variante="epochen" className="hidden flex-shrink-0 sm:block" />
          </Link>
          <Link
            href="/lernen/lernseite-2/kulturelle-perspektive"
            className="group flex items-start justify-between gap-md rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="min-w-0">
              <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                Thema 03
              </p>
              <h3 className="mt-xs text-headline-sm text-on-surface">
                Kulturelle Perspektive
              </h3>
              <span className="mt-md inline-flex items-center gap-sm text-label-md text-tertiary">
                Öffnen
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
            </div>
            <Signatur variante="gewebe" className="hidden flex-shrink-0 sm:block" />
          </Link>
        </div>
      </section>
    </AppLayout>
  );
}
