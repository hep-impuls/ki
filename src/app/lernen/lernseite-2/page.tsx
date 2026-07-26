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
import AktivitaetsNetzFloat from "./_components/AktivitaetsNetzFloat";
import Ausklapptext from "./_components/Ausklapptext";
import ModulMiniNav from "./_components/ModulMiniNav";

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
            Kaum ein Thema ist so präsent wie die Künstliche Intelligenz — und
            kaum eines so schwer zu fassen. Es wird viel über sie gesagt, doch
            vieles bleibt schemenhaft, ein Reden über etwas, das man selten
            wirklich vor Augen hat. Dieses Lernset will die KI{" "}
            <strong className="text-on-surface">sichtbarer und verständlicher</strong>{" "}
            machen, indem es ihr eine <strong className="text-on-surface">Gestalt</strong>{" "}
            gibt.
          </p>
          <p>
            Diese Gestalt zeigt sich nicht, wenn man die KI isoliert betrachtet.
            KI steht nie für sich: Sie baut auf kulturellen, technischen und
            wirtschaftlichen Überlegungen auf — und erst wenn man dieses Netz
            mitzeichnet, wird erkennbar, was da eigentlich auftritt. Darum folgt
            das Design dieses Lernsets einer Idee: Um das Phänomen zu verstehen,
            muss man das <strong className="text-on-surface">Netzwerk abbilden</strong>,
            in dem es steckt.
          </p>
          <p>
            Deshalb beginnst du gleich mit einem Muster, dessen Knoten du
            verbinden kannst — noch <strong className="text-on-surface">ohne
            konkreten Inhalt</strong>. Es deutet nur auf den Gedanken, dass KI
            als Phänomen zu erfassen viel <strong className="text-on-surface">Kontextarbeit</strong>{" "}
            braucht. In diesem Lernset geht es darum immer auch um den Kontext
            der KI.
          </p>
          <Ausklapptext titel="Mehr dazu: Wie die Philosophie das weiterdenkt">
            <p>
              Genau hier setzt später die philosophische Perspektive an: Je nach
              Blickwinkel lässt sich dieser Kontext besser oder schlechter
              fassen. Besonders Denkweisen, die auf Netzwerke zeigen und auf das
              eigentlich Menschliche — dass der Mensch nicht bloss rechnendes
              Wissens- und Textwesen ist, sondern, mit Hannah Arendt, ein
              Anfangen-Können; mit Martin Heidegger ein Wesen der Sorge; mit der
              Systemtheorie ein Reduzieren von Komplexität, indem sie Muster
              erfasst und Abläufe koordiniert — machen sichtbar, worin die KI
              eingebettet ist.
            </p>
          </Ausklapptext>
        </div>
        <GewebeSpiel
          className="mt-lg"
          weben
          bereichLabel="Einstiegsmuster (Hub)"
        />
      </header>

      {/* Mitfahrendes Aktivitätsnetz — wie auf der Auftakt-Seite */}
      <AktivitaetsNetzFloat />

      {/* Mitschwebende Mini-Navigation auf die drei Seiten */}
      <ModulMiniNav />

      {/* Orientierung: die drei Dinge, die auf jeder Seite mitlaufen */}
      <section
        aria-label="So findest du dich zurecht"
        className="mt-xl rounded-xl border border-outline-variant bg-surface-container-low p-md sm:p-lg"
      >
        <p className="flex items-center gap-sm text-label-md uppercase tracking-wider text-tertiary">
          <span className="material-symbols-outlined text-[20px]">explore</span>
          So findest du dich zurecht
        </p>
        <ul className="mt-sm space-y-sm text-body-sm text-on-surface-variant">
          <li className="flex items-start gap-sm">
            <span className="material-symbols-outlined mt-[2px] flex-shrink-0 text-[20px] text-tertiary">
              forest
            </span>
            <span>
              <strong className="text-on-surface">Das Aktivitäts-Rhizom</strong>{" "}
              unten rechts läuft fortlaufend mit. Aus einer Wurzel wachsen sechs
              Triebe: <em>wo</em> du warst (Flächen, Punkte, Bildpunkte, Videos)
              und <em>wie tief</em> du gegangen bist (Vertiefungen hinter «Mehr
              lesen», Merkzeichen «Das verfolge ich weiter»). Ein Klick öffnet
              es ganz. Im Hintergrund wächst blass mit, was alle zusammen
              angeschaut haben.
            </span>
          </li>
          <li className="flex items-start gap-sm">
            <span className="material-symbols-outlined mt-[2px] flex-shrink-0 text-[20px] text-tertiary">
              data_object
            </span>
            <span>
              <strong className="text-on-surface">Die Abschnitte einer Seite</strong>{" "}
              musst du nicht scrollend suchen. Jede Seite hat oben eine Liste
              ihrer Abschnitte, und das Klammersymbol oben rechts öffnet
              dieselbe Liste jederzeit, mit einem Häkchen bei allem, wo du schon
              tätig warst. Ein Klick springt hin.
            </span>
          </li>
          <li className="flex items-start gap-sm">
            <span className="material-symbols-outlined mt-[2px] flex-shrink-0 text-[20px] text-tertiary">
              linear_scale
            </span>
            <span>
              <strong className="text-on-surface">Zwischen den drei Themen</strong>{" "}
              wechselst du über «Der Faden» oben rechts, wo die aktuelle Seite
              markiert ist. Am Fuss jeder Seite geht es ausserdem direkt zur
              nächsten. Die Reihenfolge ist ein Vorschlag, keine Vorschrift.
            </span>
          </li>
        </ul>
      </section>

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
