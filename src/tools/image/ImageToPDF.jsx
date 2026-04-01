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

  @keyframes holo    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes scan    { 0%{top:-4px} 100%{top:100%} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
  @keyframes pop-in  { 0%{opacity:0;transform:scale(.85)} 100%{opacity:1;transform:scale(1)} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }

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
  .n-btn.danger  { border-color:var(--dng); color:var(--dng); box-shadow:0 0 12px rgba(255,0,60,.12); }
  .n-btn.danger:hover { background:rgba(255,0,60,.07); }

  .n-ghost {
    display:inline-flex; align-items:center; gap:6px; padding:7px 13px;
    border:1px solid var(--bdr); border-radius:2px; background:transparent; color:var(--sub);
    cursor:pointer; font-family:'Inter',sans-serif; font-size:10px; font-weight:500; letter-spacing:.08em;
    transition:all .18s;
  }
  .n-ghost:hover { border-color:var(--n); color:var(--n); background:rgba(0,255,247,.04); }
  .n-ghost:disabled { opacity:.3; cursor:not-allowed; }

  .n-chip { display:inline-block; padding:3px 10px; border:1px solid rgba(0,255,247,.25); border-radius:2px; font-size:8px; font-weight:700; letter-spacing:.14em; color:rgba(0,255,247,.6); text-transform:uppercase; }

  .n-mode-toggle { display:flex; align-items:center; gap:10px; padding:7px 14px; border:1px solid rgba(0,255,247,.25); border-radius:2px; background:rgba(0,255,247,.03); cursor:pointer; transition:all .2s; }
  .n-mode-toggle:hover { border-color:var(--n); box-shadow:0 0 12px rgba(0,255,247,.12); }

  .n-drop {
    border:2px dashed rgba(0,255,247,.2); border-radius:2px;
    background:rgba(0,255,247,.015); cursor:pointer; transition:all .2s; position:relative;
  }
  .n-drop:hover,.n-drop.over { border-color:rgba(0,255,247,.6); background:rgba(0,255,247,.04); box-shadow:0 0 28px rgba(0,255,247,.1); }
  .n-drop.has-files { border-color:rgba(0,255,247,.35); background:rgba(0,255,247,.025); }

  .n-select {
    background:rgba(0,0,0,.5); border:1px solid var(--bdr); border-radius:2px;
    color:var(--txt); font-family:'Inter',sans-serif; font-size:11px; padding:7px 10px;
    outline:none; cursor:pointer; appearance:none; transition:border-color .2s;
  }
  .n-select:focus { border-color:var(--n); }

  .n-prog-track { height:3px; background:rgba(0,255,247,.08); overflow:hidden; position:relative; }
  .n-prog-fill  { height:100%; background:linear-gradient(90deg,var(--n2),var(--n)); box-shadow:0 0 8px var(--n); transition:width .25s; }
  .n-prog-shim  { position:absolute; top:0; bottom:0; width:60%; background:linear-gradient(90deg,transparent,rgba(0,255,247,.35),transparent); animation:shimmer 1.4s ease-in-out infinite; }

  .n-stat { border:1px solid var(--bdr); border-radius:2px; background:rgba(0,0,0,.4); padding:14px 16px; text-align:center; position:relative; overflow:hidden; }
  .n-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,var(--n),transparent); }

  /* Image thumb */
  .n-thumb {
    position:relative; aspect-ratio:3/4; border:1px solid var(--bdr); border-radius:2px;
    overflow:hidden; background:rgba(0,0,0,.4); transition:all .18s; cursor:pointer;
  }
  .n-thumb:hover { border-color:rgba(0,255,247,.4); box-shadow:0 0 14px rgba(0,255,247,.12); }
  .n-thumb .overlay {
    position:absolute; inset:0; background:rgba(0,0,0,.8);
    opacity:0; transition:opacity .18s; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:6px;
  }
  .n-thumb:hover .overlay { opacity:1; }

  .n-icon-btn {
    width:28px; height:28px; border:1px solid rgba(255,255,255,.2); border-radius:2px;
    display:flex; align-items:center; justify-content:center; background:transparent;
    color:rgba(255,255,255,.7); cursor:pointer; transition:all .15s;
  }
  .n-icon-btn:hover { border-color:var(--n); color:var(--n); }
  .n-icon-btn:disabled { opacity:.2; cursor:not-allowed; }
  .n-icon-btn.del:hover { border-color:var(--dng); color:var(--dng); }
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
  .nm-btn.danger  { background:linear-gradient(135deg,#ef4444,#dc2626); box-shadow:0 4px 16px rgba(239,68,68,.3); }

  .nm-ghost {
    display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:8px;
    border:1.5px solid #2d3561; background:transparent; color:#64748b; cursor:pointer;
    font-family:'Inter',sans-serif; font-size:11px; font-weight:600; transition:all .15s;
  }
  .nm-ghost:hover { border-color:#6366f1; color:#818cf8; background:rgba(99,102,241,.08); }
  .nm-ghost:disabled { opacity:.3; cursor:not-allowed; }

  .nm-drop {
    border:2px dashed #2d3561; border-radius:14px;
    background:#0f0f23; cursor:pointer; transition:all .2s; position:relative;
  }
  .nm-drop:hover,.nm-drop.over { border-color:#6366f1; background:rgba(99,102,241,.05); box-shadow:0 0 0 4px rgba(99,102,241,.1); }
  .nm-drop.has-files { border-color:rgba(99,102,241,.5); }

  .nm-select {
    background:#0f0f23; border:1.5px solid #2d3561; border-radius:8px;
    color:#e2e8f0; font-family:'Inter',sans-serif; font-size:12px; padding:8px 12px;
    outline:none; cursor:pointer; appearance:none; transition:border-color .15s;
  }
  .nm-select:focus { border-color:#6366f1; }

  .nm-prog-track { height:6px; border-radius:999px; background:#2d3561; overflow:hidden; position:relative; }
  .nm-prog-fill  { height:100%; background:linear-gradient(90deg,#4f46e5,#06b6d4); border-radius:999px; transition:width .25s; }
  .nm-prog-shim  { position:absolute; top:0; bottom:0; width:60%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent); animation:shimmer 1.4s ease-in-out infinite; }

  .nm-stat { background:#0f0f23; border:1px solid #2d3561; border-radius:10px; padding:14px 16px; text-align:center; }

  .nm-mode-toggle { display:flex; align-items:center; gap:10px; padding:8px 16px; border-radius:10px; border:1.5px solid #2d3561; background:#16213e; cursor:pointer; transition:all .2s; }
  .nm-mode-toggle:hover { border-color:#6366f1; }
  .nm-section-label { font-size:10px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:#6366f1; }

  /* Image thumb */
  .nm-thumb {
    position:relative; aspect-ratio:3/4; border:1.5px solid #2d3561; border-radius:10px;
    overflow:hidden; background:#0f0f23; transition:all .18s; cursor:pointer;
  }
  .nm-thumb:hover { border-color:#6366f1; box-shadow:0 4px 20px rgba(99,102,241,.2); }
  .nm-thumb .overlay {
    position:absolute; inset:0; background:rgba(0,0,0,.82);
    opacity:0; transition:opacity .18s; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:8px; border-radius:9px;
  }
  .nm-thumb:hover .overlay { opacity:1; }

  .nm-icon-btn {
    width:30px; height:30px; border-radius:7px; border:1.5px solid rgba(255,255,255,.18);
    display:flex; align-items:center; justify-content:center; background:transparent;
    color:rgba(255,255,255,.75); cursor:pointer; transition:all .15s;
  }
  .nm-icon-btn:hover { border-color:#818cf8; color:#818cf8; }
  .nm-icon-btn:disabled { opacity:.2; cursor:not-allowed; }
  .nm-icon-btn.del:hover { border-color:#ef4444; color:#ef4444; }
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
const IcoClose   = ({s=13}) => <Ic s={s} d="M18 6 6 18M6 6l12 12" />;
const IcoUp      = ({s=13}) => <Ic s={s} d="M12 19V5M5 12l7-7 7 7" />;
const IcoDown    = ({s=13}) => <Ic s={s} d="M12 5v14M19 12l-7 7-7-7" />;
const IcoTrash   = ({s=13}) => <Ic s={s} d={["M3 6h18","M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6","M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]} />;
const IcoFile    = ({s=20}) => <Ic s={s} d={["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z","M14 2v6h6"]} />;
const IcoCheck   = ({s=16}) => <Ic s={s} d="M20 6 9 17l-5-5" />;
const IcoPlus    = ({s=16}) => <Ic s={s} d="M12 5v14M5 12h14" />;

/* ═══════════════════════════════════════════════════════
   CORE HOOK
═══════════════════════════════════════════════════════ */
const MAX_IMAGES = 50;

function usePDFMaker() {
  const [images, setImages]   = useState([]);
  const [status, setStatus]   = useState('idle'); // idle | processing | done | error
  const [progress, setProgress] = useState(0);
  const [stageMsg, setStageMsg] = useState('');
  const [result, setResult]   = useState(null);
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const urlsRef = useRef([]);

  const addFiles = useCallback((fileList) => {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    const toAdd = files.slice(0, MAX_IMAGES - images.length);
    toAdd.forEach(f => {
      const url = URL.createObjectURL(f);
      urlsRef.current.push(url);
      setImages(prev => [...prev, {
        id: `img_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
        name: f.name, size: f.size, url, file: f,
      }]);
    });
    setResult(null);
  }, [images.length]);

  const remove = useCallback((id) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.url);
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const moveUp   = useCallback((idx) => setImages(p => { const a=[...p]; if(idx>0){[a[idx-1],a[idx]]=[a[idx],a[idx-1]];} return a; }), []);
  const moveDown = useCallback((idx) => setImages(p => { const a=[...p]; if(idx<a.length-1){[a[idx],a[idx+1]]=[a[idx+1],a[idx]];} return a; }), []);
  const clearAll = useCallback(() => { images.forEach(i=>URL.revokeObjectURL(i.url)); setImages([]); setResult(null); setStatus('idle'); }, [images]);

  const buildPDF = useCallback(async () => {
    if (images.length === 0) return;
    setStatus('processing'); setProgress(0); setStageMsg('Loading jsPDF…');

    try {
      // Lazy-load jsPDF from CDN
      if (!window.jspdf) {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      const { jsPDF } = window.jspdf;

      setStageMsg('Creating document…'); setProgress(10);

      const doc = new jsPDF({ orientation, unit:'mm', format: pageSize });
      const pw = doc.internal.pageSize.getWidth();
      const ph = doc.internal.pageSize.getHeight();
      const margin = 8;
      const cw = pw - margin*2, ch = ph - margin*2;

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        setStageMsg(`Processing image ${i+1} of ${images.length}…`);
        setProgress(10 + Math.round((i / images.length) * 85));

        const dataUrl = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = e => res(e.target.result); r.onerror = rej;
          r.readAsDataURL(img.file);
        });

        const el = new Image();
        el.src = dataUrl;
        await new Promise(r => { el.onload = r; });

        const ratio = el.width / el.height;
        const pratio = cw / ch;
        let fw, fh;
        if (ratio > pratio) { fw = cw; fh = cw / ratio; }
        else                { fh = ch; fw = ch * ratio; }
        const x = margin + (cw - fw) / 2;
        const y = margin + (ch - fh) / 2;

        if (i > 0) doc.addPage();
        doc.addImage(dataUrl, 'JPEG', x, y, fw, fh, undefined, 'FAST');
      }

      setStageMsg('Finalising PDF…'); setProgress(98);
      const blob = doc.output('blob');
      const url  = URL.createObjectURL(blob);
      urlsRef.current.push(url);

      setProgress(100);
      setResult({ url, blob, name:`document_${Date.now()}.pdf`, pages:images.length, sizeMB:(blob.size/1024/1024).toFixed(2) });
      setStatus('done');
    } catch(e) {
      console.error(e);
      setStatus('error');
      setStageMsg('Failed — please try again.');
    }
  }, [images, pageSize, orientation]);

  const download = useCallback(() => {
    if (!result) return;
    const a = document.createElement('a'); a.href=result.url; a.download=result.name; a.click();
  }, [result]);

  return { images, addFiles, remove, moveUp, moveDown, clearAll,
    status, progress, stageMsg, result, buildPDF, download,
    pageSize, setPageSize, orientation, setOrientation };
}

/* ═══════════════════════════════════════════════════════
   PROCESSING VIEW
═══════════════════════════════════════════════════════ */
function Processing({ progress, stageMsg, neon }) {
  return (
    <div style={{ textAlign:'center', padding:'36px 20px' }}>
      <div style={{ width:80, height:80, margin:'0 auto 24px', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, border: neon?'2px solid rgba(0,255,247,.12)':'2px solid rgba(99,102,241,.15)', borderRadius:'50%' }}/>
        <div style={{ position:'absolute', inset:0, border:'2px solid transparent', borderTopColor: neon?'#00fff7':'#6366f1', borderRadius:'50%', animation:'spin .8s linear infinite' }}/>
        <div style={{ position:'absolute', inset:12, border:'2px solid transparent', borderTopColor: neon?'#bf00ff':'#06b6d4', borderRadius:'50%', animation:'spin 1.3s linear infinite reverse' }}/>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color: neon?'#00fff7':'#6366f1' }}>
          <IcoFile s={20}/>
        </div>
      </div>
      <div style={{ fontSize: neon?9:10, fontWeight:700, color: neon?'rgba(0,255,247,.5)':'#6366f1', letterSpacing:'.18em', textTransform:'uppercase', marginBottom:8 }}>
        {neon ? '◈ BUILDING PDF' : '✦ Building PDF'}
      </div>
      <div style={{ fontSize:13, fontWeight:500, color: neon?'#e2e8ff':'#e2e8f0', marginBottom:20 }}>{stageMsg}</div>
      <div style={{ maxWidth:280, margin:'0 auto 8px' }}>
        <div className={neon?'n-prog-track':'nm-prog-track'}>
          <div className={neon?'n-prog-fill':'nm-prog-fill'} style={{ width:`${progress}%` }}/>
          {progress < 100 && <div className={neon?'n-prog-shim':'nm-prog-shim'}/>}
        </div>
      </div>
      <div style={{ fontSize:18, fontWeight:900, color: neon?'#00fff7':'#6366f1' }}>{progress}%</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   IMAGE GRID
═══════════════════════════════════════════════════════ */
function ImageGrid({ images, onRemove, onMoveUp, onMoveDown, neon }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))', gap:8 }}>
      {images.map((img, idx) => (
        <motion.div key={img.id} layout initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.85}}
          className={neon ? 'n-thumb' : 'nm-thumb'}>
          <img src={img.url} alt={img.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} loading="lazy" />

          {/* Page badge */}
          <div style={{ position:'absolute', bottom:5, left:5, padding:'2px 6px',
            background:'rgba(0,0,0,.75)', borderRadius: neon?1:4,
            fontSize:9, fontWeight:700, color: neon?'#00fff7':'#818cf8', letterSpacing:'.06em' }}>
            P{idx+1}
          </div>

          {/* Size badge */}
          <div style={{ position:'absolute', top:5, right:5, padding:'2px 6px',
            background:'rgba(0,0,0,.7)', borderRadius: neon?1:4,
            fontSize:8, color:'rgba(255,255,255,.6)' }}>
            {(img.size/1024/1024).toFixed(1)}MB
          </div>

          {/* Hover overlay */}
          <div className="overlay">
            <div style={{ display:'flex', gap:5 }}>
              <button className={`${neon?'n-icon-btn':'nm-icon-btn'}`} disabled={idx===0} onClick={()=>onMoveUp(idx)}><IcoUp s={12}/></button>
              <button className={`${neon?'n-icon-btn':'nm-icon-btn'}`} disabled={idx===images.length-1} onClick={()=>onMoveDown(idx)}><IcoDown s={12}/></button>
            </div>
            <button className={`${neon?'n-icon-btn del':'nm-icon-btn del'}`} onClick={()=>onRemove(img.id)}><IcoTrash s={12}/></button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RESULT VIEW
═══════════════════════════════════════════════════════ */
function ResultView({ result, onDownload, onReset, neon }) {
  return (
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.35}}>

      {/* Success icon */}
      <div style={{ textAlign:'center', marginBottom:24 }}>
        <div style={{ width:80, height:80, margin:'0 auto 16px', borderRadius:'50%', position:'relative',
          background: neon?'rgba(0,255,136,.08)':'rgba(16,185,129,.1)',
          border: neon?'2px solid rgba(0,255,136,.4)':'2px solid rgba(16,185,129,.4)',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow: neon?'0 0 28px rgba(0,255,136,.2)':'0 0 28px rgba(16,185,129,.15)' }}>
          <IcoCheck s={32} />
        </div>
        <div style={{ fontSize: neon?10:11, fontWeight:700, color: neon?'#00ff88':'#10b981', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:6 }}>
          {neon ? '◈ PDF CREATED SUCCESSFULLY' : '✦ PDF Created Successfully'}
        </div>
        <div style={{ fontSize:13, color: neon?'#7a7aaa':'#64748b' }}>
          {result.pages} page{result.pages>1?'s':''} · {result.sizeMB} MB
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
        {[
          ['PAGES', result.pages, neon?'#00fff7':'#6366f1'],
          ['SIZE',  result.sizeMB+' MB', neon?'#00ff88':'#10b981'],
        ].map(([k,v,c]) => (
          <div key={k} className={neon?'n-stat':'nm-stat'}>
            <div style={{ fontSize:7, fontWeight:700, color: neon?'rgba(0,255,247,.4)':'#475569', letterSpacing:'.16em', textTransform:'uppercase', marginBottom:6 }}>{k}</div>
            <div style={{ fontSize:24, fontWeight:900, color:c }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── DOWNLOAD SECTION ── */}
      <div className={neon?'n-panel n-corner':'nm-card'} style={{ padding:'20px 22px' }}>
        <div style={{ fontSize: neon?8:10, fontWeight:700, color: neon?'rgba(0,255,247,.5)':'#6366f1',
          letterSpacing:'.18em', textTransform:'uppercase', marginBottom:14 }}>
          {neon ? '◈ DOWNLOAD PDF' : '✦ Download PDF'}
        </div>

        <button className={`${neon?'n-btn':'nm-btn'} success`}
          style={{ width:'100%', justifyContent:'center', padding:'14px', marginBottom:10, fontSize: neon?12:14 }}
          onClick={onDownload}>
          <IcoDl s={16}/> {neon ? 'DOWNLOAD PDF' : 'Download PDF'}
        </button>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
          {[
            ['PAGES',   result.pages + ' page' + (result.pages>1?'s':'')],
            ['FORMAT',  'PDF/A — Universal'],
          ].map(([k,v]) => (
            <div key={k} style={{ padding:'9px 12px', border: neon?'1px solid #1e1e42':'1.5px solid #2d3561',
              borderRadius: neon?2:8, background: neon?'rgba(0,0,0,.35)':'#0f0f23' }}>
              <div style={{ fontSize:7, fontWeight:700, color: neon?'rgba(0,255,247,.4)':'#6366f1', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:3 }}>{k}</div>
              <div style={{ fontSize:11, fontWeight:600, color: neon?'#e2e8ff':'#e2e8f0' }}>{v}</div>
            </div>
          ))}
        </div>

        <button className={neon?'n-ghost':'nm-ghost'} onClick={onReset} style={{ width:'100%', justifyContent:'center' }}>
          <IcoReset s={12}/> {neon ? 'CREATE ANOTHER PDF' : 'Create Another PDF'}
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   NEON APP
═══════════════════════════════════════════════════════ */
function NeonApp({ onSwitch, pdf }) {
  const { images, addFiles, remove, moveUp, moveDown, clearAll,
    status, progress, stageMsg, result, buildPDF, download,
    pageSize, setPageSize, orientation, setOrientation } = pdf;
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
            <IcoFile s={14}/>
          </div>
          <span style={{ fontSize:15, fontWeight:800, letterSpacing:'.04em', color:'#e2e8ff' }}>
            Image<span style={{ color:'#00fff7' }}>PDF</span>
          </span>
          <span className="n-chip" style={{ marginLeft:4 }}>CLIENT-SIDE</span>
        </div>
        <div style={{ flex:1 }}/>
        {images.length > 0 && status !== 'processing' && (
          <span style={{ fontSize:9, fontWeight:600, color:'rgba(0,255,247,.45)', letterSpacing:'.1em', textTransform:'uppercase' }}>
            {images.length}/{MAX_IMAGES} IMAGES
          </span>
        )}
        <button className="n-mode-toggle" onClick={onSwitch}>
          <span style={{ fontSize:9, fontWeight:700, color:'#00fff7', letterSpacing:'.1em', textTransform:'uppercase' }}>FUTURISTIC</span>
          <div style={{ width:34,height:18,borderRadius:9,background:'#00fff7',position:'relative',boxShadow:'0 0 8px rgba(0,255,247,.4)' }}>
            <div style={{ position:'absolute',top:2,right:2,width:14,height:14,borderRadius:'50%',background:'#010108' }}/>
          </div>
          <span style={{ fontSize:9, fontWeight:500, color:'#7a7aaa', letterSpacing:'.1em', textTransform:'uppercase' }}>NORMAL</span>
        </button>
      </div>

      {/* BODY */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', minHeight:'calc(100vh - 54px)' }}>

        {/* LEFT */}
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>

          {/* Hero */}
          {images.length === 0 && status === 'idle' && (
            <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} style={{ textAlign:'center', paddingTop:12, marginBottom:4 }}>
              <div className="n-chip" style={{ marginBottom:14 }}>◈ 100% PRIVATE · NO UPLOAD</div>
              <h1 style={{ fontSize:'clamp(26px,4vw,52px)', fontWeight:900, lineHeight:.95, letterSpacing:'-.02em', marginBottom:10 }}>
                <span style={{ color:'#e2e8ff' }}>IMAGES TO</span><br/>
                <span className="holo-txt">PDF IN SECONDS</span>
              </h1>
              <p style={{ fontSize:13, color:'#7a7aaa', maxWidth:400, margin:'0 auto', lineHeight:1.75 }}>
                Merge up to 50 images into a single PDF — drag to reorder, choose page size, convert instantly.
              </p>
            </motion.div>
          )}

          {/* Drop zone */}
          {status !== 'processing' && status !== 'done' && (
            <div className={`n-drop ${drag?'over':''} ${images.length>0?'has-files':''}`}
              style={{ padding: images.length>0?'16px':'40px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', minHeight: images.length>0?'auto':240 }}
              onDragOver={e=>{e.preventDefault();setDrag(true)}}
              onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);addFiles(e.dataTransfer.files);}}
              onClick={()=>fileRef.current.click()}>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={e=>{addFiles(e.target.files);e.target.value='';}} />
              {images.length === 0 ? (
                <>
                  <div style={{ color:'rgba(0,255,247,.3)', marginBottom:16 }}><IcoUpload s={44}/></div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#e2e8ff', marginBottom:6 }}>DROP IMAGES HERE</div>
                  <div style={{ fontSize:9, color:'#7a7aaa', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:18 }}>JPG · PNG · WEBP · UP TO 50 IMAGES</div>
                  <button className="n-btn" style={{ pointerEvents:'none' }}><IcoUpload s={12}/> CHOOSE FILES</button>
                </>
              ) : (
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'4px 0' }}>
                  <IcoPlus s={13}/>
                  <span style={{ fontSize:10, fontWeight:600, color:'rgba(0,255,247,.6)', letterSpacing:'.1em', textTransform:'uppercase' }}>ADD MORE IMAGES</span>
                </div>
              )}
            </div>
          )}

          {/* Processing */}
          {status === 'processing' && (
            <div className="n-panel n-corner" style={{ flex:1, minHeight:280, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Processing progress={progress} stageMsg={stageMsg} neon={true} />
            </div>
          )}

          {/* Image grid */}
          {images.length > 0 && status !== 'processing' && status !== 'done' && (
            <AnimatePresence>
              <ImageGrid images={images} onRemove={remove} onMoveUp={moveUp} onMoveDown={moveDown} neon={true} />
            </AnimatePresence>
          )}

          {/* Convert button */}
          {images.length > 0 && status === 'idle' && (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
              <button className="n-btn" style={{ width:'100%', justifyContent:'center', padding:'15px', fontSize:12 }} onClick={buildPDF}>
                <IcoZap s={14}/> CONVERT {images.length} IMAGE{images.length>1?'S':''} TO PDF
              </button>
            </motion.div>
          )}

          {/* Result */}
          {status === 'done' && result && (
            <ResultView result={result} onDownload={download} onReset={clearAll} neon={true} />
          )}

          {/* Error */}
          {status === 'error' && (
            <div style={{ padding:'14px', border:'1px solid rgba(255,0,60,.3)', borderRadius:2, background:'rgba(255,0,60,.06)', textAlign:'center' }}>
              <div style={{ fontSize:11, color:'#ff003c', fontWeight:600, marginBottom:8 }}>◈ CONVERSION FAILED</div>
              <button className="n-ghost" onClick={clearAll}><IcoReset s={12}/> TRY AGAIN</button>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ borderLeft:'1px solid #1e1e42', background:'linear-gradient(180deg,rgba(7,7,26,.98),rgba(4,4,15,.99))', padding:'20px 16px', overflowY:'auto' }}>

          <div style={{ fontSize:8, fontWeight:700, color:'rgba(0,255,247,.45)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:14 }}>◈ PAGE SETTINGS</div>

          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:8, fontWeight:600, color:'#7a7aaa', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:6 }}>PAGE SIZE</div>
            <select className="n-select" value={pageSize} onChange={e=>setPageSize(e.target.value)} style={{ width:'100%' }}>
              <option value="a4">A4 (210 × 297 mm)</option>
              <option value="letter">Letter (216 × 279 mm)</option>
              <option value="legal">Legal (216 × 356 mm)</option>
              <option value="a3">A3 (297 × 420 mm)</option>
              <option value="a5">A5 (148 × 210 mm)</option>
            </select>
          </div>

          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:8, fontWeight:600, color:'#7a7aaa', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:6 }}>ORIENTATION</div>
            <div style={{ display:'flex', gap:6 }}>
              {['portrait','landscape'].map(o => (
                <button key={o} onClick={()=>setOrientation(o)}
                  style={{ flex:1, padding:'7px 4px', border:`1px solid ${orientation===o?'#00fff7':'#1e1e42'}`, borderRadius:2,
                    background: orientation===o?'rgba(0,255,247,.07)':'transparent',
                    color: orientation===o?'#00fff7':'#7a7aaa', cursor:'pointer',
                    fontFamily:'Inter', fontSize:9, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', transition:'all .15s' }}>
                  {o === 'portrait' ? '⬜ PORT.' : '⬛ LAND.'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height:1, background:'#1e1e42', margin:'0 0 16px' }}/>

          {images.length > 0 && (
            <>
              <div style={{ fontSize:8, fontWeight:700, color:'rgba(0,255,247,.45)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:10 }}>◈ QUEUE</div>
              <div style={{ marginBottom:14 }}>
                {images.map((img,i) => (
                  <div key={img.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 8px',
                    border:'1px solid #1e1e42', borderRadius:2, marginBottom:4, background:'rgba(0,0,0,.3)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, overflow:'hidden' }}>
                      <span style={{ fontSize:9, fontWeight:700, color:'rgba(0,255,247,.35)', width:18, flexShrink:0 }}>P{i+1}</span>
                      <span style={{ fontSize:9, color:'#7a7aaa', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{img.name}</span>
                    </div>
                    <button onClick={()=>remove(img.id)} style={{ border:'none', background:'none', cursor:'pointer', color:'#7a7aaa', padding:2, display:'flex', flexShrink:0 }}>
                      <IcoClose s={10}/>
                    </button>
                  </div>
                ))}
              </div>
              <button className="n-ghost" onClick={clearAll} style={{ width:'100%', justifyContent:'center' }}>
                <IcoTrash s={11}/> CLEAR ALL
              </button>
            </>
          )}

          <div style={{ height:1, background:'#1e1e42', margin:'16px 0' }}/>
          <div style={{ fontSize:8, fontWeight:700, color:'rgba(0,255,247,.45)', letterSpacing:'.2em', textTransform:'uppercase', marginBottom:10 }}>◈ TIPS</div>
          {['Hover a thumbnail to reorder or remove','Up to 50 images per PDF','Images auto-fit to page size','Orientation applies to all pages'].map((t,i)=>(
            <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
              <span style={{ color:'rgba(0,255,247,.25)', fontSize:10, flexShrink:0 }}>◈</span>
              <span style={{ fontSize:10, color:'#7a7aaa', lineHeight:1.5 }}>{t}</span>
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
function NormalApp({ onSwitch, pdf }) {
  const { images, addFiles, remove, moveUp, moveDown, clearAll,
    status, progress, stageMsg, result, buildPDF, download,
    pageSize, setPageSize, orientation, setOrientation } = pdf;
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  return (
    <div className="nm-root" style={{ minHeight:'100vh' }}>

      {/* TOP BAR */}
      <div style={{ background:'#16213e', borderBottom:'1px solid #2d3561', padding:'0 24px',
        display:'flex', alignItems:'center', gap:14, height:54, position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#4f46e5,#06b6d4)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff' }}>
            <IcoFile s={14}/>
          </div>
          <span style={{ fontSize:15, fontWeight:800, color:'#e2e8f0', letterSpacing:'-.01em' }}>
            Image<span style={{ color:'#6366f1' }}>PDF</span>
          </span>
          <span style={{ padding:'2px 8px', borderRadius:6, background:'rgba(99,102,241,.12)', border:'1.5px solid rgba(99,102,241,.3)', fontSize:9, fontWeight:700, color:'#818cf8', letterSpacing:'.08em', textTransform:'uppercase' }}>Client-Side</span>
        </div>
        <div style={{ flex:1 }}/>
        {images.length > 0 && status !== 'processing' && (
          <span style={{ fontSize:11, color:'#64748b' }}>{images.length}/{MAX_IMAGES} images</span>
        )}
        <button className="nm-mode-toggle" onClick={onSwitch}>
          <span style={{ fontSize:12, fontWeight:500, color:'#64748b' }}>Normal</span>
          <div style={{ width:34,height:18,borderRadius:9,background:'#2d3561',position:'relative' }}>
            <div style={{ position:'absolute',top:2,left:2,width:14,height:14,borderRadius:'50%',background:'#475569' }}/>
          </div>
          <span style={{ fontSize:12, fontWeight:700, color:'#818cf8' }}>✦ Futuristic</span>
        </button>
      </div>

      {/* BODY */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', minHeight:'calc(100vh - 54px)' }}>

        {/* LEFT */}
        <div style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>

          {/* Hero */}
          {images.length === 0 && status === 'idle' && (
            <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} style={{ textAlign:'center', paddingTop:10, marginBottom:4 }}>
              <div style={{ display:'inline-block', padding:'3px 12px', borderRadius:6, background:'rgba(99,102,241,.12)', border:'1.5px solid rgba(99,102,241,.25)', fontSize:10, fontWeight:700, color:'#818cf8', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14 }}>
                ✦ 100% Private · No Upload
              </div>
              <h1 style={{ fontSize:'clamp(22px,3.5vw,44px)', fontWeight:900, lineHeight:1.05, letterSpacing:'-.025em', marginBottom:10, color:'#e2e8f0' }}>
                Images to PDF<br/>
                <span style={{ background:'linear-gradient(135deg,#4f46e5,#06b6d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  In Seconds
                </span>
              </h1>
              <p style={{ fontSize:13, color:'#64748b', maxWidth:380, margin:'0 auto', lineHeight:1.8 }}>
                Merge up to 50 images into a single PDF — drag to reorder, choose page size, convert instantly.
              </p>
            </motion.div>
          )}

          {/* Drop zone */}
          {status !== 'processing' && status !== 'done' && (
            <div className={`nm-drop ${drag?'over':''} ${images.length>0?'has-files':''}`}
              style={{ padding: images.length>0?'14px':'40px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', minHeight: images.length>0?'auto':220 }}
              onDragOver={e=>{e.preventDefault();setDrag(true)}}
              onDragLeave={()=>setDrag(false)}
              onDrop={e=>{e.preventDefault();setDrag(false);addFiles(e.dataTransfer.files);}}
              onClick={()=>fileRef.current.click()}>
              <input ref={fileRef} type="file" accept="image/*" multiple style={{display:'none'}} onChange={e=>{addFiles(e.target.files);e.target.value='';}} />
              {images.length === 0 ? (
                <>
                  <div style={{ color:'#475569', marginBottom:14 }}><IcoUpload s={40}/></div>
                  <div style={{ fontSize:15, fontWeight:700, color:'#e2e8f0', marginBottom:6 }}>Drop images here</div>
                  <div style={{ fontSize:12, color:'#64748b', marginBottom:18 }}>JPG, PNG, WebP · up to 50 images</div>
                  <button className="nm-btn" style={{ pointerEvents:'none' }}><IcoUpload s={14}/> Choose Files</button>
                </>
              ) : (
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <IcoPlus s={14}/>
                  <span style={{ fontSize:12, fontWeight:600, color:'#818cf8' }}>Add more images</span>
                </div>
              )}
            </div>
          )}

          {/* Processing */}
          {status === 'processing' && (
            <div className="nm-card" style={{ flex:1, minHeight:260, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Processing progress={progress} stageMsg={stageMsg} neon={false} />
            </div>
          )}

          {/* Grid */}
          {images.length > 0 && status !== 'processing' && status !== 'done' && (
            <AnimatePresence>
              <ImageGrid images={images} onRemove={remove} onMoveUp={moveUp} onMoveDown={moveDown} neon={false} />
            </AnimatePresence>
          )}

          {/* Convert */}
          {images.length > 0 && status === 'idle' && (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
              <button className="nm-btn" style={{ width:'100%', justifyContent:'center', padding:'15px', fontSize:14 }} onClick={buildPDF}>
                <IcoZap s={15}/> Convert {images.length} Image{images.length>1?'s':''} to PDF
              </button>
            </motion.div>
          )}

          {/* Result */}
          {status === 'done' && result && (
            <ResultView result={result} onDownload={download} onReset={clearAll} neon={false} />
          )}

          {/* Error */}
          {status === 'error' && (
            <div style={{ padding:'16px', border:'1.5px solid rgba(239,68,68,.3)', borderRadius:12, background:'rgba(239,68,68,.06)', textAlign:'center' }}>
              <div style={{ fontSize:12, color:'#ef4444', fontWeight:700, marginBottom:10 }}>Conversion failed</div>
              <button className="nm-ghost" onClick={clearAll}><IcoReset s={13}/> Try Again</button>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ borderLeft:'1px solid #2d3561', background:'#16213e', padding:'20px 16px', overflowY:'auto' }}>

          <div className="nm-section-label" style={{ marginBottom:14 }}>Page Settings</div>

          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:600, color:'#64748b', marginBottom:6 }}>Page Size</div>
            <select className="nm-select" value={pageSize} onChange={e=>setPageSize(e.target.value)} style={{ width:'100%' }}>
              <option value="a4">A4 (210 × 297 mm)</option>
              <option value="letter">Letter (216 × 279 mm)</option>
              <option value="legal">Legal (216 × 356 mm)</option>
              <option value="a3">A3 (297 × 420 mm)</option>
              <option value="a5">A5 (148 × 210 mm)</option>
            </select>
          </div>

          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, fontWeight:600, color:'#64748b', marginBottom:8 }}>Orientation</div>
            <div style={{ display:'flex', gap:8 }}>
              {['portrait','landscape'].map(o => (
                <button key={o} onClick={()=>setOrientation(o)}
                  style={{ flex:1, padding:'9px 6px', border:`1.5px solid ${orientation===o?'#6366f1':'#2d3561'}`, borderRadius:8,
                    background: orientation===o?'rgba(99,102,241,.12)':'transparent',
                    color: orientation===o?'#818cf8':'#64748b', cursor:'pointer',
                    fontFamily:'Inter', fontSize:11, fontWeight:700, textTransform:'capitalize', transition:'all .15s' }}>
                  {o === 'portrait' ? '⬜ Portrait' : '⬛ Landscape'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height:1, background:'#2d3561', margin:'0 0 16px' }}/>

          {images.length > 0 && (
            <>
              <div className="nm-section-label" style={{ marginBottom:10 }}>Queue</div>
              <div style={{ marginBottom:14 }}>
                {images.map((img,i) => (
                  <div key={img.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 10px',
                    border:'1.5px solid #2d3561', borderRadius:8, marginBottom:5, background:'#0f0f23' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, overflow:'hidden' }}>
                      <span style={{ fontSize:10, fontWeight:700, color:'#6366f1', width:20, flexShrink:0 }}>P{i+1}</span>
                      <span style={{ fontSize:10, color:'#64748b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{img.name}</span>
                    </div>
                    <button onClick={()=>remove(img.id)} style={{ border:'none', background:'none', cursor:'pointer', color:'#64748b', padding:2, display:'flex', flexShrink:0 }}>
                      <IcoClose s={11}/>
                    </button>
                  </div>
                ))}
              </div>
              <button className="nm-ghost" onClick={clearAll} style={{ width:'100%', justifyContent:'center' }}>
                <IcoTrash s={12}/> Clear All
              </button>
            </>
          )}

          <div style={{ height:1, background:'#2d3561', margin:'16px 0' }}/>
          <div className="nm-section-label" style={{ marginBottom:10 }}>Tips</div>
          {['Hover thumbnails to reorder or delete','Up to 50 images per PDF','Images auto-fit to page','One image = one PDF page'].map((t,i)=>(
            <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
              <span style={{ color:'rgba(99,102,241,.4)', fontSize:12, flexShrink:0 }}>✦</span>
              <span style={{ fontSize:11, color:'#64748b', lineHeight:1.5 }}>{t}</span>
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
export default function ImageToPDF() {
  const [uiMode, setUiMode] = useState('futuristic');
  const pdf = usePDFMaker();

  return (
    <>
      <style>{BASE_STYLES}{NEON_STYLES}{NORMAL_STYLES}</style>
      <AnimatePresence mode="wait">
        {uiMode === 'futuristic' ? (
          <motion.div key="neon" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}>
            <NeonApp onSwitch={()=>setUiMode('normal')} pdf={pdf} />
          </motion.div>
        ) : (
          <motion.div key="normal" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.3}}>
            <NormalApp onSwitch={()=>setUiMode('futuristic')} pdf={pdf} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}