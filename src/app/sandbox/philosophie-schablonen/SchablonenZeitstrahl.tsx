"use client";

import { useEffect, useState } from "react";

/**
 * Schablonen-Zeitstrahl (Hegel-Dramaturgie) — Visualisierung für das Submodul
 * "Philosophische Perspektive" (Lernseite 2).
 *
 * Drei Schläge pro Epoche («Die Eule der Minerva beginnt erst mit der
 * einbrechenden Dämmerung ihren Flug»):
 *   1. TECHNIK (primary): kompakte Ereignis-Karten — was sich verschob
 *      (Quelle: docs/skripte/lernseite-2-submodul-1-technik-zeitachse.md).
 *   2. VERUNSICHERUNG (error-Ton): die soziale Erschütterung, mit eigenem
 *      Kunstwerk — was ins Wanken geriet.
 *   3. PHILOSOPHIE (tertiary): die Antwort, die *im Nachhinein* Orientierung
 *      gab — grosse Stations-Karte mit Kunstwerk.
 *
 * Bilder: lokal unter /public/art (Nachweis in public/art/CREDITS.md). Die
 * historischen Werke sind gemeinfrei (Wikimedia Commons); die Gegenwarts-
 * Station zeigt ein zeitgenössisches Werk (Klaus Christ, 2024), mit
 * Genehmigung verwendet. Ganzes Werk sichtbar (object-contain), Klick öffnet
 * den Vollbild-Modus (Lightbox, ✕/Esc/Hintergrund schliesst).
 *
 * Self-contained Client-Komponente, keine Firebase-/Server-Logik
 * (hosting-/auth-agnostisch, migrationsbereit). Inhalte als Datenstruktur unten.
 */

interface TechEvent {
  year: string;
  title: string;
  note: string;
  icon: string;
}

interface Unrest {
  text: string;
  image?: string;
  imageAlt?: string;
  credit?: string;
}

interface Station {
  id: string;
  epoch: string;
  wandel: string;
  thinker: string;
  icon: string;
  schablone: string;
  quote?: string;
  enabled: string;
  image?: string; // Pfad unter /public
  imageAlt?: string;
  credit?: string; // Bildnachweis
  imageWhy?: string; // "Warum dieses Bild?" — einfach, spannend
  tech: TechEvent[]; // Spur 1: Technik
  unrest: Unrest; // Spur 2: soziale Verunsicherung
  open?: boolean; // offene Gegenwarts-Station
}

