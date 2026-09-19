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
// HOUSE 8 CONTENT — Poissons & Neptune
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
      icon: "🌊",
      title: "La Maison 8 en Poissons — L'Abîme sans bords",
      content: [
        "Ta Maison 8 en Poissons dissout les frontières. Là où d'autres ont une Maison 8 avec des contours nets — Scorpion, Capricorne, Bélier — la tienne est comme un océan sans rivage. Tu ne traverses pas les crises avec un plan. Tu t'y laisses porter, tu t'y dilues, et tu en ressors transformé d'une façon que tu ne peux pas toujours expliquer.",
        "Le Poissons en Maison 8 donne une perméabilité aux mondes invisibles qui est à la fois un don et une vulnérabilité. Tu sens les choses avant de les comprendre. Une atmosphère, une intention cachée, une souffrance que l'autre n'exprime pas — tu les perçois directement, sans filtre. Cette sensibilité est une antenne extraordinaire pour naviguer les profondeurs humaines.",
        "Neptune comme maître de cette maison amplifie tout cela : tu peux avoir des rêves intenses et révélateurs, des intuitions qui se confirment, une relation naturelle à ce que d'autres appellent l'invisible. Ce n'est pas de la superstition — c'est une façon d'être au monde qui accède à des couches de réalité que le rationnel seul ne peut pas saisir.",
      ]
    },
    {
      icon: "♆",
      title: "Neptune & la Transformation par la Dissolution",
      content: [
        "Avec Neptune comme maître de ta Maison 8, tes grandes transformations ne ressemblent pas à des ruptures nettes. Elles ressemblent à des fontes. Quelque chose de solide se liquéfie progressivement — une identité, une croyance, une façon de te définir — et tu traverses une période de fluidité, parfois déstabilisante, avant que quelque chose de nouveau se forme.",
        "Ces traversées peuvent être sublimes ou terrifiantes selon comment tu t'y rapportes. Si tu résistes, si tu cherches à garder le contrôle dans un espace qui ne le permet pas, tu souffres inutilement. Si tu apprends à faire confiance au processus de dissolution — à lâcher ce qui doit partir — tu découvres que de l'autre côté il y a quelque chose de plus grand, de plus vrai, de plus toi.",
        "Le risque Neptune en Maison 8 : la fuite dans des chimères pour éviter la profondeur réelle. L'alcool, les substances, l'illusion romantique, les spiritualités superficielles — autant de façons de toucher à la dissolution sans s'y plonger vraiment. La différence entre l'ivresse et le mysticisme, c'est la conscience. Tu peux avoir accès à l'un ou à l'autre.",
      ]
    },
    {
      icon: "🔮",
      title: "L'Intimité, la Fusion et le Sacré",
      content: [
        "Dans l'intimité, ta Maison 8 Poissons cherche quelque chose qui dépasse la rencontre ordinaire. Tu aspires à une fusion totale — pas juste émotionnelle ou physique, mais presque mystique. Une connexion avec l'autre qui touche à quelque chose d'universel. Quand tu trouves ce genre de lien, il est inoubliable. Quand tu ne le trouves pas, tu peux te sentir profondément seul même entouré.",
        "Ta sexualité est liée à l'âme. Un acte sexuel sans connexion profonde te laisse vide, voire triste. Tu cherches dans la rencontre intime une forme de transcendance — une sortie de toi-même vers quelque chose de plus grand. Cette quête est authentique et précieuse. Elle peut aussi te rendre vulnérable à l'idéalisation : projeter sur l'autre une profondeur qu'il n'a pas forcément.",
        "Apprendre à distinguer la vraie fusion (qui t'élève) de la fusion fusionnelle (qui t'efface) est l'un des travaux fondamentaux de ta Maison 8. Ton identité lion — présente et rayonnante — est ton ancre dans cet océan poissons. Sans elle, tu risques de te perdre dans l'autre. Avec elle, tu peux aller très loin dans la profondeur sans te noyer.",
      ]
    },
    {
      icon: "🌑",
      title: "Héritage, Mystère et Mondes Invisibles",
      content: [
        "La Maison 8 Poissons gouverne un rapport à l'héritage familial profondément inconscient. Ce que tu portes du passé n'est pas toujours visible ni nommable — des loyautés souterraines, des émotions transmises sans mots, des schémas qui répètent des histoires bien antérieures à ta naissance. La psychologie familiale est pour toi un territoire à explorer avec honnêteté.",
        "Tu peux avoir une relation naturelle à ce qui dépasse le monde ordinaire : les rêves comme source d'information, la méditation, les pratiques qui permettent d'accéder à des états de conscience élargis. Pluton en Sagittaire (ta génération) amplifie cette quête : vous êtes nés pour questionner les grandes certitudes et trouver un sens plus authentique au-delà des dogmes. Pour toi, cette quête est aussi une plongée intérieure.",
        "Ton intuition sur ce qui se passe dans l'invisible des relations — les choses que les gens pensent sans dire, les dynamiques souterraines d'un groupe, la vérité émotionnelle d'une situation — est une ressource réelle. Fais-lui confiance, même quand tu ne peux pas l'expliquer.",
      ]
    },
    {
      icon: "⚡",
      title: "Uranus & Neptune en Verseau — La Génération de la Rupture Douce",
      content: [
        "Tu appartiens à une génération marquée par la conjonction Uranus-Neptune en Verseau (1996-2003). Ce n'est pas un hasard que cette génération arrive à l'âge adulte dans un monde où les certitudes s'effondrent et où les systèmes établis ne tiennent plus leurs promesses. Vous portez collectivement le thème de la dissolution (Neptune) des structures (Verseau) par la rupture (Uranus).",
        "Dans ton thème personnel, ces planètes occupent une zone sensible — probablement entre ta Maison 6 et ta Maison 7. Cela signifie que ces grandes forces générationnelles opèrent dans ta vie quotidienne (le travail, la santé, les habitudes) et dans tes partenariats proches. Tes relations importantes ont quelque chose d'inhabituel, parfois d'instable, qui défie les formes conventionnelles.",
        "Tes conditions de travail et de santé peuvent être non-conventionnelles, changeantes, difficiles à enfermer dans un cadre fixe. C'est inconfortable — mais c'est aussi ce qui te libère des structures qui étouffent. La liberté que tu cherches dans ces domaines n'est pas de l'irresponsabilité : c'est une façon authentique d'être toi-même.",
      ]
    },
    {
      icon: "✦",
      title: "Ce que la Maison 8 te dit en résumé",
      content: [
        "Ta Maison 8 est un espace océanique : sans fond visible, sans rivage net, capable de te porter vers des espaces de conscience que la plupart des gens n'explorent jamais. C'est une profondeur réelle — à la condition de ne pas confondre dissolution et évasion.",
        "Avec un Ascendant Lion qui rayonne et se manifeste, et une Maison 8 Poissons qui plonge et se dissout, tu es structurellement fait pour naviguer entre la surface et les profondeurs — entre le moi affirmé et le moi fondu dans quelque chose de plus grand. Ces deux pôles ne se contredisent pas : ils se complètent.",
        "La clé de ta Maison 8 : apprendre à lâcher ce qui doit disparaître, à traverser la dissolution sans te perdre, et à faire confiance au fait que de chaque fonte émerge quelque chose de plus pur et de plus vrai. Tu n'as pas besoin de contrôler cette transformation — tu as besoin de lui faire confiance.",
      ]
    },
  ];

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto", fontFamily: "Georgia, serif" }}>
      <div style={{ borderLeft: "2px solid #D4AF37", paddingLeft: "16px", marginBottom: "28px" }}>
        <h2 style={{ fontSize: "11px", letterSpacing: "4px", color: "#8a7040", fontWeight: "normal", margin: "0 0 6px 0" }}>INTERPRÉTATION APPROFONDIE</h2>
        <h1 style={{ fontSize: "20px", color: "#D4AF37", margin: 0, letterSpacing: "1px" }}>Maison VIII — L&#39;Océan & la Renaissance</h1>
        <p style={{ margin: "8px 0 0 0", color: "#7a6a40", fontSize: "11px", letterSpacing: "1px" }}>Poissons · Neptune · Eau Mutable</p>
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
// ALL 12 HOUSES — Lion ASC
// ═══════════════════════════════════════════════
const HOUSE_DATA = [
  {
    num: 1, name: "Identité & Apparence", ruler: "☉ Soleil",
    icon: "◉",
    paras: [
      "La Maison 1 en Lion donne à ta présence quelque chose d'immédiatement remarquable. Tu entres dans une pièce et les regards se posent — pas parce que tu le cherches nécessairement, mais parce que quelque chose dans ton port, ton assurance naturelle, ta façon d'occuper l'espace s'impose sans effort. Le Lion en Ascendant est une présence royale, même quand elle est discrète.",
      "Le Soleil comme maître de ton Ascendant est une configuration puissante : ton identité profonde (Soleil Scorpion) et ton masque social (Ascendant Lion) sont gouvernés par la même étoile. Il y a une cohérence centrale dans ton thème — une certaine clarté sur qui tu es, même si ce que tu montres à l'extérieur (la chaleur du Lion) est différent de ce que tu portes à l'intérieur (la profondeur du Scorpion).",
      "Le risque Lion en Maison 1 : une sensibilité au regard des autres qui peut parfois brider ton authenticité. Le Lion veut être admiré — et quand il ne l'est pas, il peut se replier ou surjouer. La force de cet Ascendant émerge quand tu n'as plus besoin de la validation extérieure pour te sentir légitime : quand tu rayonnes pour toi-même, pas pour le public.",
    ]
  },
  {
    num: 2, name: "Argent & Valeurs Profondes", ruler: "☿ Mercure",
    icon: "◈",
    paras: [
      "La Maison 2 en Vierge parle d'un rapport à l'argent et aux ressources rigoureusement pratique et analytique. Tu n'es pas dépensier par impulsion — tu gères, tu calcules, tu cherches l'efficacité. La Vierge en Maison 2 donne une capacité naturelle à faire beaucoup avec peu, et une attention aux détails financiers que peu de gens ont de façon aussi naturelle.",
      "Mercure comme maître donne un esprit agile dans tout ce qui touche aux échanges matériels. Tu peux être habile dans les négociations, les contrats, tout ce qui demande de la précision et de la rigueur. Tu évalues la valeur des choses avec un sens du concret très développé — tu vois vite si quelque chose vaut ce qu'on en demande.",
      "Ce que tu values vraiment n'est pas toujours ce que le monde valorise. Tu peux accorder plus d'importance à l'utilité, à la qualité, à la durabilité qu'au prestige. Ta vraie richesse est dans ta capacité à analyser et à discriminer — à choisir ce qui compte vraiment et à lâcher le reste.",
    ]
  },
  {
    num: 3, name: "Communication & Pensée", ruler: "♀ Vénus",
    icon: "◇",
    paras: [
      "La Maison 3 en Balance donne à ta communication une grâce naturelle et un sens de la diplomatie. Tu sais comment formuler les choses pour qu'elles passent bien — tu perçois instinctivement ce que l'autre a besoin d'entendre et comment le lui dire. Cette fluidité dans l'échange est un vrai talent, surtout combinée à l'intensité de ton Soleil Scorpion qui réside dans cette zone.",
      "Ton Soleil natal en Scorpion est très probablement dans cette Maison 3 — ce qui donne à ta pensée et à ta communication une profondeur et une intensité peu communes. Tu ne communiques pas pour la surface. Tu veux aller au fond des choses, poser les vraies questions, dire ce que d'autres n'osent pas nommer. Cette profondeur dans un cadre Balance crée quelque chose de redoutable : la capacité de dire des vérités difficiles avec une forme qui les rend recevables.",
      "Vénus comme maîtresse ajoute un sens du beau dans la façon dont tu structures tes idées. Tu aimes que les choses soient bien formulées, harmonieusement agencées. Tu peux être attiré par l'écriture, la rhétorique, tout ce qui demande à la fois de la précision et de l'élégance.",
    ]
  },
  {
    num: 4, name: "Foyer, Racines & Famille", ruler: "♇ Pluton",
    icon: "◎",
    paras: [
      "La Maison 4 en Scorpion parle d'un foyer d'origine marqué par des dynamiques de pouvoir intenses, des secrets familiaux, des émotions profondes rarement exprimées en surface. Ce n'est pas nécessairement douloureux — mais c'est rarement ordinaire. La famille qui t'a formé est une famille à couches multiples, dont tu continues probablement à déterrer les strates au fil des années.",
      "Pluton comme maître de cette maison signifie que l'héritage familial — psychique autant que matériel — est un territoire de transformation pour toi. Ce que tu portes de tes origines, tu es appelé à le traverser, à le digérer, à en tirer ce qui est solide et à laisser aller ce qui ne t'appartient pas. Ce n'est pas un travail léger. C'est un travail de toute une vie.",
      "Ton rapport à la maison et à l'espace privé est intense. Ton chez-toi est un espace chargé — pas juste un endroit où dormir. Tu y régénères, tu y traverses des états intérieurs que tu ne montres à personne. La sécurité que tu cherches dans ton foyer est profonde et totale : un espace qui te contient vraiment, sans jugement.",
    ]
  },
  {
    num: 5, name: "Créativité, Amour & Plaisir", ruler: "♃ Jupiter",
    icon: "✦",
    paras: [
      "La Maison 5 en Sagittaire parle d'une créativité expansive, aventureuse, toujours en quête d'horizon. Tu joues grand. Tes projets créatifs ont une envergure naturelle — tu ne penses pas en petit, tu ne rêves pas petit. Le Sagittaire en Maison 5 donne à l'expression créative une dimension presque philosophique : tu crées pour chercher, pour explorer, pour comprendre quelque chose.",
      "En amour, tu cherches quelqu'un avec une vision, une direction, une façon de voir le monde qui te dépasse et t'inspire. L'ennui romanesque est ta terreur principale. Un partenaire sédentaire intellectuellement, replié sur lui-même, ne peut pas tenir dans ta vie amoureuse — tu as besoin de quelqu'un avec qui tu peux voyager, au sens propre comme au sens figuré.",
      "Jupiter comme maître donne de la chance dans les entreprises créatives. Tes projets ont tendance à grandir, à trouver leur public, à dépasser tes attentes initiales. Le risque : une tendance à t'éparpiller entre trop de projets, à démarrer avec enthousiasme et à perdre de la vapeur quand la phase initiale d'excitation se termine. La discipline de la finition est ton défi créatif.",
    ]
  },
  {
    num: 6, name: "Travail, Santé & Quotidien", ruler: "♄ Saturne",
    icon: "⊕",
    paras: [
      "La Maison 6 en Capricorne parle d'un rapport au travail quotidien sérieux, orienté vers le résultat, avec une capacité d'endurance peu commune. Tu travailles dur. Tu n'attends pas que les choses tombent — tu construis. Saturne comme maître donne un sens du devoir et une conscience professionnelle qui peuvent parfois aller jusqu'à l'exigence excessive envers toi-même.",
      "Uranus et Neptune sont probablement dans cette zone de ton thème — ce qui ajoute des couches de complexité à cet espace Capricorne. Des conditions de travail qui évoluent brusquement (Uranus), une dimension créative ou spirituelle dans ton activité (Neptune), une façon non conventionnelle d'habiter la discipline (Uranus en Verseau). Tu n'es pas fait pour une carrière linéaire et prévisible.",
      "La santé en Capricorne révèle une constitution solide mais qui demande une attention particulière à la récupération. Tu peux pousser ton corps loin avant d'entendre ses signaux d'alarme. Les os, les articulations, le squelette — zones Capricorne — méritent une attention particulière. L'effort physique régulier est un allié, à condition de ne pas confondre résistance et invincibilité.",
    ]
  },
  {
    num: 7, name: "Partenariats & Relations Clés", ruler: "⛢ Uranus",
    icon: "⊗",
    paras: [
      "La Maison 7 en Verseau parle de partenariats non-conventionnels, libres, animés d'une forme d'originalité qui défie les formes classiques de la relation. Tes partenaires importants — amoureux ou professionnels — ont tendance à ne pas ressembler à ce qu'on attend. Ils sont différents, imprévisibles, porteurs d'une liberté qui à la fois t'attire et te déstabilise.",
      "Uranus comme maître de tes partenariats signifie que tes relations importantes traversent des ruptures soudaines ou des évolutions imprévisibles. Une relation qui semblait stable se transforme radicalement du jour au lendemain. Une rencontre inattendue change complètement ta trajectoire. Cette instabilité n'est pas un défaut — c'est la façon dont tes relations fonctionnent vraiment.",
      "Tu as besoin de liberté dans tes liens proches. Un partenaire possessif, contrôlant, qui cherche à te fixer, te fait fuir. Un partenaire qui t'accorde de l'espace et avec qui tu peux être imprévisible sans que ça menace le lien — là, tu peux vraiment t'engager. La paradoxe Verseau en Maison 7 : tu as besoin d'un engagement profond ET d'une liberté totale dans cet engagement.",
    ]
  },
  {
    num: 8, name: "Transformation & Abîme", ruler: "♆ Neptune",
    icon: "⬛",
    paras: [
      "Ta Maison 8 en Poissons est l'une des configurations les plus mystiques et les plus poreuses qui soit dans un thème natal. Tes transformations ne suivent pas de logique Scorpion — nettes, intenses, maîtrisées. Elles suivent une logique Poissons : fluides, progressives, impossibles à contrôler, et souvent indiscernables jusqu'à ce qu'elles soient accomplies.",
      "Tu n'es pas quelqu'un qui traverse les crises avec un programme. Tu t'y laisses porter, tu t'y dissous, et tu en ressors différent — parfois radicalement — sans avoir pu observer le moment exact de la transformation. C'est une façon de changer plus profonde que la rupture consciente, même si elle est moins lisible de l'intérieur.",
      "Neptune comme maître donne à ta Maison 8 une dimension spirituelle et intuitive. Les mondes invisibles — rêves, intuitions, perceptions extra-sensorielles — sont des données réelles pour toi dans cet espace de transformation. Fais-leur confiance.",
    ]
  },
  {
    num: 9, name: "Philosophie, Voyage & Sens", ruler: "♂ Mars",
    icon: "◐",
    paras: [
      "La Maison 9 en Bélier parle d'une quête de sens directe, pionnière, impatiente avec les demi-mesures philosophiques. Tu ne cherches pas la sagesse par accumulation de lectures — tu la cherches par l'expérience directe, par le mouvement, par la confrontation avec l'inconnu. Ta philosophie est celle de quelqu'un qui a vécu les choses, pas de quelqu'un qui les a seulement pensées.",
      "Mars comme maître donne à tes voyages et à tes explorations une énergie de conquête. Tu pars vite, tu plonges directement, tu n'attends pas d'avoir tout préparé. Saturne et Jupiter sont probablement dans cette zone — ce qui ajouterait une dimension de sagesse accumulée et d'expansion philosophique à cet espace martien.",
      "Ta croyance en quelque chose — une philosophie de vie, un système de valeurs, une vision du monde — est réelle et défendue avec conviction. Tu ne supportes pas le relativisme mou. Tu as une position, tu la défends, et tu la fais évoluer par l'expérience plutôt que par la pression des autres.",
    ]
  },
  {
    num: 10, name: "Vocation & Image Publique", ruler: "♀ Vénus",
    icon: "△",
    paras: [
      "La Maison 10 en Taureau parle d'une image publique stable, fiable, ancrée dans le concret. Ce que les autres perçoivent de toi dans la sphère professionnelle est quelqu'un de solide — quelqu'un qui construit, qui dure, qui n'abandonne pas. La Lune est peut-être dans cette zone, ce qui donnerait à ton image publique une dimension émotionnellement résonante : les gens te font confiance parce qu'ils sentent que tu es réel.",
      "Vénus comme maîtresse de ta vocation indique une orientation vers ce qui est beau, utile ou plaisant — les arts, le design, le bien-être, tout ce qui mêle le sensible et le pratique. Tu n'es pas fait pour une vocation purement abstraite ou froide. Tu travailles mieux quand ce que tu fais a une qualité sensorielle, une dimension de plaisir ou de beauté.",
      "Ta carrière se construit lentement et solidement. Tu n'es pas le genre à connaître une ascension fulgurante au détriment de la qualité. Tu préfères prendre le temps de bien faire les choses, d'asseoir chaque étape avant de passer à la suivante. Cette patience peut être frustrante dans un monde qui valorise la vitesse — mais elle produit quelque chose qui dure.",
    ]
  },
  {
    num: 11, name: "Amitiés, Groupes & Projets", ruler: "☿ Mercure",
    icon: "⊙",
    paras: [
      "La Maison 11 en Gémeaux parle d'un réseau social vaste, diversifié, animé par une curiosité intellectuelle qui se nourrit de la différence. Tu as des amis de tous les horizons — des gens qui ne se ressemblent pas entre eux, qui viennent de mondes différents, et qui partagent avec toi un fil commun : la curiosité, l'intelligence, l'envie d'échanger.",
      "Mercure comme maître donne à tes projets collectifs une légèreté et une agilité qui permettent de s'adapter rapidement. Tes groupes et tes cercles évoluent beaucoup — des gens entrent, des gens sortent, les configurations changent. Tu n'as pas de groupe d'amis fixe depuis l'enfance que tu traînes partout : tu construis des connexions nouvelles et tu les fais évoluer.",
      "Dans les projets collectifs, tu es souvent celui qui a l'idée, qui fait la connexion entre les gens, qui voit comment les pièces du puzzle s'assemblent. Tu n'es pas forcément le chef — mais tu es souvent l'architecte invisible du lien entre les personnes.",
    ]
  },
  {
    num: 12, name: "L'Invisible & la Vie Intérieure", ruler: "☽ Lune",
    icon: "◑",
    paras: [
      "La Maison 12 en Cancer parle d'une vie intérieure profondément nourricière et émotionnelle. Ce que tu construis dans la solitude et le silence est souvent lié à prendre soin de quelque chose — de toi-même, de tes émotions, de ce que tu portes de tes origines. La Lune comme maîtresse de cette maison cachée suggère que ta plus grande ressource invisible est ta capacité à te nourrir intérieurement.",
      "Tu as probablement une vie de rêve très riche — des nuits habitées, des images oniriques qui portent du sens, une communication nocturne avec des parties de toi-même que le jour n'exprime pas. La Maison 12 Cancer en fait un espace de régénération émotionnelle : c'est là, dans le retrait, que tu te répares.",
      "Les zones d'ombre de cette maison : une tendance à fuir dans le passé ou dans les émotions comme dans un cocon protecteur qui empêche d'avancer. L'intégration de ta Maison 12 passe par accepter que le soin de soi n'est pas une faiblesse — et que le temps passé à se régénérer intérieurement est aussi productif que le temps passé à agir vers l'extérieur.",
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
                    → Voir l&#39;onglet &quot;MAISON VIII&quot; pour l&#39;interprétation complète.
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
export default function JasonPage() {
  const [tab, setTab] = useState("wheel");

  // 25 octobre 1999 · 01h21 CEST = 23h21 UT le 24/10 · Aubagne 43°18'N 5°34'E
  const JD = julianDay(1999, 10, 24, 23.35);
  const LAT = 43.2964, LON = 5.5706;
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
            25 OCTOBRE 1999 · 01h21 CEST · AUBAGNE · JD {JD.toFixed(2)}
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
                <strong style={{ color: "#8a7040" }}> Lieu :</strong> Aubagne 43°18&#39;N 5°34&#39;E ·
                <strong style={{ color: "#8a7040" }}> Heure UT :</strong> 23h21 le 24/10 (CEST −2h) ·
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
