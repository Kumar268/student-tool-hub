import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   BIODATA MAKER — Document Tools Series #3
   Theme: Dark Midnight-Rose / Deep Magenta  ·  Light Ivory / Crimson
   Fonts: Cormorant Garamond · Nunito · JetBrains Mono
   Sections: Personal, Family, Physical, Horoscope/Religion,
             Education, Career, Contact, Preferences
   Templates: 6 (Traditional, Floral, Royal, Modern, Simple, Regal)
   AI: Anthropic streaming (bio paragraph, about me, family intro)
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Nunito:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&family=Cinzel:wght@400;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Nunito',sans-serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes rose-glow{0%,100%{box-shadow:0 0 0 0 rgba(244,114,182,.18)}50%{box-shadow:0 0 0 8px rgba(244,114,182,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(600%)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}

.dk{
  --bg:#080508;--s1:#0d080c;--s2:#130b10;--s3:#1a1018;
  --bdr:#2a1424;--bdr-hi:rgba(244,114,182,.25);
  --acc:#f472b6;--acc2:#fb7185;--acc3:#c084fc;--acc4:#fbbf24;
  --tx:#fff0f8;--tx2:#d490b4;--tx3:#2a1424;--txm:#6b3358;
  --err:#f87171;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 70% 40% at 50% -8%,rgba(244,114,182,.07),transparent),
    radial-gradient(ellipse 40% 50% at 92% 85%,rgba(192,132,252,.05),transparent),
    radial-gradient(ellipse 35% 45% at 8% 65%,rgba(251,113,133,.04),transparent);
}
.lt{
  --bg:#fdfaf8;--s1:#ffffff;--s2:#fdf4f7;--s3:#f8e8ef;
  --bdr:#e8c5d4;--bdr-hi:#8b1a3a;
  --acc:#8b1a3a;--acc2:#b91c55;--acc3:#7e22ce;--acc4:#d97706;
  --tx:#2d0a18;--tx2:#8b1a3a;--tx3:#e8c5d4;--txm:#c4627e;
  --err:#991b1b;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% -5%,rgba(139,26,58,.05),transparent);
}

.topbar{height:46px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:10px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(8,5,8,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(253,250,248,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(139,26,58,.06);}

.scanline{position:fixed;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,rgba(244,114,182,.3),transparent);
  animation:scan 5s linear infinite;pointer-events:none;z-index:999;}

.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:40px;padding:0 15px;border:none;cursor:pointer;background:transparent;
  border-bottom:2.5px solid transparent;font-family:'Nunito',sans-serif;font-size:11px;
  font-weight:600;letter-spacing:.04em;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--txm);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(244,114,182,.04);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#b07a8c;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(139,26,58,.04);font-weight:700;}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns:222px 1fr;min-height:calc(100vh - 86px);}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:14px 18px;display:flex;flex-direction:column;gap:14px;overflow-x:hidden;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(139,26,58,.05);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 22px;cursor:pointer;
  font-family:'Nunito',sans-serif;font-size:11.5px;font-weight:700;letter-spacing:.04em;transition:all .16s;border:none;}
.dk .btn{background:var(--acc);color:#080508;border-radius:3px;animation:rose-glow 2.8s infinite;}
.dk .btn:hover{background:#ff8ed4;transform:translateY(-1px);animation:none;box-shadow:0 0 28px rgba(244,114,182,.55);}
.dk .btn:disabled{opacity:.3;cursor:not-allowed;animation:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:9px;box-shadow:0 4px 14px rgba(139,26,58,.28);}
.lt .btn:hover{background:var(--acc2);transform:translateY(-1px);box-shadow:0 8px 24px rgba(139,26,58,.38);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;}
.gbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;cursor:pointer;
  font-family:'Nunito',sans-serif;font-size:10px;font-weight:600;background:transparent;transition:all .13s;border:none;}
.dk .gbtn{border:1px solid var(--bdr);border-radius:3px;color:var(--txm);}
.dk .gbtn:hover,.dk .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(244,114,182,.05);}
.lt .gbtn{border:1.5px solid var(--bdr);border-radius:7px;color:var(--txm);}
.lt .gbtn:hover,.lt .gbtn.on{border-color:var(--acc);color:var(--acc);background:rgba(139,26,58,.04);}

.fi{width:100%;outline:none;font-family:'Nunito',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;resize:vertical;}
.dk .fi{background:rgba(0,0,0,.45);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(244,114,182,.1);}
.lt .fi{background:#fff8fb;border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx);}
.lt .fi:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(139,26,58,.08);}
.fi::placeholder{opacity:.3;}

.acc-wrap{margin-bottom:10px;}
.acc-head{width:100%;display:flex;justify-content:space-between;align-items:center;
  padding:11px 15px;background:transparent;border:none;cursor:pointer;transition:background .13s;}
.dk .acc-head{border-bottom:1px solid var(--bdr);}
.lt .acc-head{border-bottom:1.5px solid var(--bdr);}
.dk .acc-head:hover{background:rgba(244,114,182,.025);}
.lt .acc-head:hover{background:rgba(139,26,58,.02);}
.acc-title{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:600;color:var(--tx);}
.acc-badge{font-family:'JetBrains Mono',monospace;font-size:9px;padding:1px 6px;border-radius:99px;margin-left:7px;}
.dk .acc-badge{background:rgba(244,114,182,.1);border:1px solid rgba(244,114,182,.22);color:var(--acc);}
.lt .acc-badge{background:rgba(139,26,58,.08);border:1.5px solid rgba(139,26,58,.18);color:var(--acc);}
.acc-body{padding:13px 15px 15px;}

.ec{padding:13px 14px;margin-bottom:10px;position:relative;}
.dk .ec{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.35);}
.lt .ec{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(255,248,251,.8);}
.dk .ec::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;
  background:linear-gradient(180deg,var(--acc),var(--acc3));border-radius:2px 0 0 2px;opacity:.55;}

.ai-box{font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.78;
  padding:15px 17px;min-height:60px;white-space:pre-wrap;word-break:break-word;}
.dk .ai-box{color:#ffb3d4;background:rgba(0,0,0,.5);border:1px solid rgba(244,114,182,.12);border-radius:4px;}
.lt .ai-box{color:#2d0a18;background:#fce8f0;border:1.5px solid rgba(139,26,58,.14);border-radius:10px;}
.cur{display:inline-block;width:7px;height:13px;background:var(--acc);animation:blink .7s infinite;vertical-align:text-bottom;margin-left:1px;}

.lbl{font-family:'Nunito',sans-serif;font-size:9px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(244,114,182,.45);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;}
.dk .slbl{color:rgba(244,114,182,.3);}
.lt .slbl{color:var(--acc);}

.photo-slot{width:90px;height:110px;display:flex;align-items:center;justify-content:center;
  cursor:pointer;flex-shrink:0;overflow:hidden;position:relative;}
.dk .photo-slot{border:2px dashed rgba(244,114,182,.25);border-radius:4px;background:rgba(244,114,182,.03);}
.lt .photo-slot{border:2px dashed rgba(139,26,58,.22);border-radius:10px;background:rgba(253,244,247,.6);}
.photo-slot:hover{border-style:solid;}
.photo-slot input{position:absolute;inset:0;opacity:0;cursor:pointer;}

.tpl-card{cursor:pointer;transition:all .18s;overflow:hidden;}
.dk .tpl-card{border:1px solid var(--bdr);border-radius:4px;}
.lt .tpl-card{border:1.5px solid var(--bdr);border-radius:12px;}
.tpl-card:hover{transform:translateY(-2px);}
.dk .tpl-card:hover{box-shadow:0 0 22px rgba(244,114,182,.16);}
.lt .tpl-card:hover{box-shadow:0 8px 28px rgba(139,26,58,.12);}
.tpl-card.active{border-color:var(--acc)!important;}

.prog{height:3px;border-radius:2px;overflow:hidden;margin-bottom:5px;}
.dk .prog{background:rgba(244,114,182,.1);}
.lt .prog{background:rgba(139,26,58,.08);}
.prog-bar{height:100%;border-radius:2px;transition:width .4s ease;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc3));}

