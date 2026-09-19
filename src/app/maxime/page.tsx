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
// HOUSE 8 CONTENT — Stellium Capricorne
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
      icon: "♑",
      title: "Le Stellium Capricorne — Une Maison 8 d'exception",
      content: [
        "Ta Maison 8 porte un stellium en Capricorne : Saturne, Uranus et Neptune s'y trouvent simultanément. C'est une configuration exceptionnelle — trois planètes majeures, dont deux lentes (transpersonnelles), concentrées dans la maison de la transformation. Cette conjonction ne se produit qu'une fois tous les plusieurs siècles dans cette configuration particulière.",
        "Le Capricorne en Maison 8 change radicalement la nature de tes transformations. Là où le Scorpion plonge dans les abysses de façon instinctive, le Capricorne structure ses descentes avec méthode et discipline. Tu ne te laisses pas emporter par les crises — tu les traverses avec une rigueur froide qui impressionne et parfois déroute ceux qui t'entourent.",
        "Tes grandes ruptures intérieures ne ressemblent pas à celles des autres. Elles sont lentes, pesées, profondes — et quand elles arrivent, elles sont définitives. Tu ne t'effondres pas sur le moment : tu tiens, tu analyses, et tu rebâtis après. Le temps est ton allié de transformation, pas ton ennemi.",
      ]
    },
    {
      icon: "♄",
      title: "Saturne en Maison 8 — La Transformation par la Maîtrise",
      content: [
        "Saturne en Maison 8 est une position fondamentale dans ton thème. Le maître du Capricorne dans la maison de la mort et de la renaissance indique une relation profondément sérieuse — presque austère — avec les thèmes de la perte, de l'héritage, et de la finitude. Tu n'es pas quelqu'un qui feint d'ignorer la mort : tu l'intègres comme un principe organisateur de ta vie.",
        "Cette position donne souvent un rapport particulier à l'argent des autres — héritages, ressources partagées, dettes. Saturne ici appelle à la prudence, à la rigueur contractuelle, à ne jamais s'engager à la légère dans des unions financières. Il donne aussi, avec le temps, une capacité réelle à construire une sécurité durable à partir de rien — ou de ruines.",
        "Dans l'intimité, Saturne en Maison 8 crée une retenue naturelle. Tu ne te livres pas facilement sur le plan des profondeurs. La vulnérabilité véritable est quelque chose que tu accordes rareté par rareté, à ceux qui ont prouvé leur solidité au fil du temps. Cette prudence peut être perçue comme de la froideur — mais c'est en réalité une forme de respect profond : ce que tu partages vraiment, tu le partages pour de bon.",
      ]
    },
    {
      icon: "⛢",
      title: "Uranus en Capricorne — La Rupture des Structures",
      content: [
        "Uranus en Capricorne en Maison 8 crée une tension productive et déstabilisante : le besoin de tout faire exploser (Uranus) dans le domaine de la construction et de la continuité (Capricorne). Dans la Maison 8, cela se traduit par des ruptures soudaines qui, paradoxalement, t'amènent à rebâtir sur des bases plus solides.",
        "Tes transformations peuvent arriver de façon inattendue — une crise qui surgit de nulle part, une révélation brusque qui change tout, une fin abrupte qui libère. Tu ne les prépares pas toujours, mais tu t'y adaptes avec une agilité que beaucoup ne soupçonnent pas. Uranus en Capricorne apprend à détruire efficacement — à élaguer ce qui doit l'être, sans sentimentalisme inutile.",
        "Ton rapport à l'autorité et aux structures existantes est ambivalent : tu les comprends, tu peux t'y mouvoir avec aisance, mais une partie de toi sait qu'elles sont provisoires, et tu n'hésites pas à les transgresser quand elles deviennent des carcans. Dans la Maison 8, ce réflexe touche aux structures les plus intimes — les contrats émotionnels, les rôles dans le couple, les héritages familiaux implicites.",
      ]
    },
    {
      icon: "♆",
      title: "Neptune en Capricorne — La Dissolution des Certitudes",
      content: [
        "Neptune en Capricorne en Maison 8 dissolve les structures rigides que Saturne cherche à construire. C'est la planète de l'infini dans le signe du concret, dans la maison de l'invisible. Cette tension produit quelque chose de particulier : une capacité à voir au-delà des apparences solides des choses, à percevoir la fragilité fondamentale de ce qui semble permanent.",
        "Tu as probablement une intuition très fine sur les zones d'ombre des situations et des gens — une sorte de radar pour ce qui se passe sous la surface. Neptune en Maison 8 peut donner des rêves intenses, des perceptions qui touchent à l'ésotérique, une sensibilité aux mondes invisibles qui coexistent avec le monde ordinaire.",
        "Le risque Neptune : une tendance à idéaliser les partenaires dans l'intimité, à voir ce que tu veux voir plutôt que ce qui est. Dans la Maison 8, cette idéalisation peut toucher à la fusion émotionnelle et sexuelle — projeter sur l'autre une profondeur qu'il n'a pas forcément. L'intégration de Neptune ici passe par distinguer l'intuition authentique (qui voit juste) de la projection désirante (qui voit ce qu'elle espère).",
      ]
    },
    {
      icon: "🌑",
      title: "L'Héritage Générationnel",
      content: [
        "Tu appartiens à une génération marquée par la conjonction Saturne-Uranus-Neptune en Capricorne — une configuration rare qui a imprégné ceux nés entre 1988 et 1991. Votre génération porte une mission particulière : démanteler les vieilles structures (Uranus/Neptune) et reconstruire quelque chose de plus solide et de plus honnête (Saturne/Capricorne). Pas la révolution romantique — la transformation méthodique.",
        "Dans ton thème personnel, cette triple conjonction en Maison 8 personnalise cette énergie générationnelle. Là où certains de ta génération portent ces planètes en Maison 1, 4, ou 10, tu les portes dans la maison la plus transformatrice qui soit. Cela signifie que ces grandes forces — la rupture des certitudes, la dissolution des illusions, la reconstruction patiente — opèrent prioritairement dans ton espace intime : tes unions, tes héritages psychiques, ta relation à l'invisible.",
        "Ce n'est pas un fardeau. C'est une profondeur. Les gens avec qui tu t'engages vraiment le ressentent : il y a quelque chose dans ta façon d'être en relation, de tenir face aux crises, de traverser les ruptures, qui n'appartient pas à la surface des choses.",
      ]
    },
    {
      icon: "✦",
      title: "Ce que la Maison 8 te dit en résumé",
      content: [
        "Ta Maison 8 est l'une des zones les plus denses de ton thème. Saturne y construit dans la profondeur, Uranus y brise ce qui doit l'être, Neptune y dissout les certitudes illusoires. Ensemble, dans le Capricorne, ils définissent une façon d'habiter la transformation qui est à la fois plus lente et plus durable que la moyenne.",
        "Tu n'es pas quelqu'un qui change par caprice ou sous pression. Quand tu changes vraiment — en profondeur, sur les choses qui comptent — c'est irréversible. Ce que tu laisses derrière toi, tu l'as vraiment quitté. Ce que tu gardes, tu le gardes avec une fidélité que peu de gens comprennent.",
        "La clé de ta Maison 8 : accepter que certaines structures doivent tomber pour que quelque chose de plus vrai puisse exister — et faire confiance au fait que tu as, en toi, la capacité de traverser cette obscurité et d'en revenir plus entier.",
      ]
    },
  ];

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto", fontFamily: "Georgia, serif" }}>
      <div style={{ borderLeft: "2px solid #D4AF37", paddingLeft: "16px", marginBottom: "28px" }}>
        <h2 style={{ fontSize: "11px", letterSpacing: "4px", color: "#8a7040", fontWeight: "normal", margin: "0 0 6px 0" }}>INTERPRÉTATION APPROFONDIE</h2>
        <h1 style={{ fontSize: "20px", color: "#D4AF37", margin: 0, letterSpacing: "1px" }}>Maison VIII — Saturne, Uranus, Neptune en Capricorne</h1>
        <p style={{ margin: "8px 0 0 0", color: "#7a6a40", fontSize: "11px", letterSpacing: "1px" }}>Capricorne · Pluton · Terre Cardinal</p>
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
// ALL 12 HOUSES — Gémeaux ASC
// ═══════════════════════════════════════════════
const HOUSE_DATA = [
  {
    num: 1, name: "Identité & Apparence", ruler: "☿ Mercure",
    icon: "◉",
    paras: [
      "La Maison 1 en Gémeaux donne à ta première impression quelque chose de vif, de changeant, de difficile à fixer. Les gens qui te rencontrent reçoivent plusieurs personnes à la fois : l'esprit rapide, la curiosité qui saute d'un sujet à l'autre, le regard qui traite l'information en temps réel. Tu es rarement perçu de la même façon deux fois — et tu y trouves une certaine liberté.",
      "Mercure comme maître de ton Ascendant te donne un corps et une présence qui communiquent avant même que tu ouvres la bouche. Les mains, le regard, la façon dont tu écoutes — tout ça parle. Tu peux être fascinant ou insaisissable selon le moment, et tu changes de registre avec une fluidité qui déconcerte ceux qui cherchent à te mettre dans une case.",
      "Le risque Gémeaux en Maison 1 : une tendance à t'adapter tellement à l'interlocuteur que tu perds de vue ce que tu es vraiment. Tu peux avoir plusieurs versions de toi-même en circulation simultanément. L'enjeu de ton Ascendant est d'apprendre à être cohérent sans être rigide — à laisser la complexité de qui tu es exister sans la fragmenter.",
    ]
  },
  {
    num: 2, name: "Argent & Valeurs Profondes", ruler: "☽ Lune",
    icon: "◈",
    paras: [
      "La Maison 2 en Cancer parle d'un rapport à l'argent et à la sécurité profondément émotionnel. Tu n'es pas indifférent aux questions matérielles — tu y es sensible de façon viscérale. La sécurité financière est pour toi une forme de sécurité affective : quand tes finances sont stables, tu te sens ancré ; quand elles vacillent, quelque chose en toi vacille avec elles.",
      "La Lune comme maîtresse de cette maison amplifie cette connexion émotionnelle. Tes revenus peuvent suivre des cycles — des phases d'abondance et de rareté qui ont leur propre rythme, parfois indépendant de tes efforts. Tu as une intuition naturelle pour ce qui a de la valeur — pas nécessairement au sens du marché, mais au sens de ce qui dure et ce qui nourrit vraiment.",
      "Jupiter est probablement proche de cette zone, ce qui ajouterait une dimension d'expansion et de générosité à ton rapport aux ressources. Ce que tu values vraiment — la famille, la protection des tiens, la construction de quelque chose qui perdurera — ne se mesure pas facilement en termes financiers.",
    ]
  },
  {
    num: 3, name: "Communication & Pensée", ruler: "☉ Soleil",
    icon: "◇",
    paras: [
      "La Maison 3 en Lion donne à ta communication un éclat naturel. Quand tu parles vraiment — pas poliment, mais vraiment — tu as une présence dans la parole qui capte l'attention. Les mots que tu choisis, la façon dont tu structures une histoire, le débit de ton enthousiasme : tout cela porte.",
      "Le Soleil comme maître de cette maison te donne un esprit créatif et généreux. Tu ne communiques pas pour informer seulement — tu communiques pour illuminer, pour partager quelque chose de vivant. Le risque : une tendance à dominer les échanges quand tu es à l'aise, à prendre toute la place dans une conversation. Le contra-risque : tu peux aussi te taire complètement si tu te sens non reconnu.",
      "Ton rapport aux frères, sœurs, cousins, voisins — les proches de la Maison 3 — est marqué par ce Lion : tu veux de l'admiration et tu en donnes. Les relations qui fonctionnent dans cette sphère sont celles où chacun peut briller à son tour.",
    ]
  },
  {
    num: 4, name: "Foyer, Racines & Famille", ruler: "☿ Mercure",
    icon: "◎",
    paras: [
      "La Maison 4 en Vierge parle d'un foyer d'origine structuré par l'analyse, le service, et une forme d'exigence. La famille dans laquelle tu as grandi avait probablement des attentes pratiques et concrètes — une culture du travail bien fait, de l'utilité, du rangement. Tu as absorbé ce sens du détail et cette conscience que les choses doivent fonctionner.",
      "Mercure comme maître donne un rapport intellectualisé à la maison — les conversations, les informations, les échanges étaient au centre de la vie familiale. Tu pourrais avoir eu une figure parentale très communicante, ou au contraire très critique — les deux étant des déclinaisons de Mercure en Maison 4.",
      "Ce que tu cherches dans un chez-toi : la netteté, l'ordre, un espace où chaque chose est à sa place. Non pas par conformisme, mais parce qu'un environnement physique bien organisé est pour toi une condition de clarté intérieure. Le chaos autour de toi crée du bruit dans ta tête.",
    ]
  },
  {
    num: 5, name: "Créativité, Amour & Plaisir", ruler: "♀ Vénus",
    icon: "✦",
    paras: [
      "La Maison 5 en Balance est l'une des positions les plus gracieuses pour la créativité et l'amour. Ton Soleil natal y réside — ce qui en fait une zone centrale de ton identité et de ton expression de vie. Tu brilles vraiment quand tu crées, quand tu séduis, quand tu joues. La Balance apporte à tout cela un sens du beau, de l'harmonie, de la relation bien construite.",
      "En amour, tu cherches une réciprocité totale. Pas juste quelqu'un qui t'aime — quelqu'un avec qui l'échange est équitable, stimulant, beau. Le déséquilibre dans une relation te pèse plus qu'à d'autres : tu perçois immédiatement quand quelque chose cloche dans la distribution des rôles, de l'attention, de l'effort. Ta tendance à éviter le conflit peut te faire supporter ce déséquilibre trop longtemps avant de le nommer.",
      "Ta créativité est naturellement esthétique — elle cherche la beauté dans tout ce qu'elle touche. Que ce soit dans les idées, l'espace, les projets ou les relations : tu as le sens de ce qui est bien proportionné, de ce qui a du style. Vénus comme maîtresse de cette maison amplifie ce talent pour rendre les choses plaisantes à voir, à vivre, à partager.",
    ]
  },
  {
    num: 6, name: "Travail, Santé & Quotidien", ruler: "♇ Pluton",
    icon: "⊕",
    paras: [
      "La Maison 6 en Scorpion parle d'un rapport au travail quotidien d'une intensité rarement anodine. Tu ne fais pas les choses à moitié, dans le domaine du service et du labeur : tu t'y engages totalement ou pas du tout. Une tâche qui ne te touche pas profondément est une tâche que tu fais mal — ou que tu ne fais pas.",
      "Pluton comme maître de cette maison signifie que ton environnement professionnel traverse ses propres mutations. Tu as peut-être connu des ruptures radicales dans tes conditions de travail, des transformations de métier, des changements de contexte qu'aucun de tes collègues n'a vécus de la même façon. Ces turbulences ne sont pas des accidents — elles font partie de la façon dont tu te construis professionnellement.",
      "La santé en Scorpion révèle un corps capable de ressources insoupçonnées sous pression — mais aussi sujet à des accumulations de tension qui doivent trouver une sortie. Le sport intense, les pratiques corporelles profondes (yoga, arts martiaux, natation), tout ce qui permet une purge régulière, sont des alliés de ta santé bien plus efficaces qu'une hygiène de vie tiède.",
    ]
  },
  {
    num: 7, name: "Partenariats & Relations Clés", ruler: "♃ Jupiter",
    icon: "⊗",
    paras: [
      "La Maison 7 en Sagittaire parle de partenariats animés par un idéal commun, un sens de l'aventure, et une vision plus grande que la vie ordinaire. Tu es attiré par des partenaires qui ont une philosophie, une direction, une façon de voir le monde qui élargit la tienne. Quelqu'un qui voit petit, qui se contente du confort sans aspirer à plus, t'étouffe à la longue.",
      "Jupiter comme maître donne à tes relations une dimension expansive : elles t'ouvrent des portes, t'amènent vers des horizons que tu n'aurais pas explorés seul. Tes partenaires importants — amoureux ou professionnels — ont souvent joué un rôle de révélateur dans ta vie. Ils t'ont montré quelque chose de toi-même que tu ne voyais pas encore.",
      "Le risque Sagittaire en Maison 7 : idéaliser l'autre dans les premiers temps, puis être déçu quand la réalité quotidienne reprend ses droits. La liberté est aussi un enjeu central : tu as besoin que tes partenariats te laissent de l'espace pour être toi-même, pour explorer, pour ne pas te sentir contrôlé. Un lien qui étouffe est pour toi un lien qui meurt.",
    ]
  },
  {
    num: 8, name: "Transformation & Abîme", ruler: "♄ Saturne",
    icon: "⬛",
    paras: [
      "Ta Maison 8 en Capricorne est l'une des zones les plus denses et les plus structurantes de ton thème entier. Saturne, Uranus et Neptune s'y trouvent — une triple conjonction qui fait de tes transformations profondes un processus à la fois inévitable et méthodique.",
      "Tu ne traverses pas les crises de la même façon que les autres : là où certains s'effondrent ou fuient, tu tiens — et tu analyses. Tes grandes ruptures sont lentes à se préparer, intenses quand elles arrivent, et définitives dans leurs effets. Ce que tu laisses derrière toi, tu l'as vraiment quitté.",
      "L'héritage — matériel, psychique, familial — est un thème important de ta vie. Saturne ici t'invite à prendre conscience de ce que tu portes du passé : les structures invisibles héritées de ta famille, les contrats implicites, les loyautés inconscientes. Les identifier, les traverser, en garder ce qui est solide et laisser aller le reste — c'est un travail de toute une vie, et c'est le tien.",
    ]
  },
  {
    num: 9, name: "Philosophie, Voyage & Sens", ruler: "⛢ Uranus",
    icon: "◐",
    paras: [
      "La Maison 9 en Verseau parle d'une quête de sens résolument originale, non-conventionnelle, orientée vers le futur. Tu n'es pas fait pour les philosophies toutes faites ni les croyances héritées par conformité. Ce qui te touche vraiment sur le plan des grandes questions, c'est toujours quelque chose qui brise les dogmes, qui questionne l'évident, qui propose une perspective radicalement différente.",
      "Uranus comme maître donne à ta pensée philosophique une dimension révolutionnaire. Tu peux être profondément attiré par les sciences de pointe, les théories qui bousculent le consensus, les systèmes de pensée qui renversent les certitudes établies. Pas par esprit de contradiction — par besoin authentique de vérité au-delà des apparences.",
      "Tes voyages — physiques et intérieurs — ont tendance à te transformer structurellement. Pas de simples escapades : des déplacements qui changent quelque chose dans ta façon de voir le monde. Tu reviens rarement de ces voyages exactement comme tu y étais parti.",
    ]
  },
  {
    num: 10, name: "Vocation & Image Publique", ruler: "♆ Neptune",
    icon: "△",
    paras: [
      "La Maison 10 en Poissons donne une image publique difficile à cerner — fluide, insaisissable, qui change de couleur selon les contextes. Tu ne projettes pas une identité professionnelle nette et rigide. Ce que les autres perçoivent de toi dans la sphère publique a quelque chose d'énigmatique, parfois d'inspirant, parfois d'évasif.",
      "Neptune comme maître de ta vocation indique une aspiration profonde à une activité qui touche à quelque chose de plus grand que soi — l'art, le service, le soin, la spiritualité, l'invisible. Tu ne t'épanouis pas dans des structures trop rigidement hiérarchiques ou trop uniquement orientées vers le profit. Tu as besoin de sens dans ce que tu fais professionnellement.",
      "Ta vocation peut mettre du temps à se clarifier — les Poissons en Maison 10 rendent parfois la direction difficile à lire de l'intérieur. Mais quand tu trouves l'activité qui conjugue tes dons (Gémeaux : la communication, la pensée agile) avec ta profondeur (Maison 8 Capricorne) et ton aspiration (Poissons : le sens), tu peux exercer une influence réelle et durable.",
    ]
  },
  {
    num: 11, name: "Amitiés, Groupes & Projets", ruler: "♂ Mars",
    icon: "⊙",
    paras: [
      "La Maison 11 en Bélier parle d'amitiés vives, directes, animées d'une énergie pionnière. Tes amis proches ont de la personnalité, de l'initiative, une façon d'aller droit au but que tu apprécies. Tu n'es pas fait pour les groupes tièdes — tu gravites vers les gens qui osent, qui prennent des risques, qui bougent.",
      "Mars comme maître donne à tes projets collectifs une impulsion initiale puissante. Tu es souvent à l'origine des initiatives dans ton cercle — celui qui propose, qui lance, qui entraîne. La Lune est peut-être dans cette zone, ce qui donnerait à tes amitiés une dimension émotionnellement centrale et cyclique : des périodes de forte connexion suivies de phases de recul.",
      "La fidélité en amitié fonctionne chez toi à l'authenticité : tu soutiens totalement ceux qui sont vrais avec toi, et tu te déconnectes sans drama de ceux qui ne le sont pas. L'amitié, pour toi, ne se maintient pas par habitude — elle se mérite par l'honnêteté.",
    ]
  },
  {
    num: 12, name: "L'Invisible & la Vie Intérieure", ruler: "♀ Vénus",
    icon: "◑",
    paras: [
      "La Maison 12 en Taureau parle d'une vie intérieure profondément sensorielle et ancrée dans le corps. Ce que tu construis dans la solitude n'est pas de la rêverie abstraite — c'est quelque chose de tangible, de beau, de lié à la matière. Tu peux avoir une relation secrète et intense à la nature, à la musique, à tout ce qui nourrit les sens de façon profonde.",
      "Vénus comme maîtresse de cette maison cachée suggère des talents artistiques ou esthétiques que tu n'exposes peut-être pas — quelque chose qui t'appartient intimement. Une façon de créer, d'embellir, de ressentir le beau, qui se passe loin des regards. Ce n'est pas un trésor enfoui : c'est une ressource que tu accèdes en te retirant du bruit.",
      "La Maison 12 en Taureau révèle aussi les zones d'ombre liées à la résistance au changement et à l'attachement aux structures rassurantes. Avec ta Maison 8 qui opère de grandes transformations, la Maison 12 Taureau peut parfois freiner ces transformations en cherchant la stabilité à tout prix. L'intégration de cette maison passe par accepter que lâcher certains conforts matériels ou psychiques n'est pas une perte — c'est une libération.",
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
                    → Voir l&#39;onglet &quot;MAISON VIII&quot; pour l&#39;interprétation complète du stellium Capricorne.
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
export default function MaximePage() {
  const [tab, setTab] = useState("wheel");

  // 25 septembre 1989 · 12h55 CEST = 10h55 UT · Orange 44°08'N 4°48'E
  const JD = julianDay(1989, 9, 25, 10.9167);
  const LAT = 44.1383, LON = 4.8083;
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
            25 SEPTEMBRE 1989 · 12h55 CEST · ORANGE · JD {JD.toFixed(2)}
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
                <strong style={{ color: "#8a7040" }}> Lieu :</strong> Orange 44°08&#39;N 4°48&#39;E ·
                <strong style={{ color: "#8a7040" }}> Heure UT :</strong> 10h35 (CEST −2h) ·
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
