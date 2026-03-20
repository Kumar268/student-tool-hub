import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ════════════════════════════════════════════════════════════════════
   STYLES
════════════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{overflow-x:hidden;font-family:'Inter',sans-serif}

@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes gridmove{from{background-position:0 0}to{background-position:30px 30px}}
@keyframes scan{0%{top:-4px}100%{top:102%}}
@keyframes flowR{0%{stroke-dashoffset:48}100%{stroke-dashoffset:0}}
@keyframes flowL{0%{stroke-dashoffset:0}100%{stroke-dashoffset:48}}
@keyframes rotate360{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes shimmer{0%{left:-100%}100%{left:200%}}
.fade-in{animation:fadeUp .22s ease both}
.electron{stroke-dasharray:7 11;animation:flowR 1s linear infinite}
.electron-rev{stroke-dasharray:7 11;animation:flowL 1s linear infinite}
.blink{animation:blink 1.4s ease-in-out infinite}

/* ═══ NEON ROOT ═══════════════════════════════════════ */
.ft{background:#03030d;color:#cdd6ff;min-height:100vh;position:relative;
  background-image:linear-gradient(rgba(255,178,0,.008) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,178,0,.008) 1px,transparent 1px);
  background-size:32px 32px;animation:gridmove 20s linear infinite}

.scanline{position:fixed;left:0;right:0;height:2px;pointer-events:none;z-index:9999;
  background:linear-gradient(90deg,transparent 0%,rgba(255,200,0,.08) 30%,rgba(255,200,0,.6) 50%,rgba(255,200,0,.08) 70%,transparent 100%);
  box-shadow:0 0 10px rgba(255,195,0,.4);animation:scan 8s linear infinite;top:-4px}

.ft-bar{height:32px;background:rgba(3,3,13,.98);border-bottom:1px solid rgba(255,178,0,.13);
  backdrop-filter:blur(14px);position:sticky;top:0;z-index:300;
  display:flex;align-items:center;padding:0 10px;gap:6px}

.ft-logo-icon{width:20px;height:20px;border:1px solid rgba(255,178,0,.5);border-radius:2px;
  display:flex;align-items:center;justify-content:center;color:#ffb200;
  box-shadow:0 0 10px rgba(255,178,0,.2),inset 0 0 6px rgba(255,178,0,.05)}
