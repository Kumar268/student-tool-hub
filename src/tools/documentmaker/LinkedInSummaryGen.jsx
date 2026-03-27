import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   LINKEDIN SUMMARY GENERATOR — Document Tools Series #5
   Theme: Dark Deep Slate / Electric Blue  ·  Light Cloud / LinkedIn Blue
   Fonts: Plus Jakarta Sans · Space Mono · Instrument Serif
   AI: Anthropic streaming
   Outputs: About Section · Headline · Tagline · Experience bullets
   Formats: Story · Achievement-First · Keyword-Rich · Creative · Minimal
   Tones: 5 tones
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Instrument+Serif:ital@0;1&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Plus Jakarta Sans',sans-serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes blue-glow{0%,100%{box-shadow:0 0 0 0 rgba(96,165,250,.2)}50%{box-shadow:0 0 0 8px rgba(96,165,250,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(600%)}}
@keyframes fadeup{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes countup{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}

.dk{
  --bg:#04080f;--s1:#070d1a;--s2:#0b1424;--s3:#101c30;
  --bdr:#152038;--bdr-hi:rgba(96,165,250,.28);
  --acc:#60a5fa;--acc2:#3b82f6;--acc3:#818cf8;--acc4:#34d399;
  --li:#0a66c2;
  --tx:#e8f0ff;--tx2:#7090c8;--tx3:#152038;--txm:#2a4070;
  --err:#f87171;--succ:#34d399;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 70% 40% at 50% -8%,rgba(96,165,250,.06),transparent),
    radial-gradient(ellipse 40% 50% at 90% 85%,rgba(129,140,248,.04),transparent),
    radial-gradient(ellipse 30% 45% at 10% 60%,rgba(52,211,153,.03),transparent);
}
.lt{
  --bg:#f0f4ff;--s1:#ffffff;--s2:#e8eeff;--s3:#dce4ff;
  --bdr:#c0ccee;--bdr-hi:#0a66c2;
  --acc:#0a66c2;--acc2:#0077b5;--acc3:#6366f1;--acc4:#059669;
  --li:#0a66c2;
  --tx:#0a1628;--tx2:#0a66c2;--tx3:#c0ccee;--txm:#5a78b0;
  --err:#b91c1c;--succ:#047857;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(10,102,194,.06),transparent);
}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(4,8,15,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(240,244,255,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(10,102,194,.07);}

.scanline{position:fixed;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(96,165,250,.3),transparent);
  animation:scan 5s linear infinite;pointer-events:none;z-index:999;}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 15px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;
  font-weight:500;letter-spacing:.04em;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--txm);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(96,165,250,.04);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#94a3b8;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(10,102,194,.04);font-weight:600;}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns:228px 1fr;min-height:calc(100vh - 86px);}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:14px 18px;display:flex;flex-direction:column;gap:14px;overflow-x:hidden;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(10,102,194,.05);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 22px;cursor:pointer;
  font-family:'Plus Jakarta Sans',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.03em;transition:all .16s;border:none;}
