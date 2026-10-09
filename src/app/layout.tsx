import type { Metadata } from "next";
import "./globals.css";

/**
 * Such- und Vorschau-Metadaten (Christof, 2026-10-09: gefunden werden soll die
 * Lernumgebung bei «KI Unterrichtsmaterial», «KI und Lernen», «KI Grundlagen»
 * und «KI im Unterricht»). Bewusst KEIN `alternates.canonical` hier: Es würde
 * an alle Seiten vererbt und jede auf die Startseite zeigen lassen. Kanonische
 * Adressen setzen die Seiten selbst.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://hep-ki.vercel.app"),
  title: {
    default: "KI-Unterrichtsmaterial: Grundlagen der künstlichen Intelligenz · Lernumgebung zu KI",
    template: "%s · Lernumgebung zu KI",
  },
  description:
    "Frei zugängliches Unterrichtsmaterial zur künstlichen Intelligenz vom hep Verlag. Grundlagen der KI interaktiv lernen und im Unterricht einsetzen, für Berufsfachschulen und die Sekundarstufe II, mit Anleitung und Leitfaden für Lehrpersonen.",
  keywords: [
    "KI Unterrichtsmaterial",
    "KI im Unterricht",
    "KI und Lernen",
    "KI Grundlagen",
    "künstliche Intelligenz Unterricht",
    "Lehrmittel künstliche Intelligenz",
    "KI Berufsfachschule",
    "Allgemeinbildender Unterricht",
    "hep Verlag",
  ],
  applicationName: "Lernumgebung zu KI",
  authors: [{ name: "Pietro Rossi" }, { name: "Christof Glaus" }],
  publisher: "hep Verlag",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_CH",
    siteName: "Lernumgebung zu KI",
    title: "KI-Unterrichtsmaterial: Grundlagen der künstlichen Intelligenz",
    description:
      "Interaktive Lernumgebung des hep Verlags: KI-Grundlagen lernen und im Unterricht einsetzen, mit Anleitung für Lehrpersonen.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "KI-Unterrichtsmaterial: Grundlagen der künstlichen Intelligenz",
    description:
      "Interaktive Lernumgebung des hep Verlags: KI-Grundlagen lernen und im Unterricht einsetzen.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" style={{ overflowY: "scroll" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* `display=block` statt `swap` — und zwar NUR bei der Icon-Schrift.
            Jedes Icon steht als Ligatur-Wort im DOM
            (`<span class="material-symbols-outlined">arrow_back</span>`).
            Mit `swap` zeigt der Browser bis zum Laden der Schrift den Ersatz,
            und der Ersatz ist bei einer Icon-Schrift das nackte Wort: Auf dem
            Handy blitzte sichtbar «arrow_back» auf. Mit `block` bleibt die
            Stelle rund drei Sekunden leer, was deutlich weniger irritiert.
            Die Inter-Zeile darüber behält `swap`, dort ist es richtig.
            Hintergrund und der noch offene zweite Befund (Googles Hilfsklasse
            überstimmt mit `font-size: 24px` alle Grössenangaben):
            docs/vorschlag-icon-schrift.md */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
