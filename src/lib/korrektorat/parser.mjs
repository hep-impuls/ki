/**
 * Korrektorat — TSX/TS-Parser: `extract()` zerlegt eine Quelldatei in
 * korrigierbare Textfelder mit Zeichen-Offsets, `apply()` schreibt geänderte
 * Werte an genau diese Offsets zurück.
 *
 * Vorbild ist der MDX-Parser des 10mio-Korrektorats. Der Unterschied: ki26
 * hält seine Inhalte nicht in MDX, sondern in TypeScript — in `_data/*.ts`,
 * in Inhalts-Arrays am Kopf der Seiten und als JSX-Text bzw. -Attribute. Darum
 * läuft hier der echte TypeScript-Compiler statt eines Markdown-Parsers;
 * reguläre Ausdrücke reichen für Rückschreiben nicht (siehe die Selbstauskunft
 * von `docs/inhalte-export.js`, das nur liest).
 *
 * Zwei Eigenschaften, auf die sich alles andere stützt:
 *
 *  1. **Byte-Treue.** `apply(src, extract(src).fields)` mit unveränderten
 *     Werten ergibt exakt `src`. Geprüft von
 *     `scripts/korrektorat/roundtrip-test.mjs` über alle Inhaltsdateien.
 *  2. **Offset-Prüfung.** Jedes Feld trägt seine Position. Wer mit veralteten
 *     Positionen speichert, wird abgelehnt statt stillschweigend an die falsche
 *     Stelle geschrieben.
 */

import ts from "typescript";
import {
  CONST_SECTIONS,
  HEADING_TAGS,
  JSX_TEXT_ATTRS,
  SECTION_COMPONENTS,
  SKIP_KEYS,
  TITLE_KEYS,
  humanizeConst,
  istTechnisch,
  kindFor,
  labelFor,
} from "./policy.mjs";

/** Zeilenbreite, auf die geänderter JSX-Text neu umbrochen wird. */
const ZEILENBREITE = 92;

/**
 * Zerlegt eine Quelldatei in korrigierbare Felder.
 *
 * @param {string} src Dateiinhalt
 * @param {string} [dateiname] steuert TSX- vs. TS-Modus
 * @returns {{ fields: Array<object>, source: string }}
 */
