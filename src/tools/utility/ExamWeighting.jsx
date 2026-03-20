import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   EXAM WEIGHTING CALCULATOR — Document Tools Series #11
   Theme: Dark Void/Neon Teal · Light Cream/Forest
   Fonts: Fraunces · Outfit · Fira Code
   Tabs: Calculate · Scenarios · Guide
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Outfit',sans-serif}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
@keyframes pop{0%{transform:scale(.85);opacity:0}65%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
@keyframes grade-in{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}}
@keyframes bar-grow{from{width:0}to{width:var(--w)}}

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

.body{display:grid;grid-template-columns: 1fr;min-height:calc(100vh - 86px);}
@media(min-width:1024px){.body{grid-template-columns: 220px 1fr !important;}}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:18px 24px;display:flex;flex-direction:column;gap:16px;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(13,51,32,.06);}

.fi{width:100%;outline:none;font-family:'Outfit',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;cursor:pointer;}
.dk .fi{background:rgba(0,0,0,.4);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(20,255,180,.08);}
.lt .fi{background:#f5fbf8;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);}

.num-input{font-family:'Fira Code',monospace;font-size:14px;text-align:right;padding:7px 10px;outline:none;width:100%;transition:all .13s;}
.dk .num-input{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:3px;color:var(--acc);}
.dk .num-input:focus{border-color:var(--acc);}
.lt .num-input{background:#f5fbf8;border:1.5px solid var(--bdr);border-radius:7px;color:var(--acc);}
.lt .num-input:focus{border-color:var(--acc);}

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

/* Component row */
.comp-row{display:grid;grid-template-columns:1fr 90px 90px 90px 32px;gap:8px;align-items:center;padding:10px 12px;margin-bottom:6px;transition:border-color .13s;}
.dk .comp-row{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.25);}
.lt .comp-row{border:1.5px solid var(--bdr);border-radius:9px;background:rgba(245,251,248,.9);}
.dk .comp-row:hover{border-color:rgba(20,255,180,.25);}
.lt .comp-row:hover{border-color:var(--acc);}

/* Grade badge */
.grade-badge{display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;font-family:'Fraunces',serif;font-size:20px;font-weight:700;flex-shrink:0;animation:pop .35s cubic-bezier(.34,1.56,.64,1);}

/* Donut */
.donut-ring{transform:rotate(-90deg);}

/* Progress bar */
.prog-bar{height:8px;border-radius:4px;transition:width .5s cubic-bezier(.34,1.2,.64,1);}

/* Scenario card */
.scene-card{padding:14px 14px;cursor:pointer;transition:border-color .13s;}
.dk .scene-card{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.25);}
.lt .scene-card{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.9);}
.dk .scene-card:hover{border-color:rgba(20,255,180,.3);}
.lt .scene-card:hover{border-color:var(--acc);}
.dk .scene-card.active{border-color:var(--acc);background:rgba(20,255,180,.04);}
.lt .scene-card.active{border-color:var(--acc);background:rgba(13,51,32,.03);}

