import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   MORTGAGE.calc — Full-featured Mortgage Calculator
   Dark Terminal Amber / Light Cream Ink  ·  QR.forge design system
   ─────────────────────────────────────────────────────────────────
   TABS:
   ◈ Payment      — Monthly breakdown, animated donut, hero result
   ⊞ Amortization — Full schedule + stacked SVG area chart
   ⇄ Compare      — 3 loan scenarios side-by-side bar chart
   ↑ Prepayment   — Extra payment savings + balance timeline
   ⚖ Affordability— Income → max home price, DTI gauge
   🏠 Rent vs Buy  — Break-even crossover SVG chart
   ⌛ History      — Auto-logged calculations with recall
   ∑ Learn        — Guide, glossary, FAQ
═══════════════════════════════════════════════════════════════════ */

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
.dk .btn-pri:hover{background:#fbbf24;box-shadow:0 0 28px rgba(245,158,11,.5);}
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
.sel{width:100%;padding:8px 11px;font-family:'DM Mono',monospace;font-size:12px;outline:none;cursor:pointer;transition:all .13s;appearance:none;}
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
.rng{width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;appearance:none;}
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
.amort-tbl{width:100%;border-collapse:collapse;font-family:'DM Mono',monospace;font-size:10.5px;}
.amort-tbl th{padding:7px 10px;text-align:right;letter-spacing:.08em;font-size:9px;text-transform:uppercase;position:sticky;top:0;z-index:2;}
.dk .amort-tbl th{color:rgba(245,158,11,.5);background:var(--s2);border-bottom:1px solid var(--bdr);}
.lt .amort-tbl th{color:var(--acc);background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.amort-tbl td{padding:6px 10px;text-align:right;border-bottom:1px solid transparent;}
.dk .amort-tbl tr:hover td{background:rgba(245,158,11,.03);}
.lt .amort-tbl tr:hover td{background:rgba(146,64,14,.03);}
.dk .amort-tbl td{border-bottom-color:rgba(245,158,11,.04);color:var(--tx2);}
.lt .amort-tbl td{border-bottom-color:rgba(146,64,14,.05);color:var(--tx2);}
.amort-tbl td:first-child,.amort-tbl th:first-child{text-align:left;}
.tbl-wrap{max-height:400px;overflow-y:auto;border-radius:4px;}
.dk .tbl-wrap{border:1px solid var(--bdr);}
.lt .tbl-wrap{border:1.5px solid var(--bdr);border-radius:10px;}
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
@media(max-width:540px){.g2c{grid-template-columns:1fr!important;}}
`;

/* ─── CURRENCIES ─────────────────────────────────────────────── */
const CURRENCIES = [
  { code:'USD', sym:'$',  name:'US Dollar' },
  { code:'INR', sym:'₹',  name:'Indian Rupee' },
  { code:'GBP', sym:'£',  name:'British Pound' },
  { code:'EUR', sym:'€',  name:'Euro' },
  { code:'JPY', sym:'¥',  name:'Japanese Yen' },
  { code:'AUD', sym:'A$', name:'Australian Dollar' },
];

/* ─── HELPERS ─────────────────────────────────────────────────── */
const fmtINR = (n) => {
  if (n >= 1e7) return `${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `${(n / 1e5).toFixed(2)} L`;
  return n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

const fmtMoney = (n, cur) => {
  if (cur === 'INR') return `₹${fmtINR(n)}`;
  const sym = CURRENCIES.find(c => c.code === cur)?.sym || '$';
  if (Math.abs(n) >= 1e9) return `${sym}${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `${sym}${(n / 1e6).toFixed(2)}M`;
  return `${sym}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const fmtFull = (n, cur) => {
  const sym = CURRENCIES.find(c => c.code === cur)?.sym || '$';
  if (cur === 'INR') return `₹${fmtINR(n)}`;
  return `${sym}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

/* Core mortgage math */
const calcMortgage = ({ price, down, rate, years, tax = 0, insurance = 0, pmi = 0 }) => {
  const principal = price - down;
  const monthlyRate = rate / 100 / 12;
  const n = years * 12;
  let emi;
  if (monthlyRate === 0) {
    emi = principal / n;
  } else {
    emi = principal * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1);
  }
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;
  const monthlyTax = tax / 12;
  const monthlyIns = insurance / 12;
  const monthlyPMI = pmi / 12;
  const totalMonthly = emi + monthlyTax + monthlyIns + monthlyPMI;
  return { emi, totalPayment, totalInterest, principal, totalMonthly, monthlyTax, monthlyIns, monthlyPMI };
};

/* Amortization schedule */
const buildSchedule = ({ price, down, rate, years }) => {
  const principal = price - down;
  const monthlyRate = rate / 100 / 12;
  const n = years * 12;
  let balance = principal;
  const rows = [];
  let emi;
  if (monthlyRate === 0) {
    emi = principal / n;
  } else {
    emi = principal * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1);
  }
  for (let i = 1; i <= n; i++) {
    const interest = balance * monthlyRate;
    const principalPaid = emi - interest;
    balance = Math.max(0, balance - principalPaid);
    rows.push({ month: i, emi, interest, principalPaid, balance });
  }
  return rows;
};

/* Schedule with prepayment */
const buildSchedulePrepay = ({ price, down, rate, years, extraMonthly = 0, lumpSum = 0, lumpMonth = 12 }) => {
  const principal = price - down;
  const monthlyRate = rate / 100 / 12;
  const n = years * 12;
  let balance = principal;
  const rows = [];
  let emi;
  if (monthlyRate === 0) { emi = principal / n; }
  else { emi = principal * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1); }
  for (let i = 1; i <= n && balance > 0.01; i++) {
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(emi - interest + extraMonthly, balance);
    balance = Math.max(0, balance - principalPaid);
    if (i === lumpMonth && lumpSum > 0) balance = Math.max(0, balance - lumpSum);
    rows.push({ month: i, emi, interest, principalPaid, balance });
  }
  return rows;
};

const TABS = [
  { id: 'payment',      icon: '◈',  label: 'Payment' },
  { id: 'amortization', icon: '⊞',  label: 'Amortization' },
  { id: 'compare',      icon: '⇄',  label: 'Compare' },
  { id: 'prepayment',   icon: '↑',  label: 'Prepayment' },
  { id: 'afford',       icon: '⚖',  label: 'Affordability' },
  { id: 'rentvbuy',     icon: '🏠', label: 'Rent vs Buy' },
  { id: 'history',      icon: '⌛', label: 'History' },
  { id: 'learn',        icon: '∑',  label: 'Learn' },
];

const PRESETS = [
  { label: 'Starter Home',  price: 300000,  down: 60000,  rate: 6.8, years: 30 },
  { label: 'Mid Range',     price: 600000,  down: 120000, rate: 7.0, years: 30 },
  { label: 'Luxury',        price: 1200000, down: 240000, rate: 7.2, years: 30 },
  { label: '15-Year',       price: 400000,  down: 80000,  rate: 6.5, years: 15 },
  { label: 'INR Home Loan', price: 6000000, down: 1200000, rate: 8.5, years: 20 },
];

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function MortgageCalculator() {
  const [dark, setDark] = useState(true);
  const [tab, setTab] = useState('payment');
  const [mob, setMob] = useState(false);
  const [currency, setCurrency] = useState('USD');

  /* Main inputs */
  const [price,     setPrice]     = useState(400000);
  const [down,      setDown]      = useState(80000);
  const [rate,      setRate]      = useState(7.0);
  const [years,     setYears]     = useState(30);
  const [taxAnnual, setTaxAnnual] = useState(4800);
  const [insurance, setInsurance] = useState(1200);
  const [pmi,       setPmi]       = useState(0);

  /* Prepayment */
  const [extraMonthly, setExtraMonthly] = useState(200);
  const [lumpSum,      setLumpSum]      = useState(0);
  const [lumpMonth,    setLumpMonth]    = useState(12);

  /* Affordability */
  const [income,   setIncome]   = useState(8000);
  const [debts,    setDebts]    = useState(500);
  const [dtiLimit, setDtiLimit] = useState(36);

  /* Rent vs Buy */
  const [monthlyRent,    setMonthlyRent]    = useState(2000);
  const [rentIncrease,   setRentIncrease]   = useState(3);
  const [homeAppreciation, setHomeAppreciation] = useState(4);

  /* Compare */
  const [loans, setLoans] = useState([
    { price: 400000, down: 80000, rate: 7.0, years: 30, label: 'Option A' },
    { price: 400000, down: 80000, rate: 6.5, years: 30, label: 'Option B' },
    { price: 400000, down: 80000, rate: 7.0, years: 15, label: 'Option C' },
  ]);

  /* History */
  const [hist, setHist] = useState([]);
  const [copied, setCopied] = useState(false);

  const dk = dark;

  /* ── Core calculation ── */
  const calc = useMemo(() => calcMortgage({
    price, down, rate, years,
    tax: taxAnnual, insurance, pmi
  }), [price, down, rate, years, taxAnnual, insurance, pmi]);

  /* ── Amortization ── */
  const schedule = useMemo(() => buildSchedule({ price, down, rate, years }), [price, down, rate, years]);

  /* Year-level summary for chart */
  const yearlyData = useMemo(() => {
    const out = [];
    for (let y = 1; y <= years; y++) {
      const slice = schedule.slice((y - 1) * 12, y * 12);
      out.push({
        year: y,
        principal: slice.reduce((s, r) => s + r.principalPaid, 0),
        interest: slice.reduce((s, r) => s + r.interest, 0),
        balance: slice[slice.length - 1]?.balance ?? 0,
      });
    }
    return out;
  }, [schedule, years]);

  /* ── Prepayment calc ── */
  const schedNormal  = useMemo(() => buildSchedule({ price, down, rate, years }), [price, down, rate, years]);
  const schedPrepay  = useMemo(() => buildSchedulePrepay({ price, down, rate, years, extraMonthly, lumpSum, lumpMonth }), [price, down, rate, years, extraMonthly, lumpSum, lumpMonth]);
  const prepayStats = useMemo(() => {
    const normalInt  = schedNormal.reduce((s, r) => s + r.interest, 0);
    const prepayInt  = schedPrepay.reduce((s, r) => s + r.interest, 0);
    const savedInt   = normalInt - prepayInt;
    const savedMonths = schedNormal.length - schedPrepay.length;
    const savedYears  = Math.floor(savedMonths / 12);
    const savedMos    = savedMonths % 12;
    return { savedInt, savedMonths, savedYears, savedMos, prepayMonths: schedPrepay.length };
  }, [schedNormal, schedPrepay]);

  /* ── Affordability ── */
  const affordStats = useMemo(() => {
    const maxEMI = income * (dtiLimit / 100) - debts;
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    let maxLoan;
    if (monthlyRate === 0) { maxLoan = maxEMI * n; }
    else { maxLoan = maxEMI * (Math.pow(1 + monthlyRate, n) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, n)); }
    const maxHomePrice = maxLoan / (1 - 0.2); // assume 20% down
    const dti = ((calc.emi + debts) / income) * 100;
    return { maxEMI, maxLoan, maxHomePrice, dti };
  }, [income, debts, dtiLimit, rate, years, calc.emi]);

  /* ── Rent vs Buy ── */
  const rvbData = useMemo(() => {
    const rows = [];
    let rentCum = 0;
    let buyCum = 0;
    let homeValue = price;
    let rentalCost = monthlyRent;
    const ownCosts = calc.totalMonthly;
    for (let y = 1; y <= Math.min(years, 30); y++) {
      for (let m = 0; m < 12; m++) {
        rentCum += rentalCost;
        buyCum  += ownCosts;
      }
      homeValue *= (1 + homeAppreciation / 100);
      rentalCost *= (1 + rentIncrease / 100);
      const equity = homeValue - (price - down) * Math.pow(1 + rate / 100 / 12, y * 12) /
        Math.pow(1 + rate / 100 / 12, years * 12); // approx
      rows.push({ year: y, rentCum, buyCum, homeValue, equity });
    }
    return rows;
  }, [price, down, rate, years, calc.totalMonthly, monthlyRent, rentIncrease, homeAppreciation]);

  /* breakeven year */
  const breakEvenYear = useMemo(() => {
    for (const r of rvbData) {
      if (r.homeValue - r.buyCum > r.homeValue * 0 - r.rentCum + 0) {
        // simple: when cumulative rent > cumulative mortgage cost
        if (r.rentCum >= r.buyCum) return r.year;
      }
    }
    return null;
  }, [rvbData]);

  /* ── Save to history ── */
  const saveHistory = useCallback(() => {
    const entry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      price, down, rate, years,
      emi: calc.emi,
      total: calc.totalPayment,
      currency,
    };
    setHist(h => [entry, ...h].slice(0, 20));
  }, [price, down, rate, years, calc, currency]);

  useEffect(() => { saveHistory(); }, [price, down, rate, years, taxAnnual, insurance]);

  /* ── Copy result ── */
  const copyResult = () => {
    const sym = CURRENCIES.find(c => c.code === currency)?.sym || '$';
    const text = `Mortgage: ${fmtFull(price, currency)} @ ${rate}% for ${years}yr\nMonthly EMI: ${fmtFull(calc.emi, currency)}\nTotal Interest: ${fmtFull(calc.totalInterest, currency)}\nTotal Cost: ${fmtFull(calc.totalPayment, currency)}`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  /* ── Sidebar quick stats ── */
  const sideStats = [
    { label: 'Monthly EMI',      val: fmtFull(calc.emi, currency),           color: 'var(--acc)' },
    { label: 'Total Interest',   val: fmtFull(calc.totalInterest, currency), color: 'var(--er)' },
    { label: 'Total Cost',       val: fmtFull(calc.totalPayment, currency),  color: 'var(--info)' },
    { label: 'Loan Amount',      val: fmtFull(calc.principal, currency),     color: 'var(--lo)' },
    { label: 'Down Payment',     val: fmtFull(down, currency),               color: 'var(--pur)' },
    { label: 'Interest Ratio',   val: `${((calc.totalInterest / calc.totalPayment) * 100).toFixed(1)}%`, color: 'var(--warn)' },
  ];

  /* ══════════════════════════ SVG DONUT ══════════════════════════ */
  const DonutChart = () => {
    const r = 80, cx = 110, cy = 110, stroke = 22;
    const circum = 2 * Math.PI * r;
    const segments = [
      { val: calc.emi,          color: '#f59e0b', label: 'Principal+Int' },
      { val: calc.monthlyTax,   color: '#60a5fa', label: 'Tax' },
      { val: calc.monthlyIns,   color: '#34d399', label: 'Insurance' },
      { val: calc.monthlyPMI,   color: '#a78bfa', label: 'PMI' },
    ].filter(s => s.val > 0);
    const total = segments.reduce((s, x) => s + x.val, 0) || 1;
    let offset = 0;
    return (
      <svg viewBox="0 0 220 220" style={{ width: '100%', maxWidth: 220 }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={dk ? 'rgba(245,158,11,.07)' : 'rgba(146,64,14,.08)'} strokeWidth={stroke}/>
        {segments.map((seg, i) => {
          const frac = seg.val / total;
          const dash = frac * circum;
          const gap  = circum - dash;
          const off  = offset;
          offset += dash;
          return (
            <motion.circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-off + circum * 0.25}
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circum}` }}
              animate={{ strokeDasharray: `${dash} ${gap}` }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: 'easeOut' }}
            />
          );
        })}
        <text x={cx} y={cy - 12} textAnchor="middle" fontFamily="'Syne',sans-serif" fontWeight="900" fontSize="22" fill="var(--acc)">
          {fmtMoney(calc.totalMonthly, currency)}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="9" fill="var(--tx3)" letterSpacing=".1em">
          TOTAL/MONTH
        </text>
        <text x={cx} y={cy + 24} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">
          EMI: {fmtMoney(calc.emi, currency)}
        </text>
      </svg>
    );
  };

  /* ══════════════════════ STACKED AREA CHART ══════════════════════ */
  const AreaChart = () => {
    const W = 480, H = 200, pad = { t: 16, r: 16, b: 32, l: 52 };
    const iW = W - pad.l - pad.r;
    const iH = H - pad.t - pad.b;
    const data = yearlyData;
    const maxVal = Math.max(...data.map(d => d.principal + d.interest));
    const sx = i => pad.l + (i / (data.length - 1)) * iW;
    const sy = v => pad.t + iH - (v / maxVal) * iH;
    // principal path (bottom layer)
    const pPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(1)},${sy(d.principal).toFixed(1)}`).join(' ') +
      ` L${sx(data.length - 1).toFixed(1)},${(pad.t + iH).toFixed(1)} L${pad.l},${(pad.t + iH).toFixed(1)} Z`;
    // total path (stacked)
    const tPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(1)},${sy(d.principal + d.interest).toFixed(1)}`).join(' ') +
      ` L${sx(data.length - 1).toFixed(1)},${sy(data[data.length - 1].principal).toFixed(1)} ` +
      data.slice().reverse().map((d, i) => `L${sx(data.length - 1 - i).toFixed(1)},${sy(d.principal).toFixed(1)}`).join(' ') + ' Z';

    const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => ({ val: maxVal * f, y: sy(maxVal * f) }));
    const xTicks = data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        <defs>
          <clipPath id="ac"><rect x={pad.l} y={pad.t} width={iW} height={iH}/></clipPath>
        </defs>
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} y1={t.y} x2={W - pad.r} y2={t.y} stroke={dk ? 'rgba(245,158,11,.07)' : 'rgba(146,64,14,.07)'} strokeWidth="1"/>
            <text x={pad.l - 5} y={t.y + 3} textAnchor="end" fontFamily="'DM Mono',monospace" fontSize="7.5" fill="var(--tx3)">
              {fmtMoney(t.val, currency)}
            </text>
          </g>
        ))}
        {xTicks.map((d, i) => (
          <text key={i} x={sx(data.indexOf(d))} y={H - 6} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">
            Yr {d.year}
          </text>
        ))}
        <motion.path d={tPath} fill={dk ? 'rgba(248,113,113,.25)' : 'rgba(153,27,27,.15)'} clipPath="url(#ac)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}/>
        <motion.path d={pPath} fill={dk ? 'rgba(245,158,11,.3)' : 'rgba(146,64,14,.2)'} clipPath="url(#ac)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}/>
        {/* Legend */}
        <rect x={pad.l + 8} y={pad.t + 8} width={10} height={10} fill={dk ? 'rgba(245,158,11,.7)' : 'rgba(146,64,14,.6)'} rx="2"/>
        <text x={pad.l + 22} y={pad.t + 17} fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">Principal</text>
        <rect x={pad.l + 80} y={pad.t + 8} width={10} height={10} fill={dk ? 'rgba(248,113,113,.6)' : 'rgba(153,27,27,.45)'} rx="2"/>
        <text x={pad.l + 94} y={pad.t + 17} fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">Interest</text>
      </svg>
    );
  };

  /* ══════════════════════ PREPAYMENT CHART ════════════════════════ */
  const PrepayChart = () => {
    const W = 480, H = 180, pad = { t: 16, r: 16, b: 30, l: 52 };
    const iW = W - pad.l - pad.r;
    const iH = H - pad.t - pad.b;
    const maxBalance = price - down;
    const nN = schedNormal.length;
    const nP = schedPrepay.length;
    const sx = (i, total) => pad.l + (i / (total - 1)) * iW;
    const sy = v => pad.t + iH - (Math.max(0, v) / maxBalance) * iH;
    const normalLine = schedNormal.map((r, i) => `${i === 0 ? 'M' : 'L'}${sx(i, nN).toFixed(1)},${sy(r.balance).toFixed(1)}`).join(' ');
    const prepayLine = schedPrepay.map((r, i) => `${i === 0 ? 'M' : 'L'}${sx(i, nN).toFixed(1)},${sy(r.balance).toFixed(1)}`).join(' ');
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + iH} stroke={dk ? 'rgba(245,158,11,.15)' : 'rgba(146,64,14,.15)'} strokeWidth="1"/>
        <line x1={pad.l} y1={pad.t + iH} x2={W - pad.r} y2={pad.t + iH} stroke={dk ? 'rgba(245,158,11,.15)' : 'rgba(146,64,14,.15)'} strokeWidth="1"/>
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
          <text key={i} x={pad.l - 5} y={sy(maxBalance * (1 - f)) + 3} textAnchor="end" fontFamily="'DM Mono',monospace" fontSize="7.5" fill="var(--tx3)">
            {fmtMoney(maxBalance * (1 - f), currency)}
          </text>
        ))}
        <motion.path d={normalLine} fill="none" stroke={dk ? 'rgba(248,113,113,.6)' : 'rgba(153,27,27,.5)'} strokeWidth="2" strokeDasharray="5,3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }}/>
        <motion.path d={prepayLine} fill="none" stroke="var(--lo)" strokeWidth="2.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }}/>
        {/* legend */}
        <line x1={pad.l + 8} y1={pad.t + 12} x2={pad.l + 24} y2={pad.t + 12} stroke={dk ? 'rgba(248,113,113,.6)' : 'rgba(153,27,27,.5)'} strokeWidth="2" strokeDasharray="4,2"/>
        <text x={pad.l + 28} y={pad.t + 16} fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">Normal</text>
        <line x1={pad.l + 80} y1={pad.t + 12} x2={pad.l + 96} y2={pad.t + 12} stroke="var(--lo)" strokeWidth="2.5"/>
        <text x={pad.l + 100} y={pad.t + 16} fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">With Prepayment</text>
      </svg>
    );
  };

  /* ══════════════════════ RENT VS BUY CHART ═══════════════════════ */
  const RvBChart = () => {
    const W = 480, H = 200, pad = { t: 16, r: 16, b: 30, l: 60 };
    const iW = W - pad.l - pad.r;
    const iH = H - pad.t - pad.b;
    const data = rvbData;
    const maxVal = Math.max(...data.map(d => Math.max(d.rentCum, d.buyCum)));
    const sx = i => pad.l + (i / (data.length - 1)) * iW;
    const sy = v => pad.t + iH - (v / maxVal) * iH;
    const rentLine = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(1)},${sy(d.rentCum).toFixed(1)}`).join(' ');
    const buyLine  = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(1)},${sy(d.buyCum).toFixed(1)}`).join(' ');
    const xTicks = data.filter((_, i) => i % 4 === 3 || i === data.length - 1);
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
          const y = sy(maxVal * (1 - f));
          return (
            <g key={i}>
              <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke={dk ? 'rgba(245,158,11,.06)' : 'rgba(146,64,14,.06)'} strokeWidth="1"/>
              <text x={pad.l - 5} y={y + 3} textAnchor="end" fontFamily="'DM Mono',monospace" fontSize="7.5" fill="var(--tx3)">
                {fmtMoney(maxVal * (1 - f), currency)}
              </text>
            </g>
          );
        })}
        {xTicks.map((d, i) => (
          <text key={i} x={sx(data.indexOf(d))} y={H - 6} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">
            Yr {d.year}
          </text>
        ))}
        <motion.path d={rentLine} fill="none" stroke={dk ? '#60a5fa' : '#1d4ed8'} strokeWidth="2.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }}/>
        <motion.path d={buyLine}  fill="none" stroke="var(--acc)" strokeWidth="2.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.15 }}/>
        {/* crossover marker */}
        {breakEvenYear && (() => {
          const idx = breakEvenYear - 1;
          const x = sx(Math.min(idx, data.length - 1));
          return (
            <g>
              <line x1={x} y1={pad.t} x2={x} y2={pad.t + iH} stroke="var(--lo)" strokeWidth="1.5" strokeDasharray="4,3"/>
              <text x={x + 4} y={pad.t + 12} fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--lo)">Break-even Yr {breakEvenYear}</text>
            </g>
          );
        })()}
        {/* Legend */}
        <line x1={pad.l + 8} y1={pad.t + 12} x2={pad.l + 24} y2={pad.t + 12} stroke={dk ? '#60a5fa' : '#1d4ed8'} strokeWidth="2.5"/>
        <text x={pad.l + 28} y={pad.t + 16} fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">Rent</text>
        <line x1={pad.l + 70} y1={pad.t + 12} x2={pad.l + 86} y2={pad.t + 12} stroke="var(--acc)" strokeWidth="2.5"/>
        <text x={pad.l + 90} y={pad.t + 16} fontFamily="'DM Mono',monospace" fontSize="8" fill="var(--tx3)">Buy</text>
      </svg>
    );
  };

  /* ══════════════════════ COMPARE BAR CHART ═══════════════════════ */
  const CompareBarChart = ({ loanCalcs }) => {
    const W = 480, H = 180, pad = { t: 16, r: 16, b: 30, l: 60 };
    const iW = W - pad.l - pad.r;
    const iH = H - pad.t - pad.b;
    const maxInt = Math.max(...loanCalcs.map(l => l.totalInterest));
    const barW = (iW / loanCalcs.length) * 0.55;
    const barGap = iW / loanCalcs.length;
    const colors = ['var(--acc)', 'var(--info)', 'var(--lo)'];
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
          const y = pad.t + iH * (1 - (1 - f));
          const val = maxInt * (1 - f);
          return (
            <g key={i}>
              <line x1={pad.l} y1={pad.t + iH * f} x2={W - pad.r} y2={pad.t + iH * f} stroke={dk ? 'rgba(245,158,11,.07)' : 'rgba(146,64,14,.07)'} strokeWidth="1"/>
              <text x={pad.l - 5} y={pad.t + iH * f + 3} textAnchor="end" fontFamily="'DM Mono',monospace" fontSize="7.5" fill="var(--tx3)">
                {fmtMoney(val, currency)}
              </text>
            </g>
          );
        })}
        {loanCalcs.map((l, i) => {
          const barH = (l.totalInterest / maxInt) * iH;
          const x = pad.l + i * barGap + (barGap - barW) / 2;
          const y = pad.t + iH - barH;
          return (
            <g key={i}>
              <motion.rect x={x} y={y} width={barW} height={barH} fill={colors[i]} rx="3" opacity={0.85}
                initial={{ height: 0, y: pad.t + iH }} animate={{ height: barH, y }} transition={{ duration: 0.6, delay: i * 0.12 }}/>
              <text x={x + barW / 2} y={pad.t + iH + 14} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8.5" fill={colors[i]}>
                {loans[i].label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  /* ══════════════════════════ RENDER ══════════════════════════════ */
  return (
    <>
      <style>{S}</style>
      <div className={dk ? 'dk' : 'lt'}>
        <div className={`mob-overlay ${mob ? 'show' : ''}`} onClick={() => setMob(false)}/>

        {/* ════ TOPBAR ════ */}
        <div className="topbar">
          <button className="btn-ghost mob-btn" onClick={() => setMob(s => !s)} style={{ padding: '5px 8px', fontSize: 14 }}>☰</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: dk ? 4 : 9,
              background: dk ? 'rgba(245,158,11,.1)' : 'linear-gradient(135deg,#92400e,#b45309)',
              border: dk ? '1px solid rgba(245,158,11,.35)' : 'none',
              boxShadow: dk ? '0 0 16px rgba(245,158,11,.25)' : '0 3px 10px rgba(146,64,14,.4)' }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 13, color: dk ? '#f59e0b' : '#fff' }}>🏠</span>
            </div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 16, letterSpacing: '-.01em', color: 'var(--tx)' }}>
              MORTGAGE<span style={{ color: 'var(--acc)' }}>.calc</span>
              <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 400, fontSize: 8, letterSpacing: '.15em', color: 'var(--tx3)', marginLeft: 7, verticalAlign: 'middle' }}>v1</span>
            </span>
          </div>
          <div style={{ flex: 1 }}/>
          {/* Currency selector */}
          <select className="sel" value={currency} onChange={e => setCurrency(e.target.value)}
            style={{ width: 80, padding: '3px 8px', fontSize: 10 }}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px',
            borderRadius: dk ? 3 : 8, border: dk ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)',
            fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'var(--tx3)' }}>
            <span style={{ color: 'var(--lo)', fontSize: 7 }}>●</span> LIVE
          </div>
          <button className="btn-ghost" onClick={() => setDark(d => !d)} style={{ padding: '5px 10px', fontSize: 13 }}>
            {dk ? '☀' : '◑'}
          </button>
        </div>

        {/* ════ TABBAR ════ */}
        <div className="tabbar">
          {TABS.map(t => (
            <button key={t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* ════ BODY ════ */}
        <div className="body">
          {/* ── SIDEBAR ── */}
          <div className={`sidebar ${mob ? 'mob' : ''}`}>
            {/* Quick stats */}
            <div className="sec-lbl">Quick Stats</div>
            {sideStats.map((s, i) => (
              <div key={i} className="scard">
                <div className="lbl" style={{ margin: 0 }}>{s.label}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 15, color: s.color }}>{s.val}</div>
              </div>
            ))}

            

            {/* Presets */}
            <div className="sec-lbl" style={{ marginTop: 4 }}>Presets</div>
            {PRESETS.map((p, i) => (
              <button key={i} className="btn-ghost" style={{ justifyContent: 'flex-start', fontSize: 9 }}
                onClick={() => { setPrice(p.price); setDown(p.down); setRate(p.rate); setYears(p.years); }}>
                {p.label}
              </button>
            ))}

            
          </div>

          {/* ── MAIN ── */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══════════ PAYMENT TAB ══════════ */}
              {tab === 'payment' && (
                <motion.div key="pay" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  

                  {/* Inputs + Donut */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="g2c">
                    {/* Inputs */}
                    <div className="panel" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, color: 'var(--tx)', letterSpacing: '.06em', marginBottom: 2 }}>LOAN DETAILS</div>

                      <div>
                        <div className="lbl">Home Price</div>
                        <input className="inp" type="number" value={price} onChange={e => setPrice(+e.target.value)} min={0}/>
                        <input className="rng" type="range" min={50000} max={5000000} step={10000} value={price} onChange={e => setPrice(+e.target.value)} style={{ marginTop: 6 }}/>
                      </div>
                      <div>
                        <div className="lbl">Down Payment — {((down / price) * 100).toFixed(1)}%</div>
                        <input className="inp" type="number" value={down} onChange={e => setDown(+e.target.value)} min={0} max={price}/>
                        <input className="rng" type="range" min={0} max={price * 0.5} step={5000} value={down} onChange={e => setDown(+e.target.value)} style={{ marginTop: 6 }}/>
                      </div>
                      <div>
                        <div className="lbl">Interest Rate — {rate}%</div>
                        <input className="inp" type="number" value={rate} onChange={e => setRate(+e.target.value)} step={0.05} min={0} max={25}/>
                        <input className="rng" type="range" min={1} max={20} step={0.05} value={rate} onChange={e => setRate(+e.target.value)} style={{ marginTop: 6 }}/>
                      </div>
                      <div>
                        <div className="lbl">Loan Term</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {[10, 15, 20, 25, 30].map(y => (
                            <button key={y} className={`btn-ghost ${years === y ? 'on' : ''}`} onClick={() => setYears(y)}>{y}yr</button>
                          ))}
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid var(--bdr)', paddingTop: 12, marginTop: 2 }}>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 11, color: 'var(--tx3)', letterSpacing: '.06em', marginBottom: 10 }}>OPTIONAL (Annual)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <div>
                            <div className="lbl">Property Tax</div>
                            <input className="inp" type="number" value={taxAnnual} onChange={e => setTaxAnnual(+e.target.value)} min={0}/>
                          </div>
                          <div>
                            <div className="lbl">Home Insurance</div>
                            <input className="inp" type="number" value={insurance} onChange={e => setInsurance(+e.target.value)} min={0}/>
                          </div>
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <div className="lbl">PMI (Annual) — if down &lt; 20%</div>
                          <input className="inp" type="number" value={pmi} onChange={e => setPmi(+e.target.value)} min={0}/>
                        </div>
                      </div>
                    </div>

                    {/* Donut + breakdown */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div className="panel-hi" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                        <DonutChart/>
                        {/* Legend */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%' }}>
                          {[
                            { color: '#f59e0b', label: 'P + Interest', val: calc.emi },
                            { color: '#60a5fa', label: 'Property Tax', val: calc.monthlyTax },
                            { color: '#34d399', label: 'Insurance', val: calc.monthlyIns },
                            { color: '#a78bfa', label: 'PMI', val: calc.monthlyPMI },
                          ].filter(s => s.val > 0).map((s, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }}/>
                              <div>
                                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 8.5, color: 'var(--tx3)', letterSpacing: '.06em' }}>{s.label}</div>
                                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--tx2)' }}>{fmtFull(s.val, currency)}/mo</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key stats */}
                      <div className="panel" style={{ padding: '16px 18px' }}>
                        {[
                          { label: 'Loan Amount',     val: fmtFull(calc.principal, currency),       color: 'var(--lo)' },
                          { label: 'Total Interest',  val: fmtFull(calc.totalInterest, currency),   color: 'var(--er)' },
                          { label: 'Total Payment',   val: fmtFull(calc.totalPayment, currency),    color: 'var(--info)' },
                          { label: 'Payoff Date',     val: (() => { const d = new Date(); d.setMonth(d.getMonth() + years * 12); return d.toLocaleDateString('en', { month: 'short', year: 'numeric' }); })(), color: 'var(--pur)' },
                        ].map((s, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0',
                            borderBottom: i < 3 ? '1px solid var(--bdr)' : 'none' }}>
                            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'var(--tx3)', letterSpacing: '.08em' }}>{s.label}</span>
                            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, color: s.color }}>{s.val}</span>
                          </div>
                        ))}
                      </div>

                      {/* Copy button */}
                      <button className="btn-pri" onClick={copyResult} style={{ alignSelf: 'flex-start' }}>
                        {copied ? '✓ Copied!' : '⎘ Copy Result'}
                      </button>
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ AMORTIZATION TAB ══════════ */}
              {tab === 'amortization' && (
                <motion.div key="amort" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="hint"><span>⊞</span><span>Full {years}-year amortization schedule. Each month shows how your payment splits between principal and interest, and your remaining balance.</span></div>

                  {/* Stacked area chart */}
                  <div className="panel" style={{ padding: '16px 18px' }}>
                    <div className="lbl" style={{ marginBottom: 10 }}>Annual Principal vs Interest Breakdown</div>
                    <AreaChart/>
                  </div>

                  {/* Year summary cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 9 }}>
                    {[1, 5, 10, 15, 20, years].filter((v, i, a) => a.indexOf(v) === i && v <= years).map(y => {
                      const row = yearlyData[y - 1];
                      if (!row) return null;
                      return (
                        <div key={y} className="scard">
                          <div className="lbl" style={{ margin: 0 }}>After Year {y}</div>
                          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 13, color: 'var(--acc)' }}>{fmtFull(row.balance, currency)}</div>
                          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'var(--tx3)' }}>remaining</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Table */}
                  <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--bdr)' }}>
                      <div className="lbl" style={{ margin: 0 }}>Monthly Schedule — {schedule.length} payments</div>
                    </div>
                    <div className="tbl-wrap">
                      <table className="amort-tbl">
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>EMI</th>
                            <th>Principal</th>
                            <th>Interest</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedule.map((r, i) => (
                            <tr key={i}>
                              <td style={{ color: 'var(--tx3)' }}>{r.month}</td>
                              <td>{fmtMoney(r.emi, currency)}</td>
                              <td style={{ color: 'var(--lo)' }}>{fmtMoney(r.principalPaid, currency)}</td>
                              <td style={{ color: 'var(--er)' }}>{fmtMoney(r.interest, currency)}</td>
                              <td style={{ color: 'var(--acc)' }}>{fmtMoney(r.balance, currency)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ COMPARE TAB ══════════ */}
              {tab === 'compare' && (
                <motion.div key="cmp" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="hint"><span>⇄</span><span>Compare up to 3 loan scenarios side by side. Edit each option's parameters independently to find the best deal.</span></div>

                  {/* Loan editors */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                    {loans.map((loan, li) => {
                      const lc = calcMortgage({ price: loan.price, down: loan.down, rate: loan.rate, years: loan.years });
                      const colors = ['var(--acc)', 'var(--info)', 'var(--lo)'];
                      return (
                        <div key={li} className="panel" style={{ padding: '16px 14px', borderTop: `3px solid ${colors[li]}` }}>
                          <input
                            style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, background: 'transparent', border: 'none', color: colors[li], width: '100%', outline: 'none', marginBottom: 10 }}
                            value={loan.label}
                            onChange={e => setLoans(ls => ls.map((l, i) => i === li ? { ...l, label: e.target.value } : l))}
                          />
                          {[
                            { lbl: 'Price', key: 'price', step: 10000, min: 50000, max: 5000000 },
                            { lbl: 'Down',  key: 'down',  step: 5000,  min: 0,     max: loan.price },
                            { lbl: 'Rate %',key: 'rate',  step: 0.05,  min: 0,     max: 20 },
                            { lbl: 'Years', key: 'years', step: 1,     min: 5,     max: 30 },
                          ].map(f => (
                            <div key={f.key} style={{ marginBottom: 8 }}>
                              <div className="lbl">{f.lbl}</div>
                              <input className="inp" type="number" value={loan[f.key]} step={f.step} min={f.min} max={f.max}
                                onChange={e => setLoans(ls => ls.map((l, i) => i === li ? { ...l, [f.key]: +e.target.value } : l))}
                                style={{ fontSize: 11 }}/>
                            </div>
                          ))}
                          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--bdr)' }}>
                            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 18, color: colors[li] }}>{fmtFull(lc.emi, currency)}/mo</div>
                            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'var(--tx3)', marginTop: 3 }}>Total interest: {fmtFull(lc.totalInterest, currency)}</div>
                            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'var(--tx3)' }}>Total cost: {fmtFull(lc.totalPayment, currency)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bar chart */}
                  <div className="panel" style={{ padding: '16px 18px' }}>
                    <div className="lbl" style={{ marginBottom: 10 }}>Total Interest Comparison</div>
                    <CompareBarChart loanCalcs={loans.map(l => calcMortgage({ price: l.price, down: l.down, rate: l.rate, years: l.years }))}/>
                  </div>

                  {/* Summary table */}
                  <div className="panel" style={{ padding: '16px 18px' }}>
                    <div className="lbl" style={{ marginBottom: 12 }}>Side-by-Side Summary</div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'DM Mono',monospace", fontSize: 11 }}>
                        <thead>
                          <tr>
                            {['Metric', ...loans.map(l => l.label)].map((h, i) => (
                              <th key={i} style={{ padding: '8px 12px', textAlign: i === 0 ? 'left' : 'right',
                                fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase',
                                color: i === 0 ? 'var(--tx3)' : ['var(--acc)','var(--info)','var(--lo)'][i-1],
                                borderBottom: '1px solid var(--bdr)' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {['Monthly EMI', 'Total Interest', 'Total Cost', 'Loan Amount'].map((metric, ri) => {
                            const keys = ['emi', 'totalInterest', 'totalPayment', 'principal'];
                            return (
                              <tr key={ri}>
                                <td style={{ padding: '7px 12px', color: 'var(--tx3)', fontSize: 10, borderBottom: '1px solid var(--bdr)' }}>{metric}</td>
                                {loans.map((l, li) => {
                                  const lc = calcMortgage({ price: l.price, down: l.down, rate: l.rate, years: l.years });
                                  return (
                                    <td key={li} style={{ padding: '7px 12px', textAlign: 'right', color: 'var(--tx2)', borderBottom: '1px solid var(--bdr)' }}>
                                      {fmtFull(lc[keys[ri]], currency)}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ PREPAYMENT TAB ══════════ */}
              {tab === 'prepayment' && (
                <motion.div key="prep" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="hint"><span>↑</span><span>See how extra payments dramatically reduce your total interest and loan term. Uses your loan details from the Payment tab.</span></div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="g2c">
                    <div className="panel" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, color: 'var(--tx)', letterSpacing: '.06em' }}>EXTRA PAYMENTS</div>
                      <div>
                        <div className="lbl">Extra Monthly Payment</div>
                        <input className="inp" type="number" value={extraMonthly} onChange={e => setExtraMonthly(+e.target.value)} min={0}/>
                        <input className="rng" type="range" min={0} max={5000} step={50} value={extraMonthly} onChange={e => setExtraMonthly(+e.target.value)} style={{ marginTop: 6 }}/>
                      </div>
                      <div>
                        <div className="lbl">One-Time Lump Sum</div>
                        <input className="inp" type="number" value={lumpSum} onChange={e => setLumpSum(+e.target.value)} min={0}/>
                      </div>
                      <div>
                        <div className="lbl">Lump Sum at Month</div>
                        <input className="inp" type="number" value={lumpMonth} onChange={e => setLumpMonth(+e.target.value)} min={1} max={years * 12}/>
                      </div>
                    </div>

                    {/* Savings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { label: 'Interest Saved',  val: fmtFull(prepayStats.savedInt, currency),  color: 'var(--lo)' },
                        { label: 'Time Saved',       val: `${prepayStats.savedYears}yr ${prepayStats.savedMos}mo`, color: 'var(--acc)' },
                        { label: 'New Payoff',       val: `${Math.ceil(prepayStats.prepayMonths / 12)} years`, color: 'var(--info)' },
                        { label: 'Original Payoff',  val: `${years} years`, color: 'var(--tx3)' },
                      ].map((s, i) => (
                        <motion.div key={i} className="panel-hi" style={{ padding: '14px 18px' }}
                          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                          <div className="lbl" style={{ margin: 0 }}>{s.label}</div>
                          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 22, color: s.color, marginTop: 4 }}>{s.val}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline chart */}
                  <div className="panel" style={{ padding: '16px 18px' }}>
                    <div className="lbl" style={{ marginBottom: 10 }}>Remaining Balance Over Time</div>
                    <PrepayChart/>
                  </div>

                  <div className="hint">
                    <span>💡</span>
                    <span>Even an extra <strong>{fmtFull(extraMonthly, currency)}/month</strong> saves <strong style={{ color: 'var(--lo)' }}>{fmtFull(prepayStats.savedInt, currency)}</strong> in interest and cuts <strong style={{ color: 'var(--acc)' }}>{prepayStats.savedYears}yr {prepayStats.savedMos}mo</strong> off your loan.</span>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ AFFORDABILITY TAB ══════════ */}
              {tab === 'afford' && (
                <motion.div key="aff" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="hint"><span>⚖</span><span>Enter your monthly income and existing debts to find the maximum home price you can afford. Uses your rate and term from the Payment tab.</span></div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="g2c">
                    <div className="panel" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, color: 'var(--tx)', letterSpacing: '.06em' }}>YOUR FINANCES</div>
                      <div>
                        <div className="lbl">Gross Monthly Income</div>
                        <input className="inp" type="number" value={income} onChange={e => setIncome(+e.target.value)} min={0}/>
                        <input className="rng" type="range" min={1000} max={50000} step={500} value={income} onChange={e => setIncome(+e.target.value)} style={{ marginTop: 6 }}/>
                      </div>
                      <div>
                        <div className="lbl">Monthly Debt Payments (car, student, etc.)</div>
                        <input className="inp" type="number" value={debts} onChange={e => setDebts(+e.target.value)} min={0}/>
                      </div>
                      <div>
                        <div className="lbl">Max DTI Ratio — {dtiLimit}%</div>
                        <input className="rng" type="range" min={20} max={50} step={1} value={dtiLimit} onChange={e => setDtiLimit(+e.target.value)}/>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'var(--tx3)', marginTop: 3 }}>
                          <span>20% (Conservative)</span><span>36% (Standard)</span><span>50% (Max)</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {/* DTI Gauge */}
                      <div className="panel-hi" style={{ padding: '20px 22px' }}>
                        <div className="lbl">Your Current DTI (with this mortgage)</div>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 32, color: affordStats.dti > 43 ? 'var(--er)' : affordStats.dti > 36 ? 'var(--warn)' : 'var(--lo)', marginTop: 4 }}>
                          {affordStats.dti.toFixed(1)}%
                        </div>
                        <div style={{ marginTop: 8, height: 8, borderRadius: 4, background: 'var(--bdr)', overflow: 'hidden' }}>
                          <motion.div style={{ height: '100%', borderRadius: 4,
                            background: affordStats.dti > 43 ? 'var(--er)' : affordStats.dti > 36 ? 'var(--warn)' : 'var(--lo)' }}
                            initial={{ width: 0 }} animate={{ width: `${Math.min(100, affordStats.dti)}%` }} transition={{ duration: 0.8 }}/>
                        </div>
                        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9.5, color: 'var(--tx3)', marginTop: 5 }}>
                          {affordStats.dti <= 36 ? '✓ Good — within recommended range' : affordStats.dti <= 43 ? '⚠ Elevated — lenders may scrutinize' : '✗ High — likely to be rejected'}
                        </div>
                      </div>

                      {[
                        { label: 'Max Monthly Housing', val: fmtFull(affordStats.maxEMI, currency), color: 'var(--acc)' },
                        { label: 'Max Loan Amount',      val: fmtFull(affordStats.maxLoan, currency), color: 'var(--info)' },
                        { label: 'Max Home Price (20% down)', val: fmtFull(affordStats.maxHomePrice, currency), color: 'var(--lo)' },
                      ].map((s, i) => (
                        <div key={i} className="scard">
                          <div className="lbl" style={{ margin: 0 }}>{s.label}</div>
                          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 18, color: s.color }}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ RENT VS BUY TAB ══════════ */}
              {tab === 'rentvbuy' && (
                <motion.div key="rvb" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="hint"><span>🏠</span><span>Is it better to rent or buy? This chart shows cumulative costs over time and where buying breaks even against renting.</span></div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="g2c">
                    <div className="panel" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, color: 'var(--tx)', letterSpacing: '.06em' }}>RENT PARAMETERS</div>
                      <div>
                        <div className="lbl">Current Monthly Rent</div>
                        <input className="inp" type="number" value={monthlyRent} onChange={e => setMonthlyRent(+e.target.value)} min={0}/>
                        <input className="rng" type="range" min={500} max={10000} step={100} value={monthlyRent} onChange={e => setMonthlyRent(+e.target.value)} style={{ marginTop: 6 }}/>
                      </div>
                      <div>
                        <div className="lbl">Annual Rent Increase — {rentIncrease}%</div>
                        <input className="rng" type="range" min={0} max={10} step={0.5} value={rentIncrease} onChange={e => setRentIncrease(+e.target.value)}/>
                      </div>
                      <div>
                        <div className="lbl">Home Appreciation Rate — {homeAppreciation}%</div>
                        <input className="rng" type="range" min={0} max={12} step={0.5} value={homeAppreciation} onChange={e => setHomeAppreciation(+e.target.value)}/>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { label: 'Monthly Mortgage',   val: fmtFull(calc.totalMonthly, currency), color: 'var(--acc)' },
                        { label: 'Monthly Rent',        val: fmtFull(monthlyRent, currency),        color: 'var(--info)' },
                        { label: 'Break-Even Year',     val: breakEvenYear ? `Year ${breakEvenYear}` : 'Never (in term)', color: 'var(--lo)' },
                        { label: '30yr Home Value',     val: fmtFull(rvbData[rvbData.length - 1]?.homeValue || price, currency), color: 'var(--pur)' },
                      ].map((s, i) => (
                        <div key={i} className="scard">
                          <div className="lbl" style={{ margin: 0 }}>{s.label}</div>
                          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 17, color: s.color }}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="panel" style={{ padding: '16px 18px' }}>
                    <div className="lbl" style={{ marginBottom: 10 }}>Cumulative Cost: Rent vs Buy</div>
                    <RvBChart/>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ HISTORY TAB ══════════ */}
              {tab === 'history' && (
                <motion.div key="hist" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  <div className="hint"><span>⌛</span><span>Auto-logs every calculation. Click any row to restore those inputs.</span></div>
                  {hist.length === 0
                    ? <div style={{ textAlign: 'center', padding: '64px 24px', fontFamily: "'DM Mono',monospace", fontSize: 13, color: 'var(--tx3)' }}>No history yet — use the ◈ Payment tab.</div>
                    : hist.map((h, i) => (
                        <motion.div key={h.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                          className="hist-row"
                          onClick={() => { setPrice(h.price); setDown(h.down); setRate(h.rate); setYears(h.years); setTab('payment'); }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--tx2)', marginBottom: 2 }}>
                              {fmtFull(h.price, h.currency)} @ {h.rate}% · {h.years}yr
                            </div>
                            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: 'var(--tx3)' }}>
                              Down: {fmtFull(h.down, h.currency)} · {h.time}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 18, color: 'var(--acc)' }}>{fmtFull(h.emi, h.currency)}/mo</div>
                          </div>
                        </motion.div>
                      ))
                  }
                  {hist.length > 0 && (
                    <button className="btn-ghost" onClick={() => setHist([])} style={{ alignSelf: 'flex-start', marginTop: 4 }}>✕ Clear History</button>
                  )}
                  
                </motion.div>
              )}

              {/* ══════════ LEARN TAB ══════════ */}
              {tab === 'learn' && (
                <motion.div key="learn" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <div className="panel" style={{ padding: '26px 30px', marginBottom: 14 }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 26, color: 'var(--tx)', letterSpacing: '-.01em', marginBottom: 4 }}>Mortgage Guide</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: 'var(--tx3)', marginBottom: 26, letterSpacing: '.1em' }}>FORMULAS · GLOSSARY · TIPS · FAQ</div>
                    <div className="prose">
                      <h3>The Mortgage Formula</h3>
                      <p>Monthly payment = <code>P × r(1+r)ⁿ / ((1+r)ⁿ − 1)</code> where <strong>P</strong> is the loan amount (price − down payment), <strong>r</strong> is the monthly interest rate (annual rate ÷ 12 ÷ 100), and <strong>n</strong> is the total number of months (years × 12).</p>
                      <h3>Glossary</h3>
                      <p><strong>Principal</strong> — The original loan amount. Each payment reduces this. <strong>Amortization</strong> — The process of gradually paying off the loan through regular payments. <strong>DTI (Debt-to-Income)</strong> — Your total monthly debts ÷ gross income. Lenders prefer this below 36%, and rarely approve above 43%. <strong>LTV (Loan-to-Value)</strong> — Loan amount ÷ home value. Above 80% LTV typically requires PMI. <strong>PMI</strong> — Private Mortgage Insurance, required when your down payment is under 20%. Can be cancelled once you reach 20% equity. <strong>Escrow</strong> — A portion of your monthly payment held by the lender to pay property taxes and insurance on your behalf.</p>
                      <h3>How to Save the Most Interest</h3>
                      <p>The most powerful strategies are: (1) make a larger down payment to reduce the principal; (2) choose a shorter loan term (15yr vs 30yr typically saves hundreds of thousands); (3) make extra principal payments early in the loan when interest charges are highest; (4) refinance if rates drop significantly (usually worth it if the rate drops 1%+ and you plan to stay 3+ years).</p>
                      {[
                        { q: 'What is the 28/36 rule?', a: 'Lenders use this as a guideline: housing costs should not exceed 28% of gross income, and total debts should not exceed 36%. These are guidelines, not hard limits — some lenders allow up to 43% or even 50% DTI for well-qualified borrowers.' },
                        { q: 'When does it make sense to pay points?', a: 'Mortgage points (prepaid interest, 1 point = 1% of loan) lower your rate. Calculate break-even: cost of points ÷ monthly savings = months to break even. If you plan to stay longer than that, points save money.' },
                        { q: 'How is PMI calculated?', a: 'PMI typically costs 0.5%–1.5% of the loan amount per year. On a $320,000 loan, that\'s $1,600–$4,800/year ($133–$400/month). It can be cancelled once your equity reaches 20% of the original home value, either through payments or appreciation.' },
                        { q: 'Fixed vs Adjustable Rate?', a: 'A fixed-rate mortgage locks your rate for the entire term — predictable but initially higher. An ARM (Adjustable Rate Mortgage) starts lower but can change after an initial fixed period (e.g., 5/1 ARM = fixed for 5 years, then adjusts annually). ARMs make sense if you plan to sell before the adjustment period.' },
                      ].map(({ q, a }, i) => (
                        <div key={i} className="qa">
                          <div style={{ fontSize: 12.5, fontWeight: 700, fontFamily: "'DM Mono',monospace", color: 'var(--tx)', marginBottom: 5 }}>{q}</div>
                          <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.78 }}>{a}</div>
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