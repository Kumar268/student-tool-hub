import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   PDF.word — PDF to Word Converter (AI-powered via Claude)
   JetBrains Mono + Outfit · Dark/Light · Real extraction
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
  background-image:radial-gradient(ellipse 70% 40% at 50% -5%,rgba(99,102,241,.07),transparent 60%),
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

.btn-pri{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 22px;
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.09em;
  text-transform:uppercase;font-weight:600;border:none;transition:all .13s;width:100%;}
.dk .btn-pri{background:var(--blue);color:#fff;border-radius:6px;}
.dk .btn-pri:hover:not(:disabled){background:#818cf8;}
.lt .btn-pri{background:var(--blue);color:#fff;border-radius:10px;}
.lt .btn-pri:hover:not(:disabled){background:#4f46e5;}
.btn-pri:disabled{opacity:.45;cursor:not-allowed;}
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

.inp{width:100%;padding:8px 11px;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;transition:all .13s;}
.dk .inp{background:rgba(0,0,0,.4);border:1px solid var(--bdr);color:var(--tx);border-radius:6px;}
.dk .inp:focus{border-color:var(--acc);}
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
.dk .hint-er{border:1px solid rgba(248,113,113,.2);border-radius:7px;background:rgba(248,113,113,.05);border-left:3px solid var(--er);color:var(--tx2);}
.lt .hint-er{border:1.5px solid rgba(220,38,38,.18);border-radius:11px;background:rgba(220,38,38,.04);border-left:3px solid var(--er);color:var(--tx2);}

.scard{padding:11px 13px;display:flex;flex-direction:column;gap:3px;}
.dk .scard{background:rgba(56,189,248,.03);border:1px solid rgba(56,189,248,.1);border-radius:7px;}
.lt .scard{background:rgba(3,105,161,.03);border:1.5px solid rgba(3,105,161,.1);border-radius:11px;}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(56,189,248,.012);border:1px dashed rgba(56,189,248,.1);border-radius:7px;}
.lt .ad{background:rgba(3,105,161,.025);border:1.5px dashed rgba(3,105,161,.12);border-radius:11px;}
.ad span{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:var(--tx3);}

/* Drop zone */
.dropzone{border-radius:10px;cursor:pointer;transition:all .18s;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:48px 32px;text-align:center;position:relative;overflow:hidden;}
.dk .dropzone{border:2px dashed rgba(56,189,248,.2);background:rgba(56,189,248,.02);}
.dk .dropzone:hover,.dk .dropzone.drag{border-color:rgba(99,102,241,.5);background:rgba(99,102,241,.05);}
.lt .dropzone{border:2px dashed rgba(3,105,161,.2);background:rgba(3,105,161,.02);}
.lt .dropzone:hover,.lt .dropzone.drag{border-color:rgba(67,56,202,.4);background:rgba(67,56,202,.04);}

/* Output area */
.output-area{font-family:'Outfit',sans-serif;font-size:13.5px;line-height:1.9;color:var(--tx2);
  white-space:pre-wrap;word-break:break-word;padding:24px 28px;
  max-height:520px;overflow-y:auto;scrollbar-width:thin;}
.dk .output-area{scrollbar-color:var(--bdr) transparent;}
.lt .output-area{scrollbar-color:var(--bdr) transparent;}

/* Progress bar */
.prog-wrap{height:6px;border-radius:3px;overflow:hidden;background:var(--bdr);}
.prog{height:100%;border-radius:3px;background:linear-gradient(90deg,var(--blue),var(--acc));transition:width .4s ease;}

.hist-row{padding:11px 14px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;transition:all .12s;gap:12px;}
.dk .hist-row{border:1px solid var(--bdr);border-radius:8px;background:var(--s2);}
.dk .hist-row:hover{border-color:rgba(56,189,248,.3);}
.lt .hist-row{border:1.5px solid var(--bdr);border-radius:12px;background:var(--s1);}
.lt .hist-row:hover{border-color:var(--acc);}

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

const STAGE_LABELS = [
  'Reading PDF…',
  'Extracting text with AI…',
  'Rebuilding structure…',
  'Formatting output…',
  'Preparing download…',
];

/* ── Convert PDF base64 → extract text via Claude ── */
async function extractWithClaude(base64Data, filename) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: base64Data }
          },
          {
            type: "text",
            text: `You are a document extraction expert. Extract ALL text content from this PDF and return it in clean, well-structured plain text format suitable for a Word document.

Rules:
- Preserve all headings, subheadings, paragraphs, bullet points, numbered lists
- Maintain the reading order and logical document structure
- Use === for main headings, --- for subheadings
- Preserve any tables as plain text with | separators
- Keep all body text, footnotes, captions
- Do NOT summarize — extract EVERYTHING verbatim
- Do NOT add any commentary, preamble, or notes
- Start directly with the document content

File: ${filename}`
          }
        ]
      }]
    })
  });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  const data = await response.json();
  const text = data.content?.find(b => b.type === 'text')?.text || '';
  if (!text) throw new Error('No text extracted from PDF');
  return text;
}

