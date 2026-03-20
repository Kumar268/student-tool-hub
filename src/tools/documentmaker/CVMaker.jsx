import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   CV MAKER — Document Tools Series #2
   Theme: Dark Deep Space / Electric Indigo · Light Alabaster / Cobalt
   Fonts: Playfair Display · Inter · IBM Plex Mono
   AI: Anthropic streaming
   Templates: 5 academic styles
   Sections: Personal, Research Interests, Education, Experience,
             Publications, Presentations, Awards, Skills, Languages,
             References
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@300;400;500&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Inter',sans-serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes glow-in{0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,.18)}50%{box-shadow:0 0 0 8px rgba(99,102,241,0)}}
@keyframes pulse-ring{0%{transform:scale(1);opacity:.6}70%{transform:scale(1.12);opacity:0}100%{transform:scale(1);opacity:0}}
@keyframes drift{0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-3px) rotate(.5deg)}66%{transform:translateY(2px) rotate(-.4deg)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(600%)}}

.dk{
  --bg:#07060f;--s1:#0c0b17;--s2:#100f1e;--s3:#171629;
  --bdr:#1e1c38;--bdr-hi:rgba(99,102,241,.3);
  --acc:#6366f1;--acc2:#818cf8;--acc3:#c084fc;--acc4:#38bdf8;
  --tx:#eeeeff;--tx2:#9d9dc8;--tx3:#1e1c38;--txm:#4a4870;
  --err:#f87171;--warn:#fbbf24;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 70% 40% at 50% -5%,rgba(99,102,241,.06),transparent),
    radial-gradient(ellipse 50% 60% at 90% 90%,rgba(192,132,252,.04),transparent),
    radial-gradient(ellipse 30% 40% at 10% 60%,rgba(56,189,248,.03),transparent);
}
.lt{
  --bg:#f8f9ff;--s1:#ffffff;--s2:#f0f1fc;--s3:#e4e6f8;
  --bdr:#c7c9e8;--bdr-hi:#3730a3;
  --acc:#3730a3;--acc2:#4338ca;--acc3:#7c3aed;--acc4:#0369a1;
  --tx:#1e1b4b;--tx2:#4338ca;--tx3:#c7c9e8;--txm:#6366f1;
  --err:#b91c1c;--warn:#92400e;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(55,48,163,.05),transparent);
}

/* ── TOPBAR ── */
.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(7,6,15,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(248,249,255,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(55,48,163,.07);}

.scanline{position:fixed;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(99,102,241,.35),transparent);
  animation:scan 5s linear infinite;pointer-events:none;z-index:999;}

/* ── TABS ── */
.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.tab{height:40px;padding:0 15px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'Inter',sans-serif;font-size:11px;
  font-weight:500;letter-spacing:.04em;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.dk .tab{color:var(--txm);}
.dk .tab.on{color:var(--acc2);border-bottom-color:var(--acc);background:rgba(99,102,241,.05);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#94a3b8;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(55,48,163,.04);font-weight:600;}
.lt .tab:hover:not(.on){color:var(--tx2);}

/* ── LAYOUT ── */
.body{display:grid;grid-template-columns:222px 1fr;min-height:calc(100vh - 86px);}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:14px 18px;display:flex;flex-direction:column;gap:14px;overflow-x:hidden;}

/* ── PANEL ── */
.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(55,48,163,.05);}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 22px;cursor:pointer;
  font-family:'Inter',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.04em;transition:all .16s;border:none;}
.dk .btn{background:var(--acc);color:#fff;border-radius:3px;animation:glow-in 2.8s infinite;}
.dk .btn:hover{background:var(--acc2);transform:translateY(-1px);animation:none;box-shadow:0 0 28px rgba(99,102,241,.55);}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;animation:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:8px;box-shadow:0 4px 14px rgba(55,48,163,.28);}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);box-shadow:0 8px 24px rgba(55,48,163,.38);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;}
.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;
  font-family:'Inter',sans-serif;font-size:10px;font-weight:500;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc2);background:rgba(99,102,241,.06);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(55,48,163,.05);}

/* ── INPUTS ── */
.fi{width:100%;outline:none;font-family:'Inter',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;resize:vertical;}
.dk .fi{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(99,102,241,.12);}
.lt .fi{background:#f8f9ff;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(55,48,163,.09);}
.fi::placeholder{opacity:.3;}

/* ── ACCORDION ── */
.acc-wrap{margin-bottom:10px;}
.acc-head{width:100%;display:flex;justify-content:space-between;align-items:center;
  padding:11px 15px;background:transparent;border:none;cursor:pointer;transition:background .13s;}
.dk .acc-head{border-bottom:1px solid var(--bdr);}
.lt .acc-head{border-bottom:1.5px solid var(--bdr);}
.dk .acc-head:hover{background:rgba(99,102,241,.03);}
.lt .acc-head:hover{background:rgba(55,48,163,.025);}
.acc-title{font-family:'Playfair Display',serif;font-size:14px;font-weight:600;color:var(--tx);}
.acc-badge{font-family:'IBM Plex Mono',monospace;font-size:9px;padding:1px 6px;border-radius:99px;margin-left:7px;}
.dk .acc-badge{background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.25);color:var(--acc2);}
.lt .acc-badge{background:rgba(55,48,163,.08);border:1.5px solid rgba(55,48,163,.18);color:var(--acc);}
.acc-body{padding:13px 15px 15px;}

/* ── ENTRY CARD ── */
.ec{padding:13px 14px;margin-bottom:10px;position:relative;}
.dk .ec{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.35);}
.lt .ec{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(248,249,255,.8);}
.dk .ec::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;
  background:linear-gradient(180deg,var(--acc),var(--acc3));border-radius:2px 0 0 2px;opacity:.6;}

/* ── CITATION CHIP (publications) ── */
.cit{font-family:'IBM Plex Mono',monospace;font-size:9px;padding:2px 7px;border-radius:2px;margin-right:5px;vertical-align:middle;}
.dk .cit{background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);color:var(--acc2);}
.lt .cit{background:rgba(55,48,163,.07);border:1.5px solid rgba(55,48,163,.14);color:var(--acc);}

/* ── AI OUTPUT ── */
.ai-box{font-family:'IBM Plex Mono',monospace;font-size:12px;line-height:1.78;
  padding:15px 17px;min-height:60px;white-space:pre-wrap;word-break:break-word;}
