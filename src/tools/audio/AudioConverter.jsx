import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   STYLES — DUAL THEME  (dark neon  /  light indigo)
═══════════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{overflow-x:hidden;font-family:'Inter',sans-serif}

@keyframes scanline{0%{top:-3px}100%{top:102%}}
@keyframes gridmove{from{background-position:0 0}to{background-position:40px 40px}}
@keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes ripple{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.6);opacity:0}}
@keyframes pulseglow{0%,100%{box-shadow:0 0 18px rgba(0,240,255,.15),0 0 40px rgba(0,240,255,.06)}50%{box-shadow:0 0 34px rgba(0,240,255,.55),0 0 80px rgba(0,240,255,.2)}}
@keyframes pulseglow-light{0%,100%{box-shadow:0 4px 18px rgba(79,70,229,.28)}50%{box-shadow:0 8px 32px rgba(79,70,229,.6),0 0 60px rgba(124,58,237,.2)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.15}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes waveIn{from{opacity:0;transform:scaleY(0)}to{opacity:1;transform:scaleY(1)}}
.fadeup{animation:fadeup .22s ease both}

/* ══ DARK ══════════════════════════════════════════════════════════ */
.dark{
  --bg:#020210;--sur:#08081e;--s2:#0c0c25;
  --bdr:#1a1a3e;--bdr2:rgba(0,240,255,.22);
  --acc:#00f0ff;--acc2:#b000e0;--acc3:#f59e0b;
  --ok:#22c55e;--err:#f43f5e;
  --txt:#f0f4ff;--txt2:#a8b8d8;--txt3:#5a6a90;
  min-height:100vh;background:var(--bg);color:var(--txt);
  background-image:
    linear-gradient(rgba(0,240,255,.012) 1px,transparent 1px),
    linear-gradient(90deg,rgba(0,240,255,.012) 1px,transparent 1px);
  background-size:40px 40px;animation:gridmove 14s linear infinite
}
.scanline{position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:9999;
  background:linear-gradient(90deg,transparent,rgba(0,240,255,.55),transparent);
  box-shadow:0 0 12px rgba(0,240,255,.3);animation:scanline 8s linear infinite;top:-3px}

.dark .panel{background:linear-gradient(145deg,var(--sur),var(--s2));
  border:1px solid var(--bdr);border-radius:5px;position:relative;overflow:hidden}
.dark .panel::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,240,255,.18),transparent);pointer-events:none}

.dark .inp{background:rgba(0,0,0,.55);border:1px solid var(--bdr);border-radius:4px;
  color:var(--txt);font-family:'JetBrains Mono',monospace;font-size:13.5px;font-weight:500;
  padding:8px 11px;outline:none;width:100%;transition:all .14s}
.dark .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(0,240,255,.1)}
.dark .inp::placeholder{color:var(--txt3)}
.dark .sel{background:rgba(0,0,0,.55);border:1px solid var(--bdr);border-radius:4px;
  color:var(--txt);font-size:12.5px;padding:7px 10px;outline:none;cursor:pointer;width:100%;transition:all .14s}
.dark .sel:focus{border-color:var(--acc)}
.dark .sel option{background:#0d0d28}

.dark .tab-bar{background:var(--sur);border-bottom:1px solid var(--bdr)}
.dark .tab{height:40px;padding:0 16px;border:none;border-bottom:2px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;font-size:11px;font-weight:700;
  letter-spacing:.07em;text-transform:uppercase;transition:all .14s;
  display:flex;align-items:center;gap:5px;white-space:nowrap}
.dark .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(0,240,255,.05)}
.dark .tab:hover:not(.on){color:var(--txt2)}

.dark .btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:9px 20px;border:1px solid var(--acc);border-radius:4px;
  background:rgba(0,240,255,.1);color:var(--acc);cursor:pointer;
  font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
  box-shadow:0 0 14px rgba(0,240,255,.1);transition:all .16s}
.dark .btn-primary:hover{background:rgba(0,240,255,.2);box-shadow:0 0 28px rgba(0,240,255,.28);transform:translateY(-1px)}
.dark .btn-primary:disabled{opacity:.35;cursor:not-allowed;transform:none}

.dark .btn-danger{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:9px 20px;border:1px solid rgba(244,63,94,.5);border-radius:4px;
  background:rgba(244,63,94,.1);color:var(--err);cursor:pointer;
  font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;transition:all .16s}
.dark .btn-danger:hover{background:rgba(244,63,94,.2);transform:translateY(-1px)}

.dark .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;
  padding:5px 10px;border:1px solid var(--bdr);border-radius:4px;
  background:transparent;color:var(--txt3);cursor:pointer;font-size:10px;font-weight:600;transition:all .12s}
.dark .btn-ghost:hover,.dark .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(0,240,255,.06)}
.dark .btn-ghost:disabled{opacity:.35;cursor:not-allowed}

.dark .metric{border:1px solid rgba(0,240,255,.12);border-radius:4px;padding:11px 13px;background:rgba(0,240,255,.04)}
.dark .lbl{font-size:9.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(0,240,255,.5);display:block;margin-bottom:5px}
.dark .hint{font-size:13px;color:var(--txt2);line-height:1.75;padding:9px 12px;border-radius:4px;
  background:rgba(0,240,255,.04);border-left:2px solid rgba(0,240,255,.3)}
.dark .ad-slot{background:rgba(0,240,255,.018);border:1px dashed rgba(0,240,255,.1);border-radius:4px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  color:var(--txt3);font-size:9px;letter-spacing:.1em;text-transform:uppercase}
.dark .txa{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:4px;
  color:var(--txt);font-family:'Inter',sans-serif;font-size:14px;line-height:1.85;
  padding:14px 16px;outline:none;resize:none;width:100%;min-height:180px;transition:border-color .14s}
