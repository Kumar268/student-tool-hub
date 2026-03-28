import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as math from 'mathjs';

/* ═══════════════════════════════════════════════════════════════════
   STYLES — HIGH-CONTRAST DUAL THEME
   Dark:  deep navy/black bg, bright text, cyan accent
   Light: true white cards on VISIBLE slate-blue bg, dark text, indigo
═══════════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{overflow-x:hidden;font-family:'Inter',sans-serif}

@keyframes scanline{0%{top:-3px}100%{top:102%}}
@keyframes gridmove{from{background-position:0 0}to{background-position:40px 40px}}
@keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
.fadeup{animation:fadeup .22s ease both}

/* ═══ DARK / NEON ═══════════════════════════════════════════════ */
.dark{
  --bg:#020210;--sur:#080820;--s2:#0d0d2a;
  --bdr:#1e1e44;--bdr2:rgba(0,240,255,.2);
  --acc:#00f0ff;--acc2:#b000e0;--acc3:#f59e0b;
  --ok:#22c55e;--err:#f43f5e;
  --txt:#f0f4ff;--txt2:#a8b8d8;--txt3:#5a6a96;
  --mat-bg:rgba(0,0,0,.55);--mat-bdr:#1e1e44;
  --mat-focus:rgba(0,240,255,.12);
  background:var(--bg);color:var(--txt);
  background-image:
    linear-gradient(rgba(0,240,255,.011) 1px,transparent 1px),
    linear-gradient(90deg,rgba(0,240,255,.011) 1px,transparent 1px);
  background-size:40px 40px;animation:gridmove 14s linear infinite
}
.scanline{position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:9999;
  background:linear-gradient(90deg,transparent,rgba(0,240,255,.5),transparent);
  box-shadow:0 0 10px rgba(0,240,255,.3);animation:scanline 8s linear infinite;top:-3px}
.dark .panel{background:linear-gradient(145deg,var(--sur),var(--s2));
  border:1px solid var(--bdr);border-radius:5px;position:relative;overflow:hidden}
.dark .panel::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,240,255,.18),transparent);pointer-events:none}
.dark .inp{background:var(--mat-bg);border:1px solid var(--mat-bdr);border-radius:3px;
  color:var(--txt);font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:600;
  padding:0;outline:none;transition:all .15s;text-align:center;width:100%;height:44px}
.dark .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px var(--mat-focus);z-index:1;position:relative}
.dark .cell-inp{background:var(--mat-bg);border:1px solid var(--mat-bdr);border-radius:3px;
  color:var(--txt);font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:700;
  outline:none;text-align:center;width:100%;height:48px;transition:all .14s;padding:0 4px}
.dark .cell-inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px var(--mat-focus);
  background:rgba(0,240,255,.06);z-index:2;position:relative}
.dark .tab-bar{background:var(--sur);border-bottom:1px solid var(--bdr)}
.dark .tab{height:40px;padding:0 16px;border:none;border-bottom:2px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;
  font-size:11px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;
  transition:all .15s;display:flex;align-items:center;gap:5px;white-space:nowrap}
.dark .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(0,240,255,.05)}
.dark .tab:hover:not(.on){color:var(--txt2);background:rgba(255,255,255,.02)}
.dark .btn-primary{display:inline-flex;align-items:center;gap:6px;padding:9px 20px;
  border:1px solid var(--acc);border-radius:3px;background:rgba(0,240,255,.1);
  color:var(--acc);cursor:pointer;font-size:11px;font-weight:700;letter-spacing:.1em;
  text-transform:uppercase;box-shadow:0 0 14px rgba(0,240,255,.1);transition:all .16s}
.dark .btn-primary:hover{background:rgba(0,240,255,.18);box-shadow:0 0 26px rgba(0,240,255,.25);transform:translateY(-1px)}
.dark .btn-ghost{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;
  border:1px solid var(--bdr);border-radius:3px;background:transparent;
  color:var(--txt3);cursor:pointer;font-size:10px;font-weight:600;transition:all .12s}
.dark .btn-ghost:hover,.dark .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(0,240,255,.06)}
.dark .btn-icon{width:30px;height:30px;border-radius:3px;border:1px solid var(--bdr);
  background:transparent;color:var(--txt3);cursor:pointer;display:flex;align-items:center;
  justify-content:center;transition:all .12s;flex-shrink:0}
.dark .btn-icon:hover{border-color:var(--acc);color:var(--acc);background:rgba(0,240,255,.06)}
.dark .btn-icon.danger:hover{border-color:var(--err);color:var(--err);background:rgba(244,63,94,.07)}
.dark .op-btn{width:100%;padding:9px 12px;border:1px solid var(--bdr);border-radius:3px;
  background:transparent;color:var(--txt3);cursor:pointer;font-size:11px;font-weight:600;
  transition:all .14s;display:flex;align-items:center;gap:7px;text-align:left}
.dark .op-btn.on{border-color:var(--acc);color:var(--acc);background:rgba(0,240,255,.08);
  box-shadow:0 0 12px rgba(0,240,255,.08)}
.dark .op-btn:hover:not(.on){border-color:rgba(0,240,255,.3);color:var(--txt2)}
.dark .size-btn{padding:6px 0;border:1px solid var(--bdr);border-radius:3px;
  background:transparent;color:var(--txt3);cursor:pointer;font-size:12px;font-weight:700;
  font-family:'JetBrains Mono',monospace;transition:all .12s;text-align:center}
.dark .size-btn.on{border-color:var(--acc);color:var(--acc);background:rgba(0,240,255,.1)}
.dark .size-btn:hover:not(.on){border-color:rgba(0,240,255,.25);color:var(--txt2)}
.dark .result-box{border:1px solid rgba(0,240,255,.22);border-radius:5px;
  background:linear-gradient(145deg,rgba(0,240,255,.06),rgba(176,0,224,.03));
  padding:18px 22px;position:relative}
.dark .result-box::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,240,255,.7),transparent)}
.dark .metric{border:1px solid rgba(0,240,255,.13);border-radius:3px;padding:11px 13px;
  background:rgba(0,240,255,.04)}
.dark .lbl{font-size:9.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  color:rgba(0,240,255,.5);display:block;margin-bottom:5px}
.dark .hint{font-size:13px;color:var(--txt2);line-height:1.75;padding:9px 12px;
  border-radius:3px;background:rgba(0,240,255,.04);border-left:2px solid rgba(0,240,255,.3)}
.dark .ad-slot{background:rgba(0,240,255,.018);border:1px dashed rgba(0,240,255,.1);
  border-radius:4px;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:3px;color:var(--txt3);font-size:9px;
  letter-spacing:.1em;text-transform:uppercase}
.dark .err-box{padding:11px 14px;border:1px solid rgba(244,63,94,.3);border-radius:4px;
  background:rgba(244,63,94,.07);font-size:13px;color:#fb7185;line-height:1.65;
  display:flex;align-items:center;gap:8px}
