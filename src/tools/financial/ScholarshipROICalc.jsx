import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   SCHOLAR.roi — Scholarship ROI Calculator
   Clean Modern · JetBrains Mono + Outfit
   TABS: ◈ Calculator · ⇄ Compare · ↑ ROI Planner · 🎓 Aid Types · ⌛ History · ∑ Guide
═══════════════════════════════════════════════════════════════════ */

const S = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{font-family:'Outfit',sans-serif;}
.dk{--bg:#080b0f;--s1:#0d1117;--s2:#131920;--bdr:#1e2d3d;
  --acc:#38bdf8;--lo:#4ade80;--er:#f87171;--pur:#c084fc;--warn:#fb923c;--gold:#fbbf24;
  --tx:#e2eaf4;--tx2:#94a3b8;--tx3:#3d5a78;
  background:var(--bg);color:var(--tx);min-height:100vh;
  background-image:radial-gradient(ellipse 60% 40% at 50% -5%,rgba(56,189,248,.06),transparent 60%),
    radial-gradient(ellipse 40% 30% at 85% 95%,rgba(251,191,36,.04),transparent 60%);}
.lt{--bg:#f0f4f8;--s1:#fff;--s2:#e8f0f8;--bdr:#c5d8ec;
  --acc:#0369a1;--lo:#15803d;--er:#dc2626;--pur:#7c3aed;--warn:#c2410c;--gold:#b45309;
  --tx:#0c1f2e;--tx2:#2d5070;--tx3:#6b90aa;
  background:var(--bg);color:var(--tx);min-height:100vh;}

.topbar{height:52px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 20px;gap:10px;backdrop-filter:blur(24px);}
.dk .topbar{background:rgba(8,11,15,.96);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(240,244,248,.96);border-bottom:1.5px solid var(--bdr);}
.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none;}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:42px;padding:0 15px;border:none;cursor:pointer;background:transparent;
  border-bottom:2px solid transparent;font-family:'JetBrains Mono',monospace;font-size:10px;
  letter-spacing:.07em;text-transform:uppercase;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--tx3);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(56,189,248,.05);}
.lt .tab{color:var(--tx3);}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);font-weight:600;}

.body{display:grid;grid-template-columns: 1fr;min-height:calc(100vh - 94px);}
@media(min-width:1024px){.body{grid-template-columns: 220px 1fr !important;}}
.sidebar{padding:14px 12px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:18px 20px;display:flex;flex-direction:column;gap:14px;overflow-y:auto;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:8px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:14px;box-shadow:0 2px 20px rgba(3,105,161,.06);}
.dk .panel-hi{background:var(--s2);border:1px solid rgba(56,189,248,.28);border-radius:8px;box-shadow:0 0 28px rgba(56,189,248,.07);}
.lt .panel-hi{background:var(--s1);border:1.5px solid rgba(3,105,161,.22);border-radius:14px;box-shadow:0 4px 28px rgba(3,105,161,.1);}
.dk .panel-gold{background:var(--s2);border:1px solid rgba(251,191,36,.28);border-radius:8px;box-shadow:0 0 28px rgba(251,191,36,.07);}
.lt .panel-gold{background:var(--s1);border:1.5px solid rgba(180,83,9,.22);border-radius:14px;box-shadow:0 4px 28px rgba(180,83,9,.1);}

.btn-pri{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 18px;
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.09em;
  text-transform:uppercase;font-weight:500;border:none;transition:all .13s;}
.dk .btn-pri{background:var(--acc);color:#080b0f;border-radius:6px;}
.dk .btn-pri:hover{background:#7dd3fc;}
.lt .btn-pri{background:var(--acc);color:#fff;border-radius:10px;}
.lt .btn-pri:hover{background:#0284c7;}
.btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:5px 12px;
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.07em;
  text-transform:uppercase;background:transparent;transition:all .12s;}
.dk .btn-ghost{border:1px solid var(--bdr);border-radius:5px;color:var(--tx3);}
.dk .btn-ghost:hover,.dk .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(56,189,248,.07);}
.lt .btn-ghost{border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx3);}
.lt .btn-ghost:hover,.lt .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(3,105,161,.06);}
.btn-icon{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:6px;cursor:pointer;border:none;transition:all .12s;flex-shrink:0;font-size:11px;}
.dk .btn-icon{background:rgba(248,113,113,.1);color:var(--er);}
.dk .btn-icon:hover{background:rgba(248,113,113,.2);}
.lt .btn-icon{background:rgba(220,38,38,.08);color:var(--er);}
.lt .btn-icon:hover{background:rgba(220,38,38,.15);}

