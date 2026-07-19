"use client";

import { useEffect, useState } from "react";
import {
  leseSpurenIndices,
  merkeSpur,
  SPUR_EVENT,
  zieheSpurenAusCloud,
} from "../_lib/spuren";
import KartenAktion from "./KartenAktion";
import GewichtungWahl from "./GewichtungWahl";
import { GlossarText } from "./Glossar";

/**
 * VerunsicherungsEpochen — «Philosophie in Zeiten der Verunsicherung».
 * Acht Epochen-Panels, je mit zwei Kunstwerken und drei aufklappbaren,
 * bewertbaren Bausteinen: Technologie, Verunsicherung, Philosophie. Jeder
 * Baustein hat «Mehr lesen» + «Das verfolge ich weiter» (KartenAktion) und
 * eine eigene Bewertungsskala. Das Öffnen zählt als Aktivität (Spur).
 * Abgestimmt auf den «Teppich des Wandels» darüber.
 */

const SPUR = "philosophische-perspektive:epochen";

interface Bild {
  src: string;
  alt: string;
  caption: string;
  credit: string;
}
interface Baustein {
  text: string;
  mehr: string;
}
interface Epoche {
  epoche: string;
  span: string;
  lead: string;
  bilder: [Bild, Bild];
  technologie: Baustein;
  verunsicherung: Baustein;
  philosophie: Baustein;
}

const BAUSTEINE = [
  {
    key: "technologie" as const,
    label: "Technologie",
    icon: "memory",
    gewPrefix: "philosophische-perspektive:technikwert",
    gewFrage: "Diese Technologie —",
    gewStufen: [
      "bin froh, gibt es sie",
      "hat für mich keine Bedeutung",
      "hätte nie eingeführt werden sollen",
    ] as [string, string, string],
  },
  {
    key: "verunsicherung" as const,
    label: "Verunsicherung",
    icon: "psychology_alt",
    gewPrefix: "philosophische-perspektive:verunsicherung-heute",
    gewFrage: "Diese Verunsicherung —",
    gewStufen: ["verunsichert mich noch heute", "ein wenig", "gar nicht mehr"] as [
      string,
      string,
      string,
    ],
  },
  {
    key: "philosophie" as const,
    label: "Philosophie",
    icon: "menu_book",
    gewPrefix: "philosophische-perspektive:philo-hilft",
    gewFrage: "Diese Sichtweise —",
    gewStufen: [
      "hilft mir auch heute",
      "hatte ich noch nie so überlegt",
      "macht für mich keinen Sinn",
    ] as [string, string, string],
  },
];

