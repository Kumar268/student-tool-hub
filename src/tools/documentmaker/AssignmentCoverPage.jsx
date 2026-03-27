import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   ASSIGNMENT COVER PAGE MAKER — Document Tools Series #10
   Theme: Dark Midnight Ink / Gold Foil  ·  Light Parchment / Deep Navy
   Fonts: Cormorant Garamond · Raleway · Roboto Mono
   Aesthetic: Academic printing house — letterpress, gold rule, gravitas
   Templates: 8 distinct cover page designs
   Features: Live preview · Print/PDF · Logo upload · Emblem patterns
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Raleway:wght@300;400;500;600;700;800&family=Roboto+Mono:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Raleway',sans-serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes gold-glow{0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,.18)}50%{box-shadow:0 0 0 8px rgba(212,175,55,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(600%)}}
@keyframes fadeup{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}

.dk{
  --bg:#05060e;--s1:#080a17;--s2:#0c0f1e;--s3:#111428;
  --bdr:#1c2040;--bdr-hi:rgba(212,175,55,.28);
  --acc:#d4af37;--acc2:#b8962e;--acc3:#e8d5a0;--acc4:#7c9cbf;
  --tx:#f0ead8;--tx2:#9a8a60;--tx3:#1c2040;--txm:#30385a;
  --err:#f87171;--succ:#86efac;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 70% 40% at 50% -8%,rgba(212,175,55,.05),transparent),
    radial-gradient(ellipse 40% 50% at 90% 85%,rgba(124,156,191,.04),transparent);
}
.lt{
  --bg:#faf7f0;--s1:#ffffff;--s2:#f5f0e8;--s3:#ede5d0;
  --bdr:#d8ceb8;--bdr-hi:#1a2340;
  --acc:#1a2340;--acc2:#243050;--acc3:#8b7340;--acc4:#4a6a8a;
  --tx:#0e0c08;--tx2:#1a2340;--tx3:#d8ceb8;--txm:#6a6050;
  --err:#991b1b;--succ:#166534;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(26,35,64,.05),transparent);
}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(5,6,14,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(250,247,240,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(26,35,64,.07);}

.scanline{position:fixed;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(212,175,55,.3),transparent);
  animation:scan 5s linear infinite;pointer-events:none;z-index:999;}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 15px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'Raleway',sans-serif;font-size:11px;
  font-weight:600;letter-spacing:.05em;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--txm);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(212,175,55,.04);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#94a3b8;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(26,35,64,.04);font-weight:700;}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns:230px 1fr;min-height:calc(100vh - 86px);}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:14px 18px;display:flex;flex-direction:column;gap:14px;overflow-x:hidden;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:3px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(26,35,64,.05);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 22px;cursor:pointer;
  font-family:'Raleway',sans-serif;font-size:11.5px;font-weight:700;letter-spacing:.06em;transition:all .16s;border:none;}
