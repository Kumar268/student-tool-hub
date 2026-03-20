import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   BOOK.resale — Textbook Resale Calculator
   Clean Modern · JetBrains Mono + Outfit
   TABS: ◈ Estimator · ⇄ Platforms · 📚 Alternatives · ↑ Tracker · 📖 Editions · ∑ Tips
═══════════════════════════════════════════════════════════════════ */

const S = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{font-family:'Outfit',sans-serif;}
.dk{--bg:#080b0f;--s1:#0d1117;--s2:#131920;--bdr:#1e2d3d;
  --acc:#38bdf8;--lo:#4ade80;--er:#f87171;--pur:#c084fc;--warn:#fb923c;--gold:#fbbf24;
  --tx:#e2eaf4;--tx2:#94a3b8;--tx3:#3d5a78;
  background:var(--bg);color:var(--tx);min-height:100vh;
  background-image:radial-gradient(ellipse 60% 40% at 30% -5%,rgba(56,189,248,.06),transparent 60%),
    radial-gradient(ellipse 40% 30% at 80% 95%,rgba(74,222,128,.04),transparent 60%);}
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
.dk .panel-lo{background:var(--s2);border:1px solid rgba(74,222,128,.25);border-radius:8px;box-shadow:0 0 24px rgba(74,222,128,.06);}
.lt .panel-lo{background:var(--s1);border:1.5px solid rgba(21,128,61,.22);border-radius:14px;box-shadow:0 4px 24px rgba(21,128,61,.08);}

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
  font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.08em;text-transform:uppercase;
  border:none;border-radius:6px;transition:all .12s;}
.dk .btn-add{background:rgba(74,222,128,.1);color:var(--lo);border:1px solid rgba(74,222,128,.2);}
.dk .btn-add:hover{background:rgba(74,222,128,.18);}
.lt .btn-add{background:rgba(21,128,61,.08);color:var(--lo);border:1.5px solid rgba(21,128,61,.2);}
.lt .btn-add:hover{background:rgba(21,128,61,.15);}

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

.plat-card{padding:16px 18px;border-radius:8px;display:flex;flex-direction:column;gap:8px;transition:all .13s;}
.dk .plat-card{border:1px solid var(--bdr);background:rgba(0,0,0,.2);}
.lt .plat-card{border:1.5px solid var(--bdr);background:var(--s1);}
.dk .plat-card.best{border-color:rgba(74,222,128,.35);box-shadow:0 0 20px rgba(74,222,128,.07);}
.lt .plat-card.best{border-color:rgba(21,128,61,.3);box-shadow:0 4px 20px rgba(21,128,61,.08);}

.alt-card{padding:15px 17px;border-radius:8px;}
.dk .alt-card{border:1px solid var(--bdr);background:rgba(0,0,0,.2);}
.lt .alt-card{border:1.5px solid var(--bdr);background:var(--s1);}

