import type { MetadataRoute } from "next";

const BASIS = "https://hep-ki.vercel.app";

/**
 * Die öffentlich lesbaren Seiten (2026-10-09). Nur was ein Crawler ohne
 * Fortschritts-Code und ohne Klassencode tatsächlich zu sehen bekommt —
 * siehe die Begründung in `robots.ts`.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASIS}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASIS}/lehrperson`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASIS}/lehrperson/leitfaden`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASIS}/lehrperson/anleitung`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
