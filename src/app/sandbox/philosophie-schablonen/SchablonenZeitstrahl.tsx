"use client";

import { useEffect, useState } from "react";

/**
 * Schablonen-Zeitstrahl — Visualisierung für das Submodul "Philosophische
 * Perspektive" (Lernseite 2).
 *
 * Lernlogik: Jede Epoche ist ein eigenständiges Panel («ein Strang»):
 *   - Bildergalerie der Zeit (≥3 gemeinfreie Werke), nur für diese Epoche
 *     durchblätterbar (Vollbild mit ‹/›, Pfeiltasten, Zähler, Nachweis).
 *   - Drei nüchtern betitelte Bausteine, je EINZELN aufklappbar (man nimmt
 *     hinzu, was man will — muss aber nichts öffnen):
 *       1. Technische Errungenschaft
 *       2. Verunsicherung
 *       3. Philosophische Orientierungshilfe
 * Die drei sind aufeinander bezogen, aber sie stehen auch je für sich — kein
 * erzwungener Kausal-Zusammenhang.
 *
 * Bilder: lokal unter /public/art (Nachweis in public/art/CREDITS.md). Die
 * historischen Werke sind gemeinfrei (Wikimedia Commons), die Gegenwarts-Bilder
 * gemeinfrei bzw. NASA-Public-Domain; das Netz-Werk (Klaus Christ, 2024) mit
 * Genehmigung. Ganzes Werk sichtbar (object-contain).
 *
 * Self-contained Client-Komponente, keine Firebase-/Server-Logik
 * (hosting-/auth-agnostisch, migrationsbereit). Inhalte als Datenstruktur unten.
 */

interface GalleryImg {
  src: string;
  alt: string;
  credit: string;
  caption: string;
}

interface TechEvent {
  year: string;
  title: string;
  note: string;
  icon: string;
}

interface Station {
  id: string;
  epoch: string;
  span: string;
  lead: string;
  icon: string;
  gallery: GalleryImg[];
  tech: TechEvent[];
  unrestLead: string;
  unrest: string;
  thinker: string;
  schablone: string;
  quote?: string;
  orientation: string;
  open?: boolean; // offene Gegenwarts-Epoche (gestrichelter Rahmen)
}

