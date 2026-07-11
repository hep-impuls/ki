/**
 * Gewebe — schlichte SVG-Dekorationen für Lernseite 2 («Eine ganz neue
 * Partnerschaft»).
 *
 * Gestaltungsidee: keine typische KI-Symbolik (Roboter, Neuronen-Glow,
 * Gradients), sondern das Fadenhafte / Knotenhafte / Gewebhafte — Akteure
 * als Knoten, Beziehungen als Fäden. Vorbilder: natalitaet.com («das Gewebe
 * betreten») und antrhizom.com (Rhizom-Netz), hier noch reduzierter.
 *
 * Regeln:
 *  - nur Theme-Tokens via Tailwind-Klassen (stroke-…/fill-… aus
 *    tailwind.config.ts), keine Fremdfarben, keine Filter/Verläufe;
 *  - alle Koordinaten deterministisch von Hand gesetzt (kein Math.random —
 *    Server- und Client-Render müssen identisch sein);
 *  - Knoten liegen exakt auf Fadenenden bzw. -kreuzungen;
 *  - alles rein dekorativ (aria-hidden), Server-kompatibel (kein "use client");
 *  - sanfte Hover-Reaktion (CSS-only): Akzentknoten wachsen, Akzentfäden
 *    treten hervor — beim Überfahren des Musters selbst («group» auf dem
 *    SVG) oder der umgebenden Karte («group» auf dem Link).
 *
 * Interaktive Gegenstücke: FadenNetz.tsx (Muster zum Nachfahren mit
 * Weisheiten) und KnotenNetz.tsx (antippbare Konstellationen).
 */

/** Hover-Klassen für Akzentknoten (Punkt wächst) bzw. -ringe/-fäden. */
const HOVER_DOT =
  "origin-center [transform-box:fill-box] transition-transform duration-300 group-hover:scale-125";
const HOVER_RING = "transition-opacity duration-300 group-hover:opacity-90";

/** Loses Fadenband für Seitenköpfe: eine Fadenspur mit Knoten, zwei Querfäden. */
export function GewebeBand({ className = "" }: { className?: string }) {
  // Knotenpunkte, durch die die Hauptspur läuft (von Hand gesetzt).
  const knots: [number, number][] = [
    [10, 58],
    [96, 34],
    [190, 66],
    [285, 28],
    [370, 54],
    [470, 30],
    [560, 64],
    [645, 38],
    [712, 52],
  ];
  return (
    <svg
      viewBox="0 0 720 96"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      className={"group h-16 w-full max-w-3xl sm:h-20 " + className}
    >
      {/* Hauptfaden — läuft durch alle Knoten */}
      <path
        d="M10 58 C40 44 70 38 96 34 C130 30 160 54 190 66 C220 76 255 42 285 28 C315 16 345 44 370 54 C405 66 440 38 470 30 C505 22 530 52 560 64 C590 74 620 46 645 38 C670 32 695 44 712 52"
        fill="none"
        strokeWidth="1"
        className="stroke-outline-variant"
      />
      {/* Querfäden — spannen das Gewebe auf */}
      <line x1="96" y1="34" x2="370" y2="54" strokeWidth="0.75" className="stroke-outline-variant" opacity="0.6" />
      <line x1="285" y1="28" x2="560" y2="64" strokeWidth="0.75" className="stroke-outline-variant" opacity="0.6" />
      <line x1="470" y1="30" x2="712" y2="52" strokeWidth="0.75" className="stroke-outline-variant" opacity="0.6" />
      {/* Akzentfaden */}
      <path
        d="M10 58 C80 72 140 70 190 66 C250 60 310 58 370 54"
        fill="none"
        strokeWidth="1"
        className={"stroke-tertiary " + HOVER_RING}
        opacity="0.55"
      />
      {/* Knoten */}
      {knots.map(([x, y], i) =>
        i === 4 ? (
          <g key={i}>
            <circle cx={x} cy={y} r="6.5" fill="none" strokeWidth="1" className={"stroke-tertiary " + HOVER_RING} opacity="0.5" />
            <circle cx={x} cy={y} r="3" className={"fill-tertiary " + HOVER_DOT} />
          </g>
        ) : (
          <circle key={i} cx={x} cy={y} r="2" className={"fill-outline " + HOVER_DOT} opacity="0.7" />
        )
      )}
    </svg>
  );
}