export function extract(src, dateiname = "datei.tsx") {
  const sf = ts.createSourceFile(
    dateiname,
    src,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    dateiname.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  const felder = [];
  const belegt = new Map(); // id → Zähler, damit IDs eindeutig bleiben
  const zustand = { sticky: "" }; // laufende Überschrift (Dokumentreihenfolge)

  /** Abschnittsname für ein Feld: laufende Überschrift + max. 2 Objekt-Ebenen. */
  function abschnitt(scoped) {
    const teile = [zustand.sticky, ...scoped].filter(Boolean);
    return teile.slice(-2).join(" · ") || "Allgemein";
  }

  function feldHinzu({ ctx, key, literal, value, loc, origin, context }) {
    if (!value.trim()) return;
    let id = ctx.pfad.join("/") || key || "feld";
    if (belegt.has(id)) {
      const n = belegt.get(id) + 1;
      belegt.set(id, n);
      id = `${id}~${n}`;
    } else {
      belegt.set(id, 1);
    }
    felder.push({
      id,
      label: beschriftung(key),
      section: abschnitt(ctx.scoped),
      kind: kindFor(key, value),
      origin,
      literal,
      value,
      /** Wert wie geladen — Vergleichsanker für «geändert?» und für `apply()`. */
      original: value,
      /** Quelltext-Ausschnitt, Zeichen für Zeichen. Siehe `apply()`. */
      raw: src.slice(loc.start, loc.end),
      ...(context ? { context } : {}),
      loc,
    });
  }

  /**
   * Nimmt der Knoten als Textfeld? Gilt für Zeichenketten in Objektwerten,
   * Array-Elementen, Konstanten und JSX-Attributen.
   *
   * `jsxAttribut` unterscheidet die beiden Zeichenketten-Welten: in einem
   * JS-String maskiert man mit Backslash, in einem JSX-Attribut **nicht** —
   * dort ist `\"` ein Syntaxfehler und es braucht `&quot;`.
   */
  function versucheLiteral(node, ctx, key, origin, jsxAttribut = false) {
    if (ts.isStringLiteral(node)) {
      const start = node.getStart(sf);
      const end = node.getEnd();
      const anfuehrung = src[start];
      if (anfuehrung !== '"' && anfuehrung !== "'") return true; // defensiv: nicht anfassen
      if (istTechnisch(node.text)) return true;
      // Der TypeScript-Scanner löst in JSX-Attributen keine HTML-Entitäten auf
      // — `titel="Kontext &amp; Mehr"` käme sonst mit `&amp;` im Formular an.
      feldHinzu({
        ctx,
        key,
        literal: jsxAttribut ? "jsxattr" : "quoted",
        value: jsxAttribut ? entitaetenAuf(node.text) : node.text,
        loc: { start: start + 1, end: end - 1 },
        origin,
      });
      return true;
    }
    if (ts.isNoSubstitutionTemplateLiteral(node)) {
      const start = node.getStart(sf);
      const end = node.getEnd();
      if (src[start] !== "`") return true;
      if (istTechnisch(node.text)) return true;
      feldHinzu({
        ctx,
        key,
        literal: "template",
        value: node.text,
        loc: { start: start + 1, end: end - 1 },
        origin,
      });
      return true;
    }
    return false;
  }

  /* ── Baumlauf ──────────────────────────────────────────────────────────── */

  function walk(node, ctx) {
    // Konstanten der obersten Ebene eröffnen einen Abschnitt.
    if (ts.isVariableStatement(node) && node.parent && ts.isSourceFile(node.parent)) {
      for (const dekl of node.declarationList.declarations) {
        if (!ts.isIdentifier(dekl.name)) continue;
        const name = dekl.name.text;
        if (CONST_SECTIONS[name] || /^[A-Z][A-Z0-9_]*$/.test(name)) {
          zustand.sticky = humanizeConst(name);
        }
        if (!dekl.initializer) continue;
        const kind = { pfad: [name], scoped: [], key: name };
        if (versucheLiteral(dekl.initializer, kind, name, "konstante")) continue;
        walk(dekl.initializer, kind);
      }
      return;
    }

    // Funktionen/Komponenten: neue Pfadwurzel. Der Abschnitt wird auf den
    // Komponentennamen gesetzt, sonst würde der Seitenkopf (Rücklink, Titelzeile)
    // noch unter der Überschrift des letzten Inhalts-Arrays im Dateikopf landen.
    // Die erste `<h1>`/`<h2>` überschreibt das gleich wieder.
    if (ts.isFunctionDeclaration(node) && node.name) {
      zustand.sticky = nameAufteilen(node.name.text);
      walkChildren(node, { ...ctx, pfad: [node.name.text] });
      return;
    }

    if (ts.isObjectLiteralExpression(node)) {
      const titel = eintragsTitel(node);
      const scoped = titel ? [...ctx.scoped, titel] : ctx.scoped;
      for (const prop of node.properties) walk(prop, { ...ctx, scoped });
      return;
    }

    if (ts.isPropertyAssignment(node)) {
      const key = schluesselName(node.name, sf);
      if (!key || SKIP_KEYS.has(key)) return;
      const kind = { ...ctx, pfad: [...ctx.pfad, key], key };
      if (versucheLiteral(node.initializer, kind, key, "objekt")) return;
      walk(node.initializer, kind);
      return;
    }

    if (ts.isArrayLiteralExpression(node)) {
      node.elements.forEach((el, i) => {
        const kind = { ...ctx, pfad: [...ctx.pfad, `[${i}]`] };
        if (versucheLiteral(el, kind, ctx.key || "text", "objekt")) return;
        walk(el, kind);
      });
      return;
    }

    if (ts.isJsxElement(node)) {
      const tag = node.openingElement.tagName.getText(sf);
      if (istIkonenSpan(node.openingElement, sf)) return; // <span>arrow_back</span>
      if (HEADING_TAGS.has(tag)) {
        const text = flachText(node, sf);
        if (text) zustand.sticky = text;
      }
      const kind = { ...ctx, pfad: [...ctx.pfad, jsxSegment(node, tag)] };
      walk(node.openingElement, kind);
      node.children.forEach((child, i) => walk(child, { ...kind, jsxIndex: i }));
      return;
    }

    if (ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(sf);
      const kind = { ...ctx, pfad: [...ctx.pfad, jsxSegment(node, tag)] };
      for (const attr of node.attributes.properties) walk(attr, kind);
      return;
    }

    if (ts.isJsxOpeningElement(node)) {
      for (const attr of node.attributes.properties) walk(attr, ctx);
      return;
    }

    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText(sf);
      const eltern = node.parent?.parent;
      const tag =
        eltern && (ts.isJsxOpeningElement(eltern) || ts.isJsxSelfClosingElement(eltern))
          ? eltern.tagName.getText(sf)
          : "";
      if (!node.initializer) return;

      // Zeichenketten-Attribute: Allowlist. Der Grossteil aller Attribute im
      // Repo ist className/href/aria-* — Blocklist wäre hier die falsche
      // Richtung.
      if (ts.isStringLiteral(node.initializer)) {
        if (!JSX_TEXT_ATTRS.has(name)) return;
        if (name === "titel" && SECTION_COMPONENTS.has(tag)) {
          zustand.sticky = node.initializer.text;
        }
        versucheLiteral(
          node.initializer,
          { ...ctx, pfad: [...ctx.pfad, `@${name}`], key: name },
          name,
          "jsx-attribut",
          /* jsxAttribut */ true,
        );
        return;
      }

      // Ausdruck-Attribute (`prop={…}`): Blocklist, denn hier stecken die
      // Inhalts-Arrays (`eintraege={[{ label: … }]}`).
      if (ts.isJsxExpression(node.initializer) && node.initializer.expression) {
        if (SKIP_KEYS.has(name)) return;
        const kind = { ...ctx, pfad: [...ctx.pfad, `@${name}`], key: name };
        if (versucheLiteral(node.initializer.expression, kind, name, "jsx-attribut")) return;
        walk(node.initializer.expression, kind);
      }
      return;
    }

    if (ts.isJsxText(node)) {
      const roh = src.slice(node.pos, node.end);
      const wert = roh.trim();
      if (!wert || wert.length < 2) return;
      if (istTechnisch(wert)) return;
      const vorn = roh.length - roh.trimStart().length;
      const hinten = roh.length - roh.trimEnd().length;
      const eltern = node.parent;
      const umfeld = eltern && ts.isJsxElement(eltern) ? flachText(eltern, sf) : "";
      // Im Quelltext ist Prosa zwischen Tags über Zeilen mit Einrückung
      // verteilt. Gezeigt wird sie als ein Fluss; beim Zurückschreiben wird sie
      // auf dieselbe Einrückung neu umbrochen (JSX faltet Leerraum ohnehin).
      const fluss = entitaetenAuf(wert.replace(/\s+/g, " "));
      feldHinzu({
        ctx,
        key: "text",
        literal: "jsxtext",
        value: fluss,
        loc: { start: node.pos + vorn, end: node.end - hinten },
        origin: "jsx-text",
        context: umfeld && umfeld.length > fluss.length + 4 ? umfeld : undefined,
      });
      return;
    }

    if (ts.isJsxExpression(node)) {
      if (!node.expression) return;
      // `{"Text"}` als Kind ist echter Anzeigetext.
      const kind = { ...ctx, pfad: [...ctx.pfad, "#ausdruck"], key: "text" };
      if (versucheLiteral(node.expression, kind, "text", "jsx-text")) return;
      walk(node.expression, ctx);
      return;
    }

    walkChildren(node, ctx);
  }

  function walkChildren(node, ctx) {
    ts.forEachChild(node, (child) => {
      walk(child, ctx);
    });
  }

  /** Zählt gleichnamige Geschwister-Tags, damit der Pfad eindeutig bleibt. */
  function jsxSegment(node, tag) {
    const eltern = node.parent;
    let i = 0;
    if (eltern && (ts.isJsxElement(eltern) || ts.isJsxFragment(eltern))) {
      for (const g of eltern.children) {
        if (g === node) break;
        const gTag =
          ts.isJsxElement(g)
            ? g.openingElement.tagName.getText(sf)
            : ts.isJsxSelfClosingElement(g)
              ? g.tagName.getText(sf)
              : null;
        if (gTag === tag) i++;
      }
    }
    return `<${tag}:${i}>`;
  }

  /** Der Titel-Schlüssel eines Objekts, falls vorhanden. */
  function eintragsTitel(node) {
    for (const key of TITLE_KEYS) {
      for (const prop of node.properties) {
        if (!ts.isPropertyAssignment(prop)) continue;
        if (schluesselName(prop.name, sf) !== key) continue;
        const init = prop.initializer;
        if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) {
          const t = init.text.trim();
          if (t && !istTechnisch(t)) return kuerzen(t, 70);
        }
      }
    }
    return null;
  }

  walk(sf, { pfad: [], scoped: [], key: null });

  felder.sort((a, b) => a.loc.start - b.loc.start);
  return { fields: felder, source: src };
}

