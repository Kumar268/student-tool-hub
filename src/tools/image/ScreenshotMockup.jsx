import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════
   BASE STYLES
═══════════════════════════════════════════════════════ */
const BASE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }

  @keyframes holo    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes scan    { 0%{top:-4px} 100%{top:100%} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

  .holo-txt {
    background: linear-gradient(90deg,#00fff7,#bf00ff,#ffaa00,#00fff7);
    background-size: 300%; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    animation: holo 5s ease infinite;
  }
  .scan-line {
    position:fixed; left:0; right:0; height:2px; pointer-events:none; z-index:999;
    background:linear-gradient(90deg,transparent,#00fff7,transparent);
    box-shadow:0 0 10px #00fff7; animation:scan 7s linear infinite;
  }
`;

/* ═══════════════════════════════════════════════════════
   NEON STYLES
═══════════════════════════════════════════════════════ */
const NEON_STYLES = `
  .neon-root {
    --n:#00fff7; --n2:#bf00ff; --am:#ffaa00; --ok:#00ff88; --dng:#ff003c;
    --bg:#010108; --p1:#07071a; --p2:#0b0b22;
    --txt:#e2e8ff; --sub:#7a7aaa; --bdr:#1e1e42;
    font-family:'Inter',sans-serif; background:var(--bg); color:var(--txt); min-height:100vh;
  }
  .n-panel {
    background:linear-gradient(135deg,rgba(11,11,34,.98),rgba(4,4,15,1));
    border:1px solid var(--bdr); border-radius:4px; position:relative; overflow:hidden;
  }
  .n-panel::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,247,.005) 3px,rgba(0,255,247,.005) 4px);
  }
  .n-corner::before,.n-corner::after { content:''; position:absolute; width:16px; height:16px; z-index:2; }
  .n-corner::before { top:0; left:0; border-top:1px solid var(--n); border-left:1px solid var(--n); }
  .n-corner::after  { bottom:0; right:0; border-bottom:1px solid var(--n); border-right:1px solid var(--n); }

  .n-btn {
    display:inline-flex; align-items:center; gap:8px; padding:12px 28px;
    border:1px solid var(--n); border-radius:2px; background:transparent; color:var(--n);
    cursor:pointer; position:relative; overflow:hidden;
    font-family:'Inter',sans-serif; font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
    box-shadow:0 0 16px rgba(0,255,247,.18); transition:all .25s;
  }
  .n-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(0,255,247,.08),transparent); transform:translateX(-100%); transition:transform .4s; }
  .n-btn:hover::after { transform:translateX(100%); }
  .n-btn:hover { background:rgba(0,255,247,.07); box-shadow:0 0 32px rgba(0,255,247,.35); transform:translateY(-1px); }
  .n-btn:disabled { opacity:.3; cursor:not-allowed; transform:none; }
  .n-btn.success { border-color:var(--ok); color:var(--ok); box-shadow:0 0 16px rgba(0,255,136,.15); }
  .n-btn.success:hover { background:rgba(0,255,136,.07); }
  .n-btn.purple { border-color:var(--n2); color:var(--n2); box-shadow:0 0 14px rgba(191,0,255,.15); }
  .n-btn.purple:hover { background:rgba(191,0,255,.07); }

  .n-ghost {
    display:inline-flex; align-items:center; gap:6px; padding:7px 13px;
    border:1px solid var(--bdr); border-radius:2px; background:transparent; color:var(--sub);
    cursor:pointer; font-family:'Inter',sans-serif; font-size:10px; font-weight:500; letter-spacing:.08em;
    transition:all .18s;
  }
  .n-ghost:hover { border-color:var(--n); color:var(--n); background:rgba(0,255,247,.04); }
  .n-ghost.active { border-color:var(--n); color:var(--n); background:rgba(0,255,247,.07); }

  .n-chip { display:inline-block; padding:3px 10px; border:1px solid rgba(0,255,247,.25); border-radius:2px; font-size:8px; font-weight:700; letter-spacing:.14em; color:rgba(0,255,247,.6); text-transform:uppercase; }

  .n-mode-toggle { display:flex; align-items:center; gap:10px; padding:7px 14px; border:1px solid rgba(0,255,247,.25); border-radius:2px; background:rgba(0,255,247,.03); cursor:pointer; transition:all .2s; }
  .n-mode-toggle:hover { border-color:var(--n); box-shadow:0 0 12px rgba(0,255,247,.12); }

  .n-drop {
    border:2px dashed rgba(0,255,247,.2); border-radius:2px;
    background:rgba(0,255,247,.015); cursor:pointer; transition:all .2s; position:relative;
  }
  .n-drop:hover,.n-drop.over { border-color:rgba(0,255,247,.6); background:rgba(0,255,247,.04); box-shadow:0 0 28px rgba(0,255,247,.1); }
  .n-drop.has-file { border-color:rgba(0,255,247,.35); }

  .n-device-card {
    border:1px solid var(--bdr); border-radius:3px; padding:12px 10px; cursor:pointer;
    background:rgba(0,0,0,.3); text-align:center; transition:all .2s; position:relative; overflow:hidden;
  }
  .n-device-card::before { content:''; position:absolute; inset:0; background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,247,.004) 3px,rgba(0,255,247,.004) 4px); }
  .n-device-card:hover { border-color:rgba(0,255,247,.3); transform:translateY(-2px); }
  .n-device-card.active { border-color:var(--n); background:rgba(0,255,247,.07); box-shadow:0 0 18px rgba(0,255,247,.15); }

  .n-prog-track { height:3px; background:rgba(0,255,247,.08); overflow:hidden; position:relative; }
  .n-prog-fill  { height:100%; background:linear-gradient(90deg,var(--n2),var(--n)); box-shadow:0 0 8px var(--n); transition:width .25s; }
  .n-prog-shim  { position:absolute; top:0; bottom:0; width:60%; background:linear-gradient(90deg,transparent,rgba(0,255,247,.35),transparent); animation:shimmer 1.4s ease-in-out infinite; }

  .n-stat { border:1px solid var(--bdr); border-radius:2px; background:rgba(0,0,0,.4); padding:12px; text-align:center; position:relative; overflow:hidden; }
  .n-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--n),transparent); }

  .n-swatch { width:26px; height:26px; cursor:pointer; border:1px solid var(--bdr); flex-shrink:0; transition:all .15s; position:relative; }
  .n-swatch:hover,.n-swatch.active { border-color:var(--n); box-shadow:0 0 8px rgba(0,255,247,.3); transform:scale(1.12); }
  .n-swatch.active::after { content:'✓'; position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:900; }
