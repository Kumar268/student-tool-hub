import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{overflow-x:hidden;font-family:'Inter',sans-serif}

@keyframes scanline{0%{top:-3px}100%{top:102%}}
@keyframes gridmove{from{background-position:0 0}to{background-position:40px 40px}}
@keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes pulseglow{0%,100%{box-shadow:0 0 18px rgba(0,240,255,.15),0 0 40px rgba(0,240,255,.06)}50%{box-shadow:0 0 34px rgba(0,240,255,.55),0 0 80px rgba(0,240,255,.2)}}
@keyframes pulseglow-light{0%,100%{box-shadow:0 4px 18px rgba(79,70,229,.28)}50%{box-shadow:0 8px 32px rgba(79,70,229,.6),0 0 60px rgba(124,58,237,.2)}}
@keyframes ripple{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.8);opacity:0}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.15}}
@keyframes barwave{0%,100%{transform:scaleY(.18)}50%{transform:scaleY(1)}}
.fadeup{animation:fadeup .22s ease both}

/* ══ DARK ══ */
.dark{
  --bg:#020210;--sur:#08081e;--s2:#0c0c25;
  --bdr:#1a1a3e;--bdr2:rgba(0,240,255,.22);
  --acc:#00f0ff;--acc2:#b000e0;--acc3:#f59e0b;
  --ok:#22c55e;--err:#f43f5e;
  --txt:#f0f4ff;--txt2:#a8b8d8;--txt3:#5a6a90;
  min-height:100vh;background:var(--bg);color:var(--txt);
  background-image:linear-gradient(rgba(0,240,255,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,.012) 1px,transparent 1px);
  background-size:40px 40px;animation:gridmove 14s linear infinite
}
.scanline{position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:9999;
  background:linear-gradient(90deg,transparent,rgba(0,240,255,.55),transparent);
  box-shadow:0 0 12px rgba(0,240,255,.3);animation:scanline 8s linear infinite;top:-3px}
.dark .panel{background:linear-gradient(145deg,var(--sur),var(--s2));border:1px solid var(--bdr);border-radius:5px;position:relative;overflow:hidden}
.dark .panel::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,240,255,.18),transparent);pointer-events:none}
.dark .inp{background:rgba(0,0,0,.55);border:1px solid var(--bdr);border-radius:4px;color:var(--txt);font-family:'Inter',sans-serif;font-size:14px;padding:8px 11px;outline:none;width:100%;transition:all .14s}
.dark .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(0,240,255,.1)}
.dark .inp::placeholder{color:var(--txt3)}
.dark .sel{background:rgba(0,0,0,.55);border:1px solid var(--bdr);border-radius:4px;color:var(--txt);font-size:12.5px;padding:7px 10px;outline:none;cursor:pointer;width:100%;transition:all .14s}
.dark .sel:focus{border-color:var(--acc)}
.dark .sel option{background:#0d0d28}
.dark .tab-bar{background:var(--sur);border-bottom:1px solid var(--bdr)}
.dark .tab{height:40px;padding:0 16px;border:none;border-bottom:2px solid transparent;background:transparent;color:var(--txt3);cursor:pointer;font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;transition:all .14s;display:flex;align-items:center;gap:5px;white-space:nowrap}
.dark .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(0,240,255,.05)}
.dark .tab:hover:not(.on){color:var(--txt2)}
.dark .btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 20px;border:1px solid var(--acc);border-radius:4px;background:rgba(0,240,255,.1);color:var(--acc);cursor:pointer;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 0 14px rgba(0,240,255,.1);transition:all .16s}
.dark .btn-primary:hover{background:rgba(0,240,255,.2);box-shadow:0 0 28px rgba(0,240,255,.28);transform:translateY(-1px)}
.dark .btn-primary:disabled{opacity:.35;cursor:not-allowed;transform:none}
.dark .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:5px 10px;border:1px solid var(--bdr);border-radius:4px;background:transparent;color:var(--txt3);cursor:pointer;font-size:10px;font-weight:600;transition:all .12s}
.dark .btn-ghost:hover,.dark .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(0,240,255,.06)}
.dark .btn-ghost:disabled{opacity:.35;cursor:not-allowed}
.dark .metric{border:1px solid rgba(0,240,255,.12);border-radius:4px;padding:11px 13px;background:rgba(0,240,255,.04)}
.dark .lbl{font-size:9.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(0,240,255,.5);display:block;margin-bottom:5px}
.dark .hint{font-size:13px;color:var(--txt2);line-height:1.75;padding:9px 12px;border-radius:4px;background:rgba(0,240,255,.04);border-left:2px solid rgba(0,240,255,.3)}
.dark .ad-slot{background:rgba(0,240,255,.018);border:1px dashed rgba(0,240,255,.1);border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:var(--txt3);font-size:9px;letter-spacing:.1em;text-transform:uppercase}
.dark .txa{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:4px;color:var(--txt);font-family:'Inter',sans-serif;font-size:14.5px;line-height:1.85;padding:14px 16px;outline:none;resize:vertical;width:100%;transition:border-color .14s}
.dark .txa:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(0,240,255,.08)}
.dark .sidebar{border-right:1px solid var(--bdr);background:var(--sur);padding:13px 11px;overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.dark .sec-title{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(0,240,255,.42);margin-bottom:7px}
.dark .step-n{width:26px;height:26px;border-radius:50%;border:1px solid rgba(0,240,255,.28);background:rgba(0,240,255,.07);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--acc);flex-shrink:0}
.dark .step-ln{background:rgba(0,240,255,.1);width:1.5px}
.dark .range{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;transition:all .14s}
.dark .range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:var(--acc);box-shadow:0 0 8px rgba(0,240,255,.4);cursor:pointer}
.dark .word-highlight{background:rgba(0,240,255,.15);border-radius:3px;transition:background .15s}
.dark .history-row{border:1px solid var(--bdr);border-radius:4px;padding:11px 13px;background:rgba(0,240,255,.02);cursor:pointer;transition:border-color .14s}
.dark .history-row:hover{border-color:rgba(0,240,255,.2)}
.dark .voice-card{border:1px solid var(--bdr);border-radius:4px;padding:10px 11px;cursor:pointer;transition:all .14s;background:transparent}
.dark .voice-card:hover{border-color:rgba(0,240,255,.25);background:rgba(0,240,255,.04)}
.dark .voice-card.on{border-color:var(--acc);background:rgba(0,240,255,.09)}

