import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   STATEMENT OF PURPOSE (SOP) GENERATOR — Document Tools #12
   Theme: Dark Void / Electric Amber  ·  Light Cream / Deep Mahogany
   Fonts: Fraunces · Outfit · JetBrains Mono
   Aesthetic: Premium editorial — ink on parchment, amber spark
   Program types: Masters · PhD · MBA · Law · Medical · Engineering · Arts · Undergrad Transfer
   Tones: Scholarly · Ambitious · Reflective · Technical · Narrative
   AI: Full SOP + paragraph-level rewrites + opening hook generator
   Features: Word count tracker · Print/PDF · Section-by-section build
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,300;1,9..144,400;1,9..144,600&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Outfit',sans-serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes amber-pulse{0%,100%{box-shadow:0 0 0 0 rgba(251,191,36,.18)}50%{box-shadow:0 0 0 8px rgba(251,191,36,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(600%)}}
@keyframes inkdrop{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@keyframes glow{0%,100%{text-shadow:0 0 8px rgba(251,191,36,.3)}50%{text-shadow:0 0 20px rgba(251,191,36,.6)}}

.dk{
  --bg:#060401;--s1:#0c0802;--s2:#110c03;--s3:#181004;
  --bdr:#2a1e04;--bdr-hi:rgba(251,191,36,.28);
  --acc:#fbbf24;--acc2:#f59e0b;--acc3:#6ee7b7;--acc4:#c084fc;
  --tx:#fef3c7;--tx2:#a07820;--tx3:#2a1e04;--txm:#4a380a;
  --err:#fca5a5;--succ:#6ee7b7;--warn:#fde68a;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -10%,rgba(251,191,36,.06),transparent),
    radial-gradient(ellipse 50% 60% at 95% 80%,rgba(192,132,252,.04),transparent),
    radial-gradient(ellipse 40% 50% at 5% 50%,rgba(110,231,183,.02),transparent);
}
.lt{
  --bg:#fdf8f0;--s1:#ffffff;--s2:#faf3e0;--s3:#f5e8c8;
  --bdr:#e0cfa0;--bdr-hi:#5c2d0a;
  --acc:#7c3410;--acc2:#a04020;--acc3:#0f766e;--acc4:#7e22ce;
  --tx:#1c0e04;--tx2:#7c3410;--tx3:#e0cfa0;--txm:#8a6040;
  --err:#991b1b;--succ:#065f46;--warn:#92400e;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(124,52,16,.05),transparent);
}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(6,4,1,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(253,248,240,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(124,52,16,.07);}

.scanline{position:fixed;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(251,191,36,.35),transparent);
  animation:scan 5s linear infinite;pointer-events:none;z-index:999;}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 15px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'Outfit',sans-serif;font-size:11px;
  font-weight:600;letter-spacing:.04em;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--txm);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(251,191,36,.04);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#94a3b8;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(124,52,16,.04);font-weight:700;}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns:230px 1fr;min-height:calc(100vh - 86px);}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:14px 18px;display:flex;flex-direction:column;gap:14px;overflow-x:hidden;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:3px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(124,52,16,.05);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 22px;cursor:pointer;
  font-family:'Outfit',sans-serif;font-size:12px;font-weight:700;letter-spacing:.03em;transition:all .16s;border:none;}
