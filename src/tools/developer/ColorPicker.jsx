import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   COLOR PICKER — Dark Obsidian/Neon · Light Paper/Ink
   Series architecture: topbar · tabs · sidebar · main · ads
═══════════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Cabinet+Grotesk:wght@400;500;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Cabinet Grotesk',sans-serif}
@keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes hue-spin{from{filter:hue-rotate(0deg)}to{filter:hue-rotate(360deg)}}
@keyframes pop{0%{transform:scale(0)}60%{transform:scale(1.18)}100%{transform:scale(1)}}
@keyframes pulse-hue{0%,100%{box-shadow:0 0 16px rgba(168,85,247,.12)}50%{box-shadow:0 0 36px rgba(168,85,247,.5),0 0 70px rgba(168,85,247,.14)}}
@keyframes slide-in{from{opacity:0;transform:translateX(-5px)}to{opacity:1;transform:none}}
.fadeup{animation:fadeup .2s ease both}

/* ══ DARK — OBSIDIAN / NEON ══════════════════════════════════════ */
.dark{
  --bg:#08060c;--sur:#0f0b16;--s2:#120e1a;
  --bdr:#1e1630;--bdr2:rgba(168,85,247,.22);
  --acc:#a855f7;--acc2:#ec4899;--acc3:#06b6d4;
  --ok:#34d399;--err:#f87171;--warn:#fbbf24;
  --txt:#faf5ff;--txt2:#c084fc;--txt3:#3b0764;
  min-height:100vh;background:var(--bg);color:var(--txt);
  background-image:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(168,85,247,.07),transparent);
}
/* ══ LIGHT — PAPER / INK ══════════════════════════════════════════ */
.light{
  --bg:#fdfbff;--sur:#ffffff;--s2:#f5f0ff;
  --bdr:#e0d4f7;--bdr2:#7c3aed;
  --acc:#7c3aed;--acc2:#db2777;--acc3:#0891b2;
  --ok:#059669;--err:#dc2626;--warn:#d97706;
  --txt:#1a0533;--txt2:#5b21b6;--txt3:#7c3aed;
  min-height:100vh;background:var(--bg);color:var(--txt);
}

/* TOPBAR */
.topbar{height:40px;position:sticky;top:0;z-index:300;display:flex;align-items:center;padding:0 14px;gap:8px;backdrop-filter:blur(18px)}
.dark .topbar{background:rgba(8,6,12,.97);border-bottom:1px solid var(--bdr)}
.light .topbar{background:rgba(253,251,255,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 8px rgba(124,58,237,.07)}

/* TABS */
.dark .tab-bar{background:var(--sur);border-bottom:1px solid var(--bdr)}
.light .tab-bar{background:var(--sur);border-bottom:1.5px solid var(--bdr)}
.tab{height:36px;padding:0 13px;border:none;border-bottom:2px solid transparent;background:transparent;cursor:pointer;
  font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;
  transition:all .13s;display:flex;align-items:center;gap:5px;white-space:nowrap}
.dark .tab{color:var(--txt3)}
.dark .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(168,85,247,.05)}
.dark .tab:hover:not(.on){color:var(--txt2)}
.light .tab{color:var(--txt3)}
.light .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(124,58,237,.05);font-weight:600;border-bottom-width:2.5px}
.light .tab:hover:not(.on){color:var(--txt2);background:rgba(124,58,237,.03)}

/* PANELS */
.dark .panel{background:linear-gradient(145deg,var(--sur),var(--s2));border:1px solid var(--bdr);border-radius:4px}
.light .panel{background:var(--sur);border:1.5px solid var(--bdr);border-radius:10px;box-shadow:0 2px 14px rgba(124,58,237,.06)}

/* BUTTONS */
.dark .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 18px;
  border:1px solid var(--acc);border-radius:3px;background:rgba(168,85,247,.09);color:var(--acc);
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;
  animation:pulse-hue 2.5s ease-in-out infinite;transition:all .15s}
.dark .btn:hover{background:rgba(168,85,247,.2);transform:translateY(-1px)}
.light .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 18px;
  border:none;border-radius:7px;background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;
  box-shadow:0 4px 14px rgba(124,58,237,.4);transition:all .15s}
.light .btn:hover{box-shadow:0 8px 24px rgba(124,58,237,.5);transform:translateY(-1px)}
.dark .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:4px 10px;
  border:1px solid var(--bdr);border-radius:3px;background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;transition:all .12s}
.dark .btn-ghost:hover,.dark .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(168,85,247,.07)}
.light .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:4px 10px;
  border:1.5px solid var(--bdr);border-radius:6px;background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;transition:all .12s}
.light .btn-ghost:hover,.light .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(124,58,237,.07)}

/* INPUTS */
.dark .inp{background:rgba(0,0,0,.5);border:1px solid var(--bdr);border-radius:3px;color:var(--txt);
  font-family:'JetBrains Mono',monospace;font-size:12px;padding:6px 10px;outline:none;width:100%;transition:all .13s}
.dark .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(168,85,247,.1)}
.light .inp{background:#f5f0ff;border:1.5px solid var(--bdr);border-radius:7px;color:var(--txt);
  font-family:'JetBrains Mono',monospace;font-size:12px;padding:6px 10px;outline:none;width:100%;transition:all .13s}
.light .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(124,58,237,.1)}

/* MISC */
.dark .lbl{font-size:8.5px;font-weight:500;font-family:'JetBrains Mono',monospace;letter-spacing:.2em;text-transform:uppercase;color:rgba(168,85,247,.45);display:block;margin-bottom:5px}
.light .lbl{font-size:8.5px;font-weight:500;font-family:'JetBrains Mono',monospace;letter-spacing:.2em;text-transform:uppercase;color:var(--acc);display:block;margin-bottom:5px}
.dark .sec-title{font-size:8.5px;font-weight:500;font-family:'JetBrains Mono',monospace;letter-spacing:.22em;text-transform:uppercase;color:rgba(168,85,247,.38);margin-bottom:7px}
.light .sec-title{font-size:8.5px;font-weight:500;font-family:'JetBrains Mono',monospace;letter-spacing:.22em;text-transform:uppercase;color:var(--acc);margin-bottom:7px}
.dark .metric{border:1px solid rgba(168,85,247,.12);border-radius:3px;padding:9px 12px;background:rgba(168,85,247,.04)}
.light .metric{border:1.5px solid rgba(124,58,237,.18);border-radius:8px;padding:9px 12px;background:rgba(124,58,237,.04)}
.dark .ad-slot{background:rgba(168,85,247,.014);border:1px dashed rgba(168,85,247,.12);border-radius:3px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:var(--txt3);font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.12em;text-transform:uppercase}
.light .ad-slot{background:rgba(124,58,237,.03);border:1.5px dashed rgba(124,58,237,.18);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:var(--txt3);font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.12em;text-transform:uppercase}
.dark .hint{font-size:12.5px;color:var(--txt2);line-height:1.75;padding:8px 12px;border-radius:3px;background:rgba(168,85,247,.04);border-left:2px solid rgba(168,85,247,.3)}
.light .hint{font-size:12.5px;color:var(--txt2);line-height:1.75;padding:8px 12px;border-radius:8px;background:rgba(124,58,237,.05);border-left:2.5px solid rgba(124,58,237,.3)}
.dark .sidebar{border-right:1px solid var(--bdr);background:var(--sur);padding:12px 10px;overflow-y:auto;display:flex;flex-direction:column;gap:11px}
.light .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);padding:12px 10px;overflow-y:auto;display:flex;flex-direction:column;gap:11px}
.body-layout{display:grid;grid-template-columns:204px 1fr;min-height:calc(100vh - 76px)}
.prose p{font-size:13.5px;line-height:1.78;margin-bottom:12px;color:var(--txt2)}
.prose h3{font-size:13px;font-weight:700;margin:20px 0 7px;color:var(--txt);font-family:'JetBrains Mono',monospace;letter-spacing:.04em}
.prose ul{padding-left:20px;margin-bottom:12px}
.prose li{font-size:13.5px;line-height:1.72;margin-bottom:5px;color:var(--txt2)}
.prose strong{font-weight:700;color:var(--txt)}
.step-n{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700;flex-shrink:0}
.dark .step-n{border:1px solid rgba(168,85,247,.3);background:rgba(168,85,247,.07);color:var(--acc)}
.light .step-n{border:1.5px solid rgba(124,58,237,.3);background:rgba(124,58,237,.07);color:var(--acc)}