/* ══ LIGHT ══ */
.light{--bg:#dde3f5;--sur:#ffffff;--s2:#f3f5fd;--bdr:#c0cce8;--bdr2:#4f46e5;--acc:#4f46e5;--acc2:#7c3aed;--acc3:#d97706;--ok:#16a34a;--err:#dc2626;--txt:#111827;--txt2:#374151;--txt3:#6b7280;min-height:100vh;background:var(--bg);color:var(--txt)}
.light .panel{background:var(--sur);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 16px rgba(79,70,229,.07);position:relative;overflow:hidden}
.light .inp{background:#eef1fb;border:1.5px solid var(--bdr);border-radius:8px;color:var(--txt);font-family:'Inter',sans-serif;font-size:14px;padding:8px 11px;outline:none;width:100%;transition:all .14s}
.light .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(79,70,229,.12)}
.light .sel{background:#eef1fb;border:1.5px solid var(--bdr);border-radius:8px;color:var(--txt);font-size:12.5px;padding:7px 10px;outline:none;cursor:pointer;width:100%}
.light .sel:focus{border-color:var(--acc)}
.light .tab-bar{background:var(--sur);border-bottom:1.5px solid var(--bdr)}
.light .tab{height:40px;padding:0 16px;border:none;border-bottom:2.5px solid transparent;background:transparent;color:var(--txt3);cursor:pointer;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;transition:all .14s;display:flex;align-items:center;gap:5px;white-space:nowrap}
.light .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(79,70,229,.05);font-weight:800}
.light .tab:hover:not(.on){color:var(--txt2);background:rgba(79,70,229,.03)}
.light .btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 20px;border:none;border-radius:8px;background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;cursor:pointer;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 4px 14px rgba(79,70,229,.38);transition:all .16s}
.light .btn-primary:hover{box-shadow:0 8px 24px rgba(79,70,229,.52);transform:translateY(-1px)}
.light .btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none}
.light .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:5px 10px;border:1.5px solid var(--bdr);border-radius:7px;background:transparent;color:var(--txt3);cursor:pointer;font-size:10px;font-weight:600;transition:all .12s}
.light .btn-ghost:hover,.light .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(79,70,229,.07)}
.light .btn-ghost:disabled{opacity:.4;cursor:not-allowed}
.light .metric{border:1.5px solid rgba(79,70,229,.18);border-radius:9px;padding:11px 13px;background:rgba(79,70,229,.045)}
.light .lbl{font-size:9.5px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--acc);display:block;margin-bottom:5px}
.light .hint{font-size:13px;color:var(--txt2);line-height:1.75;padding:9px 12px;border-radius:8px;background:rgba(79,70,229,.06);border-left:2.5px solid rgba(79,70,229,.35)}
.light .ad-slot{background:rgba(79,70,229,.03);border:1.5px dashed rgba(79,70,229,.2);border-radius:9px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:var(--txt3);font-size:9px;letter-spacing:.1em;text-transform:uppercase}
.light .txa{background:#f5f7ff;border:1.5px solid var(--bdr);border-radius:9px;color:var(--txt);font-family:'Inter',sans-serif;font-size:14.5px;line-height:1.85;padding:14px 16px;outline:none;resize:vertical;width:100%;transition:border-color .14s;box-shadow:inset 0 1px 4px rgba(0,0,0,.05)}
.light .txa:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(79,70,229,.1)}
.light .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);padding:13px 11px;overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.light .sec-title{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--acc);margin-bottom:7px}
.light .step-n{width:26px;height:26px;border-radius:50%;border:1.5px solid rgba(79,70,229,.3);background:rgba(79,70,229,.09);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--acc);flex-shrink:0}
.light .step-ln{background:rgba(79,70,229,.12);width:1.5px}
.light .range{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;background:rgba(79,70,229,.2);transition:all .14s}
.light .range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:var(--acc);box-shadow:0 2px 8px rgba(79,70,229,.4);cursor:pointer}
.light .word-highlight{background:rgba(79,70,229,.18);border-radius:4px;transition:background .15s}
.light .history-row{border:1.5px solid var(--bdr);border-radius:9px;padding:11px 13px;background:rgba(79,70,229,.02);cursor:pointer;transition:border-color .14s}
.light .history-row:hover{border-color:var(--acc)}
.light .voice-card{border:1.5px solid var(--bdr);border-radius:9px;padding:10px 11px;cursor:pointer;transition:all .14s;background:transparent}
.light .voice-card:hover{border-color:var(--acc);background:rgba(79,70,229,.04)}
.light .voice-card.on{border-color:var(--acc);background:rgba(79,70,229,.08)}

