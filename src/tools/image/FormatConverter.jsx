import React, { useState, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════
   BASE STYLES
═══════════════════════════════════════════════════════ */
const BASE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }

  @keyframes holo  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes scan  { 0%{top:-4px} 100%{top:100%} }
  @keyframes spin  { to{transform:rotate(360deg)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
  @keyframes bar-in { from{width:0} }

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
  .spin-anim  { animation: spin .9s linear infinite; }
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
  .n-btn.success:hover { background:rgba(0,255,136,.07); box-shadow:0 0 32px rgba(0,255,136,.3); }
  .n-btn.purple { border-color:var(--n2); color:var(--n2); box-shadow:0 0 16px rgba(191,0,255,.15); }
  .n-btn.purple:hover { background:rgba(191,0,255,.07); box-shadow:0 0 32px rgba(191,0,255,.3); }

  .n-ghost {
    display:inline-flex; align-items:center; gap:6px; padding:8px 14px;
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
    background:rgba(0,255,247,.015); cursor:pointer; transition:all .2s; position:relative; overflow:hidden;
  }
  .n-drop:hover,.n-drop.over { border-color:rgba(0,255,247,.6); background:rgba(0,255,247,.04); box-shadow:0 0 28px rgba(0,255,247,.1); }

  .n-fmt-card {
    border:1px solid var(--bdr); border-radius:3px; padding:14px 12px; cursor:pointer;
    background:rgba(0,0,0,.3); text-align:center; transition:all .2s; position:relative; overflow:hidden;
  }
  .n-fmt-card::before { content:''; position:absolute; inset:0; background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,247,.004) 3px,rgba(0,255,247,.004) 4px); }
  .n-fmt-card:hover { border-color:rgba(0,255,247,.3); box-shadow:0 0 16px rgba(0,255,247,.08); transform:translateY(-2px); }
  .n-fmt-card.active { border-color:var(--n); background:rgba(0,255,247,.07); box-shadow:0 0 20px rgba(0,255,247,.15); }

  input[type=range].n-slider { -webkit-appearance:none; width:100%; height:2px; background:linear-gradient(90deg,var(--n2),var(--n)); outline:none; cursor:pointer; }
  input[type=range].n-slider::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:var(--bg); border:2px solid var(--n); box-shadow:0 0 8px var(--n); cursor:pointer; }

  .n-stat { border:1px solid var(--bdr); border-radius:2px; background:rgba(0,0,0,.4); padding:12px 14px; text-align:center; position:relative; overflow:hidden; }
  .n-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--n),transparent); }

  .n-prog-track { height:3px; background:rgba(0,255,247,.08); overflow:hidden; position:relative; }
  .n-prog-fill  { height:100%; background:linear-gradient(90deg,var(--n2),var(--n)); box-shadow:0 0 8px var(--n); transition:width .3s; }
  .n-prog-shim  { position:absolute; top:0; bottom:0; width:60%; background:linear-gradient(90deg,transparent,rgba(0,255,247,.35),transparent); animation:shimmer 1.4s ease-in-out infinite; }
`;

/* ═══════════════════════════════════════════════════════
   NORMAL STYLES
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
  .nm-btn.success { background:linear-gradient(135deg,#10b981,#059669); box-shadow:0 4px 16px rgba(16,185,129,.35); }
  .nm-btn.success:hover { box-shadow:0 8px 24px rgba(16,185,129,.5); }
  .nm-btn.purple { background:linear-gradient(135deg,#8b5cf6,#ec4899); box-shadow:0 4px 16px rgba(139,92,246,.35); }
  .nm-btn.purple:hover { box-shadow:0 8px 24px rgba(139,92,246,.5); }

  .nm-ghost {
    display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:8px;
    border:1.5px solid #2d3561; background:transparent; color:#64748b; cursor:pointer;
    font-family:'Inter',sans-serif; font-size:11px; font-weight:600; transition:all .15s;
  }
  .nm-ghost:hover { border-color:#6366f1; color:#818cf8; background:rgba(99,102,241,.08); }
  .nm-ghost.active { border-color:#6366f1; color:#818cf8; background:rgba(99,102,241,.12); }

  .nm-drop {
    border:2px dashed #2d3561; border-radius:14px;
    background:#0f0f23; cursor:pointer; transition:all .2s; position:relative; overflow:hidden;
  }
  .nm-drop:hover,.nm-drop.over { border-color:#6366f1; background:rgba(99,102,241,.05); box-shadow:0 0 0 4px rgba(99,102,241,.1); }

  .nm-fmt-card {
    border:1.5px solid #2d3561; border-radius:12px; padding:14px 10px; cursor:pointer;
    background:#0f0f23; text-align:center; transition:all .2s;
  }
  .nm-fmt-card:hover { border-color:#6366f1; transform:translateY(-2px); box-shadow:0 4px 20px rgba(99,102,241,.15); }
  .nm-fmt-card.active { border-color:#6366f1; background:rgba(99,102,241,.12); box-shadow:0 0 0 3px rgba(99,102,241,.15); }

  input[type=range].nm-slider { -webkit-appearance:none; width:100%; height:4px; background:#2d3561; outline:none; cursor:pointer; border-radius:999px; }
  input[type=range].nm-slider::-webkit-slider-thumb { -webkit-appearance:none; width:16px; height:16px; border-radius:50%; background:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.25); cursor:pointer; }

  .nm-stat { background:#0f0f23; border:1px solid #2d3561; border-radius:10px; padding:12px 14px; text-align:center; }

  .nm-prog-track { height:6px; border-radius:999px; background:#2d3561; overflow:hidden; position:relative; }
  .nm-prog-fill  { height:100%; background:linear-gradient(90deg,#4f46e5,#06b6d4); border-radius:999px; transition:width .3s; }
  .nm-prog-shim  { position:absolute; top:0; bottom:0; width:60%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent); animation:shimmer 1.4s ease-in-out infinite; }

  .nm-mode-toggle { display:flex; align-items:center; gap:10px; padding:8px 16px; border-radius:10px; border:1.5px solid #2d3561; background:#16213e; cursor:pointer; transition:all .2s; }
  .nm-mode-toggle:hover { border-color:#6366f1; }

  .nm-section-label { font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:#6366f1; }
`;

