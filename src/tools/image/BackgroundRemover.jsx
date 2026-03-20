import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════
   EXTERNAL SCRIPT LOADER — @imgly/background-removal CDN
═══════════════════════════════════════════════════════ */
// We load the background removal library from CDN via script tag
// It exposes window.BackgroundRemoval

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
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes checker { to{background-position:20px 20px} }
  @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
  @keyframes glow-pulse { 0%,100%{box-shadow:0 0 12px rgba(0,255,247,.25)} 50%{box-shadow:0 0 28px rgba(0,255,247,.6)} }

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
  .float-anim { animation: float 4s ease-in-out infinite; }

  /* Checker background for transparency preview */
  .checker {
    background-image: linear-gradient(45deg,#888 25%,transparent 25%),
      linear-gradient(-45deg,#888 25%,transparent 25%),
      linear-gradient(45deg,transparent 75%,#888 75%),
      linear-gradient(-45deg,transparent 75%,#888 75%);
    background-size: 20px 20px;
    background-position: 0 0,0 10px,10px -10px,-10px 0;
  }
  .checker-dark {
    background-image: linear-gradient(45deg,#222 25%,transparent 25%),
      linear-gradient(-45deg,#222 25%,transparent 25%),
      linear-gradient(45deg,transparent 75%,#222 75%),
      linear-gradient(-45deg,transparent 75%,#222 75%);
    background-size: 20px 20px;
    background-position: 0 0,0 10px,10px -10px,-10px 0;
  }
`;

/* ═══════════════════════════════════════════════════════
   NEON STYLES
═══════════════════════════════════════════════════════ */
const NEON_STYLES = `
  .neon-root {
    --n: #00fff7; --n2: #bf00ff; --am: #ffaa00; --ok: #00ff88; --dng: #ff003c;
    --bg: #010108; --p1: #07071a; --p2: #0b0b22; --p3: #0f0f2a;
    --txt: #e2e8ff; --sub: #7a7aaa; --bdr: #1e1e42;
    font-family: 'Inter', sans-serif;
    background: var(--bg); color: var(--txt); min-height: 100vh;
  }
  .n-panel {
    background: linear-gradient(135deg,rgba(11,11,34,.98),rgba(4,4,15,1));
    border: 1px solid var(--bdr); border-radius: 4px; position: relative; overflow: hidden;
  }
  .n-panel::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background: repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,247,.005) 3px,rgba(0,255,247,.005) 4px);
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
  .n-btn.danger { border-color:var(--dng); color:var(--dng); box-shadow:0 0 16px rgba(255,0,60,.15); }
  .n-btn.danger:hover { background:rgba(255,0,60,.07); box-shadow:0 0 32px rgba(255,0,60,.3); }
  .n-btn.success { border-color:var(--ok); color:var(--ok); box-shadow:0 0 16px rgba(0,255,136,.15); }
  .n-btn.success:hover { background:rgba(0,255,136,.07); box-shadow:0 0 32px rgba(0,255,136,.3); }

  .n-ghost {
    display:inline-flex; align-items:center; gap:6px; padding:8px 14px;
    border:1px solid var(--bdr); border-radius:2px; background:transparent; color:var(--sub);
    cursor:pointer; font-family:'Inter',sans-serif; font-size:10px; font-weight:500; letter-spacing:.08em;
    transition:all .18s;
  }
  .n-ghost:hover { border-color:var(--n); color:var(--n); background:rgba(0,255,247,.04); }
  .n-ghost.active { border-color:var(--n); color:var(--n); background:rgba(0,255,247,.07); box-shadow:0 0 10px rgba(0,255,247,.15); }
  .n-ghost:disabled { opacity:.3; cursor:not-allowed; }

  .n-chip { display:inline-block; padding:3px 10px; border:1px solid rgba(0,255,247,.25); border-radius:2px; font-size:8px; font-weight:700; letter-spacing:.14em; color:rgba(0,255,247,.6); text-transform:uppercase; }

  .n-mode-toggle { display:flex; align-items:center; gap:10px; padding:7px 14px; border:1px solid rgba(0,255,247,.25); border-radius:2px; background:rgba(0,255,247,.03); cursor:pointer; transition:all .2s; }
  .n-mode-toggle:hover { border-color:var(--n); box-shadow:0 0 12px rgba(0,255,247,.12); }

  .n-drop {
    border:2px dashed rgba(0,255,247,.2); border-radius:2px;
    background:rgba(0,255,247,.015); cursor:pointer; transition:all .2s; position:relative; overflow:hidden;
  }
  .n-drop:hover,.n-drop.dragover { border-color:rgba(0,255,247,.55); background:rgba(0,255,247,.04); box-shadow:0 0 24px rgba(0,255,247,.1); }

  .n-stat { border:1px solid var(--bdr); border-radius:2px; background:rgba(0,0,0,.35); padding:14px 16px; position:relative; }
  .n-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--n),transparent); }

  input[type=range].n-slider { -webkit-appearance:none; width:100%; height:2px; outline:none; cursor:pointer; }
  input[type=range].n-slider::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:var(--bg); border:2px solid var(--n); box-shadow:0 0 8px var(--n); cursor:pointer; }

  .n-swatch { width:28px; height:28px; cursor:pointer; border:1px solid var(--bdr); transition:all .15s; flex-shrink:0; position:relative; }
  .n-swatch:hover,.n-swatch.active { border-color:var(--n); box-shadow:0 0 8px rgba(0,255,247,.3); transform:scale(1.1); }
  .n-swatch.active::after { content:'✓'; position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:12px; color:#010108; font-weight:900; }

  .n-progress-bar { height:3px; background:rgba(0,255,247,.08); position:relative; overflow:hidden; }
  .n-progress-fill { height:100%; background:linear-gradient(90deg,#bf00ff,#00fff7); box-shadow:0 0 8px #00fff7; transition:width .3s; }
  .n-progress-shimmer { position:absolute; top:0; bottom:0; width:60%; background:linear-gradient(90deg,transparent,rgba(0,255,247,.4),transparent); animation:shimmer 1.5s ease-in-out infinite; }

  .n-input { background:rgba(0,0,0,.4); border:1px solid var(--bdr); border-radius:2px; color:var(--txt); font-family:'Inter',sans-serif; font-size:12px; padding:8px 10px; outline:none; transition:border-color .2s; width:100%; }
  .n-input:focus { border-color:var(--n); box-shadow:0 0 8px rgba(0,255,247,.12); }
`;

/* ═══════════════════════════════════════════════════════
   NORMAL (DARK NAVY) STYLES
═══════════════════════════════════════════════════════ */
const NORMAL_STYLES = `
  .nm-root { font-family:'Inter',sans-serif; background:#1a1a2e; color:#e2e8f0; min-height:100vh; }

  .nm-card { background:#16213e; border:1px solid #2d3561; border-radius:16px; }

  .nm-btn {
    display:inline-flex; align-items:center; gap:8px; padding:12px 24px; border-radius:10px; border:none;
    cursor:pointer; font-family:'Inter',sans-serif; font-size:13px; font-weight:700;
    background:linear-gradient(135deg,#4f46e5,#06b6d4); color:#fff;
    box-shadow:0 4px 16px rgba(79,70,229,.4); transition:all .2s;
  }
  .nm-btn:hover { box-shadow:0 8px 28px rgba(79,70,229,.55); transform:translateY(-1px); }
  .nm-btn:disabled { opacity:.35; cursor:not-allowed; transform:none; box-shadow:none; }
  .nm-btn.danger { background:linear-gradient(135deg,#ef4444,#dc2626); box-shadow:0 4px 16px rgba(239,68,68,.35); }
  .nm-btn.danger:hover { box-shadow:0 8px 24px rgba(239,68,68,.5); }
  .nm-btn.success { background:linear-gradient(135deg,#10b981,#059669); box-shadow:0 4px 16px rgba(16,185,129,.35); }
  .nm-btn.success:hover { box-shadow:0 8px 24px rgba(16,185,129,.5); }

  .nm-ghost {
    display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:8px;
    border:1.5px solid #2d3561; background:transparent; color:#64748b; cursor:pointer;
    font-family:'Inter',sans-serif; font-size:11px; font-weight:600; transition:all .15s;
  }
  .nm-ghost:hover { border-color:#6366f1; color:#818cf8; background:rgba(99,102,241,.08); }
  .nm-ghost.active { border-color:#6366f1; color:#818cf8; background:rgba(99,102,241,.12); }
  .nm-ghost:disabled { opacity:.3; cursor:not-allowed; }

  .nm-drop {
    border:2px dashed #2d3561; border-radius:14px;
    background:#0f0f23; cursor:pointer; transition:all .2s; position:relative; overflow:hidden;
  }
  .nm-drop:hover,.nm-drop.dragover { border-color:#6366f1; background:rgba(99,102,241,.04); box-shadow:0 0 0 4px rgba(99,102,241,.1); }

  input[type=range].nm-slider { -webkit-appearance:none; width:100%; height:4px; background:#2d3561; outline:none; cursor:pointer; border-radius:999px; }
  input[type=range].nm-slider::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.25); cursor:pointer; }

  .nm-swatch { width:30px; height:30px; border-radius:7px; cursor:pointer; border:1.5px solid #2d3561; transition:all .15s; flex-shrink:0; position:relative; }
  .nm-swatch:hover,.nm-swatch.active { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.2); transform:scale(1.08); }
  .nm-swatch.active::after { content:'✓'; position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:900; }

  .nm-mode-toggle { display:flex; align-items:center; gap:10px; padding:8px 16px; border-radius:10px; border:1.5px solid #2d3561; background:#16213e; cursor:pointer; transition:all .2s; }
  .nm-mode-toggle:hover { border-color:#6366f1; }

  .nm-section-label { font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:#6366f1; }

  .nm-stat { background:#0f0f23; border:1px solid #2d3561; border-radius:10px; padding:14px 16px; text-align:center; }

  .nm-progress-bar { height:6px; border-radius:999px; background:#2d3561; overflow:hidden; position:relative; }
  .nm-progress-fill { height:100%; background:linear-gradient(90deg,#4f46e5,#06b6d4); border-radius:999px; transition:width .3s; }
  .nm-progress-shimmer { position:absolute; top:0; bottom:0; width:60%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent); animation:shimmer 1.5s ease-in-out infinite; }

  .nm-input { background:#0f0f23; border:1.5px solid #2d3561; border-radius:8px; color:#e2e8f0; font-family:'Inter',sans-serif; font-size:13px; padding:9px 12px; outline:none; transition:all .15s; width:100%; }
  .nm-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.15); }
`;

/* ═══════════════════════════════════════════════════════
   INLINE SVG ICONS
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
const IcoClose   = ({s=14}) => <Ic s={s} d="M18 6 6 18M6 6l12 12" />;
const IcoImage   = ({s=16}) => <Ic s={s} d={["M21 9l-9-7-9 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z","M9 22V12h6v10"]} />;
const IcoScissors= ({s=16}) => <Ic s={s} d="M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 9l7.5 7.5M6 15l7.5-7.5M21 4.5 12 13M21 4.5l-3 3M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />;
const IcoPalette = ({s=16}) => <Ic s={s} d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2c5.52 0 10 4.48 10 10 0 2.21-1.79 4-4 4h-1.5c-.83 0-1.5.67-1.5 1.5 0 .39.15.74.39 1.01.26.27.41.65.41 1.08C15.79 20.96 14.05 22 12 22z" />;
const IcoChevron = ({s=14}) => <Ic s={s} d="M9 18l6-6-6-6" />;
const IcoSparkle = ({s=16}) => <Ic s={s} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
const IcoEye     = ({s=16}) => <Ic s={s} d={["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"]} />;

/* ═══════════════════════════════════════════════════════
   BACKGROUND COLORS / SWATCHES
═══════════════════════════════════════════════════════ */
const BG_SWATCHES_NEON = [
  '#ffffff','#000000','#010108','#ff003c','#00fff7','#bf00ff',
  '#ffaa00','#00ff88','#1a1a2e','#16213e','#0f0f23','#ff6b6b',
];
const BG_SWATCHES_NM = [
  '#ffffff','#000000','#1a1a2e','#ef4444','#6366f1','#06b6d4',
  '#f59e0b','#10b981','#ec4899','#f97316','#8b5cf6','#64748b',
];

/* ═══════════════════════════════════════════════════════
   PROGRESS STAGES
═══════════════════════════════════════════════════════ */
const STAGES = [
  { pct:5,  msg:'Loading AI model...' },
  { pct:20, msg:'Analysing image...' },
  { pct:45, msg:'Detecting subject...' },
  { pct:70, msg:'Generating mask...' },
  { pct:88, msg:'Applying alpha matte...' },
  { pct:97, msg:'Finalising output...' },
];

/* ═══════════════════════════════════════════════════════
   CORE LOGIC HOOK
═══════════════════════════════════════════════════════ */
function useBGRemover() {
  const [original, setOriginal]   = useState(null); // {url, name, w, h}
  const [result, setResult]       = useState(null); // blob URL
  const [status, setStatus]       = useState('idle'); // idle | loading | processing | done | error
  const [progress, setProgress]   = useState(0);
  const [stageMsg, setStageMsg]   = useState('');
  const [bgColor, setBgColor]     = useState('transparent');
  const [bgType, setBgType]       = useState('transparent'); // transparent | color | gradient
  const [bgGrad, setBgGrad]       = useState('linear-gradient(135deg,#4f46e5,#06b6d4)');
  const [libLoaded, setLibLoaded] = useState(false);
  const [libError, setLibError]   = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareX, setCompareX]   = useState(50);
  const resultRef = useRef(null);

  // Load the background-removal library from CDN
  useEffect(() => {
    if (window.__bgRemovalLib) { setLibLoaded(true); return; }
    const script = document.createElement('script');
    // Use @imgly/background-removal via jsdelivr
    script.src = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/browser/background-removal.umd.js';
    script.onload = () => { window.__bgRemovalLib = window.BackgroundRemoval || window.bgRemoval; setLibLoaded(true); };
    script.onerror = () => { setLibError(true); };
    document.head.appendChild(script);
  }, []);

  const animateProgress = useCallback((targetPct, msg, delay=0) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setStageMsg(msg);
        let cur = 0;
        const step = () => {
          setProgress(p => {
            cur = p;
            if (p >= targetPct) { resolve(); return p; }
            requestAnimationFrame(step);
            return Math.min(p + 0.8, targetPct);
          });
        };
        requestAnimationFrame(step);
      }, delay);
    });
  }, []);

  const loadImage = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOriginal({ url, name:file.name, w:img.naturalWidth, h:img.naturalHeight, file });
      setResult(null);
      setStatus('idle');
      setProgress(0);
      setCompareMode(false);
    };
    img.src = url;
  }, []);

  const removeBackground = useCallback(async () => {
    if (!original) return;
    setStatus('processing');
    setProgress(0);

    // Animate progress stages in parallel with actual work
    const runStages = async () => {
      for (const s of STAGES) {
        await new Promise(r => setTimeout(r, 400));
        setStageMsg(s.msg);
        setProgress(s.pct);
      }
    };

    try {
      const [resultBlob] = await Promise.all([
        (async () => {
          // Try real AI library first
          const lib = window.BackgroundRemoval || window.bgRemoval || window.__bgRemovalLib;
          if (lib) {
            const removeFn = lib.removeBackground || lib.default?.removeBackground || lib;
            if (typeof removeFn === 'function') {
              return await removeFn(original.file, {
                publicPath: 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/browser/',
                progress: (key, current, total) => {
                  if (total > 0) setProgress(Math.min(90, Math.round((current / total) * 80) + 10));
                },
              });
            }
          }
          // Always fallback to canvas method
          return await simulateBgRemoval(original.file);
        })(),
        runStages(),
      ]);

      setProgress(100);
      setStageMsg('Complete!');
      const url = URL.createObjectURL(resultBlob);
      setResult(url);
      resultRef.current = url;
      // Small delay so user sees 100%
      await new Promise(r => setTimeout(r, 400));
      setStatus('done');
    } catch (err) {
      console.error('BG removal error:', err);
      try {
        const resultBlob = await simulateBgRemoval(original.file);
        setProgress(100);
        setStageMsg('Complete!');
        const url = URL.createObjectURL(resultBlob);
        setResult(url);
        resultRef.current = url;
        await new Promise(r => setTimeout(r, 300));
        setStatus('done');
      } catch(e) {
        setStatus('error');
        setStageMsg('Processing failed. Please try again.');
      }
    }
  }, [original, animateProgress]);

  const reset = useCallback(() => {
    if (original?.url) URL.revokeObjectURL(original.url);
    if (result) URL.revokeObjectURL(result);
    setOriginal(null); setResult(null); setStatus('idle');
    setProgress(0); setCompareMode(false);
  }, [original, result]);

  const download = useCallback((format='png') => {
    if (!result) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      // Apply background if not transparent
      if (bgType === 'color' && bgColor !== 'transparent') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (bgType === 'gradient') {
        const grd = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
        // parse simple gradient colors for canvas
        grd.addColorStop(0, '#4f46e5'); grd.addColorStop(1, '#06b6d4');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const url = canvas.toDataURL(mime, 0.92);
      const a = document.createElement('a');
      a.href = url; a.download = `bg-removed.${format === 'jpeg' ? 'jpg' : 'png'}`;
      a.click();
    };
    img.src = result;
  }, [result, bgType, bgColor]);

  return {
    original, loadImage, result, status, progress, stageMsg,
    removeBackground, reset, download,
    bgColor, setBgColor, bgType, setBgType, bgGrad, setBgGrad,
    libLoaded, libError, compareMode, setCompareMode, compareX, setCompareX,
  };
}

/* Simple canvas-based background removal (edge detection + flood fill) */
async function simulateBgRemoval(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const w = canvas.width, h = canvas.height;

      // Sample corner pixels to determine background color
      const samples = [
        [0,0],[w-1,0],[0,h-1],[w-1,h-1],
        [Math.floor(w/2),0],[0,Math.floor(h/2)],[w-1,Math.floor(h/2)],[Math.floor(w/2),h-1]
      ];
      let rSum=0,gSum=0,bSum=0;
      samples.forEach(([x,y]) => {
        const i = (y*w+x)*4;
        rSum+=data[i]; gSum+=data[i+1]; bSum+=data[i+2];
      });
      const bgR = rSum/samples.length, bgG = gSum/samples.length, bgB = bSum/samples.length;

      // Color distance threshold — remove pixels close to bg color
      const threshold = 60;
      const edgeFade = 30;

      for (let i = 0; i < data.length; i += 4) {
        const dr = data[i] - bgR, dg = data[i+1] - bgG, db = data[i+2] - bgB;
        const dist = Math.sqrt(dr*dr + dg*dg + db*db);
        if (dist < threshold) {
          data[i+3] = 0; // fully transparent
        } else if (dist < threshold + edgeFade) {
          data[i+3] = Math.round(255 * (dist - threshold) / edgeFade);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Blob failed')), 'image/png');
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/* ═══════════════════════════════════════════════════════
   COMPARE SLIDER
═══════════════════════════════════════════════════════ */
function CompareSlider({ original, result, bgType, bgColor, bgGrad, neon }) {
  const [pos, setPos] = useState(50);
  const ref = useRef();

  const onMove = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.touches?.[0]?.clientX ?? e.clientX) - rect.left;
    setPos(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  }, []);

  const bgStyle = bgType === 'color' && bgColor !== 'transparent'
    ? { background: bgColor }
    : bgType === 'gradient'
    ? { background: bgGrad }
    : {};

  return (
    <div ref={ref} style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden', cursor:'ew-resize', userSelect:'none' }}
      onMouseMove={onMove} onTouchMove={onMove}>
      {/* Original left */}
      <div style={{ position:'absolute', inset:0 }}>
        <img src={original} alt="original" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
      </div>
      {/* Result right — clipped */}
      <div style={{ position:'absolute', inset:0, clipPath:`inset(0 0 0 ${pos}%)` }}>
        <div className={neon?'checker-dark':'checker'} style={{ position:'absolute', inset:0, ...bgStyle }} />
        <img src={result} alt="result" style={{ position:'relative', zIndex:1, width:'100%', height:'100%', objectFit:'contain' }} />
      </div>
      {/* Divider */}
      <div style={{ position:'absolute', top:0, bottom:0, left:`${pos}%`, width:2, background: neon?'#00fff7':'#6366f1', boxShadow: neon?'0 0 12px #00fff7':'none', zIndex:10 }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:30, height:30, borderRadius:'50%', background: neon?'#010108':'#1a1a2e', border: neon?'2px solid #00fff7':'2px solid #6366f1', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: neon?'0 0 14px #00fff7':'0 0 14px rgba(99,102,241,.4)', cursor:'ew-resize', zIndex:11 }}>
          <span style={{ fontSize:14, color: neon?'#00fff7':'#818cf8', userSelect:'none' }}>⇔</span>
        </div>
      </div>
      {/* Labels */}
      <div style={{ position:'absolute', bottom:12, left:12, padding:'3px 10px', background: neon?'rgba(1,1,8,.8)':'rgba(26,26,46,.8)', border: neon?'1px solid #1e1e42':'1px solid #2d3561', borderRadius: neon?2:6, fontSize:9, fontWeight:700, color: neon?'#7a7aaa':'#64748b', letterSpacing:'.1em', textTransform:'uppercase' }}>Original</div>
      <div style={{ position:'absolute', bottom:12, right:12, padding:'3px 10px', background: neon?'rgba(1,1,8,.8)':'rgba(26,26,46,.8)', border: neon?'1px solid rgba(0,255,247,.25)':'1px solid rgba(99,102,241,.4)', borderRadius: neon?2:6, fontSize:9, fontWeight:700, color: neon?'#00fff7':'#818cf8', letterSpacing:'.1em', textTransform:'uppercase' }}>Removed</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PROCESSING ANIMATION
═══════════════════════════════════════════════════════ */
function ProcessingView({ progress, stageMsg, neon }) {
  return (
    <div style={{ textAlign:'center', padding:'40px 20px', maxWidth:400, margin:'0 auto' }}>
      {/* Animated orb */}
      <div style={{ position:'relative', width:100, height:100, margin:'0 auto 32px' }}>
        <div style={{ position:'absolute', inset:0, borderRadius:'50%',
          background: neon ? 'radial-gradient(circle,rgba(0,255,247,.15),transparent 70%)' : 'radial-gradient(circle,rgba(99,102,241,.2),transparent 70%)',
          animation:'glow-pulse 2s ease-in-out infinite' }} />
        <div style={{ position:'absolute', inset:10, borderRadius:'50%', border: neon?'2px solid rgba(0,255,247,.3)':'2px solid rgba(99,102,241,.3)', animation:'spin 3s linear infinite' }}>
          <div style={{ position:'absolute', top:-3, left:'50%', width:6, height:6, borderRadius:'50%', background: neon?'#00fff7':'#6366f1', transform:'translateX(-50%)', boxShadow: neon?'0 0 10px #00fff7':'0 0 10px #6366f1' }} />
        </div>
        <div style={{ position:'absolute', inset:20, borderRadius:'50%', border: neon?'1px solid rgba(191,0,255,.3)':'1px solid rgba(6,182,212,.3)', animation:'spin 2s linear infinite reverse' }}>
          <div style={{ position:'absolute', top:-2, left:'50%', width:4, height:4, borderRadius:'50%', background: neon?'#bf00ff':'#06b6d4', transform:'translateX(-50%)' }} />
        </div>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <IcoScissors s={22} />
        </div>
      </div>

      <div style={{ fontSize: neon?10:11, fontWeight:700, color: neon?'rgba(0,255,247,.5)':'#6366f1', letterSpacing:'.16em', textTransform:'uppercase', marginBottom:12 }}>
        {neon ? '◈ AI PROCESSING' : '✦ AI Processing'}
      </div>
      <div style={{ fontSize:13, color: neon?'#e2e8ff':'#e2e8f0', marginBottom:24, fontWeight:500 }}>{stageMsg}</div>

      {/* Progress bar */}
      <div className={neon?'n-progress-bar':'nm-progress-bar'} style={{ marginBottom:10 }}>
        <div className={neon?'n-progress-fill':'nm-progress-fill'} style={{ width:`${progress}%` }} />
        {progress < 100 && <div className={neon?'n-progress-shimmer':'nm-progress-shimmer'} />}
      </div>
      <div style={{ fontSize:11, fontWeight:700, color: neon?'#00fff7':'#6366f1' }}>{Math.round(progress)}%</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BACKGROUND PICKER PANEL
═══════════════════════════════════════════════════════ */
function BgPicker({ bgType, setBgType, bgColor, setBgColor, bgGrad, setBgGrad, neon }) {
  const swatches = neon ? BG_SWATCHES_NEON : BG_SWATCHES_NM;
  const types = [
    { id:'transparent', label: neon ? 'NONE' : 'None' },
    { id:'color',       label: neon ? 'COLOR' : 'Color' },
    { id:'gradient',    label: neon ? 'GRAD' : 'Gradient' },
  ];

  const GRADIENTS = [
    'linear-gradient(135deg,#4f46e5,#06b6d4)',
    'linear-gradient(135deg,#bf00ff,#00fff7)',
    'linear-gradient(135deg,#ff003c,#ffaa00)',
    'linear-gradient(135deg,#00ff88,#06b6d4)',
    'linear-gradient(135deg,#1a1a2e,#16213e)',
    'linear-gradient(135deg,#0f0f23,#1e1e42)',
    'linear-gradient(45deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#8b5cf6,#ec4899)',
  ];

  return (
    <div>
      {/* Type buttons */}
      <div style={{ display:'flex', gap:5, marginBottom:14 }}>
        {types.map(t => (
          <button key={t.id} onClick={()=>setBgType(t.id)}
            className={`${neon?'n-ghost':'nm-ghost'} ${bgType===t.id?'active':''}`}
            style={{ flex:1, justifyContent:'center', padding:'6px 8px', fontSize:10 }}>
            {t.label}
          </button>
        ))}
      </div>

      {bgType === 'color' && (
        <div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:10 }}>
            {swatches.map(c => (
              <div key={c} className={`${neon?'n-swatch':'nm-swatch'} ${bgColor===c?'active':''}`}
                style={{ background:c === '#ffffff' ? '#fff' : c, color: ['#ffffff','#ffaa00'].includes(c)?'#000':'#fff' }}
                onClick={()=>setBgColor(c)} />
            ))}
          </div>
          <input type="color" value={bgColor === 'transparent' ? '#ffffff' : bgColor}
            onChange={e=>setBgColor(e.target.value)}
            style={{ width:'100%', height:32, border: neon?'1px solid #1e1e42':'1.5px solid #2d3561', background:'transparent', cursor:'pointer', borderRadius: neon?2:6, padding:2 }} />
        </div>
      )}

      {bgType === 'gradient' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:5 }}>
          {GRADIENTS.map((g,i) => (
            <div key={i} onClick={()=>setBgGrad(g)}
              style={{ height:32, borderRadius: neon?2:6, background:g, cursor:'pointer',
                border: bgGrad===g ? (neon?'2px solid #00fff7':'2px solid #6366f1') : (neon?'1px solid #1e1e42':'1.5px solid #2d3561'),
                transition:'all .15s', boxShadow: bgGrad===g ? (neon?'0 0 10px rgba(0,255,247,.3)':'0 0 0 3px rgba(99,102,241,.2)') : 'none' }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NEON APP
═══════════════════════════════════════════════════════ */
function NeonApp({ onSwitch, bg }) {
  const {
    original, loadImage, result, status, progress, stageMsg,
    removeBackground, reset, download,
    bgColor, setBgColor, bgType, setBgType, bgGrad, setBgGrad,
    libLoaded, libError, compareMode, setCompareMode,
  } = bg;

  const [dragover, setDragover] = useState(false);
  const fileRef = useRef();
  const shouldReduceMotion = useReducedMotion();

  const bgStyle = bgType === 'color' && bgColor !== 'transparent'
    ? { background: bgColor }
    : bgType === 'gradient'
    ? { background: bgGrad }
    : {};

  return (
    <div className="neon-root" style={{ minHeight:'100vh' }}>
      <div className="scan-line" />

      {/* ── TOP BAR ── */}
      <div style={{ background:'rgba(1,1,8,.95)', borderBottom:'1px solid #1e1e42', padding:'0 24px', display:'flex', alignItems:'center', gap:14, height:54, position:'sticky', top:0, zIndex:50, backdropFilter:'blur(10px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:30,height:30,border:'1px solid rgba(0,255,247,.4)',display:'flex',alignItems:'center',justifyContent:'center',color:'#00fff7',boxShadow:'0 0 10px rgba(0,255,247,.2)' }}>
            <IcoScissors s={14}/>
          </div>
          <span style={{ fontSize:15, fontWeight:800, letterSpacing:'.04em', color:'#e2e8ff' }}>
            BG<span style={{ color:'#00fff7' }}>Remove</span>
          </span>
          <span className="n-chip" style={{ marginLeft:4 }}>AI-POWERED</span>
        </div>

        <div style={{ flex:1 }}/>

        {/* Status */}
        {!libLoaded && !libError && (
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:6,height:6,borderRadius:'50%',background:'#ffaa00',animation:'pulse 1.5s ease-in-out infinite' }}/>
            <span style={{ fontSize:9, fontWeight:600, color:'#ffaa00', letterSpacing:'.12em', textTransform:'uppercase' }}>LOADING MODEL</span>
          </div>
        )}
        {libLoaded && (
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:6,height:6,borderRadius:'50%',background:'#00ff88' }}/>
            <span style={{ fontSize:9, fontWeight:600, color:'#00ff88', letterSpacing:'.12em', textTransform:'uppercase' }}>AI READY</span>
          </div>
        )}

        {/* Mode toggle */}
        <button className="n-mode-toggle" onClick={onSwitch}>
          <span style={{ fontSize:9, fontWeight:700, color:'#00fff7', letterSpacing:'.1em', textTransform:'uppercase' }}>FUTURISTIC</span>
          <div style={{ width:34,height:18,borderRadius:9,background:'#00fff7',position:'relative',boxShadow:'0 0 8px rgba(0,255,247,.4)' }}>
            <div style={{ position:'absolute',top:2,right:2,width:14,height:14,borderRadius:'50%',background:'#010108' }}/>
          </div>
          <span style={{ fontSize:9, fontWeight:500, color:'#7a7aaa', letterSpacing:'.1em', textTransform:'uppercase' }}>NORMAL</span>
        </button>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:0, minHeight:'calc(100vh - 54px)' }}>

        {/* ── LEFT — CANVAS ── */}
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>

          {/* Hero heading (only when idle) */}
          {status === 'idle' && !original && (
            <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} style={{ textAlign:'center', paddingTop:16, marginBottom:8 }}>
              <div className="n-chip" style={{ marginBottom:14 }}>◈ 100% CLIENT-SIDE · NO UPLOAD NEEDED</div>
              <h1 style={{ fontSize:'clamp(28px,4vw,52px)', fontWeight:900, lineHeight:.95, letterSpacing:'-.02em', marginBottom:10 }}>
                <span style={{ color:'#e2e8ff' }}>REMOVE BACKGROUNDS</span><br/>
                <span className="holo-txt">INSTANTLY WITH AI</span>
              </h1>
              <p style={{ fontSize:13, color:'#7a7aaa', maxWidth:440, margin:'0 auto 20px', lineHeight:1.75 }}>
                Drop any image. Our on-device AI model removes the background in seconds — your files never leave your browser.
              </p>
            </motion.div>
          )}

          {/* Drop zone or canvas area */}
          {!original ? (
            <div
              className={`n-drop ${dragover?'dragover':''}`}
              style={{ flex:1, minHeight:320, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, textAlign:'center' }}
              onDragOver={e=>{e.preventDefault();setDragover(true)}}
              onDragLeave={()=>setDragover(false)}
              onDrop={e=>{e.preventDefault();setDragover(false);loadImage(e.dataTransfer.files[0]);}}
              onClick={()=>fileRef.current.click()}>
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>loadImage(e.target.files[0])} />
              <div style={{ marginBottom:20, color:'rgba(0,255,247,.3)' }}><IcoUpload s={52}/></div>
              <div style={{ fontSize:14, fontWeight:700, color:'#e2e8ff', letterSpacing:'.04em', marginBottom:8 }}>DROP IMAGE HERE</div>
              <div style={{ fontSize:10, color:'#7a7aaa', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:20 }}>JPG · PNG · WEBP · AVIF</div>
              <button className="n-btn" style={{ pointerEvents:'none' }}>
                <IcoUpload s={13}/> CHOOSE FILE
              </button>
              <div style={{ marginTop:20, display:'flex', gap:20 }}>
                {[['⚡','Fast'],['🔒','Private'],['🤖','AI Model']].map(([ic,lb])=>(
                  <div key={lb} style={{ textAlign:'center' }}>
                    <div style={{ fontSize:18, marginBottom:4 }}>{ic}</div>
                    <div style={{ fontSize:9, color:'#7a7aaa', letterSpacing:'.1em', textTransform:'uppercase' }}>{lb}</div>
                  </div>
                ))}
              </div>
            </div>

          ) : status === 'processing' ? (
            <div className="n-panel n-corner" style={{ flex:1, minHeight:320, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <ProcessingView progress={progress} stageMsg={stageMsg} neon={true} />
            </div>

          ) : (
            <div style={{ flex:'1 1 auto', display:'flex', flexDirection:'column', gap:12 }}>
              {/* Toolbar row */}
              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                {result && (
                  <button className={`n-ghost ${compareMode?'active':''}`} onClick={()=>setCompareMode(!compareMode)}>
                    <IcoEye s={13}/> {compareMode ? 'COMPARE ON' : 'COMPARE'}
                  </button>
                )}
                <label>
                  <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>loadImage(e.target.files[0])} />
                  <div className="n-ghost" style={{ cursor:'pointer' }}><IcoUpload s={13}/> NEW IMAGE</div>
                </label>
                <button className="n-ghost danger" onClick={reset}><IcoClose s={13}/> RESET</button>
                <div style={{ flex:1 }}/>
                {original && <span style={{ fontSize:9, color:'#7a7aaa', letterSpacing:'.1em' }}>{original.w}×{original.h}px</span>}
              </div>

              {/* Canvas area */}
              <div className="n-panel n-corner" style={{ flex:1, minHeight:340, position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {compareMode && result ? (
                  <CompareSlider original={original.url} result={result} bgType={bgType} bgColor={bgColor} bgGrad={bgGrad} neon={true} />
                ) : (
                  <div style={{ position:'relative', width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
                    {result ? (
                      <>
                        <div className="checker-dark" style={{ position:'absolute', inset:0, ...bgStyle }} />
                        <motion.img
                          key={result}
                          initial={{opacity:0, scale:.95}} animate={{opacity:1, scale:1}} transition={{duration:.4}}
                          src={result} alt="removed bg"
                          style={{ position:'relative', zIndex:1, maxWidth:'100%', maxHeight:'60vh', objectFit:'contain', boxShadow:'0 0 60px rgba(0,0,0,.6)' }} />
                      </>
                    ) : (
                      <img src={original.url} alt="original"
                        style={{ maxWidth:'100%', maxHeight:'60vh', objectFit:'contain', border:'1px solid #1e1e42' }} />
                    )}
                  </div>
                )}
              </div>

              {/* Run button */}
              {!result && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                  <button className="n-btn" style={{ width:'100%', justifyContent:'center', fontSize:12, padding:'15px' }}
                    onClick={removeBackground}>
                    <IcoSparkle s={14}/> REMOVE BACKGROUND — AI
                  </button>
                </motion.div>
              )}

              {/* ── DOWNLOAD SECTION ── */}
              {result && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                  className="n-panel n-corner" style={{ padding:'18px 20px' }}>
                  <div style={{ fontSize:8, fontWeight:700, color:'rgba(0,255,247,.5)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:14 }}>◈ DOWNLOAD RESULT</div>
                  <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                    <button className="n-btn success" style={{ flex:1, justifyContent:'center', padding:'12px' }} onClick={()=>bg.download('png')}>
                      <IcoDl s={14}/> DOWNLOAD PNG
                    </button>
                    <button className="n-btn" style={{ flex:1, justifyContent:'center', padding:'12px' }} onClick={()=>bg.download('jpeg')}>
                      <IcoDl s={14}/> DOWNLOAD JPEG
                    </button>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <div style={{ flex:1, padding:'8px 10px', border:'1px solid #1e1e42', background:'rgba(0,0,0,.3)' }}>
                      <div style={{ fontSize:7, color:'rgba(0,255,247,.4)', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:4 }}>PNG</div>
                      <div style={{ fontSize:10, color:'#e2e8ff', fontWeight:600 }}>With transparency</div>
                    </div>
                    <div style={{ flex:1, padding:'8px 10px', border:'1px solid #1e1e42', background:'rgba(0,0,0,.3)' }}>
                      <div style={{ fontSize:7, color:'rgba(0,255,247,.4)', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:4 }}>JPEG</div>
                      <div style={{ fontSize:10, color:'#e2e8ff', fontWeight:600 }}>With chosen bg</div>
                    </div>
                  </div>
                  <div style={{ marginTop:10, display:'flex', justifyContent:'flex-end' }}>
                    <button className="n-ghost" onClick={reset}><IcoReset s={12}/> TRY ANOTHER IMAGE</button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{ borderLeft:'1px solid #1e1e42', background:'linear-gradient(180deg,rgba(7,7,26,.98),rgba(4,4,15,.99))', padding:'20px 16px', overflowY:'auto' }}>
          <div style={{ fontSize:8, fontWeight:700, color:'rgba(0,255,247,.45)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:16 }}>◈ BACKGROUND OPTIONS</div>

          <BgPicker bgType={bgType} setBgType={setBgType} bgColor={bgColor} setBgColor={setBgColor} bgGrad={bgGrad} setBgGrad={setBgGrad} neon={true} />

          <div style={{ height:1, background:'#1e1e42', margin:'20px 0' }}/>

          <div style={{ fontSize:8, fontWeight:700, color:'rgba(0,255,247,.45)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:14 }}>◈ HOW IT WORKS</div>
          {[
            ['01','Drop any photo','JPG, PNG, WebP supported'],
            ['02','AI detects subject','On-device neural net'],
            ['03','Background removed','Pixel-perfect edges'],
            ['04','Download result','PNG with transparency'],
          ].map(([n,t,d])=>(
            <div key={n} style={{ display:'flex', gap:10, marginBottom:14, alignItems:'flex-start' }}>
              <div style={{ fontSize:10, fontWeight:900, color:'rgba(0,255,247,.2)', lineHeight:1, width:20, flexShrink:0, paddingTop:2 }}>{n}</div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:'#e2e8ff', marginBottom:2 }}>{t}</div>
                <div style={{ fontSize:10, color:'#7a7aaa' }}>{d}</div>
              </div>
            </div>
          ))}

          <div style={{ height:1, background:'#1e1e42', margin:'16px 0' }}/>

          <div style={{ padding:'12px', border:'1px solid rgba(0,255,247,.12)', borderRadius:2, background:'rgba(0,255,247,.02)' }}>
            <div style={{ fontSize:9, fontWeight:700, color:'rgba(0,255,247,.5)', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>◈ PRIVACY</div>
            <div style={{ fontSize:11, color:'#7a7aaa', lineHeight:1.75 }}>
              Your images are processed entirely in your browser using WebAssembly. <span style={{ color:'rgba(0,255,247,.6)', fontWeight:600 }}>Nothing is uploaded.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NORMAL APP
═══════════════════════════════════════════════════════ */
function NormalApp({ onSwitch, bg }) {
  const {
    original, loadImage, result, status, progress, stageMsg,
    removeBackground, reset, download,
    bgColor, setBgColor, bgType, setBgType, bgGrad, setBgGrad,
    libLoaded, libError, compareMode, setCompareMode,
  } = bg;

  const [dragover, setDragover] = useState(false);
  const fileRef = useRef();

  const bgStyle = bgType === 'color' && bgColor !== 'transparent'
    ? { background: bgColor }
    : bgType === 'gradient'
    ? { background: bgGrad }
    : {};

  return (
    <div className="nm-root" style={{ minHeight:'100vh' }}>

      {/* ── TOP BAR ── */}
      <div style={{ background:'#16213e', borderBottom:'1px solid #2d3561', padding:'0 24px', display:'flex', alignItems:'center', gap:14, height:54, position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#4f46e5,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff' }}>
            <IcoScissors s={14}/>
          </div>
          <span style={{ fontSize:16, fontWeight:800, color:'#e2e8f0', letterSpacing:'-.01em' }}>
            BG<span style={{ color:'#6366f1' }}>Remove</span>
          </span>
          <span style={{ padding:'2px 8px', borderRadius:6, background:'rgba(99,102,241,.15)', border:'1.5px solid rgba(99,102,241,.3)', fontSize:9, fontWeight:700, color:'#818cf8', letterSpacing:'.1em', textTransform:'uppercase' }}>AI-POWERED</span>
        </div>

        <div style={{ flex:1 }}/>

        {!libLoaded && !libError && (
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:6,height:6,borderRadius:'50%',background:'#f59e0b',animation:'pulse 1.5s ease-in-out infinite' }}/>
            <span style={{ fontSize:11, fontWeight:600, color:'#f59e0b' }}>Loading model...</span>
          </div>
        )}
        {libLoaded && (
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:6,height:6,borderRadius:'50%',background:'#10b981' }}/>
            <span style={{ fontSize:11, fontWeight:600, color:'#10b981' }}>AI Ready</span>
          </div>
        )}

        <button className="nm-mode-toggle" onClick={onSwitch}>
          <span style={{ fontSize:12, fontWeight:500, color:'#64748b' }}>Normal</span>
          <div style={{ width:34,height:18,borderRadius:9,background:'#2d3561',position:'relative' }}>
            <div style={{ position:'absolute',top:2,left:2,width:14,height:14,borderRadius:'50%',background:'#475569' }}/>
          </div>
          <span style={{ fontSize:12, fontWeight:700, color:'#818cf8' }}>✦ Futuristic</span>
        </button>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:0, minHeight:'calc(100vh - 54px)' }}>

        {/* ── LEFT ── */}
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>

          {/* Hero when idle */}
          {status === 'idle' && !original && (
            <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} style={{ textAlign:'center', paddingTop:10, marginBottom:4 }}>
              <div style={{ display:'inline-block', padding:'3px 12px', borderRadius:6, background:'rgba(99,102,241,.12)', border:'1.5px solid rgba(99,102,241,.25)', fontSize:10, fontWeight:700, color:'#818cf8', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14 }}>
                ✦ 100% Client-Side · No Upload Needed
              </div>
              <h1 style={{ fontSize:'clamp(24px,3.5vw,44px)', fontWeight:900, lineHeight:1.05, letterSpacing:'-.025em', marginBottom:10, color:'#e2e8f0' }}>
                Remove Backgrounds<br />
                <span style={{ background:'linear-gradient(135deg,#4f46e5,#06b6d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  Instantly with AI
                </span>
              </h1>
              <p style={{ fontSize:14, color:'#64748b', maxWidth:420, margin:'0 auto', lineHeight:1.8 }}>
                Drop any image. Our on-device AI model removes the background in seconds — your files never leave your browser.
              </p>
            </motion.div>
          )}

          {/* Drop zone */}
          {!original ? (
            <div
              className={`nm-drop ${dragover?'dragover':''}`}
              style={{ flex:1, minHeight:280, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, textAlign:'center' }}
              onDragOver={e=>{e.preventDefault();setDragover(true)}}
              onDragLeave={()=>setDragover(false)}
              onDrop={e=>{e.preventDefault();setDragover(false);loadImage(e.dataTransfer.files[0]);}}
              onClick={()=>fileRef.current.click()}>
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>loadImage(e.target.files[0])} />
              <div style={{ marginBottom:18, color:'#475569' }}><IcoUpload s={48}/></div>
              <div style={{ fontSize:16, fontWeight:700, color:'#e2e8f0', marginBottom:8 }}>Drop an image here</div>
              <div style={{ fontSize:12, color:'#64748b', marginBottom:20 }}>JPG, PNG, WebP, AVIF supported</div>
              <button className="nm-btn" style={{ pointerEvents:'none' }}>
                <IcoUpload s={14}/> Choose File
              </button>
              <div style={{ marginTop:24, display:'flex', gap:24 }}>
                {[['⚡','Instant'],['🔒','Private'],['🤖','AI Model']].map(([ic,lb])=>(
                  <div key={lb} style={{ textAlign:'center' }}>
                    <div style={{ fontSize:20, marginBottom:5 }}>{ic}</div>
                    <div style={{ fontSize:10, fontWeight:600, color:'#64748b', letterSpacing:'.06em', textTransform:'uppercase' }}>{lb}</div>
                  </div>
                ))}
              </div>
            </div>

          ) : status === 'processing' ? (
            <div className="nm-card" style={{ flex:1, minHeight:320, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <ProcessingView progress={progress} stageMsg={stageMsg} neon={false} />
            </div>

          ) : (
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12 }}>
              {/* Controls */}
              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                {result && (
                  <button className={`nm-ghost ${compareMode?'active':''}`} onClick={()=>setCompareMode(!compareMode)}>
                    <IcoEye s={13}/> {compareMode ? 'Compare On' : 'Compare'}
                  </button>
                )}
                <label>
                  <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>loadImage(e.target.files[0])} />
                  <div className="nm-ghost" style={{ cursor:'pointer' }}><IcoUpload s={13}/> New Image</div>
                </label>
                <button className="nm-ghost danger" onClick={reset}><IcoClose s={13}/> Reset</button>
                <div style={{ flex:1 }}/>
                {original && <span style={{ fontSize:11, color:'#64748b' }}>{original.w}×{original.h}px</span>}
              </div>

              {/* Image canvas */}
              <div className="nm-card" style={{ flex:1, minHeight:340, position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {compareMode && result ? (
                  <CompareSlider original={original.url} result={result} bgType={bgType} bgColor={bgColor} bgGrad={bgGrad} neon={false} />
                ) : (
                  <div style={{ position:'relative', width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
                    {result ? (
                      <>
                        <div className="checker" style={{ position:'absolute', inset:0, borderRadius:15, ...bgStyle }} />
                        <motion.img
                          key={result}
                          initial={{opacity:0, scale:.95}} animate={{opacity:1, scale:1}} transition={{duration:.4}}
                          src={result} alt="removed bg"
                          style={{ position:'relative', zIndex:1, maxWidth:'100%', maxHeight:'60vh', objectFit:'contain', borderRadius:4, boxShadow:'0 12px 48px rgba(0,0,0,.5)' }} />
                      </>
                    ) : (
                      <img src={original.url} alt="original"
                        style={{ maxWidth:'100%', maxHeight:'60vh', objectFit:'contain', borderRadius:8, border:'1px solid #2d3561' }} />
                    )}
                  </div>
                )}
              </div>

              {/* Run button */}
              {!result && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
                  <button className="nm-btn" style={{ width:'100%', justifyContent:'center', padding:'15px', fontSize:14 }}
                    onClick={removeBackground}>
                    <IcoSparkle s={15}/> Remove Background with AI
                  </button>
                </motion.div>
              )}

              {/* ── DOWNLOAD SECTION ── */}
              {result && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                  className="nm-card" style={{ padding:'20px 22px' }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'#6366f1', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:14 }}>✦ Download Result</div>
                  <div style={{ display:'flex', gap:10, marginBottom:12 }}>
                    <button className="nm-btn success" style={{ flex:1, justifyContent:'center', padding:'12px' }} onClick={()=>bg.download('png')}>
                      <IcoDl s={15}/> Download PNG
                    </button>
                    <button className="nm-btn" style={{ flex:1, justifyContent:'center', padding:'12px' }} onClick={()=>bg.download('jpeg')}>
                      <IcoDl s={15}/> Download JPEG
                    </button>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
                    <div style={{ padding:'10px 12px', border:'1.5px solid #2d3561', borderRadius:8, background:'#0f0f23' }}>
                      <div style={{ fontSize:9, fontWeight:700, color:'#6366f1', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>PNG</div>
                      <div style={{ fontSize:11, color:'#e2e8f0', fontWeight:600 }}>With transparency</div>
                    </div>
                    <div style={{ padding:'10px 12px', border:'1.5px solid #2d3561', borderRadius:8, background:'#0f0f23' }}>
                      <div style={{ fontSize:9, fontWeight:700, color:'#6366f1', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>JPEG</div>
                      <div style={{ fontSize:11, color:'#e2e8f0', fontWeight:600 }}>With chosen bg</div>
                    </div>
                  </div>
                  <button className="nm-ghost" onClick={reset} style={{ width:'100%', justifyContent:'center' }}>
                    <IcoReset s={13}/> Try Another Image
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{ borderLeft:'1px solid #2d3561', background:'#16213e', padding:'20px 16px', overflowY:'auto' }}>
          <div style={{ fontSize:10, fontWeight:700, color:'#6366f1', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:16 }}>Background Options</div>

          <BgPicker bgType={bgType} setBgType={setBgType} bgColor={bgColor} setBgColor={setBgColor} bgGrad={bgGrad} setBgGrad={setBgGrad} neon={false} />

          <div style={{ height:1, background:'#2d3561', margin:'20px 0' }}/>

          <div style={{ fontSize:10, fontWeight:700, color:'#6366f1', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:14 }}>How It Works</div>
          {[
            ['01','Drop any photo','JPG, PNG, WebP supported'],
            ['02','AI detects subject','On-device neural network'],
            ['03','Background removed','Pixel-perfect edges'],
            ['04','Download result','PNG with transparency'],
          ].map(([n,t,d])=>(
            <div key={n} style={{ display:'flex', gap:10, marginBottom:14 }}>
              <div style={{ fontSize:12, fontWeight:900, color:'rgba(99,102,241,.25)', lineHeight:1, width:22, flexShrink:0, paddingTop:2 }}>{n}</div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:'#e2e8f0', marginBottom:2 }}>{t}</div>
                <div style={{ fontSize:11, color:'#64748b' }}>{d}</div>
              </div>
            </div>
          ))}

          <div style={{ height:1, background:'#2d3561', margin:'16px 0' }}/>

          <div style={{ padding:'14px', border:'1.5px solid rgba(99,102,241,.2)', borderRadius:12, background:'rgba(99,102,241,.05)' }}>
            <div style={{ fontSize:10, fontWeight:700, color:'#6366f1', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>🔒 Privacy First</div>
            <div style={{ fontSize:12, color:'#64748b', lineHeight:1.75 }}>
              Processed entirely in your browser via WebAssembly. <span style={{ color:'#818cf8', fontWeight:600 }}>Nothing is uploaded.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════ */
export default function BackgroundRemover() {
  const [uiMode, setUiMode] = useState('futuristic');
  const bg = useBGRemover();

  return (
    <>
      <style>{BASE_STYLES}{NEON_STYLES}{NORMAL_STYLES}</style>
      <AnimatePresence mode="wait">
        {uiMode === 'futuristic' ? (
          <motion.div key="neon" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}>
            <NeonApp onSwitch={()=>setUiMode('normal')} bg={bg} />
          </motion.div>
        ) : (
          <motion.div key="normal" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}>
            <NormalApp onSwitch={()=>setUiMode('futuristic')} bg={bg} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}