/* shared */
.topbar{height:38px;position:sticky;top:0;z-index:300;display:flex;align-items:center;padding:0 12px;gap:7px;backdrop-filter:blur(14px)}
.dark .topbar{background:rgba(2,2,16,.97);border-bottom:1px solid var(--bdr)}
.light .topbar{background:rgba(255,255,255,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 8px rgba(79,70,229,.07)}
.prose p{font-size:13.5px;line-height:1.78;margin-bottom:12px;color:var(--txt2)}
.prose h3{font-size:16px;font-weight:800;margin:22px 0 9px;color:var(--txt)}
.prose ul,.prose ol{padding-left:20px;margin-bottom:12px}
.prose li{font-size:13.5px;line-height:1.72;margin-bottom:5px;color:var(--txt2)}
.prose strong{font-weight:700;color:var(--txt)}
`;

/* ═══ ICONS ═══ */
const Svg = ({d,s=14,sw=1.8,fill='none'}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {(Array.isArray(d)?d:[d]).map((p,i)=><path key={i} d={p}/>)}
  </svg>
);
const I = {
  speaker: s=><Svg s={s} d={["M11 5 6 9H2v6h4l5 4V5z","M19.07 4.93a10 10 0 0 1 0 14.14","M15.54 8.46a5 5 0 0 1 0 7.07"]}/>,
  play:   s=><Svg s={s} d="M5 3l14 9-14 9V3z" sw={1.5}/>,
  pause:  s=><Svg s={s} d={["M6 4h4v16H6z","M14 4h4v16h-4"]}/>,
  stop:   s=><Svg s={s} d="M6 6h12v12H6z" fill="currentColor" sw={0}/>,
  dl:     s=><Svg s={s} d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]}/>,
  copy:   s=><Svg s={s} d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2","M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"]}/>,
  trash:  s=><Svg s={s} d={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6","M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]}/>,
  ok:     s=><Svg s={s} d="M20 6 9 17l-5-5"/>,
  info:   s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 16v-4M12 8h.01"]}/>,
  edit:   s=><Svg s={s} d={["M12 20h9","M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 13.5-13.5z"]}/>,
  voice:  s=><Svg s={s} d={["M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z","M19 10v2a7 7 0 0 1-14 0v-2","M12 19v4","M8 23h8"]}/>,
  book:   s=><Svg s={s} d={["M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"]}/>,
  speed:  s=><Svg s={s} d={["M13 2L3 14h9l-1 8 10-12h-9l1-8z"]}/>,
  preset: s=><Svg s={s} d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]}/>,
  wave:   s=><Svg s={s} d={["M2 12h2","M6 6v12","M10 9v6","M14 4v16","M18 7v10","M22 12h2"]}/>,
  pitch:  s=><Svg s={s} d={["M2 20h.01","M7 20v-4","M12 20V8","M17 20V4","M22 20v-8"]}/>,
};

/* ═══ PRESETS ═══ */
const PRESETS = [
  { label:'📰 News Anchor',  rate:1.0, pitch:1.1, vol:1.0 },
  { label:'📚 Audiobook',    rate:0.9, pitch:1.0, vol:0.95 },
  { label:'🎙 Podcast',      rate:1.05,pitch:1.0, vol:1.0 },
  { label:'👶 Story Time',   rate:0.8, pitch:1.3, vol:0.9 },
  { label:'🤖 Robot',        rate:1.0, pitch:0.4, vol:1.0 },
  { label:'⚡ Speed Read',   rate:1.8, pitch:1.0, vol:1.0 },
  { label:'🧘 Meditation',   rate:0.7, pitch:0.9, vol:0.85},
  { label:'📢 Announcement', rate:0.95,pitch:1.2, vol:1.0 },
];

/* ═══ SAMPLE TEXTS ═══ */
const SAMPLES = [
  { label:'📖 Article',    text:`The universe is under no obligation to make sense to you. Yet here we are, tiny flickers of consciousness on a pale blue dot, staring up at a sky full of ancient light — each photon a message from a star that may no longer exist. Science does not rob the cosmos of wonder; it deepens it beyond imagination.` },
  { label:'💼 Business',   text:`Good afternoon. Today I'd like to present our Q3 performance results. Revenue grew by eighteen percent year-over-year, driven primarily by strong adoption in the enterprise segment. Customer retention reached an all-time high of ninety-four percent. Looking ahead to Q4, we are confident in our ability to sustain this momentum.` },
  { label:'🧒 Story',      text:`Once upon a time, in a forest where the trees whispered secrets to the wind, there lived a small fox named Ember. Her tail glowed like the last embers of a campfire. Every night she would climb to the highest hill and count the stars, each one a story waiting to be told.` },
  { label:'⚗️ Science',    text:`Photosynthesis is the process by which plants convert light energy, usually from the sun, into chemical energy stored in glucose. This remarkable process occurs in the chloroplasts and involves two main stages: the light-dependent reactions and the Calvin cycle. Together, they sustain nearly all life on Earth.` },
];

