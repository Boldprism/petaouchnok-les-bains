"use client";

import { useState } from "react";

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
  return Math.floor(365.25*(y+4716)) + Math.floor(30.6001*(m+1)) + dy + utH/24 + B - 1524.5;
}

function sunLon(jd: number) {
  const T = (jd-2451545)/36525;
  const L0 = norm(280.46646 + 36000.76983*T + 0.0003032*T*T);
  const M  = norm(357.52911 + 35999.05029*T - 0.0001537*T*T);
  const Mr = toR(M);
  const C  = (1.914602-0.004817*T-0.000014*T*T)*Math.sin(Mr)
            +(0.019993-0.000101*T)*Math.sin(2*Mr)
            +0.000289*Math.sin(3*Mr);
  const omega = norm(125.04-1934.136*T);
  return norm(L0+C-0.00569-0.00478*Math.sin(toR(omega)));
}

function moonLon(jd: number) {
  const T=(jd-2451545)/36525;
  const L =218.3164477+481267.88123421*T-0.0015786*T*T+T*T*T/538841;
  const M =134.9633964+477198.8675055*T+0.0087414*T*T+T*T*T/69699;
  const Ms=357.5291092+35999.0502909*T-0.0001536*T*T;
  const D_=297.8501921+445267.1114034*T-0.0018819*T*T+T*T*T/545868;
  const F =93.2720950+483202.0175233*T-0.0036539*T*T;
  const Mr=toR(norm(M)),Msr=toR(norm(Ms)),Dr=toR(norm(D_)),Fr=toR(norm(F));
  const dL=6288774*Math.sin(Mr)+1274027*Math.sin(2*Dr-Mr)+658314*Math.sin(2*Dr)+
    213618*Math.sin(2*Mr)-185116*Math.sin(Msr)-114332*Math.sin(2*Fr)+
    58793*Math.sin(2*Dr-2*Mr)+57066*Math.sin(2*Dr-Msr-Mr)+53322*Math.sin(2*Dr+Mr)+
    45758*Math.sin(2*Dr-Msr)-40923*Math.sin(Msr-Mr)-34720*Math.sin(Dr)-
    30383*Math.sin(Msr+Mr)+15327*Math.sin(2*Dr-2*Fr)+10980*Math.sin(Mr-2*Fr)+
    10675*Math.sin(4*Dr-Mr)+10034*Math.sin(3*Mr)+8548*Math.sin(4*Dr-2*Mr)-
    7888*Math.sin(2*Dr+Msr-Mr)-6766*Math.sin(2*Dr+Msr)-5163*Math.sin(Dr-Mr)+
    4987*Math.sin(Dr+Msr)+4036*Math.sin(2*Dr-Msr+Mr)+3994*Math.sin(2*Dr+2*Mr)+
    3861*Math.sin(4*Dr)+3665*Math.sin(2*Dr-3*Mr)-2069*Math.sin(2*Msr)-
    1773*Math.sin(2*Dr+Mr-2*Fr)-1595*Math.sin(2*Dr+2*Fr)-892*Math.sin(3*Dr-Mr)-
    713*Math.sin(2*Msr-Mr)-487*Math.sin(Dr-2*Mr);
  return norm(L+dL/1000000);
}

function planetLon(jd: number, body: string) {
  const T=(jd-2451545)/36525;
  const data: Record<string, number[]>={
    mercury:[252.25084,149472.67411778,77.45779628,0.20563069],
    venus:  [181.97973, 58517.81538729,131.56370300,0.00677323],
    mars:   [355.45332, 19140.29934243,336.04084,   0.09341233],
    jupiter:[ 34.40438,  3034.74612775, 14.72847580,0.04849485],
    saturn: [ 49.94432,  1222.49362201, 92.86136063,0.05550825],
    uranus: [313.23218,   428.48202785,170.96424122,0.04629590],
    neptune:[304.87997,   218.45945325, 44.96476330,0.00898809],
    pluto:  [238.95600,   145.18000000,224.07000000,0.24877000],
  };
  const [L0,L1,w,e]=data[body];
  const L=norm(L0+L1*T);
  const M=toR(norm(L-w));
  const C=(2*e-e*e*e/4)*Math.sin(M)+(5/4)*e*e*Math.sin(2*M)+(13/12)*e*e*e*Math.sin(3*M);
  return norm(L+toD(C));
}

function gmst(jd: number) {
  const T=(jd-2451545)/36525;
  return norm(280.46061837+360.98564736629*(jd-2451545)+0.000387933*T*T-T*T*T/38710000);
}

function calcAscMC(jd: number, lat: number, lon: number) {
  const lst=norm(gmst(jd)+lon);
  const eps=toR(23.4393),latR=toR(lat),lstR=toR(lst);
  const y=-Math.cos(lstR);
  const x=Math.sin(lstR)*Math.cos(eps)+Math.tan(latR)*Math.sin(eps);
  let asc=norm(toD(Math.atan2(y,x)));
  if(lst>=0&&lst<180&&asc>=180) asc=norm(asc-180);
  if(lst>=180&&lst<360&&asc<180) asc=norm(asc+180);
  const mc=norm(toD(Math.atan2(Math.sin(lstR),Math.cos(lstR)*Math.cos(eps))));
  return {asc,mc};
}