/* ── Hilfen ────────────────────────────────────────────────────────────────── */

function beschriftung(key) {
  if (!key) return "Text";
  if (/^[A-Z][A-Z0-9_]*$/.test(key)) return humanizeConst(key);
  return labelFor(key);
}

function schluesselName(name, sf) {
  if (ts.isIdentifier(name)) return name.text;
  if (ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name)) return name.text;
  if (ts.isComputedPropertyName(name)) return null;
  return name.getText(sf);
}

/** `<span className="material-symbols-outlined">arrow_back</span>` — Ikonenname. */
function istIkonenSpan(opening, sf) {
  const tag = opening.tagName.getText(sf);
  if (tag !== "span") return false;
  for (const attr of opening.attributes.properties) {
    if (!ts.isJsxAttribute(attr)) continue;
    if (attr.name.getText(sf) !== "className") continue;
    const init = attr.initializer;
    const wert = init && ts.isStringLiteral(init) ? init.text : "";
    if (wert.includes("material-symbols")) return true;
  }
  return false;
}

/**
 * JSX-Knoten zu Lesetext — für Abschnittsnamen und für den Satzzusammenhang
 * eines einzelnen Textstücks. Komponenten wie `<GlossarText text="…" />` tragen
 * den Text im Attribut; würde man sie überspringen, entstünden Satzlücken.
 */
