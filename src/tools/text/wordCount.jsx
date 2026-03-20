import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
   WORD.count — Word & Character Counter
   Clean Modern · JetBrains Mono + Outfit
   ─────────────────────────────────────────────────────────────────
   TABS:
   ◈ Counter     — Live stats: words, chars, sentences, paragraphs
   ⊞ Density     — Word frequency map + top words chart
   ✦ Readability — Flesch, Gunning Fog, SMOG, ARI scores
   ⏱ Reading     — Reading time, speaking time, typing speed tracker
   ⚙ Goals       — Set word/char targets with animated progress
   ⇄ Compare     — Paste 2 texts, compare stats side by side
   ✂ Tools       — Clean text, remove duplicates, case converter
   ∑ Learn       — Readability guide, writing tips
═══════════════════════════════════════════════════════════════════ */

const S = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{font-family:'Outfit',sans-serif;}

.dk{--bg:#080b0f;--s1:#0d1117;--s2:#131920;--s3:#1a2230;--bdr:#1e2d3d;
  --acc:#38bdf8;--acc2:#0ea5e9;--lo:#4ade80;--er:#f87171;--pur:#c084fc;--warn:#fb923c;
  --tx:#e2eaf4;--tx2:#94a3b8;--tx3:#3d5a78;--tx4:#1e3a52;
  background:var(--bg);color:var(--tx);min-height:100vh;
  background-image:radial-gradient(ellipse 70% 50% at 20% -5%,rgba(56,189,248,.06),transparent 60%),
    radial-gradient(ellipse 50% 40% at 80% 100%,rgba(192,132,252,.04),transparent 60%);}
.lt{--bg:#f0f4f8;--s1:#ffffff;--s2:#e8f0f8;--s3:#dce8f5;--bdr:#c5d8ec;
  --acc:#0369a1;--acc2:#0284c7;--lo:#15803d;--er:#dc2626;--pur:#7c3aed;--warn:#c2410c;
  --tx:#0c1f2e;--tx2:#2d5070;--tx3:#6b90aa;--tx4:#a8c4d8;
  background:var(--bg);color:var(--tx);min-height:100vh;}

/* ── TOPBAR ── */
.topbar{height:52px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 20px;gap:10px;backdrop-filter:blur(24px);}
.dk .topbar{background:rgba(8,11,15,.96);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(240,244,248,.96);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 16px rgba(3,105,161,.07);}

/* ── TABBAR ── */
.tabbar{display:flex;overflow-x:auto;scrollbar-width:none;}
.tabbar::-webkit-scrollbar{display:none;}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:42px;padding:0 16px;border:none;cursor:pointer;background:transparent;
  border-bottom:2px solid transparent;font-family:'JetBrains Mono',monospace;font-size:10px;
  letter-spacing:.07em;text-transform:uppercase;display:flex;align-items:center;gap:6px;white-space:nowrap;transition:all .15s;}
.dk .tab{color:var(--tx3);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(56,189,248,.05);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:var(--tx3);}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(3,105,161,.05);font-weight:600;}
.lt .tab:hover:not(.on){color:var(--tx2);}

/* ── LAYOUT ── */
.body{display:grid;grid-template-columns: 1fr;min-height:calc(100vh - 94px);}
@media(min-width:1024px){.body{grid-template-columns: 220px 1fr !important;}}
.sidebar{padding:16px 13px;display:flex;flex-direction:column;gap:12px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:18px 20px;display:flex;flex-direction:column;gap:16px;overflow-y:auto;}

/* ── PANELS ── */
.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:8px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:14px;box-shadow:0 2px 20px rgba(3,105,161,.06);}
.dk .panel-hi{background:var(--s2);border:1px solid rgba(56,189,248,.3);border-radius:8px;box-shadow:0 0 32px rgba(56,189,248,.07);}
.lt .panel-hi{background:var(--s1);border:1.5px solid rgba(3,105,161,.25);border-radius:14px;box-shadow:0 4px 32px rgba(3,105,161,.1);}
.dk .panel-inset{background:rgba(0,0,0,.35);border:1px solid var(--bdr);border-radius:6px;}
.lt .panel-inset{background:var(--s2);border:1.5px solid var(--bdr);border-radius:10px;}

/* ── BUTTONS ── */
.btn-pri{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 18px;
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.08em;
  text-transform:uppercase;font-weight:500;border:none;transition:all .13s;}
.dk .btn-pri{background:var(--acc);color:#080b0f;border-radius:6px;box-shadow:0 0 20px rgba(56,189,248,.25);}
.dk .btn-pri:hover{background:#7dd3fc;box-shadow:0 0 32px rgba(56,189,248,.4);}
.lt .btn-pri{background:var(--acc);color:#fff;border-radius:10px;box-shadow:0 4px 14px rgba(3,105,161,.3);}
.lt .btn-pri:hover{background:var(--acc2);}
.btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:5px 12px;
  cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.07em;
  text-transform:uppercase;background:transparent;transition:all .12s;}
.dk .btn-ghost{border:1px solid var(--bdr);border-radius:5px;color:var(--tx3);}
.dk .btn-ghost:hover,.dk .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(56,189,248,.07);}
.lt .btn-ghost{border:1.5px solid var(--bdr);border-radius:8px;color:var(--tx3);}
.lt .btn-ghost:hover,.lt .btn-ghost.on{border-color:var(--acc);color:var(--acc);background:rgba(3,105,161,.06);}

/* ── INPUTS ── */
.inp{width:100%;padding:9px 13px;font-family:'JetBrains Mono',monospace;font-size:12px;outline:none;transition:all .13s;}
.dk .inp{background:rgba(0,0,0,.4);border:1px solid var(--bdr);color:var(--tx);border-radius:6px;}
.dk .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(56,189,248,.12);}
.lt .inp{background:#f8fbff;border:1.5px solid var(--bdr);color:var(--tx);border-radius:10px;}
.lt .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(3,105,161,.1);}

.textarea{width:100%;resize:vertical;padding:14px 16px;font-family:'Outfit',sans-serif;font-size:14px;
  line-height:1.75;outline:none;transition:all .13s;}
.dk .textarea{background:rgba(0,0,0,.3);border:1px solid var(--bdr);color:var(--tx);border-radius:8px;}
.dk .textarea:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(56,189,248,.1);}
.lt .textarea{background:#fafcff;border:1.5px solid var(--bdr);color:var(--tx);border-radius:12px;}
.lt .textarea:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(3,105,161,.1);}

/* ── LABELS ── */
.lbl{font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:500;letter-spacing:.22em;
  text-transform:uppercase;display:block;margin-bottom:6px;}
