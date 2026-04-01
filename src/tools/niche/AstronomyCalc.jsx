import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   ASTRONOMY CALCULATOR  — Document Tools Series #6
   Theme: Dark Void/Neon Teal · Light Cream/Forest
   Fonts: Fraunces · Outfit · Fira Code
   Calculators: Distance · Light Travel · Planet Weight · Orbital Period · Star Luminosity
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Outfit',sans-serif}

@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(20,255,180,.2)}50%{box-shadow:0 0 0 8px rgba(20,255,180,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
@keyframes twinkle{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.6)}}
@keyframes orbit{from{transform:rotate(0deg) translateX(38px) rotate(0deg)}to{transform:rotate(360deg) translateX(38px) rotate(-360deg)}}
@keyframes fadeup{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}

.dk{
  --bg:#060a09;--s1:#0a0f0d;--s2:#0f1612;--s3:#141d18;
  --bdr:#1a2820;
  --acc:#14ffb4;--acc2:#00e5a0;--acc4:#a78bfa;
  --err:#ff6b6b;--warn:#fbbf24;
  --tx:#e8fff8;--tx2:#8ecfb8;--tx3:#1a3d2c;--txm:#3d7a62;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 80% 40% at 50% -10%,rgba(20,255,180,.05),transparent),
    radial-gradient(ellipse 40% 60% at 95% 80%,rgba(167,139,250,.06),transparent),
    radial-gradient(ellipse 30% 40% at 5% 60%,rgba(0,229,160,.03),transparent);
}
.lt{
  --bg:#f5fbf8;--s1:#ffffff;--s2:#ecf7f1;--s3:#dff0e8;
  --bdr:#b8ddc8;
  --acc:#0d3320;--acc2:#1a5c38;--acc4:#5b21b6;
  --err:#991b1b;--warn:#92400e;
  --tx:#071810;--tx2:#1a5c38;--tx3:#a7d4bc;--txm:#2d6e4a;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(13,51,32,.05),transparent);
}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(6,10,9,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(245,251,248,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(13,51,32,.07);}
.scanline{position:fixed;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(20,255,180,.3),transparent);animation:scan 4s linear infinite;pointer-events:none;z-index:999;}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 15px;border:none;cursor:pointer;background:transparent;border-bottom:2.5px solid transparent;
  font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;letter-spacing:.04em;
  display:flex;align-items:center;gap:6px;white-space:nowrap;transition:all .15s;}
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
.main{padding:18px 22px;display:flex;flex-direction:column;gap:16px;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(13,51,32,.06);}

.fi{width:100%;outline:none;font-family:'Outfit',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;}
.dk .fi{background:rgba(0,0,0,.4);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(20,255,180,.1);}
.lt .fi{background:#f5fbf8;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(13,51,32,.09);}
.fi::placeholder{opacity:.3;}
select.fi{cursor:pointer;}

input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;}
.dk input[type=range]{background:rgba(20,255,180,.12);}
.lt input[type=range]{background:rgba(13,51,32,.12);}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:50%;cursor:pointer;}
.dk input[type=range]::-webkit-slider-thumb{background:var(--acc);box-shadow:0 0 7px rgba(20,255,180,.5);}
.lt input[type=range]::-webkit-slider-thumb{background:var(--acc);}

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

.result-card{padding:20px 22px;}
.dk .result-card{border:1px solid rgba(20,255,180,.22);border-radius:4px;background:rgba(20,255,180,.04);}
.lt .result-card{border:1.5px solid rgba(13,51,32,.18);border-radius:12px;background:rgba(13,51,32,.03);}

.sb{padding:11px 13px;flex:1;text-align:center;}
.dk .sb{border:1px solid var(--bdr);border-radius:3px;background:rgba(0,0,0,.3);}
.lt .sb{border:1.5px solid var(--bdr);border-radius:9px;background:rgba(245,251,248,.9);}

.formula{font-family:'Fira Code',monospace;font-size:12px;padding:9px 13px;border-radius:3px;margin-top:7px;line-height:1.7;white-space:pre-wrap;}
.dk .formula{background:rgba(0,0,0,.5);border:1px solid rgba(20,255,180,.1);color:#7dffce;}
.lt .formula{background:#e8f7ee;border:1.5px solid rgba(13,51,32,.12);color:#0d3320;border-radius:8px;}

.step-card{display:flex;gap:13px;padding:13px 15px;margin-bottom:9px;position:relative;}
.dk .step-card{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.22);}
.dk .step-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--acc);border-radius:2px 0 0 2px;opacity:.4;}
.lt .step-card{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.7);}
.step-num{width:27px;height:27px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'Fira Code',monospace;font-size:11px;flex-shrink:0;margin-top:1px;}
.dk .step-num{border:1px solid rgba(20,255,180,.3);background:rgba(20,255,180,.06);color:var(--acc);}
.lt .step-num{border:1.5px solid rgba(13,51,32,.3);background:rgba(13,51,32,.06);color:var(--acc);}

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

