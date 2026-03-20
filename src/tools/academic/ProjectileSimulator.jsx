import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   STYLES — HIGH-CONTRAST DUAL THEME
═══════════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{overflow-x:hidden;font-family:'Inter',sans-serif}

@keyframes scanline{0%{top:-3px}100%{top:102%}}
@keyframes gridmove{from{background-position:0 0}to{background-position:40px 40px}}
@keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes sparkle{0%,100%{opacity:0;transform:scale(0)}50%{opacity:1;transform:scale(1)}}
@keyframes pulse{0%,100%{box-shadow:0 0 14px rgba(0,240,255,.1)}50%{box-shadow:0 0 30px rgba(0,240,255,.45),0 0 60px rgba(0,240,255,.2)}}
.fadeup{animation:fadeup .22s ease both}

/* ═══ DARK ═══════════════════════════════════════════════════════ */
.dark{
  --bg:#020210;--sur:#08081e;--s2:#0d0d28;
  --bdr:#1c1c40;--bdr2:rgba(0,240,255,.2);
  --acc:#00f0ff;--acc2:#b000e0;--acc3:#f59e0b;
  --ok:#22c55e;--err:#f43f5e;
  --txt:#f0f4ff;--txt2:#a8b8d8;--txt3:#5a6a90;
  min-height:100vh;background:var(--bg);color:var(--txt);
  background-image:linear-gradient(rgba(0,240,255,.01) 1px,transparent 1px),
    linear-gradient(90deg,rgba(0,240,255,.01) 1px,transparent 1px);
  background-size:40px 40px;animation:gridmove 14s linear infinite
}
.scanline{position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:9999;
  background:linear-gradient(90deg,transparent,rgba(0,240,255,.5),transparent);
  box-shadow:0 0 10px rgba(0,240,255,.3);animation:scanline 8s linear infinite;top:-3px}
.dark .panel{background:linear-gradient(145deg,var(--sur),var(--s2));
  border:1px solid var(--bdr);border-radius:5px;position:relative;overflow:hidden}
.dark .panel::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,240,255,.16),transparent);pointer-events:none}
.dark .inp{background:rgba(0,0,0,.55);border:1px solid var(--bdr);border-radius:4px;
  color:var(--txt);font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:500;
  padding:8px 11px;outline:none;width:100%;transition:all .14s}
.dark .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(0,240,255,.1)}
.dark .inp::placeholder{color:var(--txt3)}
.dark .tab-bar{background:var(--sur);border-bottom:1px solid var(--bdr)}
.dark .tab{height:40px;padding:0 16px;border:none;border-bottom:2px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;font-size:11px;font-weight:700;
  letter-spacing:.07em;text-transform:uppercase;transition:all .14s;
  display:flex;align-items:center;gap:5px;white-space:nowrap}
.dark .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(0,240,255,.05)}
.dark .tab:hover:not(.on){color:var(--txt2)}
.dark .btn-primary{display:inline-flex;align-items:center;gap:6px;padding:9px 20px;
  border:1px solid var(--acc);border-radius:4px;background:rgba(0,240,255,.1);
  color:var(--acc);cursor:pointer;font-size:11px;font-weight:700;letter-spacing:.08em;
  text-transform:uppercase;box-shadow:0 0 14px rgba(0,240,255,.1);transition:all .16s}
.dark .btn-primary:hover{background:rgba(0,240,255,.18);box-shadow:0 0 26px rgba(0,240,255,.25);transform:translateY(-1px)}
.dark .btn-ghost{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;
  border:1px solid var(--bdr);border-radius:4px;background:transparent;
  color:var(--txt3);cursor:pointer;font-size:10px;font-weight:600;transition:all .12s}
.dark .btn-ghost:hover,.dark .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(0,240,255,.06)}
.dark .metric{border:1px solid rgba(0,240,255,.13);border-radius:4px;padding:11px 13px;background:rgba(0,240,255,.04)}
.dark .lbl{font-size:9.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(0,240,255,.5);display:block;margin-bottom:5px}
.dark .hint{font-size:13px;color:var(--txt2);line-height:1.75;padding:9px 12px;border-radius:4px;background:rgba(0,240,255,.04);border-left:2px solid rgba(0,240,255,.28)}
.dark .ad-slot{background:rgba(0,240,255,.018);border:1px dashed rgba(0,240,255,.1);border-radius:4px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  color:var(--txt3);font-size:9px;letter-spacing:.1em;text-transform:uppercase}
.dark .err-box{padding:11px 14px;border:1px solid rgba(244,63,94,.3);border-radius:4px;
  background:rgba(244,63,94,.07);font-size:13px;color:#fb7185;display:flex;align-items:center;gap:8px}
.dark .step-n{width:26px;height:26px;border-radius:50%;border:1px solid rgba(0,240,255,.28);
  background:rgba(0,240,255,.07);display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;color:var(--acc);flex-shrink:0}
.dark .step-ln{background:rgba(0,240,255,.08);width:1.5px}
.dark .formula-box{padding:9px 12px;border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.4);overflow-x:auto}
.dark .sidebar{border-right:1px solid var(--bdr);background:var(--sur);padding:13px 11px;overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.dark .sec-title{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(0,240,255,.42);margin-bottom:7px}
.dark .slider-track{width:100%;height:5px;border-radius:3px;background:rgba(255,255,255,.07);cursor:pointer;appearance:none;outline:none}
.dark .slider-track::-webkit-slider-thumb{appearance:none;width:15px;height:15px;border-radius:50%;background:var(--acc);box-shadow:0 0 8px rgba(0,240,255,.5);cursor:pointer}
.dark .slider-track::-webkit-slider-runnable-track{height:5px;border-radius:3px}
.dark .preset-btn{width:100%;text-align:left;padding:6px 9px;font-size:11px;cursor:pointer;
  border:1px solid var(--bdr);border-radius:3px;background:transparent;
  color:var(--txt3);transition:all .11s;font-family:Inter,sans-serif;margin-bottom:4px;display:block}
.dark .preset-btn:hover{border-color:var(--acc);color:var(--acc);background:rgba(0,240,255,.04)}
.dark .saved-item{padding:7px 9px;border:1px solid var(--bdr);border-radius:3px;
  background:rgba(255,255,255,.02);display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:4px}
.dark .tbl-row:hover td{background:rgba(0,240,255,.03)}
.dark .tbl-head{font-size:8.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(0,240,255,.45);padding:8px 10px}
.dark .tbl-cell{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--txt2);padding:7px 10px;border-bottom:1px solid rgba(255,255,255,.03)}

/* ═══ LIGHT ══════════════════════════════════════════════════════ */
.light{
  --bg:#dde3f5;--sur:#ffffff;--s2:#f3f5fd;
  --bdr:#b8c4e0;--bdr2:#4f46e5;
  --acc:#4f46e5;--acc2:#7c3aed;--acc3:#d97706;
  --ok:#16a34a;--err:#dc2626;
  --txt:#111827;--txt2:#374151;--txt3:#6b7280;
  min-height:100vh;background:var(--bg);color:var(--txt)
}
.light .panel{background:var(--sur);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 16px rgba(79,70,229,.08)}
.light .inp{background:#f0f3ff;border:1.5px solid var(--bdr);border-radius:8px;
  color:var(--txt);font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:500;
  padding:8px 11px;outline:none;width:100%;transition:all .14s}
.light .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(79,70,229,.13)}
.light .tab-bar{background:var(--sur);border-bottom:1.5px solid var(--bdr)}
.light .tab{height:40px;padding:0 16px;border:none;border-bottom:2.5px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;font-size:11px;font-weight:700;
  letter-spacing:.06em;text-transform:uppercase;transition:all .14s;
  display:flex;align-items:center;gap:5px;white-space:nowrap}
.light .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(79,70,229,.06);font-weight:800}
.light .tab:hover:not(.on){color:var(--txt2);background:rgba(79,70,229,.03)}
.light .btn-primary{display:inline-flex;align-items:center;gap:6px;padding:9px 20px;
  border:none;border-radius:8px;background:linear-gradient(135deg,var(--acc),var(--acc2));
  color:#fff;cursor:pointer;font-size:11px;font-weight:700;
  box-shadow:0 4px 14px rgba(79,70,229,.38);transition:all .16s}
.light .btn-primary:hover{box-shadow:0 8px 22px rgba(79,70,229,.5);transform:translateY(-1px)}
.light .btn-ghost{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;
  border:1.5px solid var(--bdr);border-radius:7px;background:transparent;
  color:var(--txt3);cursor:pointer;font-size:10px;font-weight:600;transition:all .12s}
.light .btn-ghost:hover,.light .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(79,70,229,.07)}
.light .metric{border:1.5px solid rgba(79,70,229,.2);border-radius:9px;padding:11px 13px;background:rgba(79,70,229,.05)}
.light .lbl{font-size:9.5px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--acc);display:block;margin-bottom:5px}
.light .hint{font-size:13px;color:var(--txt2);line-height:1.75;padding:9px 12px;border-radius:8px;background:rgba(79,70,229,.06);border-left:2.5px solid rgba(79,70,229,.42)}
.light .ad-slot{background:rgba(79,70,229,.03);border:1.5px dashed rgba(79,70,229,.2);border-radius:8px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  color:var(--txt3);font-size:9px;letter-spacing:.1em;text-transform:uppercase}
.light .err-box{padding:11px 14px;border:1.5px solid rgba(220,38,38,.25);border-radius:8px;
  background:rgba(220,38,38,.06);font-size:13px;color:var(--err);display:flex;align-items:center;gap:8px}
