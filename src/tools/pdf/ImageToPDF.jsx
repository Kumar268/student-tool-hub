import { useState, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

/* ═══════════════════════════════════════════════════════════════
   IMAGE → PDF  v2  —  Enhanced Edition
   Theme: Dark Midnight/Rose Gold · Light Linen/Burgundy
   Fonts: Bebas Neue · DM Mono · Lora
   New: image crop/rotate/brightness per-page, PDF cover page,
        page numbering, watermark, thumbnail strip, batch history,
        live page preview canvas, compression stats
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Lora',serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes check-draw{from{stroke-dashoffset:40}to{stroke-dashoffset:0}}
@keyframes fadeup{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@keyframes pulse-ring{0%,100%{box-shadow:0 0 0 0 rgba(251,113,133,.3)}50%{box-shadow:0 0 0 8px rgba(251,113,133,0)}}
@keyframes slide-r{from{opacity:0;transform:translateX(6px)}to{opacity:1;transform:none}}

.dk{
  --bg:#080610;--s1:#0d0b18;--s2:#110f1e;--s3:#16132a;
  --bdr:#1e1a30;--bdr-hi:rgba(251,113,133,.25);
  --acc:#fb7185;--acc2:#c084fc;--acc3:#34d399;
  --err:#f87171;--warn:#fbbf24;
  --tx:#fff1f2;--tx2:#fda4af;--tx3:#4c1d3a;--txm:#9f7a8a;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(251,113,133,.07),transparent),
    radial-gradient(ellipse 40% 60% at 90% 100%,rgba(192,132,252,.04),transparent);
}
.lt{
  --bg:#fdf6f0;--s1:#ffffff;--s2:#fff5f5;--s3:#fef2f2;
  --bdr:#fecdd3;--bdr-hi:#9f1239;
  --acc:#9f1239;--acc2:#7e22ce;--acc3:#065f46;
  --err:#991b1b;--warn:#92400e;
  --tx:#1a0810;--tx2:#9f1239;--tx3:#fda4af;--txm:#b45472;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 40% at 50% -10%,rgba(159,18,57,.05),transparent);
}

/* ── TOPBAR ── */
.topbar{height:44px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 14px;gap:8px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(8,6,16,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(253,246,240,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 10px rgba(159,18,57,.06);}

/* ── TABS ── */
.tabbar{display:flex;overflow-x:auto}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:38px;padding:0 13px;border:none;cursor:pointer;background:transparent;border-bottom:2px solid transparent;
  font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.09em;text-transform:uppercase;
  display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .14s;}
.dk .tab{color:var(--tx3);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(251,113,133,.05);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#9ca3af;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(159,18,57,.04);font-weight:600;}
.lt .tab:hover:not(.on){color:var(--tx2);}

/* ── LAYOUT ── */
.body{display:grid;grid-template-columns:218px 1fr;min-height:calc(100vh - 82px);}
.sidebar{padding:12px 10px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:13px 15px;display:flex;flex-direction:column;gap:13px;}

/* ── PANELS ── */
.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:3px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:10px;box-shadow:0 2px 14px rgba(159,18,57,.05);}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 18px;cursor:pointer;
  font-family:'DM Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;
  transition:all .15s;border:none;}
.dk .btn{background:var(--acc);color:#080610;border-radius:2px;box-shadow:0 0 18px rgba(251,113,133,.28);animation:pulse-ring 2.5s infinite;}
.dk .btn:hover{background:#fda4af;box-shadow:0 0 30px rgba(251,113,133,.5);transform:translateY(-1px);animation:none;}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;box-shadow:none;animation:none;transform:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:7px;box-shadow:0 4px 14px rgba(159,18,57,.35);}
.lt .btn:hover{background:#881337;box-shadow:0 8px 24px rgba(159,18,57,.45);transform:translateY(-1px);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}
.btn-sm{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:4px 9px;cursor:pointer;
  font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.07em;text-transform:uppercase;background:transparent;transition:all .12s;border:none;}
.dk .btn-sm{border:1px solid var(--bdr);border-radius:2px;color:var(--txm);}
.dk .btn-sm:hover,.dk .btn-sm.on{border-color:var(--acc);color:var(--acc);background:rgba(251,113,133,.06);}
.lt .btn-sm{border:1.5px solid var(--bdr);border-radius:5px;color:#9ca3af;}
.lt .btn-sm:hover,.lt .btn-sm.on{border-color:var(--acc);color:var(--acc);background:rgba(159,18,57,.06);}

/* ── INPUT ── */
.inp{outline:none;font-family:'DM Mono',monospace;font-size:12px;padding:6px 9px;transition:border-color .12s;}
.dk .inp{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:2px;color:var(--tx);}
.dk .inp:focus{border-color:var(--acc);}
.lt .inp{background:#fff8f8;border:1.5px solid var(--bdr);border-radius:6px;color:var(--tx);}
.lt .inp:focus{border-color:var(--acc);}

/* ── DROP ZONE ── */
.drop-zone{border:2px dashed;border-radius:8px;transition:all .2s;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:10px;cursor:pointer;position:relative;padding:30px 20px;text-align:center;}
.dk .drop-zone{border-color:rgba(251,113,133,.2);background:rgba(251,113,133,.03);}
.dk .drop-zone.over{border-color:var(--acc);background:rgba(251,113,133,.08);box-shadow:0 0 32px rgba(251,113,133,.12);}
.dk .drop-zone:hover{border-color:rgba(251,113,133,.4);}
.lt .drop-zone{border-color:rgba(159,18,57,.2);background:rgba(159,18,57,.02);}
.lt .drop-zone.over{border-color:var(--acc);background:rgba(159,18,57,.06);}
.lt .drop-zone:hover{border-color:rgba(159,18,57,.4);}

/* ── IMAGE CARD ── */
.img-card{position:relative;border-radius:6px;overflow:hidden;cursor:grab;aspect-ratio:3/4;transition:transform .15s,box-shadow .15s;}
.img-card.dragging{opacity:.45;transform:scale(.97);}
.dk .img-card{border:1px solid var(--bdr);}
.lt .img-card{border:1.5px solid var(--bdr);}
.img-card:hover{z-index:10;}
.dk .img-card:hover{box-shadow:0 0 20px rgba(251,113,133,.2);}
.lt .img-card:hover{box-shadow:0 4px 20px rgba(159,18,57,.15);}
.img-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.4) 50%,transparent 100%);
  opacity:0;transition:opacity .18s;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding:8px;gap:5px;}
.img-card:hover .img-overlay{opacity:1;}
.page-badge{position:absolute;top:6px;left:6px;padding:2px 7px;border-radius:999px;
  font-family:'DM Mono',monospace;font-size:9px;font-weight:500;
  background:rgba(0,0,0,.7);color:#fff;backdrop-filter:blur(4px);}
.edit-badge{position:absolute;top:6px;right:6px;padding:2px 5px;border-radius:3px;
  font-family:'DM Mono',monospace;font-size:8px;
  background:rgba(251,113,133,.8);color:#fff;}
.drag-grip{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:28px;height:28px;display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,.5);border-radius:4px;color:rgba(255,255,255,.7);
  font-size:14px;opacity:0;transition:opacity .18s;}
.img-card:hover .drag-grip{opacity:1;}

/* ── THUMBNAIL STRIP ── */
.thumb-strip{display:flex;gap:5px;overflow-x:auto;padding:5px 0;scroll-behavior:smooth;}
.thumb-strip::-webkit-scrollbar{height:3px;}
.dk .thumb-strip::-webkit-scrollbar-track{background:var(--bdr);}
.dk .thumb-strip::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px;}
.lt .thumb-strip::-webkit-scrollbar-track{background:var(--bdr);}
.lt .thumb-strip::-webkit-scrollbar-thumb{background:var(--acc);border-radius:2px;}
.thumb{width:44px;height:58px;border-radius:3px;overflow:hidden;cursor:pointer;flex-shrink:0;transition:all .13s;}
.thumb img{width:100%;height:100%;object-fit:cover;}
.dk .thumb{border:1px solid var(--bdr);}
.lt .thumb{border:1.5px solid var(--bdr);}
.dk .thumb.sel{border-color:var(--acc);box-shadow:0 0 8px rgba(251,113,133,.4);}
.lt .thumb.sel{border-color:var(--acc);box-shadow:0 3px 10px rgba(159,18,57,.3);}

/* ── EDIT MODAL ── */
.modal-bg{position:fixed;inset:0;z-index:500;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);}
.dk .modal-bg{background:rgba(8,6,16,.75);}
.lt .modal-bg{background:rgba(253,246,240,.75);}
.modal{width:min(680px,96vw);max-height:90vh;overflow-y:auto;border-radius:8px;}
.dk .modal{background:var(--s2);border:1px solid var(--bdr-hi);}
.lt .modal{background:var(--s1);border:1.5px solid var(--bdr-hi);box-shadow:0 20px 60px rgba(159,18,57,.15);}

/* ── PROGRESS ── */
.prog-wrap{height:5px;border-radius:3px;overflow:hidden;}
.dk .prog-wrap{background:rgba(251,113,133,.12);}
.lt .prog-wrap{background:rgba(159,18,57,.1);}
.prog-bar{height:100%;border-radius:3px;transition:width .25s ease;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc2));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc2));}

