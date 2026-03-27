import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   RESUME MAKER  — Document Tools Series #1
   Theme: Dark Void/Neon-Teal · Light Cream/Forest
   Fonts: Fraunces · Outfit · Fira Code
   AI: Anthropic streaming (summary, bullets, skills, objective)
   Templates: 6 visual styles with live preview
   Export: Print → PDF
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&family=Playfair+Display:wght@700&family=Raleway:wght@300;400;700;900&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Outfit',sans-serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes fadeup{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(20,255,180,.2)}50%{box-shadow:0 0 0 8px rgba(20,255,180,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes border-run{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

/* ── DARK: deep void + neon teal ── */
.dk{
  --bg:#060a09;--s1:#0a0f0d;--s2:#0f1612;--s3:#141d18;
  --bdr:#1a2820;--bdr-hi:rgba(20,255,180,.22);
  --acc:#14ffb4;--acc2:#00e5a0;--acc3:#ff6b6b;--acc4:#a78bfa;
  --err:#ff6b6b;--warn:#fbbf24;
  --tx:#e8fff8;--tx2:#8ecfb8;--tx3:#1a3d2c;--txm:#3d7a62;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 80% 40% at 50% -10%,rgba(20,255,180,.05),transparent),
    radial-gradient(ellipse 40% 60% at 95% 80%,rgba(167,139,250,.04),transparent),
    radial-gradient(ellipse 30% 40% at 5% 60%,rgba(0,229,160,.03),transparent);
}
/* ── LIGHT: warm cream + forest ── */
.lt{
  --bg:#f5fbf8;--s1:#ffffff;--s2:#ecf7f1;--s3:#dff0e8;
  --bdr:#b8ddc8;--bdr-hi:#0d3320;
  --acc:#0d3320;--acc2:#1a5c38;--acc3:#c2410c;--acc4:#5b21b6;
  --err:#991b1b;--warn:#92400e;
  --tx:#071810;--tx2:#1a5c38;--tx3:#a7d4bc;--txm:#2d6e4a;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(13,51,32,.05),transparent);
}

/* ── TOPBAR ── */
.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(6,10,9,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(245,251,248,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(13,51,32,.07);}

/* ── NEON SCAN LINE (dark only) ── */
.scanline{position:fixed;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(20,255,180,.3),transparent);
  animation:scan 4s linear infinite;pointer-events:none;z-index:999;}

/* ── TABS ── */
.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 15px;border:none;cursor:pointer;background:transparent;border-bottom:2.5px solid transparent;
  font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;letter-spacing:.04em;
  display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--tx3);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(20,255,180,.04);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#94a3b8;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(13,51,32,.05);font-weight:600;}
.lt .tab:hover:not(.on){color:var(--tx2);}

/* ── LAYOUT ── */
.body{display:grid;grid-template-columns:222px 1fr;min-height:calc(100vh - 86px);}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:14px 18px;display:flex;flex-direction:column;gap:14px;overflow-x:hidden;}

/* ── PANEL ── */
.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(13,51,32,.06);}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 22px;cursor:pointer;
  font-family:'Outfit',sans-serif;font-size:11.5px;font-weight:600;letter-spacing:.04em;
  transition:all .16s;border:none;}
.dk .btn{background:var(--acc);color:#060a09;border-radius:3px;animation:glow 2.6s infinite;}
.dk .btn:hover{background:#4fffca;transform:translateY(-1px);animation:none;box-shadow:0 0 30px rgba(20,255,180,.5);}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;animation:none;transform:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:8px;box-shadow:0 4px 14px rgba(13,51,32,.3);}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);box-shadow:0 8px 24px rgba(13,51,32,.4);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}
.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;
  font-family:'Outfit',sans-serif;font-size:10px;font-weight:500;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(20,255,180,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(13,51,32,.05);}

/* ── INPUTS ── */
.fi{width:100%;outline:none;font-family:'Outfit',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;resize:vertical;}
.dk .fi{background:rgba(0,0,0,.4);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(20,255,180,.1);}
.lt .fi{background:#f5fbf8;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(13,51,32,.09);}
.fi::placeholder{opacity:.3;}

/* ── ACCORDION SECTION ── */
.acc-wrap{margin-bottom:10px;}
.acc-head{width:100%;display:flex;justify-content:space-between;align-items:center;
  padding:11px 15px;background:transparent;border:none;cursor:pointer;transition:background .13s;}
.dk .acc-head{border-bottom:1px solid var(--bdr);}
.lt .acc-head{border-bottom:1.5px solid var(--bdr);}
.dk .acc-head:hover{background:rgba(20,255,180,.025);}
.lt .acc-head:hover{background:rgba(13,51,32,.025);}
.acc-title{font-family:'Fraunces',serif;font-size:14px;font-weight:600;color:var(--tx);}
.dk .acc-title{text-shadow:0 0 20px rgba(20,255,180,.15);}
.acc-badge{font-family:'Fira Code',monospace;font-size:9px;padding:1px 6px;border-radius:99px;margin-left:7px;}
.dk .acc-badge{background:rgba(20,255,180,.1);border:1px solid rgba(20,255,180,.2);color:var(--acc);}
.lt .acc-badge{background:rgba(13,51,32,.08);border:1.5px solid rgba(13,51,32,.15);color:var(--acc);}
.acc-body{padding:13px 15px 15px;}

/* ── ENTRY CARD ── */
.ec{padding:13px 14px;margin-bottom:10px;position:relative;}
.dk .ec{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.3);}
.lt .ec{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.8);}
.dk .ec::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--acc);border-radius:2px 0 0 2px;opacity:.5;}

/* ── SKILL CHIPS ── */
.chip{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;margin:3px;
  border-radius:99px;font-family:'Outfit',sans-serif;font-size:11px;}
.dk .chip{background:rgba(20,255,180,.08);border:1px solid rgba(20,255,180,.2);color:var(--acc);}
.lt .chip{background:rgba(13,51,32,.07);border:1.5px solid rgba(13,51,32,.18);color:var(--acc);}

/* ── AI OUTPUT ── */
.ai-box{font-family:'Fira Code',monospace;font-size:12px;line-height:1.78;
  padding:15px 17px;min-height:60px;white-space:pre-wrap;word-break:break-word;border-radius:4px;}
.dk .ai-box{color:#7dffce;background:rgba(0,0,0,.5);border:1px solid rgba(20,255,180,.12);}
.lt .ai-box{color:#0d3320;background:#e8f7ee;border:1.5px solid rgba(13,51,32,.15);border-radius:10px;}
.cur{display:inline-block;width:7px;height:13px;background:var(--acc);animation:blink .7s infinite;vertical-align:text-bottom;margin-left:1px;}

/* ── LABELS ── */
.lbl{font-family:'Outfit',sans-serif;font-size:9px;font-weight:600;letter-spacing:.22em;
  text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(20,255,180,.4);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(20,255,180,.3);}
.lt .slbl{color:var(--acc);}

/* ── STAT BOX ── */
.stat{padding:9px 11px;margin-bottom:5px;}
.dk .stat{border:1px solid rgba(20,255,180,.08);border-radius:3px;background:rgba(20,255,180,.02);}
.lt .stat{border:1.5px solid rgba(13,51,32,.1);border-radius:8px;background:rgba(13,51,32,.03);}

/* ── TEMPLATE CARD ── */
.tpl-card{cursor:pointer;transition:all .18s;position:relative;overflow:hidden;}
.dk .tpl-card{border:1px solid var(--bdr);border-radius:4px;}
.lt .tpl-card{border:1.5px solid var(--bdr);border-radius:12px;}
.tpl-card:hover{transform:translateY(-2px);}
.dk .tpl-card:hover{box-shadow:0 0 20px rgba(20,255,180,.15);}
.lt .tpl-card:hover{box-shadow:0 6px 24px rgba(13,51,32,.12);}
.tpl-card.active{border-color:var(--acc)!important;}
.dk .tpl-card.active{box-shadow:0 0 24px rgba(20,255,180,.2);}
.lt .tpl-card.active{box-shadow:0 4px 20px rgba(13,51,32,.2);}

/* ── AD ── */
.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(20,255,180,.01);border:1px dashed rgba(20,255,180,.08);border-radius:3px;}
.lt .ad{background:rgba(13,51,32,.02);border:1.5px dashed rgba(13,51,32,.1);border-radius:9px;}
.ad span{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

/* ── PROGRESS ── */
.prog{height:3px;border-radius:2px;overflow:hidden;margin-bottom:6px;}
.dk .prog{background:rgba(20,255,180,.1);}
.lt .prog{background:rgba(13,51,32,.1);}
.prog-bar{height:100%;border-radius:2px;transition:width .3s ease;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc4));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc4));}

