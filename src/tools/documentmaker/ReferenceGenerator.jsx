import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   REFERENCE GENERATOR  — Document Tools Series #2
   Theme: Dark Void/Neon Teal · Light Cream/Forest  (matches ResumeMaker)
   Fonts: Fraunces · Outfit · Fira Code
   AI: Anthropic streaming (write letter, improve, tailor, translate tone)
   Types: Academic · Professional · Character · Employer
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Outfit',sans-serif}

@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(20,255,180,.2)}50%{box-shadow:0 0 0 8px rgba(20,255,180,0)}}
@keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}

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

/* ── SCAN LINE (dark only) ── */
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
select.fi{cursor:pointer;}

/* ── ACCORDION ── */
.acc-wrap{margin-bottom:10px;}
.acc-head{width:100%;display:flex;justify-content:space-between;align-items:center;
  padding:11px 15px;background:transparent;border:none;cursor:pointer;transition:background .13s;}
.dk .acc-head{border-bottom:1px solid var(--bdr);}
.lt .acc-head{border-bottom:1.5px solid var(--bdr);}
.dk .acc-head:hover{background:rgba(20,255,180,.025);}
.lt .acc-head:hover{background:rgba(13,51,32,.025);}
.acc-title{font-family:'Fraunces',serif;font-size:14px;font-weight:600;color:var(--tx);}
.acc-badge{font-family:'Fira Code',monospace;font-size:9px;padding:1px 6px;border-radius:99px;margin-left:7px;}
.dk .acc-badge{background:rgba(20,255,180,.1);border:1px solid rgba(20,255,180,.2);color:var(--acc);}
.lt .acc-badge{background:rgba(13,51,32,.08);border:1.5px solid rgba(13,51,32,.15);color:var(--acc);}
.acc-body{padding:13px 15px 15px;}

/* ── ENTRY CARD ── */
.ec{padding:13px 14px;margin-bottom:10px;position:relative;}
.dk .ec{border:1px solid var(--bdr);border-radius:4px;background:rgba(0,0,0,.3);}
.lt .ec{border:1.5px solid var(--bdr);border-radius:10px;background:rgba(245,251,248,.8);}
.dk .ec::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--acc);border-radius:2px 0 0 2px;opacity:.5;}

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

/* ── PROGRESS ── */
.prog{height:3px;border-radius:2px;overflow:hidden;margin-bottom:6px;}
.dk .prog{background:rgba(20,255,180,.1);}
.lt .prog{background:rgba(13,51,32,.1);}
.prog-bar{height:100%;border-radius:2px;transition:width .3s ease;}
.dk .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc4));}
.lt .prog-bar{background:linear-gradient(90deg,var(--acc),var(--acc4));}

/* ── AD PLACEHOLDER ── */
.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(20,255,180,.01);border:1px dashed rgba(20,255,180,.08);border-radius:3px;}
.lt .ad{background:rgba(13,51,32,.02);border:1.5px dashed rgba(13,51,32,.1);border-radius:9px;}
.ad span{font-family:'Fira Code',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;color:var(--tx3);}

/* ── LETTER PREVIEW ── */
.letter-preview{font-family:'Outfit',sans-serif;font-size:13.5px;line-height:1.85;color:#111;
  background:white;padding:48px 52px;max-width:680px;margin:0 auto;
  box-shadow:0 6px 48px rgba(0,0,0,.35);}

/* ── CHAR COUNT ── */
.char-count{font-family:'Fira Code',monospace;font-size:9px;text-align:right;margin-top:3px;opacity:.5;}

/* ── STEP NUM ── */
.step-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-family:'Fira Code',monospace;font-size:11px;font-weight:500;flex-shrink:0;}
.dk .step-num{border:1px solid rgba(20,255,180,.3);background:rgba(20,255,180,.06);color:var(--acc);}
.lt .step-num{border:1.5px solid rgba(13,51,32,.3);background:rgba(13,51,32,.06);color:var(--acc);}

/* ── TYPE BADGE ── */
.type-badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:99px;
  font-family:'Fira Code',monospace;font-size:9px;font-weight:500;}