/* ── SUCCESS ── */
.success-ring{width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
.dk .success-ring{background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.3);}
.lt .success-ring{background:rgba(6,95,70,.08);border:1.5px solid rgba(6,95,70,.25);}

/* ── HISTORY CARD ── */
.hist-card{display:flex;align-items:center;gap:10px;padding:9px 11px;transition:background .12s;}
.dk .hist-card{border-bottom:1px solid var(--bdr);}
.lt .hist-card{border-bottom:1.5px solid var(--bdr);}
.dk .hist-card:hover{background:rgba(251,113,133,.04);}
.lt .hist-card:hover{background:rgba(159,18,57,.04);}

/* ── LABELS / MISC ── */
.lbl{font-family:'DM Mono',monospace;font-size:8.5px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(251,113,133,.45);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.22em;text-transform:uppercase;margin-bottom:7px;}
.dk .slbl{color:rgba(251,113,133,.35);}
.lt .slbl{color:var(--acc);}
.metab{padding:8px 10px;}
.dk .metab{border:1px solid rgba(251,113,133,.1);border-radius:2px;background:rgba(251,113,133,.03);}
.lt .metab{border:1.5px solid rgba(159,18,57,.12);border-radius:7px;background:rgba(159,18,57,.04);}
.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(251,113,133,.012);border:1px dashed rgba(251,113,133,.1);border-radius:2px;}
.lt .ad{background:rgba(159,18,57,.025);border:1.5px dashed rgba(159,18,57,.15);border-radius:8px;}
.ad span{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--tx3);}
.step-n{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'DM Mono',monospace;font-size:10px;font-weight:500;flex-shrink:0;}
.dk .step-n{border:1px solid rgba(251,113,133,.3);background:rgba(251,113,133,.07);color:var(--acc);}
.lt .step-n{border:1.5px solid rgba(159,18,57,.3);background:rgba(159,18,57,.07);color:var(--acc);}
.prose{font-family:'Lora',serif;}
.prose p{font-size:16px;line-height:1.82;margin-bottom:14px;color:var(--tx2);}
.prose h3{font-family:'Bebas Neue',sans-serif;font-size:18px;margin:22px 0 8px;color:var(--tx);letter-spacing:.05em;}
.prose ul,.prose ol{padding-left:22px;margin-bottom:14px;}
.prose li{font-size:16px;line-height:1.75;margin-bottom:6px;color:var(--tx2);}
.prose strong{font-weight:600;color:var(--tx);}
.faq{padding:12px 14px;margin-bottom:8px;}
.dk .faq{border:1px solid var(--bdr);border-radius:3px;background:rgba(0,0,0,.4);}
.lt .faq{border:1.5px solid var(--bdr);border-radius:9px;background:rgba(159,18,57,.03);}
/* range */
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;}
.dk input[type=range]{background:var(--bdr);}
.lt input[type=range]{background:var(--bdr);}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:var(--acc);cursor:pointer;}
`;

/* ═══ HELPERS ═══ */
const uid = () => Math.random().toString(36).slice(2, 10);
const fmtSize = b => b < 1024 ? `${b}B` : b < 1048576 ? `${(b/1024).toFixed(1)}KB` : `${(b/1048576).toFixed(1)}MB`;
const fmtDate = d => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const PAGE_SIZES = {
  A4:     { w: 210, h: 297 },
  Letter: { w: 215.9, h: 279.4 },
  A3:     { w: 297, h: 420 },
  A5:     { w: 148, h: 210 },
  Square: { w: 210, h: 210 },
};

const PAGE_TABS = [
  { id: 'convert',  label: '⊞ Convert' },
  { id: 'edit',     label: '✎ Edit Pages' },
  { id: 'settings', label: '◈ Settings' },
  { id: 'history',  label: '⌛ History' },
  { id: 'guide',    label: '? Guide' },
  { id: 'learn',    label: '∑ Learn' },
];

/* ── Apply per-image adjustments on a canvas and return data URL ── */
async function applyAdjustments(dataUrl, adjustments) {
  const { rotation, brightness, contrast, grayscale, flipH, flipV } = adjustments;
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const sw = img.naturalWidth, sh = img.naturalHeight;
      const rotRad = (rotation * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rotRad)), cos = Math.abs(Math.cos(rotRad));
      const cw = Math.round(sw * cos + sh * sin);
      const ch = Math.round(sw * sin + sh * cos);
      const canvas = document.createElement('canvas');
      canvas.width = cw; canvas.height = ch;
      const ctx = canvas.getContext('2d');
      ctx.translate(cw / 2, ch / 2);
      ctx.rotate(rotRad);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.filter = [
        `brightness(${brightness}%)`,
        `contrast(${contrast}%)`,
        grayscale ? 'grayscale(100%)' : '',
      ].filter(Boolean).join(' ') || 'none';
      ctx.drawImage(img, -sw / 2, -sh / 2, sw, sh);
      res(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.src = dataUrl;
  });
}

const DEFAULT_ADJ = { rotation: 0, brightness: 100, contrast: 100, grayscale: false, flipH: false, flipV: false };

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function ImageToPDF() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';

  const [images, setImages]       = useState([]);
  const [tab, setTab]             = useState('convert');
  const [dragOver, setDragOver]   = useState(false);
  const [dragIdx, setDragIdx]     = useState(null);
  const [processing, setProc]     = useState(false);
  const [progress, setProgress]   = useState(0);
  const [progressMsg, setProgMsg] = useState('');
  const [result, setResult]       = useState(null);
  const [history, setHistory]     = useState([]);
  const [selThumb, setSelThumb]   = useState(null);

  // Edit modal
  // (removed unused editImg state)

  // Settings
  const [pageSize, setPageSize]   = useState('A4');
  const [orient, setOrient]       = useState('portrait');
  const [fitMode, setFitMode]     = useState('fit');
  const [margin, setMargin]       = useState(10);
  const [quality, setQuality]     = useState('high');
  const [filename, setFilename]   = useState('document');
  // Cover page
  const [coverEnabled, setCover]  = useState(false);
  const [coverTitle, setCoverTitle] = useState('');
  const [coverSubtitle, setCoverSub] = useState('');
  // Page numbers
  const [pageNums, setPageNums]   = useState(false);
  const [pageNumPos, setPageNumPos] = useState('bottom-center');
  // Watermark
  const [watermark, setWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(15);

  const fileRef = useRef();

  /* ── Ingest files ─── */
  const addFiles = useCallback((files) => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
    const items = valid.map(file => ({
      file,
      id: uid(),
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      nw: 0, nh: 0,
      adjustments: { ...DEFAULT_ADJ },
    }));
    items.forEach(item => {
      const img = new Image();
      img.onload = () => { item.nw = img.naturalWidth; item.nh = img.naturalHeight; setImages(p => [...p]); };
      img.src = item.preview;
    });
    setImages(p => [...p, ...items]);
    setResult(null);
  }, []);

  const onDrop = e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); };
  const removeImg = id => setImages(p => p.filter(i => i.id !== id));
  const moveImg = (idx, dir) => setImages(p => {
    const a = [...p]; const ni = idx + dir;
    if (ni < 0 || ni >= a.length) return a;
    [a[idx], a[ni]] = [a[ni], a[idx]]; return a;
  });
  const updateAdj = (id, patch) => setImages(p => p.map(i => i.id === id ? { ...i, adjustments: { ...i.adjustments, ...patch } } : i));

  /* ── Drag-reorder ─── */
  const onDragStart = idx => setDragIdx(idx);
  const onDragEnter = idx => {
    if (dragIdx === null || dragIdx === idx) return;
    setImages(p => {
      const a = [...p]; const item = a.splice(dragIdx, 1)[0];
      a.splice(idx, 0, item); setDragIdx(idx); return a;
    });
  };
  const onDragEnd = () => setDragIdx(null);

  /* ── Convert ─── */
  const convert = async () => {
    if (!images.length) return;
    setProc(true); setProgress(0); setResult(null);

    const ps = PAGE_SIZES[pageSize];
    const isLand = orient === 'landscape';
    const pw = isLand ? ps.h : ps.w;
    const ph = isLand ? ps.w : ps.h;

    try {
      const doc = new jsPDF({ unit: 'mm', format: [pw, ph], orientation: orient });
      let pageCount = 0;

      // ── Cover page ──
      if (coverEnabled && coverTitle) {
        setProgMsg('Adding cover page…');
        doc.setFillColor(dark ? 20 : 253, dark ? 15 : 246, dark ? 30 : 240);
        doc.rect(0, 0, pw, ph, 'F');
        doc.setDrawColor(251, 113, 133);
        doc.setLineWidth(1.5);
        doc.rect(8, 8, pw - 16, ph - 16);
        doc.setFontSize(32);
        doc.setTextColor(251, 113, 133);
        doc.text(coverTitle, pw / 2, ph * 0.42, { align: 'center' });
        if (coverSubtitle) {
          doc.setFontSize(14);
          doc.setTextColor(dark ? 200 : 80, dark ? 150 : 20, dark ? 160 : 40);
          doc.text(coverSubtitle, pw / 2, ph * 0.42 + 12, { align: 'center' });
        }
        doc.setFontSize(10);
        doc.setTextColor(150, 100, 110);
        doc.text(new Date().toLocaleDateString(), pw / 2, ph - 20, { align: 'center' });
        pageCount++;
      }

      // ── Image pages ──
      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        setProgMsg(`Processing image ${i + 1} of ${images.length}…`);
        setProgress(Math.round(((i + 0.5) / images.length) * 82) + (coverEnabled ? 8 : 0));

        const rawUrl = await new Promise(res => {
          const reader = new FileReader();
          reader.onload = e => res(e.target.result);
          reader.readAsDataURL(item.file);
        });

        const hasAdj = Object.keys(item.adjustments).some(k => {
          const v = item.adjustments[k];
          const def = DEFAULT_ADJ[k];
          return v !== def;
        });
        const dataUrl = hasAdj ? await applyAdjustments(rawUrl, item.adjustments) : rawUrl;

        const { nw, nh } = await new Promise(res => {
          const img = new Image();
          img.onload = () => res({ nw: img.naturalWidth, nh: img.naturalHeight });
          img.src = dataUrl;
        });

        if (pageCount > 0) doc.addPage([pw, ph], orient);
        pageCount++;

        const usableW = pw - margin * 2;
        const usableH = ph - margin * 2 - (pageNums ? 8 : 0);
        let dw, dh, dx, dy;

        if (fitMode === 'stretch') {
          dw = usableW; dh = usableH; dx = margin; dy = margin;
        } else {
          const imgRatio = nw / nh;
          const pageRatio = usableW / usableH;
          if (fitMode === 'fit') {
            if (imgRatio > pageRatio) { dw = usableW; dh = dw / imgRatio; }
            else { dh = usableH; dw = dh * imgRatio; }
          } else {
            if (imgRatio > pageRatio) { dh = usableH; dw = dh * imgRatio; }
            else { dw = usableW; dh = dw / imgRatio; }
          }
          dx = margin + (usableW - dw) / 2;
          dy = margin + (usableH - dh) / 2;
        }

        const fmt = item.file.type === 'image/png' ? 'PNG' : 'JPEG';
        doc.addImage(dataUrl, fmt, dx, dy, dw, dh, undefined, 'FAST');

        // Watermark
        if (watermark && watermarkText) {
          doc.saveGraphicsState();
          doc.setGState(doc.GState({ opacity: watermarkOpacity / 100 }));
          doc.setFontSize(36);
          doc.setTextColor(159, 18, 57);
          doc.text(watermarkText, pw / 2, ph / 2, { align: 'center', angle: 45 });
          doc.restoreGraphicsState();
        }

        // Page numbers
        if (pageNums) {
          const num = coverEnabled ? `${i + 1}` : `${i + 1}`;
          doc.setFontSize(9);
          doc.setTextColor(120, 80, 90);
          const positions = {
            'bottom-center': [pw / 2, ph - 6, 'center'],
            'bottom-right':  [pw - margin, ph - 6, 'right'],
            'bottom-left':   [margin, ph - 6, 'left'],
          };
          const [x, y, align] = positions[pageNumPos] || positions['bottom-center'];
          doc.text(num, x, y, { align });
        }
      }

      setProgMsg('Finalising…');
      setProgress(96);
      const blob = doc.output('blob');
      const entry = {
        id: uid(),
        name: `${filename || 'document'}.pdf`,
        count: images.length,
        size: blob.size,
        blob,
        date: new Date(),
        pages: pageCount,
      };
      setResult(entry);
      setHistory(p => [entry, ...p.slice(0, 9)]);
      setProgress(100);
    } catch (e) {
      console.error(e);
    } finally {
      setProc(false);
      setProgMsg('');
    }
  };

  const reset = () => { setImages([]); setResult(null); setProgress(0); };

  const totalSize = images.reduce((a, b) => a + b.size, 0);

  /* ══════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: dark ? 3 : 8, flexShrink: 0,
              border: dark ? '1px solid rgba(251,113,133,.4)' : 'none',
              background: dark ? 'rgba(251,113,133,.08)' : 'linear-gradient(135deg,#9f1239,#7e22ce)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
              boxShadow: dark ? '0 0 14px rgba(251,113,133,.22)' : '0 3px 10px rgba(159,18,57,.4)',
            }}>📄</div>
            <div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 17, color: 'var(--tx)', letterSpacing: '.06em', lineHeight: 1 }}>
                IMG<span style={{ color: 'var(--acc)' }}>2PDF</span>
                <span style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", letterSpacing: '.06em', marginLeft: 6, color: 'var(--txm)' }}>v2</span>
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8, color: 'var(--tx3)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 1 }}>
                Browser-only · no uploads
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }} />

          {images.length > 0 && !result && (
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9.5, color: 'var(--tx2)', padding: '3px 9px',
              borderRadius: dark ? 2 : 6, border: dark ? '1px solid rgba(251,113,133,.15)' : '1.5px solid rgba(159,18,57,.15)',
              background: dark ? 'rgba(251,113,133,.04)' : 'rgba(159,18,57,.04)' }}>
              {images.length} img{images.length > 1 ? 's' : ''} · {fmtSize(totalSize)}
            </div>
          )}

          <button onClick={() => setDark(d => !d)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
            border: dark ? '1px solid rgba(251,113,133,.18)' : '1.5px solid var(--bdr)',
            borderRadius: dark ? 2 : 6, background: 'transparent', cursor: 'pointer',
          }}>
            <div style={{ width: 28, height: 14, borderRadius: 8, position: 'relative',
              background: dark ? 'var(--acc)' : '#fecdd3', boxShadow: dark ? '0 0 8px rgba(251,113,133,.5)' : 'none' }}>
              <div style={{ position: 'absolute', top: 2.5, left: dark ? 'auto' : 2, right: dark ? 2 : 'auto',
                width: 9, height: 9, borderRadius: '50%', background: dark ? '#080610' : 'white', transition: 'all .2s' }} />
            </div>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 8.5, letterSpacing: '.1em', color: 'var(--tx3)' }}>
              {dark ? 'DARK' : 'LITE'}
            </span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
          {PAGE_TABS.map(t => (
            <button key={t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
              {t.id === 'history' && history.length > 0 && (
                <span style={{ background: 'var(--acc)', color: dark ? '#080610' : '#fff', borderRadius: 99,
                  fontSize: 8, padding: '0 5px', fontFamily: "'DM Mono',monospace" }}>{history.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="body">

          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* Page list */}
            {images.length > 0 && (
              <div>
                <div className="slbl">Pages ({images.length})</div>
                {images.map((img, i) => (
                  <div key={img.id} style={{
                    display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, padding: '5px 6px',
                    borderRadius: dark ? 2 : 6, cursor: 'pointer',
                    border: selThumb === img.id ? `1px solid var(--acc)` : dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)',
                    background: selThumb === img.id ? (dark ? 'rgba(251,113,133,.06)' : 'rgba(159,18,57,.04)') : (dark ? 'rgba(0,0,0,.3)' : 'rgba(255,255,255,.7)'),
                  }} onClick={() => setSelThumb(img.id)}>
                    <img src={img.preview} style={{
                      width: 26, height: 34, objectFit: 'cover', borderRadius: 2, flexShrink: 0,
                      filter: [
                        img.adjustments.grayscale ? 'grayscale(1)' : '',
                        `brightness(${img.adjustments.brightness}%)`,
                        `contrast(${img.adjustments.contrast}%)`,
                      ].filter(Boolean).join(' ') || 'none',
                      transform: [
                        img.adjustments.rotation ? `rotate(${img.adjustments.rotation}deg)` : '',
                        img.adjustments.flipH ? 'scaleX(-1)' : '',
                        img.adjustments.flipV ? 'scaleY(-1)' : '',
                      ].filter(Boolean).join(' ') || 'none',
                    }} alt="" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 9.5, fontFamily: "'DM Mono',monospace", color: 'var(--tx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 1 }}>
                        {i + 1}. {img.name.slice(0, 12)}{img.name.length > 12 ? '…' : ''}
                      </div>
                      <div style={{ fontSize: 8, fontFamily: "'DM Mono',monospace", color: 'var(--tx3)' }}>
                        {fmtSize(img.size)}{img.nw ? ` · ${img.nw}×${img.nh}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                      <button onClick={e => { e.stopPropagation(); moveImg(i, -1); }} disabled={i === 0}
                        style={{ background: 'none', border: 'none', cursor: i===0?'not-allowed':'pointer', color: 'var(--txm)', opacity: i===0?.3:1, fontSize: 11, lineHeight: 1, padding: '1px 3px' }}>▲</button>
                      <button onClick={e => { e.stopPropagation(); moveImg(i, 1); }} disabled={i === images.length - 1}
                        style={{ background: 'none', border: 'none', cursor: i===images.length-1?'not-allowed':'pointer', color: 'var(--txm)', opacity: i===images.length-1?.3:1, fontSize: 11, lineHeight: 1, padding: '1px 3px' }}>▼</button>
                    </div>
                    <button onClick={e => { e.stopPropagation(); removeImg(img.id); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--err)', fontSize: 15, lineHeight: 1, padding: '0 2px', flexShrink: 0 }}>×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            {images.length > 0 && (
              <div>
                <div className="slbl">Summary</div>
                {[
                  ['Images',   images.length],
                  ['Total',    fmtSize(totalSize)],
                  ['Page',     pageSize],
                  ['Fit',      fitMode],
                  ['Cover',    coverEnabled ? 'Yes' : 'No'],
                  ['Nums',     pageNums ? 'Yes' : 'No'],
                ].map(([l, v]) => (
                  <div key={l} className="metab" style={{ marginBottom: 4 }}>
                    <div style={{ fontSize: 8, fontFamily: "'DM Mono',monospace", letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 1 }}>{l}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono',monospace", color: 'var(--acc)' }}>{v}</div>
                  </div>
                ))}
              </div>
            )}

            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══ CONVERT ══ */}
              {tab === 'convert' && (
                <motion.div key="conv" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  {!result ? (<>
                    {/* Drop zone */}
                    <div className={`drop-zone ${dragOver ? 'over' : ''}`}
                      style={{ minHeight: images.length ? 100 : 190 }}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={onDrop}
                      onClick={() => fileRef.current?.click()}>
                      <input ref={fileRef} type="file" multiple accept="image/*"
                        onChange={e => { addFiles(e.target.files); e.target.value = ''; }}
                        style={{ display: 'none' }} />
                      <div style={{ fontSize: images.length ? 28 : 40 }}>{images.length ? '➕' : '🖼️'}</div>
                      <div>
                        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: images.length ? 15 : 20,
                          color: 'var(--tx)', letterSpacing: '.04em', marginBottom: 3 }}>
                          {images.length ? 'Add more images' : 'Drop images here'}
                        </div>
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'var(--tx3)' }}>
                          JPG · PNG · WebP · GIF — click or drag
                        </div>
                      </div>
                    </div>

                    {/* Thumbnail strip */}
                    {images.length > 0 && (
                      <div>
                        <div className="slbl" style={{ marginBottom: 5 }}>Page order — drag to reorder</div>
                        <div className="thumb-strip">
                          {images.map((img, i) => (
                            <motion.div key={img.id} initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                              <div className={`thumb ${selThumb === img.id ? 'sel' : ''}`}
                                onClick={() => setSelThumb(selThumb === img.id ? null : img.id)}
                                style={{ position: 'relative' }}>
                                <img src={img.preview} alt="" style={{
                                  filter: [
                                    img.adjustments.grayscale ? 'grayscale(1)' : '',
                                    `brightness(${img.adjustments.brightness}%)`,
                                  ].filter(Boolean).join(' ') || 'none',
                                }} />
                                <div style={{ position: 'absolute', bottom: 1, left: 0, right: 0, textAlign: 'center',
                                  fontSize: 8, fontFamily: "'DM Mono',monospace", color: '#fff',
                                  background: 'rgba(0,0,0,.5)', padding: '1px 0' }}>
                                  {i + 1}
                                </div>
                                {Object.values(img.adjustments).some((v, idx) => v !== Object.values(DEFAULT_ADJ)[idx]) && (
                                  <div style={{ position: 'absolute', top: 1, right: 1, width: 6, height: 6, borderRadius: '50%',
                                    background: 'var(--acc)' }} />
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Image grid */}
                    {images.length > 0 && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <div className="lbl" style={{ margin: 0 }}>
                            {images.length} image{images.length > 1 ? 's' : ''} queued
                          </div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn-sm" onClick={() => setTab('edit')}>✎ Edit pages</button>
                            <button className="btn-sm" onClick={reset}
                              style={{ borderColor: 'var(--err)', color: 'var(--err)' }}>× Clear all</button>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 7 }}>
                          <AnimatePresence>
                            {images.map((img, i) => (
                              <motion.div key={img.id}
                                initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: .85 }} transition={{ delay: i * .03 }}
                                className={`img-card ${dragIdx === i ? 'dragging' : ''}`}
                                draggable onDragStart={() => onDragStart(i)}
                                onDragEnter={() => onDragEnter(i)} onDragEnd={onDragEnd}>
                                <img src={img.preview} alt={img.name}
                                  style={{
                                    filter: [
                                      img.adjustments.grayscale ? 'grayscale(1)' : '',
                                      `brightness(${img.adjustments.brightness}%)`,
                                      `contrast(${img.adjustments.contrast}%)`,
                                    ].filter(Boolean).join(' ') || 'none',
                                    transform: [
                                      img.adjustments.rotation ? `rotate(${img.adjustments.rotation}deg)` : '',
                                      img.adjustments.flipH ? 'scaleX(-1)' : '',
                                    ].filter(Boolean).join(' ') || 'none',
                                  }} />
                                <div className="img-overlay">
                                  <div style={{ display: 'flex', gap: 5 }}>
                                    <button onClick={e => { e.stopPropagation(); setTab('edit'); }}
                                      style={{ padding: '5px 9px', background: 'rgba(251,113,133,.8)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontSize: 11, fontFamily: "'DM Mono',monospace" }}>
                                      ✎ Edit
                                    </button>
                                    <button onClick={e => { e.stopPropagation(); removeImg(img.id); }}
                                      style={{ width: 28, height: 28, background: 'rgba(248,113,113,.7)', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                  </div>
                                  <div style={{ display: 'flex', gap: 5 }}>
                                    <button onClick={e => { e.stopPropagation(); moveImg(i, -1); }} disabled={i===0}
                                      style={{ width: 26, height: 26, background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: 4, color: '#fff', cursor: i===0?'not-allowed':'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i===0?.4:1 }}>↑</button>
                                    <button onClick={e => { e.stopPropagation(); moveImg(i, 1); }} disabled={i===images.length-1}
                                      style={{ width: 26, height: 26, background: 'rgba(255,255,255,.2)', border: 'none', borderRadius: 4, color: '#fff', cursor: i===images.length-1?'not-allowed':'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i===images.length-1?.4:1 }}>↓</button>
                                  </div>
                                </div>
                                <div className="page-badge">p.{i + 1}</div>
                                {Object.values(img.adjustments).some((v, idx) => v !== Object.values(DEFAULT_ADJ)[idx]) && (
                                  <div className="edit-badge">edited</div>
                                )}
                                <div className="drag-grip">⠿</div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {/* Progress + convert */}
                    {images.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                        {processing && (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'var(--tx2)' }}>{progressMsg}</span>
                              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'var(--acc)' }}>{progress}%</span>
                            </div>
                            <div className="prog-wrap"><div className="prog-bar" style={{ width: `${progress}%` }} /></div>
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <button className="btn" onClick={convert} disabled={processing || !images.length} style={{ padding: '10px 26px', fontSize: 11 }}>
                            {processing
                              ? <><span style={{ display: 'inline-block', animation: 'spin .8s linear infinite' }}>⟳</span>&nbsp;Processing…</>
                              : `⬇ Build PDF (${images.length + (coverEnabled ? 1 : 0)} page${images.length + (coverEnabled ? 1 : 0) > 1 ? 's' : ''})`}
                          </button>
                          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'var(--tx3)', lineHeight: 1.7 }}>
                            {pageSize} · {orient.slice(0,4)} · {fitMode}
                            {coverEnabled && ' · cover'}
                            {pageNums && ' · nums'}
                            {watermark && ' · wmark'}
                          </div>
                        </div>
                      </div>
                    )}
                  </>) : (
                    /* SUCCESS */
                    <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }}
                      className="panel" style={{ padding: '38px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, textAlign: 'center' }}>
                      <div className="success-ring">
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                          <circle cx="18" cy="18" r="16" stroke="var(--acc3)" strokeWidth="1.5" />
                          <path d="M10 18l6 6 10-12" stroke="var(--acc3)" strokeWidth="2.5"
                            strokeLinecap="round" strokeLinejoin="round"
                            strokeDasharray="40" style={{ animation: 'check-draw .4s ease .1s both' }} />
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: 'var(--tx)', letterSpacing: '.04em', marginBottom: 6 }}>
                          PDF Ready!
                        </div>
                        <div style={{ fontFamily: "'Lora',serif", fontSize: 15, color: 'var(--tx2)', lineHeight: 1.8 }}>
                          <strong>{result.pages}</strong> page{result.pages > 1 ? 's' : ''} · <strong>{result.name}</strong>
                          <br />Output size: <strong>{fmtSize(result.size)}</strong>
                          {totalSize > 0 && <> · <span style={{ color: 'var(--acc3)' }}>
                            {Math.round((1 - result.size / totalSize) * 100)}% smaller than originals
                          </span></>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <a href={URL.createObjectURL(result.blob)} download={result.name}
                          className="btn" style={{ padding: '10px 24px', textDecoration: 'none', fontSize: 11 }}>
                          ↓ Download PDF
                        </a>
                        <button className="btn-sm" onClick={reset} style={{ padding: '10px 18px', fontSize: 10 }}>
                          ↺ Start Over
                        </button>
                      </div>
                      {/* Compression stats */}
                      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                          { label: 'Source images', size: totalSize, color: dark ? '#60a5fa' : '#1d4ed8' },
                          { label: 'Output PDF',    size: result.size, color: 'var(--acc)' },
                        ].map(({ label, size, color }) => (
                          <div key={label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'var(--tx2)' }}>{label}</span>
                              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color }}>{fmtSize(size)}</span>
                            </div>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (size / totalSize) * 100)}%` }}
                              transition={{ duration: .6, ease: 'easeOut' }}
                              style={{ height: 5, borderRadius: 3, background: color }} />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  
                </motion.div>
              )}

              {/* ══ EDIT PAGES ══ */}
              {tab === 'edit' && (
                <motion.div key="edit" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  {images.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px', fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'var(--tx3)' }}>
                      Add images in the ⊞ Convert tab first.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 13 }}>
                      {images.map((img, i) => {
                        const adj = img.adjustments;
                        return (
                          <motion.div key={img.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .05 }}
                            className="panel" style={{ padding: '13px 14px' }}>
                            <div style={{ display: 'flex', gap: 10, marginBottom: 11, alignItems: 'flex-start' }}>
                              {/* Preview */}
                              <div style={{ width: 60, height: 78, borderRadius: 4, overflow: 'hidden', flexShrink: 0,
                                border: dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)' }}>
                                <img src={img.preview} alt="" style={{
                                  width: '100%', height: '100%', objectFit: 'cover',
                                  filter: [adj.grayscale?'grayscale(1)':'',`brightness(${adj.brightness}%)`,`contrast(${adj.contrast}%)`].filter(Boolean).join(' ')||'none',
                                  transform: [adj.rotation?`rotate(${adj.rotation}deg)`:'',adj.flipH?'scaleX(-1)':'',adj.flipV?'scaleY(-1)':''].filter(Boolean).join(' ')||'none',
                                }} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10.5, color: 'var(--tx)', marginBottom: 2,
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {i + 1}. {img.name}
                                </div>
                                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8.5, color: 'var(--tx3)', marginBottom: 8 }}>
                                  {fmtSize(img.size)}{img.nw ? ` · ${img.nw}×${img.nh}px` : ''}
                                </div>
                                {/* Rotate / flip */}
                                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                  {[0, 90, 180, 270].map(r => (
                                    <button key={r} className={`btn-sm ${adj.rotation === r ? 'on' : ''}`}
                                      onClick={() => updateAdj(img.id, { rotation: r })}
                                      style={{ padding: '3px 7px', background: adj.rotation === r ? (dark?'rgba(251,113,133,.08)':'rgba(159,18,57,.06)') : '' }}>
                                      {r}°
                                    </button>
                                  ))}
                                  <button className={`btn-sm ${adj.flipH ? 'on' : ''}`}
                                    onClick={() => updateAdj(img.id, { flipH: !adj.flipH })}
                                    style={{ padding: '3px 7px' }}>⟷H</button>
                                  <button className={`btn-sm ${adj.flipV ? 'on' : ''}`}
                                    onClick={() => updateAdj(img.id, { flipV: !adj.flipV })}
                                    style={{ padding: '3px 7px' }}>⟨V⟩</button>
                                  <button className={`btn-sm ${adj.grayscale ? 'on' : ''}`}
                                    onClick={() => updateAdj(img.id, { grayscale: !adj.grayscale })}
                                    style={{ padding: '3px 7px' }}>B&W</button>
                                </div>
                              </div>
                            </div>

                            {/* Brightness */}
                            <div style={{ marginBottom: 9 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span className="lbl" style={{ margin: 0 }}>Brightness</span>
                                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'var(--acc)' }}>{adj.brightness}%</span>
                              </div>
                              <input type="range" min="40" max="180" value={adj.brightness}
                                onChange={e => updateAdj(img.id, { brightness: +e.target.value })} />
                            </div>

                            {/* Contrast */}
                            <div style={{ marginBottom: 9 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span className="lbl" style={{ margin: 0 }}>Contrast</span>
                                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'var(--acc)' }}>{adj.contrast}%</span>
                              </div>
                              <input type="range" min="40" max="200" value={adj.contrast}
                                onChange={e => updateAdj(img.id, { contrast: +e.target.value })} />
                            </div>

                            {/* Reset */}
                            <button className="btn-sm" onClick={() => updateAdj(img.id, { ...DEFAULT_ADJ })}
                              style={{ width: '100%', justifyContent: 'center', marginTop: 2 }}>↺ Reset adjustments</button>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ══ SETTINGS ══ */}
              {tab === 'settings' && (
                <motion.div key="set" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

                    {/* Page size */}
                    <div className="panel" style={{ padding: '13px 15px' }}>
                      <div className="lbl" style={{ marginBottom: 9 }}>Page size</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        {Object.entries(PAGE_SIZES).map(([s, d]) => (
                          <button key={s} className={`btn-sm ${pageSize === s ? 'on' : ''}`}
                            onClick={() => setPageSize(s)}
                            style={{ flexDirection: 'column', gap: 2, height: 'auto', padding: '7px 6px',
                              background: pageSize === s ? (dark?'rgba(251,113,133,.08)':'rgba(159,18,57,.06)') : '' }}>
                            <span style={{ fontSize: 11, fontWeight: 600 }}>{s}</span>
                            <span style={{ fontSize: 8, opacity: .6 }}>{d.w}×{d.h}mm</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Orientation + Fit + Quality */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div className="panel" style={{ padding: '13px 15px' }}>
                        <div className="lbl" style={{ marginBottom: 8 }}>Orientation</div>
                        <div style={{ display: 'flex', gap: 7 }}>
                          {['portrait','landscape'].map(o => (
                            <button key={o} className={`btn-sm ${orient === o ? 'on' : ''}`}
                              onClick={() => setOrient(o)}
                              style={{ flex: 1, flexDirection: 'column', gap: 5, height: 'auto', padding: '9px 5px',
                                background: orient === o ? (dark?'rgba(251,113,133,.08)':'rgba(159,18,57,.06)') : '' }}>
                              <div style={{ width: o==='portrait'?14:20, height: o==='portrait'?18:14,
                                border: `2px solid var(--acc)`, borderRadius: 2, margin: '0 auto', opacity: orient===o?1:.35 }} />
                              <span style={{ fontSize: 9, textTransform: 'capitalize' }}>{o}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="panel" style={{ padding: '13px 15px' }}>
                        <div className="lbl" style={{ marginBottom: 8 }}>JPEG quality</div>
                        <div style={{ display: 'flex', gap: 5 }}>
                          {['low','medium','high'].map(q => (
                            <button key={q} className={`btn-sm ${quality === q ? 'on' : ''}`}
                              onClick={() => setQuality(q)}
                              style={{ flex: 1, justifyContent: 'center', textTransform: 'capitalize',
                                background: quality === q ? (dark?'rgba(251,113,133,.08)':'rgba(159,18,57,.06)') : '' }}>
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Fit mode */}
                    <div className="panel" style={{ padding: '13px 15px' }}>
                      <div className="lbl" style={{ marginBottom: 9 }}>Image fit mode</div>
                      {[
                        { id: 'fit',     label: 'Fit',     desc: 'Full image visible, centred with margins' },
                        { id: 'fill',    label: 'Fill',    desc: 'Covers page, edges may crop' },
                        { id: 'stretch', label: 'Stretch', desc: 'Forces exact page fill (may distort)' },
                      ].map(({ id, label, desc }) => (
                        <button key={id} className={`btn-sm ${fitMode === id ? 'on' : ''}`}
                          onClick={() => setFitMode(id)}
                          style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 6, padding: '7px 9px',
                            height: 'auto', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
                            background: fitMode === id ? (dark?'rgba(251,113,133,.08)':'rgba(159,18,57,.06)') : '' }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)', textTransform: 'none', letterSpacing: 0 }}>{label}</span>
                          <span style={{ fontSize: 9.5, opacity: .65, textTransform: 'none', letterSpacing: 0, fontFamily: "'Lora',serif" }}>{desc}</span>
                        </button>
                      ))}
                    </div>

                    {/* Margin + filename */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div className="panel" style={{ padding: '13px 15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span className="lbl" style={{ margin: 0 }}>Page margin</span>
                          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9.5, color: 'var(--acc)' }}>{margin}mm</span>
                        </div>
                        <input type="range" min="0" max="30" value={margin} onChange={e => setMargin(+e.target.value)} />
                      </div>
                      <div className="panel" style={{ padding: '13px 15px' }}>
                        <div className="lbl" style={{ marginBottom: 6 }}>Output filename</div>
                        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                          <input className="inp" value={filename} onChange={e => setFilename(e.target.value)} style={{ flex: 1 }} />
                          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--tx3)', flexShrink: 0 }}>.pdf</span>
                        </div>
                      </div>
                    </div>

                    {/* Cover page */}
                    <div className="panel" style={{ padding: '13px 15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div className="lbl" style={{ margin: 0 }}>Cover page</div>
                        <button className={`btn-sm ${coverEnabled ? 'on' : ''}`}
                          onClick={() => setCover(c => !c)}
                          style={{ background: coverEnabled ? (dark?'rgba(251,113,133,.08)':'rgba(159,18,57,.06)') : '' }}>
                          {coverEnabled ? '● On' : '○ Off'}
                        </button>
                      </div>
                      {coverEnabled && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div>
                            <div className="lbl" style={{ marginBottom: 4 }}>Title</div>
                            <input className="inp" value={coverTitle} onChange={e => setCoverTitle(e.target.value)}
                              placeholder="Document title" style={{ width: '100%' }} />
                          </div>
                          <div>
                            <div className="lbl" style={{ marginBottom: 4 }}>Subtitle</div>
                            <input className="inp" value={coverSubtitle} onChange={e => setCoverSub(e.target.value)}
                              placeholder="Author / date / course" style={{ width: '100%' }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Page numbers + Watermark */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div className="panel" style={{ padding: '13px 15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <div className="lbl" style={{ margin: 0 }}>Page numbers</div>
                          <button className={`btn-sm ${pageNums ? 'on' : ''}`}
                            onClick={() => setPageNums(n => !n)}
                            style={{ background: pageNums ? (dark?'rgba(251,113,133,.08)':'rgba(159,18,57,.06)') : '' }}>
                            {pageNums ? '● On' : '○ Off'}
                          </button>
                        </div>
                        {pageNums && (
                          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            {['bottom-center','bottom-right','bottom-left'].map(pos => (
                              <button key={pos} className={`btn-sm ${pageNumPos === pos ? 'on' : ''}`}
                                onClick={() => setPageNumPos(pos)}
                                style={{ flex: '1 1 auto', fontSize: 8.5, textTransform: 'none', letterSpacing: '.03em',
                                  background: pageNumPos === pos ? (dark?'rgba(251,113,133,.08)':'rgba(159,18,57,.06)') : '' }}>
                                {pos.replace('bottom-', '↓ ')}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="panel" style={{ padding: '13px 15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <div className="lbl" style={{ margin: 0 }}>Watermark</div>
                          <button className={`btn-sm ${watermark ? 'on' : ''}`}
                            onClick={() => setWatermark(w => !w)}
                            style={{ background: watermark ? (dark?'rgba(251,113,133,.08)':'rgba(159,18,57,.06)') : '' }}>
                            {watermark ? '● On' : '○ Off'}
                          </button>
                        </div>
                        {watermark && (<>
                          <input className="inp" value={watermarkText} onChange={e => setWatermarkText(e.target.value)}
                            placeholder="Watermark text" style={{ width: '100%', marginBottom: 8 }} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span className="lbl" style={{ margin: 0 }}>Opacity</span>
                            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'var(--acc)' }}>{watermarkOpacity}%</span>
                          </div>
                          <input type="range" min="5" max="50" value={watermarkOpacity}
                            onChange={e => setWatermarkOpacity(+e.target.value)} />
                        </>)}
                      </div>
                    </div>

                  </div>

                  
                </motion.div>
              )}

              {/* ══ HISTORY ══ */}
              {tab === 'history' && (
                <motion.div key="hist" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  {history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px', fontFamily: "'DM Mono',monospace", fontSize: 12, color: 'var(--tx3)' }}>
                      No PDFs generated yet. Convert images to see your history here.
                    </div>
                  ) : (
                    <div className="panel" style={{ overflow: 'hidden' }}>
                      {history.map((entry, i) => (
                        <motion.div key={entry.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .05 }}
                          className="hist-card">
                          <div style={{ fontSize: 22, flexShrink: 0 }}>📄</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--tx)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {entry.name}
                            </div>
                            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'var(--tx3)' }}>
                              {entry.pages} page{entry.pages > 1 ? 's' : ''} · {fmtSize(entry.size)} · {fmtDate(entry.date)}
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
                    { n: 1, t: 'Upload images', d: 'Drag images onto the drop zone or click it to browse. Supports JPG, PNG, WebP, GIF. Add more anytime — they append to the end of the page list.' },
                    { n: 2, t: 'Reorder pages', d: 'Drag image cards to any position. Use the thumbnail strip at the top to see the full page order at a glance. ↑↓ buttons in the sidebar also reorder.' },
                    { n: 3, t: 'Edit individual pages', d: 'Click ✎ Edit on any card, or open the ✎ Edit Pages tab. Rotate (0°/90°/180°/270°), flip horizontally or vertically, convert to black & white, and adjust brightness and contrast per image.' },
                    { n: 4, t: 'Configure settings', d: 'Open ◈ Settings to choose page size (A4/Letter/A3/A5/Square), orientation, fit mode, margin, quality, and filename. Enable optional cover page, page numbers, or watermark.' },
                    { n: 5, t: 'Add a cover page', d: 'In Settings, toggle Cover Page on and enter a title and subtitle. A styled cover will be inserted as page 1 with a decorative border, date, and your text.' },
                    { n: 6, t: 'Convert & download', d: 'Click "Build PDF". A progress bar tracks each image and applied effects. When the success screen appears, download your PDF. Compression stats show the size reduction vs. original images.' },
                    { n: 7, t: 'Re-download from History', d: 'Every PDF you generate is saved in the ⌛ History tab (up to 10). Click Re-download to get any previous PDF again without reconverting.' },
                  ].map(({ n, t, d }) => (
                    <div key={n} style={{ display: 'flex', gap: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div className="step-n">{n}</div>
                        {n < 7 && <div style={{ width: 1.5, flex: 1, marginTop: 5, background: dark ? 'rgba(251,113,133,.1)' : 'rgba(159,18,57,.12)' }} />}
                      </div>
                      <div style={{ flex: 1, paddingBottom: 10 }}>
                        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: 'var(--tx)', marginBottom: 3, letterSpacing: '.04em' }}>{t}</div>
                        <div style={{ fontFamily: "'Lora',serif", fontSize: 15, color: 'var(--tx2)', lineHeight: 1.74 }}>{d}</div>
                      </div>
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {/* ══ LEARN ══ */}
              {tab === 'learn' && (
                <motion.div key="learn" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="panel" style={{ padding: '22px 26px', marginBottom: 12 }}>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: 'var(--tx)', marginBottom: 4, letterSpacing: '.04em' }}>
                      Creating Assignment Reports: How to Merge Images into One PDF
                    </div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'var(--tx3)', marginBottom: 22, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                      PDF structure · rasterisation · image adjustments · scanning tips
                    </div>
                    <div className="prose">
                      <p>Many university assignments require submitting photos of handwritten work, lab results, or physical diagrams as a single document. Uploading ten separate JPEGs is disorganised and often not accepted. A merged PDF is the universal standard — identical on every device, annotatable by graders, and submittable to any portal.</p>
                      <h3>How image editing is applied before PDF embedding</h3>
                      <p>This tool applies brightness, contrast, rotation, flip, and greyscale adjustments using an HTML5 <strong>Canvas</strong> element before the image is passed to jsPDF. The canvas CSS filter API (<code>brightness()</code>, <code>contrast()</code>, <code>grayscale()</code>) is applied at render time, then the adjusted pixel data is exported as a fresh JPEG. This means the PDF contains the corrected image, not the original — so contrast-boosted scans of pencil work become clearly legible.</p>
                      <h3>Why PDF over a zip of JPEGs?</h3>
                      <p>PDF (Portable Document Format) was designed in 1993 to be device-independent. A PDF defines pages at a fixed logical size (A4, Letter, etc.) regardless of screen resolution. Fonts, images, and vector graphics are embedded. When a professor opens your PDF on a 4K display or prints it on paper, it looks exactly the same. A zip of JPEGs looks different at every zoom level and requires separate software to open.</p>
                      <h3>Cover pages and professional submissions</h3>
                      <p>A cover page signals professionalism and makes your submission instantly identifiable in a folder of 200 student PDFs. The cover in this tool includes a decorative border, your title, subtitle (author/course/date), and an auto-inserted generation date. Real academic submissions should also include a student ID, module code, and word count if applicable.</p>
                      <h3>Tips for better mobile scans</h3>
                      <ul>
                        <li><strong>Lighting:</strong> Natural window light beats artificial overhead light. Avoid holding the phone between the light source and paper.</li>
                        <li><strong>Paper flat:</strong> Press under a clipboard or book before photographing. Curved pages cause shadows and keystoning.</li>
                        <li><strong>Dark pen:</strong> Black ballpoint gives maximum contrast. Pencil and light-coloured markers often disappear after JPEG compression.</li>
                        <li><strong>Boost contrast:</strong> Use the Contrast slider in the ✎ Edit Pages tab to push pencil or faint ink to legible darkness before converting.</li>
                        <li><strong>Consistent angle:</strong> Shoot from directly above, phone parallel to the page. A misaligned phone adds 5–10° of trapezoidal distortion.</li>
                      </ul>
                      {[
                        { q: 'Are my files uploaded to a server?', a: 'No. Everything runs in your browser using the Web File API, the Canvas API, and jsPDF. No network request is made. Your images live only in browser memory and are freed when you close the tab.' },
                        { q: 'Do image adjustments affect the original files?', a: 'No. Adjustments (rotation, brightness, contrast, grayscale, flip) are applied to an in-memory canvas copy. The original file on your device is never modified. Only the adjusted version is embedded in the PDF.' },
                        { q: 'What is the difference between Fit, Fill, and Stretch?', a: 'Fit scales the image so the full image is visible within the margins — white space appears on two sides if the aspect ratios differ. Fill scales so the image covers the full printable area — edges may crop. Stretch forces the image to exactly match the page dimensions regardless of natural proportions, which distorts non-matching images.' },
                        { q: 'Why does my PDF look larger than the original images?', a: 'jsPDF embeds images at high quality by default, and PDF files carry additional overhead (page metadata, font tables, cross-reference tables). If file size matters, use the Low quality option in Settings or reduce the margin to 0. Output size is shown on the success screen compared to original source image total.' },
                        { q: 'Can I include PNG images with transparent backgrounds?', a: 'Yes — transparency is supported. Transparent areas render as white in the PDF because PDF pages have a white background by default. If your PNG has meaningful transparency (e.g., a logo), use Fit mode so the full image is visible without cropping.' },
                      ].map(({ q, a }, i) => (
                        <div key={i} className="faq">
                          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, color: 'var(--tx)', marginBottom: 5, letterSpacing: '.04em' }}>{q}</div>
                          <div style={{ fontFamily: "'Lora',serif", fontSize: 15, color: 'var(--tx2)', lineHeight: 1.74 }}>{a}</div>
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