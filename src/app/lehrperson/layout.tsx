import type { Metadata } from "next";

/**
 * Such-Metadaten für den Lehrpersonen-Bereich (2026-10-09). Die Seite selbst
 * ist eine Client-Komponente und kann keine Metadaten exportieren, darum
 * stehen sie hier. Anleitung und Leitfaden überschreiben Titel und
 * Beschreibung mit eigenen; Admin, Report und Setup sind in `robots.ts`
 * gesperrt.
 */
export const metadata: Metadata = {
  title: "KI im Unterricht: Material und Anleitung für Lehrpersonen",
  description:
    "Künstliche Intelligenz im Unterricht einsetzen: Klasse anlegen, Fortschritt verfolgen, Anleitung und didaktischer Leitfaden zum KI-Unterrichtsmaterial des hep Verlags.",
  alternates: { canonical: "/lehrperson" },
};

export default function LehrpersonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
