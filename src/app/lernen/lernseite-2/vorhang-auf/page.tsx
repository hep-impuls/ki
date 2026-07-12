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

      {/* Interaktives Muster der Seite: der Auftritts-Stern — sechs Fäden,
          sechs Wege, in der Mitte die Bühne. Zwischen besuchten Knoten
          füllen sich die Flächen (Farbe / Schraffur / Punkte). */}
      <FadenNetz
        className="mt-xl max-w-5xl"
        hoehe={220}
        svgKlasse="aspect-[720/300] sm:aspect-[720/220]"
        spurKey="vorhang-auf:weisheit"
        einladung="Sechs Fäden, sechs Merkmale der neuen Akteurin — fahr sie nach und entdecke in den Worten der KI-Fachleute, was sich an ihr verstärkt hat."
        straenge={[
          { d: "M360 112 L84 48" },
          { d: "M360 112 L300 24" },
          { d: "M360 112 L596 38" },
          { d: "M360 112 L76 182" },
          { d: "M360 112 L420 198" },
          { d: "M360 112 L636 172" },
          { d: "M84 48 L300 24", fein: true },
          { d: "M596 38 L636 172", fein: true },
        ]}
        flaechen={[
          { punkte: [[360, 112], [84, 48], [300, 24]], knoten: [0, 1, 2] },
          { punkte: [[360, 112], [300, 24], [596, 38]], knoten: [0, 2, 3] },
          { punkte: [[360, 112], [596, 38], [636, 172]], knoten: [0, 3, 6] },
          { punkte: [[360, 112], [636, 172], [420, 198]], knoten: [0, 6, 5] },
          { punkte: [[360, 112], [420, 198], [76, 182]], knoten: [0, 5, 4] },
          { punkte: [[360, 112], [76, 182], [84, 48]], knoten: [0, 4, 1] },
        ]}
        knoten={[
          {
            x: 360,
            y: 112,
            akzent: true,
            text: "Sechs Merkmale — jedes gibt es seit Jahrzehnten, doch die KI dreht sie alle zugleich auf.",
            quelle: "Die neue Akteurin",
            kommentar: "Fahr die sechs Fäden nach.",
            deutung:
              "Was die heutige KI neu macht, ist selten eine einzelne Zauberzutat — es ist die Verdichtung vertrauter Fähigkeiten: Sie spricht und erzeugt Sprache, erkennt Muster, lernt aus Daten, hängt an Speicher, handelt selbstständig und verbindet Text, Bild und Ton. Jeder Strahl zeigt eines dieser Merkmale, in den Worten von Fachleuten aus der KI-Community. Zusammen ergeben sie das Profil der neuen Akteurin.",
          },
          {
            x: 84,
            y: 48,
            text: "Die heisseste neue Programmiersprache ist Englisch.",
            quelle: "Andrej Karpathy (OpenAI/Tesla), 2023 · übersetzt",
            kommentar: "Merkmal: dialoghaft & generativ.",
            deutung:
              "Früher steuerte man Computer über Code; jetzt genügt ein Satz Alltagssprache — und dieselbe Sprachfähigkeit, mit der sie uns versteht, lässt sie auch erzeugen. Dialoghaft und generativ sind zwei Seiten derselben Medaille: Wir reden mit ihr, und sie schreibt zurück — Texte, Bilder, Code, die so nie eingegeben wurden. Die Kehrseite benennt Katharina Zweig: Das Modell sagt bloss das nächste Wort voraus, ohne Wissensbasis — es «konfabuliert» eher, als dass es halluziniert.",
          },
          {
            x: 300,
            y: 24,
            text: "Die Maschine versteht nicht, warum welches Wort in welchen Kontext passt.",
            quelle: "Katharina Zweig, «Spektrum der Wissenschaft», Edition KI, 2026",
            kommentar: "Merkmal: Mustererkennung — statistisch, nicht verstehend.",
            deutung:
              "Mustererkennung wird gern als blosse Wahrscheinlichkeitsrechnung abgetan. Die Informatikerin Katharina Zweig schärft das Bild: Das System leitet aus grossen Datenmengen statistische Muster als Regeln ab und hat bestimmte Wörter schlicht häufig in bestimmten Kontexten gelesen. Es erkennt Muster verlässlich — versteht aber nicht, warum. Ihr nüchternes Fazit: Noch seien diese Systeme gar nicht intelligent.",
          },
          {
            x: 596,
            y: 38,
            text: "Die Lernalgorithmen sind die Samen, die Daten der Boden, die gelernten Programme die Pflanzen.",
            quelle: "Pedro Domingos, «The Master Algorithm», 2015 · übersetzt",
            kommentar: "Merkmal: datenbasiert.",
            deutung:
              "Der Machine-Learning-Forscher Pedro Domingos vergleicht das Lernen mit Landwirtschaft: Der Algorithmus ist nur das Saatgut — wachsen lässt ihn erst der Boden aus Daten. Ohne riesige Datenmengen bleibt die klügste Methode unfruchtbar. Deshalb dreht sich in der KI alles um Daten — und um die Frage, wessen Daten das sind und was in ihnen steckt.",
          },
          {
            x: 76,
            y: 182,
            text: "Während des Trainings werden die Gewichte so angepasst, dass sie eine Aufgabe möglichst gut erfüllen.",
            quelle: "«Spektrum der Wissenschaft», Edition KI, 2026",
            kommentar: "Merkmal: speicherabhängig — wo kein Speicher, kein Training.",
            deutung:
              "Alles, was ein Modell «kann», steckt in Milliarden gespeicherten Zahlen — den Gewichten. Training heisst nichts anderes, als diese Werte so lange zu verstellen, bis die Antworten stimmen: Ohne Speicher gäbe es nichts festzuhalten — also auch kein Lernen. Und im Betrieb braucht es weiter Speicher: als Kurzzeitgedächtnis (den Kontext) und als durchsuchbare Ablage fürs Langzeitgedächtnis. Speicher ist damit nicht Zubehör, sondern Voraussetzung.",
          },
          {
            x: 420,
            y: 198,
            text: "Agent = LLM + Gedächtnis + Planung + Werkzeuggebrauch.",
            quelle: "Lilian Weng (OpenAI), 2023 · übersetzt",
            kommentar: "Merkmal: agentenhaft.",
            deutung:
              "Weng fasst die agentenhafte KI in eine Formel: ein Sprachmodell als «Gehirn», dazu Gedächtnis, die Fähigkeit, ein Ziel in Schritte zu zerlegen, und der Griff zu Werkzeugen — Websuche, Code, andere Programme. So wird aus dem Antwortgeber ein Akteur, der eigenständig handelt. Genau hier verschwimmt die alte Grenze zwischen Werkzeug und Gegenüber.",
          },
          {
            x: 636,
            y: 172,
            text: "Ein Modell, das über Audio, Bild und Text hinweg in Echtzeit denkt.",
            quelle: "OpenAI, zur Vorstellung von GPT-4o, 2024 · übersetzt",
            kommentar: "Merkmal: multimodal.",
            deutung:
              "Lange konnte ein System entweder Text oder Bild oder Ton. Multimodale Modelle verbinden diese Sinne in einem einzigen Netz: Sie lesen, sehen und hören — und antworten wahlweise mit Text, Bild oder Stimme. Damit rückt die Maschine näher an die Art, wie Menschen die Welt aufnehmen: nicht in getrennten Kanälen, sondern zusammen. Aus dem Textautomaten wird ein Gegenüber, das eine Skizze, ein Foto oder einen gesprochenen Satz versteht.",
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
