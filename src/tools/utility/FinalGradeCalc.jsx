import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   FINAL GRADE CALCULATOR — Document Tools Series #12
   Theme: Dark Void/Neon Teal · Light Cream/Forest
   Fonts: Fraunces · Outfit · Fira Code
   Tabs: Calculate · Scenario Table · Guide
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Outfit',sans-serif}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
@keyframes pop{0%{transform:scale(.82);opacity:0}65%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
@keyframes glow-pulse{0%,100%{box-shadow:0 0 0 0 rgba(20,255,180,.18)}50%{box-shadow:0 0 0 10px rgba(20,255,180,0)}}
@keyframes slide-up{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}
@keyframes bar-grow{from{width:0}to{width:var(--target-w)}}

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

.num-input{font-family:'Fira Code',monospace;font-size:22px;font-weight:500;text-align:center;padding:12px 14px;outline:none;width:100%;transition:border-color .13s,box-shadow .13s;}
.dk .num-input{background:rgba(0,0,0,.5);border:1px solid var(--bdr);border-radius:3px;color:var(--acc);}
.dk .num-input:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(20,255,180,.1);}
.lt .num-input{background:#f5fbf8;border:1.5px solid var(--bdr);border-radius:8px;color:var(--acc);}
.lt .num-input:focus{border-color:var(--acc);}
input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{opacity:.3}

.slider{-webkit-appearance:none;appearance:none;width:100%;height:5px;border-radius:3px;outline:none;cursor:pointer;}
.dk .slider{background:rgba(20,255,180,.12);}
.lt .slider{background:rgba(13,51,32,.12);}
.slider::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:var(--acc);cursor:pointer;box-shadow:0 0 6px rgba(20,255,180,.4);}

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

/* Result hero */
.result-hero{padding:28px 24px;text-align:center;animation:pop .4s cubic-bezier(.34,1.56,.64,1);}
.dk .result-hero{border-radius:4px;}
.lt .result-hero{border-radius:14px;}

/* Step card */
.step-card{display:flex;gap:14px;padding:16px 18px;margin-bottom:10px;}
.dk .step-card{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.25);}
.lt .step-card{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.9);}
.step-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Fira Code',monospace;font-size:11px;font-weight:700;flex-shrink:0;margin-top:2px;}
.dk .step-num{border:1px solid rgba(20,255,180,.3);background:rgba(20,255,180,.08);color:var(--acc);}
.lt .step-num{border:1.5px solid rgba(13,51,32,.25);background:rgba(13,51,32,.06);color:var(--acc);}

/* Formula block */
.formula{font-family:'Fira Code',monospace;padding:10px 14px;border-radius:3px;overflow-x:auto;white-space:nowrap;font-size:13px;margin:8px 0;}
.dk .formula{background:rgba(0,0,0,.5);border-left:2px solid rgba(20,255,180,.3);color:var(--acc);}
.lt .formula{background:rgba(13,51,32,.04);border-left:2.5px solid rgba(13,51,32,.25);color:var(--acc);}

/* Progress arc needle gauge */
.gauge-svg{overflow:visible;}

/* Table cells */
.tc{font-family:'Fira Code',monospace;font-size:11px;padding:7px 10px;text-align:center;}
.dk .tc{border:1px solid var(--bdr);}
.lt .tc{border:1.5px solid var(--bdr);}

