import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   BMI.CALC v2 — Maximum Upgrade
   Dark Terminal Amber / Light Cream Ink  ·  QR.forge design system
   ─────────────────────────────────────────────────────────────────
   TABS:
   ◈ BMI          — Radial gauge, animated bar, hero result, share card
   ⊕ Calories     — TDEE, macro breakdown chart, water intake, goals
   ◎ Ideal Weight — 4 formulas, visual scale, gap analysis
   ▦ Body Fat     — US Navy, animated fill bar, fat/lean mass split
   ↗ Goal Planner — SVG timeline chart, calorie targets, pace slider
   ⇄ Compare      — 2-profile side-by-side with diff highlighting
   ⌛ History      — Auto-logged entries, recall any result
   ∑ Learn        — Science, formulas, FAQ
   ─────────────────────────────────────────────────────────────────
   NEW vs v1:
   ✦ Radial SVG arc gauge with animated needle
   ✦ Animated macro bar (protein/fat/carbs split)
   ✦ SVG weight-journey sparkline chart (goal planner)
   ✦ Visual position bar on ideal weight scale
   ✦ Body fat animated fill gradient bar
   ✦ 2-profile compare table with winner highlight
   ✦ Copy-text + result card share system
   ✦ Auto-history (last 8 calcs, clickable)
   ✦ Water intake, lean/fat mass cards
   ✦ Hamwi formula added (4th ideal weight)
   ✦ Full mobile responsive (hamburger sidebar)
   ✦ 8 tabs total (was 5)
═══════════════════════════════════════════════════════════════════ */

/* ─── STYLES ──────────────────────────────────────────────────── */
const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@700;800;900&family=Lato:wght@300;400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{font-family:'Lato',sans-serif;}

/* themes */
.dk{--bg:#0e0c09;--s1:#141209;--s2:#1a1710;--bdr:#2a2518;--acc:#f59e0b;--acc2:#fb923c;
  --lo:#34d399;--er:#f87171;--info:#60a5fa;
  --tx:#fef3c7;--tx2:#fbbf24;--tx3:#78350f;--tx4:#451a03;
  background:var(--bg);color:var(--tx);min-height:100vh;
  background-image:radial-gradient(ellipse 80% 40% at 50% -10%,rgba(245,158,11,.08),transparent 70%);}
.lt{--bg:#faf8f2;--s1:#fff;--s2:#f5f0e8;--bdr:#e8e0d0;--acc:#92400e;--acc2:#b45309;
  --lo:#065f46;--er:#991b1b;--info:#1d4ed8;
  --tx:#1c1208;--tx2:#78350f;--tx3:#a16207;--tx4:#d97706;
  background:var(--bg);color:var(--tx);min-height:100vh;}

/* topbar */
.topbar{height:48px;position:sticky;top:0;z-index:400;display:flex;align-items:center;
  padding:0 16px;gap:8px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(14,12,9,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(250,248,242,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(146,64,14,.06);}

/* tabs */
.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none;}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 14px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'DM Mono',monospace;font-size:10px;
  letter-spacing:.09em;text-transform:uppercase;display:flex;align-items:center;
  gap:5px;white-space:nowrap;transition:all .14s;}
.dk .tab{color:var(--tx3);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(245,158,11,.05);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:var(--tx3);}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(146,64,14,.05);font-weight:700;}
.lt .tab:hover:not(.on){color:var(--tx2);}

/* layout */
.body{display:grid;grid-template-columns:224px 1fr;min-height:calc(100vh - 88px);}
.sidebar{padding:14px 12px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:16px 18px;display:flex;flex-direction:column;gap:14px;min-height:0;overflow-y:auto;}

/* panels */
.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 16px rgba(146,64,14,.05);}
.dk .panel-hi{background:var(--s2);border:1px solid rgba(245,158,11,.3);border-radius:4px;box-shadow:0 0 28px rgba(245,158,11,.07);}
.lt .panel-hi{background:var(--s1);border:1.5px solid rgba(146,64,14,.28);border-radius:12px;box-shadow:0 4px 28px rgba(146,64,14,.1);}

/* buttons */
.btn-pri{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:9px 20px;cursor:pointer;font-family:'DM Mono',monospace;font-size:10px;
  font-weight:500;letter-spacing:.1em;text-transform:uppercase;transition:all .15s;border:none;}
.dk .btn-pri{background:var(--acc);color:#0e0c09;border-radius:3px;box-shadow:0 0 20px rgba(245,158,11,.3);}
.dk .btn-pri:hover{background:#fbbf24;box-shadow:0 0 30px rgba(245,158,11,.5);transform:translateY(-1px);}
.lt .btn-pri{background:var(--acc);color:#fff;border-radius:8px;box-shadow:0 4px 14px rgba(146,64,14,.35);}
.lt .btn-pri:hover{background:var(--acc2);transform:translateY(-1px);}

.btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;
  padding:5px 11px;cursor:pointer;font-family:'DM Mono',monospace;font-size:9.5px;
  letter-spacing:.06em;text-transform:uppercase;background:transparent;transition:all .12s;}
.dk .btn-ghost{border:1px solid var(--bdr);border-radius:3px;color:var(--tx3);}
.dk .btn-ghost:hover,.dk .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(245,158,11,.06);}
.lt .btn-ghost{border:1.5px solid var(--bdr);border-radius:7px;color:var(--tx3);}
.lt .btn-ghost:hover,.lt .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(146,64,14,.06);}

/* inputs */
.inp{width:100%;padding:8px 11px;font-family:'DM Mono',monospace;font-size:12px;outline:none;transition:all .13s;}
.dk .inp{background:rgba(0,0,0,.5);border:1px solid var(--bdr);color:var(--tx);border-radius:3px;}
.dk .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(245,158,11,.14);}
.lt .inp{background:#fdf8f0;border:1.5px solid var(--bdr);color:var(--tx);border-radius:8px;}
.lt .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(146,64,14,.1);}
.sel{width:100%;padding:7px 11px;font-family:'DM Mono',monospace;font-size:11px;outline:none;cursor:pointer;transition:all .13s;}
.dk .sel{background:rgba(0,0,0,.5);border:1px solid var(--bdr);color:var(--tx);border-radius:3px;}
.dk .sel option{background:#141209;}
.lt .sel{background:#fdf8f0;border:1.5px solid var(--bdr);color:var(--tx);border-radius:8px;}
.dk .sel:focus{border-color:var(--acc);}
.lt .sel:focus{border-color:var(--acc);}

/* labels */
.lbl{font-family:'DM Mono',monospace;font-size:8.5px;font-weight:500;letter-spacing:.2em;
  text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(245,158,11,.5);}
.lt .lbl{color:var(--acc);}
.sec-lbl{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.22em;text-transform:uppercase;margin-bottom:8px;}
.dk .sec-lbl{color:rgba(245,158,11,.35);}
.lt .sec-lbl{color:var(--acc);}

/* range sliders */
.range{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;}
.dk .range{background:rgba(245,158,11,.15);}
.dk .range::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;
  background:var(--acc);box-shadow:0 0 10px rgba(245,158,11,.6);cursor:pointer;}
.lt .range{background:rgba(146,64,14,.16);}
.lt .range::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;
  background:var(--acc);box-shadow:0 2px 8px rgba(146,64,14,.4);cursor:pointer;}

/* stat card */
.scard{padding:14px 16px;display:flex;flex-direction:column;gap:4px;}
.dk .scard{background:rgba(245,158,11,.03);border:1px solid rgba(245,158,11,.1);border-radius:4px;}
.lt .scard{background:rgba(146,64,14,.03);border:1.5px solid rgba(146,64,14,.1);border-radius:10px;}

/* hint */
.hint{padding:9px 13px;display:flex;gap:8px;align-items:flex-start;font-size:12.5px;line-height:1.72;}
.dk .hint{border:1px solid rgba(245,158,11,.15);border-radius:3px;background:rgba(245,158,11,.04);
  border-left:2.5px solid rgba(245,158,11,.4);color:var(--tx2);}
.lt .hint{border:1.5px solid rgba(146,64,14,.15);border-radius:9px;background:rgba(146,64,14,.04);
  border-left:3px solid rgba(146,64,14,.3);color:var(--tx2);}

