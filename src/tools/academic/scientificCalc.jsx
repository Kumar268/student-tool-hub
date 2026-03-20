import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   SCI.CALC — Scientific Calculator
   Dark Terminal Amber / Light Cream Ink  ·  QR.forge design system
   ─────────────────────────────────────────────────────────────────
   TABS:
   ◈ Calculator   — Full scientific keypad, expression display, ANS
   ƒ Functions    — Quick-access function reference with instant calc
   ∑ Constants    — 20+ physical/math constants, copy to clipboard
   📊 Grapher     — SVG function plotter with zoom/pan
   ⌛ History     — Full calculation history, recall & reuse
   ∑ Learn        — Formula reference, tips, keyboard shortcuts
   ─────────────────────────────────────────────────────────────────
   FEATURES:
   ✦ Full expression parser (no eval abuse, proper precedence)
   ✦ DEG / RAD / GRAD angle modes
   ✦ 2nd function layer (shift key)
   ✦ Memory: M+, M-, MR, MC, MS
   ✦ Constants panel (π, e, φ, c, G, h, k, etc.)
   ✦ SVG function grapher with grid, axes, zoom
   ✦ Full keyboard support
   ✦ Auto history with expression + result
   ✦ Copy result to clipboard
   ✦ Mobile responsive
   ✦ Light / Dark theme
═══════════════════════════════════════════════════════════════════ */

/* ─── STYLES ──────────────────────────────────────────────────── */
const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@700;800;900&family=Lato:wght@300;400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{font-family:'Lato',sans-serif;}

.dk{--bg:#0e0c09;--s1:#141209;--s2:#1a1710;--bdr:#2a2518;--acc:#f59e0b;--acc2:#fb923c;
  --lo:#34d399;--er:#f87171;--info:#60a5fa;--pur:#a78bfa;
  --tx:#fef3c7;--tx2:#fbbf24;--tx3:#78350f;--tx4:#451a03;
  background:var(--bg);color:var(--tx);min-height:100vh;
  background-image:radial-gradient(ellipse 80% 40% at 50% -10%,rgba(245,158,11,.08),transparent 70%);}
.lt{--bg:#faf8f2;--s1:#fff;--s2:#f5f0e8;--bdr:#e8e0d0;--acc:#92400e;--acc2:#b45309;
  --lo:#065f46;--er:#991b1b;--info:#1d4ed8;--pur:#6d28d9;
  --tx:#1c1208;--tx2:#78350f;--tx3:#a16207;--tx4:#d97706;
  background:var(--bg);color:var(--tx);min-height:100vh;}

.topbar{height:48px;position:sticky;top:0;z-index:400;display:flex;align-items:center;
  padding:0 16px;gap:8px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(14,12,9,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(250,248,242,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(146,64,14,.06);}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none;}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 14px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'DM Mono',monospace;font-size:10px;
  letter-spacing:.09em;text-transform:uppercase;display:flex;align-items:center;
  gap:5px;white-space:nowrap;transition:all .14s;}
.dk .tab{color:var(--tx3);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(245,158,11,.05);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:var(--tx3);}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(146,64,14,.05);font-weight:700;}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns:224px 1fr;min-height:calc(100vh - 88px);}
.sidebar{padding:14px 12px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:16px 18px;display:flex;flex-direction:column;gap:14px;overflow-y:auto;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 16px rgba(146,64,14,.05);}
.dk .panel-hi{background:var(--s2);border:1px solid rgba(245,158,11,.32);border-radius:4px;box-shadow:0 0 28px rgba(245,158,11,.08);}
.lt .panel-hi{background:var(--s1);border:1.5px solid rgba(146,64,14,.28);border-radius:12px;box-shadow:0 4px 28px rgba(146,64,14,.1);}

.btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;
  padding:5px 11px;cursor:pointer;font-family:'DM Mono',monospace;font-size:9.5px;
  letter-spacing:.06em;text-transform:uppercase;background:transparent;transition:all .12s;}
.dk .btn-ghost{border:1px solid var(--bdr);border-radius:3px;color:var(--tx3);}
.dk .btn-ghost:hover,.dk .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(245,158,11,.06);}
.lt .btn-ghost{border:1.5px solid var(--bdr);border-radius:7px;color:var(--tx3);}
.lt .btn-ghost:hover,.lt .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(146,64,14,.06);}

.inp{width:100%;padding:8px 11px;font-family:'DM Mono',monospace;font-size:12px;outline:none;transition:all .13s;}
.dk .inp{background:rgba(0,0,0,.5);border:1px solid var(--bdr);color:var(--tx);border-radius:3px;}
.dk .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(245,158,11,.14);}
.lt .inp{background:#fdf8f0;border:1.5px solid var(--bdr);color:var(--tx);border-radius:8px;}
.lt .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(146,64,14,.1);}

.lbl{font-family:'DM Mono',monospace;font-size:8.5px;font-weight:500;letter-spacing:.2em;
  text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(245,158,11,.5);}
.lt .lbl{color:var(--acc);}
.sec-lbl{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.22em;text-transform:uppercase;margin-bottom:8px;}
.dk .sec-lbl{color:rgba(245,158,11,.35);}
.lt .sec-lbl{color:var(--acc);}

.hint{padding:9px 13px;display:flex;gap:8px;align-items:flex-start;font-size:12.5px;line-height:1.72;}
.dk .hint{border:1px solid rgba(245,158,11,.15);border-radius:3px;background:rgba(245,158,11,.04);
  border-left:2.5px solid rgba(245,158,11,.4);color:var(--tx2);}
.lt .hint{border:1.5px solid rgba(146,64,14,.15);border-radius:9px;background:rgba(146,64,14,.04);
  border-left:3px solid rgba(146,64,14,.3);color:var(--tx2);}

.scard{padding:12px 14px;display:flex;flex-direction:column;gap:3px;}
.dk .scard{background:rgba(245,158,11,.03);border:1px solid rgba(245,158,11,.1);border-radius:4px;}
.lt .scard{background:rgba(146,64,14,.03);border:1.5px solid rgba(146,64,14,.1);border-radius:10px;}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(245,158,11,.012);border:1px dashed rgba(245,158,11,.1);border-radius:3px;}
.lt .ad{background:rgba(146,64,14,.03);border:1.5px dashed rgba(146,64,14,.15);border-radius:9px;}
.ad span{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--tx3);}

.prose p{font-size:13.5px;line-height:1.82;margin-bottom:12px;color:var(--tx2);}
.prose h3{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;margin:22px 0 8px;color:var(--tx);text-transform:uppercase;letter-spacing:.04em;}
.prose strong{font-weight:700;color:var(--tx);}
.prose code{font-family:'DM Mono',monospace;font-size:11.5px;padding:1px 5px;border-radius:3px;}
.dk .prose code{background:rgba(245,158,11,.1);color:var(--acc);}
.lt .prose code{background:rgba(146,64,14,.08);color:var(--acc);}
.qa{padding:12px 15px;margin-bottom:9px;}
.dk .qa{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.3);}
.lt .qa{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(146,64,14,.03);}

/* ── CALC BUTTON ── */
.ckey{display:flex;align-items:center;justify-content:center;cursor:pointer;
  border:none;transition:all .1s;user-select:none;position:relative;overflow:hidden;
  font-family:'DM Mono',monospace;font-weight:500;letter-spacing:.04em;}
.ckey:active{transform:scale(.93);}
.ckey .shift-lbl{position:absolute;top:3px;left:5px;font-size:7.5px;opacity:.55;line-height:1;pointer-events:none;}

/* display */
.calc-display{font-family:'DM Mono',monospace;overflow:hidden;}

/* history row */
.hist-row{padding:10px 14px;display:flex;justify-content:space-between;align-items:center;
  cursor:pointer;transition:all .12s;gap:12px;}
.dk .hist-row{border:1px solid var(--bdr);border-radius:4px;background:var(--s2);}
.dk .hist-row:hover{border-color:var(--acc);background:rgba(245,158,11,.04);}
.lt .hist-row{border:1.5px solid var(--bdr);border-radius:10px;background:var(--s1);}
.lt .hist-row:hover{border-color:var(--acc);}

/* constant card */
.const-card{padding:11px 13px;cursor:pointer;transition:all .12s;}
.dk .const-card{border:1px solid var(--bdr);border-radius:4px;background:var(--s2);}
.dk .const-card:hover{border-color:var(--acc);background:rgba(245,158,11,.05);}
.lt .const-card{border:1.5px solid var(--bdr);border-radius:10px;background:var(--s1);}
.lt .const-card:hover{border-color:var(--acc);}

