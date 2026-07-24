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
 * Denkwege — «Wege der Orientierung»: vier Bereiche, in denen die Philosophie
 * beim Umgang mit der KI hilft, als durchklickbare Slides. Jeder Bereich fasst
 * mehrere Denker:innen zusammen, fragt am Ende «Was hilft mir das jetzt?» und
 * bietet pro Person eine aufklappbare Box mit konkreten Infos zur Philosophie.
 *
 *  1. «Was ist der Mensch?» (Aristoteles, Kant, Hegel, Arendt, Heidegger,
 *     Sloterdijk, Hustvedt) — was uns im Kern ausmacht, unabhängig davon, ob
 *     eine KI es auch könnte. Vertrauen, dass diese Wesenszüge bleiben.
 *  2. «Netzwerke und Systeme» (Nassehi, Latour) — Orientierung in komplexen
 *     Gesellschaften, in denen vieles funktioniert, obwohl niemand das Ganze
 *     überblickt.
 *  3. «Transformation von Mensch und Maschine» (Latour, Deguchi, Haraway,
 *     Harari, Gabriel) — Mensch und Maschine sind nicht trennbar; Deguchis
 *     japanischer «We-Turn» (Selbst als Wir, ostasiatisch verwurzelt);
 *     Zusammenarbeit oder bewusste Abgrenzung durch Regulation und Ethik;
 *     Transhumanismus mit religiösen und endzeitlichen Mustern als Gegenschablone.
 *  4. «Lebenskunst» (Stoiker, Foucault, Schmid, Nussbaum, Merleau-Ponty, Rosa) —
 *     das Leben ändern, ja, aber wie? Übung («Askesis»), kleine Schritte,
 *     Ästhetik und Resonanz statt Zwang.
 *
 * Ein Bereich zählt als Aktivität, sobald man aktiv navigiert (nicht beim
 * Laden). Die Info-Boxen sind reine Erklärhilfen (kein Tracking). Inhaltlich
 * fundiert auf den bereitgestellten Werken und guten öffentlichen Quellen; für
 * die Lebenskunst u.a. Wilhelm Schmid. Belege getrennt gepflegt. Nur
 * Theme-Tokens, Material Symbols.
 */

interface Denker {
  name: string;
  leben: string;
  /** Eine Zeile, immer sichtbar (neben den Lebensdaten). */
  these: string;
  /** Konkrete Infos zur Philosophie, aufklappbar. */
  info: string;
}

