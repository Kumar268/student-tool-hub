import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{overflow-x:hidden;font-family:'Inter',sans-serif}

@keyframes scanline{0%{top:-3px}100%{top:102%}}
@keyframes gridmove{from{background-position:0 0}to{background-position:40px 40px}}
@keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes ballroll{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes trail{0%{opacity:.7;transform:scaleX(1)}100%{opacity:0;transform:scaleX(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.fadeup{animation:fadeup .22s ease both}

/* DARK */
.dark{
  --bg:#020210;--sur:#08081e;--s2:#0d0d28;
  --bdr:#1c1c40;--bdr2:rgba(0,240,255,.2);
  --acc:#00f0ff;--acc2:#b000e0;--acc3:#f59e0b;
  --ok:#22c55e;--err:#f43f5e;
  --txt:#f0f4ff;--txt2:#a8b8d8;--txt3:#556080;
  background:var(--bg);color:var(--txt);
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
  color:var(--txt);font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:500;
  padding:10px 13px;outline:none;width:100%;transition:all .14s}
.dark .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(0,240,255,.1)}
.dark .inp::placeholder{color:var(--txt3)}
.dark .tab-bar{background:var(--sur);border-bottom:1px solid var(--bdr)}
.dark .tab{height:40px;padding:0 16px;border:none;border-bottom:2px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;font-size:11px;font-weight:700;
  letter-spacing:.07em;text-transform:uppercase;transition:all .14s;
  display:flex;align-items:center;gap:5px;white-space:nowrap}
.dark .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(0,240,255,.05)}
.dark .tab:hover:not(.on){color:var(--txt2);background:rgba(255,255,255,.02)}
.dark .btn-primary{display:inline-flex;align-items:center;gap:6px;padding:10px 22px;
  border:1px solid var(--acc);border-radius:4px;background:rgba(0,240,255,.1);
  color:var(--acc);cursor:pointer;font-size:11.5px;font-weight:700;letter-spacing:.08em;
  text-transform:uppercase;box-shadow:0 0 14px rgba(0,240,255,.1);transition:all .16s}
.dark .btn-primary:hover{background:rgba(0,240,255,.18);box-shadow:0 0 26px rgba(0,240,255,.25);transform:translateY(-1px)}
.dark .btn-primary:disabled{opacity:.35;cursor:not-allowed;transform:none}
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
  background:rgba(244,63,94,.07);font-size:13px;color:#fb7185;line-height:1.65;display:flex;align-items:center;gap:8px}
.dark .step-n{width:26px;height:26px;border-radius:50%;border:1px solid rgba(0,240,255,.28);
  background:rgba(0,240,255,.07);display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;color:var(--acc);flex-shrink:0}
.dark .step-ln{background:rgba(0,240,255,.08);width:1.5px}
.dark .formula-box{padding:9px 12px;border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.4);overflow-x:auto}
.dark .sidebar{border-right:1px solid var(--bdr);background:var(--sur);padding:13px 11px;overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.dark .sec-title{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(0,240,255,.42);margin-bottom:7px}
.dark .field-row{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.3);padding:10px 12px;margin-bottom:6px}
.dark .field-known{border-color:rgba(0,240,255,.3);background:rgba(0,240,255,.04)}
.dark .telemetry{background:rgba(2,2,16,.85);border:1px solid rgba(0,240,255,.2);
  border-radius:5px;padding:12px 14px;backdrop-filter:blur(10px)}

/* LIGHT */
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
  color:var(--txt);font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:500;
  padding:10px 13px;outline:none;width:100%;transition:all .14s;box-shadow:inset 0 1px 3px rgba(0,0,0,.05)}
.light .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(79,70,229,.13)}
.light .inp::placeholder{color:#b0bbd4}
.light .tab-bar{background:var(--sur);border-bottom:1.5px solid var(--bdr)}
.light .tab{height:40px;padding:0 16px;border:none;border-bottom:2.5px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;font-size:11px;font-weight:700;
  letter-spacing:.06em;text-transform:uppercase;transition:all .14s;
  display:flex;align-items:center;gap:5px;white-space:nowrap}
.light .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(79,70,229,.06);font-weight:800}
.light .tab:hover:not(.on){color:var(--txt2);background:rgba(79,70,229,.04)}
.light .btn-primary{display:inline-flex;align-items:center;gap:6px;padding:10px 22px;
  border:none;border-radius:8px;background:linear-gradient(135deg,var(--acc),var(--acc2));
  color:#fff;cursor:pointer;font-size:11.5px;font-weight:700;
  box-shadow:0 4px 14px rgba(79,70,229,.38);transition:all .16s}
.light .btn-primary:hover{box-shadow:0 8px 22px rgba(79,70,229,.5);transform:translateY(-1px)}
.light .btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none}
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
  background:rgba(220,38,38,.06);font-size:13px;color:var(--err);line-height:1.65;display:flex;align-items:center;gap:8px}
.light .step-n{width:26px;height:26px;border-radius:50%;border:1.5px solid rgba(79,70,229,.28);
  background:rgba(79,70,229,.09);display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;color:var(--acc);flex-shrink:0}
