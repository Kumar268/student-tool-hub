import { useState, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { PDFDocument } from "https://esm.sh/pdf-lib@1.17.1";

/* ═══════════════════════════════════════════════════════════════
   PDF MERGE · SPLIT · ROTATE · REORDER
   Theme: Dark Obsidian/Violet · Light Chalk/Indigo
   Fonts: Space Grotesk · JetBrains Mono · Newsreader
   Engine: pdf-lib in-browser, zero uploads
   Modes: Merge · Split/Extract · Rotate Pages · Reorder · Delete
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@300;400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Newsreader',serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeup{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@keyframes check-draw{from{stroke-dashoffset:40}to{stroke-dashoffset:0}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(139,92,246,.3)}50%{box-shadow:0 0 0 8px rgba(139,92,246,0)}}
@keyframes shimmer{0%{opacity:.6}50%{opacity:1}100%{opacity:.6}}

/* ── DARK: deep obsidian + violet ── */
.dk{
  --bg:#07060f;--s1:#0c0b17;--s2:#100f1e;--s3:#151324;
  --bdr:#1c1a2e;--bdr-hi:rgba(139,92,246,.3);
  --acc:#8b5cf6;--acc2:#06b6d4;--acc3:#34d399;
  --err:#f87171;--warn:#fbbf24;
  --tx:#ede9fe;--tx2:#c4b5fd;--tx3:#3b2d6b;--txm:#7c6db5;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 65% 35% at 50% 0%,rgba(139,92,246,.08),transparent),
    radial-gradient(ellipse 35% 50% at 95% 80%,rgba(6,182,212,.04),transparent);
}
/* ── LIGHT: chalk white + indigo ── */
.lt{
  --bg:#f8f7ff;--s1:#ffffff;--s2:#f3f1ff;--s3:#ede9fe;
  --bdr:#ddd6fe;--bdr-hi:#5b21b6;
  --acc:#5b21b6;--acc2:#0369a1;--acc3:#065f46;
  --err:#991b1b;--warn:#92400e;
  --tx:#1e1b4b;--tx2:#4c1d95;--tx3:#c4b5fd;--txm:#7c3aed;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 35% at 50% -5%,rgba(91,33,182,.06),transparent);
}

.topbar{height:44px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 14px;gap:8px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(7,6,15,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(248,247,255,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 10px rgba(91,33,182,.06);}

.tabbar{display:flex;overflow-x:auto}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:38px;padding:0 13px;border:none;cursor:pointer;background:transparent;border-bottom:2px solid transparent;
  font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;
  display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .14s;}
.dk .tab{color:var(--tx3);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(139,92,246,.05);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#9ca3af;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(91,33,182,.05);}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns:215px 1fr;min-height:calc(100vh - 82px);}
.sidebar{padding:12px 10px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:13px 15px;display:flex;flex-direction:column;gap:13px;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:3px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:10px;box-shadow:0 2px 14px rgba(91,33,182,.05);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 18px;cursor:pointer;
  font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;
  transition:all .15s;border:none;}
.dk .btn{background:var(--acc);color:#07060f;border-radius:2px;box-shadow:0 0 18px rgba(139,92,246,.3);animation:pulse 2.5s infinite;}
.dk .btn:hover{background:#a78bfa;box-shadow:0 0 30px rgba(139,92,246,.55);transform:translateY(-1px);animation:none;}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;box-shadow:none;animation:none;transform:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:7px;box-shadow:0 4px 14px rgba(91,33,182,.35);}
.lt .btn:hover{background:#4c1d95;box-shadow:0 8px 24px rgba(91,33,182,.45);transform:translateY(-1px);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}

.btn-sm{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:4px 9px;cursor:pointer;
  font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.06em;text-transform:uppercase;background:transparent;transition:all .12s;border:none;}
.dk .btn-sm{border:1px solid var(--bdr);border-radius:2px;color:var(--txm);}
.dk .btn-sm:hover,.dk .btn-sm.on{border-color:var(--acc);color:var(--acc);background:rgba(139,92,246,.06);}
.lt .btn-sm{border:1.5px solid var(--bdr);border-radius:5px;color:#7c3aed;}
.lt .btn-sm:hover,.lt .btn-sm.on{border-color:var(--acc);color:var(--acc);background:rgba(91,33,182,.06);}
.btn-danger{display:inline-flex;align-items:center;gap:4px;padding:4px 8px;cursor:pointer;
  font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.06em;text-transform:uppercase;background:transparent;transition:all .12s;border:none;}
.dk .btn-danger{border:1px solid rgba(248,113,113,.2);border-radius:2px;color:var(--err);}
.dk .btn-danger:hover{border-color:var(--err);background:rgba(248,113,113,.07);}
.lt .btn-danger{border:1.5px solid rgba(153,27,27,.2);border-radius:5px;color:var(--err);}
.lt .btn-danger:hover{border-color:var(--err);background:rgba(153,27,27,.05);}

.inp{outline:none;font-family:'JetBrains Mono',monospace;font-size:12px;padding:7px 10px;transition:border-color .12s;}
.dk .inp{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:2px;color:var(--tx);}
.dk .inp:focus{border-color:var(--acc);}
.lt .inp{background:#f8f7ff;border:1.5px solid var(--bdr);border-radius:6px;color:var(--tx);}
.lt .inp:focus{border-color:var(--acc);}

.drop-zone{border:2px dashed;border-radius:8px;transition:all .2s;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:10px;cursor:pointer;position:relative;padding:28px 20px;text-align:center;}
.dk .drop-zone{border-color:rgba(139,92,246,.2);background:rgba(139,92,246,.03);}
.dk .drop-zone.over{border-color:var(--acc);background:rgba(139,92,246,.08);box-shadow:0 0 30px rgba(139,92,246,.12);}
.dk .drop-zone:hover{border-color:rgba(139,92,246,.4);}
.lt .drop-zone{border-color:rgba(91,33,182,.2);background:rgba(91,33,182,.02);}
.lt .drop-zone.over{border-color:var(--acc);background:rgba(91,33,182,.06);}
.lt .drop-zone:hover{border-color:rgba(91,33,182,.4);}

/* FILE ROW */
.file-row{display:flex;align-items:center;gap:9px;padding:9px 12px;transition:background .12s;cursor:grab;}
.file-row.dragging{opacity:.4;}
.dk .file-row{border-bottom:1px solid var(--bdr);}
.lt .file-row{border-bottom:1.5px solid var(--bdr);}
.dk .file-row:hover{background:rgba(139,92,246,.04);}
.lt .file-row:hover{background:rgba(91,33,182,.03);}
.file-num{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;flex-shrink:0;}
.dk .file-num{border:1px solid rgba(139,92,246,.3);background:rgba(139,92,246,.08);color:var(--acc);}
.lt .file-num{border:1.5px solid rgba(91,33,182,.3);background:rgba(91,33,182,.07);color:var(--acc);}

/* PAGE GRID (reorder/delete) */
.page-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px;}
.page-tile{border-radius:5px;overflow:hidden;cursor:pointer;transition:all .15s;position:relative;aspect-ratio:3/4;
  display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px;}
.dk .page-tile{border:1px solid var(--bdr);background:var(--s3);}
.lt .page-tile{border:1.5px solid var(--bdr);background:var(--s2);}
.dk .page-tile:hover{border-color:var(--acc);box-shadow:0 0 14px rgba(139,92,246,.2);}
.lt .page-tile:hover{border-color:var(--acc);box-shadow:0 3px 12px rgba(91,33,182,.15);}
.page-tile.sel{border-color:var(--acc)!important;}
.dk .page-tile.sel{background:rgba(139,92,246,.12);box-shadow:0 0 18px rgba(139,92,246,.25);}
.lt .page-tile.sel{background:rgba(91,33,182,.08);box-shadow:0 3px 14px rgba(91,33,182,.2);}
.page-tile.deleted{opacity:.3;filter:grayscale(1);}
.page-tile-num{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;color:var(--acc);}
.page-tile-icon{font-size:22px;opacity:.6;}
.page-tile-rot{position:absolute;top:4px;right:4px;font-family:'JetBrains Mono',monospace;font-size:8px;
  padding:1px 4px;border-radius:2px;background:rgba(139,92,246,.7);color:#fff;}

/* PROGRESS */
.prog-wrap{height:4px;border-radius:2px;overflow:hidden;}
.dk .prog-wrap{background:rgba(139,92,246,.12);}
.lt .prog-wrap{background:rgba(91,33,182,.1);}
.prog-bar{height:100%;border-radius:2px;transition:width .25s ease;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc2));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc2));}

/* SUCCESS */
.success-ring{width:68px;height:68px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
.dk .success-ring{background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.3);}
.lt .success-ring{background:rgba(6,95,70,.08);border:1.5px solid rgba(6,95,70,.25);}

/* HISTORY */
.hist-row{display:flex;align-items:center;gap:10px;padding:9px 13px;transition:background .12s;}
.dk .hist-row{border-bottom:1px solid var(--bdr);}
.lt .hist-row{border-bottom:1.5px solid var(--bdr);}
.dk .hist-row:hover{background:rgba(139,92,246,.04);}
.lt .hist-row:hover{background:rgba(91,33,182,.03);}

/* LABELS */
.lbl{font-family:'JetBrains Mono',monospace;font-size:8.5px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(139,92,246,.5);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.22em;text-transform:uppercase;margin-bottom:7px;}
.dk .slbl{color:rgba(139,92,246,.38);}
.lt .slbl{color:var(--acc);}
.metab{padding:8px 10px;}
.dk .metab{border:1px solid rgba(139,92,246,.1);border-radius:2px;background:rgba(139,92,246,.03);}
.lt .metab{border:1.5px solid rgba(91,33,182,.12);border-radius:7px;background:rgba(91,33,182,.04);}
.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(139,92,246,.012);border:1px dashed rgba(139,92,246,.1);border-radius:2px;}
.lt .ad{background:rgba(91,33,182,.025);border:1.5px dashed rgba(91,33,182,.14);border-radius:8px;}
.ad span{font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--tx3);}
.step-n{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;flex-shrink:0;}
.dk .step-n{border:1px solid rgba(139,92,246,.3);background:rgba(139,92,246,.07);color:var(--acc);}
.lt .step-n{border:1.5px solid rgba(91,33,182,.3);background:rgba(91,33,182,.07);color:var(--acc);}
.prose{font-family:'Newsreader',serif;}
.prose p{font-size:16px;line-height:1.82;margin-bottom:14px;color:var(--tx2);}
.prose h3{font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:700;margin:22px 0 8px;color:var(--tx);text-transform:uppercase;letter-spacing:.04em;}
.prose ul,.prose ol{padding-left:22px;margin-bottom:14px;}
.prose li{font-size:16px;line-height:1.75;margin-bottom:6px;color:var(--tx2);}
.prose strong{font-weight:600;color:var(--tx);}
.faq{padding:12px 14px;margin-bottom:8px;}
.dk .faq{border:1px solid var(--bdr);border-radius:3px;background:rgba(0,0,0,.4);}
.lt .faq{border:1.5px solid var(--bdr);border-radius:9px;background:rgba(91,33,182,.03);}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;}
.dk input[type=range]{background:var(--bdr);}
.lt input[type=range]{background:var(--bdr);}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--acc);}
`;

/* ═══ HELPERS ═══ */
const uid = () => Math.random().toString(36).slice(2, 10);
const fmtSize = b => b < 1024 ? `${b}B` : b < 1048576 ? `${(b / 1024).toFixed(1)}KB` : `${(b / 1048576).toFixed(1)}MB`;
const fmtDate = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/* Parse range string "1,3-5,7" → zero-based indices */
function parseRanges(str, maxPage) {
  const indices = new Set();
  for (const part of str.split(',')) {
    const t = part.trim();
    if (!t) continue;
    if (t.includes('-')) {
      const [a, b] = t.split('-').map(n => parseInt(n.trim()) - 1);
      for (let i = Math.max(0, a); i <= Math.min(maxPage - 1, b); i++) indices.add(i);
    } else {
      const n = parseInt(t) - 1;
      if (n >= 0 && n < maxPage) indices.add(n);
    }
  }
  return [...indices].sort((a, b) => a - b);
}

const ROTATION_STEPS = [0, 90, 180, 270];

const PAGE_TABS = [
  { id: 'merge',   label: '⊕ Merge' },
  { id: 'split',   label: '✂ Split' },
  { id: 'reorder', label: '⇅ Reorder' },
  { id: 'history', label: '⌛ History' },
  { id: 'guide',   label: '? Guide' },
  { id: 'learn',   label: '∑ Learn' },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════ */
export default function PDFMergeSplit() {
  const [dark, setDark]         = useState(true);
  const cls = dark ? 'dk' : 'lt';

  const [tab, setTab]           = useState('merge');

  /* ── Merge state ── */
  const [mergeFiles, setMergeFiles] = useState([]);
  const [mergeDragOver, setMDO]     = useState(false);
  const [mergeDragIdx, setMDI]      = useState(null);

  /* ── Split state ── */
  const [splitFile, setSplitFile]   = useState(null);
  const [splitRanges, setSplitRanges] = useState('1-3');
  const [splitMode, setSplitMode]   = useState('extract'); // extract | remove

  /* ── Reorder/Delete state ── */
  const [roFile, setRoFile]         = useState(null);
  const [, setRoPageCount] = useState(0);
  const [roOrder, setRoOrder]       = useState([]); // [{origIdx, rotation, deleted}]
  const [roSel, setRoSel]           = useState(null);
  const [roDragIdx, setRDI]         = useState(null);

  /* ── Shared ── */
  const [processing, setProc]       = useState(false);
  const [progress, setProgress]     = useState(0);
  const [progMsg, setProgMsg]       = useState('');
  const [result, setResult]         = useState(null);
  const [history, setHistory]       = useState([]);

  const mergeRef  = useRef();
  const splitRef  = useRef();
  const roRef     = useRef();

  /* ═══ MERGE FILE MANAGEMENT ═══ */
  const addMergeFiles = useCallback((files) => {
    const valid = Array.from(files).filter(f => f.type === 'application/pdf');
    setMergeFiles(p => [...p, ...valid.map(file => ({ file, id: uid(), name: file.name, size: file.size }))]);
    setResult(null);
  }, []);
  const removeMerge = id => setMergeFiles(p => p.filter(f => f.id !== id));
  const moveMerge   = (idx, dir) => setMergeFiles(p => {
    const a = [...p]; const ni = idx + dir;
    if (ni < 0 || ni >= a.length) return a;
    [a[idx], a[ni]] = [a[ni], a[idx]]; return a;
  });
  const onMergeDrop = e => { e.preventDefault(); setMDO(false); addMergeFiles(e.dataTransfer.files); };
  const onMDragStart = idx => setMDI(idx);
  const onMDragEnter = idx => {
    if (mergeDragIdx === null || mergeDragIdx === idx) return;
    setMergeFiles(p => {
      const a = [...p]; const item = a.splice(mergeDragIdx, 1)[0];
      a.splice(idx, 0, item); setMDI(idx); return a;
    });
  };

  /* ═══ SPLIT FILE ═══ */
  const loadSplitFile = async (file) => {
    if (!file || file.type !== 'application/pdf') return;
    setSplitFile({ file, name: file.name, size: file.size });
    setResult(null);
    // Get page count
    try {
      const buf = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      setSplitFile(p => ({ ...p, pageCount: pdf.getPageCount() }));
    } catch (e) {
      console.error('Failed to load split file:', e);
    }
  };

  /* ═══ REORDER FILE ═══ */
  const loadRoFile = async (file) => {
    if (!file || file.type !== 'application/pdf') return;
    try {
      const buf = await file.arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      const count = pdf.getPageCount();
      setRoFile({ file, name: file.name, size: file.size });
      setRoPageCount(count);
      setRoOrder(Array.from({ length: count }, (_, i) => ({ origIdx: i, rotation: 0, deleted: false })));
      setRoSel(null);
      setResult(null);
    } catch (e) {
      console.error('Failed to load reorder file:', e);
    }
  };

  const roToggleDelete = idx => setRoOrder(p => p.map((r, i) => i === idx ? { ...r, deleted: !r.deleted } : r));
  const roRotate = idx => setRoOrder(p => p.map((r, i) => {
    if (i !== idx) return r;
    const next = (ROTATION_STEPS.indexOf(r.rotation) + 1) % ROTATION_STEPS.length;
    return { ...r, rotation: ROTATION_STEPS[next] };
  }));
  const roMoveUp   = idx => setRoOrder(p => { const a = [...p]; if (idx === 0) return a; [a[idx-1],a[idx]]=[a[idx],a[idx-1]]; return a; });
  const roMoveDown = idx => setRoOrder(p => { const a = [...p]; if (idx === a.length-1) return a; [a[idx],a[idx+1]]=[a[idx+1],a[idx]]; return a; });
  const onRoDragStart = idx => setRDI(idx);
  const onRoDragEnter = idx => {
    if (roDragIdx === null || roDragIdx === idx) return;
    setRoOrder(p => {
      const a = [...p]; const item = a.splice(roDragIdx, 1)[0];
      a.splice(idx, 0, item); setRDI(idx); return a;
    });
  };

  /* ═══ PROCESS ═══ */
  const process = async (mode) => {
    setProc(true); setProgress(0); setResult(null);
    try {
      const outPdf = await PDFDocument.create();
      let name = 'output.pdf';

      if (mode === 'merge') {
        setProgMsg('Merging PDFs…');
        for (let i = 0; i < mergeFiles.length; i++) {
          setProgress(Math.round((i / mergeFiles.length) * 90));
          setProgMsg(`Adding ${mergeFiles[i].name}…`);
          const buf = await mergeFiles[i].file.arrayBuffer();
          const donor = await PDFDocument.load(buf);
          const pages = await outPdf.copyPages(donor, donor.getPageIndices());
          pages.forEach(p => outPdf.addPage(p));
        }
        name = 'merged.pdf';

      } else if (mode === 'split') {
        setProgMsg('Loading PDF…');
        const buf = await splitFile.file.arrayBuffer();
        const donor = await PDFDocument.load(buf);
        const maxPage = donor.getPageCount();
        const indices = parseRanges(splitRanges, maxPage);
        const useIndices = splitMode === 'extract'
          ? indices
          : Array.from({ length: maxPage }, (_, i) => i).filter(i => !indices.includes(i));
        setProgress(40);
        setProgMsg(`Extracting ${useIndices.length} pages…`);
        const pages = await outPdf.copyPages(donor, useIndices);
        pages.forEach(p => outPdf.addPage(p));
        name = splitMode === 'extract' ? 'extracted.pdf' : 'remaining.pdf';

      } else if (mode === 'reorder') {
        setProgMsg('Loading PDF…');
        const buf = await roFile.file.arrayBuffer();
        const donor = await PDFDocument.load(buf);
        const active = roOrder.filter(r => !r.deleted);
        setProgress(30);
        setProgMsg(`Reordering ${active.length} pages…`);
        const pages = await outPdf.copyPages(donor, active.map(r => r.origIdx));
        pages.forEach((page, i) => {
          const rot = active[i].rotation;
          if (rot) page.setRotation({ angle: rot, type: 'degrees' });
          outPdf.addPage(page);
        });
        setProgress(80);
        name = 'reordered.pdf';
      }

      setProgMsg('Finalising…'); setProgress(94);
      const bytes = await outPdf.save();
      const blob  = new Blob([bytes], { type: 'application/pdf' });
      setProgress(100);
      const entry = { id: uid(), name, blob, size: blob.size, date: new Date(), mode };
      setResult(entry);
      setHistory(p => [entry, ...p.slice(0, 9)]);
    } catch (e) {
      console.error(e);
    } finally {
      setProc(false); setProgMsg('');
    }
  };

  const totalMergeSize = mergeFiles.reduce((a, b) => a + b.size, 0);
  const activeRoPages  = roOrder.filter(r => !r.deleted).length;
  const deletedRoPages = roOrder.filter(r => r.deleted).length;

  /* ═══ RENDER ═══ */
  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

          {/* TOPBAR */}
          <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: dark ? 3 : 8, flexShrink: 0,
              border: dark ? '1px solid rgba(139,92,246,.4)' : 'none',
              background: dark ? 'rgba(139,92,246,.08)' : 'linear-gradient(135deg,#5b21b6,#0369a1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
              boxShadow: dark ? '0 0 14px rgba(139,92,246,.22)' : '0 3px 10px rgba(91,33,182,.4)',
            }}>📑</div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--tx)', letterSpacing: '.01em', lineHeight: 1 }}>
                PDF<span style={{ color: 'var(--acc)' }}>tools</span>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'var(--tx3)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 1 }}>
                merge · split · reorder · rotate
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }} />

          <button onClick={() => setDark(d => !d)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
            border: dark ? '1px solid rgba(139,92,246,.18)' : '1.5px solid var(--bdr)',
            borderRadius: dark ? 2 : 6, background: 'transparent', cursor: 'pointer',
          }}>
            <div style={{ width: 28, height: 14, borderRadius: 8, position: 'relative',
              background: dark ? 'var(--acc)' : '#ddd6fe', boxShadow: dark ? '0 0 8px rgba(139,92,246,.5)' : 'none' }}>
              <div style={{ position: 'absolute', top: 2.5, left: dark ? 'auto' : 2, right: dark ? 2 : 'auto',
                width: 9, height: 9, borderRadius: '50%', background: dark ? '#07060f' : 'white', transition: 'all .2s' }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8.5, letterSpacing: '.1em', color: 'var(--txm)' }}>
              {dark ? 'VOID' : 'CHALK'}
            </span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
          {PAGE_TABS.map(t => (
            <button key={t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => { setTab(t.id); setResult(null); }}>
              {t.label}
              {t.id === 'history' && history.length > 0 && (
                <span style={{ background: 'var(--acc)', color: dark ? '#07060f' : '#fff', borderRadius: 99,
                  fontSize: 8, padding: '0 5px', fontFamily: "'JetBrains Mono',monospace" }}>{history.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="body">

          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* Context summary */}
            {tab === 'merge' && mergeFiles.length > 0 && (
              <div>
                <div className="slbl">Queue ({mergeFiles.length})</div>
                {mergeFiles.map((f, i) => (
                  <div key={f.id} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, padding: '5px 7px',
                    borderRadius: dark ? 2 : 6, border: dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)',
                    background: dark ? 'rgba(0,0,0,.3)' : 'rgba(255,255,255,.8)' }}>
                    <div className="file-num">{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 9.5, fontFamily: "'JetBrains Mono',monospace", color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name.slice(0, 14)}{f.name.length > 14 ? '…' : ''}</div>
                      <div style={{ fontSize: 8, fontFamily: "'JetBrains Mono',monospace", color: 'var(--tx3)' }}>{fmtSize(f.size)}</div>
                    </div>
                    <button onClick={() => removeMerge(f.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--err)', fontSize: 14, flexShrink: 0 }}>×</button>
                  </div>
                ))}
                <div className="metab" style={{ marginTop: 6 }}>
                  <div style={{ fontSize: 8, fontFamily: "'JetBrains Mono',monospace", color: 'var(--tx3)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 1 }}>Total size</div>
                  <div style={{ fontSize: 15, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", color: 'var(--acc)' }}>{fmtSize(totalMergeSize)}</div>
                </div>
              </div>
            )}

            {tab === 'split' && splitFile && (
              <div>
                <div className="slbl">File loaded</div>
                <div className="metab" style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 8, fontFamily: "'JetBrains Mono',monospace", color: 'var(--tx3)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 1 }}>Filename</div>
                  <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: 'var(--tx)', wordBreak: 'break-all' }}>{splitFile.name}</div>
                </div>
                {splitFile.pageCount && (
                  <div className="metab">
                    <div style={{ fontSize: 8, fontFamily: "'JetBrains Mono',monospace", color: 'var(--tx3)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 1 }}>Pages</div>
                    <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: 'var(--acc)' }}>{splitFile.pageCount}</div>
                  </div>
                )}
              </div>
            )}

            {tab === 'reorder' && roFile && (
              <div>
                <div className="slbl">Pages</div>
                {[
                  ['Total',   roOrder.length],
                  ['Active',  activeRoPages],
                  ['Deleted', deletedRoPages],
                  ['Rotated', roOrder.filter(r => r.rotation > 0).length],
                ].map(([l, v]) => (
                  <div key={l} className="metab" style={{ marginBottom: 5 }}>
                    <div style={{ fontSize: 8, fontFamily: "'JetBrains Mono',monospace", color: 'var(--tx3)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 1 }}>{l}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: v > 0 ? 'var(--acc)' : 'var(--txm)' }}>{v}</div>
                  </div>
                ))}
              </div>
            )}

            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══ MERGE ══ */}
              {tab === 'merge' && (
                <motion.div key="merge" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  {!result ? (<>
                    <div className={`drop-zone ${mergeDragOver ? 'over' : ''}`}
                      style={{ minHeight: mergeFiles.length ? 90 : 170 }}
                      onDragOver={e => { e.preventDefault(); setMDO(true); }}
                      onDragLeave={() => setMDO(false)}
                      onDrop={onMergeDrop}
                      onClick={() => mergeRef.current?.click()}>
                      <input ref={mergeRef} type="file" multiple accept=".pdf"
                        onChange={e => { addMergeFiles(e.target.files); e.target.value = ''; }}
                        style={{ display: 'none' }} />
                      <div style={{ fontSize: mergeFiles.length ? 26 : 38 }}>📑</div>
                      <div>
                        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: mergeFiles.length ? 14 : 19, color: 'var(--tx)', marginBottom: 3 }}>
                          {mergeFiles.length ? 'Add more PDFs' : 'Drop PDFs to merge'}
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--tx3)' }}>
                          PDF files only · click or drag · no uploads
                        </div>
                      </div>
                    </div>

                    {mergeFiles.length > 0 && (
                      <div className="panel" style={{ overflow: 'hidden' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px',
                          borderBottom: dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)' }}>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: 'var(--tx2)' }}>
                            {mergeFiles.length} PDF{mergeFiles.length > 1 ? 's' : ''} · drag to reorder
                          </div>
                          <button className="btn-danger" onClick={() => { setMergeFiles([]); setResult(null); }}>× Clear all</button>
                        </div>
                        {mergeFiles.map((f, i) => (
                          <div key={f.id}
                            className={`file-row ${mergeDragIdx === i ? 'dragging' : ''}`}
                            draggable
                            onDragStart={() => onMDragStart(i)}
                            onDragEnter={() => onMDragEnter(i)}
                            onDragEnd={() => setMDI(null)}>
                            <div className="file-num">{i + 1}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 11.5, fontFamily: "'JetBrains Mono',monospace", color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                              <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono',monospace", color: 'var(--tx3)', marginTop: 1 }}>{fmtSize(f.size)}</div>
                            </div>
                            <div style={{ display: 'flex', gap: 3 }}>
                              <button className="btn-sm" onClick={() => moveMerge(i, -1)} disabled={i === 0}
                                style={{ opacity: i === 0 ? 0.3 : 1, padding: '3px 7px' }}>↑</button>
                              <button className="btn-sm" onClick={() => moveMerge(i, 1)} disabled={i === mergeFiles.length - 1}
                                style={{ opacity: i === mergeFiles.length - 1 ? 0.3 : 1, padding: '3px 7px' }}>↓</button>
                              <button className="btn-danger" onClick={() => removeMerge(f.id)}>×</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {mergeFiles.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {processing && (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--tx2)' }}>{progMsg}</span>
                              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--acc)' }}>{progress}%</span>
                            </div>
                            <div className="prog-wrap"><div className="prog-bar" style={{ width: `${progress}%` }} /></div>
                          </div>
                        )}
                        <button className="btn" onClick={() => process('merge')} disabled={processing || mergeFiles.length < 2}
                          style={{ alignSelf: 'flex-start', padding: '10px 26px' }}>
                          {processing
                            ? <><span style={{ display: 'inline-block', animation: 'spin .8s linear infinite' }}>⟳</span>&nbsp;Merging…</>
                            : `⊕ Merge ${mergeFiles.length} PDFs`}
                        </button>
                        {mergeFiles.length < 2 && (
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: 'var(--txm)' }}>
                            Add at least 2 PDFs to merge.
                          </div>
                        )}
                      </div>
                    )}
                  </>) : (
                    <SuccessCard result={result} dark={dark} onReset={() => { setMergeFiles([]); setResult(null); }} />
                  )}

                  
                </motion.div>
              )}

              {/* ══ SPLIT ══ */}
              {tab === 'split' && (
                <motion.div key="split" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  {!result ? (<>
                    <div className="drop-zone"
                      style={{ minHeight: splitFile ? 80 : 160 }}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => { e.preventDefault(); loadSplitFile(e.dataTransfer.files[0]); }}
                      onClick={() => splitRef.current?.click()}>
                      <input ref={splitRef} type="file" accept=".pdf"
                        onChange={e => { loadSplitFile(e.target.files[0]); e.target.value = ''; }}
                        style={{ display: 'none' }} />
                      <div style={{ fontSize: splitFile ? 26 : 36 }}>✂️</div>
                      <div>
                        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: splitFile ? 14 : 18, color: 'var(--tx)', marginBottom: 3 }}>
                          {splitFile ? splitFile.name : 'Drop a PDF to split or extract'}
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--tx3)' }}>
                          {splitFile ? `${splitFile.pageCount ?? '?'} pages · ${fmtSize(splitFile.size)}` : 'Single PDF file · no uploads'}
                        </div>
                      </div>
                    </div>

                    {splitFile && (
                      <div className="panel" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {/* Mode */}
                        <div>
                          <div className="lbl" style={{ marginBottom: 8 }}>Operation</div>
                          <div style={{ display: 'flex', gap: 7 }}>
                            {[
                              { id: 'extract', label: '⊙ Extract pages', desc: 'Keep only the specified pages' },
                              { id: 'remove',  label: '⊗ Remove pages',  desc: 'Delete pages, keep the rest' },
                            ].map(({ id, label, desc }) => (
                              <button key={id} className={`btn-sm ${splitMode === id ? 'on' : ''}`}
                                onClick={() => setSplitMode(id)}
                                style={{ flex: 1, flexDirection: 'column', gap: 3, height: 'auto', padding: '9px 8px', alignItems: 'flex-start',
                                  background: splitMode === id ? (dark ? 'rgba(139,92,246,.08)' : 'rgba(91,33,182,.06)') : '' }}>
                                <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--tx)', textTransform: 'none', letterSpacing: 0 }}>{label}</span>
                                <span style={{ fontSize: 9, opacity: .65, textTransform: 'none', letterSpacing: 0, fontFamily: "'Newsreader',serif" }}>{desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Range input */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <div className="lbl" style={{ margin: 0 }}>Page ranges</div>
                            {splitFile.pageCount && (
                              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: 'var(--txm)' }}>
                                1–{splitFile.pageCount} available
                              </span>
                            )}
                          </div>
                          <input className="inp" value={splitRanges}
                            onChange={e => setSplitRanges(e.target.value)}
                            placeholder="e.g. 1, 3-5, 8"
                            style={{ width: '100%', marginBottom: 6 }} />
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: 'var(--txm)', lineHeight: 1.7 }}>
                            Examples: <span style={{ color: 'var(--acc)' }}>5</span> — single page,
                            &nbsp;<span style={{ color: 'var(--acc)' }}>1-3</span> — range,
                            &nbsp;<span style={{ color: 'var(--acc)' }}>1,4-6,9</span> — mixed
                          </div>
                        </div>

                        {/* Preview of resolved pages */}
                        {splitFile.pageCount && (
                          <div>
                            <div className="lbl" style={{ marginBottom: 6 }}>
                              {splitMode === 'extract' ? 'Pages to extract' : 'Pages to remove'}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {(() => {
                                try {
                                  const idxs = parseRanges(splitRanges, splitFile.pageCount);
                                  const show = splitMode === 'extract' ? idxs : idxs;
                                  return show.map(i => (
                                    <span key={i} style={{
                                      padding: '2px 7px', borderRadius: 3, fontFamily: "'JetBrains Mono',monospace", fontSize: 10,
                                      background: dark ? 'rgba(139,92,246,.12)' : 'rgba(91,33,182,.08)',
                                      border: dark ? '1px solid rgba(139,92,246,.25)' : '1.5px solid rgba(91,33,182,.2)',
                                      color: 'var(--acc)',
                                    }}>p.{i + 1}</span>
                                  ));
                                } catch { return null; }
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {splitFile && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {processing && (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--tx2)' }}>{progMsg}</span>
                              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--acc)' }}>{progress}%</span>
                            </div>
                            <div className="prog-wrap"><div className="prog-bar" style={{ width: `${progress}%` }} /></div>
                          </div>
                        )}
                        <button className="btn" onClick={() => process('split')} disabled={processing}
                          style={{ alignSelf: 'flex-start', padding: '10px 26px' }}>
                          {processing
                            ? <><span style={{ display: 'inline-block', animation: 'spin .8s linear infinite' }}>⟳</span>&nbsp;Processing…</>
                            : splitMode === 'extract' ? '⊙ Extract pages' : '⊗ Remove pages'}
                        </button>
                      </div>
                    )}
                  </>) : (
                    <SuccessCard result={result} dark={dark} onReset={() => { setSplitFile(null); setResult(null); }} />
                  )}

                  
                </motion.div>
              )}

              {/* ══ REORDER ══ */}
              {tab === 'reorder' && (
                <motion.div key="reorder" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  {!result ? (<>
                    <div className="drop-zone"
                      style={{ minHeight: roFile ? 80 : 160 }}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => { e.preventDefault(); loadRoFile(e.dataTransfer.files[0]); }}
                      onClick={() => roRef.current?.click()}>
                      <input ref={roRef} type="file" accept=".pdf"
                        onChange={e => { loadRoFile(e.target.files[0]); e.target.value = ''; }}
                        style={{ display: 'none' }} />
                      <div style={{ fontSize: roFile ? 26 : 36 }}>⇅</div>
                      <div>
                        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: roFile ? 14 : 18, color: 'var(--tx)', marginBottom: 3 }}>
                          {roFile ? roFile.name : 'Drop a PDF to reorder, rotate, or delete pages'}
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--tx3)' }}>
                          {roFile ? `${roOrder.length} pages · ${fmtSize(roFile.size)}` : 'Single PDF file · no uploads'}
                        </div>
                      </div>
                    </div>

                    {roFile && roOrder.length > 0 && (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--tx2)' }}>
                            Click a page to select · drag to reorder · use controls below
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {roSel !== null && (<>
                              <button className="btn-sm" onClick={() => roRotate(roSel)}>
                                ↻ Rotate
                              </button>
                              <button className="btn-sm" onClick={() => roMoveUp(roSel)} disabled={roSel === 0}>↑</button>
                              <button className="btn-sm" onClick={() => roMoveDown(roSel)} disabled={roSel === roOrder.length - 1}>↓</button>
                              <button className={`btn-sm ${roOrder[roSel]?.deleted ? 'on' : ''}`}
                                style={{ borderColor: roOrder[roSel]?.deleted ? 'var(--acc3)' : 'var(--err)', color: roOrder[roSel]?.deleted ? 'var(--acc3)' : 'var(--err)' }}
                                onClick={() => roToggleDelete(roSel)}>
                                {roOrder[roSel]?.deleted ? '↩ Restore' : '× Delete'}
                              </button>
                            </>)}
                            {roSel === null && (
                              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: 'var(--txm)' }}>
                                Select a page to edit it
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="page-grid">
                          {roOrder.map((ro, i) => (
                            <motion.div key={`${ro.origIdx}-${i}`}
                              initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * .02 }}
                              className={`page-tile ${roSel === i ? 'sel' : ''} ${ro.deleted ? 'deleted' : ''}`}
                              draggable
                              onDragStart={() => onRoDragStart(i)}
                              onDragEnter={() => onRoDragEnter(i)}
                              onDragEnd={() => setRDI(null)}
                              onClick={() => setRoSel(roSel === i ? null : i)}>
                              <div className="page-tile-icon" style={{ transform: `rotate(${ro.rotation}deg)`, transition: 'transform .2s' }}>📄</div>
                              <div className="page-tile-num">p.{ro.origIdx + 1}</div>
                              {i !== ro.origIdx && (
                                <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, textAlign: 'center',
                                  fontSize: 7.5, fontFamily: "'JetBrains Mono',monospace", color: 'var(--acc2)' }}>
                                  →pos {i + 1}
                                </div>
                              )}
                              {ro.rotation > 0 && <div className="page-tile-rot">{ro.rotation}°</div>}
                              {ro.deleted && (
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  background: dark ? 'rgba(7,6,15,.5)' : 'rgba(248,247,255,.5)', fontSize: 20 }}>✗</div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </>
                    )}

                    {roFile && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {processing && (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--tx2)' }}>{progMsg}</span>
                              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--acc)' }}>{progress}%</span>
                            </div>
                            <div className="prog-wrap"><div className="prog-bar" style={{ width: `${progress}%` }} /></div>
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <button className="btn" onClick={() => process('reorder')} disabled={processing || activeRoPages === 0}
                            style={{ padding: '10px 26px' }}>
                            {processing
                              ? <><span style={{ display: 'inline-block', animation: 'spin .8s linear infinite' }}>⟳</span>&nbsp;Building…</>
                              : `⇅ Build PDF (${activeRoPages} pages)`}
                          </button>
                          {deletedRoPages > 0 && (
                            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: 'var(--err)' }}>
                              {deletedRoPages} page{deletedRoPages > 1 ? 's' : ''} will be removed
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </>) : (
                    <SuccessCard result={result} dark={dark} onReset={() => { setRoFile(null); setRoOrder([]); setResult(null); }} />
                  )}

                  
                </motion.div>
              )}

              {/* ══ HISTORY ══ */}
              {tab === 'history' && (
                <motion.div key="history" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: 'var(--tx3)' }}>
                      No PDFs generated yet.
                    </div>
                  ) : (
                    <div className="panel" style={{ overflow: 'hidden' }}>
                      {history.map((entry, i) => (
                        <motion.div key={entry.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .04 }}
                          className="hist-row">
                          <div style={{ fontSize: 20, flexShrink: 0 }}>📑</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--tx)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {entry.name}
                            </div>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--tx3)' }}>
                              {fmtSize(entry.size)} · {entry.mode} · {fmtDate(entry.date)}
                            </div>
                          </div>
                          <a href={URL.createObjectURL(entry.blob)} download={entry.name}
                            className="btn-sm" style={{ textDecoration: 'none', flexShrink: 0, padding: '5px 10px' }}>
                            ↓ Re-download
                          </a>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                </motion.div>
              )}

              {/* ══ GUIDE ══ */}
              {tab === 'guide' && (
                <motion.div key="guide" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { n: 1, t: 'Merge PDFs',         d: 'Go to ⊕ Merge. Drag or click to add two or more PDF files. Drag rows or use ↑↓ to set the order. Click "Merge N PDFs" to download a single combined document.' },
                    { n: 2, t: 'Split / Extract',     d: 'Go to ✂ Split. Drop one PDF. Choose "Extract pages" to keep specific pages, or "Remove pages" to delete them and keep the rest. Enter page numbers like 1, 3-5, 8 in the range field. The resolved pages are shown as badges before you proceed.' },
                    { n: 3, t: 'Reorder pages',       d: 'Go to ⇅ Reorder. Drop one PDF. A grid of all pages appears. Click a page to select it, then use the toolbar to move it up/down, rotate 90° per click, or mark it for deletion. Drag tiles to reorder directly.' },
                    { n: 4, t: 'Rotate pages',        d: 'In the ⇅ Reorder tab, select a page and click ↻ Rotate to cycle through 0°, 90°, 180°, 270°. The rotation badge and icon preview update live. Only the output PDF is rotated — your original file is unchanged.' },
                    { n: 5, t: 'Delete pages',        d: 'In the ⇅ Reorder tab, select a page and click × Delete. The tile greys out with an ✗ overlay. Use ↩ Restore to undelete. The sidebar shows how many pages will be removed before you build.' },
                    { n: 6, t: 'Re-download',         d: 'Every PDF you generate is stored in the ⌛ History tab (up to 10). Click Re-download on any entry to get it again without reprocessing.' },
                  ].map(({ n, t, d }) => (
                    <div key={n} style={{ display: 'flex', gap: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div className="step-n">{n}</div>
                        {n < 6 && <div style={{ width: 1.5, flex: 1, marginTop: 5, background: dark ? 'rgba(139,92,246,.1)' : 'rgba(91,33,182,.12)' }} />}
                      </div>
                      <div style={{ flex: 1, paddingBottom: 10 }}>
                        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--tx)', marginBottom: 3 }}>{t}</div>
                        <div style={{ fontFamily: "'Newsreader',serif", fontSize: 15, color: 'var(--tx2)', lineHeight: 1.74 }}>{d}</div>
                      </div>
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {/* ══ LEARN ══ */}
              {tab === 'learn' && (
                <motion.div key="learn" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="panel" style={{ padding: '22px 26px', marginBottom: 12 }}>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 22, color: 'var(--tx)', marginBottom: 4 }}>
                      Managing Large PDF Assignments: Merge, Split & Reorganise
                    </div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--tx3)', marginBottom: 22, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                      pdf structure · cross-reference tables · page trees · privacy
                    </div>
                    <div className="prose">
                      <p>Whether you need to combine your essay with its appendices, extract the Results section from a 50-page paper, or rotate a scan that came out sideways, managing PDF structure is a daily task for students and professionals. Most tools charge for subscriptions or upload your documents to remote servers. This utility runs entirely in your browser — your files are never transmitted anywhere.</p>

                      <h3>How pdf-lib works internally</h3>
                      <p>PDF files consist of a series of <strong>indirect objects</strong> — dictionaries, streams, and arrays — indexed by a cross-reference table at the end of the file. When merging two PDFs, the library re-numbers all indirect objects from the second document to avoid collisions with the first, then appends the new page objects to the existing page tree and writes a new cross-reference table. The resulting file is a fully valid PDF that any viewer can open.</p>
                      <p>Rotation is stored as a simple integer value in each page dictionary's <strong>/Rotate</strong> key. Setting it to 90, 180, or 270 tells the viewer to rotate the page on display. The actual pixel data is unchanged — only the display transform is modified. This is why PDF rotation is lossless regardless of how many times you apply it.</p>

                      <h3>When to merge</h3>
                      <ul>
                        <li><strong>Assignment portfolios:</strong> Combine a cover sheet, main text, and appendices into one professional submission.</li>
                        <li><strong>Study guides:</strong> Merge lecture notes from different weeks into a single searchable semester review.</li>
                        <li><strong>Group projects:</strong> Concatenate sections written by different team members into a final document.</li>
                      </ul>

                      <h3>When to split</h3>
                      <ul>
                        <li><strong>File size limits:</strong> Many university portals cap uploads at 10MB. Split a large PDF into parts.</li>
                        <li><strong>Sharing specific sections:</strong> Extract only the data tables or figures to share with your study group.</li>
                        <li><strong>Removing blank/instruction pages:</strong> Strip submission cover sheets before archiving your work.</li>
                      </ul>

                      <h3>Privacy for student documents</h3>
                      <p>Assignments and research papers frequently contain personal information, institutional data, and unpublished intellectual property. Uploading these to unknown cloud services — even "free" ones — may violate your institution's data policies and GDPR/FERPA regulations. Because this tool processes everything locally using the Web File API and WebAssembly, your documents exist only in your browser's memory tab and are freed when you close it.</p>

                      {[
                        { q: 'Can I merge PDFs with different page sizes?', a: 'Yes. pdf-lib preserves the original page dimensions of every page. The output document can contain a mix of A4, Letter, and custom-sized pages in a single file. Each page retains its own MediaBox dimensions.' },
                        { q: 'Does rotating pages affect image quality?', a: 'No. PDF rotation is stored as a metadata value (/Rotate key) in the page dictionary. It tells the viewer to rotate the rendered output, but the underlying content stream (whether text, vector, or raster) is never re-encoded or resampled. Rotation is fully lossless.' },
                        { q: 'What does "remove pages" do differently from "extract pages"?', a: 'They are inverse operations. Extract keeps only the specified pages and discards the rest. Remove deletes the specified pages and keeps everything else. The result is the complement of the input range. Both produce a new PDF without modifying the original file.' },
                        { q: 'Is there a page limit for merging?', a: 'There is no hard limit imposed by this tool. The practical limit is your browser\'s available RAM. Merging 10 PDFs of 20 pages each is trivial. Very large files (100MB+ total) may slow down or exhaust memory on low-spec devices — process in smaller batches if needed.' },
                        { q: 'Can I merge password-protected PDFs?', a: 'No — pdf-lib cannot decrypt or open encrypted/password-protected PDFs. The tool will throw a parsing error if you attempt to load one. You will need to remove the password protection using another tool (such as your PDF viewer\'s print-to-PDF function) before processing.' },
                      ].map(({ q, a }, i) => (
                        <div key={i} className="faq">
                          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--tx)', marginBottom: 5 }}>{q}</div>
                          <div style={{ fontFamily: "'Newsreader',serif", fontSize: 15, color: 'var(--tx2)', lineHeight: 1.74 }}>{a}</div>
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
    </div>
  </>
);
}

/* ═══ SUCCESS CARD (shared) ═══ */
function SuccessCard({ result, dark, onReset }) {
  return (
    <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }}
      style={{
        padding: '36px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, textAlign: 'center',
        borderRadius: dark ? 3 : 10,
        border: dark ? '1px solid rgba(52,211,153,.2)' : '1.5px solid rgba(6,95,70,.2)',
        background: dark ? 'rgba(52,211,153,.04)' : 'rgba(6,95,70,.03)',
      }}>
      <div style={{ width: 68, height: 68, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: dark ? 'rgba(52,211,153,.1)' : 'rgba(6,95,70,.08)',
        border: dark ? '1px solid rgba(52,211,153,.3)' : '1.5px solid rgba(6,95,70,.25)' }}>
        <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="16" stroke="var(--acc3)" strokeWidth="1.5" />
          <path d="M10 18l6 6 10-12" stroke="var(--acc3)" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="40" style={{ animation: 'check-draw .4s ease .1s both' }} />
        </svg>
      </div>
      <div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 24, color: 'var(--tx)', marginBottom: 6 }}>
          PDF Ready!
        </div>
        <div style={{ fontFamily: "'Newsreader',serif", fontSize: 15, color: 'var(--tx2)', lineHeight: 1.8 }}>
          <strong>{result.name}</strong> · {fmtSize(result.size)}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <a href={URL.createObjectURL(result.blob)} download={result.name}
          className="btn" style={{ padding: '10px 24px', textDecoration: 'none', fontSize: 11 }}>
          ↓ Download PDF
        </a>
        <button className="btn-sm" onClick={onReset} style={{ padding: '10px 18px', fontSize: 10 }}>
          ↺ Start Over
        </button>
      </div>
    </motion.div>
  );
}