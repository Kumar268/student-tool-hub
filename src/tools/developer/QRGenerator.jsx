import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   QR.FORGE — Dark Terminal Amber / Light Cream Ink
   Pure-JS QR engine (Reed-Solomon, no deps)
   8 content types · style customiser · batch · history
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@700;800;900&family=Lato:wght@300;400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { font-family: 'Lato', sans-serif; }

/* ── DARK : warm terminal amber on deep charcoal ── */
.dk {
  --bg:   #0e0c09;
  --s1:   #141209;
  --s2:   #1a1710;
  --bdr:  #2a2518;
  --acc:  #f59e0b;
  --acc2: #fb923c;
  --lo:   #34d399;
  --er:   #f87171;
  --tx:   #fef3c7;
  --tx2:  #fbbf24;
  --tx3:  #78350f;
  --tx4:  #451a03;
  background: var(--bg);
  color: var(--tx);
  min-height: 100vh;
  background-image:
    radial-gradient(ellipse 80% 40% at 50% -10%, rgba(245,158,11,.08) 0%, transparent 70%);
}
/* ── LIGHT : ivory/cream with deep ink ── */
.lt {
  --bg:   #faf8f2;
  --s1:   #ffffff;
  --s2:   #f5f0e8;
  --bdr:  #e8e0d0;
  --acc:  #92400e;
  --acc2: #b45309;
  --lo:   #065f46;
  --er:   #991b1b;
  --tx:   #1c1208;
  --tx2:  #78350f;
  --tx3:  #a16207;
  --tx4:  #d97706;
  background: var(--bg);
  color: var(--tx);
  min-height: 100vh;
}

/* ── TOPBAR ── */
.topbar {
  height: 44px; position: sticky; top: 0; z-index: 400;
  display: flex; align-items: center; padding: 0 16px; gap: 8px;
  backdrop-filter: blur(20px);
}
.dk .topbar { background: rgba(14,12,9,.96); border-bottom: 1px solid var(--bdr); }
.lt .topbar { background: rgba(250,248,242,.96); border-bottom: 1.5px solid var(--bdr); box-shadow: 0 1px 12px rgba(146,64,14,.06); }

/* ── TABS ── */
.tabbar { display: flex; overflow-x: auto; }
.tabbar::-webkit-scrollbar { display: none; }
.dk .tabbar { background: var(--s1); border-bottom: 1px solid var(--bdr); }
.lt .tabbar { background: var(--s1); border-bottom: 1.5px solid var(--bdr); }
.tab {
  height: 38px; padding: 0 14px; border: none; cursor: pointer;
  background: transparent; border-bottom: 2px solid transparent;
  font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .1em;
  text-transform: uppercase; display: flex; align-items: center; gap: 5px;
  white-space: nowrap; transition: all .14s;
}
.dk .tab     { color: var(--tx3); }
.dk .tab.on  { color: var(--acc); border-bottom-color: var(--acc); background: rgba(245,158,11,.05); }
.dk .tab:hover:not(.on) { color: var(--tx2); }
.lt .tab     { color: var(--tx3); }
.lt .tab.on  { color: var(--acc); border-bottom-color: var(--acc); background: rgba(146,64,14,.05); font-weight: 700; }
.lt .tab:hover:not(.on) { color: var(--tx2); }

