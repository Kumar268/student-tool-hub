import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   BUDGET.student — Student Budget Planner
   Clean Modern · JetBrains Mono + Outfit
   TABS: ◈ Budget · ⊞ 50/30/20 · ↑ Goals · 🎓 Discounts · 📅 Semester · 💳 Debt · ∑ Tips
═══════════════════════════════════════════════════════════════════ */

const S = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{font-family:'Outfit',sans-serif;}
.dk{--bg:#080b0f;--s1:#0d1117;--s2:#131920;--bdr:#1e2d3d;
  --acc:#38bdf8;--lo:#4ade80;--er:#f87171;--pur:#c084fc;--warn:#fb923c;--gold:#fbbf24;--rose:#fb7185;
  --tx:#e2eaf4;--tx2:#94a3b8;--tx3:#3d5a78;
  background:var(--bg);color:var(--tx);min-height:100vh;
  background-image:radial-gradient(ellipse 60% 40% at 50% -5%,rgba(56,189,248,.06),transparent 60%),
    radial-gradient(ellipse 40% 30% at 80% 95%,rgba(192,132,252,.04),transparent 60%);}
.lt{--bg:#f0f4f8;--s1:#fff;--s2:#e8f0f8;--bdr:#c5d8ec;
  --acc:#0369a1;--lo:#15803d;--er:#dc2626;--pur:#7c3aed;--warn:#c2410c;--gold:#b45309;--rose:#e11d48;
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
.btn-add{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;cursor:pointer;
  font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.08em;text-transform:uppercase;border:none;border-radius:6px;transition:all .12s;}
.dk .btn-add.green{background:rgba(74,222,128,.1);color:var(--lo);border:1px solid rgba(74,222,128,.2);}
.dk .btn-add.green:hover{background:rgba(74,222,128,.18);}
.dk .btn-add.red{background:rgba(248,113,113,.1);color:var(--er);border:1px solid rgba(248,113,113,.2);}
.dk .btn-add.red:hover{background:rgba(248,113,113,.18);}
.lt .btn-add.green{background:rgba(21,128,61,.08);color:var(--lo);border:1.5px solid rgba(21,128,61,.2);}
.lt .btn-add.green:hover{background:rgba(21,128,61,.15);}
.lt .btn-add.red{background:rgba(220,38,38,.07);color:var(--er);border:1.5px solid rgba(220,38,38,.15);}
.lt .btn-add.red:hover{background:rgba(220,38,38,.13);}

.inp{width:100%;padding:8px 11px;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;transition:all .13s;}
.dk .inp{background:rgba(0,0,0,.4);border:1px solid var(--bdr);color:var(--tx);border-radius:6px;}
.dk .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(56,189,248,.12);}
.lt .inp{background:#f8fbff;border:1.5px solid var(--bdr);color:var(--tx);border-radius:10px;}
.lt .inp:focus{border-color:var(--acc);}
.sel{width:100%;padding:8px 11px;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;cursor:pointer;appearance:none;transition:all .13s;}
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

.row-item{display:flex;align-items:center;gap:8px;padding:6px 0;}
.dk .row-item{border-bottom:1px solid rgba(56,189,248,.05);}
.lt .row-item{border-bottom:1px solid rgba(3,105,161,.05);}

.disc-chip{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;
  font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.04em;}
.dk .disc-chip{background:rgba(74,222,128,.08);border:1px solid rgba(74,222,128,.2);color:var(--lo);}
.lt .disc-chip{background:rgba(21,128,61,.07);border:1px solid rgba(21,128,61,.2);color:var(--lo);}

.debt-card{padding:16px 18px;border-radius:8px;display:flex;flex-direction:column;gap:10px;}
.dk .debt-card{border:1px solid var(--bdr);background:rgba(0,0,0,.25);}
.lt .debt-card{border:1.5px solid var(--bdr);background:var(--s1);}

.prose p{font-size:13px;line-height:1.85;margin-bottom:11px;color:var(--tx2);}
.prose h3{font-family:'Outfit',sans-serif;font-size:12px;font-weight:700;margin:16px 0 6px;color:var(--tx);text-transform:uppercase;letter-spacing:.05em;}
.prose strong{font-weight:700;color:var(--tx);}
.qa{padding:12px 14px;margin-bottom:8px;}
.dk .qa{border:1px solid var(--bdr);border-radius:8px;background:rgba(0,0,0,.25);}
.lt .qa{border:1.5px solid var(--bdr);border-radius:12px;background:rgba(3,105,161,.03);}

@media(max-width:768px){
  .body{grid-template-columns:1fr!important;}
  .sidebar{display:none!important;}
  .mob-btn{display:flex!important;}
}
@media(min-width:769px){.mob-btn{display:none!important;}}
@media(max-width:560px){.g2{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr 1fr!important;}}
`;

const TABS = [
  { id:'budget',    icon:'◈',  label:'Budget'    },
  { id:'rule',      icon:'⊞',  label:'50/30/20'  },
  { id:'goals',     icon:'↑',  label:'Goals'     },
  { id:'discounts', icon:'🎓', label:'Discounts' },
  { id:'semester',  icon:'📅', label:'Semester'  },
  { id:'debt',      icon:'💳', label:'Debt'      },
  { id:'tips',      icon:'∑',  label:'Tips'      },
];

const CURRENCIES = [
  { code:'USD', sym:'$' }, { code:'GBP', sym:'£' }, { code:'EUR', sym:'€' },
  { code:'INR', sym:'₹' }, { code:'CAD', sym:'C$' }, { code:'AUD', sym:'A$' },
  { code:'JPY', sym:'¥' }, { code:'SGD', sym:'S$' },
];

const SEM_CATS = ['Tuition & Fees','Housing','Food','Transport','Books & Supplies','Health','Entertainment','Clothing','Technology','Emergency Fund','Other'];

const DISCOUNTS = {
  'Global': [
    { name:'GitHub Student Pack',      cat:'Software',      saving:'$200+/yr',   url:'education.github.com',  tip:'Free Canva Pro, JetBrains IDEs, DigitalOcean credits, Namecheap domain and 100+ tools.' },
    { name:'Spotify Student',          cat:'Music',         saving:'50% off',    url:'spotify.com/student',   tip:'Includes Hulu and SHOWTIME in the US. Available in 30+ countries.' },
    { name:'Notion Education',         cat:'Productivity',  saving:'Free Plus',  url:'notion.so/students',    tip:'Unlimited pages and blocks. Perfect for notes and project management.' },
    { name:'Figma Education',          cat:'Design',        saving:'Free Pro',   url:'figma.com/education',   tip:'Full Figma and FigJam access — essential for design students.' },
    { name:'Microsoft 365 Education',  cat:'Software',      saving:'Free',       url:'microsoft.com/education',tip:'Word, Excel, PowerPoint, Teams and 1TB OneDrive via .edu email.' },
    { name:'Apple Music Student',      cat:'Music',         saving:'50% off',    url:'apple.com/student',     tip:'~$5.99/mo. Includes Apple TV+ in some regions.' },
  ],
  'USA': [
    { name:'Amazon Prime Student',  cat:'Shopping',   saving:'50% off',     url:'amazon.com/prime/student', tip:'6-month free trial, then 50% off. Includes Prime Video, Music and free 2-day shipping.' },
    { name:'Apple Student Discount',cat:'Hardware',   saving:'Up to $200',  url:'apple.com/education',      tip:'Best deal during Back to School promotion (July–Aug). Stackable with trade-in.' },
    { name:'Dell University',       cat:'Hardware',   saving:'10–15% off',  url:'dell.com/university',      tip:'Register with .edu email. Stackable with other offers.' },
    { name:'Chegg',                 cat:'Education',  saving:'Discounted',  url:'chegg.com',                tip:'Textbook rentals and homework help. Can save hundreds vs buying new books.' },
    { name:'Unidays / StudentBeans',cat:'Fashion',    saving:'10–30% off',  url:'myunidays.com',            tip:'Nike, ASOS, PrettyLittleThing and hundreds more. Always check before buying.' },
  ],
  'UK': [
    { name:'TOTUM Card',            cat:'All',      saving:'Various',      url:'totum.com',               tip:'Essential UK student card — Cineworld, Co-op, ASOS, Greggs and more.' },
    { name:'16-25 Railcard',        cat:'Travel',   saving:'33% off',      url:'16-25railcard.co.uk',     tip:'Pays for itself after 2–3 trips. Usable until 31st birthday.' },
    { name:'Student Oyster Card',   cat:'Travel',   saving:'30% off TfL',  url:'tfl.gov.uk',              tip:'30% off London Travelcards and Bus & Tram passes.' },
    { name:'Amazon Prime Student',  cat:'Shopping', saving:'50% off',      url:'amazon.co.uk',            tip:'6-month free trial. Prime delivery to campus is genuinely useful.' },
    { name:'UNIDAYS UK',            cat:'Fashion',  saving:'10–50% off',   url:'myunidays.com',           tip:'Dr. Martens, boohoo, New Look, PrettyLittleThing and more.' },
  ],
  'India': [
    { name:'GitHub Student Pack',   cat:'Software',      saving:'₹15,000+',   url:'education.github.com',  tip:'Most valuable free resource for CS students globally.' },
    { name:'Swiggy Student Club',   cat:'Food',          saving:'Up to 40%',  url:'swiggy.com',            tip:'Regular discounts and free delivery passes. Check the app promotions tab.' },
    { name:'Coursera India',        cat:'Education',     saving:'Up to 75%',  url:'coursera.org',          tip:'Many certificates heavily discounted. Financial aid also available.' },
    { name:'BookMyShow Student',    cat:'Entertainment', saving:'Up to 25%',  url:'bookmyshow.com',        tip:'Valid on select movies and events with student ID.' },
  ],
  'Australia': [
    { name:'Student Edge',          cat:'All',     saving:'Various',      url:'studentedge.com.au',   tip:'Australian student hub — JB Hi-Fi, Menulog, fashion and more.' },
    { name:'ISIC Australia',        cat:'All',     saving:'Various',      url:'isic.com.au',          tip:'International Student Identity Card. Valid in 130+ countries.' },
    { name:'JB Hi-Fi Education',    cat:'Hardware',saving:'10–15% off',   url:'jbhifi.com.au',        tip:'Good discounts on laptops and tablets with student ID.' },
    { name:'Student Opal/Myki',     cat:'Travel',  saving:'50%+ off',     url:'translink.com.au',     tip:'State-based student transit cards offer massive savings.' },
  ],
  'Canada': [
    { name:'VIA Rail Student',      cat:'Travel',   saving:'35% off',  url:'viarail.ca',       tip:'35% discount for under-25 students on Canadian train routes.' },
    { name:'SPC Card',              cat:'All',      saving:'10–30%',   url:'spccard.ca',       tip:'Canadian student discount card — Levi\'s, Aldo and more.' },
    { name:'Amazon Prime Student',  cat:'Shopping', saving:'50% off',  url:'amazon.ca',        tip:'6-month free trial. Helps offset Canada\'s high shipping costs.' },
    { name:'Spotify Student CA',    cat:'Music',    saving:'50% off',  url:'spotify.com/ca',   tip:'~$5.99 CAD/mo vs $10.99. Same full Spotify access.' },
  ],
};

const GOAL_COLORS = ['var(--lo)','var(--acc)','var(--pur)','var(--gold)','var(--warn)','var(--rose)'];

const calcPayoff = (balance, rate, payment) => {
  if (payment <= 0 || balance <= 0) return { months: Infinity, totalInterest: 0 };
  const r = rate / 100 / 12;
  if (r === 0) return { months: Math.ceil(balance / payment), totalInterest: 0 };
  const m = -Math.log(1 - (r * balance) / payment) / Math.log(1 + r);
  const months = Math.ceil(m);
  const totalInterest = Math.max(0, payment * months - balance);
  return { months: isFinite(months) ? months : Infinity, totalInterest };
};

const fmtN = (n, sym) => `${sym}${Math.abs(n).toLocaleString(undefined, { minimumFractionDigits:2, maximumFractionDigits:2 })}`;

export default function StudentBudgeting() {
  const [dark, setDark] = useState(true);
  const [tab,  setTab]  = useState('budget');
  const dk = dark;

  const [currency, setCurrency] = useState('USD');
  const sym = CURRENCIES.find(c => c.code === currency)?.sym || '$';
  const fmt = n => fmtN(n, sym);

  /* ── Budget ── */
  const [income, setIncome] = useState([
    { id:1, name:'Scholarship / Grant', amount:1000 },
    { id:2, name:'Part-time Job',       amount:600  },
    { id:3, name:'Family Support',      amount:300  },
  ]);
  const [expenses, setExpenses] = useState([
    { id:1, name:'Rent',          amount:700 },
    { id:2, name:'Groceries',     amount:200 },
    { id:3, name:'Transport',     amount:80  },
    { id:4, name:'Subscriptions', amount:30  },
    { id:5, name:'Phone Bill',    amount:50  },
  ]);
  const [period, setPeriod] = useState('monthly');
  const periodMult = period==='weekly' ? 1/4.33 : period==='annual' ? 12 : 1;

  const bSummary = useMemo(() => {
    const totalIncome   = income.reduce((s,i)   => s + (parseFloat(i.amount)||0), 0) * periodMult;
    const totalExpenses = expenses.reduce((s,e) => s + (parseFloat(e.amount)||0), 0) * periodMult;
    const savings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
    return { totalIncome, totalExpenses, savings, savingsRate };
  }, [income, expenses, periodMult]);

  const addIncome  = () => setIncome(p  => [...p, { id:Date.now(), name:'New Income',  amount:0 }]);
  const addExpense = () => setExpenses(p => [...p, { id:Date.now(), name:'New Expense', amount:0 }]);
  const updIncome  = (id,f,v) => setIncome(p  => p.map(x => x.id===id ? {...x,[f]:v} : x));
  const updExpense = (id,f,v) => setExpenses(p => p.map(x => x.id===id ? {...x,[f]:v} : x));
  const delIncome  = id => setIncome(p  => p.filter(x => x.id!==id));
  const delExpense = id => setExpenses(p => p.filter(x => x.id!==id));

  /* ── 50/30/20 ── */
  const [ruleIncome, setRuleIncome] = useState(2000);

  /* ── Goals ── */
  const [goals, setGoals] = useState([
    { id:1, name:'Emergency Fund', target:1000, saved:200, deadline:'2025-06-01', color:'var(--lo)' },
    { id:2, name:'Laptop Upgrade', target:800,  saved:350, deadline:'2025-12-01', color:'var(--acc)' },
    { id:3, name:'Summer Trip',    target:1500, saved:100, deadline:'2025-08-01', color:'var(--pur)' },
  ]);
  const addGoal = () => setGoals(p => [...p, { id:Date.now(), name:'New Goal', target:500, saved:0, deadline:'', color:'var(--gold)' }]);
  const updGoal = (id,f,v) => setGoals(p => p.map(x => x.id===id ? {...x,[f]:v} : x));
  const delGoal = id => setGoals(p => p.filter(x => x.id!==id));

  /* ── Discounts ── */
  const [discRegion, setDiscRegion] = useState('Global');

  /* ── Semester ── */
  const [semName,  setSemName]  = useState('Spring 2025');
  const [semWeeks, setSemWeeks] = useState(16);
  const [semItems, setSemItems] = useState([
    { id:1, cat:'Tuition & Fees',   name:'Tuition',    budget:5000, actual:5000 },
    { id:2, cat:'Housing',          name:'Dorm / Rent', budget:4800, actual:4800 },
    { id:3, cat:'Food',             name:'Meal Plan',   budget:2000, actual:1850 },
    { id:4, cat:'Books & Supplies', name:'Textbooks',   budget:400,  actual:320  },
    { id:5, cat:'Transport',        name:'Bus Pass',    budget:200,  actual:200  },
    { id:6, cat:'Entertainment',    name:'Going out',   budget:300,  actual:420  },
  ]);
  const addSemItem = () => setSemItems(p => [...p, { id:Date.now(), cat:'Other', name:'New Item', budget:0, actual:0 }]);
  const updSemItem = (id,f,v) => setSemItems(p => p.map(x => x.id===id ? {...x,[f]:v} : x));
  const delSemItem = id => setSemItems(p => p.filter(x => x.id!==id));
  const semSum = useMemo(() => {
    const budget = semItems.reduce((s,i) => s+(parseFloat(i.budget)||0), 0);
    const actual = semItems.reduce((s,i) => s+(parseFloat(i.actual)||0), 0);
    return { budget, actual, diff: budget - actual };
  }, [semItems]);

  /* ── Debt ── */
  const [debts, setDebts] = useState([
    { id:1, name:'Student Loan', balance:15000, rate:5.5, payment:200, color:'var(--er)' },
    { id:2, name:'Credit Card',  balance:800,   rate:22,  payment:50,  color:'var(--warn)' },
  ]);
  const addDebt = () => setDebts(p => [...p, { id:Date.now(), name:'New Debt', balance:1000, rate:6, payment:50, color:'var(--pur)' }]);
  const updDebt = (id,f,v) => setDebts(p => p.map(x => x.id===id ? {...x,[f]:v} : x));
  const delDebt = id => setDebts(p => p.filter(x => x.id!==id));
  const debtSum = useMemo(() => ({
    totalBalance:   debts.reduce((s,d) => s+(parseFloat(d.balance)||0), 0),
    totalPayment:   debts.reduce((s,d) => s+(parseFloat(d.payment)||0), 0),
    totalInterest:  debts.reduce((s,d) => { const {totalInterest} = calcPayoff(parseFloat(d.balance)||0, parseFloat(d.rate)||0, parseFloat(d.payment)||0); return s+totalInterest; }, 0),
  }), [debts]);

  /* ── Sidebar ── */
  const sideStats = [
    { label:'Monthly Income',   val:fmt(bSummary.totalIncome/periodMult),   color:'var(--lo)' },
    { label:'Monthly Expenses', val:fmt(bSummary.totalExpenses/periodMult), color:'var(--er)' },
    { label:'Net Savings',      val:fmt(bSummary.savings),                  color:bSummary.savings>=0?'var(--lo)':'var(--er)' },
    { label:'Savings Rate',     val:`${bSummary.savingsRate.toFixed(1)}%`,  color:'var(--acc)' },
    { label:'Goals Active',     val:`${goals.length}`,                       color:'var(--pur)' },
    { label:'Total Debt',       val:fmt(debtSum.totalBalance),              color:'var(--warn)' },
  ];

  return (
    <>
      <style>{S}</style>
      <div className={dk?'dk':'lt'}>

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{ display:'flex',alignItems:'center',gap:9 }}>
            <div style={{ width:32,height:32,borderRadius:dk?6:10,display:'flex',alignItems:'center',justifyContent:'center',
              background:dk?'rgba(56,189,248,.1)':'linear-gradient(135deg,#0369a1,#0ea5e9)',
              border:dk?'1px solid rgba(56,189,248,.3)':'none' }}>
              <span style={{ fontSize:15 }}>🎓</span>
            </div>
            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:17,color:'var(--tx)' }}>
              BUDGET<span style={{ color:'var(--acc)' }}>.student</span>
            </span>
          </div>
          <div style={{ flex:1 }}/>
          <div style={{ padding:'4px 12px',borderRadius:20,fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:600,
            border:`1px solid ${bSummary.savings>=0?'rgba(74,222,128,.25)':'rgba(248,113,113,.25)'}`,
            background:bSummary.savings>=0?'rgba(74,222,128,.07)':'rgba(248,113,113,.07)',
            color:bSummary.savings>=0?'var(--lo)':'var(--er)' }}>
            {bSummary.savings>=0?'+':''}{fmt(bSummary.savings/periodMult)}/mo
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
            <div className="sec-lbl">Financial Snapshot</div>
            {sideStats.map((s,i) => (
              <div key={i} className="scard">
                <div className="lbl" style={{ margin:0 }}>{s.label}</div>
                <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:14,color:s.color }}>{s.val}</div>
              </div>
            ))}
            
            <div className="sec-lbl" style={{ marginTop:4 }}>Quick Tips</div>
            {['Pay yourself first','Automate savings transfers','Cook at home 5x/week','Use student ID everywhere','Track daily spending'].map((t,i) => (
              <div key={i} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',padding:'3px 0',
                borderBottom:i<4?'1px solid var(--bdr)':'none',display:'flex',gap:6 }}>
                <span style={{ color:'var(--lo)',flexShrink:0 }}>→</span>{t}
              </div>
            ))}
            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══ BUDGET ══ */}
              {tab==='budget' && (
                <motion.div key="bud" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  

                  {/* Period toggle */}
                  <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                    <div className="lbl" style={{ margin:0 }}>Period:</div>
                    {[['monthly','Monthly'],['weekly','Weekly'],['annual','Annual']].map(([v,l]) => (
                      <button key={v} className={`btn-ghost ${period===v?'on':''}`} onClick={() => setPeriod(v)}>{l}</button>
                    ))}
                  </div>

                  {/* Hero summary */}
                  <div className="panel-hi" style={{ padding:'20px 24px' }}>
                    <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:16 }}>
                      {[
                        { label:'Total Income',   val:fmt(bSummary.totalIncome),   color:'var(--lo)' },
                        { label:'Total Expenses', val:fmt(bSummary.totalExpenses), color:'var(--er)' },
                        { label:'Net Savings',    val:fmt(bSummary.savings),       color:bSummary.savings>=0?'var(--lo)':'var(--er)' },
                      ].map((s,i) => (
                        <div key={i} style={{ textAlign:'center' }}>
                          <div className="lbl" style={{ marginBottom:5,textAlign:'center' }}>{s.label}</div>
                          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:22,color:s.color }}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ height:8,background:'var(--bdr)',borderRadius:4,overflow:'hidden' }}>
                      <motion.div style={{ height:'100%',borderRadius:4,
                        background:bSummary.totalExpenses > bSummary.totalIncome ? 'var(--er)' : 'linear-gradient(90deg,var(--lo),var(--acc))',
                        width:`${bSummary.totalIncome>0 ? Math.min(100,(bSummary.totalExpenses/bSummary.totalIncome)*100) : 0}%` }}
                        initial={{ width:0 }} animate={{ width:`${bSummary.totalIncome>0 ? Math.min(100,(bSummary.totalExpenses/bSummary.totalIncome)*100) : 0}%` }}
                        transition={{ duration:0.7 }}/>
                    </div>
                    <div style={{ display:'flex',justifyContent:'space-between',marginTop:5,fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)' }}>
                      <span style={{ color:'var(--lo)' }}>■ Income</span>
                      <span style={{ color:'var(--acc)' }}>Savings rate: {bSummary.savingsRate.toFixed(1)}%</span>
                      <span style={{ color:'var(--er)' }}>■ Expenses</span>
                    </div>
                  </div>

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }} className="g2">
                    {/* Income panel */}
                    <div className="panel" style={{ padding:'18px 20px' }}>
                      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:'var(--lo)' }}>◎ Income</div>
                        <button className="btn-add green" onClick={addIncome}>+ Add</button>
                      </div>
                      <AnimatePresence>
                        {income.map(item => (
                          <motion.div key={item.id} className="row-item"
                            initial={{ opacity:0,x:-8 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,height:0 }}>
                            <input className="inp" value={item.name} onChange={e => updIncome(item.id,'name',e.target.value)}
                              style={{ flex:1,padding:'6px 9px',fontSize:11 }}/>
                            <div style={{ position:'relative',width:100,flexShrink:0 }}>
                              <span style={{ position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>{sym}</span>
                              <input className="inp" type="number" value={item.amount} onChange={e => updIncome(item.id,'amount',e.target.value)}
                                style={{ paddingLeft:sym.length>1?22:18,fontSize:11,width:'100%',padding:'6px 9px 6px '+(sym.length>1?22:18)+'px' }}/>
                            </div>
                            <button className="btn-icon" onClick={() => delIncome(item.id)}>✕</button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <div style={{ display:'flex',justifyContent:'space-between',paddingTop:10,marginTop:6,borderTop:'1px solid var(--bdr)' }}>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',letterSpacing:'.1em' }}>TOTAL</span>
                        <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:17,color:'var(--lo)' }}>{fmt(bSummary.totalIncome)}</span>
                      </div>
                    </div>

                    {/* Expenses panel */}
                    <div className="panel" style={{ padding:'18px 20px' }}>
                      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:'var(--er)' }}>◎ Expenses</div>
                        <button className="btn-add red" onClick={addExpense}>+ Add</button>
                      </div>
                      <AnimatePresence>
                        {expenses.map(item => (
                          <motion.div key={item.id} className="row-item"
                            initial={{ opacity:0,x:-8 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,height:0 }}>
                            <input className="inp" value={item.name} onChange={e => updExpense(item.id,'name',e.target.value)}
                              style={{ flex:1,padding:'6px 9px',fontSize:11 }}/>
                            <div style={{ position:'relative',width:100,flexShrink:0 }}>
                              <span style={{ position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>{sym}</span>
                              <input className="inp" type="number" value={item.amount} onChange={e => updExpense(item.id,'amount',e.target.value)}
                                style={{ paddingLeft:sym.length>1?22:18,fontSize:11,width:'100%',padding:'6px 9px 6px '+(sym.length>1?22:18)+'px' }}/>
                            </div>
                            <button className="btn-icon" onClick={() => delExpense(item.id)}>✕</button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <div style={{ display:'flex',justifyContent:'space-between',paddingTop:10,marginTop:6,borderTop:'1px solid var(--bdr)' }}>
                        <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',letterSpacing:'.1em' }}>TOTAL</span>
                        <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:17,color:'var(--er)' }}>{fmt(bSummary.totalExpenses)}</span>
                      </div>
                    </div>
                  </div>
                  
                </motion.div>
              )}

              {/* ══ 50/30/20 ══ */}
              {tab==='rule' && (
                <motion.div key="rule" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>⊞</span><span>50% Needs · 30% Wants · 20% Savings. For students, the ratios may shift — but savings should always come first.</span></div>

                  <div className="panel" style={{ padding:'18px 22px' }}>
                    <div className="lbl">Monthly After-Tax Income</div>
                    <div style={{ display:'flex',alignItems:'center',gap:10,maxWidth:300 }}>
                      <div style={{ position:'relative',flex:1 }}>
                        <span style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',fontFamily:"'JetBrains Mono',monospace",fontSize:14,color:'var(--tx3)' }}>{sym}</span>
                        <input className="inp" type="number" value={ruleIncome} onChange={e => setRuleIncome(+e.target.value)} style={{ paddingLeft:24,fontSize:15 }}/>
                      </div>
                    </div>
                    <input className="rng" type="range" min={200} max={10000} step={50} value={ruleIncome} onChange={e => setRuleIncome(+e.target.value)} style={{ maxWidth:300 }}/>
                  </div>

                  {/* Animated stacked bar */}
                  <div className="panel-hi" style={{ padding:'22px 24px' }}>
                    <div style={{ height:36,borderRadius:10,overflow:'hidden',display:'flex',marginBottom:18 }}>
                      {[['50%','var(--acc)',50],['30%','var(--pur)',30],['20%','var(--lo)',20]].map(([l,c,p],i) => (
                        <motion.div key={i} style={{ height:'100%',background:c,display:'flex',alignItems:'center',justifyContent:'center' }}
                          initial={{ width:0 }} animate={{ width:`${p}%` }} transition={{ duration:0.7,delay:i*.1 }}>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,fontWeight:700,color:dk?'#080b0f':'#fff' }}>{l}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14 }}>
                      {[
                        { pct:50, label:'Needs',   color:'var(--acc)', sub:'Rent · Food · Bills · Transport', examples:['Rent/Dorm','Groceries','Utilities','Phone','Loan minimums'] },
                        { pct:30, label:'Wants',   color:'var(--pur)', sub:'Fun · Dining · Hobbies',          examples:['Dining out','Streaming','Clothing','Hobbies','Travel'] },
                        { pct:20, label:'Savings', color:'var(--lo)',  sub:'Emergency · Goals · Debt payoff', examples:['Emergency fund','Savings goal','Extra debt payments','Investments'] },
                      ].map((s,i) => (
                        <div key={i} style={{ padding:'16px',borderRadius:8,background:dk?'rgba(0,0,0,.25)':'rgba(3,105,161,.03)',border:`1px solid ${s.color}30` }}>
                          <div style={{ display:'flex',alignItems:'baseline',gap:6,marginBottom:5 }}>
                            <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:28,color:s.color }}>{s.pct}%</div>
                            <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:14,color:'var(--tx)' }}>{s.label}</div>
                          </div>
                          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:20,color:s.color,marginBottom:4 }}>{fmt(ruleIncome*(s.pct/100))}</div>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)',marginBottom:10 }}>{sym}{(ruleIncome*(s.pct/100)/4.33).toFixed(0)}/week</div>
                          {s.examples.map((ex,j) => (
                            <div key={j} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx2)',padding:'2px 0',display:'flex',gap:5 }}>
                              <span style={{ color:s.color }}>·</span>{ex}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compare to actual */}
                  <div className="panel" style={{ padding:'18px 20px' }}>
                    <div className="lbl" style={{ marginBottom:10 }}>Your Budget vs 50/30/20 Target</div>
                    {[
                      { label:'Expenses vs 50% Needs target', actual:bSummary.totalExpenses/periodMult, target:ruleIncome*0.5, colorOver:'var(--er)', colorOk:'var(--acc)' },
                      { label:'Savings vs 20% target',        actual:bSummary.savings/periodMult,       target:ruleIncome*0.2, colorOver:'var(--lo)', colorOk:'var(--er)' },
                    ].map((row,i) => {
                      const pct = row.target>0 ? Math.min(140,(row.actual/row.target)*100) : 0;
                      const over = row.actual > row.target;
                      const barColor = i===0 ? (over?'var(--er)':'var(--lo)') : (over?'var(--lo)':'var(--er)');
                      return (
                        <div key={i} style={{ marginBottom:12 }}>
                          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx2)' }}>{row.label}</span>
                            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:barColor }}>
                              {fmt(row.actual)} / {fmt(row.target)}
                            </span>
                          </div>
                          <div style={{ height:8,background:'var(--bdr)',borderRadius:4,overflow:'hidden' }}>
                            <motion.div style={{ height:'100%',borderRadius:4,background:barColor }}
                              initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.6 }}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                </motion.div>
              )}

              {/* ══ GOALS ══ */}
              {tab==='goals' && (
                <motion.div key="goals" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',gap:12 }}>
                    <div className="hint" style={{ flex:1,margin:0 }}><span>↑</span><span>Track savings goals. See estimated completion time based on your current monthly savings rate.</span></div>
                    <button className="btn-pri" onClick={addGoal} style={{ padding:'7px 16px',fontSize:9,flexShrink:0 }}>+ Add Goal</button>
                  </div>
                  <AnimatePresence>
                    {goals.map(goal => {
                      const pct = goal.target>0 ? Math.min(100,(goal.saved/goal.target)*100) : 0;
                      const remaining = (parseFloat(goal.target)||0) - (parseFloat(goal.saved)||0);
                      const monthlySavings = bSummary.savings / periodMult;
                      const monthsLeft = monthlySavings>0 ? Math.ceil(remaining/monthlySavings) : null;
                      const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline)-new Date())/86400000) : null;
                      return (
                        <motion.div key={goal.id} className="panel" style={{ padding:'20px 22px' }}
                          initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}>
                          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14 }}>
                            <input className="inp" value={goal.name} onChange={e => updGoal(goal.id,'name',e.target.value)}
                              style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:15,background:'transparent',
                                border:'none',borderBottom:'1px solid var(--bdr)',borderRadius:0,color:'var(--tx)',padding:'3px 0',flex:1 }}/>
                            <div style={{ display:'flex',gap:5,marginLeft:12,alignItems:'center' }}>
                              {GOAL_COLORS.map((c,ci) => (
                                <button key={ci} onClick={() => updGoal(goal.id,'color',c)}
                                  style={{ width:15,height:15,borderRadius:'50%',border:goal.color===c?'2px solid var(--tx)':'2px solid transparent',
                                    background:c,cursor:'pointer',padding:0,flexShrink:0 }}/>
                              ))}
                              <button className="btn-icon" onClick={() => delGoal(goal.id)} style={{ marginLeft:4 }}>✕</button>
                            </div>
                          </div>
                          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:14 }} className="g3">
                            {[{ label:'Target', key:'target' },{ label:'Saved So Far', key:'saved' }].map(f => (
                              <div key={f.key}>
                                <div className="lbl" style={{ fontSize:7.5 }}>{f.label}</div>
                                <div style={{ position:'relative' }}>
                                  <span style={{ position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>{sym}</span>
                                  <input className="inp" type="number" value={goal[f.key]} onChange={e => updGoal(goal.id,f.key,+e.target.value)}
                                    style={{ paddingLeft:sym.length>1?22:18,fontSize:11 }}/>
                                </div>
                              </div>
                            ))}
                            <div>
                              <div className="lbl" style={{ fontSize:7.5 }}>Deadline</div>
                              <input className="inp" type="date" value={goal.deadline} onChange={e => updGoal(goal.id,'deadline',e.target.value)} style={{ fontSize:11,padding:'7px 9px' }}/>
                            </div>
                          </div>
                          {/* Progress bar */}
                          <div style={{ height:10,borderRadius:5,overflow:'hidden',background:'var(--bdr)',marginBottom:8 }}>
                            <motion.div style={{ height:'100%',borderRadius:5,background:goal.color }}
                              initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.7 }}/>
                          </div>
                          <div style={{ display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8 }}>
                            <div style={{ display:'flex',gap:12 }}>
                              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:goal.color,fontWeight:700 }}>{pct.toFixed(0)}% complete</span>
                              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>{fmt(Math.max(0,remaining))} to go</span>
                            </div>
                            <div style={{ display:'flex',gap:10 }}>
                              {monthsLeft!==null && monthsLeft>0 && (
                                <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--acc)' }}>~{monthsLeft}mo at current rate</span>
                              )}
                              {daysLeft!==null && (
                                <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:daysLeft<30?'var(--er)':daysLeft<90?'var(--warn)':'var(--tx3)' }}>
                                  {daysLeft>0?`${daysLeft}d left`:'⚠ Deadline passed'}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {goals.length===0 && <div style={{ textAlign:'center',padding:'60px',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'var(--tx3)' }}>No goals yet — click "+ Add Goal" to start.</div>}
                  
                </motion.div>
              )}

              {/* ══ DISCOUNTS ══ */}
              {tab==='discounts' && (
                <motion.div key="disc" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>🎓</span><span>Your student ID is a powerful financial tool. Always ask for a student discount before paying for anything.</span></div>
                  <div style={{ display:'flex',gap:7,flexWrap:'wrap' }}>
                    {Object.keys(DISCOUNTS).map(r => (
                      <button key={r} className={`btn-ghost ${discRegion===r?'on':''}`} onClick={() => setDiscRegion(r)} style={{ fontSize:9.5 }}>{r}</button>
                    ))}
                  </div>
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }} className="g2">
                    {DISCOUNTS[discRegion].map((d,i) => (
                      <motion.div key={i} className="panel" style={{ padding:'16px 18px' }}
                        initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*.05 }}>
                        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8 }}>
                          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:'var(--tx)' }}>{d.name}</div>
                          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--lo)',fontWeight:700,flexShrink:0,marginLeft:8 }}>{d.saving}</span>
                        </div>
                        <span className="disc-chip" style={{ marginBottom:8,display:'inline-flex' }}>{d.cat}</span>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx2)',lineHeight:1.6,marginBottom:7 }}>{d.tip}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)' }}>→ {d.url}</div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="panel" style={{ padding:'16px 18px' }}>
                    <div className="lbl" style={{ marginBottom:8 }}>Universal Student Discount Hacks</div>
                    {[
                      '🎓 Always carry physical + digital student ID — some places only accept one form',
                      '📱 Download Unidays, StudentBeans, and ISIC apps — verify once, use everywhere',
                      '💡 Ask for student discount even if not advertised — many offer it unofficially',
                      '📅 Back-to-school season (July–September) = best deals on tech and furniture',
                      '🛒 Combine student discount + cashback apps (Rakuten, TopCashback) for double savings',
                      '📚 Use interlibrary loans and your library\'s digital access before buying any textbook',
                    ].map((t,i) => (
                      <div key={i} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx2)',padding:'6px 0',
                        borderBottom:i<5?'1px solid var(--bdr)':'none',lineHeight:1.55 }}>{t}</div>
                    ))}
                  </div>
                  
                </motion.div>
              )}

              {/* ══ SEMESTER ══ */}
              {tab==='semester' && (
                <motion.div key="sem" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>📅</span><span>Plan your entire semester budget upfront. Track budgeted vs actual spending to stay on track.</span></div>

                  <div className="panel" style={{ padding:'16px 20px',display:'flex',gap:14,alignItems:'center',flexWrap:'wrap' }}>
                    <div style={{ flex:1,minWidth:140 }}>
                      <div className="lbl">Semester Name</div>
                      <input className="inp" value={semName} onChange={e => setSemName(e.target.value)} style={{ fontSize:13 }}/>
                    </div>
                    <div style={{ width:140 }}>
                      <div className="lbl">Duration — {semWeeks} weeks</div>
                      <input className="rng" type="range" min={8} max={24} value={semWeeks} onChange={e => setSemWeeks(+e.target.value)} style={{ marginTop:0 }}/>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="panel-hi" style={{ padding:'18px 22px' }}>
                    <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14 }}>
                      {[
                        { label:`Semester Budget`,      val:fmt(semSum.budget), color:'var(--acc)' },
                        { label:'Actual Spent',          val:fmt(semSum.actual), color:'var(--er)' },
                        { label:semSum.diff>=0?'Under Budget':'Over Budget', val:fmt(Math.abs(semSum.diff)), color:semSum.diff>=0?'var(--lo)':'var(--er)' },
                      ].map((s,i) => (
                        <div key={i} style={{ textAlign:'center' }}>
                          <div className="lbl" style={{ margin:'0 0 5px',textAlign:'center' }}>{s.label}</div>
                          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:20,color:s.color }}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:'flex',justifyContent:'space-between',marginTop:12,fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>
                      <span>Budget/week: {fmt(semSum.budget/semWeeks)}</span>
                      <span>Actual/week: {fmt(semSum.actual/semWeeks)}</span>
                    </div>
                  </div>

                  {/* Items table */}
                  <div className="panel" style={{ padding:'18px 20px' }}>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12 }}>
                      <div className="lbl" style={{ margin:0 }}>Items</div>
                      <button className="btn-add green" onClick={addSemItem}>+ Add</button>
                    </div>
                    <div style={{ display:'grid',gridTemplateColumns:'1fr 110px 110px 32px',gap:8,padding:'0 0 8px',borderBottom:'1px solid var(--bdr)' }}>
                      {['Item / Category','Budget','Actual',''].map((h,i) => (
                        <div key={i} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:7.5,color:'var(--tx3)',letterSpacing:'.14em',textTransform:'uppercase',textAlign:i>0?'right':'left' }}>{h}</div>
                      ))}
                    </div>
                    <AnimatePresence>
                      {semItems.map((item,i) => {
                        const over = (parseFloat(item.actual)||0) > (parseFloat(item.budget)||0);
                        return (
                          <motion.div key={item.id} style={{ display:'grid',gridTemplateColumns:'1fr 110px 110px 32px',gap:8,padding:'6px 0',alignItems:'center',
                            borderBottom:i<semItems.length-1?'1px solid var(--bdr)':'none' }}
                            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                            <div>
                              <input className="inp" value={item.name} onChange={e => updSemItem(item.id,'name',e.target.value)}
                                style={{ fontSize:11,padding:'4px 8px',marginBottom:3,width:'100%' }}/>
                              <select className="sel" value={item.cat} onChange={e => updSemItem(item.id,'cat',e.target.value)}
                                style={{ fontSize:9,padding:'3px 7px',width:'100%' }}>
                                {SEM_CATS.map(c => <option key={c}>{c}</option>)}
                              </select>
                            </div>
                            {['budget','actual'].map(field => (
                              <div key={field} style={{ position:'relative' }}>
                                <span style={{ position:'absolute',left:7,top:'50%',transform:'translateY(-50%)',fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)' }}>{sym}</span>
                                <input className="inp" type="number" value={item[field]} onChange={e => updSemItem(item.id,field,e.target.value)}
                                  style={{ paddingLeft:sym.length>1?20:16,fontSize:11,textAlign:'right',
                                    color:field==='actual'&&over?'var(--er)':'inherit',width:'100%' }}/>
                              </div>
                            ))}
                            <button className="btn-icon" onClick={() => delSemItem(item.id)} style={{ alignSelf:'center' }}>✕</button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    <div style={{ display:'grid',gridTemplateColumns:'1fr 110px 110px 32px',gap:8,paddingTop:10,marginTop:6,borderTop:'2px solid var(--bdr)' }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',letterSpacing:'.1em' }}>TOTALS</span>
                      <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:15,color:'var(--acc)',textAlign:'right' }}>{fmt(semSum.budget)}</span>
                      <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:15,color:semSum.actual>semSum.budget?'var(--er)':'var(--lo)',textAlign:'right' }}>{fmt(semSum.actual)}</span>
                      <div/>
                    </div>
                  </div>
                  
                </motion.div>
              )}

              {/* ══ DEBT ══ */}
              {tab==='debt' && (
                <motion.div key="debt" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>💳</span><span>Avalanche method: pay minimums on all debts, put every extra dollar toward the highest-rate debt first. This minimizes total interest paid.</span></div>

                  <div className="panel-hi" style={{ padding:'18px 22px' }}>
                    <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14 }}>
                      {[
                        { label:'Total Debt',         val:fmt(debtSum.totalBalance),  color:'var(--er)' },
                        { label:'Monthly Payments',   val:fmt(debtSum.totalPayment),  color:'var(--warn)' },
                        { label:'Est. Total Interest',val:fmt(debtSum.totalInterest), color:'var(--pur)' },
                      ].map((s,i) => (
                        <div key={i} style={{ textAlign:'center' }}>
                          <div className="lbl" style={{ margin:'0 0 5px',textAlign:'center' }}>{s.label}</div>
                          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:20,color:s.color }}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                    <div className="hint" style={{ flex:1,margin:0,marginRight:12 }}><span>💡</span><span>Even {sym}25/month extra on a {sym}10,000 loan at 6% saves over {sym}1,000 in interest and cuts payoff by 2+ years.</span></div>
                    <button className="btn-pri" onClick={addDebt} style={{ padding:'7px 16px',fontSize:9,flexShrink:0 }}>+ Add Debt</button>
                  </div>

                  <AnimatePresence>
                    {debts.map(debt => {
                      const b = parseFloat(debt.balance)||0;
                      const r = parseFloat(debt.rate)||0;
                      const p = parseFloat(debt.payment)||0;
                      const { months, totalInterest } = calcPayoff(b,r,p);
                      const monthlyInterest = b*(r/100/12);
                      const principalPaid  = Math.max(0, p - monthlyInterest);
                      return (
                        <motion.div key={debt.id} className="debt-card"
                          initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}>
                          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                            <div style={{ width:4,height:36,borderRadius:2,background:debt.color,flexShrink:0 }}/>
                            <input className="inp" value={debt.name} onChange={e => updDebt(debt.id,'name',e.target.value)}
                              style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:14,background:'transparent',
                                border:'none',borderBottom:'1px solid var(--bdr)',borderRadius:0,color:'var(--tx)',padding:'3px 0',flex:1 }}/>
                            <div style={{ display:'flex',gap:5 }}>
                              {['var(--er)','var(--warn)','var(--pur)','var(--acc)','var(--lo)'].map((c,ci) => (
                                <button key={ci} onClick={() => updDebt(debt.id,'color',c)}
                                  style={{ width:13,height:13,borderRadius:'50%',border:debt.color===c?'2px solid var(--tx)':'2px solid transparent',background:c,cursor:'pointer',padding:0 }}/>
                              ))}
                            </div>
                            <button className="btn-icon" onClick={() => delDebt(debt.id)}>✕</button>
                          </div>
                          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10 }}>
                            {[
                              { label:'Balance', key:'balance', prefix:sym, suffix:'' },
                              { label:'Annual Rate', key:'rate', prefix:'', suffix:'%' },
                              { label:'Monthly Payment', key:'payment', prefix:sym, suffix:'' },
                            ].map(f => (
                              <div key={f.key}>
                                <div className="lbl" style={{ fontSize:7.5 }}>{f.label}</div>
                                <div style={{ position:'relative' }}>
                                  {f.prefix && <span style={{ position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>{f.prefix}</span>}
                                  {f.suffix && <span style={{ position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>{f.suffix}</span>}
                                  <input className="inp" type="number" value={debt[f.key]} onChange={e => updDebt(debt.id,f.key,e.target.value)}
                                    style={{ paddingLeft:f.prefix?18:10,paddingRight:f.suffix?22:10,fontSize:12 }}/>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10 }}>
                            {[
                              { label:'Monthly Interest', val:fmt(monthlyInterest), color:'var(--er)' },
                              { label:'Principal/mo',     val:fmt(principalPaid),   color:'var(--lo)' },
                              { label:'Payoff Time',      val:isFinite(months)?`${months}mo`:'∞ too low', color:isFinite(months)?'var(--acc)':'var(--er)' },
                              { label:'Total Interest',   val:isFinite(totalInterest)?fmt(totalInterest):'—', color:'var(--pur)' },
                            ].map((s,j) => (
                              <div key={j}>
                                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:7.5,color:'var(--tx3)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:3 }}>{s.label}</div>
                                <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:s.color }}>{s.val}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{ height:5,background:'var(--bdr)',borderRadius:3,overflow:'hidden' }}>
                            <div style={{ height:'100%',borderRadius:3,background:debt.color,width:'8%',opacity:0.7 }}/>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {debts.length===0 && <div style={{ textAlign:'center',padding:'60px',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'var(--lo)' }}>🎉 Debt-free! Great financial position.</div>}
                  
                </motion.div>
              )}

              {/* ══ TIPS ══ */}
              {tab==='tips' && (
                <motion.div key="tips" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}>
                  <div className="panel" style={{ padding:'26px 30px',marginBottom:14 }}>
                    <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:26,color:'var(--tx)',marginBottom:4 }}>Student Financial Survival Guide</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx3)',marginBottom:24,letterSpacing:'.12em' }}>BUDGETING · SAVING · DEBT · DISCOUNTS</div>
                    <div className="prose">
                      <h3>The #1 Student Money Rule</h3>
                      <p><strong>Pay yourself first.</strong> The moment money arrives — scholarship, paycheck, allowance — immediately transfer your savings before spending anything. If you wait to save "what's left", there will never be anything left. Even {sym}20/week compounds to {sym}1,040/year.</p>
                      <h3>The 50/30/20 Rule (Student Edition)</h3>
                      <p>Classic split: 50% needs, 30% wants, 20% savings. For students with high housing costs, a realistic split might be <strong>60/20/20</strong>. The key is that <strong>20% savings is non-negotiable</strong> — cut wants, never savings.</p>
                      <h3>Emergency Fund First</h3>
                      <p>Before any other savings goal, build an emergency fund of {sym}500–{sym}1,000. This covers a broken laptop, medical bill, or flight home. Without it, any financial shock goes straight to a credit card at 20%+ interest.</p>
                      <h3>The Real Cost of Student Debt</h3>
                      <p>A {sym}20,000 student loan at 6% with minimum {sym}150/month payments takes over 20 years and costs {sym}16,000+ in interest. Paying just {sym}50/month extra cuts it to 11 years and saves {sym}9,000. Small extra payments matter enormously.</p>
                      {[
                        { q:'Should I invest while paying off student debt?', a:`If your loan rate is below 5%, investing in index funds (historically 7–10%/yr return) may be better than paying extra on the loan. Above 7%, pay the debt first. Credit cards at 20%+? Always clear those before investing.` },
                        { q:'Best way to make extra money as a student?', a:'On-campus jobs are ideal — flexible hours and understanding employers. Freelancing in your field pays well and builds your portfolio. Tutoring pays $15–$50/hr depending on subject. Avoid anything that compromises your studies — your degree is your highest-ROI investment.' },
                        { q:'How do I stop impulse spending?', a:'The 24-hour rule: wait 24 hours before any non-essential purchase over $20. Delete saved payment details from shopping apps, unsubscribe from promo emails, and use cash for discretionary spending. Physical money creates more conscious spending than cards.' },
                        { q:'Is a student credit card worth it?', a:'Yes — if you pay the full balance every single month. A student card builds your credit history, which affects your ability to rent apartments and get loans for years. Get one, use it for small recurring purchases, set autopay for the full balance, and never carry a balance.' },
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