.inp{width:100%;padding:8px 11px;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;transition:all .13s;}
.dk .inp{background:rgba(0,0,0,.4);border:1px solid var(--bdr);color:var(--tx);border-radius:6px;}
.dk .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(56,189,248,.12);}
.lt .inp{background:#f8fbff;border:1.5px solid var(--bdr);color:var(--tx);border-radius:10px;}
.lt .inp:focus{border-color:var(--acc);}
.sel{width:100%;padding:8px 11px;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;cursor:pointer;appearance:none;}
.dk .sel{background:rgba(0,0,0,.4);border:1px solid var(--bdr);color:var(--tx);border-radius:6px;}
.lt .sel{background:#f8fbff;border:1.5px solid var(--bdr);color:var(--tx);border-radius:10px;}

.lbl{font-family:'JetBrains Mono',monospace;font-size:8.5px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(56,189,248,.5);}
.lt .lbl{color:var(--acc);}
.sec-lbl{font-family:'JetBrains Mono',monospace;font-size:7.5px;letter-spacing:.24em;text-transform:uppercase;margin-bottom:9px;}
.dk .sec-lbl{color:rgba(56,189,248,.3);}
.lt .sec-lbl{color:var(--acc);}

.hint{padding:10px 14px;display:flex;gap:9px;align-items:flex-start;font-size:12px;line-height:1.72;}
.dk .hint{border:1px solid rgba(56,189,248,.14);border-radius:7px;background:rgba(56,189,248,.04);border-left:3px solid rgba(56,189,248,.4);color:var(--tx2);}
.lt .hint{border:1.5px solid rgba(3,105,161,.14);border-radius:11px;background:rgba(3,105,161,.04);border-left:3px solid rgba(3,105,161,.3);color:var(--tx2);}
.hint-gold{padding:10px 14px;display:flex;gap:9px;align-items:flex-start;font-size:12px;line-height:1.72;}
.dk .hint-gold{border:1px solid rgba(251,191,36,.2);border-radius:7px;background:rgba(251,191,36,.04);border-left:3px solid rgba(251,191,36,.5);color:var(--tx2);}
.lt .hint-gold{border:1.5px solid rgba(180,83,9,.18);border-radius:11px;background:rgba(180,83,9,.04);border-left:3px solid rgba(180,83,9,.35);color:var(--tx2);}

.scard{padding:11px 13px;display:flex;flex-direction:column;gap:3px;}
.dk .scard{background:rgba(56,189,248,.03);border:1px solid rgba(56,189,248,.1);border-radius:7px;}
.lt .scard{background:rgba(3,105,161,.03);border:1.5px solid rgba(3,105,161,.1);border-radius:11px;}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(56,189,248,.012);border:1px dashed rgba(56,189,248,.1);border-radius:7px;}
.lt .ad{background:rgba(3,105,161,.025);border:1.5px dashed rgba(3,105,161,.12);border-radius:11px;}
.ad span{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:var(--tx3);}

.rng{width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;appearance:none;margin-top:6px;}
.dk .rng{background:rgba(56,189,248,.15);accent-color:var(--acc);}
.lt .rng{background:rgba(3,105,161,.15);accent-color:var(--acc);}

.step{padding:14px 18px;border-radius:8px;position:relative;}
.dk .step{background:rgba(0,0,0,.25);border:1px solid var(--bdr);}
.lt .step{background:rgba(3,105,161,.03);border:1.5px solid var(--bdr);}

.cost-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;}
.dk .cost-row{border-bottom:1px solid rgba(56,189,248,.05);}
.lt .cost-row{border-bottom:1px solid rgba(3,105,161,.05);}

.compare-col{padding:18px;border-radius:8px;display:flex;flex-direction:column;gap:8px;}
.dk .compare-col{border:1px solid var(--bdr);background:rgba(0,0,0,.2);}
.lt .compare-col{border:1.5px solid var(--bdr);background:var(--s1);}

.hist-row{padding:10px 14px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;transition:all .12s;gap:12px;}
.dk .hist-row{border:1px solid var(--bdr);border-radius:8px;background:var(--s2);}
.dk .hist-row:hover{border-color:rgba(56,189,248,.3);}
.lt .hist-row{border:1.5px solid var(--bdr);border-radius:12px;background:var(--s1);}
.lt .hist-row:hover{border-color:var(--acc);}

.aid-card{padding:16px 18px;border-radius:8px;}
.dk .aid-card{border:1px solid var(--bdr);background:rgba(0,0,0,.2);}
.lt .aid-card{border:1.5px solid var(--bdr);background:var(--s1);}

.prose p{font-size:13px;line-height:1.85;margin-bottom:11px;color:var(--tx2);}
.prose h3{font-family:'Outfit',sans-serif;font-size:12px;font-weight:700;margin:16px 0 6px;color:var(--tx);text-transform:uppercase;letter-spacing:.05em;}
.prose strong{font-weight:700;color:var(--tx);}
.qa{padding:12px 14px;margin-bottom:8px;}
.dk .qa{border:1px solid var(--bdr);border-radius:8px;background:rgba(0,0,0,.25);}
.lt .qa{border:1.5px solid var(--bdr);border-radius:12px;background:rgba(3,105,161,.03);}

