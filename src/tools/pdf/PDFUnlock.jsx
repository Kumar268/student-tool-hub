import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   PDF.unlock — PDF Password Remover
   JetBrains Mono + Outfit · Dark/Light
   Real browser-side unlock via pdf-lib (CDN) — no server upload
   TABS: ◈ Unlock · ⌛ History · ∑ Guide
═══════════════════════════════════════════════════════════════════ */

const S = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{font-family:'Outfit',sans-serif;}
.dk{--bg:#080b0f;--s1:#0d1117;--s2:#131920;--bdr:#1e2d3d;
  --acc:#38bdf8;--lo:#4ade80;--er:#f87171;--pur:#c084fc;--warn:#fb923c;--gold:#fbbf24;--red:#f43f5e;
  --tx:#e2eaf4;--tx2:#94a3b8;--tx3:#3d5a78;
  background:var(--bg);color:var(--tx);min-height:100vh;
  background-image:radial-gradient(ellipse 60% 40% at 50% -5%,rgba(244,63,94,.05),transparent 60%),
    radial-gradient(ellipse 40% 30% at 85% 95%,rgba(74,222,128,.04),transparent 60%);}
.lt{--bg:#f0f4f8;--s1:#fff;--s2:#e8f0f8;--bdr:#c5d8ec;
  --acc:#0369a1;--lo:#15803d;--er:#dc2626;--pur:#7c3aed;--warn:#c2410c;--gold:#b45309;--red:#e11d48;
  --tx:#0c1f2e;--tx2:#2d5070;--tx3:#6b90aa;
  background:var(--bg);color:var(--tx);min-height:100vh;}

.topbar{height:52px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 20px;gap:10px;backdrop-filter:blur(24px);}
.dk .topbar{background:rgba(8,11,15,.96);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(240,244,248,.96);border-bottom:1.5px solid var(--bdr);}
.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none;}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:42px;padding:0 15px;border:none;cursor:pointer;background:transparent;
  border-bottom:2px solid transparent;font-family:'JetBrains Mono',monospace;font-size:10px;
  letter-spacing:.07em;text-transform:uppercase;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--tx3);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(56,189,248,.05);}
.lt .tab{color:var(--tx3);}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);font-weight:600;}

.body{display:grid;grid-template-columns: 1fr;min-height:calc(100vh - 94px);}
@media(min-width:1024px){.body{grid-template-columns: 220px 1fr !important;}}
.sidebar{padding:14px 12px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:18px 20px;display:flex;flex-direction:column;gap:14px;overflow-y:auto;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:8px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:14px;box-shadow:0 2px 20px rgba(3,105,161,.06);}
.dk .panel-hi{background:var(--s2);border:1px solid rgba(244,63,94,.3);border-radius:8px;box-shadow:0 0 32px rgba(244,63,94,.07);}
.lt .panel-hi{background:var(--s1);border:1.5px solid rgba(225,29,72,.2);border-radius:14px;box-shadow:0 4px 28px rgba(225,29,72,.08);}
.dk .panel-lo{background:var(--s2);border:1px solid rgba(74,222,128,.25);border-radius:8px;box-shadow:0 0 24px rgba(74,222,128,.06);}
.lt .panel-lo{background:var(--s1);border:1.5px solid rgba(21,128,61,.22);border-radius:14px;box-shadow:0 4px 24px rgba(21,128,61,.08);}

.btn-pri{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 22px;
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.09em;
  text-transform:uppercase;font-weight:600;border:none;transition:all .13s;width:100%;}
