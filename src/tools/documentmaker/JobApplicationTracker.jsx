import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   JOB APPLICATION TRACKER — Document Tools Series #6
   Theme: Dark Obsidian/Cyber-Lime · Light Pearl/Hunter-Green
   Fonts: Syne · Space Grotesk · JetBrains Mono
   Features: Kanban board · Table view · Stats dashboard · AI prep
   AI: Interview prep questions, cold email, follow-up drafts
   Storage: localStorage with JSON export/import
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Space Grotesk',sans-serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes lime-glow{0%,100%{box-shadow:0 0 0 0 rgba(163,230,53,.18)}50%{box-shadow:0 0 0 8px rgba(163,230,53,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(600%)}}
@keyframes pop{0%{transform:scale(.92);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes slideright{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
@keyframes countup{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}

.dk{
  --bg:#060809;--s1:#0a0d0f;--s2:#0e1214;--s3:#131819;
  --bdr:#1a2420;--bdr-hi:rgba(163,230,53,.25);
  --acc:#a3e635;--acc2:#84cc16;--acc3:#38bdf8;--acc4:#f472b6;
  --tx:#e8f5e0;--tx2:#7aaa50;--tx3:#1a2420;--txm:#3a5530;
  --err:#f87171;--warn:#fbbf24;--succ:#a3e635;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 70% 40% at 50% -8%,rgba(163,230,53,.05),transparent),
    radial-gradient(ellipse 40% 50% at 92% 85%,rgba(56,189,248,.04),transparent),
    radial-gradient(ellipse 30% 45% at 8% 60%,rgba(244,114,182,.03),transparent);
}
.lt{
  --bg:#f4faf0;--s1:#ffffff;--s2:#eaf4e2;--s3:#dcefd4;
  --bdr:#b8d8a8;--bdr-hi:#1a4a1a;
  --acc:#2d6a1a;--acc2:#3a8a22;--acc3:#0369a1;--acc4:#be185d;
  --tx:#0e2208;--tx2:#2d6a1a;--tx3:#b8d8a8;--txm:#4a7a38;
  --err:#991b1b;--warn:#92400e;--succ:#166534;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(45,106,26,.05),transparent);
}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(6,8,9,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(244,250,240,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(45,106,26,.07);}

.scanline{position:fixed;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(163,230,53,.3),transparent);
  animation:scan 5s linear infinite;pointer-events:none;z-index:999;}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 15px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'Space Grotesk',sans-serif;font-size:11px;
  font-weight:500;letter-spacing:.04em;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--txm);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(163,230,53,.04);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#94a3b8;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(45,106,26,.04);font-weight:600;}
.lt .tab:hover:not(.on){color:var(--tx2);}

.full-main{padding:14px 18px;display:flex;flex-direction:column;gap:14px;overflow-x:hidden;min-height:calc(100vh - 86px);}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(45,106,26,.05);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 22px;cursor:pointer;
  font-family:'Space Grotesk',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.03em;transition:all .16s;border:none;}
.dk .btn{background:var(--acc);color:#060809;border-radius:3px;animation:lime-glow 2.8s infinite;}
.dk .btn:hover{background:#bef264;transform:translateY(-1px);animation:none;box-shadow:0 0 28px rgba(163,230,53,.5);}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;animation:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:9px;box-shadow:0 4px 14px rgba(45,106,26,.28);}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;}

.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;
  font-family:'Space Grotesk',sans-serif;font-size:10px;font-weight:500;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(163,230,53,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(45,106,26,.05);}

.fi{width:100%;outline:none;font-family:'Space Grotesk',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;resize:vertical;}
.dk .fi{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(163,230,53,.1);}
.lt .fi{background:#f4faf0;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(45,106,26,.08);}
.fi::placeholder{opacity:.3;}

/* STATUS BADGES */
.badge{display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border-radius:99px;
  font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;white-space:nowrap;}

/* KANBAN */
.kanban{display:grid;grid-template-columns:repeat(5,1fr);gap:11px;overflow-x:auto;padding-bottom:8px;}
.kol{min-width:180px;display:flex;flex-direction:column;gap:8px;}
.kol-head{padding:9px 11px;border-radius:4px 4px 0 0;display:flex;justify-content:space-between;align-items:center;}
.kcard{padding:11px 12px;cursor:pointer;transition:all .15s;position:relative;}
.dk .kcard{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.35);}
.lt .kcard{border:1.5px solid var(--bdr);border-radius:10px;background:white;}
.dk .kcard:hover{border-color:rgba(163,230,53,.3);transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,.4);}
.lt .kcard:hover{border-color:rgba(45,106,26,.3);transform:translateY(-1px);box-shadow:0 4px 16px rgba(45,106,26,.1);}

/* TABLE */
.tbl{width:100%;border-collapse:collapse;}
.tbl th{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;
  padding:9px 12px;text-align:left;cursor:pointer;white-space:nowrap;user-select:none;}
.dk .tbl th{color:rgba(163,230,53,.45);border-bottom:1px solid var(--bdr);}
.lt .tbl th{color:var(--acc);border-bottom:1.5px solid var(--bdr);}
.dk .tbl th:hover{color:var(--acc);}
.lt .tbl th:hover{color:var(--acc2);}
.tbl td{padding:10px 12px;font-size:12.5px;vertical-align:middle;}
.dk .tbl tr{border-bottom:1px solid rgba(255,255,255,.04);}
.lt .tbl tr{border-bottom:1px solid rgba(0,0,0,.04);}
.dk .tbl tr:hover td{background:rgba(163,230,53,.025);}
.lt .tbl tr:hover td{background:rgba(45,106,26,.025);}

/* STAT CARD */
.stat-card{padding:16px 18px;display:flex;flex-direction:column;gap:6px;}
.dk .stat-card{border:1px solid var(--bdr);border-radius:4px;background:var(--s2);}
.lt .stat-card{border:1.5px solid var(--bdr);border-radius:12px;background:var(--s1);box-shadow:0 2px 12px rgba(45,106,26,.05);}
.stat-num{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;line-height:1;animation:countup .4s ease;}

/* MODAL OVERLAY */
.overlay{position:fixed;inset:0;z-index:500;display:flex;align-items:center;justify-content:center;padding:16px;}
.dk .overlay{background:rgba(0,0,0,.75);}
.lt .overlay{background:rgba(0,0,0,.45);}
.modal{width:100%;max-width:600px;max-height:88vh;overflow-y:auto;border-radius:8px;padding:22px 24px;animation:pop .18s ease;}
.dk .modal{background:var(--s2);border:1px solid var(--bdr);}
.lt .modal{background:white;border:1.5px solid var(--bdr);box-shadow:0 8px 48px rgba(0,0,0,.18);}

/* AI */
.ai-box{font-family:'JetBrains Mono',monospace;font-size:11.5px;line-height:1.82;
  padding:14px 16px;min-height:60px;white-space:pre-wrap;word-break:break-word;}
.dk .ai-box{color:#b8f08a;background:rgba(0,0,0,.5);border:1px solid rgba(163,230,53,.12);border-radius:4px;}
.lt .ai-box{color:#0e2208;background:#edf7e5;border:1.5px solid rgba(45,106,26,.14);border-radius:10px;}
.cur{display:inline-block;width:7px;height:13px;background:var(--acc);animation:blink .7s infinite;vertical-align:text-bottom;margin-left:1px;}

.lbl{font-family:'Space Grotesk',sans-serif;font-size:9px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(163,230,53,.42);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(163,230,53,.28);}
.lt .slbl{color:var(--acc);}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(163,230,53,.01);border:1px dashed rgba(163,230,53,.09);border-radius:3px;}
.lt .ad{background:rgba(45,106,26,.015);border:1.5px dashed rgba(45,106,26,.1);border-radius:9px;}
.ad span{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

.prog{height:3px;border-radius:2px;overflow:hidden;}
.dk .prog{background:rgba(163,230,53,.1);}
.lt .prog{background:rgba(45,106,26,.08);}
.prog-bar{height:100%;border-radius:2px;transition:width .4s;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}
`;

/* ═══ STATUS CONFIG ═══ */
const STATUSES = [
  {id:'wishlist',   label:'Wishlist',    color:'#6b7280', bg:'rgba(107,114,128,.12)', emoji:'⭐'},
  {id:'applied',    label:'Applied',     color:'#3b82f6', bg:'rgba(59,130,246,.12)',  emoji:'📤'},
  {id:'interview',  label:'Interview',   color:'#f59e0b', bg:'rgba(245,158,11,.12)',  emoji:'💬'},
  {id:'offer',      label:'Offer',       color:'#10b981', bg:'rgba(16,185,129,.12)',  emoji:'🎉'},
  {id:'rejected',   label:'Rejected',    color:'#ef4444', bg:'rgba(239,68,68,.12)',   emoji:'✕'},
];

const STATUS_MAP = Object.fromEntries(STATUSES.map(s=>[s.id,s]));

const PRIORITIES = [
  {id:'low',    label:'Low',    color:'#6b7280'},
  {id:'medium', label:'Medium', color:'#f59e0b'},
  {id:'high',   label:'High',   color:'#ef4444'},
  {id:'dream',  label:'Dream',  color:'#a855f7'},
];

/* ═══ HELPERS ═══ */
const uid = () => Math.random().toString(36).slice(2,9);
const today = () => new Date().toISOString().split('T')[0];
const fmt = d => d ? new Date(d+'T00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}) : '—';
const daysSince = d => d ? Math.floor((Date.now()-new Date(d+'T00:00'))/(1000*86400)) : null;

const EMPTY_JOB = {
  id:'', company:'', role:'', location:'', salary:'', url:'',
  status:'applied', priority:'medium',
  appliedDate:'', followUpDate:'', interviewDate:'',
  contactName:'', contactEmail:'',
  notes:'', jd:'',
};

const SAMPLE_JOBS = [
  {id:uid(),company:'Stripe',role:'Senior Product Manager',location:'San Francisco, CA',salary:'$180K–$220K',url:'',status:'interview',priority:'dream',appliedDate:'2025-02-15',followUpDate:'2025-02-22',interviewDate:'2025-03-05',contactName:'Alice Chen',contactEmail:'alice@stripe.com',notes:'Great culture fit. Technical PM role.',jd:''},
  {id:uid(),company:'Figma',role:'Product Manager',location:'Remote',salary:'$160K–$190K',url:'',status:'applied',priority:'high',appliedDate:'2025-02-20',followUpDate:'2025-02-27',interviewDate:'',contactName:'',contactEmail:'',notes:'Applied via referral.',jd:''},
  {id:uid(),company:'Linear',role:'Head of Product',location:'Remote',salary:'$200K+',url:'',status:'offer',priority:'dream',appliedDate:'2025-02-01',followUpDate:'',interviewDate:'2025-02-18',contactName:'Tom V.',contactEmail:'',notes:'Offer received! Evaluating vs Stripe.',jd:''},
  {id:uid(),company:'Notion',role:'Senior PM',location:'New York, NY',salary:'$170K–$200K',url:'',status:'wishlist',priority:'high',appliedDate:'',followUpDate:'',interviewDate:'',contactName:'',contactEmail:'',notes:'',jd:''},
  {id:uid(),company:'Vercel',role:'PM – DX',location:'Remote',salary:'$155K–$185K',url:'',status:'rejected',priority:'medium',appliedDate:'2025-02-10',followUpDate:'',interviewDate:'',contactName:'',contactEmail:'',notes:'Rejected after phone screen. Ask for feedback.',jd:''},
];

const TABS = [
  {id:'kanban',label:'⬛ Kanban'},
  {id:'table', label:'☰ Table'},
  {id:'stats', label:'📊 Stats'},
  {id:'ai',    label:'✦ AI Prep'},
];

export default function JobApplicationTracker() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';

  const [tab,  setTab]  = useState('kanban');
  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [modal, setModal] = useState(null);   // null | 'add' | job id
  const [editJob, setEditJob] = useState({...EMPTY_JOB});
  const [sortCol, setSortCol] = useState('appliedDate');
  const [sortDir, setSortDir] = useState(-1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  /* AI */
  const [aiMode,   setAiMode]  = useState('interview');
  const [aiJobId,  setAiJobId] = useState('');
  const [aiOut,    setAiOut]   = useState('');
  const [aiLoad,   setAiLoad]  = useState(false);
  const [aiErr,    setAiErr]   = useState('');

  /* ── CRUD ── */
  const openAdd = () => { setEditJob({...EMPTY_JOB, id:uid(), appliedDate:today()}); setModal('add'); };
  const openEdit = job => { setEditJob({...job}); setModal(job.id); };
  const saveJob = () => {
    if(modal==='add') setJobs(p=>[editJob,...p]);
    else setJobs(p=>p.map(j=>j.id===modal?editJob:j));
    setModal(null);
  };
  const deleteJob = id => { setJobs(p=>p.filter(j=>j.id!==id)); setModal(null); };
  const setStatus = (id, status) => setJobs(p=>p.map(j=>j.id===id?{...j,status}:j));

  /* ── STATS ── */
  const stats = useMemo(()=>{
    const total = jobs.length;
    const byStatus = Object.fromEntries(STATUSES.map(s=>[s.id, jobs.filter(j=>j.status===s.id).length]));
    const responseRate = total>0 ? Math.round(((byStatus.interview||0)+(byStatus.offer||0))/Math.max(byStatus.applied||1,1)*100) : 0;
    const offerRate = total>0 ? Math.round((byStatus.offer||0)/Math.max(total,1)*100) : 0;
    const avgDays = (() => {
      const applied = jobs.filter(j=>j.appliedDate&&j.interviewDate);
      if(!applied.length) return null;
      const avg = applied.reduce((s,j)=>{
        return s + Math.floor((new Date(j.interviewDate)- new Date(j.appliedDate))/(1000*86400));
      },0)/applied.length;
      return Math.round(avg);
    })();
    return {total, byStatus, responseRate, offerRate, avgDays};
  },[jobs]);

  /* ── FILTERED/SORTED TABLE ── */
  const tableJobs = useMemo(()=>{
    let list = [...jobs];
    if(filterStatus!=='all') list = list.filter(j=>j.status===filterStatus);
    if(search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(j=>(j.company+j.role+j.location).toLowerCase().includes(q));
    }
    list.sort((a,b)=>{
      const av = a[sortCol]||''; const bv = b[sortCol]||'';
      return av < bv ? sortDir : av > bv ? -sortDir : 0;
    });
    return list;
  },[jobs,filterStatus,search,sortCol,sortDir]);

  const toggleSort = col => { if(sortCol===col) setSortDir(d=>-d); else {setSortCol(col);setSortDir(-1);} };

  /* ── EXPORT/IMPORT ── */
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(jobs,null,2)],{type:'application/json'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob);
    a.download='job-tracker.json'; a.click();
  };
  const importJSON = e => {
    const f = e.target.files?.[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ev => { try { setJobs(JSON.parse(ev.target.result)); } catch {} };
    r.readAsText(f);
  };

  /* ── AI ── */
  const selectedJob = jobs.find(j=>j.id===aiJobId) || jobs[0];
  const AI_PROMPTS = {
    interview: `Generate 8 likely interview questions for this role, with brief tips on how to answer each.
Role: ${selectedJob?.role||'Product Manager'} at ${selectedJob?.company||'the company'}
Notes: ${selectedJob?.notes||''}
Format each as: Q: [question]\nTip: [1-sentence answer tip]\n`,
    email: `Write a professional follow-up email for a job application.
Applicant applying for: ${selectedJob?.role||'the role'} at ${selectedJob?.company||'the company'}
Applied: ${selectedJob?.appliedDate||'recently'}. Contact: ${selectedJob?.contactName||'Hiring Manager'}.
Tone: professional, brief, enthusiastic. Output the email only.`,
    cold: `Write a cold outreach LinkedIn/email message to connect about a role.
Target company: ${selectedJob?.company||'the company'}, Role: ${selectedJob?.role||'the role'}.
Keep it under 100 words, specific, not generic. Output the message only.`,
    research: `Give me 5 key things I should know before interviewing at ${selectedJob?.company||'this company'}.
Cover: company mission, recent news, culture, what interviewers typically ask, one smart question to ask them.
Format with clear numbered points.`,
  };

  const runAI = async () => {
    setAiLoad(true); setAiOut(''); setAiErr('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:1000, stream:true,
          messages:[{role:'user',content:AI_PROMPTS[aiMode]}]}),
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
          try{const o=JSON.parse(p);if(o.type==='content_block_delta'&&o.delta?.type==='text_delta')setAiOut(v=>v+o.delta.text);}catch{}
        }
      }
    }catch(e){setAiErr(e.message);}
    finally{setAiLoad(false);}
  };

  /* ── STATUS BADGE ── */
  const StatusBadge = ({status}) => {
    const s = STATUS_MAP[status]||STATUSES[0];
    return (
      <span className="badge" style={{background:s.bg,color:s.color,border:`1px solid ${s.color}30`}}>
        {s.emoji} {s.label}
      </span>
    );
  };

  const PriBadge = ({priority}) => {
    const p = PRIORITIES.find(x=>x.id===priority)||PRIORITIES[1];
    return <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:p.color}}>● {p.label}</span>;
  };

  /* ── MODAL ── */
  const JobModal = () => {
    if(!modal) return null;
    const isAdd = modal==='add';
    return (
      <div className="overlay" onClick={e=>{if(e.target===e.currentTarget)setModal(null)}}>
        <motion.div className="modal" initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.95}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:18,fontWeight:700,color:'var(--tx)'}}>
              {isAdd?'Add Application':'Edit Application'}
            </div>
            <button onClick={()=>setModal(null)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--txm)',fontSize:20}}>×</button>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:14}}>
            {[
              ['Company','company','text','Stripe'],
              ['Role / Job Title','role','text','Senior PM'],
              ['Location','location','text','Remote'],
              ['Salary Range','salary','text','$160K–$200K'],
              ['Job URL','url','text','https://…'],
              ['Contact Name','contactName','text','Alice Chen'],
              ['Contact Email','contactEmail','email','alice@co.com'],
              ['Applied Date','appliedDate','date',''],
              ['Follow-up Date','followUpDate','date',''],
              ['Interview Date','interviewDate','date',''],
            ].map(([l,k,t,ph])=>(
              <div key={k}>
                <label className="lbl">{l}</label>
                <input className="fi" type={t} placeholder={ph}
                  value={editJob[k]||''} onChange={e=>setEditJob(p=>({...p,[k]:e.target.value}))}/>
              </div>
            ))}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:14}}>
            <div>
              <label className="lbl">Status</label>
              <select className="fi" value={editJob.status||'applied'}
                onChange={e=>setEditJob(p=>({...p,status:e.target.value}))}>
                {STATUSES.map(s=><option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="lbl">Priority</label>
              <select className="fi" value={editJob.priority||'medium'}
                onChange={e=>setEditJob(p=>({...p,priority:e.target.value}))}>
                {PRIORITIES.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{marginBottom:10}}>
            <label className="lbl">Notes</label>
            <textarea className="fi" rows={3} placeholder="Referral from…, key contact, impressions, things to mention…"
              value={editJob.notes||''} onChange={e=>setEditJob(p=>({...p,notes:e.target.value}))}/>
          </div>
          <div style={{marginBottom:18}}>
            <label className="lbl">Job description / keywords (for AI prep)</label>
            <textarea className="fi" rows={3} placeholder="Paste key requirements, skills mentioned in JD…"
              value={editJob.jd||''} onChange={e=>setEditJob(p=>({...p,jd:e.target.value}))}/>
          </div>

          <div style={{display:'flex',gap:8,justifyContent:'space-between'}}>
            <div style={{display:'flex',gap:8}}>
              <button className="btn" onClick={saveJob}>{isAdd?'Add Application':'Save Changes'}</button>
              <button className="gbtn" onClick={()=>setModal(null)}>Cancel</button>
            </div>
            {!isAdd&&<button className="gbtn" onClick={()=>deleteJob(modal)}
              style={{color:'var(--err)',borderColor:'rgba(239,68,68,.3)'}}>
              🗑 Delete
            </button>}
          </div>
        </motion.div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════════ */
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
              border:dark?'1px solid rgba(163,230,53,.3)':'none',
              background:dark?'rgba(163,230,53,.08)':'linear-gradient(135deg,#2d6a1a,#3a8a22)',
              boxShadow:dark?'0 0 16px rgba(163,230,53,.2)':'0 3px 10px rgba(45,106,26,.32)',
            }}>📋</div>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color:'var(--tx)',lineHeight:1}}>
                Job<span style={{color:'var(--acc)'}}> Tracker</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #6 · Kanban · Stats · AI Prep
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>

          {/* Total badge */}
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--acc)',
            border:dark?'1px solid rgba(163,230,53,.2)':'1.5px solid var(--bdr)',
            padding:'3px 10px',borderRadius:dark?3:7}}>
            {jobs.length} applications
          </div>

          <button className="btn" onClick={openAdd} style={{padding:'6px 14px',fontSize:11,animation:'none'}}>
            + Add
          </button>

          <button onClick={()=>setDark(d=>!d)} style={{
            display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(163,230,53,.2)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer',
          }}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#b8d8a8',
              boxShadow:dark?'0 0 8px rgba(163,230,53,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#060809':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--txm)'}}>{dark?'VOID':'LIGHT'}</span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>
              {t.label}
            </button>
          ))}
          {/* Export/Import in tabbar */}
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6,padding:'0 12px'}}>
            <button className="gbtn" onClick={exportJSON} style={{fontSize:9}}>⬇ Export JSON</button>
            <label className="gbtn" style={{cursor:'pointer',fontSize:9}}>
              ⬆ Import
              <input type="file" accept=".json" style={{display:'none'}} onChange={importJSON}/>
            </label>
          </div>
        </div>

        {/* ════ MAIN ════ */}
        <div className="full-main">
          <AnimatePresence mode="wait">

            {/* ╔══ KANBAN ══╗ */}
            {tab==='kanban'&&(
              <motion.div key="kanban" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                <div className="kanban">
                  {STATUSES.map(s=>{
                    const colJobs = jobs.filter(j=>j.status===s.id);
                    return (
                      <div key={s.id} className="kol">
                        <div className="kol-head" style={{background:s.bg,border:`1px solid ${s.color}30`}}>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:500,color:s.color,letterSpacing:'.1em',textTransform:'uppercase'}}>
                            {s.emoji} {s.label}
                          </span>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:s.color,opacity:.7}}>
                            {colJobs.length}
                          </span>
                        </div>
                        <AnimatePresence>
                          {colJobs.map(job=>(
                            <motion.div key={job.id} className="kcard"
                              initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,height:0}}
                              onClick={()=>openEdit(job)}>
                              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:12.5,fontWeight:600,color:'var(--tx)',marginBottom:3,lineHeight:1.3}}>
                                {job.company}
                              </div>
                              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:11,color:'var(--tx2)',marginBottom:6}}>
                                {job.role}
                              </div>
                              {job.salary&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--txm)',marginBottom:4}}>
                                {job.salary}
                              </div>}
                              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:5}}>
                                <PriBadge priority={job.priority}/>
                                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--txm)'}}>
                                  {job.appliedDate?fmt(job.appliedDate):'No date'}
                                </span>
                              </div>
                              {job.interviewDate&&(
                                <div style={{marginTop:5,padding:'3px 7px',borderRadius:3,
                                  background:'rgba(245,158,11,.1)',border:'1px solid rgba(245,158,11,.25)',
                                  fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'#f59e0b'}}>
                                  📅 Interview: {fmt(job.interviewDate)}
                                </div>
                              )}
                              {/* Quick status change */}
                              <div style={{display:'flex',gap:3,marginTop:7,flexWrap:'wrap'}}>
                                {STATUSES.filter(st=>st.id!==job.status).map(st=>(
                                  <button key={st.id}
                                    onClick={e=>{e.stopPropagation();setStatus(job.id,st.id);}}
                                    style={{padding:'1px 6px',fontSize:8,fontFamily:"'JetBrains Mono',monospace",
                                      background:'transparent',cursor:'pointer',
                                      border:`1px solid ${st.color}40`,borderRadius:2,color:st.color,
                                      transition:'all .1s'}}>
                                    → {st.label}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        {colJobs.length===0&&(
                          <div style={{padding:'16px 12px',textAlign:'center',
                            fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--txm)',opacity:.5}}>
                            empty
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
              </motion.div>
            )}

            {/* ╔══ TABLE ══╗ */}
            {tab==='table'&&(
              <motion.div key="table" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                {/* Filters */}
                <div style={{display:'flex',gap:9,marginBottom:12,flexWrap:'wrap',alignItems:'center'}}>
                  <input className="fi" style={{width:220,resize:'none'}} placeholder="🔍 Search company, role…"
                    value={search} onChange={e=>setSearch(e.target.value)}/>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                    <button className={`gbtn ${filterStatus==='all'?'on':''}`} onClick={()=>setFilterStatus('all')}>All ({jobs.length})</button>
                    {STATUSES.map(s=>(
                      <button key={s.id} className={`gbtn ${filterStatus===s.id?'on':''}`}
                        onClick={()=>setFilterStatus(s.id)}>
                        {s.emoji} {s.label} ({stats.byStatus[s.id]||0})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="panel" style={{overflow:'hidden'}}>
                  <div style={{overflowX:'auto'}}>
                    <table className="tbl">
                      <thead>
                        <tr>
                          {[
                            ['company','Company'],['role','Role'],['status','Status'],
                            ['priority','Priority'],['appliedDate','Applied'],
                            ['interviewDate','Interview'],['salary','Salary'],
                          ].map(([col,label])=>(
                            <th key={col} onClick={()=>toggleSort(col)}>
                              {label} {sortCol===col?(sortDir===-1?'↓':'↑'):''}
                            </th>
                          ))}
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <AnimatePresence>
                          {tableJobs.map(job=>(
                            <motion.tr key={job.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                              <td>
                                <div style={{fontWeight:600}}>{job.company}</div>
                                {job.location&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--txm)'}}>{job.location}</div>}
                              </td>
                              <td>{job.role}</td>
                              <td><StatusBadge status={job.status}/></td>
                              <td><PriBadge priority={job.priority}/></td>
                              <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>
                                {fmt(job.appliedDate)}
                                {job.appliedDate&&daysSince(job.appliedDate)!==null&&
                                  <div style={{fontSize:9,color:'var(--txm)'}}>{daysSince(job.appliedDate)}d ago</div>}
                              </td>
                              <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:job.interviewDate?'#f59e0b':'var(--txm)'}}>
                                {fmt(job.interviewDate)}
                              </td>
                              <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx2)'}}>{job.salary||'—'}</td>
                              <td>
                                <div style={{display:'flex',gap:5}}>
                                  <button className="gbtn" onClick={()=>openEdit(job)} style={{padding:'3px 8px',fontSize:9}}>✎ Edit</button>
                                  <button className="gbtn" onClick={()=>{setAiJobId(job.id);setTab('ai');}}
                                    style={{padding:'3px 8px',fontSize:9,borderColor:'rgba(163,230,53,.3)',color:'var(--acc)'}}>
                                    ✦ Prep
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                    {tableJobs.length===0&&(
                      <div style={{padding:'32px',textAlign:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'var(--txm)'}}>
                        No applications found
                      </div>
                    )}
                  </div>
                </div>
                
              </motion.div>
            )}

            {/* ╔══ STATS ══╗ */}
            {tab==='stats'&&(
              <motion.div key="stats" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}>

                {/* Top stat row */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:11,marginBottom:14}}>
                  {[
                    {label:'Total Applied',    val:stats.total,              unit:'',    color:'var(--acc)'},
                    {label:'Interviews',       val:stats.byStatus.interview||0, unit:'', color:'#f59e0b'},
                    {label:'Offers',           val:stats.byStatus.offer||0,  unit:'',    color:'#10b981'},
                    {label:'Response Rate',    val:stats.responseRate,       unit:'%',   color:'var(--acc3)'},
                  ].map(({label,val,unit,color})=>(
                    <div key={label} className="stat-card">
                      <div className="stat-num" style={{color}}>{val}{unit}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--txm)',letterSpacing:'.1em',textTransform:'uppercase'}}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Status breakdown */}
                <div className="panel" style={{padding:'16px 18px',marginBottom:11}}>
                  <div className="slbl" style={{marginBottom:12}}>Status breakdown</div>
                  {STATUSES.map(s=>{
                    const count = stats.byStatus[s.id]||0;
                    const pct = stats.total ? Math.round(count/stats.total*100) : 0;
                    return (
                      <div key={s.id} style={{marginBottom:10}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                          <span style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:12,color:s.color}}>{s.emoji} {s.label}</span>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--txm)'}}>{count} · {pct}%</span>
                        </div>
                        <div style={{height:5,borderRadius:3,overflow:'hidden',background:dark?'rgba(255,255,255,.06)':'rgba(0,0,0,.06)'}}>
                          <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:.6,ease:'easeOut'}}
                            style={{height:'100%',borderRadius:3,background:s.color,opacity:.7}}/>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Funnel */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:11,marginBottom:11}}>
                  <div className="stat-card">
                    <div className="slbl">Offer rate</div>
                    <div className="stat-num" style={{color:'#10b981'}}>{stats.offerRate}%</div>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:12,color:'var(--tx2)',lineHeight:1.5,marginTop:4}}>
                      {stats.byStatus.offer||0} offer{stats.byStatus.offer!==1?'s':''} from {stats.total} applications
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="slbl">Avg. days to interview</div>
                    <div className="stat-num" style={{color:'#f59e0b'}}>
                      {stats.avgDays!=null?stats.avgDays+'d':'—'}
                    </div>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:12,color:'var(--tx2)',lineHeight:1.5,marginTop:4}}>
                      {stats.avgDays!=null?'From applied date to first interview':'Add interview dates to see this'}
                    </div>
                  </div>
                </div>

                {/* Priority breakdown */}
                <div className="panel" style={{padding:'16px 18px',marginBottom:11}}>
                  <div className="slbl" style={{marginBottom:12}}>Priority breakdown</div>
                  <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                    {PRIORITIES.map(p=>{
                      const count = jobs.filter(j=>j.priority===p.id).length;
                      return (
                        <div key={p.id} style={{padding:'8px 14px',borderRadius:dark?3:8,
                          border:`1px solid ${p.color}30`,background:`${p.color}08`,minWidth:80,textAlign:'center'}}>
                          <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:p.color}}>{count}</div>
                          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:p.color,marginTop:2}}>{p.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Upcoming interviews */}
                {jobs.filter(j=>j.interviewDate&&j.status==='interview').length>0&&(
                  <div className="panel" style={{padding:'16px 18px',marginBottom:11}}>
                    <div className="slbl" style={{marginBottom:10}}>Upcoming interviews</div>
                    {jobs.filter(j=>j.interviewDate&&j.status==='interview')
                      .sort((a,b)=>a.interviewDate>b.interviewDate?1:-1)
                      .map(j=>(
                        <div key={j.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                          padding:'8px 10px',marginBottom:6,borderRadius:dark?3:8,
                          background:dark?'rgba(245,158,11,.06)':'rgba(245,158,11,.06)',
                          border:'1px solid rgba(245,158,11,.2)'}}>
                          <div>
                            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:12.5,fontWeight:600,color:'var(--tx)'}}>{j.company}</div>
                            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:11,color:'var(--tx2)'}}>{j.role}</div>
                          </div>
                          <div style={{textAlign:'right'}}>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:'#f59e0b'}}>{fmt(j.interviewDate)}</div>
                            <button className="gbtn" onClick={()=>{setAiJobId(j.id);setTab('ai');setAiMode('interview');}}
                              style={{fontSize:9,padding:'2px 7px',marginTop:3,borderColor:'rgba(163,230,53,.3)',color:'var(--acc)'}}>
                              ✦ Prep
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                
              </motion.div>
            )}

            {/* ╔══ AI PREP ══╗ */}
            {tab==='ai'&&(
              <motion.div key="ai" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                style={{display:'flex',flexDirection:'column',gap:12,maxWidth:860}}>

                {/* Job selector */}
                <div className="panel" style={{padding:'13px 15px'}}>
                  <label className="lbl" style={{marginBottom:7}}>Select application to prep for</label>
                  <select className="fi" value={aiJobId}
                    onChange={e=>setAiJobId(e.target.value)}>
                    <option value="">— Choose application —</option>
                    {jobs.map(j=>(
                      <option key={j.id} value={j.id}>
                        {j.company} — {j.role} ({STATUS_MAP[j.status]?.label})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mode picker */}
                <div className="panel" style={{padding:'13px 15px'}}>
                  <label className="lbl" style={{marginBottom:10}}>✦ What do you need?</label>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
                    {[
                      {id:'interview',icon:'💬',label:'Interview Questions',   desc:'8 likely questions + tips'},
                      {id:'email',    icon:'📧',label:'Follow-up Email',       desc:'Professional follow-up draft'},
                      {id:'cold',     icon:'📬',label:'Cold Outreach Message', desc:'LinkedIn/email under 100 words'},
                      {id:'research', icon:'🔎',label:'Company Research',      desc:'5 key things before interview'},
                    ].map(({id,icon,label,desc})=>(
                      <button key={id} className={`gbtn ${aiMode===id?'on':''}`}
                        onClick={()=>setAiMode(id)}
                        style={{flexDirection:'column',gap:4,height:'auto',padding:'11px 12px',
                          alignItems:'flex-start',
                          background:aiMode===id?(dark?'rgba(163,230,53,.06)':'rgba(45,106,26,.05)'):''
                        }}>
                        <span style={{fontSize:18}}>{icon}</span>
                        <span style={{fontSize:11,fontWeight:600,color:'var(--tx)',textTransform:'none',letterSpacing:0}}>{label}</span>
                        <span style={{fontSize:9.5,opacity:.6,textTransform:'none',letterSpacing:0,fontFamily:"'Space Grotesk',sans-serif"}}>{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedJob&&(
                  <div style={{padding:'9px 12px',borderRadius:dark?3:8,
                    border:dark?'1px solid rgba(163,230,53,.1)':'1.5px solid rgba(45,106,26,.1)',
                    background:dark?'rgba(163,230,53,.03)':'rgba(45,106,26,.03)',
                    fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'var(--tx2)'}}>
                    Prepping for: <span style={{color:'var(--acc)',fontWeight:600}}>{selectedJob.company}</span> — {selectedJob.role}
                    &nbsp;·&nbsp;<StatusBadge status={selectedJob.status}/>
                  </div>
                )}

                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <button className="btn" onClick={runAI} disabled={aiLoad||!selectedJob}
                    style={{padding:'10px 26px',fontSize:13}}>
                    {aiLoad?<><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;Generating…</>:'✦ Generate'}
                  </button>
                  {aiOut&&!aiLoad&&(
                    <button className="gbtn" onClick={()=>{try{navigator.clipboard.writeText(aiOut)}catch{}}}>⎘ Copy</button>
                  )}
                </div>

                {aiErr&&<div style={{padding:'9px 13px',borderRadius:dark?3:8,
                  background:dark?'rgba(248,113,113,.05)':'rgba(185,28,28,.04)',
                  border:dark?'1px solid rgba(248,113,113,.2)':'1.5px solid rgba(185,28,28,.12)',
                  fontFamily:"'Space Grotesk',sans-serif",fontSize:12,color:'var(--err)'}}>⚠ {aiErr}</div>}

                {(aiOut||aiLoad)&&(
                  <div>
                    <div className="lbl" style={{marginBottom:7}}>
                      ✦ {['Interview Questions','Follow-up Email','Cold Outreach','Company Research'][['interview','email','cold','research'].indexOf(aiMode)]}
                      {!aiLoad&&<span style={{color:'var(--succ)',marginLeft:8}}>✓ Done</span>}
                    </div>
                    <div className="ai-box">
                      {aiOut}
                      {aiLoad&&<span className="cur"/>}
                    </div>
                  </div>
                )}

                
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {modal&&<JobModal key="modal"/>}
        </AnimatePresence>
      </div>
    </>
  );
}