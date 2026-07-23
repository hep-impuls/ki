"use client";

import { useEffect, useState } from "react";
import {
  leseSpurenIndices,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../../_lib/spuren";
import { merkeInhalt } from "../../_lib/inhalte";
import GewichtungWahl from "../../_components/GewichtungWahl";

/**
 * Denkwege — «Wege der Orientierung»: acht philosophische Ansätze zur
 * Verunsicherung durch KI, als durchklickbare Slides. Zwei Fragen gliedern sie:
 * «Was ist der Mensch?» (Arendt, Heidegger, Sloterdijk, Hustvedt) und «Wie
 * umgehen mit der KI?» (Latour, Nassehi, Gabriel, Haraway).
 *
 * Leitgedanke: Es geht nicht darum, was die Maschine dem Menschen abnimmt,
 * sondern was wesentlich Mensch und was wesentlich Maschine ist. Der Mensch kann
 * anfangen und er urteilt; die Maschine erkennt Muster in Daten. Jeder Slide ist
 * ein Fliesstext (mit den vorgeschlagenen Begriffen in «Anführungszeichen») und
 * schliesst mit einer Box «Gegenwartsbezug» plus einer Bewertung.
 *
 * Inhaltlich fundiert auf den bereitgestellten Werken (Gabriel «Ethische
 * Intelligenz», Latour «Existenzweisen», Nassehi «Muster», Hustvedt «Die
 * Illusion der Gewissheit», Sloterdijk «Du musst dein Leben ändern» und
 * «Philosophische Temperamente», Arendt via von Redecker «Gravitation zum Guten»
 * und Arendt «Der Liebesbegriff bei Augustin», Haraway «Unruhig bleiben») sowie
 * guten öffentlichen Quellen (Heidegger). Belege getrennt gepflegt.
 *
 * Ein Slide zählt als Aktivität, sobald man aktiv navigiert (nicht beim Laden).
 * Nur Theme-Tokens, Material Symbols.
 */

interface Denkweg {
  gruppe: string;
  denker: string;
  leben: string;
  these: string;
  icon: string;
  /** Fliesstext: Grundidee, wogegen, neue Begriffe («…») und Orientierung. */
  absaetze: string[];
  /** Die eine Box: was der Ansatz für den Umgang mit KI heute bedeutet. */
  gegenwart: string;
  /** Quellenzeile (Werk, Jahr). */
  werk: string;
}

const DENKWEGE: Denkweg[] = [
  {
    gruppe: "Was ist der Mensch?",
    denker: "Hannah Arendt",
    leben: "1906 bis 1975",
    these: "Neu anfangen und selbst urteilen",
    icon: "psychology",
    absaetze: [
      "Für Hannah Arendt ist die entscheidende Frage nicht, was die Maschine dem Menschen abnimmt, sondern was den Menschen im Kern ausmacht und was die Maschine im Kern ist. Ihre Antwort hat zwei Seiten. Der Mensch kann anfangen. Mit jedem Menschen kommt etwas Neues in die Welt, das aus dem Bisherigen nicht ableitbar ist. Diese Fähigkeit nennt Arendt die «Natalität». Und der Mensch urteilt. Er hält inne, prüft und entscheidet, was richtig ist, auch aus der Sicht anderer, was Arendt die «erweiterte Denkungsart» nennt.",
      "Eine KI kann beides nicht. Sie erkennt Muster in Daten, ob riesig oder klein, und schreibt das Wahrscheinliche fort. Sie fängt nichts an und sie urteilt nicht, sie rechnet. Genau davor warnt Arendt mit dem Wort «Gedankenlosigkeit», dem Leben in fertigen Floskeln, ohne selbst zu prüfen. Am Prozess gegen Eichmann zeigte sie, wie gefährlich es wird, wenn Menschen aufhören, selbst zu denken.",
      "Daraus folgt eine klare Orientierung. Die flüssigen, gut klingenden Sätze einer KI sind oft genau jene Floskeln, vor denen Arendt warnt. Menschlich bleibt, wer innehält, prüft, selbst urteilt und etwas beginnt, das aus den Daten nicht folgt. So gibt man das Anfangen und das Urteilen nicht aus der Hand.",
    ],
    gegenwart:
      "Lass die KI eine heikle Kundenmail schreiben. Markiere zuerst die Sätze, die gut klingen, aber nichts sagen. Beurteile den Text dann neu aus Sicht der Kundin und entscheide selbst, ob du wirklich dahinterstehst. Das Formulieren kann die Maschine, das Anfangen und das Urteilen bleibt bei dir.",
    werk: "nach Eva von Redecker, «Gravitation zum Guten» (2013); Arendt, «Eichmann in Jerusalem» (1963); Wurzeln in «Der Liebesbegriff bei Augustin» (1929)",
  },
  {
    gruppe: "Was ist der Mensch?",
    denker: "Martin Heidegger",
    leben: "1889 bis 1976",
    these: "Sich sorgen, verwoben mit der Technik",
    icon: "favorite",
    absaetze: [
      "Martin Heidegger fragt, was das menschliche Dasein ausmacht, und nennt es die «Sorge». Gemeint ist nicht die alltägliche Sorge, sondern dass dem Menschen sein eigenes Leben nicht gleichgültig ist. Wir kümmern uns, fragen nach Sinn und wissen um unsere Endlichkeit. Eine Maschine rechnet und erkennt Muster, aber ihr ist nichts wichtig, ihr geht es um nichts.",
      "Zugleich zeigt Heidegger mit dem Begriff «Gestell», wie eng der Mensch mit der Technik verwoben ist. Das Gestell ist die moderne Grundhaltung, alles als verfügbaren Vorrat zu sehen. Entscheidend ist, wie Heidegger das meint. Es ist kein Aufruf, sich von der Technik zu lösen, denn der Mensch kann längst nicht mehr ohne sie. Es ist die Einsicht, dass wir von Technik abhängig und mit ihr verbunden sind. Wer das sieht, kann bewusst mit ihr umgehen, statt sich blind von ihr treiben zu lassen.",
      "Heidegger nennt diese Haltung «Gelassenheit». Sie bedeutet nicht Rückzug aus der Technik, sondern einen klaren, ruhigen Umgang mit ihr, im Wissen, dass wir Teil desselben Gefüges sind. Orientierung entsteht, wenn wir die Technik nutzen und uns weiter sorgen, denn das Sich-Sorgen kann uns keine Maschine abnehmen.",
    ],
    gegenwart:
      "Ein Pflegeteam lässt die KI den Dienstplan berechnen. Ohne solche Werkzeuge läuft der Betrieb längst nicht mehr, die Abhängigkeit ist real. Genau deshalb bleibt die Sorge um die Patientinnen und Patienten beim Menschen. Die Technik nutzen und sich zugleich sorgen, das ist kein Widerspruch, sondern Heideggers Punkt.",
    werk: "Martin Heidegger, «Sein und Zeit» (1927), «Die Frage nach der Technik» (1954) und «Gelassenheit» (1959)",
  },
  {
    gruppe: "Was ist der Mensch?",
    denker: "Peter Sloterdijk",
    leben: "geboren 1947",
    these: "Der Mensch bildet sich durch Übung",
    icon: "self_improvement",
    absaetze: [
      "Peter Sloterdijk beschreibt den Menschen als übendes Wesen. Wir werden, wer wir sind, durch Übung, Wiederholung und Selbstformung. Er nennt den Menschen das Lebewesen, das aus der Wiederholung entsteht. Für die Verfahren, mit denen wir an uns arbeiten, prägt er den Begriff «Anthropotechnik». Und «Du musst dein Leben ändern» ist bei ihm kein Befehl, sondern der Grundton, sich immer wieder in Form zu bringen.",
      "Menschen leben nach Sloterdijk nie ganz allein, sondern in gemeinsamen, schützenden Räumen, die er «Sphären» nennt, eine Art geteiltes Immunsystem. Sein Einwand richtet sich gegen die Bequemlichkeit, Fähigkeiten ganz an die Technik abzugeben. Wer nicht mehr übt, verlernt und wird unselbständig. Der heutige, wie er sagt, konfuse Mensch muss sich neu orientieren.",
      "Gegenüber der KI liegt die menschliche Aufgabe darum im Üben. Eine Maschine kann eine Aufgabe für uns erledigen, aber nicht für uns üben. Wer weiter übt, versteht, was die KI tut, bleibt fähig und kann ihr Ergebnis prüfen. Orientierung entsteht nicht durch Abgeben, sondern durch beständige Übung.",
    ],
    gegenwart:
      "Die KI löst eine Rechnung oder übersetzt einen Text in Sekunden. Übe die Grundfertigkeit trotzdem selbst. Nur so merkst du, wenn die KI danebenliegt, und bleibst Herr über das Ergebnis, statt ihm ausgeliefert zu sein.",
    werk: "Peter Sloterdijk, «Du musst dein Leben ändern» (2009) und «Philosophische Temperamente» (2009)",
  },
  {
    gruppe: "Was ist der Mensch?",
    denker: "Siri Hustvedt",
    leben: "geboren 1955",
    these: "Der Geist ist kein Computer",
    icon: "accessibility_new",
    absaetze: [
      "Siri Hustvedt zeigt, dass sich der menschliche Geist nicht auf einen Computer im Kopf reduzieren lässt. Denken und Fühlen hängen am lebendigen Körper und an gelebter Erfahrung, sie spricht darum vom «verkörperten Geist». Eine KI kann Sprache und Gefühle täuschend echt nachahmen, aber sie erlebt nichts, denn wie Hustvedt sagt, Maschinen machen keine Erfahrungen.",
      "Ihr Einwand richtet sich gegen den verbreiteten Vergleich, das Gehirn sei ein Computer, und gegen die falsche Gewissheit, wir wüssten genau, wie der Geist arbeitet. Dagegen setzt sie den «produktiven Zweifel», also gutes Fragen und mehrere Sichtweisen statt schneller Sicherheit.",
      "Das ergibt ein einfaches Unterscheidungswerkzeug. Die KI simuliert, sie tut nur so als ob, sie erfährt nicht. Wer das im Blick behält, verwechselt das flüssige Modell nicht mit der Wirklichkeit und fällt weder in Begeisterung noch in Panik.",
    ],
    gegenwart:
      "Lass die KI einen tröstenden Text an eine Kollegin schreiben, die eine Prüfung nicht bestanden hat. Vergleiche ihn mit einem selbst geschriebenen. Der KI-Text klingt oft passend, aber die KI war nie nervös und hat nie versagt. Sie kennt das Gefühl nur als Muster, nicht als Erfahrung.",
    werk: "Siri Hustvedt, «Die Illusion der Gewissheit» (2018)",
  },
  {
    gruppe: "Wie umgehen mit der KI?",
    denker: "Bruno Latour",
    leben: "1947 bis 2022",
    these: "Nicht alles ist auf dieselbe Art wahr",
    icon: "category",
    absaetze: [
      "Bruno Latour sagt, es gibt nicht nur eine Art, wahr zu sein. Wissenschaft, Technik, Recht und Erzählung haben je eigene Regeln dafür, was als gelungen gilt. Er nennt sie «Existenzweisen». Viele Verunsicherungen entstehen, wenn man das eine mit den Massstäben des anderen misst, ein «Kategorienfehler».",
      "Besonders wehrt sich Latour gegen den «Doppelklick», die Illusion, Information komme ganz ohne Verarbeitung als fertige Wahrheit zu uns, so wie ein Klick sofort ein Ergebnis liefert. In Wahrheit hat jede Aussage einen Weg hinter sich, den man kennen sollte.",
      "Bei jeder KI-Ausgabe hilft darum die Frage, um welche Art von Aussage es sich handelt. Die sogenannte Halluzination der KI ist im Grunde ein Kategorienfehler. Ein Text, der wie eine Erzählung gebaut ist, wird für geprüftes Wissen gehalten. Wer sortiert und prüft, statt dem flüssigen Ton blind zu vertrauen, orientiert sich sicherer.",
    ],
    gegenwart:
      "Prüfe eine flüssige KI-Antwort mit drei Fragen. Gibt es überprüfbare Belege? Ist der Vorschlag praktisch brauchbar? Oder klingt er einfach nur gut? So ersetzt du Blindvertrauen durch gezieltes Sortieren und merkst, welche Art von Aussage vor dir liegt.",
    werk: "Bruno Latour, «Existenzweisen» (2012), und die Akteur-Netzwerk-Theorie",
  },
  {
    gruppe: "Wie umgehen mit der KI?",
    denker: "Armin Nassehi",
    leben: "geboren 1960",
    these: "Die KI nüchtern einordnen",
    icon: "pattern",
    absaetze: [
      "Armin Nassehi dreht die Frage um. Er fragt nicht, was die Digitalisierung mit uns macht, sondern für welches Problem sie eine Lösung ist. Seine Antwort: Unsere Gesellschaft ist seit langem in «Mustern» gebaut, in Statistiken, Zählungen und Datenspuren. Die KI erkennt diese Muster hervorragend, versteht aber keinen Sinn.",
      "Sein nüchterner Blick richtet sich gegen zwei Übertreibungen zugleich, die Dämonisierung der KI als übermächtige Über-Vernunft und ihre Verharmlosung als blosse Spielerei. Beides verstellt die Sicht. Wichtig ist ihm die Rollenteilung. Das Gerät schlägt vor, der Mensch entscheidet und verantwortet.",
      "Das nimmt der KI das Bedrohliche. Sie ist keine überlegene Über-Vernunft, sondern eine Maschine, die Muster rechnet. Wer versteht, wie sie arbeitet, verliert die Angst vor dem Mythos und gewinnt Urteilskraft zurück. Oft schätzt man danach das Menschliche neu.",
    ],
    gegenwart:
      "Ein Diagnosecomputer meldet einen Fehler am Fahrzeug. Die Fachperson entscheidet, ob sie dem Gerät folgt oder es überstimmt. Das Gerät erkennt das Muster, die Verantwortung für die Entscheidung bleibt beim Menschen.",
    werk: "Armin Nassehi, «Muster. Theorie der digitalen Gesellschaft» (2019)",
  },
  {
    gruppe: "Wie umgehen mit der KI?",
    denker: "Markus Gabriel",
    leben: "geboren 1980",
    these: "Die KI ist ein Spiegel, entscheiden musst du",
    icon: "balance",
    absaetze: [
      "Markus Gabriel nennt die KI einen «magischen Spiegel». Sie erkennt in unseren Daten Muster, auch unsere Werte und Gewohnheiten, manchmal genauer, als wir uns selbst kennen. Für ihn ist die eigentliche Revolution darum nicht technisch, sondern ethisch. Die KI zeigt, wer wir sind, aber was wir daraus machen, bleibt unsere Entscheidung.",
      "Gabriel wendet sich gegen die zwei Sackgassen der Debatte, alles aus Angst zu verbieten oder alles zu erlauben. Er schlägt einen «dritten Weg» vor, das Mitgestalten. Sein Begriff dafür ist «ethische Intelligenz», also klug mit der KI zu leben und dabei selbst moralisch besser zu werden.",
      "Damit dreht Gabriel die Angst um. Nicht die Maschine steht auf dem Prüfstand, sondern wir. Die KI beschreibt nur Muster, das Urteil über gut und gerecht fällen wir. So wird aus Ohnmacht eine handlungsfähige Haltung, denn wie er sagt, nicht die Maschine muss sich bewähren, sondern wir.",
    ],
    gegenwart:
      "Lass ein Sprachmodell einen kurzen eigenen Text auswerten, etwa einen Bewerbungssatz, mit der Frage, was er über dich verrät. Prüfe, ob das Spiegelbild stimmt. Und halte fest, dass die KI nur beschreibt, wer du sein willst, entscheidest du.",
    werk: "Markus Gabriel, «Ethische Intelligenz» (2026)",
  },
  {
    gruppe: "Wie umgehen mit der KI?",
    denker: "Donna Haraway",
    leben: "geboren 1944",
    these: "Wir sind längst verwoben",
    icon: "hub",
    absaetze: [
      "Donna Haraway sagt, Mensch und Maschine, Natur und Kultur sind nicht sauber getrennt. Wir sind längst miteinander verwoben, in gewissem Sinn schon «Cyborgs», also Mischwesen aus Mensch und Maschine. Statt der Technik als fremder Macht gegenüberzustehen, sollen wir lernen, verantwortlich mit ihr zu leben.",
      "Ihre Begriffe zielen alle auf dieses Miteinander. «Sympoiesis» heisst Mit-Machen, nichts entsteht allein, alles entsteht gemeinsam. «Mit dem Schlamassel bleiben» heisst, die Probleme auszuhalten und zu antworten, statt zu flüchten. Damit steht Haraway nahe bei Bruno Latour, den sie zu ihren Denkgefährten zählt. Sie teilt seine Absage an die strikte Trennung von Natur und Kultur, ergänzt sie aber um Fürsorge und Verantwortung.",
      "So nimmt Haraway zwei bequemen Fluchtreaktionen die Kraft, dem Glauben, die Technik richte es schon, und der Haltung, es sei ohnehin zu spät. Statt zu fragen, ob Mensch oder Maschine, fragt man, in welche Netze man mit dieser KI schon verwoben ist und wie man sie gut mitgestaltet.",
    ],
    gegenwart:
      "Du nutzt ein KI-Tool im Beruf. Statt zu denken, die Maschine macht das für mich, oder KI ist ohnehin Betrug, mach mit und bleib verantwortlich. Sieh, dass hinter der Antwort viele Menschen, Daten und Rechenzentren stecken, prüfe das Ergebnis und frag, wen dein Umgang damit betrifft.",
    werk: "Donna Haraway, «Unruhig bleiben» (2016) und «Ein Manifest für Cyborgs» (1985)",
  },
];

const GEW_PREFIX = "philosophische-perspektive:orientierung-hilft";
const GEW_STUFEN: [string, string, string] = ["kaum", "etwas", "stark"];

export default function Denkwege({
  spurKey,
  className = "",
}: {
  /** Spur-Präfix, z.B. "philosophische-perspektive:denkwege". */
  spurKey: string;
  className?: string;
}) {
  const gesamt = DENKWEGE.length;
  const [idx, setIdx] = useState(0);
  const [gesehen, setGesehen] = useState<Set<number>>(new Set());

  useEffect(() => {
    function restore() {
      const seen = leseSpurenIndices(spurKey).filter((i) => i >= 0 && i < gesamt);
      if (seen.length === 0) return;
      setGesehen((prev) => {
        const nx = new Set(prev);
        seen.forEach((i) => nx.add(i));
        return nx;
      });
    }
    restore();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [spurKey, gesamt]);

  useEffect(() => {
    DENKWEGE.forEach((d, i) => merkeInhalt(`${spurKey}:${i}`, `${d.denker}: ${d.these}`));
  }, [spurKey]);

  function geheZu(ziel: number) {
    const i = Math.max(0, Math.min(gesamt - 1, ziel));
    const neu = [idx, i].filter((n) => !gesehen.has(n));
    if (neu.length > 0) {
      neu.forEach((n) => merkeSpur(`${spurKey}:${n}`));
      setGesehen((prev) => {
        const nx = new Set(prev);
        neu.forEach((n) => nx.add(n));
        return nx;
      });
    }
    setIdx(i);
  }

  const d = DENKWEGE[idx];

  return (
    <section aria-label="Wege der Orientierung" className={className}>
      <div className="mb-md flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px] text-tertiary">
          {gesehen.size === gesamt ? "done_all" : "menu_book"}
        </span>
        {gesehen.size === 0
          ? `${gesamt} Denkwege, klick dich durch`
          : `${gesehen.size} von ${gesamt} Denkwegen angeschaut`}
      </div>

      <div className="rounded-2xl border border-outline-variant bg-surface-bright p-md sm:p-lg">
        <div className="flex flex-wrap items-center justify-between gap-sm">
          <span className="inline-flex items-center gap-xs rounded-full bg-tertiary-container/50 px-sm py-xs text-label-sm text-on-tertiary-container">
            {d.gruppe}
          </span>
          <span className="text-label-sm text-on-surface-variant">
            Denkweg {idx + 1} von {gesamt}
          </span>
        </div>

        <div className="mt-md flex items-start gap-md">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container">
            <span className="material-symbols-outlined text-[24px]">{d.icon}</span>
          </span>
          <div className="min-w-0">
            <p className="text-label-sm text-on-surface-variant">
              {d.denker} · {d.leben}
            </p>
            <h3 className="text-headline-sm text-on-surface">{d.these}</h3>
          </div>
        </div>

        {/* Fliesstext: Grundidee, wogegen, neue Begriffe («…»), Orientierung */}
        <div className="mt-md space-y-sm text-body-md leading-relaxed text-on-surface-variant">
          {d.absaetze.map((absatz, i) => (
            <p key={i}>{absatz}</p>
          ))}
        </div>

        {/* Die eine Box: Gegenwartsbezug */}
        <div className="mt-lg rounded-xl bg-tertiary-container/40 p-md sm:p-lg">
          <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-on-tertiary-container">
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            Gegenwartsbezug
          </p>
          <p className="mt-xs text-body-md leading-relaxed text-on-surface">{d.gegenwart}</p>
        </div>

        {/* Bewertung */}
        <GewichtungWahl
          className="mt-md border-t border-outline-variant pt-md"
          prefix={GEW_PREFIX}
          index={idx}
          frage="Wie sehr hilft dir dieser Zugang, dich zu orientieren?"
          stufen={GEW_STUFEN}
        />

        {/* Quelle */}
        <p className="mt-md flex items-start gap-xs text-label-sm text-on-surface-variant opacity-80">
          <span className="material-symbols-outlined text-[15px]">menu_book</span>
          <span className="min-w-0">{d.werk}</span>
        </p>

        {/* Navigation */}
        <div className="mt-lg flex items-center justify-between gap-sm">
          <button
            type="button"
            onClick={() => geheZu(idx - 1)}
            disabled={idx === 0}
            className="inline-flex items-center gap-xs rounded-full border border-outline-variant bg-surface-bright px-md py-xs text-label-md text-on-surface transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Zurück
          </button>
          <div className="flex flex-wrap items-center justify-center gap-xs">
            {DENKWEGE.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => geheZu(i)}
                aria-label={`Denkweg ${i + 1}`}
                className={
                  "h-2.5 rounded-full transition-all " +
                  (i === idx
                    ? "w-5 bg-tertiary"
                    : gesehen.has(i)
                      ? "w-2.5 bg-tertiary/50"
                      : "w-2.5 bg-outline-variant")
                }
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => geheZu(idx + 1)}
            disabled={idx === gesamt - 1}
            className="inline-flex items-center gap-xs rounded-full bg-tertiary px-md py-xs text-label-md text-on-tertiary transition hover:bg-on-tertiary-container disabled:cursor-not-allowed disabled:opacity-40"
          >
            Weiter
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
}