@media(max-width:768px){
  .body{grid-template-columns:1fr!important;}
  .sidebar{display:none!important;}
}
@media(max-width:620px){.g2{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr 1fr!important;}}
`;

const TABS = [
  { id:'calc',    icon:'◈',  label:'Calculator' },
  { id:'compare', icon:'⇄',  label:'Compare' },
  { id:'roi',     icon:'↑',  label:'ROI Planner' },
  { id:'aid',     icon:'🎓', label:'Aid Types' },
  { id:'history', icon:'⌛', label:'History' },
  { id:'guide',   icon:'∑',  label:'Guide' },
];

const CURRENCIES = [
  { code:'USD', sym:'$' }, { code:'GBP', sym:'£' }, { code:'EUR', sym:'€' },
  { code:'INR', sym:'₹' }, { code:'CAD', sym:'C$' }, { code:'AUD', sym:'A$' },
];

const AID_TYPES = [
  {
    type:'Merit Scholarship', icon:'🏆', color:'var(--gold)',
    desc:'Awarded based on academic achievement, test scores, or talent. Does not need to be repaid.',
    pros:['No repayment required','Renewable if GPA maintained','Prestigious — looks good on resume'],
    cons:['GPA requirement to renew','May be taxable if exceeds tuition+fees','Competitive to obtain'],
    tips:'Always confirm renewability conditions. A scholarship lost in Year 2 can be catastrophic for your finances.',
  },
  {
    type:'Need-Based Grant', icon:'🤝', color:'var(--lo)',
    desc:'Awarded based on demonstrated financial need (family income, assets). Does not need to be repaid.',
    pros:['No repayment required','No GPA requirement typically','Can be combined with other aid'],
    cons:['May change if family income changes','FAFSA/CSS Profile required','May not cover full cost'],
    tips:'Re-file FAFSA/financial aid forms every year — your award can increase or decrease.',
  },
  {
    type:'Student Loan (Subsidized)', icon:'🏦', color:'var(--acc)',
    desc:'Government loan where interest does not accrue while you are in school at least half-time.',
    pros:['Lower interest rate than private','Interest paid by govt while in school','Income-driven repayment options'],
    cons:['Must be repaid with interest','Affects credit score','Borrowing limit per year'],
    tips:'Always exhaust grants and scholarships before taking any loans. Subsidized > unsubsidized > private.',
  },
  {
    type:'Student Loan (Unsubsidized)', icon:'💳', color:'var(--warn)',
    desc:'Government loan where interest accrues from day one, even while you are in school.',
    pros:['Available regardless of need','Higher limits than subsidized','Better rates than private loans'],
    cons:['Interest accrues immediately','Capitalizes if not paid during school','Total cost significantly higher'],
    tips:'If possible, pay at least the monthly interest while in school to prevent capitalization.',
  },
  {
    type:'Private Scholarship', icon:'🏢', color:'var(--pur)',
    desc:'Awarded by corporations, foundations, community organizations, or individuals.',
    pros:['No repayment required','Often renewable','Many niche awards with low competition'],
    cons:['May affect institutional aid','Tax implications vary','One-time vs recurring'],
    tips:'Apply to many small scholarships. A $500 award takes the same effort as a $5,000 one — but the $500 has far less competition.',
  },
  {
    type:'Work-Study Program', icon:'💼', color:'var(--rose||var(--err))',
    desc:'Part-time campus employment funded by the government to help cover education costs.',
    pros:['Earnings not counted as income on next FAFSA','Flexible hours around class schedule','On-campus experience'],
    cons:['Limited hours (10–20/hr week typically)','Must actually work for the money','May affect study time'],
    tips:'Work-study earnings are real income but excluded from the following year\'s financial aid calculation.',
  },
];

const fmt = (n, sym) => `${sym}${Math.round(Math.abs(n)).toLocaleString()}`;

const calcResult = (tuition, scholarship, living, duration, expectedSalary) => {
  const t = parseFloat(tuition)||0;
  const s = parseFloat(scholarship)||0;
  const l = parseFloat(living)||0;
  const d = parseFloat(duration)||1;
  const sal = parseFloat(expectedSalary)||0;

  const netTuition       = Math.max(0, t - s);
  const annualNetCost    = netTuition + l;
  const totalCost        = annualNetCost * d;
  const totalScholarship = s * d;
  const sticker          = (t + l) * d;
  const savings          = sticker - totalCost;
  const savingsPct       = sticker > 0 ? (savings / sticker) * 100 : 0;
  const coveragePct      = t > 0 ? Math.min(100, (s / t) * 100) : 0;
  const debtToIncome     = sal > 0 ? (totalCost / sal) * 100 : null;
  const paybackYears     = sal > 0 && sal > totalCost ? (totalCost / (sal * 0.2)) : null; // 20% of salary to loans

  return { netTuition, annualNetCost, totalCost, totalScholarship, sticker, savings, savingsPct, coveragePct, debtToIncome, paybackYears };
};

export default function ScholarshipROICalc() {
  const [dark, setDark] = useState(true);
  const [tab,  setTab]  = useState('calc');
  const dk = dark;

  const [currency, setCurrency] = useState('USD');
  const sym = CURRENCIES.find(c => c.code === currency)?.sym || '$';

  /* ── Calc inputs ── */
  const [tuition,        setTuition]        = useState(25000);
  const [scholarship,    setScholarship]    = useState(10000);
  const [living,         setLiving]         = useState(12000);
  const [duration,       setDuration]       = useState(4);
  const [expectedSalary, setExpectedSalary] = useState(55000);
  const [renewability,   setRenewability]   = useState('all'); // all | one | partial
  const [gpaReq,         setGpaReq]         = useState(3.0);

  const res = useMemo(() => calcResult(tuition, scholarship, living, duration, expectedSalary), [tuition, scholarship, living, duration, expectedSalary]);

  /* ── Compare up to 3 offers ── */
  const [offers, setOffers] = useState([
    { id:1, name:'State University',   tuition:18000, scholarship:8000,  living:10000, duration:4 },
    { id:2, name:'Private College',    tuition:52000, scholarship:25000, living:14000, duration:4 },
    { id:3, name:'Community Transfer', tuition:4000,  scholarship:1000,  living:9000,  duration:2 },
  ]);
  const updOffer = (id,f,v) => setOffers(o => o.map(x => x.id===id ? {...x,[f]:v} : x));

  /* ── ROI Planner ── */
  const [roiSalary,   setRoiSalary]   = useState(55000);
  const [roiGrowth,   setRoiGrowth]   = useState(3);
  const [roiPayPct,   setRoiPayPct]   = useState(20);
  const [roiYears,    setRoiYears]    = useState(10);

  const roiData = useMemo(() => {
    const totalDebt = res.totalCost;
    const monthlyPayment = (roiSalary * (roiPayPct/100)) / 12;
    const years = [];
    let remaining = totalDebt;
    let salary = roiSalary;
    for (let y = 1; y <= roiYears; y++) {
      const paid = monthlyPayment * 12;
      remaining = Math.max(0, remaining - paid);
      years.push({ year: y, salary: Math.round(salary), remaining: Math.round(remaining), paid: Math.round(paid) });
      salary *= (1 + roiGrowth/100);
    }
    return years;
  }, [res.totalCost, roiSalary, roiGrowth, roiPayPct, roiYears]);

  /* ── History ── */
  const [history, setHistory] = useState([]);
  const [saved,   setSaved]   = useState(false);
  const saveCalc = () => {
    setHistory(h => [{
      id:Date.now(), sym, tuition, scholarship, living, duration,
      netCost:res.annualNetCost, total:res.totalCost, savings:res.savings,
      time:new Date().toLocaleTimeString()
    }, ...h].slice(0,20));
    setSaved(true); setTimeout(() => setSaved(false), 1800);
  };
  const loadCalc = (c) => {
    setTuition(c.tuition); setScholarship(c.scholarship);
    setLiving(c.living); setDuration(c.duration); setTab('calc');
  };

  /* ── Sidebar stats ── */
  const sideStats = [
    { label:'Net Annual Cost',   val:fmt(res.annualNetCost,sym),   color:'var(--lo)' },
    { label:'Total Degree Cost', val:fmt(res.totalCost,sym),       color:'var(--er)' },
    { label:'Scholarship Value', val:fmt(res.totalScholarship,sym),color:'var(--gold)' },
    { label:'Total Savings',     val:fmt(res.savings,sym),         color:'var(--acc)' },
    { label:'Tuition Coverage',  val:`${res.coveragePct.toFixed(0)}%`, color:'var(--pur)' },
    { label:'Sticker Saved',     val:`${res.savingsPct.toFixed(0)}%`, color:'var(--lo)' },
  ];

  const steps = [
    { n:1, title:'Net Tuition',       color:'var(--acc)', formula:`${sym}${(+tuition).toLocaleString()} − ${sym}${(+scholarship).toLocaleString()}`, result:fmt(res.netTuition,sym), desc:'Subtract annual scholarship from annual tuition.' },
    { n:2, title:'Annual Net Cost',   color:'var(--pur)', formula:`${fmt(res.netTuition,sym)} + ${sym}${(+living).toLocaleString()} living`, result:fmt(res.annualNetCost,sym), desc:'Add net tuition and annual living expenses.' },
    { n:3, title:'Total Degree Cost', color:'var(--warn)', formula:`${fmt(res.annualNetCost,sym)} × ${duration} years`, result:fmt(res.totalCost,sym), desc:'Multiply annual cost by number of years in the program.' },
    { n:4, title:'Scholarship Value', color:'var(--gold)', formula:`${sym}${(+scholarship).toLocaleString()} × ${duration} years`, result:fmt(res.totalScholarship,sym), desc:'Total value of the scholarship over the degree duration.' },
  ];

  return (
    <>
      <style>{S}</style>
      <div className={dk?'dk':'lt'}>

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{ display:'flex',alignItems:'center',gap:9 }}>
            <div style={{ width:32,height:32,borderRadius:dk?6:10,display:'flex',alignItems:'center',justifyContent:'center',
              background:dk?'rgba(251,191,36,.1)':'linear-gradient(135deg,#b45309,#d97706)',
              border:dk?'1px solid rgba(251,191,36,.3)':'none' }}>
              <span style={{ fontSize:16 }}>🏆</span>
            </div>
            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:17,color:'var(--tx)' }}>
              SCHOLAR<span style={{ color:'var(--gold)' }}>.roi</span>
            </span>
          </div>
          <div style={{ flex:1 }}/>
          {/* Net cost pill */}
          <div style={{ padding:'4px 12px',borderRadius:20,border:'1px solid rgba(74,222,128,.25)',
            background:'rgba(74,222,128,.07)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--lo)',fontWeight:600 }}>
            Net {fmt(res.annualNetCost,sym)}/yr
          </div>
          <select className="sel" value={currency} onChange={e => setCurrency(e.target.value)}
            style={{ width:85,padding:'4px 8px',fontSize:10 }}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} {c.sym}</option>)}
          </select>
          <button className="btn-ghost" onClick={() => setDark(d=>!d)} style={{ padding:'5px 10px',fontSize:13 }}>{dk?'☀':'◑'}</button>
        </div>

        {/* TABBAR */}
        <div className="tabbar">
          {TABS.map(t => (
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="body">
          {/* SIDEBAR */}
          <div className="sidebar">
            <div className="sec-lbl">Scholarship Summary</div>
            {sideStats.map((s,i) => (
              <div key={i} className="scard">
                <div className="lbl" style={{ margin:0 }}>{s.label}</div>
                <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:14,color:s.color }}>{s.val}</div>
              </div>
            ))}
            
            <div className="sec-lbl" style={{ marginTop:4 }}>Quick Checks</div>
            {[
              'Compare net cost, not sticker price',
              'Confirm scholarship renewability',
              'Check GPA requirements yearly',
              'Ask about stacking other aid',
              'Debt < first year salary',
            ].map((t,i) => (
              <div key={i} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',padding:'3px 0',
                borderBottom:i<4?'1px solid var(--bdr)':'none',display:'flex',gap:6 }}>
                <span style={{ color:'var(--lo)',flexShrink:0 }}>→</span>{t}
              </div>
            ))}
            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══ CALCULATOR ══ */}
              {tab==='calc' && (
                <motion.div key="calc" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }} className="g2">
                    {/* Inputs */}
                    <div style={{ display:'flex',flexDirection:'column',gap:11 }}>
                      <div className="panel" style={{ padding:'20px 22px',display:'flex',flexDirection:'column',gap:13 }}>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:'var(--tx)',letterSpacing:'.04em' }}>OFFER DETAILS</div>

                        {[
                          { label:'Annual Tuition',         val:tuition,        set:setTuition,        max:100000, step:500 },
                          { label:'Annual Scholarship',     val:scholarship,    set:setScholarship,    max:100000, step:500 },
                          { label:'Annual Living Costs',    val:living,         set:setLiving,         max:50000,  step:250 },
                          { label:'Expected Starting Salary',val:expectedSalary,set:setExpectedSalary, max:200000, step:1000 },
                        ].map((f,i) => (
                          <div key={i}>
                            <div className="lbl">{f.label}</div>
                            <div style={{ position:'relative' }}>
                              <span style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',
                                fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:'var(--tx3)' }}>{sym}</span>
                              <input className="inp" type="number" value={f.val} onChange={e => f.set(+e.target.value)}
                                style={{ paddingLeft:sym.length>1?26:20,fontSize:14 }}/>
                            </div>
                            <input className="rng" type="range" min={0} max={f.max} step={f.step} value={f.val}
                              onChange={e => f.set(+e.target.value)}/>
                          </div>
                        ))}

                        <div>
                          <div className="lbl">Program Duration — {duration} years</div>
                          <div style={{ display:'flex',gap:5,flexWrap:'wrap' }}>
                            {[1,2,3,4,5,6].map(y => (
                              <button key={y} className={`btn-ghost ${duration===y?'on':''}`} onClick={() => setDuration(y)} style={{ fontSize:9 }}>{y}yr</button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="lbl">Scholarship Renewability</div>
                          <div style={{ display:'flex',gap:5,flexWrap:'wrap' }}>
                            {[['all','All Years'],['partial','Partial'],['one','One-Time']].map(([v,l]) => (
                              <button key={v} className={`btn-ghost ${renewability===v?'on':''}`} onClick={() => setRenewability(v)} style={{ fontSize:8.5 }}>{l}</button>
                            ))}
                          </div>
                        </div>

                        {renewability !== 'one' && (
                          <div>
                            <div className="lbl">GPA Requirement — {gpaReq.toFixed(1)}</div>
                            <input className="rng" type="range" min={2.0} max={4.0} step={0.1} value={gpaReq} onChange={e => setGpaReq(+e.target.value)} style={{ marginTop:0 }}/>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Results */}
                    <div style={{ display:'flex',flexDirection:'column',gap:11 }}>
                      {/* Hero */}
                      <div className="panel-gold" style={{ padding:'22px 24px' }}>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)',letterSpacing:'.14em',marginBottom:6 }}>NET ANNUAL COST</div>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:38,color:'var(--lo)',lineHeight:1 }}>{fmt(res.annualNetCost,sym)}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx3)',marginTop:6,marginBottom:18 }}>
                          per year · {fmt(res.totalCost,sym)} total over {duration} year{duration>1?'s':''}
                        </div>

                        {/* Coverage bar */}
                        <div className="lbl" style={{ marginBottom:5 }}>Scholarship tuition coverage</div>
                        <div style={{ height:10,borderRadius:5,overflow:'hidden',background:'var(--bdr)',marginBottom:4 }}>
                          <motion.div style={{ height:'100%',borderRadius:5,background:'var(--gold)' }}
                            initial={{ width:0 }} animate={{ width:`${res.coveragePct}%` }} transition={{ duration:0.8 }}/>
                        </div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--gold)' }}>{res.coveragePct.toFixed(0)}% of tuition covered</div>

                        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:16,paddingTop:16,borderTop:'1px solid var(--bdr)' }}>
                          {[
                            { label:'Sticker Price',     val:fmt(res.sticker,sym),          color:'var(--er)' },
                            { label:'You Pay',           val:fmt(res.totalCost,sym),         color:'var(--lo)' },
                            { label:'Scholarship Value', val:fmt(res.totalScholarship,sym),  color:'var(--gold)' },
                            { label:'You Save',          val:`${res.savingsPct.toFixed(0)}%`,color:'var(--acc)' },
                          ].map((s,i) => (
                            <div key={i}>
                              <div className="lbl" style={{ fontSize:7.5,margin:'0 0 3px' }}>{s.label}</div>
                              <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:15,color:s.color }}>{s.val}</div>
                            </div>
                          ))}
                        </div>

                        {/* Debt-to-income signal */}
                        {res.debtToIncome !== null && (
                          <div style={{ marginTop:14,padding:'10px 12px',borderRadius:7,
                            background:res.debtToIncome<100?'rgba(74,222,128,.08)':res.debtToIncome<150?'rgba(251,146,60,.08)':'rgba(248,113,113,.08)',
                            border:`1px solid ${res.debtToIncome<100?'rgba(74,222,128,.2)':res.debtToIncome<150?'rgba(251,146,60,.2)':'rgba(248,113,113,.2)'}` }}>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',marginBottom:3 }}>DEBT-TO-INCOME RATIO</div>
                            <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:18,
                              color:res.debtToIncome<100?'var(--lo)':res.debtToIncome<150?'var(--warn)':'var(--er)' }}>
                              {res.debtToIncome.toFixed(0)}%
                              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontWeight:400,fontSize:9,color:'var(--tx3)',marginLeft:8 }}>
                                {res.debtToIncome<100?'✓ Healthy':res.debtToIncome<150?'⚠ Borderline':'✗ High risk'}
                              </span>
                            </div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)',marginTop:3 }}>
                              Rule of thumb: total debt should not exceed 1× first year salary
                            </div>
                          </div>
                        )}

                        {renewability === 'one' && (
                          <div className="hint-gold" style={{ marginTop:12 }}>
                            <span>⚠</span>
                            <span>One-time scholarship: Years 2–{duration} will cost {fmt(res.annualNetCost + (+scholarship),sym)}/yr without renewal. Total with this gap: {fmt(res.annualNetCost + (+scholarship)*(duration-1),sym)}.</span>
                          </div>
                        )}
                      </div>

                      {/* Step-by-step */}
                      <div className="panel" style={{ padding:'18px 20px',display:'flex',flexDirection:'column',gap:10 }}>
                        <div className="lbl" style={{ marginBottom:4 }}>Step-by-Step Breakdown</div>
                        {steps.map((s,i) => (
                          <motion.div key={i} className="step"
                            initial={{ opacity:0,x:6 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*.06 }}>
                            <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:5 }}>
                              <div style={{ width:22,height:22,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',
                                background:s.color,flexShrink:0 }}>
                                <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,color:dk?'#080b0f':'#fff' }}>{s.n}</span>
                              </div>
                              <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12,color:'var(--tx)' }}>{s.title}</span>
                              <span style={{ flex:1 }}/>
                              <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:14,color:s.color }}>{s.result}</span>
                            </div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',marginBottom:4 }}>{s.desc}</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx2)',padding:'4px 8px',borderRadius:4,
                              background:dk?'rgba(0,0,0,.3)':'rgba(3,105,161,.04)',border:`1px solid ${s.color}22` }}>
                              {s.formula} = <span style={{ color:s.color,fontWeight:700 }}>{s.result}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <button className="btn-ghost" onClick={saveCalc} style={{ alignSelf:'flex-start',fontSize:8.5 }}>
                        {saved ? '✓ Saved!' : '⊕ Save to History'}
                      </button>
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══ COMPARE ══ */}
              {tab==='compare' && (
                <motion.div key="cmp" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>⇄</span><span>Compare up to 3 scholarship offers side by side. Edit any field to see live cost updates.</span></div>

                  <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12 }} className="g3">
                    {offers.map((offer,oi) => {
                      const oRes = calcResult(offer.tuition, offer.scholarship, offer.living, offer.duration, expectedSalary);
                      const isBest = offers.reduce((best,o) => {
                        const r = calcResult(o.tuition, o.scholarship, o.living, o.duration, expectedSalary);
                        return r.totalCost < calcResult(best.tuition, best.scholarship, best.living, best.duration, expectedSalary).totalCost ? o : best;
                      }, offers[0]).id === offer.id;
                      return (
                        <motion.div key={offer.id} className={isBest ? 'panel-hi' : 'panel'}
                          style={{ padding:'18px',borderTop:isBest?`3px solid var(--lo)`:undefined }}
                          initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ delay:oi*.08 }}>
                          {isBest && <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--lo)',marginBottom:8,letterSpacing:'.1em' }}>★ BEST DEAL</div>}
                          <input className="inp" value={offer.name} onChange={e => updOffer(offer.id,'name',e.target.value)}
                            style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:14,background:'transparent',
                              border:'none',borderBottom:'1px solid var(--bdr)',borderRadius:0,color:'var(--tx)',padding:'3px 0',marginBottom:12,width:'100%' }}/>
                          {[
                            { label:'Tuition/yr',    key:'tuition' },
                            { label:'Scholarship/yr',key:'scholarship' },
                            { label:'Living/yr',     key:'living' },
                          ].map(f => (
                            <div key={f.key} style={{ marginBottom:9 }}>
                              <div className="lbl" style={{ fontSize:7.5 }}>{f.label}</div>
                              <div style={{ position:'relative' }}>
                                <span style={{ position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>{sym}</span>
                                <input className="inp" type="number" value={offer[f.key]} onChange={e => updOffer(offer.id,f.key,+e.target.value)}
                                  style={{ paddingLeft:sym.length>1?22:18,fontSize:12 }}/>
                              </div>
                            </div>
                          ))}
                          <div style={{ marginBottom:9 }}>
                            <div className="lbl" style={{ fontSize:7.5 }}>Duration</div>
                            <div style={{ display:'flex',gap:4,flexWrap:'wrap' }}>
                              {[2,3,4,5,6].map(y => (
                                <button key={y} className={`btn-ghost ${offer.duration===y?'on':''}`}
                                  onClick={() => updOffer(offer.id,'duration',y)} style={{ fontSize:8,padding:'3px 8px' }}>{y}yr</button>
                              ))}
                            </div>
                          </div>
                          <div style={{ paddingTop:12,borderTop:'1px solid var(--bdr)' }}>
                            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:6 }}>
                              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)' }}>Net/year</span>
                              <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:'var(--acc)' }}>{fmt(oRes.annualNetCost,sym)}</span>
                            </div>
                            <div style={{ display:'flex',justifyContent:'space-between',marginBottom:8 }}>
                              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)' }}>Total cost</span>
                              <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:17,color:isBest?'var(--lo)':'var(--er)' }}>{fmt(oRes.totalCost,sym)}</span>
                            </div>
                            {/* Bar */}
                            <div style={{ height:6,background:'var(--bdr)',borderRadius:3,overflow:'hidden' }}>
                              <motion.div style={{ height:'100%',borderRadius:3,background:isBest?'var(--lo)':'var(--tx3)',opacity:isBest?1:0.4 }}
                                initial={{ width:0 }}
                                animate={{ width:`${(oRes.totalCost/Math.max(...offers.map(o => calcResult(o.tuition,o.scholarship,o.living,o.duration,0).totalCost)))*100}%` }}
                                transition={{ duration:0.7,delay:oi*.1 }}/>
                            </div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--tx3)',marginTop:5 }}>
                              Scholarship covers {oRes.coveragePct.toFixed(0)}% of tuition
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                </motion.div>
              )}

              {/* ══ ROI PLANNER ══ */}
              {tab==='roi' && (
                <motion.div key="roi" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>↑</span><span>Project your debt repayment timeline. Based on your total degree cost of <strong>{fmt(res.totalCost,sym)}</strong> and {roiPayPct}% of salary toward repayments.</span></div>

                  <div className="panel" style={{ padding:'18px 22px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }} >
                    {[
                      { label:`Starting Salary`,     val:roiSalary,   set:setRoiSalary,   min:20000, max:200000, step:1000, pfx:sym },
                      { label:`Annual Salary Growth`,val:roiGrowth,   set:setRoiGrowth,   min:0,     max:15,     step:0.5,  sfx:'%' },
                      { label:`% of Salary to Debt`, val:roiPayPct,   set:setRoiPayPct,   min:5,     max:40,     step:1,    sfx:'%' },
                      { label:`Projection Years`,    val:roiYears,    set:setRoiYears,    min:1,     max:30,     step:1 },
                    ].map((f,i) => (
                      <div key={i}>
                        <div className="lbl">{f.label} — {f.pfx||''}{f.val}{f.sfx||''}</div>
                        <input className="rng" type="range" min={f.min} max={f.max} step={f.step} value={f.val}
                          onChange={e => f.set(+e.target.value)} style={{ marginTop:0 }}/>
                      </div>
                    ))}
                  </div>

                  {/* Timeline */}
                  <div className="panel-hi" style={{ padding:'18px 20px' }}>
                    <div className="lbl" style={{ marginBottom:12 }}>Repayment Projection ({roiYears} years)</div>
                    <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                      {roiData.map((yr,i) => (
                        <div key={i} style={{ display:'grid',gridTemplateColumns:'40px 1fr 100px 110px',gap:10,alignItems:'center' }}>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>Yr {yr.year}</div>
                          <div style={{ height:8,background:'var(--bdr)',borderRadius:4,overflow:'hidden' }}>
                            <motion.div style={{ height:'100%',borderRadius:4,
                              background:yr.remaining>0?'var(--er)':'var(--lo)' }}
                              initial={{ width:0 }}
                              animate={{ width:`${res.totalCost>0?(yr.remaining/res.totalCost)*100:0}%` }}
                              transition={{ duration:0.5,delay:i*.03 }}/>
                          </div>
                          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:12,color:'var(--acc)',textAlign:'right' }}>
                            {sym}{(yr.salary/1000).toFixed(0)}K/yr
                          </div>
                          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:13,color:yr.remaining>0?'var(--er)':'var(--lo)',textAlign:'right' }}>
                            {yr.remaining>0?`${fmt(yr.remaining,sym)} left`:'✓ Paid off'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </motion.div>
              )}

              {/* ══ AID TYPES ══ */}
              {tab==='aid' && (
                <motion.div key="aid" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>🎓</span><span>Understanding the difference between aid types is essential. Not all aid is created equal — grants and scholarships are always better than loans.</span></div>
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }} className="g2">
                    {AID_TYPES.map((aid,i) => (
                      <motion.div key={i} className="aid-card"
                        style={{ borderLeft:`3px solid ${aid.color}` }}
                        initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*.06 }}>
                        <div style={{ display:'flex',alignItems:'center',gap:9,marginBottom:10 }}>
                          <span style={{ fontSize:20 }}>{aid.icon}</span>
                          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:aid.color }}>{aid.type}</div>
                        </div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx2)',lineHeight:1.65,marginBottom:10 }}>{aid.desc}</div>
                        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10 }}>
                          <div>
                            {aid.pros.map((p,j) => <div key={j} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--lo)',padding:'2px 0' }}>✓ {p}</div>)}
                          </div>
                          <div>
                            {aid.cons.map((c,j) => <div key={j} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--er)',padding:'2px 0' }}>✗ {c}</div>)}
                          </div>
                        </div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--gold)',padding:'7px 10px',borderRadius:5,
                          background:dk?'rgba(251,191,36,.05)':'rgba(180,83,9,.04)',border:`1px solid rgba(251,191,36,.15)` }}>
                          💡 {aid.tips}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                </motion.div>
              )}

              {/* ══ HISTORY ══ */}
              {tab==='history' && (
                <motion.div key="hist" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:10 }}>
                  <div className="hint"><span>⌛</span><span>Session history. Click any row to restore that calculation.</span></div>
                  {history.length === 0
                    ? <div style={{ textAlign:'center',padding:'60px',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'var(--tx3)' }}>No saved calculations yet.</div>
                    : history.map((h,i) => (
                        <motion.div key={h.id} className="hist-row"
                          initial={{ opacity:0,x:-6 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*.03 }}
                          onClick={() => loadCalc(h)}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--tx2)',marginBottom:2 }}>
                              Tuition {h.sym}{(+h.tuition).toLocaleString()} · Scholarship {h.sym}{(+h.scholarship).toLocaleString()} · {h.duration}yr
                            </div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>{h.time}</div>
                          </div>
                          <div style={{ textAlign:'right' }}>
                            <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:17,color:'var(--lo)' }}>{h.sym}{Math.round(h.netCost).toLocaleString()}/yr</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)' }}>Total: {h.sym}{Math.round(h.total).toLocaleString()}</div>
                          </div>
                        </motion.div>
                      ))
                  }
                  {history.length > 0 && <button className="btn-ghost" onClick={() => {}} style={{ alignSelf:'flex-start',fontSize:8 }}>Clear</button>}
                  
                </motion.div>
              )}

              {/* ══ GUIDE ══ */}
              {tab==='guide' && (
                <motion.div key="guide" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}>
                  <div className="panel" style={{ padding:'26px 30px',marginBottom:14 }}>
                    <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:26,color:'var(--tx)',marginBottom:4 }}>
                      Is It Worth It? Calculating the Real ROI of Your Scholarship
                    </div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx3)',marginBottom:24,letterSpacing:'.12em' }}>
                      NET COST · ROI · AID STRATEGY · FAQ
                    </div>
                    <div className="prose">
                      <h3>Net Cost vs Sticker Price</h3>
                      <p>A <strong>{sym}10,000 scholarship</strong> at a {sym}50,000/yr university leaves you paying {sym}40,000/yr. That same scholarship at a {sym}15,000/yr public college covers 67% of tuition. Always compare <strong>net cost</strong> — what you actually pay after all aid — not the sticker price.</p>
                      <h3>The Debt-to-Income Rule</h3>
                      <p>A widely used benchmark: <strong>total student debt should not exceed your expected first-year salary</strong>. If you expect to earn {sym}50,000 after graduation, your total loan burden should ideally stay below {sym}50,000. Above 1.5× salary is considered high-risk territory.</p>
                      <h3>Renewability is Everything</h3>
                      <p>A scholarship that requires a 3.5 GPA and disappears in Year 2 can be financially catastrophic. Before accepting any offer, confirm: is it renewable for all years? What GPA must you maintain? What happens if you change majors? Can you stack it with other institutional grants?</p>
                      <h3>Hidden Costs Beyond Tuition</h3>
                      <p>Total cost of attendance includes tuition, fees, housing, food, books, transport, and personal expenses. In cities like New York, London, or Sydney, <strong>living costs can easily exceed tuition</strong>. A "full scholarship" at an expensive urban university may cost more than a partial scholarship at a rural campus.</p>
                      {[
                        { q:'Can scholarships be used for living expenses?', a:'Many scholarships specify allowed uses. "Full-ride" scholarships often cover room and board. However, scholarship money used for non-tuition expenses is often taxable income in the US and other countries. Always verify the terms and consult a financial aid advisor.' },
                        { q:'What happens if I lose my scholarship?', a:'This is a critical risk. If your GPA falls below the requirement, the scholarship disappears — and you\'ve already committed to a university based on that funding. Always have a Plan B: know exactly what your costs would be without the scholarship, and whether you could cover the gap with loans or other aid.' },
                        { q:'Should I pick the school with the most scholarship money?', a:'Not necessarily. The best deal is the school with the lowest net cost for the highest quality of education relevant to your goals. A {sym}30,000 scholarship at a {sym}60,000/yr school (net {sym}30K/yr) may be worse than a {sym}5,000 scholarship at a {sym}15,000/yr school (net {sym}10K/yr).' },
                        { q:'Do scholarships affect other financial aid?', a:'Yes. At many universities, receiving a private scholarship reduces your need-based institutional aid dollar-for-dollar — a phenomenon called "displacement." Always notify your financial aid office and ask how external scholarships will affect your existing package before applying.' },
                      ].map(({ q, a },i) => (
                        <div key={i} className="qa">
                          <div style={{ fontSize:12.5,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:'var(--tx)',marginBottom:6 }}>{q}</div>
                          <div style={{ fontSize:13,color:'var(--tx2)',lineHeight:1.8 }}>{a}</div>
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