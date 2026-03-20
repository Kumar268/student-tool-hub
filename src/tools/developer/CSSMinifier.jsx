import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   CSS MINIFIER — Dark Magenta / Light Rose · Series Architecture
   Full-power CSS minification engine (no external deps)
═══════════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Syne',sans-serif;overflow-x:hidden}

@keyframes scanline{0%{top:-4px}100%{top:102%}}
@keyframes gridmove{from{background-position:0 0}to{background-position:40px 40px}}
@keyframes fadeup{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes pulse-mg{0%,100%{box-shadow:0 0 18px rgba(217,70,239,.1)}50%{box-shadow:0 0 36px rgba(217,70,239,.44),0 0 70px rgba(217,70,239,.12)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.08}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slide-r{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}
@keyframes count-up{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.fadeup{animation:fadeup .22s ease both}
.slide-r{animation:slide-r .18s ease both}

/* ══ DARK — MAGENTA TERMINAL ════════════════════════════════════ */
.dark{
  --bg:#0a0209;--sur:#0f0412;--s2:#13051a;
  --bdr:#2a0c36;--bdr2:rgba(217,70,239,.24);
  --acc:#d946ef;--acc2:#a855f7;--acc3:#f59e0b;
  --ok:#34d399;--err:#f87171;--warn:#fbbf24;
  --txt:#faf0ff;--txt2:#c084fc;--txt3:#6b21a8;
  --ed:#080112;--num:#3d0d50;
  min-height:100vh;background:var(--bg);color:var(--txt);
  background-image:
    linear-gradient(rgba(217,70,239,.016) 1px,transparent 1px),
    linear-gradient(90deg,rgba(217,70,239,.016) 1px,transparent 1px);
  background-size:40px 40px;animation:gridmove 28s linear infinite
}
.scanline{position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:9999;
  background:linear-gradient(90deg,transparent,rgba(217,70,239,.55),transparent);
  box-shadow:0 0 18px rgba(217,70,239,.4);animation:scanline 9s linear infinite;top:-4px}
.dark .panel{background:linear-gradient(150deg,var(--sur),var(--s2));
  border:1px solid var(--bdr);border-radius:3px;position:relative;overflow:hidden}
.dark .panel::before{content:'';position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(217,70,239,.05),transparent);z-index:0}
.dark .panel-body{position:relative;z-index:1}

.dark .tab-bar{background:var(--sur);border-bottom:1px solid var(--bdr)}
.dark .tab{height:36px;padding:0 13px;border:none;border-bottom:2px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'Fira Code',monospace;font-size:10px;font-weight:500;
  letter-spacing:.06em;text-transform:uppercase;transition:all .13s;
  display:flex;align-items:center;gap:5px;white-space:nowrap}
.dark .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(217,70,239,.05)}
.dark .tab:hover:not(.on){color:var(--txt2)}

.dark .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:8px 18px;border:1px solid var(--acc);border-radius:3px;
  background:rgba(217,70,239,.09);color:var(--acc);cursor:pointer;
  font-family:'Fira Code',monospace;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
  box-shadow:0 0 14px rgba(217,70,239,.1);transition:all .15s;animation:pulse-mg 2.5s ease-in-out infinite}
.dark .btn:hover{background:rgba(217,70,239,.2);box-shadow:0 0 30px rgba(217,70,239,.36);transform:translateY(-1px)}
.dark .btn:disabled{opacity:.3;cursor:not-allowed;transform:none;animation:none}
.dark .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;
  padding:4px 10px;border:1px solid var(--bdr);border-radius:3px;
  background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'Fira Code',monospace;font-size:9.5px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;
  transition:all .12s}
.dark .btn-ghost:hover,.dark .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(217,70,239,.07)}
.dark .btn-ghost:disabled{opacity:.3;cursor:not-allowed}

.dark .inp{background:rgba(0,0,0,.5);border:1px solid var(--bdr);border-radius:3px;
  color:var(--txt);font-family:'Fira Code',monospace;font-size:12px;
  padding:6px 10px;outline:none;width:100%;transition:all .13s}
.dark .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(217,70,239,.1)}
.dark .inp::placeholder{color:var(--txt3)}
.dark .sel{background:rgba(0,0,0,.5);border:1px solid var(--bdr);border-radius:3px;
  color:var(--txt);font-family:'Fira Code',monospace;font-size:11px;
  padding:5px 9px;outline:none;cursor:pointer;width:100%}
.dark .sel:focus{border-color:var(--acc)}
.dark .sel option{background:#0f0412}

.dark .metric{border:1px solid rgba(217,70,239,.14);border-radius:3px;padding:10px 13px;
  background:rgba(217,70,239,.04);position:relative;overflow:hidden}
.dark .metric::after{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(217,70,239,.25),transparent)}
.dark .lbl{font-size:8.5px;font-weight:600;font-family:'Fira Code',monospace;letter-spacing:.2em;
  text-transform:uppercase;color:rgba(217,70,239,.45);display:block;margin-bottom:5px}
.dark .hint{font-size:12.5px;color:var(--txt2);line-height:1.75;padding:8px 12px;border-radius:3px;
  background:rgba(217,70,239,.04);border-left:2px solid rgba(217,70,239,.3)}
.dark .ad-slot{background:rgba(217,70,239,.014);border:1px dashed rgba(217,70,239,.1);border-radius:3px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  color:var(--txt3);font-family:'Fira Code',monospace;font-size:8.5px;letter-spacing:.12em;text-transform:uppercase}
.dark .sidebar{border-right:1px solid var(--bdr);background:var(--sur);padding:12px 10px;
  overflow-y:auto;display:flex;flex-direction:column;gap:11px}
.dark .sec-title{font-size:8.5px;font-weight:600;font-family:'Fira Code',monospace;letter-spacing:.22em;
  text-transform:uppercase;color:rgba(217,70,239,.38);margin-bottom:7px}
.dark .code-area{background:var(--ed);border:1px solid var(--bdr);border-radius:3px;
  font-family:'Fira Code',monospace;font-size:12.5px;line-height:1.68;color:var(--txt);
  padding:14px 14px 14px 50px;resize:none;outline:none;width:100%;
  caret-color:var(--acc);tab-size:2;transition:border-color .13s}