.track-row{padding:12px 16px;border-radius:8px;display:flex;flex-direction:column;gap:8px;}
.dk .track-row{border:1px solid var(--bdr);background:rgba(0,0,0,.2);}
.lt .track-row{border:1.5px solid var(--bdr);background:var(--s1);}

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
@media(max-width:580px){.g2{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr 1fr!important;}}
`;

const CURRENCIES = [
  { code:'USD', sym:'$',   name:'US Dollar'        },
  { code:'GBP', sym:'£',   name:'British Pound'    },
  { code:'EUR', sym:'€',   name:'Euro'             },
  { code:'INR', sym:'₹',   name:'Indian Rupee'     },
  { code:'CAD', sym:'C$',  name:'Canadian Dollar'  },
  { code:'AUD', sym:'A$',  name:'Australian Dollar'},
  { code:'JPY', sym:'¥',   name:'Japanese Yen'     },
  { code:'SGD', sym:'S$',  name:'Singapore Dollar' },
  { code:'MYR', sym:'RM',  name:'Malaysian Ringgit'},
  { code:'BRL', sym:'R$',  name:'Brazilian Real'   },
  { code:'MXN', sym:'MX$', name:'Mexican Peso'     },
  { code:'ZAR', sym:'R',   name:'South African Rand'},
  { code:'NGN', sym:'₦',   name:'Nigerian Naira'   },
  { code:'KRW', sym:'₩',   name:'South Korean Won' },
  { code:'CNY', sym:'¥',   name:'Chinese Yuan'     },
  { code:'AED', sym:'د.إ', name:'UAE Dirham'       },
  { code:'SAR', sym:'﷼',   name:'Saudi Riyal'      },
  { code:'NZD', sym:'NZ$', name:'New Zealand Dollar'},
  { code:'CHF', sym:'Fr',  name:'Swiss Franc'      },
  { code:'SEK', sym:'kr',  name:'Swedish Krona'    },
];

const TABS = [
  { id:'estimate',  icon:'◈',  label:'Estimator'    },
  { id:'platforms', icon:'⇄',  label:'Platforms'    },
  { id:'alts',      icon:'📚', label:'Alternatives' },
  { id:'tracker',   icon:'↑',  label:'Tracker'      },
  { id:'editions',  icon:'📖', label:'Editions'     },
  { id:'tips',      icon:'∑',  label:'Tips'         },
];

/* ── Resale rate tables ── */
const CONDITION_RATES = {
  'Like New':    { rate:0.60, label:'Like New',    desc:'No markings, tight binding, no damage' },
  'Good':        { rate:0.45, label:'Good',        desc:'Minor highlighting, some wear' },
  'Acceptable':  { rate:0.30, label:'Acceptable',  desc:'Heavy highlighting, writing, worn cover' },
  'Poor':        { rate:0.12, label:'Poor',        desc:'Damaged, loose pages, missing cover' },
};
const SUBJECT_MULT = {
  'STEM / Engineering':   1.15,
  'Business / Finance':   1.10,
  'Medical / Nursing':    1.20,
  'Law':                  1.10,
  'Humanities / Arts':    0.80,
  'Social Sciences':      0.85,
  'Foreign Language':     0.75,
  'General Education':    0.70,
};
const EDITION_MULT = {
  'Current (latest)':     1.00,
  '1 edition behind':     0.65,
  '2+ editions behind':   0.25,
  'Unknown':              0.55,
};
const AGE_MULT = {
  'This semester':  1.00,
  '1 year old':     0.85,
  '2 years old':    0.65,
  '3+ years old':   0.45,
};

/* ── Platforms ── */
const PLATFORMS = [
  { name:'Amazon',         icon:'📦', fee:0.15, speed:'2–4 wks', effort:'Low',    pros:'Massive reach, FBA option',        cons:'15% fee + $1.80/sale closing fee', color:'var(--warn)', searchBase:'amazon.com/s?k=' },
  { name:'eBay',           icon:'🛒', fee:0.13, speed:'1–3 wks', effort:'Low',    pros:'Auction option for rare books',     cons:'13% final value fee + listing time', color:'var(--gold)', searchBase:'ebay.com/sch/?_nkw=' },
  { name:'Chegg',          icon:'🎓', fee:0.20, speed:'Instant', effort:'None',   pros:'Instant price, free shipping kit',  cons:'Lowest payout (~20–30% of list)',   color:'var(--acc)', searchBase:'chegg.com/sell-textbooks/search?q=' },
  { name:'AbeBooks',       icon:'📗', fee:0.13, speed:'2–5 wks', effort:'Medium', pros:'Good for older / rare editions',    cons:'Less traffic than Amazon',         color:'var(--pur)', searchBase:'abebooks.com/servlet/SearchResults?kn=' },
  { name:'Facebook Marketplace',icon:'👥',fee:0,speed:'1–7 days',effort:'Medium','pros':'No fees, cash in hand',            cons:'Safety concerns, price hagglers',  color:'var(--lo)', searchBase:'facebook.com/marketplace' },
  { name:'Decluttr',       icon:'📱', fee:0.00, speed:'3–5 days',effort:'None',   pros:'Ship with prepaid label, fast pay', cons:'Often lowest offers',              color:'var(--rose||var(--er))', searchBase:'decluttr.com/sell-textbooks/' },
  { name:'ValoreBooks',    icon:'📘', fee:0.00, speed:'2–5 days',effort:'None',   pros:'Compares buyback quotes instantly', cons:'Variable payout',                  color:'var(--acc)', searchBase:'valorebooks.com/buyback/' },
  { name:'Campus Buyback', icon:'🏫', fee:0.00, speed:'Instant', effort:'None',   pros:'Instant cash, no shipping',         cons:'Typically lowest price',           color:'var(--tx2)', searchBase:'' },
];

/* ── Alternatives ── */
const ALTERNATIVES = [
  { name:'Library Genesis (Libgen)',  type:'Free PDF',   icon:'📄', url:'libgen.is',             desc:'Largest free academic book repository. Search by title, ISBN, or author.',             legal:'Gray area — use for personal study only', color:'var(--lo)' },
  { name:'Z-Library',                 type:'Free PDF',   icon:'📄', url:'z-lib.org',              desc:'Mirrors Libgen with a cleaner interface. Create free account for higher limits.',       legal:'Gray area — use for personal study only', color:'var(--lo)' },
  { name:'Open Library (Archive.org)',type:'Free Borrow', icon:'🔓', url:'archive.org/details/inlibrary', desc:'Legal digital lending. Borrow scanned books for 1 hour at a time.',          legal:'✓ Legal — digital library lending',         color:'var(--acc)' },
  { name:'Your University Library',   type:'Free',       icon:'🏛️', url:'',                       desc:'Most university libraries have physical + digital copies. Check EZproxy for remote.',  legal:'✓ 100% legal — free with student ID',        color:'var(--acc)' },
  { name:'Chegg Textbook Rental',     type:'Rental',     icon:'📦', url:'chegg.com/textbooks',    desc:'Rent for the semester. Return by deadline. Cheapest for subjects you won\'t revisit.', legal:'✓ Legal',                                    color:'var(--pur)' },
  { name:'VitalSource / Kindle',      type:'eBook',      icon:'💻', url:'vitalsource.com',        desc:'Digital textbook rental/purchase. 30–60% cheaper than print. Check before buying.',   legal:'✓ Legal',                                    color:'var(--pur)' },
  { name:'Older Edition',             type:'Save Money', icon:'💡', url:'',                       desc:'Often 1 edition behind = same content, 70–90% cheaper. Ask your professor first.',    legal:'✓ Legal — just verify with instructor',      color:'var(--gold)' },
  { name:'Course Hero / Studocu',     type:'Study Aid',  icon:'📝', url:'coursehero.com',         desc:'Doesn\'t replace textbooks, but supplemental notes can reduce how much you need them.', legal:'✓ Legal with subscription',                 color:'var(--warn)' },
];

/* ── Edition signals ── */
const EDITION_TIPS = [
  { signal:'New edition just released', risk:'🔴 High', action:'Sell immediately — within 2 weeks of new edition announcement, resale value drops 40–70%' },
  { signal:'Current edition, mid-semester', risk:'🟡 Medium', action:'Wait until exam season. Demand peaks when students realize they need it' },
  { signal:'No new edition in 3+ years', risk:'🟢 Low', action:'Stable resale market. Sell when convenient — value will hold for another semester' },
  { signal:'Professor-specific custom edition', risk:'🔴 High', action:'Near zero resale value outside that specific class. Sell quickly to classmates' },
  { signal:'International edition available', risk:'🟡 Medium', action:'Domestic editions often lose value when cheaper international editions flood the market' },
  { signal:'Course discontinued', risk:'🔴 High', action:'Resale crashes immediately. Donate or use AbeBooks to find niche collectors' },
];

const fmt = (n, sym='$') => `${sym}${Math.abs(n).toFixed(2)}`;
const fmtInt = (n, sym='$') => `${sym}${Math.round(Math.abs(n)).toLocaleString()}`;

export default function TextbookResale() {
  const [dark,     setDark]     = useState(true);
  const [tab,      setTab]      = useState('estimate');
  const [currency, setCurrency] = useState('USD');
  const dk  = dark;
  const sym = CURRENCIES.find(c => c.code === currency)?.sym || '$';

  /* ── Estimator ── */
  const [pricePaid,   setPricePaid]   = useState(120);
  const [condition,   setCondition]   = useState('Good');
  const [subject,     setSubject]     = useState('STEM / Engineering');
  const [edition,     setEdition]     = useState('Current (latest)');
  const [age,         setAge]         = useState('This semester');
  const [bookTitle,   setBookTitle]   = useState('');

  const estimate = useMemo(() => {
    const base = pricePaid * CONDITION_RATES[condition].rate;
    const adj  = base * SUBJECT_MULT[subject] * EDITION_MULT[edition] * AGE_MULT[age];
    const low  = adj * 0.80;
    const high = adj * 1.25;
    const profit = adj - pricePaid;
    const roi    = pricePaid > 0 ? (profit / pricePaid) * 100 : 0;
    const netAfterFees = {
      amazon:     adj * (1 - PLATFORMS[0].fee) - 1.80,
      ebay:       adj * (1 - PLATFORMS[1].fee),
      chegg:      adj * (1 - PLATFORMS[2].fee),
      campus:     adj * 0.65,
      free:       adj,
    };
    return { adj, low, high, profit, roi, netAfterFees };
  }, [pricePaid, condition, subject, edition, age]);

  /* ── Tracker ── */
  const [books, setBooks] = useState([
    { id:1, title:'Organic Chemistry 12th Ed', paid:180, sold:75,  platform:'Amazon',   status:'sold' },
    { id:2, title:'Calculus: Early Transcendentals', paid:95, sold:0, platform:'', status:'listed' },
    { id:3, title:'Introduction to Psychology', paid:65, sold:20, platform:'Chegg', status:'sold' },
  ]);
  const addBook = () => setBooks(b => [...b, { id:Date.now(), title:'New Book', paid:0, sold:0, platform:'', status:'owned' }]);
  const updBook = (id,f,v) => setBooks(b => b.map(x => x.id===id ? {...x,[f]:v} : x));
  const delBook = id => setBooks(b => b.filter(x => x.id!==id));

  const trackerSummary = useMemo(() => {
    const totalPaid   = books.reduce((s,b) => s + (parseFloat(b.paid)||0), 0);
    const totalRecovered = books.filter(b=>b.status==='sold').reduce((s,b) => s + (parseFloat(b.sold)||0), 0);
    const netCost     = totalPaid - totalRecovered;
    const recoveryRate = totalPaid > 0 ? (totalRecovered / totalPaid) * 100 : 0;
    return { totalPaid, totalRecovered, netCost, recoveryRate };
  }, [books]);

  /* ── Sidebar ── */
  const sideStats = [
    { label:'Estimated Resale', val:fmt(estimate.adj, sym),      color:'var(--lo)' },
    { label:'Resale Range',     val:`${fmt(estimate.low, sym)} – ${fmt(estimate.high, sym)}`, color:'var(--acc)' },
    { label:'Net Loss',         val:fmt(estimate.profit, sym),   color:estimate.profit>=0?'var(--lo)':'var(--er)' },
    { label:'Books Tracked',    val:`${books.length}`,       color:'var(--pur)' },
    { label:'Total Recovered',  val:fmt(trackerSummary.totalRecovered, sym), color:'var(--lo)' },
    { label:'Recovery Rate',    val:`${trackerSummary.recoveryRate.toFixed(0)}%`, color:'var(--gold)' },
  ];

  return (
    <>
      <style>{S}</style>
      <div className={dk?'dk':'lt'}>

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{ display:'flex',alignItems:'center',gap:9 }}>
            <div style={{ width:32,height:32,borderRadius:dk?6:10,display:'flex',alignItems:'center',justifyContent:'center',
              background:dk?'rgba(74,222,128,.1)':'linear-gradient(135deg,#15803d,#22c55e)',
              border:dk?'1px solid rgba(74,222,128,.3)':'none' }}>
              <span style={{ fontSize:16 }}>📚</span>
            </div>
            <span style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:17,color:'var(--tx)' }}>
              BOOK<span style={{ color:'var(--lo)' }}>.resale</span>
            </span>
          </div>
          <div style={{ flex:1 }}/>
          <div style={{ padding:'4px 12px',borderRadius:20,border:'1px solid rgba(74,222,128,.25)',
            background:'rgba(74,222,128,.07)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--lo)',fontWeight:600 }}>
            Est. {fmt(estimate.adj, sym)} resale
          </div>
          <select className="sel" value={currency} onChange={e => setCurrency(e.target.value)}
            style={{ width:95,padding:'4px 8px',fontSize:10 }}>
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
          <div className="sidebar">
            <div className="sec-lbl">Resale Summary</div>
            {sideStats.map((s,i) => (
              <div key={i} className="scard">
                <div className="lbl" style={{ margin:0 }}>{s.label}</div>
                <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:14,color:s.color }}>{s.val}</div>
              </div>
            ))}
            
            <div className="sec-lbl" style={{ marginTop:4 }}>Resale Rules</div>
            {['Sell within 2 weeks of semester end','List on 2+ platforms','Clean covers add 10–20%','ISBN in listing = faster sale','Never wait for "next semester"'].map((t,i) => (
              <div key={i} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',padding:'3px 0',
                borderBottom:i<4?'1px solid var(--bdr)':'none',display:'flex',gap:6 }}>
                <span style={{ color:'var(--lo)',flexShrink:0 }}>→</span>{t}
              </div>
            ))}
            
          </div>

          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══ ESTIMATOR ══ */}
              {tab==='estimate' && (
                <motion.div key="est" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }} className="g2">
                    {/* Inputs */}
                    <div className="panel" style={{ padding:'20px 22px',display:'flex',flexDirection:'column',gap:13 }}>
                      <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:'var(--tx)' }}>BOOK DETAILS</div>

                      <div>
                        <div className="lbl">Book Title (optional)</div>
                        <input className="inp" value={bookTitle} onChange={e => setBookTitle(e.target.value)}
                          placeholder="e.g. Organic Chemistry 12th Ed" style={{ fontSize:12 }}/>
                      </div>

                      <div>
                        <div className="lbl">Price You Paid — {sym}{pricePaid}</div>
                        <div style={{ position:'relative' }}>
                          <span style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:'var(--tx3)' }}>$</span>
                          <input className="inp" type="number" value={pricePaid} onChange={e => setPricePaid(+e.target.value)} style={{ paddingLeft:22,fontSize:14 }}/>
                        </div>
                        <input className="rng" type="range" min={5} max={500} step={5} value={pricePaid} onChange={e => setPricePaid(+e.target.value)}/>
                      </div>

                      <div>
                        <div className="lbl">Condition</div>
                        <div style={{ display:'flex',flexDirection:'column',gap:5 }}>
                          {Object.entries(CONDITION_RATES).map(([k,v]) => (
                            <button key={k} className={`btn-ghost ${condition===k?'on':''}`}
                              onClick={() => setCondition(k)}
                              style={{ justifyContent:'space-between',padding:'7px 12px',fontSize:9.5 }}>
                              <span>{k}</span>
                              <span style={{ opacity:.6 }}>{(v.rate*100).toFixed(0)}% of paid price · {v.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="lbl">Subject / Field</div>
                        <select className="sel" value={subject} onChange={e => setSubject(e.target.value)}>
                          {Object.keys(SUBJECT_MULT).map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>

                      <div>
                        <div className="lbl">Edition Status</div>
                        <div style={{ display:'flex',gap:5,flexWrap:'wrap' }}>
                          {Object.keys(EDITION_MULT).map(e => (
                            <button key={e} className={`btn-ghost ${edition===e?'on':''}`}
                              onClick={() => setEdition(e)} style={{ fontSize:8.5 }}>{e}</button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="lbl">How Old Is Your Copy</div>
                        <div style={{ display:'flex',gap:5,flexWrap:'wrap' }}>
                          {Object.keys(AGE_MULT).map(a => (
                            <button key={a} className={`btn-ghost ${age===a?'on':''}`}
                              onClick={() => setAge(a)} style={{ fontSize:8.5 }}>{a}</button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Results */}
                    <div style={{ display:'flex',flexDirection:'column',gap:11 }}>
                      <div className="panel-lo" style={{ padding:'22px 24px' }}>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)',letterSpacing:'.14em',marginBottom:6 }}>ESTIMATED RESALE VALUE</div>
                        <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:42,color:'var(--lo)',lineHeight:1 }}>{fmt(estimate.adj, sym)}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx3)',marginTop:5 }}>
                          Range: <span style={{ color:'var(--acc)' }}>{fmt(estimate.low, sym)}</span> – <span style={{ color:'var(--warn)' }}>{fmt(estimate.high, sym)}</span>
                        </div>

                        {/* Recovery bar */}
                        <div style={{ marginTop:16 }}>
                          <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                            <div className="lbl" style={{ margin:0 }}>Recovery Rate</div>
                            <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--lo)' }}>
                              {pricePaid>0?((estimate.adj/pricePaid)*100).toFixed(0):0}% of paid price
                            </span>
                          </div>
                          <div style={{ height:10,borderRadius:5,overflow:'hidden',background:'var(--bdr)' }}>
                            <motion.div style={{ height:'100%',borderRadius:5,background:'var(--lo)' }}
                              initial={{ width:0 }} animate={{ width:`${Math.min(100,pricePaid>0?(estimate.adj/pricePaid)*100:0)}%` }}
                              transition={{ duration:0.7 }}/>
                          </div>
                        </div>

                        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:16,paddingTop:16,borderTop:'1px solid var(--bdr)' }}>
                          {[
                            { label:'Paid',      val:`${sym}${pricePaid}`,         color:'var(--er)' },
                            { label:'Net Loss',  val:fmt(Math.abs(estimate.profit), sym),color:estimate.profit>=0?'var(--lo)':'var(--er)' },
                            { label:'After Amazon Fee', val:fmt(Math.max(0,estimate.netAfterFees.amazon), sym), color:'var(--warn)' },
                            { label:'After Chegg Fee',  val:fmt(Math.max(0,estimate.netAfterFees.chegg), sym),  color:'var(--acc)' },
                          ].map((s,i) => (
                            <div key={i}>
                              <div className="lbl" style={{ fontSize:7.5,margin:'0 0 3px' }}>{s.label}</div>
                              <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:15,color:s.color }}>{s.val}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Platform best picks */}
                      <div className="panel" style={{ padding:'18px 20px' }}>
                        <div className="lbl" style={{ marginBottom:10 }}>Best Platforms for This Book</div>
                        {PLATFORMS.slice(0,5).map((p,i) => {
                          const net = estimate.adj * (1-p.fee) - (p.name==='Amazon'?1.80:0);
                          return (
                            <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 0',
                              borderBottom:i<4?'1px solid var(--bdr)':'none' }}>
                              <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                                <span style={{ fontSize:14 }}>{p.icon}</span>
                                <div>
                                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx2)' }}>{p.name}</div>
                                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--tx3)' }}>{p.speed} · {p.effort} effort</div>
                                </div>
                              </div>
                              <div style={{ textAlign:'right' }}>
                                <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:p.color }}>{fmt(Math.max(0,net), sym)}</div>
                                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--tx3)' }}>{p.fee>0?`after ${(p.fee*100).toFixed(0)}% fee`:'no fee'}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                </motion.div>
              )}

              {/* ══ PLATFORMS ══ */}
              {tab==='platforms' && (
                <motion.div key="plat" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>⇄</span><span>Comparing all major textbook resale platforms for a <strong>{sym}{pricePaid}</strong> book in <strong>{condition}</strong> condition. Adjust in the Estimator tab.</span></div>

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }} className="g2">
                    {PLATFORMS.map((p,i) => {
                      const net = Math.max(0, estimate.adj * (1 - p.fee) - (p.name==='Amazon'?1.80:0));
                      const isBest = net === Math.max(...PLATFORMS.map(pl => Math.max(0, estimate.adj * (1-pl.fee) - (pl.name==='Amazon'?1.80:0))));
                      return (
                        <motion.div key={i} className={`plat-card ${isBest?'best':''}`}
                          style={{ borderLeft:`3px solid ${p.color}` }}
                          initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*.05 }}>
                          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                            <span style={{ fontSize:20 }}>{p.icon}</span>
                            <div style={{ flex:1 }}>
                              <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:p.color }}>{p.name}</div>
                              {isBest && <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:7.5,color:'var(--lo)',letterSpacing:'.1em' }}>★ HIGHEST PAYOUT</div>}
                            </div>
                            <div style={{ textAlign:'right' }}>
                              <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:20,color:p.color }}>{fmt(net, sym)}</div>
                              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--tx3)' }}>{p.fee>0?`${(p.fee*100).toFixed(0)}% fee`:'no fee'}</div>
                            </div>
                          </div>
                          {/* Payout bar */}
                          <div style={{ height:5,background:'var(--bdr)',borderRadius:3,overflow:'hidden' }}>
                            <motion.div style={{ height:'100%',borderRadius:3,background:p.color }}
                              initial={{ width:0 }}
                              animate={{ width:`${estimate.adj>0?(net/estimate.adj)*100:0}%` }}
                              transition={{ duration:0.6,delay:i*.05 }}/>
                          </div>
                          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:6 }}>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx2)' }}>⏱ {p.speed}</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx2)' }}>🔧 {p.effort} effort</div>
                          </div>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--lo)',padding:'2px 0' }}>✓ {p.pros}</div>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--er)',padding:'2px 0' }}>✗ {p.cons}</div>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                </motion.div>
              )}

              {/* ══ ALTERNATIVES ══ */}
              {tab==='alts' && (
                <motion.div key="alts" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>📚</span><span>Before buying any textbook, explore these options. You may not need to buy it at all.</span></div>

                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:12 }} className="g2">
                    {ALTERNATIVES.map((alt,i) => (
                      <motion.div key={i} className="alt-card"
                        style={{ borderLeft:`3px solid ${alt.color}` }}
                        initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*.05 }}>
                        <div style={{ display:'flex',alignItems:'center',gap:9,marginBottom:7 }}>
                          <span style={{ fontSize:18 }}>{alt.icon}</span>
                          <div>
                            <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:alt.color }}>{alt.name}</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--tx3)' }}>{alt.type}</div>
                          </div>
                        </div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx2)',lineHeight:1.65,marginBottom:8 }}>{alt.desc}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,
                          color:alt.legal.startsWith('✓')?'var(--lo)':'var(--warn)',marginBottom:6 }}>{alt.legal}</div>
                        {alt.url && (
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)' }}>→ {alt.url}</div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="panel" style={{ padding:'18px 20px' }}>
                    <div className="lbl" style={{ marginBottom:10 }}>Cost Comparison: {sym}120 Textbook</div>
                    {[
                      { label:'Buy New',           cost:120, color:'var(--er)' },
                      { label:'Buy Used (Good)',   cost:54,  color:'var(--warn)' },
                      { label:'Semester Rental',  cost:35,  color:'var(--pur)' },
                      { label:'eBook (1 semester)',cost:28,  color:'var(--acc)' },
                      { label:'Older Edition',    cost:15,  color:'var(--gold)' },
                      { label:'Library / Libgen', cost:0,   color:'var(--lo)' },
                    ].map((row,i) => (
                      <div key={i} style={{ display:'flex',alignItems:'center',gap:12,marginBottom:8 }}>
                        <div style={{ width:130,fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx2)',flexShrink:0 }}>{row.label}</div>
                        <div style={{ flex:1,height:8,background:'var(--bdr)',borderRadius:4,overflow:'hidden' }}>
                          <motion.div style={{ height:'100%',borderRadius:4,background:row.color }}
                            initial={{ width:0 }} animate={{ width:`${(row.cost/120)*100}%` }} transition={{ duration:0.6,delay:i*.06 }}/>
                        </div>
                        <div style={{ width:40,fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:row.color,textAlign:'right',flexShrink:0 }}>
                          {row.cost===0?'Free':`${sym}${row.cost}`}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                </motion.div>
              )}

              {/* ══ TRACKER ══ */}
              {tab==='tracker' && (
                <motion.div key="trk" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="panel-hi" style={{ padding:'18px 22px' }}>
                    <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14 }}>
                      {[
                        { label:'Total Paid',      val:`${sym}${Math.round(trackerSummary.totalPaid)}`, color:'var(--er)' },
                        { label:'Total Recovered', val:`${sym}${Math.round(trackerSummary.totalRecovered)}`, color:'var(--lo)' },
                        { label:'Net Cost',        val:`${sym}${Math.round(trackerSummary.netCost)}`,   color:'var(--warn)' },
                        { label:'Recovery Rate',   val:`${trackerSummary.recoveryRate.toFixed(0)}%`,   color:'var(--acc)' },
                      ].map((s,i) => (
                        <div key={i} style={{ textAlign:'center' }}>
                          <div className="lbl" style={{ margin:'0 0 5px',textAlign:'center' }}>{s.label}</div>
                          <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:20,color:s.color }}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display:'flex',justifyContent:'flex-end' }}>
                    <button className="btn-add" onClick={addBook}>+ Add Book</button>
                  </div>

                  <AnimatePresence>
                    {books.map(book => {
                      const profit = (parseFloat(book.sold)||0) - (parseFloat(book.paid)||0);
                      return (
                        <motion.div key={book.id} className="track-row"
                          initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}>
                          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                            <div style={{ width:4,height:36,borderRadius:2,flexShrink:0,
                              background:book.status==='sold'?'var(--lo)':book.status==='listed'?'var(--warn)':'var(--tx3)' }}/>
                            <input className="inp" value={book.title} onChange={e => updBook(book.id,'title',e.target.value)}
                              style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,background:'transparent',
                                border:'none',borderBottom:'1px solid var(--bdr)',borderRadius:0,color:'var(--tx)',padding:'3px 0',flex:1 }}/>
                            <select className="sel" value={book.status} onChange={e => updBook(book.id,'status',e.target.value)}
                              style={{ width:90,padding:'4px 8px',fontSize:10 }}>
                              {['owned','listed','sold'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                            </select>
                            <button className="btn-icon" onClick={() => delBook(book.id)}>✕</button>
                          </div>
                          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:10,paddingLeft:14 }}>
                            {[
                              { label:'Paid', key:'paid', sym:'$' },
                              { label:'Sold For', key:'sold', sym:'$' },
                            ].map(f => (
                              <div key={f.key}>
                                <div className="lbl" style={{ fontSize:7.5 }}>{f.label}</div>
                                <div style={{ position:'relative' }}>
                                  <span style={{ position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx3)' }}>{f.sym}</span>
                                  <input className="inp" type="number" value={book[f.key]} onChange={e => updBook(book.id,f.key,+e.target.value)}
                                    style={{ paddingLeft:18,fontSize:12 }}/>
                                </div>
                              </div>
                            ))}
                            <div>
                              <div className="lbl" style={{ fontSize:7.5 }}>Platform</div>
                              <input className="inp" value={book.platform} onChange={e => updBook(book.id,'platform',e.target.value)}
                                placeholder="e.g. Amazon" style={{ fontSize:11 }}/>
                            </div>
                            <div>
                              <div className="lbl" style={{ fontSize:7.5 }}>Profit/Loss</div>
                              <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:16,
                                color:profit>=0?'var(--lo)':'var(--er)',paddingTop:8 }}>
                                {profit>=0?'+':''}{fmt(profit, sym)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {books.length===0 && <div style={{ textAlign:'center',padding:'50px',fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'var(--tx3)' }}>No books tracked yet.</div>}
                  
                </motion.div>
              )}

              {/* ══ EDITIONS ══ */}
              {tab==='editions' && (
                <motion.div key="ed" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}
                  style={{ display:'flex',flexDirection:'column',gap:14 }}>
                  <div className="hint"><span>📖</span><span>Edition timing is the single biggest factor in textbook resale value. A new edition can cut your book's value by 70% overnight.</span></div>

                  {/* Edition value decay */}
                  <div className="panel-hi" style={{ padding:'20px 22px' }}>
                    <div className="lbl" style={{ marginBottom:12 }}>Edition Value Decay — {sym}{pricePaid} book</div>
                    {Object.entries(EDITION_MULT).map(([label, mult], i) => {
                      const val = pricePaid * CONDITION_RATES[condition].rate * mult;
                      return (
                        <div key={i} style={{ display:'flex',alignItems:'center',gap:12,marginBottom:10 }}>
                          <div style={{ width:160,fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx2)',flexShrink:0 }}>{label}</div>
                          <div style={{ flex:1,height:10,background:'var(--bdr)',borderRadius:5,overflow:'hidden' }}>
                            <motion.div style={{ height:'100%',borderRadius:5,
                              background:mult>=1?'var(--lo)':mult>=0.5?'var(--warn)':'var(--er)' }}
                              initial={{ width:0 }} animate={{ width:`${mult*100}%` }} transition={{ duration:0.7,delay:i*.1 }}/>
                          </div>
                          <div style={{ width:55,fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:14,
                            color:mult>=1?'var(--lo)':mult>=0.5?'var(--warn)':'var(--er)',textAlign:'right',flexShrink:0 }}>
                            {fmt(val, sym)}
                          </div>
                          <div style={{ width:35,fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--tx3)',textAlign:'right',flexShrink:0 }}>
                            {(mult*100).toFixed(0)}%
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Edition signals */}
                  <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                    {EDITION_TIPS.map((tip,i) => (
                      <motion.div key={i} className="panel" style={{ padding:'16px 18px' }}
                        initial={{ opacity:0,y:6 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*.06 }}>
                        <div style={{ display:'flex',alignItems:'flex-start',gap:12 }}>
                          <span style={{ fontSize:16,flexShrink:0,marginTop:1 }}>{tip.risk.split(' ')[0]}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:13,color:'var(--tx)',marginBottom:5 }}>{tip.signal}</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx2)',lineHeight:1.6 }}>→ {tip.action}</div>
                          </div>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--tx3)',flexShrink:0 }}>{tip.risk.split(' ').slice(1).join(' ')}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="panel" style={{ padding:'16px 20px' }}>
                    <div className="lbl" style={{ marginBottom:9 }}>How to Check If a New Edition Is Coming</div>
                    {[
                      '🔍 Search "[Book Title] new edition 2025" — announcements appear 3–6 months before release',
                      '📧 Sign up for publisher alerts (Pearson, McGraw-Hill, Cengage have email lists)',
                      '🏫 Ask your bookstore — they receive edition change notices from publishers',
                      '📱 Check Amazon for pre-orders of the next edition (ISBN starts with 978)',
                      '👨‍🏫 Ask your professor — they often know if they\'re switching editions next semester',
                    ].map((t,i) => (
                      <div key={i} style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx2)',padding:'6px 0',
                        borderBottom:i<4?'1px solid var(--bdr)':'none',lineHeight:1.55 }}>{t}</div>
                    ))}
                  </div>
                  
                </motion.div>
              )}

              {/* ══ TIPS ══ */}
              {tab==='tips' && (
                <motion.div key="tips" initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0,y:-6 }}>
                  <div className="panel" style={{ padding:'26px 30px',marginBottom:14 }}>
                    <div style={{ fontFamily:"'Outfit',sans-serif",fontWeight:900,fontSize:26,color:'var(--tx)',marginBottom:4 }}>
                      The Student's Guide to Textbook Resale
                    </div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--tx3)',marginBottom:24,letterSpacing:'.12em' }}>
                      TIMING · PLATFORMS · CONDITION · EDITIONS
                    </div>
                    <div className="prose">
                      <h3>Timing Is Everything</h3>
                      <p>The best time to sell is <strong>the last week of your semester</strong> — demand peaks as students prepare for the next term. Wait until summer and you'll face 2× the competition at 60% of the price. A textbook that sells for $75 in April might fetch only $30 by August.</p>
                      <h3>Where to Sell (Quick Ranking)</h3>
                      <p>For maximum payout: <strong>Facebook Marketplace</strong> (no fees, instant local cash) or <strong>Amazon</strong> (massive reach, ~15% fee). For zero effort: <strong>Chegg or Decluttr</strong> (ship with prepaid label, lower payout). Never default to campus buyback — it almost always pays the least.</p>
                      <h3>Condition Is King</h3>
                      <p>A "Like New" book recovers 60% of its price. An "Acceptable" book recovers only 30%. Keep margins. Use pencil not pen. Store books flat. A clean, well-maintained textbook literally earns you double at resale.</p>
                      <h3>The Edition Trap</h3>
                      <p>Publishers release new editions every 2–3 years specifically to destroy the used book market. A new edition drops your book's resale value by 40–70% overnight. Always check for upcoming editions before purchasing — if a new edition is announced, either don't buy or buy digitally and skip resale entirely.</p>
                      {[
                        { q:'Should I include the access code when selling?', a:'Access codes (for MyLab, Mastering, etc.) are one-time use and expire — they add zero value to resale. Don\'t mention them in your listing if they\'re already used. If they\'re unused and valid, they can add $20–50 to your asking price, but verify the expiry date first.' },
                        { q:'Is it legal to sell international editions?', a:'Buying and reselling international editions within the US is generally legal (Supreme Court ruled in Kirtsaeng v. Wiley, 2013). However, some editions are marked "Not for sale in the US" — selling these is a gray area. Most resellers do it anyway, but know the risk.' },
                        { q:'What if my book won\'t sell?', a:'Options: (1) Donate to your university library — some give tax receipts. (2) List on AbeBooks for niche/older books. (3) Donate to a student exchange Facebook group. (4) Keep it — professional textbooks in STEM or medicine hold reference value long after graduation.' },
                        { q:'When is it worth NOT buying the textbook at all?', a:'Check your syllabus first. Many professors assign textbooks but only reference 3–4 chapters. Ask a student who took the class last semester. Many readings are available through your library database (JSTOR, ProQuest) or reserve section. The default should be "don\'t buy until you\'re sure you need it."' },
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