import type { Metadata } from "next";

/**
 * Eigenes Layout für den Korrektorat-Editor: **ohne** `AppLayout` (kein
 * Lern-Navigationsgerüst) und ohne `SessionGate` (kein Fortschritts-Code —
 * hier gilt der Passcode). Nur die Design-Tokens aus `globals.css` sind
 * gemeinsam.
 */

export const metadata: Metadata = {
  title: "Korrektorat · Lernumgebung zu KI",
  description: "Interner Editor für das Korrektorat der Lerninhalte.",
  robots: { index: false, follow: false, nocache: true },
};

export default function KorrektoratLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-background text-on-surface">{children}</div>;
}
