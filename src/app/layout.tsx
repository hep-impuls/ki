import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KI-Lernumgebung",
  description: "Interaktive Lernmodule rund um Künstliche Intelligenz",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
