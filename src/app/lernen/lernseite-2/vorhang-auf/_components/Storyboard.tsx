/**
 * Storyboard — «Die KI-Story»: vom Traum, Dingen Leben einzuhauchen, bis zur
 * Gegenwart. Zwölf Stationen (sechs gemeinfreie Bilder, sechs gestaltete
 * Panels im Gewebe-Stil) und darunter die Phasen der aktuellen KI — die
 * letzten beiden bewusst offen gelassen.
 *
 * Bilder: public/art/storyboard/ (Nachweis in public/art/CREDITS.md,
 * alle gemeinfrei; Supercomputer: NASA / US-Gov). Gestaltete Panels nur mit
 * Theme-Tokens, deterministisch — keine Fremdfarben, kein Glow.
 */

interface Station {
  nr: string;
  titel: string;
  text: string;
  bild?: { src: string; alt: string; credit: string };
  motiv?: "dartmouth" | "code" | "terminal" | "winter" | "scatter" | "layers";
}

const STATIONEN: Station[] = [
  {
    nr: "01",
    titel: "Mythos & Ursprung",
    text: "Der Golem: aus Lehm geformt, durch Schriftzeichen belebt — die Ursage vom belebten Ding.",
    bild: {
      src: "/art/storyboard/golem.jpg",
      alt: "Zeichnung: Rabbi Löw erweckt den Golem",
      credit: "Mikoláš Aleš, 1899 · gemeinfrei",
    },
  },
  {
    nr: "02",
    titel: "Künstliche Wesen",
    text: "Der Homunkulus: im Labor der Alchemie erschaffen — Leben aus der Retorte.",
    bild: {
      src: "/art/storyboard/homunkulus.jpg",
      alt: "Stich: Wagner und Mephisto vor dem Homunkulus in der Phiole (Faust II)",
      credit: "F. Simm, Illustration zu «Faust II» · gemeinfrei",
    },
  },
  {
    nr: "03",
    titel: "Frühe Automaten",
    text: "Der «Schachtürke» (1770): Ein Automat scheint zu denken — und Menschen lassen sich täuschen.",
    bild: {
      src: "/art/storyboard/schachtuerke.jpg",
      alt: "Kupferstich des Schachtürken von Wolfgang von Kempelen",
      credit: "J. F. zu Racknitz, 1789 · gemeinfrei",
    },
  },
  {
    nr: "04",
    titel: "Literatur als Warnung",
    text: "«Frankenstein» (1818): Das erschaffene Wesen entgleitet seinem Schöpfer.",
    bild: {
      src: "/art/storyboard/frankenstein.jpg",
      alt: "Frontispiz der Frankenstein-Ausgabe von 1831",
      credit: "Th. von Holst, Frontispiz 1831 · gemeinfrei",
    },
  },
  {
    nr: "05",
    titel: "Rechenmaschinen",
    text: "Babbage & Lovelace: Die programmierbare Maschine wird gedacht — und mit ihr ihre Grenzen.",
    bild: {
      src: "/art/storyboard/babbage.jpg",
      alt: "Holzstich der Differenzmaschine von Charles Babbage",
      credit: "Holzstich, 1853 · gemeinfrei",
    },
  },
  {
    nr: "06",
    titel: "Geburt der KI",
    text: "Dartmouth 1956: Der Begriff «Künstliche Intelligenz» wird geprägt.",
    motiv: "dartmouth",
  },
  {
    nr: "07",
    titel: "Symbolische KI",
    text: "Regeln und Logik: WENN–DANN-Systeme dominieren die frühe KI.",
    motiv: "code",
  },
  {
    nr: "08",
    titel: "Expertensysteme",
    text: "Wissensbasierte Systeme lösen Spezialaufgaben — etwa in der Medizin.",
    motiv: "terminal",
  },
  {
    nr: "09",
    titel: "KI-Winter",
    text: "Enttäuschte Erwartungen: Geld und Glaube an die KI frieren ein.",
    motiv: "winter",
  },
  {
    nr: "10",
    titel: "Statistische KI",
    text: "Maschinelles Lernen hält Einzug: Daten statt Regeln.",
    motiv: "scatter",
  },
  {
    nr: "11",
    titel: "Deep Learning",
    text: "Neuronale Netze mit vielen Schichten ermöglichen neue Durchbrüche.",
    motiv: "layers",
  },
  {
    nr: "12",
    titel: "Big Data & Gegenwart",
    text: "Datenmengen und Rechenleistung: KI durchdringt den Alltag.",
    bild: {
      src: "/art/storyboard/supercomputer.jpg",
      alt: "Rechnerreihen des Pleiades-Supercomputers der NASA",
      credit: "NASA (Pleiades) · gemeinfrei (US-Gov)",
    },
  },
];

