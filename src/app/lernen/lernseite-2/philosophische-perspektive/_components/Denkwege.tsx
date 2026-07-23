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
 * Denkwege — «Wege der Orientierung»: acht philosophische Ansätze, die mit der
 * Verunsicherung durch die KI umgehen, als durchklickbare Slides. Zwei Fragen
 * gliedern sie: «Was ist der Mensch?» (Arendt, Heidegger, Sloterdijk, Hustvedt)
 * und «Wie umgehen mit der KI?» (Latour, Nassehi, Gabriel, Haraway). Jeder Slide
 * hat eine einfach erklärte Grundidee, einen Teil «Wie das Orientierung stärkt»,
 * ein Fallbeispiel, eine Quellenzeile und eine Bewertung.
 *
 * Inhaltlich fundiert auf den Originalwerken (Gabriel «Ethische Intelligenz»,
 * Latour «Existenzweisen», Nassehi «Muster», Hustvedt «Die Illusion der
 * Gewissheit», Arendt via von Redecker «Gravitation zum Guten») sowie guten
 * öffentlichen Quellen (Heidegger, Sloterdijk, Haraway). Belege getrennt gepflegt.
 *
 * Ein Slide zählt als Aktivität (Spur `…:denkwege:<i>`), sobald man aktiv
 * dorthin navigiert (nicht beim blossen Laden). Nur Theme-Tokens, Material Symbols.
 */

