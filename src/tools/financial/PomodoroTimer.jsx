import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   POMODORO TIMER  — Document Tools Series #4
   Theme: Dark Void/Neon Teal · Light Cream/Forest  (matches series)
   Fonts: Fraunces · Outfit · Fira Code
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Outfit',sans-serif}

@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(20,255,180,.2)}50%{box-shadow:0 0 0 10px rgba(20,255,180,0)}}
@keyframes glow-pulse{0%,100%{box-shadow:0 0 0 0 rgba(20,255,180,.35)}50%{box-shadow:0 0 28px 4px rgba(20,255,180,.15)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes fadeup{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@keyframes ring-spin{from{stroke-dashoffset:var(--sd-start)}to{stroke-dashoffset:var(--sd-end)}}
@keyframes session-pop{0%{transform:scale(1)}40%{transform:scale(1.35)}100%{transform:scale(1)}}

.dk{
  --bg:#060a09;--s1:#0a0f0d;--s2:#0f1612;--s3:#141d18;
  --bdr:#1a2820;
  --acc:#14ffb4;--acc2:#00e5a0;--acc4:#a78bfa;
  --acc-work:#14ffb4;--acc-short:#fbbf24;--acc-long:#a78bfa;
  --err:#ff6b6b;--warn:#fbbf24;
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
  --acc-work:#0d3320;--acc-short:#92400e;--acc-long:#5b21b6;
  --err:#991b1b;--warn:#92400e;
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

/* mode tabs */
.modetab{height:36px;padding:0 14px;border:none;cursor:pointer;background:transparent;
  font-family:'Outfit',sans-serif;font-size:10.5px;font-weight:600;letter-spacing:.04em;
  display:flex;align-items:center;gap:6px;white-space:nowrap;transition:all .15s;border-radius:3px;}
.dk .modetab{color:var(--txm);}
.dk .modetab.on{background:rgba(20,255,180,.1);color:var(--acc);}
.dk .modetab:hover:not(.on){color:var(--tx2);}
.lt .modetab{color:#94a3b8;}
.lt .modetab.on{background:rgba(13,51,32,.08);color:var(--acc);border-radius:7px;}
.lt .modetab:hover:not(.on){color:var(--tx2);}

/* play/pause button */
.playbtn{width:80px;height:80px;border-radius:50%;border:none;cursor:pointer;display:flex;
  align-items:center;justify-content:center;transition:all .18s;flex-shrink:0;}
.dk .playbtn{background:var(--acc);color:#060a09;animation:glow-pulse 2.4s infinite;}
.dk .playbtn:hover{background:#4fffca;transform:scale(1.06);animation:none;box-shadow:0 0 36px rgba(20,255,180,.6);}
.dk .playbtn.paused{animation:none;}
.lt .playbtn{background:var(--acc);color:white;box-shadow:0 6px 20px rgba(13,51,32,.35);}
.lt .playbtn:hover{background:var(--acc2);transform:scale(1.06);}

.resetbtn{width:48px;height:48px;border-radius:50%;border:none;cursor:pointer;display:flex;
  align-items:center;justify-content:center;transition:all .15s;flex-shrink:0;}
.dk .resetbtn{background:rgba(20,255,180,.05);border:1px solid var(--bdr);color:var(--txm);}
.dk .resetbtn:hover{border-color:var(--acc);color:var(--acc);background:rgba(20,255,180,.08);}
.lt .resetbtn{background:var(--s2);border:1.5px solid var(--bdr);color:var(--txm);}
.lt .resetbtn:hover{border-color:var(--acc);color:var(--acc);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:10px 22px;cursor:pointer;
  font-family:'Outfit',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.04em;transition:all .16s;border:none;}
.dk .btn{background:var(--acc);color:#060a09;border-radius:3px;animation:glow 2.6s infinite;}
.dk .btn:hover{background:#4fffca;transform:translateY(-1px);animation:none;box-shadow:0 0 28px rgba(20,255,180,.5);}
.lt .btn{background:var(--acc);color:#fff;border-radius:8px;box-shadow:0 4px 14px rgba(13,51,32,.3);}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);}

.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;
  font-family:'Outfit',sans-serif;font-size:10px;font-weight:500;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(20,255,180,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(13,51,32,.05);}

.lbl{font-family:'Outfit',sans-serif;font-size:9px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(20,255,180,.4);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(20,255,180,.3);}
.lt .slbl{color:var(--acc);}

/* session dots */
.dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;transition:all .3s;}
.dk .dot{border:1px solid var(--bdr);background:transparent;}
.dk .dot.done{background:var(--acc);border-color:var(--acc);box-shadow:0 0 6px rgba(20,255,180,.5);}
.lt .dot{border:1.5px solid var(--bdr);background:transparent;}
.lt .dot.done{background:var(--acc);border-color:var(--acc);}

/* step card */
.step-card{display:flex;gap:13px;align-items:flex-start;padding:14px 16px;margin-bottom:10px;}
.dk .step-card{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.25);}
.lt .step-card{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.7);}
.step-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'Fira Code',monospace;font-size:11px;font-weight:500;flex-shrink:0;}
.dk .step-num{border:1px solid rgba(20,255,180,.3);background:rgba(20,255,180,.06);color:var(--acc);}
.lt .step-num{border:1.5px solid rgba(13,51,32,.3);background:rgba(13,51,32,.06);color:var(--acc);}

/* faq card */
.faq-card{padding:14px 16px;margin-bottom:8px;}
.dk .faq-card{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.3);}
.lt .faq-card{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.8);}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(20,255,180,.01);border:1px dashed rgba(20,255,180,.08);border-radius:3px;}
.lt .ad{background:rgba(13,51,32,.02);border:1.5px dashed rgba(13,51,32,.1);border-radius:9px;}
.ad span{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

.ab p,.ab li{font-family:'Outfit',sans-serif;font-size:13.5px;line-height:1.8;color:var(--tx2);margin-bottom:7px;}
.ab h3{font-family:'Fraunces',serif;font-size:15px;font-weight:600;color:var(--tx);margin:18px 0 8px;}
.ab ul{padding-left:18px;}
.ab li{margin-bottom:5px;}
`;

/* ── presets ── */
const PRESETS = {
  work:       { label: 'Deep Work',    sub: '25 min',  time: 25 * 60, icon: '🧠', accent: '--acc-work'  },
  shortBreak: { label: 'Short Break',  sub: '5 min',   time:  5 * 60, icon: '☕', accent: '--acc-short' },
  longBreak:  { label: 'Long Break',   sub: '15 min',  time: 15 * 60, icon: '⚡', accent: '--acc-long'  },
};

const CIRC = 2 * Math.PI * 108; // r=108

const fmtTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

/* ════════════════════════════════════════════════════════════ */
const PomodoroTimer = ({ isDarkMode: ext } = {}) => {
  const [dark,  setDark]  = useState(ext !== undefined ? ext : true);
  const cls = dark ? 'dk' : 'lt';

  const [mode,    setMode]    = useState('work');
  const [timeLeft,setTimeLeft]= useState(PRESETS.work.time);
  const [active,  setActive]  = useState(false);
  const [sessions,setSessions]= useState(0);
  const [done,    setDone]    = useState(false);  // flash on finish

  // custom durations (minutes)
  const [custom, setCustom] = useState({ work: 25, shortBreak: 5, longBreak: 15 });
  const [editing, setEditing] = useState(false);
  const [tmpCustom, setTmpCustom] = useState({ ...custom });

  const ref = useRef(null);

  const totalTime = custom[mode] * 60;
  const progress  = timeLeft / totalTime; // 1 → 0
  const offset    = CIRC * progress;      // full → 0

  useEffect(() => {
    // ✅ FIXED: Handle timer interval and completion separately to avoid cascading renders
    if (active && timeLeft > 0) {
      ref.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && active) {
      // Timer completed - batch all state updates
      clearInterval(ref.current);
      // These will be batched into a single render in React 18+
      setActive(false);
      setDone(true);
      if (mode === 'work') setSessions(s => s + 1);
      // Separate async callback (not batched, which is fine for delayed state)
      setTimeout(() => setDone(false), 1800);
    }
    return () => clearInterval(ref.current);
  }, [active, timeLeft, mode]);

  const switchMode = (m) => {
    setMode(m); setActive(false); setTimeLeft(custom[m] * 60); setDone(false);
  };

  const reset = () => { setActive(false); setTimeLeft(custom[mode] * 60); setDone(false); };

  const applyCustom = () => {
    const c = {
      work:       Math.min(120, Math.max(1, Number(tmpCustom.work)       || 25)),
      shortBreak: Math.min(60,  Math.max(1, Number(tmpCustom.shortBreak) || 5)),
      longBreak:  Math.min(60,  Math.max(1, Number(tmpCustom.longBreak)  || 15)),
    };
    setCustom(c);
    setTimeLeft(c[mode] * 60);
    setActive(false);
    setEditing(false);
  };

  /* ring colour based on mode */
  const ringColor = {
    work:       dark ? '#14ffb4' : '#0d3320',
    shortBreak: dark ? '#fbbf24' : '#92400e',
    longBreak:  dark ? '#a78bfa' : '#5b21b6',
  }[mode];

  /* ════════════ RENDER ════════════ */
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
              boxShadow:dark?'0 0 16px rgba(20,255,180,.2)':'0 3px 10px rgba(13,51,32,.35)'}}>⏱</div>
            <div>
              <div style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:16,color:'var(--tx)',lineHeight:1}}>
                Pomodoro<span style={{color:'var(--acc)'}}>Timer</span>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--tx3)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #4 · focus · deep work
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>

          {/* session counter in topbar */}
          <div style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(20,255,180,.15)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent'}}>
            <span style={{fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)'}}>SESSIONS</span>
            <motion.span key={sessions}
              animate={{scale:[1,1.4,1]}} transition={{duration:.4}}
              style={{fontFamily:"'Fira Code',monospace",fontSize:13,fontWeight:500,color:'var(--acc)'}}>
              {sessions}
            </motion.span>
          </div>

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
            

            {/* session history dots */}
            <div>
              <div className="slbl">Sessions today</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6,padding:'8px 6px'}}>
                {Array.from({length:Math.max(8, sessions+2)}).map((_,i)=>(
                  <div key={i} className={`dot${i<sessions?' done':''}`}
                    style={i===sessions&&active?{border:`1.5px solid ${ringColor}`,animation:'blink 1s infinite'}:{}}/>
                ))}
              </div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginTop:4}}>
                {sessions} × {custom.work}min = {sessions*custom.work}min focused
              </div>
            </div>

            {/* custom timer */}
            <div>
              <div className="slbl">Durations (min)</div>
              {!editing ? (
                <>
                  {[['work','🧠 Work',custom.work],['shortBreak','☕ Short',custom.shortBreak],['longBreak','⚡ Long',custom.longBreak]].map(([k,l,v])=>(
                    <div key={k} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                      padding:'5px 9px',marginBottom:3,borderRadius:dark?2:6,
                      border:mode===k?(dark?'1px solid var(--acc)':'1.5px solid var(--acc)'):(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                      background:mode===k?(dark?'rgba(20,255,180,.05)':'rgba(13,51,32,.04)'):(dark?'rgba(20,255,180,.01)':'rgba(13,51,32,.01)')}}>
                      <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10.5,color:'var(--tx2)'}}>{l}</span>
                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--acc)'}}>{v}m</span>
                    </div>
                  ))}
                  <button className="gbtn" onClick={()=>{setTmpCustom({...custom});setEditing(true);}} style={{width:'100%',justifyContent:'center',marginTop:4}}>
                    ✎ Edit durations
                  </button>
                </>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:7}}>
                  {[['work','🧠 Work'],['shortBreak','☕ Short'],['longBreak','⚡ Long']].map(([k,l])=>(
                    <div key={k}>
                      <div className="lbl">{l}</div>
                      <input type="number" min="1" max="120"
                        value={tmpCustom[k]}
                        onChange={e=>setTmpCustom(p=>({...p,[k]:e.target.value}))}
                        style={{width:'100%',outline:'none',fontFamily:"'Fira Code',monospace",fontSize:13,
                          padding:'6px 9px',background:dark?'rgba(0,0,0,.4)':'#f5fbf8',
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          borderRadius:dark?3:7,color:'var(--tx)'}}/>
                    </div>
                  ))}
                  <div style={{display:'flex',gap:6}}>
                    <button className="gbtn on" onClick={applyCustom} style={{flex:1,justifyContent:'center'}}>✓ Save</button>
                    <button className="gbtn" onClick={()=>setEditing(false)} style={{flex:1,justifyContent:'center'}}>✕</button>
                  </div>
                </div>
              )}
            </div>

            {/* stats */}
            <div>
              <div className="slbl">Stats</div>
              {[
                ['Mode',    PRESETS[mode].label],
                ['Time left', fmtTime(timeLeft)],
                ['Status',  active?'▶ Running':'⏸ Paused'],
                ['Total focus', sessions*custom.work+'min'],
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

            
          </div>

          {/* MAIN */}
          <div className="main">
            

            {/* ── TIMER PANEL ── */}
            <div className="panel" style={{padding:'28px 24px',display:'flex',flexDirection:'column',alignItems:'center',gap:22}}>

              {/* mode tabs */}
              <div style={{display:'flex',gap:4,padding:'4px',
                borderRadius:dark?4:10,
                background:dark?'rgba(20,255,180,.04)':'rgba(13,51,32,.04)',
                border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>
                {Object.entries(PRESETS).map(([k,p])=>(
                  <button key={k} className={`modetab${mode===k?' on':''}`}
                    onClick={()=>switchMode(k)}
                    style={mode===k?{color:ringColor}:{}}>
                    <span style={{fontSize:13}}>{p.icon}</span>
                    {p.label}
                  </button>
                ))}
              </div>

              {/* ring + time */}
              <div style={{position:'relative',width:240,height:240,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="240" height="240" style={{position:'absolute',transform:'rotate(-90deg)'}}>
                  {/* track */}
                  <circle cx="120" cy="120" r="108" fill="none"
                    stroke={dark?'rgba(20,255,180,.07)':'rgba(13,51,32,.07)'} strokeWidth="10"/>
                  {/* progress */}
                  <motion.circle cx="120" cy="120" r="108" fill="none"
                    stroke={ringColor} strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={CIRC}
                    animate={{strokeDashoffset: CIRC - offset}}
                    transition={{duration:1,ease:'linear'}}
                    style={{filter: dark?`drop-shadow(0 0 6px ${ringColor}66)`:'none'}}
                  />
                </svg>

                {/* centre content */}
                <div style={{position:'relative',textAlign:'center',zIndex:2}}>
                  <AnimatePresence mode="wait">
                    {done ? (
                      <motion.div key="done"
                        initial={{scale:.7,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:1.2,opacity:0}}
                        style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:700,color:ringColor,marginBottom:4}}>
                        Done! ✓
                      </motion.div>
                    ) : (
                      <motion.div key="time"
                        initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        <div style={{fontFamily:"'Fira Code',monospace",fontSize:48,fontWeight:500,
                          color:'var(--tx)',letterSpacing:'-.02em',lineHeight:1}}>
                          {fmtTime(timeLeft)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,fontWeight:600,
                    letterSpacing:'.16em',textTransform:'uppercase',color:ringColor,marginTop:6}}>
                    {PRESETS[mode].label}
                  </div>
                  {/* progress % */}
                  <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginTop:4}}>
                    {Math.round((1-progress)*100)}%
                  </div>
                </div>
              </div>

              {/* controls */}
              <div style={{display:'flex',alignItems:'center',gap:16}}>
                <button className="resetbtn" onClick={reset} title="Reset">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                  </svg>
                </button>

                <button className={`playbtn${!active?' paused':''}`} onClick={()=>setActive(a=>!a)}>
                  {active
                    ? <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                    : <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" style={{marginLeft:3}}><path d="M5 3l14 9-14 9V3z"/></svg>
                  }
                </button>

                {/* skip */}
                <button className="resetbtn" title="Skip to next"
                  onClick={()=>{
                    const order = ['work','shortBreak','longBreak'];
                    const next  = order[(order.indexOf(mode)+1)%order.length];
                    switchMode(next);
                  }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 4l10 8-10 8V4z"/><line x1="19" y1="5" x2="19" y2="19"/>
                  </svg>
                </button>
              </div>

              {/* quick preset pills */}
              <div style={{display:'flex',gap:7,flexWrap:'wrap',justifyContent:'center'}}>
                {[['50/10','50-10'],['25/5','25-5'],['15/3','15-3']].map(([label,val])=>{
                  const [w,b] = val.split('-').map(Number);
                  const active_ = custom.work===w && custom.shortBreak===b;
                  return (
                    <button key={val} className={`gbtn${active_?' on':''}`}
                      onClick={()=>{
                        const c2={...custom,work:w,shortBreak:b};
                        setCustom(c2); setTimeLeft(c2[mode]*60); setActive(false);
                      }}>
                      {label}
                    </button>
                  );
                })}
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)',alignSelf:'center'}}>quick presets</span>
              </div>
            </div>

            {/* ── SCIENCE STEPS ── */}
            <div className="panel" style={{padding:'18px 20px'}}>
              <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
                <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:16,border:dark?'1px solid rgba(167,139,250,.3)':'1.5px solid rgba(91,33,182,.2)',
                  background:dark?'rgba(167,139,250,.08)':'rgba(91,33,182,.05)'}}>🔬</div>
                <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>
                  The science of deep work
                </div>
              </div>
              {[
                {n:1, t:'The Pomodoro cycle', d:'Focus is a finite resource. 25-minute sprints followed by 5-minute breaks prevent mental fatigue and sustain high performance across the entire day.'},
                {n:2, t:'Context-switching cost', d:'It takes an average of 23 minutes to fully regain focus after a distraction. Committing to a timer block reduces this cost dramatically.'},
                {n:3, t:'Dopamine reinforcement', d:'Completing a session and watching your count rise provides a small dopamine hit — reinforcing the habit loop and making focus sessions self-sustaining.'},
              ].map(({n,t,d})=>(
                <div key={n} className="step-card">
                  <div className="step-num">{n}</div>
                  <div>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:13.5,fontWeight:600,color:'var(--tx)',marginBottom:4}}>{t}</div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.7}}>{d}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── SEO ARTICLE ── */}
            <div className="panel" style={{padding:'22px 24px'}}>
              <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
                <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',
                  justifyContent:'center',fontSize:16,
                  border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',
                  background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.04)'}}>📖</div>
                <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--tx)'}}>
                  Mastering the Pomodoro Technique
                </div>
              </div>
              <div className="ab">
                <p>The Pomodoro Technique was developed by Francesco Cirillo in the late 1980s. It breaks work into focused intervals — traditionally 25 minutes — separated by short breaks. For students and professionals facing long sessions, it's one of the most evidence-backed methods for sustaining mental performance.</p>
                <h3>Why Pomodoro works</h3>
                <ul>
                  <li><strong style={{color:'var(--tx)'}}>Combat procrastination</strong> — committing to just 25 minutes is easy. The hardest part is starting, and the timer handles that.</li>
                  <li><strong style={{color:'var(--tx)'}}>Manage distractions</strong> — when something pulls your attention, defer it: "I'll check that at the break in 12 minutes."</li>
                  <li><strong style={{color:'var(--tx)'}}>Build awareness</strong> — you'll learn exactly how many Pomodoros a task actually takes, making planning far more accurate.</li>
                </ul>
                <h3>How to use the presets</h3>
                <ul>
                  <li><strong style={{color:'var(--tx)'}}>50/10</strong> — best for complex tasks: coding, writing, problem-solving. Longer blocks let you reach a state of flow.</li>
                  <li><strong style={{color:'var(--tx)'}}>25/5</strong> — the classic Pomodoro balance. Perfect for reviewing notes, answering emails, reading.</li>
                  <li><strong style={{color:'var(--tx)'}}>15/3</strong> — ideal for flashcards, vocabulary drills, or short windows between classes.</li>
                </ul>
                <h3>FAQ</h3>
                <div className="faq-card">
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:13.5,fontWeight:600,color:'var(--tx)',marginBottom:5}}>What should I do during breaks?</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.7}}>Avoid screens. Stretch, drink water, look out a window. This gives your prefrontal cortex a genuine rest — passive scrolling does not count.</div>
                </div>
                <div className="faq-card">
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:13.5,fontWeight:600,color:'var(--tx)',marginBottom:5}}>What if I finish before the timer ends?</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.7}}>Use the remaining time for overlearning — review what you just completed, plan your next steps, or tidy your notes. Always respect the timer boundary.</div>
                </div>
                <div className="faq-card">
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:13.5,fontWeight:600,color:'var(--tx)',marginBottom:5}}>Can I customise the durations?</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.7}}>Yes — use the "Edit durations" control in the sidebar to set any work/break length, or click the quick-preset pills (50/10, 25/5, 15/3) under the timer for instant switching.</div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </>
  );
};

export default PomodoroTimer;