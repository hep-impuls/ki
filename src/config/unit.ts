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
        "Eine rund 90-minuetige Reise: Du nimmst Position zu KI, durchlaeufst frei gewaehlte Stationen mit Versprechen und Kehrseiten und siehst am Ende im Kollektiv-Spiegel, wo du und die Gruppe stehen.",
    },
    {
      slug: "lernseite-2",
      title: "Eine ganz neue Partnerschaft",
      href: "/lernen/lernseite-2",
      icon: "auto_awesome",
      subtitle: "Mensch & KI",
      description:
        "Wie Mensch und KI zusammenarbeiten — Werkzeuge, Methoden, Reflexion.",
      submodules: [
        {
          slug: "submodul-1",
          title: "Philosophische Perspektive",
          href: "/lernen/lernseite-2/submodul-1",
          icon: "psychology",
          subtitle: "Orientierung",
          description:
            "Die digitale Transformation verunsichert. Philosophie hilft, Begriffe zu klären und Orientierung zu finden.",
        },
        {
          slug: "submodul-2",
          title: "Quellen, neu aufgespürt",
          href: "/lernen/lernseite-2/submodul-2",
          icon: "travel_explore",
          subtitle: "Recherche",
          description: "Inhalt folgt.",
        },
        {
          slug: "submodul-3",
          title: "Ich bin ganz Ohr",
          href: "/lernen/lernseite-2/submodul-3",
          icon: "hearing",
          subtitle: "Audio & Sprache",
          description: "Inhalt folgt.",
        },
        {
          slug: "submodul-4",
          title: "AI-Slop macht kreativ",
          href: "/lernen/lernseite-2/submodul-4",
          icon: "palette",
          subtitle: "Kreativität",
          description: "Inhalt folgt.",
        },
      ],
    },
  ],
};
