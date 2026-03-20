import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   EMI.CALC v2 — Maximum Upgrade
   Dark Terminal Amber / Light Cream Ink  ·  QR.forge design system
   ─────────────────────────────────────────────────────────────────
   TABS:
   ◈ EMI          — Sliders, animated donut, hero result, share card
   ⊞ Schedule     — Full year-by-year amortisation table + area chart
   ⇄ Compare      — 3 loans side by side + animated bar chart
   ↑ Prepayment   — One-time + monthly, dual timeline chart, savings
   ⚖ Affordability — Reverse EMI: how much can you borrow?
   ↻ Refinance    — Old loan vs new loan, break-even calculator
   ⌛ History      — Auto-logged calculations, recall any
   ∑ Learn        — Formula, amortisation theory, strategies, FAQ
   ─────────────────────────────────────────────────────────────────
   NEW vs v1:
   ✦ Animated SVG donut chart (principal vs interest)
   ✦ Year-by-year stacked area chart in Schedule tab
   ✦ Loan comparison bar chart (visual not just table)
   ✦ Affordability / reverse EMI calculator (new tab)
   ✦ Refinance break-even calculator (new tab)
   ✦ Monthly prepayment mode (was one-time only)
   ✦ Dual before/after timeline in Prepayment
   ✦ Auto-history with recall
   ✦ Share / copy result card
   ✦ 5 loan type presets with icons
   ✦ Multi-currency: ₹ / $ / £ / € / ¥
   ✦ Full mobile responsive layout
   ✦ 8 tabs total (was 5)
═══════════════════════════════════════════════════════════════════ */

/* ─── STYLES ──────────────────────────────────────────────────── */
const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@700;800;900&family=Lato:wght@300;400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{font-family:'Lato',sans-serif;}

.dk{--bg:#0e0c09;--s1:#141209;--s2:#1a1710;--bdr:#2a2518;--acc:#f59e0b;--acc2:#fb923c;
  --lo:#34d399;--er:#f87171;--info:#60a5fa;
  --tx:#fef3c7;--tx2:#fbbf24;--tx3:#78350f;--tx4:#451a03;
  background:var(--bg);color:var(--tx);min-height:100vh;
  background-image:radial-gradient(ellipse 80% 40% at 50% -10%,rgba(245,158,11,.08),transparent 70%);}
.lt{--bg:#faf8f2;--s1:#fff;--s2:#f5f0e8;--bdr:#e8e0d0;--acc:#92400e;--acc2:#b45309;
  --lo:#065f46;--er:#991b1b;--info:#1d4ed8;
  --tx:#1c1208;--tx2:#78350f;--tx3:#a16207;--tx4:#d97706;
  background:var(--bg);color:var(--tx);min-height:100vh;}

.topbar{height:48px;position:sticky;top:0;z-index:400;display:flex;align-items:center;
  padding:0 16px;gap:8px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(14,12,9,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(250,248,242,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(146,64,14,.06);}

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

.body{display:grid;grid-template-columns:224px 1fr;min-height:calc(100vh - 88px);}
.sidebar{padding:14px 12px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:16px 18px;display:flex;flex-direction:column;gap:14px;overflow-y:auto;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 16px rgba(146,64,14,.05);}
.dk .panel-hi{background:var(--s2);border:1px solid rgba(245,158,11,.32);border-radius:4px;box-shadow:0 0 28px rgba(245,158,11,.08);}
.lt .panel-hi{background:var(--s1);border:1.5px solid rgba(146,64,14,.28);border-radius:12px;box-shadow:0 4px 28px rgba(146,64,14,.1);}

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

.inp{width:100%;padding:8px 11px;font-family:'DM Mono',monospace;font-size:12px;outline:none;transition:all .13s;}
.dk .inp{background:rgba(0,0,0,.5);border:1px solid var(--bdr);color:var(--tx);border-radius:3px;}
.dk .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(245,158,11,.14);}
.lt .inp{background:#fdf8f0;border:1.5px solid var(--bdr);color:var(--tx);border-radius:8px;}
.lt .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(146,64,14,.1);}
.sel{width:100%;padding:7px 11px;font-family:'DM Mono',monospace;font-size:11px;outline:none;cursor:pointer;}
.dk .sel{background:rgba(0,0,0,.5);border:1px solid var(--bdr);color:var(--tx);border-radius:3px;}
.dk .sel option{background:#141209;}
.lt .sel{background:#fdf8f0;border:1.5px solid var(--bdr);color:var(--tx);border-radius:8px;}

.lbl{font-family:'DM Mono',monospace;font-size:8.5px;font-weight:500;letter-spacing:.2em;
  text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(245,158,11,.5);}
.lt .lbl{color:var(--acc);}
.sec-lbl{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.22em;text-transform:uppercase;margin-bottom:8px;}
.dk .sec-lbl{color:rgba(245,158,11,.35);}
.lt .sec-lbl{color:var(--acc);}

.range{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;}
.dk .range{background:rgba(245,158,11,.15);}
.dk .range::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;
  background:var(--acc);box-shadow:0 0 10px rgba(245,158,11,.6);cursor:pointer;}
.lt .range{background:rgba(146,64,14,.16);}
.lt .range::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;
  background:var(--acc);box-shadow:0 2px 8px rgba(146,64,14,.4);cursor:pointer;}

.scard{padding:14px 16px;display:flex;flex-direction:column;gap:4px;}
.dk .scard{background:rgba(245,158,11,.03);border:1px solid rgba(245,158,11,.1);border-radius:4px;}
.lt .scard{background:rgba(146,64,14,.03);border:1.5px solid rgba(146,64,14,.1);border-radius:10px;}

.hint{padding:9px 13px;display:flex;gap:8px;align-items:flex-start;font-size:12.5px;line-height:1.72;}
.dk .hint{border:1px solid rgba(245,158,11,.15);border-radius:3px;background:rgba(245,158,11,.04);
  border-left:2.5px solid rgba(245,158,11,.4);color:var(--tx2);}
.lt .hint{border:1.5px solid rgba(146,64,14,.15);border-radius:9px;background:rgba(146,64,14,.04);
  border-left:3px solid rgba(146,64,14,.3);color:var(--tx2);}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(245,158,11,.012);border:1px dashed rgba(245,158,11,.1);border-radius:3px;}
.lt .ad{background:rgba(146,64,14,.03);border:1.5px dashed rgba(146,64,14,.15);border-radius:9px;}
.ad span{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--tx3);}

.prose p{font-size:13.5px;line-height:1.82;margin-bottom:12px;color:var(--tx2);}
.prose h3{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;margin:22px 0 8px;color:var(--tx);text-transform:uppercase;letter-spacing:.04em;}
.prose strong{font-weight:700;color:var(--tx);}
.qa{padding:12px 15px;margin-bottom:9px;}
.dk .qa{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.3);}
.lt .qa{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(146,64,14,.03);}

.tbl{width:100%;border-collapse:collapse;font-family:'DM Mono',monospace;font-size:11px;}
.tbl th{padding:9px 12px;text-align:right;font-size:8px;letter-spacing:.16em;text-transform:uppercase;}
.tbl th:first-child{text-align:left;}
.dk .tbl th{color:rgba(245,158,11,.45);border-bottom:1px solid var(--bdr);background:rgba(245,158,11,.03);}
.lt .tbl th{color:var(--acc);border-bottom:1.5px solid var(--bdr);background:rgba(146,64,14,.03);}
.tbl td{padding:8px 12px;text-align:right;}
.tbl td:first-child{text-align:left;}
.dk .tbl tr:nth-child(even) td{background:rgba(245,158,11,.015);}
.lt .tbl tr:nth-child(even) td{background:rgba(146,64,14,.015);}
.dk .tbl tr:hover td{background:rgba(245,158,11,.04);}
.lt .tbl tr:hover td{background:rgba(146,64,14,.03);}
.dk .tbl td{border-bottom:1px solid rgba(245,158,11,.04);}
.lt .tbl td{border-bottom:1px solid rgba(146,64,14,.05);}

