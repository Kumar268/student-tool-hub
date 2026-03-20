import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   ASSIGNMENT TRACKER — Document Tools Series #13
   Theme: Dark Void/Neon Teal · Light Cream/Forest
   Fonts: Fraunces · Outfit · Fira Code
   Tabs: Dashboard · Assignments · Courses · Calendar · Guide
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Outfit',sans-serif}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
@keyframes pop{0%{transform:scale(.85);opacity:0}65%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
@keyframes slide-in{0%{opacity:0;transform:translateX(-8px)}100%{opacity:1;transform:translateX(0)}}
@keyframes due-pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes check-pop{0%{transform:scale(0)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
@keyframes progress-fill{from{width:0}}

.dk{--bg:#060a09;--s1:#0a0f0d;--s2:#0f1612;--s3:#141d18;--bdr:#1a2820;--acc:#14ffb4;--acc2:#00e5a0;--acc4:#a78bfa;--err:#ff6b6b;--warn:#fbbf24;--tx:#e8fff8;--tx2:#8ecfb8;--tx3:#1a3d2c;--txm:#3d7a62;min-height:100vh;background:var(--bg);color:var(--tx);background-image:radial-gradient(ellipse 80% 40% at 50% -10%,rgba(20,255,180,.05),transparent),radial-gradient(ellipse 40% 60% at 95% 80%,rgba(167,139,250,.06),transparent);}
.lt{--bg:#f5fbf8;--s1:#ffffff;--s2:#ecf7f1;--s3:#dff0e8;--bdr:#b8ddc8;--acc:#0d3320;--acc2:#1a5c38;--acc4:#5b21b6;--err:#991b1b;--warn:#92400e;--tx:#071810;--tx2:#1a5c38;--tx3:#a7d4bc;--txm:#2d6e4a;min-height:100vh;background:var(--bg);color:var(--tx);}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(6,10,9,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(245,251,248,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(13,51,32,.07);}
.scanline{position:fixed;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(20,255,180,.3),transparent);animation:scan 4s linear infinite;pointer-events:none;z-index:999;}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 15px;border:none;cursor:pointer;background:transparent;border-bottom:2.5px solid transparent;font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;letter-spacing:.04em;display:flex;align-items:center;gap:6px;white-space:nowrap;transition:all .15s;}
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
.main{padding:18px 24px;display:flex;flex-direction:column;gap:16px;overflow-y:auto;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(13,51,32,.06);}

.fi{width:100%;outline:none;font-family:'Outfit',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;}
.dk .fi{background:rgba(0,0,0,.4);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(20,255,180,.08);}
.lt .fi{background:#f5fbf8;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);}

.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;font-family:'Fira Code',monospace;font-size:10px;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(20,255,180,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(13,51,32,.05);}

.lbl{font-family:'Outfit',sans-serif;font-size:9px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(20,255,180,.4);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;display:block;}
.dk .slbl{color:rgba(20,255,180,.3);}
.lt .slbl{color:var(--acc);}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(20,255,180,.01);border:1px dashed rgba(20,255,180,.08);border-radius:3px;}
.lt .ad{background:rgba(13,51,32,.02);border:1.5px dashed rgba(13,51,32,.1);border-radius:9px;}
.ad span{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

/* Assignment card */
.asgn-card{padding:13px 15px;margin-bottom:7px;transition:border-color .13s,transform .1s;cursor:default;}
.dk .asgn-card{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.28);}
.lt .asgn-card{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.9);}
.dk .asgn-card:hover{border-color:rgba(20,255,180,.3);}
.lt .asgn-card:hover{border-color:var(--acc);}
.asgn-card.overdue{animation:due-pulse 2.5s ease-in-out infinite;}
.dk .asgn-card.overdue{border-color:rgba(255,107,107,.4) !important;background:rgba(255,107,107,.05);}
.lt .asgn-card.overdue{border-color:rgba(153,27,27,.35) !important;background:rgba(153,27,27,.04);}
.dk .asgn-card.done{opacity:.55;border-color:rgba(20,255,180,.12) !important;}
.lt .asgn-card.done{opacity:.55;}

/* Checkbox */
.chk{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all .15s;}
.dk .chk{border:1.5px solid var(--bdr);}
.lt .chk{border:1.5px solid var(--bdr);}
.dk .chk:hover{border-color:var(--acc);}
.lt .chk:hover{border-color:var(--acc);}
.dk .chk.checked{border-color:var(--acc);background:var(--acc);}
.lt .chk.checked{border-color:var(--acc);background:var(--acc);}

/* Priority dot */
.pri-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}

/* Stat card */
.stat-card{padding:14px 13px;text-align:center;flex:1;}
.dk .stat-card{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.28);}
.lt .stat-card{border:1.5px solid var(--bdr);border-radius:10px;background:var(--s1);}

/* Course chip */
.course-chip{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-family:'Fira Code',monospace;font-size:9px;font-weight:500;}

/* Progress bar */
.prog-track{height:5px;border-radius:3px;overflow:hidden;}
.dk .prog-track{background:rgba(20,255,180,.08);}
.lt .prog-track{background:rgba(13,51,32,.08);}
.prog-fill{height:100%;border-radius:3px;transition:width .6s cubic-bezier(.34,1.2,.64,1);}

