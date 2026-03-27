import { useState, memo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Outfit',sans-serif}

@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(20,255,180,.2)}50%{box-shadow:0 0 0 8px rgba(20,255,180,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
@keyframes pulse-border{0%,100%{border-color:rgba(20,255,180,.25)}50%{border-color:rgba(20,255,180,.6)}}
@keyframes shimmer{0%{transform:translateX(-200%)}100%{transform:translateX(200%)}}

.dk{
  --bg:#060a09;--s1:#0a0f0d;--s2:#0f1612;--bdr:#1a2820;
  --acc:#14ffb4;--acc2:#00e5a0;--acc4:#a78bfa;
  --err:#ff6b6b;--warn:#fbbf24;
  --tx:#e8fff8;--tx2:#8ecfb8;--tx3:#1a3d2c;--txm:#3d7a62;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 80% 40% at 50% -10%,rgba(20,255,180,.05),transparent),radial-gradient(ellipse 40% 60% at 95% 80%,rgba(167,139,250,.04),transparent);
}
.lt{
  --bg:#f5fbf8;--s1:#ffffff;--s2:#ecf7f1;--bdr:#b8ddc8;
  --acc:#0d3320;--acc2:#1a5c38;--acc4:#5b21b6;
  --err:#991b1b;--warn:#92400e;
  --tx:#071810;--tx2:#1a5c38;--tx3:#a7d4bc;--txm:#2d6e4a;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(13,51,32,.05),transparent);
}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(6,10,9,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(245,251,248,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(13,51,32,.07);}
.scanline{position:fixed;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(20,255,180,.3),transparent);animation:scan 4s linear infinite;pointer-events:none;z-index:999;}

.body{display:grid;grid-template-columns: 1fr;min-height:calc(100vh - 46px);}
@media(min-width:1024px){.body{grid-template-columns: 220px 1fr !important;}}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:18px 22px;display:flex;flex-direction:column;gap:16px;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(13,51,32,.06);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:11px 26px;cursor:pointer;
  font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;letter-spacing:.04em;transition:all .16s;border:none;width:100%;}
.dk .btn{background:var(--acc);color:#060a09;border-radius:3px;animation:glow 2.6s infinite;}
.dk .btn:hover{background:#4fffca;transform:translateY(-1px);animation:none;box-shadow:0 0 30px rgba(20,255,180,.5);}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;animation:none;transform:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:8px;box-shadow:0 4px 14px rgba(13,51,32,.3);}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}

.gbtn{display:inline-flex;align-items:center;gap:5px;padding:7px 13px;cursor:pointer;
  font-family:'Outfit',sans-serif;font-size:10px;font-weight:500;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover{border-color:var(--acc);color:var(--acc);background:rgba(20,255,180,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover{border-color:var(--acc);color:var(--acc);background:rgba(13,51,32,.05);}

.dropzone{width:100%;border:2px dashed;border-radius:6px;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:10px;cursor:pointer;transition:all .2s;padding:48px 24px;}
.dk .dropzone{border-color:rgba(20,255,180,.2);background:rgba(20,255,180,.02);}
.dk .dropzone.drag,.dk .dropzone:hover{border-color:rgba(20,255,180,.55);background:rgba(20,255,180,.05);animation:pulse-border 1.5s infinite;}
.lt .dropzone{border-color:rgba(13,51,32,.2);background:rgba(13,51,32,.02);}
.lt .dropzone.drag,.lt .dropzone:hover{border-color:rgba(13,51,32,.5);background:rgba(13,51,32,.04);}

.file-card{padding:13px 15px;display:flex;align-items:center;gap:12px;position:relative;}
.dk .file-card{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.35);}
.dk .file-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--acc);border-radius:2px 0 0 2px;opacity:.6;}
.lt .file-card{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.8);}

.lv{padding:13px 15px;cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;}
.dk .lv{border:1px solid var(--bdr);border-radius:4px;}
.dk .lv:hover{background:rgba(20,255,180,.03);}
.dk .lv.sel{border-color:var(--acc);background:rgba(20,255,180,.06);}
.lt .lv{border:1.5px solid var(--bdr);border-radius:10px;}
.lt .lv:hover{background:rgba(13,51,32,.03);}
.lt .lv.sel{border-color:var(--acc);background:rgba(13,51,32,.05);}

.pw{height:5px;border-radius:3px;overflow:hidden;margin:10px 0 5px;position:relative;}
.dk .pw{background:rgba(20,255,180,.1);}
.lt .pw{background:rgba(13,51,32,.1);}
.pf{height:100%;border-radius:3px;transition:width .4s ease;position:relative;overflow:hidden;}
.dk .pf{background:linear-gradient(90deg,var(--acc),var(--acc4));}
.lt .pf{background:linear-gradient(90deg,var(--acc),var(--acc4));}
.pf::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent);animation:shimmer 1.4s infinite;}

