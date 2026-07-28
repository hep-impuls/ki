/**
 * Korrektorat — Inventar: **welche** Dateien der Korrektor sieht, unter welchem
 * Namen und in welcher Gruppe.
 *
 * Umfang (mit Pietro festgelegt): die Lerninhalte, also `src/app/lernen/**` und
 * `src/config/unit.ts`. Titelseite, Onboarding und Lehrpersonen-UI bleiben
 * aussen vor.
 *
 * Ausgeschlossen wird vor allem **toter Code**: Lernseite 1 lief bis M7 über
 * einen v2-Flow, der im Repo geblieben, aber nirgends mehr eingebunden ist.
 * Würde er hier auftauchen, korrigierte Sebastian Texte, die niemand liest.
 * Reine Logikdateien brauchen keinen Ausschluss — wer keine Textfelder hat,
 * erscheint ohnehin nicht in der Übersicht. Umgekehrt heisst das: auch `_lib/`
 * kommt mit, wenn dort sichtbare Beschriftungen liegen (und das tun sie,
 * z.B. die Achsenbeschriftungen der Landkarte).
 *
 * Wartung: `node scripts/korrektorat/inventar.mjs` vergleicht diese Listen mit
 * dem tatsächlichen Import-Graphen und meldet, was neu, was tot und was falsch
 * einsortiert ist.
 */

/** Pfad-Präfixe, die überhaupt in Frage kommen. */
export const UMFANG = ["src/app/lernen/", "src/config/unit.ts"];

/**
 * Ausschlüsse. `muster` ist ein Teilstring des Pfads, `grund` erscheint im
 * Wartungsbericht.
 */
export const AUSGESCHLOSSEN = [
  { muster: "/lernen/layout.tsx", grund: "nur das Session-Gate" },
  { muster: "/v3-preview/", grund: "interne Vorschauseite, nicht Teil des Lernwegs" },

  // Toter v2-Flow von Lernseite 1 (live ist seit M7 KiEinheitV3). Belegt durch
  // `node scripts/korrektorat/inventar.mjs`: von keinem `page.tsx` erreichbar.
  { muster: "lernseite-1/_components/KiEinheit.tsx", grund: "v2-Flow, nicht mehr eingebunden" },
  { muster: "lernseite-1/_components/Auftakt.tsx", grund: "v2-Flow, nicht mehr eingebunden" },
  { muster: "lernseite-1/_components/Abschluss.tsx", grund: "v2-Flow, nicht mehr eingebunden" },
  { muster: "lernseite-1/_components/Station.tsx", grund: "v2-Flow, nicht mehr eingebunden" },
  { muster: "lernseite-1/_components/StationenMenu.tsx", grund: "v2-Flow, nicht mehr eingebunden" },
  { muster: "lernseite-1/_components/Maschinenraum.tsx", grund: "v2-Flow, nicht mehr eingebunden" },
  { muster: "lernseite-1/_components/KollektivSpiegel.tsx", grund: "v2-Flow, nur von Abschluss.tsx" },
  { muster: "lernseite-1/_components/PollDeck.tsx", grund: "v2-Flow, nur von Auftakt/Abschluss" },
  { muster: "lernseite-1/_components/PollFrage.tsx", grund: "v2-Flow, nur von PollDeck" },
  { muster: "lernseite-1/_components/Skala.tsx", grund: "v2-Flow, nur von Auftakt/Station" },
  { muster: "lernseite-1/_components/WissenCheck.tsx", grund: "v2-Flow, nur von WissenCheckGruppe" },
  { muster: "lernseite-1/_components/WissenCheckGruppe.tsx", grund: "v2-Flow, ohne Verwendung" },
  // Diese zwei sind noch erreichbar, aber nur wegen Typen bzw. Abstimmungs-IDs;
  // die Texte darin zeigt niemand mehr an. `nurKennungen` sagt dem
  // Wartungsbericht, dass das bekannt ist und kein Befund.
  {
    muster: "lernseite-1/_data/stationen.ts",
    grund: "v2-Stationsdaten (nur die Typen sind noch in Gebrauch)",
    nurKennungen: true,
  },
  {
    muster: "lernseite-1/_data/maschinenraum.ts",
    grund: "v2-Stationsdaten (nur die Abstimmungs-IDs sind noch in Gebrauch)",
    nurKennungen: true,
  },
  { muster: "lernseite-1/_data/wissenChecks.ts", grund: "v2-Wissen-Checks (v3 trägt sie in stationenV3.ts)" },
];

/**
 * Dateien, die noch nirgends eingebunden sind, aber sichtbar bleiben sollen —
 * angefangene Inhalte, an denen weitergearbeitet wird. Der Hinweis erscheint im
 * Editor, damit Sebastian weiss, dass diese Texte (noch) niemand zu sehen
 * bekommt und er sie ggf. hintanstellen kann.
 */
