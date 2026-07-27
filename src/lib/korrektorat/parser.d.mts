/** Typen zu [parser.mjs](./parser.mjs). */

/** Wie der Text im Quelltext steht — entscheidet über das Maskieren. */
export type LiteralArt = "quoted" | "template" | "jsxattr" | "jsxtext";

/** Woher der Text kommt — nur zur Anzeige im Editor. */
export type Herkunft = "objekt" | "jsx-attribut" | "jsx-text" | "konstante";

export interface KorrekturFeld {
  /** Stabiler Strukturpfad, z.B. `BILDER_STORY/[0]/hotspots/[2]/titel`. */
  id: string;
  /** Deutsche Beschriftung fürs Formular. */
  label: string;
  /** Überschrift für die Gruppierung in der Seitenleiste. */
  section: string;
  /** `text` = einzeilig, `markdown` = Fliesstext. */
  kind: "text" | "markdown";
  origin: Herkunft;
  literal: LiteralArt;
  /** Der bearbeitbare Wert. */
  value: string;
  /** Wert wie geladen — Vergleichsanker für «geändert?». */
  original: string;
  /** Quelltext-Ausschnitt, Zeichen für Zeichen. */
  raw: string;
  /** Bei JSX-Text: der ganze Satz drumherum, als Lesehilfe. */
  context?: string;
  /** Wert auf dem Basis-Branch, falls er vom geladenen abweicht. */
  mainValue?: string;
  loc: { start: number; end: number };
}

export function extract(
  src: string,
  dateiname?: string,
): { fields: KorrekturFeld[]; source: string };

export function pruefeEdits(
  frischeFelder: KorrekturFeld[],
  eingaben: Array<{ id?: string; value?: string; loc?: { start?: number; end?: number } }>,
): {
  anzuwenden: KorrekturFeld[];
  uebersprungen: Array<{ id: string; grund: string }>;
};

export function apply(
  src: string,
  edits: Array<{
    id: string;
    value: string;
    original?: string;
    raw?: string;
    literal?: LiteralArt;
    loc: { start: number; end: number };
  }>,
): string;
