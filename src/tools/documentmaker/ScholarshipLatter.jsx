import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   SCHOLARSHIP APPLICATION LETTER — Document Tools Series #11
   Theme: Dark Deep Space / Electric Sapphire  ·  Light Cloud / Royal Blue
   Fonts: Playfair Display · DM Sans · Source Code Pro
   Aesthetic: Prestigious award ceremony — deep blue, gold accents, gravitas
   Letter types: Merit · Need-based · Research · Sports · Arts · Community · International
   Tones: Formal · Confident · Humble · Inspiring · Professional
   AI: Full letter generation + 5 quick rewrites
   Features: Live preview · Word count · Print/PDF · Letter templates
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600;700&family=Source+Code+Pro:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'DM Sans',sans-serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes sapphire-glow{0%,100%{box-shadow:0 0 0 0 rgba(99,179,237,.18)}50%{box-shadow:0 0 0 8px rgba(99,179,237,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(600%)}}
@keyframes fadeup{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}

.dk{
  --bg:#02040e;--s1:#04071a;--s2:#070c22;--s3:#0c1230;
  --bdr:#0f1a3a;--bdr-hi:rgba(99,179,237,.28);
  --acc:#63b3ed;--acc2:#4299e1;--acc3:#f6e05e;--acc4:#9f7aea;
  --tx:#e8f0ff;--tx2:#4a7ab5;--tx3:#0f1a3a;--txm:#1e3060;
  --err:#fc8181;--succ:#68d391;--warn:#f6e05e;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -10%,rgba(99,179,237,.07),transparent),
    radial-gradient(ellipse 40% 60% at 90% 80%,rgba(159,122,234,.05),transparent),
    radial-gradient(ellipse 30% 40% at 10% 60%,rgba(246,224,94,.03),transparent);
}
.lt{
  --bg:#f5f8ff;--s1:#ffffff;--s2:#edf2ff;--s3:#dce8ff;
  --bdr:#c8d8f0;--bdr-hi:#1a3070;
  --acc:#1a3070;--acc2:#2a4090;--acc3:#b7791f;--acc4:#553c9a;
  --tx:#080c1e;--tx2:#1a3070;--tx3:#c8d8f0;--txm:#4a5a80;
  --err:#c53030;--succ:#276749;--warn:#b7791f;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(26,48,112,.06),transparent);
}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(2,4,14,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(245,248,255,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(26,48,112,.07);}

.scanline{position:fixed;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(99,179,237,.3),transparent);
  animation:scan 5s linear infinite;pointer-events:none;z-index:999;}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 15px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'DM Sans',sans-serif;font-size:11px;
  font-weight:600;letter-spacing:.04em;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--txm);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(99,179,237,.04);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#94a3b8;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(26,48,112,.04);font-weight:700;}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns:234px 1fr;min-height:calc(100vh - 86px);}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:14px 18px;display:flex;flex-direction:column;gap:14px;overflow-x:hidden;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:3px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(26,48,112,.05);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 22px;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;letter-spacing:.03em;transition:all .16s;border:none;}
