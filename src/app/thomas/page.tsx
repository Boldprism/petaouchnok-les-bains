"use client";

import { useState } from "react";

// ═══════════════════════════════════════════════
// ASTRONOMICAL CORE  (Jean Meeus, Astronomical Algorithms)
// ═══════════════════════════════════════════════
const R = Math.PI / 180;
const D = 180 / Math.PI;
const norm = (x: number) => ((x % 360) + 360) % 360;
const toR = (d: number) => d * R;
const toD = (r: number) => r * D;
const f = (n: number) => n.toFixed(2);

function julianDay(yr: number, mo: number, dy: number, utH: number) {
  let y = yr, m = mo;
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dy + utH / 24 + B - 1524.5;
}

function sunLon(jd: number) {
  const T = (jd - 2451545) / 36525;
  const L0 = norm(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = norm(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mr = toR(M);
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
    + 0.000289 * Math.sin(3 * Mr);
  const omega = norm(125.04 - 1934.136 * T);
  return norm(L0 + C - 0.00569 - 0.00478 * Math.sin(toR(omega)));
}

function moonLon(jd: number) {
  const T = (jd - 2451545) / 36525;
  const L = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841;
  const M = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699;
  const Ms = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  const D_ = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T * T * T / 545868;
  const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;
  const Mr = toR(norm(M)), Msr = toR(norm(Ms)), Dr = toR(norm(D_)), Fr = toR(norm(F));
  const dL =
    6288774 * Math.sin(Mr) +
    1274027 * Math.sin(2 * Dr - Mr) +
    658314  * Math.sin(2 * Dr) +
    213618  * Math.sin(2 * Mr) +
    -185116 * Math.sin(Msr) +
    -114332 * Math.sin(2 * Fr) +
    58793   * Math.sin(2 * Dr - 2 * Mr) +
    57066   * Math.sin(2 * Dr - Msr - Mr) +
    53322   * Math.sin(2 * Dr + Mr) +
    45758   * Math.sin(2 * Dr - Msr) +
    -40923  * Math.sin(Msr - Mr) +
    -34720  * Math.sin(Dr) +
    -30383  * Math.sin(Msr + Mr) +
    15327   * Math.sin(2 * Dr - 2 * Fr) +
    10980   * Math.sin(Mr - 2 * Fr) +
    10675   * Math.sin(4 * Dr - Mr) +
    10034   * Math.sin(3 * Mr) +
    8548    * Math.sin(4 * Dr - 2 * Mr) +
    -7888   * Math.sin(2 * Dr + Msr - Mr) +
    -6766   * Math.sin(2 * Dr + Msr) +
    -5163   * Math.sin(Dr - Mr) +
    4987    * Math.sin(Dr + Msr) +
    4036    * Math.sin(2 * Dr - Msr + Mr) +
    3994    * Math.sin(2 * Dr + 2 * Mr) +
    3861    * Math.sin(4 * Dr) +
    3665    * Math.sin(2 * Dr - 3 * Mr) +
    2390    * Math.sin(2 * Dr - Msr - 2 * Mr) +
    2236    * Math.sin(2 * Dr - 2 * Msr) +
    -2069   * Math.sin(2 * Msr) +
    -1773   * Math.sin(2 * Dr + Mr - 2 * Fr) +
    -1595   * Math.sin(2 * Dr + 2 * Fr) +
    1215    * Math.sin(4 * Dr - Msr - Mr) +
    -892    * Math.sin(3 * Dr - Mr) +
    759     * Math.sin(4 * Dr - Msr - 2 * Mr) +
    -713    * Math.sin(2 * Msr - Mr) +
    -700    * Math.sin(2 * Dr + 2 * Msr - Mr) +
    596     * Math.sin(2 * Dr - Msr - 2 * Fr) +
    549     * Math.sin(4 * Dr + Mr) +
    537     * Math.sin(4 * Mr) +
    -487    * Math.sin(Dr - 2 * Mr);
  return norm(L + dL / 1000000);
}

function planetLon(jd: number, body: string) {
  const T = (jd - 2451545) / 36525;
  const data: Record<string, number[]> = {
    mercury: [252.25084, 149472.67411778, 77.45779628, 0.20563069],
    venus:   [181.97973,  58517.81538729, 131.56370300, 0.00677323],
    mars:    [355.45332,  19140.29934243, 336.04084,    0.09341233],
    jupiter: [ 34.40438,   3034.74612775,  14.72847580, 0.04849485],
    saturn:  [ 49.94432,   1222.49362201,  92.86136063, 0.05550825],
    uranus:  [313.23218,    428.48202785, 170.96424122, 0.04629590],
    neptune: [304.87997,    218.45945325,  44.96476330, 0.00898809],
    pluto:   [238.95600,    145.18000000, 224.07000000, 0.24877000],
  };
  const [L0, L1, w, e] = data[body];
  const L = norm(L0 + L1 * T);
  const M = toR(norm(L - w));
  const C = (2 * e - e * e * e / 4) * Math.sin(M) +
    (5 / 4) * e * e * Math.sin(2 * M) +
    (13 / 12) * e * e * e * Math.sin(3 * M);
  return norm(L + toD(C));
}

function gmst(jd: number) {
  const T = (jd - 2451545) / 36525;
  return norm(280.46061837 + 360.98564736629 * (jd - 2451545) +
    0.000387933 * T * T - T * T * T / 38710000);
}

function calcAscMC(jd: number, lat: number, lon: number) {
  const lst = norm(gmst(jd) + lon);
  const eps = toR(23.4393);
  const latR = toR(lat);
  const lstR = toR(lst);
  const y = -Math.cos(lstR);
  const x = Math.sin(lstR) * Math.cos(eps) + Math.tan(latR) * Math.sin(eps);
  let asc = norm(toD(Math.atan2(y, x)));
  if (lst >= 0 && lst < 180 && asc >= 180) asc = norm(asc - 180);
  if (lst >= 180 && lst < 360 && asc < 180) asc = norm(asc + 180);
  const mc = norm(toD(Math.atan2(Math.sin(lstR), Math.cos(lstR) * Math.cos(eps))));
  return { asc, mc, lst };
}

// ═══════════════════════════════════════════════
// ASTROLOGICAL DATA
// ═══════════════════════════════════════════════
const SIGNS = [
  { name: "Bélier",     sym: "♈", el: "feu",   mod: "cardinal", ruler: "♂",  color: "#C0392B" },
  { name: "Taureau",    sym: "♉", el: "terre",  mod: "fixe",     ruler: "♀",  color: "#8B6914" },
  { name: "Gémeaux",    sym: "♊", el: "air",    mod: "mutable",  ruler: "☿",  color: "#2471A3" },
  { name: "Cancer",     sym: "♋", el: "eau",    mod: "cardinal", ruler: "☽",  color: "#1A6B8A" },
  { name: "Lion",       sym: "♌", el: "feu",    mod: "fixe",     ruler: "☉",  color: "#C0392B" },
  { name: "Vierge",     sym: "♍", el: "terre",  mod: "mutable",  ruler: "☿",  color: "#8B6914" },
  { name: "Balance",    sym: "♎", el: "air",    mod: "cardinal", ruler: "♀",  color: "#2471A3" },
  { name: "Scorpion",   sym: "♏", el: "eau",    mod: "fixe",     ruler: "♇",  color: "#1A6B8A" },
  { name: "Sagittaire", sym: "♐", el: "feu",    mod: "mutable",  ruler: "♃",  color: "#C0392B" },
  { name: "Capricorne", sym: "♑", el: "terre",  mod: "cardinal", ruler: "♄",  color: "#8B6914" },
  { name: "Verseau",    sym: "♒", el: "air",    mod: "fixe",     ruler: "⛢", color: "#2471A3" },
  { name: "Poissons",   sym: "♓", el: "eau",    mod: "mutable",  ruler: "♆",  color: "#1A6B8A" },
];

const EL_COLORS: Record<string, string> = { feu: "#7a1a1a", terre: "#4a3510", air: "#0e2a44", eau: "#0a3035" };
const EL_TEXT: Record<string, string>   = { feu: "#FF7B7B", terre: "#C8A84B", air: "#7EC8E3", eau: "#4DD9C0" };

const signOf = (lon: number) => {
  const i = Math.floor(norm(lon) / 30) % 12;
  return { ...SIGNS[i], deg: norm(lon) % 30, idx: i };
};

const degStr = (d: number) => {
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  return `${deg}°${String(min).padStart(2, "0")}'`;
};

const PLANETS = [
  { key: "sun",     name: "Soleil",  sym: "☉", color: "#FFD700" },
  { key: "moon",    name: "Lune",    sym: "☽", color: "#E0E0E0" },
  { key: "mercury", name: "Mercure", sym: "☿", color: "#B0C8DE" },
  { key: "venus",   name: "Vénus",   sym: "♀", color: "#FFB6C1" },
  { key: "mars",    name: "Mars",    sym: "♂", color: "#FF5733" },
  { key: "jupiter", name: "Jupiter", sym: "♃", color: "#DEB887" },
  { key: "saturn",  name: "Saturne", sym: "♄", color: "#A0937D" },
  { key: "uranus",  name: "Uranus",  sym: "⛢", color: "#40E0D0" },
  { key: "neptune", name: "Neptune", sym: "♆", color: "#6B8DD6" },
  { key: "pluto",   name: "Pluton",  sym: "♇", color: "#9B4444" },
];

// ═══════════════════════════════════════════════
// SVG CHART WHEEL
// ═══════════════════════════════════════════════
function lonToXY(lon: number, asc: number, r: number, cx: number, cy: number) {
  const a = toR(norm(lon - asc));
  return { x: cx - r * Math.cos(a), y: cy - r * Math.sin(a) };
}

interface PlanetEntry { planet: typeof PLANETS[number]; lon: number; displayLon?: number; realLon?: number; }

function spreadPositions(planets: PlanetEntry[]) {
  const result = planets.map(p => ({ ...p, displayLon: p.lon, realLon: p.lon }));
  const MIN_GAP = 18;
  for (let iter = 0; iter < 20; iter++) {
    let changed = false;
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const gap = norm(result[j].displayLon! - result[i].displayLon!);
        const signed = gap > 180 ? gap - 360 : gap;
        if (Math.abs(signed) < MIN_GAP) {
          const push = (MIN_GAP - Math.abs(signed)) / 2;
          result[i].displayLon = norm(result[i].displayLon! - push);
          result[j].displayLon = norm(result[j].displayLon! + push);
          changed = true;
        }
      }
    }
    if (!changed) break;
  }
  return result;
}

