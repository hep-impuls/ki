import KorrektoratApp from "./_components/KorrektoratApp";

/**
 * `/korrektorat` — Editor für das externe Korrektorat.
 *
 * Die Seite ist bewusst nirgends verlinkt und auf `noindex` gestellt (siehe
 * [layout.tsx](./layout.tsx)); wer den Passcode nicht hat, sieht nur die
 * Anmeldemaske. Ablauf und Wartung: `docs/KORREKTORAT.md`.
 */

export default function KorrektoratSeite() {
  return <KorrektoratApp />;
}