/** Vertikaler Faden zwischen zwei Stationen (dehnt sich mit der Höhe). */
export function FadenVertikal({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 100"
      preserveAspectRatio="none"
      aria-hidden
      className={"w-6 flex-1 " + className}
    >
      <path
        d="M12 0 C17 20 7 45 12 65 C15 78 10 90 12 100"
        fill="none"
        strokeWidth="1.25"
        vectorEffect="non-scaling-stroke"
        className="stroke-outline-variant"
      />
    </svg>
  );
}

/** Stations-Knoten auf dem Faden (Ring + Punkt). */
export function Knoten({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={"group h-10 w-10 flex-shrink-0 " + className}>
      <circle cx="20" cy="20" r="11" fill="none" strokeWidth="1" className={"stroke-tertiary " + HOVER_RING} opacity="0.45" />
      <circle cx="20" cy="20" r="5" className={"fill-tertiary " + HOVER_DOT} />
    </svg>
  );
}

/** Horizontaler Trennfaden mit mittigem Knoten (für Abschnittswechsel). */
export function FadenDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 24"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      className={"group h-6 w-full max-w-3xl " + className}
    >
      <path
        d="M0 12 C80 6 160 18 240 12 C320 6 400 18 480 12"
        fill="none"
        strokeWidth="1"
        className="stroke-outline-variant"
      />
      <circle cx="240" cy="12" r="5.5" fill="none" strokeWidth="1" className={"stroke-tertiary " + HOVER_RING} opacity="0.5" />
      <circle cx="240" cy="12" r="2.5" className={"fill-tertiary " + HOVER_DOT} />
    </svg>
  );
}

export type SignaturVariante = "auftritt" | "epochen" | "gewebe" | "orakel";

/**
 * Kleine Konstellations-Signatur je Themenbereich:
 *  - «auftritt»: ein neuer Knoten tritt ins Netz (Zentrum mit Fäden nach aussen)
 *  - «epochen»: fünf Knoten auf einer Zeitlinie, der letzte (Gegenwart) betont
 *  - «gewebe»:  kleines Geflecht aus Kett- und Schussfäden mit Kreuzungsknoten
 *  - «orakel»:  Fäden laufen in einem Knoten zusammen, der antwortet (Bögen)
 */