.dk .ai-box{color:#a5b4fc;background:rgba(0,0,0,.55);border:1px solid rgba(99,102,241,.14);border-radius:4px;}
.lt .ai-box{color:#1e1b4b;background:#eef0fc;border:1.5px solid rgba(55,48,163,.14);border-radius:10px;}
.cur{display:inline-block;width:7px;height:13px;background:var(--acc2);
  animation:blink .7s infinite;vertical-align:text-bottom;margin-left:1px;}

/* ── LABELS ── */
.lbl{font-family:'Inter',sans-serif;font-size:9px;font-weight:600;letter-spacing:.22em;
  text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(99,102,241,.5);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'IBM Plex Mono',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(99,102,241,.35);}
.lt .slbl{color:var(--acc);}

/* ── STAR RATING (impact) ── */
.star{cursor:pointer;font-size:14px;transition:transform .1s;}
.star:hover{transform:scale(1.3);}

/* ── TEMPLATE CARD ── */
.tpl-card{cursor:pointer;transition:all .18s;overflow:hidden;}
.dk .tpl-card{border:1px solid var(--bdr);border-radius:4px;}
.lt .tpl-card{border:1.5px solid var(--bdr);border-radius:12px;}
.tpl-card:hover{transform:translateY(-2px);}
.dk .tpl-card:hover{box-shadow:0 0 22px rgba(99,102,241,.18);}
.lt .tpl-card:hover{box-shadow:0 8px 28px rgba(55,48,163,.12);}
.tpl-card.active{border-color:var(--acc)!important;}
.dk .tpl-card.active{box-shadow:0 0 28px rgba(99,102,241,.22);}

/* ── AD ── */
.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(99,102,241,.01);border:1px dashed rgba(99,102,241,.1);border-radius:3px;}
.lt .ad{background:rgba(55,48,163,.02);border:1.5px dashed rgba(55,48,163,.1);border-radius:9px;}
.ad span{font-family:'IBM Plex Mono',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

/* ── PROGRESS ── */
.prog{height:3px;border-radius:2px;overflow:hidden;margin-bottom:5px;}
.dk .prog{background:rgba(99,102,241,.12);}
.lt .prog{background:rgba(55,48,163,.1);}
.prog-bar{height:100%;border-radius:2px;transition:width .4s ease;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}

/* ── PREVIEW ── */
.preview-bg{padding:28px;overflow:auto;border-radius:4px;}
.dk .preview-bg{background:var(--s3);}
.lt .preview-bg{background:#dde0f2;}

/* ── STEP ── */
.step-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;flex-shrink:0;}
.dk .step-num{border:1px solid rgba(99,102,241,.35);background:rgba(99,102,241,.08);color:var(--acc2);}
.lt .step-num{border:1.5px solid rgba(55,48,163,.3);background:rgba(55,48,163,.07);color:var(--acc);}
`;

/* ═══ PRINT CSS ═══ */
const PRINT_CSS = {
  oxford: `
    @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap');
    body{font-family:'EB Garamond',serif;color:#111;background:white;padding:0;}
    @media print{@page{margin:.6in}}
    .resume{padding:46px 54px;}
    .nm{font-family:'EB Garamond',serif;font-size:28px;font-weight:600;color:#111;margin-bottom:2px;}
    .hl{font-size:14px;font-style:italic;color:#555;margin-bottom:8px;}
    .ct{font-size:12px;color:#555;display:flex;gap:16px;flex-wrap:wrap;
      padding-bottom:10px;border-bottom:1.5px solid #111;margin-bottom:0;}
    .st{font-family:'EB Garamond',serif;font-size:14px;font-weight:600;
      text-transform:uppercase;letter-spacing:.06em;color:#111;
      margin:16px 0 6px;padding-bottom:3px;border-bottom:1px solid #ccc;}
    .et{font-size:13px;font-weight:600;color:#111;}
    .es{font-size:12px;color:#777;font-style:italic;margin-bottom:3px;}
    .eb{font-size:12.5px;color:#333;white-space:pre-wrap;line-height:1.7;}
    .pub{font-size:12px;color:#333;line-height:1.65;margin-bottom:6px;padding-left:18px;text-indent:-18px;}
    .sum{font-size:13px;color:#333;line-height:1.75;font-style:italic;}
  `,
  mit: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body{font-family:'Inter',sans-serif;color:#111;background:white;}
    @media print{@page{margin:.55in}}
    .resume{padding:40px 48px;}
    .header-bar{border-left:4px solid #A31F34;padding-left:16px;margin-bottom:16px;}
    .nm{font-size:26px;font-weight:700;color:#A31F34;letter-spacing:-.01em;margin-bottom:2px;}
    .hl{font-size:12px;color:#555;font-weight:500;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;}
    .ct{font-size:11.5px;color:#555;display:flex;gap:14px;flex-wrap:wrap;}
    .st{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;
      color:#A31F34;margin:16px 0 6px;}
    .divider{height:1.5px;background:#A31F34;margin-bottom:8px;}
    .et{font-size:13px;font-weight:600;color:#111;}
    .es{font-size:11.5px;color:#A31F34;margin-bottom:3px;}
    .eb{font-size:12px;color:#333;white-space:pre-wrap;line-height:1.65;}
    .pub{font-size:12px;color:#333;line-height:1.65;margin-bottom:6px;padding-left:20px;text-indent:-20px;}
    .sum{font-size:12.5px;color:#333;line-height:1.7;}
  `,
  cambridge: `
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Inter:wght@400;500;600&display=swap');
    body{font-family:'Source Serif 4',serif;color:#1a1a2e;background:white;}
    @media print{@page{margin:.6in}}
    .resume{padding:44px 52px;}
    .nm{font-size:27px;font-weight:700;color:#003B5C;margin-bottom:3px;letter-spacing:-.01em;}
    .hl{font-size:13px;color:#4a6741;font-style:italic;margin-bottom:8px;}
    .ct{font-size:11.5px;color:#666;display:flex;gap:14px;flex-wrap:wrap;
      padding-bottom:10px;border-bottom:2px solid #003B5C;margin-bottom:0;}
    .st{font-family:'Source Serif 4',serif;font-size:14px;font-weight:700;
      color:#003B5C;margin:17px 0 6px;padding-bottom:3px;border-bottom:1px solid #b0c4d0;}
    .et{font-size:13px;font-weight:600;color:#1a1a2e;}
    .es{font-size:11.5px;color:#4a6741;font-style:italic;margin-bottom:3px;}
    .eb{font-size:12px;color:#333;white-space:pre-wrap;line-height:1.7;}
    .pub{font-size:12px;color:#333;line-height:1.65;margin-bottom:7px;padding-left:18px;text-indent:-18px;}
    .sum{font-size:13px;color:#333;line-height:1.75;font-style:italic;}
  `,
  modern: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap');
    body{font-family:'Inter',sans-serif;color:#111;background:white;}
    @media print{@page{margin:.5in}}
    .resume{padding:0;}
    .header-band{background:linear-gradient(135deg,#1e1b4b,#3730a3);padding:32px 44px;color:white;}
    .nm{font-size:28px;font-weight:900;color:white;letter-spacing:-.02em;margin-bottom:3px;}
    .hl{font-size:11px;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:.12em;margin-bottom:8px;}
    .ct{font-size:11px;color:rgba(255,255,255,.75);display:flex;gap:14px;flex-wrap:wrap;}
    .body-part{padding:28px 44px;}
    .st{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;
      color:#3730a3;margin:15px 0 6px;}
    .divider{height:1.5px;background:#e0e2f8;margin-bottom:8px;}
    .et{font-size:13px;font-weight:600;color:#111;}
    .es{font-size:11.5px;color:#6366f1;margin-bottom:3px;}
    .eb{font-size:12px;color:#333;white-space:pre-wrap;line-height:1.65;}
    .pub{font-size:11.5px;color:#333;line-height:1.65;margin-bottom:5px;padding-left:18px;text-indent:-18px;}
    .sum{font-size:12.5px;color:#333;line-height:1.7;}
  `,
  simple: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body{font-family:'Inter',sans-serif;color:#111;background:white;}
    @media print{@page{margin:.65in}}
    .resume{padding:50px 58px;}
    .nm{font-size:24px;font-weight:700;color:#111;letter-spacing:-.01em;margin-bottom:2px;}
    .hl{font-size:12px;color:#aaa;font-weight:400;margin-bottom:7px;}
    .ct{font-size:11px;color:#aaa;display:flex;gap:14px;flex-wrap:wrap;padding-bottom:10px;border-bottom:1px solid #eee;}
    .st{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:#aaa;margin:15px 0 5px;}
    .et{font-size:13px;font-weight:600;color:#111;}
    .es{font-size:11.5px;color:#aaa;margin-bottom:3px;}
    .eb{font-size:12px;color:#444;white-space:pre-wrap;line-height:1.65;}
    .pub{font-size:11.5px;color:#444;line-height:1.65;margin-bottom:5px;padding-left:18px;text-indent:-18px;}
    .sum{font-size:12.5px;color:#444;line-height:1.7;}
  `,
};

const CV_TEMPLATES = [
  { id:'oxford',   label:'Oxford',   tag:'Classic Serif',   accent:'#111' },
  { id:'mit',      label:'MIT',      tag:'Crimson Bold',    accent:'#A31F34' },
  { id:'cambridge',label:'Cambridge',tag:'Navy & Green',    accent:'#003B5C' },
  { id:'modern',   label:'Gradient', tag:'Modern Indigo',   accent:'#3730a3' },
  { id:'simple',   label:'Simple',   tag:'Ultra Minimal',   accent:'#888' },
];

/* ═══ HELPERS ═══ */
const uid = () => Math.random().toString(36).slice(2, 9);
const safe = s => (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const nl = s => safe(s).replace(/\n/g,'<br>');

/* ═══ BUILD HTML ═══ */
function buildCV(d, tpl) {
  const contact = [d.email, d.phone, d.website, d.address].filter(Boolean);
  const css = PRINT_CSS[tpl] || PRINT_CSS.oxford;

  const expHTML = (d.experience||[]).map(e => `
    <div style="margin-bottom:10px">
      <div class="et">${safe(e.role)}${e.org?` <span style="font-weight:400">— ${safe(e.org)}</span>`:''}</div>
      <div class="es">${safe(e.period||'')}${e.location?` · ${safe(e.location)}`:''}</div>
      <div class="eb">${nl(e.desc||'')}</div>
    </div>`).join('');

  const eduHTML = (d.education||[]).map(e => `
    <div style="margin-bottom:9px">
      <div class="et">${safe(e.degree)}</div>
      <div class="es">${safe(e.institution||'')}${e.year?` · ${safe(e.year)}`:''}${e.grade?` · ${safe(e.grade)}`:''}</div>
      ${e.thesis?`<div class="eb" style="font-style:italic;margin-top:2px">Thesis: ${safe(e.thesis)}</div>`:''}
    </div>`).join('');

  const pubHTML = (d.publications||[]).map((p,i) => `
    <div class="pub">[${i+1}] ${safe(p.authors||'')}${p.year?` (${safe(p.year)})`:''}. <em>${safe(p.title||'')}</em>${p.journal?`. ${safe(p.journal)}`:''}${p.doi?`. DOI: ${safe(p.doi)}`:''}</div>
  `).join('');

  const presHTML = (d.presentations||[]).map(p => `
    <div class="pub">• ${safe(p.title||'')}${p.venue?`. ${safe(p.venue)}`:''}${p.year?` (${safe(p.year)})`:''}</div>
  `).join('');

  const awardsHTML = (d.awards||[]).map(a => `
    <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px;">
      <div><strong>${safe(a.name)}</strong>${a.org?` — ${safe(a.org)}`:''}</div>
      <div style="color:#888;white-space:nowrap;margin-left:12px;">${safe(a.year||'')}</div>
    </div>`).join('');

  const sec = (label, content) => content ? `<div class="st">${label}</div>${tpl==='mit'||tpl==='modern'?'<div class="divider"></div>':''}${content}` : '';

  if (tpl === 'modern') {
    return `<div class="resume">
      <div class="header-band">
        <div class="nm">${safe(d.name||'Your Name')}</div>
        <div class="hl">${safe(d.title||'')}</div>
        <div class="ct">${contact.map(c=>`<span>${safe(c)}</span>`).join('')}</div>
      </div>
      <div class="body-part">
        ${sec('Research Interests', d.interests?`<div class="sum">${nl(d.interests)}</div>`:'')}
        ${sec('Education', eduHTML)}
        ${sec('Academic / Professional Experience', expHTML)}
        ${sec('Publications', pubHTML)}
        ${sec('Presentations & Talks', presHTML)}
        ${sec('Honours & Awards', awardsHTML)}
        ${sec('Skills', d.skills?`<div class="eb">${safe(d.skills)}</div>`:'')}
        ${sec('Languages', d.languages?`<div class="eb">${safe(d.languages)}</div>`:'')}
        ${d.references?sec('References',`<div class="eb">${nl(d.references)}</div>`):''}
      </div>
    </div>`;
  }

  if (tpl === 'mit') {
    return `<div class="resume">
      <div class="header-bar">
        <div class="nm">${safe(d.name||'Your Name')}</div>
        <div class="hl">${safe(d.title||'')}</div>
        <div class="ct">${contact.map(c=>`<span>${safe(c)}</span>`).join('')}</div>
      </div>
      ${sec('Research Interests', d.interests?`<div class="sum">${nl(d.interests)}</div>`:'')}
      ${sec('Education', eduHTML)}
      ${sec('Experience', expHTML)}
      ${sec('Publications', pubHTML)}
      ${sec('Presentations', presHTML)}
      ${sec('Honours & Awards', awardsHTML)}
      ${sec('Skills', d.skills?`<div class="eb">${safe(d.skills)}</div>`:'')}
      ${sec('Languages', d.languages?`<div class="eb">${safe(d.languages)}</div>`:'')}
      ${d.references?sec('References',`<div class="eb">${nl(d.references)}</div>`):''}
    </div>`;
  }

  return `<div class="resume">
    <div class="nm">${safe(d.name||'Your Name')}</div>
    ${d.title?`<div class="hl">${safe(d.title)}</div>`:''}
    <div class="ct">${contact.map(c=>`<span>${safe(c)}</span>`).join('')}</div>
    ${sec('Research Interests', d.interests?`<div class="sum">${nl(d.interests)}</div>`:'')}
    ${sec('Education', eduHTML)}
    ${sec('Academic / Professional Experience', expHTML)}
    ${sec('Publications', pubHTML)}
    ${sec('Conference Presentations', presHTML)}
    ${sec('Honours & Awards', awardsHTML)}
    ${sec('Skills', d.skills?`<div class="eb">${safe(d.skills)}</div>`:'')}
    ${sec('Languages', d.languages?`<div class="eb">${safe(d.languages)}</div>`:'')}
    ${d.references?sec('References',`<div class="eb">${nl(d.references)}</div>`):''}
  </div>`;
}

/* ═══ EMPTY DATA ═══ */
const mkE = (x={}) => ({ id:uid(), ...x });
const EMPTY = {
  name:'', title:'', email:'', phone:'', website:'', address:'',
  interests:'', skills:'', languages:'', references:'',
  education:[], experience:[], publications:[], presentations:[], awards:[],
};

const TABS = [
  { id:'build',     label:'✎ Build' },
  { id:'pubs',      label:'📖 Publications' },
  { id:'ai',        label:'✦ AI Write' },
  { id:'preview',   label:'◉ Preview' },
  { id:'templates', label:'▦ Templates' },
  { id:'guide',     label:'? Guide' },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function CVMaker() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';

  const [tab, setTab]   = useState('build');
  const [tpl, setTpl]   = useState('oxford');
  const [data, setData] = useState({ ...EMPTY });

  const [aiMode, setAiMode]   = useState('interests');
  const [aiCtx,  setAiCtx]   = useState('');
  const [aiOut,  setAiOut]   = useState('');
  const [aiLoad, setAiLoad]  = useState(false);
  const [aiErr,  setAiErr]   = useState('');

  const set = (k,v) => setData(p=>({...p,[k]:v}));
  const addEdu   = () => set('education', [...data.education, mkE({degree:'',institution:'',year:'',grade:'',thesis:''})]);
  const remEdu   = id => set('education', data.education.filter(e=>e.id!==id));
  const updEdu   = (id,k,v) => set('education', data.education.map(e=>e.id===id?{...e,[k]:v}:e));
  const addExp   = () => set('experience', [...data.experience, mkE({role:'',org:'',period:'',location:'',desc:''})]);
  const remExp   = id => set('experience', data.experience.filter(e=>e.id!==id));
  const updExp   = (id,k,v) => set('experience', data.experience.map(e=>e.id===id?{...e,[k]:v}:e));
  const addPub   = () => set('publications', [...data.publications, mkE({authors:'',year:'',title:'',journal:'',doi:'',impact:3})]);
  const remPub   = id => set('publications', data.publications.filter(p=>p.id!==id));
  const updPub   = (id,k,v) => set('publications', data.publications.map(p=>p.id===id?{...p,[k]:v}:p));
  const addPres  = () => set('presentations', [...data.presentations, mkE({title:'',venue:'',year:'',type:'Talk'})]);
  const remPres  = id => set('presentations', data.presentations.filter(p=>p.id!==id));
  const updPres  = (id,k,v) => set('presentations', data.presentations.map(p=>p.id===id?{...p,[k]:v}:p));
  const addAward = () => set('awards', [...data.awards, mkE({name:'',org:'',year:''})]);
  const remAward = id => set('awards', data.awards.filter(a=>a.id!==id));
  const updAward = (id,k,v) => set('awards', data.awards.map(a=>a.id===id?{...a,[k]:v}:a));

  const filled = [data.name,data.title,data.email,data.interests,data.skills]
    .filter(Boolean).length
    + (data.education.length>0?1:0)
    + (data.publications.length>0?1:0);
  const pct = Math.round((filled/7)*100);

  /* AI */
  const AI_PROMPTS = {
    interests: `Write a concise, compelling 3-sentence academic research interests statement for: ${aiCtx||data.title}. Focus on specific research areas, methodologies, and broader impact. Output only the statement.`,
    summary:   `Write a brief academic bio (3–4 sentences, third person) for: ${aiCtx||data.name+', '+data.title}. Include institution, research focus, and a key achievement. Output only the bio.`,
    abstract:  `Write a clear, impactful abstract for this academic paper:\nTitle: ${aiCtx}\nKeep it under 200 words, structured: background, method, result, conclusion. Output only the abstract.`,
    improve:   `Improve this academic CV text to be more impactful and publication-worthy:\n\n${aiCtx}\n\nOutput only the improved version.`,
  };

  const runAI = async () => {
    setAiLoad(true); setAiOut(''); setAiErr('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:900, stream:true,
          messages:[{role:'user', content: AI_PROMPTS[aiMode]}],
        }),
      });
      if (!res.ok) { setAiErr('API error'); setAiLoad(false); return; }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf='';
      while(true){
        const {done,value} = await reader.read();
        if(done) break;
        buf += dec.decode(value,{stream:true});
        const lines = buf.split('\n'); buf=lines.pop();
        for(const line of lines){
          if(!line.startsWith('data: ')) continue;
          const p=line.slice(6); if(p==='[DONE]') break;
          try{const o=JSON.parse(p);if(o.type==='content_block_delta'&&o.delta?.type==='text_delta')setAiOut(prev=>prev+o.delta.text);}catch{}
        }
      }
    } catch(e){ setAiErr(e.message); }
    finally{ setAiLoad(false); }
  };

  const applyAI = () => {
    if(!aiOut) return;
    if(aiMode==='interests') { set('interests', aiOut); setTab('build'); }
    if(aiMode==='summary')   { set('interests', aiOut); setTab('build'); }
  };

  const printCV = () => {
    const html = buildCV(data, tpl);
    const css = PRINT_CSS[tpl] || PRINT_CSS.oxford;
    const w = window.open('','_blank');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
      <title>${data.name||'Curriculum Vitae'}</title>
      <style>${css}</style></head>
      <body>${html}<script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
  };

  /* Accordion */
  const Sec = ({title, badge, children, open:defOpen=false}) => {
    const [open, setOpen] = useState(defOpen);
    return (
      <div className="acc-wrap panel">
        <button className="acc-head" onClick={()=>setOpen(o=>!o)}>
          <span className="acc-title">
            {title}
            {badge>0&&<span className="acc-badge">{badge}</span>}
          </span>
          <span style={{transform:open?'rotate(180deg)':'none',transition:'transform .2s'}}>▾</span>
        </button>
        <AnimatePresence>
          {open&&<motion.div key="b" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}}
            exit={{height:0,opacity:0}} style={{overflow:'hidden'}}>
            <div className="acc-body">{children}</div>
          </motion.div>}
        </AnimatePresence>
      </div>
    );
  };

  const L = ({c}) => <label className="lbl">{c}</label>;
  const G = ({cols=2,ch}) => <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:9}}>{ch}</div>;

  /* Template thumbnail */
  const TplThumb = ({t}) => {
    const nm = data.name || 'Dr. Jane Smith';
    const hl = data.title || 'Associate Professor of Neuroscience';
    const thumbBg = {
      oxford:'white', mit:'white', cambridge:'white', modern:'white', simple:'white'
    };
    return (
      <div style={{height:130, background:thumbBg[t.id]||'white', overflow:'hidden', position:'relative', fontSize:'27%'}}>
        {t.id==='oxford'&&<div style={{padding:'12px 14px',fontFamily:'serif'}}>
          <div style={{fontSize:'2.6em',fontWeight:600,marginBottom:2}}>{nm}</div>
          <div style={{fontSize:'1.5em',color:'#777',fontStyle:'italic',marginBottom:7}}>{hl}</div>
          <div style={{height:1.5,background:'#111',marginBottom:7}}/>
          <div style={{fontSize:'1.5em',fontWeight:600,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:4}}>Research Interests</div>
          <div style={{height:1,background:'#ccc',marginBottom:4}}/>
          <div style={{fontSize:'1.3em',color:'#555',fontStyle:'italic'}}>Cognitive neuroscience, computational modelling...</div>
        </div>}
        {t.id==='mit'&&<div style={{padding:'12px 14px'}}>
          <div style={{borderLeft:'4px solid #A31F34',paddingLeft:10}}>
            <div style={{fontSize:'2.4em',fontWeight:700,color:'#A31F34',marginBottom:2}}>{nm}</div>
            <div style={{fontSize:'1.4em',color:'#555',textTransform:'uppercase',letterSpacing:'.06em'}}>{hl}</div>
          </div>
          <div style={{marginTop:8,fontSize:'1.4em',fontWeight:700,textTransform:'uppercase',letterSpacing:'.14em',color:'#A31F34'}}>Publications</div>
          <div style={{height:1.5,background:'#A31F34',margin:'3px 0 4px'}}/>
          <div style={{fontSize:'1.3em',color:'#333'}}>[1] Smith, J. (2024). <em>Neural correlates...</em></div>
        </div>}
        {t.id==='cambridge'&&<div style={{padding:'12px 14px',fontFamily:'serif'}}>
          <div style={{fontSize:'2.5em',fontWeight:700,color:'#003B5C',marginBottom:2}}>{nm}</div>
          <div style={{fontSize:'1.4em',color:'#4a6741',fontStyle:'italic',marginBottom:6}}>{hl}</div>
          <div style={{height:2,background:'#003B5C',marginBottom:6}}/>
          <div style={{fontSize:'1.5em',fontWeight:700,color:'#003B5C',marginBottom:4}}>Education</div>
          <div style={{height:1,background:'#b0c4d0',marginBottom:4}}/>
          <div style={{fontSize:'1.3em',fontWeight:600}}>PhD Neuroscience</div>
          <div style={{fontSize:'1.2em',color:'#4a6741',fontStyle:'italic'}}>University of Cambridge · 2018</div>
        </div>}
        {t.id==='modern'&&<div>
          <div style={{background:'linear-gradient(135deg,#1e1b4b,#3730a3)',padding:'12px 14px'}}>
            <div style={{fontSize:'2.6em',fontWeight:900,color:'white',marginBottom:2}}>{nm}</div>
            <div style={{fontSize:'1.3em',color:'rgba(255,255,255,.7)',textTransform:'uppercase',letterSpacing:'.08em'}}>{hl}</div>
          </div>
          <div style={{padding:'8px 14px'}}>
            <div style={{fontSize:'1.3em',fontWeight:700,textTransform:'uppercase',letterSpacing:'.14em',color:'#3730a3',marginBottom:3}}>Research Interests</div>
            <div style={{height:1.5,background:'#e0e2f8',marginBottom:4}}/>
            <div style={{fontSize:'1.3em',color:'#333'}}>Computational biology, ML in genomics...</div>
          </div>
        </div>}
        {t.id==='simple'&&<div style={{padding:'14px 16px'}}>
          <div style={{fontSize:'2.2em',fontWeight:700,marginBottom:2}}>{nm}</div>
          <div style={{fontSize:'1.4em',color:'#aaa',marginBottom:6}}>{hl}</div>
          <div style={{height:1,background:'#eee',marginBottom:6}}/>
          <div style={{fontSize:'1.2em',color:'#aaa',textTransform:'uppercase',letterSpacing:'.2em',marginBottom:4}}>Publications</div>
          <div style={{fontSize:'1.3em',color:'#444'}}>[1] Smith, J. (2024). <em>Title of paper.</em></div>
        </div>}
        {tpl===t.id&&<div style={{position:'absolute',inset:0,
          background:'rgba(99,102,241,.08)',border:'2px solid #6366f1',
          display:'flex',alignItems:'flex-start',justifyContent:'flex-end',padding:5}}>
          <span style={{background:'#6366f1',color:'white',fontFamily:'monospace',fontSize:8,fontWeight:700,padding:'2px 6px',borderRadius:2}}>✓ ACTIVE</span>
        </div>}
      </div>
    );
  };

  /* ─────────────────────────────────────────────────────── */
  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>
        {dark&&<div className="scanline"/>}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <div style={{width:32,height:32,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:16, borderRadius:dark?3:9,
              border:dark?'1px solid rgba(99,102,241,.35)':'none',
              background:dark?'rgba(99,102,241,.09)':'linear-gradient(135deg,#3730a3,#4338ca)',
              boxShadow:dark?'0 0 16px rgba(99,102,241,.25)':'0 3px 10px rgba(55,48,163,.35)',
            }}>🎓</div>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:16,color:'var(--tx)',lineHeight:1}}>
                CV<span style={{color:'var(--acc2)'}}>Maker</span>
                <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #2 · Academic CV · 5 templates
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <div style={{width:90}}>
              <div className="prog"><div className="prog-bar" style={{width:`${pct}%`}}/></div>
              <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8,color:'var(--txm)',textAlign:'right'}}>{pct}% complete</div>
            </div>
          </div>
          <button onClick={()=>setDark(d=>!d)} style={{
            display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(99,102,241,.2)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer',
          }}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#c7c9e8',
              boxShadow:dark?'0 0 8px rgba(99,102,241,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#07060f':'white',transition:'all .2s'}}/>
            </div>
            <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8.5,color:'var(--txm)'}}>
              {dark?'VOID':'LIGHT'}
            </span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>
              {t.label}
              {t.id==='pubs'&&data.publications.length>0&&
                <span className="acc-badge" style={{marginLeft:4}}>{data.publications.length}</span>}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="body">
          {/* SIDEBAR */}
          <div className="sidebar">
            
            <div>
              <div className="slbl">Active template</div>
              {CV_TEMPLATES.map(t=>(
                <button key={t.id} onClick={()=>setTpl(t.id)} style={{
                  width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',
                  padding:'7px 9px',marginBottom:4,cursor:'pointer',
                  border:tpl===t.id?`1px solid var(--acc)`:(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                  borderRadius:dark?3:7,
                  background:tpl===t.id?(dark?'rgba(99,102,241,.06)':'rgba(55,48,163,.05)'):'transparent',
                }}>
                  <div>
                    <div style={{fontFamily:"'Inter',sans-serif",fontSize:11.5,fontWeight:600,
                      color:tpl===t.id?'var(--acc2)':'var(--tx)'}}>{t.label}</div>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8,color:'var(--txm)',marginTop:1}}>{t.tag}</div>
                  </div>
                  {tpl===t.id&&<span style={{fontSize:10,color:'var(--acc2)'}}>✓</span>}
                </button>
              ))}
            </div>
            <div>
              <div className="slbl">CV sections</div>
              {[
                ['Personal',      !!data.name],
                ['Research Intrs',!!data.interests],
                ['Education',     data.education.length>0],
                ['Experience',    data.experience.length>0],
                ['Publications',  data.publications.length>0],
                ['Presentations', data.presentations.length>0],
                ['Awards',        data.awards.length>0],
              ].map(([l,done])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',
                  padding:'4px 9px',marginBottom:3,borderRadius:dark?2:6,
                  background:done?(dark?'rgba(99,102,241,.04)':'rgba(55,48,163,.04)'):'transparent',
                  border:done?(dark?'1px solid rgba(99,102,241,.1)':'1.5px solid rgba(55,48,163,.08)'):
                    (dark?'1px solid transparent':'1.5px solid transparent')}}>
                  <span style={{fontFamily:"'Inter',sans-serif",fontSize:10.5,color:done?'var(--tx)':'var(--txm)'}}>{l}</span>
                  <span style={{fontSize:11}}>{done?'✓':'○'}</span>
                </div>
              ))}
            </div>
            <div>
              <div className="slbl">Export</div>
              <button className="gbtn" onClick={printCV} style={{width:'100%',justifyContent:'flex-start',marginBottom:5,padding:'7px 10px'}}>
                🖨 Print / Save PDF
              </button>
            </div>
            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ╔══ BUILD ══╗ */}
              {tab==='build'&&(
                <motion.div key="build" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:0}}>

                  <Sec title="Personal Information" open>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:9}}>
                      {[
                        ['Full name','name','text','Dr. Jane Smith'],
                        ['Academic title / Position','title','text','Associate Professor of Neuroscience'],
                        ['Email','email','email','jsmith@university.edu'],
                        ['Phone','phone','tel','+1 617 000 1234'],
                        ['Website / ORCID','website','text','orcid.org/0000-0001-2345-6789'],
                        ['Institution / Address','address','text','MIT, Cambridge MA 02139'],
                      ].map(([label,key,type,ph])=>(
                        <div key={key}>
                          <label className="lbl">{label}</label>
                          <input className="fi" type={type} placeholder={ph}
                            value={data[key]||''} onChange={e=>set(key,e.target.value)}/>
                        </div>
                      ))}
                    </div>
                  </Sec>

                  <Sec title="Research Interests" open>
                    <textarea className="fi" rows={3}
                      placeholder="Computational neuroscience, neural coding, sensorimotor integration, reinforcement learning in biological systems…"
                      value={data.interests||''} onChange={e=>set('interests',e.target.value)}/>
                    <button className="gbtn" style={{marginTop:7}}
                      onClick={()=>{setTab('ai');setAiMode('interests');setAiCtx(data.title||'');}}>
                      ✦ Generate with AI
                    </button>
                  </Sec>

                  <Sec title="Education" badge={data.education.length} open>
                    <AnimatePresence>
                      {data.education.map((edu,i)=>(
                        <motion.div key={edu.id} className="ec"
                          initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:9}}>
                            <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:'var(--acc2)'}}>
                              #{String(i+1).padStart(2,'0')}
                            </span>
                            <button onClick={()=>remEdu(edu.id)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--txm)',fontSize:15}}>×</button>
                          </div>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                            <div style={{gridColumn:'1/-1'}}><label className="lbl">Degree</label>
                              <input className="fi" placeholder="PhD Cognitive Neuroscience" value={edu.degree||''} onChange={e=>updEdu(edu.id,'degree',e.target.value)}/></div>
                            <div><label className="lbl">Institution</label>
                              <input className="fi" placeholder="MIT" value={edu.institution||''} onChange={e=>updEdu(edu.id,'institution',e.target.value)}/></div>
                            <div><label className="lbl">Year</label>
                              <input className="fi" placeholder="2019" value={edu.year||''} onChange={e=>updEdu(edu.id,'year',e.target.value)}/></div>
                            <div style={{gridColumn:'1/-1'}}><label className="lbl">Grade / GPA / Distinction</label>
                              <input className="fi" placeholder="Summa Cum Laude · GPA 4.0" value={edu.grade||''} onChange={e=>updEdu(edu.id,'grade',e.target.value)}/></div>
                            <div style={{gridColumn:'1/-1'}}><label className="lbl">Thesis title (optional)</label>
                              <input className="fi" placeholder="Neural Mechanisms of Working Memory Consolidation" value={edu.thesis||''} onChange={e=>updEdu(edu.id,'thesis',e.target.value)}/></div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <button className="gbtn" onClick={addEdu}>+ Add degree</button>
                  </Sec>

                  <Sec title="Academic / Professional Experience" badge={data.experience.length}>
                    <AnimatePresence>
                      {data.experience.map((exp,i)=>(
                        <motion.div key={exp.id} className="ec"
                          initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:9}}>
                            <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:'var(--acc2)'}}>#{String(i+1).padStart(2,'0')}</span>
                            <button onClick={()=>remExp(exp.id)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--txm)',fontSize:15}}>×</button>
                          </div>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                            <div><label className="lbl">Role / Position</label>
                              <input className="fi" placeholder="Postdoctoral Researcher" value={exp.role||''} onChange={e=>updExp(exp.id,'role',e.target.value)}/></div>
                            <div><label className="lbl">Organisation / Lab</label>
                              <input className="fi" placeholder="Broad Institute" value={exp.org||''} onChange={e=>updExp(exp.id,'org',e.target.value)}/></div>
                            <div><label className="lbl">Period</label>
                              <input className="fi" placeholder="2019–2022" value={exp.period||''} onChange={e=>updExp(exp.id,'period',e.target.value)}/></div>
                            <div><label className="lbl">Location</label>
                              <input className="fi" placeholder="Cambridge, MA" value={exp.location||''} onChange={e=>updExp(exp.id,'location',e.target.value)}/></div>
                            <div style={{gridColumn:'1/-1'}}><label className="lbl">Description</label>
                              <textarea className="fi" rows={3}
                                placeholder="Investigated synaptic plasticity mechanisms using two-photon imaging…"
                                value={exp.desc||''} onChange={e=>updExp(exp.id,'desc',e.target.value)}/></div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <button className="gbtn" onClick={addExp}>+ Add position</button>
                  </Sec>

                  <Sec title="Honours & Awards" badge={data.awards.length}>
                    <AnimatePresence>
                      {data.awards.map((a,i)=>(
                        <motion.div key={a.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                          style={{display:'grid',gridTemplateColumns:'1fr 1fr auto auto',gap:8,marginBottom:8,alignItems:'flex-end'}}>
                          <div><label className="lbl">Award name</label>
                            <input className="fi" placeholder="NSF CAREER Award" value={a.name||''} onChange={e=>updAward(a.id,'name',e.target.value)}/></div>
                          <div><label className="lbl">Awarding body</label>
                            <input className="fi" placeholder="National Science Foundation" value={a.org||''} onChange={e=>updAward(a.id,'org',e.target.value)}/></div>
                          <div><label className="lbl">Year</label>
                            <input className="fi" placeholder="2023" style={{width:68}} value={a.year||''} onChange={e=>updAward(a.id,'year',e.target.value)}/></div>
                          <button onClick={()=>remAward(a.id)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--txm)',fontSize:15,paddingBottom:3}}>×</button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <button className="gbtn" onClick={addAward}>+ Add award</button>
                  </Sec>

                  <Sec title="Skills">
                    <textarea className="fi" rows={2}
                      placeholder="Python, R, MATLAB, fMRI analysis, patch-clamp electrophysiology, machine learning, LaTeX…"
                      value={data.skills||''} onChange={e=>set('skills',e.target.value)}/>
                  </Sec>

                  <Sec title="Languages">
                    <input className="fi" placeholder="English (Native), German (Proficient), French (Basic)"
                      value={data.languages||''} onChange={e=>set('languages',e.target.value)}/>
                  </Sec>

                  <Sec title="References">
                    <textarea className="fi" rows={3}
                      placeholder={"Prof. Alice Johnson, Harvard University — alice@harvard.edu\nDr. Bob Chen, Broad Institute — bchen@broadinstitute.org"}
                      value={data.references||''} onChange={e=>set('references',e.target.value)}/>
                    <div style={{marginTop:6,fontFamily:"'IBM Plex Mono',monospace",fontSize:10,color:'var(--txm)'}}>
                      Tip: "Available upon request" is also fine for most applications.
                    </div>
                  </Sec>

                  
                </motion.div>
              )}

              {/* ╔══ PUBLICATIONS ══╗ */}
              {tab==='pubs'&&(
                <motion.div key="pubs" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:0}}>

                  {/* Publications */}
                  <div className="acc-wrap panel">
                    <div style={{padding:'11px 15px',borderBottom:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                      display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span className="acc-title">Publications
                        {data.publications.length>0&&<span className="acc-badge">{data.publications.length}</span>}
                      </span>
                      <button className="gbtn" onClick={addPub}>+ Add publication</button>
                    </div>
                    <div className="acc-body">
                      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,color:'var(--txm)',marginBottom:12}}>
                        Listed in APA-style on the printed CV. Ordered by entry (oldest first = chronological, or reorder manually).
                      </div>
                      <AnimatePresence>
                        {data.publications.map((p,i)=>(
                          <motion.div key={p.id} className="ec"
                            initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}>
                            <div style={{display:'flex',justifyContent:'space-between',marginBottom:9}}>
                              <div style={{display:'flex',alignItems:'center',gap:8}}>
                                <span className="cit">[{i+1}]</span>
                                <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:'var(--acc2)'}}>Publication</span>
                              </div>
                              <button onClick={()=>remPub(p.id)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--txm)',fontSize:15}}>×</button>
                            </div>
                            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                              <div style={{gridColumn:'1/-1'}}><label className="lbl">Paper title</label>
                                <input className="fi" placeholder="Neural correlates of working memory during sleep consolidation" value={p.title||''} onChange={e=>updPub(p.id,'title',e.target.value)}/></div>
                              <div style={{gridColumn:'1/-1'}}><label className="lbl">Authors (as you want them displayed)</label>
                                <input className="fi" placeholder="Smith, J., Chen, B., & Williams, R." value={p.authors||''} onChange={e=>updPub(p.id,'authors',e.target.value)}/></div>
                              <div><label className="lbl">Journal / Conference</label>
                                <input className="fi" placeholder="Nature Neuroscience" value={p.journal||''} onChange={e=>updPub(p.id,'journal',e.target.value)}/></div>
                              <div><label className="lbl">Year</label>
                                <input className="fi" placeholder="2024" value={p.year||''} onChange={e=>updPub(p.id,'year',e.target.value)}/></div>
                              <div style={{gridColumn:'1/-1'}}><label className="lbl">DOI / URL (optional)</label>
                                <input className="fi" placeholder="10.1038/s41593-024-01234-5" value={p.doi||''} onChange={e=>updPub(p.id,'doi',e.target.value)}/></div>
                            </div>
                            {/* Impact stars */}
                            <div style={{marginTop:9,display:'flex',alignItems:'center',gap:8}}>
                              <label className="lbl" style={{margin:0}}>Impact level</label>
                              <div style={{display:'flex',gap:2}}>
                                {[1,2,3,4,5].map(n=>(
                                  <span key={n} className="star"
                                    style={{opacity:n<=(p.impact||3)?1:.3}}
                                    onClick={()=>updPub(p.id,'impact',n)}>⭐</span>
                                ))}
                              </div>
                              <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:'var(--txm)'}}>
                                {['','Q4','Q3','Q2','Q1','Top journal'][p.impact||3]}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {data.publications.length===0&&(
                        <div style={{textAlign:'center',padding:'24px 0',fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:'var(--txm)'}}>
                          No publications yet — click "+ Add publication" above
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Presentations */}
                  <div className="acc-wrap panel">
                    <div style={{padding:'11px 15px',borderBottom:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                      display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span className="acc-title">Presentations & Talks
                        {data.presentations.length>0&&<span className="acc-badge">{data.presentations.length}</span>}
                      </span>
                      <button className="gbtn" onClick={addPres}>+ Add presentation</button>
                    </div>
                    <div className="acc-body">
                      <AnimatePresence>
                        {data.presentations.map((p,i)=>(
                          <motion.div key={p.id} className="ec"
                            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                            <div style={{display:'flex',justifyContent:'space-between',marginBottom:9}}>
                              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                                <span className="cit">#{i+1}</span>
                                <select className="fi" style={{width:100,padding:'3px 7px',fontSize:10}}
                                  value={p.type||'Talk'} onChange={e=>updPres(p.id,'type',e.target.value)}>
                                  {['Talk','Poster','Workshop','Keynote','Panel'].map(v=><option key={v}>{v}</option>)}
                                </select>
                              </div>
                              <button onClick={()=>remPres(p.id)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--txm)',fontSize:15}}>×</button>
                            </div>
                            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                              <div style={{gridColumn:'1/-1'}}><label className="lbl">Title</label>
                                <input className="fi" placeholder="Synaptic plasticity in fear memory reconsolidation" value={p.title||''} onChange={e=>updPres(p.id,'title',e.target.value)}/></div>
                              <div><label className="lbl">Conference / Venue</label>
                                <input className="fi" placeholder="SfN Annual Meeting" value={p.venue||''} onChange={e=>updPres(p.id,'venue',e.target.value)}/></div>
                              <div><label className="lbl">Year</label>
                                <input className="fi" placeholder="2024" value={p.year||''} onChange={e=>updPres(p.id,'year',e.target.value)}/></div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {data.presentations.length===0&&(
                        <div style={{textAlign:'center',padding:'24px 0',fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:'var(--txm)'}}>
                          No presentations yet — click "+ Add presentation" above
                        </div>
                      )}
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ╔══ AI WRITE ══╗ */}
              {tab==='ai'&&(
                <motion.div key="ai" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div className="panel" style={{padding:'14px 16px'}}>
                    <div className="lbl" style={{marginBottom:11}}>✦ What should AI write?</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
                      {[
                        {id:'interests',icon:'🔬',label:'Research Interests',desc:'3-sentence academic statement'},
                        {id:'summary',  icon:'📝',label:'Academic Bio',      desc:'3rd person bio paragraph'},
                        {id:'abstract', icon:'📄',label:'Paper Abstract',    desc:'Under 200 words'},
                        {id:'improve',  icon:'✨',label:'Improve text',      desc:'ATS & journal-ready rewrite'},
                      ].map(({id,icon,label,desc})=>(
                        <button key={id} className={`gbtn ${aiMode===id?'on':''}`}
                          onClick={()=>setAiMode(id)}
                          style={{flexDirection:'column',gap:4,height:'auto',padding:'11px 12px',
                            alignItems:'flex-start',
                            background:aiMode===id?(dark?'rgba(99,102,241,.07)':'rgba(55,48,163,.06)'):''
                          }}>
                          <span style={{fontSize:18}}>{icon}</span>
                          <span style={{fontSize:11,fontWeight:600,color:'var(--tx)',textTransform:'none',letterSpacing:0}}>{label}</span>
                          <span style={{fontSize:9.5,opacity:.6,textTransform:'none',letterSpacing:0,fontFamily:"'Inter',sans-serif"}}>{desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="panel" style={{padding:'14px 16px'}}>
                    <div className="lbl" style={{marginBottom:7}}>
                      {aiMode==='improve'||aiMode==='abstract'?'Paste your text / paper title':'Your context'}
                    </div>
                    <textarea className="fi" rows={aiMode==='improve'?5:3}
                      placeholder={
                        aiMode==='interests'?'e.g. "computational neuroscience, memory consolidation, ML methods in systems neuro"':
                        aiMode==='summary'?'e.g. "Dr. Smith, Associate Professor at MIT, research on neural plasticity"':
                        aiMode==='abstract'?'Paste your paper title and key points here…':
                        'Paste the CV text you want to improve…'
                      }
                      value={aiCtx} onChange={e=>setAiCtx(e.target.value)}/>
                    <div style={{display:'flex',gap:8,marginTop:10,alignItems:'center'}}>
                      <button className="btn" onClick={runAI} disabled={aiLoad} style={{padding:'9px 24px'}}>
                        {aiLoad?<><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;Writing…</>:'✦ Generate'}
                      </button>
                      {aiOut&&!aiLoad&&(aiMode==='interests'||aiMode==='summary')&&(
                        <button className="gbtn" onClick={applyAI}
                          style={{borderColor:'var(--acc)',color:'var(--acc2)'}}>
                          → Apply to Research Interests
                        </button>
                      )}
                      {aiOut&&!aiLoad&&(
                        <button className="gbtn" onClick={()=>{try{navigator.clipboard.writeText(aiOut)}catch{}}}>
                          ⎘ Copy
                        </button>
                      )}
                    </div>
                    {aiErr&&<div style={{marginTop:8,padding:'7px 11px',borderRadius:dark?3:8,
                      background:dark?'rgba(248,113,113,.06)':'rgba(185,28,28,.04)',
                      border:dark?'1px solid rgba(248,113,113,.2)':'1.5px solid rgba(185,28,28,.12)',
                      fontFamily:"'Inter',sans-serif",fontSize:12,color:'var(--err)'}}>⚠ {aiErr}</div>}
                  </div>
                  {(aiOut||aiLoad)&&(
                    <div>
                      <div className="lbl" style={{marginBottom:7}}>✦ AI Output</div>
                      <div className="ai-box">{aiOut}{aiLoad&&<span className="cur"/>}</div>
                    </div>
                  )}
                  
                </motion.div>
              )}

              {/* ╔══ PREVIEW ══╗ */}
              {tab==='preview'&&(
                <motion.div key="preview" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div style={{display:'flex',gap:9,alignItems:'center',flexWrap:'wrap'}}>
                    <button className="btn" onClick={printCV} style={{padding:'9px 22px'}}>🖨 Print / Save as PDF</button>
                    <button className="gbtn" onClick={()=>setTab('templates')}>▦ Change template</button>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9.5,color:'var(--txm)'}}>
                      Template: <span style={{color:'var(--acc2)'}}>{CV_TEMPLATES.find(t=>t.id===tpl)?.label}</span>
                      &nbsp;·&nbsp;{CV_TEMPLATES.find(t=>t.id===tpl)?.tag}
                    </div>
                  </div>
                  <div className="preview-bg">
                    <div dangerouslySetInnerHTML={{__html:buildCV(data,tpl)}}
                      style={{
                        background:'white',color:'#111',maxWidth:794,margin:'0 auto',
                        fontFamily:"'Inter',sans-serif",lineHeight:1.55,
                        boxShadow:'0 6px 48px rgba(0,0,0,.3)',
                        ...(tpl==='modern'?{padding:0}:{}),
                      }}/>
                  </div>
                  
                </motion.div>
              )}

              {/* ╔══ TEMPLATES ══╗ */}
              {tab==='templates'&&(
                <motion.div key="tpl" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div style={{fontFamily:"'Inter',sans-serif",fontSize:14,color:'var(--tx2)',lineHeight:1.7}}>
                    5 academic CV templates — each styled after conventions of top research institutions.
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:13}}>
                    {CV_TEMPLATES.map(t=>(
                      <motion.div key={t.id} whileHover={{y:-3}}
                        className={`tpl-card ${tpl===t.id?'active':''}`}
                        onClick={()=>setTpl(t.id)}>
                        <TplThumb t={t}/>
                        <div style={{padding:'10px 13px',display:'flex',justifyContent:'space-between',alignItems:'center',
                          borderTop:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          background:tpl===t.id?(dark?'rgba(99,102,241,.05)':'rgba(55,48,163,.04)'):(dark?'var(--s2)':'var(--s1)')}}>
                          <div>
                            <div style={{fontFamily:"'Inter',sans-serif",fontSize:12.5,fontWeight:600,
                              color:tpl===t.id?'var(--acc2)':'var(--tx)'}}>{t.label}</div>
                            <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8.5,color:'var(--txm)',marginTop:1}}>{t.tag}</div>
                          </div>
                          {tpl===t.id
                            ?<span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:'var(--acc2)'}}>✓ Active</span>
                            :<span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:'var(--txm)'}}>Select</span>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
                    {[
                      {id:'oxford',    emoji:'📚',t:'Oxford',   b:'Traditional Garamond serif, clean academic lines. The gold standard for humanities, social science, and traditional disciplines.'},
                      {id:'mit',       emoji:'🔴',t:'MIT',      b:'Crimson accent with strong left rule. Tech and STEM-focused. Sharp, confident, and scannable.'},
                      {id:'cambridge', emoji:'🔵',t:'Cambridge',b:'Navy + forest green, Source Serif typography. Elegant, authoritative. Suits life sciences and interdisciplinary research.'},
                      {id:'modern',    emoji:'🟣',t:'Gradient', b:'Deep indigo gradient header, clean body. Modern and distinctive. For faculty at progressive research universities.'},
                      {id:'simple',    emoji:'○', t:'Simple',   b:'Pure minimal — no colour, generous margins. Best when your publications list speaks for itself.'},
                    ].map(({id,emoji,t,b})=>(
                      <div key={id} style={{padding:'12px 14px',borderRadius:dark?3:9,
                        border:tpl===id?`1px solid var(--acc)`:(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                        background:tpl===id?(dark?'rgba(99,102,241,.04)':'rgba(55,48,163,.04)'):(dark?'var(--s2)':'var(--s1)')}}>
                        <div style={{display:'flex',gap:7,alignItems:'center',marginBottom:5}}>
                          <span style={{fontSize:15}}>{emoji}</span>
                          <span style={{fontFamily:"'Playfair Display',serif",fontWeight:600,fontSize:13,color:'var(--tx)'}}>{t}</span>
                          {tpl===id&&<span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:8,color:'var(--acc2)',marginLeft:'auto'}}>ACTIVE</span>}
                        </div>
                        <div style={{fontFamily:"'Inter',sans-serif",fontSize:12.5,color:'var(--tx2)',lineHeight:1.65}}>{b}</div>
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
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:'var(--tx)',marginBottom:4}}>
                      CV vs Résumé — what's the difference?
                    </div>
                    <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:'var(--txm)',letterSpacing:'.14em',textTransform:'uppercase',marginBottom:16}}>
                      academic · research · faculty
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
                      {[
                        {t:'CV (Curriculum Vitae)',pts:['Any length — completeness matters','Includes all publications, talks, grants','Used for academic, research, medical roles','Emphasis on scholarly output']},
                        {t:'Résumé',pts:['1–2 pages maximum','Skills and work experience focused','Used for industry, corporate roles','Emphasis on impact and metrics']},
                      ].map(({t,pts})=>(
                        <div key={t} style={{padding:'12px 14px',borderRadius:dark?3:9,
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          background:dark?'rgba(0,0,0,.25)':'rgba(248,249,255,.8)'}}>
                          <div style={{fontFamily:"'Playfair Display',serif",fontWeight:600,fontSize:13,color:'var(--tx)',marginBottom:8}}>{t}</div>
                          {pts.map((p,i)=>(
                            <div key={i} style={{display:'flex',gap:7,marginBottom:5,alignItems:'flex-start'}}>
                              <span style={{color:'var(--acc2)',flexShrink:0,fontFamily:"'IBM Plex Mono',monospace",fontSize:10,marginTop:2}}>›</span>
                              <span style={{fontFamily:"'Inter',sans-serif",fontSize:12.5,color:'var(--tx2)',lineHeight:1.6}}>{p}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    {[
                      {n:1,t:'Personal Info first',d:'Name, academic title, institution, email, ORCID. For senior academics, your institution affiliation matters as much as your name.'},
                      {n:2,t:'Research Interests',d:'2–4 sentences. Name the specific subfields and methodologies. Committees scan this to see if you\'re a good fit before reading the rest.'},
                      {n:3,t:'Education in reverse',d:'PhD first, then master\'s, then undergraduate. Always include thesis title for PhD. Distinction / summa cum laude belongs here.'},
                      {n:4,t:'Publications tab',d:'This is the most important section for academic CVs. Use the 📖 Publications tab to add papers. AI can help write abstracts. Impact stars are for your reference only.'},
                      {n:5,t:'Choose your template',d:'Oxford/Cambridge for humanities and life sciences. MIT for STEM and engineering. Gradient for interdisciplinary and modern research environments.'},
                    ].map(({n,t,d})=>(
                      <div key={n} style={{display:'flex',gap:12,marginBottom:14}}>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
                          <div className="step-num">{n}</div>
                          {n<5&&<div style={{width:1.5,flex:1,marginTop:5,background:dark?'rgba(99,102,241,.1)':'rgba(55,48,163,.1)'}}/>}
                        </div>
                        <div style={{flex:1,paddingBottom:4}}>
                          <div style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:600,color:'var(--tx)',marginBottom:4}}>{t}</div>
                          <div style={{fontFamily:"'Inter',sans-serif",fontSize:13.5,color:'var(--tx2)',lineHeight:1.72}}>{d}</div>
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
    </>
  );
}