/* ── Generate .doc file (Word-compatible HTML) ── */
function generateWordDoc(text, filename) {
  const htmlContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office'
    xmlns:w='urn:schemas-microsoft-com:office:word'
    xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>${filename}</title>
<style>
  body { font-family: Calibri, sans-serif; font-size: 11pt; line-height: 1.6; margin: 2cm; color: #1a1a1a; }
  h1 { font-size: 18pt; font-weight: bold; margin: 18pt 0 8pt; color: #1a1a2e; }
  h2 { font-size: 14pt; font-weight: bold; margin: 14pt 0 6pt; color: #16213e; }
  p  { margin: 0 0 8pt; }
  table { border-collapse: collapse; width: 100%; margin: 10pt 0; }
  td, th { border: 1px solid #ccc; padding: 4pt 8pt; }
</style></head><body>`;

  // Convert plain text markers to HTML
  const lines = text.split('\n');
  let html = htmlContent;
  let inList = false;

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line) {
      if (inList) { html += '</ul>'; inList = false; }
      html += '<p>&nbsp;</p>';
      continue;
    }
    if (line.startsWith('===')) {
      if (inList) { html += '</ul>'; inList = false; }
      const title = line.replace(/^=+\s*/, '').replace(/\s*=+$/, '').trim();
      html += `<h1>${title}</h1>`;
    } else if (line.startsWith('---')) {
      if (inList) { html += '</ul>'; inList = false; }
      const title = line.replace(/^-+\s*/, '').replace(/\s*-+$/, '').trim();
      html += `<h2>${title}</h2>`;
    } else if (/^[•\-\*]\s/.test(line)) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${line.replace(/^[•\-\*]\s/, '')}</li>`;
    } else if (/^\d+\.\s/.test(line)) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<p>${line}</p>`;
    } else if (line.includes('|')) {
      if (inList) { html += '</ul>'; inList = false; }
      const cells = line.split('|').filter(c => c.trim());
      html += `<table><tr>${cells.map(c => `<td>${c.trim()}</td>`).join('')}</tr></table>`;
    } else {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<p>${line}</p>`;
    }
  }
  if (inList) html += '</ul>';
  html += '</body></html>';

  const blob = new Blob([html], { type: 'application/msword' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename.replace(/\.pdf$/i, '') + '.doc';
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Also offer plain .txt download ── */
function downloadTxt(text, filename) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename.replace(/\.pdf$/i, '') + '.txt';
  a.click();
  URL.revokeObjectURL(url);
}

export default function PDFToWord() {
  const [dark, setDark]       = useState(true);
  const [tab,  setTab]        = useState('convert');
  const dk = dark;

  const [file,       setFile]       = useState(null);   // { name, size, base64 }
  const [drag,       setDrag]       = useState(false);
  const [stage,      setStage]      = useState(0);      // 0–5
  const [converting, setConverting] = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [result,     setResult]     = useState(null);   // extracted text
  const [error,      setError]      = useState(null);
  const [history,    setHistory]    = useState([]);
  const [wordCount,  setWordCount]  = useState(0);
  const [charCount,  setCharCount]  = useState(0);
  const inputRef = useRef();

  const readFile = useCallback((f) => {
    if (!f || f.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.'); return;
    }
    setError(null); setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1];
      setFile({ name: f.name, size: (f.size / 1024 / 1024).toFixed(2), base64 });
    };
    reader.readAsDataURL(f);
  }, []);

  const onFileInput = (e) => { if (e.target.files[0]) readFile(e.target.files[0]); };
  const onDrop      = (e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer.files[0]) readFile(e.dataTransfer.files[0]); };
  const onDragOver  = (e) => { e.preventDefault(); setDrag(true); };
  const onDragLeave = ()  => setDrag(false);

  const convert = async () => {
    if (!file || converting) return;
    setConverting(true); setError(null); setResult(null); setProgress(0); setStage(0);

    try {
      // Animate stages
      const advance = (s, p) => { setStage(s); setProgress(p); };
      advance(0, 8);
      await new Promise(r => setTimeout(r, 400));
      advance(1, 20);

      const extracted = await extractWithClaude(file.base64, file.name);

      advance(2, 65);
      await new Promise(r => setTimeout(r, 300));
      advance(3, 82);
      await new Promise(r => setTimeout(r, 250));
      advance(4, 96);
      await new Promise(r => setTimeout(r, 200));

      setResult(extracted);
      setWordCount(extracted.split(/\s+/).filter(Boolean).length);
      setCharCount(extracted.length);
      setProgress(100);

      setHistory(h => [{
        id: Date.now(),
        name: file.name,
        size: file.size,
        words: extracted.split(/\s+/).filter(Boolean).length,
        chars: extracted.length,
        time: new Date().toLocaleTimeString(),
        text: extracted,
      }, ...h].slice(0, 15));

    } catch (err) {
      setError(err.message || 'Conversion failed. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  const reset = () => {
    setFile(null); setResult(null); setError(null);
    setProgress(0); setStage(0); setWordCount(0); setCharCount(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  const sideStats = [
    { label:'Status',      val: converting?'Converting…':result?'Done ✓':file?'Ready':'No file', color: converting?'var(--warn)':result?'var(--lo)':file?'var(--acc)':'var(--tx3)' },
    { label:'Words',       val: wordCount > 0 ? wordCount.toLocaleString() : '—', color:'var(--acc)' },
    { label:'Characters',  val: charCount > 0 ? charCount.toLocaleString() : '—', color:'var(--pur)' },
    { label:'Converted',   val: `${history.length}`, color:'var(--gold)' },
  ];

  return (
    <>
      <style>{S}</style>
      <div className={dk?'dk':'lt'}>

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{ display:'flex',alignItems:'center',gap:9 }}>
            <div style={{ width:32,height:32,borderRadius:dk?6:10,display:'flex',alignItems:'center',justifyContent:'center',
              background:dk?'rgba(99,102,241,.12)':'linear-gradient(135deg,#4338ca,#6366f1)',
              border:dk?'1px solid rgba(99,102,241,.3)':'none' }}>
              <span style={{ fontSize:15 }}>📄</span>
            </div>
            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:17,color:'var(--tx)' }}>
              PDF<span style={{ color:'var(--blue)' }}>.word</span>
            </span>
          </div>
          <div style={{ flex:1 }}/>
          {result && (
            <div style={{ padding:'4px 12px',borderRadius:20,border:'1px solid rgba(74,222,128,.25)',
              background:'rgba(74,222,128,.07)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--lo)',fontWeight:600 }}>
              {wordCount.toLocaleString()} words extracted
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
            <div className="sec-lbl">Conversion Info</div>
            {sideStats.map((s,i) => (
              <div key={i} className="scard">
                <div className="lbl" style={{ margin:0 }}>{s.label}</div>
                <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:14,color:s.color }}>{s.val}</div>
              </div>
            ))}
            
            <div className="sec-lbl" style={{ marginTop:4 }}>Tips</div>
            {['AI reads text, tables & headings','Scanned PDFs may have less accuracy','Clean layout = better output','Max ~20MB recommended','Download as .doc or .txt'].map((t,i) => (
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
                        PDF → Word Converter
                      </div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--blue)',
                        padding:'3px 9px',borderRadius:4,border:'1px solid rgba(99,102,241,.3)',background:'rgba(99,102,241,.07)' }}>
                        AI-POWERED
                      </div>
                    </div>

                    {/* Drop zone */}
                    {!file && (
                      <label
                        className={`dropzone ${drag?'drag':''}`}
                        onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                        htmlFor="pdf-input">
                        <motion.div animate={{ y: [0,-6,0] }} transition={{ repeat:Infinity, duration:2.8, ease:'easeInOut' }}>
                          <span style={{ fontSize:40 }}>📄</span>
                        </motion.div>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:15,color:'var(--tx)' }}>
                          Drop your PDF here
                        </div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>
                          or click to browse · PDF files only
                        </div>
                        <input id="pdf-input" ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden"
                          style={{ display:'none' }} onChange={onFileInput}/>
                      </label>
                    )}

                    {/* File ready */}
                    {file && !converting && !result && (
                      <motion.div initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }}
                        style={{ display:'flex',flexDirection:'column',gap:12 }}>
                        <div style={{ display:'flex',alignItems:'center',gap:12,padding:'14px 16px',borderRadius:8,
                          border:dk?'1px solid rgba(99,102,241,.25)':'1.5px solid rgba(67,56,202,.18)',
                          background:dk?'rgba(99,102,241,.06)':'rgba(67,56,202,.04)' }}>
                          <span style={{ fontSize:24 }}>📄</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:14,color:'var(--tx)',marginBottom:2 }}>{file.name}</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx3)' }}>{file.size} MB · PDF</div>
                          </div>
                          <button onClick={reset} className="btn-ghost" style={{ fontSize:10 }}>✕ Remove</button>
                        </div>
                        <button className="btn-pri" onClick={convert}>
                          <span>⚡</span> Convert to Word Document
                        </button>
                      </motion.div>
                    )}

                    {/* Converting progress */}
                    {converting && (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                        style={{ display:'flex',flexDirection:'column',gap:12 }}>
                        <div style={{ display:'flex',justifyContent:'space-between',marginBottom:2 }}>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx2)' }}>
                            {STAGE_LABELS[stage] || 'Processing…'}
                          </div>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--blue)' }}>{progress}%</div>
                        </div>
                        <div className="prog-wrap">
                          <div className="prog" style={{ width:`${progress}%` }}/>
                        </div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',textAlign:'center' }}>
                          Claude is reading your PDF and extracting all text and structure…
                        </div>
                      </motion.div>
                    )}

                    {/* Error */}
                    {error && (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="hint-er">
                        <span>⚠</span><span>{error}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Result */}
                  {result && (
                    <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} className="panel-lo"
                      style={{ display:'flex',flexDirection:'column',gap:0,overflow:'hidden' }}>
                      {/* Result header */}
                      <div style={{ padding:'14px 20px',display:'flex',alignItems:'center',gap:10,
                        borderBottom:dk?'1px solid rgba(74,222,128,.15)':'1.5px solid rgba(21,128,61,.12)' }}>
                        <span style={{ fontSize:16 }}>✅</span>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:'var(--lo)' }}>Conversion complete</div>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>
                            {wordCount.toLocaleString()} words · {charCount.toLocaleString()} characters extracted
                          </div>
                        </div>
                        <div style={{ display:'flex',gap:7 }}>
                          <button className="btn-dl" onClick={() => generateWordDoc(result, file.name)}>
                            ⬇ .doc
                          </button>
                          <button className="btn-dl" onClick={() => downloadTxt(result, file.name)}
                            style={{ background:dk?'rgba(56,189,248,.08)':'rgba(3,105,161,.06)',
                              color:'var(--acc)',border:dk?'1px solid rgba(56,189,248,.2)':'1.5px solid rgba(3,105,161,.15)' }}>
                            ⬇ .txt
                          </button>
                          <button className="btn-ghost" onClick={reset}>↺ New</button>
                        </div>
                      </div>

                      {/* Preview */}
                      <div style={{ padding:'0 0 4px' }}>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)',
                          padding:'8px 20px 4px',letterSpacing:'.12em',textTransform:'uppercase' }}>
                          Extracted Content Preview
                        </div>
                        <div className="output-area">{result}</div>
                      </div>
                    </motion.div>
                  )}

                  
                </motion.div>
              )}

              {/* ══ HISTORY ══ */}
              {tab==='history' && (
                <motion.div key="hist" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:10 }}>
                  <div className="hint"><span>⌛</span><span>Session history. Click any row to preview and re-download.</span></div>
                  {history.length === 0
                    ? <div style={{ textAlign:'center',padding:'60px',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'var(--tx3)' }}>
                        No conversions yet this session.
                      </div>
                    : history.map((h,i) => (
                        <motion.div key={h.id} initial={{ opacity:0,x:-6 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*.03 }}>
                          <div className="hist-row" onClick={() => {}}>
                            <span style={{ fontSize:18 }}>📄</span>
                            <div style={{ flex:1 }}>
                              <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12.5,color:'var(--tx)',marginBottom:2 }}>{h.name}</div>
                              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>
                                {h.words.toLocaleString()} words · {h.size} MB · {h.time}
                              </div>
                            </div>
                            <div style={{ display:'flex',gap:6 }}>
                              <button className="btn-dl" style={{ padding:'5px 10px',fontSize:8.5 }}
                                onClick={e => { e.stopPropagation(); generateWordDoc(h.text, h.name); }}>
                                .doc
                              </button>
                              <button className="btn-dl" style={{ padding:'5px 10px',fontSize:8.5,
                                background:dk?'rgba(56,189,248,.08)':'rgba(3,105,161,.06)',
                                color:'var(--acc)',border:dk?'1px solid rgba(56,189,248,.2)':'1.5px solid rgba(3,105,161,.15)' }}
                                onClick={e => { e.stopPropagation(); downloadTxt(h.text, h.name); }}>
                                .txt
                              </button>
                            </div>
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
                      How to Convert PDF to Word (and Why It's Hard)
                    </div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx3)',marginBottom:24,letterSpacing:'.12em' }}>
                      TEXT EXTRACTION · FORMATTING · LIMITATIONS · FAQ
                    </div>
                    <div className="prose">
                      <h3>How This Converter Works</h3>
                      <p>Unlike traditional converters that use simple text parsing, this tool uses <strong>Claude AI</strong> to read and understand your PDF. It extracts text, recognizes headings, preserves bullet points and numbered lists, and rebuilds tables — producing a clean, structured document ready to paste into Word.</p>
                      <h3>What PDFs Convert Best</h3>
                      <p><strong>Text-based PDFs</strong> convert perfectly — these are PDFs created from Word, Google Docs, or any software where the underlying text is digitally stored. <strong>Scanned PDFs</strong> (photos of paper) have lower accuracy because they require optical character recognition (OCR). Simple, clean layouts outperform complex multi-column academic journal formats.</p>
                      <h3>Formatting Limitations</h3>
                      <p>PDF is a fixed-layout format — it was designed for printing, not editing. Converting to Word means rebuilding structure that the PDF format deliberately destroys: flowing paragraphs become fixed-position text boxes, columns become parallel text streams, and fonts are often embedded as graphics. AI helps reconstruct this, but complex layouts will need manual cleanup.</p>
                      <h3>Download Formats</h3>
                      <p><strong>.doc</strong> — Opens directly in Microsoft Word, LibreOffice, and Google Docs. Preserves heading structure, lists, and table formatting. Best for editing. <strong>.txt</strong> — Plain text, universal compatibility. No formatting, but works everywhere and is great for pasting into any application.</p>
                      {[
                        { q:'My PDF is a scanned document. Will it work?', a:'Scanned PDFs are images of text, not actual text. Claude can attempt OCR (optical character recognition) on clear scans, but accuracy depends heavily on scan quality, font clarity, and image resolution. For best results, scan at 300+ DPI with high contrast.' },
                        { q:'Is my PDF data private?', a:'Your PDF is sent to the Anthropic API for processing via the same security infrastructure used by Claude.ai. Anthropic does not use API inputs to train models. Do not upload documents containing sensitive personal data, passwords, or confidential financial information.' },
                        { q:'Why do tables look wrong in the output?', a:'Tables in PDFs are notoriously difficult to extract because PDF stores them as positioned text with no actual table structure. The AI reconstructs table boundaries intelligently, but complex merged cells, nested tables, or tables that span multiple pages may require manual reformatting in Word.' },
                        { q:'What is the file size limit?', a:'The Anthropic API supports PDF documents. For very large PDFs (50MB+), processing may be slow. If your PDF has hundreds of pages, consider splitting it into sections before converting for better results and faster processing.' },
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