export const UNVERDRAHTET = {
  "src/app/lernen/lernseite-2/philosophische-perspektive/_components/SchablonenZeitstrahl.tsx":
    "Noch nicht in eine Seite eingebunden — Inhalt in Arbeit.",
  "src/app/lernen/lernseite-2/_components/FadenNetz.tsx": "Noch nicht eingebunden.",
  "src/app/lernen/lernseite-2/_components/FortschrittsCode.tsx": "Noch nicht eingebunden.",
};

/**
 * Gruppen für die Übersicht, in Anzeigereihenfolge. `muster` wird gegen den
 * Pfad geprüft, das erste Treffer gewinnt.
 */
export const GRUPPEN = [
  { muster: "lernseite-1/_data/", titel: "Lernseite 1 · Inhalte" },
  { muster: "lernseite-1/", titel: "Lernseite 1 · Seiten und Bausteine" },
  { muster: "lernseite-2/vorhang-auf/", titel: "Lernseite 2 · Thema 01 «Vorhang auf»" },
  {
    muster: "lernseite-2/philosophische-perspektive/",
    titel: "Lernseite 2 · Thema 02 «Philosophische Perspektive»",
  },
  { muster: "lernseite-2/das-orakel/", titel: "Lernseite 2 · Thema 03 «Das Orakel»" },
  { muster: "lernseite-2/_data/", titel: "Lernseite 2 · Inhalte" },
  { muster: "lernseite-2/", titel: "Lernseite 2 · Übersicht und Bausteine" },
  { muster: "src/config/", titel: "Rahmen (Titel und Beschreibungen)" },
];

/**
 * Sprechende Titel. Was hier fehlt, wird aus dem Dateinamen abgeleitet — kein
 * Fehler, nur weniger schön.
 */
export const TITEL = {
  "src/config/unit.ts": "Modul-Konfiguration — Titel, Untertitel, Beschreibungen",

  "src/app/lernen/lernseite-1/page.tsx": "Lernseite 1 — Einstiegsseite",
  "src/app/lernen/lernseite-1/submodul-1/page.tsx": "Lernseite 1 — Submodul 1",
  "src/app/lernen/lernseite-1/submodul-2/page.tsx": "Lernseite 1 — Submodul 2",
  "src/app/lernen/lernseite-1/_data/auftakt.ts": "Auftakt — Lernziel, Vorwissen, Hype-Opener",
  "src/app/lernen/lernseite-1/_data/auftaktPolls.ts": "Auftakt — Abstimmungen",
  "src/app/lernen/lernseite-1/_data/auftaktSwipe.ts": "Auftakt — Swipe-Karten",
  "src/app/lernen/lernseite-1/_data/badges.ts": "Badges",
  "src/app/lernen/lernseite-1/_data/faktenPruefung.ts": "Faktenprüfung",
  "src/app/lernen/lernseite-1/_data/landkarte.ts": "Chancen-Risiken-Landkarte",
  "src/app/lernen/lernseite-1/_data/quizBezug.ts": "Quiz-Bezüge",
  "src/app/lernen/lernseite-1/_data/stationenV3.ts": "Die Themen von Lernset 1 — alle Inhalte",
  "src/app/lernen/lernseite-1/_components/AuftaktV3.tsx": "Auftakt — Oberfläche",
  "src/app/lernen/lernseite-1/_components/AbschlussV3.tsx": "Abschluss — Oberfläche",
  "src/app/lernen/lernseite-1/_components/KiEinheitV3.tsx": "Ablaufsteuerung der Einheit",
  "src/app/lernen/lernseite-1/_components/StationV3.tsx": "Themen-Oberfläche",
  "src/app/lernen/lernseite-1/_components/ThemenMenu.tsx": "Themenfeld — Auswahl der Themen",
  "src/app/lernen/lernseite-1/_components/Abschlussbericht.tsx": "Abschlussbericht",
  "src/app/lernen/lernseite-1/_components/Erfuellungsbalken.tsx": "Erfüllungsgrad — Balken",
  "src/app/lernen/lernseite-1/_components/KlassenSpiegel.tsx": "Klassen-Spiegel",
  "src/app/lernen/lernseite-1/_components/KollektivSpiegel.tsx": "Kollektiv-Spiegel",
  "src/app/lernen/lernseite-1/_components/Landkarte.tsx": "Landkarte (Darstellung)",
  "src/app/lernen/lernseite-1/_components/LernzielKarte.tsx": "Lernziel-Karte",
  "src/app/lernen/lernseite-1/_lib/landkarteData.ts": "Landkarte — Achsenbeschriftungen",
  "src/app/lernen/lernseite-1/_lib/unitPolls.ts": "Globale Abstimmung — Beschriftungen",
  "src/app/lernen/lernseite-1/_lib/pollRegistry.ts":
    "Abstimmungen — Fragen und Beschriftungen (auch im Lehrer-Report)",

  "src/app/lernen/lernseite-2/page.tsx": "Lernseite 2 — Übersichtsseite",
  "src/app/lernen/lernseite-2/vorhang-auf/page.tsx": "Thema 01 «Vorhang auf» — Seitentext",
  "src/app/lernen/lernseite-2/philosophische-perspektive/page.tsx":
    "Thema 02 «Philosophische Perspektive» — Seitentext",
  "src/app/lernen/lernseite-2/das-orakel/page.tsx": "Thema 03 «Das Orakel» — Seitentext",
  "src/app/lernen/lernseite-2/_components/VerunsicherungsEpochen.tsx":
    "Die acht Epochen — Philosophie in Zeiten der Verunsicherung",
  "src/app/lernen/lernseite-2/_components/StoryGewebe.tsx": "Die KI-Story (Gewebe)",
  "src/app/lernen/lernseite-2/_components/Glossar.tsx": "Glossar — Hover-Erklärungen",
  "src/app/lernen/lernseite-2/_components/Quellenverzeichnis.tsx": "Quellenverzeichnis",
  "src/app/lernen/lernseite-2/_components/HistorienTeppich.tsx": "Historien-Teppich",
  "src/app/lernen/lernseite-2/_components/KontextAkkordeon.tsx": "Die KI im Kontext",
  "src/app/lernen/lernseite-2/_components/KnotenLandschaft.tsx": "Merkmale der neuen Akteurin",
  "src/app/lernen/lernseite-2/_data/belege.ts": "Belege — geprüfte Quellen",
  "src/app/lernen/lernseite-2/philosophische-perspektive/_components/Denkwege.tsx":
    "Wege der Orientierung — die vier Bereiche",
  "src/app/lernen/lernseite-2/philosophische-perspektive/_components/SchablonenZeitstrahl.tsx":
    "Denk-Schablonen auf dem Zeitstrahl",
  "src/app/lernen/lernseite-2/das-orakel/_components/OrakelDashboard.tsx": "Orakel — Auswertung",
  "src/app/lernen/lernseite-2/_components/BilderAnschauung.tsx": "Bilderstrecke — Bedienung",
  "src/app/lernen/lernseite-2/_components/AktivitaetsNetz.tsx": "Aktivitätsnetz",
  "src/app/lernen/lernseite-2/_components/GewebeSpiel.tsx": "Gewebe-Spiel",
  "src/app/lernen/lernseite-2/_components/Knotenkarte.tsx": "Knotenkarte",
  "src/app/lernen/lernseite-2/_components/FortschrittsCode.tsx": "Fortschritts-Code",
  "src/app/lernen/lernseite-2/philosophische-perspektive/_components/BildZoom.tsx":
    "Bild-Zoom — Bedienung",
};

