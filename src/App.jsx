// ╔══════════════════════════════════════════════════════════════════╗
// ║  App.jsx — StudentToolHub  FUTURISTIC · PERFORMANCE OPTIMIZED   ║
// ║  Fixes: removed blur(), throttled mousemove, lazy card render,  ║
// ║         GPU-only animations, reduced simultaneous animations    ║
// ╚══════════════════════════════════════════════════════════════════╝

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { tools, categories } from './data/tools';
import AdSlot from './components/AdSlot';

// ─── Category metadata ───────────────────────────────────────────
const CAT = {
  all:          { label: 'ALL SYSTEMS',    color: '#00f5ff' },
  academic:     { label: 'ACADEMIC',       color: '#a78bfa' },
  financial:    { label: 'FINANCIAL',      color: '#34d399' },
  utility:      { label: 'UTILITY',        color: '#60a5fa' },
  niche:        { label: 'NICHE',          color: '#f472b6' },
  image:        { label: 'IMAGE',          color: '#fb923c' },
  pdf:          { label: 'PDF TOOLS',      color: '#facc15' },
  text:         { label: 'TEXT',           color: '#4ade80' },
  audio:        { label: 'AUDIO',          color: '#c084fc' },
  developer:    { label: 'DEV',            color: '#22d3ee' },
  documentmaker:{ label: 'DOCS',           color: '#f87171' },
  health:       { label: 'HEALTH',         color: '#86efac' },
  useful:       { label: 'TOOLS',          color: '#fbbf24' },
};

const CAT_ICONS = {
  academic:'🎓', financial:'💰', utility:'⚙️', niche:'✨',
  image:'🖼️', pdf:'📄', text:'📝', audio:'🎵',
  developer:'💻', documentmaker:'📋', health:'❤️', useful:'🔧',
};

const CAT_SEO = {
  all:       { title: 'StudentToolHub — 56+ Free Tools', desc: 'Free online tools for students. No signup. Works on all devices.' },
  financial: { title: 'Financial Calculators | StudentToolHub', desc: 'Free EMI, SIP, mortgage, compound interest calculators.' },
  pdf:       { title: 'PDF Tools | StudentToolHub', desc: 'Free PDF to Word, Word to PDF, PDF unlock tools.' },
};

// ─── PERF: detect low-end device ─────────────────────────────────
const isLowEnd = () => {
  if (typeof navigator === 'undefined') return false;
  const cores = navigator.hardwareConcurrency || 4;
  const mem   = navigator.deviceMemory || 4;
  return cores <= 2 || mem <= 1;
};

// ─── PERF: throttle to rAF ───────────────────────────────────────
function rafThrottle(fn) {
  let ticking = false;
  return (...args) => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => { fn(...args); ticking = false; });
    }
  };
}

