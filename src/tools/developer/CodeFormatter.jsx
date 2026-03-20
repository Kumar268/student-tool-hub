import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   CODE FORMATTER — Dark Void/Lime · Light Snow/Charcoal
   Fonts: Archivo Black (display) + Fira Code + Source Serif 4
   Formats: JSON · HTML · CSS · XML · SQL (minify + prettify)
   Series arch: topbar · tabs · sidebar · main · ads
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Fira+Code:wght@300;400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Source Serif 4',serif}

@keyframes fadeup{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
@keyframes cursor-blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes glow-pulse{0%,100%{box-shadow:0 0 0 0 rgba(163,230,53,.2)}50%{box-shadow:0 0 0 6px rgba(163,230,53,0)}}
@keyframes slide-in{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:none}}

/* ── DARK: void terminal + lime ── */
.dk{
  --bg:#080809;--s1:#0e0f10;--s2:#131416;
  --bdr:#1e2024;--bdr2:rgba(163,230,53,.2);
  --acc:#a3e635;--acc2:#34d399;--acc3:#60a5fa;
  --err:#f87171;--warn:#fbbf24;
  --tx:#f0fdf4;--tx2:#86efac;--tx3:#1a3a1a;--tx4:#052e16;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:radial-gradient(ellipse 60% 30% at 50% 0%,rgba(163,230,53,.05),transparent);
}
/* ── LIGHT: clean snow + forest ── */
.lt{
  --bg:#f9fafb;--s1:#ffffff;--s2:#f0fdf4;
  --bdr:#d1fae5;--bdr2:#15803d;
  --acc:#15803d;--acc2:#0369a1;--acc3:#7c3aed;
  --err:#991b1b;--warn:#92400e;
  --tx:#0a1a0e;--tx2:#166534;--tx3:#4ade80;--tx4:#86efac;
  min-height:100vh;background:var(--bg);color:var(--tx);
}

.topbar{height:44px;position:sticky;top:0;z-index:400;display:flex;align-items:center;padding:0 16px;gap:8px;backdrop-filter:blur(20px);}
.dk .topbar{background:rgba(8,8,9,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(249,250,251,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(21,128,61,.06);}

.tabbar{display:flex;overflow-x:auto}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{height:38px;padding:0 14px;border:none;cursor:pointer;background:transparent;border-bottom:2px solid transparent;
  font-family:'Fira Code',monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;
  display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .14s;}
.dk .tab{color:var(--tx3);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(163,230,53,.05);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:#6b7280;}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(21,128,61,.05);font-weight:600;}
.lt .tab:hover:not(.on){color:var(--tx2);}

.body{display:grid;grid-template-columns:200px 1fr;min-height:calc(100vh - 82px);}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:14px 16px;display:flex;flex-direction:column;gap:14px;}

.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:3px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:10px;box-shadow:0 2px 14px rgba(21,128,61,.05);}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 18px;cursor:pointer;
  font-family:'Fira Code',monospace;font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
  transition:all .15s;border:none;}
