import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   STUDENT LOAN CALCULATOR  — Document Tools Series #5
   Theme: Dark Void/Neon Teal · Light Cream/Forest
   Fonts: Fraunces · Outfit · Fira Code
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Outfit',sans-serif}

@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(20,255,180,.2)}50%{box-shadow:0 0 0 8px rgba(20,255,180,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
@keyframes fadeup{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@keyframes bar-grow{from{width:0}to{width:var(--w)}}

.dk{
  --bg:#060a09;--s1:#0a0f0d;--s2:#0f1612;--s3:#141d18;
  --bdr:#1a2820;
  --acc:#14ffb4;--acc2:#00e5a0;--acc4:#a78bfa;
  --warn:#fbbf24;--err:#ff6b6b;
  --tx:#e8fff8;--tx2:#8ecfb8;--tx3:#1a3d2c;--txm:#3d7a62;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 80% 40% at 50% -10%,rgba(20,255,180,.05),transparent),
    radial-gradient(ellipse 40% 60% at 95% 80%,rgba(167,139,250,.04),transparent),
    radial-gradient(ellipse 30% 40% at 5% 60%,rgba(0,229,160,.03),transparent);
}
.lt{
  --bg:#f5fbf8;--s1:#ffffff;--s2:#ecf7f1;--s3:#dff0e8;
  --bdr:#b8ddc8;
  --acc:#0d3320;--acc2:#1a5c38;--acc4:#5b21b6;
  --warn:#92400e;--err:#991b1b;
  --tx:#071810;--tx2:#1a5c38;--tx3:#a7d4bc;--txm:#2d6e4a;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(13,51,32,.05),transparent);
}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(6,10,9,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(245,251,248,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(13,51,32,.07);}
.scanline{position:fixed;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(20,255,180,.3),transparent);animation:scan 4s linear infinite;pointer-events:none;z-index:999;}

.body{display:grid;grid-template-columns: 1fr;min-height:calc(100vh - 46px);}
@media(min-width:1024px){.body{grid-template-columns: 220px 1fr !important;}}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:18px 22px;display:flex;flex-direction:column;gap:16px;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(13,51,32,.06);}

/* inputs */
.fi{width:100%;outline:none;font-family:'Outfit',sans-serif;font-size:14px;padding:9px 12px;transition:all .13s;}
.dk .fi{background:rgba(0,0,0,.4);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(20,255,180,.1);}
.lt .fi{background:#f5fbf8;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(13,51,32,.09);}
.fi::placeholder{opacity:.3;}

/* range slider */
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;}
.dk input[type=range]{background:rgba(20,255,180,.12);}
.lt input[type=range]{background:rgba(13,51,32,.12);}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;border-radius:50%;cursor:pointer;transition:transform .15s;}
.dk input[type=range]::-webkit-slider-thumb{background:var(--acc);box-shadow:0 0 8px rgba(20,255,180,.5);}
.dk input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.2);}
.lt input[type=range]::-webkit-slider-thumb{background:var(--acc);}
.lt input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.2);}

/* result card */
.result-card{padding:20px 22px;}
.dk .result-card{border:1px solid rgba(20,255,180,.22);border-radius:4px;background:rgba(20,255,180,.04);}
.lt .result-card{border:1.5px solid rgba(13,51,32,.18);border-radius:12px;background:rgba(13,51,32,.03);}

/* stat box */
.sb{padding:13px 15px;flex:1;text-align:center;}
.dk .sb{border:1px solid var(--bdr);border-radius:3px;background:rgba(0,0,0,.3);}
.lt .sb{border:1.5px solid var(--bdr);border-radius:9px;background:rgba(245,251,248,.9);}

/* step card */
.step-card{display:flex;gap:13px;padding:14px 16px;margin-bottom:9px;}
.dk .step-card{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.22);}
.dk .step-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--acc);border-radius:2px 0 0 2px;opacity:.4;}
.lt .step-card{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.7);}
.step-card{position:relative;}
.step-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'Fira Code',monospace;font-size:11px;font-weight:500;flex-shrink:0;margin-top:1px;}
.dk .step-num{border:1px solid rgba(20,255,180,.3);background:rgba(20,255,180,.06);color:var(--acc);}
.lt .step-num{border:1.5px solid rgba(13,51,32,.3);background:rgba(13,51,32,.06);color:var(--acc);}