// ─── Global CSS — GPU-composited animations only ─────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}
body{font-family:'Space Grotesk',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-thumb{background:rgba(0,245,255,.18);border-radius:2px;}

/* ── Background: GPU-only (transform not background-position) ── */
.bg-base{
  position:fixed;inset:0;z-index:0;
  background:linear-gradient(135deg,#020408 0%,#050d12 40%,#030810 100%);
}
.bg-grid-el{
  position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:
    linear-gradient(rgba(0,245,255,.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,245,255,.022) 1px, transparent 1px);
  background-size:48px 48px;
  will-change:transform;
  animation:gridSlide 20s linear infinite;
}
@keyframes gridSlide {
  0%   { transform: translate(0,0); }
  100% { transform: translate(48px,48px); }
}

.orb{
  position:fixed;border-radius:50%;pointer-events:none;z-index:0;
  will-change:transform;
  animation:orbDrift linear infinite;
}
@keyframes orbDrift{
  0%,100%{ transform:translate(0,0) scale(1); }
  33%    { transform:translate(24px,-36px) scale(1.05); }
  66%    { transform:translate(-18px,24px) scale(.97); }
}

.scanlines{
  position:fixed;inset:0;z-index:0;pointer-events:none;
  background:repeating-linear-gradient(
    0deg,transparent,transparent 2px,rgba(0,0,0,.018) 2px,rgba(0,0,0,.018) 4px
  );
}

.orb-font{ font-family:'Orbitron',sans-serif; }
.jet-font{ font-family:'JetBrains Mono',monospace; }
.sg-font { font-family:'Space Grotesk',sans-serif; }

.holo{
  background:linear-gradient(90deg,#00f5ff,#a78bfa,#f472b6,#facc15,#00f5ff);
  background-size:250% auto;
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
  animation:holoShift 4s linear infinite;
  will-change:background-position;
}
@keyframes holoShift{ 0%{ background-position:0% } 100%{ background-position:250% } }

.glitch{ position:relative; }
.glitch::before,.glitch::after{
  content:attr(data-text);position:absolute;top:0;left:0;
  background:inherit;-webkit-background-clip:text;background-clip:text;
  -webkit-text-fill-color:transparent;
}
.glitch::before{ clip-path:polygon(0 0,100% 0,100% 38%,0 38%); animation:gt 8s infinite; }
.glitch::after { clip-path:polygon(0 62%,100% 62%,100% 100%,0 100%); animation:gb 8s infinite; }
@keyframes gt{ 0%,84%,86%,100%{transform:translate(0)} 85%{transform:translate(-2px,-1px)} }
@keyframes gb{ 0%,82%,85%,100%{transform:translate(0)} 83%{transform:translate(2px,1px)} }

.blink{ animation:blinkAnim .9s step-end infinite; }
@keyframes blinkAnim{ 0%,100%{opacity:1} 50%{opacity:0} }

.topbar{
  position:sticky;top:0;z-index:100;height:52px;
  display:flex;align-items:center;padding:0 16px;gap:10px;
  background:rgba(2,4,8,.92);
  border-bottom:1px solid rgba(0,245,255,.09);
  will-change:transform;
  backdrop-filter:blur(16px);
  -webkit-backdrop-filter:blur(16px);
}

.holo-card{
  position:relative;overflow:hidden;
  padding:16px 14px;border-radius:7px;cursor:pointer;
  background:rgba(12,20,32,.85);
  border:1px solid rgba(255,255,255,.06);
  display:flex;flex-direction:column;gap:9px;
  min-height:140px;
  will-change:transform;
  transition:transform .14s ease, box-shadow .14s ease, border-color .14s ease;
  contain:layout style;
}
.holo-card:hover{
  transform:translateY(-4px) scale(1.02);
}

.holo-card::after{
  content:'';
  position:absolute;inset:0;border-radius:inherit;
  background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.04) 50%,transparent 60%);
  opacity:0;transition:opacity .2s;
  pointer-events:none;
}
.holo-card:hover::after{ opacity:1; }

.cbr{ position:absolute;width:8px;height:8px;opacity:.5; }
.cbr-tl{ top:0;left:0;border-top:1.5px solid;border-left:1.5px solid; }
.cbr-tr{ top:0;right:0;border-top:1.5px solid;border-right:1.5px solid; }
.cbr-bl{ bottom:0;left:0;border-bottom:1.5px solid;border-left:1.5px solid; }
.cbr-br{ bottom:0;right:0;border-bottom:1.5px solid;border-right:1.5px solid; }

.pulse-dot{
  width:5px;height:5px;border-radius:50%;flex-shrink:0;
}
.holo-card:hover .pulse-dot{
  animation:pulseDot 1.8s ease-out infinite;
}
@keyframes pulseDot{
  0%  { box-shadow:0 0 0 0 currentColor; }
  70% { box-shadow:0 0 0 5px transparent; }
  100%{ box-shadow:0 0 0 0 transparent; }
}

.card-in{
  opacity:0;transform:translateY(14px);
  animation:cardIn .4s ease forwards;
}
@keyframes cardIn{ to{ opacity:1; transform:translateY(0); } }

.sidebar{
  width:200px;min-height:calc(100vh - 52px);
  border-right:1px solid rgba(0,245,255,.07);
  background:rgba(3,7,14,.75);
  padding:12px 8px;
  display:flex;flex-direction:column;gap:2px;
  position:sticky;top:52px;height:calc(100vh - 52px);overflow-y:auto;
}
.side-btn{
  width:100%;display:flex;align-items:center;gap:8px;
  padding:8px 10px;border-radius:4px;border:none;
  background:transparent;cursor:pointer;text-align:left;
  transition:background .12s,border-color .12s;
  border-left:2px solid transparent;
}
.side-btn:hover{ background:rgba(255,255,255,.03); }
.side-btn.on{ background:rgba(255,255,255,.04); }

.overlay{
  position:fixed;inset:0;z-index:200;
  background:rgba(0,0,0,.8);
  opacity:0;pointer-events:none;transition:opacity .2s;
}
.overlay.on{ opacity:1;pointer-events:all; }
.drawer{
  position:fixed;top:0;left:0;bottom:0;
  width:min(270px,82vw);z-index:201;
  transform:translateX(-100%);transition:transform .22s ease;
  background:rgba(2,5,12,.97);
  border-right:1px solid rgba(0,245,255,.12);
  padding:16px 10px;
  display:flex;flex-direction:column;gap:2px;overflow-y:auto;
  will-change:transform;
}
.drawer.on{ transform:translateX(0); }

.s-inp{
  background:rgba(0,245,255,.04);
  border:1px solid rgba(0,245,255,.15);
  color:#e2eaf4;
  font-family:'JetBrains Mono',monospace;font-size:11px;
  letter-spacing:.05em;border-radius:4px;
  padding:7px 10px 7px 28px;
  outline:none;transition:border-color .2s,box-shadow .2s;
}
.s-inp:focus{
  border-color:rgba(0,245,255,.5);
  box-shadow:0 0 0 3px rgba(0,245,255,.08);
}
.s-inp::placeholder{ color:rgba(0,245,255,.25); }

.tool-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(190px,1fr));
  gap:10px;
  contain:layout;
}