.faq{padding:13px 15px;margin-bottom:8px;}
.dk .faq{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.25);}
.lt .faq{border:1.5px solid var(--bdr);border-radius:10px;}
`;

const GRADE_SCALE = [
  {min:93, label:'A',  gpa:'4.0', color:'#14ffb4'},
  {min:90, label:'A−', gpa:'3.7', color:'#14ffb4'},
  {min:87, label:'B+', gpa:'3.3', color:'#a78bfa'},
  {min:83, label:'B',  gpa:'3.0', color:'#a78bfa'},
  {min:80, label:'B−', gpa:'2.7', color:'#a78bfa'},
  {min:77, label:'C+', gpa:'2.3', color:'#fbbf24'},
  {min:73, label:'C',  gpa:'2.0', color:'#fbbf24'},
  {min:70, label:'C−', gpa:'1.7', color:'#fbbf24'},
  {min:60, label:'D',  gpa:'1.0', color:'#fb923c'},
  {min:0,  label:'F',  gpa:'0.0', color:'#ff6b6b'},
];
const getGrade = pct => GRADE_SCALE.find(g=>pct>=g.min)||GRADE_SCALE[GRADE_SCALE.length-1];

const TABS = [
  {id:'calc',  label:'🎓 Calculate'},
  {id:'table', label:'📊 Scenario Table'},
  {id:'guide', label:'? Guide'},
];

/* Semi-circle gauge */
function Gauge({pct, color, dark}) {
  const r = 70, cx = 90, cy = 90;
  const startAngle = Math.PI;
  const endAngle   = 2 * Math.PI;
  const angle = startAngle + (Math.min(Math.max(pct,0),100)/100) * Math.PI;
  const x = cx + r * Math.cos(angle);
  const y = cy + r * Math.sin(angle);
  const circ = Math.PI * r;
  const fill = circ * Math.min(Math.max(pct,0),100) / 100;

  return (
    <svg width={180} height={100} viewBox="0 0 180 100" className="gauge-svg">
      {/* Track */}
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
        fill="none" stroke={dark?'rgba(20,255,180,.08)':'rgba(13,51,32,.08)'} strokeWidth="12" strokeLinecap="round"/>
      {/* Fill */}
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`}
        fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${circ}`} strokeDashoffset={`${circ - fill}`}
        style={{transition:'stroke-dashoffset .7s cubic-bezier(.34,1.2,.64,1),stroke .3s'}}/>
      {/* Needle */}
      <line x1={cx} y1={cy} x2={x} y2={y}
        stroke={color} strokeWidth="2.5" strokeLinecap="round"
        style={{transition:'x2 .7s cubic-bezier(.34,1.2,.64,1),y2 .7s cubic-bezier(.34,1.2,.64,1)'}}/>
      <circle cx={cx} cy={cy} r={5} fill={color}/>
      {/* Labels */}
      <text x={cx-r-4} y={cy+16} fontFamily="'Fira Code',monospace" fontSize="9" fill="var(--txm)" textAnchor="middle">0</text>
      <text x={cx+r+4} y={cy+16} fontFamily="'Fira Code',monospace" fontSize="9" fill="var(--txm)" textAnchor="middle">100</text>
      <text x={cx} y={cy-r-10} fontFamily="'Fira Code',monospace" fontSize="9" fill="var(--txm)" textAnchor="middle">50</text>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function FinalGradeCalc({isDarkMode:ext}={}) {
  const [dark, setDark] = useState(ext!==undefined?ext:true);
  const cls = dark?'dk':'lt';
  const [tab, setTab] = useState('calc');

  const [currentGrade, setCurrentGrade] = useState(85);
  const [targetGrade,  setTargetGrade]  = useState(90);
  const [finalWeight,  setFinalWeight]  = useState(25);

  const result = useMemo(()=>{
    const cg = parseFloat(currentGrade);
    const tg = parseFloat(targetGrade);
    const fw = parseFloat(finalWeight)/100;
    if(isNaN(cg)||isNaN(tg)||isNaN(fw)||fw<=0||fw>=1) return null;
    const required = (tg - cg*(1-fw)) / fw;
    const currentContrib = cg*(1-fw);
    const neededContrib  = tg - currentContrib;
    return {required, cg, tg, fw, currentContrib, neededContrib};
  },[currentGrade, targetGrade, finalWeight]);

  const reqGrade  = result ? getGrade(result.required)  : null;
  const currGrade = result ? getGrade(result.cg)         : null;
  const tgtGrade  = result ? getGrade(result.tg)         : null;

  const status = result
    ? result.required <= 0   ? 'secured'
    : result.required > 100  ? 'impossible'
    : result.required >= 90  ? 'hard'
    : 'achievable'
    : null;

  const statusMeta = {
    secured:    {label:'Already secured!',     color:'var(--acc)',  icon:'🎉'},
    achievable: {label:'Achievable',            color:'var(--acc)',  icon:'✓'},
    hard:       {label:'Challenging but doable',color:'var(--warn)', icon:'⚡'},
    impossible: {label:'Not achievable',        color:'var(--err)',  icon:'✗'},
  }[status] || {};

  /* input field helper */
  const InputField = ({label, value, onChange, min=0, max=100, step=1, hint}) => (
    <div>
      <label className="lbl">{label}</label>
      <div style={{position:'relative'}}>
        <input type="number" className="num-input" value={value}
          onChange={e=>onChange(Math.min(max,Math.max(min,Number(e.target.value))))}
          min={min} max={max} step={step}/>
        {hint&&<div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginTop:4,textAlign:'center'}}>{hint}</div>}
      </div>
      <input type="range" className="slider" value={value} min={min} max={max} step={step}
        onChange={e=>onChange(Number(e.target.value))}
        style={{marginTop:8}}/>
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
              boxShadow:dark?'0 0 16px rgba(20,255,180,.2)':'0 3px 10px rgba(13,51,32,.35)'}}>🎓</div>
            <div>
              <div style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:16,color:'var(--tx)',lineHeight:1}}>
                Final<span style={{color:'var(--acc)'}}>Grade</span>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--tx3)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #12 · final exam score needed · scenario table
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          {result&&(
            <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}}
              style={{display:'flex',alignItems:'center',gap:8,padding:'4px 12px',
                border:dark?`1px solid ${reqGrade.color}44`:'1.5px solid var(--bdr)',
                borderRadius:dark?3:7,background:dark?`${reqGrade.color}09`:'rgba(13,51,32,.04)'}}>
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)'}}>NEED</span>
              <span style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:reqGrade.color,lineHeight:1}}>
                {Math.max(0,result.required).toFixed(1)}%
              </span>
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:reqGrade.color}}>{reqGrade.label}</span>
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
            

            {/* Grade scale reference */}
            <div>
              <div className="slbl">Grade scale</div>
              {GRADE_SCALE.map(g=>(
                <div key={g.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'4px 0',
                  borderBottom:dark?'1px solid rgba(20,255,180,.04)':'1px solid var(--bdr)'}}>
                  <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,fontWeight:700,color:g.color,width:26}}>{g.label}</span>
                  <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>{g.min}%+</span>
                  <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:dark?'rgba(167,139,250,.6)':'#5b21b6'}}>{g.gpa} GPA</span>
                </div>
              ))}
            </div>

            {/* Quick examples */}
            <div>
              <div className="slbl">Quick examples</div>
              {[
                {label:'Need an A',      cg:88, tg:93, fw:30},
                {label:'Need a B',       cg:75, tg:83, fw:40},
                {label:'Just pass',      cg:65, tg:70, fw:50},
                {label:'Heavy final',    cg:72, tg:80, fw:60},
              ].map(ex=>(
                <button key={ex.label} className="gbtn"
                  onClick={()=>{setCurrentGrade(ex.cg);setTargetGrade(ex.tg);setFinalWeight(ex.fw);}}
                  style={{width:'100%',marginBottom:4,justifyContent:'flex-start',fontSize:9}}>{ex.label}</button>
              ))}
            </div>

            {/* Live snapshot */}
            {result&&(
              <div style={{padding:'10px',borderRadius:dark?3:7,
                border:dark?`1px solid ${statusMeta.color}33`:`1.5px solid ${statusMeta.color}44`,
                background:dark?`${statusMeta.color}07`:`${statusMeta.color}0c`}}>
                <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginBottom:6,letterSpacing:'.15em',textTransform:'uppercase'}}>status</div>
                <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:statusMeta.color,marginBottom:3}}>
                  {statusMeta.icon} {statusMeta.label}
                </div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:'var(--tx2)',lineHeight:1.5}}>
                  {status==='secured'    && "Your current grade already exceeds your target."}
                  {status==='achievable' && `A ${result.required.toFixed(1)}% on the final will do it.`}
                  {status==='hard'       && `You'll need a strong ${result.required.toFixed(1)}% — study hard.`}
                  {status==='impossible' && "Score needed exceeds 100% — adjust your target."}
                </div>
              </div>
            )}

            
          </div>

          {/* MAIN */}
          <div className="main">
            

            <AnimatePresence mode="wait">

              {/* ═══ CALCULATE ═══ */}
              {tab==='calc'&&(
                <motion.div key="calc" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>

                  {/* Inputs */}
                  <div className="panel" style={{padding:'20px 22px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:20}}>
                      <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:16,border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',
                        background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)'}}>📊</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>Enter your grades</div>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:18}}>
                      <InputField
                        label="Current grade (%)"
                        value={currentGrade}
                        onChange={setCurrentGrade}
                        hint={currGrade ? `${currGrade.label} · ${currGrade.gpa} GPA` : ''}
                      />
                      <InputField
                        label="Target grade (%)"
                        value={targetGrade}
                        onChange={setTargetGrade}
                        hint={tgtGrade ? `${tgtGrade.label} · ${tgtGrade.gpa} GPA` : ''}
                      />
                      <InputField
                        label="Final exam weight (%)"
                        value={finalWeight}
                        onChange={v=>setFinalWeight(Math.min(99,Math.max(1,v)))}
                        min={1} max={99}
                        hint={`${finalWeight}% of final grade`}
                      />
                    </div>
                  </div>

                  {/* Result hero */}
                  <AnimatePresence mode="wait">
                    {result&&(
                      <motion.div key={`${result.required.toFixed(1)}`} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                        <div className="panel result-hero"
                          style={{border:dark?`1px solid ${statusMeta.color}33`:`1.5px solid ${statusMeta.color}55`}}>

                          {/* Gauge */}
                          <div style={{display:'flex',justifyContent:'center',marginBottom:16}}>
                            <div style={{position:'relative'}}>
                              <Gauge pct={Math.max(0,Math.min(100,result.required))} color={reqGrade.color} dark={dark}/>
                              <div style={{position:'absolute',bottom:0,left:'50%',transform:'translateX(-50%)',textAlign:'center'}}>
                                <div style={{fontFamily:"'Fraunces',serif",fontSize:40,fontWeight:700,color:reqGrade.color,lineHeight:1}}>
                                  {result.required>100?'100+':result.required<=0?'0':result.required.toFixed(1)}%
                                </div>
                                <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginTop:3,letterSpacing:'.15em',textTransform:'uppercase'}}>
                                  required on final
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Status badge */}
                          <div style={{display:'inline-flex',alignItems:'center',gap:7,padding:'5px 14px',borderRadius:20,marginBottom:14,
                            border:dark?`1px solid ${statusMeta.color}44`:`1.5px solid ${statusMeta.color}55`,
                            background:dark?`${statusMeta.color}0e`:`${statusMeta.color}12`}}>
                            <span style={{fontSize:14}}>{statusMeta.icon}</span>
                            <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:statusMeta.color,letterSpacing:'.12em',textTransform:'uppercase'}}>{statusMeta.label}</span>
                          </div>

                          {/* Contribution breakdown */}
                          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',marginBottom:14}}>
                            {[
                              {label:'Current contribution', val:result.currentContrib.toFixed(1)+'pts', color:'var(--tx2)'},
                              {label:'+  Final needed',      val:result.neededContrib.toFixed(1)+'pts',  color:reqGrade.color},
                              {label:'=  Target overall',    val:result.tg+'%',                          color:tgtGrade?.color},
                            ].map(s=>(
                              <div key={s.label} style={{textAlign:'center',padding:'8px 14px',
                                border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                                borderRadius:dark?3:9,background:dark?'rgba(0,0,0,.35)':'rgba(245,251,248,.9)'}}>
                                <div style={{fontFamily:"'Fira Code',monospace",fontSize:16,fontWeight:500,color:s.color,lineHeight:1}}>{s.val}</div>
                                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:'var(--txm)',marginTop:3,letterSpacing:'.08em'}}>{s.label}</div>
                              </div>
                            ))}
                          </div>

                          {/* Proportion bar */}
                          <div style={{maxWidth:440,margin:'0 auto'}}>
                            <div style={{display:'flex',height:12,borderRadius:6,overflow:'hidden',
                              border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>
                              <div style={{flex:(1-result.fw)*100,background:dark?'rgba(20,255,180,.3)':'rgba(13,51,32,.2)',transition:'flex .6s'}}/>
                              <div style={{flex:result.fw*100,background:reqGrade.color,opacity:.8,transition:'flex .6s'}}/>
                            </div>
                            <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
                              <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>
                                Before final ({((1-result.fw)*100).toFixed(0)}%)
                              </span>
                              <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:reqGrade.color}}>
                                Final exam ({(result.fw*100).toFixed(0)}%)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Solution engine */}
                        <div className="panel" style={{padding:'20px 22px',marginTop:14}}>
                          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
                            <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',
                              fontSize:16,border:dark?'1px solid rgba(167,139,250,.3)':'1.5px solid rgba(91,33,182,.2)',
                              background:dark?'rgba(167,139,250,.08)':'rgba(91,33,182,.05)'}}>🧮</div>
                            <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>Solution engine</div>
                          </div>

                          {[
                            {
                              n:1, title:'Set up the weighted grade formula',
                              desc:'Your final grade is the sum of the current grade\'s contribution and the final exam\'s contribution.',
                              formula:`G_target = (G_current × W_before) + (G_final × W_final)`,
                            },
                            {
                              n:2, title:'Rearrange to isolate the final exam score',
                              desc:'Move the current contribution to the right side, then divide by the final exam weight.',
                              formula:`G_final = (G_target − G_current × (1 − W_final)) ÷ W_final`,
                            },
                            {
                              n:3, title:'Substitute your values',
                              desc:'Plug in the numbers and calculate.',
                              formula:`G_final = (${result.tg} − ${result.cg} × ${(1-result.fw).toFixed(2)}) ÷ ${result.fw.toFixed(2)}  =  ${result.required.toFixed(2)}%`,
                            },
                          ].map((step,i,arr)=>(
                            <div key={step.n} style={{display:'flex',gap:0,alignItems:'stretch',marginBottom:i<arr.length-1?0:0}}>
                              {/* connector line */}
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',marginRight:14,flexShrink:0}}>
                                <div className="step-num">{step.n}</div>
                                {i<arr.length-1&&<div style={{flex:1,width:1.5,background:dark?'rgba(20,255,180,.12)':'rgba(13,51,32,.1)',margin:'4px 0'}}/>}
                              </div>
                              <div style={{flex:1,paddingBottom:i<arr.length-1?18:0}}>
                                <div style={{fontFamily:"'Fraunces',serif",fontSize:13.5,fontWeight:700,color:'var(--tx)',marginBottom:4}}>{step.title}</div>
                                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12.5,color:'var(--tx2)',lineHeight:1.6,marginBottom:6}}>{step.desc}</div>
                                <div className="formula">{step.formula}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* ═══ SCENARIO TABLE ═══ */}
              {tab==='table'&&(
                <motion.div key="tbl" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>

                  {/* Matrix: current grade × final weight */}
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)',marginBottom:6}}>
                      Required final score matrix
                    </div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:'var(--txm)',marginBottom:14}}>
                      Score needed on final exam to reach <strong style={{color:'var(--tx)'}}>{targetGrade}%</strong> overall — across different current grades and final exam weights
                    </div>
                    <div style={{overflowX:'auto'}}>
                      <table style={{borderCollapse:'separate',borderSpacing:3}}>
                        <thead>
                          <tr>
                            <th style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',padding:'5px 10px',textAlign:'left',fontWeight:400,whiteSpace:'nowrap'}}>
                              Current → Final wt ↓
                            </th>
                            {[60,65,70,75,80,85,90,95].map(cg=>(
                              <th key={cg} style={{fontFamily:"'Fira Code',monospace",fontSize:9,
                                color:cg===currentGrade?'var(--acc)':'var(--txm)',
                                fontWeight:cg===currentGrade?700:400,
                                padding:'5px 8px',textAlign:'center',
                                background:cg===currentGrade?(dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)'):undefined,
                                borderRadius:2}}>{cg}%</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[15,20,25,30,40,50,60].map(fw=>(
                            <tr key={fw}>
                              <td style={{fontFamily:"'Fira Code',monospace",fontSize:9,
                                color:fw===finalWeight?'var(--acc)':'var(--txm)',
                                fontWeight:fw===finalWeight?700:400,
                                padding:'5px 10px',whiteSpace:'nowrap',
                                background:fw===finalWeight?(dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)'):undefined,
                                borderRadius:2}}>{fw}% final</td>
                              {[60,65,70,75,80,85,90,95].map(cg=>{
                                const req = (targetGrade - cg*(1-fw/100)) / (fw/100);
                                const gi  = getGrade(Math.max(0,req));
                                const isMe = cg===currentGrade && fw===finalWeight;
                                return (
                                  <td key={cg} className="tc"
                                    style={{
                                      color: req>100 ? 'var(--err)' : req<=0 ? 'var(--acc)' : gi.color,
                                      background: isMe ? (dark?`${gi.color}18`:`${gi.color}14`) : (dark?'rgba(0,0,0,.2)':'rgba(245,251,248,.8)'),
                                      borderColor: isMe ? gi.color : (dark?'var(--bdr)':'var(--bdr)'),
                                      borderWidth: isMe ? (dark?'1px':'1.5px') : undefined,
                                      borderRadius:3,fontWeight:isMe?700:400,
                                    }}>
                                    {req>100?'100+':req<=0?'✓':req.toFixed(0)+'%'}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--tx3)',marginTop:10}}>
                      Highlighted cell = your current settings · ✓ = already achieved · 100+ = not achievable · target = {targetGrade}%
                    </div>
                  </div>

                  {/* What-if: vary target */}
                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>
                      Required score by target grade — at {finalWeight}% final weight, {currentGrade}% current
                    </div>
                    {GRADE_SCALE.map(g=>{
                      const req = (g.min - currentGrade*(1-finalWeight/100)) / (finalWeight/100);
                      return (
                        <div key={g.label} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 10px',marginBottom:4,
                          borderRadius:dark?3:8,
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          background:g.min===Math.floor(targetGrade)?(dark?`${g.color}0e`:`${g.color}0c`):'transparent'}}>
                          <div style={{width:30,height:30,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                            fontFamily:"'Fraunces',serif",fontSize:13,fontWeight:700,color:g.color,
                            border:`1.5px solid ${g.color}55`,background:`${g.color}12`,flexShrink:0}}>
                            {g.label}
                          </div>
                          <div style={{flex:1}}>
                            <div style={{height:5,borderRadius:3,overflow:'hidden',background:dark?'rgba(255,255,255,.05)':'rgba(0,0,0,.06)'}}>
                              <div style={{height:'100%',borderRadius:3,background:g.color,
                                width:`${Math.max(0,Math.min(100,req))}%`,transition:'width .5s'}}/>
                            </div>
                          </div>
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,width:70,textAlign:'right',
                            color:req>100?'var(--err)':req<=0?'var(--acc)':g.color}}>
                            {req>100?'impossible':req<=0?'secured':req.toFixed(1)+'%'}
                          </span>
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',width:55,textAlign:'right'}}>{g.min}%+ overall</span>
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
                      <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:18,border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',
                        background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.04)'}}>📖</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--tx)'}}>
                        Final exam strategy: calculating what you need
                      </div>
                    </div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13.5,lineHeight:1.8,color:'var(--tx2)'}}>
                      <p style={{marginBottom:10}}>The final exam season is stressful, but the maths is simple. Your overall grade is a weighted average — your current grade contributes <em>(1 − final weight)</em> of the total, and your final exam contributes the rest.</p>
                      <p>Rearranging: <strong style={{color:'var(--tx)',fontFamily:"'Fira Code',monospace",fontSize:12}}>required = (target − current × (1 − weight)) ÷ weight</strong>. That's the whole formula. The scenario table helps you explore the tradeoffs without doing any maths manually.</p>
                    </div>
                  </div>
                  <div className="panel" style={{padding:'18px 20px'}}>
                    {[
                      ['What does "current grade" mean exactly?','It means your grade before the final exam — the weighted average of all assignments, quizzes, midterms, and any other assessed work you have already completed.'],
                      ['What if the required score is over 100%?','It means your target is mathematically unachievable given your current grade and the remaining weight. You would need to lower your target or check whether any grade recovery options (extra credit, grade substitution) are available.'],
                      ['What if the required score is 0 or negative?','Great news — your target is already secured. Even scoring zero on the final would still result in a grade at or above your target. You can use this to calibrate how much revision effort to invest.'],
                      ['How does final exam weight affect the strategy?','The higher the final exam weight, the more a strong performance can rescue a weak semester — and the more a poor performance can damage a strong one. A 50% final is a double-edged sword; a 15% final barely moves the needle.'],
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