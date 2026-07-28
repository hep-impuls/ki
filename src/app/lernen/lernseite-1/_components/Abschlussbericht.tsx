"use client";

import { useEffect, useState } from "react";
import { berichtAlsMarkdown, buildBericht, type Bericht, type BerichtThema } from "../_lib/bericht";
import Erfuellungsbalken from "./Erfuellungsbalken";

/**
 * Abschlussbericht (2026-07-28) — ersetzt das frühere **Zertifikat**.
 *
 * Zwei Änderungen gegenüber der Urkunde:
 *   1. **Keine Schwelle.** Der Bericht ist jederzeit abrufbar; es gibt kein «ab
 *      3 Stationen» mehr. Die Lernperson wählt frei, was sie bearbeitet — der
 *      Bericht zeigt, was daraus geworden ist.
 *   2. **Alles drin.** Statt nur Titel + Badges + Punktzahl enthält er sämtliche
 *      eigenen Eingaben: Vorwissen und Freitext aus dem Auftakt, Ausgangs- und
 *      Endposition, jede Meinungsfrage vorher/nachher, jede Werte-Karte, jeden
 *      Faktencheck, jede Verständnisfrage mit der gegebenen Antwort und jeden
 *      Reflexionssatz.
 *
 * **ki26-konform:** alles wird lokal aus localStorage gelesen und lokal
 * gerendert. **Kein** Upload, **kein** Cloud-Write. Drucken/PDF und der
 * Markdown-Download entstehen im Browser; nur die Lernperson entscheidet, ob
 * sie den Bericht weitergibt.
 */

function Zeile({ label, wert }: { label: string; wert: string | null }) {
  return (
    <p className="text-body-md text-on-surface-variant">
      <span className="text-on-surface">{label}:</span>{" "}
      {wert && wert.trim() !== "" ? wert : <span className="italic">nicht bearbeitet</span>}
    </p>
  );
}

function Abschnitt({
  titel,
  icon,
  children,
}: {
  titel: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-sm">
      <h3 className="flex items-center gap-xs text-label-md uppercase tracking-wider text-primary">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
        {titel}
      </h3>
      {children}
    </section>
  );
}

