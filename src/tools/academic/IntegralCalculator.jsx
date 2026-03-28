import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as math from 'mathjs';

/* ═══════════════════════════════════════════════════════════════
   STYLES — HIGH-CONTRAST DUAL THEME
   Dark:  deep navy bg, bright white text, cyan accent
   Light: white/blue bg, near-black text, indigo accent
═══════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{overflow-x:hidden;font-family:'Inter',sans-serif}

@keyframes scanline{0%{top:-3px}100%{top:102%}}
@keyframes gridmove{from{background-position:0 0}to{background-position:40px 40px}}
@keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes shimmer{0%{left:-80%}100%{left:200%}}
.fadeup{animation:fadeup .22s ease both}

/* ── DARK ───────────────────────────────────────────── */
.dark{
  --bg:#020210;--surface:#080820;--s2:#0d0d2a;
  --bdr:#1e1e44;--bdr2:rgba(0,240,255,.2);
  --acc:#00f0ff;--acc2:#b000e0;--acc3:#f59e0b;
  --ok:#22c55e;--err:#f43f5e;
  --txt:#f0f4ff;--txt2:#a8b8d8;--txt3:#5a6a96;
  background:var(--bg);color:var(--txt);
  background-image:linear-gradient(rgba(0,240,255,.011) 1px,transparent 1px),
    linear-gradient(90deg,rgba(0,240,255,.011) 1px,transparent 1px);
  background-size:40px 40px;animation:gridmove 14s linear infinite
}
.scanline{position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:9999;
  background:linear-gradient(90deg,transparent,rgba(0,240,255,.5),transparent);
  box-shadow:0 0 10px rgba(0,240,255,.3);animation:scanline 8s linear infinite;top:-3px}
.dark .panel{background:linear-gradient(135deg,var(--surface),var(--s2));
  border:1px solid var(--bdr);border-radius:5px;position:relative;overflow:hidden}
.dark .panel::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,240,255,.16),transparent);pointer-events:none}
.dark .inp{background:rgba(0,0,0,.6);border:1px solid var(--bdr);border-radius:4px;
  color:var(--txt);font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:500;
  padding:11px 14px;outline:none;width:100%;transition:all .15s}
.dark .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(0,240,255,.12)}
.dark .inp::placeholder{color:var(--txt3)}
.dark .sel{background:rgba(0,0,0,.55);border:1px solid var(--bdr);border-radius:4px;
  color:var(--txt);font-size:12.5px;padding:8px 11px;outline:none;cursor:pointer;width:100%}
.dark .sel:focus{border-color:var(--acc)}
.dark .tab-bar{background:var(--surface);border-bottom:1px solid var(--bdr)}
.dark .tab{height:42px;padding:0 18px;border:none;border-bottom:2px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'Inter',sans-serif;font-size:11.5px;font-weight:700;letter-spacing:.07em;
  text-transform:uppercase;transition:all .15s;display:flex;align-items:center;gap:5px}
.dark .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(0,240,255,.05);font-size:11.5px}
.dark .tab:hover:not(.on){color:var(--txt2);background:rgba(255,255,255,.022)}
.dark .btn-primary{display:inline-flex;align-items:center;gap:7px;padding:11px 26px;
  border:1px solid var(--acc);border-radius:4px;background:rgba(0,240,255,.1);
  color:var(--acc);cursor:pointer;font-family:'Inter',sans-serif;font-size:12px;
  font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  box-shadow:0 0 18px rgba(0,240,255,.12);transition:all .18s}
.dark .btn-primary:hover{background:rgba(0,240,255,.18);box-shadow:0 0 28px rgba(0,240,255,.28);transform:translateY(-1px)}
.dark .btn-ghost{display:inline-flex;align-items:center;gap:4px;padding:5px 11px;
  border:1px solid var(--bdr);border-radius:4px;background:transparent;
  color:var(--txt3);cursor:pointer;font-family:'Inter',sans-serif;
  font-size:10.5px;font-weight:600;transition:all .13s}
.dark .btn-ghost:hover,.dark .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(0,240,255,.06)}
.dark .kbd-btn{padding:8px 10px;border:1px solid var(--bdr);border-radius:4px;
  background:rgba(0,240,255,.04);color:var(--txt2);font-family:'JetBrains Mono',monospace;
  font-size:13px;font-weight:600;cursor:pointer;transition:all .13s;text-align:center}
.dark .kbd-btn:hover{border-color:var(--acc);color:var(--acc);background:rgba(0,240,255,.1);
  box-shadow:0 0 8px rgba(0,240,255,.15)}
.dark .result-box{border:1px solid rgba(0,240,255,.22);border-radius:5px;
  background:linear-gradient(135deg,rgba(0,240,255,.07),rgba(176,0,224,.04));padding:18px 22px}
.dark .result-box::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(0,240,255,.7),transparent)}
.dark .hint{font-size:13px;color:var(--txt2);line-height:1.75;padding:10px 13px;
  border-radius:4px;background:rgba(0,240,255,.04);border-left:2.5px solid rgba(0,240,255,.3)}
.dark .lbl{font-size:10px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;
  color:rgba(0,240,255,.55);display:block;margin-bottom:5px}
.dark .metric{border:1px solid rgba(0,240,255,.13);border-radius:4px;
  padding:12px 15px;background:rgba(0,240,255,.04)}
.dark .ad-slot{background:rgba(0,240,255,.018);border:1px dashed rgba(0,240,255,.1);
  border-radius:4px;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:3px;color:var(--txt3);font-size:9px;letter-spacing:.1em;text-transform:uppercase}