.dk .lbl{color:rgba(56,189,248,.5);}
.lt .lbl{color:var(--acc);}
.sec-lbl{font-family:'JetBrains Mono',monospace;font-size:7.5px;letter-spacing:.24em;text-transform:uppercase;margin-bottom:9px;}
.dk .sec-lbl{color:rgba(56,189,248,.3);}
.lt .sec-lbl{color:var(--acc);}

/* ── HINT ── */
.hint{padding:10px 14px;display:flex;gap:9px;align-items:flex-start;font-size:12.5px;line-height:1.72;}
.dk .hint{border:1px solid rgba(56,189,248,.14);border-radius:7px;background:rgba(56,189,248,.04);border-left:3px solid rgba(56,189,248,.4);color:var(--tx2);}
.lt .hint{border:1.5px solid rgba(3,105,161,.14);border-radius:11px;background:rgba(3,105,161,.04);border-left:3px solid rgba(3,105,161,.3);color:var(--tx2);}

/* ── STAT CARD ── */
.scard{padding:13px 15px;display:flex;flex-direction:column;gap:4px;transition:all .15s;cursor:default;}
.dk .scard{background:rgba(56,189,248,.03);border:1px solid rgba(56,189,248,.1);border-radius:7px;}
.lt .scard{background:rgba(3,105,161,.03);border:1.5px solid rgba(3,105,161,.1);border-radius:11px;}
.dk .scard:hover{border-color:rgba(56,189,248,.25);background:rgba(56,189,248,.06);}
.lt .scard:hover{border-color:rgba(3,105,161,.25);}

/* ── AD ── */
.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(56,189,248,.012);border:1px dashed rgba(56,189,248,.1);border-radius:7px;}
.lt .ad{background:rgba(3,105,161,.025);border:1.5px dashed rgba(3,105,161,.12);border-radius:11px;}
.ad span{font-family:'JetBrains Mono',monospace;font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:var(--tx3);}

/* ── RANGE ── */
.rng{width:100%;height:4px;border-radius:2px;outline:none;cursor:pointer;appearance:none;margin-top:7px;}
.dk .rng{background:rgba(56,189,248,.15);accent-color:var(--acc);}
.lt .rng{background:rgba(3,105,161,.15);accent-color:var(--acc);}

/* ── PROSE ── */
.prose p{font-size:13.5px;line-height:1.85;margin-bottom:12px;color:var(--tx2);}
.prose h3{font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;margin:20px 0 8px;color:var(--tx);text-transform:uppercase;letter-spacing:.05em;}
.prose strong{font-weight:700;color:var(--tx);}
.prose code{font-family:'JetBrains Mono',monospace;font-size:11px;padding:2px 6px;border-radius:4px;}
.dk .prose code{background:rgba(56,189,248,.1);color:var(--acc);}
.lt .prose code{background:rgba(3,105,161,.08);color:var(--acc);}
.qa{padding:13px 16px;margin-bottom:9px;}
.dk .qa{border:1px solid var(--bdr);border-radius:8px;background:rgba(0,0,0,.25);}
.lt .qa{border:1.5px solid var(--bdr);border-radius:12px;background:rgba(3,105,161,.03);}

/* ── WORD FREQ BAR ── */
.freq-bar{display:flex;align-items:center;gap:10px;padding:5px 0;}
.freq-bar-fill{height:6px;border-radius:3px;transition:width .6s cubic-bezier(.4,0,.2,1);}

/* ── TOOL CHIP ── */
.chip{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;
  font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.07em;cursor:pointer;transition:all .13s;}
.dk .chip{background:rgba(56,189,248,.08);border:1px solid rgba(56,189,248,.2);color:var(--acc);}
.dk .chip:hover{background:rgba(56,189,248,.15);}
.lt .chip{background:rgba(3,105,161,.08);border:1.5px solid rgba(3,105,161,.2);color:var(--acc);}
.lt .chip:hover{background:rgba(3,105,161,.15);}

/* ── SCORE BADGE ── */
.score-badge{display:inline-flex;align-items:center;justify-content:center;
  width:52px;height:52px;border-radius:50%;font-family:'Outfit',sans-serif;font-weight:800;font-size:18px;}

/* ── COMPARE ── */
.cmp-col{display:flex;flex-direction:column;gap:10px;}