function ThemaBlock({ thema }: { thema: BerichtThema }) {
  return (
    <article className="flex flex-col gap-md rounded-xl border border-outline-variant bg-surface-container-low p-lg break-inside-avoid">
      <header className="flex flex-wrap items-start justify-between gap-md border-b border-outline-variant pb-md">
        <div className="flex items-start gap-md">
          <span className="material-symbols-outlined text-[24px] text-tertiary">{thema.icon}</span>
          <div>
            <p className="text-label-sm uppercase tracking-wider text-tertiary">
              Thema · {thema.kurzname}
              {thema.freiwillig && " · freiwillig"}
            </p>
            <p className="mt-xs text-body-lg text-on-surface">{thema.frage}</p>
            <p className="mt-xs text-label-sm text-on-surface-variant">{thema.tags.join(" · ")}</p>
          </div>
        </div>
        <div className="flex w-full max-w-xs flex-col gap-xs">
          <Erfuellungsbalken
            prozent={thema.erfuellung.prozent}
            erledigt={thema.erfuellung.erledigt}
            gesamt={thema.erfuellung.gesamt}
          />
          <p className="flex items-center gap-xs text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-tertiary">
              {thema.abgeschlossen ? "check_circle" : "radio_button_unchecked"}
            </span>
            {thema.abgeschlossen ? "abgeschlossen" : "noch offen"}
            {thema.quizMax > 0 && (
              <>
                {" · "}Verständnisfragen: {thema.quizPunkte} von {thema.quizMax} ({thema.quizProzent} %)
              </>
            )}
          </p>
        </div>
      </header>

      <Abschnitt titel="Meine Meinung — vorher und nachher" icon="trending_flat">
        <ul className="flex flex-col gap-sm">
          {thema.meinungen.map((m, i) => (
            <li key={i} className="rounded-lg bg-surface-bright p-md">
              <p className="text-body-md text-on-surface">{m.frage}</p>
              <div className="mt-xs flex flex-col gap-[2px]">
                <Zeile label="vorher" wert={m.vorher} />
                <Zeile label="nachher" wert={m.nachher} />
              </div>
            </li>
          ))}
        </ul>
      </Abschnitt>

      <Abschnitt titel="Meine Werte-Karten" icon="touch_app">
        <ul className="flex flex-col gap-xs">
          {thema.werte.map((w, i) => (
            <li key={i} className="rounded-lg bg-surface-bright px-md py-sm">
              <p className="text-body-md text-on-surface">{w.aussage}</p>
              <Zeile label="meine Wahl" wert={w.antwort} />
            </li>
          ))}
        </ul>
      </Abschnitt>

      <Abschnitt titel="Faktencheck" icon="fact_check">
        <ul className="flex flex-col gap-xs">
          {thema.fakten.map((f, i) => (
            <li key={i} className="rounded-lg bg-surface-bright px-md py-sm">
              <p className="text-body-md text-on-surface">{f.richtigstellung}</p>
              <p className="text-body-md text-on-surface-variant">
                <span className="text-on-surface">Gezeigt wurde:</span>{" "}
                {f.gezeigtWahr ? "die zutreffende Aussage" : "eine verfälschte Variante"} ·{" "}
                <span className="text-on-surface">meine Antwort:</span>{" "}
                {f.antwort ? (
                  <>
                    {f.antwort} ({f.korrekt ? "richtig erkannt" : "nicht erkannt"})
                  </>
                ) : (
                  <span className="italic">nicht bearbeitet</span>
                )}
              </p>
              <p className="text-label-sm text-on-surface-variant">
                Quelle:{" "}
                <a href={f.quelleUrl} target="_blank" rel="noreferrer" className="text-primary underline">
                  {f.quelle}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </Abschnitt>

      <Abschnitt titel="Verständnisfragen" icon="quiz">
        <ul className="flex flex-col gap-xs">
          {thema.fragen.map((q, i) => (
            <li key={i} className="rounded-lg bg-surface-bright px-md py-sm">
              <p className="text-body-md text-on-surface">{q.frage}</p>
              <p className="text-body-md text-on-surface-variant">
                <span className="text-on-surface">meine Antwort:</span>{" "}
                {q.antwort ? (
                  <>
                    {q.antwort} ({q.korrekt ? "richtig" : "falsch"} · {q.punkte} von {q.max} Punkten)
                  </>
                ) : (
                  <span className="italic">nicht bearbeitet</span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </Abschnitt>

      <Abschnitt titel="Mein Satz zum Thema" icon="edit_note">
        <p className="rounded-lg bg-surface-bright p-md text-body-md text-on-surface">
          {thema.reflexion.trim() !== "" ? (
            thema.reflexion
          ) : (
            <span className="italic text-on-surface-variant">nicht bearbeitet</span>
          )}
        </p>
      </Abschnitt>
    </article>
  );
}

/** Markdown-Datei lokal erzeugen und herunterladen (kein Netzwerk beteiligt). */
function herunterladen(bericht: Bericht) {
  const blob = new Blob([berichtAlsMarkdown(bericht)], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "abschlussbericht-ki-im-alltag.md";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function Abschlussbericht({ onBack }: { onBack?: () => void }) {
  // Erst nach Mount aus localStorage lesen (SSR-Hydration-sicher).
  const [bericht, setBericht] = useState<Bericht | null>(null);
  useEffect(() => setBericht(buildBericht()), []);

  if (!bericht) {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-bright p-lg text-body-md text-on-surface-variant">
        Bericht wird zusammengestellt …
      </div>
    );
  }

  const a = bericht.auftakt;
  const delta = a.sliderVor != null && a.sliderNach != null ? a.sliderNach - a.sliderVor : null;
  const bearbeiteteThemen = bericht.themen.filter((t) => t.erfuellung.erledigt > 0);

  return (
    <div className="flex flex-col gap-md">
      {/* Steuerleiste — beim Druck ausgeblendet */}
      <div className="flex flex-wrap items-center justify-between gap-md print:hidden">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-xs text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Zurück zu den Themen
          </button>
        ) : (
          <span />
        )}
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            onClick={() => herunterladen(bericht)}
            className="inline-flex items-center gap-xs rounded-lg border border-outline-variant px-lg py-sm text-label-md text-on-surface transition-colors hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Als Textdatei speichern
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-xs rounded-lg bg-primary px-lg py-sm text-label-md text-on-primary transition-opacity hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            Drucken / als PDF speichern
          </button>
        </div>
      </div>

      <article className="flex flex-col gap-lg rounded-xl border-2 border-tertiary bg-surface-bright p-lg shadow-sm">
        <header className="flex flex-col items-center gap-sm border-b border-outline-variant pb-lg text-center">
          <span className="material-symbols-outlined text-[40px] text-tertiary">description</span>
          <p className="text-label-md uppercase tracking-wider text-tertiary">Abschlussbericht</p>
          <h2 className="text-headline-lg text-on-surface">KI im Alltag — mein Weg durch die Themen</h2>
          <p className="text-body-md text-on-surface-variant">
            Erstellt am {bericht.datum} · {bericht.bearbeitet} von {bericht.themen.length} Themen
            bearbeitet · {bericht.abgeschlossen} abgeschlossen
          </p>
          <div className="w-full max-w-sm">
            <Erfuellungsbalken
              prozent={bericht.gesamt.prozent}
              erledigt={bericht.gesamt.erledigt}
              gesamt={bericht.gesamt.gesamt}
              label="der gesamten Einheit bearbeitet"
            />
          </div>
        </header>

        {/* Gesamtbilanz */}
        <section className="grid gap-md sm:grid-cols-2">
          <div className="flex items-center gap-sm rounded-lg bg-surface-container-low p-md">
            <span className="material-symbols-outlined text-[22px] text-primary">stars</span>
            <p className="text-body-md text-on-surface">
              Verständnisfragen gesamt:{" "}
              <span className="font-semibold">{bericht.quizPunkte}</span> von {bericht.quizMax} Punkten
            </p>
          </div>
          <div className="flex items-center gap-sm rounded-lg bg-surface-container-low p-md">
            <span className="material-symbols-outlined text-[22px] text-tertiary">military_tech</span>
            <p className="text-body-md text-on-surface">
              {bericht.badges.length > 0
                ? bericht.badges
                    .map((b) => `${b.label}${b.anzahl > 1 ? ` ×${b.anzahl}` : ""}`)
                    .join(" · ")
                : "Noch keine Badges — die gibt es beim Abschluss eines Themas."}
            </p>
          </div>
        </section>

        {/* Auftakt */}
        <section className="flex flex-col gap-md rounded-xl border border-outline-variant bg-surface-container-low p-lg">
          <h3 className="flex items-center gap-xs text-headline-sm text-on-surface">
            <span className="material-symbols-outlined text-[22px] text-tertiary">flag</span>
            Mein Auftakt
          </h3>

          <Abschnitt titel="Wo mir KI begegnet ist" icon="checklist">
            <p className="text-body-md text-on-surface">
              {a.vorwissen.length > 0 ? (
                a.vorwissen.join(" · ")
              ) : (
                <span className="italic text-on-surface-variant">nichts ausgewählt</span>
              )}
            </p>
          </Abschnitt>

          <Abschnitt titel="Mein Freitext" icon="edit_note">
            <p className="rounded-lg bg-surface-bright p-md text-body-md text-on-surface">
              {a.freitext.trim() !== "" ? (
                a.freitext
              ) : (
                <span className="italic text-on-surface-variant">nicht ausgefüllt</span>
              )}
            </p>
          </Abschnitt>

          <Abschnitt titel="Meine Position: Bedrohung ↔ Chance" icon="trending_flat">
            <div className="flex flex-col gap-[2px]">
              <Zeile
                label="am Anfang"
                wert={a.sliderVor != null ? `${a.sliderVor} von 100` : null}
              />
              <Zeile
                label="am Ende"
                wert={a.sliderNach != null ? `${a.sliderNach} von 100` : null}
              />
              {delta != null && (
                <p className="text-body-md text-on-surface">
                  {delta === 0
                    ? "Unverändert — deine Haltung ist stabil geblieben."
                    : delta > 0
                      ? `Um ${delta} Punkte Richtung Chance bewegt.`
                      : `Um ${Math.abs(delta)} Punkte Richtung Bedrohung bewegt.`}
                </p>
              )}
            </div>
          </Abschnitt>

          <Abschnitt titel="Meine Haltungsfragen" icon="balance">
            <ul className="flex flex-col gap-sm">
              {a.haltung.map((h, i) => (
                <li key={i} className="rounded-lg bg-surface-bright p-md">
                  <p className="text-body-md text-on-surface">{h.frage}</p>
                  <div className="mt-xs flex flex-col gap-[2px]">
                    <Zeile label="vorher" wert={h.vorher} />
                    <Zeile label="nachher" wert={h.nachher} />
                  </div>
                </li>
              ))}
            </ul>
          </Abschnitt>

          <Abschnitt titel="Meine Werte-Karten" icon="touch_app">
            <ul className="flex flex-col gap-xs">
              {a.werte.map((w, i) => (
                <li key={i} className="rounded-lg bg-surface-bright px-md py-sm">
                  <p className="text-body-md text-on-surface">{w.aussage}</p>
                  <Zeile label="meine Wahl" wert={w.antwort} />
                </li>
              ))}
            </ul>
          </Abschnitt>
        </section>

        {/* Themen */}
        {bearbeiteteThemen.length > 0 ? (
          <section className="flex flex-col gap-lg">
            <h3 className="flex items-center gap-xs text-headline-sm text-on-surface">
              <span className="material-symbols-outlined text-[22px] text-tertiary">explore</span>
              Meine Themen
            </h3>
            {bearbeiteteThemen.map((t) => (
              <ThemaBlock key={t.id} thema={t} />
            ))}
          </section>
        ) : (
          <p className="flex items-start gap-sm rounded-lg bg-surface-container-low p-md text-body-md text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px] text-tertiary">info</span>
            Du hast noch kein Thema bearbeitet. Sobald du eines öffnest, erscheint hier alles, was
            du darin festhältst.
          </p>
        )}

        <footer className="border-t border-outline-variant pt-md text-center text-label-sm text-on-surface-variant">
          Selbstgesteuerte KI-Einheit · alle Angaben lokal auf diesem Gerät erzeugt, keine Bewertung.
          Der Bericht verlässt dein Gerät nur, wenn du ihn selbst weitergibst.
        </footer>
      </article>
    </div>
  );
}
