import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   DATE DIFFERENCE CALCULATOR — Document Tools Series #10
   Theme: Dark Void/Neon Teal · Light Cream/Forest
   Fonts: Fraunces · Outfit · Fira Code
   Tabs: Calculate · Timeline · Guide
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Outfit',sans-serif}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(20,255,180,.2)}50%{box-shadow:0 0 0 10px rgba(20,255,180,0)}}
@keyframes pop{0%{transform:scale(.85);opacity:0}65%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
@keyframes slide-up{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}
@keyframes tick{0%{transform:scaleY(1)}40%{transform:scaleY(.88)}100%{transform:scaleY(1)}}

.dk{--bg:#060a09;--s1:#0a0f0d;--s2:#0f1612;--s3:#141d18;--bdr:#1a2820;--acc:#14ffb4;--acc2:#00e5a0;--acc4:#a78bfa;--err:#ff6b6b;--warn:#fbbf24;--tx:#e8fff8;--tx2:#8ecfb8;--tx3:#1a3d2c;--txm:#3d7a62;min-height:100vh;background:var(--bg);color:var(--tx);background-image:radial-gradient(ellipse 80% 40% at 50% -10%,rgba(20,255,180,.05),transparent),radial-gradient(ellipse 40% 60% at 95% 80%,rgba(167,139,250,.06),transparent);}
.lt{--bg:#f5fbf8;--s1:#ffffff;--s2:#ecf7f1;--s3:#dff0e8;--bdr:#b8ddc8;--acc:#0d3320;--acc2:#1a5c38;--acc4:#5b21b6;--err:#991b1b;--warn:#92400e;--tx:#071810;--tx2:#1a5c38;--tx3:#a7d4bc;--txm:#2d6e4a;min-height:100vh;background:var(--bg);color:var(--tx);}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(6,10,9,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(245,251,248,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(13,51,32,.07);}
.scanline{position:fixed;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(20,255,180,.3),transparent);animation:scan 4s linear infinite;pointer-events:none;z-index:999;}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 16px;border:none;cursor:pointer;background:transparent;border-bottom:2.5px solid transparent;font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;letter-spacing:.04em;display:flex;align-items:center;gap:6px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--tx3);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(20,255,180,.04);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#94a3b8;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(13,51,32,.05);font-weight:600;}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns:200px 1fr;min-height:calc(100vh - 86px);}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:18px 24px;display:flex;flex-direction:column;gap:16px;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(13,51,32,.06);}

.fi{width:100%;outline:none;font-family:'Outfit',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;cursor:pointer;}
.dk .fi{background:rgba(0,0,0,.4);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(20,255,180,.1);}
.lt .fi{background:#f5fbf8;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);}

.date-input{font-family:'Fira Code',monospace;font-size:14px;padding:10px 14px;outline:none;width:100%;transition:all .15s;cursor:pointer;}
.dk .date-input{background:rgba(0,0,0,.5);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .date-input:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(20,255,180,.08);}
.lt .date-input{background:#f5fbf8;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .date-input:focus{border-color:var(--acc);}
.date-input::-webkit-calendar-picker-indicator{filter:invert(.5) sepia(1) hue-rotate(100deg);cursor:pointer;}

.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;font-family:'Fira Code',monospace;font-size:10px;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(20,255,180,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(13,51,32,.05);}

.lbl{font-family:'Outfit',sans-serif;font-size:9px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(20,255,180,.4);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;display:block;}
.dk .slbl{color:rgba(20,255,180,.3);}
.lt .slbl{color:var(--acc);}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(20,255,180,.01);border:1px dashed rgba(20,255,180,.08);border-radius:3px;}
.lt .ad{background:rgba(13,51,32,.02);border:1.5px dashed rgba(13,51,32,.1);border-radius:9px;}
.ad span{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

/* Big number display */
.big-num{font-family:'Fraunces',serif;font-weight:700;line-height:1;animation:pop .4s cubic-bezier(.34,1.56,.64,1);}

/* Stat tile */
.stat-tile{padding:14px 12px;text-align:center;flex:1;}
.dk .stat-tile{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.3);}
.lt .stat-tile{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.9);}

/* Timeline bar */
.tl-bar{height:8px;border-radius:4px;position:relative;overflow:hidden;}
.dk .tl-bar{background:rgba(20,255,180,.08);}
.lt .tl-bar{background:rgba(13,51,32,.08);}
.tl-fill{height:100%;border-radius:4px;transition:width .6s cubic-bezier(.34,1.2,.64,1);}

/* Copy btn */
.copy-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;cursor:pointer;border:none;font-family:'Fira Code',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;transition:all .15s;}
.dk .copy-btn{border:1px solid rgba(20,255,180,.25);border-radius:3px;background:rgba(20,255,180,.06);color:var(--acc);}
.lt .copy-btn{border:1.5px solid rgba(13,51,32,.25);border-radius:7px;background:rgba(13,51,32,.05);color:var(--acc);}
.dk .copy-btn:hover{border-color:var(--acc);background:rgba(20,255,180,.12);}
.lt .copy-btn:hover{border-color:var(--acc);background:rgba(13,51,32,.1);}

