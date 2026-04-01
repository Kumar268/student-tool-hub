import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   MUSIC THEORY CALCULATOR — Document Tools Series #8
   Tabs: Scales · Chords · Intervals · Progressions ·
         BPM · Transpose · Ear Training · Nashville · Guide
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Outfit',sans-serif}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(20,255,180,.2)}50%{box-shadow:0 0 0 8px rgba(20,255,180,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
@keyframes note-pop{0%{transform:scale(.7);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
@keyframes tap-pulse{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(20,255,180,.5)}60%{transform:scale(1.04);box-shadow:0 0 0 18px rgba(20,255,180,0)}100%{transform:scale(1);box-shadow:0 0 0 0 rgba(20,255,180,0)}}
@keyframes metro-tick{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes beat-flash{0%{opacity:1;transform:scale(1.12)}100%{opacity:.3;transform:scale(1)}}
@keyframes spin-slow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

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
.tab{height:40px;padding:0 15px;border:none;cursor:pointer;background:transparent;border-bottom:2.5px solid transparent;font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;letter-spacing:.03em;display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .15s;}
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
.main{padding:18px 22px;display:flex;flex-direction:column;gap:16px;}
.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:4px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:12px;box-shadow:0 2px 18px rgba(13,51,32,.06);}
.fi{width:100%;outline:none;font-family:'Outfit',sans-serif;font-size:13px;padding:8px 11px;transition:all .13s;cursor:pointer;}
.dk .fi{background:rgba(0,0,0,.4);border:1px solid var(--bdr);border-radius:3px;color:var(--tx);}
.dk .fi:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(20,255,180,.1);}
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
.ab p,.ab li{font-family:'Outfit',sans-serif;font-size:13.5px;line-height:1.8;color:var(--tx2);margin-bottom:7px;}
.ab h3{font-family:'Fraunces',serif;font-size:15px;font-weight:600;color:var(--tx);margin:18px 0 8px;}
.ab ul{padding-left:18px;} .ab li{margin-bottom:4px;}
.faq{padding:13px 15px;margin-bottom:8px;}
.dk .faq{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.25);}
.lt .faq{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.8);}
.note-pill{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;font-family:'Fraunces',serif;font-size:13px;font-weight:700;animation:note-pop .3s cubic-bezier(.34,1.56,.64,1);cursor:pointer;}
.dk .note-pill{border:1.5px solid rgba(20,255,180,.4);background:rgba(20,255,180,.1);color:var(--acc);}
.lt .note-pill{border:1.5px solid rgba(13,51,32,.3);background:rgba(13,51,32,.08);color:var(--acc);}
.note-pill.root{background:var(--acc) !important;border-color:var(--acc) !important;}
.dk .note-pill.root{color:#060a09;} .lt .note-pill.root{color:#fff;}
.chord-pill{display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:12px;font-family:'Fraunces',serif;font-size:16px;font-weight:700;animation:note-pop .3s cubic-bezier(.34,1.56,.64,1);cursor:pointer;}
.dk .chord-pill{background:rgba(167,139,250,.15);border:1.5px solid rgba(167,139,250,.35);color:#a78bfa;}
.lt .chord-pill{background:rgba(91,33,182,.08);border:1.5px solid rgba(91,33,182,.25);color:#5b21b6;}
.chord-pill.root{background:var(--acc4) !important;border-color:var(--acc4) !important;}
.dk .chord-pill.root{color:#060a09;} .lt .chord-pill.root{color:#fff;}
.int-display{text-align:center;padding:24px 20px;}
.dk .int-display{border:1px solid rgba(20,255,180,.15);border-radius:4px;background:rgba(20,255,180,.03);}
.lt .int-display{border:1.5px solid rgba(13,51,32,.15);border-radius:12px;background:rgba(13,51,32,.03);}
.prog-card{padding:14px 12px;text-align:center;border-radius:4px;cursor:pointer;transition:all .15s;}
.dk .prog-card{border:1px solid var(--bdr);background:rgba(0,0,0,.3);}
.lt .prog-card{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.9);}
.dk .prog-card:hover{border-color:var(--acc);}
.lt .prog-card:hover{border-color:var(--acc);}
.dk .prog-card.active-chord{border-color:var(--acc);background:rgba(20,255,180,.06);}
.lt .prog-card.active-chord{border-color:var(--acc);background:rgba(13,51,32,.05);}

/* TAP TEMPO */
.tap-btn{width:160px;height:160px;border-radius:50%;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;transition:all .1s;position:relative;overflow:hidden;}
.dk .tap-btn{background:rgba(20,255,180,.08);border:2px solid rgba(20,255,180,.3);box-shadow:0 0 30px rgba(20,255,180,.1);}
.lt .tap-btn{background:rgba(13,51,32,.07);border:2px solid rgba(13,51,32,.25);box-shadow:0 4px 20px rgba(13,51,32,.12);}
.tap-btn.tapped{animation:tap-pulse .35s cubic-bezier(.22,1,.36,1);}
.beat-dot{width:12px;height:12px;border-radius:50%;transition:all .08s;}
.dk .beat-dot{background:rgba(20,255,180,.2);}
.lt .beat-dot{background:rgba(13,51,32,.15);}
.beat-dot.on{animation:beat-flash .25s ease-out forwards;}
.dk .beat-dot.on{background:var(--acc);box-shadow:0 0 8px rgba(20,255,180,.8);}
.lt .beat-dot.on{background:var(--acc);box-shadow:0 0 6px rgba(13,51,32,.5);}

/* TRANSPOSE */
.trp-row{display:flex;align-items:center;gap:8px;padding:8px 12px;margin-bottom:4px;}
.dk .trp-row{border:1px solid var(--bdr);border-radius:3px;background:rgba(0,0,0,.25);}
.lt .trp-row{border:1.5px solid var(--bdr);border-radius:9px;background:rgba(245,251,248,.9);}

/* EAR TRAINING */
.ear-opt{padding:10px 18px;border:none;cursor:pointer;font-family:'Fraunces',serif;font-size:15px;font-weight:600;transition:all .15s;text-align:center;}
.dk .ear-opt{border:1.5px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.3);color:var(--tx);}
.lt .ear-opt{border:1.5px solid var(--bdr);border-radius:9px;background:rgba(245,251,248,.9);color:var(--tx);}
.dk .ear-opt:hover{border-color:rgba(20,255,180,.4);}
.lt .ear-opt:hover{border-color:var(--acc);}
.ear-opt.correct{border-color:#14ffb4 !important;background:rgba(20,255,180,.15) !important;color:var(--acc);}
.ear-opt.wrong{border-color:#ff6b6b !important;background:rgba(255,107,107,.12) !important;color:#ff6b6b;}

/* NASHVILLE */
.nash-cell{padding:10px 14px;text-align:center;}
.dk .nash-cell{border:1px solid var(--bdr);background:rgba(0,0,0,.3);}
.lt .nash-cell{border:1.5px solid var(--bdr);border-radius:6px;background:rgba(245,251,248,.9);}
.nash-cell.nash-root{background:rgba(20,255,180,.1) !important;}
.dk .nash-cell.nash-root{border-color:rgba(20,255,180,.35);}
.lt .nash-cell.nash-root{border-color:rgba(13,51,32,.4);}
`;

/* ══ music data ══ */
const NOTES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const ENHARMONIC = {'C#':'Db','D#':'Eb','F#':'Gb','G#':'Ab','A#':'Bb'};
const SCALES = {
  'Major':           {intervals:[0,2,4,5,7,9,11],  degrees:['I','II','III','IV','V','VI','VII'],  mood:'Bright, happy, resolved'},
  'Natural Minor':   {intervals:[0,2,3,5,7,8,10],  degrees:['i','ii°','III','iv','v','VI','VII'], mood:'Dark, melancholic, expressive'},
  'Harmonic Minor':  {intervals:[0,2,3,5,7,8,11],  degrees:['i','ii°','III+','iv','V','VI','vii°'],mood:'Exotic, dramatic, tense'},
  'Pentatonic Major':{intervals:[0,2,4,7,9],        degrees:['I','II','III','V','VI'],             mood:'Open, folk, country, rock'},
  'Pentatonic Minor':{intervals:[0,3,5,7,10],       degrees:['i','III','IV','V','VII'],            mood:'Blues, rock, pop, modal'},
  'Blues':           {intervals:[0,3,5,6,7,10],     degrees:['i','III','IV','♭V','V','VII'],       mood:'Soulful, gritty, expressive'},
  'Dorian':          {intervals:[0,2,3,5,7,9,10],   degrees:['i','ii','III','IV','v','vi°','VII'], mood:'Minor but brighter, jazz, folk'},
  'Phrygian':        {intervals:[0,1,3,5,7,8,10],   degrees:['i','II','III','iv','v°','VI','vii'], mood:'Spanish, flamenco, dark'},
  'Lydian':          {intervals:[0,2,4,6,7,9,11],   degrees:['I','II','III','♯IV','V','VI','VII'], mood:'Dreamy, floating, film scores'},
  'Mixolydian':      {intervals:[0,2,4,5,7,9,10],   degrees:['I','II','III','IV','v','vi°','VII'], mood:'Bluesy major, rock, modal'},
  'Locrian':         {intervals:[0,1,3,5,6,8,10],   degrees:['i°','II','iii','iv','V','VI','vii'], mood:'Unstable, dissonant, tense'},
  'Whole Tone':      {intervals:[0,2,4,6,8,10],     degrees:['I','II','III','♯IV','♯V','♯VI'],    mood:'Dreamy, ambiguous, impressionist'},
};
const CHORDS = {
  'Major':       {intervals:[0,4,7],    symbol:'',    quality:'Major triad — bright, resolved'},
  'Minor':       {intervals:[0,3,7],    symbol:'m',   quality:'Minor triad — dark, emotional'},
  'Diminished':  {intervals:[0,3,6],    symbol:'°',   quality:'Diminished triad — tense, unstable'},
  'Augmented':   {intervals:[0,4,8],    symbol:'+',   quality:'Augmented triad — dreamy, unresolved'},
  'Major 7th':   {intervals:[0,4,7,11], symbol:'maj7',quality:'Smooth, jazzy, romantic'},
  'Minor 7th':   {intervals:[0,3,7,10], symbol:'m7',  quality:'Warm, soulful, jazz/R&B'},
  'Dominant 7th':{intervals:[0,4,7,10], symbol:'7',   quality:'Bluesy tension, wants to resolve'},
  'Minor maj7':  {intervals:[0,3,7,11], symbol:'mM7', quality:'Sophisticated, cinematic, bittersweet'},
  'Half-dim 7th':{intervals:[0,3,6,10], symbol:'ø7',  quality:'Jazz, classical, transitional tension'},
  'Dim 7th':     {intervals:[0,3,6,9],  symbol:'°7',  quality:'Maximum tension, symmetrical'},
  'Sus2':        {intervals:[0,2,7],    symbol:'sus2',quality:'Open, floating, no third'},
  'Sus4':        {intervals:[0,5,7],    symbol:'sus4',quality:'Suspended, building tension'},
  'Add9':        {intervals:[0,4,7,14], symbol:'add9',quality:'Bright major with colour'},
  'Power':       {intervals:[0,7],      symbol:'5',   quality:'No third — neutral, rock/metal'},
};
const INTERVALS = [
  {name:'Unison',      semitones:0,  abbr:'P1', consonance:'Perfect consonance'},
  {name:'Minor 2nd',   semitones:1,  abbr:'m2', consonance:'Sharp dissonance'},
  {name:'Major 2nd',   semitones:2,  abbr:'M2', consonance:'Mild dissonance'},
  {name:'Minor 3rd',   semitones:3,  abbr:'m3', consonance:'Imperfect consonance'},
  {name:'Major 3rd',   semitones:4,  abbr:'M3', consonance:'Imperfect consonance'},
  {name:'Perfect 4th', semitones:5,  abbr:'P4', consonance:'Consonant (context-dependent)'},
  {name:'Tritone',     semitones:6,  abbr:'TT', consonance:'Strong dissonance'},
  {name:'Perfect 5th', semitones:7,  abbr:'P5', consonance:'Perfect consonance'},
  {name:'Minor 6th',   semitones:8,  abbr:'m6', consonance:'Imperfect consonance'},
  {name:'Major 6th',   semitones:9,  abbr:'M6', consonance:'Imperfect consonance'},
  {name:'Minor 7th',   semitones:10, abbr:'m7', consonance:'Mild dissonance'},
  {name:'Major 7th',   semitones:11, abbr:'M7', consonance:'Sharp dissonance'},
  {name:'Octave',      semitones:12, abbr:'P8', consonance:'Perfect consonance'},
];
const PROGRESSIONS = {
  'I – V – vi – IV':    {degrees:[0,4,5,3], name:'Pop Anthem',     desc:'C–G–Am–F in C. Used in thousands of hits.'},
  'I – IV – V – I':     {degrees:[0,3,4,0], name:'Blues/Rock',     desc:'Foundation of blues, rock, and country.'},
  'ii – V – I':         {degrees:[1,4,0],   name:'Jazz Turnaround',desc:'The cornerstone of jazz harmony.'},
  'I – vi – IV – V':    {degrees:[0,5,3,4], name:'50s Doo-Wop',    desc:'The timeless "ice cream changes".'},
  'vi – IV – I – V':    {degrees:[5,3,0,4], name:'Minor Pop',      desc:'Same chords as I–V–vi–IV, starting on vi.'},
  'I – V – vi – iii':   {degrees:[0,4,5,2], name:'Canon',          desc:"Based on Pachelbel's Canon."},
  'i – VII – VI – VII': {degrees:[0,6,5,6], name:'Andalusian',     desc:'Flamenco and Spanish flavoured.'},
  'i – iv – VII – III': {degrees:[0,3,6,2], name:'Minor Cycle',    desc:'Smooth minor cycle, pop and film scores.'},
};

/* Nashville number qualities (major scale diatonic) */
const NASH_QUALITIES = ['maj','min','min','maj','dom7','min','dim'];
const NASH_ROMAN     = ['1','2','3','4','5','6','7'];
const NASH_NAMES     = ['Tonic','Supertonic','Mediant','Subdominant','Dominant','Submediant','Leading tone'];
const NASH_FUNCTION  = ['Home base','Tension','Colour','Pre-dominant','Dominant tension','Relative minor','Strong pull to 1'];

const MAJ_SCALE_INTERVALS = [0,2,4,5,7,9,11];

/* BPM tempo names */
const TEMPO_NAMES = [
  {name:'Larghissimo', min:0,   max:24},
  {name:'Grave',       min:25,  max:45},
  {name:'Largo',       min:46,  max:54},
  {name:'Lento',       min:55,  max:65},
  {name:'Adagio',      min:66,  max:76},
  {name:'Andante',     min:77,  max:108},
  {name:'Moderato',    min:109, max:120},
  {name:'Allegretto',  min:121, max:139},
  {name:'Allegro',     min:140, max:168},
  {name:'Vivace',      min:169, max:176},
  {name:'Presto',      min:177, max:200},
  {name:'Prestissimo', min:201, max:999},
];
const getTempoName = bpm => TEMPO_NAMES.find(t=>bpm>=t.min&&bpm<=t.max)?.name||'';

/* Note durations at BPM */
const getDurations = bpm => {
  const beat = 60000/bpm;
  return [
    {name:'Whole note',     ms: beat*4},
    {name:'Half note',      ms: beat*2},
    {name:'Quarter note',   ms: beat},
    {name:'8th note',       ms: beat/2},
    {name:'16th note',      ms: beat/4},
    {name:'Triplet 8th',    ms: beat/3},
    {name:'Dotted quarter', ms: beat*1.5},
    {name:'Delay (1/4)',    ms: beat},
    {name:'Delay (3/8)',    ms: beat*1.5},
  ];
};

/* Ear training intervals */
const EAR_INTERVALS = INTERVALS.filter(i=>i.semitones>0&&i.semitones<=12);

/* ══ audio ══ */
let audioCtx = null;
function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  return audioCtx;
}
function playNote(midiNote, duration=0.65, type='triangle', vol=0.18) {
  try {
    const ctx = getAudio();
    const freq = 440*Math.pow(2,(midiNote-69)/12);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+duration);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime+duration);
  } catch (error) {
    console.error(error);
  }
}
function playChord(midiNotes, stagger=55) {
  midiNotes.forEach((n,i)=>setTimeout(()=>playNote(n,1.3),i*stagger));
}
function playMetClick(accent=false) {
  // Global function for one-off plays if needed
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = accent ? 1200 : 900;
    gain.gain.setValueAtTime(accent ? 0.22 : 0.13, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.04);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime+0.05);
  } catch (error) {
    console.error(error);
  }
}

const TABS = [
  {id:'scale',       label:'🎼 Scales'},
  {id:'chord',       label:'🎹 Chords'},
  {id:'interval',    label:'↕ Intervals'},
  {id:'progression', label:'♪ Progressions'},
  {id:'bpm',         label:'🥁 BPM & Tempo'},
  {id:'transpose',   label:'↔ Transpose'},
  {id:'ear',         label:'👂 Ear Training'},
  {id:'nashville',   label:'# Nashville'},
  {id:'guide',       label:'? Guide'},
];

/* ════════════════════════════════════════════════════════════ */
/* ── Piano ── */
const Piano = ({highlighted, dark, playNote})=>{
  const WHITE_KEYS=[0,2,4,5,7,9,11];
  const wkCount=14;
  const allWhites=[];
  for(let o=0;o<2;o++) WHITE_KEYS.forEach((s,wi)=>allWhites.push({s,wi:wi+o*7,n:NOTES[s%12],o}));
  return (
    <div style={{position:'relative',height:80,marginTop:8,borderRadius:4,overflow:'hidden',
      border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>
      <div style={{display:'flex',height:'100%'}}>
        {allWhites.map((k,i)=>(
          <div key={i} onClick={()=>playNote(60+k.s+k.o*12)}
            style={{flex:1,height:'100%',cursor:'pointer',position:'relative',
              borderRight:dark?'1px solid #1a2820':'1px solid #b8ddc8',
              background:highlighted.has(k.n)?(dark?'var(--acc)':'var(--acc)'):(dark?'#e8fff8':'#f0faf5'),
              boxShadow:highlighted.has(k.n)?(dark?'inset 0 -4px 12px rgba(20,255,180,.4)':'inset 0 -4px 8px rgba(13,51,32,.2)'):'none',
              transition:'all .12s'}}>
            {(k.wi===0||k.wi===7)&&(
              <span style={{position:'absolute',bottom:4,left:'50%',transform:'translateX(-50%)',
                fontFamily:"'Fira Code',monospace",fontSize:7,color:highlighted.has(k.n)?(dark?'#060a09':'#fff'):'var(--txm)'}}>
                {k.n}
              </span>
            )}
          </div>
        ))}
      </div>
      {[0,1].map(o=>[1,3,6,8,10].map(s=>{
        const n=NOTES[s%12];
        const isAct=highlighted.has(n);
        const whitesBefore=WHITE_KEYS.filter(w=>w<s).length;
        const leftPct=((whitesBefore+o*7-0.3)/wkCount)*100;
        return (
          <div key={`${o}-${s}`} onClick={e=>{e.stopPropagation();playNote(60+s+o*12);}}
            style={{position:'absolute',top:0,left:`${leftPct}%`,width:`${(100/wkCount)*0.6}%`,height:'57%',
              borderRadius:'0 0 3px 3px',cursor:'pointer',zIndex:2,
              background:isAct?'var(--acc)':(dark?'#0a0f0d':'#071810'),
              boxShadow:isAct?(dark?'0 0 10px rgba(20,255,180,.6)':'none'):(dark?'2px 3px 6px rgba(0,0,0,.5)':'2px 3px 4px rgba(7,24,16,.25)'),
              transition:'all .12s'}}/>
        );
      }))}
    </div>
  );
};

/* ─── SUB-COMPONENTS ─────────────────────────────────────────── */
const SC = ({lbl,val,sub,col,span}) => (
  <div className="scard" style={span?{gridColumn:`span ${span}`}:{}}>
    <div style={{fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:'.16em',textTransform:'uppercase',color:'var(--tx3)'}}>{lbl}</div>
    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,color:col||'var(--acc)',lineHeight:1.1,letterSpacing:'-.02em'}}>{val}</div>
    {sub&&<div style={{fontFamily:"'DM Mono',monospace",fontSize:9.5,color:'var(--tx2)'}}>{sub}</div>}
  </div>
);

/* Animated birthday ring */
const BirthdayRing = ({pct, days, size=170}) => {
  const r=size/2-10,c=Math.PI*2*r,off=c-(pct/100)*c;
  return (
    <div style={{position:'relative',width:size,height:size,margin:'0 auto'}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--s3)" strokeWidth="8"/>
        <Motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--acc)" strokeWidth="8"
          strokeDasharray={c} initial={{strokeDashoffset:c}} animate={{strokeDashoffset:off}}
          transition={{duration:1.5,ease:"easeOut"}} strokeLinecap="round"/>
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:28,fontWeight:900,color:'var(--tx)'}}>{pct}%</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:'var(--tx2)',marginTop:-2}}>{days}d left</div>
      </div>
    </div>
  );
};

export default function MusicTheoryCalc({isDarkMode:ext}={}) {
  const [dark, setDark] = useState(ext!==undefined?ext:true);
  const cls = dark?'dk':'lt';
  const [tab,  setTab]  = useState('scale');
  const [rootNote,  setRootNote]  = useState('C');
  const [scaleType, setScaleType] = useState('Major');
  const [chordType, setChordType] = useState('Major');
  const [note1,     setNote1]     = useState('C');
  const [note2,     setNote2]     = useState('G');
  const [progKey,   setProgKey]   = useState('C');
  const [progType,  setProgType]  = useState('I – V – vi – IV');
  const [activeProgChord, setActiveProgChord] = useState(null);

  /* BPM state */
  const [bpm,          setBpm]         = useState(120);
  const [,    setTapTimes]    = useState([]);
  const [tapFlash,     setTapFlash]    = useState(false);
  const [metroOn,      setMetroOn]     = useState(false);
  const [metroBeat,    setMetroBeat]   = useState(0);
  const [metroSig,     setMetroSig]    = useState(4);
  const metroRef = useRef(null);

  /* Transpose state */
  const [trpInput,  setTrpInput]  = useState('C  E  G  Am  F');
  const [trpFrom,   setTrpFrom]   = useState('C');
  const [trpTo,     setTrpTo]     = useState('G');
  const [trpMode,   setTrpMode]   = useState('semitones'); // semitones | key
  const [trpSemi,   setTrpSemi]   = useState(0);

  /* Ear training state */
  const [earPhase,     setPhase]        = useState('idle'); // idle | playing | answered
  const [earInterval,  setEarInterval]  = useState(null);
  const [earGuess,     setEarGuess]     = useState(null);
  const [earScore,     setEarScore]     = useState({correct:0,total:0});
  const [earDirection, setEarDirection] = useState('ascending'); // ascending | descending | harmonic

  /* Nashville state */
  const [nashKey,  setNashKey]  = useState('C');

  /* ── derived ── */
  const scaleData  = SCALES[scaleType];
  const scaleNotes = useMemo(()=>{
    const ri=NOTES.indexOf(rootNote);
    return scaleData.intervals.map(iv=>NOTES[(ri+iv)%12]);
  },[rootNote, scaleData.intervals]);
  const chordData  = CHORDS[chordType];
  const chordNotes = useMemo(()=>{
    const ri=NOTES.indexOf(rootNote);
    return chordData.intervals.map(iv=>NOTES[(ri+iv)%12]);
  },[rootNote, chordData.intervals]);
  const intervalData = useMemo(()=>{
    const i1=NOTES.indexOf(note1),i2=NOTES.indexOf(note2);
    return INTERVALS[(i2-i1+12)%12];
  },[note1,note2]);
  const progData = PROGRESSIONS[progType];
  const activeNotes = useMemo(()=>{
    if(tab==='scale')    return new Set(scaleNotes);
    if(tab==='chord')    return new Set(chordNotes);
    if(tab==='interval') return new Set([note1,note2]);
    return new Set();
  },[tab,scaleNotes,chordNotes,note1,note2]);

  const playMetClick = useCallback((accent=false) => {
    try {
      const ctx = getAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = accent ? 1200 : 900;
      gain.gain.setValueAtTime(accent ? 0.22 : 0.13, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.04);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime+0.05);
    } catch {}
  }, []);

  /* ── metronome ── */
  useEffect(()=>{
    if(metroOn){
      const interval = (60000/bpm);
      let beat=0;
      const tick=()=>{
        playMetClick(beat===0);
        setMetroBeat(beat%metroSig);
        beat++;
      };
      tick();
      metroRef.current = setInterval(tick, interval);
    } else {
      clearInterval(metroRef.current);
    }
    return ()=>clearInterval(metroRef.current);
  },[metroOn,bpm,metroSig,playMetClick]);

  /* ── tap tempo ── */
  const handleTap = useCallback(()=>{
    const now = Date.now();
    setTapFlash(true);
    setTimeout(()=>setTapFlash(false),150);
    setTapTimes(prev=>{
      const recent = [...prev, now].filter(t=>now-t<5000).slice(-8);
      if(recent.length>=2){
        const gaps=recent.slice(1).map((t,i)=>t-recent[i]);
        const avg=gaps.reduce((a,b)=>a+b,0)/gaps.length;
        const newBpm=Math.round(60000/avg);
        if(newBpm>=20&&newBpm<=300) setBpm(newBpm);
      }
      return recent;
    });
  },[]);

  /* ── transpose ── */
  const transposed = useMemo(()=>{
    const semis = trpMode==='semitones'
      ? parseInt(trpSemi)||0
      : (NOTES.indexOf(trpTo)-NOTES.indexOf(trpFrom)+12)%12;
    const words = trpInput.split(/(\s+)/);
    return words.map(word=>{
      const trimmed=word.trim();
      if(!trimmed) return word;
      // match note name optionally followed by chord quality
      const match = trimmed.match(/^([A-G][#b]?)(.*)$/);
      if(!match) return word;
      const [,notePart,quality]=match;
      // normalise flat to sharp
      const normalised = notePart.replace('Db','C#').replace('Eb','D#').replace('Gb','F#').replace('Ab','G#').replace('Bb','A#');
      const idx=NOTES.indexOf(normalised);
      if(idx===-1) return word;
      const newNote=NOTES[(idx+semis+12)%12];
      return newNote+quality;
    }).join('');
  },[trpInput,trpFrom,trpTo,trpMode,trpSemi]);

  /* ── ear training ── */
  const startEarRound = useCallback(()=>{
    const iv = EAR_INTERVALS[Math.floor(Math.random()*EAR_INTERVALS.length)];
    setEarInterval(iv);
    setEarGuess(null);
    setPhase('playing');
    const root = 60;
    const upper = root + iv.semitones;
    if(earDirection==='ascending'){
      playNote(root,0.8); setTimeout(()=>playNote(upper,0.8),500);
    } else if(earDirection==='descending'){
      playNote(upper,0.8); setTimeout(()=>playNote(root,0.8),500);
    } else {
      playNote(root,1.2); playNote(upper,1.2);
    }
  },[earDirection]);

  const replayEar = useCallback(()=>{
    if(!earInterval) return;
    const root=60, upper=root+earInterval.semitones;
    if(earDirection==='ascending'){
      playNote(root,0.8); setTimeout(()=>playNote(upper,0.8),500);
    } else if(earDirection==='descending'){
      playNote(upper,0.8); setTimeout(()=>playNote(root,0.8),500);
    } else {
      playNote(root,1.2); playNote(upper,1.2);
    }
  },[earInterval,earDirection]);

  const guessEar = useCallback((guess)=>{
    setEarGuess(guess);
    setPhase('answered');
    setEarScore(s=>({
      correct: s.correct+(guess.semitones===earInterval.semitones?1:0),
      total: s.total+1,
    }));
  },[earInterval]);

  /* ── Nashville ── */
  const nashNotes = useMemo(()=>{
    const ri=NOTES.indexOf(nashKey);
    return MAJ_SCALE_INTERVALS.map((iv,i)=>{
      const note=NOTES[(ri+iv)%12];
      const q=NASH_QUALITIES[i];
      return {note,num:NASH_ROMAN[i],quality:q,name:NASH_NAMES[i],fn:NASH_FUNCTION[i]};
    });
  },[nashKey]);

  /* ── play helpers ── */
  const playScale = ()=>{
    const ri=NOTES.indexOf(rootNote)+60;
    scaleData.intervals.forEach((iv,i)=>setTimeout(()=>playNote(ri+iv),i*200));
    setTimeout(()=>playNote(ri+12),scaleData.intervals.length*200);
  };
  const playChordFn = ()=>{
    const ri=NOTES.indexOf(rootNote)+60;
    playChord(chordData.intervals.map(iv=>ri+iv));
  };
  const playIntervalFn = ()=>{
    const i1=NOTES.indexOf(note1)+60, i2=NOTES.indexOf(note2)+60;
    playNote(i1,0.8); setTimeout(()=>playNote(i2,0.8),450);
  };

  /* ─── play-btn shared style ─── */
  const playBtnStyle = (color='acc')=>({
    display:'flex',alignItems:'center',gap:6,padding:'7px 14px',cursor:'pointer',
    fontFamily:"'Outfit',sans-serif",fontSize:11,fontWeight:600,
    border:dark?`1px solid rgba(20,255,180,.3)`:`1.5px solid rgba(13,51,32,.25)`,
    borderRadius:dark?3:7,background:'transparent',
    color:color==='acc'?'var(--acc)':dark?'#a78bfa':'#5b21b6',
    transition:'all .13s',
  });

  /* ════════════════════════════════════════════════════════════ */
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
              boxShadow:dark?'0 0 16px rgba(20,255,180,.2)':'0 3px 10px rgba(13,51,32,.35)'}}>🎵</div>
            <div>
              <div style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:16,color:'var(--tx)',lineHeight:1}}>
                Music<span style={{color:'var(--acc)'}}>Theory</span>
                <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginLeft:7}}>v2.0</span>
              </div>
              <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--tx3)',letterSpacing:'.12em',textTransform:'uppercase',marginTop:1}}>
                Document Tools #8 · 9 tools · scales · chords · BPM · ear training
              </div>
            </div>
          </div>
          <div style={{flex:1}}/>
          <div style={{display:'flex',alignItems:'center',gap:7,padding:'4px 12px',
            border:dark?'1px solid rgba(20,255,180,.2)':'1.5px solid var(--bdr)',
            borderRadius:dark?3:7,background:dark?'rgba(20,255,180,.05)':'rgba(13,51,32,.04)'}}>
            <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)'}}>ROOT</span>
            <span style={{fontFamily:"'Fraunces',serif",fontSize:15,fontWeight:700,color:'var(--acc)'}}>{rootNote}</span>
            {tab==='bpm'&&<><span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',marginLeft:8}}>BPM</span>
            <span style={{fontFamily:"'Fira Code',monospace",fontSize:15,fontWeight:500,color:'var(--acc)'}}>{bpm}</span></>}
          </div>
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
            

            {/* Root note grid */}
            <div>
              <div className="slbl">Root note</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:4}}>
                {NOTES.map(n=>(
                  <button key={n} onClick={()=>setRootNote(n)}
                    style={{padding:'6px 2px',cursor:'pointer',
                      fontFamily:"'Fira Code',monospace",fontSize:11,fontWeight:500,
                      border:rootNote===n?(dark?'1px solid var(--acc)':'1.5px solid var(--acc)'):(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),
                      borderRadius:dark?3:6,
                      color:rootNote===n?'var(--acc)':'var(--txm)',
                      background:rootNote===n?(dark?'rgba(20,255,180,.08)':'rgba(13,51,32,.06)'):'transparent'}}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Circle of 5ths */}
            <div>
              <div className="slbl">Circle of 5ths</div>
              <div style={{position:'relative',width:110,height:110,margin:'0 auto'}}>
                <svg viewBox="0 0 110 110" style={{width:'100%',height:'100%'}}>
                  {['C','G','D','A','E','B','F#','C#','G#','D#','A#','F'].map((n,i)=>{
                    const angle=(i/12)*Math.PI*2-Math.PI/2;
                    const r=42,x=55+r*Math.cos(angle),y=55+r*Math.sin(angle);
                    const isRoot=n===rootNote;
                    return (
                      <g key={n} style={{cursor:'pointer'}} onClick={()=>setRootNote(n)}>
                        <circle cx={x} cy={y} r={11}
                          fill={isRoot?(dark?'var(--acc)':'var(--acc)'):(dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.06)')}
                          stroke={isRoot?'var(--acc)':(dark?'rgba(20,255,180,.15)':'rgba(13,51,32,.15)')}
                          strokeWidth={isRoot?1.5:1}/>
                        <text x={x} y={y+1} textAnchor="middle" dominantBaseline="middle"
                          fontFamily="'Fira Code',monospace" fontSize={n.length>1?7:9} fontWeight={isRoot?700:400}
                          fill={isRoot?(dark?'#060a09':'#fff'):'var(--txm)'}>{n}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* context info */}
            {tab==='scale'&&(
              <div style={{padding:'8px 10px',borderRadius:dark?3:7,
                border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                background:dark?'rgba(20,255,180,.02)':'rgba(13,51,32,.02)'}}>
                <div className="slbl" style={{marginBottom:4}}>Scale mood</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'var(--tx2)',lineHeight:1.5}}>{scaleData.mood}</div>
              </div>
            )}
            {tab==='chord'&&(
              <div style={{padding:'8px 10px',borderRadius:dark?3:7,
                border:dark?'1px solid rgba(167,139,250,.2)':'1.5px solid rgba(91,33,182,.15)',
                background:dark?'rgba(167,139,250,.04)':'rgba(91,33,182,.03)'}}>
                <div className="slbl" style={{marginBottom:4}}>Chord</div>
                <div style={{fontFamily:"'Fira Code',monospace",fontSize:18,color:'var(--acc4)',marginBottom:3}}>{rootNote}{chordData.symbol}</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'var(--tx2)',lineHeight:1.5}}>{chordData.quality}</div>
              </div>
            )}
            {tab==='bpm'&&(
              <div>
                <div className="slbl">Tempo name</div>
                <div style={{padding:'8px 10px',borderRadius:dark?3:7,
                  border:dark?'1px solid rgba(251,191,36,.2)':'1.5px solid rgba(146,64,14,.15)',
                  background:dark?'rgba(251,191,36,.04)':'rgba(146,64,14,.03)'}}>
                  <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:dark?'#fbbf24':'#92400e',marginBottom:2}}>{getTempoName(bpm)}</div>
                  <div style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--acc)'}}>{bpm} BPM</div>
                </div>
                <div className="slbl" style={{marginTop:10}}>Time signatures</div>
                <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                  {[2,3,4,5,6,7].map(s=>(
                    <button key={s} className={`gbtn${metroSig===s?' on':''}`} onClick={()=>setMetroSig(s)} style={{flex:1,justifyContent:'center'}}>{s}/4</button>
                  ))}
                </div>
              </div>
            )}
            {tab==='ear'&&(
              <div>
                <div className="slbl">Score</div>
                <div style={{padding:'10px',borderRadius:dark?3:7,textAlign:'center',
                  border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                  background:dark?'rgba(0,0,0,.3)':'rgba(245,251,248,.9)'}}>
                  <div style={{fontFamily:"'Fira Code',monospace",fontSize:28,color:'var(--acc)',fontWeight:500}}>{earScore.correct}/{earScore.total}</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:'var(--txm)'}}>
                    {earScore.total>0?Math.round(earScore.correct/earScore.total*100):0}% accuracy
                  </div>
                </div>
                <div className="slbl" style={{marginTop:10}}>Direction</div>
                {['ascending','descending','harmonic'].map(d=>(
                  <button key={d} className={`gbtn${earDirection===d?' on':''}`}
                    onClick={()=>setEarDirection(d)}
                    style={{width:'100%',marginBottom:4,justifyContent:'flex-start',textTransform:'capitalize'}}>
                    {d==='ascending'?'↑ Ascending':d==='descending'?'↓ Descending':'≡ Harmonic (together)'}
                  </button>
                ))}
                <button className="gbtn" style={{width:'100%',marginTop:4,justifyContent:'center',color:'var(--err)',borderColor:'var(--err)'}}
                  onClick={()=>setEarScore({correct:0,total:0})}>reset score</button>
              </div>
            )}
            
          </div>

          {/* MAIN */}
          <div className="main">
            

            <AnimatePresence mode="wait">

                          {/* ═══ SCALES ═══ */}
                          {tab==='scale'&&(
                            <Motion.div key="sc" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{display:'flex',flexDirection:'column',gap:14}}>
                              <div className="panel" style={{padding:'18px 20px'}}>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                                  <div style={{display:'flex',alignItems:'center',gap:9}}>
                                    <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)'}}>🎼</div>
                                    <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>Scale builder</div>
                                  </div>
                                  <button onClick={playScale} style={playBtnStyle()}
                                    onMouseEnter={e=>e.currentTarget.style.background=dark?'rgba(20,255,180,.08)':'rgba(13,51,32,.06)'}
                                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>▶ play scale</button>
                                </div>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:18}}>
                                  <div><label className="lbl">Root note</label><select className="fi" value={rootNote} onChange={e=>setRootNote(e.target.value)}>{NOTES.map(n=><option key={n}>{n}</option>)}</select></div>
                                  <div><label className="lbl">Scale type</label><select className="fi" value={scaleType} onChange={e=>setScaleType(e.target.value)}>{Object.keys(SCALES).map(s=><option key={s}>{s}</option>)}</select></div>
                                </div>
                                <AnimatePresence mode="wait">
                                  <Motion.div key={rootNote+scaleType} initial={{opacity:0}} animate={{opacity:1}}
                                    style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:14}}>
                                    {scaleNotes.map((note,i)=>(
                                      <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                                        <div className={`note-pill${i===0?' root':''}`} onClick={()=>playNote(NOTES.indexOf(note)+60)} style={{animationDelay:`${i*40}ms`}}>{note}</div>
                                        <span style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)'}}>{scaleData.degrees[i]||''}</span>
                                      </div>
                                    ))}
                                  </Motion.div>
                                </AnimatePresence>
                                <div style={{display:'flex',gap:4,marginBottom:14,flexWrap:'wrap'}}>
                                  {scaleData.intervals.map((iv,i)=>{
                                    const next=scaleData.intervals[i+1]??12;
                                    const step=next-iv;
                                    return <div key={i} style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--acc)',padding:'2px 7px',borderRadius:2,background:dark?'rgba(20,255,180,.07)':'rgba(13,51,32,.06)'}}>{step===2?'W':step===1?'H':'W+H'}</div>;
                                  })}
                                </div>
                                <Piano highlighted={activeNotes} dark={dark} playNote={playNote}/>
                                <div style={{marginTop:14,fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--tx2)',padding:'9px 13px',borderRadius:dark?3:7,border:dark?'1px solid rgba(20,255,180,.1)':'1.5px solid var(--bdr)',background:dark?'rgba(0,0,0,.4)':'rgba(245,251,248,.9)'}}>
                                  {rootNote} {scaleType}: {scaleNotes.join(' – ')}{'\n'}Semitones: {scaleData.intervals.join(', ')}
                                </div>
                              </div>
                              <div className="panel" style={{padding:'16px 18px'}}>
                                <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>All scales in {rootNote}</div>
                                {Object.entries(SCALES).map(([name,data])=>{
                                  const ri=NOTES.indexOf(rootNote);
                                  const notes=data.intervals.map(iv=>NOTES[(ri+iv)%12]);
                                  return (
                                    <div key={name} onClick={()=>setScaleType(name)}
                                      style={{display:'flex',alignItems:'center',gap:10,padding:'7px 10px',marginBottom:4,cursor:'pointer',borderRadius:dark?3:8,transition:'all .12s',border:scaleType===name?(dark?'1px solid var(--acc)':'1.5px solid var(--acc)'):(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),background:scaleType===name?(dark?'rgba(20,255,180,.05)':'rgba(13,51,32,.04)'):'transparent'}}
                                      onMouseEnter={e=>{if(scaleType!==name)e.currentTarget.style.borderColor='rgba(20,255,180,.3)';}}
                                      onMouseLeave={e=>{if(scaleType!==name)e.currentTarget.style.borderColor=dark?'var(--bdr)':'var(--bdr)';}}>
                                      <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11.5,fontWeight:600,color:'var(--tx)',width:140}}>{name}</span>
                                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--txm)',flex:1}}>{notes.join(' · ')}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </Motion.div>
                          )}

                          {/* ═══ CHORDS ═══ */}
                          {tab==='chord'&&(
                            <Motion.div key="ch" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{display:'flex',flexDirection:'column',gap:14}}>
                              <div className="panel" style={{padding:'18px 20px'}}>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                                  <div style={{display:'flex',alignItems:'center',gap:9}}>
                                    <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,border:dark?'1px solid rgba(167,139,250,.3)':'1.5px solid rgba(91,33,182,.2)',background:dark?'rgba(167,139,250,.08)':'rgba(91,33,182,.05)'}}>🎹</div>
                                    <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>Chord builder</div>
                                  </div>
                                  <button onClick={playChordFn} style={playBtnStyle('purple')}
                                    onMouseEnter={e=>e.currentTarget.style.background=dark?'rgba(167,139,250,.08)':'rgba(91,33,182,.06)'}
                                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>▶ play chord</button>
                                </div>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:18}}>
                                  <div><label className="lbl">Root note</label><select className="fi" value={rootNote} onChange={e=>setRootNote(e.target.value)}>{NOTES.map(n=><option key={n}>{n}</option>)}</select></div>
                                  <div><label className="lbl">Chord type</label><select className="fi" value={chordType} onChange={e=>setChordType(e.target.value)}>{Object.keys(CHORDS).map(c=><option key={c}>{c}</option>)}</select></div>
                                </div>
                                <AnimatePresence mode="wait">
                                  <Motion.div key={rootNote+chordType} initial={{opacity:0}} animate={{opacity:1}} style={{display:'flex',flexWrap:'wrap',gap:10,marginBottom:16}}>
                                    {chordNotes.map((note,i)=>(
                                      <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                                        <div className={`chord-pill${i===0?' root':''}`} onClick={()=>playNote(NOTES.indexOf(note)+60)} style={{animationDelay:`${i*60}ms`}}>{note}</div>
                                        <span style={{fontFamily:"'Fira Code',monospace",fontSize:8.5,color:'var(--txm)'}}>{['Root','3rd','5th','7th','9th'][i]}</span>
                                      </div>
                                    ))}
                                    <div style={{marginLeft:'auto',display:'flex',flexDirection:'column',alignItems:'flex-end',justifyContent:'center'}}>
                                      <div style={{fontFamily:"'Fira Code',monospace",fontSize:28,fontWeight:500,color:'var(--acc4)',lineHeight:1}}>{rootNote}{chordData.symbol}</div>
                                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'var(--txm)',marginTop:3}}>{chordType}</div>
                                    </div>
                                  </Motion.div>
                                </AnimatePresence>
                                <Piano highlighted={activeNotes} dark={dark} playNote={playNote}/>
                                <div style={{marginTop:14,fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--tx2)',padding:'9px 13px',borderRadius:dark?3:7,border:dark?'1px solid rgba(167,139,250,.12)':'1.5px solid rgba(91,33,182,.1)',background:dark?'rgba(167,139,250,.04)':'rgba(91,33,182,.03)'}}>
                                  {`${rootNote}${chordData.symbol}: ${chordNotes.join(' + ')}\nIntervals: ${chordData.intervals.join(' – ')} semitones`}
                                </div>
                              </div>
                              <div className="panel" style={{padding:'16px 18px'}}>
                                <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>All chords in {rootNote}</div>
                                <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:6}}>
                                  {Object.entries(CHORDS).map(([name,data])=>{
                                    const ri=NOTES.indexOf(rootNote);
                                    const notes=data.intervals.map(iv=>NOTES[(ri+iv)%12]);
                                    return (
                                      <div key={name} onClick={()=>setChordType(name)}
                                        style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 11px',cursor:'pointer',borderRadius:dark?3:8,transition:'all .12s',border:chordType===name?(dark?'1px solid var(--acc4)':'1.5px solid var(--acc4)'):(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),background:chordType===name?(dark?'rgba(167,139,250,.06)':'rgba(91,33,182,.04)'):'transparent'}}>
                                        <div>
                                          <span style={{fontFamily:"'Fira Code',monospace",fontSize:13,color:'var(--acc4)'}}>{rootNote}{data.symbol}</span>
                                          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:'var(--txm)',marginLeft:6}}>{name}</span>
                                        </div>
                                        <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)'}}>{notes.join(' ')}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </Motion.div>
                          )}

                          {/* ═══ INTERVALS ═══ */}
                          {tab==='interval'&&(
                            <Motion.div key="iv" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{display:'flex',flexDirection:'column',gap:14}}>
                              <div className="panel" style={{padding:'18px 20px'}}>
                                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
                                  <div style={{display:'flex',alignItems:'center',gap:9}}>
                                    <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Fira Code',monospace",fontSize:14,color:'var(--acc)',border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)'}}>↕</div>
                                    <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>Interval finder</div>
                                  </div>
                                  <button onClick={playIntervalFn} style={playBtnStyle()}
                                    onMouseEnter={e=>e.currentTarget.style.background=dark?'rgba(20,255,180,.08)':'rgba(13,51,32,.06)'}
                                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>▶ play</button>
                                </div>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
                                  <div><label className="lbl">First note</label><select className="fi" value={note1} onChange={e=>setNote1(e.target.value)}>{NOTES.map(n=><option key={n}>{n}</option>)}</select></div>
                                  <div><label className="lbl">Second note</label><select className="fi" value={note2} onChange={e=>setNote2(e.target.value)}>{NOTES.map(n=><option key={n}>{n}</option>)}</select></div>
                                </div>
                                <AnimatePresence mode="wait">
                                  <Motion.div key={note1+note2} className="int-display" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}}>
                                    <div style={{fontFamily:"'Fraunces',serif",fontSize:32,fontWeight:700,color:'var(--acc)',lineHeight:1,marginBottom:7}}>{intervalData.name}</div>
                                    <div style={{fontFamily:"'Fira Code',monospace",fontSize:13,color:'var(--acc4)',marginBottom:6}}>{intervalData.abbr}</div>
                                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)',marginBottom:3}}>{intervalData.semitones} semitone{intervalData.semitones!==1?'s':''} · {note1} to {note2}</div>
                                    <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:'var(--txm)'}}>{intervalData.consonance}</div>
                                  </Motion.div>
                                </AnimatePresence>
                                <Piano highlighted={activeNotes} dark={dark} playNote={playNote}/>
                              </div>
                              <div className="panel" style={{padding:'16px 18px'}}>
                                <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>All intervals</div>
                                {INTERVALS.map(iv=>(
                                  <div key={iv.semitones} onClick={()=>setNote2(NOTES[(NOTES.indexOf(note1)+iv.semitones)%12])}
                                    style={{display:'flex',alignItems:'center',gap:10,padding:'7px 10px',marginBottom:3,cursor:'pointer',borderRadius:dark?3:8,transition:'all .12s',border:intervalData.semitones===iv.semitones?(dark?'1px solid var(--acc)':'1.5px solid var(--acc)'):(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),background:intervalData.semitones===iv.semitones?(dark?'rgba(20,255,180,.05)':'rgba(13,51,32,.04)'):'transparent'}}
                                    onMouseEnter={e=>{if(intervalData.semitones!==iv.semitones)e.currentTarget.style.borderColor='rgba(20,255,180,.25)';}}
                                    onMouseLeave={e=>{if(intervalData.semitones!==iv.semitones)e.currentTarget.style.borderColor=dark?'var(--bdr)':'var(--bdr)';}}>
                                    <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--acc4)',width:24}}>{iv.abbr}</span>
                                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11.5,fontWeight:500,color:'var(--tx)',flex:1}}>{iv.name}</span>
                                    <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',width:16,textAlign:'right'}}>{iv.semitones}</span>
                                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:'var(--txm)',width:160,textAlign:'right'}}>{iv.consonance}</span>
                                  </div>
                                ))}
                              </div>
                            </Motion.div>
                          )}

                          {/* ═══ PROGRESSIONS ═══ */}
                          {tab==='progression'&&(
                            <Motion.div key="pg" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{display:'flex',flexDirection:'column',gap:14}}>
                              <div className="panel" style={{padding:'18px 20px'}}>
                                <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
                                  <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,border:dark?'1px solid rgba(251,191,36,.3)':'1.5px solid rgba(146,64,14,.2)',background:dark?'rgba(251,191,36,.07)':'rgba(146,64,14,.04)'}}>♪</div>
                                  <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>Chord progressions</div>
                                </div>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:14}}>
                                  <div><label className="lbl">Key</label><select className="fi" value={progKey} onChange={e=>setProgKey(e.target.value)}>{NOTES.map(n=><option key={n}>{n}</option>)}</select></div>
                                  <div><label className="lbl">Progression</label><select className="fi" value={progType} onChange={e=>setProgType(e.target.value)}>{Object.keys(PROGRESSIONS).map(p=><option key={p}>{p}</option>)}</select></div>
                                </div>
                                <div style={{padding:'10px 13px',borderRadius:dark?3:8,marginBottom:14,border:dark?'1px solid rgba(251,191,36,.15)':'1.5px solid rgba(146,64,14,.12)',background:dark?'rgba(251,191,36,.04)':'rgba(146,64,14,.03)'}}>
                                  <div style={{fontFamily:"'Fraunces',serif",fontSize:13,fontWeight:600,color:dark?'#fbbf24':'#92400e',marginBottom:2}}>{PROGRESSIONS[progType].name}</div>
                                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:'var(--tx2)'}}>{PROGRESSIONS[progType].desc}</div>
                                </div>
                                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                                  {progData.degrees.map((deg,i)=>{
                                    const ri=NOTES.indexOf(progKey);
                                    const noteIdx=(ri+MAJ_SCALE_INTERVALS[deg%7])%12;
                                    const noteName=NOTES[noteIdx];
                                    const quality=['','m','m','','','m','°'][deg]||'';
                                    const isActive=activeProgChord===i;
                                    return (
                                      <div key={i} className={`prog-card${isActive?' active-chord':''}`} style={{flex:'1 1 80px',minWidth:80}}
                                        onClick={()=>{
                                          setActiveProgChord(i);
                                          const base=NOTES.indexOf(noteName)+60;
                                          const ivs=quality==='m'?[0,3,7]:quality==='°'?[0,3,6]:[0,4,7];
                                          playChord(ivs.map(iv=>base+iv),40);
                                        }}>
                                        <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginBottom:4}}>{'I II III IV V VI VII'.split(' ')[deg]}</div>
                                        <div style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:700,color:isActive?'var(--acc)':'var(--tx)',lineHeight:1,marginBottom:3}}>{noteName}</div>
                                        <div style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:isActive?'var(--acc)':dark?'#a78bfa':'#5b21b6'}}>{noteName}{quality}</div>
                                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:'var(--txm)',marginTop:4}}>{quality===''?'major':quality==='m'?'minor':'dim'}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              <div className="panel" style={{padding:'16px 18px'}}>
                                <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>All progressions in {progKey}</div>
                                {Object.entries(PROGRESSIONS).map(([prog,data])=>{
                                  const ri=NOTES.indexOf(progKey);
                                  const chords=data.degrees.map(d=>{const n=NOTES[(ri+MAJ_SCALE_INTERVALS[d%7])%12];const q=['','m','m','','','m','°'][d]||'';return n+q;});
                                  return (
                                    <div key={prog} onClick={()=>setProgType(prog)}
                                      style={{display:'flex',alignItems:'center',gap:10,padding:'8px 11px',marginBottom:4,cursor:'pointer',borderRadius:dark?3:8,transition:'all .12s',border:progType===prog?(dark?'1px solid rgba(251,191,36,.5)':'1.5px solid rgba(146,64,14,.4)'):(dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'),background:progType===prog?(dark?'rgba(251,191,36,.05)':'rgba(146,64,14,.03)'):'transparent'}}
                                      onMouseEnter={e=>{if(progType!==prog)e.currentTarget.style.borderColor='rgba(251,191,36,.25)';}}
                                      onMouseLeave={e=>{if(progType!==prog)e.currentTarget.style.borderColor=dark?'var(--bdr)':'var(--bdr)';}}>
                                      <div style={{flex:1}}>
                                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11.5,fontWeight:600,color:'var(--tx)'}}>{data.name}</div>
                                        <div style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--txm)',marginTop:1}}>{prog}</div>
                                      </div>
                                      <div style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:dark?'#fbbf24':'#92400e'}}>{chords.join(' – ')}</div>
                                    </div>
                                  );
                                })}
                              </div>
                            </Motion.div>
                          )}

                          {/* ═══ BPM & TEMPO ═══ */}
                          {tab==='bpm'&&(
                            <Motion.div key="bpm" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{display:'flex',flexDirection:'column',gap:14}}>
                              <div className="panel" style={{padding:'18px 20px'}}>
                                <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:20}}>
                                  <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,border:dark?'1px solid rgba(251,191,36,.3)':'1.5px solid rgba(146,64,14,.2)',background:dark?'rgba(251,191,36,.07)':'rgba(146,64,14,.04)'}}>🥁</div>
                                  <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>BPM tap tempo & metronome</div>
                                </div>

                                <div style={{display:'flex',gap:24,alignItems:'center',flexWrap:'wrap',marginBottom:22}}>
                                  {/* tap button */}
                                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
                                    <button className={`tap-btn${tapFlash?' tapped':''}`} onClick={handleTap}>
                                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:40,fontWeight:500,color:'var(--acc)',lineHeight:1}}>{bpm}</span>
                                      <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:'var(--txm)'}}>BPM</span>
                                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:'var(--tx3)',marginTop:2}}>tap to set</span>
                                    </button>
                                    <button className="gbtn" onClick={()=>{setTapTimes([]);}} style={{fontSize:9}}>reset taps</button>
                                  </div>

                                  {/* BPM slider + metronome */}
                                  <div style={{flex:1,minWidth:200}}>
                                    <label className="lbl">Set BPM manually</label>
                                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                                      <input type="range" min="20" max="300" value={bpm} onChange={e=>setBpm(Number(e.target.value))}
                                        style={{flex:1,WebkitAppearance:'none',appearance:'none',height:4,borderRadius:2,outline:'none',cursor:'pointer',
                                          background:dark?'rgba(20,255,180,.15)':'rgba(13,51,32,.12)'}}/>
                                      <input type="number" min="20" max="300" value={bpm} onChange={e=>setBpm(Number(e.target.value))}
                                        style={{width:60,outline:'none',fontFamily:"'Fira Code',monospace",fontSize:13,padding:'5px 8px',textAlign:'center',
                                          background:dark?'rgba(0,0,0,.4)':'#f5fbf8',
                                          border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                                          borderRadius:dark?3:6,color:'var(--acc)'}}/>
                                    </div>

                                    {/* Tempo name bar */}
                                    <div style={{marginBottom:14}}>
                                      <label className="lbl">Tempo marking</label>
                                      <div style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:700,color:dark?'#fbbf24':'#92400e'}}>{getTempoName(bpm)}</div>
                                    </div>

                                    {/* Metronome controls */}
                                    <label className="lbl">Metronome ({metroSig}/4)</label>
                                    <div style={{display:'flex',gap:8,marginBottom:10}}>
                                      {Array.from({length:metroSig},(_,i)=>(
                                        <div key={i} className={`beat-dot${metroOn&&metroBeat===i?' on':''}`}
                                          style={{width:14,height:14,borderRadius:'50%',transition:'all .08s'}}/>
                                      ))}
                                    </div>
                                    <button onClick={()=>setMetroOn(m=>!m)}
                                      style={{display:'flex',alignItems:'center',gap:8,padding:'10px 22px',cursor:'pointer',
                                        fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:700,letterSpacing:'.04em',
                                        border:'none',borderRadius:dark?3:8,
                                        background:metroOn?(dark?'rgba(255,107,107,.15)':'rgba(153,27,27,.08)'):(dark?'rgba(20,255,180,.12)':'rgba(13,51,32,.1)'),
                                        color:metroOn?(dark?'#ff6b6b':'#991b1b'):'var(--acc)',
                                        boxShadow:metroOn?(dark?'0 0 20px rgba(255,107,107,.2)':'none'):(dark?'0 0 20px rgba(20,255,180,.15)':'none'),
                                        transition:'all .2s'}}>
                                      {metroOn?'⏹ stop metronome':'▶ start metronome'}
                                    </button>
                                  </div>
                                </div>

                                {/* Common BPM presets */}
                                <label className="lbl" style={{marginBottom:8}}>Genre presets</label>
                                <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                                  {[['Hip Hop',85],['R&B',95],['Pop',110],['House',128],['Techno',140],['Drum & Bass',174],['Waltz',92,'3/4'],['Bossa Nova',130],['Blues',72],['Reggae',80],['Punk',160],['Metal',200]].map(([name,b,sig])=>(
                                    <button key={name} className="gbtn" onClick={()=>{setBpm(b);if(sig==='3/4')setMetroSig(3);else setMetroSig(4);}}
                                      style={{fontSize:10,gap:5}}>
                                      {name} <span style={{color:'var(--acc)'}}>{b}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Note durations */}
                              <div className="panel" style={{padding:'16px 18px'}}>
                                <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>
                                  Note durations at {bpm} BPM
                                </div>
                                {getDurations(bpm).map(({name,ms})=>(
                                  <div key={name} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'7px 10px',marginBottom:3,borderRadius:dark?3:8,border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',background:dark?'rgba(0,0,0,.25)':'rgba(245,251,248,.9)'}}>
                                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:'var(--tx)'}}>{name}</span>
                                    <div style={{display:'flex',gap:14}}>
                                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--acc)'}}>{ms.toFixed(0)} ms</span>
                                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--txm)'}}>{(ms/1000).toFixed(3)} s</span>
                                      <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--acc4)'}}>{(1000/ms).toFixed(2)} Hz</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Motion.div>
                          )}

              {/* ═══ TRANSPOSE ═══ */}
              {tab==='transpose'&&(
                <Motion.div key="tr" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:18}}>
                      <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Fira Code',monospace",fontSize:14,color:'var(--acc)',border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)'}}>↔</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>Chord / note transposer</div>
                    </div>

                    {/* mode toggle */}
                    <div style={{display:'flex',gap:5,marginBottom:16}}>
                      {[['semitones','By semitones'],['key','By key change']].map(([m,l])=>(
                        <button key={m} className={`gbtn${trpMode===m?' on':''}`} onClick={()=>setTrpMode(m)}>{l}</button>
                      ))}
                    </div>

                    {trpMode==='semitones'?(
                      <div style={{marginBottom:16}}>
                        <label className="lbl">Semitones to transpose</label>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <button className="gbtn" onClick={()=>setTrpSemi(s=>s-1)} style={{width:36,justifyContent:'center',fontSize:16}}>−</button>
                          <div style={{fontFamily:"'Fira Code',monospace",fontSize:24,fontWeight:500,color:'var(--acc)',width:50,textAlign:'center'}}>
                            {trpSemi>0?'+':''}{trpSemi}
                          </div>
                          <button className="gbtn" onClick={()=>setTrpSemi(s=>s+1)} style={{width:36,justifyContent:'center',fontSize:16}}>+</button>
                          <input type="range" min="-12" max="12" value={trpSemi} onChange={e=>setTrpSemi(Number(e.target.value))}
                            style={{flex:1,WebkitAppearance:'none',appearance:'none',height:4,borderRadius:2,outline:'none',cursor:'pointer',background:dark?'rgba(20,255,180,.15)':'rgba(13,51,32,.12)'}}/>
                          <button className="gbtn" onClick={()=>setTrpSemi(0)} style={{fontSize:9}}>reset</button>
                        </div>
                      </div>
                    ):(
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                        <div><label className="lbl">From key</label><select className="fi" value={trpFrom} onChange={e=>setTrpFrom(e.target.value)}>{NOTES.map(n=><option key={n}>{n}</option>)}</select></div>
                        <div><label className="lbl">To key</label><select className="fi" value={trpTo} onChange={e=>setTrpTo(e.target.value)}>{NOTES.map(n=><option key={n}>{n}</option>)}</select></div>
                      </div>
                    )}

                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                      <div>
                        <label className="lbl">Original chords</label>
                        <textarea className="fi" value={trpInput} onChange={e=>setTrpInput(e.target.value)}
                          rows={5} style={{resize:'vertical',fontFamily:"'Fira Code',monospace",fontSize:14,lineHeight:1.9,
                            background:dark?'rgba(0,0,0,.4)':'#f5fbf8',
                            border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',
                            borderRadius:dark?3:8,color:'var(--acc)',padding:'9px 12px',width:'100%',outline:'none'}}/>
                      </div>
                      <div>
                        <label className="lbl">Transposed</label>
                        <div style={{fontFamily:"'Fira Code',monospace",fontSize:14,lineHeight:1.9,padding:'9px 12px',
                          borderRadius:dark?3:8,minHeight:100,whiteSpace:'pre-wrap',wordBreak:'break-word',
                          border:dark?'1px solid rgba(20,255,180,.2)':'1.5px solid rgba(13,51,32,.2)',
                          background:dark?'rgba(20,255,180,.04)':'rgba(13,51,32,.03)',
                          color:'var(--acc)'}}>
                          {transposed}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transpose reference table */}
                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>
                      Transpose reference — all 12 keys
                    </div>
                    <div style={{overflowX:'auto'}}>
                      <table style={{width:'100%',borderCollapse:'separate',borderSpacing:3}}>
                        <thead>
                          <tr>
                            <th style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:'var(--txm)',fontWeight:600,letterSpacing:'.15em',padding:'4px 8px',textAlign:'left'}}>FROM ↓  SEMI→</th>
                            {Array.from({length:13},(_,i)=>i-6).map(s=>(
                              <th key={s} style={{fontFamily:"'Fira Code',monospace",fontSize:9,color:s===0?'var(--acc)':'var(--txm)',fontWeight:s===0?700:400,padding:'4px 6px',textAlign:'center'}}>{s>0?'+':''}{s}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {NOTES.map(n=>(
                            <tr key={n}>
                              <td style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:'var(--acc)',padding:'4px 8px',fontWeight:700}}>{n}</td>
                              {Array.from({length:13},(_,i)=>i-6).map(s=>(
                                <td key={s} style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:s===0?'var(--acc)':'var(--txm)',padding:'4px 6px',textAlign:'center',
                                  background:s===0?(dark?'rgba(20,255,180,.07)':'rgba(13,51,32,.05)'):'transparent',
                                  borderRadius:2}}>
                                  {NOTES[(NOTES.indexOf(n)+s+12)%12]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Motion.div>
              )}

              {/* ═══ EAR TRAINING ═══ */}
              {tab==='ear'&&(
                <Motion.div key="ear" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
                      <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.05)'}}>👂</div>
                      <div>
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>Ear training — interval recognition</div>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'var(--txm)',marginTop:2}}>Listen to two notes and identify the interval between them</div>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {earPhase==='idle'&&(
                        <Motion.div key="idle" initial={{opacity:0}} animate={{opacity:1}} style={{textAlign:'center',padding:'32px 0'}}>
                          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:14,color:'var(--txm)',marginBottom:20}}>
                            Direction: <strong style={{color:'var(--acc)',textTransform:'capitalize'}}>{earDirection}</strong>
                          </div>
                          <button onClick={startEarRound}
                            style={{padding:'16px 40px',borderRadius:dark?4:12,border:'none',cursor:'pointer',
                              fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,
                              background:'var(--acc)',color:dark?'#060a09':'#fff',
                              boxShadow:dark?'0 0 30px rgba(20,255,180,.3)':'0 6px 20px rgba(13,51,32,.25)',
                              animation:'glow 2.5s infinite'}}>
                            ▶ Play interval
                          </button>
                        </Motion.div>
                      )}

                      {(earPhase==='playing'||earPhase==='answered')&&(
                        <Motion.div key="q" initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}>
                          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--txm)'}}>
                              What interval did you hear?
                            </div>
                            <button onClick={replayEar} className="gbtn">↺ replay</button>
                          </div>

                          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:16}}>
                            {EAR_INTERVALS.map(iv=>{
                              const isCorrect=earPhase==='answered'&&iv.semitones===earInterval?.semitones;
                              const isWrong=earPhase==='answered'&&earGuess?.semitones===iv.semitones&&iv.semitones!==earInterval?.semitones;
                              return (
                                <button key={iv.semitones}
                                  className={`ear-opt${isCorrect?' correct':isWrong?' wrong':''}`}
                                  disabled={earPhase==='answered'}
                                  onClick={()=>guessEar(iv)}>
                                  {iv.name}
                                </button>
                              );
                            })}
                          </div>

                          {earPhase==='answered'&&(
                            <Motion.div initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
                              style={{textAlign:'center',padding:'14px',borderRadius:dark?3:9,marginBottom:14,
                                border:earGuess?.semitones===earInterval?.semitones?(dark?'1px solid rgba(20,255,180,.3)':'1.5px solid rgba(20,255,180,.4)'):(dark?'1px solid rgba(255,107,107,.3)':'1.5px solid rgba(255,107,107,.4)'),
                                background:earGuess?.semitones===earInterval?.semitones?(dark?'rgba(20,255,180,.06)':'rgba(20,255,180,.08)'):(dark?'rgba(255,107,107,.06)':'rgba(255,107,107,.08)')}}>
                              <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,
                                color:earGuess?.semitones===earInterval?.semitones?'var(--acc)':'var(--err)',marginBottom:4}}>
                                {earGuess?.semitones===earInterval?.semitones?'✓ Correct!':'✗ Wrong'}
                              </div>
                              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)'}}>
                                The interval was <strong style={{color:'var(--acc)'}}>{earInterval?.name}</strong> ({earInterval?.semitones} semitones)
                              </div>
                            </Motion.div>
                          )}

                          {earPhase==='answered'&&(
                            <div style={{textAlign:'center'}}>
                              <button onClick={startEarRound}
                                style={{padding:'12px 32px',borderRadius:dark?4:10,border:'none',cursor:'pointer',
                                  fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:700,
                                  background:'var(--acc)',color:dark?'#060a09':'#fff',
                                  boxShadow:dark?'0 0 20px rgba(20,255,180,.2)':'0 4px 14px rgba(13,51,32,.2)'}}>
                                Next interval →
                              </button>
                            </div>
                          )}
                        </Motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Interval reference */}
                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>
                      Interval reference — famous examples
                    </div>
                    {[
                      ['P1','Unison',          'Same note repeated'],
                      ['m2','Minor 2nd',       '"Jaws" theme (shark)'],
                      ['M2','Major 2nd',       '"Happy Birthday" (first two notes)'],
                      ['m3','Minor 3rd',       '"Smoke on the Water" riff'],
                      ['M3','Major 3rd',       '"When the Saints Go Marching In"'],
                      ['P4','Perfect 4th',     '"Here Comes the Bride"'],
                      ['TT','Tritone',         '"The Simpsons" theme'],
                      ['P5','Perfect 5th',     '"Star Wars" main theme'],
                      ['m6','Minor 6th',       '"The Entertainer" opening'],
                      ['M6','Major 6th',       '"My Bonnie Lies Over the Ocean"'],
                      ['m7','Minor 7th',       '"Somewhere" (West Side Story)'],
                      ['M7','Major 7th',       '"Take On Me" by A-ha'],
                      ['P8','Octave',          '"Somewhere Over the Rainbow"'],
                    ].map(([abbr,name,ex])=>(
                      <div key={abbr} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 0',borderBottom:dark?'1px solid rgba(20,255,180,.05)':'1px solid var(--bdr)'}}>
                        <span style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--acc4)',width:24}}>{abbr}</span>
                        <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11.5,color:'var(--tx)',width:110}}>{name}</span>
                        <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'var(--txm)',flex:1,fontStyle:'italic'}}>{ex}</span>
                      </div>
                    ))}
                  </div>
                </Motion.div>
              )}

              {/* ═══ NASHVILLE NUMBERS ═══ */}
              {tab==='nashville'&&(
                <Motion.div key="nash" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'18px 20px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
                      <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Fira Code',monospace",fontSize:14,fontWeight:700,color:dark?'#fbbf24':'#92400e',border:dark?'1px solid rgba(251,191,36,.3)':'1.5px solid rgba(146,64,14,.2)',background:dark?'rgba(251,191,36,.07)':'rgba(146,64,14,.04)'}}>1–7</div>
                      <div>
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'var(--tx)'}}>Nashville number system</div>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:'var(--txm)',marginTop:2}}>Chord numbers that work in any key — used by session musicians worldwide</div>
                      </div>
                    </div>

                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:18}}>
                      <div><label className="lbl">Key</label><select className="fi" value={nashKey} onChange={e=>setNashKey(e.target.value)}>{NOTES.map(n=><option key={n}>{n}</option>)}</select></div>
                    </div>

                    {/* Number cards */}
                    <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:5,marginBottom:16}}>
                      {nashNotes.map((chord,i)=>(
                        <div key={i} className={`nash-cell${i===0?' nash-root':''}`}
                          style={{borderRadius:dark?3:8,cursor:'pointer',transition:'all .15s'}}
                          onClick={()=>{
                            const base=NOTES.indexOf(chord.note)+60;
                            const ivs=chord.quality==='min'?[0,3,7]:chord.quality==='dim'?[0,3,6]:chord.quality==='dom7'?[0,4,7,10]:[0,4,7];
                            playChord(ivs.map(iv=>base+iv),40);
                          }}
                          onMouseEnter={e=>e.currentTarget.style.borderColor='var(--acc)'}
                          onMouseLeave={e=>e.currentTarget.style.borderColor=i===0?(dark?'rgba(20,255,180,.35)':'rgba(13,51,32,.4)'):(dark?'var(--bdr)':'var(--bdr)')}>
                          <div style={{fontFamily:"'Fira Code',monospace",fontSize:18,fontWeight:700,
                            color:i===0?'var(--acc)':(dark?'#fbbf24':'#92400e'),lineHeight:1,marginBottom:3}}>
                            {chord.num}
                          </div>
                          <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:2}}>{chord.note}</div>
                          <div style={{fontFamily:"'Fira Code',monospace",fontSize:8,color:'var(--txm)',marginBottom:2}}>{chord.quality}</div>
                        </div>
                      ))}
                    </div>

                    {/* Detail table */}
                    <div style={{overflowX:'auto'}}>
                      <table style={{width:'100%',borderCollapse:'separate',borderSpacing:'0 4px'}}>
                        <thead>
                          <tr>
                            {['#','Note','Quality','Name','Function'].map(h=>(
                              <th key={h} style={{fontFamily:"'Outfit',sans-serif",fontSize:9,fontWeight:600,letterSpacing:'.15em',textTransform:'uppercase',color:'var(--txm)',padding:'4px 10px',textAlign:'left'}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {nashNotes.map((chord,i)=>(
                            <tr key={i} onClick={()=>{
                              const base=NOTES.indexOf(chord.note)+60;
                              const ivs=chord.quality==='min'?[0,3,7]:chord.quality==='dim'?[0,3,6]:chord.quality==='dom7'?[0,4,7,10]:[0,4,7];
                              playChord(ivs.map(iv=>base+iv),40);
                            }} style={{cursor:'pointer'}}>
                              <td style={{fontFamily:"'Fira Code',monospace",fontSize:14,fontWeight:700,padding:'8px 10px',color:dark?'#fbbf24':'#92400e',borderRadius:dark?'3px 0 0 3px':'6px 0 0 6px',background:dark?'rgba(0,0,0,.25)':'rgba(245,251,248,.9)',border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>{chord.num}</td>
                              <td style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,padding:'8px 10px',color:'var(--acc)',background:dark?'rgba(0,0,0,.25)':'rgba(245,251,248,.9)',borderTop:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',borderBottom:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>{chord.note}</td>
                              <td style={{fontFamily:"'Fira Code',monospace",fontSize:10,padding:'8px 10px',color:'var(--acc4)',background:dark?'rgba(0,0,0,.25)':'rgba(245,251,248,.9)',borderTop:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',borderBottom:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>{chord.quality}</td>
                              <td style={{fontFamily:"'Outfit',sans-serif",fontSize:12,padding:'8px 10px',color:'var(--tx)',background:dark?'rgba(0,0,0,.25)':'rgba(245,251,248,.9)',borderTop:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)',borderBottom:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>{chord.name}</td>
                              <td style={{fontFamily:"'Outfit',sans-serif",fontSize:11,padding:'8px 10px',color:'var(--txm)',borderRadius:dark?'0 3px 3px 0':'0 6px 6px 0',background:dark?'rgba(0,0,0,.25)':'rgba(245,251,248,.9)',border:dark?'1px solid var(--bdr)':'1.5px solid var(--bdr)'}}>{chord.fn}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Nashville examples */}
                  <div className="panel" style={{padding:'16px 18px'}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:14,fontWeight:700,color:'var(--tx)',marginBottom:12}}>Famous songs in Nashville numbers</div>
                    {[
                      {title:'Let It Be',        artist:'The Beatles',    nums:'1 – 5 – 6m – 4',      key:'C'},
                      {title:'Sweet Home Alabama',artist:'Lynyrd Skynyrd', nums:'1 – b7 – 4',           key:'D'},
                      {title:'I Will Always Love',artist:'Dolly Parton',   nums:'1 – 4 – 5 – 1',       key:'A'},
                      {title:'Brown Eyed Girl',   artist:'Van Morrison',   nums:'1 – 4 – 1 – 5',       key:'G'},
                      {title:'Autumn Leaves',     artist:'Jazz standard',  nums:'2m – 5 – 1 – 4',      key:'G'},
                      {title:'Stand By Me',       artist:"Ben E. King",    nums:'1 – 6m – 4 – 5',      key:'A'},
                    ].map(s=>(
                      <div key={s.title} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:dark?'1px solid rgba(20,255,180,.05)':'1px solid var(--bdr)'}}>
                        <div style={{flex:1}}>
                          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:600,color:'var(--tx)'}}>{s.title}</div>
                          <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:'var(--txm)'}}>{s.artist}</div>
                        </div>
                        <div style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:dark?'#fbbf24':'#92400e',flex:1}}>{s.nums}</div>
                        <div style={{fontFamily:"'Fira Code',monospace",fontSize:10,color:'var(--acc)',width:20}}>Key of {s.key}</div>
                      </div>
                    ))}
                  </div>
                </Motion.div>
              )}

              {/* ═══ GUIDE ═══ */}
              {tab==='guide'&&(
                <Motion.div key="gu" initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="panel" style={{padding:'22px 24px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:16}}>
                      <div style={{width:34,height:34,borderRadius:dark?3:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,border:dark?'1px solid rgba(20,255,180,.25)':'1.5px solid rgba(13,51,32,.2)',background:dark?'rgba(20,255,180,.06)':'rgba(13,51,32,.04)'}}>📖</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:700,color:'var(--tx)'}}>Music theory — the essential guide</div>
                    </div>
                    <div className="ab">
                      <p>Music theory is the study of how music works. Understanding scales, chords, intervals, and rhythm gives you the tools to compose, improvise, and communicate with other musicians in any genre.</p>
                      <h3>The Nashville Number System</h3>
                      <p>Developed by session musicians in Nashville in the 1950s, the Nashville Number System replaces chord names with numbers (1–7) based on their position in the major scale. A chart written as "1 – 5 – 6m – 4" works in any key — the musicians just need to know what key to play in. It's the fastest way to share chord charts on a gig.</p>
                      <h3>Ear training</h3>
                      <p>Interval recognition is the foundation of ear training. Once you can identify a Perfect 5th (think "Star Wars") or a Minor 3rd ("Smoke on the Water") by ear, you can transcribe melodies, identify chords, and improvise more naturally. Consistency matters more than duration — 5 minutes daily beats an hour once a week.</p>
                      <h3>BPM and rhythm</h3>
                      <p>BPM (beats per minute) determines the tempo of a piece. Musical note durations are always relative to the tempo — a quarter note at 60 BPM lasts exactly 1 second, while at 120 BPM it lasts half a second. This is why delay pedal times are always expressed in milliseconds tied to BPM.</p>
                    </div>
                  </div>
                  <div className="panel" style={{padding:'18px 20px'}}>
                    {[
                      ['What is the Nashville Number System?','The NNS replaces chord names with numbers 1–7 relative to the key. A "1 chord" is always the tonic, "4" is always the subdominant, "5" is the dominant. This lets musicians play charts in any key without rewriting them.'],
                      ['How do I improve my ear training?','Start with easy intervals: the Perfect 5th (very stable, open), Perfect 4th (brass-band sound), and Minor 3rd (the sad interval). Associate each with a song you know. Practice daily with short sessions — quizzing yourself for 5 minutes every day is far more effective than an hour once a week.'],
                      ['Why does BPM matter for delay pedals?','A delay effect set to the tempo of a song sits "in the groove" rhythmically rather than sounding random. A dotted 8th delay (3/4 of a beat) is the classic U2/Edge sound. The formula is: delay time (ms) = 60,000 ÷ BPM × note_value_fraction.'],
                      ['What does transposing do to a song?','Transposing moves all notes up or down by the same number of semitones, preserving the relationship between all the notes (the melody, chords, and harmony stay the same). You might transpose to suit a singer\'s vocal range or to play a song in an easier key.'],
                    ].map(([q,a])=>(
                      <div key={q} className="faq">
                        <div style={{fontFamily:"'Fraunces',serif",fontSize:13.5,fontWeight:600,color:'var(--tx)',marginBottom:5}}>{q}</div>
                        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:'var(--tx2)',lineHeight:1.75}}>{a}</div>
                      </div>
                    ))}
                  </div>
                </Motion.div>
              )}

            </AnimatePresence>
            
          </div>
        </div>
      </div>
    </>
  );
}