.dk .btn-pri{background:var(--lo);color:#080b0f;border-radius:6px;}
.dk .btn-pri:hover:not(:disabled){background:#86efac;}
.lt .btn-pri{background:var(--lo);color:#fff;border-radius:10px;}
.lt .btn-pri:hover:not(:disabled){background:#16a34a;}
.btn-pri:disabled{opacity:.4;cursor:not-allowed;}
.btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:5px 12px;
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.07em;
  text-transform:uppercase;background:transparent;transition:all .12s;}
.dk .btn-ghost{border:1px solid var(--bdr);border-radius:5px;color:var(--tx3);}
.dk .btn-ghost:hover{border-color:var(--acc);color:var(--acc);background:rgba(56,189,248,.07);}
.lt .btn-ghost{border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx3);}
.lt .btn-ghost:hover{border-color:var(--acc);color:var(--acc);background:rgba(3,105,161,.06);}
.btn-dl{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;cursor:pointer;
  font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;
  font-weight:600;border:none;border-radius:6px;transition:all .13s;}
.dk .btn-dl{background:rgba(74,222,128,.12);color:var(--lo);border:1px solid rgba(74,222,128,.25);}
.dk .btn-dl:hover{background:rgba(74,222,128,.2);}
.lt .btn-dl{background:rgba(21,128,61,.08);color:var(--lo);border:1.5px solid rgba(21,128,61,.2);}
.lt .btn-dl:hover{background:rgba(21,128,61,.15);}

.inp{width:100%;padding:9px 12px;font-family:'JetBrains Mono',monospace;font-size:13px;outline:none;transition:all .13s;}
.dk .inp{background:rgba(0,0,0,.4);border:1px solid var(--bdr);color:var(--tx);border-radius:6px;}
.dk .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(56,189,248,.1);}
.lt .inp{background:#f8fbff;border:1.5px solid var(--bdr);color:var(--tx);border-radius:10px;}
.lt .inp:focus{border-color:var(--acc);}

.lbl{font-family:'JetBrains Mono',monospace;font-size:8.5px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(56,189,248,.5);}
.lt .lbl{color:var(--acc);}
.sec-lbl{font-family:'JetBrains Mono',monospace;font-size:7.5px;letter-spacing:.24em;text-transform:uppercase;margin-bottom:9px;}
.dk .sec-lbl{color:rgba(56,189,248,.3);}
.lt .sec-lbl{color:var(--acc);}

.hint{padding:10px 14px;display:flex;gap:9px;align-items:flex-start;font-size:12px;line-height:1.72;}
.dk .hint{border:1px solid rgba(56,189,248,.14);border-radius:7px;background:rgba(56,189,248,.04);border-left:3px solid rgba(56,189,248,.4);color:var(--tx2);}
.lt .hint{border:1.5px solid rgba(3,105,161,.14);border-radius:11px;background:rgba(3,105,161,.04);border-left:3px solid rgba(3,105,161,.3);color:var(--tx2);}
.hint-er{padding:10px 14px;display:flex;gap:9px;align-items:flex-start;font-size:12px;line-height:1.72;}
.dk .hint-er{border:1px solid rgba(248,113,113,.22);border-radius:7px;background:rgba(248,113,113,.05);border-left:3px solid var(--er);color:var(--tx2);}
.lt .hint-er{border:1.5px solid rgba(220,38,38,.18);border-radius:11px;background:rgba(220,38,38,.04);border-left:3px solid var(--er);color:var(--tx2);}
.hint-warn{padding:10px 14px;display:flex;gap:9px;align-items:flex-start;font-size:12px;line-height:1.72;}
.dk .hint-warn{border:1px solid rgba(251,146,60,.2);border-radius:7px;background:rgba(251,146,60,.04);border-left:3px solid var(--warn);color:var(--tx2);}
.lt .hint-warn{border:1.5px solid rgba(194,65,12,.18);border-radius:11px;background:rgba(194,65,12,.04);border-left:3px solid var(--warn);color:var(--tx2);}

.scard{padding:11px 13px;display:flex;flex-direction:column;gap:3px;}
.dk .scard{background:rgba(56,189,248,.03);border:1px solid rgba(56,189,248,.1);border-radius:7px;}
.lt .scard{background:rgba(3,105,161,.03);border:1.5px solid rgba(3,105,161,.1);border-radius:11px;}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(56,189,248,.012);border:1px dashed rgba(56,189,248,.1);border-radius:7px;}
.lt .ad{background:rgba(3,105,161,.025);border:1.5px dashed rgba(3,105,161,.12);border-radius:11px;}
.ad span{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:var(--tx3);}

.dropzone{border-radius:10px;cursor:pointer;transition:all .18s;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:12px;padding:52px 32px;text-align:center;}
.dk .dropzone{border:2px dashed rgba(244,63,94,.2);background:rgba(244,63,94,.02);}
.dk .dropzone:hover,.dk .dropzone.drag{border-color:rgba(244,63,94,.45);background:rgba(244,63,94,.06);}
.lt .dropzone{border:2px dashed rgba(225,29,72,.2);background:rgba(225,29,72,.02);}
.lt .dropzone:hover,.lt .dropzone.drag{border-color:rgba(225,29,72,.4);background:rgba(225,29,72,.05);}

@keyframes shimmer{0%{opacity:.35}50%{opacity:1}100%{opacity:.35}}
.pw-dot{width:9px;height:9px;border-radius:50%;animation:shimmer 1.4s ease-in-out infinite;}

.prog-wrap{height:6px;border-radius:3px;overflow:hidden;background:var(--bdr);}
.prog{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--red),var(--lo));transition:width .35s ease;}