/* ── LAYOUT ── */
.body { display: grid; grid-template-columns: 1fr; min-height: calc(100vh - 82px); }
@media(min-width:1024px){.body{grid-template-columns: 220px 1fr !important;}}
.sidebar { padding: 14px 11px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
.dk .sidebar { border-right: 1px solid var(--bdr); background: var(--s1); }
.lt .sidebar { border-right: 1.5px solid var(--bdr); background: var(--s2); }
.main { padding: 14px 16px; display: flex; flex-direction: column; gap: 14px; }

/* ── PANELS ── */
.dk .panel { background: var(--s2); border: 1px solid var(--bdr); border-radius: 3px; }
.lt .panel { background: var(--s1); border: 1.5px solid var(--bdr); border-radius: 10px; box-shadow: 0 2px 16px rgba(146,64,14,.05); }

/* ── BUTTONS ── */
.btn-pri {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  padding: 8px 18px; cursor: pointer; font-family: 'DM Mono', monospace;
  font-size: 10px; font-weight: 500; letter-spacing: .1em; text-transform: uppercase;
  transition: all .15s; border: none;
}
.dk .btn-pri {
  background: var(--acc); color: #0e0c09; border-radius: 2px;
  box-shadow: 0 0 18px rgba(245,158,11,.3);
}
.dk .btn-pri:hover { background: #fbbf24; box-shadow: 0 0 28px rgba(245,158,11,.5); transform: translateY(-1px); }
.lt .btn-pri {
  background: var(--acc); color: #fff; border-radius: 7px;
  box-shadow: 0 4px 14px rgba(146,64,14,.35);
}
.lt .btn-pri:hover { background: var(--acc2); box-shadow: 0 8px 24px rgba(146,64,14,.45); transform: translateY(-1px); }

.btn-ghost {
  display: inline-flex; align-items: center; justify-content: center; gap: 4px;
  padding: 5px 10px; cursor: pointer; font-family: 'DM Mono', monospace;
  font-size: 9.5px; letter-spacing: .06em; text-transform: uppercase; background: transparent;
  transition: all .12s;
}
.dk .btn-ghost { border: 1px solid var(--bdr); border-radius: 2px; color: var(--tx3); }
.dk .btn-ghost:hover, .dk .btn-ghost.on { border-color: var(--acc); color: var(--acc); background: rgba(245,158,11,.06); }
.lt .btn-ghost { border: 1.5px solid var(--bdr); border-radius: 6px; color: var(--tx3); }
.lt .btn-ghost:hover, .lt .btn-ghost.on { border-color: var(--acc); color: var(--acc); background: rgba(146,64,14,.06); }

/* ── INPUTS ── */
.inp {
  width: 100%; padding: 7px 10px; font-family: 'DM Mono', monospace;
  font-size: 12px; outline: none; transition: all .13s;
}
.dk .inp { background: rgba(0,0,0,.45); border: 1px solid var(--bdr); color: var(--tx); border-radius: 2px; }
.dk .inp:focus { border-color: var(--acc); box-shadow: 0 0 0 2px rgba(245,158,11,.12); }
.lt .inp { background: #fdf8f0; border: 1.5px solid var(--bdr); color: var(--tx); border-radius: 7px; }
.lt .inp:focus { border-color: var(--acc); box-shadow: 0 0 0 3px rgba(146,64,14,.1); }
textarea.inp { resize: vertical; min-height: 72px; line-height: 1.6; }
.sel { width: 100%; padding: 6px 10px; font-family: 'DM Mono', monospace; font-size: 11px; outline: none; cursor: pointer; }
.dk .sel { background: rgba(0,0,0,.45); border: 1px solid var(--bdr); color: var(--tx); border-radius: 2px; }
.dk .sel option { background: #141209; }
.lt .sel { background: #fdf8f0; border: 1.5px solid var(--bdr); color: var(--tx); border-radius: 7px; }

/* ── LABELS / UTIL ── */
.lbl { font-family: 'DM Mono', monospace; font-size: 8.5px; font-weight: 500; letter-spacing: .2em; text-transform: uppercase; display: block; margin-bottom: 5px; }
.dk .lbl { color: rgba(245,158,11,.45); }
.lt .lbl { color: var(--acc); }
.sec-lbl { font-family: 'DM Mono', monospace; font-size: 8.5px; letter-spacing: .22em; text-transform: uppercase; margin-bottom: 7px; }
.dk .sec-lbl { color: rgba(245,158,11,.35); }
.lt .sec-lbl { color: var(--acc); }
.meta-box { padding: 9px 12px; }
.dk .meta-box { border: 1px solid rgba(245,158,11,.1); border-radius: 2px; background: rgba(245,158,11,.03); }
.lt .meta-box { border: 1.5px solid rgba(146,64,14,.12); border-radius: 7px; background: rgba(146,64,14,.04); }
.ad { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; }
.dk .ad { background: rgba(245,158,11,.012); border: 1px dashed rgba(245,158,11,.1); border-radius: 2px; }
.lt .ad { background: rgba(146,64,14,.03); border: 1.5px dashed rgba(146,64,14,.15); border-radius: 8px; }
.ad span { font-family: 'DM Mono', monospace; font-size: 8.5px; letter-spacing: .14em; text-transform: uppercase; }
.dk .ad span { color: var(--tx3); }
.lt .ad span { color: var(--tx3); }
.hint { padding: 9px 12px; display: flex; gap: 7px; align-items: flex-start; }
.dk .hint { border: 1px solid rgba(245,158,11,.15); border-radius: 2px; background: rgba(245,158,11,.04); border-left: 2px solid rgba(245,158,11,.35); font-size: 12.5px; color: var(--tx2); line-height: 1.72; }
.lt .hint { border: 1.5px solid rgba(146,64,14,.15); border-radius: 8px; background: rgba(146,64,14,.04); border-left: 3px solid rgba(146,64,14,.3); font-size: 12.5px; color: var(--tx2); line-height: 1.72; }

/* ── QR PREVIEW SHELL ── */
.qr-shell { position: relative; display: inline-block; }
@keyframes scan-line { 0%{top:4%} 50%{top:88%} 100%{top:4%} }
.scan-line {
  position: absolute; left: 6%; right: 6%; height: 1.5px;
  animation: scan-line 2.8s ease-in-out infinite; pointer-events: none; z-index: 2;
}
.dk .scan-line { background: linear-gradient(90deg, transparent, var(--acc), transparent); box-shadow: 0 0 8px rgba(245,158,11,.7); }
.lt .scan-line { background: linear-gradient(90deg, transparent, var(--acc), transparent); box-shadow: 0 0 8px rgba(146,64,14,.5); }
.qr-corner { position: absolute; width: 16px; height: 16px; pointer-events: none; }

/* ── RANGE ── */
.range { -webkit-appearance: none; appearance: none; width: 100%; height: 3px; border-radius: 2px; outline: none; cursor: pointer; }
.dk .range { background: rgba(245,158,11,.12); }
.dk .range::-webkit-slider-thumb { -webkit-appearance: none; width: 13px; height: 13px; border-radius: 50%; background: var(--acc); box-shadow: 0 0 8px rgba(245,158,11,.6); cursor: pointer; }
.lt .range { background: rgba(146,64,14,.14); }
.lt .range::-webkit-slider-thumb { -webkit-appearance: none; width: 13px; height: 13px; border-radius: 50%; background: var(--acc); box-shadow: 0 2px 8px rgba(146,64,14,.4); cursor: pointer; }

/* ── TYPOGRAPHY (prose) ── */
.prose p  { font-size: 13.5px; line-height: 1.8; margin-bottom: 12px; color: var(--tx2); }
.prose h3 { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 800; margin: 22px 0 7px; color: var(--tx); text-transform: uppercase; letter-spacing: .04em; }
.prose ul { padding-left: 20px; margin-bottom: 12px; }
.prose li { font-size: 13.5px; line-height: 1.72; margin-bottom: 5px; color: var(--tx2); }
.prose strong { font-weight: 700; color: var(--tx); }
.prose code { font-family: 'DM Mono', monospace; font-size: 11px; padding: 1px 5px; border-radius: 3px; }
.dk .prose code { background: rgba(245,158,11,.09); color: var(--acc); }
.lt .prose code { background: rgba(146,64,14,.07); color: var(--acc); }
.qa-card { padding: 11px 14px; margin-bottom: 9px; }
.dk .qa-card { border: 1px solid var(--bdr); border-radius: 3px; background: rgba(0,0,0,.35); }
.lt .qa-card { border: 1.5px solid var(--bdr); border-radius: 9px; background: rgba(146,64,14,.03); }
`;

/* ═══════════════════════════════════════════════════════════════
   PURE-JS QR ENGINE  (Reed-Solomon + Matrix)
═══════════════════════════════════════════════════════════════ */
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x; GF_LOG[x] = i;
    x <<= 1; if (x & 256) x ^= 285;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();
const gfMul = (a, b) => a && b ? GF_EXP[(GF_LOG[a] + GF_LOG[b]) % 255] : 0;
const gfGenPoly = k => {
  let p = [1];
  for (let i = 0; i < k; i++) {
    const ng = new Array(p.length + 1).fill(0);
    for (let j = 0; j < p.length; j++) { ng[j] ^= p[j]; ng[j + 1] ^= gfMul(p[j], GF_EXP[i]); }
    p = ng;
  }
  return p;
};
const rsEncode = (data, nsym) => {
  const gen = gfGenPoly(nsym);
  const rem = [...data, ...new Array(nsym).fill(0)];
  for (let i = 0; i < data.length; i++) {
    const c = rem[i];
    if (c) for (let j = 0; j < gen.length; j++) rem[i + j] ^= gfMul(gen[j], c);
  }
  return rem.slice(data.length);
};

const QR_SPEC = {
  L: { cw: [19,34,55,80,108,136,156,194,232,274], ec: [7,10,15,20,26,18,20,24,30,18], blk: [1,1,1,1,1,2,2,2,2,4] },
  M: { cw: [16,28,44,64,86,108,124,154,182,216], ec: [10,16,26,18,24,16,18,22,22,26], blk: [1,1,1,2,2,4,4,4,5,5] },
  Q: { cw: [13,22,34,48,62,76,88,110,132,154],  ec: [13,22,18,26,18,24,18,22,20,24], blk: [1,1,2,2,4,4,6,6,8,8] },
  H: { cw: [9,16,26,36,46,60,66,86,100,122],    ec: [17,28,22,16,22,28,26,26,24,28], blk: [1,1,2,4,4,4,5,6,8,8] },
};
const ALIGN_POS = { 1:[],2:[6,18],3:[6,22],4:[6,26],5:[6,30],6:[6,34],7:[6,22,38],8:[6,24,42],9:[6,26,46],10:[6,28,50] };

function buildQR(text, ecLevel = 'M') {
  const bytes = [];
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c < 128) bytes.push(c);
    else { bytes.push(0xc0 | (c >> 6)); bytes.push(0x80 | (c & 0x3f)); }
  }
  const spec = QR_SPEC[ecLevel];
  let version = 1;
  for (let v = 1; v <= 10; v++) { if (spec.cw[v - 1] >= bytes.length + 2) { version = v; break; } }
  if (version > 10) version = 10;

  const totalCW = spec.cw[version - 1], ecCW = spec.ec[version - 1], blocks = spec.blk[version - 1];
  const dataCW = totalCW - ecCW;
  const data = [0x40, bytes.length, ...bytes];
  const pad = [0xec, 0x11];
  while (data.length < dataCW) data.push(pad[(data.length - bytes.length - 2) % 2]);
  data.length = dataCW;

  const bsz = Math.floor(dataCW / blocks), longBlks = dataCW % blocks;
  const dblks = [], eblks = []; let off = 0;
  for (let b = 0; b < blocks; b++) {
    const len = b < (blocks - longBlks) ? bsz : bsz + 1;
    const blk = data.slice(off, off + len);
    dblks.push(blk); eblks.push(rsEncode(blk, ecCW)); off += len;
  }
  const codewords = [];
  const maxLen = Math.max(...dblks.map(b => b.length));
  for (let i = 0; i < maxLen; i++) dblks.forEach(b => { if (i < b.length) codewords.push(b[i]); });
  for (let i = 0; i < ecCW; i++) eblks.forEach(b => codewords.push(b[i]));

  const size = version * 4 + 17;
  const mat = Array.from({ length: size }, () => new Array(size).fill(-1));
  const set = (r, c, v) => { if (r >= 0 && r < size && c >= 0 && c < size) mat[r][c] = v; };

  // Finder + separator
  const addFinder = (row, col) => {
    for (let r = 0; r <= 6; r++) for (let c = 0; c <= 6; c++) {
      const outer = (r === 0 || r === 6 || c === 0 || c === 6);
      const inner = (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      set(row + r, col + c, outer || inner ? 1 : 0);
    }
    for (let i = -1; i <= 7; i++) {
      if (row + 7 < size && col + i >= 0 && col + i < size) set(row + 7, col + i, 0);
      if (col + 7 < size && row + i >= 0 && row + i < size) set(row + i, col + 7, 0);
    }
  };
  addFinder(0, 0); addFinder(0, size - 7); addFinder(size - 7, 0);

  // Timing
  for (let i = 8; i < size - 8; i++) { set(6, i, i % 2 === 0 ? 1 : 0); set(i, 6, i % 2 === 0 ? 1 : 0); }

  // Dark module
  set(4 * version + 9, 8, 1);

  // Format reserve
  for (let i = 0; i < 9; i++) { set(8, i, 0); set(i, 8, 0); }
  for (let i = size - 8; i < size; i++) { set(8, i, 0); set(i, 8, 0); }

  // Alignment patterns
  const apos = ALIGN_POS[version] || [];
  for (let ai = 0; ai < apos.length; ai++) for (let bi = 0; bi < apos.length; bi++) {
    const r = apos[ai], c = apos[bi];
    if (mat[r][c] !== -1) continue;
    for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) {
      set(r + dr, c + dc, (Math.abs(dr) === 2 || Math.abs(dc) === 2) ? 1 : (dr === 0 && dc === 0) ? 1 : 0);
    }
  }

  // Data placement
  const bits = [];
  codewords.forEach(cw => { for (let b = 7; b >= 0; b--) bits.push((cw >> b) & 1); });
  const rem = [0, 7, 7, 7, 7, 7, 0, 0, 0, 0][version - 1] || 0;
  for (let i = 0; i < rem; i++) bits.push(0);

  let bitIdx = 0, upward = true;
  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col--;
    for (let ri = 0; ri < size; ri++) {
      const row = upward ? size - 1 - ri : ri;
      for (let dc = 0; dc < 2; dc++) {
        const c = col - dc;
        if (mat[row][c] === -1) mat[row][c] = bitIdx < bits.length ? bits[bitIdx++] : 0;
      }
    }
    upward = !upward;
  }

  // Mask pattern 0
  const inFinder = (r, c) => (r < 9 && c < 9) || (r < 9 && c > size - 9) || (r > size - 9 && c < 9);
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
    if ((mat[r][c] === 0 || mat[r][c] === 1) && !inFinder(r, c) && r !== 6 && c !== 6)
      mat[r][c] ^= ((r + c) % 2 === 0 ? 1 : 0);
  }

  // Format info
  const ecBits = { L: 0b01, M: 0b00, Q: 0b11, H: 0b10 };
  let fmtRaw = (ecBits[ecLevel] << 3) | 0;
  let tmp = fmtRaw << 10;
  for (let i = 14; i >= 10; i--) if (tmp & (1 << i)) tmp ^= (0b10100110111 << (i - 10));
  const fmt = ((fmtRaw << 10) | tmp) ^ 0b101010000010010;
  const fmtBits = []; for (let i = 14; i >= 0; i--) fmtBits.push((fmt >> i) & 1);
  const fr = [0,1,2,3,4,5,7,8,8,8,8,8,8,8,8], fc = [8,8,8,8,8,8,8,8,7,5,4,3,2,1,0];
  const sr = [8,8,8,8,8,8,8,size-1,size-2,size-3,size-4,size-5,size-6,size-7,size-8];
  const sc = [size-8,size-7,size-6,size-5,size-4,size-3,size-2,8,8,8,8,8,8,8,8];
  for (let i = 0; i < 15; i++) { set(fr[i], fc[i], fmtBits[14 - i]); set(sr[i], sc[i], fmtBits[14 - i]); }

  return { matrix: mat, size, version };
}

function renderQR(canvas, matrix, size, opts = {}) {
  const { fg = '#000', bg = '#fff', eyeFg = null, dotStyle = 'square', cs = 8, margin = 4 } = opts;
  const px = (size + margin * 2) * cs;
  canvas.width = px; canvas.height = px;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, px, px);
  const off = margin * cs;
  const finderZone = (r, c) => (r < 7 && c < 7) || (r < 7 && c > size - 8) || (r > size - 8 && c < 7);
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
    if (matrix[r][c] !== 1) continue;
    const x = off + c * cs, y = off + r * cs, s = cs;
    ctx.fillStyle = (eyeFg && finderZone(r, c)) ? eyeFg : fg;
    if (dotStyle === 'circle') {
      ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2, s * .43, 0, Math.PI * 2); ctx.fill();
    } else if (dotStyle === 'rounded') {
      const rd = s * .26;
      ctx.beginPath();
      ctx.moveTo(x + rd, y); ctx.lineTo(x + s - rd, y); ctx.arcTo(x + s, y, x + s, y + rd, rd);
      ctx.lineTo(x + s, y + s - rd); ctx.arcTo(x + s, y + s, x + s - rd, y + s, rd);
      ctx.lineTo(x + rd, y + s); ctx.arcTo(x, y + s, x, y + s - rd, rd);
      ctx.lineTo(x, y + rd); ctx.arcTo(x, y, x + rd, y, rd);
      ctx.closePath(); ctx.fill();
    } else {
      ctx.fillRect(x, y, s, s);
    }
  }
}

/* ═══ CONTENT TYPE ENGINE ═══════════════════════════════════════ */
const TYPES = [
  { id: 'url',   label: 'URL / Link',    icon: '🔗' },
  { id: 'text',  label: 'Plain Text',    icon: '📝' },
  { id: 'email', label: 'Email',         icon: '✉️' },
  { id: 'phone', label: 'Phone',         icon: '📞' },
  { id: 'sms',   label: 'SMS',           icon: '💬' },
  { id: 'wifi',  label: 'Wi-Fi',         icon: '📶' },
  { id: 'vcard', label: 'vCard Contact', icon: '👤' },
  { id: 'geo',   label: 'Location',      icon: '📍' },
];

const buildPayload = (type, f = {}) => {
  switch (type) {
    case 'url':   return f.url || '';
    case 'text':  return f.text || '';
    case 'email': return `mailto:${f.email || ''}?subject=${encodeURIComponent(f.subject || '')}&body=${encodeURIComponent(f.body || '')}`;
    case 'phone': return `tel:${(f.phone || '').replace(/\s/g, '')}`;
    case 'sms':   return `smsto:${f.to || ''}:${f.msg || ''}`;
    case 'wifi':  return `WIFI:T:${f.sec || 'WPA'};S:${f.ssid || ''};P:${f.pass || ''};H:${f.hidden ? 'true' : 'false'};;`;
    case 'vcard': return `BEGIN:VCARD\nVERSION:3.0\nFN:${f.name || ''}\nTEL:${f.tel || ''}\nEMAIL:${f.em || ''}\nORG:${f.org || ''}\nURL:${f.web || ''}\nEND:VCARD`;
    case 'geo':   return `geo:${f.lat || '0'},${f.lng || '0'}`;
    default: return '';
  }
};

const EC_INFO = { L: '7% recovery', M: '15% recovery', Q: '25% recovery', H: '30% — best for logos' };
const DOT_STYLES = ['square', 'rounded', 'circle'];
const PALETTE_PRESETS = [
  { fg: '#000000', bg: '#ffffff', name: 'Classic' },
  { fg: '#1a1a2e', bg: '#e8f4f8', name: 'Slate' },
  { fg: '#065f46', bg: '#ecfdf5', name: 'Forest' },
  { fg: '#7c2d12', bg: '#fff7ed', name: 'Amber' },
  { fg: '#4c1d95', bg: '#faf5ff', name: 'Violet' },
  { fg: '#ffffff', bg: '#0e0c09', name: 'Invert' },
  { fg: '#f59e0b', bg: '#0e0c09', name: 'Neon' },
  { fg: '#ec4899', bg: '#fdf2f8', name: 'Rose' },
];

const PAGE_TABS = [
  { id: 'gen',     label: '▦ Generate' },
  { id: 'style',   label: '◈ Style' },
  { id: 'batch',   label: '⊞ Batch' },
  { id: 'history', label: '⌛ History' },
  { id: 'guide',   label: '? Guide' },
  { id: 'learn',   label: '∑ Learn' },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function QRGenerator() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';

  // Content state
  const [ctype, setCtype] = useState('url');
  const [fields, setFields] = useState({ url: 'https://example.com' });
  const [ecLevel, setEcLevel] = useState('M');

  // Style state
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#ffffff');
  const [eyeFg, setEyeFg] = useState('');
  const [dotStyle, setDotStyle] = useState('square');
  const [cs, setCs] = useState(9);     // cell size px
  const [margin, setMargin] = useState(4);

  // UI state
  const [tab, setTab] = useState('gen');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [history, setHistory] = useState([]);

  // Batch
  const [batchRows, setBatchRows] = useState([
    { id: 1, label: 'Home', value: 'https://example.com' },
    { id: 2, label: 'Docs', value: 'https://docs.example.com' },
  ]);
  const [batchResults, setBatchResults] = useState([]);

  const canvasRef = useRef(null);
  const f = useCallback((k, v) => setFields(p => ({ ...p, [k]: v })), []);

  const payload = useMemo(() => buildPayload(ctype, fields), [ctype, fields]);

  const qrMeta = useMemo(() => {
    if (!payload.trim()) return null;
    try { const { version, size } = buildQR(payload, ecLevel); return { version, size, len: payload.length }; }
    catch { return null; }
  }, [payload, ecLevel]);

  const doGenerate = useCallback((cvs, payload_, opts) => {
    if (!payload_?.trim()) return;
    try {
      const { matrix, size } = buildQR(payload_, ecLevel);
      renderQR(cvs, matrix, size, opts);
      setError('');
      return { matrix, size };
    } catch (e) {
      setError('Content too long for QR v1–10. Shorten text or lower EC level.');
    }
  }, [ecLevel]);

  // Regenerate on any change
  useEffect(() => {
    const cvs = canvasRef.current; if (!cvs || !payload.trim()) return;
    setScanning(true);
    const t = setTimeout(() => {
      const res = doGenerate(cvs, payload, { fg, bg, eyeFg: eyeFg || null, dotStyle, cs, margin });
      if (res) {
        const { version } = res;
        setHistory(h => [{ id: Date.now(), ctype, payload: payload.slice(0, 70), version, ecLevel, time: new Date().toLocaleTimeString() }, ...h].slice(0, 30));
      }
      setScanning(false);
    }, 80);
    return () => clearTimeout(t);
  }, [payload, ecLevel, fg, bg, eyeFg, dotStyle, cs, margin]);

  const download = (fmt) => {
    const cvs = canvasRef.current; if (!cvs) return;
    if (fmt === 'svg') {
      try {
        const { matrix, size } = buildQR(payload, ecLevel);
        const total = (size + margin * 2) * cs;
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}"><rect width="${total}" height="${total}" fill="${bg}"/>`;
        for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
          if (matrix[r][c] === 1) svg += `<rect x="${(margin+c)*cs}" y="${(margin+r)*cs}" width="${cs}" height="${cs}" fill="${fg}"/>`;
        }
        svg += `</svg>`;
        const a = document.createElement('a');
        a.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        a.download = 'qr.svg'; document.body.appendChild(a); a.click(); document.body.removeChild(a);
      } catch(e) { setError('Cannot generate SVG — content too long.'); }
    } else {
      const a = document.createElement('a');
      a.href = cvs.toDataURL('image/png'); a.download = 'qr.png';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }
  };

  const copyImage = () => {
    const cvs = canvasRef.current; if (!cvs) return;
    cvs.toBlob(blob => {
      try { navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); } catch {}
      setCopied(true); setTimeout(() => setCopied(false), 1400);
    });
  };

  const generateBatch = () => {
    const results = batchRows.map(row => {
      try {
        const { matrix, size } = buildQR(row.value, ecLevel);
        const c = document.createElement('canvas');
        renderQR(c, matrix, size, { fg, bg, eyeFg: eyeFg || null, dotStyle, cs: 6, margin: 3 });
        return { ...row, ok: true, dataUrl: c.toDataURL(), version: size };
      } catch { return { ...row, ok: false }; }
    });
    setBatchResults(results);
  };

  // ── Field renderers ──────────────────────────────────────────
  const renderFields = () => {
    const inp = (k, ph, type='text') => (
      <input className="inp" key={k} type={type} value={fields[k] || ''} placeholder={ph}
        onChange={e => f(k, e.target.value)} />
    );
    const ta = (k, ph) => (
      <textarea className="inp" key={k} value={fields[k] || ''} placeholder={ph}
        onChange={e => f(k, e.target.value)} style={{ minHeight: 72 }} />
    );
    switch (ctype) {
      case 'url':   return inp('url', 'https://example.com');
      case 'text':  return ta('text', 'Type any message...');
      case 'email': return <div style={{display:'flex',flexDirection:'column',gap:7}}>{inp('email','recipient@email.com','email')}{inp('subject','Subject (optional)')}{ta('body','Body (optional)')}</div>;
      case 'phone': return inp('phone', '+1 555 000 1234', 'tel');
      case 'sms':   return <div style={{display:'flex',flexDirection:'column',gap:7}}>{inp('to','Phone number','tel')}{ta('msg','SMS message...')}</div>;
      case 'wifi':  return (
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {inp('ssid','Network name (SSID)')}
          <input className="inp" type="password" value={fields.pass||''} placeholder="Password" onChange={e=>f('pass',e.target.value)}/>
          <select className="sel" value={fields.sec||'WPA'} onChange={e=>f('sec',e.target.value)}>
            <option>WPA</option><option>WEP</option><option>nopass</option>
          </select>
          <label style={{display:'flex',gap:8,alignItems:'center',fontSize:12,fontFamily:"'DM Mono',monospace",color:'var(--tx2)',cursor:'pointer'}}>
            <input type="checkbox" checked={!!fields.hidden} onChange={e=>f('hidden',e.target.checked)}/> Hidden network
          </label>
        </div>
      );
      case 'vcard': return (
        <div style={{display:'flex',flexDirection:'column',gap:7}}>
          {inp('name','Full Name')}{inp('tel','Phone','tel')}{inp('em','Email','email')}{inp('org','Organisation')}{inp('web','Website URL')}
        </div>
      );
      case 'geo': return (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
          {inp('lat','Latitude (e.g. 51.5074)')}{inp('lng','Longitude (e.g. -0.1278)')}
        </div>
      );
      default: return null;
    }
  };

  // ── QR Canvas preview block ──────────────────────────────────
  const QRPreview = ({ maxW = 260 }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div className={`qr-shell`} style={{
        borderRadius: dark ? 4 : 12, overflow: 'hidden',
        border: dark ? '1px solid rgba(245,158,11,.18)' : '1.5px solid rgba(146,64,14,.18)',
        boxShadow: dark ? '0 8px 40px rgba(245,158,11,.08)' : '0 4px 28px rgba(146,64,14,.1)',
        background: bg,
      }}>
        <canvas ref={canvasRef} style={{ display: 'block', maxWidth: maxW }} />
        {scanning && <div className="scan-line" />}
        {/* Corner brackets */}
        {[['tl',{top:6,left:6}], ['tr',{top:6,right:6}], ['bl',{bottom:6,left:6}], ['br',{bottom:6,right:6}]].map(([id, pos]) => (
          <div key={id} className="qr-corner" style={{
            ...pos,
            borderTop: id.includes('t') ? `2px solid var(--acc)` : 'none',
            borderBottom: id.includes('b') ? `2px solid var(--acc)` : 'none',
            borderLeft: id.includes('l') ? `2px solid var(--acc)` : 'none',
            borderRight: id.includes('r') ? `2px solid var(--acc)` : 'none',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn-pri" onClick={() => download('png')} style={{ padding: '6px 14px', fontSize: 9.5 }}>↓ PNG</button>
        <button className="btn-ghost" onClick={() => download('svg')} style={{ padding: '6px 12px' }}>↓ SVG</button>
        <button className="btn-ghost" onClick={copyImage} style={{ padding: '6px 12px' }}>{copied ? '✓ Copied' : '⎘ Copy'}</button>
      </div>
    </div>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>

        {/* ══ TOPBAR ══ */}
        <div className="topbar">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28,
              borderRadius: dark ? 3 : 8,
              border: dark ? '1px solid rgba(245,158,11,.4)' : 'none',
              background: dark ? 'rgba(245,158,11,.08)' : 'linear-gradient(135deg,#92400e,#b45309)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: dark ? '0 0 14px rgba(245,158,11,.25)' : '0 3px 10px rgba(146,64,14,.4)',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={dark ? '#f59e0b' : '#fff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3z"/><path d="M17 17h4v4M17 21h4"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 15, color: 'var(--tx)', letterSpacing: '-.01em' }}>
              QR<span style={{ color: 'var(--acc)' }}>.forge</span>
            </span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Status pill */}
          {qrMeta && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px',
              borderRadius: dark ? 2 : 7,
              border: dark ? '1px solid rgba(245,158,11,.2)' : '1.5px solid rgba(146,64,14,.18)',
              background: dark ? 'rgba(245,158,11,.05)' : 'rgba(146,64,14,.04)',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lo)', boxShadow: dark ? '0 0 6px var(--lo)' : 'none' }} />
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9.5, color: 'var(--tx2)', letterSpacing: '.07em' }}>
                {TYPES.find(t => t.id === ctype)?.label} · v{qrMeta.version} · EC-{ecLevel} · {qrMeta.len}ch
              </span>
            </div>
          )}

          {/* Theme toggle */}
          <button onClick={() => setDark(d => !d)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
            border: dark ? '1px solid rgba(245,158,11,.18)' : '1.5px solid var(--bdr)',
            borderRadius: dark ? 2 : 6, background: 'transparent', cursor: 'pointer', transition: 'all .14s',
          }}>
            <div style={{
              width: 28, height: 15, borderRadius: 8, position: 'relative',
              background: dark ? 'var(--acc)' : '#d6cfc0',
              boxShadow: dark ? '0 0 8px rgba(245,158,11,.5)' : 'none',
            }}>
              <div style={{
                position: 'absolute', top: 2.5,
                left: dark ? 'auto' : 2, right: dark ? 2 : 'auto',
                width: 10, height: 10, borderRadius: '50%',
                background: dark ? '#0e0c09' : 'white', transition: 'all .2s',
              }} />
            </div>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, fontWeight: 500, letterSpacing: '.1em', color: 'var(--tx3)' }}>
              {dark ? 'DARK' : 'LIGHT'}
            </span>
          </button>
        </div>

        {/* ══ TAB BAR ══ */}
        <div className="tabbar">
          {PAGE_TABS.map(t => (
            <button key={t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* ══ BODY ══ */}
        <div className="body">

          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* Content type */}
            <div>
              <div className="sec-lbl">Content Type</div>
              {TYPES.map(t => (
                <button key={t.id}
                  className={`btn-ghost ${ctype === t.id ? 'on' : ''}`}
                  onClick={() => { setCtype(t.id); setFields({}); }}
                  style={{
                    width: '100%', justifyContent: 'flex-start', marginBottom: 4,
                    padding: '5px 9px', fontSize: 10.5,
                    background: ctype === t.id ? (dark ? 'rgba(245,158,11,.07)' : 'rgba(146,64,14,.06)') : '',
                  }}>
                  <span style={{ fontSize: 11 }}>{t.icon}</span> {t.label}
                </button>
              ))}
            </div>

            {/* EC Level */}
            <div>
              <div className="sec-lbl">Error Correction</div>
              {Object.entries(EC_INFO).map(([k, v]) => (
                <button key={k}
                  className={`btn-ghost ${ecLevel === k ? 'on' : ''}`}
                  onClick={() => setEcLevel(k)}
                  style={{
                    width: '100%', justifyContent: 'flex-start', marginBottom: 4,
                    padding: '5px 9px', fontSize: 9.5,
                    background: ecLevel === k ? (dark ? 'rgba(245,158,11,.07)' : 'rgba(146,64,14,.06)') : '',
                  }}>
                  <strong>{k}</strong>&nbsp;— {v}
                </button>
              ))}
            </div>

            {/* Meta info */}
            {qrMeta && (
              <div>
                <div className="sec-lbl">QR Info</div>
                {[['Version', `v${qrMeta.version}`], ['Matrix', `${qrMeta.size}×${qrMeta.size}`], ['Characters', qrMeta.len]].map(([l, v]) => (
                  <div key={l} className="meta-box" style={{ marginBottom: 5 }}>
                    <div style={{ fontSize: 8, fontFamily: "'DM Mono',monospace", letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 1 }}>{l}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'DM Mono',monospace", color: 'var(--acc)' }}>{v}</div>
                  </div>
                ))}
              </div>
            )}

            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══════ GENERATE ══════ */}
              {tab === 'gen' && (
                <motion.div key="gen" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
                    {/* Input */}
                    <div>
                      <div className="panel" style={{ padding: '16px 18px', marginBottom: 10 }}>
                        <div className="lbl" style={{ marginBottom: 9 }}>
                          {TYPES.find(t => t.id === ctype)?.icon} {TYPES.find(t => t.id === ctype)?.label}
                        </div>
                        {renderFields()}
                        {error && (
                          <div style={{
                            marginTop: 9, padding: '6px 10px', borderRadius: dark ? 2 : 6,
                            background: dark ? 'rgba(248,113,113,.06)' : 'rgba(153,27,27,.05)',
                            border: dark ? '1px solid rgba(248,113,113,.2)' : '1.5px solid rgba(153,27,27,.15)',
                            fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--er)'
                          }}>⚠ {error}</div>
                        )}
                      </div>

                      {/* Encoded preview */}
                      {payload && (
                        <div className="panel" style={{ padding: '10px 14px' }}>
                          <div style={{ fontSize: 8.5, fontFamily: "'DM Mono',monospace", letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 5 }}>Encoded payload</div>
                          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10.5, color: 'var(--tx2)', wordBreak: 'break-all', lineHeight: 1.65 }}>
                            {payload.length > 140 ? payload.slice(0, 140) + '…' : payload}
                          </div>
                          <div style={{ marginTop: 5, display: 'flex', gap: 10 }}>
                            <span style={{ fontSize: 9.5, fontFamily: "'DM Mono',monospace", color: 'var(--tx3)' }}>{payload.length} chars</span>
                            {qrMeta && <span style={{ fontSize: 9.5, fontFamily: "'DM Mono',monospace", color: 'var(--lo)' }}>✓ encodable</span>}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* QR preview */}
                    <QRPreview maxW={260} />
                  </div>

                  {/* Size slider */}
                  <div className="panel" style={{ padding: '12px 16px', display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span className="lbl" style={{ margin: 0 }}>Output Size</span>
                        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'var(--acc)' }}>{cs}px/module → ~{qrMeta ? ((qrMeta.size + margin * 2) * cs) : '?'}px</span>
                      </div>
                      <input type="range" min="4" max="18" value={cs} className="range" onChange={e => setCs(+e.target.value)} />
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════ STYLE ══════ */}
              {tab === 'style' && (
                <motion.div key="style" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                      {/* Presets */}
                      <div className="panel" style={{ padding: '14px 16px' }}>
                        <div className="lbl" style={{ marginBottom: 10 }}>Colour Presets</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {PALETTE_PRESETS.map((p, i) => (
                            <div key={i} onClick={() => { setFg(p.fg); setBg(p.bg); }}
                              style={{
                                cursor: 'pointer', borderRadius: dark ? 3 : 8, overflow: 'hidden',
                                border: fg === p.fg && bg === p.bg
                                  ? `2px solid var(--acc)` : dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)',
                                transition: 'all .13s',
                              }}>
                              <div style={{ width: 58, height: 40, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 22, height: 22, background: p.fg, borderRadius: 2 }} />
                              </div>
                              <div style={{ padding: '3px 5px', fontSize: 8.5, fontFamily: "'DM Mono',monospace", color: 'var(--tx3)', textAlign: 'center', background: dark ? 'rgba(0,0,0,.3)' : 'rgba(0,0,0,.04)' }}>
                                {p.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Custom colours */}
                      <div className="panel" style={{ padding: '14px 16px' }}>
                        <div className="lbl" style={{ marginBottom: 12 }}>Custom Colours</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                          {[
                            { l: 'Dots', v: fg, fn: setFg },
                            { l: 'Background', v: bg, fn: setBg },
                            { l: 'Eyes (opt.)', v: eyeFg, fn: setEyeFg },
                          ].map(({ l, v, fn }) => (
                            <div key={l}>
                              <div style={{ fontSize: 9, fontFamily: "'DM Mono',monospace", letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 5 }}>{l}</div>
                              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                <input type="color" value={v || '#000000'} onChange={e => fn(e.target.value)}
                                  style={{ width: 32, height: 32, borderRadius: dark ? 2 : 6, cursor: 'pointer', border: dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)', background: 'none', padding: 2, flexShrink: 0 }} />
                                <input className="inp" value={v} onChange={e => fn(e.target.value)}
                                  placeholder={l.includes('opt') ? '(same)' : ''}
                                  style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", flex: 1 }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dot style */}
                      <div className="panel" style={{ padding: '14px 16px' }}>
                        <div className="lbl" style={{ marginBottom: 10 }}>Dot Style</div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {DOT_STYLES.map(s => (
                            <button key={s} className={`btn-ghost ${dotStyle === s ? 'on' : ''}`}
                              onClick={() => setDotStyle(s)}
                              style={{
                                flex: 1, flexDirection: 'column', gap: 6, height: 'auto', padding: '10px 8px',
                                background: dotStyle === s ? (dark ? 'rgba(245,158,11,.07)' : 'rgba(146,64,14,.06)') : '',
                              }}>
                              <div style={{ width: 14, height: 14, margin: '0 auto', background: 'var(--acc)', borderRadius: s === 'circle' ? '50%' : s === 'rounded' ? 3 : 0 }} />
                              <span style={{ fontSize: 9, textTransform: 'capitalize' }}>{s}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quiet zone */}
                      <div className="panel" style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div className="lbl" style={{ margin: 0 }}>Quiet Zone (margin)</div>
                          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'var(--acc)' }}>{margin} modules</span>
                        </div>
                        <input type="range" min="1" max="8" value={margin} className="range" onChange={e => setMargin(+e.target.value)} />
                        <div style={{ marginTop: 6, fontSize: 11, fontFamily: "'DM Mono',monospace", color: 'var(--tx3)', lineHeight: 1.6 }}>
                          ISO 18004 specifies minimum 4 modules for reliable scanning.
                        </div>
                      </div>
                    </div>

                    {/* Sticky preview */}
                    <div style={{ position: 'sticky', top: 58, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                      <div className="lbl" style={{ alignSelf: 'flex-start' }}>Live Preview</div>
                      <QRPreview maxW={220} />
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════ BATCH ══════ */}
              {tab === 'batch' && (
                <motion.div key="batch" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  <div className="hint" style={{ fontSize: 12.5 }}>
                    <span>ℹ</span>
                    <span>Generate multiple QR codes in one click. Uses your current Style settings for all outputs.</span>
                  </div>

                  <div className="panel" style={{ padding: '14px 16px' }}>
                    <div className="lbl" style={{ marginBottom: 10 }}>Batch Rows</div>
                    {batchRows.map((row, i) => (
                      <div key={row.id} style={{ display: 'flex', gap: 7, marginBottom: 7, alignItems: 'center' }}>
                        <input className="inp" value={row.label} placeholder="Label"
                          onChange={e => setBatchRows(r => r.map((b, j) => j === i ? { ...b, label: e.target.value } : b))}
                          style={{ flex: '0 0 90px', fontSize: 11 }} />
                        <input className="inp" value={row.value} placeholder="URL or text…"
                          onChange={e => setBatchRows(r => r.map((b, j) => j === i ? { ...b, value: e.target.value } : b))}
                          style={{ flex: 1, fontSize: 11 }} />
                        <button onClick={() => setBatchRows(r => r.filter((_, j) => j !== i))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--er)', fontSize: 18, lineHeight: 1, flexShrink: 0, padding: '0 4px' }}>×</button>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button className="btn-ghost" onClick={() => setBatchRows(r => [...r, { id: Date.now(), label: `Item ${r.length + 1}`, value: '' }])}>+ Add row</button>
                      <button className="btn-pri" onClick={generateBatch}>⊞ Generate all</button>
                    </div>
                  </div>

                  {batchResults.length > 0 && (
                    <div>
                      <div className="lbl" style={{ marginBottom: 10 }}>{batchResults.length} QR codes generated</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                        {batchResults.map((r, i) => (
                          <motion.div key={i} initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * .06 }}
                            className="panel" style={{ padding: 10, textAlign: 'center' }}>
                            {r.ok ? (
                              <>
                                <img src={r.dataUrl} alt={r.label} style={{ width: '100%', borderRadius: dark ? 2 : 6, marginBottom: 6 }} />
                                <div style={{ fontSize: 10.5, fontFamily: "'DM Mono',monospace", fontWeight: 600, color: 'var(--tx)', marginBottom: 4 }}>{r.label}</div>
                                <a href={r.dataUrl} download={`${r.label.replace(/\s+/g, '_')}.png`}
                                  style={{ display: 'block', fontSize: 9, fontFamily: "'DM Mono',monospace", color: 'var(--acc)', textDecoration: 'none', padding: '4px 6px', borderRadius: dark ? 2 : 5, border: dark ? '1px solid rgba(245,158,11,.25)' : '1.5px solid rgba(146,64,14,.2)' }}>
                                  ↓ PNG
                                </a>
                              </>
                            ) : (
                              <div style={{ padding: '20px 8px', fontSize: 10, color: 'var(--er)', fontFamily: "'DM Mono',monospace" }}>✗ {r.label} — too long</div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ══════ HISTORY ══════ */}
              {tab === 'history' && (
                <motion.div key="hist" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '52px 24px', fontFamily: "'DM Mono',monospace", fontSize: 13, color: 'var(--tx3)' }}>
                      No codes generated yet — start on the ▦ Generate tab.
                    </div>
                  ) : history.map((h, i) => (
                    <motion.div key={h.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .035 }}
                      className="panel" style={{ padding: '11px 14px', display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer' }}
                      onClick={() => { setCtype(h.ctype); setTab('gen'); }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--lo)', flexShrink: 0, boxShadow: dark ? '0 0 6px var(--lo)' : 'none' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", fontWeight: 500, color: 'var(--tx)', marginBottom: 2 }}>
                          {h.ctype.toUpperCase()} · v{h.version} · EC-{h.ecLevel}
                        </div>
                        <div style={{ fontSize: 10.5, fontFamily: "'DM Mono',monospace", color: 'var(--tx2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {h.payload}
                        </div>
                      </div>
                      <div style={{ fontSize: 9.5, fontFamily: "'DM Mono',monospace", color: 'var(--tx3)', flexShrink: 0 }}>{h.time}</div>
                    </motion.div>
                  ))}
                  {history.length > 0 && (
                    <button className="btn-ghost" onClick={() => setHistory([])} style={{ alignSelf: 'flex-start', marginTop: 4 }}>Clear history</button>
                  )}
                  
                </motion.div>
              )}

              {/* ══════ GUIDE ══════ */}
              {tab === 'guide' && (
                <motion.div key="guide" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { n: 1, t: 'Pick a content type', d: 'Select from the 8 types in the sidebar — URL, plain text, email, phone, SMS, Wi-Fi, vCard (contact), or GPS coordinates. Each type has dedicated fields so the correct QR standard is used.' },
                    { n: 2, t: 'Enter your content', d: 'Fill in the fields on the Generate tab. The QR code updates automatically in real time as you type. The encoded payload preview below the form shows exactly what gets embedded.' },
                    { n: 3, t: 'Set error correction', d: 'Higher EC = more damage tolerance. Use H (30%) if you plan to overlay a logo, emboss onto a surface, or print at high risk of wear. Use L or M for maximum data density.' },
                    { n: 4, t: 'Customise the style', d: 'On the ◈ Style tab, choose a colour preset or set custom foreground, background, and eye colours. Switch between Square, Rounded, and Circle dot shapes. Adjust the quiet zone margin (minimum 4 recommended).' },
                    { n: 5, t: 'Download or copy', d: 'Click ↓ PNG for a raster image (screens, documents) or ↓ SVG for a vector file that scales to any print size without quality loss. Use ⎘ Copy to paste directly into design tools.' },
                    { n: 6, t: 'Batch generate', d: 'On the ⊞ Batch tab, add as many rows as you need. All codes are generated at once using your current Style settings. Download each individually as PNG.' },
                    { n: 7, t: 'Test before publishing', d: 'Always scan your QR code with at least two different devices before printing. Test in bright sunlight and low light. If using a logo, verify EC level H is set and the logo covers ≤20% of the code area.' },
                  ].map(({ n, t, d }) => (
                    <div key={n} style={{ display: 'flex', gap: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Mono',monospace", fontSize: 10, fontWeight: 700, flexShrink: 0, border: dark ? '1px solid rgba(245,158,11,.3)' : '1.5px solid rgba(146,64,14,.3)', background: dark ? 'rgba(245,158,11,.07)' : 'rgba(146,64,14,.07)', color: 'var(--acc)' }}>{n}</div>
                        {n < 7 && <div style={{ width: 1.5, flex: 1, marginTop: 4, background: dark ? 'rgba(245,158,11,.1)' : 'rgba(146,64,14,.12)' }} />}
                      </div>
                      <div style={{ flex: 1, paddingBottom: 10 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Syne',sans-serif", color: 'var(--tx)', marginBottom: 3 }}>{t}</div>
                        <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.74 }}>{d}</div>
                      </div>
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {/* ══════ LEARN ══════ */}
              {tab === 'learn' && (
                <motion.div key="learn" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="panel" style={{ padding: '22px 24px', marginBottom: 12 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 22, color: 'var(--tx)', marginBottom: 3, letterSpacing: '-.01em' }}>
                      How QR Codes Work
                    </div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10.5, color: 'var(--tx3)', marginBottom: 22, letterSpacing: '.08em' }}>
                      ENCODING · ERROR CORRECTION · STRUCTURE · SCANNING
                    </div>
                    <div className="prose">
                      <p>A QR code (Quick Response code) is a 2-D matrix barcode invented by Denso Wave in 1994. Originally for tracking automotive parts on factory floors, it became the default link between physical objects and digital content worldwide — used for payments, authentication, menus, boarding passes, and product packaging.</p>
                      <h3>Structure</h3>
                      <p>Every QR code shares a fixed anatomy. The three large squares in the corners are <strong>finder patterns</strong> — they let any camera locate and orient the code in any rotation. Between them run horizontal and vertical <strong>timing patterns</strong> (alternating black/white stripes) that define the module grid. In larger versions, small <strong>alignment patterns</strong> appear inside the data area to correct perspective distortion when the code is photographed at an angle.</p>
                      <p>A mandatory white border called the <strong>quiet zone</strong> surrounds the entire code. ISO 18004 specifies a minimum of 4 modules width. Violating this is the most common reason printed QR codes fail to scan.</p>
                      <h3>Encoding & Modes</h3>
                      <p>Data is converted to a binary bitstream using one of four modes: <strong>Numeric</strong> (3 decimal digits per 10 bits), <strong>Alphanumeric</strong> (2 chars per 11 bits, uppercase only), <strong>Byte</strong> (one byte per 8 bits, handles all UTF-8), and <strong>Kanji</strong> (2-byte Japanese characters). This tool uses Byte mode, which handles any text including URLs, Unicode, and structured formats like the WIFI: or BEGIN:VCARD strings.</p>
                      <h3>Reed-Solomon Error Correction</h3>
                      <p>QR codes use <strong>Reed-Solomon coding</strong> — the same algorithm protecting data on CDs, DVDs, and deep-space probes. Extra redundancy codewords are appended to the data. If modules are damaged or obscured, the algorithm can reconstruct the original data up to the recovery limit of the selected EC level: L=7%, M=15%, Q=25%, H=30%.</p>
                      <p>This is why QR codes with logos still scan. At EC level H, up to 30% of the code area can be destroyed — so a small logo covering the centre typically only affects 15–20% of the data area, well within recovery range.</p>
                      <h3>Versions & Capacity</h3>
                      <p>QR codes come in 40 <strong>versions</strong>. Version 1 is 21×21 modules; each higher version adds 4 modules per side up to Version 40 at 177×177. This tool covers Versions 1–10 (up to 41×41), enough for any URL, contact card, or Wi-Fi credential. A v1-L code holds 41 alphanumeric characters; a v10-H code holds 122 binary bytes.</p>
                      <h3>Wi-Fi QR Codes</h3>
                      <p>The format <code>WIFI:T:WPA;S:NetworkName;P:Password;;</code> is recognised natively by both Android and iOS cameras. Scan and connect — no app required. Use <code>nopass</code> as the security type for open networks.</p>
                      <h3>vCard Contacts</h3>
                      <p>The vCard 3.0 format embedded in a QR allows one-tap contact saving. Keep fields concise — long vCards quickly exceed Version 10 capacity. Name, one phone, one email, and a website URL comfortably fit in v5-M.</p>

                      {[
                        { q: 'What is the maximum content length?', a: 'This tool supports QR Versions 1–10. At EC level L, Version 10 can hold approximately 272 alphanumeric characters or 174 bytes of binary data. For longer content, shorten URLs using a link shortener (bit.ly, etc.).' },
                        { q: 'PNG vs SVG — which should I use?', a: 'Use SVG for print (posters, packaging, signage) — it scales infinitely without pixelation. Use PNG for digital use (websites, emails, presentations). For print sizes above 5cm, SVG is strongly recommended.' },
                        { q: 'Can I make a coloured QR code?', a: 'Yes, but maintain sufficient contrast. The scanner needs to distinguish dark from light modules. A contrast ratio of at least 4:1 is recommended. Avoid light-on-light or dark-on-dark. Gradients across the QR surface are not supported by most scanners.' },
                        { q: 'Why do QR codes sometimes fail to scan?', a: 'The most common causes are: insufficient quiet zone (white margin too small), low contrast, a logo that is too large (>20% of total area), too much data for the version selected, or a crumpled/dirty surface. Setting EC level H adds the most resilience.' },
                        { q: 'Are dynamic QR codes different?', a: 'Dynamic QR codes point to a redirect URL. The short URL is encoded in the QR, and the destination can be changed without reprinting. This tool generates static QR codes where the full content is encoded directly. Static codes work forever, offline, and do not require third-party services.' },
                      ].map(({ q, a }, i) => (
                        <div key={i} className="qa-card">
                          <div style={{ fontSize: 12.5, fontWeight: 700, fontFamily: "'DM Mono',monospace", color: 'var(--tx)', marginBottom: 5 }}>{q}</div>
                          <div style={{ fontSize: 12.5, color: 'var(--tx2)', lineHeight: 1.74 }}>{a}</div>
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