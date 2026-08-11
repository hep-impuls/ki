import NutzungsMelder from "./_components/NutzungsMelder";

/**
 * Layout für Lernseite 2 — einzige Aufgabe: den anonymen Reichweiten-Zähler
 * einhängen, damit `/autoren` sagen kann, wie viele Browser welches Thema je
 * geöffnet haben.
 *
 * Das Gate (`SessionGate`) liegt eine Ebene höher in `src/app/lernen/layout.tsx`
 * und gilt für alle `/lernen/**`-Routen; hier kommt nichts dazu.
 */
export default function Lernseite2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NutzungsMelder />
      {children}
    </>
  );
}