.dark .txa:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(0,240,255,.08)}
.dark .sidebar{border-right:1px solid var(--bdr);background:var(--sur);padding:13px 11px;
  overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.dark .sec-title{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:rgba(0,240,255,.42);margin-bottom:7px}
.dark .chip{display:inline-block;padding:2px 7px;border-radius:3px;margin:2px 2px;
  background:rgba(0,240,255,.07);border:1px solid rgba(0,240,255,.18);
  font-size:13.5px;line-height:1.75;color:var(--txt)}
.dark .chip.interim{background:rgba(176,0,224,.07);border-color:rgba(176,0,224,.2);
  color:var(--txt2);font-style:italic}
.dark .session-row{border:1px solid var(--bdr);border-radius:4px;padding:12px 13px;
  background:rgba(0,240,255,.025);cursor:pointer;transition:border-color .14s}
.dark .session-row:hover{border-color:rgba(0,240,255,.2)}
.dark .step-n{width:26px;height:26px;border-radius:50%;border:1px solid rgba(0,240,255,.28);
  background:rgba(0,240,255,.07);display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;color:var(--acc);flex-shrink:0}
.dark .step-ln{background:rgba(0,240,255,.1);width:1.5px}

/* ══ LIGHT ═════════════════════════════════════════════════════════ */
.light{
  --bg:#dde3f5;--sur:#ffffff;--s2:#f3f5fd;
  --bdr:#c0cce8;--bdr2:#4f46e5;
  --acc:#4f46e5;--acc2:#7c3aed;--acc3:#d97706;
  --ok:#16a34a;--err:#dc2626;
  --txt:#111827;--txt2:#374151;--txt3:#6b7280;
  min-height:100vh;background:var(--bg);color:var(--txt)
}
.light .panel{background:var(--sur);border:1.5px solid var(--bdr);border-radius:12px;
  box-shadow:0 2px 16px rgba(79,70,229,.07);position:relative;overflow:hidden}
.light .inp{background:#eef1fb;border:1.5px solid var(--bdr);border-radius:8px;
  color:var(--txt);font-family:'JetBrains Mono',monospace;font-size:13.5px;font-weight:500;
  padding:8px 11px;outline:none;width:100%;transition:all .14s}
.light .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(79,70,229,.12)}
.light .sel{background:#eef1fb;border:1.5px solid var(--bdr);border-radius:8px;
  color:var(--txt);font-size:12.5px;padding:7px 10px;outline:none;cursor:pointer;width:100%}
.light .sel:focus{border-color:var(--acc)}
.light .tab-bar{background:var(--sur);border-bottom:1.5px solid var(--bdr)}
.light .tab{height:40px;padding:0 16px;border:none;border-bottom:2.5px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;font-size:11px;font-weight:700;
  letter-spacing:.06em;text-transform:uppercase;transition:all .14s;
  display:flex;align-items:center;gap:5px;white-space:nowrap}
.light .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(79,70,229,.05);font-weight:800}
.light .tab:hover:not(.on){color:var(--txt2);background:rgba(79,70,229,.03)}
.light .btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:9px 20px;border:none;border-radius:8px;
  background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;cursor:pointer;
  font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  box-shadow:0 4px 14px rgba(79,70,229,.38);transition:all .16s}
.light .btn-primary:hover{box-shadow:0 8px 24px rgba(79,70,229,.52);transform:translateY(-1px)}
.light .btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none}
.light .btn-danger{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:9px 20px;border:none;border-radius:8px;
  background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;cursor:pointer;
  font-size:11px;font-weight:700;box-shadow:0 4px 14px rgba(220,38,38,.3);transition:all .16s}
.light .btn-danger:hover{box-shadow:0 8px 24px rgba(220,38,38,.45);transform:translateY(-1px)}
.light .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;
  padding:5px 10px;border:1.5px solid var(--bdr);border-radius:7px;
  background:transparent;color:var(--txt3);cursor:pointer;font-size:10px;font-weight:600;transition:all .12s}
.light .btn-ghost:hover,.light .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(79,70,229,.07)}
.light .btn-ghost:disabled{opacity:.4;cursor:not-allowed}
.light .metric{border:1.5px solid rgba(79,70,229,.18);border-radius:9px;padding:11px 13px;background:rgba(79,70,229,.045)}
.light .lbl{font-size:9.5px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--acc);display:block;margin-bottom:5px}
.light .hint{font-size:13px;color:var(--txt2);line-height:1.75;padding:9px 12px;border-radius:8px;
  background:rgba(79,70,229,.06);border-left:2.5px solid rgba(79,70,229,.35)}
.light .ad-slot{background:rgba(79,70,229,.03);border:1.5px dashed rgba(79,70,229,.2);border-radius:9px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  color:var(--txt3);font-size:9px;letter-spacing:.1em;text-transform:uppercase}
.light .txa{background:#f5f7ff;border:1.5px solid var(--bdr);border-radius:9px;
  color:var(--txt);font-family:'Inter',sans-serif;font-size:14px;line-height:1.85;
  padding:14px 16px;outline:none;resize:none;width:100%;min-height:180px;transition:border-color .14s;
  box-shadow:inset 0 1px 4px rgba(0,0,0,.05)}
.light .txa:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(79,70,229,.1)}
.light .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);padding:13px 11px;
  overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.light .sec-title{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:var(--acc);margin-bottom:7px}
.light .chip{display:inline-block;padding:2px 7px;border-radius:6px;margin:2px 2px;
  background:rgba(79,70,229,.08);border:1.5px solid rgba(79,70,229,.18);
  font-size:13.5px;line-height:1.75;color:var(--txt)}
.light .chip.interim{background:rgba(124,58,237,.06);border-color:rgba(124,58,237,.18);
  color:var(--txt2);font-style:italic}
.light .session-row{border:1.5px solid var(--bdr);border-radius:9px;padding:12px 13px;
  background:rgba(79,70,229,.03);cursor:pointer;transition:border-color .14s}
.light .session-row:hover{border-color:var(--acc)}
.light .step-n{width:26px;height:26px;border-radius:50%;border:1.5px solid rgba(79,70,229,.3);
  background:rgba(79,70,229,.09);display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;color:var(--acc);flex-shrink:0}
.light .step-ln{background:rgba(79,70,229,.12);width:1.5px}

