import type { MetadataRoute } from "next";

/**
 * Was Suchmaschinen lesen dürfen (2026-10-09).
 *
 * Gesperrt sind Arbeitsseiten ohne öffentlichen Inhalt (Autoren-Übersicht,
 * Korrektorat, Lehrpersonen-Bereiche hinter Klassencode, Schnittstellen) und
 * die Lernseiten unter `/lernen`: Die stehen hinter dem Login-Gate, ein
 * Crawler ohne Fortschritts-Code bekäme nur eine leere Seite und die
 * Weiterleitung nach `/start`. Wird das Gate je so umgebaut, dass der Inhalt
 * ohne Code lesbar ist, gehört `/lernen` hier freigegeben und in die Sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/autoren",
        "/korrektorat",
        "/lehrperson/admin",
        "/lehrperson/report",
        "/lehrperson/setup",
        "/lernen/",
        "/start",
      ],
    },
    sitemap: "https://hep-ki.vercel.app/sitemap.xml",
  };
}