.light .step-n{width:26px;height:26px;border-radius:50%;border:1.5px solid rgba(79,70,229,.28);
  background:rgba(79,70,229,.09);display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;color:var(--acc);flex-shrink:0}
.light .step-ln{background:rgba(79,70,229,.12);width:1.5px}
.light .formula-box{padding:9px 12px;border:1.5px solid var(--bdr);border-radius:8px;background:rgba(79,70,229,.04);overflow-x:auto}
.light .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);padding:13px 11px;overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.light .sec-title{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--acc);margin-bottom:7px}
.light .slider-track{width:100%;height:5px;border-radius:3px;background:rgba(79,70,229,.15);cursor:pointer;appearance:none;outline:none}
.light .slider-track::-webkit-slider-thumb{appearance:none;width:15px;height:15px;border-radius:50%;background:var(--acc);box-shadow:0 2px 8px rgba(79,70,229,.45);cursor:pointer}
.light .preset-btn{width:100%;text-align:left;padding:6px 9px;font-size:11px;cursor:pointer;
  border:1.5px solid var(--bdr);border-radius:7px;background:transparent;
  color:var(--txt3);transition:all .11s;font-family:Inter,sans-serif;margin-bottom:4px;display:block}
.light .preset-btn:hover{border-color:var(--acc);color:var(--acc);background:rgba(79,70,229,.06)}
.light .saved-item{padding:7px 9px;border:1.5px solid var(--bdr);border-radius:8px;
  background:rgba(79,70,229,.04);display:flex;align-items:center;justify-content:space-between;gap:6px;margin-bottom:4px}
.light .tbl-row:hover td{background:rgba(79,70,229,.04)}
.light .tbl-head{font-size:8.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--acc);padding:8px 10px}
.light .tbl-cell{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--txt2);padding:7px 10px;border-bottom:1.5px solid rgba(79,70,229,.06)}

