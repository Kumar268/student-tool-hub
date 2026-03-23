import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════
   BASE STYLES — shared keyframes + utilities
═══════════════════════════════════════════════════════ */
const BASE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { overflow-x: hidden; }

  @keyframes holo { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes scan { 0%{top:-4px} 100%{top:100%} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse-neon { 0%,100%{box-shadow:0 0 8px rgba(0,255,247,.3)} 50%{box-shadow:0 0 20px rgba(0,255,247,.6)} }

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
  .fade-in { animation: fadeIn .3s ease both; }
`;

/* ═══════════════════════════════════════════════════════
   NEON / FUTURISTIC STYLES
═══════════════════════════════════════════════════════ */
const NEON_STYLES = `
  .neon-root {
    --n: #00fff7; --n2: #bf00ff; --am: #ffaa00; --dng: #ff003c; --ok: #00ff88;
    --bg: #010108; --p1: #07071a; --p2: #0b0b22; --p3: #0f0f2a;
    --txt: #e2e8ff; --sub: #7a7aaa; --bdr: #1e1e42;
    font-family: 'Inter', sans-serif;
    background: var(--bg); color: var(--txt);
    min-height: 100vh; display:flex; flex-direction:column;
  }

  /* panel */
  .n-panel {
    background: linear-gradient(135deg,rgba(11,11,34,.98),rgba(4,4,15,1));
    border: 1px solid var(--bdr); border-radius: 3px; position: relative; overflow: hidden;
  }
  .n-panel::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background: repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,247,.005) 3px,rgba(0,255,247,.005) 4px);
  }
  .n-corner::before,.n-corner::after { content:''; position:absolute; width:14px; height:14px; z-index:2; }
  .n-corner::before { top:0; left:0; border-top:1px solid var(--n); border-left:1px solid var(--n); }
  .n-corner::after  { bottom:0; right:0; border-bottom:1px solid var(--n); border-right:1px solid var(--n); }

  /* buttons */
  .n-btn {
    display:inline-flex; align-items:center; gap:7px;
    padding:9px 20px; border:1px solid var(--n); border-radius:2px;
    background:transparent; color:var(--n); cursor:pointer; position:relative; overflow:hidden;
    font-family:'Inter',sans-serif; font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase;
    box-shadow:0 0 14px rgba(0,255,247,.15); transition:all .2s;
  }
  .n-btn::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(0,255,247,.07),transparent); transform:translateX(-100%); transition:transform .35s; }
  .n-btn:hover::after { transform:translateX(100%); }
  .n-btn:hover { background:rgba(0,255,247,.06); box-shadow:0 0 28px rgba(0,255,247,.3); }
  .n-btn:disabled { opacity:.3; cursor:not-allowed; }

  .n-btn-ghost {
    display:inline-flex; align-items:center; gap:6px;
    padding:8px 14px; border:1px solid var(--bdr); border-radius:2px;
    background:transparent; color:var(--sub); cursor:pointer;
    font-family:'Inter',sans-serif; font-size:10px; font-weight:500; letter-spacing:.08em; transition:all .18s;
  }
  .n-btn-ghost:hover { border-color:var(--n); color:var(--n); background:rgba(0,255,247,.04); }
  .n-btn-ghost.active { border-color:var(--n); color:var(--n); background:rgba(0,255,247,.06); box-shadow:0 0 10px rgba(0,255,247,.15); }
  .n-btn-ghost:disabled { opacity:.3; cursor:not-allowed; }

  .n-icon-btn {
    width:34px; height:34px; border:1px solid var(--bdr); border-radius:2px; display:flex; align-items:center; justify-content:center;
    background:transparent; color:var(--sub); cursor:pointer; transition:all .18s; flex-shrink:0;
  }
  .n-icon-btn:hover { border-color:var(--n); color:var(--n); background:rgba(0,255,247,.05); box-shadow:0 0 10px rgba(0,255,247,.15); }
  .n-icon-btn.active { border-color:var(--n); color:var(--n); background:rgba(0,255,247,.08); }

  /* sliders */
  input[type=range].n-slider { -webkit-appearance:none; width:100%; height:2px; outline:none; cursor:pointer; border-radius:0; }
  input[type=range].n-slider::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:var(--bg); border:2px solid var(--n); box-shadow:0 0 8px var(--n); cursor:pointer; transition:transform .15s; }
  input[type=range].n-slider::-webkit-slider-thumb:hover { transform:scale(1.3); }

  /* inputs */
  .n-input {
    background:rgba(0,0,0,.4); border:1px solid var(--bdr); border-radius:2px;
    color:var(--txt); font-family:'Inter',sans-serif; font-size:12px; padding:7px 10px;
    outline:none; transition:border-color .2s; width:100%;
  }
  .n-input:focus { border-color:var(--n); box-shadow:0 0 8px rgba(0,255,247,.15); }

  /* chip */
  .n-chip { display:inline-block; padding:2px 10px; border:1px solid rgba(0,255,247,.25); border-radius:2px; font-size:8px; font-weight:700; letter-spacing:.14em; color:rgba(0,255,247,.6); text-transform:uppercase; }

  /* mode toggle */
  .n-mode-toggle { display:flex; align-items:center; gap:10px; padding:6px 12px; border:1px solid rgba(0,255,247,.25); border-radius:2px; background:rgba(0,255,247,.03); cursor:pointer; transition:all .2s; }
  .n-mode-toggle:hover { border-color:var(--n); box-shadow:0 0 12px rgba(0,255,247,.12); }

  /* toolbar */
  .n-toolbar { background:rgba(1,1,8,.95); border-bottom:1px solid var(--bdr); padding:0 20px; display:flex; align-items:center; gap:16px; height:52px; position:sticky; top:0; z-index:50; backdrop-filter:blur(10px); }

  /* sidebar */
  .n-sidebar { background:linear-gradient(180deg,rgba(7,7,26,.98),rgba(4,4,15,.99)); border-right:1px solid var(--bdr); width:260px; flex-shrink:0; overflow-y:auto; position:relative; }
  .n-sidebar-right { border-right:none; border-left:1px solid var(--bdr); }
  .n-sidebar::-webkit-scrollbar { width:2px; }
  .n-sidebar::-webkit-scrollbar-thumb { background:var(--n); }

  /* section heading in sidebar */
  .n-sec { padding:12px 16px 6px; }
  .n-sec-label { font-size:8px; font-weight:700; color:rgba(0,255,247,.45); letter-spacing:.2em; text-transform:uppercase; margin-bottom:10px; }

  /* canvas area */
  .n-canvas-wrap { flex:1; display:flex; align-items:center; justify-content:center; background:var(--bg); position:relative; overflow:hidden; min-height:0; }
  .n-canvas-wrap::before { content:''; position:absolute; inset:0; background:repeating-linear-gradient(0deg,transparent,transparent 47px,rgba(0,255,247,.03) 47px,rgba(0,255,247,.03) 48px),repeating-linear-gradient(90deg,transparent,transparent 47px,rgba(0,255,247,.03) 47px,rgba(0,255,247,.03) 48px); pointer-events:none; }

  /* filter tab active */
  .n-tab { padding:7px 14px; border:none; background:transparent; color:var(--sub); cursor:pointer; font-family:'Inter',sans-serif; font-size:10px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; border-bottom:2px solid transparent; transition:all .15s; white-space:nowrap; }
  .n-tab.active { color:var(--n); border-bottom-color:var(--n); }

  /* history item */
  .n-hist { padding:7px 12px; font-size:10px; color:var(--sub); cursor:pointer; border-left:2px solid transparent; transition:all .15s; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .n-hist:hover { color:var(--txt); border-left-color:var(--bdr); }
  .n-hist.active { color:var(--n); border-left-color:var(--n); background:rgba(0,255,247,.04); }

  /* color swatch */
  .n-swatch { width:24px; height:24px; border-radius:2px; cursor:pointer; border:1px solid var(--bdr); transition:all .15s; flex-shrink:0; }
  .n-swatch:hover,.n-swatch.active { border-color:var(--n); box-shadow:0 0 8px rgba(0,255,247,.3); transform:scale(1.1); }

  /* crop handle */
  .n-crop-handle { position:absolute; width:10px; height:10px; border-color:var(--n); border-style:solid; cursor:pointer; }
`;

/* ═══════════════════════════════════════════════════════
   NORMAL DARK STYLES
═══════════════════════════════════════════════════════ */
const NORMAL_STYLES = `
  .nm-root {
    font-family: 'Inter', sans-serif;
    background: #1a1a2e; color: #e2e8f0;
    min-height: 100vh; display:flex; flex-direction:column;
  }

  .nm-toolbar { background:#16213e; border-bottom:1px solid #2d3561; padding:0 20px; display:flex; align-items:center; gap:14px; height:52px; position:sticky; top:0; z-index:50; }

  .nm-sidebar { background:#16213e; border-right:1px solid #2d3561; width:260px; flex-shrink:0; overflow-y:auto; }
  .nm-sidebar-right { border-right:none; border-left:1px solid #2d3561; }
  .nm-sidebar::-webkit-scrollbar { width:3px; }
  .nm-sidebar::-webkit-scrollbar-thumb { background:#6366f1; border-radius:999px; }

  .nm-sec { padding:14px 16px 8px; }
  .nm-sec-label { font-size:9px; font-weight:700; color:#6366f1; letter-spacing:.14em; text-transform:uppercase; margin-bottom:10px; }

  .nm-canvas-wrap { flex:1; display:flex; align-items:center; justify-content:center; background:#0f0f23; position:relative; overflow:hidden; min-height:0; }
  .nm-canvas-wrap::before { content:''; position:absolute; inset:0; background:repeating-linear-gradient(0deg,transparent,transparent 47px,rgba(99,102,241,.04) 47px,rgba(99,102,241,.04) 48px),repeating-linear-gradient(90deg,transparent,transparent 47px,rgba(99,102,241,.04) 47px,rgba(99,102,241,.04) 48px); pointer-events:none; }

  .nm-btn { display:inline-flex; align-items:center; gap:7px; padding:9px 20px; border-radius:8px; border:none; cursor:pointer; background:linear-gradient(135deg,#4f46e5,#06b6d4); color:#fff; font-family:'Inter',sans-serif; font-size:12px; font-weight:600; box-shadow:0 3px 12px rgba(79,70,229,.4); transition:all .2s; }
  .nm-btn:hover { box-shadow:0 6px 20px rgba(79,70,229,.5); transform:translateY(-1px); }
  .nm-btn:disabled { opacity:.3; cursor:not-allowed; transform:none; }

  .nm-btn-ghost { display:inline-flex; align-items:center; gap:6px; padding:7px 14px; border-radius:8px; border:1.5px solid #2d3561; cursor:pointer; background:transparent; color:#64748b; font-family:'Inter',sans-serif; font-size:11px; font-weight:500; transition:all .15s; }
  .nm-btn-ghost:hover { border-color:#6366f1; color:#818cf8; background:rgba(99,102,241,.08); }
  .nm-btn-ghost.active { border-color:#6366f1; color:#818cf8; background:rgba(99,102,241,.12); }
  .nm-btn-ghost:disabled { opacity:.3; cursor:not-allowed; }

  .nm-icon-btn { width:34px; height:34px; border-radius:8px; border:1.5px solid #2d3561; display:flex; align-items:center; justify-content:center; background:transparent; color:#64748b; cursor:pointer; transition:all .15s; flex-shrink:0; }
  .nm-icon-btn:hover { border-color:#6366f1; color:#818cf8; background:rgba(99,102,241,.1); }
  .nm-icon-btn.active { border-color:#6366f1; color:#818cf8; background:rgba(99,102,241,.15); }

  input[type=range].nm-slider { -webkit-appearance:none; width:100%; height:4px; background:#2d3561; outline:none; cursor:pointer; border-radius:999px; }
  input[type=range].nm-slider::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.25); cursor:pointer; transition:transform .15s; }
  input[type=range].nm-slider::-webkit-slider-thumb:hover { transform:scale(1.2); }

  .nm-input { background:#0f0f23; border:1.5px solid #2d3561; border-radius:8px; color:#e2e8f0; font-family:'Inter',sans-serif; font-size:13px; padding:8px 12px; outline:none; transition:border-color .15s; width:100%; }
  .nm-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.15); }

  .nm-tab { padding:8px 16px; border:none; background:transparent; color:#64748b; cursor:pointer; font-family:'Inter',sans-serif; font-size:11px; font-weight:600; border-bottom:2px solid transparent; transition:all .15s; white-space:nowrap; }
  .nm-tab.active { color:#818cf8; border-bottom-color:#6366f1; }

  .nm-hist { padding:8px 14px; font-size:11px; color:#64748b; cursor:pointer; border-left:2px solid transparent; transition:all .15s; }
  .nm-hist:hover { color:#e2e8f0; border-left-color:#2d3561; }
  .nm-hist.active { color:#818cf8; border-left-color:#6366f1; background:rgba(99,102,241,.06); }

  .nm-swatch { width:26px; height:26px; border-radius:6px; cursor:pointer; border:1.5px solid #2d3561; transition:all .15s; flex-shrink:0; }
  .nm-swatch:hover,.nm-swatch.active { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.2); transform:scale(1.1); }

  .nm-mode-toggle { display:flex; align-items:center; gap:10px; padding:7px 14px; border-radius:9px; border:1.5px solid #2d3561; background:#0f0f23; cursor:pointer; transition:all .2s; }
  .nm-mode-toggle:hover { border-color:#6366f1; }

  .nm-section-label { font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#6366f1; }

  .nm-card { background:#16213e; border:1px solid #2d3561; border-radius:12px; }
`;

/* ═══════════════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════════════ */
const Ic = ({ d, s=16, sw=1.8, fill='none' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {Array.isArray(d) ? d.map((p,i)=><path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const IcoUpload   = ({s=20}) => <Ic s={s} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const IcoDl       = ({s=16}) => <Ic s={s} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />;
const IcoUndo     = ({s=16}) => <Ic s={s} d="M3 7v6h6M3.51 15a9 9 0 1 0 .49-4.06" />;
const IcoRedo     = ({s=16}) => <Ic s={s} d="M21 7v6h-6M20.49 15a9 9 0 1 1-.49-4.06" />;
const IcoCrop     = ({s=16}) => <Ic s={s} d="M6 2v14a2 2 0 0 0 2 2h14M18 22V8a2 2 0 0 0-2-2H2" />;
const IcoRotate   = ({s=16}) => <Ic s={s} d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />;
const IcoFlipH    = ({s=16}) => <Ic s={s} d={["M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3","M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3","M12 20v2","M12 14v2","M12 8v2","M12 2v2"]} />;
const IcoText     = ({s=16}) => <Ic s={s} d={["M4 7V4h16v3","M9 20h6","M12 4v16"]} />;
const IcoFilter   = ({s=16}) => <Ic s={s} d="M22 3H2l8 9.46V19l4 2v-8.54L22 3" />;
const IcoSun      = ({s=16}) => <Ic s={s} d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-14v2m0 14v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />;
const IcoContrast = ({s=16}) => <Ic s={s} d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm0-18v16" />;
const IcoZap      = ({s=16}) => <Ic s={s} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
const IcoReset    = ({s=16}) => <Ic s={s} d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />;
const IcoResize   = ({s=16}) => <Ic s={s} d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />;
const IcoSave     = ({s=16}) => <Ic s={s} d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8" />;
const IcoClose    = ({s=14}) => <Ic s={s} d="M18 6 6 18M6 6l12 12" />;
const IcoPlus     = ({s=14}) => <Ic s={s} d="M12 5v14M5 12h14" />;
const IcoEye      = ({s=14}) => <Ic s={s} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />;
const IcoMode     = ({s=15}) => <Ic s={s} d="M12 3v1m0 16v1M4.22 4.22l.7.7m13.76 13.76.7.7M1 12h1m20 0h1M4.22 19.78l.7-.7M18.76 5.64l.7-.7" />;

/* ═══════════════════════════════════════════════════════
   EDITOR CORE LOGIC
═══════════════════════════════════════════════════════ */
const DEFAULT_ADJUSTMENTS = {
  brightness: 100, contrast: 100, saturation: 100,
  hue: 0, blur: 0, sharpen: 0,
  temperature: 0, vignette: 0, noise: 0,
  grayscale: false, sepia: false, invert: false,
};

const FILTERS = [
  { name:'None',       adj:{} },
  { name:'Vivid',      adj:{ brightness:110, contrast:115, saturation:140 } },
  { name:'Matte',      adj:{ brightness:105, contrast:90,  saturation:70  } },
  { name:'Chrome',     adj:{ brightness:108, contrast:125, saturation:120 } },
  { name:'Fade',       adj:{ brightness:115, contrast:85,  saturation:60  } },
  { name:'Drama',      adj:{ brightness:95,  contrast:140, saturation:80  } },
  { name:'Warm',       adj:{ temperature:40, saturation:110 } },
  { name:'Cool',       adj:{ temperature:-40, saturation:105 } },
  { name:'B&W',        adj:{ grayscale:true } },
  { name:'Sepia',      adj:{ sepia:true } },
  { name:'Invert',     adj:{ invert:true } },
  { name:'Dreamy',     adj:{ brightness:108, blur:1.5, saturation:120, temperature:20 } },
];

function applyAdjustments(canvas, src, adj) {
  if (!src || !canvas) return;
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  // build CSS filter string
  let filters = [];
  filters.push(`brightness(${adj.brightness ?? 100}%)`);
  filters.push(`contrast(${adj.contrast ?? 100}%)`);
  filters.push(`saturate(${adj.saturation ?? 100}%)`);
  filters.push(`hue-rotate(${adj.hue ?? 0}deg)`);
  if (adj.blur) filters.push(`blur(${adj.blur}px)`);
  if (adj.grayscale) filters.push('grayscale(100%)');
  if (adj.sepia) filters.push('sepia(100%)');
  if (adj.invert) filters.push('invert(100%)');

  // temperature as hue + saturation shift
  if (adj.temperature) {
    if (adj.temperature > 0) filters.push(`sepia(${adj.temperature * 0.5}%)`);
    else filters.push(`hue-rotate(${adj.temperature * 0.5}deg)`);
  }

  ctx.filter = filters.join(' ');
  ctx.drawImage(src, 0, 0, width, height);
  ctx.filter = 'none';

  // vignette overlay
  if (adj.vignette > 0) {
    const grd = ctx.createRadialGradient(width/2, height/2, Math.min(width,height)*0.3, width/2, height/2, Math.max(width,height)*0.8);
    grd.addColorStop(0, 'rgba(0,0,0,0)');
    grd.addColorStop(1, `rgba(0,0,0,${adj.vignette/100})`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);
  }

  // sharpen (unsharp mask)
  if (adj.sharpen > 0) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const amount = adj.sharpen / 100;
    const kernel = [0,-amount*0.5,0,-amount*0.5,1+amount*2,-amount*0.5,0,-amount*0.5,0];
    const res = new Uint8ClampedArray(data.length);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let s = 0;
          for (let ky = -1; ky <= 1; ky++) for (let kx = -1; kx <= 1; kx++)
            s += data[((y+ky)*width+(x+kx))*4+c] * kernel[(ky+1)*3+(kx+1)];
          res[(y*width+x)*4+c] = Math.min(255,Math.max(0,s));
        }
        res[(y*width+x)*4+3] = data[(y*width+x)*4+3];
      }
    }
    ctx.putImageData(new ImageData(res, width, height), 0, 0);
  }
}

function useEditor() {
  const [image, setImage] = useState(null);          // HTMLImageElement
  const [adjustments, setAdjustments] = useState(DEFAULT_ADJUSTMENTS);
  const [history, setHistory] = useState([{ label:'Original', adj:{...DEFAULT_ADJUSTMENTS} }]);
  const [histIdx, setHistIdx] = useState(0);
  const [textLayers, setTextLayers] = useState([]);
  const [activeText, setActiveText] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [resizeW, setResizeW] = useState('');
  const [resizeH, setResizeH] = useState('');
  const [aspectLock, setAspectLock] = useState(true);
  const canvasRef = useRef(null);
  const offscreenRef = useRef(null);

  const pushHistory = useCallback((label, adj) => {
    setHistory(h => {
      const next = [...h.slice(0, histIdx + 1), { label, adj:{...adj} }];
      return next.slice(-20); // max 20
    });
    setHistIdx(h => Math.min(h + 1, 19));
  }, [histIdx]);

  const setAdj = useCallback((key, val) => {
    setAdjustments(a => ({ ...a, [key]: val }));
  }, []);

  const applyFilter = useCallback((filter) => {
    const next = { ...DEFAULT_ADJUSTMENTS, ...filter.adj };
    setAdjustments(next);
    pushHistory(`Filter: ${filter.name}`, next);
  }, [pushHistory]);

  const undo = useCallback(() => {
    if (histIdx > 0) {
      const prev = history[histIdx - 1];
      setAdjustments({...prev.adj});
      setHistIdx(i => i - 1);
    }
  }, [history, histIdx]);

  const redo = useCallback(() => {
    if (histIdx < history.length - 1) {
      const next = history[histIdx + 1];
      setAdjustments({...next.adj});
      setHistIdx(i => i + 1);
    }
  }, [history, histIdx]);

  const resetAll = useCallback(() => {
    setAdjustments({...DEFAULT_ADJUSTMENTS});
    setRotation(0); setFlipH(false); setFlipV(false);
    pushHistory('Reset', DEFAULT_ADJUSTMENTS);
  }, [pushHistory]);

  const loadImage = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setResizeW(String(img.naturalWidth));
      setResizeH(String(img.naturalHeight));
      setAdjustments({...DEFAULT_ADJUSTMENTS});
      setHistory([{ label:'Original', adj:{...DEFAULT_ADJUSTMENTS} }]);
      setHistIdx(0);
      setTextLayers([]);
      setZoom(1); setRotation(0); setFlipH(false); setFlipV(false);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  // Render to canvas whenever image/adjustments/rotation/flip change
  useEffect(() => {
    if (!canvasRef.current || !image) return;
    const canvas = canvasRef.current;

    // compute canvas size accounting for rotation
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad)), sin = Math.abs(Math.sin(rad));
    const w = Math.round(image.naturalWidth * cos + image.naturalHeight * sin);
    const h = Math.round(image.naturalWidth * sin + image.naturalHeight * cos);
    canvas.width = w; canvas.height = h;

    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.translate(w/2, h/2);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    // draw to offscreen first for filter apply
    const off = document.createElement('canvas');
    off.width = image.naturalWidth; off.height = image.naturalHeight;
    applyAdjustments(off, image, adjustments);

    ctx.drawImage(off, -image.naturalWidth/2, -image.naturalHeight/2);
    ctx.restore();

    // draw text layers
    textLayers.forEach(t => {
      ctx.save();
      ctx.font = `${t.bold?'bold':''} ${t.italic?'italic':''} ${t.size}px Inter, sans-serif`.trim();
      ctx.fillStyle = t.color;
      ctx.globalAlpha = t.opacity / 100;
      ctx.textBaseline = 'top';
      if (t.shadow) { ctx.shadowColor='rgba(0,0,0,.6)'; ctx.shadowBlur=6; }
      ctx.fillText(t.text, t.x, t.y);
      ctx.restore();
    });
  }, [image, adjustments, rotation, flipH, flipV, textLayers]);

  const downloadImage = useCallback((format='png', quality=0.92) => {
    if (!canvasRef.current) return;
    const mime = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
    const url = canvasRef.current.toDataURL(mime, quality);
    const a = document.createElement('a'); a.href = url;
    a.download = `edited.${format === 'jpeg' ? 'jpg' : format}`;
    a.click();
  }, []);

  const applyResize = useCallback(() => {
    if (!canvasRef.current || !resizeW || !resizeH) return;
    const img = canvasRef.current;
    const off = document.createElement('canvas');
    off.width = parseInt(resizeW); off.height = parseInt(resizeH);
    off.getContext('2d').drawImage(img, 0, 0, off.width, off.height);
    const newImg = new Image();
    newImg.onload = () => { setImage(newImg); setResizeW(String(off.width)); setResizeH(String(off.height)); };
    newImg.src = off.toDataURL();
  }, [resizeW, resizeH]);

  return {
    image, loadImage, adjustments, setAdj, applyFilter,
    undo, redo, canUndo: histIdx > 0, canRedo: histIdx < history.length - 1,
    history, histIdx,
    resetAll, zoom, setZoom, rotation, setRotation, flipH, setFlipH, flipV, setFlipV,
    textLayers, setTextLayers, activeText, setActiveText,
    resizeW, setResizeW, resizeH, setResizeH, aspectLock, setAspectLock, applyResize,
    canvasRef, downloadImage, pushHistory,
  };
}

/* ═══════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════ */
function AdjSlider({ label, val, min, max, step=1, onChange, neon, unit='', color }) {
  const pct = ((val - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
        <span style={{ fontSize:10, fontWeight:600, color: neon ? '#7a7aaa' : '#64748b', letterSpacing:'.06em', textTransform:'uppercase' }}>{label}</span>
        <span style={{ fontSize:11, fontWeight:700, color: neon ? (color||'#00fff7') : (color||'#6366f1') }}>{val}{unit}</span>
      </div>
      <div style={{ position:'relative' }}>
        {neon && <div style={{ position:'absolute', top:'50%', transform:'translateY(-50%)', left:0, width:`${pct}%`, height:2, background:`linear-gradient(90deg,#bf00ff,${color||'#00fff7'})`, pointerEvents:'none', zIndex:1 }} />}
        <input type="range" className={neon?'n-slider':'nm-slider'} min={min} max={max} step={step} value={val}
          onChange={e => onChange(Number(e.target.value))}
          style={neon ? { background:`linear-gradient(90deg,rgba(191,0,255,.3) ${pct}%,rgba(0,255,247,.1) ${pct}%)` } : {}} />
      </div>
    </div>
  );
}

function ToggleRow({ label, val, onChange, neon }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10, padding:'6px 0' }}>
      <span style={{ fontSize:11, fontWeight:500, color: neon?'#7a7aaa':'#64748b' }}>{label}</span>
      <div onClick={() => onChange(!val)} style={{ width:34, height:18, borderRadius:9,
        background: val ? (neon?'#00fff7':'#6366f1') : (neon?'#1e1e42':'#2d3561'),
        position:'relative', cursor:'pointer', transition:'background .2s',
        boxShadow: val ? (neon?'0 0 8px rgba(0,255,247,.4)':'none') : 'none' }}>
        <div style={{ position:'absolute', top:3, left: val?17:3, width:12, height:12, borderRadius:'50%',
          background: val ? (neon?'#010108':'#fff') : (neon?'#7a7aaa':'#475569'),
          transition:'left .2s' }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DROP ZONE / IMAGE PICKER
═══════════════════════════════════════════════════════ */
function DropZone({ onLoad, neon }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef();

  const handle = (file) => { if (file) onLoad(file); };

  return (
    <div style={{ display:'flex', flex:1, alignItems:'center', justifyContent:'center', padding:20 }}>
      <motion.div
        initial={{opacity:0, scale:.95}} animate={{opacity:1, scale:1}} transition={{duration:.4}}
        onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault();setDrag(false);handle(e.dataTransfer.files[0]);}}
        onClick={()=>ref.current.click()}
        style={{ width:'100%', maxWidth:480, padding:'56px 32px', textAlign:'center', cursor:'pointer',
          border: neon ? `2px dashed rgba(0,255,247,${drag?.5:.2})` : `2px dashed ${drag?'#6366f1':'#2d3561'}`,
          borderRadius: neon?2:16,
          background: neon ? `rgba(0,255,247,${drag?.04:.01})` : `rgba(99,102,241,${drag?.06:.02})`,
          boxShadow: drag ? (neon?'0 0 30px rgba(0,255,247,.12)':'0 0 0 4px rgba(99,102,241,.12)') : 'none',
          transition:'all .2s' }}>
        <input ref={ref} type="file" accept="image/*" style={{display:'none'}} onChange={e=>handle(e.target.files[0])} />
        <div style={{ marginBottom:16, color: neon?'rgba(0,255,247,.4)':'#475569' }}>
          <IcoUpload s={48} />
        </div>
        {neon ? (
          <>
            <div style={{ fontSize:14, fontWeight:700, color:'#e2e8ff', letterSpacing:'.04em', marginBottom:8 }}>DROP IMAGE TO EDIT</div>
            <div style={{ fontSize:10, color:'#7a7aaa', letterSpacing:'.1em', textTransform:'uppercase' }}>JPG · PNG · WEBP · AVIF · GIF</div>
            <div style={{ marginTop:20 }}>
              <span className="n-chip">◈ ZERO UPLOAD · 100% PRIVATE</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize:16, fontWeight:700, color:'#e2e8f0', marginBottom:8 }}>Drop an image to edit</div>
            <div style={{ fontSize:12, color:'#64748b' }}>JPG, PNG, WebP, AVIF, GIF</div>
            <div style={{ marginTop:20, display:'inline-block', padding:'4px 14px', border:'1.5px solid #2d3561', borderRadius:8, fontSize:11, fontWeight:600, color:'#475569' }}>Zero upload · 100% private</div>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   FILTERS PANEL (thumbnails)
═══════════════════════════════════════════════════════ */
function FiltersPanel({ image, onApply, currentAdj, neon }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
      {FILTERS.map(f => {
        const isActive = JSON.stringify({...DEFAULT_ADJUSTMENTS,...f.adj}) === JSON.stringify({...DEFAULT_ADJUSTMENTS,...currentAdj});
        return (
          <button key={f.name} onClick={() => onApply(f)}
            style={{ padding:'8px 6px', border: neon ? `1px solid ${isActive?'#00fff7':'#1e1e42'}` : `1.5px solid ${isActive?'#6366f1':'#2d3561'}`,
              borderRadius: neon?2:8, background: isActive ? (neon?'rgba(0,255,247,.08)':'rgba(99,102,241,.12)') : 'transparent',
              cursor:'pointer', textAlign:'center', transition:'all .15s',
              color: isActive ? (neon?'#00fff7':'#818cf8') : (neon?'#7a7aaa':'#64748b'),
              fontSize:10, fontWeight:600, letterSpacing:'.04em',
              boxShadow: isActive && neon ? '0 0 10px rgba(0,255,247,.2)' : 'none' }}>
            {f.name}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   TEXT LAYER EDITOR
═══════════════════════════════════════════════════════ */
const TEXT_COLORS = ['#ffffff','#000000','#00fff7','#bf00ff','#ffaa00','#ff003c','#00ff88','#ff6b6b','#4ecdc4','#f7dc6f'];
const NM_TEXT_COLORS = ['#ffffff','#000000','#6366f1','#06b6d4','#f59e0b','#ef4444','#10b981','#ec4899','#8b5cf6','#f97316'];

function TextPanel({ layers, setLayers, neon }) {
  const [text, setText] = useState('');
  const [size, setSize] = useState(32);
  const [color, setColor] = useState(neon ? '#00fff7' : '#ffffff');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [opacity, setOpacity] = useState(100);

  const addText = () => {
    if (!text.trim()) return;
    setLayers(l => [...l, { id:Date.now(), text, size, color, bold, italic, shadow, opacity, x:60, y:60 }]);
    setText('');
  };

  const colors = neon ? TEXT_COLORS : NM_TEXT_COLORS;

  return (
    <div>
      <input className={neon?'n-input':'nm-input'} placeholder="Enter text..." value={text}
        onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addText()}
        style={{ marginBottom:10 }} />

      <div style={{ display:'flex', gap:6, marginBottom:10, flexWrap:'wrap' }}>
        {colors.map(c => (
          <div 
            key={c} 
            onClick={()=>setColor(c)}
            data-active={color===c||undefined}
            className={`${neon?'n-swatch':'nm-swatch'} ${color===c?'active':''}`}
            style={{ background:c }} 
          />
        ))}
      </div>

      <AdjSlider label="Size" val={size} min={10} max={120} onChange={setSize} neon={neon} unit="px" />
      <AdjSlider label="Opacity" val={opacity} min={10} max={100} onChange={setOpacity} neon={neon} unit="%" />

      <div style={{ display:'flex', gap:8, marginBottom:12 }}>
        <button onClick={()=>setBold(!bold)} className={`${neon?'n-btn-ghost':'nm-btn-ghost'} ${bold?'active':''}`} style={{ flex:1 }}>
          <strong>B</strong> Bold
        </button>
        <button onClick={()=>setItalic(!italic)} className={`${neon?'n-btn-ghost':'nm-btn-ghost'} ${italic?'active':''}`} style={{ flex:1 }}>
          <em>I</em> Italic
        </button>
        <button onClick={()=>setShadow(!shadow)} className={`${neon?'n-btn-ghost':'nm-btn-ghost'} ${shadow?'active':''}`} style={{ flex:1 }}>
          Shad.
        </button>
      </div>

      <button onClick={addText} className={neon?'n-btn':'nm-btn'} style={{ width:'100%', justifyContent:'center', marginBottom:14 }}>
        <IcoPlus s={13} /> ADD TEXT LAYER
      </button>

      {layers.length > 0 && (
        <div style={{ marginTop:4 }}>
          <div style={{ fontSize:9, fontWeight:700, color: neon?'rgba(0,255,247,.4)':'#475569', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>LAYERS</div>
          {layers.map((t,i) => (
            <div key={t.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 8px',
              border: neon?`1px solid #1e1e42`:`1.5px solid #2d3561`, borderRadius: neon?2:6, marginBottom:6,
              background: neon?'rgba(0,0,0,.3)':'rgba(15,15,35,.5)' }}>
              <span style={{ fontSize:11, color: neon?'#e2e8ff':'#e2e8f0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:140 }}>{t.text}</span>
              <button onClick={()=>setLayers(l=>l.filter((_,j)=>j!==i))}
                style={{ border:'none', background:'none', color: neon?'#7a7aaa':'#64748b', cursor:'pointer', padding:2, display:'flex' }}>
                <IcoClose s={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {layers.length > 0 && (
        <div style={{ marginTop:8, padding:'10px', border: neon?'1px solid rgba(0,255,247,.15)':'1px solid #2d3561',
          borderRadius: neon?2:8, background: neon?'rgba(0,255,247,.03)':'rgba(99,102,241,.05)',
          fontSize:10, color: neon?'rgba(0,255,247,.5)':'#6366f1', textAlign:'center' }}>
          {neon ? '◈ TEXT POSITIONS SET ON CANVAS' : '✦ Text layers applied to canvas'}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EDITOR UI (neon)
═══════════════════════════════════════════════════════ */
function EditorNeon({ onSwitch, editor }) {
  const {
    image, loadImage, adjustments, setAdj, applyFilter,
    undo, redo, canUndo, canRedo, history, histIdx,
    resetAll, zoom, setZoom, rotation, setRotation, flipH, setFlipH, flipV, setFlipV,
    textLayers, setTextLayers, resizeW, setResizeW, resizeH, setResizeH,
    aspectLock, setAspectLock, applyResize, canvasRef, downloadImage, pushHistory,
  } = editor;

  const [tab, setTab] = useState('adjust');
  const [dlFormat, setDlFormat] = useState('png');
  const [dlQuality, setDlQuality] = useState(92);
  const shouldReduceMotion = useReducedMotion();

  const tabs = [
    { id:'adjust', label:'ADJUST', icon:<IcoSun s={13}/> },
    { id:'filters', label:'FILTERS', icon:<IcoFilter s={13}/> },
    { id:'transform', label:'TRANSFORM', icon:<IcoRotate s={13}/> },
    { id:'text', label:'TEXT', icon:<IcoText s={13}/> },
    { id:'export', label:'EXPORT', icon:<IcoDl s={13}/> },
  ];

  return (
    <div className="neon-root" style={{ height:'100vh' }}>
      <div className="scan-line" />

      {/* TOOLBAR */}
      <div className="n-toolbar">
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginRight:8 }}>
          <div style={{ width:28,height:28,border:'1px solid rgba(0,255,247,.4)',display:'flex',alignItems:'center',justifyContent:'center',color:'#00fff7',boxShadow:'0 0 10px rgba(0,255,247,.2)' }}>
            <IcoZap s={13}/>
          </div>
          <span style={{ fontSize:14, fontWeight:800, letterSpacing:'.04em', color:'#e2e8ff', whiteSpace:'nowrap' }}>
            Edit<span style={{ color:'#00fff7' }}>Pro</span>
          </span>
        </div>

        <div style={{ width:1, height:28, background:'#1e1e42', margin:'0 4px' }} />

        {/* Undo / Redo / Reset */}
        <button className="n-icon-btn" onClick={undo} disabled={!canUndo} title="Undo"><IcoUndo s={14}/></button>
        <button className="n-icon-btn" onClick={redo} disabled={!canRedo} title="Redo"><IcoRedo s={14}/></button>
        <button className="n-icon-btn" onClick={resetAll} title="Reset all"><IcoReset s={14}/></button>

        <div style={{ width:1, height:28, background:'#1e1e42', margin:'0 4px' }} />

        {/* Zoom */}
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <button className="n-icon-btn" onClick={()=>setZoom(z=>Math.max(.1,+(z-.1).toFixed(1)))} style={{ width:26,height:26,fontSize:14 }}>−</button>
          <span style={{ fontSize:10, fontWeight:700, color:'#00fff7', letterSpacing:'.1em', minWidth:36, textAlign:'center' }}>{Math.round(zoom*100)}%</span>
          <button className="n-icon-btn" onClick={()=>setZoom(z=>Math.min(5,+(z+.1).toFixed(1)))} style={{ width:26,height:26,fontSize:14 }}>+</button>
          <button className="n-icon-btn" onClick={()=>setZoom(1)} style={{ width:26,height:26,fontSize:9,color:'#7a7aaa' }}>FIT</button>
        </div>

        <div style={{ flex:1 }}/>

        {/* Image info */}
        {image && <span style={{ fontSize:9, color:'#7a7aaa', letterSpacing:'.1em', whiteSpace:'nowrap' }}>
          {image.naturalWidth} × {image.naturalHeight}px
        </span>}

        {/* Mode toggle */}
        <button className="n-mode-toggle" onClick={onSwitch}>
          <span style={{ fontSize:9, fontWeight:600, color:'#00fff7', letterSpacing:'.1em', textTransform:'uppercase' }}>FUTURISTIC</span>
          <div style={{ width:34,height:18,borderRadius:9,background:'#00fff7',position:'relative',boxShadow:'0 0 8px rgba(0,255,247,.4)' }}>
            <div style={{ position:'absolute',top:2,right:2,width:14,height:14,borderRadius:'50%',background:'#010108' }}/>
          </div>
          <span style={{ fontSize:9, fontWeight:500, color:'#7a7aaa', letterSpacing:'.1em', textTransform:'uppercase' }}>NORMAL</span>
        </button>
      </div>

      {/* BODY */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* LEFT SIDEBAR — tabs */}
        <div className="n-sidebar" style={{ width:220 }}>
          {/* Tabs */}
          <div style={{ display:'flex', borderBottom:'1px solid #1e1e42', overflow:'auto' }}>
            {tabs.map(t => (
              <button key={t.id} className={`n-tab ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ padding:'14px 14px' }}>

            {/* ADJUST */}
            {tab === 'adjust' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.2}}>
                <AdjSlider label="Brightness" val={adjustments.brightness} min={0} max={200} onChange={v=>setAdj('brightness',v)} neon={true} unit="%" />
                <AdjSlider label="Contrast"   val={adjustments.contrast}   min={0} max={200} onChange={v=>setAdj('contrast',v)}   neon={true} unit="%" color="#bf00ff" />
                <AdjSlider label="Saturation" val={adjustments.saturation} min={0} max={300} onChange={v=>setAdj('saturation',v)} neon={true} unit="%" color="#ffaa00" />
                <AdjSlider label="Hue Rotate" val={adjustments.hue}        min={-180} max={180} onChange={v=>setAdj('hue',v)}     neon={true} unit="°" color="#00ff88"/>
                <AdjSlider label="Temperature" val={adjustments.temperature} min={-100} max={100} onChange={v=>setAdj('temperature',v)} neon={true} unit="" color="#ffaa00"/>
                <AdjSlider label="Blur"        val={adjustments.blur}       min={0} max={20} step={0.1} onChange={v=>setAdj('blur',v)}    neon={true} unit="px" color="#7a7aaa" />
                <AdjSlider label="Sharpen"     val={adjustments.sharpen}    min={0} max={100} onChange={v=>setAdj('sharpen',v)}   neon={true} unit="%" color="#00fff7"/>
                <AdjSlider label="Vignette"    val={adjustments.vignette}   min={0} max={100} onChange={v=>setAdj('vignette',v)}  neon={true} unit="%" color="#bf00ff"/>
                <div style={{ height:1, background:'#1e1e42', margin:'10px 0' }}/>
                <ToggleRow label="Grayscale" val={adjustments.grayscale} onChange={v=>setAdj('grayscale',v)} neon={true}/>
                <ToggleRow label="Sepia"     val={adjustments.sepia}     onChange={v=>setAdj('sepia',v)}     neon={true}/>
                <ToggleRow label="Invert"    val={adjustments.invert}    onChange={v=>setAdj('invert',v)}    neon={true}/>
                <button onClick={()=>{setAdj('brightness',100);setAdj('contrast',100);setAdj('saturation',100);setAdj('hue',0);setAdj('blur',0);setAdj('sharpen',0);setAdj('vignette',0);setAdj('temperature',0);setAdj('grayscale',false);setAdj('sepia',false);setAdj('invert',false);}}
                  className="n-btn-ghost" style={{ width:'100%', justifyContent:'center', marginTop:8 }}>
                  <IcoReset s={12}/> RESET ADJUSTMENTS
                </button>
              </motion.div>
            )}

            {/* FILTERS */}
            {tab === 'filters' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.2}}>
                <div style={{ fontSize:9, fontWeight:600, color:'rgba(0,255,247,.4)', letterSpacing:'.14em', marginBottom:12, textTransform:'uppercase' }}>◈ PRESET FILTERS</div>
                <FiltersPanel image={image} onApply={applyFilter} currentAdj={adjustments} neon={true} />
              </motion.div>
            )}

            {/* TRANSFORM */}
            {tab === 'transform' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.2}}>
                <div style={{ fontSize:9, fontWeight:600, color:'rgba(0,255,247,.4)', letterSpacing:'.14em', marginBottom:12, textTransform:'uppercase' }}>◈ ROTATE & FLIP</div>
                <div style={{ display:'flex', gap:6, marginBottom:14, flexWrap:'wrap' }}>
                  {[-90,-45,45,90].map(deg=>(
                    <button key={deg} className="n-btn-ghost" onClick={()=>setRotation(r=>(r+deg+360)%360)} style={{ flex:'1 0 auto', justifyContent:'center', padding:'7px 8px', fontSize:10 }}>
                      {deg>0?'+':''}{deg}°
                    </button>
                  ))}
                </div>
                <AdjSlider label="Rotation" val={rotation} min={0} max={359} onChange={setRotation} neon={true} unit="°" />
                <div style={{ display:'flex', gap:8, marginBottom:16 }}>
                  <button className={`n-btn-ghost ${flipH?'active':''}`} onClick={()=>setFlipH(!flipH)} style={{ flex:1, justifyContent:'center' }}>
                    <IcoFlipH s={13}/> FLIP H
                  </button>
                  <button className={`n-btn-ghost ${flipV?'active':''}`} onClick={()=>setFlipV(!flipV)} style={{ flex:1, justifyContent:'center' }}>
                    <IcoFlipH s={13}/> FLIP V
                  </button>
                </div>

                <div style={{ height:1, background:'#1e1e42', margin:'4px 0 14px' }}/>
                <div style={{ fontSize:9, fontWeight:600, color:'rgba(0,255,247,.4)', letterSpacing:'.14em', marginBottom:10, textTransform:'uppercase' }}>◈ RESIZE</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 24px 1fr', gap:4, alignItems:'center', marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:8, color:'#7a7aaa', letterSpacing:'.1em', marginBottom:4, textTransform:'uppercase' }}>WIDTH</div>
                    <input className="n-input" value={editor.resizeW} onChange={e=>{
                      const v = e.target.value;
                      editor.setResizeW(v);
                      if (editor.aspectLock && image) {
                        const ratio = image.naturalHeight / image.naturalWidth;
                        editor.setResizeH(String(Math.round(parseInt(v||0)*ratio)));
                      }
                    }} style={{ textAlign:'center' }} />
                  </div>
                  <button onClick={()=>editor.setAspectLock(!editor.aspectLock)}
                    style={{ width:20, height:20, border:`1px solid ${editor.aspectLock?'#00fff7':'#1e1e42'}`, borderRadius:2, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:editor.aspectLock?'#00fff7':'#7a7aaa', marginTop:18 }}>
                    {editor.aspectLock?'🔒':'🔓'}
                  </button>
                  <div>
                    <div style={{ fontSize:8, color:'#7a7aaa', letterSpacing:'.1em', marginBottom:4, textTransform:'uppercase' }}>HEIGHT</div>
                    <input className="n-input" value={editor.resizeH} onChange={e=>{
                      const v = e.target.value;
                      editor.setResizeH(v);
                      if (editor.aspectLock && image) {
                        const ratio = image.naturalWidth / image.naturalHeight;
                        editor.setResizeW(String(Math.round(parseInt(v||0)*ratio)));
                      }
                    }} style={{ textAlign:'center' }} />
                  </div>
                </div>
                <button className="n-btn" onClick={editor.applyResize} style={{ width:'100%', justifyContent:'center' }} disabled={!image}>
                  <IcoResize s={13}/> APPLY RESIZE
                </button>
              </motion.div>
            )}

            {/* TEXT */}
            {tab === 'text' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.2}}>
                <div style={{ fontSize:9, fontWeight:600, color:'rgba(0,255,247,.4)', letterSpacing:'.14em', marginBottom:12, textTransform:'uppercase' }}>◈ TEXT OVERLAY</div>
                <TextPanel layers={textLayers} setLayers={setTextLayers} neon={true} />
              </motion.div>
            )}

            {/* EXPORT */}
            {tab === 'export' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.2}}>
                <div style={{ fontSize:9, fontWeight:600, color:'rgba(0,255,247,.4)', letterSpacing:'.14em', marginBottom:14, textTransform:'uppercase' }}>◈ EXPORT OPTIONS</div>
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:9, fontWeight:600, color:'#7a7aaa', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>FORMAT</div>
                  <div style={{ display:'flex', gap:5 }}>
                    {['png','jpeg','webp'].map(f=>(
                      <button key={f} onClick={()=>setDlFormat(f)}
                        style={{ flex:1, padding:'7px 4px', border:`1px solid ${dlFormat===f?'#00fff7':'#1e1e42'}`, borderRadius:2, background: dlFormat===f?'rgba(0,255,247,.07)':'transparent', color: dlFormat===f?'#00fff7':'#7a7aaa', cursor:'pointer', fontFamily:'Inter', fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', transition:'all .15s' }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                {dlFormat !== 'png' && <AdjSlider label="Quality" val={dlQuality} min={10} max={100} onChange={setDlQuality} neon={true} unit="%" />}
                <button className="n-btn" style={{ width:'100%', justifyContent:'center', marginTop:10 }}
                  onClick={()=>downloadImage(dlFormat, dlQuality/100)} disabled={!image}>
                  <IcoDl s={14}/> DOWNLOAD .{dlFormat.toUpperCase()}
                </button>
                {image && (
                  <div style={{ marginTop:14, padding:'12px', border:'1px solid #1e1e42', borderRadius:2 }}>
                    <div style={{ fontSize:8, color:'rgba(0,255,247,.4)', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>◈ IMAGE INFO</div>
                    {[['Width',image.naturalWidth+'px'],['Height',image.naturalHeight+'px'],['Format',dlFormat.toUpperCase()]].map(([k,v])=>(
                      <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'4px 0', borderBottom:'1px solid #1e1e42' }}>
                        <span style={{ fontSize:10, color:'#7a7aaa' }}>{k}</span>
                        <span style={{ fontSize:10, fontWeight:700, color:'#00fff7' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </div>

        {/* CANVAS AREA */}
        <div className="n-canvas-wrap">
          {!image
            ? <DropZone onLoad={loadImage} neon={true} />
            : (
              <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{duration:.3}}
                style={{ position:'relative', transform:`scale(${zoom})`, transformOrigin:'center', transition:'transform .2s' }}>
                <canvas ref={canvasRef} style={{ display:'block', maxWidth:'100%',
                  boxShadow:'0 0 60px rgba(0,255,247,.08), 0 0 120px rgba(0,0,0,.6)',
                  border:'1px solid rgba(0,255,247,.12)' }} />
              </motion.div>
            )
          }
        </div>

        {/* RIGHT SIDEBAR — history */}
        <div className="n-sidebar n-sidebar-right" style={{ width:170 }}>
          <div style={{ padding:'12px 14px 6px' }}>
            <div style={{ fontSize:8, fontWeight:700, color:'rgba(0,255,247,.4)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:10 }}>◈ HISTORY</div>
          </div>
          {history.map((h,i)=>(
            <div key={i} className={`n-hist ${i===histIdx?'active':''}`}>{h.label}</div>
          ))}

          {image && (
            <>
              <div style={{ height:1, background:'#1e1e42', margin:'10px 14px' }}/>
              <div style={{ padding:'0 14px' }}>
                <div style={{ fontSize:8, fontWeight:700, color:'rgba(0,255,247,.4)', letterSpacing:'.18em', textTransform:'uppercase', marginBottom:8 }}>◈ OPEN IMAGE</div>
                <label style={{ display:'block', width:'100%' }}>
                  <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>loadImage(e.target.files[0])} />
                  <div className="n-btn-ghost" style={{ width:'100%', justifyContent:'center', cursor:'pointer', fontSize:9 }}>
                    <IcoUpload s={11}/> NEW IMAGE
                  </div>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EDITOR UI (normal dark)
═══════════════════════════════════════════════════════ */
function EditorNormal({ onSwitch, editor }) {
  const {
    image, loadImage, adjustments, setAdj, applyFilter,
    undo, redo, canUndo, canRedo, history, histIdx,
    resetAll, zoom, setZoom, rotation, setRotation, flipH, setFlipH, flipV, setFlipV,
    textLayers, setTextLayers, canvasRef, downloadImage,
  } = editor;

  const [tab, setTab] = useState('adjust');
  const [dlFormat, setDlFormat] = useState('png');
  const [dlQuality, setDlQuality] = useState(92);

  const tabs = [
    { id:'adjust',    label:'Adjust',    icon:<IcoSun s={13}/> },
    { id:'filters',   label:'Filters',   icon:<IcoFilter s={13}/> },
    { id:'transform', label:'Transform', icon:<IcoRotate s={13}/> },
    { id:'text',      label:'Text',      icon:<IcoText s={13}/> },
    { id:'export',    label:'Export',    icon:<IcoDl s={13}/> },
  ];

  return (
    <div className="nm-root" style={{ height:'100vh' }}>

      {/* TOOLBAR */}
      <div className="nm-toolbar">
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#4f46e5,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff' }}>
            <IcoZap s={13}/>
          </div>
          <span style={{ fontSize:15, fontWeight:800, color:'#e2e8f0', letterSpacing:'-.01em', whiteSpace:'nowrap' }}>
            Edit<span style={{ color:'#6366f1' }}>Pro</span>
          </span>
        </div>

        <div style={{ width:1, height:24, background:'#2d3561', margin:'0 4px' }} />

        <button className="nm-icon-btn" onClick={undo} disabled={!canUndo} title="Undo"><IcoUndo s={14}/></button>
        <button className="nm-icon-btn" onClick={redo} disabled={!canRedo} title="Redo"><IcoRedo s={14}/></button>
        <button className="nm-icon-btn" onClick={resetAll} title="Reset all"><IcoReset s={14}/></button>

        <div style={{ width:1, height:24, background:'#2d3561', margin:'0 4px' }} />

        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <button className="nm-icon-btn" onClick={()=>setZoom(z=>Math.max(.1,+(z-.1).toFixed(1)))} style={{ width:28,height:28,fontSize:14 }}>−</button>
          <span style={{ fontSize:11, fontWeight:700, color:'#6366f1', minWidth:36, textAlign:'center' }}>{Math.round(zoom*100)}%</span>
          <button className="nm-icon-btn" onClick={()=>setZoom(z=>Math.min(5,+(z+.1).toFixed(1)))} style={{ width:28,height:28,fontSize:14 }}>+</button>
          <button className="nm-icon-btn" onClick={()=>setZoom(1)} style={{ width:28,height:28,fontSize:9,color:'#64748b' }}>FIT</button>
        </div>

        <div style={{ flex:1 }}/>

        {image && <span style={{ fontSize:11, color:'#64748b', whiteSpace:'nowrap' }}>
          {image.naturalWidth} × {image.naturalHeight}px
        </span>}

        <button className="nm-mode-toggle" onClick={onSwitch}>
          <span style={{ fontSize:12, fontWeight:500, color:'#64748b' }}>Normal</span>
          <div style={{ width:34,height:18,borderRadius:9,background:'#2d3561',position:'relative' }}>
            <div style={{ position:'absolute',top:2,left:2,width:14,height:14,borderRadius:'50%',background:'#475569' }}/>
          </div>
          <span style={{ fontSize:12, fontWeight:700, color:'#818cf8' }}>✦ Futuristic</span>
        </button>
      </div>

      {/* BODY */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

        {/* LEFT SIDEBAR */}
        <div className="nm-sidebar" style={{ width:240 }}>
          <div style={{ display:'flex', borderBottom:'1px solid #2d3561' }}>
            {tabs.map(t=>(
              <button key={t.id} className={`nm-tab ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)} style={{ flex:1, padding:'10px 4px' }}>
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ padding:'16px' }}>

            {tab === 'adjust' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.2}}>
                <AdjSlider label="Brightness"   val={adjustments.brightness}  min={0}    max={200} onChange={v=>setAdj('brightness',v)}  neon={false} unit="%" />
                <AdjSlider label="Contrast"     val={adjustments.contrast}    min={0}    max={200} onChange={v=>setAdj('contrast',v)}    neon={false} unit="%" color="#06b6d4" />
                <AdjSlider label="Saturation"   val={adjustments.saturation}  min={0}    max={300} onChange={v=>setAdj('saturation',v)}  neon={false} unit="%" color="#f59e0b" />
                <AdjSlider label="Hue Rotate"   val={adjustments.hue}         min={-180} max={180} onChange={v=>setAdj('hue',v)}         neon={false} unit="°" color="#10b981"/>
                <AdjSlider label="Temperature"  val={adjustments.temperature} min={-100} max={100} onChange={v=>setAdj('temperature',v)} neon={false} unit="" color="#f97316"/>
                <AdjSlider label="Blur"         val={adjustments.blur}        min={0}    max={20}  step={0.1} onChange={v=>setAdj('blur',v)} neon={false} unit="px" color="#94a3b8"/>
                <AdjSlider label="Sharpen"      val={adjustments.sharpen}     min={0}    max={100} onChange={v=>setAdj('sharpen',v)}     neon={false} unit="%" />
                <AdjSlider label="Vignette"     val={adjustments.vignette}    min={0}    max={100} onChange={v=>setAdj('vignette',v)}    neon={false} unit="%" color="#8b5cf6"/>
                <div style={{ height:1, background:'#2d3561', margin:'10px 0' }}/>
                <ToggleRow label="Grayscale" val={adjustments.grayscale} onChange={v=>setAdj('grayscale',v)} neon={false}/>
                <ToggleRow label="Sepia"     val={adjustments.sepia}     onChange={v=>setAdj('sepia',v)}     neon={false}/>
                <ToggleRow label="Invert"    val={adjustments.invert}    onChange={v=>setAdj('invert',v)}    neon={false}/>
                <button onClick={()=>{setAdj('brightness',100);setAdj('contrast',100);setAdj('saturation',100);setAdj('hue',0);setAdj('blur',0);setAdj('sharpen',0);setAdj('vignette',0);setAdj('temperature',0);setAdj('grayscale',false);setAdj('sepia',false);setAdj('invert',false);}}
                  className="nm-btn-ghost" style={{ width:'100%', justifyContent:'center', marginTop:10 }}>
                  <IcoReset s={13}/> Reset Adjustments
                </button>
              </motion.div>
            )}

            {tab === 'filters' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.2}}>
                <div className="nm-section-label" style={{ marginBottom:12 }}>Preset Filters</div>
                <FiltersPanel image={image} onApply={applyFilter} currentAdj={adjustments} neon={false} />
              </motion.div>
            )}

            {tab === 'transform' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.2}}>
                <div className="nm-section-label" style={{ marginBottom:12 }}>Rotate & Flip</div>
                <div style={{ display:'flex', gap:6, marginBottom:14 }}>
                  {[-90,-45,45,90].map(deg=>(
                    <button key={deg} className="nm-btn-ghost" onClick={()=>setRotation(r=>(r+deg+360)%360)} style={{ flex:1, justifyContent:'center', padding:'7px 6px', fontSize:11 }}>
                      {deg>0?'+':''}{deg}°
                    </button>
                  ))}
                </div>
                <AdjSlider label="Rotation" val={rotation} min={0} max={359} onChange={setRotation} neon={false} unit="°" />
                <div style={{ display:'flex', gap:8, marginBottom:16 }}>
                  <button className={`nm-btn-ghost ${flipH?'active':''}`} onClick={()=>setFlipH(!flipH)} style={{ flex:1, justifyContent:'center' }}>
                    <IcoFlipH s={13}/> Flip H
                  </button>
                  <button className={`nm-btn-ghost ${flipV?'active':''}`} onClick={()=>setFlipV(!flipV)} style={{ flex:1, justifyContent:'center' }}>
                    Flip V
                  </button>
                </div>

                <div style={{ height:1, background:'#2d3561', margin:'4px 0 14px' }}/>
                <div className="nm-section-label" style={{ marginBottom:10 }}>Resize</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 28px 1fr', gap:4, alignItems:'center', marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:10, color:'#64748b', fontWeight:600, marginBottom:4 }}>Width</div>
                    <input className="nm-input" value={editor.resizeW} onChange={e=>{
                      const v = e.target.value;
                      editor.setResizeW(v);
                      if (editor.aspectLock && image) editor.setResizeH(String(Math.round(parseInt(v||0)*image.naturalHeight/image.naturalWidth)));
                    }} style={{ textAlign:'center', padding:'7px 8px' }} />
                  </div>
                  <button onClick={()=>editor.setAspectLock(!editor.aspectLock)}
                    style={{ width:22, height:22, border:`1.5px solid ${editor.aspectLock?'#6366f1':'#2d3561'}`, borderRadius:6, background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, marginTop:20 }}>
                    {editor.aspectLock?'🔒':'🔓'}
                  </button>
                  <div>
                    <div style={{ fontSize:10, color:'#64748b', fontWeight:600, marginBottom:4 }}>Height</div>
                    <input className="nm-input" value={editor.resizeH} onChange={e=>{
                      const v = e.target.value;
                      editor.setResizeH(v);
                      if (editor.aspectLock && image) editor.setResizeW(String(Math.round(parseInt(v||0)*image.naturalWidth/image.naturalHeight)));
                    }} style={{ textAlign:'center', padding:'7px 8px' }} />
                  </div>
                </div>
                <button className="nm-btn" onClick={editor.applyResize} style={{ width:'100%', justifyContent:'center' }} disabled={!image}>
                  <IcoResize s={14}/> Apply Resize
                </button>
              </motion.div>
            )}

            {tab === 'text' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.2}}>
                <div className="nm-section-label" style={{ marginBottom:12 }}>Text Overlay</div>
                <TextPanel layers={textLayers} setLayers={setTextLayers} neon={false} />
              </motion.div>
            )}

            {tab === 'export' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.2}}>
                <div className="nm-section-label" style={{ marginBottom:14 }}>Export Options</div>
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:'#64748b', marginBottom:8 }}>Format</div>
                  <div style={{ display:'flex', gap:6 }}>
                    {['png','jpeg','webp'].map(f=>(
                      <button key={f} onClick={()=>setDlFormat(f)}
                        style={{ flex:1, padding:'8px 4px', border:`1.5px solid ${dlFormat===f?'#6366f1':'#2d3561'}`, borderRadius:8, background: dlFormat===f?'rgba(99,102,241,.12)':'transparent', color: dlFormat===f?'#818cf8':'#64748b', cursor:'pointer', fontFamily:'Inter', fontSize:11, fontWeight:700, textTransform:'uppercase', transition:'all .15s' }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                {dlFormat !== 'png' && <AdjSlider label="Quality" val={dlQuality} min={10} max={100} onChange={setDlQuality} neon={false} unit="%" />}
                <button className="nm-btn" style={{ width:'100%', justifyContent:'center', marginTop:12 }}
                  onClick={()=>downloadImage(dlFormat, dlQuality/100)} disabled={!image}>
                  <IcoDl s={15}/> Download .{dlFormat.toUpperCase()}
                </button>
                {image && (
                  <div style={{ marginTop:14, padding:'12px', border:'1.5px solid #2d3561', borderRadius:10, background:'#0f0f23' }}>
                    <div className="nm-section-label" style={{ fontSize:9, marginBottom:8 }}>Image Info</div>
                    {[['Width',image.naturalWidth+'px'],['Height',image.naturalHeight+'px'],['Format',dlFormat.toUpperCase()]].map(([k,v])=>(
                      <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid #2d3561' }}>
                        <span style={{ fontSize:11, color:'#64748b' }}>{k}</span>
                        <span style={{ fontSize:11, fontWeight:700, color:'#818cf8' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </div>

        {/* CANVAS AREA */}
        <div className="nm-canvas-wrap">
          {!image
            ? <DropZone onLoad={loadImage} neon={false} />
            : (
              <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{duration:.3}}
                style={{ position:'relative', transform:`scale(${zoom})`, transformOrigin:'center', transition:'transform .2s' }}>
                <canvas ref={canvasRef} style={{ display:'block', maxWidth:'100%',
                  boxShadow:'0 0 80px rgba(0,0,0,.6)',
                  borderRadius:4, border:'1px solid #2d3561' }} />
              </motion.div>
            )
          }
        </div>

        {/* RIGHT SIDEBAR — history */}
        <div className="nm-sidebar nm-sidebar-right" style={{ width:180 }}>
          <div style={{ padding:'14px 16px 8px' }}>
            <div className="nm-section-label" style={{ fontSize:9, marginBottom:10 }}>Edit History</div>
          </div>
          {history.map((h,i)=>(
            <div key={i} className={`nm-hist ${i===histIdx?'active':''}`}>{h.label}</div>
          ))}

          {image && (
            <>
              <div style={{ height:1, background:'#2d3561', margin:'12px 16px' }}/>
              <div style={{ padding:'0 16px' }}>
                <div className="nm-section-label" style={{ fontSize:9, marginBottom:10 }}>Open Image</div>
                <label style={{ display:'block' }}>
                  <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>loadImage(e.target.files[0])} />
                  <div className="nm-btn-ghost" style={{ width:'100%', justifyContent:'center', cursor:'pointer', fontSize:11 }}>
                    <IcoUpload s={12}/> New Image
                  </div>
                </label>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════ */
export default function ImageEditor() {
  const [uiMode, setUiMode] = useState('futuristic');
  const editor = useEditor();

  return (
    <>
      <style>{BASE_STYLES}{NEON_STYLES}{NORMAL_STYLES}</style>
      <AnimatePresence mode="wait">
        {uiMode === 'futuristic' ? (
          <motion.div key="neon" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}} style={{height:'100vh'}}>
            <EditorNeon onSwitch={()=>setUiMode('normal')} editor={editor} />
          </motion.div>
        ) : (
          <motion.div key="normal" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}} style={{height:'100vh'}}>
            <EditorNormal onSwitch={()=>setUiMode('futuristic')} editor={editor} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}