/* ═══════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════ */
const Ic = ({ d, s=16, sw=1.8 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {Array.isArray(d) ? d.map((p,i)=><path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const IcoUpload   = ({s=24}) => <Ic s={s} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const IcoDl       = ({s=16}) => <Ic s={s} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />;
const IcoZap      = ({s=16}) => <Ic s={s} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
const IcoReset    = ({s=16}) => <Ic s={s} d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />;
const IcoClose    = ({s=14}) => <Ic s={s} d="M18 6 6 18M6 6l12 12" />;
const IcoArrow    = ({s=18}) => <Ic s={s} d="M5 12h14M12 5l7 7-7 7" />;
const IcoCheck    = ({s=16}) => <Ic s={s} d="M20 6 9 17l-5-5" />;
const IcoImage    = ({s=16}) => <Ic s={s} d={["M21 19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h4l2 3h4a2 2 0 0 1 2 2z","M12 12m-4 0a4 4 0 1 0 8 0 4 4 0 0 0-8 0"]} />;
const IcoSettings = ({s=14}) => <Ic s={s} d={["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z","M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"]} />;

/* ═══════════════════════════════════════════════════════
   FORMAT DATA
═══════════════════════════════════════════════════════ */
const FORMATS = [
  { id:'webp',  label:'WebP',  emoji:'🌐', desc:'Best compression, modern browsers', neonColor:'#00fff7',  nmColor:'#6366f1' },
  { id:'png',   label:'PNG',   emoji:'✨', desc:'Lossless, full transparency',        neonColor:'#00ff88',  nmColor:'#10b981' },
  { id:'jpeg',  label:'JPG',   emoji:'📸', desc:'Universal, great for photos',        neonColor:'#ffaa00',  nmColor:'#f59e0b' },
  { id:'avif',  label:'AVIF',  emoji:'⚡', desc:'Next-gen, ultra-small files',        neonColor:'#bf00ff',  nmColor:'#8b5cf6' },
  { id:'gif',   label:'GIF',   emoji:'🎞️', desc:'Animated, wide support',            neonColor:'#ff003c',  nmColor:'#ef4444' },
  { id:'bmp',   label:'BMP',   emoji:'🗂️', desc:'Uncompressed, max quality',         neonColor:'#7a7aaa',  nmColor:'#64748b' },
];

/* ═══════════════════════════════════════════════════════
   CORE CONVERTER HOOK
═══════════════════════════════════════════════════════ */
function useConverter() {
  const [file, setFile]         = useState(null);   // { url, name, size, type, img }
  const [targetFmt, setTargetFmt] = useState('webp');
  const [quality, setQuality]   = useState(90);
  const [result, setResult]     = useState(null);   // { url, blob, oldKB, newKB, reduction, w, h }
  const [status, setStatus]     = useState('idle'); // idle | converting | done | error
  const [progress, setProgress] = useState(0);
  const [showAdv, setShowAdv]   = useState(false);
  const [batch, setBatch]       = useState([]);     // multiple files
  const [batchResults, setBatchResults] = useState([]);
  const imgRef = useRef(null);

  const loadFile = useCallback((f) => {
    if (!f || !f.type.startsWith('image/')) return;
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setFile({ url, name:f.name, size:f.size, type:f.type, rawFile:f, w:img.naturalWidth, h:img.naturalHeight });
      setResult(null); setStatus('idle'); setProgress(0);
      imgRef.current = img;
    };
    img.src = url;
  }, []);

  const loadBatch = useCallback((files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (valid.length === 1) { loadFile(valid[0]); return; }
    setBatch(valid.map(f => ({ file:f, url:URL.createObjectURL(f), name:f.name, size:f.size })));
    setResult(null); setFile(null); setStatus('idle');
  }, [loadFile]);

  const convert = useCallback(async () => {
    if (!file && batch.length === 0) return;
    setStatus('converting'); setProgress(0);

    // Single file
    if (file) {
      try {
        const img = imgRef.current || await loadImg(file.url);
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d', { alpha: targetFmt !== 'jpeg' });
        ctx.drawImage(img, 0, 0);

        setProgress(50);
        const mime = fmtMime(targetFmt);
        const q = targetFmt === 'png' || targetFmt === 'bmp' ? 1 : quality / 100;

        const blob = await canvasToBlob(canvas, mime, q);
        setProgress(100);

        const oldKB = (file.size / 1024).toFixed(1);
        const newKB = (blob.size / 1024).toFixed(1);
        const reduction = ((file.size - blob.size) / file.size * 100).toFixed(1);

        setResult({
          url: URL.createObjectURL(blob),
          blob, oldKB, newKB, reduction,
          w: canvas.width, h: canvas.height,
          name: baseName(file.name) + '.' + ext(targetFmt),
        });
        setStatus('done');
      } catch {
        console.error('Conversion failed');
        setStatus('error');
      }
    }

    // Batch
    if (batch.length > 0) {
      const results = [];
      for (let i = 0; i < batch.length; i++) {
        const item = batch[i];
        try {
          const img = await loadImg(item.url);
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d', { alpha: targetFmt !== 'jpeg' });
          ctx.drawImage(img, 0, 0);
          const mime = fmtMime(targetFmt);
          const q = targetFmt === 'png' || targetFmt === 'bmp' ? 1 : quality / 100;
          const blob = await canvasToBlob(canvas, mime, q);
          results.push({
            name: baseName(item.name) + '.' + ext(targetFmt),
            url: URL.createObjectURL(blob),
            blob, oldKB: (item.size/1024).toFixed(1), newKB: (blob.size/1024).toFixed(1),
            reduction: ((item.size - blob.size)/item.size*100).toFixed(1),
          });
        } catch { results.push({ name:item.name, error:true }); }
        setProgress(Math.round(((i+1)/batch.length)*100));
      }
      setBatchResults(results);
      setStatus('done');
    }
  }, [file, batch, targetFmt, quality]);

  const downloadSingle = useCallback(() => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url; a.download = result.name; a.click();
  }, [result]);

  const downloadAll = useCallback(() => {
    batchResults.filter(r=>!r.error).forEach((r, i) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = r.url; a.download = r.name; a.click();
      }, i * 120);
    });
  }, [batchResults]);

  const reset = useCallback(() => {
    setFile(null); setResult(null); setBatch([]); setBatchResults([]);
    setStatus('idle'); setProgress(0);
  }, []);

  return {
    file, loadFile, loadBatch, targetFmt, setTargetFmt, quality, setQuality,
    result, status, progress, showAdv, setShowAdv, batch, batchResults,
    convert, downloadSingle, downloadAll, reset,
  };
}