.dk .btn{background:var(--acc);color:#060401;border-radius:3px;animation:amber-pulse 2.8s infinite;}
.dk .btn:hover{background:#fcd34d;transform:translateY(-1px);animation:none;box-shadow:0 0 28px rgba(251,191,36,.5);}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;animation:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:9px;box-shadow:0 4px 14px rgba(124,52,16,.3);}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;}

.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;
  font-family:'Outfit',sans-serif;font-size:10px;font-weight:600;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(251,191,36,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(124,52,16,.05);}

.fi{width:100%;outline:none;font-family:'Outfit',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;resize:vertical;}
.dk .fi{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(251,191,36,.1);}
.lt .fi{background:#fdfaf3;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(124,52,16,.08);}
.fi::placeholder{opacity:.28;}

.sop-text{font-family:'Fraunces',serif;font-size:14.5px;line-height:1.92;
  padding:24px 26px;white-space:pre-wrap;word-break:break-word;min-height:120px;}
.dk .sop-text{color:#fef3c7;background:rgba(0,0,0,.5);border:1px solid rgba(251,191,36,.1);border-radius:3px;}
.lt .sop-text{color:#1c0e04;background:#fffdf5;border:1.5px solid rgba(124,52,16,.12);border-radius:10px;}
.cur{display:inline-block;width:7px;height:14px;background:var(--acc);animation:blink .7s infinite;vertical-align:text-bottom;margin-left:1px;}

.lbl{font-family:'Outfit',sans-serif;font-size:9px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(251,191,36,.38);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(251,191,36,.25);}
.lt .slbl{color:var(--acc);}

.wc-track{height:4px;border-radius:2px;overflow:hidden;margin-top:4px;}
.dk .wc-track{background:rgba(251,191,36,.1);}
.lt .wc-track{background:rgba(124,52,16,.08);}

.chip{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;
  font-family:'Outfit',sans-serif;font-size:10px;font-weight:600;transition:all .13s;border:none;white-space:nowrap;}
.dk .chip{background:rgba(251,191,36,.07);border:1px solid rgba(251,191,36,.18);border-radius:2px;color:var(--acc);}
.dk .chip:hover{background:rgba(251,191,36,.14);border-color:var(--acc);}
.dk .chip:disabled{opacity:.35;cursor:not-allowed;}
.lt .chip{background:rgba(124,52,16,.05);border:1.5px solid rgba(124,52,16,.2);border-radius:8px;color:var(--acc);}
.lt .chip:hover{background:rgba(124,52,16,.1);}
.lt .chip:disabled{opacity:.35;cursor:not-allowed;}

.prog{height:3px;border-radius:2px;overflow:hidden;}
.dk .prog{background:rgba(251,191,36,.1);}
.lt .prog{background:rgba(124,52,16,.08);}
.prog-bar{height:100%;border-radius:2px;transition:width .4s;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc4));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc4));}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(251,191,36,.01);border:1px dashed rgba(251,191,36,.09);border-radius:3px;}
.lt .ad{background:rgba(124,52,16,.015);border:1.5px dashed rgba(124,52,16,.1);border-radius:9px;}
.ad span{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

/* SECTION BUILDER CARD */
.sec-card{border-radius:3px;overflow:hidden;margin-bottom:8px;transition:border-color .15s;}
.dk .sec-card{border:1px solid var(--bdr);background:rgba(0,0,0,.3);}
.lt .sec-card{border:1.5px solid var(--bdr);background:white;border-radius:10px;}
.dk .sec-card.active{border-color:rgba(251,191,36,.3);}
.lt .sec-card.active{border-color:rgba(124,52,16,.3);}
.sec-head{padding:10px 13px;display:flex;align-items:center;gap:8px;cursor:pointer;}
.sec-num{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:600;
  width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.dk .sec-num{background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.2);color:var(--acc);}
.lt .sec-num{background:rgba(124,52,16,.08);border:1px solid rgba(124,52,16,.2);color:var(--acc);}
.dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.dot-on{background:var(--succ);}
.dot-off{background:transparent;border:1px solid var(--txm);}
`;

/* ══ DATA ══ */
const PROGRAM_TYPES = [
  {id:'masters',   emoji:'🎓', label:"Master's Degree"},
  {id:'phd',       emoji:'🔬', label:'PhD / Doctorate'},
  {id:'mba',       emoji:'💼', label:'MBA'},
  {id:'law',       emoji:'⚖️',  label:'Law (JD/LLM)'},
  {id:'medical',   emoji:'🏥', label:'Medical School'},
  {id:'engineering',emoji:'⚙️',label:'Engineering'},
  {id:'arts',      emoji:'🎨', label:'MFA / Arts'},
  {id:'transfer',  emoji:'🏫', label:'Undergrad Transfer'},
];

const TONES = [
  {id:'scholarly',   label:'Scholarly'},
  {id:'ambitious',   label:'Ambitious'},
  {id:'reflective',  label:'Reflective'},
  {id:'technical',   label:'Technical'},
  {id:'narrative',   label:'Narrative'},
];

const WORD_TARGETS = [
  {v:500,  l:'500 words'},
  {v:750,  l:'750 words'},
  {v:1000, l:'1,000 words'},
  {v:1500, l:'1,500 words'},
  {v:2000, l:'2,000 words'},
];

const SECTIONS = [
  {id:'hook',       num:1, label:'Opening Hook',         tip:'A compelling first paragraph — story, insight, or defining moment'},
  {id:'background', num:2, label:'Academic Background',  tip:'Degrees, relevant coursework, GPA if strong'},
  {id:'experience', num:3, label:'Research / Work Exp.', tip:'Projects, jobs, internships that prepare you for this program'},
  {id:'why_program',num:4, label:'Why This Program',     tip:'Specific faculty, labs, courses, opportunities'},
  {id:'goals',      num:5, label:'Career Goals',         tip:'Short-term and long-term professional objectives'},
  {id:'fit',        num:6, label:'Fit & Contribution',   tip:'What you bring to the program, community, field'},
];

const TABS = [
  {id:'setup',   label:'⚙ Setup'},
  {id:'build',   label:'✎ Build Sections'},
  {id:'ai',      label:'✦ AI Generate'},
  {id:'edit',    label:'📝 Full SOP'},
  {id:'preview', label:'◉ Preview'},
  {id:'guide',   label:'? Guide'},
];

const EMPTY = {
  name:'', email:'', programType:'masters', tone:'scholarly', wordTarget:1000,
  university:'', program:'', department:'', faculty:'', startTerm:'',
  undergrad:'', undergradGPA:'', undergradMajor:'',
  researchExp:'', workExp:'', publications:'', skills:'',
  whyProgram:'', whyUniversity:'', careerGoal:'', longTermGoal:'',
  uniqueAngle:'', challenges:'', motivation:'',
};

export default function SOPGenerator() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';

  const [tab,      setTab]     = useState('setup');
  const [data,     setData]    = useState({...EMPTY});
  const [secNotes, setSecNotes]= useState({});  // section notes per id
  const [sop,      setSop]     = useState('');
  const [loading,  setLoading] = useState(false);
  const [loadMode, setLoadMode]= useState('');
  const [err,      setErr]     = useState('');
  const [openSec,  setOpenSec] = useState({hook:true});
  const [copied,   setCopied]  = useState('');
  const [hooks,    setHooks]   = useState([]);
  const [hooksLoading, setHooksLoading] = useState(false);

  const set = (k,v) => setData(p=>({...p,[k]:v}));
  const setNote = (k,v) => setSecNotes(p=>({...p,[k]:v}));
  const toggleSec = id => setOpenSec(p=>({...p,[id]:!p[id]}));

  const words = sop.trim().split(/\s+/).filter(Boolean).length;
  const wPct  = Math.min(100, Math.round((words / data.wordTarget) * 100));
  const wColor = wPct < 60 ? 'var(--warn)' : wPct > 110 ? 'var(--err)' : 'var(--succ)';

  const pt = PROGRAM_TYPES.find(p=>p.id===data.programType);
  const setupFilled = [data.name, data.university, data.program].filter(Boolean).length;
  const secFilled   = SECTIONS.filter(s=>secNotes[s.id]?.trim()).length;

  /* ── PROMPTS ── */
  const ctx = () => `
Applicant: ${data.name||'[Applicant]'}
Program type: ${pt?.label}
Program: ${data.program||'[Program Name]'} at ${data.university||'[University]'}
${data.department?'Department: '+data.department:''}
${data.faculty?'Target faculty/advisor: '+data.faculty:''}
Tone: ${data.tone}
Word target: ${data.wordTarget} words

Academic background: ${data.undergrad||''} ${data.undergradMajor?'('+data.undergradMajor+')':''} ${data.undergradGPA?'GPA: '+data.undergradGPA:''}
Research experience: ${data.researchExp||'not provided'}
Work experience: ${data.workExp||'not provided'}
Publications/projects: ${data.publications||'not provided'}
Technical skills: ${data.skills||'not provided'}
Why this program: ${data.whyProgram||'not provided'}
Why this university: ${data.whyUniversity||'not provided'}
Career goal: ${data.careerGoal||'not provided'}
Long-term goal: ${data.longTermGoal||'not provided'}
Unique angle/story: ${data.uniqueAngle||'not provided'}
Challenges overcome: ${data.challenges||'not provided'}
Core motivation: ${data.motivation||'not provided'}

Section notes from applicant:
${SECTIONS.map(s=>secNotes[s.id]?`${s.label}: ${secNotes[s.id]}`:'').filter(Boolean).join('\n')}`.trim();

  const buildPrompt = (mode) => {
    if(mode==='generate') return `Write a compelling Statement of Purpose (SOP) for graduate school admission.

${ctx()}

Requirements:
- Exactly ${data.wordTarget} words (±5%)
- Tone: ${data.tone}
- Structure: Opening hook → Academic background → Research/work experience → Why this specific program/university → Career goals → Closing
- Start with an engaging hook (NOT "I am writing to apply for…")  
- Be specific about faculty, labs, or courses at ${data.university||'the university'} if provided
- Weave a coherent narrative thread throughout
- End with a strong forward-looking close
- Do NOT use section headers — write as flowing prose
- Write only the SOP text, nothing else`;

    const rewrites = {
      hook_only:   `Write 3 different compelling opening paragraphs (hooks) for this SOP. Each should be 80–100 words, distinct in approach: (1) a vivid personal story, (2) a provocative intellectual question, (3) a striking professional moment.\n\n${ctx()}\n\nOutput exactly 3 numbered paragraphs.`,
      stronger:    `Rewrite only the first two paragraphs of this SOP to be more powerful and specific. Replace any generic opener.\n\nOriginal SOP:\n${sop}\n\nContext:\n${ctx()}`,
      concise:     `Rewrite this SOP to be more concise — reduce to approximately ${Math.round(data.wordTarget*0.85)} words without losing key points.\n\nOriginal:\n${sop}`,
      academic:    `Rewrite this SOP in a more scholarly, academic register appropriate for a ${pt?.label} application. Increase intellectual depth.\n\nOriginal:\n${sop}`,
      narrative:   `Rewrite this SOP so it reads as a more compelling personal narrative with a stronger story arc from beginning to end.\n\nOriginal:\n${sop}`,
      whyprogram:  `Rewrite only the "why this program" section of this SOP to be more specific and compelling — reference actual faculty, research areas, or unique offerings.\n\nContext: ${data.whyProgram||''}\nUniversity: ${data.university}\nFaculty: ${data.faculty||'not specified'}\n\nOriginal SOP:\n${sop}`,
    };
    return rewrites[mode] || rewrites.stronger;
  };

  /* ── STREAM ── */
  const stream = async (mode) => {
    setLoading(true); setLoadMode(mode); setErr('');
    if(mode==='generate') { setSop(''); setHooks([]); }
    if(mode==='hook_only') { setHooksLoading(true); setHooks([]); }

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:1400, stream:true,
          messages:[{role:'user', content:buildPrompt(mode)}]}),
      });
      if(!res.ok){setErr('API error');setLoading(false);setHooksLoading(false);return;}
      const reader=res.body.getReader(); const dec=new TextDecoder(); let buf='';

      if(mode==='generate') {
        while(true){
          const{done,value}=await reader.read(); if(done) break;
          buf+=dec.decode(value,{stream:true});
          const lines=buf.split('\n'); buf=lines.pop();
          for(const ln of lines){
            if(!ln.startsWith('data: ')) continue;
            const p=ln.slice(6); if(p==='[DONE]') break;
            try{const o=JSON.parse(p);if(o.type==='content_block_delta'&&o.delta?.type==='text_delta')
              setSop(v=>v+o.delta.text);}catch{}
          }
        }
        setTab('edit');
      } else {
        let out='';
        while(true){
          const{done,value}=await reader.read(); if(done) break;
          buf+=dec.decode(value,{stream:true});
          const lines=buf.split('\n'); buf=lines.pop();
          for(const ln of lines){
            if(!ln.startsWith('data: ')) continue;
            const p=ln.slice(6); if(p==='[DONE]') break;
            try{const o=JSON.parse(p);if(o.type==='content_block_delta'&&o.delta?.type==='text_delta')
              out+=o.delta.text;}catch{}
          }
        }
        if(mode==='hook_only') {
          // Parse 3 hooks
          const parts = out.split(/\n\s*[123]\.\s*/).filter(Boolean);
          setHooks(parts.length>=3 ? parts.slice(0,3) : [out]);
        } else {
          setSop(out);
        }
      }
    } catch(e){setErr(e.message);}
    finally{setLoading(false);setLoadMode('');setHooksLoading(false);}
  };

  /* ── PRINT ── */
  const print = () => {
    if(!sop.trim()) return;
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Statement of Purpose</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Outfit:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @media print{@page{margin:.8in}}
        body{font-family:'Fraunces',serif;color:#111;background:white;padding:60px 72px;max-width:720px;margin:0 auto;line-height:1.9}
        .hdr{font-family:'Outfit',sans-serif;margin-bottom:32px;padding-bottom:14px;border-bottom:1.5px solid #eee}
        .name{font-size:18px;font-weight:600;color:#111;margin-bottom:3px}
        .meta{font-size:11px;color:#777;line-height:1.7}
        .prog{font-size:12px;color:#444;margin-top:2px}
        .sop{font-size:14px;line-height:1.9;color:#111;white-space:pre-wrap}
        .wc{font-family:'Outfit',monospace;font-size:10px;color:#aaa;margin-top:20px;text-align:right}
      </style></head>
      <body>
        <div class="hdr">
          ${data.name?`<div class="name">${data.name}</div>`:''}
          ${data.email?`<div class="meta">${data.email}</div>`:''}
          ${data.program?`<div class="prog">Applying to: ${data.program}${data.university?' at '+data.university:''}</div>`:''}
        </div>
        <div class="sop">${sop.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
        <div class="wc">${words} words</div>
        <script>window.onload=()=>window.print()<\/script>
      </body></html>`;
    const w=window.open('','_blank'); w.document.write(html); w.document.close();
  };

  const copy = (text, id) => {
    try{navigator.clipboard.writeText(text);}catch{}
    setCopied(id); setTimeout(()=>setCopied(''),1800);
  };

  /* ══════════════════════════════════════════════════════════ */
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
              fontSize:16,borderRadius:dark?3:9,
              border:dark?'1px solid rgba(251,191,36,.3)':'none',
              background:dark?'rgba(251,191,36,.08)':'linear-gradient(135deg,#7c3410,#a04020)',
              boxShadow:dark?'0 0 16px rgba(251,191,36,.22)':'0 3px 10px rgba(124,52,16,.32)',
            }}>📝</div>
            <div>
              <div style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:18,color:'var(--tx)',lineHeight:1,animation:dark?'glow 3s ease-in-out infinite':'none'}}>
                SOP <span style={{color:'var(--acc)'}}>Generator</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--txm)',marginLeft:8,fontWeight:400,animation:'none'}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:2}}>
                Doc Tools #12 · 8 program types · 5 tones · section builder · AI full write
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          {sop&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,
            color:wColor,border:dark?'1px solid rgba(251,191,36,.15)':'1.5px solid var(--bdr)',
            padding:'3px 10px',borderRadius:dark?2:7}}>
            {words} / {data.wordTarget} words
          </div>}
          <button onClick={()=>setDark(d=>!d)} style={{
            display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(251,191,36,.2)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer',
          }}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#e0cfa0',
              boxShadow:dark?'0 0 8px rgba(251,191,36,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#060401':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--txm)'}}>{dark?'VOID':'LITE'}</span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>
              {t.label}
              {t.id==='edit'&&sop&&<span style={{width:6,height:6,borderRadius:'50%',background:'var(--succ)',display:'inline-block',marginLeft:4}}/>}
              {t.id==='build'&&secFilled>0&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,
                background:'var(--acc)',color:dark?'#060401':'white',
                padding:'1px 5px',borderRadius:99,marginLeft:4}}>{secFilled}</span>}
            </button>
          ))}
        </div>

        <div className="body">
          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* Program type */}
            <div>
              <div className="slbl">Program type</div>
              {PROGRAM_TYPES.map(pt=>(
                <button key={pt.id} onClick={()=>set('programType',pt.id)} style={{
                  width:'100%',display:'flex',alignItems:'center',gap:7,
                  padding:'6px 8px',marginBottom:3,cursor:'pointer',
                  border:data.programType===pt.id?'1px solid var(--acc)':(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                  borderRadius:dark?3:7,
                  background:data.programType===pt.id?(dark?'rgba(251,191,36,.06)':'rgba(124,52,16,.04)'):'transparent',
                }}>
                  <span style={{fontSize:13}}>{pt.emoji}</span>
                  <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11.5,fontWeight:600,
                    color:data.programType===pt.id?'var(--acc)':'var(--tx)'}}>{pt.label}</span>
                </button>
              ))}
            </div>

            {/* Tone */}
            <div>
              <div className="slbl">Tone</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {TONES.map(t=>(
                  <button key={t.id} className={`gbtn ${data.tone===t.id?'on':''}`}
                    onClick={()=>set('tone',t.id)} style={{padding:'4px 9px',fontSize:9.5}}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Word target */}
            <div>
              <div className="slbl">Word target</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {WORD_TARGETS.map(wt=>(
                  <button key={wt.v} className={`gbtn ${data.wordTarget===wt.v?'on':''}`}
                    onClick={()=>set('wordTarget',wt.v)} style={{padding:'4px 8px',fontSize:9.5}}>
                    {wt.l}
                  </button>
                ))}
              </div>
            </div>

            {sop&&<>
              <div>
                <div className="slbl">Export</div>
                <button className="gbtn" onClick={print}
                  style={{width:'100%',justifyContent:'flex-start',padding:'7px 9px',marginBottom:4}}>
                  🖨 Print / Save PDF
                </button>
                <button className="gbtn" onClick={()=>copy(sop,'side')}
                  style={{width:'100%',justifyContent:'flex-start',padding:'7px 9px',
                    ...(copied==='side'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                  {copied==='side'?'✓ Copied':'⎘ Copy full SOP'}
                </button>
              </div>
              <div>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.1em',textTransform:'uppercase'}}>Progress</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:wColor}}>{wPct}%</span>
                </div>
                <div className="prog"><div className="prog-bar" style={{width:`${wPct}%`}}/></div>
              </div>
            </>}

            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ╔══ SETUP ══╗ */}
              {tab==='setup'&&(
                <motion.div key="setup" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12,maxWidth:820}}>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>About You</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      <div>
                        <label className="lbl">Full Name</label>
                        <input className="fi" placeholder="Jane Smith" value={data.name} onChange={e=>set('name',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Email</label>
                        <input className="fi" placeholder="jane@email.com" value={data.email} onChange={e=>set('email',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Undergraduate Institution</label>
                        <input className="fi" placeholder="MIT · University of Delhi" value={data.undergrad} onChange={e=>set('undergrad',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Undergraduate Major</label>
                        <input className="fi" placeholder="Computer Science · Biology" value={data.undergradMajor} onChange={e=>set('undergradMajor',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">GPA (if strong)</label>
                        <input className="fi" placeholder="3.92 / 4.0 · First Class Honours" value={data.undergradGPA} onChange={e=>set('undergradGPA',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Technical skills</label>
                        <input className="fi" placeholder="Python, R, PyTorch · PCR, CRISPR" value={data.skills} onChange={e=>set('skills',e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Target Program</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      <div style={{gridColumn:'1 / -1'}}>
                        <label className="lbl">University / School *</label>
                        <input className="fi" placeholder="Stanford University · Harvard Medical School"
                          value={data.university} onChange={e=>set('university',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Program / Degree Name *</label>
                        <input className="fi" placeholder="MS in Computer Science · PhD in Neuroscience"
                          value={data.program} onChange={e=>set('program',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Department / School</label>
                        <input className="fi" placeholder="Dept. of Electrical Engineering"
                          value={data.department} onChange={e=>set('department',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Target Faculty / Advisor</label>
                        <input className="fi" placeholder="Prof. Jennifer Doudna · Dr. Andrew Ng"
                          value={data.faculty} onChange={e=>set('faculty',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Start Term</label>
                        <input className="fi" placeholder="Fall 2026 · Spring 2025"
                          value={data.startTerm} onChange={e=>set('startTerm',e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Experience & Motivation</div>
                    <div style={{display:'flex',flexDirection:'column',gap:9}}>
                      <div>
                        <label className="lbl">Research experience</label>
                        <textarea className="fi" rows={3}
                          placeholder="Thesis on X · 2 years in Prof. Kim's lab studying Y · published in Nature Methods"
                          value={data.researchExp} onChange={e=>set('researchExp',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Work / industry experience</label>
                        <textarea className="fi" rows={2}
                          placeholder="2 years at Google Brain as research intern · Software engineer at Stripe (ML team)"
                          value={data.workExp} onChange={e=>set('workExp',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Publications / projects / awards</label>
                        <input className="fi" placeholder="ICLR 2024 paper · Built open-source library 2k stars · NSF fellowship"
                          value={data.publications} onChange={e=>set('publications',e.target.value)}/>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                        <div>
                          <label className="lbl">Why this specific program</label>
                          <textarea className="fi" rows={3}
                            placeholder="Their lab is the only one doing X · unique industry partnership · curriculum includes Y which no other school has"
                            value={data.whyProgram} onChange={e=>set('whyProgram',e.target.value)}/>
                        </div>
                        <div>
                          <label className="lbl">Why this university</label>
                          <textarea className="fi" rows={3}
                            placeholder="Located in Silicon Valley · collaborative culture · specific faculty whose work on X aligns with my interest"
                            value={data.whyUniversity} onChange={e=>set('whyUniversity',e.target.value)}/>
                        </div>
                        <div>
                          <label className="lbl">Short-term career goal</label>
                          <textarea className="fi" rows={2}
                            placeholder="Join a research lab at a top tech company · become a paediatric oncologist in an underserved community"
                            value={data.careerGoal} onChange={e=>set('careerGoal',e.target.value)}/>
                        </div>
                        <div>
                          <label className="lbl">Long-term / big picture goal</label>
                          <textarea className="fi" rows={2}
                            placeholder="Start a biotech focused on neglected diseases · become a professor · policy work on AI safety"
                            value={data.longTermGoal} onChange={e=>set('longTermGoal',e.target.value)}/>
                        </div>
                      </div>
                      <div>
                        <label className="lbl">Your unique angle / defining story</label>
                        <textarea className="fi" rows={3}
                          placeholder="The moment / experience / challenge that defines why you're doing this. This is what makes your SOP different from the 500 others they'll read."
                          value={data.uniqueAngle} onChange={e=>set('uniqueAngle',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Challenges overcome (optional)</label>
                        <input className="fi" placeholder="First-gen student · recovered from illness · career pivot from industry"
                          value={data.challenges} onChange={e=>set('challenges',e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  <div style={{display:'flex',gap:9}}>
                    <button className="btn" onClick={()=>setTab('build')}>NEXT: BUILD SECTIONS →</button>
                    <button className="btn" onClick={()=>setTab('ai')}
                      style={{animation:'none',background:'transparent',color:'var(--acc)',
                        border:`1px solid ${dark?'rgba(251,191,36,.3)':'rgba(124,52,16,.3)'}`,boxShadow:'none'}}>
                      ✦ SKIP TO AI
                    </button>
                  </div>

                  
                </motion.div>
              )}

              {/* ╔══ BUILD SECTIONS ══╗ */}
              {tab==='build'&&(
                <motion.div key="build" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{maxWidth:820}}>

                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--txm)',marginBottom:12,lineHeight:1.7}}>
                    Add notes for each section — the AI will use these to write your full SOP. More detail = better result.
                    <span style={{color:'var(--acc)',marginLeft:6}}>{secFilled}/{SECTIONS.length} filled</span>
                  </div>

                  {SECTIONS.map(sec=>(
                    <div key={sec.id} className={`sec-card ${secNotes[sec.id]?.trim()?'active':''}`}>
                      <div className="sec-head" onClick={()=>toggleSec(sec.id)}>
                        <div className="sec-num">{sec.num}</div>
                        <div style={{flex:1}}>
                          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:700,
                            color:secNotes[sec.id]?.trim()?'var(--acc)':'var(--tx)',letterSpacing:'.03em'}}>{sec.label}</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--txm)',marginTop:1}}>{sec.tip}</div>
                        </div>
                        <div className={`dot ${secNotes[sec.id]?.trim()?'dot-on':'dot-off'}`}/>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--txm)',marginLeft:4}}>
                          {openSec[sec.id]?'▲':'▼'}
                        </span>
                      </div>
                      <AnimatePresence>
                        {openSec[sec.id]&&(
                          <motion.div key="body"
                            initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                            style={{padding:'0 13px 13px',borderTop:`1px solid ${dark?'rgba(251,191,36,.08)':'rgba(124,52,16,.1)'}`}}>
                            <div style={{height:8}}/>
                            <textarea className="fi" rows={4}
                              placeholder={`Notes for "${sec.label}"…\n${sec.tip}`}
                              value={secNotes[sec.id]||''}
                              onChange={e=>setNote(sec.id, e.target.value)}/>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--txm)',marginTop:4}}>
                              {(secNotes[sec.id]||'').trim().split(/\s+/).filter(Boolean).length} notes words
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  <div style={{display:'flex',gap:9,marginTop:8}}>
                    <button className="btn" onClick={()=>setTab('ai')}>✦ GENERATE SOP →</button>
                  </div>

                  
                </motion.div>
              )}

              {/* ╔══ AI GENERATE ══╗ */}
              {tab==='ai'&&(
                <motion.div key="ai" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12,maxWidth:820}}>

                  {/* Status chips */}
                  <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
                    {[
                      {l:'Type',  v:pt?.label},
                      {l:'Tone',  v:TONES.find(t=>t.id===data.tone)?.label},
                      {l:'Target',v:`${data.wordTarget} words`},
                      {l:'For',   v:data.program||'—'},
                    ].map(({l,v})=>(
                      <div key={l} style={{padding:'4px 10px',
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        borderRadius:dark?2:7,display:'flex',gap:5,alignItems:'center'}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.1em'}}>{l}:</span>
                        <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:700,color:'var(--acc)'}}>{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Generate full SOP */}
                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:8}}>✦ Generate Full SOP</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--txm)',marginBottom:14,lineHeight:1.7}}>
                      Writes a complete, flowing {data.wordTarget}-word SOP in {TONES.find(t=>t.id===data.tone)?.label.toLowerCase()} tone.
                      {secFilled>0&&<span style={{color:'var(--succ)'}}> Will use your {secFilled} section notes.</span>}
                      {!data.program&&<span style={{color:'var(--warn)'}}> Tip: Add your program name in Setup for a more tailored result.</span>}
                    </div>
                    <button className="btn" onClick={()=>stream('generate')} disabled={loading}
                      style={{width:'100%',padding:'13px',fontSize:13}}>
                      {loading&&loadMode==='generate'
                        ? <><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;Writing your SOP…</>
                        : '✦ GENERATE FULL SOP'}
                    </button>
                  </div>

                  {/* Opening hook generator */}
                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:8}}>✦ Generate 3 Opening Hooks</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--txm)',marginBottom:12,lineHeight:1.7}}>
                      Get 3 distinct opening paragraphs — story, question, and moment — to kick off your SOP with.
                    </div>
                    <button className="gbtn on" onClick={()=>stream('hook_only')} disabled={loading}
                      style={{marginBottom:hooks.length?10:0}}>
                      {hooksLoading?<><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;Generating…</>:'✦ Generate 3 hooks'}
                    </button>
                    <AnimatePresence>
                      {hooks.map((h,i)=>(
                        <motion.div key={i} initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
                          style={{marginTop:10,padding:'13px 14px',borderRadius:dark?3:9,
                            border:dark?'1px solid rgba(251,191,36,.12)':'1.5px solid rgba(124,52,16,.12)',
                            background:dark?'rgba(0,0,0,.3)':'rgba(253,248,240,.8)'}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--acc)'}}>
                              Hook {i+1} — {['Vivid story','Intellectual question','Defining moment'][i]}
                            </span>
                            <div style={{display:'flex',gap:5}}>
                              <button className="gbtn" onClick={()=>copy(h,`hook${i}`)} style={{fontSize:8,padding:'2px 7px',
                                ...(copied===`hook${i}`?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                                {copied===`hook${i}`?'✓':'⎘'}
                              </button>
                              {sop&&<button className="gbtn" onClick={()=>{
                                const rest = sop.split('\n').slice(1).join('\n');
                                setSop(h+'\n\n'+rest.trim());
                                setTab('edit');
                              }} style={{fontSize:8,padding:'2px 7px'}}>Use this →</button>}
                            </div>
                          </div>
                          <p style={{fontFamily:"'Fraunces',serif",fontSize:13.5,lineHeight:1.85,color:'var(--tx)'}}>{h.trim()}</p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Rewrites */}
                  {sop&&(
                    <div className="panel" style={{padding:'15px 17px'}}>
                      <div className="lbl" style={{marginBottom:10}}>Rewrite Tools</div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                        {[
                          {mode:'stronger',   label:'⚡ Stronger opening'},
                          {mode:'concise',    label:'✂ Make concise'},
                          {mode:'academic',   label:'🎓 More scholarly'},
                          {mode:'narrative',  label:'📖 Stronger narrative'},
                          {mode:'whyprogram', label:'🎯 Better "Why us"'},
                        ].map(({mode,label})=>(
                          <button key={mode} className="chip" onClick={()=>stream(mode)} disabled={loading}>
                            {loading&&loadMode===mode?<span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>:label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {err&&<div style={{padding:'9px 12px',borderRadius:dark?3:8,
                    border:dark?'1px solid rgba(252,165,165,.2)':'1.5px solid rgba(153,27,27,.12)',
                    background:dark?'rgba(252,165,165,.05)':'rgba(254,228,228,.3)',
                    fontFamily:"'Outfit',sans-serif",fontSize:12,color:'var(--err)'}}>⚠ {err}</div>}

                  {(sop||loading&&loadMode==='generate')&&(
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                        <label className="lbl">Generated SOP</label>
                        {sop&&<button className="gbtn" onClick={()=>copy(sop,'aigen')} style={{
                          ...(copied==='aigen'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                          {copied==='aigen'?'✓ Copied':'⎘ Copy'}
                        </button>}
                      </div>
                      <div className="sop-text">
                        {sop}
                        {loading&&loadMode==='generate'&&<span className="cur"/>}
                      </div>
                      {sop&&(
                        <div style={{marginTop:6}}>
                          <div style={{display:'flex',justifyContent:'space-between',
                            fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--txm)',marginBottom:3}}>
                            <span>Word count</span>
                            <span style={{color:wColor}}>{words} / {data.wordTarget} target</span>
                          </div>
                          <div className="wc-track"><div style={{height:'100%',borderRadius:2,width:`${wPct}%`,background:wColor,transition:'width .4s'}}/></div>
                        </div>
                      )}
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ╔══ EDIT FULL SOP ══╗ */}
              {tab==='edit'&&(
                <motion.div key="edit" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12,maxWidth:820}}>

                  {!sop&&<div style={{textAlign:'center',padding:'48px',
                    fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--txm)'}}>
                    Generate your SOP first on the ✦ AI Generate tab
                  </div>}

                  {sop&&<>
                    <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,alignItems:'center'}}>
                      <label className="lbl" style={{margin:0}}>Full SOP — edit freely</label>
                      <div style={{display:'flex',gap:7,alignItems:'center',flexWrap:'wrap'}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:wColor}}>{words} words</span>
                        <button className="gbtn" onClick={()=>copy(sop,'edit')} style={{
                          ...(copied==='edit'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                          {copied==='edit'?'✓ Copied':'⎘ Copy'}
                        </button>
                        <button className="gbtn" onClick={print}>🖨 Print</button>
                      </div>
                    </div>
                    <textarea className="fi sop-text" rows={28}
                      value={sop} onChange={e=>setSop(e.target.value)}
                      style={{fontFamily:"'Fraunces',serif",fontSize:14.5,lineHeight:1.9,padding:'22px 24px'}}/>
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',
                        fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--txm)',marginBottom:3}}>
                        <span>Word count progress</span>
                        <span style={{color:wColor}}>{words} / {data.wordTarget}</span>
                      </div>
                      <div className="wc-track"><div style={{height:'100%',borderRadius:2,width:`${wPct}%`,background:wColor,transition:'width .4s'}}/></div>
                    </div>
                  </>}

                  
                </motion.div>
              )}

              {/* ╔══ PREVIEW ══╗ */}
              {tab==='preview'&&(
                <motion.div key="preview" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  {!sop&&<div style={{textAlign:'center',padding:'48px',
                    fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--txm)'}}>Generate your SOP first</div>}
                  {sop&&<>
                    <div style={{display:'flex',gap:8}}>
                      <button className="btn" onClick={print}>🖨 Print / Save PDF</button>
                      <button className="gbtn" onClick={()=>copy(sop,'prev')}
                        style={{...(copied==='prev'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                        {copied==='prev'?'✓ Copied':'⎘ Copy'}
                      </button>
                    </div>
                    <div style={{background:dark?'#1a1a1a':'#b8b0a0',borderRadius:dark?3:10,padding:24}}>
                      <div style={{background:'white',maxWidth:700,margin:'0 auto',
                        padding:'56px 72px',boxShadow:'0 8px 48px rgba(0,0,0,.3)'}}>
                        {data.name&&<div style={{marginBottom:28,paddingBottom:14,borderBottom:'1.5px solid #eee'}}>
                          <div style={{fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:18,color:'#111',marginBottom:3}}>{data.name}</div>
                          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'#777',lineHeight:1.7}}>
                            {[data.email].filter(Boolean).join(' · ')}
                          </div>
                          {data.program&&<div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:'#555',marginTop:3}}>
                            Applying to: {data.program}{data.university?' at '+data.university:''}
                          </div>}
                        </div>}
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:14,lineHeight:1.9,color:'#111',whiteSpace:'pre-wrap'}}>
                          {sop}
                        </div>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:'#ccc',marginTop:16,textAlign:'right'}}>{words} words</div>
                      </div>
                    </div>
                  </>}
                  
                </motion.div>
              )}

              {/* ╔══ GUIDE ══╗ */}
              {tab==='guide'&&(
                <motion.div key="guide" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div className="panel" style={{padding:'18px 20px',maxWidth:820}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:700,color:'var(--tx)',marginBottom:4}}>
                      Writing a Winning SOP
                    </div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:18}}>
                      what admissions committees actually want
                    </div>
                    {[
                      {t:'The hook is everything',       b:'Admissions officers read hundreds of SOPs. Your first paragraph determines if they read the rest with interest or just scan for red flags. Open with a defining moment, a sharp question, or a vivid scene. Never start with "I have always been interested in…"'},
                      {t:'Tell a story, not a résumé',   b:'Your résumé already lists what you did. The SOP explains why — the connections between experiences, the evolution of your thinking, the through-line from your past to this specific program. Show how your path has been leading here.'},
                      {t:'Be specific about the program', b:'Generic SOPs are obvious. Mention specific faculty by name and why their work matters to your goals. Reference courses, labs, research centres, or opportunities unique to that school. One specific detail is worth ten generic compliments.'},
                      {t:'Show, don\'t tell',            b:'"I am passionate about climate change" is meaningless. "After three monsoon seasons working with flood-displaced farmers in Bangladesh, I know exactly what climate models still fail to capture" is compelling. Replace adjectives with evidence.'},
                      {t:'The word count is a signal',   b:'Most programs specify 500–1,000 words. Treat the word limit as seriously as the deadline. Going over suggests you can\'t edit. Going far under suggests you don\'t have enough to say. Aim for ±5% of the target.'},
                      {t:'End with purpose, not thanks',  b:'A weak closing: "Thank you for your consideration." A strong closing: state precisely what you will do in the program and what you will do with the degree. End facing forward, not looking backward.'},
                    ].map(({t,b})=>(
                      <div key={t} style={{marginBottom:10,padding:'11px 13px',borderRadius:dark?3:9,
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        background:dark?'rgba(0,0,0,.2)':'rgba(253,248,240,.8)'}}>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12.5,fontWeight:700,color:'var(--acc)',marginBottom:5}}>✦ {t}</div>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.72}}>{b}</div>
                      </div>
                    ))}
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:17,fontWeight:600,color:'var(--tx)',margin:'14px 0 10px'}}>Common mistakes</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      {[
                        {t:'Starting with "I am writing to apply"', b:'This is the most common opener and the weakest. Admissions staff see it in 40% of SOPs. Start with substance.'},
                        {t:'Not researching the program',           b:'Saying "your excellent faculty" without naming anyone signals you didn\'t research. Committees notice — and they care.'},
                        {t:'Over-explaining grades or gaps',        b:'Brief acknowledgement is fine. A long defensive paragraph about a bad semester makes it worse, not better.'},
                        {t:'Trying to sound "academic"',            b:'Stuffed sentences and obscure vocabulary don\'t impress — they obscure. Write clear, precise, direct prose.'},
                      ].map(({t,b})=>(
                        <div key={t} style={{padding:'10px 12px',borderRadius:dark?3:9,
                          border:dark?'1px solid rgba(252,165,165,.2)':'1.5px solid rgba(153,27,27,.15)',
                          background:dark?'rgba(252,165,165,.04)':'rgba(254,228,228,.4)'}}>
                          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:700,color:'var(--err)',marginBottom:4}}>✕ {t}</div>
                          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:'var(--tx2)',lineHeight:1.65}}>{b}</div>
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
      </div>
    </>
  );
}