.light .step-ln{background:rgba(79,70,229,.12);width:1.5px}
.light .formula-box{padding:9px 12px;border:1.5px solid var(--bdr);border-radius:8px;background:rgba(79,70,229,.04);overflow-x:auto}
.light .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);padding:13px 11px;overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.light .sec-title{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--acc);margin-bottom:7px}
.light .field-row{border:1.5px solid var(--bdr);border-radius:9px;background:#f8faff;padding:10px 12px;margin-bottom:6px}
.light .field-known{border-color:rgba(79,70,229,.4);background:rgba(79,70,229,.05)}
.light .telemetry{background:rgba(255,255,255,.95);border:1.5px solid rgba(79,70,229,.25);
  border-radius:10px;padding:12px 14px;box-shadow:0 4px 16px rgba(79,70,229,.12)}

/* shared */
.topbar{height:38px;position:relative;z-index:300;display:flex;align-items:center;padding:0 12px;gap:7px;backdrop-filter:blur(14px)}
.dark .topbar{background:rgba(2,2,16,.97);border-bottom:1px solid var(--bdr)}
.light .topbar{background:rgba(255,255,255,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 8px rgba(79,70,229,.07)}
.prose p{font-size:13.5px;line-height:1.78;margin-bottom:12px;color:inherit}
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
    const l = document.createElement('link');
    l.rel='stylesheet'; l.href='https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(l);
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
  return <code style={{fontFamily:'JetBrains Mono,monospace',fontSize:display?14:11,color:dark?'#00f0ff':'#4f46e5'}}>{latex}</code>;
}

/* ═══ ICONS ═══ */
const Svg=({d,s=14,sw=1.8})=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>{(Array.isArray(d)?d:[d]).map((p,i)=><path key={i} d={p}/>)}</svg>;
const I={
  play:  s=><Svg s={s} d="M5 3l14 9-14 9V3z" sw={1.5}/>,
  pause: s=><Svg s={s} d={["M6 4h4v16H6z","M14 4h4v16h-4z"]}/>,
  reset: s=><Svg s={s} d="M1 4v6h6M23 20v-6h-6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>,
  info:  s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 16v-4M12 8h.01"]}/>,
  book:  s=><Svg s={s} d={["M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"]}/>,
  phys:  s=><Svg s={s} d={["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z","M12 6v6l4 2"]}/>,
  copy:  s=><Svg s={s} d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2","M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"]}/>,
  ok:    s=><Svg s={s} d="M20 6 9 17l-5-5"/>,
  arrow: s=><Svg s={s} d={["M5 12H19","M12 5l7 7-7 7"]}/>,
  check: s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M9 12l2 2 4-4"]}/>,
};

/* ═══ KINEMATICS SOLVER ENGINE ═══ */
const FIELDS = [
  { id:'d',  sym:'d',  label:'Displacement',    unit:'m',    tex:'d',   color:'#00f0ff', lcolor:'#4f46e5' },
  { id:'vi', sym:'vᵢ', label:'Initial Velocity', unit:'m/s',  tex:'v_i', color:'#22c55e', lcolor:'#16a34a' },
  { id:'vf', sym:'vf', label:'Final Velocity',   unit:'m/s',  tex:'v_f', color:'#f59e0b', lcolor:'#d97706' },
  { id:'a',  sym:'a',  label:'Acceleration',     unit:'m/s²', tex:'a',   color:'#b000e0', lcolor:'#7c3aed' },
  { id:'t',  sym:'t',  label:'Time',             unit:'s',    tex:'t',   color:'#f43f5e', lcolor:'#dc2626' },
];

function solveKinematics(raw) {
  const v = {};
  FIELDS.forEach(f => { const n = parseFloat(raw[f.id]); v[f.id] = isNaN(n) ? NaN : n; });

  const known = FIELDS.filter(f => !isNaN(v[f.id]));
  if (known.length < 3) return { error: `Need at least 3 known values (${known.length}/3 provided).` };

  const steps = [];
  let changed = true, iters = 0;
  while (changed && iters++ < 8) {
    changed = false;
    const has = k => !isNaN(v[k]);
    const set = (k, val, t, l) => { if (!has(k) && isFinite(val)) { v[k]=val; steps.push({t,l,d:`Derived ${k} = ${val.toFixed(4)}`}); changed=true; } };

    // vf = vi + a*t
    if (has('vi')&&has('a')&&has('t')) set('vf', v.vi+v.a*v.t, 'Apply v_f = v_i + at', `v_f = ${v.vi} + (${v.a})(${v.t}) = ${(v.vi+v.a*v.t).toFixed(4)}`);
    if (has('vf')&&has('a')&&has('t')) set('vi', v.vf-v.a*v.t, 'Solve for v_i', `v_i = v_f - at = ${v.vf} - (${v.a})(${v.t}) = ${(v.vf-v.a*v.t).toFixed(4)}`);
    if (has('vf')&&has('vi')&&has('t')&&v.t!==0) set('a', (v.vf-v.vi)/v.t, 'Solve for a', `a = \\frac{v_f - v_i}{t} = \\frac{${v.vf}-${v.vi}}{${v.t}} = ${((v.vf-v.vi)/v.t).toFixed(4)}`);
    if (has('vf')&&has('vi')&&has('a')&&v.a!==0) set('t', (v.vf-v.vi)/v.a, 'Solve for t', `t = \\frac{v_f - v_i}{a} = \\frac{${v.vf}-${v.vi}}{${v.a}} = ${((v.vf-v.vi)/v.a).toFixed(4)}`);

    // d = vi*t + 0.5*a*t²
    if (has('vi')&&has('a')&&has('t')) set('d', v.vi*v.t+.5*v.a*v.t**2, 'Apply d = v_i t + ½at²', `d = (${v.vi})(${v.t}) + 0.5(${v.a})(${v.t})^2 = ${(v.vi*v.t+.5*v.a*v.t**2).toFixed(4)}`);
    if (has('vi')&&has('a')&&has('d')&&v.a!==0) {
      const disc = v.vi**2+2*v.a*v.d;
      if (disc>=0) set('vf', Math.sqrt(disc), 'Apply v_f² = v_i² + 2ad', `v_f = \\sqrt{v_i^2+2ad} = \\sqrt{${v.vi}^2+2(${v.a})(${v.d})} = ${Math.sqrt(disc).toFixed(4)}`);
    }
    // d = (vi+vf)/2 * t
    if (has('vi')&&has('vf')&&has('t')) set('d', (v.vi+v.vf)/2*v.t, 'Apply d = \\frac{v_i+v_f}{2}t', `d = \\frac{${v.vi}+${v.vf}}{2} \\cdot ${v.t} = ${((v.vi+v.vf)/2*v.t).toFixed(4)}`);
    if (has('vi')&&has('vf')&&has('d')&&(v.vf+v.vi)!==0) set('t', 2*v.d/(v.vi+v.vf), 'Solve for t from d=(vi+vf)/2*t', `t = \\frac{2d}{v_i+v_f} = \\frac{2(${v.d})}{${v.vi}+${v.vf}} = ${(2*v.d/(v.vi+v.vf)).toFixed(4)}`);
    if (has('vf')&&has('a')&&has('d')&&v.a!==0) set('t', (v.vf-Math.sqrt(Math.max(0,v.vf**2-2*v.a*v.d)))/v.a, 'Solve t from displacement', `t = \\frac{v_f - \\sqrt{v_f^2-2ad}}{a}`);
  }

  const unknown = FIELDS.filter(f => isNaN(v[f.id]));
  if (unknown.length > 0) return { error: `Cannot solve for: ${unknown.map(f=>f.label).join(', ')}. Check for consistency.` };
  if (steps.length === 0) steps.push({ t:'All values provided', l:`d=${v.d.toFixed(3)},\\;v_i=${v.vi.toFixed(3)},\\;v_f=${v.vf.toFixed(3)},\\;a=${v.a.toFixed(3)},\\;t=${v.t.toFixed(3)}`, d:'All 5 parameters known' });

  // Derived physics
  const KE = 0.5 * v.vf**2; // per unit mass
  const impulse = v.a * v.t; // per unit mass (= Δv)
  const avgVel = (v.vi + v.vf) / 2;

  return { values: v, steps, error: null, derived: { KE, impulse, avgVel } };
}

/* ═══ 2D CANVAS SIMULATION ═══ */
function SimCanvas({ sol, dark, running, onComplete, resetKey }) {
  const canvasRef = useRef();
  const animRef = useRef();
  const startTimeRef = useRef(null);
  const doneRef = useRef(false);

  const TRACK_Y = 140, BALL_R = 18, TRACK_H = 4;
  const PAD = 60;

  useEffect(() => {
    doneRef.current = false;
    startTimeRef.current = null;
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    draw(ctx, cv.width, cv.height, 0, false);
  }, [resetKey, dark, sol]);

  const draw = useCallback((ctx, W, H, progress, isDone) => {
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = dark ? '#020210' : '#f0f3ff';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = dark ? 'rgba(0,240,255,.04)' : 'rgba(79,70,229,.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    if (!sol || sol.error) {
      ctx.fillStyle = dark ? 'rgba(244,63,94,.6)' : '#dc2626';
      ctx.font = '700 13px Inter,sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Enter 3 known values to run simulation', W/2, H/2);
      return;
    }

    const { d, vi, vf, a, t } = sol.values;
    const trackW = W - PAD*2;
    const trackX = PAD, trackEndX = PAD + trackW;

    // Ground / track
    ctx.fillStyle = dark ? '#1c1c40' : '#c5cde8';
    ctx.fillRect(trackX - 10, TRACK_Y, trackW + 20, TRACK_H);

    // Track glow (dark)
    if (dark) {
      const grad = ctx.createLinearGradient(trackX, TRACK_Y, trackEndX, TRACK_Y);
      grad.addColorStop(0, 'rgba(0,240,255,.3)');
      grad.addColorStop(1, 'rgba(176,0,224,.3)');
      ctx.strokeStyle = grad; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(trackX-10, TRACK_Y); ctx.lineTo(trackEndX+10, TRACK_Y); ctx.stroke();
    }

    // Distance scale ticks
    const steps = 5;
    ctx.fillStyle = dark ? 'rgba(168,184,216,.5)' : 'rgba(55,65,81,.6)';
    ctx.font = '9px JetBrains Mono,monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i <= steps; i++) {
      const tx = trackX + trackW * i / steps;
      const dv = (d * i / steps).toFixed(1);
      ctx.fillStyle = dark ? 'rgba(0,240,255,.3)' : 'rgba(79,70,229,.35)';
      ctx.fillRect(tx - 0.5, TRACK_Y, 1, 10);
      ctx.fillStyle = dark ? 'rgba(168,184,216,.55)' : 'rgba(55,65,81,.6)';
      ctx.fillText(`${dv}m`, tx, TRACK_Y + 22);
    }

    // Clamp ball position
    const maxD = Math.abs(d) || 1;
    const clampedProg = Math.max(0, Math.min(1, progress));
    const ballXCurrent = trackX + (clampedProg * trackW * (d >= 0 ? 1 : -1) + (d < 0 ? trackW : 0));
    const ballX = Math.max(trackX + BALL_R, Math.min(trackEndX - BALL_R, ballXCurrent));
    const ballY = TRACK_Y - BALL_R;

    // Trail
    if (progress > 0.01) {
      const trailStart = trackX + (d < 0 ? trackW : 0);
      const trailEnd = ballX;
      const trailGrad = ctx.createLinearGradient(trailStart, ballY, trailEnd, ballY);
      if (dark) {
        trailGrad.addColorStop(0, 'rgba(0,240,255,.0)');
        trailGrad.addColorStop(1, 'rgba(0,240,255,.25)');
      } else {
        trailGrad.addColorStop(0, 'rgba(79,70,229,.0)');
        trailGrad.addColorStop(1, 'rgba(79,70,229,.2)');
      }
      ctx.fillStyle = trailGrad;
      const trailH = BALL_R * 0.6;
      ctx.beginPath();
      ctx.ellipse((trailStart + trailEnd)/2, ballY + trailH/2, Math.abs(trailEnd - trailStart)/2, trailH/2, 0, 0, Math.PI*2);
      ctx.fill();
    }

    // Ball shadow
    ctx.fillStyle = dark ? 'rgba(0,0,0,.4)' : 'rgba(0,0,0,.12)';
    ctx.beginPath(); ctx.ellipse(ballX, TRACK_Y + 3, BALL_R * 0.85, 5, 0, 0, Math.PI*2); ctx.fill();

    // Ball
    const ballColor = dark
      ? ['#00f0ff','#00c8d4','rgba(0,240,255,.0)']
      : ['#6366f1','#4f46e5','rgba(79,70,229,.0)'];
    const bGrad = ctx.createRadialGradient(ballX-BALL_R*.3, ballY-BALL_R*.3, 2, ballX, ballY, BALL_R);
    bGrad.addColorStop(0, ballColor[0]);
    bGrad.addColorStop(.6, ballColor[1]);
    bGrad.addColorStop(1, ballColor[2]);
    ctx.fillStyle = bGrad;
    ctx.beginPath(); ctx.arc(ballX, ballY, BALL_R, 0, Math.PI*2); ctx.fill();

    if (dark) {
      ctx.strokeStyle = 'rgba(0,240,255,.6)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(ballX, ballY, BALL_R, 0, Math.PI*2); ctx.stroke();
      ctx.shadowColor = '#00f0ff'; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.arc(ballX, ballY, BALL_R, 0, Math.PI*2); ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Velocity arrow
    const currentV = vi + a * (progress * t);
    const arrowLen = Math.min(60, Math.abs(currentV) * 3);
    const arrowDir = currentV >= 0 ? 1 : -1;
    if (Math.abs(currentV) > 0.05 && running) {
      const ac = dark ? 'rgba(245,158,11,.85)' : 'rgba(217,119,6,.85)';
      ctx.strokeStyle = ac; ctx.fillStyle = ac; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(ballX, ballY); ctx.lineTo(ballX + arrowDir * arrowLen, ballY); ctx.stroke();
      // arrowhead
      ctx.beginPath();
      ctx.moveTo(ballX + arrowDir * arrowLen, ballY);
      ctx.lineTo(ballX + arrowDir * (arrowLen - 8), ballY - 5);
      ctx.lineTo(ballX + arrowDir * (arrowLen - 8), ballY + 5);
      ctx.closePath(); ctx.fill();

      // v label
      ctx.fillStyle = dark ? 'rgba(245,158,11,.9)' : 'rgba(217,119,6,.9)';
      ctx.font = '700 10px JetBrains Mono,monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`v=${currentV.toFixed(1)}m/s`, ballX + arrowDir * arrowLen/2, ballY - 10);
    }

    // Start / end markers
    ctx.textAlign = 'center';
    ctx.font = '700 9px Inter,sans-serif';
    ctx.fillStyle = dark ? 'rgba(0,240,255,.45)' : 'rgba(79,70,229,.55)';
    ctx.fillText('START', trackX, TRACK_Y + 38);
    ctx.fillText(`END (${d>=0?'+':''}${d.toFixed(1)}m)`, trackEndX, TRACK_Y + 38);

    // Time progress bar
    const barY = H - 28, barH = 5, barW = trackW;
    ctx.fillStyle = dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.08)';
    ctx.beginPath(); ctx.roundRect(trackX, barY, barW, barH, 3); ctx.fill();
    const pGrad = ctx.createLinearGradient(trackX, 0, trackX + barW * clampedProg, 0);
    if (dark) { pGrad.addColorStop(0, '#00f0ff'); pGrad.addColorStop(1, '#b000e0'); }
    else { pGrad.addColorStop(0, '#4f46e5'); pGrad.addColorStop(1, '#7c3aed'); }
    ctx.fillStyle = pGrad;
    ctx.beginPath(); ctx.roundRect(trackX, barY, barW * clampedProg, barH, 3); ctx.fill();

    // Time label
    ctx.fillStyle = dark ? 'rgba(168,184,216,.55)' : 'rgba(55,65,81,.6)';
    ctx.font = '9px JetBrains Mono,monospace'; ctx.textAlign = 'right';
    ctx.fillText(`t = ${(clampedProg * t).toFixed(2)}s / ${t.toFixed(2)}s`, trackX + barW, barY - 4);

    // Done marker
    if (isDone) {
      ctx.fillStyle = dark ? '#22c55e' : '#16a34a';
      ctx.font = '700 12px Inter,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('✓ Simulation Complete', W/2, 20);
    }
  }, [dark, sol, running]);

  useEffect(() => {
    if (!running) {
      cancelAnimationFrame(animRef.current);
      startTimeRef.current = null;
      return;
    }
    if (sol?.error) return;
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const simDur = Math.min(Math.max(sol.values.t, 1), 8); // map real t to 1–8s animation

    const animate = (ts) => {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = (ts - startTimeRef.current) / 1000;
      const progress = Math.min(elapsed / simDur, 1);
      draw(ctx, cv.width, cv.height, progress, false);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        draw(ctx, cv.width, cv.height, 1, true);
        doneRef.current = true;
        onComplete();
      }
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [running, resetKey, sol, draw, onComplete]);

  // Static draw when not running
  useEffect(() => {
    if (running) return;
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    draw(ctx, cv.width, cv.height, 0, false);
  }, [running, dark, sol, draw]);

  return (
    <canvas ref={canvasRef} width={700} height={200}
      style={{ width:'100%', height:'auto', display:'block', borderRadius: dark?4:10 }} />
  );
}