/* CANVAS pickers */
.picker-canvas{cursor:crosshair;border-radius:4px;display:block;touch-action:none}
.dark .picker-canvas{border:1px solid var(--bdr)}
.light .picker-canvas{border:1.5px solid var(--bdr);border-radius:8px}

/* SWATCH */
.swatch{border-radius:50%;cursor:pointer;transition:transform .15s;flex-shrink:0}
.swatch:hover{transform:scale(1.15)}

/* COPY badge */
.copy-flash{position:absolute;top:-22px;left:50%;transform:translateX(-50%);
  background:var(--acc);color:#fff;font-family:'JetBrains Mono',monospace;font-size:9px;
  padding:2px 7px;border-radius:3px;white-space:nowrap;pointer-events:none;z-index:99}

/* RANGE */
.dark .range{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;background:rgba(168,85,247,.1)}
.dark .range::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border-radius:50%;background:var(--acc);box-shadow:0 0 7px rgba(168,85,247,.55);cursor:pointer}
.light .range{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;background:rgba(124,58,237,.12)}
.light .range::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border-radius:50%;background:var(--acc);box-shadow:0 2px 7px rgba(124,58,237,.4);cursor:pointer}
`;

/* ═══ ICONS ═══ */
const Svg = ({d,s=14,sw=1.8,fill='none'}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {(Array.isArray(d)?d:[d]).map((p,i)=><path key={i} d={p}/>)}
  </svg>
);
const I = {
  drop:  s=><Svg s={s} d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>,
  copy:  s=><Svg s={s} d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2","M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"]}/>,
  plus:  s=><Svg s={s} d={["M12 5v14","M5 12h14"]}/>,
  trash: s=><Svg s={s} d={["M3 6h18","M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6","M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"]}/>,
  info:  s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 16v-4M12 8h.01"]}/>,
  book:  s=><Svg s={s} d={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z","M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]}/>,
  ok:    s=><Svg s={s} d="M20 6 9 17l-5-5"/>,
  shuffle:s=><Svg s={s} d={["M16 3h5v5","M4 20L21 3","M21 16v5h-5","M15 15l6 6","M4 4l5 5"]}/>,
  dl:    s=><Svg s={s} d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]}/>,
  contrast:s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 2v20"]}/>,
};

/* ══════════════════════════════════════════════════
   COLOR MATH ENGINE
══════════════════════════════════════════════════ */
function hexToRgb(hex) {
  const h = hex.replace('#','');
  const n = h.length === 3
    ? h.split('').map(c=>parseInt(c+c,16))
    : [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];
  return { r:n[0]||0, g:n[1]||0, b:n[2]||0 };
}
function rgbToHex(r,g,b) {
  return '#'+[r,g,b].map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
}
function rgbToHsl(r,g,b) {
  r/=255;g/=255;b/=255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  let h,s,l=(max+min)/2;
  if(max===min){h=s=0;}else{
    const d=max-min;
    s=l>.5?d/(2-max-min):d/(max+min);
    switch(max){
      case r:h=(g-b)/d+(g<b?6:0);break;
      case g:h=(b-r)/d+2;break;
      default:h=(r-g)/d+4;
    }
    h/=6;
  }
  return {h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};
}
function hslToRgb(h,s,l) {
  h/=360;s/=100;l/=100;
  let r,g,b;
  if(s===0){r=g=b=l;}else{
    const q=l<.5?l*(1+s):l+s-l*s;
    const p=2*l-q;
    const hue2rgb=(p,q,t)=>{
      if(t<0)t+=1;if(t>1)t-=1;
      if(t<1/6)return p+(q-p)*6*t;
      if(t<1/2)return q;
      if(t<2/3)return p+(q-p)*(2/3-t)*6;
      return p;
    };
    r=hue2rgb(p,q,h+1/3);g=hue2rgb(p,q,h);b=hue2rgb(p,q,h-1/3);
  }
  return {r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)};
}
function rgbToHsv(r,g,b){
  r/=255;g/=255;b/=255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;
  let h=0,s=max===0?0:d/max,v=max;
  if(d!==0){
    switch(max){
      case r:h=(g-b)/d+(g<b?6:0);break;
      case g:h=(b-r)/d+2;break;
      default:h=(r-g)/d+4;
    }
    h/=6;
  }
  return {h:Math.round(h*360),s:Math.round(s*100),v:Math.round(v*100)};
}
function hsvToRgb(h,s,v){
  h/=360;s/=100;v/=100;
  let r,g,b;
  const i=Math.floor(h*6),f=h*6-i,p=v*(1-s),q=v*(1-f*s),t=v*(1-(1-f)*s);
  switch(i%6){
    case 0:r=v;g=t;b=p;break;case 1:r=q;g=v;b=p;break;
    case 2:r=p;g=v;b=t;break;case 3:r=p;g=q;b=v;break;
    case 4:r=t;g=p;b=v;break;default:r=v;g=p;b=q;
  }
  return {r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)};
}
function rgbToCmyk(r,g,b){
  if(r===0&&g===0&&b===0)return{c:0,m:0,y:0,k:100};
  r/=255;g/=255;b/=255;
  const k=1-Math.max(r,g,b);
  return {
    c:Math.round((1-r-k)/(1-k)*100),
    m:Math.round((1-g-k)/(1-k)*100),
    y:Math.round((1-b-k)/(1-k)*100),
    k:Math.round(k*100)
  };
}
function luminance(r,g,b){
  const [rs,gs,bs]=[r,g,b].map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);});
  return .2126*rs+.7152*gs+.0722*bs;
}
function contrastRatio(hex1,hex2){
  const {r:r1,g:g1,b:b1}=hexToRgb(hex1);
  const {r:r2,g:g2,b:b2}=hexToRgb(hex2);
  const l1=luminance(r1,g1,b1),l2=luminance(r2,g2,b2);
  const lighter=Math.max(l1,l2),darker=Math.min(l1,l2);
  return (lighter+.05)/(darker+.05);
}
function wcagLevel(ratio){
  if(ratio>=7)return{level:'AAA',ok:true};
  if(ratio>=4.5)return{level:'AA',ok:true};
  if(ratio>=3)return{level:'AA Large',ok:true};
  return{level:'Fail',ok:false};
}

/* Harmony generators */
function getHarmonies(hex){
  const {r,g,b}=hexToRgb(hex);
  const {h,s,l}=rgbToHsl(r,g,b);
  const make=(dh,ds=s,dl=l)=>{
    const {r:nr,g:ng,b:nb}=hslToRgb((h+dh+360)%360,Math.min(100,ds),Math.min(100,dl));
    return rgbToHex(nr,ng,nb);
  };
  return {
    complementary: [hex, make(180)],
    triadic:       [hex, make(120), make(240)],
    analogous:     [make(-30), hex, make(30)],
    splitComp:     [hex, make(150), make(210)],
    tetradic:      [hex, make(90), make(180), make(270)],
    monochromatic: [make(0,s,Math.max(10,l-30)), make(0,s,Math.max(20,l-15)), hex, make(0,s,Math.min(90,l+15)), make(0,s,Math.min(95,l+30))],
  };
}

/* Gradient generator */
function makeGradient(hex, steps=5){
  const {r,g,b}=hexToRgb(hex);
  const {h,s}=rgbToHsl(r,g,b);
  return Array.from({length:steps},(_,i)=>{
    const l=15+i*(70/(steps-1));
    const {r:nr,g:ng,b:nb}=hslToRgb(h,s,l);
    return rgbToHex(nr,ng,nb);
  });
}

/* Named color lookup (150 CSS named colors) */
const NAMED = {
  '#f0f8ff':'AliceBlue','#faebd7':'AntiqueWhite','#00ffff':'Aqua','#7fffd4':'Aquamarine',
  '#f0ffff':'Azure','#f5f5dc':'Beige','#ffe4c4':'Bisque','#000000':'Black',
  '#ffebcd':'BlanchedAlmond','#0000ff':'Blue','#8a2be2':'BlueViolet','#a52a2a':'Brown',
  '#deb887':'BurlyWood','#5f9ea0':'CadetBlue','#7fff00':'Chartreuse','#d2691e':'Chocolate',
  '#ff7f50':'Coral','#6495ed':'CornflowerBlue','#fff8dc':'Cornsilk','#dc143c':'Crimson',
  '#00008b':'DarkBlue','#008b8b':'DarkCyan','#b8860b':'DarkGoldenRod','#a9a9a9':'DarkGray',
  '#006400':'DarkGreen','#bdb76b':'DarkKhaki','#8b008b':'DarkMagenta','#556b2f':'DarkOliveGreen',
  '#ff8c00':'DarkOrange','#9932cc':'DarkOrchid','#8b0000':'DarkRed','#e9967a':'DarkSalmon',
  '#8fbc8f':'DarkSeaGreen','#483d8b':'DarkSlateBlue','#2f4f4f':'DarkSlateGray',
  '#00ced1':'DarkTurquoise','#9400d3':'DarkViolet','#ff1493':'DeepPink','#00bfff':'DeepSkyBlue',
  '#696969':'DimGray','#1e90ff':'DodgerBlue','#b22222':'FireBrick','#fffaf0':'FloralWhite',
  '#228b22':'ForestGreen','#ff00ff':'Fuchsia','#dcdcdc':'Gainsboro','#f8f8ff':'GhostWhite',
  '#ffd700':'Gold','#daa520':'GoldenRod','#808080':'Gray','#008000':'Green',
  '#adff2f':'GreenYellow','#f0fff0':'HoneyDew','#ff69b4':'HotPink','#cd5c5c':'IndianRed',
  '#4b0082':'Indigo','#fffff0':'Ivory','#f0e68c':'Khaki','#e6e6fa':'Lavender',
  '#fff0f5':'LavenderBlush','#7cfc00':'LawnGreen','#fffacd':'LemonChiffon','#add8e6':'LightBlue',
  '#f08080':'LightCoral','#e0ffff':'LightCyan','#fafad2':'LightGoldenRodYellow',
  '#90ee90':'LightGreen','#ffb6c1':'LightPink','#ffa07a':'LightSalmon','#20b2aa':'LightSeaGreen',
  '#87cefa':'LightSkyBlue','#778899':'LightSlateGray','#b0c4de':'LightSteelBlue',
  '#ffffe0':'LightYellow','#00ff00':'Lime','#32cd32':'LimeGreen','#faf0e6':'Linen',
  '#800000':'Maroon','#66cdaa':'MediumAquaMarine','#0000cd':'MediumBlue','#ba55d3':'MediumOrchid',
  '#9370db':'MediumPurple','#3cb371':'MediumSeaGreen','#7b68ee':'MediumSlateBlue',
  '#00fa9a':'MediumSpringGreen','#48d1cc':'MediumTurquoise','#c71585':'MediumVioletRed',
  '#191970':'MidnightBlue','#f5fffa':'MintCream','#ffe4e1':'MistyRose','#ffe4b5':'Moccasin',
  '#ffdead':'NavajoWhite','#000080':'Navy','#fdf5e6':'OldLace','#808000':'Olive',
  '#6b8e23':'OliveDrab','#ffa500':'Orange','#ff4500':'OrangeRed','#da70d6':'Orchid',
  '#eee8aa':'PaleGoldenRod','#98fb98':'PaleGreen','#afeeee':'PaleTurquoise',
  '#db7093':'PaleVioletRed','#ffefd5':'PapayaWhip','#ffdab9':'PeachPuff','#cd853f':'Peru',
  '#ffc0cb':'Pink','#dda0dd':'Plum','#b0e0e6':'PowderBlue','#800080':'Purple',
  '#ff0000':'Red','#bc8f8f':'RosyBrown','#4169e1':'RoyalBlue','#8b4513':'SaddleBrown',
  '#fa8072':'Salmon','#f4a460':'SandyBrown','#2e8b57':'SeaGreen','#fff5ee':'SeaShell',
  '#a0522d':'Sienna','#c0c0c0':'Silver','#87ceeb':'SkyBlue','#6a5acd':'SlateBlue',
  '#708090':'SlateGray','#fffafa':'Snow','#00ff7f':'SpringGreen','#4682b4':'SteelBlue',
  '#d2b48c':'Tan','#008080':'Teal','#d8bfd8':'Thistle','#ff6347':'Tomato',
  '#40e0d0':'Turquoise','#ee82ee':'Violet','#f5deb3':'Wheat','#ffffff':'White',
  '#f5f5f5':'WhiteSmoke','#ffff00':'Yellow','#9acd32':'YellowGreen',
};
function getColorName(hex){
  const h=hex.toLowerCase();
  if(NAMED[h])return NAMED[h];
  // Find closest by euclidean RGB distance
  const {r,g,b}=hexToRgb(hex);
  let best='',bestD=Infinity;
  for(const [k,v] of Object.entries(NAMED)){
    const {r:nr,g:ng,b:nb}=hexToRgb(k);
    const d=Math.sqrt((r-nr)**2+(g-ng)**2+(b-nb)**2);
    if(d<bestD){bestD=d;best=v;}
  }
  return bestD<30?`≈ ${best}`:'Custom';
}

/* Canvas SV picker (2D saturation/value box) */
function SvPicker({ hue, sv, onSvChange, dark }) {
  const canvasRef = useRef(null);
  const dragging = useRef(false);

  useEffect(()=>{
    const c = canvasRef.current;
    if(!c) return;
    const ctx = c.getContext('2d');
    const W=c.width,H=c.height;
    // White → Hue gradient
    const gH = ctx.createLinearGradient(0,0,W,0);
    gH.addColorStop(0,'white');
    const {r,g,b}=hsvToRgb(hue,100,100);
    gH.addColorStop(1,`rgb(${r},${g},${b})`);
    ctx.fillStyle=gH;ctx.fillRect(0,0,W,H);
    // Top → Black gradient
    const gV=ctx.createLinearGradient(0,0,0,H);
    gV.addColorStop(0,'transparent');gV.addColorStop(1,'black');
    ctx.fillStyle=gV;ctx.fillRect(0,0,W,H);
  },[hue]);

  const pick = useCallback((e)=>{
    const c = canvasRef.current; if(!c) return;
    const rect = c.getBoundingClientRect();
    const x = Math.max(0,Math.min(c.width, (e.clientX??e.touches?.[0]?.clientX??0) - rect.left));
    const y = Math.max(0,Math.min(c.height,(e.clientY??e.touches?.[0]?.clientY??0) - rect.top));
    onSvChange(Math.round(x/c.width*100), Math.round((1-y/c.height)*100));
  },[onSvChange]);

  return (
    <div style={{position:'relative',userSelect:'none'}}>
      <canvas ref={canvasRef} width={280} height={160} className="picker-canvas"
        onMouseDown={e=>{dragging.current=true;pick(e);}}
        onMouseMove={e=>{if(dragging.current)pick(e);}}
        onMouseUp={()=>dragging.current=false}
        onMouseLeave={()=>dragging.current=false}
        onTouchStart={e=>{dragging.current=true;pick(e);e.preventDefault();}}
        onTouchMove={e=>{if(dragging.current){pick(e);e.preventDefault();}}}
        onTouchEnd={()=>dragging.current=false}
        style={{width:'100%',maxWidth:280,height:160}}
      />
      {/* Cursor dot */}
      <div style={{position:'absolute',
        left:`${sv.s}%`,top:`${100-sv.v}%`,
        transform:'translate(-50%,-50%)',
        width:12,height:12,borderRadius:'50%',
        border:'2.5px solid white',
        boxShadow:'0 0 4px rgba(0,0,0,.5)',
        pointerEvents:'none',transition:'left .05s,top .05s'}}/>
    </div>
  );
}

/* Hue rail */
function HueRail({ hue, onChange }) {
  return (
    <div style={{position:'relative',marginTop:8}}>
      <div style={{height:12,borderRadius:6,
        background:'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)',
        cursor:'crosshair',position:'relative'}}
        onClick={e=>{
          const r=e.currentTarget.getBoundingClientRect();
          onChange(Math.round(((e.clientX-r.left)/r.width)*360));
        }}>
        <div style={{position:'absolute',top:-2,
          left:`${hue/360*100}%`,transform:'translateX(-50%)',
          width:16,height:16,borderRadius:'50%',
          background:'white',border:'2.5px solid rgba(0,0,0,.3)',
          boxShadow:'0 1px 5px rgba(0,0,0,.4)',
          pointerEvents:'none',transition:'left .04s'}}/>
      </div>
    </div>
  );
}

/* Alpha rail */
function AlphaRail({ hex, alpha, onChange }) {
  const {r,g,b}=hexToRgb(hex);
  return (
    <div style={{position:'relative',marginTop:8}}>
      <div style={{height:12,borderRadius:6,cursor:'crosshair',position:'relative',
        background:`linear-gradient(to right,transparent,rgb(${r},${g},${b}))`,
        backgroundImage:`linear-gradient(to right,rgba(${r},${g},${b},0),rgb(${r},${g},${b})),url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='4' height='4' fill='%23ccc'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23ccc'/%3E%3C/svg%3E")`,
        backgroundBlendMode:'normal,normal',
        }}
        onClick={e=>{
          const r=e.currentTarget.getBoundingClientRect();
          onChange(Math.round(((e.clientX-r.left)/r.width)*100)/100);
        }}>
        <div style={{position:'absolute',top:-2,left:`${alpha*100}%`,transform:'translateX(-50%)',
          width:16,height:16,borderRadius:'50%',background:'white',border:'2.5px solid rgba(0,0,0,.3)',
          boxShadow:'0 1px 5px rgba(0,0,0,.4)',pointerEvents:'none',transition:'left .04s'}}/>
      </div>
    </div>
  );
}

