import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   MUSIC THEORY CALCULATOR — Dark Indigo/Teal · Light Ivory/Gold
   Series architecture: topbar · tabs · sidebar · main · ads
═══════════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'DM Sans',sans-serif}
@keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes note-pop{0%{transform:scale(0) translateX(-50%)}60%{transform:scale(1.25) translateX(-50%)}100%{transform:scale(1) translateX(-50%)}}
@keyframes shimmer{0%{opacity:.6}50%{opacity:1}100%{opacity:.6}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes glow-teal{0%,100%{box-shadow:0 0 12px rgba(45,212,191,.12)}50%{box-shadow:0 0 28px rgba(45,212,191,.45)}}
@keyframes slide-in{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}
.fadeup{animation:fadeup .22s ease both}

/* ══ DARK — DEEP INDIGO / TEAL ════════════════════════════════════ */
.dark{
  --bg:#06070f;--sur:#0c0e1a;--s2:#0f1120;
  --bdr:#1e2240;--bdr2:rgba(45,212,191,.22);
  --acc:#2dd4bf;--acc2:#6366f1;--acc3:#f59e0b;
  --ok:#34d399;--err:#f87171;--warn:#fbbf24;
  --txt:#eef2ff;--txt2:#a5b4fc;--txt3:#3730a3;
  --piano-white:#1a1c2e;--piano-black:#060710;
  --note-dot:#2dd4bf;
  min-height:100vh;background:var(--bg);color:var(--txt);
  background-image:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(99,102,241,.07),transparent);
}
/* ══ LIGHT — WARM IVORY / GOLD ══════════════════════════════════ */
.light{
  --bg:#faf7f0;--sur:#ffffff;--s2:#f5f0e8;
  --bdr:#e8dfc8;--bdr2:#b45309;
  --acc:#b45309;--acc2:#7c3aed;--acc3:#0891b2;
  --ok:#059669;--err:#dc2626;--warn:#d97706;
  --txt:#1c1208;--txt2:#78350f;--txt3:#a16207;
  --piano-white:#fdfcf8;--piano-black:#1c1208;
  --note-dot:#b45309;
  min-height:100vh;background:var(--bg);color:var(--txt);
}

/* TOPBAR */
.topbar{height:40px;position:sticky;top:0;z-index:300;display:flex;align-items:center;padding:0 14px;gap:8px}
.dark .topbar{background:rgba(6,7,15,.97);border-bottom:1px solid var(--bdr)}
.light .topbar{background:rgba(250,247,240,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 8px rgba(180,83,9,.07)}

/* TABS */
.dark .tab-bar{background:var(--sur);border-bottom:1px solid var(--bdr)}
.light .tab-bar{background:var(--sur);border-bottom:1.5px solid var(--bdr)}
.tab{height:36px;padding:0 13px;border:none;border-bottom:2px solid transparent;background:transparent;cursor:pointer;
  font-family:'DM Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;
  transition:all .13s;display:flex;align-items:center;gap:5px;white-space:nowrap}
.dark .tab{color:var(--txt3)}
.dark .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(45,212,191,.05)}
.dark .tab:hover:not(.on){color:var(--txt2)}
.light .tab{color:var(--txt3)}
.light .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(180,83,9,.05);font-weight:600;border-bottom-width:2.5px}
.light .tab:hover:not(.on){color:var(--txt2);background:rgba(180,83,9,.03)}

/* PANEL */
.dark .panel{background:linear-gradient(145deg,var(--sur),var(--s2));border:1px solid var(--bdr);border-radius:4px;position:relative;overflow:hidden}
.light .panel{background:var(--sur);border:1.5px solid var(--bdr);border-radius:10px;box-shadow:0 2px 16px rgba(180,83,9,.06)}

/* BUTTONS */
.dark .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 18px;
  border:1px solid var(--acc);border-radius:3px;background:rgba(45,212,191,.09);color:var(--acc);
  cursor:pointer;font-family:'DM Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;
  animation:glow-teal 2.5s ease-in-out infinite;transition:all .15s}
.dark .btn:hover{background:rgba(45,212,191,.2);transform:translateY(-1px)}
.light .btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 18px;
  border:none;border-radius:7px;background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;
  cursor:pointer;font-family:'DM Mono',monospace;font-size:10px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;
  box-shadow:0 4px 14px rgba(180,83,9,.38);transition:all .15s}
.light .btn:hover{box-shadow:0 8px 24px rgba(180,83,9,.5);transform:translateY(-1px)}
.dark .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:4px 10px;
  border:1px solid var(--bdr);border-radius:3px;background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'DM Mono',monospace;font-size:9.5px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;transition:all .12s}
.dark .btn-ghost:hover,.dark .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(45,212,191,.06)}
.light .btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:4px 10px;
  border:1.5px solid var(--bdr);border-radius:6px;background:transparent;color:var(--txt3);cursor:pointer;
  font-family:'DM Mono',monospace;font-size:9.5px;font-weight:500;letter-spacing:.05em;text-transform:uppercase;transition:all .12s}
.light .btn-ghost:hover,.light .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(180,83,9,.07)}

/* INPUTS */
.dark .inp{background:rgba(0,0,0,.5);border:1px solid var(--bdr);border-radius:3px;color:var(--txt);
  font-family:'DM Mono',monospace;font-size:12px;padding:6px 10px;outline:none;width:100%;transition:all .13s}
.dark .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(45,212,191,.1)}
.light .inp{background:#f5f0e8;border:1.5px solid var(--bdr);border-radius:7px;color:var(--txt);
  font-family:'DM Mono',monospace;font-size:12px;padding:6px 10px;outline:none;width:100%;transition:all .13s}
.light .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(180,83,9,.1)}

/* MISC */
.dark .lbl{font-size:8.5px;font-weight:500;font-family:'DM Mono',monospace;letter-spacing:.2em;text-transform:uppercase;color:rgba(45,212,191,.45);display:block;margin-bottom:5px}
.light .lbl{font-size:8.5px;font-weight:500;font-family:'DM Mono',monospace;letter-spacing:.2em;text-transform:uppercase;color:var(--acc);display:block;margin-bottom:5px}
.dark .sec-title{font-size:8.5px;font-weight:500;font-family:'DM Mono',monospace;letter-spacing:.22em;text-transform:uppercase;color:rgba(45,212,191,.38);margin-bottom:7px}
.light .sec-title{font-size:8.5px;font-weight:500;font-family:'DM Mono',monospace;letter-spacing:.22em;text-transform:uppercase;color:var(--acc);margin-bottom:7px}
.dark .metric{border:1px solid rgba(45,212,191,.12);border-radius:3px;padding:10px 13px;background:rgba(45,212,191,.04)}
.light .metric{border:1.5px solid rgba(180,83,9,.18);border-radius:8px;padding:10px 13px;background:rgba(180,83,9,.04)}
.dark .ad-slot{background:rgba(45,212,191,.014);border:1px dashed rgba(45,212,191,.12);border-radius:3px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:var(--txt3);font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.12em;text-transform:uppercase}
.light .ad-slot{background:rgba(180,83,9,.03);border:1.5px dashed rgba(180,83,9,.18);border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:var(--txt3);font-family:'DM Mono',monospace;font-size:8.5px;letter-spacing:.12em;text-transform:uppercase}
.dark .hint{font-size:12.5px;color:var(--txt2);line-height:1.75;padding:8px 12px;border-radius:3px;background:rgba(45,212,191,.04);border-left:2px solid rgba(45,212,191,.3)}
.light .hint{font-size:12.5px;color:var(--txt2);line-height:1.75;padding:8px 12px;border-radius:8px;background:rgba(180,83,9,.05);border-left:2.5px solid rgba(180,83,9,.3)}
.dark .sidebar{border-right:1px solid var(--bdr);background:var(--sur);padding:12px 10px;overflow-y:auto;display:flex;flex-direction:column;gap:11px}
.light .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);padding:12px 10px;overflow-y:auto;display:flex;flex-direction:column;gap:11px}
.body-layout{display:grid;grid-template-columns:200px 1fr;min-height:calc(100vh - 76px)}