/* ══ SHARED ════════════════════════════════════════════════════════ */
.topbar{height:38px;position:sticky;top:0;z-index:300;display:flex;align-items:center;padding:0 12px;gap:7px;backdrop-filter:blur(14px)}
.dark .topbar{background:rgba(2,2,16,.97);border-bottom:1px solid var(--bdr)}
.light .topbar{background:rgba(255,255,255,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 8px rgba(79,70,229,.07)}
.prose p{font-size:13.5px;line-height:1.78;margin-bottom:12px;color:var(--txt2)}
.prose h3{font-size:16px;font-weight:800;margin:22px 0 9px;color:var(--txt)}
.prose ul,.prose ol{padding-left:20px;margin-bottom:12px}
.prose li{font-size:13.5px;line-height:1.72;margin-bottom:5px;color:var(--txt2)}
.prose strong{font-weight:700;color:var(--txt)}
`;

/* ═══ SVG ICONS (zero deps) ═══ */
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
  copy:   s=><Svg s={s} d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2","M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"]}/>,
  dl:     s=><Svg s={s} d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]}/>,
  trash:  s=><Svg s={s} d={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6","M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]}/>,
  ok:     s=><Svg s={s} d="M20 6 9 17l-5-5"/>,
  info:   s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 16v-4M12 8h.01"]}/>,
  search: s=><Svg s={s} d={["M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z","M16 16l4.5 4.5"]}/>,
  book:   s=><Svg s={s} d={["M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"]}/>,
  wave:   s=><Svg s={s} d={["M2 12h2","M6 6v12","M10 9v6","M14 4v16","M18 7v10","M22 12h2"]}/>,
  edit:   s=><Svg s={s} d={["M12 20h9","M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 13.5-13.5z"]}/>,
  clock:  s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 6v6l4 2"]}/>,
  lang:   s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M2 12h20","M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"]}/>,
  list:   s=><Svg s={s} d={["M8 6h13","M8 12h13","M8 18h13","M3 6h.01","M3 12h.01","M3 18h.01"]}/>,
};

/* ═══ LANGUAGES ═══ */
const LANGS = [
  { code:'en-US', label:'English (US)',       flag:'🇺🇸' },
  { code:'en-GB', label:'English (UK)',       flag:'🇬🇧' },
  { code:'es-ES', label:'Spanish',            flag:'🇪🇸' },
  { code:'fr-FR', label:'French',             flag:'🇫🇷' },
  { code:'de-DE', label:'German',             flag:'🇩🇪' },
  { code:'it-IT', label:'Italian',            flag:'🇮🇹' },
  { code:'pt-BR', label:'Portuguese (BR)',    flag:'🇧🇷' },
  { code:'ja-JP', label:'Japanese',           flag:'🇯🇵' },
  { code:'zh-CN', label:'Chinese (Simplified)',flag:'🇨🇳' },
  { code:'ko-KR', label:'Korean',             flag:'🇰🇷' },
  { code:'ar-SA', label:'Arabic',             flag:'🇸🇦' },
  { code:'hi-IN', label:'Hindi',              flag:'🇮🇳' },
  { code:'ru-RU', label:'Russian',            flag:'🇷🇺' },
  { code:'nl-NL', label:'Dutch',              flag:'🇳🇱' },
  { code:'tr-TR', label:'Turkish',            flag:'🇹🇷' },
  { code:'sv-SE', label:'Swedish',            flag:'🇸🇪' },
  { code:'pl-PL', label:'Polish',             flag:'🇵🇱' },
  { code:'vi-VN', label:'Vietnamese',         flag:'🇻🇳' },
];

/* ═══ WAVEFORM CANVAS ═══ */
function WaveCanvas({ active, dark }) {
  const ref = useRef();
  const rafRef = useRef();
  const hRef = useRef(new Array(60).fill(0.12));
  const tRef = useRef(new Array(60).fill(0.12));

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height;
    const N = 60;

    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      const bw = W / N;
      for (let i = 0; i < N; i++) {
        if (active) {
          // Organic wave: neighbour influence + noise
          const noise = Math.random();
          const influence = i > 0 ? hRef.current[i-1] * 0.3 : 0;
          tRef.current[i] = Math.min(1, Math.max(0.06,
            noise * 0.72 + influence + 0.06));
        } else {
          tRef.current[i] = 0.08 + 0.06 * Math.sin(i * 0.4 + Date.now() * 0.002);
        }
        hRef.current[i] += (tRef.current[i] - hRef.current[i]) * (active ? 0.22 : 0.06);
        const h = hRef.current[i] * H * 0.92;
        const x = i * bw + bw * 0.18;
        const bwR = bw * 0.64;
        const r = Math.min(3, bwR / 2);

        const grad = ctx.createLinearGradient(0, H/2 - h/2, 0, H/2 + h/2);
        if (dark) {
          grad.addColorStop(0, `rgba(176,0,224,${active ? 0.55 : 0.2})`);
          grad.addColorStop(0.5, `rgba(0,240,255,${active ? 0.95 : 0.35})`);
          grad.addColorStop(1, `rgba(176,0,224,${active ? 0.55 : 0.2})`);
        } else {
          grad.addColorStop(0, `rgba(124,58,237,${active ? 0.45 : 0.15})`);
          grad.addColorStop(0.5, `rgba(79,70,229,${active ? 0.92 : 0.3})`);
          grad.addColorStop(1, `rgba(124,58,237,${active ? 0.45 : 0.15})`);
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, H/2 - h/2, bwR, h, r);
        ctx.fill();

        if (dark && active && hRef.current[i] > 0.5) {
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, dark]);

  return (
    <canvas ref={ref} width={680} height={72}
      style={{width:'100%', height:72, display:'block', borderRadius: dark ? 3 : 8}}/>
  );
}

/* ═══ COPY BUTTON ═══ */
function CopyBtn({ text, dark }) {
  const [ok, setOk] = useState(false);
  const doCopy = () => {
    try { navigator.clipboard.writeText(text); } catch(e) {}
    setOk(true); setTimeout(() => setOk(false), 1500);
  };
  return (
    <button className="btn-ghost" disabled={!text} onClick={doCopy}>
      {ok ? I.ok(10) : I.copy(10)} {ok ? 'Copied!' : 'Copy'}
    </button>
  );
}

/* ═══ STEPS ═══ */
function Steps({ items, dark }) {
  return (
    <div>
      {items.map((s, i) => (
        <div key={i} style={{display:'flex',gap:10,marginBottom: i < items.length-1 ? 16 : 0}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
            <div className="step-n">{i+1}</div>
            {i < items.length-1 && <div className="step-ln" style={{flex:1,marginTop:5,minHeight:12}}/>}
          </div>
          <div style={{flex:1,paddingTop:2}}>
            <div style={{fontSize:13,fontWeight:700,color:'var(--txt)',marginBottom:3}}>{s.t}</div>
            <div style={{fontSize:12.5,color:'var(--txt2)',lineHeight:1.72}}>{s.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══ TEXT STATS ═══ */
function getStats(text) {
  if (!text.trim()) return { words:0, chars:0, sentences:0, readTime:'0s' };
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const sentences = (text.match(/[.!?]+/g)||[]).length || (words > 0 ? 1 : 0);
  const secs = Math.round(words / 2.5);
  const readTime = secs < 60 ? `${secs}s` : `${Math.floor(secs/60)}m ${secs%60}s`;
  return { words, chars, sentences, readTime };
}

/* ═══ FORMAT TIME ═══ */
const fmt = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════ */
export default function AudioToText() {
  const [mode, setMode] = useState('dark');
  const dark = mode === 'dark';

  // Recording state
  const [lang, setLang] = useState('en-US');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [micErr, setMicErr] = useState('');
  const [supported, setSupported] = useState(true);

  // UI state
  const [pageTab, setPageTab] = useState('recorder');
  const [sessions, setSessions] = useState([]);
  const [expandedSession, setExpandedSession] = useState(null);
  const [searchQ, setSearchQ] = useState('');
  const [copyOk, setCopyOk] = useState(false);

  // Refs
  const recRef = useRef(null);
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const tAreaRef = useRef(null);
  const sessionCount = useRef(0);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setSupported(false);
  }, []);

  /* ── build recognition instance ── */
  const buildRec = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = lang;
    r.maxAlternatives = 1;

    r.onresult = e => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) {
          setFinalText(p => p + res[0].transcript + ' ');
          const conf = res[0].confidence;
          if (conf) setConfidence(Math.round(conf * 100));
          setInterimText('');
        } else {
          interim += res[0].transcript;
        }
      }
      setInterimText(interim);
      setTimeout(() => {
        if (tAreaRef.current) tAreaRef.current.scrollTop = tAreaRef.current.scrollHeight;
      }, 20);
    };

    r.onerror = e => {
      const map = {
        'not-allowed': '🔒 Microphone permission denied. Click the lock icon in your browser address bar.',
        'no-speech':   '🤫 No speech detected. Please speak louder or closer to the mic.',
        'network':     '🌐 Network error — check your connection.',
        'aborted':     '',
      };
      if (e.error !== 'aborted') setMicErr(map[e.error] || `Error: ${e.error}`);
      setIsRecording(false); setIsPaused(false);
      clearInterval(timerRef.current);
    };

    // auto-restart for continuous recording
    r.onend = () => {
      if (recRef._keepAlive) {
        try { r.start(); } catch(ex) {}
      }
    };

    return r;
  }, [lang]);

  /* ── start ── */
  const startRecording = () => {
    setMicErr('');
    const r = buildRec(); if (!r) return;
    recRef.current = r;
    recRef._keepAlive = true;
    try {
      r.start();
      setIsRecording(true); setIsPaused(false);
      setFinalText(''); setInterimText(''); setConfidence(0); setElapsed(0);
      startRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
      }, 500);
    } catch(e) {
      setMicErr('Could not access microphone. Please refresh and allow permission.');
    }
  };

  /* ── pause ── */
  const pauseRecording = () => {
    recRef._keepAlive = false;
    if (recRef.current) { try { recRef.current.stop(); } catch(e) {} }
    setIsPaused(true);
    clearInterval(timerRef.current);
  };

  /* ── resume ── */
  const resumeRecording = () => {
    const r = buildRec(); if (!r) return;
    recRef.current = r;
    recRef._keepAlive = true;
    try {
      r.start(); setIsPaused(false);
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
      }, 500);
    } catch(e) {}
  };

  /* ── stop ── */
  const stopRecording = useCallback(() => {
    recRef._keepAlive = false;
    if (recRef.current) { try { recRef.current.stop(); } catch(e) {} }
    setIsRecording(false); setIsPaused(false);
    setInterimText('');
    clearInterval(timerRef.current);

    setFinalText(ft => {
      const clean = ft.trim();
      if (clean) {
        sessionCount.current += 1;
        const langObj = LANGS.find(l => l.code === lang);
        setSessions(prev => [{
          id: Date.now(),
          num: sessionCount.current,
          text: clean,
          lang: langObj?.label || lang,
          flag: langObj?.flag || '🌐',
          duration: elapsed,
          words: getStats(clean).words,
          date: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),
          conf: confidence,
        }, ...prev]);
      }
      return ft;
    });
  }, [lang, elapsed, confidence]);

  /* ── download ── */
  const download = (text, name='transcript.txt') => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], {type:'text/plain'}));
    a.download = name; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const fullText = finalText + interimText;
  const stats = useMemo(() => getStats(fullText), [fullText]);
  const langObj = LANGS.find(l => l.code === lang);
  const filteredSessions = searchQ
    ? sessions.filter(s => s.text.toLowerCase().includes(searchQ.toLowerCase()))
    : sessions;

  const PAGE_TABS = [
    { id:'recorder', label:'🎙 Recorder' },
    { id:'sessions', label:`📂 Sessions${sessions.length ? ` (${sessions.length})` : ''}` },
    { id:'guide',    label:'📖 How to Use' },
    { id:'learn',    label:'🧠 Learn' },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className={dark ? 'dark' : 'light'}>
        {dark && <div className="scanline"/>}

        {/* ══ TOP BAR ══════════════════════════════════════════════ */}
        <div className="topbar">
          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <div style={{
              width:24,height:24,borderRadius: dark?3:7,
              background: dark?'transparent':'linear-gradient(135deg,#4f46e5,#7c3aed)',
              border: dark?'1px solid var(--acc)':'none',
              display:'flex',alignItems:'center',justifyContent:'center',
              color: dark?'var(--acc)':'#fff',
              boxShadow: dark?'0 0 10px rgba(0,240,255,.22)':'0 2px 8px rgba(79,70,229,.4)'}}>
              {I.mic(13)}
            </div>
            <span style={{fontSize:13,fontWeight:800,color:'var(--txt)',letterSpacing: dark?'.04em':'-.01em'}}>
              Speech<span style={{color:'var(--acc)'}}>Scribe</span>
            </span>
            <span style={{
              fontSize:7.5,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',
              padding:'1px 5px',borderRadius: dark?2:4,
              border: dark?'1px solid rgba(0,240,255,.2)':'1.5px solid rgba(79,70,229,.22)',
              color: dark?'rgba(0,240,255,.5)':'var(--acc)',
              background: dark?'rgba(0,240,255,.04)':'rgba(79,70,229,.06)'}}>
              {LANGS.length} langs
            </span>
          </div>
          <div style={{flex:1}}/>

          {/* Recording pill */}
          {isRecording && !isPaused && (
            <div style={{display:'flex',alignItems:'center',gap:5,padding:'3px 9px',
              borderRadius: dark?3:7,
              border: dark?'1px solid rgba(244,63,94,.35)':'1.5px solid rgba(220,38,38,.25)',
              background: dark?'rgba(244,63,94,.09)':'rgba(220,38,38,.06)'}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:'var(--err)',
                animation:'blink 1s ease-in-out infinite'}}/>
              <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'.1em',color:'var(--err)'}}>
                REC {fmt(elapsed)}
              </span>
            </div>
          )}
          {isPaused && (
            <div style={{padding:'3px 9px',borderRadius: dark?3:7,
              border:'1px solid rgba(245,158,11,.35)',background:'rgba(245,158,11,.08)'}}>
              <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'.1em',color:'#f59e0b'}}>
                ⏸ PAUSED {fmt(elapsed)}
              </span>
            </div>
          )}

          {/* Theme toggle */}
          <button onClick={() => setMode(dark?'light':'dark')} style={{
            display:'flex',alignItems:'center',gap:6,padding:'5px 11px',
            border: dark?'1px solid rgba(0,240,255,.18)':'1.5px solid var(--bdr)',
            borderRadius: dark?3:8, background: dark?'rgba(0,240,255,.03)':'var(--sur)',
            cursor:'pointer',transition:'all .14s'}}>
            {dark ? (
              <><div style={{width:28,height:15,borderRadius:8,background:'var(--acc)',position:'relative',
                boxShadow:'0 0 8px rgba(0,240,255,.5)'}}>
                <div style={{position:'absolute',top:2.5,right:2.5,width:10,height:10,
                  borderRadius:'50%',background:'#020210'}}/>
              </div>
              <span style={{fontSize:9.5,fontWeight:700,color:'rgba(0,240,255,.6)',letterSpacing:'.1em'}}>NEON</span></>
            ) : (
              <><span style={{fontSize:10.5,color:'var(--txt3)',fontWeight:600}}>Light</span>
              <div style={{width:28,height:15,borderRadius:8,background:'#d1d5db',position:'relative'}}>
                <div style={{position:'absolute',top:2.5,left:2.5,width:10,height:10,
                  borderRadius:'50%',background:'#9ca3af'}}/>
              </div></>
            )}
          </button>
        </div>

        {/* ══ PAGE TABS ════════════════════════════════════════════ */}
        <div className="tab-bar" style={{display:'flex',overflowX:'auto'}}>
          {PAGE_TABS.map(t => (
            <button key={t.id} className={`tab ${pageTab===t.id?'on':''}`}
              onClick={() => setPageTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* ══ BODY ═════════════════════════════════════════════════ */}
        <div className="tool-layout-grid">

          {/* ── SIDEBAR ── */}
          <div className="sidebar">

            {/* Language */}
            <div>
              <div className="sec-title">{I.lang(9)} Language</div>
              <select className="sel" value={lang}
                onChange={e => { setLang(e.target.value); if(isRecording) stopRecording(); }}>
                {LANGS.map(l => (
                  <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
                ))}
              </select>
              <div style={{fontSize:10,color:'var(--txt3)',marginTop:5,lineHeight:1.5}}>
                Active: <span style={{color:'var(--acc)',fontWeight:700}}>{langObj?.flag} {langObj?.label}</span>
              </div>
            </div>

            {/* Live stats */}
            {(isRecording || finalText) && (
              <div>
                <div className="sec-title">{I.wave(9)} Live Stats</div>
                {[
                  {l:'Words',      v: stats.words,      c: dark?'#00f0ff':'#4f46e5'},
                  {l:'Characters', v: stats.chars,      c: dark?'#22c55e':'#16a34a'},
                  {l:'Sentences',  v: stats.sentences,  c: dark?'#f59e0b':'#d97706'},
                  {l:'Read time',  v: stats.readTime,   c: dark?'#b000e0':'#7c3aed'},
                  ...(confidence ? [{l:'Confidence', v:`${confidence}%`,
                    c: confidence>80 ? (dark?'#22c55e':'#16a34a') : (dark?'#f59e0b':'#d97706')}] : []),
                ].map(({l,v,c}) => (
                  <div key={l} className="metric" style={{marginBottom:5}}>
                    <div style={{fontSize:8.5,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',
                      color:'var(--txt3)',marginBottom:2}}>{l}</div>
                    <div style={{fontSize:17,fontWeight:800,fontFamily:'JetBrains Mono,monospace',color:c}}>{v}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Tips */}
            <div>
              <div className="sec-title">{I.info(9)} Tips</div>
              {[
                'Speak at normal pace — don\'t over-enunciate',
                'Reduce background noise for better accuracy',
                'Use a USB or headset mic for best results',
                'Pause any time mid-session without losing text',
                'Edit the transcript before downloading',
                'Sessions are saved automatically after stopping',
              ].map((t,i) => (
                <div key={i} style={{fontSize:11,color:'var(--txt2)',lineHeight:1.65,marginBottom:5,
                  paddingLeft:10,
                  borderLeft: dark?'1px solid rgba(0,240,255,.15)':'1.5px solid rgba(79,70,229,.2)'}}>
                  {t}
                </div>
              ))}
            </div>

          </div>

          {/* ── MAIN ── */}
          <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:13}}>
            <AnimatePresence mode="wait">

              {/* ══════════════════════════ RECORDER TAB ══════════════════════════ */}
              {pageTab==='recorder' && (
                <motion.div key="recorder" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>

                  {/* Browser support warning */}
                  {!supported && (
                    <div style={{padding:'12px 16px',
                      border: dark?'1px solid rgba(244,63,94,.3)':'1.5px solid rgba(220,38,38,.25)',
                      borderRadius: dark?4:9,
                      background: dark?'rgba(244,63,94,.07)':'rgba(220,38,38,.05)',
                      fontSize:13,color:'var(--err)',display:'flex',gap:8,alignItems:'flex-start'}}>
                      {I.info(15)}
                      <span><b>Web Speech API not supported</b> in this browser. Please use Chrome, Edge, or Safari.</span>
                    </div>
                  )}

                  {/* Mic error */}
                  {micErr && (
                    <div style={{padding:'10px 14px',
                      border: dark?'1px solid rgba(244,63,94,.25)':'1.5px solid rgba(220,38,38,.2)',
                      borderRadius: dark?4:8,
                      background: dark?'rgba(244,63,94,.06)':'rgba(220,38,38,.04)',
                      fontSize:12.5,color:'var(--err)',display:'flex',gap:7,alignItems:'center'}}>
                      {I.info(13)} {micErr}
                    </div>
                  )}

                  {/* ── Main recorder panel ── */}
                  <div className="panel" style={{padding:'18px 18px 16px'}}>

                    {/* Waveform */}
                    <WaveCanvas active={isRecording && !isPaused} dark={dark}/>

                    {/* Big mic / stop button with ripples */}
                    <div style={{display:'flex',justifyContent:'center',margin:'20px 0 16px',position:'relative'}}>
                      <div style={{position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>

                        {/* Ripple rings */}
                        {isRecording && !isPaused && [0,1,2].map(i => (
                          <div key={i} style={{
                            position:'absolute',
                            width: 108 + i*28, height: 108 + i*28,
                            borderRadius:'50%',
                            border: dark
                              ? `1px solid rgba(0,240,255,${0.32 - i*0.09})`
                              : `1px solid rgba(79,70,229,${0.26 - i*0.07})`,
                            animation: `ripple ${1.4 + i*0.45}s ease-out ${i*0.28}s infinite`,
                            pointerEvents:'none'}}/>
                        ))}

                        {!isRecording ? (
                          /* START */
                          <button onClick={startRecording} disabled={!supported}
                            style={{
                              width:100,height:100,borderRadius:'50%',
                              background: dark
                                ? 'radial-gradient(circle,rgba(0,240,255,.14) 0%,rgba(0,240,255,.04) 100%)'
                                : 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                              border: dark?'1.5px solid var(--acc)':'none',
                              color: dark?'var(--acc)':'#fff',
                              cursor:'pointer',display:'flex',flexDirection:'column',
                              alignItems:'center',justifyContent:'center',gap:6,
                              animation: dark?'pulseglow 2.4s ease-in-out infinite':'pulseglow-light 2.4s ease-in-out infinite',
                              boxShadow: dark?'none':'0 8px 28px rgba(79,70,229,.42)',
                              transition:'all .18s'}}>
                            {I.mic(30)}
                            <span style={{fontSize:8.5,fontWeight:800,letterSpacing:'.12em',textTransform:'uppercase',
                              marginTop:1}}>Tap to Start</span>
                          </button>
                        ) : (
                          /* STOP (recording or paused) */
                          <button onClick={stopRecording}
                            style={{
                              width:100,height:100,borderRadius:'50%',
                              background: dark
                                ? 'radial-gradient(circle,rgba(244,63,94,.18) 0%,rgba(244,63,94,.06) 100%)'
                                : 'linear-gradient(135deg,#ef4444,#dc2626)',
                              border: dark?'1.5px solid var(--err)':'none',
                              color: dark?'var(--err)':'#fff',
                              cursor:'pointer',display:'flex',flexDirection:'column',
                              alignItems:'center',justifyContent:'center',gap:6,
                              boxShadow: dark?'0 0 28px rgba(244,63,94,.22)':'0 8px 28px rgba(220,38,38,.42)',
                              transition:'all .18s'}}>
                            {isPaused ? I.play(28) : I.stop(26)}
                            <span style={{fontSize:8.5,fontWeight:800,letterSpacing:'.1em',textTransform:'uppercase',marginTop:1}}>
                              {isPaused ? 'Paused' : 'Recording'}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Pause / Resume controls */}
                    {isRecording && (
                      <div style={{display:'flex',justifyContent:'center',gap:8,marginBottom:16}}>
                        {!isPaused ? (
                          <button className="btn-ghost" onClick={pauseRecording}
                            style={{padding:'7px 16px',fontSize:11}}>
                            {I.pause(11)} Pause
                          </button>
                        ) : (
                          <button className="btn-primary" onClick={resumeRecording}
                            style={{padding:'7px 16px'}}>
                            {I.play(11)} Resume
                          </button>
                        )}
                        <button className="btn-danger" onClick={stopRecording}
                          style={{padding:'7px 14px',fontSize:11}}>
                          {I.stop(10)} Finish & Save
                        </button>
                      </div>
                    )}

                    {/* Transcript area header */}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                      <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',
                        color: dark?'rgba(0,240,255,.5)':'var(--acc)',
                        display:'flex',alignItems:'center',gap:5}}>
                        {I.edit(10)} Transcript
                        {isRecording && !isPaused && (
                          <span style={{display:'inline-flex',gap:1.5,alignItems:'flex-end',height:13}}>
                            {[1,2,3,4,5].map(i => (
                              <span key={i} style={{
                                display:'inline-block',width:3,borderRadius:1.5,
                                background: dark?'var(--acc)':'var(--acc)',
                                animationName:'waveIn',animationDuration:'.6s',
                                animationTimingFunction:'ease-in-out',
                                animationIterationCount:'infinite',
                                animationDirection:'alternate',
                                animationDelay:`${i*0.1}s`,
                                height: 4 + Math.random()*8,
                                transformOrigin:'bottom'}}/>
                            ))}
                          </span>
                        )}
                      </span>
                      <div style={{display:'flex',gap:5,alignItems:'center'}}>
                        <CopyBtn text={fullText} dark={dark}/>
                        <button className="btn-ghost" disabled={!fullText}
                          onClick={() => { setFinalText(''); setInterimText(''); }}>
                          {I.trash(10)} Clear
                        </button>
                      </div>
                    </div>

                    {/* Transcript area */}
                    <div ref={tAreaRef} className="txa"
                      style={{maxHeight:260,overflowY:'auto',userSelect:'text'}}>
                      {!finalText && !interimText ? (
                        <span style={{color:'var(--txt3)',fontStyle:'italic',fontSize:13.5}}>
                          {isRecording
                            ? '🎙 Listening… start speaking'
                            : 'Tap the microphone to start transcribing…'}
                        </span>
                      ) : (
                        <>
                          <span style={{color:'var(--txt)'}}>{finalText}</span>
                          {interimText && (
                            <span style={{
                              color: dark?'rgba(168,184,216,.55)':'rgba(107,114,128,.65)',
                              fontStyle:'italic'}}>
                              {interimText}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:12}}>
                      <button className="btn-primary" disabled={!fullText}
                        onClick={() => download(fullText)}
                        style={{flex:'1 1 120px'}}>
                        {I.dl(11)} Download .txt
                      </button>
                      <button className="btn-ghost" disabled={!fullText}
                        onClick={() => download(fullText,'transcript.md')}
                        style={{flex:'1 1 100px'}}>
                        {I.dl(10)} Save .md
                      </button>
                      <CopyBtn text={fullText} dark={dark}/>
                    </div>
                  </div>

                  {/* Stats row */}
                  {fullText && (
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:9}}>
                      {[
                        {l:'Words',      v:stats.words,     c:dark?'#00f0ff':'#4f46e5'},
                        {l:'Characters', v:stats.chars,     c:dark?'#22c55e':'#16a34a'},
                        {l:'Sentences',  v:stats.sentences, c:dark?'#f59e0b':'#d97706'},
                        {l:'Read Time',  v:stats.readTime,  c:dark?'#b000e0':'#7c3aed'},
                      ].map(({l,v,c}) => (
                        <div key={l} className="panel" style={{padding:'10px 12px'}}>
                          <div style={{fontSize:8.5,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',
                            color:'var(--txt3)',marginBottom:4}}>{l}</div>
                          <div style={{fontSize:19,fontWeight:800,fontFamily:'JetBrains Mono,monospace',color:c}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* How it works */}
                  <div className="panel" style={{padding:15}}>
                    <span className="lbl">{I.wave(10)} How Transcription Works</span>
                    <Steps dark={dark} items={[
                      {t:'Acoustic Modelling', d:'Your voice is broken into phonemes — the smallest units of sound — using neural acoustic models running in your browser or browser provider\'s service.'},
                      {t:'Language Model Matching', d:'Phonemes are matched against a statistical language model (dictionary + grammar rules) to find the most likely sequence of words in context.'},
                      {t:'Interim vs. Final Results', d:'Grey italic text = interim guess in real-time. White text = finalised — the engine uses lookahead context to self-correct earlier predictions.'},
                      {t:'Privacy First', d:'Audio is processed by your browser\'s built-in speech engine (Google for Chrome, Apple for Safari). We never receive your audio on our servers.'},
                    ]}/>
                  </div>

                </motion.div>
              )}

              {/* ══════════════════════════ SESSIONS TAB ══════════════════════════ */}
              {pageTab==='sessions' && (
                <motion.div key="sessions" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:11}}>

                  {/* Search + clear */}
                  <div style={{display:'flex',gap:9,alignItems:'center'}}>
                    <div style={{flex:1,position:'relative'}}>
                      <div style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',
                        color:'var(--txt3)',pointerEvents:'none'}}>{I.search(13)}</div>
                      <input className="inp" placeholder="Search transcripts…" value={searchQ}
                        onChange={e=>setSearchQ(e.target.value)} style={{paddingLeft:32}}/>
                    </div>
                    {sessions.length > 0 && (
                      <button className="btn-ghost" onClick={()=>setSessions([])}
                        style={{borderColor:dark?'rgba(244,63,94,.25)':'rgba(220,38,38,.25)',color:'var(--err)'}}>
                        {I.trash(11)} Clear All
                      </button>
                    )}
                  </div>

                  {/* Summary cards */}
                  {sessions.length > 0 && (
                    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9}}>
                      {[
                        {l:'Sessions',     v:sessions.length,                              c:dark?'#00f0ff':'#4f46e5'},
                        {l:'Total Words',  v:sessions.reduce((s,x)=>s+x.words,0),          c:dark?'#22c55e':'#16a34a'},
                        {l:'Total Time',   v:fmt(sessions.reduce((s,x)=>s+x.duration,0)), c:dark?'#f59e0b':'#d97706'},
                      ].map(({l,v,c}) => (
                        <div key={l} className="panel" style={{padding:'10px 12px'}}>
                          <div style={{fontSize:8.5,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',
                            color:'var(--txt3)',marginBottom:4}}>{l}</div>
                          <div style={{fontSize:18,fontWeight:800,fontFamily:'JetBrains Mono,monospace',color:c}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Session list */}
                  {filteredSessions.length === 0 ? (
                    <div className="panel" style={{padding:32,textAlign:'center'}}>
                      <div style={{fontSize:36,marginBottom:10}}>{sessions.length?'🔍':'🎙️'}</div>
                      <div style={{fontSize:14,fontWeight:700,color:'var(--txt)',marginBottom:5}}>
                        {sessions.length ? 'No sessions match your search' : 'No sessions yet'}
                      </div>
                      <div style={{fontSize:12.5,color:'var(--txt2)'}}>
                        {sessions.length
                          ? 'Try a different keyword'
                          : 'Record something in the Recorder tab — sessions save automatically when you stop.'}
                      </div>
                    </div>
                  ) : filteredSessions.map(s => (
                    <div key={s.id} className="session-row"
                      onClick={() => setExpandedSession(expandedSession===s.id ? null : s.id)}>
                      {/* Row header */}
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                        <div style={{display:'flex',gap:9,alignItems:'center'}}>
                          <span style={{fontSize:22}}>{s.flag}</span>
                          <div>
                            <div style={{fontSize:12.5,fontWeight:700,color:'var(--txt)'}}>
                              Session #{s.num} · {s.lang}
                            </div>
                            <div style={{fontSize:10,color:'var(--txt3)',fontFamily:'JetBrains Mono,monospace',marginTop:1}}>
                              {s.date} · {s.words} words · {fmt(s.duration)} · {s.conf || '?'}% conf
                            </div>
                          </div>
                        </div>
                        <div style={{display:'flex',gap:5}} onClick={e=>e.stopPropagation()}>
                          <CopyBtn text={s.text} dark={dark}/>
                          <button className="btn-ghost" onClick={()=>download(s.text,`session-${s.num}.txt`)}>
                            {I.dl(10)}
                          </button>
                          <button className="btn-ghost"
                            style={{borderColor:dark?'rgba(244,63,94,.2)':'rgba(220,38,38,.2)',color:'var(--err)'}}
                            onClick={()=>setSessions(prev=>prev.filter(x=>x.id!==s.id))}>
                            {I.trash(10)}
                          </button>
                        </div>
                      </div>

                      {/* Expandable text */}
                      <AnimatePresence>
                        {expandedSession===s.id ? (
                          <motion.div key="exp" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}}
                            exit={{height:0,opacity:0}} style={{overflow:'hidden'}}>
                            <div className="txa" style={{marginTop:6,fontSize:13.5,cursor:'text',minHeight:60}}>
                              {s.text}
                            </div>
                          </motion.div>
                        ) : (
                          <div style={{fontSize:13,color:'var(--txt2)',lineHeight:1.55,
                            overflow:'hidden',display:'-webkit-box',
                            WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>
                            {s.text}
                          </div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                </motion.div>
              )}

              {/* ══════════════════════════ HOW TO USE TAB ══════════════════════════ */}
              {pageTab==='guide' && (
                <motion.div key="guide" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:11}}>

                  <div className="hint" style={{display:'flex',gap:7,alignItems:'flex-start'}}>
                    {I.info(14)}
                    <span>SpeechScribe uses your browser's built-in Web Speech API. Audio processing happens in your browser — no audio is uploaded to our servers.</span>
                  </div>

                  {[
                    ['Choose a Language', 'Select from 18 supported languages in the sidebar. The language model switches instantly — no restart needed.'],
                    ['Tap the Microphone', 'Press the large glowing mic button to begin. Your browser will request microphone permission — click Allow.'],
                    ['Speak Naturally', 'Talk at a normal conversational pace. The waveform visualiser confirms audio is being captured. Grey italic text = live interim result.'],
                    ['Pause Any Time', 'Hit Pause to take a break without losing progress. Resume picks up exactly where you left off.'],
                    ['Finish & Save', 'Click Finish & Save to stop recording. Your session is automatically saved to the Sessions tab with stats.'],
                    ['Edit the Transcript', 'The transcript area is readable inline. After stopping, copy-paste it anywhere or download directly.'],
                    ['Download or Copy', 'Use Download .txt for plain text, Save .md for Markdown, or Copy All to paste into any app.'],
                    ['Browse Sessions', 'The Sessions tab stores all recordings this visit with word count, duration, confidence score, and expand/copy/delete controls.'],
                  ].map(([t,b],i) => (
                    <div key={i} className="panel" style={{padding:14}}>
                      <div style={{display:'flex',gap:11,alignItems:'flex-start'}}>
                        <div style={{width:32,height:32,borderRadius: dark?3:9,flexShrink:0,
                          background: dark?'rgba(0,240,255,.07)':'rgba(79,70,229,.09)',
                          border: dark?'1px solid rgba(0,240,255,.2)':'1.5px solid rgba(79,70,229,.22)',
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

              {/* ══════════════════════════ LEARN TAB ══════════════════════════ */}
              {pageTab==='learn' && (
                <motion.div key="learn" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <div className="panel" style={{padding:'22px 24px'}}>
                    <h1 style={{fontSize:22,fontWeight:900,color:'var(--txt)',marginBottom:5,letterSpacing:'-.02em'}}>
                      Speech-to-Text: The Complete Guide
                    </h1>
                    <p style={{fontSize:12,color:'var(--txt3)',marginBottom:22}}>
                      Web Speech API · Acoustic Models · Lecture Notes · Accessibility · Privacy
                    </p>
                    <div className="prose">
                      <p>Modern browser-based speech-to-text converts spoken audio into written text using neural network models — all running on your device or via your browser provider's secure service, with no third-party server involvement.</p>

                      <h3>How the Web Speech API Pipeline Works</h3>
                      <p>The pipeline has three stages: (1) <strong>Acoustic Model</strong> — converts raw audio waveform into feature vectors (MFCCs) representing phonemes; (2) <strong>Language Model</strong> — assigns probabilities to word sequences given those phonemes using a neural LM; (3) <strong>Decoder</strong> — finds the most likely word sequence via beam search, with lookahead to correct earlier guesses.</p>

                      <h3>Tips for Maximum Accuracy</h3>
                      <ul>
                        <li><strong>Microphone quality:</strong> A USB condenser mic dramatically outperforms a built-in laptop mic. Even earbuds with inline mic help.</li>
                        <li><strong>Environment:</strong> Every noise source reduces Word Error Rate (WER). A quiet room can improve accuracy by 30–50%.</li>
                        <li><strong>Speaking pace:</strong> Slightly slower than conversational speed gives the model more context per word. Don't over-articulate.</li>
                        <li><strong>Technical vocabulary:</strong> Domain-specific terms (medical, legal, scientific) may need manual correction — general STT models aren't specialised.</li>
                        <li><strong>Punctuation commands:</strong> Say "comma", "period", "new paragraph" — Chrome supports many punctuation voice commands natively.</li>
                      </ul>

                      <h3>Using STT for Lecture & Meeting Notes</h3>
                      <p>Instead of writing while listening, capture 100% of spoken content and focus on understanding. After the session, use Ctrl+F to find specific terms or exam dates. Export to .md for Obsidian, Notion, or any markdown note app.</p>

                      <h3>Accessibility Benefits</h3>
                      <p>STT is critical for users with motor impairments, dyslexia, or for non-native speakers who find typing slow. Real-time transcription also supports users who are hard of hearing in live meetings.</p>

                      <h3>Frequently Asked Questions</h3>
                      {[
                        {q:'Is my voice sent to a server?', a:'In Chrome, audio is processed by Google\'s speech service. In Safari, by Apple\'s. We never receive your audio — no audio touches our infrastructure. Check your browser\'s privacy policy for their STT processing details.'},
                        {q:'Which browser has the best accuracy?', a:'Chrome on desktop generally offers the highest accuracy for English and most European languages. Edge (Chromium) is equivalent. Safari supports it on macOS/iOS. Firefox does not currently support the Web Speech API.'},
                        {q:'Why does it stop after silence?', a:'The API has a built-in silence timeout. SpeechScribe automatically restarts recognition, so you get seamless continuous transcription even through pauses.'},
                        {q:'Can it handle multiple speakers?', a:'The API transcribes as a single stream — it doesn\'t natively diarise (label) different speakers. For multi-speaker transcription with speaker labels, consider OpenAI Whisper + pyannote diarisation.'},
                        {q:'What\'s the difference between interim and final?', a:'Interim (grey italic) = real-time best guess as audio is processed. Final (white) = committed result after the model has used future context to self-correct. Final text is significantly more accurate.'},
                        {q:'How do I get punctuation in my transcript?', a:'Say "comma", "period", "question mark", "exclamation mark", or "new line" while recording in Chrome. These are converted to punctuation automatically.'},
                      ].map(({q,a},i) => (
                        <div key={i} style={{padding:'12px 14px',marginBottom:9,
                          background: dark?'rgba(0,0,0,.35)':'#f0f3ff',
                          border: dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          borderRadius: dark?3:9}}>
                          <div style={{fontSize:13.5,fontWeight:700,color:'var(--txt)',marginBottom:5}}>{q}</div>
                          <div style={{fontSize:13,color:'var(--txt2)',lineHeight:1.72}}>{a}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </motion.div>
              )}

            </AnimatePresence>
          </div>{/* end main */}
        </div>{/* end grid */}
      </div>
    </>
  );
}