# KI-Lernumgebung

Schlanke Lernplattform mit zwei Platzhalter-Lernseiten. **Next.js 14** (App Router) +
**Tailwind CSS** + **Firebase** (Anonymous Auth & Firestore zum Aktivitäts-Tracking).
Deploybar auf **Vercel**.

## Lokal starten

```bash
npm install
cp .env.local.example .env.local
# Werte aus Firebase-Console eintragen, dann:
npm run dev
```

Aufrufbar unter [http://localhost:3000](http://localhost:3000).

## Firebase einrichten

1. **Projekt anlegen** in der [Firebase Console](https://console.firebase.google.com/).
2. **Web-App registrieren** (Projekteinstellungen → *Allgemein* → *Meine Apps* → Web).
   Die angezeigten `firebaseConfig`-Werte in `.env.local` eintragen.
3. **Authentication aktivieren**: *Build → Authentication → Sign-in method →
   Anonymous → aktivieren*.
4. **Firestore aktivieren**: *Build → Firestore Database → Datenbank erstellen*
   (Region wählen, im Produktionsmodus starten).
5. **Sicherheitsregeln** aus `firestore.rules` übernehmen
   (*Firestore → Regeln → einfügen → Veröffentlichen*).

## Auf Vercel deployen

1. Repo auf GitHub pushen.
2. Auf [vercel.com](https://vercel.com) → *Add New Project* → Repo importieren.
3. Bei *Environment Variables* dieselben sechs `NEXT_PUBLIC_FIREBASE_*`-Werte
   eintragen wie in `.env.local`.
4. *Deploy*. Fertig.

## Was passiert mit Nutzeraktivitäten?

- Beim ersten Aufruf wird der Nutzer **anonym** in Firebase Auth angemeldet
  (kein Login-Formular nötig).
- Jeder Seitenaufruf und jedes Öffnen einer Lernseite legt ein Dokument in der
  Firestore-Collection `activities` ab — mit `uid`, `type`, `page`, `lessonId`,
  `userAgent` und Server-Timestamp.
- Auswertung am einfachsten über die Firebase-Console oder per Admin-SDK.

## Projektstruktur

```
src/
  app/
    layout.tsx              Root-Layout
    page.tsx                Landing Page mit den zwei Modulkarten
    globals.css             Tailwind + Basis-Styles
    lernen/
      lernseite-1/page.tsx  Platzhalter Modul 1
      lernseite-2/page.tsx  Platzhalter Modul 2
  components/
    ActivityTracker.tsx     Loggt Activities beim Mounten
  lib/
    firebase.ts             Firebase-Client + anonyme Anmeldung
    activity.ts             logActivity()-Helper
firestore.rules             Sicherheitsregeln für Firestore
```

## Inhalte ergänzen

Die Lernseiten findest du in `src/app/lernen/lernseite-1/page.tsx` und
`src/app/lernen/lernseite-2/page.tsx`. Einfach den Inhalt austauschen — der
Activity-Tracker bleibt automatisch aktiv.