/* formula box */
.formula{font-family:'Fira Code',monospace;font-size:12.5px;padding:9px 13px;border-radius:3px;margin-top:8px;line-height:1.7;overflow-x:auto;}
.dk .formula{background:rgba(0,0,0,.5);border:1px solid rgba(20,255,180,.1);color:#7dffce;}
.lt .formula{background:#e8f7ee;border:1.5px solid rgba(13,51,32,.12);color:#0d3320;border-radius:8px;}

/* amortization table */
.am-table{width:100%;border-collapse:collapse;font-family:'Fira Code',monospace;font-size:11px;}
.am-table th{text-align:left;padding:6px 10px;font-family:'Outfit',sans-serif;font-size:9px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;}
.dk .am-table th{color:rgba(20,255,180,.4);border-bottom:1px solid var(--bdr);}
.lt .am-table th{color:var(--acc);border-bottom:1.5px solid var(--bdr);}
.am-table td{padding:6px 10px;}
.dk .am-table tr:nth-child(even) td{background:rgba(20,255,180,.015);}
.lt .am-table tr:nth-child(even) td{background:rgba(13,51,32,.02);}
.dk .am-table td{border-bottom:1px solid rgba(20,255,180,.04);color:var(--tx2);}
.lt .am-table td{border-bottom:1px solid var(--bdr);color:var(--tx);}

/* bar chart */
.bar-track{height:8px;border-radius:4px;overflow:hidden;flex:1;}
.dk .bar-track{background:rgba(20,255,180,.08);}
.lt .bar-track{background:rgba(13,51,32,.08);}

/* faq */
.faq{padding:13px 15px;margin-bottom:8px;}
.dk .faq{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.25);}
.lt .faq{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.8);}