interface Denkweg {
  gruppe: string;
  denker: string;
  leben: string;
  these: string;
  icon: string;
  kern: string;
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
    these: "Selbst denken, nicht gedankenlos übernehmen",
    icon: "psychology",
    kern: "Hannah Arendt fragt, was uns als Menschen ausmacht, und findet es im Denken und Urteilen. Denken ist für sie der stille Dialog mit sich selbst. Urteilen heisst, eine Sache auch aus der Sicht anderer zu betrachten. Ihr Gegenbild ist die Gedankenlosigkeit, also in fertigen Floskeln zu leben, ohne zu prüfen.",
    orientierung: "Genau das darf man nicht an die Maschine abgeben. Eine KI liefert flüssige, plausible Sätze, also gerade das, was Gedankenlosigkeit ausmacht. Menschlich bleibt, wer innehält, das Ergebnis prüft und selbst urteilt, statt es einfach zu übernehmen. Und der Mensch kann immer wieder neu anfangen.",
    beispiel: "Lass die KI eine heikle Kundenmail schreiben. Markiere zuerst die Floskeln, die gut klingen, aber nichts sagen. Beurteile den Text dann aus Sicht der Kundin neu und frag dich, ob du wirklich dahinterstehst.",
    werk: "nach Eva von Redecker, «Gravitation zum Guten» (2013), zu Hannah Arendt",
  },
  {
    gruppe: "Was ist der Mensch?",
    denker: "Martin Heidegger",
    leben: "1889 bis 1976",
    these: "Dem Menschen geht es um etwas: die Sorge",
    icon: "favorite",
    kern: "Martin Heidegger fragt, was das menschliche Dasein ausmacht, und nennt es die Sorge. Gemeint ist nicht die Alltagssorge, sondern dass dem Menschen sein eigenes Leben nicht gleichgültig ist. Wir kümmern uns, fragen nach Sinn und wissen um unsere Endlichkeit. Eine Maschine rechnet, aber ihr ist nichts wichtig.",
    orientierung: "Später warnt Heidegger, die Technik verleite uns, alles nur noch als nutzbaren Vorrat zu sehen, auch den Menschen. Sein Rat ist eine freie Beziehung zur Technik. Wir sollen sie nutzen, ohne uns von ihr bestimmen zu lassen, gelassen und fragend statt ängstlich oder hörig.",
    beispiel: "Ein Pflegeteam lässt die KI den Dienstplan berechnen, das spart Zeit. Die Sorge um die Patientinnen und Patienten aber bleibt beim Menschen. Frei mit der Technik umgehen heisst hier, das Werkzeug zu nutzen, ohne den Menschen zum blossen Datenpunkt zu machen.",
    werk: "Martin Heidegger, «Sein und Zeit» (1927) und «Die Frage nach der Technik» (1954)",
  },
  {
    gruppe: "Was ist der Mensch?",
    denker: "Peter Sloterdijk",
    leben: "geboren 1947",
    these: "Der Mensch bildet sich durch Übung",
    icon: "self_improvement",
    kern: "Peter Sloterdijk beschreibt den Menschen als übendes Wesen. Wir werden, wer wir sind, durch Übung, Wiederholung und Selbstformung. Wer ein Instrument spielt, eine Sprache lernt oder ein Handwerk beherrscht, hat lange geübt. Sein Buchtitel «Du musst dein Leben ändern» ruft dazu auf, an sich zu arbeiten.",
    orientierung: "Gegenüber der KI liegt die menschliche Aufgabe im Üben und Sich-Bilden. Eine Maschine kann eine Aufgabe für uns erledigen, aber nicht für uns üben. Wer alles abgibt, verlernt es. Wer weiter übt, versteht, was die KI tut, bleibt fähig und kann sie prüfen.",
    beispiel: "Die KI löst eine Rechnung oder übersetzt einen Text in Sekunden. Übe die Grundfertigkeit trotzdem selbst. Nur so merkst du, wenn die KI danebenliegt, und bleibst Herr über das Ergebnis.",
    werk: "Peter Sloterdijk, «Du musst dein Leben ändern» (2009)",
  },
  {
    gruppe: "Was ist der Mensch?",
    denker: "Siri Hustvedt",
    leben: "geboren 1955",
    these: "Der Geist ist kein Computer",
    icon: "accessibility_new",
    kern: "Siri Hustvedt zeigt, dass sich der menschliche Geist nicht auf einen Computer im Gehirn reduzieren lässt. Denken und Fühlen hängen am lebendigen Körper und an gelebter Erfahrung. Eine KI kann Sprache und Gefühle täuschend echt nachahmen. Aber sie erlebt nichts, denn wie Hustvedt sagt, Maschinen machen keine Erfahrungen.",
    orientierung: "Das gibt ein einfaches Unterscheidungswerkzeug. Die KI simuliert, sie tut nur so als ob, sie erfährt nicht. Hustvedt setzt zudem auf den Zweifel. Statt in Hype oder Panik zu verfallen, soll man gut fragen und mehrere Sichtweisen einnehmen, damit man das Modell nicht mit der Wirklichkeit verwechselt.",
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
    orientierung: "Gabriel dreht die Angst um. Nicht die Maschine steht auf dem Prüfstand, sondern wir. Er schlägt einen dritten Weg vor, weder alles verbieten noch alles erlauben, sondern mitgestalten. Die KI beschreibt nur Muster, das Urteil über gut und gerecht fällen wir. So wird aus Ohnmacht eine handlungsfähige Haltung.",
    beispiel: "Lass ein Sprachmodell einen kurzen eigenen Text auswerten, etwa einen Bewerbungssatz, mit der Frage, was das über dich verrät. Prüfe, ob das Spiegelbild stimmt. Und halte fest, dass die KI nur beschreibt, wer du sein willst, entscheidest du.",
    werk: "Markus Gabriel, «Ethische Intelligenz» (2026)",
  },
  {
    gruppe: "Wie umgehen mit der KI?",
    denker: "Donna Haraway",
    leben: "geboren 1944",
    these: "Wir sind längst Hybride",
    icon: "hub",
    kern: "Donna Haraway sagt, die Grenze zwischen Mensch und Maschine ist längst durchlässig. Wir leben so eng mit Technik verflochten, dass wir in gewissem Sinn schon Cyborgs sind, also Mischwesen aus Mensch und Maschine. Statt Mensch gegen Maschine denkt sie in Verbindungen.",
    orientierung: "Ihr Rat ist, mit dem Schlamassel zu bleiben. Das heisst, nicht in grosse Heilsversprechen oder in den Weltuntergang zu flüchten, sondern mitten im Geflecht verantwortlich zu handeln und gute Verbindungen zu knüpfen. Orientierung heisst hier, Verantwortung im Netz zu übernehmen, statt nur eine saubere Grenze zu ziehen.",
    beispiel: "In einem Projekt wirken Mensch, KI, Daten und Geräte zusammen. Frag nicht nur, ob Mensch oder Maschine, sondern wer wofür die Verantwortung trägt und wie ihr das Zusammenspiel gut gestaltet.",
    werk: "Donna Haraway, «Ein Manifest für Cyborgs» (1985) und «Unruhig bleiben» (2016)",
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

  // Bereits gesehene Slides (für die Fortschrittspunkte) wiederherstellen.
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

  // Alle Titel registrieren (auch ungesehene) — für die Knotenkarte im Orakel.
  useEffect(() => {
    DENKWEGE.forEach((d, i) => merkeInhalt(`${spurKey}:${i}`, `${d.denker}: ${d.these}`));
  }, [spurKey]);

  // Aktiv angesteuerter Slide zählt als Aktivität (nicht beim Laden der Seite).
  // Auch der eben gelesene Slide, den man verlässt, wird registriert.
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

        <p className="mt-md text-body-md leading-relaxed text-on-surface-variant">{d.kern}</p>

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
