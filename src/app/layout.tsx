import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lernumgebung zu KI",
  description: "Interaktive Lernmodule rund um Künstliche Intelligenz",
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