/* ── PREVIEW WRAPPER ── */
.preview-bg{padding:28px;overflow:auto;border-radius:4px;}
.dk .preview-bg{background:var(--s3);}
.lt .preview-bg{background:#e8f0eb;}

/* ── GUIDE STEP ── */
.step-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'Fira Code',monospace;font-size:11px;font-weight:500;flex-shrink:0;}
.dk .step-num{border:1px solid rgba(20,255,180,.3);background:rgba(20,255,180,.06);color:var(--acc);}
.lt .step-num{border:1.5px solid rgba(13,51,32,.3);background:rgba(13,51,32,.06);color:var(--acc);}
`;

/* ═══ PRINT CSS ═══ */
const printCSS = (tpl) => `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700&family=Outfit:wght@300;400;500;600;700&family=Raleway:wght@300;400;700;900&family=Playfair+Display:wght@700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Outfit',sans-serif;color:#111;background:white;}
@media print{@page{margin:.55in}body{padding:0}button{display:none!important}}
${TPL_PRINT_STYLES[tpl] || ''}
`;

/* ═══ HELPERS ═══ */
const uid = () => Math.random().toString(36).slice(2, 9);
const safeHtml = s => (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const nlBr = s => safeHtml(s).replace(/\n/g,'<br>');

/* ═══ 6 RESUME TEMPLATES ═══ */
const TEMPLATES = [
  {
    id: 'nova',
    label: 'Nova',
    tag: 'Futuristic',
    colors: ['#0ff', '#7c3aed'],
    dark: true,
  },
  {
    id: 'executive',
    label: 'Executive',
    tag: 'Classic Pro',
    colors: ['#1a1a1a', '#b8960c'],
    dark: false,
  },
  {
    id: 'minimal',
    label: 'Minimal',
    tag: 'Clean & Modern',
    colors: ['#111', '#888'],
    dark: false,
  },
  {
    id: 'sidebar',
    label: 'Sidebar',
    tag: 'Two-Column',
    colors: ['#1e3a5f', '#fff'],
    dark: true,
  },
  {
    id: 'bold',
    label: 'Bold',
    tag: 'High Impact',
    colors: ['#ff3c5f', '#111'],
    dark: false,
  },
  {
    id: 'academic',
    label: 'Academic',
    tag: 'Formal / Serif',
    colors: ['#2c1810', '#8b4513'],
    dark: false,
  },
];

/* Print CSS per template */
const TPL_PRINT_STYLES = {
  nova: `
    body{background:#06090f;color:#e0f7ff;}
    .resume{padding:38px 44px;background:#06090f;min-height:100vh;}
    .nm{font-family:'Raleway',sans-serif;font-size:32px;font-weight:900;
      background:linear-gradient(90deg,#00fff0,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;
      letter-spacing:-.01em;margin-bottom:2px;}
    .hl{font-family:'Fira Code',monospace;font-size:11px;color:#7fffd4;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px;}
    .ct{font-family:'Fira Code',monospace;font-size:10px;color:#6ee7b7;display:flex;gap:14px;flex-wrap:wrap;
      padding-bottom:12px;border-bottom:1px solid rgba(0,255,240,.2);margin-bottom:0;}
    .st{font-family:'Raleway',sans-serif;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;
      color:#00fff0;margin:16px 0 7px;position:relative;padding-left:12px;}
    .st::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);
      width:5px;height:5px;background:#00fff0;border-radius:1px;}
    .et{font-size:12.5px;font-weight:600;color:#e0f7ff;margin-bottom:1px;}
    .es{font-family:'Fira Code',monospace;font-size:10px;color:#6ee7b7;margin-bottom:4px;}
    .eb{font-size:12px;color:#9ec8c0;white-space:pre-wrap;}
    .sk-chip{display:inline-block;padding:3px 10px;margin:2px;border-radius:3px;
      border:1px solid rgba(0,255,240,.25);background:rgba(0,255,240,.06);
      font-family:'Fira Code',monospace;font-size:10px;color:#7fffd4;}
    .sum{font-size:12.5px;color:#b0d8d0;line-height:1.7;white-space:pre-wrap;}
    .divider{height:1px;background:linear-gradient(90deg,rgba(0,255,240,.3),transparent);margin:8px 0;}
  `,
  executive: `
    .resume{padding:44px 52px;max-width:100%;}
    .nm{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;color:#1a1a1a;letter-spacing:-.01em;margin-bottom:3px;}
    .hl{font-size:12px;color:#888;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;}
    .ct{font-size:11.5px;color:#888;display:flex;gap:16px;flex-wrap:wrap;
      padding-bottom:12px;border-bottom:2.5px solid #b8960c;margin-bottom:0;}
    .st{font-family:'Playfair Display',serif;font-size:13px;font-weight:700;text-transform:uppercase;
      letter-spacing:.1em;color:#1a1a1a;margin:18px 0 7px;padding-bottom:4px;border-bottom:1px solid #e0d5a0;}
    .et{font-size:13px;font-weight:600;color:#1a1a1a;margin-bottom:1px;}
    .es{font-size:11.5px;color:#b8960c;margin-bottom:4px;}
    .eb{font-size:12px;color:#333;white-space:pre-wrap;line-height:1.65;}
    .sk-chip{display:inline-block;padding:3px 10px;margin:2px;border-radius:2px;
      background:#f5f0dc;border:1px solid #ddd0a0;font-size:11px;color:#5a4a00;}
    .sum{font-size:13px;color:#333;line-height:1.7;white-space:pre-wrap;}
    .divider{height:1px;background:#e8e0c8;margin:4px 0;}
  `,
  minimal: `
    .resume{padding:48px 56px;max-width:100%;}
    .nm{font-family:'Outfit',sans-serif;font-size:28px;font-weight:700;color:#111;letter-spacing:-.02em;margin-bottom:2px;}
    .hl{font-size:12px;color:#999;letter-spacing:.06em;margin-bottom:9px;}
    .ct{font-size:11px;color:#aaa;display:flex;gap:14px;flex-wrap:wrap;
      padding-bottom:11px;border-bottom:1px solid #eee;margin-bottom:0;}
    .st{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;
      color:#999;margin:17px 0 6px;}
    .et{font-size:13px;font-weight:600;color:#111;margin-bottom:1px;}
    .es{font-size:11.5px;color:#aaa;margin-bottom:3px;}
    .eb{font-size:12px;color:#444;white-space:pre-wrap;line-height:1.65;}
    .sk-chip{display:inline-block;padding:3px 10px;margin:2px;border-radius:99px;
      background:#f5f5f5;border:1px solid #e8e8e8;font-size:11px;color:#666;}
    .sum{font-size:12.5px;color:#444;line-height:1.7;white-space:pre-wrap;}
    .divider{height:1px;background:#f0f0f0;margin:4px 0;}
  `,
  sidebar: `
    .resume{display:grid;grid-template-columns:200px 1fr;min-height:100vh;}
    .sidebar-col{background:#1e3a5f;padding:32px 22px;color:white;}
    .main-col{padding:36px 32px;background:white;}
    .nm{font-family:'Raleway',sans-serif;font-size:20px;font-weight:900;color:white;
      text-transform:uppercase;letter-spacing:.04em;margin-bottom:3px;line-height:1.2;}
    .hl{font-size:10px;color:#90c4f0;text-transform:uppercase;letter-spacing:.1em;margin-bottom:14px;}
    .ct{font-size:10px;color:#b0d4f0;display:flex;flex-direction:column;gap:5px;margin-bottom:0;}
    .st{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.18em;
      color:#90c4f0;margin:16px 0 7px;}
    .st-main{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;
      color:#1e3a5f;margin:16px 0 6px;padding-bottom:3px;border-bottom:2px solid #1e3a5f;}
    .et{font-size:13px;font-weight:600;color:#111;margin-bottom:1px;}
    .es{font-size:11px;color:#888;margin-bottom:3px;}
    .eb{font-size:11.5px;color:#333;white-space:pre-wrap;line-height:1.6;}
    .sk-chip{display:block;padding:4px 0;font-size:10.5px;color:#c8e4f8;border-bottom:1px solid rgba(255,255,255,.1);}
    .sum{font-size:12.5px;color:#333;line-height:1.7;white-space:pre-wrap;}
    .divider{height:1px;background:#e8eef4;margin:4px 0;}
  `,
  bold: `
    .resume{padding:0;overflow:hidden;}
    .header-band{background:#ff3c5f;padding:32px 44px;color:white;}
    .body-part{padding:28px 44px;}
    .nm{font-family:'Raleway',sans-serif;font-size:34px;font-weight:900;color:white;
      text-transform:uppercase;letter-spacing:-.01em;margin-bottom:2px;}
    .hl{font-size:11px;color:rgba(255,255,255,.75);text-transform:uppercase;letter-spacing:.12em;margin-bottom:8px;}
    .ct{font-size:11px;color:rgba(255,255,255,.8);display:flex;gap:14px;flex-wrap:wrap;margin-bottom:0;}
    .st{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.15em;
      color:white;background:#ff3c5f;padding:5px 12px;display:inline-block;margin:14px 0 8px;}
    .et{font-size:13.5px;font-weight:700;color:#111;margin-bottom:1px;}
    .es{font-size:11.5px;color:#ff3c5f;font-weight:500;margin-bottom:3px;}
    .eb{font-size:12px;color:#333;white-space:pre-wrap;line-height:1.65;}
    .sk-chip{display:inline-block;padding:4px 12px;margin:3px;border-radius:2px;
      background:#ff3c5f;color:white;font-size:11px;font-weight:600;}
    .sum{font-size:13px;color:#333;line-height:1.7;white-space:pre-wrap;}
    .divider{height:2px;background:#ff3c5f;margin:8px 0;}
  `,
  academic: `
    .resume{padding:48px 52px;max-width:100%;}
    .nm{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;color:#2c1810;
      text-align:center;margin-bottom:3px;}
    .hl{font-size:12px;color:#8b4513;text-align:center;font-style:italic;letter-spacing:.04em;margin-bottom:8px;}
    .ct{font-size:11px;color:#666;display:flex;justify-content:center;gap:14px;flex-wrap:wrap;
      padding-bottom:12px;border-bottom:2px solid #2c1810;margin-bottom:0;}
    .st{font-family:'Playfair Display',serif;font-size:13.5px;font-weight:700;
      color:#2c1810;margin:18px 0 7px;border-bottom:1px solid #c4a882;padding-bottom:3px;}
    .et{font-size:13px;font-weight:600;color:#2c1810;margin-bottom:1px;}
    .es{font-size:11.5px;color:#8b4513;font-style:italic;margin-bottom:4px;}
    .eb{font-size:12px;color:#333;white-space:pre-wrap;line-height:1.7;}
    .sk-chip{display:inline;font-size:12px;color:#333;}
    .sk-chip::after{content:' · ';}
    .sum{font-size:13px;color:#333;line-height:1.75;font-style:italic;white-space:pre-wrap;}
    .divider{height:1px;background:#c4a882;margin:4px 0;}
  `,
};

/* ── Build HTML for a template ── */
function buildHTML(d, tpl) {
  const safe = safeHtml, nb = nlBr;
  const skills = (d.skills || '').split(/[,\n]/).map(s=>s.trim()).filter(Boolean);

  const contactParts = [d.email,d.phone,d.location,d.linkedin].filter(Boolean);

  /* shared sections */
  const expHTML = (d.experience||[]).map(e => `
    <div style="margin-bottom:10px;">
      <div class="et">${safe(e.role)}${e.company?` <span style="font-weight:400">@ ${safe(e.company)}</span>`:''}</div>
      <div class="es">${safe(e.period||'')}</div>
      <div class="eb">${nb(e.bullets||'')}</div>
    </div>`).join('');

  const eduHTML = (d.education||[]).map(e => `
    <div style="margin-bottom:8px;">
      <div class="et">${safe(e.degree)}</div>
      <div class="es">${safe(e.school||'')}${e.year?` · ${safe(e.year)}`:''}${e.grade?` · ${safe(e.grade)}`:''}</div>
    </div>`).join('');

  const certHTML = (d.certifications||[]).map(c =>
    `<div style="font-size:12px;margin-bottom:4px;"><b>${safe(c.name)}</b>${c.org?` — ${safe(c.org)}`:''}${c.year?` (${safe(c.year)})`:''}</div>`
  ).join('');

  if (tpl === 'sidebar') {
    const skSidebar = skills.map(s=>`<div class="sk-chip">${safe(s)}</div>`).join('');
    return `<div class="resume">
      <div class="sidebar-col">
        <div class="nm">${safe(d.name||'Your Name')}</div>
        <div class="hl">${safe(d.title||'')}</div>
        <div class="ct">${contactParts.map(c=>`<span>${safe(c)}</span>`).join('')}</div>
        ${d.skills?`<div class="st">Skills</div>${skSidebar}`:''}
        ${d.languages?`<div class="st">Languages</div><div style="font-size:10.5px;color:#c8e4f8;line-height:1.8;">${safe(d.languages)}</div>`:''}
      </div>
      <div class="main-col">
        ${d.summary?`<div class="st-main">Profile</div><div class="sum">${nb(d.summary)}</div>`:''}
        ${d.experience?.length?`<div class="st-main">Experience</div>${expHTML}`:''}
        ${d.education?.length?`<div class="st-main">Education</div>${eduHTML}`:''}
        ${certHTML?`<div class="st-main">Certifications</div>${certHTML}`:''}
      </div>
    </div>`;
  }

  if (tpl === 'bold') {
    return `<div class="resume">
      <div class="header-band">
        <div class="nm">${safe(d.name||'Your Name')}</div>
        <div class="hl">${safe(d.title||'')}</div>
        <div class="ct">${contactParts.map(c=>`<span>${safe(c)}</span>`).join('')}</div>
      </div>
      <div class="body-part">
        ${d.summary?`<div class="st">Summary</div><div class="sum">${nb(d.summary)}</div>`:''}
        ${d.experience?.length?`<div class="st">Experience</div>${expHTML}`:''}
        ${d.education?.length?`<div class="st">Education</div>${eduHTML}`:''}
        ${skills.length?`<div class="st">Skills</div><div>${skills.map(s=>`<span class="sk-chip">${safe(s)}</span>`).join('')}</div>`:''}
        ${certHTML?`<div class="st">Certifications</div>${certHTML}`:''}
      </div>
    </div>`;
  }

  /* default layout for nova, executive, minimal, academic */
  const nameAlign = tpl === 'academic' ? 'text-align:center;' : '';
  const skHTML = tpl === 'academic'
    ? `<div style="${nameAlign}">${skills.map(s=>`<span class="sk-chip">${safe(s)}</span>`).join('')}</div>`
    : `<div>${skills.map(s=>`<span class="sk-chip">${safe(s)}</span>`).join('')}</div>`;

  return `<div class="resume">
    <div class="nm" style="${nameAlign}">${safe(d.name||'Your Name')}</div>
    ${d.title?`<div class="hl" style="${nameAlign}">${safe(d.title)}</div>`:''}
    <div class="ct" style="${nameAlign}justify-content:${tpl==='academic'?'center':'flex-start'};">${contactParts.map(c=>`<span>${safe(c)}</span>`).join('')}</div>
    ${d.summary?`<div class="st">Summary</div><div class="divider"></div><div class="sum">${nb(d.summary)}</div>`:''}
    ${d.experience?.length?`<div class="st">Experience</div><div class="divider"></div>${expHTML}`:''}
    ${d.education?.length?`<div class="st">Education</div><div class="divider"></div>${eduHTML}`:''}
    ${skills.length?`<div class="st">Skills</div><div class="divider"></div>${skHTML}`:''}
    ${certHTML?`<div class="st">Certifications</div><div class="divider"></div>${certHTML}`:''}
    ${d.languages?`<div class="st">Languages</div><div class="divider"></div><div style="font-size:12px;color:inherit;">${safe(d.languages)}</div>`:''}
  </div>`;
}

/* ═══════════════════════════════════════════════════════════════
   DEFAULT DATA
═══════════════════════════════════════════════════════════════ */
const mkE = (x={}) => ({ id: uid(), ...x });
const EMPTY = {
  name:'', title:'', email:'', phone:'', location:'', linkedin:'', website:'',
  summary:'', skills:'', languages:'',
  experience:[], education:[], certifications:[],
};

const TABS = [
  { id:'build',     label:'✎ Build' },
  { id:'ai',        label:'✦ AI Write' },
  { id:'preview',   label:'◉ Preview' },
  { id:'templates', label:'▦ Templates' },
  { id:'guide',     label:'? Guide' },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function ResumeMaker() {
  const [dark, setDark]   = useState(true);
  const cls = dark ? 'dk' : 'lt';

  const [tab, setTab]     = useState('build');
  const [tpl, setTpl]     = useState('nova');
  const [data, setData]   = useState({ ...EMPTY });

  /* AI state */
  const [aiMode, setAiMode]       = useState('summary');
  const [aiCtx,  setAiCtx]       = useState('');
  const [aiOut,  setAiOut]       = useState('');
  const [aiLoad, setAiLoad]      = useState(false);
  const [aiErr,  setAiErr]       = useState('');

  /* helpers */
  const set = (k, v) => setData(p => ({ ...p, [k]: v }));
  const addExp  = () => set('experience', [...data.experience, mkE({role:'',company:'',period:'',bullets:''})]);
  const remExp  = id => set('experience', data.experience.filter(e=>e.id!==id));
  const updExp  = (id,k,v) => set('experience', data.experience.map(e=>e.id===id?{...e,[k]:v}:e));
  const addEdu  = () => set('education', [...data.education, mkE({degree:'',school:'',year:'',grade:''})]);
  const remEdu  = id => set('education', data.education.filter(e=>e.id!==id));
  const updEdu  = (id,k,v) => set('education', data.education.map(e=>e.id===id?{...e,[k]:v}:e));
  const addCert = () => set('certifications', [...data.certifications, mkE({name:'',org:'',year:''})]);
  const remCert = id => set('certifications', data.certifications.filter(c=>c.id!==id));
  const updCert = (id,k,v) => set('certifications', data.certifications.map(c=>c.id===id?{...c,[k]:v}:c));

  /* completion % */
  const filled = [data.name,data.title,data.email,data.summary,data.skills]
    .filter(Boolean).length
    + (data.experience.length>0?1:0)
    + (data.education.length>0?1:0);
  const pct = Math.round((filled/7)*100);

  /* AI */
  const AI_PROMPTS = {
    summary: `Write a compelling 3-sentence professional resume summary for: ${aiCtx||data.name+', '+data.title}. First person, achievement-focused. Output only the summary text.`,
    bullets: `Write 4 strong resume bullet points for this job: ${aiCtx}. Start each with an action verb, include metrics. One per line, no dashes/bullets prefix.`,
    skills:  `Generate 14 comma-separated professional skills for a ${aiCtx||data.title}. Skills only, comma-separated, no explanation.`,
    improve: `Improve this resume text to be more impactful and ATS-friendly:\n\n${aiCtx}\n\nOutput only the improved version.`,
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
      if (!res.ok) { setAiErr('API error — check your key'); setAiLoad(false); return; }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        buf += dec.decode(value, {stream:true});
        const lines = buf.split('\n'); buf = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const p = line.slice(6); if (p==='[DONE]') break;
          try {
            const obj = JSON.parse(p);
            if (obj.type==='content_block_delta' && obj.delta?.type==='text_delta')
              setAiOut(prev => prev + obj.delta.text);
          } catch {}
        }
      }
    } catch(e) { setAiErr(e.message); }
    finally { setAiLoad(false); }
  };

  const applyAI = () => {
    if (!aiOut) return;
    if (aiMode==='summary') { set('summary', aiOut); setTab('build'); }
    if (aiMode==='skills')  { set('skills', aiOut);  setTab('build'); }
  };

  /* export */
  const printResume = () => {
    const html = buildHTML(data, tpl);
    const w = window.open('','_blank');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
      <title>${data.name||'Resume'}</title>
      <style>${printCSS(tpl)}</style></head>
      <body>${html}<script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
  };

  /* ── template thumbnail ── */
  const TplThumb = ({ t }) => {
    const colors = t.colors;
    const isSidebar = t.id==='sidebar';
    const isBold = t.id==='bold';
    return (
      <div style={{
        height: 140, background: t.id==='nova' ? '#06090f' : t.id==='sidebar' ? 'white' : 'white',
        overflow: 'hidden', position: 'relative', fontSize: '28%',
      }}>
        {/* Template-specific thumbnails */}
        {t.id==='nova' && (
          <div style={{ padding: '12px 14px', fontFamily: 'monospace' }}>
            <div style={{ fontSize: '2.8em', fontWeight: 900,
              background: 'linear-gradient(90deg,#00fff0,#a78bfa)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              marginBottom: 4 }}>{data.name||'JANE SMITH'}</div>
            <div style={{ fontSize: '1.6em', color: '#7fffd4', letterSpacing: '.1em', marginBottom: 8 }}>
              {data.title||'SOFTWARE ENGINEER'}
            </div>
            <div style={{ height: 1, background: 'linear-gradient(90deg,rgba(0,255,240,.4),transparent)', marginBottom: 8 }} />
            <div style={{ fontSize: '1.5em', color: '#9ec8c0' }}>EXPERIENCE ›</div>
            <div style={{ fontSize: '1.3em', color: '#6ee7b7', marginTop: 4 }}>Senior Dev · Google · 2021–Now</div>
          </div>
        )}
        {t.id==='executive' && (
          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontFamily: 'serif', fontSize: '2.6em', fontWeight: 700, marginBottom: 3 }}>{data.name||'Jane Smith'}</div>
            <div style={{ fontSize: '1.5em', color: '#888', letterSpacing: '.08em', marginBottom: 6 }}>{data.title||'Senior Executive'}</div>
            <div style={{ height: 2, background: '#b8960c', marginBottom: 8 }} />
            <div style={{ fontSize: '1.5em', fontFamily: 'serif', fontWeight: 700, marginBottom: 4, color: '#555' }}>EXPERIENCE</div>
            <div style={{ height: 1, background: '#e0d5a0', marginBottom: 4 }} />
            <div style={{ fontSize: '1.4em', fontWeight: 600 }}>Senior Manager</div>
            <div style={{ fontSize: '1.2em', color: '#b8960c' }}>McKinsey & Co · 2020–2024</div>
          </div>
        )}
        {t.id==='minimal' && (
          <div style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: '2.4em', fontWeight: 700, letterSpacing: '-.02em', marginBottom: 3 }}>{data.name||'Jane Smith'}</div>
            <div style={{ fontSize: '1.4em', color: '#999', marginBottom: 7 }}>{data.title||'Product Designer'}</div>
            <div style={{ height: 1, background: '#eee', marginBottom: 7 }} />
            <div style={{ fontSize: '1.2em', color: '#999', letterSpacing: '.18em', textTransform:'uppercase', marginBottom: 5 }}>EXPERIENCE</div>
            <div style={{ fontSize: '1.4em', fontWeight: 600 }}>Lead Designer</div>
            <div style={{ fontSize: '1.2em', color: '#aaa' }}>Figma · 2022–Present</div>
          </div>
        )}
        {t.id==='sidebar' && (
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ width: 70, background: '#1e3a5f', padding: '12px 8px' }}>
              <div style={{ fontSize: '1.8em', fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: 5 }}>
                {data.name || 'Jane Smith'}
              </div>
              <div style={{ fontSize: '1.2em', color: '#90c4f0', marginBottom: 10 }}>{data.title||'Engineer'}</div>
              <div style={{ fontSize: '1.2em', color: '#90c4f0', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Skills</div>
              {['React','Python','AWS'].map(s => <div key={s} style={{ fontSize: '1.2em', color: '#c8e4f8', borderBottom: '1px solid rgba(255,255,255,.1)', paddingBottom: 3, marginBottom: 3 }}>{s}</div>)}
            </div>
            <div style={{ flex: 1, padding: '12px 10px' }}>
              <div style={{ fontSize: '1.3em', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#1e3a5f', borderBottom: '2px solid #1e3a5f', paddingBottom: 2, marginBottom: 6 }}>Experience</div>
              <div style={{ fontSize: '1.4em', fontWeight: 600 }}>Senior Dev</div>
              <div style={{ fontSize: '1.2em', color: '#888' }}>Google · 2020–Now</div>
            </div>
          </div>
        )}
        {t.id==='bold' && (
          <div>
            <div style={{ background: '#ff3c5f', padding: '12px 14px' }}>
              <div style={{ fontSize: '2.8em', fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '-.01em' }}>
                {data.name||'JANE SMITH'}
              </div>
              <div style={{ fontSize: '1.5em', color: 'rgba(255,255,255,.75)', textTransform:'uppercase' }}>{data.title||'PRODUCT MANAGER'}</div>
            </div>
            <div style={{ padding: '8px 14px' }}>
              <div style={{ display: 'inline-block', background: '#ff3c5f', color: 'white', padding: '2px 8px', fontSize: '1.3em', fontWeight: 900, textTransform:'uppercase', marginBottom: 5 }}>EXPERIENCE</div>
              <div style={{ fontSize: '1.4em', fontWeight: 700 }}>VP Product</div>
              <div style={{ fontSize: '1.2em', color: '#ff3c5f' }}>Stripe · 2019–Present</div>
            </div>
          </div>
        )}
        {t.id==='academic' && (
          <div style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'serif', fontSize: '2.4em', fontWeight: 700, color: '#2c1810', marginBottom: 2 }}>{data.name||'Dr. Jane Smith'}</div>
            <div style={{ fontSize: '1.4em', color: '#8b4513', fontStyle: 'italic', marginBottom: 7 }}>{data.title||'Assistant Professor'}</div>
            <div style={{ height: 2, background: '#2c1810', marginBottom: 7 }} />
            <div style={{ fontFamily: 'serif', fontSize: '1.6em', fontWeight: 700, color: '#2c1810', textAlign: 'left', marginBottom: 4 }}>Education</div>
            <div style={{ fontSize: '1.3em', fontWeight: 600, textAlign: 'left' }}>PhD Computer Science</div>
            <div style={{ fontSize: '1.2em', color: '#8b4513', fontStyle: 'italic', textAlign: 'left' }}>MIT · 2018</div>
          </div>
        )}
        {/* Active overlay */}
        {tpl === t.id && (
          <div style={{ position: 'absolute', inset: 0,
            background: 'rgba(20,255,180,.08)', border: '2px solid #14ffb4',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: 6 }}>
            <span style={{ background: '#14ffb4', color: '#060a09',
              fontFamily: 'Fira Code,monospace', fontSize: 9, fontWeight: 700,
              padding: '2px 7px', borderRadius: 2 }}>✓ ACTIVE</span>
          </div>
        )}
      </div>
    );
  };

  /* ── Section accordion ── */
  const Sec = ({ title, badge, children, open: defaultOpen=false }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <div className="acc-wrap panel">
        <button className="acc-head" onClick={() => setOpen(o => !o)}>
          <span className="acc-title">
            {title}
            {badge > 0 && <span className="acc-badge">{badge}</span>}
          </span>
          <span className="acc-arrow" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div key="body"
              initial={{ height: 0, opacity: 0 }} animate={{ height:'auto', opacity:1 }}
              exit={{ height: 0, opacity: 0 }} style={{ overflow:'hidden' }}>
              <div className="acc-body">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const L = ({children}) => <label className="lbl">{children}</label>;
  const G = ({cols=2, children}) => <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap:9 }}>{children}</div>;

  /* ════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {dark && <div className="scanline" />}

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <div style={{
              width:32, height:32, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:16, borderRadius: dark?3:9,
              border: dark?'1px solid rgba(20,255,180,.35)':'none',
              background: dark?'rgba(20,255,180,.07)':'linear-gradient(135deg,#0d3320,#1a5c38)',
              boxShadow: dark?'0 0 16px rgba(20,255,180,.2)':'0 3px 10px rgba(13,51,32,.35)',
            }}>📄</div>
            <div>
              <div style={{ fontFamily:"'Fraunces',serif", fontWeight:700, fontSize:16, color:'var(--tx)', lineHeight:1 }}>
                Resume<span style={{ color:'var(--acc)' }}>Maker</span>
                <span style={{ fontFamily:"'Fira Code',monospace", fontSize:9, color:'var(--txm)', marginLeft:7 }}>v1.0</span>
              </div>
              <div style={{ fontFamily:"'Fira Code',monospace", fontSize:8, color:'var(--tx3)', letterSpacing:'.12em', textTransform:'uppercase', marginTop:1 }}>
                Document Tools #1 · 6 templates · AI-powered
              </div>
            </div>
          </div>

          <div style={{ flex:1 }} />

          {/* Completion bar */}
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <div style={{ width:90 }}>
              <div className="prog"><div className="prog-bar" style={{ width:`${pct}%` }} /></div>
              <div style={{ fontFamily:"'Fira Code',monospace", fontSize:8, color:'var(--txm)', textAlign:'right' }}>{pct}% complete</div>
            </div>
          </div>

          <button onClick={() => setDark(d=>!d)} style={{
            display:'flex', alignItems:'center', gap:6, padding:'4px 10px',
            border: dark?'1px solid rgba(20,255,180,.18)':'1.5px solid var(--bdr)',
            borderRadius: dark?3:7, background:'transparent', cursor:'pointer',
          }}>
            <div style={{ width:28, height:14, borderRadius:8, position:'relative',
              background: dark?'var(--acc)':'#b8ddc8',
              boxShadow: dark?'0 0 8px rgba(20,255,180,.5)':'none' }}>
              <div style={{ position:'absolute', top:2.5,
                left: dark?'auto':2, right: dark?2:'auto',
                width:9, height:9, borderRadius:'50%',
                background: dark?'#060a09':'white', transition:'all .2s' }} />
            </div>
            <span style={{ fontFamily:"'Fira Code',monospace", fontSize:8.5, color:'var(--txm)' }}>
              {dark?'VOID':'LIGHT'}
            </span>
          </button>
        </div>

        {/* TABS */}
        <div className="tabbar">
          {TABS.map(t => (
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="body">

          {/* ── SIDEBAR ── */}
          <div className="sidebar">
            

            <div>
              <div className="slbl">Active template</div>
              {TEMPLATES.map(t => (
                <button key={t.id}
                  onClick={() => setTpl(t.id)}
                  style={{
                    width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'7px 9px', marginBottom:4,  cursor:'pointer',
                    border: tpl===t.id ? `1px solid var(--acc)` : dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                    borderRadius: dark?3:7,
                    background: tpl===t.id ? (dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)') : 'transparent',
                  }}>
                  <div style={{ textAlign:'left' }}>
                    <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:11.5, fontWeight:600, color: tpl===t.id?'var(--acc)':'var(--tx)' }}>{t.label}</div>
                    <div style={{ fontFamily:"'Fira Code',monospace", fontSize:8, color:'var(--txm)', marginTop:1 }}>{t.tag}</div>
                  </div>
                  {tpl===t.id && <span style={{ fontSize:10, color:'var(--acc)' }}>✓</span>}
                </button>
              ))}
            </div>

            <div>
              <div className="slbl">Completeness</div>
              {[
                ['Name',       !!data.name],
                ['Title',      !!data.title],
                ['Contact',    !!data.email],
                ['Summary',    !!data.summary],
                ['Experience', data.experience.length>0],
                ['Education',  data.education.length>0],
                ['Skills',     !!data.skills],
              ].map(([l, done]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'4px 9px', marginBottom:3, borderRadius: dark?2:6,
                  background: done?(dark?'rgba(20,255,180,.04)':'rgba(13,51,32,.04)'):'transparent',
                  border: done?(dark?'1px solid rgba(20,255,180,.1)':'1.5px solid rgba(13,51,32,.08)'):
                    (dark?'1px solid transparent':'1.5px solid transparent') }}>
                  <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:10.5, color: done?'var(--tx)':'var(--txm)' }}>{l}</span>
                  <span style={{ fontSize:11 }}>{done ? '✓' : '○'}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="slbl">Export</div>
              <button className="gbtn" onClick={printResume}
                style={{ width:'100%', justifyContent:'flex-start', marginBottom:5, padding:'7px 10px' }}>
                🖨 Print / Save PDF
              </button>
              <button className="gbtn"
                onClick={() => {
                  const txt = [data.name,data.title,data.email,data.phone,data.location,'',
                    data.summary?'SUMMARY\n'+data.summary:'',
                    data.experience.length?'\nEXPERIENCE\n'+data.experience.map(e=>`${e.role} @ ${e.company} (${e.period})\n${e.bullets}`).join('\n\n'):'',
                    data.skills?'\nSKILLS\n'+data.skills:'',
                  ].filter(Boolean).join('\n');
                  try { navigator.clipboard.writeText(txt); } catch {}
                }}
                style={{ width:'100%', justifyContent:'flex-start', padding:'7px 10px' }}>
                ⎘ Copy plain text
              </button>
            </div>

            
          </div>

          {/* ── MAIN ── */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ╔═══ BUILD ═══╗ */}
              {tab==='build' && (
                <motion.div key="build" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{ display:'flex', flexDirection:'column', gap:0 }}>

                  <Sec title="Personal Information" open>
                    <G>
                      {[
                        ['Full name','name','text','Jane Smith'],
                        ['Job title','title','text','Senior Software Engineer'],
                        ['Email','email','email','jane@example.com'],
                        ['Phone','phone','tel','+1 555 000 1234'],
                        ['Location','location','text','New York, NY'],
                        ['LinkedIn / Website','linkedin','text','linkedin.com/in/jane'],
                      ].map(([label,key,type,ph]) => (
                        <div key={key}>
                          <L>{label}</L>
                          <input className="fi" type={type} placeholder={ph}
                            value={data[key]||''} onChange={e=>set(key,e.target.value)} />
                        </div>
                      ))}
                    </G>
                  </Sec>

                  <Sec title="Professional Summary" open>
                    <textarea className="fi" rows={4}
                      placeholder="A results-driven engineer with 7+ years of experience building scalable systems…"
                      value={data.summary||''} onChange={e=>set('summary',e.target.value)} />
                    <button className="gbtn" style={{ marginTop:7 }}
                      onClick={() => { setTab('ai'); setAiMode('summary'); setAiCtx(data.name+', '+data.title); }}>
                      ✦ Generate with AI
                    </button>
                  </Sec>

                  <Sec title="Work Experience" badge={data.experience.length} open>
                    <AnimatePresence>
                      {data.experience.map((exp,i) => (
                        <motion.div key={exp.id} className="ec"
                          initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:9 }}>
                            <span style={{ fontFamily:"'Fira Code',monospace", fontSize:10, color:'var(--acc)' }}>
                              #{String(i+1).padStart(2,'0')}
                            </span>
                            <button onClick={()=>remExp(exp.id)}
                              style={{ background:'none', border:'none', cursor:'pointer', color:'var(--txm)', fontSize:15 }}>×</button>
                          </div>
                          <G>
                            <div><L>Job title</L>
                              <input className="fi" placeholder="Software Engineer" value={exp.role||''} onChange={e=>updExp(exp.id,'role',e.target.value)} /></div>
                            <div><L>Company</L>
                              <input className="fi" placeholder="Google" value={exp.company||''} onChange={e=>updExp(exp.id,'company',e.target.value)} /></div>
                            <div style={{ gridColumn:'1/-1' }}><L>Period</L>
                              <input className="fi" placeholder="Jan 2022 – Present" value={exp.period||''} onChange={e=>updExp(exp.id,'period',e.target.value)} /></div>
                          </G>
                          <div style={{ marginTop:8 }}>
                            <L>Responsibilities & achievements (one per line)</L>
                            <textarea className="fi" rows={4}
                              placeholder={"Led backend migration to microservices — 40% faster response\nBuilt CI/CD pipeline reducing deployments from 2hrs to 8min\nMentored 4 junior engineers across 2 teams"}
                              value={exp.bullets||''} onChange={e=>updExp(exp.id,'bullets',e.target.value)} />
                          </div>
                          <button className="gbtn" style={{ marginTop:6, fontSize:9.5 }}
                            onClick={() => { setTab('ai'); setAiMode('bullets'); setAiCtx(exp.role+' at '+exp.company); }}>
                            ✦ AI bullet points
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <button className="gbtn" onClick={addExp}>+ Add experience</button>
                  </Sec>

                  <Sec title="Education" badge={data.education.length}>
                    <AnimatePresence>
                      {data.education.map((edu,i) => (
                        <motion.div key={edu.id} className="ec"
                          initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:9 }}>
                            <span style={{ fontFamily:"'Fira Code',monospace", fontSize:10, color:'var(--acc)' }}>#{String(i+1).padStart(2,'0')}</span>
                            <button onClick={()=>remEdu(edu.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--txm)', fontSize:15 }}>×</button>
                          </div>
                          <G>
                            <div style={{ gridColumn:'1/-1' }}><L>Degree</L>
                              <input className="fi" placeholder="B.Sc. Computer Science" value={edu.degree||''} onChange={e=>updEdu(edu.id,'degree',e.target.value)} /></div>
                            <div><L>Institution</L>
                              <input className="fi" placeholder="MIT" value={edu.school||''} onChange={e=>updEdu(edu.id,'school',e.target.value)} /></div>
                            <div><L>Year</L>
                              <input className="fi" placeholder="2020" value={edu.year||''} onChange={e=>updEdu(edu.id,'year',e.target.value)} /></div>
                            <div style={{ gridColumn:'1/-1' }}><L>Grade / GPA / Honours</L>
                              <input className="fi" placeholder="3.9/4.0 — Dean's List" value={edu.grade||''} onChange={e=>updEdu(edu.id,'grade',e.target.value)} /></div>
                          </G>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <button className="gbtn" onClick={addEdu}>+ Add education</button>
                  </Sec>

                  <Sec title="Skills">
                    <textarea className="fi" rows={3}
                      placeholder="React, TypeScript, Python, AWS, Docker, PostgreSQL, GraphQL, CI/CD…"
                      value={data.skills||''} onChange={e=>set('skills',e.target.value)} />
                    {data.skills && (
                      <div style={{ marginTop:8 }}>
                        {data.skills.split(/[,\n]/).map(s=>s.trim()).filter(Boolean).map((s,i) => (
                          <span key={i} className="chip">{s}</span>
                        ))}
                      </div>
                    )}
                    <button className="gbtn" style={{ marginTop:7 }}
                      onClick={() => { setTab('ai'); setAiMode('skills'); setAiCtx(data.title||''); }}>
                      ✦ Generate with AI
                    </button>
                  </Sec>

                  <Sec title="Certifications" badge={data.certifications.length}>
                    <AnimatePresence>
                      {data.certifications.map((c,i) => (
                        <motion.div key={c.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                          style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto auto', gap:8, marginBottom:8, alignItems:'flex-end' }}>
                          <div><L>Name</L><input className="fi" placeholder="AWS Solutions Architect" value={c.name||''} onChange={e=>updCert(c.id,'name',e.target.value)} /></div>
                          <div><L>Issuer</L><input className="fi" placeholder="Amazon" value={c.org||''} onChange={e=>updCert(c.id,'org',e.target.value)} /></div>
                          <div><L>Year</L><input className="fi" placeholder="2023" style={{ width:68 }} value={c.year||''} onChange={e=>updCert(c.id,'year',e.target.value)} /></div>
                          <button onClick={()=>remCert(c.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--txm)', fontSize:15, paddingBottom:3 }}>×</button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <button className="gbtn" onClick={addCert}>+ Add certification</button>
                  </Sec>

                  <Sec title="Languages">
                    <input className="fi" placeholder="English (Native), Hindi (Fluent), French (Basic)"
                      value={data.languages||''} onChange={e=>set('languages',e.target.value)} />
                  </Sec>

                  
                </motion.div>
              )}

              {/* ╔═══ AI WRITE ═══╗ */}
              {tab==='ai' && (
                <motion.div key="ai" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{ display:'flex', flexDirection:'column', gap:12 }}>

                  {/* Mode selector */}
                  <div className="panel" style={{ padding:'14px 16px' }}>
                    <div className="lbl" style={{ marginBottom:11 }}>✦ What should AI write?</div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
                      {[
                        { id:'summary', icon:'📝', label:'Professional Summary',   desc:'3-4 impactful sentences' },
                        { id:'bullets', icon:'⚡', label:'Job Bullet Points',       desc:'4 action-verb achievements' },
                        { id:'skills',  icon:'🛠', label:'Skills List',             desc:'14 relevant skills' },
                        { id:'improve', icon:'✨', label:'Improve Existing Text',   desc:'ATS-friendly rewrite' },
                      ].map(({id,icon,label,desc}) => (
                        <button key={id} className={`gbtn ${aiMode===id?'on':''}`}
                          onClick={() => setAiMode(id)}
                          style={{ flexDirection:'column', gap:4, height:'auto', padding:'11px 12px',
                            alignItems:'flex-start',
                            background: aiMode===id ? (dark?'rgba(20,255,180,.07)':'rgba(13,51,32,.06)') : '' }}>
                          <span style={{ fontSize:18 }}>{icon}</span>
                          <span style={{ fontSize:11, fontWeight:600, color:'var(--tx)', textTransform:'none', letterSpacing:0 }}>{label}</span>
                          <span style={{ fontSize:9.5, opacity:.6, textTransform:'none', letterSpacing:0, fontFamily:"'Outfit',sans-serif" }}>{desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Context */}
                  <div className="panel" style={{ padding:'14px 16px' }}>
                    <div className="lbl" style={{ marginBottom:7 }}>
                      {aiMode==='improve' ? 'Paste text to improve' : 'Your context / role / industry'}
                    </div>
                    <textarea className="fi" rows={aiMode==='improve'?5:3}
                      placeholder={
                        aiMode==='summary' ? 'e.g. "10 yrs backend engineering, Python/Go, led 15-person team at fintech startup"' :
                        aiMode==='bullets' ? 'e.g. "Senior Backend Engineer at Stripe, worked on payment APIs and fraud detection"' :
                        aiMode==='skills'  ? 'e.g. "Full-stack developer specialising in React, Node.js and AWS cloud"' :
                        'Paste your existing resume text here to improve it…'
                      }
                      value={aiCtx} onChange={e=>setAiCtx(e.target.value)} />
                    <div style={{ display:'flex', gap:8, marginTop:10, alignItems:'center' }}>
                      <button className="btn" onClick={runAI} disabled={aiLoad} style={{ padding:'9px 24px' }}>
                        {aiLoad
                          ? <><span style={{ display:'inline-block', animation:'spin .8s linear infinite' }}>⟳</span>&nbsp;Writing…</>
                          : '✦ Generate'}
                      </button>
                      {aiOut && !aiLoad && (
                        <button className="gbtn" onClick={applyAI}
                          style={{ borderColor:'var(--acc)', color:'var(--acc)' }}>
                          → Apply to {aiMode==='summary'?'Summary':aiMode==='skills'?'Skills':'field'}
                        </button>
                      )}
                      {aiOut && !aiLoad && (
                        <button className="gbtn" onClick={()=>{try{navigator.clipboard.writeText(aiOut)}catch{}}}>
                          ⎘ Copy
                        </button>
                      )}
                    </div>
                    {aiErr && (
                      <div style={{ marginTop:8, padding:'7px 11px', borderRadius:dark?3:8,
                        background:dark?'rgba(255,107,107,.06)':'rgba(153,27,27,.04)',
                        border:dark?'1px solid rgba(255,107,107,.2)':'1.5px solid rgba(153,27,27,.12)',
                        fontFamily:"'Outfit',sans-serif", fontSize:12, color:'var(--err)' }}>⚠ {aiErr}</div>
                    )}
                  </div>

                  {/* AI Output */}
                  {(aiOut||aiLoad) && (
                    <div>
                      <div className="lbl" style={{ marginBottom:7 }}>✦ AI Output</div>
                      <div className="ai-box">
                        {aiOut}
                        {aiLoad && <span className="cur" />}
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  <div className="panel" style={{ padding:'13px 15px' }}>
                    <div className="lbl" style={{ marginBottom:9 }}>Pro tips</div>
                    {[
                      'Mention specific technologies, team sizes, and impact metrics in your context',
                      'For bullet points: "Senior React dev at Stripe working on fraud detection dashboard"',
                      'Run AI multiple times — you get different outputs each time, pick the best',
                      'Improve mode: paste your weakest section and watch AI transform it',
                    ].map((tip,i) => (
                      <div key={i} style={{ display:'flex', gap:8, marginBottom:8, alignItems:'flex-start' }}>
                        <span style={{ color:'var(--acc)', flexShrink:0, fontFamily:"'Fira Code',monospace", fontSize:10, marginTop:2 }}>›</span>
                        <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, color:'var(--tx2)', lineHeight:1.65 }}>{tip}</span>
                      </div>
                    ))}
                  </div>

                  
                </motion.div>
              )}

              {/* ╔═══ PREVIEW ═══╗ */}
              {tab==='preview' && (
                <motion.div key="preview" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ display:'flex', gap:9, alignItems:'center', flexWrap:'wrap' }}>
                    <button className="btn" onClick={printResume} style={{ padding:'9px 22px' }}>
                      🖨 Print / Save as PDF
                    </button>
                    <button className="gbtn" onClick={()=>setTab('templates')}>▦ Change template</button>
                    <div style={{ fontFamily:"'Fira Code',monospace", fontSize:9.5, color:'var(--txm)' }}>
                      Template: <span style={{ color:'var(--acc)' }}>{TEMPLATES.find(t=>t.id===tpl)?.label}</span>
                      &nbsp;·&nbsp;{TEMPLATES.find(t=>t.id===tpl)?.tag}
                    </div>
                  </div>
                  <div className="preview-bg">
                    <div dangerouslySetInnerHTML={{ __html: buildHTML(data, tpl) }}
                      style={{
                         color:'#111',
                        maxWidth: 794, margin:'0 auto',
                        fontFamily:"'Outfit',sans-serif", lineHeight:1.55,
                        boxShadow:'0 6px 48px rgba(0,0,0,.35)',
                        ...(tpl==='nova' ? { background:'#06090f', color:'#e0f7ff' } : {}),
                        ...(tpl==='sidebar' ? { display:'grid', gridTemplateColumns:'200px 1fr', minHeight:500 } : {}),
                      }} />
                  </div>
                  
                </motion.div>
              )}

              {/* ╔═══ TEMPLATES ═══╗ */}
              {tab==='templates' && (
                <motion.div key="templates" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:14, color:'var(--tx2)', lineHeight:1.7, marginBottom:2 }}>
                    Choose a template — click to activate, then go to <strong style={{ color:'var(--acc)' }}>◉ Preview</strong> to see your resume.
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:13 }}>
                    {TEMPLATES.map(t => (
                      <motion.div key={t.id} whileHover={{ y:-3 }} className={`tpl-card ${tpl===t.id?'active':''}`}
                        onClick={() => setTpl(t.id)}>
                        <TplThumb t={t} />
                        <div style={{ padding:'10px 13px', display:'flex', justifyContent:'space-between', alignItems:'center',
                          borderTop: dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          background: tpl===t.id ? (dark?'rgba(20,255,180,.05)':'rgba(13,51,32,.04)') : (dark?'var(--s2)':'var(--s1)') }}>
                          <div>
                            <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:12.5, fontWeight:600,
                              color: tpl===t.id?'var(--acc)':'var(--tx)' }}>{t.label}</div>
                            <div style={{ fontFamily:"'Fira Code',monospace", fontSize:8.5, color:'var(--txm)', marginTop:1 }}>{t.tag}</div>
                          </div>
                          {tpl===t.id
                            ? <span style={{ fontFamily:"'Fira Code',monospace", fontSize:9, color:'var(--acc)' }}>✓ Active</span>
                            : <span style={{ fontFamily:"'Fira Code',monospace", fontSize:9, color:'var(--txm)' }}>Click to use</span>}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Template descriptions */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10 }}>
                    {[
                      { id:'nova',     emoji:'🌌', title:'Nova',      body:'A cyberpunk-inspired dark template with neon teal accents and gradient typography. Perfect for tech roles in forward-thinking companies.' },
                      { id:'executive',emoji:'👔', title:'Executive',  body:'Classic serif typography with gold accents. Conveys authority and polish. Ideal for senior management, finance, and consulting roles.' },
                      { id:'minimal',  emoji:'○',  title:'Minimal',    body:'Clean, no-distractions layout with generous whitespace. Modern sans-serif throughout. Works for any industry, especially design and product.' },
                      { id:'sidebar',  emoji:'⊟',  title:'Sidebar',    body:'Two-column layout with dark navy sidebar for skills and contact. Maximises space. Great for engineering and data roles.' },
                      { id:'bold',     emoji:'🔴', title:'Bold',       body:'High-impact crimson header, heavy typography. Commands attention. Best for creative, marketing, and startup positions.' },
                      { id:'academic', emoji:'📚', title:'Academic',   body:'Elegant serif-centric centred header. Traditional academic formatting. Perfect for faculty applications, research, and PhD/PostDoc positions.' },
                    ].map(({ id, emoji, title, body }) => (
                      <div key={id} style={{ padding:'12px 14px', borderRadius:dark?3:9,
                        border: tpl===id ? `1px solid var(--acc)` : dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        background: tpl===id ? (dark?'rgba(20,255,180,.04)':'rgba(13,51,32,.04)') : (dark?'var(--s2)':'var(--s1)') }}>
                        <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
                          <span style={{ fontSize:16 }}>{emoji}</span>
                          <span style={{ fontFamily:"'Fraunces',serif", fontWeight:600, fontSize:13, color:'var(--tx)' }}>{title}</span>
                          {tpl===id && <span style={{ fontFamily:"'Fira Code',monospace", fontSize:8, color:'var(--acc)', marginLeft:'auto' }}>ACTIVE</span>}
                        </div>
                        <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:12.5, color:'var(--tx2)', lineHeight:1.65 }}>{body}</div>
                        {tpl!==id && (
                          <button className="gbtn" onClick={()=>setTpl(id)} style={{ marginTop:8, fontSize:9.5 }}>Use this template</button>
                        )}
                      </div>
                    ))}
                  </div>

                  
                </motion.div>
              )}

              {/* ╔═══ GUIDE ═══╗ */}
              {tab==='guide' && (
                <motion.div key="guide" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{ display:'flex', flexDirection:'column', gap:12 }}>

                  <div className="panel" style={{ padding:'20px 22px' }}>
                    <div style={{ fontFamily:"'Fraunces',serif", fontSize:22, fontWeight:700, color:'var(--tx)', marginBottom:4 }}>
                      How to build your resume in 5 minutes
                    </div>
                    <div style={{ fontFamily:"'Fira Code',monospace", fontSize:9, color:'var(--txm)', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:20 }}>
                      step-by-step · ai-powered · print-ready
                    </div>
                    {[
                      { n:1, t:'Fill Personal Info',   d:'Name, headline, email, phone, location. These appear at the top of every template. Your job title/headline is what recruiters see first — make it specific: "Senior React Engineer" beats "Developer".' },
                      { n:2, t:'Write your Summary',   d:'2–4 sentences capturing who you are, what you do, and your biggest achievement. Click "✦ Generate with AI" to get a professional draft — give it your years of experience and top skills in the context box.' },
                      { n:3, t:'Add Work Experience',  d:'List jobs in reverse chronological order (newest first). The bullet points are the most critical part. Use the AI bullet generator: describe your role and company, and AI writes achievement-focused bullets with metrics.' },
                      { n:4, t:'Pick your Template',   d:'Go to ▦ Templates. Nova for tech, Executive for management, Minimal for design/product, Sidebar for engineering, Bold for creative/marketing, Academic for research. Pick what fits your industry.' },
                      { n:5, t:'Preview & Export',     d:'◉ Preview shows your finished resume. Click "Print / Save as PDF" — in the print dialog, choose "Save as PDF" as the destination. Set margins to default or narrow. That\'s it!' },
                    ].map(({n,t,d}) => (
                      <div key={n} style={{ display:'flex', gap:12, marginBottom:16 }}>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                          <div className="step-num">{n}</div>
                          {n<5 && <div style={{ width:1.5, flex:1, marginTop:5,
                            background:dark?'rgba(20,255,180,.1)':'rgba(13,51,32,.12)' }} />}
                        </div>
                        <div style={{ flex:1, paddingBottom:4 }}>
                          <div style={{ fontFamily:"'Fraunces',serif", fontSize:15, fontWeight:600, color:'var(--tx)', marginBottom:4 }}>{t}</div>
                          <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:13.5, color:'var(--tx2)', lineHeight:1.72 }}>{d}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resume tips */}
                  <div className="panel" style={{ padding:'18px 22px' }}>
                    <div style={{ fontFamily:"'Fraunces',serif", fontSize:16, fontWeight:600, color:'var(--tx)', marginBottom:14 }}>
                      ✦ Resume best practices
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                      {[
                        { icon:'📏', t:'Keep it 1 page',     d:'For under 10 years experience. Recruiters spend ~6 seconds on a first scan.' },
                        { icon:'🎯', t:'Tailor per job',      d:'Mirror keywords from the job description. ATS systems filter by keyword matching.' },
                        { icon:'📊', t:'Quantify results',    d:'"Reduced load time 40%" > "improved performance". Numbers command attention.' },
                        { icon:'🔤', t:'Action verbs first',  d:'Led, Built, Reduced, Implemented, Launched. Never start bullets with "Responsible for".' },
                        { icon:'📂', t:'Reverse chrono',      d:'Newest job first, always. Gaps are fine — don\'t try to hide them with odd ordering.' },
                        { icon:'🤖', t:'ATS-friendly fonts',  d:'All 6 templates are ATS-safe. Avoid tables, text boxes, or headers/footers in DIY resumes.' },
                      ].map(({icon,t,d}) => (
                        <div key={t} style={{ padding:'11px 13px', borderRadius:dark?3:9,
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          background:dark?'rgba(0,0,0,.25)':'rgba(245,251,248,.8)' }}>
                          <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:5 }}>
                            <span style={{ fontSize:16 }}>{icon}</span>
                            <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, fontWeight:600, color:'var(--tx)' }}>{t}</span>
                          </div>
                          <div style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, color:'var(--tx2)', lineHeight:1.6 }}>{d}</div>
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