.lbl{font-family:'Outfit',sans-serif;font-size:9px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(20,255,180,.4);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(20,255,180,.3);}
.lt .slbl{color:var(--acc);}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(20,255,180,.01);border:1px dashed rgba(20,255,180,.08);border-radius:3px;}
.lt .ad{background:rgba(13,51,32,.02);border:1.5px dashed rgba(13,51,32,.1);border-radius:9px;}
.ad span{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

.ab p,.ab li{font-family:'Outfit',sans-serif;font-size:13.5px;line-height:1.8;color:var(--tx2);margin-bottom:7px;}
.ab h3{font-family:'Fraunces',serif;font-size:15px;font-weight:600;color:var(--tx);margin:18px 0 8px;}
.ab ul{padding-left:18px;}
.ab li{margin-bottom:4px;}
`;

/* ── helpers ── */
const fmt  = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtK = (n) => n >= 1000 ? '$' + (n/1000).toFixed(1) + 'k' : '$' + Math.round(n);

/* ── calc ── */
function calc(principal, annualRate, termYears) {
  const p  = parseFloat(principal);
  const r  = parseFloat(annualRate) / 100 / 12;
  const n  = parseFloat(termYears) * 12;
  if (!p || !n || isNaN(r) || n === 0) return null;
  if (r === 0) {
    const m = p / n;
    return { monthly: m, total: p, interest: 0, principal: p, n, r, monthlyR: 0 };
  }
  const monthly   = (p * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
  const total     = monthly * n;
  const interest  = total - p;
  return { monthly, total, interest, principal: p, n, r, monthlyR: r };
}

/* ── amortization schedule (yearly summary) ── */
function buildSchedule(p, r, monthly, n) {
  const rows = [];
  let balance = p;
  let yearPrincipal = 0, yearInterest = 0;
  for (let m = 1; m <= n; m++) {
    const intPmt  = balance * r;
    const prinPmt = monthly - intPmt;
    balance      -= prinPmt;
    yearInterest  += intPmt;
    yearPrincipal += prinPmt;
    if (m % 12 === 0 || m === n) {
      rows.push({
        year:      Math.ceil(m/12),
        principal: yearPrincipal,
        interest:  yearInterest,
        balance:   Math.max(0, balance),
      });
      yearPrincipal = 0; yearInterest = 0;
    }
  }
  return rows;
}

/* ════════════════════════════════════════════════════════════ */
const StudentLoanRepayment = ({ isDarkMode: ext } = {}) => {
  const [dark, setDark] = useState(ext !== undefined ? ext : true);
  const cls = dark ? 'dk' : 'lt';

  const [loanAmount,    setLoanAmount]    = useState(30000);
  const [interestRate,  setInterestRate]  = useState(5.5);
  const [term,          setTerm]          = useState(10);
  const [showSchedule,  setShowSchedule]  = useState(false);
  const [currency,      setCurrency]      = useState('$');

  const res = useMemo(() => calc(loanAmount, interestRate, term), [loanAmount, interestRate, term]);

  const schedule = useMemo(() => {
    if (!res) return [];
    return buildSchedule(res.principal, res.monthlyR, res.monthly, res.n);
  }, [res]);

  const principalPct = res ? Math.round((res.principal / res.total) * 100) : 0;
  const interestPct  = res ? 100 - principalPct : 0;

  /* ════════ RENDER ════════ */
  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>
        {dark && <div className="scanline" />}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:32,height:32,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:16,borderRadius:dark?3:9,
              border:dark?'1px solid rgba(20,255,180,.35)':'none',
              background:dark?'rgba(20,255,180,.07)':'linear-gradient(135deg,#0d3320,#1a5c38)',
              boxShadow:dark?'0 0 16px rgba(20,255,180,.2)':'0 3px 10px rgba(13,51,32,.35)'}}>🏦</div>
            <div>
              <div style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:16,color:'var(--tx)',lineHeight:1}}>
                Loan<span style={{color:'var(--acc)'}}>Calc</span>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--tx3)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #5 · student loan repayment
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>

          {/* live monthly pill */}
          {res && (
            <motion.div key={res.monthly.toFixed(0)}
              initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}}
              style={{display:'flex',alignItems:'center',gap:6,padding:'4px 11px',
                border:dark?'1px solid rgba(20,255,180,.2)':'1.5px solid var(--bdr)',
                borderRadius:dark?3:7,background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)'}}>
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)'}}>MONTHLY</span>
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:14,fontWeight:500,color:'var(--acc)'}}>
                {currency}{fmt(res.monthly)}
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

        {/* BODY */}
        <div className="body">

          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* quick scenarios */}
            <div>
              <div className="slbl">Quick scenarios</div>
              {[
                {label:'Small loan',   amount:10000, rate:4.5,  term:5},
                {label:'Average grad', amount:30000, rate:5.5,  term:10},
                {label:'Med school',   amount:100000,rate:6.5,  term:20},
                {label:'Max federal',  amount:57500, rate:5.05, term:10},
              ].map(s=>(
                <button key={s.label}
                  onClick={()=>{setLoanAmount(s.amount);setInterestRate(s.rate);setTerm(s.term);}}
                  style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',
                    padding:'7px 9px',marginBottom:4,background:'transparent',cursor:'pointer',
                    border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                    borderRadius:dark?3:7,transition:'all .13s'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--acc)';}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=dark?'var(--bdr)':'var(--bdr)';}}>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11.5,fontWeight:600,color:'var(--tx)'}}>{s.label}</div>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',marginTop:1}}>
                      {currency}{s.amount.toLocaleString()} · {s.rate}% · {s.term}yr
                    </div>
                  </div>
                  <span style={{fontSize:10,color:'var(--txm)'}}>›</span>
                </button>
              ))}
            </div>

            {/* currency */}
            <div>
              <div className="slbl">Currency symbol</div>
              <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                {['$','£','€','₹','¥'].map(c=>(
                  <button key={c} onClick={()=>setCurrency(c)}
                    style={{padding:'4px 9px',cursor:'pointer',
                      fontFamily:"'Fira Code',monospace",fontSize:12,
                      border:currency===c?(dark?'1px solid var(--acc)':'1.5px solid var(--acc)'):(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                      borderRadius:dark?3:6,
                      color:currency===c?'var(--acc)':'var(--txm)',
                      background:currency===c?(dark?'rgba(20,255,180,.08)':'rgba(13,51,32,.06)'):'transparent'}}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* summary */}
            {res && (
              <div>
                <div className="slbl">Summary</div>
                {[
                  ['Principal',  currency+res.principal.toLocaleString()],
                  ['Total repay',currency+fmt(res.total)],
                  ['Total int.', currency+fmt(res.interest)],
                  ['Int. ratio', interestPct+'%'],
                  ['Payments',   res.n+' months'],
                ].map(([l,v])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                    padding:'5px 9px',marginBottom:3,borderRadius:dark?2:6,
                    border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                    background:dark?'rgba(20,255,180,.02)':'rgba(13,51,32,.02)'}}>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10.5,color:'var(--txm)'}}>{l}</span>
                    <span style={{fontFamily:"'Fira Code',monospace",fontSize:9.5,color:'var(--acc)'}}>{v}</span>
                  </div>
                ))}
              </div>
            )}

            
          </div>

          {/* MAIN */}
          <div className="main">
            

            {/* ── CALCULATOR PANEL ── */}
            <div className="panel" style={{padding:'20px 22px'}}>
              <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:20}}>
                <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:16,border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',
                  background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)'}}>🧮</div>
                <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>
                  Loan repayment calculator
                </div>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
                {/* inputs */}
                <div style={{display:'flex',flexDirection:'column',gap:16}}>
                  {/* Loan amount */}
                  <div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                      <label className="lbl" style={{marginBottom:0}}>Loan amount</label>
                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:12,color:'var(--acc)'}}>{currency}{Number(loanAmount).toLocaleString()}</span>
                    </div>
                    <input className="fi" type="number" min="1000" max="500000" step="1000"
                      value={loanAmount} onChange={e=>setLoanAmount(e.target.value)}
                      style={{marginBottom:6}}/>
                    <input type="range" min="1000" max="200000" step="1000"
                      value={loanAmount} onChange={e=>setLoanAmount(e.target.value)}/>
                  </div>

                  {/* Interest rate */}
                  <div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                      <label className="lbl" style={{marginBottom:0}}>Annual interest rate</label>
                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:12,color:'var(--acc)'}}>{interestRate}%</span>
                    </div>
                    <input className="fi" type="number" min="0.1" max="30" step="0.1"
                      value={interestRate} onChange={e=>setInterestRate(e.target.value)}
                      style={{marginBottom:6}}/>
                    <input type="range" min="0.1" max="20" step="0.1"
                      value={interestRate} onChange={e=>setInterestRate(e.target.value)}/>
                  </div>

                  {/* Term */}
                  <div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                      <label className="lbl" style={{marginBottom:0}}>Loan term</label>
                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:12,color:'var(--acc)'}}>{term} years</span>
                    </div>
                    <input className="fi" type="number" min="1" max="30"
                      value={term} onChange={e=>setTerm(e.target.value)}
                      style={{marginBottom:6}}/>
                    <input type="range" min="1" max="30" step="1"
                      value={term} onChange={e=>setTerm(e.target.value)}/>
                  </div>
                </div>

                {/* result */}
                <AnimatePresence mode="wait">
                  {res && (
                    <motion.div key={res.monthly.toFixed(2)} className="result-card"
                      initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                      style={{display:'flex',flexDirection:'column',gap:14,justifyContent:'center'}}>

                      {/* monthly headline */}
                      <div style={{textAlign:'center'}}>
                        <div className="lbl" style={{textAlign:'center',marginBottom:4}}>Monthly payment</div>
                        <div style={{fontFamily:"'Fira Code',monospace",fontSize:40,fontWeight:500,
                          color:'var(--acc)',lineHeight:1,letterSpacing:'-.02em'}}>
                          {currency}{fmt(res.monthly)}
                        </div>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'var(--txm)',marginTop:4}}>
                          over {res.n} payments
                        </div>
                      </div>

                      <div style={{height:1,background:dark?'rgba(20,255,180,.1)':'rgba(13,51,32,.1)'}}/>

                      {/* principal vs interest bar */}
                      <div>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>Principal {principalPct}%</span>
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--warn)'}}>Interest {interestPct}%</span>
                        </div>
                        <div style={{height:8,borderRadius:4,overflow:'hidden',display:'flex'}}>
                          <motion.div animate={{width:`${principalPct}%`}} transition={{duration:.5}}
                            style={{height:'100%',background:'var(--acc)',borderRadius:'4px 0 0 4px'}}/>
                          <motion.div animate={{width:`${interestPct}%`}} transition={{duration:.5}}
                            style={{height:'100%',background:dark?'#fbbf24':'#92400e',borderRadius:'0 4px 4px 0'}}/>
                        </div>
                      </div>

                      {/* stat row */}
                      <div style={{display:'flex',gap:8}}>
                        {[
                          ['Principal',  currency+res.principal.toLocaleString(), ''],
                          ['Total interest', currency+fmt(res.interest), dark?'#fbbf24':'#92400e'],
                          ['Total paid', currency+fmt(res.total), ''],
                        ].map(([l,v,c])=>(
                          <div key={l} className="sb">
                            <div className="lbl">{l}</div>
                            <div style={{fontFamily:"'Fira Code',monospace",fontSize:11,fontWeight:500,color:c||'var(--tx)'}}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── SOLUTION STEPS ── */}
            {res && (
              <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                className="panel" style={{padding:'18px 20px'}}>
                <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
                  <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:16,border:dark?'1px solid rgba(167,139,250,.3)':'1.5px solid rgba(91,33,182,.2)',
                    background:dark?'rgba(167,139,250,.08)':'rgba(91,33,182,.05)'}}>∑</div>
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>
                    Repayment solution engine
                  </div>
                </div>

                {[
                  {
                    n:1, t:'Convert rates and terms',
                    d:`Interest is calculated monthly. We convert the annual rate to a monthly decimal and term in years to total months.`,
                    f:`i = ${interestRate}% ÷ 12 = ${(parseFloat(interestRate)/1200).toFixed(6)}   |   n = ${term} × 12 = ${res.n} payments`,
                  },
                  {
                    n:2, t:'Apply amortisation formula',
                    d:'The standard amortising loan formula finds the fixed monthly payment that brings the balance to exactly zero.',
                    f:`M = P × [ i(1+i)ⁿ ] ÷ [ (1+i)ⁿ − 1 ]`,
                  },
                  {
                    n:3, t:'Substitute and solve',
                    d:`Plugging in the values for this loan gives the exact monthly payment and total cost.`,
                    f:`M = ${currency}${res.principal.toLocaleString()} × [...] = ${currency}${fmt(res.monthly)}\nTotal = ${currency}${fmt(res.monthly)} × ${res.n} = ${currency}${fmt(res.total)}`,
                  },
                ].map(({n,t,d,f})=>(
                  <div key={n} className="step-card">
                    <div className="step-num">{n}</div>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:13.5,fontWeight:600,color:'var(--tx)',marginBottom:4}}>{t}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.7,marginBottom:0}}>{d}</div>
                      <div className="formula">{f}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ── AMORTIZATION SCHEDULE ── */}
            {res && (
              <div className="panel" style={{padding:'18px 20px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:showSchedule?16:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:9}}>
                    <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:16,border:dark?'1px solid rgba(20,255,180,.2)':'1.5px solid rgba(13,51,32,.15)',
                      background:dark?'rgba(20,255,180,.05)':'rgba(13,51,32,.04)'}}>📅</div>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:15,fontWeight:700,color:'var(--tx)'}}>
                      Amortisation schedule
                    </div>
                  </div>
                  <button onClick={()=>setShowSchedule(s=>!s)}
                    style={{background:'transparent',border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                      borderRadius:dark?3:7,padding:'5px 11px',cursor:'pointer',
                      fontFamily:"'Outfit',sans-serif",fontSize:10,color:'var(--txm)',transition:'all .13s'}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--acc)';e.currentTarget.style.color='var(--acc)';}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=dark?'var(--bdr)':'var(--bdr)';e.currentTarget.style.color='var(--txm)';}}>
                    {showSchedule ? '▲ Hide' : '▼ Show'} year-by-year
                  </button>
                </div>

                <AnimatePresence>
                  {showSchedule && (
                    <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} style={{overflow:'hidden'}}>
                      {/* bar chart rows */}
                      <div style={{marginBottom:14}}>
                        {schedule.map(row=>{
                          const maxTotal = res.total / (res.n / 12);
                          const pPct = (row.principal / maxTotal) * 100;
                          const iPct = (row.interest  / maxTotal) * 100;
                          return (
                            <div key={row.year} style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
                              <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',width:32,textAlign:'right'}}>Y{row.year}</div>
                              <div style={{flex:1,display:'flex',height:8,borderRadius:4,overflow:'hidden'}}>
                                <div style={{width:`${pPct}%`,background:'var(--acc)',transition:'width .5s'}}/>
                                <div style={{width:`${iPct}%`,background:dark?'rgba(251,191,36,.6)':'rgba(146,64,14,.5)',transition:'width .5s'}}/>
                              </div>
                              <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',width:64,textAlign:'right'}}>
                                {currency}{Math.round(row.balance).toLocaleString()}
                              </div>
                            </div>
                          );
                        })}
                        <div style={{display:'flex',gap:16,marginTop:8,paddingLeft:40}}>
                          {[['Principal','var(--acc)'],['Interest',dark?'rgba(251,191,36,.7)':'rgba(146,64,14,.6)']].map(([l,c])=>(
                            <div key={l} style={{display:'flex',alignItems:'center',gap:5}}>
                              <div style={{width:10,height:10,borderRadius:2,background:c}}/>
                              <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:'var(--txm)'}}>{l}</span>
                            </div>
                          ))}
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginLeft:'auto'}}>right = remaining balance</span>
                        </div>
                      </div>

                      {/* table */}
                      <div style={{overflowX:'auto'}}>
                        <table className="am-table">
                          <thead>
                            <tr>
                              <th>Year</th><th>Principal paid</th><th>Interest paid</th>
                              <th>Total paid</th><th>Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {schedule.map(row=>(
                              <tr key={row.year}>
                                <td style={{color:'var(--acc)'}}>{row.year}</td>
                                <td>{currency}{fmt(row.principal)}</td>
                                <td style={{color:dark?'#fbbf24':'#92400e'}}>{currency}{fmt(row.interest)}</td>
                                <td>{currency}{fmt(row.principal+row.interest)}</td>
                                <td style={{color:'var(--txm)'}}>{currency}{fmt(row.balance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ── SEO ARTICLE ── */}
            <div className="panel" style={{padding:'22px 24px'}}>
              <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
                <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',
                  justifyContent:'center',fontSize:16,
                  border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',
                  background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.04)'}}>📖</div>
                <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--tx)'}}>
                  The student's guide to loan repayment: principal vs. interest
                </div>
              </div>
              <div className="ab">
                <p>For many students, taking out loans is a necessary part of pursuing higher education. Understanding exactly how those loans are repaid — and what they ultimately cost — is vital for long-term financial health. Student loan repayment is a mathematical process called amortisation.</p>
                <h3>How interest impacts your total debt</h3>
                <p>The most surprising part of loan repayment for many graduates is the total amount of interest paid over time. Because interest is compounded monthly, even a seemingly small rate of 5–6% can add tens of thousands of dollars to the total cost of a {currency}30,000 loan.</p>
                <ul>
                  <li><strong style={{color:'var(--tx)'}}>Principal</strong> — the original amount you borrowed.</li>
                  <li><strong style={{color:'var(--tx)'}}>Interest</strong> — the cost of borrowing, calculated monthly on the remaining balance.</li>
                  <li><strong style={{color:'var(--tx)'}}>Amortisation</strong> — spreading payments over time so each covers interest plus a portion of principal.</li>
                </ul>
                <h3>Strategies for faster repayment</h3>
                <ul>
                  <li><strong style={{color:'var(--tx)'}}>Extra principal payments</strong> — reduce the balance that future interest is calculated on.</li>
                  <li><strong style={{color:'var(--tx)'}}>Bi-weekly payments</strong> — half-payments every two weeks equals 13 full payments per year, shortening the term.</li>
                  <li><strong style={{color:'var(--tx)'}}>Refinancing</strong> — if rates drop, a new loan at a lower rate can save significant interest over time.</li>
                </ul>
                <h3>FAQ: managing student debt</h3>
                <div className="faq">
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:13.5,fontWeight:600,color:'var(--tx)',marginBottom:5}}>What is a grace period?</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.7}}>A grace period is the time after graduating before payments begin. For many federal loans this is six months — but interest may still accrue during this period on unsubsidised loans.</div>
                </div>
                <div className="faq">
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:13.5,fontWeight:600,color:'var(--tx)',marginBottom:5}}>Subsidised vs. unsubsidised loans?</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.7}}>With subsidised loans the government pays interest while you're in school. With unsubsidised loans, interest begins accruing from the day the loan is disbursed — increasing your balance before you even graduate.</div>
                </div>
                <div className="faq">
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:13.5,fontWeight:600,color:'var(--tx)',marginBottom:5}}>How is the monthly payment calculated?</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.7}}>Using the standard amortisation formula: M = P × [i(1+i)ⁿ] ÷ [(1+i)ⁿ − 1], where P is principal, i is the monthly interest rate, and n is the number of payments. This tool computes it live as you adjust the sliders above.</div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentLoanRepayment;