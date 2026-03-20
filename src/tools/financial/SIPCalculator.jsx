import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   SIP.calc — SIP & Compound Interest Calculator
   Clean Modern · JetBrains Mono + Outfit
   ─────────────────────────────────────────────────────────────────
   TABS:
   ◈ Compound    — Lump-sum compound interest with growth chart
   ⊞ SIP         — Systematic Investment Plan (monthly investments)
   ⇄ Compare     — Lump-sum vs SIP vs Simple interest
   ↑ Goal         — Target corpus → required SIP / rate / time
   📊 Inflation   — Real returns after inflation adjustment
   ⌛ History    — Saved calculations
   ∑ Learn        — Compound interest guide, Rule of 72, tips
═══════════════════════════════════════════════════════════════════ */

/* ─── STYLES ──────────────────────────────────────────────────── */
const S = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{font-family:'Outfit',sans-serif;}
.dk{--bg:#080b0f;--s1:#0d1117;--s2:#131920;--bdr:#1e2d3d;
  --acc:#38bdf8;--acc2:#0ea5e9;--lo:#4ade80;--er:#f87171;--pur:#c084fc;--warn:#fb923c;--gold:#fbbf24;
  --tx:#e2eaf4;--tx2:#94a3b8;--tx3:#3d5a78;
  background:var(--bg);color:var(--tx);min-height:100vh;
  background-image:radial-gradient(ellipse 70% 50% at 30% -5%,rgba(56,189,248,.06),transparent 60%),
    radial-gradient(ellipse 50% 40% at 80% 100%,rgba(74,222,128,.04),transparent 60%);}
.lt{--bg:#f0f4f8;--s1:#ffffff;--s2:#e8f0f8;--bdr:#c5d8ec;
  --acc:#0369a1;--acc2:#0284c7;--lo:#15803d;--er:#dc2626;--pur:#7c3aed;--warn:#c2410c;--gold:#b45309;
  --tx:#0c1f2e;--tx2:#2d5070;--tx3:#6b90aa;
  background:var(--bg);color:var(--tx);min-height:100vh;}

.topbar{height:52px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 20px;gap:10px;backdrop-filter:blur(24px);}
.dk .topbar{background:rgba(8,11,15,.96);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(240,244,248,.96);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 16px rgba(3,105,161,.07);}
.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none;}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:42px;padding:0 15px;border:none;cursor:pointer;background:transparent;
  border-bottom:2px solid transparent;font-family:'JetBrains Mono',monospace;font-size:10px;
  letter-spacing:.07em;text-transform:uppercase;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--tx3);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(56,189,248,.05);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(3,105,161,.05);font-weight:600;}
.lt .tab{color:var(--tx3);}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns: 1fr;min-height:calc(100vh - 94px);}
@media(min-width:1024px){.body{grid-template-columns: 220px 1fr !important;}}
.sidebar{padding:16px 13px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:18px 20px;display:flex;flex-direction:column;gap:15px;overflow-y:auto;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:8px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:14px;box-shadow:0 2px 20px rgba(3,105,161,.06);}
.dk .panel-hi{background:var(--s2);border:1px solid rgba(56,189,248,.28);border-radius:8px;box-shadow:0 0 32px rgba(56,189,248,.07);}
.lt .panel-hi{background:var(--s1);border:1.5px solid rgba(3,105,161,.22);border-radius:14px;box-shadow:0 4px 28px rgba(3,105,161,.1);}

.btn-pri{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 20px;
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.09em;
  text-transform:uppercase;font-weight:500;border:none;transition:all .13s;}
.dk .btn-pri{background:var(--acc);color:#080b0f;border-radius:6px;box-shadow:0 0 20px rgba(56,189,248,.25);}
.dk .btn-pri:hover{background:#7dd3fc;}
.lt .btn-pri{background:var(--acc);color:#fff;border-radius:10px;box-shadow:0 4px 14px rgba(3,105,161,.3);}
.lt .btn-pri:hover{background:var(--acc2);}
.btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:5px 12px;
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.07em;
  text-transform:uppercase;background:transparent;transition:all .12s;}
.dk .btn-ghost{border:1px solid var(--bdr);border-radius:5px;color:var(--tx3);}
.dk .btn-ghost:hover,.dk .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(56,189,248,.07);}
.lt .btn-ghost{border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx3);}
.lt .btn-ghost:hover,.lt .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(3,105,161,.06);}

.inp{width:100%;padding:9px 12px;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;transition:all .13s;}
.dk .inp{background:rgba(0,0,0,.4);border:1px solid var(--bdr);color:var(--tx);border-radius:6px;}
.dk .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(56,189,248,.12);}
.lt .inp{background:#f8fbff;border:1.5px solid var(--bdr);color:var(--tx);border-radius:10px;}
.lt .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(3,105,161,.1);}
.sel{width:100%;padding:9px 12px;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;cursor:pointer;appearance:none;transition:all .13s;}
.dk .sel{background:rgba(0,0,0,.4);border:1px solid var(--bdr);color:var(--tx);border-radius:6px;}
.dk .sel:focus{border-color:var(--acc);}
.lt .sel{background:#f8fbff;border:1.5px solid var(--bdr);color:var(--tx);border-radius:10px;}
.lt .sel:focus{border-color:var(--acc);}

.lbl{font-family:'JetBrains Mono',monospace;font-size:8.5px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(56,189,248,.5);}
.lt .lbl{color:var(--acc);}
.sec-lbl{font-family:'JetBrains Mono',monospace;font-size:7.5px;letter-spacing:.24em;text-transform:uppercase;margin-bottom:9px;}
.dk .sec-lbl{color:rgba(56,189,248,.3);}
.lt .sec-lbl{color:var(--acc);}

.hint{padding:10px 14px;display:flex;gap:9px;align-items:flex-start;font-size:12.5px;line-height:1.72;}
.dk .hint{border:1px solid rgba(56,189,248,.14);border-radius:7px;background:rgba(56,189,248,.04);border-left:3px solid rgba(56,189,248,.4);color:var(--tx2);}
.lt .hint{border:1.5px solid rgba(3,105,161,.14);border-radius:11px;background:rgba(3,105,161,.04);border-left:3px solid rgba(3,105,161,.3);color:var(--tx2);}

.scard{padding:12px 14px;display:flex;flex-direction:column;gap:3px;}
.dk .scard{background:rgba(56,189,248,.03);border:1px solid rgba(56,189,248,.1);border-radius:7px;}
.lt .scard{background:rgba(3,105,161,.03);border:1.5px solid rgba(3,105,161,.1);border-radius:11px;}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(56,189,248,.012);border:1px dashed rgba(56,189,248,.1);border-radius:7px;}
.lt .ad{background:rgba(3,105,161,.025);border:1.5px dashed rgba(3,105,161,.12);border-radius:11px;}
.ad span{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:var(--tx3);}

.rng{width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;appearance:none;margin-top:7px;}
.dk .rng{background:rgba(56,189,248,.15);accent-color:var(--acc);}
.lt .rng{background:rgba(3,105,161,.15);accent-color:var(--acc);}

.tbl{width:100%;border-collapse:collapse;font-family:'JetBrains Mono',monospace;font-size:10.5px;}
.tbl th{padding:8px 12px;text-align:right;font-size:8px;letter-spacing:.14em;text-transform:uppercase;}
.tbl th:first-child{text-align:left;}
.dk .tbl th{color:rgba(56,189,248,.5);border-bottom:1px solid var(--bdr);}
.lt .tbl th{color:var(--acc);border-bottom:1.5px solid var(--bdr);}
.tbl td{padding:7px 12px;text-align:right;}
.tbl td:first-child{text-align:left;color:var(--tx3);}
.dk .tbl tr:nth-child(even){background:rgba(56,189,248,.02);}
.lt .tbl tr:nth-child(even){background:rgba(3,105,161,.02);}
.dk .tbl tr:hover{background:rgba(56,189,248,.05);}
.lt .tbl tr:hover{background:rgba(3,105,161,.05);}
.dk .tbl td{border-bottom:1px solid rgba(56,189,248,.04);}
.lt .tbl td{border-bottom:1px solid rgba(3,105,161,.04);}

.hist-row{padding:10px 14px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;transition:all .12s;gap:12px;}
.dk .hist-row{border:1px solid var(--bdr);border-radius:8px;background:var(--s2);}
.dk .hist-row:hover{border-color:rgba(56,189,248,.3);}
.lt .hist-row{border:1.5px solid var(--bdr);border-radius:12px;background:var(--s1);}
.lt .hist-row:hover{border-color:var(--acc);}

.prose p{font-size:13.5px;line-height:1.85;margin-bottom:12px;color:var(--tx2);}
.prose h3{font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;margin:20px 0 8px;color:var(--tx);text-transform:uppercase;letter-spacing:.05em;}
.prose strong{font-weight:700;color:var(--tx);}
.prose code{font-family:'JetBrains Mono',monospace;font-size:11px;padding:2px 6px;border-radius:4px;}
.dk .prose code{background:rgba(56,189,248,.1);color:var(--acc);}
.lt .prose code{background:rgba(3,105,161,.08);color:var(--acc);}
.qa{padding:13px 16px;margin-bottom:9px;}
.dk .qa{border:1px solid var(--bdr);border-radius:8px;background:rgba(0,0,0,.25);}
.lt .qa{border:1.5px solid var(--bdr);border-radius:12px;background:rgba(3,105,161,.03);}

@media(max-width:768px){
  .body{grid-template-columns:1fr!important;}
  .sidebar{display:none!important;}
  .sidebar.mob{display:flex!important;position:fixed;left:0;top:94px;bottom:0;width:240px;z-index:300;box-shadow:4px 0 28px rgba(0,0,0,.5);}
  .mob-btn{display:flex!important;}
  .mob-overlay{display:none;position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.6);}
  .mob-overlay.show{display:block;}
  .main{padding:12px;}
}
@media(min-width:769px){.mob-btn{display:none!important;}}
@media(max-width:560px){.g2{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr 1fr!important;}}
`;

/* ─── TABS ──────────────────────────────────────────────────────── */
const TABS = [
  { id:'compound',  icon:'◈',  label:'Compound' },
  { id:'sip',       icon:'⊞',  label:'SIP' },
  { id:'compare',   icon:'⇄',  label:'Compare' },
  { id:'goal',      icon:'↑',  label:'Goal' },
  { id:'inflation', icon:'📊', label:'Inflation' },
  { id:'history',   icon:'⌛', label:'History' },
  { id:'learn',     icon:'∑',  label:'Learn' },
];

/* ─── HELPERS ────────────────────────────────────────────────────── */
const CURRENCIES = [
  { code:'INR', sym:'₹', name:'Indian Rupee' },
  { code:'USD', sym:'$', name:'US Dollar' },
  { code:'GBP', sym:'£', name:'British Pound' },
  { code:'EUR', sym:'€', name:'Euro' },
  { code:'JPY', sym:'¥', name:'Japanese Yen' },
  { code:'AUD', sym:'A$', name:'Aus Dollar' },
];

const fmt = (n, sym = '₹') => {
  if (!isFinite(n) || isNaN(n)) return '—';
  const abs = Math.abs(n);
  if (sym === '₹') {
    if (abs >= 1e7)  return `${sym}${(n/1e7).toFixed(2)}Cr`;
    if (abs >= 1e5)  return `${sym}${(n/1e5).toFixed(2)}L`;
    return `${sym}${Math.round(n).toLocaleString('en-IN')}`;
  }
  if (abs >= 1e9) return `${sym}${(n/1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sym}${(n/1e6).toFixed(2)}M`;
  return `${sym}${Math.round(n).toLocaleString()}`;
};

const pct = n => `${isFinite(n) ? n.toFixed(2) : '—'}%`;
const x   = n => `${isFinite(n) ? n.toFixed(2) : '—'}×`;

/* ─── CALC ENGINES ───────────────────────────────────────────────── */

// Compound Interest: A = P(1 + r/n)^(nt)
const calcCompound = (principal, rate, years, freq) => {
  const r = rate / 100;
  const n = freq;
  const A = principal * Math.pow(1 + r / n, n * years);
  return {
    maturity:  A,
    interest:  A - principal,
    principal,
    multiple:  A / principal,
    yearData:  Array.from({ length: years }, (_, i) => {
      const yr = i + 1;
      const val = principal * Math.pow(1 + r / n, n * yr);
      return { year: yr, value: val, interest: val - principal };
    }),
  };
};

// SIP: FV = P × [((1 + r)^n - 1) / r] × (1 + r)
const calcSIP = (monthly, rate, years) => {
  const r  = rate / 100 / 12;
  const n  = years * 12;
  const FV = r === 0
    ? monthly * n
    : monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = monthly * n;
  return {
    maturity:  FV,
    invested,
    interest:  FV - invested,
    multiple:  FV / invested,
    monthData: Array.from({ length: n }, (_, i) => {
      const m = i + 1;
      const v = r === 0 ? monthly * m : monthly * ((Math.pow(1+r,m)-1)/r)*(1+r);
      return { month: m, year: Math.ceil(m/12), value: v, invested: monthly*m };
    }),
    yearData: Array.from({ length: years }, (_, i) => {
      const m = (i+1)*12;
      const v = r === 0 ? monthly * m : monthly * ((Math.pow(1+r,m)-1)/r)*(1+r);
      return { year: i+1, value: v, invested: monthly*m, interest: v - monthly*m };
    }),
  };
};

// Simple Interest
const calcSimple = (principal, rate, years) => {
  const interest = principal * (rate/100) * years;
  return { maturity: principal + interest, interest, principal };
};

// Goal: required monthly SIP
const goalSIP = (target, rate, years) => {
  const r = rate / 100 / 12;
  const n = years * 12;
  if (r === 0) return target / n;
  return target * r / (((Math.pow(1+r,n)-1)*(1+r)));
};

// Goal: required rate (binary search)
const goalRate = (monthly, target, years) => {
  let lo = 0, hi = 100;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (calcSIP(monthly, mid, years).maturity < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
};

// Goal: required years (binary search)
const goalYears = (monthly, rate, target) => {
  let lo = 0, hi = 100;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (calcSIP(monthly, rate, mid).maturity < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
};

/* ─── SVG AREA CHART ─────────────────────────────────────────────── */
const AreaChart = ({ data, keys, colors, labels, sym, dk }) => {
  if (!data || data.length === 0) return null;
  const W = 600, H = 200, pad = { t:16, r:16, b:36, l:64 };
  const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
  const maxVal = Math.max(...data.map(d => Math.max(...keys.map(k => d[k] || 0))), 1);
  const xScale = i => pad.l + (i / (data.length - 1)) * iW;
  const yScale = v => pad.t + iH - (v / maxVal) * iH;

  const makePath = (key) => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i).toFixed(1)},${yScale(d[key] || 0).toFixed(1)}`).join(' ');
  };
  const makeArea = (key) => {
    const line = makePath(key);
    return `${line} L${xScale(data.length-1).toFixed(1)},${(pad.t+iH).toFixed(1)} L${pad.l},${(pad.t+iH).toFixed(1)} Z`;
  };

  // Y axis labels
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    y: pad.t + iH * (1-f),
    val: maxVal * f,
  }));

  // X axis labels — show ~5 evenly spaced
  const step = Math.max(1, Math.floor(data.length / 5));
  const xTicks = data.filter((_, i) => i === 0 || (i+1) % step === 0 || i === data.length-1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto' }}>
      <defs>
        {keys.map((k, i) => (
          <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors[i]} stopOpacity={dk?0.35:0.2}/>
            <stop offset="100%" stopColor={colors[i]} stopOpacity={0.01}/>
          </linearGradient>
        ))}
      </defs>
      {/* Grid */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={pad.l} y1={t.y} x2={W-pad.r} y2={t.y} stroke={dk?'rgba(56,189,248,.06)':'rgba(3,105,161,.07)'} strokeWidth="1"/>
          <text x={pad.l-6} y={t.y+4} textAnchor="end" fontFamily="'JetBrains Mono',monospace" fontSize="8" fill="var(--tx3)">{fmt(t.val,sym)}</text>
        </g>
      ))}
      {/* Areas */}
      {[...keys].reverse().map((k, i) => (
        <motion.path key={k} d={makeArea(k)} fill={`url(#grad-${k})`}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6, delay: i*0.1 }}/>
      ))}
      {/* Lines */}
      {keys.map((k, i) => (
        <motion.path key={k} d={makePath(k)} fill="none" stroke={colors[i]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:1, delay: i*0.15, ease:'easeOut' }}/>
      ))}
      {/* X axis */}
      {xTicks.map((d, i) => (
        <text key={i} x={xScale(data.indexOf(d))} y={H-8} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="8" fill="var(--tx3)">
          {d.year ? `Yr${d.year}` : `M${d.month}`}
        </text>
      ))}
      {/* Legend */}
      {keys.map((k, i) => (
        <g key={k} transform={`translate(${pad.l + i*120}, ${H-2})`}>
          <rect x={0} y={-10} width={8} height={8} rx="2" fill={colors[i]} opacity={0.8}/>
          <text x={12} y={-3} fontFamily="'JetBrains Mono',monospace" fontSize="8" fill="var(--tx3)">{labels[i]}</text>
        </g>
      ))}
    </svg>
  );
};