.dark .code-area:focus{border-color:rgba(217,70,239,.35)}
.dark .code-area::placeholder{color:var(--txt3)}
.dark .code-area.output-ta{color:#e879f9;background:rgba(0,0,0,.7)}
.dark .line-wrap{position:relative;display:flex;flex:1;overflow:hidden}
.dark .line-nums{position:absolute;left:0;top:0;width:38px;padding:14px 6px 14px 0;
  text-align:right;font-family:'Fira Code',monospace;font-size:12.5px;line-height:1.68;
  color:var(--txt3);pointer-events:none;user-select:none;
  background:rgba(0,0,0,.28);border-right:1px solid var(--bdr)}
.dark .diff-badge{font-family:'Fira Code',monospace;font-size:10px;font-weight:600;
  padding:2px 8px;border-radius:2px;letter-spacing:.06em}
.dark .diff-pos{background:rgba(52,211,153,.1);color:#34d399;border:1px solid rgba(52,211,153,.2)}
.dark .diff-neg{background:rgba(248,113,113,.1);color:#f87171;border:1px solid rgba(248,113,113,.2)}
.dark .rule-row{border:1px solid var(--bdr);border-radius:3px;padding:8px 11px;
  display:flex;align-items:center;gap:8px;transition:border-color .13s}
.dark .rule-row:hover{border-color:rgba(217,70,239,.2)}

/* TOGGLE */
.toggle{position:relative;display:inline-block;width:34px;height:18px;flex-shrink:0}
.toggle input{opacity:0;width:0;height:0;position:absolute}
.toggle-sl{position:absolute;inset:0;border-radius:9px;cursor:pointer;transition:.2s}
.dark .toggle-sl{background:rgba(217,70,239,.15);border:1px solid var(--bdr)}
.toggle input:checked+.toggle-sl{background:rgba(217,70,239,.5);border-color:rgba(217,70,239,.6)}
.toggle-sl::after{content:'';position:absolute;left:2px;top:2px;width:13px;height:13px;
  border-radius:50%;background:var(--txt3);transition:.2s}
.dark .toggle-sl::after{background:var(--txt3)}
.dark input:checked+.toggle-sl::after{background:var(--acc);left:17px;box-shadow:0 0 6px rgba(217,70,239,.6)}
.light .toggle-sl{background:rgba(168,85,247,.15);border:1.5px solid var(--bdr)}
.light input:checked+.toggle-sl{background:rgba(168,85,247,.45);border-color:rgba(168,85,247,.55)}
.light input:checked+.toggle-sl::after{background:var(--acc);left:17px}
.light .toggle-sl::after{background:var(--txt3);left:2px;top:2px;width:13px;height:13px;position:absolute;border-radius:50%;content:'';transition:.2s}

/* BAR CHART */
.bar-bg{height:5px;border-radius:3px;overflow:hidden}
.dark .bar-bg{background:rgba(217,70,239,.1)}
.light .bar-bg{background:rgba(168,85,247,.12)}
.bar-fill{height:100%;border-radius:3px;transition:width .5s cubic-bezier(.34,1.56,.64,1)}
.dark .bar-fill{background:linear-gradient(90deg,var(--acc2),var(--acc))}
.light .bar-fill{background:linear-gradient(90deg,#7c3aed,#a855f7)}

/* ══ LIGHT — ROSE/VIOLET ════════════════════════════════════════ */
.light{
  --bg:#f5f0ff;--sur:#ffffff;--s2:#f0ebff;
  --bdr:#d8caff;--bdr2:#7c3aed;
  --acc:#7c3aed;--acc2:#a855f7;--acc3:#db2777;
  --ok:#059669;--err:#dc2626;--warn:#d97706;
  --txt:#1a0a2e;--txt2:#4c1d95;--txt3:#7c3aed;
  --ed:#faf8ff;
  min-height:100vh;background:var(--bg);color:var(--txt)
}
.light .panel{background:var(--sur);border:1.5px solid var(--bdr);border-radius:10px;
  box-shadow:0 2px 20px rgba(124,58,237,.07);position:relative;overflow:hidden}
.light .panel-body{position:relative;z-index:1}
.light .tab-bar{background:var(--sur);border-bottom:1.5px solid var(--bdr)}
.light .tab{height:36px;padding:0 13px;border:none;border-bottom:2.5px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'Fira Code',monospace;font-size:10px;font-weight:500;letter-spacing:.05em;
  text-transform:uppercase;transition:all .13s;display:flex;align-items:center;gap:5px;white-space:nowrap}
.light .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(124,58,237,.05);font-weight:700}
.light .tab:hover:not(.on){color:var(--txt2);background:rgba(124,58,237,.03)}
.light .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:8px 18px;border:none;border-radius:7px;
  background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;cursor:pointer;
  font-family:'Fira Code',monospace;font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
  box-shadow:0 4px 16px rgba(124,58,237,.4);transition:all .15s}
.light .btn:hover{box-shadow:0 8px 28px rgba(124,58,237,.56);transform:translateY(-1px)}
.light .btn:disabled{opacity:.4;cursor:not-allowed;transform:none}
.light .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;
  padding:4px 10px;border:1.5px solid var(--bdr);border-radius:6px;
  background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'Fira Code',monospace;font-size:9.5px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;
  transition:all .12s}
.light .btn-ghost:hover,.light .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(124,58,237,.08)}
.light .btn-ghost:disabled{opacity:.4;cursor:not-allowed}
.light .inp{background:#f0ebff;border:1.5px solid var(--bdr);border-radius:7px;
  color:var(--txt);font-family:'Fira Code',monospace;font-size:12px;
  padding:6px 10px;outline:none;width:100%;transition:all .13s}
.light .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(124,58,237,.12)}
.light .sel{background:#f0ebff;border:1.5px solid var(--bdr);border-radius:7px;
  color:var(--txt);font-family:'Fira Code',monospace;font-size:11px;
  padding:5px 9px;outline:none;cursor:pointer;width:100%}
.light .sel:focus{border-color:var(--acc)}
.light .metric{border:1.5px solid rgba(124,58,237,.2);border-radius:8px;padding:10px 13px;
  background:rgba(124,58,237,.05)}
.light .lbl{font-size:8.5px;font-weight:600;font-family:'Fira Code',monospace;letter-spacing:.18em;
  text-transform:uppercase;color:var(--acc);display:block;margin-bottom:5px}
.light .hint{font-size:12.5px;color:var(--txt2);line-height:1.75;padding:8px 12px;border-radius:8px;
  background:rgba(124,58,237,.06);border-left:2.5px solid rgba(124,58,237,.35)}
.light .ad-slot{background:rgba(124,58,237,.03);border:1.5px dashed rgba(124,58,237,.2);border-radius:8px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  color:var(--txt3);font-family:'Fira Code',monospace;font-size:8.5px;letter-spacing:.12em;text-transform:uppercase}
.light .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);padding:12px 10px;
  overflow-y:auto;display:flex;flex-direction:column;gap:11px}
.light .sec-title{font-size:8.5px;font-weight:600;font-family:'Fira Code',monospace;letter-spacing:.22em;
  text-transform:uppercase;color:var(--acc);margin-bottom:7px}
.light .code-area{background:var(--ed);border:1.5px solid var(--bdr);border-radius:8px;
  font-family:'Fira Code',monospace;font-size:12.5px;line-height:1.68;color:var(--txt);
  padding:14px 14px 14px 50px;resize:none;outline:none;width:100%;tab-size:2;transition:border-color .13s}