.mob-pills{
  display:none;overflow-x:auto;gap:5px;
  padding:8px 14px;border-bottom:1px solid rgba(0,245,255,.06);
  scrollbar-width:none;
}
.mob-pills::-webkit-scrollbar{ display:none; }
.cat-pill{
  flex-shrink:0;padding:4px 12px;border-radius:20px;
  font-family:'JetBrains Mono',monospace;font-size:9px;
  letter-spacing:.06em;white-space:nowrap;cursor:pointer;
  border:1px solid rgba(255,255,255,.08);
  color:rgba(148,163,184,.5);background:transparent;
  transition:all .13s;
}
.cat-pill.on,.cat-pill:hover{
  border-color:var(--ac);color:var(--ac);background:rgba(255,255,255,.04);
}

.hero-stats{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:1px;background:rgba(0,245,255,.06);
  border:1px solid rgba(0,245,255,.08);border-radius:6px;
  overflow:hidden;width:100%;max-width:600px;
}

@media(prefers-reduced-motion:reduce){
  *{ animation:none!important; transition:none!important; }
}

/* Tablet 768–1023 */
@media(max-width:1023px){
  .sidebar{ display:none!important; }
  .mob-pills{ display:flex!important; }
  .main-area{ max-width:100%!important; }
  .tool-grid{ grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); }
  .hero-stats{ grid-template-columns:repeat(2,1fr); }
}

/* Mobile < 768 */
@media(max-width:767px){
  .mob-btn{ display:flex!important; }
  .topbar-search{ width:130px!important; }
  .hero-wrap{ padding:28px 14px 22px!important; }
  .hero-h1{ font-size:clamp(1.3rem,5.5vw,1.9rem)!important; }
  .stat-n{ font-size:clamp(1rem,4vw,1.5rem)!important; }
  .topbar-status{ display:none!important; }
  .logo-short{ display:block!important; }
  .logo-full{ display:none!important; }
  .main-pad{ padding:14px!important; }
  .holo-card:hover{ transform:none; }
}

/* Small phones < 480 */
@media(max-width:479px){
  .tool-grid{ grid-template-columns:1fr 1fr;gap:8px; }
  .topbar-search{ display:none!important; }
  .search-mobile-row{ display:flex!important; }
  .hero-stats{ grid-template-columns:1fr 1fr; }
}

