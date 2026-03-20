import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   VOICE RECORDER — Dual Theme (Dark Amber / Light Slate)
   Series architecture: topbar · tabs · sidebar · main · ads
═══════════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{overflow-x:hidden;font-family:'Space Grotesk',sans-serif}

@keyframes scanline{0%{top:-3px}100%{top:102%}}
@keyframes gridpulse{from{background-position:0 0}to{background-position:30px 30px}}
@keyframes fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes amber-pulse{0%,100%{box-shadow:0 0 20px rgba(251,191,36,.12),0 0 50px rgba(251,191,36,.04)}50%{box-shadow:0 0 38px rgba(251,191,36,.5),0 0 90px rgba(251,191,36,.15)}}
@keyframes red-pulse{0%,100%{box-shadow:0 0 20px rgba(239,68,68,.18)}50%{box-shadow:0 0 40px rgba(239,68,68,.6),0 0 80px rgba(239,68,68,.2)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes ripple{0%{transform:scale(1);opacity:.65}100%{transform:scale(3);opacity:0}}
@keyframes slide-in{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:none}}
.fadeup{animation:fadeup .24s ease both}

/* ══ DARK — AMBER TERMINAL ══════════════════════════════════════════ */
.dark{
  --bg:#0a0700;--sur:#110e00;--s2:#160e00;
  --bdr:#2a2000;--bdr2:rgba(251,191,36,.22);
  --acc:#fbbf24;--acc2:#f97316;--acc3:#ef4444;
  --ok:#4ade80;--err:#f87171;
  --txt:#fef9ec;--txt2:#c8b880;--txt3:#6b5c30;
  min-height:100vh;background:var(--bg);color:var(--txt);
  background-image:
    linear-gradient(rgba(251,191,36,.018) 1px,transparent 1px),
    linear-gradient(90deg,rgba(251,191,36,.018) 1px,transparent 1px);
  background-size:30px 30px;animation:gridpulse 20s linear infinite
}
.scanline{position:fixed;left:0;right:0;height:1.5px;pointer-events:none;z-index:9999;
  background:linear-gradient(90deg,transparent,rgba(251,191,36,.6),transparent);
  box-shadow:0 0 14px rgba(251,191,36,.35);animation:scanline 10s linear infinite;top:-3px}
.dark .panel{background:linear-gradient(150deg,var(--sur),var(--s2));
  border:1px solid var(--bdr);border-radius:4px;position:relative;overflow:hidden}
.dark .panel::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(251,191,36,.2),transparent);pointer-events:none}
.dark .panel::after{content:'';position:absolute;top:0;left:0;bottom:0;width:1px;
  background:linear-gradient(180deg,transparent,rgba(251,191,36,.1),transparent);pointer-events:none}
.dark .inp{background:rgba(0,0,0,.6);border:1px solid var(--bdr);border-radius:3px;
  color:var(--txt);font-family:'Space Mono',monospace;font-size:13px;font-weight:400;
  padding:8px 11px;outline:none;width:100%;transition:all .14s}
.dark .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(251,191,36,.1)}
.dark .inp::placeholder{color:var(--txt3)}
.dark .sel{background:rgba(0,0,0,.6);border:1px solid var(--bdr);border-radius:3px;
  color:var(--txt);font-family:'Space Mono',monospace;font-size:12px;
  padding:7px 10px;outline:none;cursor:pointer;width:100%}
.dark .sel:focus{border-color:var(--acc)}
.dark .sel option{background:#110e00}
.dark .tab-bar{background:var(--sur);border-bottom:1px solid var(--bdr)}
.dark .tab{height:38px;padding:0 15px;border:none;border-bottom:2px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;font-size:10.5px;font-weight:700;
  font-family:'Space Mono',monospace;letter-spacing:.06em;text-transform:uppercase;
  transition:all .14s;display:flex;align-items:center;gap:5px;white-space:nowrap}
.dark .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(251,191,36,.04)}
.dark .tab:hover:not(.on){color:var(--txt2)}
.dark .btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:9px 20px;border:1px solid var(--acc);border-radius:3px;
  background:rgba(251,191,36,.08);color:var(--acc);cursor:pointer;
  font-family:'Space Mono',monospace;font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  box-shadow:0 0 14px rgba(251,191,36,.08);transition:all .16s}
.dark .btn-primary:hover{background:rgba(251,191,36,.18);box-shadow:0 0 28px rgba(251,191,36,.28);transform:translateY(-1px)}
.dark .btn-primary:disabled{opacity:.3;cursor:not-allowed;transform:none}
.dark .btn-record{display:inline-flex;align-items:center;justify-content:center;gap:7px;
  padding:11px 24px;border:1px solid rgba(239,68,68,.6);border-radius:3px;
  background:rgba(239,68,68,.1);color:var(--err);cursor:pointer;
  font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  animation:red-pulse 2s ease-in-out infinite;transition:all .16s}
.dark .btn-record:hover{background:rgba(239,68,68,.22)}
.dark .btn-record.active{background:rgba(239,68,68,.15);animation:red-pulse 1s ease-in-out infinite}
.dark .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;
  padding:5px 10px;border:1px solid var(--bdr);border-radius:3px;
  background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'Space Mono',monospace;font-size:9.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  transition:all .12s}
.dark .btn-ghost:hover,.dark .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(251,191,36,.06)}
.dark .btn-ghost:disabled{opacity:.3;cursor:not-allowed}
.dark .metric{border:1px solid rgba(251,191,36,.14);border-radius:3px;padding:10px 12px;background:rgba(251,191,36,.04)}
.dark .lbl{font-size:9px;font-weight:700;font-family:'Space Mono',monospace;letter-spacing:.18em;text-transform:uppercase;color:rgba(251,191,36,.45);display:block;margin-bottom:5px}
.dark .hint{font-size:13px;color:var(--txt2);line-height:1.75;padding:9px 12px;border-radius:3px;
  background:rgba(251,191,36,.04);border-left:2px solid rgba(251,191,36,.3)}
.dark .ad-slot{background:rgba(251,191,36,.018);border:1px dashed rgba(251,191,36,.1);border-radius:3px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  color:var(--txt3);font-family:'Space Mono',monospace;font-size:8.5px;letter-spacing:.12em;text-transform:uppercase}
.dark .sidebar{border-right:1px solid var(--bdr);background:var(--sur);padding:12px 10px;
  overflow-y:auto;display:flex;flex-direction:column;gap:11px}
.dark .sec-title{font-size:8.5px;font-weight:700;font-family:'Space Mono',monospace;letter-spacing:.2em;
  text-transform:uppercase;color:rgba(251,191,36,.38);margin-bottom:7px}