.dark .err-box{padding:11px 14px;border:1px solid rgba(244,63,94,.3);border-radius:4px;
  background:rgba(244,63,94,.07);font-size:13px;color:#fb7185;line-height:1.65}
.dark .step-n{width:26px;height:26px;border-radius:50%;border:1px solid rgba(0,240,255,.28);
  background:rgba(0,240,255,.07);display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;color:var(--acc);flex-shrink:0}
.dark .step-ln{background:rgba(0,240,255,.07)}
.dark .formula-box{padding:9px 13px;border:1px solid var(--bdr);border-radius:4px;
  background:rgba(0,0,0,.4);overflow-x:auto}
.dark .sidebar{border-left:1px solid var(--bdr);background:var(--surface);
  padding:14px 12px;overflow-y:auto;display:flex;flex-direction:column;gap:14px}
.dark .sec-title{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:rgba(0,240,255,.45);margin-bottom:8px}
.dark .table-row{display:flex;justify-content:space-between;align-items:center;
  padding:9px 12px;border:1px solid var(--bdr);border-radius:3px;
  background:rgba(255,255,255,.02);margin-bottom:5px}
.dark .rule-card{padding:10px 13px;border:1px solid var(--bdr);border-radius:3px;
  background:rgba(255,255,255,.02);margin-bottom:6px}
.dark .rule-card-title{font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  color:rgba(0,240,255,.5);margin-bottom:6px}

/* ── LIGHT ──────────────────────────────────────────── */
.light{
  --bg:#eef2ff;--surface:#ffffff;--s2:#f5f7ff;
  --bdr:#c5cde8;--bdr2:#6366f1;
  --acc:#4f46e5;--acc2:#7c3aed;--acc3:#d97706;
  --ok:#16a34a;--err:#dc2626;
  --txt:#111827;--txt2:#374151;--txt3:#6b7280;
  background:var(--bg);color:var(--txt)
}
.light .panel{background:var(--surface);border:1.5px solid var(--bdr);
  border-radius:12px;box-shadow:0 2px 14px rgba(79,70,229,.07)}
.light .inp{background:#f8faff;border:1.5px solid var(--bdr);border-radius:8px;
  color:var(--txt);font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:500;
  padding:11px 14px;outline:none;width:100%;transition:all .15s;
  box-shadow:inset 0 1px 3px rgba(0,0,0,.05)}
.light .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(79,70,229,.13)}
.light .inp::placeholder{color:#b0bbd4}
.light .sel{background:#f8faff;border:1.5px solid var(--bdr);border-radius:8px;
  color:var(--txt);font-size:12.5px;padding:8px 11px;outline:none;cursor:pointer;width:100%}
.light .sel:focus{border-color:var(--acc)}
.light .tab-bar{background:#fff;border-bottom:1.5px solid var(--bdr)}
.light .tab{height:42px;padding:0 18px;border:none;border-bottom:2.5px solid transparent;
  background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'Inter',sans-serif;font-size:11.5px;font-weight:700;letter-spacing:.06em;
  text-transform:uppercase;transition:all .15s;display:flex;align-items:center;gap:5px}
.light .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(79,70,229,.06);font-weight:800}
.light .tab:hover:not(.on){color:var(--txt2);background:rgba(79,70,229,.04)}
.light .btn-primary{display:inline-flex;align-items:center;gap:7px;padding:11px 26px;
  border:none;border-radius:8px;background:linear-gradient(135deg,var(--acc),var(--acc2));
  color:#fff;cursor:pointer;font-family:'Inter',sans-serif;font-size:12px;font-weight:700;
  box-shadow:0 4px 14px rgba(79,70,229,.38);transition:all .18s}
.light .btn-primary:hover{box-shadow:0 8px 22px rgba(79,70,229,.5);transform:translateY(-1px)}
.light .btn-ghost{display:inline-flex;align-items:center;gap:4px;padding:5px 11px;
  border:1.5px solid var(--bdr);border-radius:7px;background:transparent;
  color:var(--txt3);cursor:pointer;font-family:'Inter',sans-serif;
  font-size:10.5px;font-weight:600;transition:all .13s}
.light .btn-ghost:hover,.light .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(79,70,229,.07)}
.light .kbd-btn{padding:8px 10px;border:1.5px solid var(--bdr);border-radius:7px;
  background:var(--s2);color:var(--txt2);font-family:'JetBrains Mono',monospace;
  font-size:13px;font-weight:700;cursor:pointer;transition:all .13s;text-align:center;
  box-shadow:0 1px 3px rgba(0,0,0,.07)}
.light .kbd-btn:hover{border-color:var(--acc);color:var(--acc);background:rgba(79,70,229,.08);
  box-shadow:0 2px 8px rgba(79,70,229,.2)}
.light .result-box{border:1.5px solid rgba(79,70,229,.28);border-radius:10px;
  background:linear-gradient(135deg,rgba(79,70,229,.07),rgba(124,58,237,.04));padding:18px 22px}
.light .hint{font-size:13px;color:var(--txt2);line-height:1.75;padding:10px 13px;
  border-radius:8px;background:rgba(79,70,229,.06);border-left:2.5px solid rgba(79,70,229,.42)}
.light .lbl{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
  color:var(--acc);display:block;margin-bottom:5px}
.light .metric{border:1.5px solid rgba(79,70,229,.18);border-radius:8px;
  padding:12px 15px;background:rgba(79,70,229,.05)}
.light .ad-slot{background:rgba(79,70,229,.03);border:1.5px dashed rgba(79,70,229,.18);
  border-radius:8px;display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:3px;color:var(--txt3);font-size:9px;letter-spacing:.1em;text-transform:uppercase}
.light .err-box{padding:11px 14px;border:1.5px solid rgba(220,38,38,.25);border-radius:8px;
  background:rgba(220,38,38,.06);font-size:13px;color:var(--err);line-height:1.65}
.light .step-n{width:26px;height:26px;border-radius:50%;border:1.5px solid rgba(79,70,229,.28);
  background:rgba(79,70,229,.09);display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;color:var(--acc);flex-shrink:0}
.light .step-ln{background:rgba(79,70,229,.1)}
.light .formula-box{padding:9px 13px;border:1.5px solid var(--bdr);border-radius:8px;
  background:rgba(79,70,229,.035);overflow-x:auto}
.light .sidebar{border-left:1.5px solid var(--bdr);background:var(--s2);
  padding:14px 12px;overflow-y:auto;display:flex;flex-direction:column;gap:14px}
.light .sec-title{font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;
  color:var(--acc);margin-bottom:8px}
.light .table-row{display:flex;justify-content:space-between;align-items:center;
  padding:9px 12px;border:1.5px solid var(--bdr);border-radius:7px;
  background:rgba(79,70,229,.03);margin-bottom:5px}
.light .rule-card{padding:10px 13px;border:1.5px solid var(--bdr);border-radius:7px;
  background:rgba(79,70,229,.03);margin-bottom:6px}
.light .rule-card-title{font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  color:var(--acc);margin-bottom:6px}

/* shared */
.topbar{height:38px;position:relative;z-index:300;
  display:flex;align-items:center;padding:0 12px;gap:7px;backdrop-filter:blur(14px)}
.dark .topbar{background:rgba(2,2,16,.97);border-bottom:1px solid var(--bdr)}
.light .topbar{background:rgba(255,255,255,.97);border-bottom:1.5px solid var(--bdr);
  box-shadow:0 1px 8px rgba(79,70,229,.06)}