/* ══ constants ══ */
const C   = 299792458;       // m/s
const AU  = 1.496e11;        // metres
const LY  = 9.461e15;        // metres
const PC  = 3.086e16;        // metres
const G   = 6.674e-11;
const M_SUN = 1.989e30;      // kg
const L_SUN = 3.828e26;      // W

const PLANETS = [
  { name:'Mercury', g:3.7  },
  { name:'Venus',   g:8.87 },
  { name:'Earth',   g:9.81 },
  { name:'Mars',    g:3.72 },
  { name:'Jupiter', g:24.79},
  { name:'Saturn',  g:10.44},
  { name:'Uranus',  g:8.69 },
  { name:'Neptune', g:11.15},
  { name:'Moon',    g:1.62 },
  { name:'Pluto',   g:0.62 },
];

const TABS = [
  { id:'distance',  label:'📏 Distance',      sub:'AU · LY · parsec' },
  { id:'light',     label:'💡 Light Travel',   sub:'time across space' },
  { id:'weight',    label:'⚖️ Planet Weight',  sub:'your weight anywhere' },
  { id:'orbital',   label:'🪐 Orbital Period',  sub:'Kepler\'s 3rd law' },
  { id:'luminosity',label:'⭐ Star Luminosity', sub:'Stefan-Boltzmann' },
];

/* ── sci notation ── */
const sci = (n) => {
  if (!isFinite(n) || n === 0) return '0';
  if (Math.abs(n) < 1e4 && Math.abs(n) > 0.001) return n.toPrecision(5).replace(/\.?0+$/, '');
  const exp = Math.floor(Math.log10(Math.abs(n)));
  const mant = (n / Math.pow(10, exp)).toPrecision(4).replace(/\.?0+$/, '');
  return `${mant} × 10^${exp}`;
};

const fmtTime = (seconds) => {
  if (seconds < 60)           return seconds.toFixed(2) + ' seconds';
  if (seconds < 3600)         return (seconds/60).toFixed(2) + ' minutes';
  if (seconds < 86400)        return (seconds/3600).toFixed(2) + ' hours';
  if (seconds < 31557600)     return (seconds/86400).toFixed(2) + ' days';
  if (seconds < 31557600*1000) return (seconds/31557600).toFixed(4) + ' years';
  return sci(seconds/31557600) + ' years';
};

  /* ════════════════════════════════════════════════════════════ */
  const L = ({ children }) => <label className="lbl">{children}</label>;

const BODIES = {
  'Sun':              695700e3,
  'Moon':             384400e3,
  'Mars (closest)':   54.6e9,
  'Mars (farthest)':  401e9,
  'Jupiter':          628.7e9,
  'Saturn':           1.2e12,
  'Proxima Centauri': 4.243 * LY,
  'Andromeda Galaxy': 2.537e6 * LY,
};