/* Calendar day */
.cal-day{min-height:54px;padding:5px 7px;border-radius:3px;cursor:pointer;transition:border-color .12s;}
.dk .cal-day{border:1px solid var(--bdr);background:rgba(0,0,0,.2);}
.lt .cal-day{border:1.5px solid var(--bdr);border-radius:8px;background:rgba(245,251,248,.7);}
.dk .cal-day:hover{border-color:rgba(20,255,180,.3);}
.lt .cal-day:hover{border-color:var(--acc);}
.dk .cal-day.today{border-color:var(--acc) !important;background:rgba(20,255,180,.06);}
.lt .cal-day.today{border-color:var(--acc) !important;background:rgba(13,51,32,.05);}
.dk .cal-day.other-month{opacity:.3;}
.lt .cal-day.other-month{opacity:.3;}

/* Modal overlay */
.modal-overlay{position:fixed;inset:0;z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.65);backdrop-filter:blur(4px);}
.dk .modal{background:var(--s1);border:1px solid var(--bdr);border-radius:6px;width:100%;max-width:500px;padding:24px;}
.lt .modal{background:var(--s1);border:1.5px solid var(--bdr);border-radius:16px;width:100%;max-width:500px;padding:24px;box-shadow:0 8px 40px rgba(13,51,32,.18);}

