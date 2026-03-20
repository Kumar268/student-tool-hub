import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   RECOMMENDATION LETTER TEMPLATE — Document Tools Series #13
   Theme: Dark Deep Plum / Electric Teal  ·  Light Ivory / Forest
   Fonts: Lora · Plus Jakarta Sans · Fira Code
   Aesthetic: Authoritative institutional letterhead — seal, gravitas
   Recommender types: Professor · Employer · Mentor · Colleague · Coach
   Purpose types: Graduate School · Job · Scholarship · PhD · Professional Award · Visa
   Tones: Enthusiastic · Formal · Warm · Distinguished · Measured
   AI: Full letter + 5 rewrites + strength phrase generator
   Features: Letterhead preview · Relationship context fields · Print/PDF
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fira+Code:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Plus Jakarta Sans',sans-serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes teal-glow{0%,100%{box-shadow:0 0 0 0 rgba(45,212,191,.18)}50%{box-shadow:0 0 0 8px rgba(45,212,191,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(600%)}}
@keyframes rise{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}

.dk{
  --bg:#04060a;--s1:#070a10;--s2:#0b0f18;--s3:#101520;
  --bdr:#141c2e;--bdr-hi:rgba(45,212,191,.26);
  --acc:#2dd4bf;--acc2:#14b8a6;--acc3:#a78bfa;--acc4:#fb923c;
  --tx:#e0f7f4;--tx2:#2a8a80;--tx3:#141c2e;--txm:#1e3a38;
  --err:#fca5a5;--succ:#6ee7b7;--warn:#fde68a;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 70% 40% at 50% -8%,rgba(45,212,191,.06),transparent),
    radial-gradient(ellipse 40% 50% at 92% 82%,rgba(167,139,250,.04),transparent),
    radial-gradient(ellipse 35% 45% at 8% 55%,rgba(251,146,60,.02),transparent);
}
.lt{
  --bg:#f8faf8;--s1:#ffffff;--s2:#eef7f4;--s3:#daf0ea;
  --bdr:#b8ddd6;--bdr-hi:#0f4a44;
  --acc:#0f4a44;--acc2:#155e56;--acc3:#5b21b6;--acc4:#c2410c;
  --tx:#061210;--tx2:#0f4a44;--tx3:#b8ddd6;--txm:#3a6a64;
  --err:#991b1b;--succ:#065f46;--warn:#92400e;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(15,74,68,.05),transparent);
}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(4,6,10,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(248,250,248,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(15,74,68,.07);}

.scanline{position:fixed;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(45,212,191,.35),transparent);
  animation:scan 5s linear infinite;pointer-events:none;z-index:999;}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 15px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;
  font-weight:600;letter-spacing:.04em;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--txm);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(45,212,191,.04);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#94a3b8;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(15,74,68,.04);font-weight:700;}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns:232px 1fr;min-height:calc(100vh - 86px);}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:14px 18px;display:flex;flex-direction:column;gap:14px;overflow-x:hidden;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:3px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(15,74,68,.05);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 22px;cursor:pointer;
  font-family:'Plus Jakarta Sans',sans-serif;font-size:12px;font-weight:700;letter-spacing:.03em;transition:all .16s;border:none;}