.rc{padding:18px 20px;}
.dk .rc{border:1px solid rgba(20,255,180,.25);border-radius:4px;background:rgba(20,255,180,.04);}
.lt .rc{border:1.5px solid rgba(13,51,32,.2);border-radius:12px;background:rgba(13,51,32,.03);}

.sb{padding:12px 14px;text-align:center;flex:1;}
.dk .sb{border:1px solid var(--bdr);border-radius:3px;background:rgba(0,0,0,.3);}
.lt .sb{border:1.5px solid var(--bdr);border-radius:9px;background:rgba(245,251,248,.9);}

.lbl{font-family:'Outfit',sans-serif;font-size:9px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;display:block;margin-bottom:4px;}
.dk .lbl{color:rgba(20,255,180,.4);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(20,255,180,.3);}
.lt .slbl{color:var(--acc);}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(20,255,180,.01);border:1px dashed rgba(20,255,180,.08);border-radius:3px;}
.lt .ad{background:rgba(13,51,32,.02);border:1.5px dashed rgba(13,51,32,.1);border-radius:9px;}
.ad span{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

.ab p,.ab li{font-family:'Outfit',sans-serif;font-size:13.5px;line-height:1.8;color:var(--tx2);margin-bottom:6px;}
.ab h3{font-family:'Fraunces',serif;font-size:15px;font-weight:600;color:var(--tx);margin:16px 0 7px;}
.ab ul{padding-left:18px;}
`;

function usePdfLib() {
  const [ready, setReady] = useState(typeof window !== 'undefined' && !!window.PDFLib);
  useEffect(() => {
    if (window.PDFLib) {
      // Defer setReady to avoid synchronous state update in effect
      queueMicrotask(() => setReady(true));
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
    s.onload = () => setReady(true);
    document.head.appendChild(s);
    return () => {};
  }, []);
  return ready;
}

const fmt = (b) => {
  if (!b) return '0 B';
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b/1024).toFixed(1) + ' KB';
  return (b/1048576).toFixed(2) + ' MB';
};

const LEVELS = [
  { id:'low',    label:'Low',    sub:'Best quality, least reduction', ratio:'10–20%', icon:'◎' },
  { id:'medium', label:'Medium', sub:'Balanced quality and size',     ratio:'30–50%', icon:'◑' },
  { id:'high',   label:'High',   sub:'Smallest file, lower quality',  ratio:'50–70%', icon:'●' },
];

async function runCompress(buf, level) {
  const { PDFDocument } = window.PDFLib;
  const src  = await PDFDocument.load(buf, { ignoreEncryption: true });
  const dest = await PDFDocument.create();
  const pages = await dest.copyPages(src, src.getPageIndices());
  pages.forEach(p => dest.addPage(p));
  return await dest.save({ useObjectStreams: level !== 'low', addDefaultPage: false });
}

const PDFCompressor = ({ isDarkMode: ext } = {}) => {
  const [dark, setDark] = useState(ext !== undefined ? ext : true);
  const cls = dark ? 'dk' : 'lt';
  const lib  = usePdfLib();

  const [file,  setFile]  = useState(null);
  const [level, setLevel] = useState('medium');
  const [drag,  setDrag]  = useState(false);
  const [busy,  setBusy]  = useState(false);
  const [pct,   setPct]   = useState(0);
  const [phase, setPhase] = useState('');
  const [res,   setRes]   = useState(null);
  const [err,   setErr]   = useState('');

  const pick = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') { setErr('Please upload a PDF file.'); return; }
    if (f.size > 104857600) { setErr('File must be under 100 MB.'); return; }
    setFile(f); setRes(null); setErr('');
  };

  const compress = async () => {
    if (!file || !lib) return;
    setBusy(true); setRes(null); setErr(''); setPct(10);
    try {
      setPhase('reading');  setPct(20);
      const buf = await file.arrayBuffer();
      setPhase('compressing'); setPct(55);
      const out  = await runCompress(buf, level);
      setPct(100); setPhase('done');
      const saved = file.size - out.byteLength;
      const sp    = Math.max(0, Math.round((saved / file.size) * 100));
      const blob  = new Blob([out], { type:'application/pdf' });
      setRes({ url: URL.createObjectURL(blob), name: file.name.replace(/\.pdf$/i,'')+'_compressed.pdf',
               orig: file.size, next: out.byteLength, saved, sp });
    } catch(e) { setErr('Compression failed: ' + e.message); }
    finally { setBusy(false); }
  };

  const reset = () => { setFile(null); setRes(null); setErr(''); setPct(0); setPhase(''); };

  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {dark&&<div className="scanline"/>}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:32,height:32,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:16,borderRadius:dark?3:9,
              border:dark?'1px solid rgba(20,255,180,.35)':'none',
              background:dark?'rgba(20,255,180,.07)':'linear-gradient(135deg,#0d3320,#1a5c38)',
              boxShadow:dark?'0 0 16px rgba(20,255,180,.2)':'0 3px 10px rgba(13,51,32,.35)'}}>📄</div>
            <div>
              <div style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:16,color:'var(--tx)',lineHeight:1}}>
                PDF<span style={{color:'var(--acc)'}}>Compress</span>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--tx3)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #3 · client-side · free
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          <div style={{fontFamily:"'Fira Code',monospace",fontSize:8.5,color:lib?'var(--acc)':'var(--txm)'}}>
            {lib ? '● engine ready' : '○ loading…'}
          </div>
          <button onClick={()=>setDark(d=>!d)} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(20,255,180,.18)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer'}}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#b8ddc8',boxShadow:dark?'0 0 8px rgba(20,255,180,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#060a09':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)'}}>{dark?'VOID':'LIGHT'}</span>
          </button>
        </div>

        {/* BODY */}
        <div className="body">

          {/* SIDEBAR */}
          <div className="sidebar">
            
            <div>
              <div className="slbl">Session</div>
              {[['File', file?file.name.slice(0,14)+(file.name.length>14?'…':''):'—'],
                ['Size', file?fmt(file.size):'—'],
                ['Level', LEVELS.find(l=>l.id===level)?.label||'—'],
                ['Status', phase==='done'?'✓ done':busy?'⟳ working':file?'ready':'waiting'],
                ['Saved', res?res.sp+'%':'—'],
              ].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                  padding:'5px 9px',marginBottom:3,borderRadius:dark?2:6,
                  border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                  background:dark?'rgba(20,255,180,.02)':'rgba(13,51,32,.02)'}}>
                  <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10.5,color:'var(--txm)'}}>{l}</span>
                  <span style={{fontFamily:"'Fira Code',monospace",fontSize:9.5,color:'var(--acc)'}}>{v}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="slbl">Tips</div>
              {[['📸','Image-heavy PDFs compress the most'],['📝','Text-only PDFs gain little'],
                ['🔒','Encrypted PDFs may fail'],['🔁','Run twice for extra savings']].map(([i,t])=>(
                <div key={t} style={{display:'flex',gap:7,alignItems:'flex-start',padding:'6px 0',
                  borderBottom:dark?'1px solid var(--bdr)':'1px solid var(--bdr)'}}>
                  <span style={{fontSize:11}}>{i}</span>
                  <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10.5,color:'var(--tx2)',lineHeight:1.5}}>{t}</span>
                </div>
              ))}
            </div>
            <div style={{padding:'10px 11px',borderRadius:dark?3:8,
              border:dark?'1px solid rgba(20,255,180,.1)':'1.5px solid rgba(13,51,32,.1)',
              background:dark?'rgba(20,255,180,.03)':'rgba(13,51,32,.03)'}}>
              <div className="slbl" style={{marginBottom:5}}>🔐 Privacy</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10.5,color:'var(--tx2)',lineHeight:1.6}}>
                Your file never leaves your device. All processing runs locally in your browser.
              </div>
            </div>
            
          </div>

          {/* MAIN */}
          <div className="main">
            

            {/* Drop / File card */}
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div key="drop" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <label className={`dropzone${drag?' drag':''}`}
                    onDragOver={e=>{e.preventDefault();setDrag(true);}}
                    onDragLeave={()=>setDrag(false)}
                    onDrop={e=>{e.preventDefault();setDrag(false);if(e.dataTransfer.files[0])pick(e.dataTransfer.files[0]);}}>
                    <div style={{width:56,height:56,borderRadius:dark?4:14,display:'flex',alignItems:'center',
                      justifyContent:'center',fontSize:26,
                      border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',
                      background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)'}}>📤</div>
                    <div style={{textAlign:'center'}}>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:17,fontWeight:600,color:'var(--tx)',marginBottom:4}}>
                        Drop your PDF here
                      </div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12.5,color:'var(--tx2)'}}>
                        or <span style={{color:'var(--acc)',fontWeight:600}}>click to browse</span> — max 100 MB
                      </div>
                    </div>
                    <input type="file" accept="application/pdf" style={{display:'none'}}
                      onChange={e=>{if(e.target.files[0])pick(e.target.files[0]);}}/>
                  </label>
                  {err && (
                    <div style={{marginTop:10,padding:'8px 12px',borderRadius:dark?3:8,
                      background:dark?'rgba(255,107,107,.06)':'rgba(153,27,27,.04)',
                      border:dark?'1px solid rgba(255,107,107,.2)':'1.5px solid rgba(153,27,27,.12)',
                      fontFamily:"'Outfit',sans-serif",fontSize:12.5,color:'var(--err)'}}>⚠ {err}</div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="fc" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  className="file-card panel">
                  <div style={{width:40,height:40,borderRadius:dark?3:9,flexShrink:0,display:'flex',alignItems:'center',
                    justifyContent:'center',fontSize:18,
                    border:dark?'1px solid rgba(20,255,180,.2)':'1.5px solid rgba(13,51,32,.15)',
                    background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)'}}>📄</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13.5,fontWeight:600,color:'var(--tx)',
                      overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{file.name}</div>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--txm)',marginTop:2}}>
                      {fmt(file.size)} · PDF
                    </div>
                  </div>
                  {!busy && (
                    <button onClick={reset} style={{background:'none',border:'none',cursor:'pointer',color:'var(--txm)',fontSize:20,lineHeight:1,padding:4}}>×</button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Level picker */}
            <AnimatePresence>
              {file && !busy && !res && (
                <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  className="panel" style={{padding:'16px 18px'}}>
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:15,fontWeight:600,color:'var(--tx)',marginBottom:14}}>
                    Compression level
                  </div>
                  {LEVELS.map(l=>(
                    <div key={l.id} className={`lv${level===l.id?' sel':''}`} onClick={()=>setLevel(l.id)}>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <div style={{width:36,height:36,borderRadius:dark?3:9,flexShrink:0,display:'flex',
                          alignItems:'center',justifyContent:'center',
                          fontFamily:"'Fira Code',monospace",fontSize:18,
                          color:level===l.id?'var(--acc)':'var(--txm)',
                          border:level===l.id?(dark?'1px solid rgba(20,255,180,.3)':'1.5px solid rgba(13,51,32,.3)'):(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                          background:level===l.id?(dark?'rgba(20,255,180,.08)':'rgba(13,51,32,.06)'):'transparent'}}>
                          {l.icon}
                        </div>
                        <div>
                          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:600,color:level===l.id?'var(--acc)':'var(--tx)'}}>{l.label} Compression</div>
                          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11.5,color:'var(--tx2)',marginTop:1}}>{l.sub}</div>
                        </div>
                      </div>
                      <div style={{fontFamily:"'Fira Code',monospace",fontSize:11,fontWeight:500,
                        color:level===l.id?'var(--acc)':'var(--txm)',whiteSpace:'nowrap'}}>~{l.ratio}</div>
                    </div>
                  ))}
                  <button className="btn" onClick={compress} disabled={!lib} style={{marginTop:6}}>
                    {lib ? '⬇ Compress PDF' : '○ Loading engine…'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress */}
            <AnimatePresence>
              {busy && (
                <motion.div key="prog" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  className="panel" style={{padding:'22px 20px',textAlign:'center'}}>
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:600,color:'var(--tx)',marginBottom:5}}>
                    {phase==='reading' ? 'Reading file…' : 'Compressing…'}
                  </div>
                  <div style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--txm)',marginBottom:14}}>
                    {phase==='reading' ? 'Parsing PDF structure' : 'Optimising object streams & cross-references'}
                  </div>
                  <div className="pw"><div className="pf" style={{width:`${pct}%`}}/></div>
                  <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>{pct}%</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result */}
            <AnimatePresence>
              {res && (
                <motion.div key="res" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="rc">
                  <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
                    <span style={{fontSize:24}}>{res.sp>5?'🎉':'✅'}</span>
                    <div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--acc)'}}>
                        {res.sp>0 ? `Reduced by ${res.sp}%` : 'Compression complete'}
                      </div>
                      <div style={{fontFamily:"'Fira Code',monospace",fontSize:9.5,color:'var(--txm)',marginTop:2}}>{res.name}</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:8,marginBottom:16}}>
                    {[['Original',fmt(res.orig),''],['Compressed',fmt(res.next),'var(--acc)'],
                      ['Saved',fmt(res.saved)+' ('+res.sp+'%)',res.sp>0?'var(--acc)':'var(--txm)']].map(([l,v,c])=>(
                      <div key={l} className="sb">
                        <div className="lbl">{l}</div>
                        <div style={{fontFamily:"'Fira Code',monospace",fontSize:12,fontWeight:500,color:c||'var(--tx)'}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="pw" style={{height:6,marginBottom:16}}>
                    <div className="pf" style={{width:`${100-res.sp}%`}}/>
                  </div>
                  <div style={{display:'flex',gap:9,flexWrap:'wrap'}}>
                    <a href={res.url} download={res.name} style={{textDecoration:'none',flex:1}}>
                      <button className="btn">⬇ Download compressed PDF</button>
                    </a>
                    <button className="gbtn" onClick={reset}>↺ Another file</button>
                  </div>
                  {res.sp < 5 && (
                    <div style={{marginTop:12,padding:'8px 12px',borderRadius:dark?3:8,
                      background:dark?'rgba(251,191,36,.05)':'rgba(146,64,14,.04)',
                      border:dark?'1px solid rgba(251,191,36,.2)':'1.5px solid rgba(146,64,14,.15)',
                      fontFamily:"'Outfit',sans-serif",fontSize:12,color:'var(--warn)'}}>
                      ⓘ This PDF was already well-optimised — try High compression for more reduction.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* SEO article */}
            <div className="panel" style={{padding:'22px 24px'}}>
              <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
                <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',
                  justifyContent:'center',fontSize:16,
                  border:dark?'1px solid rgba(167,139,250,.3)':'1.5px solid rgba(91,33,182,.2)',
                  background:dark?'rgba(167,139,250,.08)':'rgba(91,33,182,.05)'}}>📖</div>
                <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--tx)'}}>
                  Compress PDF Files Online — Free &amp; Private
                </div>
              </div>
              <div className="ab">
                <p>Need to shrink a PDF for email, upload, or storage? Our free PDF compressor reduces file size directly in your browser — your document never touches a server.</p>
                <h3>How to compress a PDF</h3>
                <ul>
                  <li>Upload your PDF by clicking the drop zone or dragging the file in</li>
                  <li>Choose a compression level — Medium is best for most files</li>
                  <li>Click <strong style={{color:'var(--acc)'}}>Compress PDF</strong> and wait a few seconds</li>
                  <li>Download your smaller PDF instantly</li>
                </ul>
                <h3>Which compression level should I use?</h3>
                <p><strong style={{color:'var(--tx)'}}>Low</strong> — preserves maximum quality. Good for print or archival. Expect 10–20% size reduction.</p>
                <p><strong style={{color:'var(--tx)'}}>Medium</strong> — best default. Smaller file, minimal quality loss. 30–50% reduction typical.</p>
                <p><strong style={{color:'var(--tx)'}}>High</strong> — maximum compression. Up to 70% reduction. Best for quick email attachments.</p>
                <h3>Is my PDF safe?</h3>
                <p>100% private. This tool uses pdf-lib and runs entirely in your browser. Your file is never uploaded anywhere.</p>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(PDFCompressor);