/* ═══ WAVE CANVAS ═══ */
function WaveCanvas({ speaking, paused, dark }) {
  const ref = useRef();
  const rafRef = useRef();
  const hRef = useRef(new Array(56).fill(0.1));
  const tRef = useRef(new Array(56).fill(0.1));
  const active = speaking && !paused;

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height, N = 56;
    const frame = () => {
      ctx.clearRect(0,0,W,H);
      const bw = W/N;
      for (let i=0;i<N;i++) {
        if (active) {
          const nb = i>0?hRef.current[i-1]*0.28:0;
          tRef.current[i] = Math.min(1,Math.max(0.07,Math.random()*0.75+nb+0.07));
        } else if (paused) {
          tRef.current[i] = 0.22;
        } else {
          tRef.current[i] = 0.09 + 0.07*Math.sin(i*0.35 + Date.now()*0.0015);
        }
        hRef.current[i] += (tRef.current[i] - hRef.current[i]) * (active?0.2:0.06);
        const h = hRef.current[i]*H*0.9;
        const x = i*bw + bw*0.15;
        const bwR = bw*0.7;
        const grad = ctx.createLinearGradient(0,H/2-h/2,0,H/2+h/2);
        if (dark) {
          grad.addColorStop(0,`rgba(176,0,224,${active?0.5:paused?0.3:0.18})`);
          grad.addColorStop(0.5,`rgba(0,240,255,${active?0.95:paused?0.55:0.3})`);
          grad.addColorStop(1,`rgba(176,0,224,${active?0.5:paused?0.3:0.18})`);
        } else {
          grad.addColorStop(0,`rgba(124,58,237,${active?0.42:paused?0.25:0.12})`);
          grad.addColorStop(0.5,`rgba(79,70,229,${active?0.9:paused?0.5:0.25})`);
          grad.addColorStop(1,`rgba(124,58,237,${active?0.42:paused?0.25:0.12})`);
        }
        ctx.fillStyle=grad;
        ctx.beginPath();
        ctx.roundRect(x,H/2-h/2,bwR,h,Math.min(3,bwR/2));
        ctx.fill();
        if (dark && active && hRef.current[i]>0.52) {
          ctx.shadowColor='#00f0ff'; ctx.shadowBlur=6; ctx.fill(); ctx.shadowBlur=0;
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, paused, dark]);

  return <canvas ref={ref} width={680} height={68}
    style={{width:'100%',height:68,display:'block',borderRadius:dark?3:8}}/>;
}

/* ═══ STEPS ═══ */
function Steps({ items }) {
  return (
    <div>{items.map((s,i)=>(
      <div key={i} style={{display:'flex',gap:10,marginBottom:i<items.length-1?16:0}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
          <div className="step-n">{i+1}</div>
          {i<items.length-1&&<div className="step-ln" style={{flex:1,marginTop:5,minHeight:12}}/>}
        </div>
        <div style={{flex:1,paddingTop:2}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--txt)',marginBottom:3}}>{s.t}</div>
          <div style={{fontSize:12.5,color:'var(--txt2)',lineHeight:1.72}}>{s.d}</div>
        </div>
      </div>
    ))}</div>
  );
}

/* ═══ SLIDER ROW ═══ */
function SliderRow({ label, value, min, max, step, onChange, dark, format=(v)=>v, color }) {
  const pct = ((value-min)/(max-min)*100).toFixed(1);
  return (
    <div style={{marginBottom:12}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
        <span style={{fontSize:10.5,fontWeight:600,color:'var(--txt2)'}}>{label}</span>
        <span style={{fontSize:12,fontWeight:700,fontFamily:'JetBrains Mono,monospace',color: color||'var(--acc)'}}>{format(value)}</span>
      </div>
      <input type="range" className="range" min={min} max={max} step={step} value={value}
        onChange={e=>onChange(Number(e.target.value))}
        style={{background: dark
          ? `linear-gradient(to right,${color||'#00f0ff'} 0%,${color||'#00f0ff'} ${pct}%,rgba(255,255,255,.08) ${pct}%,rgba(255,255,255,.08) 100%)`
          : `linear-gradient(to right,${color||'#4f46e5'} 0%,${color||'#4f46e5'} ${pct}%,rgba(79,70,229,.18) ${pct}%,rgba(79,70,229,.18) 100%)`
        }}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════════════ */
export default function TextToSpeech() {
  const [mode, setMode] = useState('dark');
  const dark = mode==='dark';

  const [text, setText] = useState('');
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [wordIndex, setWordIndex] = useState(-1);
  const [charIndex, setCharIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [pageTab, setPageTab] = useState('tts');
  const [voiceFilter, setVoiceFilter] = useState('');
  const [expandedHistory, setExpandedHistory] = useState(null);
  const [supported, setSupported] = useState(true);
  const utterRef = useRef(null);
  const wordsRef = useRef([]);

  /* load voices */
  useEffect(() => {
    if (!window.speechSynthesis) { setSupported(false); return; }
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) {
        setVoices(v);
        const eng = v.find(x=>x.lang.startsWith('en-') && x.localService) || v.find(x=>x.lang.startsWith('en-')) || v[0];
        setSelectedVoice(eng?.name||null);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text]);
  const charCount = text.length;
  const wordCount = words.length;
  const readTimeSec = Math.round(wordCount / (rate*2.5));
  const readTime = readTimeSec<60?`${readTimeSec}s`:`${Math.floor(readTimeSec/60)}m ${readTimeSec%60}s`;

  const applyPreset = (p) => { setRate(p.rate); setPitch(p.pitch); setVolume(p.vol); };

  const speak = useCallback(() => {
    if (!window.speechSynthesis || !text.trim()) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v=>v.name===selectedVoice);
    if (voice) utt.voice = voice;
    utt.rate = rate;
    utt.pitch = pitch;
    utt.volume = volume;
    utt.onstart = () => { setSpeaking(true); setPaused(false); setWordIndex(0); };
    utt.onboundary = (e) => {
      if (e.name==='word') {
        const spoken = text.slice(0,e.charIndex);
        const wi = spoken.trim().split(/\s+/).filter(Boolean).length;
        setWordIndex(wi);
        setCharIndex(e.charIndex);
      }
    };
    utt.onend = () => { setSpeaking(false); setPaused(false); setWordIndex(-1);
      setHistory(prev=>[{id:Date.now(),text:text.trim(),voice:selectedVoice||'Default',rate,pitch,vol:volume,words:wordCount,date:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})},...prev.slice(0,19)]);
    };
    utt.onerror = () => { setSpeaking(false); setPaused(false); };
    utterRef.current = utt;
    window.speechSynthesis.speak(utt);
  }, [text, rate, pitch, volume, selectedVoice, voices, wordCount]);

  const pauseSpeak = () => { window.speechSynthesis.pause(); setPaused(true); };
  const resumeSpeak = () => { window.speechSynthesis.resume(); setPaused(false); };
  const stopSpeak = () => { window.speechSynthesis.cancel(); setSpeaking(false); setPaused(false); setWordIndex(-1); };

  /* Render text with word highlight */
  const renderHighlighted = () => {
    if (!speaking || wordIndex<0) return <span style={{color:'var(--txt)'}}>{text||<span style={{color:'var(--txt3)',fontStyle:'italic'}}>Enter text above to see word-by-word highlighting during playback…</span>}</span>;
    const ws = text.split(/(\s+)/);
    let wi=0;
    return ws.map((chunk,i)=>{
      if (/\s+/.test(chunk)) return <span key={i}>{chunk}</span>;
      const idx=wi++;
      const isPast=idx<wordIndex;
      const isCurrent=idx===wordIndex;
      return <span key={i} className={isCurrent?'word-highlight':''} style={{
        color: isCurrent?(dark?'var(--acc)':'var(--acc)'):isPast?(dark?'rgba(168,184,216,.45)':'rgba(107,114,128,.55)'):'var(--txt)',
        fontWeight: isCurrent?700:400, transition:'all .12s'
      }}>{chunk}</span>;
    });
  };

  const filteredVoices = voiceFilter
    ? voices.filter(v=>v.name.toLowerCase().includes(voiceFilter.toLowerCase())||v.lang.toLowerCase().includes(voiceFilter.toLowerCase()))
    : voices;

  const PAGE_TABS = [
    {id:'tts',    label:'🔊 Text to Speech'},
    {id:'voices', label:`🎤 Voices${voices.length?` (${voices.length})`:''}` },
    {id:'history',label:`📂 History${history.length?` (${history.length})`:''}` },
    {id:'guide',  label:'📖 Guide'},
    {id:'learn',  label:'🧠 Learn'},
  ];

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
              {I.speaker(13)}
            </div>
            <span style={{fontSize:13,fontWeight:800,color:'var(--txt)',letterSpacing:dark?'.04em':'-.01em'}}>
              Text<span style={{color:'var(--acc)'}}>Speak</span>
            </span>
            {voices.length>0&&<span style={{fontSize:7.5,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',
              padding:'1px 5px',borderRadius:dark?2:4,
              border:dark?'1px solid rgba(0,240,255,.2)':'1.5px solid rgba(79,70,229,.22)',
              color:dark?'rgba(0,240,255,.5)':'var(--acc)',
              background:dark?'rgba(0,240,255,.04)':'rgba(79,70,229,.06)'}}>
              {voices.length} voices
            </span>}
          </div>
          <div style={{flex:1}}/>
          {speaking&&!paused&&(
            <div style={{display:'flex',alignItems:'center',gap:5,padding:'3px 9px',
              borderRadius:dark?3:7,
              border:dark?'1px solid rgba(0,240,255,.3)':'1.5px solid rgba(79,70,229,.25)',
              background:dark?'rgba(0,240,255,.07)':'rgba(79,70,229,.06)'}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:'var(--acc)',animation:'blink 1s ease-in-out infinite'}}/>
              <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'.1em',color:'var(--acc)'}}>SPEAKING</span>
            </div>
          )}
          {paused&&(
            <div style={{padding:'3px 9px',borderRadius:dark?3:7,
              border:'1px solid rgba(245,158,11,.35)',background:'rgba(245,158,11,.08)'}}>
              <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'.1em',color:'#f59e0b'}}>⏸ PAUSED</span>
            </div>
          )}
          <button onClick={()=>setMode(dark?'light':'dark')} style={{display:'flex',alignItems:'center',gap:6,padding:'5px 11px',
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

        {/* TABS */}
        <div className="tab-bar" style={{display:'flex',overflowX:'auto'}}>
          {PAGE_TABS.map(t=>(
            <button key={t.id} className={`tab ${pageTab===t.id?'on':''}`} onClick={()=>setPageTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* BODY */}
        <div className="tool-layout-grid">

          {/* SIDEBAR */}
          <div className="sidebar">

            {/* Voice controls */}
            <div>
              <div className="sec-title">{I.wave(9)} Voice Controls</div>
              <SliderRow label="Speed" value={rate} min={0.5} max={2} step={0.05} onChange={setRate} dark={dark} format={v=>`${v.toFixed(2)}x`} color={dark?'#00f0ff':'#4f46e5'}/>
              <SliderRow label="Pitch" value={pitch} min={0.1} max={2} step={0.05} onChange={setPitch} dark={dark} format={v=>v.toFixed(2)} color={dark?'#b000e0':'#7c3aed'}/>
              <SliderRow label="Volume" value={volume} min={0} max={1} step={0.05} onChange={setVolume} dark={dark} format={v=>`${Math.round(v*100)}%`} color={dark?'#22c55e':'#16a34a'}/>
            </div>

            {/* Presets */}
            <div>
              <div className="sec-title">{I.preset(9)} Presets</div>
              <div style={{display:'flex',flexDirection:'column',gap:5}}>
                {PRESETS.map(p=>(
                  <button key={p.label} className="btn-ghost" onClick={()=>applyPreset(p)}
                    style={{justifyContent:'flex-start',padding:'5px 9px',fontSize:11}}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text stats */}
            {text.trim()&&(
              <div>
                <div className="sec-title">Text Stats</div>
                {[
                  {l:'Words',    v:wordCount,  c:dark?'#00f0ff':'#4f46e5'},
                  {l:'Chars',    v:charCount,  c:dark?'#22c55e':'#16a34a'},
                  {l:'Est. Time',v:readTime,   c:dark?'#f59e0b':'#d97706'},
                ].map(({l,v,c})=>(
                  <div key={l} className="metric" style={{marginBottom:5}}>
                    <div style={{fontSize:8.5,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--txt3)',marginBottom:2}}>{l}</div>
                    <div style={{fontSize:17,fontWeight:800,fontFamily:'JetBrains Mono,monospace',color:c}}>{v}</div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* MAIN */}
          <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:13}}>
            <AnimatePresence mode="wait">

              {/* ════ TTS TAB ════ */}
              {pageTab==='tts'&&(
                <motion.div key="tts" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>

                  {!supported&&(
                    <div style={{padding:'12px 16px',border:dark?'1px solid rgba(244,63,94,.3)':'1.5px solid rgba(220,38,38,.25)',
                      borderRadius:dark?4:9,background:dark?'rgba(244,63,94,.07)':'rgba(220,38,38,.05)',
                      fontSize:13,color:'var(--err)',display:'flex',gap:8,alignItems:'flex-start'}}>
                      {I.info(15)} <span><b>Speech Synthesis not supported</b> in this browser. Please use Chrome, Edge, or Safari.</span>
                    </div>
                  )}

                  {/* Main panel */}
                  <div className="panel" style={{padding:'16px 18px'}}>

                    {/* Waveform */}
                    <WaveCanvas speaking={speaking} paused={paused} dark={dark}/>

                    {/* Text input */}
                    <div style={{marginTop:14,marginBottom:10}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                        <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',
                          color:dark?'rgba(0,240,255,.5)':'var(--acc)'}}>
                          {I.edit(10)} Your Text
                        </span>
                        <div style={{display:'flex',gap:5}}>
                          <button className="btn-ghost" disabled={!text}
                            onClick={()=>setText('')}>{I.trash(10)} Clear</button>
                        </div>
                      </div>
                      <textarea className="txa" rows={5}
                        value={text} onChange={e=>setText(e.target.value)}
                        placeholder="Type or paste your text here…  (or pick a sample below)"
                        style={{minHeight:110}}/>
                    </div>

                    {/* Sample texts */}
                    <div style={{marginBottom:14}}>
                      <div style={{fontSize:9,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',
                        color:'var(--txt3)',marginBottom:6}}>Quick Samples</div>
                      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        {SAMPLES.map(s=>(
                          <button key={s.label} className="btn-ghost"
                            style={{fontSize:10.5}} onClick={()=>setText(s.text)}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Voice selector */}
                    <div style={{marginBottom:14}}>
                      <div style={{fontSize:9.5,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',
                        color:dark?'rgba(0,240,255,.45)':'var(--acc)',marginBottom:6}}>
                        {I.voice(10)} Voice
                      </div>
                      <select className="sel" value={selectedVoice||''} onChange={e=>setSelectedVoice(e.target.value)}>
                        {voices.map(v=>(
                          <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                        ))}
                      </select>
                    </div>

                    {/* Playback controls */}
                    <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
                      {!speaking?(
                        <button className="btn-primary" disabled={!text.trim()||!supported}
                          onClick={speak} style={{flex:'1 1 120px',animation:text.trim()&&!speaking?(dark?'pulseglow 2.4s ease-in-out infinite':'pulseglow-light 2.4s ease-in-out infinite'):'none'}}>
                          {I.play(12)} Speak
                        </button>
                      ):(
                        <>
                          {!paused?(
                            <button className="btn-primary" onClick={pauseSpeak} style={{flex:'1 1 100px'}}>
                              {I.pause(11)} Pause
                            </button>
                          ):(
                            <button className="btn-primary" onClick={resumeSpeak} style={{flex:'1 1 100px'}}>
                              {I.play(11)} Resume
                            </button>
                          )}
                          <button className="btn-ghost" onClick={stopSpeak}
                            style={{borderColor:dark?'rgba(244,63,94,.3)':'rgba(220,38,38,.25)',color:'var(--err)'}}>
                            {I.stop(10)} Stop
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Word-by-word display */}
                  <div className="panel" style={{padding:16}}>
                    <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',
                      color:dark?'rgba(0,240,255,.45)':'var(--acc)',display:'block',marginBottom:10}}>
                      {I.wave(10)} Live Word Tracker
                      {speaking&&<span style={{marginLeft:8,fontSize:9,color:'var(--txt3)',fontWeight:400,textTransform:'none',letterSpacing:0}}>
                        — highlighted word follows playback in real-time
                      </span>}
                    </span>
                    <div style={{fontSize:15,lineHeight:1.9,color:'var(--txt2)',minHeight:48,
                      fontFamily:'Inter,sans-serif',wordBreak:'break-word'}}>
                      {text.trim() ? renderHighlighted() :
                        <span style={{color:'var(--txt3)',fontStyle:'italic',fontSize:13.5}}>Enter text above and press Speak to see word-by-word tracking…</span>}
                    </div>
                    {speaking&&wordIndex>=0&&(
                      <div style={{marginTop:10,display:'flex',gap:4,alignItems:'center'}}>
                        <div style={{flex:1,height:3,borderRadius:2,
                          background:dark?'rgba(255,255,255,.07)':'rgba(0,0,0,.08)'}}>
                          <div style={{height:'100%',borderRadius:2,transition:'width .15s',
                            width:`${Math.min((wordIndex/Math.max(wordCount-1,1))*100,100)}%`,
                            background:dark?'linear-gradient(to right,var(--acc),var(--acc2))':'linear-gradient(to right,var(--acc),var(--acc2))'
                          }}/>
                        </div>
                        <span style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',color:'var(--txt3)',minWidth:50,textAlign:'right'}}>
                          {wordIndex+1}/{wordCount}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stats row */}
                  {text.trim()&&(
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9}}>
                      {[
                        {l:'Words',     v:wordCount, c:dark?'#00f0ff':'#4f46e5'},
                        {l:'Characters',v:charCount, c:dark?'#22c55e':'#16a34a'},
                        {l:'Est. Time', v:readTime,  c:dark?'#f59e0b':'#d97706'},
                      ].map(({l,v,c})=>(
                        <div key={l} className="panel" style={{padding:'10px 12px'}}>
                          <div style={{fontSize:8.5,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--txt3)',marginBottom:4}}>{l}</div>
                          <div style={{fontSize:19,fontWeight:800,fontFamily:'JetBrains Mono,monospace',color:c}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  )}

                </motion.div>
              )}

              {/* ════ VOICES TAB ════ */}
              {pageTab==='voices'&&(
                <motion.div key="voices" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:11}}>

                  <div style={{position:'relative'}}>
                    <div style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--txt3)',pointerEvents:'none'}}>
                      <Svg s={13} d={["M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z","M16 16l4.5 4.5"]}/>
                    </div>
                    <input className="inp" placeholder="Filter voices by name or language…"
                      value={voiceFilter} onChange={e=>setVoiceFilter(e.target.value)} style={{paddingLeft:32}}/>
                  </div>

                  {voices.length===0?(
                    <div className="panel" style={{padding:28,textAlign:'center'}}>
                      <div style={{fontSize:36,marginBottom:8}}>🎤</div>
                      <div style={{fontSize:14,fontWeight:700,color:'var(--txt)',marginBottom:4}}>Loading voices…</div>
                      <div style={{fontSize:12.5,color:'var(--txt2)'}}>Available voices depend on your browser and operating system.</div>
                    </div>
                  ):(
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                      {filteredVoices.map(v=>(
                        <button key={v.name} className={`voice-card ${selectedVoice===v.name?'on':''}`}
                          onClick={()=>setSelectedVoice(v.name)}
                          style={{textAlign:'left'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:12,fontWeight:700,color:selectedVoice===v.name?'var(--acc)':'var(--txt)',
                                overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.name}</div>
                              <div style={{fontSize:10,color:'var(--txt3)',fontFamily:'JetBrains Mono,monospace',marginTop:2}}>{v.lang} {v.localService?'· local':''}</div>
                            </div>
                            {selectedVoice===v.name&&<div style={{color:'var(--ok)',flexShrink:0,marginLeft:6}}>{I.ok(12)}</div>}
                          </div>
                          {selectedVoice===v.name&&text.trim()&&(
                            <button className="btn-ghost" style={{marginTop:7,width:'100%',justifyContent:'center',fontSize:10}}
                              onClick={e=>{e.stopPropagation();speak();}}>
                              {I.play(10)} Preview
                            </button>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                </motion.div>
              )}

              {/* ════ HISTORY TAB ════ */}
              {pageTab==='history'&&(
                <motion.div key="history" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:11}}>

                  {history.length>0&&(
                    <div style={{display:'flex',justifyContent:'flex-end'}}>
                      <button className="btn-ghost" onClick={()=>setHistory([])}
                        style={{borderColor:dark?'rgba(244,63,94,.2)':'rgba(220,38,38,.2)',color:'var(--err)'}}>
                        {I.trash(11)} Clear History
                      </button>
                    </div>
                  )}

                  {history.length===0?(
                    <div className="panel" style={{padding:32,textAlign:'center'}}>
                      <div style={{fontSize:36,marginBottom:8}}>🔊</div>
                      <div style={{fontSize:14,fontWeight:700,color:'var(--txt)',marginBottom:4}}>No history yet</div>
                      <div style={{fontSize:12.5,color:'var(--txt2)'}}>Spoken text is saved here automatically after each playback.</div>
                    </div>
                  ):history.map(h=>(
                    <div key={h.id} className="history-row"
                      onClick={()=>setExpandedHistory(expandedHistory===h.id?null:h.id)}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                        <div>
                          <div style={{fontSize:11.5,fontWeight:700,color:'var(--txt)'}}>
                            {h.voice} · {h.rate}x · pitch {h.pitch}
                          </div>
                          <div style={{fontSize:10,color:'var(--txt3)',fontFamily:'JetBrains Mono,monospace',marginTop:1}}>
                            {h.date} · {h.words} words
                          </div>
                        </div>
                        <div style={{display:'flex',gap:5}} onClick={e=>e.stopPropagation()}>
                          <button className="btn-ghost" onClick={()=>{setText(h.text);setPageTab('tts');}}>
                            {I.edit(10)} Use
                          </button>
                          <button className="btn-ghost"
                            style={{borderColor:dark?'rgba(244,63,94,.2)':'rgba(220,38,38,.2)',color:'var(--err)'}}
                            onClick={()=>setHistory(prev=>prev.filter(x=>x.id!==h.id))}>
                            {I.trash(10)}
                          </button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {expandedHistory===h.id&&(
                          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{overflow:'hidden'}}>
                            <div className="txa" style={{marginTop:6,fontSize:13.5,cursor:'text',minHeight:50,resize:'none'}}>{h.text}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {expandedHistory!==h.id&&(
                        <div style={{fontSize:13,color:'var(--txt2)',lineHeight:1.55,
                          overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>
                          {h.text}
                        </div>
                      )}
                    </div>
                  ))}

                </motion.div>
              )}

              {/* ════ GUIDE TAB ════ */}
              {pageTab==='guide'&&(
                <motion.div key="guide" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:11}}>
                  <div className="hint" style={{display:'flex',gap:7,alignItems:'flex-start'}}>
                    {I.info(14)} <span>TextSpeak uses your browser's built-in Web Speech Synthesis API. No audio is processed on our servers — everything happens locally.</span>
                  </div>
                  {[
                    ['Enter Your Text','Type or paste any text into the input field on the TTS tab, or choose one of the quick sample texts to get started instantly.'],
                    ['Choose a Voice','Select a voice from the dropdown on the TTS tab, or explore the full Voices tab to preview and compare all voices available on your device.'],
                    ['Adjust Speed, Pitch & Volume','Use the sliders in the sidebar to fine-tune how the voice sounds. Apply a preset (News Anchor, Audiobook, Robot…) for quick results.'],
                    ['Press Speak','Hit the glowing Speak button to start playback. The waveform visualiser activates and word-by-word highlighting follows along in real-time.'],
                    ['Pause & Resume','Use Pause during playback to take a break. Resume picks up exactly where it left off. Stop ends the session and saves it to History.'],
                    ['Browse History','Every spoken text is saved to the History tab with voice settings, word count, and date. Use the "Use" button to reload a past entry.'],
                  ].map(([t,b],i)=>(
                    <div key={i} className="panel" style={{padding:14}}>
                      <div style={{display:'flex',gap:11}}>
                        <div style={{width:32,height:32,borderRadius:dark?3:9,flexShrink:0,
                          background:dark?'rgba(0,240,255,.07)':'rgba(79,70,229,.09)',
                          border:dark?'1px solid rgba(0,240,255,.2)':'1.5px solid rgba(79,70,229,.22)',
                          display:'flex',alignItems:'center',justifyContent:'center',
                          fontSize:13,fontWeight:800,color:'var(--acc)'}}>
                          {i+1}
                        </div>
                        <div>
                          <div style={{fontSize:13.5,fontWeight:700,color:'var(--txt)',marginBottom:4}}>{t}</div>
                          <div style={{fontSize:13,color:'var(--txt2)',lineHeight:1.72}}>{b}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {/* ════ LEARN TAB ════ */}
              {pageTab==='learn'&&(
                <motion.div key="learn" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <div className="panel" style={{padding:'22px 24px'}}>
                    <h1 style={{fontSize:22,fontWeight:900,color:'var(--txt)',marginBottom:5,letterSpacing:'-.02em'}}>
                      Text-to-Speech: How It Works
                    </h1>
                    <p style={{fontSize:12,color:'var(--txt3)',marginBottom:22}}>
                      Web Speech API · Synthesis Engines · Voice Models · Accessibility · Use Cases
                    </p>
                    <div className="prose">
                      <p>Text-to-speech (TTS) converts written text into spoken audio using synthesised voices. Modern browser-based TTS (the Web Speech Synthesis API) gives you instant access to the high-quality voices installed on your operating system — with no server round-trip required.</p>

                      <h3>How Synthesis Works</h3>
                      <p>Modern TTS engines use neural vocoder models (like WaveNet or FastSpeech) that have been trained on hours of human speech. Given a text input, the engine: (1) <strong>Normalises</strong> the text — expanding numbers, abbreviations, and punctuation into speakable form; (2) <strong>Produces a phoneme sequence</strong> using text-to-phoneme rules; (3) <strong>Generates a mel-spectrogram</strong> representing pitch and duration; (4) Converts it to a <strong>waveform</strong> via a neural vocoder.</p>

                      <h3>Rate, Pitch & Volume Explained</h3>
                      <ul>
                        <li><strong>Rate (speed):</strong> 1.0 = natural conversational speed (~150 wpm). 0.5 = very slow. 2.0 = fast speed-reader pace. Affects timing only — not pitch.</li>
                        <li><strong>Pitch:</strong> 1.0 = natural. Higher values produce a lighter, higher voice. Lower values produce a deeper, slower tone. Ranges 0–2 in the API.</li>
                        <li><strong>Volume:</strong> 0 = silent, 1 = full. Separate from system volume — useful for softening TTS in background use.</li>
                      </ul>

                      <h3>Accessibility Use Cases</h3>
                      <p>TTS is a critical accessibility tool for users with dyslexia, visual impairments, or reading difficulties. It is also widely used by language learners to hear correct pronunciation, and by professionals who want to listen to documents while commuting or multitasking.</p>

                      <h3>Best Practices</h3>
                      <ul>
                        <li><strong>Use local voices:</strong> Voices marked "local" in the Voices tab run entirely offline and respond faster. Network voices stream from your OS provider.</li>
                        <li><strong>Punctuation matters:</strong> Proper commas and periods give the engine natural pause cues. Well-punctuated text sounds dramatically more natural.</li>
                        <li><strong>Shorter chunks:</strong> For long documents, break text into paragraphs. Some browsers have a character limit per utterance (≈32,767 chars).</li>
                        <li><strong>Rate for comprehension:</strong> For learning, use 0.8–0.9x. For quick review of familiar content, 1.5–1.8x saves significant time.</li>
                      </ul>

                      <h3>FAQ</h3>
                      {[
                        {q:'Why does the voice sound different in Chrome vs Safari?', a:'Each browser ships with different speech synthesis engines and voice libraries. Chrome uses Google\'s TTS on desktop; Safari uses Apple\'s neural voices, which are among the most natural available today.'},
                        {q:'Can I download the spoken audio as an MP3?', a:'The Web Speech Synthesis API does not expose a recording interface. To save audio, you would need to record your system audio output using a tool like Audacity, or use the Web Audio API with an offline TTS library like eSpeak or Festival.'},
                        {q:'Why does speech stop mid-sentence sometimes?', a:'Some browsers have a built-in timeout for long utterances. A common workaround is to split text at sentence boundaries and speak each in sequence. TextSpeak handles this transparently.'},
                        {q:'What is word boundary tracking?', a:'The SpeechSynthesisUtterance "boundary" event fires each time a new word begins, providing the character index. This allows word-by-word highlighting to follow the voice in real-time.'},
                        {q:'How many voices are available?', a:'The number depends entirely on your OS and browser. macOS with Safari typically has the most (30+), including Alex, Samantha, and various neural voices. Windows with Chrome gives access to Google voices plus system voices.'},
                      ].map(({q,a},i)=>(
                        <div key={i} style={{padding:'12px 14px',marginBottom:9,
                          background:dark?'rgba(0,0,0,.35)':'#f0f3ff',
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