/* ═══ VELOCITY-TIME GRAPH ═══ */
function VTGraph({ sol, dark }) {
  const ref = useRef();
  useEffect(() => {
    if (!sol || sol.error) return;
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height;
    const p = { l:46, r:16, t:14, b:30 };
    const pw = W-p.l-p.r, ph = H-p.t-p.b;

    ctx.fillStyle = dark ? '#020210' : '#f8faff';
    ctx.fillRect(0,0,W,H);

    const { vi, vf, t } = sol.values;
    const yMin = Math.min(0, vi, vf)*1.1 - 0.5;
    const yMax = Math.max(0, vi, vf)*1.1 + 0.5;
    const toX = (tv) => p.l + (tv/t)*pw;
    const toY = (v) => p.t + ph - (v - yMin)/(yMax - yMin)*ph;

    // Grid
    ctx.strokeStyle = dark?'rgba(255,255,255,.04)':'rgba(0,0,0,.06)'; ctx.lineWidth=1; ctx.setLineDash([2,4]);
    for(let i=0;i<=4;i++){const x=p.l+pw*i/4; ctx.beginPath();ctx.moveTo(x,p.t);ctx.lineTo(x,p.t+ph);ctx.stroke();}
    for(let i=0;i<=4;i++){const y=p.t+ph*i/4; ctx.beginPath();ctx.moveTo(p.l,y);ctx.lineTo(p.l+pw,y);ctx.stroke();}
    ctx.setLineDash([]);

    // Zero line
    ctx.strokeStyle = dark?'rgba(255,255,255,.18)':'rgba(0,0,0,.2)'; ctx.lineWidth=1;
    const y0=toY(0); ctx.beginPath(); ctx.moveTo(p.l,y0); ctx.lineTo(p.l+pw,y0); ctx.stroke();

    // Area under curve
    const aGrad = ctx.createLinearGradient(0,toY(yMax),0,toY(yMin));
    if(dark){aGrad.addColorStop(0,'rgba(0,240,255,.18)');aGrad.addColorStop(1,'rgba(0,240,255,.0)');}
    else{aGrad.addColorStop(0,'rgba(79,70,229,.14)');aGrad.addColorStop(1,'rgba(79,70,229,.0)');}
    ctx.fillStyle=aGrad;
    ctx.beginPath();
    ctx.moveTo(toX(0),y0);
    ctx.lineTo(toX(0),toY(vi));
    ctx.lineTo(toX(t),toY(vf));
    ctx.lineTo(toX(t),y0);
    ctx.closePath(); ctx.fill();

    // V-T line
    const lc = dark?'#00f0ff':'#4f46e5';
    ctx.strokeStyle=lc; ctx.lineWidth=2.5;
    if(dark){ctx.shadowColor='#00f0ff';ctx.shadowBlur=6;}
    ctx.beginPath(); ctx.moveTo(toX(0),toY(vi)); ctx.lineTo(toX(t),toY(vf)); ctx.stroke();
    ctx.shadowBlur=0;

    // Dots
    [[0,vi],[t,vf]].forEach(([tx,vy])=>{
      ctx.fillStyle=dark?'#00f0ff':'#4f46e5';
      ctx.beginPath();ctx.arc(toX(tx),toY(vy),4,0,Math.PI*2);ctx.fill();
    });

    // Labels
    ctx.fillStyle=dark?'rgba(168,184,216,.6)':'rgba(55,65,81,.65)';
    ctx.font='9px JetBrains Mono,monospace'; ctx.textAlign='right';
    for(let i=0;i<=4;i++){const y=yMin+(yMax-yMin)*i/4; ctx.fillText(y.toFixed(1),p.l-4,toY(y)+3);}
    ctx.textAlign='center';
    for(let i=0;i<=4;i++){const tx2=t*i/4; ctx.fillText(tx2.toFixed(1),toX(tx2),p.t+ph+14);}

    // axis labels
    ctx.fillStyle=dark?'rgba(0,240,255,.45)':'var(--acc)';
    ctx.font='700 8px Inter,sans-serif'; ctx.textAlign='center';
    ctx.fillText('t (s)',p.l+pw/2,H-2);
    ctx.save(); ctx.translate(10,p.t+ph/2); ctx.rotate(-Math.PI/2);
    ctx.fillText('v (m/s)',0,0); ctx.restore();
  },[sol,dark]);
  return <canvas ref={ref} width={560} height={160} style={{width:'100%',height:'auto',display:'block',borderRadius:dark?3:8}}/>;
}