.ft-logo-text{font-size:11px;font-weight:900;letter-spacing:.06em;color:#cdd6ff}
.ft-logo-text span{color:#ffb200}
.ft-chip{padding:1px 5px;border:1px solid rgba(255,178,0,.2);border-radius:2px;
  font-size:7px;font-weight:700;letter-spacing:.14em;color:rgba(255,178,0,.52);text-transform:uppercase}
.ft-tgl{display:flex;align-items:center;gap:5px;padding:3px 8px;
  border:1px solid rgba(255,178,0,.15);border-radius:2px;background:rgba(255,178,0,.025);
  cursor:pointer;transition:all .14s;font-family:'Inter',sans-serif}
.ft-tgl:hover{border-color:rgba(255,178,0,.42);background:rgba(255,178,0,.065)}

/* tabs */
.ft-tabs{display:flex;border-bottom:1px solid rgba(255,178,0,.08);
  background:rgba(3,3,13,.96);overflow-x:auto;flex-shrink:0}
.ft-tab{padding:0 13px;height:36px;border:none;border-bottom:2px solid transparent;
  background:transparent;color:rgba(180,195,255,.38);cursor:pointer;
  font-family:'Inter',sans-serif;font-size:10px;font-weight:700;
  letter-spacing:.08em;text-transform:uppercase;transition:all .14s;
  display:flex;align-items:center;gap:4px;white-space:nowrap}
.ft-tab.on{color:#ffb200;border-bottom-color:#ffb200;background:rgba(255,178,0,.055)}
.ft-tab:hover:not(.on){color:#cdd6ff;background:rgba(255,255,255,.018)}

/* cards */
.ft-card{background:rgba(7,7,24,.98);border:1px solid rgba(255,178,0,.085);border-radius:4px;position:relative;overflow:hidden}
.ft-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(255,178,0,.28),transparent);pointer-events:none}

/* inputs */
.ft-inp{background:rgba(0,0,0,.6);border:1px solid rgba(255,178,0,.18);border-radius:3px;
  color:#eef2ff;font-family:'JetBrains Mono',monospace;font-size:13px;padding:7px 10px;
  outline:none;width:100%;transition:all .14s}
.ft-inp:focus{border-color:#ffb200;box-shadow:0 0 0 2px rgba(255,178,0,.1)}
.ft-inp::placeholder{color:rgba(255,178,0,.14)}

.ft-sel{background:rgba(0,0,0,.6);border:1px solid rgba(255,178,0,.18);border-radius:3px;
  color:#eef2ff;font-family:'Inter',sans-serif;font-size:11.5px;padding:6px 9px;
  outline:none;width:100%;cursor:pointer}
.ft-sel:focus{border-color:#ffb200}

/* buttons */
.ft-pbtn{display:inline-flex;align-items:center;gap:6px;padding:8px 20px;
  border:1px solid #ffb200;border-radius:3px;background:rgba(255,178,0,.1);color:#ffb200;
  cursor:pointer;font-family:'Inter',sans-serif;font-size:11px;font-weight:700;
  letter-spacing:.1em;text-transform:uppercase;transition:all .16s;
  box-shadow:0 0 14px rgba(255,178,0,.1)}
.ft-pbtn:hover{background:rgba(255,178,0,.18);box-shadow:0 0 24px rgba(255,178,0,.28);transform:translateY(-1px)}
.ft-sbtn{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;
  border:1px solid rgba(255,178,0,.16);border-radius:2px;background:rgba(255,178,0,.04);
  color:rgba(255,178,0,.62);cursor:pointer;font-family:'Inter',sans-serif;
  font-size:9px;font-weight:600;letter-spacing:.05em;transition:all .12s}
.ft-sbtn:hover,.ft-sbtn.on{border-color:#ffb200;color:#ffb200;background:rgba(255,178,0,.1)}
.ft-sbtn-red{border-color:rgba(255,60,60,.16);color:rgba(255,60,60,.55);background:rgba(255,60,60,.03)}
.ft-sbtn-red:hover{border-color:#ff4444;color:#ff4444;background:rgba(255,60,60,.09)}
.ft-sbtn-blue{border-color:rgba(0,200,255,.18);color:rgba(0,200,255,.6);background:rgba(0,200,255,.04)}
.ft-sbtn-blue:hover,.ft-sbtn-blue.on{border-color:#00c8ff;color:#00c8ff;background:rgba(0,200,255,.1)}

/* labels / hints */
.ft-lbl{font-size:8.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;
  color:rgba(255,178,0,.48);display:block;margin-bottom:4px}
.ft-hint{font-size:11px;color:rgba(255,178,0,.48);line-height:1.7;padding:8px 11px;
  border-radius:3px;background:rgba(255,178,0,.03);border-left:2px solid rgba(255,178,0,.26)}
.ft-step-n{width:21px;height:21px;border-radius:50%;border:1px solid rgba(255,178,0,.24);
  background:rgba(255,178,0,.065);display:flex;align-items:center;justify-content:center;
  font-size:9px;font-weight:700;color:#ffb200;flex-shrink:0}

/* metric cards */
.ft-metric{border:1px solid rgba(255,178,0,.12);border-radius:3px;padding:10px 13px;
  background:rgba(255,178,0,.035);position:relative;overflow:hidden}
.ft-metric::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;
  background:linear-gradient(90deg,transparent,rgba(255,178,0,.04),transparent);
  animation:shimmer 3s ease-in-out infinite}

/* ad slots */
.ft-ad{background:rgba(255,178,0,.015);border:1px dashed rgba(255,178,0,.08);border-radius:3px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;
  color:rgba(255,178,0,.16);font-size:8.5px;letter-spacing:.1em;text-transform:uppercase}

/* ═══ NORMAL ROOT ═════════════════════════════════════ */
.nm{background:#070c17;color:#e2e8f8;min-height:100vh}
.nm-bar{height:32px;background:#0d1322;border-bottom:1.5px solid #18253a;
  position:sticky;top:0;z-index:300;display:flex;align-items:center;padding:0 10px;gap:6px}
.nm-logo-icon{width:20px;height:20px;border-radius:5px;
  background:linear-gradient(135deg,#d97706,#b45309);
  display:flex;align-items:center;justify-content:center;color:#fff}
.nm-logo-text{font-size:11px;font-weight:900;color:#e2e8f8;letter-spacing:-.01em}
.nm-logo-text span{color:#f59e0b}
.nm-tgl{display:flex;align-items:center;gap:5px;padding:3px 9px;border-radius:7px;
  border:1.5px solid #18253a;background:#0d1322;cursor:pointer;transition:all .14s}
.nm-tgl:hover{border-color:#d97706}

.nm-tabs{display:flex;border-bottom:1.5px solid #18253a;background:#0d1322;overflow-x:auto}
.nm-tab{padding:0 13px;height:36px;border:none;border-bottom:2px solid transparent;
  background:transparent;color:#374868;cursor:pointer;
  font-family:'Inter',sans-serif;font-size:10px;font-weight:700;
  transition:all .14s;display:flex;align-items:center;gap:4px;white-space:nowrap;letter-spacing:.04em}
.nm-tab.on{color:#f59e0b;border-bottom-color:#d97706;background:rgba(217,119,6,.075);font-weight:800}
.nm-tab:hover:not(.on){color:#c7d2ee;background:rgba(255,255,255,.02)}

.nm-card{background:#0d1322;border:1.5px solid #18253a;border-radius:10px;overflow:hidden}
.nm-inp{background:#070c17;border:1.5px solid #1c2b40;border-radius:7px;color:#e2e8f8;
  font-family:'JetBrains Mono',monospace;font-size:13px;padding:7px 10px;outline:none;width:100%;transition:all .14s}
.nm-inp:focus{border-color:#d97706;box-shadow:0 0 0 3px rgba(217,119,6,.14)}
.nm-inp::placeholder{color:#1c2b40}
.nm-sel{background:#070c17;border:1.5px solid #1c2b40;border-radius:7px;color:#e2e8f8;
  font-family:'Inter',sans-serif;font-size:11.5px;padding:6px 10px;outline:none;cursor:pointer;width:100%}
.nm-sel:focus{border-color:#d97706}

.nm-pbtn{display:inline-flex;align-items:center;gap:6px;padding:8px 20px;border:none;border-radius:7px;
  background:linear-gradient(135deg,#d97706,#92400e);color:#fff;cursor:pointer;
  font-family:'Inter',sans-serif;font-size:11px;font-weight:700;
  box-shadow:0 4px 14px rgba(217,119,6,.35);transition:all .16s}
.nm-pbtn:hover{box-shadow:0 7px 22px rgba(217,119,6,.48);transform:translateY(-1px)}
.nm-sbtn{display:inline-flex;align-items:center;gap:3px;padding:3px 9px;border-radius:6px;
  border:1.5px solid #18253a;background:#070c17;color:#374868;cursor:pointer;
  font-family:'Inter',sans-serif;font-size:9px;font-weight:600;transition:all .12s}
.nm-sbtn:hover,.nm-sbtn.on{border-color:#d97706;color:#f59e0b;background:rgba(217,119,6,.085)}
.nm-sbtn-red{border-color:rgba(239,68,68,.2);color:rgba(239,68,68,.48);background:transparent}
.nm-sbtn-red:hover{border-color:#ef4444;color:#f87171;background:rgba(239,68,68,.065)}
.nm-sbtn-blue{border-color:rgba(56,189,248,.2);color:rgba(56,189,248,.55);background:transparent}
.nm-sbtn-blue:hover,.nm-sbtn-blue.on{border-color:#38bdf8;color:#38bdf8;background:rgba(56,189,248,.085)}

.nm-lbl{font-size:8.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
  color:#f59e0b;display:block;margin-bottom:4px}
.nm-hint{font-size:11px;color:#374868;line-height:1.7;padding:8px 11px;
  border-radius:7px;background:rgba(217,119,6,.045);border-left:2px solid rgba(217,119,6,.26)}
.nm-step-n{width:21px;height:21px;border-radius:50%;border:1.5px solid rgba(217,119,6,.3);
  background:rgba(217,119,6,.09);display:flex;align-items:center;justify-content:center;
  font-size:9px;font-weight:700;color:#f59e0b;flex-shrink:0}
.nm-metric{border:1.5px solid rgba(217,119,6,.16);border-radius:9px;padding:10px 13px;
  background:rgba(217,119,6,.045)}
.nm-ad{background:#0a1020;border:1.5px dashed #14203a;border-radius:8px;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;
  color:#18253a;font-size:8.5px;text-transform:uppercase;letter-spacing:.1em}

/* prose */
.prose h3{font-size:16px;font-weight:700;margin:20px 0 8px}
.prose p{line-height:1.76;margin-bottom:11px;font-size:13px}
.prose ul{padding-left:18px;margin-bottom:11px}
.prose li{line-height:1.7;font-size:13px;margin-bottom:3px}
.prose strong{font-weight:700}

/* oscilloscope */
.scope-grid line{stroke-dasharray:2 4}
`;

/* ════════════════════════════════════════════════════════════════════
   SVG ICONS
════════════════════════════════════════════════════════════════════ */
const Svg = ({ d, s = 14, sw = 1.8, fill = 'none' }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {(Array.isArray(d) ? d : [d]).map((p, i) => <path key={i} d={p} />)}
  </svg>
);
const I = {
  zap:    s => <Svg s={s} sw={1.5} d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  plus:   s => <Svg s={s} d={["M12 5v14", "M5 12h14"]} />,
  trash:  s => <Svg s={s} d={["M3 6h18", "M8 6V4h8v2", "M19 6l-1 14H6L5 6"]} />,
  info:   s => <Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z", "M12 16v-4M12 8h.01"]} />,
  book:   s => <Svg s={s} d={["M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20", "M12 7h4M12 11h4"]} />,
  wave:   s => <Svg s={s} d="M2 12C4 6 8 6 10 12C12 18 16 18 18 12C20 6 22 6 22 12" />,
  copy:   s => <Svg s={s} d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2", "M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"]} />,
  ok:     s => <Svg s={s} d="M20 6 9 17l-5-5" />,
  resist: s => <Svg s={s} d={["M2 12h3", "M19 12h3", "M5 12l2-3 2 6 2-6 2 6 2-6 2 3"]} />,
  cpu:    s => <Svg s={s} d={["M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"]} />,
  scope:  s => <Svg s={s} d={["M3 3h18v18H3z", "M8 15l3-6 3 4 2-2 2 2"]} />,
  pie:    s => <Svg s={s} d={["M21.21 15.89A10 10 0 1 1 8 2.83", "M22 12A10 10 0 0 0 12 2v10z"]} />,
  phasor: s => <Svg s={s} d={["M12 2v20", "M2 12h20", "M12 12l6-6"]} />,
  thevenin: s => <Svg s={s} d={["M2 12h4", "M18 12h4", "M6 9h3v6H6z", "M13 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"]} />,
  filter: s => <Svg s={s} d={["M3 6h18", "M6 12h12", "M9 18h6"]} />,
  calc:   s => <Svg s={s} d={["M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z", "M9 9h6", "M9 13h3", "M13 17h2"]} />,
};

/* ════════════════════════════════════════════════════════════════════
   MATH ENGINE
════════════════════════════════════════════════════════════════════ */
function computeAll(resistors, voltage, circuitType, capsMuF, indsMH, freqHz) {
  const validR = resistors.filter(r => r > 0);
  if (!validR.length || !voltage) return null;

  // ── Resistance ──────────────────────────────────────────
  let totalR = circuitType === 'series'
    ? validR.reduce((a, b) => a + b, 0)
    : 1 / validR.reduce((a, b) => a + 1 / b, 0);

  const I_dc = voltage / totalR;
  const P_total = voltage * I_dc;

  // Per-resistor
  const perR = resistors.map(r => {
    if (r <= 0) return null;
    const V = circuitType === 'series' ? I_dc * r : voltage;
    const I_ = circuitType === 'series' ? I_dc : voltage / r;
    const P = V * I_;
    return { r, V: +V.toFixed(4), I: +I_.toFixed(6), P: +P.toFixed(5) };
  });

  // ── AC Impedance ─────────────────────────────────────────
  const w = 2 * Math.PI * freqHz;
  const Xc = capsMuF.reduce((s, c) => s + (c > 0 ? 1 / (w * c * 1e-6) : 0), 0);
  const Xl = indsMH.reduce((s, l) => s + (l > 0 ? w * l * 1e-3 : 0), 0);
  const Xnet = Xl - Xc;
  const Z = Math.sqrt(totalR * totalR + Xnet * Xnet);
  const phi_deg = Math.atan2(Xnet, totalR) * 180 / Math.PI;
  const pf = Math.cos(phi_deg * Math.PI / 180);

  // Resonant frequency
  const totalC = capsMuF.reduce((s, c) => s + (c > 0 ? c * 1e-6 : 0), 0);
  const totalL = indsMH.reduce((s, l) => s + (l > 0 ? l * 1e-3 : 0), 0);
  let f_res = null;
  if (totalC > 0 && totalL > 0) {
    f_res = 1 / (2 * Math.PI * Math.sqrt(totalL * totalC));
  }

  // ── Voltage divider ──────────────────────────────────────
  let V_div = null;
  if (circuitType === 'series' && resistors.length >= 2 && resistors[0] > 0 && resistors[1] > 0) {
    V_div = voltage * resistors[1] / (resistors[0] + resistors[1]);
  }

  // ── Thévenin / Norton ────────────────────────────────────
  const V_th = voltage;
  const R_th = totalR;
  const I_norton = V_th / R_th;

  // ── Power breakdown ──────────────────────────────────────
  const powerPct = perR.filter(Boolean).map(r => ({
    label: `R=${r.r}Ω`, P: r.P,
    pct: (r.P / P_total) * 100,
  }));

  // ── RC time constant ─────────────────────────────────────
  let tau = null;
  if (totalC > 0) tau = totalR * totalC * 1e3; // ms

  // ── Quality factor ────────────────────────────────────────
  let Q = null;
  if (totalL > 0 && totalC > 0) Q = (1 / totalR) * Math.sqrt(totalL / totalC);

  // ── Bandwidth ─────────────────────────────────────────────
  let bw = null;
  if (Q && f_res) bw = f_res / Q;

  return {
    totalR, I_dc, P_total, perR,
    Xc, Xl, Xnet, Z, phi_deg, pf,
    f_res, V_div, V_th, R_th, I_norton,
    powerPct, tau, Q, bw, w,
    efficiency: pf * 100,
  };
}

/* ════════════════════════════════════════════════════════════════════
   ANIMATED CIRCUIT SVG
════════════════════════════════════════════════════════════════════ */
function CircuitSVG({ resistors, caps, inds, voltage, circuitType, neon, calc }) {
  const W = 600, H = 270;
  const a = neon ? '#ffb200' : '#f59e0b';
  const wireC = neon ? 'rgba(255,178,0,.52)' : 'rgba(245,158,11,.52)';
  const rC = neon ? '#00d4ff' : '#38bdf8';
  const cC = neon ? '#bf00ff' : '#a855f7';
  const lC = neon ? '#00ff88' : '#34d399';
  const bg = neon ? '#03030d' : '#070c17';
  const dimC = neon ? 'rgba(200,215,255,.5)' : '#64748b';
  const count = Math.min(resistors.length, 6);

  // Zigzag resistor symbol
  const Resistor = ({ x, y, w, h, label, val, vLabel }) => {
    const pts = [];
    const segs = 6;
    for (let k = 0; k <= segs; k++) {
      pts.push({ x: x + 4 + (k / segs) * (w - 8), y: y + (k % 2 === 0 ? -h / 2 + 3 : h / 2 - 3) });
    }
    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    return (
      <g>
        <rect x={x} y={y - h / 2} width={w} height={h}
          fill={neon ? 'rgba(0,200,255,.06)' : 'rgba(56,189,248,.06)'}
          stroke={rC} strokeWidth={1.4} rx={2} />
        <path d={d} stroke={rC} strokeWidth={1.4} fill="none" />
        <text x={x + w / 2} y={y - h / 2 - 5} textAnchor="middle" fill={rC} fontSize="9.5" fontFamily="JetBrains Mono" fontWeight="700">{label}</text>
        <text x={x + w / 2} y={y - h / 2 - 15} textAnchor="middle" fill={a} fontSize="9" fontFamily="JetBrains Mono">{val}Ω</text>
        {vLabel && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fill={dimC} fontSize="8.5" fontFamily="JetBrains Mono">{vLabel}</text>}
      </g>
    );
  };

  // Capacitor symbol
  const Capacitor = ({ x, y, label, val }) => (
    <g>
      <line x1={x} y1={y - 8} x2={x + 12} y2={y - 8} stroke={cC} strokeWidth={2} />
      <line x1={x} y1={y + 8} x2={x + 12} y2={y + 8} stroke={cC} strokeWidth={2} />
      <line x1={x + 6} y1={y - 18} x2={x + 6} y2={y - 8} stroke={cC} strokeWidth={1.5} />
      <line x1={x + 6} y1={y + 8} x2={x + 6} y2={y + 18} stroke={cC} strokeWidth={1.5} />
      <text x={x + 6} y={y - 22} textAnchor="middle" fill={cC} fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="700">{label}</text>
      <text x={x + 6} y={y + 28} textAnchor="middle" fill={dimC} fontSize="8" fontFamily="JetBrains Mono">{val}μF</text>
    </g>
  );

  // Inductor symbol (coil)
  const Inductor = ({ x, y, label, val }) => {
    const coilW = 32, cy = y;
    const path = `M${x},${cy} Q${x + 4},${cy - 8} ${x + 8},${cy} Q${x + 12},${cy - 8} ${x + 16},${cy} Q${x + 20},${cy - 8} ${x + 24},${cy} Q${x + 28},${cy - 8} ${x + 32},${cy}`;
    return (
      <g>
        <path d={path} fill="none" stroke={lC} strokeWidth={2} />
        <line x1={x} y1={cy} x2={x - 8} y2={cy} stroke={lC} strokeWidth={1.5} />
        <line x1={x + coilW} y1={cy} x2={x + coilW + 8} y2={cy} stroke={lC} strokeWidth={1.5} />
        <text x={x + coilW / 2} y={cy - 14} textAnchor="middle" fill={lC} fontSize="8.5" fontFamily="JetBrains Mono" fontWeight="700">{label}</text>
        <text x={x + coilW / 2} y={cy + 12} textAnchor="middle" fill={dimC} fontSize="8" fontFamily="JetBrains Mono">{val}mH</text>
      </g>
    );
  };

  // Battery symbol
  const Battery = ({ x, y, v }) => (
    <g>
      <line x1={x - 11} y1={y - 16} x2={x + 11} y2={y - 16} stroke={a} strokeWidth={2.8} />
      <line x1={x - 7} y1={y - 7} x2={x + 7} y2={y - 7} stroke={a} strokeWidth={1.8} />
      <line x1={x - 11} y1={y + 2} x2={x + 11} y2={y + 2} stroke={a} strokeWidth={2.8} />
      <line x1={x - 7} y1={y + 11} x2={x + 7} y2={y + 11} stroke={a} strokeWidth={1.8} />
      <text x={x + 16} y={y} fill={a} fontSize="10" fontWeight="700" fontFamily="JetBrains Mono">{v}V</text>
      <text x={x - 5} y={y - 20} fill={a} fontSize="9" fontFamily="JetBrains Mono">+</text>
      <text x={x - 4} y={y + 24} fill={a} fontSize="11" fontFamily="JetBrains Mono">−</text>
    </g>
  );

  // Ammeter
  const Ammeter = ({ x, y, val }) => (
    <g>
      <circle cx={x} cy={y} r={9} fill={neon ? 'rgba(255,178,0,.07)' : 'rgba(245,158,11,.07)'} stroke={a} strokeWidth={1.4} />
      <text x={x} y={y + 3.5} textAnchor="middle" fill={a} fontSize="9" fontWeight="700" fontFamily="JetBrains Mono">A</text>
      {val && <text x={x} y={y + 20} textAnchor="middle" fill={dimC} fontSize="7.5" fontFamily="JetBrains Mono">{val}</text>}
    </g>
  );

  // ── Series Layout ─────────────────────────────────────────
  if (circuitType === 'series') {
    const mL = 50, mR = 50, topY = 52, botY = 218;
    const usableW = W - mL - mR;
    const rW = 52, rH = 26;
    const hasCaps = caps.filter(c => c > 0).length > 0;
    const hasInds = inds.filter(l => l > 0).length > 0;

    // Place components: resistors first
    const compTotal = count;
    const gap = (usableW - rW * compTotal) / (compTotal + 1);
    const positions = Array.from({ length: count }, (_, i) => ({
      x: mL + gap * (i + 1) + rW * i, cx: mL + gap * (i + 1) + rW * i + rW / 2,
    }));

    const midY = (topY + botY) / 2;
    const batX = mL - 12;

    return (
      <svg width={W} height={H} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* top wire with electron animation */}
        {positions.length > 0 && (
          <>
            <line x1={mL} y1={topY} x2={positions[0].x} y2={topY} stroke={wireC} strokeWidth={2.2} className="electron" />
            {positions.map((p, i) => i < positions.length - 1 && (
              <line key={i} x1={p.x + rW} y1={topY} x2={positions[i + 1].x} y2={topY} stroke={wireC} strokeWidth={2.2} className="electron" />
            ))}
            <line x1={positions[positions.length - 1].x + rW} y1={topY} x2={W - mR} y2={topY} stroke={wireC} strokeWidth={2.2} className="electron" />
          </>
        )}
        {/* bottom wire */}
        <line x1={mL} y1={botY} x2={W - mR} y2={botY} stroke={wireC} strokeWidth={2.2} className="electron-rev" />
        {/* side wires */}
        <line x1={W - mR} y1={topY} x2={W - mR} y2={botY} stroke={wireC} strokeWidth={2.2} />
        {/* battery */}
        <line x1={batX} y1={topY} x2={batX} y2={midY - 18} stroke={wireC} strokeWidth={2.2} />
        <line x1={batX} y1={midY + 18} x2={batX} y2={botY} stroke={wireC} strokeWidth={2.2} />
        <Battery x={batX} y={midY} v={voltage} />
        <line x1={mL} y1={topY} x2={batX} y2={topY} stroke={wireC} strokeWidth={2.2} />
        <line x1={mL} y1={botY} x2={batX} y2={botY} stroke={wireC} strokeWidth={2.2} />

        {/* Resistors */}
        {positions.map((p, i) => (
          <Resistor key={i} x={p.x} y={topY} w={rW} h={rH}
            label={`R${i + 1}`} val={resistors[i]}
            vLabel={calc?.perR[i] ? `${calc.perR[i].V.toFixed(2)}V` : ''} />
        ))}

        {/* Ammeter on bottom wire */}
        {calc && <Ammeter x={W / 2} y={botY} val={`${calc.I_dc.toFixed(3)}A`} />}

        {/* Node dots at junctions */}
        {positions.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={topY} r={3} fill={a} />
            <circle cx={p.x + rW} cy={topY} r={3} fill={a} />
          </g>
        ))}

        {/* Current label */}
        {calc && (
          <text x={W / 2} y={H - 8} textAnchor="middle" fill={a} fontSize="10" fontFamily="JetBrains Mono" fontWeight="700">
            R_total = {calc.totalR.toFixed(2)}Ω  ·  I = {calc.I_dc.toFixed(4)}A  ·  P = {calc.P_total.toFixed(3)}W
          </text>
        )}

        {/* Voltage divider tap if 2 resistors */}
        {count >= 2 && calc?.V_div !== null && (
          <g>
            <line x1={positions[1].x} y1={topY} x2={positions[1].x} y2={topY + 42} stroke={cC} strokeWidth={1.5} strokeDasharray="3 3" />
            <text x={positions[1].x + 4} y={topY + 56} fill={cC} fontSize="8.5" fontFamily="JetBrains Mono">Vout={calc.V_div.toFixed(2)}V</text>
          </g>
        )}
      </svg>
    );
  }

  // ── Parallel Layout ───────────────────────────────────────
  const topY = 38, botY = 228;
  const leftX = 100, rightX = W - 90;
  const branchH = (botY - topY) / Math.max(count, 1);
  const midY = (topY + botY) / 2;
  const batX = 38;
  const rW = 70, rH = 24;
  const cx = (leftX + rightX) / 2;

  return (
    <svg width={W} height={H} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* bus lines */}
      <line x1={batX} y1={topY} x2={W - 30} y2={topY} stroke={wireC} strokeWidth={2.5} className="electron" />
      <line x1={batX} y1={botY} x2={W - 30} y2={botY} stroke={wireC} strokeWidth={2.5} className="electron-rev" />
      <line x1={W - 30} y1={topY} x2={W - 30} y2={botY} stroke={wireC} strokeWidth={2} />

      {/* battery */}
      <line x1={batX} y1={topY} x2={batX} y2={midY - 20} stroke={wireC} strokeWidth={2} />
      <line x1={batX} y1={midY + 20} x2={batX} y2={botY} stroke={wireC} strokeWidth={2} />
      <Battery x={batX} y={midY} v={voltage} />

      {/* vertical bus at leftX / rightX */}
      <line x1={leftX} y1={topY} x2={leftX} y2={botY} stroke={wireC} strokeWidth={1.8} />
      <line x1={rightX} y1={topY} x2={rightX} y2={botY} stroke={wireC} strokeWidth={1.8} />

      {/* branches */}
      {Array.from({ length: count }, (_, i) => {
        const by = topY + branchH * i + branchH / 2;
        return (
          <g key={i}>
            <line x1={leftX} y1={by} x2={cx - rW / 2} y2={by} stroke={wireC} strokeWidth={1.8} className="electron" />
            <line x1={cx + rW / 2} y1={by} x2={rightX} y2={by} stroke={wireC} strokeWidth={1.8} />
            <Resistor x={cx - rW / 2} y={by} w={rW} h={rH}
              label={`R${i + 1}`} val={resistors[i]}
              vLabel={calc?.perR[i] ? `${calc.perR[i].I.toFixed(4)}A` : ''} />
            <circle cx={leftX} cy={by} r={2.5} fill={a} />
            <circle cx={rightX} cy={by} r={2.5} fill={a} />
          </g>
        );
      })}

      {/* ammeter */}
      {calc && <Ammeter x={(batX + leftX) / 2} y={topY} val={`${calc.I_dc.toFixed(3)}A`} />}

      {calc && (
        <text x={W / 2} y={H - 6} textAnchor="middle" fill={a} fontSize="9.5" fontFamily="JetBrains Mono" fontWeight="700">
          R_total = {calc.totalR.toFixed(2)}Ω  ·  I = {calc.I_dc.toFixed(4)}A  ·  P = {calc.P_total.toFixed(3)}W
        </text>
      )}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   OSCILLOSCOPE CANVAS
════════════════════════════════════════════════════════════════════ */
function Oscilloscope({ voltage, current, power, freq, neon }) {
  const ref = useRef();
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height;
    const p = { l: 44, r: 12, t: 24, b: 30 };
    const pw = W - p.l - p.r, ph = H - p.t - p.b;
    const N = 500;

    ctx.fillStyle = neon ? '#01010a' : '#040810';
    ctx.fillRect(0, 0, W, H);

    // scanlines effect
    for (let y = 0; y < H; y += 3) {
      ctx.fillStyle = neon ? 'rgba(0,0,0,.18)' : 'rgba(0,0,0,.12)';
      ctx.fillRect(0, y, W, 1);
    }

    // grid
    ctx.strokeStyle = neon ? 'rgba(255,178,0,.07)' : 'rgba(245,158,11,.07)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 10; i++) {
      const x = p.l + pw * i / 10;
      ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.moveTo(x, p.t); ctx.lineTo(x, H - p.b); ctx.stroke();
    }
    for (let i = 1; i < 8; i++) {
      const y = p.t + ph * i / 8;
      ctx.beginPath(); ctx.moveTo(p.l, y); ctx.lineTo(W - p.r, y); ctx.stroke();
    }
    ctx.setLineDash([]);

    // axis
    const y0 = p.t + ph / 2;
    ctx.strokeStyle = neon ? 'rgba(255,178,0,.2)' : 'rgba(245,158,11,.24)';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(p.l, y0); ctx.lineTo(W - p.r, y0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(p.l, p.t); ctx.lineTo(p.l, H - p.b); ctx.stroke();

    const amp = ph * 0.42;
    const cycles = 2.5;

    function wave(fn, color, glowColor, tag, tagY) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      if (neon) { ctx.shadowColor = glowColor; ctx.shadowBlur = 6; }
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const t = (i / N) * cycles;
        const x = p.l + (i / N) * pw;
        const y = y0 - fn(t) * amp;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // filled area under curve
      ctx.fillStyle = glowColor.replace('rgb', 'rgba').replace(')', ', .06)').replace('rgba(', 'rgba(');
      ctx.globalAlpha = 0.08;
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const t = (i / N) * cycles;
        const x = p.l + (i / N) * pw;
        const y = y0 - fn(t) * amp;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.lineTo(p.l + pw, y0); ctx.lineTo(p.l, y0); ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;

      // label
      ctx.fillStyle = color;
      ctx.font = '800 8.5px JetBrains Mono,monospace';
      ctx.fillText(tag, p.l + 5, tagY);
    }

    const scale = Math.max(Math.abs(voltage), Math.abs(current) * 10, Math.abs(power) * 0.5, 1);
    wave(t => Math.sin(2 * Math.PI * t) * voltage / scale,
      neon ? '#ffb200' : '#f59e0b', 'rgb(255,178,0)', `V  ${voltage.toFixed(1)}V`, p.t + 11);
    wave(t => Math.sin(2 * Math.PI * t) * current * 10 / scale,
      neon ? '#00d4ff' : '#38bdf8', 'rgb(0,212,255)', `I  ${current.toFixed(4)}A`, p.t + 21);
    wave(t => (1 - Math.cos(4 * Math.PI * t)) / 2 * power / scale,
      neon ? '#ff6b6b' : '#f87171', 'rgb(255,107,107)', `P  ${power.toFixed(3)}W`, p.t + 31);

    // axis labels
    ctx.fillStyle = neon ? 'rgba(200,215,255,.4)' : 'rgba(100,116,139,.55)';
    ctx.font = '7.5px JetBrains Mono,monospace';
    ctx.textAlign = 'center';
    ['0', 'T/2', 'T', '3T/2', '2T'].forEach((l, i) => {
      ctx.fillText(l, p.l + pw * (i / 4), H - p.b + 10);
    });

    // scope border glow
    if (neon) {
      ctx.strokeStyle = 'rgba(255,178,0,.18)';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, W, H);
    }
  }, [voltage, current, power, freq, neon]);

  return (
    <canvas ref={ref} width={580} height={190}
      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: neon ? 2 : 8 }} />
  );
}

/* ════════════════════════════════════════════════════════════════════
   POWER PIE CHART CANVAS
════════════════════════════════════════════════════════════════════ */
function PowerPie({ powerPct, neon }) {
  const ref = useRef();
  const COLORS_N = ['#ffb200', '#00d4ff', '#ff6b6b', '#bf00ff', '#00ff88', '#ff8c00', '#00ccff', '#ff3366'];
  const COLORS_M = ['#f59e0b', '#38bdf8', '#f87171', '#a855f7', '#34d399', '#fb923c', '#22d3ee', '#e879f9'];
  const colors = neon ? COLORS_N : COLORS_M;

  useEffect(() => {
    const cv = ref.current; if (!cv || !powerPct.length) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);

    const total = powerPct.reduce((s, p) => s + p.P, 0);
    if (total <= 0) return;

    const cx = 80, cy = H / 2, r = 65;
    let angle = -Math.PI / 2;

    powerPct.forEach((item, i) => {
      const slice = (item.P / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, angle, angle + slice);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = 0.85;
      ctx.fill();

      if (neon) {
        ctx.strokeStyle = 'rgba(3,3,13,.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        // glow
        ctx.shadowColor = colors[i % colors.length];
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = 'rgba(7,12,23,.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // label line
      const midA = angle + slice / 2;
      if (slice > 0.2) {
        const lx = cx + (r + 14) * Math.cos(midA);
        const ly = cy + (r + 14) * Math.sin(midA);
        ctx.fillStyle = colors[i % colors.length];
        ctx.font = '800 8px JetBrains Mono,monospace';
        ctx.textAlign = lx > cx ? 'left' : 'right';
        ctx.fillText(`${item.pct.toFixed(0)}%`, lx, ly + 3);
      }
      angle += slice;
    });

    // center hole
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.5, 0, 2 * Math.PI);
    ctx.fillStyle = neon ? '#03030d' : '#070c17';
    ctx.fill();
    ctx.fillStyle = neon ? '#ffb200' : '#f59e0b';
    ctx.font = '700 8.5px JetBrains Mono,monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${total.toFixed(2)}W`, cx, cy + 3);

    // legend
    const lx = 165;
    powerPct.forEach((item, i) => {
      const ly = 22 + i * 20;
      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(lx, ly - 7, 10, 10);
      ctx.fillStyle = neon ? 'rgba(200,215,255,.7)' : '#64748b';
      ctx.font = '9px JetBrains Mono,monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${item.label}  ${item.P.toFixed(3)}W`, lx + 14, ly + 2);
    });
  }, [powerPct, neon, colors]);

  const h = Math.max(160, powerPct.length * 20 + 30);
  return (
    <canvas ref={ref} width={320} height={h}
      style={{ width: '100%', maxWidth: 320, height: 'auto', display: 'block' }} />
  );
}

/* ════════════════════════════════════════════════════════════════════
   PHASOR DIAGRAM CANVAS
════════════════════════════════════════════════════════════════════ */
function PhasorDiagram({ R, Xl, Xc, Z, phi_deg, neon }) {
  const ref = useRef();
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = neon ? '#03030d' : '#070c17';
    ctx.fillRect(0, 0, W, H);

    const ox = W / 2, oy = H / 2;
    const maxZ = Math.max(Z, R, Math.abs(Xl - Xc), 1);
    const scale = Math.min(W, H) * 0.38 / maxZ;

    // grid circles
    for (let i = 1; i <= 3; i++) {
      ctx.strokeStyle = neon ? 'rgba(255,178,0,.06)' : 'rgba(245,158,11,.07)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.arc(ox, oy, scale * maxZ * i / 3, 0, 2 * Math.PI); ctx.stroke();
    }
    ctx.setLineDash([]);

    // axes
    ctx.strokeStyle = neon ? 'rgba(255,178,0,.22)' : 'rgba(245,158,11,.28)';
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();

    // axis labels
    ctx.fillStyle = neon ? 'rgba(200,215,255,.4)' : '#64748b';
    ctx.font = '8px JetBrains Mono,monospace';
    ctx.textAlign = 'center';
    ctx.fillText('+jX', ox, 12);
    ctx.fillText('−jX', ox, H - 4);
    ctx.textAlign = 'left';
    ctx.fillText('+R', W - 22, oy - 4);

    function arrow(x1, y1, x2, y2, color, label, glow) {
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < 2) return;
      const ax = dx / len, ay = dy / len;
      const hw = 7;

      ctx.strokeStyle = color; ctx.lineWidth = 2;
      if (neon && glow) { ctx.shadowColor = glow; ctx.shadowBlur = 8; }
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - ax * hw, y2 - ay * hw); ctx.stroke();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - ax * hw - ay * hw * 0.5, y2 - ay * hw + ax * hw * 0.5);
      ctx.lineTo(x2 - ax * hw + ay * hw * 0.5, y2 - ay * hw - ax * hw * 0.5);
      ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;

      if (label) {
        ctx.font = '700 9px JetBrains Mono,monospace';
        ctx.fillStyle = color;
        ctx.textAlign = 'left';
        const lx = (x1 + x2) / 2 + (dy < 0 ? -36 : 4);
        const ly = (y1 + y2) / 2 + (dx > 0 ? -6 : 6);
        ctx.fillText(label, lx, ly);
      }
    }

    // R (horizontal)
    const Rx = ox + R * scale;
    arrow(ox, oy, Rx, oy, neon ? '#ffb200' : '#f59e0b', `R=${R.toFixed(1)}Ω`, neon ? '#ffb200' : null);

    // Xl (up)
    const Xly = oy - Xl * scale;
    if (Xl > 0.5) arrow(Rx, oy, Rx, Xly, neon ? '#00ff88' : '#34d399', `Xl=${Xl.toFixed(1)}Ω`, neon ? '#00ff88' : null);

    // Xc (down)
    const Xcy = oy + Xc * scale;
    if (Xc > 0.5) arrow(Rx, oy, Rx, Xcy, neon ? '#bf00ff' : '#a855f7', `Xc=${Xc.toFixed(1)}Ω`, neon ? '#bf00ff' : null);

    // Net reactance
    const Xnet = Xl - Xc;
    const Xny = oy - Xnet * scale;
    if (Math.abs(Xnet) > 0.5) {
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = neon ? 'rgba(200,215,255,.2)' : 'rgba(100,116,139,.3)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(Rx, oy); ctx.lineTo(Rx, Xny); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Z vector
    const Zx = ox + Z * Math.cos(phi_deg * Math.PI / 180) * scale;
    const Zy = oy - Z * Math.sin(phi_deg * Math.PI / 180) * scale;
    arrow(ox, oy, Zx, Zy, neon ? '#00d4ff' : '#38bdf8', `Z=${Z.toFixed(1)}Ω`, neon ? '#00d4ff' : null);

    // angle arc
    if (Math.abs(phi_deg) > 1) {
      ctx.strokeStyle = neon ? 'rgba(0,212,255,.35)' : 'rgba(56,189,248,.4)';
      ctx.lineWidth = 1.2; ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(ox, oy, 30, -phi_deg * Math.PI / 180, 0, phi_deg > 0);
      ctx.stroke();
      ctx.fillStyle = neon ? '#00d4ff' : '#38bdf8';
      ctx.font = '8px JetBrains Mono,monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`φ=${phi_deg.toFixed(1)}°`, ox + 34, oy - (phi_deg > 0 ? 8 : -14));
    }
  }, [R, Xl, Xc, Z, phi_deg, neon]);

  return (
    <canvas ref={ref} width={280} height={220}
      style={{ width: '100%', maxWidth: 280, height: 'auto', display: 'block', borderRadius: neon ? 2 : 7 }} />
  );
}

/* ════════════════════════════════════════════════════════════════════
   KATEX
════════════════════════════════════════════════════════════════════ */
function useKatex() {
  const [ok, setOk] = useState(!!window.katex);
  useEffect(() => {
    if (window.katex) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(l);
    const sc = document.createElement('script');
    sc.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js';
    sc.onload = () => setOk(true); document.head.appendChild(sc);
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
  return <code style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: display ? 14 : 11, color: neon ? '#ffb200' : '#f59e0b' }}>{latex}</code>;
}

/* ════════════════════════════════════════════════════════════════════
   COPY BUTTON
════════════════════════════════════════════════════════════════════ */
function CopyBtn({ text, neon }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setOk(true); setTimeout(() => setOk(false), 1500); }}
      className={neon ? 'ft-sbtn' : 'nm-sbtn'} style={{ padding: '3px 8px', gap: 3 }}>
      {ok ? I.ok(9) : I.copy(9)}{ok ? 'Copied' : 'Copy'}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════════════
   METRIC CARD
════════════════════════════════════════════════════════════════════ */
function Metric({ label, value, unit, sub, color, neon }) {
  return (
    <div className={neon ? 'ft-metric' : 'nm-metric'}>
      <div style={{ fontSize: 8, fontWeight: 700, color: neon ? 'rgba(255,178,0,.42)' : '#374868', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 5 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: color || (neon ? '#ffb200' : '#f59e0b'), fontFamily: 'JetBrains Mono,monospace', lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: neon ? 'rgba(255,178,0,.45)' : '#64748b' }}>{unit}</span>
      </div>
      {sub && <div style={{ fontSize: 9, color: neon ? 'rgba(200,215,255,.3)' : '#374868', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   STEPS
════════════════════════════════════════════════════════════════════ */
function Steps({ steps, neon, katex }) {
  return (
    <div>{steps.map((s, i) => (
      <div key={i} style={{ display: 'flex', gap: 10, marginBottom: s.last ? 0 : 15 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <div className={neon ? 'ft-step-n' : 'nm-step-n'}>{i + 1}</div>
          {!s.last && <div style={{ flex: 1, width: 1, marginTop: 4, minHeight: 10, background: neon ? 'rgba(255,178,0,.07)' : 'rgba(217,119,6,.12)' }} />}
        </div>
        <div style={{ flex: 1, paddingBottom: s.last ? 0 : 4 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: neon ? '#cdd6ff' : '#e2e8f8', marginBottom: 2 }}>{s.t}</div>
          {s.d && <div style={{ fontSize: 10.5, color: neon ? 'rgba(255,178,0,.4)' : '#374868', marginBottom: 5, lineHeight: 1.6 }}>{s.d}</div>}
          <div style={{ padding: '6px 10px', border: neon ? '1px solid rgba(255,178,0,.08)' : '1.5px solid #18253a', borderRadius: neon ? 2 : 6, background: neon ? 'rgba(0,0,0,.35)' : 'rgba(7,12,23,.7)', overflowX: 'auto' }}>
            {katex ? <KTeX latex={s.l} neon={neon} /> : <code style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10.5, color: neon ? '#ffb200' : '#f59e0b' }}>{s.l}</code>}
          </div>
        </div>
      </div>
    ))}</div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PRESETS
════════════════════════════════════════════════════════════════════ */
const PRESETS = [
  { label: 'LED (5V series)',        r: [220, 180],        c: [],   l: [],  v: 5,   t: 'series',   f: 60  },
  { label: 'Arduino GPIO 3.3V',      r: [220, 470],        c: [],   l: [],  v: 3.3, t: 'series',   f: 60  },
  { label: 'House outlets 120V',     r: [100, 100, 100],   c: [],   l: [],  v: 120, t: 'parallel', f: 60  },
  { label: 'Voltage divider 12V',    r: [10, 10],          c: [],   l: [],  v: 12,  t: 'series',   f: 60  },
  { label: 'RC low-pass filter',     r: [1000],            c: [10], l: [],  v: 5,   t: 'series',   f: 1000},
  { label: 'RL high-pass filter',    r: [100],             c: [],   l: [10],v: 12,  t: 'series',   f: 500 },
  { label: 'RLC resonant circuit',   r: [50],              c: [100],l: [25],v: 24,  t: 'series',   f: 1007},
  { label: 'Motor driver 24V',       r: [33, 33, 33],      c: [],   l: [],  v: 24,  t: 'parallel', f: 60  },
  { label: 'Ohm\'s law demo',        r: [100],             c: [],   l: [],  v: 10,  t: 'series',   f: 60  },
  { label: '9V battery circuit',     r: [47, 100],         c: [],   l: [],  v: 9,   t: 'series',   f: 60  },
];

/* ════════════════════════════════════════════════════════════════════
   MAIN
════════════════════════════════════════════════════════════════════ */
export default function CircuitDesigner() {
  const [mode, setMode] = useState('futuristic');
  const [resistors, setResistors] = useState([220, 180]);
  const [caps, setCaps] = useState([]);
  const [inds, setInds] = useState([]);
  const [voltage, setVoltage] = useState(5);
  const [circuitType, setCircuitType] = useState('series');
  const [freq, setFreq] = useState(60);
  const [activeTab, setActiveTab] = useState('designer');
  const [showAC, setShowAC] = useState(false);
  const neon = mode === 'futuristic';
  const katex = useKatex();

  const calc = useMemo(() => computeAll(resistors, voltage, circuitType, caps, inds, freq),
    [resistors, voltage, circuitType, caps, inds, freq]);

  const steps = useMemo(() => {
    if (!calc) return [];
    const vR = resistors.filter(r => r > 0);
    return [
      {
        t: circuitType === 'series' ? 'Total resistance — series sum' : 'Total resistance — parallel reciprocal',
        d: circuitType === 'series'
          ? `Add all resistors: ${vR.join(' + ')} = ${calc.totalR.toFixed(3)} Ω`
          : `1/(${vR.map(r => `1/${r}`).join('+')}) = ${calc.totalR.toFixed(3)} Ω`,
        l: circuitType === 'series'
          ? `R_{total}=${vR.join('+')}=${calc.totalR.toFixed(2)}\\,\\Omega`
          : `\\frac{1}{R_p}=${vR.map(r => `\\frac{1}{${r}}`).join('+')}\\Rightarrow R_p=${calc.totalR.toFixed(2)}\\,\\Omega`,
      },
      {
        t: "Ohm's Law — current",
        d: `I = V / R = ${voltage} / ${calc.totalR.toFixed(3)} = ${calc.I_dc.toFixed(6)} A`,
        l: `I=\\frac{V}{R}=\\frac{${voltage}}{${calc.totalR.toFixed(2)}}=${calc.I_dc.toFixed(4)}\\text{ A}`,
      },
      {
        t: 'Power dissipation',
        d: `P = V×I = ${voltage} × ${calc.I_dc.toFixed(4)} = ${calc.P_total.toFixed(4)} W`,
        l: `P=V\\cdot I=${voltage}\\times ${calc.I_dc.toFixed(4)}=${calc.P_total.toFixed(3)}\\text{ W}`,
      },
      ...(calc.V_div !== null ? [{
        t: 'Voltage divider output',
        d: `Vout = ${voltage} × ${resistors[1]} / (${resistors[0]}+${resistors[1]}) = ${calc.V_div.toFixed(4)} V`,
        l: `V_{out}=V_{in}\\cdot\\frac{R_2}{R_1+R_2}=${voltage}\\cdot\\frac{${resistors[1]}}{${resistors[0]}+${resistors[1]}}=${calc.V_div.toFixed(3)}\\text{ V}`,
      }] : []),
      ...(showAC && (caps.filter(c => c > 0).length || inds.filter(l => l > 0).length) ? [{
        t: 'AC impedance Z',
        d: `Xc=${calc.Xc.toFixed(2)}Ω  Xl=${calc.Xl.toFixed(2)}Ω  Z=√(R²+(Xl−Xc)²)=${calc.Z.toFixed(3)}Ω  φ=${calc.phi_deg.toFixed(1)}°`,
        l: `Z=\\sqrt{R^2+(X_L-X_C)^2}=\\sqrt{${calc.totalR.toFixed(1)}^2+${calc.Xnet.toFixed(1)}^2}=${calc.Z.toFixed(2)}\\,\\Omega`,
      }] : []),
      {
        t: 'Per-resistor breakdown',
        d: circuitType === 'series'
          ? `Same I=${calc.I_dc.toFixed(4)}A, voltages: ${calc.perR.filter(Boolean).map((r, i) => `V${i + 1}=${r.V.toFixed(2)}V`).join(', ')}`
          : `Same V=${voltage}V, currents: ${calc.perR.filter(Boolean).map((r, i) => `I${i + 1}=${r.I.toFixed(4)}A`).join(', ')}`,
        l: circuitType === 'series'
          ? `V_k=I\\cdot R_k\\Rightarrow ${calc.perR.filter(Boolean).map((r, i) => `V_{${i + 1}}=${r.V.toFixed(2)}`).join(',\\;')}\\text{ V}`
          : `I_k=\\frac{V}{R_k}\\Rightarrow ${calc.perR.filter(Boolean).map((r, i) => `I_{${i + 1}}=${r.I.toFixed(4)}`).join(',\\;')}\\text{ A}`,
        last: true,
      },
    ];
  }, [calc, resistors, voltage, circuitType, caps, inds, freq, showAC]);

  const loadPreset = p => {
    setResistors([...p.r]);
    setCaps(p.c ? [...p.c] : []);
    setInds(p.l ? [...p.l] : []);
    setVoltage(p.v); setCircuitType(p.t); setFreq(p.f);
    setShowAC((p.c && p.c.length > 0) || (p.l && p.l.length > 0));
    setActiveTab('designer');
  };

  const TABS = [
    { id: 'designer', label: 'Designer',   ico: 'zap' },
    { id: 'guide',    label: 'How to Use', ico: 'info' },
    { id: 'article',  label: 'Learn',      ico: 'book' },
  ];
  const s = neon;

  return (
    <>
      <style>{STYLES}</style>
      <AnimatePresence mode="wait">
        {neon ? (
          <motion.div key="n" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>
            <div className="ft">
              <div className="scanline" />
              <AppShell {...{ neon: true, resistors, caps, inds, voltage, circuitType, freq,
                activeTab, setActiveTab, setResistors, setCaps, setInds, setVoltage,
                setCircuitType, setFreq, showAC, setShowAC, calc, steps, katex,
                onSwitch: () => setMode('normal'), TABS, loadPreset }} />
            </div>
          </motion.div>
        ) : (
          <motion.div key="m" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>
            <div className="nm">
              <AppShell {...{ neon: false, resistors, caps, inds, voltage, circuitType, freq,
                activeTab, setActiveTab, setResistors, setCaps, setInds, setVoltage,
                setCircuitType, setFreq, showAC, setShowAC, calc, steps, katex,
                onSwitch: () => setMode('futuristic'), TABS, loadPreset }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
   APP SHELL
════════════════════════════════════════════════════════════════════ */
function AppShell({ neon, resistors, caps, inds, voltage, circuitType, freq,
  activeTab, setActiveTab, setResistors, setCaps, setInds, setVoltage,
  setCircuitType, setFreq, showAC, setShowAC, calc, steps, katex, onSwitch, TABS, loadPreset }) {
  const s = neon;

  const addRow = (arr, set) => { if (arr.length < 8) set([...arr, arr.length ? arr[arr.length - 1] : 100]); };
  const removeRow = (arr, set, i) => { if (arr.length > 1) set(arr.filter((_, idx) => idx !== i)); };
  const updateRow = (arr, set, i, v) => { const n = [...arr]; n[i] = parseFloat(v) || 0; set(n); };

  // Neon toggle visual
  const Toggle = () => s ? (
    <button className="ft-tgl" onClick={onSwitch} style={{ gap: 5 }}>
      <div style={{ width: 26, height: 14, borderRadius: 7, background: '#ffb200', position: 'relative', boxShadow: '0 0 7px rgba(255,178,0,.5)' }}>
        <div style={{ position: 'absolute', top: 2, right: 2, width: 10, height: 10, borderRadius: '50%', background: '#03030d' }} />
      </div>
      <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,178,0,.55)', letterSpacing: '.08em' }}>NEON</span>
    </button>
  ) : (
    <button className="nm-tgl" onClick={onSwitch} style={{ gap: 5 }}>
      <span style={{ fontSize: 10, color: '#374868', fontWeight: 600 }}>Normal</span>
      <div style={{ width: 26, height: 14, borderRadius: 7, background: '#18253a', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 2, left: 2, width: 10, height: 10, borderRadius: '50%', background: '#374868' }} />
      </div>
    </button>
  );

  return (
    <div>
      {/* ── TOPBAR ── */}
      <div className={s ? 'ft-bar' : 'nm-bar'}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div className={s ? 'ft-logo-icon' : 'nm-logo-icon'}>{I.zap(12)}</div>
          <span className={s ? 'ft-logo-text' : 'nm-logo-text'}>Circuit<span>Lab</span></span>
          {s && <span className="ft-chip">Free · AC/DC</span>}
        </div>
        <div style={{ flex: 1 }} />
        {calc && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8, fontWeight: 700, color: s ? '#ffb200' : '#f59e0b', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', animation: 'pulse 1.4s ease-in-out infinite' }} />
            {circuitType} · {calc.totalR.toFixed(1)}Ω · {calc.I_dc.toFixed(3)}A
          </div>
        )}
        <Toggle />
      </div>

      {/* ── TABS ── */}
      <div className={s ? 'ft-tabs' : 'nm-tabs'}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={s ? `ft-tab ${activeTab === t.id ? 'on' : ''}` : `nm-tab ${activeTab === t.id ? 'on' : ''}`}>
            {I[t.ico]?.(10)} {t.label}
          </button>
        ))}
      </div>

      {/* ── BODY ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 268px', minHeight: 'calc(100vh - 68px)' }}>

        {/* LEFT MAIN */}
        <div style={{ padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence mode="wait">

            {activeTab === 'designer' && (
              <motion.div key="des" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* hint */}
                <div className={s ? 'ft-hint' : 'nm-hint'} style={{ display: 'flex', gap: 7 }}>
                  {I.info(12)}
                  <span>Pick Series or Parallel, add resistors, set voltage. Enable AC mode for capacitors, inductors, impedance and phasor diagram. All visuals update live.</span>
                </div>

                {/* Type toggle + AC toggle */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[['series', I.resist, 'R_total = ΣR'], ['parallel', I.cpu, '1/R = Σ1/Rₙ']].map(([id, Ico, tip]) => (
                    <button key={id} onClick={() => setCircuitType(id)} title={tip}
                      className={`${s ? 'ft-sbtn' : 'nm-sbtn'} ${circuitType === id ? 'on' : ''}`}
                      style={{ flex: 1, padding: '7px 10px', fontSize: 10.5, fontWeight: 700, gap: 5, justifyContent: 'center' }}>
                      {Ico(12)} {id.charAt(0).toUpperCase() + id.slice(1)}
                    </button>
                  ))}
                  <button onClick={() => setShowAC(p => !p)}
                    className={`${s ? 'ft-sbtn ft-sbtn-blue' : 'nm-sbtn nm-sbtn-blue'} ${showAC ? 'on' : ''}`}
                    style={{ padding: '7px 12px', fontSize: 10.5, fontWeight: 700, gap: 4 }}>
                    {I.wave(12)} AC Mode {showAC ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Inputs card */}
                <div className={s ? 'ft-card' : 'nm-card'} style={{ padding: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: showAC ? '1fr 1fr 1fr' : '1fr 1fr', gap: 14 }}>

                    {/* Resistors */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                        <label className={s ? 'ft-lbl' : 'nm-lbl'} style={{ marginBottom: 0 }}>Resistors (Ω)</label>
                        <button onClick={() => addRow(resistors, setResistors)} className={s ? 'ft-sbtn' : 'nm-sbtn'}
                          style={{ padding: '2px 7px', gap: 2 }} disabled={resistors.length >= 8}>
                          {I.plus(9)} Add
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <AnimatePresence>
                          {resistors.map((r, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                              style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                              <span style={{ fontSize: 9, fontWeight: 700, color: s ? 'rgba(255,178,0,.38)' : '#374868', width: 18, fontFamily: 'JetBrains Mono,monospace', flexShrink: 0 }}>R{i + 1}</span>
                              <input type="number" value={r} min="0" step="1"
                                onChange={e => updateRow(resistors, setResistors, i, e.target.value)}
                                className={s ? 'ft-inp' : 'nm-inp'} style={{ flex: 1, height: 30, fontSize: 12 }} />
                              <button onClick={() => removeRow(resistors, setResistors, i)}
                                className={s ? 'ft-sbtn ft-sbtn-red' : 'nm-sbtn nm-sbtn-red'}
                                style={{ padding: '4px 6px' }} disabled={resistors.length <= 1}>
                                {I.trash(9)}
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Voltage + Frequency */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                      <div>
                        <label className={s ? 'ft-lbl' : 'nm-lbl'}>Source Voltage (V)</label>
                        <input type="number" value={voltage} min="0" step="0.1"
                          onChange={e => setVoltage(parseFloat(e.target.value) || 0)}
                          className={s ? 'ft-inp' : 'nm-inp'} style={{ height: 36, fontSize: 16, fontWeight: 700 }} />
                      </div>
                      {showAC && (
                        <div>
                          <label className={s ? 'ft-lbl' : 'nm-lbl'}>Frequency (Hz)</label>
                          <input type="number" value={freq} min="1" step="1"
                            onChange={e => setFreq(parseFloat(e.target.value) || 60)}
                            className={s ? 'ft-inp' : 'nm-inp'} style={{ height: 30, fontSize: 13 }} />
                        </div>
                      )}
                      {/* Quick metrics */}
                      {calc && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <Metric label="Total R" value={calc.totalR.toFixed(2)} unit="Ω" color={s ? '#ffb200' : '#f59e0b'} neon={s} />
                          <Metric label="Current" value={calc.I_dc.toFixed(4)} unit="A" color={s ? '#00d4ff' : '#38bdf8'} neon={s} />
                          <Metric label="Power" value={calc.P_total.toFixed(3)} unit="W" color={s ? '#ff6b6b' : '#f87171'} neon={s} />
                        </div>
                      )}
                    </div>

                    {/* AC Components */}
                    {showAC && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                          <label className={s ? 'ft-lbl' : 'nm-lbl'} style={{ marginBottom: 0, color: s ? 'rgba(191,0,255,.6)' : '#a855f7' }}>Capacitors (μF)</label>
                          <button onClick={() => addRow(caps, setCaps)} className={s ? 'ft-sbtn' : 'nm-sbtn'} style={{ padding: '2px 7px', gap: 2 }}>
                            {I.plus(9)} Add
                          </button>
                        </div>
                        {caps.map((c, i) => (
                          <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontSize: 9, color: s ? 'rgba(191,0,255,.5)' : '#a855f7', width: 18, fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, flexShrink: 0 }}>C{i + 1}</span>
                            <input type="number" value={c} min="0" step="0.1"
                              onChange={e => updateRow(caps, setCaps, i, e.target.value)}
                              className={s ? 'ft-inp' : 'nm-inp'} style={{ flex: 1, height: 28, fontSize: 12, borderColor: s ? 'rgba(191,0,255,.22)' : 'rgba(168,85,247,.25)' }} />
                            <button onClick={() => removeRow(caps, setCaps, i)} className={s ? 'ft-sbtn ft-sbtn-red' : 'nm-sbtn nm-sbtn-red'} style={{ padding: '3px 5px' }}>{I.trash(9)}</button>
                          </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5, marginTop: 9 }}>
                          <label className={s ? 'ft-lbl' : 'nm-lbl'} style={{ marginBottom: 0, color: s ? 'rgba(0,255,136,.6)' : '#34d399' }}>Inductors (mH)</label>
                          <button onClick={() => addRow(inds, setInds)} className={s ? 'ft-sbtn' : 'nm-sbtn'} style={{ padding: '2px 7px', gap: 2 }}>{I.plus(9)} Add</button>
                        </div>
                        {inds.map((l, i) => (
                          <div key={i} style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontSize: 9, color: s ? 'rgba(0,255,136,.5)' : '#34d399', width: 18, fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, flexShrink: 0 }}>L{i + 1}</span>
                            <input type="number" value={l} min="0" step="0.1"
                              onChange={e => updateRow(inds, setInds, i, e.target.value)}
                              className={s ? 'ft-inp' : 'nm-inp'} style={{ flex: 1, height: 28, fontSize: 12, borderColor: s ? 'rgba(0,255,136,.22)' : 'rgba(52,211,153,.25)' }} />
                            <button onClick={() => removeRow(inds, setInds, i)} className={s ? 'ft-sbtn ft-sbtn-red' : 'nm-sbtn nm-sbtn-red'} style={{ padding: '3px 5px' }}>{I.trash(9)}</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── ANIMATED CIRCUIT ── */}
                <div className={s ? 'ft-card' : 'nm-card'} style={{ padding: 11 }}>
                  <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: s ? 'rgba(255,178,0,.42)' : '#f59e0b', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 5 }}>
                    {I.resist(10)} Animated Circuit Diagram
                    <span style={{ fontSize: 7.5, color: s ? 'rgba(255,178,0,.28)' : '#64748b', marginLeft: 4 }}>Electrons flow in real time</span>
                  </div>
                  <CircuitSVG resistors={resistors} caps={caps} inds={inds} voltage={voltage}
                    circuitType={circuitType} neon={s} calc={calc} />
                </div>

                {/* ── OSCILLOSCOPE ── */}
                {calc && (
                  <div className={s ? 'ft-card' : 'nm-card'} style={{ padding: 11 }}>
                    <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: s ? 'rgba(255,178,0,.42)' : '#f59e0b', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 5 }}>
                      {I.scope(10)} Oscilloscope — V / I / P Waveforms
                      <span style={{ fontSize: 7.5, color: s ? 'rgba(0,212,255,.4)' : '#38bdf8', marginLeft: 4 }}>· Voltage  · Current  · Power</span>
                    </div>
                    <Oscilloscope voltage={voltage} current={calc.I_dc} power={calc.P_total} freq={freq} neon={s} />
                  </div>
                )}

                {/* ── POWER PIE + PHASOR (side by side) ── */}
                {calc && (
                  <div style={{ display: 'grid', gridTemplateColumns: showAC ? '1fr 1fr' : '1fr', gap: 12 }}>
                    {/* Power distribution */}
                    {calc.powerPct.length > 1 && (
                      <div className={s ? 'ft-card' : 'nm-card'} style={{ padding: 13 }}>
                        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: s ? 'rgba(255,178,0,.42)' : '#f59e0b', marginBottom: 9, display: 'flex', gap: 5 }}>
                          {I.pie(10)} Power Distribution
                        </div>
                        <PowerPie powerPct={calc.powerPct} neon={s} />
                      </div>
                    )}

                    {/* Phasor Diagram */}
                    {showAC && (
                      <div className={s ? 'ft-card' : 'nm-card'} style={{ padding: 13 }}>
                        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: s ? 'rgba(0,212,255,.45)' : '#38bdf8', marginBottom: 9, display: 'flex', gap: 5 }}>
                          {I.phasor(10)} Phasor / Impedance Diagram
                        </div>
                        <PhasorDiagram R={calc.totalR} Xl={calc.Xl} Xc={calc.Xc} Z={calc.Z} phi_deg={calc.phi_deg} neon={s} />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                          {[
                            [`Z = ${calc.Z.toFixed(2)} Ω`, s ? '#00d4ff' : '#38bdf8'],
                            [`φ = ${calc.phi_deg.toFixed(1)}°`, s ? '#00d4ff' : '#38bdf8'],
                            [`PF = ${calc.pf.toFixed(3)}`, s ? '#ffb200' : '#f59e0b'],
                            ...(calc.f_res ? [`f₀ = ${calc.f_res.toFixed(1)} Hz`] : []).map(l => [l, s ? '#00ff88' : '#34d399']),
                            ...(calc.Q ? [`Q = ${calc.Q.toFixed(2)}`] : []).map(l => [l, s ? '#bf00ff' : '#a855f7']),
                          ].map(([v, c], i) => (
                            <span key={i} style={{ fontSize: 9.5, fontFamily: 'JetBrains Mono,monospace', fontWeight: 700, color: c,
                              padding: '2px 7px', borderRadius: s ? 2 : 5,
                              border: `1px solid ${c}44`, background: `${c}11` }}>
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── EXTENDED METRICS ── */}
                {calc && (
                  <div className={s ? 'ft-card' : 'nm-card'} style={{ padding: 14 }}>
                    <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: s ? 'rgba(255,178,0,.42)' : '#f59e0b', marginBottom: 11 }}>
                      Extended Analysis
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
                      <Metric label="Conductance" value={(1000 / calc.totalR).toFixed(2)} unit="mS"
                        color={s ? '#ffb200' : '#f59e0b'} neon={s} sub="G = 1/R" />
                      <Metric label="Avg power/R" value={(calc.P_total / resistors.length).toFixed(3)} unit="W"
                        color={s ? '#ff6b6b' : '#f87171'} neon={s} sub="per resistor" />
                      {calc.V_div !== null && (
                        <Metric label="Vout divider" value={calc.V_div.toFixed(3)} unit="V"
                          color={s ? '#bf00ff' : '#a855f7'} neon={s} sub="across R2" />
                      )}
                      <Metric label="Thévenin R" value={calc.R_th.toFixed(2)} unit="Ω"
                        color={s ? '#00d4ff' : '#38bdf8'} neon={s} sub="Norton I" />
                      {showAC && calc.tau !== null && (
                        <Metric label="τ (RC)" value={calc.tau.toFixed(2)} unit="ms"
                          color={s ? '#bf00ff' : '#a855f7'} neon={s} sub="time constant" />
                      )}
                      {showAC && calc.Q !== null && (
                        <Metric label="Q factor" value={calc.Q.toFixed(3)} unit=""
                          color={s ? '#00ff88' : '#34d399'} neon={s} sub="selectivity" />
                      )}
                      {showAC && calc.bw !== null && (
                        <Metric label="Bandwidth" value={calc.bw.toFixed(1)} unit="Hz"
                          color={s ? '#ffb200' : '#f59e0b'} neon={s} sub="BW = f₀/Q" />
                      )}
                      <Metric label="Norton I" value={calc.I_norton.toFixed(4)} unit="A"
                        color={s ? '#00d4ff' : '#38bdf8'} neon={s} sub="Vth / Rth" />
                    </div>

                    {/* Per-resistor table */}
                    <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: s ? 'rgba(255,178,0,.35)' : '#374868', marginBottom: 7 }}>Per-Resistor Breakdown</div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 360 }}>
                        <thead>
                          <tr style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: s ? 'rgba(255,178,0,.35)' : '#374868' }}>
                            {['Resistor', 'Value (Ω)', 'Voltage (V)', 'Current (A)', 'Power (W)', '%  of  P_total'].map(h => (
                              <td key={h} style={{ padding: '3px 7px 6px', textAlign: h === 'Resistor' ? 'left' : 'center' }}>{h}</td>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {calc.perR.map((row, i) => row && (
                            <tr key={i} style={{ borderTop: s ? '1px solid rgba(255,178,0,.055)' : '1.5px solid #18253a' }}>
                              <td style={{ padding: '5px 7px', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700, color: s ? '#ffb200' : '#f59e0b' }}>R{i + 1}</td>
                              <td style={{ padding: '5px 7px', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: s ? '#eef2ff' : '#e2e8f8' }}>{row.r}</td>
                              <td style={{ padding: '5px 7px', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: s ? '#ffb200' : '#f59e0b' }}>{row.V.toFixed(3)}</td>
                              <td style={{ padding: '5px 7px', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: s ? '#00d4ff' : '#38bdf8' }}>{row.I.toFixed(5)}</td>
                              <td style={{ padding: '5px 7px', textAlign: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: s ? '#ff6b6b' : '#f87171' }}>{row.P.toFixed(4)}</td>
                              <td style={{ padding: '5px 7px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
                                  <div style={{ flex: 1, height: 5, borderRadius: 99, background: s ? 'rgba(255,178,0,.1)' : 'rgba(245,158,11,.1)', maxWidth: 60 }}>
                                    <div style={{ height: '100%', borderRadius: 99, background: s ? '#ffb200' : '#f59e0b', width: `${(row.P / calc.P_total) * 100}%` }} />
                                  </div>
                                  <span style={{ fontSize: 9.5, fontFamily: 'JetBrains Mono,monospace', color: s ? '#ffb200' : '#f59e0b', fontWeight: 700, minWidth: 30 }}>
                                    {((row.P / calc.P_total) * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Thévenin equivalent display */}
                {calc && (
                  <div className={s ? 'ft-card' : 'nm-card'} style={{ padding: 14 }}>
                    <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: s ? 'rgba(0,212,255,.45)' : '#38bdf8', marginBottom: 10, display: 'flex', gap: 5 }}>
                      {I.thevenin(10)} Thévenin / Norton Equivalent
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div style={{ padding: '10px 13px', border: s ? '1px solid rgba(0,212,255,.14)' : '1.5px solid rgba(56,189,248,.18)', borderRadius: s ? 3 : 8, background: s ? 'rgba(0,212,255,.04)' : 'rgba(56,189,248,.05)' }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: s ? '#00d4ff' : '#38bdf8', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 7 }}>Thévenin</div>
                        <div style={{ fontSize: 11, color: s ? 'rgba(200,215,255,.55)' : '#64748b', lineHeight: 1.8, fontFamily: 'JetBrains Mono,monospace' }}>
                          <div>V<sub>th</sub> = <strong style={{ color: s ? '#ffb200' : '#f59e0b' }}>{calc.V_th.toFixed(3)} V</strong></div>
                          <div>R<sub>th</sub> = <strong style={{ color: s ? '#ffb200' : '#f59e0b' }}>{calc.R_th.toFixed(3)} Ω</strong></div>
                        </div>
                      </div>
                      <div style={{ padding: '10px 13px', border: s ? '1px solid rgba(0,212,255,.14)' : '1.5px solid rgba(56,189,248,.18)', borderRadius: s ? 3 : 8, background: s ? 'rgba(0,212,255,.04)' : 'rgba(56,189,248,.05)' }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: s ? '#00d4ff' : '#38bdf8', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 7 }}>Norton</div>
                        <div style={{ fontSize: 11, color: s ? 'rgba(200,215,255,.55)' : '#64748b', lineHeight: 1.8, fontFamily: 'JetBrains Mono,monospace' }}>
                          <div>I<sub>sc</sub> = <strong style={{ color: s ? '#00d4ff' : '#38bdf8' }}>{calc.I_norton.toFixed(4)} A</strong></div>
                          <div>R<sub>N</sub> = <strong style={{ color: s ? '#00d4ff' : '#38bdf8' }}>{calc.R_th.toFixed(3)} Ω</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Steps */}
                {steps.length > 0 && (
                  <div className={s ? 'ft-card' : 'nm-card'} style={{ padding: 14 }}>
                    <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: s ? 'rgba(255,178,0,.42)' : '#f59e0b', marginBottom: 12 }}>
                      Step-by-Step Solution
                    </div>
                    <Steps steps={steps} neon={s} katex={katex} />
                  </div>
                )}

                <div className={s ? 'ft-ad' : 'nm-ad'} style={{ height: 90, marginTop: 4 }}>
                  <span>Advertisement</span>
                </div>
              </motion.div>
            )}

            {activeTab === 'guide' && (
              <motion.div key="g" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <HowToUse neon={s} />
              </motion.div>
            )}

            {activeTab === 'article' && (
              <motion.div key="a" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Article neon={s} katex={katex} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ borderLeft: s ? '1px solid rgba(255,178,0,.07)' : '1.5px solid #18253a',
          background: s ? 'rgba(3,3,13,.97)' : '#0d1322',
          padding: '13px 11px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 13 }}>

          <div className={s ? 'ft-ad' : 'nm-ad'} style={{ height: 120 }}>
            <span>Advertisement</span>
          </div>

          {/* Presets */}
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, color: s ? 'rgba(255,178,0,.42)' : '#f59e0b', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 7 }}>
              Circuit Presets
            </div>
            {PRESETS.map((p, i) => (
              <button key={i} onClick={() => loadPreset(p)}
                style={{ display: 'block', width: '100%', textAlign: 'left', marginBottom: 3,
                  padding: '5px 9px', border: s ? '1px solid rgba(255,178,0,.07)' : '1.5px solid #18253a',
                  borderRadius: s ? 2 : 7, background: 'transparent', cursor: 'pointer',
                  fontFamily: 'Inter', fontSize: 9.5, color: s ? 'rgba(255,178,0,.36)' : '#374868', transition: 'all .11s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s ? 'rgba(255,178,0,.28)' : '#d97706'; e.currentTarget.style.color = s ? '#ffb200' : '#f59e0b'; e.currentTarget.style.background = s ? 'rgba(255,178,0,.04)' : 'rgba(217,119,6,.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = s ? 'rgba(255,178,0,.07)' : '#18253a'; e.currentTarget.style.color = s ? 'rgba(255,178,0,.36)' : '#374868'; e.currentTarget.style.background = 'transparent'; }}>
                <span style={{ fontSize: 7, opacity: .38, marginRight: 4, letterSpacing: '.1em', textTransform: 'uppercase' }}>{p.t}</span>
                {p.label}
              </button>
            ))}
          </div>

          {/* Quick guide */}
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, color: s ? 'rgba(255,178,0,.42)' : '#f59e0b', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 7 }}>
              Quick Guide
            </div>
            {[
              ['1', 'Pick type', 'Series or Parallel'],
              ['2', 'Add R', 'Enter resistance in Ω'],
              ['3', 'Set V', 'Source voltage'],
              ['AC', 'AC mode', 'Enable for C, L, Z, φ'],
              ['⚡', 'Live', 'Diagram + scope update'],
              ['π', 'Phasor', 'Impedance triangle'],
              ['%', 'Pie chart', 'Power per resistor'],
              ['Th', 'Thévenin', 'Equivalent circuit'],
            ].map(([n, t, d]) => (
              <div key={n} style={{ display: 'flex', gap: 6, marginBottom: 7, alignItems: 'flex-start' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  background: s ? 'rgba(255,178,0,.07)' : 'rgba(217,119,6,.09)',
                  border: s ? '1px solid rgba(255,178,0,.2)' : '1.5px solid rgba(217,119,6,.26)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 7, fontWeight: 700, color: s ? '#ffb200' : '#f59e0b' }}>{n}</div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: s ? 'rgba(200,215,255,.72)' : '#c7d2ee', lineHeight: 1.3 }}>{t}</div>
                  <div style={{ fontSize: 9, color: s ? 'rgba(255,178,0,.3)' : '#374868', lineHeight: 1.4 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Formula reference */}
          <div className={s ? 'ft-card' : 'nm-card'} style={{ padding: 11 }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: s ? 'rgba(255,178,0,.42)' : '#f59e0b', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 7 }}>
              Formula Reference
            </div>
            {[
              ['V = IR', "Ohm's Law"],
              ['P = VI = I²R', 'Power'],
              ['R_s = ΣRᵢ', 'Series'],
              ['1/Rₚ = Σ1/Rᵢ', 'Parallel'],
              ['G = 1/R', 'Conductance'],
              ['Xc = 1/ωC', 'Capacitive Ω'],
              ['Xl = ωL', 'Inductive Ω'],
              ['Z = √(R²+X²)', 'Impedance'],
              ['τ = RC', 'Time constant'],
              ['f₀=1/2π√LC', 'Resonance'],
            ].map(([f, l]) => (
              <div key={f} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <code style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9.5, color: s ? 'rgba(255,178,0,.68)' : '#f59e0b' }}>{f}</code>
                <span style={{ fontSize: 8.5, color: s ? 'rgba(200,215,255,.3)' : '#374868' }}>{l}</span>
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

/* ════════════════════════════════════════════════════════════════════
   HOW TO USE
════════════════════════════════════════════════════════════════════ */
function HowToUse({ neon }) {
  const s = neon;
  const steps = [
    { ico: 'resist', title: 'Choose circuit type', body: 'Select Series (single loop — same current, voltage splits) or Parallel (branches — same voltage, current splits). Click the toggle above the input card.' },
    { ico: 'plus', title: 'Add resistors', body: 'Type resistance values in Ohms. Click "+ Add" to add up to 8 resistors. Remove any with the trash icon. Changes instantly update the diagram, waveform, and all calculations.' },
    { ico: 'zap', title: 'Set source voltage', body: 'Enter the supply voltage (battery or power supply). Used with Ohm\'s Law (V=IR) to calculate current and power throughout the circuit.' },
    { ico: 'wave', title: 'Enable AC mode', body: 'Toggle "AC Mode" to add capacitors (μF) and inductors (mH). This unlocks impedance Z, reactances Xc and Xl, phase angle φ, power factor, resonant frequency, Q factor, and bandwidth.' },
    { ico: 'scope', title: 'Read the oscilloscope', body: 'The yellow line is voltage, cyan is current, red is power — displayed over 2.5 cycles. Helps visualize the sinusoidal relationships and power pulses.' },
    { ico: 'phasor', title: 'Understand the phasor diagram', body: 'The phasor/impedance triangle shows R (horizontal), Xl (up), Xc (down), and Z (diagonal). The angle φ shows phase shift between voltage and current.' },
    { ico: 'pie', title: 'Power distribution pie', body: 'Shows what percentage of total power each resistor dissipates. Useful for checking thermal load balance and identifying hot components.' },
    { ico: 'thevenin', title: 'Thévenin & Norton equivalents', body: 'Any linear circuit can be replaced by a single voltage source + resistor (Thévenin) or current source + resistor (Norton). This is critical for load analysis.' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
      <div className={s ? 'ft-hint' : 'nm-hint'} style={{ display: 'flex', gap: 7 }}>
        {I.info(12)} <span>CircuitLab is a full DC/AC circuit analyser with animated diagrams, oscilloscope, phasor diagram, power pie, and Thévenin equivalents.</span>
      </div>
      {steps.map((st, i) => (
        <div key={i} className={s ? 'ft-card' : 'nm-card'} style={{ padding: 13 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 32, height: 32, borderRadius: s ? 3 : 9, flexShrink: 0,
              background: s ? 'rgba(255,178,0,.07)' : 'rgba(217,119,6,.09)',
              border: s ? '1px solid rgba(255,178,0,.18)' : '1.5px solid rgba(217,119,6,.24)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: s ? '#ffb200' : '#f59e0b' }}>
              {I[st.ico]?.(18)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: s ? '#cdd6ff' : '#e2e8f8', marginBottom: 4 }}>Step {i + 1}: {st.title}</div>
              <div style={{ fontSize: 11.5, color: s ? 'rgba(255,178,0,.4)' : '#374868', lineHeight: 1.68 }}>{st.body}</div>
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

/* ════════════════════════════════════════════════════════════════════
   ARTICLE
════════════════════════════════════════════════════════════════════ */
function Article({ neon, katex }) {
  const s = neon;
  const tc = s ? '#cdd6ff' : '#e2e8f8';
  const sc = s ? 'rgba(255,178,0,.42)' : '#374868';
  const ac = s ? '#ffb200' : '#f59e0b';
  const bc = s ? 'rgba(255,178,0,.035)' : 'rgba(217,119,6,.045)';
  const bdrc = s ? 'rgba(255,178,0,.11)' : 'rgba(217,119,6,.18)';
  const faqBg = s ? 'rgba(7,7,24,.8)' : '#070c17';
  const faqBdr = s ? 'rgba(255,178,0,.08)' : '#18253a';

  const KBlock = ({ l }) => {
    if (katex && window.katex) {
      try {
        const h = window.katex.renderToString(l, { displayMode: true, throwOnError: false });
        return <div style={{ textAlign: 'center', overflowX: 'auto', padding: '10px 14px', background: bc, border: `1px solid ${bdrc}`, borderRadius: s ? 3 : 8, margin: '10px 0' }}>
          <span dangerouslySetInnerHTML={{ __html: h }} style={{ color: tc }} />
        </div>;
      } catch (e) {}
    }
    return <code style={{ display: 'block', padding: '8px 12px', background: bc, border: `1px solid ${bdrc}`, borderRadius: s ? 3 : 8, margin: '10px 0', fontFamily: 'JetBrains Mono,monospace', color: ac, fontSize: 12 }}>{l}</code>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className={s ? 'ft-card' : 'nm-card'} style={{ padding: 22 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
          <div style={{ width: 36, height: 36, borderRadius: s ? 3 : 10, flexShrink: 0,
            background: s ? 'rgba(255,178,0,.07)' : 'rgba(217,119,6,.09)',
            border: s ? '1px solid rgba(255,178,0,.18)' : '1.5px solid rgba(217,119,6,.24)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: ac }}>
            {I.book(20)}
          </div>
          <div>
            <h1 style={{ fontSize: 19, fontWeight: 900, color: tc, lineHeight: 1.2 }}>Mastering Electrical Circuits</h1>
            <p style={{ fontSize: 11, color: sc, marginTop: 3 }}>Ohm's Law · Series & Parallel · AC Impedance · Thévenin — the complete guide</p>
          </div>
        </div>

        <div className="prose" style={{ color: tc }}>
          <p style={{ color: sc }}>Every electronic device — a USB charger, smartphone, EV motor, or power grid — is governed by the same three quantities: <strong style={{ color: tc }}>voltage</strong>, <strong style={{ color: tc }}>current</strong>, and <strong style={{ color: tc }}>resistance</strong>. This guide covers everything from Ohm's Law basics to AC impedance and circuit theorems.</p>

          <h3 style={{ color: tc }}>Ohm's Law</h3>
          <p style={{ color: sc }}>Georg Simon Ohm (1827) showed that current through a conductor is proportional to voltage and inversely proportional to resistance:</p>
          <KBlock l="V = I \times R \quad \Leftrightarrow \quad I = \frac{V}{R} \quad \Leftrightarrow \quad R = \frac{V}{I}" />

          <h3 style={{ color: tc }}>Series Circuits</h3>
          <p style={{ color: sc }}>Components share the same current. Total resistance is the sum of all individual resistances. Voltage divides proportionally.</p>
          <KBlock l="R_{series} = R_1 + R_2 + \cdots + R_n \qquad V_k = I \cdot R_k" />
          <ul style={{ color: sc }}>
            <li><strong style={{ color: tc }}>Same current</strong> through every element</li>
            <li><strong style={{ color: tc }}>Voltage divides</strong> — more resistance = more voltage drop</li>
            <li>One broken component breaks the entire circuit</li>
          </ul>

          <h3 style={{ color: tc }}>Parallel Circuits</h3>
          <p style={{ color: sc }}>Components share the same voltage. Total resistance is lower than any branch. Current divides among branches.</p>
          <KBlock l="\frac{1}{R_p} = \frac{1}{R_1} + \frac{1}{R_2} + \cdots \qquad I_k = \frac{V}{R_k}" />
          <ul style={{ color: sc }}>
            <li><strong style={{ color: tc }}>Same voltage</strong> across every branch</li>
            <li><strong style={{ color: tc }}>Current divides</strong> — less resistance = more current</li>
            <li>House wiring is always parallel — each outlet gets full voltage</li>
          </ul>

          <h3 style={{ color: tc }}>Power & Energy</h3>
          <KBlock l="P = V \cdot I = I^2 R = \frac{V^2}{R} \qquad \text{Energy} = P \times t" />

          <h3 style={{ color: tc }}>AC Circuits: Impedance</h3>
          <p style={{ color: sc }}>In AC circuits, capacitors and inductors oppose current as well as resistors. Their opposition is called <strong style={{ color: tc }}>reactance</strong> (X), measured in Ohms.</p>
          <KBlock l="X_C = \frac{1}{\omega C} \qquad X_L = \omega L \qquad Z = \sqrt{R^2 + (X_L - X_C)^2}" />
          <p style={{ color: sc }}>The phase angle φ tells how much voltage leads or lags current:</p>
          <KBlock l="\varphi = \arctan\!\left(\frac{X_L - X_C}{R}\right) \qquad \text{Power Factor} = \cos\varphi" />

          <h3 style={{ color: tc }}>Resonance & Q Factor</h3>
          <p style={{ color: sc }}>At resonant frequency, Xl = Xc, so impedance equals resistance (minimum) and current is maximum. The Q factor measures selectivity.</p>
          <KBlock l="f_0 = \frac{1}{2\pi\sqrt{LC}} \qquad Q = \frac{1}{R}\sqrt{\frac{L}{C}} \qquad BW = \frac{f_0}{Q}" />

          <h3 style={{ color: tc }}>Thévenin's Theorem</h3>
          <p style={{ color: sc }}>Any linear network can be simplified to a single voltage source V_th in series with R_th. This makes it easy to analyse how a load will behave.</p>
          <KBlock l="V_{th} = V_{oc} \qquad R_{th} = R_{eq} \qquad I_{sc} = \frac{V_{th}}{R_{th}}" />

          <h3 style={{ color: tc }}>FAQ</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { q: 'Why does parallel resistance decrease?', a: 'More branches create more paths for current. Each path adds conductance (G = 1/R), so total conductance adds up, making total resistance lower.' },
              { q: 'What is a short circuit?', a: 'When resistance approaches 0, Ohm\'s Law (I = V/R) shows current approaches infinity. This causes extreme heat, blown fuses, or fire.' },
              { q: 'Why do capacitors block DC but pass AC?', a: 'At DC (f = 0), Xc = 1/(ωC) → ∞, so no current flows. At AC, Xc decreases as frequency rises, allowing current to flow.' },
              { q: 'What is power factor and why does it matter?', a: 'PF = cos(φ) shows how much apparent power (VA) does real work (W). PF = 1 is ideal. Low PF means wasted energy — power companies charge extra for it.' },
              { q: 'How do I choose a resistor wattage rating?', a: 'Calculate P = I²R for that resistor. Choose a part rated at least 2× that value for safety margin. Common values: 1/4W, 1/2W, 1W, 5W.' },
            ].map(({ q, a }, i) => (
              <div key={i} style={{ padding: '10px 13px', background: faqBg, border: `1px solid ${faqBdr}`, borderRadius: s ? 3 : 9 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: tc, marginBottom: 4 }}>{q}</div>
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