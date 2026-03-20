import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   HTML PREVIEWER — Dual Theme (Dark Green Terminal / Light Clean)
   Series architecture: topbar · tabs · sidebar · editor · preview
═══════════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{overflow:hidden;height:100%;font-family:'IBM Plex Sans',sans-serif}

@keyframes scanline{0%{top:-3px}100%{top:102%}}
@keyframes gridpulse{from{background-position:0 0}to{background-position:28px 28px}}
@keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes green-glow{0%,100%{box-shadow:0 0 16px rgba(52,211,153,.1)}50%{box-shadow:0 0 32px rgba(52,211,153,.45)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes cursor-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
.fadeup{animation:fadeup .2s ease both}

/* ══ DARK — EMERALD TERMINAL ══════════════════════════════════════ */
.dark{
  --bg:#020c06;--sur:#031008;--s2:#04140a;
  --bdr:#0d2e14;--bdr2:rgba(52,211,153,.22);
  --acc:#34d399;--acc2:#10b981;--acc3:#f59e0b;
  --ok:#34d399;--err:#f87171;--warn:#fbbf24;
  --txt:#e6fff4;--txt2:#7ecda0;--txt3:#3a6650;
  --ed:#010a04;
  height:100vh;overflow:hidden;background:var(--bg);color:var(--txt);
  background-image:
    linear-gradient(rgba(52,211,153,.014) 1px,transparent 1px),
    linear-gradient(90deg,rgba(52,211,153,.014) 1px,transparent 1px);
  background-size:28px 28px;animation:gridpulse 22s linear infinite
}
.scanline{position:fixed;left:0;right:0;height:1.5px;pointer-events:none;z-index:9999;
  background:linear-gradient(90deg,transparent,rgba(52,211,153,.5),transparent);
  box-shadow:0 0 12px rgba(52,211,153,.3);animation:scanline 10s linear infinite;top:-3px}

.dark .panel{background:linear-gradient(145deg,var(--sur),var(--s2));
  border:1px solid var(--bdr);border-radius:3px;position:relative;overflow:hidden}
.dark .panel::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(52,211,153,.2),transparent);pointer-events:none}

.dark .tab-bar{background:var(--sur);border-bottom:1px solid var(--bdr)}
.dark .tab{height:36px;padding:0 13px;border:none;border-bottom:2px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;
  letter-spacing:.07em;text-transform:uppercase;transition:all .13s;
  display:flex;align-items:center;gap:5px;white-space:nowrap}
.dark .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(52,211,153,.05)}
.dark .tab:hover:not(.on){color:var(--txt2)}

.dark .btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:7px 16px;border:1px solid var(--acc);border-radius:3px;
  background:rgba(52,211,153,.09);color:var(--acc);cursor:pointer;
  font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
  box-shadow:0 0 12px rgba(52,211,153,.08);transition:all .15s}
.dark .btn-primary:hover{background:rgba(52,211,153,.18);box-shadow:0 0 24px rgba(52,211,153,.26);transform:translateY(-1px)}
.dark .btn-primary:disabled{opacity:.3;cursor:not-allowed;transform:none}

.dark .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;
  padding:4px 9px;border:1px solid var(--bdr);border-radius:3px;
  background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'IBM Plex Mono',monospace;font-size:9.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
  transition:all .12s}
.dark .btn-ghost:hover,.dark .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(52,211,153,.06)}
.dark .btn-ghost:disabled{opacity:.3;cursor:not-allowed}

.dark .btn-danger{display:inline-flex;align-items:center;justify-content:center;gap:4px;
  padding:4px 9px;border:1px solid rgba(248,113,113,.35);border-radius:3px;
  background:rgba(248,113,113,.07);color:var(--err);cursor:pointer;
  font-family:'IBM Plex Mono',monospace;font-size:9.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
  transition:all .12s}
.dark .btn-danger:hover{background:rgba(248,113,113,.16)}

.dark .inp{background:rgba(0,0,0,.6);border:1px solid var(--bdr);border-radius:3px;
  color:var(--txt);font-family:'IBM Plex Mono',monospace;font-size:12px;
  padding:6px 10px;outline:none;width:100%;transition:all .14s}
.dark .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(52,211,153,.1)}
.dark .inp::placeholder{color:var(--txt3)}
.dark .sel{background:rgba(0,0,0,.6);border:1px solid var(--bdr);border-radius:3px;
  color:var(--txt);font-family:'IBM Plex Mono',monospace;font-size:11px;
  padding:5px 9px;outline:none;cursor:pointer;width:100%}
.dark .sel:focus{border-color:var(--acc)}
.dark .sel option{background:#031008}

.dark .metric{border:1px solid rgba(52,211,153,.12);border-radius:3px;padding:9px 11px;background:rgba(52,211,153,.04)}
.dark .lbl{font-size:8.5px;font-weight:600;font-family:'IBM Plex Mono',monospace;letter-spacing:.18em;text-transform:uppercase;color:rgba(52,211,153,.45);display:block;margin-bottom:5px}
.dark .hint{font-size:12.5px;color:var(--txt2);line-height:1.75;padding:8px 11px;border-radius:3px;
  background:rgba(52,211,153,.04);border-left:2px solid rgba(52,211,153,.3)}
.dark .ad-slot{background:rgba(52,211,153,.016);border:1px dashed rgba(52,211,153,.1);border-radius:3px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  color:var(--txt3);font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:.12em;text-transform:uppercase}
.dark .sidebar{border-right:1px solid var(--bdr);background:var(--sur);padding:11px 10px;
  overflow-y:auto;display:flex;flex-direction:column;gap:10px}
.dark .sec-title{font-size:8.5px;font-weight:600;font-family:'IBM Plex Mono',monospace;letter-spacing:.2em;
  text-transform:uppercase;color:rgba(52,211,153,.38);margin-bottom:6px}
.dark .editor-wrap{background:var(--ed);border:1px solid var(--bdr);border-radius:3px;position:relative;overflow:hidden}
.dark .editor-wrap.focused{border-color:rgba(52,211,153,.35);box-shadow:0 0 0 1px rgba(52,211,153,.12)}
.dark .code-ta{background:transparent;color:var(--txt);font-family:'IBM Plex Mono',monospace;font-size:13px;
  line-height:1.7;padding:14px 14px 14px 52px;border:none;outline:none;resize:none;
  width:100%;caret-color:var(--acc);tab-size:2}
.dark .line-nums{position:absolute;left:0;top:0;width:40px;text-align:right;
  padding:14px 8px 14px 0;font-family:'IBM Plex Mono',monospace;font-size:13px;line-height:1.7;
  color:var(--txt3);pointer-events:none;user-select:none;background:rgba(0,0,0,.25);border-right:1px solid var(--bdr)}
.dark .tpl-card{border:1px solid var(--bdr);border-radius:3px;padding:9px 11px;cursor:pointer;transition:all .13s;background:transparent}
.dark .tpl-card:hover{border-color:rgba(52,211,153,.3);background:rgba(52,211,153,.04)}
.dark .preview-bar{background:var(--sur);border-bottom:1px solid var(--bdr);padding:6px 12px;display:flex;align-items:center;gap:8px}
.dark .url-bar{background:rgba(0,0,0,.5);border:1px solid var(--bdr);border-radius:3px;
  color:var(--txt3);font-family:'IBM Plex Mono',monospace;font-size:11px;padding:4px 10px;flex:1}
.dark .status-ok{color:var(--ok);font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.1em}
.dark .status-err{color:var(--err);font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.1em}
.dark .console-line{font-family:'IBM Plex Mono',monospace;font-size:11.5px;line-height:1.65;padding:2px 0;border-bottom:1px solid rgba(52,211,153,.05)}
.dark .console-line.error{color:var(--err)}
.dark .console-line.warn{color:var(--warn)}
.dark .console-line.log{color:var(--txt2)}
.dark .console-line.info{color:var(--acc)}
.dark .step-n{width:22px;height:22px;border-radius:50%;border:1px solid rgba(52,211,153,.3);background:rgba(52,211,153,.07);display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:9.5px;font-weight:700;color:var(--acc);flex-shrink:0}
.dark .step-ln{background:rgba(52,211,153,.1);width:1.5px}

/* ══ LIGHT ══════════════════════════════════════════════════════ */
.light{
  --bg:#f0f4f0;--sur:#ffffff;--s2:#f6f9f6;
  --bdr:#c8d8c8;--bdr2:#16a34a;
  --acc:#16a34a;--acc2:#15803d;--acc3:#d97706;
  --ok:#16a34a;--err:#dc2626;--warn:#d97706;
  --txt:#0f1f0f;--txt2:#2d4f2d;--txt3:#6b8a6b;
  --ed:#f8fbf8;
  height:100vh;overflow:hidden;background:var(--bg);color:var(--txt)
}
.light .panel{background:var(--sur);border:1.5px solid var(--bdr);border-radius:8px;box-shadow:0 2px 14px rgba(22,163,74,.06);position:relative;overflow:hidden}
.light .tab-bar{background:var(--sur);border-bottom:1.5px solid var(--bdr)}
.light .tab{height:36px;padding:0 13px;border:none;border-bottom:2.5px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;letter-spacing:.06em;
  text-transform:uppercase;transition:all .13s;display:flex;align-items:center;gap:5px;white-space:nowrap}
.light .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(22,163,74,.05);font-weight:700}
.light .tab:hover:not(.on){color:var(--txt2);background:rgba(22,163,74,.03)}
.light .btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:7px 16px;border:none;border-radius:6px;
  background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;cursor:pointer;
  font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
  box-shadow:0 3px 12px rgba(22,163,74,.38);transition:all .15s}