const PAGE_TABS = [
  {id:'picker',    label:'◉ Picker'},
  {id:'harmonies', label:'◈ Harmonies'},
  {id:'contrast',  label:'⊡ Contrast'},
  {id:'palette',   label:'▦ Palette'},
  {id:'gradient',  label:'▩ Gradient'},
  {id:'learn',     label:'∑ Learn'},
];

const PRESETS = [
  '#ef4444','#f97316','#eab308','#22c55e','#06b6d4','#3b82f6','#8b5cf6','#ec4899',
  '#ffffff','#d1d5db','#6b7280','#374151','#1f2937','#000000','#fef3c7','#dcfce7',
];

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
export default function ColorPicker() {
  const [mode, setMode] = useState('dark');
  const dark = mode === 'dark';

  const [hex, setHex]     = useState('#a855f7');
  const [alpha, setAlpha] = useState(1);
  const [hexInput, setHexInput] = useState('#a855f7');
  const [tab, setTab]     = useState('picker');

  // HSV state (drives the 2D picker)
  const {r,g,b} = hexToRgb(hex);
  const {h:hHsv,s:sHsv,v:vHsv} = rgbToHsv(r,g,b);
  const [hue,  setHue]  = useState(hHsv);
  const [sv,   setSv]   = useState({s:sHsv,v:vHsv});

  // Palette (saved swatches)
  const [palette, setPalette] = useState(['#a855f7','#ec4899','#06b6d4','#22c55e']);
  const [copyFlash, setCopyFlash] = useState('');

  // Gradient
  const [gradStops, setGradStops] = useState(['#a855f7','#ec4899']);
  const [gradDir, setGradDir] = useState(90);
  const [gradType, setGradType] = useState('linear');

  // Contrast checker
  const [bgHex, setBgHex] = useState('#ffffff');
  const [fgHex, setFgHex] = useState('#1a0533');

  // Sync hex ↔ HSV
  const applyHex = useCallback((h) => {
    const clean = h.replace(/[^#0-9a-fA-F]/g,'');
    if(clean.length===7||clean.length===4){
      const {r,g,b}=hexToRgb(clean);
      const {h:nh,s:ns,v:nv}=rgbToHsv(r,g,b);
      setHue(nh); setSv({s:ns,v:nv}); setHex(clean); setHexInput(clean);
    }
  },[]);

  const applyHueSv = useCallback((nh,ns,nv)=>{
    const {r,g,b}=hsvToRgb(nh??hue,ns??sv.s,nv??sv.v);
    const newHex=rgbToHex(r,g,b);
    setHex(newHex); setHexInput(newHex);
  },[hue,sv]);

  // Derived values
  const hsl = rgbToHsl(r,g,b);
  const hsv = rgbToHsv(r,g,b);
  const cmyk = rgbToCmyk(r,g,b);
  const colorName = useMemo(()=>getColorName(hex),[hex]);
  const harmonies = useMemo(()=>getHarmonies(hex),[hex]);
  const gradColors = useMemo(()=>makeGradient(hex),[hex]);
  const contrastRat = useMemo(()=>contrastRatio(fgHex,bgHex),[fgHex,bgHex]);
  const wcag = useMemo(()=>wcagLevel(contrastRat),[contrastRat]);

  const copyText = (txt) => {
    try { navigator.clipboard.writeText(txt); } catch(e){}
    setCopyFlash(txt); setTimeout(()=>setCopyFlash(''),1400);
  };

  const randomColor = () => {
    const h=Math.random()*360,s=50+Math.random()*50,l=30+Math.random()*40;
    const {r,g,b}=hslToRgb(h,s,l);
    applyHex(rgbToHex(r,g,b));
  };

  const gradCss = gradType==='linear'
    ? `linear-gradient(${gradDir}deg,${gradStops.join(',')})`
    : `radial-gradient(circle,${gradStops.join(',')})`;

  return (
    <>
      <style>{STYLES}</style>
      <div className={dark?'dark':'light'}>

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <div style={{width:26,height:26,borderRadius:dark?3:7,
              background:dark?'transparent':'linear-gradient(135deg,#7c3aed,#ec4899)',
              border:dark?'1px solid rgba(168,85,247,.45)':'none',
              display:'flex',alignItems:'center',justifyContent:'center',
              color:dark?'var(--acc)':'#fff',
              boxShadow:dark?'0 0 12px rgba(168,85,247,.3)':'0 3px 10px rgba(124,58,237,.4)'}}>
              {I.drop(13)}
            </div>
            <span style={{fontSize:13.5,fontWeight:900,fontFamily:"'Cabinet Grotesk',sans-serif",
              color:'var(--txt)',letterSpacing:'-.01em'}}>
              color<span style={{color:'var(--acc)'}}>.pick</span>
            </span>
          </div>
          <div style={{flex:1}}/>

          {/* Live swatch + hex */}
          <div style={{display:'flex',alignItems:'center',gap:7,padding:'3px 10px',
            borderRadius:dark?2:7,
            border:dark?'1px solid rgba(168,85,247,.22)':'1.5px solid rgba(124,58,237,.2)',
            background:dark?'rgba(168,85,247,.05)':'rgba(124,58,237,.04)'}}>
            <div style={{width:14,height:14,borderRadius:'50%',background:hex,
              boxShadow:dark?`0 0 8px ${hex}88`:'none',flexShrink:0}}/>
            <span style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:'var(--txt2)',letterSpacing:'.08em'}}>
              {hex.toUpperCase()}
            </span>
            <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:'var(--txt3)'}}>
              {colorName}
            </span>
          </div>

          <button className="btn-ghost" onClick={randomColor}>{I.shuffle(10)} Random</button>

          {/* Theme */}
          <button onClick={()=>setMode(dark?'light':'dark')} style={{
            display:'flex',alignItems:'center',gap:5,padding:'4px 10px',
            border:dark?'1px solid rgba(168,85,247,.18)':'1.5px solid var(--bdr)',
            borderRadius:dark?2:6,background:dark?'rgba(168,85,247,.03)':'var(--sur)',
            cursor:'pointer',transition:'all .14s'}}>
            {dark?(
              <><div style={{width:26,height:14,borderRadius:7,background:'var(--acc)',position:'relative',boxShadow:'0 0 7px rgba(168,85,247,.5)'}}>
                <div style={{position:'absolute',top:2,right:2,width:10,height:10,borderRadius:'50%',background:'#08060c'}}/>
              </div><span style={{fontSize:9,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:'rgba(168,85,247,.6)',letterSpacing:'.1em'}}>NIT</span></>
            ):(
              <><span style={{fontSize:9.5,color:'var(--txt3)',fontWeight:600,fontFamily:"'JetBrains Mono',monospace"}}>LGT</span>
              <div style={{width:26,height:14,borderRadius:7,background:'#e0d4f7',position:'relative'}}>
                <div style={{position:'absolute',top:2,left:2,width:10,height:10,borderRadius:'50%',background:'#c4b0ee'}}/>
              </div></>
            )}
          </button>
        </div>

        {/* TAB BAR */}
        <div className="tab-bar" style={{display:'flex'}}>
          {PAGE_TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* BODY */}
        <div className="body-layout">

          {/* SIDEBAR */}
          <div className="sidebar">

            {/* Big swatch */}
            <div style={{borderRadius:dark?4:10,overflow:'hidden',border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>
              <div style={{height:64,background:hex,transition:'background .2s'}}/>
              <div style={{padding:'8px 10px',background:dark?'rgba(0,0,0,.3)':'rgba(255,255,255,.8)'}}>
                <div style={{fontSize:12.5,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:'var(--txt)',marginBottom:2}}>
                  {hex.toUpperCase()}
                </div>
                <div style={{fontSize:9.5,color:'var(--txt3)',fontFamily:"'JetBrains Mono',monospace"}}>{colorName}</div>
              </div>
            </div>

            {/* Formats */}
            <div>
              <div className="sec-title">Color Values</div>
              {[
                {l:'HEX', v:hex.toUpperCase()},
                {l:'RGB', v:`rgb(${r}, ${g}, ${b})`},
                {l:'HSL', v:`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`},
                {l:'HSV', v:`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`},
              ].map(({l,v})=>(
                <div key={l} onClick={()=>copyText(v)} className="metric"
                  style={{marginBottom:5,cursor:'pointer',position:'relative',transition:'all .12s'}}>
                  <div style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",color:'var(--txt3)',letterSpacing:'.15em',marginBottom:1}}>{l}</div>
                  <div style={{fontSize:10.5,fontFamily:"'JetBrains Mono',monospace",color:'var(--txt2)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{wordBreak:'break-all'}}>{v}</span>
                    <span style={{opacity:.4,marginLeft:4,flexShrink:0}}>{I.copy(9)}</span>
                  </div>
                  {copyFlash===v&&<span className="copy-flash">Copied!</span>}
                </div>
              ))}
            </div>

            {/* Presets */}
            <div>
              <div className="sec-title">Presets</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {PRESETS.map(p=>(
                  <div key={p} className="swatch" onClick={()=>applyHex(p)}
                    style={{width:20,height:20,background:p,
                      border:hex===p?(dark?'2px solid var(--acc)':'2px solid var(--acc)'):(dark?'1px solid rgba(255,255,255,.15)':'1px solid rgba(0,0,0,.12)'),
                      boxShadow:hex===p?`0 0 8px ${p}88`:'none'}}/>
                ))}
              </div>
            </div>

          </div>

          {/* MAIN */}
          <div style={{padding:'13px 15px',display:'flex',flexDirection:'column',gap:13}}>
            <AnimatePresence mode="wait">

              {/* ════ PICKER ════ */}
              {tab==='picker'&&(
                <motion.div key="picker" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>

                  <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:16,alignItems:'start'}}>
                    {/* Canvas + rails */}
                    <div style={{display:'flex',flexDirection:'column',gap:6}}>
                      <SvPicker hue={hue} sv={sv}
                        onSvChange={(s,v)=>{setSv({s,v});applyHueSv(hue,s,v);}} dark={dark}/>
                      <HueRail hue={hue} onChange={h=>{setHue(h);applyHueSv(h,sv.s,sv.v);}}/>
                      <AlphaRail hex={hex} alpha={alpha} onChange={setAlpha}/>
                    </div>

                    {/* Values + inputs */}
                    <div style={{display:'flex',flexDirection:'column',gap:12}}>
                      {/* Big preview */}
                      <div style={{height:54,borderRadius:dark?4:10,
                        background:`rgba(${r},${g},${b},${alpha})`,
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                        position:'relative',overflow:'hidden',
                        boxShadow:dark?`0 0 24px ${hex}44`:''}}>
                        <div style={{position:'absolute',inset:0,
                          backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='4' height='4' fill='%23aaa' opacity='.3'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23aaa' opacity='.3'/%3E%3C/svg%3E\")",
                          zIndex:-1}}/>
                      </div>

                      {/* HEX input */}
                      <div>
                        <div className="lbl">HEX</div>
                        <div style={{display:'flex',gap:6}}>
                          <input className="inp" value={hexInput}
                            onChange={e=>{setHexInput(e.target.value);applyHex(e.target.value);}}
                            placeholder="#a855f7" spellCheck={false}
                            style={{fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.1em'}}/>
                          <button className="btn-ghost" onClick={()=>copyText(hex.toUpperCase())}
                            style={{flexShrink:0,padding:'6px 10px'}}>
                            {copyFlash===hex.toUpperCase()?I.ok(11):I.copy(11)}
                          </button>
                        </div>
                      </div>

                      {/* RGB sliders */}
                      <div>
                        <div className="lbl">RGB</div>
                        {[['R',r,255,'#ef4444'],['G',g,255,'#22c55e'],['B',b,255,'#3b82f6']].map(([lbl,val,mx,col])=>(
                          <div key={lbl} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                            <span style={{width:10,fontSize:10,fontFamily:"'JetBrains Mono',monospace",
                              fontWeight:700,color:col}}>{lbl}</span>
                            <input type="range" min="0" max={mx} value={val} className="range"
                              style={{flex:1,background:`linear-gradient(to right,${dark?'rgba(255,255,255,.06)':'rgba(0,0,0,.06)'},${col}88)`}}
                              onChange={e=>{
                                const nr=lbl==='R'?+e.target.value:r;
                                const ng=lbl==='G'?+e.target.value:g;
                                const nb=lbl==='B'?+e.target.value:b;
                                applyHex(rgbToHex(nr,ng,nb));
                              }}/>
                            <span style={{width:28,fontSize:10.5,fontFamily:"'JetBrains Mono',monospace",
                              color:'var(--txt2)',textAlign:'right'}}>{val}</span>
                          </div>
                        ))}
                      </div>

                      {/* HSL sliders */}
                      <div>
                        <div className="lbl">HSL</div>
                        {[['H',hsl.h,360],['S',hsl.s,100],['L',hsl.l,100]].map(([lbl,val,mx])=>(
                          <div key={lbl} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                            <span style={{width:10,fontSize:10,fontFamily:"'JetBrains Mono',monospace",
                              fontWeight:700,color:'var(--txt3)'}}>{lbl}</span>
                            <input type="range" min="0" max={mx} value={val} className="range" style={{flex:1}}
                              onChange={e=>{
                                const nh=lbl==='H'?+e.target.value:hsl.h;
                                const ns=lbl==='S'?+e.target.value:hsl.s;
                                const nl=lbl==='L'?+e.target.value:hsl.l;
                                const {r:nr,g:ng,b:nb}=hslToRgb(nh,ns,nl);
                                applyHex(rgbToHex(nr,ng,nb));
                                if(lbl==='H')setHue(nh);
                              }}/>
                            <span style={{width:28,fontSize:10.5,fontFamily:"'JetBrains Mono',monospace",
                              color:'var(--txt2)',textAlign:'right'}}>{val}</span>
                          </div>
                        ))}
                      </div>

                      {/* CMYK row */}
                      <div style={{display:'flex',gap:8}}>
                        {Object.entries(cmyk).map(([k,v])=>(
                          <div key={k} className="metric" style={{flex:1,textAlign:'center'}}>
                            <div style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",
                              letterSpacing:'.1em',textTransform:'uppercase',color:'var(--txt3)',marginBottom:2}}>{k}</div>
                            <div style={{fontSize:14,fontWeight:700,color:'var(--txt)',fontFamily:"'JetBrains Mono',monospace"}}>{v}</div>
                            <div style={{fontSize:8,color:'var(--txt3)',fontFamily:"'JetBrains Mono',monospace"}}>%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Save to palette */}
                  <div style={{display:'flex',gap:8,alignItems:'center',padding:'10px 13px',
                    borderRadius:dark?3:8,
                    border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                    background:dark?'rgba(168,85,247,.03)':'rgba(124,58,237,.03)'}}>
                    <div style={{width:24,height:24,borderRadius:'50%',background:hex,
                      boxShadow:dark?`0 0 8px ${hex}66`:'none',flexShrink:0}}/>
                    <span style={{flex:1,fontSize:11.5,fontFamily:"'JetBrains Mono',monospace",
                      color:'var(--txt2)'}}>{hex.toUpperCase()} — {colorName}</span>
                    <button className="btn-ghost" onClick={()=>setPalette(p=>[...new Set([...p,hex])].slice(-12))}>
                      {I.plus(10)} Save
                    </button>
                    <button className="btn-ghost" onClick={()=>copyText(`rgba(${r},${g},${b},${alpha})`)}>
                      {I.copy(10)} Copy RGBA
                    </button>
                  </div>

                </motion.div>
              )}

              {/* ════ HARMONIES ════ */}
              {tab==='harmonies'&&(
                <motion.div key="harm" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>
                  {Object.entries(harmonies).map(([name,cols])=>(
                    <div key={name} className="panel" style={{padding:'13px 15px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                        <div>
                          <div className="lbl" style={{margin:0}}>{name.replace(/([A-Z])/g,' $1').trim()}</div>
                          <div style={{fontSize:10.5,fontFamily:"'JetBrains Mono',monospace",color:'var(--txt3)',marginTop:2}}>
                            {name==='complementary'?'Opposite hues — maximum contrast':
                             name==='triadic'?'3 evenly spaced hues — vibrant & balanced':
                             name==='analogous'?'Adjacent hues — natural & harmonious':
                             name==='splitComp'?'Complement split — softer contrast':
                             name==='tetradic'?'4 hues in rectangle — rich palettes':
                             '5 tints of the same hue'}
                          </div>
                        </div>
                        <button className="btn-ghost" onClick={()=>copyText(cols.join(', '))}
                          style={{fontSize:9}}>
                          {I.copy(9)} Copy all
                        </button>
                      </div>
                      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                        {cols.map((c,i)=>{
                          const {r:cr,g:cg,b:cb}=hexToRgb(c);
                          const {l:cl}=rgbToHsl(cr,cg,cb);
                          return (
                            <motion.div key={i} initial={{scale:0}} animate={{scale:1}}
                              transition={{delay:i*.05}}
                              onClick={()=>applyHex(c)}
                              style={{cursor:'pointer',borderRadius:dark?4:8,overflow:'hidden',
                                border:dark?'1px solid rgba(255,255,255,.07)':'1.5px solid rgba(0,0,0,.08)',
                                flexShrink:0}}>
                              <div style={{width:72,height:56,background:c,transition:'background .15s'}}/>
                              <div style={{padding:'5px 6px',background:dark?'rgba(0,0,0,.4)':'rgba(255,255,255,.9)'}}>
                                <div style={{fontSize:9.5,fontFamily:"'JetBrains Mono',monospace",
                                  fontWeight:600,color:'var(--txt)',marginBottom:1}}>
                                  {c.toUpperCase()}
                                </div>
                                <div style={{fontSize:8.5,color:'var(--txt3)',fontFamily:"'JetBrains Mono',monospace"}}>
                                  L:{cl}%
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {/* ════ CONTRAST ════ */}
              {tab==='contrast'&&(
                <motion.div key="contrast" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>

                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    {/* FG */}
                    <div>
                      <div className="lbl">Foreground (text)</div>
                      <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:6}}>
                        <div style={{width:32,height:32,borderRadius:dark?3:7,background:fgHex,
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          cursor:'pointer',flexShrink:0}}
                          onClick={()=>applyHex(fgHex)}/>
                        <input className="inp" value={fgHex}
                          onChange={e=>{if(e.target.value.match(/^#[0-9a-fA-F]{0,6}$/))setFgHex(e.target.value);}}
                          style={{fontFamily:"'JetBrains Mono',monospace",flex:1}}/>
                      </div>
                    </div>
                    {/* BG */}
                    <div>
                      <div className="lbl">Background</div>
                      <div style={{display:'flex',gap:6,alignItems:'center',marginBottom:6}}>
                        <div style={{width:32,height:32,borderRadius:dark?3:7,background:bgHex,
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          cursor:'pointer',flexShrink:0}}/>
                        <input className="inp" value={bgHex}
                          onChange={e=>{if(e.target.value.match(/^#[0-9a-fA-F]{0,6}$/))setBgHex(e.target.value);}}
                          style={{fontFamily:"'JetBrains Mono',monospace",flex:1}}/>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div style={{borderRadius:dark?4:12,overflow:'hidden',
                    border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>
                    <div style={{background:bgHex,padding:'28px 24px'}}>
                      <p style={{color:fgHex,fontSize:28,fontWeight:800,
                        fontFamily:"'Cabinet Grotesk',sans-serif",marginBottom:8,lineHeight:1.2}}>
                        The quick brown fox
                      </p>
                      <p style={{color:fgHex,fontSize:14,lineHeight:1.7,marginBottom:8}}>
                        Normal text at 14px. WCAG requires 4.5:1 for normal text at AA level.
                      </p>
                      <p style={{color:fgHex,fontSize:11}}>
                        Small text at 11px. Harder to read — higher contrast needed.
                      </p>
                    </div>
                  </div>

                  {/* Ratio cards */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
                    {[
                      {l:'Contrast Ratio', v:`${contrastRat.toFixed(2)}:1`, big:true},
                      {l:'WCAG Level',  v:wcag.level, ok:wcag.ok},
                      {l:'Normal Text (AA)', v:contrastRat>=4.5?'✓ Pass':'✗ Fail', ok:contrastRat>=4.5},
                      {l:'Large Text (AA)',  v:contrastRat>=3?'✓ Pass':'✗ Fail',   ok:contrastRat>=3},
                      {l:'Normal Text (AAA)',v:contrastRat>=7?'✓ Pass':'✗ Fail',   ok:contrastRat>=7},
                      {l:'UI Components',   v:contrastRat>=3?'✓ Pass':'✗ Fail',   ok:contrastRat>=3},
                    ].map(({l,v,ok,big})=>(
                      <div key={l} className="metric">
                        <div style={{fontSize:8,fontFamily:"'JetBrains Mono',monospace",
                          letterSpacing:'.12em',textTransform:'uppercase',color:'var(--txt3)',marginBottom:4}}>{l}</div>
                        <div style={{fontSize:big?22:16,fontWeight:800,fontFamily:"'JetBrains Mono',monospace",
                          color:ok===undefined?'var(--acc)':ok?'var(--ok)':'var(--err)'}}>{v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Suggestions */}
                  <div className="hint" style={{fontSize:12}}>
                    {I.info(13)} {contrastRat >= 4.5
                      ? `Great contrast! ${contrastRat.toFixed(2)}:1 passes WCAG AA for all text sizes.`
                      : contrastRat >= 3
                      ? `Contrast ${contrastRat.toFixed(2)}:1 — passes for large text and UI only. Increase contrast for body text.`
                      : `Contrast ${contrastRat.toFixed(2)}:1 — insufficient for accessibility. Darken the text or lighten the background.`}
                  </div>

                </motion.div>
              )}

              {/* ════ PALETTE ════ */}
              {tab==='palette'&&(
                <motion.div key="palette" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>

                  <div className="hint" style={{display:'flex',gap:7,fontSize:12}}>
                    {I.info(13)} Save colors from the Picker tab to build your palette. Click any swatch to select it.
                  </div>

                  {palette.length === 0 ? (
                    <div style={{textAlign:'center',padding:'48px 24px',fontSize:14,color:'var(--txt3)',
                      fontFamily:"'JetBrains Mono',monospace"}}>
                      No colors saved yet — add from the ◉ Picker tab.
                    </div>
                  ) : (
                    <>
                      {/* Swatch strip */}
                      <div style={{display:'flex',borderRadius:dark?4:10,overflow:'hidden',
                        border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',height:60}}>
                        {palette.map((c,i)=>(
                          <div key={i} style={{flex:1,background:c,cursor:'pointer',transition:'flex .2s'}}
                            onClick={()=>applyHex(c)} title={c}/>
                        ))}
                      </div>

                      {/* Grid */}
                      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))',gap:8}}>
                        {palette.map((c,i)=>{
                          const {r:cr,g:cg,b:cb}=hexToRgb(c);
                          const {l}=rgbToHsl(cr,cg,cb);
                          return (
                            <div key={i} className="panel" style={{overflow:'hidden',cursor:'pointer'}}
                              onClick={()=>applyHex(c)}>
                              <div style={{height:52,background:c}}/>
                              <div style={{padding:'6px 8px'}}>
                                <div style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",
                                  fontWeight:600,color:'var(--txt)',marginBottom:2}}>{c.toUpperCase()}</div>
                                <div style={{display:'flex',justifyContent:'space-between'}}>
                                  <span style={{fontSize:8.5,color:'var(--txt3)',fontFamily:"'JetBrains Mono',monospace"}}>L:{l}%</span>
                                  <button onClick={e=>{e.stopPropagation();setPalette(p=>p.filter((_,j)=>j!==i));}}
                                    style={{background:'none',border:'none',cursor:'pointer',color:'var(--err)',padding:0}}>
                                    {I.trash(10)}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Export */}
                      <div style={{display:'flex',gap:8}}>
                        <button className="btn-ghost" onClick={()=>copyText(palette.join(', '))}>
                          {I.copy(10)} Copy HEX list
                        </button>
                        <button className="btn-ghost" onClick={()=>{
                          const css=`:root {\n${palette.map((c,i)=>`  --color-${i+1}: ${c};`).join('\n')}\n}`;
                          copyText(css);
                        }}>
                          {I.copy(10)} Copy CSS vars
                        </button>
                        <button className="btn-ghost" onClick={()=>setPalette([])}>
                          {I.trash(10)} Clear all
                        </button>
                      </div>
                    </>
                  )}

                </motion.div>
              )}

              {/* ════ GRADIENT ════ */}
              {tab==='gradient'&&(
                <motion.div key="gradient" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>

                  {/* Big preview */}
                  <div style={{height:120,borderRadius:dark?4:12,
                    background:gradCss,
                    border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                    boxShadow:dark?`0 8px 40px rgba(0,0,0,.4)`:'0 4px 24px rgba(0,0,0,.08)',
                    transition:'background .2s'}}/>

                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
                    {/* Stops */}
                    <div>
                      <div className="lbl">Color Stops</div>
                      {gradStops.map((s,i)=>(
                        <div key={i} style={{display:'flex',gap:7,alignItems:'center',marginBottom:7}}>
                          <div style={{width:28,height:28,borderRadius:dark?2:6,background:s,
                            border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',flexShrink:0}}/>
                          <input className="inp" value={s}
                            onChange={e=>{
                              const v=e.target.value;
                              if(v.match(/^#[0-9a-fA-F]{0,6}$/)){
                                setGradStops(prev=>{const n=[...prev];n[i]=v;return n;});
                              }
                            }}
                            style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11}}/>
                          <button className="btn-ghost" style={{padding:'4px 7px',flexShrink:0}}
                            onClick={()=>{const v=s;applyHex(v.length===7?v:hex);}}>Use</button>
                          {gradStops.length>2&&(
                            <button onClick={()=>setGradStops(p=>p.filter((_,j)=>j!==i))}
                              style={{background:'none',border:'none',cursor:'pointer',color:'var(--err)',flexShrink:0}}>
                              {I.trash(10)}
                            </button>
                          )}
                        </div>
                      ))}
                      <button className="btn-ghost" onClick={()=>setGradStops(p=>[...p,hex])}
                        style={{width:'100%',justifyContent:'center',marginTop:3}}>
                        {I.plus(10)} Add stop
                      </button>
                    </div>

                    {/* Settings */}
                    <div style={{display:'flex',flexDirection:'column',gap:10}}>
                      <div>
                        <div className="lbl">Type</div>
                        <div style={{display:'flex',gap:6}}>
                          {['linear','radial'].map(t=>(
                            <button key={t} className={`btn-ghost ${gradType===t?'on':''}`}
                              onClick={()=>setGradType(t)}
                              style={{flex:1,padding:'6px 8px',fontSize:10}}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      {gradType==='linear'&&(
                        <div>
                          <div className="lbl">Angle: {gradDir}°</div>
                          <input type="range" min="0" max="360" value={gradDir} className="range"
                            style={{width:'100%'}} onChange={e=>setGradDir(+e.target.value)}/>
                        </div>
                      )}
                      {/* Auto palette */}
                      <div>
                        <div className="lbl">Auto from current</div>
                        <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                          {gradColors.map((c,i)=>(
                            <div key={i} onClick={()=>setGradStops(gradColors)}
                              style={{width:22,height:22,borderRadius:'50%',background:c,cursor:'pointer',
                                border:dark?'1px solid rgba(255,255,255,.1)':'1px solid rgba(0,0,0,.1)'}}/>
                          ))}
                          <button className="btn-ghost" style={{fontSize:9,padding:'3px 7px'}}
                            onClick={()=>setGradStops(gradColors)}>Apply</button>
                        </div>
                      </div>
                      {/* CSS output */}
                      <div>
                        <div className="lbl">CSS</div>
                        <div style={{padding:'7px 10px',borderRadius:dark?3:6,
                          background:dark?'rgba(0,0,0,.4)':'rgba(124,58,237,.04)',
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,
                          color:'var(--acc)',wordBreak:'break-all',cursor:'pointer'}}
                          onClick={()=>copyText(`background: ${gradCss};`)}>
                          background: {gradCss};
                          <span style={{float:'right',opacity:.5}}>{I.copy(9)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* ════ LEARN ════ */}
              {tab==='learn'&&(
                <motion.div key="learn" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <div className="panel" style={{padding:'20px 22px',marginBottom:12}}>
                    <div style={{fontSize:20,fontWeight:900,fontFamily:"'Cabinet Grotesk',sans-serif",
                      color:'var(--txt)',marginBottom:3}}>
                      Color Theory & Digital Color
                    </div>
                    <p style={{fontSize:11,color:'var(--txt3)',fontFamily:"'JetBrains Mono',monospace",marginBottom:20}}>
                      Color models · accessibility · harmony · perception
                    </p>
                    <div className="prose">
                      <p>Every color on screen is specified as a combination of numbers in a color model. The model you choose determines what is easy to express and manipulate.</p>
                      <h3>// Color Models</h3>
                      <p><strong>RGB</strong> (Red, Green, Blue) is the native model of screens. Each channel ranges from 0–255. It matches how displays work physically — mixing light — but is unintuitive for humans because it doesn't map to how we think about color.</p>
                      <p><strong>HSL</strong> (Hue, Saturation, Lightness) is the most human-friendly model. Hue is the color wheel position (0–360°), saturation is the colour intensity (0–100%), and lightness ranges from black to white. Adjusting lightness alone gives you tints and shades of the same colour.</p>
                      <p><strong>HSV</strong> (Hue, Saturation, Value) is similar to HSL but Value represents brightness rather than lightness. At S=100%, V=100% you always get a pure, vivid hue — this is why it's used in most visual colour pickers.</p>
                      <p><strong>CMYK</strong> is the model used in printing. Cyan, Magenta, Yellow, and Key (black) are subtractive — mixing them produces darker colours. Screen colours cannot always be reproduced exactly in CMYK print.</p>
                      <h3>// Colour Harmony</h3>
                      <p>Colour harmony describes colour combinations that are aesthetically pleasing. They are derived by selecting colours at specific angle relationships on the colour wheel.</p>
                      <p><strong>Complementary</strong> colours are opposite on the wheel (180°). They create maximum contrast and vibrancy when placed together — the classic red/green, blue/orange tension. <strong>Analogous</strong> colours are neighbours (±30°) and are naturally harmonious and calm. <strong>Triadic</strong> spreads three colours equally (120° apart) for vibrant but balanced palettes. <strong>Tetradic</strong> uses four colours in a rectangle on the wheel and is the richest but hardest to balance.</p>
                      <h3>// Accessibility & WCAG</h3>
                      <p>The Web Content Accessibility Guidelines (WCAG) define minimum contrast ratios between text and backgrounds. A contrast ratio of 4.5:1 is required for normal text at AA level; 3:1 for large text (18pt+ or 14pt bold). These thresholds exist because low-contrast text is unreadable for people with low vision, colour blindness, or in bright conditions.</p>
                      <p>The contrast ratio formula is based on <strong>relative luminance</strong> — a perceptual measure of how bright a colour appears to the human eye. Green contributes 71.5% of perceived brightness while blue contributes only 7.2%, which is why a pure blue (#0000ff) on black actually fails AA despite feeling very bright.</p>
                      {[
                        {q:'What is the difference between #RGB and #RRGGBB?', a:'Both are hexadecimal representations of RGB. #RGB is a shorthand where each digit is doubled: #abc = #aabbcc. It can only represent colours whose full hex has pairs of identical digits, so it covers only 4,096 unique colours vs 16.7 million for full hex.'},
                        {q:'Why does the picker use HSV instead of HSL?', a:'In the 2D saturation/value square, pure hues always appear in the top-right corner at S=100%, V=100%. In an HSL equivalent, pure hues only appear at the middle of the lightness axis (L=50%), making the picker less intuitive. Most professional tools (Photoshop, Figma, etc.) use HSV for the 2D picker.'},
                        {q:'What is the "radiative forcing" issue with colour printing?', a:'Digital screens use additive RGB mixing (adding light), while printers use subtractive CMYK mixing (absorbing light). This means vivid screen colours — particularly saturated greens and certain blues — often cannot be reproduced faithfully in print. The range of reproducible colours is called the colour gamut.'},
                        {q:'When should I use CSS custom properties (variables) for colours?', a:'Whenever you use a colour more than once. CSS variables make it trivial to change your palette globally, support theming (dark/light mode), and improve readability. A well-named variable like --color-brand is more meaningful than #7c3aed scattered throughout your stylesheet.'},
                      ].map(({q,a},i)=>(
                        <div key={i} style={{padding:'10px 12px',marginBottom:8,
                          background:dark?'rgba(0,0,0,.4)':'rgba(124,58,237,.04)',
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          borderRadius:dark?3:8}}>
                          <div style={{fontSize:12.5,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:'var(--txt)',marginBottom:4}}>{q}</div>
                          <div style={{fontSize:12.5,color:'var(--txt2)',lineHeight:1.72}}>{a}</div>
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