function ChartWheel({ planets, asc, mc }: { planets: PlanetEntry[]; asc: number; mc: number }) {
  const cx = 200, cy = 200;
  const R_OUT = 188, R_ZODIAC = 160, R_HOUSE = 155, R_INNER = 135, R_PLANET = 108;

  const zodiacSegments = SIGNS.map((sign, i) => {
    const sLon = i * 30, eLon = (i + 1) * 30;
    const sA = toR(norm(sLon - asc)), eA = toR(norm(eLon - asc));
    const x1o = cx - R_OUT * Math.cos(sA),    y1o = cy - R_OUT * Math.sin(sA);
    const x2o = cx - R_OUT * Math.cos(eA),    y2o = cy - R_OUT * Math.sin(eA);
    const x1z = cx - R_ZODIAC * Math.cos(sA), y1z = cy - R_ZODIAC * Math.sin(sA);
    const x2z = cx - R_ZODIAC * Math.cos(eA), y2z = cy - R_ZODIAC * Math.sin(eA);
    const path = `M${f(x1o)},${f(y1o)} A${R_OUT},${R_OUT} 0 0 0 ${f(x2o)},${f(y2o)} L${f(x2z)},${f(y2z)} A${R_ZODIAC},${R_ZODIAC} 0 0 1 ${f(x1z)},${f(y1z)}Z`;
    const mid = toR(norm(sLon + 15 - asc));
    const symR = (R_OUT + R_ZODIAC) / 2;
    return { sign, path, sx: cx - symR * Math.cos(mid), sy: cy - symR * Math.sin(mid) };
  });

  const houseCusps = Array.from({ length: 12 }, (_: unknown, i: number) => norm(asc + i * 30));
  const spreadPlanets = spreadPositions(planets);

  return (
    <svg viewBox="0 0 400 400" width="360" height="360" style={{ display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0d1022" />
          <stop offset="100%" stopColor="#050710" />
        </radialGradient>
        <radialGradient id="innerBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0a0c1a" />
          <stop offset="100%" stopColor="#060812" />
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={R_OUT} fill="url(#bg)" />

      {[...Array(30)].map((_: unknown, i: number) => {
        const a = (i / 30) * 360 + i * 7.3;
        const r = R_ZODIAC + 10 + (i % 5) * 5;
        const p = lonToXY(a + (asc % 360), asc, r, cx, cy);
        return <circle key={i} cx={p.x} cy={p.y} r="0.6" fill="rgba(255,255,255,0.25)" />;
      })}

      {zodiacSegments.map(({ sign, path, sx, sy }) => (
        <g key={sign.name}>
          <path d={path} fill={EL_COLORS[sign.el]} stroke="rgba(180,150,80,0.2)" strokeWidth="0.3" />
          <text x={f(sx)} y={f(sy)} textAnchor="middle" dominantBaseline="middle"
            fontSize="13" fill="rgba(220,200,150,0.85)" fontFamily="Georgia, serif">{sign.sym}</text>
        </g>
      ))}

      <circle cx={cx} cy={cy} r={R_OUT} fill="none" stroke="rgba(180,150,80,0.4)" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={R_ZODIAC} fill="none" stroke="rgba(180,150,80,0.4)" strokeWidth="0.5" />

      {Array.from({ length: 12 }, (_: unknown, i: number) => {
        const a = toR(norm(i * 30 - asc));
        return (
          <line key={i}
            x1={f(cx - R_ZODIAC * Math.cos(a))} y1={f(cy - R_ZODIAC * Math.sin(a))}
            x2={f(cx - R_OUT * Math.cos(a))}    y2={f(cy - R_OUT * Math.sin(a))}
            stroke="rgba(180,150,80,0.5)" strokeWidth="0.5" />
        );
      })}

      <circle cx={cx} cy={cy} r={R_INNER} fill="url(#innerBg)" />

      {houseCusps.map((cusp, i) => {
        const a = toR(norm(cusp - asc));
        const isAxis = i % 3 === 0;
        return (
          <line key={i}
            x1={f(cx - R_INNER * Math.cos(a))} y1={f(cy - R_INNER * Math.sin(a))}
            x2={f(cx - 12 * Math.cos(a))}       y2={f(cy - 12 * Math.sin(a))}
            stroke={isAxis ? "rgba(212,175,55,0.7)" : "rgba(180,150,80,0.25)"}
            strokeWidth={isAxis ? "1.2" : "0.6"}
          />
        );
      })}

      {Array.from({ length: 12 }, (_: unknown, i: number) => {
        const midLon = norm(asc + (i + 0.5) * 30);
        const p = lonToXY(midLon, asc, R_HOUSE - 10, cx, cy);
        return (
          <text key={i} x={f(p.x)} y={f(p.y)} textAnchor="middle" dominantBaseline="middle"
            fontSize="8" fill="rgba(180,150,80,0.55)" fontFamily="Georgia, serif">{i + 1}</text>
        );
      })}

      <circle cx={cx} cy={cy} r={R_INNER} fill="none" stroke="rgba(180,150,80,0.35)" strokeWidth="0.5" />

      {(() => {
        const p = lonToXY(mc, asc, R_ZODIAC - 5, cx, cy);
        return (
          <text x={f(p.x)} y={f(p.y)} textAnchor="middle" dominantBaseline="middle"
            fontSize="6.5" fill="#D4AF37" fontFamily="Georgia, serif" fontWeight="bold">MC</text>
        );
      })()}

      <text x="8" y={cy} textAnchor="start" dominantBaseline="middle" fontSize="7" fill="#D4AF37" fontFamily="Georgia, serif">ASC</text>
      <text x="392" y={cy} textAnchor="end" dominantBaseline="middle" fontSize="7" fill="#D4AF37" fontFamily="Georgia, serif">DSC</text>

      {spreadPlanets.map(({ planet, displayLon, realLon }) => {
        const pReal = lonToXY(realLon!, asc, R_INNER - 4, cx, cy);
        const pDisp = lonToXY(displayLon!, asc, R_PLANET, cx, cy);
        return (
          <line key={planet.key + "_line"}
            x1={f(pReal.x)} y1={f(pReal.y)} x2={f(pDisp.x)} y2={f(pDisp.y)}
            stroke={planet.color} strokeWidth="0.35" opacity="0.4" />
        );
      })}

      {spreadPlanets.map(({ planet, displayLon }) => {
        const p = lonToXY(displayLon!, asc, R_PLANET, cx, cy);
        return (
          <g key={planet.key}>
            <circle cx={f(p.x)} cy={f(p.y)} r="9.5" fill="rgba(5,7,18,0.88)" stroke={planet.color} strokeWidth="0.8" />
            <text x={f(p.x)} y={f(p.y)} textAnchor="middle" dominantBaseline="middle"
              fontSize="11" fill={planet.color} fontFamily="Georgia, serif">{planet.sym}</text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r="10" fill="#050710" stroke="rgba(212,175,55,0.5)" strokeWidth="0.8" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="rgba(212,175,55,0.6)">✦</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════
// PLANET TABLE
// ═══════════════════════════════════════════════
interface FullPos { planet: typeof PLANETS[number]; lon: number; sign: ReturnType<typeof signOf>; house: number; }

function PlanetTable({ positions, asc, mc }: { positions: FullPos[]; asc: number; mc: number }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", fontFamily: "Georgia, serif" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.3)" }}>
            {["Astre", "Signe", "Degré", "Maison", "Élément", "Modalité"].map(h => (
              <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "#8a7040", fontSize: "9px", letterSpacing: "2px", fontWeight: "normal", fontFamily: "Georgia, serif" }}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {positions.map(({ planet, sign, house }) => (
            <tr key={planet.key} style={{ borderBottom: "1px solid rgba(180,150,80,0.08)" }} className="planet-row">
              <td style={{ padding: "9px 10px" }}>
                <span style={{ fontSize: "16px", marginRight: "8px", color: planet.color }}>{planet.sym}</span>
                <span style={{ color: "#c0b07a", fontSize: "12px" }}>{planet.name}</span>
              </td>
              <td style={{ padding: "9px 10px", color: "#d4c090" }}>{sign.sym} {sign.name}</td>
              <td style={{ padding: "9px 10px", color: "#8a7a50", fontSize: "11px" }}>{degStr(sign.deg)}</td>
              <td style={{ padding: "9px 10px" }}>
                <span style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)", padding: "2px 6px", fontSize: "11px", color: "#d4af37" }}>M{house}</span>
              </td>
              <td style={{ padding: "9px 10px", color: EL_TEXT[sign.el], fontSize: "11px" }}>{sign.el}</td>
              <td style={{ padding: "9px 10px", color: "#7a6a40", fontSize: "11px" }}>{sign.mod}</td>
            </tr>
          ))}
          <tr style={{ borderTop: "1px solid rgba(212,175,55,0.15)", borderBottom: "1px solid rgba(180,150,80,0.08)" }}>
            <td style={{ padding: "9px 10px" }}>
              <span style={{ fontSize: "16px", marginRight: "8px", color: "#D4AF37" }}>↑</span>
              <span style={{ color: "#c0b07a", fontSize: "12px" }}>Ascendant</span>
            </td>
            <td style={{ padding: "9px 10px", color: "#d4c090" }}>{signOf(asc).sym} {signOf(asc).name}</td>
            <td style={{ padding: "9px 10px", color: "#8a7a50", fontSize: "11px" }}>{degStr(signOf(asc).deg)}</td>
            <td style={{ padding: "9px 10px" }}><span style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)", padding: "2px 6px", fontSize: "11px", color: "#d4af37" }}>M1</span></td>
            <td style={{ padding: "9px 10px", color: EL_TEXT[signOf(asc).el], fontSize: "11px" }}>{signOf(asc).el}</td>
            <td style={{ padding: "9px 10px", color: "#7a6a40", fontSize: "11px" }}>{signOf(asc).mod}</td>
          </tr>
          <tr style={{ borderBottom: "1px solid rgba(180,150,80,0.08)" }}>
            <td style={{ padding: "9px 10px" }}>
              <span style={{ fontSize: "16px", marginRight: "8px", color: "#D4AF37" }}>△</span>
              <span style={{ color: "#c0b07a", fontSize: "12px" }}>Milieu du Ciel</span>
            </td>
            <td style={{ padding: "9px 10px", color: "#d4c090" }}>{signOf(mc).sym} {signOf(mc).name}</td>
            <td style={{ padding: "9px 10px", color: "#8a7a50", fontSize: "11px" }}>{degStr(signOf(mc).deg)}</td>
            <td style={{ padding: "9px 10px" }}><span style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)", padding: "2px 6px", fontSize: "11px", color: "#d4af37" }}>M10</span></td>
            <td style={{ padding: "9px 10px", color: EL_TEXT[signOf(mc).el], fontSize: "11px" }}>{signOf(mc).el}</td>
            <td style={{ padding: "9px 10px", color: "#7a6a40", fontSize: "11px" }}>{signOf(mc).mod}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════
// HOUSE 8 CONTENT
// ═══════════════════════════════════════════════
function House8({ positions }: { positions: FullPos[] }) {
  const h8 = positions.filter(p => p.house === 8);

  const sections = [
    {
      icon: "⬛",
      title: "Ce qu'est la Maison 8",
      content: [
        "La Maison 8 est la plus abyssale du zodiaque. Elle gouverne les eaux souterraines de l'existence — là où les choses se transforment, meurent, et renaissent. C'est la maison de Pluton et du Scorpion : la mort symbolique, la fusion totale, le sexe sacré, les héritages, les tabous, et tout ce qui se passe dans l'obscurité.",
        "Elle est souvent mal comprise parce qu'elle touche à ce que la société refuse de regarder en face : la finitude, la dépendance, l'abandon de soi dans l'autre. C'est pourtant l'une des maisons les plus puissantes — celle des grandes transformations et des renaissances profondes.",
      ]
    },
    {
      icon: "🌙",
      title: "La Lune en Scorpion — Une âme de Maison 8",
      content: [
        "Ta Lune en Scorpion te place naturellement en résonance directe avec les thèmes de la Maison 8, même si aucune planète n'y réside physiquement. Le Scorpion est le signe de la 8e maison par excellence — et y avoir ta Lune natale signifie que ton monde émotionnel entier est structuré selon les lois de cet espace.",
        "Tu ressens les choses avec une profondeur que les autres ne soupçonnent pas. Ce que tu laisses paraître en surface n'est que la partie émergée d'un iceberg émotionnel. Tu traverses des cycles intérieurs invisibles — des phases de contraction intense suivies de renaissances silencieuses.",
        "Ta mémoire émotionnelle est totale et presque physiologique. Une trahison, une perte, une humiliation — ton corps s'en souvient des années après que ta tête ait « pardonné ». Et inversement, une connexion profonde laisse en toi des traces indélébiles que rien n'efface.",
      ]
    },
    {
      icon: "🔥",
      title: "Transformation — Le cœur de ta Maison 8",
      content: [
        "Tu n'évolues pas progressivement. Tu n'accumules pas de petits changements progressifs vers une version améliorée de toi-même. Tu passes par des ruptures nettes, des morts symboliques, des avant/après clairement délimités dans ta vie. Quelque chose se brise — une relation, une croyance, une identité — et de ces ruines quelque chose de plus fort émerge.",
        "C'est souvent douloureux. Les autres peuvent avoir du mal à te suivre dans ces cycles : tu disparais, tu te refermes, tu traverses quelque chose d'intensément privé, puis tu ressurgis différent. Cette capacité à mourir et à renaître est ta plus grande force vitale — même si elle te coûte cher.",
        "Ta résistance au changement imposé de l'extérieur (typique des configurations fixes Lion/Scorpion/Verseau) ne contredit pas cette transformation : tu changes en profondeur, mais uniquement selon tes propres rythmes intérieurs. Jamais sous pression extérieure. Jamais selon le calendrier des autres.",
      ]
    },
    {
      icon: "🔗",
      title: "L'Union et la Vulnérabilité",
      content: [
        "La Maison 8 pose toujours la même question fondamentale : est-ce que je laisse l'autre entrer vraiment ? Pour toi, avec une Lune en Scorpion, la fusion totale — émotionnelle, physique, psychique — est à la fois l'aspiration la plus profonde et la terreur la plus viscérale.",
        "Tu as un besoin vital de connaissance totale de l'autre. Pas seulement la surface : les dessous, les zones d'ombre, les parties que l'autre cache. Et en retour, tu protèges jalousement ce que tu ressens à l'intérieur. Paradoxe scorpionne classique : tu veux tout savoir et donner tout, mais tu te dévoiles à compte-gouttes, progressivement, en testant la fiabilité de l'autre.",
        "Le risque : la possessivité, la jalousie comme forme de contrôle, et le repli total quand tu te sens menacé. La clé : apprendre à distinguer la vulnérabilité choisie (qui donne de la puissance) de la vulnérabilité subie (qui génère de la peur).",
      ]
    },
    {
      icon: "⚡",
      title: "Sexualité, Pouvoir et Argent Partagé",
      content: [
        "La sexualité dans la Maison 8 n'est pas un acte anodin. Pour toi, c'est un acte de révélation, de fusion des identités, qui n'a de sens que dans la profondeur. Le sexe sans connexion émotionnelle te laisse vide, voire perturbé. Tu cherches une forme de dissolution dans l'autre — et c'est précisément ce qui te terrifie aussi.",
        "La Maison 8 gouverne également les ressources partagées — argent commun dans un couple, héritages, investissements à deux, dettes. Tu peux avoir un rapport complexe à la dépendance matérielle envers les autres : besoin de contrôle absolu sur ta propre sécurité financière, ou au contraire, capacité à construire quelque chose de solide avec quelqu'un en qui tu as totalement confiance.",
        "Le pouvoir est un thème central. Tu le perçois instinctivement dans chaque relation : qui détient le pouvoir, comment il s'exerce, comment il circule. Tu peux être magnétiquement attirant pour les autres précisément parce que tu ne cherches pas le pouvoir superficiel.",
      ]
    },
    {
      icon: "🌑",
      title: "Le Mystère, l'Ésotérisme et la Mort",
      content: [
        "Tu as une attirance naturelle pour ce qui se passe « de l'autre côté » du voile du réel. Non par morbidité, mais parce que tu cherches la vérité là où elle se cache vraiment : en psychologie des profondeurs, en symbolisme, dans la mort comme concept philosophique, dans les dimensions invisibles de l'existence.",
        "Pluton en Sagittaire (ta génération) amplifie cette quête : vous êtes nés pour déstabiliser les grandes certitudes — religieuses, idéologiques, institutionnelles — et chercher un sens plus authentique au-delà des dogmes établis. Pour toi personnellement, cette quête est aussi intérieure : une archéologie de soi-même, un désir de comprendre tes propres abysses.",
        "Tu pourrais être naturellement doué pour la psychologie, l'analyse des motivations cachées, l'investigation, la recherche — tout ce qui implique de creuser sous la surface pour trouver la vérité que les autres ne voient pas.",
      ]
    },
    {
      icon: "✦",
      title: "Ce que la Maison 8 te dit en résumé",
      content: [
        "Ta vie sera marquée par de grandes transformations — des « morts » et des « renaissances » qui t'amèneront à une version de toi-même de plus en plus distillée, authentique, et profondément puissante. Ce n'est pas un chemin facile. Mais c'est le tien.",
        "Avec un Soleil en Lion qui veut briller au grand jour, une Lune en Scorpion qui habite les profondeurs, et un Ascendant Verseau qui regarde tout cela avec un certain détachement — tu es structurellement fait pour naviguer entre la lumière et l'ombre, entre l'exposition et le secret, entre la puissance affichée et la vulnérabilité cachée.",
        "La clé de ta Maison 8 : apprendre à lâcher sans te perdre, à t'unir sans te fondre, et à traverser l'obscurité en sachant que chaque descente est le début d'une montée.",
      ]
    },
  ];

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto", fontFamily: "Georgia, serif" }}>
      <div style={{ borderLeft: "2px solid #D4AF37", paddingLeft: "16px", marginBottom: "28px" }}>
        <h2 style={{ fontSize: "11px", letterSpacing: "4px", color: "#8a7040", fontWeight: "normal", margin: "0 0 6px 0" }}>INTERPRÉTATION APPROFONDIE</h2>
        <h1 style={{ fontSize: "20px", color: "#D4AF37", margin: 0, letterSpacing: "1px" }}>Maison VIII — L'Abîme & la Renaissance</h1>
        <p style={{ margin: "8px 0 0 0", color: "#7a6a40", fontSize: "11px", letterSpacing: "1px" }}>Scorpion · Pluton · Eau Fixe</p>
      </div>

      {h8.length > 0 && (
        <div style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.2)", padding: "12px 16px", marginBottom: "24px" }}>
          <span style={{ fontSize: "10px", letterSpacing: "2px", color: "#8a7040" }}>PLANÈTES EN MAISON 8 · </span>
          {h8.map((p, i) => (
            <span key={p.planet.key} style={{ color: p.planet.color }}>
              {p.planet.sym} {p.planet.name} en {p.sign.name}{i < h8.length - 1 ? " · " : ""}
            </span>
          ))}
        </div>
      )}

      {sections.map(({ icon, title, content }) => (
        <div key={title} style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "13px", color: "#D4AF37", letterSpacing: "0.5px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "15px" }}>{icon}</span>
            {title}
          </h3>
          {content.map((para, i) => (
            <p key={i} style={{ color: "#c0ad80", lineHeight: "1.85", fontSize: "13.5px", marginBottom: "10px" }}>
              {para}
            </p>
          ))}
          <div style={{ height: "1px", background: "rgba(180,150,80,0.08)", margin: "16px 0 0 0" }} />
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// ALL 12 HOUSES
// ═══════════════════════════════════════════════
const HOUSE_DATA = [
  {
    num: 1, name: "Identité & Apparence", ruler: "⛢ Uranus",
    icon: "◉",
    paras: [
      "Ta Maison 1 en Verseau donne à ton apparence quelque chose d'indéfinissable — un mélange de détachement et d'originalité qui désoriente les gens au premier abord. Tu ne rentres pas dans les cases. Les gens ne savent pas trop quoi faire de toi, et c'est exactement là où tu te sens à l'aise.",
      "Configuration exceptionnelle : Uranus, le maître de ton Ascendant, est lui aussi en Verseau et très proche de ton Ascendant. Une conjonction Uranus-ASC indique une vie hors des rails normaux — une identité qui évolue par ruptures brusques, qui refuse la fossilisation, et qui bouscule involontairement les systèmes autour d'elle.",
      "Ce que tu montres en premier aux autres — ce masque social Verseau — est rationnel, légèrement détaché, parfois froid. Mais c'est un masque sur une intensité (Lune Scorpion) et un besoin de reconnaissance (Soleil Lion) que tu révèles seulement à ceux qui méritent de te voir vraiment.",
    ]
  },
  {
    num: 2, name: "Argent & Valeurs Profondes", ruler: "♆ Neptune",
    icon: "◈",
    paras: [
      "La Maison 2 en Poissons donne un rapport à l'argent et aux possessions profondément non-matérialiste. Ce n'est pas que l'argent ne compte pas — c'est que ta valeur profonde ne se mesure pas en termes financiers. Tu sais instinctivement que ce qui compte vraiment dans une vie ne se compte pas.",
      "Neptune comme maître de cette maison renforce cette dimension : les frontières entre « à moi » et « à nous » peuvent être floues, et tu peux traverser des phases où l'argent arrive ou disparaît de façon mystérieuse, presque indépendamment de ta volonté. La rigueur financière est quelque chose que tu dois construire activement.",
      "Tes vraies valeurs sont intangibles : la liberté, la profondeur des connexions, l'authenticité, la quête de sens. Ce pour quoi tu te battrais vraiment n'a pas de prix sur le marché.",
    ]
  },
  {
    num: 3, name: "Communication & Pensée", ruler: "♂ Mars",
    icon: "◇",
    paras: [
      "La Maison 3 en Bélier colore ta façon de penser et de communiquer d'une franchise directe, parfois tranchante. Ton esprit va droit au but, impatient avec les détours et les sous-entendus. Quand tu penses quelque chose, tu le dis — et tu attends la même franchise en retour.",
      "Mars comme maître donne un esprit combatif au sens stimulant : tu aimes débattre, challenger les idées, pousser les concepts jusqu'à leurs limites. Ce n'est pas de l'agressivité — c'est une façon de tester la solidité des choses et des gens. Un argument qui ne résiste pas à ton questionnement ne mérite pas d'être défendu.",
      "Dans l'enfance, tu as probablement appris très tôt à défendre ta propre vision des choses — face à des frères et sœurs, des camarades, ou simplement face à un environnement qui ne pensait pas comme toi. Cette indépendance de pensée est une force centrale de ton identité.",
    ]
  },
  {
    num: 4, name: "Foyer, Racines & Famille", ruler: "♀ Vénus",
    icon: "◎",
    paras: [
      "La Maison 4 en Taureau parle d'un besoin profond de stabilité dans le domaine des racines. Tu as besoin d'un espace physique qui soit vraiment à toi — beau, confortable, sécurisé. L'endroit où tu vis a une importance émotionnelle réelle, pas anecdotique. Un environnement chaotique te vide.",
      "Saturne est très probablement dans cette maison — ce qui indique une enfance structurée par une figure d'autorité sérieuse (souvent le père), des attentes élevées, et un rapport à la sécurité construit dans une certaine rigueur. Jupiter ici aussi indique une dimension généreuse et philosophique dans les origines familiales.",
      "La tension productive de ton thème : l'Ascendant Verseau cherche la liberté et le changement, mais ta Maison 4 Taureau a besoin de racines profondes et de permanence. Tu es quelqu'un qui a besoin d'un ancrage solide pour pouvoir s'envoler — pas malgré lui, mais grâce à lui.",
    ]
  },
  {
    num: 5, name: "Créativité, Amour & Plaisir", ruler: "☿ Mercure",
    icon: "✦",
    paras: [
      "La Maison 5 en Gémeaux colore ta créativité et ta façon d'aimer d'une légèreté intellectuelle qui contraste avec l'intensité profonde du reste de ton thème. Dans le jeu, dans la création, dans les débuts amoureux — tu sais être léger, curieux, drôle. C'est une soupape vitale.",
      "En amour, tu es attiré par les esprits vifs, les conversations qui n'en finissent pas, les gens avec qui tu ne t'ennuies jamais. L'ennui est ta terreur romantique principale. Un partenaire brillant et stimulant intellectuellement est non-négociable — mais attention : c'est en Maison 7 (Lion) que se joue vraiment la profondeur de tes partenariats.",
      "Ta créativité est polymorphe et intellectuelle. Tu peux t'intéresser à mille choses simultanément — le risque Gémeaux étant la dispersion. Vénus possiblement présente ici apporte du goût, du sens du beau, une dimension artistique à cette Maison 5 déjà fertile.",
    ]
  },
  {
    num: 6, name: "Travail, Santé & Quotidien", ruler: "☽ Lune",
    icon: "⊕",
    paras: [
      "La Maison 6 en Cancer parle d'un rapport au travail quotidien profondément émotionnel. Tu as besoin de te sentir en confiance dans ton environnement professionnel — un cadre humain, chaleureux, où les relations comptent vraiment. Un contexte froid, compétitif ou sans âme te vide rapidement.",
      "La santé en Cancer révèle une connexion forte entre ton état émotionnel et ton corps. Les périodes de stress se manifestent souvent physiquement — fatigue subite, troubles digestifs, résistance immunitaire qui baisse. Prendre soin de ton corps passe inévitablement par prendre soin de ce que tu ressens.",
      "Mars pourrait être dans cette zone, ce qui donnerait une énergie de travail intense mais par vagues — des périodes de productivité explosive suivies de phases de récupération nécessaires. Tu travailles mieux par passion que par obligation, et ton implication émotionnelle dans ce que tu fais est totale ou presque nulle.",
    ]
  },
  {
    num: 7, name: "Partenariats & Relations Clés", ruler: "☉ Soleil",
    icon: "⊗",
    paras: [
      "La Maison 7 en Lion est l'une des positions les plus remarquables de ton thème : ton Soleil natal est très probablement dans cette maison. Cela signifie que tes partenariats — amoureux surtout, mais aussi professionnels — sont une zone clé de ton expression vitale. L'autre devient un miroir de ta propre identité.",
      "Tu es attiré par des partenaires qui ont de la présence, du charisme, une vraie lumière intérieure. Quelqu'un de terne ne te stimule pas. Mais le revers de cette configuration : tu peux chercher dans l'autre une validation que tu n'arrives pas à te donner à toi-même, ou entrer en compétition avec un partenaire fort au lieu de construire avec lui.",
      "Mercure ici aussi indique un partenaire avec qui la communication est centrale — quelqu'un avec qui tu parles, débats, réfléchis. Avec le Soleil en Maison 7, tes grandes rencontres ont un effet structurant sur qui tu deviens. Elles ne sont pas des accessoires de ta vie — elles en sont des révélateurs.",
    ]
  },
  {
    num: 8, name: "Transformation & Abîme", ruler: "☿ Mercure",
    icon: "⬛",
    paras: [
      "La Maison 8 en Vierge apporte une dimension analytique à tes transformations profondes. Mercure comme maître indique que tu traverses tes morts symboliques avec une part de toi qui observe, décortique, cherche à comprendre. Tu ne te contentes pas de traverser — tu analyses ce qui se passe en toi.",
      "C'est la maison la plus développée de ce document. Elle gouverne ta relation à la perte, à la fusion, à la sexualité comme acte sacré, aux héritages, au mystère. Avec la Lune en Scorpion en résonance directe, c'est la zone la plus chargée énergétiquement de tout ton thème.",
      "Ta vie sera marquée par des renaissances profondes — des avant/après clairement délimités. Ce qui sort de chaque traversée est une version plus distillée, plus authentique, plus puissante de toi-même.",
    ]
  },
  {
    num: 9, name: "Philosophie, Voyage & Sens", ruler: "♀ Vénus",
    icon: "◐",
    paras: [
      "La Maison 9 en Balance parle d'une quête de sens centrée sur l'équilibre, la justice, et la beauté comme principe. Ta philosophie de vie cherche à réconcilier les contraires plutôt qu'à les trancher. Tu peux voir plusieurs côtés d'une même question avec une aisance qui parfois t'empêche de te positionner clairement.",
      "Ta Lune est peut-être dans cette zone — ce qui ferait du voyage, de la philosophie et de l'élargissement du regard une dimension viscéralement émotionnelle de ta vie. Tu te sens plus toi-même quand tu es en mouvement, quand tu découvres, quand ton horizon s'élargit. L'immobilité intellectuelle est une forme d'étouffement.",
      "Le risque Balance en Maison 9 : rester éternellement dans l'entre-deux des croyances, voir tous les points de vue au point de ne plus savoir où tu en es toi-même. Ta quête de sens est sincère — mais elle demande à un moment de choisir, pas seulement de peser.",
    ]
  },
  {
    num: 10, name: "Vocation & Image Publique", ruler: "♇ Pluton",
    icon: "△",
    paras: [
      "La Maison 10 en Scorpion donne une image publique intense, magnétique, et potentiellement polarisante. Les gens qui te croisent dans un contexte professionnel ne restent pas indifférents — tu crées une impression forte, difficile à ignorer, parfois difficile à cerner. On te perçoit comme quelqu'un qui sait des choses que les autres ne savent pas.",
      "Ta vocation est liée à la transformation — des idées, des situations, des personnes. Tu fais bien les choses qui demandent d'aller là où les autres n'osent pas : la psychologie des profondeurs, l'investigation, la recherche, les domaines qui impliquent de soulever des couvercles. La Lune ici (si elle s'y trouve) ajoute une dimension émotionnelle intense à ton image publique.",
      "Pluton comme maître indique que ta carrière connaîtra probablement plusieurs morts et renaissances professionnelles — des ruptures radicales qui redéfinissent complètement ta trajectoire. Ce n'est pas un chemin linéaire. C'est une ascension par cycles de destruction et de reconstruction.",
    ]
  },
  {
    num: 11, name: "Amitiés, Groupes & Projets", ruler: "♃ Jupiter",
    icon: "⊙",
    paras: [
      "La Maison 11 en Sagittaire parle d'amitiés diverses, élargies, souvent internationales ou philosophiques — des gens qui viennent d'horizons très différents du tien et qui t'élargissent. Tu n'accumules pas les relations sociales : tu as peu d'amis proches, mais ils sont choisis avec une exigence réelle.",
      "Pluton dans cette maison (probable) est une configuration intense : tes amitiés ne sont pas anodines. Elles traversent des crises, des trahisons, des loyautés absolues. Une amitié profonde avec toi c'est pour la vie — jusqu'à ce que la confiance soit brisée, auquel cas le rideau tombe définitivement.",
      "Tes projets collectifs ont naturellement une dimension transformatrice. Tu n'es pas fait pour les groupes qui maintiennent le statu quo — tu gravites vers ceux qui cherchent à changer quelque chose en profondeur, à challenger les systèmes établis, à construire quelque chose de radicalement différent.",
    ]
  },
  {
    num: 12, name: "L'Invisible & la Vie Intérieure", ruler: "♄ Saturne",
    icon: "◑",
    paras: [
      "La Maison 12 en Capricorne parle d'une dimension intérieure sérieuse, structurée, presque austère. Ce que tu construis dans la solitude et le silence est quelque chose de très solide — pas de la rêverie, mais une architecture intérieure réelle. Saturne comme maître indique que tes plus grandes ressources cachées viennent de ta capacité à tenir face aux contraintes.",
      "Neptune dans cette maison (probable) dissout légèrement cette rigueur capricornienne : une part de toi est aussi très poreuse à l'invisible, aux intuitions, aux rêves. Tu peux avoir une vie spirituelle ou créative très riche que tu n'exposes pratiquement pas — quelque chose qui appartient uniquement à toi.",
      "La Maison 12 est aussi le lieu de ce que tu n'as pas encore conscientisé. Avec Capricorne ici, tes zones d'ombre sont liées à la rigidité, au contrôle, à la difficulté de lâcher des structures qui ne te servent plus. L'intégration de cette maison passe par accepter que la dissolution de certaines constructions intérieures n'est pas un échec — c'est une libération.",
    ]
  },
];

function HousesAll({ positions, asc }: { positions: FullPos[]; asc: number }) {
  const [activeHouse, setActiveHouse] = useState<number | null>(null);

  const houseOccupants: Record<number, FullPos[]> = {};
  for (let i = 1; i <= 12; i++) houseOccupants[i] = [];
  positions.forEach(p => {
    if (p.house >= 1 && p.house <= 12) houseOccupants[p.house].push(p);
  });

  const houseSign = (num: number) => signOf(norm(asc + (num - 1) * 30));

  return (
    <div style={{ maxWidth: "660px", margin: "0 auto", fontFamily: "Georgia, serif" }}>
      <div style={{ borderLeft: "2px solid #D4AF37", paddingLeft: "16px", marginBottom: "28px" }}>
        <h2 style={{ fontSize: "11px", letterSpacing: "4px", color: "#8a7040", fontWeight: "normal", margin: "0 0 6px 0" }}>SYSTÈME DE MAISONS ÉGALES</h2>
        <h1 style={{ fontSize: "20px", color: "#D4AF37", margin: 0, letterSpacing: "1px" }}>Les Douze Maisons</h1>
        <p style={{ margin: "8px 0 0 0", color: "#7a6a40", fontSize: "11px" }}>Cliquer sur une maison pour lire son interprétation</p>
      </div>

      {HOUSE_DATA.map(h => {
        const sign = houseSign(h.num);
        const occupants = houseOccupants[h.num] || [];
        const isOpen = activeHouse === h.num;
        const isH8 = h.num === 8;

        return (
          <div key={h.num} style={{ marginBottom: "6px", border: `1px solid ${isOpen ? "rgba(212,175,55,0.35)" : "rgba(180,150,80,0.1)"}`, transition: "border-color 0.2s" }}>
            <button
              onClick={() => setActiveHouse(isOpen ? null : h.num)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", background: isOpen ? "rgba(212,175,55,0.05)" : "transparent", border: "none", cursor: "pointer", padding: "13px 16px", textAlign: "left", transition: "background 0.2s" }}>
              <div style={{ width: "28px", height: "28px", border: `1px solid ${isH8 ? "#D4AF37" : "rgba(180,150,80,0.35)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: "10px", color: isH8 ? "#D4AF37" : "#8a7040", fontFamily: "Georgia, serif" }}>{h.num}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", color: isOpen ? "#D4AF37" : "#c0a060", letterSpacing: "0.5px" }}>{h.name}</div>
                <div style={{ fontSize: "10px", color: "#5a4a20", marginTop: "2px" }}>
                  {sign.sym} {sign.name} · {h.ruler}
                </div>
              </div>
              <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                {occupants.map(p => (
                  <span key={p.planet.key} style={{ fontSize: "14px", color: p.planet.color }}>{p.planet.sym}</span>
                ))}
              </div>
              <span style={{ color: "#5a4a20", fontSize: "10px", flexShrink: 0, transition: "transform 0.2s", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "none" }}>▼</span>
            </button>

            {isOpen && (
              <div style={{ padding: "4px 16px 20px 16px", borderTop: "1px solid rgba(180,150,80,0.1)" }}>
                {occupants.length > 0 && (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "14px 0 16px 0" }}>
                    {occupants.map(p => (
                      <span key={p.planet.key} style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)", padding: "3px 10px", fontSize: "11px" }}>
                        <span style={{ color: p.planet.color }}>{p.planet.sym} {p.planet.name}</span>
                        <span style={{ color: "#5a4a20" }}> · {p.sign.name} {degStr(p.sign.deg)}</span>
                      </span>
                    ))}
                  </div>
                )}
                {h.paras.map((para, i) => (
                  <p key={i} style={{ color: "#c0ad80", lineHeight: "1.85", fontSize: "13.5px", marginBottom: "10px", marginTop: i === 0 && occupants.length === 0 ? "14px" : 0 }}>
                    {para}
                  </p>
                ))}
                {isH8 && (
                  <p style={{ fontSize: "11px", color: "#8a7040", fontStyle: "italic", marginTop: "4px" }}>
                    → Voir l&#39;onglet &quot;MAISON VIII&quot; pour l&#39;interprétation complète en 7 sections.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════
export default function ThomasPage() {
  const [tab, setTab] = useState("wheel");

  // 7 août 2000 · 20h42 CEST = 18h42 UT · Avignon 43°56'N 4°48'E
  const JD = julianDay(2000, 8, 7, 18.7);
  const LAT = 43.9333, LON = 4.8;
  const { asc, mc } = calcAscMC(JD, LAT, LON);

  const rawLons: Record<string, number> = {
    sun:     sunLon(JD),
    moon:    moonLon(JD),
    mercury: planetLon(JD, "mercury"),
    venus:   planetLon(JD, "venus"),
    mars:    planetLon(JD, "mars"),
    jupiter: planetLon(JD, "jupiter"),
    saturn:  planetLon(JD, "saturn"),
    uranus:  planetLon(JD, "uranus"),
    neptune: planetLon(JD, "neptune"),
    pluto:   planetLon(JD, "pluto"),
  };

  const positions: FullPos[] = PLANETS.map(p => ({
    planet: p,
    lon: rawLons[p.key],
    sign: signOf(rawLons[p.key]),
    house: Math.floor(norm(rawLons[p.key] - asc) / 30) + 1,
  }));

  const sunSign  = signOf(rawLons.sun);
  const moonSign = signOf(rawLons.moon);
  const ascSign  = signOf(asc);
  const mcSign   = signOf(mc);

  const TABS = [
    { key: "wheel",   label: "THÈME NATAL" },
    { key: "planets", label: "PLANÈTES" },
    { key: "houses",  label: "12 MAISONS" },
    { key: "house8",  label: "MAISON VIII" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, overflowY: "auto", background: "#06070f" }}>
      <div style={{ background: "#06070f", minHeight: "100%", color: "#d4af37", fontFamily: "Georgia, serif" }}>
        <style>{`
          body { margin: 0; }
          .planet-row:hover { background: rgba(212,175,55,0.03); }
          .tab-btn:hover { background: rgba(212,175,55,0.06); }
        `}</style>

        <div style={{ textAlign: "center", padding: "28px 20px 20px", borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
          <div style={{ fontSize: "9px", letterSpacing: "5px", color: "#5a4a20", marginBottom: "8px" }}>CARTA NATALIS</div>
          <h1 style={{ margin: 0, fontSize: "22px", letterSpacing: "3px", fontWeight: "normal" }}>✦ CARTE NATALE ✦</h1>
          <p style={{ margin: "8px 0 0 0", color: "#7a6a40", fontSize: "11px", letterSpacing: "2px" }}>
            7 AOÛT 2000 · 20h42 CEST · AVIGNON · JD {JD.toFixed(2)}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
          {[
            { label: "SOLEIL",    icon: "☉", value: sunSign.name,  deg: degStr(sunSign.deg),  color: "#FFD700" },
            { label: "LUNE",      icon: "☽", value: moonSign.name, deg: degStr(moonSign.deg), color: "#E0E0E0" },
            { label: "ASCENDANT", icon: "↑", value: ascSign.name,  deg: degStr(ascSign.deg),  color: "#D4AF37" },
            { label: "M.DU CIEL", icon: "△", value: mcSign.name,   deg: degStr(mcSign.deg),   color: "#D4AF37" },
          ].map(({ label, icon, value, deg, color }) => (
            <div key={label} style={{ padding: "14px 8px", textAlign: "center", borderRight: "1px solid rgba(212,175,55,0.08)" }}>
              <div style={{ fontSize: "9px", letterSpacing: "1.5px", color: "#5a4a20", marginBottom: "4px" }}>{label}</div>
              <div style={{ fontSize: "20px", color, lineHeight: "1" }}>{icon}</div>
              <div style={{ fontSize: "12px", color: "#d4c090", marginTop: "4px" }}>{value}</div>
              <div style={{ fontSize: "9px", color: "#5a4a20", marginTop: "2px" }}>{deg}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
          {TABS.map(t => (
            <button key={t.key} className="tab-btn"
              onClick={() => setTab(t.key)}
              style={{ flex: 1, padding: "12px 8px", border: "none", cursor: "pointer", fontFamily: "Georgia, serif", background: tab === t.key ? "rgba(212,175,55,0.07)" : "transparent", color: tab === t.key ? "#D4AF37" : "#5a4a20", fontSize: "9px", letterSpacing: "2px", borderBottom: tab === t.key ? "1px solid #D4AF37" : "1px solid transparent", transition: "all 0.2s" }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "24px 16px 40px" }}>
          {tab === "wheel" && (
            <div>
              <ChartWheel planets={positions.map(p => ({ planet: p.planet, lon: p.lon }))} asc={asc} mc={mc} />
              <div style={{ marginTop: "20px", background: "rgba(212,175,55,0.03)", border: "1px solid rgba(212,175,55,0.1)", padding: "14px", fontSize: "11px", color: "#7a6a40", lineHeight: "1.7" }}>
                <strong style={{ color: "#8a7040" }}>Système de maisons :</strong> Maisons égales (30° par maison depuis l&#39;Ascendant) ·
                <strong style={{ color: "#8a7040" }}> Lieu :</strong> Avignon 43°56&#39;N 4°48&#39;E ·
                <strong style={{ color: "#8a7040" }}> Heure UT :</strong> 18h42 (CEST −2h) ·
                <strong style={{ color: "#8a7040" }}> Algorithmes :</strong> Jean Meeus, Astronomical Algorithms
              </div>
            </div>
          )}
          {tab === "planets" && <PlanetTable positions={positions} asc={asc} mc={mc} />}
          {tab === "houses"  && <HousesAll positions={positions} asc={asc} />}
          {tab === "house8"  && <House8 positions={positions} />}
        </div>
      </div>
    </div>
  );
}