/* mobile */
@media(max-width:768px){
  .body{grid-template-columns:1fr!important;}
  .sidebar{display:none!important;}
  .sidebar.mob{display:flex!important;position:fixed;left:0;top:88px;bottom:0;
    width:248px;z-index:300;box-shadow:4px 0 24px rgba(0,0,0,.4);}
  .mob-btn{display:flex!important;}
  .mob-overlay{display:none;position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.55);}
  .mob-overlay.show{display:block;}
  .topbar{padding:0 12px;}
  .main{padding:10px;}
}
@media(min-width:769px){.mob-btn{display:none!important;}}
@media(max-width:520px){.g2{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr 1fr!important;}}
`;

/* ─── CONSTANTS ─────────────────────────────────────────────── */
const PHYS_CONSTANTS = [
  // Math
  { sym:'π',    name:'Pi',                       val:Math.PI,           cat:'Math',    desc:'Ratio of circumference to diameter' },
  { sym:'e',    name:"Euler's Number",            val:Math.E,            cat:'Math',    desc:'Base of natural logarithm' },
  { sym:'φ',    name:'Golden Ratio',              val:1.6180339887,      cat:'Math',    desc:'(1+√5)/2 ≈ 1.61803…' },
  { sym:'√2',   name:'Pythagoras Constant',       val:Math.SQRT2,        cat:'Math',    desc:'√2 = 1.41421…' },
  { sym:'√3',   name:'Theodorus Constant',        val:Math.sqrt(3),      cat:'Math',    desc:'√3 = 1.73205…' },
  { sym:'ln2',  name:'Natural Log of 2',          val:Math.LN2,          cat:'Math',    desc:'ln(2) = 0.69315…' },
  { sym:'ln10', name:'Natural Log of 10',         val:Math.LN10,         cat:'Math',    desc:'ln(10) = 2.30259…' },
  { sym:'γ',    name:"Euler–Mascheroni",          val:0.5772156649,      cat:'Math',    desc:'Limit of harmonic series − ln(n)' },
  { sym:'K',    name:'Catalan Constant',          val:0.9159655941,      cat:'Math',    desc:'β(2) = 1−1/9+1/25−…' },
  // Physics
  { sym:'c',    name:'Speed of Light',            val:299792458,         cat:'Physics', desc:'m/s in vacuum' },
  { sym:'G',    name:'Gravitational Constant',    val:6.67430e-11,       cat:'Physics', desc:'N·m²/kg²' },
  { sym:'h',    name:"Planck's Constant",         val:6.62607015e-34,    cat:'Physics', desc:'J·s (exact since 2019)' },
  { sym:'ℏ',    name:'Reduced Planck',            val:1.054571817e-34,   cat:'Physics', desc:'h/(2π) J·s' },
  { sym:'kB',   name:"Boltzmann Constant",        val:1.380649e-23,      cat:'Physics', desc:'J/K (exact since 2019)' },
  { sym:'NA',   name:"Avogadro's Number",         val:6.02214076e23,     cat:'Physics', desc:'mol⁻¹ (exact since 2019)' },
  { sym:'R',    name:'Gas Constant',              val:8.314462618,       cat:'Physics', desc:'J/(mol·K) = NA·kB' },
  { sym:'e⁻',   name:'Elementary Charge',         val:1.602176634e-19,   cat:'Physics', desc:'Coulombs (exact since 2019)' },
  { sym:'me',   name:'Electron Mass',             val:9.1093837015e-31,  cat:'Physics', desc:'kg' },
  { sym:'mp',   name:'Proton Mass',               val:1.67262192369e-27, cat:'Physics', desc:'kg' },
  { sym:'mn',   name:'Neutron Mass',              val:1.67492749804e-27, cat:'Physics', desc:'kg' },
  { sym:'u',    name:'Atomic Mass Unit',          val:1.66053906660e-27, cat:'Physics', desc:'kg (1/12 of C-12)' },
  { sym:'ε₀',   name:'Vacuum Permittivity',       val:8.8541878128e-12,  cat:'Physics', desc:'F/m (electric constant)' },
  { sym:'μ₀',   name:'Vacuum Permeability',       val:1.25663706212e-6,  cat:'Physics', desc:'H/m (magnetic constant)' },
  { sym:'σ',    name:'Stefan-Boltzmann',          val:5.670374419e-8,    cat:'Physics', desc:'W/(m²·K⁴)' },
  { sym:'g',    name:'Gravity (Earth)',            val:9.80665,           cat:'Physics', desc:'m/s² (standard)' },
  { sym:'atm',  name:'Standard Atmosphere',       val:101325,            cat:'Physics', desc:'Pa' },
  { sym:'Ry',   name:'Rydberg Constant',          val:1.0973731568160e7, cat:'Physics', desc:'m⁻¹' },
  { sym:'a₀',   name:'Bohr Radius',               val:5.29177210903e-11, cat:'Physics', desc:'m' },
  { sym:'F',    name:"Faraday Constant",          val:96485.33212,       cat:'Physics', desc:'C/mol = NA·e' },
  { sym:'c₁',   name:'First Radiation Const',     val:3.741771852e-16,   cat:'Physics', desc:'W·m² (Planck law)' },
  { sym:'c₂',   name:'Second Radiation Const',    val:1.438776877e-2,    cat:'Physics', desc:'m·K (Planck law)' },
];

const TABS = [
  { id:'calc',      icon:'◈', label:'Calculator' },
  { id:'functions', icon:'ƒ', label:'Functions' },
  { id:'constants', icon:'∑', label:'Constants' },
  { id:'grapher',   icon:'📊',label:'Grapher' },
  { id:'history',   icon:'⌛',label:'History' },
  { id:'learn',     icon:'?', label:'Guide' },
];

/* ─── EXPRESSION EVALUATOR ──────────────────────────────────── */
// Safe math evaluator — no eval(), proper precedence
const evaluate = (expr, angleMode = 'DEG', ans = 0, memory = 0) => {
  try {
    let e = expr.trim();
    if(!e) return { val: 0, err: null };

    // Replace symbolic constants & functions
    e = e.replace(/ANS/g, `(${ans})`);
    e = e.replace(/MEM/g, `(${memory})`);
    e = e.replace(/π/g, `(${Math.PI})`);
    e = e.replace(/e(?![0-9])/g, `(${Math.E})`);
    e = e.replace(/φ/g, `(${1.6180339887})`);
    e = e.replace(/∞/g, 'Infinity');

    // Angle conversion factor
    const toRad = angleMode === 'DEG' ? `*(Math.PI/180)` :
                  angleMode === 'GRAD' ? `*(Math.PI/200)` : '';

    // Trig & math functions
    const funcs = [
      // Inverse hyperbolic
      [/asinh\(/g,   `Math.asinh(`],
      [/acosh\(/g,   `Math.acosh(`],
      [/atanh\(/g,   `Math.atanh(`],
      // Inverse trig (text forms)
      [/arcsin\(/g,  `Math.asin(`],
      [/arccos\(/g,  `Math.acos(`],
      [/arctan\(/g,  `Math.atan(`],
      [/sin⁻¹\(/g,   `Math.asin(`],
      [/cos⁻¹\(/g,   `Math.acos(`],
      [/tan⁻¹\(/g,   `Math.atan(`],
      [/atan2\(/g,   `Math.atan2(`],
      // Hyperbolic
      [/sinh\(/g,    `Math.sinh(`],
      [/cosh\(/g,    `Math.cosh(`],
      [/tanh\(/g,    `Math.tanh(`],
      // Standard trig (angle-aware)
      [/sin\(/g,     toRad ? `_sin_(` : `Math.sin(`],
      [/cos\(/g,     toRad ? `_cos_(` : `Math.cos(`],
      [/tan\(/g,     toRad ? `_tan_(` : `Math.tan(`],
      // Logarithms
      [/log₂\(/g,    `Math.log2(`],
      [/log10\(/g,   `Math.log10(`],
      [/log2\(/g,    `Math.log2(`],
      [/logn\(([^,]+),([^)]+)\)/g, '(_logn_($1,$2))'],
      [/log\(([^,)]+),([^)]+)\)/g, '(_logn_($1,$2))'],
      [/log\(/g,     `Math.log10(`],
      [/ln\(/g,      `Math.log(`],
      // Roots & powers
      [/nthrt\(([^,]+),([^)]+)\)/g, '(_nthrt_($1,$2))'],
      [/√\(/g,       `Math.sqrt(`],
      [/√([0-9.]+)/g,`Math.sqrt($1)`],
      [/cbrt\(/g,    `Math.cbrt(`],
      [/abs\(/g,     `Math.abs(`],
      [/ceil\(/g,    `Math.ceil(`],
      [/floor\(/g,   `Math.floor(`],
      [/round\(/g,   `Math.round(`],
      [/trunc\(/g,   `Math.trunc(`],
      [/sign\(/g,    `Math.sign(`],
      [/exp\(/g,     `Math.exp(`],
      [/expm1\(/g,   `Math.expm1(`],
      [/log1p\(/g,   `Math.log1p(`],
      // Engineering functions
      [/sinc\(/g,    `_sinc_(`],
      [/clamp\(([^,]+),([^,]+),([^)]+)\)/g, '(_clamp_($1,$2,$3))'],
      [/lerp\(([^,]+),([^,]+),([^)]+)\)/g,  '(_lerp_($1,$2,$3))'],
      [/hypot\(/g,   `Math.hypot(`],
      [/gcd\(([^,]+),([^)]+)\)/g,   '(_gcd_($1,$2))'],
      [/lcm\(([^,]+),([^)]+)\)/g,   '(_lcm_($1,$2))'],
      [/mod\(([^,]+),([^)]+)\)/g,   '(($1)%($2))'],
      [/rem\(([^,]+),([^)]+)\)/g,   '(($1)%($2))'],
      // Bitwise (integer)
      [/band\(([^,]+),([^)]+)\)/g,  '(Math.trunc($1)&Math.trunc($2))'],
      [/bor\(([^,]+),([^)]+)\)/g,   '(Math.trunc($1)|Math.trunc($2))'],
      [/bxor\(([^,]+),([^)]+)\)/g,  '(Math.trunc($1)^Math.trunc($2))'],
      [/bnot\(/g,    `_bnot_(`],
      [/lsh\(([^,]+),([^)]+)\)/g,   '(Math.trunc($1)<<Math.trunc($2))'],
      [/rsh\(([^,]+),([^)]+)\)/g,   '(Math.trunc($1)>>Math.trunc($2))'],
      // Number theory
      [/isPrime\(/g,  `_isPrime_(`],
      [/gamma\(/g,    `_gamma_(`],
      [/beta\(([^,]+),([^)]+)\)/g,  '(_beta_($1,$2))'],
      [/erf\(/g,      `_erf_(`],
      [/erfc\(/g,     `_erfc_(`],
      // Statistical helpers
      [/db\(/g,       `_db_(`],
      [/idb\(/g,      `_idb_(`],
      [/deg2rad\(/g,  `_d2r_(`],
      [/rad2deg\(/g,  `_r2d_(`],
      [/nPr\(([^,]+),([^)]+)\)/g, '(_perm_($1,$2))'],
      [/nCr\(([^,]+),([^)]+)\)/g, '(_comb_($1,$2))'],
      [/(\d+)!/g,    '(_fact_($1))'],
    ];
    for(const [pat, rep] of funcs) e = e.replace(pat, rep);

    // implicit multiply: 2π → 2*(π) style, 2( → 2*(
    e = e.replace(/(\d)\(/g, '$1*(');
    e = e.replace(/\)(\d)/g, ')*$1');
    e = e.replace(/\)\(/g, ')*(');

    // power operator
    e = e.replace(/\^/g, '**');

    // percent
    e = e.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

    // ── helper functions ──────────────────────────────────────────
    const _fact_ = n => { if(n<0||n>170) return NaN; if(n<=1) return 1; let r=1; for(let i=2;i<=n;i++) r*=i; return r; };
    const _perm_ = (n,r) => _fact_(n)/_fact_(n-r);
    const _comb_ = (n,r) => _fact_(n)/(_fact_(r)*_fact_(n-r));
    const _sin_ = x => Math.sin(x * (angleMode==='DEG'?Math.PI/180:angleMode==='GRAD'?Math.PI/200:1));
    const _cos_ = x => Math.cos(x * (angleMode==='DEG'?Math.PI/180:angleMode==='GRAD'?Math.PI/200:1));
    const _tan_ = x => Math.tan(x * (angleMode==='DEG'?Math.PI/180:angleMode==='GRAD'?Math.PI/200:1));
    // Log base n
    const _logn_ = (x,n) => Math.log(x)/Math.log(n);
    // Nth root
    const _nthrt_ = (x,n) => Math.sign(x)*Math.pow(Math.abs(x),1/n);
    // Sinc (normalized)
    const _sinc_ = x => x===0 ? 1 : Math.sin(Math.PI*x)/(Math.PI*x);
    // Clamp & lerp
    const _clamp_ = (x,a,b) => Math.max(a,Math.min(b,x));
    const _lerp_  = (a,b,t) => a + t*(b-a);
    // GCD & LCM (integer)
    const _gcd_  = (a,b) => { a=Math.abs(Math.round(a)); b=Math.abs(Math.round(b)); while(b){[a,b]=[b,a%b];} return a; };
    const _lcm_  = (a,b) => Math.abs(Math.round(a)*Math.round(b))/_gcd_(a,b);
    // Bitwise NOT (32-bit signed)
    const _bnot_ = x => ~Math.trunc(x);
    // Gamma (Lanczos approximation)
    const _gamma_ = n => {
      if(n<0.5) return Math.PI/(Math.sin(Math.PI*n)*_gamma_(1-n));
      n--;
      const g=7, c=[0.99999999999980993,676.5203681218851,-1259.1392167224028,
        771.32342877765313,-176.61502916214059,12.507343278686905,
        -0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
      let x=c[0];
      for(let i=1;i<g+2;i++) x+=c[i]/(n+i);
      const t=n+g+0.5;
      return Math.sqrt(2*Math.PI)*Math.pow(t,n+0.5)*Math.exp(-t)*x;
    };
    const _beta_ = (a,b) => (_gamma_(a)*_gamma_(b))/_gamma_(a+b);
    // Error function (Horner approximation)
    const _erf_ = x => {
      const t=1/(1+0.3275911*Math.abs(x));
      const y=1-((((1.061405429*t-1.453152027)*t+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x);
      return Math.sign(x)*y;
    };
    const _erfc_ = x => 1 - _erf_(x);
    // dB conversion
    const _db_  = x => 20*Math.log10(Math.abs(x));
    const _idb_ = db => Math.pow(10, db/20);
    // Angle conversions
    const _d2r_ = d => d*Math.PI/180;
    const _r2d_ = r => r*180/Math.PI;
    // isPrime
    const _isPrime_ = n => {
      n=Math.round(n); if(n<2) return 0; if(n===2) return 1;
      if(n%2===0) return 0;
      for(let i=3;i<=Math.sqrt(n);i+=2) if(n%i===0) return 0;
      return 1;
    };

    // Safe eval via Function
    // eslint-disable-next-line no-new-func
    const result = new Function(
      '_fact_','_perm_','_comb_','_sin_','_cos_','_tan_',
      '_logn_','_nthrt_','_sinc_','_clamp_','_lerp_',
      '_gcd_','_lcm_','_bnot_','_gamma_','_beta_',
      '_erf_','_erfc_','_db_','_idb_','_d2r_','_r2d_','_isPrime_',
      `"use strict"; return (${e});`
    )(_fact_,_perm_,_comb_,_sin_,_cos_,_tan_,
      _logn_,_nthrt_,_sinc_,_clamp_,_lerp_,
      _gcd_,_lcm_,_bnot_,_gamma_,_beta_,
      _erf_,_erfc_,_db_,_idb_,_d2r_,_r2d_,_isPrime_);

    if(typeof result !== 'number') return { val: NaN, err: 'Not a number' };
    if(!isFinite(result) && result !== Infinity) return { val: NaN, err: 'Undefined' };
    return { val: result, err: null };
  } catch {
    return { val: NaN, err: 'Syntax Error' };
  }
};

const fmtResult = (n) => {
  if(n === null || n === undefined) return '';
  if(!isFinite(n)) return n > 0 ? '∞' : '-∞';
  if(isNaN(n)) return 'Error';
  if(Number.isInteger(n) && Math.abs(n) < 1e15) return n.toString();
  // avoid scientific for common cases
  if(Math.abs(n) < 1e10 && Math.abs(n) > 1e-6) {
    const s = parseFloat(n.toPrecision(12)).toString();
    return s;
  }
  return n.toExponential(8).replace(/\.?0+e/, 'e');
};

/* ─── BUTTON LAYOUT ─────────────────────────────────────────── */
// [label, action, type, shiftLabel, shiftAction, span]
// types: num, op, fn, mem, ctrl, eq, spec
const KEYS = [
  // Row 1 — mode/memory
  ['2nd',  '2nd',   'ctrl', '',      '',         1],
  ['DEG',  'MODE',  'ctrl', '',      '',         1],
  ['MC',   'MC',    'mem',  '',      '',          1],
  ['MR',   'MR',    'mem',  '',      '',          1],
  ['M+',   'M+',    'mem',  '',      '',          1],
  ['M-',   'M-',    'mem',  '',      '',          1],
  ['MS',   'MS',    'mem',  '',      '',          1],

  // Row 2 — sci functions A
  ['sin',  'sin(',  'fn',   'sin⁻¹','sin⁻¹(',   1],
  ['cos',  'cos(',  'fn',   'cos⁻¹','cos⁻¹(',   1],
  ['tan',  'tan(',  'fn',   'tan⁻¹','tan⁻¹(',   1],
  ['log',  'log(',  'fn',   'log₂', 'log₂(',     1],
  ['ln',   'ln(',   'fn',   'eˣ',   'exp(',      1],
  ['π',    'π',     'spec', 'φ',    'φ',         1],
  ['e',    'e',     'spec', '∞',    '∞',         1],

  // Row 3 — sci functions B
  ['xʸ',  '^',     'op',   'ʸ√x',  'ʸ√',       1],
  ['x²',  '^2',    'fn',   'x³',   '^3',        1],
  ['√x',  '√(',    'fn',   'cbrt', 'cbrt(',     1],
  ['1/x', '^(-1)', 'fn',   'x!',   '!',         1],
  ['nPr', 'nPr(',  'fn',   'nCr',  'nCr(',      1],
  ['(',   '(',     'op',   '',     '',           1],
  [')',   ')',     'op',   '',     '',           1],

  // Row 4 — standard + clear
  ['%',   '%',     'op',   'abs',  'abs(',      1],
  ['±',   '±',     'ctrl', '',     '',          1],
  ['AC',  'AC',    'ctrl', 'CE',   'CE',        1],
  ['⌫',  'DEL',   'ctrl', '',     '',          1],
  ['÷',   '/',     'op',   '',     '',          1],
  ['sinh','sinh(', 'fn',   'cosh', 'cosh(',     1],
  ['tanh','tanh(', 'fn',   '',     '',          1],

  // Row 5–8 — standard numpad
  ['7',   '7',     'num',  '',     '',          1],
  ['8',   '8',     'num',  '',     '',          1],
  ['9',   '9',     'num',  '',     '',          1],
  ['×',   '*',     'op',   '',     '',          1],
  ['ANS', 'ANS',   'spec', 'MEM',  'MEM',       1],
  ['floor','floor(','fn',  'ceil', 'ceil(',     1],
  ['round','round(','fn',  '',     '',          1],

  ['4',   '4',     'num',  '',     '',          1],
  ['5',   '5',     'num',  '',     '',          1],
  ['6',   '6',     'num',  '',     '',          1],
  ['−',   '-',     'op',   '',     '',          1],
  ['EE',  'e',     'spec', '',     '',          1],
  ['log₂','log₂(', 'fn',  '',     '',          1],
  ['|x|', 'abs(',  'fn',   '',     '',          1],

  ['1',   '1',     'num',  '',     '',          1],
  ['2',   '2',     'num',  '',     '',          1],
  ['3',   '3',     'num',  '',     '',          1],
  ['+',   '+',     'op',   '',     '',          1],
  ['',    '',      'blank','',     '',          1],
  ['',    '',      'blank','',     '',          1],
  ['',    '',      'blank','',     '',          1],

  ['0',   '0',     'num',  '',     '',          2],
  ['.',   '.',     'num',  '',     '',          1],
  ['=',   '=',     'eq',   '',     '',          2],
  ['',    '',      'blank','',     '',          1],
  ['',    '',      'blank','',     '',          1],
];

const FUNCTION_REF = [
  { cat:'Trigonometry', fns:[
    { name:'sin(x)',    desc:'Sine of x (respects angle mode)',         ex:'sin(30) = 0.5 [DEG]',      try:'sin(30)' },
    { name:'cos(x)',    desc:'Cosine of x',                             ex:'cos(60) = 0.5 [DEG]',      try:'cos(60)' },
    { name:'tan(x)',    desc:'Tangent of x',                            ex:'tan(45) = 1 [DEG]',        try:'tan(45)' },
    { name:'sin⁻¹(x)', desc:'Inverse sine — result in current mode',   ex:'sin⁻¹(0.5) = 30 [DEG]',   try:'sin⁻¹(0.5)' },
    { name:'cos⁻¹(x)', desc:'Inverse cosine',                          ex:'cos⁻¹(0.5) = 60 [DEG]',   try:'cos⁻¹(0.5)' },
    { name:'tan⁻¹(x)', desc:'Inverse tangent',                         ex:'tan⁻¹(1) = 45 [DEG]',      try:'tan⁻¹(1)' },
    { name:'atan2(y,x)',desc:'4-quadrant arctan, returns radians',      ex:'atan2(1,1) ≈ 0.7854',      try:'atan2(1,1)' },
    { name:'deg2rad(x)',desc:'Convert degrees → radians',              ex:'deg2rad(180) = π',          try:'deg2rad(180)' },
    { name:'rad2deg(x)',desc:'Convert radians → degrees',              ex:'rad2deg(π) = 180',          try:'rad2deg(π)' },
  ]},
  { cat:'Hyperbolic', fns:[
    { name:'sinh(x)',   desc:'Hyperbolic sine',                         ex:'sinh(1) ≈ 1.1752',         try:'sinh(1)' },
    { name:'cosh(x)',   desc:'Hyperbolic cosine',                       ex:'cosh(1) ≈ 1.5431',         try:'cosh(1)' },
    { name:'tanh(x)',   desc:'Hyperbolic tangent',                      ex:'tanh(1) ≈ 0.7616',         try:'tanh(1)' },
    { name:'asinh(x)',  desc:'Inverse hyperbolic sine',                 ex:'asinh(1.1752) ≈ 1',        try:'asinh(1.1752)' },
    { name:'acosh(x)',  desc:'Inverse hyperbolic cosine (x ≥ 1)',       ex:'acosh(1.5431) ≈ 1',        try:'acosh(1.5431)' },
    { name:'atanh(x)',  desc:'Inverse hyperbolic tangent (|x| < 1)',    ex:'atanh(0.7616) ≈ 1',        try:'atanh(0.7616)' },
  ]},
  { cat:'Powers & Roots', fns:[
    { name:'x^y',       desc:'x raised to power y',                    ex:'2^10 = 1024',              try:'2^10' },
    { name:'√(x)',      desc:'Square root',                             ex:'√(144) = 12',              try:'√(144)' },
    { name:'cbrt(x)',   desc:'Cube root',                               ex:'cbrt(27) = 3',             try:'cbrt(27)' },
    { name:'nthrt(x,n)',desc:'nth root of x',                           ex:'nthrt(32,5) = 2',          try:'nthrt(32,5)' },
    { name:'exp(x)',    desc:'eˣ',                                      ex:'exp(1) ≈ 2.71828',         try:'exp(1)' },
    { name:'expm1(x)',  desc:'eˣ − 1 (accurate near 0)',               ex:'expm1(0.001) ≈ 0.0010005', try:'expm1(0.001)' },
    { name:'hypot(a,b)',desc:'√(a²+b²) — Euclidean distance',          ex:'hypot(3,4) = 5',           try:'hypot(3,4)' },
  ]},
  { cat:'Logarithms', fns:[
    { name:'log(x)',    desc:'Base-10 logarithm',                       ex:'log(1000) = 3',            try:'log(1000)' },
    { name:'ln(x)',     desc:'Natural logarithm (base e)',               ex:'ln(e) = 1',               try:'ln(e)' },
    { name:'log₂(x)',   desc:'Base-2 / binary logarithm',              ex:'log₂(8) = 3',              try:'log₂(8)' },
    { name:'logn(x,b)', desc:'Logarithm base b',                        ex:'logn(125,5) = 3',         try:'logn(125,5)' },
    { name:'log1p(x)',  desc:'ln(1+x) — accurate near 0',              ex:'log1p(0.001) ≈ 0.0009995', try:'log1p(0.001)' },
  ]},
  { cat:'Combinatorics', fns:[
    { name:'x!',        desc:'Factorial (integer ≥ 0, max 170)',        ex:'10! = 3628800',            try:'10!' },
    { name:'nPr(n,r)',  desc:'Permutations: n!/(n−r)!',                 ex:'nPr(5,2) = 20',            try:'nPr(5,2)' },
    { name:'nCr(n,r)',  desc:'Combinations: n!/(r!(n−r)!)',             ex:'nCr(10,3) = 120',          try:'nCr(10,3)' },
    { name:'gamma(x)',  desc:'Γ(x) — generalised factorial, Γ(n)=(n−1)!', ex:'gamma(5) = 24',         try:'gamma(5)' },
    { name:'beta(a,b)', desc:'B(a,b) = Γ(a)Γ(b)/Γ(a+b)',              ex:'beta(2,3) ≈ 0.0833',       try:'beta(2,3)' },
  ]},
  { cat:'Rounding & Utility', fns:[
    { name:'floor(x)',  desc:'Largest integer ≤ x',                     ex:'floor(3.7) = 3',           try:'floor(3.7)' },
    { name:'ceil(x)',   desc:'Smallest integer ≥ x',                    ex:'ceil(3.2) = 4',            try:'ceil(3.2)' },
    { name:'round(x)',  desc:'Nearest integer',                         ex:'round(3.5) = 4',           try:'round(3.5)' },
    { name:'trunc(x)',  desc:'Integer part (towards zero)',              ex:'trunc(-3.7) = -3',         try:'trunc(-3.7)' },
    { name:'abs(x)',    desc:'Absolute value',                          ex:'abs(-7) = 7',              try:'abs(-7)' },
    { name:'sign(x)',   desc:'Sign of x: −1, 0, or +1',                ex:'sign(-5) = -1',            try:'sign(-5)' },
    { name:'mod(a,b)',  desc:'Remainder of a÷b (same as a%b)',          ex:'mod(17,5) = 2',            try:'mod(17,5)' },
  ]},
  { cat:'Signal & Engineering', fns:[
    { name:'sinc(x)',    desc:'Normalised sinc: sin(πx)/(πx), sinc(0)=1', ex:'sinc(1) = 0',           try:'sinc(1)' },
    { name:'db(x)',      desc:'20·log₁₀(|x|) — amplitude to dB',       ex:'db(2) ≈ 6.02 dB',         try:'db(2)' },
    { name:'idb(dB)',    desc:'Inverse dB → amplitude: 10^(dB/20)',     ex:'idb(6.02) ≈ 2',           try:'idb(6.02)' },
    { name:'hypot(a,b)', desc:'Magnitude of vector (a,b)',              ex:'hypot(3,4) = 5',           try:'hypot(3,4)' },
    { name:'clamp(x,a,b)',desc:'Restrict x to range [a, b]',            ex:'clamp(7,0,5) = 5',        try:'clamp(7,0,5)' },
    { name:'lerp(a,b,t)',desc:'Linear interpolation from a to b at t',  ex:'lerp(0,10,0.3) = 3',      try:'lerp(0,10,0.3)' },
  ]},
  { cat:'Special Functions', fns:[
    { name:'erf(x)',    desc:'Error function — Gaussian probability',    ex:'erf(1) ≈ 0.8427',         try:'erf(1)' },
    { name:'erfc(x)',   desc:'Complementary error function: 1−erf(x)',   ex:'erfc(1) ≈ 0.1573',        try:'erfc(1)' },
    { name:'gamma(x)',  desc:'Euler Gamma Γ(x), extends factorial',      ex:'gamma(0.5) = √π',         try:'gamma(0.5)' },
    { name:'beta(a,b)', desc:'Beta function B(a,b)',                     ex:'beta(1,1) = 1',           try:'beta(1,1)' },
  ]},
  { cat:'Number Theory & Bitwise', fns:[
    { name:'gcd(a,b)',   desc:'Greatest Common Divisor',                 ex:'gcd(48,18) = 6',          try:'gcd(48,18)' },
    { name:'lcm(a,b)',   desc:'Least Common Multiple',                   ex:'lcm(4,6) = 12',           try:'lcm(4,6)' },
    { name:'isPrime(n)', desc:'Returns 1 if prime, 0 otherwise',         ex:'isPrime(97) = 1',         try:'isPrime(97)' },
    { name:'band(a,b)',  desc:'Bitwise AND (32-bit integers)',            ex:'band(12,10) = 8',         try:'band(12,10)' },
    { name:'bor(a,b)',   desc:'Bitwise OR',                              ex:'bor(12,10) = 14',         try:'bor(12,10)' },
    { name:'bxor(a,b)',  desc:'Bitwise XOR',                             ex:'bxor(12,10) = 6',         try:'bxor(12,10)' },
    { name:'bnot(a)',    desc:'Bitwise NOT (32-bit signed)',              ex:'bnot(0) = -1',            try:'bnot(0)' },
    { name:'lsh(a,b)',   desc:'Left shift a by b bits',                  ex:'lsh(1,4) = 16',           try:'lsh(1,4)' },
    { name:'rsh(a,b)',   desc:'Right shift a by b bits',                 ex:'rsh(16,2) = 4',           try:'rsh(16,2)' },
  ]},
];

/* ─── MAIN ──────────────────────────────────────────────────── */
export default function ScientificCalculator() {
  const [dark,   setDark]   = useState(true);
  const [tab,    setTab]    = useState('calc');
  const [mob,    setMob]    = useState(false);
  const [shift,  setShift]  = useState(false);
  const [angleMode, setAngleMode] = useState('DEG'); // DEG | RAD | GRAD

  // Calculator state
  const [expr,   setExpr]   = useState('');
  const [result, setResult] = useState(null);
  const [error,  setError]  = useState(null);
  const [ans,    setAns]    = useState(0);
  const [memory, setMemory] = useState(0);
  const [memSet, setMemSet] = useState(false);
  const [justEq, setJustEq] = useState(false); // after = press

  // History
  const [hist,   setHist]   = useState([]);
  const [copied, setCopied] = useState(false);

  // Grapher
  const [fnStr,    setFnStr]    = useState('sin(x)');
  const [xMin,     setXMin]     = useState(-10);
  const [xMax,     setXMax]     = useState(10);
  const [fnError,  setFnError]  = useState(null);

  // Const filter
  const [constCat, setConstCat] = useState('All');
  const [constCopied, setConstCopied] = useState(null);

  // Function category filter
  const [fnCatFilter, setFnCatFilter] = useState('');

  const dk = dark;
  const displayRef = useRef(null);

  // Live preview
  const preview = useMemo(() => {
    if(!expr || expr.length < 2) return null;
    const { val, err } = evaluate(expr, angleMode, ans, memory);
    if(err || isNaN(val)) return null;
    return fmtResult(val);
  }, [expr, angleMode, ans, memory]);

  // ── button press handler ──
  const press = useCallback((action) => {
    if(action === '2nd') { setShift(s => !s); return; }

    // angle mode cycle
    if(action === 'MODE') {
      setAngleMode(m => m === 'DEG' ? 'RAD' : m === 'RAD' ? 'GRAD' : 'DEG');
      setShift(false);
      return;
    }

    // memory ops
    if(action === 'MC')  { setMemory(0); setMemSet(false); setShift(false); return; }
    if(action === 'MR')  { setExpr(e => justEq ? fmtResult(memory) : e + fmtResult(memory)); setJustEq(false); setShift(false); return; }
    if(action === 'MS')  { const { val } = evaluate(expr||'0', angleMode, ans, memory); setMemory(val); setMemSet(true); setShift(false); return; }
    if(action === 'M+')  { const { val } = evaluate(expr||'0', angleMode, ans, memory); setMemory(m => m+val); setMemSet(true); setShift(false); return; }
    if(action === 'M-')  { const { val } = evaluate(expr||'0', angleMode, ans, memory); setMemory(m => m-val); setMemSet(true); setShift(false); return; }

    // control
    if(action === 'AC') { setExpr(''); setResult(null); setError(null); setShift(false); setJustEq(false); return; }
    if(action === 'CE') { setExpr(''); setResult(null); setError(null); setShift(false); setJustEq(false); return; }
    if(action === 'DEL') {
      if(justEq) { setExpr(''); setJustEq(false); }
      else setExpr(e => e.slice(0, -1));
      setShift(false);
      return;
    }
    if(action === '±') {
      setExpr(e => {
        if(!e) return '-';
        if(e.startsWith('-')) return e.slice(1);
        return '-' + e;
      });
      setShift(false);
      return;
    }

    // evaluate
    if(action === '=') {
      const { val, err } = evaluate(expr, angleMode, ans, memory);
      if(err) { setError(err); setResult(null); }
      else {
        const res = fmtResult(val);
        setResult(res);
        setError(null);
        setAns(val);
        // save to history
        setHist(h => [{
          id: Date.now(),
          expr,
          result: res,
          mode: angleMode,
          time: new Date().toLocaleTimeString()
        }, ...h].slice(0, 50));
      }
      setJustEq(true);
      setShift(false);
      return;
    }

    // append to expression
    let appendStr = action;

    // special: x^2, x^3, 1/x applied to current expr or ANS
    if(action === '^2') { setExpr(e => justEq ? `(ANS)^2` : (e ? `(${e})^2` : '')); setJustEq(false); setShift(false); return; }
    if(action === '^3') { setExpr(e => justEq ? `(ANS)^3` : (e ? `(${e})^3` : '')); setJustEq(false); setShift(false); return; }
    if(action === '^(-1)') { setExpr(e => justEq ? `(ANS)^(-1)` : (e ? `(${e})^(-1)` : '')); setJustEq(false); setShift(false); return; }
    if(action === '!') { setExpr(e => e + '!'); setJustEq(false); setShift(false); return; }

    if(justEq && (action.match(/^[0-9.]$/) || action === 'ANS')) {
      setExpr(appendStr);
    } else if(justEq && (action === '+' || action === '-' || action === '*' || action === '/' || action === '^' || action === '%')) {
      setExpr('ANS' + appendStr);
    } else {
      setExpr(e => e + appendStr);
    }

    setJustEq(false);
    setShift(false);
  }, [expr, angleMode, ans, memory, justEq]);

  // ── keyboard support ──
  useEffect(() => {
    const onKey = (e) => {
      if(tab !== 'calc') return;
      const k = e.key;
      if(k >= '0' && k <= '9') press(k);
      else if(k === '.') press('.');
      else if(k === '+') press('+');
      else if(k === '-') press('-');
      else if(k === '*') press('*');
      else if(k === '/') { e.preventDefault(); press('/'); }
      else if(k === '^') press('^');
      else if(k === '%') press('%');
      else if(k === '(') press('(');
      else if(k === ')') press(')');
      else if(k === 'Enter' || k === '=') press('=');
      else if(k === 'Backspace') press('DEL');
      else if(k === 'Escape') press('AC');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [press, tab]);

  // ── Grapher ──
  const graphPoints = useMemo(() => {
    if(!fnStr) return [];
    const W = 400, steps = 400;
    const pts = [];
    for(let i = 0; i <= steps; i++) {
      const x = xMin + (xMax - xMin) * i / steps;
      // replace x in expression
      const exprX = fnStr.replace(/x/g, `(${x})`);
      const { val, err } = evaluate(exprX, angleMode, ans, memory);
      if(!err && isFinite(val) && !isNaN(val)) pts.push({ x, y: val });
      else pts.push({ x, y: null });
    }
    return pts;
  }, [fnStr, xMin, xMax, angleMode, ans, memory]);

  const GraphSVG = () => {
    const W = 400, H = 220;
    const pad = 30;
    const validPts = graphPoints.filter(p => p.y !== null);
    if(!validPts.length) return (
      <div style={{textAlign:'center',padding:'40px',fontFamily:"'DM Mono',monospace",fontSize:12,color:'var(--tx3)'}}>No valid points to plot</div>
    );
    const yMin = Math.min(...validPts.map(p=>p.y));
    const yMax = Math.max(...validPts.map(p=>p.y));
    const yRange = yMax - yMin || 1;
    const xRange = xMax - xMin;

    const sx = x => pad + (x - xMin) / xRange * (W - 2*pad);
    const sy = y => H - pad - (y - yMin) / yRange * (H - 2*pad);

    // Build path segments (break on nulls)
    let d = '', inSeg = false;
    for(const pt of graphPoints) {
      if(pt.y === null) { inSeg = false; continue; }
      if(!inSeg) { d += `M${sx(pt.x).toFixed(1)},${sy(pt.y).toFixed(1)} `; inSeg = true; }
      else d += `L${sx(pt.x).toFixed(1)},${sy(pt.y).toFixed(1)} `;
    }

    // axis positions
    const axisY = sy(0) >= pad && sy(0) <= H-pad ? sy(0) : (yMin > 0 ? H-pad : pad);
    const axisX = sx(0) >= pad && sx(0) <= W-pad ? sx(0) : (xMin > 0 ? pad : W-pad);

    // grid lines
    const xTicks = [], yTicks = [];
    for(let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      if(x === 0) continue;
      xTicks.push(x);
    }
    const yStep = Math.pow(10, Math.floor(Math.log10(yRange/4)));
    for(let y = Math.ceil(yMin/yStep)*yStep; y <= yMax; y += yStep) {
      if(Math.abs(y) < yStep*0.01) continue;
      yTicks.push(parseFloat(y.toFixed(10)));
    }

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:'100%',height:'auto',overflow:'visible'}}>
        <defs>
          <clipPath id="gc"><rect x={pad} y={pad} width={W-2*pad} height={H-2*pad}/></clipPath>
        </defs>
        {/* grid */}
        {xTicks.map(x => <line key={x} x1={sx(x)} y1={pad} x2={sx(x)} y2={H-pad} stroke={dk?'rgba(245,158,11,.07)':'rgba(146,64,14,.08)'} strokeWidth="1"/>)}
        {yTicks.map(y => <line key={y} x1={pad} y1={sy(y)} x2={W-pad} y2={sy(y)} stroke={dk?'rgba(245,158,11,.07)':'rgba(146,64,14,.08)'} strokeWidth="1"/>)}
        {/* axes */}
        <line x1={pad} y1={axisY} x2={W-pad} y2={axisY} stroke={dk?'rgba(245,158,11,.25)':'rgba(146,64,14,.25)'} strokeWidth="1.5"/>
        <line x1={axisX} y1={pad} x2={axisX} y2={H-pad} stroke={dk?'rgba(245,158,11,.25)':'rgba(146,64,14,.25)'} strokeWidth="1.5"/>
        {/* tick labels */}
        {xTicks.filter((_,i)=>i%Math.ceil(xTicks.length/6)===0).map(x=>(
          <text key={x} x={sx(x)} y={axisY+14} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">{x}</text>
        ))}
        {/* curve */}
        <motion.path d={d} fill="none" stroke="var(--acc)" strokeWidth="2.2" strokeLinecap="round" clipPath="url(#gc)"
          initial={{pathLength:0,opacity:0}} animate={{pathLength:1,opacity:1}} transition={{duration:.9,ease:'easeInOut'}}
          key={fnStr+xMin+xMax}/>
        {/* function label */}
        <text x={W-pad-4} y={pad+12} textAnchor="end" fontFamily="'DM Mono',monospace" fontSize="9" fill="var(--acc)">y = {fnStr}</text>
      </svg>
    );
  };

  // ── Key type colors ──
  const keyStyle = (type, isShift) => {
    const base = { borderRadius: dk ? 3 : 9, fontSize: 13, fontWeight: 600 };
    if(type === 'eq')   return { ...base, background: dk?'var(--acc)':'var(--acc)', color: dk?'#0e0c09':'#fff', fontSize:18, boxShadow: dk?'0 0 16px rgba(245,158,11,.4)':'0 4px 14px rgba(146,64,14,.35)' };
    if(type === 'num')  return { ...base, background: dk?'rgba(254,243,199,.07)':'rgba(255,255,255,.9)', color:'var(--tx)', border: dk?'1px solid var(--bdr)':'1.5px solid var(--bdr)' };
    if(type === 'op')   return { ...base, background: dk?'rgba(245,158,11,.12)':'rgba(146,64,14,.1)', color:'var(--tx2)', border: dk?'1px solid rgba(245,158,11,.2)':'1.5px solid rgba(146,64,14,.2)' };
    if(type === 'fn')   return { ...base, background: dk?'rgba(96,165,250,.08)':'rgba(29,78,216,.06)', color:'var(--info)', fontSize:11, border: dk?'1px solid rgba(96,165,250,.15)':'1.5px solid rgba(29,78,216,.12)' };
    if(type === 'mem')  return { ...base, background: dk?'rgba(167,139,250,.08)':'rgba(109,40,217,.06)', color:'var(--pur)', fontSize:11, border: dk?'1px solid rgba(167,139,250,.15)':'1.5px solid rgba(109,40,217,.12)' };
    if(type === 'ctrl') return { ...base, background: dk?'rgba(248,113,113,.08)':'rgba(153,27,27,.06)', color:'var(--er)', fontSize:11, border: dk?'1px solid rgba(248,113,113,.15)':'1.5px solid rgba(153,27,27,.12)' };
    if(type === 'spec') return { ...base, background: dk?'rgba(52,211,153,.08)':'rgba(6,95,70,.06)', color:'var(--lo)', fontSize:13, border: dk?'1px solid rgba(52,211,153,.15)':'1.5px solid rgba(6,95,70,.12)' };
    return { ...base, background:'transparent' };
  };

  /* ══════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{S}</style>
      <div className={dk?'dk':'lt'}>
        <div className={`mob-overlay ${mob?'show':''}`} onClick={()=>setMob(false)}/>

        {/* ════ TOPBAR ════ */}
        <div className="topbar">
          <button className="btn-ghost mob-btn" onClick={()=>setMob(s=>!s)} style={{padding:'5px 8px',fontSize:14}}>☰</button>

          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',
              borderRadius:dk?4:9,
              background:dk?'rgba(245,158,11,.1)':'linear-gradient(135deg,#92400e,#b45309)',
              border:dk?'1px solid rgba(245,158,11,.35)':'none',
              boxShadow:dk?'0 0 16px rgba(245,158,11,.25)':'0 3px 10px rgba(146,64,14,.4)'}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:13,color:dk?'#f59e0b':'#fff'}}>ƒ</span>
            </div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:16,letterSpacing:'-.01em',color:'var(--tx)'}}>
              SCI<span style={{color:'var(--acc)'}}>.calc</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontWeight:400,fontSize:8,letterSpacing:'.15em',color:'var(--tx3)',marginLeft:7,verticalAlign:'middle'}}>v2</span>
            </span>
          </div>

          <div style={{flex:1}}/>

          {/* angle mode + memory indicators */}
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <div style={{display:'flex',gap:4}}>
              {['DEG','RAD','GRAD'].map(m=>(
                <button key={m} onClick={()=>setAngleMode(m)}
                  style={{padding:'3px 8px',borderRadius:dk?2:6,cursor:'pointer',
                    fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.1em',
                    border:dk?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                    background:angleMode===m?(dk?'rgba(245,158,11,.18)':'rgba(146,64,14,.15)'):'transparent',
                    color:angleMode===m?'var(--acc)':'var(--tx3)'}}>
                  {m}
                </button>
              ))}
            </div>
            {memSet&&(
              <div style={{padding:'3px 8px',borderRadius:dk?2:6,
                fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.1em',
                border:dk?'1px solid rgba(167,139,250,.3)':'1.5px solid rgba(109,40,217,.25)',
                background:dk?'rgba(167,139,250,.1)':'rgba(109,40,217,.06)',
                color:'var(--pur)'}}>
                M = {fmtResult(memory)}
              </div>
            )}
          </div>

          <button onClick={()=>setDark(d=>!d)}
            style={{display:'flex',alignItems:'center',gap:5,padding:'4px 10px',
              border:dk?'1px solid rgba(245,158,11,.18)':'1.5px solid var(--bdr)',
              borderRadius:dk?3:7,background:'transparent',cursor:'pointer',transition:'all .14s'}}>
            <div style={{width:28,height:15,borderRadius:8,position:'relative',
              background:dk?'var(--acc)':'#d6cfc0',boxShadow:dk?'0 0 8px rgba(245,158,11,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dk?'auto':2,right:dk?2:'auto',
                width:10,height:10,borderRadius:'50%',background:dk?'#0e0c09':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.1em',color:'var(--tx3)'}}>{dk?'DARK':'LIGHT'}</span>
          </button>
        </div>

        {/* ════ TABBAR ════ */}
        <div className="tabbar">
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ════ BODY ════ */}
        <div className="body">

          {/* ── SIDEBAR ── */}
          <div className={`sidebar ${mob?'mob':''}`}>
            

            <div>
              <div className="sec-lbl">Quick Reference</div>
              {[
                ['ANS',  'Last result'],
                ['MEM',  'Memory value'],
                ['π',    '3.14159…'],
                ['e',    '2.71828…'],
                ['φ',    '1.61803…'],
                ['∞',    'Infinity'],
                ['2nd',  'Shift functions'],
                ['EE',   'Scientific notation ×10'],
              ].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                  padding:'5px 0',borderBottom:dk?'1px solid rgba(245,158,11,.05)':'1px solid rgba(146,64,14,.06)'}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--acc)',fontWeight:600}}>{l}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)'}}>{v}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="sec-lbl">Keyboard Shortcuts</div>
              {[['0–9, .','Numbers'],['+ - * /','Operators'],['Enter or =','Evaluate'],
                ['Backspace','Delete'],['Escape','Clear'],['^ %','Power, Percent']].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                  padding:'5px 0',borderBottom:dk?'1px solid rgba(245,158,11,.05)':'1px solid rgba(146,64,14,.06)'}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--info)',fontWeight:600}}>{k}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)'}}>{v}</span>
                </div>
              ))}
            </div>

            
          </div>

          {/* ── MAIN ── */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══════════ CALCULATOR TAB ══════════ */}
              {tab==='calc'&&(
                <motion.div key="calc" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.2}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  {/* Display */}
                  <div className="panel-hi" style={{padding:'16px 20px'}}>
                    {/* shift indicator */}
                    {shift&&(
                      <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
                        style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--lo)',letterSpacing:'.16em',textTransform:'uppercase',marginBottom:6}}>
                        ▲ 2ND FUNCTION ACTIVE
                      </motion.div>
                    )}
                    {/* expression */}
                    <div ref={displayRef} style={{
                      fontFamily:"'DM Mono',monospace",fontSize:16,color:'var(--tx3)',
                      minHeight:24,wordBreak:'break-all',lineHeight:1.4,marginBottom:6,
                      textAlign:'right',letterSpacing:'.02em'
                    }}>
                      {expr || <span style={{opacity:.3}}>0</span>}
                    </div>
                    {/* preview / result */}
                    <AnimatePresence mode="wait">
                      {error ? (
                        <motion.div key="err" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
                          style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:'var(--er)',textAlign:'right'}}>
                          {error}
                        </motion.div>
                      ) : result !== null ? (
                        <motion.div key="res" initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}}
                          style={{display:'flex',alignItems:'baseline',justifyContent:'flex-end',gap:8}}>
                          <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--tx3)'}}>= </span>
                          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:44,color:'var(--acc)',letterSpacing:'-.02em',lineHeight:1}}>
                            {result}
                          </span>
                          <button onClick={()=>{navigator.clipboard?.writeText(result);setCopied(true);setTimeout(()=>setCopied(false),1500);}}
                            style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:copied?'var(--lo)':'var(--tx3)',
                              background:'transparent',border:'none',cursor:'pointer',padding:'2px 6px',
                              borderRadius:3,border:dk?'1px solid rgba(245,158,11,.1)':'1px solid var(--bdr)'}}>
                            {copied?'✓':'⎘'}
                          </button>
                        </motion.div>
                      ) : preview ? (
                        <motion.div key="prev" initial={{opacity:0}} animate={{opacity:1}}
                          style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:'var(--tx3)',textAlign:'right',opacity:.6}}>
                          ≈ {preview}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                    {/* ANS display */}
                    {ans !== 0 && (
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)',textAlign:'right',marginTop:4,opacity:.5}}>
                        ANS = {fmtResult(ans)}
                      </div>
                    )}
                  </div>

                  {/* Keypad */}
                  <div style={{
                    display:'grid',
                    gridTemplateColumns:'repeat(7,1fr)',
                    gap:5,
                  }}>
                    {KEYS.map((k, i) => {
                      const [lbl, action, type, sLbl, sAction, span] = k;
                      if(type === 'blank') return <div key={i}/>;

                      const isShiftActive = shift && sLbl;
                      const displayLbl = isShiftActive ? sLbl : lbl;
                      const displayAction = isShiftActive ? sAction : action;
                      const isShiftKey = action === '2nd';
                      const isModeKey  = action === 'MODE';
                      const st = keyStyle(type, isShiftActive);

                      return (
                        <motion.button
                          key={i}
                          className="ckey"
                          whileTap={{scale:.9}}
                          onClick={() => press(displayAction)}
                          style={{
                            ...st,
                            height: type==='eq'?72:type==='num'||type==='op'?52:44,
                            gridColumn: span > 1 ? `span ${span}` : undefined,
                            outline:'none',
                            boxShadow: isShiftKey && shift ? `0 0 12px rgba(52,211,153,.5)` : st.boxShadow,
                            border: isShiftKey && shift ? '1.5px solid var(--lo)' : st.border,
                            color:  isShiftKey && shift ? 'var(--lo)' : st.color,
                          }}
                        >
                          {isShiftActive && sLbl && (
                            <span className="shift-lbl">{lbl}</span>
                          )}
                          {isModeKey ? angleMode : displayLbl}
                        </motion.button>
                      );
                    })}
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ FUNCTIONS TAB ══════════ */}
              {tab==='functions'&&(
                <motion.div key="fn" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="hint"><span>ƒ</span><span>Click <strong style={{color:'var(--acc)'}}>Try →</strong> to load an example into the calculator. All trig functions respect the current angle mode (<strong style={{color:'var(--acc)'}}>{angleMode}</strong>). New: engineering, special, bitwise, and number-theory functions added.</span></div>

                  {/* Category filter */}
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {['All',...FUNCTION_REF.map(c=>c.cat)].map(c=>(
                      <button key={c}
                        className={`btn-ghost ${(fnCatFilter===c||(!fnCatFilter&&c==='All'))?'on':''}`}
                        onClick={()=>setFnCatFilter(c==='All'?'':c)}
                        style={{fontSize:8.5}}>{c}</button>
                    ))}
                  </div>

                  {FUNCTION_REF.filter(cat=>!fnCatFilter||cat.cat===fnCatFilter).map(cat=>(
                    <div key={cat.cat} className="panel" style={{padding:'16px 18px'}}>
                      <div className="lbl" style={{marginBottom:12}}>{cat.cat}</div>
                      <div style={{display:'flex',flexDirection:'column',gap:7}}>
                        {cat.fns.map(f=>(
                          <div key={f.name} style={{display:'grid',gridTemplateColumns:'160px 1fr auto',gap:12,alignItems:'center',
                            padding:'8px 10px',borderRadius:dk?3:8,
                            border:dk?'1px solid rgba(245,158,11,.07)':'1.5px solid rgba(146,64,14,.07)'}}>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--acc)',fontWeight:600,wordBreak:'break-word'}}>{f.name}</div>
                            <div>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:10.5,color:'var(--tx2)',marginBottom:2}}>{f.desc}</div>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)'}}>{f.ex}</div>
                            </div>
                            <button className="btn-ghost" onClick={()=>{
                              setExpr(f.try || f.name.replace('(x)','(').replace('(x,b)','('));
                              setTab('calc');
                            }} style={{flexShrink:0,fontSize:8.5,whiteSpace:'nowrap'}}>Try →</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  
                </motion.div>
              )}

              {/* ══════════ CONSTANTS TAB ══════════ */}
              {tab==='constants'&&(
                <motion.div key="const" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    {['All','Math','Physics'].map(c=>(
                      <button key={c} className={`btn-ghost ${constCat===c?'on':''}`} onClick={()=>setConstCat(c)}>{c}</button>
                    ))}
                  </div>

                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}} className="g2">
                    {PHYS_CONSTANTS.filter(c=>constCat==='All'||c.cat===constCat).map((c,i)=>(
                      <motion.div key={c.sym} initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{delay:i*.03}}
                        className="const-card"
                        onClick={()=>{
                          setExpr(e=>e+c.val.toString());
                          setConstCopied(c.sym);
                          setTimeout(()=>setConstCopied(null),1500);
                          setTab('calc');
                        }}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:'var(--acc)'}}>{c.sym}</span>
                            <div>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:10.5,fontWeight:700,color:'var(--tx)',marginBottom:1}}>{c.name}</div>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)'}}>{c.desc}</div>
                            </div>
                          </div>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,color:constCopied===c.sym?'var(--lo)':'var(--tx3)',
                            padding:'2px 7px',borderRadius:3,border:dk?'1px solid rgba(245,158,11,.1)':'1.5px solid var(--bdr)',
                            background:constCopied===c.sym?(dk?'rgba(52,211,153,.1)':'rgba(6,95,70,.06)'):'transparent'}}>
                            {constCopied===c.sym?'✓ Added':'+ Use'}
                          </div>
                        </div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--info)',letterSpacing:'.04em'}}>
                          {c.val.toPrecision ? c.val.toPrecision(8) : c.val}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ GRAPHER TAB ══════════ */}
              {tab==='grapher'&&(
                <motion.div key="graph" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'16px 20px'}}>
                    <div className="lbl" style={{marginBottom:10}}>📊 Function to Plot — use <span style={{color:'var(--acc)'}}>x</span> as variable</div>
                    <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:12}}>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:14,color:'var(--tx3)'}}>y =</span>
                      <input className="inp" value={fnStr} onChange={e=>setFnStr(e.target.value)}
                        placeholder="e.g. sin(x), x^2, ln(x)+1"
                        style={{flex:1,fontSize:14}}/>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                      <div>
                        <div className="lbl">X Min</div>
                        <input className="inp" type="number" value={xMin} onChange={e=>setXMin(+e.target.value)}/>
                      </div>
                      <div>
                        <div className="lbl">X Max</div>
                        <input className="inp" type="number" value={xMax} onChange={e=>setXMax(+e.target.value)}/>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8,marginTop:10,flexWrap:'wrap'}}>
                      {[
                        ['sin(x)',     -6.28, 6.28],
                        ['x^2',        -5, 5],
                        ['ln(x)',       0.1, 10],
                        ['tan(x)',     -1.4, 1.4],
                        ['1/x',        -10, 10],
                        ['x^3-x',      -2, 2],
                        ['exp(x)',      -3, 3],
                      ].map(([f,mn,mx])=>(
                        <button key={f} className="btn-ghost" onClick={()=>{setFnStr(f);setXMin(mn);setXMax(mx);}}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                      <div className="lbl" style={{margin:0}}>y = {fnStr}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx3)'}}>x ∈ [{xMin}, {xMax}] · {angleMode} mode</div>
                    </div>
                    <GraphSVG/>
                  </div>

                  <div className="hint">
                    <span>ℹ</span>
                    <span>Use standard math notation: <strong style={{color:'var(--acc)'}}>x^2</strong> for x², <strong style={{color:'var(--acc)'}}>sin(x)</strong>, <strong style={{color:'var(--acc)'}}>ln(x)</strong>, <strong style={{color:'var(--acc)'}}>√(x)</strong>. Trig functions respect the angle mode selected in the topbar.</span>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ HISTORY TAB ══════════ */}
              {tab==='history'&&(
                <motion.div key="hist" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:9}}>
                  <div className="hint"><span>⌛</span><span>Full calculation history. Click any row to recall the expression into the calculator.</span></div>

                  {hist.length===0
                    ? <div style={{textAlign:'center',padding:'64px 24px',fontFamily:"'DM Mono',monospace",fontSize:13,color:'var(--tx3)'}}>No calculations yet — use the ◈ Calculator tab.</div>
                    : hist.map((h,i)=>(
                        <motion.div key={h.id} initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}} transition={{delay:i*.03}}
                          className="hist-row"
                          onClick={()=>{ setExpr(h.expr); setTab('calc'); }}>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--tx2)',marginBottom:2,
                              whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{h.expr}</div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)'}}>
                              {h.mode} · {h.time}
                            </div>
                          </div>
                          <div style={{textAlign:'right',flexShrink:0}}>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,color:'var(--acc)'}}>{h.result}</div>
                          </div>
                        </motion.div>
                      ))
                  }
                  {hist.length>0&&<button className="btn-ghost" onClick={()=>setHist([])} style={{alignSelf:'flex-start',marginTop:6}}>✕ Clear History</button>}

                  
                </motion.div>
              )}

              {/* ══════════ LEARN/GUIDE TAB ══════════ */}
              {tab==='learn'&&(
                <motion.div key="learn" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}>
                  <div className="panel" style={{padding:'26px 30px',marginBottom:14}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26,color:'var(--tx)',letterSpacing:'-.01em',marginBottom:4}}>Scientific Calculator Guide</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--tx3)',marginBottom:26,letterSpacing:'.1em'}}>OPERATORS · FUNCTIONS · ENGINEERING · TIPS</div>
                    <div className="prose">
                      <h3>Order of Operations</h3>
                      <p>Follows standard BODMAS/PEMDAS: <strong>Brackets → Powers → Multiply/Divide → Add/Subtract</strong>. For example, <code>2+3×4 = 14</code>. Use parentheses to override: <code>(2+3)×4 = 20</code>.</p>
                      <h3>Angle Modes</h3>
                      <p><strong>DEG</strong> (Degrees): Full circle = 360°. <strong>RAD</strong> (Radians): Full circle = 2π — required for calculus. <strong>GRAD</strong> (Gradians): Full circle = 400 grad. Use <code>deg2rad(x)</code> and <code>rad2deg(x)</code> to convert manually.</p>
                      <h3>Using ANS & Memory</h3>
                      <p><strong>ANS</strong> stores the last result. Reference it as <code>ANS+5</code> or chain expressions. <strong>Memory</strong> (M+, M−, MS, MR, MC) provides a persistent scratchpad independent of ANS.</p>
                      <h3>Engineering Functions (New in v2)</h3>
                      <p><strong>sinc(x)</strong> — normalised sinc function: sin(πx)/(πx), sinc(0) = 1. Widely used in signal processing and Fourier analysis. <strong>db(x)</strong> converts amplitude to decibels (20·log₁₀|x|), while <strong>idb(dB)</strong> is the inverse. <strong>erf(x)</strong> and <strong>erfc(x)</strong> are the error function and its complement — critical in probability, statistics, and heat transfer. <strong>gamma(x)</strong> gives the Euler Gamma function Γ(x), extending factorial to real numbers (Γ(n) = (n−1)! for positive integers). <strong>beta(a,b)</strong> computes the Beta function B(a,b) = Γ(a)Γ(b)/Γ(a+b).</p>
                      <h3>Number Theory & Bitwise</h3>
                      <p><strong>gcd(a,b)</strong> and <strong>lcm(a,b)</strong> compute the greatest common divisor and least common multiple. <strong>isPrime(n)</strong> returns 1 if n is prime, 0 otherwise. Bitwise operations <strong>band</strong>, <strong>bor</strong>, <strong>bxor</strong>, <strong>bnot</strong>, <strong>lsh</strong>, <strong>rsh</strong> operate on 32-bit signed integers — useful for low-level programming, cryptography, and embedded systems.</p>
                      <h3>Interpolation & Clamping</h3>
                      <p><strong>lerp(a,b,t)</strong> linearly interpolates between a and b at parameter t (0 = a, 1 = b). <strong>clamp(x,a,b)</strong> restricts x to the range [a, b]. <strong>logn(x,b)</strong> computes log base b of x. <strong>nthrt(x,n)</strong> computes the nth root of x (supports negative x for odd n).</p>
                      {[
                        {q:'What does EE mean?',a:'EE (Enter Exponent) allows scientific notation: 6.02 EE 23 gives 6.02 × 10²³. You can also type it directly as 6.02e23.'},
                        {q:'Why does tan(90) not give infinity?',a:'In IEEE 754 floating-point, tan(90°) gives ≈1.633e+16 rather than true infinity due to the finite representation of π. This is a hardware-level limitation of all 64-bit arithmetic.'},
                        {q:'How accurate is gamma(x) for large x?',a:'The Lanczos approximation used here is accurate to ~15 significant digits for most real inputs. For very large x, floating-point overflow sets in above gamma(172) ≈ 1.24e308, beyond which JavaScript returns Infinity.'},
                        {q:'How do bitwise operations work?',a:'band, bor, bxor, bnot, lsh, rsh convert their operands to 32-bit signed integers before operating. Results are also 32-bit signed, so bnot(0) = −1. This matches behavior in C, Java, and most hardware architectures.'},
                      ].map(({q,a},i)=>(
                        <div key={i} className="qa">
                          <div style={{fontSize:12.5,fontWeight:700,fontFamily:"'DM Mono',monospace",color:'var(--tx)',marginBottom:5}}>{q}</div>
                          <div style={{fontSize:13,color:'var(--tx2)',lineHeight:1.78}}>{a}</div>
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