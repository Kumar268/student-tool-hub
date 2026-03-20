import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   COVER LETTER GENERATOR — Document Tools Series #4
   Theme: Dark Deep Ocean / Electric Amber · Light Pearl / Cobalt
   Fonts: DM Serif Display · DM Sans · Fira Code
   AI: Anthropic streaming — full letter generation + section rewrites
   Templates: 5 print styles
   Modes: Job Application · Career Change · Internship · Referral
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fira+Code:wght@300;400;500&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'DM Sans',sans-serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes amber-glow{0%,100%{box-shadow:0 0 0 0 rgba(251,191,36,.18)}50%{box-shadow:0 0 0 8px rgba(251,191,36,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(600%)}}
@keyframes type-in{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:none}}
@keyframes shimmer{0%{opacity:.4}50%{opacity:1}100%{opacity:.4}}

.dk{
  --bg:#060810;--s1:#090c18;--s2:#0d1020;--s3:#121530;
  --bdr:#1a1f3a;--bdr-hi:rgba(251,191,36,.25);
  --acc:#fbbf24;--acc2:#fcd34d;--acc3:#60a5fa;--acc4:#a78bfa;
  --tx:#f0f4ff;--tx2:#8898cc;--tx3:#1a1f3a;--txm:#3d4a7a;
  --err:#f87171;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 70% 40% at 50% -8%,rgba(251,191,36,.05),transparent),
    radial-gradient(ellipse 40% 50% at 92% 85%,rgba(96,165,250,.04),transparent),
    radial-gradient(ellipse 35% 40% at 8% 60%,rgba(167,139,250,.03),transparent);
}
.lt{
  --bg:#f8faff;--s1:#ffffff;--s2:#f0f3fc;--s3:#e4e9f8;
  --bdr:#c8d0ea;--bdr-hi:#1e3a8a;
  --acc:#1e40af;--acc2:#2563eb;--acc3:#7c3aed;--acc4:#0369a1;
  --tx:#0f1b3d;--tx2:#1e40af;--tx3:#c8d0ea;--txm:#4b6cb7;
  --err:#991b1b;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(30,64,175,.05),transparent);
}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(6,8,16,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(248,250,255,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(30,64,175,.07);}

.scanline{position:fixed;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(251,191,36,.3),transparent);
  animation:scan 5s linear infinite;pointer-events:none;z-index:999;}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 15px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'DM Sans',sans-serif;font-size:11px;
  font-weight:500;letter-spacing:.04em;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--txm);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(251,191,36,.04);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#94a3b8;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(30,64,175,.04);font-weight:600;}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns:230px 1fr;min-height:calc(100vh - 86px);}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:14px 18px;display:flex;flex-direction:column;gap:14px;overflow-x:hidden;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(30,64,175,.05);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 22px;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:11.5px;font-weight:700;letter-spacing:.04em;transition:all .16s;border:none;}