.faq{padding:13px 15px;margin-bottom:8px;}
.dk .faq{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.25);}
.lt .faq{border:1.5px solid var(--bdr);border-radius:10px;}
`;

/* ── grade boundaries ── */
const GRADE_SCALES = {
  'Letter (US)': [
    {min:93,label:'A',  color:'#14ffb4'},
    {min:90,label:'A−', color:'#14ffb4'},
    {min:87,label:'B+', color:'#a78bfa'},
    {min:83,label:'B',  color:'#a78bfa'},
    {min:80,label:'B−', color:'#a78bfa'},
    {min:77,label:'C+', color:'#fbbf24'},
    {min:73,label:'C',  color:'#fbbf24'},
    {min:70,label:'C−', color:'#fbbf24'},
    {min:67,label:'D+', color:'#fb923c'},
    {min:60,label:'D',  color:'#fb923c'},
    {min:0, label:'F',  color:'#ff6b6b'},
  ],
  'Percentage': [
    {min:80,label:'Distinction', color:'#14ffb4'},
    {min:70,label:'Merit',       color:'#a78bfa'},
    {min:60,label:'Pass',        color:'#fbbf24'},
    {min:0, label:'Fail',        color:'#ff6b6b'},
  ],
  'GPA (4.0)': [
    {min:93,label:'4.0',color:'#14ffb4'},
    {min:90,label:'3.7',color:'#14ffb4'},
    {min:87,label:'3.3',color:'#a78bfa'},
    {min:83,label:'3.0',color:'#a78bfa'},
    {min:80,label:'2.7',color:'#a78bfa'},
    {min:77,label:'2.3',color:'#fbbf24'},
    {min:73,label:'2.0',color:'#fbbf24'},
    {min:70,label:'1.7',color:'#fbbf24'},
    {min:67,label:'1.3',color:'#fb923c'},
    {min:60,label:'1.0',color:'#fb923c'},
    {min:0, label:'0.0',color:'#ff6b6b'},
  ],
};

const getGrade = (pct, scale) => {
  const s = GRADE_SCALES[scale];
  return s.find(g => pct >= g.min) || s[s.length-1];
};

const PRESETS = {
  'University exam': [
    {name:'Coursework 1', weight:20, score:'', max:100},
    {name:'Coursework 2', weight:20, score:'', max:100},
    {name:'Midterm exam',  weight:20, score:'', max:100},
    {name:'Final exam',    weight:40, score:'', max:100},
  ],
  'High school': [
    {name:'Homework',    weight:15, score:'', max:100},
    {name:'Quizzes',     weight:15, score:'', max:100},
    {name:'Midterm',     weight:30, score:'', max:100},
    {name:'Final exam',  weight:40, score:'', max:100},
  ],
  'Lab course': [
    {name:'Lab reports', weight:25, score:'', max:100},
    {name:'Practical',   weight:25, score:'', max:100},
    {name:'Written exam',weight:50, score:'', max:100},
  ],
  'Project-based': [
    {name:'Proposal',    weight:10, score:'', max:100},
    {name:'Prototype',   weight:20, score:'', max:100},
    {name:'Presentation',weight:20, score:'', max:100},
    {name:'Final report',weight:50, score:'', max:100},
  ],
};

let nextId = 1;
const mkComp = (overrides={}) => ({
  id: nextId++,
  name: 'Component',
  weight: 25,
  score: '',
  max: 100,
  ...overrides,
});

const TABS = [
  {id:'calc',      label:'🎓 Calculate'},
  {id:'scenarios', label:'🔮 Scenarios'},
  {id:'guide',     label:'? Guide'},
];

/* ════════════════════════════════════════════════════════════ */
export default function ExamWeightingCalculator({isDarkMode:ext}={}) {
  const [dark, setDark]       = useState(ext!==undefined?ext:true);
  const cls = dark?'dk':'lt';
  const [tab, setTab]         = useState('calc');
  const [gradeScale, setGradeScale] = useState('Letter (US)');
  const [components, setComponents] = useState([
    mkComp({name:'Assignment',  weight:20, score:'', max:100}),
    mkComp({name:'Midterm',     weight:30, score:'', max:100}),
    mkComp({name:'Final exam',  weight:50, score:'', max:100}),
  ]);

  /* ── What-if: target score needed ── */
  const [targetGrade, setTargetGrade] = useState(80);

  /* ── derived ── */
  const totalWeight = useMemo(()=>components.reduce((s,c)=>s+Number(c.weight||0),0),[components]);
  const weightOk    = Math.abs(totalWeight-100)<0.001;

  const scored = components.filter(c=>c.score!==''&&!isNaN(Number(c.score)));
  const weightedSoFar = scored.reduce((s,c)=>s+Number(c.weight||0),0);

  const result = useMemo(()=>{
    if(scored.length===0) return null;
    const weightedSum = scored.reduce((s,c)=>{
      const pct=(Number(c.score)/Number(c.max||100))*100;
      return s+pct*(Number(c.weight)/100);
    },0);
    // scale to 100 if not all components scored
    const scaledPct = weightedSum*(100/Math.max(weightedSoFar,1));
    const rawPct    = weightedSum; // raw weighted average
    return {rawPct, scaledPct, weightedSoFar};
  },[scored,weightedSoFar]);

  /* what score needed on remaining for target */
  const needed = useMemo(()=>{
    const remaining = components.filter(c=>c.score===''||isNaN(Number(c.score)));
    const remainWeight = remaining.reduce((s,c)=>s+Number(c.weight||0),0);
    if(remainWeight===0||!result) return null;
    const achieved = result.rawPct; // weighted points earned so far
    const need = (targetGrade - achieved) / (remainWeight/100);
    return {need: Math.round(need*10)/10, remainWeight};
  },[result, components, targetGrade]);

  /* ── update helpers ── */
  const upd = (id,field,val) => setComponents(cs=>cs.map(c=>c.id===id?{...c,[field]:val}:c));
  const del = (id) => setComponents(cs=>cs.filter(c=>c.id!==id));
  const add = () => setComponents(cs=>[...cs,mkComp({name:`Component ${cs.length+1}`,weight:0})]);

  const loadPreset = (name) => {
    setComponents(PRESETS[name].map(p=>mkComp(p)));
  };

  const gradeInfo = result ? getGrade(result.rawPct, gradeScale) : null;

  /* ── Donut chart ── */
  const Donut = ({pct, size=100}) => {
    const r=36, circ=2*Math.PI*r;
    const fill = circ*(1-pct/100);
    const color = result ? getGrade(pct, gradeScale).color : 'var(--txm)';
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="donut-ring">
        <circle cx="50" cy="50" r={r} fill="none" stroke={dark?'rgba(20,255,180,.08)':'rgba(13,51,32,.08)'} strokeWidth="10"/>
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={fill} strokeLinecap="round"
          style={{transition:'stroke-dashoffset .6s cubic-bezier(.34,1.2,.64,1),stroke .3s'}}/>
      </svg>
    );
  };

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
              boxShadow:dark?'0 0 16px rgba(20,255,180,.2)':'0 3px 10px rgba(13,51,32,.35)'}}>🎓</div>
            <div>
              <div style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:16,color:'var(--tx)',lineHeight:1}}>
                Exam<span style={{color:'var(--acc)'}}>Weighting</span>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--tx3)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #11 · weighted grades · what-if · scenarios
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          {result&&(
            <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
              style={{display:'flex',alignItems:'center',gap:8,padding:'4px 12px',
                border:dark?`1px solid rgba(20,255,180,.2)`:'1.5px solid var(--bdr)',
                borderRadius:dark?3:7,background:dark?'rgba(20,255,180,.05)':'rgba(13,51,32,.04)'}}>
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)'}}>CURRENT</span>
              <span style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:gradeInfo?.color||'var(--acc)',lineHeight:1}}>
                {result.rawPct.toFixed(1)}%
              </span>
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:gradeInfo?.color||'var(--acc)'}}>{gradeInfo?.label}</span>
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
            

            {/* Grade scale */}
            <div>
              <div className="slbl">Grade scale</div>
              {Object.keys(GRADE_SCALES).map(s=>(
                <button key={s} className={`gbtn${gradeScale===s?' on':''}`}
                  onClick={()=>setGradeScale(s)}
                  style={{width:'100%',marginBottom:4,justifyContent:'flex-start'}}>{s}</button>
              ))}
            </div>

            {/* Presets */}
            <div>
              <div className="slbl">Load preset</div>
              {Object.keys(PRESETS).map(p=>(
                <button key={p} className="gbtn"
                  onClick={()=>loadPreset(p)}
                  style={{width:'100%',marginBottom:4,justifyContent:'flex-start',fontSize:9}}>{p}</button>
              ))}
            </div>

            {/* Weight check */}
            <div style={{padding:'9px 10px',borderRadius:dark?3:7,
              border:dark?`1px solid ${weightOk?'rgba(20,255,180,.25)':'rgba(255,107,107,.3)'}`:`1.5px solid ${weightOk?'rgba(13,51,32,.25)':'rgba(153,27,27,.3)'}`,
              background:dark?`rgba(${weightOk?'20,255,180':'255,107,107'},.04)`:`rgba(${weightOk?'13,51,32':'153,27,27'},.04)`}}>
              <div className="slbl" style={{marginBottom:4}}>Weight total</div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:22,fontWeight:500,color:weightOk?'var(--acc)':'var(--err)',lineHeight:1}}>
                {totalWeight.toFixed(1)}%
              </div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:weightOk?'var(--tx2)':'var(--err)',marginTop:3}}>
                {weightOk?'✓ weights sum to 100':totalWeight>100?`${(totalWeight-100).toFixed(1)}% over`:`${(100-totalWeight).toFixed(1)}% remaining`}
              </div>
            </div>

            {/* Grade scale legend */}
            <div>
              <div className="slbl">Grade key</div>
              {GRADE_SCALES[gradeScale].slice(0,6).map(g=>(
                <div key={g.label} style={{display:'flex',justifyContent:'space-between',padding:'3px 0',borderBottom:dark?'1px solid rgba(20,255,180,.04)':'1px solid var(--bdr)'}}>
                  <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:g.color,fontWeight:600}}>{g.label}</span>
                  <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>{g.min}%+</span>
                </div>
              ))}
            </div>

            
          </div>

          {/* MAIN */}
          <div className="main">
            

            <AnimatePresence mode="wait">

              {/* ═══ CALCULATE ═══ */}
              {tab==='calc'&&(
                <motion.div key="calc" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>

                  {/* Component table */}
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
                      <div style={{display:'flex',alignItems:'center',gap:9}}>
                        <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)'}}>📋</div>
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>Course components</div>
                      </div>
                      <button className="gbtn" onClick={add} style={{color:'var(--acc)',borderColor:'rgba(20,255,180,.3)'}}>+ add component</button>
                    </div>

                    {/* Column headers */}
                    <div style={{display:'grid',gridTemplateColumns:'1fr 90px 90px 90px 32px',gap:8,padding:'0 12px 8px',marginBottom:4}}>
                      {['Component','Weight %','Score','Max',''].map(h=>(
                        <div key={h} className="slbl" style={{margin:0,textAlign:h==='Score'||h==='Max'||h==='Weight %'?'right':'left'}}>{h}</div>
                      ))}
                    </div>

                    <AnimatePresence>
                      {components.map((c,i)=>{
                        const pct = c.score!==''&&!isNaN(Number(c.score)) ? (Number(c.score)/Number(c.max||100))*100 : null;
                        const gInfo = pct!==null ? getGrade(pct,gradeScale) : null;
                        return (
                          <motion.div key={c.id} initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0,x:20}}
                            className="comp-row">
                            {/* Name */}
                            <input className="fi" value={c.name} onChange={e=>upd(c.id,'name',e.target.value)}
                              style={{padding:'6px 9px',fontSize:12}}/>
                            {/* Weight */}
                            <input type="number" className="num-input" value={c.weight} min={0} max={100}
                              onChange={e=>upd(c.id,'weight',e.target.value)}/>
                            {/* Score */}
                            <input type="number" className="num-input" value={c.score} min={0}
                              placeholder="—"
                              onChange={e=>upd(c.id,'score',e.target.value)}
                              style={{color:gInfo?.color||'var(--txm)'}}/>
                            {/* Max */}
                            <input type="number" className="num-input" value={c.max} min={1}
                              onChange={e=>upd(c.id,'max',e.target.value)}
                              style={{color:'var(--txm)'}}/>
                            {/* Delete */}
                            <button onClick={()=>del(c.id)}
                              style={{width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',
                                border:'none',background:'transparent',cursor:'pointer',
                                color:'var(--err)',fontSize:14,borderRadius:3,opacity:.5}}
                              onMouseEnter={e=>e.currentTarget.style.opacity='1'}
                              onMouseLeave={e=>e.currentTarget.style.opacity='.5'}>✕</button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Result */}
                  <AnimatePresence mode="wait">
                    {result?(
                      <motion.div key="res" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                        style={{display:'flex',flexDirection:'column',gap:12}}>

                        {/* Hero result */}
                        <div className="panel" style={{padding:'22px 20px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:24,flexWrap:'wrap'}}>
                            {/* Donut */}
                            <div style={{position:'relative',width:100,height:100,flexShrink:0}}>
                              <Donut pct={result.rawPct} size={100}/>
                              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:1}}>
                                <span style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:700,color:gradeInfo?.color,lineHeight:1}}>{gradeInfo?.label}</span>
                                <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--txm)'}}>{result.rawPct.toFixed(1)}%</span>
                              </div>
                            </div>

                            {/* Breakdown */}
                            <div style={{flex:1,minWidth:200}}>
                              <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:8}}>
                                weighted average · {result.weightedSoFar}% of course graded
                              </div>
                              <div style={{fontFamily:"'Fraunces',serif",fontSize:42,fontWeight:700,color:gradeInfo?.color,lineHeight:1,marginBottom:8}}>
                                {result.rawPct.toFixed(2)}%
                              </div>
                              {/* per-component bars */}
                              {scored.map(c=>{
                                const pct=(Number(c.score)/Number(c.max||100))*100;
                                const gi=getGrade(pct,gradeScale);
                                const contrib=pct*(Number(c.weight)/100);
                                return (
                                  <div key={c.id} style={{marginBottom:7}}>
                                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                                      <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'var(--tx2)'}}>{c.name}</span>
                                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:gi.color}}>
                                        {pct.toFixed(1)}% × {c.weight}w = <strong>{contrib.toFixed(1)}</strong>pts
                                      </span>
                                    </div>
                                    <div style={{height:5,borderRadius:3,background:dark?'rgba(20,255,180,.08)':'rgba(13,51,32,.08)',overflow:'hidden'}}>
                                      <div className="prog-bar" style={{width:`${pct}%`,background:gi.color,height:'100%'}}/>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* What-if: needed score */}
                        <div className="panel" style={{padding:'18px 20px'}}>
                          <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:14}}>
                            🔮 What score do I need?
                          </div>
                          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14,flexWrap:'wrap'}}>
                            <div style={{display:'flex',alignItems:'center',gap:8}}>
                              <span style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)'}}>Target grade:</span>
                              <input type="number" min={0} max={100} value={targetGrade}
                                onChange={e=>setTargetGrade(Number(e.target.value))}
                                className="num-input" style={{width:70}}/>
                              <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--txm)'}}>%</span>
                            </div>
                            <div style={{display:'flex',gap:5}}>
                              {[50,60,70,80,90].map(t=>(
                                <button key={t} className={`gbtn${targetGrade===t?' on':''}`}
                                  onClick={()=>setTargetGrade(t)} style={{padding:'4px 9px'}}>{t}%</button>
                              ))}
                            </div>
                          </div>
                          {needed?(
                            <AnimatePresence mode="wait">
                              <motion.div key={needed.need} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
                                style={{padding:'14px 16px',borderRadius:dark?3:9,
                                  border:dark?`1px solid ${needed.need>100?'rgba(255,107,107,.3)':needed.need<0?'rgba(20,255,180,.3)':'rgba(20,255,180,.2)'}`:
                                    `1.5px solid ${needed.need>100?'rgba(153,27,27,.3)':'rgba(13,51,32,.2)'}`,
                                  background:dark?`rgba(${needed.need>100?'255,107,107':needed.need<0?'20,255,180':'20,255,180'},.04)`:`rgba(13,51,32,.03)`}}>
                                {needed.need<0?(
                                  <div>
                                    <div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:700,color:'var(--acc)',marginBottom:4}}>
                                      🎉 Already achieved!
                                    </div>
                                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)'}}>
                                      You have already exceeded your target of {targetGrade}% based on grades entered so far.
                                    </div>
                                  </div>
                                ):needed.need>100?(
                                  <div>
                                    <div style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:700,color:'var(--err)',marginBottom:4}}>
                                      Not achievable
                                    </div>
                                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)'}}>
                                      You would need <strong style={{color:'var(--err)'}}>{needed.need}%</strong> on the remaining {needed.remainWeight}% of the course — higher than the maximum possible.
                                    </div>
                                  </div>
                                ):(
                                  <div>
                                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginBottom:4,letterSpacing:'.15em',textTransform:'uppercase'}}>
                                      Needed on remaining {needed.remainWeight}% of course
                                    </div>
                                    <div style={{fontFamily:"'Fraunces',serif",fontSize:36,fontWeight:700,color:'var(--acc)',lineHeight:1,marginBottom:4}}>
                                      {needed.need}%
                                    </div>
                                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:'var(--tx2)'}}>
                                      Average score needed across all ungraded components to reach {targetGrade}%.
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            </AnimatePresence>
                          ):(
                            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:'var(--txm)'}}>
                              All components graded — no remaining work to calculate.
                            </div>
                          )}
                        </div>

                      </motion.div>
                    ):(
                      <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}}
                        className="panel" style={{padding:'50px 20px',textAlign:'center'}}>
                        <div style={{fontSize:36,marginBottom:12,opacity:.4}}>🎓</div>
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)',marginBottom:6}}>Enter your scores above</div>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--txm)'}}>Fill in at least one score to see your weighted grade</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* ═══ SCENARIOS ═══ */}
              {tab==='scenarios'&&(
                <motion.div key="sc" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>

                  {/* Grade outcome matrix */}
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)',marginBottom:6}}>
                      Grade outcome matrix
                    </div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:'var(--txm)',marginBottom:14}}>
                      What final grade you'd get for each combination of final exam score vs current average
                    </div>
                    {(()=>{
                      const finalComp = components.find(c=>c.name.toLowerCase().includes('final'));
                      const finalWeight = finalComp ? Number(finalComp.weight) : 40;
                      const otherWeightedSum = scored
                        .filter(c=>c.id!==finalComp?.id)
                        .reduce((s,c)=>s+(Number(c.score)/Number(c.max||100))*100*(Number(c.weight)/100),0);
                      const scores=[40,50,60,70,75,80,85,90,95,100];
                      return (
                        <div style={{overflowX:'auto'}}>
                          <table style={{width:'100%',borderCollapse:'separate',borderSpacing:3}}>
                            <thead>
                              <tr>
                                <th style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',padding:'4px 8px',textAlign:'left',fontWeight:400}}>
                                  Final score →
                                </th>
                                {scores.map(s=>(
                                  <th key={s} style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',padding:'4px 6px',textAlign:'center',fontWeight:400}}>{s}%</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'var(--tx2)',padding:'6px 8px'}}>Grade</td>
                                {scores.map(s=>{
                                  const total = otherWeightedSum + s*(finalWeight/100);
                                  const gi = getGrade(total, gradeScale);
                                  return (
                                    <td key={s} style={{fontFamily:"'Fira Code',monospace",fontSize:11,fontWeight:700,padding:'6px 6px',textAlign:'center',
                                      borderRadius:3,background:dark?`${gi.color}18`:`${gi.color}22`,color:gi.color}}>
                                      {gi.label}
                                    </td>
                                  );
                                })}
                              </tr>
                              <tr>
                                <td style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'var(--tx2)',padding:'6px 8px'}}>Overall %</td>
                                {scores.map(s=>{
                                  const total = otherWeightedSum + s*(finalWeight/100);
                                  return (
                                    <td key={s} style={{fontFamily:"'Fira Code',monospace",fontSize:10,padding:'6px 6px',textAlign:'center',color:'var(--txm)'}}>
                                      {total.toFixed(1)}
                                    </td>
                                  );
                                })}
                              </tr>
                            </tbody>
                          </table>
                          <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--tx3)',marginTop:8}}>
                            Based on {finalWeight}% final exam weight · other scored components contribute {otherWeightedSum.toFixed(1)} weighted points
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Grade boundary table */}
                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>
                      Grade boundaries — {gradeScale}
                    </div>
                    {GRADE_SCALES[gradeScale].map((g,i,arr)=>{
                      const max = i===0 ? 100 : arr[i-1].min-0.01;
                      const current = result?.rawPct;
                      const isActive = current!==undefined && current>=g.min && (i===0||current<arr[i-1].min);
                      return (
                        <div key={g.label} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',marginBottom:4,
                          borderRadius:dark?3:8,
                          border:isActive?(dark?`1px solid ${g.color}`:`1.5px solid ${g.color}`):(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                          background:isActive?(dark?`${g.color}12`:`${g.color}10`):'transparent'}}>
                          <div style={{width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                            fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:g.color,
                            border:dark?`1px solid ${g.color}44`:`1.5px solid ${g.color}66`,
                            background:dark?`${g.color}12`:`${g.color}0e`}}>
                            {g.label}
                          </div>
                          <div style={{flex:1}}>
                            <div style={{height:6,borderRadius:3,background:dark?'rgba(255,255,255,.05)':'rgba(0,0,0,.06)',overflow:'hidden'}}>
                              <div style={{width:`${max}%`,height:'100%',borderRadius:3,background:`${g.color}55`}}/>
                            </div>
                          </div>
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:g.color,width:80,textAlign:'right'}}>
                            {g.min}% – {max.toFixed(0)}%
                          </span>
                          {isActive&&<span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:g.color,background:`${g.color}15`,padding:'2px 6px',borderRadius:2}}>← you</span>}
                        </div>
                      );
                    })}
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
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--tx)'}}>How weighted grades work</div>
                    </div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13.5,lineHeight:1.8,color:'var(--tx2)'}}>
                      <p style={{marginBottom:10}}>A weighted grade system assigns each course component a percentage of the total grade. A final exam worth 40% contributes up to 40 percentage points to your overall score, while a 20% assignment contributes up to 20.</p>
                      <p>The formula is: <strong style={{color:'var(--tx)',fontFamily:"'Fira Code',monospace",fontSize:12}}>Overall = Σ (score/max × weight)</strong>. If you score 80% on a component worth 25% of the course, it contributes 20 weighted points (80 × 0.25).</p>
                    </div>
                  </div>
                  <div className="panel" style={{padding:'18px 20px'}}>
                    {[
                      ['Why do weights need to sum to 100?','Each component\'s weight is its share of the final grade. If they don\'t sum to 100%, the grade isn\'t a true percentage of the total course — it may be over- or under-inflated. The weight indicator in the sidebar turns red if your weights are off.'],
                      ['How does the "what score do I need?" work?','It subtracts your weighted points earned so far from your target grade, then divides by the remaining weight. E.g. if you need 80% overall, have 45 weighted points, and have 40% of the course left: need = (80−45)/0.4 = 87.5%.'],
                      ['What does the grade outcome matrix show?','It holds all your current scores fixed and varies only the final exam score across a range, showing what overall grade you\'d achieve at each level. It lets you quickly see the minimum final exam score needed for each grade band.'],
                      ['What is Raw WPM vs Net WPM here?','There is no WPM here — this is the grade calculator! But in the same spirit: "weighted points earned" is your raw contribution, and your "scaled" grade adjusts for the fact that not all components have been graded yet.'],
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