.prose p{font-size:14px;line-height:1.8;margin-bottom:13px;color:inherit}
.prose h3{font-size:17.5px;font-weight:700;margin:22px 0 10px}
.prose ul{padding-left:20px;margin-bottom:13px}
.prose li{font-size:14px;line-height:1.75;margin-bottom:5px}
.prose strong{font-weight:700}
`;

/* ═══════════════════════════════════════════════════════════════
   KATEX
═══════════════════════════════════════════════════════════════ */
function useKatex() {
  const [ok, setOk] = useState(!!window.katex);
  useEffect(() => {
    if (window.katex) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(l);
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    s.onload = () => setOk(true);
    document.head.appendChild(s);
  }, []);
  return ok;
}
function KTeX({ latex, display = false, dark }) {
  if (window.katex) {
    try {
      const h = window.katex.renderToString(latex, { displayMode: display, throwOnError: false });
      return <span dangerouslySetInnerHTML={{ __html: h }} style={{ color: dark ? '#f0f4ff' : '#111827' }} />;
    } catch (e) {}
  }
  return <code style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: display ? 15 : 12, color: dark ? '#00f0ff' : '#4f46e5' }}>{latex}</code>;
}

/* ═══════════════════════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════════════════════ */
const Svg = ({ d, s = 15, sw = 1.8 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const I = {
  integ: s => <Svg s={s} d="M6 20c0-8 4-16 12-16M6 4C6 12 10 20 18 20" />,
  infin: s => <Svg s={s} d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" />,
  defin: s => <Svg s={s} d={["M4 6h16","M4 18h16","M8 6v12","M16 6v12"]} />,
  graph: s => <Svg s={s} d={["M3 3v18h18","M7 16l4-8 4 4 4-8"]} />,
  kb:    s => <Svg s={s} d={["M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z","M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"]} />,
  info:  s => <Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 16v-4M12 8h.01"]} />,
  copy:  s => <Svg s={s} d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2","M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"]} />,
  ok:    s => <Svg s={s} d="M20 6 9 17l-5-5" />,
  book:  s => <Svg s={s} d={["M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"]} />,
  table: s => <Svg s={s} d={["M3 3h18v18H3z","M3 9h18","M3 15h18","M9 3v18","M15 3v18"]} />,
  fx:    s => <Svg s={s} d={["M4 7c0-1.1.9-2 2-2h12","M4 17c0 1.1.9 2 2 2h12","M9 3v18","M7 12h10"]} />,
  shuffle: s => <Svg s={s} d={["M16 3h5v5","M4 20 21 3","M21 16v5h-5","M15 15l6 6","M4 4l5 5"]} />,
  check: s => <Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M9 12l2 2 4-4"]} />,
};

/* ═══════════════════════════════════════════════════════════════
   MATH ENGINE
═══════════════════════════════════════════════════════════════ */

// Extended pattern-based symbolic integrator
const SYM_INTEGRALS = [
  // Power rule
  { rx: /^x$/, fn: () => 'x^2/2' },
  { rx: /^x\^(\d+(?:\.\d+)?)$/, fn: (m) => `x^${parseFloat(m[1])+1}/${parseFloat(m[1])+1}` },
  { rx: /^(\d+(?:\.\d+)?)\*x$/, fn: (m) => `${m[1]}*x^2/2` },
  { rx: /^(\d+(?:\.\d+)?)\*x\^(\d+(?:\.\d+)?)$/, fn: (m) => `${m[1]}*x^${parseFloat(m[2])+1}/${parseFloat(m[2])+1}` },
  { rx: /^(\d+(?:\.\d+)?)$/, fn: (m) => `${m[1]}*x` },
  // Trig
  { rx: /^sin\(x\)$/, fn: () => '-cos(x)' },
  { rx: /^cos\(x\)$/, fn: () => 'sin(x)' },
  { rx: /^tan\(x\)$/, fn: () => '-ln(|cos(x)|)' },
  { rx: /^sin\((\d+)x\)$/, fn: (m) => `-cos(${m[1]}x)/${m[1]}` },
  { rx: /^cos\((\d+)x\)$/, fn: (m) => `sin(${m[1]}x)/${m[1]}` },
  { rx: /^sin\((\d+)\*x\)$/, fn: (m) => `-cos(${m[1]}*x)/${m[1]}` },
  { rx: /^cos\((\d+)\*x\)$/, fn: (m) => `sin(${m[1]}*x)/${m[1]}` },
  // Exponential / log
  { rx: /^e\^x$/, fn: () => 'e^x' },
  { rx: /^exp\(x\)$/, fn: () => 'exp(x)' },
  { rx: /^e\^\((\d+)\*x\)$/, fn: (m) => `e^(${m[1]}*x)/${m[1]}` },
  { rx: /^exp\((\d+)\*x\)$/, fn: (m) => `exp(${m[1]}*x)/${m[1]}` },
  { rx: /^1\/x$/, fn: () => 'ln|x|' },
  { rx: /^x\^(-1)$/, fn: () => 'ln|x|' },
  { rx: /^ln\(x\)$/, fn: () => 'x*ln(x) - x' },
  { rx: /^log\(x\)$/, fn: () => 'x*ln(x) - x' },
  // Sqrt
  { rx: /^sqrt\(x\)$/, fn: () => '(2/3)*x^(3/2)' },
  { rx: /^x\^\(1\/2\)$/, fn: () => '(2/3)*x^(3/2)' },
  // Hyperbolic
  { rx: /^sinh\(x\)$/, fn: () => 'cosh(x)' },
  { rx: /^cosh\(x\)$/, fn: () => 'sinh(x)' },
  // sec², csc²
  { rx: /^sec\(x\)\^2$/, fn: () => 'tan(x)' },
  { rx: /^csc\(x\)\^2$/, fn: () => '-cot(x)' },
];

function patternIntegrate(expr) {
  const e = expr.replace(/\s/g,'');
  for (const { rx, fn } of SYM_INTEGRALS) {
    const m = e.match(rx);
    if (m) return fn(m);
  }
  return null;
}

// Full symbolic integrator using mathjs AST
function symbolicIntegrate(expr, v) {
  // First try patterns
  const pat = patternIntegrate(expr);
  if (pat) return pat;

  try {
    const node = math.parse(expr);
    const integrate = (n) => {
      if (n.type === 'OperatorNode' && (n.op === '+' || n.op === '-')) {
        return new math.OperatorNode(n.op, n.fn, [integrate(n.args[0]), integrate(n.args[1])]);
      }
      if (n.type === 'OperatorNode' && n.op === '*') {
        if (n.args[0].type === 'ConstantNode')
          return new math.OperatorNode('*', 'multiply', [n.args[0], integrate(n.args[1])]);
        if (n.args[1].type === 'ConstantNode')
          return new math.OperatorNode('*', 'multiply', [integrate(n.args[0]), n.args[1]]);
      }
      if (n.type === 'OperatorNode' && n.op === '^') {
        if (n.args[0].type === 'SymbolNode' && n.args[0].name === v && n.args[1].type === 'ConstantNode') {
          const p = parseFloat(n.args[1].value);
          if (p === -1) return math.parse(`log(abs(${v}))`);
          const np = p + 1;
          return math.parse(`(${v}^${np})/${np}`);
        }
      }
      if (n.type === 'SymbolNode' && n.name === v) return math.parse(`(${v}^2)/2`);
      if (n.type === 'ConstantNode') return new math.OperatorNode('*', 'multiply', [n, new math.SymbolNode(v)]);
      if (n.type === 'FunctionNode') {
        if (n.name === 'sin' && n.args[0]?.name === v) return math.parse(`-cos(${v})`);
        if (n.name === 'cos' && n.args[0]?.name === v) return math.parse(`sin(${v})`);
        if (n.name === 'exp' && n.args[0]?.name === v) return math.parse(`exp(${v})`);
        if (n.name === 'log' && n.args[0]?.name === v) return math.parse(`(${v}*log(${v})-${v})`);
      }
      throw new Error('unsupported');
    };
    return math.simplify(integrate(node)).toString();
  } catch (e) {
    return null;
  }
}

// Simpson's rule numerical integration
function numericalIntegrate(expr, v, a, b, N = 2000) {
  const compiled = math.compile(expr);
  const f = (x) => { try { return compiled.evaluate({ [v]: x }); } catch { return 0; } };
  const h = (b - a) / N;
  let s = f(a) + f(b);
  for (let i = 1; i < N; i++) s += (i % 2 === 0 ? 2 : 4) * f(a + i * h);
  return (h / 3) * s;
}

function computeIntegral(expr, v, mode, lo, hi) {
  try {
    const antiderivative = symbolicIntegrate(expr, v);

    if (mode === 'indefinite') {
      if (!antiderivative)
        return { error: 'Cannot integrate symbolically. Try: x^n, sin(x), cos(x), exp(x), ln(x), sqrt(x), or combinations.' };

      const steps = [
        {
          t: 'Identify the integrand',
          d: `We are finding ∫ f(${v}) d${v} where f(${v}) = ${expr}`,
          l: `\\int \\left(${expr.replace(/\*/g, '\\cdot ')}\\right) \\, d${v}`,
        },
        {
          t: 'Apply integration rules',
          d: 'Using Power Rule, Trigonometric, or Standard integral forms term by term',
          l: `\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C, \\quad \\int \\sin x \\, dx = -\\cos x + C`,
        },
        {
          t: 'Write the antiderivative',
          d: `The antiderivative F(${v}) with constant of integration C`,
          l: `F(${v}) = ${antiderivative.replace(/\*/g,'\\cdot ')} + C`,
          last: true,
        },
      ];
      return {
        antiderivative,
        result: `${antiderivative} + C`,
        resultTex: `${antiderivative.replace(/\*/g,'\\cdot ')} + C`,
        steps, error: null,
      };
    }

    // Definite integral
    const a = math.evaluate(lo), b = math.evaluate(hi);
    if (!isFinite(a) || !isFinite(b)) return { error: 'Invalid bounds' };

    let value;
    let valueMethod = 'symbolic';
    if (antiderivative) {
      try {
        const F = math.compile(antiderivative);
        const Fb = F.evaluate({ [v]: b }), Fa = F.evaluate({ [v]: a });
        value = Fb - Fa;
        if (!isFinite(value)) throw new Error();
      } catch {
        value = numericalIntegrate(expr, v, a, b);
        valueMethod = 'numerical';
      }
    } else {
      value = numericalIntegrate(expr, v, a, b);
      valueMethod = 'numerical';
    }

    const steps = [
      {
        t: 'Set up the definite integral',
        d: `Integrate f(${v}) = ${expr} from ${lo} to ${hi}`,
        l: `\\int_{${lo}}^{${hi}} \\left(${expr.replace(/\*/g, '\\cdot ')}\\right) \\, d${v}`,
      },
      {
        t: antiderivative ? 'Find the antiderivative F(x)' : 'Numerical method (Simpson\'s Rule)',
        d: antiderivative
          ? `F(${v}) = ${antiderivative}`
          : `No closed form found — using Simpson's rule with 2000 intervals`,
        l: antiderivative
          ? `F(${v}) = ${antiderivative.replace(/\*/g,'\\cdot ')}`
          : `\\int_a^b f(x)\\,dx \\approx \\frac{h}{3}\\left[f(a)+4f(a+h)+\\cdots+f(b)\\right]`,
      },
      {
        t: 'Apply Fundamental Theorem of Calculus',
        d: `Evaluate F at bounds: F(${hi}) − F(${lo})`,
        l: `\\left[F(${v})\\right]_{${lo}}^{${hi}} = F(${hi}) - F(${lo})`,
      },
      {
        t: `Result = ${value.toFixed(6)}`,
        d: `The net signed area under f(${v}) from ${lo} to ${hi} (${valueMethod})`,
        l: `\\int_{${lo}}^{${hi}} f(${v})\\,d${v} = ${value.toFixed(6)}`,
        last: true,
      },
    ];

    return {
      antiderivative, value,
      result: value.toFixed(6),
      resultTex: `\\int_{${lo}}^{${hi}} = ${value.toFixed(6)}`,
      steps, error: null,
    };
  } catch (e) {
    return { error: `Calculation error: ${e.message}` };
  }
}