function flachText(node, sf) {
  let out = "";
  const besuch = (n) => {
    if (ts.isJsxText(n)) {
      out += n.text;
      return;
    }
    if (ts.isJsxSelfClosingElement(n) || ts.isJsxOpeningElement(n)) {
      for (const attr of n.attributes.properties) {
        if (!ts.isJsxAttribute(attr)) continue;
        const name = attr.name.getText(sf);
        if (!JSX_TEXT_ATTRS.has(name)) continue;
        const init = attr.initializer;
        if (init && ts.isStringLiteral(init)) out += init.text + " ";
      }
      return;
    }
    if (ts.isJsxElement(n)) {
      if (istIkonenSpan(n.openingElement, sf)) return; // Ikonenname ist kein Text
      besuch(n.openingElement);
      n.children.forEach(besuch);
      return;
    }
    if (ts.isJsxFragment(n)) {
      n.children.forEach(besuch);
      return;
    }
    if (ts.isJsxExpression(n)) {
      if (n.expression && ts.isStringLiteral(n.expression)) out += n.expression.text;
      return;
    }
  };
  besuch(node);
  return out.replace(/\s+/g, " ").trim();
}

function kuerzen(s, n) {
  return s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…";
}

/** `StoryPerlschnur` → «Story Perlschnur». */
function nameAufteilen(name) {
  return name.replace(/([a-zäöü0-9])([A-ZÄÖÜ])/g, "$1 $2");
}

/* ── Änderungen prüfen ─────────────────────────────────────────────────────── */

