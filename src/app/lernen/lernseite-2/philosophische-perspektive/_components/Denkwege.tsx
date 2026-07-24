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
import DenkerHover from "../../_components/DenkerHover";

/**
 * Denkwege — «Wege der Orientierung»: drei Bereiche, in denen die Philosophie
 * beim Umgang mit der KI hilft, als durchklickbare Slides. Jeder Bereich fasst
 * mehrere Denker:innen zusammen und fragt am Ende: Was hilft mir diese
 * Einordnung jetzt?
 *
 *  1. «Was ist der Mensch?» (Aristoteles, Arendt, Heidegger, Kant) — was uns im
 *     Kern ausmacht, unabhängig davon, ob eine KI es auch könnte. Vertrauen,
 *     dass diese Wesenszüge nicht verschwinden.
 *  2. «Netzwerke und Systeme» (Latour, Nassehi) — wie wir in komplexen
 *     Gesellschaften Orientierung gewinnen und verstehen, wieso vieles trotzdem
 *     funktioniert, obwohl niemand mehr das Ganze überblickt.
 *  3. «Transformation von Mensch und Maschine» (Latour, Haraway, Harari,
 *     Gabriel, Rosa) — dass sich Mensch und Maschine nicht sauber trennen
 *     lassen; Wege der Zusammenarbeit oder der bewussten Abgrenzung, mit
 *     Transhumanismus (religiöse und endzeitliche Muster als Gegenschablone).
 *
 * Jeder Bereich ist ein Fliesstext (mit den Begriffen in «Anführungszeichen»),
 * die Denker:innen als Hover mit Kurzbiografie, dazu eine Box «Was dir das jetzt
 * hilft» und eine Bewertung. Ein Bereich zählt als Aktivität, sobald man aktiv
 * navigiert (nicht beim Laden). Nur Theme-Tokens, Material Symbols.
 *
 * Inhaltlich fundiert auf den bereitgestellten Werken (Gabriel «Ethische
 * Intelligenz», Latour «Existenzweisen», Nassehi «Muster», Haraway «Unruhig
 * bleiben», Arendt «Vita activa») und guten öffentlichen Quellen (Aristoteles,
 * Kant, Heidegger, Harari, Rosa). Belege getrennt gepflegt.
 */

interface Denker {
  name: string;
  leben: string;
  /** Kurzbiografie für den Hover: Zeit, Leben, Werk und Bedeutung. */
  bio: string;
}

interface Bereich {
  /** Leitfrage als Titel. */
  titel: string;
  /** Eine Zeile: worum es in diesem Bereich geht. */
  leitfrage: string;
  icon: string;
  /** Die Denker:innen dieses Bereichs (Reihe mit Hover-Biografie). */
  denker: Denker[];
  /** Fliesstext: Grundidee, die Stimmen, neue Begriffe («…»). */
  absaetze: string[];
  /** Die eine Box: Was hilft mir diese Einordnung jetzt? */
  hilft: string;
  /** Quellenzeile (Werke). */
  werk: string;
}

