import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   SALARY.tax — Salary & Tax Calculator
   Dark Terminal Amber / Light Cream Ink  ·  QR.forge design system
   DM Mono + Syne fonts
   ─────────────────────────────────────────────────────────────────
   TABS:
   ◈ Breakdown   — Take-home pay, animated donut, full deductions
   ⊞ Tax Slabs   — Visual tax bracket breakdown with bar chart
   ⇄ Compare     — Compare 2 salaries / filing statuses
   ↑ Raise        — "What if I got a raise?" simulator
   🌍 Countries   — US / UK / India / Canada tax regimes
   ⚖ Gross↔Net   — Reverse: target net → required gross
   ⌛ History     — Saved calculations
   ∑ Learn        — Tax guide, glossary, tips
═══════════════════════════════════════════════════════════════════ */

/* ─── STYLES ─────────────────────────────────────────────────── */
const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@700;800;900&family=Lato:wght@300;400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{font-family:'Lato',sans-serif;}
.dk{--bg:#0e0c09;--s1:#141209;--s2:#1a1710;--bdr:#2a2518;--acc:#f59e0b;--acc2:#fb923c;
  --lo:#34d399;--er:#f87171;--info:#60a5fa;--pur:#a78bfa;--warn:#fbbf24;
  --tx:#fef3c7;--tx2:#fbbf24;--tx3:#78350f;--tx4:#451a03;
  background:var(--bg);color:var(--tx);min-height:100vh;
  background-image:radial-gradient(ellipse 80% 40% at 50% -10%,rgba(245,158,11,.08),transparent 70%);}
.lt{--bg:#faf8f2;--s1:#fff;--s2:#f5f0e8;--bdr:#e8e0d0;--acc:#92400e;--acc2:#b45309;
  --lo:#065f46;--er:#991b1b;--info:#1d4ed8;--pur:#6d28d9;--warn:#b45309;
  --tx:#1c1208;--tx2:#78350f;--tx3:#a16207;--tx4:#d97706;
  background:var(--bg);color:var(--tx);min-height:100vh;}
.topbar{height:48px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:8px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(14,12,9,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(250,248,242,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(146,64,14,.06);}
.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none;}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 14px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'DM Mono',monospace;font-size:10px;
  letter-spacing:.09em;text-transform:uppercase;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .14s;}
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
.btn-pri{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 20px;
  cursor:pointer;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:500;border:none;transition:all .13s;}
