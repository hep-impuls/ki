"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { leseZugang, speichereZugang, type Zugang } from "@/lib/lehrperson/zugang";

/**
 * Zugang für die secret-geschützten Lehrpersonen-Seiten (Report, Pflichtmodule,
 * Gesamtübersicht) — ohne Secret in der Adresszeile.
 *
 * Der Hub legt Code und Secret beim Absenden im `sessionStorage` ab und
 * navigiert auf die nackte Adresse. Wer eine dieser Seiten direkt aufruft,
 * bekommt das Formular unten statt einer Fehlermeldung.
 *
 * **Alte Lesezeichen funktionieren weiter.** Stehen `?code=` und `?secret=`
 * doch in der Adresse, werden sie einmal übernommen und die Adresse sofort per
 * `router.replace` bereinigt — das Secret verschwindet aus der Adresszeile und
 * hinterlässt keinen zusätzlichen Verlaufseintrag.
 */

export function useZugang(pfad: string) {
  const search = useSearchParams();
  const router = useRouter();
  const [zugang, setZugang] = useState<Zugang | null>(null);
  const [bereit, setBereit] = useState(false);

  useEffect(() => {
    const code = (search.get("code") ?? "").trim().toUpperCase();
    const secret = search.get("secret") ?? "";
    if (code && secret) {
      const z: Zugang = { code, secret };
      speichereZugang(z);
      setZugang(z);
      setBereit(true);
      router.replace(pfad); // Secret aus der Adresszeile nehmen
      return;
    }
    setZugang(leseZugang());
    setBereit(true);
  }, [search, router, pfad]);

  const setzen = useCallback((z: Zugang) => {
    speichereZugang(z);
    setZugang(z);
  }, []);

  return { zugang, bereit, setzen };
}

/**
 * Eingabefeld für Klassencode und Secret, wenn im Tab nichts hinterlegt ist.
 * Prüft nichts selbst — das tut der Server beim ersten Laden der Seite.
 */
export function ZugangFormular({
  titel,
  hinweis,
  onZugang,
}: {
  titel: string;
  hinweis: string;
  onZugang: (z: Zugang) => void;
}) {
  const [code, setCode] = useState("");
  const [secret, setSecret] = useState("");
  const [fehler, setFehler] = useState<string | null>(null);

  const absenden = useCallback(() => {
    const c = code.trim().toUpperCase();
    const s = secret.trim();
    if (!c || !s) {
      setFehler("Bitte Klassencode und Secret eingeben.");
      return;
    }
    onZugang({ code: c, secret: s });
  }, [code, secret, onZugang]);

  return (
    <div className="mt-xl max-w-md rounded-xl border border-outline-variant bg-surface-bright p-lg shadow-sm">
      <h2 className="text-headline-sm text-on-surface">{titel}</h2>
      <p className="mt-xs text-body-sm text-on-surface-variant">{hinweis}</p>
      <div className="mt-md flex flex-col gap-sm">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && absenden()}
          placeholder="Klassencode"
          autoComplete="off"
          className="w-full rounded-xl border border-outline-variant bg-surface px-md py-sm text-body-md text-on-surface outline-none focus:border-primary"
        />
        <input
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && absenden()}
          type="password"
          placeholder="Secret"
          autoComplete="off"
          className="w-full rounded-xl border border-outline-variant bg-surface px-md py-sm text-body-md text-on-surface outline-none focus:border-primary"
        />
        {fehler && <p className="text-body-sm text-error">{fehler}</p>}
        <button
          onClick={absenden}
          className="inline-flex items-center justify-center gap-sm rounded-xl bg-secondary px-lg py-sm text-label-md text-on-secondary shadow-sm transition hover:opacity-90"
        >
          Öffnen
        </button>
      </div>
      <p className="mt-md text-label-sm text-on-surface-variant">
        Die Angaben bleiben in diesem Browser-Tab und stehen nie in der
        Adresszeile. Tab schliessen löscht sie.{" "}
        <Link href="/lehrperson" className="underline">
          Zum Lehrer-Hub
        </Link>
      </p>
    </div>
  );
}