const EPOCHEN: Epoche[] = [
  {
    epoche: "Antike",
    span: "Athen & Rom · ~500 v.–500 n. Chr.",
    lead: "Zum ersten Mal ordnen sich Menschen nicht über Herkunft und Mythos, sondern über Bürgerrecht, Markt und Argument.",
    bilder: [
      {
        src: "/art/athens.jpg",
        alt: "Raffaels Fresko «Die Schule von Athen»",
        caption: "Die Denker der Antike, versammelt im Gespräch",
        credit: "Raffael, «Die Schule von Athen», 1509–1511 · gemeinfrei",
      },
      {
        src: "/art/sokrates.jpg",
        alt: "Jacques-Louis David, «Der Tod des Sokrates»",
        caption: "Sokrates, zum Tod verurteilt, bleibt seiner Überzeugung treu",
        credit: "Jacques-Louis David, «Der Tod des Sokrates», 1787 · gemeinfrei",
      },
    ],
    technologie: {
      text: "Alphabetschrift und Münzgeld: Wissen wird festhaltbar, Wert wird zählbar. Beides löst Menschen aus Herkunft und Tradition.",
      mehr: "Die griechische Alphabetschrift war so einfach, dass nicht mehr nur Priester lesen konnten. Münzgeld machte Leistung anonym vergleichbar — wer zahlen kann, zählt, egal woher er kommt.",
    },
    verunsicherung: {
      text: "Besonders der alte Geburtsadel verliert den Boden: In Demokratie und Republik zählen Rede und Stimme, nicht Abstammung. Und die Sophisten machen jede Wahrheit verkäuflich.",
      mehr: "Der Prozess gegen Sokrates (399 v. Chr.) zeigt die Nervosität einer verunsicherten Stadt: Der unbequeme Frager wird zum Tode verurteilt. Wenn alles verhandelbar wird, wächst die Angst, dass gar nichts mehr gilt.",
    },
    philosophie: {
      text: "Aristoteles in einem Satz: Schau genau hin, ordne, begründe — statt zu glauben, was alle sagen. Diese Haltung steckt heute in jedem «Beleg bitte».",
      mehr: "Aus dieser Schablone wurde die ganze abendländische Wissenschaft. Alltagssprachlich sagen wir «das ist doch logisch» oder «beweis es mir» — reine Aristoteles-Erbschaft.",
    },
  },
  {
    epoche: "Zerbrechen der Ordnung",
    span: "Spätantike & Mittelalter · ~400–1400",
    lead: "Rom zerfällt — und mit den Strassen, Städten und Gesetzen wankt die ganze Weltordnung.",
    bilder: [
      {
        src: "/art/rom.jpg",
        alt: "Die Plünderung Roms durch die Barbaren",
        caption: "410: Rom wird geplündert — für viele bricht die Welt zusammen",
        credit: "Joseph-Noël Sylvestre, «Die Plünderung Roms», 1890 · gemeinfrei",
      },
      {
        src: "/art/augustine.jpg",
        alt: "Der heilige Augustinus",
        caption: "Augustinus verlegt den Halt vom äusseren Reich nach innen",
        credit: "Philippe de Champaigne, «Der heilige Augustinus», um 1645 · gemeinfrei",
      },
    ],
    technologie: {
      text: "Hier verunsichert nicht neue, sondern verlorene Technik: Fernstrassen, Wasserleitungen und Verwaltung verfallen. Die Welt wird kleiner, langsamer, unsicherer.",
      mehr: "Ein seltener Fall im Teppich: Rückschritt. Handel und Geldwirtschaft schrumpfen, das Leben zieht sich aufs Dorf und ins Kloster zurück — Wissen überlebt fast nur noch in den Abschriften der Mönche.",
    },
    verunsicherung: {
      text: "Betroffen sind alle, besonders die städtischen Eliten: Wer sich auf Rom verlassen hatte, steht ohne Ordnung da. Heiden wie Christen fragen: Warum?",
      mehr: "Als Rom 410 geplündert wird, geben viele den Christen die Schuld — sie hätten die alten Götter erzürnt. Augustinus schreibt dagegen sein Hauptwerk «Der Gottesstaat».",
    },
    philosophie: {
      text: "Augustinus: Wenn aussen alles fällt, liegt der Halt innen — in Glaube, Gewissen und Erinnerung. «Hör auf dein Gewissen» und «geh in dich» stammen aus diesem Denken.",
      mehr: "Augustinus macht das Innenleben zum Thema: Seine «Bekenntnisse» gelten als erste grosse Autobiografie. Aus dem äusseren Reich wird das innere Reich.",
    },
  },
  {
    epoche: "Renaissance & Aufbruch",
    span: "~1400–1600",
    lead: "Neue Welten, neue Medien, neues Geld: Der Mensch rückt sich selbst ins Zentrum — und verliert zugleich seine Mitte im Kosmos.",
    bilder: [
      {
        src: "/art/bruegel-babel.jpg",
        alt: "Pieter Bruegel, «Der Turmbau zu Babel»",
        caption: "Der Turmbau zu Babel: menschlicher Ehrgeiz, der ins Wanken gerät",
        credit: "Pieter Bruegel d. Ä., «Der Turmbau zu Babel», 1563 · gemeinfrei",
      },
      {
        src: "/art/holbein-gesandte.jpg",
        alt: "Hans Holbein, «Die Gesandten»",
        caption: "Reichtum und Wissenschaft — und ein verzerrter Totenkopf als Riss im Bild",
        credit: "Hans Holbein d. J., «Die Gesandten», 1533 · gemeinfrei",
      },
    ],
    technologie: {
      text: "Buchdruck, Kompass und doppelte Buchführung: Ideen, Schiffe und Kapital kommen in Bewegung. Was zählbar ist, wird beherrschbar.",
      mehr: "Der Buchdruck macht aus einer Gelehrtendebatte eine europäische Revolution (Reformation). Die doppelte Buchführung verwandelt Handel in ein Rechenwerk — der Beginn des rechnenden Kapitalismus.",
    },
    verunsicherung: {
      text: "Besonders getroffen: die Deutungshüter (Klerus, Kopisten), die Bauern (Bauernkrieg 1525) und die Völker Amerikas, deren Welten überrannt werden. Und Kopernikus nimmt der Erde die Mitte.",
      mehr: "Holbeins «Gesandte» zeigen Reichtum und Wissenschaft — und einen schräg verzerrten Totenkopf im Bild: Mitten im Triumph liegt der Riss, die Erinnerung an die Vergänglichkeit.",
    },
    philosophie: {
      text: "Pico della Mirandola: Der Mensch ist nicht festgelegt — er formt sich selbst. Montaigne fragt bescheiden zurück: «Was weiss ich schon?» — «jeder ist seines Glückes Schmied» ist der Alltagsableger.",
      mehr: "Zum ersten Mal gilt Selbstformung als Würde des Menschen — die Wurzel des modernen Individualismus. Montaignes Zweifel wird zur Methode: erst prüfen, dann glauben.",
    },
  },
  {
    epoche: "Aufklärung",
    span: "~1600–1800",
    lead: "Die Naturwissenschaft entziffert den Himmel, und die Vernunft klopft bei jeder Autorität an: Warum eigentlich?",
    bilder: [
      {
        src: "/art/orrery.jpg",
        alt: "Joseph Wright of Derby, Vortrag am Planetenmodell",
        caption: "Wissenschaft als Schauspiel: das Weltall im Modell erklärt",
        credit: "Joseph Wright of Derby, «A Philosopher Lecturing on the Orrery», um 1766 · gemeinfrei",
      },
      {
        src: "/art/lissabon.jpg",
        alt: "Die Zerstörung von Lissabon 1755",
        caption: "Das Erdbeben von Lissabon erschüttert den Glauben an einen guten Weltplan",
        credit: "«Zerstörung von Lissabon», Kupferstich, 1755 · gemeinfrei",
      },
    ],
    technologie: {
      text: "Teleskop, Mikroskop und Pendeluhr: Die Welt wird messbar und getaktet. Sie erscheint als grosses Uhrwerk — berechenbar, aber auch entzaubert.",
      mehr: "Newtons Physik erklärt Planeten und fallende Äpfel mit denselben Gesetzen. Die Uhr taktet zunehmend Arbeit und Alltag — Zeit wird zum Massstab von allem.",
    },
    verunsicherung: {
      text: "Autoritäten wanken: Kirche und Adel verlieren ihr Wahrheitsmonopol. Das Erdbeben von Lissabon (1755) trifft besonders die fromme Bevölkerung — wie passt das Leid zu einem gütigen Gott?",
      mehr: "Am Allerheiligentag zerstört das Beben die frommste Stadt Europas. Voltaire spottet über den Optimismus, Kant grübelt über die Ursachen — viele finden keine tröstende Antwort mehr.",
    },
    philosophie: {
      text: "Kant: Habe Mut, dich deines eigenen Verstandes zu bedienen — denk selbst, verlass dich auf keine Autorität. «Das musst du selbst entscheiden» ist Kant im Alltag.",
      mehr: "Aufklärung heisst für Kant der Ausgang aus selbstverschuldeter Unmündigkeit. Gepaart mit Newtons Naturwissenschaft entsteht das moderne Selbstbild: prüfen, urteilen, verantworten.",
    },
  },
  {
    epoche: "Industriemoderne",
    span: "~1800–1914",
    lead: "Die Dampfmaschine pflügt die Gesellschaft um: Millionen ziehen in die Fabrikstädte, Fortschritt und Elend wachsen zusammen.",
    bilder: [
      {
        src: "/art/eisenwalzwerk.jpg",
        alt: "Adolph Menzel, «Das Eisenwalzwerk»",
        caption: "Die neue Arbeitswelt der Fabrik: Hitze, Lärm, Schichtbetrieb",
        credit: "Adolph Menzel, «Das Eisenwalzwerk», 1872–75 · gemeinfrei",
      },
      {
        src: "/art/london.jpg",
        alt: "Gustave Doré, Londoner Elendsquartiere an der Bahn",
        caption: "Die Kehrseite: Elendsquartiere im Schatten der Viadukte",
        credit: "Gustave Doré, «Over London – by Rail», 1872 · gemeinfrei",
      },
    ],
    technologie: {
      text: "Dampfmaschine, Eisenbahn, Telegraf und Fabrikuhr: Kraft, Tempo und Nachricht sprengen alle alten Masse. Die Arbeit wird getaktet und automatisiert.",
      mehr: "Zum ersten Mal wirken fast alle Züge der Verunsicherung zugleich mit voller Wucht: Beschleunigung, Landflucht, Maschinenarbeit, Lohnabhängigkeit — und die ersten grossen Umweltschäden durch Kohle.",
    },
    verunsicherung: {
      text: "Besonders getroffen: Handwerker und Weber, deren Können die Maschine entwertet, und die Landbevölkerung, die in Elendsquartieren landet. Kinder schuften in Fabriken.",
      mehr: "Die Weber zerschlagen teils die Maschinen, die sie arbeitslos machen (Maschinenstürmer). 1848 entlädt sich die Spannung in einer Welle von Revolutionen quer durch Europa.",
    },
    philosophie: {
      text: "Marx: Die gesellschaftlichen Verhältnisse sind gemacht, kein Schicksal — wer sie versteht, kann sie ändern. «Das ist doch menschengemacht» trägt sein Erbe.",
      mehr: "Marx begreift den Umbruch, während er geschieht. Ob man ihm folgt oder nicht: Der Gedanke, dass Wirtschaft und Gesellschaft veränderbar sind, prägt bis heute jede Reformdebatte.",
    },
  },
  {
    epoche: "Zeitalter der Katastrophen",
    span: "1914–1970",
    lead: "Zwei Weltkriege, Völkermord und die Atombombe zertrümmern den Fortschrittsglauben — der Mensch erlebt sich als fähig zur totalen Zerstörung.",
    bilder: [
      {
        src: "/art/kirchner-soldat.jpg",
        alt: "Ernst Ludwig Kirchner, «Selbstbildnis als Soldat»",
        caption: "Der Künstler als Soldat, mit abgeschnittener Hand — seelisch versehrt",
        credit: "Ernst Ludwig Kirchner, «Selbstbildnis als Soldat», 1915 · gemeinfrei",
      },
      {
        src: "/art/nussbaum-judenpass.jpg",
        alt: "Felix Nussbaum, «Selbstbildnis mit Judenpass»",
        caption: "Nussbaum zeigt seinen Judenpass — kurz darauf in Auschwitz ermordet",
        credit: "Felix Nussbaum, «Selbstbildnis mit Judenpass», um 1943 · gemeinfrei",
      },
    ],
    technologie: {
      text: "Maschinengewehr, Giftgas, Atombombe und der Rundfunk als Propagandamaschine: Technik automatisiert das Töten und die Lenkung der Massen.",
      mehr: "Dieselbe Forschung, die den Atomkern erklärt, baut die Bombe. Und dieselben Rechenmaschinen, die den Krieg gewinnen helfen (Turings «Bombe»), werden zu den ersten Computern.",
    },
    verunsicherung: {
      text: "Betroffen sind zuerst die Soldaten der Materialschlachten und die von den Nazis Verfolgten und Ermordeten — dann, mit der Atombombe, buchstäblich alle.",
      mehr: "Kirchner malt sich 1915 als Soldat mit abgeschnittener Malhand. Nussbaum zeigt sich mit dem Stempel im Judenpass, kurz bevor er ermordet wird: der Mensch, dem das Menschsein aberkannt wird.",
    },
    philosophie: {
      text: "Sartre: Es gibt kein Geländer mehr — der Mensch ist «zur Freiheit verurteilt» und trägt darum die volle Verantwortung. «Du hast immer eine Wahl» ist der Alltagsableger.",
      mehr: "Neben Sartre: Hannah Arendt mahnt, selbst zu urteilen statt mitzulaufen; Wittgenstein, klar zu sagen, was sich sagen lässt. (Heidegger denkt die Technik als «Gestell» — mit klarem Blick auf seine Verstrickung in den Nationalsozialismus.)",
    },
  },
  {
    epoche: "«Ende der Geschichte»",
    span: "1989–~2015",
    lead: "Der Kalte Krieg endet, der Markt scheint zu siegen — und im Überfluss der Möglichkeiten geht die Orientierung gerade dann verloren.",
    bilder: [
      {
        src: "/art/mauerfall.jpg",
        alt: "Grenzöffnung am Brandenburger Tor 1989",
        caption: "Mauerfall 1989: der Osten öffnet sich, ein System verschwindet über Nacht",
        credit: "Grenzöffnung am Brandenburger Tor, 22.12.1989 · Bundesarchiv Bild 183-1989-1222-016 · CC BY-SA 3.0 de",
      },
      {
        src: "/art/erde_nacht.jpg",
        alt: "Die Erde bei Nacht, erleuchtet von Städten",
        caption: "Eine vernetzte, elektrifizierte Welt — scheinbar grenzenlos",
        credit: "«Earth at Night» · NASA/NOAA, 2012 · gemeinfrei",
      },
    ],
    technologie: {
      text: "PC, Internet und Container vernetzen und beschleunigen alles. Individualisierung und Markt werden grenzenlos — Selbstverwirklichung wird fast zur Pflicht.",
      mehr: "Manche riefen das «Ende der Geschichte» aus — die endgültige Weltordnung. Rückblickend begann ein neuer Umbruch: Globalisierung und Digitalisierung, deren Verunsicherung wir heute spüren.",
    },
    verunsicherung: {
      text: "Besonders betroffen: die Industriearbeiter des Westens (ihre Fabriken wandern ab) und die Menschen des früheren Ostblocks, deren ganzes System über Nacht verschwindet.",
      mehr: "Wenn alles möglich ist und jeder «sein eigenes Ding» macht, wächst paradox die Leere. Der Soziologe Hartmut Rosa nennt die Folge Beschleunigung ohne Resonanz — getrieben, aber ohne Verbindung.",
    },
    philosophie: {
      text: "Die Postmoderne (Lyotard): Die grossen gemeinsamen Erzählungen sind vorbei — jeder erzählt sich selbst. «Das ist halt deine Wahrheit» ist Postmoderne im Alltag.",
      mehr: "Foucault fragt zugleich: Wer hat die Macht zu bestimmen, was als normal und wahr gilt? Der Hoch-Individualismus dieser Jahre ist die Schablone, die sich gerade erschöpft.",
    },
  },
  {
    epoche: "Jetzt: Umwelt & KI",
    span: "heute",
    lead: "Klimakrise und Künstliche Intelligenz zugleich: Der Individualismus allein trägt nicht mehr — es braucht ein neues Wir.",
    bilder: [
      {
        src: "/art/erde_tag.jpg",
        alt: "«Blue Marble» — die Erde aus dem All",
        caption: "Der eine Planet: verletzlich, geteilt, ohne Ersatz",
        credit: "«Blue Marble» · NASA (Apollo 17), 1972 · gemeinfrei",
      },
      {
        src: "/art/wir-netz.png",
        alt: "Ein vernetztes «Wir»",
        caption: "Ein Geflecht aus Akteuren — menschlich und nicht-menschlich",
        credit: "«Suche nach Bildern» · Klaus Christ, 2024 · mit Genehmigung",
      },
    ],
    technologie: {
      text: "KI, Smartphone und globale Lieferketten auf fossiler Infrastruktur: Die Automatisierung erreicht Denken und Sprache, die Naturzerstörung wird erstmals überlebensbedrohend.",
      mehr: "Was als jahrtausendealte Phantasie begann — dem Ding Leben einhauchen —, ist heute Werkzeug und Gegenüber zugleich. Und der ökologische Fussabdruck der scheinbar virtuellen Technik ist sehr real.",
    },
    verunsicherung: {
      text: "Betroffen: die junge Generation (ihre Klimazukunft), die Wissens- und Kreativberufe (durch KI) und der globale Süden — und erstmals ausdrücklich auch nicht-menschliche Akteure: Arten, Klima, Ökosysteme.",
      mehr: "Erstmals ist die Verunsicherung planetar: Es geht nicht nur um Berufe und Weltbilder, sondern um die Lebensgrundlagen selbst — und um Wesen und Systeme, die nicht mitreden können.",
    },
    philosophie: {
      text: "Bruno Latour: Kein Akteur handelt allein. Verstehe die Abhängigkeiten — auch von dem, was nicht Mensch ist: Klima, Dinge, KI. «Alles hängt mit allem zusammen» ist ein erster Anklang.",
      mehr: "Neben Latour arbeiten Donna Haraway (Verbundenheit über Artgrenzen), Hartmut Rosa (Resonanz statt Beschleunigung) und Markus Gabriel daran. Die Schablone unserer Zeit ist noch nicht geschrieben — vielleicht schreibst du an ihr mit.",
    },
  },
];