.dk .btn{background:var(--acc);color:#080809;border-radius:2px;box-shadow:0 0 18px rgba(163,230,53,.25);animation:glow-pulse 2.5s ease-in-out infinite;}
.dk .btn:hover{background:#bef264;box-shadow:0 0 30px rgba(163,230,53,.5);transform:translateY(-1px);}
.dk .btn:disabled{background:var(--bdr);color:var(--tx3);box-shadow:none;animation:none;cursor:not-allowed;transform:none;}
.lt .btn{background:var(--acc);color:#fff;border-radius:7px;box-shadow:0 4px 14px rgba(21,128,61,.35);}
.lt .btn:hover{background:#166534;box-shadow:0 8px 24px rgba(21,128,61,.45);transform:translateY(-1px);}
.lt .btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}

.btn-g{display:inline-flex;align-items:center;justify-content:center;gap:4px;padding:5px 10px;cursor:pointer;
  font-family:'Fira Code',monospace;font-size:9.5px;letter-spacing:.05em;text-transform:uppercase;background:transparent;transition:all .12s;}
.dk .btn-g{border:1px solid var(--bdr);border-radius:2px;color:var(--tx3);}
.dk .btn-g:hover,.dk .btn-g.on{border-color:var(--acc);color:var(--acc);background:rgba(163,230,53,.06);}
.lt .btn-g{border:1.5px solid var(--bdr);border-radius:6px;color:#6b7280;}
.lt .btn-g:hover,.lt .btn-g.on{border-color:var(--acc);color:var(--acc);background:rgba(21,128,61,.06);}

/* CODE EDITOR */
.code-wrap{position:relative;display:flex;overflow:hidden;}
.dk .code-wrap{background:#050506;border:1px solid var(--bdr);border-radius:3px;}
.lt .code-wrap{background:#fafff6;border:1.5px solid var(--bdr);border-radius:8px;}
.line-nums{padding:12px 10px;display:flex;flex-direction:column;font-family:'Fira Code',monospace;font-size:11.5px;
  line-height:1.65;text-align:right;user-select:none;flex-shrink:0;min-width:40px;}
.dk .line-nums{background:#070708;border-right:1px solid var(--bdr);color:var(--tx3);}
.lt .line-nums{background:#f0fdf4;border-right:1.5px solid var(--bdr);color:#9ca3af;}
.code-ta{flex:1;padding:12px 14px;font-family:'Fira Code',monospace;font-size:12px;
  line-height:1.65;outline:none;background:transparent;border:none;resize:none;
  min-height:320px;overflow:auto;tab-size:2;}
.dk .code-ta{color:#d4e6a0;caret-color:var(--acc);}
.lt .code-ta{color:#14532d;caret-color:var(--acc);}
.code-ta::placeholder{opacity:.25;font-style:italic;}
.code-out{flex:1;padding:12px 14px;font-family:'Fira Code',monospace;font-size:12px;
  line-height:1.65;overflow:auto;white-space:pre;min-height:320px;}
.dk .code-out{color:#d4e6a0;}
.lt .code-out{color:#14532d;}

/* Diff highlight */
.diff-add{background:rgba(163,230,53,.12);}
.dk .diff-add{color:#a3e635;}
.lt .diff-add{color:#15803d;}

/* Token colours */
.dk .t-key{color:#7dd3fc;}    /* JSON keys */
.dk .t-str{color:#a3e635;}    /* strings */
.dk .t-num{color:#fbbf24;}    /* numbers */
.dk .t-bool{color:#f472b6;}   /* booleans */
.dk .t-null{color:#f87171;}   /* null */
.dk .t-tag{color:#7dd3fc;}    /* HTML tag */
.dk .t-attr{color:#a3e635;}   /* HTML attr */
.dk .t-val{color:#fbbf24;}    /* attr value */
.dk .t-com{color:#4b5563;font-style:italic;} /* comment */
.lt .t-key{color:#1d4ed8;}
.lt .t-str{color:#15803d;}
.lt .t-num{color:#92400e;}
.lt .t-bool{color:#9d174d;}
.lt .t-null{color:#991b1b;}
.lt .t-tag{color:#1d4ed8;}
.lt .t-attr{color:#15803d;}
.lt .t-val{color:#92400e;}
.lt .t-com{color:#9ca3af;font-style:italic;}

/* Error / warning strip */
.err-strip{padding:7px 12px;display:flex;align-items:flex-start;gap:7px;font-family:'Fira Code',monospace;font-size:11px;line-height:1.6;}
.dk .err-strip{background:rgba(248,113,113,.07);border:1px solid rgba(248,113,113,.2);border-radius:2px;color:#fca5a5;}
.lt .err-strip{background:rgba(153,27,27,.05);border:1.5px solid rgba(153,27,27,.15);border-radius:7px;color:#991b1b;}
.ok-strip{padding:7px 12px;display:flex;align-items:center;gap:7px;font-family:'Fira Code',monospace;font-size:11px;}
.dk .ok-strip{background:rgba(163,230,53,.06);border:1px solid rgba(163,230,53,.15);border-radius:2px;color:var(--acc);}
.lt .ok-strip{background:rgba(21,128,61,.05);border:1.5px solid rgba(21,128,61,.15);border-radius:7px;color:var(--acc);}

.lbl{font-family:'Fira Code',monospace;font-size:8.5px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(163,230,53,.45);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'Fira Code',monospace;font-size:8.5px;letter-spacing:.22em;text-transform:uppercase;margin-bottom:7px;}
.dk .slbl{color:rgba(163,230,53,.35);}
.lt .slbl{color:var(--acc);}
.metab{padding:8px 10px;}
.dk .metab{border:1px solid rgba(163,230,53,.1);border-radius:2px;background:rgba(163,230,53,.03);}
.lt .metab{border:1.5px solid rgba(21,128,61,.12);border-radius:7px;background:rgba(21,128,61,.04);}
.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(163,230,53,.012);border:1px dashed rgba(163,230,53,.1);border-radius:2px;}
.lt .ad{background:rgba(21,128,61,.03);border:1.5px dashed rgba(21,128,61,.15);border-radius:8px;}
.ad span{font-family:'Fira Code',monospace;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;}
.dk .ad span,.lt .ad span{color:var(--tx3);}

/* Step */
.step-n{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'Fira Code',monospace;font-size:10px;font-weight:600;flex-shrink:0;}
.dk .step-n{border:1px solid rgba(163,230,53,.3);background:rgba(163,230,53,.07);color:var(--acc);}
.lt .step-n{border:1.5px solid rgba(21,128,61,.3);background:rgba(21,128,61,.07);color:var(--acc);}

/* Prose */
.prose{font-family:'Source Serif 4',serif;}
.prose p{font-size:16px;line-height:1.82;margin-bottom:14px;color:var(--tx2);}
.prose h3{font-family:'Archivo Black',sans-serif;font-size:14px;margin:22px 0 8px;color:var(--tx);text-transform:uppercase;letter-spacing:.04em;}
.prose ul{padding-left:22px;margin-bottom:14px;}
.prose li{font-size:16px;line-height:1.75;margin-bottom:6px;color:var(--tx2);}
.prose strong{font-weight:600;color:var(--tx);}
.prose code{font-family:'Fira Code',monospace;font-size:12px;padding:1px 5px;border-radius:3px;}
.dk .prose code{background:rgba(163,230,53,.09);color:var(--acc);}
.lt .prose code{background:rgba(21,128,61,.07);color:var(--acc);}
.faq{padding:12px 14px;margin-bottom:8px;}
.dk .faq{border:1px solid var(--bdr);border-radius:3px;background:rgba(0,0,0,.5);}
.lt .faq{border:1.5px solid var(--bdr);border-radius:9px;background:rgba(21,128,61,.03);}
`;

/* ═══════════════════════════════════════════════════════════
   FORMAT ENGINES
═══════════════════════════════════════════════════════════ */

// ── JSON formatter + syntax highlighter ──────────────────
function formatJSON(raw, indent = 2) {
  const parsed = JSON.parse(raw); // throws on invalid
  return JSON.stringify(parsed, null, indent);
}

function highlightJSON(code) {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"((?:[^"\\]|\\.)*)"\s*:/g, '<span class="t-key">"$1"</span>:')
    .replace(/:\s*"((?:[^"\\]|\\.)*)"/g, ': <span class="t-str">"$1"</span>')
    .replace(/:\s*(-?\d+\.?\d*)/g, ': <span class="t-num">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span class="t-bool">$1</span>')
    .replace(/:\s*(null)/g, ': <span class="t-null">$1</span>');
}

// ── HTML formatter ───────────────────────────────────────
function formatHTML(raw, indent = 2) {
  const TAB = ' '.repeat(indent);
  const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
  let depth = 0, out = '';
  const tokens = raw.replace(/>\s*</g, '>\n<').split('\n');
  for (let tok of tokens) {
    tok = tok.trim();
    if (!tok) continue;
    const isClose = tok.startsWith('</');
    const isSelfClose = tok.endsWith('/>');
    const tagName = (tok.match(/<\/?([a-zA-Z][^\s>\/]*)/) || [])[1]?.toLowerCase();
    const isVoid = tagName && VOID.has(tagName);
    if (isClose) depth = Math.max(0, depth - 1);
    out += TAB.repeat(depth) + tok + '\n';
    if (!isClose && !isSelfClose && !isVoid && tok.startsWith('<')) depth++;
  }
  return out.trimEnd();
}

function highlightHTML(code) {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="t-com">$1</span>')
    .replace(/(&lt;\/?)([\w-]+)/g, '$1<span class="t-tag">$2</span>')
    .replace(/([\w-]+)=(&quot;[^&]*&quot;|"[^"]*")/g, '<span class="t-attr">$1</span>=<span class="t-val">$2</span>');
}

// ── CSS formatter ────────────────────────────────────────
function formatCSS(raw) {
  return raw
    .replace(/\s*\{\s*/g, ' {\n  ')
    .replace(/;\s*/g, ';\n  ')
    .replace(/\s*\}\s*/g, '\n}\n\n')
    .replace(/,\s*(?=[^\{]*\{)/g, ',\n')
    .replace(/  \n\}/g, '\n}')
    .split('\n').map(l => l.trimEnd()).join('\n')
    .replace(/\n{3,}/g, '\n\n').trim();
}

// ── XML formatter ─────────────────────────────────────────
function formatXML(raw, indent = 2) {
  const TAB = ' '.repeat(indent);
  let depth = 0, out = '';
  const tokens = raw.replace(/>\s*</g, '>\n<').split('\n');
  for (let tok of tokens) {
    tok = tok.trim(); if (!tok) continue;
    const isClose = tok.startsWith('</');
    const isSelfClose = tok.endsWith('/>');
    const isPI = tok.startsWith('<?');
    if (isClose) depth = Math.max(0, depth - 1);
    out += TAB.repeat(depth) + tok + '\n';
    if (!isClose && !isSelfClose && !isPI && tok.startsWith('<') && !tok.includes('</')) depth++;
  }
  return out.trimEnd();
}

// ── SQL formatter (basic keyword capitalise + newlines) ──
const SQL_KW = ['SELECT','FROM','WHERE','JOIN','LEFT','RIGHT','INNER','OUTER','ON','AND','OR','NOT',
  'INSERT','INTO','VALUES','UPDATE','SET','DELETE','CREATE','TABLE','DROP','ALTER','ADD',
  'GROUP BY','ORDER BY','HAVING','LIMIT','OFFSET','AS','DISTINCT','UNION','ALL'];
function formatSQL(raw) {
  let s = raw.replace(/\s+/g, ' ').trim();
  SQL_KW.forEach(kw => {
    s = s.replace(new RegExp(`\\b${kw}\\b`, 'gi'), kw);
  });
  return s
    .replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|UNION)\b/gi,
      '\n$1')
    .replace(/\b(AND|OR)\b/gi, '\n  $1')
    .replace(/,\s*/g, ',\n  ')
    .split('\n').map(l => l.trimEnd()).filter(Boolean).join('\n')
    .trim();
}

// ── Minifier ──────────────────────────────────────────────
function minify(raw, mode) {
  switch (mode) {
    case 'json': return JSON.stringify(JSON.parse(raw));
    case 'html': return raw.replace(/<!--[\s\S]*?-->/g,'').replace(/\s+/g,' ').replace(/> </g,'><').trim();
    case 'css':  return raw.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ')
                           .replace(/\s*([{}:;,>+~])\s*/g,'$1').trim();
    case 'xml':  return raw.replace(/>\s+</g,'><').replace(/\s+/g,' ').trim();
    case 'sql':  return raw.replace(/\s+/g,' ').trim();
    default: return raw.replace(/\s+/g,' ').trim();
  }
}

/* ═══ MODES ══ */
const MODES = [
  { id: 'json', label: 'JSON',  icon: '{}', sample: '{"name":"StudentHub","version":2.0,"features":["GPA","PDF","AI"],"meta":{"author":"dev","year":2025}}' },
  { id: 'html', label: 'HTML',  icon: '<>', sample: '<div id="app"><header><nav><a href="/">Home</a><a href="/about">About</a></nav></header><main><h1>Hello World</h1><p class="intro">Welcome to the demo.</p></main></div>' },
  { id: 'css',  label: 'CSS',   icon: '#.',  sample: '.container{display:flex;flex-direction:column;gap:16px;padding:24px}.header{font-size:24px;font-weight:700;color:#1a1a2e}.btn{padding:8px 16px;border-radius:4px;background:#6366f1;color:#fff}' },
  { id: 'xml',  label: 'XML',   icon: '</', sample: '<?xml version="1.0"?><root><users><user id="1"><name>Alice</name><email>alice@test.com</email></user><user id="2"><name>Bob</name></user></users></root>' },
  { id: 'sql',  label: 'SQL',   icon: ';;', sample: 'select u.id,u.name,u.email,count(o.id) as orders from users u left join orders o on u.id=o.user_id where u.active=1 and u.created_at > \'2024-01-01\' group by u.id order by orders desc limit 20' },
];

const INDENT_OPTS = [2, 4];
const PAGE_TABS = [
  { id: 'format',  label: '◉ Format' },
  { id: 'minify',  label: '▪ Minify' },
  { id: 'compare', label: '⊡ Compare' },
  { id: 'guide',   label: '? Guide' },
  { id: 'learn',   label: '∑ Learn' },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════ */
export default function CodeFormatter() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';

  const [mode, setMode] = useState('json');
  const [input, setInput] = useState(MODES[0].sample);
  const [output, setOutput] = useState('');
  const [highlighted, setHighlighted] = useState('');
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState('format');
  const [minified, setMinified] = useState('');
  const [minErr, setMinErr] = useState('');
  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');
  const [diffLines, setDiffLines] = useState([]);

  const outRef = useRef(null);

  // ── Format ───────────────────────────────────────────────
  const doFormat = useCallback(() => {
    setError(''); setStatus('');
    try {
      let result = '';
      switch (mode) {
        case 'json': result = formatJSON(input, indent); break;
        case 'html': result = formatHTML(input, indent); break;
        case 'css':  result = formatCSS(input); break;
        case 'xml':  result = formatXML(input, indent); break;
        case 'sql':  result = formatSQL(input); break;
        default: result = input;
      }
      setOutput(result);

      // Syntax highlight
      let hl = result.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      if (mode === 'json') hl = highlightJSON(result);
      else if (mode === 'html') hl = highlightHTML(result);
      setHighlighted(hl);

      const lines = result.split('\n').length;
      const chars = result.length;
      const saved = input.length - result.replace(/\s+/g, ' ').length;
      setStatus(`✓ ${lines} lines · ${chars} chars · ${input.split('\n').length}→${lines} lines`);
    } catch (e) {
      setError(e.message);
      setOutput('');
      setHighlighted('');
    }
  }, [input, mode, indent]);

  // ── Minify ──────────────────────────────────────────────
  const doMinify = useCallback(() => {
    setMinErr('');
    try {
      const result = minify(input, mode);
      setMinified(result);
    } catch (e) { setMinErr(e.message); }
  }, [input, mode]);

  // ── Diff compare ─────────────────────────────────────────
  const doDiff = useCallback(() => {
    const aLines = compareA.split('\n');
    const bLines = compareB.split('\n');
    const maxLen = Math.max(aLines.length, bLines.length);
    const lines = [];
    for (let i = 0; i < maxLen; i++) {
      const a = aLines[i] ?? '';
      const b = bLines[i] ?? '';
      lines.push({ a, b, same: a === b, idx: i + 1 });
    }
    setDiffLines(lines);
  }, [compareA, compareB]);

  const copy = (text) => {
    try { navigator.clipboard.writeText(text); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 1400);
  };

  const lineCount = input.split('\n').length;

  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>

        {/* ══ TOPBAR ══ */}
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: dark ? 3 : 8,
              border: dark ? '1px solid rgba(163,230,53,.4)' : 'none',
              background: dark ? 'rgba(163,230,53,.08)' : 'linear-gradient(135deg,#15803d,#0369a1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: dark ? 'var(--acc)' : '#fff',
              fontFamily: "'Fira Code',monospace", fontSize: 11, fontWeight: 600,
              boxShadow: dark ? '0 0 14px rgba(163,230,53,.22)' : '0 3px 10px rgba(21,128,61,.4)',
            }}>{'{ }'}</div>
            <div>
              <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 14, color: 'var(--tx)', letterSpacing: '.02em', lineHeight: 1 }}>
                code<span style={{ color: 'var(--acc)' }}>.fmt</span>
              </div>
              <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 8, color: 'var(--tx3)', letterSpacing: '.1em', textTransform: 'uppercase', marginTop: 1 }}>
                Formatter & Beautifier
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Mode pills */}
          <div style={{ display: 'flex', gap: 4 }}>
            {MODES.map(m => (
              <button key={m.id}
                className={`btn-g ${mode === m.id ? 'on' : ''}`}
                onClick={() => { setMode(m.id); setInput(m.sample); setOutput(''); setError(''); setStatus(''); }}
                style={{ padding: '3px 8px', fontSize: 9.5,
                  background: mode === m.id ? (dark ? 'rgba(163,230,53,.08)' : 'rgba(21,128,61,.07)') : '' }}>
                <span style={{ fontFamily: "'Fira Code',monospace" }}>{m.icon}</span> {m.label}
              </button>
            ))}
          </div>

          {/* Status */}
          {status && (
            <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 9.5, color: 'var(--acc)', letterSpacing: '.06em', padding: '3px 9px',
              borderRadius: dark ? 2 : 6, border: dark ? '1px solid rgba(163,230,53,.15)' : '1.5px solid rgba(21,128,61,.15)',
              background: dark ? 'rgba(163,230,53,.04)' : 'rgba(21,128,61,.04)' }}>
              {status}
            </div>
          )}

          {/* Theme */}
          <button onClick={() => setDark(d => !d)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
            border: dark ? '1px solid rgba(163,230,53,.18)' : '1.5px solid var(--bdr)',
            borderRadius: dark ? 2 : 6, background: 'transparent', cursor: 'pointer',
          }}>
            <div style={{ width: 28, height: 14, borderRadius: 8, position: 'relative',
              background: dark ? 'var(--acc)' : '#d1fae5',
              boxShadow: dark ? '0 0 8px rgba(163,230,53,.5)' : 'none' }}>
              <div style={{ position: 'absolute', top: 2.5, left: dark ? 'auto' : 2, right: dark ? 2 : 'auto',
                width: 9, height: 9, borderRadius: '50%', background: dark ? '#080809' : 'white', transition: 'all .2s' }} />
            </div>
            <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 8.5, letterSpacing: '.1em', color: 'var(--tx3)' }}>
              {dark ? 'VOID' : 'SNOW'}
            </span>
          </button>
        </div>

        {/* ══ TABS ══ */}
        <div className="tabbar">
          {PAGE_TABS.map(t => (
            <button key={t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* ══ BODY ══ */}
        <div className="body">

          {/* SIDEBAR */}
          <div className="sidebar">
            

            {/* Mode */}
            <div>
              <div className="slbl">Format</div>
              {MODES.map(m => (
                <button key={m.id} className={`btn-g ${mode === m.id ? 'on' : ''}`}
                  onClick={() => { setMode(m.id); setInput(m.sample); setOutput(''); setError(''); setStatus(''); }}
                  style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 4, padding: '5px 9px',
                    background: mode === m.id ? (dark ? 'rgba(163,230,53,.07)' : 'rgba(21,128,61,.06)') : '' }}>
                  <span style={{ fontFamily: "'Fira Code',monospace", marginRight: 4 }}>{m.icon}</span> {m.label}
                </button>
              ))}
            </div>

            {/* Indent */}
            <div>
              <div className="slbl">Indent size</div>
              <div style={{ display: 'flex', gap: 5 }}>
                {INDENT_OPTS.map(n => (
                  <button key={n} className={`btn-g ${indent === n ? 'on' : ''}`}
                    onClick={() => setIndent(n)}
                    style={{ flex: 1, justifyContent: 'center',
                      background: indent === n ? (dark ? 'rgba(163,230,53,.08)' : 'rgba(21,128,61,.07)') : '' }}>
                    {n}sp
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            {input && (
              <div>
                <div className="slbl">Input stats</div>
                {[
                  ['Lines',   input.split('\n').length],
                  ['Chars',   input.length],
                  ['Size',    `${(input.length / 1024).toFixed(1)} KB`],
                ].map(([l, v]) => (
                  <div key={l} className="metab" style={{ marginBottom: 5 }}>
                    <div style={{ fontSize: 8, fontFamily: "'Fira Code',monospace", letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 1 }}>{l}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Fira Code',monospace", color: 'var(--acc)' }}>{v}</div>
                  </div>
                ))}
              </div>
            )}

            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══════ FORMAT ══════ */}
              {tab === 'format' && (
                <motion.div key="fmt" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
                    {/* Input */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                        <div className="lbl" style={{ margin: 0 }}>Input — {MODES.find(m2 => m2.id === mode)?.label}</div>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button className="btn-g" onClick={() => setInput(MODES.find(m2 => m2.id === mode)?.sample || '')} style={{ fontSize: 9 }}>Sample</button>
                          <button className="btn-g" onClick={() => { setInput(''); setOutput(''); setError(''); setStatus(''); }} style={{ fontSize: 9 }}>Clear</button>
                        </div>
                      </div>
                      <div className="code-wrap">
                        <div className="line-nums">
                          {Array.from({ length: lineCount }, (_, i) => (
                            <span key={i}>{i + 1}</span>
                          ))}
                        </div>
                        <textarea className="code-ta" value={input}
                          onChange={e => { setInput(e.target.value); setOutput(''); setStatus(''); }}
                          placeholder={`Paste your ${MODES.find(m2 => m2.id === mode)?.label} here...`}
                          spellCheck={false} />
                      </div>
                    </div>

                    {/* Output */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                        <div className="lbl" style={{ margin: 0 }}>Formatted output</div>
                        <button className="btn-g" onClick={() => copy(output)} disabled={!output}
                          style={{ fontSize: 9, borderColor: copied ? 'var(--acc)' : '', color: copied ? 'var(--acc)' : '' }}>
                          {copied ? '✓ Copied' : '⎘ Copy'}
                        </button>
                      </div>
                      <div className="code-wrap">
                        <div className="line-nums">
                          {(output || '').split('\n').map((_, i) => (
                            <span key={i}>{i + 1}</span>
                          ))}
                          {!output && <span style={{ opacity: 0 }}>1</span>}
                        </div>
                        <div ref={outRef} className="code-out"
                          dangerouslySetInnerHTML={{ __html: highlighted || `<span style="opacity:.25;font-style:italic">Formatted result will appear here...</span>` }} />
                      </div>
                    </div>
                  </div>

                  {/* Error / status */}
                  {error && <div className="err-strip"><span>✗</span> {error}</div>}
                  {status && !error && <div className="ok-strip"><span>✓</span> {status}</div>}

                  {/* Format button */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button className="btn" onClick={doFormat} disabled={!input.trim()}
                      style={{ padding: '9px 26px', fontSize: 11 }}>
                      ⇥ Format {MODES.find(m2 => m2.id === mode)?.label}
                    </button>
                    <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 9.5, color: 'var(--tx3)' }}>
                      indent: {indent} spaces
                    </span>
                  </div>

                  
                </motion.div>
              )}

              {/* ══════ MINIFY ══════ */}
              {tab === 'minify' && (
                <motion.div key="min" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  <div style={{
                    padding: '9px 13px', borderRadius: dark ? 2 : 8,
                    background: dark ? 'rgba(163,230,53,.04)' : 'rgba(21,128,61,.04)',
                    border: dark ? '1px solid rgba(163,230,53,.12)' : '1.5px solid rgba(21,128,61,.12)',
                    fontFamily: "'Fira Code',monospace", fontSize: 11.5, color: 'var(--tx2)', lineHeight: 1.6,
                  }}>
                    ℹ Minification removes all unnecessary whitespace, comments, and newlines to reduce file size.
                    Uses your current Input from the ◉ Format tab.
                  </div>

                  <button className="btn" onClick={doMinify} disabled={!input.trim()} style={{ alignSelf: 'flex-start', padding: '9px 24px' }}>
                    ▪ Minify {MODES.find(m2 => m2.id === mode)?.label}
                  </button>

                  {minErr && <div className="err-strip"><span>✗</span> {minErr}</div>}

                  {minified && (
                    <>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                          <div className="lbl" style={{ margin: 0 }}>Minified output</div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, color: 'var(--acc)' }}>
                              {input.length} → {minified.length} chars
                              ({Math.round((1 - minified.length / input.length) * 100)}% smaller)
                            </span>
                            <button className="btn-g" onClick={() => copy(minified)} style={{ fontSize: 9 }}>
                              {copied ? '✓ Copied' : '⎘ Copy'}
                            </button>
                          </div>
                        </div>
                        <div className="code-wrap" style={{ minHeight: 120 }}>
                          <div className="code-out" style={{ padding: '12px 14px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', minHeight: 120 }}>
                            {minified}
                          </div>
                        </div>
                      </div>

                      {/* Size comparison bars */}
                      <div className="panel" style={{ padding: '13px 16px' }}>
                        <div className="lbl" style={{ marginBottom: 10 }}>Size comparison</div>
                        {[
                          { label: 'Original', size: input.length, color: dark ? '#60a5fa' : '#1d4ed8' },
                          { label: 'Minified', size: minified.length, color: dark ? 'var(--acc)' : 'var(--acc)' },
                        ].map(({ label, size, color }) => (
                          <div key={label} style={{ marginBottom: 9 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 10.5, color: 'var(--tx2)' }}>{label}</span>
                              <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 10.5, color }}>{size} chars</span>
                            </div>
                            <motion.div
                              initial={{ width: 0 }} animate={{ width: `${(size / input.length) * 100}%` }}
                              transition={{ duration: .5, ease: 'easeOut' }}
                              style={{ height: 7, borderRadius: dark ? 1 : 4, background: color, maxWidth: '100%' }} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  
                </motion.div>
              )}

              {/* ══════ COMPARE ══════ */}
              {tab === 'compare' && (
                <motion.div key="cmp" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
                    <div>
                      <div className="lbl" style={{ marginBottom: 7 }}>Version A</div>
                      <div className="code-wrap">
                        <textarea className="code-ta" value={compareA}
                          onChange={e => setCompareA(e.target.value)}
                          placeholder="Paste version A..." spellCheck={false} />
                      </div>
                    </div>
                    <div>
                      <div className="lbl" style={{ marginBottom: 7 }}>Version B</div>
                      <div className="code-wrap">
                        <textarea className="code-ta" value={compareB}
                          onChange={e => setCompareB(e.target.value)}
                          placeholder="Paste version B..." spellCheck={false} />
                      </div>
                    </div>
                  </div>

                  <button className="btn" onClick={doDiff} disabled={!compareA || !compareB} style={{ alignSelf: 'flex-start', padding: '9px 24px' }}>
                    ⊡ Compare
                  </button>

                  {diffLines.length > 0 && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div className="lbl" style={{ margin: 0 }}>Diff — line by line</div>
                        <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, color: 'var(--tx3)' }}>
                          {diffLines.filter(l => !l.same).length} differences
                        </span>
                      </div>
                      <div className="code-wrap" style={{ maxHeight: 360, overflow: 'auto' }}>
                        <div style={{ padding: '8px 0' }}>
                          {diffLines.map((line, i) => (
                            <div key={i} style={{
                              display: 'grid', gridTemplateColumns: '32px 1fr 1fr',
                              padding: '1px 0', background: !line.same ? (dark ? 'rgba(163,230,53,.05)' : 'rgba(21,128,61,.05)') : 'transparent',
                              borderLeft: !line.same ? `2px solid var(--acc)` : `2px solid transparent`,
                            }}>
                              <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 10.5, color: 'var(--tx3)', padding: '0 8px', userSelect: 'none', textAlign: 'right' }}>{line.idx}</span>
                              <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, padding: '0 10px', color: line.same ? 'var(--tx2)' : (dark ? '#fca5a5' : 'var(--err)'), borderRight: dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)' }}>
                                {line.a || <span style={{ opacity: .3 }}>(empty)</span>}
                              </span>
                              <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 11, padding: '0 10px', color: line.same ? 'var(--tx2)' : (dark ? 'var(--acc)' : 'var(--acc)') }}>
                                {line.b || <span style={{ opacity: .3 }}>(empty)</span>}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ══════ GUIDE ══════ */}
              {tab === 'guide' && (
                <motion.div key="guide" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { n: 1, t: 'Choose your format', d: 'Select JSON, HTML, CSS, XML, or SQL from the mode pills in the topbar or the sidebar. The input field will load a sample for that format.' },
                    { n: 2, t: 'Paste your code', d: 'Paste minified or messy code into the Input panel. You can also load the built-in sample to see the formatter in action immediately.' },
                    { n: 3, t: 'Choose indent size', d: 'Select 2 or 4 spaces from the sidebar. This controls how deeply nested blocks are indented in the formatted output.' },
                    { n: 4, t: 'Click Format', d: 'Hit the Format button. The right panel shows the prettified code with syntax highlighting — keys, values, tags, and attributes coloured differently.' },
                    { n: 5, t: 'Copy the output', d: 'Click ⎘ Copy to copy the plain-text formatted code to your clipboard. The status bar shows line count, character count, and size information.' },
                    { n: 6, t: 'Minify for production', d: 'Switch to the ▪ Minify tab to strip all whitespace and get the smallest possible version of your code. A size comparison bar shows the reduction.' },
                    { n: 7, t: 'Compare two versions', d: 'Use the ⊡ Compare tab to paste two versions of code side-by-side and see a line-by-line diff. Changed lines are highlighted in colour.' },
                  ].map(({ n, t, d }) => (
                    <div key={n} style={{ display: 'flex', gap: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div className="step-n">{n}</div>
                        {n < 7 && <div style={{ width: 1.5, flex: 1, marginTop: 5, background: dark ? 'rgba(163,230,53,.1)' : 'rgba(21,128,61,.12)' }} />}
                      </div>
                      <div style={{ flex: 1, paddingBottom: 10 }}>
                        <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 13.5, color: 'var(--tx)', marginBottom: 3 }}>{t}</div>
                        <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: 15, color: 'var(--tx2)', lineHeight: 1.74 }}>{d}</div>
                      </div>
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {/* ══════ LEARN ══════ */}
              {tab === 'learn' && (
                <motion.div key="learn" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="panel" style={{ padding: '22px 26px', marginBottom: 12 }}>
                    <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 22, color: 'var(--tx)', marginBottom: 4 }}>
                      Debugging 101: Why Every Developer Needs a Formatter
                    </div>
                    <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 10, color: 'var(--tx3)', marginBottom: 22, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                      JSON · HTML · CSS · XML · SQL · minification · tooling
                    </div>
                    <div className="prose">
                      <p>In professional software development, code is read far more often than it is written. When you're consuming an API response, debugging a colleague's stylesheet, or inspecting server-sent HTML, you frequently encounter <strong>minified code</strong> — every whitespace and newline stripped out for bandwidth efficiency. Humans can't work with it. Formatters bridge that gap.</p>

                      <h3>What is JSON and why does it get minified?</h3>
                      <p>JSON (JavaScript Object Notation) is the lingua franca of the web — the standard format for data exchange between servers and clients. A JSON response from a real-world API might be a single line of 50,000 characters. Every byte saved in transit multiplies across millions of requests. A formatter turns that wall of text into a structured, indented document you can actually read and reason about.</p>

                      <h3>HTML and the hierarchy problem</h3>
                      <p>Proper indentation in HTML isn't cosmetic — it reveals the document's hierarchy. A misplaced closing tag or a <code>&lt;div&gt;</code> nested inside a <code>&lt;table&gt;</code> can corrupt layout in ways that are nearly invisible in flat code. Formatted HTML exposes these structural errors at a glance. The formatter tracks open tags and only increments indentation for non-void elements (elements that require a closing tag).</p>

                      <h3>CSS specificity and organisation</h3>
                      <p>Minified CSS bundles all rules onto one line. After formatting, each property occupies its own line and selectors are vertically separated. This makes it trivial to spot duplicate properties, check specificity hierarchies, and understand which rules override others.</p>

                      <h3>SQL readability</h3>
                      <p>SQL queries written by query-builders or ORMs are often one-liners with no capitalisation. Formatted SQL capitalises keywords (<code>SELECT</code>, <code>FROM</code>, <code>WHERE</code>), places each clause on a new line, and indents continuation conditions (<code>AND</code>, <code>OR</code>). The structure of a 30-table join becomes navigable.</p>

                      <h3>Minification vs. Prettification</h3>
                      <p>Minification and formatting are inverse operations. Formatters add structure for human readability; minifiers remove structure for machine efficiency. Production web applications serve minified assets — smaller files mean faster page loads. Development environments use formatted code for maintainability. The Minify tab in this tool lets you go in either direction.</p>

                      {[
                        { q: 'Does formatting change how my code runs?', a: 'For JSON and XML, no — whitespace outside string values is ignored by parsers. For HTML, whitespace between inline elements can technically add a small gap in rendered output, but it will not change behaviour. For CSS and SQL, whitespace is entirely irrelevant to execution. The notable exception is Python, where indentation carries semantic meaning.' },
                        { q: 'Why is my JSON failing to format?', a: 'The most common causes: missing double quotes around keys (JSON requires them, unlike JavaScript object literals), trailing commas after the last item in an array or object, single-quoted strings instead of double-quoted, or unescaped special characters inside strings. The error message shows exactly where the parser stopped.' },
                        { q: 'What is the difference between 2-space and 4-space indent?', a: 'Neither is objectively correct — it is a matter of convention. The JavaScript ecosystem (and this tool\'s default) uses 2 spaces. Java, C#, and Python communities tend to use 4 spaces. Some projects use tabs. Whatever you choose, the golden rule is consistency: pick one style and apply it to the entire codebase.' },
                        { q: 'What is an XML namespace and how does it affect formatting?', a: 'XML namespaces (e.g. xmlns:xsi="...") allow elements from different vocabularies to coexist without name collisions. The formatter treats namespace declarations as regular attributes and preserves them. Namespace prefixes like xsi:type appear unchanged in the formatted output.' },
                        { q: 'How does the line-by-line diff work?', a: 'The Compare tab splits both inputs on newlines and compares corresponding lines. Lines where A and B differ are highlighted. It is a positional diff rather than a semantic one — it is ideal for comparing two formatted versions of the same file where line numbers are meaningful.' },
                      ].map(({ q, a }, i) => (
                        <div key={i} className="faq">
                          <div style={{ fontFamily: "'Archivo Black',sans-serif", fontSize: 13, color: 'var(--tx)', marginBottom: 5 }}>{q}</div>
                          <div style={{ fontFamily: "'Source Serif 4',serif", fontSize: 15, color: 'var(--tx2)', lineHeight: 1.74 }}>{a}</div>
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