/**
 * Vergleicht die Eingaben des Clients mit einem **frischen** Parse der Datei und
 * entscheidet, was übernommen wird.
 *
 * Das ist die Stelle, an der veraltete Positionen abgefangen werden: Wenn seit
 * dem Laden der Seite an der Quelle gearbeitet wurde, passen die mitgeschickten
 * Offsets nicht mehr, und das Feld wird abgelehnt statt an die falsche Stelle
 * geschrieben. Übernommen wird ausserdem die *Feldbeschreibung aus dem frischen
 * Parse* — vom Client kommt nur der Wortlaut. So kann kein Client Positionen,
 * Literal-Art oder Maskierung diktieren.
 *
 * @param {Array<object>} frischeFelder Ergebnis von `extract()` auf dem aktuellen Stand
 * @param {Array<{id?: string, value?: string, loc?: {start?: number, end?: number}}>} eingaben
 * @returns {{ anzuwenden: Array<object>, uebersprungen: Array<{id: string, grund: string}> }}
 */
export function pruefeEdits(frischeFelder, eingaben) {
  const nachId = new Map(frischeFelder.map((f) => [f.id, f]));
  const anzuwenden = [];
  const uebersprungen = [];

  for (const eingabe of eingaben) {
    const id = eingabe?.id || "";
    const aktuell = nachId.get(id);
    if (!aktuell) {
      uebersprungen.push({ id, grund: "Feld gibt es nicht mehr" });
      continue;
    }
    if (typeof eingabe.value !== "string") {
      uebersprungen.push({ id, grund: "kein Text übermittelt" });
      continue;
    }
    if (
      eingabe.loc &&
      (eingabe.loc.start !== aktuell.loc.start || eingabe.loc.end !== aktuell.loc.end)
    ) {
      uebersprungen.push({ id, grund: "Quelle hat sich geändert — Seite neu laden" });
      continue;
    }
    if (!eingabe.value.trim()) {
      uebersprungen.push({ id, grund: "leerer Text wird nicht gespeichert" });
      continue;
    }
    if (eingabe.value === aktuell.value) continue; // nichts geändert
    anzuwenden.push({ ...aktuell, value: eingabe.value });
  }

  return { anzuwenden, uebersprungen };
}

/* ── Zurückschreiben ───────────────────────────────────────────────────────── */

/**
 * Schreibt Änderungen an ihre Offsets zurück.
 *
 * Die Änderungen werden nach Position **absteigend** angewandt — so bleiben die
 * Offsets aller noch nicht bearbeiteten Felder gültig. Unberührte Bytes bewegen
 * sich nie, darum ist der Rundlauf ohne Änderungen byte-identisch.
 *
 * Ein Feld, dessen Wert unverändert ist, wird aus `raw` zurückgeschrieben, also
 * Zeichen für Zeichen wie vorgefunden. Sonst würde schon das blosse Durchlaufen
 * Schreibweisen normalisieren (`&amp;` → `&`, Zeilenumbrüche in JSX-Prosa) und
 * jeder Speichervorgang produzierte Rauschen im Diff.
 *
 * @param {string} src Originalquelle
 * @param {Array<{id: string, value: string, original?: string, raw?: string, literal?: string, loc: {start: number, end: number}}>} edits
 * @returns {string}
 */
export function apply(src, edits) {
  const sortiert = [...edits].sort((a, b) => b.loc.start - a.loc.start);
  for (let i = 0; i < sortiert.length - 1; i++) {
    const a = sortiert[i];
    const b = sortiert[i + 1];
    if (b.loc.end > a.loc.start) {
      throw new Error(
        `Überlappende Bereiche: ${b.id} [${b.loc.start}-${b.loc.end}] und ${a.id} [${a.loc.start}-${a.loc.end}]`,
      );
    }
  }

  let out = src;
  for (const edit of sortiert) {
    const ersatz = ersetzung(out, edit);
    out = out.slice(0, edit.loc.start) + ersatz + out.slice(edit.loc.end);
  }
  return out;
}