// ═══════════════════════════════════
// ASTROLOGICAL DATA
// ═══════════════════════════════════
const SIGNS=[
  {name:"Bélier",    sym:"♈",el:"feu",  mod:"cardinal",ruler:"♂" ,color:"#C0392B"},
  {name:"Taureau",   sym:"♉",el:"terre",mod:"fixe",    ruler:"♀" ,color:"#8B6914"},
  {name:"Gémeaux",   sym:"♊",el:"air",  mod:"mutable", ruler:"☿" ,color:"#2471A3"},
  {name:"Cancer",    sym:"♋",el:"eau",  mod:"cardinal",ruler:"☽" ,color:"#1A6B8A"},
  {name:"Lion",      sym:"♌",el:"feu",  mod:"fixe",    ruler:"☉" ,color:"#C0392B"},
  {name:"Vierge",    sym:"♍",el:"terre",mod:"mutable", ruler:"☿" ,color:"#8B6914"},
  {name:"Balance",   sym:"♎",el:"air",  mod:"cardinal",ruler:"♀" ,color:"#2471A3"},
  {name:"Scorpion",  sym:"♏",el:"eau",  mod:"fixe",    ruler:"♇" ,color:"#1A6B8A"},
  {name:"Sagittaire",sym:"♐",el:"feu",  mod:"mutable", ruler:"♃" ,color:"#C0392B"},
  {name:"Capricorne",sym:"♑",el:"terre",mod:"cardinal",ruler:"♄" ,color:"#8B6914"},
  {name:"Verseau",   sym:"♒",el:"air",  mod:"fixe",    ruler:"⛢",color:"#2471A3"},
  {name:"Poissons",  sym:"♓",el:"eau",  mod:"mutable", ruler:"♆" ,color:"#1A6B8A"},
];
const EL_COLORS: Record<string,string>={feu:"#7a1a1a",terre:"#4a3510",air:"#0e2a44",eau:"#0a3035"};
const EL_TEXT: Record<string,string>  ={feu:"#FF7B7B",terre:"#C8A84B",air:"#7EC8E3",eau:"#4DD9C0"};
const signOf=(lon: number)=>{const i=Math.floor(norm(lon)/30)%12;return{...SIGNS[i],deg:norm(lon)%30,idx:i};};
const degStr=(d: number)=>{const g=Math.floor(d),m=Math.floor((d-g)*60);return`${g}°${String(m).padStart(2,"0")}'`;};

const PLANETS=[
  {key:"sun",    name:"Soleil", sym:"☉",color:"#FFD700"},
  {key:"moon",   name:"Lune",   sym:"☽",color:"#E0E0E0"},
  {key:"mercury",name:"Mercure",sym:"☿",color:"#B0C8DE"},
  {key:"venus",  name:"Vénus",  sym:"♀",color:"#FFB6C1"},
  {key:"mars",   name:"Mars",   sym:"♂",color:"#FF5733"},
  {key:"jupiter",name:"Jupiter",sym:"♃",color:"#DEB887"},
  {key:"saturn", name:"Saturne",sym:"♄",color:"#A0937D"},
  {key:"uranus", name:"Uranus", sym:"⛢",color:"#40E0D0"},
  {key:"neptune",name:"Neptune",sym:"♆",color:"#6B8DD6"},
  {key:"pluto",  name:"Pluton", sym:"♇",color:"#9B4444"},
];

// ═══════════════════════════════════
// WHEEL
// ═══════════════════════════════════
function lonToXY(lon: number,asc: number,r: number,cx: number,cy: number){const a=toR(norm(lon-asc));return{x:cx-r*Math.cos(a),y:cy-r*Math.sin(a)};}

interface PlanetEntry { planet: typeof PLANETS[number]; lon: number; displayLon?: number; realLon?: number; }

function spreadPositions(planets: PlanetEntry[]){
  const res=planets.map(p=>({...p,displayLon:p.lon,realLon:p.lon}));
  for(let it=0;it<20;it++){
    let ch=false;
    for(let i=0;i<res.length;i++)for(let j=i+1;j<res.length;j++){
      const g=norm(res[j].displayLon!-res[i].displayLon!),s=g>180?g-360:g;
      if(Math.abs(s)<18){const p=(18-Math.abs(s))/2;res[i].displayLon=norm(res[i].displayLon!-p);res[j].displayLon=norm(res[j].displayLon!+p);ch=true;}
    }
    if(!ch)break;
  }
  return res;
}

function ChartWheel({planets,asc,mc}: {planets: PlanetEntry[]; asc: number; mc: number}){
  const cx=200,cy=200,RO=188,RZ=160,RI=135,RP=108;
  const segs=SIGNS.map((sign,i)=>{
    const sA=toR(norm(i*30-asc)),eA=toR(norm((i+1)*30-asc));
    const path=`M${f(cx-RO*Math.cos(sA))},${f(cy-RO*Math.sin(sA))} A${RO},${RO} 0 0 0 ${f(cx-RO*Math.cos(eA))},${f(cy-RO*Math.sin(eA))} L${f(cx-RZ*Math.cos(eA))},${f(cy-RZ*Math.sin(eA))} A${RZ},${RZ} 0 0 1 ${f(cx-RZ*Math.cos(sA))},${f(cy-RZ*Math.sin(sA))}Z`;
    const mid=toR(norm(i*30+15-asc)),sr=(RO+RZ)/2;
    return{sign,path,sx:cx-sr*Math.cos(mid),sy:cy-sr*Math.sin(mid)};
  });
  const cusps=Array.from({length:12},(_,i)=>norm(asc+i*30));
  const sp=spreadPositions(planets);
  return(
    <svg viewBox="0 0 400 400" width="360" height="360" style={{display:"block",margin:"0 auto"}}>
      <defs>
        <radialGradient id="bgM" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0d1022"/><stop offset="100%" stopColor="#050710"/>
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={RO} fill="url(#bgM)"/>
      {[...Array(30)].map((_: unknown,i: number)=>{const a=(i/30)*360+i*7.3,r=RZ+10+(i%5)*5,p=lonToXY(a+(asc%360),asc,r,cx,cy);return<circle key={i} cx={p.x} cy={p.y} r="0.6" fill="rgba(255,255,255,0.25)"/>;})}
      {segs.map(({sign,path,sx,sy})=>(
        <g key={sign.name}>
          <path d={path} fill={EL_COLORS[sign.el]} stroke="rgba(180,150,80,0.2)" strokeWidth="0.3"/>
          <text x={f(sx)} y={f(sy)} textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="rgba(220,200,150,0.85)" fontFamily="Georgia,serif">{sign.sym}</text>
        </g>
      ))}
      <circle cx={cx} cy={cy} r={RO} fill="none" stroke="rgba(180,150,80,0.4)" strokeWidth="0.5"/>
      <circle cx={cx} cy={cy} r={RZ} fill="none" stroke="rgba(180,150,80,0.4)" strokeWidth="0.5"/>
      {Array.from({length:12},(_: unknown,i: number)=>{const a=toR(norm(i*30-asc));return<line key={i} x1={f(cx-RZ*Math.cos(a))} y1={f(cy-RZ*Math.sin(a))} x2={f(cx-RO*Math.cos(a))} y2={f(cy-RO*Math.sin(a))} stroke="rgba(180,150,80,0.5)" strokeWidth="0.5"/>;})}
      <circle cx={cx} cy={cy} r={RI} fill="url(#bgM)"/>
      {cusps.map((c,i)=>{const a=toR(norm(c-asc)),ax=i%3===0;return<line key={i} x1={f(cx-RI*Math.cos(a))} y1={f(cy-RI*Math.sin(a))} x2={f(cx-12*Math.cos(a))} y2={f(cy-12*Math.sin(a))} stroke={ax?"rgba(212,175,55,0.7)":"rgba(180,150,80,0.25)"} strokeWidth={ax?"1.2":"0.6"}/>;})}
      {Array.from({length:12},(_: unknown,i: number)=>{const p=lonToXY(norm(asc+(i+.5)*30),asc,RI-10,cx,cy);return<text key={i} x={f(p.x)} y={f(p.y)} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="rgba(180,150,80,0.55)" fontFamily="Georgia,serif">{i+1}</text>;})}
      <circle cx={cx} cy={cy} r={RI} fill="none" stroke="rgba(180,150,80,0.35)" strokeWidth="0.5"/>
      {(()=>{const p=lonToXY(mc,asc,RZ-5,cx,cy);return<text x={f(p.x)} y={f(p.y)} textAnchor="middle" dominantBaseline="middle" fontSize="6.5" fill="#D4AF37" fontFamily="Georgia,serif" fontWeight="bold">MC</text>;})()}
      <text x="8" y={cy} textAnchor="start" dominantBaseline="middle" fontSize="7" fill="#D4AF37" fontFamily="Georgia,serif">ASC</text>
      <text x="392" y={cy} textAnchor="end" dominantBaseline="middle" fontSize="7" fill="#D4AF37" fontFamily="Georgia,serif">DSC</text>
      {sp.map(({planet,displayLon,realLon})=>{const pr=lonToXY(realLon!,asc,RI-4,cx,cy),pd=lonToXY(displayLon!,asc,RP,cx,cy);return<line key={planet.key+"_l"} x1={f(pr.x)} y1={f(pr.y)} x2={f(pd.x)} y2={f(pd.y)} stroke={planet.color} strokeWidth="0.35" opacity="0.4"/>;})}
      {sp.map(({planet,displayLon})=>{const p=lonToXY(displayLon!,asc,RP,cx,cy);return(
        <g key={planet.key}>
          <circle cx={f(p.x)} cy={f(p.y)} r="9.5" fill="rgba(5,7,18,0.88)" stroke={planet.color} strokeWidth="0.8"/>
          <text x={f(p.x)} y={f(p.y)} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill={planet.color} fontFamily="Georgia,serif">{planet.sym}</text>
        </g>
      );})}
      <circle cx={cx} cy={cy} r="10" fill="#050710" stroke="rgba(212,175,55,0.5)" strokeWidth="0.8"/>
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="rgba(212,175,55,0.6)">✦</text>
    </svg>
  );
}