const STATIONS: Station[] = [
  {
    id: "antike",
    epoch: "Antike",
    span: "5. Jh. v. Chr. – Spätantike",
    lead: "Vom Mythos zum Wissen.",
    icon: "account_balance",
    gallery: [
      {
        src: "/art/athens.jpg",
        alt: "Fresko „Die Schule von Athen“ von Raffael",
        credit: "Raffael, „Die Schule von Athen“, 1509–1511 · gemeinfrei",
        caption:
          "Platon zeigt nach oben in die Welt der Ideen, Aristoteles die Hand flach zur Erde: Wissen beginnt im genauen Hinsehen.",
      },
      {
        src: "/art/aristoteles_rembrandt.jpg",
        alt: "Gemälde „Aristoteles mit einer Büste Homers“ von Rembrandt",
        credit:
          "Rembrandt, „Aristoteles mit einer Büste Homers“, 1653 · gemeinfrei",
        caption:
          "Der Philosoph, die Hand auf dem Kopf des Dichters: Denken im Zwiegespräch mit der Überlieferung.",
      },
      {
        src: "/art/sokrates.jpg",
        alt: "Gemälde „Der Tod des Sokrates“ von Jacques-Louis David",
        credit: "J.-L. David, „Der Tod des Sokrates“, 1787 · gemeinfrei",
        caption:
          "Athen verurteilt den unbequemen Frager zum Tod — das Denken selbst wird gefährlich.",
      },
    ],
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
    unrestLead: "Der Logos entzaubert den Mythos.",
    unrest:
      "Die Götter-Erzählungen verlieren ihre Selbstverständlichkeit, die Sophisten verkaufen Argumente wie Waren — nichts scheint mehr festzustehen. Athen reagiert mit Härte: 399 v. Chr. muss Sokrates den Schierlingsbecher trinken, weil sein Fragen die alte Ordnung bedroht.",
    thinker: "Aristoteles",
    schablone: "Beobachten, ordnen, begründen",
    quote: "„Alle Menschen streben von Natur aus nach Wissen.“",
    orientation:
      "Aristoteles ordnet das Wissen systematisch: Logik, Naturkunde, Ethik, Politik. Er legt das Fundament, auf dem Wissenschaft und Empirie bis heute stehen — eine Schablone, die aus dem Staunen ein Verfahren macht.",
  },
  {
    id: "augustinus",
    epoch: "Spätantike → Mittelalter",
    span: "5.–15. Jahrhundert",
    lead: "Eine Weltordnung zerbricht — und wird neu.",
    icon: "church",
    gallery: [
      {
        src: "/art/augustine.jpg",
        alt: "Gemälde „Der heilige Augustinus“ von Philippe de Champaigne",
        credit:
          "Ph. de Champaigne, „Der heilige Augustinus“, um 1645 · gemeinfrei",
        caption:
          "Ein Lichtstrahl der Wahrheit trifft das brennende Herz: Der Blick wendet sich nach innen — zu Glaube und Gewissen.",
      },
      {
        src: "/art/mittelalter_stundenbuch.jpg",
        alt: "Buchmalerei „Oktober“ aus den Très Riches Heures des Duc de Berry",
        credit:
          "Brüder Limburg, „Très Riches Heures“ (Oktober), um 1416 · gemeinfrei",
        caption:
          "Die mittelalterliche Ordnung: Burg, Feldarbeit und Kalender — das Leben im Kreis von Jahreszeit und Glaube.",
      },
      {
        src: "/art/rom.jpg",
        alt: "Gemälde „Die Plünderung Roms durch die Barbaren im Jahr 410“ von Joseph-Noël Sylvestre",
        credit:
          "J.-N. Sylvestre, „Die Plünderung Roms durch die Barbaren“, 1890 · gemeinfrei",
        caption:
          "410 stürzen die Statuen: Mit dem Fall Roms fällt die Gewissheit einer ganzen Weltordnung.",
      },
    ],
    tech: [
      {
        year: "13.–14. Jh.",
        title: "Die mechanische Uhr",
        note: "Aus den Klöstern auf die Stadttürme: Gebet, Arbeit und Alltag laufen fortan im Takt der Uhr.",
        icon: "schedule",
      },
    ],
    unrestLead: "Rom fällt — wem gehört die Zukunft?",
    unrest:
      "410 n. Chr. plündern Alarichs Westgoten Rom — die „ewige Stadt“ fällt, und mit ihr die Gewissheit einer ganzen Weltordnung. Heiden geben den Christen die Schuld am Untergang, Christen zweifeln an Gottes Schutz.",
    thinker: "Augustinus",
    schablone: "Innerlichkeit, Glaube, Heilsgeschichte",
    quote: "„Im inneren Menschen wohnt die Wahrheit.“",
    orientation:
      "Augustinus antwortet mit „Vom Gottesstaat“ (413–426): Halt liegt nicht im irdischen Reich, sondern im Glauben und im inneren Menschen. Diese Schablone trägt ein ganzes Jahrtausend.",
  },
  {
    id: "kant",
    epoch: "Frühe Neuzeit → Aufklärung",
    span: "16.–18. Jahrhundert",
    lead: "Der Mensch verliert die Mitte — und wird mündig.",
    icon: "lightbulb",
    gallery: [
      {
        src: "/art/wanderer.jpg",
        alt: "Gemälde „Der Wanderer über dem Nebelmeer“ von Caspar David Friedrich",
        credit:
          "C. D. Friedrich, „Der Wanderer über dem Nebelmeer“, 1818 · gemeinfrei",
        caption:
          "Ein Einzelner deutet die Welt selbst — das mündige Individuum. Friedrich malt es Jahrzehnte nach Kant.",
      },
      {
        src: "/art/orrery.jpg",
        alt: "Gemälde „A Philosopher Lecturing on the Orrery“ von Joseph Wright of Derby",
        credit:
          "J. Wright of Derby, „A Philosopher … on the Orrery“, um 1766 · gemeinfrei",
        caption:
          "Im Kerzenlicht staunt eine Runde über das Modell des Sonnensystems: Wissenschaft wird zum neuen Zentrum.",
      },
      {
        src: "/art/lissabon.jpg",
        alt: "Kupferstich der Zerstörung Lissabons durch Erdbeben, Feuer und Flutwelle 1755",
        credit: "Kupferstich „Destruction de Lisbonne“, 1755 · gemeinfrei",
        caption:
          "1755 zertrümmert das Erdbeben von Lissabon den Glauben an eine gütige Ordnung der Welt.",
      },
    ],
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
    unrestLead: "Glaubensspaltung, Kopernikus, Lissabon.",
    unrest:
      "Die Druckpresse verbreitet Luthers Thesen — die Christenheit spaltet sich, Religionskriege verwüsten Europa. Das Teleskop nimmt der Erde die Mitte; Pascal gesteht: „Das ewige Schweigen dieser unendlichen Räume erschreckt mich.“ Und 1755 erschüttert das Erdbeben von Lissabon den Glauben an die gütige Ordnung der Welt.",
    thinker: "Kant",
    schablone: "Autonomie und Selbstdenken",
    quote:
      "„Sapere aude! Habe Mut, dich deines eigenen Verstandes zu bedienen.“",
    orientation:
      "Kant antwortet auf die Fragen seiner Gegenwart: Wenn weder Himmel noch Kirche Halt geben, muss die Vernunft ihn selbst schaffen. Seine Schablone ist das selbstbestimmte, mündige Individuum der Moderne.",
  },
  {
    id: "marx",
    epoch: "Industriemoderne",
    span: "19. Jahrhundert",
    lead: "Die Maschine ordnet die Gesellschaft neu.",
    icon: "factory",
    gallery: [
      {
        src: "/art/eisenwalzwerk.jpg",
        alt: "Gemälde „Das Eisenwalzwerk (Moderne Cyklopen)“ von Adolph Menzel",
        credit: "A. Menzel, „Das Eisenwalzwerk“, 1872–1875 · gemeinfrei",
        caption:
          "Glühendes Eisen, Räder, Riemen — und Menschen im Takt der Maschine. Die Arbeit steht nie still.",
      },
      {
        src: "/art/coalbrookdale.jpg",
        alt: "Gemälde „Coalbrookdale bei Nacht“ von Philippe-Jacques de Loutherbourg",
        credit:
          "P.-J. de Loutherbourg, „Coalbrookdale bei Nacht“, 1801 · gemeinfrei",
        caption:
          "Die Hochöfen färben den Nachthimmel feurig: das erhabene, unheimliche Gesicht der frühen Industrie.",
      },
      {
        src: "/art/london.jpg",
        alt: "Stich „Over London – by Rail“ von Gustave Doré",
        credit: "G. Doré, „Over London – by Rail“, 1872 · gemeinfrei",
        caption:
          "Enge Hinterhöfe im Schatten des Bahnviadukts: die Kehrseite des Fortschritts.",
      },
    ],
    tech: [
      {
        year: "1712 / 1769",
        title: "Die Dampfmaschine",
        note: "Newcomen pumpt Bergwerke leer, Watt macht die Fabrik überall möglich — Industrialisierung und Urbanisierung.",
        icon: "local_fire_department",
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
    unrestLead: "Fabrik, Elend, Revolution 1848.",
    unrest:
      "Die Fabrik saugt die Menschen vom Land in die Städte: 14-Stunden-Tage, Kinderarbeit, Elendsquartiere im Schatten der Bahnviadukte. Die alten Stände lösen sich auf, Familien- und Dorfordnungen zerreissen — 1848 explodiert Europa in Revolutionen.",
    thinker: "Marx",
    schablone: "Den Umbruch begreifen — und gestalten",
    quote: "„Alles Ständische und Stehende verdampft.“",
    orientation:
      "Marx begreift den Umbruch mitten in der Revolution von 1848: Gesellschaft ist kein Schicksal, sondern gemacht — und darum veränderbar. Weltweit populär wird diese Antwort erst Jahrzehnte später.",
  },
  {
    id: "jetzt",
    epoch: "Digitale Transformation",
    span: "Gegenwart",
    lead: "Alles wird vernetzt — KI tritt auf.",
    icon: "hub",
    gallery: [
      {
        src: "/art/wir-netz.png",
        alt: "Installation „Suche nach Bildern“ von Klaus Christ: ein Netz aus Fäden verbindet Figuren und Objekte rund um einen alten Computer.",
        credit: "Klaus Christ, „Suche nach Bildern“, 2024",
        caption:
          "Das „Wir“ von heute: kein Einzelner, sondern ein Netz aus Menschen und Dingen — Rohstoffe, Datacenter, Nutzer:innen, alle an denselben Fäden.",
      },
      {
        src: "/art/erde_nacht.jpg",
        alt: "Satellitenbild der Erde bei Nacht mit den Lichtern der Städte",
        credit: "NASA/NOAA, „Earth at Night“, 2012 · gemeinfrei (US-Gov)",
        caption:
          "Die elektrifizierte Erde bei Nacht: Städte und Netze zeichnen die vernetzte Welt in Lichtadern.",
      },
      {
        src: "/art/erde_tag.jpg",
        alt: "Foto der Erde aus dem All („Blue Marble“, Apollo 17)",
        credit: "NASA, „Blue Marble“ (Apollo 17), 1972 · gemeinfrei (US-Gov)",
        caption:
          "Der „Blaue Planet“ — eine Welt ohne Grenzen von aussen gesehen: Bezugspunkt eines globalen „Wir“.",
      },
    ],
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
    unrestLead: "Was ist noch echt? Das „Wir“ zerfällt.",
    unrest:
      "Was ist noch echt — Bild, Stimme, Video? Worauf kann ich mich beim Recherchieren verlassen, welche Fähigkeiten lohnen sich noch, wer hat das gemacht — ich, die KI, beide? Alles ist vernetzt, alles beschleunigt sich; viele fühlen sich getrieben — und das „Wir“ zerfällt.",
    thinker: "Wir — jetzt",
    schablone: "??? — das suchen wir gerade",
    orientation:
      "Die Philosophie sieht nicht voraus — sie antwortet im Blick auf das, was war, auf die Fragen ihrer Gegenwart. Für unsere Zeit entsteht diese Antwort gerade erst; genau hier setzt dieses Submodul an (Latour, Haraway, Gabriel …).",
    open: true,
  },
];

/** Baustein-Definitionen (nüchterne Titel, neutrale Icons, gedämpfte Akzente). */
const BAUSTEINE = [
  {
    key: "tech",
    label: "Technische Errungenschaft",
    icon: "precision_manufacturing",
    chip: "bg-primary-container text-on-primary-container",
    accent: "text-primary",
  },
  {
    key: "unrest",
    label: "Verunsicherung",
    icon: "warning",
    chip: "bg-error-container text-on-error-container",
    accent: "text-error",
  },
  {
    key: "orientation",
    label: "Philosophische Orientierungshilfe",
    icon: "explore",
    chip: "bg-tertiary-container text-on-tertiary-container",
    accent: "text-tertiary",
  },
] as const;

type Lightbox = { station: number; idx: number };

export default function SchablonenZeitstrahl() {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);

  const toggle = (key: string) =>
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const gallery = lightbox !== null ? STATIONS[lightbox.station].gallery : null;
  const current = gallery ? gallery[lightbox!.idx] : null;

  // Esc schliesst, ←/→ blättern innerhalb der Epoche, Scroll sperren
  useEffect(() => {
    if (lightbox === null) return;
    const len = STATIONS[lightbox.station].gallery.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight")
        setLightbox((lb) => (lb ? { ...lb, idx: (lb.idx + 1) % len } : lb));
      if (e.key === "ArrowLeft")
        setLightbox((lb) =>
          lb ? { ...lb, idx: (lb.idx - 1 + len) % len } : lb
        );
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  return (
    <>
      <ol className="flex flex-col gap-xl">
        {STATIONS.map((s, si) => {
          const isLast = si === STATIONS.length - 1;
          return (
            <li key={s.id} className="flex gap-md">
              {/* Rail: Icon-Knoten + Verbindungslinie */}
              <div className="flex flex-col items-center">
                <span
                  className={
                    s.open
                      ? "flex h-11 w-11 items-center justify-center rounded-xl bg-tertiary text-on-tertiary shadow-sm"
                      : "flex h-11 w-11 items-center justify-center rounded-xl bg-surface-container-high text-on-surface-variant"
                  }
                >
                  <span className="material-symbols-outlined text-[24px]">
                    {s.icon}
                  </span>
                </span>
                {!isLast && <span className="w-px flex-1 bg-outline-variant" />}
              </div>

              {/* Epochen-Panel */}
              <div
                className={
                  "min-w-0 flex-1 overflow-hidden rounded-xl border bg-surface-bright shadow-sm " +
                  (s.open ? "border-tertiary border-dashed" : "border-outline-variant")
                }
              >
                {/* Kopf */}
                <div className="border-b border-outline-variant p-lg">
                  <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                    {s.span}
                  </p>
                  <h3 className="mt-xs text-headline-md text-on-surface">
                    {s.epoch}
                  </h3>
                  <p className="mt-xs text-body-md text-on-surface-variant">
                    {s.lead}
                  </p>
                </div>

                {/* Bildergalerie der Zeit */}
                <div className="bg-surface-container-low p-lg">
                  <p className="mb-sm flex items-center gap-xs text-label-sm uppercase tracking-wider text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">
                      photo_library
                    </span>
                    Bilder der Zeit · {s.gallery.length}
                  </p>
                  <div className="grid grid-cols-2 gap-sm sm:grid-cols-3">
                    {s.gallery.map((g, gi) => (
                      <button
                        key={g.src}
                        type="button"
                        onClick={() => setLightbox({ station: si, idx: gi })}
                        aria-label={`${g.alt} — im Vollbild öffnen`}
                        className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-outline-variant bg-surface-bright"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={g.src}
                          alt={g.alt}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute right-xs top-xs inline-flex items-center justify-center rounded-lg bg-inverse-surface/70 p-xs text-inverse-on-surface opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="material-symbols-outlined text-[16px]">
                            fullscreen
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Drei Bausteine — je einzeln aufklappbar */}
                <div className="divide-y divide-outline-variant border-t border-outline-variant">
                  {BAUSTEINE.map((b) => {
                    const key = `${s.id}:${b.key}`;
                    const isOpen = openKeys.has(key);
                    const teaser =
                      b.key === "tech"
                        ? s.tech.map((t) => t.title).join(" · ")
                        : b.key === "unrest"
                        ? s.unrestLead
                        : `${s.thinker}: ${s.schablone}`;
                    return (
                      <div key={b.key}>
                        <button
                          type="button"
                          onClick={() => toggle(key)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center gap-md p-lg text-left transition-colors hover:bg-surface-container-low"
                        >
                          <span
                            className={
                              "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg " +
                              b.chip
                            }
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {b.icon}
                            </span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-body-md font-semibold text-on-surface">
                              {b.label}
                            </span>
                            <span className="block truncate text-body-sm text-on-surface-variant">
                              {teaser}
                            </span>
                          </span>
                          <span
                            className={
                              "material-symbols-outlined flex-shrink-0 text-[22px] text-on-surface-variant transition-transform " +
                              (isOpen ? "rotate-180" : "")
                            }
                          >
                            expand_more
                          </span>
                        </button>

                        {isOpen && (
                          <div className="px-lg pb-lg">
                            {b.key === "tech" && (
                              <div className="grid gap-sm sm:grid-cols-2">
                                {s.tech.map((t) => (
                                  <div
                                    key={t.title}
                                    className="rounded-lg border border-outline-variant bg-surface-container-low p-md"
                                  >
                                    <div className="flex items-center gap-sm">
                                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-container text-on-primary-container">
                                        <span className="material-symbols-outlined text-[18px]">
                                          {t.icon}
                                        </span>
                                      </span>
                                      <div className="min-w-0">
                                        <p className="text-label-sm text-primary">
                                          {t.year}
                                        </p>
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
                            )}

                            {b.key === "unrest" && (
                              <p className="border-l-4 border-error/40 pl-md text-body-md text-on-surface-variant">
                                {s.unrest}
                              </p>
                            )}

                            {b.key === "orientation" && (
                              <div className="space-y-sm">
                                <p className="flex items-start gap-sm text-body-md text-on-surface">
                                  <span className="material-symbols-outlined text-[18px] text-tertiary">
                                    bookmark
                                  </span>
                                  <span>
                                    <span className="text-on-surface-variant">
                                      {s.thinker} · Schablone:{" "}
                                    </span>
                                    <strong>{s.schablone}</strong>
                                  </span>
                                </p>
                                {s.quote && (
                                  <p className="text-body-md italic text-on-surface-variant">
                                    {s.quote}
                                  </p>
                                )}
                                <p className="text-body-md text-on-surface-variant">
                                  {s.orientation}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Vollbild-Galerie (pro Epoche) */}
      {current && gallery && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Bild im Vollbild"
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[100] flex flex-col gap-sm bg-inverse-surface/95 p-md backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <span className="rounded-xl bg-inverse-on-surface/10 px-md py-sm text-label-md text-inverse-on-surface">
              {STATIONS[lightbox!.station].epoch} · {lightbox!.idx + 1} /{" "}
              {gallery.length}
            </span>
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

          <div className="flex min-h-0 flex-1 items-center justify-center gap-sm">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lb) =>
                  lb
                    ? { ...lb, idx: (lb.idx - 1 + gallery.length) % gallery.length }
                    : lb
                );
              }}
              aria-label="Vorheriges Bild"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-inverse-on-surface/10 text-inverse-on-surface transition hover:bg-inverse-on-surface/20"
            >
              <span className="material-symbols-outlined text-[24px]">
                chevron_left
              </span>
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.src}
              alt={current.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full min-w-0 max-w-full cursor-default rounded-lg object-contain shadow-lg"
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((lb) =>
                  lb ? { ...lb, idx: (lb.idx + 1) % gallery.length } : lb
                );
              }}
              aria-label="Nächstes Bild"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-inverse-on-surface/10 text-inverse-on-surface transition hover:bg-inverse-on-surface/20"
            >
              <span className="material-symbols-outlined text-[24px]">
                chevron_right
              </span>
            </button>
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-body-sm text-inverse-on-surface">
              {current.caption}
            </p>
            <p className="mt-xs text-label-sm text-inverse-on-surface/80">
              {current.credit}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
