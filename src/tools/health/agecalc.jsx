import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   AGE.CALC v2 — Maximum Upgrade
   Dark Terminal Amber / Light Cream Ink  ·  QR.forge design system
   ─────────────────────────────────────────────────────────────────
   TABS:
   ◈ My Age       — Exact age, animated ring, live ticker, share card
   ⇄ Date Diff    — Any two dates, business days, weeks breakdown
   ★ Milestones   — 20+ life milestones with progress bars + countdowns
   ✦ Zodiac       — Western + Chinese + Vedic + numerology
   🌍 World Age   — Your age in different timezones / cities right now
   ⚖ Compare      — Compare ages of 2 people, who's older by how much
   📅 On This Day — Famous people born same day, historical events
   ∑ Learn        — Calendars, leap years, age systems, FAQ
   ─────────────────────────────────────────────────────────────────
   NEW vs v1:
   ✦ Live real-time ticker (seconds counting up)
   ✦ Animated SVG birthday countdown ring (improved)
   ✦ Life progress bar (% of average lifespan lived)
   ✦ 20+ milestone cards with animated fill bars
   ✦ Vedic / Jyotish rashi added to Zodiac
   ✦ Numerology life path number
   ✦ World Age tab — age in 8 major cities' local time
   ✦ Compare tab — 2-person age comparison with visual diff bar
   ✦ On This Day — famous birthdays on same month/day
   ✦ Share / copy result card
   ✦ Business days calculator in Date Diff
   ✦ Next birthday countdown (days + hours + mins + secs)
   ✦ Full mobile responsive layout
═══════════════════════════════════════════════════════════════════ */

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

.scard{padding:14px 16px;display:flex;flex-direction:column;gap:4px;}
.dk .scard{background:rgba(245,158,11,.03);border:1px solid rgba(245,158,11,.1);border-radius:4px;}
.lt .scard{background:rgba(146,64,14,.03);border:1.5px solid rgba(146,64,14,.1);border-radius:10px;}

.hint{padding:9px 13px;display:flex;gap:8px;align-items:flex-start;font-size:12.5px;line-height:1.72;}
.dk .hint{border:1px solid rgba(245,158,11,.15);border-radius:3px;background:rgba(245,158,11,.04);
  border-left:2.5px solid rgba(245,158,11,.4);color:var(--tx2);}
.lt .hint{border:1.5px solid rgba(146,64,14,.15);border-radius:9px;background:rgba(146,64,14,.04);
  border-left:3px solid rgba(146,64,14,.3);color:var(--tx2);}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(245,158,11,.012);border:1px dashed rgba(245,158,11,.1);border-radius:3px;}
.lt .ad{background:rgba(146,64,14,.03);border:1.5px dashed rgba(146,64,14,.15);border-radius:9px;}
.ad span{font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--tx3);}

.prose p{font-size:13.5px;line-height:1.82;margin-bottom:12px;color:var(--tx2);}
.prose h3{font-family:'Syne',sans-serif;font-size:15px;font-weight:800;margin:22px 0 8px;color:var(--tx);text-transform:uppercase;letter-spacing:.04em;}
.prose strong{font-weight:700;color:var(--tx);}
.qa{padding:12px 15px;margin-bottom:9px;}
.dk .qa{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.3);}
.lt .qa{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(146,64,14,.03);}

/* milestone bar */
.ms-bar-track{height:5px;border-radius:3px;overflow:hidden;}
.dk .ms-bar-track{background:rgba(245,158,11,.1);}
.lt .ms-bar-track{background:rgba(146,64,14,.1);}

/* life bar */
.life-track{height:10px;border-radius:5px;overflow:hidden;position:relative;}
.dk .life-track{background:rgba(245,158,11,.1);}
.lt .life-track{background:rgba(146,64,14,.1);}