function loadImg(src) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}
function canvasToBlob(canvas, mime, quality) {
  return new Promise(res => canvas.toBlob(res, mime, quality));
}
function fmtMime(fmt) {
  const map = { webp:'image/webp', png:'image/png', jpeg:'image/jpeg', avif:'image/avif', gif:'image/gif', bmp:'image/bmp' };
  return map[fmt] || 'image/webp';
}
function ext(fmt) { return fmt === 'jpeg' ? 'jpg' : fmt; }
function baseName(name) { return name.replace(/\.[^.]+$/, ''); }
function fmtBytes(kb) { return kb > 1024 ? (kb/1024).toFixed(2)+' MB' : kb+' KB'; }

/* ═══════════════════════════════════════════════════════
   FORMAT SELECTOR
═══════════════════════════════════════════════════════ */
function FmtSelector({ current, onChange, neon }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
      {FORMATS.map(f => {
        const active = current === f.id;
        const accentColor = neon ? f.neonColor : f.nmColor;
        return (
          <div key={f.id} onClick={() => onChange(f.id)}
            className={`${neon?'n-fmt-card':'nm-fmt-card'} ${active?'active':''}`}
            style={active ? { borderColor: accentColor, boxShadow:`0 0 16px ${accentColor}33`, background: neon?`${accentColor}0d`:undefined } : {}}>
            <div style={{ fontSize:22, marginBottom:6, position:'relative', zIndex:1 }}>{f.emoji}</div>
            <div style={{ fontSize:12, fontWeight:800, color: active ? accentColor : (neon?'#e2e8ff':'#e2e8f0'), letterSpacing:'.04em', marginBottom:4, position:'relative', zIndex:1 }}>{f.label}</div>
            <div style={{ fontSize:9, color: neon?'#7a7aaa':'#64748b', lineHeight:1.4, position:'relative', zIndex:1 }}>{f.desc}</div>
            {active && (
              <div style={{ position:'absolute', top:6, right:6, width:14, height:14, borderRadius:'50%',
                background: accentColor, display:'flex', alignItems:'center', justifyContent:'center', zIndex:2 }}>
                <IcoCheck s={9} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CONVERTING SPINNER
═══════════════════════════════════════════════════════ */
function Converting({ progress, neon }) {
  return (
    <div style={{ textAlign:'center', padding:'32px 20px' }}>
      <div style={{ width:70, height:70, margin:'0 auto 20px', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, border: neon?'2px solid rgba(0,255,247,.15)':'2px solid rgba(99,102,241,.15)', borderRadius:'50%' }}/>
        <div style={{ position:'absolute', inset:0, border: neon?'2px solid transparent':'2px solid transparent',
          borderTopColor: neon?'#00fff7':'#6366f1', borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
        <div style={{ position:'absolute', inset:10, border: neon?'1px solid rgba(191,0,255,.2)':'1px solid rgba(6,182,212,.2)',
          borderTopColor: neon?'#bf00ff':'#06b6d4', borderRadius:'50%', animation:'spin 1.2s linear infinite reverse' }}/>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <IcoArrow s={18} />
        </div>
      </div>
      <div style={{ fontSize: neon?10:11, fontWeight:700, color: neon?'rgba(0,255,247,.5)':'#6366f1', letterSpacing:'.16em', textTransform:'uppercase', marginBottom:8 }}>
        {neon ? '◈ CONVERTING' : '✦ Converting'}
      </div>
      <div style={{ fontSize:22, fontWeight:900, color: neon?'#00fff7':'#6366f1', marginBottom:16 }}>{progress}%</div>
      <div className={neon?'n-prog-track':'nm-prog-track'} style={{ maxWidth:240, margin:'0 auto' }}>
        <div className={neon?'n-prog-fill':'nm-prog-fill'} style={{ width:`${progress}%` }}/>
        {progress < 100 && <div className={neon?'n-prog-shim':'nm-prog-shim'}/>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RESULT VIEW
═══════════════════════════════════════════════════════ */
function ResultView({ result, batchResults, targetFmt, onDownload, onDownloadAll, onReset, neon, isBatch }) {
  const fmt = FORMATS.find(f => f.id === targetFmt) || FORMATS[0];
  const accentColor = neon ? fmt.neonColor : fmt.nmColor;
  const successCount = batchResults.filter(r=>!r.error).length;

  return (
    <motion.div initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{duration:.35}}>

      {/* Preview (single only) */}
      {!isBatch && result && (
        <div style={{ marginBottom:20, position:'relative', maxWidth:360, margin:'0 auto 20px' }}>
          <div style={{ borderRadius: neon?2:12, overflow:'hidden', border: neon?`1px solid ${accentColor}40`:`1.5px solid rgba(99,102,241,.25)`,
            boxShadow: neon?`0 0 40px ${accentColor}18`:'0 8px 40px rgba(0,0,0,.4)' }}>
            <img src={result.url} alt="converted"
              style={{ display:'block', width:'100%', maxHeight:260, objectFit:'contain', background: neon?'rgba(0,0,0,.4)':'#0f0f23' }} />
          </div>
          {/* Success badge */}
          <div style={{ position:'absolute', top:10, left:10, display:'flex', alignItems:'center', gap:5,
            padding:'4px 10px', borderRadius: neon?2:999, background: neon?'rgba(1,1,8,.9)':'rgba(26,26,46,.95)',
            border: neon?`1px solid ${accentColor}`:`1.5px solid ${accentColor}`, fontSize:9, fontWeight:700,
            color: accentColor, letterSpacing:'.1em', textTransform:'uppercase' }}>
            <IcoCheck s={10}/> CONVERTED
          </div>
        </div>
      )}

      {/* Stats row */}
      {!isBatch && result && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:16 }}>
          {[
            ['ORIGINAL', fmtBytes(parseFloat(result.oldKB)), null],
            ['OUTPUT',   fmtBytes(parseFloat(result.newKB)), accentColor],
            ['SAVED',    `${result.reduction}%`, neon?'#00ff88':'#10b981'],
            ['SIZE',     `${result.w}×${result.h}`, null],
          ].map(([k,v,c]) => (
            <div key={k} className={neon?'n-stat':'nm-stat'}>
              <div style={{ fontSize:7, fontWeight:700, color: neon?'rgba(0,255,247,.4)':'#475569', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:4 }}>{k}</div>
              <div style={{ fontSize:13, fontWeight:800, color: c || (neon?'#e2e8ff':'#e2e8f0') }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {/* Savings bar */}
      {!isBatch && result && (
        <div style={{ marginBottom:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ fontSize:10, fontWeight:600, color: neon?'#7a7aaa':'#64748b' }}>File size reduction</span>
            <span style={{ fontSize:11, fontWeight:700, color: neon?'#00ff88':'#10b981' }}>−{result.reduction}%</span>
          </div>
          <div className={neon?'n-prog-track':'nm-prog-track'} style={{ height: neon?4:8 }}>
            <motion.div className={neon?'n-prog-fill':'nm-prog-fill'} initial={{width:0}}
              animate={{width:`${Math.min(100,Math.max(0,parseFloat(result.reduction)))}%`}} transition={{duration:.6}} />
          </div>
        </div>
      )}

      {/* Batch list */}
      {isBatch && (
        <div style={{ marginBottom:16, maxHeight:220, overflowY:'auto' }}>
          <div style={{ fontSize:9, fontWeight:700, color: neon?'rgba(0,255,247,.4)':'#6366f1', letterSpacing:'.16em', textTransform:'uppercase', marginBottom:10 }}>
            {neon ? '◈ BATCH RESULTS' : '✦ Batch Results'}
          </div>
          {batchResults.map((r,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 10px',
              border: neon?'1px solid #1e1e42':'1.5px solid #2d3561', borderRadius: neon?2:8, marginBottom:5,
              background: neon?'rgba(0,0,0,.3)':'rgba(15,15,35,.5)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, overflow:'hidden' }}>
                {r.error
                  ? <span style={{ fontSize:12, color:'#ff003c' }}>✗</span>
                  : <span style={{ fontSize:12, color: neon?'#00ff88':'#10b981' }}>✓</span>}
                <span style={{ fontSize:11, color: neon?'#e2e8ff':'#e2e8f0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.name}</span>
              </div>
              {!r.error && (
                <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                  <span style={{ fontSize:10, color: neon?'#7a7aaa':'#64748b' }}>{r.oldKB}→{r.newKB} KB</span>
                  <button onClick={() => { const a=document.createElement('a'); a.href=r.url; a.download=r.name; a.click(); }}
                    style={{ border:'none', background:'none', cursor:'pointer', color: neon?'#00fff7':'#6366f1', display:'flex' }}>
                    <IcoDl s={13}/>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── DOWNLOAD SECTION ── */}
      <div className={neon?'n-panel n-corner':'nm-card'} style={{ padding:'20px 22px' }}>
        <div style={{ fontSize: neon?8:10, fontWeight:700, color: neon?'rgba(0,255,247,.5)':accentColor,
          letterSpacing:'.18em', textTransform:'uppercase', marginBottom:14 }}>
          {neon ? '◈ DOWNLOAD RESULT' : '✦ Download Result'}
        </div>

        <div style={{ display:'flex', gap:10, marginBottom:12, flexWrap:'wrap' }}>
          {/* Primary download */}
          {!isBatch && result && (
            <button className={`${neon?'n-btn':'nm-btn'} success`} style={{ flex:1, justifyContent:'center', minWidth:140 }}
              onClick={onDownload}>
              <IcoDl s={14}/> {neon?'DOWNLOAD':'Download'} .{ext(targetFmt).toUpperCase()}
            </button>
          )}
          {isBatch && successCount > 0 && (
            <button className={`${neon?'n-btn':'nm-btn'} success`} style={{ flex:1, justifyContent:'center', minWidth:140 }}
              onClick={onDownloadAll}>
              <IcoDl s={14}/> {neon?`DOWNLOAD ALL (${successCount})`:`Download All (${successCount})`}
            </button>
          )}
          <button className={`${neon?'n-ghost':'nm-ghost'}`} onClick={onReset} style={{ flex:'0 0 auto' }}>
            <IcoReset s={12}/> {neon?'CONVERT ANOTHER':'Convert Another'}
          </button>
        </div>

        {/* Format info tiles */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {[
            ['FORMAT', fmt.label + ' — ' + fmt.desc],
            ['QUALITY', targetFmt === 'png' || targetFmt === 'bmp' ? 'Lossless (100%)' : `${neon?'':''}${isBatch?'Batch':'Quality'} applied`],
          ].map(([k,v]) => (
            <div key={k} style={{ padding:'9px 12px', border: neon?'1px solid #1e1e42':'1.5px solid #2d3561',
              borderRadius: neon?2:8, background: neon?'rgba(0,0,0,.35)':'#0f0f23' }}>
              <div style={{ fontSize:7, fontWeight:700, color: neon?'rgba(0,255,247,.4)':accentColor, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:3 }}>{k}</div>
              <div style={{ fontSize:10, fontWeight:600, color: neon?'#e2e8ff':'#e2e8f0' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   NEON APP
═══════════════════════════════════════════════════════ */
function NeonApp({ onSwitch, cv }) {
  const { file, loadBatch, targetFmt, setTargetFmt, quality, setQuality,
    result, status, progress, showAdv, setShowAdv, batch, batchResults,
    convert, downloadSingle, downloadAll, reset } = cv;
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();
  const isBatch = batch.length > 1;
  const hasSrc = file || isBatch;

  return (
    <div className="neon-root" style={{ minHeight:'100vh' }}>
      <div className="scan-line"/>

      {/* TOP BAR */}
      <div style={{ background:'rgba(1,1,8,.95)', borderBottom:'1px solid #1e1e42', padding:'0 24px',
        display:'flex', alignItems:'center', gap:14, height:54, position:'sticky', top:0, zIndex:50, backdropFilter:'blur(10px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:30,height:30,border:'1px solid rgba(0,255,247,.4)',display:'flex',alignItems:'center',justifyContent:'center',color:'#00fff7',boxShadow:'0 0 10px rgba(0,255,247,.2)' }}>
            <IcoArrow s={14}/>
          </div>
          <span style={{ fontSize:15, fontWeight:800, letterSpacing:'.04em', color:'#e2e8ff' }}>
            Format<span style={{ color:'#00fff7' }}>Convert</span>
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
          {!hasSrc && status === 'idle' && (
            <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} style={{ textAlign:'center', paddingTop:12, marginBottom:4 }}>
              <div className="n-chip" style={{ marginBottom:14 }}>◈ 100% CLIENT-SIDE · NO UPLOAD NEEDED</div>
              <h1 style={{ fontSize:'clamp(26px,4vw,52px)', fontWeight:900, lineHeight:.95, letterSpacing:'-.02em', marginBottom:10 }}>
                <span style={{ color:'#e2e8ff' }}>CONVERT ANY</span><br/>
                <span className="holo-txt">IMAGE FORMAT</span>
              </h1>
              <p style={{ fontSize:13, color:'#7a7aaa', maxWidth:400, margin:'0 auto', lineHeight:1.75 }}>
                WebP · PNG · JPG · AVIF · GIF · BMP — instant browser conversion, zero upload, zero data collection.
              </p>
            </motion.div>
          )}

          {/* Drop zone */}
          {!hasSrc && (
            <div className={`n-drop ${drag?'over':''}`}
              style={{ flex:1, minHeight:280, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, textAlign:'center' }}
              onDragOver={e=>{e.preventDefault();setDrag(true)}}
              onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);loadBatch(e.dataTransfer.files);}}
              onClick={()=>fileRef.current.click()}>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={e=>loadBatch(e.target.files)} />
              <div style={{ color:'rgba(0,255,247,.3)', marginBottom:18 }}><IcoUpload s={48}/></div>
              <div style={{ fontSize:14, fontWeight:700, color:'#e2e8ff', marginBottom:8 }}>DROP IMAGES HERE</div>
              <div style={{ fontSize:10, color:'#7a7aaa', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:20 }}>SINGLE OR BATCH · JPG · PNG · WEBP · AVIF · GIF</div>
              <button className="n-btn" style={{ pointerEvents:'none' }}><IcoUpload s={13}/> CHOOSE FILES</button>
            </div>
          )}

          {/* Converting state */}
          {hasSrc && status === 'converting' && (
            <div className="n-panel n-corner" style={{ flex:1, minHeight:280, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Converting progress={progress} neon={true} />
            </div>
          )}

          {/* Idle with file loaded */}
          {hasSrc && status === 'idle' && (
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{ flex:1, display:'flex', flexDirection:'column', gap:12 }}>
              {/* Image preview */}
              {file && (
                <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                  <div style={{ width:90, height:90, borderRadius:2, overflow:'hidden', border:'1px solid #1e1e42', flexShrink:0 }}>
                    <img src={file.url} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#e2e8ff', marginBottom:4, wordBreak:'break-all' }}>{file.name}</div>
                    <div style={{ fontSize:10, color:'#7a7aaa' }}>{fmtBytes(file.size/1024)} · {file.w}×{file.h}px</div>
                    <div style={{ fontSize:9, color:'rgba(0,255,247,.45)', marginTop:4, letterSpacing:'.1em', textTransform:'uppercase' }}>{file.type.split('/')[1].toUpperCase()}</div>
                  </div>
                </div>
              )}
              {isBatch && (
                <div style={{ padding:'10px 14px', border:'1px solid rgba(0,255,247,.2)', borderRadius:2, background:'rgba(0,255,247,.03)' }}>
                  <div style={{ fontSize:9, fontWeight:700, color:'rgba(0,255,247,.5)', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:6 }}>◈ BATCH MODE — {batch.length} FILES</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                    {batch.map((b,i) => (
                      <span key={i} style={{ fontSize:9, padding:'2px 8px', border:'1px solid #1e1e42', borderRadius:2, color:'#7a7aaa' }}>{b.name}</span>
                    ))}
                  </div>
                </div>
              )}

              <button className="n-btn" style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:12 }} onClick={convert}>
                <IcoArrow s={14}/> CONVERT TO {targetFmt.toUpperCase()}
              </button>
              <button className="n-ghost" onClick={reset} style={{ width:'100%', justifyContent:'center' }}>
                <IcoClose s={12}/> CLEAR
              </button>
            </motion.div>
          )}

          {/* Done state */}
          {status === 'done' && (
            <ResultView result={result} batchResults={batchResults} targetFmt={targetFmt}
              onDownload={downloadSingle} onDownloadAll={downloadAll} onReset={reset}
              neon={true} isBatch={isBatch} />
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ borderLeft:'1px solid #1e1e42', background:'linear-gradient(180deg,rgba(7,7,26,.98),rgba(4,4,15,.99))', padding:'20px 16px', overflowY:'auto' }}>
          <div style={{ fontSize:8, fontWeight:700, color:'rgba(0,255,247,.45)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:14 }}>◈ TARGET FORMAT</div>
          <FmtSelector current={targetFmt} onChange={setTargetFmt} neon={true} />

          <div style={{ height:1, background:'#1e1e42', margin:'18px 0' }}/>

          {/* Advanced */}
          <button className={`n-ghost ${showAdv?'active':''}`} style={{ width:'100%', justifyContent:'center', marginBottom:10 }}
            onClick={()=>setShowAdv(!showAdv)}>
            <IcoSettings s={12}/> {showAdv ? 'HIDE OPTIONS' : 'ADVANCED OPTIONS'}
          </button>
          <AnimatePresence>
            {showAdv && (
              <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} style={{overflow:'hidden'}}>
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:9, fontWeight:600, color:'#7a7aaa', letterSpacing:'.1em', textTransform:'uppercase' }}>QUALITY</span>
                    <span style={{ fontSize:11, fontWeight:700, color:'#00fff7' }}>{quality}%</span>
                  </div>
                  <input type="range" className="n-slider" min="10" max="100" value={quality} onChange={e=>setQuality(+e.target.value)} />
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
                    {[{l:'SMALL',v:60},{l:'GOOD',v:80},{l:'BEST',v:95}].map(p=>(
                      <button key={p.l} onClick={()=>setQuality(p.v)} style={{ fontSize:8, fontWeight:600, color:quality===p.v?'#00fff7':'#7a7aaa', background:'none', border:'none', cursor:'pointer', letterSpacing:'.1em' }}>{p.l}</button>
                    ))}
                  </div>
                  {(targetFmt === 'png' || targetFmt === 'bmp') && (
                    <div style={{ fontSize:9, color:'rgba(255,170,0,.7)', marginTop:6, padding:'5px 8px', border:'1px solid rgba(255,170,0,.2)', borderRadius:2 }}>
                      ◈ PNG/BMP is always lossless
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ height:1, background:'#1e1e42', margin:'14px 0' }}/>
          <div style={{ fontSize:8, fontWeight:700, color:'rgba(0,255,247,.45)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:12 }}>◈ FORMAT GUIDE</div>
          {FORMATS.map(f=>(
            <div key={f.id} style={{ display:'flex', gap:8, marginBottom:10, alignItems:'flex-start' }}>
              <span style={{ fontSize:14, flexShrink:0 }}>{f.emoji}</span>
              <div>
                <span style={{ fontSize:10, fontWeight:700, color:f.neonColor }}>{f.label}</span>
                <span style={{ fontSize:9, color:'#7a7aaa', marginLeft:6 }}>{f.desc}</span>
              </div>
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
function NormalApp({ onSwitch, cv }) {
  const { file, loadBatch, targetFmt, setTargetFmt, quality, setQuality,
    result, status, progress, showAdv, setShowAdv, batch, batchResults,
    convert, downloadSingle, downloadAll, reset } = cv;
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();
  const isBatch = batch.length > 1;
  const hasSrc = file || isBatch;
  const fmt = FORMATS.find(f => f.id === targetFmt) || FORMATS[0];

  return (
    <div className="nm-root" style={{ minHeight:'100vh' }}>

      {/* TOP BAR */}
      <div style={{ background:'#16213e', borderBottom:'1px solid #2d3561', padding:'0 24px',
        display:'flex', alignItems:'center', gap:14, height:54, position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#4f46e5,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff' }}>
            <IcoArrow s={14}/>
          </div>
          <span style={{ fontSize:15, fontWeight:800, color:'#e2e8f0', letterSpacing:'-.01em' }}>
            Format<span style={{ color:'#6366f1' }}>Convert</span>
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
          {!hasSrc && status === 'idle' && (
            <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} style={{ textAlign:'center', paddingTop:10, marginBottom:4 }}>
              <div style={{ display:'inline-block', padding:'3px 12px', borderRadius:6, background:'rgba(99,102,241,.12)', border:'1.5px solid rgba(99,102,241,.25)', fontSize:10, fontWeight:700, color:'#818cf8', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14 }}>
                ✦ 100% Client-Side · No Upload Needed
              </div>
              <h1 style={{ fontSize:'clamp(22px,3.5vw,44px)', fontWeight:900, lineHeight:1.05, letterSpacing:'-.025em', marginBottom:10, color:'#e2e8f0' }}>
                Convert Any<br/>
                <span style={{ background:'linear-gradient(135deg,#4f46e5,#06b6d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  Image Format
                </span>
              </h1>
              <p style={{ fontSize:13, color:'#64748b', maxWidth:380, margin:'0 auto', lineHeight:1.8 }}>
                WebP · PNG · JPG · AVIF · GIF · BMP — instant browser conversion, zero upload.
              </p>
            </motion.div>
          )}

          {/* Drop zone */}
          {!hasSrc && (
            <div className={`nm-drop ${drag?'over':''}`}
              style={{ flex:1, minHeight:260, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, textAlign:'center' }}
              onDragOver={e=>{e.preventDefault();setDrag(true)}}
              onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);loadBatch(e.dataTransfer.files);}}
              onClick={()=>fileRef.current.click()}>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={e=>loadBatch(e.target.files)} />
              <div style={{ color:'#475569', marginBottom:16 }}><IcoUpload s={44}/></div>
              <div style={{ fontSize:15, fontWeight:700, color:'#e2e8f0', marginBottom:8 }}>Drop images here</div>
              <div style={{ fontSize:12, color:'#64748b', marginBottom:20 }}>Single or batch · JPG, PNG, WebP, AVIF, GIF</div>
              <button className="nm-btn" style={{ pointerEvents:'none' }}><IcoUpload s={14}/> Choose Files</button>
            </div>
          )}

          {/* Converting */}
          {hasSrc && status === 'converting' && (
            <div className="nm-card" style={{ flex:1, minHeight:260, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Converting progress={progress} neon={false} />
            </div>
          )}

          {/* Idle with file */}
          {hasSrc && status === 'idle' && (
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} style={{ flex:1, display:'flex', flexDirection:'column', gap:12 }}>
              {file && (
                <div className="nm-card" style={{ display:'flex', gap:14, alignItems:'flex-start', padding:16 }}>
                  <div style={{ width:80, height:80, borderRadius:8, overflow:'hidden', border:'1.5px solid #2d3561', flexShrink:0 }}>
                    <img src={file.url} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#e2e8f0', marginBottom:4, wordBreak:'break-all' }}>{file.name}</div>
                    <div style={{ fontSize:11, color:'#64748b' }}>{fmtBytes(file.size/1024)} · {file.w}×{file.h}px</div>
                    <div style={{ fontSize:10, fontWeight:700, color:'#6366f1', marginTop:4 }}>{file.type.split('/')[1].toUpperCase()}</div>
                  </div>
                </div>
              )}
              {isBatch && (
                <div className="nm-card" style={{ padding:14 }}>
                  <div className="nm-section-label" style={{ marginBottom:8 }}>Batch Mode — {batch.length} files</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                    {batch.map((b,i) => (
                      <span key={i} style={{ fontSize:10, padding:'3px 10px', border:'1.5px solid #2d3561', borderRadius:6, color:'#64748b' }}>{b.name}</span>
                    ))}
                  </div>
                </div>
              )}

              <button className="nm-btn" style={{ width:'100%', justifyContent:'center', padding:'14px', fontSize:14 }} onClick={convert}>
                <IcoArrow s={15}/> Convert to {fmt.label}
              </button>
              <button className="nm-ghost" onClick={reset} style={{ width:'100%', justifyContent:'center' }}>
                <IcoClose s={13}/> Clear
              </button>
            </motion.div>
          )}

          {/* Done */}
          {status === 'done' && (
            <ResultView result={result} batchResults={batchResults} targetFmt={targetFmt}
              onDownload={downloadSingle} onDownloadAll={downloadAll} onReset={reset}
              neon={false} isBatch={isBatch} />
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ borderLeft:'1px solid #2d3561', background:'#16213e', padding:'20px 16px', overflowY:'auto' }}>
          <div className="nm-section-label" style={{ marginBottom:14 }}>Target Format</div>
          <FmtSelector current={targetFmt} onChange={setTargetFmt} neon={false} />

          <div style={{ height:1, background:'#2d3561', margin:'18px 0' }}/>

          <button className={`nm-ghost ${showAdv?'active':''}`} style={{ width:'100%', justifyContent:'center', marginBottom:10 }}
            onClick={()=>setShowAdv(!showAdv)}>
            <IcoSettings s={12}/> {showAdv ? 'Hide Options' : 'Advanced Options'}
          </button>
          <AnimatePresence>
            {showAdv && (
              <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} style={{overflow:'hidden'}}>
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:11, fontWeight:600, color:'#64748b' }}>Quality</span>
                    <span style={{ fontSize:12, fontWeight:700, color:'#6366f1' }}>{quality}%</span>
                  </div>
                  <input type="range" className="nm-slider" min="10" max="100" value={quality} onChange={e=>setQuality(+e.target.value)} />
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
                    {[{l:'Small',v:60},{l:'Good',v:80},{l:'Best',v:95}].map(p=>(
                      <button key={p.l} onClick={()=>setQuality(p.v)} style={{ fontSize:11, fontWeight:600, color:quality===p.v?'#6366f1':'#475569', background:'none', border:'none', cursor:'pointer' }}>{p.l}</button>
                    ))}
                  </div>
                  {(targetFmt === 'png' || targetFmt === 'bmp') && (
                    <div style={{ fontSize:10, color:'#f59e0b', marginTop:8, padding:'6px 10px', border:'1.5px solid rgba(245,158,11,.25)', borderRadius:8, background:'rgba(245,158,11,.06)' }}>
                      PNG/BMP is always lossless
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ height:1, background:'#2d3561', margin:'14px 0' }}/>
          <div className="nm-section-label" style={{ marginBottom:12 }}>Format Guide</div>
          {FORMATS.map(f=>(
            <div key={f.id} style={{ display:'flex', gap:8, marginBottom:10, alignItems:'flex-start' }}>
              <span style={{ fontSize:14, flexShrink:0 }}>{f.emoji}</span>
              <div>
                <span style={{ fontSize:11, fontWeight:700, color:f.nmColor }}>{f.label}</span>
                <span style={{ fontSize:10, color:'#64748b', marginLeft:6 }}>{f.desc}</span>
              </div>
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
export default function FormatConverter() {
  const [uiMode, setUiMode] = useState('futuristic');
  const cv = useConverter();

  return (
    <>
      <style>{BASE_STYLES}{NEON_STYLES}{NORMAL_STYLES}</style>
      <AnimatePresence mode="wait">
        {uiMode === 'futuristic' ? (
          <motion.div key="neon" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}>
            <NeonApp onSwitch={()=>setUiMode('normal')} cv={cv} />
          </motion.div>
        ) : (
          <motion.div key="normal" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}>
            <NormalApp onSwitch={()=>setUiMode('futuristic')} cv={cv} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}