.dark .step-n{width:26px;height:26px;border-radius:50%;border:1px solid rgba(0,240,255,.28);
  background:rgba(0,240,255,.07);display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;color:var(--acc);flex-shrink:0}
.dark .step-ln{background:rgba(0,240,255,.08);width:1.5px}
.dark .formula-box{padding:9px 12px;border:1px solid var(--bdr);border-radius:3px;
  background:rgba(0,0,0,.4);overflow-x:auto}
.dark .sidebar{border-right:1px solid var(--bdr);background:var(--sur);
  padding:13px 11px;overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.dark .sec-title{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:rgba(0,240,255,.4);margin-bottom:7px}
.dark .saved-item{padding:7px 9px;border:1px solid var(--bdr);border-radius:3px;
  background:rgba(255,255,255,.02);display:flex;align-items:center;justify-content:space-between;
  gap:6px;margin-bottom:4px}
.dark .mat-label{font-size:22px;font-weight:900;color:var(--acc);
  font-family:'JetBrains Mono',monospace;letter-spacing:-.02em;
  text-shadow:0 0 16px rgba(0,240,255,.4)}
.dark .mat-bracket{font-size:48px;line-height:1;color:rgba(0,240,255,.4);
  font-weight:100;font-family:'JetBrains Mono',monospace;user-select:none}

/* ═══ LIGHT ════════════════════════════════════════════════════ */
.light{
  --bg:#dde3f5;        /* VISIBLE mid-tone blue-gray page bg */
  --sur:#ffffff;       /* pure white cards */
  --s2:#f4f6fd;        /* very light blue for nested areas */
  --bdr:#b8c4e0;       /* medium-contrast borders */
  --bdr2:#4f46e5;
  --acc:#4f46e5;--acc2:#7c3aed;--acc3:#d97706;
  --ok:#16a34a;--err:#dc2626;
  --txt:#111827;--txt2:#374151;--txt3:#6b7280;
  --mat-bg:#f0f3ff;--mat-bdr:#b8c4e0;
  --mat-focus:rgba(79,70,229,.18);
  background:var(--bg);color:var(--txt)
}
/* No scanline in light mode */
.light .panel{background:var(--sur);border:1.5px solid var(--bdr);
  border-radius:12px;box-shadow:0 2px 16px rgba(79,70,229,.1)}
.light .inp{background:var(--mat-bg);border:1.5px solid var(--mat-bdr);border-radius:7px;
  color:var(--txt);font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:600;
  padding:0;outline:none;transition:all .15s;text-align:center;width:100%;height:44px}
.light .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px var(--mat-focus)}
.light .cell-inp{background:var(--mat-bg);border:1.5px solid var(--mat-bdr);border-radius:7px;
  color:var(--txt);font-family:'JetBrains Mono',monospace;font-size:17px;font-weight:700;
  outline:none;text-align:center;width:100%;height:50px;transition:all .14s;padding:0 4px;
  box-shadow:inset 0 1px 3px rgba(0,0,0,.06)}
.light .cell-inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px var(--mat-focus);
  background:#eef0ff;z-index:2;position:relative}
.light .tab-bar{background:var(--sur);border-bottom:1.5px solid var(--bdr)}
.light .tab{height:40px;padding:0 16px;border:none;border-bottom:2.5px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;
  font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
  transition:all .15s;display:flex;align-items:center;gap:5px;white-space:nowrap}
.light .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(79,70,229,.06);font-weight:800}
.light .tab:hover:not(.on){color:var(--txt2);background:rgba(79,70,229,.04)}
.light .btn-primary{display:inline-flex;align-items:center;gap:6px;padding:9px 20px;
  border:none;border-radius:8px;background:linear-gradient(135deg,var(--acc),var(--acc2));
  color:#fff;cursor:pointer;font-size:11px;font-weight:700;
  box-shadow:0 4px 14px rgba(79,70,229,.38);transition:all .16s}
.light .btn-primary:hover{box-shadow:0 8px 22px rgba(79,70,229,.5);transform:translateY(-1px)}
.light .btn-ghost{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;
  border:1.5px solid var(--bdr);border-radius:7px;background:transparent;
  color:var(--txt3);cursor:pointer;font-size:10px;font-weight:600;transition:all .12s}
.light .btn-ghost:hover,.light .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(79,70,229,.07)}
.light .btn-icon{width:30px;height:30px;border-radius:7px;border:1.5px solid var(--bdr);
  background:transparent;color:var(--txt3);cursor:pointer;display:flex;align-items:center;
  justify-content:center;transition:all .12s;flex-shrink:0}
.light .btn-icon:hover{border-color:var(--acc);color:var(--acc);background:rgba(79,70,229,.07)}
.light .btn-icon.danger:hover{border-color:var(--err);color:var(--err);background:rgba(220,38,38,.06)}
.light .op-btn{width:100%;padding:9px 12px;border:1.5px solid var(--bdr);border-radius:8px;
  background:transparent;color:var(--txt2);cursor:pointer;font-size:11.5px;font-weight:600;
  transition:all .14s;display:flex;align-items:center;gap:7px;text-align:left}
.light .op-btn.on{border-color:var(--acc);color:var(--acc);background:rgba(79,70,229,.09);
  box-shadow:0 2px 10px rgba(79,70,229,.15);font-weight:700}
.light .op-btn:hover:not(.on){border-color:rgba(79,70,229,.4);color:var(--txt)}
.light .size-btn{padding:6px 0;border:1.5px solid var(--bdr);border-radius:8px;
  background:transparent;color:var(--txt3);cursor:pointer;font-size:12px;font-weight:700;
  font-family:'JetBrains Mono',monospace;transition:all .12s;text-align:center}
.light .size-btn.on{border-color:var(--acc);color:var(--acc);background:rgba(79,70,229,.09)}
.light .size-btn:hover:not(.on){border-color:rgba(79,70,229,.4);color:var(--txt2)}
.light .result-box{border:1.5px solid rgba(79,70,229,.3);border-radius:12px;
  background:linear-gradient(145deg,rgba(79,70,229,.07),rgba(124,58,237,.04));
  padding:18px 22px}
.light .metric{border:1.5px solid rgba(79,70,229,.2);border-radius:9px;padding:11px 13px;
  background:rgba(79,70,229,.05)}
.light .lbl{font-size:9.5px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;
  color:var(--acc);display:block;margin-bottom:5px}
.light .hint{font-size:13px;color:var(--txt2);line-height:1.75;padding:9px 12px;
  border-radius:8px;background:rgba(79,70,229,.07);border-left:2.5px solid rgba(79,70,229,.45)}
.light .ad-slot{background:rgba(79,70,229,.04);border:1.5px dashed rgba(79,70,229,.2);
  border-radius:9px;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:3px;color:var(--txt3);font-size:9px;
  letter-spacing:.1em;text-transform:uppercase}
