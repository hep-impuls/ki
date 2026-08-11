import AutorenDashboard from "./_components/AutorenDashboard";

export const metadata = {
  title: "Autoren-Übersicht · Lernumgebung zu KI",
  // Nicht in Suchmaschinen und nirgends verlinkt — eine Arbeitsseite für uns zwei.
  robots: { index: false, follow: false },
};

/**
 * `/autoren` — die Nutzungsübersicht für Pietro und Christof.
 *
 * Abgrenzung zu `/lehrperson/admin`: Das ist Pietros Sicht auf **Klassen und
 * Codes** (Admin SDK, Service-Account). Diese Seite fragt das Umgekehrte, nämlich
 * was mit den **Inhalten** passiert, und kommt dafür ohne Server aus: Sie liest
 * nur die anonymen Aggregat-Zähler unter `abstimmungen/ki26/polls`, die die
 * deployten Rules bereits fürs Lesen freigeben. Kein Service-Account, keine
 * Route, keine Personendaten.
 *
 * Bewusst nicht hinter `SessionGate`: Die Seite liegt ausserhalb von
 * `/lernen/**`, weil eine Autorenseite keinen Fortschritts-Code braucht. Sie ist
 * nirgends verlinkt und für Suchmaschinen gesperrt. Wer die Adresse kennt, sieht
 * ausschliesslich anonyme Summen; etwas Schützenswertes steht nicht darauf.
 */
export default function AutorenSeite() {
  return <AutorenDashboard />;
}