const STATIONS: Station[] = [
  {
    id: "aristoteles",
    epoch: "Antike",
    wandel: "Vom Mythos zum Wissen",
    thinker: "Aristoteles",
    icon: "science",
    schablone: "Beobachten, ordnen, begründen",
    quote: "„Alle Menschen streben von Natur aus nach Wissen.“",
    enabled:
      "Erst nach dem Schock ordnet Aristoteles das Wissen neu — Logik, Naturkunde, Ethik, Politik: das Fundament von Wissenschaft und Empirie.",
    image: "/art/athens.jpg",
    imageAlt: "Fresko „Die Schule von Athen“ von Raffael",
    credit: "Raffael, „Die Schule von Athen“, 1509–1511 · gemeinfrei",
    imageWhy:
      "In der Mitte zwei Denker: Platon zeigt nach oben, in die Welt der Ideen — Aristoteles streckt die Hand flach nach unten, zur Erde, zum Beobachtbaren. Genau das ist seine Schablone: Wissen beginnt nicht im Himmel, sondern im genauen Hinsehen. Raffael hält den Moment fest, in dem sich das Denken der Welt zuwendet.",
    tech: [
      {
        year: "~150 v. Chr.",
        title: "Antikythera-Mechanismus",
        note: "Ein Zahnrad-Rechner sagt Sonnen- und Mondfinsternisse voraus — der Himmel wird berechenbar.",
        icon: "settings",
      },
      {
        year: "um 1021",
        title: "Buch der Optik",
        note: "Ibn al-Haytham prüft das Sehen im Experiment (Camera obscura) — die empirische Methode entsteht.",
        icon: "visibility",
      },
    ],
    unrest: {
      text: "Der Logos entzaubert den Mythos: Die Götter-Erzählungen verlieren ihre Selbstverständlichkeit, die Sophisten verkaufen Argumente wie Waren — nichts scheint mehr festzustehen. Athen reagiert mit Härte: 399 v. Chr. muss Sokrates den Schierlingsbecher trinken, weil sein Fragen die alte Ordnung bedroht.",
      image: "/art/sokrates.jpg",
      imageAlt: "Gemälde „Der Tod des Sokrates“ von Jacques-Louis David",
      credit: "J.-L. David, „Der Tod des Sokrates“, 1787 · gemeinfrei",
    },
  },
  {
    id: "augustinus",
    epoch: "Spätantike → Mittelalter",
    wandel: "Eine Weltordnung zerbricht",
    thinker: "Augustinus",
    icon: "church",
    schablone: "Innerlichkeit, Glaube, Heilsgeschichte",
    quote: "„Im inneren Menschen wohnt die Wahrheit.“",
    enabled:
      "Augustinus antwortet nach dem Schock: „Vom Gottesstaat“ (413–426) — Halt liegt nicht im Reich, sondern im Glauben. Orientierung für ein ganzes Zeitalter, geschrieben, als das alte schon fiel.",
    image: "/art/augustine.jpg",
    imageAlt: "Gemälde „Der heilige Augustinus“ von Philippe de Champaigne",
    credit: "Ph. de Champaigne, „Der heilige Augustinus“, um 1645 · gemeinfrei",
    imageWhy:
      "Ein Lichtstrahl der Wahrheit trifft Augustinus mitten ins Herz, das er brennend in der Hand hält. Die Wahrheit kommt für ihn nicht von außen aus der Welt, sondern von innen. Das Bild macht sichtbar, was das christliche Zeitalter neu setzte: Der Blick wendet sich nach innen — zu Glaube und Gewissen.",
    tech: [
      {
        year: "13.–14. Jh.",
        title: "Die mechanische Uhr",
        note: "Aus den Klöstern auf die Stadttürme: Gebet, Arbeit und Alltag laufen fortan im Takt der Uhr — die Technik, die die neue Ordnung trägt.",
        icon: "schedule",
      },
    ],
    unrest: {
      text: "410 n. Chr. plündern Alarichs Westgoten Rom — die „ewige Stadt“ fällt, und mit ihr die Gewissheit einer ganzen Weltordnung. Heiden geben den Christen die Schuld am Untergang, Christen zweifeln an Gottes Schutz. Wem gehört die Zukunft, wenn das Reich zerbricht?",
      image: "/art/rom.jpg",
      imageAlt:
        "Gemälde „Die Plünderung Roms durch die Barbaren im Jahr 410“ von Joseph-Noël Sylvestre",
      credit:
        "J.-N. Sylvestre, „Die Plünderung Roms durch die Barbaren“, 1890 · gemeinfrei",
    },
  },
  {
    id: "kant",
    epoch: "Frühe Neuzeit → Aufklärung",
    wandel: "Der Mensch verliert die Mitte — und wird mündig",
    thinker: "Kant",
    icon: "lightbulb",
    schablone: "Autonomie und Selbstdenken",
    quote:
      "„Sapere aude! Habe Mut, dich deines eigenen Verstandes zu bedienen.“",
    enabled:
      "Kants Antwort kommt spät im Jahrhundert: Wenn weder Himmel noch Kirche Halt geben, muss die Vernunft ihn selbst schaffen — das mündige Individuum der Moderne.",
    image: "/art/wanderer.jpg",
    imageAlt:
      "Gemälde „Der Wanderer über dem Nebelmeer“ von Caspar David Friedrich",
    credit:
      "C. D. Friedrich, „Der Wanderer über dem Nebelmeer“, 1818 · gemeinfrei",
    imageWhy:
      "Ein einzelner Mensch steht auf dem Gipfel und blickt über ein Nebelmeer — niemand sagt ihm, was er sehen soll, er deutet die Welt selbst. Das ist Kants Schablone: Habe Mut, dich deines eigenen Verstandes zu bedienen. Friedrich malt den mündigen, auf sich gestellten Einzelnen der Moderne.",
    tech: [
      {
        year: "um 1440",
        title: "Gutenbergs Druckpresse",
        note: "3 600 Seiten am Tag statt einer Handvoll — Wissen und Streitschriften erreichen erstmals die Masse.",
        icon: "print",
      },
      {
        year: "1543–1687",
        title: "Kopernikanische Wende",
        note: "Kopernikus rechnet, Galileos Teleskop liefert 1609 den sichtbaren Beweis, Newton das Gesetz — die Erde ist nicht mehr Mittelpunkt.",
        icon: "star",
      },
      {
        year: "1761",
        title: "Navigation & Chronometer",
        note: "Harrisons H4 nimmt die Zeit mit aufs Meer — die Welt wird vermessen und global.",
        icon: "explore",
      },
    ],
    unrest: {
      text: "Die Druckpresse verbreitet Luthers Thesen — die Christenheit spaltet sich, Religionskriege verwüsten Europa. Das Teleskop nimmt der Erde die Mitte; Pascal gesteht: „Das ewige Schweigen dieser unendlichen Räume erschreckt mich.“ Und 1755 zertrümmert das Erdbeben von Lissabon den Glauben an die gütige Ordnung der Welt.",
      image: "/art/lissabon.jpg",
      imageAlt:
        "Kupferstich der Zerstörung Lissabons durch Erdbeben, Feuer und Flutwelle 1755",
      credit: "Kupferstich „Destruction de Lisbonne“, 1755 · gemeinfrei",
    },
  },
  {
    id: "marx",
    epoch: "Industriemoderne · 19. Jh.",
    wandel: "Die Maschine ordnet die Gesellschaft neu",
    thinker: "Marx",
    icon: "groups",
    schablone: "Den Umbruch begreifen — und gestalten",
    quote: "„Alles Ständische und Stehende verdampft.“",
    enabled:
      "Im Revolutionsjahr 1848 erscheint das Kommunistische Manifest: Die Philosophie erfasst den Umbruch, als er schon in vollem Gang ist — und erklärt Gesellschaft für veränderbar.",
    image: "/art/eisenwalzwerk.jpg",
    imageAlt: "Gemälde „Das Eisenwalzwerk (Moderne Cyklopen)“ von Adolph Menzel",
    credit: "A. Menzel, „Das Eisenwalzwerk“, 1872–1875 · gemeinfrei",
    imageWhy:
      "Menzel malt als einer der Ersten das Innere einer Fabrik: glühendes Eisen, Räder, Riemen — und Menschen, die im Takt der Maschine arbeiten. Rechts isst einer hastig, hinten wird schon weitergeschuftet; die Arbeit steht nie still. Das Bild macht sichtbar, was die Dampfmaschine aus der Gesellschaft machte: eine rastlose Maschinerie — und mittendrin der Mensch.",
    tech: [
      {
        year: "1712 / 1769",
        title: "Die Dampfmaschine",
        note: "Newcomen pumpt Bergwerke leer, Watt macht die Fabrik überall möglich — Industrialisierung und Urbanisierung.",
        icon: "factory",
      },
      {
        year: "1831–1906",
        title: "Elektrizität & Elektronik",
        note: "Faraday, Edison und Tesla elektrifizieren die Welt; De Forests Verstärker-Röhre (1906) eröffnet Radio und Ferntelefonie.",
        icon: "bolt",
      },
      {
        year: "1844 / 1866",
        title: "Telegraf & Seekabel",
        note: "Botschaften schneller als jeder Bote; das Atlantik-Kabel verbindet die Kontinente. Bis heute laufen ~99 % des Internets durch Kabel im Meer.",
        icon: "cable",
      },
    ],
    unrest: {
      text: "Die Fabrik saugt die Menschen vom Land in die Städte: 14-Stunden-Tage, Kinderarbeit, Elendsquartiere im Schatten der Bahnviadukte. Die alten Stände lösen sich auf, Familien- und Dorfordnungen zerreissen — 1848 explodiert Europa in Revolutionen.",
      image: "/art/london.jpg",
      imageAlt:
        "Stich „Over London – by Rail“ von Gustave Doré: enge Hinterhöfe unter einem Eisenbahnviadukt",
      credit: "G. Doré, „Over London – by Rail“, 1872 · gemeinfrei",
    },
  },
  {
    id: "jetzt",
    epoch: "Digitale Transformation",
    wandel: "Alles wird vernetzt — KI tritt auf",
    thinker: "Wir — jetzt",
    icon: "hub",
    schablone: "??? — das suchen wir gerade",
    enabled:
      "Hegels Eule der Minerva fliegt erst in der Dämmerung — für unsere Zeit ist sie noch nicht gestartet. Die Schablone fehlt noch; genau hier setzt dieses Submodul an (Latour, Haraway, Gabriel …).",
    image: "/art/wir-netz.png",
    imageAlt:
      "Installation „Suche nach Bildern“: ein Netz aus Fäden verbindet Figuren und Objekte — Rohstoffe, Datacenter, Satelliten, Nutzer:innen — rund um einen alten Computer mit Weltkarte.",
    credit: "Klaus Christ, „Suche nach Bildern“, 2024",
    imageWhy:
      "Das ist das „Wir“ von heute: kein einzelner Mensch, sondern ein riesiges Netz. Rund um eine simple Bildersuche hängen Rohstoffe, Bergbau, Kabel, Satelliten, Datacenter, Energie, Regierungen — und Menschen: Programmierer:innen, Künstler:innen, Arbeiter:innen, Nutzer:innen. Menschen und nicht-menschliche Akteure ziehen an denselben Fäden. Die Schablone, die uns darin orientiert, suchen wir noch.",
    tech: [
      {
        year: "1945 / 1947",
        title: "Computer & Transistor",
        note: "ENIAC rechnet elektronisch, der Transistor macht Maschinen klein und zuverlässig — das digitale Zeitalter beginnt.",
        icon: "memory",
      },
      {
        year: "1969–1991",
        title: "ARPANET & World Wide Web",
        note: "Erst vier Rechner, dann das Web für alle — Information wird ortlos, getragen von den Kabeln in den Meeren.",
        icon: "language",
      },
      {
        year: "2017–2022",
        title: "Generative KI",
        note: "Die Transformer-Architektur (2017), dann ChatGPT (2022): Maschinen erzeugen Sprache, Bilder, Code.",
        icon: "chat",
      },
    ],
    unrest: {
      text: "Was ist noch echt — Bild, Stimme, Video? Worauf kann ich mich beim Recherchieren verlassen, welche Fähigkeiten lohnen sich noch, wer hat das gemacht — ich, die KI, beide? Alles ist vernetzt, alles beschleunigt sich; viele fühlen sich getrieben — und das „Wir“ zerfällt.",
    },
    open: true,
  },
];