.light .err-box{padding:11px 14px;border:1.5px solid rgba(220,38,38,.25);border-radius:8px;
  background:rgba(220,38,38,.06);font-size:13px;color:var(--err);line-height:1.65;
  display:flex;align-items:center;gap:8px}
.light .step-n{width:26px;height:26px;border-radius:50%;border:1.5px solid rgba(79,70,229,.3);
  background:rgba(79,70,229,.09);display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;color:var(--acc);flex-shrink:0}
.light .step-ln{background:rgba(79,70,229,.12);width:1.5px}
.light .formula-box{padding:9px 12px;border:1.5px solid var(--bdr);border-radius:8px;
  background:rgba(79,70,229,.04);overflow-x:auto}
.light .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);
  padding:13px 11px;overflow-y:auto;display:flex;flex-direction:column;gap:12px}
.light .sec-title{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:var(--acc);margin-bottom:7px}
.light .saved-item{padding:7px 9px;border:1.5px solid var(--bdr);border-radius:8px;
  background:rgba(79,70,229,.04);display:flex;align-items:center;justify-content:space-between;
  gap:6px;margin-bottom:4px}
.light .mat-label{font-size:22px;font-weight:900;color:var(--acc);
  font-family:'JetBrains Mono',monospace;letter-spacing:-.02em}
.light .mat-bracket{font-size:48px;line-height:1;color:rgba(79,70,229,.35);
  font-weight:100;font-family:'JetBrains Mono',monospace;user-select:none}

/* shared */
.topbar{height:38px;position:relative;z-index:300;
  display:flex;align-items:center;padding:0 12px;gap:7px;backdrop-filter:blur(14px)}
.dark .topbar{background:rgba(2,2,16,.97);border-bottom:1px solid var(--bdr)}
.light .topbar{background:rgba(255,255,255,.97);border-bottom:1.5px solid var(--bdr);
  box-shadow:0 1px 8px rgba(79,70,229,.08)}