function ersetzung(src, edit) {
  if (edit.raw !== undefined && edit.original !== undefined && edit.value === edit.original) {
    return edit.raw;
  }
  const art = edit.literal || artErraten(src, edit.loc.start);
  if (art === "jsxtext") {
    if (/[{}]/.test(edit.value)) {
      throw new Error(
        `${edit.id}: die geschweiften Klammern { } sind in JSX-Text nicht erlaubt — bitte umschreiben`,
      );
    }
    const einzug = einzugVor(src, edit.loc.start);
    const mehrzeilig = src.slice(edit.loc.start, edit.loc.end).includes("\n");
    const text = entitaetenZu(edit.value);
    return mehrzeilig ? umbrechen(text, ZEILENBREITE - einzug.length, einzug) : text;
  }
  if (art === "template") return escapeTemplate(edit.value);
  if (art === "jsxattr") return escapeJsxAttribut(edit.value, src[edit.loc.start - 1]);
  return escapeQuoted(edit.value, src[edit.loc.start - 1]);
}

function artErraten(src, start) {
  const ch = src[start - 1];
  if (ch === "`") return "template";
  if (ch === '"' || ch === "'") return "quoted";
  return "jsxtext";
}

/**
 * Zeichenketten in JSX-Attributen kennen **keine** Backslash-Maskierung:
 * `titel="a \" b"` ist ein Syntaxfehler. Maskiert wird mit HTML-Entitäten, die
 * JSX beim Lesen wieder auflöst. Darum muss `&` zuerst weichen.
 */
function escapeJsxAttribut(str, anfuehrung) {
  const out = str.replace(/&/g, "&amp;");
  return anfuehrung === "'" ? out.replace(/'/g, "&#39;") : out.replace(/"/g, "&quot;");
}

const ENTITAETEN = {
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: " ",
  shy: "­",
};

/** `Kontext &amp; Mehr` → `Kontext & Mehr` (Anzeige im Formular). */
function entitaetenAuf(str) {
  if (!str.includes("&")) return str;
  return str.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (ganz, code) => {
    if (code[0] === "#") {
      const zahl = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : Number(code.slice(1));
      return Number.isFinite(zahl) && zahl > 0 ? String.fromCodePoint(zahl) : ganz;
    }
    const treffer = ENTITAETEN[code.toLowerCase()];
    return treffer === undefined ? ganz : treffer;
  });
}

/**
 * `Kontext & Mehr` → `Kontext &amp; Mehr`. In JSX-Text müssen `& < >` maskiert
 * werden; `& ` zuerst, sonst würde die eigene Maskierung mitmaskiert.
 */
function entitaetenZu(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Zeichenkette so maskieren, dass sie in `"…"` bzw. `'…'` wieder aufgeht. */
function escapeQuoted(str, anfuehrung) {
  let out = "";
  for (const c of str) {
    if (c === "\\") out += "\\\\";
    else if (c === anfuehrung) out += "\\" + anfuehrung;
    else if (c === "\n") out += "\\n";
    else if (c === "\r") out += "\\r";
    else if (c === "\t") out += "\\t";
    else out += c;
  }
  return out;
}

/** In Template-Literalen bleiben Zeilenumbrüche echt; `${` muss maskiert werden. */
function escapeTemplate(str) {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function einzugVor(src, start) {
  const nl = src.lastIndexOf("\n", start - 1);
  if (nl < 0) return "";
  const kandidat = src.slice(nl + 1, start);
  return /^\s*$/.test(kandidat) ? kandidat : "";
}

/** Geänderten JSX-Text auf die ursprüngliche Einrückung neu umbrechen. */
function umbrechen(text, breite, einzug) {
  const woerter = text.replace(/\s+/g, " ").trim().split(" ");
  const zeilen = [];
  let zeile = "";
  for (const w of woerter) {
    if (!zeile) zeile = w;
    else if (zeile.length + 1 + w.length <= Math.max(breite, 40)) zeile += " " + w;
    else {
      zeilen.push(zeile);
      zeile = w;
    }
  }
  if (zeile) zeilen.push(zeile);
  return zeilen.join("\n" + einzug);
}