/* ── MOBILE ── */
@media(max-width:768px){
  .body{grid-template-columns:1fr!important;}
  .sidebar{display:none!important;}
  .sidebar.mob{display:flex!important;position:fixed;left:0;top:94px;bottom:0;width:252px;z-index:300;box-shadow:4px 0 28px rgba(0,0,0,.5);}
  .mob-btn{display:flex!important;}
  .mob-overlay{display:none;position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.6);}
  .mob-overlay.show{display:block;}
  .topbar{padding:0 14px;}
  .main{padding:12px;}
}
@media(min-width:769px){.mob-btn{display:none!important;}}
@media(max-width:560px){.g2{grid-template-columns:1fr!important;}.g3{grid-template-columns:1fr 1fr!important;}}
`;

/* ─── TABS ─────────────────────────────────────────────────────── */
const TABS = [
  { id:'counter',    icon:'◈',  label:'Counter' },
  { id:'density',    icon:'⊞',  label:'Density' },
  { id:'readability',icon:'✦',  label:'Readability' },
  { id:'reading',    icon:'⏱',  label:'Reading' },
  { id:'goals',      icon:'⚙',  label:'Goals' },
  { id:'compare',    icon:'⇄',  label:'Compare' },
  { id:'tools',      icon:'✂',  label:'Tools' },
  { id:'learn',      icon:'∑',  label:'Learn' },
];

/* ─── ANALYSIS ENGINE ───────────────────────────────────────────── */
const analyze = (text) => {
  if (!text.trim()) return {
    chars: 0, charsNoSpace: 0, words: 0, sentences: 0, paragraphs: 0,
    lines: 0, uniqueWords: 0, avgWordLen: 0, avgSentenceLen: 0,
    longestWord: '', shortestWord: '', syllables: 0, freq: [], topWords: [],
  };

  const chars         = text.length;
  const charsNoSpace  = text.replace(/\s/g, '').length;
  const lines         = text.split('\n').length;
  const paragraphs    = text.split(/\n\s*\n/).filter(p => p.trim()).length || 1;
  const sentences     = (text.match(/[^.!?]*[.!?]+/g) || []).length || 1;

  // Words
  const rawWords = text.match(/\b[a-zA-Z''-]+\b/g) || [];
  const words    = rawWords.length;

  // Unique
  const wordLower   = rawWords.map(w => w.toLowerCase().replace(/^'+|'+$/g, ''));
  const uniqueWords = new Set(wordLower).size;

  // Freq map (exclude stop words for density)
  const STOP = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','up','about','into','through','during','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','that','this','these','those','i','you','he','she','it','we','they','what','which','who','whom','as','if','then','than','so','yet','both','either','not','no','nor']);
  const freqMap = {};
  wordLower.forEach(w => { if (w.length > 2 && !STOP.has(w)) freqMap[w] = (freqMap[w] || 0) + 1; });
  const freq = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);
  const topWords = freq.slice(0, 20);

  // Avg word length
  const avgWordLen = words > 0 ? rawWords.reduce((s, w) => s + w.length, 0) / words : 0;
  const avgSentenceLen = sentences > 0 ? words / sentences : 0;

  // Longest/shortest word
  const sorted = [...rawWords].sort((a, b) => b.length - a.length);
  const longestWord  = sorted[0] || '';
  const shortestWord = [...rawWords].sort((a, b) => a.length - b.length)[0] || '';

  // Syllable count (approximate)
  const countSyllables = w => {
    w = w.toLowerCase().replace(/[^a-z]/g, '');
    if (w.length <= 3) return 1;
    w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    w = w.replace(/^y/, '');
    const m = w.match(/[aeiouy]{1,2}/g);
    return m ? m.length : 1;
  };
  const syllables = rawWords.reduce((s, w) => s + countSyllables(w), 0);

  return { chars, charsNoSpace, words, sentences, paragraphs, lines, uniqueWords,
    avgWordLen, avgSentenceLen, longestWord, shortestWord, syllables, freq, topWords };
};

/* ─── READABILITY SCORES ─────────────────────────────────────────── */
const readabilityScores = (stats) => {
  const { words, sentences, syllables, avgWordLen } = stats;
  if (!words || !sentences) return null;
  const asl = words / sentences;      // avg sentence length
  const asw = syllables / words;      // avg syllables per word

  // Flesch Reading Ease (0–100, higher = easier)
  const flesch = 206.835 - 1.015 * asl - 84.6 * asw;

  // Flesch-Kincaid Grade Level
  const fkGrade = 0.39 * asl + 11.8 * asw - 15.59;

  // Gunning Fog Index — need complex words (3+ syllables)
  // approximate: words with 3+ syllables
  const fog = 0.4 * (asl + 0);  // simplified

  // SMOG (simplified)
  const smog = 3 + Math.sqrt(syllables / sentences * 30);

  // ARI (Automated Readability Index)
  const ari = 4.71 * avgWordLen + 0.5 * asl - 21.43;

  // Coleman-Liau
  const cl = 0.0588 * (stats.charsNoSpace / words * 100) - 0.296 * (sentences / words * 100) - 15.8;

  return {
    flesch:   Math.max(0, Math.min(100, +flesch.toFixed(1))),
    fkGrade:  Math.max(0, +fkGrade.toFixed(1)),
    smog:     Math.max(0, +smog.toFixed(1)),
    ari:      Math.max(0, +ari.toFixed(1)),
    cl:       Math.max(0, +cl.toFixed(1)),
  };
};

const fleschLabel = (score) => {
  if (score >= 90) return { label: 'Very Easy', color: '#4ade80' };
  if (score >= 80) return { label: 'Easy', color: '#86efac' };
  if (score >= 70) return { label: 'Fairly Easy', color: '#a3e635' };
  if (score >= 60) return { label: 'Standard', color: '#facc15' };
  if (score >= 50) return { label: 'Fairly Difficult', color: '#fb923c' };
  if (score >= 30) return { label: 'Difficult', color: '#f87171' };
  return { label: 'Very Confusing', color: '#e879f9' };
};

const gradeLabel = (g) => {
  if (g <= 6)  return 'Elementary';
  if (g <= 8)  return 'Middle School';
  if (g <= 12) return 'High School';
  if (g <= 16) return 'College';
  return 'Graduate+';
};

/* ─── READING TIME ───────────────────────────────────────────────── */
const readingTime = (words, wpm = 238) => {
  const mins = words / wpm;
  if (mins < 1) return `${Math.round(mins * 60)}s`;
  return `${Math.floor(mins)}m ${Math.round((mins % 1) * 60)}s`;
};

/* ─── TEXT TOOLS ─────────────────────────────────────────────────── */
const textTools = {
  'UPPERCASE':        t => t.toUpperCase(),
  'lowercase':        t => t.toLowerCase(),
  'Title Case':       t => t.replace(/\b\w/g, c => c.toUpperCase()),
  'Sentence case':    t => t.replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()),
  'Remove extra spaces': t => t.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim(),
  'Remove blank lines':  t => t.split('\n').filter(l => l.trim()).join('\n'),
  'Remove numbers':    t => t.replace(/\d+/g, ''),
  'Remove punctuation':t => t.replace(/[^\w\s]/g, ''),
  'Reverse text':      t => t.split('').reverse().join(''),
  'Reverse words':     t => t.split(/\s+/).reverse().join(' '),
  'Sort lines A→Z':    t => t.split('\n').sort().join('\n'),
  'Remove duplicates': t => [...new Set(t.split('\n'))].join('\n'),
  'Trim each line':    t => t.split('\n').map(l => l.trim()).join('\n'),
  'Add line numbers':  t => t.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n'),
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function WordCounter() {
  const [dark, setDark]   = useState(true);
  const [tab,  setTab]    = useState('counter');
  const [mob,  setMob]    = useState(false);

  /* Main text */
  const [text, setText]   = useState('');
  const [copied, setCopied] = useState(false);

  /* Goals */
  const [goalWords, setGoalWords]   = useState(500);
  const [goalChars, setGoalChars]   = useState(2500);
  const [goalType,  setGoalType]    = useState('words'); // 'words'|'chars'

  /* Reading speed */
  const [wpm,   setWpm]   = useState(238);
  const [swpm,  setSwpm]  = useState(130); // speaking wpm
  const [twpm,  setTwpm]  = useState(40);  // typing wpm

  /* Compare */
  const [textB, setTextB] = useState('');

  /* Tools */
  const [toolResult, setToolResult] = useState('');
  const [toolCopied, setToolCopied] = useState(false);

  /* Density filter */
  const [densitySort, setDensitySort] = useState('freq'); // 'freq'|'alpha'

  const dk = dark;
  const textareaRef = useRef(null);

  /* ── Analysis ── */
  const stats  = useMemo(() => analyze(text), [text]);
  const statsB = useMemo(() => analyze(textB), [textB]);
  const rdbl   = useMemo(() => readabilityScores(stats), [stats]);

  /* ── Density display ── */
  const densityWords = useMemo(() => {
    let words = [...stats.freq];
    if (densitySort === 'alpha') words = words.sort((a, b) => a[0].localeCompare(b[0]));
    return words.slice(0, 40);
  }, [stats.freq, densitySort]);

  const maxFreq = densityWords[0]?.[1] || 1;

  /* ── Copy ── */
  const copyText = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  /* ── Apply tool ── */
  const applyTool = (toolName) => {
    const fn = textTools[toolName];
    if (fn) setToolResult(fn(text));
  };

  const copyToolResult = () => {
    navigator.clipboard.writeText(toolResult).then(() => { setToolCopied(true); setTimeout(() => setToolCopied(false), 2000); });
  };

  const applyToMain = () => {
    setText(toolResult);
    setToolResult('');
    setTab('counter');
  };

  /* ── Goal progress ── */
  const goalProgress = useMemo(() => {
    const current = goalType === 'words' ? stats.words : stats.chars;
    const goal    = goalType === 'words' ? goalWords    : goalChars;
    return Math.min(100, (current / (goal || 1)) * 100);
  }, [stats, goalType, goalWords, goalChars]);

  /* ── Sidebar stats ── */
  const sideStats = [
    { label: 'Words',      val: stats.words.toLocaleString(),             color: 'var(--acc)' },
    { label: 'Characters', val: stats.chars.toLocaleString(),             color: 'var(--lo)' },
    { label: 'Sentences',  val: stats.sentences.toLocaleString(),         color: 'var(--pur)' },
    { label: 'Paragraphs', val: stats.paragraphs.toLocaleString(),        color: 'var(--warn)' },
    { label: 'Read Time',  val: readingTime(stats.words, wpm),            color: 'var(--acc)' },
    { label: 'Unique Words', val: stats.uniqueWords.toLocaleString(),     color: 'var(--lo)' },
  ];

  /* ══════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{S}</style>
      <div className={dk ? 'dk' : 'lt'}>
        <div className={`mob-overlay ${mob ? 'show' : ''}`} onClick={() => setMob(false)}/>

        {/* ════ TOPBAR ════ */}
        <div className="topbar">
          <button className="btn-ghost mob-btn" onClick={() => setMob(s => !s)} style={{ padding: '5px 9px', fontSize: 14 }}>☰</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: dk ? 6 : 10,
              background: dk ? 'rgba(56,189,248,.1)' : 'linear-gradient(135deg,#0369a1,#0ea5e9)',
              border: dk ? '1px solid rgba(56,189,248,.3)' : 'none',
              boxShadow: dk ? '0 0 20px rgba(56,189,248,.2)' : '0 3px 12px rgba(3,105,161,.4)' }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 14, color: dk ? '#38bdf8' : '#fff' }}>W</span>
            </div>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 17, letterSpacing: '-.02em', color: 'var(--tx)' }}>
              WORD<span style={{ color: 'var(--acc)' }}>.count</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 400, fontSize: 8, letterSpacing: '.18em', color: 'var(--tx3)', marginLeft: 8, verticalAlign: 'middle' }}>v1</span>
            </span>
          </div>
          <div style={{ flex: 1 }}/>

          {/* Live word count pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px',
            borderRadius: 20, border: dk ? '1px solid rgba(56,189,248,.2)' : '1.5px solid rgba(3,105,161,.2)',
            background: dk ? 'rgba(56,189,248,.06)' : 'rgba(3,105,161,.05)' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--acc)', fontWeight: 700 }}>
              {stats.words.toLocaleString()}
            </span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'var(--tx3)', letterSpacing: '.1em' }}>WORDS</span>
          </div>

          <button className="btn-ghost" onClick={() => setDark(d => !d)} style={{ padding: '5px 10px', fontSize: 13 }}>
            {dk ? '☀' : '◑'}
          </button>
        </div>

        {/* ════ TABBAR ════ */}
        <div className="tabbar">
          {TABS.map(t => (
            <button key={t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {/* ════ BODY ════ */}
        <div className="body">
          {/* ── SIDEBAR ── */}
          <div className={`sidebar ${mob ? 'mob' : ''}`}>
            <div className="sec-lbl">Live Stats</div>
            {sideStats.map((s, i) => (
              <div key={i} className="scard">
                <div className="lbl" style={{ margin: 0 }}>{s.label}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 17, color: s.color }}>{s.val}</div>
              </div>
            ))}

            

            {/* Goal mini-progress */}
            {(goalWords > 0 || goalChars > 0) && (
              <>
                <div className="sec-lbl" style={{ marginTop: 4 }}>Goal Progress</div>
                <div className="scard">
                  <div className="lbl" style={{ margin: 0 }}>{goalType === 'words' ? `${stats.words} / ${goalWords} words` : `${stats.chars} / ${goalChars} chars`}</div>
                  <div style={{ height: 6, background: 'var(--bdr)', borderRadius: 3, marginTop: 6, overflow: 'hidden' }}>
                    <motion.div style={{ height: '100%', borderRadius: 3,
                      background: goalProgress >= 100 ? 'var(--lo)' : 'var(--acc)' }}
                      animate={{ width: `${goalProgress}%` }} transition={{ duration: 0.4 }}/>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: goalProgress >= 100 ? 'var(--lo)' : 'var(--tx3)', marginTop: 4 }}>
                    {goalProgress >= 100 ? '✓ Goal reached!' : `${goalProgress.toFixed(0)}%`}
                  </div>
                </div>
              </>
            )}

            
          </div>

          {/* ── MAIN ── */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══════════ COUNTER TAB ══════════ */}
              {tab === 'counter' && (
                <motion.div key="ctr" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                  

                  {/* Textarea */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                      <div className="lbl" style={{ margin: 0 }}>Your Text</div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn-ghost" onClick={() => setText('')} style={{ fontSize: 8.5 }}>✕ Clear</button>
                        <button className="btn-ghost" onClick={copyText} style={{ fontSize: 8.5 }}>{copied ? '✓ Copied' : '⎘ Copy'}</button>
                      </div>
                    </div>
                    <textarea
                      className="textarea"
                      rows={12}
                      placeholder="Start typing or paste your text here… Stats update in real time."
                      value={text}
                      onChange={e => setText(e.target.value)}
                      ref={textareaRef}
                    />
                  </div>

                  {/* Big stat grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
                    {[
                      { label: 'Words',              val: stats.words,           color: 'var(--acc)' },
                      { label: 'Characters',         val: stats.chars,           color: 'var(--lo)' },
                      { label: 'No Spaces',          val: stats.charsNoSpace,    color: 'var(--pur)' },
                      { label: 'Sentences',          val: stats.sentences,       color: 'var(--warn)' },
                      { label: 'Paragraphs',         val: stats.paragraphs,      color: 'var(--acc)' },
                      { label: 'Lines',              val: stats.lines,           color: 'var(--lo)' },
                      { label: 'Unique Words',       val: stats.uniqueWords,     color: 'var(--pur)' },
                      { label: 'Syllables',          val: stats.syllables,       color: 'var(--warn)' },
                    ].map((s, i) => (
                      <motion.div key={i} className="panel-hi" style={{ padding: '14px 16px', textAlign: 'center' }}
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
                        <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 26, color: s.color }}>
                          {s.val.toLocaleString()}
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8.5, color: 'var(--tx3)', letterSpacing: '.12em', marginTop: 3, textTransform: 'uppercase' }}>
                          {s.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Extended stats */}
                  <div className="panel" style={{ padding: '18px 20px' }}>
                    <div className="lbl" style={{ marginBottom: 12 }}>Detailed Analysis</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }} className="g3">
                      {[
                        { label: 'Avg Word Length',    val: stats.avgWordLen.toFixed(1) + ' chars' },
                        { label: 'Avg Sentence Length', val: stats.avgSentenceLen.toFixed(1) + ' words' },
                        { label: 'Longest Word',       val: stats.longestWord || '—' },
                        { label: 'Shortest Word',      val: stats.shortestWord || '—' },
                        { label: 'Read Time',          val: readingTime(stats.words, wpm) },
                        { label: 'Speak Time',         val: readingTime(stats.words, swpm) },
                      ].map((s, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'var(--tx3)', letterSpacing: '.15em', textTransform: 'uppercase' }}>{s.label}</div>
                          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--tx2)' }}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ DENSITY TAB ══════════ */}
              {tab === 'density' && (
                <motion.div key="den" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="hint"><span>⊞</span><span>Word frequency analysis — stop words (the, and, is…) are excluded. Most frequent meaningful words shown first.</span></div>

                  {!stats.words ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: 'var(--tx3)' }}>
                      Add text in the ◈ Counter tab to see word frequency.
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--tx3)', letterSpacing: '.1em' }}>SORT:</span>
                        {[['freq', 'By Frequency'], ['alpha', 'A → Z']].map(([v, l]) => (
                          <button key={v} className={`btn-ghost ${densitySort === v ? 'on' : ''}`} onClick={() => setDensitySort(v)}>{l}</button>
                        ))}
                        <div style={{ flex: 1 }}/>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--tx3)' }}>
                          {stats.freq.length} unique meaningful words
                        </div>
                      </div>

                      {/* Top word visual bars */}
                      <div className="panel" style={{ padding: '18px 20px' }}>
                        <div className="lbl" style={{ marginBottom: 14 }}>Top 20 Words</div>
                        {densityWords.slice(0, 20).map(([word, count], i) => (
                          <motion.div key={word} className="freq-bar"
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                            <div style={{ width: 130, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--tx2)', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {word}
                            </div>
                            <div style={{ flex: 1, height: 6, background: 'var(--bdr)', borderRadius: 3, overflow: 'hidden' }}>
                              <motion.div className="freq-bar-fill"
                                style={{ background: `hsl(${200 + i * 8}, 80%, ${dk ? 55 : 40}%)` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${(count / maxFreq) * 100}%` }}
                                transition={{ duration: 0.5, delay: i * 0.02 }}/>
                            </div>
                            <div style={{ width: 32, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--tx3)', textAlign: 'right', flexShrink: 0 }}>
                              {count}
                            </div>
                            <div style={{ width: 42, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--tx3)', textAlign: 'right', flexShrink: 0 }}>
                              {((count / stats.words) * 100).toFixed(1)}%
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* All words grid */}
                      {densityWords.length > 20 && (
                        <div className="panel" style={{ padding: '16px 18px' }}>
                          <div className="lbl" style={{ marginBottom: 12 }}>All Meaningful Words</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                            {densityWords.map(([word, count], i) => (
                              <div key={word} className="chip">
                                {word} <span style={{ opacity: 0.6 }}>×{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  
                </motion.div>
              )}

              {/* ══════════ READABILITY TAB ══════════ */}
              {tab === 'readability' && (
                <motion.div key="rdb" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="hint"><span>✦</span><span>Readability scores estimate how easy your text is to read. Scores are approximate — they work best on prose with 100+ words.</span></div>

                  {!stats.words || stats.words < 10 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: 'var(--tx3)' }}>
                      Add at least 10 words in the ◈ Counter tab for readability scores.
                    </div>
                  ) : rdbl && (
                    <>
                      {/* Flesch hero */}
                      <div className="panel-hi" style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div className="score-badge" style={{
                          background: dk ? `rgba(56,189,248,.1)` : `rgba(3,105,161,.1)`,
                          border: `3px solid ${fleschLabel(rdbl.flesch).color}`,
                          color: fleschLabel(rdbl.flesch).color,
                          flexShrink: 0,
                        }}>
                          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                            {rdbl.flesch}
                          </motion.span>
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 20, color: fleschLabel(rdbl.flesch).color }}>
                            {fleschLabel(rdbl.flesch).label}
                          </div>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--tx3)', letterSpacing: '.1em', marginTop: 4 }}>
                            FLESCH READING EASE · 0 (hardest) → 100 (easiest)
                          </div>
                          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: 'var(--tx2)', marginTop: 6 }}>
                            Suitable for: <strong style={{ color: 'var(--tx)' }}>{fleschLabel(rdbl.flesch).label === 'Very Easy' ? 'Ages 11+' : fleschLabel(rdbl.flesch).label === 'Easy' ? 'Ages 13+' : fleschLabel(rdbl.flesch).label === 'Standard' ? 'Ages 15+' : 'College+'}</strong>
                          </div>
                        </div>
                        {/* Flesch bar */}
                        <div style={{ flex: 1, minWidth: 100 }}>
                          <div style={{ height: 10, background: 'var(--bdr)', borderRadius: 5, overflow: 'hidden' }}>
                            <motion.div style={{ height: '100%', borderRadius: 5, background: `linear-gradient(90deg,var(--er),var(--warn),var(--lo))` }}
                              initial={{ width: 0 }} animate={{ width: `${rdbl.flesch}%` }} transition={{ duration: 0.9 }}/>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'var(--tx3)', marginTop: 4 }}>
                            <span>0 Hard</span><span>100 Easy</span>
                          </div>
                        </div>
                      </div>

                      {/* Other scores */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }} className="g2">
                        {[
                          { label: 'Flesch-Kincaid Grade', val: rdbl.fkGrade, sub: gradeLabel(rdbl.fkGrade), color: 'var(--pur)', desc: 'US grade level required to understand the text' },
                          { label: 'SMOG Grade',           val: rdbl.smog,    sub: gradeLabel(rdbl.smog),    color: 'var(--warn)', desc: 'Years of education needed (best for health texts)' },
                          { label: 'ARI Score',            val: rdbl.ari,     sub: gradeLabel(rdbl.ari),     color: 'var(--acc)', desc: 'Automated Readability Index based on chars/words' },
                          { label: 'Coleman-Liau',         val: rdbl.cl,      sub: gradeLabel(rdbl.cl),      color: 'var(--lo)', desc: 'Based on characters rather than syllables' },
                        ].map((s, i) => (
                          <motion.div key={i} className="panel" style={{ padding: '16px 18px' }}
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                            <div className="lbl" style={{ margin: 0 }}>{s.label}</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
                              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 30, color: s.color }}>{s.val}</div>
                              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--tx3)' }}>{s.sub}</div>
                            </div>
                            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: 'var(--tx3)', marginTop: 6, lineHeight: 1.5 }}>{s.desc}</div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Text stats that drive scores */}
                      <div className="panel" style={{ padding: '16px 18px' }}>
                        <div className="lbl" style={{ marginBottom: 12 }}>Key Metrics Behind the Scores</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                          {[
                            { label: 'Avg Sentence Length', val: stats.avgSentenceLen.toFixed(1) + ' words', note: '< 20 is ideal' },
                            { label: 'Avg Word Length',     val: stats.avgWordLen.toFixed(1) + ' chars',    note: '< 5 is simple' },
                            { label: 'Syllables/Word',      val: (stats.syllables / (stats.words || 1)).toFixed(2),  note: '< 1.5 is easy' },
                          ].map((s, i) => (
                            <div key={i}>
                              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'var(--tx3)', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
                              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--tx)' }}>{s.val}</div>
                              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--tx3)', marginTop: 2 }}>{s.note}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  
                </motion.div>
              )}

              {/* ══════════ READING TAB ══════════ */}
              {tab === 'reading' && (
                <motion.div key="rdg" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="hint"><span>⏱</span><span>Adjust reading, speaking, and typing speeds to get accurate time estimates for your text.</span></div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="g2">
                    {/* Speeds */}
                    <div className="panel" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--tx)', letterSpacing: '.06em' }}>SPEED SETTINGS</div>
                      <div>
                        <div className="lbl">Reading Speed — {wpm} WPM</div>
                        <input className="rng" type="range" min={100} max={700} step={10} value={wpm} onChange={e => setWpm(+e.target.value)}/>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'var(--tx3)', marginTop: 4 }}>
                          <span>100 (slow)</span><span>238 (avg)</span><span>700 (speed read)</span>
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                          {[{ l: 'Slow', v: 150 }, { l: 'Average', v: 238 }, { l: 'Fast', v: 400 }, { l: 'Speed', v: 600 }].map(p => (
                            <button key={p.v} className={`btn-ghost ${wpm === p.v ? 'on' : ''}`} onClick={() => setWpm(p.v)} style={{ fontSize: 8.5 }}>{p.l}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="lbl">Speaking Speed — {swpm} WPM</div>
                        <input className="rng" type="range" min={80} max={220} step={5} value={swpm} onChange={e => setSwpm(+e.target.value)}/>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'var(--tx3)', marginTop: 4 }}>
                          <span>80 (slow)</span><span>130 (avg)</span><span>220 (fast)</span>
                        </div>
                      </div>
                      <div>
                        <div className="lbl">Typing Speed — {twpm} WPM</div>
                        <input className="rng" type="range" min={10} max={200} step={5} value={twpm} onChange={e => setTwpm(+e.target.value)}/>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'var(--tx3)', marginTop: 4 }}>
                          <span>10</span><span>40 (avg)</span><span>200 (expert)</span>
                        </div>
                      </div>
                    </div>

                    {/* Results */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { icon: '👁', label: 'Reading Time',  val: readingTime(stats.words, wpm),  sub: `@ ${wpm} WPM`, color: 'var(--acc)' },
                        { icon: '🎙', label: 'Speaking Time', val: readingTime(stats.words, swpm), sub: `@ ${swpm} WPM`, color: 'var(--pur)' },
                        { icon: '⌨',  label: 'Typing Time',  val: readingTime(stats.words, twpm), sub: `@ ${twpm} WPM`, color: 'var(--warn)' },
                      ].map((s, i) => (
                        <motion.div key={i} className="panel-hi" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}
                          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                          <div style={{ fontSize: 28 }}>{s.icon}</div>
                          <div>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--tx3)', letterSpacing: '.14em', textTransform: 'uppercase' }}>{s.label}</div>
                            <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 28, color: s.color }}>{s.val}</div>
                            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--tx3)' }}>{s.sub} · {stats.words.toLocaleString()} words</div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Page count */}
                      <div className="panel" style={{ padding: '14px 18px' }}>
                        <div className="lbl" style={{ margin: '0 0 10px' }}>Equivalent Pages</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          {[
                            { label: 'Single-spaced', wpp: 500 },
                            { label: 'Double-spaced', wpp: 250 },
                            { label: 'A4 (standard)', wpp: 400 },
                            { label: 'Tweet (280c)',  wpp: null, val: Math.ceil(stats.chars / 280) },
                          ].map((p, i) => (
                            <div key={i}>
                              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'var(--tx3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>{p.label}</div>
                              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 18, color: 'var(--tx2)', marginTop: 2 }}>
                                {p.val ?? (stats.words / p.wpp).toFixed(1)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ GOALS TAB ══════════ */}
              {tab === 'goals' && (
                <motion.div key="gls" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="hint"><span>⚙</span><span>Set a word or character target and track your progress in real time with an animated progress ring.</span></div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="g2">
                    {/* Goal config */}
                    <div className="panel" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--tx)', letterSpacing: '.06em' }}>SET YOUR GOAL</div>
                      <div>
                        <div className="lbl">Goal Type</div>
                        <div style={{ display: 'flex', gap: 7 }}>
                          {[['words', 'Word Count'], ['chars', 'Character Count']].map(([v, l]) => (
                            <button key={v} className={`btn-ghost ${goalType === v ? 'on' : ''}`} onClick={() => setGoalType(v)}>{l}</button>
                          ))}
                        </div>
                      </div>
                      {goalType === 'words' ? (
                        <div>
                          <div className="lbl">Word Goal — {goalWords.toLocaleString()}</div>
                          <input className="inp" type="number" value={goalWords} onChange={e => setGoalWords(+e.target.value)} min={1}/>
                          <input className="rng" type="range" min={100} max={10000} step={100} value={goalWords} onChange={e => setGoalWords(+e.target.value)}/>
                          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                            {[100, 250, 500, 1000, 1500, 2000, 5000].map(g => (
                              <button key={g} className={`btn-ghost ${goalWords === g ? 'on' : ''}`} onClick={() => setGoalWords(g)} style={{ fontSize: 8.5 }}>{g}</button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="lbl">Character Goal — {goalChars.toLocaleString()}</div>
                          <input className="inp" type="number" value={goalChars} onChange={e => setGoalChars(+e.target.value)} min={1}/>
                          <input className="rng" type="range" min={100} max={50000} step={100} value={goalChars} onChange={e => setGoalChars(+e.target.value)}/>
                        </div>
                      )}

                      {/* Preset goals */}
                      <div>
                        <div className="lbl">Common Writing Goals</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {[
                            { label: 'Tweet',          words: 50,   chars: 280 },
                            { label: 'LinkedIn post',  words: 150,  chars: 700 },
                            { label: 'Blog post',      words: 1000, chars: 5500 },
                            { label: 'Short article',  words: 600,  chars: 3300 },
                            { label: 'Essay (5 pages)', words: 1500, chars: 8000 },
                            { label: 'Short story',   words: 7500,  chars: 40000 },
                          ].map((p, i) => (
                            <button key={i} className="btn-ghost" style={{ justifyContent: 'space-between', fontSize: 9.5 }}
                              onClick={() => { setGoalWords(p.words); setGoalChars(p.chars); }}>
                              <span>{p.label}</span>
                              <span style={{ opacity: 0.6 }}>{p.words.toLocaleString()} words</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Progress ring */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                      {/* SVG Ring */}
                      <div className="panel-hi" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%' }}>
                        {(() => {
                          const R = 80, CX = 100, CY = 100, SW = 16;
                          const circum = 2 * Math.PI * R;
                          const prog = goalProgress;
                          const color = prog >= 100 ? 'var(--lo)' : prog > 60 ? 'var(--acc)' : prog > 30 ? 'var(--warn)' : 'var(--er)';
                          const current = goalType === 'words' ? stats.words : stats.chars;
                          const goal    = goalType === 'words' ? goalWords    : goalChars;
                          return (
                            <svg viewBox="0 0 200 200" style={{ width: 180, height: 180 }}>
                              <circle cx={CX} cy={CY} r={R} fill="none" stroke={dk ? 'rgba(56,189,248,.08)' : 'rgba(3,105,161,.1)'} strokeWidth={SW}/>
                              <motion.circle cx={CX} cy={CY} r={R} fill="none" stroke={color} strokeWidth={SW}
                                strokeLinecap="round"
                                strokeDasharray={`${(prog / 100) * circum} ${circum}`}
                                strokeDashoffset={circum * 0.25}
                                initial={{ strokeDasharray: `0 ${circum}` }}
                                animate={{ strokeDasharray: `${(prog / 100) * circum} ${circum}` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                key={prog}
                              />
                              <text x={CX} y={CY - 14} textAnchor="middle" fontFamily="'Outfit',sans-serif" fontWeight="900" fontSize="28" fill={color}>
                                {prog.toFixed(0)}%
                              </text>
                              <text x={CX} y={CY + 8} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="9" fill="var(--tx3)" letterSpacing=".1em">
                                {current.toLocaleString()} / {goal.toLocaleString()}
                              </text>
                              <text x={CX} y={CY + 22} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize="8" fill="var(--tx3)">
                                {goalType.toUpperCase()}
                              </text>
                              {prog >= 100 && (
                                <text x={CX} y={CY + 40} textAnchor="middle" fontFamily="'Outfit',sans-serif" fontSize="11" fill="var(--lo)" fontWeight="700">
                                  ✓ GOAL REACHED!
                                </text>
                              )}
                            </svg>
                          );
                        })()}

                        {goalType === 'words' && goalWords > stats.words && (
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--tx3)', textAlign: 'center' }}>
                            {(goalWords - stats.words).toLocaleString()} words remaining · ~{readingTime(goalWords - stats.words, twpm)} to type
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ COMPARE TAB ══════════ */}
              {tab === 'compare' && (
                <motion.div key="cmp" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="hint"><span>⇄</span><span>Paste two texts to compare their statistics side by side — useful for comparing drafts, documents, or writing styles.</span></div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="g2">
                    <div>
                      <div className="lbl" style={{ color: 'var(--acc)' }}>Text A</div>
                      <textarea className="textarea" rows={8}
                        placeholder="Paste Text A here…" value={text}
                        onChange={e => setText(e.target.value)}/>
                    </div>
                    <div>
                      <div className="lbl" style={{ color: 'var(--pur)' }}>Text B</div>
                      <textarea className="textarea" rows={8}
                        placeholder="Paste Text B here…" value={textB}
                        onChange={e => setTextB(e.target.value)}/>
                    </div>
                  </div>

                  {/* Comparison table */}
                  <div className="panel" style={{ padding: '18px 20px', overflowX: 'auto' }}>
                    <div className="lbl" style={{ marginBottom: 14 }}>Side-by-Side Comparison</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>
                      <thead>
                        <tr>
                          {['Metric', 'Text A', 'Text B', 'Δ Diff'].map((h, i) => (
                            <th key={i} style={{ padding: '8px 14px', textAlign: i === 0 ? 'left' : 'right',
                              fontSize: 8, letterSpacing: '.14em', textTransform: 'uppercase',
                              color: i === 0 ? 'var(--tx3)' : i === 1 ? 'var(--acc)' : i === 2 ? 'var(--pur)' : 'var(--tx3)',
                              borderBottom: '1px solid var(--bdr)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { label: 'Words',         a: stats.words,         b: statsB.words,         fmt: n => n.toLocaleString() },
                          { label: 'Characters',    a: stats.chars,         b: statsB.chars,         fmt: n => n.toLocaleString() },
                          { label: 'Sentences',     a: stats.sentences,     b: statsB.sentences,     fmt: n => n.toLocaleString() },
                          { label: 'Paragraphs',    a: stats.paragraphs,    b: statsB.paragraphs,    fmt: n => n.toLocaleString() },
                          { label: 'Unique Words',  a: stats.uniqueWords,   b: statsB.uniqueWords,   fmt: n => n.toLocaleString() },
                          { label: 'Avg Word Len',  a: stats.avgWordLen,    b: statsB.avgWordLen,    fmt: n => n.toFixed(2) },
                          { label: 'Avg Sent Len',  a: stats.avgSentenceLen,b: statsB.avgSentenceLen,fmt: n => n.toFixed(1) },
                          { label: 'Read Time',     a: stats.words,         b: statsB.words,         fmt: n => readingTime(n, wpm), diff: false },
                        ].map((row, i) => {
                          const diff = row.diff === false ? null : row.a - row.b;
                          return (
                            <tr key={i}>
                              <td style={{ padding: '7px 14px', color: 'var(--tx3)', fontSize: 9.5, letterSpacing: '.08em', textTransform: 'uppercase', borderBottom: '1px solid var(--bdr)' }}>{row.label}</td>
                              <td style={{ padding: '7px 14px', textAlign: 'right', color: 'var(--acc)', borderBottom: '1px solid var(--bdr)' }}>{row.fmt(row.a)}</td>
                              <td style={{ padding: '7px 14px', textAlign: 'right', color: 'var(--pur)', borderBottom: '1px solid var(--bdr)' }}>{row.fmt(row.b)}</td>
                              <td style={{ padding: '7px 14px', textAlign: 'right', borderBottom: '1px solid var(--bdr)',
                                color: diff === null ? 'var(--tx3)' : diff > 0 ? 'var(--lo)' : diff < 0 ? 'var(--er)' : 'var(--tx3)' }}>
                                {diff === null ? '—' : `${diff > 0 ? '+' : ''}${typeof row.a === 'number' && !Number.isInteger(row.a) ? diff.toFixed(2) : diff.toLocaleString()}`}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ TOOLS TAB ══════════ */}
              {tab === 'tools' && (
                <motion.div key="tls" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div className="hint"><span>✂</span><span>Text transformation tools. Choose a transformation, preview the result, then apply it back to your main text or copy it.</span></div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="g2">
                    {/* Tool buttons */}
                    <div className="panel" style={{ padding: '18px 20px' }}>
                      <div className="lbl" style={{ marginBottom: 12 }}>Transformations</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {Object.keys(textTools).map(name => (
                          <button key={name} className="btn-ghost" style={{ justifyContent: 'flex-start', fontSize: 10.5 }}
                            onClick={() => applyTool(name)}>
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Result */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                          <div className="lbl" style={{ margin: 0 }}>Result</div>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn-ghost" onClick={copyToolResult} style={{ fontSize: 8.5 }} disabled={!toolResult}>
                              {toolCopied ? '✓ Copied' : '⎘ Copy'}
                            </button>
                            <button className="btn-pri" onClick={applyToMain} style={{ fontSize: 8.5, padding: '5px 12px' }} disabled={!toolResult}>
                              → Apply to Main
                            </button>
                          </div>
                        </div>
                        <textarea className="textarea" rows={14}
                          placeholder="Click a transformation to preview result here…"
                          value={toolResult}
                          onChange={e => setToolResult(e.target.value)}
                          style={{ opacity: toolResult ? 1 : 0.5 }}
                        />
                      </div>
                      {toolResult && (
                        <div className="panel" style={{ padding: '12px 16px', display: 'flex', gap: 16 }}>
                          {[
                            { label: 'Words',      val: analyze(toolResult).words },
                            { label: 'Characters', val: analyze(toolResult).chars },
                          ].map((s, i) => (
                            <div key={i}>
                              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'var(--tx3)', letterSpacing: '.14em', textTransform: 'uppercase' }}>{s.label}</div>
                              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 16, color: 'var(--acc)' }}>{s.val.toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════════ LEARN TAB ══════════ */}
              {tab === 'learn' && (
                <motion.div key="lrn" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                  <div className="panel" style={{ padding: '26px 30px', marginBottom: 14 }}>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 900, fontSize: 26, color: 'var(--tx)', letterSpacing: '-.02em', marginBottom: 4 }}>Writing Guide</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: 'var(--tx3)', marginBottom: 26, letterSpacing: '.12em' }}>READABILITY · WORD COUNT · TIPS</div>
                    <div className="prose">
                      <h3>What is Flesch Reading Ease?</h3>
                      <p>Developed by Rudolf Flesch in 1948, the Flesch Reading Ease score rates text on a 0–100 scale. Higher scores mean easier reading. The formula uses average sentence length and average syllables per word. A score of <strong>60–70</strong> is considered standard — suitable for ages 13–15 and used by most newspapers. Academic writing typically scores 20–40.</p>
                      <h3>Ideal Writing Metrics</h3>
                      <p>For clear, readable writing: keep sentences under <strong>20 words</strong> on average; prefer words with fewer than <strong>3 syllables</strong>; aim for a Flesch score above <strong>60</strong>. Active voice, concrete nouns, and short paragraphs (3–5 sentences) all dramatically improve readability scores.</p>
                      <h3>Word Count by Content Type</h3>
                      <p><strong>Tweet:</strong> ≤ 280 characters · <strong>Social post:</strong> 40–80 words · <strong>Email:</strong> 50–200 words · <strong>Blog post:</strong> 1,000–2,500 words · <strong>News article:</strong> 400–800 words · <strong>Short story:</strong> 1,000–7,500 words · <strong>Novella:</strong> 17,500–40,000 words · <strong>Novel:</strong> 70,000–100,000 words.</p>
                      {[
                        { q: 'What WPM should I use for reading time?', a: 'The average adult reads 200–250 WPM for non-fiction and 250–300 WPM for fiction. Speed readers can reach 400–600 WPM. The default 238 WPM is based on research by Brysbaert (2019) across 190 studies.' },
                        { q: 'How accurate are readability scores?', a: 'Readability formulas are estimates — they measure surface features like sentence and word length, not true comprehension difficulty. They work best on prose of 100+ words. Technical jargon, proper nouns, and domain knowledge can make text harder than the score suggests.' },
                        { q: 'Why does the word counter exclude stop words?', a: 'Stop words (the, and, a, is, etc.) are filtered out of the frequency/density analysis because they appear in all text equally and don\'t reveal meaning. For raw word counts in the Counter tab, all words including stop words are counted.' },
                      ].map(({ q, a }, i) => (
                        <div key={i} className="qa">
                          <div style={{ fontSize: 12.5, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: 'var(--tx)', marginBottom: 5 }}>{q}</div>
                          <div style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.8 }}>{a}</div>
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