/* ═══ STEPS DISPLAY ═══ */
function Steps({steps,dark,katex}) {
  return (
    <div>
      {steps.map((s,i)=>(
        <div key={i} style={{display:'flex',gap:10,marginBottom:i===steps.length-1?0:18}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
            <div className="step-n">{i+1}</div>
            {i<steps.length-1&&<div className="step-ln" style={{flex:1,marginTop:5,minHeight:14}}/>}
          </div>
          <div style={{flex:1,paddingBottom:i===steps.length-1?0:4}}>
            <div style={{fontSize:13,fontWeight:700,color:'var(--txt)',marginBottom:3}}>{s.t}</div>
            {s.d&&<div style={{fontSize:12.5,color:'var(--txt2)',marginBottom:6,lineHeight:1.65}}>{s.d}</div>}
            <div className="formula-box">
              {katex?<KTeX latex={s.l} dark={dark}/>:<code style={{fontFamily:'JetBrains Mono,monospace',fontSize:11.5,color:'var(--acc)'}}>{s.l}</code>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══ PRESETS ═══ */
const PRESETS = [
  { label:'Free Fall (1s)', d:'', vi:'0', vf:'', a:'9.8', t:'1' },
  { label:'Car Braking', d:'', vi:'20', vf:'0', a:'', t:'4' },
  { label:'Projectile Peak', d:'', vi:'30', vf:'0', a:'-9.8', t:'' },
  { label:'Constant Speed', d:'50', vi:'10', vf:'10', a:'0', t:'' },
  { label:'Rocket Launch', d:'', vi:'0', vf:'', a:'25', t:'5' },
  { label:'Ball Thrown Up', d:'', vi:'15', vf:'-15', a:'-9.8', t:'' },
  { label:'Train Accel.', d:'400', vi:'5', vf:'', a:'', t:'20' },
  { label:'Skydiver Term.', d:'', vi:'0', vf:'55', a:'9.8', t:'' },
];

/* ═══ MAIN ═══ */
export default function PhysicsKinematics() {
  const [mode, setMode] = useState('dark');
  const dark = mode === 'dark';
  const katex = useKatex();
  const [inputs, setInputs] = useState({ d:'', vi:'0', vf:'', a:'9.8', t:'' });
  const [running, setRunning] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [pageTab, setPageTab] = useState('calc');

  const sol = useMemo(() => solveKinematics(inputs), [inputs]);

  const resetSim = () => { setRunning(false); setResetKey(k=>k+1); };
  const handleComplete = useCallback(() => setRunning(false), []);

  const PAGE_TABS = [
    { id:'calc', label:'Solver' },
    { id:'guide', label:'How to Use' },
    { id:'learn', label:'Learn' },
  ];

  const knownCount = FIELDS.filter(f => inputs[f.id] !== '' && !isNaN(parseFloat(inputs[f.id]))).length;

  return (
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
              {I.phys(14)}
            </div>
            <span style={{fontSize:13,fontWeight:800,color:'var(--txt)',letterSpacing:dark?'.04em':'-.01em'}}>
              Kinematics<span style={{color:'var(--acc)'}}>Solver</span>
            </span>
          </div>
          <div style={{flex:1}}/>
          <button onClick={()=>setMode(dark?'light':'dark')}
            style={{display:'flex',alignItems:'center',gap:6,padding:'5px 11px',
              border:dark?'1px solid rgba(0,240,255,.18)':'1.5px solid var(--bdr)',
              borderRadius:dark?3:8,background:dark?'rgba(0,240,255,.03)':'var(--sur)',
              cursor:'pointer',transition:'all .14s'}}>
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
        <div className="tab-bar" style={{display:'flex'}}>
          {PAGE_TABS.map(t=>(
            <button key={t.id} className={`tab ${pageTab===t.id?'on':''}`} onClick={()=>setPageTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* BODY */}
        <div className="tool-layout-grid">

          {/* SIDEBAR */}
          <div className="sidebar">

            {/* Presets */}
            <div>
              <div className="sec-title">Example Problems</div>
              {PRESETS.map((p,i)=>(
                <button key={i} onClick={()=>{setInputs(p); resetSim(); setPageTab('calc');}}
                  style={{display:'block',width:'100%',textAlign:'left',marginBottom:4,
                    padding:'6px 10px',fontSize:11.5,cursor:'pointer',
                    border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                    borderRadius:dark?2:7,background:'transparent',
                    color:dark?'var(--txt3)':'var(--txt2)',transition:'all .11s',fontFamily:'Inter,sans-serif'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--acc)';e.currentTarget.style.color='var(--acc)';e.currentTarget.style.background=dark?'rgba(0,240,255,.04)':'rgba(79,70,229,.06)';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=dark?'var(--bdr)':'var(--bdr)';e.currentTarget.style.color=dark?'var(--txt3)':'var(--txt2)';e.currentTarget.style.background='transparent';}}>
                  {p.label}
                </button>
              ))}
            </div>

            {/* The Big Four equations */}
            <div>
              <div className="sec-title">Big Four Equations</div>
              {[
                `v_f = v_i + at`,
                `d = v_i t + \\tfrac{1}{2}at^2`,
                `v_f^2 = v_i^2 + 2ad`,
                `d = \\tfrac{v_i+v_f}{2}\\cdot t`,
              ].map((eq,i)=>(
                <div key={i} style={{padding:'7px 10px',marginBottom:5,
                  border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                  borderRadius:dark?3:7,background:dark?'rgba(0,0,0,.3)':'rgba(79,70,229,.04)',
                  overflowX:'auto'}}>
                  {katex?<KTeX latex={eq} dark={dark}/>:<code style={{fontFamily:'JetBrains Mono,monospace',fontSize:10,color:'var(--acc)'}}>{eq}</code>}
                </div>
              ))}
            </div>

            {/* Variable legend */}
            <div>
              <div className="sec-title">Variables</div>
              {FIELDS.map(f=>(
                <div key={f.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5,
                  padding:'5px 8px',border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                  borderRadius:dark?2:6}}>
                  <code style={{fontFamily:'JetBrains Mono,monospace',fontSize:12,fontWeight:700,
                    color:dark?f.color:f.lcolor}}>{f.sym}</code>
                  <span style={{fontSize:10.5,color:'var(--txt2)'}}>{f.label}</span>
                  <span style={{fontSize:9,color:'var(--txt3)',fontFamily:'JetBrains Mono,monospace'}}>{f.unit}</span>
                </div>
              ))}
            </div>

          </div>

          {/* MAIN */}
          <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:13}}>
            <AnimatePresence mode="wait">

              {pageTab==='calc' && (
                <motion.div key="calc" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>

                  {/* Top row: inputs + telemetry */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>

                    {/* Input fields */}
                    <div className="panel" style={{padding:15}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:13}}>
                        <span style={{fontSize:11,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',
                          color:dark?'rgba(0,240,255,.5)':'var(--acc)'}}>Motion Parameters</span>
                        <div style={{display:'flex',gap:5,alignItems:'center'}}>
                          <span style={{fontSize:10,color:'var(--txt3)'}}>{knownCount}/5 known</span>
                          <button className="btn-ghost" onClick={()=>{setInputs({d:'',vi:'0',vf:'',a:'9.8',t:''});resetSim();}}>
                            {I.reset(11)} Reset
                          </button>
                        </div>
                      </div>

                      {FIELDS.map(f => {
                        const isKnown = inputs[f.id]!=='' && !isNaN(parseFloat(inputs[f.id]));
                        return (
                          <div key={f.id} className={`field-row ${isKnown?'field-known':''}`} style={{marginBottom:7}}>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
                              <span style={{fontSize:10,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',
                                color:dark?f.color:f.lcolor}}>{f.label}</span>
                              <span style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--txt3)'}}>{f.unit}</span>
                            </div>
                            <div style={{display:'flex',gap:6,alignItems:'center'}}>
                              <code style={{fontSize:13,fontWeight:800,fontFamily:'JetBrains Mono,monospace',
                                color:dark?f.color:f.lcolor,width:22,flexShrink:0}}>{f.sym}</code>
                              <input className="inp" type="number" step="any"
                                value={inputs[f.id]}
                                onChange={e=>{setInputs(prev=>({...prev,[f.id]:e.target.value}));resetSim();}}
                                placeholder="unknown"
                                style={{height:36,fontSize:14,flex:1}} />
                              {isKnown && (
                                <span style={{fontSize:9,color:dark?'var(--ok)':'var(--ok)',flexShrink:0}}>{I.check(12)}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Results / Telemetry */}
                    <div style={{display:'flex',flexDirection:'column',gap:10}}>
                      {sol.error ? (
                        <div className="err-box">{I.info(14)} {sol.error}</div>
                      ) : (
                        <>
                          {/* Solved values */}
                          <div className="panel" style={{padding:14}}>
                            <span className="lbl">Solved Values</span>
                            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
                              {FIELDS.map(f=>(
                                <div key={f.id} className="metric">
                                  <div style={{fontSize:8.5,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',
                                    color:dark?f.color:f.lcolor,marginBottom:3}}>{f.label}</div>
                                  <div style={{fontSize:17,fontWeight:800,fontFamily:'JetBrains Mono,monospace',
                                    color:dark?f.color:f.lcolor}}>
                                    {sol.values[f.id].toFixed(3).replace(/\.?0+$/,'')}
                                    <span style={{fontSize:9,fontWeight:400,marginLeft:2,color:'var(--txt3)'}}>{f.unit}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Derived */}
                          <div className="panel" style={{padding:14}}>
                            <span className="lbl">Derived Quantities (per kg)</span>
                            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:7}}>
                              {[
                                ['Avg Velocity', sol.derived.avgVel.toFixed(3), 'm/s'],
                                ['ΔKE / mass', sol.derived.KE.toFixed(3), 'J/kg'],
                                ['Impulse / mass', sol.derived.impulse.toFixed(3), 'N·s/kg'],
                              ].map(([l,v,u])=>(
                                <div key={l} className="metric">
                                  <div style={{fontSize:8,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--txt3)',marginBottom:3}}>{l}</div>
                                  <div style={{fontSize:15,fontWeight:800,fontFamily:'JetBrains Mono,monospace',color:'var(--acc)'}}>
                                    {v}<span style={{fontSize:8,marginLeft:2,color:'var(--txt3)',fontWeight:400}}>{u}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Sim controls */}
                      <div className="panel" style={{padding:13}}>
                        <span className="lbl" style={{marginBottom:8}}>Simulation Controls</span>
                        <div style={{display:'flex',gap:8}}>
                          <button className="btn-primary" disabled={!!sol.error}
                            onClick={()=>{if(!running){setResetKey(k=>k+1);setTimeout(()=>setRunning(true),50);}else setRunning(false);}}
                            style={{flex:1,justifyContent:'center'}}>
                            {running ? <>{I.pause(12)} Pause</> : <>{I.play(12)} {resetKey>0?'Replay':'Run'}</>}
                          </button>
                          <button className="btn-ghost" onClick={resetSim} style={{padding:'9px 12px'}}>
                            {I.reset(12)}
                          </button>
                        </div>
                        {sol.error && <div style={{fontSize:11,color:'var(--txt3)',marginTop:7,textAlign:'center'}}>Solve kinematics first to enable simulation</div>}
                      </div>
                    </div>
                  </div>

                  {/* Canvas simulation */}
                  <div className="panel" style={{padding:13}}>
                    <div style={{fontSize:9.5,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',
                      color:dark?'rgba(0,240,255,.45)':'var(--acc)',marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
                      {I.arrow(11)} Motion Simulation
                      <span style={{fontSize:8.5,color:'var(--txt3)',fontWeight:400}}>2D canvas — ball with velocity arrow & trail</span>
                    </div>
                    <SimCanvas sol={sol} dark={dark} running={running} onComplete={handleComplete} resetKey={resetKey}/>
                  </div>

                  {/* V-T Graph */}
                  {!sol.error && (
                    <div className="panel" style={{padding:13}}>
                      <div style={{fontSize:9.5,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',
                        color:dark?'rgba(0,240,255,.45)':'var(--acc)',marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
                        {I.arrow(11)} Velocity–Time Graph
                        <span style={{fontSize:8.5,color:'var(--txt3)',fontWeight:400}}>Shaded area = displacement</span>
                      </div>
                      <VTGraph sol={sol} dark={dark}/>
                    </div>
                  )}

                  {/* Steps */}
                  {!sol.error && sol.steps?.length>0 && (
                    <div className="panel" style={{padding:15}}>
                      <div style={{fontSize:9.5,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',
                        color:dark?'rgba(0,240,255,.45)':'var(--acc)',marginBottom:14}}>
                        Step-by-Step Solution
                      </div>
                      <Steps steps={sol.steps} dark={dark} katex={katex}/>
                    </div>
                  )}

                </motion.div>
              )}

              {pageTab==='guide' && (
                <motion.div key="guide" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div className="hint" style={{display:'flex',gap:7}}>
                    {I.info(13)} <span>KinematicsSolver uses the 4 kinematic equations to find any unknown from 3 known values, then visualises the motion with a 2D simulation and V-T graph.</span>
                  </div>
                  {[
                    ['Enter 3 known values', 'Fill in any 3 of the 5 fields: d (displacement), vᵢ (initial velocity), vf (final velocity), a (acceleration), t (time). Leave unknowns blank.'],
                    ['Leave unknowns blank', 'Any field left empty will be solved automatically. The solver iterates through all 4 kinematic equations until every unknown is found.'],
                    ['Check the solved values panel', 'All 5 values appear on the right with colour coding. Derived quantities (average velocity, ΔKE per kg, impulse per kg) are also computed.'],
                    ['Run the simulation', 'Press Run to watch the ball animate across the track with a velocity arrow, trail, and real-time progress bar. Press Pause to pause mid-flight.'],
                    ['Read the V-T graph', 'The velocity-time graph shows the linear change from vᵢ to vf. The shaded area under the line equals the displacement d.'],
                    ['Use example presets', 'Click any preset in the sidebar to instantly load a classic physics problem (free fall, braking car, projectile, etc.).'],
                    ['Step-by-step solution', 'Below the graphs, each kinematic equation used is shown with full substitution and result.'],
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

              {pageTab==='learn' && (
                <motion.div key="learn" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <div className="panel" style={{padding:22}}>
                    <h1 style={{fontSize:21,fontWeight:900,color:'var(--txt)',marginBottom:5}}>Understanding Linear Kinematics</h1>
                    <p style={{fontSize:12.5,color:'var(--txt3)',marginBottom:20}}>Displacement · Velocity · Acceleration · The Big Four Equations</p>
                    <div className="prose" style={{color:'var(--txt)'}}>
                      <p style={{color:'var(--txt2)'}}>Kinematics describes the motion of objects without asking what causes the motion. Under constant acceleration, just 5 quantities — displacement, initial/final velocity, acceleration, and time — completely characterise any linear motion.</p>
                      <h3 style={{color:'var(--txt)'}}>The Big Four Equations</h3>
                      <p style={{color:'var(--txt2)'}}>Each equation links a different subset of the 5 variables. Given any 3, you can solve for the other 2:</p>
                      {katex && window.katex && [
                        ['v_f = v_i + at', 'Links velocity and time (no displacement)'],
                        ['d = v_i t + \\tfrac{1}{2}at^2', 'Links displacement and time (no v_f)'],
                        ['v_f^2 = v_i^2 + 2ad', 'Links velocity and displacement (no time)'],
                        ['d = \\tfrac{v_i+v_f}{2}\\cdot t', 'Average velocity definition'],
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
                      <h3 style={{color:'var(--txt)'}}>Velocity vs Speed</h3>
                      <p style={{color:'var(--txt2)'}}>Velocity is a <strong style={{color:'var(--txt)'}}>vector</strong> — it has both magnitude and direction. Negative velocity means motion opposite to your chosen positive direction. Speed is just the magnitude (always positive).</p>
                      <h3 style={{color:'var(--txt)'}}>The V-T Graph</h3>
                      <p style={{color:'var(--txt2)'}}>For constant acceleration, the v-t graph is always a straight line. The <strong style={{color:'var(--txt)'}}>slope</strong> of the line equals acceleration. The <strong style={{color:'var(--txt)'}}>area under the line</strong> equals displacement — which is why the shaded region in our graph represents d.</p>
                      <h3 style={{color:'var(--txt)'}}>Real-World Applications</h3>
                      <ul style={{color:'var(--txt2)'}}>
                        <li><strong style={{color:'var(--txt)'}}>Automotive safety:</strong> Braking distance at highway speed — knowing a (deceleration from brakes) and vᵢ determines the stopping distance d.</li>
                        <li><strong style={{color:'var(--txt)'}}>Ballistics:</strong> Projectile motion separates into horizontal (a=0) and vertical (a=−g) kinematics solved independently.</li>
                        <li><strong style={{color:'var(--txt)'}}>Space launches:</strong> Rocket staging — each burn phase has constant thrust, so kinematics applies per stage.</li>
                        <li><strong style={{color:'var(--txt)'}}>Sports science:</strong> Sprint analysis — measuring vf at the 100m mark and t gives a and helps coaches optimise training.</li>
                      </ul>
                      <h3 style={{color:'var(--txt)'}}>FAQ</h3>
                      {[
                        {q:'What if acceleration is not constant?', a:'These 4 equations only hold for constant acceleration. Variable acceleration requires integration: v(t) = ∫a(t)dt and d = ∫v(t)dt.'},
                        {q:'Why can vf² = vi² + 2ad give two answers?', a:'Technically √(vi²+2ad) has two roots (±), but physics context (direction of motion) determines which is physically meaningful.'},
                        {q:'What does negative displacement mean?', a:'The object ended up behind its starting point relative to your positive direction. It doesn\'t mean the object "went backward" in any absolute sense.'},
                        {q:'Can I use these for free fall?', a:'Yes — set a = 9.8 m/s² downward (or −9.8 if upward is positive). The equations apply perfectly under constant gravitational acceleration.'},
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