/* ═══════════════════════════════════════════════════════════════
   AREA GRAPH CANVAS
═══════════════════════════════════════════════════════════════ */
function AreaGraph({ expr, v, lo, hi, dark }) {
  const ref = useRef();
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height;
    const p = { l: 44, r: 14, t: 18, b: 30 };
    const pw = W - p.l - p.r, ph = H - p.t - p.b;

    ctx.fillStyle = dark ? '#020210' : '#f8f9ff';
    ctx.fillRect(0, 0, W, H);

    let a, b;
    try { a = math.evaluate(lo); b = math.evaluate(hi); }
    catch { return; }
    const pad = Math.max(Math.abs(b - a) * 0.5, 0.5);
    const xLo = a - pad, xHi = b + pad;

    let compiled;
    try { compiled = math.compile(expr); }
    catch { return; }
    const f = (x) => { try { const v2 = compiled.evaluate({ [v]: x }); return isFinite(v2) ? v2 : null; } catch { return null; } };

    const N = 300;
    const xs = Array.from({ length: N + 1 }, (_, i) => xLo + (xHi - xLo) * i / N);
    const ys = xs.map(f);
    const validY = ys.filter(y => y !== null);
    if (!validY.length) return;
    const yMin = Math.min(...validY), yMax = Math.max(...validY);
    const yPad = (yMax - yMin) * 0.15 || 1;
    const yLo = yMin - yPad, yHi = yMax + yPad;

    const toX = (x) => p.l + (x - xLo) / (xHi - xLo) * pw;
    const toY = (y) => p.t + ph - (y - yLo) / (yHi - yLo) * ph;

    // Grid
    ctx.strokeStyle = dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.055)';
    ctx.lineWidth = 1; ctx.setLineDash([2, 5]);
    for (let i = 0; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(p.l + pw * i / 8, p.t); ctx.lineTo(p.l + pw * i / 8, p.t + ph); ctx.stroke(); }
    for (let i = 0; i <= 5; i++) { ctx.beginPath(); ctx.moveTo(p.l, p.t + ph * i / 5); ctx.lineTo(p.l + pw, p.t + ph * i / 5); ctx.stroke(); }
    ctx.setLineDash([]);

    // Axes
    ctx.strokeStyle = dark ? 'rgba(255,255,255,.16)' : 'rgba(0,0,0,.2)'; ctx.lineWidth = 1.2;
    if (yLo < 0 && yHi > 0) { const y0 = toY(0); ctx.beginPath(); ctx.moveTo(p.l, y0); ctx.lineTo(p.l + pw, y0); ctx.stroke(); }
    if (xLo < 0 && xHi > 0) { const x0 = toX(0); ctx.beginPath(); ctx.moveTo(x0, p.t); ctx.lineTo(x0, p.t + ph); ctx.stroke(); }

    // Shaded area between bounds
    const acc = dark ? 'rgba(0,240,255,.12)' : 'rgba(79,70,229,.1)';
    const accLine = dark ? 'rgba(0,240,255,.35)' : 'rgba(79,70,229,.3)';
    ctx.fillStyle = acc;
    ctx.beginPath();
    const y0 = toY(Math.max(yLo, 0));
    let firstFill = true;
    for (let i = 0; i <= N; i++) {
      const x = xs[i];
      if (x < a || x > b || ys[i] === null) continue;
      if (firstFill) { ctx.moveTo(toX(x), y0); ctx.lineTo(toX(x), toY(ys[i])); firstFill = false; }
      else ctx.lineTo(toX(x), toY(ys[i]));
    }
    ctx.lineTo(toX(Math.min(b, xs[N])), y0);
    ctx.closePath(); ctx.fill();

    // Bound lines
    ctx.strokeStyle = accLine; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
    [a, b].forEach(bx => {
      const bxc = toX(bx);
      ctx.beginPath(); ctx.moveTo(bxc, p.t); ctx.lineTo(bxc, p.t + ph); ctx.stroke();
    });
    ctx.setLineDash([]);

    // Main curve
    const curveC = dark ? '#00f0ff' : '#4f46e5';
    ctx.strokeStyle = curveC; ctx.lineWidth = 2.2;
    if (dark) { ctx.shadowColor = '#00f0ff'; ctx.shadowBlur = 6; }
    ctx.beginPath(); let first = true;
    for (let i = 0; i <= N; i++) {
      if (ys[i] === null) { first = true; continue; }
      const prevY = i > 0 ? ys[i - 1] : null;
      const jump = prevY !== null && Math.abs(ys[i] - prevY) > (yHi - yLo) * 2;
      if (first || jump) { ctx.moveTo(toX(xs[i]), toY(ys[i])); first = false; }
      else ctx.lineTo(toX(xs[i]), toY(ys[i]));
    }
    ctx.stroke(); ctx.shadowBlur = 0;

    // Bound labels
    ctx.fillStyle = dark ? '#00f0ff' : '#4f46e5';
    ctx.font = '700 9.5px JetBrains Mono,monospace'; ctx.textAlign = 'center';
    ctx.fillText(`a=${lo}`, toX(a), p.t + ph + 14);
    ctx.fillText(`b=${hi}`, toX(b), p.t + ph + 14);

    // Y axis labels
    ctx.fillStyle = dark ? 'rgba(168,184,216,.6)' : 'rgba(55,65,81,.65)';
    ctx.font = '9px JetBrains Mono,monospace'; ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = yLo + (yHi - yLo) * i / 4;
      ctx.fillText(y.toFixed(1), p.l - 4, toY(y) + 3);
    }
  }, [expr, v, lo, hi, dark]);

  return (
    <canvas ref={ref} width={560} height={200}
      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: dark ? 3 : 9 }} />
  );
}