.faq{padding:13px 15px;margin-bottom:8px;}
.dk .faq{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.25);}
.lt .faq{border:1.5px solid var(--bdr);border-radius:10px;}
`;

/* ── constants ── */
const PRIORITIES = {
  high:   {label:'High',   color:'#ff6b6b', dot:'#ff6b6b'},
  medium: {label:'Medium', color:'#fbbf24', dot:'#fbbf24'},
  low:    {label:'Low',    color:'#14ffb4', dot:'#14ffb4'},
};
const TYPES = ['Essay','Problem Set','Lab Report','Quiz Prep','Reading','Project','Presentation','Other'];
const COURSE_COLORS = ['#14ffb4','#a78bfa','#fbbf24','#fb923c','#38bdf8','#f472b6','#4ade80','#f87171'];

const today = () => new Date().toISOString().split('T')[0];
const todayDate = new Date(); todayDate.setHours(0,0,0,0);

function daysUntil(dateStr) {
  if(!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  d.setHours(0,0,0,0);
  return Math.round((d - todayDate) / 86400000);
}

function fmtDate(dateStr) {
  if(!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
}

let nextId = 100;
const mkId = () => ++nextId;

const SAMPLE_COURSES = [
  {id:1, name:'Calculus II',     code:'MATH201', color:'#14ffb4'},
  {id:2, name:'Intro to CS',     code:'CS101',   color:'#a78bfa'},
  {id:3, name:'English Lit',     code:'ENG204',  color:'#fbbf24'},
  {id:4, name:'Physics I',       code:'PHYS101', color:'#38bdf8'},
];

const SAMPLE_ASSIGNMENTS = [
  {id:1, title:'Problem Set 4',         course:1, type:'Problem Set',  priority:'high',   due: offsetDate(2),  done:false, weight:10, notes:'Chapters 7–9'},
  {id:2, title:'Essay Draft',           course:3, type:'Essay',        priority:'high',   due: offsetDate(3),  done:false, weight:20, notes:'2000 words on Romanticism'},
  {id:3, title:'Lab Report: Pendulum',  course:4, type:'Lab Report',   priority:'medium', due: offsetDate(6),  done:false, weight:15, notes:'Include error analysis'},
  {id:4, title:'Reading: Ch 12–14',     course:2, type:'Reading',      priority:'low',    due: offsetDate(1),  done:false, weight:5,  notes:''},
  {id:5, title:'Midterm prep',          course:1, type:'Quiz Prep',    priority:'high',   due: offsetDate(8),  done:false, weight:30, notes:'Past papers × 3'},
  {id:6, title:'CS Project milestone',  course:2, type:'Project',      priority:'medium', due: offsetDate(12), done:false, weight:25, notes:'Phase 1 submission'},
  {id:7, title:'Problem Set 3',         course:1, type:'Problem Set',  priority:'low',    due: offsetDate(-3), done:true,  weight:10, notes:''},
  {id:8, title:'Poetry analysis',       course:3, type:'Essay',        priority:'medium', due: offsetDate(-1), done:true,  weight:10, notes:''},
];

function offsetDate(days) {
  const d = new Date(); d.setDate(d.getDate()+days);
  return d.toISOString().split('T')[0];
}

const TABS = [
  {id:'dashboard',   label:'📊 Dashboard'},
  {id:'assignments', label:'📋 Assignments'},
  {id:'courses',     label:'🎓 Courses'},
  {id:'calendar',    label:'📅 Calendar'},
  {id:'guide',       label:'? Guide'},
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEKDAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

/* ════════════════════════════════════════════════════════════ */
export default function AssignmentTracker({isDarkMode:ext}={}) {
  const [dark, setDark]             = useState(ext!==undefined?ext:true);
  const cls = dark?'dk':'lt';
  const [tab, setTab]               = useState('dashboard');
  const [assignments, setAssignments] = useState(SAMPLE_ASSIGNMENTS);
  const [courses,     setCourses]     = useState(SAMPLE_COURSES);
  const [modal,       setModal]       = useState(null); // 'add-assign' | 'add-course' | 'edit-assign'
  const [editTarget,  setEditTarget]  = useState(null);
  const [filter,      setFilter]      = useState('all');  // all | pending | done | overdue
  const [sortBy,      setSortBy]      = useState('due');
  const [calMonth,    setCalMonth]    = useState(new Date().getMonth());
  const [calYear,     setCalYear]     = useState(new Date().getFullYear());
  const [search,      setSearch]      = useState('');

  /* blank form */
  const blankForm = () => ({title:'',course:courses[0]?.id||'',type:'Essay',priority:'medium',due:offsetDate(7),weight:'',notes:''});
  const [form, setForm] = useState(blankForm());

  /* ── derived ── */
  const pending  = assignments.filter(a=>!a.done);
  const done     = assignments.filter(a=> a.done);
  const overdue  = assignments.filter(a=>!a.done && daysUntil(a.due)<0);
  const dueToday = assignments.filter(a=>!a.done && daysUntil(a.due)===0);
  const dueSoon  = assignments.filter(a=>!a.done && daysUntil(a.due)>0 && daysUntil(a.due)<=3);

  const courseMap = useMemo(()=>{
    const m={};
    courses.forEach(c=>m[c.id]=c);
    return m;
  },[courses]);

  const filtered = useMemo(()=>{
    let list = assignments;
    if(filter==='pending') list = list.filter(a=>!a.done && daysUntil(a.due)>=0);
    if(filter==='done')    list = list.filter(a=> a.done);
    if(filter==='overdue') list = list.filter(a=>!a.done && daysUntil(a.due)<0);
    if(search) list = list.filter(a=>a.title.toLowerCase().includes(search.toLowerCase()) || courseMap[a.course]?.name.toLowerCase().includes(search.toLowerCase()));
    list = [...list].sort((a,b)=>{
      if(sortBy==='due')      return (a.due||'9999')>(b.due||'9999')?1:-1;
      if(sortBy==='priority') return ['high','medium','low'].indexOf(a.priority)-['high','medium','low'].indexOf(b.priority);
      if(sortBy==='course')   return (courseMap[a.course]?.name||'').localeCompare(courseMap[b.course]?.name||'');
      return 0;
    });
    return list;
  },[assignments, filter, sortBy, search, courseMap]);

  /* ── course stats ── */
  const courseStats = useMemo(()=> courses.map(c=>{
    const cas = assignments.filter(a=>a.course===c.id);
    const pend = cas.filter(a=>!a.done);
    const compl = cas.filter(a=>a.done);
    const weight = cas.reduce((s,a)=>s+Number(a.weight||0),0);
    return {...c, total:cas.length, pending:pend.length, completed:compl.length, weight};
  }),[courses,assignments]);

  /* ── toggle done ── */
  const toggleDone = (id) => setAssignments(as=>as.map(a=>a.id===id?{...a,done:!a.done}:a));

  /* ── delete ── */
  const deleteAssign = (id) => setAssignments(as=>as.filter(a=>a.id!==id));

  /* ── save form ── */
  const saveAssignment = () => {
    if(!form.title.trim()) return;
    if(editTarget) {
      setAssignments(as=>as.map(a=>a.id===editTarget?{...a,...form}:a));
    } else {
      setAssignments(as=>[...as,{...form,id:mkId(),done:false}]);
    }
    setModal(null); setEditTarget(null); setForm(blankForm());
  };

  const openEdit = (a) => { setEditTarget(a.id); setForm({...a}); setModal('add-assign'); };

  /* ── add course ── */
  const [courseForm, setCourseForm] = useState({name:'',code:'',color:COURSE_COLORS[0]});
  const saveCourse = () => {
    if(!courseForm.name.trim()) return;
    setCourses(cs=>[...cs,{...courseForm,id:mkId()}]);
    setModal(null); setCourseForm({name:'',code:'',color:COURSE_COLORS[0]});
  };

  /* ── calendar data ── */
  const calDays = useMemo(()=>{
    const first = new Date(calYear, calMonth, 1);
    const last  = new Date(calYear, calMonth+1, 0);
    const days = [];
    for(let i=0;i<first.getDay();i++) {
      const d = new Date(calYear, calMonth, -first.getDay()+i+1);
      days.push({date:d, thisMonth:false});
    }
    for(let i=1;i<=last.getDate();i++) days.push({date:new Date(calYear,calMonth,i), thisMonth:true});
    while(days.length%7!==0) {
      const d = new Date(calYear,calMonth+1,days.length-last.getDate()-first.getDay()+1);
      days.push({date:d, thisMonth:false});
    }
    return days;
  },[calMonth,calYear]);

  const assignsByDate = useMemo(()=>{
    const m={};
    assignments.forEach(a=>{
      if(!a.due) return;
      if(!m[a.due]) m[a.due]=[];
      m[a.due].push(a);
    });
    return m;
  },[assignments]);

  /* ── due urgency colour ── */
  const urgencyColor = (a) => {
    if(a.done) return 'var(--txm)';
    const d = daysUntil(a.due);
    if(d<0)  return 'var(--err)';
    if(d===0) return '#fb923c';
    if(d<=3)  return 'var(--warn)';
    return 'var(--acc)';
  };

  const urgencyLabel = (a) => {
    if(a.done) return 'Done';
    const d = daysUntil(a.due);
    if(d<0)  return `${Math.abs(d)}d overdue`;
    if(d===0) return 'Due today';
    if(d===1) return 'Due tomorrow';
    return `${d}d left`;
  };

  /* ── component: AssignmentRow ── */
  const AssignRow = ({a}) => {
    const course = courseMap[a.course];
    const uc = urgencyColor(a);
    const ul = urgencyLabel(a);
    return (
      <motion.div initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}} exit={{opacity:0,x:10}}
        className={`asgn-card${daysUntil(a.due)<0&&!a.done?' overdue':''}${a.done?' done':''}`}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {/* Checkbox */}
          <div className={`chk${a.done?' checked':''}`} onClick={()=>toggleDone(a.id)}>
            {a.done&&<svg width="11" height="9" viewBox="0 0 11 9" style={{animation:'check-pop .2s ease'}}>
              <polyline points="1,4.5 4,8 10,1" fill="none" stroke={dark?'#060a09':'#fff'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>}
          </div>

          {/* Priority dot */}
          <div className="pri-dot" style={{background:PRIORITIES[a.priority].dot}}/>

          {/* Title + meta */}
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
              <span style={{fontFamily:"'Outfit',sans-serif",fontSize:13.5,fontWeight:600,color:a.done?'var(--txm)':'var(--tx)',
                textDecoration:a.done?'line-through':'none'}}>{a.title}</span>
              {course&&(
                <span className="course-chip"
                  style={{background:`${course.color}18`,border:`1px solid ${course.color}44`,color:course.color}}>
                  {course.code||course.name}
                </span>
              )}
              <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,padding:'1px 6px',borderRadius:2,
                background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.06)',color:'var(--txm)'}}>
                {a.type}
              </span>
            </div>
            {a.notes&&<div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'var(--txm)',marginTop:2}}>{a.notes}</div>}
          </div>

          {/* Right: due + weight + actions */}
          <div style={{display:'flex',alignItems:'center',gap:12,flexShrink:0}}>
            {a.weight&&<span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--acc4)'}}>{a.weight}%</span>}
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:10,fontWeight:600,color:uc}}>{ul}</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:'var(--txm)'}}>{fmtDate(a.due)}</div>
            </div>
            <div style={{display:'flex',gap:4}}>
              <button onClick={()=>openEdit(a)}
                style={{width:26,height:26,display:'flex',alignItems:'center',justifyContent:'center',
                  border:'none',background:'transparent',cursor:'pointer',color:'var(--txm)',fontSize:13,borderRadius:3}}
                onMouseEnter={e=>e.currentTarget.style.color='var(--acc)'}
                onMouseLeave={e=>e.currentTarget.style.color='var(--txm)'}>✎</button>
              <button onClick={()=>deleteAssign(a.id)}
                style={{width:26,height:26,display:'flex',alignItems:'center',justifyContent:'center',
                  border:'none',background:'transparent',cursor:'pointer',color:'var(--txm)',fontSize:13,borderRadius:3,opacity:.6}}
                onMouseEnter={e=>{e.currentTarget.style.color='var(--err)';e.currentTarget.style.opacity='1';}}
                onMouseLeave={e=>{e.currentTarget.style.color='var(--txm)';e.currentTarget.style.opacity='.6';}}>✕</button>
            </div>
          </div>
        </div>
      </motion.div>
    );
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
              fontSize:17,borderRadius:dark?3:9,
              border:dark?'1px solid rgba(20,255,180,.35)':'none',
              background:dark?'rgba(20,255,180,.07)':'linear-gradient(135deg,#0d3320,#1a5c38)',
              boxShadow:dark?'0 0 16px rgba(20,255,180,.2)':'0 3px 10px rgba(13,51,32,.35)'}}>📋</div>
            <div>
              <div style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:16,color:'var(--tx)',lineHeight:1}}>
                Assignment<span style={{color:'var(--acc)'}}>Tracker</span>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--tx3)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #13 · {pending.length} pending · {overdue.length} overdue · {courses.length} courses
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          {/* quick stats */}
          <div style={{display:'flex',gap:6}}>
            {overdue.length>0&&(
              <div style={{display:'flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:dark?3:7,
                border:dark?'1px solid rgba(255,107,107,.3)':'1.5px solid rgba(153,27,27,.25)',
                background:dark?'rgba(255,107,107,.07)':'rgba(153,27,27,.05)'}}>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--err)'}}>⚠ {overdue.length} overdue</span>
              </div>
            )}
            {dueToday.length>0&&(
              <div style={{display:'flex',alignItems:'center',gap:5,padding:'3px 10px',borderRadius:dark?3:7,
                border:dark?'1px solid rgba(251,191,36,.3)':'1.5px solid rgba(146,64,14,.25)',
                background:dark?'rgba(251,191,36,.07)':'rgba(146,64,14,.05)'}}>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--warn)'}}>📅 {dueToday.length} today</span>
              </div>
            )}
          </div>
          <button onClick={()=>{setEditTarget(null);setForm(blankForm());setModal('add-assign');}}
            style={{display:'flex',alignItems:'center',gap:6,padding:'5px 13px',cursor:'pointer',
              fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:600,
              border:'none',borderRadius:dark?3:8,
              background:'var(--acc)',color:dark?'#060a09':'#fff',
              boxShadow:dark?'0 0 16px rgba(20,255,180,.25)':'0 3px 12px rgba(13,51,32,.22)'}}>
            + New assignment
          </button>
          <button onClick={()=>setDark(d=>!d)} style={{display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(20,255,180,.18)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer'}}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#b8ddc8',boxShadow:dark?'0 0 8px rgba(20,255,180,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#060a09':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)'}}>{dark?'VOID':'LIGHT'}</span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
          {TABS.map(t=>(
            <button key={t.id} className={`tab${tab===t.id?' on':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        <div className="body">
          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* Course filter */}
            <div>
              <div className="slbl">Filter by course</div>
              <button className={`gbtn${filter==='all'?' on':''}`} onClick={()=>setFilter('all')}
                style={{width:'100%',marginBottom:4,justifyContent:'flex-start'}}>All courses</button>
              {courses.map(c=>(
                <button key={c.id} className={`gbtn${filter===c.id?' on':''}`} onClick={()=>setFilter(c.id)}
                  style={{width:'100%',marginBottom:4,justifyContent:'flex-start',gap:7}}>
                  <span style={{width:8,height:8,borderRadius:'50%',background:c.color,flexShrink:0}}/>
                  {c.code||c.name}
                </button>
              ))}
              <button className="gbtn" onClick={()=>{setModal('add-course');}}
                style={{width:'100%',marginTop:2,justifyContent:'flex-start',fontSize:9,color:'var(--tx3)'}}>+ add course</button>
            </div>

            {/* Status filter */}
            <div>
              <div className="slbl">Status</div>
              {[['all','All'],['pending','Pending'],['overdue','Overdue'],['done','Completed']].map(([v,l])=>(
                <button key={v} className={`gbtn${filter===v?' on':''}`} onClick={()=>setFilter(v)}
                  style={{width:'100%',marginBottom:4,justifyContent:'flex-start'}}>{l}</button>
              ))}
            </div>

            {/* Upcoming */}
            <div>
              <div className="slbl">Due soon</div>
              {[...dueToday,...dueSoon].slice(0,5).map(a=>{
                const c = courseMap[a.course];
                return (
                  <div key={a.id} style={{padding:'6px 8px',marginBottom:4,borderRadius:dark?3:7,
                    border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                    background:'transparent'}}>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:600,color:'var(--tx)',lineHeight:1.3}}>{a.title}</div>
                    <div style={{display:'flex',justifyContent:'space-between',marginTop:2}}>
                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:c?.color||'var(--txm)'}}>{c?.code}</span>
                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:urgencyColor(a)}}>{urgencyLabel(a)}</span>
                    </div>
                  </div>
                );
              })}
              {dueToday.length===0&&dueSoon.length===0&&(
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'var(--txm)'}}>Nothing due in the next 3 days</div>
              )}
            </div>

            
          </div>

          {/* MAIN */}
          <div className="main">
            

            <AnimatePresence mode="wait">

              {/* ═══ DASHBOARD ═══ */}
              {tab==='dashboard'&&(
                <motion.div key="dash" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>

                  {/* Stat row */}
                  <div style={{display:'flex',gap:8}}>
                    {[
                      {label:'Pending',    val:pending.length,  color:'var(--acc)'},
                      {label:'Overdue',    val:overdue.length,  color:'var(--err)'},
                      {label:'Due today',  val:dueToday.length, color:'var(--warn)'},
                      {label:'Completed',  val:done.length,     color:'var(--txm)'},
                      {label:'Courses',    val:courses.length,  color:'var(--acc4)'},
                    ].map(s=>(
                      <div key={s.label} className="stat-card">
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:30,fontWeight:700,color:s.color,lineHeight:1}}>{s.val}</div>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:'var(--txm)',marginTop:3,textTransform:'uppercase',letterSpacing:'.1em'}}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Overall progress */}
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:15,fontWeight:700,color:'var(--tx)'}}>Overall completion</div>
                      <div style={{fontFamily:"'Fira Code',monospace",fontSize:13,color:'var(--acc)',fontWeight:500}}>
                        {assignments.length>0?Math.round(done.length/assignments.length*100):0}%
                      </div>
                    </div>
                    <div className="prog-track">
                      <div className="prog-fill" style={{width:`${assignments.length>0?done.length/assignments.length*100:0}%`,background:'var(--acc)'}}/>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',marginTop:5}}>
                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--acc)'}}>{done.length} done</span>
                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>{pending.length} remaining</span>
                    </div>
                  </div>

                  {/* Overdue alert */}
                  {overdue.length>0&&(
                    <div style={{padding:'14px 16px',borderRadius:dark?4:10,
                      border:dark?'1px solid rgba(255,107,107,.35)':'1.5px solid rgba(153,27,27,.3)',
                      background:dark?'rgba(255,107,107,.07)':'rgba(153,27,27,.05)'}}>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--err)',marginBottom:10}}>
                        ⚠ {overdue.length} overdue assignment{overdue.length>1?'s':''}
                      </div>
                      {overdue.map(a=>(
                        <div key={a.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 0',
                          borderBottom:dark?'1px solid rgba(255,107,107,.1)':'1px solid rgba(153,27,27,.1)'}}>
                          <div>
                            <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,color:'var(--tx)'}}>{a.title}</span>
                            <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--err)',marginLeft:8}}>{Math.abs(daysUntil(a.due))}d overdue</span>
                          </div>
                          <button onClick={()=>toggleDone(a.id)} className="gbtn" style={{fontSize:9,color:'var(--err)',borderColor:'rgba(255,107,107,.3)'}}>mark done</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Priority breakdown */}
                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>Priority breakdown</div>
                    {Object.entries(PRIORITIES).map(([key,p])=>{
                      const count = pending.filter(a=>a.priority===key).length;
                      const pct = pending.length>0 ? count/pending.length*100 : 0;
                      return (
                        <div key={key} style={{marginBottom:9}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                            <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:p.color,fontWeight:500}}>{p.label}</span>
                            <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--txm)'}}>{count} assignment{count!==1?'s':''}</span>
                          </div>
                          <div className="prog-track">
                            <div className="prog-fill" style={{width:`${pct}%`,background:p.dot}}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Upcoming 5 */}
                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)'}}>Upcoming assignments</div>
                      <button className="gbtn" onClick={()=>setTab('assignments')} style={{fontSize:9}}>view all →</button>
                    </div>
                    <AnimatePresence>
                      {pending.sort((a,b)=>(a.due||'9999')>(b.due||'9999')?1:-1).slice(0,5).map(a=><AssignRow key={a.id} a={a}/>)}
                    </AnimatePresence>
                    {pending.length===0&&<div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--txm)',textAlign:'center',padding:'20px 0'}}>🎉 All caught up!</div>}
                  </div>
                </motion.div>
              )}

              {/* ═══ ASSIGNMENTS ═══ */}
              {tab==='assignments'&&(
                <motion.div key="asgn" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'16px 18px'}}>
                    {/* Search + sort */}
                    <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
                      <input className="fi" value={search} onChange={e=>setSearch(e.target.value)}
                        placeholder="🔍 Search assignments…" style={{flex:1,minWidth:180,padding:'7px 11px',fontSize:12}}/>
                      <div style={{display:'flex',gap:4}}>
                        {[['due','Due date'],['priority','Priority'],['course','Course']].map(([v,l])=>(
                          <button key={v} className={`gbtn${sortBy===v?' on':''}`} onClick={()=>setSortBy(v)} style={{fontSize:9}}>{l}</button>
                        ))}
                      </div>
                      <button onClick={()=>{setEditTarget(null);setForm(blankForm());setModal('add-assign');}}
                        style={{padding:'6px 14px',borderRadius:dark?3:8,border:'none',cursor:'pointer',
                          fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:600,
                          background:'var(--acc)',color:dark?'#060a09':'#fff'}}>
                        + Add
                      </button>
                    </div>
                    {/* Status filter pills */}
                    <div style={{display:'flex',gap:5,marginBottom:14}}>
                      {[['all','All'],['pending','Pending'],['overdue','Overdue'],['done','Done']].map(([v,l])=>(
                        <button key={v} className={`gbtn${filter===v?' on':''}`} onClick={()=>setFilter(v)} style={{fontSize:9}}>{l}</button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {filtered.map(a=><AssignRow key={a.id} a={a}/>)}
                    </AnimatePresence>
                    {filtered.length===0&&(
                      <div style={{textAlign:'center',padding:'30px',fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--txm)'}}>
                        No assignments match this filter
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ═══ COURSES ═══ */}
              {tab==='courses'&&(
                <motion.div key="crs" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div style={{display:'flex',justifyContent:'flex-end'}}>
                    <button onClick={()=>setModal('add-course')}
                      style={{padding:'7px 16px',borderRadius:dark?3:8,border:'none',cursor:'pointer',
                        fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:600,
                        background:'var(--acc)',color:dark?'#060a09':'#fff',
                        boxShadow:dark?'0 0 14px rgba(20,255,180,.2)':'0 3px 10px rgba(13,51,32,.2)'}}>
                      + Add course
                    </button>
                  </div>
                  {courseStats.map(c=>{
                    const pct = c.total>0?Math.round(c.completed/c.total*100):0;
                    return (
                      <div key={c.id} className="panel" style={{padding:'18px 20px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:14}}>
                          <div style={{width:42,height:42,borderRadius:dark?4:10,display:'flex',alignItems:'center',justifyContent:'center',
                            fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:dark?'#060a09':'#fff',
                            background:c.color,flexShrink:0}}>
                            {(c.code||c.name).charAt(0)}
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>{c.name}</div>
                            <div style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--txm)'}}>{c.code}</div>
                          </div>
                          <div style={{display:'flex',gap:16,textAlign:'center'}}>
                            {[
                              {label:'Total',     val:c.total},
                              {label:'Pending',   val:c.pending,   color:'var(--warn)'},
                              {label:'Done',      val:c.completed, color:'var(--acc)'},
                            ].map(s=>(
                              <div key={s.label}>
                                <div style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:700,color:s.color||'var(--tx)',lineHeight:1}}>{s.val}</div>
                                <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',textTransform:'uppercase',letterSpacing:'.12em',marginTop:2}}>{s.label}</div>
                              </div>
                            ))}
                          </div>
                          <button onClick={()=>setCourses(cs=>cs.filter(x=>x.id!==c.id))}
                            style={{width:28,height:28,border:'none',background:'transparent',cursor:'pointer',
                              color:'var(--txm)',fontSize:14,borderRadius:3,opacity:.5}}
                            onMouseEnter={e=>{e.currentTarget.style.color='var(--err)';e.currentTarget.style.opacity='1';}}
                            onMouseLeave={e=>{e.currentTarget.style.color='var(--txm)';e.currentTarget.style.opacity='.5';}}>✕</button>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <div className="prog-track" style={{flex:1}}>
                            <div className="prog-fill" style={{width:`${pct}%`,background:c.color}}/>
                          </div>
                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:c.color,width:36,textAlign:'right'}}>{pct}%</span>
                        </div>
                        {/* assignments for this course */}
                        <div style={{marginTop:14}}>
                          {assignments.filter(a=>a.course===c.id).sort((a,b)=>(a.due||'9999')>(b.due||'9999')?1:-1).map(a=>(
                            <div key={a.id} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 0',
                              borderBottom:dark?'1px solid rgba(20,255,180,.05)':'1px solid var(--bdr)'}}>
                              <div className={`chk${a.done?' checked':''}`} style={{width:16,height:16}} onClick={()=>toggleDone(a.id)}>
                                {a.done&&<svg width="9" height="7" viewBox="0 0 11 9"><polyline points="1,4.5 4,8 10,1" fill="none" stroke={dark?'#060a09':'#fff'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                              <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:a.done?'var(--txm)':'var(--tx)',flex:1,
                                textDecoration:a.done?'line-through':'none'}}>{a.title}</span>
                              <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:urgencyColor(a)}}>{urgencyLabel(a)}</span>
                            </div>
                          ))}
                          {assignments.filter(a=>a.course===c.id).length===0&&(
                            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'var(--txm)',padding:'8px 0'}}>No assignments yet</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {courses.length===0&&(
                    <div className="panel" style={{padding:'50px',textAlign:'center'}}>
                      <div style={{fontSize:32,marginBottom:10,opacity:.4}}>🎓</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)',marginBottom:6}}>No courses yet</div>
                      <button onClick={()=>setModal('add-course')} style={{padding:'8px 20px',border:'none',borderRadius:dark?3:8,cursor:'pointer',
                        fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,background:'var(--acc)',color:dark?'#060a09':'#fff',marginTop:4}}>
                        Add your first course
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══ CALENDAR ═══ */}
              {tab==='calendar'&&(
                <motion.div key="cal" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'16px 18px'}}>
                    {/* Month nav */}
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                      <button className="gbtn" onClick={()=>{
                        if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}
                        else setCalMonth(m=>m-1);
                      }}>← prev</button>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--tx)'}}>
                        {MONTHS[calMonth]} {calYear}
                      </div>
                      <button className="gbtn" onClick={()=>{
                        if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}
                        else setCalMonth(m=>m+1);
                      }}>next →</button>
                    </div>
                    {/* Weekday headers */}
                    <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4,marginBottom:4}}>
                      {WEEKDAYS_SHORT.map(d=>(
                        <div key={d} style={{textAlign:'center',fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',
                          letterSpacing:'.1em',textTransform:'uppercase',padding:'3px 0'}}>{d}</div>
                      ))}
                    </div>
                    {/* Days grid */}
                    <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4}}>
                      {calDays.map(({date,thisMonth},i)=>{
                        const ds = date.toISOString().split('T')[0];
                        const asgns = assignsByDate[ds]||[];
                        const isToday = ds===today();
                        return (
                          <div key={i} className={`cal-day${isToday?' today':''}${!thisMonth?' other-month':''}`}>
                            <div style={{fontFamily:"'Fira Code',monospace",fontSize:10,
                              color:isToday?'var(--acc)':'var(--txm)',fontWeight:isToday?700:400,marginBottom:3}}>
                              {date.getDate()}
                            </div>
                            {asgns.slice(0,3).map(a=>{
                              const c=courseMap[a.course];
                              return (
                                <div key={a.id} style={{fontSize:9,padding:'1px 4px',borderRadius:2,marginBottom:2,
                                  fontFamily:"'Outfit',sans-serif",fontWeight:500,
                                  background:`${c?.color||'#14ffb4'}22`,color:c?.color||'var(--acc)',
                                  textDecoration:a.done?'line-through':'none',
                                  overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                                  {a.title}
                                </div>
                              );
                            })}
                            {asgns.length>3&&(
                              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)'}}>+{asgns.length-3}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Legend */}
                  <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                    {courses.map(c=>(
                      <div key={c.id} style={{display:'flex',alignItems:'center',gap:5}}>
                        <div style={{width:10,height:10,borderRadius:2,background:c.color}}/>
                        <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>{c.code||c.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ═══ GUIDE ═══ */}
              {tab==='guide'&&(
                <motion.div key="guide" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'22px 24px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
                      <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:18,border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',
                        background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.04)'}}>📖</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--tx)'}}>
                        How to use the Assignment Tracker
                      </div>
                    </div>
                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13.5,lineHeight:1.8,color:'var(--tx2)'}}>
                      <p style={{marginBottom:10}}>This tracker organises your academic workload across courses, priorities, and deadlines. Start by adding your courses, then add assignments with their due dates and weights. The dashboard gives you a live overview of what's urgent.</p>
                      <p>Use the <strong style={{color:'var(--tx)'}}>Calendar view</strong> to see your whole semester at a glance. Colour-coded chips show which course each assignment belongs to. Overdue items pulse red as a reminder to act quickly or mark them complete.</p>
                    </div>
                  </div>
                  <div className="panel" style={{padding:'18px 20px'}}>
                    {[
                      ['What does the weight field mean?','Weight is the percentage of your final course grade this assignment is worth. It helps you prioritise — a 30% midterm deserves more attention than a 5% homework. The Courses tab shows your total assigned weight per course.'],
                      ['How do overdue assignments work?','Any assignment with a past due date that is not marked done shows as overdue and pulses red. You can bulk-mark them done from the Dashboard alert, or update the due date if your instructor granted an extension.'],
                      ['Can I filter by course?','Yes — use the sidebar to filter by any individual course, or switch between All / Pending / Overdue / Done status views. The search bar in the Assignments tab also searches by title and course name simultaneously.'],
                      ['How do I use the Calendar?','The Calendar shows all assignments plotted on their due dates. Navigate months with the arrows. Each day cell shows up to 3 assignments — click a day to see all. Colour coding matches your course colours.'],
                    ].map(([q,a])=>(
                      <div key={q} className="faq">
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:13.5,fontWeight:600,color:'var(--tx)',marginBottom:5}}>{q}</div>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.75}}>{a}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
            
          </div>
        </div>

        {/* ══ MODALS ══ */}
        <AnimatePresence>
          {modal&&(
            <motion.div className="modal-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={e=>{if(e.target===e.currentTarget){setModal(null);setEditTarget(null);}}}>
              <motion.div className="modal" initial={{scale:.92,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.94,opacity:0}}>

                {/* Add / Edit Assignment */}
                {modal==='add-assign'&&(
                  <>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--tx)',marginBottom:18}}>
                      {editTarget?'Edit assignment':'New assignment'}
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:11}}>
                      <div>
                        <label className="lbl">Title</label>
                        <input className="fi" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Assignment title"/>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                        <div>
                          <label className="lbl">Course</label>
                          <select className="fi" value={form.course} onChange={e=>setForm(f=>({...f,course:Number(e.target.value)}))}>
                            {courses.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="lbl">Type</label>
                          <select className="fi" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                            {TYPES.map(t=><option key={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
                        <div>
                          <label className="lbl">Due date</label>
                          <input type="date" className="fi" value={form.due} onChange={e=>setForm(f=>({...f,due:e.target.value}))}
                            style={{fontFamily:"'Fira Code',monospace",fontSize:12}}/>
                        </div>
                        <div>
                          <label className="lbl">Priority</label>
                          <select className="fi" value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>
                            {Object.entries(PRIORITIES).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="lbl">Weight %</label>
                          <input type="number" className="fi" value={form.weight} placeholder="0–100"
                            onChange={e=>setForm(f=>({...f,weight:e.target.value}))}
                            style={{fontFamily:"'Fira Code',monospace",fontSize:13}}/>
                        </div>
                      </div>
                      <div>
                        <label className="lbl">Notes</label>
                        <textarea className="fi" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}
                          placeholder="Any extra notes…" rows={2} style={{resize:'none'}}/>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8,marginTop:18,justifyContent:'flex-end'}}>
                      <button className="gbtn" onClick={()=>{setModal(null);setEditTarget(null);}}>Cancel</button>
                      <button onClick={saveAssignment}
                        style={{padding:'7px 20px',borderRadius:dark?3:8,border:'none',cursor:'pointer',
                          fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:700,
                          background:'var(--acc)',color:dark?'#060a09':'#fff',
                          opacity:!form.title.trim()?.5:1}}>
                        {editTarget?'Save changes':'Add assignment'}
                      </button>
                    </div>
                  </>
                )}

                {/* Add Course */}
                {modal==='add-course'&&(
                  <>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--tx)',marginBottom:18}}>Add course</div>
                    <div style={{display:'flex',flexDirection:'column',gap:11}}>
                      <div>
                        <label className="lbl">Course name</label>
                        <input className="fi" value={courseForm.name} onChange={e=>setCourseForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Introduction to Psychology"/>
                      </div>
                      <div>
                        <label className="lbl">Course code (optional)</label>
                        <input className="fi" value={courseForm.code} onChange={e=>setCourseForm(f=>({...f,code:e.target.value}))} placeholder="e.g. PSY101"/>
                      </div>
                      <div>
                        <label className="lbl">Colour</label>
                        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:4}}>
                          {COURSE_COLORS.map(col=>(
                            <div key={col} onClick={()=>setCourseForm(f=>({...f,color:col}))}
                              style={{width:28,height:28,borderRadius:'50%',background:col,cursor:'pointer',
                                border:courseForm.color===col?`3px solid ${dark?'#e8fff8':'#071810'}`:'3px solid transparent',
                                boxShadow:courseForm.color===col?`0 0 0 2px ${col}`:'none',transition:'all .15s'}}/>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:8,marginTop:18,justifyContent:'flex-end'}}>
                      <button className="gbtn" onClick={()=>setModal(null)}>Cancel</button>
                      <button onClick={saveCourse}
                        style={{padding:'7px 20px',borderRadius:dark?3:8,border:'none',cursor:'pointer',
                          fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:700,
                          background:'var(--acc)',color:dark?'#060a09':'#fff',
                          opacity:!courseForm.name.trim()?.5:1}}>
                        Add course
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}