/* PIANO */
.piano-key-white{position:relative;display:inline-block;width:40px;height:130px;
  border-radius:0 0 5px 5px;border:1px solid #555;cursor:pointer;vertical-align:top;transition:all .1s}
.piano-key-black{position:relative;display:inline-block;width:26px;height:80px;
  border-radius:0 0 4px 4px;cursor:pointer;margin:0 -13px;z-index:2;transition:all .1s;vertical-align:top}
.piano-key-white:active,.piano-key-black:active{filter:brightness(.85)}
.note-dot{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);
  width:12px;height:12px;border-radius:50%;animation:note-pop .25s cubic-bezier(.34,1.56,.64,1) both}

/* INTERVAL GRID */
.int-cell{display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;
  font-size:10px;font-weight:500;border-radius:3px;transition:all .15s;cursor:default}

/* PROSE */
.prose p{font-size:13.5px;line-height:1.78;margin-bottom:12px;color:var(--txt2)}
.prose h3{font-size:15px;font-weight:700;margin:22px 0 8px;color:var(--txt);font-family:'Playfair Display',serif}
.prose ul{padding-left:20px;margin-bottom:12px}
.prose li{font-size:13.5px;line-height:1.72;margin-bottom:5px;color:var(--txt2)}
.prose strong{font-weight:700;color:var(--txt)}
.step-n{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'DM Mono',monospace;font-size:10px;font-weight:700;flex-shrink:0}
.dark .step-n{border:1px solid rgba(45,212,191,.3);background:rgba(45,212,191,.07);color:var(--acc)}
.light .step-n{border:1.5px solid rgba(180,83,9,.3);background:rgba(180,83,9,.07);color:var(--acc)}
`;

/* ══ MUSIC THEORY ENGINE ══════════════════════════════════════════ */
const CHROMATIC = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FLAT_NAMES = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

const SCALE_PATTERNS = {
  major:      {intervals:[0,2,4,5,7,9,11], label:'Major',      formula:'W-W-H-W-W-W-H',  mood:'Bright, joyful, triumphant'},
  minor:      {intervals:[0,2,3,5,7,8,10], label:'Natural Minor', formula:'W-H-W-W-H-W-W', mood:'Dark, melancholic, emotional'},
  dorian:     {intervals:[0,2,3,5,7,9,10], label:'Dorian',     formula:'W-H-W-W-W-H-W',  mood:'Minor with a brighter 6th — jazz/funk'},
  phrygian:   {intervals:[0,1,3,5,7,8,10], label:'Phrygian',   formula:'H-W-W-W-H-W-W',  mood:'Flamenco, dark, Spanish feel'},
  lydian:     {intervals:[0,2,4,6,7,9,11], label:'Lydian',     formula:'W-W-W-H-W-W-H',  mood:'Dreamy, otherworldly, raised 4th'},
  mixolydian: {intervals:[0,2,4,5,7,9,10], label:'Mixolydian', formula:'W-W-H-W-W-H-W',  mood:'Blues/rock, dominant feel'},
  locrian:    {intervals:[0,1,3,5,6,8,10], label:'Locrian',    formula:'H-W-W-H-W-W-W',  mood:'Tense, unstable, rare'},
  pentatonic: {intervals:[0,2,4,7,9],       label:'Major Pentatonic', formula:'W-W-WH-W-WH', mood:'Universal, folk, rock, no half steps'},
  minorPent:  {intervals:[0,3,5,7,10],      label:'Minor Pentatonic', formula:'WH-W-W-WH-W',  mood:'Blues, rock guitar, soulful'},
  blues:      {intervals:[0,3,5,6,7,10],    label:'Blues',     formula:'WH-W-H-H-WH-W', mood:'Blues, gospel, expressive'},
  harmonic:   {intervals:[0,2,3,5,7,8,11], label:'Harmonic Minor', formula:'W-H-W-W-H-WH-H', mood:'Classical, Arabic, exotic raised 7th'},
  wholetone:  {intervals:[0,2,4,6,8,10],   label:'Whole Tone', formula:'W-W-W-W-W-W',   mood:'Impressionist, floating, no tonal centre'},
};

const CHORD_QUALITIES = {
  major: ['Major','Minor','Minor','Major','Major','Minor','Diminished'],
  minor: ['Minor','Diminished','Major','Minor','Minor','Major','Major'],
};

const INTERVALS = {
  0:'P1 (Unison)', 1:'m2 (Minor 2nd)', 2:'M2 (Major 2nd)', 3:'m3 (Minor 3rd)',
  4:'M3 (Major 3rd)', 5:'P4 (Perfect 4th)', 6:'TT (Tritone)',
  7:'P5 (Perfect 5th)', 8:'m6 (Minor 6th)', 9:'M6 (Major 6th)',
  10:'m7 (Minor 7th)', 11:'M7 (Major 7th)', 12:'P8 (Octave)',
};

const ROMAN = ['I','II','III','IV','V','VI','VII'];

function buildScale(root, patternKey) {
  const rootIdx = CHROMATIC.indexOf(root);
  const pat = SCALE_PATTERNS[patternKey];
  if (!rootIdx === -1 || !pat) return [];
  return pat.intervals.map((iv, deg) => ({
    note: CHROMATIC[(rootIdx + iv) % 12],
    interval: iv,
    degree: deg + 1,
    roman: ROMAN[deg] || '',
    chordQuality: CHORD_QUALITIES.major?.[deg] || '',
    chordFull: ''
  }));
}

function buildChords(scaleNotes, patternKey) {
  const quals = patternKey === 'major' ? CHORD_QUALITIES.major
    : patternKey === 'minor' || patternKey === 'harmonic' ? CHORD_QUALITIES.minor
    : null;
  return scaleNotes.map((sn, i) => {
    const q = quals?.[i] || 'Chord';
    const suffix = q === 'Major' ? '' : q === 'Minor' ? 'm' : q === 'Diminished' ? '°' : '';
    return { root: sn.note, quality: q, label: sn.note + suffix, roman: (ROMAN[i]||'') + (q==='Minor'?'m':q==='Diminished'?'°':'') };
  });
}

/* Circle of Fifths data */
const CIRCLE_MAJOR = ['C','G','D','A','E','B','F#','Db','Ab','Eb','Bb','F'];
const CIRCLE_MINOR = ['Am','Em','Bm','F#m','C#m','G#m','D#m','Bbm','Fm','Cm','Gm','Dm'];
const CIRCLE_SHARPS = [0,1,2,3,4,5,6,-5,-4,-3,-2,-1];

/* ══ ICONS ══ */
const Svg = ({d,s=14,sw=1.8,fill='none'})=>(
  <svg width={s} height={s} viewBox="0 0 24 24" fill={fill} stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {(Array.isArray(d)?d:[d]).map((p,i)=><path key={i} d={p}/>)}
  </svg>
);
const I={
  music: s=><Svg s={s} d={["M9 18V5l12-2v13","M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z","M18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"]}/>,
  piano: s=><Svg s={s} d={["M18.5 8c0 .28 0 .5-.5.5H6c-.5 0-.5-.22-.5-.5V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v4z","M6 8.5v13a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-13","M9 8.5V14m3-5.5V14m3-5.5V14","M9 2v6m3-6v6m3-6v6"]}/>,
  circle:s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 6v6l4 2"]}/>,
  grid:  s=><Svg s={s} d={["M3 3h7v7H3z","M14 3h7v7h-7z","M14 14h7v7h-7z","M3 14h7v7H3z"]}/>,
  book:  s=><Svg s={s} d={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z","M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]}/>,
  info:  s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 16v-4M12 8h.01"]}/>,
  copy:  s=><Svg s={s} d={["M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2","M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"]}/>,
  play:  s=><Svg s={s} d="M5 3l14 9-14 9V3z" sw={1.5}/>,
};

/* ══ PIANO KEYBOARD ══════════════════════════════════════════════ */
function PianoKeyboard({ scaleNotes, rootNote, dark }) {
  // 2 octaves of keys: C3–B4
  const WHITE_NOTES = ['C','D','E','F','G','A','B'];
  const ALL_KEYS = [];
  for (let oct = 3; oct <= 4; oct++) {
    CHROMATIC.forEach(n => ALL_KEYS.push({note:n, oct}));
  }
  const whiteKeys = ALL_KEYS.filter(k => !k.note.includes('#'));
  const blackOffsets = {  // semitone offset relative to white keys
    'C#': 0.6, 'D#': 1.6, 'F#': 3.6, 'G#': 4.6, 'A#': 5.6,
  };

  return (
    <div style={{overflowX:'auto',paddingBottom:4}}>
      <div style={{position:'relative',display:'inline-flex',background:dark?'#080a12':'#2a1a0a',
        padding:'8px 8px 0',borderRadius:dark?4:8,
        boxShadow:dark?'0 8px 40px rgba(45,212,191,.15)':'0 8px 40px rgba(180,83,9,.18)'}}>
        {/* White keys */}
        {whiteKeys.map((k,i) => {
          const inScale = scaleNotes.some(s=>s.note===k.note);
          const isRoot = k.note === rootNote;
          return (
            <div key={i} className="piano-key-white"
              style={{background: isRoot ? (dark?'rgba(45,212,191,.25)':'rgba(180,83,9,.2)') : 'var(--piano-white)',
                borderColor:dark?'#2a2d4a':'#c4a882',position:'relative'}}>
              {inScale && (
                <div className="note-dot" style={{background:isRoot?'var(--acc)':'var(--acc2)',
                  bottom: isRoot?8:10, width:isRoot?14:11, height:isRoot?14:11,
                  boxShadow: isRoot?`0 0 10px var(--acc)`:'none'}}/>
              )}
              {(k.note === 'C' || k.note === 'F') && (
                <span style={{position:'absolute',bottom:3,left:'50%',transform:'translateX(-50%)',
                  fontSize:7,fontFamily:'DM Mono',color:dark?'rgba(255,255,255,.25)':'rgba(0,0,0,.3)',userSelect:'none'}}>
                  {k.note}{k.oct}
                </span>
              )}
            </div>
          );
        })}
        {/* Black keys overlay */}
        <div style={{position:'absolute',top:8,left:8,display:'flex',pointerEvents:'none'}}>
          {whiteKeys.map((k,i)=>{
            // Check if a black key follows this white key
            const noteIdx = CHROMATIC.indexOf(k.note);
            const nextSemi = CHROMATIC[(noteIdx+1)%12];
            if (!nextSemi.includes('#')) return <div key={i} style={{width:40}}/>;
            const inScale = scaleNotes.some(s=>s.note===nextSemi);
            const isRoot = nextSemi === rootNote;
            return (
              <div key={i} style={{width:40,position:'relative'}}>
                <div className="piano-key-black"
                  style={{background:isRoot?(dark?'rgba(45,212,191,.4)':'rgba(180,83,9,.5)'):'var(--piano-black)',
                    border:dark?'1px solid #3a3d5a':'1px solid #5a3e1a',
                    position:'absolute',left:27,pointerEvents:'auto'}}>
                  {inScale && (
                    <div className="note-dot" style={{background:isRoot?'var(--acc)':'#a5b4fc',
                      bottom:8,width:8,height:8,
                      boxShadow:isRoot?`0 0 8px var(--acc)`:'none'}}/>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══ CIRCLE OF FIFTHS ════════════════════════════════════════════ */
function CircleOfFifths({ activeNote, dark, onSelect }) {
  const cx=140, cy=140, outerR=120, innerR=80, midR=100;
  return (
    <svg viewBox="0 0 280 280" style={{width:'100%',maxWidth:260}}>
      {/* Background rings */}
      <circle cx={cx} cy={cy} r={outerR+14} fill={dark?'rgba(45,212,191,.04)':'rgba(180,83,9,.04)'}
        stroke={dark?'rgba(45,212,191,.1)':'rgba(180,83,9,.12)'} strokeWidth="1"/>
      <circle cx={cx} cy={cy} r={innerR-6} fill={dark?'rgba(99,102,241,.06)':'rgba(124,58,237,.05)'}
        stroke={dark?'rgba(99,102,241,.12)':'rgba(124,58,237,.14)'} strokeWidth="1"/>
      {CIRCLE_MAJOR.map((key, i) => {
        const angle = (i * 30 - 90) * Math.PI / 180;
        const mx = cx + outerR * Math.cos(angle);
        const my = cy + outerR * Math.sin(angle);
        const minKey = CIRCLE_MINOR[i];
        const miAngle = angle;
        const mix = cx + innerR * Math.cos(miAngle);
        const miy = cy + innerR * Math.sin(miAngle);
        const isActive = key === activeNote || key.replace('#','b') === activeNote;
        const sharps = CIRCLE_SHARPS[i];
        const accidental = sharps > 0 ? `${sharps}♯` : sharps < 0 ? `${-sharps}♭` : '0';

        return (
          <g key={i} onClick={()=>onSelect(key)} style={{cursor:'pointer'}}>
            {/* Wedge highlight */}
            {isActive && (
              <path
                d={`M ${cx} ${cy} L ${cx + (outerR+14)*Math.cos((i*30-105)*Math.PI/180)} ${cy + (outerR+14)*Math.sin((i*30-105)*Math.PI/180)} A ${outerR+14} ${outerR+14} 0 0 1 ${cx + (outerR+14)*Math.cos((i*30-75)*Math.PI/180)} ${cy + (outerR+14)*Math.sin((i*30-75)*Math.PI/180)} Z`}
                fill={dark?'rgba(45,212,191,.15)':'rgba(180,83,9,.13)'} />
            )}
            {/* Major key */}
            <circle cx={mx} cy={my} r={14} fill={isActive?(dark?'var(--acc)':'var(--acc)'):'transparent'}
              stroke={dark?'rgba(45,212,191,.25)':'rgba(180,83,9,.22)'} strokeWidth="1"/>
            <text x={mx} y={my} textAnchor="middle" dominantBaseline="central"
              fontSize="11" fontFamily="DM Sans" fontWeight={isActive?700:500}
              fill={isActive?'#fff':(dark?'var(--txt2)':'var(--txt2)')}>
              {key}
            </text>
            {/* Accidental count */}
            <text x={cx + (outerR+26)*Math.cos(angle)} y={cy + (outerR+26)*Math.sin(angle)}
              textAnchor="middle" dominantBaseline="central"
              fontSize="8" fontFamily="DM Mono"
              fill={dark?'rgba(45,212,191,.35)':'rgba(180,83,9,.35)'}>
              {accidental}
            </text>
            {/* Minor key (inner ring) */}
            <circle cx={mix} cy={miy} r={11} fill="transparent"
              stroke={dark?'rgba(99,102,241,.25)':'rgba(124,58,237,.22)'} strokeWidth="1"/>
            <text x={mix} y={miy} textAnchor="middle" dominantBaseline="central"
              fontSize="9" fontFamily="DM Sans" fontWeight={400}
              fill={dark?'rgba(165,180,252,.7)':'rgba(124,58,237,.7)'}>
              {minKey}
            </text>
          </g>
        );
      })}
      {/* Centre label */}
      <text x={cx} y={cy-8} textAnchor="middle" fontSize="11" fontFamily="DM Mono" fontWeight={600}
        fill={dark?'rgba(45,212,191,.6)':'rgba(180,83,9,.6)'}>Circle</text>
      <text x={cx} y={cy+6} textAnchor="middle" fontSize="11" fontFamily="DM Mono" fontWeight={600}
        fill={dark?'rgba(45,212,191,.6)':'rgba(180,83,9,.6)'}>of 5ths</text>
    </svg>
  );
}

/* ══ INTERVAL MATRIX ════════════════════════════════════════════ */
function IntervalMatrix({ rootNote, dark }) {
  const rootIdx = CHROMATIC.indexOf(rootNote);
  const intervalColors = {
    0: dark ? '#2dd4bf' : '#b45309',
    7: dark ? '#818cf8' : '#7c3aed',
    5: dark ? '#6366f1' : '#0891b2',
    4: dark ? '#34d399' : '#059669',
    3: dark ? '#fb923c' : '#ea580c',
    12: dark ? '#2dd4bf' : '#b45309',
  };
  return (
    <div style={{overflowX:'auto'}}>
      <div style={{display:'grid',gridTemplateColumns:`repeat(13,1fr)`,gap:2,minWidth:420}}>
        {/* Header row */}
        {Array.from({length:13},(_,i)=>(
          <div key={i} style={{textAlign:'center',fontSize:8.5,fontFamily:'DM Mono',
            fontWeight:600,color:'var(--txt3)',padding:'3px 0',
            letterSpacing:'.06em'}}>
            {i === 0 ? 'R' : `+${i}`}
          </div>
        ))}
        {/* Matrix rows */}
        {CHROMATIC.map((startNote,row)=>{
          const startIdx = CHROMATIC.indexOf(startNote);
          const isRoot = row === rootIdx;
          return Array.from({length:13},(_,col)=>{
            const targetNote = CHROMATIC[(startIdx+col)%12];
            const semis = col;
            const color = intervalColors[semis] || (dark?'rgba(255,255,255,.05)':'rgba(0,0,0,.04)');
            const isSelf = startNote === rootNote;
            return (
              <div key={col} className="int-cell"
                style={{height:28,
                  background: isSelf && col===0 ? (dark?'rgba(45,212,191,.25)':'rgba(180,83,9,.2)') :
                    semis===0||semis===12 ? (dark?'rgba(45,212,191,.1)':'rgba(180,83,9,.1)') :
                    semis===7 ? (dark?'rgba(129,140,248,.1)':'rgba(124,58,237,.08)') :
                    (dark?'rgba(255,255,255,.03)':'rgba(0,0,0,.03)'),
                  borderRadius:2,
                  color: isSelf ? (dark?'#2dd4bf':'#b45309') : (dark?'var(--txt2)':'var(--txt2)'),
                  fontWeight: isSelf||semis===0||semis===7 ? 700 : 400,
                  fontSize:10.5,
                  border: isSelf&&col===0 ? (dark?'1px solid rgba(45,212,191,.4)':'1.5px solid rgba(180,83,9,.4)') : 'none',
                }}>
                {targetNote}
              </div>
            );
          });
        })}
      </div>
      <div style={{marginTop:8,fontSize:10,fontFamily:'DM Mono',color:'var(--txt3)'}}>
        Rows = start note · Columns = semitones added · R = root
      </div>
    </div>
  );
}

/* ══ CHORD VOICING ══════════════════════════════════════════════ */
function ChordVoicing({ chord, dark }) {
  const FRETS = 5, STRINGS = 6;
  // Simple voicing lookup for common chords
  const voicings = {
    'C':  [null,3,2,0,1,0], 'Cm': [null,3,5,5,4,3],
    'D':  [null,null,0,2,3,2], 'Dm':[null,null,0,2,3,1],
    'E':  [0,2,2,1,0,0], 'Em': [0,2,2,0,0,0],
    'F':  [1,1,2,3,3,1], 'Fm': [1,1,3,3,2,1],
    'G':  [3,2,0,0,0,3], 'Gm': [3,5,5,3,3,3],
    'A':  [null,0,2,2,2,0], 'Am':[null,0,2,2,1,0],
    'B':  [null,2,4,4,4,2], 'Bm':[null,2,4,4,3,2],
    'F#': [2,2,3,4,4,2], 'C#':[null,4,3,1,2,1],
    'G#': [4,4,5,6,6,4], 'A#':[1,1,3,3,3,1],
    'D#': [null,6,5,3,4,3],
  };
  const frets = voicings[chord] || voicings[chord.replace('m','')] || [0,0,0,0,0,0];
  const minFret = Math.min(...frets.filter(f=>f!==null&&f>0));
  const maxFret = Math.max(...frets.filter(f=>f!==null));

  return (
    <div style={{padding:'10px 12px'}}>
      <div className="lbl" style={{marginBottom:8}}>{chord} Voicing</div>
      <div style={{display:'flex',gap:3,alignItems:'flex-end',justifyContent:'center',height:80}}>
        {frets.map((fret,i)=>{
          if (fret === null) return (
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,width:16}}>
              <span style={{fontSize:10,color:'var(--err)',fontWeight:700}}>✕</span>
              <div style={{width:1.5,height:58,background:'var(--txt3)',opacity:.3}}/>
            </div>
          );
          const fill = fret > 0 ? (dark?'var(--acc)':'var(--acc)') : 'transparent';
          const barH = fret === 0 ? 0 : ((fret - minFret + 1) / (maxFret - minFret + 2)) * 52 + 10;
          return (
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:2,width:16}}>
              {fret === 0 ? (
                <div style={{width:10,height:10,borderRadius:'50%',border:dark?'1.5px solid var(--acc)':'1.5px solid var(--acc)'}}/>
              ) : (
                <div style={{width:10,height:10,borderRadius:'50%',background:'transparent'}}/>
              )}
              <div style={{width:1.5,height:58,background:'var(--txt3)',opacity:.3,position:'relative'}}>
                {fret > 0 && (
                  <div style={{position:'absolute',bottom:barH-8,left:-4,width:10,height:10,
                    borderRadius:'50%',background:'var(--acc)',
                    boxShadow:dark?'0 0 6px var(--acc)':'none'}}/>
                )}
              </div>
              <span style={{fontSize:8,fontFamily:'DM Mono',color:'var(--txt3)'}}>{6-i}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════ */
const PAGE_TABS = [
  {id:'scales',   label:'♩ Scales'},
  {id:'chords',   label:'♬ Chords'},
  {id:'circle',   label:'◎ Circle of 5ths'},
  {id:'intervals',label:'⊞ Intervals'},
  {id:'guide',    label:'? Theory Guide'},
  {id:'learn',    label:'∑ Learn'},
];

export default function MusicTheoryCalc() {
  const [mode, setMode] = useState('dark');
  const dark = mode === 'dark';

  const [root, setRoot] = useState('C');
  const [scaleKey, setScaleKey] = useState('major');
  const [tab, setTab] = useState('scales');
  const [showFlats, setShowFlats] = useState(false);
  const [activeChord, setActiveChord] = useState(null);
  const [copyOk, setCopyOk] = useState(false);

  const noteNames = showFlats ? FLAT_NAMES : CHROMATIC;

  const scaleNotes = useMemo(() => buildScale(root, scaleKey), [root, scaleKey]);
  const chords = useMemo(() => buildChords(scaleNotes, scaleKey), [scaleNotes, scaleKey]);
  const scalePat = SCALE_PATTERNS[scaleKey];

  const scaleString = scaleNotes.map(s=>s.note).join(' – ');

  const copyScale = () => {
    try { navigator.clipboard.writeText(scaleString); } catch(e) {}
    setCopyOk(true); setTimeout(()=>setCopyOk(false),1400);
  };

  // Interval legend data
  const INTERVAL_LEGEND = [
    {s:0,  label:'Unison / Root',    color:dark?'#2dd4bf':'#b45309'},
    {s:1,  label:'Minor 2nd',        color:dark?'rgba(255,255,255,.12)':'rgba(0,0,0,.06)'},
    {s:2,  label:'Major 2nd',        color:dark?'rgba(255,255,255,.12)':'rgba(0,0,0,.06)'},
    {s:3,  label:'Minor 3rd',        color:dark?'rgba(251,146,60,.25)':'rgba(234,88,12,.15)'},
    {s:4,  label:'Major 3rd',        color:dark?'rgba(52,211,153,.2)':'rgba(5,150,105,.12)'},
    {s:5,  label:'Perfect 4th',      color:dark?'rgba(99,102,241,.2)':'rgba(8,145,178,.1)'},
    {s:6,  label:'Tritone (♭5)',      color:dark?'rgba(248,113,113,.15)':'rgba(220,38,38,.1)'},
    {s:7,  label:'Perfect 5th',      color:dark?'rgba(129,140,248,.2)':'rgba(124,58,237,.1)'},
    {s:8,  label:'Minor 6th',        color:dark?'rgba(255,255,255,.12)':'rgba(0,0,0,.06)'},
    {s:9,  label:'Major 6th',        color:dark?'rgba(255,255,255,.12)':'rgba(0,0,0,.06)'},
    {s:10, label:'Minor 7th',        color:dark?'rgba(255,255,255,.12)':'rgba(0,0,0,.06)'},
    {s:11, label:'Major 7th',        color:dark?'rgba(255,255,255,.12)':'rgba(0,0,0,.06)'},
    {s:12, label:'Octave',           color:dark?'#2dd4bf':'#b45309'},
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className={dark?'dark':'light'}>

        {/* TOPBAR */}
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center',gap:7}}>
            <div style={{width:26,height:26,borderRadius:dark?3:7,
              background:dark?'transparent':'linear-gradient(135deg,#b45309,#7c3aed)',
              border:dark?'1px solid rgba(45,212,191,.45)':'none',
              display:'flex',alignItems:'center',justifyContent:'center',
              color:dark?'var(--acc)':'#fff',
              boxShadow:dark?'0 0 12px rgba(45,212,191,.25)':'0 3px 10px rgba(180,83,9,.4)'}}>
              {I.music(13)}
            </div>
            <span style={{fontSize:13.5,fontWeight:700,fontFamily:"'Playfair Display',serif",
              color:'var(--txt)',letterSpacing:'.02em'}}>
              Music<span style={{color:'var(--acc)'}}>.theory</span>
            </span>
          </div>
          <div style={{flex:1}}/>

          {/* Current scale pill */}
          {scaleNotes.length > 0 && (
            <div style={{display:'flex',alignItems:'center',gap:6,
              padding:'3px 10px',borderRadius:dark?2:7,
              border:dark?'1px solid rgba(45,212,191,.25)':'1.5px solid rgba(180,83,9,.22)',
              background:dark?'rgba(45,212,191,.05)':'rgba(180,83,9,.05)'}}>
              <span style={{fontSize:9.5,fontFamily:"'DM Mono',monospace",color:'var(--acc)',letterSpacing:'.1em'}}>
                {root} {scalePat.label}
              </span>
              <button onClick={copyScale} style={{background:'none',border:'none',cursor:'pointer',color:'var(--txt3)',padding:0}}>
                {copyOk ? <span style={{fontSize:10,color:'var(--ok)'}}>✓</span> : I.copy(11)}
              </button>
            </div>
          )}

          {/* Flat/sharp toggle */}
          <button className="btn-ghost" onClick={()=>setShowFlats(p=>!p)}
            style={{fontSize:9.5,gap:5,padding:'4px 9px',
              borderColor:showFlats?(dark?'rgba(45,212,191,.3)':'rgba(180,83,9,.3)'):'',
              color:showFlats?'var(--acc)':'var(--txt3)'}}>
            {showFlats ? '♭ Flats' : '♯ Sharps'}
          </button>

          {/* Theme */}
          <button onClick={()=>setMode(dark?'light':'dark')} style={{
            display:'flex',alignItems:'center',gap:5,padding:'4px 10px',
            border:dark?'1px solid rgba(45,212,191,.18)':'1.5px solid var(--bdr)',
            borderRadius:dark?2:6,background:dark?'rgba(45,212,191,.03)':'var(--sur)',
            cursor:'pointer',transition:'all .14s'}}>
            {dark?(
              <><div style={{width:26,height:14,borderRadius:7,background:'var(--acc)',position:'relative',
                  boxShadow:'0 0 7px rgba(45,212,191,.5)'}}>
                <div style={{position:'absolute',top:2,right:2,width:10,height:10,borderRadius:'50%',background:'#06070f'}}/>
              </div><span style={{fontSize:9,fontWeight:700,fontFamily:"'DM Mono',monospace",color:'rgba(45,212,191,.6)',letterSpacing:'.1em'}}>DRK</span></>
            ):(
              <><span style={{fontSize:9.5,color:'var(--txt3)',fontWeight:600,fontFamily:"'DM Mono',monospace"}}>LGT</span>
              <div style={{width:26,height:14,borderRadius:7,background:'#e8dfc8',position:'relative'}}>
                <div style={{position:'absolute',top:2,left:2,width:10,height:10,borderRadius:'50%',background:'#c4a882'}}/>
              </div></>
            )}
          </button>
        </div>

        {/* PAGE TABS */}
        <div className="tab-bar" style={{display:'flex',flexShrink:0}}>
          {PAGE_TABS.map(t=>(
            <button key={t.id} className={`tab ${tab===t.id?'on':''}`} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* BODY */}
        <div className="body-layout">

          {/* SIDEBAR */}
          <div className="sidebar">

            {/* Root note selector */}
            <div>
              <div className="sec-title">Root Note</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                {(showFlats ? FLAT_NAMES : CHROMATIC).map((n,i) => {
                  const chromN = CHROMATIC[i];
                  return (
                    <button key={n} onClick={()=>setRoot(chromN)}
                      className={`btn-ghost ${root===chromN?'on':''}`}
                      style={{padding:'5px 6px',minWidth:32,fontSize:10,
                        fontFamily:"'DM Mono',monospace",
                        background:root===chromN?(dark?'rgba(45,212,191,.12)':'rgba(180,83,9,.1)'):'transparent'}}>
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scale type */}
            <div>
              <div className="sec-title">Scale Type</div>
              <div style={{display:'flex',flexDirection:'column',gap:4}}>
                {Object.entries(SCALE_PATTERNS).map(([k,v])=>(
                  <button key={k} className={`btn-ghost ${scaleKey===k?'on':''}`}
                    onClick={()=>setScaleKey(k)}
                    style={{justifyContent:'flex-start',padding:'5px 8px',
                      fontSize:10,fontFamily:"'DM Mono',monospace",
                      background:scaleKey===k?(dark?'rgba(45,212,191,.08)':'rgba(180,83,9,.08)'):''
                    }}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* MAIN */}
          <div style={{padding:'13px 15px',display:'flex',flexDirection:'column',gap:13}}>
            <AnimatePresence mode="wait">

              {/* ════ SCALES ════ */}
              {tab==='scales'&&(
                <motion.div key="scales" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>

                  {/* Scale header */}
                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                      <div>
                        <div style={{fontSize:22,fontWeight:900,fontFamily:"'Playfair Display',serif",
                          color:'var(--txt)',letterSpacing:'.01em',marginBottom:2}}>
                          {root} {scalePat.label}
                        </div>
                        <div style={{fontSize:11.5,fontFamily:"'DM Mono',monospace",color:'var(--txt3)',marginBottom:3}}>
                          Formula: <span style={{color:'var(--acc)'}}>{scalePat.formula}</span>
                        </div>
                        <div style={{fontSize:12,color:'var(--txt2)',fontStyle:'italic'}}>{scalePat.mood}</div>
                      </div>
                      <div style={{textAlign:'right'}}>
                        <div className="lbl" style={{marginBottom:3}}>Notes</div>
                        <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:'var(--acc)',letterSpacing:'.06em'}}>
                          {scaleNotes.length} notes
                        </div>
                      </div>
                    </div>

                    {/* Note pills */}
                    <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:14}}>
                      {scaleNotes.map((sn,i)=>(
                        <motion.div key={sn.note} initial={{scale:0,opacity:0}}
                          animate={{scale:1,opacity:1}} transition={{delay:i*.04}}>
                          <div style={{
                            width:48,height:48,borderRadius:'50%',
                            display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                            border:dark
                              ? (i===0?'2px solid var(--acc)':'1px solid rgba(45,212,191,.2)')
                              : (i===0?'2px solid var(--acc)':'1.5px solid rgba(180,83,9,.2)'),
                            background:i===0
                              ? (dark?'rgba(45,212,191,.15)':'rgba(180,83,9,.12)')
                              : (dark?'rgba(45,212,191,.04)':'rgba(180,83,9,.04)'),
                            boxShadow:i===0?(dark?'0 0 14px rgba(45,212,191,.25)':'0 0 14px rgba(180,83,9,.2)'):''
                          }}>
                            <span style={{fontSize:13,fontWeight:700,color:i===0?'var(--acc)':'var(--txt)',lineHeight:1}}>
                              {showFlats?FLAT_NAMES[CHROMATIC.indexOf(sn.note)]:sn.note}
                            </span>
                            <span style={{fontSize:8,fontFamily:"'DM Mono',monospace",color:'var(--txt3)',marginTop:1}}>
                              {ROMAN[i]||''}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Scale as string */}
                    <div style={{padding:'7px 11px',borderRadius:dark?3:7,
                      background:dark?'rgba(0,0,0,.4)':'rgba(180,83,9,.04)',
                      border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                      fontFamily:"'DM Mono',monospace",fontSize:12.5,color:'var(--acc)',letterSpacing:'.05em',
                      display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span>{scaleString}</span>
                      <button onClick={copyScale} className="btn-ghost" style={{padding:'2px 7px',fontSize:8.5,marginLeft:8}}>
                        {copyOk?'✓ Copied':I.copy(10)}
                      </button>
                    </div>
                  </div>

                  {/* Piano */}
                  <div className="panel" style={{padding:'14px 16px'}}>
                    <div className="lbl" style={{marginBottom:10}}>Piano — {root} {scalePat.label}</div>
                    <PianoKeyboard scaleNotes={scaleNotes} rootNote={root} dark={dark}/>
                    <div style={{display:'flex',gap:14,marginTop:10,fontSize:11,fontFamily:"'DM Mono',monospace",color:'var(--txt3)'}}>
                      <div style={{display:'flex',alignItems:'center',gap:5}}>
                        <div style={{width:10,height:10,borderRadius:'50%',background:'var(--acc)',boxShadow:dark?'0 0 6px var(--acc)':'none'}}/>Root note
                      </div>
                      <div style={{display:'flex',alignItems:'center',gap:5}}>
                        <div style={{width:10,height:10,borderRadius:'50%',background:'var(--acc2)'}}/>Scale note
                      </div>
                    </div>
                  </div>

                  {/* Interval steps */}
                  <div className="panel" style={{padding:'14px 16px'}}>
                    <div className="lbl" style={{marginBottom:10}}>Interval Breakdown</div>
                    <div style={{display:'flex',gap:0,alignItems:'center',flexWrap:'wrap'}}>
                      {scaleNotes.map((sn,i)=>{
                        const nextIv = i<scaleNotes.length-1 ? scalePat.intervals[i+1]-scalePat.intervals[i] : 12-scalePat.intervals[scaleNotes.length-1];
                        return (
                          <React.Fragment key={i}>
                            <div style={{textAlign:'center',minWidth:36}}>
                              <div style={{fontSize:12.5,fontWeight:700,fontFamily:"'DM Mono',monospace",
                                color:i===0?'var(--acc)':'var(--txt)',marginBottom:2}}>
                                {showFlats?FLAT_NAMES[CHROMATIC.indexOf(sn.note)]:sn.note}
                              </div>
                              <div style={{fontSize:8,color:'var(--txt3)',fontFamily:"'DM Mono',monospace"}}>{sn.interval}</div>
                            </div>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',
                              padding:'0 5px',minWidth:30}}>
                              <div style={{fontSize:8,fontFamily:"'DM Mono',monospace",
                                color:nextIv===1?'var(--err)':nextIv===2?'var(--acc)':'var(--warn)',
                                marginBottom:1,fontWeight:700}}>
                                {nextIv===1?'H':nextIv===2?'W':nextIv===3?'W+H':'?'}
                              </div>
                              <div style={{height:1.5,width:'100%',
                                background:nextIv===1?'var(--err)':nextIv===2?'var(--acc)':'var(--warn)'}}/>
                            </div>
                          </React.Fragment>
                        );
                      })}
                      {/* Octave return */}
                      <div style={{textAlign:'center',minWidth:36}}>
                        <div style={{fontSize:12.5,fontWeight:700,fontFamily:"'DM Mono',monospace",color:'var(--acc)',marginBottom:2}}>
                          {showFlats?FLAT_NAMES[CHROMATIC.indexOf(root)]:root}
                        </div>
                        <div style={{fontSize:8,color:'var(--txt3)',fontFamily:"'DM Mono',monospace"}}>12</div>
                      </div>
                    </div>
                    <div style={{marginTop:8,fontSize:10.5,fontFamily:"'DM Mono',monospace",color:'var(--txt3)',display:'flex',gap:12}}>
                      <span><span style={{color:'var(--acc)'}}>W</span> = Whole step (2 semitones)</span>
                      <span><span style={{color:'var(--err)'}}>H</span> = Half step (1 semitone)</span>
                      <span><span style={{color:'var(--warn)'}}>W+H</span> = 3 semitones</span>
                    </div>
                  </div>

                </motion.div>
              )}

              {/* ════ CHORDS ════ */}
              {tab==='chords'&&(
                <motion.div key="chords" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>

                  <div className="hint" style={{display:'flex',gap:7,fontSize:12}}>
                    {I.info(13)} Diatonic chords of <strong>{root} {scalePat.label}</strong> — all chords that naturally belong to this scale.
                  </div>

                  {/* Chord cards */}
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))',gap:10}}>
                    {chords.map((c,i)=>(
                      <motion.button key={i} onClick={()=>setActiveChord(activeChord===i?null:i)}
                        initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:i*.05}}
                        style={{
                          padding:'12px',borderRadius:dark?4:10,
                          border: activeChord===i
                            ? (dark?'1.5px solid var(--acc)':'2px solid var(--acc)')
                            : (dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                          background: activeChord===i
                            ? (dark?'rgba(45,212,191,.1)':'rgba(180,83,9,.09)')
                            : (dark?'var(--sur)':'var(--sur)'),
                          cursor:'pointer',textAlign:'left',
                          boxShadow: activeChord===i?(dark?'0 0 18px rgba(45,212,191,.15)':'0 4px 16px rgba(180,83,9,.15)'):'',
                          transition:'all .15s'
                        }}>
                        <div style={{fontSize:8.5,fontFamily:"'DM Mono',monospace",color:'var(--txt3)',
                          letterSpacing:'.15em',textTransform:'uppercase',marginBottom:4}}>
                          {c.roman} — {c.quality}
                        </div>
                        <div style={{fontSize:22,fontWeight:800,fontFamily:"'Playfair Display',serif",
                          color: activeChord===i?'var(--acc)':'var(--txt)',lineHeight:1,marginBottom:4}}>
                          {c.label}
                        </div>
                        <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:'var(--txt3)'}}>
                          {/* Chord tones */}
                          {(() => {
                            const ri = CHROMATIC.indexOf(c.root);
                            const third = c.quality==='Minor'||c.quality==='Diminished' ? 3 : 4;
                            const fifth = c.quality==='Diminished' ? 6 : 7;
                            const t = [c.root, CHROMATIC[(ri+third)%12], CHROMATIC[(ri+fifth)%12]];
                            return t.map(n=>showFlats?FLAT_NAMES[CHROMATIC.indexOf(n)]:n).join(' · ');
                          })()}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Chord detail */}
                  {activeChord !== null && chords[activeChord] && (
                    <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                      className="panel" style={{padding:'16px 18px'}}>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                        <div>
                          <div style={{fontSize:28,fontWeight:900,fontFamily:"'Playfair Display',serif",
                            color:'var(--acc)',marginBottom:4}}>
                            {chords[activeChord].label}
                          </div>
                          <div style={{fontSize:12,fontFamily:"'DM Mono',monospace",color:'var(--txt2)',marginBottom:8}}>
                            {chords[activeChord].roman} — {chords[activeChord].quality} chord
                          </div>
                          {/* Chord tones detail */}
                          {(() => {
                            const c = chords[activeChord];
                            const ri = CHROMATIC.indexOf(c.root);
                            const third = c.quality==='Minor'||c.quality==='Diminished' ? 3 : 4;
                            const fifth = c.quality==='Diminished' ? 6 : 7;
                            const seventh = c.quality==='Major'?11:c.quality==='Minor'?10:9;
                            const tones = [
                              {n:c.root, iv:'Root'},
                              {n:CHROMATIC[(ri+third)%12], iv:third===3?'Minor 3rd':'Major 3rd'},
                              {n:CHROMATIC[(ri+fifth)%12], iv:fifth===6?'Dim 5th':'Perfect 5th'},
                            ];
                            return (
                              <div style={{display:'flex',flexDirection:'column',gap:5}}>
                                {tones.map((t,i)=>(
                                  <div key={i} style={{display:'flex',gap:10,alignItems:'center'}}>
                                    <div style={{width:30,height:30,borderRadius:'50%',
                                      background:i===0?(dark?'rgba(45,212,191,.15)':'rgba(180,83,9,.12)'):(dark?'rgba(255,255,255,.04)':'rgba(0,0,0,.04)'),
                                      border:i===0?(dark?'1px solid var(--acc)':'1.5px solid var(--acc)'):(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                                      display:'flex',alignItems:'center',justifyContent:'center',
                                      fontSize:11,fontWeight:700,color:i===0?'var(--acc)':'var(--txt)'}}>
                                      {showFlats?FLAT_NAMES[CHROMATIC.indexOf(t.n)]:t.n}
                                    </div>
                                    <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:'var(--txt3)'}}>{t.iv}</span>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                        <ChordVoicing chord={chords[activeChord].label} dark={dark}/>
                      </div>
                    </motion.div>
                  )}

                  {/* Roman numeral progression */}
                  <div className="panel" style={{padding:'14px 16px'}}>
                    <div className="lbl" style={{marginBottom:10}}>Common Progressions in {root} {scalePat.label}</div>
                    <div style={{display:'flex',flexDirection:'column',gap:7}}>
                      {[
                        {name:'I – V – vi – IV (Pop)',     degrees:[0,4,5,3]},
                        {name:'I – IV – V (Blues)',         degrees:[0,3,4]},
                        {name:'ii – V – I (Jazz)',          degrees:[1,4,0]},
                        {name:'I – vi – IV – V (50s)',      degrees:[0,5,3,4]},
                        {name:'vi – IV – I – V (Emotional)',degrees:[5,3,0,4]},
                      ].map(({name,degrees},pi)=>(
                        <div key={pi} style={{padding:'8px 11px',borderRadius:dark?3:7,
                          background:dark?'rgba(255,255,255,.02)':'rgba(180,83,9,.03)',
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>
                          <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:'var(--txt3)',marginBottom:5,letterSpacing:'.06em'}}>{name}</div>
                          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                            {degrees.map((d,i)=>{
                              const ch = chords[d];
                              return ch ? (
                                <div key={i} style={{padding:'4px 10px',borderRadius:dark?2:6,
                                  background:dark?'rgba(45,212,191,.08)':'rgba(180,83,9,.09)',
                                  border:dark?'1px solid rgba(45,212,191,.2)':'1.5px solid rgba(180,83,9,.2)',
                                  fontSize:13,fontWeight:700,fontFamily:"'Playfair Display',serif",color:'var(--acc)'}}>
                                  {ch.label}
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}

              {/* ════ CIRCLE OF FIFTHS ════ */}
              {tab==='circle'&&(
                <motion.div key="circle" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>
                  <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:18,alignItems:'start'}}>
                    <div>
                      <div className="lbl" style={{marginBottom:8}}>Circle of Fifths — click to select root</div>
                      <CircleOfFifths activeNote={root} dark={dark} onSelect={n=>setRoot(CHROMATIC[CHROMATIC.indexOf(n)] ?? CHROMATIC.indexOf(n.replace('b','#')) >= 0 ? CHROMATIC[CHROMATIC.indexOf(n)] : n)}/>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:10}}>
                      <div className="hint" style={{fontSize:12}}>
                        {I.info(13)} The outer ring shows major keys; inner ring shows their relative minor keys. Adjacent keys share 6 of 7 notes.
                      </div>
                      <div className="panel" style={{padding:'12px 14px'}}>
                        <div className="lbl">Key Signatures</div>
                        <div style={{display:'flex',flexDirection:'column',gap:5,marginTop:6}}>
                          {CIRCLE_MAJOR.map((key,i)=>{
                            const sharps = CIRCLE_SHARPS[i];
                            return (
                              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',
                                padding:'5px 8px',borderRadius:dark?2:5,
                                background:key===root?(dark?'rgba(45,212,191,.08)':'rgba(180,83,9,.07)'):'transparent',
                                border:key===root?(dark?'1px solid rgba(45,212,191,.2)':'1.5px solid rgba(180,83,9,.2)'):(dark?'1px solid transparent':'1.5px solid transparent'),
                                cursor:'pointer',transition:'all .12s'}}
                                onClick={()=>setRoot(key)}>
                                <span style={{fontSize:12,fontWeight:700,fontFamily:"'Playfair Display',serif",
                                  color:key===root?'var(--acc)':'var(--txt)'}}>{key} major</span>
                                <span style={{fontSize:10.5,fontFamily:"'DM Mono',monospace",
                                  color:'var(--txt3)'}}>
                                  {sharps > 0 ? `${sharps} ♯` : sharps < 0 ? `${-sharps} ♭` : 'No accidentals'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </motion.div>
              )}

              {/* ════ INTERVALS ════ */}
              {tab==='intervals'&&(
                <motion.div key="intervals" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:13}}>

                  {/* Reference table */}
                  <div className="panel" style={{padding:'14px 16px'}}>
                    <div className="lbl" style={{marginBottom:10}}>All Intervals — Semitone Reference</div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:6}}>
                      {Object.entries(INTERVALS).map(([s,label])=>(
                        <div key={s} style={{display:'flex',alignItems:'center',gap:10,
                          padding:'7px 10px',borderRadius:dark?3:7,
                          background: +s===0||+s===12
                            ? (dark?'rgba(45,212,191,.08)':'rgba(180,83,9,.08)')
                            : +s===7 ? (dark?'rgba(99,102,241,.08)':'rgba(124,58,237,.07)')
                            : (dark?'rgba(255,255,255,.02)':'rgba(0,0,0,.02)'),
                          border: +s===0||+s===12
                            ? (dark?'1px solid rgba(45,212,191,.2)':'1.5px solid rgba(180,83,9,.2)')
                            : (dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)')}}>
                          <div style={{width:28,height:28,borderRadius:'50%',flexShrink:0,
                            background:+s===0||+s===12?(dark?'rgba(45,212,191,.15)':'rgba(180,83,9,.12)'):
                              +s===7?(dark?'rgba(99,102,241,.15)':'rgba(124,58,237,.1)'):
                              (dark?'rgba(255,255,255,.04)':'rgba(0,0,0,.04)'),
                            display:'flex',alignItems:'center',justifyContent:'center',
                            fontSize:11,fontWeight:700,fontFamily:"'DM Mono',monospace",
                            color:+s===0||+s===12?'var(--acc)':+s===7?'var(--acc2)':'var(--txt2)'}}>
                            {s}
                          </div>
                          <div>
                            <div style={{fontSize:12,fontWeight:600,color:'var(--txt)',lineHeight:1.2}}>{label}</div>
                            <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:'var(--txt3)',marginTop:1}}>
                              {CHROMATIC[(CHROMATIC.indexOf(root)+Number(s))%12]} from {root}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interval matrix */}
                  <div className="panel" style={{padding:'14px 16px'}}>
                    <div className="lbl" style={{marginBottom:10}}>Full Interval Matrix from {root}</div>
                    <IntervalMatrix rootNote={root} dark={dark}/>
                  </div>

                </motion.div>
              )}

              {/* ════ THEORY GUIDE ════ */}
              {tab==='guide'&&(
                <motion.div key="guide" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  style={{display:'flex',flexDirection:'column',gap:10}}>
                  <div className="hint" style={{display:'flex',gap:7,fontSize:12}}>
                    {I.info(13)} A step-by-step guide to understanding every feature of Music.theory.
                  </div>
                  {[
                    {t:'Select your root note',      d:'Choose any of the 12 chromatic notes from the sidebar. Use the ♯/♭ toggle in the topbar to switch between sharp and flat notation.'},
                    {t:'Pick a scale type',          d:'12 scale types available: major, minor, all 7 modes (Dorian → Locrian), pentatonic major/minor, blues, harmonic minor, and whole tone.'},
                    {t:'Read the piano diagram',     d:'The keyboard shows 2 octaves. Teal/gold dots mark scale notes; the brighter root dot is larger. White and black keys are both labelled.'},
                    {t:'Understand the interval steps', d:'The Interval Breakdown shows each step as W (whole, 2 semitones), H (half, 1 semitone), or W+H (3 semitones). This is the formula that defines the scale\'s character.'},
                    {t:'Explore diatonic chords',   d:'The ♬ Chords tab shows every chord naturally built from this scale. Click any chord card to see its tones and a guitar fretboard voicing.'},
                    {t:'Common progressions',        d:'Pre-calculated famous chord progressions (I–V–vi–IV, jazz ii–V–I, etc.) are shown with the actual chord names for your selected key.'},
                    {t:'Circle of Fifths',           d:'The ◎ tab shows the full circle. Major keys are in the outer ring, their relative minors in the inner ring. Click any key to jump to it.'},
                    {t:'Interval matrix',            d:'The ⊞ Intervals tab shows a full 12×13 matrix — every possible note reachable from any starting pitch. Highlighted columns mark key intervals.'},
                  ].map(({t,d},i)=>(
                    <div key={i} style={{display:'flex',gap:10}}>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
                        <div className="step-n">{i+1}</div>
                        {i<7&&<div style={{width:1.5,flex:1,marginTop:4,
                          background:dark?'rgba(45,212,191,.1)':'rgba(180,83,9,.12)'}}/>}
                      </div>
                      <div style={{flex:1,paddingTop:1,paddingBottom:10}}>
                        <div style={{fontSize:13,fontWeight:700,color:'var(--txt)',marginBottom:3,fontFamily:"'DM Mono',monospace"}}>{t}</div>
                        <div style={{fontSize:13,color:'var(--txt2)',lineHeight:1.72}}>{d}</div>
                      </div>
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {/* ════ LEARN ════ */}
              {tab==='learn'&&(
                <motion.div key="learn" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <div className="panel" style={{padding:'22px 24px',marginBottom:12}}>
                    <div style={{fontSize:26,fontWeight:900,fontFamily:"'Playfair Display',serif",
                      color:'var(--txt)',marginBottom:4,lineHeight:1.2}}>
                      The Science of Sound
                    </div>
                    <p style={{fontSize:12,color:'var(--txt3)',fontFamily:"'DM Mono',monospace",marginBottom:20}}>
                      Scales · Modes · Chords · Harmony · Composition
                    </p>
                    <div className="prose">
                      <p>Music theory is the grammar of music. Understanding scales and harmony allows you to communicate musically, compose with intention, and understand why music makes us feel the way it does.</p>
                      <h3>What is a Musical Scale?</h3>
                      <p>A scale is an ordered set of notes drawn from the 12-note chromatic scale. The specific intervals between those notes define the scale's "colour" — whether it sounds bright, dark, mysterious, or exotic. <strong>All western music is built on combinations of these scale patterns.</strong></p>
                      <h3>The Physics of Intervals</h3>
                      <p>Sound is vibration. An octave is exactly a 2:1 frequency ratio — 440 Hz (A4) and 880 Hz (A5). A perfect fifth is a 3:2 ratio, which the human brain perceives as maximally consonant after the octave. The <strong>Circle of Fifths</strong> is built from this property: moving up a fifth twelve times returns you to the starting note.</p>
                      <h3>Modes Explained</h3>
                      <p>Every mode is a rotation of the major scale. Dorian starts on degree 2, Phrygian on degree 3, Lydian on degree 4, Mixolydian on degree 5, Aeolian (natural minor) on degree 6, Locrian on degree 7. The intervals remain the same — only the starting point and therefore the perceived tonal centre changes.</p>
                      <h3>Why Chords Fit Scales</h3>
                      <p>Diatonic chords are built by stacking thirds within a scale. Because only the notes of the scale are used, every resulting chord sounds "at home." The I, IV, and V chords in any major key are all major triads — they are the most stable combinations, which is why <strong>I–IV–V</strong> has powered blues, rock and pop for over a century.</p>
                      <h3>Pentatonic & Blues Scales</h3>
                      <p>The pentatonic scale removes the two most tension-creating notes from the major scale (the 4th and 7th). What remains is a five-note set that works over almost any chord in the key — which is why it is the most universally used scale in improvisation across folk, rock, blues, and jazz. The blues scale adds a single "blue note" (the ♭5 / tritone) which creates the characteristic expressive tension of blues music.</p>
                      {[
                        {q:'What is the difference between major and minor?', a:'Major scales use the interval pattern W-W-H-W-W-W-H, giving them a bright, resolved sound. Natural minor (Aeolian mode) uses W-H-W-W-H-W-W. The lowered 3rd, 6th, and 7th degrees create the darker, more melancholic character.'},
                        {q:'What is a tritone?', a:'The tritone (augmented 4th / diminished 5th) is exactly 6 semitones — the furthest possible distance from any note. It was historically called "diabolus in musica" for its dissonant, tense sound. It is the interval that creates tension in the dominant 7th chord, which resolves powerfully to the tonic.'},
                        {q:'How do I use this tool for songwriting?', a:'1) Pick a root and scale that matches your mood. 2) Use the diatonic chord list to find chords that naturally fit together. 3) Try one of the pre-built progressions. 4) Use the piano and interval views to understand which notes to melodise over those chords.'},
                        {q:'What is the relative minor?', a:'Every major key has a relative minor that shares the same notes. The relative minor starts on the 6th degree of the major scale. C major and A minor use the exact same 7 notes — they differ only in which note is treated as "home."'},
                        {q:'Why does the Circle of Fifths show sharps and flats?', a:'Each step clockwise around the circle adds one sharp to the key signature; each step anti-clockwise adds one flat. C major (noon position) has zero accidentals. G major (one step clockwise) has one sharp (F#). This makes the circle a complete map of all key signatures.'},
                      ].map(({q,a},i)=>(
                        <div key={i} style={{padding:'10px 12px',marginBottom:8,
                          background:dark?'rgba(0,0,0,.4)':'rgba(180,83,9,.04)',
                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                          borderRadius:dark?3:8}}>
                          <div style={{fontSize:12.5,fontWeight:700,fontFamily:"'DM Mono',monospace",color:'var(--txt)',marginBottom:4}}>{q}</div>
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