.light .btn-primary:hover{box-shadow:0 6px 20px rgba(22,163,74,.5);transform:translateY(-1px)}
.light .btn-primary:disabled{opacity:.4;cursor:not-allowed;transform:none}
.light .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;
  padding:4px 9px;border:1.5px solid var(--bdr);border-radius:5px;
  background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'IBM Plex Mono',monospace;font-size:9.5px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;
  transition:all .12s}
.light .btn-ghost:hover,.light .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(22,163,74,.07)}
.light .btn-ghost:disabled{opacity:.4;cursor:not-allowed}
.light .btn-danger{display:inline-flex;align-items:center;justify-content:center;gap:4px;
  padding:4px 9px;border:1.5px solid rgba(220,38,38,.3);border-radius:5px;
  background:rgba(220,38,38,.06);color:var(--err);cursor:pointer;
  font-family:'IBM Plex Mono',monospace;font-size:9.5px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;
  transition:all .12s}
.light .btn-danger:hover{background:rgba(220,38,38,.14)}
.light .inp{background:#edf3ed;border:1.5px solid var(--bdr);border-radius:6px;
  color:var(--txt);font-family:'IBM Plex Mono',monospace;font-size:12px;
  padding:6px 10px;outline:none;width:100%;transition:all .14s}
.light .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(22,163,74,.12)}
.light .sel{background:#edf3ed;border:1.5px solid var(--bdr);border-radius:6px;
  color:var(--txt);font-family:'IBM Plex Mono',monospace;font-size:11px;
  padding:5px 9px;outline:none;cursor:pointer;width:100%}
.light .sel:focus{border-color:var(--acc)}
.light .metric{border:1.5px solid rgba(22,163,74,.18);border-radius:7px;padding:9px 11px;background:rgba(22,163,74,.045)}
.light .lbl{font-size:8.5px;font-weight:600;font-family:'IBM Plex Mono',monospace;letter-spacing:.16em;text-transform:uppercase;color:var(--acc);display:block;margin-bottom:5px}
.light .hint{font-size:12.5px;color:var(--txt2);line-height:1.75;padding:8px 11px;border-radius:7px;
  background:rgba(22,163,74,.06);border-left:2.5px solid rgba(22,163,74,.35)}
.light .ad-slot{background:rgba(22,163,74,.03);border:1.5px dashed rgba(22,163,74,.2);border-radius:7px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  color:var(--txt3);font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:.12em;text-transform:uppercase}
.light .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);padding:11px 10px;
  overflow-y:auto;display:flex;flex-direction:column;gap:10px}
.light .sec-title{font-size:8.5px;font-weight:600;font-family:'IBM Plex Mono',monospace;letter-spacing:.2em;
  text-transform:uppercase;color:var(--acc);margin-bottom:6px}
.light .editor-wrap{background:var(--ed);border:1.5px solid var(--bdr);border-radius:7px;position:relative;overflow:hidden}
.light .editor-wrap.focused{border-color:rgba(22,163,74,.4);box-shadow:0 0 0 2px rgba(22,163,74,.1)}
.light .code-ta{background:transparent;color:var(--txt);font-family:'IBM Plex Mono',monospace;font-size:13px;
  line-height:1.7;padding:14px 14px 14px 52px;border:none;outline:none;resize:none;width:100%;tab-size:2}
.light .line-nums{position:absolute;left:0;top:0;width:40px;text-align:right;
  padding:14px 8px 14px 0;font-family:'IBM Plex Mono',monospace;font-size:13px;line-height:1.7;
  color:var(--txt3);pointer-events:none;user-select:none;background:rgba(22,163,74,.04);border-right:1.5px solid var(--bdr)}
.light .tpl-card{border:1.5px solid var(--bdr);border-radius:7px;padding:9px 11px;cursor:pointer;transition:all .13s;background:transparent}
.light .tpl-card:hover{border-color:rgba(22,163,74,.35);background:rgba(22,163,74,.04)}
.light .preview-bar{background:var(--sur);border-bottom:1.5px solid var(--bdr);padding:6px 12px;display:flex;align-items:center;gap:8px}
.light .url-bar{background:#edf3ed;border:1.5px solid var(--bdr);border-radius:5px;
  color:var(--txt3);font-family:'IBM Plex Mono',monospace;font-size:11px;padding:4px 10px;flex:1}
.light .status-ok{color:var(--ok);font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.1em}
.light .status-err{color:var(--err);font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.1em}
.light .console-line{font-family:'IBM Plex Mono',monospace;font-size:11.5px;line-height:1.65;padding:2px 0;border-bottom:1.5px solid rgba(22,163,74,.06)}
.light .console-line.error{color:var(--err)}
.light .console-line.warn{color:var(--warn)}
.light .console-line.log{color:var(--txt2)}
.light .console-line.info{color:var(--acc)}
.light .step-n{width:22px;height:22px;border-radius:50%;border:1.5px solid rgba(22,163,74,.3);background:rgba(22,163,74,.09);display:flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:9.5px;font-weight:700;color:var(--acc);flex-shrink:0}
.light .step-ln{background:rgba(22,163,74,.12);width:1.5px}