// ═══════════════════════════════════
// PLANET TABLE
// ═══════════════════════════════════
interface FullPos { planet: typeof PLANETS[number]; lon: number; sign: ReturnType<typeof signOf>; house: number; }

function PlanetTable({positions,asc,mc}: {positions: FullPos[]; asc: number; mc: number}){
  const aS=signOf(asc),mS=signOf(mc);
  return(
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px",fontFamily:"Georgia,serif"}}>
        <thead>
          <tr style={{borderBottom:"1px solid rgba(212,175,55,0.3)"}}>
            {["Astre","Signe","Degré","Maison","Élément","Modalité"].map(h=>(
              <th key={h} style={{padding:"8px 10px",textAlign:"left",color:"#8a7040",fontSize:"9px",letterSpacing:"2px",fontWeight:"normal"}}>{h.toUpperCase()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {positions.map(({planet,sign,house})=>(
            <tr key={planet.key} style={{borderBottom:"1px solid rgba(180,150,80,0.08)"}}>
              <td style={{padding:"9px 10px"}}><span style={{fontSize:"16px",marginRight:"8px",color:planet.color}}>{planet.sym}</span><span style={{color:"#c0b07a",fontSize:"12px"}}>{planet.name}</span></td>
              <td style={{padding:"9px 10px",color:"#d4c090"}}>{sign.sym} {sign.name}</td>
              <td style={{padding:"9px 10px",color:"#8a7a50",fontSize:"11px"}}>{degStr(sign.deg)}</td>
              <td style={{padding:"9px 10px"}}><span style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.15)",padding:"2px 6px",fontSize:"11px",color:"#d4af37"}}>M{house}</span></td>
              <td style={{padding:"9px 10px",color:EL_TEXT[sign.el],fontSize:"11px"}}>{sign.el}</td>
              <td style={{padding:"9px 10px",color:"#7a6a40",fontSize:"11px"}}>{sign.mod}</td>
            </tr>
          ))}
          {[{label:"Ascendant",icon:"↑",s:aS,h:"M1"},{label:"Milieu du Ciel",icon:"△",s:mS,h:"MC"}].map(({label,icon,s,h})=>(
            <tr key={label} style={{borderTop:"1px solid rgba(212,175,55,0.1)",borderBottom:"1px solid rgba(180,150,80,0.08)"}}>
              <td style={{padding:"9px 10px"}}><span style={{fontSize:"16px",marginRight:"8px",color:"#D4AF37"}}>{icon}</span><span style={{color:"#c0b07a",fontSize:"12px"}}>{label}</span></td>
              <td style={{padding:"9px 10px",color:"#d4c090"}}>{s.sym} {s.name}</td>
              <td style={{padding:"9px 10px",color:"#8a7a50",fontSize:"11px"}}>{degStr(s.deg)}</td>
              <td style={{padding:"9px 10px"}}><span style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.15)",padding:"2px 6px",fontSize:"11px",color:"#d4af37"}}>{h}</span></td>
              <td style={{padding:"9px 10px",color:EL_TEXT[s.el],fontSize:"11px"}}>{s.el}</td>
              <td style={{padding:"9px 10px",color:"#7a6a40",fontSize:"11px"}}>{s.mod}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════
// 12 MAISONS — Sagittaire ASC
// ═══════════════════════════════════
const HOUSE_DATA=[
  {
    num:1,name:"Identité & Apparence",icon:"◉",ruler:"♃ Jupiter",
    paras:[
      "Ton Ascendant Sagittaire donne une première impression ouverte, chaleureuse, et d'une liberté naturelle qui attire. Tu arrives quelque part et les gens sentent immédiatement quelque chose de généreux, de direct, d'un peu imprévisible. Tu n'es pas là pour jouer un rôle — tu es là pour vivre.",
      "Jupiter comme maître de ton Ascendant crée une personnalité fondamentalement optimiste et expansive. Les problèmes que les autres ressassent, toi tu cherches déjà la sortie, le prochain chapitre, l'angle qui change tout. Ce n'est pas de la naïveté : c'est une foi profonde que les choses finissent par s'arranger — et souvent, grâce à toi, elles s'arrangent.",
      "La difficulté de cet Ascendant : la promesse trop large, l'engagement qui s'essouffle, le projet entamé avec enthousiasme et abandonné quand la réalité quotidienne ralentit l'élan. Apprendre à finir ce qu'on commence, à honorer la durée autant que l'élan — c'est l'un des grands travaux de cette configuration.",
    ]
  },
  {
    num:2,name:"Argent & Valeurs Profondes",icon:"◈",ruler:"♄ Saturne",
    paras:[
      "La Maison 2 en Capricorne avec Saturne comme maître donne un rapport à l'argent discipliné et à long terme. Tu n'es pas du genre à dépenser impulsivement — tu construis, tu accumules, tu planifies sur la durée. La sécurité matérielle est quelque chose que tu prends très au sérieux, même si ton Ascendant Sagittaire donne une image plus libre et aventurière.",
      "Tes valeurs profondes sont capricorniennes : le travail réel, la durée, l'intégrité, la qualité sur la quantité. Ce que tu ne peux pas pardonner, c'est la paresse, le raccourci, le résultat superficiel. Tu as un sens instinctif de la valeur réelle des choses — et les illusions te tombent rapidement.",
      "La tension productive de ce thème : l'ASC Sagittaire veut partir à l'aventure et improviser, mais ta M2 Capricorne a besoin de bases solides pour le faire sereinement. Tu fonctionnes le mieux quand tu as bâti un fondement — financier, professionnel, relationnel — qui te donne la liberté de prendre des risques.",
    ]
  },
  {
    num:3,name:"Communication & Pensée — LE STELLIUM",icon:"◇",ruler:"⛢ Uranus",
    paras:[
      "La Maison 3 en Verseau est la zone la plus extraordinaire de ton thème. C'est ici que se concentre le stellium Verseau exceptionnel de ta naissance : Soleil, Jupiter, Uranus — et très probablement Mercure et Vénus — tous regroupés dans cette maison de la pensée, de la communication, et de l'intelligence.",
      "Ce stellium dit quelque chose de précis : ton intelligence est le cœur de qui tu es. Pas l'intelligence scolaire ou académique — l'intelligence intuitive, synthétique, visionnaire. Tu vois des connexions que les autres ne voient pas. Tu penses en systèmes, en grandes structures, en possibilités non encore réalisées. Et tu peux le transmettre — avec un naturel, une clarté, et une originalité qui laissent une trace.",
      "Uranus dans cette maison renforce l'originalité de ta pensée : tu ne penses pas comme tout le monde, et ce n'est pas un défaut à corriger. C'est le cœur de ta contribution. Jupiter amplifie tout — la curiosité, la générosité intellectuelle, la capacité à inspirer. Mercure donne la précision du langage. Vénus donne le sens de la beauté dans les idées.",
    ]
  },
  {
    num:4,name:"Foyer, Racines & Famille",icon:"◎",ruler:"♆ Neptune",
    paras:[
      "La Maison 4 en Poissons avec Neptune comme maître place tes racines dans un registre de sensibilité, de spiritualité, et peut-être de flou. Les fondations familiales n'étaient pas toujours claires ou solides — il y avait peut-être de l'idéalisme, une certaine dissolution des limites, des non-dits émotionnels profonds.",
      "Neptune en M4 peut aussi indiquer une enfance marquée par une beauté particulière — artistique, musicale, sensible — et une capacité à ressentir les états d'âme familiaux avec une précision qui débordait les mots. Tu savais des choses que personne n'avait dites.",
      "Ton rapport au foyer est profondément spirituel : tu as besoin que l'endroit où tu vis soit un sanctuaire — pas au sens formel, mais au sens d'un espace où tu peux être entièrement toi-même, sans performance. La beauté de l'espace compte, l'atmosphère compte encore plus.",
    ]
  },
  {
    num:5,name:"Créativité, Amour & Plaisir",icon:"✦",ruler:"♂ Mars",
    paras:[
      "La Maison 5 en Bélier avec Mars comme maître donne une créativité ardente, directe, impulsive. Quand tu crées, tu y vas — sans trop réfléchir, sans trop préparer. La première impulsion est souvent la bonne. Et quand tu aimes, c'est avec la même impétuosité : tu te jettes, tu prends le risque, tu assumes les conséquences.",
      "En amour, tu es attiré par l'énergie, le courage, quelqu'un qui sait ce qu'il veut. Les personnalités molles ou indécises te frustrent rapidement. Tu veux quelqu'un qui te tient tête, qui a sa propre feu intérieur — pas quelqu'un qui se contente de suivre le tien.",
      "Mars en M5 donne aussi une compétitivité joyeuse dans les domaines de plaisir et de création — un besoin d'être le premier, d'être original, de ne pas refaire ce que les autres ont déjà fait. Ta signature créatrice est pionnière. Ce que tu produis a toujours quelque chose de neuf.",
    ]
  },
  {
    num:6,name:"Travail, Santé & Quotidien",icon:"⊕",ruler:"♀ Vénus",
    paras:[
      "La Maison 6 en Taureau avec Vénus comme maître donne un rapport au travail quotidien qui a besoin de beauté et de sens tangible. Tu travailles mieux dans des environnements agréables — le confort, l'esthétique, le rythme posé. Un cadre laid ou stressant te coûte énormément d'énergie.",
      "Vénus en M6 indique aussi une aptitude naturelle pour tout ce qui implique créer de la valeur, du beau, de l'agréable — arts, design, cuisine, relation client, tout ce qui transforme quelque chose en quelque chose de mieux. Dans ton quotidien, tu as un talent pour améliorer, embellir, rendre plus harmonieux.",
      "Ta santé est fortement liée à ton rapport au plaisir. L'excès — alimentaire, sensoriel, de confort — peut être un défi. Mais quand tu trouves l'équilibre entre plaisir et discipline, tu as une vitalité remarquable. Le corps pour toi est un instrument de vie, pas une contrainte.",
    ]
  },
  {
    num:7,name:"Partenariats & Relations Clés",icon:"⊗",ruler:"☿ Mercure",
    paras:[
      "La Maison 7 en Gémeaux avec Mercure comme maître parle de partenariats construits sur l'échange intellectuel, la communication, la légèreté de l'esprit. Tu es attiré par des partenaires avec qui la conversation ne s'arrête jamais — qui rebondissent, qui surprennent, qui apportent de nouvelles perspectives.",
      "Mercure en M7 peut aussi indiquer plusieurs partenariats significatifs dans ta vie — pas nécessairement simultanément, mais successivement. Chaque partenaire apporte quelque chose de différent, t'ouvre à un registre nouveau. Tes grandes rencontres te changent intellectuellement autant qu'émotionnellement.",
      "Le défi de cette M7 Gémeaux : la profondeur. Il peut être tentant de rester dans la légèreté, dans l'intellectuel, en évitant les zones plus intenses et vulnérables d'une relation. Ton stellium Verseau en M3 t'attire vers les idées — mais tes relations les plus profondes demandent plus que ça.",
    ]
  },
  {
    num:8,name:"Transformation & Abîme",icon:"⬛",ruler:"☽ Lune",
    paras:[
      "La Maison 8 en Cancer avec la Lune comme maître place tes transformations profondes dans le registre de l'émotionnel, du familial, et de la mémoire. Tes grandes 'morts symboliques' passent par les liens — la perte d'un attachement, une rupture familiale, une trahison émotionnelle fondamentale.",
      "La Lune en M8 Cancer dit que tes transformations les plus profondes ne sont pas intellectuelles — même si ton stellium Verseau adorerait les traiter comme telles. Elles sont viscérales, corporelles, émotionnelles. Elles passent par les entrailles, pas par la tête.",
      "Ce que tu portes dans cette maison, c'est souvent une blessure liée à la sécurité émotionnelle — un sentiment originel de ne pas avoir été suffisamment contenu, protégé, nourri. La guérison passe par apprendre à te donner à toi-même ce que tu as cherché chez les autres.",
    ]
  },
  {
    num:9,name:"Philosophie, Voyage & Sens",icon:"◐",ruler:"☉ Soleil",
    paras:[
      "La Maison 9 en Lion avec le Soleil comme maître — et compte tenu du fait que ton Soleil natal est en Maison 3 — crée une tension fertile : tu penses de façon originale et collective (M3 Verseau), mais ton rapport au sens est royal, personnel, solaire (M9 Lion). Tu veux une philosophie qui te ressemble, une vision du monde qui soit aussi une expression de qui tu es.",
      "Tu as probablement une façon de parler de tes convictions avec une autorité naturelle qui convainc — non pas parce que tu l'imposes, mais parce que tu y crois vraiment et que ça se sent. Les gens t'écoutent quand tu parles de ce en quoi tu crois.",
      "Le voyage pour toi est une expérience de grandeur — tu ne voyages pas pour les photos, tu voyages pour être transformé. Les cultures qui te marquent sont celles qui ont une noblesse, une profondeur historique, quelque chose d'épique. Tu reviens de tes grands voyages avec une compréhension élargie de toi-même.",
    ]
  },
  {
    num:10,name:"Vocation & Image Publique",icon:"△",ruler:"☿ Mercure",
    paras:[
      "La Maison 10 en Vierge avec Mercure comme maître donne une image publique précise, fiable, analytique. Dans le monde professionnel, tu es perçu comme quelqu'un de compétent, de rigoureux, attentif aux détails. Ce qu'on te confie, on sait que ce sera bien fait.",
      "Mais ton MC flottant en Verseau (distinct de la cuspide M10 en Vierge) indique une vocation plus large que l'image Vierge ne le suggère : tu es fait pour apporter de l'innovation, de la vision, quelque chose de neuf dans ce que tu construis professionnellement. La précision Vierge est ton outil — la vision Verseau est ta direction.",
      "Cette combinaison est rare et puissante : tu peux penser grand ET exécuter avec soin. Beaucoup de visionnaires ne savent pas atterrir. Beaucoup de techniciens ne savent pas voir loin. Toi tu peux faire les deux — et c'est une combinaison que le monde a besoin.",
    ]
  },
  {
    num:11,name:"Amitiés, Groupes & Projets",icon:"⊙",ruler:"♀ Vénus",
    paras:[
      "La Maison 11 en Balance avec Vénus comme maître donne un réseau social harmonieux, esthétiquement choisi. Tu gravites vers des gens qui ont du goût, de l'élégance, un sens de l'équilibre. Tes amis les plus proches sont souvent beaux — pas nécessairement physiquement, mais dans leur façon d'être, de penser, d'habiter l'espace.",
      "Vénus en M11 indique aussi une facilité à tisser des liens dans des contextes créatifs ou artistiques — tu rencontres tes meilleurs amis dans des cadres qui ont quelque chose de beau. Et dans tes amitiés, tu apportes une loyauté douce, une capacité à écouter, un sens du compromis qui évite les ruptures inutiles.",
      "Dans les projets collectifs, tu es un médiateur naturel — quelqu'un qui voit les deux côtés, qui sait formuler les choses de façon à ce que tout le monde se sente entendu. Pas toujours le chef visible, mais souvent celui sans qui l'équipe ne tient pas ensemble.",
    ]
  },
  {
    num:12,name:"L'Invisible & la Vie Intérieure",icon:"◑",ruler:"♇ Pluton",
    paras:[
      "La Maison 12 en Scorpion avec Pluton comme maître place ta vie intérieure la plus secrète dans les profondeurs abyssales. Ce que tu portes dans tes profondeurs — et que tu ne montres presque à personne — est d'une intensité que peu de gens soupçonnent derrière ta façade Sagittaire lumineuse.",
      "Il y a une face cachée dans ton thème que tu gères souvent seul — une intensité émotionnelle, des peurs profondes, peut-être des blessures liées au pouvoir ou à la trahison. Cette face Scorpion en M12 n'est pas un problème : c'est une source de puissance immense, mais elle demande à être reconnue plutôt qu'enterrée.",
      "Pluton en M12 donne un accès privilégié aux zones d'ombre de l'existence — une compréhension profonde de la psychologie humaine, des motivations cachées, des dynamiques de pouvoir souterraines. Ce que tu perçois dans le silence, ce que tu sais sans qu'on te l'ait dit — c'est réel. Et c'est l'une de tes ressources les plus précieuses.",
    ]
  },
];

function HousesAll({positions,asc}: {positions: FullPos[]; asc: number}){
  const [active,setActive]=useState<number|null>(null);
  const occ: Record<number,FullPos[]>={};for(let i=1;i<=12;i++)occ[i]=[];
  positions.forEach(p=>{if(p.house>=1&&p.house<=12)occ[p.house].push(p);});
  const hSign=(num: number)=>signOf(norm(asc+(num-1)*30));
  return(
    <div style={{maxWidth:"660px",margin:"0 auto",fontFamily:"Georgia,serif"}}>
      <div style={{borderLeft:"2px solid #D4AF37",paddingLeft:"16px",marginBottom:"28px"}}>
        <h2 style={{fontSize:"11px",letterSpacing:"4px",color:"#8a7040",fontWeight:"normal",margin:"0 0 6px 0"}}>SYSTÈME DE MAISONS ÉGALES</h2>
        <h1 style={{fontSize:"20px",color:"#D4AF37",margin:0,letterSpacing:"1px"}}>Les Douze Maisons</h1>
        <p style={{margin:"8px 0 0 0",color:"#7a6a40",fontSize:"11px"}}>Cliquer sur une maison pour lire son interprétation</p>
      </div>
      {HOUSE_DATA.map(h=>{
        const sign=hSign(h.num),occ2=occ[h.num]||[],isOpen=active===h.num;
        return(
          <div key={h.num} style={{marginBottom:"6px",border:`1px solid ${isOpen?"rgba(212,175,55,0.35)":"rgba(180,150,80,0.1)"}`,transition:"border-color 0.2s"}}>
            <button onClick={()=>setActive(isOpen?null:h.num)}
              style={{width:"100%",display:"flex",alignItems:"center",gap:"12px",background:isOpen?"rgba(212,175,55,0.05)":"transparent",border:"none",cursor:"pointer",padding:"13px 16px",textAlign:"left",transition:"background 0.2s"}}>
              <div style={{width:"28px",height:"28px",border:"1px solid rgba(180,150,80,0.35)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:"10px",color:"#8a7040",fontFamily:"Georgia,serif"}}>{h.num}</span>
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:"12px",color:isOpen?"#D4AF37":"#c0a060",letterSpacing:"0.5px"}}>{h.name}</div>
                <div style={{fontSize:"10px",color:"#5a4a20",marginTop:"2px"}}>{sign.sym} {sign.name} · {h.ruler}</div>
              </div>
              <div style={{display:"flex",gap:"4px",flexShrink:0}}>
                {occ2.map(p=><span key={p.planet.key} style={{fontSize:"14px",color:p.planet.color}}>{p.planet.sym}</span>)}
              </div>
              <span style={{color:"#5a4a20",fontSize:"10px",flexShrink:0,display:"inline-block",transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▼</span>
            </button>
            {isOpen&&(
              <div style={{padding:"4px 16px 20px 16px",borderTop:"1px solid rgba(180,150,80,0.1)"}}>
                {occ2.length>0&&(
                  <div style={{display:"flex",gap:"8px",flexWrap:"wrap",margin:"14px 0 16px 0"}}>
                    {occ2.map(p=>(
                      <span key={p.planet.key} style={{background:"rgba(212,175,55,0.05)",border:"1px solid rgba(212,175,55,0.15)",padding:"3px 10px",fontSize:"11px"}}>
                        <span style={{color:p.planet.color}}>{p.planet.sym} {p.planet.name}</span>
                        <span style={{color:"#5a4a20"}}> · {p.sign.name} {degStr(p.sign.deg)}</span>
                      </span>
                    ))}
                  </div>
                )}
                {h.paras.map((para,i)=>(
                  <p key={i} style={{color:"#c0ad80",lineHeight:"1.85",fontSize:"13.5px",marginBottom:"10px",marginTop:i===0&&occ2.length===0?"14px":0}}>{para}</p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════
// MAISON 8 — Cancer / Lune
// ═══════════════════════════════════
function House8({positions}: {positions: FullPos[]}){
  const h8=positions.filter(p=>p.house===8);
  const sections=[
    {
      icon:"⬛",title:"Ce qu'est la Maison 8",
      content:[
        "La Maison 8 gouverne ce que la vie t'impose plutôt que ce que tu choisis. Pertes, transformations forcées, fusion avec l'autre, héritages cachés, tabous, mort symbolique. C'est la zone qui révèle ce que tu es vraiment — pas dans le confort ou la performance, mais dans les moments où tout s'effondre et qu'il faut traverser quand même.",
        "Dans un thème dominé par l'air et le feu — Sagittaire ASC, stellium Verseau, Bélier en M5 — la Maison 8 Cancer est l'endroit où toute cette brillance intellectuelle doit descendre dans quelque chose de plus profond, de plus vulnérable, de plus réel.",
      ]
    },
    {
      icon:"🌊",title:"Maison 8 en Cancer — La transformation par l'émotionnel",
      content:[
        "Avec Cancer sur la cuspide de ta Maison 8 et la Lune comme maître, tes transformations profondes passent par les émotions et les liens. Pas par la logique — ton stellium Verseau voudrait bien, mais ça ne marche pas comme ça ici. Tes grandes 'morts symboliques' arrivent quand quelque chose de fondamental dans tes attachements se brise : une relation qui se termine, un lien familial qui se transforme, une sécurité émotionnelle qui s'effondre.",
        "Cancer en M8 dit aussi que ta relation à la perte est profondément viscérale. Tu n'oublies pas. Ce que tu as aimé et perdu laisse une empreinte qui reste — pas comme une blessure ouverte, mais comme une cicatrice qui fait partie de toi. Et chaque fois que tu traverses quelque chose de difficile dans les relations, tu te transformes de l'intérieur d'une façon que les mots ne captent pas bien.",
        "Ces transformations peuvent être lentes, invisibles de l'extérieur. Les gens autour de toi peuvent ne pas voir que tu es en train de traverser quelque chose d'intense — parce que ton Ascendant Sagittaire tend à maintenir une façade optimiste et lumineuse. Mais en dessous, quelque chose se reconstruit.",
      ]
    },
    {
      icon:"🌙",title:"La Lune — Maître de tes profondeurs",
      content:[
        "La Lune comme maître de ta Maison 8 crée un lien direct entre ton monde émotionnel quotidien et tes zones de transformation les plus profondes. Selon les phases lunaires — et tes propres cycles intérieurs — tu peux traverser des phases d'ouverture totale et de fermeture complète. Ce n'est pas de l'instabilité : c'est un rythme naturel que tu dois apprendre à honorer plutôt qu'à combattre.",
        "La Lune en M8 peut aussi indiquer des transformations liées aux figures féminines de ta vie — mère, grand-mère, sœur. Les dynamiques héritées du côté maternel ont un poids dans ta psychologie profonde. Certaines de tes peurs les plus viscérales viennent de là. Et certaines de tes plus grandes forces aussi.",
        "Le don de cette configuration : une empathie profonde pour ce que les autres traversent dans leurs propres zones d'ombre. Tu sais, sans qu'on te l'explique, quand quelqu'un est en train de traverser quelque chose de difficile. Et cette compréhension instinctive peut faire de toi une présence précieuse pour ceux qui souffrent.",
      ]
    },
    {
      icon:"🔗",title:"Le Paradoxe — Stellium Verseau vs M8 Cancer",
      content:[
        "C'est la tension centrale de ton thème. Le stellium Verseau en M3 vit dans la tête — les idées, les connexions intellectuelles, la liberté de pensée, le détachement rationnel. La M8 Cancer vit dans les entrailles — les émotions primitives, le besoin de sécurité, l'attachement viscéral, la peur de l'abandon.",
        "Tu peux avoir tendance à intellectualiser ce que tu ressens — à transformer une blessure émotionnelle en analyse, une peur en concept, une douleur en théorie. C'est une forme d'intelligence réelle. Mais c'est aussi une façon d'éviter de ressentir vraiment. Le Verseau monte dans la tête. Le Cancer veut descendre dans le corps.",
        "La réconciliation de ces deux tendances est l'un des grands travaux de ta vie : apprendre à penser ET à ressentir, à être brillant ET vulnérable, à avoir des idées sur tout ET à ne pas savoir quoi faire de ta propre douleur. Ces deux capacités ne s'excluent pas. Mais elles demandent à être cultivées séparément avant d'être intégrées.",
      ]
    },
    {
      icon:"⚡",title:"Sexualité, Fusion et Sécurité",
      content:[
        "En amour, ta M8 Cancer demande une sécurité émotionnelle absolue pour s'ouvrir vraiment. Tu peux donner une impression de légèreté et de liberté (Sagittaire ASC, Verseau M3), mais dans l'intimité profonde, tu as besoin d'être sûr que l'autre ne va pas partir. Cette peur de l'abandon est discrète mais réelle.",
        "La sexualité pour toi n'est pas anodine. En M8 Cancer, c'est un acte d'appartenance — une façon de nourrir et d'être nourri, de protéger et d'être protégé. Le détachement intellectuel Verseau peut parfois interférer avec cette profondeur : tu peux te retrouver dans des situations où tu rationaliseras ce qui devrait juste être ressenti.",
        "Ce que tu cherches dans les relations profondes : être vu dans ta vulnérabilité ET en sécurité. Pas juste admiré pour ton intelligence ou ta lumière — mais tenu dans ta fragilité. C'est rare. Mais quand tu le trouves, tu es capable d'une loyauté et d'une profondeur de connexion que peu de gens soupçonnent.",
      ]
    },
    {
      icon:"✦",title:"Ce que la Maison 8 te dit en résumé",
      content:[
        "Ton thème est brillant en surface — le stellium Verseau rayonne, l'Ascendant Sagittaire éclaire, Jupiter amplifie tout. Mais tes transformations les plus profondes ne passent pas par l'intellect ou l'aventure. Elles passent par l'émotionnel, l'intime, le vulnérable. C'est là que tu grandis vraiment.",
        "La M8 Cancer est une invitation à descendre — pas à te perdre dans les profondeurs, mais à ne pas rester uniquement dans les hauteurs. Ta vie la plus intense, la plus réelle, se passe dans les zones où tu ne sais plus si tu dois analyser ou simplement ressentir. Choisis de ressentir.",
        "Chaque transformation profonde que tu traverses te rapproche d'une forme de maturité émotionnelle que le brillant intellectuel ne peut pas donner seul. Ce que tu deviens après chaque perte, chaque deuil, chaque rupture de sécurité — c'est quelqu'un de plus entier, de plus réel, de plus profondément lui-même.",
      ]
    },
  ];

  return(
    <div style={{maxWidth:"620px",margin:"0 auto",fontFamily:"Georgia,serif"}}>
      <div style={{borderLeft:"2px solid #D4AF37",paddingLeft:"16px",marginBottom:"28px"}}>
        <h2 style={{fontSize:"11px",letterSpacing:"4px",color:"#8a7040",fontWeight:"normal",margin:"0 0 6px 0"}}>INTERPRÉTATION APPROFONDIE</h2>
        <h1 style={{fontSize:"20px",color:"#D4AF37",margin:0,letterSpacing:"1px"}}>Maison VIII — L'Eau sous la Lumière</h1>
        <p style={{margin:"8px 0 0 0",color:"#7a6a40",fontSize:"11px",letterSpacing:"1px"}}>Cancer · Lune · Eau Cardinal</p>
      </div>
      {h8.length>0&&(
        <div style={{background:"rgba(212,175,55,0.05)",border:"1px solid rgba(212,175,55,0.2)",padding:"12px 16px",marginBottom:"24px"}}>
          <span style={{fontSize:"10px",letterSpacing:"2px",color:"#8a7040"}}>PLANÈTES EN MAISON 8 · </span>
          {h8.map((p,i)=>(
            <span key={p.planet.key} style={{color:p.planet.color}}>{p.planet.sym} {p.planet.name} en {p.sign.name}{i<h8.length-1?" · ":""}</span>
          ))}
        </div>
      )}
      {sections.map(({icon,title,content})=>(
        <div key={title} style={{marginBottom:"32px"}}>
          <h3 style={{fontSize:"13px",color:"#D4AF37",letterSpacing:"0.5px",marginBottom:"12px",display:"flex",alignItems:"center",gap:"8px"}}>
            <span style={{fontSize:"15px"}}>{icon}</span>{title}
          </h3>
          {content.map((para,i)=>(
            <p key={i} style={{color:"#c0ad80",lineHeight:"1.85",fontSize:"13.5px",marginBottom:"10px"}}>{para}</p>
          ))}
          <div style={{height:"1px",background:"rgba(180,150,80,0.08)",margin:"16px 0 0 0"}}/>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════
export default function NadirPage(){
  const [tab,setTab]=useState("wheel");

  // 23/01/1997 12h00 CET = 11h00 UT · Montélimar 44°33'N 4°45'E
  const JD=julianDay(1997,1,23,11.0);
  const LAT=44.5575, LON=4.7503;
  const {asc,mc}=calcAscMC(JD,LAT,LON);

  const rawLons: Record<string,number>={
    sun:    sunLon(JD),
    moon:   moonLon(JD),
    mercury:planetLon(JD,"mercury"),
    venus:  planetLon(JD,"venus"),
    mars:   planetLon(JD,"mars"),
    jupiter:planetLon(JD,"jupiter"),
    saturn: planetLon(JD,"saturn"),
    uranus: planetLon(JD,"uranus"),
    neptune:planetLon(JD,"neptune"),
    pluto:  planetLon(JD,"pluto"),
  };

  const positions: FullPos[]=PLANETS.map(p=>({
    planet:p,
    lon:rawLons[p.key],
    sign:signOf(rawLons[p.key]),
    house:Math.floor(norm(rawLons[p.key]-asc)/30)+1,
  }));

  const sunSign=signOf(rawLons.sun),moonSign=signOf(rawLons.moon);
  const ascSign=signOf(asc),mcSign=signOf(mc);

  const aquariusPlanets=positions.filter(p=>p.sign.name==="Verseau").map(p=>p.planet.sym);

  const TABS=[
    {key:"wheel", label:"THÈME NATAL"},
    {key:"planets",label:"PLANÈTES"},
    {key:"houses", label:"12 MAISONS"},
    {key:"house8", label:"MAISON VIII"},
  ];

  return(
    <div style={{position:"fixed",inset:0,overflowY:"auto",background:"#06070f"}}>
      <div style={{background:"#06070f",minHeight:"100%",color:"#d4af37",fontFamily:"Georgia,serif"}}>
        <style>{`body{margin:0;}.tab-btn:hover{background:rgba(212,175,55,0.06);}`}</style>

        <div style={{textAlign:"center",padding:"28px 20px 20px",borderBottom:"1px solid rgba(212,175,55,0.12)"}}>
          <div style={{fontSize:"9px",letterSpacing:"5px",color:"#5a4a20",marginBottom:"8px"}}>CARTA NATALIS</div>
          <h1 style={{margin:0,fontSize:"22px",letterSpacing:"3px",fontWeight:"normal"}}>✦ CARTE NATALE ✦</h1>
          <p style={{margin:"8px 0 0 0",color:"#7a6a40",fontSize:"11px",letterSpacing:"2px"}}>
            23 JANVIER 1997 · 12h00 CET · MONTÉLIMAR · JD {JD.toFixed(2)}
          </p>
          {aquariusPlanets.length>=3&&(
            <div style={{display:"inline-block",marginTop:"10px",background:"rgba(64,120,210,0.08)",border:"1px solid rgba(64,120,210,0.25)",padding:"5px 14px",fontSize:"10px",letterSpacing:"1.5px",color:"#7EC8E3"}}>
              ✦ STELLIUM VERSEAU · {aquariusPlanets.join(" ")}
            </div>
          )}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderBottom:"1px solid rgba(212,175,55,0.12)"}}>
          {[
            {label:"SOLEIL",   icon:"☉",value:sunSign.name, deg:degStr(sunSign.deg), color:"#FFD700"},
            {label:"LUNE",     icon:"☽",value:moonSign.name,deg:degStr(moonSign.deg),color:"#E0E0E0"},
            {label:"ASCENDANT",icon:"↑",value:ascSign.name, deg:degStr(ascSign.deg), color:"#D4AF37"},
            {label:"M.DU CIEL",icon:"△",value:mcSign.name,  deg:degStr(mcSign.deg),  color:"#D4AF37"},
          ].map(({label,icon,value,deg,color})=>(
            <div key={label} style={{padding:"14px 8px",textAlign:"center",borderRight:"1px solid rgba(212,175,55,0.08)"}}>
              <div style={{fontSize:"9px",letterSpacing:"1.5px",color:"#5a4a20",marginBottom:"4px"}}>{label}</div>
              <div style={{fontSize:"20px",color,lineHeight:"1"}}>{icon}</div>
              <div style={{fontSize:"12px",color:"#d4c090",marginTop:"4px"}}>{value}</div>
              <div style={{fontSize:"9px",color:"#5a4a20",marginTop:"2px"}}>{deg}</div>
            </div>
          ))}
        </div>

        <div style={{display:"flex",borderBottom:"1px solid rgba(212,175,55,0.12)"}}>
          {TABS.map(t=>(
            <button key={t.key} className="tab-btn" onClick={()=>setTab(t.key)}
              style={{flex:1,padding:"12px 8px",border:"none",cursor:"pointer",fontFamily:"Georgia,serif",background:tab===t.key?"rgba(212,175,55,0.07)":"transparent",color:tab===t.key?"#D4AF37":"#5a4a20",fontSize:"9px",letterSpacing:"2px",borderBottom:tab===t.key?"1px solid #D4AF37":"1px solid transparent",transition:"all 0.2s"}}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{padding:"24px 16px 40px"}}>
          {tab==="wheel"&&(
            <div>
              <ChartWheel planets={positions.map(p=>({planet:p.planet,lon:p.lon}))} asc={asc} mc={mc}/>
              <div style={{marginTop:"20px",background:"rgba(212,175,55,0.03)",border:"1px solid rgba(212,175,55,0.1)",padding:"14px",fontSize:"11px",color:"#7a6a40",lineHeight:"1.7"}}>
                <strong style={{color:"#8a7040"}}>Système de maisons :</strong> Maisons égales (30°/maison depuis ASC) ·
                <strong style={{color:"#8a7040"}}> Lieu :</strong> Montélimar 44°33&#39;N 4°45&#39;E ·
                <strong style={{color:"#8a7040"}}> Heure UT :</strong> 11h00 (CET −1h) ·
                <strong style={{color:"#8a7040"}}> Algorithmes :</strong> Jean Meeus, Astronomical Algorithms
              </div>
            </div>
          )}
          {tab==="planets"&&<PlanetTable positions={positions} asc={asc} mc={mc}/>}
          {tab==="houses"&&<HousesAll positions={positions} asc={asc}/>}
          {tab==="house8"&&<House8 positions={positions}/>}
        </div>
      </div>
    </div>
  );
}