.dk .type-badge{background:rgba(20,255,180,.08);border:1px solid rgba(20,255,180,.2);color:var(--acc);}
.lt .type-badge{background:rgba(13,51,32,.07);border:1.5px solid rgba(13,51,32,.18);color:var(--acc);}
`;

/* ═══ HELPERS ═══ */
const uid = () => Math.random().toString(36).slice(2, 9);

const TABS = [
  { id: 'build',   label: '✎ Build' },
  { id: 'ai',      label: '✦ AI Write' },
  { id: 'preview', label: '◉ Preview' },
  { id: 'types',   label: '▦ Types' },
  { id: 'guide',   label: '? Guide' },
];

const REF_TYPES = [
  { id: 'academic',     label: 'Academic',     tag: 'University / School',  icon: '🎓' },
  { id: 'professional', label: 'Professional', tag: 'Work / Corporate',     icon: '💼' },
  { id: 'character',    label: 'Character',    tag: 'Personal / Community', icon: '🤝' },
  { id: 'employer',     label: 'Employer',     tag: 'Job Application',      icon: '📋' },
];

const TONES = ['Formal', 'Warm & Enthusiastic', 'Concise & Direct', 'Highly Laudatory', 'Balanced & Honest'];

const EMPTY = {
  // About the person being referenced
  candidateName: '',
  candidateRole: '',
  relationship: '',
  duration: '',
  refType: 'professional',
  // Writer info
  writerName: '',
  writerTitle: '',
  writerOrg: '',
  writerEmail: '',
  // Letter details
  recipientName: '',
  recipientOrg: '',
  purpose: '',
  tone: 'Formal',
  // Qualities & achievements
  topQualities: '',
  keyAchievements: '',
  specificExample: '',
  // Output
  letterBody: '',
};

/* ═══ BUILD LETTER TEXT ═══ */
function buildLetter(d) {
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const recipient = d.recipientName ? `Dear ${d.recipientName},` : 'To Whom It May Concern,';
  const opener = d.purpose
    ? `I am writing to recommend ${d.candidateName || '[Candidate]'} for ${d.purpose}.`
    : `I am writing to provide a reference for ${d.candidateName || '[Candidate]'}.`;

  const body = d.letterBody || `I have had the pleasure of knowing ${d.candidateName || '[Candidate]'} ${d.relationship ? `as their ${d.relationship}` : ''} for ${d.duration || '[duration]'}.

${d.topQualities ? `Throughout our time together, ${d.candidateName || 'they'} has consistently demonstrated ${d.topQualities}.` : ''}

${d.keyAchievements ? `Among their notable achievements: ${d.keyAchievements}.` : ''}

${d.specificExample ? `One example that stands out: ${d.specificExample}` : ''}

I have no hesitation in recommending ${d.candidateName || '[Candidate]'} and am confident they will make an excellent addition to your ${d.recipientOrg ? d.recipientOrg : 'organisation'}.`;

  const close = `Sincerely,\n\n${d.writerName || '[Your Name]'}\n${[d.writerTitle, d.writerOrg].filter(Boolean).join(', ')}\n${d.writerEmail || ''}`;

  return `${d.writerName || '[Your Name]'}\n${[d.writerTitle, d.writerOrg].filter(Boolean).join(', ')}\n${d.writerEmail || ''}\n\n${today}\n\n${recipient}\n\n${opener}\n\n${body.trim()}\n\n${close}`;
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function ReferenceGenerator({ isDarkMode: externalDark } = {}) {
  const [dark, setDark]   = useState(externalDark !== undefined ? externalDark : true);
  const cls = dark ? 'dk' : 'lt';

  const [tab, setTab]     = useState('build');
  const [data, setData]   = useState({ ...EMPTY });

  /* AI state */
  const [aiMode, setAiMode]   = useState('full_letter');
  const [aiCtx,  setAiCtx]   = useState('');
  const [aiOut,  setAiOut]   = useState('');
  const [aiLoad, setAiLoad]  = useState(false);
  const [aiErr,  setAiErr]   = useState('');

  /* helpers */
  const set = (k, v) => setData(p => ({ ...p, [k]: v }));

  /* completeness */
  const filled = [data.candidateName, data.relationship, data.writerName, data.writerTitle, data.purpose, data.topQualities, data.keyAchievements]
    .filter(Boolean).length;
  const pct = Math.round((filled / 7) * 100);

  /* AI prompts */
  const AI_PROMPTS = {
    full_letter: `Write a complete, professional reference letter. Details:
- Candidate: ${data.candidateName || (aiCtx || 'the candidate')}
- Relationship: ${data.relationship || 'colleague'}
- Duration: ${data.duration || 'several years'}
- Reference type: ${data.refType}
- Purpose: ${data.purpose || 'their next opportunity'}
- Top qualities: ${data.topQualities || 'leadership, dedication, technical skill'}
- Key achievements: ${data.keyAchievements || aiCtx || ''}
- Specific example: ${data.specificExample || ''}
- Tone: ${data.tone}
- Writer: ${data.writerName || 'the referee'}, ${data.writerTitle || ''}
- Recipient: ${data.recipientName || 'Hiring Committee'}${data.recipientOrg ? ', ' + data.recipientOrg : ''}