.dk .btn{background:var(--acc);color:#02040e;border-radius:3px;animation:sapphire-glow 2.8s infinite;}
.dk .btn:hover{background:#90cdf4;transform:translateY(-1px);animation:none;box-shadow:0 0 28px rgba(99,179,237,.5);}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;animation:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:9px;box-shadow:0 4px 14px rgba(26,48,112,.3);}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;}

.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(99,179,237,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(26,48,112,.05);}

.fi{width:100%;outline:none;font-family:'DM Sans',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;resize:vertical;}
.dk .fi{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(99,179,237,.1);}
.lt .fi{background:#f8faff;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(26,48,112,.08);}
.fi::placeholder{opacity:.28;}

.lbl{font-family:'DM Sans',sans-serif;font-size:9px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(99,179,237,.38);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Source Code Pro',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(99,179,237,.25);}
.lt .slbl{color:var(--acc);}

.letter-box{font-family:'Playfair Display',serif;font-size:14px;line-height:1.9;
  padding:22px 24px;white-space:pre-wrap;word-break:break-word;min-height:120px;}
.dk .letter-box{color:#e8f0ff;background:rgba(0,0,0,.5);border:1px solid rgba(99,179,237,.1);border-radius:3px;}
.lt .letter-box{color:#080c1e;background:#f8faff;border:1.5px solid rgba(26,48,112,.12);border-radius:10px;}

.cur{display:inline-block;width:7px;height:14px;background:var(--acc);animation:blink .7s infinite;vertical-align:text-bottom;margin-left:1px;}

.ai-chip{display:inline-flex;align-items:center;gap:5px;padding:5px 12px;cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;transition:all .13s;border:none;white-space:nowrap;}
.dk .ai-chip{background:rgba(99,179,237,.07);border:1px solid rgba(99,179,237,.18);border-radius:2px;color:var(--acc);}
.dk .ai-chip:hover{background:rgba(99,179,237,.14);border-color:var(--acc);}
.dk .ai-chip:disabled{opacity:.35;cursor:not-allowed;}
.lt .ai-chip{background:rgba(26,48,112,.05);border:1.5px solid rgba(26,48,112,.18);border-radius:8px;color:var(--acc);}
.lt .ai-chip:hover{background:rgba(26,48,112,.1);}
.lt .ai-chip:disabled{opacity:.35;cursor:not-allowed;}

.prog{height:3px;border-radius:2px;overflow:hidden;}
.dk .prog{background:rgba(99,179,237,.1);}
.lt .prog{background:rgba(26,48,112,.08);}
.prog-bar{height:100%;border-radius:2px;transition:width .4s;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc4));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc4));}

.wc-bar{height:4px;border-radius:2px;overflow:hidden;margin-top:4px;}
.dk .wc-bar{background:rgba(99,179,237,.1);}
.lt .wc-bar{background:rgba(26,48,112,.08);}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(99,179,237,.01);border:1px dashed rgba(99,179,237,.09);border-radius:3px;}
.lt .ad{background:rgba(26,48,112,.015);border:1.5px dashed rgba(26,48,112,.1);border-radius:9px;}
.ad span{font-family:'Source Code Pro',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

/* SCORE PILL */
.pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;
  font-family:'Source Code Pro',monospace;font-size:9px;font-weight:500;}
.dk .pill{background:rgba(99,179,237,.08);border:1px solid rgba(99,179,237,.2);color:var(--acc);}
.lt .pill{background:rgba(26,48,112,.07);border:1.5px solid rgba(26,48,112,.2);color:var(--acc);}
`;

/* ═══════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const LETTER_TYPES = [
  {id:'merit',         emoji:'🏆', label:'Merit / Academic'},
  {id:'need',          emoji:'🤝', label:'Need-Based'},
  {id:'research',      emoji:'🔬', label:'Research'},
  {id:'sports',        emoji:'⚽', label:'Sports / Athletics'},
  {id:'arts',          emoji:'🎨', label:'Arts / Creative'},
  {id:'community',     emoji:'🌱', label:'Community Service'},
  {id:'international', emoji:'🌍', label:'International Study'},
];

const TONES = [
  {id:'formal',       label:'Formal'},
  {id:'confident',    label:'Confident'},
  {id:'humble',       label:'Humble'},
  {id:'inspiring',    label:'Inspiring'},
  {id:'professional', label:'Professional'},
];

const SIGN_OFFS = ['Yours sincerely,','Yours faithfully,','Respectfully yours,','With sincere regards,','Kind regards,'];

const TABS = [
  {id:'setup',    label:'⚙ Setup'},
  {id:'generate', label:'✦ Generate'},
  {id:'edit',     label:'✎ Edit Letter'},
  {id:'preview',  label:'◉ Preview'},
  {id:'tips',     label:'? Tips'},
];

const EMPTY = {
  applicantName:'', address:'', email:'', phone:'', date:'',
  scholarshipName:'', organization:'', contactPerson:'', amount:'',
  letterType:'merit', tone:'formal', signOff:'Yours sincerely,',
  gpa:'', achievements:'', financialNeed:'', careerGoal:'', whyDeserve:'',
  extraActivities:'', researchInterest:'', sport:'', artwork:'', communityWork:'',
};

/* ═════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function ScholarshipLetter() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';

  const [tab,     setTab]     = useState('setup');
  const [data,    setData]    = useState({...EMPTY, date: new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})});
  const [letter,  setLetter]  = useState('');
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState('');
  const [err,     setErr]     = useState('');
  const [copied,  setCopied]  = useState('');

  const set = (k,v) => setData(p=>({...p,[k]:v}));

  const words = letter.trim().split(/\s+/).filter(Boolean).length;
  const wPct  = Math.min(100, Math.round((words / 500) * 100));
  const wColor = words < 250 ? 'var(--warn)' : words > 550 ? 'var(--err)' : 'var(--succ)';

  const filled = [data.applicantName, data.scholarshipName, data.letterType].filter(Boolean).length;
  const setupPct = Math.round((filled/3)*100);

  /* ── PROMPT BUILDERS ── */
  const buildPrompt = (mode = 'generate') => {
    const lt = LETTER_TYPES.find(t=>t.id===data.letterType);
    const base = `
Applicant: ${data.applicantName||'[Name]'}
Scholarship: ${data.scholarshipName||'[Scholarship Name]'}
Organisation: ${data.organization||'[Organization]'}
Letter type: ${lt?.label||'Merit/Academic'}
Tone: ${data.tone}
GPA / Academic record: ${data.gpa||'not specified'}
Achievements: ${data.achievements||'not specified'}
Career goal: ${data.careerGoal||'not specified'}
Why deserves scholarship: ${data.whyDeserve||'not specified'}
Financial need: ${data.financialNeed||'not specified'}
Extra-curricular activities: ${data.extraActivities||'not specified'}
${data.researchInterest?'Research interest: '+data.researchInterest:''}
${data.sport?'Sport/Athletic achievement: '+data.sport:''}
${data.communityWork?'Community work: '+data.communityWork:''}
${data.artwork?'Arts/Creative work: '+data.artwork:''}`;

    if(mode==='generate') return `Write a compelling ${data.tone} scholarship application letter for the ${lt?.label} scholarship.

${base}

Requirements:
- 400–500 words (3–4 paragraphs + opening + closing)
- Opening: Address to ${data.contactPerson||'the Scholarship Committee'} with date if needed
- Para 1: Introduce applicant and state purpose
- Para 2: Academic/professional achievements and qualifications  
- Para 3: Why this specific scholarship, career goals, how it helps
- Para 4: What makes applicant unique / final compelling argument
- Closing: ${data.signOff} [Name]
- Tone: ${data.tone} — not robotic, genuinely personal
- Do NOT use generic filler phrases like "I am writing to express my interest"
- Write only the letter body, starting with the date or greeting`;

    const rewrites = {
      shorter:     `Rewrite this scholarship letter to be more concise (300–350 words). Keep the strongest points, cut repetition.\n\nOriginal:\n${letter}`,
      stronger:    `Rewrite the opening paragraph of this scholarship letter to be more powerful and immediately compelling. Replace any weak opener.\n\nOriginal:\n${letter}`,
      specific:    `Rewrite this letter adding more specific, concrete details and achievements (invent plausible specifics). Less vague, more evidence.\n\nOriginal:\n${letter}`,
      passionate:  `Rewrite this letter to sound more genuinely passionate and personal. Remove formal stiffness. First person, real voice.\n\nOriginal:\n${letter}`,
      ats:         `Rewrite this letter to be more ATS/keyword-friendly for a ${lt?.label} scholarship while keeping it human. Add relevant keywords.\n\nOriginal:\n${letter}`,
    };
    return rewrites[mode] || rewrites.shorter;
  };

  /* ── STREAM ── */
  const stream = async (mode='generate') => {
    setLoading(true); setErr('');
    const msgs = {
      generate: 'Writing your letter…',
      shorter:  'Making it more concise…',
      stronger: 'Strengthening the opening…',
      specific: 'Adding specific details…',
      passionate:'Making it more personal…',
      ats:      'Optimising for ATS…',
    };
    setLoadMsg(msgs[mode]||'Working…');
    if(mode==='generate') setLetter('');

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:1000, stream:true,
          messages:[{role:'user', content:buildPrompt(mode)}],
        }),
      });
      if(!res.ok){setErr('API error — check connection');setLoading(false);return;}
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
    finally{setLoading(false);setLoadMsg('');}
  };

  /* ── PRINT ── */
  const print = () => {
    if(!letter.trim()) return;
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Scholarship Letter</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @media print{@page{margin:.75in}}
        body{font-family:'DM Sans',sans-serif;color:#111;background:white;padding:56px 72px;max-width:720px;margin:0 auto;line-height:1.85}
        .header{margin-bottom:32px}
        .name{font-family:'Playfair Display',serif;font-size:18px;font-weight:600;color:#111;margin-bottom:4px}
        .contact{font-size:12px;color:#555;line-height:1.7}
        .body{font-family:'Playfair Display',serif;font-size:14px;line-height:1.9;white-space:pre-wrap;color:#111}
      </style></head>
      <body>
        <div class="header">
          ${data.applicantName?`<div class="name">${data.applicantName}</div>`:''}
          <div class="contact">
            ${[data.address,data.email,data.phone].filter(Boolean).join(' · ')}
          </div>
        </div>
        <div class="body">${letter.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
        <script>window.onload=()=>window.print()<\/script>
      </body></html>`;
    const w=window.open('','_blank'); w.document.write(html); w.document.close();
  };

  const copy = (text,id) => { try{navigator.clipboard.writeText(text);}catch{} setCopied(id); setTimeout(()=>setCopied(''),1800); };

  /* ═══════════════════════════════════════════════════════════ */
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
              border:dark?'1px solid rgba(99,179,237,.3)':'none',
              background:dark?'rgba(99,179,237,.08)':'linear-gradient(135deg,#1a3070,#2a4090)',
              boxShadow:dark?'0 0 16px rgba(99,179,237,.2)':'0 3px 10px rgba(26,48,112,.35)',
            }}>🏆</div>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:17,color:'var(--tx)',lineHeight:1}}>
                Scholarship <span style={{color:'var(--acc)'}}>Letter</span>
                <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:9,color:'var(--txm)',marginLeft:7,fontWeight:400}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Source Code Pro',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Doc Tools #11 · 7 letter types · 5 tones · AI generate + rewrite
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          {letter&&<span className="pill">
            <span style={{color:wColor}}>{words}</span> words
          </span>}
          <button onClick={()=>setDark(d=>!d)} style={{
            display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(99,179,237,.2)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer',
          }}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#c8d8f0',
              boxShadow:dark?'0 0 8px rgba(99,179,237,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#02040e':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:8.5,color:'var(--txm)'}}>{dark?'VOID':'LITE'}</span>
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
            

            {/* Letter type */}
            <div>
              <div className="slbl">Letter type</div>
              {LETTER_TYPES.map(lt=>(
                <button key={lt.id} onClick={()=>set('letterType',lt.id)} style={{
                  width:'100%',display:'flex',alignItems:'center',gap:7,
                  padding:'6px 8px',marginBottom:3,cursor:'pointer',
                  border:data.letterType===lt.id?'1px solid var(--acc)':(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                  borderRadius:dark?3:7,
                  background:data.letterType===lt.id?(dark?'rgba(99,179,237,.06)':'rgba(26,48,112,.04)'):'transparent',
                }}>
                  <span style={{fontSize:13}}>{lt.emoji}</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11.5,fontWeight:600,
                    color:data.letterType===lt.id?'var(--acc)':'var(--tx)'}}>{lt.label}</span>
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
                  fontFamily:"'DM Sans',sans-serif",fontSize:10.5,
                  color:data.signOff===s?'var(--acc)':'var(--txm)',
                  background:data.signOff===s?(dark?'rgba(99,179,237,.05)':'rgba(26,48,112,.04)'):'transparent',
                }}>{s}</button>
              ))}
            </div>

            {/* Exports */}
            {letter&&(
              <div>
                <div className="slbl">Export</div>
                <button className="gbtn" onClick={print}
                  style={{width:'100%',justifyContent:'flex-start',padding:'7px 9px',marginBottom:4}}>
                  🖨 Print / Save PDF
                </button>
                <button className="gbtn"
                  onClick={()=>copy(letter,'side')}
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
                  style={{display:'flex',flexDirection:'column',gap:12,maxWidth:800}}>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Your Details</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      <div>
                        <label className="lbl">Full Name *</label>
                        <input className="fi" placeholder="Jane Elizabeth Smith"
                          value={data.applicantName} onChange={e=>set('applicantName',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Date</label>
                        <input className="fi" value={data.date} onChange={e=>set('date',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Email</label>
                        <input className="fi" placeholder="jane@email.com" value={data.email} onChange={e=>set('email',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Phone</label>
                        <input className="fi" placeholder="+1 555 000 1234" value={data.phone} onChange={e=>set('phone',e.target.value)}/>
                      </div>
                      <div style={{gridColumn:'1 / -1'}}>
                        <label className="lbl">Address</label>
                        <input className="fi" placeholder="123 Main St, City, State, ZIP"
                          value={data.address} onChange={e=>set('address',e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Scholarship Details</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      <div style={{gridColumn:'1 / -1'}}>
                        <label className="lbl">Scholarship Name *</label>
                        <input className="fi" placeholder="The Rhodes Scholarship / Gates Cambridge Scholarship"
                          value={data.scholarshipName} onChange={e=>set('scholarshipName',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Awarding Organization</label>
                        <input className="fi" placeholder="University of Oxford" value={data.organization} onChange={e=>set('organization',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Contact Person / Committee</label>
                        <input className="fi" placeholder="Dr. Sarah Williams / Scholarship Committee"
                          value={data.contactPerson} onChange={e=>set('contactPerson',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Award Amount (optional)</label>
                        <input className="fi" placeholder="$20,000 / Full tuition" value={data.amount} onChange={e=>set('amount',e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Your Story (AI will use these to write your letter)</div>
                    <div style={{display:'flex',flexDirection:'column',gap:9}}>
                      <div>
                        <label className="lbl">GPA / Academic record</label>
                        <input className="fi" placeholder="3.9 GPA · Top 5% of class · Dean's List 3 years"
                          value={data.gpa} onChange={e=>set('gpa',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Key achievements & awards</label>
                        <textarea className="fi" rows={3}
                          placeholder="National science olympiad winner · Published research paper · Founded student organisation with 200+ members"
                          value={data.achievements} onChange={e=>set('achievements',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Career / study goal</label>
                        <textarea className="fi" rows={2}
                          placeholder="To become a climate scientist and develop carbon capture technologies to help developing nations"
                          value={data.careerGoal} onChange={e=>set('careerGoal',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Why you deserve this scholarship</label>
                        <textarea className="fi" rows={3}
                          placeholder="Describe what makes you stand out — your unique journey, obstacles overcome, impact you'll make"
                          value={data.whyDeserve} onChange={e=>set('whyDeserve',e.target.value)}/>
                      </div>
                      {(data.letterType==='need'||data.letterType==='international')&&(
                        <div>
                          <label className="lbl">Financial need (for need-based)</label>
                          <textarea className="fi" rows={2}
                            placeholder="First-generation university student · Single-parent household · Scholarship would remove financial barrier to studying abroad"
                            value={data.financialNeed} onChange={e=>set('financialNeed',e.target.value)}/>
                        </div>
                      )}
                      {data.letterType==='research'&&(
                        <div>
                          <label className="lbl">Research interest / topic</label>
                          <textarea className="fi" rows={2}
                            placeholder="CRISPR gene editing for rare disease treatment — working under Prof. Kim at MIT"
                            value={data.researchInterest} onChange={e=>set('researchInterest',e.target.value)}/>
                        </div>
                      )}
                      {data.letterType==='sports'&&(
                        <div>
                          <label className="lbl">Athletic achievements</label>
                          <textarea className="fi" rows={2}
                            placeholder="NCAA Division I swimmer · State champion 200m freestyle · Olympic trials qualifier"
                            value={data.sport} onChange={e=>set('sport',e.target.value)}/>
                        </div>
                      )}
                      {data.letterType==='arts'&&(
                        <div>
                          <label className="lbl">Arts / Creative work</label>
                          <textarea className="fi" rows={2}
                            placeholder="Exhibited at MoMA · Composed score for 3 independent films · 50k followers on music platform"
                            value={data.artwork} onChange={e=>set('artwork',e.target.value)}/>
                        </div>
                      )}
                      {data.letterType==='community'&&(
                        <div>
                          <label className="lbl">Community service / impact</label>
                          <textarea className="fi" rows={2}
                            placeholder="Founded tutoring programme helping 150 underserved students · 500+ volunteer hours · Built 3 wells in rural Kenya"
                            value={data.communityWork} onChange={e=>set('communityWork',e.target.value)}/>
                        </div>
                      )}
                      <div>
                        <label className="lbl">Extra-curricular activities</label>
                        <input className="fi" placeholder="Debate team captain · Chess club · Volunteer tutor · Student newspaper editor"
                          value={data.extraActivities} onChange={e=>set('extraActivities',e.target.value)}/>
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
                  style={{display:'flex',flexDirection:'column',gap:12,maxWidth:800}}>

                  {/* Summary chips */}
                  <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
                    {[
                      {l:'Type',  v:LETTER_TYPES.find(t=>t.id===data.letterType)?.label},
                      {l:'Tone',  v:TONES.find(t=>t.id===data.tone)?.label},
                      {l:'For',   v:data.scholarshipName||'—'},
                      {l:'By',    v:data.applicantName||'—'},
                    ].map(({l,v})=>(
                      <div key={l} style={{padding:'4px 10px',
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        borderRadius:dark?2:7,display:'flex',gap:5,alignItems:'center'}}>
                        <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.1em'}}>{l}:</span>
                        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:'var(--acc)'}}>{v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:8}}>✦ Generate Scholarship Letter</div>
                    <div style={{fontFamily:"'Source Code Pro',monospace",fontSize:9.5,color:'var(--txm)',marginBottom:14,lineHeight:1.7}}>
                      AI will write a 400–500 word {TONES.find(t=>t.id===data.tone)?.label.toLowerCase()} letter for the {LETTER_TYPES.find(t=>t.id===data.letterType)?.label} scholarship.
                      {!data.applicantName&&<span style={{color:'var(--warn)'}}> Add your name in Setup for a personalised letter.</span>}
                    </div>
                    <button className="btn" onClick={()=>stream('generate')} disabled={loading}
                      style={{width:'100%',padding:'13px',fontSize:13}}>
                      {loading
                        ? <><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;{loadMsg}</>
                        : '✦ GENERATE SCHOLARSHIP LETTER'}
                    </button>
                  </div>

                  {letter&&(
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:9}}>
                        <div className="lbl">Quick Rewrites</div>
                        <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:9,color:wColor}}>{words} words</span>
                      </div>
                      <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                        {[
                          {mode:'shorter',   label:'✂ Make shorter'},
                          {mode:'stronger',  label:'⚡ Stronger opening'},
                          {mode:'specific',  label:'📌 More specific'},
                          {mode:'passionate',label:'❤ More personal'},
                          {mode:'ats',       label:'🔍 ATS-optimise'},
                        ].map(({mode,label})=>(
                          <button key={mode} className="ai-chip" onClick={()=>stream(mode)} disabled={loading}>
                            {loading&&loadMsg.includes(mode.slice(0,4))?<span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>:label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {err&&<div style={{padding:'9px 12px',borderRadius:dark?3:8,
                    border:dark?'1px solid rgba(252,129,129,.2)':'1.5px solid rgba(197,48,48,.12)',
                    background:dark?'rgba(252,129,129,.05)':'rgba(254,215,215,.3)',
                    fontFamily:"'DM Sans',sans-serif",fontSize:12,color:'var(--err)'}}>⚠ {err}</div>}

                  {(letter||loading)&&(
                    <div>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:7}}>
                        <label className="lbl">Generated letter</label>
                        {letter&&<button className="gbtn" onClick={()=>copy(letter,'gen')} style={{
                          ...(copied==='gen'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                          {copied==='gen'?'✓ Copied':'⎘ Copy'}
                        </button>}
                      </div>
                      <div className="letter-box">
                        {letter}
                        {loading&&<span className="cur"/>}
                      </div>
                      {letter&&!loading&&(
                        <div style={{marginTop:8}}>
                          <div style={{display:'flex',justifyContent:'space-between',
                            fontFamily:"'Source Code Pro',monospace",fontSize:9,marginBottom:3,color:'var(--txm)'}}>
                            <span>Word count</span>
                            <span style={{color:wColor}}>{words} / 500 target</span>
                          </div>
                          <div className="wc-bar"><div style={{height:'100%',borderRadius:2,width:`${wPct}%`,background:wColor,transition:'width .4s'}}/></div>
                        </div>
                      )}
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ╔══ EDIT ══╗ */}
              {tab==='edit'&&(
                <motion.div key="edit" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12,maxWidth:800}}>

                  {!letter&&(
                    <div style={{textAlign:'center',padding:'48px 24px',fontFamily:"'Source Code Pro',monospace",fontSize:11,color:'var(--txm)'}}>
                      Generate a letter first on the ✦ Generate tab
                    </div>
                  )}

                  {letter&&(
                    <>
                      <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,alignItems:'center'}}>
                        <label className="lbl">Edit your letter</label>
                        <div style={{display:'flex',gap:7,flexWrap:'wrap',alignItems:'center'}}>
                          <span style={{fontFamily:"'Source Code Pro',monospace",fontSize:9,color:wColor}}>{words} words</span>
                          <button className="gbtn" onClick={()=>copy(letter,'edit')} style={{
                            ...(copied==='edit'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                            {copied==='edit'?'✓ Copied':'⎘ Copy'}
                          </button>
                          <button className="gbtn" onClick={print}>🖨 Print</button>
                        </div>
                      </div>
                      <textarea className="fi letter-box" rows={26}
                        value={letter} onChange={e=>setLetter(e.target.value)}
                        style={{fontFamily:"'Playfair Display',serif",fontSize:14,lineHeight:1.9,padding:'20px 22px'}}/>
                      <div>
                        <div style={{display:'flex',justifyContent:'space-between',
                          fontFamily:"'Source Code Pro',monospace",fontSize:9,marginBottom:3,color:'var(--txm)'}}>
                          <span>Word count</span>
                          <span style={{color:wColor}}>{words} / 500 ideal</span>
                        </div>
                        <div className="wc-bar"><div style={{height:'100%',borderRadius:2,width:`${wPct}%`,background:wColor,transition:'width .4s'}}/></div>
                      </div>
                    </>
                  )}

                  
                </motion.div>
              )}

              {/* ╔══ PREVIEW ══╗ */}
              {tab==='preview'&&(
                <motion.div key="preview" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  {!letter&&<div style={{textAlign:'center',padding:'48px',fontFamily:"'Source Code Pro',monospace",fontSize:11,color:'var(--txm)'}}>Generate a letter first</div>}

                  {letter&&(
                    <>
                      <div style={{display:'flex',gap:8}}>
                        <button className="btn" onClick={print}>🖨 Print / Save PDF</button>
                        <button className="gbtn" onClick={()=>copy(letter,'prev')} style={{
                          ...(copied==='prev'?{borderColor:'var(--succ)',color:'var(--succ)'}:{})}}>
                          {copied==='prev'?'✓ Copied':'⎘ Copy'}
                        </button>
                      </div>
                      <div style={{background:dark?'#1a1a1a':'#c4cdd8',borderRadius:dark?3:10,padding:24}}>
                        <div style={{background:'white',maxWidth:680,margin:'0 auto',
                          padding:'52px 64px',boxShadow:'0 8px 48px rgba(0,0,0,.28)',
                          fontFamily:"'Playfair Display',serif",color:'#111',lineHeight:1.88}}>
                          {data.applicantName&&(
                            <div style={{marginBottom:28}}>
                              <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:17,marginBottom:4}}>{data.applicantName}</div>
                              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:'#666',lineHeight:1.7}}>
                                {[data.address,data.email,data.phone].filter(Boolean).join(' · ')}
                              </div>
                            </div>
                          )}
                          <div style={{fontSize:14,whiteSpace:'pre-wrap'}}>{letter}</div>
                        </div>
                      </div>
                    </>
                  )}

                  
                </motion.div>
              )}

              {/* ╔══ TIPS ══╗ */}
              {tab==='tips'&&(
                <motion.div key="tips" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div className="panel" style={{padding:'18px 20px',maxWidth:800}}>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:'var(--tx)',marginBottom:4}}>
                      Scholarship Letter Tips
                    </div>
                    <div style={{fontFamily:"'Source Code Pro',monospace",fontSize:9,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:18}}>
                      what committees actually want to see
                    </div>

                    {[
                      {title:'Open strong — not with "I am writing to…"',
                       body:'Committees read hundreds of letters. Your first sentence must hook them. Start with a compelling statement about your mission, a brief story, or a striking achievement. Example: "Three years ago, watching my father unable to afford insulin, I decided I would dedicate my career to making medicine accessible."'},
                      {title:'Be specific, not vague',
                       body:'Replace "I worked hard" with "I studied 60+ hours per week while working 20 hours at a grocery store to support my family." Specificity creates credibility. Generic claims are forgettable.'},
                      {title:'Connect your story to the scholarship',
                       body:'Research the scholarship\'s values and mission. Mirror their language. If they care about "community leadership," use that phrase and provide evidence. A tailored letter always beats a template.'},
                      {title:'Show impact, not just activity',
                       body:'"I volunteered" is weak. "I co-founded a tutoring programme that improved reading scores for 47 at-risk students by an average of 2 grade levels" is powerful. Quantify wherever possible.'},
                      {title:'Address financial need honestly (need-based)',
                       body:'Be direct but dignified. Committees respect honesty. Explain the barrier briefly, then focus forward: how this scholarship enables your goals, not how hard life has been.'},
                      {title:'End with a clear ask and gratitude',
                       body:'Your closing paragraph should summarise your case in 1–2 sentences and express genuine appreciation. Don\'t be vague: "I believe this scholarship will allow me to complete my studies in environmental science and pursue the research described above."'},
                      {title:'Proofread three times',
                       body:'One typo can disqualify an otherwise brilliant letter. Read it aloud, run spell-check, then ask someone else to read it. Errors signal carelessness — exactly what committees don\'t want in a scholar.'},
                    ].map(({title,body})=>(
                      <div key={title} style={{marginBottom:11,padding:'12px 14px',borderRadius:dark?3:9,
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        background:dark?'rgba(0,0,0,.2)':'rgba(245,248,255,.8)'}}>
                        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12.5,fontWeight:700,color:'var(--acc)',marginBottom:5}}>✦ {title}</div>
                        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.72}}>{body}</div>
                      </div>
                    ))}

                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:'var(--tx)',margin:'14px 0 10px'}}>
                      Common mistakes
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      {[
                        {t:'Copying the scholarship description',    b:'Committees can tell when you\'ve lifted their own words back at them. Internalise their mission, then express it in your own voice.'},
                        {t:'Using the wrong scholarship name',       b:'If you recycle letters, triple-check that names match. Addressing the wrong scholarship is an instant rejection.'},
                        {t:'Focusing on the past only',             b:'Committees fund futures. Spend at least 50% of your letter on what you will do with the scholarship, not just what you\'ve done.'},
                        {t:'Exceeding the word limit',              b:'If there\'s a limit, respect it. If there isn\'t, 400–500 words is ideal. Longer doesn\'t mean better — it usually means less edited.'},
                      ].map(({t,b})=>(
                        <div key={t} style={{padding:'10px 12px',borderRadius:dark?3:9,
                          border:dark?'1px solid rgba(252,129,129,.2)':'1.5px solid rgba(197,48,48,.15)',
                          background:dark?'rgba(252,129,129,.04)':'rgba(254,228,228,.4)'}}>
                          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:'var(--err)',marginBottom:4}}>✕ {t}</div>
                          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:'var(--tx2)',lineHeight:1.65}}>{b}</div>
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