.dk .btn{background:var(--acc);color:#04080f;border-radius:3px;animation:blue-glow 2.8s infinite;}
.dk .btn:hover{background:#93c5fd;transform:translateY(-1px);animation:none;box-shadow:0 0 28px rgba(96,165,250,.5);}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;animation:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:9px;box-shadow:0 4px 14px rgba(10,102,194,.28);}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);box-shadow:0 8px 24px rgba(10,102,194,.38);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;}

.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;
  font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:500;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(96,165,250,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(10,102,194,.05);}

.fi{width:100%;outline:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;resize:vertical;}
.dk .fi{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(96,165,250,.1);}
.lt .fi{background:#f4f7ff;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(10,102,194,.08);}
.fi::placeholder{opacity:.3;}

/* LinkedIn mock card */
.li-card{border-radius:8px;overflow:hidden;max-width:680px;}
.dk .li-card{background:#0b1426;border:1px solid rgba(96,165,250,.15);box-shadow:0 4px 32px rgba(0,0,0,.5);}
.lt .li-card{background:#fff;border:1px solid #dce3ee;box-shadow:0 4px 24px rgba(10,102,194,.1);}
.li-banner{height:88px;background:linear-gradient(135deg,#0a66c2,#0091ff);}
.li-avatar{width:72px;height:72px;border-radius:50%;border:3px solid white;
  display:flex;align-items:center;justify-content:center;font-size:28px;
  margin:-36px 0 0 20px;position:relative;z-index:2;}
.dk .li-avatar{background:#1a2a4a;}
.lt .li-avatar{background:#e8f0fe;}
.li-name{font-family:'Plus Jakarta Sans',sans-serif;font-size:20px;font-weight:700;margin-bottom:2px;}
.li-headline{font-size:14px;margin-bottom:4px;}
.dk .li-headline{color:#7090c8;}
.lt .li-headline{color:#555;}
.li-location{font-size:12px;}
.dk .li-location{color:#4a6090;}
.lt .li-location{color:#888;}
.li-section-label{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;}
.dk .li-section-label{color:rgba(96,165,250,.5);}
.lt .li-section-label{color:var(--acc);}
.li-about{font-family:'Plus Jakarta Sans',sans-serif;font-size:14px;line-height:1.78;white-space:pre-wrap;word-break:break-word;}
.dk .li-about{color:#c8d8f0;}
.lt .li-about{color:#1e2a3a;}
.li-divider{height:1px;margin:0;}
.dk .li-divider{background:rgba(96,165,250,.1);}
.lt .li-divider{background:#e8ecf4;}

/* output card */
.out-card{padding:15px 17px;margin-bottom:10px;position:relative;cursor:pointer;transition:all .15s;}
.dk .out-card{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.3);}
.lt .out-card{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(244,247,255,.8);}
.dk .out-card:hover{border-color:rgba(96,165,250,.3);background:rgba(96,165,250,.03);}
.lt .out-card:hover{border-color:rgba(10,102,194,.3);}
.dk .out-card.copied{border-color:var(--succ)!important;}
.lt .out-card.copied{border-color:var(--succ)!important;}

/* format pill */
.fmt-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:99px;
  font-family:'Space Mono',monospace;font-size:9px;font-weight:400;letter-spacing:.04em;margin-bottom:9px;}
.dk .fmt-pill{background:rgba(96,165,250,.08);border:1px solid rgba(96,165,250,.2);color:var(--acc);}
.lt .fmt-pill{background:rgba(10,102,194,.07);border:1.5px solid rgba(10,102,194,.18);color:var(--acc);}

/* char counter */
.char-bar{height:3px;border-radius:2px;transition:width .3s,background .3s;}

/* ai streaming */
.ai-stream{font-family:'Space Mono',monospace;font-size:12px;line-height:1.82;
  padding:16px 18px;min-height:70px;white-space:pre-wrap;word-break:break-word;}
.dk .ai-stream{color:#93c5fd;background:rgba(0,0,0,.5);border:1px solid rgba(96,165,250,.12);border-radius:4px;}
.lt .ai-stream{color:#0a1628;background:#eff4ff;border:1.5px solid rgba(10,102,194,.14);border-radius:10px;}
.cur{display:inline-block;width:7px;height:13px;background:var(--acc);animation:blink .7s infinite;vertical-align:text-bottom;margin-left:1px;}

.lbl{font-family:'Plus Jakarta Sans',sans-serif;font-size:9px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(96,165,250,.42);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(96,165,250,.28);}
.lt .slbl{color:var(--acc);}

.prog{height:3px;border-radius:2px;overflow:hidden;}
.dk .prog{background:rgba(96,165,250,.1);}
.lt .prog{background:rgba(10,102,194,.08);}
.prog-bar{height:100%;border-radius:2px;transition:width .4s;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(96,165,250,.01);border:1px dashed rgba(96,165,250,.09);border-radius:3px;}
.lt .ad{background:rgba(10,102,194,.015);border:1.5px dashed rgba(10,102,194,.1);border-radius:9px;}
.ad span{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

.tone-btn{padding:6px 12px;cursor:pointer;border:none;font-family:'Plus Jakarta Sans',sans-serif;
  font-size:10.5px;font-weight:500;transition:all .13s;display:flex;align-items:center;gap:5px;}
.dk .tone-btn{background:transparent;border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .tone-btn.on{background:rgba(96,165,250,.08);border-color:var(--acc);color:var(--acc);}
.lt .tone-btn{background:transparent;border:1.5px solid var(--bdr);border-radius:8px;color:var(--txm);}
.lt .tone-btn.on{background:rgba(10,102,194,.06);border-color:var(--acc);color:var(--acc);}
`;

const FORMATS = [
  {id:'story',    label:'Story',          emoji:'📖', desc:'First-person narrative arc — background, present, mission'},
  {id:'achieve',  label:'Achievement-First',emoji:'🏆',desc:'Lead with wins and numbers, then context'},
  {id:'keyword',  label:'Keyword-Rich',   emoji:'🔍', desc:'ATS-optimised, dense with industry terms'},
  {id:'creative', label:'Creative',       emoji:'✨', desc:'Bold opener, personality-forward, memorable'},
  {id:'minimal',  label:'Minimal',        emoji:'○',  desc:'Short, punchy, 3–5 lines only'},
];

const TONES = [
  {id:'approachable', label:'Approachable', emoji:'😊'},
  {id:'authoritative',label:'Authoritative',emoji:'🎯'},
  {id:'inspirational',label:'Inspirational',emoji:'🌟'},
  {id:'technical',    label:'Technical',    emoji:'⚙️'},
  {id:'creative',     label:'Creative',     emoji:'🎨'},
];

const TABS = [
  {id:'info',     label:'👤 Your Info'},
  {id:'generate', label:'✦ Generate'},
  {id:'outputs',  label:'📋 Outputs'},
  {id:'preview',  label:'🔗 LinkedIn Preview'},
  {id:'tips',     label:'? Tips'},
];

const wc = s => s ? s.trim().split(/\s+/).filter(Boolean).length : 0;
const cc = s => (s||'').length;

const EMPTY = {
  name:'', headline:'', location:'', currentRole:'', company:'', industry:'',
  yearsExp:'', topSkills:'', achievement1:'', achievement2:'',
  personality:'', mission:'', keywords:'', emoji_style: true,
};

export default function LinkedInSummaryGenerator() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';

  const [tab,    setTab]   = useState('info');
  const [format, setFormat]= useState('story');
  const [tone,   setTone]  = useState('approachable');
  const [data,   setData]  = useState({...EMPTY});

  /* outputs */
  const [about,    setAbout]    = useState('');
  const [headline, setHeadline] = useState('');
  const [tagline,  setTagline]  = useState('');
  const [bullets,  setBullets]  = useState('');

  /* streaming */
  const [streaming, setStreaming] = useState('');
  const [aiLoad,    setAiLoad]   = useState(false);
  const [aiTarget,  setAiTarget] = useState('');
  const [aiErr,     setAiErr]    = useState('');

  /* copy flash */
  const [copied, setCopied] = useState('');

  const set = (k,v) => setData(p=>({...p,[k]:v}));

  const filled = [data.name, data.currentRole, data.topSkills, data.achievement1].filter(Boolean).length;
  const pct = Math.round((filled/4)*100);

  /* ── COPY HELPER ── */
  const copyText = (text, id) => {
    try { navigator.clipboard.writeText(text); } catch {}
    setCopied(id);
    setTimeout(() => setCopied(''), 1800);
  };

  /* ── BUILD PROMPTS ── */
  const buildAboutPrompt = () => {
    const formatGuides = {
      story:   'Write in a narrative first-person story arc: who you are, what you do, what drives you. 3–4 paragraphs.',
      achieve: 'Lead with your biggest quantified achievement in the first sentence. Then explain your background and what makes you valuable. 3 paragraphs.',
      keyword: 'Write keyword-rich text that will rank well in LinkedIn search. Naturally weave in 8–12 industry keywords. 3 paragraphs.',
      creative:'Start with a bold, memorable hook (not cliché). Inject personality. Be distinctive and human. 3 paragraphs.',
      minimal: 'Write an ultra-concise About section — maximum 5 lines, 60 words. Punchy and direct.',
    };

    return `Write a LinkedIn "About" section.
Format: ${formatGuides[format]}
Tone: ${tone}
${data.emoji_style ? 'Use 2–3 relevant emojis naturally (not at every line start).' : 'No emojis.'}

Person: ${data.name||'the person'}
Current role: ${data.currentRole||''}${data.company?' at '+data.company:''}
Industry: ${data.industry||''}
Years of experience: ${data.yearsExp||''}
Top skills: ${data.topSkills||''}
Key achievement 1: ${data.achievement1||''}
Key achievement 2: ${data.achievement2||''}
Personality / values: ${data.personality||''}
Mission / what drives them: ${data.mission||''}
Keywords to include: ${data.keywords||''}

Output ONLY the About section text. No preamble, no labels, no markdown.`;
  };

  const buildHeadlinePrompt = () =>
    `Write 3 compelling LinkedIn headline options for ${data.name||'someone'}, a ${data.currentRole||'professional'}${data.company?' at '+data.company:''}.
Skills: ${data.topSkills||''}. Tone: ${tone}.
Rules: Max 220 characters each. Use | or · as separators. Be specific, not generic. No "Passionate about" clichés.
Output: 3 headlines, one per line, no numbering or labels.`;

  const buildTaglinePrompt = () =>
    `Write 5 short LinkedIn tagline options (each under 60 chars) for ${data.name||'someone'}, ${data.currentRole||'professional'}.
These appear as a one-liner status or featured section subheading.
Tone: ${tone}. ${data.emoji_style?'1 emoji each allowed.':'No emojis.'}
Output: 5 taglines, one per line, no numbering.`;

  const buildBulletsPrompt = () =>
    `Write 4 strong LinkedIn-style experience bullet points for: ${data.currentRole||'this role'}${data.company?' at '+data.company:''}.
Context: ${data.achievement1||''} ${data.achievement2||''}. Skills: ${data.topSkills||''}.
Rules: Start each with a strong action verb. Include metrics. 1–2 sentences each.
Output: 4 bullets, each starting with • on a new line.`;

  /* ── STREAM ── */
  const runStream = async (prompt, target, setter) => {
    setAiLoad(true); setStreaming(''); setAiErr(''); setAiTarget(target);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:900, stream:true,
          messages:[{role:'user', content:prompt}]}),
      });
      if(!res.ok){setAiErr('API error');setAiLoad(false);return;}
      const reader=res.body.getReader(); const dec=new TextDecoder(); let buf=''; let full='';
      while(true){
        const{done,value}=await reader.read(); if(done) break;
        buf+=dec.decode(value,{stream:true});
        const lines=buf.split('\n'); buf=lines.pop();
        for(const ln of lines){
          if(!ln.startsWith('data: ')) continue;
          const p=ln.slice(6); if(p==='[DONE]') break;
          try{const o=JSON.parse(p);if(o.type==='content_block_delta'&&o.delta?.type==='text_delta'){
            full+=o.delta.text; setStreaming(v=>v+o.delta.text);
          }}catch{}
        }
      }
      setter(full);
    }catch(e){setAiErr(e.message);}
    finally{setAiLoad(false); setAiTarget('');}
  };

  /* ── CHAR COUNTER DISPLAY ── */
  const CharBar = ({text, max, warn}) => {
    const len = cc(text);
    const pct = Math.min((len/max)*100, 100);
    const color = len > max ? '#f87171' : len > warn ? '#fbbf24' : '#34d399';
    return (
      <div style={{marginTop:4}}>
        <div style={{height:3,background:'rgba(255,255,255,.06)',borderRadius:2,overflow:'hidden'}}>
          <div className="char-bar" style={{width:`${pct}%`,background:color}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:3}}>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:'var(--txm)'}}>
            {len} / {max} chars
          </span>
          {len > max && <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:'#f87171'}}>⚠ Over limit</span>}
          {len > warn && len <= max && <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:'#fbbf24'}}>Near limit</span>}
        </div>
      </div>
    );
  };

  /* ── OUTPUT CARD ── */
  const OutCard = ({id, label, text, maxChars, warnChars, onEdit, onRegen, regenPrompt, regenSetter}) => (
    <div className={`out-card ${copied===id?'copied':''}`}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
        <div style={{display:'flex',gap:7,alignItems:'center'}}>
          <span style={{fontFamily:"'Space Mono',monospace",fontSize:10,fontWeight:700,color:'var(--acc)'}}>{label}</span>
          {text&&<span style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:'var(--txm)'}}>{wc(text)} words</span>}
        </div>
        <div style={{display:'flex',gap:5}}>
          {text&&<button className="gbtn" onClick={()=>copyText(text,id)} style={{fontSize:9,padding:'3px 8px'}}>
            {copied===id?'✓ Copied':'⎘ Copy'}
          </button>}
          {text&&<button className="gbtn" onClick={()=>runStream(regenPrompt(),id,regenSetter)} disabled={aiLoad}
            style={{fontSize:9,padding:'3px 8px'}}>⟳ Redo</button>}
        </div>
      </div>
      {text ? (
        <>
          <textarea className="fi" rows={id==='about'?8:id==='bullets'?5:2}
            style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,lineHeight:1.75}}
            value={text} onChange={e=>onEdit(e.target.value)}/>
          {maxChars && <CharBar text={text} max={maxChars} warn={warnChars||maxChars*.85}/>}
        </>
      ) : (
        <div style={{padding:'18px 0',textAlign:'center',fontFamily:"'Space Mono',monospace",fontSize:10,color:'var(--txm)'}}>
          Not generated yet — use ✦ Generate tab
        </div>
      )}
    </div>
  );

  /* ════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {dark&&<div className="scanline"/>}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:32,height:32,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:15,borderRadius:dark?3:9,
              border:dark?'1px solid rgba(96,165,250,.3)':'none',
              background:dark?'rgba(96,165,250,.08)':'#0a66c2',
              boxShadow:dark?'0 0 16px rgba(96,165,250,.2)':'0 3px 10px rgba(10,102,194,.35)',
              color:dark?'inherit':'white',fontWeight:700,fontFamily:'sans-serif',
            }}>in</div>
            <div>
              <div style={{fontFamily:"'Instrument Serif',serif",fontSize:17,color:'var(--tx)',lineHeight:1}}>
                LinkedIn Summary<span style={{color:'var(--acc)'}}> Generator</span>
                <span style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #5 · 5 formats · 5 tones · AI-powered
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <div style={{width:90}}>
              <div className="prog"><div className="prog-bar" style={{width:`${pct}%`}}/></div>
              <div style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:'var(--txm)',textAlign:'right',marginTop:3}}>{pct}% ready</div>
            </div>
          </div>
          <button onClick={()=>setDark(d=>!d)} style={{
            display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(96,165,250,.2)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer',
          }}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#c0ccee',
              boxShadow:dark?'0 0 8px rgba(96,165,250,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#04080f':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'Space Mono',monospace",fontSize:8.5,color:'var(--txm)'}}>{dark?'VOID':'LIGHT'}</span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>
              {t.label}
              {t.id==='outputs'&&(about||headline)&&
                <span style={{width:6,height:6,borderRadius:'50%',background:'var(--succ)',display:'inline-block',marginLeft:4}}/>}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="body">
          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* Format */}
            <div>
              <div className="slbl">About format</div>
              {FORMATS.map(f=>(
                <button key={f.id} onClick={()=>setFormat(f.id)} style={{
                  width:'100%',display:'flex',alignItems:'center',gap:8,
                  padding:'7px 9px',marginBottom:4,cursor:'pointer',
                  border:format===f.id?`1px solid var(--acc)`:(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                  borderRadius:dark?3:7,
                  background:format===f.id?(dark?'rgba(96,165,250,.06)':'rgba(10,102,194,.05)'):'transparent',
                }}>
                  <span style={{fontSize:14,flexShrink:0}}>{f.emoji}</span>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11.5,fontWeight:600,
                      color:format===f.id?'var(--acc)':'var(--tx)'}}>{f.label}</div>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:7.5,color:'var(--txm)',marginTop:1,lineHeight:1.4}}>{f.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Tone */}
            <div>
              <div className="slbl">Tone</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {TONES.map(t=>(
                  <button key={t.id} className={`tone-btn ${tone===t.id?'on':''}`}
                    onClick={()=>setTone(t.id)}>
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Emoji toggle */}
            <div>
              <div className="slbl">Options</div>
              <button onClick={()=>set('emoji_style',!data.emoji_style)} style={{
                width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',
                padding:'7px 10px',background:'transparent',cursor:'pointer',
                border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                borderRadius:dark?3:7,
              }}>
                <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,color:'var(--tx)'}}>Use emojis</span>
                <div style={{width:28,height:14,borderRadius:8,position:'relative',
                  background:data.emoji_style?'var(--acc)':'rgba(255,255,255,.1)',
                  transition:'background .2s'}}>
                  <div style={{position:'absolute',top:2.5,
                    left:data.emoji_style?'auto':2,right:data.emoji_style?2:'auto',
                    width:9,height:9,borderRadius:'50%',
                    background:'white',transition:'all .2s'}}/>
                </div>
              </button>
            </div>

            <div>
              <div className="slbl">Quick actions</div>
              <button className="gbtn" onClick={()=>copyText(about,'about-sb')} disabled={!about}
                style={{width:'100%',justifyContent:'flex-start',padding:'7px 10px',marginBottom:4}}>
                ⎘ Copy About
              </button>
              <button className="gbtn" onClick={()=>copyText(headline,'hl-sb')} disabled={!headline}
                style={{width:'100%',justifyContent:'flex-start',padding:'7px 10px',marginBottom:4}}>
                ⎘ Copy Headlines
              </button>
              <button className="gbtn" onClick={()=>copyText(tagline,'tg-sb')} disabled={!tagline}
                style={{width:'100%',justifyContent:'flex-start',padding:'7px 10px'}}>
                ⎘ Copy Taglines
              </button>
            </div>

            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ╔══ YOUR INFO ══╗ */}
              {tab==='info'&&(
                <motion.div key="info" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Basic Profile</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      {[
                        ['Full Name','name','text','Jane Smith'],
                        ['Location','location','text','San Francisco Bay Area'],
                        ['Current Role / Title','currentRole','text','Senior Product Manager'],
                        ['Company','company','text','Stripe'],
                        ['Industry','industry','text','FinTech / SaaS'],
                        ['Years of Experience','yearsExp','text','8 years'],
                      ].map(([l,k,t,ph])=>(
                        <div key={k}>
                          <label className="lbl">{l}</label>
                          <input className="fi" type={t} placeholder={ph} value={data[k]||''} onChange={e=>set(k,e.target.value)}/>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Skills & Achievements</div>
                    <div style={{display:'flex',flexDirection:'column',gap:9}}>
                      <div>
                        <label className="lbl">Top skills (comma-separated)</label>
                        <input className="fi" placeholder="Product strategy, growth, A/B testing, SQL, stakeholder management, roadmapping…"
                          value={data.topSkills||''} onChange={e=>set('topSkills',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Key achievement #1 (with numbers if possible)</label>
                        <input className="fi" placeholder="Launched payments feature used by 2M+ merchants, drove $50M ARR"
                          value={data.achievement1||''} onChange={e=>set('achievement1',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Key achievement #2 (optional)</label>
                        <input className="fi" placeholder="Grew team from 3 to 14 engineers, shipped 4 major product lines in 2 years"
                          value={data.achievement2||''} onChange={e=>set('achievement2',e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Personality & Mission</div>
                    <div style={{display:'flex',flexDirection:'column',gap:9}}>
                      <div>
                        <label className="lbl">Personality / values (how would colleagues describe you?)</label>
                        <input className="fi" placeholder="Direct communicator, data-driven, loves mentoring junior PMs, builder at heart"
                          value={data.personality||''} onChange={e=>set('personality',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Mission / what drives you?</label>
                        <input className="fi" placeholder="Making financial tools accessible to small businesses worldwide"
                          value={data.mission||''} onChange={e=>set('mission',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Keywords to rank for (LinkedIn search terms)</label>
                        <input className="fi" placeholder="product manager, fintech, SaaS, growth, B2B, API products, platform strategy"
                          value={data.keywords||''} onChange={e=>set('keywords',e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ╔══ GENERATE ══╗ */}
              {tab==='generate'&&(
                <motion.div key="generate" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  {/* Status chips */}
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    {[
                      {label:'Format', val:FORMATS.find(f=>f.id===format)?.label},
                      {label:'Tone',   val:TONES.find(t=>t.id===tone)?.label},
                      {label:'Emojis', val:data.emoji_style?'On':'Off'},
                    ].map(({label,val})=>(
                      <div key={label} style={{padding:'4px 10px',
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        borderRadius:dark?3:7,display:'flex',gap:5,alignItems:'center'}}>
                        <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:'var(--txm)'}}>{label}:</span>
                        <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,fontWeight:600,color:'var(--acc)'}}>{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Generate buttons */}
                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:12}}>Generate each section</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                      {[
                        {id:'about',    icon:'📝',label:'About Section',     sub:'Full "About" · 200–2600 chars',  prompt:buildAboutPrompt,    setter:setAbout},
                        {id:'headline', icon:'🏷',label:'Headline Options',  sub:'3 variations · max 220 chars',   prompt:buildHeadlinePrompt, setter:setHeadline},
                        {id:'tagline',  icon:'⚡',label:'Tagline Options',   sub:'5 short taglines · under 60 chars',prompt:buildTaglinePrompt, setter:setTagline},
                        {id:'bullets',  icon:'📌',label:'Experience Bullets',sub:'4 bullet points for your role',  prompt:buildBulletsPrompt,  setter:setBullets},
                      ].map(({id,icon,label,sub,prompt,setter})=>(
                        <button key={id}
                          onClick={()=>runStream(prompt(),id,setter)}
                          disabled={aiLoad}
                          style={{
                            padding:'13px 14px',cursor:aiLoad?'not-allowed':'pointer',
                            border:dark?`1px solid ${(about&&id==='about')||(headline&&id==='headline')||(tagline&&id==='tagline')||(bullets&&id==='bullets')?'rgba(52,211,153,.3)':'var(--bdr)'}`:
                              `1.5px solid ${(about&&id==='about')||(headline&&id==='headline')||(tagline&&id==='tagline')||(bullets&&id==='bullets')?'rgba(4,120,87,.4)':'var(--bdr)'}`,
                            borderRadius:dark?3:9,background:'transparent',
                            display:'flex',flexDirection:'column',alignItems:'flex-start',gap:5,
                            transition:'all .15s',
                            opacity:aiLoad&&aiTarget!==id?.5:1,
                          }}>
                          <div style={{display:'flex',alignItems:'center',gap:7,width:'100%'}}>
                            <span style={{fontSize:18}}>{icon}</span>
                            <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:600,color:'var(--tx)'}}>
                              {label}
                            </span>
                            {aiLoad&&aiTarget===id&&<span style={{marginLeft:'auto',display:'inline-block',animation:'spin .8s linear infinite',fontSize:12,color:'var(--acc)'}}>⟳</span>}
                            {((about&&id==='about')||(headline&&id==='headline')||(tagline&&id==='tagline')||(bullets&&id==='bullets'))&&!(aiLoad&&aiTarget===id)&&
                              <span style={{marginLeft:'auto',fontSize:10,color:'var(--succ)'}}>✓</span>}
                          </div>
                          <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:'var(--txm)'}}>{sub}</span>
                        </button>
                      ))}
                    </div>
                    <div style={{marginTop:12}}>
                      <button className="btn"
                        onClick={async()=>{
                          await runStream(buildAboutPrompt(),'about',setAbout);
                          await runStream(buildHeadlinePrompt(),'headline',setHeadline);
                          await runStream(buildTaglinePrompt(),'tagline',setTagline);
                        }}
                        disabled={aiLoad}
                        style={{width:'100%',padding:'11px',fontSize:13}}>
                        {aiLoad?<><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;Generating…</>
                          :'✦ Generate All at Once'}
                      </button>
                    </div>
                  </div>

                  {/* Streaming display */}
                  {(streaming||aiLoad)&&(
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
                        <label className="lbl">✦ Streaming — {aiTarget}</label>
                        <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:'var(--txm)'}}>{wc(streaming)} words</span>
                      </div>
                      <div className="ai-stream">
                        {streaming}
                        {aiLoad&&<span className="cur"/>}
                      </div>
                    </div>
                  )}
                  {aiErr&&<div style={{padding:'9px 13px',borderRadius:dark?3:8,
                    background:dark?'rgba(248,113,113,.05)':'rgba(185,28,28,.04)',
                    border:dark?'1px solid rgba(248,113,113,.18)':'1.5px solid rgba(185,28,28,.12)',
                    fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12.5,color:'var(--err)'}}>⚠ {aiErr}</div>}

                  {(about||headline)&&!aiLoad&&(
                    <button className="gbtn" onClick={()=>setTab('outputs')}
                      style={{alignSelf:'flex-start',borderColor:'var(--succ)',color:'var(--succ)'}}>
                      ✓ View outputs →
                    </button>
                  )}
                  
                </motion.div>
              )}

              {/* ╔══ OUTPUTS ══╗ */}
              {tab==='outputs'&&(
                <motion.div key="outputs" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:0}}>
                  <OutCard id="about"   label="📝 About Section"      text={about}   onEdit={setAbout}
                    maxChars={2600} warnChars={2200}
                    regenPrompt={buildAboutPrompt}   regenSetter={setAbout}/>
                  <OutCard id="headline"label="🏷 Headline Options"   text={headline} onEdit={setHeadline}
                    maxChars={660} warnChars={580}
                    regenPrompt={buildHeadlinePrompt} regenSetter={setHeadline}/>
                  <OutCard id="tagline" label="⚡ Taglines"           text={tagline}  onEdit={setTagline}
                    maxChars={300}
                    regenPrompt={buildTaglinePrompt}  regenSetter={setTagline}/>
                  <OutCard id="bullets" label="📌 Experience Bullets" text={bullets}  onEdit={setBullets}
                    regenPrompt={buildBulletsPrompt}  regenSetter={setBullets}/>
                  
                </motion.div>
              )}

              {/* ╔══ LINKEDIN PREVIEW ══╗ */}
              {tab==='preview'&&(
                <motion.div key="preview" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:'var(--txm)',letterSpacing:'.1em',textTransform:'uppercase'}}>
                    LinkedIn profile mockup — not the real LinkedIn UI
                  </div>
                  <div className="li-card">
                    {/* Banner */}
                    <div className="li-banner"/>
                    {/* Avatar + name */}
                    <div style={{padding:'0 20px 16px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:10}}>
                        <div className="li-avatar">
                          {data.name ? data.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div style={{display:'flex',gap:6,paddingBottom:4}}>
                          <div style={{padding:'5px 14px',borderRadius:20,fontSize:12,fontWeight:600,cursor:'pointer',
                            background:'var(--acc)',color:dark?'#04080f':'white'}}>Connect</div>
                          <div style={{padding:'5px 14px',borderRadius:20,fontSize:12,fontWeight:600,cursor:'pointer',
                            border:dark?'1.5px solid var(--acc)':'1.5px solid var(--acc)',color:'var(--acc)',background:'transparent'}}>Message</div>
                        </div>
                      </div>
                      <div className="li-name">{data.name||'Your Name'}</div>
                      {/* Headline — show first generated option or input */}
                      <div className="li-headline">
                        {headline ? headline.split('\n')[0] : (data.currentRole||'Your headline here')}
                      </div>
                      <div className="li-location">{data.location||'Your Location'}</div>
                    </div>

                    <div className="li-divider"/>

                    {/* About section */}
                    <div style={{padding:'16px 20px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:700}}>About</div>
                        {about&&<button className="gbtn" onClick={()=>copyText(about,'about-preview')} style={{fontSize:9}}>
                          {copied==='about-preview'?'✓ Copied':'⎘ Copy'}
                        </button>}
                      </div>
                      <div className="li-about">
                        {about || (
                          <span style={{opacity:.35,fontStyle:'italic'}}>
                            Your About section will appear here after generation.{'\n'}Go to ✦ Generate → About Section.
                          </span>
                        )}
                      </div>
                      {about&&<CharBar text={about} max={2600} warn={2200}/>}
                    </div>

                    <div className="li-divider"/>

                    {/* Headline options */}
                    {headline&&(
                      <div style={{padding:'16px 20px'}}>
                        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:700,marginBottom:10}}>
                          🏷 Headline Options
                        </div>
                        {headline.split('\n').filter(Boolean).map((h,i)=>(
                          <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                            padding:'8px 12px',marginBottom:6,borderRadius:dark?3:8,
                            border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                            background:dark?'rgba(0,0,0,.2)':'rgba(244,247,255,.6)'}}>
                            <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,flex:1,paddingRight:10}}>{h}</span>
                            <div style={{display:'flex',gap:4,flexShrink:0}}>
                              <span style={{fontFamily:"'Space Mono',monospace",fontSize:8,color:'var(--txm)',alignSelf:'center'}}>{cc(h)}</span>
                              <button className="gbtn" onClick={()=>copyText(h,'hl-'+i)} style={{fontSize:9,padding:'2px 7px'}}>
                                {copied==='hl-'+i?'✓':'⎘'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {tagline&&(
                      <>
                        <div className="li-divider"/>
                        <div style={{padding:'16px 20px'}}>
                          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:700,marginBottom:10}}>
                            ⚡ Tagline Options
                          </div>
                          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                            {tagline.split('\n').filter(Boolean).map((t,i)=>(
                              <div key={i}
                                onClick={()=>copyText(t,'tl-'+i)}
                                style={{padding:'6px 13px',borderRadius:99,cursor:'pointer',
                                  border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                                  background:copied==='tl-'+i?(dark?'rgba(52,211,153,.1)':'rgba(4,120,87,.07)'):
                                    (dark?'rgba(96,165,250,.05)':'rgba(10,102,194,.04)'),
                                  borderColor:copied==='tl-'+i?'var(--succ)':'',
                                  fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:'var(--tx)',
                                  transition:'all .2s'}}>
                                {t} {copied==='tl-'+i&&<span style={{color:'var(--succ)',marginLeft:4}}>✓</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                </motion.div>
              )}

              {/* ╔══ TIPS ══╗ */}
              {tab==='tips'&&(
                <motion.div key="tips" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div className="panel" style={{padding:'20px 22px'}}>
                    <div style={{fontFamily:"'Instrument Serif',serif",fontSize:22,color:'var(--tx)',marginBottom:4}}>
                      LinkedIn About section — what actually works
                    </div>
                    <div style={{fontFamily:"'Space Mono',monospace",fontSize:9,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:18}}>
                      recruiter-approved · 2025 algorithm
                    </div>

                    {/* Char limits reference */}
                    <div style={{marginBottom:18,padding:'13px 14px',borderRadius:dark?3:9,
                      border:dark?'1px solid rgba(96,165,250,.15)':'1.5px solid rgba(10,102,194,.15)',
                      background:dark?'rgba(96,165,250,.04)':'rgba(10,102,194,.03)'}}>
                      <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:700,color:'var(--acc)',marginBottom:8}}>
                        LinkedIn Character Limits
                      </div>
                      {[
                        ['About section',    '2,600 chars max',  'Aim for 1,500–2,200 for best engagement'],
                        ['Headline',         '220 chars max',    'Most people only fill ~100. Stand out by using the full 220.'],
                        ['Current position', '100 chars',        'Title only — use headline for more context'],
                        ['Featured section', 'No text limit',    'Add a link, post, or PDF of your work here'],
                      ].map(([field,limit,tip])=>(
                        <div key={field} style={{display:'flex',gap:10,marginBottom:7,alignItems:'flex-start'}}>
                          <div style={{minWidth:130,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:600,color:'var(--tx)'}}>{field}</div>
                          <div style={{minWidth:90,fontFamily:"'Space Mono',monospace",fontSize:10,color:'var(--acc)'}}>{limit}</div>
                          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:'var(--tx2)',lineHeight:1.5}}>{tip}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
                      {[
                        {icon:'🎣',t:'Hook in line 1',   b:'Only 2 lines show before "See more". Make them magnetic. Don\'t start with "I am a…" — start with impact.'},
                        {icon:'🔢',t:'Numbers win',       b:'"Grew team from 4 to 22" > "Led a team". Recruiters search for specific terms and scan for proof.'},
                        {icon:'🔍',t:'Keyword placement', b:'Put your most important keywords in the first 40 words. LinkedIn\'s algorithm weights early keywords heavily.'},
                        {icon:'📞',t:'End with a CTA',    b:'The last line should invite action: "Open to PM roles at climate-tech startups — DM me" or a contact link.'},
                        {icon:'💬',t:'Write like you talk',b:'Stiff corporate speak puts people off. Your About section should sound like you at your best, not a job spec.'},
                        {icon:'🔄',t:'Update quarterly',  b:'Fresh profiles rank higher. Even small edits (fixing a typo, updating a number) signal activity to the algorithm.'},
                      ].map(({icon,t,b})=>(
                        <div key={t} style={{padding:'11px 13px',borderRadius:dark?3:9,
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          background:dark?'rgba(0,0,0,.2)':'rgba(240,244,255,.8)'}}>
                          <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:5}}>
                            <span style={{fontSize:16}}>{icon}</span>
                            <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:600,color:'var(--tx)'}}>{t}</span>
                          </div>
                          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12.5,color:'var(--tx2)',lineHeight:1.65}}>{b}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{fontFamily:"'Instrument Serif',serif",fontSize:16,color:'var(--tx)',marginBottom:10}}>
                      Format guide
                    </div>
                    {FORMATS.map(f=>(
                      <div key={f.id} style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:8,
                        padding:'8px 11px',borderRadius:dark?2:7,
                        background:format===f.id?(dark?'rgba(96,165,250,.05)':'rgba(10,102,194,.04)'):
                          (dark?'rgba(0,0,0,.15)':'rgba(240,244,255,.7)'),
                        border:format===f.id?(dark?'1px solid rgba(96,165,250,.2)':'1.5px solid rgba(10,102,194,.15)'):
                          (dark?'1px solid transparent':'1.5px solid transparent')}}>
                        <span style={{fontSize:15,flexShrink:0,marginTop:1}}>{f.emoji}</span>
                        <div>
                          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:600,color:'var(--acc)',marginBottom:2}}>{f.label}</div>
                          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:'var(--tx2)',lineHeight:1.6}}>{f.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}