export default function AstronomyCalculator({ isDarkMode: ext } = {}) {
    const [dark, setDark] = useState(ext !== undefined ? ext : true);
    const cls = dark ? 'dk' : 'lt';
    const [tab, setTab] = useState('distance');
  
    /* ── distance state ── */
    const [distVal,  setDistVal]  = useState(1);
    const [distFrom, setDistFrom] = useState('AU');
  
    /* ── light travel state ── */
    const [ltBody, setLtBody] = useState('Sun');
  
    /* ── weight state ── */
    const [earthWeight, setEarthWeight] = useState(70);
    const [weightUnit,  setWeightUnit]  = useState('kg');
  
    /* ── orbital state ── */
    const [orbMass,   setOrbMass]   = useState(1);
    const [orbDist,   setOrbDist]   = useState(1);
    const [orbUnit,   setOrbUnit]   = useState('AU');
  
    /* ── luminosity state ── */
    const [starTemp,   setStarTemp]   = useState(5778);
    const [starRadius, setStarRadius] = useState(1);
  
  /* ════ CALCULATIONS ════ */
  
    // Distance conversion
    const distResult = useMemo(() => {
      const v = parseFloat(distVal); if (!v || isNaN(v)) return null;
      const toMetres = { 'km':1e3, 'AU':AU, 'light-years':LY, 'parsec':PC, 'light-minutes':C*60, 'light-hours':C*3600 };
      const metres = v * (toMetres[distFrom] || 1);
      const results = Object.entries(toMetres).map(([unit, factor]) => ({ unit, value: metres / factor }));
      return { metres, results };
    }, [distVal, distFrom]);
  
    // Light travel time
    const ltResult = useMemo(() => {
      const dist = BODIES[ltBody];
      if (!dist) return null;
      const secs = dist / C;
      return { dist, secs, formatted: fmtTime(secs) };
    }, [ltBody]);
  
    // Planet weight
    const weightResult = useMemo(() => {
      const w = parseFloat(earthWeight); if (!w || isNaN(w)) return null;
      const kgMass = weightUnit === 'kg' ? w : w * 0.453592;
      return PLANETS.map(p => ({ ...p, weight: kgMass * p.g, weightLbs: kgMass * p.g / 0.453592 }));
    }, [earthWeight, weightUnit]);
  
    // Orbital period (Kepler's 3rd)
    const orbResult = useMemo(() => {
      const M  = parseFloat(orbMass)   * M_SUN; if (!M || isNaN(M)) return null;
      const toM = { 'AU':AU, 'km':1e3, 'light-minutes':C*60 };
      const a  = parseFloat(orbDist) * (toM[orbUnit] || AU);
      const T  = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / (G * M));
      return { T, years: T / 31557600, days: T / 86400 };
    }, [orbMass, orbDist, orbUnit]);
  
    // Star luminosity (Stefan-Boltzmann)
    const lumResult = useMemo(() => {
      const T = parseFloat(starTemp);
      const R = parseFloat(starRadius) * 6.957e8; // solar radii → metres
      if (!T || !R || isNaN(T) || isNaN(R)) return null;
      const sigma = 5.670374419e-8;
      const L = 4 * Math.PI * R * R * sigma * Math.pow(T, 4);
      const LSun = L / L_SUN;
      return { L, LSun };
    }, [starTemp, starRadius]);
  
    /* ════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>
        {dark && <div className="scanline" />}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <div style={{ width:32, height:32, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:16, borderRadius:dark?3:9,
              border:dark?'1px solid rgba(20,255,180,.35)':'none',
              background:dark?'rgba(20,255,180,.07)':'linear-gradient(135deg,#0d3320,#1a5c38)',
              boxShadow:dark?'0 0 16px rgba(20,255,180,.2)':'0 3px 10px rgba(13,51,32,.35)' }}>🔭</div>
            <div>
              <div style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:16, color:'var(--tx)', lineHeight:1 }}>
                Astronomy<span style={{ color:'var(--acc)' }}>Calc</span>
                <span style={{ fontFamily:"'Fira Code',monospace", fontSize:9, color:'var(--txm)', marginLeft:7 }}>v1.0</span>
              </div>
              <div style={{ fontFamily:"'Fira Code',monospace", fontSize:8, color:'var(--tx3)', letterSpacing:'.12em', textTransform:'uppercase', marginTop:1 }}>
                Document Tools #6 · 5 calculators · space science
              </div>
            </div>
          </div>
          <div style={{ flex:1 }} />
          <button onClick={() => setDark(d=>!d)} style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 10px',
            border:dark?'1px solid rgba(20,255,180,.18)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7, background:'transparent', cursor:'pointer' }}>
            <div style={{ width:28, height:14, borderRadius:8, position:'relative',
              background:dark?'var(--acc)':'#b8ddc8', boxShadow:dark?'0 0 8px rgba(20,255,180,.5)':'none' }}>
              <div style={{ position:'absolute', top:2.5, left:dark?'auto':2, right:dark?2:'auto',
                width:9, height:9, borderRadius:'50%', background:dark?'#060a09':'white', transition:'all .2s' }} />
            </div>
            <span style={{ fontFamily:"'Fira Code',monospace", fontSize:8.5, color:'var(--txm)' }}>{dark?'VOID':'LIGHT'}</span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
          {TABS.map(t => (
            <button key={t.id} className={`tab${tab===t.id?' on':''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="body">

          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* quick facts */}
            <div>
              <div className="slbl">Cosmic constants</div>
              {[
                ['Speed of light', '299,792 km/s'],
                ['1 AU',           '149.6M km'],
                ['1 Light-year',   '9.461 × 10¹⁵ m'],
                ['1 Parsec',       '3.086 × 10¹⁶ m'],
                ['Solar mass',     '1.989 × 10³⁰ kg'],
                ['Solar radius',   '695,700 km'],
              ].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'5px 9px', marginBottom:3, borderRadius:dark?2:6,
                  border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                  background:dark?'rgba(20,255,180,.02)':'rgba(13,51,32,.02)' }}>
                  <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:10, color:'var(--txm)' }}>{l}</span>
                  <span style={{ fontFamily:"'Fira Code',monospace", fontSize:9, color:'var(--acc)' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* solar system viz */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 6px',
              border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
              borderRadius:dark?3:9, background:dark?'rgba(20,255,180,.01)':'rgba(13,51,32,.01)' }}>
              <div className="slbl" style={{ marginBottom:8 }}>Solar system</div>
              <div style={{ position:'relative', width:100, height:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {/* sun */}
                <div style={{ width:16, height:16, borderRadius:'50%', background:dark?'#fbbf24':'#d97706',
                  boxShadow:dark?'0 0 12px rgba(251,191,36,.6)':'none', flexShrink:0 }} />
                {/* orbits */}
                {[22,34,46].map((r) => (
                  <div key={r} style={{ position:'absolute', width:r*2, height:r*2, borderRadius:'50%',
                    border:`1px solid ${dark?'rgba(20,255,180,.1)':'rgba(13,51,32,.08)'}` }} />
                ))}
                {/* planets */}
                {[
                  { r:22, color:dark?'#a78bfa':'#5b21b6', size:5, delay:'0s',  dur:'4s' },
                  { r:34, color:dark?'#14ffb4':'#0d3320',  size:6, delay:'1s',  dur:'7s' },
                  { r:46, color:dark?'#fb7185':'#be123c',  size:5, delay:'2s',  dur:'12s'},
                ].map((p,i) => (
                  <div key={i} style={{ position:'absolute', width:p.r*2, height:p.r*2,
                    animation:`orbit ${p.dur} linear infinite`, animationDelay:p.delay,
                    borderRadius:'50%' }}>
                    <div style={{ width:p.size, height:p.size, borderRadius:'50%', background:p.color,
                      position:'absolute', top:'50%', right:0, transform:'translateY(-50%)',
                      boxShadow:dark?`0 0 4px ${p.color}99`:'none' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* fun facts */}
            <div>
              <div className="slbl">Did you know?</div>
              {[
                'Light from the Sun takes ~8 min 20 sec to reach Earth.',
                'A day on Venus is longer than its year.',
                'Neutron stars can spin 700 times per second.',
                'The observable universe is ~93 billion light-years across.',
              ].map((f,i) => (
                <div key={i} style={{ display:'flex', gap:7, padding:'5px 0',
                  borderBottom:dark?'1px solid var(--bdr)':'1px solid var(--bdr)', marginBottom:2 }}>
                  <span style={{ color:'var(--acc)', fontSize:9, fontFamily:"'Fira Code',monospace", flexShrink:0, marginTop:2 }}>✦</span>
                  <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:10.5, color:'var(--tx2)', lineHeight:1.5 }}>{f}</span>
                </div>
              ))}
            </div>

            
          </div>

          {/* MAIN */}
          <div className="main">
            

            <AnimatePresence mode="wait">

              {/* ╔═══ DISTANCE ═══╗ */}
              {tab==='distance' && (
                <motion.div key="dist" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div className="panel" style={{ padding:'18px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:18 }}>
                      <div style={{ width:34, height:34, borderRadius:dark?3:9, display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:16, border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',
                        background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)' }}>📏</div>
                      <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:700, color:'var(--tx)' }}>Astronomical distance converter</div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                      <div>
                        <L>Value</L>
                        <input className="fi" type="number" value={distVal} onChange={e=>setDistVal(e.target.value)} placeholder="1" />
                      </div>
                      <div>
                        <L>From unit</L>
                        <select className="fi" value={distFrom} onChange={e=>setDistFrom(e.target.value)}>
                          {['km','AU','light-years','parsec','light-minutes','light-hours'].map(u => <option key={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>
                    {distResult && (
                      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="result-card">
                        <div className="lbl" style={{ marginBottom:12 }}>Converted to all units</div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                          {distResult.results.map(({ unit, value }) => (
                            <div key={unit} style={{ padding:'8px 11px', borderRadius:dark?3:8,
                              border: unit===distFrom
                                ?(dark?'1px solid rgba(20,255,180,.35)':'1.5px solid rgba(13,51,32,.3)')
                                :(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                              background: unit===distFrom?(dark?'rgba(20,255,180,.07)':'rgba(13,51,32,.05)'):'transparent' }}>
                              <div className="lbl" style={{ marginBottom:3 }}>{unit}</div>
                              <div style={{ fontFamily:"'Fira Code',monospace", fontSize:12, color:'var(--acc)' }}>{sci(value)}</div>
                            </div>
                          ))}
                        </div>
                        <div className="formula" style={{ marginTop:12 }}>
                          {`${distVal} ${distFrom} = ${sci(distResult.metres)} metres`}
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div className="panel" style={{ padding:'16px 18px' }}>
                    <div style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:'var(--tx)', marginBottom:12 }}>Common distances</div>
                    {[
                      ['Earth → Moon',          '384,400 km',     '0.00257 AU',   '1.28 light-sec'],
                      ['Earth → Sun',            '149.6M km',      '1 AU',         '8m 20s light'],
                      ['Earth → Mars (closest)', '54.6M km',       '0.365 AU',     '3m 2s light'],
                      ['Sun → Proxima Centauri', '4.013×10¹³ km',  '268,770 AU',   '4.24 light-yr'],
                      ['Milky Way diameter',     '~9.5×10¹⁷ km',   '~100,000 LY',  '~30 kpc'],
                    ].map(([from, km, au, ly]) => (
                      <div key={from} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 0',
                        borderBottom:dark?'1px solid rgba(20,255,180,.06)':'1px solid var(--bdr)' }}>
                        <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, color:'var(--tx)', flex:'0 0 180px' }}>{from}</span>
                        {[km,au,ly].map(v => (
                          <span key={v} style={{ fontFamily:"'Fira Code',monospace", fontSize:10, color:'var(--txm)', flex:1 }}>{v}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ╔═══ LIGHT TRAVEL ═══╗ */}
              {tab==='light' && (
                <motion.div key="light" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div className="panel" style={{ padding:'18px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:18 }}>
                      <div style={{ width:34, height:34, borderRadius:dark?3:9, display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:16, border:dark?'1px solid rgba(251,191,36,.3)':'1.5px solid rgba(146,64,14,.2)',
                        background:dark?'rgba(251,191,36,.07)':'rgba(146,64,14,.05)' }}>💡</div>
                      <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:700, color:'var(--tx)' }}>Light travel time calculator</div>
                    </div>
                    <L>Select destination</L>
                    <select className="fi" value={ltBody} onChange={e=>setLtBody(e.target.value)} style={{ marginBottom:14 }}>
                      {Object.keys(BODIES).map(b => <option key={b}>{b}</option>)}
                    </select>
                    {ltResult && (
                      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="result-card">
                        <div style={{ textAlign:'center', marginBottom:16 }}>
                          <div className="lbl" style={{ textAlign:'center', marginBottom:6 }}>Light travel time to {ltBody}</div>
                          <div style={{ fontFamily:"'Fira Code',monospace", fontSize:32, fontWeight:500, color:'var(--acc)', lineHeight:1 }}>
                            {ltResult.formatted}
                          </div>
                        </div>
                        <div style={{ display:'flex', gap:8 }}>
                          {[
                            ['Distance',    sci(ltResult.dist) + ' m'],
                            ['In km',       sci(ltResult.dist/1000) + ' km'],
                            ['In AU',       sci(ltResult.dist/AU) + ' AU'],
                          ].map(([l,v]) => (
                            <div key={l} className="sb">
                              <div className="lbl">{l}</div>
                              <div style={{ fontFamily:"'Fira Code',monospace", fontSize:10, color:'var(--acc)' }}>{v}</div>
                            </div>
                          ))}
                        </div>
                        <div className="formula" style={{ marginTop:12 }}>
                          {'t = d ÷ c\n'}
                          {`t = ${sci(ltResult.dist)} m ÷ 299,792,458 m/s\nt = ${sci(ltResult.secs)} seconds`}
                        </div>
                      </motion.div>
                    )}
                  </div>
                  {/* all bodies table */}
                  <div className="panel" style={{ padding:'16px 18px' }}>
                    <div style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:'var(--tx)', marginBottom:12 }}>All destinations at a glance</div>
                    {Object.entries(BODIES).map(([name, dist]) => {
                      const t = dist / C;
                      return (
                        <div key={name} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                          padding:'7px 10px', marginBottom:4, borderRadius:dark?3:8, cursor:'pointer',
                          border: ltBody===name?(dark?'1px solid var(--acc)':'1.5px solid var(--acc)'):(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                          background: ltBody===name?(dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.04)'):'transparent' }}
                          onClick={() => setLtBody(name)}>
                          <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, color:'var(--tx)' }}>{name}</span>
                          <span style={{ fontFamily:"'Fira Code',monospace", fontSize:10, color: ltBody===name?'var(--acc)':'var(--txm)' }}>{fmtTime(t)}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ╔═══ PLANET WEIGHT ═══╗ */}
              {tab==='weight' && (
                <motion.div key="weight" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div className="panel" style={{ padding:'18px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:18 }}>
                      <div style={{ width:34, height:34, borderRadius:dark?3:9, display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:16, border:dark?'1px solid rgba(167,139,250,.3)':'1.5px solid rgba(91,33,182,.2)',
                        background:dark?'rgba(167,139,250,.08)':'rgba(91,33,182,.05)' }}>⚖️</div>
                      <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:700, color:'var(--tx)' }}>Your weight across the solar system</div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                      <div>
                        <L>Your Earth weight</L>
                        <input className="fi" type="number" value={earthWeight}
                          onChange={e=>setEarthWeight(e.target.value)} placeholder="70" />
                        <input type="range" min="1" max="300" value={earthWeight}
                          onChange={e=>setEarthWeight(e.target.value)} style={{ marginTop:7 }} />
                      </div>
                      <div>
                        <L>Unit</L>
                        <select className="fi" value={weightUnit} onChange={e=>setWeightUnit(e.target.value)}>
                          <option value="kg">Kilograms (kg)</option>
                          <option value="lbs">Pounds (lbs)</option>
                        </select>
                      </div>
                    </div>

                    {weightResult && (
                      <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                        <div className="lbl" style={{ marginBottom:10 }}>Weight on each body ({weightUnit})</div>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:7 }}>
                          {weightResult.map(p => {
                            const w = weightUnit==='kg' ? p.weight : p.weightLbs;
                            const bar = (p.g / 24.79) * 100;
                            return (
                              <div key={p.name} style={{ padding:'10px 12px', borderRadius:dark?3:9,
                                border: p.name==='Earth'
                                  ?(dark?'1px solid rgba(20,255,180,.3)':'1.5px solid rgba(13,51,32,.3)')
                                  :(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                                background: p.name==='Earth'?(dark?'rgba(20,255,180,.05)':'rgba(13,51,32,.04)'):'transparent' }}>
                                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                                  <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, fontWeight:600, color:'var(--tx)' }}>{p.name}</span>
                                  <span style={{ fontFamily:"'Fira Code',monospace", fontSize:12, color:'var(--acc)' }}>{w.toFixed(1)}</span>
                                </div>
                                <div style={{ height:4, borderRadius:2, overflow:'hidden',
                                  background:dark?'rgba(20,255,180,.08)':'rgba(13,51,32,.08)' }}>
                                  <motion.div animate={{width:`${bar}%`}} transition={{duration:.6,delay:.1}}
                                    style={{ height:'100%', borderRadius:2, background:'var(--acc)' }} />
                                </div>
                                <div style={{ fontFamily:"'Fira Code',monospace", fontSize:8.5, color:'var(--txm)', marginTop:3 }}>
                                  g = {p.g} m/s²
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="formula" style={{ marginTop:12 }}>
                          {'W = m × g\nWhere m = mass (kg), g = surface gravity (m/s²)'}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ╔═══ ORBITAL PERIOD ═══╗ */}
              {tab==='orbital' && (
                <motion.div key="orbital" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div className="panel" style={{ padding:'18px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:18 }}>
                      <div style={{ width:34, height:34, borderRadius:dark?3:9, display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:16, border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',
                        background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.04)' }}>🪐</div>
                      <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:700, color:'var(--tx)' }}>Orbital period calculator (Kepler's 3rd law)</div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:16 }}>
                      <div>
                        <L>Star mass (solar masses)</L>
                        <input className="fi" type="number" step="0.1" value={orbMass} onChange={e=>setOrbMass(e.target.value)} />
                        <input type="range" min="0.1" max="50" step="0.1" value={orbMass} onChange={e=>setOrbMass(e.target.value)} style={{ marginTop:7 }} />
                      </div>
                      <div>
                        <L>Orbital distance</L>
                        <input className="fi" type="number" step="0.1" value={orbDist} onChange={e=>setOrbDist(e.target.value)} />
                        <input type="range" min="0.1" max="50" step="0.1" value={orbDist} onChange={e=>setOrbDist(e.target.value)} style={{ marginTop:7 }} />
                      </div>
                      <div>
                        <L>Distance unit</L>
                        <select className="fi" value={orbUnit} onChange={e=>setOrbUnit(e.target.value)}>
                          <option value="AU">AU</option>
                          <option value="km">km</option>
                          <option value="light-minutes">light-minutes</option>
                        </select>
                      </div>
                    </div>
                    {orbResult && (
                      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="result-card">
                        <div style={{ textAlign:'center', marginBottom:16 }}>
                          <div className="lbl" style={{ textAlign:'center', marginBottom:6 }}>Orbital period</div>
                          <div style={{ fontFamily:"'Fira Code',monospace", fontSize:28, fontWeight:500, color:'var(--acc)' }}>
                            {orbResult.years >= 1 ? orbResult.years.toFixed(4) + ' years' : orbResult.days.toFixed(2) + ' days'}
                          </div>
                        </div>
                        <div style={{ display:'flex', gap:8 }}>
                          {[
                            ['Years',   orbResult.years.toFixed(6)],
                            ['Days',    orbResult.days.toFixed(2)],
                            ['Seconds', sci(orbResult.T)],
                          ].map(([l,v]) => (
                            <div key={l} className="sb">
                              <div className="lbl">{l}</div>
                              <div style={{ fontFamily:"'Fira Code',monospace", fontSize:10, color:'var(--acc)' }}>{v}</div>
                            </div>
                          ))}
                        </div>
                        <div className="formula" style={{ marginTop:12 }}>
                          {'T = 2π √(a³ / GM)\n'}
                          {`T = ${sci(orbResult.T)} s = ${orbResult.years.toFixed(4)} years`}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* known planets comparison */}
                  <div className="panel" style={{ padding:'16px 18px' }}>
                    <div style={{ fontFamily:"'Fraunces',serif", fontSize:14, fontWeight:600, color:'var(--tx)', marginBottom:12 }}>
                      Solar system reference
                    </div>
                    {[
                      ['Mercury', 0.387, 0.241], ['Venus', 0.723, 0.615], ['Earth', 1.0, 1.0],
                      ['Mars', 1.524, 1.881], ['Jupiter', 5.203, 11.86], ['Saturn', 9.537, 29.46],
                      ['Uranus', 19.19, 84.01], ['Neptune', 30.07, 164.8],
                    ].map(([name, au, period]) => (
                      <div key={name} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0',
                        borderBottom:dark?'1px solid rgba(20,255,180,.05)':'1px solid var(--bdr)' }}>
                        <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, color:'var(--tx)', width:70 }}>{name}</span>
                        <span style={{ fontFamily:"'Fira Code',monospace", fontSize:10, color:'var(--txm)', width:70 }}>{au} AU</span>
                        <div style={{ flex:1, height:4, borderRadius:2, overflow:'hidden',
                          background:dark?'rgba(20,255,180,.07)':'rgba(13,51,32,.07)' }}>
                          <div style={{ width:`${Math.min(100,(au/30.07)*100)}%`, height:'100%', borderRadius:2, background:'var(--acc)' }} />
                        </div>
                        <span style={{ fontFamily:"'Fira Code',monospace", fontSize:10, color:'var(--acc)', width:75, textAlign:'right' }}>{period} yr</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ╔═══ LUMINOSITY ═══╗ */}
              {tab==='luminosity' && (
                <motion.div key="lum" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div className="panel" style={{ padding:'18px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:18 }}>
                      <div style={{ width:34, height:34, borderRadius:dark?3:9, display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:16, border:dark?'1px solid rgba(251,191,36,.3)':'1.5px solid rgba(146,64,14,.2)',
                        background:dark?'rgba(251,191,36,.08)':'rgba(146,64,14,.04)' }}>⭐</div>
                      <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:700, color:'var(--tx)' }}>Star luminosity (Stefan-Boltzmann)</div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                      <div>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                          <L>Surface temperature (K)</L>
                          <span style={{ fontFamily:"'Fira Code',monospace", fontSize:11, color:'var(--acc)' }}>{Number(starTemp).toLocaleString()} K</span>
                        </div>
                        <input className="fi" type="number" value={starTemp} onChange={e=>setStarTemp(e.target.value)} />
                        <input type="range" min="1000" max="50000" step="100" value={starTemp} onChange={e=>setStarTemp(e.target.value)} style={{ marginTop:7 }} />
                      </div>
                      <div>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                          <L>Radius (solar radii)</L>
                          <span style={{ fontFamily:"'Fira Code',monospace", fontSize:11, color:'var(--acc)' }}>{starRadius} R☉</span>
                        </div>
                        <input className="fi" type="number" step="0.1" value={starRadius} onChange={e=>setStarRadius(e.target.value)} />
                        <input type="range" min="0.1" max="100" step="0.1" value={starRadius} onChange={e=>setStarRadius(e.target.value)} style={{ marginTop:7 }} />
                      </div>
                    </div>

                    {/* star colour preview */}
                    {lumResult && (
                      <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                          <div style={{
                            width: Math.min(64, Math.max(24, Math.log10(parseFloat(starRadius)+1)*40)) + 'px',
                            height: Math.min(64, Math.max(24, Math.log10(parseFloat(starRadius)+1)*40)) + 'px',
                            borderRadius:'50%', flexShrink:0,
                            background: parseFloat(starTemp) > 30000 ? '#a5b4fc' :
                              parseFloat(starTemp) > 10000 ? '#bfdbfe' :
                              parseFloat(starTemp) > 7500  ? '#ffffff' :
                              parseFloat(starTemp) > 6000  ? '#fef9c3' :
                              parseFloat(starTemp) > 5000  ? '#fde68a' :
                              parseFloat(starTemp) > 3500  ? '#fdba74' : '#f87171',
                            boxShadow: dark ? `0 0 ${Math.min(40,parseFloat(starRadius)*8)}px ${
                              parseFloat(starTemp) > 10000 ? 'rgba(191,219,254,.6)' :
                              parseFloat(starTemp) > 6000  ? 'rgba(254,249,195,.6)' : 'rgba(253,186,116,.6)'}` : 'none',
                          }} />
                          <div>
                            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, color:'var(--tx2)', marginBottom:3 }}>
                              Spectral class: <strong style={{ color:'var(--acc)' }}>
                                {parseFloat(starTemp)>30000?'O':parseFloat(starTemp)>10000?'B':parseFloat(starTemp)>7500?'A':parseFloat(starTemp)>6000?'F':parseFloat(starTemp)>5200?'G':parseFloat(starTemp)>3700?'K':'M'}
                              </strong>
                            </div>
                            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:11.5, color:'var(--txm)' }}>
                              {parseFloat(starTemp)>30000?'Blue supergiant':parseFloat(starTemp)>10000?'Blue-white star':parseFloat(starTemp)>7500?'White star':parseFloat(starTemp)>6000?'Yellow-white star':parseFloat(starTemp)>5200?'Yellow dwarf (like our Sun)':parseFloat(starTemp)>3700?'Orange dwarf':'Red dwarf'}
                            </div>
                          </div>
                        </div>

                        <div className="result-card">
                          <div style={{ textAlign:'center', marginBottom:14 }}>
                            <div className="lbl" style={{ textAlign:'center', marginBottom:5 }}>Luminosity</div>
                            <div style={{ fontFamily:"'Fira Code',monospace", fontSize:28, fontWeight:500, color:'var(--acc)' }}>
                              {sci(lumResult.LSun)} L☉
                            </div>
                          </div>
                          <div style={{ display:'flex', gap:8 }}>
                            {[
                              ['Watts',       sci(lumResult.L)   + ' W'],
                              ['Solar lum.',  sci(lumResult.LSun) + ' L☉'],
                              ['vs Sun',      lumResult.LSun >= 1 ? (lumResult.LSun.toFixed(1) + '× brighter') : ((1/lumResult.LSun).toFixed(1) + '× dimmer')],
                            ].map(([l,v]) => (
                              <div key={l} className="sb">
                                <div className="lbl">{l}</div>
                                <div style={{ fontFamily:"'Fira Code',monospace", fontSize:9.5, color:'var(--acc)' }}>{v}</div>
                              </div>
                            ))}
                          </div>
                          <div className="formula" style={{ marginTop:12 }}>
                            {'L = 4πR²σT⁴\n'}
                            {`σ = 5.67×10⁻⁸ W m⁻² K⁻⁴\nL = ${sci(lumResult.L)} W = ${sci(lumResult.LSun)} L☉`}
                          </div>
                        </div>

                        {/* star class comparison */}
                        <div style={{ marginTop:14 }}>
                          <div className="lbl" style={{ marginBottom:8 }}>Compare to famous stars</div>
                          {[
                            { name:'Proxima Cen', T:3042, R:0.154, color:'#f87171' },
                            { name:'Sun',         T:5778, R:1,     color:'#fde68a' },
                            { name:'Sirius A',    T:9940, R:1.711, color:'#e0f2fe' },
                            { name:'Rigel',       T:12100,R:78.9,  color:'#bfdbfe' },
                          ].map(s => {
                            const sigma = 5.670374419e-8;
                            const Ls = 4*Math.PI*Math.pow(s.R*6.957e8,2)*sigma*Math.pow(s.T,4)/L_SUN;
                            return (
                              <div key={s.name} style={{ display:'flex', alignItems:'center', gap:9, padding:'6px 0',
                                borderBottom:dark?'1px solid rgba(20,255,180,.05)':'1px solid var(--bdr)' }}>
                                <div style={{ width:12, height:12, borderRadius:'50%', background:s.color, flexShrink:0,
                                  boxShadow:dark?`0 0 6px ${s.color}99`:'none' }} />
                                <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, color:'var(--tx)', width:90 }}>{s.name}</span>
                                <span style={{ fontFamily:"'Fira Code',monospace", fontSize:9.5, color:'var(--txm)', flex:1 }}>{s.T.toLocaleString()} K</span>
                                <span style={{ fontFamily:"'Fira Code',monospace", fontSize:9.5, color:'var(--acc)' }}>{sci(Ls)} L☉</span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* SEO ARTICLE */}
            <div className="panel" style={{ padding:'22px 24px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:16 }}>
                <div style={{ width:34, height:34, borderRadius:dark?3:9, display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:16, border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',
                  background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.04)' }}>📖</div>
                <div style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:700, color:'var(--tx)' }}>
                  Astronomy calculators — distances, orbits &amp; stellar physics
                </div>
              </div>
              <div className="ab">
                <p>Astronomy involves some of the largest numbers humans have ever worked with. This suite of calculators makes those numbers tangible — converting cosmic distances, computing how long light takes to cross the void, and applying Kepler's and Stefan-Boltzmann's laws to real stellar data.</p>
                <h3>Understanding astronomical distances</h3>
                <p>The scale of the universe defies intuition. The Astronomical Unit (AU) — Earth's average distance from the Sun — is about 149.6 million kilometres. A light-year stretches that by roughly 63,000 times. A parsec is the distance at which 1 AU subtends an angle of one arcsecond, equal to about 3.26 light-years or 206,265 AU.</p>
                <h3>Kepler's third law</h3>
                <p>Johannes Kepler discovered that the square of a planet's orbital period is proportional to the cube of its semi-major axis: T² ∝ a³. The full formula, incorporating Newton's gravitation, is T = 2π√(a³/GM), where G is the gravitational constant and M is the central mass. This lets us calculate the orbital period of any object — from a spacecraft to an exoplanet — given only its distance and the mass of its host star.</p>
                <h3>Stefan-Boltzmann luminosity</h3>
                <p>A star's total luminosity depends on both its size and temperature: L = 4πR²σT⁴. Because temperature is raised to the fourth power, even small changes in surface temperature produce enormous differences in brightness. A star twice as hot as the Sun radiates 16× more energy per unit of surface area.</p>
                <div className="faq">
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:13.5, fontWeight:600, color:'var(--tx)', marginBottom:5 }}>Why does light travel time matter?</div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, color:'var(--tx2)', lineHeight:1.7 }}>When you observe distant objects, you see them as they were in the past. Light from Andromeda left 2.5 million years ago — before modern humans existed. Even communication with a Mars rover has a delay of 3–22 minutes depending on orbital positions.</div>
                </div>
                <div className="faq">
                  <div style={{ fontFamily:"'Fraunces',serif", fontSize:13.5, fontWeight:600, color:'var(--tx)', marginBottom:5 }}>Why does weight differ between planets?</div>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, color:'var(--tx2)', lineHeight:1.7 }}>Your mass stays constant, but weight is the force of gravity on that mass (W = mg). Surface gravity varies by planet size and density — Jupiter's powerful gravity would make you weigh about 2.5× your Earth weight, while on Mars you'd feel lighter than on Earth.</div>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </>
  );
}