.light .code-area:focus{border-color:rgba(124,58,237,.4)}
.light .code-area::placeholder{color:var(--txt3)}
.light .code-area.output-ta{color:#7c3aed;background:#f5f0ff}
.light .line-wrap{position:relative;display:flex;flex:1;overflow:hidden}
.light .line-nums{position:absolute;left:0;top:0;width:38px;padding:14px 6px 14px 0;
  text-align:right;font-family:'Fira Code',monospace;font-size:12.5px;line-height:1.68;
  color:var(--txt3);pointer-events:none;user-select:none;
  background:rgba(124,58,237,.04);border-right:1.5px solid var(--bdr)}
.light .diff-badge{font-family:'Fira Code',monospace;font-size:10px;font-weight:600;
  padding:2px 8px;border-radius:5px;letter-spacing:.06em}
.light .diff-pos{background:rgba(5,150,105,.1);color:#059669;border:1.5px solid rgba(5,150,105,.2)}
.light .diff-neg{background:rgba(220,38,38,.08);color:#dc2626;border:1.5px solid rgba(220,38,38,.18)}
.light .rule-row{border:1.5px solid var(--bdr);border-radius:7px;padding:8px 11px;
  display:flex;align-items:center;gap:8px;transition:border-color .13s}
.light .rule-row:hover{border-color:rgba(124,58,237,.3)}

/* SHARED */
.topbar{height:40px;position:sticky;top:0;z-index:300;display:flex;align-items:center;padding:0 14px;gap:8px;backdrop-filter:blur(18px)}
.dark .topbar{background:rgba(10,2,9,.97);border-bottom:1px solid var(--bdr)}
.light .topbar{background:rgba(255,255,255,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 10px rgba(124,58,237,.08)}
.body-layout{display:grid;grid-template-columns:200px 1fr;min-height:calc(100vh - 76px)}
.prose p{font-size:13px;line-height:1.78;margin-bottom:11px;color:var(--txt2)}
.prose h3{font-size:14px;font-weight:700;margin:20px 0 7px;color:var(--txt);font-family:'Fira Code',monospace}
.prose ul{padding-left:20px;margin-bottom:11px}
.prose li{font-size:13px;line-height:1.7;margin-bottom:4px;color:var(--txt2)}
.prose strong{font-weight:700;color:var(--txt)}
.step-n{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'Fira Code',monospace;font-size:9.5px;font-weight:700;flex-shrink:0}
.dark .step-n{border:1px solid rgba(217,70,239,.3);background:rgba(217,70,239,.07);color:var(--acc)}
.light .step-n{border:1.5px solid rgba(124,58,237,.3);background:rgba(124,58,237,.09);color:var(--acc)}
`;

/* ═══ ICONS ═══ */
const Svg = ({d,s=14,sw=1.8,fill='none'}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {(Array.isArray(d)?d:[d]).map((p,i)=><path key={i} d={p}/>)}
  </svg>
);
const I = {
  zap:    s=><Svg s={s} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>,
  copy:   s=><Svg s={s} d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2","M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"]}/>,
  dl:     s=><Svg s={s} d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]}/>,
  trash:  s=><Svg s={s} d={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6","M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]}/>,
  ok:     s=><Svg s={s} d="M20 6 9 17l-5-5"/>,
  info:   s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 16v-4M12 8h.01"]}/>,
  chart:  s=><Svg s={s} d={["M18 20V10","M12 20V4","M6 20v-6"]}/>,
  diff:   s=><Svg s={s} d={["M12 20h9","M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z","M15 5l3 3"]}/>,
  book:   s=><Svg s={s} d={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z","M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]}/>,
  code:   s=><Svg s={s} d={["M16 18l6-6-6-6","M8 6l-6 6 6 6"]}/>,
  upload: s=><Svg s={s} d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M17 8l-5-5-5 5","M12 3v12"]}/>,
  eye:    s=><Svg s={s} d={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"]}/>,
  compare:s=><Svg s={s} d={["M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"]}/>,
};

/* ═══════════════════════════════════════════════════════════
   CSS MINIFICATION ENGINE
═══════════════════════════════════════════════════════════ */
function minifyCss(input, opts = {}) {
  const {
    removeComments       = true,
    collapseWhitespace   = true,
    removeZeroUnits      = true,
    shortenColors        = true,
    shortenZero          = true,
    removeSemicolons     = true,
    mergeMediaQueries    = false,
    removeEmptyRules     = true,
    shortenFontWeight    = true,
    normalizeSelectors   = true,
    removeVendorPrefixes = false,
  } = opts;

  let css = input;
  const log = [];

  // 1. Remove comments
  if (removeComments) {
    const before = css.length;
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    const saved = before - css.length;
    if (saved > 0) log.push({rule:'Comments removed', saved, count: (input.match(/\/\*[\s\S]*?\*\//g)||[]).length});
  }

  // 2. Shorten colors  #aabbcc → #abc
  if (shortenColors) {
    const before = css.length;
    css = css.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3(?![0-9a-fA-F])/g, '#$1$2$3');
    // Named colors → shorter hex
    const colorMap = {
      white:'#fff',black:'#000',red:'#f00',lime:'#0f0',blue:'#00f',
      yellow:'#ff0',cyan:'#0ff',magenta:'#f0f',silver:'#c0c0c0',gray:'#808080',
      maroon:'#800000',olive:'#808000',green:'#008000',purple:'#800080',
      teal:'#008080',navy:'#000080',fuchsia:'#f0f',aqua:'#0ff',
    };
    Object.entries(colorMap).forEach(([name, hex]) => {
      css = css.replace(new RegExp(`(?<=[:\\s,])${name}(?=[;,\\s}!)])`,'gi'), hex);
    });
    const saved = before - css.length;
    if (saved > 0) log.push({rule:'Colors shortened', saved});
  }

  // 3. Remove units from zero values  0px → 0
  if (removeZeroUnits) {
    const before = css.length;
    css = css.replace(/([^0-9])0(px|em|rem|%|pt|pc|ex|ch|vw|vh|vmin|vmax|cm|mm|in)/g, '$10');
    const saved = before - css.length;
    if (saved > 0) log.push({rule:'Zero units removed', saved});
  }

  // 4. Collapse whitespace
  if (collapseWhitespace) {
    const before = css.length;
    css = css.replace(/\s*([{}:;,>~+])\s*/g, '$1');
    css = css.replace(/\s+/g, ' ');
    css = css.replace(/;\s*}/g, '}');
    css = css.replace(/\s*{\s*/g, '{');
    css = css.replace(/\s*}\s*/g, '}');
    css = css.replace(/\s*;\s*/g, ';');
    css = css.replace(/\s*,\s*/g, ',');
    css = css.trim();
    const saved = before - css.length;
    if (saved > 0) log.push({rule:'Whitespace collapsed', saved});
  }

  // 5. Remove last semicolons before }
  if (removeSemicolons) {
    const before = css.length;
    css = css.replace(/;}/g, '}');
    const saved = before - css.length;
    if (saved > 0) log.push({rule:'Trailing semicolons', saved});
  }

  // 6. Shorten 0.x → .x
  if (shortenZero) {
    const before = css.length;
    css = css.replace(/([^a-zA-Z0-9])0\.([0-9])/g, '$1.$2');
    const saved = before - css.length;
    if (saved > 0) log.push({rule:'Leading zeros removed', saved});
  }

  // 7. Shorten font-weight names
  if (shortenFontWeight) {
    const before = css.length;
    const fwMap = {'normal':'400','bold':'700','lighter':'300','bolder':'900'};
    css = css.replace(/font-weight:(normal|bold|lighter|bolder)/g, (m,v) => `font-weight:${fwMap[v]||v}`);
    // Also normal/bold keyword
    const saved = before - css.length;
    if (saved > 0) log.push({rule:'Font-weight normalized', saved});
  }

  // 8. Normalize rgba → #hex where possible (full opacity)
  const before8 = css.length;
  css = css.replace(/rgba\((\d+),(\d+),(\d+),1\)/g, (m,r,g,b) => {
    const hex = '#' + [+r,+g,+b].map(v=>v.toString(16).padStart(2,'0')).join('');
    return hex;
  });
  if (css.length < before8) log.push({rule:'rgba(…,1) → hex', saved: before8 - css.length});

  // 9. Shorten margin/padding shorthand redundancies: 5px 5px → 5px
  const before9 = css.length;
  css = css.replace(/(margin|padding):([^;{}]+)/g, (match, prop, val) => {
    const parts = val.trim().split(/\s+/);
    if (parts.length === 4 && parts[0]===parts[2] && parts[1]===parts[3]) {
      return `${prop}:${parts[0]} ${parts[1]}`;
    }
    if (parts.length === 4 && parts[0]===parts[1] && parts[1]===parts[2] && parts[2]===parts[3]) {
      return `${prop}:${parts[0]}`;
    }
    if (parts.length === 2 && parts[0]===parts[1]) {
      return `${prop}:${parts[0]}`;
    }
    return match;
  });
  if (css.length < before9) log.push({rule:'Shorthand values compressed', saved: before9 - css.length});

  // 10. Remove empty rules
  if (removeEmptyRules) {
    const before = css.length;
    css = css.replace(/[^{}]+\{\s*\}/g, '');
    const saved = before - css.length;
    if (saved > 0) log.push({rule:'Empty rules removed', saved});
  }

  // 11. Remove vendor prefixes
  if (removeVendorPrefixes) {
    const before = css.length;
    css = css.replace(/(-webkit-|-moz-|-ms-|-o-)[\w-]+:[^;{}]+;/g, '');
    const saved = before - css.length;
    if (saved > 0) log.push({rule:'Vendor prefixes stripped', saved});
  }

  // Final compress
  css = css.replace(/\s+/g, ' ').trim();

  return { minified: css, log };
}

/* Format bytes */
const fmtB = b => b >= 1024 ? `${(b/1024).toFixed(2)} KB` : `${b} B`;
const fmtPct = (a,b) => b === 0 ? '0%' : `${((1-a/b)*100).toFixed(1)}%`;

/* Line numbers */
function LineNums({code}){
  const n = (code||'').split('\n').length;
  return (
    <div className="line-nums">
      {Array.from({length:n},(_,i)=>(
        <div key={i} style={{height:'1.68em',lineHeight:'1.68em'}}>{i+1}</div>
      ))}
    </div>
  );
}

/* Toggle */
function Toggle({checked, onChange, label}){
  return (
    <div style={{display:'flex',alignItems:'center',gap:8}}>
      <label className="toggle">
        <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)}/>
        <span className="toggle-sl"/>
      </label>
      <span style={{fontSize:11.5,fontFamily:"'Fira Code',monospace",color:'var(--txt2)'}}>{label}</span>
    </div>
  );
}

/* Stat row */
function StatRow({label, value, sub, dark, accent}){
  return (
    <div className="metric">
      <div className="lbl">{label}</div>
      <div style={{fontSize:22,fontWeight:700,fontFamily:"'Fira Code',monospace",
        color:accent||'var(--acc)',animation:'count-up .3s ease both'}}>
        {value}
      </div>
      {sub&&<div style={{fontSize:10,color:'var(--txt3)',marginTop:3,fontFamily:"'Fira Code',monospace"}}>{sub}</div>}
    </div>
  );
}

/* Diff viewer: simple char-level highlight of changes */
function DiffViewer({original, minified, dark}){
  if (!original || !minified) return null;
  const removed = original.length - minified.length;
  const pct = (removed/original.length*100).toFixed(1);
  // Show first 800 chars of each side
  const maxShow = 600;
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
      <div>
        <div style={{fontSize:9,fontFamily:"'Fira Code',monospace",letterSpacing:'.12em',textTransform:'uppercase',
          color:'var(--txt3)',marginBottom:6,display:'flex',alignItems:'center',gap:5}}>
          <span>Original</span>
          <span className="diff-badge diff-neg">{fmtB(original.length)}</span>
        </div>
        <pre style={{fontSize:11,fontFamily:"'Fira Code',monospace",lineHeight:1.6,
          padding:'10px 12px',borderRadius:dark?3:7,overflowX:'auto',maxHeight:220,overflow:'auto',
          background:dark?'rgba(248,113,113,.04)':'rgba(220,38,38,.03)',
          border:dark?'1px solid rgba(248,113,113,.15)':'1.5px solid rgba(220,38,38,.15)',
          color:dark?'#fca5a5':'#b91c1c',whiteSpace:'pre-wrap',wordBreak:'break-all'}}>
          {original.slice(0,maxShow)}{original.length>maxShow?'\n…':''}
        </pre>
      </div>
      <div>
        <div style={{fontSize:9,fontFamily:"'Fira Code',monospace",letterSpacing:'.12em',textTransform:'uppercase',
          color:'var(--txt3)',marginBottom:6,display:'flex',alignItems:'center',gap:5}}>
          <span>Minified</span>
          <span className="diff-badge diff-pos">{fmtB(minified.length)} (−{pct}%)</span>
        </div>
        <pre style={{fontSize:11,fontFamily:"'Fira Code',monospace",lineHeight:1.6,
          padding:'10px 12px',borderRadius:dark?3:7,overflowX:'auto',maxHeight:220,overflow:'auto',
          background:dark?'rgba(52,211,153,.04)':'rgba(5,150,105,.03)',
          border:dark?'1px solid rgba(52,211,153,.15)':'1.5px solid rgba(5,150,105,.18)',
          color:dark?'#86efac':'#065f46',whiteSpace:'pre-wrap',wordBreak:'break-all'}}>
          {minified.slice(0,maxShow)}{minified.length>maxShow?'\n…':''}
        </pre>
      </div>
    </div>
  );
}

const SAMPLE_CSS = `/* Main Layout */
body {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-color: #ffffff;
  color: #333333;
  margin: 0px 0px 0px 0px;
  padding: 16px 16px 16px 16px;
  font-size: 16px;
  line-height: 1.60;
}

.container {
  max-width: 1200px;
  margin: 0px auto;
  padding: 0px 20px;
}

/* Header Styles */
.header {
  background: rgba(255, 255, 255, 1);
  border-bottom: 1px solid #aabbcc;
  padding: 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  -webkit-box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  -moz-box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Navigation */
.nav-link {
  color: #6633ff;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.200s ease;
  padding: 8px 0px;
}

.nav-link:hover {
  color: #3311cc;
}

/* Cards */
.card {
  border-radius: 8px 8px 8px 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 24px 24px 24px 24px;
  background: white;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .container {
    padding: 0px 16px;
  }
  .header {
    flex-direction: column;
  }
}

/* Empty rule */
.nothing {

}`;

const TABS = [
  {id:'minify',  label:'⚡ Minify'},
  {id:'diff',    label:'⊟ Diff'},
  {id:'rules',   label:'⊞ Rules'},
  {id:'batch',   label:'⊛ Batch'},
  {id:'guide',   label:'? Guide'},
  {id:'learn',   label:'∑ Learn'},
];

/* ════════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════════ */
export default function CssMinifier() {
  const [mode, setMode] = useState('dark');
  const dark = mode === 'dark';

  const [input, setInput] = useState(SAMPLE_CSS);
  const [output, setOutput] = useState('');
  const [log, setLog] = useState([]);
  const [tab, setTab] = useState('minify');
  const [copyOk, setCopyOk] = useState(false);
  const [hasMinified, setHasMinified] = useState(false);

  // Options
  const [opts, setOpts] = useState({
    removeComments:       true,
    collapseWhitespace:   true,
    removeZeroUnits:      true,
    shortenColors:        true,
    shortenZero:          true,
    removeSemicolons:     true,
    removeEmptyRules:     true,
    shortenFontWeight:    true,
    normalizeSelectors:   true,
    removeVendorPrefixes: false,
    mergeMediaQueries:    false,
  });

  // Batch
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchResults, setBatchResults] = useState([]);
  const fileInputRef = useRef(null);

  const setOpt = (k, v) => setOpts(prev => ({...prev, [k]: v}));

  const run = useCallback(() => {
    if (!input.trim()) return;
    const {minified, log: newLog} = minifyCss(input, opts);
    setOutput(minified);
    setLog(newLog);
    setHasMinified(true);
  }, [input, opts]);

  // Auto-run on option change when we have output
  useEffect(() => { if (hasMinified) run(); }, [opts]);

  const copy = () => {
    try { navigator.clipboard.writeText(output); } catch(e){}
    setCopyOk(true); setTimeout(()=>setCopyOk(false), 1400);
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([output], {type:'text/css'}));
    a.download = 'styles.min.css'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const clear = () => { setInput(''); setOutput(''); setLog([]); setHasMinified(false); };

  // Batch processing
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setTab('batch');
    Promise.all(files.map(f => new Promise(res => {
      const r = new FileReader();
      r.onload = ev => res({name: f.name, content: ev.target.result, size: f.size});
      r.readAsText(f);
    }))).then(loaded => {
      setBatchFiles(loaded);
      const results = loaded.map(f => {
        const {minified, log} = minifyCss(f.content, opts);
        return {...f, minified, logItems: log, minSize: minified.length};
      });
      setBatchResults(results);
    });
  };

  const stats = useMemo(() => {
    if (!input || !output) return null;
    const orig = input.length, min = output.length;
    const saved = orig - min;
    const pct = orig > 0 ? ((saved/orig)*100).toFixed(1) : '0';
    const origLines = input.split('\n').length;
    const minLines = output.split('\n').length;
    return { orig, min, saved, pct, origLines, minLines };
  }, [input, output]);

  const totalBatchSaved = batchResults.reduce((s,r)=>s+(r.size-r.minSize),0);
  const totalBatchOrig  = batchResults.reduce((s,r)=>s+r.size,0);

  const OPT_GROUPS = [
    {
      label:'Core',
      items:[
        {k:'removeComments',     l:'Remove comments',         desc:'Strips /* ... */ blocks'},
        {k:'collapseWhitespace', l:'Collapse whitespace',     desc:'Removes newlines, extra spaces'},
        {k:'removeSemicolons',   l:'Remove trailing semicolons', desc:'Last ; before } not needed'},
        {k:'removeEmptyRules',   l:'Remove empty rules',      desc:'Deletes selectors with no declarations'},
      ]
    },
    {
      label:'Values',
      items:[
        {k:'removeZeroUnits',    l:'Remove zero units',       desc:'0px → 0'},
        {k:'shortenZero',        l:'Remove leading zeros',    desc:'0.5 → .5'},
        {k:'shortenColors',      l:'Shorten colors',          desc:'#aabbcc → #abc'},
        {k:'shortenFontWeight',  l:'Normalize font-weight',   desc:'bold → 700'},
      ]
    },
    {
      label:'Advanced',
      items:[
        {k:'removeVendorPrefixes',l:'Strip vendor prefixes',  desc:'-webkit- / -moz- etc.'},
        {k:'mergeMediaQueries',   l:'Merge @media queries',   desc:'Combine identical queries (experimental)'},
      ]
    },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className={dark?'dark':'light'}>
        {dark&&<div className="scanline"/>}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <div style={{width:26,height:26,borderRadius:dark?2:7,
              background:dark?'transparent':'linear-gradient(135deg,#7c3aed,#a855f7)',
              border:dark?'1px solid rgba(217,70,239,.5)':'none',
              display:'flex',alignItems:'center',justifyContent:'center',
              color:dark?'var(--acc)':'#fff',
              boxShadow:dark?'0 0 14px rgba(217,70,239,.3)':'0 3px 10px rgba(124,58,237,.4)'}}>
              {I.zap(13)}
            </div>
            <span style={{fontSize:13.5,fontWeight:800,fontFamily:"'Syne',sans-serif",
              color:'var(--txt)',letterSpacing:'.01em'}}>
              CSS<span style={{color:'var(--acc)'}}>.min</span>
            </span>
            <span style={{fontSize:7.5,fontWeight:700,fontFamily:"'Fira Code',monospace",
              padding:'1px 5px',borderRadius:dark?2:4,
              border:dark?'1px solid rgba(217,70,239,.22)':'1.5px solid rgba(124,58,237,.22)',
              color:dark?'rgba(217,70,239,.55)':'var(--acc)',
              background:dark?'rgba(217,70,239,.04)':'rgba(124,58,237,.06)',
              letterSpacing:'.16em',textTransform:'uppercase'}}>PRO</span>
          </div>
          <div style={{flex:1}}/>

          {/* Stats pill */}
          {stats&&(
            <div style={{display:'flex',alignItems:'center',gap:6,
              padding:'3px 11px',borderRadius:dark?2:7,
              border:dark?'1px solid rgba(52,211,153,.3)':'1.5px solid rgba(5,150,105,.22)',
              background:dark?'rgba(52,211,153,.06)':'rgba(5,150,105,.05)'}}>
              <span className="diff-badge diff-pos" style={{fontSize:9}}>−{stats.pct}%</span>
              <span style={{fontSize:9.5,fontFamily:"'Fira Code',monospace",color:dark?'#34d399':'#059669'}}>
                saved {fmtB(stats.saved)}
              </span>
            </div>
          )}

          {/* Upload */}
          <input ref={fileInputRef} type="file" accept=".css" multiple style={{display:'none'}} onChange={handleFiles}/>
          <button className="btn-ghost" onClick={()=>fileInputRef.current?.click()}>
            {I.upload(10)} Upload .css
          </button>

          {hasMinified&&<>
            <button className="btn-ghost" onClick={copy}>{copyOk?I.ok(10):I.copy(10)} Copy</button>
            <button className="btn-ghost" onClick={download}>{I.dl(10)} .min.css</button>
          </>}

          {/* Theme */}
          <button onClick={()=>setMode(dark?'light':'dark')} style={{
            display:'flex',alignItems:'center',gap:5,padding:'4px 10px',
            border:dark?'1px solid rgba(217,70,239,.2)':'1.5px solid var(--bdr)',
            borderRadius:dark?2:6,background:dark?'rgba(217,70,239,.03)':'var(--sur)',
            cursor:'pointer',transition:'all .14s'}}>
            {dark?(
              <><div style={{width:26,height:14,borderRadius:7,background:'var(--acc)',position:'relative',
                  boxShadow:'0 0 8px rgba(217,70,239,.5)'}}>
                <div style={{position:'absolute',top:2,right:2,width:10,height:10,borderRadius:'50%',background:'#0a0209'}}/>
              </div><span style={{fontSize:9,fontWeight:700,fontFamily:"'Fira Code',monospace",
                color:'rgba(217,70,239,.6)',letterSpacing:'.1em'}}>MGT</span></>
            ):(
              <><span style={{fontSize:9.5,color:'var(--txt3)',fontWeight:600,fontFamily:"'Fira Code',monospace"}}>ROSE</span>
              <div style={{width:26,height:14,borderRadius:7,background:'#d8caff',position:'relative'}}>
                <div style={{position:'absolute',top:2,left:2,width:10,height:10,borderRadius:'50%',background:'#a891e8'}}/>
              </div></>
            )}
          </button>
        </div>

        {/* TAB BAR */}
        <div className="tab-bar" style={{display:'flex'}}>
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* BODY */}
        <div className="body-layout">

          {/* SIDEBAR */}
          <div className="sidebar">

            {/* Options groups */}
            {OPT_GROUPS.map(g=>(
              <div key={g.label}>
                <div className="sec-title">{g.label}</div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {g.items.map(({k,l,desc})=>(
                    <div key={k} className="rule-row">
                      <Toggle checked={opts[k]} onChange={v=>setOpt(k,v)} label={l}/>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Size meter */}
            {stats&&(
              <div>
                <div className="sec-title">Size</div>
                <div style={{marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:9.5,fontFamily:"'Fira Code',monospace",color:'var(--txt3)'}}>Original</span>
                    <span style={{fontSize:9.5,fontFamily:"'Fira Code',monospace",color:'var(--txt2)'}}>{fmtB(stats.orig)}</span>
                  </div>
                  <div className="bar-bg"><div className="bar-fill" style={{width:'100%'}}/></div>
                </div>
                <div>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{fontSize:9.5,fontFamily:"'Fira Code',monospace",color:'var(--txt3)'}}>Minified</span>
                    <span style={{fontSize:9.5,fontFamily:"'Fira Code',monospace",color:dark?'#34d399':'#059669'}}>{fmtB(stats.min)}</span>
                  </div>
                  <div className="bar-bg"><div className="bar-fill" style={{width:`${(stats.min/stats.orig*100).toFixed(1)}%`}}/></div>
                </div>
              </div>
            )}

            {/* Optimisations log */}
            {log.length>0&&(
              <div>
                <div className="sec-title">Optimisations</div>
                {log.map((l,i)=>(
                  <div key={i} style={{fontSize:10.5,color:'var(--txt2)',marginBottom:5,
                    display:'flex',justifyContent:'space-between',alignItems:'center',
                    fontFamily:"'Fira Code',monospace",
                    padding:'5px 8px',
                    background:dark?'rgba(217,70,239,.03)':'rgba(124,58,237,.04)',
                    border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                    borderRadius:dark?2:5}}>
                    <span style={{color:'var(--txt2)'}}>{l.rule}</span>
                    <span className="diff-badge diff-pos" style={{fontSize:8.5}}>−{fmtB(l.saved)}</span>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* MAIN CONTENT */}
          <div style={{padding:'13px 15px',display:'flex',flexDirection:'column',gap:12}}>
            <AnimatePresence mode="wait">

              {/* ════ MINIFY ════ */}
              {tab==='minify'&&(
                <motion.div key="minify" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  {/* Editor row */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    {/* Input */}
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span className="lbl" style={{margin:0}}>Input CSS</span>
                        <div style={{display:'flex',gap:5}}>
                          <span style={{fontSize:9.5,fontFamily:"'Fira Code',monospace",color:'var(--txt3)'}}>
                            {input.split('\n').length}L · {input.length}B
                          </span>
                          <button className="btn-ghost" onClick={clear} style={{padding:'2px 7px',fontSize:8.5}}>
                            {I.trash(9)} Clear
                          </button>
                        </div>
                      </div>
                      <div className="line-wrap">
                        <LineNums code={input}/>
                        <textarea className="code-area"
                          value={input} onChange={e=>setInput(e.target.value)}
                          placeholder="Paste your CSS here…"
                          spellCheck={false}
                          style={{minHeight:340,flex:1}}/>
                      </div>
                    </div>

                    {/* Output */}
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span className="lbl" style={{margin:0}}>Minified Output</span>
                        {stats&&(
                          <div style={{display:'flex',gap:5,alignItems:'center'}}>
                            <span style={{fontSize:9.5,fontFamily:"'Fira Code',monospace",color:dark?'#34d399':'#059669'}}>
                              {stats.min}B (−{stats.pct}%)
                            </span>
                            <button className="btn-ghost" onClick={copy} style={{padding:'2px 7px',fontSize:8.5}}>
                              {copyOk?I.ok(9):I.copy(9)} {copyOk?'Copied':'Copy'}
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="line-wrap">
                        <LineNums code={output||''}/>
                        <textarea className="code-area output-ta"
                          value={output} readOnly placeholder="Minified CSS will appear here…"
                          style={{minHeight:340,flex:1}}/>
                      </div>
                    </div>
                  </div>

                  {/* Minify button */}
                  <div style={{display:'flex',justifyContent:'center',gap:10}}>
                    <button className="btn" onClick={run} disabled={!input.trim()} style={{padding:'10px 36px',fontSize:11}}>
                      {I.zap(12)} Minify CSS
                    </button>
                    {hasMinified&&(
                      <button className="btn-ghost" onClick={download} style={{padding:'10px 16px'}}>
                        {I.dl(11)} Download .min.css
                      </button>
                    )}
                  </div>

                  {/* Stats row */}
                  {stats&&(
                    <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                      style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:9}}>
                      <StatRow label="Original Size"  value={fmtB(stats.orig)}       dark={dark}/>
                      <StatRow label="Minified Size"  value={fmtB(stats.min)}        dark={dark} accent={dark?'#34d399':'#059669'}/>
                      <StatRow label="Bytes Saved"    value={fmtB(stats.saved)}      dark={dark} accent={dark?'#34d399':'#059669'}/>
                      <StatRow label="Reduction"      value={`${stats.pct}%`}        dark={dark} accent={dark?'#34d399':'#059669'}
                        sub={`${stats.origLines} → ${stats.minLines} lines`}/>
                    </motion.div>
                  )}

                </motion.div>
              )}

              {/* ════ DIFF ════ */}
              {tab==='diff'&&(
                <motion.div key="diff" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  {!hasMinified?(
                    <div className="hint" style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                      {I.info(14)} Run minification first (⚡ Minify tab) to see the diff.
                    </div>
                  ):(
                    <>
                      <DiffViewer original={input} minified={output} dark={dark}/>
                      <div>
                        <div className="lbl" style={{marginBottom:8}}>Optimisation Log</div>
                        {log.length===0?(
                          <p style={{fontSize:13,color:'var(--txt3)',fontFamily:"'Fira Code',monospace"}}>No optimisations recorded — input may already be minimal.</p>
                        ):log.map((l,i)=>(
                          <div key={i} className="rule-row" style={{marginBottom:6}}>
                            <div style={{flex:1}}>
                              <div style={{fontSize:12,fontWeight:700,fontFamily:"'Fira Code',monospace",color:'var(--txt)',marginBottom:2}}>{l.rule}</div>
                            </div>
                            <span className="diff-badge diff-pos">−{fmtB(l.saved)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  
                </motion.div>
              )}

              {/* ════ RULES ════ */}
              {tab==='rules'&&(
                <motion.div key="rules" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:10}}>
                  <div className="hint" style={{display:'flex',gap:7,alignItems:'flex-start',fontSize:12}}>
                    {I.info(13)} Toggle rules on/off in the sidebar. Changes apply automatically when CSS is already minified.
                  </div>
                  {OPT_GROUPS.map(g=>(
                    <div key={g.label}>
                      <div className="lbl" style={{marginBottom:8}}>// {g.label}</div>
                      {g.items.map(({k,l,desc})=>(
                        <div key={k} className="rule-row" style={{marginBottom:6,flexDirection:'column',alignItems:'flex-start',gap:6}}>
                          <div style={{display:'flex',justifyContent:'space-between',width:'100%',alignItems:'center'}}>
                            <Toggle checked={opts[k]} onChange={v=>setOpt(k,v)} label={l}/>
                            <span className="diff-badge" style={{
                              fontSize:8,
                              border:dark?'1px solid rgba(217,70,239,.2)':'1.5px solid rgba(124,58,237,.2)',
                              background:dark?'rgba(217,70,239,.06)':'rgba(124,58,237,.05)',
                              color:'var(--acc)'}}>
                              {opts[k]?'ON':'OFF'}
                            </span>
                          </div>
                          <div style={{fontSize:11,color:'var(--txt3)',fontFamily:"'Fira Code',monospace",paddingLeft:42}}>{desc}</div>
                          {/* Example */}
                          {k==='removeZeroUnits'&&<div style={{paddingLeft:42,fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--txt2)'}}>
                            <span style={{color:dark?'#f87171':'#dc2626'}}>margin: 0px 0px;</span>
                            {' → '}
                            <span style={{color:dark?'#34d399':'#059669'}}>margin: 0 0;</span>
                          </div>}
                          {k==='shortenColors'&&<div style={{paddingLeft:42,fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--txt2)'}}>
                            <span style={{color:dark?'#f87171':'#dc2626'}}>#aabbcc</span>
                            {' → '}
                            <span style={{color:dark?'#34d399':'#059669'}}>#abc</span>
                          </div>}
                          {k==='removeSemicolons'&&<div style={{paddingLeft:42,fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--txt2)'}}>
                            <span style={{color:dark?'#f87171':'#dc2626'}}>{'.a{color:red;}'}</span>
                            {' → '}
                            <span style={{color:dark?'#34d399':'#059669'}}>{'.a{color:red}'}</span>
                          </div>}
                          {k==='shortenZero'&&<div style={{paddingLeft:42,fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--txt2)'}}>
                            <span style={{color:dark?'#f87171':'#dc2626'}}>opacity: 0.5</span>
                            {' → '}
                            <span style={{color:dark?'#34d399':'#059669'}}>opacity: .5</span>
                          </div>}
                        </div>
                      ))}
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {/* ════ BATCH ════ */}
              {tab==='batch'&&(
                <motion.div key="batch" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:11}}>
                  {batchResults.length===0?(
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                      gap:14,padding:'48px 24px',textAlign:'center'}}>
                      <div style={{fontSize:44}}>⚡</div>
                      <div style={{fontSize:15,fontWeight:700,fontFamily:"'Syne',sans-serif",color:'var(--txt)'}}>Batch CSS Minifier</div>
                      <div style={{fontSize:13,color:'var(--txt3)',lineHeight:1.75,maxWidth:300}}>
                        Upload multiple .css files at once. All files are processed locally — nothing is sent to a server.
                      </div>
                      <button className="btn" onClick={()=>fileInputRef.current?.click()} style={{padding:'10px 28px',fontSize:11}}>
                        {I.upload(12)} Upload .css Files
                      </button>
                    </div>
                  ):(
                    <>
                      {/* Batch stats */}
                      {totalBatchOrig>0&&(
                        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:9}}>
                          <StatRow label="Files" value={batchResults.length} dark={dark}/>
                          <StatRow label="Total Saved" value={fmtB(totalBatchSaved)} dark={dark} accent={dark?'#34d399':'#059669'}/>
                          <StatRow label="Avg Reduction" value={`${totalBatchOrig>0?((totalBatchSaved/totalBatchOrig)*100).toFixed(1):0}%`} dark={dark} accent={dark?'#34d399':'#059669'}/>
                        </div>
                      )}
                      {/* File list */}
                      {batchResults.map((r,i)=>(
                        <div key={i} className="panel" style={{padding:'11px 13px'}}>
                          <div className="panel-body">
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
                              <span style={{fontSize:12.5,fontWeight:700,fontFamily:"'Fira Code',monospace",color:'var(--txt)'}}>{r.name}</span>
                              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                                <span className="diff-badge diff-neg">{fmtB(r.size)}</span>
                                <span style={{fontSize:10,color:'var(--txt3)'}}>→</span>
                                <span className="diff-badge diff-pos">{fmtB(r.minSize)}</span>
                              </div>
                            </div>
                            <div className="bar-bg" style={{marginBottom:7}}>
                              <div className="bar-fill" style={{width:`${(r.minSize/r.size*100).toFixed(1)}%`}}/>
                            </div>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                              <span style={{fontSize:10,color:'var(--txt3)',fontFamily:"'Fira Code',monospace"}}>
                                Saved {fmtB(r.size-r.minSize)} · −{((1-r.minSize/r.size)*100).toFixed(1)}%
                              </span>
                              <button className="btn-ghost" style={{padding:'3px 8px',fontSize:9}} onClick={()=>{
                                const a=document.createElement('a');
                                a.href=URL.createObjectURL(new Blob([r.minified],{type:'text/css'}));
                                a.download=r.name.replace('.css','.min.css');
                                document.body.appendChild(a);a.click();document.body.removeChild(a);
                              }}>
                                {I.dl(9)} Download
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button className="btn-ghost" onClick={()=>fileInputRef.current?.click()} style={{alignSelf:'flex-start',gap:5}}>
                        {I.upload(10)} Add More Files
                      </button>
                    </>
                  )}
                  
                </motion.div>
              )}

              {/* ════ GUIDE ════ */}
              {tab==='guide'&&(
                <motion.div key="guide" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:10}}>
                  <div className="hint" style={{display:'flex',gap:7,alignItems:'flex-start',fontSize:12}}>
                    {I.info(13)} CSS.min processes everything locally in your browser — your code never leaves your machine.
                  </div>
                  {[
                    {t:'Paste or upload your CSS',   d:'Paste code directly into the Input panel, or click "Upload .css" in the topbar. Sample CSS is loaded by default to demo the tool.'},
                    {t:'Configure rules',            d:'Toggle individual optimisation rules in the sidebar. Each rule targets a specific type of bloat. Rules update the output live.'},
                    {t:'Click ⚡ Minify CSS',        d:'Hit the Minify button to run all active rules at once. The output appears in the right panel with detailed savings stats.'},
                    {t:'Review the Diff',            d:'Switch to the ⊟ Diff tab to see exactly what was removed. Colour-coded before/after with per-rule savings breakdown.'},
                    {t:'Download or copy',           d:'Copy the minified CSS to clipboard with one click, or download as a .min.css file ready to use in production.'},
                    {t:'Batch process files',        d:'Upload multiple .css files at once using the ⊛ Batch tab. Download each minified file individually.'},
                  ].map(({t,d},i)=>(
                    <div key={i} style={{display:'flex',gap:10}}>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
                        <div className="step-n">{i+1}</div>
                        {i<5&&<div style={{width:1.5,flex:1,marginTop:4,background:dark?'rgba(217,70,239,.1)':'rgba(124,58,237,.12)'}}/>}
                      </div>
                      <div style={{flex:1,paddingTop:1,paddingBottom:10}}>
                        <div style={{fontSize:13,fontWeight:700,color:'var(--txt)',marginBottom:3,fontFamily:"'Fira Code',monospace"}}>{t}</div>
                        <div style={{fontSize:13,color:'var(--txt2)',lineHeight:1.7}}>{d}</div>
                      </div>
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {/* ════ LEARN ════ */}
              {tab==='learn'&&(
                <motion.div key="learn" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <div className="panel" style={{padding:'20px 22px',marginBottom:12}}>
                    <div className="panel-body">
                      <div style={{fontSize:19,fontWeight:800,fontFamily:"'Syne',sans-serif",color:'var(--txt)',marginBottom:3,letterSpacing:'.01em'}}>
                        CSS Minification: Complete Reference
                      </div>
                      <p style={{fontSize:11,color:'var(--txt3)',fontFamily:"'Fira Code',monospace",marginBottom:20}}>
                        How minification works · performance impact · production strategies
                      </p>
                      <div className="prose">
                        <p>CSS minification is the process of removing all unnecessary characters from stylesheet files without changing their functionality — comments, whitespace, newlines, redundant values and verbose syntax are all targets.</p>
                        <h3>// Why Minify CSS?</h3>
                        <p>Every byte of CSS a browser downloads blocks rendering. Smaller stylesheets mean faster <strong>First Contentful Paint (FCP)</strong> and <strong>Largest Contentful Paint (LCP)</strong> — two of Google's Core Web Vitals. A well-minified CSS file can be 20–60% smaller than the original.</p>
                        <ul>
                          <li>Reduces network transfer time (critical on mobile/slow connections)</li>
                          <li>Reduces parse time — less for the browser engine to tokenise</li>
                          <li>Works even better with gzip/brotli compression on top</li>
                          <li>No semantic change — identical visual output guaranteed</li>
                        </ul>
                        <h3>// What Gets Removed</h3>
                        <p><strong>Comments:</strong> <code style={{fontFamily:'Fira Code',fontSize:11.5,color:'var(--acc)',background:dark?'rgba(217,70,239,.08)':'rgba(124,58,237,.08)',padding:'1px 5px',borderRadius:3}}>/* ... */</code> blocks are developer documentation — zero browser value, pure byte waste.</p>
                        <p><strong>Whitespace:</strong> Spaces, tabs, newlines, and blank lines exist for human readability. CSS parsers don't need them between tokens.</p>
                        <p><strong>Zero units:</strong> <code style={{fontFamily:'Fira Code',fontSize:11.5,color:'var(--acc)'}}>margin: 0px</code> is equivalent to <code style={{fontFamily:'Fira Code',fontSize:11.5,color:'var(--acc)'}}>margin: 0</code>. The unit after zero is meaningless.</p>
                        <p><strong>Trailing semicolons:</strong> The last declaration in a rule doesn't require a semicolon. <code style={{fontFamily:'Fira Code',fontSize:11.5,color:'var(--acc)'}}>{'{color:red}'}</code> is valid CSS.</p>
                        <p><strong>Verbose colors:</strong> <code style={{fontFamily:'Fira Code',fontSize:11.5,color:'var(--acc)'}}>#aabbcc</code> shortens to <code style={{fontFamily:'Fira Code',fontSize:11.5,color:'var(--acc)'}}>#abc</code> — saves 3 bytes per color.</p>
                        <p><strong>Leading zeros:</strong> <code style={{fontFamily:'Fira Code',fontSize:11.5,color:'var(--acc)'}}>0.75</code> → <code style={{fontFamily:'Fira Code',fontSize:11.5,color:'var(--acc)'}}>.75</code>. Small but adds up across many declarations.</p>
                        <h3>// Minification vs Compression</h3>
                        <p>Minification and gzip/brotli compression are complementary, not alternatives. <strong>Minify first, then compress</strong> — minification removes redundancy at the character level, while compression removes redundancy at the byte-pattern level. Applied together, the savings compound significantly.</p>
                        <h3>// Vendor Prefixes in 2024</h3>
                        <p>Many vendor prefixes like <code style={{fontFamily:'Fira Code',fontSize:11.5,color:'var(--acc)'}}>-webkit-transform</code> are now unnecessary as all modern browsers support the unprefixed versions. Stripping them is safe if you're targeting evergreen browsers, but verify your browser support requirements first.</p>
                        <h3>// Production Workflow</h3>
                        <p>In most modern projects, CSS minification is handled automatically by build tools: <strong>Vite</strong>, <strong>webpack</strong> (css-minimizer-webpack-plugin), or <strong>PostCSS + cssnano</strong>. CSS.min is useful for manual inspection, debugging build output, or quick one-off minification without a build pipeline.</p>
                        {[
                          {q:'Is minification reversible?', a:'Minification itself is reversible (you can re-format minified CSS with a beautifier), but it\'s not perfectly reversible — comments, the developer\'s chosen whitespace style, and semantic intent are lost. Always maintain the original source files.'},
                          {q:'Should I minify inline CSS too?', a:'Yes, if inline CSS in HTML is verbose. However, inline critical CSS is typically small enough that the impact is minimal compared to external stylesheets.'},
                          {q:'What about CSS-in-JS?', a:'Libraries like styled-components or emotion handle minification automatically at build time. Their output is already optimised and further manual minification is not needed.'},
                          {q:'Can minification break my CSS?', a:'A correct minifier should never break CSS. However, aggressive rules (like vendor prefix removal) can cause issues if your target browsers require them. Always test in your target environments after significant minification.'},
                        ].map(({q,a},i)=>(
                          <div key={i} style={{padding:'10px 12px',marginBottom:8,
                            background:dark?'rgba(0,0,0,.4)':'rgba(124,58,237,.04)',
                            border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                            borderRadius:dark?2:7}}>
                            <div style={{fontSize:12.5,fontWeight:700,fontFamily:"'Fira Code',monospace",color:'var(--txt)',marginBottom:4}}>{q}</div>
                            <div style={{fontSize:12.5,color:'var(--txt2)',lineHeight:1.72}}>{a}</div>
                          </div>
                        ))}
                      </div>
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