/* ═══════════════════════════════════════════════════════════════
   COPY BUTTON
═══════════════════════════════════════════════════════════════ */
function CopyBtn({ text, dark }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setOk(true); setTimeout(() => setOk(false), 1500); }}
      className="btn-ghost" style={{ padding: '4px 10px', gap: 3, fontSize: 10.5 }}>
      {ok ? I.ok(10) : I.copy(10)}{ok ? 'Copied' : 'Copy'}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STEP DISPLAY
═══════════════════════════════════════════════════════════════ */
function Steps({ steps, dark, katex }) {
  return (
    <div>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', gap: 11, marginBottom: s.last ? 0 : 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <div className="step-n">{i + 1}</div>
            {!s.last && <div className="step-ln" style={{ flex: 1, width: 1.5, marginTop: 5, minHeight: 14 }} />}
          </div>
          <div style={{ flex: 1, paddingBottom: s.last ? 0 : 5 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--txt)', marginBottom: 3 }}>{s.t}</div>
            {s.d && <div style={{ fontSize: 12.5, color: 'var(--txt2)', marginBottom: 6, lineHeight: 1.65 }}>{s.d}</div>}
            <div className="formula-box">
              {katex ? <KTeX latex={s.l} dark={dark} /> : <code style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: 'var(--acc)' }}>{s.l}</code>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRESETS
═══════════════════════════════════════════════════════════════ */
const PRESETS = [
  { label: 'x² + 2x',        expr: 'x^2 + 2*x',  lo: '0', hi: '2',    mode: 'definite' },
  { label: 'sin(x)',          expr: 'sin(x)',       lo: '0', hi: 'pi',   mode: 'definite' },
  { label: 'e^x',             expr: 'e^x',          lo: '0', hi: '1',    mode: 'definite' },
  { label: 'cos(x)',          expr: 'cos(x)',        lo: '0', hi: 'pi/2', mode: 'definite' },
  { label: '1/x',             expr: '1/x',           lo: '1', hi: 'e',    mode: 'definite' },
  { label: 'x³ − 2x',        expr: 'x^3 - 2*x',   lo: '0', hi: '2',    mode: 'definite' },
  { label: 'sqrt(x)',         expr: 'sqrt(x)',       lo: '0', hi: '4',    mode: 'definite' },
  { label: 'x² (indefinite)', expr: 'x^2',           lo: '',  hi: '',     mode: 'indefinite' },
  { label: 'sin(x) (indef.)', expr: 'sin(x)',        lo: '',  hi: '',     mode: 'indefinite' },
  { label: '3x² + 4x',       expr: '3*x^2 + 4*x',  lo: '',  hi: '',     mode: 'indefinite' },
];

const KB_BTNS = [
  { l: 'x', v: 'x' }, { l: 'x²', v: 'x^2' }, { l: 'x³', v: 'x^3' },
  { l: 'xⁿ', v: 'x^' }, { l: 'sin', v: 'sin(' }, { l: 'cos', v: 'cos(' },
  { l: 'tan', v: 'tan(' }, { l: 'eˣ', v: 'e^x' }, { l: 'eⁿˣ', v: 'e^(' },
  { l: 'ln', v: 'ln(' }, { l: '√', v: 'sqrt(' }, { l: 'π', v: 'pi' },
  { l: '(', v: '(' }, { l: ')', v: ')' }, { l: '+', v: '+' },
  { l: '−', v: '-' }, { l: '*', v: '*' }, { l: '/', v: '/' },
];

/* ═══════════════════════════════════════════════════════════════
   CHEAT SHEET DATA
═══════════════════════════════════════════════════════════════ */
const INTEGRALS_TABLE = [
  { f: '\\int x^n\\,dx', r: '\\frac{x^{n+1}}{n+1}+C,\\;n\\neq-1' },
  { f: '\\int \\frac{1}{x}\\,dx', r: '\\ln|x|+C' },
  { f: '\\int e^x\\,dx', r: 'e^x+C' },
  { f: '\\int a^x\\,dx', r: '\\frac{a^x}{\\ln a}+C' },
  { f: '\\int \\sin x\\,dx', r: '-\\cos x+C' },
  { f: '\\int \\cos x\\,dx', r: '\\sin x+C' },
  { f: '\\int \\tan x\\,dx', r: '-\\ln|\\cos x|+C' },
  { f: '\\int \\sec^2 x\\,dx', r: '\\tan x+C' },
  { f: '\\int \\sinh x\\,dx', r: '\\cosh x+C' },
  { f: '\\int \\cosh x\\,dx', r: '\\sinh x+C' },
  { f: '\\int \\frac{1}{\\sqrt{1-x^2}}\\,dx', r: '\\arcsin x+C' },
  { f: '\\int \\frac{1}{1+x^2}\\,dx', r: '\\arctan x+C' },
  { f: '\\int \\ln x\\,dx', r: 'x\\ln x - x+C' },
  { f: '\\int \\sqrt{x}\\,dx', r: '\\frac{2}{3}x^{3/2}+C' },
];

const RULES_TABLE = [
  { name: 'Sum Rule', l: '\\int [f(x)\\pm g(x)]\\,dx = \\int f\\,dx \\pm \\int g\\,dx' },
  { name: 'Constant Multiple', l: '\\int c\\cdot f(x)\\,dx = c\\int f(x)\\,dx' },
  { name: 'Fundamental Theorem', l: '\\int_a^b f(x)\\,dx = F(b)-F(a)' },
  { name: 'U-Substitution', l: '\\int f(g(x))g\'(x)\\,dx = \\int f(u)\\,du,\\;u=g(x)' },
  { name: 'Integration by Parts', l: '\\int u\\,dv = uv - \\int v\\,du' },
  { name: 'Power Rule', l: '\\int x^n\\,dx = \\frac{x^{n+1}}{n+1}+C,\\;n\\neq-1' },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export default function IntegralCalculator() {
  const [mode, setMode] = useState('dark');
  const [intType, setIntType] = useState('definite');
  const [expr, setExpr] = useState('x^2 + 2*x');
  const [variable, setVariable] = useState('x');
  const [lo, setLo] = useState('0');
  const [hi, setHi] = useState('2');
  const [activeTab, setActiveTab] = useState('calc');
  const dark = mode === 'dark';
  const katex = useKatex();

  const result = useMemo(() => computeIntegral(expr, variable, intType, lo, hi), [expr, variable, intType, lo, hi]);

  const loadPreset = (p) => { setExpr(p.expr); setIntType(p.mode); if (p.lo) setLo(p.lo); if (p.hi) setHi(p.hi); setActiveTab('calc'); };
  const appendExpr = (v) => setExpr(prev => prev + v);
  const clearExpr = () => setExpr('');

  const PAGE_TABS = [
    { id: 'calc',  label: 'Calculator', ico: 'integ' },
    { id: 'guide', label: 'How to Use', ico: 'info' },
    { id: 'learn', label: 'Learn',      ico: 'book' },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className={dark ? 'dark' : 'light'}>
        {dark && <div className="scanline" />}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: dark ? 3 : 7,
              background: dark ? 'transparent' : 'linear-gradient(135deg,#4f46e5,#7c3aed)',
              border: dark ? '1px solid var(--acc)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: dark ? 'var(--acc)' : '#fff',
              boxShadow: dark ? '0 0 10px rgba(0,240,255,.22)' : '0 2px 8px rgba(79,70,229,.4)' }}>
              {I.integ(14)}
            </div>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--txt)',
              letterSpacing: dark ? '.04em' : '-.01em' }}>
              Integral<span style={{ color: 'var(--acc)' }}>Calc</span>
            </span>
          </div>
          <div style={{ flex: 1 }} />
          {/* Mode toggle */}
          <button onClick={() => setMode(dark ? 'light' : 'dark')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 11px',
              border: dark ? '1px solid rgba(0,240,255,.18)' : '1.5px solid var(--bdr)',
              borderRadius: dark ? 3 : 8, background: dark ? 'rgba(0,240,255,.03)' : 'var(--surface)',
              cursor: 'pointer', transition: 'all .14s' }}>
            {dark ? (
              <>
                <div style={{ width: 28, height: 15, borderRadius: 8, background: 'var(--acc)', position: 'relative', boxShadow: '0 0 8px rgba(0,240,255,.5)' }}>
                  <div style={{ position: 'absolute', top: 2.5, right: 2.5, width: 10, height: 10, borderRadius: '50%', background: '#020210' }} />
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(0,240,255,.6)', letterSpacing: '.1em' }}>NEON</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: 10.5, color: 'var(--txt3)', fontWeight: 600 }}>Light</span>
                <div style={{ width: 28, height: 15, borderRadius: 8, background: '#d1d5db', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 2.5, left: 2.5, width: 10, height: 10, borderRadius: '50%', background: '#9ca3af' }} />
                </div>
              </>
            )}
          </button>
        </div>

        {/* PAGE TABS */}
        <div className="tab-bar" style={{ display: 'flex' }}>
          {PAGE_TABS.map(t => (
            <button key={t.id} className={`tab ${activeTab === t.id ? 'on' : ''}`}
              onClick={() => setActiveTab(t.id)}>
              {I[t.ico]?.(11)} {t.label}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 276px', minHeight: 0 }}>

          {/* LEFT */}
          <div style={{ padding: '15px 17px', display: 'flex', flexDirection: 'column', gap: 13 }}>
            <AnimatePresence mode="wait">

              {/* ── CALCULATOR TAB ── */}
              {activeTab === 'calc' && (
                <motion.div key="calc" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>

                  {/* Int type toggle */}
                  <div style={{ display: 'flex', gap: 7 }}>
                    {[['indefinite', I.infin, 'Indefinite  ∫ f(x) dx'], ['definite', I.defin, 'Definite  ∫ₐᵇ f(x) dx']].map(([id, Ico, label]) => (
                      <button key={id} onClick={() => setIntType(id)}
                        className={`btn-ghost ${intType === id ? 'on' : ''}`}
                        style={{ flex: 1, padding: '9px 14px', fontSize: 12, fontWeight: 700, justifyContent: 'center', gap: 6 }}>
                        {Ico(13)} {label}
                      </button>
                    ))}
                  </div>

                  {/* Hint */}
                  <div className="hint" style={{ display: 'flex', gap: 7 }}>
                    {I.info(13)}
                    <span>
                      {intType === 'definite'
                        ? 'Enter f(x), set bounds a and b, and get the exact net area with a full visual graph.'
                        : 'Enter f(x) to find the antiderivative F(x) + C with step-by-step working.'}
                    </span>
                  </div>

                  {/* Input card */}
                  <div className="panel" style={{ padding: 16 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: intType === 'definite' ? '1fr 1fr 1fr' : '1fr 80px', gap: 12 }}>
                      <div style={{ gridColumn: intType === 'definite' ? '1 / 2' : '1 / 2' }}>
                        <label className="lbl">f({variable})</label>
                        <input className="inp" value={expr} onChange={e => setExpr(e.target.value)}
                          placeholder="e.g. x^2 + sin(x)" style={{ height: 44, fontSize: 16 }} />
                      </div>
                      {intType === 'definite' && (<>
                        <div>
                          <label className="lbl">Lower bound a</label>
                          <input className="inp" value={lo} onChange={e => setLo(e.target.value)}
                            placeholder="0" style={{ height: 44, fontSize: 15 }} />
                        </div>
                        <div>
                          <label className="lbl">Upper bound b</label>
                          <input className="inp" value={hi} onChange={e => setHi(e.target.value)}
                            placeholder="1" style={{ height: 44, fontSize: 15 }} />
                        </div>
                      </>)}
                      {intType === 'indefinite' && (
                        <div>
                          <label className="lbl">Variable</label>
                          <input className="inp" value={variable} onChange={e => setVariable(e.target.value)}
                            style={{ height: 44, fontSize: 15 }} />
                        </div>
                      )}
                    </div>

                    {/* Preview */}
                    <div style={{ marginTop: 12, padding: '10px 14px', textAlign: 'center',
                      border: dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)',
                      borderRadius: dark ? 3 : 8,
                      background: dark ? 'rgba(0,0,0,.35)' : 'rgba(79,70,229,.04)', minHeight: 44,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', overflowX: 'auto' }}>
                      {katex ? (
                        <KTeX display dark={dark} latex={intType === 'definite'
                          ? `\\int_{${lo}}^{${hi}} \\left(${expr.replace(/\*/g,'\\cdot ')}\\right) d${variable}`
                          : `\\int \\left(${expr.replace(/\*/g,'\\cdot ')}\\right) d${variable}`} />
                      ) : (
                        <code style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 13, color: 'var(--acc)' }}>
                          {intType === 'definite' ? `∫[${lo}→${hi}] (${expr}) d${variable}` : `∫ (${expr}) d${variable}`}
                        </code>
                      )}
                    </div>

                    {/* Keyboard */}
                    <div style={{ marginTop: 12 }}>
                      <div className="lbl" style={{ marginBottom: 6 }}>Quick input</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {KB_BTNS.map(({ l, v }) => (
                          <button key={l} className="kbd-btn" onClick={() => appendExpr(v)}
                            style={{ minWidth: 40 }}>{l}</button>
                        ))}
                        <button className="btn-ghost" onClick={clearExpr} style={{ padding: '6px 10px', fontSize: 11 }}>Clear</button>
                        <button className="btn-ghost" onClick={() => { const p = PRESETS[Math.floor(Math.random()*PRESETS.length)]; loadPreset(p); }}
                          style={{ padding: '6px 10px', fontSize: 11, gap: 3 }}>{I.shuffle(10)} Random</button>
                      </div>
                    </div>
                  </div>

                  {/* ── RESULT ── */}
                  {result && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>

                        {result.error ? (
                          <div className="err-box" style={{ display: 'flex', gap: 8 }}>
                            {I.info(14)} <span>{result.error}</span>
                          </div>
                        ) : (
                          <>
                            {/* Result box */}
                            <div className="result-box" style={{ position: 'relative' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase',
                                  color: dark ? 'rgba(0,240,255,.55)' : 'var(--acc)' }}>
                                  {intType === 'definite' ? 'Definite Integral' : 'Antiderivative'}
                                </span>
                                <CopyBtn text={result.result} dark={dark} />
                              </div>

                              {/* Big result */}
                              <div style={{ textAlign: 'center', overflowX: 'auto', minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {katex ? (
                                  intType === 'definite'
                                    ? <KTeX display dark={dark} latex={`\\int_{${lo}}^{${hi}} f(x)\\,dx = ${result.result}`} />
                                    : <KTeX display dark={dark} latex={`F(${variable}) = ${(result.antiderivative||'').replace(/\*/g,'\\cdot ')} + C`} />
                                ) : (
                                  <code style={{ fontSize: 18, fontWeight: 800, fontFamily: 'JetBrains Mono,monospace',
                                    color: dark ? 'var(--acc)' : 'var(--acc)' }}>{result.result}</code>
                                )}
                              </div>

                              {/* Extra metrics for definite */}
                              {intType === 'definite' && (
                                <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                                  {[
                                    ['Net Area', result.result, dark ? '#00f0ff' : '#4f46e5'],
                                    ['|Area|', Math.abs(parseFloat(result.result)).toFixed(6), dark ? '#b000e0' : '#7c3aed'],
                                    ['Bounds', `[${lo}, ${hi}]`, dark ? '#f59e0b' : '#d97706'],
                                    ...(result.antiderivative ? [['Method', 'Symbolic', dark ? '#22c55e' : '#16a34a']] : [['Method', 'Numerical', dark ? '#f59e0b' : '#d97706']]),
                                  ].map(([l, v, c]) => (
                                    <div key={l} className="metric" style={{ flex: 1, minWidth: 90 }}>
                                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: dark ? 'var(--txt3)' : 'var(--txt3)', marginBottom: 4 }}>{l}</div>
                                      <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'JetBrains Mono,monospace', color: c }}>{v}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Area Graph */}
                            {intType === 'definite' && (
                              <div className="panel" style={{ padding: 13 }}>
                                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase',
                                  color: dark ? 'rgba(0,240,255,.45)' : 'var(--acc)', marginBottom: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
                                  {I.graph(11)} Area Visualization
                                  <span style={{ fontSize: 8.5, color: 'var(--txt3)', fontWeight: 400 }}>Shaded region = definite integral</span>
                                </div>
                                <AreaGraph expr={expr} v={variable} lo={lo} hi={hi} dark={dark} />
                              </div>
                            )}

                            {/* Steps */}
                            {result.steps && (
                              <div className="panel" style={{ padding: 16 }}>
                                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase',
                                  color: dark ? 'rgba(0,240,255,.45)' : 'var(--acc)', marginBottom: 14 }}>
                                  Step-by-Step Solution
                                </div>
                                <Steps steps={result.steps} dark={dark} katex={katex} />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                </motion.div>
              )}

              {/* ── GUIDE TAB ── */}
              {activeTab === 'guide' && (
                <motion.div key="guide" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="hint" style={{ display: 'flex', gap: 7 }}>
                    {I.info(13)} <span>IntegralCalc computes indefinite antiderivatives and definite integrals with symbolic or numerical methods, visualised with an area graph.</span>
                  </div>
                  {[
                    ['Choose integral type', 'Click "Indefinite" for antiderivatives (result includes + C) or "Definite" for exact area between bounds a and b.'],
                    ['Enter the function', 'Type f(x) using standard math notation. Use x^2 for x², sin(x), cos(x), e^x, ln(x), sqrt(x). Use * for multiplication: 3*x^2.'],
                    ['Set bounds (definite)', 'Enter lower bound a and upper bound b. You can use expressions like pi, pi/2, or e as bounds.'],
                    ['Use the keyboard', 'Click the quick-input buttons to insert x², sin(, cos(, e^x etc. at the cursor without typing.'],
                    ['Read the result', 'The result shows the antiderivative or numeric value with LaTeX rendering. For definite integrals, a canvas graph shows the shaded area.'],
                    ['Follow the steps', 'Scroll down to see the step-by-step working — rule identification, antiderivative, FTC evaluation.'],
                    ['Try presets', 'Click any example in the sidebar to instantly load a preset. Use the "Random" button for surprise problems.'],
                  ].map(([t, b], i) => (
                    <div key={i} className="panel" style={{ padding: 14 }}>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: dark ? 3 : 9, flexShrink: 0,
                          background: dark ? 'rgba(0,240,255,.07)' : 'rgba(79,70,229,.09)',
                          border: dark ? '1px solid rgba(0,240,255,.2)' : '1.5px solid rgba(79,70,229,.24)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 800, color: 'var(--acc)' }}>{i + 1}</div>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--txt)', marginBottom: 4 }}>{t}</div>
                          <div style={{ fontSize: 13, color: 'var(--txt2)', lineHeight: 1.72 }}>{b}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {/* ── LEARN TAB ── */}
              {activeTab === 'learn' && (
                <motion.div key="learn" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="panel" style={{ padding: 22 }}>
                    <h1 style={{ fontSize: 21, fontWeight: 900, color: 'var(--txt)', marginBottom: 5 }}>
                      The Student's Guide to Integration
                    </h1>
                    <p style={{ fontSize: 12.5, color: 'var(--txt3)', marginBottom: 20 }}>
                      Antiderivatives · Definite Integrals · FTC · U-Substitution · Applications
                    </p>
                    <div className="prose" style={{ color: 'var(--txt)' }}>
                      <p style={{ color: 'var(--txt2)' }}>
                        Integration is the reverse of differentiation. While differentiation asks "how fast is this changing?", integration asks "how much has accumulated?" It underlies area, volume, probability, and countless physical quantities.
                      </p>
                      <h3 style={{ color: 'var(--txt)' }}>Indefinite vs. Definite Integrals</h3>
                      <p style={{ color: 'var(--txt2)' }}>
                        <strong style={{ color: 'var(--txt)' }}>Indefinite integrals</strong> find the antiderivative F(x) + C, representing a family of functions. <strong style={{ color: 'var(--txt)' }}>Definite integrals</strong> compute the net signed area between f(x) and the x-axis over [a, b].
                      </p>
                      {katex && window.katex ? (
                        <div style={{ textAlign:'center', overflowX:'auto', padding:'10px 14px',
                          background: dark ? 'rgba(0,0,0,.35)' : 'rgba(79,70,229,.04)',
                          border: dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)',
                          borderRadius: dark ? 3 : 8, margin:'10px 0' }}>
                          <KTeX display dark={dark} latex="\\int f(x)\\,dx = F(x)+C \\qquad \\int_a^b f(x)\\,dx = F(b)-F(a)" />
                        </div>
                      ) : null}
                      <h3 style={{ color: 'var(--txt)' }}>The Power Rule</h3>
                      <p style={{ color: 'var(--txt2)' }}>The most used integration rule: raise the power by 1 and divide by the new power.</p>
                      {katex && window.katex ? (
                        <div style={{ textAlign:'center', overflowX:'auto', padding:'10px 14px',
                          background: dark ? 'rgba(0,0,0,.35)' : 'rgba(79,70,229,.04)',
                          border: dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)',
                          borderRadius: dark ? 3 : 8, margin:'10px 0' }}>
                          <KTeX display dark={dark} latex="\\int x^n\\,dx = \\frac{x^{n+1}}{n+1}+C, \\quad n \\neq -1" />
                        </div>
                      ) : null}
                      <h3 style={{ color: 'var(--txt)' }}>U-Substitution</h3>
                      <p style={{ color: 'var(--txt2)' }}>When the integrand is a composite function f(g(x))·g′(x), let u = g(x). This reverses the Chain Rule.</p>
                      {katex && window.katex ? (
                        <div style={{ textAlign:'center', overflowX:'auto', padding:'10px 14px',
                          background: dark ? 'rgba(0,0,0,.35)' : 'rgba(79,70,229,.04)',
                          border: dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)',
                          borderRadius: dark ? 3 : 8, margin:'10px 0' }}>
                          <KTeX display dark={dark} latex="\\int f(g(x))\\,g'(x)\\,dx = \\int f(u)\\,du, \\quad u=g(x)" />
                        </div>
                      ) : null}
                      <h3 style={{ color: 'var(--txt)' }}>Integration by Parts</h3>
                      <p style={{ color: 'var(--txt2)' }}>The reverse of the Product Rule. Choose u and dv using the LIATE order (Logarithm, Inverse trig, Algebraic, Trigonometric, Exponential).</p>
                      {katex && window.katex ? (
                        <div style={{ textAlign:'center', overflowX:'auto', padding:'10px 14px',
                          background: dark ? 'rgba(0,0,0,.35)' : 'rgba(79,70,229,.04)',
                          border: dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)',
                          borderRadius: dark ? 3 : 8, margin:'10px 0' }}>
                          <KTeX display dark={dark} latex="\\int u\\,dv = uv - \\int v\\,du" />
                        </div>
                      ) : null}
                      <h3 style={{ color: 'var(--txt)' }}>Real-World Applications</h3>
                      <ul style={{ color: 'var(--txt2)' }}>
                        <li><strong style={{ color: 'var(--txt)' }}>Physics:</strong> Work = ∫ F dx, Impulse = ∫ F dt, electric charge from current over time</li>
                        <li><strong style={{ color: 'var(--txt)' }}>Probability:</strong> PDF → CDF via integration; expected values; Normal distribution area</li>
                        <li><strong style={{ color: 'var(--txt)' }}>Economics:</strong> Consumer surplus, producer surplus, total revenue from marginal revenue</li>
                        <li><strong style={{ color: 'var(--txt)' }}>Engineering:</strong> Volume of revolution (disk/shell method), centre of mass, moment of inertia</li>
                      </ul>
                      <h3 style={{ color: 'var(--txt)' }}>FAQ</h3>
                      {[
                        { q: 'Why do we add + C to indefinite integrals?', a: 'Because the derivative of any constant is 0, infinitely many antiderivatives differ only by a constant. C represents this family of solutions.' },
                        { q: 'What does "net signed area" mean?', a: 'Areas above the x-axis are positive; areas below are negative. The definite integral sums these. To get total area, integrate |f(x)|.' },
                        { q: 'When does numerical integration (Simpson\'s rule) kick in?', a: 'When no closed-form antiderivative is found — e.g. e^(x²), sin(x)/x. Simpson\'s rule is accurate to O(h⁴) with 2000 intervals.' },
                        { q: 'What is the Fundamental Theorem of Calculus?', a: 'Part 1: every continuous function has an antiderivative. Part 2: ∫ₐᵇ f(x)dx = F(b)−F(a). It connects differential and integral calculus.' },
                      ].map(({ q, a }, i) => (
                        <div key={i} style={{ padding: '12px 14px', marginBottom: 9,
                          background: dark ? 'rgba(0,0,0,.35)' : '#f8f9ff',
                          border: dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)',
                          borderRadius: dark ? 3 : 9 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--txt)', marginBottom: 5 }}>{q}</div>
                          <div style={{ fontSize: 13, color: 'var(--txt2)', lineHeight: 1.72 }}>{a}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* SIDEBAR */}
          <div className="sidebar">

            {/* Presets */}
            <div>
              <div className="sec-title">Presets</div>
              {PRESETS.map((p, i) => (
                <button key={i} onClick={() => loadPreset(p)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: 4,
                    padding: '6px 10px', fontSize: 11.5, cursor: 'pointer',
                    fontFamily: 'JetBrains Mono,monospace',
                    border: dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)',
                    borderRadius: dark ? 2 : 7, background: 'transparent',
                    color: dark ? 'var(--txt3)' : 'var(--txt2)', transition: 'all .11s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--acc)'; e.currentTarget.style.color='var(--acc)'; e.currentTarget.style.background=dark?'rgba(0,240,255,.04)':'rgba(79,70,229,.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor=dark?'var(--bdr)':'var(--bdr)'; e.currentTarget.style.color=dark?'var(--txt3)':'var(--txt2)'; e.currentTarget.style.background='transparent'; }}>
                  <span style={{ fontSize: 8.5, opacity: .45, marginRight: 4, textTransform: 'uppercase', letterSpacing: '.08em' }}>{p.mode === 'definite' ? '∫ᵇₐ' : '∫'}</span>
                  {p.label}
                </button>
              ))}
            </div>

            {/* Common integrals table */}
            <div>
              <div className="sec-title">Common Integrals</div>
              {INTEGRALS_TABLE.slice(0, 10).map(({ f, r }, i) => (
                <div key={i} className="table-row" style={{ flexDirection: 'column', gap: 3 }}>
                  <div style={{ overflowX: 'auto', fontSize: 11 }}>
                    {katex ? <KTeX latex={`${f} = ${r}`} dark={dark} /> : <code style={{ fontSize: 9.5, fontFamily: 'JetBrains Mono,monospace', color: 'var(--acc)' }}>{f} = {r}</code>}
                  </div>
                </div>
              ))}
            </div>

            {/* Rules */}
            <div>
              <div className="sec-title">Integration Rules</div>
              {RULES_TABLE.slice(0, 4).map(({ name, l }) => (
                <div key={name} className="rule-card">
                  <div className="rule-card-title">{name}</div>
                  <div style={{ overflowX: 'auto' }}>
                    {katex ? <KTeX latex={l} dark={dark} /> : <code style={{ fontSize: 9.5, fontFamily: 'JetBrains Mono,monospace', color: 'var(--acc)' }}>{l}</code>}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}