.dark .rec-row{border:1px solid var(--bdr);border-radius:3px;padding:11px 13px;
  background:rgba(251,191,36,.02);transition:border-color .14s}
.dark .rec-row:hover{border-color:rgba(251,191,36,.2)}
.dark .step-n{width:24px;height:24px;border-radius:50%;border:1px solid rgba(251,191,36,.3);
  background:rgba(251,191,36,.07);display:flex;align-items:center;justify-content:center;
  font-family:'Space Mono',monospace;font-size:10px;font-weight:700;color:var(--acc);flex-shrink:0}
.dark .step-ln{background:rgba(251,191,36,.1);width:1.5px}
.dark .range{-webkit-appearance:none;appearance:none;width:100%;height:3px;border-radius:2px;outline:none;cursor:pointer}
.dark .range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:12px;height:12px;border-radius:50%;background:var(--acc);box-shadow:0 0 8px rgba(251,191,36,.5);cursor:pointer}
.dark .tag{display:inline-block;padding:2px 7px;border-radius:2px;font-size:10px;font-family:'Space Mono',monospace;font-weight:700;letter-spacing:.06em;border:1px solid rgba(251,191,36,.2);color:var(--txt2);background:rgba(251,191,36,.05)}

/* ══ LIGHT — COOL SLATE ══════════════════════════════════════════ */
.light{
  --bg:#e8eaf2;--sur:#ffffff;--s2:#f0f2fa;
  --bdr:#bfc8e2;--bdr2:#3b5bdb;
  --acc:#3b5bdb;--acc2:#7048e8;--acc3:#e03131;
  --ok:#2f9e44;--err:#e03131;
  --txt:#0f1117;--txt2:#2c3052;--txt3:#6c759b;
  min-height:100vh;background:var(--bg);color:var(--txt)
}
.light .panel{background:var(--sur);border:1.5px solid var(--bdr);border-radius:10px;
  box-shadow:0 2px 18px rgba(59,91,219,.07);position:relative;overflow:hidden}
.light .inp{background:#eceffe;border:1.5px solid var(--bdr);border-radius:7px;
  color:var(--txt);font-family:'Space Mono',monospace;font-size:13px;
  padding:8px 11px;outline:none;width:100%;transition:all .14s}
.light .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(59,91,219,.12)}
.light .sel{background:#eceffe;border:1.5px solid var(--bdr);border-radius:7px;
  color:var(--txt);font-family:'Space Mono',monospace;font-size:12px;
  padding:7px 10px;outline:none;cursor:pointer;width:100%}
.light .sel:focus{border-color:var(--acc)}
.light .tab-bar{background:var(--sur);border-bottom:1.5px solid var(--bdr)}
.light .tab{height:38px;padding:0 15px;border:none;border-bottom:2.5px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'Space Mono',monospace;font-size:10.5px;font-weight:700;letter-spacing:.05em;
  text-transform:uppercase;transition:all .14s;display:flex;align-items:center;gap:5px;white-space:nowrap}
.light .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(59,91,219,.05);font-weight:700}
.light .tab:hover:not(.on){color:var(--txt2);background:rgba(59,91,219,.03)}
.light .btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:9px 20px;border:none;border-radius:7px;
  background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;cursor:pointer;
  font-family:'Space Mono',monospace;font-size:10.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
  box-shadow:0 4px 14px rgba(59,91,219,.38);transition:all .16s}
.light .btn-primary:hover{box-shadow:0 8px 24px rgba(59,91,219,.52);transform:translateY(-1px)}
.light .btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none}
.light .btn-record{display:inline-flex;align-items:center;justify-content:center;gap:7px;
  padding:11px 24px;border:none;border-radius:7px;
  background:linear-gradient(135deg,#e03131,#c92a2a);color:#fff;cursor:pointer;
  font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  box-shadow:0 4px 16px rgba(224,49,49,.38);transition:all .16s}
.light .btn-record:hover{box-shadow:0 8px 24px rgba(224,49,49,.5);transform:translateY(-1px)}
.light .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;
  padding:5px 10px;border:1.5px solid var(--bdr);border-radius:6px;
  background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'Space Mono',monospace;font-size:9.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
  transition:all .12s}
.light .btn-ghost:hover,.light .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(59,91,219,.07)}
.light .btn-ghost:disabled{opacity:.4;cursor:not-allowed}
.light .metric{border:1.5px solid rgba(59,91,219,.18);border-radius:8px;padding:10px 12px;background:rgba(59,91,219,.045)}
.light .lbl{font-size:9px;font-weight:700;font-family:'Space Mono',monospace;letter-spacing:.16em;text-transform:uppercase;color:var(--acc);display:block;margin-bottom:5px}
.light .hint{font-size:13px;color:var(--txt2);line-height:1.75;padding:9px 12px;border-radius:8px;
  background:rgba(59,91,219,.06);border-left:2.5px solid rgba(59,91,219,.35)}
.light .ad-slot{background:rgba(59,91,219,.03);border:1.5px dashed rgba(59,91,219,.2);border-radius:8px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  color:var(--txt3);font-family:'Space Mono',monospace;font-size:8.5px;letter-spacing:.12em;text-transform:uppercase}
.light .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);padding:12px 10px;
  overflow-y:auto;display:flex;flex-direction:column;gap:11px}
.light .sec-title{font-size:8.5px;font-weight:700;font-family:'Space Mono',monospace;letter-spacing:.2em;
  text-transform:uppercase;color:var(--acc);margin-bottom:7px}
.light .rec-row{border:1.5px solid var(--bdr);border-radius:8px;padding:11px 13px;
  background:rgba(59,91,219,.02);transition:border-color .14s}
.light .rec-row:hover{border-color:var(--acc)}
.light .step-n{width:24px;height:24px;border-radius:50%;border:1.5px solid rgba(59,91,219,.3);
  background:rgba(59,91,219,.09);display:flex;align-items:center;justify-content:center;
  font-family:'Space Mono',monospace;font-size:10px;font-weight:700;color:var(--acc);flex-shrink:0}
.light .step-ln{background:rgba(59,91,219,.12);width:1.5px}
.light .range{-webkit-appearance:none;appearance:none;width:100%;height:3px;border-radius:2px;outline:none;cursor:pointer;background:rgba(59,91,219,.18)}
.light .range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:12px;height:12px;border-radius:50%;background:var(--acc);box-shadow:0 2px 8px rgba(59,91,219,.4);cursor:pointer}
.light .tag{display:inline-block;padding:2px 7px;border-radius:5px;font-size:10px;font-family:'Space Mono',monospace;font-weight:700;letter-spacing:.05em;border:1.5px solid rgba(59,91,219,.2);color:var(--txt2);background:rgba(59,91,219,.06)}