interface Bereich {
  /** Leitfrage als Titel. */
  titel: string;
  /** Eine Zeile: worum es in diesem Bereich geht. */
  leitfrage: string;
  icon: string;
  /** Die Denker:innen dieses Bereichs (je eine aufklappbare Info-Box). */
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
    icon: "psychology",
    denker: [
      {
        name: "Aristoteles",
        leben: "384 bis 322 v. Chr.",
        these: "Der Mensch strebt von Natur aus nach Wissen.",
        info: "In seiner «Metaphysik» beginnt Aristoteles mit dem Satz, alle Menschen strebten von Natur aus nach Wissen. Neugier ist für ihn kein Zufall, sondern Wesenszug: Der Mensch will verstehen und fragt nach dem Warum, nicht nur nach dem Was.",
      },
      {
        name: "Immanuel Kant",
        leben: "1724 bis 1804",
        these: "Frei und darum verantwortlich.",
        info: "Kant bündelte die Philosophie in vier Fragen; die letzte lautet «Was ist der Mensch?». Seine Antwort: Der Mensch kann aus Vernunft handeln, nicht bloss Trieben folgen. Diese Freiheit macht ihn verantwortlich. Eine Maschine folgt Regeln, sie verantwortet nichts.",
      },
      {
        name: "Georg Wilhelm Friedrich Hegel",
        leben: "1770 bis 1831",
        these: "Denken heisst unterscheiden.",
        info: "Für Hegel entfaltet sich der «Geist» durch Unterscheiden: Wir halten Gegensätze auseinander, was ist und was sein soll, und bringen sie in Bewegung. Erst dadurch können wir urteilen und uns entscheiden. So bekommt gerade das Unterscheiden und Entscheiden eine zutiefst menschliche Seite. (Hauptwerk: «Phänomenologie des Geistes», 1807.)",
      },
      {
        name: "Hannah Arendt",
        leben: "1906 bis 1975",
        these: "Der Mensch kann neu anfangen.",
        info: "Arendt prägte den Begriff «Natalität»: Mit jedem Menschen kommt ein neuer Anfang in die Welt, der aus dem Bisherigen nicht ableitbar ist. Dazu das Urteilen, das Innehalten und selbst Entscheiden. Eine KI schreibt das Wahrscheinliche fort, anfangen und urteilen kann sie nicht. (Werk: «Vita activa».)",
      },
      {
        name: "Martin Heidegger",
        leben: "1889 bis 1976",
        these: "Dem Menschen ist sein Leben nicht gleichgültig.",
        info: "Heidegger nennt den Grundzug des Menschen «Sorge»: Uns geht es um unser Leben, wir fragen nach Sinn und wissen um unsere Endlichkeit. Einer Maschine ist nichts wichtig, ihr geht es um nichts. (Hauptwerk: «Sein und Zeit», 1927.)",
      },
      {
        name: "Peter Sloterdijk",
        leben: "geboren 1947",
        these: "Der Mensch ist ein übendes Wesen.",
        info: "Sloterdijk beschreibt den Menschen als Wesen, das sich durch Übung und Wiederholung selbst formt («Anthropotechnik»). «Du musst dein Leben ändern» ist bei ihm kein Befehl, sondern der Grundton ständiger Selbstformung. Niemand kann für uns üben, auch keine Maschine. (Werk: «Du musst dein Leben ändern», 2009.)",
      },
      {
        name: "Siri Hustvedt",
        leben: "geboren 1955",
        these: "Der Geist ist kein Computer.",
        info: "Hustvedt zeigt, dass Denken und Fühlen am lebendigen Körper und an gelebter Erfahrung hängen, sie spricht vom «verkörperten Geist». Eine KI kann Gefühle täuschend echt nachahmen, aber sie erlebt nichts, sie macht keine Erfahrungen. (Werk: «Die Illusion der Gewissheit», 2018.)",
      },
    ],
    absaetze: [
      "«Was ist der Mensch?» Diese Frage ist so alt wie die Philosophie selbst. Schon Aristoteles sah den Menschen als Wesen, das von Natur aus nach Wissen strebt, neugierig, fragend, nie ganz fertig. Immanuel Kant machte die Frage zur Kernfrage überhaupt und gab eine Richtung vor: Der Mensch ist frei, er kann aus eigener Einsicht handeln, und darum trägt er Verantwortung. Georg Wilhelm Friedrich Hegel fügt hinzu, dass der Mensch ein Wesen ist, das unterscheidet. Erst indem wir Gegensätze auseinanderhalten, was ist und was sein soll, können wir urteilen und uns frei entscheiden. So bekommt gerade das Unterscheiden und Entscheiden eine zutiefst menschliche Seite.",
      "Hannah Arendt nennt einen weiteren Wesenszug das Anfangen. Mit jedem Menschen kommt etwas Neues in die Welt, das aus dem Bisherigen nicht ableitbar ist. Und der Mensch urteilt, er hält inne und entscheidet selbst. Martin Heidegger fügt die «Sorge» hinzu: Dem Menschen ist sein eigenes Leben nicht gleichgültig, er kümmert sich, fragt nach Sinn, weiss um seine Endlichkeit.",
      "Peter Sloterdijk beschreibt den Menschen als übendes Wesen. Wir werden, wer wir sind, durch Übung und Wiederholung, und niemand kann für uns üben. Siri Hustvedt erinnert daran, dass der Geist kein Computer ist. Denken und Fühlen hängen am lebendigen Körper und an gelebter Erfahrung. Eine Maschine kann Sprache und Gefühle täuschend echt nachahmen, aber sie erlebt nichts.",
      "Worauf das alles zielt, ist nicht der Vergleich mit der Maschine. Es geht nicht darum, ob eine KI auch anfangen, urteilen oder unterscheiden könnte. Es geht darum, was uns in unserem Wesen ausmacht. Und diese Züge sind nicht etwas, das wir bloss tun, sondern etwas, das wir sind. Wir können gar nicht anders, als neugierig zu sein, anzufangen, zu unterscheiden und uns zu sorgen.",
    ],
    hilft:
      "Wenn dich die schnelle, kluge KI verunsichert, kehr zur Frage zurück, was dich als Mensch ausmacht. Neugier, Anfangen, Urteilen, Sorge, das bleibt deins, ganz gleich, wie gut die Maschine formuliert. Dafür braucht es am Ende ein Grundvertrauen: dass diese Wesenszüge nicht einfach verschwinden, nur weil eine Maschine gute Sätze schreibt.",
    werk: "Aristoteles, «Metaphysik»; Immanuel Kant, «Logik» (1800); G. W. F. Hegel, «Phänomenologie des Geistes» (1807); Hannah Arendt, «Vita activa»; Martin Heidegger, «Sein und Zeit» (1927); Peter Sloterdijk, «Du musst dein Leben ändern» (2009); Siri Hustvedt, «Die Illusion der Gewissheit» (2018)",
  },
  {
    titel: "Netzwerke und Systeme",
    leitfrage: "Wie wir Orientierung finden, wo niemand mehr das Ganze überblickt.",
    icon: "hub",
    denker: [
      {
        name: "Armin Nassehi",
        leben: "geboren 1960",
        these: "Die Gesellschaft ist in Mustern gebaut.",
        info: "Nassehi fragt nicht, was die Digitalisierung mit uns macht, sondern für welches Problem sie eine Lösung ist. Seine Antwort: Unsere Gesellschaft läuft längst über «Muster», über Zahlen und Abläufe, die auch ohne Gesamtüberblick funktionieren. Die KI erkennt solche Muster hervorragend, ohne ihren Sinn zu verstehen. (Werk: «Muster», 2019.)",
      },
      {
        name: "Bruno Latour",
        leben: "1947 bis 2022",
        these: "Nichts wirkt allein.",
        info: "Mit der Akteur-Netzwerk-Theorie zeigt Latour, dass jede Wirkung im Netz aus Menschen und Dingen entsteht. Orientierung heisst darum nicht, alles zu überblicken, sondern das eigene Netz zu kennen: Wovon hänge ich ab, was wirkt mit mir zusammen? (Werk: «Existenzweisen», 2012.)",
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
        these: "Das freie Individuum ist eine Illusion.",
        info: "Latour zeigt, dass es das ganz freie, unabhängige Individuum nie gab. Wir stecken immer in Abhängigkeiten, von Menschen, Werkzeugen, Institutionen. Je bewusster man sich diese macht, desto klarer und souveräner wird das eigene Tun.",
      },
      {
        name: "Yasuo Deguchi",
        leben: "zeitgenössisch",
        these: "Nicht «ich» handelt, sondern «wir».",
        info: "Der Kyoto-Philosoph Deguchi verlegt das Handeln mit seiner «We-Turn»-Philosophie vom «Ich» auf ein «Wir». Niemand kann etwas ganz allein, jede Handlung wird von vielen getragen, von Menschen, Dingen und heute Maschinen. Die KI gehört zu diesem «Wir». Die Idee wurzelt im ostasiatischen, buddhistischen Denken, dass nichts für sich allein besteht.",
      },
      {
        name: "Donna Haraway",
        leben: "geboren 1944",
        these: "Wir sind längst verwoben.",
        info: "Haraway denkt Mensch, Tier und Maschine als verwoben, wir sind in gewissem Sinn schon «Cyborgs». Statt der Technik als fremder Macht gegenüberzustehen, sollen wir lernen, verantwortlich mit ihr zu leben. (Werke: «Ein Manifest für Cyborgs», 1985; «Unruhig bleiben», 2016.)",
      },
      {
        name: "Yuval Noah Harari",
        leben: "geboren 1976",
        these: "Grosse Macht braucht Regeln.",
        info: "Harari beschreibt, wie Menschheit und Technik sich gemeinsam verändern. Die Verschmelzung von Mensch und Maschine setzt gewaltige Macht frei, darum braucht sie klare Regeln und Wachsamkeit gegen blinden Fortschrittsglauben. (Werk: «Homo Deus».)",
      },
      {
        name: "Markus Gabriel",
        leben: "geboren 1980",
        these: "Die KI ist ein Spiegel, entscheiden musst du.",
        info: "Gabriel nennt die KI einen «magischen Spiegel», sie zeigt uns unsere Muster und Werte. Die eigentliche Revolution ist für ihn nicht technisch, sondern ethisch: «ethische Intelligenz» heisst, die KI klug und moralisch mitzugestalten, statt sie nur zu verbieten oder alles zu erlauben. (Werk: «Ethische Intelligenz».)",
      },
    ],
    absaetze: [
      "Mensch und Maschine lassen sich nicht mehr sauber auseinanderdividieren. Wir tippen, suchen, planen und entscheiden längst mit Geräten zusammen. Schon Bruno Latour zeigt, warum das kein neuer Sonderfall ist: Das ganz freie Individuum, das egoistisch nur tut, was es will, hat es nie gegeben. Wir stecken immer in Abhängigkeiten, von Menschen, Werkzeugen, Institutionen. Je klarer man sich diese Abhängigkeiten bewusst macht, desto verständlicher wird das eigene Tun.",
      "Der japanische Philosoph Yasuo Deguchi treibt diesen Gedanken weiter. Seine «We-Turn»-Philosophie verlegt das Handeln vom einzelnen «Ich» auf ein «Wir». Niemand kann etwas ganz allein, jede Handlung wird von vielen anderen getragen, von Menschen, Dingen und heute auch von Maschinen. Der eigentliche Handelnde ist deshalb kein einsames Ich, sondern ein «Wir», zu dem die KI dazugehört. Diese Sicht wurzelt im ostasiatischen Denken, in der buddhistischen Einsicht, dass nichts für sich allein besteht, sondern alles miteinander verbunden entsteht.",
      "Was folgt daraus? Donna Haraway sagt, wir sind längst «verwoben», in gewissem Sinn schon Mischwesen aus Mensch und Maschine, und sollten das verantwortlich gestalten. Yuval Noah Harari mahnt, dass diese Verschmelzung gewaltige Macht freisetzt und darum klare Regeln braucht. Markus Gabriel setzt auf «ethische Intelligenz», das kluge, moralische Mitgestalten. Zwei Wege zeichnen sich ab: sich auf die Zusammenarbeit einlassen oder den eigenen Weg umso deutlicher markieren, beides gestützt durch Regulation und Ethik.",
      "Am äussersten Rand steht der «Transhumanismus», die Idee, den Menschen durch Technik grenzenlos zu steigern, vielleicht sogar den Tod zu überwinden. Zum Einordnen helfen zwei ältere Muster als Gegenschablone. Zum einen die religiösen Heilsversprechen, denen der Transhumanismus verblüffend ähnelt, nur dass hier die Technik die Erlösung bringen soll. Zum anderen die endzeitlichen Untergangserzählungen, in denen die KI alles auslöscht. Beides, Erlösung wie Weltuntergang, sind grosse, alte Geschichten. Wer sie erkennt, fällt weder auf den Hype noch auf die Panik herein.",
    ],
    hilft:
      "Du musst dich nicht zwischen Verschmelzung und Verweigerung entscheiden. Es hilft schon, die eigenen Abhängigkeiten zu kennen und zu sehen, dass du immer in einem «Wir» handelst. Zwischen dem Heilsversprechen «Technik rettet uns» und dem Untergang «KI zerstört uns» liegt der nüchterne Alltag, den Regeln und Ethik gestaltbar machen.",
    werk: "Yasuo Deguchi, «We-Turn»-Philosophie (Selbst als Wir); Donna Haraway, «Unruhig bleiben» (2016); Yuval Noah Harari, «Homo Deus»; Markus Gabriel, «Ethische Intelligenz»; mit Bruno Latour, Akteur-Netzwerk-Theorie",
  },
  {
    titel: "Lebenskunst",
    leitfrage: "Das Leben ändern, ja, aber wie?",
    icon: "self_improvement",
    denker: [
      {
        name: "Die Stoiker",
        leben: "Antike",
        these: "Übe, was in deiner Macht steht.",
        info: "Für die Stoiker (Epiktet, Seneca, Mark Aurel) ist Philosophie kein blosses Wissen, sondern tägliche Übung. Sie unterscheiden, was in unserer Macht steht und was nicht, und üben Gelassenheit gegenüber dem, was wir nicht ändern können. Ein gutes Leben entsteht durch beständige kleine Übung, nicht durch einmalige Einsicht.",
      },
      {
        name: "Michel Foucault",
        leben: "1926 bis 1984",
        these: "Sich selbst formen wie ein Kunstwerk.",
        info: "Der französische Philosoph entdeckte in der Antike die «Sorge um sich selbst» wieder: das Leben bewusst gestalten, sich selbst formen wie ein Kunstwerk («Ästhetik der Existenz»). Nicht einfach fremden Normen folgen, sondern die eigene Lebensform aktiv wählen und einüben. (Werk: «Die Sorge um sich», 1984.)",
      },
      {
        name: "Wilhelm Schmid",
        leben: "geboren 1953",
        these: "Das Leben ändern, aber wie? In kleinen Schritten.",
        info: "Der Philosoph der Lebenskunst zeigt, warum aus guten Vorsätzen selten Taten werden, und was hilft: kleinste Schritte, täglich, fast beiläufig, aber regelmässig. Nicht das ganze Buch auf einmal, sondern jeden Tag eine Seite. So wird aus einem Vorsatz eine neue Gewohnheit. Und weil Freude stärker wirkt als Zwang, soll man sich am Schönen orientieren, zu dem man Ja sagen kann.",
      },
      {
        name: "Martha Nussbaum",
        leben: "geboren 1947",
        these: "Gefühle gehören zum guten Leben.",
        info: "Die US-amerikanische Philosophin zeigt, dass Gefühle keine Störung der Vernunft sind, sondern zu einem guten Urteil und einem gelingenden Leben dazugehören. Mit ihrem «Fähigkeiten-Ansatz» fragt sie, was Menschen wirklich brauchen, um gut zu leben. (Werk: «Fähigkeiten schaffen», 2011.)",
      },
      {
        name: "Maurice Merleau-Ponty",
        leben: "1908 bis 1961",
        these: "Wir verstehen die Welt mit dem Leib.",
        info: "Der französische Philosoph betont den Leib: Wir erfahren die Welt nicht nur mit dem Kopf, sondern leiblich, durch Wahrnehmung, Bewegung und Gefühl. Verstehen und gutes Leben sind verkörpert. Genau das kann eine körperlose KI nicht, sie rechnet, aber sie spürt nicht. (Werk: «Phänomenologie der Wahrnehmung», 1945.)",
      },
      {
        name: "Hartmut Rosa",
        leben: "geboren 1965",
        these: "Resonanz statt Kontrolle.",
        info: "Rosa nennt ein gelingendes Verhältnis zur Welt «Resonanz»: ein lebendiges, wechselseitiges Berührtwerden, das sich nicht auf Knopfdruck herstellen lässt. Gegen die Logik von immer mehr Tempo und Verfügbarkeit setzt er das Sich-berühren-Lassen. (Werke: «Resonanz», 2016; «Unverfügbarkeit», 2018.)",
      },
    ],
    absaetze: [
      "«Du musst dein Leben ändern», heisst es in einem berühmten Gedicht von Rainer Maria Rilke. Ja, aber wie? Das ist die Grundfrage der Lebenskunst. Denn aus einer Einsicht folgt noch lange keine Tat, jeder kennt das von den guten Vorsätzen an Silvester, die am Neujahrsmorgen schon wieder verblasst sind. Dieser Bereich fragt nicht, was der Mensch ist, sondern wie er sein Leben tatsächlich gestalten und ändern kann.",
      "Schon die Stoiker wussten: Philosophie ist tägliche Übung, nicht blosses Wissen. Das griechische Wort dafür ist «Askesis», Übung, nicht Verzicht. Michel Foucault nannte das die «Sorge um sich selbst», das Leben bewusst formen wie ein Kunstwerk. Und der Lebenskunst-Philosoph Wilhelm Schmid zeigt konkret, wie: in kleinsten Schritten, täglich, fast beiläufig, aber regelmässig. Nicht das ganze Buch auf einmal, sondern jeden Tag eine Seite. So wird aus einem Vorsatz allmählich eine neue Gewohnheit.",
      "Dabei zählt nicht nur der Kopf. Martha Nussbaum erinnert daran, dass Gefühle zum guten Leben gehören, und Maurice Merleau-Ponty, dass wir die Welt leiblich verstehen, durch Körper und Wahrnehmung. Genau darum wirkt Schönes stärker als Zwang: Wer sich an etwas orientiert, zu dem er Ja sagen kann, verändert sich lieber. Hartmut Rosa nennt dieses lebendige Verhältnis zur Welt «Resonanz».",
      "Und die KI? Sie kann bei der Umsetzung helfen, etwa eine App, die an die kleinen Übungen erinnert und Fortschritte zeigt. Aber gehen muss man den Weg selbst. Eine Spritze oder ein Klick nimmt die Anstrengung ab, doch das eingeübte, selbst gestaltete Leben ersetzt sie nicht. Lebenskunst bleibt Menschensache.",
    ],
    hilft:
      "Wenn du etwas ändern willst, warte nicht auf den grossen Ruck. Nimm dir den kleinstmöglichen Schritt vor, jeden Tag einen, und knüpfe ihn an etwas Schönes, zu dem du Ja sagst. Die KI darf dich erinnern und begleiten, aber die Übung, und damit dein Leben, gestaltest du selbst.",
    werk: "Wilhelm Schmid, «Philosophie der Lebenskunst» (1998); Michel Foucault, «Die Sorge um sich» (1984); Martha Nussbaum, «Fähigkeiten schaffen» (2011); Maurice Merleau-Ponty, «Phänomenologie der Wahrnehmung» (1945); Hartmut Rosa, «Resonanz» (2016); dazu die Stoiker (Epiktet, Seneca, Mark Aurel)",
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
  /* Aufgeklappte Info-Boxen, Schlüssel «bereichIdx-denkerIdx». */
  const [offeneBox, setOffeneBox] = useState<Set<string>>(new Set());

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

  function boxUmschalten(key: string) {
    setOffeneBox((prev) => {
      const nx = new Set(prev);
      if (nx.has(key)) nx.delete(key);
      else nx.add(key);
      return nx;
    });
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

        {/* Fliesstext: Grundidee, die Stimmen, neue Begriffe («…») */}
        <div className="mt-md space-y-sm text-body-md leading-relaxed text-on-surface-variant">
          {b.absaetze.map((absatz, i) => (
            <p key={i}>{absatz}</p>
          ))}
        </div>

        {/* Pro Person eine aufklappbare Box mit konkreten Infos zur Philosophie */}
        <div className="mt-lg">
          <p className="mb-sm flex items-center gap-xs text-label-sm uppercase tracking-wider text-tertiary">
            <span className="material-symbols-outlined text-[16px]">groups</span>
            Die Stimmen, zum Nachgehen
          </p>
          <div className="overflow-hidden rounded-xl border border-outline-variant">
            {b.denker.map((p, i) => {
              const key = `${idx}-${i}`;
              const auf = offeneBox.has(key);
              return (
                <div key={p.name} className={i > 0 ? "border-t border-outline-variant" : ""}>
                  <button
                    type="button"
                    onClick={() => boxUmschalten(key)}
                    aria-expanded={auf}
                    className="flex w-full items-center gap-sm px-sm py-sm text-left outline-none transition-colors hover:bg-surface-container focus-visible:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-[20px] text-tertiary">
                      record_voice_over
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-body-md font-medium text-on-surface">
                        {p.name}
                      </span>
                      <span className="block text-label-sm text-on-surface-variant">
                        {p.leben} · {p.these}
                      </span>
                    </span>
                    <span
                      className={
                        "material-symbols-outlined flex-shrink-0 text-[22px] text-on-surface-variant transition-transform duration-300 " +
                        (auf ? "rotate-180" : "")
                      }
                    >
                      expand_more
                    </span>
                  </button>
                  {auf && (
                    <div className="animate-frame-in px-sm pb-sm pl-[2.75rem]">
                      <p className="text-body-sm leading-relaxed text-on-surface-variant">
                        {p.info}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
