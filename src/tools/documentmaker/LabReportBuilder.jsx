import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   LAB REPORT TEMPLATE BUILDER — Document Tools Series #9
   Theme: Dark Cold Steel / Phosphor Green  ·  Light White Lab / Forest Green
   Fonts: Space Grotesk (display) · Inconsolata · IBM Plex Serif
   Aesthetic: Scientific instrument panel — precise, clinical, phosphor glow
   AI: Section content generation + hypothesis + analysis + conclusion
   Report types: Chemistry · Physics · Biology · Environmental · Engineering · General
   Sections: Full structured lab report with all standard sections
   Export: Print/PDF with formatted lab report layout
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inconsolata:wght@300;400;500;600;700&family=IBM+Plex+Serif:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Inconsolata',monospace}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes phglow{0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,.15)}50%{box-shadow:0 0 0 8px rgba(74,222,128,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(600%)}}
@keyframes flicker{0%,95%,100%{opacity:1}96%{opacity:.85}98%{opacity:.9}}
@keyframes pulsedot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
@keyframes slideright{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}

.dk{
  --bg:#050807;--s1:#080d0a;--s2:#0c120e;--s3:#101810;
  --bdr:#162012;--bdr-hi:rgba(74,222,128,.22);
  --acc:#4ade80;--acc2:#22c55e;--acc3:#67e8f9;--acc4:#fde68a;
  --tx:#d4f0d8;--tx2:#52aa68;--tx3:#0e1a10;--txm:#204828;
  --err:#f87171;--succ:#4ade80;--warn:#fde68a;
  --grid:rgba(74,222,128,.04);
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 70% 40% at 50% -8%,rgba(74,222,128,.06),transparent),
    radial-gradient(ellipse 40% 50% at 90% 85%,rgba(103,232,249,.03),transparent),
    linear-gradient(rgba(74,222,128,.02) 1px,transparent 1px),
    linear-gradient(90deg,rgba(74,222,128,.02) 1px,transparent 1px);
  background-size:auto,auto,28px 28px,28px 28px;
}
.lt{
  --bg:#f7faf7;--s1:#ffffff;--s2:#edf7ee;--s3:#daeeda;
  --bdr:#b8d8ba;--bdr-hi:#1a4a1e;
  --acc:#166534;--acc2:#15803d;--acc3:#0e7490;--acc4:#92400e;
  --tx:#0a1a0c;--tx2:#166534;--tx3:#b8d8ba;--txm:#4a7a4e;
  --err:#991b1b;--succ:#166534;--warn:#92400e;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(22,101,52,.05),transparent);
}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(5,8,7,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(247,250,247,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(22,101,52,.07);}

.scanline{position:fixed;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(74,222,128,.3),transparent);
  animation:scan 5s linear infinite;pointer-events:none;z-index:999;}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 14px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'Inconsolata',monospace;font-size:11px;
  font-weight:600;letter-spacing:.06em;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--txm);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(74,222,128,.04);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#94a3b8;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(22,101,52,.04);font-weight:700;}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns:224px 1fr;min-height:calc(100vh - 86px);}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:14px 18px;display:flex;flex-direction:column;gap:13px;overflow-x:hidden;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:2px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:10px;box-shadow:0 2px 16px rgba(22,101,52,.05);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 20px;cursor:pointer;
  font-family:'Inconsolata',monospace;font-size:12px;font-weight:700;letter-spacing:.08em;transition:all .16s;border:none;}