const PHASEN: {
  nr: number;
  titel: string;
  text: string;
  icon: string;
  offen?: boolean;
}[] = [
  { nr: 1, titel: "Wahrnehmung", icon: "visibility", text: "KI erkennt Bilder, Sprache und Muster." },
  { nr: 2, titel: "Verstehen", icon: "psychology", text: "KI verarbeitet Sprache, Kontext und Zusammenhänge." },
  { nr: 3, titel: "Generieren", icon: "palette", text: "KI erzeugt Texte, Bilder, Musik — neuen Inhalt." },
  { nr: 4, titel: "Entscheiden", icon: "alt_route", text: "KI trifft Entscheidungen und beeinflusst Prozesse." },
  { nr: 5, titel: "Kollaborieren", icon: "handshake", text: "Bleibt offen — genau hier setzt dieses Modul an.", offen: true },
  { nr: 6, titel: "Transzendieren?", icon: "question_mark", text: "Bleibt offen — Bewusstsein? Ethik? Zukunft?", offen: true },
];

/** Gestaltete Panels (Gewebe-Stil, viewBox 160×120). */
function Motiv({ art }: { art: NonNullable<Station["motiv"]> }) {
  if (art === "dartmouth") {
    // Runder Tisch, sieben Köpfe — einer setzt den Begriff in die Welt.
    const koepfe: [number, number][] = [
      [80, 22], [116, 34], [130, 60], [116, 86], [80, 98], [44, 86], [30, 60],
    ];
    return (
      <svg viewBox="0 0 160 120" aria-hidden className="h-full w-full">
        <ellipse cx="80" cy="60" rx="42" ry="18" fill="none" strokeWidth="1" className="stroke-outline-variant" />
        {koepfe.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 0 ? 4.5 : 3.5} className={i === 0 ? "fill-tertiary" : "fill-outline"} opacity={i === 0 ? 1 : 0.6} />
        ))}
        <circle cx="80" cy="22" r="9" fill="none" strokeWidth="1" className="stroke-tertiary" opacity="0.45" />
      </svg>
    );
  }
  if (art === "code") {
    return (
      <svg viewBox="0 0 160 120" aria-hidden className="h-full w-full">
        <text x="22" y="42" fontSize="11" fontFamily="monospace" className="fill-tertiary">WENN</text>
        <text x="58" y="42" fontSize="11" fontFamily="monospace" className="fill-on-surface-variant">hungrig UND essen</text>
        <text x="22" y="62" fontSize="11" fontFamily="monospace" className="fill-tertiary">DANN</text>
        <text x="58" y="62" fontSize="11" fontFamily="monospace" className="fill-on-surface-variant">iss</text>
        <text x="22" y="82" fontSize="11" fontFamily="monospace" className="fill-tertiary">SONST</text>
        <text x="58" y="82" fontSize="11" fontFamily="monospace" className="fill-on-surface-variant">suche essen</text>
      </svg>
    );
  }
  if (art === "terminal") {
    return (
      <svg viewBox="0 0 160 120" aria-hidden className="h-full w-full">
        <rect x="20" y="20" width="120" height="80" rx="4" fill="none" strokeWidth="1" className="stroke-outline-variant" />
        <line x1="20" y1="34" x2="140" y2="34" strokeWidth="1" className="stroke-outline-variant" opacity="0.6" />
        <text x="28" y="52" fontSize="9" fontFamily="monospace" className="fill-on-surface-variant">DIAGNOSE: Infektion</text>
        <text x="28" y="68" fontSize="9" fontFamily="monospace" className="fill-on-surface-variant">EMPFEHLUNG:</text>
        <text x="28" y="82" fontSize="9" fontFamily="monospace" className="fill-on-surface-variant">Antibiotikum</text>
        <rect x="98" y="88" width="6" height="8" className="fill-tertiary" />
      </svg>
    );
  }
  if (art === "winter") {
    // Gerissene, eingefrorene Fäden — die Arbeit ruht.
    return (
      <svg viewBox="0 0 160 120" aria-hidden className="h-full w-full">
        <path d="M16 44 C36 38 52 42 66 44" fill="none" strokeWidth="1" className="stroke-outline-variant" opacity="0.45" />
        <path d="M88 40 C110 36 128 42 144 38" fill="none" strokeWidth="1" className="stroke-outline-variant" opacity="0.45" />
        <path d="M16 78 C44 84 66 78 84 80" fill="none" strokeWidth="1" className="stroke-outline-variant" opacity="0.45" />
        <path d="M104 82 C122 84 134 80 144 82" fill="none" strokeWidth="1" className="stroke-outline-variant" opacity="0.45" />
        {[[74, 42], [94, 80], [40, 60], [120, 60], [64, 96], [100, 24]].map(([x, y], i) => (
          <g key={i} className="stroke-outline" opacity="0.5">
            <line x1={x - 4} y1={y} x2={x + 4} y2={y} strokeWidth="0.75" />
            <line x1={x} y1={y - 4} x2={x} y2={y + 4} strokeWidth="0.75" />
            <line x1={x - 3} y1={y - 3} x2={x + 3} y2={y + 3} strokeWidth="0.75" />
            <line x1={x - 3} y1={y + 3} x2={x + 3} y2={y - 3} strokeWidth="0.75" />
          </g>
        ))}
      </svg>
    );
  }
  if (art === "scatter") {
    const a: [number, number][] = [[34, 38], [46, 52], [30, 62], [56, 34], [44, 74], [62, 58], [38, 88], [70, 44]];
    const b: [number, number][] = [[96, 78], [110, 62], [122, 84], [104, 94], [130, 68], [118, 46], [136, 92], [92, 56]];
    return (
      <svg viewBox="0 0 160 120" aria-hidden className="h-full w-full">
        <line x1="34" y1="104" x2="132" y2="18" strokeWidth="1" className="stroke-outline-variant" />
        {a.map(([x, y], i) => (
          <circle key={`a${i}`} cx={x} cy={y} r="3" className="fill-outline" opacity="0.55" />
        ))}
        {b.map(([x, y], i) => (
          <circle key={`b${i}`} cx={x} cy={y} r="3" className="fill-tertiary" opacity="0.8" />
        ))}
      </svg>
    );
  }
  // «layers» — Schichten eines neuronalen Netzes
  const schichten: [number, number[]][] = [
    [40, [30, 54, 78, 102]],
    [80, [24, 44, 64, 84, 104]],
    [120, [44, 64, 84]],
  ];
  return (
    <svg viewBox="0 0 160 120" aria-hidden className="h-full w-full">
      {schichten.slice(0, -1).map(([x, ys], si) =>
        ys.map((y) =>
          schichten[si + 1][1].map((y2) => (
            <line
              key={`${si}-${y}-${y2}`}
              x1={x}
              y1={y}
              x2={schichten[si + 1][0]}
              y2={y2}
              strokeWidth="0.5"
              className="stroke-outline-variant"
              opacity="0.5"
            />
          )),
        ),
      )}
      {schichten.map(([x, ys], si) =>
        ys.map((y) => (
          <circle
            key={`${si}-${y}`}
            cx={x}
            cy={y}
            r="3.5"
            className={si === 1 ? "fill-tertiary" : "fill-outline"}
            opacity={si === 1 ? 0.85 : 0.6}
          />
        )),
      )}
    </svg>
  );
}