.dk .btn{background:var(--acc);color:#04060a;border-radius:3px;animation:teal-glow 2.8s infinite;}
.dk .btn:hover{background:#5eead4;transform:translateY(-1px);animation:none;box-shadow:0 0 28px rgba(45,212,191,.5);}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;animation:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:9px;box-shadow:0 4px 14px rgba(15,74,68,.3);}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;}

.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;
  font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:600;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(45,212,191,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(15,74,68,.05);}

.fi{width:100%;outline:none;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;resize:vertical;}
.dk .fi{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(45,212,191,.1);}
.lt .fi{background:#f5fcfa;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(15,74,68,.08);}
.fi::placeholder{opacity:.27;}

.letter-area{font-family:'Lora',serif;font-size:14px;line-height:1.9;
  padding:22px 24px;white-space:pre-wrap;word-break:break-word;min-height:120px;}
.dk .letter-area{color:#e0f7f4;background:rgba(0,0,0,.5);border:1px solid rgba(45,212,191,.1);border-radius:3px;}
.lt .letter-area{color:#061210;background:#fafffe;border:1.5px solid rgba(15,74,68,.12);border-radius:10px;}
.cur{display:inline-block;width:7px;height:14px;background:var(--acc);animation:blink .7s infinite;vertical-align:text-bottom;margin-left:1px;}

.lbl{font-family:'Plus Jakarta Sans',sans-serif;font-size:9px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(45,212,191,.38);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(45,212,191,.25);}
.lt .slbl{color:var(--acc);}

.chip{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;cursor:pointer;
  font-family:'Plus Jakarta Sans',sans-serif;font-size:10px;font-weight:600;transition:all .13s;border:none;white-space:nowrap;}
.dk .chip{background:rgba(45,212,191,.07);border:1px solid rgba(45,212,191,.18);border-radius:2px;color:var(--acc);}
.dk .chip:hover{background:rgba(45,212,191,.14);border-color:var(--acc);}
.dk .chip:disabled{opacity:.35;cursor:not-allowed;}
.lt .chip{background:rgba(15,74,68,.05);border:1.5px solid rgba(15,74,68,.2);border-radius:8px;color:var(--acc);}
.lt .chip:hover{background:rgba(15,74,68,.1);}
.lt .chip:disabled{opacity:.35;cursor:not-allowed;}

.strength-pill{display:inline-block;padding:4px 10px;cursor:pointer;margin:3px;
  font-family:'Lora',serif;font-size:12px;font-style:italic;transition:all .13s;border:none;}
.dk .strength-pill{background:rgba(45,212,191,.07);border:1px solid rgba(45,212,191,.15);border-radius:2px;color:var(--acc3);}
.dk .strength-pill:hover{background:rgba(45,212,191,.14);transform:scale(1.02);}
.lt .strength-pill{background:rgba(15,74,68,.05);border:1.5px solid rgba(15,74,68,.15);border-radius:8px;color:var(--acc3);}
.lt .strength-pill:hover{background:rgba(15,74,68,.1);transform:scale(1.02);}

.prog{height:3px;border-radius:2px;overflow:hidden;}
.dk .prog{background:rgba(45,212,191,.1);}
.lt .prog{background:rgba(15,74,68,.08);}
.prog-bar{height:100%;border-radius:2px;transition:width .4s;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(45,212,191,.01);border:1px dashed rgba(45,212,191,.09);border-radius:3px;}
.lt .ad{background:rgba(15,74,68,.015);border:1.5px dashed rgba(15,74,68,.1);border-radius:9px;}
.ad span{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

/* LETTERHEAD PREVIEW */
.letterhead{background:white;color:#111;font-family:'Lora',serif;padding:40px 56px 48px;
  max-width:720px;margin:0 auto;box-shadow:0 8px 48px rgba(0,0,0,.3);}
.lh-top{display:flex;justify-content:space-between;align-items:flex-start;
  border-bottom:2.5px solid #0f4a44;padding-bottom:14px;margin-bottom:22px;}
.lh-name{font-family:'Plus Jakarta Sans',sans-serif;font-weight:800;font-size:18px;color:#0f4a44;margin-bottom:3px;}
.lh-meta{font-family:'Plus Jakarta Sans',sans-serif;font-size:11px;color:#555;line-height:1.7;}
.lh-seal{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,#0f4a44,#2dd4bf);color:white;font-size:20px;flex-shrink:0;}
.lh-body{font-size:13.5px;line-height:1.88;color:#111;white-space:pre-wrap;}
.lh-sig{margin-top:28px;font-family:'Plus Jakarta Sans',sans-serif;}
.lh-sig-name{font-size:14px;font-weight:700;color:#0f4a44;margin-bottom:2px;}
.lh-sig-title{font-size:11px;color:#666;line-height:1.6;}
`;

/* ══ DATA ══ */
const RECOMMENDER_TYPES = [
  {id:'professor',  emoji:'👨‍🏫', label:'Professor / Academic'},
  {id:'employer',   emoji:'💼',  label:'Employer / Manager'},
  {id:'mentor',     emoji:'🌟',  label:'Mentor / Advisor'},
  {id:'colleague',  emoji:'🤝',  label:'Senior Colleague'},
  {id:'coach',      emoji:'🏅',  label:'Coach / Supervisor'},
];

const PURPOSE_TYPES = [
  {id:'grad_school',  emoji:'🎓', label:'Graduate School'},
  {id:'job',          emoji:'💼', label:'Job Application'},
  {id:'scholarship',  emoji:'🏆', label:'Scholarship'},
  {id:'phd',          emoji:'🔬', label:'PhD Programme'},
  {id:'award',        emoji:'🌟', label:'Professional Award'},
  {id:'visa',         emoji:'🌍', label:'Visa / Immigration'},
];

const TONES = [
  {id:'enthusiastic', label:'Enthusiastic'},
  {id:'formal',       label:'Formal'},
  {id:'warm',         label:'Warm'},
  {id:'distinguished',label:'Distinguished'},
  {id:'measured',     label:'Measured'},
];

const SIGN_OFFS = [
  'Yours sincerely,',
  'With highest regard,',
  'Most sincerely yours,',
  'Respectfully yours,',
  'With warm regards,',
];

const TABS = [
  {id:'setup',    label:'⚙ Setup'},
  {id:'generate', label:'✦ Generate'},
  {id:'edit',     label:'✎ Edit Letter'},
  {id:'preview',  label:'◉ Preview'},
  {id:'tips',     label:'? Tips'},
];

const EMPTY_DATA = {
  /* Recommender */
  recName:'', recTitle:'', recDept:'', recInstitution:'', recEmail:'', recPhone:'',
  /* Candidate */
  candName:'', candRole:'', relationship:'', knownYears:'', knownMonths:'',
  /* Context */
  purpose:'grad_school', recommenderType:'professor', tone:'enthusiastic', signOff:'Yours sincerely,',
  /* Candidate qualities */
  strengths:'', achievements:'', standoutMoment:'', comparativeRanking:'', weaknesses:'',
  /* Target */
  targetOrg:'', targetRole:'', targetProgram:'',
};

export default function RecommendationLetter() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';

  const [tab,      setTab]     = useState('setup');
  const [data,     setData]    = useState({...EMPTY_DATA});
  const [letter,   setLetter]  = useState('');
  const [loading,  setLoading] = useState(false);
  const [loadMode, setLoadMode]= useState('');
  const [err,      setErr]     = useState('');
  const [copied,   setCopied]  = useState('');
  const [phrases,  setPhrases] = useState([]);
  const [phrasesLoading, setPhrasesLoading] = useState(false);

  const set = (k,v) => setData(p=>({...p,[k]:v}));

  const words = letter.trim().split(/\s+/).filter(Boolean).length;
  const wPct  = Math.min(100, Math.round((words / 450) * 100));
  const wColor = words < 200 ? 'var(--warn)' : words > 550 ? 'var(--warn)' : 'var(--succ)';

  const pt  = PURPOSE_TYPES.find(p=>p.id===data.purpose);
  const rt  = RECOMMENDER_TYPES.find(r=>r.id===data.recommenderType);
  const tn  = TONES.find(t=>t.id===data.tone);

  const setupFilled = [data.recName, data.candName, data.relationship].filter(Boolean).length;
  const pct = Math.round((setupFilled/3)*100);

  /* ── CONTEXT STRING ── */
  const ctx = () => `
Recommender: ${data.recName||'[Recommender Name]'}, ${data.recTitle||'[Title]'}${data.recDept?', '+data.recDept:''}${data.recInstitution?', '+data.recInstitution:''}
Candidate: ${data.candName||'[Candidate Name]'}${data.candRole?', '+data.candRole:''}
Relationship: ${data.relationship||'not specified'}
Known for: ${[data.knownYears&&data.knownYears+' years',data.knownMonths&&data.knownMonths+' months'].filter(Boolean).join(' ')||'not specified'}
Purpose: ${pt?.label||'Graduate School'}
Recommender type: ${rt?.label||'Professor'}
Tone: ${data.tone}
Strengths: ${data.strengths||'not provided'}
Key achievements: ${data.achievements||'not provided'}
Standout moment: ${data.standoutMoment||'not provided'}
Comparative ranking: ${data.comparativeRanking||'not provided'}
Target: ${[data.targetOrg,data.targetRole||data.targetProgram].filter(Boolean).join(' — ')||'not specified'}`.trim();

  /* ── PROMPTS ── */
  const buildPrompt = (mode) => {
    if(mode==='generate') return `Write a compelling letter of recommendation.

${ctx()}

Requirements:
- 350–450 words, 3–4 paragraphs
- Opening: Recommender introduces themselves and states relationship to candidate. How long and in what capacity they've known them.
- Para 2: Specific achievements, skills, concrete examples — not vague praise
- Para 3: Personal qualities, character, standout moment or story that illustrates who this person is
- Para 4: Strong endorsement, why this candidate is exceptional, recommendation for ${pt?.label||'this opportunity'}
- Closing: ${data.signOff} [Name]
- Tone: ${data.tone} — authoritative, genuine, specific
- DO NOT use vague filler: "is a pleasure to recommend", "hardworking", "team player" — be specific
- Write only the letter text, starting with the salutation`;

    const rewrites = {
      stronger:   `Rewrite the opening paragraph of this recommendation letter to establish the recommender's authority and relationship more powerfully.\n\nOriginal:\n${letter}\n\nContext:\n${ctx()}`,
      specific:   `Rewrite this recommendation letter to include more specific, concrete examples and achievements. Replace all vague praise with evidence.\n\nOriginal:\n${letter}`,
      concise:    `Rewrite this recommendation letter to be more concise — approximately 320 words — without losing key points.\n\nOriginal:\n${letter}`,
      enthusiastic:`Rewrite this recommendation letter to sound more genuinely enthusiastic and emphatic. This person is exceptional. Make that clear.\n\nOriginal:\n${letter}`,
      formal:     `Rewrite this recommendation letter in a more formal, distinguished academic register appropriate for a ${pt?.label} application.\n\nOriginal:\n${letter}`,
    };
    return rewrites[mode];
  };

  /* ── STREAM ── */
  const stream = async (mode) => {
    setLoading(true); setLoadMode(mode); setErr('');
    if(mode==='generate') setLetter('');

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:900, stream:true,
          messages:[{role:'user', content:buildPrompt(mode)}]}),
      });
      if(!res.ok){setErr('API error');setLoading(false);return;}
      const reader=res.body.getReader(); const dec=new TextDecoder(); let buf='';

      if(mode==='generate'){
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

  /* ── STRENGTH PHRASES ── */
  const genPhrases = async () => {
    setPhrasesLoading(true); setPhrases([]);
    const prompt = `Generate 12 strong, specific recommendation letter phrases for a ${rt?.label} recommending someone for ${pt?.label}.
Candidate strengths: ${data.strengths||'exceptional academic performance, leadership, problem-solving'}
Tone: ${data.tone}

Return exactly 12 short phrases (10–18 words each) that could be used in a letter of recommendation.
Each on a new line. No numbers, no bullets. Just the phrases. Make them varied — intellectual ability, character, leadership, specific skills, comparative statements.`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:500, stream:true,
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
      setPhrases(out.split('\n').map(l=>l.trim()).filter(l=>l.length>10).slice(0,12));
    } catch(e){console.error(e);}
    finally{setPhrasesLoading(false);}
  };

  /* ── PRINT ── */
  const print = () => {
    if(!letter.trim()) return;
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Letter of Recommendation</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @media print{@page{margin:.75in}}
        body{font-family:'Plus Jakarta Sans',sans-serif;background:white;color:#111;padding:40px 56px;max-width:720px;margin:0 auto;}
        .top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2.5px solid #0f4a44;padding-bottom:14px;margin-bottom:22px;}
        .rec-name{font-size:18px;font-weight:800;color:#0f4a44;margin-bottom:3px;}
        .rec-meta{font-size:11px;color:#555;line-height:1.7;}
        .seal{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#0f4a44,#2dd4bf);
          color:white;font-size:22px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .body{font-family:'Lora',serif;font-size:13.5px;line-height:1.88;color:#111;white-space:pre-wrap;margin-top:0;}
        .sig{margin-top:28px;}
        .sig-name{font-size:14px;font-weight:700;color:#0f4a44;margin-bottom:2px;}
        .sig-meta{font-size:11px;color:#666;line-height:1.6;}
      </style></head>
      <body>
        <div class="top">
          <div>
            ${data.recName?`<div class="rec-name">${data.recName}</div>`:''}
            <div class="rec-meta">
              ${[data.recTitle,data.recDept,data.recInstitution].filter(Boolean).join(' · ')}<br>
              ${[data.recEmail,data.recPhone].filter(Boolean).join(' · ')}
            </div>
          </div>
          <div class="seal">✉</div>
        </div>
        <div class="body">${letter.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
        <div class="sig">
          ${data.recName?`<div class="sig-name">${data.recName}</div>`:''}
          <div class="sig-meta">
            ${[data.recTitle,data.recDept].filter(Boolean).join(', ')}<br>
            ${data.recInstitution||''}
          </div>
        </div>
        <script>window.onload=()=>window.print()<\/script>
      </body></html>`;
    const w=window.open('','_blank'); w.document.write(html); w.document.close();
  };

  const copy = (text,id) => {
    try{navigator.clipboard.writeText(text);}catch{}
    setCopied(id); setTimeout(()=>setCopied(''),1800);
  };

  /* ══════════════════════════════════════════════════════════ */
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
              border:dark?'1px solid rgba(45,212,191,.3)':'none',
              background:dark?'rgba(45,212,191,.08)':'linear-gradient(135deg,#0f4a44,#155e56)',
              boxShadow:dark?'0 0 16px rgba(45,212,191,.2)':'0 3px 10px rgba(15,74,68,.32)',
            }}>✉️</div>
            <div>
              <div style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:18,color:'var(--tx)',lineHeight:1}}>
                Recommendation <span style={{color:'var(--acc)'}}>Letter</span>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginLeft:7,fontWeight:400}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Doc Tools #13 · 5 recommender types · 6 purposes · AI write + phrases
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          {letter&&<div style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:wColor,
            border:dark?'1px solid rgba(45,212,191,.15)':'1.5px solid var(--bdr)',
            padding:'3px 10px',borderRadius:dark?2:7}}>
            {words} words
          </div>}
          <button onClick={()=>setDark(d=>!d)} style={{
            display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(45,212,191,.2)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer',
          }}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#b8ddd6',
              boxShadow:dark?'0 0 8px rgba(45,212,191,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#04060a':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)'}}>{dark?'VOID':'LITE'}</span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
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
            

            {/* Recommender type */}
            <div>
              <div className="slbl">Recommender type</div>
              {RECOMMENDER_TYPES.map(r=>(
                <button key={r.id} onClick={()=>set('recommenderType',r.id)} style={{
                  width:'100%',display:'flex',alignItems:'center',gap:7,
                  padding:'6px 8px',marginBottom:3,cursor:'pointer',
                  border:data.recommenderType===r.id?'1px solid var(--acc)':(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                  borderRadius:dark?3:7,
                  background:data.recommenderType===r.id?(dark?'rgba(45,212,191,.06)':'rgba(15,74,68,.04)'):'transparent',
                }}>
                  <span style={{fontSize:13}}>{r.emoji}</span>
                  <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11.5,fontWeight:600,
                    color:data.recommenderType===r.id?'var(--acc)':'var(--tx)'}}>{r.label}</span>
                </button>
              ))}
            </div>

            {/* Purpose */}
            <div>
              <div className="slbl">Letter purpose</div>
              {PURPOSE_TYPES.map(p=>(
                <button key={p.id} onClick={()=>set('purpose',p.id)} style={{
                  width:'100%',display:'flex',alignItems:'center',gap:7,
                  padding:'5px 8px',marginBottom:3,cursor:'pointer',
                  border:data.purpose===p.id?'1px solid var(--acc)':(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                  borderRadius:dark?3:7,
                  background:data.purpose===p.id?(dark?'rgba(45,212,191,.06)':'rgba(15,74,68,.04)'):'transparent',
                }}>
                  <span style={{fontSize:12}}>{p.emoji}</span>
                  <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,fontWeight:600,
                    color:data.purpose===p.id?'var(--acc)':'var(--tx)'}}>{p.label}</span>
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

            {/* Sign-off */}
            <div>
              <div className="slbl">Sign-off</div>
              {SIGN_OFFS.map(s=>(
                <button key={s} onClick={()=>set('signOff',s)} style={{
                  width:'100%',padding:'5px 8px',marginBottom:3,cursor:'pointer',
                  border:data.signOff===s?'1px solid var(--acc)':(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                  borderRadius:dark?2:6,textAlign:'left',
                  fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:10,
                  color:data.signOff===s?'var(--acc)':'var(--txm)',
                  background:data.signOff===s?(dark?'rgba(45,212,191,.05)':'rgba(15,74,68,.04)'):'transparent',
                }}>{s}</button>
              ))}
            </div>

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
                  {copied==='side'?'✓ Copied':'⎘ Copy letter'}
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
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>
                      {rt?.emoji} Recommender Details
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      <div>
                        <label className="lbl">Recommender Full Name *</label>
                        <input className="fi" placeholder="Prof. Sarah Williams / Dr. James Chen"
                          value={data.recName} onChange={e=>set('recName',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Title / Position</label>
                        <input className="fi" placeholder="Associate Professor · Senior Director"
                          value={data.recTitle} onChange={e=>set('recTitle',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Department / Division</label>
                        <input className="fi" placeholder="Dept. of Computer Science"
                          value={data.recDept} onChange={e=>set('recDept',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Institution / Company</label>
                        <input className="fi" placeholder="MIT · Google DeepMind"
                          value={data.recInstitution} onChange={e=>set('recInstitution',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Email</label>
                        <input className="fi" placeholder="s.williams@mit.edu"
                          value={data.recEmail} onChange={e=>set('recEmail',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Phone (optional)</label>
                        <input className="fi" placeholder="+1 617 000 1234"
                          value={data.recPhone} onChange={e=>set('recPhone',e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Candidate Details</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      <div>
                        <label className="lbl">Candidate Full Name *</label>
                        <input className="fi" placeholder="Jane Elizabeth Smith"
                          value={data.candName} onChange={e=>set('candName',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Candidate Role / Year</label>
                        <input className="fi" placeholder="PhD student · Research Assistant · Intern"
                          value={data.candRole} onChange={e=>set('candRole',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Relationship / How you know them *</label>
                        <input className="fi" placeholder="Supervised her thesis · Managed for 2 years · Taught in 3 courses"
                          value={data.relationship} onChange={e=>set('relationship',e.target.value)}/>
                      </div>
                      <div style={{display:'flex',gap:8}}>
                        <div style={{flex:1}}>
                          <label className="lbl">Years known</label>
                          <input className="fi" placeholder="3" value={data.knownYears} onChange={e=>set('knownYears',e.target.value)}/>
                        </div>
                        <div style={{flex:1}}>
                          <label className="lbl">Months</label>
                          <input className="fi" placeholder="6" value={data.knownMonths} onChange={e=>set('knownMonths',e.target.value)}/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>What to Highlight (AI uses these)</div>
                    <div style={{display:'flex',flexDirection:'column',gap:9}}>
                      <div>
                        <label className="lbl">Candidate's key strengths</label>
                        <textarea className="fi" rows={2}
                          placeholder="Exceptional analytical thinking, creative problem-solving, ability to communicate complex ideas clearly, extraordinary work ethic"
                          value={data.strengths} onChange={e=>set('strengths',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Specific achievements to mention</label>
                        <textarea className="fi" rows={3}
                          placeholder="Led project that saved $2M · Published 2 first-author papers · Created a new training protocol adopted lab-wide · Highest grade in cohort of 80"
                          value={data.achievements} onChange={e=>set('achievements',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Standout moment or specific story</label>
                        <textarea className="fi" rows={2}
                          placeholder="When the experiment failed at 2am before the deadline, she stayed and redesigned the methodology on the spot — the result was better than the original"
                          value={data.standoutMoment} onChange={e=>set('standoutMoment',e.target.value)}/>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                        <div>
                          <label className="lbl">Comparative ranking (optional but powerful)</label>
                          <input className="fi" placeholder="Top 2% of 200 students I've taught · Best analyst I've managed in 15 years"
                            value={data.comparativeRanking} onChange={e=>set('comparativeRanking',e.target.value)}/>
                        </div>
                        <div>
                          <label className="lbl">Target organisation / program</label>
                          <input className="fi" placeholder="Stanford PhD · McKinsey · Rhodes Scholarship"
                            value={[data.targetOrg,data.targetProgram].filter(Boolean).join(' / ')}
                            onChange={e=>{ set('targetOrg',e.target.value); set('targetProgram',''); }}/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="btn" onClick={()=>setTab('generate')} style={{alignSelf:'flex-start'}}>
                    NEXT: GENERATE →
                  </button>

                  
                </motion.div>
              )}

              {/* ╔══ GENERATE ══╗ */}
              {tab==='generate'&&(
                <motion.div key="generate" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12,maxWidth:820}}>

                  {/* Summary chips */}
                  <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
                    {[
                      {l:'From',  v:data.recName||'—'},
                      {l:'For',   v:data.candName||'—'},
                      {l:'Type',  v:rt?.label},
                      {l:'Purpose',v:pt?.label},
                      {l:'Tone',  v:tn?.label},
                    ].map(({l,v})=>(
                      <div key={l} style={{padding:'4px 10px',
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        borderRadius:dark?2:7,display:'flex',gap:5,alignItems:'center'}}>
                        <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.1em'}}>{l}:</span>
                        <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,fontWeight:700,color:'var(--acc)'}}>{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* Main generate button */}
                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:8}}>✦ Generate Recommendation Letter</div>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:9.5,color:'var(--txm)',marginBottom:14,lineHeight:1.7}}>
                      Writes a 350–450 word {tn?.label.toLowerCase()} letter from {data.recName||'the recommender'} recommending {data.candName||'the candidate'} for {pt?.label}.
                      {!data.candName&&<span style={{color:'var(--warn)'}}> Add candidate name in Setup for a personalised letter.</span>}
                    </div>
                    <button className="btn" onClick={()=>stream('generate')} disabled={loading}
                      style={{width:'100%',padding:'13px',fontSize:13}}>
                      {loading&&loadMode==='generate'
                        ? <><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;Writing letter…</>
                        : '✦ GENERATE RECOMMENDATION LETTER'}
                    </button>
                  </div>

                  {/* Strength phrases */}
                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:8}}>✦ Strength Phrase Bank</div>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:9.5,color:'var(--txm)',marginBottom:11,lineHeight:1.7}}>
                      Generate 12 powerful recommendation phrases tailored to this context. Click any phrase to copy it.
                    </div>
                    <button className="gbtn on" onClick={genPhrases} disabled={phrasesLoading||loading}
                      style={{marginBottom:phrases.length?10:0}}>
                      {phrasesLoading?<><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;Generating…</>:'✦ Generate phrase bank'}
                    </button>
                    {phrases.length>0&&(
                      <div style={{marginTop:8}}>
                        {phrases.map((ph,i)=>(
                          <motion.button key={i} className="strength-pill"
                            initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}}
                            transition={{delay:i*0.04}}
                            onClick={()=>copy(ph,`ph${i}`)}
                            title="Click to copy"
                            style={{...(copied===`ph${i}`?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                            {copied===`ph${i}`?'✓ '+ph:'"'+ph+'"'}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Rewrites */}
                  {letter&&(
                    <div className="panel" style={{padding:'15px 17px'}}>
                      <div className="lbl" style={{marginBottom:10}}>Rewrite Tools</div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                        {[
                          {mode:'stronger',    label:'⚡ Stronger opening'},
                          {mode:'specific',    label:'📌 More specific'},
                          {mode:'concise',     label:'✂ Make concise'},
                          {mode:'enthusiastic',label:'🌟 More enthusiastic'},
                          {mode:'formal',      label:'🎓 More formal'},
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
                    fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:'var(--err)'}}>⚠ {err}</div>}

                  {(letter||(loading&&loadMode==='generate'))&&(
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                        <label className="lbl">Generated letter</label>
                        {letter&&<button className="gbtn" onClick={()=>copy(letter,'gen')} style={{
                          ...(copied==='gen'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                          {copied==='gen'?'✓ Copied':'⎘ Copy'}
                        </button>}
                      </div>
                      <div className="letter-area">
                        {letter}
                        {loading&&loadMode==='generate'&&<span className="cur"/>}
                      </div>
                      {letter&&(
                        <div style={{marginTop:6}}>
                          <div style={{display:'flex',justifyContent:'space-between',
                            fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)',marginBottom:3}}>
                            <span>Word count</span>
                            <span style={{color:wColor}}>{words} / 350–450 ideal</span>
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
                    fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--txm)'}}>
                    Generate a letter first on the ✦ Generate tab
                  </div>}

                  {letter&&<>
                    <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,alignItems:'center'}}>
                      <label className="lbl" style={{margin:0}}>Edit letter freely</label>
                      <div style={{display:'flex',gap:7,alignItems:'center',flexWrap:'wrap'}}>
                        <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:wColor}}>{words} words</span>
                        <button className="gbtn" onClick={()=>copy(letter,'edit')} style={{
                          ...(copied==='edit'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                          {copied==='edit'?'✓ Copied':'⎘ Copy'}
                        </button>
                        <button className="gbtn" onClick={print}>🖨 Print</button>
                      </div>
                    </div>
                    <textarea className="fi letter-area" rows={24}
                      value={letter} onChange={e=>setLetter(e.target.value)}
                      style={{fontFamily:"'Lora',serif",fontSize:14,lineHeight:1.9,padding:'20px 22px'}}/>
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',
                        fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)',marginBottom:3}}>
                        <span>Word count</span>
                        <span style={{color:wColor}}>{words} / 350–450 ideal</span>
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
                    fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--txm)'}}>Generate a letter first</div>}

                  {letter&&<>
                    <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
                      <button className="btn" onClick={print}>🖨 Print / Save PDF</button>
                      <button className="gbtn" onClick={()=>copy(letter,'prev')} style={{
                        ...(copied==='prev'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                        {copied==='prev'?'✓ Copied':'⎘ Copy'}
                      </button>
                    </div>
                    <div style={{background:dark?'#181818':'#b0bec5',borderRadius:dark?3:10,padding:24,overflow:'auto'}}>
                      <div className="letterhead">
                        <div className="lh-top">
                          <div>
                            {data.recName&&<div className="lh-name">{data.recName}</div>}
                            <div className="lh-meta">
                              {[data.recTitle,data.recDept,data.recInstitution].filter(Boolean).join(' · ')}
                              {(data.recEmail||data.recPhone)&&<><br/>{[data.recEmail,data.recPhone].filter(Boolean).join(' · ')}</>}
                            </div>
                          </div>
                          <div className="lh-seal">✉</div>
                        </div>
                        <div className="lh-body">{letter}</div>
                        {data.recName&&(
                          <div className="lh-sig">
                            <div className="lh-sig-name">{data.recName}</div>
                            <div className="lh-sig-title">
                              {[data.recTitle,data.recDept].filter(Boolean).join(', ')}<br/>
                              {data.recInstitution}
                            </div>
                          </div>
                        )}
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
                    <div style={{fontFamily:"'Lora',serif",fontSize:22,fontWeight:700,color:'var(--tx)',marginBottom:4}}>
                      Writing a Strong Recommendation
                    </div>
                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:18}}>
                      for recommenders · what committees actually look for
                    </div>
                    {[
                      {t:'Establish your credibility immediately',
                       b:'Within the first paragraph, clearly state who you are, your position, and specifically how you know the candidate. "I supervised Jane\'s master\'s thesis and taught her in two advanced courses" carries far more weight than "I have known Jane for two years."'},
                      {t:'Use a comparative statement',
                       b:'"Top 3% of over 200 students I have taught in 15 years" is one of the most powerful things a recommender can write. If it is true, say it. Committees know what it means and it immediately elevates the application.'},
                      {t:'One vivid story beats ten adjectives',
                       b:'Do not call the candidate "hardworking, innovative, and driven." Instead tell the story of the 2am experiment that failed — and how she redesigned the methodology on the spot. Concrete stories stick; adjectives are forgotten.'},
                      {t:'Address the specific opportunity',
                       b:'A generic letter signals a generic relationship. Explain why this candidate is specifically suited to this program or role. Mention the programme by name. Explain the fit.'},
                      {t:'Acknowledge and reframe limitations',
                       b:'If there is a weakness, address it briefly and then pivot: "While her first-year grades did not fully reflect her ability, the upward trajectory in years two and three — culminating in first-class honours — demonstrates exactly the kind of resilience you want in a doctoral student."'},
                      {t:'End with an unambiguous endorsement',
                       b:'Your final paragraph should leave no doubt. "I recommend Jane without reservation" or "she is among the top three students I have supervised in twenty years" — be explicit. Vague closings undo strong letters.'},
                    ].map(({t,b})=>(
                      <div key={t} style={{marginBottom:10,padding:'11px 13px',borderRadius:dark?3:9,
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        background:dark?'rgba(0,0,0,.2)':'rgba(248,250,248,.8)'}}>
                        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12.5,fontWeight:700,color:'var(--acc)',marginBottom:5}}>✦ {t}</div>
                        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.72}}>{b}</div>
                      </div>
                    ))}
                    <div style={{fontFamily:"'Lora',serif",fontSize:17,fontWeight:600,color:'var(--tx)',margin:'14px 0 10px'}}>
                      Common mistakes
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      {[
                        {t:'Vague praise only',          b:'"She is a dedicated student with strong potential." This tells the committee nothing. Every word must be earned with evidence.'},
                        {t:'Form letter feel',            b:'Committees read hundreds. They know when a letter was written once and recycled. Personalise to the opportunity.'},
                        {t:'Undermining the candidate',  b:'Even subtle hedges — "could be more organised" — can derail an application. If you cannot write a strong letter, decline to write one at all.'},
                        {t:'Too short or too long',       b:'300–500 words is the sweet spot. Under 250 signals weak support. Over 600 suggests the recommender could not edit — a quality committees value.'},
                      ].map(({t,b})=>(
                        <div key={t} style={{padding:'10px 12px',borderRadius:dark?3:9,
                          border:dark?'1px solid rgba(252,165,165,.2)':'1.5px solid rgba(153,27,27,.15)',
                          background:dark?'rgba(252,165,165,.04)':'rgba(254,228,228,.4)'}}>
                          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,fontWeight:700,color:'var(--err)',marginBottom:4}}>✕ {t}</div>
                          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:'var(--tx2)',lineHeight:1.65}}>{b}</div>
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