const BEREICHE: Bereich[] = [
  {
    titel: "Was ist der Mensch?",
    leitfrage: "Was uns im Kern ausmacht, ganz unabhängig von der Maschine.",
    icon: "self_improvement",
    denker: [
      {
        name: "Aristoteles",
        leben: "384 bis 322 v. Chr.",
        bio: "Griechischer Philosoph, Schüler Platons. Er ordnete fast das ganze Wissen seiner Zeit und prägte das Denken über Natur, Ethik und Politik bis heute. Von ihm stammt der Satz, alle Menschen streben von Natur aus nach Wissen.",
      },
      {
        name: "Hannah Arendt",
        leben: "1906 bis 1975",
        bio: "Deutsch-amerikanische politische Philosophin. Floh als Jüdin vor den Nazis. Sie dachte über Handeln, Urteilen und Freiheit nach und prägte den Begriff der «Natalität»: Mit jedem Menschen kommt ein neuer Anfang in die Welt.",
      },
      {
        name: "Martin Heidegger",
        leben: "1889 bis 1976",
        bio: "Deutscher Philosoph, Hauptwerk «Sein und Zeit». Wegen seiner Nähe zum Nationalsozialismus umstritten; hier zählt sein Gedanke der «Sorge»: dass dem Menschen sein eigenes Leben nicht gleichgültig ist.",
      },
      {
        name: "Immanuel Kant",
        leben: "1724 bis 1804",
        bio: "Deutscher Philosoph aus Königsberg, einer der wirkmächtigsten überhaupt. Er stellte die Frage «Was ist der Mensch?» ins Zentrum und begründete die Freiheit und Würde des Menschen: Wer aus Vernunft handeln kann, trägt Verantwortung.",
      },
    ],
    absaetze: [
      "«Was ist der Mensch?» Diese Frage ist so alt wie die Philosophie selbst. Schon Aristoteles sah den Menschen als Wesen, das von Natur aus nach Wissen strebt, neugierig, fragend, nie ganz fertig. Immanuel Kant machte sie später zur Kernfrage überhaupt und gab eine Richtung vor: Der Mensch ist frei, er kann aus eigener Einsicht handeln, und darum trägt er Verantwortung. Es geht hier nicht darum, ob eine KI dasselbe auch könnte. Es geht darum, was uns in unserem Wesen ausmacht.",
      "Hannah Arendt nennt einen dieser Wesenszüge das Anfangen. Mit jedem Menschen kommt etwas Neues in die Welt, das aus dem Bisherigen nicht ableitbar ist. Und der Mensch urteilt, er hält inne und entscheidet selbst. Martin Heidegger fügt die «Sorge» hinzu: Dem Menschen ist sein eigenes Leben nicht gleichgültig, er kümmert sich, fragt nach Sinn, weiss um seine Endlichkeit. Anfangen, urteilen, sich sorgen, neugierig sein, Verantwortung übernehmen, das sind keine Aufgaben, die man abgibt. So sind wir.",
      "Was hilft dir diese Einordnung? Sie nimmt der Angst den Boden, die KI könnte das Menschliche verdrängen. Denn diese Züge sind nicht etwas, das wir bloss tun, sondern etwas, das wir sind. Wir können gar nicht anders, als anzufangen, zu urteilen und uns zu sorgen. Dafür braucht es am Ende ein Grundvertrauen: dass diese Wesenszüge nicht einfach verschwinden, nur weil eine Maschine gute Sätze schreibt. Sie bleiben, auch wenn sich vieles um uns verändert.",
    ],
    hilft:
      "Wenn dich die schnelle, kluge KI verunsichert, kehr zur Frage zurück, was dich als Mensch ausmacht. Anfangen, urteilen, sich sorgen, das bleibt deins, ganz gleich, wie gut die Maschine formuliert. Dieses Vertrauen in die eigenen Wesenszüge trägt durch den Wandel.",
    werk: "Aristoteles, «Metaphysik»; Immanuel Kant, «Logik» (1800); Hannah Arendt, «Vita activa»; Martin Heidegger, «Sein und Zeit» (1927)",
  },
  {
    titel: "Netzwerke und Systeme",
    leitfrage: "Wie wir Orientierung finden, wo niemand mehr das Ganze überblickt.",
    icon: "hub",
    denker: [
      {
        name: "Armin Nassehi",
        leben: "geboren 1960",
        bio: "Deutscher Soziologe, lehrt in München. Er deutet die moderne Gesellschaft als System von «Mustern» und fragt nüchtern, für welches Problem eine neue Technik eine Lösung ist. Wichtige Stimme der Gegenwartsdebatte.",
      },
      {
        name: "Bruno Latour",
        leben: "1947 bis 2022",
        bio: "Französischer Soziologe und Philosoph, weltweit einflussreich. Mitbegründer der Akteur-Netzwerk-Theorie: Wirkung entsteht nie allein, sondern im Netz aus Menschen und Dingen. Er untersuchte, wie Gesellschaft ihre Wahrheiten herstellt.",
      },
    ],
    absaetze: [
      "Moderne Gesellschaften sind unübersichtlich geworden. Niemand überblickt mehr das Ganze, nicht die Wirtschaft, nicht die Verwaltung, nicht die Technik. Aus dem Gefühl, den Überblick verloren zu haben, entsteht schnell Überforderung. Und doch funktioniert erstaunlich vieles: Der Zug fährt, der Lohn kommt, das Spital behandelt. Wie geht das zusammen? Hier helfen zwei Denker, die die Gesellschaft nicht bewerten, sondern erklären.",
      "Armin Nassehi sagt: Unsere Gesellschaft ist längst in «Mustern» gebaut, in Zahlen, Statistiken und Abläufen, die auch ohne einen einzelnen Überblick funktionieren. Kein Mensch muss das Ganze verstehen, damit es läuft, das System trägt sich über seine Muster. Die KI passt genau in diese Welt, denn sie erkennt Muster hervorragend, ohne ihren Sinn zu verstehen. Wer das begreift, sieht die KI nüchterner und weniger bedrohlich.",
      "Bruno Latour ergänzt: Nichts wirkt allein. Jede Handlung hängt an einem Netz aus Menschen, Geräten, Regeln und Gewohnheiten, er nennt es ein Netzwerk von «Akteuren», zu denen auch die Dinge gehören. Orientierung gewinnt man darum nicht, indem man alles überblickt, sondern indem man das eigene Netz kennt: Wovon hänge ich ab, wer und was wirkt hier mit mir zusammen?",
    ],
    hilft:
      "Wenn dich die Komplexität überfordert, musst du nicht das Ganze verstehen. Es reicht, dein Stück des Netzes zu kennen und zu sehen, welche Muster gerade wirken. Das gibt Boden unter den Füssen, auch wenn niemand mehr alles überblickt. Die Gesellschaft funktioniert nicht trotz, sondern wegen dieser verteilten Muster.",
    werk: "Armin Nassehi, «Muster. Theorie der digitalen Gesellschaft» (2019); Bruno Latour, «Existenzweisen» (2012) und die Akteur-Netzwerk-Theorie",
  },
  {
    titel: "Transformation von Mensch und Maschine",
    leitfrage: "Warum sich Mensch und Maschine nicht sauber trennen lassen.",
    icon: "handshake",
    denker: [
      {
        name: "Bruno Latour",
        leben: "1947 bis 2022",
        bio: "Französischer Soziologe und Philosoph. Mit der Akteur-Netzwerk-Theorie zeigte er, dass niemand allein handelt: Wir stecken immer in Abhängigkeiten von Menschen und Dingen. Das ganz freie, unabhängige Individuum ist eine Illusion.",
      },
      {
        name: "Donna Haraway",
        leben: "geboren 1944",
        bio: "US-amerikanische Wissenschaftshistorikerin und feministische Denkerin. Ihr «Manifest für Cyborgs» (1985) denkt Mensch, Tier und Maschine als verwoben. Sie fragt, wie wir verantwortlich mit Technik leben.",
      },
      {
        name: "Yuval Noah Harari",
        leben: "geboren 1976",
        bio: "Israelischer Historiker, mit «Eine kurze Geschichte der Menschheit» und «Homo Deus» weltbekannt. Er beschreibt, wie Menschheit und Technik sich gemeinsam verändern, und warnt zugleich vor blindem Fortschrittsglauben.",
      },
      {
        name: "Markus Gabriel",
        leben: "geboren 1980",
        bio: "Deutscher Philosoph, sehr jung Professor in Bonn. Bekannt für den «Neuen Realismus». In «Ethische Intelligenz» plädiert er dafür, die KI ethisch mitzugestalten, statt sie nur zu verbieten oder alles zu erlauben.",
      },
      {
        name: "Hartmut Rosa",
        leben: "geboren 1965",
        bio: "Deutscher Soziologe. Bekannt für seine Zeitdiagnose der «Beschleunigung» und den Begriff «Resonanz»: ein lebendiges Antwortverhältnis zur Welt, das mehr zählt als immer schnellere Kontrolle und Optimierung.",
      },
    ],
    absaetze: [
      "Mensch und Maschine lassen sich nicht mehr sauber auseinanderdividieren. Wir tippen, suchen, planen und entscheiden längst mit Geräten zusammen. Schon Bruno Latour zeigt, warum das kein neuer Sonderfall ist: Das ganz freie Individuum, das egoistisch nur tut, was es will, hat es nie gegeben. Wir stecken immer in Abhängigkeiten, von Menschen, Werkzeugen, Institutionen. Je klarer man sich diese Abhängigkeiten bewusst macht, desto verständlicher wird das eigene Tun und desto souveräner der Umgang damit.",
      "Was folgt daraus? Donna Haraway sagt, wir sind längst «verwoben», in gewissem Sinn schon Mischwesen aus Mensch und Maschine, und sollten das verantwortlich gestalten statt es zu leugnen. Yuval Noah Harari mahnt, dass diese Verschmelzung gewaltige Macht freisetzt und darum Regeln braucht. Markus Gabriel setzt auf «ethische Intelligenz», das kluge, moralische Mitgestalten. Und Hartmut Rosa erinnert daran, dass es nicht um immer mehr Kontrolle und Tempo geht, sondern um «Resonanz», ein lebendiges Verhältnis zur Welt. Zwei Wege zeichnen sich ab: sich auf die Zusammenarbeit einlassen oder den eigenen, menschlichen Weg umso deutlicher markieren, auch durch Regulation und Ethik.",
      "Am äussersten Rand steht der «Transhumanismus», die Idee, den Menschen durch Technik grenzenlos zu steigern, vielleicht sogar den Tod zu überwinden. Zum Einordnen helfen zwei ältere Muster als Gegenschablone. Zum einen die religiösen Heilsversprechen, denen der Transhumanismus verblüffend ähnelt, nur dass hier die Technik die Erlösung bringen soll. Zum anderen die endzeitlichen Untergangserzählungen, in denen die KI alles auslöscht. Beides, Erlösung wie Weltuntergang, sind grosse, alte Geschichten. Wer sie erkennt, fällt weder auf den Hype noch auf die Panik herein.",
    ],
    hilft:
      "Du musst dich nicht zwischen Verschmelzung und Verweigerung entscheiden. Es hilft schon, die eigenen Abhängigkeiten zu kennen und bewusst zu wählen, wo du mitmachst und wo du deinen eigenen Weg markierst. Zwischen dem Heilsversprechen «Technik rettet uns» und dem Untergang «KI zerstört uns» liegt der nüchterne Alltag, den Regeln und Ethik gestaltbar machen.",
    werk: "Donna Haraway, «Unruhig bleiben» (2016); Yuval Noah Harari, «Homo Deus»; Markus Gabriel, «Ethische Intelligenz»; Hartmut Rosa, «Resonanz» (2016); mit Bruno Latour, Akteur-Netzwerk-Theorie",
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
  const gesamt = BEREICHE.length;
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
    BEREICHE.forEach((b, i) => merkeInhalt(`${spurKey}:${i}`, b.titel));
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

  const b = BEREICHE[idx];

  return (
    <section aria-label="Wege der Orientierung" className={className}>
      <div className="mb-md flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px] text-tertiary">
          {gesehen.size === gesamt ? "done_all" : "explore"}
        </span>
        {gesehen.size === 0
          ? `${gesamt} Bereiche, klick dich durch`
          : `${gesehen.size} von ${gesamt} Bereichen angeschaut`}
      </div>

      <div className="rounded-2xl border border-outline-variant bg-surface-bright p-md sm:p-lg">
        <div className="flex flex-wrap items-center justify-between gap-sm">
          <span className="inline-flex items-center gap-xs rounded-full bg-tertiary-container/50 px-sm py-xs text-label-sm text-on-tertiary-container">
            Orientierung
          </span>
          <span className="text-label-sm text-on-surface-variant">
            Bereich {idx + 1} von {gesamt}
          </span>
        </div>

        <div className="mt-md flex items-start gap-md">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container">
            <span className="material-symbols-outlined text-[24px]">{b.icon}</span>
          </span>
          <div className="min-w-0">
            <h3 className="text-headline-sm text-on-surface">{b.titel}</h3>
            <p className="mt-xs text-body-sm text-on-surface-variant">{b.leitfrage}</p>
          </div>
        </div>

        {/* Die Denker:innen dieses Bereichs — Name mit Hover-Kurzbiografie */}
        <div className="mt-md flex flex-wrap items-center gap-x-md gap-y-xs border-y border-outline-variant/60 py-sm">
          <span className="text-label-sm uppercase tracking-wider text-tertiary">
            Stimmen
          </span>
          {b.denker.map((p) => (
            <span key={p.name} className="text-label-sm text-on-surface-variant">
              <DenkerHover name={p.name} bio={p.bio} />
              <span className="opacity-70"> · {p.leben}</span>
            </span>
          ))}
        </div>

        {/* Fliesstext: Grundidee, die Stimmen, neue Begriffe («…») */}
        <div className="mt-md space-y-sm text-body-md leading-relaxed text-on-surface-variant">
          {b.absaetze.map((absatz, i) => (
            <p key={i}>{absatz}</p>
          ))}
        </div>

        {/* Die eine Box: Was hilft mir diese Einordnung jetzt? */}
        <div className="mt-lg rounded-xl bg-tertiary-container/40 p-md sm:p-lg">
          <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-on-tertiary-container">
            <span className="material-symbols-outlined text-[18px]">explore</span>
            Was dir das jetzt hilft
          </p>
          <p className="mt-xs text-body-md leading-relaxed text-on-surface">{b.hilft}</p>
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
          <span className="min-w-0">{b.werk}</span>
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
            {BEREICHE.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => geheZu(i)}
                aria-label={`Bereich ${i + 1}`}
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