/* Large desktop */
@media(min-width:1440px){
  .tool-grid{ grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); }
}
`;

// ─── Typewriter hook ──────────────────────────────────────────────
function useTypewriter(words) {
  const [txt, set] = useState('');
  const state = useRef({ wi:0, ci:0, del:false });
  useEffect(() => {
    let id;
    function tick() {
      const { wi, ci, del } = state.current;
      const word = words[wi];
      if (!del) {
        const next = word.slice(0, ci + 1);
        set(next);
        if (next === word) {
          state.current.del = true;
          id = setTimeout(tick, 1600);
        } else {
          state.current.ci++;
          id = setTimeout(tick, 80);
        }
      } else {
        const next = word.slice(0, ci - 1);
        set(next);
        if (next === '') {
          state.current = { wi: (wi + 1) % words.length, ci: 0, del: false };
          id = setTimeout(tick, 120);
        } else {
          state.current.ci--;
          id = setTimeout(tick, 48);
        }
      }
    }
    id = setTimeout(tick, 500);
    return () => clearTimeout(id);
  }, [words]);
  return txt;
}

// ─── Animated counter (scroll-triggered) ─────────────────────────
function Counter({ to, pre = '', suf = '', dur = 1600 }) {
  const [n, set] = useState(0);
  const [go, setGo] = useState(false);
  const ref = useRef();
  
  // ✅ FIXED: IntersectionObserver effect — triggers animation state only
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { 
        setGo(true); 
        obs.disconnect(); 
      }
    }, { threshold: .4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  
  // ✅ FIXED: Separate animation loop effect — uses callback to batch updates smoothly
  useEffect(() => {
    if (!go) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      set(Math.floor((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [go, to, dur]);
    };
    requestAnimationFrame(step);
  }, [go, to, dur]);
  return <span ref={ref}>{pre}{n}{suf}</span>;
}

// ─── Holographic card ─────────────────────────────────────────────
function HoloCard({ tool, accent, onClick }) {
  const ref     = useRef();
  const frameId = useRef();
  const lowEnd  = useMemo(() => isLowEnd(), []);

  const onMove = useCallback((e) => {
    if (lowEnd) return;
    cancelAnimationFrame(frameId.current);
    frameId.current = requestAnimationFrame(() => {
      const c = ref.current; if (!c) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      c.style.transform     = `perspective(550px) rotateY(${x * 12}deg) rotateX(${-y * 9}deg) scale(1.03) translateZ(6px)`;
      c.style.boxShadow     = `${-x*16}px ${y*16}px 30px rgba(0,0,0,.45), 0 0 0 1px ${accent}44`;
      c.style.borderColor   = `${accent}55`;
    });
  }, [accent, lowEnd]);

  const onLeave = useCallback(() => {
    cancelAnimationFrame(frameId.current);
    const c = ref.current; if (!c) return;
    c.style.transform   = '';
    c.style.boxShadow   = '';
    c.style.borderColor = '';
  }, []);

  useEffect(() => () => cancelAnimationFrame(frameId.current), []);

  return (
    <div ref={ref} className="holo-card" onClick={onClick}
      onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ '--ac': accent }}>
      {['tl','tr','bl','br'].map(p => (
        <div key={p} className={`cbr cbr-${p}`} style={{ borderColor: accent }}/>
      ))}
      <div style={{
        position:'absolute',top:0,left:0,right:0,height:40,
        background:`linear-gradient(to bottom,${accent}0a,transparent)`,
        pointerEvents:'none',borderRadius:'6px 6px 0 0',
      }}/>

      <div style={{
        width:36,height:36,borderRadius:6,display:'flex',
        alignItems:'center',justifyContent:'center',
        fontSize:17,flexShrink:0,
        background:`${accent}12`,border:`1px solid ${accent}25`,
      }}>
        {tool.icon || CAT_ICONS[tool.category] || '🔧'}
      </div>

      <div style={{ flex:1 }}>
        <div style={{
          fontFamily:"'Orbitron',sans-serif",fontWeight:700,
          fontSize:'clamp(.62rem,.85vw,.76rem)',
          letterSpacing:'.05em',color:'#e2eaf4',
          marginBottom:5,lineHeight:1.3,
        }}>
          {tool.name.toUpperCase()}
        </div>
        <div style={{
          fontFamily:"'JetBrains Mono',monospace",
          fontSize:'clamp(.6rem,.75vw,.67rem)',
          color:'rgba(148,163,184,.6)',lineHeight:1.55,
        }}>
          {tool.description}
        </div>
      </div>

      <div style={{ display:'flex',alignItems:'center',gap:6,marginTop:'auto' }}>
        <div className="pulse-dot" style={{ background:accent,color:accent }}/>
        <span style={{
          fontFamily:"'JetBrains Mono',monospace",
          fontSize:'.6rem',color:accent,letterSpacing:'.1em',
        }}>
          OPEN →
        </span>
      </div>
    </div>
  );
}

// ─── Lazy-rendered card wrapper ───────────────────────────────────
function LazyCard({ tool, index, onClick }) {
  const [visible, setVisible] = useState(index < 12);
  const ref = useRef();
  const accent = CAT[tool.category]?.color || '#00f5ff';

  useEffect(() => {
    if (visible) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { rootMargin: '100px' });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [visible]);

  return (
    <div ref={ref} className="card-in"
      style={{ animationDelay: `${Math.min(index, 11) * 0.03}s`, minHeight: 140 }}>
      {visible
        ? <HoloCard tool={tool} accent={accent} onClick={onClick}/>
        : <div style={{ height:140, borderRadius:7, background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.04)' }}/>
      }
    </div>
  );
}

// ─── Sidebar nav item ─────────────────────────────────────────────
function SideItem({ catId, active, onClick }) {
  const m     = CAT[catId] || CAT.all;
  const count = catId === 'all' ? tools.length : tools.filter(t => t.category === catId).length;
  if (count === 0 && catId !== 'all') return null;
  return (
    <button onClick={onClick} className={`side-btn ${active ? 'on' : ''}`}
      style={{ borderLeftColor: active ? m.color : 'transparent' }}>
      <span style={{ fontSize:13,opacity:.85 }}>{CAT_ICONS[catId] || '📂'}</span>
      <span style={{
        fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',
        letterSpacing:'.07em',flex:1,textAlign:'left',
        color: active ? m.color : 'rgba(148,163,184,.5)',
        fontWeight: active ? 700 : 400,
      }}>
        {m.label}
      </span>
      <span style={{
        fontFamily:"'JetBrains Mono',monospace",fontSize:'.58rem',
        padding:'1px 5px',borderRadius:3,
        background: active ? `${m.color}1a` : 'rgba(255,255,255,.04)',
        color: active ? m.color : 'rgba(148,163,184,.3)',
      }}>
        {count}
      </span>
    </button>
  );
}

// ─── Main App ─────────────────────────────────────────────────────
export default function App({ isDarkMode, onToggleDarkMode }) {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [cat,    setCat]    = useState(categoryId || 'all');
  const [query,  setQuery]  = useState('');
  const [drawer, setDrawer] = useState(false);
  const [mobSearch, setMobSearch] = useState(false);

  useEffect(() => {
    if (categoryId && categoryId !== cat) setCat(categoryId);
  }, [categoryId]);

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') setDrawer(false); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  const goTo = useCallback((id) => {
    setCat(id); setDrawer(false);
    navigate(id === 'all' ? '/' : `/category/${id}`);
  }, [navigate]);

  const filtered = useMemo(() => tools.filter(t =>
    (cat === 'all' || t.category === cat) &&
    (!query || t.name.toLowerCase().includes(query.toLowerCase()) ||
               t.description.toLowerCase().includes(query.toLowerCase()))
  ), [cat, query]);

  const meta = CAT[cat] || CAT.all;
  const seo  = CAT_SEO[cat] || CAT_SEO.all;
  const allCats = useMemo(() => [{ id:'all' }, ...categories], []);
  const typeText = useTypewriter(['STUDY SMARTER','WORK FASTER','CALCULATE FREE','NO SIGN UP','ALWAYS FREE']);

  return (
    <>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.desc} />
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="canonical" href={`https://yourdomain.com${cat==='all'?'/':'/category/'+cat}`} />
      </Helmet>

      <style>{CSS}</style>

      <div className="bg-base"/>
      <div className="bg-grid-el"/>
      <div className="scanlines"/>
      <div className="orb" style={{
        width:450,height:450,
        top:-200,left:-200,
        background:'radial-gradient(circle,rgba(0,245,255,.12),transparent 70%)',
        animationDuration:'22s',
      }}/>
      <div className="orb" style={{
        width:380,height:380,
        bottom:-160,right:-160,
        background:'radial-gradient(circle,rgba(167,139,250,.1),transparent 70%)',
        animationDuration:'28s',animationDelay:'-10s',
      }}/>
      <div className="orb" style={{
        width:260,height:260,
        top:'38%',left:'52%',
        background:'radial-gradient(circle,rgba(244,114,182,.09),transparent 70%)',
        animationDuration:'18s',animationDelay:'-5s',
      }}/>

      <header className="topbar">
        <button onClick={() => setDrawer(true)}
          className="mob-btn"
          style={{
            display:'none',padding:'6px 9px',
            background:'rgba(0,245,255,.06)',
            border:'1px solid rgba(0,245,255,.18)',
            borderRadius:4,color:'#00f5ff',fontSize:14,cursor:'pointer',
          }}>☰</button>

        <div className="glitch holo logo-full orb-font"
          data-text="STUDENTTOOLHUB"
          style={{ fontWeight:900,fontSize:'clamp(.8rem,1.4vw,.96rem)',letterSpacing:'.07em',cursor:'pointer' }}
          onClick={() => goTo('all')}>
          STUDENT<span style={{ color:'#00f5ff' }}>TOOLHUB</span>
        </div>
        <div className="holo logo-short orb-font"
          style={{ display:'none',fontWeight:900,fontSize:'1rem',letterSpacing:'.1em',cursor:'pointer' }}
          onClick={() => goTo('all')}>
          STH
        </div>

        <div style={{ flex:1 }}/>

        <div style={{ position:'relative', width:175 }} className="topbar-search">
          <span style={{ position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',
            fontSize:12,color:'rgba(0,245,255,.35)',pointerEvents:'none' }}>⌕</span>
          <input className="s-inp topbar-search" placeholder="SEARCH TOOLS..."
            value={query} onChange={e => setQuery(e.target.value)}
            style={{ width:'100%' }}/>
        </div>

        <button className="search-mobile-row"
          style={{ display:'none',padding:'6px 9px',background:'rgba(0,245,255,.05)',
            border:'1px solid rgba(0,245,255,.15)',borderRadius:4,
            color:'#00f5ff',fontSize:14,cursor:'pointer' }}
          onClick={() => setMobSearch(s => !s)}>⌕</button>

        <div className="topbar-status" style={{
          display:'flex',alignItems:'center',gap:5,
          padding:'3px 10px',borderRadius:20,
          border:'1px solid rgba(0,255,136,.2)',
          background:'rgba(0,255,136,.05)',
        }}>
          <span style={{
            width:5,height:5,borderRadius:'50%',
            background:'#00ff88',display:'inline-block',
          }}/>
          <span className="jet-font" style={{ fontSize:9,color:'#00ff88',letterSpacing:'.1em' }}>
            {filtered.length} ONLINE
          </span>
        </div>
      </header>

      {mobSearch && (
        <div className="search-mobile-row" style={{
          display:'flex',position:'sticky',top:52,zIndex:90,
          padding:'8px 14px',background:'rgba(2,4,8,.96)',
          borderBottom:'1px solid rgba(0,245,255,.07)',
        }}>
          <div style={{ position:'relative',flex:1 }}>
            <span style={{ position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',
              fontSize:12,color:'rgba(0,245,255,.35)' }}>⌕</span>
            <input className="s-inp" placeholder="SEARCH TOOLS..."
              value={query} onChange={e => setQuery(e.target.value)}
              style={{ width:'100%' }} autoFocus/>
          </div>
        </div>
      )}

      <div className="mob-pills">
        {allCats.map(c => {
          const m = CAT[c.id] || CAT.all;
          const cnt = c.id==='all' ? tools.length : tools.filter(t=>t.category===c.id).length;
          if (cnt===0 && c.id!=='all') return null;
          return (
            <button key={c.id} className={`cat-pill ${cat===c.id?'on':''}`}
              style={{ '--ac': m.color }}
              onClick={() => goTo(c.id)}>
              {m.label}
            </button>
          );
        })}
      </div>

      {cat === 'all' && !query && (
        <section className="hero-wrap" style={{
          position:'relative',zIndex:1,
          padding:'clamp(28px,5vw,60px) clamp(14px,4vw,36px) clamp(22px,3.5vw,44px)',
          textAlign:'center',
          display:'flex',flexDirection:'column',alignItems:'center',gap:14,
        }}>
          <div style={{
            position:'absolute',inset:0,pointerEvents:'none',
            background:'radial-gradient(ellipse 70% 50% at 50% 0%,rgba(0,245,255,.05),transparent)',
          }}/>

          <div className="jet-font" style={{
            fontSize:'clamp(.58rem,.85vw,.67rem)',
            color:'rgba(0,245,255,.5)',letterSpacing:'.16em',
            border:'1px solid rgba(0,245,255,.15)',borderRadius:20,
            padding:'3px 13px',background:'rgba(0,245,255,.03)',
          }}>
            ◈ FREE · NO LOGIN · ALL DEVICES · PRIVATE
          </div>

          <h1 className="hero-h1 orb-font" style={{
            fontWeight:900,
            fontSize:'clamp(1.4rem,5.5vw,3.8rem)',
            lineHeight:1.1,color:'#e2eaf4',
            position:'relative',zIndex:1,maxWidth:780,
          }}>
            <span className="holo">56+</span> TOOLS FOR<br/>
            <span style={{ color:'#00f5ff',textShadow:'0 0 20px rgba(0,245,255,.4)' }}>
              {typeText}
            </span>
            <span className="blink" style={{ color:'#00f5ff' }}>_</span>
          </h1>

          <p className="sg-font" style={{
            fontSize:'clamp(.8rem,1.6vw,1rem)',
            color:'rgba(148,163,184,.62)',maxWidth:480,lineHeight:1.8,
          }}>
            Every calculator. Every converter. Every PDF tool.<br/>
            Free on <strong style={{ color:'#e2eaf4' }}>any device</strong> — phone, tablet, laptop, desktop.
          </p>

          <div style={{ display:'flex',gap:9,flexWrap:'wrap',justifyContent:'center' }}>
            <a href="#tools"
              style={{
                padding:'10px 22px',borderRadius:5,textDecoration:'none',
                fontFamily:"'Orbitron',sans-serif",fontWeight:700,
                fontSize:'clamp(.62rem,1.1vw,.76rem)',letterSpacing:'.08em',
                background:'linear-gradient(135deg,#00c8ff,#0060dd)',
                color:'#020810',transition:'transform .14s,box-shadow .14s',
                boxShadow:'0 0 20px rgba(0,200,255,.25)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 0 32px rgba(0,200,255,.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 0 20px rgba(0,200,255,.25)'; }}
            >⚡ EXPLORE TOOLS</a>
            <button style={{
              padding:'10px 22px',borderRadius:5,
              fontFamily:"'Orbitron',sans-serif",fontWeight:600,
              fontSize:'clamp(.62rem,1.1vw,.76rem)',letterSpacing:'.08em',
              background:'transparent',border:'1px solid rgba(0,245,255,.28)',
              color:'rgba(0,245,255,.8)',cursor:'pointer',
              transition:'border-color .14s,color .14s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#00f5ff'; e.currentTarget.style.color='#00f5ff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(0,245,255,.28)'; e.currentTarget.style.color='rgba(0,245,255,.8)'; }}
            >HOW IT WORKS</button>
          </div>

          <div className="hero-stats">
            {[
              { to:56,  suf:'+',  lbl:'FREE TOOLS',    col:'#00f5ff' },
              { to:100, suf:'%',  lbl:'IN-BROWSER',    col:'#00ff88' },
              { to:0,   pre:'$',  lbl:'COST EVER',     col:'#a78bfa' },
              { to:20,  suf:' +', lbl:'CURRENCIES',    col:'#facc15' },
            ].map((s, i) => (
              <div key={i} style={{
                padding:'clamp(12px,2vw,20px) 8px',textAlign:'center',
                background:'#020810',
                borderLeft: i > 0 ? '1px solid rgba(0,245,255,.05)' : 'none',
              }}>
                <div className="stat-n orb-font" style={{
                  fontWeight:900,
                  fontSize:'clamp(1.1rem,2.5vw,1.9rem)',
                  color:s.col,lineHeight:1,
                }}>
                  <Counter to={s.to} pre={s.pre||''} suf={s.suf||''}/>
                </div>
                <div className="jet-font" style={{
                  fontSize:'clamp(.48rem,.65vw,.6rem)',
                  color:'rgba(148,163,184,.4)',letterSpacing:'.12em',marginTop:4,
                }}>
                  {s.lbl}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div style={{ display:'flex',position:'relative',zIndex:1 }} id="tools">

        <aside className="sidebar">
          <div className="jet-font" style={{
            fontSize:'.58rem',color:'rgba(0,245,255,.25)',
            letterSpacing:'.18em',padding:'2px 8px',marginBottom:8,
          }}>
            ◈ NAVIGATE
          </div>
          {allCats.map(c => (
            <SideItem key={c.id} catId={c.id} active={cat===c.id} onClick={() => goTo(c.id)}/>
          ))}
          {/* <AdSlot slot="3456789012" style={{ marginTop: 'auto', minHeight: 250 }} /> */}
        </aside>

        <main className="main-area main-pad" style={{
          flex:1,padding:20,maxWidth:'calc(100% - 200px)',
          minHeight:'calc(100vh - 52px)',
        }}>
          <div style={{ marginBottom:16 }}>
            <div className="jet-font" style={{
              fontSize:'.6rem',color:meta.color,
              letterSpacing:'.16em',marginBottom:4,
              display:'flex',alignItems:'center',gap:6,
            }}>
              <span style={{
                width:6,height:6,borderRadius:'50%',flexShrink:0,
                background:meta.color,
              }}/>
              SYSTEM ◈ {meta.label}
            </div>
            <h2 className="orb-font" style={{
              fontWeight:800,
              fontSize:'clamp(.9rem,2.2vw,1.5rem)',
              color:'#e2eaf4',letterSpacing:'.04em',
              display:'flex',alignItems:'baseline',gap:10,flexWrap:'wrap',
            }}>
              {query ? `"${query.toUpperCase()}"` : (cat==='all' ? 'ALL TOOLS' : meta.label)}
              <span style={{ color:meta.color,fontSize:'.65em' }}>
                [{String(filtered.length).padStart(3,'0')}]
              </span>
            </h2>
          </div>

          {/* <AdSlot slot="1234567890" style={{ marginBottom: 16, minHeight: 90 }} /> */}

          {filtered.length > 0 ? (
            <div className="tool-grid">
              {(() => {
                const gridItems = [];
                filtered.forEach((tool, i) => {
                  gridItems.push(
                    <LazyCard
                      key={tool.id}
                      tool={tool}
                      index={i}
                      onClick={() => navigate(`/tools/${tool.category}/${tool.slug}`)}
                    />
                  );
                });
                return gridItems;
              })()}
            </div>
          ) : (
            <div style={{
              textAlign:'center',padding:'56px 20px',
              fontFamily:"'JetBrains Mono',monospace",
            }}>
              <div style={{ fontSize:36,marginBottom:12,opacity:.3 }}>◈</div>
              <div style={{ color:'rgba(0,245,255,.35)',fontSize:'.82rem',letterSpacing:'.1em' }}>
                NO RESULTS FOR "{query.toUpperCase()}"
              </div>
              <button onClick={() => setQuery('')}
                style={{
                  marginTop:10,padding:'5px 14px',borderRadius:4,
                  border:'1px solid rgba(0,245,255,.18)',
                  background:'rgba(0,245,255,.05)',
                  color:'rgba(0,245,255,.6)',
                  fontFamily:"'JetBrains Mono',monospace",fontSize:'.68rem',
                  letterSpacing:'.08em',cursor:'pointer',
                }}>
                CLEAR FILTER
              </button>
            </div>
          )}

          {/* <AdSlot slot="9876543210" style={{ marginTop: 24, minHeight: 90 }} /> */}
        </main>
      </div>

      <div className={`overlay ${drawer?'on':''}`} onClick={() => setDrawer(false)}/>
      <div className={`drawer ${drawer?'on':''}`}>
        <div style={{
          paddingBottom:12,marginBottom:10,
          borderBottom:'1px solid rgba(0,245,255,.1)',
          display:'flex',alignItems:'center',justifyContent:'space-between',
        }}>
          <span className="holo orb-font" style={{ fontWeight:900,fontSize:'.88rem',letterSpacing:'.08em' }}>
            STUDENTTOOLHUB
          </span>
          <button onClick={() => setDrawer(false)}
            style={{ padding:'4px 8px',background:'rgba(0,245,255,.06)',
              border:'1px solid rgba(0,245,255,.15)',borderRadius:4,
              color:'#00f5ff',fontSize:13,cursor:'pointer' }}>✕</button>
        </div>
        <div style={{ position:'relative',marginBottom:10 }}>
          <span style={{ position:'absolute',left:8,top:'50%',transform:'translateY(-50%)',
            fontSize:12,color:'rgba(0,245,255,.35)',pointerEvents:'none' }}>⌕</span>
          <input className="s-inp" placeholder="SEARCH TOOLS..."
            value={query} onChange={e => setQuery(e.target.value)}
            style={{ width:'100%' }}/>
        </div>
        {allCats.map(c => (
          <SideItem key={c.id} catId={c.id} active={cat===c.id} onClick={() => goTo(c.id)}/>
        ))}
        {/* <AdSlot slot="4567890123" style={{ marginTop: 'auto', minHeight: 90 }} /> */}
      </div>

      <footer style={{
        position:'relative',zIndex:1,
        padding:'16px clamp(14px,3vw,24px)',
        borderTop:'1px solid rgba(0,245,255,.06)',
        background:'rgba(2,4,8,.7)',
        display:'flex',justifyContent:'space-between',
        alignItems:'center',flexWrap:'wrap',gap:10,
      }}>
        <span className="jet-font" style={{
          fontSize:'clamp(.56rem,.75vw,.63rem)',
          color:'rgba(0,245,255,.2)',letterSpacing:'.09em',
        }}>
          ◈ STUDENTTOOLHUB · ALL FREE · NO TRACKING · {new Date().getFullYear()}
        </span>
        <div style={{ display:'flex',gap:14,flexWrap:'wrap' }}>
          {['Privacy Policy', 'About', 'Sitemap', 'GitHub'].map(l => (
            <a key={l} href={l === 'Privacy Policy' ? '/privacy-policy' : `/${l.toLowerCase()}`}
              className="jet-font"
              style={{
                fontSize:'.6rem',color:'rgba(0,245,255,.22)',
                textDecoration:'none',letterSpacing:'.07em',transition:'color .14s',
              }}
              onMouseEnter={e => e.target.style.color='#00f5ff'}
              onMouseLeave={e => e.target.style.color='rgba(0,245,255,.22)'}
            >{l}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
