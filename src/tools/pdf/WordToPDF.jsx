import { useState, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   WORD.pdf — Word to PDF Converter
   JetBrains Mono + Outfit · Dark/Light
   Real: mammoth.js (CDN) extracts DOCX → clean HTML preview
         Browser print dialog → Save as PDF (native, zero plugins)
   TABS: ◈ Convert · ⌛ History · ∑ Guide
═══════════════════════════════════════════════════════════════════ */

const S = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{font-family:'Outfit',sans-serif;}
.dk{--bg:#080b0f;--s1:#0d1117;--s2:#131920;--bdr:#1e2d3d;
  --acc:#38bdf8;--lo:#4ade80;--er:#f87171;--pur:#c084fc;--warn:#fb923c;--gold:#fbbf24;--blue:#6366f1;
  --tx:#e2eaf4;--tx2:#94a3b8;--tx3:#3d5a78;
  background:var(--bg);color:var(--tx);min-height:100vh;
  background-image:radial-gradient(ellipse 70% 40% at 50% -5%,rgba(99,102,241,.06),transparent 60%),
    radial-gradient(ellipse 40% 30% at 90% 90%,rgba(56,189,248,.04),transparent 60%);}
.lt{--bg:#f0f4f8;--s1:#fff;--s2:#e8f0f8;--bdr:#c5d8ec;
  --acc:#0369a1;--lo:#15803d;--er:#dc2626;--pur:#7c3aed;--warn:#c2410c;--gold:#b45309;--blue:#4338ca;
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
.dk .panel-hi{background:var(--s2);border:1px solid rgba(99,102,241,.3);border-radius:8px;box-shadow:0 0 32px rgba(99,102,241,.08);}
.lt .panel-hi{background:var(--s1);border:1.5px solid rgba(67,56,202,.2);border-radius:14px;box-shadow:0 4px 28px rgba(67,56,202,.09);}
.dk .panel-lo{background:var(--s2);border:1px solid rgba(74,222,128,.25);border-radius:8px;box-shadow:0 0 24px rgba(74,222,128,.06);}
.lt .panel-lo{background:var(--s1);border:1.5px solid rgba(21,128,61,.22);border-radius:14px;box-shadow:0 4px 24px rgba(21,128,61,.08);}

.btn-pri{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 22px;
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.09em;
  text-transform:uppercase;font-weight:600;border:none;transition:all .13s;width:100%;}
.dk .btn-pri{background:var(--blue);color:#fff;border-radius:6px;}
.dk .btn-pri:hover:not(:disabled){background:#818cf8;}
.lt .btn-pri{background:var(--blue);color:#fff;border-radius:10px;}
.lt .btn-pri:hover:not(:disabled){background:#4f46e5;}
.btn-pri:disabled{opacity:.4;cursor:not-allowed;}
.btn-sec{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 22px;
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.09em;
  text-transform:uppercase;font-weight:600;border:none;transition:all .13s;width:100%;}
.dk .btn-sec{background:var(--lo);color:#080b0f;border-radius:6px;}
.dk .btn-sec:hover{background:#86efac;}
.lt .btn-sec{background:var(--lo);color:#fff;border-radius:10px;}
.lt .btn-sec:hover{background:#16a34a;}
.btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:5px 12px;
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.07em;
  text-transform:uppercase;background:transparent;transition:all .12s;}
.dk .btn-ghost{border:1px solid var(--bdr);border-radius:5px;color:var(--tx3);}
.dk .btn-ghost:hover{border-color:var(--acc);color:var(--acc);background:rgba(56,189,248,.07);}
.lt .btn-ghost{border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx3);}
.lt .btn-ghost:hover{border-color:var(--acc);color:var(--acc);background:rgba(3,105,161,.06);}

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

.scard{padding:11px 13px;display:flex;flex-direction:column;gap:3px;}
.dk .scard{background:rgba(56,189,248,.03);border:1px solid rgba(56,189,248,.1);border-radius:7px;}
.lt .scard{background:rgba(3,105,161,.03);border:1.5px solid rgba(3,105,161,.1);border-radius:11px;}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(56,189,248,.012);border:1px dashed rgba(56,189,248,.1);border-radius:7px;}
.lt .ad{background:rgba(3,105,161,.025);border:1.5px dashed rgba(3,105,161,.12);border-radius:11px;}
.ad span{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:var(--tx3);}

.dropzone{border-radius:10px;cursor:pointer;transition:all .18s;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:12px;padding:52px 32px;text-align:center;}
.dk .dropzone{border:2px dashed rgba(99,102,241,.22);background:rgba(99,102,241,.02);}
.dk .dropzone:hover,.dk .dropzone.drag{border-color:rgba(99,102,241,.5);background:rgba(99,102,241,.06);}
.lt .dropzone{border:2px dashed rgba(67,56,202,.2);background:rgba(67,56,202,.02);}
.lt .dropzone:hover,.lt .dropzone.drag{border-color:rgba(67,56,202,.45);background:rgba(67,56,202,.05);}

.prog-wrap{height:6px;border-radius:3px;overflow:hidden;background:var(--bdr);}
.prog{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--blue),var(--acc));transition:width .35s ease;}

/* Document preview — looks like a real Word page */
.doc-preview{
  background:#fff;color:#1a1a1a;
  font-family:'Calibri',Georgia,serif;font-size:11pt;line-height:1.6;
  padding:72px 80px;max-width:794px;margin:0 auto;
  box-shadow:0 4px 40px rgba(0,0,0,.18);
  min-height:400px;
}
.doc-preview h1{font-size:24pt;font-weight:700;margin:0 0 16px;color:#1a1a2e;}
.doc-preview h2{font-size:18pt;font-weight:700;margin:18px 0 8px;color:#16213e;}
.doc-preview h3{font-size:14pt;font-weight:700;margin:14px 0 6px;color:#1a1a2e;}
.doc-preview p{margin:0 0 10px;}
.doc-preview ul,.doc-preview ol{margin:0 0 10px;padding-left:28px;}
.doc-preview li{margin-bottom:4px;}
.doc-preview table{border-collapse:collapse;width:100%;margin:12px 0;}
.doc-preview td,.doc-preview th{border:1px solid #ccc;padding:5px 10px;font-size:10pt;}
.doc-preview strong{font-weight:700;}
.doc-preview em{font-style:italic;}

/* Print styles — when user hits Ctrl+P / Save as PDF */
@media print {
  .no-print{display:none!important;}
  body{background:#fff!important;color:#000!important;}
  .doc-preview{box-shadow:none!important;padding:0!important;max-width:100%!important;}
}

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
  { id:'convert', icon:'◈', label:'Convert' },
  { id:'history', icon:'⌛', label:'History' },
  { id:'guide',   icon:'∑', label:'Guide'   },
];

const STAGES = ['Reading file…','Parsing document structure…','Converting to HTML…','Rendering preview…','Ready to print!'];

/* ── Load mammoth from CDN once ── */
let _mammothPromise = null;
function loadMammoth() {
  if (_mammothPromise) return _mammothPromise;
  _mammothPromise = new Promise((resolve, reject) => {
    if (window.mammoth) { resolve(window.mammoth); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
    s.onload  = () => resolve(window.mammoth);
    s.onerror = () => reject(new Error('Could not load mammoth.js. Check your internet connection.'));
    document.head.appendChild(s);
  });
  return _mammothPromise;
}

/* ── Extract DOCX → HTML via mammoth ── */
async function docxToHtml(arrayBuffer) {
  const mammoth = await loadMammoth();
  const result  = await mammoth.convertToHtml({ arrayBuffer });
  return {
    html:     result.value,
    messages: result.messages,
  };
}

/* ── Print-to-PDF via browser native dialog ── */
function printAsPDF(html, filename) {
  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) { alert('Please allow popups for this site to open the print dialog.'); return; }

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${filename.replace(/\.(doc|docx)$/i, '')}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');
    *{box-sizing:border-box;}
    body{
      font-family:'Lato',Calibri,sans-serif;font-size:11pt;line-height:1.65;
      color:#1a1a1a;background:#fff;
      margin:0;padding:0;
    }
    .page{
      max-width:750px;margin:0 auto;padding:72px 80px;
    }
    h1{font-size:22pt;font-weight:700;margin:0 0 14px;color:#1a1a2e;page-break-after:avoid;}
    h2{font-size:17pt;font-weight:700;margin:20px 0 8px;color:#16213e;page-break-after:avoid;}
    h3{font-size:13pt;font-weight:700;margin:16px 0 6px;page-break-after:avoid;}
    h4,h5,h6{font-size:11pt;font-weight:700;margin:12px 0 4px;}
    p{margin:0 0 10pt;orphans:3;widows:3;}
    ul,ol{margin:0 0 10pt;padding-left:26pt;}
    li{margin-bottom:4pt;}
    table{border-collapse:collapse;width:100%;margin:12pt 0;page-break-inside:avoid;}
    td,th{border:1px solid #ccc;padding:5pt 10pt;font-size:10pt;vertical-align:top;}
    th{background:#f0f0f0;font-weight:700;}
    img{max-width:100%;height:auto;}
    a{color:#1a56db;}
    strong{font-weight:700;}
    em{font-style:italic;}
    blockquote{border-left:3pt solid #ccc;margin:10pt 0;padding:4pt 12pt;color:#555;}
    @media print{
      body{margin:0;}
      .page{padding:0;max-width:100%;}
    }
  </style>
</head>
<body>
  <div class="page">${html}</div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`);
  win.document.close();
}

export default function WordToPDF() {
  const [dark,    setDark]    = useState(true);
  const [tab,     setTab]     = useState('convert');
  const dk = dark;

  const [file,    setFile]    = useState(null);
  const [drag,    setDrag]    = useState(false);
  const [working, setWorking] = useState(false);
  const [stage,   setStage]   = useState(0);
  const [prog,    setProg]    = useState(0);
  const [html,    setHtml]    = useState('');
  const [warns,   setWarns]   = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [error,   setError]   = useState(null);
  const [history, setHistory] = useState([]);
  const inputRef = useRef();
  const previewRef = useRef();

  const readFile = useCallback((f) => {
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['doc','docx'].includes(ext)) { setError('Please upload a .doc or .docx file.'); return; }
    setError(null); setHtml(''); setWarns([]);
    const r = new FileReader();
    r.onload = e => setFile({ name: f.name, size: (f.size/1024/1024).toFixed(2), buf: e.target.result });
    r.readAsArrayBuffer(f);
  }, []);

  const onInput    = e => { if (e.target.files[0]) readFile(e.target.files[0]); };
  const onDrop     = e => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); };
  const onDragOver = e => { e.preventDefault(); setDrag(true); };

  const handleConvert = async () => {
    if (!file || working) return;
    setWorking(true); setError(null); setHtml(''); setProg(0); setStage(0);
    const adv = (s,p) => { setStage(s); setProg(p); };
    try {
      adv(0, 8);  await new Promise(r => setTimeout(r, 250));
      adv(1, 28); await new Promise(r => setTimeout(r, 150));
      adv(2, 52);

      const { html: extracted, messages } = await docxToHtml(file.buf);

      adv(3, 80); await new Promise(r => setTimeout(r, 200));
      adv(4, 98); await new Promise(r => setTimeout(r, 100));
      setProg(100);

      const warnMsgs = messages.filter(m => m.type === 'warning').map(m => m.message);
      const wc = extracted.replace(/<[^>]+>/g,'').split(/\s+/).filter(Boolean).length;

      setHtml(extracted);
      setWarns(warnMsgs);
      setWordCount(wc);

      setHistory(h => [{
        id: Date.now(),
        name: file.name,
        size: file.size,
        words: wc,
        time: new Date().toLocaleTimeString(),
        html: extracted,
      }, ...h].slice(0, 15));

    } catch(e) {
      setError(e.message || 'Conversion failed. Make sure the file is a valid .docx document.');
    } finally {
      setWorking(false);
    }
  };

  const reset = () => {
    setFile(null); setHtml(''); setError(null); setWarns([]);
    setProg(0); setStage(0); setWordCount(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  const sideStats = [
    { label:'Status',    val: working?'Converting…':html?'Ready to Print':file?'Ready':'No file',
      color: working?'var(--warn)':html?'var(--lo)':file?'var(--acc)':'var(--tx3)' },
    { label:'Words',     val: wordCount > 0 ? wordCount.toLocaleString() : '—', color:'var(--acc)'  },
    { label:'File Size', val: file ? `${file.size} MB` : '—',                   color:'var(--pur)'  },
    { label:'Converted', val: `${history.length}`,                               color:'var(--gold)' },
  ];

  return (
    <>
      <style>{S}</style>
      <div className={dk?'dk':'lt'}>

        {/* TOPBAR */}
        <div className="topbar no-print">
          <div style={{ display:'flex',alignItems:'center',gap:9 }}>
            <div style={{ width:32,height:32,borderRadius:dk?6:10,display:'flex',alignItems:'center',justifyContent:'center',
              background:dk?'rgba(99,102,241,.12)':'linear-gradient(135deg,#4338ca,#6366f1)',
              border:dk?'1px solid rgba(99,102,241,.3)':'none' }}>
              <span style={{ fontSize:15 }}>📝</span>
            </div>
            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:17,color:'var(--tx)' }}>
              WORD<span style={{ color:'var(--blue)' }}>.pdf</span>
            </span>
          </div>
          <div style={{ flex:1 }}/>
          {html && (
            <div style={{ padding:'4px 12px',borderRadius:20,border:'1px solid rgba(74,222,128,.25)',
              background:'rgba(74,222,128,.07)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--lo)',fontWeight:600 }}>
              {wordCount.toLocaleString()} words · ready
            </div>
          )}
          <button className="btn-ghost no-print" onClick={() => setDark(d=>!d)} style={{ padding:'5px 10px',fontSize:13 }}>{dk?'☀':'◑'}</button>
        </div>

        {/* TABBAR */}
        <div className="tabbar no-print">
          {TABS.map(t => (
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="body no-print">
          <div className="sidebar no-print">
            <div className="sec-lbl">Conversion Info</div>
            {sideStats.map((s,i) => (
              <div key={i} className="scard">
                <div className="lbl" style={{ margin:0 }}>{s.label}</div>
                <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:14,color:s.color }}>{s.val}</div>
              </div>
            ))}
            
            <div className="sec-lbl" style={{ marginTop:4 }}>Tips</div>
            {['Use Chrome for best PDF quality','Set margins in print dialog','A4 or Letter page size','Check "Background graphics" option','Save as PDF — not print to paper'].map((t,i) => (
              <div key={i} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',padding:'3px 0',
                borderBottom:i<4?'1px solid var(--bdr)':'none',display:'flex',gap:6 }}>
                <span style={{ color:'var(--blue)',flexShrink:0 }}>→</span>{t}
              </div>
            ))}
            
          </div>

          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══ CONVERT ══ */}
              {tab==='convert' && (
                <motion.div key="convert" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  

                  <div className="panel-hi" style={{ padding:'24px 26px',display:'flex',flexDirection:'column',gap:16 }}>
                    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                      <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:15,color:'var(--tx)' }}>
                        Word → PDF Converter
                      </div>
                      <div style={{ display:'flex',gap:6 }}>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--blue)',
                          padding:'3px 8px',borderRadius:4,border:'1px solid rgba(99,102,241,.28)',background:'rgba(99,102,241,.07)' }}>
                          mammoth.js
                        </div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--lo)',
                          padding:'3px 8px',borderRadius:4,border:'1px solid rgba(74,222,128,.22)',background:'rgba(74,222,128,.06)' }}>
                          native print
                        </div>
                      </div>
                    </div>

                    {/* Drop zone */}
                    {!file && (
                      <label className={`dropzone ${drag?'drag':''}`}
                        onDrop={onDrop} onDragOver={onDragOver} onDragLeave={() => setDrag(false)}
                        htmlFor="word-ul">
                        <motion.div animate={{ y:[0,-5,0] }} transition={{ repeat:Infinity,duration:2.6,ease:'easeInOut' }}>
                          <span style={{ fontSize:44 }}>📝</span>
                        </motion.div>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:15,color:'var(--tx)' }}>
                          Drop your Word document here
                        </div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>
                          or click to browse · .doc and .docx supported
                        </div>
                        <input id="word-ul" ref={inputRef} type="file"
                          accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          style={{ display:'none' }} onChange={onInput}/>
                      </label>
                    )}

                    {/* File ready */}
                    {file && !working && !html && (
                      <motion.div initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }}
                        style={{ display:'flex',flexDirection:'column',gap:13 }}>
                        <div style={{ display:'flex',alignItems:'center',gap:12,padding:'13px 16px',borderRadius:8,
                          border:dk?'1px solid rgba(99,102,241,.25)':'1.5px solid rgba(67,56,202,.18)',
                          background:dk?'rgba(99,102,241,.06)':'rgba(67,56,202,.04)' }}>
                          <span style={{ fontSize:22 }}>📝</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:14,color:'var(--tx)',marginBottom:2 }}>{file.name}</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx3)' }}>{file.size} MB · Word Document</div>
                          </div>
                          <button onClick={reset} className="btn-ghost" style={{ fontSize:10 }}>✕ Remove</button>
                        </div>
                        <button className="btn-pri" onClick={handleConvert}>
                          <span>⚡</span> Convert &amp; Preview
                        </button>
                      </motion.div>
                    )}

                    {/* Working */}
                    {working && (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                        style={{ display:'flex',flexDirection:'column',gap:12 }}>
                        <div style={{ display:'flex',justifyContent:'space-between',marginBottom:2 }}>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx2)' }}>{STAGES[stage]||'Processing…'}</div>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--blue)' }}>{prog}%</div>
                        </div>
                        <div className="prog-wrap"><div className="prog" style={{ width:`${prog}%` }}/></div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',textAlign:'center' }}>
                          mammoth.js is parsing your Word document structure…
                        </div>
                      </motion.div>
                    )}

                    {/* Error */}
                    {error && (
                      <motion.div initial={{ opacity:0,x:-6 }} animate={{ opacity:1,x:0 }} className="hint-er">
                        <span>✕</span><span>{error}</span>
                      </motion.div>
                    )}

                    {/* Warnings */}
                    {warns.length > 0 && (
                      <div style={{ padding:'9px 13px',borderRadius:6,
                        border:dk?'1px solid rgba(251,146,60,.2)':'1.5px solid rgba(194,65,12,.18)',
                        background:dk?'rgba(251,146,60,.04)':'rgba(194,65,12,.03)',
                        fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--warn)' }}>
                        ⚠ {warns.length} formatting notice{warns.length>1?'s':''}: {warns[0]}{warns.length>1?` (+${warns.length-1} more)`:''}
                      </div>
                    )}
                  </div>

                  {/* Preview + Print */}
                  {html && (
                    <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }}
                      style={{ display:'flex',flexDirection:'column',gap:10 }}>
                      {/* Action bar */}
                      <div className="panel-lo" style={{ padding:'14px 18px',display:'flex',alignItems:'center',gap:10 }}>
                        <span style={{ fontSize:16 }}>✅</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:'var(--lo)' }}>Document converted — preview below</div>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>
                            {wordCount.toLocaleString()} words · click "Save as PDF" in the print dialog
                          </div>
                        </div>
                        <button className="btn-sec" style={{ width:'auto',padding:'8px 18px',fontSize:10 }}
                          onClick={() => printAsPDF(html, file.name)}>
                          🖨 Open Print Dialog
                        </button>
                        <button className="btn-ghost" onClick={reset}>↺ New</button>
                      </div>

                      {/* Hint: how to save as PDF */}
                      <div className="hint">
                        <span>💡</span>
                        <span>In the print dialog: set <strong>Destination</strong> to <strong>"Save as PDF"</strong> (Chrome/Edge) or <strong>"Microsoft Print to PDF"</strong> (Windows). Set margins to Default or None. Click Save.</span>
                      </div>

                      {/* Page preview */}
                      <div style={{ borderRadius:10,overflow:'hidden',
                        border:dk?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        background:'#e8e8e8',padding:'24px 20px' }}>
                        <div className="lbl" style={{ marginBottom:12,textAlign:'center' }}>Document Preview</div>
                        <div ref={previewRef} className="doc-preview" dangerouslySetInnerHTML={{ __html: html }}/>
                      </div>
                    </motion.div>
                  )}

                  
                </motion.div>
              )}

              {/* ══ HISTORY ══ */}
              {tab==='history' && (
                <motion.div key="hist" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:10 }}>
                  <div className="hint"><span>⌛</span><span>Session history. Click "Print" to re-open the print dialog for any document.</span></div>
                  {history.length === 0
                    ? <div style={{ textAlign:'center',padding:'60px',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'var(--tx3)' }}>
                        No documents converted yet this session.
                      </div>
                    : history.map((h,i) => (
                        <motion.div key={h.id} initial={{ opacity:0,x:-6 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*.04 }}>
                          <div className="hist-row">
                            <span style={{ fontSize:18 }}>📝</span>
                            <div style={{ flex:1 }}>
                              <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12.5,color:'var(--tx)',marginBottom:2 }}>{h.name}</div>
                              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>
                                {h.words.toLocaleString()} words · {h.size} MB · {h.time}
                              </div>
                            </div>
                            <button className="btn-sec" style={{ width:'auto',padding:'5px 12px',fontSize:8.5 }}
                              onClick={() => printAsPDF(h.html, h.name)}>
                              🖨 Print
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
                      How Word to PDF Conversion Works
                    </div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx3)',marginBottom:24,letterSpacing:'.12em' }}>
                      HOW IT WORKS · QUALITY · LIMITATIONS · FAQ
                    </div>
                    <div className="prose">
                      <h3>Two-Step Process</h3>
                      <p>This converter uses <strong>mammoth.js</strong> — an open-source library — to parse your .docx file and convert it to clean HTML directly in your browser. Then the browser's native <strong>print-to-PDF</strong> engine (the same engine used by Chrome, Edge, and Safari) renders that HTML into a high-quality PDF. No server involved, no upload required.</p>
                      <h3>Why Not Direct .docx → .pdf?</h3>
                      <p>True Word-to-PDF conversion at pixel-perfect quality requires a full document layout engine — the kind built into Microsoft Word, LibreOffice, or Google Docs. Browsers don't include this. The mammoth.js + print approach is the best honest alternative available entirely in a browser, and produces excellent results for standard documents.</p>
                      <h3>Getting the Best PDF Quality</h3>
                      <p>Use <strong>Google Chrome or Microsoft Edge</strong> for the best print-to-PDF output. In the print dialog, set Destination to "Save as PDF," set margins to Default or None, enable "Background graphics" if your document has colors, and set paper size to match your document (A4 or Letter).</p>
                      <h3>What Converts Well vs Poorly</h3>
                      <p><strong>Converts well:</strong> Headings, body text, bullet lists, numbered lists, bold/italic, hyperlinks, basic tables. <strong>May not convert:</strong> Complex multi-column layouts, text boxes, SmartArt, charts, custom fonts not available in the browser, exact pixel-perfect margins from Word.</p>
                      {[
                        { q:'Why does my document look different in the preview?', a:'mammoth.js converts the semantic content of Word documents (headings, paragraphs, lists, tables) but cannot replicate exact Word formatting like custom fonts, precise margins, or complex table styles. The output is clean and readable, but not a pixel-perfect replica. For exact reproduction, use Microsoft Word\'s built-in "Save as PDF" or Google Docs.' },
                        { q:'The print dialog opened but I don\'t see "Save as PDF"', a:'In Chrome/Edge, click the "Destination" dropdown in the print dialog and select "Save as PDF." On Mac, click the PDF button at the bottom-left of the print dialog. On Windows with an older browser, install "Microsoft Print to PDF" as a printer. Firefox also supports "Save to PDF" as a destination.' },
                        { q:'Can I convert .doc files (not .docx)?', a:'mammoth.js primarily supports the modern .docx format (Office Open XML). Older .doc files (Word 97-2003 binary format) may not convert correctly. For .doc files, open them in Word or Google Docs first and save as .docx, then convert here.' },
                        { q:'Is my document private?', a:'Yes. Your file is read and processed entirely within your browser using JavaScript. Nothing is uploaded to any server. The document data stays on your device and is discarded when you close the tab.' },
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