Write ONLY the body paragraphs of the letter (after "Dear..," and before the sign-off). 3–4 paragraphs. Do not include salutation or sign-off. Professional, ${data.tone.toLowerCase()} tone.`,

    opening: `Write a compelling opening paragraph for a ${data.refType} reference letter for ${data.candidateName || aiCtx || 'the candidate'}. Relationship: ${data.relationship || 'colleague'}, duration: ${data.duration || 'several years'}. Purpose: ${data.purpose || 'their application'}. Tone: ${data.tone}. Output only the paragraph.`,

    qualities: `Write a paragraph highlighting these qualities for ${data.candidateName || aiCtx || 'the candidate'}: ${data.topQualities || aiCtx}. Make it specific and compelling for a ${data.refType} reference. Tone: ${data.tone}. Output only the paragraph.`,

    closing: `Write a strong closing paragraph for a ${data.refType} reference letter for ${data.candidateName || aiCtx || 'the candidate'} applying to ${data.recipientOrg || 'the organisation'}. Include an offer to discuss further. Tone: ${data.tone}. Output only the paragraph.`,

    improve: `Improve this reference letter text to be more impactful, specific, and professional:\n\n${aiCtx}\n\nOutput only the improved version. Keep the same structure but elevate the language.`,
  };

  const runAI = async () => {
    setAiLoad(true); setAiOut(''); setAiErr('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          stream: true,
          messages: [{ role: 'user', content: AI_PROMPTS[aiMode] }],
        }),
      });
      if (!res.ok) { setAiErr('API error — check connection'); setAiLoad(false); return; }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n'); buf = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const p = line.slice(6); if (p === '[DONE]') break;
          try {
            const obj = JSON.parse(p);
            if (obj.type === 'content_block_delta' && obj.delta?.type === 'text_delta')
              setAiOut(prev => prev + obj.delta.text);
          } catch {}
        }
      }
    } catch (e) { setAiErr(e.message); }
    finally { setAiLoad(false); }
  };

  const applyAI = () => {
    if (!aiOut) return;
    set('letterBody', aiOut);
    setTab('preview');
  };

  /* copy */
  const copyLetter = () => {
    try { navigator.clipboard.writeText(buildLetter(data)); } catch {}
  };

  /* print */
  const printLetter = () => {
    const letter = buildLetter(data);
    const lines = letter.split('\n').map(l => `<p style="margin:0 0 6px;">${l || '&nbsp;'}</p>`).join('');
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Reference Letter</title>
      <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Georgia',serif;font-size:13.5px;line-height:1.85;color:#111;padding:0}
      .page{padding:52px 58px;max-width:680px;margin:0 auto;}
      p{margin-bottom:6px;}
      @media print{@page{margin:.6in}}</style></head>
      <body><div class="page">${lines}</div>
      <script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
  };

  /* ── Accordion ── */
  const Sec = ({ title, badge, children, open: defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <div className="acc-wrap panel">
        <button className="acc-head" onClick={() => setOpen(o => !o)}>
          <span className="acc-title">
            {title}
            {badge > 0 && <span className="acc-badge">{badge}</span>}
          </span>
          <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>▾</span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div key="b"
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
              <div className="acc-body">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const L = ({ children }) => <label className="lbl">{children}</label>;
  const G = ({ cols = 2, children }) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 9 }}>{children}</div>
  );

  /* ════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {dark&&<div className="scanline"/>}

        {/* ── TOPBAR ── */}
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 32, height: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, borderRadius: dark ? 3 : 9,
              border: dark ? '1px solid rgba(20,255,180,.35)' : 'none',
              background: dark ? 'rgba(20,255,180,.07)' : 'linear-gradient(135deg,#0d3320,#1a5c38)',
              boxShadow: dark ? '0 0 16px rgba(20,255,180,.2)' : '0 3px 10px rgba(13,51,32,.35)',
            }}>📝</div>
            <div>
              <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 700, fontSize: 16, color: 'var(--tx)', lineHeight: 1 }}>
                Reference<span style={{ color: 'var(--acc)' }}>Gen</span>
                <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, color: 'var(--txm)', marginLeft: 7 }}>v1.0</span>
              </div>
              <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 8, color: 'var(--tx3)', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 1 }}>
                Document Tools #2 · 4 types · AI-powered
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }} />

          {/* Completion bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 90 }}>
              <div className="prog"><div className="prog-bar" style={{ width: `${pct}%` }} /></div>
              <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 8, color: 'var(--txm)', textAlign: 'right' }}>{pct}% complete</div>
            </div>
          </div>

          {/* Theme toggle */}
          <button onClick={() => setDark(d => !d)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
            border: dark ? '1px solid rgba(20,255,180,.18)' : '1.5px solid var(--bdr)',
            borderRadius: dark ? 3 : 7, background: 'transparent', cursor: 'pointer',
          }}>
            <div style={{
              width: 28, height: 14, borderRadius: 8, position: 'relative',
              background: dark ? 'var(--acc)' : '#b8ddc8',
              boxShadow: dark ? '0 0 8px rgba(20,255,180,.5)' : 'none',
            }}>
              <div style={{
                position: 'absolute', top: 2.5,
                left: dark ? 'auto' : 2, right: dark ? 2 : 'auto',
                width: 9, height: 9, borderRadius: '50%',
                background: dark ? '#060a09' : 'white', transition: 'all .2s',
              }} />
            </div>
            <span style={{ fontFamily: "'Fira Code',monospace", fontSize: 8.5, color: 'var(--txm)' }}>
              {dark ? 'VOID' : 'LIGHT'}
            </span>
          </button>
        </div>

        {/* ── TABS ── */}
        <div className="tabbar">
          {TABS.map(t => (
            <button key={t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── BODY ── */}
        <div className="body">

          {/* ── SIDEBAR ── */}
          <div className="sidebar">
            

            {/* Reference type picker */}
            <div>
              <div className="slbl">Reference type</div>
              {REF_TYPES.map(t => (
                <button key={t.id}
                  onClick={() => set('refType', t.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '7px 9px', marginBottom: 4,  cursor: 'pointer',
                    border: data.refType === t.id ? '1px solid var(--acc)' : dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)',
                    borderRadius: dark ? 3 : 7,
                    background: data.refType === t.id ? (dark ? 'rgba(20,255,180,.06)' : 'rgba(13,51,32,.05)') : 'transparent',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 13 }}>{t.icon}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11.5, fontWeight: 600, color: data.refType === t.id ? 'var(--acc)' : 'var(--tx)' }}>{t.label}</div>
                      <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 8, color: 'var(--txm)', marginTop: 1 }}>{t.tag}</div>
                    </div>
                  </div>
                  {data.refType === t.id && <span style={{ fontSize: 10, color: 'var(--acc)' }}>✓</span>}
                </button>
              ))}
            </div>

            {/* Completeness checklist */}
            <div>
              <div className="slbl">Completeness</div>
              {[
                ['Candidate name',  !!data.candidateName],
                ['Relationship',    !!data.relationship],
                ['Writer name',     !!data.writerName],
                ['Writer title',    !!data.writerTitle],
                ['Purpose',         !!data.purpose],
                ['Top qualities',   !!data.topQualities],
                ['Achievements',    !!data.keyAchievements],
              ].map(([l, done]) => (
                <div key={l} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '4px 9px', marginBottom: 3, borderRadius: dark ? 2 : 6,
                  background: done ? (dark ? 'rgba(20,255,180,.04)' : 'rgba(13,51,32,.04)') : 'transparent',
                  border: done
                    ? (dark ? '1px solid rgba(20,255,180,.1)' : '1.5px solid rgba(13,51,32,.08)')
                    : (dark ? '1px solid transparent' : '1.5px solid transparent'),
                }}>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10.5, color: done ? 'var(--tx)' : 'var(--txm)' }}>{l}</span>
                  <span style={{ fontSize: 11 }}>{done ? '✓' : '○'}</span>
                </div>
              ))}
            </div>

            {/* Export */}
            <div>
              <div className="slbl">Export</div>
              <button className="gbtn" onClick={printLetter} style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 5, padding: '7px 10px' }}>
                🖨 Print / Save PDF
              </button>
              <button className="gbtn" onClick={copyLetter} style={{ width: '100%', justifyContent: 'flex-start', padding: '7px 10px' }}>
                ⎘ Copy plain text
              </button>
            </div>

            
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ╔═══ BUILD ═══╗ */}
              {tab === 'build' && (
                <motion.div key="build" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

                  <Sec title="About the Candidate" open>
                    <G>
                      <div>
                        <L>Full name</L>
                        <input className="fi" placeholder="Jane Smith" value={data.candidateName} onChange={e => set('candidateName', e.target.value)} />
                      </div>
                      <div>
                        <L>Their current / recent role</L>
                        <input className="fi" placeholder="Software Engineer" value={data.candidateRole} onChange={e => set('candidateRole', e.target.value)} />
                      </div>
                      <div>
                        <L>Your relationship to them</L>
                        <input className="fi" placeholder="direct manager, lecturer, mentor…" value={data.relationship} onChange={e => set('relationship', e.target.value)} />
                      </div>
                      <div>
                        <L>Duration you've known them</L>
                        <input className="fi" placeholder="3 years, 2021–2024" value={data.duration} onChange={e => set('duration', e.target.value)} />
                      </div>
                    </G>
                  </Sec>

                  <Sec title="Your Details (the Referee)" open>
                    <G>
                      <div>
                        <L>Your full name</L>
                        <input className="fi" placeholder="Dr. Alex Johnson" value={data.writerName} onChange={e => set('writerName', e.target.value)} />
                      </div>
                      <div>
                        <L>Your title / position</L>
                        <input className="fi" placeholder="Head of Engineering" value={data.writerTitle} onChange={e => set('writerTitle', e.target.value)} />
                      </div>
                      <div>
                        <L>Organisation</L>
                        <input className="fi" placeholder="Acme Corp" value={data.writerOrg} onChange={e => set('writerOrg', e.target.value)} />
                      </div>
                      <div>
                        <L>Email (optional)</L>
                        <input className="fi" type="email" placeholder="alex@acme.com" value={data.writerEmail} onChange={e => set('writerEmail', e.target.value)} />
                      </div>
                    </G>
                  </Sec>

                  <Sec title="Letter Purpose & Recipient" open>
                    <G>
                      <div>
                        <L>Recipient name</L>
                        <input className="fi" placeholder="Hiring Manager / Admissions" value={data.recipientName} onChange={e => set('recipientName', e.target.value)} />
                      </div>
                      <div>
                        <L>Recipient organisation</L>
                        <input className="fi" placeholder="MIT / Google / etc." value={data.recipientOrg} onChange={e => set('recipientOrg', e.target.value)} />
                      </div>
                      <div style={{ gridColumn: '1/-1' }}>
                        <L>Purpose of the reference</L>
                        <input className="fi" placeholder="PhD application at MIT, Senior Engineer role at Google…" value={data.purpose} onChange={e => set('purpose', e.target.value)} />
                      </div>
                      <div style={{ gridColumn: '1/-1' }}>
                        <L>Letter tone</L>
                        <select className="fi" value={data.tone} onChange={e => set('tone', e.target.value)}>
                          {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </G>
                  </Sec>

                  <Sec title="Qualities & Achievements" open>
                    <div style={{ marginBottom: 10 }}>
                      <L>Top qualities / strengths</L>
                      <textarea className="fi" rows={2}
                        placeholder="leadership under pressure, analytical thinking, cross-team collaboration…"
                        value={data.topQualities} onChange={e => set('topQualities', e.target.value)} />
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <L>Key achievements or contributions</L>
                      <textarea className="fi" rows={3}
                        placeholder="Led migration to microservices (40% perf gain), published 3 papers, mentored 6 junior staff…"
                        value={data.keyAchievements} onChange={e => set('keyAchievements', e.target.value)} />
                    </div>
                    <div>
                      <L>Specific example or anecdote (optional but powerful)</L>
                      <textarea className="fi" rows={3}
                        placeholder="When the production system failed on launch day, Jane stayed through the night to diagnose and fix the issue…"
                        value={data.specificExample} onChange={e => set('specificExample', e.target.value)} />
                    </div>
                    <button className="gbtn" style={{ marginTop: 9 }}
                      onClick={() => { setTab('ai'); setAiMode('full_letter'); }}>
                      ✦ Generate full letter with AI
                    </button>
                  </Sec>

                  <Sec title="Letter Body (manual edit)">
                    <L>Edit or paste your letter body here</L>
                    <textarea className="fi" rows={10}
                      placeholder="Write or paste your letter body here, or use AI Write to generate it automatically…"
                      value={data.letterBody} onChange={e => set('letterBody', e.target.value)} />
                    <div className="char-count">{(data.letterBody || '').length} chars</div>
                  </Sec>

                  
                </motion.div>
              )}

              {/* ╔═══ AI WRITE ═══╗ */}
              {tab === 'ai' && (
                <motion.div key="ai" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  <div className="panel" style={{ padding: '14px 16px' }}>
                    <div className="lbl" style={{ marginBottom: 11 }}>✦ What should AI write?</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
                      {[
                        { id: 'full_letter', icon: '📝', label: 'Full Letter Body',     desc: '3–4 complete paragraphs' },
                        { id: 'opening',     icon: '✍️', label: 'Opening Paragraph',    desc: 'Strong, specific opener' },
                        { id: 'qualities',   icon: '⭐', label: 'Qualities Paragraph',   desc: 'Highlight key strengths' },
                        { id: 'closing',     icon: '🎯', label: 'Closing Paragraph',     desc: 'Confident, action-oriented' },
                        { id: 'improve',     icon: '✨', label: 'Improve Existing Text', desc: 'Elevate what you have' },
                      ].map(({ id, icon, label, desc }) => (
                        <button key={id} className={`gbtn ${aiMode === id ? 'on' : ''}`}
                          onClick={() => setAiMode(id)}
                          style={{
                            flexDirection: 'column', gap: 4, height: 'auto', padding: '11px 12px',
                            alignItems: 'flex-start',
                            background: aiMode === id ? (dark ? 'rgba(20,255,180,.07)' : 'rgba(13,51,32,.06)') : '',
                          }}>
                          <span style={{ fontSize: 18 }}>{icon}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)', textTransform: 'none', letterSpacing: 0 }}>{label}</span>
                          <span style={{ fontSize: 9.5, opacity: .6, textTransform: 'none', letterSpacing: 0, fontFamily: "'Outfit',sans-serif" }}>{desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="panel" style={{ padding: '14px 16px' }}>
                    <div className="lbl" style={{ marginBottom: 7 }}>
                      {aiMode === 'improve' ? 'Paste text to improve' : 'Additional context (optional — supplements Build tab data)'}
                    </div>
                    <textarea className="fi" rows={aiMode === 'improve' ? 6 : 3}
                      placeholder={
                        aiMode === 'full_letter' ? 'Any extra context not captured in Build tab…' :
                        aiMode === 'opening'     ? 'e.g. "She joined during a company restructure and immediately took charge"' :
                        aiMode === 'qualities'   ? 'e.g. "empathy, data-driven decision making, cross-functional influence"' :
                        aiMode === 'closing'     ? 'e.g. "She\'d be a perfect fit for a fast-paced startup environment"' :
                        'Paste your existing reference letter text here to improve it…'
                      }
                      value={aiCtx} onChange={e => setAiCtx(e.target.value)} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                      <button className="btn" onClick={runAI} disabled={aiLoad} style={{ padding: '9px 24px' }}>
                        {aiLoad
                          ? <><span style={{ display: 'inline-block', animation: 'spin .8s linear infinite' }}>⟳</span>&nbsp;Writing…</>
                          : '✦ Generate'}
                      </button>
                      {aiOut && !aiLoad && (
                        <button className="gbtn" onClick={applyAI}
                          style={{ borderColor: 'var(--acc)', color: 'var(--acc)' }}>
                          → Apply to letter
                        </button>
                      )}
                      {aiOut && !aiLoad && (
                        <button className="gbtn" onClick={() => { try { navigator.clipboard.writeText(aiOut); } catch {} }}>
                          ⎘ Copy
                        </button>
                      )}
                    </div>
                    {aiErr && (
                      <div style={{
                        marginTop: 8, padding: '7px 11px', borderRadius: dark ? 3 : 8,
                        background: dark ? 'rgba(255,107,107,.06)' : 'rgba(153,27,27,.04)',
                        border: dark ? '1px solid rgba(255,107,107,.2)' : '1.5px solid rgba(153,27,27,.12)',
                        fontFamily: "'Outfit',sans-serif", fontSize: 12, color: 'var(--err)',
                      }}>⚠ {aiErr}</div>
                    )}
                  </div>

                  {(aiOut || aiLoad) && (
                    <div>
                      <div className="lbl" style={{ marginBottom: 7 }}>✦ AI Output</div>
                      <div className="ai-box">
                        {aiOut}
                        {aiLoad && <span className="cur" />}
                      </div>
                    </div>
                  )}

                  <div className="panel" style={{ padding: '13px 15px' }}>
                    <div className="lbl" style={{ marginBottom: 9 }}>Pro tips</div>
                    {[
                      'The more context you fill in on the Build tab, the better the AI output — especially the specific example field',
                      'Generate multiple times and cherry-pick the best sentences from each attempt',
                      'Use "Improve Existing Text" on a mediocre draft to get a polished final version quickly',
                      'Tailor the tone to the institution: "Formal" for law firms and academia, "Warm & Enthusiastic" for startups',
                    ].map((tip, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--acc)', flexShrink: 0, fontFamily: "'Fira Code',monospace", fontSize: 10, marginTop: 2 }}>›</span>
                        <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: 'var(--tx2)', lineHeight: 1.65 }}>{tip}</span>
                      </div>
                    ))}
                  </div>

                  
                </motion.div>
              )}

              {/* ╔═══ PREVIEW ═══╗ */}
              {tab === 'preview' && (
                <motion.div key="preview" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  <div style={{ display: 'flex', gap: 9, alignItems: 'center', flexWrap: 'wrap' }}>
                    <button className="btn" onClick={printLetter} style={{ padding: '9px 22px' }}>
                      🖨 Print / Save as PDF
                    </button>
                    <button className="gbtn" onClick={copyLetter}>⎘ Copy plain text</button>
                    <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 9.5, color: 'var(--txm)' }}>
                      Type: <span style={{ color: 'var(--acc)' }}>{REF_TYPES.find(t => t.id === data.refType)?.label}</span>
                      &nbsp;·&nbsp;Tone: <span style={{ color: 'var(--acc)' }}>{data.tone}</span>
                    </div>
                  </div>

                  {/* Letter preview */}
                  <div style={{ padding: 28, borderRadius: 4, background: dark ? 'var(--s3)' : '#e8f0eb', overflow: 'auto' }}>
                    <div className="letter-preview">
                      {buildLetter(data).split('\n').map((line, i) => (
                        <p key={i} style={{ marginBottom: line === '' ? 12 : 0 }}>{line || '\u00A0'}</p>
                      ))}
                    </div>
                  </div>

                  
                </motion.div>
              )}

              {/* ╔═══ TYPES ═══╗ */}
              {tab === 'types' && (
                <motion.div key="types" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: 'var(--tx2)', lineHeight: 1.7, marginBottom: 2 }}>
                    Choose the right reference type — each has different conventions, audiences, and expectations.
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 13 }}>
                    {[
                      {
                        id: 'academic', icon: '🎓', label: 'Academic Reference',
                        who: 'Professors, supervisors, research advisors',
                        when: 'University applications, PhD programmes, scholarships, fellowships',
                        focus: 'Intellectual ability, research skills, academic potential, work ethic, curiosity',
                        tips: ['Address specific academic achievements', 'Mention grades or class standing if strong', 'Reference specific papers, projects, or thesis work', 'Comment on potential for graduate-level study'],
                      },
                      {
                        id: 'professional', icon: '💼', label: 'Professional Reference',
                        who: 'Direct managers, senior colleagues, clients',
                        when: 'Job applications, promotions, consulting engagements',
                        focus: 'Skills, output quality, teamwork, leadership, reliability',
                        tips: ['Lead with measurable achievements', 'Describe specific projects and impact', 'Address how they handled challenges', 'Mention promotions or increased responsibilities'],
                      },
                      {
                        id: 'character', icon: '🤝', label: 'Character Reference',
                        who: 'Community leaders, coaches, mentors, family friends',
                        when: 'Legal proceedings, immigration, community roles, volunteer positions',
                        focus: 'Personal integrity, community involvement, reliability, values',
                        tips: ['Focus on who they are as a person', 'Cite specific acts of integrity or community contribution', 'Avoid exaggeration — courts are discerning', 'Be prepared to be contacted'],
                      },
                      {
                        id: 'employer', icon: '📋', label: 'Employer Reference',
                        who: 'HR departments, line managers',
                        when: 'Background checks, visa applications, tenancy agreements',
                        focus: 'Employment dates, role, performance, conduct, reason for leaving',
                        tips: ['Keep it factual and verifiable', 'Confirm employment dates precisely', 'Avoid subjective negative commentary', 'State rehire eligibility clearly if asked'],
                      },
                    ].map(t => (
                      <div key={t.id} style={{
                        padding: '16px 18px', borderRadius: dark ? 3 : 12,
                        border: data.refType === t.id ? '1px solid var(--acc)' : dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)',
                        background: data.refType === t.id ? (dark ? 'rgba(20,255,180,.04)' : 'rgba(13,51,32,.04)') : (dark ? 'var(--s2)' : 'var(--s1)'),
                      }}>
                        <div style={{ display: 'flex', gap: 9, alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontSize: 20 }}>{t.icon}</span>
                          <div>
                            <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 14, color: 'var(--tx)' }}>{t.label}</div>
                            {data.refType === t.id && <span className="type-badge" style={{ marginTop: 3 }}>ACTIVE</span>}
                          </div>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <div className="lbl">Written by</div>
                          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12.5, color: 'var(--tx2)' }}>{t.who}</div>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <div className="lbl">Used for</div>
                          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12.5, color: 'var(--tx2)' }}>{t.when}</div>
                        </div>
                        <div style={{ marginBottom: 10 }}>
                          <div className="lbl">Focus areas</div>
                          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12.5, color: 'var(--tx2)' }}>{t.focus}</div>
                        </div>
                        <div className="lbl" style={{ marginBottom: 5 }}>Key tips</div>
                        {t.tips.map((tip, i) => (
                          <div key={i} style={{ display: 'flex', gap: 7, marginBottom: 5, alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--acc)', flexShrink: 0, fontFamily: "'Fira Code',monospace", fontSize: 9, marginTop: 3 }}>›</span>
                            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: 'var(--tx2)', lineHeight: 1.6 }}>{tip}</span>
                          </div>
                        ))}
                        {data.refType !== t.id && (
                          <button className="gbtn" onClick={() => set('refType', t.id)} style={{ marginTop: 8, fontSize: 9.5 }}>
                            Use this type
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  
                </motion.div>
              )}

              {/* ╔═══ GUIDE ═══╗ */}
              {tab === 'guide' && (
                <motion.div key="guide" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                  <div className="panel" style={{ padding: '20px 22px' }}>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700, color: 'var(--tx)', marginBottom: 4 }}>
                      Write a great reference in 5 minutes
                    </div>
                    <div style={{ fontFamily: "'Fira Code',monospace", fontSize: 9, color: 'var(--txm)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 20 }}>
                      step-by-step · ai-powered · print-ready
                    </div>
                    {[
                      { n: 1, t: 'Pick a reference type', d: 'Use the sidebar to choose Academic, Professional, Character, or Employer. Each type has different conventions — the AI adapts its output accordingly.' },
                      { n: 2, t: 'Fill in the Build tab',  d: 'Add candidate details, your own details, the purpose of the letter, and critically — the qualities and specific achievements. The more detail you provide, the better the letter.' },
                      { n: 3, t: 'Generate with AI',       d: 'Go to ✦ AI Write and hit Generate. The AI reads everything you filled in on the Build tab. If you want just a section (opening, qualities, closing), pick that mode.' },
                      { n: 4, t: 'Review and edit',        d: 'Click "Apply to letter" to put the AI text into your letter body. Switch to ◉ Preview at any time to see the full formatted letter. Edit directly in the Build tab.' },
                      { n: 5, t: 'Export',                 d: 'Click "Print / Save as PDF" in the sidebar or Preview tab. In the print dialog choose "Save as PDF". Or use "Copy plain text" to paste into Word / Google Docs.' },
                    ].map(({ n, t, d }) => (
                      <div key={n} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                          <div className="step-num">{n}</div>
                          {n < 5 && <div style={{ width: 1.5, flex: 1, marginTop: 5, background: dark ? 'rgba(20,255,180,.1)' : 'rgba(13,51,32,.12)' }} />}
                        </div>
                        <div style={{ flex: 1, paddingBottom: 4 }}>
                          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 600, color: 'var(--tx)', marginBottom: 4 }}>{t}</div>
                          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13.5, color: 'var(--tx2)', lineHeight: 1.72 }}>{d}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="panel" style={{ padding: '18px 22px' }}>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 600, color: 'var(--tx)', marginBottom: 14 }}>
                      ✦ Reference letter best practices
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[
                        { icon: '📏', t: 'Keep it one page',      d: 'One page is standard. Two pages only for senior academic positions or fellowships.' },
                        { icon: '🎯', t: 'Be specific',           d: '"Led a team of 12" beats "good leader". Real examples are 10× more persuasive than adjectives.' },
                        { icon: '📊', t: 'Add metrics',           d: '"Increased sales 34%" or "published 4 peer-reviewed papers". Numbers establish credibility.' },
                        { icon: '✍️', t: 'Write in first person', d: 'Always "I" — never third person about yourself. "I have known Jane for…" not "The referee has…"' },
                        { icon: '⏱', t: 'Fresh is better',       d: 'A reference from someone who worked with the candidate in the last 2 years carries far more weight.' },
                        { icon: '📧', t: 'Offer to follow up',    d: 'A closing line offering to discuss further signals genuine confidence in your recommendation.' },
                      ].map(({ icon, t, d }) => (
                        <div key={t} style={{
                          padding: '11px 13px', borderRadius: dark ? 3 : 9,
                          border: dark ? '1px solid var(--bdr)' : '1.5px solid var(--bdr)',
                          background: dark ? 'rgba(0,0,0,.25)' : 'rgba(245,251,248,.8)',
                        }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                            <span style={{ fontSize: 16 }}>{icon}</span>
                            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{t}</span>
                          </div>
                          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: 'var(--tx2)', lineHeight: 1.6 }}>{d}</div>
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