/* SHARED */
.topbar{height:38px;position:sticky;top:0;z-index:300;display:flex;align-items:center;padding:0 12px;gap:7px}
.dark .topbar{background:rgba(2,12,6,.98);border-bottom:1px solid var(--bdr)}
.light .topbar{background:rgba(255,255,255,.98);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 8px rgba(22,163,74,.07)}
.split-pane{display:flex;height:calc(100vh - 74px);overflow:hidden}
.editor-col{display:flex;flex-direction:column;overflow:hidden;flex-shrink:0}
.preview-col{display:flex;flex-direction:column;flex:1;overflow:hidden}
.dark .divider{width:4px;background:var(--bdr);cursor:col-resize;flex-shrink:0;transition:background .15s;position:relative}
.dark .divider:hover,.dark .divider.dragging{background:rgba(52,211,153,.3)}
.light .divider{width:4px;background:var(--bdr);cursor:col-resize;flex-shrink:0;transition:background .15s}
.light .divider:hover,.light .divider.dragging{background:rgba(22,163,74,.3)}
.prose p{font-size:13px;line-height:1.78;margin-bottom:12px;color:var(--txt2)}
.prose h3{font-size:14.5px;font-weight:700;margin:20px 0 8px;color:var(--txt);font-family:'IBM Plex Mono',monospace;letter-spacing:.02em}
.prose ul,.prose ol{padding-left:20px;margin-bottom:12px}
.prose li{font-size:13px;line-height:1.72;margin-bottom:4px;color:var(--txt2)}
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
  code:   s=><Svg s={s} d={["M16 18l6-6-6-6","M8 6l-6 6 6 6"]}/>,
  eye:    s=><Svg s={s} d={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"]}/>,
  play:   s=><Svg s={s} d="M5 3l14 9-14 9V3z" sw={1.5}/>,
  copy:   s=><Svg s={s} d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2","M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"]}/>,
  dl:     s=><Svg s={s} d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]}/>,
  trash:  s=><Svg s={s} d={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6","M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]}/>,
  ok:     s=><Svg s={s} d="M20 6 9 17l-5-5"/>,
  info:   s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 16v-4M12 8h.01"]}/>,
  layout: s=><Svg s={s} d={["M3 3h18v18H3z","M3 9h18","M9 21V9"]}/>,
  refresh:s=><Svg s={s} d={["M23 4v6h-6","M1 20v-6h6","M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"]}/>,
  expand: s=><Svg s={s} d={["M15 3h6v6","M9 21H3v-6","M21 3l-7 7","M3 21l7-7"]}/>,
  cols:   s=><Svg s={s} d={["M12 3h9v18h-9","M3 3h6v18H3"]}/>,
  mono:   s=><Svg s={s} d={["M4 6h16M4 12h16M4 18h7"]}/>,
  wrap:   s=><Svg s={s} d={["M3 6h18","M3 12h15a3 3 0 1 1 0 6h-4","M14 15l-2 3 2 3"]}/>,
  terminal:s=><Svg s={s} d={["M4 17l6-6-6-6","M12 19h8"]}/>,
  split:  s=><Svg s={s} d={["M21 3H3v18h18V3z","M12 3v18"]}/>,
};

/* ═══ HTML TEMPLATES ═══ */
const TEMPLATES = [
  {
    id:'blank', emoji:'📄', label:'Blank',
    html:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
  <style>
    body { font-family: sans-serif; margin: 2rem; }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Start editing to see changes live.</p>
</body>
</html>`
  },
  {
    id:'card', emoji:'🃏', label:'Card UI',
    html:`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Card</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  .card {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    max-width: 340px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    text-align: center;
  }
  .avatar {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    margin: 0 auto 1rem;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
  }
  h2 { font-size: 1.4rem; margin-bottom: 0.4rem; color: #1a1a2e; }
  p  { color: #666; font-size: 0.9rem; margin-bottom: 1.5rem; }
  .btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white; border: none; border-radius: 8px;
    padding: 0.7rem 2rem; font-size: 0.9rem; cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(102,126,234,0.4); }
</style>
</head>
<body>
  <div class="card">
    <div class="avatar">👤</div>
    <h2>Alex Johnson</h2>
    <p>Full-Stack Developer · Open to work</p>
    <button class="btn">Connect</button>
  </div>
</body>
</html>`
  },
  {
    id:'animation', emoji:'✨', label:'CSS Animation',
    html:`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Animation</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    min-height: 100vh;
    background: #0a0a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-family: sans-serif;
  }
  .orb {
    width: 200px; height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #a78bfa, #7c3aed, #312e81);
    box-shadow: 0 0 80px rgba(124,58,237,0.6), 0 0 160px rgba(124,58,237,0.3);
    animation: float 3s ease-in-out infinite, pulse 2s ease-in-out infinite;
    position: relative;
  }
  .orb::after {
    content: '';
    position: absolute;
    inset: 20px;
    border-radius: 50%;
    background: radial-gradient(circle at 60% 40%, rgba(255,255,255,0.3), transparent 60%);
  }
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50%       { transform: translateY(-24px) rotate(8deg); }
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 80px rgba(124,58,237,0.6); }
    50%       { box-shadow: 0 0 120px rgba(124,58,237,0.9), 0 0 200px rgba(124,58,237,0.4); }
  }
  p { color: rgba(255,255,255,0.5); margin-top: 40px; font-size: 0.85rem; letter-spacing: 0.15em; text-transform: uppercase; }
  .center { display: flex; flex-direction: column; align-items: center; }
</style>
</head>
<body>
  <div class="center">
    <div class="orb"></div>
    <p>CSS Only · No JS</p>
  </div>
</body>
</html>`
  },
  {
    id:'table', emoji:'📊', label:'Data Table',
    html:`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Table</title>