/* shared */
.topbar{height:38px;position:sticky;top:0;z-index:300;display:flex;align-items:center;padding:0 12px;gap:7px;backdrop-filter:blur(14px)}
.dark .topbar{background:rgba(2,2,16,.97);border-bottom:1px solid var(--bdr)}
.light .topbar{background:rgba(255,255,255,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 8px rgba(79,70,229,.07)}
.prose p{font-size:13.5px;line-height:1.78;margin-bottom:12px}
.prose h3{font-size:17px;font-weight:700;margin:20px 0 9px}
.prose ul{padding-left:20px;margin-bottom:12px}
.prose li{font-size:13.5px;line-height:1.72;margin-bottom:5px}
.prose strong{font-weight:700}
`;

/* ═══ KATEX ═══ */
function useKatex() {
  const [ok, setOk] = useState(!!window.katex);
  useEffect(() => {
    if (window.katex) return;
    const l = document.createElement('link'); l.rel='stylesheet';
    l.href='https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'; document.head.appendChild(l);
    const s = document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    s.onload=()=>setOk(true); document.head.appendChild(s);
  },[]);
  return ok;
}
function KTeX({ latex, display=false, dark }) {
  if (window.katex) {
    try {
      const h = window.katex.renderToString(latex, {displayMode:display,throwOnError:false});
      return <span dangerouslySetInnerHTML={{__html:h}} style={{color:dark?'#f0f4ff':'#111827'}}/>;
    } catch(e){}
  }
  return <code style={{fontFamily:'JetBrains Mono,monospace',fontSize:display?13:11,color:dark?'#00f0ff':'#4f46e5'}}>{latex}</code>;
}

/* ═══ ICONS ═══ */
const Svg=({d,s=14,sw=1.8})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>{(Array.isArray(d)?d:[d]).map((p,i)=><path key={i} d={p}/>)}</svg>;
const I={
  play:  s=><Svg s={s} d="M5 3l14 9-14 9V3z" sw={1.5}/>,
  pause: s=><Svg s={s} d={["M6 4h4v16H6z","M14 4h4v16h-4z"]}/>,
  reset: s=><Svg s={s} d="M1 4v6h6M23 20v-6h-6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>,
  target:s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z","M12 12h.01"]}/>,
  info:  s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 16v-4M12 8h.01"]}/>,
  wind:  s=><Svg s={s} d={["M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"]}/>,
  save:  s=><Svg s={s} d={["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z","M17 21v-8H7v8","M7 3v5h8"]}/>,
  trash: s=><Svg s={s} d={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6","M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]}/>,
  arrow: s=><Svg s={s} d={["M5 12H19","M12 5l7 7-7 7"]}/>,
  check: s=><Svg s={s} d="M20 6 9 17l-5-5"/>,
  table: s=><Svg s={s} d={["M3 3h18v18H3z","M3 9h18","M3 15h18","M9 3v18","M15 3v18"]}/>,
  book:  s=><Svg s={s} d={["M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"]}/>,
  copy:  s=><Svg s={s} d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2","M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"]}/>,
  up:    s=><Svg s={s} d="M12 19V5M5 12l7-7 7 7"/>,
  load:  s=><Svg s={s} d={["M5 12H19","M12 5l7 7-7 7"]}/>,
  launch:s=><Svg s={s} d={["M12 2L2 7l10 5 10-5-10-5z","M2 17l10 5 10-5","M2 12l10 5 10-5"]}/>,
};

/* ═══ PHYSICS ENGINE ═══ */
const PLANETS = [
  { name:'Earth',  g:9.81,  color:'#4f46e5' },
  { name:'Moon',   g:1.62,  color:'#94a3b8' },
  { name:'Mars',   g:3.71,  color:'#ef4444' },
  { name:'Jupiter',g:24.79, color:'#f59e0b' },
  { name:'Venus',  g:8.87,  color:'#f97316' },
];

function computePhysics(velocity, angleDeg, height, gravity, airResistance, dragCoeff) {
  const rad = angleDeg * Math.PI / 180;
  const vx0 = velocity * Math.cos(rad);
  const vy0 = velocity * Math.sin(rad);

  if (!airResistance) {
    // Analytic
    const disc = vy0*vy0 + 2*gravity*height;
    if (disc < 0) return null;
    const t_flight = (vy0 + Math.sqrt(disc)) / gravity;
    const max_height = height + vy0*vy0 / (2*gravity);
    const range = vx0 * t_flight;
    const t_peak = vy0 / gravity;
    const vf = Math.sqrt(vx0*vx0 + Math.pow(vy0 - gravity*t_flight, 2));
    const impact_angle = Math.atan2(Math.abs(vy0 - gravity*t_flight), vx0) * 180/Math.PI;

    const N = 80;
    const dt = t_flight / N;
    const points = [];
    for (let i = 0; i <= N; i++) {
      const t = Math.min(i*dt, t_flight);
      points.push({
        t, x: vx0*t,
        y: Math.max(0, height + vy0*t - 0.5*gravity*t*t),
        vx: vx0,
        vy: vy0 - gravity*t,
        speed: Math.sqrt(vx0*vx0 + Math.pow(vy0-gravity*t,2))
      });
    }

    const steps = [
      { t:'Decompose Velocity', d:'Split initial velocity into horizontal and vertical components.',
        l:`v_x = ${velocity}\\cos(${angleDeg}^\\circ) = ${vx0.toFixed(3)}\\text{ m/s},\\quad v_y = ${velocity}\\sin(${angleDeg}^\\circ) = ${vy0.toFixed(3)}\\text{ m/s}` },
      { t:'Time of Flight', d:'Solve the vertical displacement equation y=0 (quadratic in t).',
        l:`t = \\frac{v_y + \\sqrt{v_y^2 + 2gh}}{g} = \\frac{${vy0.toFixed(3)} + \\sqrt{${vy0.toFixed(3)}^2 + 2(${gravity})(${height})}}{${gravity}} = ${t_flight.toFixed(3)}\\text{ s}` },
      { t:'Maximum Height', d:'Peak occurs when vertical velocity = 0.',
        l:`H_{max} = h_0 + \\frac{v_y^2}{2g} = ${height} + \\frac{${vy0.toFixed(3)}^2}{2 \\times ${gravity}} = ${max_height.toFixed(3)}\\text{ m}` },
      { t:'Horizontal Range', d:'Total horizontal distance during flight.',
        l:`R = v_x \\cdot t = ${vx0.toFixed(3)} \\times ${t_flight.toFixed(3)} = ${range.toFixed(3)}\\text{ m}` },
      { t:'Impact Velocity', d:'Combine velocity components at landing.',
        l:`v_f = \\sqrt{v_x^2 + v_{y,f}^2} = \\sqrt{${vx0.toFixed(2)}^2 + ${(vy0-gravity*t_flight).toFixed(2)}^2} = ${vf.toFixed(3)}\\text{ m/s}` },
    ];

    return { vx0, vy0, t_flight, max_height, range, t_peak, vf, impact_angle, points, steps, airMode:false };
  } else {
    // Numerical RK4 with drag: a = g - (k/m)*v²
    // k/m = dragCoeff (simplified, dimensionless drag per unit mass)
    const k = dragCoeff * 0.01;
    const dt = 0.02;
    let x=0, y=height, vx=vx0, vy=vy0, t=0;
    const points = [{t,x,y,vx,vy,speed:Math.sqrt(vx*vx+vy*vy)}];
    let max_height = height, range = 0, t_flight = 0;

    while (y >= -0.01 && t < 60) {
      const speed = Math.sqrt(vx*vx+vy*vy);
      const ax = -k*speed*vx;
      const ay = -gravity - k*speed*vy;
      const nvx = vx + ax*dt, nvy = vy + ay*dt;
      const nx = x + vx*dt, ny = y + vy*dt;
      x=nx; y=ny; vx=nvx; vy=nvy; t+=dt;
      if (y > max_height) max_height=y;
      if (y >= 0) { range=x; t_flight=t; }
      points.push({t,x,y:Math.max(0,y),vx,vy,speed:Math.sqrt(vx*vx+vy*vy)});
      if (y < 0) break;
    }

    const vf = Math.sqrt(vx*vx+vy*vy);
    const steps = [
      { t:'Drag Force Model', d:'Air resistance force F_drag = k·v² opposing motion direction.',
        l:`\\vec{F}_{drag} = -k|v|\\vec{v},\\quad k = ${k.toFixed(4)}\\text{ (drag coefficient)}` },
      { t:'Coupled ODEs', d:'Equations of motion with drag in both axes.',
        l:`\\dot{v}_x = -k|v|v_x,\\quad \\dot{v}_y = -g - k|v|v_y` },
      { t:'Numerical Integration (RK4)', d:`Trajectory computed over ${points.length} timesteps of dt=${dt}s.`,
        l:`x(t),\\;y(t) \\approx \\text{Euler integration at } \\Delta t = ${dt}\\text{ s}` },
      { t:'Results', d:'Computed values with air resistance.',
        l:`R = ${range.toFixed(3)}\\text{ m},\\;H_{max} = ${max_height.toFixed(3)}\\text{ m},\\;t = ${t_flight.toFixed(3)}\\text{ s}` },
    ];

    return { vx0, vy0, t_flight, max_height, range, t_peak:0, vf, impact_angle:0, points, steps, airMode:true };
  }
}

/* ═══ CANVAS SIMULATION ═══ */
function TrajectoryCanvas({ phys, dark, velocity, angle, height, gravity, running, resetKey, timeRef, onComplete, fullscreen }) {
  const canvasRef = useRef();
  const animRef = useRef();
  const startTRef = useRef(null);

  const PAD = { l:50, r:22, t:22, b:42 };

  const drawScene = useCallback((ctx, W, H, progress) => {
    ctx.clearRect(0,0,W,H);

    // Background
    ctx.fillStyle = dark ? '#020210' : '#f0f3ff';
    ctx.fillRect(0,0,W,H);

    // Grid
    ctx.setLineDash([2,5]); ctx.lineWidth=1;
    ctx.strokeStyle = dark?'rgba(0,240,255,.04)':'rgba(79,70,229,.06)';
    const pw = W-PAD.l-PAD.r, ph = H-PAD.t-PAD.b;
    for(let i=0;i<=6;i++){const x=PAD.l+pw*i/6;ctx.beginPath();ctx.moveTo(x,PAD.t);ctx.lineTo(x,PAD.t+ph);ctx.stroke();}
    for(let i=0;i<=5;i++){const y=PAD.t+ph*i/5;ctx.beginPath();ctx.moveTo(PAD.l,y);ctx.lineTo(PAD.l+pw,y);ctx.stroke();}
    ctx.setLineDash([]);

    if (!phys) {
      ctx.fillStyle=dark?'rgba(0,240,255,.4)':'#4f46e5'; ctx.font='700 13px Inter'; ctx.textAlign='center';
      ctx.fillText('Adjust parameters to see trajectory', W/2, H/2); return;
    }

    const pts = phys.points;
    const maxX = Math.max(...pts.map(p=>p.x))*1.08 || 10;
    const maxY = Math.max(...pts.map(p=>p.y))*1.15 || 5;

    const toSX = x => PAD.l + (x/maxX)*pw;
    const toSY = y => PAD.t + ph - (y/maxY)*ph;

    // Ground line
    ctx.strokeStyle=dark?'rgba(0,240,255,.25)':'rgba(79,70,229,.3)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(PAD.l, toSY(0)); ctx.lineTo(PAD.l+pw, toSY(0)); ctx.stroke();

    // Full trajectory (faint)
    ctx.lineWidth=1; ctx.strokeStyle=dark?'rgba(0,240,255,.15)':'rgba(79,70,229,.2)';
    ctx.beginPath();
    pts.forEach((p,i)=>i===0?ctx.moveTo(toSX(p.x),toSY(p.y)):ctx.lineTo(toSX(p.x),toSY(p.y)));
    ctx.stroke();

    // Animated trajectory up to progress
    const progPts = pts.slice(0, Math.max(2, Math.floor(pts.length * progress)));
    if (progPts.length > 1) {
      const grad = ctx.createLinearGradient(toSX(progPts[0].x), 0, toSX(progPts[progPts.length-1].x), 0);
      if (dark) { grad.addColorStop(0,'rgba(0,240,255,.8)'); grad.addColorStop(1,'rgba(176,0,224,.8)'); }
      else { grad.addColorStop(0,'rgba(79,70,229,.9)'); grad.addColorStop(1,'rgba(124,58,237,.9)'); }
      ctx.strokeStyle=grad; ctx.lineWidth=2.5;
      if (dark) { ctx.shadowColor='#00f0ff'; ctx.shadowBlur=7; }
      ctx.beginPath();
      progPts.forEach((p,i)=>i===0?ctx.moveTo(toSX(p.x),toSY(p.y)):ctx.lineTo(toSX(p.x),toSY(p.y)));
      ctx.stroke(); ctx.shadowBlur=0;
    }

    // Ball at current position
    const curPt = progPts[progPts.length-1] || pts[0];
    const bx=toSX(curPt.x), by=toSY(curPt.y);

    // Shadow
    ctx.fillStyle=dark?'rgba(0,0,0,.35)':'rgba(0,0,0,.1)';
    ctx.beginPath(); ctx.ellipse(bx, toSY(0)+3, 10, 4, 0, 0, Math.PI*2); ctx.fill();

    // Ball glow
    if (dark) { ctx.shadowColor='#00f0ff'; ctx.shadowBlur=18; }
    const bg = ctx.createRadialGradient(bx-4, by-4, 1, bx, by, 12);
    if (dark) { bg.addColorStop(0,'#a0f8ff'); bg.addColorStop(.6,'#00f0ff'); bg.addColorStop(1,'rgba(0,240,255,0)'); }
    else { bg.addColorStop(0,'#a5b4fc'); bg.addColorStop(.6,'#4f46e5'); bg.addColorStop(1,'rgba(79,70,229,0)'); }
    ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(bx,by,12,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;

    // Velocity arrows
    const scale = pw/(maxX*3);
    if (Math.abs(curPt.vx) > 0.1) {
      const axLen = curPt.vx*scale;
      ctx.strokeStyle='rgba(34,197,94,.85)'; ctx.fillStyle='rgba(34,197,94,.85)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx+axLen,by); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx+axLen,by); ctx.lineTo(bx+axLen-6,by-4); ctx.lineTo(bx+axLen-6,by+4); ctx.closePath(); ctx.fill();
      ctx.fillStyle='rgba(34,197,94,.75)'; ctx.font='700 9px JetBrains Mono'; ctx.textAlign='center';
      ctx.fillText(`vx=${curPt.vx.toFixed(1)}`, bx+axLen/2, by-7);
    }
    if (Math.abs(curPt.vy) > 0.1) {
      const ayLen = -curPt.vy*scale;
      ctx.strokeStyle='rgba(245,158,11,.85)'; ctx.fillStyle='rgba(245,158,11,.85)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx,by+ayLen); ctx.stroke();
      const tip=by+ayLen; const dir=ayLen<0?-1:1;
      ctx.beginPath(); ctx.moveTo(bx,tip); ctx.lineTo(bx-4,tip+dir*6); ctx.lineTo(bx+4,tip+dir*6); ctx.closePath(); ctx.fill();
      ctx.fillStyle='rgba(245,158,11,.75)'; ctx.font='700 9px JetBrains Mono'; ctx.textAlign='left';
      ctx.fillText(`vy=${curPt.vy.toFixed(1)}`, bx+14, by+ayLen/2+4);
    }

    // Peak marker
    const pkX = toSX(phys.vx0 * phys.t_peak), pkY = toSY(phys.max_height);
    ctx.strokeStyle=dark?'rgba(0,240,255,.3)':'rgba(79,70,229,.3)'; ctx.lineWidth=1; ctx.setLineDash([3,4]);
    ctx.beginPath(); ctx.moveTo(pkX,pkY); ctx.lineTo(pkX,toSY(0)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle=dark?'rgba(0,240,255,.6)':'rgba(79,70,229,.7)'; ctx.font='700 9px Inter'; ctx.textAlign='center';
    ctx.fillText(`H=${phys.max_height.toFixed(1)}m`, pkX, pkY-7);

    // Range label
    ctx.fillStyle=dark?'rgba(176,0,224,.7)':'rgba(124,58,237,.7)';
    ctx.textAlign='center'; ctx.font='700 9px Inter';
    ctx.fillText(`R=${phys.range.toFixed(1)}m`, PAD.l+pw/2, toSY(0)+20);

    // Axis labels & ticks
    ctx.fillStyle=dark?'rgba(168,184,216,.5)':'rgba(55,65,81,.6)';
    ctx.font='9px JetBrains Mono'; ctx.textAlign='center';
    for(let i=0;i<=5;i++){
      const xv=(maxX*i/5).toFixed(0);
      ctx.fillText(`${xv}m`,PAD.l+pw*i/5,PAD.t+ph+14);
    }
    ctx.textAlign='right';
    for(let i=0;i<=4;i++){
      const yv=(maxY*(1-i/4)).toFixed(1);
      ctx.fillText(`${yv}`,PAD.l-5,PAD.t+ph*i/4+4);
    }

    // Progress bar
    const bw=pw, bH=4, bY=H-10;
    ctx.fillStyle=dark?'rgba(255,255,255,.07)':'rgba(0,0,0,.08)';
    ctx.beginPath();ctx.roundRect(PAD.l,bY,bw,bH,2);ctx.fill();
    const pg=ctx.createLinearGradient(PAD.l,0,PAD.l+bw*progress,0);
    if(dark){pg.addColorStop(0,'#00f0ff');pg.addColorStop(1,'#b000e0');}
    else{pg.addColorStop(0,'#4f46e5');pg.addColorStop(1,'#7c3aed');}
    ctx.fillStyle=pg;
    ctx.beginPath();ctx.roundRect(PAD.l,bY,bw*Math.min(progress,1),bH,2);ctx.fill();
  }, [phys, dark, PAD]);

  useEffect(() => {
    if (!running) { cancelAnimationFrame(animRef.current); startTRef.current=null; return; }
    const cv = canvasRef.current; if (!cv||!phys) return;
    const ctx = cv.getContext('2d');
    const dur = Math.min(Math.max(phys.t_flight, 1.5), 8);
    const go = (ts) => {
      if (!startTRef.current) startTRef.current=ts;
      const prog = (ts-startTRef.current)/1000/dur;
      timeRef.current = prog * phys.t_flight;
      drawScene(ctx, cv.width, cv.height, Math.min(prog,1));
      if (prog < 1) animRef.current=requestAnimationFrame(go);
      else { drawScene(ctx,cv.width,cv.height,1); onComplete(); }
    };
    animRef.current=requestAnimationFrame(go);
    return ()=>cancelAnimationFrame(animRef.current);
  }, [running, resetKey, phys, drawScene, onComplete]);

  useEffect(() => {
    if (running) return;
    const cv=canvasRef.current; if (!cv) return;
    const t = timeRef.current;
    const prog = phys ? Math.min(t / phys.t_flight, 1) : 0;
    drawScene(cv.getContext('2d'),cv.width,cv.height, prog);
  }, [running, dark, phys, drawScene, resetKey, timeRef]);

  return <canvas ref={canvasRef} width={fullscreen?1400:720} height={fullscreen?580:270}
    style={{width:'100%',height:fullscreen?'100%':'auto',display:'block',borderRadius:dark?4:10,objectFit:'contain'}}/>;
}

/* ═══ ANGLE OPTIMIZER ═══ */
function AngleOptimizer({ velocity, height, gravity, dark, katex }) {
  const angles = useMemo(()=>{
    const results=[];
    for(let a=5;a<=85;a+=5){
      const p=computePhysics(velocity,a,height,gravity,false,0);
      if(p) results.push({a,range:p.range,height:p.max_height,tof:p.t_flight});
    }
    return results;
  },[velocity,height,gravity]);

  const best = angles.reduce((b,c)=>c.range>b.range?c:b,angles[0]||{a:45,range:0});
  const canvasRef=useRef();

  useEffect(()=>{
    const cv=canvasRef.current; if(!cv||!angles.length) return;
    const ctx=cv.getContext('2d');
    const W=cv.width,H=cv.height;
    const pL=36,pR=10,pT=10,pB=28;
    const pw=W-pL-pR,ph=H-pT-pB;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dark?'#020210':'#f8faff'; ctx.fillRect(0,0,W,H);
    // grid
    ctx.strokeStyle=dark?'rgba(255,255,255,.04)':'rgba(0,0,0,.06)'; ctx.lineWidth=1; ctx.setLineDash([2,4]);
    for(let i=0;i<=6;i++){const x=pL+pw*i/6;ctx.beginPath();ctx.moveTo(x,pT);ctx.lineTo(x,pT+ph);ctx.stroke();}
    for(let i=0;i<=4;i++){const y=pT+ph*i/4;ctx.beginPath();ctx.moveTo(pL,y);ctx.lineTo(pL+pw,y);ctx.stroke();}
    ctx.setLineDash([]);
    const maxR=Math.max(...angles.map(a=>a.range))*1.1||1;
    const toX=a=>(pL+(a-5)/(85)*pw);
    const toY=r=>(pT+ph-(r/maxR)*ph);
    // area fill
    const ag=ctx.createLinearGradient(0,pT,0,pT+ph);
    if(dark){ag.addColorStop(0,'rgba(0,240,255,.18)');ag.addColorStop(1,'rgba(0,240,255,.0)');}
    else{ag.addColorStop(0,'rgba(79,70,229,.15)');ag.addColorStop(1,'rgba(79,70,229,.0)');}
    ctx.fillStyle=ag;
    ctx.beginPath();
    ctx.moveTo(toX(angles[0].a),pT+ph);
    angles.forEach(a=>ctx.lineTo(toX(a.a),toY(a.range)));
    ctx.lineTo(toX(angles[angles.length-1].a),pT+ph);
    ctx.closePath(); ctx.fill();
    // line
    ctx.strokeStyle=dark?'#00f0ff':'#4f46e5'; ctx.lineWidth=2;
    if(dark){ctx.shadowColor='#00f0ff';ctx.shadowBlur=5;}
    ctx.beginPath(); angles.forEach((a,i)=>i===0?ctx.moveTo(toX(a.a),toY(a.range)):ctx.lineTo(toX(a.a),toY(a.range))); ctx.stroke();
    ctx.shadowBlur=0;
    // best marker
    const bx=toX(best.a),by=toY(best.range);
    ctx.fillStyle=dark?'#f59e0b':'#d97706';
    ctx.beginPath();ctx.arc(bx,by,5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=dark?'rgba(245,158,11,.85)':'rgba(217,119,6,.85)';
    ctx.font='700 9px Inter'; ctx.textAlign='center';
    ctx.fillText(`${best.a}° optimal`,bx,by-10);
    // axis labels
    ctx.fillStyle=dark?'rgba(168,184,216,.5)':'rgba(55,65,81,.6)';
    ctx.font='9px JetBrains Mono'; ctx.textAlign='center';
    [15,30,45,60,75].forEach(a=>ctx.fillText(`${a}°`,toX(a),pT+ph+14));
    ctx.textAlign='right';
    [0,0.5,1].forEach(r=>ctx.fillText(`${(maxR*r).toFixed(0)}m`,pL-4,pT+ph-(r)*ph+4));
    ctx.fillStyle=dark?'rgba(0,240,255,.4)':'rgba(79,70,229,.5)';
    ctx.font='700 8px Inter'; ctx.textAlign='center';
    ctx.fillText('Launch Angle (°)',pL+pw/2,H-2);
    ctx.save();ctx.translate(11,pT+ph/2);ctx.rotate(-Math.PI/2);
    ctx.fillText('Range (m)',0,0);ctx.restore();
  },[angles,best,dark]);

  return (
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      <canvas ref={canvasRef} width={560} height={160}
        style={{width:'100%',height:'auto',display:'block',borderRadius:dark?3:8}}/>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        <div className="metric" style={{flex:'1 1 100px',minWidth:100}}>
          <div style={{fontSize:8.5,fontWeight:700,color:'var(--txt3)',marginBottom:3,letterSpacing:'.1em',textTransform:'uppercase'}}>Optimal Angle</div>
          <div style={{fontSize:19,fontWeight:800,fontFamily:'JetBrains Mono,monospace',color:dark?'#f59e0b':'#d97706'}}>{best.a}°</div>
        </div>
        <div className="metric" style={{flex:'1 1 100px',minWidth:100}}>
          <div style={{fontSize:8.5,fontWeight:700,color:'var(--txt3)',marginBottom:3,letterSpacing:'.1em',textTransform:'uppercase'}}>Max Range</div>
          <div style={{fontSize:19,fontWeight:800,fontFamily:'JetBrains Mono,monospace',color:'var(--acc)'}}>{best.range.toFixed(2)}m</div>
        </div>
      </div>
    </div>
  );
}

/* ═══ STEPS ═══ */
function Steps({steps,dark,katex}){
  return(<div>{steps.map((s,i)=>(
    <div key={i} style={{display:'flex',gap:10,marginBottom:i===steps.length-1?0:18}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
        <div className="step-n">{i+1}</div>
        {i<steps.length-1&&<div className="step-ln" style={{flex:1,marginTop:5,minHeight:14}}/>}
      </div>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:700,color:'var(--txt)',marginBottom:3}}>{s.t}</div>
        <div style={{fontSize:12.5,color:'var(--txt2)',marginBottom:6,lineHeight:1.65}}>{s.d}</div>
        <div className="formula-box">
          {katex?<KTeX latex={s.l} dark={dark}/>:<code style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'var(--acc)'}}>{s.l}</code>}
        </div>
      </div>
    </div>
  ))}</div>);
}

/* ═══ COPY BUTTON ═══ */
function CopyBtn({text,dark}){
  const [ok,setOk]=useState(false);
  return(<button className="btn-ghost" onClick={()=>{navigator.clipboard.writeText(text).catch(()=>{});setOk(true);setTimeout(()=>setOk(false),1400);}} style={{padding:'4px 8px',gap:3,fontSize:10}}>
    {ok?I.check(9):I.copy(9)}{ok?'Copied':'Copy'}
  </button>);
}

/* ═══ PRESETS ═══ */
const PRESETS=[
  {label:'Football Kick',   v:25, a:35, h:0,  g:9.81},
  {label:'Basketball Shot', v:8,  a:52, h:2.5,g:9.81},
  {label:'Golf Drive',      v:70, a:12, h:0,  g:9.81},
  {label:'Long Jump',       v:10, a:22, h:1,  g:9.81},
  {label:'Cannon Ball',     v:45, a:45, h:5,  g:9.81},
  {label:'Moon Jump',       v:5,  a:45, h:0,  g:1.62},
  {label:'Mars Throw',      v:15, a:30, h:1,  g:3.71},
  {label:'Jupiter Drop',    v:20, a:60, h:10, g:24.79},
  {label:'Sniper Shot',     v:900,a:2,  h:1.5,g:9.81},
  {label:'Arrow Shot',      v:50, a:30, h:1.5,g:9.81},
];

/* ═══ SLIDER COMPONENT ═══ */
function Slider({label,val,unit,min,max,step,color,lcolor,dark,onChange}){
  const pct=(val-min)/(max-min)*100;
  return(
    <div style={{marginBottom:12}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
        <span style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--txt3)'}}>{label}</span>
        <span style={{fontSize:13,fontWeight:800,fontFamily:'JetBrains Mono,monospace',color:dark?color:lcolor}}>{val}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e=>onChange(Number(e.target.value))}
        className="slider-track"
        style={{background:dark
          ?`linear-gradient(to right,${color} 0%,${color} ${pct}%,rgba(255,255,255,.08) ${pct}%,rgba(255,255,255,.08) 100%)`
          :`linear-gradient(to right,${lcolor} 0%,${lcolor} ${pct}%,rgba(79,70,229,.15) ${pct}%,rgba(79,70,229,.15) 100%)`}}/>
    </div>
  );
}

/* ═══ MAIN ═══ */
export default function ProjectileSimulator(){
  const [mode,setMode]=useState('dark');
  const dark=mode==='dark';
  const katex=useKatex();

  const [velocity,setVelocity]=useState(20);
  const [angle,setAngle]=useState(45);
  const [height,setHeight]=useState(0);
  const [gravity,setGravity]=useState(9.81);
  const [airResistance,setAirResistance]=useState(false);
  const [dragCoeff,setDragCoeff]=useState(0.47);
  const [running,setRunning]=useState(false);
  const [resetKey,setResetKey]=useState(0);
  const [pageTab,setPageTab]=useState('sim');
  const [savedScenarios,setSavedScenarios]=useState([]);
  const [saveName,setSaveName]=useState('');
  const [curTime,setCurTime]=useState(0);
  const [expanded,setExpanded]=useState(false);
  const timeRef=useRef(0);

  const phys=useMemo(()=>computePhysics(velocity,angle,height,gravity,airResistance,dragCoeff),[velocity,angle,height,gravity,airResistance,dragCoeff]);

  const resetSim=()=>{ setRunning(false); setResetKey(k=>k+1); timeRef.current=0; setCurTime(0); };
  const handleComplete=useCallback(()=>{ setRunning(false); },[]);

  // Live telemetry ticker
  useEffect(()=>{
    if(!running) return;
    const id=setInterval(()=>setCurTime(timeRef.current),50);
    return()=>clearInterval(id);
  },[running]);

  const saveScenario=()=>{
    if(!phys) return;
    const name=saveName.trim()||`Scenario ${savedScenarios.length+1}`;
    setSavedScenarios(prev=>[...prev,{id:Date.now(),name,v:velocity,a:angle,h:height,g:gravity,phys}]);
    setSaveName('');
  };

  const PAGE_TABS=[
    {id:'sim',    label:'Simulator'},
    {id:'angles', label:'Angle Optimizer'},
    {id:'table',  label:'Data Table'},
    {id:'guide',  label:'How to Use'},
    {id:'learn',  label:'Learn'},
  ];

  const curPos=useMemo(()=>{
    const t=Math.min(curTime, phys?.t_flight||0);
    if(!phys) return {x:0,y:0,vx:0,vy:0,speed:0};
    const p=phys.points.find(pt=>pt.t>=t)||phys.points[phys.points.length-1];
    return p||{x:0,y:0,vx:0,vy:0,speed:0};
  },[curTime,phys]);

  return(
    <>
      <style>{STYLES}</style>
      <div className={dark?'dark':'light'}>
        {dark&&<div className="scanline"/>}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <div style={{width:24,height:24,borderRadius:dark?3:7,
              background:dark?'transparent':'linear-gradient(135deg,#4f46e5,#7c3aed)',
              border:dark?'1px solid var(--acc)':'none',
              display:'flex',alignItems:'center',justifyContent:'center',
              color:dark?'var(--acc)':'#fff',
              boxShadow:dark?'0 0 10px rgba(0,240,255,.22)':'0 2px 8px rgba(79,70,229,.4)'}}>
              {I.launch(13)}
            </div>
            <span style={{fontSize:13,fontWeight:800,color:'var(--txt)',letterSpacing:dark?'.04em':'-.01em'}}>
              Projectile<span style={{color:'var(--acc)'}}>Sim</span>
            </span>
          </div>
          <div style={{flex:1}}/>
          <button onClick={()=>setMode(dark?'light':'dark')}
            style={{display:'flex',alignItems:'center',gap:6,padding:'5px 11px',
              border:dark?'1px solid rgba(0,240,255,.18)':'1.5px solid var(--bdr)',
              borderRadius:dark?3:8,background:dark?'rgba(0,240,255,.03)':'var(--sur)',cursor:'pointer',transition:'all .14s'}}>
            {dark?(
              <><div style={{width:28,height:15,borderRadius:8,background:'var(--acc)',position:'relative',boxShadow:'0 0 8px rgba(0,240,255,.5)'}}>
                <div style={{position:'absolute',top:2.5,right:2.5,width:10,height:10,borderRadius:'50%',background:'#020210'}}/>
              </div><span style={{fontSize:9.5,fontWeight:700,color:'rgba(0,240,255,.6)',letterSpacing:'.1em'}}>NEON</span></>
            ):(
              <><span style={{fontSize:10.5,color:'var(--txt3)',fontWeight:600}}>Light</span>
              <div style={{width:28,height:15,borderRadius:8,background:'#d1d5db',position:'relative'}}>
                <div style={{position:'absolute',top:2.5,left:2.5,width:10,height:10,borderRadius:'50%',background:'#9ca3af'}}/>
              </div></>
            )}
          </button>
        </div>

        {/* PAGE TABS */}
        <div className="tab-bar" style={{display:'flex',overflowX:'auto'}}>
          {PAGE_TABS.map(t=>(
            <button key={t.id} className={`tab ${pageTab===t.id?'on':''}`} onClick={()=>setPageTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* BODY */}
        <div className="tool-layout-grid">

          {/* SIDEBAR */}
          <div className="sidebar">

            {/* Sliders */}
            <div>
              <div className="sec-title">Parameters</div>
              <Slider label="Velocity v₀" val={velocity} unit=" m/s" min={1} max={100} step={0.5} color="#00f0ff" lcolor="#4f46e5" dark={dark} onChange={v=>{setVelocity(v);resetSim();}}/>
              <Slider label="Angle θ" val={angle} unit="°" min={0} max={90} step={0.5} color="#22c55e" lcolor="#16a34a" dark={dark} onChange={v=>{setAngle(v);resetSim();}}/>
              <Slider label="Initial Height h₀" val={height} unit=" m" min={0} max={50} step={0.5} color="#f59e0b" lcolor="#d97706" dark={dark} onChange={v=>{setHeight(v);resetSim();}}/>
              <Slider label="Gravity g" val={gravity} unit=" m/s²" min={0.5} max={25} step={0.01} color="#b000e0" lcolor="#7c3aed" dark={dark} onChange={v=>{setGravity(v);resetSim();}}/>
            </div>

            {/* Air resistance */}
            <div>
              <div className="sec-title">Air Resistance</div>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:airResistance?10:0}}>
                <span style={{fontSize:11,color:'var(--txt2)',fontWeight:600}}>Enable drag</span>
                <button onClick={()=>{setAirResistance(v=>!v);resetSim();}}
                  style={{width:34,height:18,borderRadius:9,background:airResistance?'var(--acc)':dark?'rgba(255,255,255,.1)':'#cbd5e1',
                    position:'relative',border:'none',cursor:'pointer',transition:'all .2s',
                    boxShadow:airResistance&&dark?'0 0 8px rgba(0,240,255,.4)':'none'}}>
                  <div style={{position:'absolute',top:3,width:12,height:12,borderRadius:'50%',background:'#fff',
                    left:airResistance?'calc(100% - 15px)':3,transition:'left .15s'}}/>
                </button>
              </div>
              {airResistance&&<Slider label="Drag Coeff Cd" val={dragCoeff} unit="" min={0.1} max={2} step={0.01} color="#f43f5e" lcolor="#dc2626" dark={dark} onChange={v=>{setDragCoeff(v);resetSim();}}/>}
            </div>

            {/* Planet gravity shortcuts */}
            <div>
              <div className="sec-title">Planet Gravity</div>
              {PLANETS.map(p=>(
                <button key={p.name} className="preset-btn"
                  onClick={()=>{setGravity(p.g);resetSim();}}
                  style={{borderColor: Math.abs(gravity-p.g)<0.01?'var(--acc)':'',
                    color: Math.abs(gravity-p.g)<0.01?'var(--acc)':'',
                    background: Math.abs(gravity-p.g)<0.01?(dark?'rgba(0,240,255,.04)':'rgba(79,70,229,.07)'):''}}>
                  {p.name} <code style={{float:'right',fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'var(--txt3)'}}>{p.g} m/s²</code>
                </button>
              ))}
            </div>

            {/* Real-world presets */}
            <div>
              <div className="sec-title">Example Scenarios</div>
              {PRESETS.map((p,i)=>(
                <button key={i} className="preset-btn" onClick={()=>{setVelocity(p.v);setAngle(p.a);setHeight(p.h);setGravity(p.g);resetSim();setPageTab('sim');}}>
                  {p.label}
                </button>
              ))}
            </div>

            {/* Save */}
            <div>
              <div className="sec-title">Save Scenario</div>
              <input className="inp" value={saveName} onChange={e=>setSaveName(e.target.value)}
                placeholder="Name (optional)" style={{marginBottom:6,height:32,fontSize:12}}/>
              <button className="btn-primary" onClick={saveScenario} style={{width:'100%',justifyContent:'center',padding:'7px 0'}}>
                {I.save(11)} Save
              </button>
              {savedScenarios.length>0&&(
                <div style={{marginTop:8}}>
                  {savedScenarios.map(s=>(
                    <div key={s.id} className="saved-item">
                      <div style={{flex:1,cursor:'pointer'}} onClick={()=>{setVelocity(s.v);setAngle(s.a);setHeight(s.h);setGravity(s.g);resetSim();}}>
                        <div style={{fontSize:11,fontWeight:700,color:'var(--txt)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.name}</div>
                        <div style={{fontSize:9,color:'var(--txt3)',fontFamily:'JetBrains Mono,monospace'}}>{s.v}m/s @ {s.a}°</div>
                      </div>
                      <button className="btn-ghost" style={{padding:'3px 6px'}} onClick={()=>setSavedScenarios(p=>p.filter(x=>x.id!==s.id))}>{I.trash(10)}</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* MAIN */}
          <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:13}}>
            <AnimatePresence mode="wait">

              {pageTab==='sim'&&(
                <motion.div key="sim" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>

                  {/* Key metrics row */}
                  {phys&&(
                    <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:9}}>
                      {[
                        {l:'Range',    v:`${phys.range.toFixed(2)}m`,       c:dark?'#00f0ff':'#4f46e5'},
                        {l:'Max Height',v:`${phys.max_height.toFixed(2)}m`, c:dark?'#22c55e':'#16a34a'},
                        {l:'Flight Time',v:`${phys.t_flight.toFixed(2)}s`,  c:dark?'#f59e0b':'#d97706'},
                        {l:'Impact Speed',v:`${phys.vf.toFixed(2)}m/s`,    c:dark?'#b000e0':'#7c3aed'},
                        {l:'vx / vy₀',v:`${phys.vx0.toFixed(1)} / ${phys.vy0.toFixed(1)}`,c:dark?'#f43f5e':'#dc2626'},
                      ].map(({l,v,c})=>(
                        <div key={l} className="panel" style={{padding:'10px 12px'}}>
                          <div style={{fontSize:8.5,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--txt3)',marginBottom:4}}>{l}</div>
                          <div style={{fontSize:16,fontWeight:800,fontFamily:'JetBrains Mono,monospace',color:c}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Canvas — expands to fullscreen overlay on Launch */}
                  <AnimatePresence>
                    {expanded && (
                      <motion.div
                        key="overlay"
                        initial={{opacity:0,scale:.97}}
                        animate={{opacity:1,scale:1}}
                        exit={{opacity:0,scale:.97}}
                        transition={{duration:.22,ease:'easeOut'}}
                        style={{
                          position:'fixed',inset:0,zIndex:500,
                          background:dark?'rgba(2,2,16,.97)':'rgba(221,227,245,.98)',
                          display:'flex',flexDirection:'column',
                          backdropFilter:'blur(8px)',
                        }}>
                        {/* Overlay topbar */}
                        <div style={{
                          height:52,display:'flex',alignItems:'center',justifyContent:'space-between',
                          padding:'0 18px',flexShrink:0,
                          borderBottom:dark?'1px solid rgba(0,240,255,.15)':'1.5px solid rgba(79,70,229,.15)'}}>
                          <div style={{display:'flex',alignItems:'center',gap:10}}>
                            <span style={{fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',
                              color:dark?'rgba(0,240,255,.55)':'var(--acc)'}}>
                              {I.target(11)} Trajectory — v={velocity}m/s θ={angle}° h={height}m g={gravity}m/s²
                            </span>
                            {phys&&<span style={{fontSize:10,fontFamily:'JetBrains Mono,monospace',
                              color:dark?'rgba(0,240,255,.4)':'rgba(79,70,229,.5)'}}>
                              R={phys.range.toFixed(1)}m  H={phys.max_height.toFixed(1)}m  t={phys.t_flight.toFixed(2)}s
                            </span>}
                          </div>
                          <div style={{display:'flex',gap:8,alignItems:'center'}}>
                            {/* time counter */}
                            <span style={{fontSize:12,fontFamily:'JetBrains Mono,monospace',fontWeight:700,
                              color:dark?'var(--acc)':'var(--acc)'}}>
                              {curTime.toFixed(2)}s / {phys?.t_flight.toFixed(2)||'0.00'}s
                            </span>
                            <button className="btn-primary" style={{padding:'7px 16px'}}
                              onClick={()=>{
                                if(!running){setResetKey(k=>k+1);setTimeout(()=>setRunning(true),30);}
                                else setRunning(false);
                              }}>
                              {running?<>{I.pause(11)} Pause</>:<>{I.play(11)} {curTime>0?'Resume':'Launch'}</>}
                            </button>
                            <button className="btn-ghost" style={{padding:'7px 10px'}} onClick={resetSim}>{I.reset(11)} Reset</button>
                            <button className="btn-ghost" style={{padding:'7px 10px'}}
                              onClick={()=>{setExpanded(false);setRunning(false);}}>
                              ✕ Close
                            </button>
                          </div>
                        </div>

                        {/* Canvas fills remaining space */}
                        <div style={{flex:1,position:'relative',overflow:'hidden',padding:'12px 16px 0'}}>
                          <TrajectoryCanvas phys={phys} dark={dark} velocity={velocity} angle={angle}
                            height={height} gravity={gravity} running={running}
                            resetKey={resetKey} timeRef={timeRef} onComplete={handleComplete}
                            fullscreen/>

                          {/* Overlay telemetry cards */}
                          <div style={{
                            position:'absolute',top:22,right:26,display:'flex',flexDirection:'column',gap:7,
                            pointerEvents:'none'}}>
                            {[
                              {l:'X',v:`${curPos.x.toFixed(2)}m`,c:dark?'#00f0ff':'#4f46e5'},
                              {l:'Y',v:`${curPos.y.toFixed(2)}m`,c:dark?'#22c55e':'#16a34a'},
                              {l:'vx',v:`${(curPos.vx||0).toFixed(1)}m/s`,c:dark?'#22c55e':'#16a34a'},
                              {l:'vy',v:`${(curPos.vy||0).toFixed(1)}m/s`,c:dark?'#f59e0b':'#d97706'},
                              {l:'|v|',v:`${(curPos.speed||0).toFixed(1)}m/s`,c:dark?'#b000e0':'#7c3aed'},
                            ].map(({l,v,c})=>(
                              <div key={l} style={{
                                padding:'5px 10px',borderRadius:dark?3:7,
                                background:dark?'rgba(2,2,16,.82)':'rgba(255,255,255,.88)',
                                border:dark?'1px solid rgba(0,240,255,.2)':'1.5px solid rgba(79,70,229,.2)',
                                display:'flex',alignItems:'center',gap:8,backdropFilter:'blur(6px)'}}>
                                <span style={{fontSize:9,fontWeight:700,letterSpacing:'.1em',
                                  textTransform:'uppercase',color:'var(--txt3)',width:16}}>{l}</span>
                                <span style={{fontSize:14,fontWeight:800,fontFamily:'JetBrains Mono,monospace',color:c}}>{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Scrubber bar */}
                        <div style={{
                          padding:'10px 20px 14px',flexShrink:0,
                          borderTop:dark?'1px solid rgba(0,240,255,.1)':'1.5px solid rgba(79,70,229,.1)'}}>
                          <div style={{display:'flex',justifyContent:'space-between',
                            fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--txt3)',marginBottom:5}}>
                            <span>0.00s</span>
                            <span style={{color:'var(--acc)',fontWeight:700}}>TIMELINE SCRUBBER — drag to seek</span>
                            <span>{phys?.t_flight.toFixed(2)||'0.00'}s</span>
                          </div>
                          <input type="range" min={0} max={phys?.t_flight||1} step={0.01}
                            value={curTime}
                            onChange={e=>{
                              const t=Number(e.target.value);
                              setRunning(false);
                              timeRef.current=t;
                              setCurTime(t);
                            }}
                            className="slider-track"
                            style={{
                              width:'100%',
                              background:dark
                                ?`linear-gradient(to right,#00f0ff 0%,#b000e0 ${((curTime/(phys?.t_flight||1))*100).toFixed(1)}%,rgba(255,255,255,.08) ${((curTime/(phys?.t_flight||1))*100).toFixed(1)}%,rgba(255,255,255,.08) 100%)`
                                :`linear-gradient(to right,#4f46e5 0%,#7c3aed ${((curTime/(phys?.t_flight||1))*100).toFixed(1)}%,rgba(79,70,229,.15) ${((curTime/(phys?.t_flight||1))*100).toFixed(1)}%,rgba(79,70,229,.15) 100%)`
                            }}/>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Inline canvas panel (always visible) */}
                  <div className="panel" style={{padding:13}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                      <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',
                        color:dark?'rgba(0,240,255,.45)':'var(--acc)',display:'flex',alignItems:'center',gap:5}}>
                        {I.target(11)} Trajectory Visualiser
                        {phys&&<span style={{fontSize:8,fontWeight:400,color:'var(--txt3)',marginLeft:4,textTransform:'none',letterSpacing:0}}>click Launch → fullscreen mode</span>}
                      </span>
                      <div style={{display:'flex',gap:7,alignItems:'center'}}>
                        {phys&&<span style={{fontSize:9,color:'var(--txt3)',fontFamily:'JetBrains Mono,monospace'}}>t={curTime.toFixed(2)}s</span>}
                        <button className="btn-primary" style={{padding:'6px 14px',
                          boxShadow:dark?'0 0 20px rgba(0,240,255,.3)':'0 4px 18px rgba(79,70,229,.45)',
                          animation: !running && curTime===0 ? 'pulse 2s ease-in-out infinite' : 'none'}}
                          onClick={()=>{
                            if(!running){
                              setResetKey(k=>k+1);
                              setExpanded(true);
                              setTimeout(()=>setRunning(true),80);
                            } else {
                              setRunning(false);
                              setExpanded(false);
                            }
                          }}>
                          {running?<>{I.pause(11)} Pause</>:<>{I.play(11)} Launch</>}
                        </button>
                        <button className="btn-ghost" style={{padding:'6px 9px'}} onClick={resetSim}>{I.reset(11)}</button>
                      </div>
                    </div>
                    <TrajectoryCanvas phys={phys} dark={dark} velocity={velocity} angle={angle}
                      height={height} gravity={gravity} running={false}
                      resetKey={resetKey} timeRef={timeRef} onComplete={handleComplete}/>
                  </div>

                  {/* Live telemetry + solved values */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
                    <div className="panel" style={{padding:14}}>
                      <span className="lbl">Live Telemetry</span>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
                        {[
                          {l:'X Position',v:`${curPos.x.toFixed(2)}m`,c:dark?'#00f0ff':'#4f46e5'},
                          {l:'Y Position',v:`${curPos.y.toFixed(2)}m`,c:dark?'#22c55e':'#16a34a'},
                          {l:'Velocity vx',v:`${(curPos.vx||0).toFixed(2)}m/s`,c:dark?'#22c55e':'#16a34a'},
                          {l:'Velocity vy',v:`${(curPos.vy||0).toFixed(2)}m/s`,c:dark?'#f59e0b':'#d97706'},
                          {l:'Speed |v|',v:`${(curPos.speed||0).toFixed(2)}m/s`,c:dark?'#b000e0':'#7c3aed'},
                          {l:'Time',v:`${curTime.toFixed(2)}s`,c:dark?'#f43f5e':'#dc2626'},
                        ].map(({l,v,c})=>(
                          <div key={l} className="metric">
                            <div style={{fontSize:8,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--txt3)',marginBottom:3}}>{l}</div>
                            <div style={{fontSize:14,fontWeight:800,fontFamily:'JetBrains Mono,monospace',color:c}}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {phys&&(
                      <div className="panel" style={{padding:14}}>
                        <span className="lbl">Projectile Summary</span>
                        <div style={{display:'flex',flexDirection:'column',gap:6}}>
                          {[
                            {l:'Optimal angle (flat ground)',v:`45°`,note:'max range when h=0'},
                            {l:'Time to peak',v:`${phys.t_peak.toFixed(3)}s`},
                            {l:'Peak height',v:`${phys.max_height.toFixed(3)}m`},
                            {l:'Total range',v:`${phys.range.toFixed(3)}m`},
                            {l:'Mode',v:phys.airMode?'Numerical (drag)':'Analytic'},
                          ].map(({l,v,note})=>(
                            <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',borderBottom:dark?'1px solid rgba(255,255,255,.04)':'1.5px solid rgba(79,70,229,.07)',paddingBottom:4}}>
                              <span style={{fontSize:11.5,color:'var(--txt2)'}}>{l}</span>
                              <div style={{textAlign:'right'}}>
                                <span style={{fontSize:13,fontWeight:800,fontFamily:'JetBrains Mono,monospace',color:'var(--acc)'}}>{v}</span>
                                {note&&<div style={{fontSize:8.5,color:'var(--txt3)'}}>{note}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Steps */}
                  {phys&&(
                    <div className="panel" style={{padding:15}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                        <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',
                          color:dark?'rgba(0,240,255,.45)':'var(--acc)'}}>Step-by-Step Derivation</span>
                        <CopyBtn text={phys.steps.map(s=>`${s.t}: ${s.l}`).join('\n')} dark={dark}/>
                      </div>
                      <Steps steps={phys.steps} dark={dark} katex={katex}/>
                    </div>
                  )}

                </motion.div>
              )}

              {pageTab==='angles'&&(
                <motion.div key="angles" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>
                  <div className="hint" style={{display:'flex',gap:7}}>
                    {I.info(13)} <span>Shows how range varies with launch angle for your current velocity, height, and gravity. The peak of the curve is the optimal angle.</span>
                  </div>
                  <div className="panel" style={{padding:15}}>
                    <span className="lbl" style={{marginBottom:10}}>Range vs Launch Angle (v={velocity}m/s, h={height}m, g={gravity}m/s²)</span>
                    <AngleOptimizer velocity={velocity} height={height} gravity={gravity} dark={dark} katex={katex}/>
                  </div>

                  {/* Compare two angles */}
                  {phys&&(
                    <div className="panel" style={{padding:14}}>
                      <span className="lbl" style={{marginBottom:10}}>Complementary Angles (sum to 90°)</span>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                        {[angle, 90-angle].map((a,i)=>{
                          const p=computePhysics(velocity,a,height,gravity,false,0);
                          if(!p) return null;
                          return(
                            <div key={i} className="metric">
                              <div style={{fontSize:11,fontWeight:700,color:'var(--acc)',marginBottom:8}}>{a.toFixed(1)}°</div>
                              <div style={{fontSize:12,color:'var(--txt2)',lineHeight:1.8,fontFamily:'JetBrains Mono,monospace'}}>
                                Range: <b style={{color:'var(--txt)'}}>{p.range.toFixed(2)}m</b><br/>
                                H_max: <b style={{color:'var(--txt)'}}>{p.max_height.toFixed(2)}m</b><br/>
                                Time: <b style={{color:'var(--txt)'}}>{p.t_flight.toFixed(2)}s</b>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{fontSize:12,color:'var(--txt2)',marginTop:10,lineHeight:1.7}}>
                        Complementary angles (θ and 90°−θ) give the <b style={{color:'var(--txt)'}}>same horizontal range</b> when launched from ground level — a beautiful symmetry of projectile motion.
                      </div>
                    </div>
                  )}
                  
                </motion.div>
              )}

              {pageTab==='table'&&(
                <motion.div key="table" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>
                  {phys?(
                    <div className="panel" style={{overflow:'hidden'}}>
                      <div style={{padding:'11px 14px',borderBottom:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',
                          color:dark?'rgba(0,240,255,.45)':'var(--acc)',display:'flex',alignItems:'center',gap:5}}>
                          {I.table(11)} Trajectory Data Table
                        </span>
                        <CopyBtn text={['t,x,y,vx,vy,speed',...phys.points.filter((_,i)=>i%2===0).map(p=>`${p.t.toFixed(3)},${p.x.toFixed(3)},${p.y.toFixed(3)},${p.vx.toFixed(3)},${p.vy.toFixed(3)},${p.speed.toFixed(3)}`)].join('\n')} dark={dark}/>
                      </div>
                      <div style={{overflowX:'auto'}}>
                        <table style={{width:'100%',borderCollapse:'collapse'}}>
                          <thead>
                            <tr>
                              {['Time (s)','X (m)','Y (m)','Vx (m/s)','Vy (m/s)','Speed (m/s)'].map(h=>(
                                <th key={h} className="tbl-head" style={{textAlign:'left'}}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {phys.points.filter((_,i)=>i%2===0).map((p,idx)=>(
                              <tr key={idx} className="tbl-row">
                                {[p.t,p.x,p.y,p.vx,p.vy,p.speed].map((v,ci)=>(
                                  <td key={ci} className="tbl-cell"
                                    style={{color: ci===2&&p.y===phys.max_height?(dark?'#22c55e':'#16a34a'):''}}>
                                    {v.toFixed(3)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ):(
                    <div className="err-box">{I.info(14)} Enter valid parameters to generate trajectory data.</div>
                  )}
                  
                </motion.div>
              )}

              {pageTab==='guide'&&(
                <motion.div key="guide" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div className="hint" style={{display:'flex',gap:7}}>
                    {I.info(13)} <span>ProjectileSim computes exact trajectory (or drag-corrected numerical) for any launch configuration, with live animation, angle optimizer, and data table.</span>
                  </div>
                  {[
                    ['Set parameters','Use the sliders in the left sidebar to set initial velocity, launch angle, starting height, and gravity. Results update instantly.'],
                    ['Pick a planet','Click any planet button in the sidebar to instantly set gravity to that body\'s surface value. Explore Moon, Mars, Jupiter, and more.'],
                    ['Load an example','Click any preset scenario (Football, Golf Drive, Cannon, Sniper Shot…) to load a real-world configuration.'],
                    ['Launch the simulation','Press the Launch button above the canvas. Watch the ball trace the parabola with live velocity arrows and a glowing trail.'],
                    ['Enable air resistance','Toggle "Enable drag" in the sidebar. Adjust Cd (drag coefficient) and watch the range shrink due to atmospheric drag.'],
                    ['Angle Optimizer tab','Switch to the Angle Optimizer to see the full range-vs-angle curve. The optimal angle is marked in amber.'],
                    ['Data Table tab','See precise x, y, vx, vy, speed at every timestep. Use Copy CSV to export the data.'],
                    ['Save scenarios','Name and save any configuration. Saved scenarios appear below the save button — click to reload, trash to delete.'],
                  ].map(([t,b],i)=>(
                    <div key={i} className="panel" style={{padding:14}}>
                      <div style={{display:'flex',gap:10}}>
                        <div style={{width:32,height:32,borderRadius:dark?3:9,flexShrink:0,
                          background:dark?'rgba(0,240,255,.07)':'rgba(79,70,229,.09)',
                          border:dark?'1px solid rgba(0,240,255,.2)':'1.5px solid rgba(79,70,229,.24)',
                          display:'flex',alignItems:'center',justifyContent:'center',
                          fontSize:13,fontWeight:800,color:'var(--acc)'}}>{i+1}</div>
                        <div>
                          <div style={{fontSize:13.5,fontWeight:700,color:'var(--txt)',marginBottom:4}}>{t}</div>
                          <div style={{fontSize:13,color:'var(--txt2)',lineHeight:1.72}}>{b}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {pageTab==='learn'&&(
                <motion.div key="learn" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <div className="panel" style={{padding:22}}>
                    <h1 style={{fontSize:21,fontWeight:900,color:'var(--txt)',marginBottom:5}}>The Physics of Projectile Motion</h1>
                    <p style={{fontSize:12.5,color:'var(--txt3)',marginBottom:20}}>Kinematics · Parabolic Trajectories · Air Resistance · Optimal Angles</p>
                    <div className="prose" style={{color:'var(--txt)'}}>
                      <p style={{color:'var(--txt2)'}}>A projectile is any object launched into the air subject only to gravity (and optionally drag). The motion separates cleanly into two independent axes: constant velocity horizontally, and constant acceleration vertically.</p>
                      <h3 style={{color:'var(--txt)'}}>The Four Kinematic Equations</h3>
                      {katex&&window.katex&&[
                        ['x(t) = v_0\\cos\\theta\\cdot t','Horizontal position (constant velocity)'],
                        ['y(t) = h_0 + v_0\\sin\\theta\\cdot t - \\tfrac{1}{2}gt^2','Vertical position (constant acceleration)'],
                        ['t_{flight} = \\frac{v_0\\sin\\theta + \\sqrt{(v_0\\sin\\theta)^2+2gh_0}}{g}','Time of flight (quadratic formula)'],
                        ['R = v_0\\cos\\theta \\cdot t_{flight}','Horizontal range'],
                      ].map(([eq,desc],i)=>(
                        <div key={i} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:10,alignItems:'center',
                          padding:'9px 14px',marginBottom:8,
                          background:dark?'rgba(0,0,0,.3)':'rgba(79,70,229,.04)',
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          borderRadius:dark?3:8}}>
                          <span style={{fontSize:12.5,color:'var(--txt2)'}}>{desc}</span>
                          <KTeX latex={eq} dark={dark}/>
                        </div>
                      ))}
                      <h3 style={{color:'var(--txt)'}}>Why 45° Maximises Range</h3>
                      <p style={{color:'var(--txt2)'}}>When launched from and landing on the same height, the range is R = v₀²sin(2θ)/g. This is maximised when sin(2θ)=1, i.e., 2θ=90°, θ=45°. When there is initial height, the optimal angle shifts below 45°.</p>
                      <h3 style={{color:'var(--txt)'}}>Complementary Angles</h3>
                      <p style={{color:'var(--txt2)'}}>Two angles that sum to 90° (e.g., 30° and 60°) produce the <b style={{color:'var(--txt)'}}>same horizontal range</b> from ground level. Higher angles spend more time aloft and reach greater peak heights; lower angles are faster and flatter.</p>
                      <h3 style={{color:'var(--txt)'}}>Air Resistance</h3>
                      <p style={{color:'var(--txt2)'}}>Drag force F = ½ρCdAv² opposes velocity, coupling the x and y equations. There is no closed-form solution — numerical integration (like our RK4-inspired solver) is required. Drag: reduces range and peak height, shifts optimal angle below 45°, and makes the descent steeper than the ascent.</p>
                      <h3 style={{color:'var(--txt)'}}>Applications</h3>
                      <ul style={{color:'var(--txt2)'}}>
                        <li><strong style={{color:'var(--txt)'}}>Sports:</strong> Optimising golf drive angle, basketball trajectory, javelin throw. Spin (Magnus effect) adds further complexity.</li>
                        <li><strong style={{color:'var(--txt)'}}>Artillery & ballistics:</strong> Long-range shells must account for drag, Coriolis effect, and even Earth's curvature.</li>
                        <li><strong style={{color:'var(--txt)'}}>Space science:</strong> On the Moon (g=1.62 m/s²), the same throw reaches ~6× the range as on Earth.</li>
                        <li><strong style={{color:'var(--txt)'}}>Video games:</strong> Game physics engines solve these equations 60+ times per second for every physics object.</li>
                      </ul>
                      <h3 style={{color:'var(--txt)'}}>FAQ</h3>
                      {[
                        {q:'Why does the optimal angle decrease with height?', a:'Starting above the landing point means you "need" less vertical velocity — the gravity does extra work for you. So putting more velocity into the horizontal component helps.'},
                        {q:'Does mass affect range (no air)?', a:'No. Without air resistance the kinematic equations have no mass term. This is Galileo\'s famous result — heavy and light objects fall identically.'},
                        {q:'What is the impact angle?', a:'The angle of velocity below horizontal at landing. For flat ground it mirrors the launch angle. With initial height it\'s steeper; with air resistance it\'s much steeper.'},
                        {q:'How does the drag coefficient Cd work here?', a:'We use a simplified drag model F/m = k·v². Higher Cd simulates blunter objects (like a football) vs. streamlined ones (like an arrow). Real drag also depends on cross-sectional area and air density.'},
                      ].map(({q,a},i)=>(
                        <div key={i} style={{padding:'12px 14px',marginBottom:9,
                          background:dark?'rgba(0,0,0,.35)':'#f5f7ff',
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          borderRadius:dark?3:9}}>
                          <div style={{fontSize:13.5,fontWeight:700,color:'var(--txt)',marginBottom:5}}>{q}</div>
                          <div style={{fontSize:13,color:'var(--txt2)',lineHeight:1.72}}>{a}</div>
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