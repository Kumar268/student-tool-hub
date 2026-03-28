import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, LineChart, TrendingUp, Calculator, Copy, Check,
  ChevronDown, ChevronUp, Info, Zap, Target, Activity,
  RefreshCw, Download, Hash, BarChart, Layers, Sigma,
  Maximize2, Minimize2
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement
} from 'chart.js';
import { Bar, Line, Scatter } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, Title, Tooltip, Legend, Filler, ArcElement);

/* ═══════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{font-family:'DM Sans',sans-serif;overflow-x:hidden}
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes spin{to{transform:rotate(360deg)}}
.fade-up{animation:fadeUp .25s ease both}

/* ── NEON ───────────────────────────────────────── */
.neon{background:#030712;color:#c8d6f5;min-height:100vh;font-family:'DM Sans',sans-serif}
.n-bar{height:34px;background:rgba(3,7,18,.97);border-bottom:1px solid rgba(56,189,248,.14);
  position:sticky;top:0;z-index:200;display:flex;align-items:center;padding:0 12px;gap:8px;backdrop-filter:blur(12px)}
.n-logo{display:flex;align-items:center;gap:6px;flex-shrink:0}
.n-logo-mark{width:20px;height:20px;border:1px solid rgba(56,189,248,.45);border-radius:3px;
  display:flex;align-items:center;justify-content:center;color:#38bdf8;box-shadow:0 0 8px rgba(56,189,248,.2)}
.n-logo-txt{font-size:11px;font-weight:800;letter-spacing:.04em;color:#c8d6f5}
.n-logo-txt span{color:#38bdf8}
.n-chip{padding:1px 5px;border:1px solid rgba(56,189,248,.18);border-radius:2px;
  font-size:7px;font-weight:700;letter-spacing:.14em;color:rgba(56,189,248,.5);text-transform:uppercase}
.n-tgl{display:flex;align-items:center;gap:6px;padding:3px 8px;border:1px solid rgba(56,189,248,.15);
  border-radius:2px;background:rgba(56,189,248,.03);cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
.n-tgl:hover{border-color:rgba(56,189,248,.4);background:rgba(56,189,248,.07)}
.n-tabs{display:flex;border-bottom:1px solid rgba(56,189,248,.09);background:rgba(3,7,18,.95);overflow-x:auto;flex-shrink:0}
.n-tab{padding:0 14px;height:36px;border:none;border-bottom:2px solid transparent;background:transparent;
  color:rgba(160,185,240,.4);cursor:pointer;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;
  letter-spacing:.07em;text-transform:uppercase;transition:all .13s;display:flex;align-items:center;gap:5px;white-space:nowrap}
.n-tab.on{color:#38bdf8;border-bottom-color:#38bdf8;background:rgba(56,189,248,.05)}
.n-tab:hover:not(.on){color:#c8d6f5;background:rgba(255,255,255,.02)}
.n-card{background:rgba(5,10,25,.97);border:1px solid rgba(56,189,248,.09);border-radius:4px;position:relative}
.n-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(56,189,248,.2),transparent);pointer-events:none}
.n-inp{background:rgba(0,0,0,.5);border:1px solid rgba(56,189,248,.18);border-radius:3px;
  color:#eef2ff;font-family:'DM Mono',monospace;font-size:13px;padding:8px 11px;outline:none;width:100%;transition:all .13s}
.n-inp:focus{border-color:#38bdf8;box-shadow:0 0 0 2px rgba(56,189,248,.1)}
.n-inp::placeholder{color:rgba(56,189,248,.15)}
.n-tx{background:rgba(0,0,0,.5);border:1px solid rgba(56,189,248,.18);border-radius:3px;
  color:#eef2ff;font-family:'DM Mono',monospace;font-size:12px;padding:10px 11px;outline:none;width:100%;
  resize:vertical;min-height:90px;transition:all .13s;line-height:1.5}
.n-tx:focus{border-color:#38bdf8;box-shadow:0 0 0 2px rgba(56,189,248,.1)}
.n-tx::placeholder{color:rgba(56,189,248,.15)}
.n-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border:1px solid #38bdf8;
  border-radius:2px;background:rgba(56,189,248,.09);color:#38bdf8;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;letter-spacing:.09em;
  text-transform:uppercase;transition:all .15s;box-shadow:0 0 14px rgba(56,189,248,.1)}
.n-btn:hover{background:rgba(56,189,248,.17);box-shadow:0 0 22px rgba(56,189,248,.25);transform:translateY(-1px)}
.n-sbtn{display:inline-flex;align-items:center;gap:3px;padding:3px 9px;
  border:1px solid rgba(56,189,248,.15);border-radius:2px;background:rgba(56,189,248,.04);
  color:rgba(56,189,248,.6);cursor:pointer;font-size:9.5px;font-weight:600;
  font-family:'DM Sans',sans-serif;letter-spacing:.05em;transition:all .11s}
.n-sbtn:hover,.n-sbtn.on{border-color:#38bdf8;color:#38bdf8;background:rgba(56,189,248,.1)}
.n-lbl{font-size:9px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:rgba(56,189,248,.5);display:block;margin-bottom:4px}
.n-stat{background:rgba(5,10,25,.98);border:1px solid rgba(56,189,248,.1);border-radius:3px;padding:12px}
.n-stat-val{font-size:20px;font-weight:800;color:#38bdf8;font-family:'DM Mono',monospace;line-height:1.1}
.n-stat-lbl{font-size:8.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(56,189,248,.4);margin-top:2px}
.n-step{border-left:1px solid rgba(56,189,248,.15);margin-left:11px;padding-left:16px;padding-bottom:16px;position:relative}
.n-step:last-child{border-left-color:transparent;padding-bottom:0}
.n-step::before{content:'';position:absolute;left:-5px;top:0;width:9px;height:9px;border-radius:50%;
  background:#38bdf8;box-shadow:0 0 8px rgba(56,189,248,.5)}
.n-hint{font-size:11px;color:rgba(56,189,248,.5);line-height:1.65;padding:7px 10px;
  border-radius:3px;background:rgba(56,189,248,.04);border-left:2px solid rgba(56,189,248,.28)}
.n-ad{background:rgba(56,189,248,.02);border:1px dashed rgba(56,189,248,.09);border-radius:3px;
  display:flex;align-items:center;justify-content:center;flex-direction:column;gap:2px;
  color:rgba(56,189,248,.18);font-size:9px;letter-spacing:.1em;font-family:'DM Sans',sans-serif}
.n-pill{display:inline-block;padding:1px 7px;border-radius:99px;font-size:9px;font-weight:700;
  letter-spacing:.05em;background:rgba(56,189,248,.1);color:#38bdf8;border:1px solid rgba(56,189,248,.2)}

/* ── CLEAN/LIGHT ────────────────────────────────── */
.clean{background:#f0f4ff;color:#1e2b4a;min-height:100vh;font-family:'DM Sans',sans-serif}
.c-bar{height:34px;background:#ffffff;border-bottom:1.5px solid #e2e8f6;
  position:sticky;top:0;z-index:200;display:flex;align-items:center;padding:0 12px;gap:8px;
  box-shadow:0 1px 6px rgba(60,100,200,.06)}
.c-logo-mark{width:20px;height:20px;border-radius:5px;background:linear-gradient(135deg,#3b82f6,#06b6d4);
  display:flex;align-items:center;justify-content:center;color:#fff}
.c-logo-txt{font-size:11px;font-weight:800;color:#1e2b4a;letter-spacing:-.01em}
.c-logo-txt span{color:#3b82f6}
.c-tgl{display:flex;align-items:center;gap:6px;padding:3px 9px;border-radius:7px;
  border:1.5px solid #e2e8f6;background:#f8faff;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .13s}
.c-tgl:hover{border-color:#3b82f6}
.c-tabs{display:flex;border-bottom:1.5px solid #e2e8f6;background:#fff;overflow-x:auto;flex-shrink:0}
.c-tab{padding:0 14px;height:36px;border:none;border-bottom:2px solid transparent;background:transparent;
  color:#94a3c8;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;
  transition:all .13s;display:flex;align-items:center;gap:5px;white-space:nowrap;letter-spacing:.04em}
.c-tab.on{color:#3b82f6;border-bottom-color:#3b82f6;background:rgba(59,130,246,.05);font-weight:800}
.c-tab:hover:not(.on){color:#1e2b4a;background:rgba(0,0,0,.02)}
.c-card{background:#ffffff;border:1.5px solid #e2e8f6;border-radius:12px;box-shadow:0 1px 8px rgba(60,100,200,.05)}
.c-inp{background:#f8faff;border:1.5px solid #d1ddf5;border-radius:7px;color:#1e2b4a;
  font-family:'DM Mono',monospace;font-size:13px;padding:8px 11px;outline:none;width:100%;transition:all .13px}
.c-inp:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.12)}
.c-inp::placeholder{color:#b0bcd8}
.c-tx{background:#f8faff;border:1.5px solid #d1ddf5;border-radius:7px;color:#1e2b4a;
  font-family:'DM Mono',monospace;font-size:12px;padding:10px 11px;outline:none;width:100%;
  resize:vertical;min-height:90px;transition:all .13s;line-height:1.5}
.c-tx:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.12)}
.c-tx::placeholder{color:#b0bcd8}
.c-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 18px;border:none;border-radius:8px;
  background:linear-gradient(135deg,#3b82f6,#0284c7);color:#fff;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;
  box-shadow:0 3px 12px rgba(59,130,246,.35);transition:all .15s;letter-spacing:.04em}
.c-btn:hover{box-shadow:0 6px 20px rgba(59,130,246,.45);transform:translateY(-1px)}
.c-sbtn{display:inline-flex;align-items:center;gap:3px;padding:3px 10px;border-radius:6px;
  border:1.5px solid #d1ddf5;background:#f8faff;color:#94a3c8;cursor:pointer;
  font-size:9.5px;font-weight:600;font-family:'DM Sans',sans-serif;transition:all .11s}
.c-sbtn:hover,.c-sbtn.on{border-color:#3b82f6;color:#3b82f6;background:rgba(59,130,246,.08)}
.c-lbl{font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6882b4;display:block;margin-bottom:4px}
.c-stat{background:#f8faff;border:1.5px solid #e2e8f6;border-radius:10px;padding:12px}
.c-stat-val{font-size:20px;font-weight:800;color:#3b82f6;font-family:'DM Mono',monospace;line-height:1.1}
.c-stat-lbl{font-size:8.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#94a3c8;margin-top:2px}
.c-step{border-left:1.5px solid #d1ddf5;margin-left:11px;padding-left:16px;padding-bottom:16px;position:relative}
.c-step:last-child{border-left-color:transparent;padding-bottom:0}
.c-step::before{content:'';position:absolute;left:-6px;top:0;width:10px;height:10px;border-radius:50%;
  background:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.15)}
.c-hint{font-size:11px;color:#6882b4;line-height:1.65;padding:7px 10px;
  border-radius:7px;background:rgba(59,130,246,.06);border-left:2px solid rgba(59,130,246,.28)}
.c-ad{background:#f0f4ff;border:1.5px dashed #c8d5f0;border-radius:9px;
  display:flex;align-items:center;justify-content:center;flex-direction:column;gap:2px;
  color:#b0bcd8;font-size:9px;letter-spacing:.1em;font-family:'DM Sans',sans-serif}
.c-pill{display:inline-block;padding:1px 7px;border-radius:99px;font-size:9px;font-weight:700;
  letter-spacing:.05em;background:rgba(59,130,246,.1);color:#3b82f6;border:1px solid rgba(59,130,246,.2)}
`;

/* ═══════════════════════════════════════════════════
   ICONS  (tiny wrappers) - FIXED
═══════════════════════════════════════════════════ */
const Svg = ({d,s=14,sw=1.8}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {(Array.isArray(d)?d:[d]).map((p,i)=><path key={i} d={p}/>)}
  </svg>
);

// FIXED: All icons with correct paths
const I = {
  sigma: s => <Svg s={s} d={["M18 4H6l6.5 7-6.5 7h12"]}/>,
  bars:  s => <Svg s={s} d={["M3 3v18h18","M7 16l4-8 4 6 3-4"]}/>,
  wave:  s => <Svg s={s} d="M3 12C6 5 9 5 12 12C15 19 18 19 21 12"/>,
  box:   s => <Svg s={s} d={["M3 9h18v6H3z","M7 9v6","M12 9v6","M17 9v6","M3 12h18"]}/>,
  scatter:s=><Svg s={s} d={["M3 20h18","M3 4v16","M7 14l3-5 3 3 4-6"]}/>,
  table: s => <Svg s={s} d={["M3 3h18v18H3z","M3 9h18","M3 15h18","M9 3v18","M15 3v18"]}/>,
  // FIXED: info icon path
  info:  s => <Svg s={s} d={["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z","M12 16v-4","M12 8h.01"]}/>,
  copy:  s => <Svg s={s} d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2","M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"]}/>,
  ok:    s => <Svg s={s} d="M20 6 9 17l-5-5"/>,
  calc:  s => <Svg s={s} d={["M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z","M9 9h6","M9 13h3","M13 17h2"]}/>,
  zap:   s => <Svg s={s} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>,
  trend: s => <Svg s={s} d={["M3 17l4-4 4 4 4-5 4-2"]}/>,
  dist:  s => <Svg s={s} d="M4 20C6 12 8 8 12 8C16 8 18 12 20 20"/>,
  // FIXED: Added missing box2 icon
  box2:  s => <Svg s={s} d={["M8 6h8v12H8z","M3 12h5","M16 12h5","M8 9h8","M8 15h8"]}/>,
};

/* ═══════════════════════════════════════════════════
   TABS CONFIG
═══════════════════════════════════════════════════ */
const TABS = [
  {id:'basic',    label:'Descriptive',  ico:'sigma',  hint:'Mean, median, mode, variance, IQR, and more from any dataset.'},
  {id:'dist',     label:'Distribution', ico:'dist',   hint:'Normal distribution curve, Z-scores, and probability areas.'},
  {id:'regression',label:'Regression', ico:'trend',  hint:'Linear regression: slope, intercept, R², and prediction.'},
  {id:'advanced', label:'Advanced',     ico:'zap',    hint:'Skewness, kurtosis, confidence intervals, hypothesis test.'},
];

/* ═══════════════════════════════════════════════════
   KATEX LOADER
═══════════════════════════════════════════════════ */
function useKatex(){
  const[ok,setOk]=useState(!!window.katex);
  useEffect(()=>{
    if(window.katex)return;
    const l=document.createElement('link');l.rel='stylesheet';l.href='https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';document.head.appendChild(l);
    const sc=document.createElement('script');sc.src='https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';sc.onload=()=>setOk(true);document.head.appendChild(sc);
  },[]);return ok;
}
function KTex({s,display=false,color}){
  if(!window.katex)return <code style={{fontFamily:'DM Mono,monospace',fontSize:display?15:12,color:color||'inherit'}}>{s}</code>;
  try{const h=window.katex.renderToString(s,{displayMode:display,throwOnError:false});return<span dangerouslySetInnerHTML={{__html:h}} style={color?{color}:{}}/>;}
  catch(e){return<code style={{fontFamily:'DM Mono,monospace'}}>{s}</code>;}
}

/* ═══════════════════════════════════════════════════
   MATH UTILITIES
═══════════════════════════════════════════════════ */
// FIXED: Added safeguard for empty input
function parseNums(str){
  if (!str || str.trim() === '') return [];
  return str.split(/[\s,;]+/).map(Number).filter(n=>!isNaN(n)&&isFinite(n));
}
function mean(a){return a.reduce((s,x)=>s+x,0)/a.length}
function variance(a,pop=true){const m=mean(a);const d=a.map(x=>(x-m)**2);return d.reduce((s,x)=>s+x,0)/(pop?a.length:a.length-1)}
function stdDev(a,pop=true){return Math.sqrt(variance(a,pop))}
function sorted(a){return [...a].sort((x,y)=>x-y)}
function median(a){const s=sorted(a),n=s.length,m=Math.floor(n/2);return n%2?s[m]:(s[m-1]+s[m])/2}
function quartile(a,q){const s=sorted(a),n=s.length;if(q===1){const lo=s.slice(0,Math.floor(n/2));return median(lo);}const hi=s.slice(Math.ceil(n/2));return median(hi);}
function mode(a){const f={};a.forEach(x=>{f[x]=(f[x]||0)+1});const mx=Math.max(...Object.values(f));const modes=Object.keys(f).filter(k=>f[k]===mx&&mx>1).map(Number);return{modes,freq:f,maxFreq:mx};}
function skewness(a){const m=mean(a),s=stdDev(a),n=a.length;return a.reduce((acc,x)=>acc+((x-m)/s)**3,0)/n;}
function kurtosis(a){const m=mean(a),s=stdDev(a),n=a.length;return a.reduce((acc,x)=>acc+((x-m)/s)**4,0)/n-3;}
function normalPDF(x,mu,sigma){return(1/(sigma*Math.sqrt(2*Math.PI)))*Math.exp(-.5*((x-mu)/sigma)**2);}
function normalCDF(z){
  const t=1/(1+.2316419*Math.abs(z));const d=.3989423*Math.exp(-z*z/2);
  const p=d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));
  return z>=0?1-p:p;
}
function zScore(x,mu,sigma){return(x-mu)/sigma;}
function linReg(xs,ys){
  const n=xs.length,xm=mean(xs),ym=mean(ys);
  const Sxy=xs.reduce((a,x,i)=>a+(x-xm)*(ys[i]-ym),0);
  const Sxx=xs.reduce((a,x)=>a+(x-xm)**2,0);
  const slope=Sxy/Sxx,intercept=ym-slope*xm;
  const yHat=xs.map(x=>slope*x+intercept);
  const SStot=ys.reduce((a,y)=>a+(y-ym)**2,0);
  const SSres=ys.reduce((a,y,i)=>a+(y-yHat[i])**2,0);
  const r2=1-SSres/SStot;
  const r=Math.sign(slope)*Math.sqrt(r2);
  return{slope,intercept,r2,r,yHat};
}
function percentile(a,p){const s=sorted(a),idx=(p/100)*(s.length-1),lo=Math.floor(idx),hi=Math.ceil(idx);return s[lo]+(s[hi]-s[lo])*(idx-lo);}
function confidenceInterval(a,level=0.95){const n=a.length,m=mean(a),se=stdDev(a,false)/Math.sqrt(n);const z95=1.96,z99=2.576;const z=level===0.99?z99:z95;return{lo:m-z*se,hi:m+z*se,se,z};}

/* ═══════════════════════════════════════════════════
   COPY BUTTON
═══════════════════════════════════════════════════ */
function CopyBtn({text,neon}){
  const[ok,setOk]=useState(false);
  return<button onClick={()=>{navigator.clipboard.writeText(String(text)).catch(()=>{});setOk(true);setTimeout(()=>setOk(false),1400)}}
    className={neon?'n-sbtn':'c-sbtn'} style={{padding:'2px 7px',gap:3}}>
    {ok?I.ok(9):I.copy(9)}{ok?'Copied':'Copy'}
  </button>;
}

/* ═══════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════ */
function StatCard({label,value,sub,neon,copyable=true,accent}){
  const cls=neon?'n-stat':'c-stat';
  const vcls=neon?'n-stat-val':'c-stat-val';
  const lcls=neon?'n-stat-lbl':'c-stat-lbl';
  const accentColor=accent||(neon?'#38bdf8':'#3b82f6');
  return(
    <motion.div className={cls} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} style={{position:'relative'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:3}}>
        <div className={vcls} style={{color:accentColor,fontSize:value&&String(value).length>8?15:20}}>{value}</div>
        {copyable&&<CopyBtn text={value} neon={neon}/>}
      </div>
      <div className={lcls}>{label}</div>
      {sub&&<div style={{fontSize:9,color:neon?'rgba(56,189,248,.3)':'#b0bcd8',marginTop:2,fontFamily:'DM Mono,monospace'}}>{sub}</div>}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   STEP
═══════════════════════════════════════════════════ */
function Step({n,title,desc,formula,last,neon,katex}){
  const[open,setOpen]=useState(n<=2);
  const cls=neon?'n-step':'c-step';
  return(
    <div className={cls} style={(last?{borderLeftColor:'transparent'}:{})}>
      <div style={{cursor:'pointer',display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8}} onClick={()=>setOpen(o=>!o)}>
        <div>
          <div style={{fontSize:8.5,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',
            color:neon?'rgba(56,189,248,.5)':'#94a3c8',marginBottom:2}}>Step {n}</div>
          <div style={{fontSize:12,fontWeight:700,color:neon?'#c8d6f5':'#1e2b4a'}}>{title}</div>
        </div>
        <div style={{color:neon?'rgba(56,189,248,.35)':'#94a3c8',marginTop:2,flexShrink:0}}>
          {open?I.ok(11):I.bars(11)}
        </div>
      </div>
      <AnimatePresence>
        {open&&(
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{overflow:'hidden'}}>
            <div style={{marginTop:6}}>
              {desc&&<div style={{fontSize:11,color:neon?'rgba(56,189,248,.5)':'#6882b4',lineHeight:1.6,marginBottom:formula?7:0}}>{desc}</div>}
              {formula&&(
                <div style={{padding:'6px 10px',border:neon?'1px solid rgba(56,189,248,.1)':'1.5px solid #d1ddf5',
                  borderRadius:neon?2:6,background:neon?'rgba(0,0,0,.3)':'rgba(248,250,255,.8)',overflowX:'auto'}}>
                  {katex?<KTex s={formula} display color={neon?'#c8d6f5':'#1e2b4a'}/>
                    :<code style={{fontFamily:'DM Mono,monospace',fontSize:13,color:neon?'#38bdf8':'#3b82f6'}}>{formula}</code>}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   AD SLOT
═══════════════════════════════════════════════════ */
function AdSlot({w,h,label='Advertisement',neon}){
  return(
    <div className={neon?'n-ad':'c-ad'} style={{height:h||80,width:w||'100%'}}>
      <span style={{fontWeight:700,textTransform:'uppercase',letterSpacing:'.12em'}}>{label}</span>
      {w&&h&&<span>{w}×{h}</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CHART OPTIONS
═══════════════════════════════════════════════════ */
function chartOpts(neon,title=''){
  return{
    responsive:true,maintainAspectRatio:false,
    plugins:{legend:{display:false},title:{display:!!title,text:title,color:neon?'#c8d6f5':'#1e2b4a',font:{size:11,family:'DM Sans',weight:'700'}}},
    scales:{
      x:{grid:{color:neon?'rgba(56,189,248,.05)':'rgba(59,130,246,.06)'},ticks:{color:neon?'rgba(56,189,248,.4)':'#94a3c8',font:{size:9,family:'DM Mono'}}},
      y:{grid:{color:neon?'rgba(56,189,248,.05)':'rgba(59,130,246,.06)'},ticks:{color:neon?'rgba(56,189,248,.4)':'#94a3c8',font:{size:9,family:'DM Mono'}}},
    }
  };
}

/* ═══════════════════════════════════════════════════
   DATA INPUT BLOCK
═══════════════════════════════════════════════════ */
const SAMPLE_SETS = [
  {name:'Scores',    data:'85,92,78,95,88,90,82,89,91,76'},
  {name:'Heights',   data:'165,172,168,180,175,170,169,174,178,163'},
  {name:'Temps',     data:'22,24,21,25,23,22,26,24,23,25,20,27'},
  {name:'Sales',     data:'1200,1350,980,1500,1100,1400,890,1250,1600,1050'},
];

function DataInput({value,onChange,neon}){
  return(
    <div>
      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:5,flexWrap:'wrap'}}>
        <label className={neon?'n-lbl':'c-lbl'} style={{margin:0}}>Data (comma or space separated)</label>
        <div style={{display:'flex',gap:3,flexWrap:'wrap',marginLeft:'auto'}}>
          {SAMPLE_SETS.map(s=>(
            <button key={s.name} onClick={()=>onChange(s.data)}
              className={neon?'n-sbtn':'c-sbtn'} style={{padding:'2px 8px',fontSize:9}}>
              {s.name}
            </button>
          ))}
        </div>
      </div>
      <textarea className={neon?'n-tx':'c-tx'} value={value}
        onChange={e=>onChange(e.target.value)} placeholder="e.g.  12, 45, 23, 67, 34, 56, 45, 78, 23"/>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:4,fontSize:9,
        color:neon?'rgba(56,189,248,.3)':'#b0bcd8',fontFamily:'DM Mono,monospace'}}>
        <span>n = {parseNums(value).length} values</span>
        <span>separate with commas or spaces</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB: BASIC DESCRIPTIVE
═══════════════════════════════════════════════════ */
function TabBasic({neon,katex}){
  const[input,setInput]=useState('15,22,15,34,45,22,15,56,33,28,41,19');
  const[zVal,setZVal]=useState('');
  const[chart,setChart]=useState('hist');
  const nums=useMemo(()=>parseNums(input),[input]);
  const s=useMemo(()=>{
    if(nums.length<2)return null;
    const srt=sorted(nums),n=nums.length,m=mean(nums),md=median(nums);
    const {modes,freq,maxFreq}=mode(nums);
    const popSD=stdDev(nums,true),sampSD=stdDev(nums,false);
    const popVar=variance(nums,true),sampVar=variance(nums,false);
    const q1=quartile(nums,1),q3=quartile(nums,3),iqr=q3-q1;
    const mn=srt[0],mx=srt[n-1];
    const deviations=nums.map(x=>({x,diff:x-m,diffSq:(x-m)**2}));
    const zs=!isNaN(parseFloat(zVal))?zScore(parseFloat(zVal),m,popSD):null;
    return{nums,srt,n,m,md,modes,freq,maxFreq,popSD,sampSD,popVar,sampVar,q1,q3,iqr,mn,mx,range:mx-mn,deviations,zs,sum:nums.reduce((a,b)=>a+b,0)};
  },[nums,zVal]);

  const histData=useMemo(()=>{
    if(!s)return null;
    const labels=Object.keys(s.freq).sort((a,b)=>+a-+b);
    return{labels,datasets:[{label:'Freq',data:labels.map(l=>s.freq[l]),
      backgroundColor:neon?'rgba(56,189,248,.35)':'rgba(59,130,246,.35)',
      borderColor:neon?'#38bdf8':'#3b82f6',borderWidth:2,borderRadius:5}]};
  },[s,neon]);

  const distData=useMemo(()=>{
    if(!s)return null;
    const pts=[],lbs=[];
    for(let x=s.m-4*s.popSD;x<=s.m+4*s.popSD;x+=s.popSD/12){
      pts.push(normalPDF(x,s.m,s.popSD));lbs.push(x.toFixed(2));
    }
    return{labels:lbs,datasets:[{data:pts,borderColor:neon?'#a78bfa':'#8b5cf6',
      backgroundColor:neon?'rgba(167,139,250,.08)':'rgba(139,92,246,.08)',fill:true,tension:.4,pointRadius:0,borderWidth:2}]};
  },[s,neon]);

  // FIXED: Box plot data structure
  const boxData=useMemo(()=>{
    if(!s)return null;
    return{
      labels:['Dataset'],
      datasets: [
        {
          label: 'Min→Q1',
          data: [{x: 'Dataset', y: [s.mn, s.q1]}],
          backgroundColor: neon ? 'rgba(56,189,248,.15)' : 'rgba(59,130,246,.12)',
          borderColor: neon ? '#38bdf8' : '#3b82f6',
          borderWidth: 1.5,
          borderRadius: 2,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
        {
          label: 'Q1→Median',
          data: [{x: 'Dataset', y: [s.q1, s.md]}],
          backgroundColor: neon ? 'rgba(56,189,248,.3)' : 'rgba(59,130,246,.28)',
          borderColor: neon ? '#38bdf8' : '#3b82f6',
          borderWidth: 1.5,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
        {
          label: 'Median→Q3',
          data: [{x: 'Dataset', y: [s.md, s.q3]}],
          backgroundColor: neon ? 'rgba(56,189,248,.45)' : 'rgba(59,130,246,.45)',
          borderColor: neon ? '#38bdf8' : '#3b82f6',
          borderWidth: 1.5,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
        {
          label: 'Q3→Max',
          data: [{x: 'Dataset', y: [s.q3, s.mx]}],
          backgroundColor: neon ? 'rgba(56,189,248,.15)' : 'rgba(59,130,246,.12)',
          borderColor: neon ? '#38bdf8' : '#3b82f6',
          borderWidth: 1.5,
          borderRadius: 2,
          barPercentage: 0.9,
          categoryPercentage: 0.9,
        },
      ]
    };
  },[s,neon]);

  const PRIMARY=[
    {label:'Mean (μ)',value:s?.m.toFixed(4),sub:'arithmetic average'},
    {label:'Median',value:s?.md.toFixed(4),sub:'middle value'},
    {label:'Mode',value:s?.modes.length?s.modes.join(', '):'none',sub:`freq=${s?.maxFreq||'-'}`},
    {label:'Std Dev (σ)',value:s?.popSD.toFixed(5),sub:'population'},
    {label:'Variance (σ²)',value:s?.popVar.toFixed(5),sub:'population'},
    {label:'Std Dev (s)',value:s?.sampSD.toFixed(5),sub:'sample'},
    {label:'Q1',value:s?.q1.toFixed(3),sub:'25th percentile'},
    {label:'Q3',value:s?.q3.toFixed(3),sub:'75th percentile'},
    {label:'IQR',value:s?.iqr.toFixed(3),sub:'Q3 − Q1'},
    {label:'Min',value:s?.mn,sub:'smallest'},
    {label:'Max',value:s?.mx,sub:'largest'},
    {label:'Range',value:s?.range,sub:'max − min'},
  ];

  return(
    <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:13}}>

      {/* Hint */}
      <div className={neon?'n-hint':'c-hint'}>{I.info(11)} &nbsp; Enter numbers below. All statistics auto-update. Use the sample buttons to try example datasets.</div>

      {/* 2-col grid */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 260px',gap:13}}>

        {/* LEFT */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className={neon?'n-card':'c-card'} style={{padding:13}}>
            <DataInput value={input} onChange={setInput} neon={neon}/>
          </div>

          {/* Z-score */}
          <div className={neon?'n-card':'c-card'} style={{padding:13}}>
            <div style={{display:'flex',gap:10,alignItems:'flex-end',flexWrap:'wrap'}}>
              <div style={{flex:1,minWidth:120}}>
                <label className={neon?'n-lbl':'c-lbl'}>Z-Score — enter a value from your dataset</label>
                <input className={neon?'n-inp':'c-inp'} type="number" value={zVal}
                  onChange={e=>setZVal(e.target.value)} placeholder="e.g. 45"/>
              </div>
              {s?.zs!=null&&(
                <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
                  style={{padding:'8px 16px',border:neon?'1px solid rgba(56,189,248,.25)':'1.5px solid rgba(59,130,246,.25)',
                    borderRadius:neon?3:8,background:neon?'rgba(56,189,248,.06)':'rgba(59,130,246,.06)',minWidth:120}}>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:neon?'rgba(56,189,248,.5)':'#6882b4',marginBottom:2}}>Z-SCORE</div>
                  <div style={{fontSize:22,fontWeight:800,color:neon?'#38bdf8':'#3b82f6',fontFamily:'DM Mono,monospace'}}>{s.zs.toFixed(4)}</div>
                  <div style={{fontSize:9,color:neon?'rgba(56,189,248,.35)':'#94a3c8',marginTop:1}}>
                    {Math.abs(s.zs)<1?'within 1σ':Math.abs(s.zs)<2?'within 2σ':'beyond 2σ'} of mean
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Stats grid */}
          {s&&(
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:7}}>
              {PRIMARY.map((p,i)=><StatCard key={i} {...p} neon={neon}/>)}
            </div>
          )}

          {/* Steps */}
          {s&&(
            <div className={neon?'n-card':'c-card'} style={{padding:14}}>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase',
                color:neon?'rgba(56,189,248,.45)':'#6882b4',marginBottom:12}}>Step-by-Step Solution</div>
              <Step n={1} title="Sort & count the data"
                desc={`n = ${s.n} values. Sorted: ${s.srt.join(', ')}`} neon={neon} katex={katex}/>
              <Step n={2} title="Arithmetic Mean"
                desc={`Sum all values and divide by n.`}
                formula={`\\mu = \\frac{\\displaystyle\\sum_{i=1}^{${s.n}} x_i}{${s.n}} = \\frac{${s.sum.toFixed(2)}}{${s.n}} = ${s.m.toFixed(4)}`}
                neon={neon} katex={katex}/>
              <Step n={3} title="Median"
                desc={`${s.n%2?'Odd':'Even'} count: the median is ${s.n%2?'the middle element':'the average of the two middle elements'}.`}
                formula={`\\text{Median} = ${s.md.toFixed(4)}`}
                neon={neon} katex={katex}/>
              <Step n={4} title="Population Variance & Std Dev"
                desc="Average squared deviations from the mean."
                formula={`\\sigma^2 = \\frac{\\sum(x_i-\\mu)^2}{n} = ${s.popVar.toFixed(5)}, \\quad \\sigma = ${s.popSD.toFixed(5)}`}
                neon={neon} katex={katex}/>
              <Step n={5} title="Quartiles & IQR"
                desc="Split the sorted data into four equal parts."
                formula={`Q_1=${s.q1.toFixed(3)},\\; Q_3=${s.q3.toFixed(3)},\\; IQR = Q_3-Q_1 = ${s.iqr.toFixed(3)}`}
                neon={neon} katex={katex} last/>
            </div>
          )}

          {/* Deviation table */}
          {s&&(
            <div className={neon?'n-card':'c-card'} style={{padding:14}}>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase',color:neon?'rgba(56,189,248,.45)':'#6882b4',marginBottom:10}}>
                Deviation Table (first 12)
              </div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontFamily:'DM Mono,monospace',fontSize:11}}>
                  <thead>
                    <tr style={{borderBottom:neon?'1px solid rgba(56,189,248,.1)':'1.5px solid #e2e8f6'}}>
                      {['x','x − μ','(x − μ)²'].map(h=>(
                        <th key={h} style={{padding:'5px 10px',textAlign:'left',fontSize:9,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:neon?'rgba(56,189,248,.4)':'#94a3c8'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.deviations.slice(0,12).map((d,i)=>(
                      <tr key={i} style={{borderBottom:neon?'1px solid rgba(56,189,248,.05)':'1px solid #f0f4ff'}}>
                        <td style={{padding:'4px 10px',color:neon?'#c8d6f5':'#1e2b4a'}}>{d.x}</td>
                        <td style={{padding:'4px 10px',color:neon?'#38bdf8':'#3b82f6'}}>{d.diff.toFixed(3)}</td>
                        <td style={{padding:'4px 10px',color:neon?'#a78bfa':'#8b5cf6'}}>{d.diffSq.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{display:'flex',flexDirection:'column',gap:11}}>

          {/* Chart switcher */}
          <div className={neon?'n-card':'c-card'} style={{padding:12}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
              <span style={{fontSize:9,fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase',color:neon?'rgba(56,189,248,.45)':'#6882b4'}}>Visualize</span>
              <div style={{display:'flex',gap:3}}>
                {[['hist','bars'],['dist','dist'],['box','box2']].map(([id,ico])=>(
                  <button key={id} className={`${neon?'n-sbtn':'c-sbtn'} ${chart===id?'on':''}`}
                    style={{padding:'2px 7px',gap:2}} onClick={()=>setChart(id)}>
                    {I[ico] ? I[ico](10) : I.bars(10)}
                  </button>
                ))}
              </div>
            </div>
            <div style={{height:200}}>
              {s?(
                chart==='hist'?<Bar data={histData} options={chartOpts(neon,'Frequency')}/>:
                chart==='dist'?<Line data={distData} options={chartOpts(neon,'Normal Curve')}/>:
                <Bar data={boxData} options={{
                  ...chartOpts(neon,'Box Plot'),
                  scales: {
                    x: { 
                      stacked: true,
                      grid: { display: false },
                      ticks: { color: neon ? 'rgba(56,189,248,.4)' : '#94a3c8', font: { size: 9 } }
                    },
                    y: { 
                      stacked: false,
                      grid: { color: neon ? 'rgba(56,189,248,.05)' : 'rgba(59,130,246,.06)' },
                      ticks: { color: neon ? 'rgba(56,189,248,.4)' : '#94a3c8', font: { size: 9 } }
                    }
                  }
                }}/>
              ):<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',fontSize:11,color:neon?'rgba(56,189,248,.3)':'#b0bcd8'}}>Enter data to visualize</div>}
            </div>
            {s&&(
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:5,marginTop:8}}>
                {[['μ',s.m.toFixed(2)],['σ',s.popSD.toFixed(2)],['n',s.n]].map(([k,v])=>(
                  <div key={k} style={{textAlign:'center',padding:'5px',border:neon?'1px solid rgba(56,189,248,.09)':'1.5px solid #e2e8f6',borderRadius:neon?2:6}}>
                    <div style={{fontSize:14,fontWeight:800,color:neon?'#38bdf8':'#3b82f6',fontFamily:'DM Mono,monospace'}}>{v}</div>
                    <div style={{fontSize:8,fontWeight:700,letterSpacing:'.1em',color:neon?'rgba(56,189,248,.4)':'#94a3c8',textTransform:'uppercase'}}>{k}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* How-to guide */}
          <div className={neon?'n-card':'c-card'} style={{padding:12}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase',color:neon?'rgba(56,189,248,.45)':'#6882b4',marginBottom:10}}>How to Use</div>
            {[['1','Enter data','Paste numbers, comma/space separated'],
              ['2','Auto-compute','All stats update instantly'],
              ['3','Z-score','Type a value to get its Z-score'],
              ['4','Visualize','Switch chart types above'],
              ['5','Steps','Click any step to expand it']].map(([n,t,d])=>(
              <div key={n} style={{display:'flex',gap:7,marginBottom:7}}>
                <div style={{width:16,height:16,borderRadius:'50%',flexShrink:0,marginTop:1,
                  background:neon?'rgba(56,189,248,.09)':'rgba(59,130,246,.1)',
                  border:neon?'1px solid rgba(56,189,248,.22)':'1.5px solid rgba(59,130,246,.25)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:8,fontWeight:700,color:neon?'#38bdf8':'#3b82f6'}}>{n}</div>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:neon?'rgba(200,220,255,.85)':'#1e2b4a',lineHeight:1.3}}>{t}</div>
                  <div style={{fontSize:9,color:neon?'rgba(56,189,248,.33)':'#94a3c8',lineHeight:1.4}}>{d}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB: DISTRIBUTION
═══════════════════════════════════════════════════ */
function TabDist({neon,katex}){
  const[mu,setMu]=useState('100');
  const[sigma,setSigma]=useState('15');
  const[x1,setX1]=useState('115');
  const[x2,setX2]=useState('130');

  const d=useMemo(()=>{
    const m=+mu,s=+sigma;if(!isFinite(m)||!isFinite(s)||s<=0)return null;
    const v1=+x1,v2=+x2;
    const z1=isFinite(v1)?(v1-m)/s:null;
    const z2=isFinite(v2)?(v2-m)/s:null;
    const p1=z1!==null?normalCDF(z1):null;
    const p2=z2!==null?normalCDF(z2):null;
    const between=p1!==null&&p2!==null?Math.abs(p2-p1):null;
    const pts=[],lbs=[];
    for(let x=m-4*s;x<=m+4*s;x+=s/20){pts.push(normalPDF(x,m,s));lbs.push(x.toFixed(1));}
    return{m,s,z1,z2,p1,p2,between,pts,lbs};
  },[mu,sigma,x1,x2]);

  const chartData=useMemo(()=>{
    if(!d)return null;
    const m=+mu,s=+sigma,v1=+x1,v2=+x2;
    const shaded=[],base=[];
    const pts=d.lbs.map(l=>+l);
    pts.forEach((x,i)=>{
      base.push(d.pts[i]);
      shaded.push((x>=Math.min(v1,v2)&&x<=Math.max(v1,v2))?d.pts[i]:0);
    });
    return{labels:d.lbs,datasets:[
      {data:base,borderColor:neon?'rgba(56,189,248,.3)':'rgba(59,130,246,.25)',fill:false,tension:.4,pointRadius:0,borderWidth:1.5},
      {data:shaded,backgroundColor:neon?'rgba(167,139,250,.35)':'rgba(139,92,246,.28)',fill:true,tension:.4,pointRadius:0,borderWidth:0},
    ]};
  },[d,neon,x1,x2]);

  return(
    <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:13}}>
      <div className={neon?'n-hint':'c-hint'}>{I.info(11)} &nbsp; Set μ and σ to define a normal distribution. Enter x-values to find probabilities and Z-scores.</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 260px',gap:13}}>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className={neon?'n-card':'c-card'} style={{padding:13}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10,marginBottom:12}}>
              {[['Mean (μ)',mu,setMu],['Std Dev (σ)',sigma,setSigma]].map(([l,v,fn])=>(
                <div key={l}><label className={neon?'n-lbl':'c-lbl'}>{l}</label>
                  <input className={neon?'n-inp':'c-inp'} type="number" value={v} onChange={e=>fn(e.target.value)}/></div>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
              {[['Value x₁',x1,setX1,'P(X ≤ x₁)'],['Value x₂',x2,setX2,'P(x₁ ≤ X ≤ x₂)']].map(([l,v,fn,hint])=>(
                <div key={l}><label className={neon?'n-lbl':'c-lbl'}>{l} <span style={{fontWeight:400,fontSize:8,opacity:.7}}>{hint}</span></label>
                  <input className={neon?'n-inp':'c-inp'} type="number" value={v} onChange={e=>fn(e.target.value)}/></div>
              ))}
            </div>
          </div>

          {d&&(
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
              {[
                {label:'Z₁',value:d.z1?.toFixed(4),sub:`(x₁=${x1})`},
                {label:'Z₂',value:d.z2?.toFixed(4),sub:`(x₂=${x2})`},
                {label:'P(X ≤ x₁)',value:`${(d.p1*100).toFixed(2)}%`,sub:'left tail'},
                {label:'P(X ≤ x₂)',value:`${(d.p2*100).toFixed(2)}%`,sub:'left tail'},
                {label:'P(x₁ ≤ X ≤ x₂)',value:`${(d.between*100).toFixed(2)}%`,sub:'shaded area',accent:neon?'#a78bfa':'#8b5cf6'},
                {label:'P(X > x₂)',value:`${((1-d.p2)*100).toFixed(2)}%`,sub:'right tail'},
              ].map((p,i)=><StatCard key={i} {...p} neon={neon}/>)}
            </div>
          )}

          <div className={neon?'n-card':'c-card'} style={{padding:14,height:260}}>
            {chartData
              ?<Line data={chartData} options={{...chartOpts(neon,'Normal Distribution — shaded = P(x₁ ≤ X ≤ x₂)'),scales:{...chartOpts(neon).scales}}}/>
              :<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',fontSize:11,color:neon?'rgba(56,189,248,.3)':'#b0bcd8'}}>Enter μ and σ</div>}
          </div>

          {d&&(
            <div className={neon?'n-card':'c-card'} style={{padding:14}}>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase',color:neon?'rgba(56,189,248,.45)':'#6882b4',marginBottom:12}}>Steps</div>
              <Step n={1} title="Z-score formula" desc={`Standardise x₁ and x₂`}
                formula={`Z = \\frac{x - \\mu}{\\sigma} \\Rightarrow Z_1 = \\frac{${x1}-${mu}}{${sigma}} = ${d.z1?.toFixed(4)}`}
                neon={neon} katex={katex}/>
              <Step n={2} title="CDF lookup"
                desc="Look up cumulative probabilities from the standard normal table."
                formula={`P(X \\leq ${x1}) = \\Phi(${d.z1?.toFixed(3)}) = ${(d.p1*100).toFixed(3)}\\%`}
                neon={neon} katex={katex}/>
              <Step n={3} title="Between probability"
                formula={`P(${x1} \\leq X \\leq ${x2}) = \\Phi(${d.z2?.toFixed(3)}) - \\Phi(${d.z1?.toFixed(3)}) = ${(d.between*100).toFixed(3)}\\%`}
                neon={neon} katex={katex} last/>
            </div>
          )}
          
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:11}}>
          
          <div className={neon?'n-card':'c-card'} style={{padding:12}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase',color:neon?'rgba(56,189,248,.45)':'#6882b4',marginBottom:10}}>Empirical Rule</div>
            {[['68%','within 1σ','μ±σ'],['95%','within 2σ','μ±2σ'],['99.7%','within 3σ','μ±3σ']].map(([p,d,r])=>(
              <div key={p} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:neon?'1px solid rgba(56,189,248,.06)':'1px solid #f0f4ff'}}>
                <div style={{fontSize:15,fontWeight:800,color:neon?'#38bdf8':'#3b82f6',fontFamily:'DM Mono,monospace'}}>{p}</div>
                <div style={{fontSize:9,color:neon?'rgba(56,189,248,.45)':'#6882b4',textAlign:'right'}}><div>{d}</div><div style={{fontFamily:'DM Mono,monospace'}}>{r}</div></div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB: REGRESSION
═══════════════════════════════════════════════════ */
function TabReg({neon,katex}){
  const[xIn,setXIn]=useState('1,2,3,4,5,6,7,8,9,10');
  const[yIn,setYIn]=useState('2.1,3.8,5.2,7.0,8.1,10.2,11.8,13.5,15.0,16.8');
  const[predX,setPredX]=useState('11');

  const r=useMemo(()=>{
    const xs=parseNums(xIn),ys=parseNums(yIn);
    if(xs.length<2||xs.length!==ys.length)return null;
    const{slope,intercept,r2,r:corr,yHat}=linReg(xs,ys);
    const px=+predX;const py=isFinite(px)?slope*px+intercept:null;
    return{xs,ys,slope,intercept,r2,corr,yHat,px,py};
  },[xIn,yIn,predX]);

  const chartData=useMemo(()=>{
    if(!r)return null;
    const{xs,ys,slope,intercept}=r;
    const mn=Math.min(...xs),mx=Math.max(...xs);
    const lineXs=[mn,mx],lineYs=[slope*mn+intercept,slope*mx+intercept];
    return{
      datasets:[
        {type:'scatter',label:'Data',data:xs.map((x,i)=>({x,y:ys[i]})),backgroundColor:neon?'rgba(56,189,248,.7)':'rgba(59,130,246,.7)',pointRadius:5,pointHoverRadius:7},
        {type:'line',label:'Regression',data:lineXs.map((x,i)=>({x,y:lineYs[i]})),borderColor:neon?'#a78bfa':'#8b5cf6',pointRadius:0,borderWidth:2,tension:0},
      ]
    };
  },[r,neon]);

  return(
    <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:13}}>
      <div className={neon?'n-hint':'c-hint'}>{I.info(11)} &nbsp; Enter X and Y data (same length). Get slope, intercept, R², and correlation. Predict any Y from X.</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 260px',gap:13}}>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className={neon?'n-card':'c-card'} style={{padding:13}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {[['X values (independent)',xIn,setXIn],['Y values (dependent)',yIn,setYIn]].map(([l,v,fn])=>(
                <div key={l}><label className={neon?'n-lbl':'c-lbl'}>{l}</label>
                  <textarea className={neon?'n-tx':'c-tx'} value={v} onChange={e=>fn(e.target.value)} style={{minHeight:70}}/></div>
              ))}
            </div>
            {r&&r.xs.length!==r.ys.length&&<div style={{marginTop:7,fontSize:11,color:'#f87171'}}>⚠ X and Y must have the same number of values</div>}
          </div>

          {r&&(
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
              {[
                {label:'Slope (b₁)',value:r.slope.toFixed(5),sub:'rate of change'},
                {label:'Intercept (b₀)',value:r.intercept.toFixed(5),sub:'y at x=0'},
                {label:'R²',value:r.r2.toFixed(5),sub:'coefficient of det.',accent:neon?'#34d399':'#10b981'},
                {label:'Pearson r',value:r.corr.toFixed(5),sub:'correlation',accent:neon?'#34d399':'#10b981'},
                {label:'n',value:r.xs.length,sub:'data pairs'},
                {label:'Prediction',value:r.py!=null?r.py.toFixed(4):'-',sub:`y at x=${predX}`,accent:neon?'#a78bfa':'#8b5cf6'},
              ].map((p,i)=><StatCard key={i} {...p} neon={neon}/>)}
            </div>
          )}

          <div className={neon?'n-card':'c-card'} style={{padding:13}}>
            <label className={neon?'n-lbl':'c-lbl'}>Predict Y at X =</label>
            <input className={neon?'n-inp':'c-inp'} type="number" value={predX} onChange={e=>setPredX(e.target.value)} style={{maxWidth:160}}/>
            {r?.py!=null&&(
              <div style={{marginTop:8,padding:'7px 12px',border:neon?'1px solid rgba(167,139,250,.25)':'1.5px solid rgba(139,92,246,.25)',borderRadius:neon?3:8,background:neon?'rgba(167,139,250,.07)':'rgba(139,92,246,.06)',display:'inline-block'}}>
                <span style={{fontSize:13,fontWeight:800,color:neon?'#a78bfa':'#8b5cf6',fontFamily:'DM Mono,monospace'}}>ŷ = {r.py.toFixed(5)}</span>
              </div>
            )}
          </div>

          <div className={neon?'n-card':'c-card'} style={{padding:14,height:280}}>
            {chartData?<Scatter data={chartData} options={{...chartOpts(neon,'Scatter + Regression Line'),scales:{x:{...chartOpts(neon).scales.x},y:{...chartOpts(neon).scales.y}}}}/>
              :<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',fontSize:11,color:neon?'rgba(56,189,248,.3)':'#b0bcd8'}}>Enter X and Y data</div>}
          </div>

          {r&&(
            <div className={neon?'n-card':'c-card'} style={{padding:14}}>
              <div style={{fontSize:9,fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase',color:neon?'rgba(56,189,248,.45)':'#6882b4',marginBottom:12}}>Steps</div>
              <Step n={1} title="Regression formula"
                desc="Find the line ŷ = b₀ + b₁x minimizing sum of squared residuals."
                formula={`b_1 = \\frac{\\sum(x_i - \\bar{x})(y_i - \\bar{y})}{\\sum(x_i-\\bar{x})^2} = ${r.slope.toFixed(5)}`}
                neon={neon} katex={katex}/>
              <Step n={2} title="Regression equation"
                formula={`\\hat{y} = ${r.intercept.toFixed(4)} + ${r.slope.toFixed(4)}x`}
                neon={neon} katex={katex}/>
              <Step n={3} title="R² — Coefficient of Determination"
                desc={`${(r.r2*100).toFixed(1)}% of the variance in Y is explained by X.`}
                formula={`R^2 = 1 - \\frac{SS_{res}}{SS_{tot}} = ${r.r2.toFixed(5)}`}
                neon={neon} katex={katex} last/>
            </div>
          )}
          
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:11}}>
          
          <div className={neon?'n-card':'c-card'} style={{padding:12}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase',color:neon?'rgba(56,189,248,.45)':'#6882b4',marginBottom:9}}>Interpretation</div>
            {[
              ['R² = 1','Perfect fit — line explains all variance'],
              ['R² ≥ 0.9','Strong relationship'],
              ['R² ≥ 0.7','Moderate relationship'],
              ['R² < 0.5','Weak — consider other models'],
              ['r > 0','Positive correlation'],
              ['r < 0','Negative correlation'],
            ].map(([k,v])=>(
              <div key={k} style={{display:'flex',gap:6,marginBottom:6}}>
                <code style={{fontFamily:'DM Mono,monospace',fontSize:10,color:neon?'#38bdf8':'#3b82f6',flexShrink:0}}>{k}</code>
                <span style={{fontSize:9.5,color:neon?'rgba(56,189,248,.45)':'#6882b4',lineHeight:1.4}}>{v}</span>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TAB: ADVANCED
═══════════════════════════════════════════════════ */
function TabAdv({neon,katex}){
  const[input,setInput]=useState('12,15,14,10,18,22,25,14,16,19,23,11,17,20,13');
  const[ciLevel,setCiLevel]=useState('95');
  const[hypoMu,setHypoMu]=useState('15');
  const nums=useMemo(()=>parseNums(input),[input]);
  const s=useMemo(()=>{
    if(nums.length<3)return null;
    const n=nums.length,m=mean(nums),sd=stdDev(nums,false),psd=stdDev(nums,true);
    const sk=skewness(nums),ku=kurtosis(nums);
    const ci=confidenceInterval(nums,ciLevel==='99'?0.99:0.95);
    const mu0=+hypoMu;
    const tStat=(m-mu0)/(sd/Math.sqrt(n));
    // percentiles
    const p5=percentile(nums,5),p10=percentile(nums,10),p25=percentile(nums,25),p50=percentile(nums,50),p75=percentile(nums,75),p90=percentile(nums,90),p95=percentile(nums,95);
    const cv=(psd/m)*100;
    return{n,m,sd,psd,sk,ku,ci,mu0,tStat,p5,p10,p25,p50,p75,p90,p95,cv};
  },[nums,ciLevel,hypoMu]);

  const pctData=useMemo(()=>{
    if(!s)return null;
    const lbls=['P5','P10','P25','P50','P75','P90','P95'];
    const vals=[s.p5,s.p10,s.p25,s.p50,s.p75,s.p90,s.p95];
    return{labels:lbls,datasets:[{data:vals,
      backgroundColor:neon?'rgba(56,189,248,.25)':'rgba(59,130,246,.22)',
      borderColor:neon?'#38bdf8':'#3b82f6',borderWidth:2,borderRadius:4}]};
  },[s,neon]);

  return(
    <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:13}}>
      <div className={neon?'n-hint':'c-hint'}>{I.info(11)} &nbsp; Advanced stats: skewness, kurtosis, confidence interval, one-sample t-test, and full percentile breakdown.</div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 260px',gap:13}}>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className={neon?'n-card':'c-card'} style={{padding:13}}>
            <DataInput value={input} onChange={setInput} neon={neon}/>
          </div>

          {s&&(
            <>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
                {[
                  {label:'Skewness',value:s.sk.toFixed(4),sub:s.sk>0?'right skewed':s.sk<0?'left skewed':'symmetric',accent:Math.abs(s.sk)>1?(neon?'#f87171':'#ef4444'):undefined},
                  {label:'Kurtosis (excess)',value:s.ku.toFixed(4),sub:s.ku>0?'leptokurtic':'platykurtic'},
                  {label:'CV (%)',value:s.cv.toFixed(3),sub:'coeff. of variation'},
                ].map((p,i)=><StatCard key={i} {...p} neon={neon}/>)}
              </div>

              {/* CI */}
              <div className={neon?'n-card':'c-card'} style={{padding:13}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase',color:neon?'rgba(56,189,248,.45)':'#6882b4'}}>Confidence Interval for μ</div>
                  <div style={{display:'flex',gap:4}}>
                    {['95','99'].map(l=>(
                      <button key={l} className={`${neon?'n-sbtn':'c-sbtn'} ${ciLevel===l?'on':''}`}
                        style={{padding:'2px 9px',fontSize:10}} onClick={()=>setCiLevel(l)}>
                        {l}%
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
                  <div style={{padding:'8px 16px',border:neon?'1px solid rgba(56,189,248,.22)':'1.5px solid rgba(59,130,246,.22)',borderRadius:neon?3:8,background:neon?'rgba(56,189,248,.06)':'rgba(59,130,246,.06)'}}>
                    <div style={{fontSize:10,color:neon?'rgba(56,189,248,.4)':'#94a3c8',marginBottom:2}}>Lower bound</div>
                    <div style={{fontSize:18,fontWeight:800,color:neon?'#38bdf8':'#3b82f6',fontFamily:'DM Mono,monospace'}}>{s.ci.lo.toFixed(4)}</div>
                  </div>
                  <div style={{fontSize:20,color:neon?'rgba(56,189,248,.3)':'#94a3c8'}}>–</div>
                  <div style={{padding:'8px 16px',border:neon?'1px solid rgba(56,189,248,.22)':'1.5px solid rgba(59,130,246,.22)',borderRadius:neon?3:8,background:neon?'rgba(56,189,248,.06)':'rgba(59,130,246,.06)'}}>
                    <div style={{fontSize:10,color:neon?'rgba(56,189,248,.4)':'#94a3c8',marginBottom:2}}>Upper bound</div>
                    <div style={{fontSize:18,fontWeight:800,color:neon?'#38bdf8':'#3b82f6',fontFamily:'DM Mono,monospace'}}>{s.ci.hi.toFixed(4)}</div>
                  </div>
                  <div style={{fontSize:9,color:neon?'rgba(56,189,248,.35)':'#6882b4',lineHeight:1.5}}>
                    SE = {s.ci.se.toFixed(4)}<br/>z = {s.ci.z}
                  </div>
                </div>
                {katex&&<div style={{marginTop:9,padding:'6px 10px',border:neon?'1px solid rgba(56,189,248,.09)':'1.5px solid #e2e8f6',borderRadius:neon?2:6,overflowX:'auto'}}>
                  <KTex s={`CI = \\bar{x} \\pm z\\frac{s}{\\sqrt{n}} = ${s.m.toFixed(3)} \\pm ${s.ci.z} \\cdot \\frac{${s.sd.toFixed(3)}}{\\sqrt{${s.n}}} = [${s.ci.lo.toFixed(3)},\\, ${s.ci.hi.toFixed(3)}]`} display color={neon?'#c8d6f5':'#1e2b4a'}/>
                </div>}
              </div>

              {/* t-test */}
              <div className={neon?'n-card':'c-card'} style={{padding:13}}>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase',color:neon?'rgba(56,189,248,.45)':'#6882b4',marginBottom:9}}>One-Sample t-test (H₀: μ = μ₀)</div>
                <div style={{display:'flex',gap:10,alignItems:'flex-end',flexWrap:'wrap',marginBottom:10}}>
                  <div>
                    <label className={neon?'n-lbl':'c-lbl'}>Null hypothesis μ₀</label>
                    <input className={neon?'n-inp':'c-inp'} type="number" value={hypoMu} onChange={e=>setHypoMu(e.target.value)} style={{width:100}}/>
                  </div>
                  <div style={{padding:'8px 14px',border:neon?'1px solid rgba(56,189,248,.2)':'1.5px solid rgba(59,130,246,.2)',borderRadius:neon?3:8,background:neon?'rgba(56,189,248,.06)':'rgba(59,130,246,.06)'}}>
                    <div style={{fontSize:9,color:neon?'rgba(56,189,248,.4)':'#94a3c8',marginBottom:2}}>t-statistic</div>
                    <div style={{fontSize:20,fontWeight:800,fontFamily:'DM Mono,monospace',color:neon?'#38bdf8':'#3b82f6'}}>{s.tStat.toFixed(4)}</div>
                  </div>
                  <div style={{fontSize:9,color:neon?'rgba(56,189,248,.35)':'#6882b4',lineHeight:1.6}}>
                    df = {s.n-1}<br/>
                    {Math.abs(s.tStat)>2.576?'Reject H₀ at α=0.01':Math.abs(s.tStat)>1.96?'Reject H₀ at α=0.05':'Fail to reject H₀'}
                  </div>
                </div>
                {katex&&<div style={{padding:'6px 10px',border:neon?'1px solid rgba(56,189,248,.09)':'1.5px solid #e2e8f6',borderRadius:neon?2:6,overflowX:'auto'}}>
                  <KTex s={`t = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}} = \\frac{${s.m.toFixed(3)} - ${s.mu0}}{${s.sd.toFixed(3)}/\\sqrt{${s.n}}} = ${s.tStat.toFixed(4)}`} display color={neon?'#c8d6f5':'#1e2b4a'}/>
                </div>}
              </div>

              {/* Percentile chart */}
              <div className={neon?'n-card':'c-card'} style={{padding:14,height:220}}>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase',color:neon?'rgba(56,189,248,.45)':'#6882b4',marginBottom:8}}>Percentile Distribution</div>
                <div style={{height:170}}>
                  <Bar data={pctData} options={chartOpts(neon)}/>
                </div>
              </div>

              {/* Percentile table */}
              <div className={neon?'n-card':'c-card'} style={{padding:14}}>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase',color:neon?'rgba(56,189,248,.45)':'#6882b4',marginBottom:10}}>Full Percentile Table</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:6}}>
                  {[[5,s.p5],[10,s.p10],[25,s.p25],[50,s.p50],[75,s.p75],[90,s.p90],[95,s.p95]].map(([p,v])=>(
                    <div key={p} style={{textAlign:'center',padding:'7px 4px',border:neon?'1px solid rgba(56,189,248,.08)':'1.5px solid #e2e8f6',borderRadius:neon?2:6}}>
                      <div style={{fontSize:13,fontWeight:800,color:neon?'#38bdf8':'#3b82f6',fontFamily:'DM Mono,monospace'}}>{v.toFixed(2)}</div>
                      <div style={{fontSize:8,fontWeight:700,letterSpacing:'.1em',color:neon?'rgba(56,189,248,.35)':'#94a3c8',marginTop:1}}>P{p}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:11}}>
          
          <div className={neon?'n-card':'c-card'} style={{padding:12}}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:'.13em',textTransform:'uppercase',color:neon?'rgba(56,189,248,.45)':'#6882b4',marginBottom:9}}>Shape Guide</div>
            {[['Skew ≈ 0','Symmetric / normal'],['Skew > 1','Heavy right tail'],['Skew < -1','Heavy left tail'],['Kurt > 0','Peaked (leptokurtic)'],['Kurt < 0','Flat (platykurtic)'],['Kurt ≈ 0','Normal-like']].map(([k,v])=>(
              <div key={k} style={{display:'flex',gap:6,marginBottom:5}}>
                <code style={{fontFamily:'DM Mono,monospace',fontSize:9.5,color:neon?'#38bdf8':'#3b82f6',flexShrink:0}}>{k}</code>
                <span style={{fontSize:9,color:neon?'rgba(56,189,248,.4)':'#6882b4',lineHeight:1.4}}>{v}</span>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════════ */
export default function BasicStats(){
  const[theme,setTheme]=useState('neon');
  const[tab,setTab]=useState('basic');
  const katex=useKatex();
  const neon=theme==='neon';
  const curTab=TABS.find(t=>t.id===tab);

  return(
    <>
      <style>{STYLES}</style>
      <div className={neon?'neon':'clean'}>
        {/* ── TOPBAR ── */}
        <div className={neon?'n-bar':'c-bar'}>
          <div className={neon?'n-logo':'c-logo'}>
            <div className={neon?'n-logo-mark':'c-logo-mark'}>{I.sigma(11)}</div>
            <span className={neon?'n-logo-txt':'c-logo-txt'}>Stats<span>Solver</span></span>
            {neon&&<span className="n-chip">Free</span>}
          </div>
          <div style={{flex:1}}/>
          {/* theme toggle */}
          <button className={neon?'n-tgl':'c-tgl'} onClick={()=>setTheme(t=>t==='neon'?'clean':'neon')}>
            {neon?(<>
              <div style={{width:24,height:13,borderRadius:6,background:'#38bdf8',position:'relative',boxShadow:'0 0 5px rgba(56,189,248,.4)'}}>
                <div style={{position:'absolute',top:1.5,right:1.5,width:10,height:10,borderRadius:'50%',background:'#030712'}}/>
              </div>
              <span style={{fontSize:9,fontWeight:700,color:'rgba(56,189,248,.6)',letterSpacing:'.08em'}}>DARK</span>
            </>):(<>
              <span style={{fontSize:10,color:'#94a3c8',fontWeight:600}}>Light</span>
              <div style={{width:24,height:13,borderRadius:6,background:'#d1ddf5',position:'relative'}}>
                <div style={{position:'absolute',top:1.5,left:1.5,width:10,height:10,borderRadius:'50%',background:'#94a3c8'}}/>
              </div>
            </>)}
          </button>
        </div>

        {/* ── TABS ── */}
        <div className={neon?'n-tabs':'c-tabs'}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={neon?`n-tab ${tab===t.id?'on':''}`:`c-tab ${tab===t.id?'on':''}`}>
              {I[t.ico]?I[t.ico](11):null} {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.2}}>
            {tab==='basic'   &&<TabBasic neon={neon} katex={katex}/>}
            {tab==='dist'    &&<TabDist  neon={neon} katex={katex}/>}
            {tab==='regression'&&<TabReg  neon={neon} katex={katex}/>}
            {tab==='advanced'&&<TabAdv   neon={neon} katex={katex}/>}
          </motion.div>
        </AnimatePresence>

        {/* ── FOOTER AD ── */}
        <div style={{padding:'0 16px 16px'}}>
          
        </div>
      </div>
    </>
  );
}