export function Signatur({
  variante,
  className = "",
}: {
  variante: SignaturVariante;
  className?: string;
}) {
  if (variante === "auftritt") {
    const outer: [number, number][] = [
      [18, 20],
      [58, 8],
      [102, 16],
      [14, 74],
      [64, 90],
      [104, 78],
    ];
    return (
      <svg viewBox="0 0 120 96" aria-hidden className={"group h-20 w-24 " + className}>
        {outer.map(([x, y], i) => (
          <line key={i} x1="60" y1="48" x2={x} y2={y} strokeWidth="1" className="stroke-outline-variant" />
        ))}
        <line x1="18" y1="20" x2="58" y2="8" strokeWidth="0.75" className="stroke-outline-variant" opacity="0.5" />
        <line x1="102" y1="16" x2="104" y2="78" strokeWidth="0.75" className="stroke-outline-variant" opacity="0.5" />
        {outer.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" className={"fill-outline " + HOVER_DOT} opacity="0.6" />
        ))}
        <circle cx="60" cy="48" r="9" fill="none" strokeWidth="1" className={"stroke-tertiary " + HOVER_RING} opacity="0.45" />
        <circle cx="60" cy="48" r="4" className={"fill-tertiary " + HOVER_DOT} />
      </svg>
    );
  }

  if (variante === "epochen") {
    const pts: [number, number][] = [
      [12, 72],
      [36, 58],
      [60, 50],
      [84, 40],
      [108, 26],
    ];
    return (
      <svg viewBox="0 0 120 96" aria-hidden className={"group h-20 w-24 " + className}>
        <path
          d="M12 72 C22 66 28 62 36 58 C44 54 52 52 60 50 C68 48 76 44 84 40 C92 36 100 31 108 26"
          fill="none"
          strokeWidth="1"
          className="stroke-outline-variant"
        />
        {pts.slice(0, 4).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" className={"fill-outline " + HOVER_DOT} opacity="0.65" />
        ))}
        <circle cx="108" cy="26" r="8" fill="none" strokeWidth="1" className={"stroke-tertiary " + HOVER_RING} opacity="0.45" />
        <circle cx="108" cy="26" r="3.5" className={"fill-tertiary " + HOVER_DOT} />
      </svg>
    );
  }

  if (variante === "orakel") {
    return (
      <svg viewBox="0 0 120 96" aria-hidden className={"group h-20 w-24 " + className}>
        {/* Drei Fäden laufen im Orakel zusammen */}
        <path d="M8 18 C30 26 52 37 72 46" fill="none" strokeWidth="1" className="stroke-outline-variant" />
        <path d="M6 50 C28 50 50 49 70 48" fill="none" strokeWidth="1" className="stroke-outline-variant" />
        <path d="M10 82 C32 72 53 60 72 50" fill="none" strokeWidth="1" className="stroke-outline-variant" />
        <circle cx="8" cy="18" r="2" className={"fill-outline " + HOVER_DOT} opacity="0.6" />
        <circle cx="6" cy="50" r="2" className={"fill-outline " + HOVER_DOT} opacity="0.6" />
        <circle cx="10" cy="82" r="2" className={"fill-outline " + HOVER_DOT} opacity="0.6" />
        {/* Das Orakel: Ring + Kern */}
        <circle cx="76" cy="48" r="14" fill="none" strokeWidth="1" className="stroke-outline-variant" opacity="0.7" />
        <circle cx="76" cy="48" r="8" fill="none" strokeWidth="1" className={"stroke-tertiary " + HOVER_RING} opacity="0.45" />
        <circle cx="76" cy="48" r="3.5" className={"fill-tertiary " + HOVER_DOT} />
        {/* Es antwortet: Bögen nach rechts */}
        <path d="M96 36 C102 44 102 52 96 60" fill="none" strokeWidth="1" className={"stroke-tertiary " + HOVER_RING} opacity="0.4" />
        <path d="M104 30 C112 40 112 56 104 66" fill="none" strokeWidth="0.75" className="stroke-outline-variant" opacity="0.6" />
      </svg>
    );
  }

  // «gewebe»
  return (
    <svg viewBox="0 0 120 96" aria-hidden className={"group h-20 w-24 " + className}>
      {/* Schussfäden (waagrecht) */}
      <path d="M6 32 C14 30 22 29 30 28 C46 26 78 30 94 28 C102 27 108 29 114 31" fill="none" strokeWidth="1" className="stroke-outline-variant" />
      <path d="M6 50 C24 51 44 52 62 52 C80 52 98 53 114 51" fill="none" strokeWidth="1" className="stroke-outline-variant" />
      <path d="M6 78 C14 77 22 76 30 76 C52 75 76 77 94 76 C102 76 108 77 114 78" fill="none" strokeWidth="1" className="stroke-outline-variant" />
      {/* Kettfäden (senkrecht) */}
      <path d="M32 8 C31 14 30 21 30 28 C30 44 30 60 30 76 C30 83 31 89 32 94" fill="none" strokeWidth="0.75" className="stroke-outline-variant" opacity="0.7" />
      <path d="M60 8 C61 22 62 37 62 52 C62 66 61 80 60 94" fill="none" strokeWidth="0.75" className="stroke-outline-variant" opacity="0.7" />
      <path d="M96 8 C95 14 94 21 94 28 C94 44 94 60 94 76 C94 83 95 89 96 94" fill="none" strokeWidth="0.75" className="stroke-outline-variant" opacity="0.7" />
      {/* Kreuzungsknoten */}
      <circle cx="30" cy="28" r="2.5" className={"fill-outline " + HOVER_DOT} opacity="0.65" />
      <circle cx="94" cy="28" r="2.5" className={"fill-outline " + HOVER_DOT} opacity="0.65" />
      <circle cx="30" cy="76" r="2.5" className={"fill-outline " + HOVER_DOT} opacity="0.65" />
      <circle cx="94" cy="76" r="2.5" className={"fill-outline " + HOVER_DOT} opacity="0.65" />
      <circle cx="62" cy="52" r="7" fill="none" strokeWidth="1" className={"stroke-tertiary " + HOVER_RING} opacity="0.45" />
      <circle cx="62" cy="52" r="3.5" className={"fill-tertiary " + HOVER_DOT} />
    </svg>
  );
}
