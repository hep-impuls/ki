import Link from "next/link";
import ActivityTracker from "@/components/ActivityTracker";
import AppLayout from "@/components/layout/AppLayout";
import { unit } from "@/config/unit";
import {
  FadenVertikal,
  Knoten,
  Signatur,
  type SignaturVariante,
} from "./_components/Gewebe";
import GewebeSpiel from "./_components/GewebeSpiel";
import VideoImpuls from "./_components/VideoImpuls";

/**
 * Hub von Lernseite 2 («Eine ganz neue Partnerschaft»).
 *
 * Gestaltung: statt Karten-Grid ein durchlaufender Faden, an dem die drei
 * Themenbereiche als Knoten hängen — das Fadenhafte/Gewebhafte als
 * Leitmotiv (siehe _components/Gewebe.tsx). Inhalte kommen aus
 * src/config/unit.ts (submodules von lernseite-2).
 */

const SIGNATUREN: Record<string, SignaturVariante> = {
  "vorhang-auf": "auftritt",
  "philosophische-perspektive": "epochen",
  "das-orakel": "orakel",
};

export default function Lernseite2Hub() {
  const mod = unit.modules.find((m) => m.slug === "lernseite-2");
  if (!mod) return null;
  const submodules = mod.submodules ?? [];

  return (
    <AppLayout>
      <ActivityTracker type="page_view" page="lernseite-2" />

      <header className="border-b border-outline-variant pb-lg">
        <p className="text-label-md uppercase tracking-wider text-tertiary">
          Lernseite 2 · Mensch &amp; KI
        </p>
        <h1 className="mt-sm text-headline-xl text-on-surface">{mod.title}</h1>
        <div className="mt-sm max-w-3xl space-y-sm text-body-lg text-on-surface-variant">
          <p>
            Die Welt ist in Transformation: Arbeit, Wissen, Kommunikation —
            vieles ordnet sich gleichzeitig neu, und die Zusammenhänge werden
            komplexer, als eine Einzelne sie überblicken kann. Mitten in diesem
            Umbruch tritt eine Technologie auf, die anders ist als alles, was
            wir bisher kannten: Sie spricht unsere Sprache, sie antwortet, sie
            schlägt vor, sie handelt. Werkzeuge haben wir benutzt und wieder
            weggelegt — dieses Gegenüber aber begleitet uns: im Beruf, wo es
            mitschreibt, mitrechnet und mitentwirft, und im Privaten, wo es
            erklärt, übersetzt und zuhört. Damit beginnt etwas, das man eine
            ganz neue Partnerschaft nennen kann.
          </p>
          <p>
            Eine Partnerschaft ist kein blindes Vertrauen: Sie verlangt, das
            Gegenüber zu kennen — seine Stärken, seine Grenzen und das Netz,
            an dem es hängt. Genau dazu lädt dieses Modul ein: hinschauen,
            einordnen, den eigenen Umgang finden. Denn wie jede Partnerschaft
            wird auch diese davon geprägt, wie wir sie gestalten.
          </p>
        </div>
        <GewebeSpiel className="mt-lg" />
      </header>

      {/* Video-Impuls zum Einstieg */}
      <VideoImpuls
        className="mt-xl"
        spurId="video:hub"
        videoId="WdIQsR6AH-4"
        titel="Eine ganz neue Partnerschaft — worum es geht"
        beschreibung="Ein kurzer Einstieg ins Modul: Was ist da aufgetreten, und warum lohnt es sich, genauer hinzuschauen?"
      />

      <section className="mt-xl" aria-label="Themen des Moduls">
        <div className="mb-lg">
          <h2 className="text-headline-md text-on-surface">Der Faden durch das Modul</h2>
          <p className="mt-xs max-w-3xl text-body-sm text-on-surface-variant">
            Ein Zusammenhang: Zuerst tritt die neue Akteurin auf, dann ordnet
            die philosophische Perspektive ein — und am Ende spiegelt das
            Orakel deinen eigenen Weg durchs Modul.
          </p>
        </div>

        <ol className="flex max-w-3xl flex-col">
          {submodules.map((s, i) => {
            const isLast = i === submodules.length - 1;
            return (
              <li key={s.slug} className="flex gap-md">
                <div className="flex flex-col items-center">
                  <Knoten />
                  {!isLast && <FadenVertikal />}
                </div>

                <Link
                  href={s.href}
                  className={
                    "group mb-lg min-w-0 flex-1 rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg" +
                    (isLast ? " mb-0" : "")
                  }
                >
                  <div className="flex items-start justify-between gap-md">
                    <div className="min-w-0">
                      <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                        Thema {String(i + 1).padStart(2, "0")}
                        {s.subtitle ? ` · ${s.subtitle}` : ""}
                      </p>
                      <h3 className="mt-xs text-headline-sm text-on-surface">
                        {s.title}
                      </h3>
                      {s.description && (
                        <p className="mt-sm text-body-sm text-on-surface-variant">
                          {s.description}
                        </p>
                      )}
                      <span className="mt-md inline-flex items-center gap-sm text-label-md text-tertiary">
                        Öffnen
                        <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                          arrow_forward
                        </span>
                      </span>
                    </div>
                    <Signatur
                      variante={SIGNATUREN[s.slug] ?? "gewebe"}
                      className="hidden flex-shrink-0 sm:block"
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </AppLayout>
  );
}
