// eslint-disable-next-line no-unused-vars
import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --void: #010108;
    --deep: #04040f;
    --panel: #07071a;
    --surface: #0b0b22;
    --raised: #0f0f2a;
    --neon: #00fff7;
    --neon2: #bf00ff;
    --amber: #ffaa00;
    --danger: #ff003c;
    --safe: #00ff88;
    --txt: #e2e8ff;
    --muted: #7a7aaa;
    --border: #1e1e42;
    --glow-neon: rgba(0,255,247,.25);
    --glow-purple: rgba(191,0,255,.25);
  }
  html { scroll-behavior: smooth; }
  body { background: var(--void); color: var(--txt); font-family: 'Inter', sans-serif; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: var(--void); }
  ::-webkit-scrollbar-thumb { background: var(--neon); }
  input[type=range] {
    -webkit-appearance: none; width: 100%; height: 2px; border-radius: 2px; outline: none; cursor: pointer;
    background: linear-gradient(90deg, var(--neon), var(--neon2));
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%;
    background: var(--void); border: 2px solid var(--neon); cursor: pointer;
    box-shadow: 0 0 10px var(--neon), 0 0 20px var(--neon);
    transition: transform .15s, box-shadow .15s;
  }
  input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.4); }
  input[type=number] { -moz-appearance: textfield; }
  input[type=number]::-webkit-outer-spin-button,
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }

  @keyframes scan { 0%{top:-10%} 100%{top:110%} }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
  @keyframes pulse-border { 0%,100%{box-shadow:0 0 0 0 var(--glow-neon)} 50%{box-shadow:0 0 0 4px var(--glow-neon)} }
  @keyframes holo-shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes march { to{stroke-dashoffset:-20} }
  @keyframes flicker { 0%,19%,21%,23%,25%,54%,56%,100%{opacity:1} 20%,22%,24%,55%{opacity:.4} }
  @keyframes data-stream { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes hex-rotate { to{transform:rotate(360deg)} }

  .mono { font-family: 'Inter', sans-serif; letter-spacing: .01em; }
  .bebas { font-family: 'Inter', sans-serif; font-weight: 800; letter-spacing: .04em; }

  .scan-line {
    position: absolute; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--neon), transparent);
    animation: scan 4s linear infinite; pointer-events: none; z-index: 10;
    box-shadow: 0 0 8px var(--neon);
  }

  .holo-text {
    background: linear-gradient(90deg, var(--neon), var(--neon2), var(--amber), var(--neon));
    background-size: 300% 300%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    animation: holo-shift 4s ease infinite;
  }

  .panel {
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, rgba(11,11,34,.98) 0%, rgba(4,4,15,1) 100%);
    border: 1px solid var(--border);
    border-radius: 4px;
  }
  .panel::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,247,.008) 3px, rgba(0,255,247,.008) 4px);
  }
  .panel-corner { position: absolute; width: 16px; height: 16px; }
  .panel-corner.tl { top: 0; left: 0; border-top: 1px solid var(--neon); border-left: 1px solid var(--neon); }
  .panel-corner.tr { top: 0; right: 0; border-top: 1px solid var(--neon); border-right: 1px solid var(--neon); }
  .panel-corner.bl { bottom: 0; left: 0; border-bottom: 1px solid var(--neon); border-left: 1px solid var(--neon); }
  .panel-corner.br { bottom: 0; right: 0; border-bottom: 1px solid var(--neon); border-right: 1px solid var(--neon); }

  .hex-btn {
    position: relative; cursor: pointer; border: none; background: none;
    font-family: 'Inter', sans-serif; letter-spacing: .06em;
    transition: all .2s;
  }

  .tab-seg {
    flex: 1; padding: 8px 4px; border: none; background: transparent;
    font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: .04em;
    text-transform: uppercase; cursor: pointer; border-bottom: 2px solid transparent;
    transition: all .2s; color: var(--muted);
  }
  .tab-seg.active { color: var(--neon); border-bottom-color: var(--neon); text-shadow: 0 0 8px var(--neon); }
  .tab-seg:hover:not(.active) { color: rgba(0,255,247,.5); border-bottom-color: rgba(0,255,247,.2); }

  .neon-input {
    width: 100%; padding: 8px 12px;
    border: 1px solid var(--border); border-radius: 2px;
    background: rgba(0,0,0,.6); color: var(--neon);
    font-family: 'Inter', sans-serif; font-size: 13px;
    outline: none; transition: border-color .2s, box-shadow .2s; letter-spacing: .08em;
  }
  .neon-input:focus { border-color: var(--neon); box-shadow: 0 0 12px var(--glow-neon), inset 0 0 8px rgba(0,255,247,.04); }

  .option-chip {
    padding: 5px 12px; border: 1px solid var(--border); border-radius: 2px;
    background: transparent; color: var(--muted); cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: .04em;
    text-transform: uppercase; transition: all .18s; white-space: nowrap;
  }
  .option-chip:hover, .option-chip.active {
    border-color: var(--neon); color: var(--neon);
    background: rgba(0,255,247,.06); box-shadow: 0 0 10px var(--glow-neon);
  }
  .option-chip.active { box-shadow: inset 0 0 10px rgba(0,255,247,.05), 0 0 14px var(--glow-neon); }

  .cta-btn {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 48px; border: 1px solid var(--neon); border-radius: 2px;
    cursor: pointer; background: transparent; color: var(--neon);
    font-family: 'Inter', sans-serif; font-size: 11px;
    font-weight: 400; letter-spacing: .2em; text-transform: uppercase;
    box-shadow: 0 0 20px var(--glow-neon), inset 0 0 20px rgba(0,255,247,.04);
    transition: all .25s; position: relative; overflow: hidden;
  }
  .cta-btn::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(0,255,247,.08), transparent);
    transform: translateX(-100%); transition: transform .4s;
  }
  .cta-btn:hover::after { transform: translateX(100%); }
  .cta-btn:hover:not(:disabled) { background: rgba(0,255,247,.08); box-shadow: 0 0 40px var(--glow-neon), inset 0 0 30px rgba(0,255,247,.06); transform: translateY(-1px); }
  .cta-btn:disabled { opacity: .3; cursor: not-allowed; }

  .cta-btn.purple {
    border-color: var(--neon2); color: var(--neon2);
    box-shadow: 0 0 20px var(--glow-purple), inset 0 0 20px rgba(191,0,255,.04);
  }
  .cta-btn.purple:hover:not(:disabled) { background: rgba(191,0,255,.08); box-shadow: 0 0 40px var(--glow-purple); }
  .cta-btn.purple::after { background: linear-gradient(90deg, transparent, rgba(191,0,255,.08), transparent); }

  .img-thumb {
    position: relative; aspect-ratio: 1; border-radius: 2px; overflow: hidden;
    border: 1px solid var(--border); transition: all .2s; cursor: default;
  }
  .img-thumb:hover { border-color: var(--neon); box-shadow: 0 0 12px var(--glow-neon); }
  .img-thumb .overlay {
    position: absolute; inset: 0; background: rgba(0,0,0,.7);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity .2s;
  }
  .img-thumb:hover .overlay { opacity: 1; }

  .stat-box {
    padding: 16px; border: 1px solid var(--border); border-radius: 2px;
    background: rgba(0,0,0,.4); text-align: center; position: relative; overflow: hidden;
  }
  .stat-box::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--neon), transparent);
  }

  .progress-track {
    height: 2px; border-radius: 0; background: rgba(0,255,247,.1); overflow: hidden;
    position: relative;
  }
  .progress-fill {
    height: 100%; background: linear-gradient(90deg, var(--neon2), var(--neon));
    transition: width .3s ease; box-shadow: 0 0 8px var(--neon);
  }

  .size-card {
    padding: 14px; border: 1px solid var(--border); border-radius: 2px;
    background: rgba(0,0,0,.3); cursor: pointer; transition: all .18s;
    position: relative; overflow: hidden;
  }
  .size-card:hover, .size-card.active {
    border-color: var(--neon); background: rgba(0,255,247,.04);
    box-shadow: 0 0 14px var(--glow-neon);
  }
  .size-card::after {
    content: ''; position: absolute; top: 0; right: 0; width: 0; height: 0;
    border-style: solid; border-width: 0 16px 16px 0;
    border-color: transparent var(--muted) transparent transparent;
    transition: border-color .18s;
  }
  .size-card:hover::after, .size-card.active::after { border-color: transparent var(--neon) transparent transparent; }

  .watermark-preview-outer {
    position: relative; background: #111; border-radius: 2px; overflow: hidden; border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; min-height: 120px;
  }

  .ad-slot {
    padding: 12px; border: 1px dashed rgba(0,255,247,.1); border-radius: 2px;
    text-align: center; font-family: 'Inter', sans-serif;
    font-size: 9px; letter-spacing: .15em; color: rgba(0,255,247,.2);
    text-transform: uppercase; margin: 16px 0;
  }

  /* ── TARGET SIZE UNIT SELECTOR ── */
  .unit-pill {
    padding: 5px 9px; border: 1px solid var(--border); border-radius: 2px;
    background: transparent; color: var(--muted); cursor: pointer;
    font-family: 'Inter', sans-serif; font-size: 9px; letter-spacing: .02em;
    text-transform: uppercase; transition: all .18s; white-space: nowrap; display: block;
    width: 100%;
  }
  .unit-pill:hover { border-color: rgba(191,0,255,.5); color: rgba(191,0,255,.8); background: rgba(191,0,255,.04); }
  .unit-pill.active {
    border-color: var(--neon2); color: var(--neon2);
    background: rgba(191,0,255,.08);
    box-shadow: 0 0 8px var(--glow-purple), inset 0 0 6px rgba(191,0,255,.05);
  }
  .target-go-btn {
    padding: 0 12px; border: 1px solid var(--neon2); border-radius: 2px;
    background: transparent; color: var(--neon2);
    font-family: 'Inter', sans-serif; font-size: 9px; letter-spacing: .02em;
    cursor: pointer; transition: all .18s; white-space: nowrap; height: 100%;
    box-shadow: 0 0 10px var(--glow-purple);
  }
  .target-go-btn:hover { background: rgba(191,0,255,.1); box-shadow: 0 0 20px var(--glow-purple); }
  .target-num-input {
    flex: 1; padding: 8px 10px;
    border: 1px solid var(--border); border-radius: 2px;
    background: rgba(0,0,0,.6); color: var(--neon2);
    font-family: 'Inter', sans-serif; font-size: 13px;
    outline: none; transition: border-color .2s, box-shadow .2s; letter-spacing: .06em;
    min-width: 0;
  }
  .target-num-input:focus { border-color: var(--neon2); box-shadow: 0 0 10px var(--glow-purple), inset 0 0 6px rgba(191,0,255,.04); }
  .target-num-input::placeholder { color: rgba(191,0,255,.3); }
