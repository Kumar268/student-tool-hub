import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   TYPING SPEED TEST — Document Tools Series #9
   Theme: Dark Void/Neon Teal · Light Cream/Forest
   Fonts: Fraunces · Outfit · Fira Code
   Tabs: Test · History · Guide
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Outfit',sans-serif}

@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes pop{0%{transform:scale(.8);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
@keyframes countdown{0%{transform:scale(1.4);opacity:.7}100%{transform:scale(1);opacity:1}}
@keyframes bar-fill{from{width:100%}to{width:0%}}
@keyframes result-in{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

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
.dk .fi:focus{border-color:var(--acc);}
.lt .fi{background:#f5fbf8;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);}

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

/* Typing display */
.type-display{font-family:'Fira Code',monospace;font-size:16px;line-height:2;padding:20px;letter-spacing:.01em;user-select:none;cursor:text;min-height:100px;border-radius:4px;}
.dk .type-display{background:rgba(0,0,0,.45);border:1px solid var(--bdr);}
.lt .type-display{background:rgba(245,251,248,.9);border:1.5px solid var(--bdr);border-radius:10px;}
.char-pending{color:var(--txm);}
.char-correct{color:var(--acc);}
.char-wrong{color:var(--err);text-decoration:underline;text-decoration-color:var(--err);}
.dk .char-wrong{background:rgba(255,107,107,.12);}
.lt .char-wrong{background:rgba(153,27,27,.07);}
.char-cursor{border-left:2px solid var(--acc);margin-left:-1px;animation:blink 1s step-end infinite;}

/* Input area */
.type-input{font-family:'Fira Code',monospace;font-size:15px;padding:14px 16px;outline:none;resize:none;width:100%;line-height:1.7;transition:border-color .13s;}
.dk .type-input{background:rgba(0,0,0,.5);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .type-input:focus{border-color:rgba(20,255,180,.4);}
.lt .type-input{background:#f5fbf8;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .type-input:focus{border-color:var(--acc);}
.type-input::placeholder{color:var(--txm);font-size:12px;}

/* Stat card */
.stat-card{padding:14px 12px;text-align:center;flex:1;}
.dk .stat-card{border:1px solid var(--bdr);border-radius:3px;background:rgba(0,0,0,.3);}
.lt .stat-card{border:1.5px solid var(--bdr);border-radius:10px;background:var(--s1);}

/* Progress bar */
.prog-track{height:4px;border-radius:2px;overflow:hidden;margin-top:4px;}
.dk .prog-track{background:rgba(20,255,180,.1);}
.lt .prog-track{background:rgba(13,51,32,.1);}
.prog-fill{height:100%;border-radius:2px;transition:width .15s linear;background:var(--acc);}

/* WPM badge */
.wpm-badge{display:inline-flex;align-items:baseline;gap:4px;}

/* Timer ring */
.timer-ring{transform:rotate(-90deg);}
.timer-track{fill:none;stroke-width:5;}
.dk .timer-track{stroke:rgba(20,255,180,.1);}
.lt .timer-track{stroke:rgba(13,51,32,.1);}
.timer-fill{fill:none;stroke-width:5;stroke-linecap:round;transition:stroke-dashoffset .9s linear;}

/* History row */
.hist-row{display:flex;align-items:center;gap:10px;padding:8px 12px;margin-bottom:4px;}
.dk .hist-row{border:1px solid var(--bdr);border-radius:3px;background:rgba(0,0,0,.25);}
.lt .hist-row{border:1.5px solid var(--bdr);border-radius:9px;background:rgba(245,251,248,.9);}

/* Result panel */
.result-panel{padding:28px;text-align:center;animation:result-in .4s ease;}
.dk .result-panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .result-panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:14px;box-shadow:0 4px 28px rgba(13,51,32,.1);}

.rank-badge{display:inline-flex;align-items:center;justify-content:center;padding:4px 12px;font-family:'Fira Code',monospace;font-size:10px;letter-spacing:.15em;text-transform:uppercase;border-radius:20px;margin-bottom:14px;}
.dk .rank-badge{border:1px solid rgba(20,255,180,.3);background:rgba(20,255,180,.08);color:var(--acc);}
.lt .rank-badge{border:1.5px solid rgba(13,51,32,.25);background:rgba(13,51,32,.06);color:var(--acc);}

.faq{padding:13px 15px;margin-bottom:8px;}
.dk .faq{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.25);}
.lt .faq{border:1.5px solid var(--bdr);border-radius:10px;}
`;

/* ── word banks ── */
const TEXTS = {
  code: [
    "const fibonacci = (n) => n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2); console.log(fibonacci(10));",
    "function debounce(fn, delay) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; }",
    "const fetchUser = async (id) => { const res = await fetch('/api/users/' + id); if (!res.ok) throw new Error('Not found'); return res.json(); };",
    "class EventEmitter { constructor() { this.events = {}; } on(e, fn) { (this.events[e] ??= []).push(fn); } emit(e, ...args) { this.events[e]?.forEach(fn => fn(...args)); } }",
  ],
  quotes: [
    "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. The best time to plant a tree was twenty years ago. The second best time is now.",
    "Reading is to the mind what exercise is to the body. The more that you read, the more things you will know. The more that you learn, the more places you will go.",
    "Not all those who wander are lost. The world is a book and those who do not travel read only one page. Every exit is an entry somewhere else.",
  ],
  pangrams: [
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump over the wall.",
    "Sphinx of black quartz, judge my vow. Waltz, nymph, for quick jigs vex Bud. Glib jocks quiz nymph to vex dwarf. Five boxing wizards jump quickly.",
    "A wizard's job is to vex chumps quickly in fog. The jay, pig, fox, zebra and my wolves quack. Blowzy night-frumps vex'd Jack Q.",
    "Jumpy halfback vowed to gorge nothing but exotic pizza. Crazy Fredrick bought many very exquisite opal jewels. Six big juicy steaks sizzled in a pan.",
  ],
  common: [
    "Typing quickly and accurately is a skill that improves with consistent practice. Focus on smooth keystrokes rather than raw speed, and the numbers will follow naturally.",
    "The best programmers are not necessarily the fastest typists, but good keyboard fluency removes friction between thought and code. Practice a little every day.",
    "Science is the systematic study of the structure and behaviour of the natural world through observation and experiment. Wonder is the beginning of wisdom.",
    "Great writing begins with a single honest sentence. Cut every word that does not earn its place. Clarity is the courtesy of a good writer to their reader.",
  ],
};

const DURATIONS = [15, 30, 60, 120];

const getRank = (wpm) => {
  if (wpm >= 120) return {label:'Speed Demon ⚡', color:'#fbbf24'};
  if (wpm >= 80)  return {label:'Power Typist 🚀', color:'#14ffb4'};
  if (wpm >= 60)  return {label:'Proficient ✓', color:'#a78bfa'};
  if (wpm >= 40)  return {label:'Getting There 👍', color:'#8ecfb8'};
  if (wpm >= 20)  return {label:'Keep Practicing 🐢', color:'#fbbf24'};
  return {label:'Just Starting 🌱', color:'#8ecfb8'};
};

const TABS = [
  {id:'test',    label:'⌨ Test'},
  {id:'history', label:'📊 History'},
  {id:'guide',   label:'? Guide'},
];

/* ════════════════════════════════════════════════════════════ */
export default function TypingSpeedTest({isDarkMode:ext}={}) {
  const [dark, setDark] = useState(ext!==undefined?ext:true);
  const cls = dark?'dk':'lt';
  const [tab, setTab] = useState('test');

  /* settings */
  const [duration,  setDuration]  = useState(60);
  const [category,  setCategory]  = useState('common');
  const [textIndex, setTextIndex] = useState(0);

  /* test state */
  const [phase,    setPhase]    = useState('idle');  // idle | typing | done
  const [typed,    setTyped]    = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm,      setWpm]      = useState(0);
  const [rawWpm,   setRawWpm]   = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [,         setErrors]   = useState(0);
  const [history,  setHistory]  = useState([]);
  const [shakeInput, setShakeInput] = useState(false);

  const inputRef  = useRef(null);
  const timerRef  = useRef(null);
  const startTime = useRef(null);

  const paragraph = TEXTS[category][textIndex];

  /* ── derived ── */
  const progress = useMemo(()=> paragraph ? Math.min(1, typed.length / paragraph.length) : 0, [typed, paragraph]);

  const correctChars = useMemo(()=>{
    let c=0;
    for(let i=0;i<typed.length;i++) if(typed[i]===paragraph[i]) c++;
    return c;
  },[typed, paragraph]);

  const currentErrors = useMemo(()=> typed.length - correctChars, [typed, correctChars]);

  /* ── new test ── */
  const newTest = useCallback((newCat, newDur)=>{
    clearInterval(timerRef.current);
    const cat = newCat ?? category;
    const dur = newDur ?? duration;
    const idx = Math.floor(Math.random() * TEXTS[cat].length);
    setTextIndex(idx);
    setPhase('idle');
    setTyped('');
    setTimeLeft(dur);
    setWpm(0);
    setRawWpm(0);
    setAccuracy(100);
    setErrors(0);
    startTime.current = null;
    setTimeout(()=>inputRef.current?.focus(), 80);
  },[category, duration]);

  /* ── handle input ── */
  const handleInput = useCallback((e)=>{
    if(phase==='done') return;
    const val = e.target.value;

    /* prevent over-typing */
    if(val.length > paragraph.length) return;

    /* start timer on first keystroke */
    if(phase==='idle' && val.length > 0){
      setPhase('typing');
      startTime.current = Date.now();
      timerRef.current = setInterval(()=>{
        setTimeLeft(prev=>{
          if(prev<=1){
            clearInterval(timerRef.current);
            setPhase('done');
            return 0;
          }
          return prev-1;
        });
      }, 1000);
    }

    /* wrong char shake */
    const newLen = val.length;
    if(newLen > 0 && val[newLen-1] !== paragraph[newLen-1]){
      setShakeInput(true);
      setTimeout(()=>setShakeInput(false), 300);
    }

    setTyped(val);

    /* compute live stats */
    let errs=0;
    for(let i=0;i<val.length;i++) if(val[i]!==paragraph[i]) errs++;
    setErrors(errs);

    const acc = val.length>0 ? Math.max(0,Math.round(((val.length-errs)/val.length)*100)) : 100;
    setAccuracy(acc);

    const elapsed = startTime.current ? (Date.now()-startTime.current)/60000 : 0;
    if(elapsed>0){
      const correct=val.length-errs;
      setWpm(Math.round((correct/5)/elapsed));
      setRawWpm(Math.round((val.length/5)/elapsed));
    }

    /* finished whole text */
    if(val===paragraph){
      clearInterval(timerRef.current);
      setPhase('done');
    }
  },[phase, paragraph]);

  /* ── save to history on done ── */
  useEffect(()=>{
    if(phase==='done'){
      const elapsed = startTime.current ? (Date.now()-startTime.current)/60000 : duration/60;
      const finalWpm = elapsed>0 ? Math.round((correctChars/5)/elapsed) : 0;
      const finalAcc = typed.length>0 ? Math.max(0,Math.round((correctChars/typed.length)*100)) : 100;

      setTimeout(() => {
        setWpm(finalWpm);
        setAccuracy(finalAcc);
        setHistory(h=>[{
          wpm:finalWpm,
          accuracy:finalAcc,
          errors:currentErrors,
          duration,
          category,
          date:new Date().toLocaleTimeString(),
        },...h.slice(0,19)]);
      }, 0);
    }
  }, [phase, duration, category, correctChars, currentErrors, typed.length]);

  useEffect(()=>()=>clearInterval(timerRef.current),[]);

  /* ── timer display ── */
  const timerPct = timeLeft / duration;
  const circumference = 2*Math.PI*22;
  const strokeDash = circumference*(1-timerPct);
  const timerColor = timeLeft<=5 ? 'var(--err)' : timeLeft<=15 ? 'var(--warn)' : 'var(--acc)';

  /* ── char rendering ── */
  const renderChars = ()=> paragraph.split('').map((ch, i)=>{
    let cls2 = 'char-pending';
    if(i<typed.length) cls2 = typed[i]===ch ? 'char-correct' : 'char-wrong';
    const isCursor = i===typed.length && phase!=='done';
    return (
      <span key={i} className={cls2}>
        {isCursor && <span className="char-cursor"/>}
        {ch}
      </span>
    );
  });

  /* ════════════════════════════════════════════════════════════ */
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
              boxShadow:dark?'0 0 16px rgba(20,255,180,.2)':'0 3px 10px rgba(13,51,32,.35)'}}>⌨</div>
            <div>
              <div style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:16,color:'var(--tx)',lineHeight:1}}>
                Typing<span style={{color:'var(--acc)'}}>Speed</span>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--tx3)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #9 · WPM · accuracy · streaks
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          {/* live wpm badge */}
          {phase==='typing'&&(
            <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
              style={{display:'flex',alignItems:'center',gap:8,padding:'4px 12px',
                border:dark?'1px solid rgba(20,255,180,.2)':'1.5px solid var(--bdr)',
                borderRadius:dark?3:7,background:dark?'rgba(20,255,180,.05)':'rgba(13,51,32,.04)'}}>
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)'}}>LIVE WPM</span>
              <span style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--acc)',lineHeight:1}}>{wpm}</span>
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
            

            {/* Duration picker */}
            <div>
              <div className="slbl">Duration</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:4}}>
                {DURATIONS.map(d=>(
                  <button key={d} className={`gbtn${duration===d?' on':''}`}
                    onClick={()=>{setDuration(d);newTest(null,d);}}
                    style={{justifyContent:'center'}}>
                    {d}s
                  </button>
                ))}
              </div>
            </div>

            {/* Category picker */}
            <div>
              <div className="slbl">Text type</div>
              {[['common','📝 Common'],['quotes','💬 Quotes'],['code','💻 Code'],['pangrams','🔤 Pangrams']].map(([k,l])=>(
                <button key={k} className={`gbtn${category===k?' on':''}`}
                  onClick={()=>{setCategory(k);newTest(k,null);}}
                  style={{width:'100%',marginBottom:4,justifyContent:'flex-start'}}>{l}</button>
              ))}
            </div>

            {/* Best score */}
            {history.length>0&&(
              <div>
                <div className="slbl">Personal best</div>
                <div style={{padding:'10px',borderRadius:dark?3:7,textAlign:'center',
                  border:dark?'1px solid rgba(20,255,180,.2)':'1.5px solid rgba(13,51,32,.2)',
                  background:dark?'rgba(20,255,180,.04)':'rgba(13,51,32,.03)'}}>
                  <div style={{fontFamily:"'Fira Code',monospace",fontSize:28,color:'var(--acc)',fontWeight:500,lineHeight:1}}>
                    {Math.max(...history.map(h=>h.wpm))}
                  </div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:'var(--txm)',marginTop:3}}>WPM</div>
                </div>
              </div>
            )}

            {/* WPM scale */}
            <div>
              <div className="slbl">WPM scale</div>
              {[['< 30','Beginner'],['30–60','Average'],['60–80','Good'],['80–120','Fast'],['120+','Elite']].map(([r,l])=>(
                <div key={r} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:dark?'1px solid rgba(20,255,180,.05)':'1px solid var(--bdr)'}}>
                  <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--acc)'}}>{r}</span>
                  <span style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:'var(--txm)'}}>{l}</span>
                </div>
              ))}
            </div>

            
          </div>

          {/* MAIN */}
          <div className="main">
            

            <AnimatePresence mode="wait">
              {/* ═══ TEST ═══ */}
              {tab==='test'&&(
                <motion.div key="test" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>

                  {/* stat row */}
                  <div style={{display:'flex',gap:8}}>
                    {/* timer */}
                    <div className="stat-card" style={{maxWidth:90}}>
                      <div className="slbl" style={{marginBottom:6,textAlign:'center'}}>time</div>
                      <div style={{position:'relative',width:56,height:56,margin:'0 auto'}}>
                        <svg width="56" height="56" className="timer-ring">
                          <circle className="timer-track" cx="28" cy="28" r="22"/>
                          <circle className="timer-fill" cx="28" cy="28" r="22"
                            stroke={timerColor}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDash}/>
                        </svg>
                        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:16,fontWeight:500,color:timerColor,lineHeight:1}}>{timeLeft}</span>
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:7,color:'var(--txm)'}}>sec</span>
                        </div>
                      </div>
                    </div>

                    {/* wpm */}
                    <div className="stat-card">
                      <div className="slbl" style={{textAlign:'center'}}>wpm</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:36,fontWeight:700,color:'var(--acc)',lineHeight:1,textAlign:'center'}}>{wpm}</div>
                      <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',textAlign:'center',marginTop:3}}>raw {rawWpm}</div>
                    </div>

                    {/* accuracy */}
                    <div className="stat-card">
                      <div className="slbl" style={{textAlign:'center'}}>accuracy</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:36,fontWeight:700,lineHeight:1,textAlign:'center',
                        color:accuracy>=95?'var(--acc)':accuracy>=80?'var(--warn)':'var(--err)'}}>{accuracy}%</div>
                      <div className="prog-track" style={{marginTop:8}}>
                        <div className="prog-fill" style={{width:`${accuracy}%`,
                          background:accuracy>=95?'var(--acc)':accuracy>=80?'var(--warn)':'var(--err)'}}/>
                      </div>
                    </div>

                    {/* errors */}
                    <div className="stat-card" style={{maxWidth:90}}>
                      <div className="slbl" style={{textAlign:'center'}}>errors</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:36,fontWeight:700,lineHeight:1,textAlign:'center',
                        color:currentErrors===0?'var(--acc)':'var(--err)'}}>{currentErrors}</div>
                    </div>

                    {/* progress */}
                    <div className="stat-card">
                      <div className="slbl" style={{textAlign:'center'}}>progress</div>
                      <div style={{fontFamily:"'Fira Code',monospace",fontSize:24,fontWeight:500,color:'var(--acc4)',lineHeight:1,textAlign:'center'}}>
                        {Math.round(progress*100)}%
                      </div>
                      <div className="prog-track" style={{marginTop:8}}>
                        <div className="prog-fill" style={{width:`${progress*100}%`,background:'var(--acc4)'}}/>
                      </div>
                    </div>
                  </div>

                  {/* text display */}
                  {phase!=='done'&&(
                    <div className="panel" style={{padding:'18px 20px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                        <div style={{display:'flex',gap:6,alignItems:'center'}}>
                          <span className="slbl" style={{margin:0}}>text</span>
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--acc4)',padding:'1px 6px',
                            borderRadius:2,border:dark?'1px solid rgba(167,139,250,.25)':'1.5px solid rgba(91,33,182,.2)',
                            background:dark?'rgba(167,139,250,.07)':'rgba(91,33,182,.04)'}}>{category}</span>
                        </div>
                        <button className="gbtn" onClick={()=>newTest()} style={{fontSize:9}}>↺ new text</button>
                      </div>

                      <div className="type-display" onClick={()=>inputRef.current?.focus()}>
                        {renderChars()}
                      </div>

                      <div style={{marginTop:12,position:'relative'}}>
                        <textarea
                          ref={inputRef}
                          className="type-input"
                          rows={3}
                          value={typed}
                          onChange={handleInput}
                          disabled={phase==='done'}
                          placeholder={phase==='idle'?"▶  Start typing to begin the test…":""}
                          style={{
                            animationName: shakeInput ? 'shake' : 'none',
                            animationDuration: '300ms',
                          }}
                          spellCheck={false}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                        />
                        {phase==='idle'&&(
                          <div style={{position:'absolute',bottom:8,right:12,fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--tx3)'}}>
                            {duration}s / {category}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── RESULTS ── */}
                  {phase==='done'&&(
                    <motion.div className="result-panel" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
                      <div className="rank-badge">{getRank(wpm).label}</div>

                      <div style={{display:'flex',justifyContent:'center',gap:20,marginBottom:22}}>
                        {[
                          {label:'WPM',       val:wpm,      color:'var(--acc)'},
                          {label:'Raw WPM',   val:rawWpm,   color:'var(--txm)'},
                          {label:'Accuracy',  val:accuracy+'%', color:accuracy>=95?'var(--acc)':accuracy>=80?'var(--warn)':'var(--err)'},
                          {label:'Errors',    val:currentErrors, color:currentErrors===0?'var(--acc)':'var(--err)'},
                        ].map(s=>(
                          <div key={s.label} style={{textAlign:'center'}}>
                            <div style={{fontFamily:"'Fraunces',serif",fontSize:38,fontWeight:700,color:s.color,lineHeight:1}}>{s.val}</div>
                            <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginTop:4,letterSpacing:'.1em',textTransform:'uppercase'}}>{s.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* mini chart: accuracy bar */}
                      <div style={{marginBottom:20,maxWidth:360,margin:'0 auto 20px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>correct chars</span>
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>errors</span>
                        </div>
                        <div style={{height:12,borderRadius:6,overflow:'hidden',display:'flex',
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>
                          <div style={{flex:correctChars,background:'var(--acc)',transition:'flex .5s'}}/>
                          <div style={{flex:currentErrors,background:'var(--err)',transition:'flex .5s'}}/>
                        </div>
                        <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--acc)'}}>{correctChars}</span>
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--err)'}}>{currentErrors}</span>
                        </div>
                      </div>

                      <div style={{display:'flex',gap:8,justifyContent:'center'}}>
                        <button onClick={()=>newTest()}
                          style={{padding:'11px 28px',borderRadius:dark?3:10,border:'none',cursor:'pointer',
                            fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:700,
                            background:'var(--acc)',color:dark?'#060a09':'#fff',
                            boxShadow:dark?'0 0 24px rgba(20,255,180,.3)':'0 4px 16px rgba(13,51,32,.25)'}}>
                          ↺ Try again
                        </button>
                        <button onClick={()=>{setTab('history');}}
                          style={{padding:'11px 22px',borderRadius:dark?3:10,cursor:'pointer',
                            fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:600,background:'transparent',
                            border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',color:'var(--tx2)'}}>
                          View history →
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* keyboard guide */}
                  {phase==='idle'&&(
                    <div style={{padding:'10px 14px',borderRadius:dark?3:8,display:'flex',gap:16,alignItems:'center',
                      border:dark?'1px solid rgba(20,255,180,.07)':'1.5px solid var(--bdr)',
                      background:dark?'rgba(0,0,0,.2)':'rgba(245,251,248,.7)'}}>
                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--tx3)'}}>tips</span>
                      {[['Start typing','begins the timer'],['Backspace','correct mistakes'],['Tab','new test (after done)']].map(([k,v])=>(
                        <div key={k} style={{display:'flex',gap:5,alignItems:'center'}}>
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,padding:'2px 6px',borderRadius:2,
                            border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                            background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)',color:'var(--acc)'}}>{k}</span>
                          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:'var(--txm)'}}>{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══ HISTORY ═══ */}
              {tab==='history'&&(
                <motion.div key="hist" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>
                  {history.length===0?(
                    <div className="panel" style={{padding:'40px',textAlign:'center'}}>
                      <div style={{fontSize:32,marginBottom:12}}>📊</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)',marginBottom:6}}>No results yet</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--txm)'}}>Complete a test to see your history</div>
                    </div>
                  ):(
                    <>
                      {/* summary cards */}
                      <div style={{display:'flex',gap:8}}>
                        {[
                          {label:'Tests taken', val:history.length},
                          {label:'Avg WPM', val:Math.round(history.reduce((a,h)=>a+h.wpm,0)/history.length)},
                          {label:'Best WPM', val:Math.max(...history.map(h=>h.wpm))},
                          {label:'Avg accuracy', val:Math.round(history.reduce((a,h)=>a+h.accuracy,0)/history.length)+'%'},
                        ].map(s=>(
                          <div key={s.label} className="stat-card">
                            <div style={{fontFamily:"'Fraunces',serif",fontSize:28,fontWeight:700,color:'var(--acc)',lineHeight:1,textAlign:'center'}}>{s.val}</div>
                            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:'var(--txm)',textAlign:'center',marginTop:4,textTransform:'uppercase',letterSpacing:'.1em'}}>{s.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* WPM sparkline (last 10) */}
                      <div className="panel" style={{padding:'16px 18px'}}>
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>WPM over time</div>
                        <div style={{display:'flex',alignItems:'flex-end',gap:4,height:60}}>
                          {history.slice(0,20).reverse().map((h,i)=>{
                            const max=Math.max(...history.map(x=>x.wpm),1);
                            const pct=(h.wpm/max)*100;
                            return (
                              <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                                <div style={{width:'100%',borderRadius:'2px 2px 0 0',transition:'height .3s',
                                  height:`${Math.max(4,pct*0.55)}px`,
                                  background:i===history.slice(0,20).length-1?'var(--acc)':'rgba(20,255,180,.35)'}}/>
                                <span style={{fontFamily:"'Fira Code',monospace",fontSize:7,color:'var(--txm)',whiteSpace:'nowrap'}}>{h.wpm}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* history list */}
                      <div className="panel" style={{padding:'16px 18px'}}>
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>All results</div>
                        {history.map((h,i)=>(
                          <div key={i} className="hist-row">
                            <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--txm)',width:18}}>#{i+1}</span>
                            <span style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:700,color:'var(--acc)',width:50}}>{h.wpm}</span>
                            <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',width:24}}>WPM</span>
                            <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:h.accuracy>=95?'var(--acc)':h.accuracy>=80?'var(--warn)':'var(--err)',width:46}}>{h.accuracy}%</span>
                            <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--err)',width:26}}>{h.errors}✗</span>
                            <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--acc4)',width:26}}>{h.duration}s</span>
                            <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',flex:1,textTransform:'capitalize'}}>{h.category}</span>
                            <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--tx3)'}}>{h.date}</span>
                          </div>
                        ))}
                        <button className="gbtn" onClick={()=>setHistory([])} style={{marginTop:8,color:'var(--err)',borderColor:'var(--err)'}}>clear history</button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}

              {/* ═══ GUIDE ═══ */}
              {tab==='guide'&&(
                <motion.div key="guide" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'22px 24px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
                      <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.04)'}}>📖</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--tx)'}}>How to improve your typing speed</div>
                    </div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13.5,lineHeight:1.8,color:'var(--tx2)'}}>
                      <p style={{marginBottom:10}}>Typing speed is measured in WPM (words per minute), where a "word" is conventionally 5 characters including spaces. The average adult types around 40 WPM; touch typists commonly reach 60–80 WPM, and competitive typists exceed 150 WPM.</p>
                      <p style={{marginBottom:10}}>The single biggest lever is <strong style={{color:'var(--tx)'}}>touch typing</strong> — keeping all fingers on the home row (ASDF / JKL;) and never looking at the keyboard. It feels slower at first but unlocks real speed.</p>
                      <p>Accuracy matters more than speed. Chasing raw WPM while making lots of errors trains bad habits. Aim for 95%+ accuracy and let speed come naturally.</p>
                    </div>
                  </div>
                  <div className="panel" style={{padding:'18px 20px'}}>
                    {[
                      ['What is raw WPM vs WPM?','WPM counts only correctly typed characters (÷ 5). Raw WPM counts all keystrokes regardless of errors. The gap between them is how many "words" worth of errors you made.'],
                      ['How is accuracy calculated?','Accuracy = (correct characters ÷ total characters typed) × 100. A missed backspace or extra character counts as an error. The goal is 95%+ for clean, professional typing.'],
                      ['How long should I practice?','15–30 minutes daily beats 2 hours on a Saturday. Short daily sessions build muscle memory faster. Use the 15s mode for quick warm-ups and the 120s mode to test endurance.'],
                      ['Why code mode?','Code requires shifting between letters, symbols, and numbers far more than prose. It\'s excellent for training finger reach and symbol accuracy — skills that directly benefit programming speed.'],
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