/** Ist der Pfad im Umfang und nicht ausgeschlossen? */
export function istInhaltsDatei(pfad) {
  if (!/\.tsx?$/.test(pfad)) return false;
  if (!UMFANG.some((p) => pfad === p || pfad.startsWith(p))) return false;
  if (pfad.endsWith(".d.ts")) return false;
  return !ausschlussGrund(pfad);
}

/** Warum ist der Pfad ausgeschlossen — oder `null`. */
export function ausschlussGrund(pfad) {
  const treffer = ausschluss(pfad);
  return treffer ? treffer.grund : null;
}

/** Der Ausschluss-Eintrag samt Flags — oder `undefined`. */
export function ausschluss(pfad) {
  return AUSGESCHLOSSEN.find((a) => pfad.includes(a.muster));
}

/** Filtert und sortiert eine Pfadliste auf die Inhaltsdateien. */
export function inhaltsDateien(alle) {
  return alle.filter(istInhaltsDatei).sort(vergleiche);
}

/** Gruppe, Titel und Sortierschlüssel für einen Pfad. */
export function dateiInfo(pfad) {
  const gruppe = GRUPPEN.find((g) => pfad.includes(g.muster));
  return {
    pfad,
    gruppe: gruppe ? gruppe.titel : "Weitere Dateien",
    titel: TITEL[pfad] || abgeleiteterTitel(pfad),
    abgeleitet: !TITEL[pfad],
    hinweis: UNVERDRAHTET[pfad] || null,
  };
}

/** Reihenfolge: nach Gruppe, dann Dateien mit gepflegtem Titel zuerst. */
function vergleiche(a, b) {
  const ga = GRUPPEN.findIndex((g) => a.includes(g.muster));
  const gb = GRUPPEN.findIndex((g) => b.includes(g.muster));
  const na = ga < 0 ? GRUPPEN.length : ga;
  const nb = gb < 0 ? GRUPPEN.length : gb;
  if (na !== nb) return na - nb;
  const ta = TITEL[a] ? 0 : 1;
  const tb = TITEL[b] ? 0 : 1;
  if (ta !== tb) return ta - tb;
  return a.localeCompare(b, "de");
}

/** `_components/AktivitaetsNetzFloat.tsx` → «Aktivitaets Netz Float». */
function abgeleiteterTitel(pfad) {
  const name = pfad.split("/").pop().replace(/\.tsx?$/, "");
  if (name === "page") {
    const teile = pfad.split("/");
    return teile[teile.length - 2] || "Seite";
  }
  return name.replace(/([a-zäöü])([A-ZÄÖÜ])/g, "$1 $2");
}
