import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ════════════════════════════════════════════════════════════
   STYLES
════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{overflow-x:hidden;font-family:'Inter',sans-serif}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes gridmove{from{background-position:0 0}to{background-position:30px 30px}}
@keyframes scan{0%{top:-3px}100%{top:100%}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.fade-in{animation:fadeUp .22s ease both}

/* ── NEON ROOT ─────────────────────── */
.ft{background:#03030d;color:#cdd6ff;min-height:100vh;
  background-image:linear-gradient(rgba(0,255,200,.01) 1px,transparent 1px),
    linear-gradient(90deg,rgba(0,255,200,.01) 1px,transparent 1px);
  background-size:30px 30px;animation:gridmove 16s linear infinite}
.scanline{position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:9999;
  background:linear-gradient(90deg,transparent,rgba(0,255,180,.55),transparent);
  box-shadow:0 0 8px rgba(0,255,180,.35);animation:scan 9s linear infinite}

.ft-bar{height:32px;background:rgba(3,3,13,.97);border-bottom:1px solid rgba(0,255,180,.12);
  backdrop-filter:blur(12px);position:sticky;top:0;z-index:300;
  display:flex;align-items:center;padding:0 10px;gap:6px}
.ft-logo{display:flex;align-items:center;gap:5px}
.ft-logo-icon{width:20px;height:20px;border:1px solid rgba(0,255,180,.45);border-radius:2px;
  display:flex;align-items:center;justify-content:center;color:#00ffb4;
  box-shadow:0 0 8px rgba(0,255,180,.18)}
.ft-logo-text{font-size:11px;font-weight:800;letter-spacing:.05em;color:#cdd6ff}
.ft-logo-text span{color:#00ffb4}
.ft-chip{padding:1px 5px;border:1px solid rgba(0,255,180,.18);border-radius:2px;
  font-size:7.5px;font-weight:700;letter-spacing:.12em;color:rgba(0,255,180,.5);text-transform:uppercase}
.ft-status{display:flex;align-items:center;gap:4px;font-size:8.5px;font-weight:700;
  letter-spacing:.1em;text-transform:uppercase;color:#ffd700}
.ft-tgl{display:flex;align-items:center;gap:6px;padding:4px 9px;
  border:1px solid rgba(0,255,180,.16);border-radius:2px;background:rgba(0,255,180,.03);
  cursor:pointer;transition:all .14s;font-family:'Inter',sans-serif}
.ft-tgl:hover{border-color:rgba(0,255,180,.4);background:rgba(0,255,180,.06)}

.ft-tabs{display:flex;border-bottom:1px solid rgba(0,255,180,.09);
  background:rgba(3,3,13,.95);overflow-x:auto}
.ft-tab{padding:0 14px;height:36px;border:none;border-bottom:2px solid transparent;
  background:transparent;color:rgba(180,200,255,.4);cursor:pointer;
  font-family:'Inter',sans-serif;font-size:10.5px;font-weight:700;
  letter-spacing:.07em;text-transform:uppercase;transition:all .14s;
  display:flex;align-items:center;gap:5px;white-space:nowrap}
.ft-tab.on{color:#00ffb4;border-bottom-color:#00ffb4;background:rgba(0,255,180,.05)}
.ft-tab:hover:not(.on){color:#cdd6ff;background:rgba(255,255,255,.02)}

.ft-card{background:rgba(6,6,22,.98);border:1px solid rgba(0,255,180,.09);border-radius:4px;position:relative}
.ft-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,255,180,.22),transparent);pointer-events:none}
.ft-inp{background:rgba(0,0,0,.55);border:1px solid rgba(0,255,180,.18);border-radius:3px;
  color:#eef2ff;font-family:'JetBrains Mono',monospace;font-size:14px;padding:9px 12px;
  outline:none;width:100%;transition:all .14s}
.ft-inp:focus{border-color:#00ffb4;box-shadow:0 0 0 2px rgba(0,255,180,.1),0 0 14px rgba(0,255,180,.05)}
.ft-inp::placeholder{color:rgba(0,255,180,.16)}
.ft-pbtn{display:inline-flex;align-items:center;gap:7px;padding:9px 22px;
  border:1px solid #00ffb4;border-radius:3px;background:rgba(0,255,180,.1);color:#00ffb4;
  cursor:pointer;font-family:'Inter',sans-serif;font-size:11.5px;font-weight:700;
  letter-spacing:.1em;text-transform:uppercase;transition:all .16s;
  box-shadow:0 0 16px rgba(0,255,180,.1)}
.ft-pbtn:hover{background:rgba(0,255,180,.18);box-shadow:0 0 26px rgba(0,255,180,.25);transform:translateY(-1px)}
.ft-pbtn:disabled{opacity:.3;cursor:not-allowed;transform:none;box-shadow:none}
.ft-sbtn{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;
  border:1px solid rgba(0,255,180,.16);border-radius:2px;background:rgba(0,255,180,.04);
  color:rgba(0,255,180,.6);cursor:pointer;font-family:'Inter',sans-serif;
  font-size:9.5px;font-weight:600;letter-spacing:.05em;transition:all .12s}
.ft-sbtn:hover,.ft-sbtn.on{border-color:#00ffb4;color:#00ffb4;background:rgba(0,255,180,.1)}
.ft-result-box{border:1px solid rgba(0,255,180,.2);border-radius:4px;
  background:linear-gradient(135deg,rgba(0,255,180,.07),rgba(0,180,255,.04));
  padding:14px 18px;position:relative;overflow:hidden}
.ft-result-box::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,255,180,.65),transparent)}
.ft-lbl{font-size:9px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;
  color:rgba(0,255,180,.5);display:block;margin-bottom:5px}
.ft-hint{font-size:11px;color:rgba(0,255,180,.5);line-height:1.65;padding:8px 11px;
  border-radius:3px;background:rgba(0,255,180,.035);border-left:2px solid rgba(0,255,180,.28)}
.ft-step-n{width:22px;height:22px;border-radius:50%;border:1px solid rgba(0,255,180,.26);
  background:rgba(0,255,180,.07);display:flex;align-items:center;justify-content:center;
  font-size:9.5px;font-weight:700;color:#00ffb4;flex-shrink:0}
.ft-ad{background:rgba(0,255,180,.02);border:1px dashed rgba(0,255,180,.09);border-radius:3px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  color:rgba(0,255,180,.18);font-size:9px;letter-spacing:.08em}
.ft-err{padding:9px 12px;border:1px solid rgba(255,80,100,.28);border-radius:3px;
  background:rgba(255,50,70,.05);font-size:12px;color:#ff6685;line-height:1.55}
.ft-tag{display:inline-flex;align-items:center;padding:3px 8px;border-radius:2px;
  font-size:10px;font-weight:700;letter-spacing:.05em;border:1px solid;gap:4px}
.ft-tag-green{background:rgba(0,255,180,.08);border-color:rgba(0,255,180,.25);color:#00ffb4}
.ft-tag-red{background:rgba(255,80,100,.07);border-color:rgba(255,80,100,.22);color:#ff6685}
.ft-tag-blue{background:rgba(0,180,255,.07);border-color:rgba(0,180,255,.22);color:#38bdf8}
.ft-tag-yellow{background:rgba(255,215,0,.07);border-color:rgba(255,215,0,.22);color:#fbbf24}

/* ── NORMAL ROOT ─────────────────── */
.nm{background:#080d18;color:#e2e8f8;min-height:100vh}
.nm-bar{height:32px;background:#0e1420;border-bottom:1.5px solid #1a2540;
  position:sticky;top:0;z-index:300;display:flex;align-items:center;padding:0 10px;gap:6px}
.nm-logo{display:flex;align-items:center;gap:5px}
.nm-logo-icon{width:20px;height:20px;border-radius:5px;
  background:linear-gradient(135deg,#059669,#0891b2);
  display:flex;align-items:center;justify-content:center;color:#fff}
.nm-logo-text{font-size:11px;font-weight:800;color:#e2e8f8}
.nm-logo-text span{color:#34d399}
.nm-status{display:flex;align-items:center;gap:4px;font-size:8.5px;font-weight:700;
  letter-spacing:.08em;text-transform:uppercase;color:#f59e0b}
.nm-tgl{display:flex;align-items:center;gap:6px;padding:4px 10px;border-radius:7px;
  border:1.5px solid #1a2540;background:#0e1420;cursor:pointer;transition:all .14s;font-family:'Inter',sans-serif}
.nm-tgl:hover{border-color:#059669}

.nm-tabs{display:flex;border-bottom:1.5px solid #1a2540;background:#0e1420;overflow-x:auto}
.nm-tab{padding:0 14px;height:36px;border:none;border-bottom:2px solid transparent;
  background:transparent;color:#3d5070;cursor:pointer;
  font-family:'Inter',sans-serif;font-size:10.5px;font-weight:700;
  transition:all .14s;display:flex;align-items:center;gap:5px;white-space:nowrap}
.nm-tab.on{color:#34d399;border-bottom-color:#059669;background:rgba(5,150,105,.08);font-weight:800}
.nm-tab:hover:not(.on){color:#c7d2ee;background:rgba(255,255,255,.02)}

.nm-card{background:#0e1420;border:1.5px solid #1a2540;border-radius:10px}
.nm-inp{background:#080d18;border:1.5px solid #1e2d45;border-radius:7px;color:#e2e8f8;
  font-family:'JetBrains Mono',monospace;font-size:14px;padding:9px 12px;outline:none;width:100%;transition:all .14s}
.nm-inp:focus{border-color:#059669;box-shadow:0 0 0 3px rgba(5,150,105,.14)}
.nm-inp::placeholder{color:#1e2d45}
.nm-pbtn{display:inline-flex;align-items:center;gap:7px;padding:9px 22px;border:none;border-radius:7px;
  background:linear-gradient(135deg,#059669,#0891b2);color:#fff;cursor:pointer;
  font-family:'Inter',sans-serif;font-size:11.5px;font-weight:700;
  box-shadow:0 4px 16px rgba(5,150,105,.35);transition:all .16s}
.nm-pbtn:hover{box-shadow:0 8px 24px rgba(5,150,105,.48);transform:translateY(-1px)}
.nm-pbtn:disabled{opacity:.3;cursor:not-allowed;transform:none;box-shadow:none}
.nm-sbtn{display:inline-flex;align-items:center;gap:4px;padding:4px 11px;border-radius:6px;
  border:1.5px solid #1a2540;background:#080d18;color:#3d5070;cursor:pointer;
  font-family:'Inter',sans-serif;font-size:9.5px;font-weight:600;transition:all .12s}
.nm-sbtn:hover,.nm-sbtn.on{border-color:#059669;color:#34d399;background:rgba(5,150,105,.09)}
.nm-result-box{border:1.5px solid rgba(5,150,105,.28);border-radius:10px;
  background:linear-gradient(135deg,rgba(5,150,105,.08),rgba(6,182,212,.04));padding:14px 18px}
.nm-lbl{font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
  color:#34d399;display:block;margin-bottom:5px}
.nm-hint{font-size:11px;color:#3d5070;line-height:1.65;padding:8px 11px;
  border-radius:7px;background:rgba(5,150,105,.05);border-left:2px solid rgba(5,150,105,.28)}
.nm-step-n{width:22px;height:22px;border-radius:50%;border:1.5px solid rgba(5,150,105,.32);
  background:rgba(5,150,105,.1);display:flex;align-items:center;justify-content:center;
  font-size:9.5px;font-weight:700;color:#34d399;flex-shrink:0}
.nm-ad{background:#0b1120;border:1.5px dashed #151f30;border-radius:8px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;
  color:#1a2540;font-size:9px}
.nm-err{padding:9px 12px;border:1.5px solid rgba(239,68,68,.22);border-radius:8px;
  background:rgba(239,68,68,.05);font-size:12px;color:#f87171;line-height:1.55}
.nm-tag{display:inline-flex;align-items:center;padding:3px 8px;border-radius:6px;
  font-size:10px;font-weight:700;border:1.5px solid;gap:4px}
.nm-tag-green{background:rgba(5,150,105,.09);border-color:rgba(5,150,105,.28);color:#34d399}
.nm-tag-red{background:rgba(239,68,68,.07);border-color:rgba(239,68,68,.22);color:#f87171}
.nm-tag-blue{background:rgba(6,182,212,.07);border-color:rgba(6,182,212,.22);color:#22d3ee}
.nm-tag-yellow{background:rgba(245,158,11,.07);border-color:rgba(245,158,11,.22);color:#fbbf24}

/* ── ELEMENT TABLE COLOURS ─────────── */
.el-btn{display:inline-flex;align-items:center;justify-content:center;flex-direction:column;
  cursor:pointer;transition:all .13s;border-radius:3px;padding:2px 0;user-select:none;line-height:1.2}
.el-btn:hover{transform:scale(1.06)}

/* ── PERIODIC TABLE GRID ─────────────── */
.pt-grid{display:grid;grid-template-columns:repeat(18,1fr);gap:2px;overflow-x:auto}

/* prose for article */
.prose h3{font-size:18px;font-weight:700;margin:24px 0 10px}
.prose h4{font-size:15px;font-weight:700;margin:16px 0 8px}
.prose p{line-height:1.75;margin-bottom:12px;font-size:14px}
.prose ul{padding-left:20px;margin-bottom:12px}
.prose li{line-height:1.7;font-size:14px;margin-bottom:4px}
.prose strong{font-weight:700}
`;

/* ════════════════════════════════════════════════════════════
   SVG ICONS
════════════════════════════════════════════════════════════ */
const Svg = ({d,s=14,sw=1.8,fill="none"}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {(Array.isArray(d)?d:[d]).map((p,i)=><path key={i} d={p}/>)}
  </svg>
);
const I = {
  flask:  s=><Svg s={s} d={["M9 3h6","M10 3v4.586a1 1 0 0 1-.293.707L5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5l-4.707-4.707A1 1 0 0 1 14 7.586V3"]}/>,
  atom:   s=><Svg s={s} d={["M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0","M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z","M3 12c0-2.5 4.03-4.5 9-4.5s9 2 9 4.5-4.03 4.5-9 4.5-9-2-9-4.5z"]}/>,
  book:   s=><Svg s={s} d={["M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20","M12 7h4M12 11h4M12 15h4"]}/>,
  check:  s=><Svg s={s} d="M20 6 9 17l-5-5"/>,
  copy:   s=><Svg s={s} d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2","M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"]}/>,
  run:    s=><Svg s={s} d="M5 3l14 9-14 9V3z" sw={1.5}/>,
  info:   s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 16v-4M12 8h.01"]}/>,
  swap:   s=><Svg s={s} d={["M7 16V4m0 0L3 8m4-4 4 4","M17 8v12m0 0 4-4m-4 4-4-4"]}/>,
  mole:   s=><Svg s={s} d={["M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z","M8 12h8","M12 8v8"]}/>,
  warn:   s=><Svg s={s} d={["M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z","M12 9v4M12 17h.01"]}/>,
  calc:   s=><Svg s={s} d={["M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z","M9 9h6","M9 13h3","M13 17h2"]}/>,
  refresh:s=><Svg s={s} d="M1 4v6h6M23 20v-6h-6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>,
};

/* ════════════════════════════════════════════════════════════
   CHEMISTRY BALANCER ENGINE
   Uses algebraic method: parse → atom matrix → null-space → coefficients
════════════════════════════════════════════════════════════ */

// Parse a single compound like "H2O", "Ca(OH)2", "Fe2(SO4)3"
function parseCompound(s) {
  const atoms = {};
  function parseSegment(str, mult) {
    let i = 0;
    while (i < str.length) {
      if (str[i] === '(') {
        // find matching )
        let depth = 1, j = i + 1;
        while (j < str.length && depth > 0) {
          if (str[j] === '(') depth++;
          else if (str[j] === ')') depth--;
          j++;
        }
        // j now points after ')'
        const inner = str.slice(i + 1, j - 1);
        let numStr = '';
        while (j < str.length && str[j] >= '0' && str[j] <= '9') { numStr += str[j]; j++; }
        const n = numStr ? parseInt(numStr) : 1;
        parseSegment(inner, mult * n);
        i = j;
      } else if (str[i] >= 'A' && str[i] <= 'Z') {
        let el = str[i]; i++;
        while (i < str.length && str[i] >= 'a' && str[i] <= 'z') { el += str[i]; i++; }
        let numStr = '';
        while (i < str.length && str[i] >= '0' && str[i] <= '9') { numStr += str[i]; i++; }
        const n = numStr ? parseInt(numStr) : 1;
        atoms[el] = (atoms[el] || 0) + n * mult;
      } else {
        i++;
      }
    }
  }
  parseSegment(s, 1);
  return atoms;
}

// GCD and LCM helpers
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }
function lcm(a, b) { return a / gcd(a, b) * b; }
function gcdArr(arr) { return arr.reduce((g, v) => gcd(g, Math.abs(v)), 0); }

// Gaussian elimination on rational matrix
// matrix is array of rows (arrays of numbers), returns rref
function rref(matrix) {
  const M = matrix.map(r => [...r]);
  const rows = M.length, cols = M[0].length;
  let pivot = 0;
  for (let col = 0; col < cols && pivot < rows; col++) {
    // find pivot row
    let pr = -1;
    for (let r = pivot; r < rows; r++) {
      if (Math.abs(M[r][col]) > 1e-9) { pr = r; break; }
    }
    if (pr === -1) continue;
    [M[pivot], M[pr]] = [M[pr], M[pivot]];
    const pv = M[pivot][col];
    M[pivot] = M[pivot].map(v => v / pv);
    for (let r = 0; r < rows; r++) {
      if (r !== pivot && Math.abs(M[r][col]) > 1e-9) {
        const f = M[r][col];
        M[r] = M[r].map((v, c) => v - f * M[pivot][c]);
      }
    }
    pivot++;
  }
  return M;
}

// Main balancer: returns {coefficients, balanced, latex, steps, atomTable} or {error}
function balanceEquation(input) {
  try {
    // Normalise: allow = or -> or →
    const clean = input.trim().replace(/→|->|=>|⟶/g, '=').replace(/\s+/g, '');
    if (!clean.includes('=')) return { error: 'Use = to separate reactants and products. Example: H2 + O2 = H2O' };

    const [leftStr, rightStr] = clean.split('=');
    if (!leftStr || !rightStr) return { error: 'Both sides of the equation are required.' };

    const reactants = leftStr.split('+').filter(Boolean);
    const products  = rightStr.split('+').filter(Boolean);
    if (!reactants.length || !products.length) return { error: 'Each side must have at least one compound.' };

    const allCompounds = [...reactants, ...products];
    const compoundAtoms = allCompounds.map(c => parseCompound(c));

    // Check parsed OK
    for (let i = 0; i < compoundAtoms.length; i++) {
      if (!Object.keys(compoundAtoms[i]).length) return { error: `Could not parse compound: "${allCompounds[i]}"` };
    }

    // Collect all elements
    const elements = [...new Set(compoundAtoms.flatMap(ca => Object.keys(ca)))].sort();
    const nC = allCompounds.length;
    const nE = elements.length;

    // Build atom matrix (rows = elements, cols = compounds)
    // Reactants are positive, products are negative (moving to RHS)
    const A = [];
    for (let ei = 0; ei < nE; ei++) {
      const row = [];
      for (let ci = 0; ci < nC; ci++) {
        const val = (compoundAtoms[ci][elements[ei]] || 0);
        row.push(ci < reactants.length ? val : -val);
      }
      A.push(row);
    }

    // Augment with zero column (homogeneous system)
    const augmented = A.map(r => [...r, 0]);
    const R = rref(augmented);

    // Find free variables (columns without pivot)
    const pivotCols = new Set();
    for (let r = 0; r < R.length; r++) {
      for (let c = 0; c < nC; c++) {
        if (Math.abs(R[r][c] - 1) < 1e-9) { pivotCols.add(c); break; }
      }
    }
    const freeCols = [];
    for (let c = 0; c < nC; c++) if (!pivotCols.has(c)) freeCols.push(c);

    if (!freeCols.length) return { error: 'Equation cannot be balanced (no free variable found). Check the equation.' };

    // Set free variable = 1, back-substitute
    const coefs = new Array(nC).fill(0);
    for (const fc of freeCols) coefs[fc] = 1;
    for (let r = R.length - 1; r >= 0; r--) {
      let pivotC = -1;
      for (let c = 0; c < nC; c++) { if (Math.abs(R[r][c] - 1) < 1e-9) { pivotC = c; break; } }
      if (pivotC === -1) continue;
      let sum = 0;
      for (let c = 0; c < nC; c++) if (c !== pivotC) sum += R[r][c] * coefs[c];
      coefs[pivotC] = -sum;
    }

    // Convert to integers using LCM of denominators
    // First express as fractions: multiply all by LCM of denominators
    // We'll scale to make all positive integers
    // Find LCM of all "denominators" by approximating
    const PREC = 1000;
    const rounded = coefs.map(c => Math.round(c * PREC));
    const g = gcdArr(rounded.filter(v => v !== 0));
    let intCoefs = rounded.map(c => Math.round(c / g));

    // Make all positive (flip sign if majority negative)
    if (intCoefs.filter(v => v < 0).length > intCoefs.filter(v => v > 0).length) {
      intCoefs = intCoefs.map(v => -v);
    }

    // Final GCD reduction
    const g2 = gcdArr(intCoefs.filter(v => v !== 0));
    intCoefs = intCoefs.map(v => Math.round(v / g2));

    // Verify no zeros or negatives
    if (intCoefs.some(v => v <= 0)) {
      return { error: 'Could not find valid integer coefficients. The equation may not be balanceable as written.' };
    }

    // Verify balance
    const check = {};
    for (let ci = 0; ci < nC; ci++) {
      const side = ci < reactants.length ? 1 : -1;
      for (const [el, cnt] of Object.entries(compoundAtoms[ci])) {
        check[el] = (check[el] || 0) + side * intCoefs[ci] * cnt;
      }
    }
    const balanced = Object.values(check).every(v => Math.abs(v) < 1e-6);
    if (!balanced) return { error: 'Balancing verification failed. Please check your equation format.' };

    // Build output strings
    const formatCompound = (compound, coef) => (coef === 1 ? '' : coef.toString()) + compound;
    const reactantStrs = reactants.map((c, i) => formatCompound(c, intCoefs[i]));
    const productStrs  = products.map((c, i) => formatCompound(c, intCoefs[reactants.length + i]));
    const balancedStr  = reactantStrs.join(' + ') + ' → ' + productStrs.join(' + ');

    // Build LaTeX
    function compToLatex(c, coef) {
      let s = coef === 1 ? '' : coef.toString();
      s += c.replace(/([A-Z][a-z]?)(\d+)/g, (_, el, n) => `${el}_{${n}}`)
            .replace(/\(([^)]+)\)(\d+)/g, (_, inner, n) => `(${inner})_{${n}}`);
      return s;
    }
    const latexR = reactants.map((c, i) => compToLatex(c, intCoefs[i])).join(' + ');
    const latexP = products.map((c, i) => compToLatex(c, intCoefs[reactants.length + i])).join(' + ');
    const latexStr = `${latexR} \\rightarrow ${latexP}`;

    // Atom count table
    const atomTable = elements.map(el => {
      const left  = reactants.reduce((s, c, i) => s + intCoefs[i] * (compoundAtoms[i][el] || 0), 0);
      const right = products.reduce((s, c, i) => s + intCoefs[reactants.length + i] * (compoundAtoms[reactants.length + i][el] || 0), 0);
      return { el, left, right, ok: left === right };
    });

    // Molar mass (approximate, common elements)
    const MOLAR = {H:1.008,He:4,Li:6.9,Be:9.01,B:10.8,C:12.011,N:14.007,O:15.999,F:19,Ne:20.2,
      Na:22.99,Mg:24.3,Al:26.98,Si:28.09,P:30.97,S:32.06,Cl:35.45,Ar:39.95,K:39.1,Ca:40.08,
      Sc:45,Ti:47.87,V:50.94,Cr:52,Mn:54.94,Fe:55.84,Co:58.93,Ni:58.69,Cu:63.55,Zn:65.38,
      Ga:69.72,Ge:72.63,As:74.92,Se:78.97,Br:79.9,Kr:83.8,Rb:85.47,Sr:87.62,Y:88.9,Zr:91.22,
      Mo:95.95,Ag:107.87,Cd:112.41,In:114.82,Sn:118.71,Sb:121.76,Te:127.6,I:126.9,Cs:132.9,
      Ba:137.33,La:138.9,Ce:140.12,W:183.84,Pt:195.08,Au:196.97,Hg:200.59,Pb:207.2,Bi:208.98};
    const molarMasses = allCompounds.map(c => {
      const atoms = parseCompound(c);
      const mm = Object.entries(atoms).reduce((s, [el, n]) => s + (MOLAR[el] || 0) * n, 0);
      return +mm.toFixed(3);
    });

    // Steps for explanation
    const steps = [
      {
        t: 'Identify elements',
        d: `Found elements: ${elements.join(', ')}. There are ${allCompounds.length} compounds (${reactants.length} reactants, ${products.length} products).`,
        l: `\\text{Elements: } ${elements.map(e => `\\text{${e}}`).join(',\\,')}`,
      },
      {
        t: 'Build atom matrix',
        d: `Create a matrix where each row = one element, each column = one compound. Reactants are positive (+), products are negative (−).`,
        l: `A \\cdot \\mathbf{x} = \\mathbf{0} \\quad (\\text{${nE} equations, ${nC} unknowns})`,
      },
      {
        t: 'Gaussian elimination (RREF)',
        d: 'Reduce the matrix to Row-Reduced Echelon Form to identify the free variable and express other coefficients in terms of it.',
        l: `\\text{RREF}(A) \\Rightarrow \\text{set free variable} = 1`,
      },
      {
        t: 'Convert to integers',
        d: `Scale all coefficients to the smallest positive whole numbers using GCD reduction. Coefficients found: [${intCoefs.join(', ')}]`,
        l: `\\text{GCD reduction: coefficients} = [${intCoefs.join(',\\,')}]`,
      },
      {
        t: 'Verified balanced equation',
        d: 'Each element count is equal on both sides. Law of Conservation of Mass is satisfied.',
        l: latexStr,
        last: true,
      },
    ];

    return {
      balanced: balancedStr,
      latex: latexStr,
      coefficients: intCoefs,
      compounds: allCompounds,
      reactants,
      products,
      elements,
      atomTable,
      molarMasses,
      steps,
      error: null,
    };
  } catch (e) {
    return { error: `Parse error: ${e.message}. Check your equation format.` };
  }
}

/* ════════════════════════════════════════════════════════════
   KATEX LOADER
════════════════════════════════════════════════════════════ */
function useKatex() {
  const [ok, setOk] = useState(!!window.katex);
  useEffect(() => {
    if (window.katex) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(l);
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    s.onload = () => setOk(true); document.head.appendChild(s);
  }, []);
  return ok;
}

function KTeX({ latex, display = false, neon }) {
  if (window.katex) {
    try {
      const h = window.katex.renderToString(latex, { displayMode: display, throwOnError: false });
      return <span dangerouslySetInnerHTML={{ __html: h }} style={{ color: neon ? '#eef2ff' : '#e2e8f8' }} />;
    } catch (e) {}
  }
  return <code style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: display ? 16 : 12, color: neon ? '#00ffb4' : '#34d399' }}>{latex}</code>;
}

/* ════════════════════════════════════════════════════════════
   COPY BUTTON
════════════════════════════════════════════════════════════ */
function CopyBtn({ text, neon }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setOk(true); setTimeout(() => setOk(false), 1500); }}
      className={neon ? 'ft-sbtn' : 'nm-sbtn'} style={{ padding: '3px 8px', gap: 3 }}>
      {ok ? I.check(10) : I.copy(10)}{ok ? 'Copied' : 'Copy'}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════
   STEPS
════════════════════════════════════════════════════════════ */
function Steps({ steps, neon, katex }) {
  return (
    <div>{steps.map((s, i) => (
      <div key={i} style={{ display: 'flex', gap: 10, marginBottom: s.last ? 0 : 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <div className={neon ? 'ft-step-n' : 'nm-step-n'}>{i + 1}</div>
          {!s.last && <div style={{ flex: 1, width: 1, marginTop: 4, minHeight: 12, background: neon ? 'rgba(0,255,180,.08)' : 'rgba(5,150,105,.12)' }} />}
        </div>
        <div style={{ flex: 1, paddingBottom: s.last ? 0 : 4 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: neon ? '#cdd6ff' : '#e2e8f8', marginBottom: 2 }}>{s.t}</div>
          {s.d && <div style={{ fontSize: 11, color: neon ? 'rgba(0,255,180,.42)' : '#3d5070', marginBottom: 6, lineHeight: 1.6 }}>{s.d}</div>}
          <div style={{ padding: '7px 11px', border: neon ? '1px solid rgba(0,255,180,.09)' : '1.5px solid #1a2540', borderRadius: neon ? 3 : 7, background: neon ? 'rgba(0,0,0,.35)' : 'rgba(8,13,24,.7)', overflowX: 'auto' }}>
            {katex ? <KTeX latex={s.l} neon={neon} /> : <code style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: neon ? '#00ffb4' : '#34d399' }}>{s.l}</code>}
          </div>
        </div>
      </div>
    ))}</div>
  );
}

/* ════════════════════════════════════════════════════════════
   PERIODIC TABLE (common elements clickable keyboard)
════════════════════════════════════════════════════════════ */
const ELEMENTS_DATA = [
  {sym:'H', name:'Hydrogen',   grp:1,  row:1, cat:'nonmetal',   mass:1.008},
  {sym:'He',name:'Helium',     grp:18, row:1, cat:'noble',      mass:4.003},
  {sym:'Li',name:'Lithium',    grp:1,  row:2, cat:'alkali',     mass:6.941},
  {sym:'Be',name:'Beryllium',  grp:2,  row:2, cat:'alkaline',   mass:9.012},
  {sym:'B', name:'Boron',      grp:13, row:2, cat:'metalloid',  mass:10.81},
  {sym:'C', name:'Carbon',     grp:14, row:2, cat:'nonmetal',   mass:12.01},
  {sym:'N', name:'Nitrogen',   grp:15, row:2, cat:'nonmetal',   mass:14.01},
  {sym:'O', name:'Oxygen',     grp:16, row:2, cat:'nonmetal',   mass:16.00},
  {sym:'F', name:'Fluorine',   grp:17, row:2, cat:'halogen',    mass:19.00},
  {sym:'Ne',name:'Neon',       grp:18, row:2, cat:'noble',      mass:20.18},
  {sym:'Na',name:'Sodium',     grp:1,  row:3, cat:'alkali',     mass:22.99},
  {sym:'Mg',name:'Magnesium',  grp:2,  row:3, cat:'alkaline',   mass:24.31},
  {sym:'Al',name:'Aluminum',   grp:13, row:3, cat:'metal',      mass:26.98},
  {sym:'Si',name:'Silicon',    grp:14, row:3, cat:'metalloid',  mass:28.09},
  {sym:'P', name:'Phosphorus', grp:15, row:3, cat:'nonmetal',   mass:30.97},
  {sym:'S', name:'Sulfur',     grp:16, row:3, cat:'nonmetal',   mass:32.07},
  {sym:'Cl',name:'Chlorine',   grp:17, row:3, cat:'halogen',    mass:35.45},
  {sym:'Ar',name:'Argon',      grp:18, row:3, cat:'noble',      mass:39.95},
  {sym:'K', name:'Potassium',  grp:1,  row:4, cat:'alkali',     mass:39.10},
  {sym:'Ca',name:'Calcium',    grp:2,  row:4, cat:'alkaline',   mass:40.08},
  {sym:'Fe',name:'Iron',       grp:8,  row:4, cat:'metal',      mass:55.84},
  {sym:'Cu',name:'Copper',     grp:11, row:4, cat:'metal',      mass:63.55},
  {sym:'Zn',name:'Zinc',       grp:12, row:4, cat:'metal',      mass:65.38},
  {sym:'Br',name:'Bromine',    grp:17, row:4, cat:'halogen',    mass:79.90},
  {sym:'Ag',name:'Silver',     grp:11, row:5, cat:'metal',      mass:107.87},
  {sym:'I', name:'Iodine',     grp:17, row:5, cat:'halogen',    mass:126.9},
  {sym:'Ba',name:'Barium',     grp:2,  row:6, cat:'alkaline',   mass:137.33},
  {sym:'Pb',name:'Lead',       grp:14, row:6, cat:'metal',      mass:207.2},
  {sym:'Mn',name:'Manganese',  grp:7,  row:4, cat:'metal',      mass:54.94},
  {sym:'Cr',name:'Chromium',   grp:6,  row:4, cat:'metal',      mass:52.00},
  {sym:'Ni',name:'Nickel',     grp:10, row:4, cat:'metal',      mass:58.69},
];

const CAT_COLORS_NEON = {
  alkali:'rgba(255,100,100,.7)',alkaline:'rgba(255,180,60,.7)',metal:'rgba(100,200,255,.7)',
  metalloid:'rgba(180,100,255,.7)',nonmetal:'rgba(0,255,180,.7)',halogen:'rgba(0,180,255,.7)',
  noble:'rgba(200,200,100,.7)'
};
const CAT_COLORS_NM = {
  alkali:'#f87171',alkaline:'#fb923c',metal:'#60a5fa',
  metalloid:'#a78bfa',nonmetal:'#34d399',halogen:'#22d3ee',
  noble:'#facc15'
};

function ElementBtn({ el, neon, onClick }) {
  const c = neon ? CAT_COLORS_NEON[el.cat] : CAT_COLORS_NM[el.cat];
  return (
    <div title={`${el.name} (${el.mass})`} className="el-btn"
      onClick={() => onClick(el.sym)}
      style={{ width: 36, border: neon ? `1px solid ${c}33` : `1.5px solid ${c}44`, background: neon ? `${c}11` : `${c}18`, borderRadius: neon ? 2 : 5 }}>
      <span style={{ fontSize: 8, color: neon ? 'rgba(200,220,255,.4)' : '#64748b', fontFamily: 'JetBrains Mono,monospace' }}>{el.mass < 10 ? el.mass.toFixed(0) : el.mass.toFixed(0)}</span>
      <span style={{ fontSize: 12, fontWeight: 800, color: c, lineHeight: 1, fontFamily: 'JetBrains Mono,monospace' }}>{el.sym}</span>
      <span style={{ fontSize: 6.5, color: neon ? 'rgba(200,220,255,.35)' : '#475569', lineHeight: 1 }}>{el.name.length > 7 ? el.name.slice(0, 6) + '.' : el.name}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PRESET REACTIONS
════════════════════════════════════════════════════════════ */
const PRESETS = [
  { label: 'Combustion of methane',  eq: 'CH4 + O2 = CO2 + H2O',        category: 'Combustion' },
  { label: 'Water synthesis',         eq: 'H2 + O2 = H2O',               category: 'Synthesis' },
  { label: 'Photosynthesis',          eq: 'CO2 + H2O = C6H12O6 + O2',    category: 'Biochemistry' },
  { label: 'Iron rusting',            eq: 'Fe + O2 = Fe2O3',             category: 'Oxidation' },
  { label: 'Ammonia synthesis',       eq: 'N2 + H2 = NH3',               category: 'Industrial' },
  { label: 'Calcium carbonate decomp',eq: 'CaCO3 = CaO + CO2',          category: 'Decomposition' },
  { label: 'Aluminium + HCl',         eq: 'Al + HCl = AlCl3 + H2',      category: 'Single replacement' },
  { label: 'Glucose combustion',      eq: 'C6H12O6 + O2 = CO2 + H2O',   category: 'Combustion' },
  { label: 'Zinc + H₂SO₄',           eq: 'Zn + H2SO4 = ZnSO4 + H2',    category: 'Acid-metal' },
  { label: 'Copper + HNO₃',          eq: 'Cu + HNO3 = Cu(NO3)2 + H2O + NO', category: 'Acid-metal' },
  { label: 'Fe₂O₃ reduction',        eq: 'Fe2O3 + CO = Fe + CO2',       category: 'Reduction' },
  { label: 'Silver nitrate + NaCl',   eq: 'AgNO3 + NaCl = AgCl + NaNO3', category: 'Double replacement' },
];

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
export default function ChemistryBalancer() {
  const [mode, setMode] = useState('futuristic');
  const [equation, setEquation] = useState('CH4 + O2 = CO2 + H2O');
  const [showElements, setShowElements] = useState(false);
  const [activeTab, setActiveTab] = useState('balancer');
  const inputRef = useRef();
  const katex = useKatex();
  const neon = mode === 'futuristic';
  const s = neon;

  const result = useMemo(() => balanceEquation(equation), [equation]);

  const insertAt = useCallback((text) => {
    const inp = inputRef.current;
    if (!inp) { setEquation(p => p + text); return; }
    const start = inp.selectionStart, end = inp.selectionEnd;
    const next = equation.slice(0, start) + text + equation.slice(end);
    setEquation(next);
    setTimeout(() => { inp.selectionStart = inp.selectionEnd = start + text.length; inp.focus(); }, 0);
  }, [equation]);

  const TABS = [
    { id: 'balancer', label: 'Balancer',    ico: 'flask' },
    { id: 'guide',    label: 'How to Use',  ico: 'info' },
    { id: 'article',  label: 'Learn',       ico: 'book' },
  ];

  // ── topbar colour vars
  const accent = neon ? '#00ffb4' : '#34d399';

  return (
    <>
      <style>{STYLES}</style>
      <AnimatePresence mode="wait">
        {neon ? (
          <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22 }}>
            <div className="ft">
              <div className="scanline" />
              <AppShell neon equation={equation} setEquation={setEquation} result={result}
                showElements={showElements} setShowElements={setShowElements}
                activeTab={activeTab} setActiveTab={setActiveTab}
                inputRef={inputRef} insertAt={insertAt} katex={katex}
                onSwitch={() => setMode('normal')} TABS={TABS} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="m" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22 }}>
            <div className="nm">
              <AppShell neon={false} equation={equation} setEquation={setEquation} result={result}
                showElements={showElements} setShowElements={setShowElements}
                activeTab={activeTab} setActiveTab={setActiveTab}
                inputRef={inputRef} insertAt={insertAt} katex={katex}
                onSwitch={() => setMode('futuristic')} TABS={TABS} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   APP SHELL
════════════════════════════════════════════════════════════ */
function AppShell({ neon, equation, setEquation, result, showElements, setShowElements,
  activeTab, setActiveTab, inputRef, insertAt, katex, onSwitch, TABS }) {
  const s = neon;

  return (
    <div>
      {/* ── TOPBAR ── */}
      <div className={s ? 'ft-bar' : 'nm-bar'}>
        <div className={s ? 'ft-logo' : 'nm-logo'}>
          <div className={s ? 'ft-logo-icon' : 'nm-logo-icon'}>{I.flask(12)}</div>
          <span className={s ? 'ft-logo-text' : 'nm-logo-text'}>
            Chem<span>Balancer</span>
          </span>
          {s && <span className="ft-chip">Free · Algebraic</span>}
        </div>
        <div style={{ flex: 1 }} />
        {result && !result.error && (
          <div className={s ? 'ft-status' : 'nm-status'} style={{ color: s ? '#00ffb4' : '#34d399' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
            Balanced
          </div>
        )}
        <button className={s ? 'ft-tgl' : 'nm-tgl'} onClick={onSwitch} style={{ gap: 5 }}>
          {s ? (<>
            <div style={{ width: 26, height: 14, borderRadius: 7, background: '#00ffb4', position: 'relative', boxShadow: '0 0 6px rgba(0,255,180,.4)' }}>
              <div style={{ position: 'absolute', top: 2, right: 2, width: 10, height: 10, borderRadius: '50%', background: '#03030d' }} />
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(0,255,180,.55)', letterSpacing: '.08em' }}>NEON</span>
          </>) : (<>
            <span style={{ fontSize: 10, color: '#3d5070', fontWeight: 600 }}>Normal</span>
            <div style={{ width: 26, height: 14, borderRadius: 7, background: '#1a2540', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 2, left: 2, width: 10, height: 10, borderRadius: '50%', background: '#3d5070' }} />
            </div>
          </>)}
        </button>
      </div>

      {/* ── TABS ── */}
      <div className={s ? 'ft-tabs' : 'nm-tabs'}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={s ? `ft-tab ${activeTab === t.id ? 'on' : ''}` : `nm-tab ${activeTab === t.id ? 'on' : ''}`}>
            {I[t.ico] ? I[t.ico](11) : null} {t.label}
          </button>
        ))}
      </div>

      {/* ── BODY ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 272px', minHeight: 'calc(100vh - 68px)' }}>

        {/* ── LEFT ── */}
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 13 }}>

          <AnimatePresence mode="wait">
            {activeTab === 'balancer' && (
              <motion.div key="bal" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                {/* hint */}
                <div className={s ? 'ft-hint' : 'nm-hint'} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                  {I.info(12)}
                  <span>Enter a chemical equation using element symbols. Use <strong>+</strong> between compounds and <strong>=</strong> to separate reactants from products. Example: <strong>CH4 + O2 = CO2 + H2O</strong></span>
                </div>

                {/* Input */}
                <div>
                  <label className={s ? 'ft-lbl' : 'nm-lbl'}>Chemical Equation</label>
                  <div style={{ position: 'relative' }}>
                    <input ref={inputRef} className={s ? 'ft-inp' : 'nm-inp'}
                      value={equation} onChange={e => setEquation(e.target.value)}
                      placeholder="e.g.  CH4 + O2 = CO2 + H2O"
                      style={{ paddingRight: 80 }} />
                    <div style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 4 }}>
                      <button className={s ? 'ft-sbtn' : 'nm-sbtn'} style={{ padding: '3px 7px', gap: 3 }}
                        onClick={() => setEquation('')} title="Clear">{I.refresh(9)} Clear</button>
                    </div>
                  </div>

                  {/* Element keyboard toggle */}
                  <button className={`${s ? 'ft-sbtn' : 'nm-sbtn'} ${showElements ? 'on' : ''}`}
                    onClick={() => setShowElements(p => !p)}
                    style={{ marginTop: 7, padding: '4px 11px', gap: 4 }}>
                    {I.atom(11)} {showElements ? 'Hide' : 'Show'} Element Keyboard
                  </button>

                  <AnimatePresence>
                    {showElements && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginTop: 8 }}>
                        <div className={s ? 'ft-card' : 'nm-card'} style={{ padding: 10 }}>
                          <div style={{ fontSize: 8.5, fontWeight: 700, color: s ? 'rgba(0,255,180,.4)' : '#34d399', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>
                            Click element to insert · Numbers and parentheses: type manually
                          </div>
                          {/* category legend */}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 9 }}>
                            {Object.entries(CAT_COLORS_NEON).map(([cat]) => (
                              <span key={cat} style={{ fontSize: 8, padding: '1px 6px', borderRadius: 2, background: s ? `${CAT_COLORS_NEON[cat]}18` : `${CAT_COLORS_NM[cat]}22`, color: s ? CAT_COLORS_NEON[cat] : CAT_COLORS_NM[cat], border: `1px solid ${s ? CAT_COLORS_NEON[cat] : CAT_COLORS_NM[cat]}44`, fontWeight: 600 }}>
                                {cat}
                              </span>
                            ))}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {ELEMENTS_DATA.map(el => (
                              <ElementBtn key={el.sym} el={el} neon={s} onClick={sym => insertAt(sym)} />
                            ))}
                          </div>
                          {/* operators */}
                          <div style={{ display: 'flex', gap: 5, marginTop: 9, flexWrap: 'wrap' }}>
                            {['+', '=', '(', ')', '2', '3', '4', '5', '6'].map(k => (
                              <button key={k} className={s ? 'ft-sbtn' : 'nm-sbtn'}
                                onClick={() => insertAt(k)} style={{ padding: '3px 9px', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, fontWeight: 700 }}>{k}</button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Error */}
                {result.error && (
                  <div className={s ? 'ft-err' : 'nm-err'}>
                    {I.warn(13)} &nbsp;{result.error}
                  </div>
                )}

                {/* RESULT */}
                {!result.error && result.balanced && (
                  <motion.div key={result.balanced} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="fade-in">
                    {/* Balanced equation box */}
                    <div className={s ? 'ft-result-box' : 'nm-result-box'}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 8.5, fontWeight: 700, color: s ? 'rgba(0,255,180,.5)' : '#34d399', letterSpacing: '.15em', textTransform: 'uppercase' }}>
                          Balanced Equation
                        </span>
                        <CopyBtn text={result.balanced} neon={s} />
                      </div>
                      <div style={{ overflowX: 'auto', textAlign: 'center', padding: '6px 0', minHeight: 40 }}>
                        {katex
                          ? <KTeX latex={result.latex} display neon={s} />
                          : <code style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 16, color: s ? '#00ffb4' : '#34d399' }}>{result.balanced}</code>}
                      </div>
                    </div>

                    {/* Coefficient badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                      {result.compounds.map((c, i) => {
                        const isReactant = i < result.reactants.length;
                        return (
                          <div key={i} className={s ? `ft-tag ${isReactant ? 'ft-tag-blue' : 'ft-tag-green'}` : `nm-tag ${isReactant ? 'nm-tag-blue' : 'nm-tag-green'}`}>
                            <span style={{ opacity: .7, fontSize: 9 }}>{isReactant ? 'Reactant' : 'Product'}</span>
                            <span style={{ fontFamily: 'JetBrains Mono,monospace', fontWeight: 800 }}>
                              {result.coefficients[i] === 1 ? '' : result.coefficients[i]}{c}
                            </span>
                            <span style={{ opacity: .6, fontSize: 9 }}>{result.molarMasses[i] > 0 ? `${result.molarMasses[i]} g/mol` : ''}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Atom count verification table */}
                    <div className={s ? 'ft-card' : 'nm-card'} style={{ padding: 13, marginTop: 10 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: s ? 'rgba(0,255,180,.45)' : '#34d399', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                        Atom Count Verification
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: s ? 'rgba(0,255,180,.4)' : '#3d5070' }}>
                            <td style={{ padding: '4px 8px 8px' }}>Element</td>
                            <td style={{ padding: '4px 8px 8px', textAlign: 'center' }}>Reactants</td>
                            <td style={{ padding: '4px 8px 8px', textAlign: 'center' }}>Products</td>
                            <td style={{ padding: '4px 8px 8px', textAlign: 'center' }}>Balance</td>
                          </tr>
                        </thead>
                        <tbody>
                          {result.atomTable.map((row) => (
                            <tr key={row.el} style={{ borderTop: s ? '1px solid rgba(0,255,180,.06)' : '1.5px solid #1a2540' }}>
                              <td style={{ padding: '6px 8px', fontFamily: 'JetBrains Mono,monospace', fontSize: 13, fontWeight: 700, color: s ? '#00ffb4' : '#34d399' }}>{row.el}</td>
                              <td style={{ padding: '6px 8px', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 13, color: s ? '#eef2ff' : '#e2e8f8' }}>{row.left}</td>
                              <td style={{ padding: '6px 8px', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 13, color: s ? '#eef2ff' : '#e2e8f8' }}>{row.right}</td>
                              <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                                <span className={s ? `ft-tag ${row.ok ? 'ft-tag-green' : 'ft-tag-red'}` : `nm-tag ${row.ok ? 'nm-tag-green' : 'nm-tag-red'}`} style={{ padding: '1px 7px' }}>
                                  {row.ok ? '✓ Balanced' : '✗ Unbalanced'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Molar masses summary */}
                    <div className={s ? 'ft-card' : 'nm-card'} style={{ padding: 13, marginTop: 10 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: s ? 'rgba(0,255,180,.45)' : '#34d399', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 9 }}>
                        Molar Masses
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {result.compounds.map((c, i) => (
                          result.molarMasses[i] > 0 && (
                            <div key={i} style={{ fontSize: 11, color: s ? 'rgba(0,255,180,.55)' : '#3d5070' }}>
                              <code style={{ fontFamily: 'JetBrains Mono,monospace', color: s ? '#00ffb4' : '#34d399', fontWeight: 700 }}>{c}</code>
                              <span style={{ marginLeft: 4 }}>{result.molarMasses[i]} g/mol</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>

                    {/* Step-by-step */}
                    <div className={s ? 'ft-card' : 'nm-card'} style={{ padding: 14, marginTop: 10 }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: s ? 'rgba(0,255,180,.45)' : '#34d399', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 13 }}>
                        Step-by-Step Solution
                      </div>
                      <Steps steps={result.steps} neon={s} katex={katex} />
                    </div>
                  </motion.div>
                )}

                <div className={s ? 'ft-ad' : 'nm-ad'} style={{ height: 90, marginTop: 4 }}>
                  <span>Advertisement</span>
                </div>
              </motion.div>
            )}

            {activeTab === 'guide' && (
              <motion.div key="guide" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <HowToUse neon={s} />
              </motion.div>
            )}

            {activeTab === 'article' && (
              <motion.div key="art" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Article neon={s} katex={katex} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div style={{ borderLeft: s ? '1px solid rgba(0,255,180,.07)' : '1.5px solid #1a2540', background: s ? 'rgba(3,3,13,.97)' : '#0e1420', padding: '14px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div className={s ? 'ft-ad' : 'nm-ad'} style={{ height: 120 }}>
            <span>Advertisement</span>
          </div>

          {/* Presets */}
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, color: s ? 'rgba(0,255,180,.4)' : '#34d399', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 8 }}>
              Preset Reactions
            </div>
            {PRESETS.map((p, i) => (
              <button key={i} onClick={() => { setEquation(p.eq); setActiveTab('balancer'); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: 4, padding: '6px 9px', border: s ? '1px solid rgba(0,255,180,.07)' : '1.5px solid #1a2540', borderRadius: s ? 2 : 7, background: 'transparent', cursor: 'pointer', fontFamily: 'Inter', fontSize: 10, color: s ? 'rgba(0,255,180,.38)' : '#3d5070', transition: 'all .12s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s ? 'rgba(0,255,180,.3)' : '#059669'; e.currentTarget.style.color = s ? '#00ffb4' : '#34d399'; e.currentTarget.style.background = s ? 'rgba(0,255,180,.04)' : 'rgba(5,150,105,.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = s ? 'rgba(0,255,180,.07)' : '#1a2540'; e.currentTarget.style.color = s ? 'rgba(0,255,180,.38)' : '#3d5070'; e.currentTarget.style.background = 'transparent'; }}>
                <span style={{ fontSize: 7.5, opacity: .4, marginRight: 5, letterSpacing: '.1em', textTransform: 'uppercase' }}>{p.category}</span>
                {p.label}
              </button>
            ))}
          </div>

          {/* How-to quick */}
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, color: s ? 'rgba(0,255,180,.4)' : '#34d399', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 8 }}>
              Quick Guide
            </div>
            {[
              ['1', 'Type equation', 'Use = to separate sides'],
              ['2', 'Use + between', 'compounds on each side'],
              ['3', 'Click Balance', 'Auto-computed instantly'],
              ['⚗', 'Element keys', '"Show Element Keyboard"'],
              ['✓', 'Verification', 'Atom table shows balance'],
            ].map(([n, t, d]) => (
              <div key={n} style={{ display: 'flex', gap: 7, marginBottom: 8, alignItems: 'flex-start' }}>
                <div style={{ width: 17, height: 17, borderRadius: '50%', flexShrink: 0, marginTop: 1, background: s ? 'rgba(0,255,180,.08)' : 'rgba(5,150,105,.1)', border: s ? '1px solid rgba(0,255,180,.22)' : '1.5px solid rgba(5,150,105,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: s ? '#00ffb4' : '#34d399' }}>{n}</div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: s ? 'rgba(200,220,255,.75)' : '#c7d2ee', lineHeight: 1.3 }}>{t}</div>
                  <div style={{ fontSize: 9.5, color: s ? 'rgba(0,255,180,.32)' : '#3d5070', lineHeight: 1.4 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Syntax reference */}
          <div>
            <div style={{ fontSize: 8.5, fontWeight: 700, color: s ? 'rgba(0,255,180,.4)' : '#34d399', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 8 }}>
              Format Reference
            </div>
            {[
              ['H2O', 'Water'],
              ['Ca(OH)2', 'Calcium hydroxide'],
              ['Fe2(SO4)3', 'Iron(III) sulfate'],
              ['CH4', 'Methane'],
              ['C6H12O6', 'Glucose'],
              ['NH3', 'Ammonia'],
            ].map(([f, n]) => (
              <div key={f} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <code style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10.5, color: s ? 'rgba(0,255,180,.7)' : '#34d399' }}>{f}</code>
                <span style={{ fontSize: 9.5, color: s ? 'rgba(0,255,180,.32)' : '#3d5070' }}>{n}</span>
              </div>
            ))}
          </div>

          <div className={s ? 'ft-ad' : 'nm-ad'} style={{ height: 150, marginTop: 'auto' }}>
            <span>Advertisement</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   HOW TO USE TAB
════════════════════════════════════════════════════════════ */
function HowToUse({ neon }) {
  const s = neon;
  const steps = [
    { ico: 'flask', title: 'Enter the unbalanced equation', body: 'Type the chemical equation in the input box. Separate reactants and products with an equals sign (=). Separate multiple compounds on each side with plus signs (+).', example: 'CH4 + O2 = CO2 + H2O' },
    { ico: 'atom', title: 'Use the Element Keyboard', body: 'Click "Show Element Keyboard" to reveal a clickable panel of common elements. Click any element symbol to insert it at your cursor position. Type subscript numbers manually.', example: 'Click O → type 2 → get O2' },
    { ico: 'calc', title: 'Read the balanced result', body: 'The tool instantly computes the balanced equation using Gaussian elimination (linear algebra). The balanced formula appears with a verification table showing atom counts on both sides.', example: '2H₂ + O₂ → 2H₂O  ✓' },
    { ico: 'book', title: 'Understand each step', body: 'Scroll down to "Step-by-Step Solution" to see exactly how the coefficients were found — from building the atom matrix to RREF to GCD reduction.', example: 'Matrix → RREF → integers' },
    { ico: 'mole', title: 'Use preset reactions', body: 'Browse the sidebar to load any of the 12 pre-built reaction examples, from combustion to acid-metal reactions.', example: 'Click any preset in sidebar →' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className={s ? 'ft-hint' : 'nm-hint'} style={{ display: 'flex', gap: 7 }}>
        {I.info(13)} <span>This tool uses <strong>linear algebra</strong> (Gaussian elimination) to balance any chemical equation automatically.</span>
      </div>
      {steps.map((st, i) => (
        <div key={i} className={s ? 'ft-card' : 'nm-card'} style={{ padding: 14 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 34, height: 34, borderRadius: s ? 3 : 9, background: s ? 'rgba(0,255,180,.08)' : 'rgba(5,150,105,.1)', border: s ? '1px solid rgba(0,255,180,.2)' : '1.5px solid rgba(5,150,105,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s ? '#00ffb4' : '#34d399', flexShrink: 0 }}>
              {I[st.ico]?.(20)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: s ? '#cdd6ff' : '#e2e8f8', marginBottom: 5 }}>
                Step {i + 1}: {st.title}
              </div>
              <div style={{ fontSize: 12, color: s ? 'rgba(0,255,180,.45)' : '#3d5070', lineHeight: 1.7, marginBottom: 8 }}>{st.body}</div>
              <code style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: s ? '#00ffb4' : '#34d399', background: s ? 'rgba(0,255,180,.05)' : 'rgba(5,150,105,.06)', padding: '3px 9px', borderRadius: s ? 2 : 5, border: s ? '1px solid rgba(0,255,180,.12)' : '1.5px solid rgba(5,150,105,.18)' }}>{st.example}</code>
            </div>
          </div>
        </div>
      ))}
      <div className={s ? 'ft-ad' : 'nm-ad'} style={{ height: 90 }}>
        <span>Advertisement</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ARTICLE / SEO TAB
════════════════════════════════════════════════════════════ */
function Article({ neon, katex }) {
  const s = neon;
  const tc = s ? '#cdd6ff' : '#e2e8f8';
  const sc = s ? 'rgba(0,255,180,.42)' : '#3d5070';
  const ac = s ? '#00ffb4' : '#34d399';
  const bc = s ? 'rgba(0,255,180,.07)' : 'rgba(5,150,105,.06)';
  const bdrc = s ? 'rgba(0,255,180,.12)' : 'rgba(5,150,105,.18)';
  const faqBg = s ? 'rgba(6,6,22,.8)' : '#080d18';
  const faqBdr = s ? 'rgba(0,255,180,.09)' : '#1a2540';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className={s ? 'ft-card' : 'nm-card'} style={{ padding: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: s ? 3 : 10, background: s ? 'rgba(0,255,180,.08)' : 'rgba(5,150,105,.1)', border: s ? '1px solid rgba(0,255,180,.2)' : '1.5px solid rgba(5,150,105,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: ac }}>
            {I.book(20)}
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: tc, lineHeight: 1.2 }}>How to Balance Chemical Equations</h1>
            <p style={{ fontSize: 11, color: sc, marginTop: 3 }}>A complete guide to stoichiometry and the algebraic method</p>
          </div>
        </div>

        <div className="prose" style={{ color: tc }}>
          <p style={{ color: sc }}>
            Balancing a chemical equation is one of the most fundamental skills in chemistry. It ensures that the <strong style={{ color: tc }}>Law of Conservation of Mass</strong> is respected — meaning the same number of atoms of each element must appear on both sides of the reaction arrow.
          </p>

          <h3 style={{ color: tc }}>Why Balance Chemical Equations?</h3>
          <p style={{ color: sc }}>
            An unbalanced equation is scientifically incorrect. For example, writing H₂ + O₂ → H₂O implies that one oxygen atom disappears — which is physically impossible. The balanced form, 2H₂ + O₂ → 2H₂O, satisfies conservation of mass and gives correct <strong style={{ color: tc }}>stoichiometric ratios</strong> for real-world calculations.
          </p>

          <h3 style={{ color: tc }}>The Traditional Trial-and-Error Method</h3>
          <p style={{ color: sc }}>
            Most textbooks teach a step-by-step approach: start with the most complex molecule, balance one element at a time, and adjust coefficients until all elements match. This works for simple equations but quickly becomes difficult for reactions with 4+ compounds or complex ions.
          </p>
          <ul style={{ color: sc }}>
            <li><strong style={{ color: tc }}>Start with the most complex molecule</strong> — it usually involves the most elements.</li>
            <li><strong style={{ color: tc }}>Balance free elements last</strong> — O₂ and H₂ are easy to adjust at the end.</li>
            <li><strong style={{ color: tc }}>Use fractions temporarily</strong> — then multiply through to clear them.</li>
            <li><strong style={{ color: tc }}>Always verify</strong> — count every atom on both sides.</li>
          </ul>

          <h3 style={{ color: tc }}>The Algebraic Method (How This Tool Works)</h3>
          <p style={{ color: sc }}>
            For any equation, assign a variable to each compound's coefficient (a, b, c, d…). For every element, write an equation stating that the total atoms on the left equals the total atoms on the right. This gives a <strong style={{ color: tc }}>system of linear equations</strong>.
          </p>
          <p style={{ color: sc }}>
            This tool builds an <strong style={{ color: tc }}>atom matrix</strong> and applies <strong style={{ color: tc }}>Gaussian elimination</strong> to find the null space — the set of coefficients that make every equation zero (i.e., perfectly balanced). Finally, <strong style={{ color: tc }}>GCD reduction</strong> converts the result into the smallest whole-number coefficients.
          </p>
          <div style={{ padding: '10px 14px', background: bc, border: `1px solid ${bdrc}`, borderRadius: s ? 3 : 8, margin: '12px 0', overflowX: 'auto', textAlign: 'center' }}>
            {katex
              ? <span dangerouslySetInnerHTML={{ __html: window.katex?.renderToString('A \\cdot \\mathbf{x} = \\mathbf{0} \\quad \\Rightarrow \\quad \\text{RREF}(A) \\Rightarrow \\mathbf{x} = \\text{integer coefficients}', { displayMode: true, throwOnError: false }) || '' }} style={{ color: tc }} />
              : <code style={{ fontFamily: 'JetBrains Mono,monospace', color: ac }}>A·x = 0  →  RREF(A)  →  integer coefficients</code>}
          </div>

          <h3 style={{ color: tc }}>Understanding Stoichiometry</h3>
          <p style={{ color: sc }}>
            Once balanced, the coefficients tell you the molar ratios of reactants and products. In 2H₂ + O₂ → 2H₂O, exactly <strong style={{ color: tc }}>2 moles of hydrogen</strong> react with <strong style={{ color: tc }}>1 mole of oxygen</strong> to produce <strong style={{ color: tc }}>2 moles of water</strong>. These ratios are used to calculate masses, volumes, and limiting reagents.
          </p>

          <h3 style={{ color: tc }}>Types of Chemical Reactions</h3>
          <ul style={{ color: sc }}>
            <li><strong style={{ color: tc }}>Synthesis</strong> — Two substances combine: A + B → AB</li>
            <li><strong style={{ color: tc }}>Decomposition</strong> — One compound breaks down: AB → A + B</li>
            <li><strong style={{ color: tc }}>Single replacement</strong> — One element displaces another: A + BC → AC + B</li>
            <li><strong style={{ color: tc }}>Double replacement</strong> — Two compounds exchange ions: AB + CD → AD + CB</li>
            <li><strong style={{ color: tc }}>Combustion</strong> — A substance reacts with oxygen to release energy</li>
            <li><strong style={{ color: tc }}>Redox</strong> — Electrons are transferred between reactants</li>
          </ul>

          <h3 style={{ color: tc }}>FAQ</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { q: "Why can't I change the subscripts?", a: "Subscripts define the substance's identity. H₂O is water; H₂O₂ is hydrogen peroxide. You can only change the coefficients in front." },
              { q: "What does the arrow (→) mean?", a: "It indicates the direction of reaction — from reactants (left) to products (right). It can be read as 'reacts to form' or 'yields'." },
              { q: "Can all equations be balanced?", a: "All valid chemical reactions can be balanced. If the balancer returns an error, check that your equation is chemically valid and that all symbols are correct." },
              { q: "What are polyatomic ions like SO₄²⁻?", a: "Enter them as part of the compound formula, e.g. H2SO4 for sulfuric acid. The balancer tracks individual atoms, not ions." },
              { q: "Why are coefficients the smallest whole numbers?", a: "By convention, we use the simplest integer ratios. Multiplying every coefficient by the same number gives an equivalent equation but is non-standard." },
            ].map(({ q, a }, i) => (
              <div key={i} style={{ padding: '11px 14px', background: faqBg, border: `1px solid ${faqBdr}`, borderRadius: s ? 3 : 9 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: tc, marginBottom: 5 }}>{q}</div>
                <div style={{ fontSize: 11.5, color: sc, lineHeight: 1.65 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={s ? 'ft-ad' : 'nm-ad'} style={{ height: 90 }}>
        <span>Advertisement</span>
      </div>
    </div>
  );
}