.faq{padding:13px 15px;margin-bottom:8px;}
.dk .faq{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.25);}
.lt .faq{border:1.5px solid var(--bdr);border-radius:10px;}

/* Quick preset pill */
.preset-pill{padding:4px 8px;cursor:pointer;font-family:'Fira Code',monospace;font-size:9px;background:transparent;border:none;transition:all .12s;white-space:nowrap;}
.dk .preset-pill{border:1px solid rgba(20,255,180,.15);border-radius:2px;color:var(--txm);}
.lt .preset-pill{border:1.5px solid var(--bdr);border-radius:5px;color:var(--txm);}
.dk .preset-pill:hover{border-color:var(--acc);color:var(--acc);}
.lt .preset-pill:hover{border-color:var(--acc);color:var(--acc);}
`;

const today = () => new Date().toISOString().split('T')[0];
const thisYear = new Date().getFullYear();

const QUICK_PRESETS = [
  {label:'Today',        d:()=>today()},
  {label:'Jan 1',        d:()=>`${thisYear}-01-01`},
  {label:'Dec 31',       d:()=>`${thisYear}-12-31`},
  {label:'My birthday',  d:()=>`${thisYear}-06-15`},
];

const FAMOUS_SPANS = [
  {label:'Moon landing',  d1:'1969-07-20', d2:today(), desc:'Days since Apollo 11'},
  {label:'WWW invented',  d1:'1991-08-06', d2:today(), desc:'Days since the public web'},
  {label:'iPhone launch', d1:'2007-01-09', d2:today(), desc:'Days since first iPhone'},
  {label:'New Millennium', d1:'2000-01-01', d2:today(), desc:'Days since year 2000'},
];

const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function parseDate(s) {
  if(!s) return null;
  const d = new Date(s + 'T00:00:00');
  return isNaN(d) ? null : d;
}

function countBusinessDays(start, end) {
  let count = 0;
  const cur = new Date(start);
  while(cur <= end){ const d=cur.getDay(); if(d!==0&&d!==6) count++; cur.setDate(cur.getDate()+1); }
  return count;
}

function calcDiff(d1str, d2str, includeEnd) {
  const d1 = parseDate(d1str), d2 = parseDate(d2str);
  if(!d1||!d2) return null;

  const [start, end] = d1<=d2 ? [d1,d2] : [d2,d1];
  const isNeg = d1 > d2;

  // ymd breakdown
  let y = end.getFullYear() - start.getFullYear();
  let m = end.getMonth()    - start.getMonth();
  let dd= end.getDate()     - start.getDate();
  if(dd<0){ m--; dd += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); }
  if(m<0){ y--; m+=12; }

  const ms = end - start;
  let totalDays = Math.floor(ms / 86400000) + (includeEnd?1:0);
  const totalWeeks = totalDays / 7;
  const totalHours = totalDays * 24;
  const totalMins  = totalHours * 60;
  const totalSecs  = totalMins * 60;
  const biz = countBusinessDays(start, end);
  const weekends = totalDays - biz;

  // progress through year
  const yearStart = new Date(start.getFullYear(), 0, 1);
  const yearEnd   = new Date(start.getFullYear(), 11, 31);
  const yearProgress = (start - yearStart) / (yearEnd - yearStart);

  return {
    y, m, dd, totalDays, totalWeeks, totalHours, totalMins, totalSecs,
    biz, weekends, isNeg, start, end,
    startDay: WEEKDAYS[start.getDay()],
    endDay:   WEEKDAYS[end.getDay()],
    startMonth: MONTHS[start.getMonth()],
    endMonth:   MONTHS[end.getMonth()],
    yearProgress,
  };
}

const TABS = [
  {id:'calc',     label:'📅 Calculate'},
  {id:'timeline', label:'📏 Timeline'},
  {id:'guide',    label:'? Guide'},
];

/* ════════════════════════════════════════════════════════════ */
export default function DateDifference({isDarkMode:ext}={}) {
  const [dark, setDark] = useState(ext!==undefined?ext:true);
  const cls = dark?'dk':'lt';
  const [tab, setTab] = useState('calc');

  const [date1,      setDate1]      = useState(today());
  const [date2,      setDate2]      = useState('');
  const [includeEnd, setIncludeEnd] = useState(false);
  const [copied,     setCopied]     = useState(false);

  const res = useMemo(()=>calcDiff(date1, date2, includeEnd), [date1, date2, includeEnd]);

  const handleSwap = () => { const t=date1; setDate1(date2); setDate2(t); };

  const handleCopy = () => {
    if(!res) return;
    const txt = `Date difference: ${res.y>0?res.y+' years, ':''}${res.m>0?res.m+' months, ':''}${res.dd} days (${res.totalDays.toLocaleString()} total days, ${res.biz} business days)`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  };

  const fmtDate = (d) => d ? d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}) : '';

  /* stat tile helper */
  const StatTile = ({val, label, color, sub}) => (
    <div className="stat-tile">
      <div className="big-num" style={{fontSize:30,color:color||'var(--acc)'}}>{val}</div>
      <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--txm)',marginTop:4}}>{label}</div>
      {sub&&<div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:'var(--tx3)',marginTop:2}}>{sub}</div>}
    </div>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>
        {dark&&<div className="scanline"/>}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:32,height:32,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:17,borderRadius:dark?3:9,
              border:dark?'1px solid rgba(20,255,180,.35)':'none',
              background:dark?'rgba(20,255,180,.07)':'linear-gradient(135deg,#0d3320,#1a5c38)',
              boxShadow:dark?'0 0 16px rgba(20,255,180,.2)':'0 3px 10px rgba(13,51,32,.35)'}}>📅</div>
            <div>
              <div style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:16,color:'var(--tx)',lineHeight:1}}>
                Date<span style={{color:'var(--acc)'}}>Diff</span>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--tx3)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #10 · days · weeks · business days · timeline
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          {res&&(
            <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
              style={{display:'flex',alignItems:'center',gap:8,padding:'4px 12px',
                border:dark?'1px solid rgba(20,255,180,.2)':'1.5px solid var(--bdr)',
                borderRadius:dark?3:7,background:dark?'rgba(20,255,180,.05)':'rgba(13,51,32,.04)'}}>
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)'}}>DAYS</span>
              <span style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--acc)',lineHeight:1}}>
                {res.totalDays.toLocaleString()}
              </span>
            </motion.div>
          )}
          <button onClick={()=>setDark(d=>!d)} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(20,255,180,.18)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer'}}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#b8ddc8',boxShadow:dark?'0 0 8px rgba(20,255,180,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#060a09':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)'}}>{dark?'VOID':'LIGHT'}</span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
          {TABS.map(t=>(
            <button key={t.id} className={`tab${tab===t.id?' on':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        <div className="body">
          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* Quick presets for date1 */}
            <div>
              <div className="slbl">Start quick-set</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                {QUICK_PRESETS.map(p=>(
                  <button key={p.label} className="preset-pill" onClick={()=>setDate1(p.d())}>{p.label}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="slbl">End quick-set</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                {QUICK_PRESETS.map(p=>(
                  <button key={p.label} className="preset-pill" onClick={()=>setDate2(p.d())}>{p.label}</button>
                ))}
              </div>
            </div>

            {/* Famous spans */}
            <div>
              <div className="slbl">Famous spans</div>
              {FAMOUS_SPANS.map(s=>{
                const d=calcDiff(s.d1,s.d2,false);
                return (
                  <div key={s.label} onClick={()=>{setDate1(s.d1);setDate2(s.d2);}}
                    style={{padding:'7px 10px',cursor:'pointer',borderRadius:dark?3:7,marginBottom:4,transition:'all .13s',
                      border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                      background:'transparent'}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='var(--acc)'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=dark?'var(--bdr)':'var(--bdr)'}>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:600,color:'var(--tx)'}}>{s.label}</div>
                    {d&&<div style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--acc)',marginTop:1}}>{d.totalDays.toLocaleString()} days</div>}
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:'var(--txm)',marginTop:1}}>{s.desc}</div>
                  </div>
                );
              })}
            </div>

            
          </div>

          {/* MAIN */}
          <div className="main">
            

            <AnimatePresence mode="wait">

              {/* ═══ CALCULATE ═══ */}
              {tab==='calc'&&(
                <motion.div key="calc" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>

                  {/* Date inputs */}
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:18}}>
                      <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:16,border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',
                        background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)'}}>📅</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>Select dates</div>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:10,alignItems:'end'}}>
                      {/* Date 1 */}
                      <div>
                        <label className="lbl">Start date</label>
                        <input type="date" className="date-input" value={date1} onChange={e=>setDate1(e.target.value)}/>
                        {date1&&<div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'var(--txm)',marginTop:4}}>
                          {WEEKDAYS[parseDate(date1)?.getDay()]||''}
                        </div>}
                      </div>

                      {/* Swap */}
                      <div style={{paddingBottom:6}}>
                        <button className="gbtn" onClick={handleSwap}
                          style={{padding:'8px 10px',fontSize:14,justifyContent:'center'}}
                          title="Swap dates">⇄</button>
                      </div>

                      {/* Date 2 */}
                      <div>
                        <label className="lbl">End date</label>
                        <input type="date" className="date-input" value={date2} onChange={e=>setDate2(e.target.value)}/>
                        {date2&&<div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'var(--txm)',marginTop:4}}>
                          {WEEKDAYS[parseDate(date2)?.getDay()]||''}
                        </div>}
                      </div>
                    </div>

                    {/* Options */}
                    <div style={{display:'flex',alignItems:'center',gap:10,marginTop:14,padding:'9px 12px',borderRadius:dark?3:8,
                      border:dark?'1px solid rgba(20,255,180,.08)':'1.5px solid var(--bdr)',
                      background:dark?'rgba(20,255,180,.02)':'rgba(13,51,32,.02)'}}>
                      <input type="checkbox" id="incl" checked={includeEnd} onChange={e=>setIncludeEnd(e.target.checked)}
                        style={{accentColor:dark?'#14ffb4':'#0d3320',width:14,height:14,cursor:'pointer'}}/>
                      <label htmlFor="incl" style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:'var(--tx2)',cursor:'pointer'}}>
                        Include end day in total count
                      </label>
                    </div>
                  </div>

                  {/* Results */}
                  <AnimatePresence mode="wait">
                    {res?(
                      <motion.div key="res" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                        style={{display:'flex',flexDirection:'column',gap:12}}>

                        {res.isNeg&&(
                          <div style={{padding:'8px 14px',borderRadius:dark?3:8,
                            border:dark?'1px solid rgba(255,107,107,.3)':'1.5px solid rgba(153,27,27,.25)',
                            background:dark?'rgba(255,107,107,.07)':'rgba(153,27,27,.04)',
                            fontFamily:"'Outfit',sans-serif",fontSize:12,color:'var(--err)'}}>
                            ⚠ End date is before start date — showing absolute difference
                          </div>
                        )}

                        {/* Hero number */}
                        <div className="panel" style={{padding:'24px 20px',textAlign:'center'}}>
                          <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,letterSpacing:'.25em',textTransform:'uppercase',color:'var(--txm)',marginBottom:8}}>total days apart</div>
                          <AnimatePresence mode="wait">
                            <motion.div key={res.totalDays} initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
                              style={{fontFamily:"'Fraunces',serif",fontSize:64,fontWeight:700,color:'var(--acc)',lineHeight:1,marginBottom:6}}>
                              {res.totalDays.toLocaleString()}
                            </motion.div>
                          </AnimatePresence>
                          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:17,fontWeight:600,color:'var(--tx2)',marginBottom:16}}>
                            {res.y>0&&<><span style={{color:'var(--tx)'}}>{res.y}</span><span style={{color:'var(--txm)'}}> yr </span></>}
                            {res.m>0&&<><span style={{color:'var(--tx)'}}>{res.m}</span><span style={{color:'var(--txm)'}}> mo </span></>}
                            <span style={{color:'var(--tx)'}}>{res.dd}</span><span style={{color:'var(--txm)'}}> day{res.dd!==1?'s':''}</span>
                          </div>

                          {/* from / to row */}
                          <div style={{display:'inline-flex',alignItems:'center',gap:10,padding:'9px 18px',borderRadius:dark?3:10,
                            border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                            background:dark?'rgba(0,0,0,.4)':'rgba(245,251,248,.9)',marginBottom:16}}>
                            <div style={{textAlign:'left'}}>
                              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',textTransform:'uppercase',letterSpacing:'.15em'}}>from</div>
                              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:600,color:'var(--tx)'}}>{res.startDay}</div>
                              <div style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--acc)'}}>{fmtDate(res.start)}</div>
                            </div>
                            <div style={{fontFamily:"'Fira Code',monospace",fontSize:18,color:'var(--txm)'}}>→</div>
                            <div style={{textAlign:'left'}}>
                              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',textTransform:'uppercase',letterSpacing:'.15em'}}>to</div>
                              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:600,color:'var(--tx)'}}>{res.endDay}</div>
                              <div style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--acc)'}}>{fmtDate(res.end)}</div>
                            </div>
                          </div>

                          <div style={{display:'flex',justifyContent:'center'}}>
                            <button className="copy-btn" onClick={handleCopy}>
                              {copied?'✓ copied!':'⎘ copy result'}
                            </button>
                          </div>
                        </div>

                        {/* Stat grid */}
                        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                          <StatTile val={res.totalWeeks.toFixed(1)}   label="Weeks"         color="var(--acc)"/>
                          <StatTile val={res.biz.toLocaleString()}     label="Business days" color="var(--acc4)"/>
                          <StatTile val={res.weekends.toLocaleString()}label="Weekend days"  color="var(--txm)"/>
                          <StatTile val={(res.totalHours/1000).toFixed(1)+'k'} label="Hours" color="var(--tx2)"/>
                          <StatTile val={(res.totalMins/1000/1000).toFixed(2)+'M'} label="Minutes" color="var(--tx3)"/>
                        </div>

                        {/* Business day proportion bar */}
                        <div className="panel" style={{padding:'16px 18px'}}>
                          <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>
                            Working vs weekend breakdown
                          </div>
                          <div style={{display:'flex',height:16,borderRadius:4,overflow:'hidden',marginBottom:8}}>
                            <div style={{flex:res.biz,background:'var(--acc)',transition:'flex .6s'}}/>
                            <div style={{flex:res.weekends,background:dark?'rgba(20,255,180,.12)':'rgba(13,51,32,.1)',transition:'flex .6s'}}/>
                          </div>
                          <div style={{display:'flex',justifyContent:'space-between'}}>
                            <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--acc)'}}>
                              {res.biz} working ({Math.round(res.biz/res.totalDays*100)}%)
                            </span>
                            <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--txm)'}}>
                              {res.weekends} weekend ({Math.round(res.weekends/res.totalDays*100)}%)
                            </span>
                          </div>
                        </div>

                        {/* Full breakdown table */}
                        <div className="panel" style={{padding:'16px 18px'}}>
                          <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>
                            Full breakdown
                          </div>
                          {[
                            ['Total days',    res.totalDays.toLocaleString(),        'var(--acc)'],
                            ['Total weeks',   res.totalWeeks.toFixed(4),             'var(--acc)'],
                            ['Total hours',   res.totalHours.toLocaleString(),       'var(--tx2)'],
                            ['Total minutes', res.totalMins.toLocaleString(),        'var(--tx2)'],
                            ['Total seconds', res.totalSecs.toLocaleString(),        'var(--txm)'],
                            ['Business days', res.biz.toLocaleString(),             'var(--acc4)'],
                            ['Weekend days',  res.weekends.toLocaleString(),         'var(--txm)'],
                          ].map(([l,v,c])=>(
                            <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',
                              borderBottom:dark?'1px solid rgba(20,255,180,.05)':'1px solid var(--bdr)'}}>
                              <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:'var(--tx2)'}}>{l}</span>
                              <span style={{fontFamily:"'Fira Code',monospace",fontSize:12,color:c}}>{v}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ):(
                      <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}}
                        className="panel" style={{padding:'60px 20px',textAlign:'center'}}>
                        <div style={{fontSize:36,marginBottom:12,opacity:.4}}>📅</div>
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)',marginBottom:6}}>
                          Select an end date to begin
                        </div>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--txm)'}}>
                          Start date is set to today — pick any end date above
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* ═══ TIMELINE ═══ */}
              {tab==='timeline'&&(
                <motion.div key="tl" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>

                  {/* Relative to today */}
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)',marginBottom:16}}>
                      Days from today
                    </div>
                    {(()=>{
                      const now = Date.now();
                      const timelineItems = [
                        {label:'Yesterday',    d:new Date(now-86400000)},
                        {label:'Last week',    d:new Date(now-7*86400000)},
                        {label:'Last month',   d:new Date(now-30*86400000)},
                        {label:'Last year',    d:new Date(now-365*86400000)},
                        {label:'Tomorrow',     d:new Date(now+86400000)},
                        {label:'Next week',    d:new Date(now+7*86400000)},
                        {label:'Next month',   d:new Date(now+30*86400000)},
                        {label:'Next year',    d:new Date(now+365*86400000)},
                      ];
                      return timelineItems.map(({label,d})=>{
                        const dStr=d.toISOString().split('T')[0];
                        const diff=calcDiff(today(),dStr,false);
                        const isPast=d<new Date();
                        return (
                          <div key={label} onClick={()=>{setDate2(dStr);setTab('calc');}}
                            style={{display:'flex',alignItems:'center',gap:12,padding:'9px 12px',marginBottom:4,cursor:'pointer',
                              borderRadius:dark?3:9,transition:'all .13s',
                              border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                              background:'transparent'}}
                            onMouseEnter={e=>e.currentTarget.style.borderColor='var(--acc)'}
                            onMouseLeave={e=>e.currentTarget.style.borderColor=dark?'var(--bdr)':'var(--bdr)'}>
                            <div style={{width:70}}>
                              <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,padding:'2px 6px',borderRadius:2,
                                border:dark?`1px solid ${isPast?'rgba(255,107,107,.3)':'rgba(20,255,180,.3)'}`:`1.5px solid ${isPast?'rgba(153,27,27,.25)':'rgba(13,51,32,.25)'}`,
                                background:isPast?(dark?'rgba(255,107,107,.08)':'rgba(153,27,27,.05)'):(dark?'rgba(20,255,180,.08)':'rgba(13,51,32,.05)'),
                                color:isPast?'var(--err)':'var(--acc)'}}>
                                {isPast?'past':'future'}
                              </span>
                            </div>
                            <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,color:'var(--tx)',flex:1}}>{label}</span>
                            <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--acc)'}}>{diff?.totalDays} days</span>
                            <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--txm)'}}>{fmtDate(d)}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* This year progress */}
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)',marginBottom:14}}>
                      {thisYear} — year progress
                    </div>
                    {(()=>{
                      const now=new Date();
                      const jan1=new Date(thisYear,0,1);
                      const dec31=new Date(thisYear,11,31);
                      const pct=Math.round((now-jan1)/(dec31-jan1)*100);
                      const daysGone=Math.floor((now-jan1)/86400000);
                      const daysLeft=365-daysGone;
                      return (
                        <>
                          <div style={{marginBottom:10}}>
                            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                              <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--acc)'}}>Jan 1</span>
                              <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,fontWeight:600,color:'var(--acc)'}}>{pct}% complete</span>
                              <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--txm)'}}>Dec 31</span>
                            </div>
                            <div className="tl-bar">
                              <div className="tl-fill" style={{width:`${pct}%`,background:'var(--acc)'}}/>
                            </div>
                          </div>
                          <div style={{display:'flex',gap:8}}>
                            <div className="stat-tile">
                              <div style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,color:'var(--acc)',lineHeight:1}}>{daysGone}</div>
                              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',marginTop:3,letterSpacing:'.15em',textTransform:'uppercase'}}>days elapsed</div>
                            </div>
                            <div className="stat-tile">
                              <div style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,color:'var(--tx2)',lineHeight:1}}>{daysLeft}</div>
                              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',marginTop:3,letterSpacing:'.15em',textTransform:'uppercase'}}>days remaining</div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Age calculator */}
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)',marginBottom:14}}>
                      Age calculator
                    </div>
                    <div style={{marginBottom:12}}>
                      <label className="lbl">Date of birth</label>
                      <input type="date" className="date-input" value={date1} onChange={e=>setDate1(e.target.value)}
                        max={today()} style={{maxWidth:220}}/>
                    </div>
                    {(()=>{
                      const d=calcDiff(date1,today(),false);
                      if(!d||!date1) return <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:'var(--txm)'}}>Set a birth date above</div>;
                      return (
                        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                          <div className="stat-tile">
                            <div style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:700,color:'var(--acc)',lineHeight:1}}>{d.y}</div>
                            <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',marginTop:3,textTransform:'uppercase',letterSpacing:'.15em'}}>years old</div>
                          </div>
                          <div className="stat-tile">
                            <div style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:700,color:'var(--tx2)',lineHeight:1}}>{d.totalDays.toLocaleString()}</div>
                            <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',marginTop:3,textTransform:'uppercase',letterSpacing:'.15em'}}>days lived</div>
                          </div>
                          <div className="stat-tile">
                            <div style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:700,color:'var(--acc4)',lineHeight:1}}>{(d.totalDays/7).toFixed(0)}</div>
                            <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',marginTop:3,textTransform:'uppercase',letterSpacing:'.15em'}}>weeks lived</div>
                          </div>
                          <div className="stat-tile">
                            <div style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:700,color:'var(--txm)',lineHeight:1}}>{d.totalHours.toLocaleString()}</div>
                            <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',marginTop:3,textTransform:'uppercase',letterSpacing:'.15em'}}>hours lived</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </motion.div>
              )}

              {/* ═══ GUIDE ═══ */}
              {tab==='guide'&&(
                <motion.div key="guide" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'22px 24px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
                      <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.04)'}}>📖</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--tx)'}}>How date differences are calculated</div>
                    </div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13.5,lineHeight:1.8,color:'var(--tx2)'}}>
                      <p style={{marginBottom:10}}>Date arithmetic is surprisingly tricky. A naive approach of subtracting timestamps gives the correct number of total days, but expressing that as "years, months, days" requires careful handling of variable-length months and leap years.</p>
                      <p>This calculator uses two methods in parallel: a full millisecond-based subtraction for total days (exact), and a calendar-aware decomposition for the years/months/days breakdown. The "include end day" option is useful for counting durations like event lengths, where both the first and last day should count.</p>
                    </div>
                  </div>
                  <div className="panel" style={{padding:'18px 20px'}}>
                    {[
                      ['What are business days?','Business days are Monday–Friday, excluding weekends. This calculator counts them by iterating each day in the range — it does not account for public holidays, which vary by country and region.'],
                      ['Why does "include end day" exist?','By default, the difference between Jan 1 and Jan 3 is 2 days (the gap). With "include end day" it becomes 3 days — you are counting both endpoints. This is the right mode for event durations (a conference "from Monday to Wednesday" is 3 days long, not 2).'],
                      ['How is the years/months/days breakdown calculated?','The breakdown works backward from the end date: subtract years until the remaining gap is less than a year, then months, then days. Variable month lengths (28–31 days) are handled by borrowing from the previous month when needed.'],
                      ['What is the Age Calculator useful for?','Beyond curiosity, age in days is used in medicine (neonatal ages are always in days), astronomy (Mars year comparisons), and competitive sports. You can also calculate the exact number of hours or weeks you have been alive.'],
                    ].map(([q,a])=>(
                      <div key={q} className="faq">
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:13.5,fontWeight:600,color:'var(--tx)',marginBottom:5}}>{q}</div>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.75}}>{a}</div>
                      </div>
                    ))}
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