.dk .btn-pri{background:var(--acc);color:#0e0c09;border-radius:3px;box-shadow:0 0 20px rgba(245,158,11,.3);}
.dk .btn-pri:hover{background:#fbbf24;}
.lt .btn-pri{background:var(--acc);color:#fff;border-radius:8px;box-shadow:0 4px 14px rgba(146,64,14,.35);}
.lt .btn-pri:hover{background:var(--acc2);}
.btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:5px 11px;
  cursor:pointer;font-family:'DM Mono',monospace;font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;background:transparent;transition:all .12s;}
.dk .btn-ghost{border:1px solid var(--bdr);border-radius:3px;color:var(--tx3);}
.dk .btn-ghost:hover,.dk .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(245,158,11,.06);}
.lt .btn-ghost{border:1.5px solid var(--bdr);border-radius:7px;color:var(--tx3);}
.lt .btn-ghost:hover,.lt .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(146,64,14,.06);}
.inp{width:100%;padding:8px 11px;font-family:'DM Mono',monospace;font-size:12px;outline:none;transition:all .13s;}
.dk .inp{background:rgba(0,0,0,.5);border:1px solid var(--bdr);color:var(--tx);border-radius:3px;}
.dk .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(245,158,11,.14);}
.lt .inp{background:#fdf8f0;border:1.5px solid var(--bdr);color:var(--tx);border-radius:8px;}
.lt .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(146,64,14,.1);}
.sel{width:100%;padding:8px 11px;font-family:'DM Mono',monospace;font-size:12px;outline:none;cursor:pointer;appearance:none;transition:all .13s;}
.dk .sel{background:rgba(0,0,0,.5);border:1px solid var(--bdr);color:var(--tx);border-radius:3px;}
.dk .sel:focus{border-color:var(--acc);}
.lt .sel{background:#fdf8f0;border:1.5px solid var(--bdr);color:var(--tx);border-radius:8px;}
.lt .sel:focus{border-color:var(--acc);}
.lbl{font-family:'DM Mono',monospace;font-size:8.5px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(245,158,11,.5);}
.lt .lbl{color:var(--acc);}
.sec-lbl{font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.22em;text-transform:uppercase;margin-bottom:8px;}
.dk .sec-lbl{color:rgba(245,158,11,.35);}
.lt .sec-lbl{color:var(--acc);}
.hint{padding:9px 13px;display:flex;gap:8px;align-items:flex-start;font-size:12.5px;line-height:1.72;}
.dk .hint{border:1px solid rgba(245,158,11,.15);border-radius:3px;background:rgba(245,158,11,.04);border-left:2.5px solid rgba(245,158,11,.4);color:var(--tx2);}
.lt .hint{border:1.5px solid rgba(146,64,14,.15);border-radius:9px;background:rgba(146,64,14,.04);border-left:3px solid rgba(146,64,14,.3);color:var(--tx2);}
.scard{padding:12px 14px;display:flex;flex-direction:column;gap:3px;}
.dk .scard{background:rgba(245,158,11,.03);border:1px solid rgba(245,158,11,.1);border-radius:4px;}
.lt .scard{background:rgba(146,64,14,.03);border:1.5px solid rgba(146,64,14,.1);border-radius:10px;}
.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(245,158,11,.012);border:1px dashed rgba(245,158,11,.1);border-radius:3px;}
.lt .ad{background:rgba(146,64,14,.03);border:1.5px dashed rgba(146,64,14,.15);border-radius:9px;}
.ad span{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--tx3);}
.rng{width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;appearance:none;margin-top:6px;}
.dk .rng{background:rgba(245,158,11,.15);accent-color:var(--acc);}
.lt .rng{background:rgba(146,64,14,.15);accent-color:var(--acc);}
.prose p{font-size:13.5px;line-height:1.82;margin-bottom:12px;color:var(--tx2);}
.prose h3{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;margin:22px 0 8px;color:var(--tx);text-transform:uppercase;letter-spacing:.04em;}
.prose strong{font-weight:700;color:var(--tx);}
.prose code{font-family:'DM Mono',monospace;font-size:11.5px;padding:1px 5px;border-radius:3px;}
.dk .prose code{background:rgba(245,158,11,.1);color:var(--acc);}
.lt .prose code{background:rgba(146,64,14,.08);color:var(--acc);}
.qa{padding:12px 15px;margin-bottom:9px;}
.dk .qa{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.3);}
.lt .qa{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(146,64,14,.03);}
.hist-row{padding:10px 14px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;transition:all .12s;gap:12px;}
.dk .hist-row{border:1px solid var(--bdr);border-radius:4px;background:var(--s2);}
.dk .hist-row:hover{border-color:var(--acc);background:rgba(245,158,11,.04);}
.lt .hist-row{border:1.5px solid var(--bdr);border-radius:10px;background:var(--s1);}
.lt .hist-row:hover{border-color:var(--acc);}
.slab-row{display:grid;grid-template-columns:90px 1fr auto;gap:12px;align-items:center;padding:8px 0;}
.dk .slab-row{border-bottom:1px solid rgba(245,158,11,.06);}
.lt .slab-row{border-bottom:1px solid rgba(146,64,14,.08);}
@media(max-width:768px){
  .body{grid-template-columns:1fr!important;}
  .sidebar{display:none!important;}
  .sidebar.mob{display:flex!important;position:fixed;left:0;top:88px;bottom:0;width:248px;z-index:300;box-shadow:4px 0 24px rgba(0,0,0,.4);}
  .mob-btn{display:flex!important;}
  .mob-overlay{display:none;position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.55);}
  .mob-overlay.show{display:block;}
  .topbar{padding:0 12px;}
  .main{padding:10px;}
}
@media(min-width:769px){.mob-btn{display:none!important;}}
@media(max-width:520px){.g2{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr 1fr!important;}}
`;

/* ─── TAX REGIMES ─────────────────────────────────────────────── */
const REGIMES = {
  US: {
    name: 'United States', sym: '$', code: 'USD',
    filing: ['Single', 'Married Filing Jointly', 'Married Filing Separately', 'Head of Household'],
    brackets2024: {
      'Single': [
        { min: 0,       max: 11600,  rate: 0.10 },
        { min: 11600,   max: 47150,  rate: 0.12 },
        { min: 47150,   max: 100525, rate: 0.22 },
        { min: 100525,  max: 191950, rate: 0.24 },
        { min: 191950,  max: 243725, rate: 0.32 },
        { min: 243725,  max: 609350, rate: 0.35 },
        { min: 609350,  max: Infinity, rate: 0.37 },
      ],
      'Married Filing Jointly': [
        { min: 0,       max: 23200,  rate: 0.10 },
        { min: 23200,   max: 94300,  rate: 0.12 },
        { min: 94300,   max: 201050, rate: 0.22 },
        { min: 201050,  max: 383900, rate: 0.24 },
        { min: 383900,  max: 487450, rate: 0.32 },
        { min: 487450,  max: 731200, rate: 0.35 },
        { min: 731200,  max: Infinity, rate: 0.37 },
      ],
      'Married Filing Separately': [
        { min: 0,       max: 11600,  rate: 0.10 },
        { min: 11600,   max: 47150,  rate: 0.12 },
        { min: 47150,   max: 100525, rate: 0.22 },
        { min: 100525,  max: 191950, rate: 0.24 },
        { min: 191950,  max: 243725, rate: 0.32 },
        { min: 243725,  max: 365600, rate: 0.35 },
        { min: 365600,  max: Infinity, rate: 0.37 },
      ],
      'Head of Household': [
        { min: 0,       max: 16550,  rate: 0.10 },
        { min: 16550,   max: 63100,  rate: 0.12 },
        { min: 63100,   max: 100500, rate: 0.22 },
        { min: 100500,  max: 191950, rate: 0.24 },
        { min: 191950,  max: 243700, rate: 0.32 },
        { min: 243700,  max: 609350, rate: 0.35 },
        { min: 609350,  max: Infinity, rate: 0.37 },
      ],
    },
    stdDeduction: { 'Single': 14600, 'Married Filing Jointly': 29200, 'Married Filing Separately': 14600, 'Head of Household': 21900 },
    ssRate: 0.062, ssLimit: 168600,
    medicareRate: 0.0145,
    notes: 'Social Security 6.2% up to $168,600 · Medicare 1.45% · Additional Medicare 0.9% above $200k',
  },
  UK: {
    name: 'United Kingdom', sym: '£', code: 'GBP',
    filing: ['Individual'],
    brackets2024: {
      'Individual': [
        { min: 0,       max: 12570,  rate: 0.00 },
        { min: 12570,   max: 50270,  rate: 0.20 },
        { min: 50270,   max: 125140, rate: 0.40 },
        { min: 125140,  max: Infinity, rate: 0.45 },
      ],
    },
    stdDeduction: { 'Individual': 0 },
    niRate: 0.08, niLimit: 50270, niLower: 12570,
    notes: 'Personal Allowance £12,570 · NI Class 1: 8% on £12,570–£50,270, 2% above',
  },
  IN: {
    name: 'India', sym: '₹', code: 'INR',
    filing: ['New Regime', 'Old Regime'],
    brackets2024: {
      'New Regime': [
        { min: 0,        max: 300000,  rate: 0.00 },
        { min: 300000,   max: 600000,  rate: 0.05 },
        { min: 600000,   max: 900000,  rate: 0.10 },
        { min: 900000,   max: 1200000, rate: 0.15 },
        { min: 1200000,  max: 1500000, rate: 0.20 },
        { min: 1500000,  max: Infinity, rate: 0.30 },
      ],
      'Old Regime': [
        { min: 0,        max: 250000,  rate: 0.00 },
        { min: 250000,   max: 500000,  rate: 0.05 },
        { min: 500000,   max: 1000000, rate: 0.20 },
        { min: 1000000,  max: Infinity, rate: 0.30 },
      ],
    },
    stdDeduction: { 'New Regime': 75000, 'Old Regime': 50000 },
    pfRate: 0.12, pfLimit: 180000,
    surcharge: [
      { min: 5000000,  max: 10000000, rate: 0.10 },
      { min: 10000000, max: 20000000, rate: 0.15 },
      { min: 20000000, max: 50000000, rate: 0.25 },
      { min: 50000000, max: Infinity, rate: 0.37 },
    ],
    cess: 0.04,
    notes: 'New Regime: Standard deduction ₹75,000 · Old Regime: ₹50,000 + Section 80C etc. · 4% Health & Education Cess',
  },
  CA: {
    name: 'Canada', sym: 'C$', code: 'CAD',
    filing: ['Individual'],
    brackets2024: {
      'Individual': [
        { min: 0,       max: 55867,  rate: 0.15 },
        { min: 55867,   max: 111733, rate: 0.205 },
        { min: 111733,  max: 154906, rate: 0.26 },
        { min: 154906,  max: 220000, rate: 0.29 },
        { min: 220000,  max: Infinity, rate: 0.33 },
      ],
    },
    stdDeduction: { 'Individual': 15705 },
    cppRate: 0.0595, cppLimit: 68500, cppBasic: 3500,
    eiRate: 0.0166, eiLimit: 63200,
    notes: 'Basic personal amount C$15,705 · CPP 5.95% up to C$68,500 · EI 1.66% up to C$63,200',
  },
  AU: {
    name: 'Australia', sym: 'A$', code: 'AUD',
    filing: ['Individual'],
    brackets2024: {
      'Individual': [
        { min: 0,       max: 18200,  rate: 0.00 },
        { min: 18200,   max: 45000,  rate: 0.19 },
        { min: 45000,   max: 120000, rate: 0.325 },
        { min: 120000,  max: 180000, rate: 0.37 },
        { min: 180000,  max: Infinity, rate: 0.45 },
      ],
    },
    stdDeduction: { 'Individual': 0 },
    medicareRate: 0.02, medicareThreshold: 26000,
    superRate: 0.11,
    notes: 'Tax-free threshold A$18,200 · Medicare Levy 2% (above A$26,000) · Super 11% (employer, not deducted from gross shown)',
  },
  DE: {
    name: 'Germany', sym: '€', code: 'EUR',
    filing: ['Single (Class I)', 'Married (Class III)'],
    brackets2024: {
      'Single (Class I)': [
        { min: 0,       max: 11604,  rate: 0.00 },
        { min: 11604,   max: 17005,  rate: 0.14 },
        { min: 17005,   max: 66760,  rate: 0.24 },
        { min: 66760,   max: 277825, rate: 0.42 },
        { min: 277825,  max: Infinity, rate: 0.45 },
      ],
      'Married (Class III)': [
        { min: 0,       max: 23208,  rate: 0.00 },
        { min: 23208,   max: 34010,  rate: 0.14 },
        { min: 34010,   max: 133520, rate: 0.24 },
        { min: 133520,  max: 555650, rate: 0.42 },
        { min: 555650,  max: Infinity, rate: 0.45 },
      ],
    },
    stdDeduction: { 'Single (Class I)': 1230, 'Married (Class III)': 1230 },
    // Social: pension 9.3%, health 7.3%, unemployment 1.3%, care 1.7% = ~19.6%
    socialRate: 0.196, socialCap: 90600,
    solidarityRate: 0.055, // 5.5% surcharge on income tax > threshold
    notes: 'Basic allowance €11,604 · Social contributions ~19.6% (capped) · Solidarity surcharge 5.5% on high earners',
  },
  UAE: {
    name: 'UAE', sym: 'AED', code: 'AED',
    filing: ['Individual'],
    brackets2024: {
      'Individual': [
        { min: 0, max: Infinity, rate: 0.00 },
      ],
    },
    stdDeduction: { 'Individual': 0 },
    notes: 'No personal income tax in the UAE · Corporate tax 9% above AED 375,000 (not applicable to employment income)',
  },
  SG: {
    name: 'Singapore', sym: 'S$', code: 'SGD',
    filing: ['Individual'],
    brackets2024: {
      'Individual': [
        { min: 0,       max: 20000,  rate: 0.00 },
        { min: 20000,   max: 30000,  rate: 0.02 },
        { min: 30000,   max: 40000,  rate: 0.035 },
        { min: 40000,   max: 80000,  rate: 0.07 },
        { min: 80000,   max: 120000, rate: 0.115 },
        { min: 120000,  max: 160000, rate: 0.15 },
        { min: 160000,  max: 200000, rate: 0.18 },
        { min: 200000,  max: 240000, rate: 0.19 },
        { min: 240000,  max: 280000, rate: 0.195 },
        { min: 280000,  max: 320000, rate: 0.20 },
        { min: 320000,  max: 500000, rate: 0.22 },
        { min: 500000,  max: 1000000,rate: 0.23 },
        { min: 1000000, max: Infinity,rate: 0.24 },
      ],
    },
    stdDeduction: { 'Individual': 1000 },
    cpfRate: 0.20, cpfCap: 102000, cpfOW: 6800, // Ordinary wage ceiling per month
    notes: 'No tax below S$20,000 · CPF employee contribution 20% (capped) · Max 24% top rate',
  },
  NL: {
    name: 'Netherlands', sym: '€', code: 'EUR',
    filing: ['Individual'],
    brackets2024: {
      'Individual': [
        { min: 0,       max: 75518,  rate: 0.3697 },
        { min: 75518,   max: Infinity, rate: 0.495 },
      ],
    },
    stdDeduction: { 'Individual': 0 },
    // General tax credit & labour tax credit built into brackets approx
    algemeenKrediet: 3362, arbeidskorting: 5052,
    notes: 'Box 1 income · General tax credit €3,362 · Labour tax credit €5,052 · Social insurance included in 36.97% rate',
  },
  JP: {
    name: 'Japan', sym: '¥', code: 'JPY',
    filing: ['Individual'],
    brackets2024: {
      'Individual': [
        { min: 0,        max: 1950000,  rate: 0.05 },
        { min: 1950000,  max: 3300000,  rate: 0.10 },
        { min: 3300000,  max: 6950000,  rate: 0.20 },
        { min: 6950000,  max: 9000000,  rate: 0.23 },
        { min: 9000000,  max: 18000000, rate: 0.33 },
        { min: 18000000, max: 40000000, rate: 0.40 },
        { min: 40000000, max: Infinity, rate: 0.45 },
      ],
    },
    stdDeduction: { 'Individual': 550000 },
    localTaxRate: 0.10,    // inhabitant tax ~10%
    socialRate: 0.1482,    // pension 9.15% + health 4.99% + employment 0.6% + nursing 0.91%
    surtax: 0.021,         //復興特別所得税 2.1% of income tax
    notes: 'Basic deduction ¥480,000 · Local inhabitant tax ~10% · Social insurance ~14.8% · Reconstruction surtax 2.1%',
  },
  NZ: {
    name: 'New Zealand', sym: 'NZ$', code: 'NZD',
    filing: ['Individual'],
    brackets2024: {
      'Individual': [
        { min: 0,       max: 14000,  rate: 0.105 },
        { min: 14000,   max: 48000,  rate: 0.175 },
        { min: 48000,   max: 70000,  rate: 0.30 },
        { min: 70000,   max: 180000, rate: 0.33 },
        { min: 180000,  max: Infinity, rate: 0.39 },
      ],
    },
    stdDeduction: { 'Individual': 0 },
    accRate: 0.0153, accCap: 142283,   // ACC earners levy
    kiwiSaverRate: 0.03,               // default KiwiSaver employee 3%
    notes: 'No tax-free threshold · ACC Earners Levy 1.53% up to NZ$142,283 · KiwiSaver 3% (optional, shown separately)',
  },
};

/* ─── TAX ENGINE ──────────────────────────────────────────────── */
const calcTax = (gross, country, filing, deductions = 0) => {
  const regime = REGIMES[country];
  if (!regime) return null;
  const brackets = regime.brackets2024[filing] || regime.brackets2024[Object.keys(regime.brackets2024)[0]];
  const stdDed = (regime.stdDeduction?.[filing] || 0) + deductions;
  let taxable = Math.max(0, gross - stdDed);

  // Slab-by-slab tax
  let incomeTax = 0;
  const slabBreakdown = [];
  for (const b of brackets) {
    if (taxable <= b.min) break;
    const taxed = Math.min(taxable, b.max) - b.min;
    const tax   = taxed * b.rate;
    incomeTax  += tax;
    slabBreakdown.push({ min: b.min, max: b.max, rate: b.rate, taxed, tax });
  }

  // Cess (India)
  if (country === 'IN') incomeTax *= (1 + (regime.cess || 0));

  // Japan: surtax 2.1% on income tax
  if (country === 'JP') incomeTax *= (1 + (regime.surtax || 0));

  // Netherlands: apply tax credits
  if (country === 'NL') {
    const krediet = (regime.algemeenKrediet || 0) + (regime.arbeidskorting || 0);
    incomeTax = Math.max(0, incomeTax - krediet);
  }

  // Social contributions
  let socialTax = 0;
  let socialLabel = '';
  if (country === 'US') {
    const ss = Math.min(gross, regime.ssLimit) * regime.ssRate;
    const mc = gross * regime.medicareRate;
    const addMc = gross > 200000 ? (gross - 200000) * 0.009 : 0;
    socialTax = ss + mc + addMc;
    socialLabel = 'FICA (SS + Medicare)';
  } else if (country === 'UK') {
    const niBase = Math.max(0, Math.min(gross, regime.niLimit) - regime.niLower);
    const niHigh = Math.max(0, gross - regime.niLimit);
    socialTax = niBase * regime.niRate + niHigh * 0.02;
    socialLabel = 'National Insurance';
  } else if (country === 'IN') {
    socialTax = Math.min(gross * regime.pfRate, regime.pfLimit);
    socialLabel = 'Employee PF (12%)';
  } else if (country === 'CA') {
    const cpp = Math.min(Math.max(0, gross - regime.cppBasic), regime.cppLimit - regime.cppBasic) * regime.cppRate;
    const ei  = Math.min(gross, regime.eiLimit) * regime.eiRate;
    socialTax = cpp + ei;
    socialLabel = 'CPP + EI';
  } else if (country === 'AU') {
    // Medicare levy 2% above threshold
    const medicare = gross > regime.medicareThreshold ? gross * regime.medicareRate : 0;
    socialTax  = medicare;
    socialLabel = 'Medicare Levy';
  } else if (country === 'DE') {
    // Social contributions ~19.6% capped at BBG (€90,600/yr)
    socialTax  = Math.min(gross, regime.socialCap) * regime.socialRate;
    socialLabel = 'Social Insurance';
  } else if (country === 'UAE') {
    socialTax  = 0;
    socialLabel = 'No Social Tax';
  } else if (country === 'SG') {
    // CPF 20% employee, capped at ordinary wage ceiling
    const owCap = regime.cpfOW * 12;
    const cpfBase = Math.min(gross, owCap);
    socialTax  = cpfBase * regime.cpfRate;
    socialLabel = 'CPF Employee';
  } else if (country === 'NL') {
    // Social insurance already baked into the 36.97% bracket rate — no separate line
    socialTax  = 0;
    socialLabel = 'Incl. in bracket rate';
  } else if (country === 'JP') {
    // Social insurance: pension + health + employment + nursing ~14.82%
    socialTax  = gross * regime.socialRate;
    // Local inhabitant tax ~10% of gross (simplified — actually on prior year income)
    const localTax = gross * regime.localTaxRate;
    socialTax += localTax;
    socialLabel = 'Social + Local Tax';
  } else if (country === 'NZ') {
    // ACC levy 1.53% capped + KiwiSaver 3%
    const acc       = Math.min(gross, regime.accCap) * regime.accRate;
    const kiwiSaver = gross * regime.kiwiSaverRate;
    socialTax  = acc + kiwiSaver;
    socialLabel = 'ACC + KiwiSaver';
  }

  const totalTax  = incomeTax + socialTax;
  const takeHome  = gross - totalTax;
  const effRate   = gross > 0 ? (totalTax / gross) * 100 : 0;
  const margRate  = (() => {
    for (let i = brackets.length - 1; i >= 0; i--) {
      if (taxable > brackets[i].min) return brackets[i].rate * 100;
    }
    return 0;
  })();

  return {
    gross, taxable, incomeTax, socialTax, totalTax, takeHome,
    effRate, margRate, slabBreakdown, socialLabel,
    monthly: takeHome / 12, daily: takeHome / 260, hourly: takeHome / 2080,
  };
};

/* ─── HELPERS ──────────────────────────────────────────────────── */
const fmt = (n, sym = '$') => {
  if (!isFinite(n)) return '—';
  if (sym === '₹') {
    if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`;
    if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`;
    return `₹${Math.round(n).toLocaleString('en-IN')}`;
  }
  if (Math.abs(n) >= 1e6) return `${sym}${(n / 1e6).toFixed(2)}M`;
  return `${sym}${Math.round(n).toLocaleString()}`;
};

const pct = n => `${isFinite(n) ? n.toFixed(1) : '—'}%`;

const TABS = [
  { id: 'breakdown', icon: '◈',  label: 'Breakdown' },
  { id: 'slabs',     icon: '⊞',  label: 'Tax Slabs' },
  { id: 'compare',   icon: '⇄',  label: 'Compare' },
  { id: 'raise',     icon: '↑',  label: 'Raise' },
  { id: 'countries', icon: '🌍', label: 'Countries' },
  { id: 'reverse',   icon: '⚖',  label: 'Gross↔Net' },
  { id: 'history',   icon: '⌛', label: 'History' },
  { id: 'learn',     icon: '∑',  label: 'Learn' },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════ */
export default function SalaryTaxCalculator() {
  const [dark, setDark] = useState(true);
  const [tab,  setTab]  = useState('breakdown');
  const [mob,  setMob]  = useState(false);

  /* Inputs */
  const [gross,      setGross]      = useState(75000);
  const [country,    setCountry]    = useState('US');
  const [filing,     setFiling]     = useState('Single');
  const [deductions, setDeductions] = useState(0);
  const [period,     setPeriod]     = useState('annual'); // annual|monthly|hourly

  /* Compare */
  const [grossB,    setGrossB]    = useState(100000);
  const [countryB,  setCountryB]  = useState('US');
  const [filingB,   setFilingB]   = useState('Single');

  /* Raise */
  const [raiseType,  setRaiseType]  = useState('pct'); // pct|flat
  const [raiseAmt,   setRaiseAmt]   = useState(10);

  /* Reverse */
  const [targetNet, setTargetNet] = useState(60000);

  /* History */
  const [hist, setHist] = useState([]);
  const [copied, setCopied] = useState(false);

  const dk = dark;
  const regime = REGIMES[country];
  const sym = regime?.sym || '$';

  /* Normalise gross to annual */
  const annualGross = useMemo(() => {
    if (period === 'monthly') return gross * 12;
    if (period === 'hourly')  return gross * 2080;
    return gross;
  }, [gross, period]);

  /* Core calc */
  const calc  = useMemo(() => calcTax(annualGross, country, filing, deductions), [annualGross, country, filing, deductions]);
  const calcB = useMemo(() => calcTax(grossB, countryB, filingB, 0), [grossB, countryB, filingB]);

  /* Raise calc */
  const newGross = useMemo(() => {
    if (raiseType === 'pct') return annualGross * (1 + raiseAmt / 100);
    return annualGross + raiseAmt;
  }, [annualGross, raiseType, raiseAmt]);
  const calcRaise = useMemo(() => calcTax(newGross, country, filing, deductions), [newGross, country, filing, deductions]);

  /* Reverse calc: binary search for gross that yields targetNet */
  const reverseGross = useMemo(() => {
    let lo = targetNet, hi = targetNet * 3;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const r = calcTax(mid, country, filing, deductions);
      if (r && r.takeHome < targetNet) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }, [targetNet, country, filing, deductions]);
  const calcReverse = useMemo(() => calcTax(reverseGross, country, filing, deductions), [reverseGross, country, filing, deductions]);

  /* Countries comparison */
  const countryComps = useMemo(() => {
    return Object.keys(REGIMES).map(c => {
      const r = REGIMES[c];
      const f = Object.keys(r.brackets2024)[0];
      const result = calcTax(annualGross, c, f);
      return { code: c, name: r.name, sym: r.sym, filing: f, ...result };
    });
  }, [annualGross]);

  /* Save history */
  const saveHist = useCallback(() => {
    if (!calc) return;
    setHist(h => [{
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      gross: annualGross, country, filing, sym,
      takeHome: calc.takeHome, effRate: calc.effRate,
    }, ...h].slice(0, 20));
  }, [calc, annualGross, country, filing, sym]);

  /* Copy */
  const copyResult = () => {
    if (!calc) return;
    const t = `Gross: ${fmt(annualGross, sym)}\nTake-Home: ${fmt(calc.takeHome, sym)}\nIncome Tax: ${fmt(calc.incomeTax, sym)}\nEff. Rate: ${pct(calc.effRate)}\nMarg. Rate: ${pct(calc.margRate)}`;
    navigator.clipboard.writeText(t).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const sideStats = calc ? [
    { label: 'Take-Home/yr',  val: fmt(calc.takeHome, sym),   color: 'var(--lo)' },
    { label: 'Take-Home/mo',  val: fmt(calc.monthly, sym),    color: 'var(--acc)' },
    { label: 'Income Tax',    val: fmt(calc.incomeTax, sym),  color: 'var(--er)' },
    { label: 'Effective Rate',val: pct(calc.effRate),         color: 'var(--warn)' },
    { label: 'Marginal Rate', val: pct(calc.margRate),        color: 'var(--pur)' },
    { label: 'Social Tax',    val: fmt(calc.socialTax, sym),  color: 'var(--info)' },
  ] : [];

  /* ── DONUT ── */
  const DonutChart = ({ c, s }) => {
    if (!c) return null;
    const r = 80, cx = 110, cy = 110, sw = 22, circ = 2 * Math.PI * r;
    const segs = [
      { val: c.takeHome,   color: '#34d399', label: 'Take-Home' },
      { val: c.incomeTax,  color: '#f87171', label: 'Income Tax' },
      { val: c.socialTax,  color: '#60a5fa', label: s.label || 'Social' },
    ].filter(x => x.val > 0);
    const total = segs.reduce((a, x) => a + x.val, 0) || 1;
    let off = 0;
    return (
      <svg viewBox="0 0 220 220" style={{ width: '100%', maxWidth: 220 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={dk ? 'rgba(245,158,11,.07)' : 'rgba(146,64,14,.08)'} strokeWidth={sw}/>
        {segs.map((seg, i) => {
          const frac = seg.val / total;
          const dash = frac * circ;
          const o = off;
          off += dash;
          return (
            <motion.circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={seg.color} strokeWidth={sw} strokeLinecap="round"
              strokeDashoffset={-o + circ * 0.25}
              initial={{ strokeDasharray: `0 ${circ}` }}
              animate={{ strokeDasharray: `${dash} ${circ - dash}` }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            />
          );
        })}
        <text x={cx} y={cy - 12} textAnchor="middle" fontFamily="'Syne',sans-serif" fontWeight="900" fontSize="20" fill="var(--lo)">
          {fmt(c.takeHome, s.sym)}
        </text>
        <text x={cx} y={cy + 7} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8.5" fill="var(--tx3)" letterSpacing=".1em">TAKE-HOME/YR</text>
        <text x={cx} y={cy + 22} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">
          {fmt(c.monthly, s.sym)}/mo
        </text>
      </svg>
    );
  };

  /* ── SLAB BAR CHART ── */
  const SlabChart = ({ c, brackets, s }) => {
    if (!c || !brackets) return null;
    const W = 460, H = 200, pad = { t: 16, r: 16, b: 36, l: 52 };
    const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
    const maxTax = Math.max(...(c.slabBreakdown.map(s => s.tax)), 1);
    const colors = ['#34d399','#f59e0b','#fb923c','#f87171','#e879f9','#c084fc','#60a5fa'];
    const bars = c.slabBreakdown.filter(s => s.taxed > 0);
    const bW = bars.length > 0 ? (iW / bars.length) * 0.6 : 40;
    const bGap = bars.length > 0 ? iW / bars.length : 60;
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {[0,.25,.5,.75,1].map((f,i) => {
          const y = pad.t + iH * f;
          return (
            <g key={i}>
              <line x1={pad.l} y1={y} x2={W-pad.r} y2={y} stroke={dk?'rgba(245,158,11,.06)':'rgba(146,64,14,.07)'} strokeWidth="1"/>
              <text x={pad.l-5} y={y+3} textAnchor="end" fontFamily="'DM Mono',monospace" fontSize="7.5" fill="var(--tx3)">{fmt(maxTax*(1-f),s.sym)}</text>
            </g>
          );
        })}
        {bars.map((b, i) => {
          const bH = (b.tax / maxTax) * iH;
          const x  = pad.l + i * bGap + (bGap - bW) / 2;
          const y  = pad.t + iH - bH;
          return (
            <g key={i}>
              <motion.rect x={x} y={y} width={bW} height={bH} fill={colors[i % colors.length]} rx="3" opacity={.85}
                initial={{ height: 0, y: pad.t + iH }} animate={{ height: bH, y }} transition={{ duration: 0.5, delay: i * 0.08 }}/>
              <text x={x+bW/2} y={pad.t+iH+14} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8" fill={colors[i%colors.length]}>
                {(b.rate*100).toFixed(0)}%
              </text>
              <text x={x+bW/2} y={pad.t+iH+24} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="7" fill="var(--tx3)">
                {fmt(b.tax,s.sym)}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  /* ── RENDER ── */
  return (
    <>
      <style>{S}</style>
      <div className={dk ? 'dk' : 'lt'}>
        <div className={`mob-overlay ${mob?'show':''}`} onClick={() => setMob(false)}/>

        {/* ════ TOPBAR ════ */}
        <div className="topbar">
          <button className="btn-ghost mob-btn" onClick={() => setMob(s => !s)} style={{ padding:'5px 8px',fontSize:14 }}>☰</button>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <div style={{ width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',
              borderRadius:dk?4:9, background:dk?'rgba(245,158,11,.1)':'linear-gradient(135deg,#92400e,#b45309)',
              border:dk?'1px solid rgba(245,158,11,.35)':'none',
              boxShadow:dk?'0 0 16px rgba(245,158,11,.25)':'0 3px 10px rgba(146,64,14,.4)' }}>
              <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:13,color:dk?'#f59e0b':'#fff' }}>$</span>
            </div>
            <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:16,letterSpacing:'-.01em',color:'var(--tx)' }}>
              SALARY<span style={{ color:'var(--acc)' }}>.tax</span>
              <span style={{ fontFamily:"'DM Mono',monospace",fontWeight:400,fontSize:8,letterSpacing:'.15em',color:'var(--tx3)',marginLeft:7,verticalAlign:'middle' }}>v1</span>
            </span>
          </div>
          <div style={{ flex:1 }}/>
          {/* Country selector */}
          <select className="sel" value={country} onChange={e => { setCountry(e.target.value); setFiling(Object.keys(REGIMES[e.target.value].brackets2024)[0]); }}
            style={{ width:110,padding:'3px 8px',fontSize:10 }}>
            {Object.entries(REGIMES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
          </select>
          <button className="btn-ghost" onClick={copyResult} style={{ padding:'5px 10px',fontSize:10 }}>{copied ? '✓' : '⎘'}</button>
          <button className="btn-ghost" onClick={() => setDark(d => !d)} style={{ padding:'5px 10px',fontSize:13 }}>{dk ? '☀' : '◑'}</button>
        </div>

        {/* ════ TABBAR ════ */}
        <div className="tabbar">
          {TABS.map(t => (
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* ════ BODY ════ */}
        <div className="body">
          {/* ── SIDEBAR ── */}
          <div className={`sidebar ${mob?'mob':''}`}>
            <div className="sec-lbl">Quick Stats</div>
            {sideStats.map((s, i) => (
              <div key={i} className="scard">
                <div className="lbl" style={{ margin:0 }}>{s.label}</div>
                <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:15,color:s.color }}>{s.val}</div>
              </div>
            ))}
            
            {/* Regime presets */}
            <div className="sec-lbl" style={{ marginTop:4 }}>Salary Presets</div>
            {[50000,75000,100000,150000,200000].map(g => (
              <button key={g} className="btn-ghost" style={{ justifyContent:'flex-start',fontSize:9 }}
                onClick={() => { setGross(g); setPeriod('annual'); }}>
                {fmt(g, sym)}
              </button>
            ))}
            
          </div>

          {/* ── MAIN ── */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══════════ BREAKDOWN TAB ══════════ */}
              {tab==='breakdown' && (
                <motion.div key="brk" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>

                  

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }} className="g2">
                    {/* Input panel */}
                    <div className="panel" style={{ padding:'20px 22px',display:'flex',flexDirection:'column',gap:14 }}>
                      <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:'var(--tx)',letterSpacing:'.06em' }}>SALARY DETAILS</div>

                      {/* Period toggle */}
                      <div>
                        <div className="lbl">Pay Period</div>
                        <div style={{ display:'flex',gap:6 }}>
                          {[['annual','Annual'],['monthly','Monthly'],['hourly','Hourly']].map(([v,l]) => (
                            <button key={v} className={`btn-ghost ${period===v?'on':''}`} onClick={() => setPeriod(v)}>{l}</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="lbl">
                          {period==='annual'?'Annual Salary':period==='monthly'?'Monthly Salary':'Hourly Rate'}
                        </div>
                        <div style={{ position:'relative' }}>
                          <span style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',
                            fontFamily:"'DM Mono',monospace",fontSize:12,color:'var(--tx3)' }}>{sym}</span>
                          <input className="inp" type="number" value={gross} onChange={e => setGross(+e.target.value)} min={0}
                            style={{ paddingLeft:26 }}/>
                        </div>
                        <input className="rng" type="range" min={0}
                          max={period==='annual'?500000:period==='monthly'?42000:250}
                          step={period==='annual'?1000:period==='monthly'?100:1}
                          value={gross} onChange={e => setGross(+e.target.value)}/>
                        {period !== 'annual' && (
                          <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)',marginTop:4 }}>
                            = {fmt(annualGross, sym)} / year
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="lbl">Filing Status</div>
                        <select className="sel" value={filing} onChange={e => setFiling(e.target.value)}>
                          {(regime?.filing || []).map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>

                      <div>
                        <div className="lbl">Extra Deductions / Allowances</div>
                        <div style={{ position:'relative' }}>
                          <span style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',
                            fontFamily:"'DM Mono',monospace",fontSize:12,color:'var(--tx3)' }}>{sym}</span>
                          <input className="inp" type="number" value={deductions} onChange={e => setDeductions(+e.target.value)} min={0}
                            style={{ paddingLeft:26 }}/>
                        </div>
                      </div>

                      <button className="btn-pri" onClick={saveHist} style={{ alignSelf:'flex-start' }}>⊕ Save to History</button>

                      {regime?.notes && (
                        <div className="hint" style={{ fontSize:11 }}><span>ℹ</span><span>{regime.notes}</span></div>
                      )}
                    </div>

                    {/* Donut + key stats */}
                    <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                      <div className="panel-hi" style={{ padding:20,display:'flex',flexDirection:'column',alignItems:'center',gap:14 }}>
                        <DonutChart c={calc} s={regime}/>
                        {/* Legend */}
                        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,width:'100%' }}>
                          {[
                            { color:'#34d399', label:'Take-Home', val: calc?.takeHome },
                            { color:'#f87171', label:'Income Tax', val: calc?.incomeTax },
                            { color:'#60a5fa', label: calc?.socialLabel || 'Social', val: calc?.socialTax },
                          ].filter(x => x.val > 0).map((s, i) => (
                            <div key={i} style={{ display:'flex',alignItems:'center',gap:6 }}>
                              <div style={{ width:8,height:8,borderRadius:2,background:s.color,flexShrink:0 }}/>
                              <div>
                                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:8,color:'var(--tx3)',letterSpacing:'.07em' }}>{s.label}</div>
                                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--tx2)' }}>{fmt(s.val, sym)}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Rate + hourly/daily */}
                      <div className="panel" style={{ padding:'16px 18px' }}>
                        {calc && [
                          { label:'Effective Tax Rate',val:pct(calc.effRate),   color:'var(--warn)' },
                          { label:'Marginal Tax Rate', val:pct(calc.margRate),  color:'var(--pur)' },
                          { label:'Taxable Income',    val:fmt(calc.taxable,sym),color:'var(--info)' },
                          { label:'Per Day (260 days)',val:fmt(calc.daily,sym), color:'var(--lo)' },
                          { label:'Per Hour (2080hr)', val:fmt(calc.hourly,sym),color:'var(--acc)' },
                        ].map((s,i) => (
                          <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',
                            padding:'7px 0',borderBottom:i<4?'1px solid var(--bdr)':'none' }}>
                            <span style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--tx3)',letterSpacing:'.07em' }}>{s.label}</span>
                            <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:s.color }}>{s.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Monthly breakdown table */}
                  {calc && (
                    <div className="panel" style={{ padding:'18px 20px' }}>
                      <div className="lbl" style={{ marginBottom:12 }}>Monthly Budget Breakdown</div>
                      <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10 }}>
                        {[
                          { label:'Gross/Month',   val:fmt(annualGross/12,sym),  color:'var(--tx)' },
                          { label:'Tax/Month',     val:fmt(calc.incomeTax/12,sym),color:'var(--er)' },
                          { label:'Social/Month',  val:fmt(calc.socialTax/12,sym),color:'var(--info)' },
                          { label:'Net/Month',     val:fmt(calc.monthly,sym),    color:'var(--lo)' },
                        ].map((s,i) => (
                          <div key={i} className="scard" style={{ textAlign:'center' }}>
                            <div className="lbl" style={{ margin:0,textAlign:'center' }}>{s.label}</div>
                            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:17,color:s.color }}>{s.val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ══════════ TAX SLABS TAB ══════════ */}
              {tab==='slabs' && (
                <motion.div key="slb" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>⊞</span><span>Tax is calculated progressively — only income within each bracket is taxed at that rate. The chart shows how much tax you pay in each slab.</span></div>

                  {calc && (
                    <>
                      <div className="panel" style={{ padding:'16px 18px' }}>
                        <div className="lbl" style={{ marginBottom:10 }}>Tax Per Bracket — {fmt(annualGross,sym)} gross</div>
                        <SlabChart c={calc} brackets={regime?.brackets2024?.[filing]} s={regime}/>
                      </div>

                      {/* Slab table */}
                      <div className="panel" style={{ padding:'18px 20px' }}>
                        <div className="lbl" style={{ marginBottom:12 }}>Bracket Detail</div>
                        {calc.slabBreakdown.filter(s => s.taxed > 0).map((b, i) => {
                          const colors = ['#34d399','#f59e0b','#fb923c','#f87171','#e879f9','#c084fc','#60a5fa'];
                          const col = colors[i % colors.length];
                          const pctBar = (b.taxed / annualGross) * 100;
                          return (
                            <div key={i} className="slab-row">
                              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:col,fontWeight:500 }}>
                                {(b.rate*100).toFixed(0)}% bracket
                              </div>
                              <div style={{ display:'flex',flexDirection:'column',gap:3 }}>
                                <div style={{ height:5,background:'var(--bdr)',borderRadius:3,overflow:'hidden' }}>
                                  <motion.div style={{ height:'100%',borderRadius:3,background:col }}
                                    initial={{ width:0 }} animate={{ width:`${pctBar}%` }} transition={{ duration:0.5,delay:i*.06 }}/>
                                </div>
                                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:8.5,color:'var(--tx3)' }}>
                                  {fmt(b.min,sym)} – {b.max===Infinity?'∞':fmt(b.max,sym)} · income in bracket: {fmt(b.taxed,sym)}
                                </div>
                              </div>
                              <div style={{ textAlign:'right',fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:col,flexShrink:0 }}>
                                {fmt(b.tax,sym)}
                              </div>
                            </div>
                          );
                        })}
                        {/* Total row */}
                        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:12,marginTop:4,borderTop:'1px solid var(--bdr)' }}>
                          <span style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--tx3)',letterSpacing:'.1em' }}>TOTAL INCOME TAX</span>
                          <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,color:'var(--er)' }}>{fmt(calc.incomeTax,sym)}</span>
                        </div>
                        {calc.socialTax > 0 && (
                          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',paddingTop:8 }}>
                            <span style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--tx3)',letterSpacing:'.1em' }}>
                              {calc.socialLabel?.toUpperCase() || 'SOCIAL TAX'}
                            </span>
                            <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,color:'var(--info)' }}>{fmt(calc.socialTax,sym)}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  
                </motion.div>
              )}

              {/* ══════════ COMPARE TAB ══════════ */}
              {tab==='compare' && (
                <motion.div key="cmp" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>⇄</span><span>Compare two salaries or filing statuses. Salary A uses the inputs from the Breakdown tab.</span></div>

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }} className="g2">
                    {/* Salary A summary */}
                    <div className="panel" style={{ padding:'18px 20px',borderTop:`3px solid var(--acc)` }}>
                      <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:'var(--acc)',marginBottom:12 }}>Salary A</div>
                      <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--tx3)',marginBottom:8 }}>
                        {fmt(annualGross,sym)} · {filing} · {regime.name}
                      </div>
                      {calc && [
                        { label:'Take-Home/yr', val:fmt(calc.takeHome,sym),  color:'var(--lo)' },
                        { label:'Income Tax',   val:fmt(calc.incomeTax,sym), color:'var(--er)' },
                        { label:'Eff. Rate',    val:pct(calc.effRate),       color:'var(--warn)' },
                        { label:'Marg. Rate',   val:pct(calc.margRate),      color:'var(--pur)' },
                      ].map((s,i) => (
                        <div key={i} style={{ display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--bdr)' }}>
                          <span style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--tx3)' }}>{s.label}</span>
                          <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:s.color }}>{s.val}</span>
                        </div>
                      ))}
                    </div>

                    {/* Salary B config */}
                    <div className="panel" style={{ padding:'18px 20px',borderTop:`3px solid var(--info)` }}>
                      <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:'var(--info)',marginBottom:12 }}>Salary B</div>
                      <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                        <div>
                          <div className="lbl">Country</div>
                          <select className="sel" value={countryB} onChange={e => { setCountryB(e.target.value); setFilingB(Object.keys(REGIMES[e.target.value].brackets2024)[0]); }}>
                            {Object.entries(REGIMES).map(([k,v]) => <option key={k} value={k}>{v.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <div className="lbl">Annual Gross</div>
                          <input className="inp" type="number" value={grossB} onChange={e => setGrossB(+e.target.value)} min={0}/>
                        </div>
                        <div>
                          <div className="lbl">Filing Status</div>
                          <select className="sel" value={filingB} onChange={e => setFilingB(e.target.value)}>
                            {(REGIMES[countryB]?.filing || []).map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                        {calcB && [
                          { label:'Take-Home/yr', val:fmt(calcB.takeHome, REGIMES[countryB].sym), color:'var(--lo)' },
                          { label:'Income Tax',   val:fmt(calcB.incomeTax, REGIMES[countryB].sym), color:'var(--er)' },
                          { label:'Eff. Rate',    val:pct(calcB.effRate),  color:'var(--warn)' },
                        ].map((s,i) => (
                          <div key={i} style={{ display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--bdr)' }}>
                            <span style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--tx3)' }}>{s.label}</span>
                            <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:s.color }}>{s.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Delta analysis */}
                  {calc && calcB && (
                    <div className="panel-hi" style={{ padding:'18px 20px' }}>
                      <div className="lbl" style={{ marginBottom:12 }}>Δ Difference (A vs B in same currency terms)</div>
                      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12 }}>
                        {[
                          { label:'Gross Difference',    val: annualGross - grossB,     sym },
                          { label:'Take-Home Diff',      val: calc.takeHome - calcB.takeHome * (annualGross/grossB||1), sym },
                          { label:'Eff. Rate Diff',      val: null, txt: `${pct(calc.effRate)} vs ${pct(calcB.effRate)}` },
                        ].map((s,i) => (
                          <div key={i} className="scard">
                            <div className="lbl" style={{ margin:0 }}>{s.label}</div>
                            {s.txt
                              ? <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:'var(--warn)' }}>{s.txt}</div>
                              : <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:17, color: s.val >= 0 ? 'var(--lo)' : 'var(--er)' }}>
                                  {s.val >= 0 ? '+' : ''}{fmt(s.val, s.sym)}
                                </div>
                            }
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ══════════ RAISE TAB ══════════ */}
              {tab==='raise' && (
                <motion.div key="ris" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>↑</span><span>Simulate a pay raise to see exactly how much extra take-home you'd actually receive after tax.</span></div>

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }} className="g2">
                    <div className="panel" style={{ padding:'20px 22px',display:'flex',flexDirection:'column',gap:14 }}>
                      <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:'var(--tx)',letterSpacing:'.06em' }}>RAISE SIMULATOR</div>
                      <div>
                        <div className="lbl">Raise Type</div>
                        <div style={{ display:'flex',gap:6 }}>
                          {[['pct','Percentage'],['flat','Fixed Amount']].map(([v,l]) => (
                            <button key={v} className={`btn-ghost ${raiseType===v?'on':''}`} onClick={() => setRaiseType(v)}>{l}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="lbl">{raiseType==='pct' ? `Raise % — ${raiseAmt}%` : `Raise Amount — ${fmt(raiseAmt, sym)}`}</div>
                        <input className="inp" type="number" value={raiseAmt} onChange={e => setRaiseAmt(+e.target.value)} min={0}
                          step={raiseType==='pct'?0.5:1000}/>
                        <input className="rng" type="range"
                          min={raiseType==='pct'?0:0}
                          max={raiseType==='pct'?100:100000}
                          step={raiseType==='pct'?0.5:1000}
                          value={raiseAmt} onChange={e => setRaiseAmt(+e.target.value)}/>
                      </div>
                      <div className="hint" style={{ fontSize:11 }}>
                        <span>💡</span>
                        <span>Current: <strong style={{ color:'var(--acc)' }}>{fmt(annualGross,sym)}</strong> → New: <strong style={{ color:'var(--lo)' }}>{fmt(newGross,sym)}</strong></span>
                      </div>
                    </div>

                    <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                      {calc && calcRaise && [
                        { label:'New Gross',          curr: fmt(annualGross,sym),   after: fmt(newGross,sym),                    gain: newGross-annualGross,         col:'var(--acc)' },
                        { label:'New Take-Home/yr',   curr: fmt(calc.takeHome,sym), after: fmt(calcRaise.takeHome,sym),          gain: calcRaise.takeHome-calc.takeHome, col:'var(--lo)' },
                        { label:'New Take-Home/mo',   curr: fmt(calc.monthly,sym),  after: fmt(calcRaise.monthly,sym),           gain: calcRaise.monthly-calc.monthly,   col:'var(--lo)' },
                        { label:'New Income Tax',     curr: fmt(calc.incomeTax,sym),after: fmt(calcRaise.incomeTax,sym),        gain: calcRaise.incomeTax-calc.incomeTax,col:'var(--er)' },
                        { label:'New Eff. Rate',      curr: pct(calc.effRate),      after: pct(calcRaise.effRate),              gain: null,                              col:'var(--warn)' },
                      ].map((s,i) => (
                        <motion.div key={i} className="panel" style={{ padding:'12px 16px' }}
                          initial={{ opacity:0,x:10 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*.07 }}>
                          <div className="lbl" style={{ margin:'0 0 6px' }}>{s.label}</div>
                          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                            <div>
                              <span style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--tx3)' }}>{s.curr}</span>
                              <span style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--tx3)',margin:'0 8px' }}>→</span>
                              <span style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:s.col }}>{s.after}</span>
                            </div>
                            {s.gain !== null && (
                              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,
                                color: s.gain >= 0 ? 'var(--lo)' : 'var(--er)',
                                background: s.gain >= 0 ? 'rgba(52,211,153,.1)' : 'rgba(248,113,113,.1)',
                                padding:'2px 8px',borderRadius:3 }}>
                                {s.gain >= 0 ? '+' : ''}{fmt(s.gain,sym)}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {calc && calcRaise && (
                    <div className="hint">
                      <span>📊</span>
                      <span>
                        A <strong style={{ color:'var(--acc)' }}>{raiseType==='pct'?`${raiseAmt}%`:fmt(raiseAmt,sym)}</strong> raise increases gross by <strong style={{ color:'var(--acc)' }}>{fmt(newGross-annualGross,sym)}</strong> but only adds <strong style={{ color:'var(--lo)' }}>{fmt(calcRaise.takeHome-calc.takeHome,sym)}</strong> to take-home due to marginal tax of <strong style={{ color:'var(--warn)' }}>{pct(calcRaise.margRate)}</strong>.
                      </span>
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ══════════ COUNTRIES TAB ══════════ */}
              {tab==='countries' && (
                <motion.div key="ctr" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>🌍</span><span>Compare how the same gross salary ({fmt(annualGross,'$')} in local currency) is taxed across 4 countries. Each uses the standard/default filing status.</span></div>

                  <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12 }}>
                    {countryComps.map((c, i) => {
                      const colors = ['var(--acc)','var(--info)','var(--lo)','var(--pur)'];
                      return (
                        <motion.div key={c.code} className="panel" style={{ padding:'18px 20px',borderTop:`3px solid ${colors[i]}` }}
                          initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*.08 }}>
                          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12 }}>
                            <div>
                              <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14,color:colors[i] }}>{c.name}</div>
                              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)',marginTop:2 }}>{c.filing} · {c.code}</div>
                            </div>
                            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:'var(--lo)' }}>
                              {fmt(c.takeHome, c.sym)}
                            </div>
                          </div>
                          {/* Take-home bar */}
                          <div style={{ height:6,background:'var(--bdr)',borderRadius:3,overflow:'hidden',marginBottom:10 }}>
                            <motion.div style={{ height:'100%',borderRadius:3,background:colors[i] }}
                              initial={{ width:0 }}
                              animate={{ width:`${c.gross>0?(c.takeHome/c.gross)*100:0}%` }}
                              transition={{ duration:0.7,delay:i*.1 }}/>
                          </div>
                          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8 }}>
                            {[
                              { label:'Income Tax',  val:fmt(c.incomeTax,c.sym) },
                              { label:'Social Tax',  val:fmt(c.socialTax,c.sym) },
                              { label:'Eff. Rate',   val:pct(c.effRate) },
                              { label:'Marg. Rate',  val:pct(c.margRate) },
                            ].map((s,j) => (
                              <div key={j}>
                                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:8,color:'var(--tx3)',letterSpacing:'.1em',textTransform:'uppercase' }}>{s.label}</div>
                                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:12,color:'var(--tx2)',marginTop:2 }}>{s.val}</div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ REVERSE TAB ══════════ */}
              {tab==='reverse' && (
                <motion.div key="rev" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>⚖</span><span>Enter your desired take-home salary and we'll calculate the gross salary you need to ask for — accounting for your tax regime and deductions.</span></div>

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }} className="g2">
                    <div className="panel" style={{ padding:'20px 22px',display:'flex',flexDirection:'column',gap:14 }}>
                      <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:13,color:'var(--tx)',letterSpacing:'.06em' }}>TARGET NET SALARY</div>
                      <div>
                        <div className="lbl">Desired Annual Take-Home</div>
                        <div style={{ position:'relative' }}>
                          <span style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',
                            fontFamily:"'DM Mono',monospace",fontSize:12,color:'var(--tx3)' }}>{sym}</span>
                          <input className="inp" type="number" value={targetNet} onChange={e => setTargetNet(+e.target.value)} min={0}
                            style={{ paddingLeft:26 }}/>
                        </div>
                        <input className="rng" type="range" min={10000} max={500000} step={1000}
                          value={targetNet} onChange={e => setTargetNet(+e.target.value)}/>
                      </div>
                      <div className="hint" style={{ fontSize:11 }}>
                        <span>ℹ</span><span>Uses current country ({regime.name}), filing ({filing}), and deductions ({fmt(deductions,sym)}) from the Breakdown tab.</span>
                      </div>
                    </div>

                    <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                      {calcReverse && [
                        { label:'Required Gross/yr',  val:fmt(reverseGross,sym),       color:'var(--acc)',  big:true },
                        { label:'Required Gross/mo',  val:fmt(reverseGross/12,sym),    color:'var(--acc)' },
                        { label:'Total Tax to Pay',   val:fmt(calcReverse.totalTax,sym),color:'var(--er)' },
                        { label:'Income Tax',         val:fmt(calcReverse.incomeTax,sym),color:'var(--er)' },
                        { label:'Social Tax',         val:fmt(calcReverse.socialTax,sym),color:'var(--info)' },
                        { label:'Effective Rate',     val:pct(calcReverse.effRate),    color:'var(--warn)' },
                      ].map((s,i) => (
                        <motion.div key={i} className={s.big?'panel-hi':'panel'} style={{ padding:'12px 16px' }}
                          initial={{ opacity:0,x:10 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*.07 }}>
                          <div className="lbl" style={{ margin:0 }}>{s.label}</div>
                          <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:s.big?26:17,color:s.color,marginTop:4 }}>{s.val}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ HISTORY TAB ══════════ */}
              {tab==='history' && (
                <motion.div key="hst" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:9 }}>
                  <div className="hint"><span>⌛</span><span>Saved calculations. Click any row to restore those inputs to the Breakdown tab.</span></div>
                  {hist.length === 0
                    ? <div style={{ textAlign:'center',padding:'64px 24px',fontFamily:"'DM Mono',monospace",fontSize:13,color:'var(--tx3)' }}>
                        No saved calculations yet — press ⊕ Save in the ◈ Breakdown tab.
                      </div>
                    : hist.map((h, i) => (
                        <motion.div key={h.id} className="hist-row"
                          initial={{ opacity:0,x:-6 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*.03 }}
                          onClick={() => { setGross(h.gross); setCountry(h.country); setFiling(h.filing); setPeriod('annual'); setTab('breakdown'); }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--tx2)',marginBottom:2 }}>
                              {fmt(h.gross, h.sym)} · {h.filing} · {REGIMES[h.country]?.name || h.country}
                            </div>
                            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)' }}>{h.time}</div>
                          </div>
                          <div style={{ textAlign:'right' }}>
                            <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,color:'var(--lo)' }}>{fmt(h.takeHome, h.sym)}/yr</div>
                            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)' }}>eff. {pct(h.effRate)}</div>
                          </div>
                        </motion.div>
                      ))
                  }
                  {hist.length > 0 && (
                    <button className="btn-ghost" onClick={() => setHist([])} style={{ alignSelf:'flex-start',marginTop:4 }}>✕ Clear History</button>
                  )}
                  
                </motion.div>
              )}

              {/* ══════════ LEARN TAB ══════════ */}
              {tab==='learn' && (
                <motion.div key="lrn" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}>
                  <div className="panel" style={{ padding:'26px 30px',marginBottom:14 }}>
                    <div style={{ fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26,color:'var(--tx)',letterSpacing:'-.01em',marginBottom:4 }}>
                      Salary & Tax Guide
                    </div>
                    <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--tx3)',marginBottom:26,letterSpacing:'.1em' }}>
                      TAX BASICS · GLOSSARY · TIPS · FAQ
                    </div>
                    <div className="prose">
                      <h3>How Progressive Tax Works</h3>
                      <p>Tax systems are <strong>progressive</strong> — you don't pay your top bracket rate on all income. Each dollar is only taxed at the rate of the bracket it falls in. For example, if you earn $100,000 (US, Single), you pay 10% on the first $11,600, 12% on the next $35,550, and 22% on the rest — not 22% on everything. This is the difference between your <strong>effective rate</strong> (total tax ÷ gross) and your <strong>marginal rate</strong> (rate on the last dollar earned).</p>
                      <h3>Key Terms</h3>
                      <p><strong>Gross Salary</strong> — Your total income before any deductions or taxes. <strong>Net / Take-Home</strong> — What you actually receive after all deductions. <strong>Effective Tax Rate</strong> — Total tax ÷ gross income. <strong>Marginal Tax Rate</strong> — The rate applied to your last dollar of income — relevant when evaluating a raise. <strong>Taxable Income</strong> — Gross minus deductions and allowances — the amount actually subjected to the tax brackets. <strong>Standard Deduction</strong> — A fixed amount you can subtract from income without itemizing (US: $14,600 for Single filers in 2024).</p>
                      <h3>How a Raise Is Actually Taxed</h3>
                      <p>A raise is taxed at your <strong>marginal rate</strong>, not your effective rate. If you're in the 22% bracket and get a $10,000 raise, you keep roughly $7,800 (not the full $10,000, but not reduced by your full effective rate either). The Raise tab calculates this precisely.</p>
                      <h3>India: New vs Old Regime</h3>
                      <p>Since FY 2023–24, India's <strong>New Regime</strong> is the default: lower rates with a ₹75,000 standard deduction but no other exemptions. The <strong>Old Regime</strong> allows Section 80C (₹1.5L), HRA, LTA, and other deductions — beneficial for those with significant investments and allowances.</p>
                      {[
                        { q:'What\'s the difference between FICA and income tax?', a:'In the US, FICA (Federal Insurance Contributions Act) covers Social Security (6.2%) and Medicare (1.45%). These are separate from federal income tax and have their own rules — Social Security has a wage cap ($168,600 in 2024), Medicare does not.' },
                        { q:'Does moving to a higher bracket mean less take-home?', a:'No — this is a common myth. Moving to a higher bracket only means the income above the bracket threshold is taxed at the higher rate. Your income in lower brackets is still taxed at lower rates. You always take home more after a raise.' },
                        { q:'How accurate are these calculations?', a:'These calculations use 2024 tax brackets for federal/national taxes only. They do not include state/provincial income taxes, local taxes, pension contributions beyond what\'s noted, or phase-outs of deductions. Use them for planning estimates, not for filing.' },
                      ].map(({ q, a }, i) => (
                        <div key={i} className="qa">
                          <div style={{ fontSize:12.5,fontWeight:700,fontFamily:"'DM Mono',monospace",color:'var(--tx)',marginBottom:5 }}>{q}</div>
                          <div style={{ fontSize:13,color:'var(--tx2)',lineHeight:1.78 }}>{a}</div>
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