/* share card dark */
.share-render{padding:22px 26px;border-radius:10px;
  background:linear-gradient(135deg,#0e0c09 0%,#1c1a12 60%,#0e0c09 100%);
  border:1px solid rgba(245,158,11,.22);}

/* ticker digits */
@keyframes digitFlip{0%{transform:translateY(-4px);opacity:0}100%{transform:translateY(0);opacity:1}}
.digit{display:inline-block;animation:digitFlip .15s ease forwards;}

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
  .main{padding:12px;}
}
@media(min-width:769px){.mob-btn{display:none!important;}}
@media(max-width:520px){
  .g2{grid-template-columns:1fr!important;}
  .g3{grid-template-columns:1fr 1fr!important;}
  .g4{grid-template-columns:1fr 1fr!important;}
}
`;

/* ─── DATA ────────────────────────────────────────────────────── */
const ZODIAC = [
  {sign:'Aries',      sym:'♈', mo:3,  d1:21, d2:31, el:'Fire',  stone:'Diamond',    trait:'Bold, ambitious'},
  {sign:'Taurus',     sym:'♉', mo:4,  d1:20, d2:30, el:'Earth', stone:'Emerald',    trait:'Patient, reliable'},
  {sign:'Gemini',     sym:'♊', mo:5,  d1:21, d2:31, el:'Air',   stone:'Pearl',      trait:'Curious, versatile'},
  {sign:'Cancer',     sym:'♋', mo:6,  d1:21, d2:30, el:'Water', stone:'Ruby',       trait:'Intuitive, caring'},
  {sign:'Leo',        sym:'♌', mo:7,  d1:23, d2:31, el:'Fire',  stone:'Peridot',    trait:'Confident, creative'},
  {sign:'Virgo',      sym:'♍', mo:8,  d1:23, d2:31, el:'Earth', stone:'Sapphire',   trait:'Analytical, precise'},
  {sign:'Libra',      sym:'♎', mo:9,  d1:23, d2:30, el:'Air',   stone:'Opal',       trait:'Balanced, diplomatic'},
  {sign:'Scorpio',    sym:'♏', mo:10, d1:23, d2:31, el:'Water', stone:'Topaz',      trait:'Intense, perceptive'},
  {sign:'Sagittarius',sym:'♐', mo:11, d1:22, d2:30, el:'Fire',  stone:'Turquoise',  trait:'Adventurous, optimistic'},
  {sign:'Capricorn',  sym:'♑', mo:12, d1:22, d2:31, el:'Earth', stone:'Garnet',     trait:'Disciplined, ambitious'},
  {sign:'Aquarius',   sym:'♒', mo:1,  d1:20, d2:31, el:'Air',   stone:'Amethyst',   trait:'Independent, innovative'},
  {sign:'Pisces',     sym:'♓', mo:2,  d1:19, d2:29, el:'Water', stone:'Aquamarine', trait:'Empathetic, artistic'},
];

const CHINESE_ZODIAC = ['Rat','Ox','Tiger','Rabbit','Dragon','Snake','Horse','Goat','Monkey','Rooster','Dog','Pig'];
const CHINESE_EMOJI  = ['🐭','🐂','🐯','🐰','🐲','🐍','🐴','🐑','🐵','🐓','🐶','🐷'];

const VEDIC_RASHI = [
  {name:'Mesha',    sym:'♈', mo:4,  d1:14},
  {name:'Vrishabha',sym:'♉', mo:5,  d1:15},
  {name:'Mithuna',  sym:'♊', mo:6,  d1:15},
  {name:'Karka',    sym:'♋', mo:7,  d1:16},
  {name:'Simha',    sym:'♌', mo:8,  d1:17},
  {name:'Kanya',    sym:'♍', mo:9,  d1:17},
  {name:'Tula',     sym:'♎', mo:10, d1:17},
  {name:'Vrishchika',sym:'♏',mo:11, d1:16},
  {name:'Dhanu',    sym:'♐', mo:12, d1:16},
  {name:'Makara',   sym:'♑', mo:1,  d1:14},
  {name:'Kumbha',   sym:'♒', mo:2,  d1:13},
  {name:'Meena',    sym:'♓', mo:3,  d1:14},
];

const EL_COL = { Fire:'#f87171', Earth:'#34d399', Air:'#60a5fa', Water:'#818cf8' };

const MILESTONES = [
  { label:'First 1,000 Days',   val:1000,   unit:'days', sub:'foundation of life',        icon:'🌱' },
  { label:'5,000 Days Old',     val:5000,   unit:'days', sub:'~13.7 years',                icon:'📅' },
  { label:'10,000 Days Old',    val:10000,  unit:'days', sub:'~27.4 years milestone',       icon:'✦' },
  { label:'15,000 Days Old',    val:15000,  unit:'days', sub:'~41.1 years',                icon:'⏳' },
  { label:'20,000 Days Old',    val:20000,  unit:'days', sub:'~54.8 years milestone',       icon:'🎯' },
  { label:'18th Birthday',      val:18,     unit:'years',sub:'legal adulthood (most countries)',icon:'🗳️' },
  { label:'21st Birthday',      val:21,     unit:'years',sub:'full legal adult rights',     icon:'🔑' },
  { label:'25th Birthday',      val:25,     unit:'years',sub:'frontal lobe fully developed',icon:'🧠' },
  { label:'30th Birthday',      val:30,     unit:'years',sub:'entering your 30s',           icon:'🎂' },
  { label:'40th Birthday',      val:40,     unit:'years',sub:'life begins at 40',           icon:'🎉' },
  { label:'50th Birthday',      val:50,     unit:'years',sub:'golden jubilee year',         icon:'🏅' },
  { label:'60th Birthday',      val:60,     unit:'years',sub:'diamond jubilee',             icon:'💎' },
  { label:'75th Birthday',      val:75,     unit:'years',sub:'platinum year',               icon:'✨' },
  { label:'100th Birthday',     val:100,    unit:'years',sub:'centenarian milestone',       icon:'🎊' },
  { label:'1 Million Hours',    val:114.16, unit:'years',sub:'≈ 1,000,000 hours alive',    icon:'⏱️' },
  { label:'1 Billion Seconds',  val:31.69,  unit:'years',sub:'≈ 1,000,000,000 seconds',   icon:'⚡' },
];

const WORLD_CITIES = [
  { name:'New York',    tz:'America/New_York',   flag:'🇺🇸' },
  { name:'London',      tz:'Europe/London',       flag:'🇬🇧' },
  { name:'Paris',       tz:'Europe/Paris',        flag:'🇫🇷' },
  { name:'Dubai',       tz:'Asia/Dubai',          flag:'🇦🇪' },
  { name:'Mumbai',      tz:'Asia/Kolkata',        flag:'🇮🇳' },
  { name:'Singapore',   tz:'Asia/Singapore',      flag:'🇸🇬' },
  { name:'Tokyo',       tz:'Asia/Tokyo',          flag:'🇯🇵' },
  { name:'Sydney',      tz:'Australia/Sydney',    flag:'🇦🇺' },
];

const FAMOUS_BDAYS = [
  {name:'Albert Einstein',   mo:3,  d:14, year:1879, field:'Physics'},
  {name:'Isaac Newton',      mo:1,  d:4,  year:1643, field:'Mathematics'},
  {name:'Leonardo da Vinci', mo:4,  d:15, year:1452, field:'Art & Science'},
  {name:'Marie Curie',       mo:11, d:7,  year:1867, field:'Chemistry'},
  {name:'William Shakespeare',mo:4, d:23, year:1564, field:'Literature'},
  {name:'Abraham Lincoln',   mo:2,  d:12, year:1809, field:'Politics'},
  {name:'Charles Darwin',    mo:2,  d:12, year:1809, field:'Biology'},
  {name:'Nikola Tesla',      mo:7,  d:10, year:1856, field:'Electrical Engineering'},
  {name:'Ada Lovelace',      mo:12, d:10, year:1815, field:'Computing'},
  {name:'Mahatma Gandhi',    mo:10, d:2,  year:1869, field:'Peace & Politics'},
  {name:'Nelson Mandela',    mo:7,  d:18, year:1918, field:'Politics'},
  {name:'Frida Kahlo',       mo:7,  d:6,  year:1907, field:'Art'},
  {name:'Mozart',            mo:1,  d:27, year:1756, field:'Music'},
  {name:'Beethoven',         mo:12, d:17, year:1770, field:'Music'},
  {name:'Galileo Galilei',   mo:2,  d:15, year:1564, field:'Astronomy'},
  {name:'Florence Nightingale',mo:5,d:12, year:1820, field:'Nursing'},
  {name:'Stephen Hawking',   mo:1,  d:8,  year:1942, field:'Physics'},
  {name:'Elon Musk',         mo:6,  d:28, year:1971, field:'Technology'},
  {name:'Bill Gates',        mo:10, d:28, year:1955, field:'Technology'},
  {name:'Steve Jobs',        mo:2,  d:24, year:1955, field:'Technology'},
];

const TABS = [
  { id:'age',      icon:'◈', label:'My Age' },
  { id:'diff',     icon:'⇄', label:'Date Diff' },
  { id:'milestones',icon:'★',label:'Milestones' },
  { id:'zodiac',   icon:'✦', label:'Zodiac' },
  { id:'world',    icon:'🌍',label:'World Age' },
  { id:'compare',  icon:'⚖', label:'Compare' },
  { id:'onthisday',icon:'📅',label:'On This Day' },
  { id:'learn',    icon:'∑', label:'Learn' },
];

/* ─── HELPERS ─────────────────────────────────────────────────── */
const today = () => new Date();

const calcAge = (dob, ref = today()) => {
  if(!dob) return null;
  const d = new Date(dob), r = new Date(ref);
  if(isNaN(d)) return null;
  let y = r.getFullYear() - d.getFullYear();
  let mo = r.getMonth() - d.getMonth();
  let dy = r.getDate() - d.getDate();
  if(dy < 0) { mo--; const prev = new Date(r.getFullYear(), r.getMonth(), 0); dy += prev.getDate(); }
  if(mo < 0) { y--; mo += 12; }
  const totalDays  = Math.floor((r - d) / 86400000);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const totalMins  = totalHours * 60;
  const totalSecs  = totalMins * 60;
  return { y, mo, dy, totalDays, totalWeeks, totalHours, totalMins, totalSecs };
};

const nextBirthday = (dob) => {
  if(!dob) return null;
  const d = new Date(dob), now = new Date();
  let next = new Date(now.getFullYear(), d.getMonth(), d.getDate());
  if(next <= now) next = new Date(now.getFullYear()+1, d.getMonth(), d.getDate());
  const diff = next - now;
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  const secs  = Math.floor((diff % 60000) / 1000);
  const yearPct = 1 - diff / 31536000000;
  return { next, days, hours, mins, secs, yearPct: Math.max(0, Math.min(1, yearPct)) };
};

const getZodiac = (dob) => {
  if(!dob) return null;
  const d = new Date(dob);
  const mo = d.getMonth()+1, day = d.getDate();
  return ZODIAC.find(z => (z.mo === mo && day >= z.d1) || (z.mo+1 === mo && day < z.d1) ||
    (z.mo === 12 && mo === 1 && day < 20) || (z.mo === 3 && mo === 3 && day >= 21)) ||
    ZODIAC.find(z => z.mo === mo) || ZODIAC[0];
};

// simpler zodiac finder
const findZodiac = (dob) => {
  if(!dob) return null;
  const d = new Date(dob), mo = d.getMonth()+1, day = d.getDate();
  const bounds = [
    [3,21,12,20,'Aries'],[4,20,5,20,'Taurus'],[5,21,6,20,'Gemini'],
    [6,21,7,22,'Cancer'],[7,23,8,22,'Leo'],[8,23,9,22,'Virgo'],
    [9,23,10,22,'Libra'],[10,23,11,21,'Scorpio'],[11,22,12,21,'Sagittarius'],
    [12,22,12,31,'Capricorn'],[1,1,1,19,'Capricorn'],[1,20,2,18,'Aquarius'],[2,19,3,20,'Pisces'],
  ];
  const name = bounds.find(([sm,sd,em,ed]) => (mo===sm&&day>=sd)||(mo===em&&day<=ed))?.at(-1)||'Capricorn';
  return ZODIAC.find(z=>z.sign===name)||ZODIAC[0];
};

const chineseZodiac = (year) => {
  const idx = (year - 4) % 12;
  return { animal: CHINESE_ZODIAC[idx], emoji: CHINESE_EMOJI[idx] };
};

// Life path number
const lifePathNum = (dob) => {
  if(!dob) return null;
  const digits = dob.replace(/-/g,'').split('').map(Number);
  let sum = digits.reduce((a,b)=>a+b,0);
  while(sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').map(Number).reduce((a,b)=>a+b,0);
  }
  return sum;
};

const dateDiff = (d1, d2) => {
  if(!d1||!d2) return null;
  const a = new Date(d1), b = new Date(d2);
  if(isNaN(a)||isNaN(b)) return null;
  const [start, end] = a < b ? [a,b] : [b,a];
  const totalDays = Math.round((end-start)/86400000);
  const totalWeeks= Math.floor(totalDays/7);
  // business days
  let biz = 0, cur = new Date(start);
  while(cur < end) { const dow=cur.getDay(); if(dow>0&&dow<6) biz++; cur.setDate(cur.getDate()+1); }
  // years/months/days
  const age = calcAge(start.toISOString().slice(0,10), end.toISOString().slice(0,10));
  return { totalDays, totalWeeks, biz, y:age?.y||0, mo:age?.mo||0, dy:age?.dy||0, earlier: a < b ? 'A':'B' };
};

/* ─── MAIN ────────────────────────────────────────────────────── */
export default function AgeCalculator() {
  const [dark, setDark] = useState(true);
  const [tab,  setTab]  = useState('age');
  const [mob,  setMob]  = useState(false);

  const [dob,    setDob]    = useState('1995-06-15');
  const [dob2,   setDob2]   = useState('1990-03-22');
  const [name1,  setName1]  = useState('Person A');
  const [name2,  setName2]  = useState('Person B');
  const [diffA,  setDiffA]  = useState('2020-01-01');
  const [diffB,  setDiffB]  = useState(new Date().toISOString().slice(0,10));
  const [ticker, setTicker] = useState(today());
  const [showCard, setShowCard] = useState(false);
  const [copied,   setCopied]   = useState(false);

  const dk = dark;

  // live ticker every second
  useEffect(() => {
    const id = setInterval(() => setTicker(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* derived */
  const age     = useMemo(() => calcAge(dob, ticker), [dob, ticker]);
  const age2    = useMemo(() => calcAge(dob2),        [dob2]);
  const bday    = useMemo(() => nextBirthday(dob),    [dob, ticker]);
  const zodiac  = useMemo(() => findZodiac(dob),      [dob]);
  const zodiac2 = useMemo(() => findZodiac(dob2),     [dob2]);
  const chinese = useMemo(() => dob ? chineseZodiac(new Date(dob).getFullYear()) : null, [dob]);
  const lpNum   = useMemo(() => lifePathNum(dob),     [dob]);
  const diff    = useMemo(() => dateDiff(diffA, diffB),[diffA, diffB]);

  // life progress (avg lifespan 72.6 years)
  const lifePct = age ? Math.min(100, (age.y/72.6)*100) : 0;

  // world age display
  const worldAges = useMemo(() => {
    if(!dob) return [];
    return WORLD_CITIES.map(c => {
      try {
        const localNow = new Date(new Date().toLocaleString('en-US', { timeZone: c.tz }));
        const a = calcAge(dob, localNow);
        const localStr = localNow.toLocaleTimeString('en-US', { timeZone: c.tz, hour:'2-digit', minute:'2-digit' });
        return { ...c, age: a, localTime: localStr };
      } catch { return { ...c, age: null, localTime:'—' }; }
    });
  }, [dob, ticker]);

  // famous people with same birthday
  const sameDay = useMemo(() => {
    if(!dob) return [];
    const d = new Date(dob);
    return FAMOUS_BDAYS.filter(p => p.mo === d.getMonth()+1 && p.d === d.getDate());
  }, [dob]);

  const shareText = age
    ? `Age: ${age.y} years, ${age.mo} months, ${age.dy} days\nDOB: ${dob}\nTotal Days: ${age.totalDays.toLocaleString()}\nNext Birthday: ${bday?.days} days away\nage.calc`
    : '';
  const doCopy = () => { navigator.clipboard?.writeText(shareText); setCopied(true); setTimeout(()=>setCopied(false),2000); };

  /* ─── SUB-COMPONENTS ─────────────────────────────────────────── */
  const SC = ({lbl,val,sub,col,span}) => (
    <div className="scard" style={span?{gridColumn:`span ${span}`}:{}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.16em',textTransform:'uppercase',color:'var(--tx3)'}}>{lbl}</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:col||'var(--acc)',lineHeight:1.1,letterSpacing:'-.02em'}}>{val}</div>
      {sub&&<div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx2)'}}>{sub}</div>}
    </div>
  );

  /* Animated birthday ring */
  const BirthdayRing = ({pct, days, size=170}) => {
    const R=64, cx=size/2, cy=size/2, circ=2*Math.PI*R;
    const filled = circ * pct;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={dk?'rgba(245,158,11,.08)':'rgba(146,64,14,.09)'} strokeWidth="10"/>
        <motion.circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--acc)" strokeWidth="10"
          strokeLinecap="round" strokeDasharray={`${filled} ${circ-filled}`}
          strokeDashoffset={circ/4} style={{transformOrigin:'center',rotate:'-90deg'}}
          initial={{strokeDasharray:`0 ${circ}`}}
          animate={{strokeDasharray:`${filled} ${circ-filled}`}}
          transition={{duration:1.4,ease:[.34,1.56,.64,1]}}/>
        {/* glow dot at tip */}
        {pct > 0 && (
          <motion.circle
            cx={cx + R*Math.cos((pct*2*Math.PI) - Math.PI/2)}
            cy={cy + R*Math.sin((pct*2*Math.PI) - Math.PI/2)}
            r="6" fill="var(--acc)"
            style={{filter:'drop-shadow(0 0 6px var(--acc))'}}
            initial={{scale:0}} animate={{scale:1}} transition={{delay:.8,type:'spring'}}/>
        )}
        <text x={cx} y={cy-10} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="9" fill="var(--tx3)" letterSpacing="1.5">NEXT BDAY</text>
        <text x={cx} y={cy+10} textAnchor="middle" fontFamily="'Syne',sans-serif" fontWeight="900" fontSize="26" fill="var(--acc)">{days}</text>
        <text x={cx} y={cy+24} textAnchor="middle" fontFamily="'DM Mono',monospace" fontSize="8.5" fill="var(--tx3)">days away</text>
      </svg>
    );
  };

  /* Life progress bar */
  const LifeBar = ({pct}) => (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
        <div className="lbl" style={{margin:0}}>Life Progress (avg. 72.6 yrs)</div>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:10.5,color:'var(--acc)',fontWeight:700}}>{pct.toFixed(1)}%</span>
      </div>
      <div className="life-track">
        <motion.div initial={{width:0}} animate={{width:`${pct}%`}}
          transition={{duration:1.2,ease:[.34,1.56,.64,1]}}
          style={{height:'100%',background:`linear-gradient(90deg,var(--lo),var(--acc),var(--er))`,borderRadius:5}}/>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'DM Mono',monospace",fontSize:8,color:'var(--tx3)',marginTop:3}}>
        <span>Birth</span><span>25</span><span>50</span><span>75</span><span>100+</span>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════════ */
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
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={dk?'#f59e0b':'#fff'} strokeWidth="2.2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:16,letterSpacing:'-.01em',color:'var(--tx)'}}>
              AGE<span style={{color:'var(--acc)'}}>.calc</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontWeight:400,fontSize:8,letterSpacing:'.15em',color:'var(--tx3)',marginLeft:7,verticalAlign:'middle'}}>v2</span>
            </span>
          </div>

          <div style={{flex:1}}/>

          {age&&(
            <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
              style={{display:'flex',alignItems:'center',gap:6,padding:'4px 11px',
                borderRadius:dk?3:20,border:dk?'1px solid rgba(245,158,11,.2)':'1.5px solid rgba(146,64,14,.18)',
                background:dk?'rgba(245,158,11,.05)':'rgba(146,64,14,.04)'}}>
              <div style={{width:7,height:7,borderRadius:'50%',background:'var(--acc)',
                boxShadow:dk?'0 0 6px var(--acc)':'none',animation:'pulse 2s infinite'}}/>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx2)',letterSpacing:'.06em'}}>
                {age.y}y {age.mo}m {age.dy}d · {bday?.days}d to birthday · {zodiac?.sign}
              </span>
            </motion.div>
          )}

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
            

            {age&&(
              <div>
                <div className="sec-lbl">Quick Stats</div>
                {[
                  ['Age',         `${age.y} yrs`,                         'var(--acc)'],
                  ['Months',      `${age.y*12+age.mo}`,                   'var(--tx2)'],
                  ['Total Days',  age.totalDays.toLocaleString(),          'var(--tx2)'],
                  ['Total Weeks', age.totalWeeks.toLocaleString(),         'var(--tx2)'],
                  ['Total Hours', (age.totalDays*24).toLocaleString(),     'var(--tx2)'],
                  ['Next Birthday',`${bday?.days}d ${bday?.hours}h`,      'var(--lo)'],
                  ['Zodiac',      `${zodiac?.sym} ${zodiac?.sign}`,        'var(--acc)'],
                  ['Chinese',     `${chinese?.emoji} ${chinese?.animal}`,  'var(--acc)'],
                  ['Life Path',   `#${lpNum}`,                             'var(--pur)'],
                  ['Life %',      `${lifePct.toFixed(1)}%`,               lifePct>75?'var(--er)':lifePct>50?'var(--acc)':'var(--lo)'],
                ].map(([l,v,c])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                    padding:'5px 0',borderBottom:dk?'1px solid rgba(245,158,11,.05)':'1px solid rgba(146,64,14,.06)'}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)'}}>{l}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:c,fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            
          </div>

          {/* ── MAIN ── */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══════════ MY AGE TAB ══════════ */}
              {tab==='age'&&(
                <motion.div key="age" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:.22}} style={{display:'flex',flexDirection:'column',gap:14}}>

                  {/* DOB input */}
                  <div className="panel" style={{padding:'18px 22px'}}>
                    <div className="lbl" style={{marginBottom:10}}>◈ Date of Birth</div>
                    <input className="inp" type="date" value={dob}
                      max={new Date().toISOString().slice(0,10)}
                      onChange={e=>setDob(e.target.value)}
                      style={{fontSize:14,padding:'10px 12px'}}/>
                  </div>

                  {age&&bday&&(
                    <motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{delay:.05}} style={{display:'flex',flexDirection:'column',gap:12}}>

                      {/* Hero card */}
                      <div className="panel-hi" style={{padding:'24px 28px'}}>
                        <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:28,alignItems:'center'}}>
                          <BirthdayRing pct={bday.yearPct} days={bday.days} size={180}/>
                          <div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.22em',textTransform:'uppercase',color:'var(--tx3)',marginBottom:8}}>Your Exact Age</div>
                            <div style={{display:'flex',alignItems:'baseline',gap:8,flexWrap:'wrap',marginBottom:12}}>
                              {[
                                [age.y, 'years'],
                                [age.mo,'months'],
                                [age.dy,'days'],
                              ].map(([n,u])=>(
                                <div key={u} style={{display:'flex',alignItems:'baseline',gap:3}}>
                                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:u==='years'?60:38,color:'var(--acc)',lineHeight:1,letterSpacing:'-.03em'}}>{n}</span>
                                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--tx3)'}}>{u}</span>
                                </div>
                              ))}
                            </div>
                            {/* live countdown to next bday */}
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--tx2)',marginBottom:8}}>
                              Next birthday in: <strong style={{color:'var(--lo)'}}>{bday.days}d {bday.hours}h {bday.mins}m {bday.secs}s</strong>
                            </div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--tx3)'}}>
                              {bday.next.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
                            </div>
                          </div>
                        </div>
                        {/* life bar */}
                        <div style={{marginTop:22}}>
                          <LifeBar pct={lifePct}/>
                        </div>
                      </div>

                      {/* big number grid */}
                      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}} className="g4">
                        <SC lbl="Total Days"  val={age.totalDays.toLocaleString()}                      sub="days since birth"/>
                        <SC lbl="Total Weeks" val={age.totalWeeks.toLocaleString()}                     sub="weeks old"/>
                        <SC lbl="Total Hours" val={(age.totalDays*24).toLocaleString()}                 sub="hours lived" col="var(--info)"/>
                        <SC lbl="Total Mins"  val={`${(age.totalDays*1440/1e6).toFixed(1)}M`}          sub="million minutes" col="var(--pur)"/>
                      </div>

                      {/* extra fun stats */}
                      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}} className="g3">
                        <SC lbl="Heartbeats (est.)" val={`${((age.totalDays*24*60*70)/1e9).toFixed(2)}B`} sub="at 70 bpm avg" col="var(--er)"/>
                        <SC lbl="Breaths (est.)"    val={`${((age.totalDays*24*60*15)/1e6).toFixed(0)}M`} sub="at 15/min avg"  col="var(--lo)"/>
                        <SC lbl="Born Day"          val={new Date(dob).toLocaleDateString('en-US',{weekday:'long'})} sub={new Date(dob).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})} col="var(--tx2)"/>
                      </div>

                      {/* Share */}
                      <div className="panel" style={{padding:'14px 18px'}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                          <div className="lbl" style={{margin:0}}>⊕ Share Result</div>
                          <div style={{display:'flex',gap:8}}>
                            <button className="btn-ghost" onClick={doCopy}>{copied?'✓ Copied':'⎘ Copy'}</button>
                            <button className={`btn-ghost ${showCard?'on':''}`} onClick={()=>setShowCard(s=>!s)}>▣ Card</button>
                          </div>
                        </div>
                        <AnimatePresence>
                          {showCard&&(
                            <motion.div initial={{opacity:0,height:0,marginTop:0}} animate={{opacity:1,height:'auto',marginTop:14}} exit={{opacity:0,height:0,marginTop:0}}>
                              <div className="share-render">
                                <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.24em',textTransform:'uppercase',color:'rgba(245,158,11,.45)',marginBottom:14}}>AGE.CALC · RESULT CARD</div>
                                <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:18,flexWrap:'wrap'}}>
                                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:52,color:'var(--acc)',lineHeight:1}}>{age.y}</span>
                                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:'#fef3c7'}}>years</span>
                                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:32,color:'var(--acc2)'}}>{age.mo}</span>
                                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(254,243,199,.6)'}}>months</span>
                                  <span style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:32,color:'var(--acc2)'}}>{age.dy}</span>
                                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(254,243,199,.6)'}}>days</span>
                                </div>
                                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
                                  {[['DOB',dob],['Total Days',age.totalDays.toLocaleString()],['Next Bday',`${bday.days} days`]].map(([l,v])=>(
                                    <div key={l}>
                                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(245,158,11,.4)',marginBottom:3}}>{l}</div>
                                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,color:'#fef3c7'}}>{v}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  
                </motion.div>
              )}

              {/* ══════════ DATE DIFF TAB ══════════ */}
              {tab==='diff'&&(
                <motion.div key="diff" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'18px 22px'}}>
                    <div className="lbl" style={{marginBottom:12}}>⇄ Two Dates</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:12,alignItems:'end'}}>
                      <div>
                        <div className="lbl">Date A</div>
                        <input className="inp" type="date" value={diffA} onChange={e=>setDiffA(e.target.value)}/>
                      </div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:18,color:'var(--tx3)',paddingBottom:8,textAlign:'center'}}>→</div>
                      <div>
                        <div className="lbl">Date B</div>
                        <input className="inp" type="date" value={diffB} onChange={e=>setDiffB(e.target.value)}/>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8,marginTop:10,flexWrap:'wrap'}}>
                      {[
                        ['Today → B', ()=>setDiffA(new Date().toISOString().slice(0,10))],
                        ['My DOB → Today', ()=>{ setDiffA(dob); setDiffB(new Date().toISOString().slice(0,10)); }],
                        ['Start of Year', ()=>setDiffA(`${new Date().getFullYear()}-01-01`)],
                      ].map(([l,fn])=>(
                        <button key={l} className="btn-ghost" onClick={fn}>{l}</button>
                      ))}
                    </div>
                  </div>

                  {diff&&(
                    <motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} style={{display:'flex',flexDirection:'column',gap:12}}>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}} className="g3">
                        <SC lbl="Years"         val={diff.y}                         sub={`${diff.mo} months ${diff.dy} days extra`}/>
                        <SC lbl="Total Days"    val={diff.totalDays.toLocaleString()} sub="calendar days"/>
                        <SC lbl="Total Weeks"   val={diff.totalWeeks.toLocaleString()} sub={`${diff.totalDays % 7} extra days`}/>
                        <SC lbl="Business Days" val={diff.biz.toLocaleString()}       sub="Mon–Fri (excl. weekends)" col="var(--lo)"/>
                        <SC lbl="Weekend Days"  val={(diff.totalDays-diff.biz).toLocaleString()} sub="Sat & Sun" col="var(--info)"/>
                        <SC lbl="Months"        val={diff.y*12+diff.mo}               sub="total calendar months" col="var(--tx2)"/>
                      </div>

                      {/* visual progress bar between dates */}
                      <div className="panel" style={{padding:'18px 22px'}}>
                        <div className="lbl" style={{marginBottom:10}}>⇄ Timeline Visualisation</div>
                        <div style={{position:'relative',height:8,borderRadius:4,background:dk?'rgba(245,158,11,.08)':'rgba(146,64,14,.1)',marginBottom:10}}>
                          <motion.div initial={{width:0}} animate={{width:'100%'}}
                            transition={{duration:1,ease:'easeOut'}}
                            style={{height:'100%',background:'linear-gradient(90deg,var(--info),var(--acc))',borderRadius:4}}/>
                        </div>
                        <div style={{display:'flex',justifyContent:'space-between',fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--tx2)'}}>
                          <span>📅 {new Date(diffA).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}</span>
                          <span style={{color:'var(--acc)',fontWeight:700}}>{diff.totalDays} days</span>
                          <span>📅 {new Date(diffB).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}</span>
                        </div>
                      </div>

                      <div className="hint">
                        <span>ℹ</span>
                        <span>Date {diff.earlier} is earlier. The difference is <strong style={{color:'var(--acc)'}}>{diff.y} years, {diff.mo} months, and {diff.dy} days</strong> — or exactly <strong style={{color:'var(--acc)'}}>{diff.totalDays.toLocaleString()} calendar days</strong> ({diff.biz.toLocaleString()} business days).</span>
                      </div>
                    </motion.div>
                  )}

                  
                </motion.div>
              )}

              {/* ══════════ MILESTONES TAB ══════════ */}
              {tab==='milestones'&&(
                <motion.div key="ms" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:10}}>
                  {!dob&&<div className="hint"><span>ℹ</span><span>Enter your date of birth on the ◈ My Age tab first.</span></div>}
                  {dob&&MILESTONES.map((m,i)=>{
                    const dobD = new Date(dob);
                    const msDate = m.unit==='days'
                      ? new Date(dobD.getTime() + m.val*86400000)
                      : new Date(dobD.getFullYear()+m.val, dobD.getMonth(), dobD.getDate());
                    const now = new Date();
                    const daysLeft = Math.ceil((msDate-now)/86400000);
                    const isPast   = daysLeft <= 0;
                    const daysTotal= Math.ceil((msDate-dobD)/86400000);
                    const daysGone = Math.ceil((now-dobD)/86400000);
                    const pct = Math.min(100, Math.max(0, daysGone/daysTotal*100));
                    return (
                      <motion.div key={m.label} initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}} transition={{delay:i*.03}}
                        className="panel" style={{padding:'14px 18px',opacity:isPast?.7:1}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <span style={{fontSize:18}}>{m.icon}</span>
                            <div>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,
                                color:isPast?'var(--tx3)':'var(--tx)',marginBottom:2}}>
                                {isPast?'✓ ':''}{m.label}
                              </div>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx3)'}}>{m.sub}</div>
                            </div>
                          </div>
                          <div style={{textAlign:'right',flexShrink:0,marginLeft:12}}>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,
                              color:isPast?'var(--lo)':Math.abs(daysLeft)<30?'var(--acc)':'var(--tx2)'}}>
                              {isPast?'Done':daysLeft<365?`${daysLeft}d`:`${Math.floor(daysLeft/365)}y ${Math.floor((daysLeft%365)/30)}m`}
                            </div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,color:'var(--tx3)'}}>
                              {msDate.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}
                            </div>
                          </div>
                        </div>
                        {/* progress bar */}
                        <div className="ms-bar-track">
                          <motion.div initial={{width:0}} animate={{width:`${pct}%`}}
                            transition={{delay:i*.03+.1,duration:.8,ease:'easeOut'}}
                            style={{height:'100%',background:isPast?'var(--lo)':pct>70?'var(--acc2)':'var(--acc)',borderRadius:3}}/>
                        </div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,color:'var(--tx3)',marginTop:4}}>{pct.toFixed(0)}% complete</div>
                      </motion.div>
                    );
                  })}
                  
                </motion.div>
              )}

              {/* ══════════ ZODIAC TAB ══════════ */}
              {tab==='zodiac'&&(
                <motion.div key="zod" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  {zodiac&&chinese&&(()=>{
                    // vedic rashi
                    const d = new Date(dob), mo=d.getMonth()+1, day=d.getDate();
                    const vIdx = VEDIC_RASHI.findIndex(r=> mo===r.mo&&day>=r.d1 || (mo===r.mo-1&&day<r.d1));
                    const vRashi = VEDIC_RASHI[vIdx>=0?vIdx:mo-1]||VEDIC_RASHI[0];

                    const LP_MEANINGS = {1:'Leader',2:'Peacemaker',3:'Creative',4:'Builder',5:'Freedom',6:'Nurturer',7:'Seeker',8:'Achiever',9:'Humanitarian',11:'Visionary',22:'Master Builder',33:'Master Teacher'};
                    return (
                      <>
                        {/* Western hero */}
                        <div className="panel-hi" style={{padding:'24px 28px'}}>
                          <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:24,alignItems:'center'}}>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:88,
                              color:'var(--acc)',lineHeight:1,textShadow:dk?'0 0 30px rgba(245,158,11,.4)':'none'}}>{zodiac.sym}</div>
                            <div>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.22em',textTransform:'uppercase',color:'var(--tx3)',marginBottom:6}}>Western Zodiac</div>
                              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:36,color:'var(--tx)',letterSpacing:'-.02em',marginBottom:10}}>{zodiac.sign}</div>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--tx2)',marginBottom:12}}>{zodiac.trait}</div>
                              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                                {[
                                  ['Element', zodiac.el, EL_COL[zodiac.el]],
                                  ['Birthstone', zodiac.stone, 'var(--acc)'],
                                ].map(([l,v,c])=>(
                                  <div key={l} style={{padding:'4px 12px',borderRadius:dk?3:20,
                                    border:`1.5px solid ${c}44`,background:`${c}14`,
                                    fontFamily:"'DM Mono',monospace",fontSize:10,color:c,fontWeight:600}}>{l}: {v}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 3-system row */}
                        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}} className="g3">
                          {/* Chinese */}
                          <div className="panel" style={{padding:'18px 20px'}}>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--tx3)',marginBottom:10}}>Chinese Zodiac</div>
                            <div style={{fontSize:42,lineHeight:1,marginBottom:6}}>{chinese.emoji}</div>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:20,color:'var(--acc)',marginBottom:4}}>{chinese.animal}</div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx3)'}}>Year of the {chinese.animal}</div>
                          </div>
                          {/* Vedic */}
                          <div className="panel" style={{padding:'18px 20px'}}>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--tx3)',marginBottom:10}}>Vedic Rashi (Jyotish)</div>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:42,color:'var(--info)',lineHeight:1,marginBottom:6}}>{vRashi.sym}</div>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:20,color:'var(--info)',marginBottom:4}}>{vRashi.name}</div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx3)'}}>Sidereal system · ~23° offset</div>
                          </div>
                          {/* Numerology */}
                          <div className="panel" style={{padding:'18px 20px'}}>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--tx3)',marginBottom:10}}>Numerology</div>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:56,color:'var(--pur)',lineHeight:1,marginBottom:6}}>{lpNum}</div>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:14,color:'var(--pur)',marginBottom:4}}>Life Path #{lpNum}</div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx3)'}}>{LP_MEANINGS[lpNum]||'—'}</div>
                          </div>
                        </div>

                        {/* all 12 signs grid */}
                        <div className="panel" style={{padding:'16px 18px'}}>
                          <div className="lbl" style={{marginBottom:12}}>✦ All 12 Signs</div>
                          <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:8}} className="g3">
                            {ZODIAC.map(z=>(
                              <div key={z.sign} style={{padding:'10px 8px',borderRadius:dk?4:10,textAlign:'center',
                                border:dk?`1px solid ${z.sign===zodiac.sign?'rgba(245,158,11,.5)':'rgba(245,158,11,.08)'}`
                                         :`1.5px solid ${z.sign===zodiac.sign?'rgba(146,64,14,.5)':'rgba(146,64,14,.08)'}`,
                                background:z.sign===zodiac.sign?(dk?'rgba(245,158,11,.07)':'rgba(146,64,14,.06)'):'transparent',
                                transform:z.sign===zodiac.sign?'scale(1.06)':'scale(1)',transition:'transform .2s'}}>
                                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:20,color:z.sign===zodiac.sign?'var(--acc)':EL_COL[z.el],marginBottom:3}}>{z.sym}</div>
                                <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,color:'var(--tx2)',fontWeight:z.sign===zodiac.sign?700:400}}>{z.sign}</div>
                                <div style={{fontFamily:"'DM Mono',monospace",fontSize:7.5,color:EL_COL[z.el],marginTop:2}}>{z.el}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                  
                </motion.div>
              )}

              {/* ══════════ WORLD AGE TAB ══════════ */}
              {tab==='world'&&(
                <motion.div key="world" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="hint"><span>🌍</span><span>Your age changes by timezone! In cities east of your location, it may already be your next birthday. This updates live every second.</span></div>

                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div className="lbl" style={{marginBottom:10}}>Date of Birth</div>
                    <input className="inp" type="date" value={dob} max={new Date().toISOString().slice(0,10)} onChange={e=>setDob(e.target.value)} style={{maxWidth:220}}/>
                  </div>

                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}} className="g2">
                    {worldAges.map((c,i)=>(
                      <motion.div key={c.name} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*.05}}
                        className="panel" style={{padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <div>
                          <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:6}}>
                            <span style={{fontSize:18}}>{c.flag}</span>
                            <div>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,color:'var(--tx)'}}>{c.name}</div>
                              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)'}}>{c.localTime} local time</div>
                            </div>
                          </div>
                          {c.age&&(
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx2)'}}>
                              {c.age.y}y {c.age.mo}m {c.age.dy}d
                            </div>
                          )}
                        </div>
                        {c.age&&(
                          <div style={{textAlign:'right'}}>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:28,color:'var(--acc)'}}>{c.age.y}</div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,color:'var(--tx3)'}}>years old</div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ COMPARE TAB ══════════ */}
              {tab==='compare'&&(
                <motion.div key="cmp" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="hint"><span>⚖</span><span>Compare two people's ages — great for couples, siblings, or any two people.</span></div>

                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}} className="g2">
                    {[
                      [name1,setName1,dob,setDob],
                      [name2,setName2,dob2,setDob2],
                    ].map(([nm,setNm,d,setD],i)=>(
                      <div key={i} className="panel" style={{padding:'16px 18px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:12}}>
                          <div style={{width:8,height:8,borderRadius:'50%',background:i===0?'var(--acc)':'var(--info)'}}/>
                          <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.12em',textTransform:'uppercase',color:i===0?'var(--acc)':'var(--info)',fontWeight:700}}>Person {i+1}</div>
                        </div>
                        <div style={{marginBottom:10}}>
                          <div className="lbl">Name</div>
                          <input className="inp" type="text" value={nm} onChange={e=>setNm(e.target.value)} placeholder={`Person ${i+1}`}/>
                        </div>
                        <div>
                          <div className="lbl">Date of Birth</div>
                          <input className="inp" type="date" value={d} max={new Date().toISOString().slice(0,10)} onChange={e=>setD(e.target.value)}/>
                        </div>
                        {calcAge(d)&&(
                          <div style={{marginTop:12,padding:'10px 12px',borderRadius:dk?3:8,
                            background:dk?'rgba(245,158,11,.04)':'rgba(146,64,14,.04)',
                            border:dk?'1px solid rgba(245,158,11,.12)':'1.5px solid rgba(146,64,14,.12)'}}>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:24,color:i===0?'var(--acc)':'var(--info)'}}>
                              {calcAge(d).y}<span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--tx3)'}}> years</span>
                            </div>
                            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx2)'}}>{calcAge(d).mo}m {calcAge(d).dy}d · {calcAge(d).totalDays.toLocaleString()} days</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {age&&age2&&(()=>{
                    const diffDays = Math.abs(age.totalDays - age2.totalDays);
                    const older    = age.totalDays > age2.totalDays ? name1 : name2;
                    const younger  = age.totalDays > age2.totalDays ? name2 : name1;
                    const diffY    = Math.floor(diffDays/365);
                    const diffMo   = Math.floor((diffDays%365)/30);
                    const diffD    = diffDays%30;
                    const pct1     = age.totalDays / (age.totalDays + age2.totalDays) * 100;
                    const z1       = findZodiac(dob), z2 = findZodiac(dob2);
                    return (
                      <motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} style={{display:'flex',flexDirection:'column',gap:12}}>
                        {/* comparison bar */}
                        <div className="panel" style={{padding:'18px 22px'}}>
                          <div className="lbl" style={{marginBottom:14}}>⚖ Age Comparison</div>
                          <div style={{display:'flex',height:12,borderRadius:6,overflow:'hidden',gap:1}}>
                            <motion.div initial={{width:0}} animate={{width:`${pct1}%`}}
                              transition={{duration:1,ease:[.34,1.56,.64,1]}}
                              style={{background:'var(--acc)',height:'100%',borderRadius:'4px 0 0 4px'}}/>
                            <motion.div initial={{width:0}} animate={{width:`${100-pct1}%`}}
                              transition={{duration:1,ease:[.34,1.56,.64,1],delay:.1}}
                              style={{background:'var(--info)',height:'100%',borderRadius:'0 4px 4px 0'}}/>
                          </div>
                          <div style={{display:'flex',justifyContent:'space-between',marginTop:7,fontFamily:"'DM Mono',monospace",fontSize:9.5}}>
                            <span style={{color:'var(--acc)',fontWeight:600}}>{name1} — {age.y}y</span>
                            <span style={{color:'var(--info)',fontWeight:600}}>{name2} — {age2.y}y</span>
                          </div>
                        </div>

                        {/* diff stats */}
                        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}} className="g3">
                          <SC lbl="Age Difference" val={`${diffY}y ${diffMo}m`}         sub={`${diffDays.toLocaleString()} days`} col="var(--acc)"/>
                          <SC lbl="Older"          val={older}                           sub="by the above margin" col="var(--lo)"/>
                          <SC lbl="Younger"        val={younger}                         sub="born later"          col="var(--info)"/>
                        </div>

                        {/* zodiac compare */}
                        <div className="panel" style={{padding:'16px 18px'}}>
                          <div className="lbl" style={{marginBottom:12}}>✦ Zodiac Comparison</div>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                            {[[name1,z1,dob,chinese],[name2,z2,dob2,chineseZodiac(new Date(dob2).getFullYear())]].map(([nm,z,d,ch],i)=>(
                              <div key={nm} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',
                                borderRadius:dk?3:8,border:dk?`1px solid ${i===0?'rgba(245,158,11,.15)':'rgba(96,165,250,.15)'}`:`1.5px solid ${i===0?'rgba(146,64,14,.15)':'rgba(29,78,216,.15)'}`}}>
                                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:36,color:i===0?'var(--acc)':'var(--info)'}}>{z?.sym}</div>
                                <div>
                                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,fontWeight:700,color:'var(--tx)',marginBottom:2}}>{nm}</div>
                                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:i===0?'var(--acc)':'var(--info)'}}>{z?.sign} · {z?.el}</div>
                                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx3)'}}>Chinese: {ch?.emoji} {ch?.animal}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })()}

                  
                </motion.div>
              )}

              {/* ══════════ ON THIS DAY TAB ══════════ */}
              {tab==='onthisday'&&(
                <motion.div key="otd" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="hint"><span>📅</span><span>Famous people who share your birth month &amp; day.</span></div>

                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div className="lbl" style={{marginBottom:8}}>Your Date of Birth</div>
                    <input className="inp" type="date" value={dob} max={new Date().toISOString().slice(0,10)} onChange={e=>setDob(e.target.value)} style={{maxWidth:220}}/>
                  </div>

                  {dob&&(
                    <div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--tx3)',marginBottom:10}}>
                        Famous people born on {new Date(dob).toLocaleDateString('en-US',{month:'long',day:'numeric'})}
                      </div>
                      {sameDay.length === 0
                        ? <div className="panel" style={{padding:'32px',textAlign:'center',fontFamily:"'DM Mono',monospace",fontSize:12,color:'var(--tx3)'}}>
                            No famous people in our list share {new Date(dob).toLocaleDateString('en-US',{month:'long',day:'numeric'})} as their birthday. Try a different date!
                          </div>
                        : sameDay.map((p,i)=>(
                            <motion.div key={p.name} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*.06}}
                              className="panel" style={{padding:'14px 18px',marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                              <div>
                                <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:700,color:'var(--tx)',marginBottom:3}}>{p.name}</div>
                                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--acc)',padding:'2px 8px',borderRadius:dk?2:6,border:dk?'1px solid rgba(245,158,11,.2)':'1.5px solid rgba(146,64,14,.2)',background:dk?'rgba(245,158,11,.06)':'rgba(146,64,14,.05)'}}>{p.field}</span>
                                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx3)'}}>Born {p.year}</span>
                                </div>
                              </div>
                              <div style={{textAlign:'right'}}>
                                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:16,color:'var(--tx2)'}}>
                                  {new Date().getFullYear()-p.year}
                                </div>
                                <div style={{fontFamily:"'DM Mono',monospace",fontSize:8.5,color:'var(--tx3)'}}>years ago</div>
                              </div>
                            </motion.div>
                          ))
                      }
                    </div>
                  )}

                  {/* today's famous birthdays */}
                  <div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--tx3)',marginBottom:10}}>
                      Famous people born today ({new Date().toLocaleDateString('en-US',{month:'long',day:'numeric'})})
                    </div>
                    {(()=>{
                      const todayFamous = FAMOUS_BDAYS.filter(p=>p.mo===new Date().getMonth()+1&&p.d===new Date().getDate());
                      return todayFamous.length===0
                        ? <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:'var(--tx3)',padding:'12px 0'}}>No entries in our list for today's date.</div>
                        : todayFamous.map(p=>(
                            <div key={p.name} className="panel" style={{padding:'12px 16px',marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                              <div>
                                <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,color:'var(--tx)',marginBottom:2}}>{p.name}</div>
                                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx3)'}}>{p.field} · {p.year}</div>
                              </div>
                              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:18,color:'var(--lo)'}}>{new Date().getFullYear()-p.year}y</div>
                            </div>
                          ));
                    })()}
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ LEARN TAB ══════════ */}
              {tab==='learn'&&(
                <motion.div key="learn" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}}>
                  <div className="panel" style={{padding:'26px 30px',marginBottom:14}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:26,color:'var(--tx)',letterSpacing:'-.01em',marginBottom:4}}>Age, Calendars & Time</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--tx3)',marginBottom:26,letterSpacing:'.1em'}}>CALENDARS · LEAP YEARS · AGE SYSTEMS · ZODIAC · FAQ</div>
                    <div className="prose">
                      <p>Age calculation is deceptively complex. Correctly handling months of varying lengths, leap years, timezone differences, and different cultural age-counting systems requires careful logic beyond simple subtraction.</p>
                      <h3>Leap Year Birthdays (Feb 29)</h3>
                      <p>People born on February 29 exist in a fascinating calendar paradox — their exact birthday recurs only every 4 years (or not at all in century years not divisible by 400). Most legal systems globally treat <strong>March 1</strong> as the legal birthday in non-leap years, though some use February 28. This calculator identifies the actual day and computes exact age accordingly.</p>
                      <h3>Age Systems Around the World</h3>
                      <p>The <strong>Western system</strong> (most common) counts you as 0 at birth, turning 1 on your first birthday. The traditional <strong>Korean system</strong> (세는나이) counted everyone as 1 at birth, adding 1 each New Year's Day — a child born December 31 would be 2 years old two days later. South Korea officially retired the traditional system in June 2023. <strong>East Asian systems</strong> (Japanese/Chinese traditional) also used similar logic. The <strong>Vietnamese tuổi</strong> system is similar to Korean.</p>
                      <h3>Western vs Vedic Zodiac</h3>
                      <p>Western astrology uses the <strong>tropical zodiac</strong>, fixed to the vernal equinox. Vedic (Jyotish) astrology uses the <strong>sidereal zodiac</strong>, aligned with actual constellation positions. Due to Earth's axial precession (the "wobble"), the two systems have drifted approximately 23–24 degrees apart over 2,000 years — which is why your Vedic rashi often differs from your Western sun sign.</p>
                      {[
                        {q:'Why does my age differ in different timezones?',a:'Your birthday is defined as a specific calendar date, but the moment "today" changes at different clock times in different timezones. If it is already your birthday in Tokyo but not yet in New York, you are technically one year older in Tokyo. This effect lasts 26 hours (the time for the date to change around the entire globe).'},
                        {q:'How is the life path number calculated?',a:'Add all digits of your full birth date (DDMMYYYY) together. If the result is more than one digit, add those digits together again. Repeat until you reach a single digit, unless you land on 11, 22, or 33 (master numbers). For example: 15/06/1995 → 1+5+0+6+1+9+9+5=36 → 3+6=9.'},
                        {q:'What is the 1 billion seconds milestone?',a:'1 billion seconds is exactly 31 years, 251 days, 13 hours, 34 minutes and 54 seconds. This fascinating milestone occurs at around age 31.7 and is celebrated by maths and science enthusiasts. Compare this to 1 million hours, which occurs at approximately age 114 — beyond the current verified human lifespan record.'},
                        {q:'How are business days calculated?',a:'This calculator counts all weekdays (Monday through Friday) between two dates, excluding Saturdays and Sundays. Public holidays are not excluded, as these vary by country and region. If you need to account for holidays, subtract them manually.'},
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