export default function Storyboard({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      {/* Zwölf Stationen */}
      <ol className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
        {STATIONEN.map((s) => (
          <li
            key={s.nr}
            className="overflow-hidden rounded-xl border border-outline-variant bg-surface-bright shadow-sm"
          >
            <div className="aspect-[4/3] bg-surface-container-low">
              {s.bild ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.bild.src}
                  alt={s.bild.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                s.motiv && <Motiv art={s.motiv} />
              )}
            </div>
            <div className="border-t border-outline-variant p-md">
              <p className="text-label-sm uppercase tracking-wider text-tertiary">
                {s.nr} · {s.titel}
              </p>
              <p className="mt-xs text-body-sm text-on-surface-variant">{s.text}</p>
              {s.bild && (
                <p className="mt-sm text-label-sm text-on-surface-variant opacity-70">
                  {s.bild.credit}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {/* Phasen der aktuellen KI */}
      <h3 className="mt-xl text-headline-sm text-on-surface">
        Phasen der aktuellen KI
      </h3>
      <ol className="mt-md grid gap-md sm:grid-cols-2 lg:grid-cols-3">
        {PHASEN.map((p) => (
          <li
            key={p.nr}
            className={
              "rounded-xl border p-md " +
              (p.offen
                ? "border-dashed border-tertiary bg-surface-container-low"
                : "border-outline-variant bg-surface-bright shadow-sm")
            }
          >
            <div className="flex items-center gap-sm">
              <span
                className={
                  "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg " +
                  (p.offen
                    ? "bg-surface-bright text-tertiary"
                    : "bg-tertiary-container text-on-tertiary-container")
                }
              >
                <span className="material-symbols-outlined text-[20px]">
                  {p.icon}
                </span>
              </span>
              <div className="min-w-0">
                <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Phase {p.nr}
                </p>
                <p className="text-body-sm font-semibold text-on-surface">
                  {p.titel}
                </p>
              </div>
            </div>
            <p className="mt-sm text-body-sm text-on-surface-variant">{p.text}</p>
          </li>
        ))}
      </ol>

      <p className="mt-lg text-body-sm italic text-on-surface-variant">
        Die Geschichte der KI ist die Geschichte des menschlichen Traums, Leben
        zu erschaffen — dieses Storyboard bleibt vorne und hinten offen.
      </p>
    </div>
  );
}