.prose p{font-size:13.5px;line-height:1.78;margin-bottom:12px;color:inherit}
.prose h3{font-size:17px;font-weight:700;margin:20px 0 9px}
.prose ul{padding-left:20px;margin-bottom:12px}
.prose li{font-size:13.5px;line-height:1.72;margin-bottom:5px}
.prose strong{font-weight:700}
`;

/* ═══════════════════════════════════════════════════════════════════
   KATEX
═══════════════════════════════════════════════════════════════════ */
function useKatex() {
  const [ok, setOk] = useState(!!window.katex);
  useEffect(() => {
    if (window.katex) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(l);
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    s.onload = () => setOk(true);
    document.head.appendChild(s);
  }, []);
  return ok;
}
function KTeX({ latex, display = false, dark }) {
  if (window.katex) {
    try {
      const h = window.katex.renderToString(latex, { displayMode: display, throwOnError: false });
      return <span dangerouslySetInnerHTML={{ __html: h }} style={{ color: dark ? '#f0f4ff' : '#111827' }} />;
    } catch (e) {}
  }
  return <code style={{ fontFamily:'JetBrains Mono,monospace', fontSize: display?14:11,
    color: dark?'#00f0ff':'#4f46e5' }}>{latex}</code>;
}

/* ═══════════════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════════════ */
const Svg = ({ d, s = 14, sw = 1.8 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
    {(Array.isArray(d)?d:[d]).map((p,i) => <path key={i} d={p}/>)}
  </svg>
);
const I = {
  grid:    s => <Svg s={s} d={["M3 3h18v18H3z","M3 9h18","M3 15h18","M9 3v18","M15 3v18"]} />,
  plus:    s => <Svg s={s} d={["M12 5v14","M5 12h14"]} />,
  times:   s => <Svg s={s} d={["M18 6 6 18","M6 6l12 12"]} />,
  hash:    s => <Svg s={s} d={["M4 9h16","M4 15h16","M10 3 8 21","M16 3l-2 18"]} />,
  inv:     s => <Svg s={s} d="M1 4v6h6M23 20v-6h-6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />,
  trans:   s => <Svg s={s} d={["M5 3H3v18h18v-2","M5 3v14h14V3H5z","M9 7h6","M9 12h4"]} />,
  trace:   s => <Svg s={s} d={["M3 3h18v18H3z","M3 3l18 18"]} />,
  rank:    s => <Svg s={s} d={["M3 3h18v18H3z","M3 8h18","M3 13h18","M8 3v18","M16 3v18"]} />,
  eye:     s => <Svg s={s} d={["M3 3h18v18H3z","M3 3l18 18"]} />,
  trash:   s => <Svg s={s} d={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6","M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]} />,
  shuffle: s => <Svg s={s} d={["M16 3h5v5","M4 20 21 3","M21 16v5h-5","M15 15l6 6","M4 4l5 5"]} />,
  save:    s => <Svg s={s} d={["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z","M17 21v-8H7v8","M7 3v5h8"]} />,
  copy:    s => <Svg s={s} d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2","M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"]} />,
  ok:      s => <Svg s={s} d="M20 6 9 17l-5-5" />,
  info:    s => <Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 16v-4M12 8h.01"]} />,
  book:    s => <Svg s={s} d={["M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"]} />,
  load:    s => <Svg s={s} d={["M5 12H19","M12 5l7 7-7 7"]} />,
  eigen:   s => <Svg s={s} d={["M12 2L2 7l10 5 10-5-10-5z","M2 17l10 5 10-5","M2 12l10 5 10-5"]} />,
};

/* ═══════════════════════════════════════════════════════════════════
   MATH ENGINE — Full Matrix Operations
═══════════════════════════════════════════════════════════════════ */
function matToLatex(m) {
  if (m === null || m === undefined) return '\\text{null}';
  if (typeof m === 'number') return isFinite(m) ? m.toFixed(3).replace(/\.?0+$/, '') : '\\infty';
  if (!Array.isArray(m)) return String(m);
  const rows = m.map(row =>
    (Array.isArray(row) ? row : [row])
      .map(v => typeof v === 'number'
        ? (Math.abs(v) < 1e-10 ? '0' : v.toFixed(3).replace(/\.?0+$/, ''))
        : String(v))
      .join(' & ')
  );
  return `\\begin{pmatrix} ${rows.join(' \\\\ ')} \\end{pmatrix}`;
}

function computeMatrixRank(m) {
  const n = m.length;
  const A = m.map(r => [...r.map(Number)]);
  let rank = 0;
  for (let col = 0; col < n && rank < n; col++) {
    let pivot = -1;
    for (let r = rank; r < n; r++) { if (Math.abs(A[r][col]) > 1e-10) { pivot = r; break; } }
    if (pivot === -1) continue;
    [A[rank], A[pivot]] = [A[pivot], A[rank]];
    const s = A[rank][col];
    for (let c = 0; c < n; c++) A[rank][c] /= s;
    for (let r = 0; r < n; r++) {
      if (r === rank) continue;
      const f = A[r][col];
      for (let c = 0; c < n; c++) A[r][c] -= f * A[rank][c];
    }
    rank++;
  }
  return rank;
}

function computeEigenvalues2x2(m) {
  // Characteristic polynomial: λ² - tr(A)λ + det(A) = 0
  const tr = m[0][0] + m[1][1];
  const det = m[0][0]*m[1][1] - m[0][1]*m[1][0];
  const disc = tr*tr - 4*det;
  if (disc >= 0) {
    return [((tr + Math.sqrt(disc))/2), ((tr - Math.sqrt(disc))/2)];
  }
  return [`${(tr/2).toFixed(3)} ± ${(Math.sqrt(-disc)/2).toFixed(3)}i`];
}

function computeOperation(op, mA, mB, size) {
  try {
    let res, steps = [], metrics = {};

    const A = mA.map(r => r.map(Number));
    const B = mB.map(r => r.map(Number));

    if (op === 'add') {
      res = math.add(A, B);
      steps = [
        { t: 'Matrix Addition Rule', d: `Add corresponding elements: C[i][j] = A[i][j] + B[i][j]`, l: `C_{ij} = A_{ij} + B_{ij}` },
        { t: 'Example: top-left element', d: `C[1][1] = A[1][1] + B[1][1] = ${A[0][0]} + ${B[0][0]} = ${A[0][0]+B[0][0]}`, l: `C_{11} = ${A[0][0]} + ${B[0][0]} = ${A[0][0]+B[0][0]}` },
        { t: 'Result Matrix', d: 'Apply to all positions', l: `A + B = ${matToLatex(res)}`, last: true },
      ];
      metrics = { targetM: A, op: 'add' };
    } else if (op === 'subtract') {
      res = math.subtract(A, B);
      steps = [
        { t: 'Matrix Subtraction Rule', d: `Subtract corresponding elements: C[i][j] = A[i][j] − B[i][j]`, l: `C_{ij} = A_{ij} - B_{ij}` },
        { t: 'Example: top-left element', d: `C[1][1] = ${A[0][0]} − ${B[0][0]} = ${A[0][0]-B[0][0]}`, l: `C_{11} = ${A[0][0]} - ${B[0][0]} = ${A[0][0]-B[0][0]}` },
        { t: 'Result Matrix', d: 'Apply to all positions', l: `A - B = ${matToLatex(res)}`, last: true },
      ];
      metrics = { targetM: A, op: 'subtract' };
    } else if (op === 'multiply') {
      res = math.multiply(A, B);
      const dotTerms = A[0].map((v, k) => `${A[0][k]}\\cdot${B[k][0]}`).join('+');
      steps = [
        { t: 'Dimension Check', d: `(${size}×${size}) × (${size}×${size}) → (${size}×${size}) ✓`, l: `(m\\times n)(n\\times p) = (m\\times p)` },
        { t: 'Dot Product Formula', d: 'Each element C[i][j] = dot product of row i of A with column j of B', l: `C_{ij} = \\sum_{k=1}^{n} A_{ik}\\cdot B_{kj}` },
        { t: 'Example C[1][1]', d: `= ${A[0].map((v,k)=>`${A[0][k]}×${B[k][0]}`).join(' + ')} = ${res[0][0]}`, l: `C_{11} = ${dotTerms} = ${(res[0][0]).toFixed?res[0][0].toFixed(3):res[0][0]}` },
        { t: 'Result Matrix A × B', d: 'Full product matrix', l: `A \\times B = ${matToLatex(res)}`, last: true },
      ];
      metrics = { targetM: A, op: 'multiply' };
    } else if (op === 'transposeA') {
      res = math.transpose(A);
      steps = [
        { t: 'Transpose Definition', d: 'Swap rows and columns: Aᵀ[i][j] = A[j][i]', l: `(A^T)_{ij} = A_{ji}` },
        { t: 'Original Matrix', d: '', l: matToLatex(A) },
        { t: 'Transposed Matrix Aᵀ', d: 'Rows become columns', l: `A^T = ${matToLatex(res)}`, last: true },
      ];
      metrics = { targetM: A, op: 'transposeA' };
    } else if (op === 'detA' || op === 'detB') {
      const M = op === 'detA' ? A : B;
      const d = math.det(M);
      res = d;
      const isInvertible = Math.abs(d) > 1e-10;
      if (size === 2) {
        steps = [
          { t: '2×2 Determinant Formula', d: `det(A) = ad − bc`, l: `\\det(A) = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc` },
          { t: 'Substitute values', d: `= (${M[0][0]})(${M[1][1]}) − (${M[0][1]})(${M[1][0]})`, l: `= (${M[0][0]})(${M[1][1]}) - (${M[0][1]})(${M[1][0]})` },
          { t: `Result: det = ${d.toFixed(4)}`, d: isInvertible ? 'det ≠ 0 → matrix is invertible' : 'det = 0 → matrix is singular (not invertible)', l: `\\det = ${d.toFixed(4)}`, last: true },
        ];
      } else {
        steps = [
          { t: 'Cofactor Expansion (Row 1)', d: `Expanding along first row`, l: `\\det(A) = \\sum_{j=1}^n (-1)^{1+j} a_{1j} M_{1j}` },
          { t: `Result: det = ${d.toFixed(4)}`, d: isInvertible ? 'det ≠ 0 → invertible' : 'det = 0 → singular', l: `\\det(A) = ${d.toFixed(4)}`, last: true },
        ];
      }
      metrics = { targetM: M, op: 'det', det: d };
    } else if (op === 'invA') {
      const d = math.det(A);
      if (Math.abs(d) < 1e-10) return { error: `Matrix A is singular (det = ${d.toFixed(4)}). No inverse exists.` };
      res = math.inv(A);
      if (size === 2) {
        steps = [
          { t: 'Check Determinant', d: `det(A) = ${d.toFixed(4)} ≠ 0 ✓ — inverse exists`, l: `\\det(A) = ${d.toFixed(4)} \\neq 0` },
          { t: '2×2 Inverse Formula', d: 'Swap diagonal, negate off-diagonal, divide by det', l: `A^{-1} = \\frac{1}{${d.toFixed(3)}} \\begin{pmatrix} ${A[1][1]} & ${-A[0][1]} \\\\ ${-A[1][0]} & ${A[0][0]} \\end{pmatrix}` },
          { t: 'Result A⁻¹', d: 'Verify: A × A⁻¹ = I', l: `A^{-1} = ${matToLatex(res)}`, last: true },
        ];
      } else {
        steps = [
          { t: 'Check Determinant', d: `det(A) = ${d.toFixed(4)} ≠ 0 ✓`, l: `\\det(A) = ${d.toFixed(4)} \\neq 0` },
          { t: 'Gauss-Jordan Elimination', d: 'Augment A with identity [A|I], row reduce to [I|A⁻¹]', l: `[A \\mid I] \\xrightarrow{\\text{RREF}} [I \\mid A^{-1}]` },
          { t: 'Result A⁻¹', d: `A × A⁻¹ = I (verify with det × ${d.toFixed(3)})`, l: `A^{-1} = ${matToLatex(res)}`, last: true },
        ];
      }
      metrics = { targetM: A, op: 'inv', det: d };
    } else if (op === 'power') {
      res = math.multiply(A, A); // A²
      steps = [
        { t: 'Matrix Power A²', d: 'A² = A × A (matrix multiplication)', l: `A^2 = A \\times A` },
        { t: 'Result A²', d: 'Apply dot product formula', l: `A^2 = ${matToLatex(res)}`, last: true },
      ];
      metrics = { targetM: A, op: 'power' };
    }

    // Compute properties for display
    const targetM = (op === 'detB') ? B : A;
    const trace = Array.isArray(targetM) ? math.trace(targetM) : 0;
    const det = (op === 'detA' || op === 'detB') ? res
      : (Array.isArray(targetM) ? math.det(targetM) : 0);
    const rank = Array.isArray(targetM) ? computeMatrixRank(targetM) : 0;
    const isSymmetric = Array.isArray(targetM) && math.deepEqual(targetM, math.transpose(targetM));
    const eigenvals = size === 2 && Array.isArray(targetM) ? computeEigenvalues2x2(targetM) : null;

    return {
      res, steps, error: null,
      props: { trace, det, rank, isSymmetric, eigenvals, size }
    };
  } catch (e) {
    return { error: e.message };
  }
}

/* ═══════════════════════════════════════════════════════════════════
   COPY BUTTON
═══════════════════════════════════════════════════════════════════ */
function CopyBtn({ text, dark }) {
  const [ok, setOk] = useState(false);
  return (
    <button className="btn-ghost" onClick={() => {
      navigator.clipboard.writeText(text).catch(()=>{});
      setOk(true); setTimeout(()=>setOk(false), 1400);
    }} style={{ padding:'4px 9px', gap:3, fontSize:10 }}>
      {ok ? I.ok(9) : I.copy(9)}{ok ? 'Copied' : 'Copy'}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   STEP DISPLAY
═══════════════════════════════════════════════════════════════════ */
function Steps({ steps, dark, katex }) {
  return (
    <div>
      {steps.map((s, i) => (
        <div key={i} style={{ display:'flex', gap:10, marginBottom: s.last?0:18 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
            <div className="step-n">{i+1}</div>
            {!s.last && <div className="step-ln" style={{ flex:1, marginTop:5, minHeight:14 }}/>}
          </div>
          <div style={{ flex:1, paddingBottom: s.last?0:4 }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--txt)', marginBottom:3 }}>{s.t}</div>
            {s.d && <div style={{ fontSize:12.5, color:'var(--txt2)', marginBottom:6, lineHeight:1.65 }}>{s.d}</div>}
            <div className="formula-box">
              {katex ? <KTeX latex={s.l} dark={dark}/> : <code style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11.5, color:'var(--acc)' }}>{s.l}</code>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MATRIX CELL GRID — stable keys, no re-mount on every digit
═══════════════════════════════════════════════════════════════════ */
function MatrixGrid({ id, matrix, onChange, size }) {
  return (
    <div style={{ display:'grid', gap:5, gridTemplateColumns:`repeat(${size}, 1fr)` }}>
      {matrix.map((row, i) =>
        row.map((val, j) => (
          <input
            key={`${id}-${i}-${j}`}
            type="number"
            defaultValue={val}
            onChange={e => onChange(i, j, e.target.value)}
            className="cell-inp"
            step="any"
          />
        ))
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   OPERATIONS CONFIG
═══════════════════════════════════════════════════════════════════ */
const OPS = [
  { id:'add',      ico:'plus',   label:'A + B',    group:'binary',  desc:'Element-wise addition' },
  { id:'subtract', ico:'times',  label:'A − B',    group:'binary',  desc:'Element-wise subtraction' },
  { id:'multiply', ico:'grid',   label:'A × B',    group:'binary',  desc:'Matrix multiplication' },
  { id:'transposeA',ico:'trans', label:'Aᵀ',       group:'unary',   desc:'Transpose of A' },
  { id:'detA',     ico:'hash',   label:'det(A)',   group:'unary',   desc:'Determinant of A' },
  { id:'detB',     ico:'hash',   label:'det(B)',   group:'unary',   desc:'Determinant of B' },
  { id:'invA',     ico:'inv',    label:'A⁻¹',      group:'unary',   desc:'Inverse of A' },
  { id:'power',    ico:'eigen',  label:'A²',       group:'unary',   desc:'Matrix squared' },
];
const BINARY_OPS = OPS.filter(o => o.group === 'binary').map(o => o.id);

/* ═══════════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════════ */
export default function MatrixAlgebra() {
  const [mode, setMode] = useState('dark');
  const dark = mode === 'dark';
  const katex = useKatex();

  const [size, setSize] = useState(2);
  const [op, setOp] = useState('multiply');
  const [pageTab, setPageTab] = useState('calc');

  // Use refs for matrix data to avoid re-renders on every cell change
  const matARef = useRef([[1,2],[3,4]]);
  const matBRef = useRef([[5,6],[7,8]]);

  // Trigger for recompute
  const [tick, setTick] = useState(0);
  const recompute = () => setTick(t => t+1);

  const updateA = (i, j, v) => { matARef.current[i][j] = parseFloat(v)||0; recompute(); };
  const updateB = (i, j, v) => { matBRef.current[i][j] = parseFloat(v)||0; recompute(); };

  const setSize2 = (s) => {
    const newA = Array.from({length:s}, (_,i) => Array.from({length:s}, (_,j) => (i===j?1:0)));
    const newB = Array.from({length:s}, (_,i) => Array.from({length:s}, (_,j) => (i===j?1:0)));
    matARef.current = newA;
    matBRef.current = newB;
    setSize(s);
  };

  const fillMat = (target, type) => {
    const s = size;
    let m;
    if (type==='identity') m = Array.from({length:s},(_,i) => Array.from({length:s},(_,j) => i===j?1:0));
    else if (type==='zeros') m = Array.from({length:s},()=>Array(s).fill(0));
    else m = Array.from({length:s},()=>Array.from({length:s},()=>Math.floor(Math.random()*9)+1));
    if (target==='A') matARef.current = m;
    else matBRef.current = m;
    recompute();
    return m;
  };

  const [savedMatrices, setSavedMatrices] = useState([]);
  const saveMatrix = (name, m) => setSavedMatrices(prev => [...prev, { name, matrix:m, id:Date.now() }]);
  const deleteMatrix = (id) => setSavedMatrices(prev => prev.filter(s=>s.id!==id));

  const result = useMemo(
    () => computeOperation(op, matARef.current, matBRef.current, size),
    [op, size, tick]
  );

  const showB = BINARY_OPS.includes(op);

  const PAGE_TABS = [
    { id:'calc',  label:'Calculator' },
    { id:'guide', label:'How to Use' },
    { id:'learn', label:'Learn' },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className={dark?'dark':'light'}>
        {dark && <div className="scanline"/>}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:24, height:24, borderRadius: dark?3:7,
              background: dark?'transparent':'linear-gradient(135deg,#4f46e5,#7c3aed)',
              border: dark?'1px solid var(--acc)':'none',
              display:'flex', alignItems:'center', justifyContent:'center',
              color: dark?'var(--acc)':'#fff',
              boxShadow: dark?'0 0 10px rgba(0,240,255,.22)':'0 2px 8px rgba(79,70,229,.4)' }}>
              {I.grid(14)}
            </div>
            <span style={{ fontSize:13, fontWeight:800, color:'var(--txt)',
              letterSpacing: dark?'.04em':'-.01em' }}>
              Matrix<span style={{ color:'var(--acc)' }}>Calc</span>
            </span>
            <span style={{ fontSize:7.5, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase',
              padding:'1px 5px', borderRadius: dark?2:4,
              border: dark?'1px solid rgba(0,240,255,.2)':'1.5px solid rgba(79,70,229,.25)',
              color: dark?'rgba(0,240,255,.5)':'var(--acc)',
              background: dark?'rgba(0,240,255,.04)':'rgba(79,70,229,.06)' }}>
              8 ops
            </span>
          </div>
          <div style={{ flex:1 }}/>
          <button onClick={() => setMode(dark?'light':'dark')}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 11px',
              border: dark?'1px solid rgba(0,240,255,.18)':'1.5px solid var(--bdr)',
              borderRadius: dark?3:8, background: dark?'rgba(0,240,255,.03)':'var(--sur)',
              cursor:'pointer', transition:'all .14s' }}>
            {dark ? (
              <>
                <div style={{ width:28, height:15, borderRadius:8, background:'var(--acc)', position:'relative', boxShadow:'0 0 8px rgba(0,240,255,.5)' }}>
                  <div style={{ position:'absolute', top:2.5, right:2.5, width:10, height:10, borderRadius:'50%', background:'#020210' }}/>
                </div>
                <span style={{ fontSize:9.5, fontWeight:700, color:'rgba(0,240,255,.6)', letterSpacing:'.1em' }}>NEON</span>
              </>
            ) : (
              <>
                <span style={{ fontSize:10.5, color:'var(--txt3)', fontWeight:600 }}>Light</span>
                <div style={{ width:28, height:15, borderRadius:8, background:'#d1d5db', position:'relative' }}>
                  <div style={{ position:'absolute', top:2.5, left:2.5, width:10, height:10, borderRadius:'50%', background:'#9ca3af' }}/>
                </div>
              </>
            )}
          </button>
        </div>

        {/* PAGE TABS */}
        <div className="tab-bar" style={{ display:'flex' }}>
          {PAGE_TABS.map(t => (
            <button key={t.id} className={`tab ${pageTab===t.id?'on':''}`}
              onClick={() => setPageTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* BODY */}
        <div className="tool-layout-grid">

          {/* SIDEBAR */}
          <div className="sidebar">

            {/* Size */}
            <div>
              <div className="sec-title">Matrix Size</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:4 }}>
                {[2,3,4,5].map(s => (
                  <button key={s} className={`size-btn ${size===s?'on':''}`}
                    onClick={() => setSize2(s)}>{s}×{s}</button>
                ))}
              </div>
            </div>

            {/* Operations */}
            <div>
              <div className="sec-title">Operation</div>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {OPS.map(o => (
                  <button key={o.id} className={`op-btn ${op===o.id?'on':''}`}
                    onClick={() => { setOp(o.id); setPageTab('calc'); }}>
                    {I[o.ico]?.(12)}
                    <div>
                      <div style={{ fontSize:11.5, fontWeight:700, fontFamily:'JetBrains Mono,monospace' }}>{o.label}</div>
                      <div style={{ fontSize:9, color:'var(--txt3)', lineHeight:1 }}>{o.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Saved */}
            <div>
              <div className="sec-title">Saved Matrices</div>
              {savedMatrices.length === 0 ? (
                <div style={{ fontSize:11, color:'var(--txt3)', textAlign:'center', padding:'8px 0' }}>
                  None saved yet
                </div>
              ) : savedMatrices.map(s => (
                <div key={s.id} className="saved-item">
                  <span style={{ fontSize:10.5, color:'var(--txt2)', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.name}</span>
                  <div style={{ display:'flex', gap:3, flexShrink:0 }}>
                    <button className="btn-icon" onClick={() => { matARef.current=s.matrix; recompute(); }} title="Load → A">{I.load(10)}</button>
                    <button className="btn-icon danger" onClick={() => deleteMatrix(s.id)}>{I.trash(10)}</button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* MAIN */}
          <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:13 }}>
            <AnimatePresence mode="wait">

              {pageTab==='calc' && (
                <motion.div key="calc" initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  style={{ display:'flex', flexDirection:'column', gap:13 }}>

                  {/* Matrix input area */}
                  <div style={{ display:'grid', gridTemplateColumns: showB ? '1fr 1fr' : '1fr 1fr', gap:13 }}>

                    {/* Matrix A */}
                    <div className="panel" style={{ padding:14 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                        <span className="mat-label">A</span>
                        <div style={{ display:'flex', gap:4 }}>
                          <button className="btn-icon" onClick={() => saveMatrix(`A (${size}×${size}) ${new Date().toLocaleTimeString()}`, matARef.current.map(r=>[...r]))} title="Save A">{I.save(11)}</button>
                          <button className="btn-icon" onClick={() => { matARef.current=Array.from({length:size},(_,i)=>Array.from({length:size},(_,j)=>i===j?1:0)); recompute(); }} title="Identity">{I.eye(11)}</button>
                          <button className="btn-icon" onClick={() => { fillMat('A','random'); }} title="Random">{I.shuffle(11)}</button>
                          <button className="btn-icon danger" onClick={() => { matARef.current=Array.from({length:size},()=>Array(size).fill(0)); recompute(); }} title="Clear">{I.trash(11)}</button>
                        </div>
                      </div>
                      <MatrixGrid id="A" matrix={matARef.current} onChange={updateA} size={size} />
                    </div>

                    {/* Matrix B or properties */}
                    {showB ? (
                      <div className="panel" style={{ padding:14 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                          <span className="mat-label">B</span>
                          <div style={{ display:'flex', gap:4 }}>
                            <button className="btn-icon" onClick={() => saveMatrix(`B (${size}×${size}) ${new Date().toLocaleTimeString()}`, matBRef.current.map(r=>[...r]))} title="Save B">{I.save(11)}</button>
                            <button className="btn-icon" onClick={() => { matBRef.current=Array.from({length:size},(_,i)=>Array.from({length:size},(_,j)=>i===j?1:0)); recompute(); }} title="Identity">{I.eye(11)}</button>
                            <button className="btn-icon" onClick={() => { fillMat('B','random'); }} title="Random">{I.shuffle(11)}</button>
                            <button className="btn-icon danger" onClick={() => { matBRef.current=Array.from({length:size},()=>Array(size).fill(0)); recompute(); }} title="Clear">{I.trash(11)}</button>
                          </div>
                        </div>
                        <MatrixGrid id="B" matrix={matBRef.current} onChange={updateB} size={size} />
                      </div>
                    ) : (
                      <div className="panel" style={{ padding:14 }}>
                        <span className="lbl" style={{ marginBottom:10 }}>Matrix A Properties</span>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                          {[
                            ['Trace', result?.props?.trace?.toFixed ? result.props.trace.toFixed(3).replace(/\.?0+$/,'') : '—', 'var(--acc)'],
                            ['Determinant', result?.props?.det?.toFixed ? result.props.det.toFixed(3).replace(/\.?0+$/,'') : '—', dark?'#b000e0':'#7c3aed'],
                            ['Rank', result?.props?.rank ?? '—', dark?'#f59e0b':'#d97706'],
                            ['Symmetric', result?.props?.isSymmetric ? 'Yes ✓' : 'No', result?.props?.isSymmetric ? (dark?'#22c55e':'#16a34a') : (dark?'#f43f5e':'#dc2626')],
                            ...(result?.props?.eigenvals ? [['λ₁', typeof result.props.eigenvals[0] === 'number' ? result.props.eigenvals[0].toFixed(3) : String(result.props.eigenvals[0]), dark?'var(--acc)':'var(--acc)']] : []),
                          ].map(([l,v,c]) => (
                            <div key={l} className="metric">
                              <div style={{ fontSize:8.5, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--txt3)', marginBottom:4 }}>{l}</div>
                              <div style={{ fontSize:18, fontWeight:800, fontFamily:'JetBrains Mono,monospace', color:c }}>{v}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Result */}
                  {result && (
                    <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
                      {result.error ? (
                        <div className="err-box">{I.info(14)} {result.error}</div>
                      ) : (
                        <>
                          <div className="result-box">
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                              <span style={{ fontSize:9.5, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase',
                                color: dark?'rgba(0,240,255,.5)':'var(--acc)' }}>
                                Result — {OPS.find(o=>o.id===op)?.label}
                              </span>
                              <CopyBtn text={matToLatex(result.res)} dark={dark}/>
                            </div>
                            <div style={{ textAlign:'center', overflowX:'auto', minHeight:60, display:'flex', alignItems:'center', justifyContent:'center', padding:'8px 0' }}>
                              {katex ? (
                                <KTeX display dark={dark}
                                  latex={typeof result.res === 'number'
                                    ? `\\text{Result} = ${result.res.toFixed(6).replace(/\.?0+$/, '')}`
                                    : matToLatex(result.res)} />
                              ) : (
                                <code style={{ fontSize:16, fontWeight:800, fontFamily:'JetBrains Mono,monospace', color:'var(--acc)' }}>
                                  {typeof result.res === 'number' ? result.res.toFixed(6) : JSON.stringify(result.res)}
                                </code>
                              )}
                            </div>

                            {/* Props metrics row */}
                            {result.props && (
                              <div style={{ display:'flex', gap:8, marginTop:14, paddingTop:12,
                                borderTop: dark?'1px solid rgba(0,240,255,.1)':'1.5px solid rgba(79,70,229,.1)',
                                flexWrap:'wrap' }}>
                                {[
                                  ['Trace', result.props.trace?.toFixed?result.props.trace.toFixed(3).replace(/\.?0+$/, ''):result.props.trace],
                                  ['det(A)', result.props.det?.toFixed?result.props.det.toFixed(3).replace(/\.?0+$/, ''):result.props.det],
                                  ['Rank', result.props.rank],
                                  ['Symmetric', result.props.isSymmetric?'Yes':'No'],
                                  ...(result.props.eigenvals && size===2 ? [['Eigenvalues', typeof result.props.eigenvals[0]==='number' ? result.props.eigenvals.map(v=>typeof v==='number'?v.toFixed(2):v).join(', ') : String(result.props.eigenvals[0])]] : []),
                                ].map(([l,v]) => (
                                  <div key={l} style={{ flex:'1 1 90px', minWidth:90 }} className="metric">
                                    <div style={{ fontSize:8, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--txt3)', marginBottom:3 }}>{l}</div>
                                    <div style={{ fontSize:16, fontWeight:800, fontFamily:'JetBrains Mono,monospace', color:'var(--acc)' }}>{String(v)}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Steps */}
                          {result.steps?.length > 0 && (
                            <div className="panel" style={{ padding:15 }}>
                              <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase',
                                color: dark?'rgba(0,240,255,.45)':'var(--acc)', marginBottom:14 }}>
                                Step-by-Step Solution
                              </div>
                              <Steps steps={result.steps} dark={dark} katex={katex}/>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                </motion.div>
              )}

              {pageTab==='guide' && (
                <motion.div key="guide" initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div className="hint" style={{ display:'flex', gap:7 }}>
                    {I.info(13)} <span>MatrixCalc supports 8 operations on 2×2 to 5×5 matrices: A+B, A−B, A×B, Aᵀ, det(A), det(B), A⁻¹, and A². All with step-by-step solutions.</span>
                  </div>
                  {[
                    ['Set matrix size', 'Choose 2×2, 3×3, 4×4, or 5×5 in the sidebar. All matrices resize automatically, prefilled with identity.'],
                    ['Select an operation', 'Click any operation in the sidebar. Binary ops (A+B, A−B, A×B) show both matrix editors; unary ops (det, inv, Aᵀ) show only A.'],
                    ['Edit matrix cells', 'Click any cell and type a number. Press Tab to move to the next cell. Negative numbers and decimals are supported.'],
                    ['Use fill buttons', 'Each matrix header has: Save (💾), Identity (I), Random (🔀), and Clear (🗑️). Use Random to quickly explore examples.'],
                    ['Read the result', 'The result panel shows the output matrix or scalar with LaTeX rendering. The properties bar shows Trace, det, Rank, Symmetry, and Eigenvalues (2×2).'],
                    ['Step-by-step', 'Scroll below the result to see the full derivation — rule statement, substitution, and final answer.'],
                    ['Save matrices', 'Use the 💾 icon to save any matrix. Saved matrices appear in the sidebar and can be reloaded to Matrix A.'],
                  ].map(([t, b], i) => (
                    <div key={i} className="panel" style={{ padding:14 }}>
                      <div style={{ display:'flex', gap:10 }}>
                        <div style={{ width:32, height:32, borderRadius: dark?3:9, flexShrink:0,
                          background: dark?'rgba(0,240,255,.07)':'rgba(79,70,229,.09)',
                          border: dark?'1px solid rgba(0,240,255,.2)':'1.5px solid rgba(79,70,229,.24)',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:13, fontWeight:800, color:'var(--acc)' }}>{i+1}</div>
                        <div>
                          <div style={{ fontSize:13.5, fontWeight:700, color:'var(--txt)', marginBottom:4 }}>{t}</div>
                          <div style={{ fontSize:13, color:'var(--txt2)', lineHeight:1.72 }}>{b}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {pageTab==='learn' && (
                <motion.div key="learn" initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                  <div className="panel" style={{ padding:22 }}>
                    <h1 style={{ fontSize:21, fontWeight:900, color:'var(--txt)', marginBottom:5 }}>
                      Mastering Matrix Algebra
                    </h1>
                    <p style={{ fontSize:12.5, color:'var(--txt3)', marginBottom:20 }}>
                      Addition · Multiplication · Determinants · Inverses · Eigenvalues
                    </p>
                    <div className="prose" style={{ color:'var(--txt)' }}>
                      <p style={{ color:'var(--txt2)' }}>
                        Matrices are rectangular arrays of numbers that represent linear transformations. Every rotation, scaling, reflection, and projection in computer graphics, physics simulations, and machine learning is fundamentally a matrix operation.
                      </p>
                      <h3 style={{ color:'var(--txt)' }}>Matrix Multiplication</h3>
                      <p style={{ color:'var(--txt2)' }}>Unlike scalar multiplication, matrix multiplication is <strong style={{ color:'var(--txt)' }}>not commutative</strong>: A×B ≠ B×A in general. The (i,j) element of the product is the dot product of row i of A with column j of B.</p>
                      {katex && window.katex && (
                        <div style={{ textAlign:'center', overflowX:'auto', padding:'10px 14px',
                          background: dark?'rgba(0,0,0,.35)':'rgba(79,70,229,.04)',
                          border: dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          borderRadius: dark?3:8, margin:'10px 0' }}>
                          <KTeX display dark={dark} latex="(AB)_{ij} = \\sum_{k=1}^{n} A_{ik}B_{kj}" />
                        </div>
                      )}
                      <h3 style={{ color:'var(--txt)' }}>The Determinant</h3>
                      <p style={{ color:'var(--txt2)' }}>The determinant is a scalar that encodes the "volume scaling factor" of the transformation. If det(A) = 0, the matrix collapses space and is not invertible (singular).</p>
                      {katex && window.katex && (
                        <div style={{ textAlign:'center', overflowX:'auto', padding:'10px 14px',
                          background: dark?'rgba(0,0,0,.35)':'rgba(79,70,229,.04)',
                          border: dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          borderRadius: dark?3:8, margin:'10px 0' }}>
                          <KTeX display dark={dark} latex="\\det\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix} = ad - bc" />
                        </div>
                      )}
                      <h3 style={{ color:'var(--txt)' }}>Matrix Inverse</h3>
                      <p style={{ color:'var(--txt2)' }}>The inverse A⁻¹ satisfies A × A⁻¹ = I (identity). It exists only when det(A) ≠ 0. For 2×2 matrices it has a simple closed form; for larger matrices we use Gauss-Jordan elimination.</p>
                      {katex && window.katex && (
                        <div style={{ textAlign:'center', overflowX:'auto', padding:'10px 14px',
                          background: dark?'rgba(0,0,0,.35)':'rgba(79,70,229,.04)',
                          border: dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          borderRadius: dark?3:8, margin:'10px 0' }}>
                          <KTeX display dark={dark} latex="A^{-1} = \\frac{1}{ad-bc}\\begin{pmatrix}d&-b\\\\-c&a\\end{pmatrix}" />
                        </div>
                      )}
                      <h3 style={{ color:'var(--txt)' }}>Eigenvalues & Eigenvectors</h3>
                      <p style={{ color:'var(--txt2)' }}>An eigenvector v of A is a non-zero vector that only scales under A: Av = λv, where λ is the eigenvalue. Found by solving the characteristic equation det(A − λI) = 0.</p>
                      {katex && window.katex && (
                        <div style={{ textAlign:'center', overflowX:'auto', padding:'10px 14px',
                          background: dark?'rgba(0,0,0,.35)':'rgba(79,70,229,.04)',
                          border: dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          borderRadius: dark?3:8, margin:'10px 0' }}>
                          <KTeX display dark={dark} latex="\\det(A - \\lambda I) = 0 \\implies \\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) = 0" />
                        </div>
                      )}
                      <h3 style={{ color:'var(--txt)' }}>Applications</h3>
                      <ul style={{ color:'var(--txt2)' }}>
                        <li><strong style={{ color:'var(--txt)' }}>Computer Graphics:</strong> Every 3D rotation, translation and projection is a matrix multiplication applied to vertex coordinates.</li>
                        <li><strong style={{ color:'var(--txt)' }}>Machine Learning:</strong> Neural network forward passes are sequences of matrix multiplications + activation functions.</li>
                        <li><strong style={{ color:'var(--txt)' }}>Physics:</strong> Quantum mechanics uses Hermitian matrices; stress tensors in mechanics are 3×3 symmetric matrices.</li>
                        <li><strong style={{ color:'var(--txt)' }}>Economics:</strong> Input-output models (Leontief) use matrix inverses to solve inter-industry dependency systems.</li>
                      </ul>
                      <h3 style={{ color:'var(--txt)' }}>FAQ</h3>
                      {[
                        { q:'Why is AB ≠ BA?', a:'Matrix multiplication combines row-column dot products. Changing the order changes which rows pair with which columns, generally giving different results.' },
                        { q:'What does a zero determinant mean geometrically?', a:'The transformation squashes the input space into a lower dimension (a line becomes a point, a plane becomes a line, etc.), so no inverse transformation is possible.' },
                        { q:'When do eigenvalues become complex?', a:'When the characteristic polynomial has a negative discriminant (tr² − 4det < 0). This happens for rotation matrices, which have no real fixed directions.' },
                        { q:'What is the rank of a matrix?', a:'The rank is the dimension of the column space (or row space). For an n×n matrix, rank < n means the matrix is singular and non-invertible.' },
                      ].map(({q,a},i) => (
                        <div key={i} style={{ padding:'12px 14px', marginBottom:9,
                          background: dark?'rgba(0,0,0,.35)':'#f5f7ff',
                          border: dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          borderRadius: dark?3:9 }}>
                          <div style={{ fontSize:13.5, fontWeight:700, color:'var(--txt)', marginBottom:5 }}>{q}</div>
                          <div style={{ fontSize:13, color:'var(--txt2)', lineHeight:1.72 }}>{a}</div>
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