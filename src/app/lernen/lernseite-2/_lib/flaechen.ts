/**
 * Flächen — geteilte Geometrie fürs «Weben»: Delaunay-Triangulation über eine
 * Punktwolke, damit sowohl der «Teppich des Wandels» als auch die KI-Story
 * zwischen besuchten Punkten gefüllte Maschen (Flächen) bilden können. Eine
 * Fläche gilt als geknüpft, sobald alle drei Ecken besucht sind.
 *
 * Isomorph, ohne React/Firebase — nur reine Funktionen.
 */

export type XY = { x: number; y: number };

/** Umkreis-Mittelpunkt + Radius² dreier Punkte (für Delaunay). */
function umkreis(a: XY, b: XY, c: XY) {
  const ad = a.x * a.x + a.y * a.y;
  const bd = b.x * b.x + b.y * b.y;
  const cd = c.x * c.x + c.y * c.y;
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-9) return { x: 0, y: 0, r2: Infinity };
  const x = (ad * (b.y - c.y) + bd * (c.y - a.y) + cd * (a.y - b.y)) / d;
  const y = (ad * (c.x - b.x) + bd * (a.x - c.x) + cd * (b.x - a.x)) / d;
  const r2 = (a.x - x) ** 2 + (a.y - y) ** 2;
  return { x, y, r2 };
}

/**
 * Delaunay-Triangulation (Bowyer–Watson) über die Punkte — liefert Tripel von
 * Punkt-Indizes. Bei ≤ ein paar Dutzend Punkten problemlos. Deterministisch.
 */
export function trianguliere(pts: XY[]): [number, number, number][] {
  const n = pts.length;
  if (n < 3) return [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of pts) {
    minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
  }
  const dmax = Math.max(maxX - minX, maxY - minY) || 1;
  const midX = (minX + maxX) / 2, midY = (minY + maxY) / 2;
  const verts: XY[] = [
    ...pts,
    { x: midX - 20 * dmax, y: midY - dmax },
    { x: midX, y: midY + 20 * dmax },
    { x: midX + 20 * dmax, y: midY - dmax },
  ];
  let tris: [number, number, number][] = [[n, n + 1, n + 2]];
  for (let i = 0; i < n; i++) {
    const p = verts[i];
    const kaputt: [number, number, number][] = [];
    tris = tris.filter((t) => {
      const cc = umkreis(verts[t[0]], verts[t[1]], verts[t[2]]);
      const drin = (p.x - cc.x) ** 2 + (p.y - cc.y) ** 2 <= cc.r2;
      if (drin) kaputt.push(t);
      return !drin;
    });
    const kanten: [number, number][] = [];
    kaputt.forEach((t) => {
      kanten.push([t[0], t[1]], [t[1], t[2]], [t[2], t[0]]);
    });
    kanten.forEach((e, idx) => {
      const geteilt = kanten.some(
        (f, j) =>
          j !== idx &&
          ((f[0] === e[0] && f[1] === e[1]) || (f[0] === e[1] && f[1] === e[0])),
      );
      if (!geteilt) tris.push([e[0], e[1], i]);
    });
  }
  return tris.filter((t) => t.every((v) => v < n));
}

/**
 * Maschen (Flächen) über eine Punktwolke: triangulieren und zu grosse Dreiecke
 * verwerfen, damit nur lokale, «webbare» Felder bleiben.
 */
export function maschen(coords: XY[], maxKante = 260): [number, number, number][] {
  const e = (p: XY, q: XY) => Math.hypot(p.x - q.x, p.y - q.y);
  return trianguliere(coords).filter((t) => {
    const [a, b, c] = t.map((i) => coords[i]);
    return Math.max(e(a, b), e(b, c), e(c, a)) <= maxKante;
  });
}

/** Wie viele Maschen sind vollständig geknüpft (alle drei Ecken besucht)? */
export function zaehleGefuellt(
  tris: [number, number, number][],
  besucht: Set<number>,
): number {
  return tris.filter((t) => t.every((v) => besucht.has(v))).length;
}
