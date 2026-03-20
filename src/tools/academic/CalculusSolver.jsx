import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as math from 'mathjs';

/* ══════════════════════════════════════════════════
   GLOBAL STYLES — compact, ad-friendly, clear UI
══════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Fira+Code:wght@400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{overflow-x:hidden;font-family:'Space Grotesk',sans-serif}

  @keyframes pulse2{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
  @keyframes gridmove{from{background-position:0 0}to{background-position:32px 32px}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
  @keyframes glow{0%,100%{box-shadow:0 0 8px rgba(0,212,255,.3)}50%{box-shadow:0 0 20px rgba(0,212,255,.6)}}

  /* NEON THEME */
  .n {--c1:#00d4ff;--c2:#7b2fff;--c3:#ff6b35;--ok:#00e676;--bg:#060612;--s1:#0d0d1f;--s2:#12122a;
    --txt:#eef2ff;--sub:#6b7bb8;--bdr:#1c1c3a;--accent:#00d4ff;
    font-family:'Space Grotesk',sans-serif;background:var(--bg);color:var(--txt);min-height:100vh;
    background-image:linear-gradient(rgba(0,212,255,.012) 1px,transparent 1px),
      linear-gradient(90deg,rgba(0,212,255,.012) 1px,transparent 1px);
    background-size:32px 32px;animation:gridmove 16s linear infinite}

  .n .panel{background:linear-gradient(145deg,rgba(13,13,31,.97),rgba(9,9,22,1));
    border:1px solid var(--bdr);border-radius:6px;position:relative;overflow:hidden}
  .n .panel::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
    background:linear-gradient(90deg,transparent,rgba(0,212,255,.025),transparent);
    animation:shimmer 6s ease infinite}

  .n .btn-primary{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;
    border:1px solid var(--c1);border-radius:4px;background:rgba(0,212,255,.08);color:var(--c1);
    cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:700;
    letter-spacing:.1em;text-transform:uppercase;transition:all .2s;position:relative;overflow:hidden}
  .n .btn-primary:hover{background:rgba(0,212,255,.15);box-shadow:0 0 20px rgba(0,212,255,.25);transform:translateY(-1px)}
  .n .btn-primary:disabled{opacity:.3;cursor:not-allowed;transform:none}

  .n .btn-sm{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;
    border:1px solid var(--bdr);border-radius:3px;background:transparent;color:var(--sub);
    cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:600;
    letter-spacing:.08em;transition:all .15s}
  .n .btn-sm:hover,.n .btn-sm.on{border-color:var(--c1);color:var(--c1);background:rgba(0,212,255,.07)}

  .n .inp{background:rgba(0,0,0,.55);border:1px solid var(--bdr);border-radius:4px;color:var(--txt);
    font-family:'Fira Code',monospace;font-size:13px;padding:8px 11px;outline:none;
    transition:border-color .18s;width:100%}
  .n .inp:focus{border-color:var(--c1);box-shadow:0 0 0 2px rgba(0,212,255,.12)}

  .n .sel{background:rgba(0,0,0,.55);border:1px solid var(--bdr);border-radius:4px;color:var(--txt);
    font-family:'Space Grotesk',sans-serif;font-size:11px;padding:7px 9px;outline:none;cursor:pointer;width:100%}
  .n .sel:focus{border-color:var(--c1)}

  .n .tab{flex:1;padding:9px 4px;border:none;background:transparent;color:var(--sub);cursor:pointer;
    font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;letter-spacing:.1em;
    text-transform:uppercase;border-bottom:2px solid transparent;transition:all .17s;
    display:flex;align-items:center;justify-content:center;gap:4px}
  .n .tab.on{color:var(--c1);border-bottom-color:var(--c1);background:rgba(0,212,255,.04)}
  .n .tab:hover:not(.on){color:var(--txt)}

  .n .kbd{padding:3px 7px;border:1px solid rgba(0,212,255,.2);border-radius:3px;
    background:rgba(0,212,255,.06);color:rgba(0,212,255,.85);font-family:'Fira Code',monospace;
    font-size:11px;cursor:pointer;transition:all .14s}
  .n .kbd:hover{border-color:var(--c1);background:rgba(0,212,255,.13)}

  .n .result-box{border:1px solid rgba(0,212,255,.25);border-radius:4px;
    background:linear-gradient(135deg,rgba(0,212,255,.05),rgba(123,47,255,.04));
    padding:12px 15px;position:relative;overflow:hidden}
  .n .result-box::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,var(--c1),transparent)}

  .n .lbl{font-size:9px;font-weight:700;color:rgba(0,212,255,.5);letter-spacing:.15em;text-transform:uppercase;margin-bottom:4px}

  /* NORMAL THEME */
  .m {font-family:'Space Grotesk',sans-serif;background:#f0f4ff;color:#1e2448;min-height:100vh}
  .m .panel{background:#fff;border:1.5px solid #dde3f5;border-radius:10px;
    box-shadow:0 2px 12px rgba(99,102,241,.06)}
  .m .btn-primary{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:8px;
    border:none;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:11px;font-weight:700;
    background:linear-gradient(135deg,#5b21b6,#2563eb);color:#fff;
    box-shadow:0 3px 12px rgba(91,33,182,.3);transition:all .18s}
  .m .btn-primary:hover{box-shadow:0 6px 20px rgba(91,33,182,.4);transform:translateY(-1px)}
  .m .btn-primary:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none}
  .m .btn-sm{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;border-radius:6px;
    border:1.5px solid #dde3f5;background:transparent;color:#6b7bb8;cursor:pointer;
    font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:600;transition:all .14s}
  .m .btn-sm:hover,.m .btn-sm.on{border-color:#5b21b6;color:#5b21b6;background:rgba(91,33,182,.07)}
  .m .inp{background:#f8f9ff;border:1.5px solid #dde3f5;border-radius:7px;color:#1e2448;
    font-family:'Fira Code',monospace;font-size:13px;padding:8px 11px;outline:none;
    transition:all .14s;width:100%}
  .m .inp:focus{border-color:#5b21b6;box-shadow:0 0 0 3px rgba(91,33,182,.1)}
  .m .sel{background:#f8f9ff;border:1.5px solid #dde3f5;border-radius:7px;color:#1e2448;
    font-family:'Space Grotesk',sans-serif;font-size:11px;padding:7px 11px;outline:none;
    cursor:pointer;width:100%}
  .m .sel:focus{border-color:#5b21b6}
  .m .tab{flex:1;padding:9px 4px;border:none;background:transparent;color:#9099c8;cursor:pointer;
    font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:700;border-bottom:2px solid transparent;
    transition:all .17s;display:flex;align-items:center;justify-content:center;gap:4px;letter-spacing:.05em}
  .m .tab.on{color:#5b21b6;border-bottom-color:#5b21b6;background:rgba(91,33,182,.04)}
  .m .tab:hover:not(.on){color:#1e2448}
  .m .kbd{padding:3px 8px;border-radius:5px;border:1.5px solid #dde3f5;background:#f0f4ff;
    color:#5b21b6;font-family:'Fira Code',monospace;font-size:11px;cursor:pointer;transition:all .14s}
  .m .kbd:hover{border-color:#5b21b6;background:rgba(91,33,182,.08)}
  .m .result-box{border:1.5px solid rgba(91,33,182,.25);border-radius:9px;
    background:linear-gradient(135deg,rgba(91,33,182,.06),rgba(37,99,235,.04));padding:12px 15px}
  .m .lbl{font-size:9px;font-weight:700;color:#5b21b6;letter-spacing:.13em;text-transform:uppercase;margin-bottom:4px}

  /* AD SLOT STYLES */
  .ad-slot{display:flex;align-items:center;justify-content:center;
    background:rgba(0,0,0,.12);border-radius:4px;font-size:9px;
    letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.2);
    font-family:'Space Grotesk',sans-serif;border:1px dashed rgba(255,255,255,.08)}
  .m .ad-slot{background:rgba(0,0,0,.04);color:rgba(0,0,0,.15);border-color:rgba(0,0,0,.08)}
`;

/* ══════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════ */
const I = ({ d, s = 14, sw = 1.8 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ic = {
  deriv: <I d="M4 20C6 6 10 6 12 12C14 18 18 18 20 4" />,
  integ: <I d="M5 4C5 4 7 20 12 20C17 20 19 4 19 4" />,
  limit: <I d={["M3 20h18", "M7 20V8l5 6 5-10"]} />,
  taylor: <I d="M3 12Q6 4 9 12Q12 20 15 12Q18 4 21 12" />,
  ode: <I d={["M4 4l16 16", "M4 10h6", "M14 14h6"]} />,
  matrix: <I d={["M4 4h4v4H4z", "M10 4h4v4h-4z", "M4 10h4v4H4z", "M10 10h4v4h-4z"]} />,
  play: <I d="M5 3l14 9-14 9V3z" sw={1.5} />,
  copy: <I d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2", "M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"]} />,
  check: <I d="M20 6 9 17l-5-5" />,
  d2: <I d={["M3 3v18h18", "M7 12h10", "M12 7v10"]} />,
  d3: <I d={["M12 2l9 5v10l-9 5-9-5V7z", "M12 2v20", "M3 7l9 5 9-5"]} />,
  reset: <I d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />,
  spin: <I d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />,
  kbd: <I d={["M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z", "M8 10v.01M12 10v.01M16 10v.01M8 14h8"]} />,
  info: <I d={["M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z", "M12 8v4", "M12 16v.01H12"]} />,
};

const TABS = [
  { id: 'derivative', label: 'd/dx', full: 'Derivative', i: 'deriv' },
  { id: 'integral', label: '∫', full: 'Integral', i: 'integ' },
  { id: 'limit', label: 'lim', full: 'Limit', i: 'limit' },
  { id: 'taylor', label: 'Taylor', full: 'Taylor', i: 'taylor' },
  { id: 'ode', label: 'ODE', full: 'ODE', i: 'ode' },
  { id: 'matrix', label: 'Matrix', full: 'Matrix', i: 'matrix' },
];

const KEY_ROWS = [
  ['sin(', 'cos(', 'tan(', 'ln(', 'log(', 'exp('],
  ['sqrt(', 'abs(', 'asin(', 'acos(', 'atan(', 'ceil('],
  ['π', 'e', 'i', '∞', '(', ')', '^', '*'],
];
const KM = { 'π': 'pi', 'e': 'e', 'i': 'i', '∞': 'Infinity', 'ln(': 'log(' };

/* ══════════════════════════════════════════════
   MATH ENGINE
══════════════════════════════════════════════ */
function ordStr(n) { return ['', '1st', '2nd', '3rd', '4th', '5th'][n] || n + 'th'; }
function fact(n) { if (n <= 1) return 1; return n * fact(n - 1); }
function safeTeX(s) { try { return math.parse(s).toTex(); } catch (e) { return String(s); } }

function solveDeriv(expr, v, order) {
  let cur = expr; const steps = [];
  steps.push({ t: 'Input', d: `Differentiate ${ordStr(order)} order of f(${v}) = ${expr}`, l: `f(${v}) = ${safeTeX(expr)}` });
  for (let i = 1; i <= order; i++) {
    const d = math.derivative(cur, v); const s = math.simplify(d).toString();
    steps.push({ t: `Step ${i}`, d: `${ordStr(i)} derivative`, l: `\\frac{d}{d${v}}\\left(${safeTeX(cur)}\\right) = ${safeTeX(s)}` });
    cur = s;
  }
  steps.push({ t: 'Answer', d: 'Simplified result', l: `f^{(${order})}(${v}) = ${safeTeX(cur)}`, last: true });
  return { result: cur, steps };
}

function antiDeriv(expr, v) {
  const e = expr.replace(/\s/g, '').replace(/\*\*/g, '^');
  const P = [
    [/^x\^(\d+\.?\d*)$/, m => `${v}^(${+m[1] + 1})/(${+m[1] + 1})`],
    [/^(\d+\.?\d*)\*x\^(\d+\.?\d*)$/, m => `${m[1]}*${v}^(${+m[2] + 1})/(${+m[2] + 1})`],
    [/^(\d+\.?\d*)$/, m => `${m[1]}*${v}`],
    [/^x$/, () => `${v}^2/2`], [/^x\^2$/, () => `${v}^3/3`], [/^x\^3$/, () => `${v}^4/4`],
    [/^sin\(x\)$/, () => `-cos(${v})`], [/^cos\(x\)$/, () => `sin(${v})`],
    [/^tan\(x\)$/, () => `-log(abs(cos(${v})))`],
    [/^exp\(x\)$/, () => `exp(${v})`], [/^e\^x$/, () => `exp(${v})`],
    [/^1\/x$/, () => `log(abs(${v}))`], [/^sqrt\(x\)$/, () => `(2/3)*${v}^(3/2)`],
    [/^(\d+\.?\d*)\*sin\(x\)$/, m => `-${m[1]}*cos(${v})`],
    [/^(\d+\.?\d*)\*cos\(x\)$/, m => `${m[1]}*sin(${v})`],
    [/^(\d+\.?\d*)\*exp\(x\)$/, m => `${m[1]}*exp(${v})`],
  ];
  for (const [re, fn] of P) { const m = e.match(re); if (m) return fn(m); }
  const node = math.parse(expr);
  if (node.type === 'OperatorNode') {
    if (node.op === '+') return `(${antiDeriv(node.args[0].toString(), v)})+(${antiDeriv(node.args[1].toString(), v)})`;
    if (node.op === '-') return `(${antiDeriv(node.args[0].toString(), v)})-(${antiDeriv(node.args[1].toString(), v)})`;
    if (node.op === '*') {
      if (node.args[0].type === 'ConstantNode') return `${node.args[0].value}*(${antiDeriv(node.args[1].toString(), v)})`;
      if (node.args[1].type === 'ConstantNode') return `${node.args[1].value}*(${antiDeriv(node.args[0].toString(), v)})`;
    }
  }
  throw new Error('Cannot integrate: ' + expr);
}

function solveInteg(expr, v, lo, hi) {
  const steps = []; const anti = antiDeriv(expr, v);
  steps.push({ t: 'Setup', d: 'Find the antiderivative', l: `\\int ${safeTeX(expr)}\\,d${v}` });
  steps.push({ t: 'Antiderivative', d: 'Apply integration rules', l: `F(${v}) = ${safeTeX(anti)} + C` });
  if (lo !== '' && hi !== '') {
    const F = math.compile(anti); const a = math.evaluate(lo); const b = math.evaluate(hi);
    const Fa = F.evaluate({ [v]: a }); const Fb = F.evaluate({ [v]: b });
    const res = (Fb - Fa).toFixed(8).replace(/\.?0+$/, '');
    steps.push({ t: 'Evaluate', d: `F(${hi}) − F(${lo})`, l: `F(${hi}) - F(${lo}) = ${res}` });
    steps.push({ t: 'Answer', d: 'Definite integral value', l: `\\int_{${lo}}^{${hi}} ${safeTeX(expr)}\\,d${v} = ${res}`, last: true });
    return { result: res, anti, steps };
  }
  steps.push({ t: 'Answer', d: 'Add C for indefinite', l: `\\int ${safeTeX(expr)}\\,d${v} = ${safeTeX(anti)} + C`, last: true });
  return { result: anti + ' + C', anti, steps };
}

function solveLimit(expr, v, val, dir) {
  const steps = [];
  steps.push({ t: 'Setup', d: `Evaluate lim(${v}→${val})`, l: `\\lim_{${v}\\to ${val}} ${safeTeX(expr)}` });
  const f = math.compile(expr); const a = math.evaluate(val);
  try {
    const d = f.evaluate({ [v]: a });
    if (isFinite(d) && !isNaN(d)) {
      const r = d.toFixed(8).replace(/\.?0+$/, '');
      steps.push({ t: 'Direct Substitution', d: 'Function is continuous at point', l: `f(${val}) = ${r}` });
      steps.push({ t: 'Answer', d: 'Limit found directly', l: `\\lim_{${v}\\to ${val}} ${safeTeX(expr)} = ${r}`, last: true });
      return { result: r, steps };
    }
  } catch (e) { }
  const eps = 1e-9; const L = f.evaluate({ [v]: a - eps }); const R = f.evaluate({ [v]: a + eps });
  steps.push({ t: 'Indeterminate', d: 'Using numerical approach', l: `\\text{Direct substitution fails}` });
  let result;
  if (dir === 'left') result = isFinite(L) ? L.toFixed(6).replace(/\.?0+$/, '') : '-∞';
  else if (dir === 'right') result = isFinite(R) ? R.toFixed(6).replace(/\.?0+$/, '') : '+∞';
  else result = Math.abs(L - R) < 1e-4 && isFinite(L) ? ((L + R) / 2).toFixed(6).replace(/\.?0+$/, '') : 'DNE';
  const sup = dir === 'left' ? '^-' : dir === 'right' ? '^+' : '';
  steps.push({ t: 'Answer', d: '', l: `\\lim_{${v}\\to ${val}${sup}} ${safeTeX(expr)} = ${result}`, last: true });
  return { result, steps };
}

function solveTaylor(expr, v, center, numT) {
  const steps = []; const a = math.evaluate(center);
  steps.push({ t: 'Setup', d: `Build Taylor polynomial around ${v}=${center}`, l: `T(${v})=\\sum_{n=0}^\\infty\\frac{f^{(n)}(a)}{n!}(${v}-a)^n` });
  let cur = expr; const coeffs = [];
  for (let n = 0; n < numT; n++) {
    try {
      const fa = math.compile(cur).evaluate({ [v]: a }); const c = fa / fact(n);
      if (isFinite(c) && !isNaN(c)) coeffs.push({ n, c });
      if (n < numT - 1) cur = math.simplify(math.derivative(cur, v)).toString();
    } catch (e) { break; }
  }
  const tl = coeffs.map(({ n, c }) => {
    if (Math.abs(c) < 1e-10) return null;
    const cs = c.toFixed(4).replace(/\.?0+$/, '');
    if (n === 0) return cs; if (n === 1) return `${cs}(${v}-${center})`;
    return `${cs}(${v}-${center})^{${n}}`;
  }).filter(Boolean).join('+').replace(/\+-/g, '-');
  steps.push({ t: 'Coefficients', d: 'Compute f⁽ⁿ⁾(a)/n!', l: `T_{${numT - 1}}(${v}) = ${tl || '0'}` });
  steps.push({ t: 'Answer', d: `${numT}-term approximation`, l: `T(${v}) = ${tl}`, last: true });
  return { result: tl, coeffs, steps };
}

function solveODE(odeExpr, v, y0, x0, xEnd) {
  const f = math.compile(odeExpr); const steps = [];
  steps.push({ t: 'Setup', d: `RK4: dy/d${v} = ${odeExpr}, y(${x0})=${y0}`, l: `\\frac{dy}{d${v}} = ${safeTeX(odeExpr)}` });
  const N = 200; const h = (xEnd - x0) / N; const xs = [x0], ys = [y0]; let x = x0, y = y0;
  for (let i = 0; i < N; i++) {
    try {
      const k1 = f.evaluate({ [v]: x, y });
      const k2 = f.evaluate({ [v]: x + h / 2, y: y + h * k1 / 2 });
      const k3 = f.evaluate({ [v]: x + h / 2, y: y + h * k2 / 2 });
      const k4 = f.evaluate({ [v]: x + h, y: y + h * k3 });
      y += h / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
      x += h;
      xs.push(+x.toFixed(4));
      ys.push(+y.toFixed(6));
    } catch (e) { break; }
  }
  steps.push({ t: 'RK4 Method', d: `Step h=${h.toFixed(4)}`, l: `y_{n+1}=y_n+\\frac{h}{6}(k_1+2k_2+2k_3+k_4)` });
  steps.push({ t: 'Answer', d: `y(${xEnd}) ≈ ${ys[ys.length - 1].toFixed(5)}`, l: `y(${xEnd})\\approx ${ys[ys.length - 1].toFixed(5)}`, last: true });
  return { result: `y(${xEnd}) ≈ ${ys[ys.length - 1].toFixed(5)}`, xs, ys, steps };
}

function detM(A) {
  const n = A.length; if (n === 1) return A[0][0]; if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
  let d = 0; for (let c = 0; c < n; c++) { const s = A.slice(1).map(r => [...r.slice(0, c), ...r.slice(c + 1)]); d += (c % 2 ? -1 : 1) * A[0][c] * detM(s); } return d;
}

function solveMatrix(rows) {
  const n = rows.length; const A = rows.map(r => r.slice(0, n)); const b = rows.map(r => r[n]);
  const aug = A.map((row, i) => [...row, b[i]]); const steps = [];
  steps.push({ t: 'Augmented [A|b]', d: 'Form augmented matrix', l: `\\begin{bmatrix}${aug.map(r => r.map(v => +v.toFixed(2)).join('&')).join('\\\\')}\\end{bmatrix}` });
  for (let i = 0; i < n; i++) {
    let mx = i; for (let k = i + 1; k < n; k++) if (Math.abs(aug[k][i]) > Math.abs(aug[mx][i])) mx = k;
    [aug[i], aug[mx]] = [aug[mx], aug[i]];
    if (Math.abs(aug[i][i]) < 1e-10) continue;
    for (let k = i + 1; k < n; k++) { const f = aug[k][i] / aug[i][i]; for (let j = i; j <= n; j++) aug[k][j] -= f * aug[i][j]; }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) { x[i] = aug[i][n]; for (let j = i + 1; j < n; j++) x[i] -= aug[i][j] * x[j]; x[i] /= aug[i][i]; }
  steps.push({ t: 'Row Echelon', d: 'After elimination', l: `\\begin{bmatrix}${aug.map(r => r.map(v => +v.toFixed(2)).join('&')).join('\\\\')}\\end{bmatrix}` });
  steps.push({ t: 'Answer', d: 'Back substitution', l: x.map((v, i) => `x_{${i + 1}}=${v.toFixed(4)}`).join(',\\;'), last: true });
  let det = null; try { det = detM(A); } catch (e) { }
  return { result: x.map((v, i) => `x${i + 1}=${v.toFixed(4)}`).join(', ') + (det != null ? ` | det=${det.toFixed(4)}` : ''), x, det, steps };
}

/* ══════════════════════════════════════════════
   2D CANVAS
══════════════════════════════════════════════ */
function Graph2D({ datasets = [], xRange = [-6, 6], neon }) {
  const ref = useRef();
  
  useEffect(() => {
    const cv = ref.current; if (!cv || !datasets.length) return;
    const ctx = cv.getContext('2d'); const W = cv.width, H = cv.height;
    const p = { l: 42, r: 12, t: 20, b: 32 }; const pw = W - p.l - p.r; const ph = H - p.t - p.b;
    const [xn, xx] = xRange;
    const allY = datasets.flatMap(d => d.ys.filter(v => isFinite(v)));
    let yn = allY.length ? Math.min(...allY) : -4; let yx = allY.length ? Math.max(...allY) : 4;
    const yp = Math.max((yx - yn) * .15, .5); yn -= yp; yx += yp;
    const tx = x => p.l + (x - xn) / (xx - xn) * pw; const ty = y => H - p.b - (y - yn) / (yx - yn) * ph;

    ctx.fillStyle = neon ? '#070714' : '#f8f9ff'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = neon ? 'rgba(0,212,255,.055)' : 'rgba(91,33,182,.06)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) { const x = tx(xn + (xx - xn) * i / 10); ctx.beginPath(); ctx.moveTo(x, p.t); ctx.lineTo(x, H - p.b); ctx.stroke(); }
    for (let i = 0; i <= 8; i++) { const y = ty(yn + (yx - yn) * i / 8); ctx.beginPath(); ctx.moveTo(p.l, y); ctx.lineTo(W - p.r, y); ctx.stroke(); }
    ctx.strokeStyle = neon ? 'rgba(0,212,255,.22)' : 'rgba(91,33,182,.2)'; ctx.lineWidth = 1.5;
    if (yn < 0 && yx > 0) { const y0 = ty(0); ctx.beginPath(); ctx.moveTo(p.l, y0); ctx.lineTo(W - p.r, y0); ctx.stroke(); }
    if (xn < 0 && xx > 0) { const x0 = tx(0); ctx.beginPath(); ctx.moveTo(x0, p.t); ctx.lineTo(x0, H - p.b); ctx.stroke(); }
    ctx.fillStyle = neon ? 'rgba(107,123,184,.6)' : 'rgba(107,119,168,.65)';
    ctx.font = '8px Fira Code,monospace'; ctx.textAlign = 'center';
    for (let i = 0; i <= 10; i += 2) { const v = xn + (xx - xn) * i / 10; ctx.fillText(v.toFixed(1), tx(v), H - p.b + 11); }
    ctx.textAlign = 'right';
    for (let i = 0; i <= 8; i += 2) { const v = yn + (yx - yn) * i / 8; ctx.fillText(v.toFixed(1), p.l - 3, ty(v) + 3); }
    const NC = ['#00d4ff', '#7b2fff', '#ff6b35', '#00e676', '#ff1744'];
    const MC = ['#5b21b6', '#2563eb', '#059669', '#d97706', '#dc2626'];
    datasets.forEach((ds, di) => {
      const c = neon ? NC[di % 5] : MC[di % 5];
      ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.shadowColor = neon ? c : 'transparent'; ctx.shadowBlur = neon ? 6 : 0;
      ctx.beginPath(); let first = true;
      ds.xs.forEach((x, i) => {
        const y = ds.ys[i]; if (!isFinite(y) || y < yn - 50 || y > yx + 50) { first = true; return; }
        const px = tx(x); const py = ty(y); first ? (ctx.moveTo(px, py), first = false) : ctx.lineTo(px, py);
      });
      ctx.stroke(); ctx.shadowBlur = 0;
      ctx.fillStyle = c; ctx.fillRect(p.l + di * 130, 8, 14, 2);
      ctx.font = '8px Space Grotesk,sans-serif'; ctx.textAlign = 'left'; ctx.fillStyle = c;
      ctx.fillText((ds.label || '').slice(0, 20), p.l + di * 130 + 17, 12);
    });
  }, [datasets, xRange, neon]);
  
  return <canvas ref={ref} width={560} height={260} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: neon ? 4 : 8 }} />;
}

/* ══════════════════════════════════════════════
   3D WEBGL — optimized, lower grid, stable
══════════════════════════════════════════════ */
function Graph3D({ expr, variable, xRange = [-5, 5], neon, extraExprs = [] }) {
  const ref = useRef();
  const st = useRef({ rx: 0.5, ry: 0.3, drag: false, lx: 0, ly: 0, zoom: 1, ar: true });
  const raf = useRef();

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const gl = cv.getContext('webgl', { antialias: false, powerPreference: 'low-power' }) || 
               cv.getContext('experimental-webgl', { antialias: false });
    if (!gl) return;

    const GRID = 30; const [xn, xx] = xRange;
    const allE = [expr, ...extraExprs.filter(e => e && e.trim())];

    function buildMesh(eStr, v) {
      try {
        const safe = eStr.replace(/\by\b/g, '__Y__'); const f = math.compile(safe);
        const verts = []; const cols = []; const idx = []; const zv = [];
        for (let iy = 0; iy <= GRID; iy++) for (let ix = 0; ix <= GRID; ix++) {
          const x = xn + (xx - xn) * ix / GRID; const y = xn + (xx - xn) * iy / GRID;
          let z = 0; try { z = f.evaluate({ [v]: x, x, y, __Y__: y }); } catch (e) { }
          zv.push(isFinite(z) && Math.abs(z) < 1e6 ? z : 0);
        }
        const zmn = Math.min(...zv); const zmx = Math.max(...zv); const zr = Math.max(zmx - zmn, 1e-4);
        for (let iy = 0; iy <= GRID; iy++) for (let ix = 0; ix <= GRID; ix++) {
          const x = xn + (xx - xn) * ix / GRID; const y = xn + (xx - xn) * iy / GRID; const z = zv[iy * (GRID + 1) + ix];
          const t = (z - zmn) / zr;
          verts.push(x, y, z);
          if (neon) cols.push(t * .2, t * .8 + .2, 1 - t * .3);
          else cols.push(.3 + t * .3, .1 + t * .5, .7 + t * .1);
        }
        for (let iy = 0; iy < GRID; iy++) for (let ix = 0; ix < GRID; ix++) {
          const a = iy * (GRID + 1) + ix; idx.push(a, a + 1, a + GRID + 1, a + 1, a + GRID + 2, a + GRID + 1);
        }
        return { v: new Float32Array(verts), c: new Float32Array(cols), i: new Uint16Array(idx), n: idx.length };
      } catch (e) { return null; }
    }

    const gm = allE.map(e => buildMesh(e, variable)).filter(Boolean).map(m => {
      const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, m.v, gl.STATIC_DRAW);
      const cb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, cb); gl.bufferData(gl.ARRAY_BUFFER, m.c, gl.STATIC_DRAW);
      const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, m.i, gl.STATIC_DRAW);
      return { vb, cb, ib, n: m.n };
    });
    if (!gm.length) return;

    const VS = `attribute vec3 aP;attribute vec3 aC;uniform mat4 uM;varying vec3 vC;varying float vZ;
      void main(){gl_Position=uM*vec4(aP,1.);vC=aC;vZ=gl_Position.z/gl_Position.w;}`;
    const FS = `precision lowp float;varying vec3 vC;varying float vZ;
      void main(){float f=clamp(1.-vZ*.25,.2,1.);gl_FragColor=vec4(vC*f,.95);}`;
    
    function sh(t, s) { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); return x; }
    
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog); gl.useProgram(prog);
    const aP = gl.getAttribLocation(prog, 'aP'); const aC = gl.getAttribLocation(prog, 'aC'); 
    const uM = gl.getUniformLocation(prog, 'uM');
    gl.enable(gl.DEPTH_TEST);

    function mm(a, b) { 
      const r = new Float32Array(16); 
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) r[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j]; 
      return r; 
    }
    
    const mRX = a => { const c = Math.cos(a); const s = Math.sin(a); return new Float32Array([1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1]); };
    const mRY = a => { const c = Math.cos(a); const s = Math.sin(a); return new Float32Array([c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1]); };
    
    function mP(fov, asp, n, f) { const t = 1 / Math.tan(fov / 2); const nd = n - f; return new Float32Array([t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / nd, 2 * f * n / nd, 0, 0, -1, 0]); }
    
    const mS = s => new Float32Array([s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, 1]);
    const mT = (tx, ty, tz) => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]);

    let last = 0;
    function draw(ts) {
      const dt = ts - last; last = ts;
      const W = cv.width; const H = cv.height;
      gl.viewport(0, 0, W, H);
      gl.clearColor(...(neon ? [0.027, 0.027, 0.082, 1] : [0.97, 0.98, 1, 1]));
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (st.current.ar && !st.current.drag) st.current.ry += dt * 0.0006;
      const sc = 4.5 / (xx - xn) * st.current.zoom;
      let mvp = mm(mP(0.82, W / H, 0.1, 100), mT(0, 0, -11));
      mvp = mm(mvp, mRX(st.current.rx));
      mvp = mm(mvp, mRY(st.current.ry));
      mvp = mm(mvp, mS(sc));
      gl.uniformMatrix4fv(uM, false, mvp);
      gm.forEach(m => {
        gl.bindBuffer(gl.ARRAY_BUFFER, m.vb); gl.enableVertexAttribArray(aP); gl.vertexAttribPointer(aP, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, m.cb); gl.enableVertexAttribArray(aC); gl.vertexAttribPointer(aC, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.ib); gl.drawElements(gl.TRIANGLES, m.n, gl.UNSIGNED_SHORT, 0);
      });
      raf.current = requestAnimationFrame(draw);
    }
    raf.current = requestAnimationFrame(draw);

    const md = e => { st.current.drag = true; st.current.lx = e.clientX; st.current.ly = e.clientY; };
    const mm2 = e => { if (!st.current.drag) return; st.current.ry += (e.clientX - st.current.lx) * 0.009; st.current.rx += (e.clientY - st.current.ly) * 0.009; st.current.lx = e.clientX; st.current.ly = e.clientY; };
    const mu = () => { st.current.drag = false; };
    const mw = e => { e.preventDefault(); st.current.zoom = Math.max(0.2, Math.min(4, st.current.zoom - e.deltaY * 0.0012)); };
    const ts2 = e => { if (e.touches.length === 1) { st.current.drag = true; st.current.lx = e.touches[0].clientX; st.current.ly = e.touches[0].clientY; } };
    const tm = e => { if (!st.current.drag || !e.touches.length) return; e.preventDefault(); st.current.ry += (e.touches[0].clientX - st.current.lx) * 0.01; st.current.rx += (e.touches[0].clientY - st.current.ly) * 0.01; st.current.lx = e.touches[0].clientX; st.current.ly = e.touches[0].clientY; };

    cv.addEventListener('mousedown', md); window.addEventListener('mousemove', mm2); window.addEventListener('mouseup', mu);
    cv.addEventListener('wheel', mw, { passive: false });
    cv.addEventListener('touchstart', ts2, { passive: true }); 
    cv.addEventListener('touchmove', tm, { passive: false }); 
    cv.addEventListener('touchend', mu);
    
    return () => {
      cancelAnimationFrame(raf.current);
      cv.removeEventListener('mousedown', md); window.removeEventListener('mousemove', mm2); window.removeEventListener('mouseup', mu);
      cv.removeEventListener('wheel', mw); cv.removeEventListener('touchstart', ts2); cv.removeEventListener('touchmove', tm); cv.removeEventListener('touchend', mu);
      gm.forEach(m => { gl.deleteBuffer(m.vb); gl.deleteBuffer(m.cb); gl.deleteBuffer(m.ib); });
    };
  }, [expr, variable, xRange, neon, extraExprs]);

  return (
    <div style={{ position: 'relative', lineHeight: 0 }}>
      <canvas ref={ref} width={420} height={280}
        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: neon ? 4 : 8, cursor: 'grab', userSelect: 'none' }} />
      <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 4 }}>
        <button onClick={() => { st.current.rx = 0.5; st.current.ry = 0.3; st.current.zoom = 1; }}
          style={{ padding: '3px 7px', border: neon ? '1px solid rgba(0,212,255,.25)' : '1px solid rgba(91,33,182,.2)', borderRadius: 3,
            background: neon ? 'rgba(6,6,18,.8)' : 'rgba(255,255,255,.85)',
            color: neon ? '#00d4ff' : '#5b21b6', cursor: 'pointer', fontSize: 9, fontFamily: 'Space Grotesk', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
          {ic.reset} Reset
        </button>
        <button onClick={() => { st.current.ar = !st.current.ar; }}
          style={{ padding: '3px 7px', border: neon ? '1px solid rgba(0,212,255,.25)' : '1px solid rgba(91,33,182,.2)', borderRadius: 3,
            background: neon ? 'rgba(6,6,18,.8)' : 'rgba(255,255,255,.85)',
            color: neon ? '#00d4ff' : '#5b21b6', cursor: 'pointer', fontSize: 9, fontFamily: 'Space Grotesk', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
          {ic.spin} Auto
        </button>
      </div>
      <div style={{ position: 'absolute', bottom: 5, left: 7, fontSize: 8, color: neon ? 'rgba(0,212,255,.35)' : 'rgba(91,33,182,.4)',
        fontFamily: 'Space Grotesk', letterSpacing: '.1em', pointerEvents: 'none', background: neon ? 'rgba(6,6,18,.6)' : 'rgba(255,255,255,.6)', padding: '2px 5px', borderRadius: 3 }}>
        Drag · Scroll zoom · z = f(x, y)
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   GRAPH PANEL
══════════════════════════════════════════════ */
function GraphPanel({ datasets, expr, variable, xMin, xMax, setXMin, setXMax, extraExprs, setExtraExprs, neon, tab }) {
  const [mode, setMode] = useState('2d');
  const xRange = [+xMin, +xMax];

  return (
    <div className={neon ? 'n panel' : 'm panel'} style={{ padding: 12, marginTop: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, gap: 8 }}>
        <span className="lbl" style={{ flex: 1 }}>{mode === '3d' ? '3D Surface z = f(x,y)' : '2D Graph'}</span>
        {tab !== 'matrix' && (
          <div style={{ display: 'flex', gap: 3 }}>
            {[{ id: '2d', l: '2D' }, { id: '3d', l: '3D' }].map(({ id, l }) => (
              <button key={id} onClick={() => setMode(id)}
                className={`btn-sm ${mode === id ? 'on' : ''}`}
                style={{ padding: '4px 10px', fontSize: 9, fontWeight: 700 }}>
                {id === '2d' ? ic.d2 : ic.d3} {l}
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>
          {mode === '2d'
            ? <Graph2D datasets={datasets} xRange={xRange} neon={neon} />
            : <Graph3D expr={expr} variable={variable} xRange={xRange} neon={neon} extraExprs={extraExprs} />
          }
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, alignItems: 'center' }}>
        {[['x min', xMin, setXMin], ['x max', xMax, setXMax]].map(([l, v, s]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 9, color: neon ? '#6b7bb8' : '#9099c8', fontWeight: 500 }}>{l}</span>
            <input type="number" value={v} onChange={e => s(e.target.value)}
              style={{ width: 46, padding: '3px 5px', fontFamily: 'Fira Code,monospace', fontSize: 11,
                background: neon ? 'rgba(0,0,0,.5)' : '#f0f4ff',
                border: neon ? '1px solid #1c1c3a' : '1.5px solid #dde3f5',
                borderRadius: neon ? 3 : 5, color: neon ? '#eef2ff' : '#1e2448', outline: 'none' }} />
          </div>
        ))}
        {mode === '2d' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
            <span style={{ fontSize: 9, color: neon ? '#6b7bb8' : '#9099c8', flexShrink: 0, fontWeight: 500 }}>+ curve</span>
            <input value={extraExprs[0] || ''} onChange={e => setExtraExprs([e.target.value])} placeholder="cos(x)"
              style={{ flex: 1, minWidth: 60, padding: '3px 6px', fontFamily: 'Fira Code,monospace', fontSize: 11,
                background: neon ? 'rgba(0,0,0,.5)' : '#f0f4ff', border: neon ? '1px solid #1c1c3a' : '1.5px solid #dde3f5',
                borderRadius: neon ? 3 : 5, color: neon ? '#eef2ff' : '#1e2448', outline: 'none' }} />
          </div>
        )}
      </div>

      {mode === '2d' && datasets.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 7 }}>
          {datasets.map((ds, i) => {
            const nc = ['#00d4ff', '#7b2fff', '#ff6b35', '#00e676', '#ff1744'];
            const mc = ['#5b21b6', '#2563eb', '#059669', '#d97706', '#dc2626'];
            return <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 14, height: 3, borderRadius: 99, background: neon ? nc[i % 5] : mc[i % 5] }} />
              <span style={{ fontSize: 9, color: neon ? '#6b7bb8' : '#9099c8' }}>{(ds.label || '').slice(0, 22)}</span>
            </div>;
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   KATEX
══════════════════════════════════════════════ */
function useKatex() {
  const [ok, setOk] = useState(!!window.katex);
  useEffect(() => {
    if (window.katex) return;
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'; document.head.appendChild(l);
    const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js'; s.onload = () => setOk(true); document.head.appendChild(s);
  }, []);
  return ok;
}

/* ══════════════════════════════════════════════
   STEP-BY-STEP
══════════════════════════════════════════════ */
function Steps({ steps, neon, katex }) {
  function rTeX(l) {
    if (!katex || !window.katex) return <code style={{ fontFamily: 'Fira Code,monospace', fontSize: 11, color: neon ? '#00d4ff' : '#5b21b6' }}>{l}</code>;
    try {
      const h = window.katex.renderToString(l, { throwOnError: false, displayMode: false });
      return <span dangerouslySetInnerHTML={{ __html: h }} style={{ color: neon ? '#eef2ff' : '#1e2448' }} />;
    } catch (e) {
      return <code>{l}</code>;
    }
  }
  return (
    <div>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: s.last ? 0 : 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%',
              border: neon ? '1px solid rgba(0,212,255,.3)' : '1.5px solid rgba(91,33,182,.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: neon ? 'rgba(0,212,255,.07)' : 'rgba(91,33,182,.08)',
              fontSize: 9, fontWeight: 700, color: neon ? '#00d4ff' : '#5b21b6', flexShrink: 0 }}>{i + 1}</div>
            {!s.last && <div style={{ flex: 1, width: 1, background: neon ? 'rgba(0,212,255,.1)' : 'rgba(91,33,182,.12)', marginTop: 3, minHeight: 10 }} />}
          </div>
          <div style={{ flex: 1, paddingBottom: s.last ? 0 : 4 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: neon ? '#eef2ff' : '#1e2448', marginBottom: 2 }}>{s.t}</div>
            {s.d && <div style={{ fontSize: 10, color: neon ? '#6b7bb8' : '#9099c8', marginBottom: 5, lineHeight: 1.5 }}>{s.d}</div>}
            <div style={{ padding: '6px 9px', border: neon ? '1px solid #1c1c3a' : '1.5px solid #dde3f5',
              borderRadius: neon ? 3 : 6, background: neon ? 'rgba(0,0,0,.35)' : '#f8f9ff', overflowX: 'auto' }}>
              {rTeX(s.l)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   COPY BTN
══════════════════════════════════════════════ */
function CopyBtn({ text, neon }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => { }); setOk(true); setTimeout(() => setOk(false), 1500); }}
      className="btn-sm" style={{ padding: '3px 7px', fontSize: 9, gap: 3 }}>
      {ok ? ic.check : ic.copy}{ok ? 'Copied' : 'Copy'}
    </button>
  );
}

/* ══════════════════════════════════════════════
   RESULT BOX
══════════════════════════════════════════════ */
function ResultBox({ result, katex, neon }) {
  let l = ''; try { l = math.parse(result).toTex(); } catch (e) { l = result || '—'; }
  
  function rTeX(lt) {
    if (!katex || !window.katex) return <code style={{ fontFamily: 'Fira Code,monospace', color: neon ? '#00d4ff' : '#5b21b6', fontSize: 14 }}>{lt}</code>;
    try {
      const h = window.katex.renderToString(lt, { displayMode: true, throwOnError: false });
      return <span dangerouslySetInnerHTML={{ __html: h }} style={{ color: neon ? '#eef2ff' : '#1e2448' }} />;
    } catch (e) {
      return <code>{lt}</code>;
    }
  }
  
  return (
    <div className="result-box">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span className="lbl">Answer</span>
        <CopyBtn text={result} neon={neon} />
      </div>
      <div style={{ overflowX: 'auto', textAlign: 'center', padding: '4px 0' }}>{rTeX(l)}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MATRIX INPUT
══════════════════════════════════════════════ */
function MatInput({ rows, setRows, neon }) {
  const n = rows.length;
  const up = (r, c, v) => { const nx = rows.map(row => [...row]); nx[r][c] = parseFloat(v) || 0; setRows(nx); };
  return (
    <div>
      <div style={{ display: 'flex', gap: 5, marginBottom: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: neon ? '#6b7bb8' : '#9099c8', fontWeight: 600 }}>Size:</span>
        {[2, 3, 4].map(s => (
          <button key={s} onClick={() => setRows(Array.from({ length: s }, (_, r) => Array.from({ length: s + 1 }, (_, c) => r === c ? 1 : 0)))}
            className={`btn-sm ${n === s ? 'on' : ''}`} style={{ padding: '3px 8px', fontSize: 9 }}>{s}×{s}</button>
        ))}
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'separate', borderSpacing: 3 }}>
          <thead><tr>
            {Array.from({ length: n }, (_, c) => <th key={c} style={{ fontSize: 9, color: neon ? 'rgba(0,212,255,.5)' : '#5b21b6', padding: '0 2px', textAlign: 'center', fontWeight: 600 }}>x{c + 1}</th>)}
            <th style={{ fontSize: 9, color: neon ? 'rgba(255,107,53,.6)' : '#d97706', padding: '0 2px', textAlign: 'center', fontWeight: 600 }}>b</th>
          </tr></thead>
          <tbody>{rows.map((row, r) => (
            <tr key={r}>{row.map((val, c) => (
              <td key={c}><input type="number" step="any" value={val} onChange={e => up(r, c, e.target.value)}
                style={{ width: 50, padding: '4px 5px', fontFamily: 'Fira Code,monospace', fontSize: 12,
                  background: neon ? 'rgba(0,0,0,.45)' : '#f8f9ff',
                  border: c === n ? (neon ? '1px solid rgba(255,107,53,.3)' : '1.5px solid rgba(217,119,6,.3)') : (neon ? '1px solid #1c1c3a' : '1.5px solid #dde3f5'),
                  borderRadius: 3, color: neon ? '#eef2ff' : '#1e2448', outline: 'none', textAlign: 'center' }} /></td>
            ))}</tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TAB SETTINGS
══════════════════════════════════════════════ */
function TabSettings({ sv, neon }) {
  const { tab, variable: v, setVariable, order, setOrder, lower, setLower, upper, setUpper,
    limitVal, setLimitVal, dir, setDir, taylorC, setTaylorC, taylorN, setTaylorN,
    odeExpr, setOdeExpr, y0, setY0, x0: x0v, setX0, xEnd, setXEnd, matRows, setMatRows } = sv;

  const lbl = (t, el) => (
    <div>
      <div className="lbl">{t}</div>
      {el}
    </div>
  );

  if (tab === 'derivative') return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {lbl('Variable', <input className="inp" value={v} onChange={e => setVariable(e.target.value)} style={{ height: 33, fontSize: 12 }} />)}
      {lbl('Order', <select className="sel" value={order} onChange={e => setOrder(+e.target.value)}>
        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{ordStr(n)} derivative</option>)}</select>)}
    </div>
  );
  
  if (tab === 'integral') return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      {lbl('Variable', <input className="inp" value={v} onChange={e => setVariable(e.target.value)} style={{ height: 33, fontSize: 12 }} />)}
      {lbl('Lower', <input className="inp" value={lower} onChange={e => setLower(e.target.value)} placeholder="(optional)" style={{ height: 33, fontSize: 12 }} />)}
      {lbl('Upper', <input className="inp" value={upper} onChange={e => setUpper(e.target.value)} placeholder="(optional)" style={{ height: 33, fontSize: 12 }} />)}
    </div>
  );
  
  if (tab === 'limit') return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      {lbl('Variable', <input className="inp" value={v} onChange={e => setVariable(e.target.value)} style={{ height: 33, fontSize: 12 }} />)}
      {lbl('Approaching', <input className="inp" value={limitVal} onChange={e => setLimitVal(e.target.value)} placeholder="0" style={{ height: 33, fontSize: 12 }} />)}
      {lbl('Direction', <select className="sel" value={dir} onChange={e => setDir(e.target.value)}>
        <option value="both">Both sides (↔)</option>
        <option value="left">Left (x→a⁻)</option>
        <option value="right">Right (x→a⁺)</option></select>)}
    </div>
  );
  
  if (tab === 'taylor') return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      {lbl('Variable', <input className="inp" value={v} onChange={e => setVariable(e.target.value)} style={{ height: 33, fontSize: 12 }} />)}
      {lbl('Center a', <input className="inp" value={taylorC} onChange={e => setTaylorC(e.target.value)} placeholder="0" style={{ height: 33, fontSize: 12 }} />)}
      {lbl('Terms', <select className="sel" value={taylorN} onChange={e => setTaylorN(+e.target.value)}>
        {[3, 4, 5, 6, 7, 8, 10].map(n => <option key={n} value={n}>{n} terms</option>)}</select>)}
    </div>
  );
  
  if (tab === 'ode') return (
    <div>
      <div style={{ marginBottom: 8 }}>{lbl(`dy/dx = f(x,y)`, <input className="inp" value={odeExpr} onChange={e => setOdeExpr(e.target.value)} placeholder="x + y" />)}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {[['y₀', y0, setY0], ['x start', x0v, setX0], ['x end', xEnd, setXEnd], ['Var', v, setVariable]].map(([l2, vl, s]) => (
          <div key={l2}><div className="lbl">{l2}</div>
          <input className="inp" value={vl} onChange={e => s(e.target.value)} style={{ height: 31, fontSize: 12 }} /></div>
        ))}
      </div>
    </div>
  );
  
  if (tab === 'matrix') return <MatInput rows={matRows} setRows={setMatRows} neon={neon} />;
  
  return null;
}

/* ══════════════════════════════════════════════
   HOW TO USE — tooltip / inline help
══════════════════════════════════════════════ */
const TAB_HELP = {
  derivative: { tip: 'Enter f(x) like x^2 + sin(x), choose order.', hint: 'Power: x^3 | Chain: sin(x^2) | Product: x*cos(x)' },
  integral: { tip: 'Enter f(x). Leave bounds empty for indefinite, fill both for definite.', hint: 'Poly: x^3 | Trig: sin(x) | Exp: exp(x)' },
  limit: { tip: 'Enter expression and the value x approaches.', hint: 'sinc: sin(x)/x at 0 | Factor: (x^2-1)/(x-1) at 1' },
  taylor: { tip: 'Enter f(x), center point a, and number of terms.', hint: 'eˣ: exp(x) | sin series: sin(x) | ln: log(1+x)' },
  ode: { tip: 'Enter f(x,y) for dy/dx = f. Set initial y₀ at x₀.', hint: 'Linear: x+y | Quadratic: x^2+2*x | Separable: x*y' },
  matrix: { tip: 'Fill matrix rows. Last column is the constants b.', hint: '2×2: [2,1|5] [1,3|7] — solves for x₁, x₂' },
};

/* ══════════════════════════════════════════════
   EXAMPLES
══════════════════════════════════════════════ */
const EXAMPLES = [
  { tab: 'derivative', expr: '3*x^4 - 2*x^2', label: 'Power rule' },
  { tab: 'derivative', expr: 'sin(x^2)', label: 'Chain rule' },
  { tab: 'derivative', expr: 'x^2*cos(x)', label: 'Product rule' },
  { tab: 'integral', expr: 'x^3 + 2*x', label: 'Polynomial' },
  { tab: 'integral', expr: 'sin(x)', label: 'Trig' },
  { tab: 'limit', expr: 'sin(x)/x', limitVal: '0', label: 'sinc(x)' },
  { tab: 'limit', expr: '(x^2-1)/(x-1)', limitVal: '1', label: 'Factor' },
  { tab: 'taylor', expr: 'exp(x)', label: 'eˣ series' },
  { tab: 'taylor', expr: 'sin(x)', label: 'sin series' },
  { tab: 'ode', expr: 'x+y', odeExpr: 'x+y', label: 'ODE: x+y' },
];

/* ══════════════════════════════════════════════
   MAIN STATE
══════════════════════════════════════════════ */
function useSolver() {
  const [tab, setTab] = useState('derivative');
  const [expr, setExpr] = useState('x^3 - 3*x');
  const [variable, setVariable] = useState('x');
  const [order, setOrder] = useState(1);
  const [lower, setLower] = useState(''); 
  const [upper, setUpper] = useState('');
  const [limitVal, setLimitVal] = useState('0'); 
  const [dir, setDir] = useState('both');
  const [taylorC, setTaylorC] = useState('0'); 
  const [taylorN, setTaylorN] = useState(5);
  const [odeExpr, setOdeExpr] = useState('x + y'); 
  const [y0, setY0] = useState('1'); 
  const [x0, setX0] = useState('0'); 
  const [xEnd, setXEnd] = useState('5');
  const [matRows, setMatRows] = useState([[2, 1, 5], [1, 3, 7]]);
  const [xMin, setXMin] = useState(-6); 
  const [xMax, setXMax] = useState(6);
  const [extraExprs, setExtraExprs] = useState(['']);
  const [result, setResult] = useState(null); 
  const [steps, setSteps] = useState([]); 
  const [graphs, setGraphs] = useState([]);
  const [err, setErr] = useState(''); 
  const [computing, setComputing] = useState(false);

  function buildGD(e, v, xn, xx) {
    try {
      const f = math.compile(e); 
      const xs = [], ys = []; 
      const N = 400;
      for (let i = 0; i <= N; i++) {
        const x = xn + (xx - xn) * i / N; 
        try { 
          const y = f.evaluate({ [v]: x }); 
          xs.push(x); 
          ys.push(isFinite(y) ? y : NaN); 
        } catch (_) { 
          xs.push(x); 
          ys.push(NaN); 
        }
      }
      return { xs, ys, label: e.slice(0, 18) };
    } catch (e) { 
      return null; 
    }
  }

  const compute = useCallback(async () => {
    setErr(''); setResult(null); setSteps([]); setGraphs([]); setComputing(true);
    await new Promise(r => setTimeout(r, 30));
    const [xn, xx] = [+xMin, +xMax];
    try {
      if (tab === 'derivative') {
        const res = solveDeriv(expr, variable, order); setResult(res.result); setSteps(res.steps);
        const g1 = buildGD(expr, variable, xn, xx); 
        const g2 = buildGD(res.result, variable, xn, xx);
        if (g1) g1.label = `f(x)`; 
        if (g2) g2.label = `f'(x)`; 
        setGraphs([g1, g2].filter(Boolean));
      } else if (tab === 'integral') {
        const res = solveInteg(expr, variable, lower, upper); setResult(res.result); setSteps(res.steps);
        const g1 = buildGD(expr, variable, xn, xx); 
        const g2 = res.anti ? buildGD(res.anti, variable, xn, xx) : null;
        if (g1) g1.label = `f(x)`; 
        if (g2) g2.label = `F(x)`; 
        setGraphs([g1, g2].filter(Boolean));
      } else if (tab === 'limit') {
        const res = solveLimit(expr, variable, limitVal, dir); setResult(res.result); setSteps(res.steps);
        const g = buildGD(expr, variable, xn, xx); 
        if (g) g.label = `f(x)`; 
        setGraphs([g].filter(Boolean));
      } else if (tab === 'taylor') {
        const res = solveTaylor(expr, variable, taylorC, taylorN); setResult(res.result); setSteps(res.steps);
        const g1 = buildGD(expr, variable, xn, xx);
        const poly = res.coeffs.map(({ n, c }) => `(${c})*(${variable}-(${taylorC}))^${n}`).join('+');
        const g2 = poly ? buildGD(poly, variable, xn, xx) : null;
        if (g1) g1.label = `f(x)`; 
        if (g2) g2.label = `T${taylorN - 1}(x)`; 
        setGraphs([g1, g2].filter(Boolean));
      } else if (tab === 'ode') {
        const res = solveODE(odeExpr, variable, +y0, +x0, +xEnd); setResult(res.result); setSteps(res.steps);
        setGraphs([{ xs: res.xs, ys: res.ys, label: `y(${variable})` }]);
      } else if (tab === 'matrix') {
        const res = solveMatrix(matRows); setResult(res.result); setSteps(res.steps); setGraphs([]);
      }
      const extra = extraExprs.filter(e => e && e.trim());
      if (extra.length && tab !== 'matrix') {
        const gx = extra.map(e => buildGD(e, variable, xn, xx)).filter(Boolean);
        setGraphs(prev => [...prev, ...gx]);
      }
    } catch (e) {
      setErr(e.message || 'Error');
    }
    setComputing(false);
  }, [tab, expr, variable, order, lower, upper, limitVal, dir, taylorC, taylorN, odeExpr, y0, x0, xEnd, matRows, xMin, xMax, extraExprs]);

  const tmr = useRef();
  useEffect(() => { 
    clearTimeout(tmr.current); 
    tmr.current = setTimeout(compute, 700); 
    return () => clearTimeout(tmr.current); 
  }, [compute]);

  return { 
    tab, setTab, expr, setExpr, variable, setVariable, order, setOrder, lower, setLower, upper, setUpper,
    limitVal, setLimitVal, dir, setDir, taylorC, setTaylorC, taylorN, setTaylorN,
    odeExpr, setOdeExpr, y0, setY0, x0, setX0, xEnd, setXEnd, matRows, setMatRows,
    xMin, setXMin, xMax, setXMax, extraExprs, setExtraExprs,
    result, steps, graphs, err, computing, compute 
  };
}

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
export default function CalculusSolver() {
  const [mode, setMode] = useState('dark');
  const sv = useSolver();
  const katex = useKatex();
  const neon = mode === 'dark';
  const [showKeys, setShowKeys] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const { tab, setTab, expr, setExpr, result, steps, graphs, err, computing, compute,
    xMin, setXMin, xMax, setXMax, extraExprs, setExtraExprs } = sv;

  const addK = v => setExpr(prev => prev + (KM[v] || v));
  const help = TAB_HELP[tab];
  const T = neon ? 'n' : 'm'; // theme prefix

  return (
    <div className={T} style={{ fontFamily: 'Space Grotesk,sans-serif' }}>
      <style>{STYLES}</style>

      {/* TOP BAR — compact, ad-ready */}
      <div style={{
        background: neon ? 'rgba(6,6,18,.97)' : '#fff',
        borderBottom: neon ? '1px solid #1c1c3a' : '1px solid #dde3f5',
        padding: '0 16px', display: 'flex', alignItems: 'center', gap: 10, height: 44,
        position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)',
        boxShadow: neon ? '0 1px 0 #1c1c3a' : '0 1px 12px rgba(0,0,0,.06)'
      }}>
        {/* Logo — minimal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <div style={{
            width: 26, height: 26, borderRadius: neon ? 4 : 6, flexShrink: 0,
            background: neon ? 'linear-gradient(135deg,#00d4ff22,#7b2fff22)' : 'linear-gradient(135deg,#5b21b6,#2563eb)',
            border: neon ? '1px solid rgba(0,212,255,.3)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: neon ? '#00d4ff' : '#fff',
          }}>
            {ic.deriv}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, lineHeight: 1, letterSpacing: '-.01em', color: neon ? '#eef2ff' : '#1e2448' }}>
              Calculus<span style={{ color: neon ? '#00d4ff' : '#5b21b6' }}>Pro</span>
            </div>
            <div style={{ fontSize: 8, color: neon ? '#6b7bb8' : '#9099c8', lineHeight: 1, letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 1 }}>
              Solver & 3D Grapher
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Status */}
        {computing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: neon ? '#ff6b35' : '#d97706', animation: 'pulse2 .8s ease infinite' }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: neon ? '#ff6b35' : '#d97706', letterSpacing: '.1em', textTransform: 'uppercase' }}>Computing</span>
          </div>
        )}

        {/* Theme switch */}
        <button onClick={() => setMode(m => m === 'dark' ? 'light' : 'dark')}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 11px',
            border: neon ? '1px solid #1c1c3a' : '1.5px solid #dde3f5', borderRadius: 20, cursor: 'pointer',
            background: neon ? 'rgba(0,212,255,.05)' : '#f0f4ff',
            color: neon ? '#00d4ff' : '#5b21b6', transition: 'all .2s', fontSize: 9, fontWeight: 700 }}>
          <span>{neon ? '🌙 Dark' : '☀ Light'}</span>
          <div style={{ width: 28, height: 15, borderRadius: 8, background: neon ? '#00d4ff' : '#5b21b6', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 2, width: 11, height: 11, borderRadius: '50%', background: '#fff',
              transition: 'left .18s', left: neon ? 14 : 2 }} />
          </div>
        </button>

        {/* Ad slot — top right, clearly labeled */}
        
      </div>

      {/* TABS — scrollable */}
      <div style={{
        display: 'flex',
        borderBottom: neon ? '1px solid #1c1c3a' : '1px solid #dde3f5',
        background: neon ? 'rgba(6,6,18,.95)' : '#fff',
        overflowX: 'auto', scrollbarWidth: 'none',
        boxShadow: neon ? 'none' : '0 1px 6px rgba(0,0,0,.04)'
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`${T} tab ${tab === t.id ? 'on' : ''}`} style={{ minWidth: 76, whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* AD BANNER — leaderboard below tabs */}
      <div style={{
        background: neon ? 'rgba(6,6,18,.95)' : '#fff',
        borderBottom: neon ? '1px solid #1c1c3a' : '1px solid #dde3f5',
        padding: '6px 16px', display: 'flex', justifyContent: 'center',
      }}>
        
      </div>

      {/* BODY — 2-column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 276px', minHeight: 'calc(100vh - 130px)', gap: 0 }}>

        {/* LEFT: solver area */}
        <div style={{ padding: '14px 14px 14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* How to use — dismissible */}
          {showHelp && (
            <div style={{ padding: '9px 12px', border: neon ? '1px solid rgba(0,212,255,.18)' : '1.5px solid rgba(91,33,182,.18)',
              borderRadius: neon ? 4 : 8, background: neon ? 'rgba(0,212,255,.04)' : 'rgba(91,33,182,.04)',
              display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ color: neon ? '#00d4ff' : '#5b21b6', flexShrink: 0, marginTop: 1 }}>{ic.info}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: neon ? '#eef2ff' : '#1e2448', marginBottom: 2 }}>{TABS.find(t => t.id === tab)?.full} — How to use</div>
                <div style={{ fontSize: 10, color: neon ? '#6b7bb8' : '#9099c8', lineHeight: 1.6 }}>{help.tip}</div>
                <div style={{ fontSize: 9, fontFamily: 'Fira Code,monospace', color: neon ? 'rgba(0,212,255,.5)' : 'rgba(91,33,182,.55)', marginTop: 3 }}>e.g. {help.hint}</div>
              </div>
              <button onClick={() => setShowHelp(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: neon ? '#6b7bb8' : '#9099c8', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
            </div>
          )}

          {/* Expression */}
          {tab !== 'matrix' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <div className="lbl">{tab === 'ode' ? `dy/d${sv.variable} = f(x,y) — enter f below` : `Enter f(${sv.variable})`}</div>
                <button onClick={() => setShowKeys(s => !s)} className="btn-sm" style={{ padding: '3px 8px', fontSize: 9, gap: 3 }}>
                  {ic.kbd} {showKeys ? 'Hide' : 'Keyboard'}
                </button>
              </div>
              <input className={`${T} inp`} value={expr} onChange={e => setExpr(e.target.value)}
                placeholder="e.g. x^2 + sin(x)" style={{ fontSize: 14, padding: 11 }} />
              <AnimatePresence>
                {showKeys && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginTop: 6 }}>
                    <div className={neon ? 'n panel' : 'm panel'} style={{ padding: 10 }}>
                      <div style={{ fontSize: 9, fontWeight: 600, color: neon ? '#6b7bb8' : '#9099c8', marginBottom: 6, letterSpacing: '.08em', textTransform: 'uppercase' }}>Click to insert</div>
                      {KEY_ROWS.map((row, ri) => (
                        <div key={ri} style={{ display: 'flex', gap: 4, marginBottom: 4, flexWrap: 'wrap' }}>
                          {row.map(k => <button key={k} className={`${T} kbd`} onClick={() => addK(k)}>{k}</button>)}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Tab params */}
          <div className={neon ? 'n panel' : 'm panel'} style={{ padding: 12 }}>
            <div className="lbl" style={{ marginBottom: 8 }}>Parameters</div>
            <TabSettings sv={sv} neon={neon} />
          </div>

          {/* Solve button */}
          <button className={`${T} btn-primary`} style={{ alignSelf: 'flex-start' }} onClick={compute} disabled={computing}>
            {ic.play} {computing ? 'Computing…' : 'Solve'}
          </button>

          {/* Error */}
          {err && (
            <div style={{ padding: '8px 12px', border: neon ? '1px solid rgba(255,28,68,.28)' : '1.5px solid rgba(220,38,38,.22)',
              borderRadius: neon ? 3 : 8, background: neon ? 'rgba(255,28,68,.05)' : 'rgba(220,38,38,.04)',
              fontSize: 11, color: neon ? '#ff1744' : '#dc2626', lineHeight: 1.5 }}>
              ⚠ {err}
            </div>
          )}

          {/* Result */}
          {result && !err && (
            <div className={neon ? 'n panel' : 'm panel'} style={{ padding: 12 }}>
              <ResultBox result={result} katex={katex} neon={neon} />
            </div>
          )}

          {/* ── GRAPH ── */}
          {tab !== 'matrix' && !err && (
            <GraphPanel
              datasets={graphs}
              expr={tab === 'ode' ? sv.odeExpr : expr}
              variable={sv.variable}
              xMin={xMin} xMax={xMax} setXMin={setXMin} setXMax={setXMax}
              extraExprs={extraExprs} setExtraExprs={setExtraExprs}
              neon={neon} tab={tab}
            />
          )}

          {/* Steps */}
          {steps.length > 0 && (
            <div className={neon ? 'n panel' : 'm panel'} style={{ padding: 14 }}>
              <div className="lbl" style={{ marginBottom: 12 }}>Step-by-Step Solution</div>
              <Steps steps={steps} neon={neon} katex={katex} />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
            
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{
          borderLeft: neon ? '1px solid #1c1c3a' : '1px solid #dde3f5',
          background: neon ? 'rgba(6,6,18,.95)' : '#f8f9ff',
          padding: '14px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14,
        }}>

          {/* Sidebar ad slot */}

          {/* Examples */}
          <div>
            <div className="lbl" style={{ marginBottom: 8 }}>Quick Examples</div>
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => {
                setTab(ex.tab); setExpr(ex.expr || expr);
                if (ex.odeExpr) sv.setOdeExpr(ex.odeExpr);
                if (ex.limitVal) sv.setLimitVal(ex.limitVal);
                setShowHelp(false);
              }}
                style={{ display: 'flex', width: '100%', textAlign: 'left', marginBottom: 4, padding: '7px 9px',
                  border: neon ? '1px solid #1c1c3a' : '1.5px solid #dde3f5', borderRadius: neon ? 3 : 8,
                  background: neon ? 'rgba(0,0,0,.25)' : '#fff', cursor: 'pointer', fontFamily: 'Space Grotesk',
                  fontSize: 10, color: neon ? '#6b7bb8' : '#9099c8', transition: 'all .12s', gap: 8, alignItems: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = neon ? '#00d4ff' : '#5b21b6'; e.currentTarget.style.color = neon ? '#00d4ff' : '#5b21b6'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = neon ? '#1c1c3a' : '#dde3f5'; e.currentTarget.style.color = neon ? '#6b7bb8' : '#9099c8'; }}>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
                  color: neon ? 'rgba(0,212,255,.4)' : 'rgba(91,33,182,.4)', flexShrink: 0, minWidth: 38 }}>{ex.tab === 'derivative' ? 'd/dx' : ex.tab}</span>
                <span>{ex.label}</span>
              </button>
            ))}
          </div>

          {/* Syntax reference */}
          <div>
            <div className="lbl" style={{ marginBottom: 8 }}>Syntax Guide</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {[['x^2', 'Power'], ['sin(x)', 'Sine'], ['cos(x)', 'Cosine'], ['exp(x)', 'eˣ'], ['log(x)', 'ln(x)'], ['sqrt(x)', '√x'], ['pi', 'π (3.14…)'], ['Infinity', '∞'], ['abs(x)', '|x|'], ['x^2+y^2', '3D use']].map(([s, l]) => (
                <div key={s} style={{ padding: '4px 7px', borderRadius: 4, background: neon ? 'rgba(0,0,0,.25)' : 'rgba(255,255,255,.8)',
                  border: neon ? '1px solid #1c1c3a' : '1px solid #e8ecf8' }}>
                  <code style={{ fontSize: 10, fontFamily: 'Fira Code,monospace', color: neon ? '#00d4ff' : '#5b21b6', display: 'block' }}>{s}</code>
                  <span style={{ fontSize: 9, color: neon ? '#6b7bb8' : '#9099c8' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3D tips */}
          <div>
            <div className="lbl" style={{ marginBottom: 8 }}>3D Graph Tips</div>
            {['Click "3D" button in graph panel', 'Drag to rotate the surface', 'Scroll wheel to zoom', 'Uses z = f(x,y) — add y in expr', 'Click Auto to spin automatically'].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 5, alignItems: 'flex-start' }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: neon ? 'rgba(0,212,255,.12)' : 'rgba(91,33,182,.1)',
                  color: neon ? '#00d4ff' : '#5b21b6', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <span style={{ fontSize: 10, color: neon ? '#6b7bb8' : '#9099c8', lineHeight: 1.5 }}>{t}</span>
              </div>
            ))}
          </div>

          {/* Sidebar bottom ad */}
          
        </div>
      </div>
    </div>
  );
}