export default function VerunsicherungsEpochen({ className = "" }: { className?: string }) {
  const gesamt = EPOCHEN.length * BAUSTEINE.length;
  const [offen, setOffen] = useState<Set<number>>(new Set());
  const [gelesen, setGelesen] = useState<Set<number>>(new Set());

  useEffect(() => {
    function restore() {
      const idx = leseSpurenIndices(SPUR).filter((i) => i >= 0 && i < gesamt);
      if (idx.length === 0) return;
      setGelesen((prev) => {
        const nx = new Set(prev);
        idx.forEach((i) => nx.add(i));
        return nx;
      });
    }
    restore();
    void zieheSpurenAusCloud();
    window.addEventListener(SPUR_EVENT, restore);
    return () => window.removeEventListener(SPUR_EVENT, restore);
  }, [gesamt]);

  function toggle(gi: number) {
    setOffen((prev) => {
      const nx = new Set(prev);
      if (nx.has(gi)) nx.delete(gi);
      else nx.add(gi);
      return nx;
    });
    if (!gelesen.has(gi)) {
      setGelesen((prev) => new Set(prev).add(gi));
      merkeSpur(`${SPUR}:${gi}`);
    }
  }

  return (
    <section aria-label="Philosophie in Zeiten der Verunsicherung" className={className}>
      <div className="mb-md flex items-center gap-xs text-label-md uppercase tracking-wider text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px] text-tertiary">
          {gelesen.size === gesamt ? "done_all" : "unfold_more"}
        </span>
        {gelesen.size === 0
          ? `${EPOCHEN.length} Epochen, je drei Bausteine zum Aufklappen und Bewerten`
          : `${gelesen.size} von ${gesamt} Bausteinen geöffnet`}
      </div>

      <div className="space-y-lg">
        {EPOCHEN.map((e, ei) => (
          <article
            key={ei}
            className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-bright"
          >
            {/* Kopf */}
            <div className="border-b border-outline-variant bg-surface-container-low p-md sm:p-lg">
              <p className="text-label-sm uppercase tracking-wider text-tertiary">{e.span}</p>
              <h3 className="mt-xs text-headline-sm text-on-surface">{e.epoche}</h3>
              <p className="mt-xs max-w-3xl text-body-md text-on-surface-variant">{e.lead}</p>
            </div>

            {/* Zwei Kunstwerke */}
            <div className="grid gap-md p-md sm:grid-cols-2 sm:p-lg">
              {e.bilder.map((b, bi) => (
                <figure key={bi} className="min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.src}
                    alt={b.alt}
                    loading="lazy"
                    className="max-h-72 w-full rounded-lg border border-outline-variant bg-surface-container-low object-contain"
                  />
                  <figcaption className="mt-xs text-body-sm text-on-surface">
                    {b.caption}
                    <span className="mt-0.5 block text-label-sm text-on-surface-variant opacity-80">
                      {b.credit}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>

            {/* Drei bewertbare Bausteine */}
            <ul className="divide-y divide-outline-variant border-t border-outline-variant">
              {BAUSTEINE.map((bs, ti) => {
                const gi = ei * BAUSTEINE.length + ti;
                const auf = offen.has(gi);
                const schon = gelesen.has(gi);
                const inhalt = e[bs.key];
                return (
                  <li key={ti}>
                    <button
                      type="button"
                      onClick={() => toggle(gi)}
                      aria-expanded={auf}
                      className="flex w-full items-center gap-sm px-md py-sm text-left outline-none transition-colors hover:bg-surface-container focus-visible:bg-surface-container sm:px-lg"
                    >
                      <span
                        className={
                          "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full " +
                          (schon
                            ? "bg-tertiary text-on-tertiary"
                            : "bg-tertiary-container text-on-tertiary-container")
                        }
                      >
                        <span className="material-symbols-outlined text-[17px]">{bs.icon}</span>
                      </span>
                      <span className="min-w-0 flex-1 text-body-lg font-medium text-on-surface">
                        {bs.label}
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
                      <div className="animate-frame-in px-md pb-md pl-[3.25rem] sm:px-lg sm:pl-[4rem]">
                        <p className="text-body-md leading-relaxed text-on-surface">
                          <GlossarText text={inhalt.text} />
                        </p>
                        <GewichtungWahl
                          className="mt-md"
                          stapeln
                          prefix={bs.gewPrefix}
                          index={ei}
                          frage={bs.gewFrage}
                          stufen={bs.gewStufen}
                        />
                        <KartenAktion
                          mehr={<GlossarText text={inhalt.mehr} />}
                          wunschId={`wunsch:${SPUR}:${gi}`}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