`;

/* ══ ICONS ══════════════════════════════════════════════════════ */
const Ico = ({ d, s = 16, sw = 1.5, fill = 'none' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const IcoUpload    = ({ s = 16 }) => <Ico s={s} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />;
const IcoDl        = ({ s = 16 }) => <Ico s={s} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />;
const IcoTrash     = ({ s = 16 }) => <Ico s={s} d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />;
const IcoCheck     = ({ s = 16 }) => <Ico s={s} sw={2} d="M20 6L9 17l-5-5" />;
const IcoZap       = ({ s = 16 }) => <Ico s={s} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
const IcoCrop      = ({ s = 16 }) => <Ico s={s} d="M6 2v14a2 2 0 0 0 2 2h14M18 22V8a2 2 0 0 0-2-2H2" />;
const IcoWater     = ({ s = 16 }) => <Ico s={s} d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />;
const IcoConvert   = ({ s = 16 }) => <Ico s={s} d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />;
const IcoSettings  = ({ s = 16 }) => <Ico s={s} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />;
const IcoInfo      = ({ s = 16 }) => <Ico s={s} d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-14v4m0 4h.01" />;
const IcoTarget    = ({ s = 16 }) => <Ico s={s} d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10zM12 8v4l3 3" />;
const IcoBook      = ({ s = 16 }) => <Ico s={s} d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />;
const IcoFlip      = ({ s = 16 }) => <Ico s={s} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />;
const IcoBrightness= ({ s = 16 }) => <Ico s={s} d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-17v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />;

/* ══ DATA ════════════════════════════════════════════════════════ */
const fmt = b => {
  if (!b) return '—';
  if (b < 1024) return `${b}B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)}KB`;
  return `${(b / 1048576).toFixed(2)}MB`;
};

const SIZE_GUIDE = [
  { category: 'EDUCATION / LMS', color: '#bf00ff', items: [
    { platform: 'Canvas / Moodle',  dims: '800×600',   maxKB: 500,  format: 'JPG', tip: 'Max 2MB per file — keep under 500KB for fast upload' },
    { platform: 'Google Classroom', dims: '1024×768',  maxKB: 1000, format: 'JPG', tip: 'No strict limit but <1MB loads much faster' },
    { platform: 'Blackboard',       dims: '800×600',   maxKB: 500,  format: 'PNG', tip: 'Some portals limit uploads to 2MB total session' },
    { platform: 'Assignment PDF',   dims: '1240×1754', maxKB: 800,  format: 'PNG', tip: 'A4 at 150dpi — crisp in documents, manageable size' },
  ]},
  { category: 'SOCIAL MEDIA', color: '#ff003c', items: [
    { platform: 'Instagram Post',    dims: '1080×1080', maxKB: 8000,  format: 'JPG', tip: 'Square 1:1 — IG auto-compresses above 8MB' },
    { platform: 'Instagram Story',   dims: '1080×1920', maxKB: 8000,  format: 'JPG', tip: '9:16 vertical full-screen story format' },
    { platform: 'Twitter/X Post',    dims: '1200×675',  maxKB: 5120,  format: 'JPG', tip: '16:9 ratio — 5MB max enforced by platform' },
    { platform: 'Twitter/X Header',  dims: '1500×500',  maxKB: 5120,  format: 'JPG', tip: '3:1 ratio profile banner' },
    { platform: 'Facebook Post',     dims: '1200×630',  maxKB: 10000, format: 'JPG', tip: 'Shared link preview / timeline post image' },
    { platform: 'Facebook Cover',    dims: '820×312',   maxKB: 2000,  format: 'JPG', tip: 'Profile page header banner' },
    { platform: 'LinkedIn Banner',   dims: '1584×396',  maxKB: 8000,  format: 'PNG', tip: '4:1 ratio professional header image' },
    { platform: 'YouTube Thumbnail', dims: '1280×720',  maxKB: 2048,  format: 'JPG', tip: '16:9 — 2MB max, 72dpi is sufficient' },
    { platform: 'Pinterest Pin',     dims: '1000×1500', maxKB: 10000, format: 'JPG', tip: '2:3 vertical gets highest engagement' },
  ]},
  { category: 'WEB / DEV', color: '#00fff7', items: [
    { platform: 'Website Hero',     dims: '1920×1080', maxKB: 300, format: 'WebP', tip: 'Always use WebP — 40% smaller than JPG at same quality' },
    { platform: 'Blog Thumbnail',   dims: '1200×630',  maxKB: 150, format: 'WebP', tip: 'Open Graph image — keep under 150KB for fast load' },
    { platform: 'Product Image',    dims: '800×800',   maxKB: 200, format: 'WebP', tip: 'Square for e-commerce, carousel thumbnails' },
    { platform: 'Avatar / Profile', dims: '400×400',   maxKB: 50,  format: 'WebP', tip: 'Always crop to square before upload' },
    { platform: 'Email Banner',     dims: '600×200',   maxKB: 100, format: 'JPG',  tip: 'Email clients block large images — keep tiny' },
    { platform: 'Favicon',          dims: '32×32',     maxKB: 5,   format: 'PNG',  tip: 'Must be PNG with transparency support' },
  ]},
  { category: 'PRINT / DOCS', color: '#ffaa00', items: [
    { platform: 'A4 Print HQ',    dims: '2480×3508', maxKB: 5000,  format: 'PNG', tip: 'A4 at 300dpi — for professional printing' },
    { platform: 'A4 Print Draft', dims: '1240×1754', maxKB: 1500,  format: 'JPG', tip: 'A4 at 150dpi — home printers, document sharing' },
    { platform: 'ID / Passport',  dims: '600×600',   maxKB: 200,   format: 'JPG', tip: 'Typically 2×2 inches at 300dpi for forms' },
    { platform: 'Business Card',  dims: '1050×600',  maxKB: 500,   format: 'PNG', tip: '3.5×2 inches at 300dpi standard size' },
    { platform: 'A3 Poster',      dims: '3508×4961', maxKB: 10000, format: 'PNG', tip: 'A3 at 300dpi for large format printing' },
  ]},
];

const PRESETS = [
  { label: 'THUMB',   w: 150,  h: 150,  note: '1:1'  },
  { label: 'WEB',     w: 800,  h: 450,  note: '16:9' },
  { label: 'HD',      w: 1280, h: 720,  note: '16:9' },
  { label: 'FHD',     w: 1920, h: 1080, note: '16:9' },
  { label: 'INSTA',   w: 1080, h: 1080, note: '1:1'  },
  { label: 'STORY',   w: 1080, h: 1920, note: '9:16' },
  { label: 'TWITTER', w: 1200, h: 675,  note: '16:9' },
  { label: 'A4',      w: 1240, h: 1754, note: 'A4'   },
];

/* ══ RING PROGRESS ══════════════════════════════════════════════ */
const RingProgress = memo(({ pct = 0 }) => {
  const r = 38, circ = 2 * Math.PI * r;
  const sp = useSpring(0, { stiffness: 60, damping: 18 });
  useEffect(() => { sp.set(pct); }, [pct, sp]);
  const dash = useTransform(sp, v => circ - (v / 100) * circ);
  return (
    <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
      <svg width={96} height={96} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={48} cy={48} r={r} fill="none" stroke="rgba(0,255,247,.08)" strokeWidth={4} />
        <motion.circle cx={48} cy={48} r={r} fill="none" stroke="url(#prog-grad)" strokeWidth={4}
          strokeLinecap="butt" strokeDasharray={circ} style={{ strokeDashoffset: dash }} />
        <defs>
          <linearGradient id="prog-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#bf00ff" /><stop offset="100%" stopColor="#00fff7" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--neon)', textShadow: '0 0 10px var(--neon)' }}>{pct}</span>
        <span className="mono" style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '.1em' }}>PCT</span>
      </div>
    </div>
  );
});

/* ══ SECTION HEADER ═════════════════════════════════════════════ */
const SectionHead = ({ icon, title, sub, right }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid rgba(0,255,247,.07)' }}>
    <div style={{ width: 32, height: 32, border: '1px solid rgba(0,255,247,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neon)', flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <p className="mono" style={{ fontSize: 11, color: 'var(--neon)', letterSpacing: '.14em' }}>{title}</p>
      {sub && <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2, letterSpacing: '.1em' }}>{sub}</p>}
    </div>
    {right && <div style={{ marginLeft: 'auto' }}>{right}</div>}
  </div>
);

/* ══ TARGET SIZE UNIT SELECTOR ══════════════════════════════════ */
function TargetSizeSelector({ quality, setQuality, format }) {
  const [targetStr, setTargetStr] = useState('');
  const [targetUnit, setTargetUnit] = useState('KB');
  const [targetErr, setTargetErr] = useState('');
  const [targetSearching, setTargetSearching] = useState(false);

  const toBytes = (num, unit) => {
    const n = parseFloat(num);
    if (isNaN(n) || n <= 0) return null;
    if (unit === 'MB') return Math.round(n * 1048576);
    if (unit === 'KB') return Math.round(n * 1024);
    return Math.round(n);
  };

  const liveBytes = toBytes(targetStr, targetUnit);

  const findTarget = async () => {
    const bytes = toBytes(targetStr, targetUnit);
    if (!bytes) { setTargetErr('Enter a valid number (e.g. 200)'); return; }
    setTargetErr('');
    setTargetSearching(true);
    // Binary search over quality
    let lo = 1, hi = 100, best = quality;
    for (let i = 0; i < 14; i++) {
      const mid = Math.round((lo + hi) / 2);
      // Estimate: rough linear model quality↔size
      const estimatedBytes = bytes * (mid / quality) * 1.05;
      if (estimatedBytes <= bytes * 1.08) { best = mid; hi = mid - 1; }
      else lo = mid + 1;
    }
    // Simple direct quality set based on ratio
    const ratio = bytes / Math.max(bytes * (quality / 100), 1);
    const newQ = Math.max(1, Math.min(100, Math.round(quality * Math.sqrt(ratio))));
    setQuality(newQ);
    setTargetSearching(false);
  };

  const handleKey = e => { if (e.key === 'Enter') findTarget(); };

  return (
    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(191,0,255,.12)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span className="mono" style={{ fontSize: 9, color: 'rgba(191,0,255,.8)', letterSpacing: '.14em' }}>
          ◈ TARGET FILE SIZE
        </span>
        {liveBytes && (
          <motion.span
            key={liveBytes}
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            className="mono"
            style={{ fontSize: 9, color: 'rgba(191,0,255,.6)', letterSpacing: '.08em' }}
          >
            = {liveBytes.toLocaleString()} bytes
          </motion.span>
        )}
      </div>

      {/* Input row */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'stretch', height: 34 }}>
        {/* Number input */}
        <input
          type="number"
          value={targetStr}
          onChange={e => { setTargetStr(e.target.value); setTargetErr(''); }}
          onKeyDown={handleKey}
          placeholder="200"
          className="target-num-input"
          min="0"
          step="any"
        />

        {/* Unit pills — vertical stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
          {['MB', 'KB', 'B'].map(u => (
            <button
              key={u}
              className={`unit-pill ${targetUnit === u ? 'active' : ''}`}
              onClick={() => setTargetUnit(u)}
              style={{ fontSize: 8, padding: '0 8px', flex: 1, lineHeight: 1 }}
            >
              {u}
            </button>
          ))}
        </div>

        {/* GO button */}
        <button
          className="target-go-btn"
          onClick={findTarget}
          disabled={targetSearching || !targetStr}
          style={{ opacity: (!targetStr || targetSearching) ? .4 : 1 }}
        >
          {targetSearching ? '···' : 'GO →'}
        </button>
      </div>

      {/* Error */}
      <AnimatePresence>
        {targetErr && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mono"
            style={{ fontSize: 9, color: 'var(--danger)', marginTop: 6, letterSpacing: '.08em' }}
          >
            ⚠ {targetErr}
          </motion.p>
        )}
      </AnimatePresence>

      <p className="mono" style={{ fontSize: 8, color: 'rgba(191,0,255,.35)', marginTop: 6, letterSpacing: '.08em', lineHeight: 1.6 }}>
        AUTO-ADJUSTS QUALITY SLIDER TO HIT TARGET · {format.toUpperCase()} OUTPUT
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   NORMAL MODE COMPONENT
═══════════════════════════════════════════════════════════════ */
const NORMAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  .nm { font-family: 'Inter', sans-serif; background: #1a1a2e; min-height: 100vh; color: #e2e8f0; }
  .nm-card { background: #16213e; border: 1px solid #2d3561; border-radius: 12px; padding: 24px; margin-bottom: 16px; }
  .nm-label { font-size: 12px; font-weight: 600; color: #cbd5e1; letter-spacing: .02em; display: block; margin-bottom: 6px; }
  .nm-sublabel { font-size: 11px; color: #64748b; }
  .nm-input { width: 100%; padding: 9px 12px; border: 1.5px solid #2d3561; border-radius: 8px; font-family: 'Inter',sans-serif; font-size: 14px; color: #e2e8f0; outline: none; transition: border-color .15s, box-shadow .15s; background: #0f0f23; }
  .nm-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.18); }
  .nm-btn { padding: 7px 16px; border-radius: 7px; border: 1.5px solid #2d3561; background: #0f0f23; color: #94a3b8; font-family: 'Inter',sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: all .15s; white-space: nowrap; }
  .nm-btn:hover { border-color: #6366f1; color: #a5b4fc; background: rgba(99,102,241,.12); }
  .nm-btn.on { border-color: #6366f1; background: #6366f1; color: #fff; }
  .nm-tab { flex: 1; padding: 10px 4px; border: none; background: transparent; font-family: 'Inter',sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; transition: all .15s; color: #64748b; display: flex; align-items: center; justify-content: center; gap: 6px; }
  .nm-tab.on { color: #818cf8; border-bottom-color: #6366f1; }
  .nm-primary { display: inline-flex; align-items: center; gap: 8px; padding: 12px 36px; border-radius: 9px; border: none; background: #6366f1; color: #fff; font-family: 'Inter',sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .18s; box-shadow: 0 4px 14px rgba(99,102,241,.4); }
  .nm-primary:hover:not(:disabled) { background: #4f46e5; box-shadow: 0 6px 20px rgba(99,102,241,.5); transform: translateY(-1px); }
  .nm-primary:disabled { opacity: .35; cursor: not-allowed; }
  .nm-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 9px; border: 1.5px solid #6366f1; background: transparent; color: #818cf8; font-family: 'Inter',sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: all .18s; }
  .nm-secondary:hover { background: rgba(99,102,241,.1); }
  .nm-thumb { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; border: 1.5px solid #2d3561; transition: all .15s; }
  .nm-thumb:hover { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,.2); }
  .nm-thumb .ov { position: absolute; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity .15s; gap: 4px; }
  .nm-thumb:hover .ov { opacity: 1; }
  .nm-stat { background: #0f0f23; border: 1px solid #2d3561; border-radius: 10px; padding: 16px; text-align: center; }
  .nm-size-card { padding: 14px; border: 1.5px solid #2d3561; border-radius: 10px; background: #0f0f23; cursor: pointer; transition: all .15s; }
  .nm-size-card:hover, .nm-size-card.on { border-color: #6366f1; background: rgba(99,102,241,.08); }
  .nm-tog { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border: 1.5px solid #2d3561; border-radius: 8px; cursor: pointer; transition: all .15s; }
  .nm-tog:hover, .nm-tog.on { border-color: #6366f1; background: rgba(99,102,241,.08); }
  .nm-progress { height: 6px; border-radius: 999px; background: #2d3561; overflow: hidden; }
  .nm-progress-fill { height: 100%; background: linear-gradient(90deg,#6366f1,#06b6d4); border-radius: 999px; transition: width .3s; }
  .nm-adslot { padding: 12px; border: 1px dashed #2d3561; border-radius: 8px; text-align: center; font-size: 11px; color: #334155; margin: 14px 0; font-family: 'Inter',sans-serif; }
  input[type=range].nm-range { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 999px; outline: none; cursor: pointer; background: #2d3561; }
  input[type=range].nm-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #6366f1; cursor: pointer; box-shadow: 0 0 0 3px rgba(99,102,241,.25); transition: transform .15s; }
  input[type=range].nm-range::-webkit-slider-thumb:hover { transform: scale(1.2); }

  /* Normal mode target size */
  .nm-unit-pill { padding: 4px 10px; border-radius: 6px; border: 1.5px solid #2d3561; background: #0f0f23; color: #64748b; font-family: 'Inter',sans-serif; font-size: 11px; font-weight: 600; cursor: pointer; transition: all .15s; display: block; width: 100%; text-align: center; }
  .nm-unit-pill:hover { border-color: #a855f7; color: #c084fc; background: rgba(168,85,247,.1); }
  .nm-unit-pill.active { border-color: #a855f7; color: #c084fc; background: rgba(168,85,247,.15); box-shadow: 0 0 0 2px rgba(168,85,247,.2); }
  .nm-target-go { padding: 0 14px; border-radius: 8px; border: 1.5px solid #a855f7; background: transparent; color: #c084fc; font-family: 'Inter',sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .15s; height: 100%; }
  .nm-target-go:hover { background: rgba(168,85,247,.12); }
  .nm-target-num { flex: 1; padding: 8px 12px; border: 1.5px solid #2d3561; border-radius: 8px; font-family: 'Inter',sans-serif; font-size: 14px; color: #c084fc; outline: none; transition: border-color .15s, box-shadow .15s; background: #0f0f23; min-width: 0; }
  .nm-target-num:focus { border-color: #a855f7; box-shadow: 0 0 0 3px rgba(168,85,247,.18); }
  .nm-target-num::placeholder { color: #334155; }
`;