/* ─── DONUT CHART ────────────────────────────────────────────────── */
const DonutChart = ({ principal, interest, sym, dk }) => {
  const total = principal + interest;
  if (!total) return null;
  const R = 72, CX = 90, CY = 90, SW = 18, circ = 2 * Math.PI * R;
  const pPct = principal / total;
  const iPct = interest / total;
  return (
    <svg viewBox="0 0 180 180" style={{ width:'100%', maxWidth:180 }}>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={dk?'rgba(56,189,248,.07)':'rgba(3,105,161,.08)'} strokeWidth={SW}/>
      <motion.circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--acc)" strokeWidth={SW} strokeLinecap="butt"
        strokeDashoffset={circ * 0.25}
        initial={{ strokeDasharray:`0 ${circ}` }}
        animate={{ strokeDasharray:`${pPct*circ} ${circ}` }}
        transition={{ duration:0.7 }}/>
      <motion.circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--lo)" strokeWidth={SW} strokeLinecap="butt"
        strokeDashoffset={-(pPct * circ) + circ * 0.25}
        initial={{ strokeDasharray:`0 ${circ}` }}
        animate={{ strokeDasharray:`${iPct*circ} ${circ}` }}
        transition={{ duration:0.7, delay:0.1 }}/>
      <text x={CX} y={CY-10} textAnchor="middle" fontFamily="'Outfit',sans-serif" fontWeight="900" fontSize="16" fill="var(--lo)">
        {fmt(total, sym)}
      </text>
      <text x={CX} y={CY+8} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="7.5" fill="var(--tx3)" letterSpacing=".08em">MATURITY</text>
      <text x={CX} y={CY+22} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="8" fill="var(--tx3)">
        {x(total/principal)} growth
      </text>
    </svg>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function SIPCalculator() {
  const [dark, setDark]   = useState(true);
  const [tab,  setTab]    = useState('compound');
  const [mob,  setMob]    = useState(false);
  const dk = dark;

  /* Currency */
  const [currency, setCurrency] = useState('INR');
  const sym = CURRENCIES.find(c => c.code === currency)?.sym || '₹';

  /* ── Compound inputs ── */
  const [principal, setPrincipal] = useState(100000);
  const [rate,      setRate]      = useState(12);
  const [years,     setYears]     = useState(10);
  const [freq,      setFreq]      = useState(12); // compounding frequency

  /* ── SIP inputs ── */
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipRate,    setSipRate]    = useState(12);
  const [sipYears,   setSipYears]   = useState(15);

  /* ── Goal inputs ── */
  const [goalTarget, setGoalTarget] = useState(5000000);
  const [goalMode,   setGoalMode]   = useState('sip');   // sip | rate | years
  const [goalRateVal, setGoalRateVal] = useState(12);
  const [goalYrs,    setGoalYrs]    = useState(20);
  const [goalMonthly,setGoalMonthly]= useState(5000);

  /* ── Inflation ── */
  const [inflation,  setInflation]  = useState(6);

  /* ── History ── */
  const [hist, setHist] = useState([]);
  const [copied, setCopied] = useState(false);

  /* ── Core calcs ── */
  const ciResult   = useMemo(() => calcCompound(principal, rate, years, freq), [principal, rate, years, freq]);
  const sipResult  = useMemo(() => calcSIP(sipMonthly, sipRate, sipYears), [sipMonthly, sipRate, sipYears]);
  const siResult   = useMemo(() => calcSimple(principal, rate, years), [principal, rate, years]);

  /* ── Goal calcs ── */
  const goalCalc = useMemo(() => {
    if (goalMode === 'sip')   return { value: goalSIP(goalTarget, goalRateVal, goalYrs), label: 'Required Monthly SIP' };
    if (goalMode === 'rate')  return { value: goalRate(goalMonthly, goalTarget, goalYrs), label: 'Required Annual Return' };
    if (goalMode === 'years') return { value: goalYears(goalMonthly, goalRateVal, goalTarget), label: 'Years Required' };
    return null;
  }, [goalMode, goalTarget, goalRateVal, goalYrs, goalMonthly, goalRateVal]);

  /* ── Inflation-adjusted ── */
  const realRate     = ((1 + rate/100) / (1 + inflation/100) - 1) * 100;
  const realSipRate  = ((1 + sipRate/100) / (1 + inflation/100) - 1) * 100;
  const ciReal       = useMemo(() => calcCompound(principal, realRate, years, freq), [principal, realRate, years, freq]);
  const sipReal      = useMemo(() => calcSIP(sipMonthly, realSipRate, sipYears), [sipMonthly, realSipRate, sipYears]);

  const saveHist = (type, result) => {
    setHist(h => [{
      id: Date.now(), type, sym,
      maturity: result.maturity,
      invested: result.invested || result.principal,
      rate: type === 'SIP' ? sipRate : rate,
      years: type === 'SIP' ? sipYears : years,
      time: new Date().toLocaleTimeString(),
    }, ...h].slice(0, 20));
  };

  const copyResult = () => {
    const r = ciResult;
    const t = `Principal: ${fmt(r.principal,sym)}\nMaturity: ${fmt(r.maturity,sym)}\nInterest: ${fmt(r.interest,sym)}\nRate: ${rate}% · ${years} years`;
    navigator.clipboard.writeText(t).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const sideStats = [
    { label:'Maturity (CI)',  val: fmt(ciResult.maturity, sym),   color:'var(--lo)' },
    { label:'Interest Earned',val: fmt(ciResult.interest, sym),   color:'var(--acc)' },
    { label:'Growth',         val: x(ciResult.multiple),          color:'var(--gold)' },
    { label:'SIP Maturity',   val: fmt(sipResult.maturity, sym),  color:'var(--pur)' },
    { label:'SIP Invested',   val: fmt(sipResult.invested, sym),  color:'var(--tx2)' },
    { label:'SIP Returns',    val: fmt(sipResult.interest, sym),  color:'var(--warn)' },
  ];

  const FREQ_OPTS = [
    { val:1,   label:'Annual' },
    { val:2,   label:'Semi-Annual' },
    { val:4,   label:'Quarterly' },
    { val:12,  label:'Monthly' },
    { val:365, label:'Daily' },
  ];

  return (
    <>
      <style>{S}</style>
      <div className={dk ? 'dk' : 'lt'}>
        <div className={`mob-overlay ${mob?'show':''}`} onClick={() => setMob(false)}/>

        {/* ════ TOPBAR ════ */}
        <div className="topbar">
          <button className="btn-ghost mob-btn" onClick={() => setMob(s=>!s)} style={{ padding:'5px 9px',fontSize:14 }}>☰</button>
          <div style={{ display:'flex',alignItems:'center',gap:9 }}>
            <div style={{ width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',
              borderRadius:dk?6:10,
              background:dk?'rgba(56,189,248,.1)':'linear-gradient(135deg,#0369a1,#0ea5e9)',
              border:dk?'1px solid rgba(56,189,248,.3)':'none',
              boxShadow:dk?'0 0 20px rgba(56,189,248,.2)':'0 3px 12px rgba(3,105,161,.4)' }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:14,color:dk?'#38bdf8':'#fff' }}>C</span>
            </div>
            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:17,letterSpacing:'-.02em',color:'var(--tx)' }}>
              SIP<span style={{ color:'var(--acc)' }}>.calc</span>
              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontWeight:400,fontSize:8,letterSpacing:'.18em',color:'var(--tx3)',marginLeft:8,verticalAlign:'middle' }}>v1</span>
            </span>
          </div>
          <div style={{ flex:1 }}/>
          {/* Currency selector */}
          <select className="sel" value={currency} onChange={e => setCurrency(e.target.value)}
            style={{ width:100,padding:'3px 8px',fontSize:10 }}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} {c.sym}</option>)}
          </select>
          <button className="btn-ghost" onClick={copyResult} style={{ padding:'5px 10px',fontSize:10 }}>{copied?'✓':'⎘'}</button>
          <button className="btn-ghost" onClick={() => setDark(d=>!d)} style={{ padding:'5px 10px',fontSize:13 }}>{dk?'☀':'◑'}</button>
        </div>

        {/* ════ TABBAR ════ */}
        <div className="tabbar">
          {TABS.map(t => (
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* ════ BODY ════ */}
        <div className="body">
          {/* SIDEBAR */}
          <div className={`sidebar ${mob?'mob':''}`}>
            <div className="sec-lbl">Quick Results</div>
            {sideStats.map((s,i) => (
              <div key={i} className="scard">
                <div className="lbl" style={{ margin:0 }}>{s.label}</div>
                <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:14,color:s.color }}>{s.val}</div>
              </div>
            ))}
            

            {/* Rule of 72 */}
            <div className="sec-lbl" style={{ marginTop:4 }}>Rule of 72</div>
            <div className="scard">
              <div className="lbl" style={{ margin:0 }}>Double in</div>
              <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:15,color:'var(--gold)' }}>
                {(72/rate).toFixed(1)} yrs
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--tx3)',marginTop:2 }}>at {rate}% annual</div>
            </div>
            <div className="scard">
              <div className="lbl" style={{ margin:0 }}>SIP doubles in</div>
              <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:15,color:'var(--pur)' }}>
                {(72/sipRate).toFixed(1)} yrs
              </div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--tx3)',marginTop:2 }}>at {sipRate}% annual</div>
            </div>

            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══════════ COMPOUND TAB ══════════ */}
              {tab==='compound' && (
                <motion.div key="ci" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>

                  

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }} className="g2">
                    {/* Inputs */}
                    <div className="panel" style={{ padding:'20px 22px',display:'flex',flexDirection:'column',gap:14 }}>
                      <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,letterSpacing:'.06em',color:'var(--tx)' }}>LUMP-SUM INVESTMENT</div>

                      <div>
                        <div className="lbl">Principal Amount</div>
                        <div style={{ position:'relative' }}>
                          <span style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'var(--tx3)' }}>{sym}</span>
                          <input className="inp" type="number" value={principal} onChange={e => setPrincipal(+e.target.value)} min={0} style={{ paddingLeft:26 }}/>
                        </div>
                        <input className="rng" type="range" min={1000} max={10000000} step={1000} value={principal} onChange={e => setPrincipal(+e.target.value)}/>
                        <div style={{ display:'flex',gap:5,marginTop:7,flexWrap:'wrap' }}>
                          {[10000,50000,100000,500000,1000000].map(v => (
                            <button key={v} className={`btn-ghost ${principal===v?'on':''}`} onClick={() => setPrincipal(v)} style={{ fontSize:8.5 }}>{fmt(v,sym)}</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="lbl">Annual Rate — {rate}%</div>
                        <input className="inp" type="number" value={rate} onChange={e => setRate(+e.target.value)} min={0} max={100} step={0.1}/>
                        <input className="rng" type="range" min={1} max={30} step={0.5} value={rate} onChange={e => setRate(+e.target.value)}/>
                        <div style={{ display:'flex',gap:5,marginTop:7,flexWrap:'wrap' }}>
                          {[6,8,10,12,15,18].map(v => (
                            <button key={v} className={`btn-ghost ${rate===v?'on':''}`} onClick={() => setRate(v)} style={{ fontSize:8.5 }}>{v}%</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="lbl">Time Period — {years} years</div>
                        <input className="inp" type="number" value={years} onChange={e => setYears(+e.target.value)} min={1} max={50}/>
                        <input className="rng" type="range" min={1} max={40} value={years} onChange={e => setYears(+e.target.value)}/>
                        <div style={{ display:'flex',gap:5,marginTop:7,flexWrap:'wrap' }}>
                          {[1,3,5,10,15,20,30].map(v => (
                            <button key={v} className={`btn-ghost ${years===v?'on':''}`} onClick={() => setYears(v)} style={{ fontSize:8.5 }}>{v}yr</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="lbl">Compounding Frequency</div>
                        <select className="sel" value={freq} onChange={e => setFreq(+e.target.value)}>
                          {FREQ_OPTS.map(f => <option key={f.val} value={f.val}>{f.label} ({f.val}×/yr)</option>)}
                        </select>
                      </div>

                      <button className="btn-ghost" onClick={() => saveHist('CI', ciResult)} style={{ alignSelf:'flex-start' }}>⊕ Save to History</button>
                    </div>

                    {/* Results */}
                    <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                      <div className="panel-hi" style={{ padding:'20px 22px',display:'flex',flexDirection:'column',alignItems:'center',gap:14 }}>
                        <DonutChart principal={ciResult.principal} interest={ciResult.interest} sym={sym} dk={dk}/>
                        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,width:'100%' }}>
                          {[
                            { color:'var(--acc)', label:'Principal',      val:fmt(ciResult.principal,sym) },
                            { color:'var(--lo)',  label:'Interest Earned',val:fmt(ciResult.interest,sym) },
                          ].map((s,i) => (
                            <div key={i} style={{ display:'flex',alignItems:'center',gap:7 }}>
                              <div style={{ width:8,height:8,borderRadius:2,background:s.color,flexShrink:0 }}/>
                              <div>
                                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--tx3)' }}>{s.label}</div>
                                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--tx2)' }}>{s.val}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="panel" style={{ padding:'16px 18px' }}>
                        {[
                          { label:'Maturity Amount',    val:fmt(ciResult.maturity,sym),   color:'var(--lo)' },
                          { label:'Total Interest',     val:fmt(ciResult.interest,sym),   color:'var(--acc)' },
                          { label:'Growth Multiple',    val:x(ciResult.multiple),          color:'var(--gold)' },
                          { label:`vs Simple (${rate}%)`,val:`+${fmt(ciResult.maturity - siResult.maturity, sym)}`,color:'var(--pur)' },
                        ].map((s,i) => (
                          <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',
                            padding:'7px 0',borderBottom:i<3?'1px solid var(--bdr)':'none' }}>
                            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>{s.label}</span>
                            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:15,color:s.color }}>{s.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Growth chart */}
                  <div className="panel" style={{ padding:'18px 20px' }}>
                    <div className="lbl" style={{ marginBottom:12 }}>Year-by-Year Growth</div>
                    <AreaChart
                      data={ciResult.yearData}
                      keys={['value','interest']}
                      colors={['var(--lo)','var(--acc)']}
                      labels={['Total Value','Interest']}
                      sym={sym} dk={dk}
                    />
                  </div>

                  {/* Year table */}
                  <div className="panel" style={{ padding:'18px 20px' }}>
                    <div className="lbl" style={{ marginBottom:12 }}>Year-by-Year Table</div>
                    <div style={{ maxHeight:280,overflowY:'auto' }}>
                      <table className="tbl">
                        <thead>
                          <tr>
                            <th>Year</th>
                            <th>Value</th>
                            <th>Interest Earned</th>
                            <th>Growth</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ciResult.yearData.map((row, i) => (
                            <tr key={i}>
                              <td>{row.year}</td>
                              <td style={{ color:'var(--lo)' }}>{fmt(row.value,sym)}</td>
                              <td style={{ color:'var(--acc)' }}>{fmt(row.interest,sym)}</td>
                              <td style={{ color:'var(--gold)' }}>{x(row.value/principal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ SIP TAB ══════════ */}
              {tab==='sip' && (
                <motion.div key="sip" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>⊞</span><span>SIP (Systematic Investment Plan) — invest a fixed amount every month. Returns are calculated using monthly compounding.</span></div>

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }} className="g2">
                    <div className="panel" style={{ padding:'20px 22px',display:'flex',flexDirection:'column',gap:14 }}>
                      <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,letterSpacing:'.06em',color:'var(--tx)' }}>SIP SETTINGS</div>

                      <div>
                        <div className="lbl">Monthly Investment</div>
                        <div style={{ position:'relative' }}>
                          <span style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'var(--tx3)' }}>{sym}</span>
                          <input className="inp" type="number" value={sipMonthly} onChange={e => setSipMonthly(+e.target.value)} min={0} style={{ paddingLeft:26 }}/>
                        </div>
                        <input className="rng" type="range" min={500} max={200000} step={500} value={sipMonthly} onChange={e => setSipMonthly(+e.target.value)}/>
                        <div style={{ display:'flex',gap:5,marginTop:7,flexWrap:'wrap' }}>
                          {[1000,2000,5000,10000,25000,50000].map(v => (
                            <button key={v} className={`btn-ghost ${sipMonthly===v?'on':''}`} onClick={() => setSipMonthly(v)} style={{ fontSize:8.5 }}>{fmt(v,sym)}</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="lbl">Expected Annual Return — {sipRate}%</div>
                        <input className="inp" type="number" value={sipRate} onChange={e => setSipRate(+e.target.value)} min={0} max={100} step={0.1}/>
                        <input className="rng" type="range" min={1} max={30} step={0.5} value={sipRate} onChange={e => setSipRate(+e.target.value)}/>
                        <div style={{ display:'flex',gap:5,marginTop:7,flexWrap:'wrap' }}>
                          {[8,10,12,15,18].map(v => (
                            <button key={v} className={`btn-ghost ${sipRate===v?'on':''}`} onClick={() => setSipRate(v)} style={{ fontSize:8.5 }}>{v}%</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="lbl">Investment Period — {sipYears} years</div>
                        <input className="inp" type="number" value={sipYears} onChange={e => setSipYears(+e.target.value)} min={1} max={50}/>
                        <input className="rng" type="range" min={1} max={40} value={sipYears} onChange={e => setSipYears(+e.target.value)}/>
                        <div style={{ display:'flex',gap:5,marginTop:7,flexWrap:'wrap' }}>
                          {[5,10,15,20,25,30].map(v => (
                            <button key={v} className={`btn-ghost ${sipYears===v?'on':''}`} onClick={() => setSipYears(v)} style={{ fontSize:8.5 }}>{v}yr</button>
                          ))}
                        </div>
                      </div>

                      <button className="btn-ghost" onClick={() => saveHist('SIP', { ...sipResult, invested:sipResult.invested })} style={{ alignSelf:'flex-start' }}>⊕ Save to History</button>
                    </div>

                    {/* SIP results */}
                    <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                      <div className="panel-hi" style={{ padding:'20px 22px',display:'flex',flexDirection:'column',alignItems:'center',gap:14 }}>
                        <DonutChart principal={sipResult.invested} interest={sipResult.interest} sym={sym} dk={dk}/>
                        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,width:'100%' }}>
                          {[
                            { color:'var(--acc)', label:'Total Invested',  val:fmt(sipResult.invested,sym) },
                            { color:'var(--lo)',  label:'Total Returns',   val:fmt(sipResult.interest,sym) },
                          ].map((s,i) => (
                            <div key={i} style={{ display:'flex',alignItems:'center',gap:7 }}>
                              <div style={{ width:8,height:8,borderRadius:2,background:s.color,flexShrink:0 }}/>
                              <div>
                                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--tx3)' }}>{s.label}</div>
                                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--tx2)' }}>{s.val}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="panel" style={{ padding:'16px 18px' }}>
                        {[
                          { label:'Maturity Corpus',    val:fmt(sipResult.maturity,sym),    color:'var(--lo)' },
                          { label:'Total Invested',     val:fmt(sipResult.invested,sym),    color:'var(--acc)' },
                          { label:'Wealth Gained',      val:fmt(sipResult.interest,sym),    color:'var(--pur)' },
                          { label:'Return Multiple',    val:x(sipResult.multiple),           color:'var(--gold)' },
                          { label:'Monthly→Annual',     val:`${fmt(sipMonthly*12,sym)}/yr`, color:'var(--tx2)' },
                        ].map((s,i) => (
                          <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',
                            padding:'7px 0',borderBottom:i<4?'1px solid var(--bdr)':'none' }}>
                            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>{s.label}</span>
                            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:14,color:s.color }}>{s.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SIP Growth chart */}
                  <div className="panel" style={{ padding:'18px 20px' }}>
                    <div className="lbl" style={{ marginBottom:12 }}>SIP Corpus Growth (Year-by-Year)</div>
                    <AreaChart
                      data={sipResult.yearData}
                      keys={['value','invested']}
                      colors={['var(--lo)','var(--acc)']}
                      labels={['Corpus Value','Amount Invested']}
                      sym={sym} dk={dk}
                    />
                  </div>

                  {/* SIP Year table */}
                  <div className="panel" style={{ padding:'18px 20px' }}>
                    <div className="lbl" style={{ marginBottom:12 }}>Year-by-Year SIP Summary</div>
                    <div style={{ maxHeight:280,overflowY:'auto' }}>
                      <table className="tbl">
                        <thead>
                          <tr><th>Year</th><th>Invested</th><th>Corpus</th><th>Gains</th><th>Multiple</th></tr>
                        </thead>
                        <tbody>
                          {sipResult.yearData.map((row,i) => (
                            <tr key={i}>
                              <td>{row.year}</td>
                              <td style={{ color:'var(--acc)' }}>{fmt(row.invested,sym)}</td>
                              <td style={{ color:'var(--lo)' }}>{fmt(row.value,sym)}</td>
                              <td style={{ color:'var(--pur)' }}>{fmt(row.interest,sym)}</td>
                              <td style={{ color:'var(--gold)' }}>{x(row.value/row.invested)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ COMPARE TAB ══════════ */}
              {tab==='compare' && (
                <motion.div key="cmp" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>⇄</span><span>Comparing lump-sum {fmt(principal,sym)} vs SIP {fmt(sipMonthly,sym)}/month — both at their configured rates and periods.</span></div>

                  <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12 }} className="g3">
                    {[
                      { label:'Compound Interest', sub:`${fmt(principal,sym)} @ ${rate}% for ${years}yr`, maturity:ciResult.maturity, invested:ciResult.principal, gain:ciResult.interest, multiple:ciResult.multiple, color:'var(--acc)' },
                      { label:'SIP',               sub:`${fmt(sipMonthly,sym)}/mo @ ${sipRate}% for ${sipYears}yr`, maturity:sipResult.maturity, invested:sipResult.invested, gain:sipResult.interest, multiple:sipResult.multiple, color:'var(--lo)' },
                      { label:'Simple Interest',   sub:`${fmt(principal,sym)} @ ${rate}% for ${years}yr`, maturity:siResult.maturity, invested:siResult.principal, gain:siResult.interest, multiple:siResult.maturity/principal, color:'var(--warn)' },
                    ].map((s,i) => (
                      <motion.div key={i} className="panel" style={{ padding:'18px 20px',borderTop:`3px solid ${s.color}` }}
                        initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*.08 }}>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:s.color,marginBottom:6 }}>{s.label}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',marginBottom:14 }}>{s.sub}</div>
                        {[
                          { label:'Maturity',  val:fmt(s.maturity,sym),  color:s.color },
                          { label:'Invested',  val:fmt(s.invested,sym),  color:'var(--tx2)' },
                          { label:'Gains',     val:fmt(s.gain,sym),      color:'var(--lo)' },
                          { label:'Multiple',  val:x(s.multiple),         color:'var(--gold)' },
                        ].map((r,j) => (
                          <div key={j} style={{ display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:j<3?'1px solid var(--bdr)':'none' }}>
                            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>{r.label}</span>
                            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:13,color:r.color }}>{r.val}</span>
                          </div>
                        ))}
                        {/* Mini bar */}
                        <div style={{ marginTop:12,height:5,background:'var(--bdr)',borderRadius:3,overflow:'hidden' }}>
                          <motion.div style={{ height:'100%',borderRadius:3,background:s.color }}
                            initial={{ width:0 }}
                            animate={{ width:`${Math.min(100,(s.gain/(Math.max(ciResult.interest,sipResult.interest,siResult.interest)||1))*100)}%` }}
                            transition={{ duration:0.7,delay:i*0.1 }}/>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Combined growth chart */}
                  <div className="panel" style={{ padding:'18px 20px' }}>
                    <div className="lbl" style={{ marginBottom:12 }}>Value Comparison Over Time (Lump-sum vs SIP vs Simple)</div>
                    {(() => {
                      const maxYr = Math.max(years, sipYears);
                      const data = Array.from({ length: maxYr }, (_, i) => {
                        const yr = i + 1;
                        const ci  = calcCompound(principal, rate, yr, freq).maturity;
                        const si  = calcSimple(principal, rate, yr).maturity;
                        const sip = calcSIP(sipMonthly, sipRate, yr).maturity;
                        return { year: yr, ci, si, sip };
                      });
                      return (
                        <AreaChart
                          data={data}
                          keys={['ci','sip','si']}
                          colors={['var(--acc)','var(--lo)','var(--warn)']}
                          labels={['Compound','SIP','Simple']}
                          sym={sym} dk={dk}
                        />
                      );
                    })()}
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ GOAL TAB ══════════ */}
              {tab==='goal' && (
                <motion.div key="gol" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>↑</span><span>Work backwards from a target corpus — find the required SIP amount, required return rate, or required time period.</span></div>

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }} className="g2">
                    <div className="panel" style={{ padding:'20px 22px',display:'flex',flexDirection:'column',gap:14 }}>
                      <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,letterSpacing:'.06em',color:'var(--tx)' }}>GOAL PLANNER</div>

                      <div>
                        <div className="lbl">Target Corpus</div>
                        <div style={{ position:'relative' }}>
                          <span style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'var(--tx3)' }}>{sym}</span>
                          <input className="inp" type="number" value={goalTarget} onChange={e => setGoalTarget(+e.target.value)} min={0} style={{ paddingLeft:26 }}/>
                        </div>
                        <div style={{ display:'flex',gap:5,marginTop:7,flexWrap:'wrap' }}>
                          {[500000,1000000,5000000,10000000,50000000].map(v => (
                            <button key={v} className={`btn-ghost ${goalTarget===v?'on':''}`} onClick={() => setGoalTarget(v)} style={{ fontSize:8.5 }}>{fmt(v,sym)}</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="lbl">Solve For</div>
                        <div style={{ display:'flex',gap:7 }}>
                          {[['sip','Monthly SIP'],['rate','Return Rate'],['years','Time Period']].map(([v,l]) => (
                            <button key={v} className={`btn-ghost ${goalMode===v?'on':''}`} onClick={() => setGoalMode(v)} style={{ fontSize:9 }}>{l}</button>
                          ))}
                        </div>
                      </div>

                      {goalMode !== 'rate' && (
                        <div>
                          <div className="lbl">Annual Return Rate — {goalRateVal}%</div>
                          <input className="inp" type="number" value={goalRateVal} onChange={e => setGoalRate_(+e.target.value)} min={0} max={100} step={0.1}/>
                          <input className="rng" type="range" min={1} max={30} step={0.5} value={goalRateVal} onChange={e => setGoalRate_(+e.target.value)}/>
                        </div>
                      )}

                      {goalMode !== 'years' && (
                        <div>
                          <div className="lbl">Investment Period — {goalYrs} years</div>
                          <input className="inp" type="number" value={goalYrs} onChange={e => setGoalYrs(+e.target.value)} min={1} max={50}/>
                          <input className="rng" type="range" min={1} max={40} value={goalYrs} onChange={e => setGoalYrs(+e.target.value)}/>
                        </div>
                      )}

                      {goalMode !== 'sip' && (
                        <div>
                          <div className="lbl">Monthly Investment</div>
                          <div style={{ position:'relative' }}>
                            <span style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'var(--tx3)' }}>{sym}</span>
                            <input className="inp" type="number" value={goalMonthly} onChange={e => setGoalMonthly(+e.target.value)} min={0} style={{ paddingLeft:26 }}/>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Goal result */}
                    <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                      <div className="panel-hi" style={{ padding:'24px 26px',display:'flex',flexDirection:'column',gap:16 }}>
                        <div>
                          <div className="lbl" style={{ margin:'0 0 6px' }}>{goalCalc?.label}</div>
                          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:34,color:'var(--lo)' }}>
                            {goalMode==='sip'   ? fmt(goalCalc?.value, sym) :
                             goalMode==='rate'  ? pct(goalCalc?.value) :
                             `${(goalCalc?.value||0).toFixed(1)} yrs`}
                          </div>
                        </div>

                        {goalCalc && (() => {
                          // Verify
                          const check = goalMode==='sip'
                            ? calcSIP(goalCalc.value, goalRateVal, goalYrs)
                            : goalMode==='rate'
                            ? calcSIP(goalMonthly, goalCalc.value, goalYrs)
                            : calcSIP(goalMonthly, goalRateVal, goalCalc.value);
                          return (
                            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                              {[
                                { label:'Target Corpus',   val:fmt(goalTarget,sym),   color:'var(--gold)' },
                                { label:'Projected Corpus',val:fmt(check.maturity,sym),color:'var(--lo)' },
                                { label:'Total Invested',  val:fmt(check.invested,sym),color:'var(--acc)' },
                                { label:'Wealth Gained',   val:fmt(check.interest,sym),color:'var(--pur)' },
                              ].map((s,i) => (
                                <div key={i} style={{ display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:i<3?'1px solid var(--bdr)':'none' }}>
                                  <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>{s.label}</span>
                                  <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:14,color:s.color }}>{s.val}</span>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Sensitivity table */}
                      <div className="panel" style={{ padding:'16px 18px' }}>
                        <div className="lbl" style={{ marginBottom:10 }}>Sensitivity — Different Rates</div>
                        <table className="tbl">
                          <thead><tr><th>Rate</th><th>Required SIP</th><th>Total Invested</th></tr></thead>
                          <tbody>
                            {[6,8,10,12,15,18].map(r => {
                              const s = goalSIP(goalTarget, r, goalYrs);
                              const inv = s * goalYrs * 12;
                              return (
                                <tr key={r} style={{ background: r===goalRateVal?(dk?'rgba(56,189,248,.06)':'rgba(3,105,161,.06)'):'' }}>
                                  <td style={{ color: r===goalRateVal?'var(--acc)':'var(--tx3)', fontWeight: r===goalRateVal?700:400 }}>{r}%</td>
                                  <td style={{ color:'var(--lo)' }}>{fmt(s,sym)}</td>
                                  <td style={{ color:'var(--tx2)' }}>{fmt(inv,sym)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ INFLATION TAB ══════════ */}
              {tab==='inflation' && (
                <motion.div key="inf" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>📊</span><span>Inflation erodes purchasing power. Real return = ((1 + nominal) / (1 + inflation) - 1). A 12% return at 6% inflation gives only ~5.66% real growth.</span></div>

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }} className="g2">
                    <div className="panel" style={{ padding:'20px 22px',display:'flex',flexDirection:'column',gap:14 }}>
                      <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,letterSpacing:'.06em',color:'var(--tx)' }}>INFLATION SETTINGS</div>
                      <div>
                        <div className="lbl">Annual Inflation Rate — {inflation}%</div>
                        <input className="inp" type="number" value={inflation} onChange={e => setInflation(+e.target.value)} min={0} max={30} step={0.1}/>
                        <input className="rng" type="range" min={0} max={15} step={0.5} value={inflation} onChange={e => setInflation(+e.target.value)}/>
                        <div style={{ display:'flex',gap:5,marginTop:7 }}>
                          {[3,4,5,6,7,8].map(v => (
                            <button key={v} className={`btn-ghost ${inflation===v?'on':''}`} onClick={() => setInflation(v)} style={{ fontSize:8.5 }}>{v}%</button>
                          ))}
                        </div>
                      </div>

                      {/* Real rates */}
                      <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                        <div className="lbl" style={{ margin:0 }}>Real Return Rates</div>
                        {[
                          { label:`Compound (${rate}% nominal)`, nominal:rate,    real:realRate },
                          { label:`SIP (${sipRate}% nominal)`,   nominal:sipRate, real:realSipRate },
                        ].map((s,i) => (
                          <div key={i} style={{ padding:'10px 14px',borderRadius:7,
                            background:dk?'rgba(56,189,248,.04)':'rgba(3,105,161,.04)',
                            border:dk?'1px solid rgba(56,189,248,.12)':'1.5px solid rgba(3,105,161,.12)' }}>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',marginBottom:5 }}>{s.label}</div>
                            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--tx3)' }}>{pct(s.nominal)} → real:</div>
                              <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:18,color:s.real>0?'var(--lo)':'var(--er)' }}>{pct(s.real)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Real vs nominal */}
                    <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                      <div className="panel" style={{ padding:'18px 20px' }}>
                        <div className="lbl" style={{ marginBottom:12 }}>Compound: Nominal vs Real</div>
                        {[
                          { label:'Nominal Maturity',  val:fmt(ciResult.maturity,sym),  color:'var(--acc)' },
                          { label:'Real Maturity',     val:fmt(ciReal.maturity,sym),    color:'var(--lo)' },
                          { label:'Inflation Erosion', val:fmt(ciResult.maturity - ciReal.maturity,sym), color:'var(--er)' },
                          { label:'Real Interest',     val:fmt(ciReal.interest,sym),    color:'var(--pur)' },
                        ].map((s,i) => (
                          <div key={i} style={{ display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:i<3?'1px solid var(--bdr)':'none' }}>
                            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>{s.label}</span>
                            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:14,color:s.color }}>{s.val}</span>
                          </div>
                        ))}
                      </div>

                      <div className="panel" style={{ padding:'18px 20px' }}>
                        <div className="lbl" style={{ marginBottom:12 }}>SIP: Nominal vs Real</div>
                        {[
                          { label:'Nominal Corpus',    val:fmt(sipResult.maturity,sym),  color:'var(--acc)' },
                          { label:'Real Corpus',       val:fmt(sipReal.maturity,sym),    color:'var(--lo)' },
                          { label:'Inflation Erosion', val:fmt(sipResult.maturity - sipReal.maturity,sym), color:'var(--er)' },
                        ].map((s,i) => (
                          <div key={i} style={{ display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:i<2?'1px solid var(--bdr)':'none' }}>
                            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>{s.label}</span>
                            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:14,color:s.color }}>{s.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Nominal vs real chart */}
                  <div className="panel" style={{ padding:'18px 20px' }}>
                    <div className="lbl" style={{ marginBottom:12 }}>Nominal vs Real Growth Over Time</div>
                    {(() => {
                      const data = Array.from({ length: years }, (_, i) => {
                        const yr = i + 1;
                        return {
                          year: yr,
                          nominal: calcCompound(principal, rate, yr, freq).maturity,
                          real:    calcCompound(principal, realRate, yr, freq).maturity,
                        };
                      });
                      return (
                        <AreaChart data={data} keys={['nominal','real']} colors={['var(--acc)','var(--lo)']} labels={['Nominal','Real (inflation-adj.)']} sym={sym} dk={dk}/>
                      );
                    })()}
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ HISTORY TAB ══════════ */}
              {tab==='history' && (
                <motion.div key="hst" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:9 }}>
                  <div className="hint"><span>⌛</span><span>Saved calculations. Click any row to reload those inputs.</span></div>
                  {hist.length === 0
                    ? <div style={{ textAlign:'center',padding:'64px 24px',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'var(--tx3)' }}>
                        No saved calculations yet.
                      </div>
                    : hist.map((h,i) => (
                        <motion.div key={h.id} className="hist-row"
                          initial={{ opacity:0,x:-6 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*.03 }}
                          onClick={() => {
                            if (h.type==='SIP') { setSipRate(h.rate); setSipYears(h.years); setTab('sip'); }
                            else { setRate(h.rate); setYears(h.years); setTab('compound'); }
                          }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--tx2)',marginBottom:2 }}>
                              {h.type} · {h.rate}% · {h.years}yr · {h.sym}{Math.round(h.invested).toLocaleString()} invested
                            </div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>{h.time}</div>
                          </div>
                          <div style={{ textAlign:'right' }}>
                            <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:18,color:'var(--lo)' }}>{fmt(h.maturity,h.sym)}</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>maturity</div>
                          </div>
                        </motion.div>
                      ))
                  }
                  {hist.length > 0 && (
                    <button className="btn-ghost" onClick={() => setHist([])} style={{ alignSelf:'flex-start',marginTop:4 }}>✕ Clear</button>
                  )}
                  
                </motion.div>
              )}

              {/* ══════════ LEARN TAB ══════════ */}
              {tab==='learn' && (
                <motion.div key="lrn" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}>
                  <div className="panel" style={{ padding:'26px 30px',marginBottom:14 }}>
                    <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:26,color:'var(--tx)',letterSpacing:'-.02em',marginBottom:4 }}>Compound Interest Guide</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx3)',marginBottom:26,letterSpacing:'.12em' }}>
                      FORMULAS · RULE OF 72 · SIP · TIPS
                    </div>
                    <div className="prose">
                      <h3>The Magic of Compounding</h3>
                      <p>Compound interest earns returns <strong>on previous returns</strong> — not just the original principal. Albert Einstein reportedly called it the "eighth wonder of the world." The formula is <code>A = P(1 + r/n)^(nt)</code> where P is principal, r is annual rate, n is compounding frequency, and t is time in years. The longer the period and higher the frequency, the more dramatic the effect.</p>
                      <h3>Rule of 72</h3>
                      <p>Divide 72 by your annual interest rate to estimate how many years it takes to double your money. At <strong>12%</strong>, money doubles every 6 years. At <strong>8%</strong>, it takes 9 years. At <strong>6%</strong>, it takes 12 years. This rule works best for rates between 6–20% and is a quick mental check for any investment.</p>
                      <h3>SIP vs Lump-Sum</h3>
                      <p>A <strong>lump-sum</strong> works best when you have a large amount to invest and markets are undervalued — every rupee starts compounding from day one. A <strong>SIP</strong> spreads investment over time, providing rupee-cost averaging — you buy more units when prices fall and fewer when they rise. For most salaried investors, SIPs are more practical and emotionally easier to maintain during volatility.</p>
                      <h3>Real Returns Matter More</h3>
                      <p>A 12% nominal return sounds great — but at 6% inflation, your real return is only ~5.66%. The purchasing power of your corpus is what matters, not the number on paper. Always evaluate investments in real (inflation-adjusted) terms, especially for long-term goals like retirement.</p>
                      {[
                        { q:'How often should compounding happen for maximum returns?', a:'More frequent compounding = slightly higher returns. Daily compounding yields marginally more than monthly or annual, but the difference is small. Most mutual funds and FDs compound annually or quarterly. The rate and time period have far more impact than compounding frequency.' },
                        { q:'What\'s a realistic SIP return to expect from equity mutual funds?', a:'Long-term equity mutual fund SIPs have historically delivered 10–14% CAGR in India over 10+ year periods. For conservative planning, use 10–12%. For debt/hybrid funds, use 6–8%. Always account for expense ratio (0.5–1.5%) which reduces your effective return.' },
                        { q:'Should I start a SIP early or invest a lump-sum later?', a:'Starting early wins almost every time due to compounding. ₹5,000/month for 30 years at 12% grows to ~₹1.76 Cr. Starting 10 years later (20 years), the same ₹5,000/month reaches only ~₹49L — less than a third. Time in market > timing the market.' },
                      ].map(({ q, a },i) => (
                        <div key={i} className="qa">
                          <div style={{ fontSize:12.5,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:'var(--tx)',marginBottom:5 }}>{q}</div>
                          <div style={{ fontSize:13,color:'var(--tx2)',lineHeight:1.8 }}>{a}</div>
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