type Lightbox = { src: string; alt: string; credit?: string };

export default function SchablonenZeitstrahl() {
  const [openId, setOpenId] = useState<string | null>("aristoteles");
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);

  // Esc schliesst, Hintergrund-Scroll sperren, solange Vollbild offen ist
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox]);

  return (
    <>
      {/* Legende der drei Schläge */}
      <div className="mb-lg flex flex-wrap gap-sm">
        <span className="inline-flex items-center gap-xs rounded-xl bg-primary-container px-md py-xs text-label-sm text-on-primary-container">
          <span className="material-symbols-outlined text-[16px]">bolt</span>
          Technik — verschiebt die Welt
        </span>
        <span className="inline-flex items-center gap-xs rounded-xl bg-error-container px-md py-xs text-label-sm text-on-error-container">
          <span className="material-symbols-outlined text-[16px]">warning</span>
          Verunsicherung — was ins Wanken gerät
        </span>
        <span className="inline-flex items-center gap-xs rounded-xl bg-tertiary-container px-md py-xs text-label-sm text-on-tertiary-container">
          <span className="material-symbols-outlined text-[16px]">psychology</span>
          Philosophie — antwortet im Nachhinein
        </span>
      </div>

      <ol className="flex flex-col gap-lg">
        {STATIONS.map((s, i) => {
          const isOpen = openId === s.id;
          const isLast = i === STATIONS.length - 1;
          return (
            <li key={s.id} className="flex gap-md">
              {/* Rail: Icon-Knoten + Verbindungslinie */}
              <div className="flex flex-col items-center">
                <span
                  className={
                    s.open
                      ? "flex h-11 w-11 items-center justify-center rounded-xl bg-tertiary text-on-tertiary shadow-sm"
                      : "flex h-11 w-11 items-center justify-center rounded-xl bg-tertiary-container text-on-tertiary-container"
                  }
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {s.icon}
                  </span>
                </span>
                {!isLast && <span className="w-px flex-1 bg-outline-variant" />}
              </div>

              <div className="min-w-0 flex-1 pb-md">
                {/* ── Schlag 1: Technik ── */}
                <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-primary">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  Die Technik verschiebt die Welt
                </p>
                <div
                  className={
                    "mt-sm grid gap-sm " +
                    (s.tech.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")
                  }
                >
                  {s.tech.map((t) => (
                    <div
                      key={t.title}
                      className="rounded-lg border border-outline-variant bg-surface-bright p-md"
                    >
                      <div className="flex items-center gap-sm">
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
                          <span className="material-symbols-outlined text-[18px]">
                            {t.icon}
                          </span>
                        </span>
                        <div className="min-w-0">
                          <p className="text-label-sm text-primary">{t.year}</p>
                          <p className="text-body-sm font-semibold text-on-surface">
                            {t.title}
                          </p>
                        </div>
                      </div>
                      <p className="mt-sm text-body-sm text-on-surface-variant">
                        {t.note}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ── Schlag 2: Verunsicherung ── */}
                <p className="mt-md flex items-center gap-xs text-label-sm uppercase tracking-wider text-error">
                  <span className="material-symbols-outlined text-[16px]">
                    warning
                  </span>
                  Die Verunsicherung wächst
                </p>
                <div className="mt-sm overflow-hidden rounded-xl border border-outline-variant bg-surface-bright">
                  {s.unrest.image && (
                    <figure className="m-0">
                      <button
                        type="button"
                        onClick={() =>
                          setLightbox({
                            src: s.unrest.image!,
                            alt: s.unrest.imageAlt ?? "",
                            credit: s.unrest.credit,
                          })
                        }
                        aria-label={`${s.unrest.imageAlt ?? "Bild"} im Vollbild öffnen`}
                        className="group relative block w-full cursor-zoom-in"
                      >
                        <div className="flex h-56 items-center justify-center bg-surface-container-low p-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.unrest.image}
                            alt={s.unrest.imageAlt ?? ""}
                            loading="lazy"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <span className="absolute right-sm top-sm inline-flex items-center gap-xs rounded-lg bg-inverse-surface/70 px-sm py-xs text-label-sm text-inverse-on-surface opacity-80 transition-opacity group-hover:opacity-100">
                          <span className="material-symbols-outlined text-[16px]">
                            fullscreen
                          </span>
                          Vollbild
                        </span>
                      </button>
                      {s.unrest.credit && (
                        <figcaption className="border-t border-outline-variant bg-surface-container-low px-md py-xs text-label-sm text-on-surface-variant">
                          {s.unrest.credit}
                        </figcaption>
                      )}
                    </figure>
                  )}
                  <p className="border-l-4 border-error/50 p-lg text-body-md text-on-surface-variant">
                    {s.unrest.text}
                  </p>
                </div>

                {/* ── Schlag 3: Philosophie ── */}
                <p className="mt-md flex items-center gap-xs text-label-sm uppercase tracking-wider text-tertiary">
                  <span className="material-symbols-outlined text-[16px]">
                    psychology
                  </span>
                  Die Philosophie antwortet — im Nachhinein
                </p>

                <div
                  className={
                    "mt-sm overflow-hidden rounded-xl border bg-surface-bright shadow-sm transition hover:shadow-md " +
                    (s.open
                      ? "border-tertiary border-dashed"
                      : "border-outline-variant")
                  }
                >
                  {/* Bild → Klick öffnet Vollbild */}
                  {s.image ? (
                    <figure className="m-0">
                      <button
                        type="button"
                        onClick={() =>
                          setLightbox({
                            src: s.image!,
                            alt: s.imageAlt ?? s.thinker,
                            credit: s.credit,
                          })
                        }
                        aria-label={`${s.imageAlt ?? s.thinker} im Vollbild öffnen`}
                        className="group relative block w-full cursor-zoom-in"
                      >
                        <div className="flex h-72 items-center justify-center bg-surface-container-low p-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.image}
                            alt={s.imageAlt ?? ""}
                            loading="lazy"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <span className="absolute right-sm top-sm inline-flex items-center gap-xs rounded-lg bg-inverse-surface/70 px-sm py-xs text-label-sm text-inverse-on-surface opacity-80 transition-opacity group-hover:opacity-100">
                          <span className="material-symbols-outlined text-[16px]">
                            fullscreen
                          </span>
                          Vollbild
                        </span>
                      </button>
                      {s.credit && (
                        <figcaption className="border-t border-outline-variant bg-surface-container-low px-md py-xs text-label-sm text-on-surface-variant">
                          {s.credit}
                        </figcaption>
                      )}
                    </figure>
                  ) : (
                    <div className="flex h-72 w-full flex-col items-center justify-center gap-xs border-b border-dashed border-outline-variant bg-surface-container-low text-on-surface-variant">
                      <span className="material-symbols-outlined text-[36px] text-tertiary">
                        image_search
                      </span>
                      <span className="text-label-sm">Bild noch offen</span>
                    </div>
                  )}

                  {/* Text → Klick klappt die Erklärung auf/zu */}
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : s.id)}
                    aria-expanded={isOpen}
                    className="block w-full p-lg text-left"
                  >
                    <div className="flex items-center justify-between gap-sm">
                      <span className="inline-flex items-center gap-xs rounded-xl bg-surface-container px-sm py-xs text-label-sm text-on-surface-variant">
                        {s.epoch}
                      </span>
                      <span
                        className={
                          "material-symbols-outlined text-[20px] text-on-surface-variant transition-transform " +
                          (isOpen ? "rotate-180" : "")
                        }
                      >
                        expand_more
                      </span>
                    </div>

                    <p className="mt-sm text-label-sm uppercase tracking-wider text-tertiary">
                      {s.wandel}
                    </p>
                    <h3 className="mt-xs text-headline-sm text-on-surface">
                      {s.thinker}
                    </h3>

                    <p className="mt-sm flex items-start gap-sm text-body-md text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-tertiary">
                        bookmark
                      </span>
                      <span>
                        <span className="text-on-surface-variant">
                          Schablone:{" "}
                        </span>
                        <strong>{s.schablone}</strong>
                      </span>
                    </p>

                    {!isOpen && (
                      <p className="mt-md inline-flex items-center gap-xs text-label-sm text-tertiary">
                        <span className="material-symbols-outlined text-[16px]">
                          visibility
                        </span>
                        Warum dieses Bild? — antippen
                      </p>
                    )}

                    {isOpen && (
                      <div className="mt-md space-y-md border-t border-outline-variant pt-md">
                        <div>
                          <p className="flex items-center gap-xs text-label-sm uppercase tracking-wider text-tertiary">
                            <span className="material-symbols-outlined text-[16px]">
                              visibility
                            </span>
                            Warum dieses Bild?
                          </p>
                          <p className="mt-xs text-body-md text-on-surface-variant">
                            {s.imageWhy}
                          </p>
                        </div>

                        {s.quote && (
                          <p className="text-body-md italic text-on-surface-variant">
                            {s.quote}
                          </p>
                        )}

                        <p className="flex items-start gap-sm text-body-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px] text-tertiary">
                            {s.open ? "trending_flat" : "check_circle"}
                          </span>
                          <span>{s.enabled}</span>
                        </p>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Vollbild-Modus (Lightbox) */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Bild im Vollbild"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] flex flex-col gap-md bg-inverse-surface/95 p-md backdrop-blur-sm"
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Vollbild schliessen"
              className="inline-flex items-center gap-xs rounded-xl bg-inverse-on-surface/10 px-md py-sm text-label-md text-inverse-on-surface transition hover:bg-inverse-on-surface/20"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
              Schliessen
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full cursor-default rounded-lg object-contain shadow-lg"
            />
          </div>

          {lightbox.credit && (
            <p className="text-center text-label-sm text-inverse-on-surface/80">
              {lightbox.credit}
            </p>
          )}
        </div>
      )}
    </>
  );
}