.dk .btn{background:var(--acc);color:#050807;border-radius:2px;animation:phglow 2.8s infinite;text-transform:uppercase;}
.dk .btn:hover{background:#86efac;transform:translateY(-1px);animation:none;box-shadow:0 0 28px rgba(74,222,128,.5);}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;animation:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:8px;box-shadow:0 4px 14px rgba(22,101,52,.28);text-transform:uppercase;letter-spacing:.06em;}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;}

.gbtn{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;cursor:pointer;
  font-family:'Inconsolata',monospace;font-size:10px;font-weight:500;background:transparent;transition:all .13s;border:none;letter-spacing:.04em;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:2px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(74,222,128,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:6px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(22,101,52,.05);}

.fi{width:100%;outline:none;font-family:'Inconsolata',monospace;font-size:13px;padding:8px 10px;transition:all .13s;resize:vertical;}
.dk .fi{background:rgba(0,0,0,.5);border:1px solid var(--bdr);border-radius:2px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(74,222,128,.08);}
.lt .fi{background:#f4faf4;border:1.5px solid var(--bdr);border-radius:7px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(22,101,52,.08);}
.fi::placeholder{opacity:.25;}

/* SECTION CARD */
.sec-card{border-radius:2px;overflow:hidden;margin-bottom:10px;}
.dk .sec-card{border:1px solid var(--bdr);background:rgba(0,0,0,.3);}
.lt .sec-card{border:1.5px solid var(--bdr);background:white;border-radius:10px;}
.sec-head{padding:10px 13px;display:flex;align-items:center;gap:9px;cursor:pointer;transition:background .12s;}
.dk .sec-head:hover{background:rgba(74,222,128,.04);}
.lt .sec-head:hover{background:rgba(22,101,52,.03);}
.sec-num{font-family:'Inconsolata',monospace;font-size:10px;font-weight:700;
  width:22px;height:22px;border-radius:2px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.dk .sec-num{background:rgba(74,222,128,.1);border:1px solid rgba(74,222,128,.2);color:var(--acc);}
.lt .sec-num{background:rgba(22,101,52,.1);border:1px solid rgba(22,101,52,.2);color:var(--acc);}
.sec-title{font-family:'Inconsolata',monospace;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;flex:1;}
.dk .sec-title{color:var(--tx);}
.lt .sec-title{color:var(--tx);}
.sec-body{padding:12px 13px 14px;border-top:1px solid var(--bdr);}
.dk .sec-body{border-top-color:var(--bdr);}
.lt .sec-body{border-top-color:var(--bdr);}

/* STATUS DOT */
.dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
.dot.filled{background:var(--acc);}
.dot.empty{background:transparent;border:1px solid var(--txm);}
.dot.ai{background:var(--acc3);animation:pulsedot 1.5s infinite;}

/* AI streaming */
.ai-stream{font-family:'Inconsolata',monospace;font-size:12px;line-height:1.8;
  padding:14px 15px;min-height:60px;white-space:pre-wrap;word-break:break-word;}
.dk .ai-stream{color:#86efac;background:rgba(0,0,0,.55);border:1px solid rgba(74,222,128,.1);border-radius:2px;}
.lt .ai-stream{color:#0a1a0c;background:#edf7ee;border:1.5px solid rgba(22,101,52,.12);border-radius:8px;}
.cur{display:inline-block;width:7px;height:13px;background:var(--acc);animation:blink .7s infinite;vertical-align:text-bottom;margin-left:1px;}

.lbl{font-family:'Inconsolata',monospace;font-size:9px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(74,222,128,.38);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Inconsolata',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:7px;}
.dk .slbl{color:rgba(74,222,128,.25);}
.lt .slbl{color:var(--acc);}

.prog{height:3px;border-radius:1px;overflow:hidden;}
.dk .prog{background:rgba(74,222,128,.1);}
.lt .prog{background:rgba(22,101,52,.08);}
.prog-bar{height:100%;border-radius:1px;transition:width .5s ease;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(74,222,128,.01);border:1px dashed rgba(74,222,128,.08);border-radius:2px;}
.lt .ad{background:rgba(22,101,52,.015);border:1.5px dashed rgba(22,101,52,.1);border-radius:8px;}
.ad span{font-family:'Inconsolata',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

/* PRINT PREVIEW */
.print-page{background:white;color:#111;font-family:'IBM Plex Serif',serif;
  max-width:760px;margin:0 auto;padding:48px 56px;
  box-shadow:0 6px 48px rgba(0,0,0,.3);line-height:1.7;}
.print-page h1{font-size:20px;font-weight:600;text-align:center;margin-bottom:6px;}
.print-page .meta{font-family:'Inconsolata',monospace;font-size:11px;text-align:center;color:#555;margin-bottom:28px;line-height:1.8;}
.print-page h2{font-family:'Inconsolata',monospace;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;
  color:#111;border-bottom:1.5px solid #111;padding-bottom:4px;margin:20px 0 10px;}
.print-page p{font-size:13.5px;margin-bottom:10px;text-align:justify;}
.print-page .empty-sec{font-style:italic;color:#aaa;font-size:13px;}

/* TYPE BUTTONS */
.type-btn{padding:6px 10px;cursor:pointer;border:none;font-family:'Inconsolata',monospace;
  font-size:10px;font-weight:600;letter-spacing:.06em;transition:all .13s;display:flex;align-items:center;gap:5px;}
.dk .type-btn{background:transparent;border:1px solid var(--bdr);border-radius:2px;color:var(--txm);}
.dk .type-btn.on{background:rgba(74,222,128,.07);border-color:var(--acc);color:var(--acc);}
.lt .type-btn{background:transparent;border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .type-btn.on{background:rgba(22,101,52,.06);border-color:var(--acc);color:var(--acc);}

/* HAZARD chip */
.haz{display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border-radius:2px;
  font-family:'Inconsolata',monospace;font-size:9px;font-weight:600;letter-spacing:.08em;}
.dk .haz{background:rgba(253,230,138,.08);border:1px solid rgba(253,230,138,.25);color:#fde68a;}
.lt .haz{background:rgba(146,64,14,.06);border:1.5px solid rgba(146,64,14,.2);color:#92400e;}
`;

/* ═══ CONFIGS ═══ */
const REPORT_TYPES = [
  {id:'chemistry',    label:'Chemistry',    emoji:'⚗️'},
  {id:'physics',      label:'Physics',      emoji:'⚛️'},
  {id:'biology',      label:'Biology',      emoji:'🧬'},
  {id:'environmental',label:'Environmental',emoji:'🌿'},
  {id:'engineering',  label:'Engineering',  emoji:'⚙️'},
  {id:'general',      label:'General',      emoji:'🔬'},
];

const SECTIONS = [
  {id:'title',       num:'—',  label:'Title Page',       required:true,  aiable:false},
  {id:'abstract',    num:'1',  label:'Abstract',          required:true,  aiable:true,  aiLabel:'Generate abstract',      rows:4},
  {id:'intro',       num:'2',  label:'Introduction',      required:true,  aiable:true,  aiLabel:'Write introduction',     rows:6},
  {id:'hypothesis',  num:'3',  label:'Hypothesis',        required:true,  aiable:true,  aiLabel:'Generate hypothesis',    rows:3},
  {id:'materials',   num:'4',  label:'Materials',         required:true,  aiable:false, rows:5},
  {id:'method',      num:'5',  label:'Method / Procedure',required:true,  aiable:true,  aiLabel:'Draft procedure steps',  rows:7},
  {id:'results',     num:'6',  label:'Results',           required:true,  aiable:false, rows:6},
  {id:'analysis',    num:'7',  label:'Data Analysis',     required:false, aiable:true,  aiLabel:'Write analysis guidance', rows:5},
  {id:'discussion',  num:'8',  label:'Discussion',        required:true,  aiable:true,  aiLabel:'Write discussion points', rows:7},
  {id:'conclusion',  num:'9',  label:'Conclusion',        required:true,  aiable:true,  aiLabel:'Write conclusion',        rows:4},
  {id:'errors',      num:'10', label:'Errors & Uncertainty',required:false,aiable:true, aiLabel:'List error sources',      rows:4},
  {id:'references',  num:'11', label:'References',        required:false, aiable:false, rows:4},
  {id:'appendix',    num:'A',  label:'Appendix',          required:false, aiable:false, rows:4},
];

const TABS = [
  {id:'setup',    label:'⚙ SETUP'},
  {id:'sections', label:'✎ SECTIONS'},
  {id:'ai',       label:'✦ AI WRITE'},
  {id:'preview',  label:'◉ PREVIEW'},
  {id:'guide',    label:'? GUIDE'},
];

const EMPTY = {
  expTitle:'', subject:'', course:'', student:'', partner:'', instructor:'',
  institution:'', date:'', reportType:'chemistry',
  aim:'', background:'', safetyNotes:'', equipmentNotes:'',
};

export default function LabReportBuilder() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';

  const [tab,      setTab]    = useState('setup');
  const [data,     setData]   = useState({...EMPTY, date: new Date().toLocaleDateString('en-GB')});
  const [content,  setContent]= useState({});   // secId → text
  const [open,     setOpen]   = useState({title:true, abstract:false});
  const [aiLoad,   setAiLoad] = useState(false);
  const [aiTarget, setAiTarget]=useState('');
  const [aiErr,    setAiErr]  = useState('');
  const [copied,   setCopied] = useState('');

  const set  = (k,v) => setData(p=>({...p,[k]:v}));
  const setC = (k,v) => setContent(p=>({...p,[k]:v}));
  const toggleOpen = id => setOpen(p=>({...p,[id]:!p[id]}));

  const filledSections = SECTIONS.filter(s=>s.id!=='title'&&content[s.id]?.trim()).length;
  const pct = Math.round((filledSections / (SECTIONS.length-1)) * 100);

  /* ── AI PROMPT BUILDERS ── */
  const ctx = () => `Experiment: ${data.expTitle||'the experiment'}
Subject: ${data.subject||'science'} (${data.reportType||'general'} lab report)
Aim: ${data.aim||'investigate the experiment'}
Background: ${data.background||''}`;

  const AI_PROMPTS = {
    abstract:   ()=>`Write a concise abstract (100–150 words) for a ${data.reportType} lab report.\n${ctx()}\nResults section notes: ${content.results||'(not yet written)'}\nConclusion notes: ${content.conclusion||'(not yet written)'}\nOutput only the abstract paragraph.`,
    intro:      ()=>`Write an introduction (200–250 words) for a ${data.reportType} lab report.\n${ctx()}\nCover: scientific context, relevant theory, reason for conducting the experiment, what will be investigated.\nOutput only the introduction text.`,
    hypothesis:()=>`Write a clear, testable hypothesis (2–4 sentences) for a ${data.reportType} lab report.\n${ctx()}\nFormat: "It is hypothesised that [independent variable] will [effect] [dependent variable] because [scientific reasoning]."\nOutput only the hypothesis statement.`,
    method:    ()=>`Write step-by-step method/procedure for a ${data.reportType} lab report.\n${ctx()}\nMaterials: ${content.materials||'standard lab equipment'}\nWrite as numbered steps, past tense, passive voice (as done in scientific writing). 8–12 steps.\nOutput only the numbered steps.`,
    analysis:  ()=>`Write data analysis guidance (150–200 words) for a ${data.reportType} lab report.\n${ctx()}\nResults: ${content.results||'(not yet written)'}\nCover: what statistical or calculation approach to apply, what graphs or tables to include, how to process the raw data.\nOutput only the analysis guidance text.`,
    discussion:()=>`Write a discussion section (200–250 words) for a ${data.reportType} lab report.\n${ctx()}\nResults: ${content.results||'(not yet written)'}\nCover: interpreting results, comparison to expected/theoretical values, sources of error, what the results mean, relation to hypothesis.\nOutput only the discussion text.`,
    conclusion:()=>`Write a conclusion (100–150 words) for a ${data.reportType} lab report.\n${ctx()}\nHypothesis: ${content.hypothesis||'(not written)'}\nResults: ${content.results||'(not written)'}\nCover: whether hypothesis was supported, summary of key findings, suggested improvements.\nOutput only the conclusion paragraph.`,
    errors:    ()=>`List 4–6 specific sources of error and uncertainty for a ${data.reportType} lab report.\n${ctx()}\nFor each: state the error, classify it (systematic/random), and suggest how to reduce it.\nFormat as a numbered list.\nOutput only the list.`,
  };

  /* ── STREAM ── */
  const runAI = async (secId) => {
    const prompt = AI_PROMPTS[secId]?.();
    if(!prompt) return;
    setAiLoad(true); setAiTarget(secId); setAiErr('');
    setC(secId, '');
    setOpen(p=>({...p,[secId]:true}));
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:900, stream:true,
          messages:[{role:'user',content:prompt}]}),
      });
      if(!res.ok){setAiErr('API error');setAiLoad(false);return;}
      const reader=res.body.getReader(); const dec=new TextDecoder(); let buf='';
      while(true){
        const{done,value}=await reader.read(); if(done) break;
        buf+=dec.decode(value,{stream:true});
        const lines=buf.split('\n'); buf=lines.pop();
        for(const ln of lines){
          if(!ln.startsWith('data: ')) continue;
          const p=ln.slice(6); if(p==='[DONE]') break;
          try{const o=JSON.parse(p);if(o.type==='content_block_delta'&&o.delta?.type==='text_delta')
            setC(secId, v=>(v||'')+o.delta.text);}catch{}
        }
      }
    }catch(e){setAiErr(e.message);}
    finally{setAiLoad(false);setAiTarget('');}
  };

  /* ── GENERATE ALL AI SECTIONS ── */
  const generateAll = async () => {
    const aiSecs = SECTIONS.filter(s=>s.aiable&&s.id!=='title');
    for(const sec of aiSecs) {
      await runAI(sec.id);
    }
  };

  /* ── PRINT ── */
  const printReport = () => {
    const rt = REPORT_TYPES.find(r=>r.id===data.reportType);
    const sections = SECTIONS.filter(s=>s.id!=='title');
    let html = `<!DOCTYPE html><html><head><meta charset="utf-8">
      <title>${data.expTitle||'Lab Report'}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,400;0,600;1,400&family=Inconsolata:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'IBM Plex Serif',serif;color:#111;background:white;padding:52px 64px;max-width:760px;margin:0 auto;line-height:1.75}
        @media print{@page{margin:.7in}body{padding:0}}
        h1{font-size:20px;font-weight:600;text-align:center;margin-bottom:8px}
        .meta{font-family:'Inconsolata',monospace;font-size:11px;text-align:center;color:#555;margin-bottom:32px;line-height:1.9}
        h2{font-family:'Inconsolata',monospace;font-size:10.5px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;
           color:#111;border-bottom:1.5px solid #111;padding-bottom:4px;margin:24px 0 10px}
        p{font-size:13.5px;margin-bottom:9px;text-align:justify}
        .empty{font-style:italic;color:#bbb;font-size:13px}
      </style></head><body>
      <h1>${data.expTitle||'Lab Report'}</h1>
      <div class="meta">
        ${data.student?`<b>Student:</b> ${data.student}<br>`:''}
        ${data.partner?`<b>Partner(s):</b> ${data.partner}<br>`:''}
        ${data.course?`<b>Course:</b> ${data.course}<br>`:''}
        ${data.instructor?`<b>Instructor:</b> ${data.instructor}<br>`:''}
        ${data.institution?`<b>Institution:</b> ${data.institution}<br>`:''}
        ${data.date?`<b>Date:</b> ${data.date}<br>`:''}
        <b>Type:</b> ${rt?.emoji} ${rt?.label} Lab Report
      </div>`;

    sections.forEach(sec=>{
      html+=`<h2>${sec.num}. ${sec.label}</h2>`;
      const txt = content[sec.id]||'';
      if(txt.trim()) {
        txt.split('\n').filter(Boolean).forEach(line=>{
          html+=`<p>${line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>`;
        });
      } else {
        html+=`<p class="empty">[${sec.label} not yet completed]</p>`;
      }
    });

    html+=`<script>window.onload=()=>window.print()<\/script></body></html>`;
    const w = window.open('','_blank'); w.document.write(html); w.document.close();
  };

  /* ─── STATUS INDICATOR ─── */
  const SecStatus = ({sec}) => {
    if(aiLoad && aiTarget===sec.id) return <span className="dot ai"/>;
    if(content[sec.id]?.trim()) return <span className="dot filled"/>;
    return <span className="dot empty"/>;
  };

  /* ════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{STYLES}</style>
      <div className={cls} style={{animation:dark?'flicker 8s infinite':'none'}}>
        {dark&&<div className="scanline"/>}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:32,height:32,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:16,borderRadius:dark?2:9,
              border:dark?'1px solid rgba(74,222,128,.3)':'none',
              background:dark?'rgba(74,222,128,.08)':'linear-gradient(135deg,#166534,#15803d)',
              boxShadow:dark?'0 0 16px rgba(74,222,128,.2)':'0 3px 10px rgba(22,101,52,.32)',
            }}>🔬</div>
            <div>
              <div style={{fontFamily:"'Inconsolata',monospace",fontWeight:700,fontSize:15,color:'var(--tx)',lineHeight:1,letterSpacing:'.04em'}}>
                LAB REPORT <span style={{color:'var(--acc)'}}>BUILDER</span>
                <span style={{fontSize:9,color:'var(--txm)',marginLeft:7,fontWeight:400}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Inconsolata',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.16em',textTransform:'uppercase',marginTop:2}}>
                DOC TOOLS #9 · 6 TYPES · 13 SECTIONS · AI WRITE
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          {/* Progress */}
          <div style={{width:100}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
              <span style={{fontFamily:"'Inconsolata',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.1em'}}>COMPLETE</span>
              <span style={{fontFamily:"'Inconsolata',monospace",fontSize:8,color:'var(--acc)'}}>{pct}%</span>
            </div>
            <div className="prog"><div className="prog-bar" style={{width:`${pct}%`}}/></div>
          </div>
          <button onClick={()=>setDark(d=>!d)} style={{
            display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(74,222,128,.2)':'1.5px solid var(--bdr)',
            borderRadius:dark?2:7,background:'transparent',cursor:'pointer',
          }}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#b8d8ba',
              boxShadow:dark?'0 0 8px rgba(74,222,128,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#050807':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'Inconsolata',monospace",fontSize:8.5,color:'var(--txm)',letterSpacing:'.08em'}}>{dark?'DARK':'LITE'}</span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>
              {t.label}
              {t.id==='sections'&&pct>0&&<span style={{width:6,height:6,borderRadius:'50%',background:'var(--succ)',display:'inline-block',marginLeft:5}}/>}
            </button>
          ))}
        </div>

        <div className="body">
          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* Report type */}
            <div>
              <div className="slbl">Report type</div>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                {REPORT_TYPES.map(rt=>(
                  <button key={rt.id} className={`type-btn ${data.reportType===rt.id?'on':''}`}
                    onClick={()=>set('reportType',rt.id)}
                    style={{justifyContent:'flex-start',width:'100%'}}>
                    <span style={{fontSize:13}}>{rt.emoji}</span>
                    <span>{rt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section status */}
            <div>
              <div className="slbl">Section status</div>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                {SECTIONS.filter(s=>s.id!=='title').map(sec=>(
                  <div key={sec.id}
                    onClick={()=>{setTab('sections');toggleOpen(sec.id);setOpen(p=>({...p,[sec.id]:true}));}}
                    style={{display:'flex',alignItems:'center',gap:7,padding:'4px 7px',cursor:'pointer',
                      borderRadius:dark?2:6,transition:'background .1s',
                    }}
                    onMouseEnter={e=>e.currentTarget.style.background=dark?'rgba(74,222,128,.04)':'rgba(22,101,52,.04)'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <SecStatus sec={sec}/>
                    <span style={{fontFamily:"'Inconsolata',monospace",fontSize:10,color:content[sec.id]?.trim()?'var(--tx)':'var(--txm)',letterSpacing:'.04em'}}>
                      {sec.num}. {sec.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <div className="slbl">Export</div>
              <button className="gbtn" onClick={printReport}
                style={{width:'100%',justifyContent:'flex-start',padding:'6px 9px',marginBottom:4}}>
                🖨 Print / Save PDF
              </button>
              <button className="gbtn"
                onClick={()=>{
                  const full = SECTIONS.filter(s=>s.id!=='title').map(s=>`== ${s.label.toUpperCase()} ==\n${content[s.id]||''}`).join('\n\n');
                  try{navigator.clipboard.writeText(full);}catch{}
                  setCopied('all');setTimeout(()=>setCopied(''),1800);
                }}
                style={{width:'100%',justifyContent:'flex-start',padding:'6px 9px',
                  ...(copied==='all'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                {copied==='all'?'✓ COPIED':'⎘ Copy all text'}
              </button>
            </div>

            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ╔══ SETUP ══╗ */}
              {tab==='setup'&&(
                <motion.div key="setup" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div className="panel" style={{padding:'14px 16px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Experiment Details</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      <div style={{gridColumn:'1 / -1'}}>
                        <label className="lbl">Experiment Title *</label>
                        <input className="fi" placeholder="The Effect of Concentration on Reaction Rate"
                          value={data.expTitle||''} onChange={e=>set('expTitle',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Subject / Module</label>
                        <input className="fi" placeholder="AS Chemistry" value={data.subject||''} onChange={e=>set('subject',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Course / Year</label>
                        <input className="fi" placeholder="Year 12 · IB Chemistry HL" value={data.course||''} onChange={e=>set('course',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Student Name</label>
                        <input className="fi" placeholder="Jane Smith" value={data.student||''} onChange={e=>set('student',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Lab Partner(s)</label>
                        <input className="fi" placeholder="Alice Brown, Tom Chen" value={data.partner||''} onChange={e=>set('partner',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Instructor / Teacher</label>
                        <input className="fi" placeholder="Dr. Williams" value={data.instructor||''} onChange={e=>set('instructor',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Institution</label>
                        <input className="fi" placeholder="St. Mary's College" value={data.institution||''} onChange={e=>set('institution',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Date</label>
                        <input className="fi" value={data.date||''} onChange={e=>set('date',e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  <div className="panel" style={{padding:'14px 16px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Context for AI (optional but improves quality)</div>
                    <div style={{display:'flex',flexDirection:'column',gap:9}}>
                      <div>
                        <label className="lbl">Aim of the experiment</label>
                        <input className="fi" placeholder="To investigate how changing the concentration of HCl affects the rate of reaction with marble chips"
                          value={data.aim||''} onChange={e=>set('aim',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Background / relevant theory</label>
                        <textarea className="fi" rows={3}
                          placeholder="Collision theory states that increasing concentration increases the number of particles per unit volume, therefore increasing collision frequency…"
                          value={data.background||''} onChange={e=>set('background',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Safety notes</label>
                        <input className="fi" placeholder="HCl is corrosive — goggles and gloves required. No naked flames near ethanol."
                          value={data.safetyNotes||''} onChange={e=>set('safetyNotes',e.target.value)}/>
                        {data.safetyNotes&&<div style={{marginTop:5}}>
                          <span className="haz">⚠ SAFETY NOTED</span>
                        </div>}
                      </div>
                    </div>
                  </div>

                  <div style={{display:'flex',gap:9}}>
                    <button className="btn" onClick={()=>setTab('sections')}>NEXT: SECTIONS →</button>
                  </div>

                  
                </motion.div>
              )}

              {/* ╔══ SECTIONS ══╗ */}
              {tab==='sections'&&(
                <motion.div key="sections" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  {SECTIONS.map(sec=>(
                    <div key={sec.id} className="sec-card">
                      <div className="sec-head" onClick={()=>toggleOpen(sec.id)}>
                        <div className="sec-num">{sec.num}</div>
                        <span className="sec-title">{sec.label}</span>
                        <SecStatus sec={sec}/>
                        {sec.required&&<span style={{fontFamily:"'Inconsolata',monospace",fontSize:8,color:'var(--acc)',opacity:.5,letterSpacing:'.1em'}}>REQ</span>}
                        <span style={{fontFamily:"'Inconsolata',monospace",fontSize:10,color:'var(--txm)',marginLeft:4}}>
                          {open[sec.id]?'▲':'▼'}
                        </span>
                      </div>
                      <AnimatePresence>
                        {open[sec.id]&&(
                          <motion.div className="sec-body" key="body"
                            initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}>

                            {sec.id==='title'&&(
                              <div style={{fontFamily:"'Inconsolata',monospace",fontSize:11,color:'var(--tx2)',lineHeight:1.7}}>
                                Title page is auto-generated from Setup info.<br/>
                                <span style={{color:'var(--txm)'}}>Title: </span>{data.expTitle||'—'}&nbsp;·&nbsp;
                                <span style={{color:'var(--txm)'}}>Student: </span>{data.student||'—'}&nbsp;·&nbsp;
                                <span style={{color:'var(--txm)'}}>Date: </span>{data.date||'—'}
                              </div>
                            )}

                            {sec.id!=='title'&&(
                              <>
                                {sec.aiable&&(
                                  <div style={{display:'flex',gap:7,marginBottom:9,flexWrap:'wrap'}}>
                                    <button className="gbtn on" onClick={()=>runAI(sec.id)} disabled={aiLoad}
                                      style={{fontSize:9.5,padding:'4px 11px'}}>
                                      {aiLoad&&aiTarget===sec.id
                                        ?<><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;WRITING…</>
                                        :<>✦ {sec.aiLabel}</>}
                                    </button>
                                    {aiLoad&&aiTarget===sec.id&&(
                                      <span style={{fontFamily:"'Inconsolata',monospace",fontSize:9,color:'var(--acc3)',alignSelf:'center',animation:'pulsedot 1s infinite'}}>
                                        ● STREAMING
                                      </span>
                                    )}
                                  </div>
                                )}
                                <textarea className="fi"
                                  rows={sec.rows||4}
                                  placeholder={`Write your ${sec.label.toLowerCase()} here…`}
                                  value={content[sec.id]||''}
                                  onChange={e=>setC(sec.id, e.target.value)}/>
                                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:5}}>
                                  <span style={{fontFamily:"'Inconsolata',monospace",fontSize:8,color:'var(--txm)'}}>
                                    {(content[sec.id]||'').trim().split(/\s+/).filter(Boolean).length} words
                                  </span>
                                  {content[sec.id]&&(
                                    <button className="gbtn" style={{fontSize:8,padding:'2px 8px'}}
                                      onClick={()=>{
                                        try{navigator.clipboard.writeText(content[sec.id]);}catch{}
                                        setCopied(sec.id);setTimeout(()=>setCopied(''),1800);
                                      }}>
                                      {copied===sec.id?'✓ COPIED':'⎘ COPY'}
                                    </button>
                                  )}
                                </div>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  
                </motion.div>
              )}

              {/* ╔══ AI WRITE ══╗ */}
              {tab==='ai'&&(
                <motion.div key="ai" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12,maxWidth:860}}>

                  {/* Config chips */}
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    {[
                      {l:'Type',  v:REPORT_TYPES.find(r=>r.id===data.reportType)?.label},
                      {l:'Title', v:data.expTitle||'—'},
                      {l:'Done',  v:`${filledSections}/${SECTIONS.length-1} sections`},
                    ].map(({l,v})=>(
                      <div key={l} style={{padding:'4px 10px',
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        borderRadius:dark?2:7,display:'flex',gap:5,alignItems:'center'}}>
                        <span style={{fontFamily:"'Inconsolata',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.1em'}}>{l}:</span>
                        <span style={{fontFamily:"'Inconsolata',monospace",fontSize:10,fontWeight:600,color:'var(--acc)'}}>{v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="panel" style={{padding:'14px 16px'}}>
                    <div className="lbl" style={{marginBottom:11}}>Generate individual sections</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
                      {SECTIONS.filter(s=>s.aiable).map(sec=>(
                        <button key={sec.id} onClick={()=>runAI(sec.id)} disabled={aiLoad}
                          style={{
                            padding:'11px 12px',cursor:aiLoad?'not-allowed':'pointer',
                            border:dark?`1px solid ${content[sec.id]?.trim()?'rgba(74,222,128,.3)':'var(--bdr)'}`:
                              `1.5px solid ${content[sec.id]?.trim()?'rgba(22,101,52,.4)':'var(--bdr)'}`,
                            borderRadius:dark?2:8,background:'transparent',
                            display:'flex',alignItems:'center',gap:8,
                            opacity:aiLoad&&aiTarget!==sec.id?.5:1,transition:'all .15s',
                          }}>
                          <span style={{fontFamily:"'Inconsolata',monospace",fontSize:10,
                            color:'var(--txm)',minWidth:18}}>{sec.num}.</span>
                          <div style={{textAlign:'left',flex:1}}>
                            <div style={{fontFamily:"'Inconsolata',monospace",fontSize:11,fontWeight:700,
                              color:'var(--tx)',letterSpacing:'.04em'}}>{sec.label}</div>
                            <div style={{fontFamily:"'Inconsolata',monospace",fontSize:8.5,color:'var(--txm)',marginTop:1}}>{sec.aiLabel}</div>
                          </div>
                          {aiLoad&&aiTarget===sec.id&&<span style={{color:'var(--acc3)',display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>}
                          {content[sec.id]?.trim()&&!(aiLoad&&aiTarget===sec.id)&&<span style={{color:'var(--succ)',fontSize:11}}>✓</span>}
                        </button>
                      ))}
                    </div>
                    <div style={{marginTop:11}}>
                      <button className="btn" onClick={generateAll} disabled={aiLoad}
                        style={{width:'100%',padding:'11px',fontSize:12}}>
                        {aiLoad?<><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;GENERATING…</>
                          :'✦ GENERATE ALL AI SECTIONS'}
                      </button>
                    </div>
                  </div>

                  {aiErr&&<div style={{padding:'9px 12px',borderRadius:dark?2:8,
                    background:dark?'rgba(248,113,113,.05)':'rgba(185,28,28,.04)',
                    border:dark?'1px solid rgba(248,113,113,.18)':'1.5px solid rgba(185,28,28,.12)',
                    fontFamily:"'Inconsolata',monospace",fontSize:11,color:'var(--err)'}}>⚠ {aiErr}</div>}

                  {/* Note */}
                  <div style={{padding:'10px 13px',borderRadius:dark?2:8,
                    border:dark?'1px solid rgba(253,230,138,.15)':'1.5px solid rgba(146,64,14,.15)',
                    background:dark?'rgba(253,230,138,.04)':'rgba(146,64,14,.03)'}}>
                    <span className="haz">ℹ NOTE</span>
                    <span style={{fontFamily:"'Inconsolata',monospace",fontSize:10.5,color:'var(--tx2)',marginLeft:8,lineHeight:1.7}}>
                      Fill in Materials and Results manually — these require your actual experimental data.
                      AI-generated sections are starting points; edit them with your specific observations and values.
                    </span>
                  </div>

                  
                </motion.div>
              )}

              {/* ╔══ PREVIEW ══╗ */}
              {tab==='preview'&&(
                <motion.div key="preview" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
                    <button className="btn" onClick={printReport}>🖨 PRINT / SAVE PDF</button>
                    <span style={{fontFamily:"'Inconsolata',monospace",fontSize:9,color:'var(--txm)'}}>
                      {filledSections}/{SECTIONS.length-1} sections complete · {pct}%
                    </span>
                  </div>
                  <div style={{background:dark?'#1a1a1a':'#ccd4e0',borderRadius:dark?2:10,padding:20,overflow:'auto'}}>
                    <div className="print-page">
                      <h1>{data.expTitle||'Lab Report'}</h1>
                      <div className="meta">
                        {data.student&&<>{data.student}<br/></>}
                        {data.partner&&<>Partners: {data.partner}<br/></>}
                        {data.course&&<>{data.course}<br/></>}
                        {data.instructor&&<>Instructor: {data.instructor}<br/></>}
                        {data.institution&&<>{data.institution}<br/></>}
                        {data.date&&<>{data.date}</>}
                      </div>
                      {SECTIONS.filter(s=>s.id!=='title').map(sec=>(
                        <div key={sec.id}>
                          <h2>{sec.num}. {sec.label}</h2>
                          {content[sec.id]?.trim()
                            ? content[sec.id].split('\n').filter(Boolean).map((line,i)=>(
                                <p key={i}>{line}</p>
                              ))
                            : <p className="empty">[{sec.label} not completed]</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                </motion.div>
              )}

              {/* ╔══ GUIDE ══╗ */}
              {tab==='guide'&&(
                <motion.div key="guide" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{fontFamily:"'Inconsolata',monospace",fontSize:18,fontWeight:700,color:'var(--tx)',marginBottom:4,letterSpacing:'.04em'}}>
                      LAB REPORT — STRUCTURE GUIDE
                    </div>
                    <div style={{fontFamily:"'Inconsolata',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.18em',textTransform:'uppercase',marginBottom:18}}>
                      scientific method · all disciplines
                    </div>

                    <div style={{display:'flex',flexDirection:'column',gap:7,marginBottom:18}}>
                      {[
                        {n:'Abstract',    t:'100–150 words. Standalone summary: aim, method, key results, conclusion. Written last but placed first.'},
                        {n:'Introduction',t:'Set the scientific context. State the aim clearly. Include relevant theory/equations. Why does this experiment matter?'},
                        {n:'Hypothesis',  t:'"It is hypothesised that [IV] will [effect] [DV] because [theory]." Must be falsifiable and specific.'},
                        {n:'Materials',   t:'Complete list of equipment with quantities/sizes. Includes chemicals with concentrations. Bullet points or numbered list.'},
                        {n:'Method',      t:'Numbered steps, past tense, passive voice. Enough detail to replicate exactly. Include safety precautions.'},
                        {n:'Results',     t:'Raw data in tables. Include units and uncertainty. No interpretation here — just observations and measurements.'},
                        {n:'Analysis',    t:'Process your data. Show calculations. Include graphs (label axes, units, title, line of best fit). Sample calculations shown.'},
                        {n:'Discussion',  t:'Interpret results. Compare to expected/literature values. Explain anomalies. Link back to hypothesis and theory.'},
                        {n:'Conclusion',  t:'1–2 paragraphs. Was the hypothesis supported? State your quantitative finding. What would you improve?'},
                        {n:'Errors',      t:'Classify as systematic or random. Specific, not vague ("human error" is not acceptable). Suggest improvements.'},
                      ].map(({n,t})=>(
                        <div key={n} style={{display:'flex',gap:12,padding:'8px 10px',borderRadius:dark?2:7,
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          background:dark?'rgba(0,0,0,.2)':'rgba(247,250,247,.8)'}}>
                          <div style={{fontFamily:"'Inconsolata',monospace",fontSize:11,fontWeight:700,color:'var(--acc)',minWidth:100,letterSpacing:'.04em',flexShrink:0,paddingTop:1}}>{n}</div>
                          <div style={{fontFamily:"'Inconsolata',monospace",fontSize:11.5,color:'var(--tx2)',lineHeight:1.65}}>{t}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{fontFamily:"'Inconsolata',monospace",fontSize:12,fontWeight:700,color:'var(--tx)',marginBottom:10,letterSpacing:'.06em'}}>
                      COMMON MISTAKES
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                      {[
                        {t:'Writing in 1st person',b:'"I added HCl" → "HCl was added". Lab reports use passive voice, past tense throughout.'},
                        {t:'Vague error analysis',  b:'"Human error" and "random errors" are not accepted. Be specific: "parallax error when reading the burette".'},
                        {t:'No units on data',      b:'Every measurement needs units. Every table column header needs units in brackets: Volume (cm³).'},
                        {t:'Conclusion = results',  b:'Don\'t just restate your results. Interpret them — what do they mean for the hypothesis and real world?'},
                      ].map(({t,b})=>(
                        <div key={t} style={{padding:'10px 12px',borderRadius:dark?2:8,
                          border:dark?'1px solid rgba(248,113,113,.2)':'1.5px solid rgba(153,27,27,.15)',
                          background:dark?'rgba(248,113,113,.04)':'rgba(254,242,242,.8)'}}>
                          <div style={{fontFamily:"'Inconsolata',monospace",fontSize:10.5,fontWeight:700,color:'var(--err)',marginBottom:4,letterSpacing:'.04em'}}>✕ {t}</div>
                          <div style={{fontFamily:"'Inconsolata',monospace",fontSize:11,color:'var(--tx2)',lineHeight:1.6}}>{b}</div>
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
    </>
  );
}