/* ad */
.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(245,158,11,.012);border:1px dashed rgba(245,158,11,.1);border-radius:3px;}
.lt .ad{background:rgba(146,64,14,.03);border:1.5px dashed rgba(146,64,14,.15);border-radius:9px;}
.ad span{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;}
.dk .ad span,.lt .ad span{color:var(--tx3);}

/* prose */
.prose p{font-size:13.5px;line-height:1.82;margin-bottom:12px;color:var(--tx2);}
.prose h3{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;margin:22px 0 8px;
  color:var(--tx);text-transform:uppercase;letter-spacing:.04em;}
.prose strong{font-weight:700;color:var(--tx);}
.qa{padding:12px 15px;margin-bottom:9px;}
.dk .qa{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.3);}
.lt .qa{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(146,64,14,.03);}

/* history item */
.hist-row{padding:11px 15px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all .13s;}
.dk .hist-row{border:1px solid var(--bdr);border-radius:4px;background:var(--s2);}
.dk .hist-row:hover{border-color:var(--acc);background:rgba(245,158,11,.05);}
.lt .hist-row{border:1.5px solid var(--bdr);border-radius:10px;background:var(--s1);}
.lt .hist-row:hover{border-color:var(--acc);}

/* share card */
.share-render{padding:22px 26px;border-radius:10px;
  background:linear-gradient(135deg,#0e0c09 0%,#1c1a12 60%,#0e0c09 100%);
  border:1px solid rgba(245,158,11,.22);}

/* mobile */
@media(max-width:768px){
  .body{grid-template-columns:1fr!important;}
  .sidebar{display:none!important;}
  .sidebar.mob{display:flex!important;position:fixed;left:0;top:88px;bottom:0;
    width:248px;z-index:300;box-shadow:4px 0 24px rgba(0,0,0,.4);}
  .mob-btn{display:flex!important;}
  .mob-overlay{display:none;position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.55);}
  .mob-overlay.show{display:block;}
  .topbar{padding:0 12px;}
  .main{padding:12px;}
}
@media(min-width:769px){.mob-btn{display:none!important;}}
@media(max-width:520px){
  .g2{grid-template-columns:1fr!important;}
  .g3{grid-template-columns:1fr 1fr!important;}
  .g4{grid-template-columns:1fr 1fr!important;}
}
`;

/* ─── DATA ────────────────────────────────────────────────────── */
const BMI_ZONES = [
  { label:'Severely Underweight', lo:0,   hi:16,  col:'#60a5fa', risk:'High' },
  { label:'Underweight',          lo:16,  hi:18.5,col:'#93c5fd', risk:'Moderate' },
  { label:'Normal Weight',        lo:18.5,hi:25,  col:'#34d399', risk:'Low' },
  { label:'Overweight',           lo:25,  hi:30,  col:'#fbbf24', risk:'Moderate' },
  { label:'Obese Class I',        lo:30,  hi:35,  col:'#fb923c', risk:'High' },
  { label:'Obese Class II',       lo:35,  hi:40,  col:'#f87171', risk:'Very High' },
  { label:'Obese Class III',      lo:40,  hi:999, col:'#e11d48', risk:'Extreme' },
];
const getZone = b => BMI_ZONES.find(z => b >= z.lo && b < z.hi) || BMI_ZONES[6];

const ACTIVITY_LEVELS = [
  { x:1.2,   icon:'🪑', label:'Sedentary',       sub:'desk job, no exercise' },
  { x:1.375, icon:'🚶', label:'Lightly Active',  sub:'1–3 workouts/week' },
  { x:1.55,  icon:'🏃', label:'Moderately Active',sub:'3–5 workouts/week' },
  { x:1.725, icon:'🏋️', label:'Very Active',     sub:'6–7 workouts/week' },
  { x:1.9,   icon:'⚡', label:'Extra Active',    sub:'physical job + gym daily' },
];

const TABS = [
  { id:'bmi',     icon:'◈', label:'BMI' },
  { id:'calorie', icon:'⊕', label:'Calories' },
  { id:'ideal',   icon:'◎', label:'Ideal Weight' },
  { id:'bodyfat', icon:'▦', label:'Body Fat' },
  { id:'goal',    icon:'↗', label:'Goal Planner' },
  { id:'compare', icon:'⇄', label:'Compare' },
  { id:'history', icon:'⌛', label:'History' },
  { id:'learn',   icon:'∑', label:'Learn' },
];

const DEF = { unit:'metric', gender:'male', age:25, cm:175, ft:5, ftIn:9, kg:70, lbs:154, act:1.55, neck:38, waist:85, hip:95 };

/* ─── MATH ────────────────────────────────────────────────────── */
const toCm  = p => p.unit==='metric' ? +p.cm : +p.ft*30.48 + +p.ftIn*2.54;
const toKg  = p => p.unit==='metric' ? +p.kg : +p.lbs*0.453592;
const bmiOf = p => { const h=toCm(p)/100, w=toKg(p); return h>0&&w>0 ? w/(h*h) : null; };
const bmrOf = p => {
  const h=toCm(p), w=toKg(p), a=+p.age;
  if(!h||!w||!a) return null;
  return p.gender==='male' ? 10*w+6.25*h-5*a+5 : 10*w+6.25*h-5*a-161;
};
const bfOf  = p => {
  const h=toCm(p), n=+p.neck, w=+p.waist, hip=+p.hip;
  if(!h||!n||!w) return null;
  if(p.gender==='male') return 86.01*Math.log10(w-n)-70.041*Math.log10(h)+36.76;
  if(!hip) return null;
  return 163.205*Math.log10(w+hip-n)-97.684*Math.log10(h)-78.387;
};

/* ─── MAIN COMPONENT ──────────────────────────────────────────── */
export default function BMICalculator() {
  const [dark, setDark]   = useState(true);
  const [tab,  setTab]    = useState('bmi');
  const [mob,  setMob]    = useState(false);

  /* profile A (main) */
  const [P,  setP]  = useState(DEF);
  /* profile B (compare) */
  const [P2, setP2] = useState({ ...DEF, kg:85, cm:182, gender:'male', age:30 });

  /* goal planner */
  const [goalKg,   setGoalKg]   = useState(65);
  const [goalPace, setGoalPace] = useState(0.5);

  /* share */
  const [showCard, setShowCard] = useState(false);
  const [copied,   setCopied]   = useState(false);

  /* history */
  const [hist, setHist] = useState([]);

  const dk = dark;
  const up  = (k,v) => setP(p=>({...p,[k]:v}));
  const up2 = (k,v) => setP2(p=>({...p,[k]:v}));

  /* ── derived ── */
  const bmi  = useMemo(()=>bmiOf(P),  [P]);
  const bmi2 = useMemo(()=>bmiOf(P2), [P2]);
  const bmr  = useMemo(()=>bmrOf(P),  [P]);
  const bmr2 = useMemo(()=>bmrOf(P2), [P2]);
  const bf   = useMemo(()=>bfOf(P),   [P]);
  const tdee  = bmr  ? bmr*P.act   : null;
  const tdee2 = bmr2 ? bmr2*P2.act : null;
  const zone  = bmi  ? getZone(bmi)  : null;
  const zone2 = bmi2 ? getZone(bmi2) : null;
  const hCm  = toCm(P), wKg = toKg(P);
  const hCm2 = toCm(P2), wKg2 = toKg(P2);
  const idealMin = hCm ? 18.5*(hCm/100)**2 : null;
  const idealMax = hCm ? 24.9*(hCm/100)**2 : null;

  /* macro targets (balanced split) */
  const macros = useMemo(()=>{
    if(!tdee||!wKg) return null;
    const prot  = Math.round(wKg*1.8);
    const fat   = Math.round(tdee*0.25/9);
    const carbs = Math.round((tdee - prot*4 - fat*9)/4);
    return { prot, fat, carbs,
      pPct:Math.round(prot*4/tdee*100),
      fPct:Math.round(fat*9/tdee*100),
      cPct:Math.round(carbs*4/tdee*100) };
  },[tdee, wKg]);

  /* goal planner points */
  const goalPlan = useMemo(()=>{
    if(!wKg||!goalKg) return null;
    const losing = goalKg < wKg;
    const diff   = Math.abs(wKg - goalKg);
    const weeks  = Math.ceil(diff / goalPace);
    const deficit= goalPace*7700/7; // kcal/day
    const pts    = Array.from({length:Math.min(weeks,52)+1},(_,i)=>{
      const w = losing ? wKg - goalPace*i : wKg + goalPace*i;
      return { i, w:+w.toFixed(2) };
    });
    return { losing, diff, weeks, deficit, pts };
  },[wKg, goalKg, goalPace]);

  /* auto-save history whenever bmi changes */
  useEffect(()=>{
    if(!bmi) return;
    const entry = {
      id:Date.now(), bmi:+bmi.toFixed(1), cat:getZone(bmi).label,
      col:getZone(bmi).col, kg:+wKg.toFixed(1), cm:+hCm.toFixed(0),
      tdee:tdee?Math.round(tdee):null, time:new Date().toLocaleTimeString()
    };
    setHist(h=>[entry,...h.filter(x=>x.bmi!==entry.bmi)].slice(0,8));
  },[bmi]); // eslint-disable-line

  const shareText = bmi
    ? `BMI: ${bmi.toFixed(1)} (${zone?.label})\nHeight: ${hCm.toFixed(0)}cm | Weight: ${wKg.toFixed(1)}kg\nTDEE: ${tdee?Math.round(tdee):'—'} kcal/day\nbmicalc.app`
    : '';
  const doCopy = ()=>{ navigator.clipboard?.writeText(shareText); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  /* ─── SUB-COMPONENTS ─────────────────────────────────────────── */

  /* Stat card */
  const SC = ({lbl,val,sub,col,span})=>(
    <div className="scard" style={span?{gridColumn:`span ${span}`}:{}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.16em',textTransform:'uppercase',color:'var(--tx3)'}}>{lbl}</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:col||'var(--acc)',lineHeight:1.1,letterSpacing:'-.02em'}}>{val}</div>
      {sub&&<div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx2)'}}>{sub}</div>}
    </div>
  );

  /* Field wrapper */
  const Fld = ({lbl,children,col})=>(
    <div style={{display:'flex',flexDirection:'column',gap:5}}>
      {lbl&&<div className="lbl" style={col?{color:col}:{}}>{lbl}</div>}
      {children}
    </div>
  );

  /* Profile input block */
  const PInputs = ({p, upFn, title})=>(
    <div className="panel" style={{padding:'16px 18px'}}>
      {title&&<div className="lbl" style={{marginBottom:12,fontSize:9}}>{title}</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}} className="g2">
        <Fld lbl="Unit system">
          <select className="sel" value={p.unit} onChange={e=>upFn('unit',e.target.value)}>
            <option value="metric">Metric (cm / kg)</option>
            <option value="imperial">Imperial (ft / lbs)</option>
          </select>
        </Fld>
        <Fld lbl="Gender">
          <select className="sel" value={p.gender} onChange={e=>upFn('gender',e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Fld>
        <Fld lbl="Age">
          <input className="inp" type="number" value={p.age} min={1} max={120} onChange={e=>upFn('age',+e.target.value)}/>
        </Fld>
        {p.unit==='metric'
          ? <Fld lbl="Height (cm)">
              <input className="inp" type="number" value={p.cm} min={50} max={300} onChange={e=>upFn('cm',+e.target.value)}/>
            </Fld>
          : <Fld lbl="Height">
              <div style={{display:'flex',gap:6}}>
                <input className="inp" type="number" value={p.ft} min={1} max={9} onChange={e=>upFn('ft',+e.target.value)} placeholder="ft" style={{width:'50%'}}/>
                <input className="inp" type="number" value={p.ftIn} min={0} max={11} onChange={e=>upFn('ftIn',+e.target.value)} placeholder="in" style={{width:'50%'}}/>
              </div>
            </Fld>
        }
        <Fld lbl={p.unit==='metric'?'Weight (kg)':'Weight (lbs)'}>
          {p.unit==='metric'
            ? <input className="inp" type="number" value={p.kg} min={1} max={500} onChange={e=>upFn('kg',+e.target.value)}/>
            : <input className="inp" type="number" value={p.lbs} min={1} max={1100} onChange={e=>upFn('lbs',+e.target.value)}/>}
        </Fld>
      </div>
    </div>
  );

  /* ── Radial arc gauge ── */
  const RadialGauge = ({bmiVal, z, size=190})=>{
    const r=68, cx=size/2, cy=size*0.58;
    const startDeg=-210, sweepDeg=240;
    const toRad = d => d*Math.PI/180;
    const pct = bmiVal ? Math.min(1,Math.max(0,(Math.min(bmiVal,45)-15)/30)) : 0;
    const needleDeg = startDeg + pct*sweepDeg;
    const nx = cx + r*Math.cos(toRad(needleDeg));
    const ny = cy + r*Math.sin(toRad(needleDeg));

    // arc segments
    const arcD = (sDeg, eDeg) => {
      const s = { x:cx+r*Math.cos(toRad(sDeg)), y:cy+r*Math.sin(toRad(sDeg)) };
      const e = { x:cx+r*Math.cos(toRad(eDeg)), y:cy+r*Math.sin(toRad(eDeg)) };
      const lg = Math.abs(eDeg-sDeg)>180?1:0;
      return `M${s.x.toFixed(2)},${s.y.toFixed(2)} A${r},${r} 0 ${lg} 1 ${e.x.toFixed(2)},${e.y.toFixed(2)}`;
    };

    const segs = [
      [-210,-196.2,'#60a5fa'],[-196.2,-168,'#93c5fd'],[-168,-96,'#34d399'],
      [-96,-24,'#fbbf24'],[-24,12,'#fb923c'],[12,30,'#f87171'],
    ];

    return (
      <svg width={size} height={size*0.74} viewBox={`0 0 ${size} ${size*0.74}`} overflow="visible">
        {/* track bg */}
        <path d={arcD(-210,30)} fill="none" stroke={dk?'rgba(255,255,255,.06)':'rgba(0,0,0,.07)'} strokeWidth="11" strokeLinecap="round"/>
        {/* colored segments */}
        {segs.map(([s,e,c])=>(
          <path key={s} d={arcD(s,e)} fill="none" stroke={c} strokeWidth="11" strokeLinecap="round" opacity={bmiVal?1:.35}/>
        ))}
        {/* needle dot */}
        {bmiVal&&(
          <motion.g initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:180,damping:18}}>
            <circle cx={nx} cy={ny} r="9" fill={z?.col||'var(--acc)'} style={{filter:`drop-shadow(0 0 7px ${z?.col})`}}/>
            <circle cx={nx} cy={ny} r="4" fill={dk?'#0e0c09':'#fff'}/>
          </motion.g>
        )}
        {/* center reading */}
        {bmiVal&&(
          <>
            <text x={cx} y={cy+4} textAnchor="middle" fontFamily="'Syne',sans-serif" fontWeight="900" fontSize="30" fill={z?.col||'var(--acc)'}>{bmiVal.toFixed(1)}</text>
            <text x={cx} y={cy+20} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8.5" fill="var(--tx3)" letterSpacing="1.5">{z?.label?.toUpperCase()}</text>
          </>
        )}
        {!bmiVal&&(
          <text x={cx} y={cy+8} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="11" fill="var(--tx3)">Enter stats above</text>
        )}
        {/* min/max labels */}
        <text x={cx+r*Math.cos(toRad(-210))-6} y={cy+r*Math.sin(toRad(-210))+4} fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">15</text>
        <text x={cx+r*Math.cos(toRad(30))-4}   y={cy+r*Math.sin(toRad(30))+4}   fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">45</text>
      </svg>
    );
  };

  /* ── Horizontal colour bar gauge ── */
  const HGauge = ({bmiVal, z})=>{
    const pct = bmiVal ? Math.min(100,Math.max(0,((Math.min(bmiVal,45)-15)/30)*100)) : 0;
    return (
      <div>
        <div style={{position:'relative',height:12,borderRadius:6,
          background:'linear-gradient(90deg,#60a5fa 0%,#93c5fd 12%,#34d399 25%,#fbbf24 50%,#fb923c 68%,#f87171 84%,#e11d48 100%)',
          marginBottom:8}}>
          {bmiVal&&(
            <motion.div
              animate={{left:`${pct}%`}}
              initial={{left:'0%'}}
              transition={{type:'spring',stiffness:90,damping:16}}
              style={{position:'absolute',top:-5,width:22,height:22,borderRadius:'50%',
                transform:'translateX(-50%)',background:dk?'#0e0c09':'#fff',
                border:`3px solid ${z?.col}`,boxShadow:`0 0 12px ${z?.col}`,zIndex:2}}/>
          )}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'DM Mono',monospace",fontSize:8,color:'var(--tx3)'}}>
          {['15','18.5','25','30','35','40+'].map(v=><span key={v}>{v}</span>)}
        </div>
        {/* zone chips */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:3,marginTop:10}}>
          {BMI_ZONES.map(zn=>(
            <div key={zn.label} style={{padding:'3px 2px',borderRadius:3,textAlign:'center',
              background:`${zn.col}${z?.label===zn.label?'25':'12'}`,
              border:`1px solid ${zn.col}${z?.label===zn.label?'55':'28'}`,
              transform:z?.label===zn.label?'scale(1.06)':'scale(1)',transition:'transform .2s'}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:6.5,color:zn.col,
                whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',letterSpacing:'.02em'}}>
                {zn.label.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ── SVG Sparkline for goal planner ── */
  const Spark = ({pts, losing, W=380, H=110})=>{
    if(!pts||pts.length<2) return null;
    const ws = pts.map(p=>p.w);
    const minW = Math.min(...ws)-3, maxW = Math.max(...ws)+3;
    const sx = i => (i/(pts.length-1))*W;
    const sy = v => H - ((v-minW)/(maxW-minW||1))*H;
    const path = pts.map((p,i)=>`${i===0?'M':'L'}${sx(i).toFixed(1)},${sy(p.w).toFixed(1)}`).join(' ');
    const fill = `${path} L${W},${H+10} L0,${H+10} Z`;
    const col  = losing ? '#34d399' : '#f59e0b';
    const dots = [0, Math.floor(pts.length/2), pts.length-1];
    return (
      <svg viewBox={`-10 -10 ${W+20} ${H+40}`} style={{width:'100%',height:'auto'}}>
        <defs>
          <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={col} stopOpacity=".25"/>
            <stop offset="100%" stopColor={col} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={fill} fill="url(#sg)"/>
        <motion.path d={path} fill="none" stroke={col} strokeWidth="2.5" strokeLinecap="round"
          initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.4,ease:'easeInOut'}}/>
        {dots.map(i=>(
          <g key={i}>
            <circle cx={sx(i)} cy={sy(pts[i].w)} r="5" fill={col} stroke={dk?'#0e0c09':'#fff'} strokeWidth="2"/>
            <text x={sx(i)} y={sy(pts[i].w)-10} textAnchor="middle"
              fontFamily="'DM Mono',monospace" fontSize="9" fill="var(--tx3)">{pts[i].w}kg</text>
          </g>
        ))}
        <text x="0"   y={H+26} fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">Wk 0</text>
        <text x={W/2} y={H+26} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">Wk {Math.floor(pts.length/2)}</text>
        <text x={W}   y={H+26} textAnchor="end" fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">Wk {pts.length-1}</text>
      </svg>
    );
  };

  /* ── Macro bar ── */
  const MacroBar = ({m})=>{
    if(!m) return null;
    const segs=[
      {pct:m.pPct,col:'#60a5fa',lbl:'Protein',val:`${m.prot}g`,sub:`${m.prot*4} kcal`},
      {pct:m.fPct,col:'#f59e0b',lbl:'Fat',    val:`${m.fat}g`, sub:`${m.fat*9} kcal`},
      {pct:m.cPct,col:'#34d399',lbl:'Carbs',  val:`${m.carbs}g`,sub:`${m.carbs*4} kcal`},
    ];
    return (
      <div>
        <div style={{display:'flex',height:12,borderRadius:6,overflow:'hidden',gap:2,marginBottom:14}}>
          {segs.map((s,i)=>(
            <motion.div key={s.lbl}
              initial={{width:'0%'}} animate={{width:`${s.pct}%`}}
              transition={{delay:i*.18,duration:.9,ease:[.34,1.56,.64,1]}}
              style={{background:s.col,height:'100%',minWidth:2,borderRadius:2}}/>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}} className="g3">
          {segs.map(s=>(
            <div key={s.lbl} className="scard">
              <div style={{display:'flex',alignItems:'center',gap:5}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:s.col}}/>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,color:'var(--tx3)',letterSpacing:'.14em',textTransform:'uppercase'}}>{s.lbl}</div>
              </div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:20,color:s.col}}>{s.val}</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx2)'}}>{s.sub} · {s.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{S}</style>
      <div className={dk?'dk':'lt'}>

        {/* mobile overlay */}
        <div className={`mob-overlay ${mob?'show':''}`} onClick={()=>setMob(false)}/>

        {/* ════ TOPBAR ════ */}
        <div className="topbar">
          {/* hamburger */}
          <button className="btn-ghost mob-btn" onClick={()=>setMob(s=>!s)} style={{padding:'5px 8px',fontSize:14}}>☰</button>

          {/* logo */}
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',
              borderRadius:dk?4:9,
              background:dk?'rgba(245,158,11,.1)':'linear-gradient(135deg,#92400e,#b45309)',
              border:dk?'1px solid rgba(245,158,11,.35)':'none',
              boxShadow:dk?'0 0 16px rgba(245,158,11,.25)':'0 3px 10px rgba(146,64,14,.4)'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={dk?'#f59e0b':'#fff'} strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="8" r="4"/><path d="M6 21v-1a6 6 0 0 1 12 0v1"/>
              </svg>
            </div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:16,letterSpacing:'-.01em',color:'var(--tx)'}}>
              BMI<span style={{color:'var(--acc)'}}>.calc</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontWeight:400,fontSize:8,letterSpacing:'.15em',
                color:'var(--tx3)',marginLeft:7,verticalAlign:'middle'}}>v2</span>
            </span>
          </div>

          <div style={{flex:1}}/>

          {/* live pill */}
          {bmi&&(
            <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
              style={{display:'flex',alignItems:'center',gap:6,padding:'4px 11px',
                borderRadius:dk?3:20,border:dk?'1px solid rgba(245,158,11,.2)':'1.5px solid rgba(146,64,14,.18)',
                background:dk?'rgba(245,158,11,.05)':'rgba(146,64,14,.04)'}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:zone?.col,
                boxShadow:dk?`0 0 8px ${zone?.col}`:'none'}}/>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx2)',letterSpacing:'.06em'}}>
                {bmi.toFixed(1)} · {zone?.label} · {hCm.toFixed(0)}cm / {wKg.toFixed(1)}kg
              </span>
            </motion.div>
          )}

          {/* theme toggle */}
          <button onClick={()=>setDark(d=>!d)}
            style={{display:'flex',alignItems:'center',gap:5,padding:'4px 10px',
              border:dk?'1px solid rgba(245,158,11,.18)':'1.5px solid var(--bdr)',
              borderRadius:dk?3:7,background:'transparent',cursor:'pointer',transition:'all .14s'}}>
            <div style={{width:28,height:15,borderRadius:8,position:'relative',
              background:dk?'var(--acc)':'#d6cfc0',boxShadow:dk?'0 0 8px rgba(245,158,11,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,
                left:dk?'auto':2,right:dk?2:'auto',
                width:10,height:10,borderRadius:'50%',
                background:dk?'#0e0c09':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.1em',color:'var(--tx3)'}}>{dk?'DARK':'LIGHT'}</span>
          </button>
        </div>

        {/* ════ TABBAR ════ */}
        <div className="tabbar">
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ════ BODY ════ */}
        <div className="body">

          {/* ── SIDEBAR ── */}
          <div className={`sidebar ${mob?'mob':''}`}>
            

            {/* live stats */}
            {bmi&&(
              <div>
                <div className="sec-lbl">Live Stats</div>
                {[
                  ['BMI',       bmi.toFixed(1),               zone?.col],
                  ['Category',  zone?.label,                  zone?.col],
                  ['Risk',      zone?.risk,                   zone?.col],
                  ['TDEE',      tdee?`${Math.round(tdee)} kcal`:'—', 'var(--tx2)'],
                  ['BMR',       bmr?`${Math.round(bmr)} kcal`:'—',  'var(--tx2)'],
                  ['Ideal Min', idealMin?`${idealMin.toFixed(1)} kg`:'—','var(--lo)'],
                  ['Ideal Max', idealMax?`${idealMax.toFixed(1)} kg`:'—','var(--lo)'],
                  ['Gap',       idealMin&&idealMax
                    ? wKg>idealMax ? `↓ ${(wKg-idealMax).toFixed(1)}kg`
                    : wKg<idealMin ? `↑ ${(idealMin-wKg).toFixed(1)}kg`
                    : '✓ In range' : '—',
                    wKg>idealMax?'var(--er)':wKg<idealMin?'var(--info)':'var(--lo)'],
                ].map(([l,v,c])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                    padding:'5px 0',borderBottom:dk?'1px solid rgba(245,158,11,.05)':'1px solid rgba(146,64,14,.06)'}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)'}}>{l}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:c,fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* BMI scale legend */}
            <div>
              <div className="sec-lbl">BMI Scale</div>
              {BMI_ZONES.map(z=>(
                <div key={z.label} style={{display:'flex',alignItems:'center',gap:7,
                  padding:'4px 0',borderBottom:dk?'1px solid rgba(245,158,11,.04)':'1px solid rgba(146,64,14,.05)'}}>
                  <div style={{width:8,height:8,borderRadius:'50%',flexShrink:0,background:z.col,
                    boxShadow:zone?.label===z.label?`0 0 6px ${z.col}`:'none'}}/>
                  <div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,
                      color:zone?.label===z.label?'var(--acc)':'var(--tx2)',
                      fontWeight:zone?.label===z.label?700:400}}>{z.label}</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,color:'var(--tx3)'}}>{z.lo}–{z.hi===999?'40+':z.hi}</div>
                  </div>
                </div>
              ))}
            </div>

            
          </div>

          {/* ── MAIN ── */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══════════ BMI TAB ══════════ */}
              {tab==='bmi'&&(
                <motion.div key="bmi" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <PInputs p={P} upFn={up}/>

                  {bmi&&(
                    <motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{delay:.05}} style={{display:'flex',flexDirection:'column',gap:12}}>

                      {/* Hero card */}
                      <div className="panel-hi" style={{padding:'24px 28px'}}>
                        <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:24,alignItems:'center'}}>
                          <RadialGauge bmiVal={bmi} z={zone} size={200}/>
                          <div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.22em',textTransform:'uppercase',color:'var(--tx3)',marginBottom:8}}>Body Mass Index</div>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:68,color:zone?.col,lineHeight:1,letterSpacing:'-.03em'}}>{bmi.toFixed(1)}</div>
                            <div style={{display:'inline-block',marginTop:10,marginBottom:16,padding:'4px 14px',
                              borderRadius:dk?3:20,border:`1.5px solid ${zone?.col}50`,
                              background:`${zone?.col}18`,fontFamily:"'DM Mono',monospace",
                              fontSize:10.5,fontWeight:700,color:zone?.col,letterSpacing:'.07em',textTransform:'uppercase'}}>
                              {zone?.label} · {zone?.risk} Risk
                            </div>
                            {idealMin&&idealMax&&(
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--tx2)',lineHeight:1.72}}>
                                {wKg>idealMax
                                  ? <span>↓ Lose <strong style={{color:'var(--er)'}}>{(wKg-idealMax).toFixed(1)} kg</strong> to reach healthy BMI</span>
                                  : wKg<idealMin
                                  ? <span>↑ Gain <strong style={{color:'var(--info)'}}>{(idealMin-wKg).toFixed(1)} kg</strong> to reach healthy BMI</span>
                                  : <span style={{color:'var(--lo)'}}>✓ Within healthy BMI range</span>}
                              </div>
                            )}
                          </div>
                        </div>
                        <div style={{marginTop:20}}>
                          <HGauge bmiVal={bmi} z={zone}/>
                        </div>
                      </div>

                      {/* 4-stat grid */}
                      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}} className="g4">
                        <SC lbl="Height"   val={`${hCm.toFixed(0)} cm`} sub={`${Math.floor(hCm/30.48)}′${Math.round((hCm%30.48)/2.54)}″`}/>
                        <SC lbl="Weight"   val={`${wKg.toFixed(1)} kg`} sub={`${(wKg*2.205).toFixed(0)} lbs`}/>
                        <SC lbl="Healthy Range" val={idealMin?`${idealMin.toFixed(0)}–${idealMax.toFixed(0)}`:'—'} sub="kg  (BMI 18.5–24.9)" col="var(--lo)"/>
                        <SC lbl={wKg>idealMax?'To Lose':wKg<idealMin?'To Gain':'Status'}
                            val={wKg>idealMax?`${(wKg-idealMax).toFixed(1)}kg`:wKg<idealMin?`${(idealMin-wKg).toFixed(1)}kg`:'✓ OK'}
                            sub={wKg>idealMax?'to reach healthy':wKg<idealMin?'to reach healthy':'in healthy range'}
                            col={wKg>idealMax?'var(--er)':wKg<idealMin?'var(--info)':'var(--lo)'}/>
                      </div>

                      {/* Share panel */}
                      <div className="panel" style={{padding:'14px 18px'}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                          <div className="lbl" style={{margin:0}}>⊕ Share / Export</div>
                          <div style={{display:'flex',gap:8}}>
                            <button className="btn-ghost" onClick={doCopy}>{copied?'✓ Copied':'⎘ Copy Text'}</button>
                            <button className={`btn-ghost ${showCard?'on':''}`} onClick={()=>setShowCard(s=>!s)}>▣ Result Card</button>
                          </div>
                        </div>
                        <AnimatePresence>
                          {showCard&&(
                            <motion.div initial={{opacity:0,height:0,marginTop:0}} animate={{opacity:1,height:'auto',marginTop:14}} exit={{opacity:0,height:0,marginTop:0}}>
                              <div className="share-render">
                                <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.24em',textTransform:'uppercase',color:'rgba(245,158,11,.45)',marginBottom:14}}>BMI.CALC · RESULT CARD</div>
                                <div style={{display:'flex',alignItems:'flex-end',gap:16,marginBottom:18}}>
                                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:60,color:zone?.col,lineHeight:1}}>{bmi.toFixed(1)}</div>
                                  <div style={{paddingBottom:6}}>
                                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:'#fef3c7',fontWeight:700,marginBottom:4}}>{zone?.label}</div>
                                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(254,243,199,.5)'}}>{zone?.risk} Health Risk</div>
                                  </div>
                                </div>
                                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
                                  {[['Height',`${hCm.toFixed(0)} cm`],['Weight',`${wKg.toFixed(1)} kg`],['TDEE',tdee?`${Math.round(tdee)} kcal/d`:'—']].map(([l,v])=>(
                                    <div key={l}>
                                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(245,158,11,.4)',marginBottom:3}}>{l}</div>
                                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:17,color:'#fef3c7'}}>{v}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  
                </motion.div>
              )}

              {/* ══════════ CALORIES TAB ══════════ */}
              {tab==='calorie'&&(
                <motion.div key="cal" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <PInputs p={P} upFn={up}/>

                  {/* activity selector */}
                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div className="lbl" style={{marginBottom:12}}>⊕ Activity Level</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}} className="g2">
                      {ACTIVITY_LEVELS.map(a=>(
                        <button key={a.x} onClick={()=>up('act',a.x)}
                          className={`btn-ghost ${P.act===a.x?'on':''}`}
                          style={{justifyContent:'flex-start',padding:'9px 12px',gap:9,height:'auto',
                            background:P.act===a.x?(dk?'rgba(245,158,11,.07)':'rgba(146,64,14,.06)'):'' }}>
                          <span style={{fontSize:15}}>{a.icon}</span>
                          <div style={{textAlign:'left',flex:1}}>
                            <div style={{fontSize:10.5,fontWeight:600}}>{a.label}</div>
                            <div style={{fontSize:8.5,opacity:.55,textTransform:'none',letterSpacing:0}}>{a.sub}</div>
                          </div>
                          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:11,
                            color:P.act===a.x?'var(--acc)':'var(--tx3)'}}>×{a.x}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {tdee&&bmr&&(
                    <motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} style={{display:'flex',flexDirection:'column',gap:12}}>
                      {/* calorie grid */}
                      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}} className="g3">
                        <SC lbl="BMR (at rest)"   val={Math.round(bmr)}       sub="kcal · zero activity"/>
                        <SC lbl="TDEE (maintain)" val={Math.round(tdee)}      sub={`kcal · ×${P.act}`} col="var(--acc)"/>
                        <SC lbl="Fat Loss −500"   val={Math.round(tdee-500)}  sub="kcal · ~0.5 kg/wk"  col="var(--er)"/>
                        <SC lbl="Mild Loss −250"  val={Math.round(tdee-250)}  sub="kcal · ~0.25 kg/wk" col="var(--acc2)"/>
                        <SC lbl="Mild Gain +250"  val={Math.round(tdee+250)}  sub="kcal · ~0.25 kg/wk" col="var(--lo)"/>
                        <SC lbl="Muscle Gain +500"val={Math.round(tdee+500)}  sub="kcal · ~0.5 kg/wk"  col="var(--lo)"/>
                      </div>

                      {/* macro breakdown */}
                      <div className="panel" style={{padding:'18px 20px'}}>
                        <div className="lbl" style={{marginBottom:14}}>▦ Macro Targets (Maintenance)</div>
                        <MacroBar m={macros}/>
                      </div>

                      {/* water */}
                      <div className="panel" style={{padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <div>
                          <div className="lbl">💧 Daily Water Intake</div>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--tx2)'}}>35 ml per kg of body weight</div>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:28,color:'var(--info)'}}>
                            {(wKg*35/1000).toFixed(1)}<span style={{fontFamily:"'DM Mono',monospace",fontSize:13}}> L</span>
                          </div>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx3)'}}>{Math.round(wKg*35/250)} × 250 ml glasses</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  
                </motion.div>
              )}

              {/* ══════════ IDEAL WEIGHT TAB ══════════ */}
              {tab==='ideal'&&(
                <motion.div key="ideal" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <PInputs p={P} upFn={up}/>
                  {hCm&&wKg&&(()=>{
                    const hIn = hCm/2.54, dev = hIn - 60;
                    const formulas = [
                      {name:'Devine (1974)',   val:P.gender==='male'?50+2.3*dev:45.5+2.3*dev, note:'Most widely used clinically'},
                      {name:'Robinson (1983)', val:P.gender==='male'?52+1.9*dev:49+1.7*dev,   note:'Modified Devine formula'},
                      {name:'Miller (1983)',   val:P.gender==='male'?56.2+1.41*dev:53.1+1.36*dev, note:'Tends higher than Devine'},
                      {name:'Hamwi (1964)',    val:P.gender==='male'?48+2.7*dev:45.4+2.3*dev, note:'Used in clinical nutrition'},
                    ];
                    const avg = formulas.reduce((s,f)=>s+f.val,0)/formulas.length;
                    const bmiMin = idealMin?.toFixed(1), bmiMax = idealMax?.toFixed(1);
                    return (
                      <motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} style={{display:'flex',flexDirection:'column',gap:12}}>
                        <div className="hint"><span>ℹ</span><span>All formulas use height only. They don't account for muscle mass, bone density, or ethnicity — use as rough reference ranges, not targets.</span></div>

                        {/* Visual position bar */}
                        <div className="panel" style={{padding:'20px 22px'}}>
                          <div className="lbl" style={{marginBottom:16}}>◎ Your Position on Scale</div>
                          {(()=>{
                            const MIN=30, MAX=130;
                            const pct = v => Math.min(100,Math.max(0,(v-MIN)/(MAX-MIN)*100));
                            return (
                              <div style={{position:'relative',paddingBottom:28}}>
                                {/* track */}
                                <div style={{height:8,borderRadius:4,background:dk?'rgba(245,158,11,.08)':'rgba(146,64,14,.1)'}}>
                                  {/* healthy zone */}
                                  <div style={{
                                    position:'absolute',
                                    left:`${pct(idealMin)}%`,
                                    width:`${pct(idealMax)-pct(idealMin)}%`,
                                    height:8,background:'rgba(52,211,153,.35)',borderRadius:4,
                                  }}/>
                                </div>
                                {/* current weight marker */}
                                <motion.div
                                  animate={{left:`${pct(wKg)}%`}}
                                  initial={{left:`${pct(wKg)}%`}}
                                  transition={{type:'spring',stiffness:80,damping:16}}
                                  style={{position:'absolute',top:-6,width:20,height:20,borderRadius:'50%',
                                    transform:'translateX(-50%)',background:zone?.col,
                                    border:`2px solid ${dk?'#0e0c09':'#fff'}`,
                                    boxShadow:`0 0 12px ${zone?.col}`}}/>
                                {/* axis labels */}
                                {[
                                  [30,'30kg'],
                                  [idealMin,`${idealMin?.toFixed(0)}kg ↑`,'var(--lo)'],
                                  [idealMax,`↑ ${idealMax?.toFixed(0)}kg`,'var(--lo)'],
                                  [wKg,`You: ${wKg.toFixed(0)}kg`,zone?.col],
                                  [MAX,'130kg'],
                                ].map(([v,lbl,col])=>(
                                  <div key={lbl} style={{position:'absolute',top:18,
                                    left:`${pct(v)}%`,transform:'translateX(-50%)',
                                    fontFamily:"'DM Mono',monospace",fontSize:8,
                                    color:col||'var(--tx3)',whiteSpace:'nowrap'}}>{lbl}</div>
                                ))}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Formula rows */}
                        {formulas.map(f=>(
                          <div key={f.name} className="panel" style={{padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                            <div>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:600,color:'var(--tx)',marginBottom:3}}>{f.name}</div>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx3)'}}>{f.note}</div>
                            </div>
                            <div style={{textAlign:'right'}}>
                              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:24,color:'var(--acc)'}}>{f.val.toFixed(1)}<span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--tx3)'}}> kg</span></div>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx3)'}}>{(f.val*2.205).toFixed(0)} lbs · diff: {(wKg-f.val)>=0?'+':''}{(wKg-f.val).toFixed(1)}kg</div>
                            </div>
                          </div>
                        ))}

                        {/* Average row */}
                        <div className="panel" style={{padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',
                          border:dk?'1px solid rgba(52,211,153,.3)':'1.5px solid rgba(6,95,70,.25)'}}>
                          <div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,color:'var(--lo)',marginBottom:3}}>Average of 4 Formulas</div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx3)'}}>Devine + Robinson + Miller + Hamwi ÷ 4</div>
                          </div>
                          <div style={{textAlign:'right'}}>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:28,color:'var(--lo)'}}>{avg.toFixed(1)}<span style={{fontFamily:"'DM Mono',monospace",fontSize:12}}> kg</span></div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx3)'}}>BMI range: {bmiMin}–{bmiMax} kg</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}
                  
                </motion.div>
              )}

              {/* ══════════ BODY FAT TAB ══════════ */}
              {tab==='bodyfat'&&(
                <motion.div key="bf" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <PInputs p={P} upFn={up}/>
                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div className="lbl" style={{marginBottom:12}}>▦ Circumference Measurements (cm)</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}} className="g3">
                      {[
                        ['Neck', P.neck,  v=>up('neck',v)],
                        ['Waist',P.waist, v=>up('waist',v)],
                        ...P.gender==='female'?[['Hip',P.hip,v=>up('hip',v)]]:[]
                      ].map(([l,v,fn])=>(
                        <div key={l} style={{display:'flex',flexDirection:'column',gap:5}}>
                          <div className="lbl">{l}</div>
                          <input className="inp" type="number" value={v} min={20} max={200} onChange={e=>fn(+e.target.value)}/>
                        </div>
                      ))}
                    </div>
                    <div className="hint" style={{marginTop:12}}><span>ℹ</span><span>US Navy method. Measure neck at narrowest, waist at narrowest (females: hip at widest).</span></div>
                  </div>

                  {bf&&(()=>{
                    const cats = P.gender==='male'
                      ? [['Essential',2,5,'#60a5fa'],['Athletes',6,13,'#34d399'],['Fitness',14,17,'#a3e635'],['Average',18,24,'#fbbf24'],['Obese',25,60,'#f87171']]
                      : [['Essential',10,13,'#60a5fa'],['Athletes',14,20,'#34d399'],['Fitness',21,24,'#a3e635'],['Average',25,31,'#fbbf24'],['Obese',32,60,'#f87171']];
                    const cur = cats.find(c=>bf>=c[1]&&bf<c[2])||cats[cats.length-1];
                    const pct = Math.min(100,Math.max(0,(bf-2)/(55-2)*100));
                    return (
                      <motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} style={{display:'flex',flexDirection:'column',gap:12}}>
                        <div className="panel-hi" style={{padding:'24px 28px'}}>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.22em',textTransform:'uppercase',color:'var(--tx3)',marginBottom:8}}>Body Fat Percentage · US Navy</div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:70,color:cur[3],lineHeight:1,letterSpacing:'-.03em'}}>
                            {bf.toFixed(1)}<span style={{fontSize:30}}>%</span>
                          </div>
                          <div style={{display:'inline-block',padding:'4px 14px',marginTop:10,marginBottom:22,
                            borderRadius:dk?3:20,border:`1.5px solid ${cur[3]}50`,background:`${cur[3]}18`,
                            fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,color:cur[3],letterSpacing:'.08em',textTransform:'uppercase'}}>
                            {cur[0]}
                          </div>
                          {/* fill bar */}
                          <div style={{position:'relative',height:14,borderRadius:7,overflow:'hidden',
                            background:'linear-gradient(90deg,#60a5fa 0%,#34d399 18%,#a3e635 32%,#fbbf24 55%,#f87171 100%)'}}>
                            <motion.div
                              animate={{left:`${pct}%`}}
                              initial={{left:'0%'}}
                              transition={{type:'spring',stiffness:80,damping:16}}
                              style={{position:'absolute',top:-3,width:20,height:20,borderRadius:'50%',
                                transform:'translateX(-50%)',background:dk?'#0e0c09':'#fff',
                                border:`3px solid ${cur[3]}`,boxShadow:`0 0 12px ${cur[3]}`}}/>
                          </div>
                          <div style={{display:'flex',justifyContent:'space-between',marginTop:5,fontFamily:"'DM Mono',monospace",fontSize:8,color:'var(--tx3)'}}>
                            {['2%','10%','20%','30%','40%','55%'].map(l=><span key={l}>{l}</span>)}
                          </div>
                        </div>

                        {/* category chips */}
                        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8}} className="g3">
                          {cats.map(([c,,, col])=>(
                            <div key={c} className="scard" style={{
                              opacity:cur[0]===c?1:.45,
                              border:cur[0]===c?`1.5px solid ${col}55`:'',
                              transform:cur[0]===c?'scale(1.04)':'scale(1)',transition:'transform .2s'}}>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:col,letterSpacing:'.1em',textTransform:'uppercase'}}>{c}</div>
                            </div>
                          ))}
                        </div>

                        {/* fat/lean split */}
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                          <SC lbl="Fat Mass"  val={`${(wKg*bf/100).toFixed(1)} kg`}     sub={`${bf.toFixed(1)}% of body`} col={cur[3]}/>
                          <SC lbl="Lean Mass" val={`${(wKg*(1-bf/100)).toFixed(1)} kg`} sub="muscle, bone, organs"       col="var(--lo)"/>
                        </div>
                      </motion.div>
                    );
                  })()}
                  
                </motion.div>
              )}

              {/* ══════════ GOAL PLANNER TAB ══════════ */}
              {tab==='goal'&&(
                <motion.div key="goal" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <PInputs p={P} upFn={up}/>
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div className="lbl" style={{marginBottom:14}}>↗ Goal Settings</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}} className="g2">
                      <div>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                          <div className="lbl" style={{margin:0}}>Target Weight</div>
                          <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--acc)',fontWeight:700}}>{goalKg} kg</span>
                        </div>
                        <input type="range" min={30} max={200} step={0.5} value={goalKg} className="range" onChange={e=>setGoalKg(+e.target.value)}/>
                        <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'DM Mono',monospace",fontSize:8,color:'var(--tx3)',marginTop:3}}>
                          <span>30 kg</span><span>200 kg</span>
                        </div>
                      </div>
                      <div>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                          <div className="lbl" style={{margin:0}}>Weekly Pace</div>
                          <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--acc)',fontWeight:700}}>{goalPace} kg/wk</span>
                        </div>
                        <input type="range" min={0.1} max={1.5} step={0.05} value={goalPace} className="range" onChange={e=>setGoalPace(+e.target.value)}/>
                        <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'DM Mono',monospace",fontSize:8,color:'var(--tx3)',marginTop:3}}>
                          <span>0.1 kg/wk</span><span>1.5 kg/wk</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {goalPlan&&(
                    <motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} style={{display:'flex',flexDirection:'column',gap:12}}>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}} className="g4">
                        <SC lbl="Start"      val={`${wKg.toFixed(1)} kg`} sub="current weight"/>
                        <SC lbl="Goal"       val={`${goalKg} kg`}         sub={goalPlan.losing?'to lose':'to gain'} col={goalPlan.losing?'var(--er)':'var(--lo)'}/>
                        <SC lbl="Difference" val={`${goalPlan.diff.toFixed(1)} kg`} sub="total change" col="var(--acc)"/>
                        <SC lbl="Timeline"   val={goalPlan.weeks>104?`${(goalPlan.weeks/52).toFixed(1)} yr`:goalPlan.weeks>52?`${(goalPlan.weeks/4).toFixed(0)} mo`:`${goalPlan.weeks} wk`} sub={`~${Math.ceil(goalPlan.weeks/4)} months`} col="var(--tx2)"/>
                      </div>

                      <div className="panel" style={{padding:'18px 22px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                          <div className="lbl" style={{margin:0}}>↗ Weight Journey Chart</div>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx3)'}}>{goalPlan.pts.length-1} weeks at {goalPace} kg/wk</div>
                        </div>
                        <Spark pts={goalPlan.pts} losing={goalPlan.losing}/>
                      </div>

                      {tdee&&(
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                          <SC lbl="Daily Deficit/Surplus" val={`${goalPlan.deficit.toFixed(0)} kcal`}
                              sub={goalPlan.losing?'below TDEE per day':'above TDEE per day'}
                              col={goalPlan.losing?'var(--er)':'var(--lo)'}/>
                          <SC lbl="Target Calories" val={`${Math.round(tdee - (goalPlan.losing?goalPlan.deficit:-goalPlan.deficit))} kcal`}
                              sub="per day to hit goal" col="var(--acc)"/>
                        </div>
                      )}

                      <div className="hint"><span>⚠</span><span>Deficits above 1,000 kcal/day or pace above 1 kg/week risk muscle loss and metabolic adaptation. Consult a doctor before aggressive diets.</span></div>
                    </motion.div>
                  )}
                  
                </motion.div>
              )}

              {/* ══════════ COMPARE TAB ══════════ */}
              {tab==='compare'&&(
                <motion.div key="cmp" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="hint"><span>⇄</span><span>Compare two profiles side-by-side — use to track your own progress over time, or compare with a partner.</span></div>

                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}} className="g2">
                    <PInputs p={P}  upFn={up}  title="◈ Profile A"/>
                    <PInputs p={P2} upFn={up2} title="◈ Profile B"/>
                  </div>

                  {bmi&&bmi2&&(()=>{
                    const idealMin2 = 18.5*(hCm2/100)**2, idealMax2 = 24.9*(hCm2/100)**2;
                    const rows = [
                      ['BMI',           bmi.toFixed(1),          bmi2.toFixed(1),          (a,b)=>+a<+b],
                      ['Category',      zone?.label,             zone2?.label,              ()=>null],
                      ['Health Risk',   zone?.risk,              zone2?.risk,               ()=>null],
                      ['Height',        `${hCm.toFixed(0)} cm`,  `${hCm2.toFixed(0)} cm`,   (a,b)=>+a>+b],
                      ['Weight',        `${wKg.toFixed(1)} kg`,  `${wKg2.toFixed(1)} kg`,   ()=>null],
                      ['BMR',           bmr?`${Math.round(bmr)}`:' — ',   bmr2?`${Math.round(bmr2)}`:' — ',  (a,b)=>+a>+b],
                      ['TDEE',          tdee?`${Math.round(tdee)}`:' — ', tdee2?`${Math.round(tdee2)}`:' — ',(a,b)=>+a>+b],
                      ['Healthy Range', `${idealMin?.toFixed(0)}–${idealMax?.toFixed(0)} kg`, `${idealMin2.toFixed(0)}–${idealMax2.toFixed(0)} kg`, ()=>null],
                      ['BMI Cat Colour',zone?.col||'',           zone2?.col||'',            ()=>null, true],
                    ];
                    return (
                      <div className="panel" style={{overflow:'hidden',padding:0}}>
                        <table style={{width:'100%',borderCollapse:'collapse',fontFamily:"'DM Mono',monospace",fontSize:11}}>
                          <thead>
                            <tr style={{background:dk?'rgba(245,158,11,.06)':'rgba(146,64,14,.04)'}}>
                              {['Metric','Profile A','Profile B'].map(h=>(
                                <th key={h} style={{padding:'11px 16px',textAlign:h==='Metric'?'left':'center',
                                  fontSize:8.5,letterSpacing:'.16em',textTransform:'uppercase',
                                  color:h==='Metric'?'var(--tx3)':'var(--acc)',
                                  borderBottom:dk?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rows.filter(r=>!r[4]).map(([l,a,b,win],i)=>{
                              const aWins = win ? win(a,b)===true  : false;
                              const bWins = win ? win(a,b)===false : false;
                              return (
                                <tr key={l} style={{background:i%2===0?(dk?'transparent':'rgba(146,64,14,.015)'):(dk?'rgba(245,158,11,.018)':'rgba(146,64,14,.025)')}}>
                                  <td style={{padding:'9px 16px',color:'var(--tx3)',borderBottom:dk?'1px solid rgba(245,158,11,.05)':'1px solid rgba(146,64,14,.06)'}}>{l}</td>
                                  {[a,b].map((v,j)=>{
                                    const wins = j===0?aWins:bWins;
                                    const catCol = j===0?zone?.col:zone2?.col;
                                    const isCat = l==='Category'||l==='Health Risk';
                                    return (
                                      <td key={j} style={{padding:'9px 16px',textAlign:'center',
                                        fontWeight:wins?700:500,
                                        color:isCat?catCol:'var(--acc)',
                                        borderBottom:dk?'1px solid rgba(245,158,11,.05)':'1px solid rgba(146,64,14,.06)',
                                        background:wins?(dk?'rgba(52,211,153,.05)':'rgba(6,95,70,.04)'):''
                                      }}>
                                        {wins&&<span style={{marginRight:4,color:'var(--lo)'}}>✓</span>}{v}
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                  
                </motion.div>
              )}

              {/* ══════════ HISTORY TAB ══════════ */}
              {tab==='history'&&(
                <motion.div key="hist" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:10}}>
                  <div className="hint"><span>⌛</span><span>Auto-saved every time you change your stats. Click any row to jump to the BMI tab.</span></div>
                  {hist.length===0
                    ? <div style={{textAlign:'center',padding:'64px 24px',fontFamily:"'DM Mono',monospace",fontSize:13,color:'var(--tx3)'}}>No calculations yet — enter your stats on the ◈ BMI tab.</div>
                    : hist.map((h,i)=>(
                        <motion.div key={h.id} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*.04}}
                          className="hist-row" onClick={()=>setTab('bmi')}>
                          <div style={{width:11,height:11,borderRadius:'50%',background:h.col,flexShrink:0,boxShadow:dk?`0 0 8px ${h.col}`:'none'}}/>
                          <div style={{flex:1}}>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,color:'var(--tx)',marginBottom:2}}>{h.cat}</div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx2)'}}>{h.cm} cm · {h.kg} kg{h.tdee?` · ${h.tdee} kcal/d`:''}</div>
                          </div>
                          <div style={{textAlign:'right'}}>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:h.col}}>{h.bmi}</div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,color:'var(--tx3)'}}>{h.time}</div>
                          </div>
                        </motion.div>
                      ))
                  }
                  {hist.length>0&&(
                    <button className="btn-ghost" onClick={()=>setHist([])} style={{alignSelf:'flex-start',marginTop:6}}>✕ Clear History</button>
                  )}
                  
                </motion.div>
              )}

              {/* ══════════ LEARN TAB ══════════ */}
              {tab==='learn'&&(
                <motion.div key="learn" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}>
                  <div className="panel" style={{padding:'26px 30px',marginBottom:14}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26,color:'var(--tx)',letterSpacing:'-.01em',marginBottom:4}}>BMI, Calories & Body Composition</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--tx3)',marginBottom:26,letterSpacing:'.1em'}}>SCIENCE · FORMULAS · LIMITATIONS · FAQ</div>
                    <div className="prose">
                      <p>Body Mass Index (BMI) was devised by Belgian mathematician Adolphe Quetelet in the 1830s as a <strong>population-level statistical tool</strong>, not an individual health diagnostic. Despite widespread clinical use, it remains a screening measure with well-documented limitations.</p>
                      <h3>Mifflin-St Jeor Equation (BMR)</h3>
                      <p>The most validated BMR formula for the general population. <strong>Male:</strong> 10W + 6.25H − 5A + 5. <strong>Female:</strong> 10W + 6.25H − 5A − 161. Where W = weight (kg), H = height (cm), A = age (years). Multiply by your activity factor to get TDEE.</p>
                      <h3>Why BMI Is Useful (and Flawed)</h3>
                      <p>BMI is cheap, fast, and correlates well with health outcomes <strong>at the population level</strong>. But it conflates fat and muscle — an elite athlete at 95 kg/180 cm has a BMI of 29.3 (overweight), yet may have 8% body fat. Conversely, "normal-weight obesity" — low BMI with high visceral fat — is increasingly recognised as a risk factor.</p>
                      <h3>US Navy Body Fat Method</h3>
                      <p>Uses circumference measurements to estimate body fat. Correlates moderately with DEXA scans (±3–4% error). Significantly more accurate than BMI for athletic populations, and far more practical than hydrostatic weighing or air displacement plethysmography.</p>
                      {[
                        {q:'What rate of weight loss is safe?',a:'0.5–1% of body weight per week is considered sustainable. This equates to roughly 250–750 kcal deficit daily. Faster rates risk lean mass loss, gallstone formation, and metabolic adaptation ("metabolic damage"). Very low calorie diets under 800 kcal should only be done under medical supervision.'},
                        {q:'Are macro ratios important?',a:'For general health, a balanced split of ~25–35% protein, 25–35% fat, 35–50% carbs works well. Athletes and those in a caloric deficit benefit from higher protein (1.6–2.2 g/kg body weight) to preserve lean mass. The specific ratio matters less than total calorie balance for weight change.'},
                        {q:'What is visceral vs subcutaneous fat?',a:'Subcutaneous fat sits under the skin (the pinchable type) and is relatively metabolically inert. Visceral fat surrounds abdominal organs, releases inflammatory cytokines, and is strongly linked to insulin resistance, type 2 diabetes, cardiovascular disease, and non-alcoholic fatty liver disease — even in people with a normal BMI.'},
                        {q:'Are BMI thresholds different for Asian populations?',a:'Yes. WHO and many Asian health bodies use lower BMI cut-offs for Asian populations. In many South and East Asian populations, health risks like type 2 diabetes increase at BMI ≥23 (vs ≥25 in general guidelines). India, Japan, China, Singapore and South Korea all have population-specific guidelines.'},
                      ].map(({q,a},i)=>(
                        <div key={i} className="qa">
                          <div style={{fontSize:12.5,fontWeight:700,fontFamily:"'DM Mono',monospace",color:'var(--tx)',marginBottom:5}}>{q}</div>
                          <div style={{fontSize:13,color:'var(--tx2)',lineHeight:1.78}}>{a}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}