.dk .btn{background:var(--acc);color:#060810;border-radius:3px;animation:amber-glow 2.8s infinite;}
.dk .btn:hover{background:#fde68a;transform:translateY(-1px);animation:none;box-shadow:0 0 28px rgba(251,191,36,.5);}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;animation:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:9px;box-shadow:0 4px 14px rgba(30,64,175,.28);}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);box-shadow:0 8px 24px rgba(30,64,175,.38);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;}
.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(251,191,36,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(30,64,175,.05);}

.fi{width:100%;outline:none;font-family:'DM Sans',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;resize:vertical;}
.dk .fi{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(251,191,36,.1);}
.lt .fi{background:#f8faff;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(30,64,175,.09);}
.fi::placeholder{opacity:.3;}

.lbl{font-family:'DM Sans',sans-serif;font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(251,191,36,.45);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(251,191,36,.32);}
.lt .slbl{color:var(--acc);}

/* letter editor */
.letter-editor{width:100%;min-height:420px;font-family:'Lora',serif;font-size:14px;
  line-height:1.85;padding:28px 32px;resize:vertical;outline:none;}
.dk .letter-editor{background:rgba(0,0,0,.55);border:1px solid var(--bdr);border-radius:4px;color:var(--tx);}
.dk .letter-editor:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(251,191,36,.08);}
.lt .letter-editor{background:#ffffff;border:1.5px solid var(--bdr);border-radius:10px;color:var(--tx);}
.lt .letter-editor:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(30,64,175,.08);}

/* AI output */
.ai-box{font-family:'Fira Code',monospace;font-size:12px;line-height:1.78;
  padding:15px 17px;min-height:60px;white-space:pre-wrap;word-break:break-word;}
.dk .ai-box{color:#fde68a;background:rgba(0,0,0,.55);border:1px solid rgba(251,191,36,.12);border-radius:4px;}
.lt .ai-box{color:#0f1b3d;background:#fef9e8;border:1.5px solid rgba(30,64,175,.12);border-radius:10px;}
.cur{display:inline-block;width:7px;height:13px;background:var(--acc);animation:blink .7s infinite;vertical-align:text-bottom;margin-left:1px;}

/* tone badge */
.tone-btn{padding:6px 13px;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:10.5px;font-weight:600;transition:all .13s;}
.dk .tone-btn{border:1px solid var(--bdr);border-radius:3px;background:transparent;color:var(--txm);}
.dk .tone-btn.on{border-color:var(--acc);background:rgba(251,191,36,.08);color:var(--acc);}
.lt .tone-btn{border:1.5px solid var(--bdr);border-radius:8px;background:transparent;color:var(--txm);}
.lt .tone-btn.on{border-color:var(--acc);background:rgba(30,64,175,.07);color:var(--acc);}

/* word count bar */
.wc-bar{height:2px;border-radius:1px;transition:width .3s;}
.dk .wc-bar{background:var(--acc);}
.lt .wc-bar{background:var(--acc);}

.tpl-card{cursor:pointer;transition:all .18s;overflow:hidden;}
.dk .tpl-card{border:1px solid var(--bdr);border-radius:4px;}
.lt .tpl-card{border:1.5px solid var(--bdr);border-radius:12px;}
.tpl-card:hover{transform:translateY(-2px);}
.dk .tpl-card.active{border-color:var(--acc)!important;box-shadow:0 0 22px rgba(251,191,36,.18);}
.lt .tpl-card.active{border-color:var(--acc)!important;box-shadow:0 6px 24px rgba(30,64,175,.14);}

.prog{height:3px;border-radius:2px;overflow:hidden;margin-bottom:5px;}
.dk .prog{background:rgba(251,191,36,.1);}
.lt .prog{background:rgba(30,64,175,.08);}
.prog-bar{height:100%;border-radius:2px;transition:width .4s ease;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(251,191,36,.01);border:1px dashed rgba(251,191,36,.09);border-radius:3px;}
.lt .ad{background:rgba(30,64,175,.015);border:1.5px dashed rgba(30,64,175,.1);border-radius:9px;}
.ad span{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

.preview-bg{padding:28px;overflow:auto;border-radius:4px;}
.dk .preview-bg{background:var(--s3);}
.lt .preview-bg{background:#dde3f4;}

.step-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'Fira Code',monospace;font-size:11px;font-weight:500;flex-shrink:0;}
.dk .step-num{border:1px solid rgba(251,191,36,.3);background:rgba(251,191,36,.07);color:var(--acc);}
.lt .step-num{border:1.5px solid rgba(30,64,175,.28);background:rgba(30,64,175,.06);color:var(--acc);}
`;

/* ═══ PRINT CSS ═══ */
const PRINT_CSS = {
  clean: `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
    body{font-family:'DM Sans',sans-serif;color:#111;background:white;}
    @media print{@page{margin:.7in}}
    .letter{padding:48px 56px;max-width:100%;}
    .sender{margin-bottom:28px;}
    .sender-name{font-size:18px;font-weight:700;color:#111;margin-bottom:2px;}
    .sender-contact{font-size:12px;color:#666;line-height:1.7;}
    .date{font-size:12px;color:#666;margin-bottom:18px;}
    .recipient{margin-bottom:22px;}
    .recipient div{font-size:12.5px;color:#111;line-height:1.65;}
    .subject{font-size:13px;font-weight:700;color:#111;margin-bottom:18px;}
    .body{font-family:'Lora',serif;font-size:13.5px;color:#222;line-height:1.85;white-space:pre-wrap;}
    .sign{margin-top:28px;font-size:13px;color:#111;}
  `,
  executive: `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
    body{font-family:'DM Sans',sans-serif;color:#111;background:white;}
    @media print{@page{margin:.65in}}
    .letter{padding:44px 52px;}
    .header-rule{height:3px;background:linear-gradient(90deg,#1e3a8a,#60a5fa);margin-bottom:28px;}
    .sender-name{font-family:'DM Serif Display',serif;font-size:22px;color:#1e3a8a;margin-bottom:3px;}
    .sender-contact{font-size:11.5px;color:#666;line-height:1.7;}
    .date{font-size:12px;color:#888;margin:18px 0;}
    .recipient div{font-size:12.5px;color:#111;line-height:1.65;margin-bottom:22px;}
    .subject{font-size:13px;font-weight:700;color:#1e3a8a;margin-bottom:18px;padding-bottom:6px;border-bottom:1px solid #dde3f4;}
    .body{font-family:'Lora',serif;font-size:13.5px;color:#222;line-height:1.85;white-space:pre-wrap;}
    .sign{margin-top:28px;font-size:13px;color:#111;}
    .footer-rule{height:1px;background:#dde3f4;margin-top:32px;}
  `,
  modern: `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;900&family=Lora:ital,wght@0,400;1,400&display=swap');
    body{font-family:'DM Sans',sans-serif;color:#111;background:white;}
    @media print{@page{margin:0}}
    .letter{padding:0;}
    .sidebar-band{background:#1e3a8a;width:6px;position:fixed;left:0;top:0;bottom:0;}
    .content{padding:44px 52px 44px 64px;}
    .sender-name{font-size:22px;font-weight:900;color:#1e3a8a;letter-spacing:-.01em;margin-bottom:2px;}
    .sender-contact{font-size:11.5px;color:#666;line-height:1.7;}
    .date{font-size:12px;color:#888;margin:16px 0;}
    .recipient{margin-bottom:22px;}
    .recipient div{font-size:12.5px;color:#111;line-height:1.65;}
    .subject{font-size:13px;font-weight:700;color:#111;margin-bottom:18px;}
    .body{font-size:13.5px;color:#222;line-height:1.85;white-space:pre-wrap;}
    .sign{margin-top:28px;font-size:13px;}
  `,
  minimal: `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
    body{font-family:'DM Sans',sans-serif;color:#111;background:white;}
    @media print{@page{margin:.75in}}
    .letter{padding:52px 60px;}
    .sender-name{font-size:16px;font-weight:600;color:#111;margin-bottom:2px;}
    .sender-contact{font-size:11.5px;color:#aaa;line-height:1.7;}
    .date{font-size:12px;color:#aaa;margin:16px 0;}
    .recipient{margin-bottom:20px;}
    .recipient div{font-size:12.5px;color:#111;line-height:1.65;}
    .subject{font-size:12.5px;font-weight:600;color:#111;margin-bottom:16px;}
    .body{font-size:13.5px;color:#333;line-height:1.88;white-space:pre-wrap;}
    .sign{margin-top:28px;font-size:13px;color:#111;}
  `,
  classic: `
    @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap');
    body{font-family:'Lora',serif;color:#1a1000;background:white;}
    @media print{@page{margin:.7in}}
    .letter{padding:48px 54px;}
    .sender-name{font-size:18px;font-weight:600;color:#1a1000;margin-bottom:3px;}
    .sender-contact{font-size:12px;color:#666;line-height:1.7;}
    .date{font-size:12px;color:#888;margin:18px 0;}
    .recipient{margin-bottom:22px;}
    .recipient div{font-size:13px;color:#1a1000;line-height:1.7;}
    .subject{font-size:13.5px;font-weight:600;font-style:italic;color:#1a1000;margin-bottom:18px;}
    .body{font-size:13.5px;color:#1a1000;line-height:1.88;white-space:pre-wrap;}
    .sign{margin-top:28px;font-size:13px;}
    .divider{height:1px;background:#e0d0c0;margin:14px 0;}
  `,
};

const TEMPLATES = [
  {id:'clean',     label:'Clean',     tag:'Professional Modern'},
  {id:'executive', label:'Executive', tag:'Navy Accent Header'},
  {id:'modern',    label:'Modern',    tag:'Left Band Accent'},
  {id:'minimal',   label:'Minimal',   tag:'Ultra Clean'},
  {id:'classic',   label:'Classic',   tag:'Serif Traditional'},
];

const MODES = [
  {id:'application', label:'Job Application',  icon:'📋', desc:'Applying for a posted role'},
  {id:'change',      label:'Career Change',    icon:'🔄', desc:'Switching industries'},
  {id:'internship',  label:'Internship',       icon:'🎓', desc:'Student/graduate applying'},
  {id:'referral',    label:'Referral Letter',  icon:'🤝', desc:'Referred by someone'},
];

const TONES = ['Professional','Enthusiastic','Confident','Humble','Creative'];

const safe = s => (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

function buildLetter(d, tpl) {
  const date = d.date || new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  const css = PRINT_CSS[tpl] || PRINT_CSS.clean;

  const senderHTML = `
    <div class="sender">
      <div class="sender-name">${safe(d.yourName||'Your Name')}</div>
      <div class="sender-contact">
        ${[d.yourTitle, d.yourEmail, d.yourPhone, d.yourAddress].filter(Boolean).map(safe).join(' · ')}
      </div>
    </div>`;

  const dateHTML = `<div class="date">${safe(date)}</div>`;

  const recipientHTML = `
    <div class="recipient">
      ${[d.hiringManager, d.hiringTitle, d.company, d.companyAddress].filter(Boolean)
        .map(v=>`<div>${safe(v)}</div>`).join('')}
    </div>`;

  const subjectHTML = d.jobTitle
    ? `<div class="subject">Re: Application for ${safe(d.jobTitle)}${d.jobRef?` (Ref: ${safe(d.jobRef)})`:''}
    </div>`:'';

  const bodyHTML = `<div class="body">${safe(d.letter||'Your cover letter will appear here after generating with AI.')}</div>`;

  const signHTML = `
    <div class="sign">
      <div>Sincerely,</div>
      <div style="margin-top:20px;font-weight:600;">${safe(d.yourName||'Your Name')}</div>
    </div>`;

  if (tpl === 'modern') {
    return `<div class="letter">
      <div class="sidebar-band"></div>
      <div class="content">
        ${senderHTML}${dateHTML}${recipientHTML}${subjectHTML}${bodyHTML}${signHTML}
      </div>
    </div>`;
  }
  if (tpl === 'executive') {
    return `<div class="letter">
      <div class="header-rule"></div>
      ${senderHTML}${dateHTML}${recipientHTML}${subjectHTML}${bodyHTML}${signHTML}
      <div class="footer-rule"></div>
    </div>`;
  }
  if (tpl === 'classic') {
    return `<div class="letter">
      ${senderHTML}
      <div class="divider"></div>
      ${dateHTML}${recipientHTML}${subjectHTML}${bodyHTML}${signHTML}
    </div>`;
  }
  return `<div class="letter">${senderHTML}${dateHTML}${recipientHTML}${subjectHTML}${bodyHTML}${signHTML}</div>`;
}

const EMPTY = {
  yourName:'', yourTitle:'', yourEmail:'', yourPhone:'', yourAddress:'', date:'',
  hiringManager:'', hiringTitle:'', company:'', companyAddress:'',
  jobTitle:'', jobRef:'', jobDesc:'',
  yourBg:'', keySkills:'', whyCompany:'', referredBy:'',
  letter:'',
};

const TABS = [
  {id:'details',   label:'✎ Details'},
  {id:'generate',  label:'✦ Generate'},
  {id:'edit',      label:'✏ Edit Letter'},
  {id:'preview',   label:'◉ Preview'},
  {id:'templates', label:'▦ Templates'},
  {id:'guide',     label:'? Guide'},
];

export default function CoverLetterGenerator() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';
  const [tab, setTab]   = useState('details');
  const [tpl, setTpl]   = useState('clean');
  const [mode, setMode] = useState('application');
  const [tone, setTone] = useState('Professional');
  const [data, setData] = useState({...EMPTY});

  const [aiOut,  setAiOut]  = useState('');
  const [aiLoad, setAiLoad] = useState(false);
  const [aiErr,  setAiErr]  = useState('');
  const [aiSec,  setAiSec]  = useState('full'); // full | opening | body | closing

  const set = (k,v) => setData(p=>({...p,[k]:v}));

  const wordCount = (data.letter||'').split(/\s+/).filter(Boolean).length;
  const wcPct = Math.min(100, Math.round((wordCount/400)*100));
  const wcColor = wordCount < 200 ? '#f87171' : wordCount > 450 ? '#fbbf24' : '#34d399';

  const filled = [data.yourName, data.yourEmail, data.company, data.jobTitle, data.yourBg]
    .filter(Boolean).length;
  const pct = Math.round((filled/5)*100);

  /* ── AI prompts ── */
  const buildPrompt = () => {
    const base = `
Name: ${data.yourName||'[Applicant]'}
Applying for: ${data.jobTitle||'[Role]'} at ${data.company||'[Company]'}
My background: ${data.yourBg||'[Professional background]'}
Key skills: ${data.keySkills||'[Skills]'}
Why this company: ${data.whyCompany||''}
Tone: ${tone}
Mode: ${mode}
${data.referredBy?`Referred by: ${data.referredBy}`:''}
${data.jobDesc?`Job description excerpt:\n${data.jobDesc}`:''}`;

    const instructions = {
      full: `Write a complete, compelling cover letter for a job application based on the info below. 3–4 paragraphs: opening hook, why I'm the right fit with specific skills/achievements, why this company, and a confident closing. Do NOT include a header/address block — just the salutation through sign-off. Output only the letter text.\n${base}`,
      opening: `Write just the opening paragraph (2–3 sentences) of a cover letter. It should hook the reader immediately — mention the role, a notable achievement or unique angle, and express genuine enthusiasm. Tone: ${tone}.\n${base}\nOutput only the opening paragraph.`,
      body: `Write just the body paragraphs (2 paragraphs) of a cover letter that demonstrate key skills and achievements. Use specific examples. Tone: ${tone}.\n${base}\nOutput only the 2 body paragraphs.`,
      closing: `Write just the closing paragraph (2–3 sentences) of a cover letter. Express enthusiasm, include a call to action (requesting an interview), and close confidently. Tone: ${tone}.\n${base}\nOutput only the closing paragraph.`,
    };
    return instructions[aiSec] || instructions.full;
  };

  const runAI = async () => {
    setAiLoad(true); setAiOut(''); setAiErr('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:1000, stream:true,
          messages:[{role:'user', content: buildPrompt()}]}),
      });
      if (!res.ok) { setAiErr('API error'); setAiLoad(false); return; }
      const reader = res.body.getReader(); const dec = new TextDecoder(); let buf='';
      while(true){
        const{done,value} = await reader.read(); if(done) break;
        buf += dec.decode(value,{stream:true});
        const lines = buf.split('\n'); buf = lines.pop();
        for(const line of lines){
          if(!line.startsWith('data: ')) continue;
          const p=line.slice(6); if(p==='[DONE]') break;
          try{const o=JSON.parse(p);if(o.type==='content_block_delta'&&o.delta?.type==='text_delta')setAiOut(v=>v+o.delta.text);}catch{}
        }
      }
    } catch(e){ setAiErr(e.message); }
    finally{ setAiLoad(false); }
  };

  const applyLetter = () => {
    if (!aiOut) return;
    if (aiSec === 'full') {
      set('letter', aiOut);
    } else {
      // append section
      set('letter', (data.letter ? data.letter + '\n\n' : '') + aiOut);
    }
    setTab('edit');
  };

  const printLetter = () => {
    const html = buildLetter(data, tpl);
    const css  = PRINT_CSS[tpl] || PRINT_CSS.clean;
    const w = window.open('','_blank');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
      <title>Cover Letter — ${data.yourName||'Applicant'}</title>
      <style>${css}</style></head>
      <body>${html}<script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
  };

  const TplThumb = ({t}) => {
    const nm = data.yourName || 'Alex Johnson';
    const jt = data.jobTitle || 'Product Manager';
    const co = data.company  || 'Google';
    const thumbs = {
      clean: <div style={{padding:'12px 14px'}}>
        <div style={{fontSize:'2.2em',fontWeight:700,marginBottom:2}}>{nm}</div>
        <div style={{fontSize:'1.3em',color:'#666',marginBottom:8}}>alex@email.com · +1 555 0100</div>
        <div style={{height:1,background:'#eee',marginBottom:7}}/>
        <div style={{fontSize:'1.4em',fontWeight:700,color:'#111',marginBottom:4}}>Re: Application for {jt}</div>
        <div style={{fontSize:'1.3em',color:'#444',lineHeight:1.7}}>Dear Hiring Manager,<br/>I am writing to express my strong interest in the {jt} role at {co}…</div>
      </div>,
      executive: <div style={{padding:'12px 14px'}}>
        <div style={{height:3,background:'linear-gradient(90deg,#1e3a8a,#60a5fa)',marginBottom:10}}/>
        <div style={{fontSize:'2em',fontFamily:'serif',color:'#1e3a8a',marginBottom:2}}>{nm}</div>
        <div style={{fontSize:'1.3em',color:'#888',marginBottom:8}}>alex@email.com</div>
        <div style={{fontSize:'1.4em',fontWeight:700,color:'#1e3a8a',borderBottom:'1px solid #dde3f4',paddingBottom:3,marginBottom:5}}>Re: {jt}</div>
        <div style={{fontSize:'1.3em',color:'#333',lineHeight:1.7}}>Dear Hiring Manager,<br/>I am writing to express…</div>
      </div>,
      modern: <div style={{display:'flex',height:'100%'}}>
        <div style={{width:6,background:'#1e3a8a',flexShrink:0}}/>
        <div style={{padding:'12px 14px',flex:1}}>
          <div style={{fontSize:'2.2em',fontWeight:900,color:'#1e3a8a',marginBottom:2}}>{nm}</div>
          <div style={{fontSize:'1.3em',color:'#888',marginBottom:8}}>Product Manager</div>
          <div style={{fontSize:'1.4em',fontWeight:700,marginBottom:4}}>Re: {jt}</div>
          <div style={{fontSize:'1.3em',color:'#444',lineHeight:1.7}}>Dear Hiring Manager,<br/>With 5+ years of…</div>
        </div>
      </div>,
      minimal: <div style={{padding:'14px 16px'}}>
        <div style={{fontSize:'1.9em',fontWeight:600,marginBottom:2}}>{nm}</div>
        <div style={{fontSize:'1.2em',color:'#aaa',marginBottom:8}}>alex@email.com</div>
        <div style={{height:1,background:'#eee',marginBottom:7}}/>
        <div style={{fontSize:'1.3em',fontWeight:600,marginBottom:5}}>Re: Application for {jt}</div>
        <div style={{fontSize:'1.3em',color:'#333',lineHeight:1.7}}>Dear Hiring Manager,<br/>I am excited to apply…</div>
      </div>,
      classic: <div style={{padding:'12px 14px',fontFamily:'serif'}}>
        <div style={{fontSize:'2em',fontWeight:600,marginBottom:2}}>{nm}</div>
        <div style={{fontSize:'1.3em',color:'#888',marginBottom:6}}>alex@email.com</div>
        <div style={{height:1,background:'#e0d0c0',marginBottom:6}}/>
        <div style={{fontSize:'1.4em',fontStyle:'italic',fontWeight:600,marginBottom:4}}>Re: Application for {jt}</div>
        <div style={{fontSize:'1.3em',color:'#444',lineHeight:1.7}}>Dear Hiring Manager,<br/>It is with great enthusiasm…</div>
      </div>,
    };
    return (
      <div style={{height:128,overflow:'hidden',background:'white',position:'relative',fontSize:'27%'}}>
        {thumbs[t.id]}
        {tpl===t.id&&<div style={{position:'absolute',inset:0,background:'rgba(251,191,36,.07)',
          border:'2px solid #fbbf24',display:'flex',alignItems:'flex-start',justifyContent:'flex-end',padding:5}}>
          <span style={{background:'#fbbf24',color:'#060810',fontFamily:'monospace',fontSize:8,fontWeight:700,padding:'2px 6px',borderRadius:2}}>✓ ACTIVE</span>
        </div>}
      </div>
    );
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>
        {dark&&<div className="scanline"/>}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:32,height:32,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:16,borderRadius:dark?3:9,
              border:dark?'1px solid rgba(251,191,36,.32)':'none',
              background:dark?'rgba(251,191,36,.08)':'linear-gradient(135deg,#1e40af,#2563eb)',
              boxShadow:dark?'0 0 16px rgba(251,191,36,.22)':'0 3px 10px rgba(30,64,175,.35)',
            }}>💌</div>
            <div>
              <div style={{fontFamily:"'DM Serif Display',serif",fontWeight:400,fontSize:16,color:'var(--tx)',lineHeight:1}}>
                Cover Letter<span style={{color:'var(--acc)'}}> Generator</span>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #4 · AI-powered · 5 templates · 4 modes
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <div style={{width:90}}>
              <div className="prog"><div className="prog-bar" style={{width:`${pct}%`}}/></div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',textAlign:'right'}}>{pct}% ready</div>
            </div>
          </div>
          <button onClick={()=>setDark(d=>!d)} style={{
            display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(251,191,36,.2)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer',
          }}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#c8d0ea',
              boxShadow:dark?'0 0 8px rgba(251,191,36,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#060810':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)'}}>{dark?'VOID':'LIGHT'}</span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>
              {t.label}
              {t.id==='edit'&&wordCount>0&&<span style={{fontFamily:"'Fira Code',monospace",fontSize:8,
                marginLeft:4,padding:'1px 5px',borderRadius:99,
                background:dark?'rgba(251,191,36,.1)':'rgba(30,64,175,.08)',
                color:'var(--acc)'}}>{wordCount}w</span>}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="body">
          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* Mode */}
            <div>
              <div className="slbl">Letter mode</div>
              {MODES.map(m=>(
                <button key={m.id} onClick={()=>setMode(m.id)} style={{
                  width:'100%',display:'flex',alignItems:'center',gap:8,
                  padding:'7px 9px',marginBottom:4,cursor:'pointer',
                  border:mode===m.id?`1px solid var(--acc)`:(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                  borderRadius:dark?3:7,
                  background:mode===m.id?(dark?'rgba(251,191,36,.05)':'rgba(30,64,175,.04)'):'transparent',
                }}>
                  <span style={{fontSize:14}}>{m.icon}</span>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,
                      color:mode===m.id?'var(--acc)':'var(--tx)'}}>{m.label}</div>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:7.5,color:'var(--txm)',marginTop:1}}>{m.desc}</div>
                  </div>
                  {mode===m.id&&<span style={{fontSize:10,color:'var(--acc)',marginLeft:'auto'}}>✓</span>}
                </button>
              ))}
            </div>

            {/* Template */}
            <div>
              <div className="slbl">Template</div>
              {TEMPLATES.map(t=>(
                <button key={t.id} onClick={()=>setTpl(t.id)} style={{
                  width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',
                  padding:'6px 9px',marginBottom:3,cursor:'pointer',
                  border:tpl===t.id?`1px solid var(--acc)`:(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                  borderRadius:dark?3:7,
                  background:tpl===t.id?(dark?'rgba(251,191,36,.05)':'rgba(30,64,175,.04)'):'transparent',
                }}>
                  <div>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,
                      color:tpl===t.id?'var(--acc)':'var(--tx)'}}>{t.label}</div>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:7.5,color:'var(--txm)',marginTop:1}}>{t.tag}</div>
                  </div>
                  {tpl===t.id&&<span style={{fontSize:10,color:'var(--acc)'}}>✓</span>}
                </button>
              ))}
            </div>

            {/* Tone */}
            <div>
              <div className="slbl">Tone</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                {TONES.map(t=>(
                  <button key={t} className={`tone-btn ${tone===t?'on':''}`} onClick={()=>setTone(t)}>{t}</button>
                ))}
              </div>
            </div>

            {/* Export */}
            <div>
              <div className="slbl">Export</div>
              <button className="gbtn" onClick={printLetter} style={{width:'100%',justifyContent:'flex-start',marginBottom:5,padding:'7px 10px'}}>
                🖨 Print / Save PDF
              </button>
              <button className="gbtn" onClick={()=>{try{navigator.clipboard.writeText(data.letter||'')}catch{}}}
                style={{width:'100%',justifyContent:'flex-start',padding:'7px 10px'}}>
                ⎘ Copy text
              </button>
            </div>

            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ╔══ DETAILS ══╗ */}
              {tab==='details'&&(
                <motion.div key="details" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div style={{fontFamily:"'DM Serif Display',serif",fontSize:15,color:'var(--tx)',marginBottom:13}}>Your Information</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:9}}>
                      {[
                        ['Full name','yourName','text','Alex Johnson'],
                        ['Current title','yourTitle','text','Senior Product Manager'],
                        ['Email','yourEmail','email','alex@email.com'],
                        ['Phone','yourPhone','tel','+1 555 010 2030'],
                        ['Address (optional)','yourAddress','text','San Francisco, CA'],
                        ['Date','date','text', new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})],
                      ].map(([label,k,type,ph])=>(
                        <div key={k}>
                          <label className="lbl">{label}</label>
                          <input className="fi" type={type} placeholder={ph}
                            value={data[k]||''} onChange={e=>set(k,e.target.value)}/>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div style={{fontFamily:"'DM Serif Display',serif",fontSize:15,color:'var(--tx)',marginBottom:13}}>Job & Company</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:9}}>
                      {[
                        ['Job title applying for','jobTitle','text','Product Manager'],
                        ['Company name','company','text','Google'],
                        ['Hiring manager name','hiringManager','text','Ms. Sarah Chen'],
                        ['Hiring manager title','hiringTitle','text','Head of Product'],
                        ['Company address (optional)','companyAddress','text','1600 Amphitheatre Pkwy, CA'],
                        ['Job reference # (optional)','jobRef','text','JOB-2024-PM-001'],
                      ].map(([label,k,type,ph])=>(
                        <div key={k}>
                          <label className="lbl">{label}</label>
                          <input className="fi" type={type} placeholder={ph}
                            value={data[k]||''} onChange={e=>set(k,e.target.value)}/>
                        </div>
                      ))}
                    </div>
                    <div style={{marginTop:9}}>
                      <label className="lbl">Job description excerpt (optional but recommended)</label>
                      <textarea className="fi" rows={4}
                        placeholder="Paste key requirements from the job posting — AI will tailor the letter to match keywords…"
                        value={data.jobDesc||''} onChange={e=>set('jobDesc',e.target.value)}/>
                    </div>
                  </div>

                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div style={{fontFamily:"'DM Serif Display',serif",fontSize:15,color:'var(--tx)',marginBottom:13}}>Your Background</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(1,1fr)',gap:9}}>
                      <div>
                        <label className="lbl">Your professional background (2–3 sentences)</label>
                        <textarea className="fi" rows={3}
                          placeholder="7 years in product management at Series B startups, led mobile app team from 10K to 2M users, previously at McKinsey…"
                          value={data.yourBg||''} onChange={e=>set('yourBg',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Key skills / achievements to highlight</label>
                        <textarea className="fi" rows={3}
                          placeholder="Led cross-functional teams of 15, launched 3 B2B SaaS products, increased revenue 40%, expert in Agile/Scrum…"
                          value={data.keySkills||''} onChange={e=>set('keySkills',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Why this company? (what excites you about them)</label>
                        <textarea className="fi" rows={2}
                          placeholder="Their mission to organise world's information resonates deeply — especially the recent AI search initiatives…"
                          value={data.whyCompany||''} onChange={e=>set('whyCompany',e.target.value)}/>
                      </div>
                      {mode==='referral'&&(
                        <div>
                          <label className="lbl">Referred by</label>
                          <input className="fi" placeholder="John Smith, Senior Engineer at Google" value={data.referredBy||''} onChange={e=>set('referredBy',e.target.value)}/>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{display:'flex',gap:10}}>
                    <button className="btn" onClick={()=>setTab('generate')} style={{padding:'10px 28px'}}>
                      ✦ Generate with AI →
                    </button>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:10.5,color:'var(--txm)',alignSelf:'center'}}>
                      Mode: <span style={{color:'var(--acc)'}}>{MODES.find(m2=>m2.id===mode)?.label}</span>
                      &nbsp;· Tone: <span style={{color:'var(--acc)'}}>{tone}</span>
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ╔══ GENERATE ══╗ */}
              {tab==='generate'&&(
                <motion.div key="generate" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div style={{fontFamily:"'DM Serif Display',serif",fontSize:16,color:'var(--tx)',marginBottom:5}}>
                      ✦ AI Letter Generator
                    </div>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:9.5,color:'var(--txm)',marginBottom:16}}>
                      Mode: {MODES.find(m2=>m2.id===mode)?.label} &nbsp;·&nbsp; Tone: {tone} &nbsp;·&nbsp; Template: {TEMPLATES.find(t=>t.id===tpl)?.label}
                    </div>

                    {/* Section selector */}
                    <div style={{marginBottom:14}}>
                      <label className="lbl" style={{marginBottom:8}}>Generate which part?</label>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:7}}>
                        {[
                          {id:'full',    icon:'📄',label:'Full Letter',   desc:'Complete letter, 3–4 paragraphs'},
                          {id:'opening', icon:'✍',label:'Opening Only',  desc:'Hook paragraph only'},
                          {id:'body',    icon:'📝',label:'Body Paragraphs',desc:'Middle 2 paragraphs'},
                          {id:'closing', icon:'🎯',label:'Closing Only',  desc:'Final CTA paragraph'},
                        ].map(({id,icon,label,desc})=>(
                          <button key={id} className={`gbtn ${aiSec===id?'on':''}`}
                            onClick={()=>setAiSec(id)}
                            style={{flexDirection:'column',gap:3,height:'auto',padding:'10px 10px',
                              alignItems:'flex-start',
                              background:aiSec===id?(dark?'rgba(251,191,36,.06)':'rgba(30,64,175,.05)'):''
                            }}>
                            <span style={{fontSize:16}}>{icon}</span>
                            <span style={{fontSize:10.5,fontWeight:600,color:'var(--tx)',textTransform:'none',letterSpacing:0}}>{label}</span>
                            <span style={{fontSize:8.5,opacity:.55,textTransform:'none',letterSpacing:0,fontFamily:"'Fira Code',monospace",lineHeight:1.4}}>{desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                      <button className="btn" onClick={runAI} disabled={aiLoad} style={{padding:'10px 28px'}}>
                        {aiLoad
                          ? <><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;Writing…</>
                          : `✦ Generate ${aiSec==='full'?'Full Letter':aiSec.charAt(0).toUpperCase()+aiSec.slice(1)}`}
                      </button>
                      {aiOut&&!aiLoad&&(
                        <>
                          <button className="gbtn" onClick={applyLetter}
                            style={{borderColor:'var(--acc)',color:'var(--acc)'}}>
                            → {aiSec==='full'?'Replace letter':'Append to letter'}
                          </button>
                          <button className="gbtn" onClick={()=>{try{navigator.clipboard.writeText(aiOut)}catch{}}}>
                            ⎘ Copy
                          </button>
                        </>
                      )}
                    </div>
                    {aiErr&&<div style={{marginTop:8,padding:'7px 11px',borderRadius:dark?3:8,
                      background:dark?'rgba(248,113,113,.06)':'rgba(185,28,28,.04)',
                      border:dark?'1px solid rgba(248,113,113,.2)':'1.5px solid rgba(185,28,28,.12)',
                      fontFamily:"'DM Sans',sans-serif",fontSize:12,color:'var(--err)'}}>⚠ {aiErr}</div>}
                  </div>

                  {/* Streaming output */}
                  {(aiOut||aiLoad)&&(
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
                        <label className="lbl" style={{margin:0}}>✦ Generated letter</label>
                        {aiOut&&!aiLoad&&<span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>
                          {aiOut.split(/\s+/).filter(Boolean).length} words
                        </span>}
                      </div>
                      <div className="ai-box">{aiOut}{aiLoad&&<span className="cur"/>}</div>
                    </div>
                  )}

                  {/* Quick summary of what will be generated */}
                  {!aiOut&&!aiLoad&&(
                    <div className="panel" style={{padding:'14px 16px'}}>
                      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:14,color:'var(--tx)',marginBottom:10}}>
                        What AI will write for you
                      </div>
                      {[
                        {t:'Opening hook', d:`A compelling first paragraph that mentions ${data.jobTitle||'the role'} and grabs attention immediately`},
                        {t:'Skills paragraph', d:`Highlights your background${data.keySkills?` — ${data.keySkills.slice(0,60)}…`:''}  with specific achievements`},
                        {t:'Company fit', d:`Why you chose ${data.company||'this company'} specifically, not a generic letter`},
                        {t:'Confident closing', d:'Clear call to action requesting an interview, polite but assertive'},
                      ].map(({t,d})=>(
                        <div key={t} style={{display:'flex',gap:9,marginBottom:9}}>
                          <span style={{color:'var(--acc)',flexShrink:0,fontSize:12,marginTop:2}}>▸</span>
                          <div>
                            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,color:'var(--tx)'}}>{t}</div>
                            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:'var(--tx2)',lineHeight:1.55,marginTop:2}}>{d}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ╔══ EDIT ══╗ */}
              {tab==='edit'&&(
                <motion.div key="edit" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  {/* Word count */}
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <label className="lbl" style={{margin:0}}>Letter body (editable)</label>
                      <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginTop:3}}>
                        Type directly, paste from AI, or use ✦ Generate tab
                      </div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:3}}>
                        <div style={{width:80,height:3,borderRadius:2,background:dark?'rgba(255,255,255,.08)':'rgba(0,0,0,.08)'}}>
                          <div className="wc-bar" style={{width:`${wcPct}%`,background:wcColor}}/>
                        </div>
                        <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:wordCount<200?'var(--err)':wordCount>450?'var(--warn)':'var(--acc)'}}>
                          {wordCount} words
                        </span>
                      </div>
                      <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)'}}>
                        {wordCount<200?'Too short':''}
                        {wordCount>=200&&wordCount<=400?'✓ Good length':''}
                        {wordCount>400&&wordCount<=450?'Getting long':''}
                        {wordCount>450?'⚠ Too long':''}
                        &nbsp;(aim: 250–350 words)
                      </div>
                    </div>
                  </div>

                  <textarea className="letter-editor"
                    placeholder={`Dear ${data.hiringManager||'Hiring Manager'},\n\nYour cover letter goes here. Use the ✦ Generate tab to have AI write it for you, or type directly here.\n\nSincerely,\n${data.yourName||'Your Name'}`}
                    value={data.letter||''} onChange={e=>set('letter',e.target.value)}/>

                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    <button className="gbtn" onClick={()=>setTab('generate')}>✦ Regenerate</button>
                    <button className="gbtn" onClick={()=>{try{navigator.clipboard.writeText(data.letter||'')}catch{}}}>⎘ Copy</button>
                    <button className="gbtn" onClick={()=>set('letter','')}>✕ Clear</button>
                    <button className="btn" onClick={()=>setTab('preview')} style={{marginLeft:'auto',padding:'7px 18px',fontSize:11}}>
                      ◉ Preview →
                    </button>
                  </div>

                  
                </motion.div>
              )}

              {/* ╔══ PREVIEW ══╗ */}
              {tab==='preview'&&(
                <motion.div key="preview" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div style={{display:'flex',gap:9,alignItems:'center',flexWrap:'wrap'}}>
                    <button className="btn" onClick={printLetter} style={{padding:'9px 22px'}}>🖨 Print / Save as PDF</button>
                    <button className="gbtn" onClick={()=>setTab('edit')}>✏ Edit letter</button>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:9.5,color:'var(--txm)'}}>
                      Template: <span style={{color:'var(--acc)'}}>{TEMPLATES.find(t=>t.id===tpl)?.label}</span>
                    </div>
                  </div>
                  <div className="preview-bg">
                    <div dangerouslySetInnerHTML={{__html:buildLetter(data,tpl)}}
                      style={{background:'white',color:'#111',maxWidth:794,margin:'0 auto',
                        fontFamily:"'DM Sans',sans-serif",lineHeight:1.55,
                        boxShadow:'0 6px 48px rgba(0,0,0,.3)',minHeight:400}}/>
                  </div>
                  
                </motion.div>
              )}

              {/* ╔══ TEMPLATES ══╗ */}
              {tab==='templates'&&(
                <motion.div key="tpl" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:13}}>
                    {TEMPLATES.map(t=>(
                      <motion.div key={t.id} whileHover={{y:-3}}
                        className={`tpl-card ${tpl===t.id?'active':''}`}
                        onClick={()=>setTpl(t.id)}>
                        <TplThumb t={t}/>
                        <div style={{padding:'10px 13px',display:'flex',justifyContent:'space-between',alignItems:'center',
                          borderTop:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          background:tpl===t.id?(dark?'rgba(251,191,36,.05)':'rgba(30,64,175,.04)'):(dark?'var(--s2)':'var(--s1)')}}>
                          <div>
                            <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12.5,fontWeight:600,
                              color:tpl===t.id?'var(--acc)':'var(--tx)'}}>{t.label}</div>
                            <div style={{fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)',marginTop:1}}>{t.tag}</div>
                          </div>
                          {tpl===t.id
                            ?<span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--acc)'}}>✓ Active</span>
                            :<span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>Select</span>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
                    {[
                      {id:'clean',    emoji:'🧹',t:'Clean',     b:'Simple professional layout. Works for any role, industry, or level. ATS-safe and widely accepted.'},
                      {id:'executive',emoji:'💼',t:'Executive', b:'Blue gradient header rule with navy name. Best for senior, management, or corporate applications.'},
                      {id:'modern',   emoji:'⬛',t:'Modern',   b:'Strong vertical left-band accent. Makes a visual statement. Good for design, product, and creative roles.'},
                      {id:'minimal',  emoji:'○', t:'Minimal',  b:'Pure clean, generous margins. Lets your words do all the work. Ideal for law, finance, academia.'},
                      {id:'classic',  emoji:'📜',t:'Classic',  b:'Lora serif throughout. Traditional and warm. Best for humanities, nonprofits, publishing, education.'},
                    ].map(({id,emoji,t,b})=>(
                      <div key={id} style={{padding:'12px 14px',borderRadius:dark?3:9,
                        border:tpl===id?`1px solid var(--acc)`:(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                        background:tpl===id?(dark?'rgba(251,191,36,.04)':'rgba(30,64,175,.04)'):(dark?'var(--s2)':'var(--s1)')}}>
                        <div style={{display:'flex',gap:7,alignItems:'center',marginBottom:5}}>
                          <span style={{fontSize:15}}>{emoji}</span>
                          <span style={{fontFamily:"'DM Serif Display',serif",fontSize:13,color:'var(--tx)'}}>{t}</span>
                          {tpl===id&&<span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--acc)',marginLeft:'auto'}}>ACTIVE</span>}
                        </div>
                        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12.5,color:'var(--tx2)',lineHeight:1.65}}>{b}</div>
                        {tpl!==id&&<button className="gbtn" onClick={()=>setTpl(id)} style={{marginTop:8,fontSize:9.5}}>Use this template</button>}
                      </div>
                    ))}
                  </div>
                  
                </motion.div>
              )}

              {/* ╔══ GUIDE ══╗ */}
              {tab==='guide'&&(
                <motion.div key="guide" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div className="panel" style={{padding:'20px 22px'}}>
                    <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:'var(--tx)',marginBottom:4}}>
                      How to write a great cover letter
                    </div>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',letterSpacing:'.14em',textTransform:'uppercase',marginBottom:20}}>
                      ai-powered · 4 modes · 5 templates
                    </div>
                    {[
                      {n:1,t:'Fill in your details first',d:'Go to ✎ Details and fill in your info, the job title, company name, and your background. The more context you give, the better the AI output. Paste the job description for the best results.'},
                      {n:2,t:'Choose your mode and tone',d:'Use the sidebar: Job Application for standard roles, Career Change if switching industries, Internship for students, Referral if someone referred you. Tone changes how formal/enthusiastic the writing is.'},
                      {n:3,t:'Generate with AI',d:'Go to ✦ Generate and click Generate Full Letter. AI will stream the letter live. You can also generate just the Opening, Body, or Closing to refine individual sections.'},
                      {n:4,t:'Edit in the letter editor',d:'✏ Edit Letter gives you a full text editor. The word count bar turns red (<200), green (200–400), or amber (>450). Aim for 250–350 words — exactly one printed page.'},
                      {n:5,t:'Preview and export',d:'◉ Preview shows the formatted letter. Click Print / Save as PDF to export. In the print dialog select "Save as PDF" as the destination.'},
                    ].map(({n,t,d})=>(
                      <div key={n} style={{display:'flex',gap:12,marginBottom:14}}>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
                          <div className="step-num">{n}</div>
                          {n<5&&<div style={{width:1.5,flex:1,marginTop:5,background:dark?'rgba(251,191,36,.1)':'rgba(30,64,175,.1)'}}/>}
                        </div>
                        <div style={{flex:1,paddingBottom:4}}>
                          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:15,color:'var(--tx)',marginBottom:4}}>{t}</div>
                          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13.5,color:'var(--tx2)',lineHeight:1.72}}>{d}</div>
                        </div>
                      </div>
                    ))}
                    {/* Tips */}
                    <div style={{borderTop:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',paddingTop:16,marginTop:8}}>
                      <div style={{fontFamily:"'DM Serif Display',serif",fontSize:15,color:'var(--tx)',marginBottom:12}}>Cover letter golden rules</div>
                      {[
                        ['Never start with "I am writing…"','AI knows this — but if you edit manually, make sure your first word is not "I"'],
                        ['One page maximum',          '250–350 words. Recruiters spend <1 minute on cover letters.'],
                        ['Mirror job description keywords', 'Paste the JD into the context field. AI will match language for ATS.'],
                        ['Specific company research',  'The "why this company" field is critical — generic letters get ignored.'],
                        ['Match the tone to the culture','Use Creative for startups, Professional for corporates, Confident for sales roles.'],
                      ].map(([t,d])=>(
                        <div key={t} style={{display:'flex',gap:9,marginBottom:10}}>
                          <span style={{color:'var(--acc)',flexShrink:0,fontFamily:"'Fira Code',monospace",fontSize:11,marginTop:1}}>›</span>
                          <div>
                            <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12.5,fontWeight:600,color:'var(--tx)'}}>{t} — </span>
                            <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12.5,color:'var(--tx2)'}}>{d}</span>
                          </div>
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