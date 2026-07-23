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
 * umgehen mit der KI?» (Latour, Nassehi, Gabriel, Haraway). Jeder Slide zeigt
 * Grundidee, wogegen sich der Ansatz richtet, welche neuen Begriffe er vorschlägt,
 * wie er Orientierung stärkt, ein Fallbeispiel, die Quelle und eine Bewertung.
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

interface Begriff {
  wort: string;
  kurz: string;
}
interface Denkweg {
  gruppe: string;
  denker: string;
  leben: string;
  these: string;
  icon: string;
  kern: string;
  /** Wogegen sich der Ansatz richtet, welches Problem er angeht. */
  problem: string;
  /** Neue Begriffe, die der Ansatz vorschlägt. */
  begriffe: Begriff[];
  /** Wie dieser Ansatz Orientierung stärkt. */
  orientierung: string;
  beispiel: string;
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
    kern: "Hannah Arendt gibt zwei Antworten darauf, was den Menschen ausmacht. Erstens ist der Mensch ein Anfang. Mit jeder Geburt kommt jemand Neues in die Welt, der etwas beginnen kann, das nicht aus dem Bisherigen folgt. Zweitens machen den Menschen das Denken und Urteilen aus, der stille Dialog mit sich selbst und der Blick aus der Sicht anderer.",
    problem: "Gegen die Gedankenlosigkeit, also das Leben in fertigen Floskeln, ohne selbst zu prüfen. Am Fall Eichmann zeigt Arendt, wie gefährlich es wird, wenn Menschen nicht mehr selbst denken.",
    begriffe: [
      { wort: "Natalität", kurz: "die Fähigkeit, mit der Geburt Neues anzufangen (Arendts späterer Begriff, mit Wurzeln in ihrer Arbeit über Augustinus)" },
      { wort: "Gedankenlosigkeit", kurz: "in fertigen Klischees leben, ohne zu prüfen" },
      { wort: "erweiterte Denkungsart", kurz: "urteilen, indem man eine Sache aus der Sicht anderer betrachtet" },
    ],
    orientierung: "Beides darf man nicht an die Maschine abgeben. Eine KI rechnet aus Vergangenem fort und liefert flüssige Floskeln, also genau das, was Arendt Gedankenlosigkeit nannte. Menschlich bleibt, wer innehält, prüft, selbst urteilt und Neues beginnt, das aus den Daten nicht folgt.",
    beispiel: "Lass die KI eine heikle Kundenmail schreiben. Markiere zuerst die Floskeln, die gut klingen, aber nichts sagen. Beurteile den Text dann aus Sicht der Kundin neu und frag dich, ob du wirklich dahinterstehst.",
    werk: "nach Eva von Redecker, «Gravitation zum Guten» (2013); Wurzeln in Arendt, «Der Liebesbegriff bei Augustin» (1929)",
  },
  {
    gruppe: "Was ist der Mensch?",
    denker: "Martin Heidegger",
    leben: "1889 bis 1976",
    these: "Dem Menschen geht es um etwas: die Sorge",
    icon: "favorite",
    kern: "Martin Heidegger fragt, was das menschliche Dasein ausmacht, und nennt es die Sorge. Gemeint ist nicht die Alltagssorge, sondern dass dem Menschen sein eigenes Leben nicht gleichgültig ist. Wir kümmern uns, fragen nach Sinn und wissen um unsere Endlichkeit. Eine Maschine rechnet, aber ihr ist nichts wichtig.",
    problem: "Gegen die Gefahr, dass die Technik uns dazu verleitet, alles und jeden nur noch als nutzbaren Vorrat und als blosse Daten zu sehen.",
    begriffe: [
      { wort: "Sorge", kurz: "das Grundmerkmal des Menschen, dass ihm sein Dasein nicht gleichgültig ist" },
      { wort: "Gestell", kurz: "die Denkweise, die alles nur noch als nutzbaren Vorrat betrachtet" },
      { wort: "Gelassenheit", kurz: "eine freie Beziehung zur Technik, sie nutzen, ohne ihr hörig zu sein" },
    ],
    orientierung: "Heideggers Rat ist eine freie Beziehung zur Technik. Wir sollen sie nutzen, ohne uns von ihr bestimmen zu lassen, gelassen und fragend statt ängstlich oder hörig. Und wir sollen das Sich-Sorgen nicht verlernen, denn das kann keine Maschine für uns übernehmen.",
    beispiel: "Ein Pflegeteam lässt die KI den Dienstplan berechnen, das spart Zeit. Die Sorge um die Patientinnen und Patienten bleibt aber beim Menschen. Frei mit der Technik umgehen heisst hier, das Werkzeug zu nutzen, ohne den Menschen zum blossen Datenpunkt zu machen.",
    werk: "Martin Heidegger, «Sein und Zeit» (1927) und «Die Frage nach der Technik» (1954)",
  },
  {
    gruppe: "Was ist der Mensch?",
    denker: "Peter Sloterdijk",
    leben: "geboren 1947",
    these: "Der Mensch bildet sich durch Übung",
    icon: "self_improvement",
    kern: "Peter Sloterdijk beschreibt den Menschen als übendes Wesen. Wir werden, wer wir sind, durch Übung, Wiederholung und Selbstformung. Er nennt den Menschen das Lebewesen, das aus der Wiederholung entsteht. «Du musst dein Leben ändern» ist für ihn der Grundton, sich immer wieder in Form zu bringen.",
    problem: "Gegen die Bequemlichkeit, Fähigkeiten ganz an die Technik abzugeben. Wer nicht mehr übt, verlernt und wird unselbständig.",
    begriffe: [
      { wort: "Anthropotechnik", kurz: "die Übungen und Verfahren, mit denen Menschen an sich selbst arbeiten" },
      { wort: "übendes Leben", kurz: "der Mensch entsteht aus Wiederholung und Übung" },
      { wort: "Immunsystem und Sphäre", kurz: "wir bauen gemeinsame schützende Räume, in denen wir leben (aus seiner Sphären-Idee)" },
    ],
    orientierung: "Gegenüber der KI liegt die menschliche Aufgabe im Üben und Sich-Bilden. Eine Maschine kann eine Aufgabe für uns erledigen, aber nicht für uns üben. Wer weiter übt, versteht, was die KI tut, bleibt fähig und kann sie prüfen. Der heutige, wie Sloterdijk sagt, konfuse Mensch muss sich neu orientieren, und das gelingt durch Übung.",
    beispiel: "Die KI löst eine Rechnung oder übersetzt einen Text in Sekunden. Übe die Grundfertigkeit trotzdem selbst. Nur so merkst du, wenn die KI danebenliegt, und bleibst Herr über das Ergebnis.",
    werk: "Peter Sloterdijk, «Du musst dein Leben ändern» (2009) und «Philosophische Temperamente» (2009)",
  },
  {
    gruppe: "Was ist der Mensch?",
    denker: "Siri Hustvedt",
    leben: "geboren 1955",
    these: "Der Geist ist kein Computer",
    icon: "accessibility_new",
    kern: "Siri Hustvedt zeigt, dass sich der menschliche Geist nicht auf einen Computer im Gehirn reduzieren lässt. Denken und Fühlen hängen am lebendigen Körper und an gelebter Erfahrung. Eine KI kann Sprache und Gefühle täuschend echt nachahmen. Aber sie erlebt nichts, denn wie Hustvedt sagt, Maschinen machen keine Erfahrungen.",
    problem: "Gegen den verbreiteten Vergleich, das Gehirn sei ein Computer, und gegen die falsche Gewissheit, wir wüssten genau, wie der Geist funktioniert.",
    begriffe: [
      { wort: "verkörperter Geist", kurz: "Denken und Fühlen hängen am lebendigen Körper, nicht nur am Rechnen" },
      { wort: "simulieren statt erleben", kurz: "die KI tut nur so als ob, sie erfährt nichts" },
      { wort: "produktiver Zweifel", kurz: "gut fragen und mehrere Sichtweisen einnehmen, statt falscher Gewissheit" },
    ],
    orientierung: "Das gibt ein einfaches Unterscheidungswerkzeug. Die KI simuliert, sie tut nur so als ob, sie erfährt nicht. Und Hustvedt setzt auf den Zweifel. Statt in Hype oder Panik zu verfallen, soll man gut fragen und mehrere Sichtweisen einnehmen, damit man das Modell nicht mit der Wirklichkeit verwechselt.",
    beispiel: "Lass die KI einen tröstenden Text an eine Kollegin schreiben, die eine Prüfung nicht bestanden hat. Vergleiche ihn mit einem selbst geschriebenen. Der KI-Text klingt oft passend, aber die KI war nie nervös und hat nie versagt.",
    werk: "Siri Hustvedt, «Die Illusion der Gewissheit» (2018)",
  },
  {
    gruppe: "Wie umgehen mit der KI?",
    denker: "Bruno Latour",
    leben: "1947 bis 2022",
    these: "Nicht alles ist auf dieselbe Art wahr",
    icon: "category",
    kern: "Bruno Latour sagt, es gibt nicht nur eine Art, wahr zu sein. Wissenschaft, Technik, Recht und Erzählung haben je eigene Regeln dafür, was als gelungen gilt. Viele Verunsicherungen entstehen, wenn man das eine mit den Massstäben des anderen misst.",
    problem: "Gegen den Doppelklick, die Illusion, Information komme ohne Verarbeitung als fertige Wahrheit. Und gegen die Verwechslung, alles am selben Massstab zu messen.",
    begriffe: [
      { wort: "Existenzweisen", kurz: "verschiedene Arten, wahr zu sein, je mit eigenen Regeln" },
      { wort: "Kategorienfehler", kurz: "etwas nach den Regeln der falschen Art beurteilen" },
      { wort: "Doppelklick", kurz: "die Illusion, Information komme ohne Verarbeitung als fertige Wahrheit" },
    ],
    orientierung: "Bei jeder KI-Ausgabe hilft die Frage, um welche Art von Aussage es sich handelt. Die sogenannte Halluzination der KI ist im Grunde eine Verwechslung, denn ein Text, der wie eine Erzählung gebaut ist, wird für geprüftes Wissen gehalten. Wer sortiert und prüft, statt dem flüssigen Ton blind zu vertrauen, orientiert sich sicherer.",
    beispiel: "Prüfe eine flüssige KI-Antwort mit drei Brillen. Gibt es überprüfbare Belege? Ist der Vorschlag praktisch brauchbar? Oder klingt er einfach nur gut? So ersetzt du Blindvertrauen durch gezieltes Prüfen.",
    werk: "Bruno Latour, «Existenzweisen» (2012), und die Akteur-Netzwerk-Theorie",
  },
  {
    gruppe: "Wie umgehen mit der KI?",
    denker: "Armin Nassehi",
    leben: "geboren 1960",
    these: "Die KI nüchtern einordnen",
    icon: "pattern",
    kern: "Armin Nassehi dreht die Frage um. Er fragt nicht, was die Digitalisierung mit uns macht, sondern für welches Problem sie eine Lösung ist. Seine Antwort: Unsere Gesellschaft ist seit langem in Mustern gebaut, in Statistiken, Zählungen und Datenspuren. Die KI erkennt diese Muster, versteht aber keinen Sinn.",
    problem: "Gegen die Dämonisierung der KI als übermächtige Über-Vernunft, aber auch gegen ihre Verharmlosung. Beides verstellt den nüchternen Blick.",
    begriffe: [
      { wort: "Muster", kurz: "Regelmässigkeiten in Daten, die die KI erkennt, ohne ihren Sinn zu verstehen" },
      { wort: "doppelte Kontingenz", kurz: "das Gerät schlägt vor, der Mensch entscheidet und verantwortet" },
      { wort: "situierte Urteilskraft", kurz: "menschliches Urteilen ist an Körper, Lage und Erfahrung gebunden" },
    ],
    orientierung: "Das nimmt der KI das Bedrohliche. Sie ist keine überlegene Über-Vernunft, sondern eine Maschine, die rechnet. Wer versteht, wie sie funktioniert, verliert die Angst vor dem Mythos und gewinnt Urteilskraft. Oft schätzt man danach das Menschliche neu.",
    beispiel: "Ein Diagnosecomputer meldet einen Fehler am Fahrzeug. Die Fachperson entscheidet, ob sie dem Gerät folgt oder es überstimmt. Das Gerät schlägt vor, der Mensch verantwortet.",
    werk: "Armin Nassehi, «Muster. Theorie der digitalen Gesellschaft» (2019)",
  },
  {
    gruppe: "Wie umgehen mit der KI?",
    denker: "Markus Gabriel",
    leben: "geboren 1980",
    these: "Die KI ist ein Spiegel, entscheiden musst du",
    icon: "balance",
    kern: "Markus Gabriel nennt die KI einen magischen Spiegel. Sie erkennt in unseren Daten Muster, auch unsere Werte und Gewohnheiten, manchmal genauer, als wir uns selbst kennen. Für ihn ist die eigentliche Revolution darum nicht technisch, sondern ethisch. Die KI zeigt, wer wir sind, aber was wir daraus machen, bleibt unsere Entscheidung.",
    problem: "Gegen die zwei Sackgassen der KI-Debatte, alles aus Angst zu verbieten oder alles zu erlauben. Und gegen das Gefühl, der Entwicklung ohnmächtig ausgeliefert zu sein.",
    begriffe: [
      { wort: "magischer Spiegel", kurz: "die KI spiegelt uns unsere Werte und blinden Flecken zurück" },
      { wort: "Ethische Intelligenz", kurz: "klug mit der KI leben und dabei selbst moralisch besser werden" },
      { wort: "dritter Weg", kurz: "weder alles verbieten noch alles erlauben, sondern mitgestalten" },
    ],
    orientierung: "Gabriel dreht die Angst um. Nicht die Maschine steht auf dem Prüfstand, sondern wir. Die KI beschreibt nur Muster, das Urteil über gut und gerecht fällen wir. So wird aus Ohnmacht eine handlungsfähige Haltung, denn wie er sagt, nicht die Maschine muss sich bewähren, sondern wir.",
    beispiel: "Lass ein Sprachmodell einen kurzen eigenen Text auswerten, etwa einen Bewerbungssatz, mit der Frage, was das über dich verrät. Prüfe, ob das Spiegelbild stimmt. Und halte fest, dass die KI nur beschreibt, wer du sein willst, entscheidest du.",
    werk: "Markus Gabriel, «Ethische Intelligenz» (2026)",
  },
  {
    gruppe: "Wie umgehen mit der KI?",
    denker: "Donna Haraway",
    leben: "geboren 1944",
    these: "Wir sind längst verwoben",
    icon: "hub",
    kern: "Donna Haraway sagt, Mensch und Maschine, Natur und Kultur sind nicht sauber getrennt. Wir sind längst miteinander verwoben, in gewissem Sinn schon Cyborgs, also Mischwesen aus Mensch und Maschine. Statt der Technik als fremder Macht gegenüberzustehen, sollen wir lernen, verantwortlich mit ihr zu leben.",
    problem: "Gegen die strikte Trennung von Mensch und Maschine und gegen zwei bequeme Fluchtreaktionen zugleich, den Glauben, die Technik richte es schon, und die Haltung, es sei ohnehin zu spät.",
    begriffe: [
      { wort: "Cyborg", kurz: "Mischwesen aus Mensch und Maschine, die Grenze ist längst durchlässig" },
      { wort: "Gefährten", kurz: "wir existieren nur in Beziehungen, auch technische Gegenüber sind Partner" },
      { wort: "Sympoiesis", kurz: "Mit-Machen, nichts macht sich selbst, alles entsteht gemeinsam" },
      { wort: "mit dem Schlamassel bleiben", kurz: "die Probleme aushalten und antworten, statt zu flüchten" },
    ],
    orientierung: "Das nimmt den zwei lähmenden Extremen die Kraft, dem Hype «die KI löst alles» wie der Panik «die KI ist das Ende». Statt zu fragen, ob Mensch oder Maschine, fragt man, in welche Netze man mit dieser KI schon verwoben ist und wie man das gut mitgestaltet. Damit steht Haraway nahe bei Bruno Latour, den sie zu ihren Gefährten im Denken zählt, ergänzt ihn aber um Fürsorge und Verantwortung.",
    beispiel: "Du nutzt ein KI-Tool im Beruf. Statt zu denken, die Maschine macht es für mich, oder KI ist Betrug, mach mit und bleib verantwortlich. Sieh, dass hinter der Antwort viele Menschen, Daten und Rechenzentren stecken, prüfe das Ergebnis und frag, wen dein Umgang betrifft.",
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

        {/* Grundidee */}
        <p className="mt-md flex items-center gap-xs text-label-sm uppercase tracking-wider text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px]">key</span>
          Grundidee
        </p>
        <p className="mt-xs text-body-md leading-relaxed text-on-surface-variant">{d.kern}</p>

        {/* Wogegen es sich richtet */}
        <div className="mt-md rounded-xl border border-outline-variant bg-surface-container-low p-sm sm:p-md">
          <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">block</span>
            Wogegen es sich richtet
          </p>
          <p className="mt-xs text-body-md leading-relaxed text-on-surface-variant">{d.problem}</p>
        </div>

        {/* Neue Begriffe */}
        <div className="mt-md">
          <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-tertiary">
            <span className="material-symbols-outlined text-[16px]">sell</span>
            Neue Begriffe
          </p>
          <ul className="mt-xs space-y-xs">
            {d.begriffe.map((b) => (
              <li key={b.wort} className="text-body-md leading-relaxed text-on-surface-variant">
                <span className="font-medium text-on-surface">{b.wort}</span>: {b.kurz}
              </li>
            ))}
          </ul>
        </div>

        {/* Wie das Orientierung stärkt */}
        <div className="mt-md rounded-xl border-l-4 border-tertiary bg-surface-container-low p-sm sm:p-md">
          <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-tertiary">
            <span className="material-symbols-outlined text-[16px]">explore</span>
            Wie das Orientierung stärkt
          </p>
          <p className="mt-xs text-body-md leading-relaxed text-on-surface-variant">
            {d.orientierung}
          </p>
        </div>

        {/* Fallbeispiel */}
        <div className="mt-md rounded-xl border border-outline-variant bg-surface-container-low p-sm sm:p-md">
          <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-tertiary">
            <span className="material-symbols-outlined text-[16px]">lightbulb</span>
            Fallbeispiel
          </p>
          <p className="mt-xs text-body-md leading-relaxed text-on-surface-variant">
            {d.beispiel}
          </p>
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
