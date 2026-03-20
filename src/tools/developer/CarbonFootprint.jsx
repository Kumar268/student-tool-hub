import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   CARBON FOOTPRINT CALCULATOR — Dark Forest / Light Sage
   Series architecture: topbar · tabs · sidebar · main · ads
═══════════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'DM Sans',sans-serif}
@keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes leaf-sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes grow-bar{from{width:0}to{width:var(--w)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes breathe{0%,100%{box-shadow:0 0 18px rgba(52,211,153,.1),0 0 50px rgba(52,211,153,.04)}50%{box-shadow:0 0 36px rgba(52,211,153,.42),0 0 80px rgba(52,211,153,.12)}}
@keyframes count{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
.fadeup{animation:fadeup .22s ease both}

/* ══ DARK — DEEP FOREST ══════════════════════════════════════════ */
.dark{
  --bg:#030a05;--sur:#061009;--s2:#07140a;
  --bdr:#0d2e12;--bdr2:rgba(52,211,153,.22);
  --acc:#34d399;--acc2:#059669;--acc3:#f59e0b;
  --ok:#34d399;--err:#f87171;--warn:#fbbf24;
  --txt:#ecfdf5;--txt2:#6ee7b7;--txt3:#065f46;
  min-height:100vh;background:var(--bg);color:var(--txt);
  background-image:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(52,211,153,.06),transparent);
}
/* ══ LIGHT — SAGE / CREAM ════════════════════════════════════════ */
.light{
  --bg:#f0f7f0;--sur:#ffffff;--s2:#e8f5e8;
  --bdr:#c8dfc8;--bdr2:#166534;
  --acc:#166534;--acc2:#15803d;--acc3:#b45309;
  --ok:#15803d;--err:#dc2626;--warn:#d97706;
  --txt:#052e16;--txt2:#166534;--txt3:#4ade80;
  min-height:100vh;background:var(--bg);color:var(--txt);
}

/* TOPBAR */
.topbar{height:40px;position:sticky;top:0;z-index:300;display:flex;align-items:center;padding:0 14px;gap:8px;backdrop-filter:blur(16px)}
.dark .topbar{background:rgba(3,10,5,.97);border-bottom:1px solid var(--bdr)}
.light .topbar{background:rgba(240,247,240,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 8px rgba(22,101,52,.07)}

/* TAB BAR */
.dark .tab-bar{background:var(--sur);border-bottom:1px solid var(--bdr)}
.light .tab-bar{background:var(--sur);border-bottom:1.5px solid var(--bdr)}
.tab{height:36px;padding:0 13px;border:none;border-bottom:2px solid transparent;background:transparent;cursor:pointer;
  font-family:'DM Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;
  transition:all .13s;display:flex;align-items:center;gap:5px;white-space:nowrap}
.dark .tab{color:var(--txt3)}
.dark .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(52,211,153,.05)}
.dark .tab:hover:not(.on){color:var(--txt2)}
.light .tab{color:#6b9c6b}
.light .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(22,101,52,.05);font-weight:600;border-bottom-width:2.5px}
.light .tab:hover:not(.on){color:var(--txt2);background:rgba(22,101,52,.03)}

/* PANELS */
.dark .panel{background:linear-gradient(145deg,var(--sur),var(--s2));border:1px solid var(--bdr);border-radius:4px;position:relative;overflow:hidden}
.light .panel{background:var(--sur);border:1.5px solid var(--bdr);border-radius:10px;box-shadow:0 2px 14px rgba(22,101,52,.06)}

/* BUTTONS */
.dark .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 18px;
  border:1px solid var(--acc);border-radius:3px;background:rgba(52,211,153,.09);color:var(--acc);
  cursor:pointer;font-family:'DM Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;
  animation:breathe 2.5s ease-in-out infinite;transition:all .15s}
.dark .btn:hover{background:rgba(52,211,153,.2);transform:translateY(-1px)}
.dark .btn:disabled{opacity:.3;cursor:not-allowed;transform:none;animation:none}
.light .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 18px;
  border:none;border-radius:7px;background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;
  cursor:pointer;font-family:'DM Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;
  box-shadow:0 4px 14px rgba(22,101,52,.35);transition:all .15s}
.light .btn:hover{box-shadow:0 8px 24px rgba(22,101,52,.48);transform:translateY(-1px)}
.dark .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:4px 10px;
  border:1px solid var(--bdr);border-radius:3px;background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'DM Mono',monospace;font-size:9.5px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;transition:all .12s}
.dark .btn-ghost:hover,.dark .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(52,211,153,.06)}
.light .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:4px 10px;
  border:1.5px solid var(--bdr);border-radius:6px;background:transparent;color:#6b9c6b;cursor:pointer;
  font-family:'DM Mono',monospace;font-size:9.5px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;transition:all .12s}
.light .btn-ghost:hover,.light .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(22,101,52,.07)}

/* INPUTS / RANGE */
.dark .inp{background:rgba(0,0,0,.5);border:1px solid var(--bdr);border-radius:3px;color:var(--txt);
  font-family:'DM Mono',monospace;font-size:12px;padding:6px 10px;outline:none;width:100%;transition:all .13s}
.dark .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(52,211,153,.1)}
.light .inp{background:#edf5ed;border:1.5px solid var(--bdr);border-radius:7px;color:var(--txt);
  font-family:'DM Mono',monospace;font-size:12px;padding:6px 10px;outline:none;width:100%;transition:all .13s}
.light .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(22,101,52,.1)}
.range-wrap{position:relative;flex:1}
.dark .range{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;background:rgba(52,211,153,.1)}
.dark .range::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--acc);box-shadow:0 0 8px rgba(52,211,153,.5);cursor:pointer}
.light .range{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;background:rgba(22,101,52,.15)}
.light .range::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--acc);box-shadow:0 2px 8px rgba(22,101,52,.35);cursor:pointer}

