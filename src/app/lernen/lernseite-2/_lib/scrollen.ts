/**
 * Sichtbar machen, aber nur wenn nötig.
 *
 * Beim Aufklappen einer Karte will man den neuen Text sofort lesen können. Ein
 * `scrollIntoView` bei jedem Klick ist dafür zu grob: Klickt man eine Karte an,
 * die schon gut sichtbar ist, ruckt die Seite ohne Not, und man verliert die
 * Orientierung («ich falle nach unten»).
 *
 * Darum: erst messen. Gescrollt wird nur, wenn die Kopfzeile der Karte
 *  · hinter der klebenden Seitenkopfzeile verschwindet, oder
 *  · so tief steht, dass der aufgeklappte Text unter den Rand fällt.
 * Sonst bleibt die Seite, wo sie ist.
 */

/** Höhe der klebenden Kopfzeile plus Luft (entspricht `scroll-mt-24`). */
const KOPFZEILE = 96;
/** Tiefer als dieser Anteil des Fensters und der neue Text bleibt unsichtbar. */
const ZU_TIEF = 0.45;

export function zeigeBeimOeffnen(el: HTMLElement | null) {
  if (!el) return;
  // Nach dem Commit messen (setTimeout statt requestAnimationFrame, weil rAF in
  // Hintergrund-Tabs pausiert).
  setTimeout(() => {
    const oben = el.getBoundingClientRect().top;
    const zuHoch = oben < KOPFZEILE;
    const zuTief = oben > window.innerHeight * ZU_TIEF;
    if (!zuHoch && !zuTief) return; // schon gut sichtbar, nichts tun
    // `auto` statt `smooth`: sanftes Scrollen ist in manchen Umgebungen
    // wirkungslos, und `Abschnitt.tsx` macht es genauso.
    el.scrollIntoView({ behavior: "auto", block: "start" });
  }, 0);
}