<style>
  body { font-family: -apple-system, sans-serif; background: #f8fafc; padding: 2rem; color: #1e293b; }
  h2 { font-size: 1.3rem; margin-bottom: 1rem; }
  .wrap { background: white; border-radius: 12px; box-shadow: 0 2px 16px rgba(0,0,0,0.08); overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  thead { background: #1e293b; color: white; }
  th { padding: 0.9rem 1.2rem; text-align: left; font-size: 0.8rem; letter-spacing: 0.07em; text-transform: uppercase; }
  td { padding: 0.85rem 1.2rem; font-size: 0.9rem; border-bottom: 1px solid #f1f5f9; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #f8fafc; }
  .badge { padding: 2px 10px; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
  .active  { background: #dcfce7; color: #16a34a; }
  .pending { background: #fef9c3; color: #ca8a04; }
  .inactive{ background: #fee2e2; color: #dc2626; }
</style>
</head>
<body>
  <h2>User Dashboard</h2>
  <div class="wrap">
    <table>
      <thead><tr><th>Name</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead>
      <tbody>
        <tr><td>Alice Chen</td><td>Admin</td><td><span class="badge active">Active</span></td><td>Jan 2024</td></tr>
        <tr><td>Bob Smith</td><td>Editor</td><td><span class="badge pending">Pending</span></td><td>Mar 2024</td></tr>
        <tr><td>Carol Wu</td><td>Viewer</td><td><span class="badge active">Active</span></td><td>Feb 2024</td></tr>
        <tr><td>Dan Lee</td><td>Editor</td><td><span class="badge inactive">Inactive</span></td><td>Nov 2023</td></tr>
      </tbody>
    </table>
  </div>
</body>
</html>`
  },
  {
    id:'js', emoji:'⚙️', label:'JS Counter',
    html:`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Counter</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #020617; font-family: 'Courier New', monospace;
  }
  .counter {
    text-align: center;
    border: 1px solid rgba(34,211,153,0.3);
    border-radius: 12px;
    padding: 3rem;
    background: rgba(34,211,153,0.04);
    box-shadow: 0 0 60px rgba(34,211,153,0.1);
  }
  #display {
    font-size: 5rem; font-weight: 700;
    color: #34d399;
    text-shadow: 0 0 30px rgba(52,211,153,0.5);
    transition: transform 0.1s;
    line-height: 1;
    margin-bottom: 2rem;
    min-width: 180px; display: block;
  }
  .buttons { display: flex; gap: 1rem; justify-content: center; }
  button {
    padding: 0.7rem 1.6rem;
    font-family: inherit; font-size: 1.2rem; font-weight: 700;
    border-radius: 8px; cursor: pointer; border: none;
    transition: all 0.15s;
  }
  #dec { background: rgba(248,113,113,0.12); color: #f87171; border: 1px solid rgba(248,113,113,0.3); }
  #inc { background: rgba(52,211,153,0.12); color: #34d399; border: 1px solid rgba(52,211,153,0.3); }
  #reset { background: rgba(251,191,36,0.08); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); font-size: 0.85rem; }
  button:hover { transform: scale(1.08); }
  button:active { transform: scale(0.95); }
</style>
</head>
<body>
<div class="counter">
  <span id="display">0</span>
  <div class="buttons">
    <button id="dec">−</button>
    <button id="reset">RST</button>
    <button id="inc">+</button>
  </div>
</div>
<script>
  let n = 0;
  const el = document.getElementById('display');
  const update = () => {
    el.style.transform = 'scale(1.15)';
    el.textContent = n;
    el.style.color = n > 0 ? '#34d399' : n < 0 ? '#f87171' : '#fbbf24';
    setTimeout(() => el.style.transform = 'scale(1)', 100);
  };
  document.getElementById('inc').onclick = () => { n++; update(); };
  document.getElementById('dec').onclick = () => { n--; update(); };
  document.getElementById('reset').onclick = () => { n = 0; update(); };
</script>
</body>
</html>`
  },
  {
    id:'form', emoji:'📝', label:'Form UI',
    html:`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Form</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f1f5f9; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: -apple-system, sans-serif; }
  .form-card { background: white; border-radius: 14px; padding: 2rem; width: 100%; max-width: 380px; box-shadow: 0 4px 24px rgba(0,0,0,0.1); }
  h2 { font-size: 1.3rem; margin-bottom: 1.5rem; color: #1e293b; }
  .field { margin-bottom: 1rem; }
  label { display: block; font-size: 0.82rem; font-weight: 600; color: #475569; margin-bottom: 0.4rem; letter-spacing: 0.03em; }
  input, textarea, select {
    width: 100%; padding: 0.65rem 0.9rem;
    border: 1.5px solid #e2e8f0; border-radius: 8px;
    font-size: 0.9rem; font-family: inherit;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  }
  input:focus, textarea:focus, select:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
  }
  textarea { resize: vertical; min-height: 80px; }
  .submit {
    width: 100%; padding: 0.8rem;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white; border: none; border-radius: 8px;
    font-size: 0.95rem; font-weight: 600; cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    margin-top: 0.5rem;
  }
  .submit:hover { opacity: 0.9; transform: translateY(-1px); }
</style>
</head>
<body>
<div class="form-card">
  <h2>Contact Us</h2>
  <div class="field"><label>Full Name</label><input type="text" placeholder="Jane Smith"></div>
  <div class="field"><label>Email</label><input type="email" placeholder="jane@example.com"></div>
  <div class="field">
    <label>Topic</label>
    <select><option>General Enquiry</option><option>Support</option><option>Feedback</option></select>
  </div>
  <div class="field"><label>Message</label><textarea placeholder="Write your message here…"></textarea></div>
  <button class="submit">Send Message</button>
</div>
</body>
</html>`
  },
];

/* ═══ STEPS ═══ */
function Steps({items}){
  return (<div>{items.map((s,i)=>(
    <div key={i} style={{display:'flex',gap:9,marginBottom:i<items.length-1?14:0}}>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
        <div className="step-n">{i+1}</div>
        {i<items.length-1&&<div className="step-ln" style={{flex:1,marginTop:4,minHeight:10}}/>}
      </div>
      <div style={{flex:1,paddingTop:1}}>
        <div style={{fontSize:12.5,fontWeight:700,color:'var(--txt)',marginBottom:2,fontFamily:"'IBM Plex Mono',monospace"}}>{s.t}</div>
        <div style={{fontSize:12.5,color:'var(--txt2)',lineHeight:1.7}}>{s.d}</div>
      </div>
    </div>
  ))}</div>);
}

/* ═══ LINE NUMBERS ═══ */
function LineNums({ code }) {
  const lines = code.split('\n').length;
  return (
    <div className="line-nums">
      {Array.from({length:lines},(_,i)=>(
        <div key={i} style={{height:'1.7em',lineHeight:'1.7em'}}>{i+1}</div>
      ))}
    </div>
  );
}

/* ═══ CONSOLE OUTPUT CAPTURE ═══ */
function buildSandboxHtml(html) {
  // Inject console intercept
  const intercept = `
<script>
(function(){
  const orig = {log:console.log,warn:console.warn,error:console.error,info:console.info};
  ['log','warn','error','info'].forEach(t=>{
    console[t] = function(...args){
      orig[t].apply(console,args);
      window.parent.postMessage({type:'console',level:t,msg:args.map(a=>{
        try{return typeof a==='object'?JSON.stringify(a,null,2):String(a)}catch(e){return String(a)}
      }).join(' ')},'*');
    };
  });
  window.onerror = (msg,src,line,col)=>{
    window.parent.postMessage({type:'console',level:'error',msg:msg+' (line '+line+')'},'*');
  };
})();
<\/script>`;

  // Insert intercept before </head> or at start
  if (html.includes('</head>')) return html.replace('</head>', intercept+'</head>');
  if (html.includes('<body>')) return html.replace('<body>', intercept+'<body>');
  return intercept + html;
}

/* ════════════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════════════ */
export default function HtmlPreviewer() {
  const [mode, setMode] = useState('dark');
  const dark = mode === 'dark';

  const [html, setHtml] = useState(TEMPLATES[0].html);
  const [autoRun, setAutoRun] = useState(true);
  const [liveHtml, setLiveHtml] = useState(TEMPLATES[0].html);
  const [consoleLines, setConsoleLines] = useState([]);
  const [editorTab, setEditorTab] = useState('editor'); // editor | templates | guide | learn
  const [viewMode, setViewMode] = useState('split'); // split | editor | preview
  const [editorWidth, setEditorWidth] = useState(48); // % of split
  const [wordWrap, setWordWrap] = useState(false);
  const [editorFocused, setEditorFocused] = useState(false);
  const [copyOk, setCopyOk] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const [explainResult, setExplainResult] = useState(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [explainError, setExplainError] = useState('');
  const [explainMode, setExplainMode] = useState('full'); // full | structure | css | js | beginner

  const iframeRef = useRef(null);
  const debounceRef = useRef(null);
  const dividerRef = useRef(null);
  const draggingRef = useRef(false);
  const containerRef = useRef(null);
  const taRef = useRef(null);

  /* Auto-run on change */
  useEffect(() => {
    if (!autoRun) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setLiveHtml(html), 600);
    return () => clearTimeout(debounceRef.current);
  }, [html, autoRun]);

  /* Console message listener */
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'console') {
        setConsoleLines(prev => [...prev.slice(-99), {
          id: Date.now() + Math.random(),
          level: e.data.level,
          msg: e.data.msg,
          time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'})
        }]);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  /* Divider drag */
  const startDrag = useCallback((e) => {
    e.preventDefault();
    draggingRef.current = true;
    dividerRef.current?.classList.add('dragging');
    const onMove = (ev) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (ev.clientX ?? ev.touches?.[0]?.clientX) - rect.left;
      const pct = Math.min(Math.max((x / rect.width) * 100, 20), 80);
      setEditorWidth(pct);
    };
    const onUp = () => {
      draggingRef.current = false;
      dividerRef.current?.classList.remove('dragging');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, []);

  /* Tab key in editor */
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const s = e.target.selectionStart, en = e.target.selectionEnd;
      const newVal = html.substring(0, s) + '  ' + html.substring(en);
      setHtml(newVal);
      setTimeout(() => { if (taRef.current) { taRef.current.selectionStart = taRef.current.selectionEnd = s + 2; } }, 0);
    }
  };

  const runNow = () => { setLiveHtml(html); setIframeKey(k=>k+1); setConsoleLines([]); };
  const copyCode = () => { try { navigator.clipboard.writeText(html); } catch(e) {} setCopyOk(true); setTimeout(()=>setCopyOk(false),1400); };
  const downloadHtml = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], {type:'text/html'}));
    a.download = 'index.html'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };
  const loadTemplate = (tpl) => { setHtml(tpl.html); setLiveHtml(tpl.html); setIframeKey(k=>k+1); setConsoleLines([]); setEditorTab('editor'); };

  /* ── AI Code Explainer ── */
  const explainCode = async () => {
    setExplainLoading(true);
    setExplainError('');
    setExplainResult(null);
    const prompts = {
      full:     `You are an expert web developer and teacher. Analyse the following HTML code and explain EXACTLY how it works in thorough detail. Structure your response with these sections using "##" headings:\n## Overview\n## HTML Structure\n## CSS Styles & Visual Design\n## JavaScript Logic (if any)\n## How It All Connects\n## Key Techniques Used\n## Potential Improvements\n\nBe specific, reference actual class names, IDs, and properties from the code. Format code snippets in backtick pairs.`,
      structure:`You are an expert web developer. Focus ONLY on the HTML structure and DOM hierarchy of the code below. Explain every element, its semantic role, nesting logic, and how the structure creates the layout. Use "##" headings. Reference exact tags and attributes.`,
      css:      `You are a CSS expert. Analyse ONLY the CSS/styles in the code below. Explain every rule, selector, property, value, and how they combine to create the visual result. Cover layout techniques (flexbox/grid/positioning), animations, responsive design, and visual effects. Use "##" headings.`,
      js:       `You are a JavaScript expert. Analyse ONLY the JavaScript in the code below. Explain the logic flow, event listeners, DOM manipulation, data structures, algorithms, and any APIs used. If there's no JS, say so and explain what JS could be added. Use "##" headings.`,
      beginner: `You are a patient coding teacher explaining to a complete beginner. Explain the code below in very simple language — no jargon without explanation. Use analogies. Explain what each part does and WHY it's written that way. Use "##" headings for each big concept. Make it encouraging and clear.`,
    };
    const systemPrompt = prompts[explainMode] || prompts.full;
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: 'user', content: `Here is the HTML code to explain:\n\n\`\`\`html\n${html}\n\`\`\`` }],
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.map(b => b.text || '').join('') || '';
      setExplainResult(text);
    } catch(e) {
      setExplainError(e.message || 'Failed to connect to AI. Please try again.');
    }
    setExplainLoading(false);
  };

  /* ── Render markdown-like explain output ── */
  const renderExplain = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const out = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith('## ')) {
        out.push(
          <div key={i} style={{fontSize:13.5,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",
            color:'var(--acc)',marginTop:i===0?0:18,marginBottom:6,
            paddingBottom:5,borderBottom:dark?'1px solid rgba(52,211,153,.15)':'1.5px solid rgba(22,163,74,.15)',
            letterSpacing:'.02em'}}>
            {line.replace('## ','')}
          </div>
        );
      } else if (line.startsWith('### ')) {
        out.push(<div key={i} style={{fontSize:12.5,fontWeight:700,color:'var(--txt)',marginTop:10,marginBottom:4,fontFamily:"'IBM Plex Mono',monospace"}}>{line.replace('### ','')}</div>);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        out.push(
          <div key={i} style={{display:'flex',gap:8,marginBottom:4,paddingLeft:4}}>
            <span style={{color:'var(--acc)',flexShrink:0,marginTop:2,fontSize:11}}>▸</span>
            <span style={{fontSize:13,color:'var(--txt2)',lineHeight:1.72}}>{renderInline(line.slice(2))}</span>
          </div>
        );
      } else if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^(\d+)\./)[1];
        out.push(
          <div key={i} style={{display:'flex',gap:9,marginBottom:4,paddingLeft:4}}>
            <span style={{color:'var(--acc)',flexShrink:0,fontFamily:"'IBM Plex Mono',monospace",fontSize:11,width:16,textAlign:'right'}}>{num}.</span>
            <span style={{fontSize:13,color:'var(--txt2)',lineHeight:1.72}}>{renderInline(line.replace(/^\d+\.\s/,''))}</span>
          </div>
        );
      } else if (line.startsWith('```')) {
        // collect code block
        const lang = line.slice(3).trim();
        const codeLines = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++; }
        out.push(
          <div key={i} style={{margin:'8px 0',borderRadius:dark?3:6,
            background:dark?'rgba(0,0,0,.65)':'#edf3ed',
            border:dark?'1px solid rgba(52,211,153,.15)':'1.5px solid rgba(22,163,74,.18)',
            overflow:'auto'}}>
            {lang&&<div style={{padding:'4px 12px 0',fontSize:9,fontFamily:"'IBM Plex Mono',monospace",color:'var(--txt3)',letterSpacing:'.1em',textTransform:'uppercase'}}>{lang}</div>}
            <pre style={{padding:'10px 12px',fontFamily:"'IBM Plex Mono',monospace",fontSize:12,
              color:dark?'#a7f3d0':'#166534',lineHeight:1.65,margin:0,overflowX:'auto'}}>
              {codeLines.join('\n')}
            </pre>
          </div>
        );
      } else if (line.trim() === '') {
        if (out.length > 0) out.push(<div key={i} style={{height:6}}/>);
      } else {
        out.push(<p key={i} style={{fontSize:13,color:'var(--txt2)',lineHeight:1.78,marginBottom:4}}>{renderInline(line)}</p>);
      }
      i++;
    }
    return out;
  };

  const renderInline = (text) => {
    // render `code` inline
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((p, i) => p.startsWith('`') && p.endsWith('`')
      ? <code key={i} style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11.5,
          background:dark?'rgba(52,211,153,.1)':'rgba(22,163,74,.1)',
          color:'var(--acc)',padding:'1px 5px',borderRadius:3}}>{p.slice(1,-1)}</code>
      : p
    );
  };

  const lineCount = html.split('\n').length;
  const charCount = html.length;
  const hasError = consoleLines.some(l=>l.level==='error');

  const sandboxedHtml = buildSandboxHtml(liveHtml);
  const iframeSrc = `data:text/html;charset=utf-8,${encodeURIComponent(sandboxedHtml)}`;

  const EDITOR_TABS = [
    {id:'editor',    label:'< /> Editor'},
    {id:'templates', label:'⊞ Templates'},
    {id:'explain',   label:'⚡ Explain'},
    {id:'guide',     label:'? Guide'},
    {id:'learn',     label:'⊛ Learn'},
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className={dark?'dark':'light'} style={{height:'100vh',overflow:'hidden',display:'flex',flexDirection:'column'}}>
        {dark&&<div className="scanline"/>}

        {/* TOPBAR */}
        <div className="topbar" style={{flexShrink:0}}>
          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <div style={{width:24,height:24,borderRadius:dark?2:6,
              background:dark?'transparent':'linear-gradient(135deg,#16a34a,#15803d)',
              border:dark?'1px solid rgba(52,211,153,.45)':'none',
              display:'flex',alignItems:'center',justifyContent:'center',
              color:dark?'var(--acc)':'#fff',
              boxShadow:dark?'0 0 10px rgba(52,211,153,.22)':'0 2px 8px rgba(22,163,74,.4)'}}>
              {I.code(12)}
            </div>
            <span style={{fontSize:13,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",
              color:'var(--txt)',letterSpacing:'.03em'}}>
              HTML<span style={{color:'var(--acc)'}}>.preview</span>
            </span>
          </div>
          <div style={{flex:1}}/>

          {/* Status */}
          <div style={{display:'flex',alignItems:'center',gap:5}}>
            {hasError?(
              <span className="status-err">● {consoleLines.filter(l=>l.level==='error').length} error{consoleLines.filter(l=>l.level==='error').length>1?'s':''}</span>
            ):(
              <span className="status-ok">● OK</span>
            )}
          </div>

          {/* View mode buttons */}
          <div style={{display:'flex',gap:4,padding:'2px',
            background:dark?'rgba(0,0,0,.35)':'rgba(22,163,74,.06)',
            borderRadius:dark?3:6,border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>
            {[
              {id:'editor',  icon:I.code(11),  label:'Code'},
              {id:'split',   icon:I.split(11), label:'Split'},
              {id:'preview', icon:I.eye(11),   label:'Preview'},
            ].map(v=>(
              <button key={v.id} onClick={()=>setViewMode(v.id)}
                className={`btn-ghost ${viewMode===v.id?'on':''}`}
                style={{padding:'3px 8px',gap:4,fontSize:9.5}}>
                {v.icon}{v.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <button className="btn-ghost" onClick={()=>setAutoRun(p=>!p)}
            style={{gap:5,fontSize:9.5,borderColor:autoRun?(dark?'rgba(52,211,153,.3)':'rgba(22,163,74,.3)'):'',
              color:autoRun?'var(--acc)':'var(--txt3)'}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:autoRun?'var(--acc)':'var(--txt3)',transition:'background .15s',animation:autoRun?(dark?'green-glow 2s ease-in-out infinite':'none'):'none'}}/>
            Auto
          </button>
          {!autoRun&&<button className="btn-primary" onClick={runNow} style={{padding:'5px 12px'}}>{I.play(10)} Run</button>}
          <button className="btn-ghost" onClick={()=>setIframeKey(k=>k+1)}>{I.refresh(11)}</button>
          <button className="btn-ghost" onClick={copyCode}>{copyOk?I.ok(10):I.copy(10)}</button>
          <button className="btn-ghost" onClick={downloadHtml}>{I.dl(10)}</button>

          {/* Theme toggle */}
          <button onClick={()=>setMode(dark?'light':'dark')} style={{
            display:'flex',alignItems:'center',gap:5,padding:'4px 10px',
            border:dark?'1px solid rgba(52,211,153,.18)':'1.5px solid var(--bdr)',
            borderRadius:dark?2:6,background:dark?'rgba(52,211,153,.03)':'var(--sur)',
            cursor:'pointer',transition:'all .14s'}}>
            {dark?(
              <><div style={{width:26,height:14,borderRadius:7,background:'var(--acc)',position:'relative',boxShadow:'0 0 7px rgba(52,211,153,.5)'}}>
                <div style={{position:'absolute',top:2,right:2,width:10,height:10,borderRadius:'50%',background:'#020c06'}}/>
              </div><span style={{fontSize:9,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",color:'rgba(52,211,153,.6)',letterSpacing:'.1em'}}>GRN</span></>
            ):(
              <><span style={{fontSize:9.5,color:'var(--txt3)',fontWeight:600,fontFamily:"'IBM Plex Mono',monospace"}}>LGT</span>
              <div style={{width:26,height:14,borderRadius:7,background:'#c8d8c8',position:'relative'}}>
                <div style={{position:'absolute',top:2,left:2,width:10,height:10,borderRadius:'50%',background:'#8aab8a'}}/>
              </div></>
            )}
          </button>
        </div>

        {/* EDITOR TABS */}
        <div className="tab-bar" style={{display:'flex',flexShrink:0}}>
          {EDITOR_TABS.map(t=>(
            <button key={t.id} className={`tab ${editorTab===t.id?'on':''}`} onClick={()=>setEditorTab(t.id)}>{t.label}</button>
          ))}
          <div style={{flex:1}}/>
          {editorTab==='editor'&&(
            <div style={{display:'flex',alignItems:'center',gap:6,paddingRight:10}}>
              <button className={`btn-ghost ${wordWrap?'on':''}`} onClick={()=>setWordWrap(p=>!p)} style={{padding:'3px 8px',height:28,fontSize:9}}>
                {I.wrap(10)} Wrap
              </button>
              <span style={{fontSize:9,fontFamily:"'IBM Plex Mono',monospace",color:'var(--txt3)'}}>
                {lineCount}L · {charCount}C
              </span>
            </div>
          )}
        </div>

        {/* MAIN BODY */}
        <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>

          {/* ── EDITOR/TEMPLATES/GUIDE/LEARN (full when not split+editor) ── */}
          {editorTab !== 'editor' ? (
            /* Non-editor tabs: show content panel on left + preview on right */
            <div className="split-pane">
              <div style={{width:'42%',flexShrink:0,overflowY:'auto',padding:'12px 13px',display:'flex',flexDirection:'column',gap:10,
                borderRight:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                background:dark?'var(--sur)':'var(--s2)'}}>

                <AnimatePresence mode="wait">
                  {editorTab==='templates'&&(
                    <motion.div key="tpl" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                      <div className="lbl" style={{marginBottom:9}}>⊞ Templates — click to load</div>
                      <div style={{display:'flex',flexDirection:'column',gap:7}}>
                        {TEMPLATES.map(t=>(
                          <button key={t.id} className="tpl-card" onClick={()=>loadTemplate(t)}
                            style={{textAlign:'left',display:'block',width:'100%'}}>
                            <div style={{fontSize:12.5,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",color:'var(--txt)',marginBottom:3}}>
                              {t.emoji} {t.label}
                            </div>
                            <div style={{fontSize:11,color:'var(--txt3)',fontFamily:"'IBM Plex Mono',monospace"}}>
                              {t.html.split('\n').length} lines
                            </div>
                          </button>
                        ))}
                      </div>
                      
                    </motion.div>
                  )}

                  {editorTab==='explain'&&(
                    <motion.div key="explain" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                      style={{display:'flex',flexDirection:'column',gap:10}}>

                      {/* Header */}
                      <div>
                        <div style={{fontSize:14,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",color:'var(--txt)',marginBottom:3}}>
                          ⚡ AI Code Explainer
                        </div>
                        <div style={{fontSize:11.5,color:'var(--txt3)',lineHeight:1.6}}>
                          Powered by Claude · analyses the current editor code
                        </div>
                      </div>

                      {/* Mode selector */}
                      <div>
                        <div className="lbl" style={{marginBottom:6}}>Explanation Mode</div>
                        <div style={{display:'flex',flexDirection:'column',gap:5}}>
                          {[
                            {id:'full',      emoji:'🔍', label:'Full Breakdown',    desc:'HTML + CSS + JS + how it all connects'},
                            {id:'structure', emoji:'🏗️', label:'HTML Structure',    desc:'DOM hierarchy, elements & semantics'},
                            {id:'css',       emoji:'🎨', label:'CSS Deep Dive',     desc:'Every style rule & visual technique'},
                            {id:'js',        emoji:'⚙️', label:'JavaScript Logic',  desc:'Event listeners, logic & APIs'},
                            {id:'beginner',  emoji:'🌱', label:'Beginner Friendly', desc:'Simple language, no jargon'},
                          ].map(m=>(
                            <button key={m.id} onClick={()=>setExplainMode(m.id)}
                              className={`btn-ghost ${explainMode===m.id?'on':''}`}
                              style={{justifyContent:'flex-start',padding:'7px 10px',height:'auto',flexDirection:'column',alignItems:'flex-start',gap:2,
                                borderColor:explainMode===m.id?(dark?'rgba(52,211,153,.4)':'rgba(22,163,74,.4)'):'',
                                background:explainMode===m.id?(dark?'rgba(52,211,153,.07)':'rgba(22,163,74,.07)'):''
                              }}>
                              <div style={{display:'flex',alignItems:'center',gap:6,width:'100%'}}>
                                <span style={{fontSize:13}}>{m.emoji}</span>
                                <span style={{fontSize:11.5,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",color:explainMode===m.id?'var(--acc)':'var(--txt)'}}>{m.label}</span>
                                {explainMode===m.id&&<span style={{marginLeft:'auto',color:'var(--acc)'}}>{I.ok(10)}</span>}
                              </div>
                              <div style={{fontSize:10.5,color:'var(--txt3)',paddingLeft:19,textTransform:'none',letterSpacing:'normal'}}>{m.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Code preview snippet */}
                      <div style={{background:dark?'rgba(0,0,0,.5)':'#edf3ed',
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        borderRadius:dark?3:6,padding:'8px 11px'}}>
                        <div className="lbl" style={{marginBottom:5}}>Code to explain ({lineCount} lines)</div>
                        <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:'var(--txt3)',
                          lineHeight:1.55,maxHeight:60,overflow:'hidden',position:'relative'}}>
                          {html.split('\n').slice(0,5).join('\n')}
                          <div style={{position:'absolute',bottom:0,left:0,right:0,height:24,
                            background:dark?'linear-gradient(transparent,rgba(0,0,0,.5))':'linear-gradient(transparent,#edf3ed)'}}/>
                        </div>
                      </div>

                      {/* Explain button */}
                      <button className="btn-primary" onClick={explainCode} disabled={explainLoading}
                        style={{width:'100%',justifyContent:'center',padding:'10px',fontSize:11,
                          animation:!explainLoading?(dark?'green-glow 2.5s ease-in-out infinite':'none'):'none'}}>
                        {explainLoading?(
                          <><span style={{display:'inline-block',width:12,height:12,border:dark?'2px solid rgba(52,211,153,.3)':'2px solid rgba(22,163,74,.3)',borderTop:`2px solid var(--acc)`,borderRadius:'50%',animation:'spin .7s linear infinite'}}/>Analysing code…</>
                        ):(
                          <>⚡ Explain This Code</>
                        )}
                      </button>

                      {explainError&&(
                        <div style={{padding:'9px 12px',border:dark?'1px solid rgba(248,113,113,.3)':'1.5px solid rgba(220,38,38,.25)',
                          borderRadius:dark?3:6,background:dark?'rgba(248,113,113,.07)':'rgba(220,38,38,.05)',
                          fontSize:12,color:'var(--err)',display:'flex',gap:7,alignItems:'flex-start'}}>
                          {I.info(13)}{explainError}
                        </div>
                      )}

                    </motion.div>
                  )}

                  {editorTab==='guide'&&(
                    <motion.div key="guide" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                      style={{display:'flex',flexDirection:'column',gap:9}}>
                      <div className="hint" style={{display:'flex',gap:7,alignItems:'flex-start',fontSize:12}}>
                        {I.info(13)}<span>HTML.preview renders your code live in a sandboxed iframe. JavaScript runs safely — console output appears in the preview bar.</span>
                      </div>
                      <Steps items={[
                        {t:'Write or paste HTML', d:'Type in the editor or paste any HTML document. Full HTML pages work, as do code snippets.'},
                        {t:'Auto-run or manual', d:'With Auto ON (green dot), changes preview instantly. Turn Auto OFF and click Run to control when the preview updates.'},
                        {t:'Load a template', d:'The Templates tab has 6 ready-to-use starting points: blank, card, animation, table, counter, and form.'},
                        {t:'View modes', d:'Switch between Code-only, Split (side-by-side), and Preview-only using the buttons in the topbar.'},
                        {t:'Drag to resize', d:'In Split mode, drag the divider between editor and preview to change the panel sizes.'},
                        {t:'Console output', d:'JavaScript console.log / warn / error output appears below the preview. Errors are flagged in the topbar status.'},
                        {t:'Download', d:'The ↓ button in the topbar downloads your code as index.html — ready to open in any browser.'},
                      ]}/>
                      
                    </motion.div>
                  )}

                  {editorTab==='learn'&&(
                    <motion.div key="learn" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                      <div style={{fontSize:16,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",color:'var(--txt)',marginBottom:3}}>
                        HTML Previewer: How It Works
                      </div>
                      <p style={{fontSize:11.5,color:'var(--txt3)',fontFamily:"'IBM Plex Mono',monospace",marginBottom:14}}>
                        Sandboxed iframes · CSP · Data URIs · Console intercept
                      </p>
                      <div className="prose">
                        <p>HTML.preview uses a <strong>sandboxed iframe</strong> to render your code safely. The sandbox prevents the preview from accessing parent page cookies, localStorage, or executing privileged APIs.</p>
                        <h3>// Sandbox & Security</h3>
                        <p>The iframe uses <strong>data: URIs</strong> — your HTML is base64-encoded and loaded as a self-contained document. No server requests are made. The <code style={{fontFamily:'IBM Plex Mono',fontSize:12,color:'var(--acc)'}}>sandbox</code> attribute allows scripts and same-origin access while blocking popups, form submission, and top-level navigation.</p>
                        <h3>// Console Intercept</h3>
                        <p>Before rendering, a small script is injected that overrides <strong>console.log / warn / error / info</strong> and window.onerror. Messages are sent to the parent frame via <code style={{fontFamily:'IBM Plex Mono',fontSize:12,color:'var(--acc)'}}>postMessage</code>, appearing in the console panel below the preview.</p>
                        <h3>// Auto-Run Debounce</h3>
                        <p>When Auto is enabled, changes are debounced by 600ms before updating the preview. This prevents re-rendering on every keystroke, keeping the editor responsive for large documents.</p>
                        <h3>// Tab Key Handling</h3>
                        <p>The editor overrides the default Tab behaviour to insert 2 spaces instead of moving focus, making it behave like a real code editor without external dependencies.</p>
                        {[
                          {q:'Can I use external CDN libraries?', a:'Yes — any <script src="..."> tag pointing to a CDN (jsDelivr, cdnjs, unpkg) will load and execute normally inside the iframe, as long as the CDN allows iframe embedding.'},
                          {q:'Why doesn\'t fetch() work in the preview?', a:'Data URI iframes have null origin, so cross-origin fetch() requests may be blocked by CORS policy. Use CDN-hosted scripts instead, or inline your JavaScript.'},
                          {q:'Is my code sent to a server?', a:'No. Everything happens locally in your browser. The code never leaves your machine.'},
                          {q:'What HTML features are supported?', a:'Full HTML5, CSS3 (including animations, grid, flexbox, custom properties), and all modern JavaScript (ES2022+). WebGL and Canvas also work.'},
                        ].map(({q,a},i)=>(
                          <div key={i} style={{padding:'10px 12px',marginBottom:8,
                            background:dark?'rgba(0,0,0,.4)':'#edf3ed',
                            border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                            borderRadius:dark?2:7}}>
                            <div style={{fontSize:12.5,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",color:'var(--txt)',marginBottom:4}}>{q}</div>
                            <div style={{fontSize:12.5,color:'var(--txt2)',lineHeight:1.7}}>{a}</div>
                          </div>
                        ))}
                      </div>
                      
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right panel: explain output OR live preview */}
              <div className="preview-col">
                {editorTab === 'explain' ? (
                  /* ── EXPLAIN OUTPUT ── */
                  <div style={{flex:1,overflowY:'auto',padding:'16px 18px',display:'flex',flexDirection:'column',gap:0}}>
                    {!explainResult && !explainLoading && (
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                        height:'100%',gap:14,textAlign:'center',padding:'0 24px'}}>
                        <div style={{fontSize:52,lineHeight:1}}>⚡</div>
                        <div style={{fontSize:15,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",color:'var(--txt)'}}>
                          AI Code Explainer
                        </div>
                        <div style={{fontSize:13,color:'var(--txt3)',lineHeight:1.75,maxWidth:320}}>
                          Select an explanation mode on the left, then click <strong style={{color:'var(--acc)'}}>⚡ Explain This Code</strong> to get a detailed breakdown of how your HTML works.
                        </div>
                        <div style={{display:'flex',flexDirection:'column',gap:8,width:'100%',maxWidth:300,marginTop:6}}>
                          {[
                            '🔍 What every element does',
                            '🎨 How CSS creates the visuals',
                            '⚙️ How JavaScript logic flows',
                            '🔗 How all the parts connect',
                            '💡 Improvement suggestions',
                          ].map((t,i)=>(
                            <div key={i} style={{fontSize:12,color:'var(--txt2)',padding:'6px 12px',
                              background:dark?'rgba(52,211,153,.04)':'rgba(22,163,74,.05)',
                              border:dark?'1px solid rgba(52,211,153,.1)':'1.5px solid rgba(22,163,74,.12)',
                              borderRadius:dark?3:7,textAlign:'left'}}>
                              {t}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {explainLoading && (
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                        height:'100%',gap:16}}>
                        <div style={{width:40,height:40,border:dark?'3px solid rgba(52,211,153,.15)':'3px solid rgba(22,163,74,.15)',
                          borderTop:`3px solid var(--acc)`,borderRadius:'50%',animation:'spin .8s linear infinite'}}/>
                        <div style={{fontSize:13,color:'var(--txt2)',fontFamily:"'IBM Plex Mono',monospace"}}>
                          Analysing {lineCount} lines of code…
                        </div>
                        <div style={{fontSize:11,color:'var(--txt3)',textAlign:'center',maxWidth:260,lineHeight:1.65}}>
                          Claude is reading your HTML, CSS, and JavaScript structure carefully.
                        </div>
                      </div>
                    )}
                    {explainResult && (
                      <div>
                        {/* Result header */}
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                          marginBottom:16,paddingBottom:10,
                          borderBottom:dark?'1px solid rgba(52,211,153,.15)':'1.5px solid rgba(22,163,74,.15)'}}>
                          <div>
                            <div style={{fontSize:13,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",color:'var(--acc)',marginBottom:2}}>
                              ⚡ Explanation Ready
                            </div>
                            <div style={{fontSize:10.5,color:'var(--txt3)',fontFamily:"'IBM Plex Mono',monospace"}}>
                              {explainMode==='full'?'Full Breakdown':explainMode==='structure'?'HTML Structure':explainMode==='css'?'CSS Deep Dive':explainMode==='js'?'JavaScript Logic':'Beginner Friendly'} · {lineCount} lines analysed
                            </div>
                          </div>
                          <div style={{display:'flex',gap:5}}>
                            <button className="btn-ghost" style={{padding:'4px 8px',fontSize:9}}
                              onClick={()=>{try{navigator.clipboard.writeText(explainResult)}catch(e){}}}>
                              {I.copy(10)} Copy
                            </button>
                            <button className="btn-ghost" style={{padding:'4px 8px',fontSize:9}}
                              onClick={()=>{setExplainResult(null);}}>
                              ✕ Clear
                            </button>
                          </div>
                        </div>
                        {/* Rendered explanation */}
                        <div>{renderExplain(explainResult)}</div>
                        {/* Re-explain button */}
                        <div style={{marginTop:20,paddingTop:14,borderTop:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>
                          <button className="btn-primary" onClick={explainCode}
                            style={{width:'100%',justifyContent:'center',padding:'9px',fontSize:11}}>
                            ⚡ Re-explain
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ── LIVE PREVIEW ── */
                  <>
                    <div className="preview-bar">
                      <div style={{width:8,height:8,borderRadius:'50%',background:dark?'rgba(52,211,153,.35)':'rgba(22,163,74,.3)'}}/>
                      <span className="url-bar">preview</span>
                      {hasError&&<span className="status-err">● error</span>}
                      <button className="btn-ghost" onClick={()=>setIframeKey(k=>k+1)} style={{padding:'3px 7px'}}>{I.refresh(10)}</button>
                    </div>
                    <iframe key={iframeKey} ref={iframeRef} title="preview"
                      srcDoc={sandboxedHtml}
                      sandbox="allow-scripts allow-same-origin allow-modals"
                      style={{flex:1,width:'100%',border:'none',background:'#fff'}}/>
                    {/* Console */}
                    {consoleLines.length>0&&(
                      <div style={{height:100,overflow:'auto',borderTop:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        background:dark?'rgba(0,0,0,.6)':'#f8fbf8',padding:'6px 12px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                          <span className="lbl" style={{margin:0}}>{I.terminal(9)} Console</span>
                          <button className="btn-ghost" onClick={()=>setConsoleLines([])} style={{padding:'2px 6px',fontSize:8.5}}>clear</button>
                        </div>
                        {consoleLines.map(l=>(
                          <div key={l.id} className={`console-line ${l.level}`}>
                            <span style={{color:'var(--txt3)',marginRight:8,fontSize:10}}>{l.time}</span>
                            [{l.level.toUpperCase()}] {l.msg}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            /* ── EDITOR TAB — Split / Code-only / Preview-only ── */
            <div ref={containerRef} className="split-pane" style={{userSelect:draggingRef.current?'none':'auto'}}>

              {/* Editor column */}
              {viewMode !== 'preview' && (
                <div className="editor-col" style={{width: viewMode==='split'?`${editorWidth}%`:'100%'}}>
                  <div className={`editor-wrap ${editorFocused?'focused':''}`}
                    style={{flex:1,margin:'10px 8px 10px 10px',display:'flex',flexDirection:'column'}}>
                    <LineNums code={html}/>
                    <textarea ref={taRef}
                      className="code-ta"
                      value={html}
                      onChange={e=>setHtml(e.target.value)}
                      onFocus={()=>setEditorFocused(true)}
                      onBlur={()=>setEditorFocused(false)}
                      onKeyDown={handleKeyDown}
                      spellCheck={false}
                      style={{
                        flex:1,whiteSpace:wordWrap?'pre-wrap':'pre',
                        overflowWrap:wordWrap?'break-word':'normal',
                        overflowX:wordWrap?'hidden':'auto',
                        minHeight:0
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Divider */}
              {viewMode === 'split' && (
                <div ref={dividerRef} className="divider" onMouseDown={startDrag}
                  style={{cursor:'col-resize',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <div style={{width:2,height:24,borderRadius:1,background:dark?'rgba(52,211,153,.2)':'rgba(22,163,74,.2)'}}/>
                </div>
              )}

              {/* Preview column */}
              {viewMode !== 'editor' && (
                <div className="preview-col" style={{flex:1}}>
                  <div className="preview-bar">
                    <div style={{width:7,height:7,borderRadius:'50%',
                      background:dark?'rgba(52,211,153,.4)':'rgba(22,163,74,.35)',
                      animation:autoRun?(dark?'green-glow 2s ease-in-out infinite':'none'):'none'}}/>
                    <div style={{width:7,height:7,borderRadius:'50%',background:dark?'rgba(251,191,36,.3)':'rgba(217,119,6,.25)'}}/>
                    <div style={{width:7,height:7,borderRadius:'50%',background:dark?'rgba(248,113,113,.3)':'rgba(220,38,38,.22)'}}/>
                    <span className="url-bar">about:preview</span>
                    {hasError?<span className="status-err">● {consoleLines.filter(l=>l.level==='error').length} err</span>:
                      <span className="status-ok">● ready</span>}
                    <button className="btn-ghost" onClick={()=>{setIframeKey(k=>k+1);setConsoleLines([]);}} style={{padding:'3px 7px'}}>
                      {I.refresh(10)}
                    </button>
                  </div>
                  <iframe key={iframeKey} ref={iframeRef} title="html-preview"
                    srcDoc={sandboxedHtml}
                    sandbox="allow-scripts allow-same-origin allow-modals"
                    style={{flex:1,width:'100%',border:'none',background:'#fff'}}/>
                  {/* Console panel */}
                  {consoleLines.length > 0 && (
                    <div style={{height:110,overflow:'auto',flexShrink:0,
                      borderTop:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                      background:dark?'rgba(0,0,0,.65)':'#f0f7f0',padding:'6px 12px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                        <span className="lbl" style={{margin:0,display:'flex',alignItems:'center',gap:5}}>
                          {I.terminal(9)} Console ({consoleLines.length})
                        </span>
                        <button className="btn-ghost" onClick={()=>setConsoleLines([])} style={{padding:'2px 6px',fontSize:8}}>
                          clear
                        </button>
                      </div>
                      {consoleLines.map(l=>(
                        <div key={l.id} className={`console-line ${l.level}`}>
                          <span style={{opacity:.5,marginRight:7,fontSize:9.5}}>{l.time}</span>
                          [{l.level.slice(0,3).toUpperCase()}] {l.msg}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}