/* TOGGLE */
.toggle{position:relative;display:inline-block;width:36px;height:20px;flex-shrink:0;cursor:pointer}
.toggle input{opacity:0;width:0;height:0;position:absolute}
.tog-sl{position:absolute;inset:0;border-radius:10px;transition:.2s}
.dark .tog-sl{background:rgba(52,211,153,.1);border:1px solid var(--bdr)}
.dark input:checked+.tog-sl{background:rgba(52,211,153,.4);border-color:var(--acc)}
.tog-sl::after{content:'';position:absolute;left:3px;top:3px;width:14px;height:14px;border-radius:50%;background:#888;transition:.2s}
.dark .tog-sl::after{background:var(--txt3)}
.dark input:checked+.tog-sl::after{background:var(--acc);left:19px;box-shadow:0 0 8px rgba(52,211,153,.6)}
.light .tog-sl{background:rgba(22,101,52,.1);border:1.5px solid var(--bdr)}
.light input:checked+.tog-sl{background:rgba(22,101,52,.4);border-color:var(--acc)}
.light .tog-sl::after{background:#a0b8a0}
.light input:checked+.tog-sl::after{background:#fff;left:19px}

/* MISC */
.dark .lbl{font-size:8.5px;font-weight:500;font-family:'DM Mono',monospace;letter-spacing:.2em;text-transform:uppercase;color:rgba(52,211,153,.45);display:block;margin-bottom:5px}
.light .lbl{font-size:8.5px;font-weight:500;font-family:'DM Mono',monospace;letter-spacing:.2em;text-transform:uppercase;color:var(--acc);display:block;margin-bottom:5px}
.dark .sec-title{font-size:8.5px;font-weight:500;font-family:'DM Mono',monospace;letter-spacing:.22em;text-transform:uppercase;color:rgba(52,211,153,.38);margin-bottom:7px}
.light .sec-title{font-size:8.5px;font-weight:500;font-family:'DM Mono',monospace;letter-spacing:.22em;text-transform:uppercase;color:var(--acc);margin-bottom:7px}
.dark .metric{border:1px solid rgba(52,211,153,.12);border-radius:3px;padding:10px 13px;background:rgba(52,211,153,.04)}
.light .metric{border:1.5px solid rgba(22,101,52,.18);border-radius:8px;padding:10px 13px;background:rgba(22,101,52,.04)}
.dark .ad-slot{background:rgba(52,211,153,.014);border:1px dashed rgba(52,211,153,.12);border-radius:3px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:var(--txt3);font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.12em;text-transform:uppercase}
.light .ad-slot{background:rgba(22,101,52,.03);border:1.5px dashed rgba(22,101,52,.18);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:#6b9c6b;font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.12em;text-transform:uppercase}
.dark .hint{font-size:12.5px;color:var(--txt2);line-height:1.75;padding:8px 12px;border-radius:3px;background:rgba(52,211,153,.04);border-left:2px solid rgba(52,211,153,.3)}
.light .hint{font-size:12.5px;color:var(--txt2);line-height:1.75;padding:8px 12px;border-radius:8px;background:rgba(22,101,52,.05);border-left:2.5px solid rgba(22,101,52,.3)}
.dark .sidebar{border-right:1px solid var(--bdr);background:var(--sur);padding:12px 10px;overflow-y:auto;display:flex;flex-direction:column;gap:11px}
.light .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);padding:12px 10px;overflow-y:auto;display:flex;flex-direction:column;gap:11px}
.body-layout{display:grid;grid-template-columns:210px 1fr;min-height:calc(100vh - 76px)}
.prose p{font-size:13.5px;line-height:1.78;margin-bottom:12px;color:var(--txt2)}
.prose h3{font-size:15px;font-weight:700;margin:22px 0 8px;color:var(--txt);font-family:'Unbounded',sans-serif;font-size:13px}
.prose ul{padding-left:20px;margin-bottom:12px}
.prose li{font-size:13.5px;line-height:1.72;margin-bottom:5px;color:var(--txt2)}
.prose strong{font-weight:700;color:var(--txt)}
.step-n{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:10px;font-weight:700;flex-shrink:0}
.dark .step-n{border:1px solid rgba(52,211,153,.3);background:rgba(52,211,153,.07);color:var(--acc)}
.light .step-n{border:1.5px solid rgba(22,101,52,.3);background:rgba(22,101,52,.07);color:var(--acc)}
`;

/* ═══ ICONS ═══ */
const Svg=({d,s=14,sw=1.8,fill='none'})=>(
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {(Array.isArray(d)?d:[d]).map((p,i)=><path key={i} d={p}/>)}
  </svg>
);
const I={
  leaf:  s=><Svg s={s} d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>,
  car:   s=><Svg s={s} d={["M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2","M14 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z","M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"]}/>,
  plane: s=><Svg s={s} d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>,
  home:  s=><Svg s={s} d={["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z","M9 22V12h6v10"]}/>,
  food:  s=><Svg s={s} d={["M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2","M7 2v20","M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"]}/>,
  zap:   s=><Svg s={s} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>,
  info:  s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 16v-4M12 8h.01"]}/>,
  chart: s=><Svg s={s} d={["M18 20V10","M12 20V4","M6 20v-6"]}/>,
  book:  s=><Svg s={s} d={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z","M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]}/>,
  bulb:  s=><Svg s={s} d={["M9 21h6","M12 3a6 6 0 0 1 6 6c0 2-.8 3.8-2 5l-1 1H9l-1-1A7.9 7.9 0 0 1 6 9a6 6 0 0 1 6-6z"]}/>
};

/* ═══ EMISSION DATA ═══ */
const DIET_FACTORS = {
  vegan:      { kg: 1500,  label: 'Vegan',       emoji: '🌱', desc: 'Plant-based only' },
  vegetarian: { kg: 1700,  label: 'Vegetarian',  emoji: '🥗', desc: 'No meat, some dairy' },
  average:    { kg: 2500,  label: 'Average',      emoji: '🍽️', desc: 'Mixed western diet' },
  meat:       { kg: 3300,  label: 'High Meat',   emoji: '🥩', desc: 'Daily red meat' },
};

const TRANSPORT_MODES = {
  car:     { factor: 0.40, label: 'Car (gasoline)',  emoji: '🚗', unit: 'kg/mi' },
  electric:{ factor: 0.12, label: 'Electric car',    emoji: '⚡', unit: 'kg/mi' },
  transit: { factor: 0.09, label: 'Public transit',  emoji: '🚌', unit: 'kg/mi' },
  bike:    { factor: 0.00, label: 'Walk / Bike',     emoji: '🚲', unit: 'kg/mi' },
};

const AVG_GLOBAL_TONNES = 4.7;
const AVG_US_TONNES = 14.9;

function calcFootprint({ transport, transportMode, diet, flights, housing, electricity, streaming }) {
  const transKg   = transport * 52 * TRANSPORT_MODES[transportMode].factor;
  const dietKg    = DIET_FACTORS[diet].kg;
  const flightKg  = flights * 500;
  const housingKg = housing === 'dorm' ? 800 : housing === 'apt' ? 2200 : 3500;
  const elecKg    = electricity * 12 * 0.42;
  const streamKg  = streaming * 52 * 0.036;

  const total = transKg + dietKg + flightKg + housingKg + elecKg + streamKg;
  return {
    total: (total / 1000),
    breakdown: [
      { key:'transport', label:'Transport',  kg: transKg,   emoji:'🚗', pct: 0 },
      { key:'diet',      label:'Diet',       kg: dietKg,    emoji:'🍽️', pct: 0 },
      { key:'flights',   label:'Aviation',   kg: flightKg,  emoji:'✈️', pct: 0 },
      { key:'housing',   label:'Housing',    kg: housingKg, emoji:'🏠', pct: 0 },
      { key:'electric',  label:'Electricity',kg: elecKg,    emoji:'⚡', pct: 0 },
      { key:'streaming', label:'Streaming',  kg: streamKg,  emoji:'📱', pct: 0 },
    ].map(b => ({ ...b, pct: total > 0 ? (b.kg / total * 100) : 0 }))
  };
}

const BAR_COLORS_DARK  = ['#34d399','#a78bfa','#60a5fa','#f97316','#fbbf24','#f472b6'];
const BAR_COLORS_LIGHT = ['#166534','#6d28d9','#1d4ed8','#c2410c','#b45309','#be185d'];

/* Animated score ring */
function ScoreRing({ tonnes, dark }) {
  const max = 20;
  const pct = Math.min(tonnes / max, 1);
  const r = 70, cx = 80, cy = 80;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const color = tonnes < 3 ? '#34d399' : tonnes < 6 ? '#fbbf24' : tonnes < 10 ? '#f97316' : '#f87171';
  const label = tonnes < 3 ? 'Excellent' : tonnes < 6 ? 'Below avg' : tonnes < 10 ? 'Above avg' : 'High impact';
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
      <svg viewBox="0 0 160 160" style={{width:160,height:160}}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={dark?'rgba(52,211,153,.1)':'rgba(22,101,52,.1)'} strokeWidth="10"/>
        {/* Fill */}
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          style={{transition:'stroke-dasharray .8s cubic-bezier(.34,1.56,.64,1)',filter:`drop-shadow(0 0 6px ${color}88)`}}/>
        {/* Leaf icon centre */}
        <text x={cx} y={cy-12} textAnchor="middle" fontSize="26" dominantBaseline="central">🌿</text>
        <text x={cx} y={cy+10} textAnchor="middle" fontSize="22" fontFamily="Unbounded,sans-serif"
          fontWeight="800" fill={color} style={{transition:'fill .4s'}}>
          {tonnes.toFixed(2)}
        </text>
        <text x={cx} y={cy+30} textAnchor="middle" fontSize="9" fontFamily="DM Mono,monospace"
          fill={dark?'rgba(255,255,255,.4)':'rgba(0,0,0,.4)'}>
          TONNES CO₂/YR
        </text>
      </svg>
      <div style={{fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",letterSpacing:'.12em',
        textTransform:'uppercase',color,padding:'3px 10px',borderRadius:2,
        background:`${color}18`,border:`1px solid ${color}44`}}>
        {label}
      </div>
      <div style={{display:'flex',gap:12,fontSize:10,fontFamily:"'DM Mono',monospace",color:dark?'rgba(255,255,255,.35)':'rgba(0,0,0,.35)'}}>
        <span>🌍 Global avg: {AVG_GLOBAL_TONNES}t</span>
        <span>🇺🇸 US avg: {AVG_US_TONNES}t</span>
      </div>
    </div>
  );
}

/* Horizontal bar */
function EmissionBar({ item, max, dark, colorIdx }) {
  const col = dark ? BAR_COLORS_DARK[colorIdx] : BAR_COLORS_LIGHT[colorIdx];
  const pct = max > 0 ? Math.max(2, (item.kg / max) * 100) : 2;
  return (
    <div style={{marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <span style={{fontSize:14}}>{item.emoji}</span>
          <span style={{fontSize:12,fontWeight:600,color:'var(--txt)'}}>{item.label}</span>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <span style={{fontSize:10.5,fontFamily:"'DM Mono',monospace",color:'var(--txt2)',fontWeight:600}}>
            {(item.kg/1000).toFixed(2)}t
          </span>
          <span style={{fontSize:9.5,fontFamily:"'DM Mono',monospace",color:'var(--txt3)'}}>
            {item.pct.toFixed(0)}%
          </span>
        </div>
      </div>
      <div style={{height:6,borderRadius:3,background:dark?'rgba(255,255,255,.06)':'rgba(0,0,0,.06)',overflow:'hidden'}}>
        <motion.div
          initial={{width:0}} animate={{width:`${pct}%`}}
          transition={{duration:.7, ease:[.34,1.1,.64,1]}}
          style={{height:'100%',borderRadius:3,background:col,
            boxShadow:dark?`0 0 8px ${col}66`:'none'}}/>
      </div>
    </div>
  );
}

/* Tips data */
const TIPS = [
  { icon:'🚗', title:'Drive less',          save:'0.5–2.4t', desc:'Cut daily driving by 5 miles. Better: switch to EV or public transit. Best: walk or cycle.',       category:'transport' },
  { icon:'🥗', title:'Eat less red meat',   save:'0.5–1.8t', desc:'One meatless day per week saves ~360kg CO₂/yr. Going fully vegetarian saves over 1 tonne.',        category:'diet' },
  { icon:'✈️', title:'Fly less',            save:'1–3t',     desc:'One transatlantic round trip emits ~1.5t CO₂. Replace with train travel or video calls when possible.',category:'flights' },
  { icon:'💡', title:'Switch to LED + solar',save:'0.3–1.2t', desc:'LED bulbs use 75% less energy. Solar panels eliminate grid electricity emissions entirely.',           category:'electric' },
  { icon:'🏠', title:'Insulate your home',  save:'0.2–1t',   desc:'Proper wall/roof insulation reduces heating energy by 30–45%. The biggest win for homeowners.',       category:'housing' },
  { icon:'♻️', title:'Buy less, buy used',  save:'0.2–0.8t', desc:'Manufacturing new goods is highly carbon-intensive. Second-hand shopping cuts product emissions.',    category:'lifestyle' },
  { icon:'📱', title:'Reduce screen time',  save:'0.02–0.1t',desc:'Streaming video consumes significant server energy. Lower quality or download offline.',              category:'streaming' },
  { icon:'🌳', title:'Plant trees / offset',save:'variable', desc:'Each mature tree absorbs ~22kg CO₂/yr. Offsets can neutralise unavoidable emissions.',                 category:'offset' },
];

const PAGE_TABS = [
  { id:'calculator', label:'🌿 Calculator' },
  { id:'breakdown',  label:'📊 Breakdown' },
  { id:'compare',    label:'⚖️ Compare' },
  { id:'tips',       label:'💡 Reduce' },
  { id:'guide',      label:'? Guide' },
  { id:'learn',      label:'∑ Learn' },
];

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
export default function CarbonFootprint() {
  const [mode, setMode] = useState('dark');
  const dark = mode === 'dark';

  // Inputs
  const [transport,      setTransport]      = useState(50);
  const [transportMode,  setTransportMode]  = useState('car');
  const [diet,           setDiet]           = useState('average');
  const [flights,        setFlights]        = useState(2);
  const [housing,        setHousing]        = useState('dorm'); // dorm | apt | house
  const [electricity,    setElectricity]    = useState(80);     // kWh/month
  const [streaming,      setStreaming]      = useState(14);     // hrs/week

  const [tab,  setTab]  = useState('calculator');
  const [tip,  setTip]  = useState(null);

  const result = useMemo(() =>
    calcFootprint({ transport, transportMode, diet, flights, housing, electricity, streaming }),
    [transport, transportMode, diet, flights, housing, electricity, streaming]
  );

  // For compare tab — a second profile
  const [cmp, setCmp] = useState({
    transport:50, transportMode:'electric', diet:'vegetarian',
    flights:1, housing:'apt', electricity:60, streaming:7
  });
  const cmpResult = useMemo(() => calcFootprint(cmp), [cmp]);

  const maxKg = Math.max(...result.breakdown.map(b=>b.kg), 1);

  return (
    <>
      <style>{STYLES}</style>
      <div className={dark?'dark':'light'}>

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <div style={{width:26,height:26,borderRadius:dark?3:7,
              background:dark?'transparent':'linear-gradient(135deg,#166534,#15803d)',
              border:dark?'1px solid rgba(52,211,153,.45)':'none',
              display:'flex',alignItems:'center',justifyContent:'center',
              color:dark?'var(--acc)':'#fff',fontSize:14,
              boxShadow:dark?'0 0 12px rgba(52,211,153,.25)':'0 3px 10px rgba(22,101,52,.4)'}}>
              🌿
            </div>
            <span style={{fontSize:13.5,fontWeight:800,fontFamily:"'Unbounded',sans-serif",
              color:'var(--txt)',letterSpacing:'.01em'}}>
              carbon<span style={{color:'var(--acc)'}}>.calc</span>
            </span>
          </div>
          <div style={{flex:1}}/>

          {/* Live total pill */}
          <div style={{display:'flex',alignItems:'center',gap:6,padding:'3px 11px',
            borderRadius:dark?2:7,
            border:dark?'1px solid rgba(52,211,153,.25)':'1.5px solid rgba(22,101,52,.22)',
            background:dark?'rgba(52,211,153,.06)':'rgba(22,101,52,.05)'}}>
            <span style={{fontSize:9.5,fontFamily:"'DM Mono',monospace",
              color:result.total < 6 ? 'var(--ok)' : 'var(--warn)',letterSpacing:'.1em'}}>
              {result.total.toFixed(2)}t CO₂/yr
            </span>
          </div>

          {/* Theme */}
          <button onClick={()=>setMode(dark?'light':'dark')} style={{
            display:'flex',alignItems:'center',gap:5,padding:'4px 10px',
            border:dark?'1px solid rgba(52,211,153,.18)':'1.5px solid var(--bdr)',
            borderRadius:dark?2:6,background:dark?'rgba(52,211,153,.03)':'var(--sur)',
            cursor:'pointer',transition:'all .14s'}}>
            {dark?(
              <><div style={{width:26,height:14,borderRadius:7,background:'var(--acc)',position:'relative',boxShadow:'0 0 7px rgba(52,211,153,.5)'}}>
                <div style={{position:'absolute',top:2,right:2,width:10,height:10,borderRadius:'50%',background:'#030a05'}}/>
              </div><span style={{fontSize:9,fontWeight:700,fontFamily:"'DM Mono',monospace",color:'rgba(52,211,153,.6)',letterSpacing:'.1em'}}>ECO</span></>
            ):(
              <><span style={{fontSize:9.5,color:'#6b9c6b',fontWeight:600,fontFamily:"'DM Mono',monospace"}}>LGT</span>
              <div style={{width:26,height:14,borderRadius:7,background:'#c8dfc8',position:'relative'}}>
                <div style={{position:'absolute',top:2,left:2,width:10,height:10,borderRadius:'50%',background:'#8ab88a'}}/>
              </div></>
            )}
          </button>
        </div>

        {/* TAB BAR */}
        <div className="tab-bar" style={{display:'flex'}}>
          {PAGE_TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* BODY */}
        <div className="body-layout">

          {/* SIDEBAR */}
          <div className="sidebar">

            {/* Quick stats */}
            <div>
              <div className="sec-title">Your Footprint</div>
              {[
                {l:'Total',       v:`${result.total.toFixed(2)}t`, c:result.total<6?'var(--ok)':'var(--warn)'},
                {l:'vs Global',   v:`${((result.total/AVG_GLOBAL_TONNES-1)*100).toFixed(0)}%`,
                  c:result.total<AVG_GLOBAL_TONNES?'var(--ok)':'var(--err)'},
                {l:'vs US avg',   v:`${((result.total/AVG_US_TONNES-1)*100).toFixed(0)}%`,
                  c:result.total<AVG_US_TONNES?'var(--ok)':'var(--warn)'},
              ].map(({l,v,c})=>(
                  <div key={l} className="metric" style={{marginBottom:5}}>
                    <div style={{fontSize:8.5,fontFamily:"'DM Mono',monospace",letterSpacing:'.12em',textTransform:'uppercase',color:'var(--txt3)',marginBottom:2}}>{l}</div>
                  <div style={{fontSize:18,fontWeight:800,fontFamily:"'Unbounded',sans-serif",color:c}}>{v}</div>
                </div>
              ))}
            </div>

            {/* Biggest emitter */}
            <div>
              <div className="sec-title">Top Source</div>
              {(() => {
                const top = [...result.breakdown].sort((a,b)=>b.kg-a.kg)[0];
                return (
                  <div className="metric">
                    <div style={{fontSize:22,marginBottom:3}}>{top.emoji}</div>
                    <div style={{fontSize:12,fontWeight:700,color:'var(--txt)'}}>{top.label}</div>
                    <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:'var(--txt3)',marginTop:2}}>
                      {(top.kg/1000).toFixed(2)}t · {top.pct.toFixed(0)}% of total
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Tips shortlist */}
            <div>
              <div className="sec-title">Quick Wins</div>
              {TIPS.slice(0,4).map((t,i)=>(
                <div key={i} style={{display:'flex',gap:7,marginBottom:7,
                  padding:'6px 8px',borderRadius:dark?2:5,cursor:'pointer',
                  border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                  transition:'border-color .12s'}}
                  onClick={()=>{setTip(i);setTab('tips');}}>
                  <span style={{fontSize:14,flexShrink:0}}>{t.icon}</span>
                  <div>
                    <div style={{fontSize:11,fontWeight:600,color:'var(--txt)'}}>{t.title}</div>
                    <div style={{fontSize:9.5,fontFamily:"'DM Mono',monospace",color:'var(--ok)'}}>save {t.save}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* MAIN */}
          <div style={{padding:'13px 15px',display:'flex',flexDirection:'column',gap:13}}>
            <AnimatePresence mode="wait">

              {/* ════ CALCULATOR ════ */}
              {tab==='calculator'&&(
                <motion.div key="calc" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>

                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
                    {/* Inputs */}
                    <div className="panel" style={{padding:'16px 18px',display:'flex',flexDirection:'column',gap:14}}>

                      {/* Transport */}
                      <div>
                        <div className="lbl" style={{display:'flex',alignItems:'center',gap:5,marginBottom:6}}>
                          🚗 Weekly commute
                        </div>
                        <div style={{display:'flex',gap:6,marginBottom:8}}>
                          {Object.entries(TRANSPORT_MODES).map(([k,v])=>(
                            <button key={k} className={`btn-ghost ${transportMode===k?'on':''}`}
                              onClick={()=>setTransportMode(k)}
                              style={{padding:'4px 7px',fontSize:9,flex:1,flexDirection:'column',gap:1,height:'auto'}}>
                              <span>{v.emoji}</span>
                              <span style={{fontSize:8}}>{k}</span>
                            </button>
                          ))}
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <input type="range" min="0" max="300" step="5" value={transport}
                            onChange={e=>setTransport(+e.target.value)}
                            className="range" style={{flex:1}}/>
                          <span style={{fontSize:12,fontFamily:"'DM Mono',monospace",
                            color:'var(--acc)',minWidth:50,textAlign:'right',fontWeight:600}}>
                            {transport} mi/wk
                          </span>
                        </div>
                        <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:'var(--txt3)',marginTop:3}}>
                          {TRANSPORT_MODES[transportMode].factor} kg CO₂/mile · annual: {(transport*52*TRANSPORT_MODES[transportMode].factor/1000).toFixed(2)}t
                        </div>
                      </div>

                      {/* Diet */}
                      <div>
                        <div className="lbl">🍽️ Dietary Habit</div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5}}>
                          {Object.entries(DIET_FACTORS).map(([k,v])=>(
                            <button key={k} className={`btn-ghost ${diet===k?'on':''}`}
                              onClick={()=>setDiet(k)}
                              style={{padding:'6px 8px',height:'auto',flexDirection:'column',gap:2,alignItems:'flex-start',
                                background:diet===k?(dark?'rgba(52,211,153,.08)':'rgba(22,101,52,.07)'):''
                              }}>
                              <span style={{fontSize:13}}>{v.emoji}</span>
                              <span style={{fontSize:10,fontWeight:600}}>{v.label}</span>
                              <span style={{fontSize:8.5,opacity:.6,fontFamily:"'DM Mono',monospace"}}>~{(v.kg/1000).toFixed(1)}t/yr</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Flights */}
                      <div>
                        <div className="lbl">✈️ Annual Flights</div>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <input type="range" min="0" max="20" step="1" value={flights}
                            onChange={e=>setFlights(+e.target.value)}
                            className="range" style={{flex:1}}/>
                          <span style={{fontSize:12,fontFamily:"'DM Mono',monospace",
                            color:'var(--acc)',minWidth:55,textAlign:'right',fontWeight:600}}>
                            {flights} flight{flights!==1?'s':''}
                          </span>
                        </div>
                        <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:'var(--txt3)',marginTop:3}}>
                          ~500 kg CO₂/flight · annual: {(flights*500/1000).toFixed(2)}t
                        </div>
                      </div>

                    </div>

                    {/* Second column inputs */}
                    <div className="panel" style={{padding:'16px 18px',display:'flex',flexDirection:'column',gap:14}}>

                      {/* Housing */}
                      <div>
                        <div className="lbl">🏠 Living situation</div>
                        <div style={{display:'flex',flexDirection:'column',gap:5}}>
                          {[
                            {k:'dorm',  l:'Campus Dorm',    e:'🏫', desc:'Shared systems — lowest impact', kg:800},
                            {k:'apt',   l:'Shared Apartment',e:'🏢', desc:'Some shared utilities', kg:2200},
                            {k:'house', l:'Private House',  e:'🏡', desc:'Full energy footprint', kg:3500},
                          ].map(({k,l,e,desc,kg})=>(
                            <button key={k} className={`btn-ghost ${housing===k?'on':''}`}
                              onClick={()=>setHousing(k)}
                              style={{padding:'7px 10px',height:'auto',justifyContent:'flex-start',gap:8,
                                background:housing===k?(dark?'rgba(52,211,153,.08)':'rgba(22,101,52,.07)'):''
                              }}>
                              <span style={{fontSize:18}}>{e}</span>
                              <div style={{textAlign:'left'}}>
                                <div style={{fontSize:11,fontWeight:600,color:housing===k?'var(--acc)':'var(--txt)'}}>{l}</div>
                                <div style={{fontSize:9.5,color:'var(--txt3)',fontFamily:"'DM Mono',monospace"}}>{desc} · {(kg/1000).toFixed(1)}t</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Electricity */}
                      <div>
                        <div className="lbl">⚡ Monthly electricity (kWh)</div>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <input type="range" min="0" max="400" step="10" value={electricity}
                            onChange={e=>setElectricity(+e.target.value)}
                            className="range" style={{flex:1}}/>
                          <span style={{fontSize:12,fontFamily:"'DM Mono',monospace",
                            color:'var(--acc)',minWidth:55,textAlign:'right',fontWeight:600}}>
                            {electricity} kWh
                          </span>
                        </div>
                        <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:'var(--txt3)',marginTop:3}}>
                          0.42 kg/kWh (avg grid) · annual: {(electricity*12*0.42/1000).toFixed(2)}t
                        </div>
                      </div>

                      {/* Streaming */}
                      <div>
                        <div className="lbl">📱 Weekly streaming (hrs)</div>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <input type="range" min="0" max="70" step="1" value={streaming}
                            onChange={e=>setStreaming(+e.target.value)}
                            className="range" style={{flex:1}}/>
                          <span style={{fontSize:12,fontFamily:"'DM Mono',monospace",
                            color:'var(--acc)',minWidth:50,textAlign:'right',fontWeight:600}}>
                            {streaming} hrs
                          </span>
                        </div>
                        <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:'var(--txt3)',marginTop:3}}>
                          36g CO₂/hr · annual: {(streaming*52*0.036/1000).toFixed(3)}t
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Score ring + bars */}
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:24,alignItems:'center'}}>
                      <ScoreRing tonnes={result.total} dark={dark}/>
                      <div>
                        <div className="lbl" style={{marginBottom:12}}>Emissions Breakdown</div>
                        {result.breakdown.map((b,i)=>(
                          <EmissionBar key={b.key} item={b} max={maxKg} dark={dark} colorIdx={i}/>
                        ))}
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* ════ BREAKDOWN ════ */}
              {tab==='breakdown'&&(
                <motion.div key="bd" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>

                  {/* Step-by-step calculation */}
                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div className="lbl" style={{marginBottom:12}}>Calculation Breakdown — Step by Step</div>
                    {[
                      {
                        emoji:'🚗', title:'Transport Emissions',
                        formula:`${transport} mi/wk × 52 wks × ${TRANSPORT_MODES[transportMode].factor} kg/mi`,
                        result:`${(transport*52*TRANSPORT_MODES[transportMode].factor).toFixed(0)} kg`,
                        note:`Using ${TRANSPORT_MODES[transportMode].label} emission factor`
                      },
                      {
                        emoji:'🍽️', title:'Diet Emissions',
                        formula:`${DIET_FACTORS[diet].label} diet baseline`,
                        result:`${DIET_FACTORS[diet].kg} kg`,
                        note:`${DIET_FACTORS[diet].desc}`
                      },
                      {
                        emoji:'✈️', title:'Aviation Emissions',
                        formula:`${flights} flights × 500 kg/flight`,
                        result:`${flights*500} kg`,
                        note:'Average short-to-medium haul flight factor'
                      },
                      {
                        emoji:'🏠', title:'Housing Emissions',
                        formula:`${housing === 'dorm' ? 'Shared dorm' : housing === 'apt' ? 'Apartment' : 'Private house'} baseline`,
                        result:`${housing==='dorm'?800:housing==='apt'?2200:3500} kg`,
                        note:'Heating, cooling, and shared utilities'
                      },
                      {
                        emoji:'⚡', title:'Electricity Emissions',
                        formula:`${electricity} kWh/mo × 12 mo × 0.42 kg/kWh`,
                        result:`${(electricity*12*0.42).toFixed(0)} kg`,
                        note:'Average grid carbon intensity: 0.42 kg CO₂/kWh'
                      },
                      {
                        emoji:'📱', title:'Streaming Emissions',
                        formula:`${streaming} hrs/wk × 52 wks × 0.036 kg/hr`,
                        result:`${(streaming*52*0.036).toFixed(1)} kg`,
                        note:'Data centres + device energy for video streaming'
                      },
                    ].map(({emoji,title,formula,result:r,note},i)=>(
                      <div key={i} style={{display:'flex',gap:12,marginBottom:i<5?16:0,paddingBottom:i<5?16:0,
                        borderBottom:i<5?(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'):'none'}}>
                        <div style={{fontSize:22,flexShrink:0,width:32,textAlign:'center'}}>{emoji}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12.5,fontWeight:700,color:'var(--txt)',marginBottom:4}}>{title}</div>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,
                            color:dark?'rgba(52,211,153,.7)':'rgba(22,101,52,.7)',marginBottom:3,
                            padding:'3px 8px',background:dark?'rgba(0,0,0,.3)':'rgba(22,101,52,.04)',
                            borderRadius:dark?2:4,display:'inline-block'}}>
                            {formula} = <strong style={{color:'var(--acc)'}}>{r}</strong>
                          </div>
                          <div style={{fontSize:11,color:'var(--txt3)',fontFamily:"'DM Mono',monospace"}}>{note}</div>
                        </div>
                      </div>
                    ))}

                    {/* Total */}
                    <div style={{marginTop:16,padding:'12px 14px',borderRadius:dark?3:8,
                      background:dark?'rgba(52,211,153,.07)':'rgba(22,101,52,.06)',
                      border:dark?'1px solid rgba(52,211,153,.2)':'1.5px solid rgba(22,101,52,.2)',
                      display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:600,color:'var(--txt)'}}>
                        Total Annual CO₂
                      </span>
                      <span style={{fontSize:22,fontWeight:800,fontFamily:"'Unbounded',sans-serif",color:'var(--acc)'}}>
                        {result.total.toFixed(2)} t
                      </span>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* ════ COMPARE ════ */}
              {tab==='compare'&&(
                <motion.div key="cmp" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>
                  <div className="hint" style={{display:'flex',gap:7,fontSize:12}}>
                    {I.info(13)} Compare your footprint against a different lifestyle profile. Adjust the "Eco Profile" values below.
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:16,alignItems:'start'}}>
                    {/* You */}
                    <div>
                      <div className="lbl" style={{marginBottom:10}}>Your Profile</div>
                      <ScoreRing tonnes={result.total} dark={dark}/>
                      <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:6}}>
                        {result.breakdown.map((b,i)=>(
                          <div key={b.key} style={{display:'flex',justifyContent:'space-between',
                            fontSize:11.5,fontFamily:"'DM Mono',monospace"}}>
                            <span style={{color:'var(--txt2)'}}>{b.emoji} {b.label}</span>
                            <span style={{color:'var(--acc)',fontWeight:600}}>{(b.kg/1000).toFixed(2)}t</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* VS */}
                    <div style={{display:'flex',alignItems:'center',justifyContent:'center',
                      padding:'0 12px',fontSize:18,fontWeight:800,fontFamily:"'Unbounded',sans-serif",
                      color:'var(--txt3)'}}>VS</div>

                    {/* Eco */}
                    <div>
                      <div className="lbl" style={{marginBottom:10}}>Eco Profile</div>
                      <ScoreRing tonnes={cmpResult.total} dark={dark}/>
                      <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:7}}>
                        {[
                          {l:'Transport mode', k:'transportMode', opts:Object.keys(TRANSPORT_MODES)},
                          {l:'Diet',           k:'diet',          opts:Object.keys(DIET_FACTORS)},
                          {l:'Housing',        k:'housing',       opts:['dorm','apt','house']},
                        ].map(({l,k,opts})=>(
                          <div key={k}>
                            <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:'var(--txt3)',marginBottom:3,letterSpacing:'.1em',textTransform:'uppercase'}}>{l}</div>
                            <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                              {opts.map(o=>(
                                <button key={o} className={`btn-ghost ${cmp[k]===o?'on':''}`}
                                  onClick={()=>setCmp(p=>({...p,[k]:o}))}
                                  style={{padding:'3px 8px',fontSize:9}}>
                                  {o}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        {/* Flights compare */}
                        <div>
                          <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:'var(--txt3)',marginBottom:3,letterSpacing:'.1em',textTransform:'uppercase'}}>Annual flights: {cmp.flights}</div>
                          <input type="range" min="0" max="15" value={cmp.flights}
                            onChange={e=>setCmp(p=>({...p,flights:+e.target.value}))}
                            className="range" style={{width:'100%'}}/>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delta */}
                  {(() => {
                    const diff = result.total - cmpResult.total;
                    const pctDiff = (diff/result.total*100).toFixed(0);
                    return diff > 0.01 ? (
                      <div style={{padding:'14px 16px',borderRadius:dark?3:8,textAlign:'center',
                        background:dark?'rgba(52,211,153,.07)':'rgba(22,101,52,.06)',
                        border:dark?'1px solid rgba(52,211,153,.2)':'1.5px solid rgba(22,101,52,.2)'}}>
                        <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:'var(--txt3)',marginBottom:4}}>
                          By switching to the Eco Profile, you could save:
                        </div>
                        <div style={{fontSize:28,fontWeight:800,fontFamily:"'Unbounded',sans-serif",color:'var(--ok)'}}>
                          −{diff.toFixed(2)}t CO₂/yr ({pctDiff}%)
                        </div>
                        <div style={{fontSize:11.5,color:'var(--txt2)',marginTop:4}}>
                          Equivalent to planting ~{Math.round(diff*1000/22)} trees
                        </div>
                      </div>
                    ) : diff < -0.01 ? (
                      <div style={{padding:'14px 16px',borderRadius:dark?3:8,textAlign:'center',
                        background:dark?'rgba(248,113,113,.06)':'rgba(220,38,38,.04)',
                        border:dark?'1px solid rgba(248,113,113,.15)':'1.5px solid rgba(220,38,38,.15)'}}>
                        <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:'var(--txt3)',marginBottom:4}}>
                          The Eco Profile actually emits more:
                        </div>
                        <div style={{fontSize:28,fontWeight:800,fontFamily:"'Unbounded',sans-serif",color:'var(--err)'}}>
                          +{(-diff).toFixed(2)}t CO₂/yr
                        </div>
                      </div>
                    ) : (
                      <div style={{padding:'12px',textAlign:'center',fontSize:12,fontFamily:"'DM Mono',monospace",color:'var(--txt3)'}}>
                        Both profiles produce similar emissions.
                      </div>
                    );
                  })()}

                </motion.div>
              )}

              {/* ════ TIPS ════ */}
              {tab==='tips'&&(
                <motion.div key="tips" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:11}}>
                  <div className="hint" style={{display:'flex',gap:7,fontSize:12}}>
                    {I.bulb(13)} Practical ways to reduce your {result.total.toFixed(2)}t footprint. Click any card for details.
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:10}}>
                    {TIPS.map((t,i)=>(
                      <motion.div key={i} className="panel"
                        onClick={()=>setTip(tip===i?null:i)}
                        initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*.04}}
                        style={{padding:'14px 16px',cursor:'pointer',
                          borderColor:tip===i?(dark?'rgba(52,211,153,.4)':'rgba(22,101,52,.4)'):'',
                          background:tip===i?(dark?'rgba(52,211,153,.07)':'rgba(22,101,52,.05)'):'',
                          transition:'all .15s',boxShadow:tip===i?(dark?'0 0 18px rgba(52,211,153,.1)':'0 4px 18px rgba(22,101,52,.12)'):''
                        }}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <span style={{fontSize:22}}>{t.icon}</span>
                            <div>
                              <div style={{fontSize:13,fontWeight:700,color:tip===i?'var(--acc)':'var(--txt)'}}>{t.title}</div>
                              <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:'var(--ok)',fontWeight:600}}>
                                save up to {t.save}
                              </div>
                            </div>
                          </div>
                          <span style={{fontSize:9,fontFamily:"'DM Mono',monospace",padding:'2px 6px',
                            borderRadius:dark?2:4,
                            background:dark?'rgba(52,211,153,.08)':'rgba(22,101,52,.07)',
                            border:dark?'1px solid rgba(52,211,153,.15)':'1.5px solid rgba(22,101,52,.15)',
                            color:'var(--acc)'}}>
                            {t.category}
                          </span>
                        </div>
                        <AnimatePresence>
                          {tip===i&&(
                            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}}
                              exit={{height:0,opacity:0}} style={{overflow:'hidden'}}>
                              <div style={{fontSize:12.5,color:'var(--txt2)',lineHeight:1.72,paddingTop:6,
                                borderTop:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',marginTop:6}}>
                                {t.desc}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                  
                </motion.div>
              )}

              {/* ════ GUIDE ════ */}
              {tab==='guide'&&(
                <motion.div key="guide" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:10}}>
                  {[
                    {t:'Set your transport details', d:'Choose your vehicle type (car, EV, transit, or bike) then drag the weekly commute slider. The emission factor shown updates automatically.'},
                    {t:'Select your diet',           d:'Food production is one of the largest personal emissions sources. Vegan diets generate roughly half the CO₂ of a high-meat western diet.'},
                    {t:'Enter annual flights',       d:'Aviation is the most carbon-intensive per hour of any transport mode. Each return flight is estimated at ~500 kg CO₂ — adjust for actual distances.'},
                    {t:'Set housing type',           d:'Shared living (dorms, apartments) has much lower per-person heating and cooling emissions than a private house.'},
                    {t:'Add electricity and streaming', d:'Monthly kWh usage and screen time both contribute. These are often overlooked but meaningful, especially for heavy streamers.'},
                    {t:'Read the Breakdown tab',    d:'The Breakdown tab shows the exact calculation for every category so you can understand and verify the figures.'},
                    {t:'Compare profiles',          d:'The Compare tab lets you set a hypothetical Eco Profile and see exactly how much you could save by making specific changes.'},
                    {t:'Explore reduction tips',    d:'The Reduce tab lists 8 actionable steps ranked by potential CO₂ savings. Click any card to expand the details.'},
                  ].map(({t,d},i)=>(
                    <div key={i} style={{display:'flex',gap:10}}>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
                        <div className="step-n">{i+1}</div>
                        {i<7&&<div style={{width:1.5,flex:1,marginTop:4,background:dark?'rgba(52,211,153,.1)':'rgba(22,101,52,.12)'}}/>}
                      </div>
                      <div style={{flex:1,paddingTop:1,paddingBottom:10}}>
                        <div style={{fontSize:13,fontWeight:700,color:'var(--txt)',marginBottom:3,fontFamily:"'DM Mono',monospace"}}>{t}</div>
                        <div style={{fontSize:13,color:'var(--txt2)',lineHeight:1.72}}>{d}</div>
                      </div>
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {/* ════ LEARN ════ */}
              {tab==='learn'&&(
                <motion.div key="learn" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <div className="panel" style={{padding:'20px 22px',marginBottom:12}}>
                    <div style={{fontSize:20,fontWeight:800,fontFamily:"'Unbounded',sans-serif",
                      color:'var(--txt)',marginBottom:3,lineHeight:1.2}}>
                      Sustainable Living: A Student's Guide
                    </div>
                    <p style={{fontSize:11,color:'var(--txt3)',fontFamily:"'DM Mono',monospace",marginBottom:20}}>
                      Carbon footprints · emission factors · net zero · climate science
                    </p>
                    <div className="prose">
                      <p>A carbon footprint is the total greenhouse gases generated by an individual's actions, measured in tonnes of CO₂ equivalent (tCO₂e). For most people in developed countries, the biggest contributors are transport, diet, and home energy — not single-use plastics or digital consumption, which are comparatively small.</p>
                      <h3>Why Does Diet Matter So Much?</h3>
                      <p>Food production accounts for roughly <strong>26% of global greenhouse gas emissions</strong>. Raising beef produces 20× more CO₂e per gram of protein than growing lentils. This is due to: methane from livestock digestion, deforestation for grazing land, and the energy-intensive nature of animal feed production. Switching from a high-meat to a plant-rich diet is the single highest-impact lifestyle change most individuals can make.</p>
                      <h3>The Aviation Problem</h3>
                      <p>Flying is carbon-intensive per hour because jet engines burn enormous volumes of kerosene at altitude. At cruise altitude, the contrails and NOx emissions have an additional warming effect (the "radiative forcing factor"), meaning the actual climate impact of a flight can be 2–4× the CO₂ figure alone. Business class passengers have a higher footprint because fewer passengers share the same fuel burn per seat.</p>
                      <h3>Electricity and the Grid Mix</h3>
                      <p>The emission intensity of electricity depends entirely on how it is generated. Norway's hydro-dominated grid emits ~0.02 kg CO₂/kWh; Poland's coal-heavy grid emits ~0.85 kg CO₂/kWh. The global average is ~0.42 kg/kWh. This means the same electric car produces 5× less CO₂ in Norway than in Poland. As grids become greener, all electric devices automatically improve.</p>
                      <h3>What is Net Zero?</h3>
                      <p>Net zero means that the total greenhouse gases put into the atmosphere equals the amount removed. It does not require zero emissions — it requires that any remaining emissions are balanced by carbon removal (reforestation, direct air capture, etc.). The <strong>Paris Agreement</strong> target is to reach global net zero by 2050 to limit warming to 1.5°C above pre-industrial levels.</p>
                      <h3>The "1.5°C Budget" Per Person</h3>
                      <p>To stay within the 1.5°C pathway, scientists estimate each person on Earth needs to reach a footprint of roughly <strong>2.5 tonnes CO₂e per year by 2030</strong>. The current global average is ~4.7t; the US average is ~14.9t. This context makes the figures in this calculator meaningful — not just for personal awareness, but as a measure against a global target.</p>
                      {[
                        {q:'Is dorm living actually better for the environment?', a:'Yes, generally. Shared heating, cooling, laundry, and water systems are significantly more energy-efficient per person than individual apartments. Additionally, dorms typically eliminate the need for a car, which is often the largest single emission source for students.'},
                        {q:'How accurate are these estimates?', a:'This tool uses published average emission factors from peer-reviewed sources. Actual emissions vary based on your grid mix, the specific car you drive, and where your food is sourced. Treat the figures as indicative rather than precise — they\'re accurate enough to identify your largest emission sources and guide decisions.'},
                        {q:'Do carbon offsets actually work?', a:'High-quality verified offsets (e.g. REDD+ forestry, direct air capture) can genuinely remove CO₂. However, offsetting should be a last resort — not a substitute for reducing emissions at source. "Avoid first, reduce second, offset the rest" is the recommended hierarchy.'},
                        {q:'What is the difference between CO₂ and CO₂e?', a:'CO₂ (carbon dioxide) is the primary greenhouse gas from burning fossil fuels. CO₂e (carbon dioxide equivalent) also accounts for other greenhouse gases like methane (from livestock and landfills) and nitrous oxide (from agriculture), each weighted by their warming potential relative to CO₂. Methane is ~80× more potent than CO₂ over 20 years.'},
                      ].map(({q,a},i)=>(
                        <div key={i} style={{padding:'10px 12px',marginBottom:8,
                          background:dark?'rgba(0,0,0,.4)':'rgba(22,101,52,.04)',
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          borderRadius:dark?3:8}}>
                          <div style={{fontSize:12.5,fontWeight:700,fontFamily:"'DM Mono',monospace",color:'var(--txt)',marginBottom:4}}>{q}</div>
                          <div style={{fontSize:12.5,color:'var(--txt2)',lineHeight:1.72}}>{a}</div>
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