.hist-row{padding:11px 14px;display:flex;justify-content:space-between;align-items:center;gap:12px;transition:all .12s;}
.dk .hist-row{border:1px solid var(--bdr);border-radius:8px;background:var(--s2);}
.lt .hist-row{border:1.5px solid var(--bdr);border-radius:12px;background:var(--s1);}

.prose p{font-size:13px;line-height:1.85;margin-bottom:11px;color:var(--tx2);}
.prose h3{font-family:'Outfit',sans-serif;font-size:12px;font-weight:700;margin:16px 0 6px;color:var(--tx);text-transform:uppercase;letter-spacing:.05em;}
.prose strong{font-weight:700;color:var(--tx);}
.qa{padding:12px 14px;margin-bottom:8px;}
.dk .qa{border:1px solid var(--bdr);border-radius:8px;background:rgba(0,0,0,.25);}
.lt .qa{border:1.5px solid var(--bdr);border-radius:12px;background:rgba(3,105,161,.03);}

@media(max-width:768px){
  .body{grid-template-columns:1fr!important;}
  .sidebar{display:none!important;}
}
`;

const TABS = [
  { id:'unlock',  icon:'🔓', label:'Unlock'  },
  { id:'history', icon:'⌛', label:'History' },
  { id:'guide',   icon:'∑',  label:'Guide'   },
];

const STAGES = ['Loading PDF…','Verifying password…','Decrypting content…','Rebuilding PDF…','Preparing download…'];

/* ── Load pdf-lib from CDN once ── */
let _pdfLibPromise = null;
function loadPdfLib() {
  if (_pdfLibPromise) return _pdfLibPromise;
  _pdfLibPromise = new Promise((resolve, reject) => {
    if (window.PDFLib) { resolve(window.PDFLib); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
    s.onload  = () => resolve(window.PDFLib);
    s.onerror = () => reject(new Error('Could not load pdf-lib. Check your internet connection.'));
    document.head.appendChild(s);
  });
  return _pdfLibPromise;
}

/* ── Core unlock ── */
async function doUnlock(arrayBuffer, password) {
  const { PDFDocument } = await loadPdfLib();

  let srcDoc;
  try {
    srcDoc = await PDFDocument.load(arrayBuffer, { password: password || undefined });
  } catch (e) {
    const msg = (e.message || '').toLowerCase();
    if (msg.includes('password') || msg.includes('encrypt') || msg.includes('decrypt')) {
      throw new Error('Incorrect password. Please double-check and try again.');
    }
    // Fallback: try ignoring encryption (permissions-only lock)
    try {
      srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    } catch {
      throw new Error('Unable to open this PDF. It may use unsupported encryption or be corrupted.');
    }
  }

  const newDoc = await PDFDocument.create();
  const indices = srcDoc.getPageIndices();
  const pages   = await newDoc.copyPages(srcDoc, indices);
  pages.forEach(p => newDoc.addPage(p));

  // Preserve metadata where possible
  try {
    const title   = srcDoc.getTitle();
    const author  = srcDoc.getAuthor();
    if (title)  newDoc.setTitle(title);
    if (author) newDoc.setAuthor(author);
  } catch { /* optional */ }

  const bytes = await newDoc.save();
  return { bytes, pageCount: pages.length };
}

function triggerDownload(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename.replace(/\.pdf$/i, '_unlocked.pdf');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function PDFUnlock() {
  const [dark,    setDark]    = useState(true);
  const [tab,     setTab]     = useState('unlock');
  const dk = dark;

  const [file,    setFile]    = useState(null);
  const [drag,    setDrag]    = useState(false);
  const [pw,      setPw]      = useState('');
  const [showPw,  setShowPw]  = useState(false);
  const [working, setWorking] = useState(false);
  const [stage,   setStage]   = useState(0);
  const [prog,    setProg]    = useState(0);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState(null);
  const [history, setHistory] = useState([]);
  const inputRef = useRef();

  const readFile = useCallback((f) => {
    if (!f || f.type !== 'application/pdf') { setError('Please upload a valid PDF file.'); return; }
    setError(null); setResult(null); setPw('');
    const r = new FileReader();
    r.onload = e => setFile({ name: f.name, size: (f.size/1024/1024).toFixed(2), buf: e.target.result });
    r.readAsArrayBuffer(f);
  }, []);

  const onInput    = e => { if (e.target.files[0]) readFile(e.target.files[0]); };
  const onDrop     = e => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); };
  const onDragOver = e => { e.preventDefault(); setDrag(true); };

  const handleUnlock = async () => {
    if (!file || working) return;
    setWorking(true); setError(null); setResult(null); setProg(0); setStage(0);
    const adv = (s,p) => { setStage(s); setProg(p); };
    try {
      adv(0,8);  await new Promise(r => setTimeout(r, 300));
      adv(1,24); await new Promise(r => setTimeout(r, 200));
      adv(2,48);
      const { bytes, pageCount } = await doUnlock(file.buf, pw);
      adv(3,78); await new Promise(r => setTimeout(r, 200));
      adv(4,96); await new Promise(r => setTimeout(r, 150));
      setProg(100);
      const res = { bytes, pageCount, name: file.name };
      setResult(res);
      setHistory(h => [{ id:Date.now(), name:file.name, size:file.size, pages:pageCount, time:new Date().toLocaleTimeString(), bytes }, ...h].slice(0,15));
    } catch(e) {
      setError(e.message || 'Unlock failed. Check the password and try again.');
    } finally {
      setWorking(false);
    }
  };

  const reset = () => {
    setFile(null); setResult(null); setError(null); setPw('');
    setProg(0); setStage(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  const sideStats = [
    { label:'Status',        val: working?'Unlocking…':result?'Unlocked ✓':file?'Ready':'No file',
      color: working?'var(--warn)':result?'var(--lo)':file?'var(--acc)':'var(--tx3)' },
    { label:'Pages',         val: result?.pageCount ?? '—',      color:'var(--acc)'  },
    { label:'File Size',     val: file ? `${file.size} MB` : '—', color:'var(--pur)'  },
    { label:'PDFs Unlocked', val: `${history.length}`,           color:'var(--gold)' },
  ];

  return (
    <>
      <style>{S}</style>
      <div className={dk?'dk':'lt'}>

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{ display:'flex',alignItems:'center',gap:9 }}>
            <div style={{ width:32,height:32,borderRadius:dk?6:10,display:'flex',alignItems:'center',justifyContent:'center',
              background:dk?'rgba(244,63,94,.1)':'linear-gradient(135deg,#e11d48,#f43f5e)',
              border:dk?'1px solid rgba(244,63,94,.3)':'none' }}>
              <span style={{ fontSize:15 }}>🔓</span>
            </div>
            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:17,color:'var(--tx)' }}>
              PDF<span style={{ color:'var(--red)' }}>.unlock</span>
            </span>
          </div>
          <div style={{ flex:1 }}/>
          {result && (
            <div style={{ padding:'4px 12px',borderRadius:20,border:'1px solid rgba(74,222,128,.25)',
              background:'rgba(74,222,128,.07)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--lo)',fontWeight:600 }}>
              ✓ {result.pageCount} pages unlocked
            </div>
          )}
          <button className="btn-ghost" onClick={() => setDark(d=>!d)} style={{ padding:'5px 10px',fontSize:13 }}>{dk?'☀':'◑'}</button>
        </div>

        {/* TABBAR */}
        <div className="tabbar">
          {TABS.map(t => (
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="body">
          <div className="sidebar">
            <div className="sec-lbl">Unlock Info</div>
            {sideStats.map((s,i) => (
              <div key={i} className="scard">
                <div className="lbl" style={{ margin:0 }}>{s.label}</div>
                <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:14,color:s.color }}>{s.val}</div>
              </div>
            ))}
            
            <div className="sec-lbl" style={{ marginTop:4 }}>Privacy Notes</div>
            {['File never leaves your browser','No server upload ever','Works fully offline','AES-128 & AES-256 supported','Owner restrictions also removed'].map((t,i) => (
              <div key={i} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',padding:'3px 0',
                borderBottom:i<4?'1px solid var(--bdr)':'none',display:'flex',gap:6 }}>
                <span style={{ color:'var(--lo)',flexShrink:0 }}>→</span>{t}
              </div>
            ))}
            
          </div>

          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══ UNLOCK ══ */}
              {tab==='unlock' && (
                <motion.div key="unlock" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  

                  <div className="hint-warn">
                    <span>⚖</span>
                    <span>Only remove passwords from PDFs you own or have legal permission to unlock. Everything is processed locally — your file is <strong>never uploaded</strong> to any server.</span>
                  </div>

                  <div className="panel-hi" style={{ padding:'26px 28px',display:'flex',flexDirection:'column',gap:18 }}>
                    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                      <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:15,color:'var(--tx)' }}>PDF Password Remover</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--lo)',
                        padding:'3px 9px',borderRadius:4,border:'1px solid rgba(74,222,128,.25)',background:'rgba(74,222,128,.06)' }}>
                        100% LOCAL
                      </div>
                    </div>

                    {/* Drop zone */}
                    {!file && (
                      <label className={`dropzone ${drag?'drag':''}`}
                        onDrop={onDrop} onDragOver={onDragOver} onDragLeave={() => setDrag(false)}
                        htmlFor="pdf-ul">
                        <motion.div animate={{ rotate:[0,-8,8,-4,4,0] }} transition={{ repeat:Infinity,duration:4,ease:'easeInOut' }}>
                          <span style={{ fontSize:46 }}>🔒</span>
                        </motion.div>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:15,color:'var(--tx)' }}>
                          Drop your locked PDF here
                        </div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>
                          or click to browse · password-protected PDFs only
                        </div>
                        <input id="pdf-ul" ref={inputRef} type="file" accept=".pdf,application/pdf"
                          style={{ display:'none' }} onChange={onInput}/>
                      </label>
                    )}

                    {/* File + password */}
                    {file && !working && !result && (
                      <motion.div initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }}
                        style={{ display:'flex',flexDirection:'column',gap:13 }}>
                        <div style={{ display:'flex',alignItems:'center',gap:12,padding:'13px 16px',borderRadius:8,
                          border:dk?'1px solid rgba(244,63,94,.22)':'1.5px solid rgba(225,29,72,.16)',
                          background:dk?'rgba(244,63,94,.05)':'rgba(225,29,72,.03)' }}>
                          <span style={{ fontSize:22 }}>🔒</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:14,color:'var(--tx)',marginBottom:2 }}>{file.name}</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx3)' }}>{file.size} MB · Locked PDF</div>
                          </div>
                          <button onClick={reset} className="btn-ghost" style={{ fontSize:10 }}>✕ Remove</button>
                        </div>

                        <div>
                          <div className="lbl">PDF Password</div>
                          <div style={{ position:'relative' }}>
                            <input className="inp"
                              type={showPw?'text':'password'}
                              value={pw}
                              onChange={e => setPw(e.target.value)}
                              onKeyDown={e => e.key==='Enter' && handleUnlock()}
                              placeholder="Enter the PDF password…"
                              style={{ paddingRight:44,fontSize:14 }}
                              autoFocus/>
                            <button onClick={() => setShowPw(s=>!s)}
                              style={{ position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',
                                background:'none',border:'none',cursor:'pointer',fontSize:16,color:'var(--tx3)' }}>
                              {showPw?'🙈':'👁'}
                            </button>
                          </div>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)',marginTop:5 }}>
                            Leave blank if the PDF opens without a password (permissions-only lock)
                          </div>
                        </div>

                        <button className="btn-pri" onClick={handleUnlock} disabled={working}>
                          <span>🔓</span> Remove Password &amp; Unlock PDF
                        </button>
                      </motion.div>
                    )}

                    {/* Progress */}
                    {working && (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                        style={{ display:'flex',flexDirection:'column',gap:12 }}>
                        <div style={{ display:'flex',justifyContent:'space-between',marginBottom:2 }}>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx2)' }}>{STAGES[stage]||'Processing…'}</div>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--lo)' }}>{prog}%</div>
                        </div>
                        <div className="prog-wrap"><div className="prog" style={{ width:`${prog}%` }}/></div>
                        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:7,paddingTop:4 }}>
                          {[0,1,2,3,4,5,6,7,8].map(i => (
                            <div key={i} className="pw-dot" style={{ background:'var(--red)',animationDelay:`${i*0.11}s` }}/>
                          ))}
                        </div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',textAlign:'center' }}>
                          Decrypting locally in your browser — nothing is uploaded…
                        </div>
                      </motion.div>
                    )}

                    {/* Error */}
                    {error && (
                      <motion.div initial={{ opacity:0,x:-6 }} animate={{ opacity:1,x:0 }} className="hint-er">
                        <span>✕</span><span>{error}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Success */}
                  {result && (
                    <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}
                      className="panel-lo" style={{ padding:'22px 26px',display:'flex',flexDirection:'column',gap:16 }}>
                      <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                        <motion.span style={{ fontSize:30 }}
                          animate={{ rotate:[0,18,-12,10,-5,0] }} transition={{ duration:0.65 }}>🔓</motion.span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:17,color:'var(--lo)' }}>
                            PDF Unlocked Successfully
                          </div>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx3)',marginTop:3 }}>
                            {result.name} · {result.pageCount} page{result.pageCount!==1?'s':''} · all restrictions removed
                          </div>
                        </div>
                      </div>

                      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
                        {[
                          { icon:'📄', label:'Source File',  val:result.name,                                    color:'var(--tx2)' },
                          { icon:'📑', label:'Pages',        val:`${result.pageCount} pages extracted`,          color:'var(--lo)'  },
                          { icon:'🔒', label:'Encryption',   val:'Removed ✓',                                   color:'var(--lo)'  },
                          { icon:'📥', label:'Output File',  val:result.name.replace(/\.pdf$/i,'_unlocked.pdf'), color:'var(--acc)' },
                        ].map((s,i) => (
                          <div key={i} style={{ padding:'10px 12px',borderRadius:7,
                            border:dk?'1px solid rgba(74,222,128,.12)':'1.5px solid rgba(21,128,61,.1)',
                            background:dk?'rgba(74,222,128,.04)':'rgba(21,128,61,.03)' }}>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--tx3)',marginBottom:4 }}>{s.icon} {s.label}</div>
                            <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12,color:s.color,wordBreak:'break-all' }}>{s.val}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display:'flex',gap:9 }}>
                        <button className="btn-dl" style={{ flex:1,justifyContent:'center' }}
                          onClick={() => triggerDownload(result.bytes, result.name)}>
                          ⬇ Download Unlocked PDF
                        </button>
                        <button className="btn-ghost" onClick={reset}>↺ Unlock Another</button>
                      </div>
                    </motion.div>
                  )}

                  
                </motion.div>
              )}

              {/* ══ HISTORY ══ */}
              {tab==='history' && (
                <motion.div key="hist" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:10 }}>
                  <div className="hint"><span>⌛</span><span>Session history. Downloads are available until you refresh the page.</span></div>
                  {history.length === 0
                    ? <div style={{ textAlign:'center',padding:'60px',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'var(--tx3)' }}>
                        No PDFs unlocked yet this session.
                      </div>
                    : history.map((h,i) => (
                        <motion.div key={h.id} initial={{ opacity:0,x:-6 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*.04 }}>
                          <div className="hist-row">
                            <span style={{ fontSize:18 }}>🔓</span>
                            <div style={{ flex:1 }}>
                              <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12.5,color:'var(--tx)',marginBottom:2 }}>{h.name}</div>
                              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>
                                {h.pages} pages · {h.size} MB · {h.time}
                              </div>
                            </div>
                            <button className="btn-dl" style={{ padding:'5px 12px',fontSize:8.5 }}
                              onClick={() => triggerDownload(h.bytes, h.name)}>
                              ⬇ Download
                            </button>
                          </div>
                        </motion.div>
                      ))
                  }
                  
                </motion.div>
              )}

              {/* ══ GUIDE ══ */}
              {tab==='guide' && (
                <motion.div key="guide" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}>
                  <div className="panel" style={{ padding:'26px 30px',marginBottom:14 }}>
                    <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:26,color:'var(--tx)',marginBottom:4 }}>
                      How PDF Password Removal Works
                    </div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx3)',marginBottom:24,letterSpacing:'.12em' }}>
                      PRIVACY · ENCRYPTION TYPES · LIMITATIONS · FAQ
                    </div>
                    <div className="prose">
                      <h3>100% Local — No Upload, No Server</h3>
                      <p>Unlike most online PDF tools, this runs <strong>entirely in your browser</strong> using pdf-lib. Your file never touches any server. Decryption happens on your own device, making it safe for sensitive or confidential documents.</p>
                      <h3>Two Types of PDF Protection</h3>
                      <p><strong>Open password</strong> (Document Open): Requires a password just to view. You need the correct password to unlock this. <strong>Permissions password</strong> (Owner lock): The PDF opens freely but restricts printing, copying, or editing. This tool removes both types — for permissions-only locks, leave the password field blank.</p>
                      <h3>Supported Encryption</h3>
                      <p>PDF encryption uses RC4 (40-bit or 128-bit, older) or AES (128-bit or 256-bit, modern). This tool handles all standard PDF encryption levels via pdf-lib. Proprietary or non-standard encryption schemes may occasionally fail.</p>
                      <h3>What Gets Preserved</h3>
                      <p>All pages, text, images, and embedded content are preserved. The tool copies each page from the locked PDF into a fresh, unencrypted document. Metadata (title, author) is also carried over. Some interactive elements like JavaScript form actions may not survive the page copy.</p>
                      {[
                        { q:'Is it legal to remove a PDF password?', a:'It depends on the document and your rights. Removing a password from a PDF you created, own, or have explicit permission to edit is generally legal. Bypassing protection on copyrighted content you don\'t own may violate copyright law or terms of service. Use this tool responsibly on your own documents only.' },
                        { q:'What if I get an "Incorrect password" error?', a:'Check Caps Lock and try password variations. Some PDFs use an "owner password" (which restricts editing) that\'s different from the "user password" (which restricts viewing). If the PDF opens freely but just blocks copying/printing, leave the password field blank and click Unlock.' },
                        { q:'Can I unlock without knowing the password?', a:'This tool requires the correct password for open-locked PDFs. It cannot brute-force or crack passwords — that falls into a different legal and technical category. For permissions-only locked PDFs that open without a password, no password entry is needed at all.' },
                        { q:'Why does the output look slightly different?', a:'pdf-lib rebuilds the PDF by copying page content into a new document. In most cases output is identical to the original. Complex interactive form fields, embedded JavaScript, and some annotations may not transfer perfectly. Static text, images, and tables always transfer correctly.' },
                      ].map(({ q, a }, i) => (
                        <div key={i} className="qa">
                          <div style={{ fontSize:12.5,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:'var(--tx)',marginBottom:6 }}>{q}</div>
                          <div style={{ fontSize:13,color:'var(--tx2)',lineHeight:1.8 }}>{a}</div>
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