.hist-row{padding:11px 15px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all .13s;}
.dk .hist-row{border:1px solid var(--bdr);border-radius:4px;background:var(--s2);}
.dk .hist-row:hover{border-color:var(--acc);background:rgba(245,158,11,.05);}
.lt .hist-row{border:1.5px solid var(--bdr);border-radius:10px;background:var(--s1);}
.lt .hist-row:hover{border-color:var(--acc);}

.share-render{padding:22px 26px;border-radius:10px;
  background:linear-gradient(135deg,#0e0c09 0%,#1c1a12 60%,#0e0c09 100%);
  border:1px solid rgba(245,158,11,.22);}

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

/* ─── CONSTANTS ───────────────────────────────────────────────── */
const CURRENCIES = [
  { sym:'₹', code:'INR', name:'Indian Rupee',    locale:'en-IN' },
  { sym:'$', code:'USD', name:'US Dollar',        locale:'en-US' },
  { sym:'£', code:'GBP', name:'British Pound',    locale:'en-GB' },
  { sym:'€', code:'EUR', name:'Euro',             locale:'de-DE' },
  { sym:'¥', code:'JPY', name:'Japanese Yen',     locale:'ja-JP' },
];

const PRESETS = [
  { icon:'🏠', label:'Home Loan',     rate:8.5,  years:20, principal:5000000 },
  { icon:'🚗', label:'Car Loan',      rate:9.5,  years:5,  principal:800000  },
  { icon:'💼', label:'Personal Loan', rate:13.0, years:3,  principal:300000  },
  { icon:'🎓', label:'Education',     rate:9.0,  years:7,  principal:500000  },
  { icon:'🏢', label:'Business',      rate:11.5, years:10, principal:2000000 },
];

const TABS = [
  { id:'emi',      icon:'◈', label:'EMI' },
  { id:'schedule', icon:'⊞', label:'Schedule' },
  { id:'compare',  icon:'⇄', label:'Compare' },
  { id:'prepay',   icon:'↑', label:'Prepayment' },
  { id:'afford',   icon:'⚖', label:'Affordability' },
  { id:'refi',     icon:'↻', label:'Refinance' },
  { id:'history',  icon:'⌛', label:'History' },
  { id:'learn',    icon:'∑', label:'Learn' },
];

/* ─── MATH HELPERS ────────────────────────────────────────────── */
const calcEMI = (p, annualRate, yrs) => {
  if(!p||!annualRate||!yrs) return 0;
  const r = annualRate / 12 / 100;
  const n = yrs * 12;
  if(r === 0) return p / n;
  return p * r * Math.pow(1+r, n) / (Math.pow(1+r, n) - 1);
};

const buildSchedule = (p, annualRate, yrs) => {
  const r = annualRate / 12 / 100;
  const n = yrs * 12;
  const emi = calcEMI(p, annualRate, yrs);
  let bal = p, rows = [], yearData = [];
  let yInt = 0, yPrin = 0;

  for(let i = 1; i <= n; i++) {
    const intPart  = bal * r;
    const prinPart = emi - intPart;
    bal = Math.max(0, bal - prinPart);
    yInt  += intPart;
    yPrin += prinPart;
    rows.push({ month:i, emi, interest:intPart, principal:prinPart, balance:bal });
    if(i % 12 === 0 || i === n) {
      yearData.push({ year:Math.ceil(i/12), interest:yInt, principal:yPrin, balance:bal });
      yInt = 0; yPrin = 0;
    }
  }
  return { rows, yearData, emi, total:emi*n, totalInt:emi*n-p };
};

const buildPrepaySchedule = (p, annualRate, yrs, prepayAmt, prepayMonth, monthlyExtra = 0) => {
  const r   = annualRate / 12 / 100;
  const emi = calcEMI(p, annualRate, yrs);
  let bal = p, totalPaid = 0, month = 0;
  while(bal > 0.01 && month < yrs*12*2) {
    month++;
    const intPart  = bal * r;
    const prinPart = Math.min(bal, emi - intPart);
    bal -= prinPart;
    totalPaid += emi;
    if(month === prepayMonth && prepayAmt > 0) { bal = Math.max(0, bal - prepayAmt); totalPaid += prepayAmt; }
    if(monthlyExtra > 0 && month > 1) bal = Math.max(0, bal - monthlyExtra);
  }
  return { months: month, totalPaid, saved: (emi*yrs*12) - totalPaid + prepayAmt, savedMonths: yrs*12 - month };
};

/* Indian number formatting */
const fmtIN = (n) => {
  if(n >= 1e7) return `${(n/1e7).toFixed(2)} Cr`;
  if(n >= 1e5) return `${(n/1e5).toFixed(2)} L`;
  return Math.round(n).toLocaleString('en-IN');
};

const fmtCurrency = (n, cur) => {
  const c = CURRENCIES.find(x=>x.code===cur)||CURRENCIES[0];
  if(cur==='INR') return `${c.sym}${fmtIN(n)}`;
  if(n>=1e9) return `${c.sym}${(n/1e9).toFixed(2)}B`;
  if(n>=1e6) return `${c.sym}${(n/1e6).toFixed(2)}M`;
  return `${c.sym}${Math.round(n).toLocaleString(c.locale)}`;
};

/* ─── MAIN ────────────────────────────────────────────────────── */
export default function EMICalculator() {
  const [dark,  setDark]  = useState(true);
  const [tab,   setTab]   = useState('emi');
  const [mob,   setMob]   = useState(false);
  const [cur,   setCur]   = useState('INR');

  /* main loan inputs */
  const [principal, setPrincipal] = useState(2500000);
  const [rate,      setRate]      = useState(8.5);
  const [years,     setYears]     = useState(20);

  /* prepayment */
  const [prepayAmt,   setPrepayAmt]   = useState(200000);
  const [prepayMonth, setPrepayMonth] = useState(12);
  const [monthlyExtra,setMonthlyExtra]= useState(0);

  /* refinance */
  const [refiRate,  setRefiRate]  = useState(7.5);
  const [refiYears, setRefiYears] = useState(15);
  const [refiCost,  setRefiCost]  = useState(10000);

  /* affordability */
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [emiBudgetPct,  setEmibudgetPct]  = useState(40);
  const [affordRate,    setAffordRate]    = useState(8.5);
  const [affordYears,   setAffordYears]   = useState(20);

  /* compare loans */
  const [loans, setLoans] = useState([
    { principal:2500000, rate:8.5,  years:20 },
    { principal:2500000, rate:9.5,  years:15 },
    { principal:2500000, rate:10.5, years:10 },
  ]);

  /* share */
  const [showCard, setShowCard] = useState(false);
  const [copied,   setCopied]   = useState(false);

  /* history */
  const [hist, setHist] = useState([]);

  const dk = dark;
  const fmt = useCallback((n) => fmtCurrency(n, cur), [cur]);
  const curSym = CURRENCIES.find(x=>x.code===cur)?.sym||'₹';

  /* ── derived ── */
  const sched = useMemo(() => buildSchedule(principal, rate, years), [principal, rate, years]);
  const { emi, total, totalInt, rows, yearData } = sched;

  const prepSched = useMemo(() =>
    buildPrepaySchedule(principal, rate, years, prepayAmt, prepayMonth, monthlyExtra),
    [principal, rate, years, prepayAmt, prepayMonth, monthlyExtra]);

  const refiEmi   = useMemo(() => calcEMI(principal, refiRate, refiYears), [principal, refiRate, refiYears]);
  const refiTotal = useMemo(() => refiEmi * refiYears * 12, [refiEmi, refiYears]);
  const refiSaved = total - refiTotal - refiCost;
  const breakEven = refiCost / (emi - refiEmi); // months

  const affordEmi    = useMemo(() => monthlyIncome * emiBudgetPct / 100, [monthlyIncome, emiBudgetPct]);
  const affordMaxLoan= useMemo(() => {
    const r = affordRate/12/100, n = affordYears*12;
    if(r===0) return affordEmi*n;
    return affordEmi * (Math.pow(1+r,n)-1) / (r*Math.pow(1+r,n));
  }, [affordEmi, affordRate, affordYears]);

  const intPct = emi ? Math.round(totalInt/total*100) : 0;
  const prinPct= 100 - intPct;

  /* auto-save history */
  useEffect(() => {
    if(!emi) return;
    const entry = {
      id:Date.now(), emi:Math.round(emi), principal, rate, years,
      total:Math.round(total), totalInt:Math.round(totalInt), cur,
      time:new Date().toLocaleTimeString()
    };
    setHist(h => [entry, ...h.filter(x=>x.principal!==principal||x.rate!==rate||x.years!==years)].slice(0,8));
  }, [emi]); // eslint-disable-line

  const shareText = emi
    ? `EMI: ${fmt(emi)}/month\nLoan: ${fmt(principal)} @ ${rate}% for ${years} years\nTotal Payment: ${fmt(total)}\nTotal Interest: ${fmt(totalInt)}\nemi.calc`
    : '';
  const doCopy = () => { navigator.clipboard?.writeText(shareText); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  /* ── helper components ── */
  const SC = ({lbl,val,sub,col,span}) => (
    <div className="scard" style={span?{gridColumn:`span ${span}`}:{}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.16em',textTransform:'uppercase',color:'var(--tx3)'}}>{lbl}</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:col||'var(--acc)',lineHeight:1.1,letterSpacing:'-.02em'}}>{val}</div>
      {sub&&<div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx2)'}}>{sub}</div>}
    </div>
  );

  const SliderRow = ({lbl, val, min, max, step, disp, onChange}) => (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
        <div className="lbl" style={{margin:0}}>{lbl}</div>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--acc)',fontWeight:700}}>{disp}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val} className="range" onChange={e=>onChange(+e.target.value)}/>
      <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'DM Mono',monospace",fontSize:8,color:'var(--tx3)',marginTop:3}}>
        <span>{fmtCurrency(min,cur)}</span><span>{fmtCurrency(max,cur)}</span>
      </div>
    </div>
  );

  /* ── Animated SVG Donut ── */
  const Donut = ({pPct, iPct, size=180}) => {
    const R=60, cx=size/2, cy=size/2;
    const circ = 2*Math.PI*R;
    const pDash = circ * pPct / 100;
    const iDash = circ * iPct / 100;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={dk?'rgba(245,158,11,.08)':'rgba(146,64,14,.1)'} strokeWidth="22"/>
        {/* interest arc */}
        <motion.circle cx={cx} cy={cy} r={R} fill="none" stroke="#f87171" strokeWidth="22"
          strokeDasharray={`${iDash} ${circ - iDash}`}
          strokeDashoffset={circ*0.25}
          strokeLinecap="butt"
          initial={{strokeDasharray:`0 ${circ}`}}
          animate={{strokeDasharray:`${iDash} ${circ-iDash}`}}
          transition={{duration:.9,ease:'easeOut'}}/>
        {/* principal arc */}
        <motion.circle cx={cx} cy={cy} r={R} fill="none" stroke="#34d399" strokeWidth="22"
          strokeDasharray={`${pDash} ${circ - pDash}`}
          strokeDashoffset={circ*0.25 - iDash}
          strokeLinecap="butt"
          initial={{strokeDasharray:`0 ${circ}`}}
          animate={{strokeDasharray:`${pDash} ${circ-pDash}`}}
          transition={{duration:.9,ease:'easeOut',delay:.2}}/>
        {/* center text */}
        <text x={cx} y={cy-8} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8.5" fill="var(--tx3)" letterSpacing="1.5">MONTHLY EMI</text>
        <text x={cx} y={cy+8} textAnchor="middle" fontFamily="'Syne',sans-serif" fontWeight="900" fontSize="17" fill="var(--acc)">{fmt(emi)}</text>
        <text x={cx} y={cy+22} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">per month</text>
      </svg>
    );
  };

  /* ── SVG Stacked Area Chart (Schedule) ── */
  const AreaChart = ({data, W=420, H=140}) => {
    if(!data||data.length<2) return null;
    const maxVal = Math.max(...data.map(d=>d.interest+d.principal));
    const sx = (i) => (i/(data.length-1))*W;
    const sy = (v) => H - (v/maxVal)*H;

    const intPath  = data.map((d,i)=>`${i===0?'M':'L'}${sx(i).toFixed(1)},${sy(d.interest).toFixed(1)}`).join(' ');
    const totPath  = data.map((d,i)=>`${i===0?'M':'L'}${sx(i).toFixed(1)},${sy(d.interest+d.principal).toFixed(1)}`).join(' ');
    const intFill  = `${intPath} L${W},${H} L0,${H} Z`;
    const totFill  = `${totPath} L${W},${H} L0,${H} Z`;

    return (
      <svg viewBox={`0 0 ${W} ${H+30}`} style={{width:'100%',height:'auto',overflow:'visible'}}>
        <defs>
          <linearGradient id="totGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity=".4"/>
            <stop offset="100%" stopColor="#34d399" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="intGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f87171" stopOpacity=".4"/>
            <stop offset="100%" stopColor="#f87171" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={totFill} fill="url(#totGrad)"/>
        <path d={intFill} fill="url(#intGrad)"/>
        <motion.path d={totPath} fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round"
          initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.2,ease:'easeInOut'}}/>
        <motion.path d={intPath} fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round"
          initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.2,ease:'easeInOut',delay:.2}}/>
        {/* year labels */}
        {data.filter((_,i)=>i%Math.max(1,Math.floor(data.length/5))===0||i===data.length-1).map((d,j)=>(
          <text key={j} x={sx(data.indexOf(d))} y={H+16}
            textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8.5" fill="var(--tx3)">Yr {d.year}</text>
        ))}
        {/* legend */}
        <circle cx="6" cy="6" r="4" fill="#34d399"/>
        <text x="14" y="10" fontFamily="'DM Mono',monospace" fontSize="8.5" fill="var(--tx3)">Principal</text>
        <circle cx="74" cy="6" r="4" fill="#f87171"/>
        <text x="82" y="10" fontFamily="'DM Mono',monospace" fontSize="8.5" fill="var(--tx3)">Interest</text>
      </svg>
    );
  };

  /* ── Comparison Bar Chart ── */
  const BarChart = ({loanData, W=380, H=120}) => {
    const maxTotal = Math.max(...loanData.map(l=>l.total));
    return (
      <svg viewBox={`0 0 ${W} ${H+30}`} style={{width:'100%',height:'auto'}}>
        {loanData.map((l,i)=>{
          const bW    = (W - 40) / loanData.length - 12;
          const bX    = 20 + i*(bW+12);
          const tH    = (l.total/maxTotal)*H;
          const pH    = (l.principal/maxTotal)*H;
          const iH    = tH - pH;
          return (
            <g key={i}>
              {/* principal bar */}
              <motion.rect x={bX} y={H-pH} width={bW} height={pH} fill="#34d399" rx="2"
                initial={{height:0,y:H}} animate={{height:pH,y:H-pH}} transition={{duration:.8,delay:i*.12,ease:'easeOut'}}/>
              {/* interest bar */}
              <motion.rect x={bX} y={H-tH} width={bW} height={iH} fill="#f87171" rx="2"
                initial={{height:0,y:H-pH}} animate={{height:iH,y:H-tH}} transition={{duration:.8,delay:i*.12+.1,ease:'easeOut'}}/>
              <text x={bX+bW/2} y={H+14} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8.5" fill="var(--tx3)">Loan {i+1}</text>
              <text x={bX+bW/2} y={H-tH-5} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--acc)">{fmt(Math.round(l.total))}</text>
            </g>
          );
        })}
        <circle cx="8" cy="8" r="4" fill="#34d399"/>
        <text x="16" y="12" fontFamily="'DM Mono',monospace" fontSize="8.5" fill="var(--tx3)">Principal</text>
        <circle cx="76" cy="8" r="4" fill="#f87171"/>
        <text x="84" y="12" fontFamily="'DM Mono',monospace" fontSize="8.5" fill="var(--tx3)">Interest</text>
      </svg>
    );
  };

  /* ── Dual timeline for prepayment ── */
  const DualLine = ({orig, withPre, W=400, H=110}) => {
    if(!orig||!withPre) return null;
    const maxMo = orig.months;
    const maxBal= principal;
    const buildPts = (arr) => arr.map((p,i) => ({ i, bal:p }));

    // build balance arrays
    const r = rate/12/100, emi_ = emi;
    let balO=principal, balP=principal;
    const origPts=[principal], prePts=[principal];
    for(let m=1;m<=maxMo;m++){
      balO=Math.max(0,balO-(emi_-balO*r)); origPts.push(+balO.toFixed(0));
      balP=Math.max(0,balP-(emi_-balP*r));
      if(m===prepayMonth) balP=Math.max(0,balP-prepayAmt);
      if(monthlyExtra>0&&m>1) balP=Math.max(0,balP-monthlyExtra);
      prePts.push(+balP.toFixed(0));
    }
    const sx = i => (i/maxMo)*W;
    const sy = v => H - (v/maxBal)*H;
    const pathOf = pts => pts.map((v,i)=>`${i===0?'M':'L'}${sx(i).toFixed(1)},${sy(v).toFixed(1)}`).join(' ');
    const pathO = pathOf(origPts), pathP = pathOf(prePts);
    return (
      <svg viewBox={`0 0 ${W} ${H+28}`} style={{width:'100%',height:'auto',overflow:'visible'}}>
        <defs>
          <linearGradient id="origGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f87171" stopOpacity=".18"/>
            <stop offset="100%" stopColor="#f87171" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="preGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity=".18"/>
            <stop offset="100%" stopColor="#34d399" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={`${pathO} L${W},${H} L0,${H} Z`} fill="url(#origGrad)"/>
        <path d={`${pathP} L${W},${H} L0,${H} Z`} fill="url(#preGrad)"/>
        <motion.path d={pathO} fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round"
          initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.2,ease:'easeInOut'}}/>
        <motion.path d={pathP} fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round"
          initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:1.2,ease:'easeInOut',delay:.15}}/>
        {/* year markers */}
        {Array.from({length:Math.floor(maxMo/12)+1},(_,i)=>i).filter(y=>y%5===0).map(y=>(
          <text key={y} x={sx(y*12)} y={H+16} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8.5" fill="var(--tx3)">Yr {y}</text>
        ))}
        {/* legend */}
        <circle cx="6"  cy="6" r="4" fill="#f87171"/>
        <text x="14" y="10" fontFamily="'DM Mono',monospace" fontSize="8.5" fill="var(--tx3)">Without prepayment</text>
        <circle cx="130" cy="6" r="4" fill="#34d399"/>
        <text x="138" y="10" fontFamily="'DM Mono',monospace" fontSize="8.5" fill="var(--tx3)">With prepayment</text>
      </svg>
    );
  };

  /* ════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{S}</style>
      <div className={dk?'dk':'lt'}>
        <div className={`mob-overlay ${mob?'show':''}`} onClick={()=>setMob(false)}/>

        {/* ════ TOPBAR ════ */}
        <div className="topbar">
          <button className="btn-ghost mob-btn" onClick={()=>setMob(s=>!s)} style={{padding:'5px 8px',fontSize:14}}>☰</button>

          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',
              borderRadius:dk?4:9,
              background:dk?'rgba(245,158,11,.1)':'linear-gradient(135deg,#92400e,#b45309)',
              border:dk?'1px solid rgba(245,158,11,.35)':'none',
              boxShadow:dk?'0 0 16px rgba(245,158,11,.25)':'0 3px 10px rgba(146,64,14,.4)'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={dk?'#f59e0b':'#fff'} strokeWidth="2.2" strokeLinecap="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
              </svg>
            </div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:16,letterSpacing:'-.01em',color:'var(--tx)'}}>
              EMI<span style={{color:'var(--acc)'}}>.calc</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontWeight:400,fontSize:8,letterSpacing:'.15em',color:'var(--tx3)',marginLeft:7,verticalAlign:'middle'}}>v2</span>
            </span>
          </div>

          <div style={{flex:1}}/>

          {/* currency selector */}
          <select className="sel" value={cur} onChange={e=>setCur(e.target.value)}
            style={{width:'auto',padding:'4px 8px',fontSize:10.5}}>
            {CURRENCIES.map(c=><option key={c.code} value={c.code}>{c.sym} {c.code}</option>)}
          </select>

          {/* live pill */}
          {emi>0&&(
            <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
              style={{display:'flex',alignItems:'center',gap:6,padding:'4px 11px',
                borderRadius:dk?3:20,border:dk?'1px solid rgba(245,158,11,.2)':'1.5px solid rgba(146,64,14,.18)',
                background:dk?'rgba(245,158,11,.05)':'rgba(146,64,14,.04)'}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:'var(--acc)',boxShadow:dk?'0 0 6px var(--acc)':'none'}}/>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx2)',letterSpacing:'.06em'}}>
                {fmt(emi)}/mo · {fmt(principal)} @ {rate}% · {years}yr
              </span>
            </motion.div>
          )}

          <button onClick={()=>setDark(d=>!d)}
            style={{display:'flex',alignItems:'center',gap:5,padding:'4px 10px',
              border:dk?'1px solid rgba(245,158,11,.18)':'1.5px solid var(--bdr)',
              borderRadius:dk?3:7,background:'transparent',cursor:'pointer',transition:'all .14s'}}>
            <div style={{width:28,height:15,borderRadius:8,position:'relative',
              background:dk?'var(--acc)':'#d6cfc0',boxShadow:dk?'0 0 8px rgba(245,158,11,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dk?'auto':2,right:dk?2:'auto',
                width:10,height:10,borderRadius:'50%',background:dk?'#0e0c09':'white',transition:'all .2s'}}/>
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
            

            {emi>0&&(
              <div>
                <div className="sec-lbl">Loan Summary</div>
                {[
                  ['EMI',         fmt(emi),      'var(--acc)'],
                  ['Principal',   fmt(principal),'var(--tx2)'],
                  ['Interest Rate',`${rate}%`,   'var(--tx2)'],
                  ['Tenure',      `${years} yrs`,'var(--tx2)'],
                  ['Total Payment',fmt(total),   'var(--er)'],
                  ['Total Interest',fmt(totalInt),'var(--er)'],
                  ['Interest %',  `${intPct}%`,  'var(--er)'],
                  ['Principal %', `${prinPct}%`, 'var(--lo)'],
                ].map(([l,v,c])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                    padding:'5px 0',borderBottom:dk?'1px solid rgba(245,158,11,.05)':'1px solid rgba(146,64,14,.06)'}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)'}}>{l}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:c,fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* presets */}
            <div>
              <div className="sec-lbl">Loan Presets</div>
              {PRESETS.map(p=>(
                <button key={p.label} className="btn-ghost"
                  onClick={()=>{ setPrincipal(p.principal); setRate(p.rate); setYears(p.years); setTab('emi'); }}
                  style={{width:'100%',justifyContent:'flex-start',marginBottom:4,padding:'6px 9px',gap:7}}>
                  <span style={{fontSize:13}}>{p.icon}</span>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontSize:10.5,fontWeight:600}}>{p.label}</div>
                    <div style={{fontSize:8.5,opacity:.55,textTransform:'none',letterSpacing:0}}>{p.rate}% · {p.years}yr</div>
                  </div>
                </button>
              ))}
            </div>

            
          </div>

          {/* ── MAIN ── */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══════════ EMI TAB ══════════ */}
              {tab==='emi'&&(
                <motion.div key="emi" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}} style={{display:'flex',flexDirection:'column',gap:14}}>

                  {/* loan input sliders */}
                  <div className="panel" style={{padding:'18px 22px'}}>
                    <div className="lbl" style={{marginBottom:14}}>◈ Loan Parameters</div>
                    <div style={{display:'flex',flexDirection:'column',gap:18}}>
                      <SliderRow lbl={`Principal Amount (${curSym})`} val={principal} min={10000} max={50000000} step={10000}
                        disp={fmt(principal)} onChange={setPrincipal}/>
                      <div>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                          <div className="lbl" style={{margin:0}}>Annual Interest Rate</div>
                          <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--acc)',fontWeight:700}}>{rate}%</span>
                        </div>
                        <input type="range" min={1} max={30} step={0.1} value={rate} className="range" onChange={e=>setRate(+e.target.value)}/>
                        <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'DM Mono',monospace",fontSize:8,color:'var(--tx3)',marginTop:3}}>
                          <span>1%</span><span>30%</span>
                        </div>
                      </div>
                      <div>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                          <div className="lbl" style={{margin:0}}>Loan Tenure</div>
                          <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--acc)',fontWeight:700}}>{years} years ({years*12} months)</span>
                        </div>
                        <input type="range" min={1} max={30} step={1} value={years} className="range" onChange={e=>setYears(+e.target.value)}/>
                        <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'DM Mono',monospace",fontSize:8,color:'var(--tx3)',marginTop:3}}>
                          <span>1 yr</span><span>30 yrs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hero result */}
                  <div className="panel-hi" style={{padding:'24px 28px'}}>
                    <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:28,alignItems:'center'}}>
                      <Donut pPct={prinPct} iPct={intPct}/>
                      <div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.22em',textTransform:'uppercase',color:'var(--tx3)',marginBottom:8}}>Monthly EMI</div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:60,color:'var(--acc)',lineHeight:1,letterSpacing:'-.03em'}}>{fmt(emi)}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10.5,color:'var(--tx3)',marginTop:6,marginBottom:18}}>per month for {years} years</div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                          <div>
                            <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:3}}>
                              <div style={{width:8,height:8,borderRadius:'50%',background:'#34d399'}}/>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'var(--tx3)',letterSpacing:'.1em',textTransform:'uppercase'}}>Principal</div>
                            </div>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,color:'#34d399'}}>{fmt(principal)}</div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)'}}>{prinPct}% of total</div>
                          </div>
                          <div>
                            <div style={{display:'flex',alignItems:'center',gap:5,marginBottom:3}}>
                              <div style={{width:8,height:8,borderRadius:'50%',background:'#f87171'}}/>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'var(--tx3)',letterSpacing:'.1em',textTransform:'uppercase'}}>Interest</div>
                            </div>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,color:'#f87171'}}>{fmt(totalInt)}</div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)'}}>{intPct}% of total</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4-stat grid */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}} className="g4">
                    <SC lbl="Monthly EMI"     val={fmt(emi)}      sub="equated monthly instalment"/>
                    <SC lbl="Total Payment"   val={fmt(total)}    sub={`over ${years*12} months`} col="var(--er)"/>
                    <SC lbl="Total Interest"  val={fmt(totalInt)} sub={`${intPct}% of total`}     col="var(--er)"/>
                    <SC lbl="Total Principal" val={fmt(principal)} sub={`${prinPct}% of total`}   col="var(--lo)"/>
                  </div>

                  {/* Share */}
                  <div className="panel" style={{padding:'14px 18px'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div className="lbl" style={{margin:0}}>⊕ Share / Export</div>
                      <div style={{display:'flex',gap:8}}>
                        <button className="btn-ghost" onClick={doCopy}>{copied?'✓ Copied':'⎘ Copy'}</button>
                        <button className={`btn-ghost ${showCard?'on':''}`} onClick={()=>setShowCard(s=>!s)}>▣ Card</button>
                      </div>
                    </div>
                    <AnimatePresence>
                      {showCard&&(
                        <motion.div initial={{opacity:0,height:0,marginTop:0}} animate={{opacity:1,height:'auto',marginTop:14}} exit={{opacity:0,height:0,marginTop:0}}>
                          <div className="share-render">
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.24em',textTransform:'uppercase',color:'rgba(245,158,11,.45)',marginBottom:14}}>EMI.CALC · RESULT CARD</div>
                            <div style={{display:'flex',alignItems:'flex-end',gap:16,marginBottom:18}}>
                              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:52,color:'var(--acc)',lineHeight:1}}>{fmt(emi)}</div>
                              <div style={{paddingBottom:5}}>
                                <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'#fef3c7',fontWeight:700,marginBottom:3}}>per month</div>
                                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'rgba(254,243,199,.5)'}}>{years} years · {rate}% p.a.</div>
                              </div>
                            </div>
                            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
                              {[['Loan Amount',fmt(principal)],['Total Payment',fmt(total)],['Interest Cost',fmt(totalInt)]].map(([l,v])=>(
                                <div key={l}>
                                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(245,158,11,.4)',marginBottom:3}}>{l}</div>
                                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:15,color:'#fef3c7'}}>{v}</div>
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

              {/* ══════════ SCHEDULE TAB ══════════ */}
              {tab==='schedule'&&(
                <motion.div key="sched" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>

                  {/* area chart */}
                  <div className="panel" style={{padding:'18px 22px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                      <div className="lbl" style={{margin:0}}>⊞ Yearly Balance Breakdown</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx3)'}}>{years} years · {yearData.length} data points</div>
                    </div>
                    <AreaChart data={yearData}/>
                  </div>

                  {/* yearly summary table */}
                  <div className="panel" style={{padding:0,overflow:'hidden'}}>
                    <div style={{padding:'14px 16px',borderBottom:dk?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>
                      <div className="lbl" style={{margin:0}}>⊞ Year-by-Year Amortisation</div>
                    </div>
                    <div style={{overflowX:'auto'}}>
                      <table className="tbl">
                        <thead>
                          <tr>
                            {['Year','EMI Paid','Principal','Interest','Balance Remaining'].map(h=>(
                              <th key={h}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {yearData.map((r,i)=>(
                            <tr key={i}>
                              <td style={{color:'var(--tx2)',fontWeight:600}}>{r.year}</td>
                              <td style={{color:'var(--tx2)'}}>{fmt(emi*12)}</td>
                              <td style={{color:'#34d399'}}>{fmt(r.principal)}</td>
                              <td style={{color:'#f87171'}}>{fmt(r.interest)}</td>
                              <td style={{color:'var(--acc)',fontWeight:600}}>{fmt(r.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* monthly detail (first 24 months) */}
                  <div className="panel" style={{padding:0,overflow:'hidden'}}>
                    <div style={{padding:'14px 16px',borderBottom:dk?'1px solid var(--bdr)':'1.5px solid var(--bdr)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div className="lbl" style={{margin:0}}>⊞ Monthly Detail (first 24 months)</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)'}}>Reducing balance method</div>
                    </div>
                    <div style={{overflowX:'auto',maxHeight:320,overflowY:'auto'}}>
                      <table className="tbl">
                        <thead style={{position:'sticky',top:0}}>
                          <tr>
                            {['Month','EMI','Principal','Interest','Balance'].map(h=>(
                              <th key={h} style={{position:'sticky',top:0,background:dk?'#141209':'#faf8f2'}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {rows.slice(0,24).map((r,i)=>(
                            <tr key={i}>
                              <td style={{color:'var(--tx2)',fontWeight:600}}>{r.month}</td>
                              <td style={{color:'var(--tx2)'}}>{fmt(r.emi)}</td>
                              <td style={{color:'#34d399'}}>{fmt(r.principal)}</td>
                              <td style={{color:'#f87171'}}>{fmt(r.interest)}</td>
                              <td style={{color:'var(--acc)',fontWeight:600}}>{fmt(r.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ COMPARE TAB ══════════ */}
              {tab==='compare'&&(
                <motion.div key="cmp" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="hint"><span>⇄</span><span>Compare up to 3 loan scenarios side by side. Edit any value below.</span></div>

                  {/* loan inputs */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}} className="g3">
                    {loans.map((l,i)=>{
                      const lEmi   = calcEMI(l.principal, l.rate, l.years);
                      const lTotal = lEmi * l.years * 12;
                      const lInt   = lTotal - l.principal;
                      const upd    = (k,v) => setLoans(prev=>prev.map((x,j)=>j===i?{...x,[k]:v}:x));
                      const colors = ['var(--acc)','var(--info)','var(--lo)'];
                      return (
                        <div key={i} className="panel" style={{padding:'16px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:12}}>
                            <div style={{width:8,height:8,borderRadius:'50%',background:colors[i]}}/>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,letterSpacing:'.12em',textTransform:'uppercase',color:colors[i],fontWeight:700}}>Loan {i+1}</div>
                          </div>
                          {[
                            ['Amount',    l.principal, 10000,   50000000, 10000,  v=>upd('principal',v)],
                            ['Rate (%)',  l.rate,      1,       30,       0.1,    v=>upd('rate',v)],
                            ['Years',     l.years,     1,       30,       1,      v=>upd('years',v)],
                          ].map(([lbl,val,min,max,step,fn])=>(
                            <div key={lbl} style={{marginBottom:10}}>
                              <div className="lbl">{lbl}</div>
                              <input className="inp" type="number" min={min} max={max} step={step} value={val}
                                onChange={e=>fn(+e.target.value)} style={{fontSize:11}}/>
                            </div>
                          ))}
                          <div style={{borderTop:dk?'1px solid var(--bdr)':'1.5px solid var(--bdr)',paddingTop:10}}>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:colors[i]}}>{fmt(lEmi)}<span style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:'var(--tx3)'}}>/mo</span></div>
                            <div style={{display:'flex',flexDirection:'column',gap:4,marginTop:8}}>
                              {[['Total',fmt(lTotal),'var(--tx2)'],['Interest',fmt(lInt),'#f87171']].map(([lbl2,v,c])=>(
                                <div key={lbl2} style={{display:'flex',justifyContent:'space-between'}}>
                                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)'}}>{lbl2}</span>
                                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:c,fontWeight:600}}>{v}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* comparison bar chart */}
                  <div className="panel" style={{padding:'18px 22px'}}>
                    <div className="lbl" style={{marginBottom:16}}>⇄ Total Cost Comparison</div>
                    <BarChart loanData={loans.map(l=>{
                      const e=calcEMI(l.principal,l.rate,l.years);
                      return {principal:l.principal, total:e*l.years*12};
                    })}/>
                  </div>

                  {/* best deal */}
                  {(()=>{
                    const withEmi = loans.map((l,i)=>({...l,i,emi:calcEMI(l.principal,l.rate,l.years),total:calcEMI(l.principal,l.rate,l.years)*l.years*12}));
                    const cheapest = withEmi.reduce((a,b)=>a.total<b.total?a:b);
                    return (
                      <div className="hint" style={{borderColor:'rgba(52,211,153,.3)',borderLeftColor:'var(--lo)'}}>
                        <span>✓</span>
                        <span><strong style={{color:'var(--lo)'}}>Loan {cheapest.i+1}</strong> has the lowest total cost at <strong style={{color:'var(--lo)'}}>{fmt(cheapest.total)}</strong> — saving {fmt(Math.max(...withEmi.map(l=>l.total)) - cheapest.total)} vs the most expensive option.</span>
                      </div>
                    );
                  })()}

                  
                </motion.div>
              )}

              {/* ══════════ PREPAYMENT TAB ══════════ */}
              {tab==='prepay'&&(
                <motion.div key="prepay" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>

                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}} className="g2">
                    <div className="panel" style={{padding:'16px 18px'}}>
                      <div className="lbl" style={{marginBottom:14}}>↑ One-Time Prepayment</div>
                      <div style={{display:'flex',flexDirection:'column',gap:14}}>
                        <SliderRow lbl={`Amount (${curSym})`} val={prepayAmt} min={1000} max={principal*0.8} step={1000}
                          disp={fmt(prepayAmt)} onChange={setPrepayAmt}/>
                        <div>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                            <div className="lbl" style={{margin:0}}>At Month</div>
                            <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--acc)',fontWeight:700}}>Month {prepayMonth} (Yr {Math.ceil(prepayMonth/12)})</span>
                          </div>
                          <input type="range" min={1} max={years*12-1} step={1} value={prepayMonth} className="range" onChange={e=>setPrepayMonth(+e.target.value)}/>
                        </div>
                      </div>
                    </div>
                    <div className="panel" style={{padding:'16px 18px'}}>
                      <div className="lbl" style={{marginBottom:14}}>+ Monthly Extra Payment</div>
                      <SliderRow lbl={`Extra per month (${curSym})`} val={monthlyExtra} min={0} max={emi*2} step={500}
                        disp={monthlyExtra>0?fmt(monthlyExtra):'No extra payment'} onChange={setMonthlyExtra}/>
                      <div className="hint" style={{marginTop:12}}><span>ℹ</span><span>Monthly extra payments reduce your principal faster and can dramatically cut tenure.</span></div>
                    </div>
                  </div>

                  <motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} style={{display:'flex',flexDirection:'column',gap:12}}>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}} className="g4">
                      <SC lbl="Original EMI"    val={fmt(emi)}                          sub="monthly payment"/>
                      <SC lbl="Original Total"  val={fmt(total)}                        sub={`${years*12} months`} col="var(--er)"/>
                      <SC lbl="With Prepayment" val={fmt(prepSched.totalPaid)}          sub={`${prepSched.months} months`} col="var(--lo)"/>
                      <SC lbl="Interest Saved"  val={fmt(Math.max(0,prepSched.saved))}  sub={`${prepSched.savedMonths} months earlier`} col="var(--lo)"/>
                    </div>

                    {/* dual timeline chart */}
                    <div className="panel" style={{padding:'18px 22px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                        <div className="lbl" style={{margin:0}}>↑ Outstanding Balance Over Time</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx3)'}}>Original vs With Prepayment</div>
                      </div>
                      <DualLine orig={{months:years*12}} withPre={prepSched}/>
                    </div>

                    {prepSched.savedMonths>0&&(
                      <div className="hint" style={{borderColor:'rgba(52,211,153,.3)',borderLeftColor:'var(--lo)'}}>
                        <span>✓</span>
                        <span>Prepaying <strong style={{color:'var(--lo)'}}>{fmt(prepayAmt)}</strong> at Month {prepayMonth}{monthlyExtra>0?` + ${fmt(monthlyExtra)}/mo extra`:''} saves you <strong style={{color:'var(--lo)'}}>{fmt(Math.max(0,prepSched.saved))}</strong> in interest and closes your loan <strong style={{color:'var(--lo)'}}>{prepSched.savedMonths} months</strong> earlier.</span>
                      </div>
                    )}
                  </motion.div>

                  
                </motion.div>
              )}

              {/* ══════════ AFFORDABILITY TAB ══════════ */}
              {tab==='afford'&&(
                <motion.div key="afford" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="hint"><span>⚖</span><span>Reverse EMI calculator — enter your monthly income and what % you can afford, and we'll show the maximum loan you can take.</span></div>

                  <div className="panel" style={{padding:'18px 22px'}}>
                    <div className="lbl" style={{marginBottom:16}}>⚖ Your Financial Profile</div>
                    <div style={{display:'flex',flexDirection:'column',gap:18}}>
                      <SliderRow lbl={`Monthly Income (${curSym})`} val={monthlyIncome} min={10000} max={2000000} step={5000}
                        disp={fmt(monthlyIncome)} onChange={setMonthlyIncome}/>
                      <div>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                          <div className="lbl" style={{margin:0}}>EMI as % of Income</div>
                          <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:emiBudgetPct>50?'var(--er)':emiBudgetPct>40?'var(--acc2)':'var(--acc)',fontWeight:700}}>{emiBudgetPct}%</span>
                        </div>
                        <input type="range" min={10} max={70} step={1} value={emiBudgetPct} className="range" onChange={e=>setEmibudgetPct(+e.target.value)}/>
                        <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'DM Mono',monospace",fontSize:8,color:'var(--tx3)',marginTop:3}}>
                          <span>10% (conservative)</span><span>70% (risky)</span>
                        </div>
                      </div>
                      <div>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                          <div className="lbl" style={{margin:0}}>Expected Interest Rate</div>
                          <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--acc)',fontWeight:700}}>{affordRate}%</span>
                        </div>
                        <input type="range" min={5} max={25} step={0.25} value={affordRate} className="range" onChange={e=>setAffordRate(+e.target.value)}/>
                      </div>
                      <div>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                          <div className="lbl" style={{margin:0}}>Loan Tenure</div>
                          <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--acc)',fontWeight:700}}>{affordYears} years</span>
                        </div>
                        <input type="range" min={1} max={30} step={1} value={affordYears} className="range" onChange={e=>setAffordYears(+e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  <motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} style={{display:'flex',flexDirection:'column',gap:12}}>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
                      <div className="panel-hi" style={{padding:'22px 24px',gridColumn:'span 2'}}>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.22em',textTransform:'uppercase',color:'var(--tx3)',marginBottom:8}}>Maximum Loan You Can Afford</div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:56,color:'var(--acc)',lineHeight:1,letterSpacing:'-.02em'}}>{fmt(affordMaxLoan)}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--tx2)',marginTop:8}}>at {affordEmi.toFixed(0)} {curSym}/month EMI ({emiBudgetPct}% of income)</div>
                      </div>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}} className="g4">
                      <SC lbl="Monthly Income"  val={fmt(monthlyIncome)}  sub="gross income"/>
                      <SC lbl="Max EMI Budget"  val={fmt(affordEmi)}      sub={`${emiBudgetPct}% of income`} col="var(--acc)"/>
                      <SC lbl="Max Loan Amount" val={fmt(affordMaxLoan)}  sub={`${affordRate}% · ${affordYears}yr`} col="var(--acc)"/>
                      <SC lbl="Remaining Income" val={fmt(monthlyIncome-affordEmi)} sub="after EMI" col={emiBudgetPct>50?'var(--er)':'var(--lo)'}/>
                    </div>

                    {emiBudgetPct>40&&(
                      <div className="hint" style={{borderColor:'rgba(248,113,113,.3)',borderLeftColor:'var(--er)'}}>
                        <span>⚠</span>
                        <span>EMI above <strong style={{color:'var(--er)'}}>40% of income</strong> is generally considered risky. Most lenders use 35–40% as the maximum eligible threshold. Consider a longer tenure or smaller loan to reduce EMI.</span>
                      </div>
                    )}
                  </motion.div>

                  
                </motion.div>
              )}

              {/* ══════════ REFINANCE TAB ══════════ */}
              {tab==='refi'&&(
                <motion.div key="refi" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="hint"><span>↻</span><span>See if refinancing your current loan at a lower rate actually saves money after accounting for processing fees.</span></div>

                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}} className="g2">
                    <div className="panel" style={{padding:'16px 18px'}}>
                      <div className="lbl" style={{marginBottom:14,color:'var(--er)'}}>Current Loan</div>
                      <div style={{display:'flex',flexDirection:'column',gap:10}}>
                        {[
                          ['Principal ('+curSym+')', principal, 10000, 50000000, 10000, setPrincipal],
                          ['Rate (%)',               rate,      1,     30,       0.1,   setRate],
                          ['Remaining Years',        years,     1,     30,       1,     setYears],
                        ].map(([l,v,mn,mx,st,fn])=>(
                          <div key={l}>
                            <div className="lbl">{l}</div>
                            <input className="inp" type="number" min={mn} max={mx} step={st} value={v} onChange={e=>fn(+e.target.value)}/>
                          </div>
                        ))}
                        <div style={{padding:'12px 14px',borderRadius:dk?3:8,border:dk?'1px solid rgba(248,113,113,.2)':'1.5px solid rgba(153,27,27,.2)',background:'rgba(248,113,113,.04)'}}>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)',marginBottom:3}}>Current EMI</div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:20,color:'var(--er)'}}>{fmt(emi)}<span style={{fontSize:10,fontFamily:"'DM Mono',monospace"}}>/mo</span></div>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)',marginTop:3}}>Total remaining: {fmt(total)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="panel" style={{padding:'16px 18px'}}>
                      <div className="lbl" style={{marginBottom:14,color:'var(--lo)'}}>New / Refinanced Loan</div>
                      <div style={{display:'flex',flexDirection:'column',gap:10}}>
                        {[
                          ['New Rate (%)',    refiRate,  1,   25,  0.1, setRefiRate],
                          ['New Tenure (yr)', refiYears, 1,   30,  1,   setRefiYears],
                          ['Processing Fee ('+curSym+')', refiCost, 0, 200000, 500, setRefiCost],
                        ].map(([l,v,mn,mx,st,fn])=>(
                          <div key={l}>
                            <div className="lbl">{l}</div>
                            <input className="inp" type="number" min={mn} max={mx} step={st} value={v} onChange={e=>fn(+e.target.value)}/>
                          </div>
                        ))}
                        <div style={{padding:'12px 14px',borderRadius:dk?3:8,border:dk?'1px solid rgba(52,211,153,.2)':'1.5px solid rgba(6,95,70,.2)',background:'rgba(52,211,153,.04)'}}>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)',marginBottom:3}}>New EMI</div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:20,color:'var(--lo)'}}>{fmt(refiEmi)}<span style={{fontSize:10,fontFamily:"'DM Mono',monospace"}}>/mo</span></div>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)',marginTop:3}}>Total: {fmt(refiTotal)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} style={{display:'flex',flexDirection:'column',gap:12}}>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}} className="g4">
                      <SC lbl="Old EMI"        val={fmt(emi)}              sub="current monthly"/>
                      <SC lbl="New EMI"        val={fmt(refiEmi)}          sub="after refinance" col="var(--lo)"/>
                      <SC lbl="Monthly Saving" val={fmt(emi-refiEmi)}      sub="per month" col={emi>refiEmi?'var(--lo)':'var(--er)'}/>
                      <SC lbl="Net Saving"     val={fmt(Math.abs(refiSaved))} sub={refiSaved>0?'after fees':'extra cost'} col={refiSaved>0?'var(--lo)':'var(--er)'}/>
                    </div>

                    <div className="panel" style={{padding:'18px 22px'}}>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:20}}>
                        <div>
                          <div className="lbl">Old Total Payment</div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:'var(--er)'}}>{fmt(total)}</div>
                        </div>
                        <div style={{textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:20,color:'var(--tx3)'}}>→</div>
                          {emi>refiEmi
                            ? <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--lo)',marginTop:4}}>Break-even: {Math.ceil(breakEven)} months</div>
                            : <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--er)',marginTop:4}}>Not beneficial</div>
                          }
                        </div>
                        <div style={{textAlign:'right'}}>
                          <div className="lbl" style={{textAlign:'right'}}>New Total Payment</div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:'var(--lo)'}}>{fmt(refiTotal)}</div>
                        </div>
                      </div>
                    </div>

                    {refiSaved>0
                      ? <div className="hint" style={{borderColor:'rgba(52,211,153,.3)',borderLeftColor:'var(--lo)'}}>
                          <span>✓</span>
                          <span>Refinancing saves <strong style={{color:'var(--lo)'}}>{fmt(refiSaved)}</strong> net (after {fmt(refiCost)} fee). Break-even point: <strong style={{color:'var(--lo)'}}>{Math.ceil(breakEven)} months</strong>. If you stay in the loan longer than {Math.ceil(breakEven)} months, refinancing is beneficial.</span>
                        </div>
                      : <div className="hint" style={{borderColor:'rgba(248,113,113,.3)',borderLeftColor:'var(--er)'}}>
                          <span>⚠</span>
                          <span>Refinancing at these terms does <strong style={{color:'var(--er)'}}>not save money</strong> after accounting for the processing fee. Consider negotiating a lower rate or reducing the fee.</span>
                        </div>
                    }
                  </motion.div>

                  
                </motion.div>
              )}

              {/* ══════════ HISTORY TAB ══════════ */}
              {tab==='history'&&(
                <motion.div key="hist" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:10}}>
                  <div className="hint"><span>⌛</span><span>Auto-saved every time you change loan parameters. Click any row to recall.</span></div>
                  {hist.length===0
                    ? <div style={{textAlign:'center',padding:'64px 24px',fontFamily:"'DM Mono',monospace",fontSize:13,color:'var(--tx3)'}}>No calculations yet — adjust sliders on the ◈ EMI tab.</div>
                    : hist.map((h,i)=>(
                        <motion.div key={h.id} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*.04}}
                          className="hist-row"
                          onClick={()=>{ setPrincipal(h.principal); setRate(h.rate); setYears(h.years); setTab('emi'); }}>
                          <div style={{width:11,height:11,borderRadius:'50%',background:'var(--acc)',flexShrink:0,boxShadow:dk?'0 0 8px var(--acc)':'none'}}/>
                          <div style={{flex:1}}>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,color:'var(--tx)',marginBottom:2}}>
                              {fmtCurrency(h.principal,h.cur)} @ {h.rate}% · {h.years} yrs
                            </div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx2)'}}>Total: {fmtCurrency(h.total,h.cur)} · Interest: {fmtCurrency(h.totalInt,h.cur)}</div>
                          </div>
                          <div style={{textAlign:'right'}}>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,color:'var(--acc)'}}>{fmtCurrency(h.emi,h.cur)}<span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)'}}>/mo</span></div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,color:'var(--tx3)'}}>{h.time}</div>
                          </div>
                        </motion.div>
                      ))
                  }
                  {hist.length>0&&<button className="btn-ghost" onClick={()=>setHist([])} style={{alignSelf:'flex-start',marginTop:6}}>✕ Clear History</button>}
                  
                </motion.div>
              )}

              {/* ══════════ LEARN TAB ══════════ */}
              {tab==='learn'&&(
                <motion.div key="learn" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}>
                  <div className="panel" style={{padding:'26px 30px',marginBottom:14}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26,color:'var(--tx)',letterSpacing:'-.01em',marginBottom:4}}>How EMI Works</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--tx3)',marginBottom:26,letterSpacing:'.1em'}}>FORMULA · AMORTISATION · PREPAYMENT · REFINANCING · FAQ</div>
                    <div className="prose">
                      <p>An <strong>Equated Monthly Instalment (EMI)</strong> is a fixed amount paid by a borrower to a lender every month. Each EMI covers both principal repayment and interest, in a ratio that shifts over time — more interest early, more principal later.</p>
                      <h3>The EMI Formula</h3>
                      <p><strong>EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)</strong> where P = principal, r = monthly interest rate (annual rate ÷ 12 ÷ 100), n = total number of months. This is the <strong>reducing balance method</strong> — interest is calculated on the outstanding principal, not the original loan amount (unlike flat rate loans).</p>
                      <h3>Why Early EMIs Are Mostly Interest</h3>
                      <p>In Month 1, your outstanding balance is the full loan amount, so the interest component is at its maximum. Each month, a tiny slice of principal reduces the balance, which reduces the next month's interest. This compounding effect means <strong>prepayments made in Year 1–3 save significantly more</strong> than equivalent prepayments in Year 15.</p>
                      <h3>The Refinance Decision</h3>
                      <p>Refinancing only makes sense if the interest savings exceed the total fees and switching costs. The break-even point is: <strong>Processing Fee ÷ Monthly Saving = Months to Break Even</strong>. If you plan to repay the loan within the break-even period, refinancing likely isn't worth it.</p>
                      {[
                        {q:'Fixed vs floating rate — which should I choose?',a:'Fixed rates offer EMI certainty throughout the tenure. Floating rates (linked to repo rate, MCLR, or SOFR) change with monetary policy. If rates are high and expected to fall, floating is advantageous. If rates are low and you want certainty, lock in fixed. For home loans above 20 years, floating typically makes more sense.'},
                        {q:'What is the 40% EMI rule?',a:'Most financial planners recommend that total EMI obligations should not exceed 35–40% of gross monthly income. This is also the practical threshold most banks use when approving loans. Beyond this, the risk of financial stress rises significantly, especially with unexpected income disruptions.'},
                        {q:'When is a shorter tenure better?',a:'Shorter tenures always save total interest — but come with a higher monthly EMI. Choose shorter tenure when your EMI-to-income ratio remains comfortable. A home loan at ₹50L at 8.5% for 10 years costs ₹62L in total vs ₹106L over 30 years — a saving of ₹44L just by choosing 10 vs 30 years.'},
                        {q:'Is prepayment always the best use of extra money?',a:'Not necessarily. If your loan rate is 8.5% and you can earn 12–14% on equity investments, investing might be better. However, if you are risk-averse or the investment return is uncertain, the guaranteed saving from prepayment (eliminating 8.5% compound interest) is often the better choice.'},
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