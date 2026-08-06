export interface SubmoduleRef {
  slug: string;
  title: string;
  href: string;
  estimatedMinutes?: number;
  icon?: string;
  subtitle?: string;
  description?: string;
}

export interface ModuleRef {
  slug: string;
  title: string;
  href: string;
  estimatedMinutes?: number;
  icon?: string;
  groupSlug?: string;
  groupTitle?: string;
  subtitle?: string;
  description?: string;
  submodules?: SubmoduleRef[];
}

export interface UnitConfig {
  id: string;
  title: string;
  shortTitle: string;
  subtitle?: string;
  description: string;
  modules: ModuleRef[];
}

export const unit: UnitConfig = {
  id: "ki26",
  title: "Lernumgebung zu KI",
  shortTitle: "KI",
  subtitle: "Interaktive Lehrmittel",
  description:
    "Eine kompakte Lernumgebung mit interaktiven Modulen rund um Künstliche Intelligenz.",
  modules: [
    {
      slug: "lernseite-1",
      title: "Kann KI das? — eine Positionsreise",
      href: "/lernen/lernseite-1",
      icon: "explore",
      subtitle: "Selbstgesteuert · bewertungsfrei",
      description:
        "Eine rund 90-minütige Reise: Du nimmst Position zu KI, wählst frei aus sechs Themen — ohne Reihenfolge, ohne Mindestzahl —, erlebst je Thema Sonnen- und Schattenseite, sammelst Badges und siehst am Ende auf deiner Chancen-Risiken-Landkarte deine Bewegung. Dein Abschlussbericht hält alles fest, was du unterwegs notiert hast.",
    },
    {
      slug: "lernseite-2",
      title: "Eine ganz neue Partnerschaft",
      href: "/lernen/lernseite-2",
      icon: "auto_awesome",
      subtitle: "Mensch & KI",
      // Keine Dauer: In diesem Lernset bestimmt jede Person selbst, wie weit
      // sie geht — eine Minutenzahl wäre eine Vorgabe, die es nicht gibt.
      description:
        "Mit KI ist eine neue Akteurin aufgetreten, weder Werkzeug noch Person. Du gehst ihrer Geschichte nach, prüfst ihre zwölf Merkmale und siehst an acht Epochen, dass Umbrüche schon oft verunsichert haben. Hier wird nichts abgefragt: Was du öffnest und markierst, wird zu deiner Spur. Am Schluss deutet dir das Orakel dein Muster und du nimmst ein PDF mit, das festhält, wo du warst und was du weiterverfolgen willst.",
      submodules: [
        {
          slug: "vorhang-auf",
          title: "Vorhang auf — eine neue Akteurin",
          href: "/lernen/lernseite-2/vorhang-auf",
          icon: "curtains",
          subtitle: "Auftakt",
          description:
            "Mit KI tritt eine neue Art von Akteurin auf die Bühne — weder Werkzeug noch Person. Du gehst ihrer Geschichte nach, deckst ihre zwölf Merkmale auf und gewichtest, wie deutlich jedes sie ausmacht, wanderst durch Bilder von der Turing-Bombe bis DALL·E und stellst sie in ihre vier Kontexte: technisch, wirtschaftlich, rechtlich, kulturell.",
        },
        {
          slug: "philosophische-perspektive",
          title: "Philosophische Perspektive",
          href: "/lernen/lernseite-2/philosophische-perspektive",
          icon: "psychology",
          subtitle: "Orientierung",
          description:
            "Technische Umbrüche verunsichern — seit der Antike. Auf einem Zeitstrahl legst du Erfindungen und Erschütterungen nebeneinander, gehst acht Epochen von Athen bis heute durch, jede mit Technik, Verunsicherung und philosophischer Antwort, und prüfst an vier Denkwegen, was davon für dich tragfähig ist.",
        },
        {
          slug: "das-orakel",
          title: "Das Orakel — erkenne dich selbst",
          href: "/lernen/lernseite-2/das-orakel",
          icon: "insights",
          subtitle: "Rückblick & Vergleich",
          description:
            "Dein Rückblick: Das Orakel liest deine Spur, zeigt sie als Rhizom und vergleicht dich anonym mit allen anderen. Dazu deine Antwort auf die offene Frage, die Punkte, die du weiterverfolgen willst, das Verzeichnis aller Quellen und ein PDF zum Mitnehmen.",
        },
      ],
    },
  ],
};