.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(244,114,182,.01);border:1px dashed rgba(244,114,182,.09);border-radius:3px;}
.lt .ad{background:rgba(139,26,58,.015);border:1.5px dashed rgba(139,26,58,.1);border-radius:9px;}
.ad span{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

.preview-bg{padding:28px;overflow:auto;border-radius:4px;}
.dk .preview-bg{background:var(--s3);}
.lt .preview-bg{background:#eddae4;}

.step-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;flex-shrink:0;}
.dk .step-num{border:1px solid rgba(244,114,182,.3);background:rgba(244,114,182,.07);color:var(--acc);}
.lt .step-num{border:1.5px solid rgba(139,26,58,.25);background:rgba(139,26,58,.06);color:var(--acc);}
`;

/* ═══════════════════════════════════════════════════════════════
   PRINT CSS — 6 BIODATA TEMPLATES
═══════════════════════════════════════════════════════════════ */
const PRINT_CSS = {
  traditional: `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@400;600;700&display=swap');
    body{font-family:'Nunito',sans-serif;color:#1a0a0f;background:white;}
    @media print{@page{margin:.55in}}
    .resume{padding:40px 46px;}
    .header{text-align:center;padding-bottom:16px;border-bottom:2px solid #8b1a3a;margin-bottom:16px;}
    .nm{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:#8b1a3a;letter-spacing:.02em;}
    .hl{font-family:'Cormorant Garamond',serif;font-size:14px;font-style:italic;color:#555;margin-top:4px;}
    .photo{width:90px;height:110px;object-fit:cover;border:2px solid #d4a0b0;float:right;margin:0 0 12px 16px;}
    .st{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
      color:#8b1a3a;margin:14px 0 6px;padding-bottom:3px;border-bottom:1px solid #e0b0c0;}
    .row{display:flex;margin-bottom:5px;font-size:12.5px;}
    .row-lbl{min-width:140px;font-weight:600;color:#8b1a3a;flex-shrink:0;}
    .row-val{color:#222;}
    .divider{clear:both;}
    .eb{font-size:12.5px;color:#333;white-space:pre-wrap;line-height:1.7;}
    .ornament{text-align:center;font-size:18px;color:#8b1a3a;margin:8px 0;}
  `,
  floral: `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Nunito:wght@400;600;700&display=swap');
    body{font-family:'Nunito',sans-serif;color:#2d0a18;background:white;}
    @media print{@page{margin:.5in}}
    .resume{padding:36px 44px;position:relative;}
    .corner{position:absolute;font-size:28px;opacity:.35;color:#c2185b;}
    .corner.tl{top:14px;left:16px}
    .corner.tr{top:14px;right:16px}
    .corner.bl{bottom:14px;left:16px}
    .corner.br{bottom:14px;right:16px}
    .header{text-align:center;padding:14px 0 16px;border-top:2.5px double #c2185b;border-bottom:2.5px double #c2185b;margin-bottom:16px;}
    .nm{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:#8b1a3a;
      letter-spacing:.04em;}
    .hl{font-family:'Cormorant Garamond',serif;font-size:13px;font-style:italic;color:#777;margin-top:4px;}
    .photo{width:85px;height:105px;object-fit:cover;border-radius:50%;border:3px solid #e0a0b8;float:right;margin:0 0 12px 16px;}
    .st{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:700;color:#8b1a3a;
      text-align:center;margin:14px 0 8px;letter-spacing:.08em;text-transform:uppercase;}
    .st-line{height:1px;background:linear-gradient(90deg,transparent,#e0b0c0,transparent);margin-bottom:8px;}
    .row{display:flex;margin-bottom:5px;font-size:12.5px;}
    .row-lbl{min-width:140px;font-weight:600;color:#b03060;flex-shrink:0;}
    .row-val{color:#222;}
    .divider{clear:both;}
    .eb{font-size:12.5px;color:#333;white-space:pre-wrap;line-height:1.7;}
    .ornament{text-align:center;font-size:16px;color:#c2185b;margin:6px 0;letter-spacing:.2em;}
  `,
  royal: `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:wght@400;600&display=swap');
    body{font-family:'Libre Baskerville',serif;color:#1a1200;background:white;}
    @media print{@page{margin:.5in}}
    .resume{padding:0;border:8px solid #b8960c;}
    .inner{padding:36px 44px;}
    .header{text-align:center;background:#b8960c;padding:20px 32px;margin:-36px -44px 20px;color:white;}
    .nm{font-family:'Cinzel',serif;font-size:26px;font-weight:700;color:white;letter-spacing:.06em;}
    .hl{font-family:'Cinzel',serif;font-size:11px;color:rgba(255,255,255,.8);letter-spacing:.12em;margin-top:5px;text-transform:uppercase;}
    .photo{width:85px;height:105px;object-fit:cover;border:3px solid #b8960c;float:right;margin:0 0 12px 16px;}
    .st{font-family:'Cinzel',serif;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.12em;
      color:#8b6f00;margin:14px 0 6px;padding-bottom:4px;border-bottom:1.5px solid #d4a800;}
    .row{display:flex;margin-bottom:5px;font-size:12.5px;}
    .row-lbl{min-width:145px;font-weight:700;color:#8b6f00;flex-shrink:0;}
    .row-val{color:#1a1200;}
    .divider{clear:both;}
    .eb{font-size:12.5px;color:#333;white-space:pre-wrap;line-height:1.7;}
    .ornament{text-align:center;font-size:18px;color:#b8960c;margin:6px 0;}
  `,
  modern: `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap');
    body{font-family:'Nunito',sans-serif;color:#111;background:white;}
    @media print{@page{margin:.48in}}
    .resume{padding:0;}
    .header{background:linear-gradient(135deg,#1e0533,#6d1560);padding:28px 40px;color:white;display:flex;align-items:center;gap:20px;}
    .header-text{flex:1}
    .nm{font-size:26px;font-weight:800;color:white;letter-spacing:-.01em;}
    .hl{font-size:11.5px;color:rgba(255,255,255,.72);margin-top:4px;text-transform:uppercase;letter-spacing:.1em;}
    .photo{width:80px;height:100px;object-fit:cover;border-radius:8px;border:2.5px solid rgba(255,255,255,.35);flex-shrink:0;}
    .body-part{padding:24px 40px;}
    .st{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.18em;
      color:#6d1560;margin:14px 0 6px;}
    .divider-bar{height:2px;background:linear-gradient(90deg,#6d1560,#f472b6,transparent);margin-bottom:10px;}
    .row{display:flex;margin-bottom:5px;font-size:12.5px;}
    .row-lbl{min-width:140px;font-weight:700;color:#6d1560;flex-shrink:0;}
    .row-val{color:#1a0033;}
    .eb{font-size:12.5px;color:#333;white-space:pre-wrap;line-height:1.7;}
    .ornament{text-align:center;color:#f472b6;font-size:14px;margin:6px 0;}
  `,
  simple: `
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');
    body{font-family:'Nunito',sans-serif;color:#111;background:white;}
    @media print{@page{margin:.6in}}
    .resume{padding:48px 56px;}
    .header{margin-bottom:14px;padding-bottom:12px;border-bottom:2px solid #111;}
    .nm{font-size:24px;font-weight:700;color:#111;margin-bottom:2px;}
    .hl{font-size:12px;color:#888;margin-top:2px;}
    .photo{width:80px;height:100px;object-fit:cover;border:1px solid #ccc;float:right;margin:0 0 12px 16px;}
    .st{font-size:9.5px;font-weight:700;text-transform:uppercase;letter-spacing:.2em;color:#888;margin:14px 0 5px;}
    .row{display:flex;margin-bottom:5px;font-size:12.5px;}
    .row-lbl{min-width:145px;font-weight:600;color:#444;flex-shrink:0;}
    .row-val{color:#111;}
    .divider{clear:both;}
    .eb{font-size:12.5px;color:#444;white-space:pre-wrap;line-height:1.7;}
    .ornament{text-align:center;color:#ccc;margin:6px 0;font-size:12px;}
  `,
  regal: `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@400;600;700&display=swap');
    body{font-family:'Nunito',sans-serif;color:#0a0a1e;background:white;}
    @media print{@page{margin:.5in}}
    .resume{padding:38px 46px;border-left:5px solid #1e3a8a;}
    .header{padding-bottom:14px;border-bottom:2px solid #1e3a8a;margin-bottom:16px;display:flex;align-items:flex-start;gap:16px;}
    .header-text{flex:1}
    .nm{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:#1e3a8a;letter-spacing:.01em;}
    .hl{font-size:12px;color:#888;font-style:italic;margin-top:3px;}
    .photo{width:85px;height:105px;object-fit:cover;border:2px solid #1e3a8a;flex-shrink:0;}
    .st{font-family:'Cormorant Garamond',serif;font-size:14px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;
      color:#1e3a8a;margin:14px 0 6px;padding-bottom:3px;border-bottom:1px solid #bfcfe8;}
    .row{display:flex;margin-bottom:5px;font-size:12.5px;}
    .row-lbl{min-width:145px;font-weight:600;color:#1e3a8a;flex-shrink:0;}
    .row-val{color:#0a0a1e;}
    .divider{clear:both;}
    .eb{font-size:12.5px;color:#333;white-space:pre-wrap;line-height:1.7;}
    .ornament{text-align:center;font-size:16px;color:#1e3a8a;margin:6px 0;}
  `,
};

const TEMPLATES = [
  {id:'traditional',label:'Traditional',tag:'Classic Indian',      accent:'#8b1a3a'},
  {id:'floral',     label:'Floral',      tag:'Decorative Borders', accent:'#c2185b'},
  {id:'royal',      label:'Royal Gold',  tag:'Regal & Ornate',     accent:'#b8960c'},
  {id:'modern',     label:'Modern',      tag:'Gradient Header',    accent:'#6d1560'},
  {id:'simple',     label:'Simple',      tag:'Clean & Minimal',    accent:'#555'},
  {id:'regal',      label:'Regal Blue',  tag:'Navy & Serif',       accent:'#1e3a8a'},
];

/* ═══ HELPERS ═══ */
const uid = () => Math.random().toString(36).slice(2, 9);
const safe = s => (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const nl = s => safe(s).replace(/\n/g,'<br>');
const row = (label, val, accent) => val
  ? `<div class="row"><span class="row-lbl">${safe(label)} :</span><span class="row-val">${safe(val)}</span></div>`
  : '';

/* ═══ BUILD HTML ═══ */
function buildBiodata(d, tpl, photoUrl) {
  const photoHTML = photoUrl
    ? `<img class="photo" src="${photoUrl}" alt="Photo"/>`
    : '';

  const ornament = {
    traditional: '✦ ✦ ✦',
    floral:      '❀ ❀ ❀',
    royal:       '♔ ✦ ♔',
    modern:      '— ◆ —',
    simple:      '· · ·',
    regal:       '◆ ◆ ◆',
  }[tpl] || '✦';

  const personalRows = [
    ['Date of Birth',   d.dob],
    ['Age',             d.age],
    ['Place of Birth',  d.pob],
    ['Nationality',     d.nationality],
    ['Religion',        d.religion],
    ['Caste / Sub-caste',d.caste],
    ['Gotra',           d.gotra],
    ['Mother Tongue',   d.motherTongue],
    ['Blood Group',     d.bloodGroup],
    ['Complexion',      d.complexion],
    ['Height',          d.height],
    ['Weight',          d.weight],
    ['Build / Body type',d.build],
    ['Disability',      d.disability||'None'],
  ].map(([l,v])=>row(l,v)).join('');

  const horoRows = [
    ['Rashi / Zodiac',  d.rashi],
    ['Nakshatra / Star', d.nakshatra],
    ['Gothram',         d.gothram],
    ['Manglik',         d.manglik],
    ['Time of Birth',   d.tob],
    ['Place of Birth',  d.pob],
  ].map(([l,v])=>row(l,v)).join('');

  const familyRows = [
    ["Father's Name",   d.fatherName],
    ["Father's Occupation",d.fatherOcc],
    ["Mother's Name",   d.motherName],
    ["Mother's Occupation",d.motherOcc],
    ['Siblings',        d.siblings],
    ['Family Type',     d.familyType],
    ['Family Status',   d.familyStatus],
    ['Family Values',   d.familyValues],
  ].map(([l,v])=>row(l,v)).join('');

  const eduCareerRows = [
    ['Highest Education', d.education],
    ['College / University', d.university],
    ['Occupation',       d.occupation],
    ['Company / Employer', d.company],
    ['Annual Income',    d.income],
    ['Work Location',    d.workLocation],
  ].map(([l,v])=>row(l,v)).join('');

  const contactRows = [
    ['Email',            d.email],
    ['Mobile',           d.phone],
    ['Current Address',  d.address],
    ['Native Place',     d.nativePlace],
  ].map(([l,v])=>row(l,v)).join('');

  const prefRows = [
    ['Preferred Age',    d.prefAge],
    ['Preferred Education',d.prefEdu],
    ['Preferred Location', d.prefLocation],
    ['Preferred Caste',  d.prefCaste],
    ['Other Preferences',d.prefOther],
  ].map(([l,v])=>row(l,v)).join('');

  const sec = (title, content) => content
    ? `<div class="st">${title}</div>${tpl==='floral'?'<div class="st-line"></div>':''}${tpl==='modern'?'<div class="divider-bar"></div>':''}${content}`
    : '';

  if (tpl === 'modern') {
    return `<div class="resume">
      <div class="header">
        ${photoUrl?`<img class="photo" src="${photoUrl}" alt="Photo"/>`:''}
        <div class="header-text">
          <div class="nm">${safe(d.name||'Your Name')}</div>
          <div class="hl">${safe(d.subtitle||'Biodata for Matrimonial Purposes')}</div>
        </div>
      </div>
      <div class="body-part">
        ${d.about?`${sec('About Me','')}<div class="eb">${nl(d.about)}</div>`:''}
        ${personalRows?sec('Personal Details',personalRows):''}
        ${horoRows?sec('Horoscope & Religion',horoRows):''}
        ${familyRows?sec('Family Details',familyRows):''}
        ${eduCareerRows?sec('Education & Career',eduCareerRows):''}
        ${contactRows?sec('Contact',contactRows):''}
        ${prefRows?sec('Partner Preferences',prefRows):''}
        <div class="ornament">${ornament}</div>
      </div>
    </div>`;
  }

  if (tpl === 'regal') {
    return `<div class="resume">
      <div class="header">
        <div class="header-text">
          <div class="nm">${safe(d.name||'Your Name')}</div>
          <div class="hl">${safe(d.subtitle||'Biodata for Matrimonial Purposes')}</div>
        </div>
        ${photoUrl?`<img class="photo" src="${photoUrl}" alt="Photo"/>`:''}
      </div>
      ${d.about?`${sec('About Me','')}<div class="eb">${nl(d.about)}</div>`:''}
      ${personalRows?sec('Personal Details',personalRows):''}
      ${horoRows?sec('Horoscope & Religion',horoRows):''}
      ${familyRows?sec('Family Details',familyRows):''}
      ${eduCareerRows?sec('Education & Career',eduCareerRows):''}
      ${contactRows?sec('Contact Information',contactRows):''}
      ${prefRows?sec('Partner Preferences',prefRows):''}
      <div class="ornament">${ornament}</div>
    </div>`;
  }

  /* Traditional, Floral, Royal, Simple */
  return `<div class="resume">
    ${tpl==='floral'?'<span class="corner tl">❀</span><span class="corner tr">❀</span><span class="corner bl">❀</span><span class="corner br">❀</span>':''}
    <div class="header">
      ${photoHTML}
      <div class="nm">${safe(d.name||'Your Name')}</div>
      <div class="hl">${safe(d.subtitle||'Biodata for Matrimonial Purposes')}</div>
    </div>
    <div class="divider"></div>
    ${d.about?`${sec('About Me','')}<div class="eb">${nl(d.about)}</div>`:''}
    ${personalRows?sec('Personal Details',personalRows):''}
    ${horoRows?sec('Horoscope & Religion',horoRows):''}
    ${familyRows?sec('Family Details',familyRows):''}
    ${eduCareerRows?sec('Education & Career',eduCareerRows):''}
    ${contactRows?sec('Contact Information',contactRows):''}
    ${prefRows?sec('Partner Preferences',prefRows):''}
    <div class="ornament">${ornament}</div>
  </div>`;
}

const EMPTY = {
  name:'', subtitle:'Biodata for Matrimonial Purposes', about:'',
  dob:'', age:'', pob:'', nationality:'Indian', religion:'', caste:'', gotra:'', motherTongue:'', bloodGroup:'', complexion:'', height:'', weight:'', build:'', disability:'',
  rashi:'', nakshatra:'', gothram:'', manglik:'', tob:'',
  fatherName:'', fatherOcc:'', motherName:'', motherOcc:'', siblings:'', familyType:'', familyStatus:'', familyValues:'',
  education:'', university:'', occupation:'', company:'', income:'', workLocation:'',
  email:'', phone:'', address:'', nativePlace:'',
  prefAge:'', prefEdu:'', prefLocation:'', prefCaste:'', prefOther:'',
};

const TABS = [
  {id:'personal', label:'👤 Personal'},
  {id:'family',   label:'👨‍👩‍👧 Family'},
  {id:'career',   label:'🎓 Education & Career'},
  {id:'ai',       label:'✦ AI Write'},
  {id:'preview',  label:'◉ Preview'},
  {id:'templates',label:'▦ Templates'},
  {id:'guide',    label:'? Guide'},
];

export default function BiodataMaker() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';
  const [tab, setTab]   = useState('personal');
  const [tpl, setTpl]   = useState('traditional');
  const [data, setData] = useState({...EMPTY});
  const [photo, setPhoto]   = useState(null); // base64
  const fileRef = useRef();

  const [aiMode, setAiMode] = useState('about');
  const [aiCtx,  setAiCtx] = useState('');
  const [aiOut,  setAiOut] = useState('');
  const [aiLoad, setAiLoad]= useState(false);
  const [aiErr,  setAiErr] = useState('');

  const set = (k,v) => setData(p=>({...p,[k]:v}));

  const filled = [data.name,data.dob,data.religion,data.fatherName,data.education,data.email]
    .filter(Boolean).length;
  const pct = Math.round((filled/6)*100);

  const handlePhoto = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => setPhoto(ev.target.result);
    r.readAsDataURL(f);
  };

  const AI_PROMPTS = {
    about:   `Write a warm, 3-sentence "About Me" paragraph for a matrimonial biodata for: ${aiCtx||data.name}. Mention personality, values, and interests. First person, humble and genuine tone. Output only the paragraph.`,
    family:  `Write a 2-sentence family introduction for a matrimonial biodata. Family background: ${aiCtx}. Warm, respectful tone. Output only the text.`,
    pref:    `Write a polite, 2-sentence partner preference statement for a matrimonial biodata. Context: ${aiCtx||'educated professional, family-oriented values'}. Output only the statement.`,
    improve: `Improve this biodata text to be warm, genuine, and suitable for matrimonial purposes:\n\n${aiCtx}\n\nOutput only the improved version.`,
  };

  const runAI = async () => {
    setAiLoad(true); setAiOut(''); setAiErr('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:700,stream:true,
          messages:[{role:'user',content:AI_PROMPTS[aiMode]}]}),
      });
      if(!res.ok){setAiErr('API error');setAiLoad(false);return;}
      const reader=res.body.getReader(); const dec=new TextDecoder(); let buf='';
      while(true){
        const{done,value}=await reader.read(); if(done) break;
        buf+=dec.decode(value,{stream:true});
        const lines=buf.split('\n'); buf=lines.pop();
        for(const line of lines){
          if(!line.startsWith('data: ')) continue;
          const p=line.slice(6); if(p==='[DONE]') break;
          try{const o=JSON.parse(p);if(o.type==='content_block_delta'&&o.delta?.type==='text_delta')setAiOut(v=>v+o.delta.text);}catch{}
        }
      }
    }catch(e){setAiErr(e.message);}
    finally{setAiLoad(false);}
  };

  const applyAI = () => {
    if(!aiOut) return;
    set('about', aiOut);
    setTab('personal');
  };

  const printBio = () => {
    const html = buildBiodata(data, tpl, photo);
    const css  = PRINT_CSS[tpl] || PRINT_CSS.traditional;
    const w = window.open('','_blank');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
      <title>${data.name||'Biodata'}</title>
      <style>${css}</style></head>
      <body>${html}<script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
  };

  /* Accordion */
  const Sec = ({title, badge, children, open:defOpen=false}) => {
    const [open,setOpen] = useState(defOpen);
    return (
      <div className="acc-wrap panel">
        <button className="acc-head" onClick={()=>setOpen(o=>!o)}>
          <span className="acc-title">{title}{badge>0&&<span className="acc-badge">{badge}</span>}</span>
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

  const G = ({cols=2,children}) => <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:9}}>{children}</div>;
  const F = ({label,k,type='text',ph,cols}) => (
    <div style={cols?{gridColumn:`span ${cols}`}:{}}>
      <label className="lbl">{label}</label>
      <input className="fi" type={type} placeholder={ph||''} value={data[k]||''} onChange={e=>set(k,e.target.value)}/>
    </div>
  );

  /* Template thumbnail */
  const TplThumb = ({t}) => {
    const nm = data.name || 'Priya Sharma';
    const thumbs = {
      traditional: (
        <div style={{padding:'10px 12px',fontFamily:'serif'}}>
          <div style={{textAlign:'center',marginBottom:6}}>
            <div style={{fontSize:'2.4em',fontWeight:700,color:'#8b1a3a'}}>{nm}</div>
            <div style={{fontSize:'1.3em',color:'#777',fontStyle:'italic'}}>Biodata for Matrimonial</div>
          </div>
          <div style={{height:1.5,background:'#8b1a3a',margin:'5px 0 8px'}}/>
          <div style={{fontSize:'1.4em',fontWeight:700,color:'#8b1a3a',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:4}}>Personal Details</div>
          <div style={{height:1,background:'#e0b0c0',marginBottom:4}}/>
          <div style={{fontSize:'1.3em',color:'#222',display:'flex'}}><span style={{minWidth:60,fontWeight:600,color:'#8b1a3a'}}>DOB :</span><span>24 July 1995</span></div>
          <div style={{fontSize:'1.3em',color:'#222',display:'flex'}}><span style={{minWidth:60,fontWeight:600,color:'#8b1a3a'}}>Rashi :</span><span>Vrishabha</span></div>
        </div>
      ),
      floral: (
        <div style={{padding:'10px 12px',fontFamily:'serif',position:'relative'}}>
          <div style={{position:'absolute',top:5,left:7,fontSize:'14px',color:'#c2185b',opacity:.4}}>❀</div>
          <div style={{position:'absolute',top:5,right:7,fontSize:'14px',color:'#c2185b',opacity:.4}}>❀</div>
          <div style={{textAlign:'center',padding:'6px 0 8px',borderTop:'2px double #c2185b',borderBottom:'2px double #c2185b',marginTop:16,marginBottom:8}}>
            <div style={{fontSize:'2.4em',fontWeight:700,color:'#8b1a3a'}}>{nm}</div>
          </div>
          <div style={{textAlign:'center',fontSize:'1.4em',fontWeight:700,color:'#8b1a3a',letterSpacing:'.06em',marginBottom:4}}>PERSONAL DETAILS</div>
          <div style={{height:1,background:'linear-gradient(90deg,transparent,#e0b0c0,transparent)',marginBottom:5}}/>
          <div style={{fontSize:'1.3em',color:'#222',display:'flex'}}><span style={{minWidth:58,fontWeight:600,color:'#b03060'}}>DOB :</span><span>24 July 1995</span></div>
        </div>
      ),
      royal: (
        <div style={{border:'4px solid #b8960c',padding:0,height:'100%',overflow:'hidden'}}>
          <div style={{background:'#b8960c',padding:'10px 12px',textAlign:'center'}}>
            <div style={{fontFamily:'serif',fontSize:'2.4em',fontWeight:700,color:'white',letterSpacing:'.04em'}}>{nm}</div>
            <div style={{fontSize:'1.2em',color:'rgba(255,255,255,.8)',textTransform:'uppercase',letterSpacing:'.1em',marginTop:3}}>Royal Biodata</div>
          </div>
          <div style={{padding:'8px 12px'}}>
            <div style={{fontSize:'1.2em',fontFamily:'serif',fontWeight:600,textTransform:'uppercase',letterSpacing:'.1em',color:'#8b6f00',marginBottom:4}}>Personal Details</div>
            <div style={{height:1,background:'#d4a800',marginBottom:5}}/>
            <div style={{fontSize:'1.3em',display:'flex'}}><span style={{minWidth:55,fontWeight:700,color:'#8b6f00'}}>DOB :</span><span>24 July 1995</span></div>
          </div>
        </div>
      ),
      modern: (
        <div>
          <div style={{background:'linear-gradient(135deg,#1e0533,#6d1560)',padding:'12px 14px',display:'flex',alignItems:'center',gap:10}}>
            <div>
              <div style={{fontSize:'2.2em',fontWeight:800,color:'white'}}>{nm}</div>
              <div style={{fontSize:'1.3em',color:'rgba(255,255,255,.7)',textTransform:'uppercase',letterSpacing:'.08em'}}>Matrimonial Biodata</div>
            </div>
          </div>
          <div style={{padding:'8px 12px'}}>
            <div style={{fontSize:'1.2em',fontWeight:800,textTransform:'uppercase',letterSpacing:'.16em',color:'#6d1560',marginBottom:3}}>Personal Details</div>
            <div style={{height:2,background:'linear-gradient(90deg,#6d1560,#f472b6,transparent)',marginBottom:5}}/>
            <div style={{fontSize:'1.3em',display:'flex'}}><span style={{minWidth:55,fontWeight:700,color:'#6d1560'}}>DOB :</span><span>24 July 1995</span></div>
          </div>
        </div>
      ),
      simple: (
        <div style={{padding:'14px 16px'}}>
          <div style={{borderBottom:'2px solid #111',paddingBottom:8,marginBottom:8}}>
            <div style={{fontSize:'2.2em',fontWeight:700}}>{nm}</div>
            <div style={{fontSize:'1.4em',color:'#888',marginTop:2}}>Biodata for Matrimonial</div>
          </div>
          <div style={{fontSize:'1.2em',color:'#888',textTransform:'uppercase',letterSpacing:'.2em',marginBottom:5}}>Personal Details</div>
          <div style={{fontSize:'1.3em',display:'flex'}}><span style={{minWidth:55,fontWeight:600,color:'#444'}}>DOB :</span><span>24 July 1995</span></div>
          <div style={{fontSize:'1.3em',display:'flex',marginTop:3}}><span style={{minWidth:55,fontWeight:600,color:'#444'}}>Height :</span><span>5′5″</span></div>
        </div>
      ),
      regal: (
        <div style={{borderLeft:'4px solid #1e3a8a',padding:'10px 12px',fontFamily:'serif'}}>
          <div style={{borderBottom:'2px solid #1e3a8a',paddingBottom:7,marginBottom:7,display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
            <div>
              <div style={{fontSize:'2.3em',fontWeight:700,color:'#1e3a8a'}}>{nm}</div>
              <div style={{fontSize:'1.3em',color:'#888',fontStyle:'italic'}}>Matrimonial Biodata</div>
            </div>
          </div>
          <div style={{fontSize:'1.4em',fontWeight:700,color:'#1e3a8a',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4}}>Personal Details</div>
          <div style={{height:1,background:'#bfcfe8',marginBottom:5}}/>
          <div style={{fontSize:'1.3em',display:'flex'}}><span style={{minWidth:58,fontWeight:600,color:'#1e3a8a'}}>DOB :</span><span>24 July 1995</span></div>
        </div>
      ),
    };
    return (
      <div style={{height:132,overflow:'hidden',background:'white',position:'relative',fontSize:'27%'}}>
        {thumbs[t.id]}
        {tpl===t.id&&<div style={{position:'absolute',inset:0,background:'rgba(244,114,182,.07)',
          border:'2px solid #f472b6',display:'flex',alignItems:'flex-start',justifyContent:'flex-end',padding:5}}>
          <span style={{background:'#f472b6',color:'#080508',fontFamily:'monospace',fontSize:8,fontWeight:700,padding:'2px 6px',borderRadius:2}}>✓ ACTIVE</span>
        </div>}
      </div>
    );
  };

  /* ══════════════════════════════════════════════════════ */
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
              border:dark?'1px solid rgba(244,114,182,.32)':'none',
              background:dark?'rgba(244,114,182,.08)':'linear-gradient(135deg,#8b1a3a,#b91c55)',
              boxShadow:dark?'0 0 16px rgba(244,114,182,.22)':'0 3px 10px rgba(139,26,58,.35)',
            }}>💍</div>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:16,color:'var(--tx)',lineHeight:1}}>
                Biodata<span style={{color:'var(--acc)'}}>Maker</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v1.0</span>
              </div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--txm)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #3 · Matrimonial · 6 templates · AI-powered
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <div style={{width:90}}>
              <div className="prog"><div className="prog-bar" style={{width:`${pct}%`}}/></div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--txm)',textAlign:'right'}}>{pct}% complete</div>
            </div>
          </div>
          <button onClick={()=>setDark(d=>!d)} style={{
            display:'flex',alignItems:'center',gap:6,padding:'4px 10px',
            border:dark?'1px solid rgba(244,114,182,.2)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:'transparent',cursor:'pointer',
          }}>
            <div style={{width:28,height:14,borderRadius:8,position:'relative',
              background:dark?'var(--acc)':'#e8c5d4',
              boxShadow:dark?'0 0 8px rgba(244,114,182,.5)':'none'}}>
              <div style={{position:'absolute',top:2.5,left:dark?'auto':2,right:dark?2:'auto',
                width:9,height:9,borderRadius:'50%',background:dark?'#080508':'white',transition:'all .2s'}}/>
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
        </div>

        {/* BODY */}
        <div className="body">
          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* Photo upload */}
            <div>
              <div className="slbl">Photo</div>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <div className="photo-slot" onClick={()=>fileRef.current?.click()}>
                  {photo
                    ? <img src={photo} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    : <div style={{textAlign:'center',padding:8}}>
                        <div style={{fontSize:22}}>📷</div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--txm)',marginTop:4}}>Upload photo</div>
                      </div>}
                  <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handlePhoto}/>
                </div>
                {photo&&<button className="gbtn" onClick={()=>setPhoto(null)} style={{fontSize:9}}>✕ Remove</button>}
              </div>
            </div>

            {/* Template */}
            <div>
              <div className="slbl">Template</div>
              {TEMPLATES.map(t=>(
                <button key={t.id} onClick={()=>setTpl(t.id)} style={{
                  width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',
                  padding:'7px 9px',marginBottom:4,cursor:'pointer',
                  border:tpl===t.id?`1px solid var(--acc)`:(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                  borderRadius:dark?3:7,
                  background:tpl===t.id?(dark?'rgba(244,114,182,.05)':'rgba(139,26,58,.04)'):'transparent',
                }}>
                  <div>
                    <div style={{fontFamily:"'Nunito',sans-serif",fontSize:11.5,fontWeight:600,
                      color:tpl===t.id?'var(--acc)':'var(--tx)'}}>{t.label}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--txm)',marginTop:1}}>{t.tag}</div>
                  </div>
                  {tpl===t.id&&<span style={{fontSize:10,color:'var(--acc)'}}>✓</span>}
                </button>
              ))}
            </div>

            <div>
              <div className="slbl">Sections</div>
              {[
                ['Name',        !!data.name],
                ['Date of Birth',!!data.dob],
                ['Religion',    !!data.religion],
                ['Horoscope',   !!data.rashi],
                ['Family',      !!data.fatherName],
                ['Education',   !!data.education],
                ['Contact',     !!data.email],
              ].map(([l,done])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',
                  padding:'4px 9px',marginBottom:3,borderRadius:dark?2:6,
                  background:done?(dark?'rgba(244,114,182,.04)':'rgba(139,26,58,.03)'):'transparent',
                  border:done?(dark?'1px solid rgba(244,114,182,.1)':'1.5px solid rgba(139,26,58,.08)'):(dark?'1px solid transparent':'1.5px solid transparent')}}>
                  <span style={{fontFamily:"'Nunito',sans-serif",fontSize:10.5,color:done?'var(--tx)':'var(--txm)'}}>{l}</span>
                  <span style={{fontSize:11}}>{done?'✓':'○'}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="slbl">Export</div>
              <button className="gbtn" onClick={printBio} style={{width:'100%',justifyContent:'flex-start',padding:'7px 10px'}}>
                🖨 Print / Save PDF
              </button>
            </div>

            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ╔══ PERSONAL ══╗ */}
              {tab==='personal'&&(
                <motion.div key="personal" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:0}}>

                  <Sec title="Basic Information" open>
                    <G>
                      <F label="Full Name" k="name" ph="Priya Sharma" cols={2}/>
                      <F label="Subtitle line" k="subtitle" ph="Biodata for Matrimonial Purposes" cols={2}/>
                    </G>
                    <div style={{marginTop:12}}>
                      <label className="lbl">About Me</label>
                      <textarea className="fi" rows={4}
                        placeholder="A warm, kind-hearted person who values family, enjoys cooking and music, and is looking for a life partner who shares similar values…"
                        value={data.about||''} onChange={e=>set('about',e.target.value)}/>
                      <button className="gbtn" style={{marginTop:7}} onClick={()=>{setTab('ai');setAiMode('about');}}>✦ Generate with AI</button>
                    </div>
                  </Sec>

                  <Sec title="Personal Details" open>
                    <G>
                      <F label="Date of Birth" k="dob" ph="24 July 1995"/>
                      <F label="Age" k="age" ph="29 years"/>
                      <F label="Place of Birth" k="pob" ph="Mumbai, Maharashtra"/>
                      <F label="Nationality" k="nationality" ph="Indian"/>
                      <F label="Blood Group" k="bloodGroup" ph="B+"/>
                      <F label="Mother Tongue" k="motherTongue" ph="Hindi / Marathi"/>
                      <F label="Height" k="height" ph="5 ft 5 in / 165 cm"/>
                      <F label="Weight" k="weight" ph="55 kg"/>
                      <F label="Complexion" k="complexion" ph="Fair / Wheatish / Dark"/>
                      <F label="Build" k="build" ph="Slim / Average / Athletic"/>
                      <F label="Disability" k="disability" ph="None"/>
                      <F label="Marital Status" k="maritalStatus" ph="Never Married"/>
                    </G>
                  </Sec>

                  <Sec title="Religion & Horoscope">
                    <G>
                      <F label="Religion" k="religion" ph="Hindu / Muslim / Christian…"/>
                      <F label="Caste / Sub-caste" k="caste" ph="Brahmin / Kshatriya…"/>
                      <F label="Gotra / Gothram" k="gotra" ph="Kashyap / Bharadwaj…"/>
                      <F label="Rashi / Moon Sign" k="rashi" ph="Vrishabha / Taurus"/>
                      <F label="Nakshatra / Birth Star" k="nakshatra" ph="Rohini / Krittika"/>
                      <F label="Manglik / Dosham" k="manglik" ph="No / Yes / Anshik"/>
                      <F label="Time of Birth" k="tob" ph="06:30 AM"/>
                      <F label="Place of Birth" k="pob" ph="Mumbai, Maharashtra"/>
                    </G>
                    <div style={{marginTop:9,padding:'9px 12px',borderRadius:dark?3:8,
                      background:dark?'rgba(244,114,182,.03)':'rgba(253,244,247,.8)',
                      border:dark?'1px solid rgba(244,114,182,.1)':'1.5px solid rgba(139,26,58,.09)',
                      fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:'var(--txm)',lineHeight:1.7}}>
                      Horoscope section is optional — leave blank if not applicable to your religion or preference.
                    </div>
                  </Sec>

                  <Sec title="Contact Information">
                    <G>
                      <F label="Email" k="email" type="email" ph="priya@email.com"/>
                      <F label="Mobile" k="phone" ph="+91 98765 43210"/>
                      <F label="Native Place" k="nativePlace" ph="Pune, Maharashtra" cols={2}/>
                      <F label="Current Address" k="address" ph="123 MG Road, Mumbai 400001" cols={2}/>
                    </G>
                  </Sec>

                  <Sec title="Partner Preferences">
                    <G>
                      <F label="Preferred Age" k="prefAge" ph="28–34 years"/>
                      <F label="Preferred Education" k="prefEdu" ph="Graduate or above"/>
                      <F label="Preferred Location" k="prefLocation" ph="Maharashtra / Any"/>
                      <F label="Preferred Caste" k="prefCaste" ph="Same caste / Open"/>
                    </G>
                    <div style={{marginTop:9}}>
                      <label className="lbl">Other preferences</label>
                      <textarea className="fi" rows={2}
                        placeholder="Looking for a kind, educated, and family-oriented partner who values…"
                        value={data.prefOther||''} onChange={e=>set('prefOther',e.target.value)}/>
                      <button className="gbtn" style={{marginTop:7}} onClick={()=>{setTab('ai');setAiMode('pref');}}>✦ Generate with AI</button>
                    </div>
                  </Sec>

                  
                </motion.div>
              )}

              {/* ╔══ FAMILY ══╗ */}
              {tab==='family'&&(
                <motion.div key="family" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:0}}>

                  <Sec title="Father's Details" open>
                    <G>
                      <F label="Father's Name" k="fatherName" ph="Rajesh Sharma"/>
                      <F label="Father's Occupation" k="fatherOcc" ph="Retired Government Officer"/>
                    </G>
                  </Sec>

                  <Sec title="Mother's Details" open>
                    <G>
                      <F label="Mother's Name" k="motherName" ph="Sunita Sharma"/>
                      <F label="Mother's Occupation" k="motherOcc" ph="Homemaker"/>
                    </G>
                  </Sec>

                  <Sec title="Siblings & Family">
                    <G>
                      <F label="Siblings" k="siblings" ph="1 elder brother (married), 1 younger sister"/>
                      <F label="Family Type" k="familyType" ph="Nuclear / Joint / Extended"/>
                      <F label="Family Status" k="familyStatus" ph="Middle Class / Upper-middle / Affluent"/>
                      <F label="Family Values" k="familyValues" ph="Traditional / Moderate / Liberal"/>
                    </G>
                  </Sec>

                  
                </motion.div>
              )}

              {/* ╔══ CAREER ══╗ */}
              {tab==='career'&&(
                <motion.div key="career" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:0}}>

                  <Sec title="Education" open>
                    <G>
                      <F label="Highest Qualification" k="education" ph="MBA / B.Tech / MBBS…" cols={2}/>
                      <F label="College / University" k="university" ph="IIT Mumbai / Delhi University"/>
                      <F label="Year of Passing" k="gradYear" ph="2018"/>
                    </G>
                  </Sec>

                  <Sec title="Career" open>
                    <G>
                      <F label="Occupation" k="occupation" ph="Software Engineer / Doctor…" cols={2}/>
                      <F label="Employer / Company" k="company" ph="TCS / Self-employed / AIIMS"/>
                      <F label="Annual Income" k="income" ph="₹10–15 LPA / Not disclosed"/>
                      <F label="Work Location" k="workLocation" ph="Pune, Maharashtra"/>
                    </G>
                  </Sec>

                  
                </motion.div>
              )}

              {/* ╔══ AI ══╗ */}
              {tab==='ai'&&(
                <motion.div key="ai" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>

                  <div className="panel" style={{padding:'14px 16px'}}>
                    <div className="lbl" style={{marginBottom:11}}>✦ What should AI write?</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
                      {[
                        {id:'about',   icon:'💬',label:'About Me',        desc:'3-sentence personal intro'},
                        {id:'family',  icon:'🏠',label:'Family Intro',    desc:'2-sentence family description'},
                        {id:'pref',    icon:'💝',label:'Partner Preferences',desc:'Polite preference statement'},
                        {id:'improve', icon:'✨',label:'Improve Text',    desc:'Warmer, more genuine rewrite'},
                      ].map(({id,icon,label,desc})=>(
                        <button key={id} className={`gbtn ${aiMode===id?'on':''}`}
                          onClick={()=>setAiMode(id)}
                          style={{flexDirection:'column',gap:4,height:'auto',padding:'11px 12px',
                            alignItems:'flex-start',
                            background:aiMode===id?(dark?'rgba(244,114,182,.06)':'rgba(139,26,58,.05)'):''
                          }}>
                          <span style={{fontSize:18}}>{icon}</span>
                          <span style={{fontSize:11,fontWeight:600,color:'var(--tx)',textTransform:'none',letterSpacing:0}}>{label}</span>
                          <span style={{fontSize:9.5,opacity:.6,textTransform:'none',letterSpacing:0,fontFamily:"'Nunito',sans-serif"}}>{desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="panel" style={{padding:'14px 16px'}}>
                    <div className="lbl" style={{marginBottom:7}}>Your context</div>
                    <textarea className="fi" rows={aiMode==='improve'?5:3}
                      placeholder={
                        aiMode==='about'  ?'e.g. "29-year-old software engineer, loves cooking, classical dance, values family and tradition"':
                        aiMode==='family' ?'e.g. "middle-class family from Pune, father retired officer, mother homemaker, one married brother"':
                        aiMode==='pref'   ?'e.g. "educated professional, family-oriented, same religion preferred, open to other cities"':
                        'Paste the biodata text to improve…'
                      }
                      value={aiCtx} onChange={e=>setAiCtx(e.target.value)}/>
                    <div style={{display:'flex',gap:8,marginTop:10,alignItems:'center'}}>
                      <button className="btn" onClick={runAI} disabled={aiLoad} style={{padding:'9px 24px'}}>
                        {aiLoad?<><span style={{display:'inline-block',animation:'spin .8s linear infinite'}}>⟳</span>&nbsp;Writing…</>:'✦ Generate'}
                      </button>
                      {aiOut&&!aiLoad&&(aiMode==='about'||aiMode==='improve')&&(
                        <button className="gbtn" onClick={applyAI} style={{borderColor:'var(--acc)',color:'var(--acc)'}}>
                          → Apply to About Me
                        </button>
                      )}
                      {aiOut&&!aiLoad&&(
                        <button className="gbtn" onClick={()=>{try{navigator.clipboard.writeText(aiOut)}catch{}}}>⎘ Copy</button>
                      )}
                    </div>
                    {aiErr&&<div style={{marginTop:8,padding:'7px 11px',borderRadius:dark?3:8,
                      background:dark?'rgba(248,113,113,.06)':'rgba(185,28,28,.04)',
                      border:dark?'1px solid rgba(248,113,113,.2)':'1.5px solid rgba(185,28,28,.12)',
                      fontFamily:"'Nunito',sans-serif",fontSize:12,color:'var(--err)'}}>⚠ {aiErr}</div>}
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
                    <button className="btn" onClick={printBio} style={{padding:'9px 22px'}}>🖨 Print / Save as PDF</button>
                    <button className="gbtn" onClick={()=>setTab('templates')}>▦ Change template</button>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'var(--txm)'}}>
                      Template: <span style={{color:'var(--acc)'}}>{TEMPLATES.find(t=>t.id===tpl)?.label}</span>
                    </div>
                  </div>
                  <div className="preview-bg">
                    <div dangerouslySetInnerHTML={{__html:buildBiodata(data,tpl,photo)}}
                      style={{background:'white',color:'#111',maxWidth:794,margin:'0 auto',
                        fontFamily:"'Nunito',sans-serif",lineHeight:1.55,
                        boxShadow:'0 6px 48px rgba(0,0,0,.3)',
                        ...(tpl==='royal'?{border:'8px solid #b8960c'}:{}),
                      }}/>
                  </div>
                  
                </motion.div>
              )}

              {/* ╔══ TEMPLATES ══╗ */}
              {tab==='templates'&&(
                <motion.div key="tpl" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:12}}>
                  <div style={{fontFamily:"'Nunito',sans-serif",fontSize:14,color:'var(--tx2)',lineHeight:1.7}}>
                    6 biodata templates inspired by traditional and modern Indian matrimonial styles.
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:13}}>
                    {TEMPLATES.map(t=>(
                      <motion.div key={t.id} whileHover={{y:-3}}
                        className={`tpl-card ${tpl===t.id?'active':''}`}
                        onClick={()=>setTpl(t.id)}>
                        <TplThumb t={t}/>
                        <div style={{padding:'10px 13px',display:'flex',justifyContent:'space-between',alignItems:'center',
                          borderTop:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          background:tpl===t.id?(dark?'rgba(244,114,182,.05)':'rgba(139,26,58,.04)'):(dark?'var(--s2)':'var(--s1)')}}>
                          <div>
                            <div style={{fontFamily:"'Nunito',sans-serif",fontSize:12.5,fontWeight:700,
                              color:tpl===t.id?'var(--acc)':'var(--tx)'}}>{t.label}</div>
                            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8.5,color:'var(--txm)',marginTop:1}}>{t.tag}</div>
                          </div>
                          {tpl===t.id
                            ?<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--acc)'}}>✓ Active</span>
                            :<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--txm)'}}>Select</span>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
                    {[
                      {id:'traditional',emoji:'🪔',t:'Traditional',  b:'Classic Indian matrimonial format with crimson accents. Time-tested layout used by families across India.'},
                      {id:'floral',     emoji:'❀', t:'Floral',       b:'Decorative double-border with floral corner ornaments. Elegant and festive, perfect for Hindu ceremonies.'},
                      {id:'royal',      emoji:'♔', t:'Royal Gold',   b:'Gold border frame with Cinzel royal typography. Commands attention and conveys prestige.'},
                      {id:'modern',     emoji:'✨',t:'Modern',       b:'Deep purple gradient header with clean body. Contemporary look for tech professionals and urban families.'},
                      {id:'simple',     emoji:'○', t:'Simple',       b:'Clean, minimal design with no colour. Professional and discreet — lets your details speak.'},
                      {id:'regal',      emoji:'🔵',t:'Regal Blue',   b:'Navy left accent with Cormorant serif. Formal and distinguished, suits business families.'},
                    ].map(({id,emoji,t,b})=>(
                      <div key={id} style={{padding:'12px 14px',borderRadius:dark?3:9,
                        border:tpl===id?`1px solid var(--acc)`:(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                        background:tpl===id?(dark?'rgba(244,114,182,.04)':'rgba(139,26,58,.04)'):(dark?'var(--s2)':'var(--s1)')}}>
                        <div style={{display:'flex',gap:7,alignItems:'center',marginBottom:5}}>
                          <span style={{fontSize:15}}>{emoji}</span>
                          <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:13,color:'var(--tx)'}}>{t}</span>
                          {tpl===id&&<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'var(--acc)',marginLeft:'auto'}}>ACTIVE</span>}
                        </div>
                        <div style={{fontFamily:"'Nunito',sans-serif",fontSize:12.5,color:'var(--tx2)',lineHeight:1.65}}>{b}</div>
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
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:'var(--tx)',marginBottom:4}}>
                      What is a Biodata?
                    </div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'var(--txm)',letterSpacing:'.14em',textTransform:'uppercase',marginBottom:16}}>
                      matrimonial · traditional · south asian
                    </div>
                    <div style={{fontFamily:"'Nunito',sans-serif",fontSize:13.5,color:'var(--tx2)',lineHeight:1.75,marginBottom:20}}>
                      A matrimonial biodata is a document shared with prospective families during the marriage search process. Unlike a resume, it covers personal, family, horoscope, and partner preference details alongside education and career. It is widely used across India, Pakistan, Sri Lanka, Bangladesh, and the South Asian diaspora worldwide.
                    </div>
                    {[
                      {n:1,t:'Start with your name & photo',d:'Your name and photo create the first impression. Use a recent, clear photo in formal attire. Your subtitle can be "Biodata for Matrimonial Purposes" or a personalised line.'},
                      {n:2,t:'Fill Personal Details carefully',d:'Date of birth, height, complexion, blood group — all are commonly expected. Leave fields blank that you prefer not to share; they simply won\'t appear in the output.'},
                      {n:3,t:'Horoscope is optional',d:'If your religion or preference doesn\'t involve astrology, skip the Religion & Horoscope section entirely. It won\'t appear in the final document.'},
                      {n:4,t:'Family tab is important',d:'Parents\' names and occupations, number of siblings, family type and status — families often check this section first. Be honest and clear.'},
                      {n:5,t:'Use AI for "About Me"',d:'The About Me section is where you can show personality. Use the ✦ AI Write tab — describe your interests, values, and what you\'re looking for, and AI will write a warm, genuine paragraph.'},
                    ].map(({n,t,d})=>(
                      <div key={n} style={{display:'flex',gap:12,marginBottom:14}}>
                        <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
                          <div className="step-num">{n}</div>
                          {n<5&&<div style={{width:1.5,flex:1,marginTop:5,background:dark?'rgba(244,114,182,.1)':'rgba(139,26,58,.1)'}}/>}
                        </div>
                        <div style={{flex:1,paddingBottom:4}}>
                          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,color:'var(--tx)',marginBottom:4}}>{t}</div>
                          <div style={{fontFamily:"'Nunito',sans-serif",fontSize:13.5,color:'var(--tx2)',lineHeight:1.72}}>{d}</div>
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