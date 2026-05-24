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
  title: "KI-Lernumgebung",
  shortTitle: "KI",
  subtitle: "Interaktive Lehrmittel",
  description:
    "Eine kompakte Lernumgebung mit interaktiven Modulen rund um Künstliche Intelligenz.",
  modules: [
    {
      slug: "lernseite-1",
      title: "Lernseite 1",
      href: "/lernen/lernseite-1",
      icon: "menu_book",
      subtitle: "Platzhalter",
      description:
        "Hier entsteht das erste Lernmodul. Inhalt, Aufgaben und interaktive Elemente folgen.",
      submodules: [
        {
          slug: "submodul-1",
          title: "Submodul 1",
          href: "/lernen/lernseite-1/submodul-1",
          icon: "play_lesson",
          subtitle: "Platzhalter",
          description: "Erstes Submodul von Lernseite 1.",
        },
        {
          slug: "submodul-2",
          title: "Submodul 2",
          href: "/lernen/lernseite-1/submodul-2",
          icon: "quiz",
          subtitle: "Platzhalter",
          description: "Zweites Submodul von Lernseite 1.",
        },
      ],
    },
    {
      slug: "lernseite-2",
      title: "Lernseite 2",
      href: "/lernen/lernseite-2",
      icon: "auto_awesome",
      subtitle: "Platzhalter",
      description:
        "Hier entsteht das zweite Lernmodul. Inhalt, Aufgaben und interaktive Elemente folgen.",
      submodules: [
        {
          slug: "submodul-1",
          title: "Submodul 1",
          href: "/lernen/lernseite-2/submodul-1",
          icon: "play_lesson",
          subtitle: "Platzhalter",
          description: "Erstes Submodul von Lernseite 2.",
        },
        {
          slug: "submodul-2",
          title: "Submodul 2",
          href: "/lernen/lernseite-2/submodul-2",
          icon: "quiz",
          subtitle: "Platzhalter",
          description: "Zweites Submodul von Lernseite 2.",
        },
      ],
    },
  ],
};
