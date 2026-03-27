import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   INTERNSHIP APPLICATION LETTER — Document Tools Series #14 (FINAL)
   Theme: Dark Void / Electric Lime  ·  Light Chalk / Jungle Green
   Fonts: Syne · Instrument Serif · JetBrains Mono
   Aesthetic: Gen-Z professional — bold, energetic, modern
   Internship types: Tech · Finance · Marketing · Design · Research · Healthcare · Media · Law · NGO · Engineering
   Tones: Enthusiastic · Professional · Creative · Confident · Concise
   AI: Full letter + 6 quick rewrites + subject line generator
   Features: Word count · Cold email mode · LinkedIn DM mode · Print/PDF
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Syne',sans-serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes lime-pulse{0%,100%{box-shadow:0 0 0 0 rgba(163,230,53,.18)}50%{box-shadow:0 0 0 8px rgba(163,230,53,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(600%)}}
@keyframes pop{from{opacity:0;transform:scale(.97) translateY(4px)}to{opacity:1;transform:none}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}

.dk{
  --bg:#040701;--s1:#070c02;--s2:#0b1103;--s3:#101804;
  --bdr:#182204;--bdr-hi:rgba(163,230,53,.26);
  --acc:#a3e635;--acc2:#84cc16;--acc3:#38bdf8;--acc4:#f472b6;
  --tx:#edffd4;--tx2:#567a20;--tx3:#182204;--txm:#2e4a0a;
  --err:#fca5a5;--succ:#86efac;--warn:#fde68a;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -10%,rgba(163,230,53,.07),transparent),
    radial-gradient(ellipse 40% 50% at 95% 80%,rgba(56,189,248,.04),transparent),
    radial-gradient(ellipse 30% 40% at 5% 60%,rgba(244,114,182,.03),transparent);
}
.lt{
  --bg:#f6fce8;--s1:#ffffff;--s2:#ecfccb;--s3:#d9f99d;
  --bdr:#bef264;--bdr-hi:#3a5c00;
  --acc:#3a5c00;--acc2:#4d7c0f;--acc3:#0369a1;--acc4:#9d174d;
  --tx:#0a1400;--tx2:#3a5c00;--tx3:#bef264;--txm:#5a8020;
  --err:#991b1b;--succ:#166534;--warn:#92400e;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(58,92,0,.07),transparent);
}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(4,7,1,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(246,252,232,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(58,92,0,.07);}

.scanline{position:fixed;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(163,230,53,.35),transparent);
  animation:scan 5s linear infinite;pointer-events:none;z-index:999;}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 14px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'Syne',sans-serif;font-size:11px;
  font-weight:600;letter-spacing:.05em;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--txm);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(163,230,53,.04);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#94a3b8;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(58,92,0,.04);font-weight:700;}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns:228px 1fr;min-height:calc(100vh - 86px);}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:14px 18px;display:flex;flex-direction:column;gap:14px;overflow-x:hidden;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:3px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(58,92,0,.05);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 22px;cursor:pointer;
  font-family:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:.04em;transition:all .16s;border:none;}