.dk .btn{background:var(--acc);color:#05060e;border-radius:3px;animation:gold-glow 2.8s infinite;}
.dk .btn:hover{background:#e8c84a;transform:translateY(-1px);animation:none;box-shadow:0 0 28px rgba(212,175,55,.5);}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;animation:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:9px;box-shadow:0 4px 14px rgba(26,35,64,.28);}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;}

.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;
  font-family:'Raleway',sans-serif;font-size:10px;font-weight:600;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(212,175,55,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(26,35,64,.05);}

.fi{width:100%;outline:none;font-family:'Raleway',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;resize:vertical;}
.dk .fi{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(212,175,55,.1);}
.lt .fi{background:#faf7f0;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(26,35,64,.08);}
.fi::placeholder{opacity:.28;}

.lbl{font-family:'Raleway',sans-serif;font-size:9px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(212,175,55,.38);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(212,175,55,.25);}
.lt .slbl{color:var(--acc);}

.prog{height:3px;border-radius:2px;overflow:hidden;}
.dk .prog{background:rgba(212,175,55,.1);}
.lt .prog{background:rgba(26,35,64,.08);}
.prog-bar{height:100%;border-radius:2px;transition:width .4s;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(212,175,55,.01);border:1px dashed rgba(212,175,55,.09);border-radius:3px;}
.lt .ad{background:rgba(26,35,64,.015);border:1.5px dashed rgba(26,35,64,.1);border-radius:9px;}
.ad span{font-family:'Roboto Mono',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

/* TEMPLATE CARD */
.tpl-card{cursor:pointer;transition:all .18s;overflow:hidden;}
.dk .tpl-card{border:1px solid var(--bdr);border-radius:3px;}
.lt .tpl-card{border:1.5px solid var(--bdr);border-radius:10px;}
.tpl-card:hover{transform:translateY(-2px);}
.dk .tpl-card:hover{box-shadow:0 0 20px rgba(212,175,55,.14);}
.lt .tpl-card:hover{box-shadow:0 8px 28px rgba(26,35,64,.1);}
.tpl-card.active{border-color:var(--acc)!important;}

/* PREVIEW WRAPPER */
.preview-wrap{background:var(--s3);padding:24px;border-radius:4px;overflow:auto;}
.lt .preview-wrap{background:#c8c0b0;}

/* ═══ COVER PAGE TEMPLATES (inline styles for print) ═══ */
`;

/* ══ TEMPLATE DEFINITIONS ══ */
const TEMPLATES = [
  {id:'classic',     label:'Classic',      tag:'Centred serif · gold rules'},
  {id:'oxford',      label:'Oxford',       tag:'Left-aligned · navy border'},
  {id:'modern',      label:'Modern',       tag:'Split colour block'},
  {id:'minimal',     label:'Minimal',      tag:'Ultra clean · lots of space'},
  {id:'bold',        label:'Bold',         tag:'Large type · corner accent'},
  {id:'manuscript',  label:'Manuscript',   tag:'Handwritten feel · warm'},
  {id:'technical',   label:'Technical',    tag:'Grid lines · monospace'},
  {id:'elegant',     label:'Elegant',      tag:'Thin rules · italic accent'},
];

/* ══ EMBLEM PATTERNS ══ */
const EMBLEMS = {
  none:    null,
  shield:  `<svg viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 4L8 18V44C8 62 22 78 40 86C58 78 72 62 72 44V18L40 4Z" stroke="CLRTOKEN" stroke-width="2.5" fill="none"/><path d="M40 14L16 25V44C16 58 26 70 40 78C54 70 64 58 64 44V25L40 14Z" stroke="CLRTOKEN" stroke-width="1.5" fill="none" opacity=".5"/><line x1="40" y1="14" x2="40" y2="78" stroke="CLRTOKEN" stroke-width="1" opacity=".4"/><line x1="16" y1="44" x2="64" y2="44" stroke="CLRTOKEN" stroke-width="1" opacity=".4"/></svg>`,
  laurel:  `<svg viewBox="0 0 90 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 30 Q15 10 25 15 Q20 25 25 30 Q20 35 25 45 Q15 50 10 30Z" stroke="CLRTOKEN" stroke-width="1.5" fill="none"/><path d="M22 28 Q27 8 37 13 Q32 23 37 28 Q32 33 37 43 Q27 48 22 28Z" stroke="CLRTOKEN" stroke-width="1.5" fill="none"/><path d="M80 30 Q75 10 65 15 Q70 25 65 30 Q70 35 65 45 Q75 50 80 30Z" stroke="CLRTOKEN" stroke-width="1.5" fill="none"/><path d="M68 28 Q63 8 53 13 Q58 23 53 28 Q58 33 53 43 Q63 48 68 28Z" stroke="CLRTOKEN" stroke-width="1.5" fill="none"/><line x1="45" y1="48" x2="45" y2="55" stroke="CLRTOKEN" stroke-width="1.5"/><circle cx="45" cy="57" r="2" fill="CLRTOKEN"/></svg>`,
  star:    `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="40,5 49,30 75,30 54,48 62,73 40,57 18,73 26,48 5,30 31,30" stroke="CLRTOKEN" stroke-width="2" fill="none"/><circle cx="40" cy="40" r="12" stroke="CLRTOKEN" stroke-width="1.5" fill="none"/></svg>`,
  diamond: `<svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="35,4 66,35 35,66 4,35" stroke="CLRTOKEN" stroke-width="2" fill="none"/><polygon points="35,14 56,35 35,56 14,35" stroke="CLRTOKEN" stroke-width="1.5" fill="none" opacity=".5"/></svg>`,
  book:    `<svg viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="64" height="54" rx="3" stroke="CLRTOKEN" stroke-width="2" fill="none"/><line x1="40" y1="8" x2="40" y2="62" stroke="CLRTOKEN" stroke-width="2"/><line x1="8" y1="20" x2="38" y2="20" stroke="CLRTOKEN" stroke-width="1" opacity=".5"/><line x1="8" y1="30" x2="38" y2="30" stroke="CLRTOKEN" stroke-width="1" opacity=".5"/><line x1="8" y1="40" x2="38" y2="40" stroke="CLRTOKEN" stroke-width="1" opacity=".5"/><line x1="42" y1="20" x2="72" y2="20" stroke="CLRTOKEN" stroke-width="1" opacity=".5"/><line x1="42" y1="30" x2="72" y2="30" stroke="CLRTOKEN" stroke-width="1" opacity=".5"/><line x1="42" y1="40" x2="72" y2="40" stroke="CLRTOKEN" stroke-width="1" opacity=".5"/></svg>`,
};

const EMBLEM_LABELS = {none:'None',shield:'Shield',laurel:'Laurel',star:'Star',diamond:'Diamond',book:'Book'};

/* ══ BUILD HTML per template ══ */
function buildCover(d, tpl, logoDataUrl) {
  const safe = s => (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const emblSvg = d.emblem && d.emblem!=='none' && EMBLEMS[d.emblem]
    ? EMBLEMS[d.emblem].replace(/CLRTOKEN/g, tpl==='bold'||tpl==='modern'?'#fff':
        tpl==='technical'?'#00cc66':
        tpl==='manuscript'?'#8b6914':'#1a2340')
    : '';
  const logoHtml = logoDataUrl
    ? `<img src="${logoDataUrl}" style="max-height:70px;max-width:180px;object-fit:contain;margin-bottom:16px;" alt="logo"/>`
    : '';

  const templates = {
    classic: `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Raleway:wght@400;500;600&display=swap');
        body{font-family:'Cormorant Garamond',serif;background:white;color:#111;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}
        @media print{@page{margin:.65in}}
        .page{width:100%;max-width:680px;padding:60px 72px;text-align:center;}
        .rule{height:1.5px;background:#c8a828;margin:18px auto;}
        .rule-thin{height:.5px;background:#c8a828;margin:8px auto;}
        .institution{font-family:'Raleway',sans-serif;font-size:11px;font-weight:600;letter-spacing:.28em;text-transform:uppercase;color:#888;margin-bottom:6px;}
        .dept{font-family:'Raleway',sans-serif;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#aaa;margin-bottom:32px;}
        .title{font-size:28px;font-weight:600;line-height:1.3;color:#111;margin:20px 0 10px;}
        .subtitle{font-size:16px;font-style:italic;color:#555;margin-bottom:30px;}
        .meta{font-family:'Raleway',sans-serif;font-size:12px;color:#555;line-height:2;}
        .meta-label{font-size:9px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#aaa;display:block;}
        .course{font-size:13px;color:#888;margin-top:4px;letter-spacing:.06em;}
        .emblem{margin:20px auto 8px;display:flex;justify-content:center;}
      </style>
      <div class="page">
        ${logoHtml?`<div style="margin-bottom:12px">${logoHtml}</div>`:''}
        <div class="institution">${safe(d.institution||'University Name')}</div>
        ${d.department?`<div class="dept">${safe(d.department)}</div>`:'<div style="margin-bottom:32px"></div>'}
        <div class="rule" style="width:60%"></div>
        ${emblSvg?`<div class="emblem" style="width:72px;height:72px">${emblSvg}</div>`:''}
        <div class="title">${safe(d.title||'Assignment Title')}</div>
        ${d.subtitle?`<div class="subtitle">${safe(d.subtitle)}</div>`:''}
        <div class="rule" style="width:60%"></div>
        <div class="rule-thin" style="width:40%;margin-top:4px"></div>
        <div style="margin-top:32px"></div>
        <div class="meta">
          ${d.studentName?`<span class="meta-label">Submitted by</span>${safe(d.studentName)}<br>`:''}
          ${d.studentId?`<span class="meta-label">Student ID</span>${safe(d.studentId)}<br>`:''}
          ${d.course?`<span class="meta-label">Course</span>${safe(d.course)}<br>`:''}
          ${d.instructor?`<span class="meta-label">Instructor</span>${safe(d.instructor)}<br>`:''}
          ${d.date?`<span class="meta-label">Date</span>${safe(d.date)}`:''}
        </div>
      </div>`,

    oxford: `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Raleway:wght@400;500;600&display=swap');
        body{font-family:'Cormorant Garamond',serif;background:white;color:#111;margin:0;min-height:100vh;}
        @media print{@page{margin:.6in}}
        .page{padding:56px 64px;min-height:100vh;display:flex;flex-direction:column;border-left:6px solid #1a2340;margin-left:32px;}
        .institution{font-family:'Raleway',sans-serif;font-size:10.5px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#1a2340;margin-bottom:4px;}
        .dept{font-family:'Raleway',sans-serif;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#666;margin-bottom:48px;}
        .title{font-size:32px;font-weight:700;line-height:1.25;color:#111;margin-bottom:12px;max-width:480px;}
        .subtitle{font-size:16px;font-style:italic;color:#555;margin-bottom:8px;}
        .course{font-family:'Raleway',sans-serif;font-size:12px;color:#888;letter-spacing:.1em;margin-bottom:48px;}
        .divider{width:64px;height:3px;background:#1a2340;margin:24px 0;}
        .meta-row{font-family:'Raleway',sans-serif;font-size:12px;color:#444;margin-bottom:8px;display:flex;gap:16px;}
        .meta-key{font-size:9px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#1a2340;min-width:90px;}
        .spacer{flex:1}
        .footer{font-family:'Raleway',sans-serif;font-size:10px;color:#bbb;letter-spacing:.12em;text-transform:uppercase;}
      </style>
      <div class="page">
        ${logoHtml?`<div style="margin-bottom:16px">${logoHtml}</div>`:''}
        <div class="institution">${safe(d.institution||'University Name')}</div>
        ${d.department?`<div class="dept">${safe(d.department)}</div>`:'<div class="dept" style="opacity:0">—</div>'}
        ${emblSvg?`<div style="width:64px;height:64px;margin-bottom:16px">${emblSvg}</div>`:''}
        <div class="title">${safe(d.title||'Assignment Title')}</div>
        ${d.subtitle?`<div class="subtitle">${safe(d.subtitle)}</div>`:''}
        ${d.course?`<div class="course">${safe(d.course)}</div>`:''}
        <div class="divider"></div>
        ${d.studentName?`<div class="meta-row"><span class="meta-key">Student</span>${safe(d.studentName)}</div>`:''}
        ${d.studentId?`<div class="meta-row"><span class="meta-key">Student ID</span>${safe(d.studentId)}</div>`:''}
        ${d.instructor?`<div class="meta-row"><span class="meta-key">Instructor</span>${safe(d.instructor)}</div>`:''}
        ${d.wordCount?`<div class="meta-row"><span class="meta-key">Word Count</span>${safe(d.wordCount)}</div>`:''}
        ${d.date?`<div class="meta-row"><span class="meta-key">Date</span>${safe(d.date)}</div>`:''}
        <div class="spacer"></div>
        ${d.institution?`<div class="footer">${safe(d.institution)} · Academic Submission</div>`:''}
      </div>`,

    modern: `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&display=swap');
        body{font-family:'Raleway',sans-serif;background:white;color:#111;margin:0;min-height:100vh;}
        @media print{@page{margin:0}}
        .page{display:grid;grid-template-columns:200px 1fr;min-height:100vh;}
        .left{background:#1a2340;padding:40px 28px;display:flex;flex-direction:column;color:white;}
        .inst{font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:6px;}
        .dept{font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:32px;line-height:1.6;}
        .left-label{font-size:8px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:4px;margin-top:16px;}
        .left-val{font-size:11.5px;color:rgba(255,255,255,.8);line-height:1.6;}
        .spacer{flex:1}
        .right{padding:56px 52px;display:flex;flex-direction:column;justify-content:center;}
        .accent{width:48px;height:3px;background:#c8a828;margin-bottom:24px;}
        .title{font-size:30px;font-weight:800;line-height:1.2;color:#111;margin-bottom:14px;letter-spacing:-.01em;}
        .subtitle{font-size:15px;font-weight:300;color:#666;margin-bottom:32px;line-height:1.6;}
        .course-tag{display:inline-block;padding:5px 14px;background:#f0f0f0;font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#555;border-radius:2px;}
      </style>
      <div class="page">
        <div class="left">
          ${logoHtml?`<div style="margin-bottom:20px;filter:brightness(0) invert(1)">${logoHtml}</div>`:''}
          <div class="inst">${safe(d.institution||'University')}</div>
          ${d.department?`<div class="dept">${safe(d.department)}</div>`:''}
          ${emblSvg?`<div style="width:60px;height:60px;margin:8px 0;opacity:.8">${emblSvg.replace(/#1a2340/g,'rgba(255,255,255,.7)')}</div>`:''}
          <div class="spacer"></div>
          ${d.studentName?`<div class="left-label">Student</div><div class="left-val">${safe(d.studentName)}</div>`:''}
          ${d.studentId?`<div class="left-label">ID</div><div class="left-val">${safe(d.studentId)}</div>`:''}
          ${d.date?`<div class="left-label">Date</div><div class="left-val">${safe(d.date)}</div>`:''}
        </div>
        <div class="right">
          <div class="accent"></div>
          <div class="title">${safe(d.title||'Assignment Title')}</div>
          ${d.subtitle?`<div class="subtitle">${safe(d.subtitle)}</div>`:''}
          ${d.course?`<div class="course-tag">${safe(d.course)}</div>`:''}
          ${d.instructor?`<p style="margin-top:24px;font-size:12px;color:#888;">Submitted to: ${safe(d.instructor)}</p>`:''}
          ${d.wordCount?`<p style="font-size:11px;color:#aaa;margin-top:8px;">Word count: ${safe(d.wordCount)}</p>`:''}
        </div>
      </div>`,

    minimal: `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Raleway:wght@300;400;500&display=swap');
        body{font-family:'Cormorant Garamond',serif;background:white;color:#111;margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;}
        @media print{@page{margin:.9in}}
        .page{max-width:520px;padding:20px;}
        .title{font-size:30px;font-weight:300;line-height:1.3;color:#111;margin-bottom:10px;letter-spacing:.01em;}
        .subtitle{font-size:16px;font-style:italic;color:#888;margin-bottom:48px;}
        .rule{height:.5px;background:#ccc;margin:28px 0;}
        .meta{font-family:'Raleway',sans-serif;font-size:11.5px;color:#666;line-height:2.1;}
        .meta-key{font-size:9px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#bbb;display:inline-block;min-width:100px;}
        .inst{font-family:'Raleway',sans-serif;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#bbb;margin-top:48px;}
      </style>
      <div class="page">
        ${logoHtml?`<div style="margin-bottom:32px">${logoHtml}</div>`:''}
        ${emblSvg?`<div style="width:48px;height:48px;margin-bottom:20px;opacity:.4">${emblSvg.replace(/CLRTOKEN/g,'#333')}</div>`:''}
        <div class="title">${safe(d.title||'Assignment Title')}</div>
        ${d.subtitle?`<div class="subtitle">${safe(d.subtitle)}</div>`:'<div style="margin-bottom:48px"></div>'}
        <div class="rule"></div>
        <div class="meta">
          ${d.studentName?`<span class="meta-key">Name</span> ${safe(d.studentName)}<br>`:''}
          ${d.studentId?`<span class="meta-key">ID</span> ${safe(d.studentId)}<br>`:''}
          ${d.course?`<span class="meta-key">Course</span> ${safe(d.course)}<br>`:''}
          ${d.instructor?`<span class="meta-key">Instructor</span> ${safe(d.instructor)}<br>`:''}
          ${d.date?`<span class="meta-key">Date</span> ${safe(d.date)}<br>`:''}
          ${d.wordCount?`<span class="meta-key">Words</span> ${safe(d.wordCount)}`:''}
        </div>
        <div class="rule"></div>
        <div class="inst">${safe(d.institution||'')} ${d.department?'· '+safe(d.department):''}</div>
      </div>`,

    bold: `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;700;800;900&display=swap');
        body{font-family:'Raleway',sans-serif;background:white;color:#111;margin:0;min-height:100vh;overflow:hidden;}
        @media print{@page{margin:0}}
        .page{min-height:100vh;position:relative;padding:56px 64px;display:flex;flex-direction:column;}
        .corner{position:absolute;top:0;right:0;width:220px;height:220px;background:#c8a828;clip-path:polygon(100% 0,0 0,100% 100%);}
        .corner2{position:absolute;bottom:0;left:0;width:120px;height:120px;background:#f0f0f0;clip-path:polygon(0 0,0 100%,100% 100%);}
        .institution{font-size:9px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:#888;margin-bottom:4px;}
        .dept{font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#bbb;margin-bottom:56px;}
        .title{font-size:38px;font-weight:900;line-height:1.1;color:#111;margin-bottom:14px;letter-spacing:-.02em;max-width:72%;position:relative;z-index:1;}
        .subtitle{font-size:16px;font-weight:300;color:#666;margin-bottom:32px;max-width:60%;}
        .spacer{flex:1}
        .bar{height:4px;width:80px;background:#c8a828;margin-bottom:20px;}
        .meta{font-size:12px;color:#555;line-height:2;}
        .meta-key{font-size:8.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#aaa;display:block;}
      </style>
      <div class="page">
        <div class="corner"></div>
        <div class="corner2"></div>
        ${logoHtml?`<div style="margin-bottom:12px;position:relative;z-index:1">${logoHtml}</div>`:''}
        <div class="institution">${safe(d.institution||'University Name')}</div>
        ${d.department?`<div class="dept">${safe(d.department)}</div>`:'<div class="dept" style="opacity:0">—</div>'}
        ${emblSvg?`<div style="width:64px;height:64px;margin-bottom:12px;position:relative;z-index:1">${emblSvg}</div>`:''}
        <div class="title">${safe(d.title||'Assignment Title')}</div>
        ${d.subtitle?`<div class="subtitle">${safe(d.subtitle)}</div>`:''}
        <div class="spacer"></div>
        <div class="bar"></div>
        <div class="meta">
          ${d.studentName?`<span class="meta-key">Student</span>${safe(d.studentName)}<br>`:''}
          ${d.studentId?`<span class="meta-key">ID</span>${safe(d.studentId)}<br>`:''}
          ${d.course?`<span class="meta-key">Course</span>${safe(d.course)}<br>`:''}
          ${d.instructor?`<span class="meta-key">Instructor</span>${safe(d.instructor)}<br>`:''}
          ${d.date?`<span class="meta-key">Date</span>${safe(d.date)}`:''}
        </div>
      </div>`,

    manuscript: `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
        body{font-family:'Cormorant Garamond',serif;background:#fdf8f0;color:#2a1f0e;margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;}
        @media print{@page{margin:.75in}}
        .page{max-width:600px;padding:48px 60px;text-align:center;width:100%;}
        .ornament{font-size:28px;color:#8b6914;margin-bottom:16px;letter-spacing:.3em;}
        .institution{font-size:13px;font-style:italic;color:#8b6914;margin-bottom:4px;}
        .dept{font-size:11px;color:#a08040;margin-bottom:28px;}
        .title{font-size:32px;font-weight:700;line-height:1.3;color:#2a1f0e;margin:16px 0 12px;font-style:italic;}
        .subtitle{font-size:16px;color:#6a5020;margin-bottom:32px;font-style:italic;}
        .rule-fancy{text-align:center;font-size:18px;color:#c8a828;letter-spacing:.4em;margin:20px 0;}
        .meta{font-size:13.5px;color:#4a3818;line-height:2.1;}
        .meta-key{font-size:10px;font-style:italic;color:#8b6914;display:block;}
      </style>
      <div class="page">
        ${logoHtml?`<div style="margin-bottom:16px">${logoHtml}</div>`:''}
        ${emblSvg?`<div style="width:72px;height:72px;margin:0 auto 12px">${emblSvg}</div>`:''}
        <div class="ornament">✦ ✦ ✦</div>
        <div class="institution">${safe(d.institution||'University Name')}</div>
        ${d.department?`<div class="dept">${safe(d.department)}</div>`:''}
        <div class="rule-fancy">— ❦ —</div>
        <div class="title">${safe(d.title||'Assignment Title')}</div>
        ${d.subtitle?`<div class="subtitle">${safe(d.subtitle)}</div>`:''}
        <div class="rule-fancy">— ✦ —</div>
        <div style="margin-top:28px"></div>
        <div class="meta">
          ${d.studentName?`<span class="meta-key">Submitted by</span>${safe(d.studentName)}<br>`:''}
          ${d.studentId?`<span class="meta-key">Student ID</span>${safe(d.studentId)}<br>`:''}
          ${d.course?`<span class="meta-key">Course</span>${safe(d.course)}<br>`:''}
          ${d.instructor?`<span class="meta-key">Instructor</span>${safe(d.instructor)}<br>`:''}
          ${d.date?`<span class="meta-key">Date</span>${safe(d.date)}`:''}
        </div>
      </div>`,

    technical: `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;700&display=swap');
        body{font-family:'Roboto Mono',monospace;background:#0a0f0a;color:#00cc66;margin:0;min-height:100vh;}
        @media print{@page{margin:0}}
        .page{padding:48px 56px;min-height:100vh;display:flex;flex-direction:column;
          background-image:linear-gradient(rgba(0,204,102,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,204,102,.04) 1px,transparent 1px);
          background-size:24px 24px;}
        .sys{font-size:8px;font-weight:700;letter-spacing:.22em;color:rgba(0,204,102,.4);margin-bottom:4px;}
        .institution{font-size:10px;font-weight:500;letter-spacing:.14em;color:rgba(0,204,102,.7);margin-bottom:32px;}
        .bracket{font-size:11px;color:rgba(0,204,102,.4);font-weight:300;}
        .title{font-size:24px;font-weight:700;line-height:1.3;color:#00cc66;margin:16px 0 10px;letter-spacing:-.01em;word-break:break-word;}
        .subtitle{font-size:13px;font-weight:300;color:rgba(0,204,102,.6);margin-bottom:32px;}
        .divider{height:1px;background:rgba(0,204,102,.2);margin:24px 0;}
        .meta-row{font-size:11px;color:rgba(0,204,102,.6);margin-bottom:8px;display:flex;gap:12px;}
        .key{color:rgba(0,204,102,.35);min-width:110px;}
        .val{color:rgba(0,204,102,.8);}
        .spacer{flex:1}
        .footer{font-size:8px;letter-spacing:.2em;color:rgba(0,204,102,.25);}
      </style>
      <div class="page">
        ${logoHtml?`<div style="margin-bottom:16px;filter:hue-rotate(100deg) saturate(2) brightness(.8)">${logoHtml}</div>`:''}
        <div class="sys">// ACADEMIC SUBMISSION RECORD</div>
        <div class="institution">${safe(d.institution||'[INSTITUTION_NAME]')}</div>
        ${emblSvg?`<div style="width:56px;height:56px;margin-bottom:12px">${emblSvg}</div>`:''}
        <div class="bracket">/* ——————————————— */</div>
        <div class="title">${safe(d.title||'[ASSIGNMENT_TITLE]')}</div>
        ${d.subtitle?`<div class="subtitle">// ${safe(d.subtitle)}</div>`:''}
        <div class="bracket">/* ——————————————— */</div>
        <div class="divider"></div>
        ${d.course?`<div class="meta-row"><span class="key">module:</span><span class="val">${safe(d.course)}</span></div>`:''}
        ${d.studentName?`<div class="meta-row"><span class="key">student:</span><span class="val">${safe(d.studentName)}</span></div>`:''}
        ${d.studentId?`<div class="meta-row"><span class="key">id:</span><span class="val">${safe(d.studentId)}</span></div>`:''}
        ${d.instructor?`<div class="meta-row"><span class="key">supervisor:</span><span class="val">${safe(d.instructor)}</span></div>`:''}
        ${d.department?`<div class="meta-row"><span class="key">department:</span><span class="val">${safe(d.department)}</span></div>`:''}
        ${d.wordCount?`<div class="meta-row"><span class="key">word_count:</span><span class="val">${safe(d.wordCount)}</span></div>`:''}
        ${d.date?`<div class="meta-row"><span class="key">submitted:</span><span class="val">${safe(d.date)}</span></div>`:''}
        <div class="spacer"></div>
        <div class="footer">// END OF COVER PAGE — CONFIDENTIAL ACADEMIC DOCUMENT</div>
      </div>`,

    elegant: `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Raleway:wght@300;400;500&display=swap');
        body{font-family:'Cormorant Garamond',serif;background:white;color:#111;margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;}
        @media print{@page{margin:.8in}}
        .page{max-width:580px;width:100%;padding:20px;position:relative;}
        .outer-border{border:1px solid #ccc;padding:48px 52px;position:relative;}
        .inner-border{border:.5px solid #e0e0e0;padding:32px 36px;}
        .corner-tl,.corner-tr,.corner-bl,.corner-br{position:absolute;width:20px;height:20px;border-color:#c8a828;}
        .corner-tl{top:8px;left:8px;border-top:1.5px solid;border-left:1.5px solid;}
        .corner-tr{top:8px;right:8px;border-top:1.5px solid;border-right:1.5px solid;}
        .corner-bl{bottom:8px;left:8px;border-bottom:1.5px solid;border-left:1.5px solid;}
        .corner-br{bottom:8px;right:8px;border-bottom:1.5px solid;border-right:1.5px solid;}
        .institution{font-family:'Raleway',sans-serif;font-size:9.5px;font-weight:500;letter-spacing:.26em;text-transform:uppercase;color:#888;text-align:center;margin-bottom:4px;}
        .dept{font-size:11px;color:#aaa;text-align:center;font-style:italic;margin-bottom:24px;}
        .title{font-size:26px;font-weight:400;line-height:1.3;color:#111;margin:20px 0 10px;text-align:center;font-style:italic;}
        .subtitle{font-size:14px;color:#777;text-align:center;margin-bottom:24px;}
        .rule{height:.5px;background:linear-gradient(90deg,transparent,#c8a828,transparent);margin:16px 0;}
        .meta{font-size:12.5px;color:#555;line-height:2;text-align:center;}
        .meta-key{font-size:8.5px;font-family:'Raleway',sans-serif;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#bbb;display:block;}
      </style>
      <div class="page">
        <div class="outer-border">
          <div class="corner-tl"></div><div class="corner-tr"></div>
          <div class="corner-bl"></div><div class="corner-br"></div>
          <div class="inner-border">
            ${logoHtml?`<div style="text-align:center;margin-bottom:12px">${logoHtml}</div>`:''}
            ${emblSvg?`<div style="width:60px;height:60px;margin:0 auto 12px">${emblSvg.replace(/CLRTOKEN/g,'#c8a828')}</div>`:''}
            <div class="institution">${safe(d.institution||'University Name')}</div>
            ${d.department?`<div class="dept">${safe(d.department)}</div>`:''}
            <div class="rule"></div>
            <div class="title">${safe(d.title||'Assignment Title')}</div>
            ${d.subtitle?`<div class="subtitle">${safe(d.subtitle)}</div>`:''}
            <div class="rule"></div>
            <div class="meta">
              ${d.studentName?`<span class="meta-key">Submitted by</span>${safe(d.studentName)}<br>`:''}
              ${d.studentId?`<span class="meta-key">Student ID</span>${safe(d.studentId)}<br>`:''}
              ${d.course?`<span class="meta-key">Course</span>${safe(d.course)}<br>`:''}
              ${d.instructor?`<span class="meta-key">Instructor</span>${safe(d.instructor)}<br>`:''}
              ${d.date?`<span class="meta-key">Date</span>${safe(d.date)}`:''}
            </div>
          </div>
        </div>
      </div>`,
  };

  const body = templates[tpl] || templates.classic;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${safe(d.title||'Cover Page')}</title></head>
    <body>${body}<script>window.onload=()=>window.print()<\/script></body></html>`;
}

/* ═══ TABS ═══ */
const TABS = [
  {id:'info',      label:'📝 Details'},
  {id:'templates', label:'▦ Templates'},
  {id:'preview',   label:'◉ Preview'},
  {id:'guide',     label:'? Guide'},
];

const EMPTY = {
  title:'', subtitle:'', institution:'', department:'',
  studentName:'', studentId:'', course:'', instructor:'',
  date: new Date().toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}),
  wordCount:'', emblem:'none',
};

export default function AssignmentCoverPage() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';
  const [tab,  setTab]  = useState('info');
  const [tpl,  setTpl]  = useState('classic');
  const [data, setData] = useState({...EMPTY});
  const [logo, setLogo] = useState(null);
  const [copied, setCopied] = useState(false);

  const set = (k,v) => setData(p=>({...p,[k]:v}));

  const filled = [data.title, data.studentName, data.course].filter(Boolean).length;
  const pct = Math.round((filled/3)*100);

  const print = () => {
    const html = buildCover(data, tpl, logo);
    const w = window.open('','_blank');
    w.document.write(html); w.document.close();
  };

  const handleLogo = e => {
    const f = e.target.files?.[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ev => setLogo(ev.target.result);
    r.readAsDataURL(f);
  };

  /* THUMBNAIL */
  const Thumb = ({t}) => {
    const bgs = {
      classic:'white', oxford:'white', modern:'white',
      minimal:'white', bold:'white', manuscript:'#fdf8f0',
      technical:'#0a0f0a', elegant:'white',
    };
    const thumbContent = {
      classic: (
        <div style={{padding:'8px 10px',textAlign:'center',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <div style={{fontSize:'1.4em',color:'#888',letterSpacing:'.2em',marginBottom:4}}>UNIVERSITY</div>
          <div style={{width:'50%',height:1,background:'#c8a828',margin:'4px auto'}}/>
          <div style={{fontSize:'2em',fontFamily:'serif',fontWeight:600,color:'#111',margin:'4px 0',lineHeight:1.2}}>{data.title||'Title'}</div>
          <div style={{width:'50%',height:1,background:'#c8a828',margin:'4px auto'}}/>
          <div style={{fontSize:'1.2em',color:'#666',marginTop:4}}>{data.studentName||'Student Name'}</div>
        </div>
      ),
      oxford: (
        <div style={{display:'flex',height:'100%',borderLeft:'3px solid #1a2340',marginLeft:6,padding:'8px 10px',flexDirection:'column',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:'1.4em',fontWeight:700,letterSpacing:'.15em',color:'#1a2340',marginBottom:6}}>UNIVERSITY</div>
            <div style={{fontSize:'2em',fontFamily:'serif',fontWeight:700,color:'#111',lineHeight:1.2}}>{data.title||'Title'}</div>
          </div>
          <div style={{fontSize:'1.2em',color:'#666'}}>{data.studentName||'Student'}</div>
        </div>
      ),
      modern: (
        <div style={{display:'flex',height:'100%'}}>
          <div style={{width:'30%',background:'#1a2340',padding:'8px 7px',display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
            <div style={{fontSize:'1.1em',color:'rgba(255,255,255,.7)',lineHeight:1.5}}>{data.studentName||'Student'}</div>
          </div>
          <div style={{flex:1,padding:'10px 10px',display:'flex',flexDirection:'column',justifyContent:'center'}}>
            <div style={{width:20,height:2,background:'#c8a828',marginBottom:6}}/>
            <div style={{fontSize:'1.9em',fontWeight:800,color:'#111',lineHeight:1.1}}>{data.title||'Title'}</div>
          </div>
        </div>
      ),
      minimal: (
        <div style={{padding:'14px 12px',display:'flex',flexDirection:'column',justifyContent:'center',height:'100%'}}>
          <div style={{fontSize:'2.2em',fontFamily:'serif',fontWeight:300,color:'#111',lineHeight:1.2,marginBottom:8}}>{data.title||'Title'}</div>
          <div style={{height:.5,background:'#ddd',marginBottom:8}}/>
          <div style={{fontSize:'1.2em',color:'#888'}}>{data.studentName||'Name'}</div>
        </div>
      ),
      bold: (
        <div style={{height:'100%',position:'relative',padding:'10px 12px',display:'flex',flexDirection:'column',justifyContent:'space-between',overflow:'hidden'}}>
          <div style={{position:'absolute',top:0,right:0,width:50,height:50,background:'#c8a828',clipPath:'polygon(100% 0,0 0,100% 100%)'}}/>
          <div style={{fontSize:'1.4em',color:'#888',letterSpacing:'.12em'}}>UNIV.</div>
          <div style={{fontSize:'2.2em',fontWeight:900,color:'#111',lineHeight:1.1,letterSpacing:'-.02em'}}>{data.title||'Title'}</div>
          <div>
            <div style={{width:24,height:2,background:'#c8a828',marginBottom:4}}/>
            <div style={{fontSize:'1.2em',color:'#666'}}>{data.studentName||'Student'}</div>
          </div>
        </div>
      ),
      manuscript: (
        <div style={{padding:'8px 10px',textAlign:'center',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'#fdf8f0'}}>
          <div style={{fontSize:'1.6em',color:'#c8a828',letterSpacing:'.3em',marginBottom:4}}>✦ ✦ ✦</div>
          <div style={{fontSize:'1.4em',fontStyle:'italic',color:'#8b6914',marginBottom:6}}>University</div>
          <div style={{fontSize:'1.8em',fontFamily:'serif',fontStyle:'italic',fontWeight:600,color:'#2a1f0e',lineHeight:1.2}}>{data.title||'Title'}</div>
        </div>
      ),
      technical: (
        <div style={{padding:'8px 10px',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',background:'#0a0f0a',
          backgroundImage:'linear-gradient(rgba(0,204,102,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,204,102,.04) 1px,transparent 1px)',
          backgroundSize:'12px 12px'}}>
          <div style={{fontSize:'1.2em',color:'rgba(0,204,102,.4)',fontFamily:'monospace',marginBottom:4}}>// SUBMISSION</div>
          <div style={{fontSize:'1.9em',fontFamily:'monospace',fontWeight:700,color:'#00cc66',lineHeight:1.2}}>{data.title||'[TITLE]'}</div>
          <div style={{fontSize:'1.1em',fontFamily:'monospace',color:'rgba(0,204,102,.5)',marginTop:6}}>{data.studentName||'student'}</div>
        </div>
      ),
      elegant: (
        <div style={{padding:'8px 10px',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          border:'1px solid #ddd',margin:4,textAlign:'center'}}>
          <div style={{width:'60%',height:.5,background:'linear-gradient(90deg,transparent,#c8a828,transparent)',marginBottom:8}}/>
          <div style={{fontSize:'2em',fontFamily:'serif',fontStyle:'italic',color:'#111',lineHeight:1.2}}>{data.title||'Title'}</div>
          <div style={{width:'60%',height:.5,background:'linear-gradient(90deg,transparent,#c8a828,transparent)',marginTop:8,marginBottom:6}}/>
          <div style={{fontSize:'1.2em',color:'#888'}}>{data.studentName||'Name'}</div>
        </div>
      ),
    };
    return (
      <div style={{height:120,overflow:'hidden',background:bgs[t.id]||'white',fontSize:'27%',position:'relative',lineHeight:1.3}}>
        {thumbContent[t.id]||null}
        {tpl===t.id&&<div style={{position:'absolute',inset:0,background:'rgba(212,175,55,.06)',
          border:'2px solid #d4af37',pointerEvents:'none',display:'flex',alignItems:'flex-start',justifyContent:'flex-end',padding:4}}>
          <span style={{background:'#d4af37',color:'#05060e',fontFamily:'monospace',fontSize:9,fontWeight:700,padding:'1px 5px',borderRadius:1}}>✓</span>
        </div>}
      </div>
    );
  };

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
              fontSize:16,borderRadius:dark?3:9,
              border:dark?'1px solid rgba(212,175,55,.3)':'none',
              background:dark?'rgba(212,175,55,.08)':'linear-gradient(135deg,#1a2340,#243050)',
              boxShadow:dark?'0 0 16px rgba(212,175,55,.2)':'0 3px 10px rgba(26,35,64,.32)',
            }}>📄</div>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,color:'var(--tx)',lineHeight:1}}>
                Assignment <span style={{color:'var(--acc)'}}>Cover Page</span>
                <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #10 · 8 templates · logo upload · print/pdf
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          <div style={{width:90}}>
            <div className="prog"><div className="prog-bar" style={{width:`${pct}%`}}/></div>
            <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:8,color:'var(--txm)',textAlign:'right',marginTop:3}}>{pct}% filled</div>
          </div>
          <button className="btn" onClick={print} style={{padding:'6px 16px',fontSize:11,animation:'none'}}>
            🖨 Print PDF
          </button>
          <button onClick={()=>setDark(d=>!d)} style={{
            display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(212,175,55,.2)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer',
          }}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#d8ceb8',
              boxShadow:dark?'0 0 8px rgba(212,175,55,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#05060e':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:8.5,color:'var(--txm)'}}>{dark?'VOID':'LITE'}</span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        <div className="body">
          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* Template quick-pick */}
            <div>
              <div className="slbl">Template</div>
              {TEMPLATES.map(t=>(
                <button key={t.id} onClick={()=>setTpl(t.id)} style={{
                  width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',
                  padding:'6px 9px',marginBottom:3,cursor:'pointer',
                  border:tpl===t.id?`1px solid var(--acc)`:(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                  borderRadius:dark?3:7,
                  background:tpl===t.id?(dark?'rgba(212,175,55,.05)':'rgba(26,35,64,.04)'):'transparent',
                }}>
                  <div>
                    <div style={{fontFamily:"'Raleway',sans-serif",fontSize:11.5,fontWeight:700,
                      color:tpl===t.id?'var(--acc)':'var(--tx)'}}>{t.label}</div>
                    <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:7.5,color:'var(--txm)',marginTop:1}}>{t.tag}</div>
                  </div>
                  {tpl===t.id&&<span style={{fontSize:10,color:'var(--acc)'}}>✓</span>}
                </button>
              ))}
            </div>

            {/* Emblem */}
            <div>
              <div className="slbl">Emblem</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {Object.keys(EMBLEM_LABELS).map(k=>(
                  <button key={k} className={`gbtn ${data.emblem===k?'on':''}`}
                    onClick={()=>set('emblem',k)} style={{padding:'4px 8px',fontSize:9}}>
                    {EMBLEM_LABELS[k]}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo */}
            <div>
              <div className="slbl">Institution Logo</div>
              <label style={{
                display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                padding:'12px',cursor:'pointer',gap:5,
                border:dark?'1px dashed rgba(212,175,55,.2)':'1.5px dashed rgba(26,35,64,.2)',
                borderRadius:dark?3:8,background:'transparent',
              }}>
                {logo
                  ? <img src={logo} style={{maxHeight:48,maxWidth:'100%',objectFit:'contain',borderRadius:3}} alt="logo"/>
                  : <span style={{fontFamily:"'Roboto Mono',monospace",fontSize:9,color:'var(--txm)',textAlign:'center'}}>⬆ Upload logo<br/>PNG / JPG / SVG</span>
                }
                <input type="file" accept="image/*" style={{display:'none'}} onChange={handleLogo}/>
              </label>
              {logo&&<button className="gbtn" onClick={()=>setLogo(null)} style={{marginTop:5,width:'100%',justifyContent:'center',fontSize:9}}>✕ Remove logo</button>}
            </div>

            <div>
              <div className="slbl">Export</div>
              <button className="gbtn" onClick={print} style={{width:'100%',justifyContent:'flex-start',padding:'7px 10px'}}>
                🖨 Print / Save as PDF
              </button>
            </div>

            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ╔══ DETAILS ══╗ */}
              {tab==='info'&&(
                <motion.div key="info" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Assignment</div>
                    <div style={{display:'flex',flexDirection:'column',gap:9}}>
                      <div>
                        <label className="lbl">Assignment / Paper Title *</label>
                        <input className="fi" placeholder="The Effect of Social Media on Adolescent Mental Health: A Critical Review"
                          value={data.title||''} onChange={e=>set('title',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Subtitle / Type (optional)</label>
                        <input className="fi" placeholder="Essay · Research Paper · Coursework · Dissertation · Report"
                          value={data.subtitle||''} onChange={e=>set('subtitle',e.target.value)}/>
                      </div>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                        <div>
                          <label className="lbl">Course / Module</label>
                          <input className="fi" placeholder="PSYC3021 · BSc Psychology" value={data.course||''} onChange={e=>set('course',e.target.value)}/>
                        </div>
                        <div>
                          <label className="lbl">Word Count (optional)</label>
                          <input className="fi" placeholder="2,450 words" value={data.wordCount||''} onChange={e=>set('wordCount',e.target.value)}/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Student</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      <div>
                        <label className="lbl">Full Name *</label>
                        <input className="fi" placeholder="Jane Elizabeth Smith" value={data.studentName||''} onChange={e=>set('studentName',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Student ID</label>
                        <input className="fi" placeholder="20241234" value={data.studentId||''} onChange={e=>set('studentId',e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  <div className="panel" style={{padding:'15px 17px'}}>
                    <div className="lbl" style={{marginBottom:11,fontSize:10}}>Institution</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                      <div>
                        <label className="lbl">Institution / University</label>
                        <input className="fi" placeholder="University of Edinburgh" value={data.institution||''} onChange={e=>set('institution',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Department / School</label>
                        <input className="fi" placeholder="School of Psychology" value={data.department||''} onChange={e=>set('department',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Instructor / Supervisor</label>
                        <input className="fi" placeholder="Dr. Sarah Williams" value={data.instructor||''} onChange={e=>set('instructor',e.target.value)}/>
                      </div>
                      <div>
                        <label className="lbl">Submission Date</label>
                        <input className="fi" value={data.date||''} onChange={e=>set('date',e.target.value)}/>
                      </div>
                    </div>
                  </div>

                  <div style={{display:'flex',gap:9}}>
                    <button className="btn" onClick={()=>setTab('templates')}>VIEW TEMPLATES →</button>
                    <button className="btn" onClick={print} style={{animation:'none',
                      background:dark?'transparent':'transparent',
                      color:'var(--acc)',border:`1px solid ${dark?'rgba(212,175,55,.3)':'rgba(26,35,64,.3)'}`,
                      boxShadow:'none'}}>
                      🖨 Print Now
                    </button>
                  </div>

                  
                </motion.div>
              )}

              {/* ╔══ TEMPLATES ══╗ */}
              {tab==='templates'&&(
                <motion.div key="templates" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:11}}>
                    {TEMPLATES.map(t=>(
                      <motion.div key={t.id} whileHover={{y:-3}}
                        className={`tpl-card ${tpl===t.id?'active':''}`}
                        onClick={()=>setTpl(t.id)}>
                        <Thumb t={t}/>
                        <div style={{padding:'9px 11px',
                          borderTop:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          background:tpl===t.id?(dark?'rgba(212,175,55,.04)':'rgba(26,35,64,.04)'):(dark?'var(--s2)':'var(--s1)')}}>
                          <div style={{fontFamily:"'Raleway',sans-serif",fontSize:12,fontWeight:700,
                            color:tpl===t.id?'var(--acc)':'var(--tx)'}}>{t.label}</div>
                          <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:7.5,color:'var(--txm)',marginTop:1}}>{t.tag}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div style={{display:'flex',gap:9,marginTop:4}}>
                    <button className="btn" onClick={print}>🖨 Print Selected Template</button>
                    <button className="gbtn" onClick={()=>setTab('preview')}>◉ Preview →</button>
                  </div>

                  
                </motion.div>
              )}

              {/* ╔══ PREVIEW ══╗ */}
              {tab==='preview'&&(
                <motion.div key="preview" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div style={{display:'flex',gap:9,flexWrap:'wrap',alignItems:'center'}}>
                    <button className="btn" onClick={print}>🖨 Print / Save PDF</button>
                    <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:9.5,color:'var(--txm)'}}>
                      Template: <span style={{color:'var(--acc)'}}>{TEMPLATES.find(t=>t.id===tpl)?.label}</span>
                    </div>
                  </div>

                  <div className="preview-wrap">
                    <div style={{maxWidth:680,margin:'0 auto',background:'white',
                      boxShadow:'0 8px 48px rgba(0,0,0,.35)',minHeight:480,overflow:'hidden'}}>
                      <iframe
                        srcDoc={buildCover(data,tpl,logo).replace('<script>window.onload=()=>window.print()<\/script>','')}
                        style={{width:'100%',height:520,border:'none',display:'block'}}
                        title="Cover page preview"
                      />
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ╔══ GUIDE ══╗ */}
              {tab==='guide'&&(
                <motion.div key="guide" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:'var(--tx)',marginBottom:4}}>
                      Choosing the right cover page
                    </div>
                    <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:9,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginBottom:18}}>
                      template guide · all disciplines
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
                      {[
                        {t:'Classic',     b:'Safe choice for any assignment. Centred layout with gold rules. Suits humanities, law, business.'},
                        {t:'Oxford',      b:'Left-aligned with a strong navy left border. Confident and structured. Good for essays, dissertations.'},
                        {t:'Modern',      b:'Split panel with coloured sidebar. Tech, design, business. Stands out while remaining professional.'},
                        {t:'Minimal',     b:'Maximum white space, thin typography. Design, architecture, fine arts. Feels contemporary.'},
                        {t:'Bold',        b:'Large type, corner accent, strong hierarchy. Marketing, communications, creative disciplines.'},
                        {t:'Manuscript',  b:'Warm parchment, ornamental flourishes. Literature, history, philosophy. Feels scholarly and crafted.'},
                        {t:'Technical',   b:'Dark background, monospace, grid lines. Computer science, engineering, software projects.'},
                        {t:'Elegant',     b:'Double border, gold gradient rules. Formal, refined. Suitable for submissions that need gravitas.'},
                      ].map(({t,b})=>(
                        <div key={t} style={{padding:'10px 12px',borderRadius:dark?3:9,
                          border:tpl===t.toLowerCase()?`1px solid var(--acc)`:(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                          background:tpl===t.toLowerCase()?(dark?'rgba(212,175,55,.04)':'rgba(26,35,64,.03)'):'transparent'}}>
                          <div style={{fontFamily:"'Raleway',sans-serif",fontSize:12,fontWeight:700,color:'var(--acc)',marginBottom:4}}>{t}</div>
                          <div style={{fontFamily:"'Raleway',sans-serif",fontSize:12.5,color:'var(--tx2)',lineHeight:1.6}}>{b}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:700,color:'var(--tx)',marginBottom:10}}>
                      What to include
                    </div>
                    {[
                      {f:'Title',        r:true,  t:'The full title of your assignment as it appears in the brief. Avoid abbreviations.'},
                      {f:'Your name',    r:true,  t:'Your legal full name as registered with your institution.'},
                      {f:'Course/Module',r:true,  t:'The module code and name. Many instructors sort by course first.'},
                      {f:'Student ID',   r:false, t:'Often required — check your institution\'s submission guidelines.'},
                      {f:'Instructor',   r:false, t:'Include "Dr." / "Prof." as appropriate. Shows attention to detail.'},
                      {f:'Word count',   r:false, t:'Include if your assignment has a word limit. Shows you tracked it.'},
                      {f:'Date',         r:true,  t:'The submission date, not the date you started writing.'},
                    ].map(({f,r,t})=>(
                      <div key={f} style={{display:'flex',gap:10,marginBottom:7,padding:'7px 10px',borderRadius:dark?2:7,
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        background:dark?'rgba(0,0,0,.15)':'rgba(250,247,240,.8)'}}>
                        <span style={{fontFamily:"'Raleway',sans-serif",fontSize:12,fontWeight:700,
                          color:r?'var(--acc)':'var(--txm)',minWidth:110,flexShrink:0}}>{f}{r?' *':''}</span>
                        <span style={{fontFamily:"'Raleway',sans-serif",fontSize:12.5,color:'var(--tx2)',lineHeight:1.6}}>{t}</span>
                      </div>
                    ))}
                    <div style={{fontFamily:"'Roboto Mono',monospace",fontSize:9,color:'var(--txm)',marginTop:8}}>* Recommended for all submissions</div>
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