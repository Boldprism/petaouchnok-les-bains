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
  { name: "Verseau",    sym: "♒", el: "air",    mod: "fixe",     ruler: "⛢",  color: "#2471A3" },
  { name: "Poissons",   sym: "♓", el: "eau",    mod: "mutable",  ruler: "♆",  color: "#1A6B8A" },
];

const EL_COLORS: Record<string, string> = { feu: "#7a1a1a", terre: "#4a3510", air: "#0e2a44", eau: "#0a3035" };
const EL_TEXT: Record<string, string>   = { feu: "#FF7B7B", terre: "#C8A84B", air: "#7EC8E3", eau: "#4DD9C0" };
const signOf = (lon: number) => { const i = Math.floor(norm(lon) / 30) % 12; return { ...SIGNS[i], deg: norm(lon) % 30, idx: i }; };
const degStr = (d: number) => { const deg = Math.floor(d); const min = Math.floor((d - deg) * 60); return `${deg}°${String(min).padStart(2, "0")}'`; };

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

function f(n: number) { return n.toFixed(2); }

interface PlanetPos { planet: typeof PLANETS[number]; lon: number; displayLon?: number; realLon?: number; }

function spreadPositions(planets: PlanetPos[]) {
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

function ChartWheel({ planets, asc, mc }: { planets: PlanetPos[]; asc: number; mc: number }) {
  const cx = 200, cy = 200;
  const R_OUT = 188, R_ZODIAC = 160, R_INNER = 135, R_PLANET = 108;

  const zodiacSegments = SIGNS.map((sign, i) => {
    const sLon = i * 30, eLon = (i + 1) * 30;
    const sA = toR(norm(sLon - asc)), eA = toR(norm(eLon - asc));
    const x1o = cx - R_OUT * Math.cos(sA), y1o = cy - R_OUT * Math.sin(sA);
    const x2o = cx - R_OUT * Math.cos(eA), y2o = cy - R_OUT * Math.sin(eA);
    const x1z = cx - R_ZODIAC * Math.cos(sA), y1z = cy - R_ZODIAC * Math.sin(sA);
    const x2z = cx - R_ZODIAC * Math.cos(eA), y2z = cy - R_ZODIAC * Math.sin(eA);
    const path = `M${f(x1o)},${f(y1o)} A${R_OUT},${R_OUT} 0 0 0 ${f(x2o)},${f(y2o)} L${f(x2z)},${f(y2z)} A${R_ZODIAC},${R_ZODIAC} 0 0 1 ${f(x1z)},${f(y1z)}Z`;
    const mid = toR(norm(sLon + 15 - asc));
    const symR = (R_OUT + R_ZODIAC) / 2;
    return { sign, path, sx: cx - symR * Math.cos(mid), sy: cy - symR * Math.sin(mid) };
  });

  const houseCusps = Array.from({ length: 12 }, (_, i) => norm(asc + i * 30));
  const spreadPlanets = spreadPositions(planets);

  return (
    <svg viewBox="0 0 400 400" width="360" height="360" style={{ display: "block", margin: "0 auto" }}>
      <defs>
        <radialGradient id="bg2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0d1022" />
          <stop offset="100%" stopColor="#050710" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={R_OUT} fill="url(#bg2)" />
      {[...Array(30)].map((_: unknown, i: number) => {
        const a = (i / 30) * 360 + i * 7.3;
        const r = R_ZODIAC + 10 + (i % 5) * 5;
        const p = lonToXY(a + (asc % 360), asc, r, cx, cy);
        return <circle key={i} cx={p.x} cy={p.y} r="0.6" fill="rgba(255,255,255,0.25)" />;
      })}
      {zodiacSegments.map(({ sign, path, sx, sy }) => (
        <g key={sign.name}>
          <path d={path} fill={EL_COLORS[sign.el]} stroke="rgba(180,150,80,0.2)" strokeWidth="0.3" />
          <text x={f(sx)} y={f(sy)} textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="rgba(220,200,150,0.85)" fontFamily="Georgia, serif">{sign.sym}</text>
        </g>
      ))}
      <circle cx={cx} cy={cy} r={R_OUT} fill="none" stroke="rgba(180,150,80,0.4)" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r={R_ZODIAC} fill="none" stroke="rgba(180,150,80,0.4)" strokeWidth="0.5" />
      {Array.from({ length: 12 }, (_: unknown, i: number) => {
        const a = toR(norm(i * 30 - asc));
        return <line key={i} x1={f(cx - R_ZODIAC * Math.cos(a))} y1={f(cy - R_ZODIAC * Math.sin(a))} x2={f(cx - R_OUT * Math.cos(a))} y2={f(cy - R_OUT * Math.sin(a))} stroke="rgba(180,150,80,0.5)" strokeWidth="0.5" />;
      })}
      <circle cx={cx} cy={cy} r={R_INNER} fill="url(#bg2)" />
      {houseCusps.map((cusp, i) => {
        const a = toR(norm(cusp - asc));
        const isAxis = i % 3 === 0;
        return <line key={i} x1={f(cx - R_INNER * Math.cos(a))} y1={f(cy - R_INNER * Math.sin(a))} x2={f(cx - 12 * Math.cos(a))} y2={f(cy - 12 * Math.sin(a))} stroke={isAxis ? "rgba(212,175,55,0.7)" : "rgba(180,150,80,0.25)"} strokeWidth={isAxis ? "1.2" : "0.6"} />;
      })}
      {Array.from({ length: 12 }, (_: unknown, i: number) => {
        const midLon = norm(asc + (i + 0.5) * 30);
        const p = lonToXY(midLon, asc, R_INNER - 10, cx, cy);
        return <text key={i} x={f(p.x)} y={f(p.y)} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="rgba(180,150,80,0.55)" fontFamily="Georgia, serif">{i + 1}</text>;
      })}
      <circle cx={cx} cy={cy} r={R_INNER} fill="none" stroke="rgba(180,150,80,0.35)" strokeWidth="0.5" />
      {(() => { const p = lonToXY(mc, asc, R_ZODIAC - 5, cx, cy); return <text x={f(p.x)} y={f(p.y)} textAnchor="middle" dominantBaseline="middle" fontSize="6.5" fill="#D4AF37" fontFamily="Georgia, serif" fontWeight="bold">MC</text>; })()}
      <text x="8" y={cy} textAnchor="start" dominantBaseline="middle" fontSize="7" fill="#D4AF37" fontFamily="Georgia, serif">ASC</text>
      <text x="392" y={cy} textAnchor="end" dominantBaseline="middle" fontSize="7" fill="#D4AF37" fontFamily="Georgia, serif">DSC</text>
      {spreadPlanets.map(({ planet, displayLon, realLon }) => {
        const pReal = lonToXY(realLon!, asc, R_INNER - 4, cx, cy);
        const pDisp = lonToXY(displayLon!, asc, R_PLANET, cx, cy);
        return <line key={planet.key + "_l"} x1={f(pReal.x)} y1={f(pReal.y)} x2={f(pDisp.x)} y2={f(pDisp.y)} stroke={planet.color} strokeWidth="0.35" opacity="0.4" />;
      })}
      {spreadPlanets.map(({ planet, displayLon }) => {
        const p = lonToXY(displayLon!, asc, R_PLANET, cx, cy);
        return (
          <g key={planet.key}>
            <circle cx={f(p.x)} cy={f(p.y)} r="9.5" fill="rgba(5,7,18,0.88)" stroke={planet.color} strokeWidth="0.8" />
            <text x={f(p.x)} y={f(p.y)} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill={planet.color} fontFamily="Georgia, serif">{planet.sym}</text>
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
interface FullPlanetPos {
  planet: typeof PLANETS[number];
  lon: number;
  sign: ReturnType<typeof signOf>;
  house: number;
}

function PlanetTable({ positions, asc, mc }: { positions: FullPlanetPos[]; asc: number; mc: number }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", fontFamily: "Georgia, serif" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(212,175,55,0.3)" }}>
            {["Astre", "Signe", "Degré", "Maison", "Élément", "Modalité"].map(h => (
              <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "#8a7040", fontSize: "9px", letterSpacing: "2px", fontWeight: "normal" }}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {positions.map(({ planet, sign, house }) => (
            <tr key={planet.key} style={{ borderBottom: "1px solid rgba(180,150,80,0.08)" }}>
              <td style={{ padding: "9px 10px" }}>
                <span style={{ fontSize: "16px", marginRight: "8px", color: planet.color }}>{planet.sym}</span>
                <span style={{ color: "#c0b07a", fontSize: "12px" }}>{planet.name}</span>
              </td>
              <td style={{ padding: "9px 10px", color: "#d4c090" }}>{sign.sym} {sign.name}</td>
              <td style={{ padding: "9px 10px", color: "#8a7a50", fontSize: "11px" }}>{degStr(sign.deg)}</td>
              <td style={{ padding: "9px 10px" }}><span style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)", padding: "2px 6px", fontSize: "11px", color: "#d4af37" }}>M{house}</span></td>
              <td style={{ padding: "9px 10px", color: EL_TEXT[sign.el], fontSize: "11px" }}>{sign.el}</td>
              <td style={{ padding: "9px 10px", color: "#7a6a40", fontSize: "11px" }}>{sign.mod}</td>
            </tr>
          ))}
          <tr style={{ borderTop: "1px solid rgba(212,175,55,0.15)", borderBottom: "1px solid rgba(180,150,80,0.08)" }}>
            <td style={{ padding: "9px 10px" }}><span style={{ fontSize: "16px", marginRight: "8px", color: "#D4AF37" }}>↑</span><span style={{ color: "#c0b07a", fontSize: "12px" }}>Ascendant</span></td>
            <td style={{ padding: "9px 10px", color: "#d4c090" }}>{signOf(asc).sym} {signOf(asc).name}</td>
            <td style={{ padding: "9px 10px", color: "#8a7a50", fontSize: "11px" }}>{degStr(signOf(asc).deg)}</td>
            <td style={{ padding: "9px 10px" }}><span style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.15)", padding: "2px 6px", fontSize: "11px", color: "#d4af37" }}>M1</span></td>
            <td style={{ padding: "9px 10px", color: EL_TEXT[signOf(asc).el], fontSize: "11px" }}>{signOf(asc).el}</td>
            <td style={{ padding: "9px 10px", color: "#7a6a40", fontSize: "11px" }}>{signOf(asc).mod}</td>
          </tr>
          <tr style={{ borderBottom: "1px solid rgba(180,150,80,0.08)" }}>
            <td style={{ padding: "9px 10px" }}><span style={{ fontSize: "16px", marginRight: "8px", color: "#D4AF37" }}>△</span><span style={{ color: "#c0b07a", fontSize: "12px" }}>Milieu du Ciel</span></td>
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
// 12 MAISONS
// ═══════════════════════════════════════════════
const HOUSE_DATA = [
  {
    num: 1, name: "Identité & Apparence",
    icon: "◉", ruler: "☉ Soleil",
    paras: [
      "Ton Ascendant Lion est l'un des placements les plus solaires qui existe. Avant même que tu dises quoi que ce soit, les gens te remarquent — quelque chose dans ta présence capte l'attention. Ce n'est pas de la prétention : c'est une radiation naturelle que tu ne peux pas vraiment éteindre, même quand tu essaies.",
      "Le Soleil comme maître de ton Ascendant crée une cohérence rare dans un thème : là où certains vivent avec un fossé entre leur apparence et leur identité profonde, toi tu es fondamentalement transparent. Ce que les gens voient — la chaleur, la générosité, parfois une certaine fierté — est bien ce que tu es.",
      "La difficulté de cet Ascendant : la dépendance au regard de l'autre. Quand tu n'es pas vu, pas reconnu, pas apprécié à ta juste valeur, quelque chose en toi s'étiole. Apprendre à te nourrir de ta propre lumière, indépendamment de la validation extérieure, est l'un des défis centraux de ta vie.",
    ]
  },
  {
    num: 2, name: "Argent & Valeurs Profondes",
    icon: "◈", ruler: "☿ Mercure",
    paras: [
      "La Maison 2 en Vierge donne un rapport à l'argent analytique et prudent. Tu n'es pas du genre à dépenser impulsivement — tu évalues, tu calcules, tu cherches la valeur réelle derrière le prix affiché. Mercure comme maître indique que ton rapport à l'argent passe par l'information : tu gères mieux quand tu comprends exactement où tu en es.",
      "Tes valeurs profondes sont celles de la Vierge : l'utilité, la précision, l'honnêteté, le travail bien fait. Tu accordes une grande valeur au concret et à l'efficace — quelque chose qui fonctionne vraiment vaut infiniment plus à tes yeux qu'une belle promesse.",
      "Le paradoxe Lion/Vierge de ton thème : l'Ascendant Lion a des goûts somptueux, un penchant pour le beau et le généreux, pendant que ta Maison 2 Vierge compte ses sous avec précision. Cette tension peut générer de la culpabilité autour de la dépense — ou une grande habileté à combiner plaisir et rigueur financière.",
    ]
  },
  {
    num: 3, name: "Communication & Pensée",
    icon: "◇", ruler: "♀ Vénus",
    paras: [
      "La Maison 3 en Balance colore ta façon de penser et de communiquer d'un sens aigu de la nuance et de la diplomatie. Tu ne dis pas ce que tu penses brutalement — tu le formules, tu le calibres, tu cherches la façon qui sera entendue. Ce talent rhétorique naturel peut te rendre redoutablement persuasif.",
      "Vénus comme maître donne un rapport aux mots esthétique : tu aimes le langage beau, la formule juste, la conversation qui a du style. Les échanges grossiers ou brusques te dérangent physiquement. Tu es capable de transformer un conflit en dialogue simplement par la manière dont tu articules les choses.",
      "Le risque de cette Maison 3 Balance : dire ce que l'autre veut entendre plutôt que ce que tu penses vraiment. La diplomatie peut glisser vers l'évitement si tu n'es pas vigilant. Ta pensée est plus tranchante et plus originale que tu ne la montres parfois.",
    ]
  },
  {
    num: 4, name: "Foyer, Racines & Famille",
    icon: "◎", ruler: "♇ Pluton",
    paras: [
      "La Maison 4 en Scorpion place Pluton comme maître de tes racines — configuration intense qui parle d'une enfance marquée par des forces profondes, souvent invisibles. La dynamique familiale n'était pas simple ou anodine : il y avait des non-dits, des zones de pouvoir, peut-être des transformations radicales qui ont reconfiguré ce que tu appelles 'maison'.",
      "Pluton est presque certainement dans cette maison pour ta génération de 1990, renforçant considérablement cette thématique. Cela indique une psychologie familiale complexe — une transmission de blessures ou de forces transgénérationnelles que tu portes, et que ta vie t'invite à conscientiser puis à transformer.",
      "Ton rapport au foyer est intense : tu as besoin que l'endroit où tu vis soit un refuge véritable, pas seulement un espace neutre. Et les personnes avec qui tu partages cet espace doivent mériter ta confiance totale — car c'est là que tu te déposes vraiment, là que rien n'est performé.",
    ]
  },
  {
    num: 5, name: "Créativité, Amour & Plaisir",
    icon: "✦", ruler: "♃ Jupiter",
    paras: [
      "La Maison 5 en Sagittaire avec Jupiter probablement présent est une configuration de joie expansive. Ta créativité est large, généreuse, philosophique — elle veut embrasser quelque chose de grand. Quand tu joues, quand tu crées, quand tu aimes, tu le fais avec une ouverture et un enthousiasme qui emporte les autres.",
      "En amour, tu es attiré par ceux qui ont une vision — une direction, un sens, quelque chose qu'ils cherchent à comprendre ou à construire. La superficialité t'ennuie rapidement. Un début d'histoire amoureux avec toi ressemble souvent à un voyage — une aventure intellectuelle et émotionnelle simultanée.",
      "Jupiter en Maison 5 est l'un des placements les plus chanceux qui soit pour tout ce qui touche à l'expression créatrice et à la joie. Tu as une capacité naturelle à rayonner dans tes domaines de passion — et cette lumière attire. Le risque : l'excès, la promesse trop large, la difficulté à se concentrer sur une seule flamme à la fois.",
    ]
  },
  {
    num: 6, name: "Travail, Santé & Quotidien",
    icon: "⊕", ruler: "♄ Saturne",
    paras: [
      "La Maison 6 en Capricorne, avec la conjonction Saturn-Uranus-Neptune probablement concentrée ici, est la zone la plus chargée planétairement de ton thème. C'est ta zone de travail, de discipline quotidienne, de santé. Cette stellium capricornien dit une chose clairement : tu es fait pour construire des choses sérieuses, durables, qui résistent au temps.",
      "Saturne ici indique un rapport au travail exigeant envers toi-même. Tu as des standards élevés, tu n'es jamais vraiment 'satisfait' de ta propre production — il y a toujours mieux à faire, plus à affiner. C'est une force motrice formidable et un risque d'épuisement par perfectionnisme.",
      "Uranus dans cette maison introduit une tension intéressante : tu as besoin de discipline Capricorne ET de liberté Verseau dans ta façon de travailler. Les environnements trop rigides ou bureaucratiques te sclérosent. Tu fonctionnes mieux avec une autonomie réelle dans la méthode, même si le cadre global est structuré. Neptune ici ajoute une dimension idéale — tu as besoin de trouver du sens dans ce que tu fais au quotidien, pas seulement de l'efficacité.",
    ]
  },
  {
    num: 7, name: "Partenariats & Relations Clés",
    icon: "⊗", ruler: "⛢ Uranus",
    paras: [
      "La Maison 7 en Verseau avec ton Soleil natal très probablement positionné ici est une configuration centrale. Tes partenariats — amoureux et professionnels — sont le théâtre de ton expression la plus vitale. L'autre n'est pas un accessoire de ta vie : il est un révélateur, un miroir qui te montre des parties de toi que tu ne vois pas seul.",
      "Soleil en Verseau en Maison 7 : tu es attiré par des partenaires originaux, libres, qui ne ressemblent à personne. L'ordinaire te laisse froid. Tu veux quelqu'un avec qui la relation elle-même soit une aventure intellectuelle et humaine — quelqu'un qui te surprend, qui te remet en question, qui refuse de se laisser enfermer dans un rôle.",
      "Le paradoxe Verseau en Maison 7 : tu cherches une relation profonde ET tu as besoin d'indépendance absolue. Ces deux besoins peuvent sembler contradictoires. La clé est un partenariat où les deux individus restent pleinement eux-mêmes — une relation de deux êtres libres qui choisissent chaque jour d'être ensemble, pas une fusion qui effacerait l'un au profit de l'autre.",
    ]
  },
  {
    num: 8, name: "Transformation & Abîme",
    icon: "⬛", ruler: "♆ Neptune",
    paras: [
      "La Maison 8 en Poissons avec Neptune comme maître donne à tes transformations profondes une dimension spirituelle et dissolution totale. Tes 'morts symboliques' ne passent pas par des ruptures nettes et analytiques — elles passent par une dissolution progressive, un lâcher-prise, une liquéfaction de ce qui était solide.",
      "Tu peux avoir une perméabilité psychique naturelle — une capacité à ressentir ce qui n'est pas dit, à percevoir les courants invisibles dans les relations. C'est un don précieux et une source de confusion : tu absorbes l'état émotionnel des autres sans toujours savoir où finit leur énergie et où commence la tienne.",
      "Neptune en Maison 8 peut aussi indiquer une relation complexe à l'argent commun ou aux héritages — des zones de flou, de dissolution, où les choses ne sont jamais très claires. Mettre de la clarté là où Neptune préfère le brouillard est un acte de santé.",
    ]
  },
  {
    num: 9, name: "Philosophie, Voyage & Sens",
    icon: "◐", ruler: "♂ Mars",
    paras: [
      "La Maison 9 en Bélier avec Mars comme maître donne une quête de sens ardente et directe. Tu ne cherches pas la vérité en tournant autour — tu vas droit dedans. Tu as une foi en tes propres convictions qui peut sembler arrogante aux autres, mais qui est en fait une certitude intérieure viscérale : tu sais ce en quoi tu crois.",
      "Le voyage n'est pas pour toi un luxe ou un loisir — c'est une nécessité vitale. Te confronter à l'altérité radicale, à des modes de vie qui remettent en question tes présupposés, te nourrit d'une façon que rien d'autre ne peut remplacer. Tu reviens changé de chaque voyage important.",
      "Mars en Maison 9 peut aussi indiquer des conflits autour des idéologies et des croyances — des batailles philosophiques, des désaccords fondamentaux avec des systèmes de pensée établis. Ta façon d'explorer le sens est combative au sens noble : tu ne cherches pas le confort intellectuel, tu cherches la vérité qui résiste à tous les coups.",
    ]
  },
  {
    num: 10, name: "Vocation & Image Publique",
    icon: "△", ruler: "♀ Vénus",
    paras: [
      "La Maison 10 en Taureau avec Vénus comme maître donne une vocation liée à la beauté, à la valeur, à la construction durable. Ce que tu construis dans le monde doit durer — tu n'es pas fait pour les projets éphémères. Tu veux créer quelque chose de solide, de beau, qui ait une valeur réelle et persistante.",
      "Ton image publique est celle d'une personne fiable, esthétiquement sensible, qui sait ce qu'elle vaut. Pas arrogante, pas agressive — mais avec une solidité tranquille qui dit clairement : je suis là, je suis réel, mon travail a de la valeur. Les gens te perçoivent comme quelqu'un sur qui on peut compter.",
      "Vénus en Maison 10 indique aussi que ta vie professionnelle peut être liée aux arts, à l'esthétique, à la relation client, ou à tout domaine où il s'agit de créer quelque chose qui plait, qui touche, qui a de la beauté. Et d'une façon ou d'une autre, ta carrière sera marquée par ta capacité à valoriser — les objets, les idées, les personnes.",
    ]
  },
  {
    num: 11, name: "Amitiés, Groupes & Projets",
    icon: "⊙", ruler: "☿ Mercure",
    paras: [
      "La Maison 11 en Gémeaux donne un réseau social varié, intellectuellement stimulant, en perpétuel mouvement. Tu as des amis de toutes sortes, de tous milieux — certains connus depuis l'enfance, d'autres rencontrés par hasard à un tournant de vie. Ce qui les unit tous : ils ont quelque chose d'intéressant à dire.",
      "Mercure comme maître indique que tes amitiés les plus solides passent par la parole et l'échange intellectuel. Les amis avec qui tu ne peux pas vraiment parler — vraiment, de tout et de rien, avec une liberté totale — finissent par rester en surface. La conversation est ta façon de tisser de la proximité.",
      "Dans les projets collectifs, tu es souvent celui qui fait circuler l'information, qui connecte les gens entre eux, qui voit les synergies possibles. Tu n'es pas toujours le chef visible — mais tu es souvent l'intelligence relationnelle qui fait fonctionner le groupe.",
    ]
  },
  {
    num: 12, name: "L'Invisible & la Vie Intérieure",
    icon: "◑", ruler: "☽ Lune",
    paras: [
      "La Maison 12 en Cancer avec la Lune comme maître place ta vie intérieure la plus secrète sous le signe de l'eau et de la mémoire émotionnelle. Ce que tu portes dans tes profondeurs — et que tu ne montres presque à personne — est une sensibilité extraordinaire aux origines, aux racines, à tout ce qui a été transmis sans être dit.",
      "Tu as probablement des ressources émotionnelles invisibles très profondes — une capacité à prendre soin, à comprendre la souffrance des autres, à ressentir ce qui est non-dit dans une pièce. Ces dons sont réels mais tu peux les sous-estimer ou les cacher, parce qu'ils ne correspondent pas à l'image Lion que tu projettes.",
      "Le chemin de ta Maison 12 : intégrer cette sensibilité Cancer comme une force, pas comme une faiblesse à dissimuler. Ce que tu vis dans la solitude, dans le rêve, dans l'intimité absolue — cette vie intérieure liquide et profonde — est une partie essentielle de qui tu es. Ne la referme pas pour avoir l'air plus fort.",
    ]
  },
];

function HousesAll({ positions, asc }: { positions: FullPlanetPos[]; asc: number }) {
  const [activeHouse, setActiveHouse] = useState<number | null>(null);
  const houseOccupants: Record<number, FullPlanetPos[]> = {};
  for (let i = 1; i <= 12; i++) houseOccupants[i] = [];
  positions.forEach(p => { if (p.house >= 1 && p.house <= 12) houseOccupants[p.house].push(p); });
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
        return (
          <div key={h.num} style={{ marginBottom: "6px", border: `1px solid ${isOpen ? "rgba(212,175,55,0.35)" : "rgba(180,150,80,0.1)"}`, transition: "border-color 0.2s" }}>
            <button onClick={() => setActiveHouse(isOpen ? null : h.num)}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", background: isOpen ? "rgba(212,175,55,0.05)" : "transparent", border: "none", cursor: "pointer", padding: "13px 16px", textAlign: "left", transition: "background 0.2s" }}>
              <div style={{ width: "28px", height: "28px", border: "1px solid rgba(180,150,80,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: "10px", color: "#8a7040", fontFamily: "Georgia, serif" }}>{h.num}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "12px", color: isOpen ? "#D4AF37" : "#c0a060", letterSpacing: "0.5px" }}>{h.name}</div>
                <div style={{ fontSize: "10px", color: "#5a4a20", marginTop: "2px" }}>{sign.sym} {sign.name} · {h.ruler}</div>
              </div>
              <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                {occupants.map(p => <span key={p.planet.key} style={{ fontSize: "14px", color: p.planet.color }}>{p.planet.sym}</span>)}
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
                  <p key={i} style={{ color: "#c0ad80", lineHeight: "1.85", fontSize: "13.5px", marginBottom: "10px", marginTop: i === 0 && occupants.length === 0 ? "14px" : 0 }}>{para}</p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAISON 8 DÉVELOPPÉE
// ═══════════════════════════════════════════════
function House8({ positions }: { positions: FullPlanetPos[] }) {
  const h8 = positions.filter(p => p.house === 8);
  const sections = [
    {
      icon: "⬛", title: "Ce qu'est la Maison 8",
      content: [
        "La Maison 8 est la plus abyssale du zodiaque. Elle gouverne les eaux souterraines de l'existence — là où les choses se transforment, meurent, et renaissent. C'est la maison de Pluton et du Scorpion : la mort symbolique, la fusion totale, les héritages cachés, les tabous, et tout ce qui se passe dans l'obscurité.",
        "Elle révèle ta relation à ce que tu ne contrôles pas. Dans le confort tu peux simuler qui tu veux être. Mais quand quelque chose de fondamental s'effondre — une perte, une trahison, une transformation forcée — le masque tombe. Ce qui reste, c'est la Maison 8.",
      ]
    },
    {
      icon: "🌊", title: "Maison 8 en Poissons — La dissolution comme transformation",
      content: [
        "Avec Poissons sur la cuspide de ta Maison 8 et Neptune comme maître, tes grandes transformations ne passent pas par des ruptures nettes et chirurgicales. Elles passent par une dissolution progressive — comme du sel qui se dissout dans l'eau. Quelque chose qui semblait solide devient liquide, et dans cette liquidité une nouvelle forme émerge.",
        "C'est un mode de transformation difficile à vivre parce qu'il n'y a pas de moment précis où tu peux dire 'c'est fini, je suis passé à autre chose'. Le passage est lent, flou, souvent confus. Et pourtant c'est exactement ainsi que tu changes en profondeur — non pas par décision, mais par maturation invisible.",
        "La perméabilité psychique que Poissons en M8 donne peut être un don extraordinaire : tu ressens les courants profonds de l'autre, tu perçois ce qui n'est pas dit, tu touches quelque chose de réel dans les zones d'ombre. C'est aussi un risque de dissolution des frontières — absorber la souffrance de l'autre jusqu'à ne plus savoir où finit la sienne.",
      ]
    },
    {
      icon: "🔗", title: "Fusion et Vulnérabilité",
      content: [
        "En amour, la Maison 8 Poissons cherche une fusion mystique — pas seulement physique ou émotionnelle, mais presque spirituelle. Tu veux te fondre dans l'autre et sentir l'autre se fondre en toi. C'est l'une des aspirations les plus belles et les plus dangereuses qui soit.",
        "Le risque Poissons ici : idéaliser l'union au point de nier ce qui ne va pas. De voir dans l'autre ce que tu veux voir plutôt que ce qui est. La Maison 8 demande une honnêteté totale sur les dynamiques de pouvoir dans la relation — et Poissons peut avoir du mal à regarder certaines choses en face.",
        "La clé : la vulnérabilité choisie plutôt que subie. Se livrer parce qu'on l'a décidé, pas parce qu'on s'est laissé emporter. La dissolution peut être sacrée — mais elle doit rester consciente.",
      ]
    },
    {
      icon: "🔵", title: "Neptune — Le maître de tes profondeurs",
      content: [
        "Neptune comme maître de ta Maison 8 est une configuration rare et intense. Neptune gouverne l'invisible, le rêve, l'illusion, le sacré, la dissolution des frontières. Le fait qu'il préside à la zone de tes transformations les plus profondes indique que ta relation à la mort symbolique est fondamentalement spirituelle.",
        "Tu peux avoir une facilité naturelle à accéder à des états modifiés — méditation, rêve lucide, art, musique, certaines substances. Ces états ne sont pas pour toi de la fuite : ce sont des portes d'accès à quelque chose de réel que le quotidien cache. Ta vie intérieure a des dimensions que peu de gens soupçonnent.",
        "Neptune ici peut aussi indiquer une relation complexe aux héritages et à l'argent commun — des zones floues, des zones de confusion, où les choses ne sont jamais clairement délimitées. La clarté contractuelle n'est pas ton fort naturel dans cette zone. L'apprendre activement est un acte de santé.",
      ]
    },
    {
      icon: "⚡", title: "Le Stellium Capricorne en Maison 6 — La force cachée",
      content: [
        "Même si la Maison 8 est en Poissons, la configuration la plus puissante de ton thème est probablement le stellium Saturne-Uranus-Neptune en Capricorne en Maison 6. Ces trois planètes lentes réunies représentent une concentration d'énergie transformatrice dans la zone du travail quotidien, de la discipline et de la santé.",
        "Pour ta génération — et pour toi en particulier vu l'heure de naissance — ce stellium dit : tu es fait pour transformer des structures. Pas pour les maintenir telles quelles, pas pour les détruire aveuglément, mais pour les reconstruire sur des bases plus justes, plus authentiques. C'est une vocation générationnelle que ton thème individuel amplifie.",
        "La tension entre ce Capricorne discipliné en M6 et le Poissons dissolvant en M8 crée une psychologie fascinante : tu peux construire des structures rigoureuses ET les dissoudre quand elles ne servent plus. Tu sais bâtir ET lâcher. C'est une combinaison rare.",
      ]
    },
    {
      icon: "✦", title: "Ce que la Maison 8 te dit en résumé",
      content: [
        "Tes transformations profondes sont de nature neptunienne — fluides, invisibles, lentes, et totales. Tu ne traverses pas les épreuves comme un guerrier qui combat : tu les traverses comme l'eau qui finit par user la pierre. La patience et la profondeur sont tes armes.",
        "Le Soleil en Verseau en Maison 7 cherche la liberté et l'originalité dans ses partenariats. La Maison 8 Poissons cherche la fusion totale. Ces deux aspirations peuvent sembler contradictoires — mais elles se réconcilient dans une forme d'amour qui respecte la liberté de l'autre tout en atteignant une profondeur de connexion rare.",
        "Ton chemin : apprendre à dissoudre sans te perdre. À te laisser transformer sans perdre le fil de qui tu es. La Maison 8 Poissons est un initiatique de l'abandon — apprendre que lâcher n'est pas échouer, mais parfois la seule façon d'aller plus loin.",
      ]
    },
  ];

  return (
    <div style={{ maxWidth: "620px", margin: "0 auto", fontFamily: "Georgia, serif" }}>
      <div style={{ borderLeft: "2px solid #D4AF37", paddingLeft: "16px", marginBottom: "28px" }}>
        <h2 style={{ fontSize: "11px", letterSpacing: "4px", color: "#8a7040", fontWeight: "normal", margin: "0 0 6px 0" }}>INTERPRÉTATION APPROFONDIE</h2>
        <h1 style={{ fontSize: "20px", color: "#D4AF37", margin: 0, letterSpacing: "1px" }}>Maison VIII — La Dissolution & la Renaissance</h1>
        <p style={{ margin: "8px 0 0 0", color: "#7a6a40", fontSize: "11px", letterSpacing: "1px" }}>Poissons · Neptune · Eau Mutable</p>
      </div>
      {h8.length > 0 && (
        <div style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.2)", padding: "12px 16px", marginBottom: "24px" }}>
          <span style={{ fontSize: "10px", letterSpacing: "2px", color: "#8a7040" }}>PLANÈTES EN MAISON 8 · </span>
          {h8.map((p, i) => (
            <span key={p.planet.key} style={{ color: p.planet.color }}>{p.planet.sym} {p.planet.name} en {p.sign.name}{i < h8.length - 1 ? " · " : ""}</span>
          ))}
        </div>
      )}
      {sections.map(({ icon, title, content }) => (
        <div key={title} style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "13px", color: "#D4AF37", letterSpacing: "0.5px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "15px" }}>{icon}</span>{title}
          </h3>
          {content.map((para, i) => (
            <p key={i} style={{ color: "#c0ad80", lineHeight: "1.85", fontSize: "13.5px", marginBottom: "10px" }}>{para}</p>
          ))}
          <div style={{ height: "1px", background: "rgba(180,150,80,0.08)", margin: "16px 0 0 0" }} />
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════
export default function EmmaPage() {
  const [tab, setTab] = useState("wheel");

  // 15/02/1990 14h07 CET = 13h07 UT · Aix-en-Provence 43°31'N 5°27'E
  const JD = julianDay(1990, 2, 15, 13 + 7 / 60);
  const LAT = 43.5297, LON = 5.4474;
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

  const positions: FullPlanetPos[] = PLANETS.map(p => ({
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
        <style>{`body { margin: 0; } .tab-btn:hover { background: rgba(212,175,55,0.06); }`}</style>

        {/* Header */}
        <div style={{ textAlign: "center", padding: "28px 20px 20px", borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
          <div style={{ fontSize: "9px", letterSpacing: "5px", color: "#5a4a20", marginBottom: "8px" }}>CARTA NATALIS</div>
          <h1 style={{ margin: 0, fontSize: "22px", letterSpacing: "3px", fontWeight: "normal" }}>✦ CARTE NATALE ✦</h1>
          <p style={{ margin: "8px 0 0 0", color: "#7a6a40", fontSize: "11px", letterSpacing: "2px" }}>
            15 FÉVRIER 1990 · 14h07 CET · AIX-EN-PROVENCE · JD {JD.toFixed(2)}
          </p>
        </div>

        {/* Key summaries */}
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

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(212,175,55,0.12)" }}>
          {TABS.map(t => (
            <button key={t.key} className="tab-btn" onClick={() => setTab(t.key)}
              style={{ flex: 1, padding: "12px 8px", border: "none", cursor: "pointer", fontFamily: "Georgia, serif", background: tab === t.key ? "rgba(212,175,55,0.07)" : "transparent", color: tab === t.key ? "#D4AF37" : "#5a4a20", fontSize: "9px", letterSpacing: "2px", borderBottom: tab === t.key ? "1px solid #D4AF37" : "1px solid transparent", transition: "all 0.2s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: "24px 16px 40px" }}>
          {tab === "wheel" && (
            <div>
              <ChartWheel planets={positions.map(p => ({ planet: p.planet, lon: p.lon }))} asc={asc} mc={mc} />
              <div style={{ marginTop: "20px", background: "rgba(212,175,55,0.03)", border: "1px solid rgba(212,175,55,0.1)", padding: "14px", fontSize: "11px", color: "#7a6a40", lineHeight: "1.7" }}>
                <strong style={{ color: "#8a7040" }}>Système de maisons :</strong> Maisons égales (30°/maison depuis ASC) ·
                <strong style={{ color: "#8a7040" }}> Lieu :</strong> Aix-en-Provence 43°31&#39;N 5°27&#39;E ·
                <strong style={{ color: "#8a7040" }}> Heure UT :</strong> 13h07 (CET −1h) ·
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