/* SHARED */
.topbar{height:40px;position:sticky;top:0;z-index:300;display:flex;align-items:center;padding:0 14px;gap:8px;backdrop-filter:blur(16px)}
.dark .topbar{background:rgba(10,7,0,.97);border-bottom:1px solid var(--bdr)}
.light .topbar{background:rgba(255,255,255,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 10px rgba(59,91,219,.08)}
.prose p{font-size:13.5px;line-height:1.78;margin-bottom:12px;color:var(--txt2)}
.prose h3{font-size:15.5px;font-weight:700;margin:22px 0 9px;color:var(--txt);font-family:'Space Mono',monospace;letter-spacing:.02em}
.prose ul,.prose ol{padding-left:20px;margin-bottom:12px}
.prose li{font-size:13.5px;line-height:1.72;margin-bottom:5px;color:var(--txt2)}
.prose strong{font-weight:700;color:var(--txt)}

/* Audio player bar */
.player-bar{width:100%;height:3px;border-radius:2px;cursor:pointer;-webkit-appearance:none;appearance:none;outline:none}
.dark .player-bar{background:rgba(251,191,36,.12)}
.dark .player-bar::-webkit-slider-thumb{-webkit-appearance:none;width:10px;height:10px;border-radius:50%;background:var(--acc);cursor:pointer}
.light .player-bar::-webkit-slider-thumb{-webkit-appearance:none;width:10px;height:10px;border-radius:50%;background:var(--acc);cursor:pointer}
`;

/* ═══ ICONS ═══ */
const Svg = ({d,s=14,sw=1.8,fill='none'}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {(Array.isArray(d)?d:[d]).map((p,i)=><path key={i} d={p}/>)}
  </svg>
);
const I = {
  mic:    s=><Svg s={s} d={["M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z","M19 10v2a7 7 0 0 1-14 0v-2","M12 19v4","M8 23h8"]}/>,
  stop:   s=><Svg s={s} d="M6 6h12v12H6z" fill="currentColor" sw={0}/>,
  pause:  s=><Svg s={s} d={["M6 4h4v16H6z","M14 4h4v16h-4"]}/>,
  play:   s=><Svg s={s} d="M5 3l14 9-14 9V3z" sw={1.5}/>,
  dl:     s=><Svg s={s} d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]}/>,
  trash:  s=><Svg s={s} d={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6","M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]}/>,
  ok:     s=><Svg s={s} d="M20 6 9 17l-5-5"/>,
  info:   s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 16v-4M12 8h.01"]}/>,
  edit:   s=><Svg s={s} d={["M12 20h9","M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 13.5-13.5z"]}/>,
  clock:  s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 6v6l4 2"]}/>,
  folder: s=><Svg s={s} d={["M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"]}/>,
  wave:   s=><Svg s={s} d={["M2 12h2","M6 6v12","M10 9v6","M14 4v16","M18 7v10","M22 12h2"]}/>,
  tag:    s=><Svg s={s} d={["M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z","M7 7h.01"]}/>,
  copy:   s=><Svg s={s} d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2","M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"]}/>,
};

/* ═══ WAVEFORM CANVAS ═══ */
function WaveCanvas({ recording, dark, analyserRef }) {
  const ref = useRef();
  const rafRef = useRef();
  const hRef = useRef(new Array(64).fill(0.1));
  const tRef = useRef(new Array(64).fill(0.1));

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height, N = 64;
    const dataArr = analyserRef?.current ? new Uint8Array(analyserRef.current.frequencyBinCount) : null;

    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      const bw = W / N;

      if (recording && analyserRef?.current && dataArr) {
        analyserRef.current.getByteFrequencyData(dataArr);
      }

      for (let i = 0; i < N; i++) {
        if (recording) {
          if (dataArr) {
            const freq = dataArr[Math.floor(i * dataArr.length / N)] / 255;
            tRef.current[i] = Math.max(0.06, freq * 0.92);
          } else {
            const nb = i > 0 ? hRef.current[i-1] * 0.3 : 0;
            tRef.current[i] = Math.min(1, Math.max(0.06, Math.random()*0.8+nb+0.06));
          }
        } else {
          tRef.current[i] = 0.07 + 0.06*Math.sin(i*0.4 + Date.now()*0.0018);
        }
        hRef.current[i] += (tRef.current[i] - hRef.current[i]) * (recording ? 0.22 : 0.05);
        const h = hRef.current[i] * H * 0.88;
        const x = i * bw + bw * 0.18;
        const bwR = bw * 0.64;

        const grad = ctx.createLinearGradient(0, H/2-h/2, 0, H/2+h/2);
        if (dark) {
          grad.addColorStop(0, `rgba(249,115,22,${recording?0.4:0.15})`);
          grad.addColorStop(0.5, `rgba(251,191,36,${recording?0.95:0.28})`);
          grad.addColorStop(1, `rgba(249,115,22,${recording?0.4:0.15})`);
        } else {
          grad.addColorStop(0, `rgba(112,72,232,${recording?0.38:0.13})`);
          grad.addColorStop(0.5, `rgba(59,91,219,${recording?0.9:0.25})`);
          grad.addColorStop(1, `rgba(112,72,232,${recording?0.38:0.13})`);
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, H/2-h/2, bwR, h, Math.min(3, bwR/2));
        ctx.fill();

        if (dark && recording && hRef.current[i] > 0.5) {
          ctx.shadowColor = '#fbbf24'; ctx.shadowBlur = 7; ctx.fill(); ctx.shadowBlur = 0;
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [recording, dark]);

  return <canvas ref={ref} width={700} height={74}
    style={{width:'100%', height:74, display:'block', borderRadius: dark?3:8}}/>;
}

/* ═══ MINI PLAYBACK WAVEFORM (static bars from AudioBuffer) ═══ */
function MiniWave({ peaks, dark, accent, playPct=0 }) {
  const N = 80;
  const bars = useMemo(() => {
    if (!peaks || peaks.length === 0) return new Array(N).fill(0.2);
    const out = [];
    for (let i = 0; i < N; i++) {
      const idx = Math.floor(i * peaks.length / N);
      out.push(peaks[idx] || 0.1);
    }
    return out;
  }, [peaks]);

  const h = 32;
  return (
    <div style={{display:'flex',gap:1.5,alignItems:'center',height:h,flex:1}}>
      {bars.map((v,i)=>{
        const pct = i/N;
        const past = pct < playPct;
        const bh = Math.max(3, v * h * 0.9);
        return (
          <div key={i} style={{
            flex:1, height:bh, borderRadius:1,
            background: past
              ? (dark ? '#fbbf24' : '#3b5bdb')
              : (dark ? 'rgba(251,191,36,.2)' : 'rgba(59,91,219,.18)'),
            transition:'background .05s'
          }}/>
        );
      })}
    </div>
  );
}

/* ═══ FORMAT TIME ═══ */
const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.round(s%60)).padStart(2,'0')}`;

/* ═══ STEPS ═══ */
function Steps({items}){
  return (<div>{items.map((s,i)=>(
    <div key={i} style={{display:'flex',gap:10,marginBottom:i<items.length-1?15:0}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
        <div className="step-n">{i+1}</div>
        {i<items.length-1&&<div className="step-ln" style={{flex:1,marginTop:4,minHeight:10}}/>}
      </div>
      <div style={{flex:1,paddingTop:2}}>
        <div style={{fontSize:12.5,fontWeight:700,color:'var(--txt)',marginBottom:2,fontFamily:"'Space Mono',monospace"}}>{s.t}</div>
        <div style={{fontSize:12.5,color:'var(--txt2)',lineHeight:1.7}}>{s.d}</div>
      </div>
    </div>
  ))}</div>);
}

/* ══════════════════════════════════════════════════════════════════
   RECORDING ROW PLAYER COMPONENT
══════════════════════════════════════════════════════════════════ */
function RecordingRow({ rec, dark, onDelete, onRename }) {
  const [playing, setPlaying] = useState(false);
  const [playPct, setPlayPct] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [renaming, setRenaming] = useState(false);
  const [nameVal, setNameVal] = useState(rec.name);
  const audioRef = useRef(null);
  const rafRef = useRef();

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(rec.url);
      audioRef.current.onended = () => { setPlaying(false); setPlayPct(0); setCurrentTime(0); cancelAnimationFrame(rafRef.current); };
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      cancelAnimationFrame(rafRef.current);
    } else {
      audioRef.current.play();
      setPlaying(true);
      const tick = () => {
        if (audioRef.current) {
          const pct = audioRef.current.currentTime / (audioRef.current.duration||1);
          setPlayPct(pct);
          setCurrentTime(audioRef.current.currentTime);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const seek = (e) => {
    const pct = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = pct * rec.duration;
      setPlayPct(pct);
      setCurrentTime(pct * rec.duration);
    }
  };

  const handleRename = () => {
    if (nameVal.trim()) onRename(rec.id, nameVal.trim());
    setRenaming(false);
  };

  useEffect(() => () => {
    cancelAnimationFrame(rafRef.current);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
  }, []);

  return (
    <div className="rec-row">
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:9}}>
        <div style={{flex:1,minWidth:0}}>
          {renaming ? (
            <div style={{display:'flex',gap:5}}>
              <input className="inp" value={nameVal} onChange={e=>setNameVal(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleRename()} autoFocus
                style={{fontSize:12,padding:'4px 8px',height:'auto',fontFamily:"'Space Mono',monospace"}}/>
              <button className="btn-ghost" onClick={handleRename}>{I.ok(10)}</button>
            </div>
          ) : (
            <div style={{display:'flex',alignItems:'center',gap:7,cursor:'pointer'}} onClick={()=>setRenaming(true)}>
              <span style={{fontSize:12.5,fontWeight:700,fontFamily:"'Space Mono',monospace",color:'var(--txt)',
                overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{rec.name}</span>
              <span style={{color:'var(--txt3)',flexShrink:0}}>{I.edit(9)}</span>
            </div>
          )}
          <div style={{fontSize:9.5,fontFamily:"'Space Mono',monospace",color:'var(--txt3)',marginTop:2}}>
            {rec.date} · {fmt(rec.duration)} · {(rec.size/1024).toFixed(1)} KB
          </div>
        </div>
        <div style={{display:'flex',gap:4,flexShrink:0,marginLeft:8}}>
          <a href={rec.url} download={rec.name+'.webm'}>
            <button className="btn-ghost">{I.dl(10)}</button>
          </a>
          <button className="btn-ghost"
            style={{borderColor:dark?'rgba(239,68,68,.22)':'rgba(224,49,49,.22)',color:'var(--err)'}}
            onClick={()=>onDelete(rec.id)}>
            {I.trash(10)}
          </button>
        </div>
      </div>

      {/* Waveform + playback */}
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        <button className="btn-ghost" onClick={togglePlay}
          style={{padding:'5px 8px',flexShrink:0}}>
          {playing ? I.pause(11) : I.play(11)}
        </button>
        <div style={{flex:1,display:'flex',flexDirection:'column',gap:5}}>
          <MiniWave peaks={rec.peaks} dark={dark} playPct={playPct}/>
          <input type="range" className="player-bar range" min={0} max={1} step={0.001}
            value={playPct} onChange={seek}
            style={{background: dark
              ? `linear-gradient(to right,#fbbf24 0%,#fbbf24 ${playPct*100}%,rgba(251,191,36,.1) ${playPct*100}%,rgba(251,191,36,.1) 100%)`
              : `linear-gradient(to right,#3b5bdb 0%,#3b5bdb ${playPct*100}%,rgba(59,91,219,.15) ${playPct*100}%,rgba(59,91,219,.15) 100%)`
            }}/>
        </div>
        <span style={{fontSize:9.5,fontFamily:"'Space Mono',monospace",color:'var(--txt3)',flexShrink:0,minWidth:36,textAlign:'right'}}>
          {fmt(currentTime)}
        </span>
      </div>

      {/* Tag */}
      {rec.tag && <div style={{marginTop:7}}><span className="tag">{rec.tag}</span></div>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════════════ */
export default function VoiceRecorder() {
  const [mode, setMode] = useState('dark');
  const dark = mode === 'dark';

  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [pageTab, setPageTab] = useState('recorder');
  const [supported, setSupported] = useState(true);
  const [micErr, setMicErr] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [inputGain, setInputGain] = useState(1);
  const [quality, setQuality] = useState('high');
  const [searchQ, setSearchQ] = useState('');

  const mediaRecRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const pausedAtRef = useRef(0);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const recCount = useRef(0);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) setSupported(false);
  }, []);

  const buildAnalyser = (stream) => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const src = ctx.createMediaStreamSource(stream);
    const an = ctx.createAnalyser();
    an.fftSize = 256;
    src.connect(an);
    audioCtxRef.current = ctx;
    analyserRef.current = an;
  };

  /* ── Extract waveform peaks from recorded blob ── */
  const extractPeaks = async (blob, N=80) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const buf = await blob.arrayBuffer();
      const audioBuf = await ctx.decodeAudioData(buf);
      const data = audioBuf.getChannelData(0);
      const blockSize = Math.floor(data.length / N);
      const peaks = [];
      for (let i = 0; i < N; i++) {
        let max = 0;
        for (let j = 0; j < blockSize; j++) {
          const v = Math.abs(data[i*blockSize+j]);
          if (v > max) max = v;
        }
        peaks.push(max);
      }
      await ctx.close();
      return peaks;
    } catch(e) {
      return new Array(N).fill(0.2);
    }
  };

  const startRecording = async () => {
    setMicErr('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, sampleRate: quality==='high'?48000:16000 } });
      streamRef.current = stream;
      buildAnalyser(stream);

      const options = { mimeType: 'audio/webm;codecs=opus' };
      let mr;
      try { mr = new MediaRecorder(stream, options); }
      catch(e) { mr = new MediaRecorder(stream); }

      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const peaks = await extractPeaks(blob);
        recCount.current += 1;
        setRecordings(prev => [{
          id: Date.now(),
          name: `REC_${String(recCount.current).padStart(3,'0')}`,
          url, peaks, blob,
          size: blob.size,
          duration: elapsed,
          date: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
          tag: currentTag.trim() || null,
        }, ...prev]);
        streamRef.current?.getTracks().forEach(t=>t.stop());
        if (audioCtxRef.current) { audioCtxRef.current.close(); audioCtxRef.current = null; }
      };

      mr.start(100);
      mediaRecRef.current = mr;
      setRecording(true);
      setPaused(false);
      setElapsed(0);
      startRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
      }, 500);
    } catch(e) {
      const msgs = {
        'NotAllowedError': '🔒 Microphone access denied. Allow permission in your browser.',
        'NotFoundError': '🎤 No microphone found. Connect a mic and retry.',
        'NotReadableError': '⚠️ Microphone is already in use by another app.',
      };
      setMicErr(msgs[e.name] || `Error: ${e.message}`);
    }
  };

  const pauseRecording = () => {
    if (mediaRecRef.current?.state === 'recording') {
      mediaRecRef.current.pause();
      setPaused(true);
      pausedAtRef.current = Date.now();
      clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecRef.current?.state === 'paused') {
      startRef.current += Date.now() - pausedAtRef.current;
      mediaRecRef.current.resume();
      setPaused(false);
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
      }, 500);
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    if (mediaRecRef.current && mediaRecRef.current.state !== 'inactive') {
      mediaRecRef.current.stop();
    }
    setRecording(false);
    setPaused(false);
  };

  const deleteRecording = (id) => {
    setRecordings(prev => {
      const rec = prev.find(r=>r.id===id);
      if (rec) URL.revokeObjectURL(rec.url);
      return prev.filter(r=>r.id!==id);
    });
  };

  const renameRecording = (id, name) => {
    setRecordings(prev => prev.map(r => r.id===id ? {...r, name} : r));
  };

  const totalDuration = recordings.reduce((s,r)=>s+r.duration,0);
  const totalSize = recordings.reduce((s,r)=>s+(r.size||0),0);

  const filtered = searchQ
    ? recordings.filter(r=>r.name.toLowerCase().includes(searchQ.toLowerCase())||(r.tag||'').toLowerCase().includes(searchQ.toLowerCase()))
    : recordings;

  const PAGE_TABS = [
    {id:'recorder', label:'REC'},
    {id:'library',  label:`LIB${recordings.length?` [${recordings.length}]`:''}`},
    {id:'guide',    label:'GUIDE'},
    {id:'learn',    label:'LEARN'},
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className={dark?'dark':'light'}>
        {dark&&<div className="scanline"/>}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <div style={{width:26,height:26,borderRadius:dark?2:6,
              background:dark?'transparent':'linear-gradient(135deg,#3b5bdb,#7048e8)',
              border:dark?'1px solid rgba(251,191,36,.45)':'none',
              display:'flex',alignItems:'center',justifyContent:'center',
              color:dark?'var(--acc)':'#fff',
              boxShadow:dark?'0 0 12px rgba(251,191,36,.25)':'0 2px 8px rgba(59,91,219,.4)'}}>
              {I.mic(13)}
            </div>
            <span style={{fontSize:13.5,fontWeight:700,fontFamily:"'Space Mono',monospace",
              color:'var(--txt)',letterSpacing:'.04em'}}>
              VOICE_<span style={{color:'var(--acc)'}}>REC</span>
            </span>
            <span style={{fontSize:7.5,fontWeight:700,fontFamily:"'Space Mono',monospace",
              letterSpacing:'.18em',textTransform:'uppercase',padding:'1px 5px',borderRadius:dark?2:4,
              border:dark?'1px solid rgba(251,191,36,.2)':'1.5px solid rgba(59,91,219,.22)',
              color:dark?'rgba(251,191,36,.5)':'var(--acc)',
              background:dark?'rgba(251,191,36,.04)':'rgba(59,91,219,.06)'}}>
              v2.1
            </span>
          </div>
          <div style={{flex:1}}/>

          {/* Live rec status pill */}
          {recording && !paused && (
            <div style={{display:'flex',alignItems:'center',gap:6,padding:'3px 10px',
              borderRadius:dark?2:6,
              border:dark?'1px solid rgba(239,68,68,.35)':'1.5px solid rgba(224,49,49,.25)',
              background:dark?'rgba(239,68,68,.09)':'rgba(224,49,49,.06)'}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:'var(--err)',animation:'blink .8s ease-in-out infinite'}}/>
              <span style={{fontSize:9.5,fontWeight:700,fontFamily:"'Space Mono',monospace",letterSpacing:'.12em',color:'var(--err)'}}>
                {fmt(elapsed)} REC
              </span>
            </div>
          )}
          {paused && (
            <div style={{padding:'3px 10px',borderRadius:dark?2:6,
              border:'1px solid rgba(251,191,36,.35)',background:'rgba(251,191,36,.07)'}}>
              <span style={{fontSize:9.5,fontWeight:700,fontFamily:"'Space Mono',monospace",letterSpacing:'.1em',color:'var(--acc)'}}>
                ⏸ {fmt(elapsed)} PAUSED
              </span>
            </div>
          )}

          <button onClick={()=>setMode(dark?'light':'dark')} style={{
            display:'flex',alignItems:'center',gap:6,padding:'5px 11px',
            border:dark?'1px solid rgba(251,191,36,.18)':'1.5px solid var(--bdr)',
            borderRadius:dark?2:7,background:dark?'rgba(251,191,36,.03)':'var(--sur)',
            cursor:'pointer',transition:'all .14s'}}>
            {dark?(
              <><div style={{width:28,height:15,borderRadius:8,background:'var(--acc)',position:'relative',boxShadow:'0 0 8px rgba(251,191,36,.5)'}}>
                <div style={{position:'absolute',top:2.5,right:2.5,width:10,height:10,borderRadius:'50%',background:'#0a0700'}}/>
              </div><span style={{fontSize:9.5,fontWeight:700,fontFamily:"'Space Mono',monospace",color:'rgba(251,191,36,.6)',letterSpacing:'.1em'}}>AMBR</span></>
            ):(
              <><span style={{fontSize:10,color:'var(--txt3)',fontWeight:600,fontFamily:"'Space Mono',monospace"}}>SLATE</span>
              <div style={{width:28,height:15,borderRadius:8,background:'#bfc8e2',position:'relative'}}>
                <div style={{position:'absolute',top:2.5,left:2.5,width:10,height:10,borderRadius:'50%',background:'#8898c4'}}/>
              </div></>
            )}
          </button>
        </div>

        {/* PAGE TABS */}
        <div className="tab-bar" style={{display:'flex'}}>
          {PAGE_TABS.map(t=>(
            <button key={t.id} className={`tab ${pageTab===t.id?'on':''}`} onClick={()=>setPageTab(t.id)}>{t.id==='recorder'?'⬤ '+t.label:t.label}</button>
          ))}
        </div>

        {/* BODY */}
        <div className="tool-layout-grid">

          {/* SIDEBAR */}
          <div className="sidebar">

            {/* Session Stats */}
            <div>
              <div className="sec-title">{I.wave(9)} Session</div>
              {[
                {l:'Recordings', v:recordings.length, c:dark?'#fbbf24':'#3b5bdb'},
                {l:'Total Time',  v:fmt(totalDuration), c:dark?'#fb923c':'#7048e8'},
                {l:'Total Size',  v:`${(totalSize/1024).toFixed(0)} KB`, c:dark?'#4ade80':'#2f9e44'},
              ].map(({l,v,c})=>(
                <div key={l} className="metric" style={{marginBottom:5}}>
                  <div style={{fontSize:8.5,fontWeight:700,fontFamily:"'Space Mono',monospace",letterSpacing:'.12em',textTransform:'uppercase',color:'var(--txt3)',marginBottom:2}}>{l}</div>
                  <div style={{fontSize:17,fontWeight:700,fontFamily:"'Space Mono',monospace",color:c}}>{v}</div>
                </div>
              ))}
            </div>

            {/* Tag for next recording */}
            <div>
              <div className="sec-title">{I.tag(9)} Tag</div>
              <input className="inp" placeholder="e.g. meeting, idea…"
                value={currentTag} onChange={e=>setCurrentTag(e.target.value)}
                style={{fontSize:12,marginBottom:4}}/>
              <div style={{fontSize:10,color:'var(--txt3)',lineHeight:1.5}}>Applied to next recording</div>
            </div>

            {/* Quality */}
            <div>
              <div className="sec-title">Quality</div>
              {[{id:'high',label:'High — 48kHz'},{id:'low',label:'Compact — 16kHz'}].map(q=>(
                <button key={q.id} className={`btn-ghost ${quality===q.id?'on':''}`}
                  onClick={()=>setQuality(q.id)}
                  style={{width:'100%',justifyContent:'flex-start',marginBottom:4,fontSize:10.5}}>
                  {quality===q.id&&<span style={{color:'var(--ok)',marginRight:2}}>{I.ok(9)}</span>}
                  {q.label}
                </button>
              ))}
            </div>

            {/* Tips */}
            <div>
              <div className="sec-title">Tips</div>
              {[
                'Stay within 20–30 cm of mic',
                'Use pause to take breaks',
                'Tag recordings before starting',
                'Click filename to rename',
                'Download as .webm (Opus)',
              ].map((t,i)=>(
                <div key={i} style={{fontSize:11,color:'var(--txt2)',lineHeight:1.65,marginBottom:5,
                  paddingLeft:9,borderLeft:dark?'1px solid rgba(251,191,36,.15)':'1.5px solid rgba(59,91,219,.2)'}}>
                  {t}
                </div>
              ))}
            </div>

          </div>

          {/* MAIN */}
          <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:13}}>
            <AnimatePresence mode="wait">

              {/* ════ RECORDER ════ */}
              {pageTab==='recorder'&&(
                <motion.div key="rec" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>

                  {!supported&&(
                    <div style={{padding:'12px 16px',border:dark?'1px solid rgba(239,68,68,.3)':'1.5px solid rgba(224,49,49,.25)',
                      borderRadius:dark?3:8,background:dark?'rgba(239,68,68,.07)':'rgba(224,49,49,.05)',
                      fontSize:13,color:'var(--err)',display:'flex',gap:8,alignItems:'flex-start'}}>
                      {I.info(15)}<span><b>MediaRecorder not supported</b> in this browser. Use Chrome, Edge or Firefox.</span>
                    </div>
                  )}

                  {micErr&&(
                    <div style={{padding:'10px 14px',border:dark?'1px solid rgba(239,68,68,.25)':'1.5px solid rgba(224,49,49,.2)',
                      borderRadius:dark?3:7,background:dark?'rgba(239,68,68,.06)':'rgba(224,49,49,.04)',
                      fontSize:12.5,color:'var(--err)',display:'flex',gap:7,alignItems:'center'}}>
                      {I.info(13)}{micErr}
                    </div>
                  )}

                  {/* Recorder panel */}
                  <div className="panel" style={{padding:'18px 18px 16px'}}>
                    <WaveCanvas recording={recording && !paused} dark={dark} analyserRef={analyserRef}/>

                    {/* Big record button */}
                    <div style={{display:'flex',justifyContent:'center',margin:'20px 0 14px',position:'relative'}}>
                      <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        {recording && !paused && [0,1,2].map(i=>(
                          <div key={i} style={{
                            position:'absolute',
                            width:108+i*26,height:108+i*26,borderRadius:'50%',
                            border:dark?`1px solid rgba(239,68,68,${0.3-i*.08})`:`1px solid rgba(224,49,49,${0.22-i*.06})`,
                            animation:`ripple ${1.3+i*.4}s ease-out ${i*.25}s infinite`,
                            pointerEvents:'none'}}/>
                        ))}

                        {!recording?(
                          <button onClick={startRecording} disabled={!supported}
                            className={dark?'':''}
                            style={{width:100,height:100,borderRadius:'50%',
                              background:dark?'radial-gradient(circle,rgba(239,68,68,.18) 0%,rgba(239,68,68,.05) 100%)':'linear-gradient(135deg,#e03131,#c92a2a)',
                              border:dark?'1.5px solid rgba(239,68,68,.6)':'none',
                              color:dark?'var(--err)':'#fff',cursor:'pointer',
                              display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6,
                              boxShadow:dark?'0 0 30px rgba(239,68,68,.22)':'0 8px 28px rgba(224,49,49,.45)',
                              animation:dark?'red-pulse 2.4s ease-in-out infinite':'none',transition:'all .18s'}}>
                            {I.mic(30)}
                            <span style={{fontSize:8.5,fontWeight:700,fontFamily:"'Space Mono',monospace",letterSpacing:'.14em',textTransform:'uppercase'}}>
                              REC
                            </span>
                          </button>
                        ):(
                          <button onClick={stopRecording}
                            style={{width:100,height:100,borderRadius:'50%',
                              background:dark?'radial-gradient(circle,rgba(251,191,36,.18) 0%,rgba(251,191,36,.05) 100%)':'linear-gradient(135deg,#3b5bdb,#7048e8)',
                              border:dark?'1.5px solid rgba(251,191,36,.55)':'none',
                              color:dark?'var(--acc)':'#fff',cursor:'pointer',
                              display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6,
                              boxShadow:dark?'0 0 28px rgba(251,191,36,.28)':'0 8px 28px rgba(59,91,219,.45)',
                              transition:'all .18s'}}>
                            {I.stop(26)}
                            <span style={{fontSize:8.5,fontWeight:700,fontFamily:"'Space Mono',monospace",letterSpacing:'.12em',textTransform:'uppercase'}}>
                              {paused?'PAUSED':'STOP'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Pause / resume */}
                    {recording&&(
                      <div style={{display:'flex',justifyContent:'center',gap:8,marginBottom:14}}>
                        {!paused?(
                          <button className="btn-ghost" onClick={pauseRecording} style={{padding:'6px 16px',fontSize:10.5}}>
                            {I.pause(10)} Pause
                          </button>
                        ):(
                          <button className="btn-primary" onClick={resumeRecording} style={{padding:'6px 16px'}}>
                            {I.play(10)} Resume
                          </button>
                        )}
                      </div>
                    )}

                    {/* Elapsed + status */}
                    <div style={{textAlign:'center',marginBottom:4}}>
                      <div style={{fontSize:32,fontWeight:700,fontFamily:"'Space Mono',monospace",
                        color:recording?(dark?'var(--acc)':'var(--acc)'):'var(--txt3)',
                        letterSpacing:'.08em',transition:'color .3s'}}>
                        {fmt(elapsed)}
                      </div>
                      <div style={{fontSize:9.5,fontFamily:"'Space Mono',monospace",letterSpacing:'.16em',
                        textTransform:'uppercase',marginTop:3,
                        color:recording&&!paused?(dark?'rgba(239,68,68,.7)':'rgba(224,49,49,.7)'):
                              paused?'rgba(251,191,36,.6)':'var(--txt3)'}}>
                        {recording&&!paused?'● RECORDING':paused?'⏸ PAUSED':'IDLE — TAP TO START'}
                      </div>
                    </div>
                  </div>

                  {/* Latest recording */}
                  {recordings.length>0&&(
                    <div className="panel" style={{padding:'13px 14px'}}>
                      <div className="lbl" style={{marginBottom:10}}>Latest Recording</div>
                      <RecordingRow rec={recordings[0]} dark={dark} onDelete={deleteRecording} onRename={renameRecording}/>
                    </div>
                  )}

                  {/* Stats row */}
                  {recordings.length>0&&(
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9}}>
                      {[
                        {l:'Recordings', v:recordings.length,         c:dark?'#fbbf24':'#3b5bdb'},
                        {l:'Total Time', v:fmt(totalDuration),        c:dark?'#fb923c':'#7048e8'},
                        {l:'Total Size', v:`${(totalSize/1024).toFixed(0)} KB`, c:dark?'#4ade80':'#2f9e44'},
                      ].map(({l,v,c})=>(
                        <div key={l} className="panel" style={{padding:'10px 12px'}}>
                          <div style={{fontSize:8.5,fontWeight:700,fontFamily:"'Space Mono',monospace",letterSpacing:'.12em',textTransform:'uppercase',color:'var(--txt3)',marginBottom:4}}>{l}</div>
                          <div style={{fontSize:18,fontWeight:700,fontFamily:"'Space Mono',monospace",color:c}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  )}

                </motion.div>
              )}

              {/* ════ LIBRARY ════ */}
              {pageTab==='library'&&(
                <motion.div key="lib" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:11}}>

                  <div style={{display:'flex',gap:9,alignItems:'center'}}>
                    <div style={{flex:1,position:'relative'}}>
                      <div style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--txt3)',pointerEvents:'none'}}>
                        <Svg s={13} d={["M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z","M16 16l4.5 4.5"]}/>
                      </div>
                      <input className="inp" placeholder="Search by name or tag…"
                        value={searchQ} onChange={e=>setSearchQ(e.target.value)} style={{paddingLeft:32}}/>
                    </div>
                    {recordings.length>0&&(
                      <button className="btn-ghost"
                        style={{borderColor:dark?'rgba(239,68,68,.22)':'rgba(224,49,49,.22)',color:'var(--err)'}}
                        onClick={()=>{recordings.forEach(r=>URL.revokeObjectURL(r.url));setRecordings([]);}}>
                        {I.trash(10)} Clear All
                      </button>
                    )}
                  </div>

                  {filtered.length===0?(
                    <div className="panel" style={{padding:32,textAlign:'center'}}>
                      <div style={{fontSize:36,marginBottom:8}}>🎙️</div>
                      <div style={{fontSize:14,fontWeight:700,fontFamily:"'Space Mono',monospace",color:'var(--txt)',marginBottom:4}}>
                        {recordings.length?'No matches':'No recordings yet'}
                      </div>
                      <div style={{fontSize:12.5,color:'var(--txt2)'}}>
                        {recordings.length?'Try a different search':'Go to the Rec tab and start recording.'}
                      </div>
                    </div>
                  ):filtered.map(rec=>(
                    <RecordingRow key={rec.id} rec={rec} dark={dark} onDelete={deleteRecording} onRename={renameRecording}/>
                  ))}

                </motion.div>
              )}

              {/* ════ GUIDE ════ */}
              {pageTab==='guide'&&(
                <motion.div key="guide" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:11}}>
                  <div className="hint" style={{display:'flex',gap:7,alignItems:'flex-start'}}>
                    {I.info(14)}<span>VOICE_REC uses your browser's MediaRecorder API. Audio is recorded directly on-device — nothing is uploaded to any server.</span>
                  </div>
                  {[
                    ['Allow Microphone', 'Click the REC button. Your browser will ask for mic permission — click Allow. If blocked, check the lock icon in the address bar.'],
                    ['Hit REC to Start', 'The waveform visualiser activates immediately. The elapsed timer counts up. You\'ll see ripple rings radiating from the button.'],
                    ['Pause Any Time', 'Hit Pause to freeze the timer mid-session. Resume picks up without creating a new file — everything stays in one recording.'],
                    ['Stop to Save', 'Clicking Stop finalises the recording. It\'s decoded, waveform peaks are extracted, and it appears in the library instantly.'],
                    ['Tag Before Recording', 'Enter a tag in the sidebar before starting. Tags make library search fast — e.g. "meeting", "idea", "lecture".'],
                    ['Rename, Download, Delete', 'Click any recording\'s filename to rename it inline. Download saves the raw .webm file. The playback scrubber lets you seek.'],
                    ['Browse the Library', 'Switch to the LIB tab to search, play, and manage all recordings. Stats show total recordings, time, and storage used.'],
                  ].map(([t,b],i)=>(
                    <div key={i} className="panel" style={{padding:13}}>
                      <div style={{display:'flex',gap:11}}>
                        <div style={{width:30,height:30,borderRadius:dark?2:8,flexShrink:0,
                          background:dark?'rgba(251,191,36,.07)':'rgba(59,91,219,.09)',
                          border:dark?'1px solid rgba(251,191,36,.2)':'1.5px solid rgba(59,91,219,.22)',
                          display:'flex',alignItems:'center',justifyContent:'center',
                          fontFamily:"'Space Mono',monospace",fontSize:12,fontWeight:700,color:'var(--acc)'}}>
                          {i+1}
                        </div>
                        <div>
                          <div style={{fontSize:13,fontWeight:700,fontFamily:"'Space Mono',monospace",color:'var(--txt)',marginBottom:4}}>{t}</div>
                          <div style={{fontSize:13,color:'var(--txt2)',lineHeight:1.72}}>{b}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {/* ════ LEARN ════ */}
              {pageTab==='learn'&&(
                <motion.div key="learn" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <div className="panel" style={{padding:'22px 24px'}}>
                    <h1 style={{fontSize:21,fontWeight:700,fontFamily:"'Space Mono',monospace",color:'var(--txt)',marginBottom:4,letterSpacing:'.02em'}}>
                      Voice Recording: Technical Reference
                    </h1>
                    <p style={{fontSize:12,color:'var(--txt3)',marginBottom:22,fontFamily:"'Space Mono',monospace"}}>
                      MediaRecorder API · Opus Codec · Audio Processing · Privacy
                    </p>
                    <div className="prose">
                      <p>VOICE_REC uses the browser's built-in <strong>MediaRecorder API</strong> to capture microphone input and encode it to <strong>Opus/WebM</strong> — a modern, open audio codec offering excellent quality at low bitrates.</p>
                      <h3>// How MediaRecorder Works</h3>
                      <p>The pipeline: getUserMedia() → MediaStream → MediaRecorder → Blob chunks → final Blob → ObjectURL. Audio is chunked every 100ms so you always have a recoverable partial recording if something goes wrong.</p>
                      <h3>// Codec & Quality</h3>
                      <p><strong>High quality (48kHz):</strong> Suitable for music, interviews, or any content requiring full frequency range. Larger file size. <strong>Compact (16kHz):</strong> Ideal for speech-only content like meetings or notes. Significantly smaller files with minimal perceptible quality loss for voice.</p>
                      <h3>// Audio Enhancements</h3>
                      <ul>
                        <li><strong>Echo Cancellation:</strong> Removes echo caused by the speaker playing into the mic. Essential for video calls.</li>
                        <li><strong>Noise Suppression:</strong> Reduces steady-state background noise like HVAC, fans, or crowd rumble.</li>
                        <li><strong>Auto Gain Control:</strong> Dynamically adjusts input gain to keep voice levels consistent as you move closer/farther from the mic.</li>
                      </ul>
                      <h3>// Waveform Visualisation</h3>
                      <p>During recording, the Web Audio API's <strong>AnalyserNode</strong> reads real-time frequency data from the microphone stream. After recording, the Blob is decoded with <strong>AudioContext.decodeAudioData()</strong> to extract per-channel amplitude peaks, which power the scrubber waveform.</p>
                      <h3>// Privacy</h3>
                      <p>All audio data stays in your browser. The recorded Blob is stored as an <strong>ObjectURL</strong> in memory — it is never uploaded anywhere. Closing the tab or refreshing will delete all recordings. Use the download button to save files permanently.</p>
                      <h3>// FAQ</h3>
                      {[
                        {q:'What format are recordings saved in?', a:'WebM container with Opus audio codec. This is supported in Chrome, Firefox, and Edge. Safari uses MP4/AAC as a fallback. Most modern media players and video editors can import WebM files directly.'},
                        {q:'Why is there a short delay before the waveform starts?', a:'The Web Audio API needs to connect the microphone stream to the AnalyserNode before data is available. This typically takes 50–100ms. The MediaRecorder starts capturing immediately, so no audio is lost.'},
                        {q:'Are recordings saved if I refresh the page?', a:'No — ObjectURLs are in-memory only and are cleared when the page unloads. Always download important recordings before closing or refreshing.'},
                        {q:'How long can I record?', a:'There is no hard limit imposed by VOICE_REC. Practical limits are your device RAM and storage. At 48kHz Opus, roughly 1 hour of audio uses 50–100 MB of RAM.'},
                        {q:'Can I record system audio (not just mic)?', a:'The MediaRecorder API can only capture microphone input directly. To record system audio, you\'d need to use a virtual audio cable or browser screen-capture API with audio sharing enabled.'},
                      ].map(({q,a},i)=>(
                        <div key={i} style={{padding:'11px 13px',marginBottom:8,
                          background:dark?'rgba(0,0,0,.4)':'#eef1fb',
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          borderRadius:dark?2:8}}>
                          <div style={{fontSize:13,fontWeight:700,fontFamily:"'Space Mono',monospace",color:'var(--txt)',marginBottom:5}}>{q}</div>
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