.dk .btn{background:var(--acc);color:#040701;border-radius:3px;animation:lime-pulse 2.8s infinite;}
.dk .btn:hover{background:#bef264;transform:translateY(-1px);animation:none;box-shadow:0 0 28px rgba(163,230,53,.5);}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;animation:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:9px;box-shadow:0 4px 14px rgba(58,92,0,.3);}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;}

.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;
  font-family:'Syne',sans-serif;font-size:10px;font-weight:600;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(163,230,53,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(58,92,0,.05);}

.fi{width:100%;outline:none;font-family:'Syne',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;resize:vertical;}
.dk .fi{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(163,230,53,.1);}
.lt .fi{background:#fafff0;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(58,92,0,.08);}
.fi::placeholder{opacity:.27;}

.letter-text{font-family:'Instrument Serif',serif;font-size:14.5px;line-height:1.9;
  padding:22px 24px;white-space:pre-wrap;word-break:break-word;min-height:120px;}
.dk .letter-text{color:#edffd4;background:rgba(0,0,0,.5);border:1px solid rgba(163,230,53,.1);border-radius:3px;}
.lt .letter-text{color:#0a1400;background:#fffef5;border:1.5px solid rgba(58,92,0,.12);border-radius:10px;}
.cur{display:inline-block;width:7px;height:14px;background:var(--acc);animation:blink .7s infinite;vertical-align:text-bottom;margin-left:1px;}

.lbl{font-family:'Syne',sans-serif;font-size:9px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(163,230,53,.38);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(163,230,53,.25);}
.lt .slbl{color:var(--acc);}

.chip{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;cursor:pointer;
  font-family:'Syne',sans-serif;font-size:10px;font-weight:600;transition:all .13s;border:none;white-space:nowrap;}
.dk .chip{background:rgba(163,230,53,.07);border:1px solid rgba(163,230,53,.18);border-radius:2px;color:var(--acc);}
.dk .chip:hover{background:rgba(163,230,53,.14);border-color:var(--acc);}
.dk .chip:disabled{opacity:.35;cursor:not-allowed;}
.lt .chip{background:rgba(58,92,0,.05);border:1.5px solid rgba(58,92,0,.2);border-radius:8px;color:var(--acc);}
.lt .chip:hover{background:rgba(58,92,0,.1);}
.lt .chip:disabled{opacity:.35;cursor:not-allowed;}

/* SUBJECT LINE CARDS */
.subj-card{padding:10px 13px;cursor:pointer;border-radius:3px;transition:all .13s;animation:pop .2s ease;}
.dk .subj-card{border:1px solid rgba(163,230,53,.12);background:rgba(0,0,0,.3);}
.dk .subj-card:hover{border-color:var(--acc);background:rgba(163,230,53,.05);}
.lt .subj-card{border:1.5px solid rgba(58,92,0,.12);background:#f8fff0;border-radius:9px;}
.lt .subj-card:hover{border-color:var(--acc);background:#f0fce0;}

/* MODE TOGGLE */
.mode-btn{padding:7px 14px;cursor:pointer;font-family:'Syne',sans-serif;font-size:10px;font-weight:700;
  letter-spacing:.08em;text-transform:uppercase;transition:all .14s;border:none;}
.dk .mode-btn{background:transparent;border:1px solid var(--bdr);border-radius:2px;color:var(--txm);}
.dk .mode-btn.on{background:rgba(163,230,53,.1);border-color:var(--acc);color:var(--acc);}
.lt .mode-btn{background:transparent;border:1.5px solid var(--bdr);border-radius:8px;color:var(--txm);}
.lt .mode-btn.on{background:rgba(58,92,0,.08);border-color:var(--acc);color:var(--acc);}

.prog{height:3px;border-radius:2px;overflow:hidden;}
.dk .prog{background:rgba(163,230,53,.1);}
.lt .prog{background:rgba(58,92,0,.08);}
.prog-bar{height:100%;border-radius:2px;transition:width .4s;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(163,230,53,.01);border:1px dashed rgba(163,230,53,.09);border-radius:3px;}
.lt .ad{background:rgba(58,92,0,.015);border:1.5px dashed rgba(58,92,0,.1);border-radius:9px;}
.ad span{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

/* TICKER */
.ticker-wrap{overflow:hidden;white-space:nowrap;padding:6px 0;}
.ticker{display:inline-flex;gap:32px;animation:marquee 22s linear infinite;}
.ticker-item{font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.12em;color:var(--txm);white-space:nowrap;}
`;

/* ══ DATA ══ */
const INTERNSHIP_TYPES = [
  {id:'tech',        emoji:'💻', label:'Tech / Software'},
  {id:'finance',     emoji:'📈', label:'Finance / Banking'},
  {id:'marketing',   emoji:'📣', label:'Marketing / PR'},
  {id:'design',      emoji:'🎨', label:'Design / UX'},
  {id:'research',    emoji:'🔬', label:'Research / Science'},
  {id:'healthcare',  emoji:'🏥', label:'Healthcare'},
  {id:'media',       emoji:'📱', label:'Media / Journalism'},
  {id:'law',         emoji:'⚖️',  label:'Law / Legal'},
  {id:'ngo',         emoji:'🌱', label:'NGO / Non-Profit'},
  {id:'engineering', emoji:'⚙️',  label:'Engineering'},
];

const TONES = [
  {id:'enthusiastic', label:'Enthusiastic'},
  {id:'professional', label:'Professional'},
  {id:'creative',     label:'Creative'},
  {id:'confident',    label:'Confident'},
  {id:'concise',      label:'Concise'},
];

const MODES = [
  {id:'letter',  label:'📄 Cover Letter'},
  {id:'email',   label:'📧 Cold Email'},
  {id:'linkedin',label:'💼 LinkedIn DM'},
];

const SIGN_OFFS = ['Yours sincerely,','Kind regards,','Best regards,','With enthusiasm,','Warmly,'];

const TABS = [
  {id:'setup',    label:'⚙ Setup'},
  {id:'generate', label:'✦ Generate'},
  {id:'edit',     label:'✎ Edit'},
  {id:'preview',  label:'◉ Preview'},
  {id:'tips',     label:'? Tips'},
];

const TICKER_ITEMS = [
  'Internship Application Letter','Cold Email Outreach','LinkedIn DM','Cover Letter',
  'Tech Internship','Finance Summer Analyst','Marketing Intern','Design Internship',
  'Research Position','Law Internship','NGO Volunteer','Engineering Co-op',
];

const EMPTY = {
  name:'', email:'', phone:'', university:'', major:'', year:'',
  companyName:'', role:'', hiringManager:'', department:'',
  internType:'tech', tone:'enthusiastic', outputMode:'letter', signOff:'Kind regards,',
  skills:'', achievements:'', relevantCourses:'', projects:'',
  whyCompany:'', whyRole:'', availability:'', duration:'',
  hasExperience:'', portfolioUrl:'',
};

export default function InternshipLetter() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';

  const [tab,      setTab]      = useState('setup');
  const [data,     setData]     = useState({...EMPTY});
  const [letter,   setLetter]   = useState('');
  const [loading,  setLoading]  = useState(false);
  const [loadMode, setLoadMode] = useState('');
  const [err,      setErr]      = useState('');
  const [copied,   setCopied]   = useState('');
  const [subjects, setSubjects] = useState([]);
  const [subjLoad, setSubjLoad] = useState(false);

  const set = (k,v) => setData(p=>({...p,[k]:v}));

  const it  = INTERNSHIP_TYPES.find(t=>t.id===data.internType);
  const tn  = TONES.find(t=>t.id===data.tone);
  const md  = MODES.find(m=>m.id===data.outputMode);

  const wordTarget = data.outputMode==='linkedin' ? 150 : data.outputMode==='email' ? 200 : 350;
  const words = letter.trim().split(/\s+/).filter(Boolean).length;
  const wPct  = Math.min(100, Math.round((words / wordTarget) * 100));
  const wColor = wPct < 60 ? 'var(--warn)' : wPct > 115 ? 'var(--err)' : 'var(--succ)';

  const setupFilled = [data.name, data.companyName, data.role].filter(Boolean).length;
  const pct = Math.round((setupFilled/3)*100);

  /* ── CONTEXT ── */
  const ctx = () => `
Applicant: ${data.name||'[Applicant]'}
Applying for: ${data.role||'internship'} at ${data.companyName||'[Company]'}${data.department?' ('+data.department+')':''}
Internship type: ${it?.label}
Output mode: ${data.outputMode}
Tone: ${data.tone}
University: ${data.university||'not stated'}${data.major?' — '+data.major:''}${data.year?', '+data.year+' year':''}
Skills: ${data.skills||'not provided'}
Achievements: ${data.achievements||'not provided'}
Relevant coursework: ${data.relevantCourses||'not provided'}
Projects: ${data.projects||'not provided'}
Previous experience: ${data.hasExperience||'not provided'}
Why this company: ${data.whyCompany||'not provided'}
Why this role: ${data.whyRole||'not provided'}
Availability: ${data.availability||'not stated'}${data.duration?' · '+data.duration:''}
Portfolio/GitHub: ${data.portfolioUrl||'not provided'}`.trim();

  /* ── PROMPTS ── */
  const buildPrompt = (mode) => {
    const wordLimits = {letter:'300–400 words', email:'150–200 words', linkedin:'100–140 words'};
    const formats = {
      letter: `Format: Formal cover letter. Opening paragraph → skills/experience paragraph → why this company paragraph → closing with call-to-action. Sign off: ${data.signOff} [Name].`,
      email:  `Format: Cold email. Subject line first (write "Subject: [line]"), then a punchy 3-paragraph email: hook → value proposition → clear ask. Conversational but professional.`,
      linkedin:`Format: LinkedIn DM. Ultra-brief, casual professional tone. 3–4 short paragraphs max. No formal greeting. Start with a genuine compliment or shared interest, then pivot to the ask. End with a simple question.`,
    };

    if(mode==='generate') return `Write a compelling ${data.outputMode==='letter'?'internship cover letter':data.outputMode==='email'?'cold email for an internship':'LinkedIn DM requesting an internship'}.

${ctx()}

${formats[data.outputMode]||formats.letter}
Word count: ${wordLimits[data.outputMode]||wordLimits.letter}
Hiring manager: ${data.hiringManager||'(use generic greeting if unknown)'}

Key requirements:
- Do NOT open with "I am writing to apply for…" or "I am a student at…"
- Be specific about ${data.companyName||'the company'} — reference actual reasons to work there
- Show enthusiasm authentically, not generically
- Include a clear call-to-action at the end
- Tone: ${data.tone}
Write only the letter/message body.`;

    const rewrites = {
      shorter:    `Rewrite this ${data.outputMode} to be more concise (${wordLimits[data.outputMode]}). Cut every unnecessary word.\n\nOriginal:\n${letter}`,
      hook:       `Rewrite only the opening paragraph/line of this ${data.outputMode} to be more compelling. Don't start with "I".\n\nOriginal:\n${letter}\n\nContext: ${ctx()}`,
      specific:   `Rewrite this ${data.outputMode} to include more specific, concrete details about skills, projects, and why ${data.companyName||'the company'}.\n\nOriginal:\n${letter}`,
      bolder:     `Rewrite this ${data.outputMode} to sound more confident and bold. Remove hedging language ("I believe", "I hope", "I think").\n\nOriginal:\n${letter}`,
      creative:   `Rewrite the opening of this ${data.outputMode} to be more creative and memorable. Different from every other intern letter they'll read.\n\nOriginal:\n${letter}\n\nContext: ${ctx()}`,
      ats:        `Rewrite this ${data.outputMode} to be more ATS-friendly for a ${it?.label} ${data.role||'internship'} — add relevant keywords naturally.\n\nOriginal:\n${letter}`,
    };
    return rewrites[mode] || rewrites.shorter;
  };

  /* ── STREAM ── */
  const stream = async (mode) => {
    setLoading(true); setLoadMode(mode); setErr('');
    if(mode==='generate') { setLetter(''); setSubjects([]); }

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:800, stream:true,
          messages:[{role:'user', content:buildPrompt(mode)}]}),
      });
      if(!res.ok){setErr('API error');setLoading(false);return;}
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
              setLetter(v=>v+o.delta.text);}catch{}
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
        setLetter(out);
      }
    } catch(e){setErr(e.message);}
    finally{setLoading(false);setLoadMode('');}
  };

  /* ── SUBJECT LINE GENERATOR ── */
  const genSubjects = async () => {
    setSubjLoad(true); setSubjects([]);
    const prompt = `Generate 5 compelling email subject lines for a ${data.internType} internship application at ${data.companyName||'[Company]'} for a ${data.role||'summer internship'} role.

Requirements:
- Each under 50 characters
- Varied approaches: specific skill, mutual connection angle, value proposition, curiosity hook, direct
- Professional but not boring
- Don't start with "Application for…" on all of them

Return exactly 5 subject lines, one per line. No numbers, no bullets.`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:200, stream:true,
          messages:[{role:'user', content:prompt}]}),
      });
      const reader=res.body.getReader(); const dec=new TextDecoder(); let buf=''; let out='';
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
      setSubjects(out.split('\n').map(l=>l.trim()).filter(l=>l.length>5).slice(0,5));
    } catch(e){console.error(e);}
    finally{setSubjLoad(false);}
  };

  /* ── PRINT ── */
  const print = () => {
    if(!letter.trim()) return;
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Internship Application</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Syne:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @media print{@page{margin:.75in}}
        body{font-family:'Syne',sans-serif;background:white;color:#111;padding:48px 64px;max-width:720px;margin:0 auto;}
        .hdr{margin-bottom:28px;padding-bottom:12px;border-bottom:2px solid #a3e635;}
        .name{font-size:20px;font-weight:800;color:#111;margin-bottom:3px;}
        .meta{font-size:11px;color:#666;line-height:1.7;}
        .body{font-family:'Instrument Serif',serif;font-size:14px;line-height:1.9;white-space:pre-wrap;color:#111;}
        .wc{font-family:'Syne',sans-serif;font-size:10px;color:#bbb;margin-top:18px;text-align:right;}
      </style></head>
      <body>
        <div class="hdr">
          ${data.name?`<div class="name">${data.name}</div>`:''}
          <div class="meta">${[data.email,data.phone,data.portfolioUrl].filter(Boolean).join(' · ')}</div>
          ${data.university?`<div class="meta">${data.university}${data.major?' — '+data.major:''}${data.year?', Year '+data.year:''}</div>`:''}
        </div>
        <div class="body">${letter.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
        <div class="wc">${words} words</div>
        <script>window.onload=()=>window.print()<\/script>
      </body></html>`;
    const w=window.open('','_blank'); w.document.write(html); w.document.close();
  };

  const copy = (text,id) => {
    try{navigator.clipboard.writeText(text);}catch{}
    setCopied(id); setTimeout(()=>setCopied(''),1800);
  };

  /* ═══════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {dark&&<div className="scanline"/>}

        {/* TICKER */}
        <div className="ticker-wrap" style={{
          borderBottom:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
          background:dark?'var(--s1)':'var(--s2)',
        }}>
          <div className="ticker">
            {[...TICKER_ITEMS,...TICKER_ITEMS].map((item,i)=>(
              <span key={i} className="ticker-item">◈ {item}</span>
            ))}
          </div>
        </div>

        {/* TOPBAR */}
        <div className="topbar" style={{top:28}}>
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:32,height:32,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:16,borderRadius:dark?3:9,
              border:dark?'1px solid rgba(163,230,53,.3)':'none',
              background:dark?'rgba(163,230,53,.08)':'linear-gradient(135deg,#3a5c00,#4d7c0f)',
              boxShadow:dark?'0 0 16px rgba(163,230,53,.22)':'0 3px 10px rgba(58,92,0,.32)',
            }}>🚀</div>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:'var(--tx)',lineHeight:1,letterSpacing:'-.01em'}}>
                Internship <span style={{color:'var(--acc)'}}>Letter</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--txm)',marginLeft:7,fontWeight:400}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:2}}>
                Doc Tools #14 · 10 types · letter + email + LinkedIn DM · AI generate
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>

          {/* Output mode toggle */}
          <div style={{display:'flex',gap:4}}>
            {MODES.map(m=>(
              <button key={m.id} className={`mode-btn ${data.outputMode===m.id?'on':''}`}
                onClick={()=>set('outputMode',m.id)}>{m.label}</button>
            ))}
          </div>

          {letter&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:wColor,
            border:dark?'1px solid rgba(163,230,53,.15)':'1.5px solid var(--bdr)',
            padding:'3px 10px',borderRadius:dark?2:7}}>
            {words}/{wordTarget}w
          </div>}

          <button onClick={()=>setDark(d=>!d)} style={{
            display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(163,230,53,.2)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer',
          }}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#bef264',
              boxShadow:dark?'0 0 8px rgba(163,230,53,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#040701':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--txm)'}}>{dark?'VOID':'LITE'}</span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar" style={{top:74,position:'sticky',zIndex:399}}>
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>
              {t.label}
              {t.id==='edit'&&letter&&<span style={{width:6,height:6,borderRadius:'50%',
                background:'var(--succ)',display:'inline-block',marginLeft:4}}/>}
            </button>
          ))}
        </div>

        <div className="body">
          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* Internship type */}
            <div>
              <div className="slbl">Industry</div>
              {INTERNSHIP_TYPES.map(it=>(
                <button key={it.id} onClick={()=>set('internType',it.id)} style={{
                  width:'100%',display:'flex',alignItems:'center',gap:7,
                  padding:'5px 8px',marginBottom:3,cursor:'pointer',
                  border:data.internType===it.id?'1px solid var(--acc)':(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                  borderRadius:dark?3:7,
                  background:data.internType===it.id?(dark?'rgba(163,230,53,.06)':'rgba(58,92,0,.04)'):'transparent',
                }}>
                  <span style={{fontSize:12}}>{it.emoji}</span>
                  <span style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,
                    color:data.internType===it.id?'var(--acc)':'var(--tx)'}}>{it.label}</span>
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

            {/* Sign-off (only for letter mode) */}
            {data.outputMode==='letter'&&(
              <div>
                <div className="slbl">Sign-off</div>
                {SIGN_OFFS.map(s=>(
                  <button key={s} onClick={()=>set('signOff',s)} style={{
                    width:'100%',padding:'5px 8px',marginBottom:3,cursor:'pointer',
                    border:data.signOff===s?'1px solid var(--acc)':(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                    borderRadius:dark?2:6,textAlign:'left',
                    fontFamily:"'Syne',sans-serif",fontSize:10,
                    color:data.signOff===s?'var(--acc)':'var(--txm)',
                    background:data.signOff===s?(dark?'rgba(163,230,53,.05)':'rgba(58,92,0,.04)'):'transparent',
                  }}>{s}</button>
                ))}
              </div>
            )}

            {letter&&(
              <div>
                <div className="slbl">Export</div>
                <button className="gbtn" onClick={print}
                  style={{width:'100%',justifyContent:'flex-start',padding:'7px 9px',marginBottom:4}}>
                  🖨 Print / Save PDF
                </button>
                <button className="gbtn" onClick={()=>copy(letter,'side')}
                  style={{width:'100%',justifyContent:'flex-start',padding:'7px 9px',
                    ...(copied==='side'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                  {copied==='side'?'✓ Copied':'⎘ Copy'}
                </button>
              </div>
            )}

            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ╔══ SETUP ══╗ */}
              {tab==='setup'&&(
                <motion.div key="setup" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12,maxWidth:820}}>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Your Details</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      <div>
                        <label className="lbl">Full Name *</label>
                        <input className="fi" placeholder="Alex Johnson"
                          value={data.name} onChange={e=>set('name',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Email</label>
                        <input className="fi" placeholder="alex@email.com"
                          value={data.email} onChange={e=>set('email',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">University</label>
                        <input className="fi" placeholder="University of Toronto · NYU"
                          value={data.university} onChange={e=>set('university',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Major / Programme</label>
                        <input className="fi" placeholder="Computer Science · Business Analytics"
                          value={data.major} onChange={e=>set('major',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Year of Study</label>
                        <input className="fi" placeholder="2nd year · Penultimate year · Final year"
                          value={data.year} onChange={e=>set('year',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Phone</label>
                        <input className="fi" placeholder="+1 555 000 1234"
                          value={data.phone} onChange={e=>set('phone',e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Internship / Role</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      <div>
                        <label className="lbl">Company Name *</label>
                        <input className="fi" placeholder="Google · JPMorgan · Vogue"
                          value={data.companyName} onChange={e=>set('companyName',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Role / Position *</label>
                        <input className="fi" placeholder="Software Engineering Intern · Summer Analyst"
                          value={data.role} onChange={e=>set('role',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Hiring Manager / Contact</label>
                        <input className="fi" placeholder="Sarah Lee · (leave blank if unknown)"
                          value={data.hiringManager} onChange={e=>set('hiringManager',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Department</label>
                        <input className="fi" placeholder="Engineering · Equity Research · Editorial"
                          value={data.department} onChange={e=>set('department',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Availability / Start Date</label>
                        <input className="fi" placeholder="Summer 2025 · June–August · Immediate"
                          value={data.availability} onChange={e=>set('availability',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Duration (if known)</label>
                        <input className="fi" placeholder="10 weeks · 3 months · Part-time"
                          value={data.duration} onChange={e=>set('duration',e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>What You Bring</div>
                    <div style={{display:'flex',flexDirection:'column',gap:9}}>
                      <div>
                        <label className="lbl">Relevant skills</label>
                        <input className="fi" placeholder="Python, React, SQL · Financial modelling, Excel, Bloomberg · Adobe Suite, Figma"
                          value={data.skills} onChange={e=>set('skills',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Achievements / awards</label>
                        <input className="fi" placeholder="Dean's List · Hackathon winner · Published research · Built app with 5k users"
                          value={data.achievements} onChange={e=>set('achievements',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Relevant projects</label>
                        <textarea className="fi" rows={2}
                          placeholder="Built ML model for sentiment analysis (GitHub: github.com/alex/project) · Created portfolio website · Led university trading competition team"
                          value={data.projects} onChange={e=>set('projects',e.target.value)}/>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                        <div>
                          <label className="lbl">Relevant coursework</label>
                          <input className="fi" placeholder="Algorithms, ML, Databases · Corporate Finance, Derivatives"
                            value={data.relevantCourses} onChange={e=>set('relevantCourses',e.target.value)}/>
                        </div>
                        <div>
                          <label className="lbl">Previous experience (if any)</label>
                          <input className="fi" placeholder="Part-time dev at startup · Finance society president · TA for CS101"
                            value={data.hasExperience} onChange={e=>set('hasExperience',e.target.value)}/>
                        </div>
                        <div>
                          <label className="lbl">Why this company specifically</label>
                          <textarea className="fi" rows={2}
                            placeholder="Their open-source contributions to TensorFlow · The rotating team model · Read CEO's post on AI safety and it aligned with my values"
                            value={data.whyCompany} onChange={e=>set('whyCompany',e.target.value)}/>
                        </div>
                        <div>
                          <label className="lbl">Why this specific role</label>
                          <textarea className="fi" rows={2}
                            placeholder="Combines ML and product — exactly the intersection I'm building toward · The infrastructure challenges at this scale fascinate me"
                            value={data.whyRole} onChange={e=>set('whyRole',e.target.value)}/>
                        </div>
                      </div>
                      <div>
                        <label className="lbl">Portfolio / GitHub / LinkedIn URL</label>
                        <input className="fi" placeholder="github.com/alex · portfolio.alexj.com · linkedin.com/in/alexj"
                          value={data.portfolioUrl} onChange={e=>set('portfolioUrl',e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  <div style={{display:'flex',gap:9}}>
                    <button className="btn" onClick={()=>setTab('generate')}>NEXT: GENERATE →</button>
                  </div>

                  
                </motion.div>
              )}

              {/* ╔══ GENERATE ══╗ */}
              {tab==='generate'&&(
                <motion.div key="generate" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12,maxWidth:820}}>

                  {/* Status chips */}
                  <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
                    {[
                      {l:'Mode',  v:md?.label},
                      {l:'Type',  v:it?.label},
                      {l:'Tone',  v:tn?.label},
                      {l:'For',   v:data.role||'—'},
                      {l:'At',    v:data.companyName||'—'},
                    ].map(({l,v})=>(
                      <div key={l} style={{padding:'4px 10px',
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        borderRadius:dark?2:7,display:'flex',gap:5,alignItems:'center'}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.1em'}}>{l}:</span>
                        <span style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,color:'var(--acc)'}}>{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Generate */}
                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:8}}>✦ Generate {md?.label}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--txm)',marginBottom:14,lineHeight:1.7}}>
                      {data.outputMode==='letter'&&`Writes a ${tn?.label.toLowerCase()} cover letter (~350 words) for the ${it?.label} internship.`}
                      {data.outputMode==='email'&&`Writes a punchy cold email (~200 words) with subject line to ${data.companyName||'the company'}.`}
                      {data.outputMode==='linkedin'&&`Writes a brief LinkedIn DM (~130 words) — casual, direct, and specific.`}
                      {!data.companyName&&<span style={{color:'var(--warn)'}}> Add company name for a tailored result.</span>}
                    </div>
                    <button className="btn" onClick={()=>stream('generate')} disabled={loading}
                      style={{width:'100%',padding:'13px',fontSize:13}}>
                      {loading&&loadMode==='generate'
                        ?<><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;Writing…</>
                        :`✦ GENERATE ${(md?.label||'').toUpperCase()}`}
                    </button>
                  </div>

                  {/* Subject line generator (email mode) */}
                  {data.outputMode==='email'&&(
                    <div className="panel" style={{padding:'15px 17px'}}>
                      <div className="lbl" style={{marginBottom:8}}>✦ Subject Line Generator</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--txm)',marginBottom:11}}>
                        Generate 5 compelling email subject lines. Click to copy.
                      </div>
                      <button className="gbtn on" onClick={genSubjects} disabled={subjLoad||loading}
                        style={{marginBottom:subjects.length?10:0}}>
                        {subjLoad?<><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;Generating…</>:'✦ Generate 5 subject lines'}
                      </button>
                      <AnimatePresence>
                        {subjects.map((s,i)=>(
                          <motion.div key={i} className="subj-card"
                            initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}} transition={{delay:i*.06}}
                            onClick={()=>copy(s,`subj${i}`)}>
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                              <span style={{fontFamily:"'Instrument Serif',serif",fontSize:13.5,color:'var(--tx)'}}>{s}</span>
                              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:copied===`subj${i}`?'var(--succ)':'var(--txm)',marginLeft:10,flexShrink:0}}>
                                {copied===`subj${i}`?'✓ copied':'click to copy'}
                              </span>
                            </div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--txm)',marginTop:3}}>
                              {s.length} chars
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Rewrites */}
                  {letter&&(
                    <div className="panel" style={{padding:'15px 17px'}}>
                      <div className="lbl" style={{marginBottom:10}}>Quick Rewrites</div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                        {[
                          {mode:'shorter', label:'✂ Shorter'},
                          {mode:'hook',    label:'⚡ Better hook'},
                          {mode:'specific',label:'📌 More specific'},
                          {mode:'bolder',  label:'💪 More confident'},
                          {mode:'creative',label:'✨ More creative'},
                          {mode:'ats',     label:'🔍 ATS keywords'},
                        ].map(({mode,label})=>(
                          <button key={mode} className="chip" onClick={()=>stream(mode)} disabled={loading}>
                            {loading&&loadMode===mode
                              ?<span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>
                              :label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {err&&<div style={{padding:'9px 12px',borderRadius:dark?3:8,
                    border:dark?'1px solid rgba(252,165,165,.2)':'1.5px solid rgba(153,27,27,.12)',
                    background:dark?'rgba(252,165,165,.05)':'rgba(254,228,228,.3)',
                    fontFamily:"'Syne',sans-serif",fontSize:12,color:'var(--err)'}}>⚠ {err}</div>}

                  {(letter||(loading&&loadMode==='generate'))&&(
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                        <label className="lbl">Generated {md?.label}</label>
                        {letter&&<button className="gbtn" onClick={()=>copy(letter,'gen')} style={{
                          ...(copied==='gen'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                          {copied==='gen'?'✓ Copied':'⎘ Copy'}
                        </button>}
                      </div>
                      <div className="letter-text">
                        {letter}
                        {loading&&loadMode==='generate'&&<span className="cur"/>}
                      </div>
                      {letter&&(
                        <div style={{marginTop:6}}>
                          <div style={{display:'flex',justifyContent:'space-between',
                            fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--txm)',marginBottom:3}}>
                            <span>Word count</span>
                            <span style={{color:wColor}}>{words} / {wordTarget} target</span>
                          </div>
                          <div className="prog"><div className="prog-bar" style={{width:`${wPct}%`}}/></div>
                        </div>
                      )}
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ╔══ EDIT ══╗ */}
              {tab==='edit'&&(
                <motion.div key="edit" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12,maxWidth:820}}>
                  {!letter&&<div style={{textAlign:'center',padding:'48px',
                    fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--txm)'}}>
                    Generate first on the ✦ Generate tab
                  </div>}
                  {letter&&<>
                    <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,alignItems:'center'}}>
                      <label className="lbl" style={{margin:0}}>Edit freely</label>
                      <div style={{display:'flex',gap:7,alignItems:'center',flexWrap:'wrap'}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:wColor}}>{words} / {wordTarget} words</span>
                        <button className="gbtn" onClick={()=>copy(letter,'edit')} style={{
                          ...(copied==='edit'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                          {copied==='edit'?'✓ Copied':'⎘ Copy'}
                        </button>
                        {data.outputMode==='letter'&&<button className="gbtn" onClick={print}>🖨 Print</button>}
                      </div>
                    </div>
                    <textarea className="fi letter-text" rows={22}
                      value={letter} onChange={e=>setLetter(e.target.value)}
                      style={{fontFamily:"'Instrument Serif',serif",fontSize:14.5,lineHeight:1.9,padding:'20px 22px'}}/>
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',
                        fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--txm)',marginBottom:3}}>
                        <span>Progress toward {wordTarget}-word target</span>
                        <span style={{color:wColor}}>{wPct}%</span>
                      </div>
                      <div className="prog"><div className="prog-bar" style={{width:`${wPct}%`}}/></div>
                    </div>
                  </>}
                  
                </motion.div>
              )}

              {/* ╔══ PREVIEW ══╗ */}
              {tab==='preview'&&(
                <motion.div key="preview" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  {!letter&&<div style={{textAlign:'center',padding:'48px',
                    fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--txm)'}}>Generate first</div>}
                  {letter&&<>
                    <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
                      {data.outputMode==='letter'&&<button className="btn" onClick={print}>🖨 Print / Save PDF</button>}
                      <button className="gbtn" onClick={()=>copy(letter,'prev')} style={{
                        ...(copied==='prev'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                        {copied==='prev'?'✓ Copied':'⎘ Copy'}
                      </button>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:wColor}}>{words} words · {md?.label}</span>
                    </div>
                    <div style={{background:dark?'#181a18':'#b5c0a0',borderRadius:dark?3:10,padding:24,overflow:'auto'}}>
                      <div style={{background:'white',maxWidth:700,margin:'0 auto',
                        padding:'48px 64px',boxShadow:'0 8px 48px rgba(0,0,0,.28)'}}>
                        {(data.name||data.university)&&data.outputMode==='letter'&&(
                          <div style={{marginBottom:24,paddingBottom:12,
                            borderBottom:'2px solid #a3e635'}}>
                            {data.name&&<div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:18,color:'#111',marginBottom:3}}>{data.name}</div>}
                            <div style={{fontFamily:"'Syne',sans-serif",fontSize:11,color:'#666',lineHeight:1.7}}>
                              {[data.email,data.phone].filter(Boolean).join(' · ')}
                            </div>
                            {data.university&&<div style={{fontFamily:"'Syne',sans-serif",fontSize:11,color:'#888'}}>
                              {data.university}{data.major?' — '+data.major:''}{data.year?', '+data.year+' year':''}
                            </div>}
                            {data.portfolioUrl&&<div style={{fontFamily:"'Syne',sans-serif",fontSize:11,color:'#4d7c0f'}}>{data.portfolioUrl}</div>}
                          </div>
                        )}
                        {data.outputMode!=='letter'&&(
                          <div style={{marginBottom:16,display:'inline-flex',alignItems:'center',gap:6,
                            padding:'3px 10px',borderRadius:4,
                            background:data.outputMode==='email'?'#f0f9ff':'#f0fdf4',
                            border:`1px solid ${data.outputMode==='email'?'#bae6fd':'#bbf7d0'}`}}>
                            <span style={{fontFamily:"'Syne',sans-serif",fontSize:9,fontWeight:700,
                              color:data.outputMode==='email'?'#0369a1':'#166534',letterSpacing:'.1em'}}>{md?.label}</span>
                          </div>
                        )}
                        <div style={{fontFamily:"'Instrument Serif',serif",fontSize:14,lineHeight:1.9,color:'#111',whiteSpace:'pre-wrap'}}>
                          {letter}
                        </div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:10,color:'#ccc',marginTop:14,textAlign:'right'}}>{words} words</div>
                      </div>
                    </div>
                  </>}
                  
                </motion.div>
              )}

              {/* ╔══ TIPS ══╗ */}
              {tab==='tips'&&(
                <motion.div key="tips" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div className="panel" style={{padding:'18px 20px',maxWidth:820}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:'var(--tx)',marginBottom:4,letterSpacing:'-.01em'}}>
                      Landing the Internship
                    </div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:18}}>
                      what actually gets you the interview
                    </div>

                    {/* Mode-specific tips */}
                    <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
                      {MODES.map(m=>(
                        <button key={m.id} className={`mode-btn ${data.outputMode===m.id?'on':''}`}
                          onClick={()=>set('outputMode',m.id)}>{m.label}</button>
                      ))}
                    </div>

                    {data.outputMode==='letter'&&[
                      {t:'Research one specific thing about the company',
                       b:'Don\'t say "I admire your innovative culture." Say "I read your engineering blog post on how you rebuilt the recommendation system — the tradeoffs you described between recall and precision are exactly what my thesis explores." One specific detail > ten generic compliments.'},
                      {t:'Lead with your strongest card',
                       b:'Don\'t bury your best achievement in paragraph three. If you built something impressive, won something, or have a metric that stands out — open with it or put it in paragraph one. Recruiters scan.'},
                      {t:'The "so what" test',
                       b:'After every sentence, ask "so what?" "I know Python." So what? "I used Python to build a tool that automated 3 hours of weekly data processing for my research lab." That\'s a cover letter sentence.'},
                      {t:'Make the CTA specific',
                       b:'"I look forward to hearing from you" is weak. "I would love to discuss how my experience in X could contribute to your Y team — I\'m available for a 20-minute call any time next week" is a specific ask that\'s easy to say yes to.'},
                    ].map(({t,b})=>(
                      <div key={t} style={{marginBottom:10,padding:'11px 13px',borderRadius:dark?3:9,
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        background:dark?'rgba(0,0,0,.2)':'rgba(246,252,232,.8)'}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:12.5,fontWeight:700,color:'var(--acc)',marginBottom:5}}>✦ {t}</div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.72}}>{b}</div>
                      </div>
                    ))}

                    {data.outputMode==='email'&&[
                      {t:'Subject line is 50% of your open rate',
                       b:'"Internship Application" gets deleted. "CS junior who built [thing] — worth 20 min?" gets opened. Use the subject line generator for options.'},
                      {t:'Four sentences maximum per paragraph',
                       b:'Cold emails are read on phones, often in seconds. Three paragraphs: hook (you) → value (what you bring) → ask (one specific request). Never more than 200 words.'},
                      {t:'Find the right person to email',
                       b:'HR inboxes are black holes. Find the engineering manager, the team lead, or the person whose job you\'d be supporting on LinkedIn. A direct cold email to the right person beats an ATS application every time.'},
                      {t:'The P.S. line',
                       b:'Postscripts are the second-most-read part of an email after the subject line. "P.S. Here\'s a link to the project I mentioned: [link]" drives clicks and makes you memorable.'},
                    ].map(({t,b})=>(
                      <div key={t} style={{marginBottom:10,padding:'11px 13px',borderRadius:dark?3:9,
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        background:dark?'rgba(0,0,0,.2)':'rgba(246,252,232,.8)'}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:12.5,fontWeight:700,color:'var(--acc)',marginBottom:5}}>✦ {t}</div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.72}}>{b}</div>
                      </div>
                    ))}

                    {data.outputMode==='linkedin'&&[
                      {t:'Connect first, message second',
                       b:'Connection acceptance rates are 3–5× higher than cold InMail response rates. Send a note with your connection request. Once connected, your DM goes to their main inbox, not filtered.'},
                      {t:'Reference something real',
                       b:'"I came across your post on distributed systems and found the section on consistency tradeoffs fascinating" is the opener that gets a reply. Flattery is ignored. Genuine engagement gets responded to.'},
                      {t:'One ask, not many',
                       b:'"Could we have a 15-minute call?" is a clear, low-commitment ask. "Could you review my CV, forward it to your team, and set up interviews?" is a lot. One ask. Make it easy.'},
                      {t:'Your profile must back it up',
                       b:'Before sending any DM, make sure your LinkedIn profile is complete — photo, headline, featured section with your best project. They will click on your profile within 30 seconds of reading your message.'},
                    ].map(({t,b})=>(
                      <div key={t} style={{marginBottom:10,padding:'11px 13px',borderRadius:dark?3:9,
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        background:dark?'rgba(0,0,0,.2)':'rgba(246,252,232,.8)'}}>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:12.5,fontWeight:700,color:'var(--acc)',marginBottom:5}}>✦ {t}</div>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.72}}>{b}</div>
                      </div>
                    ))}

                    <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:700,color:'var(--tx)',margin:'14px 0 10px'}}>
                      Common mistakes
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      {[
                        {t:'Starting with "I"',           b:'"I am a second-year student at…" Every intern letter starts this way. Don\'t. Open with the company, a question, or your strongest credential.'},
                        {t:'Generic company praise',      b:'"Your company is a leader in the industry" says nothing. If you can\'t say something specific, don\'t say it at all.'},
                        {t:'Listing skills without proof',b:'"I am a fast learner with strong communication skills." This is noise. Replace every claim with one piece of evidence.'},
                        {t:'No call-to-action',           b:'Ending with "Thank you for your time" leaves the recruiter with nothing to do. Ask for something specific — a call, a referral, a reply.'},
                      ].map(({t,b})=>(
                        <div key={t} style={{padding:'10px 12px',borderRadius:dark?3:9,
                          border:dark?'1px solid rgba(252,165,165,.2)':'1.5px solid rgba(153,27,27,.15)',
                          background:dark?'rgba(252,165,165,.04)':'rgba(254,228,228,.4)'}}>
                          <div style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,color:'var(--err)',marginBottom:4}}>✕ {t}</div>
                          <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,color:'var(--tx2)',lineHeight:1.65}}>{b}</div>
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