`;

/* ═══════════════════════════════════════════════════════
   NORMAL STYLES
═══════════════════════════════════════════════════════ */
const NORMAL_STYLES = `
  .nm-root { font-family:'Inter',sans-serif; background:#1a1a2e; color:#e2e8f0; min-height:100vh; }
  .nm-card  { background:#16213e; border:1px solid #2d3561; border-radius:16px; }

  .nm-btn {
    display:inline-flex; align-items:center; gap:8px; padding:12px 24px; border-radius:10px; border:none;
    cursor:pointer; font-family:'Inter',sans-serif; font-size:13px; font-weight:700;
    background:linear-gradient(135deg,#4f46e5,#06b6d4); color:#fff;
    box-shadow:0 4px 16px rgba(79,70,229,.4); transition:all .2s;
  }
  .nm-btn:hover { box-shadow:0 8px 28px rgba(79,70,229,.55); transform:translateY(-1px); }
  .nm-btn:disabled { opacity:.35; cursor:not-allowed; transform:none; box-shadow:none; }
  .nm-btn.success { background:linear-gradient(135deg,#10b981,#059669); box-shadow:0 4px 16px rgba(16,185,129,.35); }
  .nm-btn.purple  { background:linear-gradient(135deg,#8b5cf6,#ec4899); box-shadow:0 4px 16px rgba(139,92,246,.3); }

  .nm-ghost {
    display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:8px;
    border:1.5px solid #2d3561; background:transparent; color:#64748b; cursor:pointer;
    font-family:'Inter',sans-serif; font-size:11px; font-weight:600; transition:all .15s;
  }
  .nm-ghost:hover { border-color:#6366f1; color:#818cf8; background:rgba(99,102,241,.08); }
  .nm-ghost.active { border-color:#6366f1; color:#818cf8; background:rgba(99,102,241,.12); }

  .nm-drop {
    border:2px dashed #2d3561; border-radius:14px;
    background:#0f0f23; cursor:pointer; transition:all .2s; position:relative;
  }
  .nm-drop:hover,.nm-drop.over { border-color:#6366f1; background:rgba(99,102,241,.05); box-shadow:0 0 0 4px rgba(99,102,241,.1); }
  .nm-drop.has-file { border-color:rgba(99,102,241,.5); }

  .nm-device-card {
    border:1.5px solid #2d3561; border-radius:12px; padding:12px 8px; cursor:pointer;
    background:#0f0f23; text-align:center; transition:all .2s;
  }
  .nm-device-card:hover { border-color:#6366f1; transform:translateY(-2px); box-shadow:0 4px 20px rgba(99,102,241,.15); }
  .nm-device-card.active { border-color:#6366f1; background:rgba(99,102,241,.12); box-shadow:0 0 0 3px rgba(99,102,241,.15); }

  .nm-stat { background:#0f0f23; border:1px solid #2d3561; border-radius:10px; padding:12px; text-align:center; }

  .nm-mode-toggle { display:flex; align-items:center; gap:10px; padding:8px 16px; border-radius:10px; border:1.5px solid #2d3561; background:#16213e; cursor:pointer; transition:all .2s; }
  .nm-mode-toggle:hover { border-color:#6366f1; }
  .nm-section-label { font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:#6366f1; }

  .nm-swatch { width:28px; height:28px; border-radius:6px; cursor:pointer; border:1.5px solid #2d3561; flex-shrink:0; transition:all .15s; position:relative; }
  .nm-swatch:hover,.nm-swatch.active { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.2); transform:scale(1.08); }
  .nm-swatch.active::after { content:'✓'; position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:900; }
`;

/* ═══════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════ */
const Ic = ({ d, s=16, sw=1.8 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {Array.isArray(d) ? d.map((p,i)=><path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const IcoUpload  = ({s=24}) => <Ic s={s} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const IcoDl      = ({s=16}) => <Ic s={s} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />;
const IcoZap     = ({s=16}) => <Ic s={s} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
const IcoReset   = ({s=16}) => <Ic s={s} d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />;
const IcoMonitor = ({s=22}) => <Ic s={s} d={["M20 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z","M8 21h8M12 17v4"]} />;
const IcoPhone   = ({s=22}) => <Ic s={s} d={["M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z","M12 18h.01"]} />;
const IcoTablet  = ({s=22}) => <Ic s={s} d={["M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z","M12 18h.01"]} />;
const IcoLaptop  = ({s=22}) => <Ic s={s} d={["M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9","M1 16h22"]} />;
const IcoCheck   = ({s=16}) => <Ic s={s} d="M20 6 9 17l-5-5" />;
const IcoClose   = ({s=13}) => <Ic s={s} d="M18 6 6 18M6 6l12 12" />;
const IcoStar    = ({s=13}) => <Ic s={s} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;

/* ═══════════════════════════════════════════════════════
   DEVICE CONFIG
═══════════════════════════════════════════════════════ */
const DEVICES = {
  macbook: {
    label:'MacBook Pro', icon: IcoLaptop,
    w:1280, h:800,
    bezel:{ t:26, b:36, l:40, r:40 },
    radius:18, frameColor:'#1e293b', accentColor:'#334155',
    extras: ['trackpad','chin','notchCam'],
  },
  iphone: {
    label:'iPhone 15 Pro or mobile', icon: IcoPhone,
    w:390, h:844,
    bezel:{ t:48, b:48, l:12, r:12 },
    radius:44, frameColor:'#1c1c1e', accentColor:'#3a3a3c',
    extras: ['dynamicIsland','sideButtons','homeBar'],
  },
  ipad: {
    label:'iPad Pro', icon: IcoTablet,
    w:834, h:1194,
    bezel:{ t:28, b:28, l:22, r:22 },
    radius:28, frameColor:'#1e293b', accentColor:'#334155',
    extras: ['frontCam','homeBar'],
  },
  monitor: {
    label:'Desktop Monitor', icon: IcoMonitor,
    w:1920, h:1080,
    bezel:{ t:24, b:56, l:44, r:44 },
    radius:10, frameColor:'#1e293b', accentColor:'#0f172a',
    extras: ['stand','chin'],
  },
};

/* ═══════════════════════════════════════════════════════
   BACKGROUND PRESETS
═══════════════════════════════════════════════════════ */
const BG_PRESETS = [
  { id:'white',   label:'White',    style:{ background:'#ffffff' } },
  { id:'black',   label:'Black',    style:{ background:'#000000' } },
  { id:'dark',    label:'Dark',     style:{ background:'#0f0f23' } },
  { id:'grad1',   label:'Indigo',   style:{ background:'linear-gradient(135deg,#4f46e5,#06b6d4)' } },
  { id:'grad2',   label:'Neon',     style:{ background:'linear-gradient(135deg,#00fff7,#bf00ff)' } },
  { id:'grad3',   label:'Sunset',   style:{ background:'linear-gradient(135deg,#f59e0b,#ef4444)' } },
  { id:'grad4',   label:'Forest',   style:{ background:'linear-gradient(135deg,#10b981,#3b82f6)' } },
  { id:'grad5',   label:'Rose',     style:{ background:'linear-gradient(135deg,#ec4899,#8b5cf6)' } },
  { id:'mesh1',   label:'Mesh 1',   style:{ background:'radial-gradient(ellipse at 20% 20%,#4f46e5 0%,transparent 60%),radial-gradient(ellipse at 80% 80%,#06b6d4 0%,transparent 60%),#0f0f23' } },
  { id:'mesh2',   label:'Mesh 2',   style:{ background:'radial-gradient(ellipse at 80% 20%,#bf00ff 0%,transparent 55%),radial-gradient(ellipse at 20% 80%,#00fff7 0%,transparent 55%),#010108' } },
  { id:'mesh3',   label:'Mesh 3',   style:{ background:'radial-gradient(ellipse at 50% 0%,#f59e0b 0%,transparent 50%),radial-gradient(ellipse at 0% 100%,#ef4444 0%,transparent 50%),radial-gradient(ellipse at 100% 100%,#8b5cf6 0%,transparent 50%),#111' } },
  { id:'custom',  label:'Custom',   style:null },
];

/* ═══════════════════════════════════════════════════════
   MOCKUP STYLES (shadow / glow)
═══════════════════════════════════════════════════════ */
const MOCKUP_STYLES = [
  { id:'clean',   label:'Clean',    shadow:'rgba(0,0,0,.35) 0 20px 60px' },
  { id:'float',   label:'Float',    shadow:'rgba(0,0,0,.5) 0 40px 80px, rgba(0,0,0,.2) 0 4px 16px' },
  { id:'neon',    label:'Neon',     shadow:'rgba(0,255,247,.3) 0 0 60px, rgba(191,0,255,.2) 0 0 120px' },
  { id:'minimal', label:'Minimal',  shadow:'rgba(0,0,0,.12) 0 8px 24px' },
];

/* ═══════════════════════════════════════════════════════
   CANVAS RENDERER
═══════════════════════════════════════════════════════ */
async function renderMockup({ imageUrl, deviceKey, bgPreset, customColor, mockupStyleId, padding=60 }) {
  const dev = DEVICES[deviceKey];
  const ms  = MOCKUP_STYLES.find(s=>s.id===mockupStyleId) || MOCKUP_STYLES[0];

  const totalW = dev.w + dev.bezel.l + dev.bezel.r + padding*2;
  const totalH = dev.h + dev.bezel.t + dev.bezel.b + padding*2;

  const canvas = document.createElement('canvas');
  canvas.width  = totalW * 2; // 2x for retina
  canvas.height = totalH * 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);

  // ── BACKGROUND ──
  const preset = BG_PRESETS.find(p=>p.id===bgPreset);
  if (bgPreset === 'custom') {
    ctx.fillStyle = customColor;
    ctx.fillRect(0, 0, totalW, totalH);
  } else if (preset?.style?.background?.startsWith('radial') || preset?.style?.background?.startsWith('linear')) {
    const grad = parseAndCreateGradient(ctx, preset.style.background, totalW, totalH);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, totalW, totalH);
  } else {
    ctx.fillStyle = preset?.style?.background || '#ffffff';
    ctx.fillRect(0, 0, totalW, totalH);
  }

  // ── FRAME SHADOW ──
  const fx = padding;
  const fy = padding;
  const fw = dev.w + dev.bezel.l + dev.bezel.r;
  const fh = dev.h + dev.bezel.t + dev.bezel.b;

  ctx.save();
  ctx.shadowColor   = ms.shadow.split(',')[0].match(/rgba?\([^)]+\)/)?.[0] || 'rgba(0,0,0,.4)';
  ctx.shadowBlur    = parseInt(ms.shadow.match(/\d+px/g)?.[0]) || 40;
  ctx.shadowOffsetY = parseInt(ms.shadow.match(/\d+ \d+px/)?.[0]?.split(' ')?.[1]) || 8;
  ctx.fillStyle = dev.frameColor;
  roundRect(ctx, fx, fy, fw, fh, dev.radius);
  ctx.fill();
  ctx.restore();

  // ── FRAME BODY ──
  ctx.fillStyle = dev.frameColor;
  roundRect(ctx, fx, fy, fw, fh, dev.radius);
  ctx.fill();

  // Subtle edge highlight
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,.07)';
  ctx.lineWidth = 1;
  roundRect(ctx, fx+.5, fy+.5, fw-1, fh-1, dev.radius);
  ctx.stroke();
  ctx.restore();

  // ── SCREEN BACKGROUND ──
  const sx = fx + dev.bezel.l;
  const sy = fy + dev.bezel.t;
  ctx.fillStyle = '#111';
  roundRect(ctx, sx, sy, dev.w, dev.h, 6);
  ctx.fill();

  // ── SCREENSHOT ──
  const img = await loadImg(imageUrl);
  const scale = Math.min(dev.w / img.width, dev.h / img.height);
  const iw = img.width * scale, ih = img.height * scale;
  const ix = sx + (dev.w - iw)/2, iy = sy + (dev.h - ih)/2;

  ctx.save();
  roundRect(ctx, sx, sy, dev.w, dev.h, 6);
  ctx.clip();
  ctx.drawImage(img, ix, iy, iw, ih);
  ctx.restore();

  // ── DEVICE EXTRAS ──
  if (deviceKey === 'iphone') {
    // Dynamic Island
    ctx.fillStyle = '#000';
    roundRect(ctx, fx + fw/2 - 48, fy + dev.bezel.t - 16, 96, 30, 15);
    ctx.fill();
    // Home bar
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    roundRect(ctx, fx + fw/2 - 50, fy + dev.bezel.t + dev.h + 14, 100, 4, 2);
    ctx.fill();
    // Side buttons
    ctx.fillStyle = dev.accentColor;
    roundRect(ctx, fx - 3, fy + 80, 3, 30, 1.5); ctx.fill(); // power
    roundRect(ctx, fx - 3, fy + 130, 3, 50, 1.5); ctx.fill(); // vol up
    roundRect(ctx, fx - 3, fy + 190, 3, 50, 1.5); ctx.fill(); // vol down
    roundRect(ctx, fx + fw, fy + 100, 3, 60, 1.5); ctx.fill(); // lock
  }

  if (deviceKey === 'macbook') {
    // Notch + camera
    ctx.fillStyle = dev.frameColor;
    roundRect(ctx, fx + fw/2 - 60, fy - 2, 120, 18, 0); ctx.fill();
    ctx.fillStyle = '#2a2a3e';
    ctx.beginPath(); ctx.arc(fx + fw/2, fy + 8, 4, 0, Math.PI*2); ctx.fill();
    // Trackpad
    ctx.fillStyle = dev.accentColor;
    roundRect(ctx, fx + fw/2 - 55, fy + fh - 16, 110, 10, 4); ctx.fill();
    // Chin stripe
    ctx.fillStyle = 'rgba(255,255,255,.04)';
    roundRect(ctx, fx, fy + dev.bezel.t + dev.h, fw, dev.bezel.b, 0); ctx.fill();
  }

  if (deviceKey === 'monitor') {
    // Stand neck
    ctx.fillStyle = dev.accentColor;
    roundRect(ctx, fx + fw/2 - 10, fy + fh, 20, 35, 4); ctx.fill();
    // Stand base
    roundRect(ctx, fx + fw/2 - 60, fy + fh + 30, 120, 8, 4); ctx.fill();
    // Chin logo dot
    ctx.fillStyle = 'rgba(255,255,255,.1)';
    ctx.beginPath(); ctx.arc(fx + fw/2, fy + dev.bezel.t + dev.h + dev.bezel.b/2, 5, 0, Math.PI*2); ctx.fill();
  }

  if (deviceKey === 'ipad') {
    // Front camera
    ctx.fillStyle = '#2a2a3e';
    ctx.beginPath(); ctx.arc(fx + fw/2, fy + dev.bezel.t/2, 5, 0, Math.PI*2); ctx.fill();
    // Home bar
    ctx.fillStyle = 'rgba(255,255,255,.2)';
    roundRect(ctx, fx + fw/2 - 40, fy + dev.bezel.t + dev.h + 10, 80, 4, 2); ctx.fill();
  }

  // ── SCREEN GLARE ──
  ctx.save();
  roundRect(ctx, sx, sy, dev.w, dev.h, 6);
  ctx.clip();
  const glare = ctx.createLinearGradient(sx, sy, sx + dev.w * .6, sy + dev.h * .5);
  glare.addColorStop(0,   'rgba(255,255,255,.06)');
  glare.addColorStop(.4,  'rgba(255,255,255,.02)');
  glare.addColorStop(1,   'rgba(255,255,255,0)');
  ctx.fillStyle = glare;
  ctx.fillRect(sx, sy, dev.w, dev.h);
  ctx.restore();

  return canvas;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);
  ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r);
  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);
  ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r);
  ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

function loadImg(src) {
  return new Promise((res,rej) => { const i=new Image(); i.crossOrigin='anonymous'; i.onload=()=>res(i); i.onerror=rej; i.src=src; });
}

function parseAndCreateGradient(ctx, cssGrad, w, h) {
  // Simplified: extract colors from gradient string and create canvas gradient
  const colors = [];
  const re = /#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/g;
  let m;
  while ((m = re.exec(cssGrad)) !== null) colors.push(m[0]);

  if (cssGrad.includes('radial')) {
    const g = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)/1.5);
    colors.slice(0,2).forEach((c,i) => g.addColorStop(i/(colors.length-1||1), c));
    // fallback fill
    const fillG = ctx.createLinearGradient(0,0,w,h);
    fillG.addColorStop(0, colors[0]||'#4f46e5');
    fillG.addColorStop(1, colors[1]||'#06b6d4');
    return fillG;
  }
  const g = ctx.createLinearGradient(0,0,w,h);
  colors.slice(0,2).forEach((c,i)=>g.addColorStop(i/(Math.max(colors.length-1,1)),c));
  return g;
}

/* ═══════════════════════════════════════════════════════
   CORE HOOK
═══════════════════════════════════════════════════════ */
function useMockup() {
  const [file, setFile]       = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [device, setDevice]   = useState('macbook');
  const [bgPreset, setBgPreset] = useState('grad1');
  const [customColor, setCustomColor] = useState('#1a1a2e');
  const [mockupStyle, setMockupStyle] = useState('float');
  const [status, setStatus]   = useState('idle');
  const [result, setResult]   = useState(null); // { url, w, h }
  const [padding, setPadding] = useState(80);
  const urlsRef = useRef([]);

  const loadFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) return;
    const url = URL.createObjectURL(f);
    urlsRef.current.push(url);
    setFile(f); setFileUrl(url); setResult(null); setStatus('idle');
  }, []);

  const generate = useCallback(async () => {
    if (!fileUrl) return;
    setStatus('generating');
    try {
      const canvas = await renderMockup({ imageUrl:fileUrl, deviceKey:device, bgPreset, customColor, mockupStyleId:mockupStyle, padding });
      const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
      const url  = URL.createObjectURL(blob);
      urlsRef.current.push(url);
      setResult({ url, w:canvas.width, h:canvas.height, blob });
      setStatus('done');
    } catch(e) {
      console.error(e); setStatus('error');
    }
  }, [fileUrl, device, bgPreset, customColor, mockupStyle, padding]);

  const download = useCallback(() => {
    if (!result) return;
    const a=document.createElement('a'); a.href=result.url; a.download=`mockup_${device}_${Date.now()}.png`; a.click();
  }, [result, device]);

  const reset = useCallback(() => { setFile(null); setFileUrl(null); setResult(null); setStatus('idle'); }, []);

  return { file, loadFile, fileUrl, device, setDevice, bgPreset, setBgPreset, customColor, setCustomColor,
    mockupStyle, setMockupStyle, status, result, generate, download, reset, padding, setPadding };
}

/* ═══════════════════════════════════════════════════════
   BACKGROUND PICKER
═══════════════════════════════════════════════════════ */
function BgPicker({ bgPreset, setBgPreset, customColor, setCustomColor, neon }) {
  return (
    <div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
        {BG_PRESETS.filter(p=>p.id!=='custom').map(p => {
          const bg = p.style?.background || '#fff';
          const isActive = bgPreset === p.id;
          return (
            <div key={p.id} onClick={()=>setBgPreset(p.id)}
              className={`${neon?'n-swatch':'nm-swatch'} ${isActive?'active':''}`}
              style={{ background:bg, color: bg.includes('#0')||bg.includes('dark')||bg.includes('Mesh')||bg.includes('#010')||bg.includes('grad')?'#fff':'#000' }}
              title={p.label} />
          );
        })}
      </div>
      <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:6 }}>
        <span style={{ fontSize:9, fontWeight:600, color: neon?'#7a7aaa':'#64748b', textTransform:'uppercase', letterSpacing:'.1em' }}>Custom:</span>
        <input type="color" value={customColor} onChange={e=>{setCustomColor(e.target.value);setBgPreset('custom');}}
          style={{ width:34, height:24, border: neon?'1px solid #1e1e42':'1.5px solid #2d3561', background:'transparent', cursor:'pointer', borderRadius: neon?2:5, padding:1 }} />
        <button onClick={()=>setBgPreset('custom')}
          className={`${neon?'n-ghost':'nm-ghost'} ${bgPreset==='custom'?'active':''}`}
          style={{ padding:'3px 8px', fontSize:9 }}>
          CUSTOM
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DEVICE SELECTOR
═══════════════════════════════════════════════════════ */
function DeviceSelector({ current, onChange, neon }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
      {Object.entries(DEVICES).map(([key, dev]) => {
        const Icon = dev.icon;
        const isActive = current === key;
        return (
          <div key={key} onClick={()=>onChange(key)}
            className={`${neon?'n-device-card':'nm-device-card'} ${isActive?'active':''}`}>
            <div style={{ marginBottom:6, color: isActive?(neon?'#00fff7':'#818cf8'):(neon?'#7a7aaa':'#64748b'), position:'relative', zIndex:1 }}>
              <Icon s={20}/>
            </div>
            <div style={{ fontSize:11, fontWeight:700, color: isActive?(neon?'#00fff7':'#818cf8'):(neon?'#e2e8ff':'#e2e8f0'), position:'relative', zIndex:1, marginBottom:2 }}>{dev.label}</div>
            <div style={{ fontSize:9, color: neon?'#7a7aaa':'#64748b', position:'relative', zIndex:1 }}>{dev.w}×{dev.h}</div>
            {isActive && (
              <div style={{ position:'absolute', top:6, right:6, width:14, height:14, borderRadius:'50%',
                background: neon?'#00fff7':'#6366f1', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2 }}>
                <IcoCheck s={9}/>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RESULT VIEW
═══════════════════════════════════════════════════════ */
function ResultView({ result, device, onDownload, onReset, neon }) {
  const dev = DEVICES[device];
  return (
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}>

      {/* Preview */}
      <div style={{ marginBottom:20, borderRadius: neon?4:14, overflow:'hidden',
        border: neon?'1px solid rgba(0,255,247,.2)':'1.5px solid rgba(99,102,241,.2)',
        boxShadow: neon?'0 0 40px rgba(0,255,247,.08)':'0 8px 40px rgba(0,0,0,.4)' }}>
        <img src={result.url} alt="mockup preview"
          style={{ display:'block', width:'100%', maxHeight:400, objectFit:'contain', background: neon?'#010108':'#0f0f23' }} />
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
        {[
          ['DEVICE',  dev.label, neon?'#00fff7':'#6366f1'],
          ['OUTPUT',  `${result.w/2}×${result.h/2}`, neon?'#00ff88':'#10b981'],
          ['FORMAT',  'PNG · 2x', neon?'#bf00ff':'#8b5cf6'],
        ].map(([k,v,c])=>(
          <div key={k} className={neon?'n-stat':'nm-stat'}>
            <div style={{ fontSize:7, fontWeight:700, color: neon?'rgba(0,255,247,.4)':'#475569', letterSpacing:'.16em', textTransform:'uppercase', marginBottom:5 }}>{k}</div>
            <div style={{ fontSize:12, fontWeight:800, color:c, lineHeight:1.2 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── DOWNLOAD SECTION ── */}
      <div className={neon?'n-panel n-corner':'nm-card'} style={{ padding:'20px 22px' }}>
        <div style={{ fontSize: neon?8:10, fontWeight:700, color: neon?'rgba(0,255,247,.5)':'#6366f1',
          letterSpacing:'.18em', textTransform:'uppercase', marginBottom:14 }}>
          {neon ? '◈ DOWNLOAD MOCKUP' : '✦ Download Mockup'}
        </div>

        <button className={`${neon?'n-btn':'nm-btn'} success`}
          style={{ width:'100%', justifyContent:'center', padding:'14px', marginBottom:10, fontSize: neon?12:14 }}
          onClick={onDownload}>
          <IcoDl s={15}/> {neon?'DOWNLOAD PNG (2× RETINA)':'Download PNG (2× Retina)'}
        </button>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
          {[
            ['RESOLUTION', `${result.w}×${result.h}px (2×)`],
            ['DEVICE',     dev.label],
          ].map(([k,v])=>(
            <div key={k} style={{ padding:'9px 12px', border: neon?'1px solid #1e1e42':'1.5px solid #2d3561',
              borderRadius: neon?2:8, background: neon?'rgba(0,0,0,.35)':'#0f0f23' }}>
              <div style={{ fontSize:7, fontWeight:700, color: neon?'rgba(0,255,247,.4)':'#6366f1', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:3 }}>{k}</div>
              <div style={{ fontSize:10, fontWeight:600, color: neon?'#e2e8ff':'#e2e8f0' }}>{v}</div>
            </div>
          ))}
        </div>

        <button className={neon?'n-ghost':'nm-ghost'} onClick={onReset} style={{ width:'100%', justifyContent:'center' }}>
          <IcoReset s={12}/> {neon ? 'CREATE ANOTHER MOCKUP' : 'Create Another Mockup'}
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   GENERATING VIEW
═══════════════════════════════════════════════════════ */
function Generating({ neon }) {
  return (
    <div style={{ textAlign:'center', padding:'40px 20px' }}>
      <div style={{ width:80, height:80, margin:'0 auto 24px', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, border: neon?'2px solid rgba(0,255,247,.12)':'2px solid rgba(99,102,241,.12)', borderRadius:'50%' }}/>
        <div style={{ position:'absolute', inset:0, border:'2px solid transparent', borderTopColor: neon?'#00fff7':'#6366f1', borderRadius:'50%', animation:'spin .9s linear infinite' }}/>
        <div style={{ position:'absolute', inset:12, border:'2px solid transparent', borderTopColor: neon?'#bf00ff':'#06b6d4', borderRadius:'50%', animation:'spin 1.4s linear infinite reverse' }}/>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color: neon?'#00fff7':'#6366f1' }}>
          <IcoStar s={18}/>
        </div>
      </div>
      <div style={{ fontSize: neon?9:10, fontWeight:700, color: neon?'rgba(0,255,247,.5)':'#6366f1', letterSpacing:'.18em', textTransform:'uppercase', marginBottom:10 }}>
        {neon ? '◈ RENDERING MOCKUP' : '✦ Rendering Mockup'}
      </div>
      <div style={{ fontSize:13, color: neon?'#7a7aaa':'#64748b' }}>Building device frame & compositing image…</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NEON APP
═══════════════════════════════════════════════════════ */
function NeonApp({ onSwitch, mk }) {
  const { file, loadFile, fileUrl, device, setDevice, bgPreset, setBgPreset,
    customColor, setCustomColor, mockupStyle, setMockupStyle,
    status, result, generate, download, reset, padding, setPadding } = mk;
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  return (
    <div className="neon-root" style={{ minHeight:'100vh' }}>
      <div className="scan-line"/>

      {/* TOP BAR */}
      <div style={{ background:'rgba(1,1,8,.95)', borderBottom:'1px solid #1e1e42', padding:'0 24px',
        display:'flex', alignItems:'center', gap:14, height:54, position:'sticky', top:0, zIndex:50, backdropFilter:'blur(10px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:30,height:30,border:'1px solid rgba(0,255,247,.4)',display:'flex',alignItems:'center',justifyContent:'center',color:'#00fff7',boxShadow:'0 0 10px rgba(0,255,247,.2)' }}>
            <IcoMonitor s={14}/>
          </div>
          <span style={{ fontSize:15, fontWeight:800, letterSpacing:'.04em', color:'#e2e8ff' }}>
            Screenshot<span style={{ color:'#00fff7' }}>Mockup</span>
          </span>
          <span className="n-chip" style={{ marginLeft:4 }}>CLIENT-SIDE</span>
        </div>
        <div style={{ flex:1 }}/>
        <button className="n-mode-toggle" onClick={onSwitch}>
          <span style={{ fontSize:9, fontWeight:700, color:'#00fff7', letterSpacing:'.1em', textTransform:'uppercase' }}>FUTURISTIC</span>
          <div style={{ width:34,height:18,borderRadius:9,background:'#00fff7',position:'relative',boxShadow:'0 0 8px rgba(0,255,247,.4)' }}>
            <div style={{ position:'absolute',top:2,right:2,width:14,height:14,borderRadius:'50%',background:'#010108' }}/>
          </div>
          <span style={{ fontSize:9, fontWeight:500, color:'#7a7aaa', letterSpacing:'.1em', textTransform:'uppercase' }}>NORMAL</span>
        </button>
      </div>

      {/* BODY */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', minHeight:'calc(100vh - 54px)' }}>

        {/* LEFT */}
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>

          {/* Hero */}
          {!file && status === 'idle' && (
            <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} style={{ textAlign:'center', paddingTop:12, marginBottom:4 }}>
              <div className="n-chip" style={{ marginBottom:14 }}>◈ 100% CLIENT-SIDE · RETINA OUTPUT</div>
              <h1 style={{ fontSize:'clamp(24px,4vw,52px)', fontWeight:900, lineHeight:.95, letterSpacing:'-.02em', marginBottom:10 }}>
                <span style={{ color:'#e2e8ff' }}>SCREENSHOT</span><br/>
                <span className="holo-txt">DEVICE MOCKUPS</span>
              </h1>
              <p style={{ fontSize:13, color:'#7a7aaa', maxWidth:420, margin:'0 auto', lineHeight:1.75 }}>
                Drop any screenshot. Choose a device frame, background, and style. Download a 2× retina-quality PNG instantly.
              </p>
            </motion.div>
          )}

          {/* Drop zone */}
          {status !== 'generating' && status !== 'done' && (
            <div className={`n-drop ${drag?'over':''} ${file?'has-file':''}`}
              style={{ padding: file?'14px':'40px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', minHeight: file?'auto':240 }}
              onDragOver={e=>{e.preventDefault();setDrag(true)}}
              onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);loadFile(e.dataTransfer.files[0]);}}
              onClick={()=>fileRef.current.click()}>
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>loadFile(e.target.files[0])} />
              {!file ? (
                <>
                  <div style={{ color:'rgba(0,255,247,.3)', marginBottom:16 }}><IcoUpload s={44}/></div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#e2e8ff', marginBottom:6 }}>DROP SCREENSHOT HERE</div>
                  <div style={{ fontSize:9, color:'#7a7aaa', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:18 }}>PNG · JPG · WEBP</div>
                  <button className="n-btn" style={{ pointerEvents:'none' }}><IcoUpload s={12}/> CHOOSE FILE</button>
                </>
              ) : (
                <div style={{ display:'flex', gap:14, alignItems:'center', width:'100%' }}>
                  <img src={fileUrl} alt="preview" style={{ width:72, height:52, objectFit:'cover', border:'1px solid #1e1e42', borderRadius:2, flexShrink:0 }} />
                  <div style={{ flex:1, textAlign:'left', overflow:'hidden' }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'#e2e8ff', marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{file.name}</div>
                    <div style={{ fontSize:9, color:'#7a7aaa', letterSpacing:'.08em' }}>{(file.size/1024).toFixed(0)} KB · Click to change</div>
                  </div>
                  <button onClick={e=>{e.stopPropagation();reset();}} style={{ border:'none',background:'none',cursor:'pointer',color:'#7a7aaa',display:'flex' }}>
                    <IcoClose s={13}/>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Generating */}
          {status === 'generating' && (
            <div className="n-panel n-corner" style={{ flex:1, minHeight:280, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Generating neon={true} />
            </div>
          )}

          {/* Generate button */}
          {file && status === 'idle' && (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
              <button className="n-btn" style={{ width:'100%', justifyContent:'center', padding:'15px', fontSize:12 }} onClick={generate}>
                <IcoZap s={14}/> GENERATE MOCKUP — {DEVICES[device].label.toUpperCase()}
              </button>
            </motion.div>
          )}

          {/* Result */}
          {status === 'done' && result && (
            <ResultView result={result} device={device} onDownload={download} onReset={reset} neon={true} />
          )}

          {/* Error */}
          {status === 'error' && (
            <div style={{ padding:'14px', border:'1px solid rgba(255,0,60,.3)', borderRadius:2, background:'rgba(255,0,60,.05)', textAlign:'center' }}>
              <div style={{ fontSize:11, color:'#ff003c', fontWeight:600, marginBottom:8 }}>◈ RENDER FAILED — try a different image</div>
              <button className="n-ghost" onClick={reset}><IcoReset s={12}/> RESET</button>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ borderLeft:'1px solid #1e1e42', background:'linear-gradient(180deg,rgba(7,7,26,.98),rgba(4,4,15,.99))', padding:'20px 16px', overflowY:'auto' }}>

          <div style={{ fontSize:8, fontWeight:700, color:'rgba(0,255,247,.45)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:14 }}>◈ DEVICE</div>
          <DeviceSelector current={device} onChange={v=>{setDevice(v);}} neon={true} />

          <div style={{ height:1, background:'#1e1e42', margin:'18px 0' }}/>

          <div style={{ fontSize:8, fontWeight:700, color:'rgba(0,255,247,.45)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:12 }}>◈ BACKGROUND</div>
          <BgPicker bgPreset={bgPreset} setBgPreset={setBgPreset} customColor={customColor} setCustomColor={setCustomColor} neon={true} />

          <div style={{ height:1, background:'#1e1e42', margin:'18px 0' }}/>

          <div style={{ fontSize:8, fontWeight:700, color:'rgba(0,255,247,.45)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:12 }}>◈ SHADOW STYLE</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:16 }}>
            {MOCKUP_STYLES.map(s => (
              <button key={s.id} onClick={()=>setMockupStyle(s.id)}
                className={`n-ghost ${mockupStyle===s.id?'active':''}`}
                style={{ justifyContent:'center', padding:'6px 8px', fontSize:9, letterSpacing:'.1em' }}>
                {s.label.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ fontSize:8, fontWeight:700, color:'rgba(0,255,247,.45)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:8 }}>◈ PADDING</div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <input type="range" min="20" max="160" value={padding} onChange={e=>setPadding(+e.target.value)}
              style={{ flex:1, accentColor:'#00fff7', cursor:'pointer' }} />
            <span style={{ fontSize:10, fontWeight:700, color:'#00fff7', width:32, textAlign:'right' }}>{padding}px</span>
          </div>

          <div style={{ height:1, background:'#1e1e42', margin:'0 0 16px' }}/>
          <div style={{ fontSize:8, fontWeight:700, color:'rgba(0,255,247,.45)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:10 }}>◈ USE CASES</div>
          {['App Store previews','Portfolio showcases','Client presentations','Social media posts','Case study slides','Product launches'].map((t,i)=>(
            <div key={i} style={{ display:'flex', gap:8, marginBottom:7 }}>
              <span style={{ color:'rgba(0,255,247,.25)', fontSize:10 }}>◈</span>
              <span style={{ fontSize:10, color:'#7a7aaa' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NORMAL APP
═══════════════════════════════════════════════════════ */
function NormalApp({ onSwitch, mk }) {
  const { file, loadFile, fileUrl, device, setDevice, bgPreset, setBgPreset,
    customColor, setCustomColor, mockupStyle, setMockupStyle,
    status, result, generate, download, reset, padding, setPadding } = mk;
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  return (
    <div className="nm-root" style={{ minHeight:'100vh' }}>

      {/* TOP BAR */}
      <div style={{ background:'#16213e', borderBottom:'1px solid #2d3561', padding:'0 24px',
        display:'flex', alignItems:'center', gap:14, height:54, position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#4f46e5,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff' }}>
            <IcoMonitor s={14}/>
          </div>
          <span style={{ fontSize:15, fontWeight:800, color:'#e2e8f0', letterSpacing:'-.01em' }}>
            Screenshot<span style={{ color:'#6366f1' }}>Mockup</span>
          </span>
          <span style={{ padding:'2px 8px', borderRadius:6, background:'rgba(99,102,241,.12)', border:'1.5px solid rgba(99,102,241,.3)', fontSize:9, fontWeight:700, color:'#818cf8', letterSpacing:'.08em', textTransform:'uppercase' }}>Client-Side</span>
        </div>
        <div style={{ flex:1 }}/>
        <button className="nm-mode-toggle" onClick={onSwitch}>
          <span style={{ fontSize:12, fontWeight:500, color:'#64748b' }}>Normal</span>
          <div style={{ width:34,height:18,borderRadius:9,background:'#2d3561',position:'relative' }}>
            <div style={{ position:'absolute',top:2,left:2,width:14,height:14,borderRadius:'50%',background:'#475569' }}/>
          </div>
          <span style={{ fontSize:12, fontWeight:700, color:'#818cf8' }}>✦ Futuristic</span>
        </button>
      </div>

      {/* BODY */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', minHeight:'calc(100vh - 54px)' }}>

        {/* LEFT */}
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>

          {/* Hero */}
          {!file && status === 'idle' && (
            <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} style={{ textAlign:'center', paddingTop:10, marginBottom:4 }}>
              <div style={{ display:'inline-block', padding:'3px 12px', borderRadius:6, background:'rgba(99,102,241,.12)', border:'1.5px solid rgba(99,102,241,.25)', fontSize:10, fontWeight:700, color:'#818cf8', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14 }}>
                ✦ 100% Client-Side · Retina Output
              </div>
              <h1 style={{ fontSize:'clamp(20px,3.5vw,44px)', fontWeight:900, lineHeight:1.05, letterSpacing:'-.025em', marginBottom:10, color:'#e2e8f0' }}>
                Screenshot<br/>
                <span style={{ background:'linear-gradient(135deg,#4f46e5,#06b6d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  Device Mockups
                </span>
              </h1>
              <p style={{ fontSize:13, color:'#64748b', maxWidth:380, margin:'0 auto', lineHeight:1.8 }}>
                Drop any screenshot, choose a device frame, background, and style. Download a 2× retina PNG instantly.
              </p>
            </motion.div>
          )}

          {/* Drop zone */}
          {status !== 'generating' && status !== 'done' && (
            <div className={`nm-drop ${drag?'over':''} ${file?'has-file':''}`}
              style={{ padding: file?'14px':'40px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', minHeight: file?'auto':220 }}
              onDragOver={e=>{e.preventDefault();setDrag(true)}}
              onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);loadFile(e.dataTransfer.files[0]);}}
              onClick={()=>fileRef.current.click()}>
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>loadFile(e.target.files[0])} />
              {!file ? (
                <>
                  <div style={{ color:'#475569', marginBottom:14 }}><IcoUpload s={40}/></div>
                  <div style={{ fontSize:15, fontWeight:700, color:'#e2e8f0', marginBottom:6 }}>Drop screenshot here</div>
                  <div style={{ fontSize:12, color:'#64748b', marginBottom:18 }}>PNG, JPG, WebP</div>
                  <button className="nm-btn" style={{ pointerEvents:'none' }}><IcoUpload s={14}/> Choose File</button>
                </>
              ) : (
                <div style={{ display:'flex', gap:14, alignItems:'center', width:'100%' }}>
                  <img src={fileUrl} alt="preview" style={{ width:72, height:52, objectFit:'cover', border:'1.5px solid #2d3561', borderRadius:8, flexShrink:0 }} />
                  <div style={{ flex:1, textAlign:'left', overflow:'hidden' }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'#e2e8f0', marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{file.name}</div>
                    <div style={{ fontSize:10, color:'#64748b' }}>{(file.size/1024).toFixed(0)} KB · Click to change</div>
                  </div>
                  <button onClick={e=>{e.stopPropagation();reset();}} style={{ border:'none',background:'none',cursor:'pointer',color:'#64748b',display:'flex' }}>
                    <IcoClose s={14}/>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Generating */}
          {status === 'generating' && (
            <div className="nm-card" style={{ flex:1, minHeight:260, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Generating neon={false} />
            </div>
          )}

          {/* Generate btn */}
          {file && status === 'idle' && (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
              <button className="nm-btn" style={{ width:'100%', justifyContent:'center', padding:'15px', fontSize:14 }} onClick={generate}>
                <IcoZap s={15}/> Generate {DEVICES[device].label} Mockup
              </button>
            </motion.div>
          )}

          {/* Result */}
          {status === 'done' && result && (
            <ResultView result={result} device={device} onDownload={download} onReset={reset} neon={false} />
          )}

          {/* Error */}
          {status === 'error' && (
            <div style={{ padding:'16px', border:'1.5px solid rgba(239,68,68,.3)', borderRadius:12, background:'rgba(239,68,68,.05)', textAlign:'center' }}>
              <div style={{ fontSize:12, color:'#ef4444', fontWeight:700, marginBottom:10 }}>Render failed — try a different image</div>
              <button className="nm-ghost" onClick={reset}><IcoReset s={13}/> Reset</button>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ borderLeft:'1px solid #2d3561', background:'#16213e', padding:'20px 16px', overflowY:'auto' }}>

          <div className="nm-section-label" style={{ marginBottom:14 }}>Device</div>
          <DeviceSelector current={device} onChange={setDevice} neon={false} />

          <div style={{ height:1, background:'#2d3561', margin:'18px 0' }}/>

          <div className="nm-section-label" style={{ marginBottom:12 }}>Background</div>
          <BgPicker bgPreset={bgPreset} setBgPreset={setBgPreset} customColor={customColor} setCustomColor={setCustomColor} neon={false} />

          <div style={{ height:1, background:'#2d3561', margin:'18px 0' }}/>

          <div className="nm-section-label" style={{ marginBottom:12 }}>Shadow Style</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:16 }}>
            {MOCKUP_STYLES.map(s => (
              <button key={s.id} onClick={()=>setMockupStyle(s.id)}
                className={`nm-ghost ${mockupStyle===s.id?'active':''}`}
                style={{ justifyContent:'center', padding:'7px 8px', fontSize:11 }}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="nm-section-label" style={{ marginBottom:8 }}>Padding</div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <input type="range" min="20" max="160" value={padding} onChange={e=>setPadding(+e.target.value)}
              style={{ flex:1, accentColor:'#6366f1', cursor:'pointer' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#6366f1', width:36, textAlign:'right' }}>{padding}px</span>
          </div>

          <div style={{ height:1, background:'#2d3561', margin:'0 0 16px' }}/>
          <div className="nm-section-label" style={{ marginBottom:10 }}>Use Cases</div>
          {['App Store previews','Portfolio showcases','Client presentations','Social media posts','Case study slides','Product launches'].map((t,i)=>(
            <div key={i} style={{ display:'flex', gap:8, marginBottom:7 }}>
              <span style={{ color:'rgba(99,102,241,.4)', fontSize:12 }}>✦</span>
              <span style={{ fontSize:11, color:'#64748b' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════ */
export default function ScreenshotMockup() {
  const [uiMode, setUiMode] = useState('futuristic');
  const mk = useMockup();

  return (
    <>
      <style>{BASE_STYLES}{NEON_STYLES}{NORMAL_STYLES}</style>
      <AnimatePresence mode="wait">
        {uiMode === 'futuristic' ? (
          <motion.div key="neon" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}>
            <NeonApp onSwitch={()=>setUiMode('normal')} mk={mk} />
          </motion.div>
        ) : (
          <motion.div key="normal" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}>
            <NormalApp onSwitch={()=>setUiMode('futuristic')} mk={mk} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}