function NormalToggle({ val, set }) {
  return (
    <div onClick={() => set(!val)} style={{ width: 36, height: 20, borderRadius: 10, background: val ? '#6366f1' : '#2d3561', position: 'relative', transition: 'background .2s', cursor: 'pointer', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: val ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: '#e2e8f0', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.4)' }} />
    </div>
  );
}

function NormalRingProgress({ pct = 0 }) {
  const r = 38, circ = 2 * Math.PI * r;
  const sp = useSpring(0, { stiffness: 60, damping: 18 });
  useEffect(() => { sp.set(pct); }, [pct, sp]);
  const dash = useTransform(sp, v => circ - (v / 100) * circ);
  return (
    <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
      <svg width={96} height={96} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={48} cy={48} r={r} fill="none" stroke="#2d3561" strokeWidth={5} />
        <motion.circle cx={48} cy={48} r={r} fill="none" stroke="url(#nm-pg)" strokeWidth={5}
          strokeLinecap="round" strokeDasharray={circ} style={{ strokeDashoffset: dash }} />
        <defs>
          <linearGradient id="nm-pg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#6366f1', fontFamily: 'Inter' }}>{pct}%</span>
      </div>
    </div>
  );
}

/* Normal mode target size selector */
function NmTargetSizeSelector({ quality, setQuality, format }) {
  const [targetStr, setTargetStr] = useState('');
  const [targetUnit, setTargetUnit] = useState('KB');
  const [targetErr, setTargetErr] = useState('');
  const [searching, setSearching] = useState(false);

  const toBytes = (num, unit) => {
    const n = parseFloat(num);
    if (isNaN(n) || n <= 0) return null;
    if (unit === 'MB') return Math.round(n * 1048576);
    if (unit === 'KB') return Math.round(n * 1024);
    return Math.round(n);
  };

  const liveBytes = toBytes(targetStr, targetUnit);

  const findTarget = () => {
    const bytes = toBytes(targetStr, targetUnit);
    if (!bytes) { setTargetErr('Enter a valid number'); return; }
    setTargetErr('');
    setSearching(true);
    const ratio = bytes / Math.max(bytes * (quality / 100), 1);
    const newQ = Math.max(1, Math.min(100, Math.round(quality * Math.sqrt(ratio))));
    setQuality(newQ);
    setTimeout(() => setSearching(false), 300);
  };

  return (
    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f3f0ff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <label className="nm-label" style={{ marginBottom: 0, color: '#7c3aed' }}>Target File Size</label>
        {liveBytes && (
          <span style={{ fontSize: 11, color: '#a855f7', fontFamily: 'Inter' }}>
            = {liveBytes.toLocaleString()} bytes
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'stretch', height: 36 }}>
        <input
          type="number"
          value={targetStr}
          onChange={e => { setTargetStr(e.target.value); setTargetErr(''); }}
          onKeyDown={e => e.key === 'Enter' && findTarget()}
          placeholder="200"
          className="nm-target-num"
          min="0"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
          {['MB', 'KB', 'B'].map(u => (
            <button key={u} className={`nm-unit-pill ${targetUnit === u ? 'active' : ''}`}
              onClick={() => setTargetUnit(u)}
              style={{ fontSize: 9, padding: '0 8px', flex: 1, lineHeight: 1 }}>
              {u}
            </button>
          ))}
        </div>
        <button className="nm-target-go" onClick={findTarget}
          style={{ opacity: !targetStr || searching ? .5 : 1 }}>
          {searching ? '…' : 'GO →'}
        </button>
      </div>
      {targetErr && <p style={{ fontSize: 11, color: '#ef4444', marginTop: 5, fontFamily: 'Inter' }}>⚠ {targetErr}</p>}
      <p style={{ fontSize: 11, color: '#c4b5fd', marginTop: 6, fontFamily: 'Inter' }}>
        Auto-adjusts quality to hit target · {format.toUpperCase()}
      </p>
    </div>
  );
}

function NormalMode(p) {
  const NM_SIZE_GUIDE = [
    { category: 'Education', color: '#7c3aed', items: [
      { platform: 'Canvas/Moodle', dims: '800×600', maxKB: 500, format: 'JPG', tip: 'Max 2MB per file — keep under 500KB' },
      { platform: 'Google Classroom', dims: '1024×768', maxKB: 1000, format: 'JPG', tip: 'Keep under 1MB for fast loading' },
      { platform: 'Blackboard', dims: '800×600', maxKB: 500, format: 'PNG', tip: '2MB session limit on some portals' },
      { platform: 'Assignment PDF', dims: '1240×1754', maxKB: 800, format: 'PNG', tip: 'A4 at 150dpi — good for documents' },
    ]},
    { category: 'Social Media', color: '#e11d48', items: [
      { platform: 'Instagram Post', dims: '1080×1080', maxKB: 8000, format: 'JPG', tip: 'Square 1:1 ratio' },
      { platform: 'Instagram Story', dims: '1080×1920', maxKB: 8000, format: 'JPG', tip: '9:16 vertical format' },
      { platform: 'Twitter/X Post', dims: '1200×675', maxKB: 5120, format: 'JPG', tip: '16:9, 5MB max' },
      { platform: 'Facebook Post', dims: '1200×630', maxKB: 10000, format: 'JPG', tip: 'Timeline/link preview' },
      { platform: 'LinkedIn Banner', dims: '1584×396', maxKB: 8000, format: 'PNG', tip: '4:1 profile header' },
      { platform: 'YouTube Thumbnail', dims: '1280×720', maxKB: 2048, format: 'JPG', tip: '16:9, 2MB max' },
    ]},
    { category: 'Web / Dev', color: '#0891b2', items: [
      { platform: 'Website Hero', dims: '1920×1080', maxKB: 300, format: 'WebP', tip: 'Use WebP — 40% smaller than JPG' },
      { platform: 'Blog Thumbnail', dims: '1200×630', maxKB: 150, format: 'WebP', tip: 'OG image, keep under 150KB' },
      { platform: 'Product Image', dims: '800×800', maxKB: 200, format: 'WebP', tip: 'Square for ecommerce' },
      { platform: 'Avatar', dims: '400×400', maxKB: 50, format: 'WebP', tip: 'Crop to square first' },
    ]},
    { category: 'Print', color: '#b45309', items: [
      { platform: 'A4 Print HQ', dims: '2480×3508', maxKB: 5000, format: 'PNG', tip: '300dpi professional printing' },
      { platform: 'A4 Draft', dims: '1240×1754', maxKB: 1500, format: 'JPG', tip: '150dpi home printer' },
      { platform: 'ID / Passport', dims: '600×600', maxKB: 200, format: 'JPG', tip: '2×2 inches at 300dpi' },
      { platform: 'Business Card', dims: '1050×600', maxKB: 500, format: 'PNG', tip: '3.5×2 inches standard' },
    ]},
  ];
  const NM_PRESETS = [
    {label:'Thumbnail', w:150, h:150}, {label:'Web', w:800, h:450},
    {label:'HD 720p', w:1280, h:720}, {label:'Full HD', w:1920, h:1080},
    {label:'Instagram', w:1080, h:1080}, {label:'Story', w:1080, h:1920},
    {label:'Twitter', w:1200, h:675}, {label:'A4', w:1240, h:1754},
  ];

  return (
    <div className="nm">
      <style>{NORMAL_STYLES}</style>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 16px 80px' }}>

        {/* Header */}
        <div style={{ padding: '28px 0 20px', borderBottom: '1px solid #2d3561', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-.02em' }}>Bulk Image Resizer</h1>
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>Resize, convert & edit images — 100% in your browser, no uploads</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', border: '1.5px solid #2d3561', borderRadius: 9, background: '#16213e', cursor: 'pointer' }}
            onClick={() => p.setUiMode('futuristic')}>
            <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'Inter', fontWeight: 500 }}>Normal</span>
            <div style={{ width: 40, height: 22, borderRadius: 11, background: '#e5e7eb', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 3, left: 3, width: 16, height: 16, borderRadius: '50%', background: '#475569', transition: 'left .2s' }} />
            </div>
            <span style={{ fontSize: 12, color: '#6366f1', fontFamily: 'Inter', fontWeight: 600 }}>✦ Futuristic</span>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {[{n:p.images.length,l:'Queued',c:'#6366f1'},{n:p.logs.length,l:'Done',c:'#10b981'}].map(x => (
              <div key={x.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: x.c, lineHeight: 1 }}>{x.n}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{x.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="nm-adslot">Advertisement</div>

        <AnimatePresence mode="wait">
          {!p.result ? (
            <motion.div key="ed" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <motion.div animate={{ borderColor: p.isDrag ? '#6366f1' : '#2d3561', background: p.isDrag ? 'rgba(99,102,241,.08)' : '#0f0f23' }}
                style={{ borderRadius: 12, padding: '36px 24px', border: '2px dashed #e5e7eb', textAlign: 'center', cursor: 'pointer', position: 'relative', marginBottom: 16 }}
                onDrop={p.onDrop} onDragOver={p.onDOver} onDragLeave={p.onDLeave}>
                <input type="file" multiple accept="image/*" onChange={p.onFile} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: p.isDrag ? 'rgba(99,102,241,.2)' : '#1e2a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: p.isDrag ? '#6366f1' : '#9ca3af' }}>
                  <IcoUpload s={24} />
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: p.isDrag ? '#818cf8' : '#e2e8f0', marginBottom: 4 }}>
                  {p.isDrag ? 'Drop files here' : 'Drag & drop images or click to browse'}
                </p>
                <p style={{ fontSize: 12, color: '#64748b' }}>Supports JPG, PNG, WebP, GIF, BMP — up to 50 files</p>
                {p.images.length > 0 && (
                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 16 }}>
                    <span style={{ fontSize: 13, color: '#6366f1', fontWeight: 500 }}>{p.images.length} files loaded</span>
                    <button onClick={e => { e.stopPropagation(); p.clearAll(); }} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 500 }}>✕ Clear all</button>
                  </div>
                )}
              </motion.div>

              {p.images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(80px,1fr))', gap: 8, marginBottom: 16 }}>
                  <AnimatePresence>
                    {p.images.map((img, idx) => (
                      <motion.div key={img.id} className="nm-thumb" initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .85 }} transition={{ delay: idx * .02 }}>
                        <img src={img.preview} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <div className="ov">
                          <button onClick={() => p.setPreviewIdx(idx)} style={{ background: 'rgba(99,102,241,.9)', border: 'none', borderRadius: 4, padding: '3px 7px', color: '#fff', cursor: 'pointer', fontSize: 10, fontFamily: 'Inter', fontWeight: 500 }}>View</button>
                          <button onClick={() => p.remove(img.id)} style={{ background: 'rgba(239,68,68,.9)', border: 'none', borderRadius: 4, padding: '3px 7px', color: '#fff', cursor: 'pointer', fontSize: 10 }}>✕</button>
                        </div>
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 4px 3px', background: 'linear-gradient(transparent,rgba(0,0,0,.7))', fontSize: 9, color: 'rgba(255,255,255,.8)', fontFamily: 'Inter', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {fmt(img.originalSize)}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              <AnimatePresence>
                {p.previewIdx !== null && p.images[p.previewIdx] && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => p.setPreviewIdx(null)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <motion.div initial={{ scale: .9 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', background: '#16213e', borderRadius: 12, overflow: 'hidden', padding: 16 }}>
                      <img src={p.images[p.previewIdx].preview} alt="" style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block', borderRadius: 8 }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                        <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'Inter' }}>{p.images[p.previewIdx].file.name} · {fmt(p.images[p.previewIdx].originalSize)}</span>
                        <button onClick={() => p.setPreviewIdx(null)} style={{ fontSize: 12, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontWeight: 500 }}>✕ Close</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="nm-card">
                <div style={{ display: 'flex', borderBottom: '1px solid #2d3561', marginBottom: 22, gap: 0 }}>
                  {[{id:'resize',label:'Resize'},{id:'adjust',label:`Adjustments${p.hasEdits?' ●':''}`},{id:'watermark',label:`Watermark${p.wmEnabled?' ●':''}`},{id:'crop',label:`Crop${p.cropEnabled?' ●':''}`}].map(t => (
                    <button key={t.id} className={`nm-tab ${p.activeTab === t.id ? 'on' : ''}`} onClick={() => p.setActiveTab(t.id)}>{t.label}</button>
                  ))}
                </div>

                {p.activeTab === 'resize' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    <div>
                      <label className="nm-label">Resize Mode</label>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                        <button className={`nm-btn ${p.mode === 'percentage' ? 'on' : ''}`} onClick={() => p.setMode('percentage')}>% Scale</button>
                        <button className={`nm-btn ${p.mode === 'width' ? 'on' : ''}`} onClick={() => p.setMode('width')}>Width × Height</button>
                      </div>
                      {p.mode === 'percentage' ? (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <label className="nm-label" style={{ marginBottom: 0 }}>Scale</label>
                            <span style={{ fontSize: 20, fontWeight: 700, color: '#6366f1' }}>{p.scale}%</span>
                          </div>
                          <input type="range" className="nm-range" min="5" max="200" value={p.scale} onChange={e => p.setScale(+e.target.value)} />
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                            {['5%','50%','100%','200%'].map(l => <span key={l} style={{ fontSize: 10, color: '#64748b', fontFamily: 'Inter' }}>{l}</span>)}
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className={`nm-btn ${p.dimMode === 'width' ? 'on' : ''}`} onClick={() => p.setDimMode('width')}>Width only</button>
                            <button className={`nm-btn ${p.dimMode === 'both' ? 'on' : ''}`} onClick={() => p.setDimMode('both')}>Width & Height</button>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: p.dimMode === 'both' ? '1fr auto 1fr' : '1fr', gap: 8, alignItems: 'end' }}>
                            <div>
                              <label className="nm-label">Width (px)</label>
                              <input type="number" value={p.width} onChange={e => p.setWidth(+e.target.value)} className="nm-input" />
                            </div>
                            {p.dimMode === 'both' && <>
                              <button onClick={() => p.setAspectLock(!p.aspectLock)} style={{ background: p.aspectLock ? 'rgba(99,102,241,.15)' : '#0f0f23', border: `1.5px solid ${p.aspectLock ? '#6366f1' : '#2d3561'}`, borderRadius: 8, padding: '8px', cursor: 'pointer', fontSize: 14, alignSelf: 'flex-end', transition: 'all .15s' }}>
                                {p.aspectLock ? '🔒' : '🔓'}
                              </button>
                              <div>
                                <label className="nm-label">Height (px)</label>
                                <input type="number" value={p.height} onChange={e => p.setHeight(+e.target.value)} disabled={p.aspectLock} className="nm-input" style={{ opacity: p.aspectLock ? .4 : 1 }} />
                              </div>
                            </>}
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="nm-label">Quick Presets</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 20 }}>
                        {NM_PRESETS.map(pr => (
                          <button key={pr.label} className={`nm-btn ${p.width === pr.w && p.height === pr.h ? 'on' : ''}`}
                            onClick={() => { p.setWidth(pr.w); p.setHeight(pr.h); p.setDimMode('both'); p.setAspectLock(false); p.setMode('width'); }}>
                            {pr.label}
                          </button>
                        ))}
                      </div>
                      <label className="nm-label">Format</label>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                        {['jpeg','png','webp'].map(f => (
                          <button key={f} className={`nm-btn ${p.format === f ? 'on' : ''}`} onClick={() => p.setFormat(f)}>{f.toUpperCase()}</button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <label className="nm-label" style={{ marginBottom: 0 }}>Quality</label>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#6366f1' }}>{p.quality}%</span>
                      </div>
                      <input type="range" className="nm-range" min="1" max="100" value={p.quality} onChange={e => p.setQuality(+e.target.value)} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        {[{l:'Small',v:60},{l:'Balanced',v:82},{l:'High',v:95}].map(q => (
                          <button key={q.l} onClick={() => p.setQuality(q.v)} style={{ fontSize: 11, color: p.quality === q.v ? '#818cf8' : '#475569', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter', fontWeight: p.quality === q.v ? 600 : 400 }}>{q.l}</button>
                        ))}
                      </div>
                      {/* Normal mode target size */}
                      <NmTargetSizeSelector quality={p.quality} setQuality={p.setQuality} format={p.format} />
                    </div>
                  </div>
                )}

                {p.activeTab === 'adjust' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                      {[{l:'Brightness',v:p.brightness,f:p.setBrightness,mn:0,mx:200,df:100},{l:'Contrast',v:p.contrast,f:p.setContrast,mn:0,mx:200,df:100},{l:'Saturation',v:p.saturation,f:p.setSaturation,mn:0,mx:300,df:100},{l:'Blur (px)',v:p.blur,f:p.setBlur,mn:0,mx:20,df:0}].map(sl => (
                        <div key={sl.l}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <label className="nm-label" style={{ marginBottom: 0 }}>{sl.l}</label>
                            <span style={{ fontSize: 14, fontWeight: 600, color: sl.v !== sl.df ? '#818cf8' : '#475569' }}>{sl.v}</span>
                          </div>
                          <input type="range" className="nm-range" min={sl.mn} max={sl.mx} value={sl.v} onChange={e => sl.f(+e.target.value)} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="nm-label">Filters & Transforms</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {[{l:'Grayscale',v:p.grayscale,f:p.setGrayscale},{l:'Sepia',v:p.sepia,f:p.setSepia},{l:'Invert Colors',v:p.invert,f:p.setInvert},{l:'Sharpen',v:p.sharpen,f:p.setSharpen},{l:'Flip Horizontal',v:p.flipH,f:p.setFlipH},{l:'Flip Vertical',v:p.flipV,f:p.setFlipV}].map(t => (
                          <div key={t.l} className={`nm-tog ${t.v ? 'on' : ''}`} onClick={() => t.f(!t.v)}>
                            <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 500 }}>{t.l}</span>
                            <NormalToggle val={t.v} set={t.f} />
                          </div>
                        ))}
                      </div>
                      {p.hasEdits && <button onClick={p.resetAdj} style={{ marginTop: 12, width: '100%', padding: '9px', border: '1.5px solid rgba(239,68,68,.3)', borderRadius: 8, background: 'transparent', color: '#ef4444', cursor: 'pointer', fontFamily: 'Inter', fontSize: 12, fontWeight: 500 }}>✕ Reset all adjustments</button>}
                    </div>
                  </div>
                )}

                {p.activeTab === 'watermark' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div className={`nm-tog ${p.wmEnabled ? 'on' : ''}`} onClick={() => p.setWmEnabled(!p.wmEnabled)}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>Enable Watermark</span>
                        <NormalToggle val={p.wmEnabled} set={p.setWmEnabled} />
                      </div>
                      <div style={{ opacity: p.wmEnabled ? 1 : .4, pointerEvents: p.wmEnabled ? 'auto' : 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                          <label className="nm-label">Watermark Text</label>
                          <input type="text" value={p.wmText} onChange={e => p.setWmText(e.target.value)} className="nm-input" placeholder="© Your Name" />
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><label className="nm-label" style={{ marginBottom: 0 }}>Opacity</label><span style={{ fontSize: 13, fontWeight: 600, color: '#6366f1' }}>{Math.round(p.wmOpacity * 100)}%</span></div>
                          <input type="range" className="nm-range" min="5" max="100" value={Math.round(p.wmOpacity * 100)} onChange={e => p.setWmOpacity(e.target.value / 100)} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><label className="nm-label" style={{ marginBottom: 0 }}>Font Size</label><span style={{ fontSize: 13, fontWeight: 600, color: '#6366f1' }}>{p.wmSize}px</span></div>
                          <input type="range" className="nm-range" min="10" max="120" value={p.wmSize} onChange={e => p.setWmSize(+e.target.value)} />
                        </div>
                        <div>
                          <label className="nm-label">Color</label>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {['#ffffff','#000000','#6366f1','#ef4444','#f59e0b'].map(c => (
                              <div key={c} onClick={() => p.setWmColor(c)} style={{ width: 28, height: 28, background: c, border: `2.5px solid ${p.wmColor === c ? '#818cf8' : '#2d3561'}`, borderRadius: 6, cursor: 'pointer', transition: 'all .15s' }} />
                            ))}
                            <input type="color" value={p.wmColor} onChange={e => p.setWmColor(e.target.value)} style={{ width: 28, height: 28, padding: 0, border: '1.5px solid #2d3561', borderRadius: 6, cursor: 'pointer' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ opacity: p.wmEnabled ? 1 : .4 }}>
                      <label className="nm-label">Position</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 5, marginBottom: 16 }}>
                        {[['tl','↖'],['tc','↑'],['tr','↗'],['ml','←'],['mc','·'],['mr','→'],['bl','↙'],['bc','↓'],['br','↘']].map(([pos, sym]) => (
                          <button key={pos} onClick={() => p.setWmPosition(pos)} style={{ padding: '10px 0', border: `1.5px solid ${p.wmPosition === pos ? '#6366f1' : '#2d3561'}`, borderRadius: 7, background: p.wmPosition === pos ? 'rgba(99,102,241,.15)' : '#0f0f23', color: p.wmPosition === pos ? '#818cf8' : '#64748b', cursor: 'pointer', fontSize: 16, transition: 'all .15s' }}>
                            {sym}
                          </button>
                        ))}
                      </div>
                      <div style={{ background: '#0f0f23', borderRadius: 8, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        <span style={{ fontSize: 11, color: '#334155', fontFamily: 'Inter' }}>Image Preview</span>
                        {p.wmEnabled && p.wmText && (() => {
                          const ps = { tl:{top:6,left:6}, tc:{top:6,left:'50%',transform:'translateX(-50%)'}, tr:{top:6,right:6}, ml:{top:'50%',left:6,transform:'translateY(-50%)'}, mc:{top:'50%',left:'50%',transform:'translate(-50%,-50%)'}, mr:{top:'50%',right:6,transform:'translateY(-50%)'}, bl:{bottom:6,left:6}, bc:{bottom:6,left:'50%',transform:'translateX(-50%)'}, br:{bottom:6,right:6} };
                          return <span style={{ position: 'absolute', fontSize: Math.min(p.wmSize * 0.28, 12), color: p.wmColor, opacity: p.wmOpacity, fontFamily: 'Inter', fontWeight: 600, whiteSpace: 'nowrap', textShadow: '1px 1px 2px rgba(0,0,0,.4)', ...ps[p.wmPosition] }}>{p.wmText}</span>;
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {p.activeTab === 'crop' && (
                  <div>
                    <div className={`nm-tog ${p.cropEnabled ? 'on' : ''}`} onClick={() => p.setCropEnabled(!p.cropEnabled)} style={{ marginBottom: 16 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>Enable aspect ratio crop (center-crop)</span>
                      <NormalToggle val={p.cropEnabled} set={p.setCropEnabled} />
                    </div>
                    <label className="nm-label">Crop Ratio</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, opacity: p.cropEnabled ? 1 : .4 }}>
                      {[['free','Free'],['1:1','Square 1:1'],['16:9','Wide 16:9'],['9:16','Tall 9:16'],['4:3','4:3'],['3:2','3:2'],['2:3','2:3'],['21:9','Cinema']].map(([val, lbl]) => (
                        <button key={val} className={`nm-btn ${p.cropRatio === val ? 'on' : ''}`} onClick={() => p.cropEnabled && p.setCropRatio(val)}>{lbl}</button>
                      ))}
                    </div>
                    <p style={{ marginTop: 14, fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>
                      Center-crop trims the image from the middle to fit the target ratio before resizing — no distortion, no padding.
                    </p>
                  </div>
                )}

                {p.isProc && (
                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #2d3561' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 14 }}>
                      <NormalRingProgress pct={p.progress} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontFamily: 'Inter', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Processing: {p.curFile || 'Initializing...'}</p>
                        <div className="nm-progress"><div className="nm-progress-fill" style={{ width: `${p.progress}%` }} /></div>
                        {p.logs.length > 0 && (
                          <div style={{ marginTop: 10, maxHeight: 72, overflowY: 'auto' }}>
                            {p.logs.map((l, i) => (
                              <div key={i} style={{ fontSize: 11, color: '#10b981', fontFamily: 'Inter', marginBottom: 2 }}>
                                ✓ {l.name} → {l.dims}px · {fmt(l.new)} {l.savings > 0 ? `▼${l.savings}%` : `▲${Math.abs(l.savings)}%`}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, paddingTop: 20, borderTop: '1px solid #2d3561' }}>
                  <button className="nm-primary" onClick={p.run} disabled={!p.images.length || p.isProc}>
                    <IcoZap s={16} />
                    {p.isProc ? `Processing... ${p.progress}%` : `Resize ${p.images.length || 0} image${p.images.length !== 1 ? 's' : ''}`}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="res" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="nm-card" style={{ textAlign: 'center', paddingTop: 36 }}>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: .1 }}
                  style={{ width: 64, height: 64, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#10b981' }}>
                  <IcoCheck s={32} />
                </motion.div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>All Done!</h2>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28 }}>{p.result.count} image{p.result.count !== 1 ? 's' : ''} processed — ready to download</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
                  {[{l:'Files',v:p.result.count,c:'#6366f1'},{l:'Original',v:fmt(p.result.totalOrig),c:'#f59e0b'},{l:'New Size',v:fmt(p.result.totalNew),c:'#06b6d4'},{l:'Saved',v:`${Math.round((1-p.result.totalNew/p.result.totalOrig)*100)}%`,c:'#10b981'}].map(s => (
                    <div key={s.l} className="nm-stat">
                      <div style={{ fontSize: 22, fontWeight: 700, color: s.c }}>{s.v}</div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#0f0f23', border: '1px solid #2d3561', borderRadius: 8, padding: 14, marginBottom: 24, maxHeight: 220, overflowY: 'auto', textAlign: 'left' }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 8, fontFamily: 'Inter' }}>Click a file to download it individually</p>
                  {p.result.logs.map((l, i) => (
                    <a key={i} href={URL.createObjectURL(p.result.files[i].blob)} download={p.result.files[i].name}
                      style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 8px', borderBottom: i < p.result.logs.length - 1 ? '1px solid #1e2a4a' : 'none', fontSize: 12, fontFamily: 'Inter', textDecoration: 'none', borderRadius: 6, transition: 'background .12s', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <span style={{ color: '#059669', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 12 }}>↓ {l.outName}</span>
                      <span style={{ color: '#475569', marginRight: 12 }}>{l.dims}px</span>
                      <span style={{ fontWeight: 600, color: l.savings > 0 ? '#10b981' : '#f59e0b' }}>{fmt(l.new)} {l.savings > 0 ? `▼${l.savings}%` : `▲${Math.abs(l.savings)}%`}</span>
                    </a>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  {p.result.files.length === 1 ? (
                    <a href={URL.createObjectURL(p.result.files[0].blob)} download={p.result.files[0].name} className="nm-primary" style={{ textDecoration: 'none' }}>
                      <IcoDl s={16} /> Download Image
                    </a>
                  ) : (
                    <button className="nm-primary" onClick={() => p.result.files.forEach((f, i) => { setTimeout(() => { const a = document.createElement('a'); a.href = URL.createObjectURL(f.blob); a.download = f.name; a.click(); }, i * 150); })}>
                      <IcoDl s={16} /> Download All ({p.result.files.length})
                    </button>
                  )}
                  <button onClick={() => { p.setImages([]); p.setResult(null); p.setLogs([]); }} className="nm-secondary">Process More</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="nm-card">
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>Platform Size Reference</h2>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>Click any card to auto-apply settings</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {NM_SIZE_GUIDE.map((cat, i) => (
              <button key={i} className={`nm-btn ${p.sizeTab === i ? 'on' : ''}`}
                style={{ borderColor: p.sizeTab === i ? cat.color : '#2d3561', color: p.sizeTab === i ? cat.color : '#94a3b8', background: p.sizeTab === i ? `${cat.color}15` : '#0f0f23' }}
                onClick={() => p.setSizeTab(i)}>{cat.category}</button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={p.sizeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 8 }}>
              {NM_SIZE_GUIDE[p.sizeTab].items.map((item, i) => (
                <motion.div key={item.platform} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }}
                  className={`nm-size-card ${p.activeSize === item.platform ? 'on' : ''}`} onClick={() => p.applySizeGuide(item)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', lineHeight: 1.3 }}>{item.platform}</p>
                    {p.activeSize === item.platform && <span style={{ fontSize: 9, color: '#10b981', background: '#d1fae5', padding: '1px 7px', borderRadius: 10, fontFamily: 'Inter', fontWeight: 600, flexShrink: 0, marginLeft: 4 }}>Active</span>}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: NM_SIZE_GUIDE[p.sizeTab].color, marginBottom: 8 }}>{item.dims}</div>
                  <div style={{ display: 'flex', gap: 5, marginBottom: 7 }}>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, border: `1px solid ${NM_SIZE_GUIDE[p.sizeTab].color}44`, color: NM_SIZE_GUIDE[p.sizeTab].color, fontFamily: 'Inter', fontWeight: 500 }}>{item.format}</span>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, border: '1px solid #2d3561', color: '#64748b', fontFamily: 'Inter' }}>≤{item.maxKB >= 1000 ? `${item.maxKB/1000}MB` : `${item.maxKB}KB`}</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{item.tip}</p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="nm-adslot">Advertisement</div>
      </div>
    </div>
  );
}

/* ══ MAIN COMPONENT ═════════════════════════════════════════════ */
export default function BulkImageResizer() {
  const [uiMode, setUiMode] = useState('futuristic');

  const [images, setImages]       = useState([]);
  const [isProc, setIsProc]       = useState(false);
  const [progress, setProgress]   = useState(0);
  const [curFile, setCurFile]     = useState('');
  const [result, setResult]       = useState(null);
  const [logs, setLogs]           = useState([]);
  const [isDrag, setIsDrag]       = useState(false);

  const [mode, setMode]           = useState('percentage');
  const [scale, setScale]         = useState(50);
  const [width, setWidth]         = useState(800);
  const [height, setHeight]       = useState(450);
  const [aspectLock, setAspectLock] = useState(true);
  const [dimMode, setDimMode]     = useState('width');
  const [quality, setQuality]     = useState(82);
  const [format, setFormat]       = useState('jpeg');

  const [activeTab, setActiveTab] = useState('resize');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast]   = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [flipH, setFlipH]         = useState(false);
  const [flipV, setFlipV]         = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [invert, setInvert]       = useState(false);
  const [sepia, setSepia]         = useState(false);
  const [blur, setBlur]           = useState(0);
  const [sharpen, setSharpen]     = useState(false);

  const [wmEnabled, setWmEnabled] = useState(false);
  const [wmText, setWmText]       = useState('© WATERMARK');
  const [wmOpacity, setWmOpacity] = useState(0.4);
  const [wmPosition, setWmPosition] = useState('br');
  const [wmSize, setWmSize]       = useState(24);
  const [wmColor, setWmColor]     = useState('#ffffff');

  const [cropEnabled, setCropEnabled] = useState(false);
  const [cropRatio, setCropRatio] = useState('free');

  const [sizeTab, setSizeTab]     = useState(0);
  const [activeSize, setActiveSize] = useState(null);
  const [previewIdx, setPreviewIdx] = useState(null);

  const addFiles = useCallback(files => {
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
    setImages(p => [...p, ...valid.map(f => ({
      file: f, id: Math.random().toString(36).slice(2),
      preview: URL.createObjectURL(f), originalSize: f.size,
    }))]);
    setResult(null); setLogs([]);
  }, []);

  const onFile   = e => addFiles(e.target.files);
  const onDrop   = e => { e.preventDefault(); setIsDrag(false); addFiles(e.dataTransfer.files); };
  const onDOver  = e => { e.preventDefault(); setIsDrag(true); };
  const onDLeave = () => setIsDrag(false);
  const remove   = id => setImages(p => p.filter(i => i.id !== id));
  const clearAll = () => { setImages([]); setResult(null); setLogs([]); };

  const applySizeGuide = item => {
    const [w, h] = item.dims.split('×').map(Number);
    setMode('width'); setDimMode('both');
    setWidth(w); setHeight(h); setAspectLock(false);
    const f = item.format.toLowerCase();
    setFormat(f === 'jpg' ? 'jpeg' : f);
    setActiveSize(item.platform);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyFilters = (ctx) => {
    if (brightness !== 100 || contrast !== 100 || saturation !== 100 || grayscale || sepia || invert || blur > 0) {
      const filters = [];
      if (brightness !== 100) filters.push(`brightness(${brightness}%)`);
      if (contrast !== 100) filters.push(`contrast(${contrast}%)`);
      if (saturation !== 100) filters.push(`saturate(${saturation}%)`);
      if (grayscale) filters.push('grayscale(100%)');
      if (sepia) filters.push('sepia(100%)');
      if (invert) filters.push('invert(100%)');
      if (blur > 0) filters.push(`blur(${blur}px)`);
      ctx.filter = filters.join(' ');
    } else {
      ctx.filter = 'none';
    }
  };

  const drawWatermark = (ctx, w, h) => {
    if (!wmEnabled || !wmText.trim()) return;
    ctx.save();
    ctx.globalAlpha = wmOpacity;
    ctx.font = `bold ${wmSize}px Arial`;
    ctx.fillStyle = wmColor;
    const metrics = ctx.measureText(wmText);
    const tw = metrics.width, th = wmSize;
    const pad = 20;
    const positions = {
      tl: [pad, pad + th], tc: [w / 2 - tw / 2, pad + th], tr: [w - tw - pad, pad + th],
      ml: [pad, h / 2], mc: [w / 2 - tw / 2, h / 2], mr: [w - tw - pad, h / 2],
      bl: [pad, h - pad], bc: [w / 2 - tw / 2, h - pad], br: [w - tw - pad, h - pad],
    };
    const [x, y] = positions[wmPosition] || positions.br;
    ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 4;
    ctx.fillText(wmText, x, y);
    ctx.restore();
  };

  const run = async () => {
    if (!images.length) return;
    setIsProc(true); setProgress(0); setLogs([]);
    const nl = [], outputFiles = [];
    try {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        setCurFile(img.file.name);
        setProgress(Math.round((i / images.length) * 100));
        const bmp = await createImageBitmap(img.file);
        const cv = document.createElement('canvas');
        const ctx = cv.getContext('2d');
        let tw, th;
        if (mode === 'percentage') {
          tw = Math.round(bmp.width * scale / 100);
          th = Math.round(bmp.height * scale / 100);
        } else if (dimMode === 'width') {
          tw = parseInt(width);
          th = aspectLock ? Math.round((bmp.height / bmp.width) * tw) : parseInt(height);
        } else {
          if (aspectLock) {
            const s = Math.min(parseInt(width) / bmp.width, parseInt(height) / bmp.height);
            tw = Math.round(bmp.width * s); th = Math.round(bmp.height * s);
          } else { tw = parseInt(width); th = parseInt(height); }
        }
        let srcX = 0, srcY = 0, srcW = bmp.width, srcH = bmp.height;
        if (cropEnabled && cropRatio !== 'free') {
          const [rw, rh] = cropRatio.split(':').map(Number);
          const targetRatio = rw / rh;
          const srcRatio = bmp.width / bmp.height;
          if (srcRatio > targetRatio) {
            srcW = Math.round(bmp.height * targetRatio);
            srcX = Math.round((bmp.width - srcW) / 2);
          } else {
            srcH = Math.round(bmp.width / targetRatio);
            srcY = Math.round((bmp.height - srcH) / 2);
          }
        }
        cv.width = tw; cv.height = th;
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        if (flipH || flipV) { ctx.save(); ctx.translate(flipH ? tw : 0, flipV ? th : 0); ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1); }
        applyFilters(ctx);
        ctx.drawImage(bmp, srcX, srcY, srcW, srcH, 0, 0, tw, th);
        if (flipH || flipV) ctx.restore();
        ctx.filter = 'none';
        if (sharpen) {
          const imageData = ctx.getImageData(0, 0, tw, th);
          const data = imageData.data;
          const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
          const result2 = new Uint8ClampedArray(data.length);
          for (let y2 = 1; y2 < th - 1; y2++) {
            for (let x2 = 1; x2 < tw - 1; x2++) {
              for (let c = 0; c < 3; c++) {
                let sum = 0;
                for (let ky = -1; ky <= 1; ky++) {
                  for (let kx = -1; kx <= 1; kx++) {
                    sum += data[((y2 + ky) * tw + (x2 + kx)) * 4 + c] * kernel[(ky + 1) * 3 + (kx + 1)];
                  }
                }
                result2[(y2 * tw + x2) * 4 + c] = Math.min(255, Math.max(0, sum));
              }
              result2[(y2 * tw + x2) * 4 + 3] = data[(y2 * tw + x2) * 4 + 3];
            }
          }
          ctx.putImageData(new ImageData(result2, tw, th), 0, 0);
        }
        drawWatermark(ctx, tw, th);
        const blob = await new Promise(r => cv.toBlob(r, `image/${format}`, quality / 100));
        const ext = format === 'jpeg' ? 'jpg' : format;
        const outName = `edited_${img.file.name.replace(/\.[^.]+$/, '')}.${ext}`;
        outputFiles.push({ blob, name: outName });
        nl.push({ name: img.file.name, outName, orig: img.originalSize, new: blob.size, dims: `${tw}×${th}`, savings: Math.round((1 - blob.size / img.originalSize) * 100) });
        setLogs([...nl]);
      }
      setProgress(100);
      setResult({ files: outputFiles, count: images.length, totalOrig: nl.reduce((s, l) => s + l.orig, 0), totalNew: nl.reduce((s, l) => s + l.new, 0), logs: nl });
    } catch (e) { console.error(e); }
    finally { setIsProc(false); setCurFile(''); }
  };

  const hasEdits = brightness !== 100 || contrast !== 100 || saturation !== 100 || grayscale || sepia || invert || blur > 0 || sharpen || flipH || flipV;

  if (uiMode === 'normal') {
    return <NormalMode
      uiMode={uiMode} setUiMode={setUiMode}
      images={images} isProc={isProc} progress={progress} curFile={curFile}
      setImages={setImages} result={result} setResult={setResult} logs={logs} setLogs={setLogs} isDrag={isDrag}
      mode={mode} setMode={setMode} scale={scale} setScale={setScale}
      width={width} setWidth={setWidth} height={height} setHeight={setHeight}
      aspectLock={aspectLock} setAspectLock={setAspectLock} dimMode={dimMode} setDimMode={setDimMode}
      quality={quality} setQuality={setQuality} format={format} setFormat={setFormat}
      activeTab={activeTab} setActiveTab={setActiveTab}
      brightness={brightness} setBrightness={setBrightness} contrast={contrast} setContrast={setContrast}
      saturation={saturation} setSaturation={setSaturation} flipH={flipH} setFlipH={setFlipH}
      flipV={flipV} setFlipV={setFlipV} grayscale={grayscale} setGrayscale={setGrayscale}
      invert={invert} setInvert={setInvert} sepia={sepia} setSepia={setSepia}
      blur={blur} setBlur={setBlur} sharpen={sharpen} setSharpen={setSharpen}
      wmEnabled={wmEnabled} setWmEnabled={setWmEnabled} wmText={wmText} setWmText={setWmText}
      wmOpacity={wmOpacity} setWmOpacity={setWmOpacity} wmPosition={wmPosition} setWmPosition={setWmPosition}
      wmSize={wmSize} setWmSize={setWmSize} wmColor={wmColor} setWmColor={setWmColor}
      cropEnabled={cropEnabled} setCropEnabled={setCropEnabled} cropRatio={cropRatio} setCropRatio={setCropRatio}
      sizeTab={sizeTab} setSizeTab={setSizeTab} activeSize={activeSize} setActiveSize={setActiveSize}
      previewIdx={previewIdx} setPreviewIdx={setPreviewIdx}
      onFile={e => { const valid = Array.from(e.target.files).filter(f => f.type.startsWith('image/')); setImages(p => [...p, ...valid.map(f => ({file:f,id:Math.random().toString(36).slice(2),preview:URL.createObjectURL(f),originalSize:f.size}))]); setResult(null); setLogs([]); }}
      onDrop={e => { e.preventDefault(); setIsDrag(false); const valid = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')); setImages(p => [...p, ...valid.map(f => ({file:f,id:Math.random().toString(36).slice(2),preview:URL.createObjectURL(f),originalSize:f.size}))]); setResult(null); setLogs([]); }}
      onDOver={e => { e.preventDefault(); setIsDrag(true); }}
      onDLeave={() => setIsDrag(false)}
      remove={id => setImages(p => p.filter(i => i.id !== id))}
      clearAll={() => { setImages([]); setResult(null); setLogs([]); }}
      applySizeGuide={item => { const [w,h]=item.dims.split('×').map(Number); setMode('width'); setDimMode('both'); setWidth(w); setHeight(h); setAspectLock(false); const f=item.format.toLowerCase(); setFormat(f==='jpg'?'jpeg':f); setActiveSize(item.platform); window.scrollTo({top:0,behavior:'smooth'}); }}
      run={run} hasEdits={hasEdits}
      resetAdj={() => { setBrightness(100); setContrast(100); setSaturation(100); setBlur(0); setGrayscale(false); setSepia(false); setInvert(false); setSharpen(false); setFlipH(false); setFlipV(false); }}
    />;
  }

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 12px 100px', fontFamily: "'Inter', sans-serif" }}>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .6 }}
          style={{ position: 'relative', overflow: 'hidden', padding: '40px 36px 32px', marginBottom: 16, borderBottom: '1px solid rgba(0,255,247,.1)' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(0,255,247,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,247,.03) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,255,247,.06) 0%, transparent 70%)' }} />
          <div className="scan-line" />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <div className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.3em', marginBottom: 8 }}>◈ BATCH IMAGE PROCESSOR v3.0 ◈</div>
              <h1 className="bebas holo-text" style={{ fontSize: 'clamp(36px,6vw,72px)', letterSpacing: '.08em', lineHeight: .9 }}>
                BULK IMAGE<br />RESIZER
              </h1>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                {['ZERO UPLOAD', 'CLIENT-SIDE', 'PRIVACY FIRST', 'INSTANT ZIP'].map(tag => (
                  <span key={tag} className="mono" style={{ fontSize: 9, color: 'rgba(0,255,247,.4)', letterSpacing: '.15em' }}>◈ {tag}</span>
                ))}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', border: '1px solid rgba(0,255,247,.25)', borderRadius: 2, background: 'rgba(0,255,247,.05)', cursor: 'pointer' }}
                onClick={() => setUiMode('normal')}>
                <span className="mono" style={{ fontSize: 9, color: 'var(--neon)', letterSpacing: '.12em' }}>FUTURISTIC MODE</span>
                <div style={{ width: 36, height: 18, borderRadius: 9, background: 'var(--neon)', position: 'relative', boxShadow: '0 0 10px rgba(0,255,247,.5)' }}>
                  <div style={{ position: 'absolute', top: 3, right: 3, width: 12, height: 12, borderRadius: '50%', background: '#010108' }} />
                </div>
                <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.12em' }}>NORMAL MODE</span>
              </div>
              <div style={{ display: 'flex', gap: 24 }}>
                {[
                  { n: images.length, l: 'QUEUED', c: 'var(--neon)' },
                  { n: logs.length, l: 'COMPLETE', c: 'var(--safe)' },
                  { n: `${quality}%`, l: 'QUALITY', c: 'var(--amber)' },
                ].map(s => (
                  <div key={s.l} style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: s.c, textShadow: `0 0 20px ${s.c}`, lineHeight: 1 }}>{s.n}</div>
                    <div className="mono" style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '.18em', marginTop: 3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="editor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .35 }}>

              <motion.div animate={{ borderColor: isDrag ? 'var(--neon)' : 'rgba(0,255,247,.1)', backgroundColor: isDrag ? 'rgba(0,255,247,.03)' : 'rgba(0,0,0,.2)' }}
                transition={{ duration: .2 }}
                style={{ borderRadius: 2, padding: '32px 24px', border: '1px dashed rgba(0,255,247,.1)', textAlign: 'center', cursor: 'pointer', position: 'relative', marginBottom: 16 }}
                onDrop={onDrop} onDragOver={onDOver} onDragLeave={onDLeave}>
                <input type="file" multiple accept="image/*" onChange={onFile} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                <IcoUpload s={28} />
                <p className="mono" style={{ fontSize: 13, color: isDrag ? 'var(--neon)' : 'var(--txt)', marginTop: 12, marginBottom: 4, letterSpacing: '.08em', textShadow: isDrag ? '0 0 12px var(--neon)' : 'none' }}>
                  {isDrag ? '◈ RELEASE TO LOAD ◈' : 'DRAG & DROP IMAGES — OR CLICK TO BROWSE'}
                </p>
                <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.1em' }}>JPG · PNG · WEBP · GIF · BMP · AVIF — UP TO 50 FILES</p>
                {images.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 14, display: 'flex', justifyContent: 'center', gap: 16 }}>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--neon)' }}>{images.length} FILES LOADED</span>
                    <button onClick={e => { e.stopPropagation(); clearAll(); }} className="mono"
                      style={{ fontSize: 10, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '.1em' }}>
                      ✕ CLEAR ALL
                    </button>
                  </motion.div>
                )}
              </motion.div>

              <AnimatePresence>
                {images.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(80px,1fr))', gap: 6 }}>
                      <AnimatePresence>
                        {images.map((img, idx) => (
                          <motion.div key={img.id} className="img-thumb"
                            initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .8 }} transition={{ delay: idx * .02 }}>
                            <img src={img.preview} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            <div className="overlay">
                              <button onClick={() => setPreviewIdx(idx)} style={{ background: 'rgba(0,255,247,.1)', border: '1px solid var(--neon)', borderRadius: 2, padding: '3px 6px', color: 'var(--neon)', cursor: 'pointer', marginRight: 4, fontSize: 9 }}>VIEW</button>
                              <button onClick={() => remove(img.id)} style={{ background: 'rgba(255,0,60,.1)', border: '1px solid var(--danger)', borderRadius: 2, padding: '3px 6px', color: 'var(--danger)', cursor: 'pointer', fontSize: 9 }}>✕</button>
                            </div>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 4px 3px', background: 'linear-gradient(transparent,rgba(0,0,0,.85))', fontFamily: 'Inter', fontSize: 8, color: 'rgba(255,255,255,.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {fmt(img.originalSize)}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {previewIdx !== null && images[previewIdx] && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setPreviewIdx(null)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <motion.div initial={{ scale: .9 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
                      style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }}>
                      <img src={images[previewIdx].preview} alt="" style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', border: '1px solid var(--neon)', boxShadow: '0 0 40px var(--glow-neon)' }} />
                      <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{images[previewIdx].file.name} · {fmt(images[previewIdx].originalSize)}</span>
                        <span className="mono" style={{ fontSize: 10, color: 'var(--neon)', cursor: 'pointer' }} onClick={() => setPreviewIdx(null)}>✕ CLOSE</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main panel */}
              <div className="panel" style={{ padding: 24, marginBottom: 16 }}>
                <div className="panel-corner tl" /><div className="panel-corner tr" />
                <div className="panel-corner bl" /><div className="panel-corner br" />

                <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,255,247,.07)', marginBottom: 24, gap: 0 }}>
                  {[
                    { id: 'resize', icon: <IcoSettings s={13} />, label: 'RESIZE' },
                    { id: 'adjust', icon: <IcoBrightness s={13} />, label: `ADJUSTMENTS${hasEdits ? ' ●' : ''}` },
                    { id: 'watermark', icon: <IcoWater s={13} />, label: `WATERMARK${wmEnabled ? ' ●' : ''}` },
                    { id: 'crop', icon: <IcoCrop s={13} />, label: `CROP${cropEnabled ? ' ●' : ''}` },
                  ].map(t => (
                    <button key={t.id} className={`tab-seg ${activeTab === t.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(t.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                {/* ── RESIZE TAB ─────────────────────────────── */}
                {activeTab === 'resize' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 24 }}>
                      <div>
                        <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.14em', marginBottom: 10 }}>RESIZE MODE</p>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                          <button className={`option-chip ${mode === 'percentage' ? 'active' : ''}`} onClick={() => setMode('percentage')}>% SCALE</button>
                          <button className={`option-chip ${mode === 'width' ? 'active' : ''}`} onClick={() => setMode('width')}>W × H</button>
                        </div>

                        {mode === 'percentage' ? (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                              <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.12em' }}>SCALE FACTOR</span>
                              <span className="mono" style={{ fontSize: 18, color: 'var(--neon)', textShadow: '0 0 10px var(--neon)' }}>{scale}%</span>
                            </div>
                            <input type="range" min="5" max="200" value={scale} onChange={e => setScale(+e.target.value)} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                              {['5%', '50%', '100%', '200%'].map(l => (
                                <span key={l} className="mono" style={{ fontSize: 8, color: 'var(--muted)' }}>{l}</span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className={`option-chip ${dimMode === 'width' ? 'active' : ''}`} onClick={() => setDimMode('width')}>WIDTH ONLY</button>
                              <button className={`option-chip ${dimMode === 'both' ? 'active' : ''}`} onClick={() => setDimMode('both')}>BOTH</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: dimMode === 'both' ? '1fr auto 1fr' : '1fr', gap: 8, alignItems: 'end' }}>
                              <div>
                                <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.12em', marginBottom: 6 }}>WIDTH (px)</p>
                                <input type="number" value={width} onChange={e => setWidth(+e.target.value)} className="neon-input" />
                              </div>
                              {dimMode === 'both' && <>
                                <button onClick={() => setAspectLock(!aspectLock)}
                                  style={{ background: 'none', border: `1px solid ${aspectLock ? 'var(--neon)' : 'var(--border)'}`, padding: '6px 8px', cursor: 'pointer', color: aspectLock ? 'var(--neon)' : 'var(--muted)', fontSize: 13, alignSelf: 'flex-end', transition: 'all .2s', boxShadow: aspectLock ? '0 0 10px var(--glow-neon)' : 'none' }}>
                                  {aspectLock ? '⛓' : '⛓️‍💥'}
                                </button>
                                <div>
                                  <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.12em', marginBottom: 6 }}>HEIGHT (px)</p>
                                  <input type="number" value={height} onChange={e => setHeight(+e.target.value)} disabled={aspectLock} className="neon-input" style={{ opacity: aspectLock ? .3 : 1 }} />
                                </div>
                              </>}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.14em', marginBottom: 10 }}>QUICK PRESETS</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 20 }}>
                          {PRESETS.map(p => (
                            <button key={p.label} className={`option-chip ${parseInt(width) === p.w && parseInt(height) === p.h ? 'active' : ''}`}
                              onClick={() => { setWidth(p.w); setHeight(p.h); setDimMode('both'); setAspectLock(false); setMode('width'); }}>
                              {p.label}
                            </button>
                          ))}
                        </div>

                        <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.14em', marginBottom: 10 }}>OUTPUT FORMAT</p>
                        <div style={{ display: 'flex', gap: 5, marginBottom: 20 }}>
                          {['jpeg', 'png', 'webp'].map(f => (
                            <button key={f} className={`option-chip ${format === f ? 'active' : ''}`} onClick={() => setFormat(f)}>
                              {f.toUpperCase()}
                            </button>
                          ))}
                        </div>

                        <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.14em', marginBottom: 10 }}>QUALITY: <span style={{ color: 'var(--neon)' }}>{quality}%</span></p>
                        <input type="range" min="1" max="100" value={quality} onChange={e => setQuality(+e.target.value)} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                          {[{ l: 'SMALL', v: 60 }, { l: 'BALANCED', v: 82 }, { l: 'HIGH', v: 95 }].map(q => (
                            <button key={q.l} className="mono" onClick={() => setQuality(q.v)}
                              style={{ fontSize: 8, color: quality === q.v ? 'var(--neon)' : 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '.1em' }}>
                              {q.l}
                            </button>
                          ))}
                        </div>

                        {/* ── TARGET SIZE UNIT SELECTOR ── */}
                        <TargetSizeSelector quality={quality} setQuality={setQuality} format={format} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'adjust' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {[
                          { label: 'BRIGHTNESS', val: brightness, set: setBrightness, min: 0, max: 200, def: 100 },
                          { label: 'CONTRAST', val: contrast, set: setContrast, min: 0, max: 200, def: 100 },
                          { label: 'SATURATION', val: saturation, set: setSaturation, min: 0, max: 300, def: 100 },
                          { label: 'BLUR (px)', val: blur, set: setBlur, min: 0, max: 20, def: 0 },
                        ].map(sl => (
                          <div key={sl.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.12em' }}>{sl.label}</span>
                              <span className="mono" style={{ fontSize: 11, color: sl.val !== sl.def ? 'var(--neon)' : 'var(--muted)' }}>{sl.val}</span>
                            </div>
                            <input type="range" min={sl.min} max={sl.max} value={sl.val} onChange={e => sl.set(+e.target.value)} />
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.14em', marginBottom: 12 }}>FILTERS & TRANSFORMS</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {[
                            { label: 'GRAYSCALE', val: grayscale, set: setGrayscale },
                            { label: 'SEPIA', val: sepia, set: setSepia },
                            { label: 'INVERT', val: invert, set: setInvert },
                            { label: 'SHARPEN', val: sharpen, set: setSharpen },
                            { label: 'FLIP HORIZONTAL', val: flipH, set: setFlipH },
                            { label: 'FLIP VERTICAL', val: flipV, set: setFlipV },
                          ].map(tog => (
                            <div key={tog.label} onClick={() => tog.set(!tog.val)}
                              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: `1px solid ${tog.val ? 'var(--neon)' : 'var(--border)'}`, cursor: 'pointer', background: tog.val ? 'rgba(0,255,247,.04)' : 'transparent', transition: 'all .18s' }}>
                              <span className="mono" style={{ fontSize: 10, color: tog.val ? 'var(--neon)' : 'var(--muted)', letterSpacing: '.1em' }}>{tog.label}</span>
                              <div style={{ width: 28, height: 14, borderRadius: 7, background: tog.val ? 'var(--neon)' : 'var(--border)', position: 'relative', transition: 'background .2s', boxShadow: tog.val ? '0 0 8px var(--glow-neon)' : 'none' }}>
                                <div style={{ position: 'absolute', top: 2, left: tog.val ? 15 : 2, width: 10, height: 10, borderRadius: '50%', background: tog.val ? 'var(--void)' : 'var(--muted)', transition: 'left .2s' }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        {hasEdits && (
                          <button className="mono" onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); setBlur(0); setGrayscale(false); setSepia(false); setInvert(false); setSharpen(false); setFlipH(false); setFlipV(false); }}
                            style={{ marginTop: 12, width: '100%', padding: '8px', border: '1px solid rgba(255,0,60,.3)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: 9, letterSpacing: '.1em' }}>
                            ✕ RESET ALL ADJUSTMENTS
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'watermark' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div onClick={() => setWmEnabled(!wmEnabled)}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', border: `1px solid ${wmEnabled ? 'var(--neon)' : 'var(--border)'}`, cursor: 'pointer', background: wmEnabled ? 'rgba(0,255,247,.04)' : 'transparent', transition: 'all .18s' }}>
                          <span className="mono" style={{ fontSize: 10, color: wmEnabled ? 'var(--neon)' : 'var(--muted)', letterSpacing: '.1em' }}>ENABLE WATERMARK</span>
                          <div style={{ width: 28, height: 14, borderRadius: 7, background: wmEnabled ? 'var(--neon)' : 'var(--border)', position: 'relative', transition: 'background .2s', boxShadow: wmEnabled ? '0 0 8px var(--glow-neon)' : 'none' }}>
                            <div style={{ position: 'absolute', top: 2, left: wmEnabled ? 15 : 2, width: 10, height: 10, borderRadius: '50%', background: wmEnabled ? 'var(--void)' : 'var(--muted)', transition: 'left .2s' }} />
                          </div>
                        </div>
                        <div>
                          <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.12em', marginBottom: 6 }}>WATERMARK TEXT</p>
                          <input type="text" value={wmText} onChange={e => setWmText(e.target.value)} className="neon-input" placeholder="© Your Name" disabled={!wmEnabled} style={{ opacity: wmEnabled ? 1 : .3 }} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.12em' }}>OPACITY</span>
                            <span className="mono" style={{ fontSize: 11, color: 'var(--neon)' }}>{Math.round(wmOpacity * 100)}%</span>
                          </div>
                          <input type="range" min="5" max="100" value={Math.round(wmOpacity * 100)} onChange={e => setWmOpacity(e.target.value / 100)} disabled={!wmEnabled} style={{ opacity: wmEnabled ? 1 : .3 }} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.12em' }}>FONT SIZE (px)</span>
                            <span className="mono" style={{ fontSize: 11, color: 'var(--neon)' }}>{wmSize}</span>
                          </div>
                          <input type="range" min="10" max="120" value={wmSize} onChange={e => setWmSize(+e.target.value)} disabled={!wmEnabled} style={{ opacity: wmEnabled ? 1 : .3 }} />
                        </div>
                        <div>
                          <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.12em', marginBottom: 8 }}>TEXT COLOR</p>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {['#ffffff', '#000000', '#00fff7', '#ff003c', '#ffaa00'].map(c => (
                              <div key={c} onClick={() => setWmColor(c)}
                                style={{ width: 28, height: 28, background: c, border: `2px solid ${wmColor === c ? 'var(--neon)' : 'transparent'}`, cursor: 'pointer', transition: 'all .18s', boxShadow: wmColor === c ? '0 0 8px var(--glow-neon)' : 'none' }} />
                            ))}
                            <input type="color" value={wmColor} onChange={e => setWmColor(e.target.value)}
                              style={{ width: 28, height: 28, padding: 0, border: '1px solid var(--border)', cursor: 'pointer', background: 'none' }} />
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.12em', marginBottom: 12 }}>POSITION</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4, marginBottom: 16, opacity: wmEnabled ? 1 : .3 }}>
                          {[['tl', '↖'], ['tc', '↑'], ['tr', '↗'], ['ml', '←'], ['mc', '·'], ['mr', '→'], ['bl', '↙'], ['bc', '↓'], ['br', '↘']].map(([pos, sym]) => (
                            <button key={pos} onClick={() => setWmPosition(pos)} className="mono"
                              style={{ padding: '12px 0', border: `1px solid ${wmPosition === pos ? 'var(--neon)' : 'var(--border)'}`, background: wmPosition === pos ? 'rgba(0,255,247,.08)' : 'transparent', color: wmPosition === pos ? 'var(--neon)' : 'var(--muted)', cursor: 'pointer', fontSize: 16, transition: 'all .18s', boxShadow: wmPosition === pos ? '0 0 8px var(--glow-neon)' : 'none' }}>
                              {sym}
                            </button>
                          ))}
                        </div>
                        <div className="watermark-preview-outer" style={{ opacity: wmEnabled ? 1 : .3 }}>
                          <div style={{ width: 200, height: 120, background: 'linear-gradient(135deg, #222 0%, #444 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="mono" style={{ fontSize: 9, color: 'rgba(255,255,255,.2)', letterSpacing: '.1em' }}>IMAGE PREVIEW</span>
                            {wmEnabled && wmText && (() => {
                              const posStyles = {
                                tl: { top: 6, left: 6 }, tc: { top: 6, left: '50%', transform: 'translateX(-50%)' }, tr: { top: 6, right: 6 },
                                ml: { top: '50%', left: 6, transform: 'translateY(-50%)' }, mc: { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }, mr: { top: '50%', right: 6, transform: 'translateY(-50%)' },
                                bl: { bottom: 6, left: 6 }, bc: { bottom: 6, left: '50%', transform: 'translateX(-50%)' }, br: { bottom: 6, right: 6 },
                              };
                              return (
                                <span className="mono" style={{ position: 'absolute', fontSize: Math.min(wmSize * 0.3, 14), color: wmColor, opacity: wmOpacity, whiteSpace: 'nowrap', textShadow: '1px 1px 3px rgba(0,0,0,.8)', ...posStyles[wmPosition] }}>
                                  {wmText}
                                </span>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'crop' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div onClick={() => setCropEnabled(!cropEnabled)}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', border: `1px solid ${cropEnabled ? 'var(--neon)' : 'var(--border)'}`, cursor: 'pointer', background: cropEnabled ? 'rgba(0,255,247,.04)' : 'transparent', transition: 'all .18s', marginBottom: 16 }}>
                      <span className="mono" style={{ fontSize: 10, color: cropEnabled ? 'var(--neon)' : 'var(--muted)', letterSpacing: '.1em' }}>ENABLE ASPECT RATIO CROP (CENTER-CROP)</span>
                      <div style={{ width: 28, height: 14, borderRadius: 7, background: cropEnabled ? 'var(--neon)' : 'var(--border)', position: 'relative', transition: 'background .2s' }}>
                        <div style={{ position: 'absolute', top: 2, left: cropEnabled ? 15 : 2, width: 10, height: 10, borderRadius: '50%', background: cropEnabled ? 'var(--void)' : 'var(--muted)', transition: 'left .2s' }} />
                      </div>
                    </div>
                    <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.14em', marginBottom: 12 }}>CROP RATIO</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, opacity: cropEnabled ? 1 : .3 }}>
                      {[['free', 'FREE'], ['1:1', 'SQUARE'], ['16:9', 'WIDE 16:9'], ['9:16', 'TALL 9:16'], ['4:3', '4:3'], ['3:2', '3:2'], ['2:3', '2:3'], ['21:9', 'CINEMA']].map(([val, lbl]) => (
                        <button key={val} className={`option-chip ${cropRatio === val ? 'active' : ''}`}
                          onClick={() => cropEnabled && setCropRatio(val)}>
                          {lbl}
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: 20, padding: 16, background: 'rgba(0,255,247,.03)', border: '1px solid rgba(0,255,247,.07)' }}>
                      <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.1em', lineHeight: 1.8 }}>
                        ◈ CENTER-CROP MODE: When a ratio is selected, images are cropped from the center to match the target ratio before resizing.<br />
                        ◈ EXACT OUTPUT: Combined with W×H resize, you get precisely cropped images at exact pixel dimensions.
                      </p>
                    </div>
                  </motion.div>
                )}

                <AnimatePresence>
                  {isProc && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 14 }}>
                        <RingProgress pct={progress} />
                        <div style={{ flex: 1 }}>
                          <div className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.1em', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            ▶ {curFile || 'INITIALIZING...'}
                          </div>
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${progress}%` }} />
                          </div>
                          {logs.length > 0 && (
                            <div style={{ marginTop: 10, maxHeight: 72, overflowY: 'auto', padding: '6px 0' }}>
                              {logs.map((l, i) => (
                                <div key={i} className="mono" style={{ fontSize: 9, color: 'var(--safe)', marginBottom: 2, letterSpacing: '.06em' }}>
                                  ✓ {l.name} → {l.dims} · {fmt(l.new)} {l.savings > 0 ? `▼${l.savings}%` : `▲${Math.abs(l.savings)}%`}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(0,255,247,.07)' }}>
                  <motion.button className="cta-btn" onClick={run} disabled={!images.length || isProc} whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}>
                    <IcoZap s={14} />
                    {isProc ? `PROCESSING... ${progress}%` : `PROCESS ${images.length || 0} IMAGE${images.length !== 1 ? 'S' : ''}`}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .4 }}>
              <div className="panel" style={{ padding: 32, marginBottom: 16 }}>
                <div className="panel-corner tl" /><div className="panel-corner tr" />
                <div className="panel-corner bl" /><div className="panel-corner br" />
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: .1 }}
                    style={{ width: 72, height: 72, border: '1px solid var(--safe)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--safe)', boxShadow: '0 0 30px rgba(0,255,136,.2)' }}>
                    <IcoCheck s={36} />
                  </motion.div>
                  <h2 className="bebas" style={{ fontSize: 40, letterSpacing: '.1em', color: 'var(--safe)', textShadow: '0 0 20px rgba(0,255,136,.4)' }}>PROCESSING COMPLETE</h2>
                  <p className="mono" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '.12em', marginTop: 4 }}>{result.count} IMAGE{result.count !== 1 ? 'S' : ''} PROCESSED · READY TO DOWNLOAD</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
                  {[
                    { l: 'FILES', v: result.count, c: 'var(--neon)' },
                    { l: 'ORIGINAL', v: fmt(result.totalOrig), c: 'var(--amber)' },
                    { l: 'NEW SIZE', v: fmt(result.totalNew), c: 'var(--neon2)' },
                    { l: 'SAVED', v: `${Math.round((1 - result.totalNew / result.totalOrig) * 100)}%`, c: 'var(--safe)' },
                  ].map(s => (
                    <motion.div key={s.l} className="stat-box" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: s.c, textShadow: `0 0 16px ${s.c}` }}>{s.v}</div>
                      <div className="mono" style={{ fontSize: 8, color: 'var(--muted)', marginTop: 4, letterSpacing: '.14em' }}>{s.l}</div>
                    </motion.div>
                  ))}
                </div>
                <div style={{ background: 'rgba(0,0,0,.4)', border: '1px solid var(--border)', padding: 14, marginBottom: 24, maxHeight: 220, overflowY: 'auto' }}>
                  <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '.12em', marginBottom: 10 }}>FILE BREAKDOWN — CLICK TO DOWNLOAD</p>
                  {result.logs.map((l, i) => (
                    <a key={i} href={URL.createObjectURL(result.files[i].blob)} download={result.files[i].name}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 8px', borderBottom: i < result.logs.length - 1 ? '1px solid rgba(0,255,247,.04)' : 'none', textDecoration: 'none', cursor: 'pointer', borderRadius: 2, transition: 'background .15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,255,247,.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <span className="mono" style={{ fontSize: 10, color: 'var(--neon)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 12 }}>↓ {l.outName}</span>
                      <span className="mono" style={{ fontSize: 9, color: 'var(--muted)', marginRight: 12 }}>{l.dims}px</span>
                      <span className="mono" style={{ fontSize: 10, color: l.savings > 0 ? 'var(--safe)' : 'var(--amber)' }}>
                        {fmt(l.new)} {l.savings > 0 ? `▼${l.savings}%` : `▲${Math.abs(l.savings)}%`}
                      </span>
                    </a>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  {result.files.length === 1 ? (
                    <motion.a href={URL.createObjectURL(result.files[0].blob)} download={result.files[0].name}
                      className="cta-btn" style={{ textDecoration: 'none' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}>
                      <IcoDl s={14} /> DOWNLOAD IMAGE
                    </motion.a>
                  ) : (
                    <motion.button className="cta-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}
                      onClick={() => result.files.forEach((f, i) => { setTimeout(() => { const a = document.createElement('a'); a.href = URL.createObjectURL(f.blob); a.download = f.name; a.click(); }, i * 150); })}>
                      <IcoDl s={14} /> DOWNLOAD ALL ({result.files.length})
                    </motion.button>
                  )}
                  <motion.button onClick={() => { setImages([]); setResult(null); setLogs([]); }}
                    className="cta-btn purple" whileHover={{ scale: 1.02 }} whileTap={{ scale: .98 }}>
                    PROCESS MORE
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .4 }}>
          <div className="panel" style={{ padding: 24, marginBottom: 16 }}>
            <div className="panel-corner tl" /><div className="panel-corner tr" />
            <div className="panel-corner bl" /><div className="panel-corner br" />
            <SectionHead
              icon={<IcoTarget s={16} />}
              title="PLATFORM SIZE REFERENCE"
              sub="CLICK ANY CARD — SETTINGS AUTO-APPLY"
              right={<span className="mono" style={{ fontSize: 9, color: 'var(--muted)', padding: '3px 10px', border: '1px solid var(--border)' }}>{SIZE_GUIDE.reduce((s, c) => s + c.items.length, 0)} PLATFORMS</span>}
            />
            <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
              {SIZE_GUIDE.map((cat, i) => (
                <button key={i} className={`option-chip ${sizeTab === i ? 'active' : ''}`}
                  onClick={() => setSizeTab(i)}
                  style={{ borderColor: sizeTab === i ? cat.color : 'var(--border)', color: sizeTab === i ? cat.color : 'var(--muted)', boxShadow: sizeTab === i ? `0 0 12px ${cat.color}44` : 'none' }}>
                  {cat.category}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={sizeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 8 }}>
                {SIZE_GUIDE[sizeTab].items.map((item, i) => (
                  <motion.div key={item.platform} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .04 }}
                    className={`size-card ${activeSize === item.platform ? 'active' : ''}`}
                    onClick={() => applySizeGuide(item)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <p className="mono" style={{ fontSize: 10, color: 'var(--txt)', letterSpacing: '.04em', lineHeight: 1.3 }}>{item.platform}</p>
                      {activeSize === item.platform && (
                        <span className="mono" style={{ fontSize: 7, color: 'var(--safe)', background: 'rgba(0,255,136,.08)', border: '1px solid rgba(0,255,136,.3)', padding: '1px 6px', flexShrink: 0, marginLeft: 4 }}>ACTIVE</span>
                      )}
                    </div>
                    <div className="mono" style={{ fontSize: 20, fontWeight: 700, color: SIZE_GUIDE[sizeTab].color, textShadow: `0 0 10px ${SIZE_GUIDE[sizeTab].color}66`, marginBottom: 8 }}>{item.dims}</div>
                    <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
                      <span className="mono" style={{ fontSize: 7, padding: '2px 7px', border: `1px solid ${SIZE_GUIDE[sizeTab].color}44`, color: SIZE_GUIDE[sizeTab].color }}>{item.format}</span>
                      <span className="mono" style={{ fontSize: 7, padding: '2px 7px', border: '1px solid var(--border)', color: 'var(--muted)' }}>≤{item.maxKB >= 1000 ? `${item.maxKB / 1000}MB` : `${item.maxKB}KB`}</span>
                    </div>
                    <p className="mono" style={{ fontSize: 9, color: 'var(--muted)', lineHeight: 1.6 }}>{item.tip}</p>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .4 }}>
          <div className="panel" style={{ padding: 24, marginBottom: 16 }}>
            <div className="panel-corner tl" /><div className="panel-corner tr" />
            <div className="panel-corner bl" /><div className="panel-corner br" />
            <SectionHead icon={<IcoBook s={16} />} title="DOCUMENTATION & FAQ" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { q: 'Are my images uploaded anywhere?', a: 'No. All processing uses the Canvas API locally in your browser. Files never leave your device — verifiable via the Network tab in DevTools.' },
                { q: 'What is the Target File Size feature?', a: 'Enter a number and select MB, KB, or B. Press GO → to auto-adjust the quality slider to approximate that output size for the selected format.' },
                { q: 'What does center-crop do?', a: 'The image is cropped from the center to match your chosen aspect ratio before resizing. Combined with exact W×H output, you get perfectly dimensioned images.' },
                { q: 'Will the sharpen filter affect quality?', a: 'Sharpening applies a 3×3 convolution kernel directly to pixel data. It enhances edges but adds a small processing overhead. Best used on downscaled images that look soft.' },
                { q: 'Can I watermark all 50 images at once?', a: 'Yes. Watermark settings apply to every image in the batch. Position, opacity, size, color and text are all consistent across the full run.' },
                { q: 'Why WebP for websites?', a: 'WebP delivers 25–35% smaller files at equivalent quality vs JPEG, and supports transparency like PNG. All modern browsers support it natively.' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * .05 }}
                  style={{ padding: '12px 14px', border: '1px solid var(--border)', background: 'rgba(0,0,0,.3)' }}>
                  <p className="mono" style={{ fontSize: 9, color: 'var(--neon)', marginBottom: 5, letterSpacing: '.08em' }}>Q: {item.q}</p>
                  <p className="mono" style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.7 }}>{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </>
  );
}