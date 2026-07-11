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
        "Eine rund 90-minütige Reise: Du nimmst Position zu KI, wählst frei Stationen auf dem Zeitstrahl, erlebst je Thema Sonnen- und Schattenseite, sammelst Badges und siehst am Ende auf deiner Chancen-Risiken-Landkarte deine Bewegung — mit Zertifikat ab drei Stationen.",
    },
    {
      slug: "lernseite-2",
      title: "Eine ganz neue Partnerschaft",
      href: "/lernen/lernseite-2",
      icon: "auto_awesome",
      subtitle: "Mensch & KI",
      description:
        "Mit KI ist eine neue Akteurin aufgetreten. Drei Themenbereiche spannen den Bogen: der Auftakt «Vorhang auf», die philosophische und die kulturelle Perspektive.",
      submodules: [
        {
          slug: "vorhang-auf",
          title: "Vorhang auf — eine neue Akteurin",
          href: "/lernen/lernseite-2/vorhang-auf",
          icon: "curtains",
          subtitle: "Auftakt",
          description:
            "Mit KI tritt eine neue Art von Akteurin auf die Bühne — weder Werkzeug noch Person. Der Auftakt zeigt in drei Szenen, warum die alten Begriffe nicht mehr greifen.",
        },
        {
          slug: "philosophische-perspektive",
          title: "Philosophische Perspektive",
          href: "/lernen/lernseite-2/philosophische-perspektive",
          icon: "psychology",
          subtitle: "Orientierung",
          description:
            "Technische Umbrüche verunsichern — seit der Antike. Fünf Epochen zeigen, wie Philosophie Orientierung stiftet: von Aristoteles bis zur offenen Frage der Gegenwart.",
        },
        {
          slug: "kulturelle-perspektive",
          title: "Kulturelle Perspektive",
          href: "/lernen/lernseite-2/kulturelle-perspektive",
          icon: "theater_comedy",
          subtitle: "Bilder & Erzählungen",
          description:
            "Erzählungen und Kunst prägen, was wir in der KI sehen — vom Golem bis zur Gegenwartskunst. Dieser Themenbereich folgt den Bildern hinter unserem Blick.",
        },
      ],
    },
  ],
};
