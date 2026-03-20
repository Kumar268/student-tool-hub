import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   RSA CRYPTOGRAPHY DEMO
   Theme: Dark Industrial Cyber / Light Blueprint
   Fonts: Oxanium (display) + IBM Plex Mono + Crimson Pro
   Series arch: topbar · tabs · sidebar · main · ads
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=IBM+Plex+Mono:wght@300;400;500;600&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{font-family:'Crimson Pro',serif}

@keyframes fadeup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes flow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes lock-pulse{0%,100%{box-shadow:0 0 0 0 rgba(34,197,94,.3)}50%{box-shadow:0 0 0 8px rgba(34,197,94,0)}}
@keyframes bit-stream{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes spin{to{transform:rotate(360deg)}}

/* ── DARK: industrial cyber slate ── */
.dk{
  --bg:#060a0f;--s1:#0a1018;--s2:#0e151f;
  --bdr:#152030;--bdr2:rgba(56,189,248,.2);
  --acc:#38bdf8;--acc2:#818cf8;--acc3:#34d399;
  --err:#f87171;--warn:#fbbf24;
  --tx:#e0f2fe;--tx2:#7dd3fc;--tx3:#1e3a5f;--tx4:#0c2040;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    radial-gradient(ellipse 70% 40% at 50% 0%,rgba(56,189,248,.07),transparent),
    repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(56,189,248,.025) 40px),
    repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(56,189,248,.025) 40px);
}
/* ── LIGHT: blueprint paper ── */
.lt{
  --bg:#f0f6ff;--s1:#ffffff;--s2:#e8f2ff;
  --bdr:#c5d8f0;--bdr2:#1d4ed8;
  --acc:#1d4ed8;--acc2:#6d28d9;--acc3:#065f46;
  --err:#991b1b;--warn:#92400e;
  --tx:#0c1a2e;--tx2:#1e40af;--tx3:#3b82f6;--tx4:#1d4ed8;
  min-height:100vh;background:var(--bg);color:var(--tx);
  background-image:
    repeating-linear-gradient(0deg,transparent,transparent 23px,rgba(29,78,216,.07) 24px),
    repeating-linear-gradient(90deg,transparent,transparent 23px,rgba(29,78,216,.07) 24px);
}

/* ── TOPBAR ── */
.topbar{
  height:44px;position:sticky;top:0;z-index:400;
  display:flex;align-items:center;padding:0 16px;gap:10px;
  backdrop-filter:blur(20px);
}
.dk .topbar{background:rgba(6,10,15,.97);border-bottom:1px solid var(--bdr);}
.lt .topbar{background:rgba(240,246,255,.97);border-bottom:1.5px solid var(--bdr);box-shadow:0 1px 12px rgba(29,78,216,.07);}

/* ── TABS ── */
.tabbar{display:flex;overflow-x:auto}
.tabbar::-webkit-scrollbar{display:none}
.dk .tabbar{background:var(--s1);border-bottom:1px solid var(--bdr);}
.lt .tabbar{background:var(--s1);border-bottom:1.5px solid var(--bdr);}
.tab{
  height:38px;padding:0 14px;border:none;cursor:pointer;background:transparent;
  border-bottom:2px solid transparent;font-family:'IBM Plex Mono',monospace;
  font-size:10px;letter-spacing:.1em;text-transform:uppercase;
  display:flex;align-items:center;gap:5px;white-space:nowrap;transition:all .14s;
}
.dk .tab{color:var(--tx3);}
.dk .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(56,189,248,.05);}
.dk .tab:hover:not(.on){color:var(--tx2);}
.lt .tab{color:var(--tx3);}
.lt .tab.on{color:var(--acc);border-bottom-color:var(--acc);background:rgba(29,78,216,.05);font-weight:600;}
.lt .tab:hover:not(.on){color:var(--tx2);}

/* ── LAYOUT ── */
.body{display:grid;grid-template-columns: 1fr;min-height:calc(100vh - 82px);}
@media(min-width:1024px){.body{grid-template-columns: 220px 1fr !important;}}
.sidebar{padding:13px 11px;display:flex;flex-direction:column;gap:11px;overflow-y:auto;}
.dk .sidebar{border-right:1px solid var(--bdr);background:var(--s1);}
.lt .sidebar{border-right:1.5px solid var(--bdr);background:var(--s2);}
.main{padding:14px 16px;display:flex;flex-direction:column;gap:14px;}

/* ── PANELS ── */
.dk .panel{background:var(--s2);border:1px solid var(--bdr);border-radius:3px;}
.lt .panel{background:var(--s1);border:1.5px solid var(--bdr);border-radius:10px;box-shadow:0 2px 16px rgba(29,78,216,.05);}

/* ── KEY CARDS ── */
.key-card{padding:12px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;}
.dk .key-card.pub{border:1px solid rgba(56,189,248,.25);border-radius:3px;background:rgba(56,189,248,.06);}
.lt .key-card.pub{border:1.5px solid rgba(29,78,216,.25);border-radius:8px;background:rgba(29,78,216,.05);}
.dk .key-card.prv{border:1px solid rgba(129,140,248,.25);border-radius:3px;background:rgba(129,140,248,.06);}
.lt .key-card.prv{border:1.5px solid rgba(109,40,217,.25);border-radius:8px;background:rgba(109,40,217,.05);}

/* ── BUTTONS ── */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:6px;
  padding:8px 18px;cursor:pointer;font-family:'IBM Plex Mono',monospace;
  font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
  transition:all .15s;border:none;
}
.dk .btn{background:var(--acc);color:#060a0f;border-radius:2px;box-shadow:0 0 18px rgba(56,189,248,.28);}
.dk .btn:hover{background:#7dd3fc;box-shadow:0 0 30px rgba(56,189,248,.5);transform:translateY(-1px);}
.lt .btn{background:var(--acc);color:#fff;border-radius:7px;box-shadow:0 4px 14px rgba(29,78,216,.35);}
.lt .btn:hover{background:#1e40af;box-shadow:0 8px 24px rgba(29,78,216,.45);transform:translateY(-1px);}
.btn-g{
  display:inline-flex;align-items:center;justify-content:center;gap:4px;
  padding:5px 10px;cursor:pointer;font-family:'IBM Plex Mono',monospace;
  font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;background:transparent;transition:all .12s;
}
.dk .btn-g{border:1px solid var(--bdr);border-radius:2px;color:var(--tx3);}
.dk .btn-g:hover,.dk .btn-g.on{border-color:var(--acc);color:var(--acc);background:rgba(56,189,248,.06);}
.lt .btn-g{border:1.5px solid var(--bdr);border-radius:6px;color:var(--tx3);}
.lt .btn-g:hover,.lt .btn-g.on{border-color:var(--acc);color:var(--acc);background:rgba(29,78,216,.06);}

/* ── INPUTS ── */
.inp{
  width:100%;padding:7px 10px;font-family:'IBM Plex Mono',monospace;
  font-size:13px;outline:none;transition:all .13s;
}
.dk .inp{background:rgba(0,0,0,.5);border:1px solid var(--bdr);color:var(--tx);border-radius:2px;}
.dk .inp:focus{border-color:var(--acc);box-shadow:0 0 0 2px rgba(56,189,248,.1);}
.lt .inp{background:#f0f6ff;border:1.5px solid var(--bdr);color:var(--tx);border-radius:7px;}
.lt .inp:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(29,78,216,.1);}

/* ── LABELS / MISC ── */
.lbl{font-family:'IBM Plex Mono',monospace;font-size:8.5px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;display:block;margin-bottom:5px;}
.dk .lbl{color:rgba(56,189,248,.45);}
.lt .lbl{color:var(--acc);}
.slbl{font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:.22em;text-transform:uppercase;margin-bottom:7px;}
.dk .slbl{color:rgba(56,189,248,.35);}
.lt .slbl{color:var(--acc);}
.metab{padding:9px 12px;}
.dk .metab{border:1px solid rgba(56,189,248,.1);border-radius:2px;background:rgba(56,189,248,.03);}
.lt .metab{border:1.5px solid rgba(29,78,216,.12);border-radius:7px;background:rgba(29,78,216,.04);}
.ad{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;}
.dk .ad{background:rgba(56,189,248,.012);border:1px dashed rgba(56,189,248,.1);border-radius:2px;}
.lt .ad{background:rgba(29,78,216,.03);border:1.5px dashed rgba(29,78,216,.14);border-radius:8px;}
.ad span{font-family:'IBM Plex Mono',monospace;font-size:8.5px;letter-spacing:.14em;text-transform:uppercase;}
.dk .ad span{color:var(--tx3);}
.lt .ad span{color:var(--tx3);}

/* ── STEP ── */
.step{display:flex;gap:12px;padding:14px 16px;margin-bottom:10px;}
.dk .step{border:1px solid var(--bdr);border-radius:3px;background:linear-gradient(135deg,var(--s1),var(--s2));}
.lt .step{border:1.5px solid var(--bdr);border-radius:10px;background:var(--s1);box-shadow:0 2px 12px rgba(29,78,216,.05);}
.step-n{
  width:28px;height:28px;border-radius:50%;display:flex;align-items:center;
  justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:11px;
  font-weight:600;flex-shrink:0;
}
.dk .step-n{border:1px solid rgba(56,189,248,.3);background:rgba(56,189,248,.08);color:var(--acc);}
.lt .step-n{border:1.5px solid rgba(29,78,216,.3);background:rgba(29,78,216,.07);color:var(--acc);}

/* ── FORMULA BLOCK ── */
.formula{
  padding:10px 14px;margin-top:8px;font-family:'IBM Plex Mono',monospace;
  font-size:13px;line-height:1.7;letter-spacing:.02em;overflow-x:auto;
}
.dk .formula{background:rgba(0,0,0,.5);border:1px solid rgba(56,189,248,.12);border-radius:2px;color:#93c5fd;border-left:2px solid rgba(56,189,248,.4);}
.lt .formula{background:#f0f6ff;border:1.5px solid rgba(29,78,216,.15);border-radius:6px;color:#1e3a8a;border-left:3px solid rgba(29,78,216,.35);}

/* ── CRYPTO ANIMATION ── */
.cipher-stream{
  font-family:'IBM Plex Mono',monospace;font-size:9px;overflow:hidden;white-space:nowrap;
  opacity:.35;letter-spacing:.1em;line-height:1.5;pointer-events:none;
}
.cipher-inner{display:inline-block;animation:bit-stream 14s linear infinite;}

/* ── RESULT PILL ── */
.pill{padding:6px 12px;border-radius:99px;font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:600;}
.dk .pill.enc{background:rgba(248,113,113,.12);border:1px solid rgba(248,113,113,.2);color:#fca5a5;}
.lt .pill.enc{background:rgba(153,27,27,.06);border:1.5px solid rgba(153,27,27,.2);color:#991b1b;}
.dk .pill.dec{background:rgba(52,211,153,.12);border:1px solid rgba(52,211,153,.2);color:#6ee7b7;animation:lock-pulse 2s ease-in-out infinite;}
.lt .pill.dec{background:rgba(6,95,70,.06);border:1.5px solid rgba(6,95,70,.2);color:#065f46;}

/* ── PROSE ── */
.prose{font-family:'Crimson Pro',serif;}
.prose p{font-size:16px;line-height:1.82;margin-bottom:14px;color:var(--tx2);}
.prose h3{font-family:'Oxanium',sans-serif;font-size:14.5px;font-weight:800;margin:24px 0 8px;color:var(--tx);text-transform:uppercase;letter-spacing:.05em;}
.prose ul{padding-left:22px;margin-bottom:14px;}
.prose li{font-size:16px;line-height:1.75;margin-bottom:6px;color:var(--tx2);}
.prose strong{font-weight:600;color:var(--tx);}
.faq{padding:12px 16px;margin-bottom:9px;}
.dk .faq{border:1px solid var(--bdr);border-radius:3px;background:rgba(0,0,0,.4);}
.lt .faq{border:1.5px solid var(--bdr);border-radius:9px;background:rgba(29,78,216,.03);}
`;

/* ═══ ICONS ═══ */
const Svg = ({d,s=14,sw=1.8}) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {(Array.isArray(d)?d:[d]).map((p,i)=><path key={i} d={p}/>)}
  </svg>
);
const I = {
  key:    s=><Svg s={s} d={["M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"]}/>,
  lock:   s=><Svg s={s} d={["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z","M7 11V7a5 5 0 0 1 10 0v4"]}/>,
  unlock: s=><Svg s={s} d={["M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z","M7 11V7a5 5 0 0 1 9.9-1"]}/>,
  shield: s=><Svg s={s} d={["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"]}/>,
  book:   s=><Svg s={s} d={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z","M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]}/>,
  calc:   s=><Svg s={s} d={["M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z","M8 6h8M8 10h8M8 14h4"]}/>,
  arr:    s=><Svg s={s} d="M5 12h14M12 5l7 7-7 7"/>,
  info:   s=><Svg s={s} d={["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M12 16v-4M12 8h.01"]}/>,
};

/* ═══════════════════════════════════════════════════════════
   RSA ENGINE
═══════════════════════════════════════════════════════════ */
function isPrime(n) {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) if (n % i === 0 || n % (i + 2) === 0) return false;
  return true;
}
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function modInverse(a, m) {
  // Extended Euclidean
  let [old_r, r] = [a, m], [old_s, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
  }
  return ((old_s % m) + m) % m;
}
function computeRSA(p, q, e, msg) {
  if (!isPrime(p) || !isPrime(q) || p === q) return null;
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  if (gcd(e, phi) !== 1) return null;
  const d = modInverse(e, phi);
  const mBig = BigInt(msg) % BigInt(n);
  const cBig = mBig ** BigInt(e) % BigInt(n);
  const dBig = cBig ** BigInt(d) % BigInt(n);
  const steps = {
    n, phi, e, d,
    modInvCheck: (BigInt(e) * BigInt(d)) % BigInt(phi),
    encrypted: Number(cBig),
    decrypted: Number(dBig),
    encSteps: [`m = ${msg}`, `c = m^e mod n`, `c = ${msg}^${e} mod ${n}`, `c = ${Number(cBig)}`],
    decSteps: [`c = ${Number(cBig)}`, `m = c^d mod n`, `m = ${Number(cBig)}^${d} mod ${n}`, `m = ${Number(dBig)}`],
  };
  return steps;
}

/* ═══ SUGGESTED PRIME PAIRS ═══════════════════════════════ */
const PRIME_PAIRS = [
  { p: 61,   q: 53,   label: 'Classic (small)' },
  { p: 97,   q: 89,   label: 'Medium primes' },
  { p: 127,  q: 131,  label: 'Twin-ish' },
  { p: 251,  q: 241,  label: 'Larger primes' },
];

const PAGE_TABS = [
  { id: 'demo',    label: '⚷ Demo' },
  { id: 'steps',   label: '∑ Steps' },
  { id: 'encode',  label: '▦ Encode' },
  { id: 'guide',   label: '? Guide' },
  { id: 'learn',   label: '∂ Theory' },
];

/* bit-stream chars */
const STREAM = '01101001010110001100010101101001110100110110000110100101';

export default function RSADemo() {
  const [dark, setDark] = useState(true);
  const cls = dark ? 'dk' : 'lt';

  const [p, setP] = useState(61);
  const [q, setQ] = useState(53);
  const [e, setE] = useState(17);
  const [msg, setMsg] = useState(42);
  const [tab, setTab] = useState('demo');
  const [pErr, setPErr] = useState('');
  const [qErr, setQErr] = useState('');
  const [eErr, setEErr] = useState('');

  const rsa = useMemo(() => {
    setPErr(!isPrime(p) ? 'Not prime' : p === q ? 'Must differ from q' : '');
    setQErr(!isPrime(q) ? 'Not prime' : p === q ? 'Must differ from p' : '');
    const ef = e >= 3 && e < (p - 1) * (q - 1) ? '' : 'Must be 3 ≤ e < φ(n)';
    setEErr(ef);
    return computeRSA(p, q, e, msg);
  }, [p, q, e, msg]);

  const valid = !!rsa && !pErr && !qErr && !eErr;

  // ── Text encoder (char→num→encrypt each byte)
  const [textIn, setTextIn] = useState('HELLO');
  const encodedChars = useMemo(() => {
    if (!rsa) return [];
    return textIn.slice(0, 8).split('').map(ch => {
      const code = ch.charCodeAt(0) % rsa.n;
      const enc = Number(BigInt(code) ** BigInt(rsa.e) % BigInt(rsa.n));
      return { ch, code, enc };
    });
  }, [textIn, rsa]);

  return (
    <>
      <style>{STYLES}</style>
      <div className={cls}>

        {/* ══ TOPBAR ══ */}
        <div className="topbar">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 30, height: 30, borderRadius: dark ? 3 : 8, flexShrink: 0,
              border: dark ? '1px solid rgba(56,189,248,.4)' : 'none',
              background: dark ? 'rgba(56,189,248,.08)' : 'linear-gradient(135deg,#1d4ed8,#6d28d9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: dark ? 'var(--acc)' : '#fff',
              boxShadow: dark ? '0 0 14px rgba(56,189,248,.25)' : '0 3px 10px rgba(29,78,216,.4)',
            }}>
              {I.shield(15)}
            </div>
            <div>
              <div style={{ fontFamily: "'Oxanium',sans-serif", fontWeight: 800, fontSize: 14, color: 'var(--tx)', letterSpacing: '.04em', lineHeight: 1 }}>
                RSA<span style={{ color: 'var(--acc)' }}>.lab</span>
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8, color: 'var(--tx3)', letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 1 }}>
                Asymmetric Crypto Demo
              </div>
            </div>
          </div>

          {/* Bit stream */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
            <div className="cipher-stream" style={{ width: '100%' }}>
              <div className="cipher-inner">
                {(STREAM + STREAM + STREAM).split('').map((b, i) => (
                  <span key={i} style={{ color: b === '1' ? 'var(--acc)' : 'var(--tx3)', marginRight: 2 }}>{b}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Status */}
          {valid && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px',
              borderRadius: dark ? 2 : 7,
              border: dark ? '1px solid rgba(52,211,153,.2)' : '1.5px solid rgba(6,95,70,.2)',
              background: dark ? 'rgba(52,211,153,.05)' : 'rgba(6,95,70,.04)',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--acc3)', boxShadow: dark ? '0 0 6px var(--acc3)' : 'none' }} />
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 9.5, color: dark ? '#6ee7b7' : 'var(--acc3)', letterSpacing: '.07em' }}>
                n={rsa?.n} · φ={rsa?.phi} · e={rsa?.e} · d={rsa?.d}
              </span>
            </div>
          )}

          {/* Theme */}
          <button onClick={() => setDark(d => !d)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
            border: dark ? '1px solid rgba(56,189,248,.18)' : '1.5px solid var(--bdr)',
            borderRadius: dark ? 2 : 6, background: 'transparent', cursor: 'pointer',
          }}>
            <div style={{
              width: 28, height: 14, borderRadius: 8, position: 'relative',
              background: dark ? 'var(--acc)' : '#c5d8f0',
              boxShadow: dark ? '0 0 8px rgba(56,189,248,.5)' : 'none',
            }}>
              <div style={{
                position: 'absolute', top: 2.5,
                left: dark ? 'auto' : 2, right: dark ? 2 : 'auto',
                width: 9, height: 9, borderRadius: '50%',
                background: dark ? '#060a0f' : 'white', transition: 'all .2s',
              }} />
            </div>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 8.5, letterSpacing: '.1em', color: 'var(--tx3)' }}>
              {dark ? 'CYBER' : 'PRINT'}
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
            

            {/* Parameters */}
            <div>
              <div className="slbl">Parameters</div>

              {/* P */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div className="lbl" style={{ margin: 0 }}>Prime p</div>
                  {isPrime(p) && <span style={{ fontSize: 8.5, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--acc3)' }}>✓ prime</span>}
                  {pErr && <span style={{ fontSize: 8.5, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--err)' }}>{pErr}</span>}
                </div>
                <input className="inp" type="number" value={p}
                  onChange={e => setP(parseInt(e.target.value) || 2)}
                  style={{ borderColor: pErr ? 'var(--err)' : '' }} />
              </div>

              {/* Q */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div className="lbl" style={{ margin: 0 }}>Prime q</div>
                  {isPrime(q) && q !== p && <span style={{ fontSize: 8.5, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--acc3)' }}>✓ prime</span>}
                  {qErr && <span style={{ fontSize: 8.5, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--err)' }}>{qErr}</span>}
                </div>
                <input className="inp" type="number" value={q}
                  onChange={e => setQ(parseInt(e.target.value) || 2)}
                  style={{ borderColor: qErr ? 'var(--err)' : '' }} />
              </div>

              {/* E */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div className="lbl" style={{ margin: 0 }}>Public exp e</div>
                  {!eErr && <span style={{ fontSize: 8.5, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--acc3)' }}>✓ valid</span>}
                  {eErr && <span style={{ fontSize: 8.5, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--err)' }}>{eErr}</span>}
                </div>
                <input className="inp" type="number" value={e}
                  onChange={ev => setE(parseInt(ev.target.value) || 3)}
                  style={{ borderColor: eErr ? 'var(--err)' : '' }} />
                <div style={{ fontSize: 9, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--tx3)', marginTop: 3, lineHeight: 1.5 }}>
                  Must be coprime with φ(n)
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: 10 }}>
                <div className="lbl">Message m</div>
                <input className="inp" type="number" value={msg}
                  onChange={e => setMsg(parseInt(e.target.value) || 0)} />
                {rsa && <div style={{ fontSize: 9, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--tx3)', marginTop: 3 }}>must be &lt; n ({rsa.n})</div>}
              </div>
            </div>

            {/* Preset pairs */}
            <div>
              <div className="slbl">Preset pairs</div>
              {PRIME_PAIRS.map((pair, i) => (
                <button key={i} className="btn-g"
                  onClick={() => { setP(pair.p); setQ(pair.q); }}
                  style={{
                    width: '100%', justifyContent: 'flex-start', marginBottom: 4,
                    padding: '5px 9px', fontSize: 9.5,
                    background: p === pair.p && q === pair.q ? (dark ? 'rgba(56,189,248,.07)' : 'rgba(29,78,216,.06)') : '',
                    borderColor: p === pair.p && q === pair.q ? 'var(--acc)' : '',
                    color: p === pair.p && q === pair.q ? 'var(--acc)' : '',
                  }}>
                  p={pair.p}, q={pair.q}
                  <span style={{ marginLeft: 'auto', opacity: .5, fontSize: 8.5 }}>{pair.label}</span>
                </button>
              ))}
            </div>

            {/* Derived values */}
            {rsa && (
              <div>
                <div className="slbl">Derived</div>
                {[
                  ['n = p·q', rsa.n],
                  ['φ(n)', rsa.phi],
                  ['e (public)', rsa.e],
                  ['d (private)', rsa.d],
                ].map(([l, v]) => (
                  <div key={l} className="metab" style={{ marginBottom: 5 }}>
                    <div style={{ fontSize: 8, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 1 }}>{l}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--acc)' }}>{v}</div>
                  </div>
                ))}
              </div>
            )}

            
          </div>

          {/* MAIN */}
          <div className="main">
            <AnimatePresence mode="wait">

              {/* ══════ DEMO ══════ */}
              {tab === 'demo' && (
                <motion.div key="demo" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>

                  {!valid && (
                    <div style={{
                      padding: '10px 14px', borderRadius: dark ? 2 : 8,
                      background: dark ? 'rgba(248,113,113,.07)' : 'rgba(153,27,27,.05)',
                      border: dark ? '1px solid rgba(248,113,113,.2)' : '1.5px solid rgba(153,27,27,.15)',
                      fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, color: 'var(--err)',
                    }}>
                      ⚠ {pErr || qErr || eErr || 'Enter valid prime numbers in the sidebar'}
                    </div>
                  )}

                  {/* Key cards */}
                  {valid && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="key-card pub">
                        <div>
                          <div style={{ fontSize: 8.5, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: '.15em', textTransform: 'uppercase', color: dark ? 'rgba(56,189,248,.5)' : 'var(--acc)', marginBottom: 4 }}>
                            🔑 Public Key
                          </div>
                          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 16, fontWeight: 600, color: 'var(--tx)' }}>
                            ({rsa.e}, {rsa.n})
                          </div>
                          <div style={{ fontSize: 10.5, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--tx3)', marginTop: 3 }}>
                            e={rsa.e}, n={rsa.n}
                          </div>
                        </div>
                        <div style={{ opacity: .4, color: 'var(--acc)' }}>{I.unlock(20)}</div>
                      </div>
                      <div className="key-card prv">
                        <div>
                          <div style={{ fontSize: 8.5, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: '.15em', textTransform: 'uppercase', color: dark ? 'rgba(129,140,248,.5)' : 'var(--acc2)', marginBottom: 4 }}>
                            🔒 Private Key
                          </div>
                          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 16, fontWeight: 600, color: 'var(--tx)' }}>
                            ({rsa.d}, {rsa.n})
                          </div>
                          <div style={{ fontSize: 10.5, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--tx3)', marginTop: 3 }}>
                            d={rsa.d}, n={rsa.n}
                          </div>
                        </div>
                        <div style={{ opacity: .4, color: 'var(--acc2)' }}>{I.lock(20)}</div>
                      </div>
                    </div>
                  )}

                  {/* Encryption playground */}
                  {valid && (
                    <div className="panel" style={{ padding: '16px 18px' }}>
                      <div className="lbl" style={{ marginBottom: 12 }}>⚡ Encryption Playground</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center' }}>
                        {/* Original */}
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 9.5, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 7 }}>Plaintext m</div>
                          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 32, fontWeight: 700, color: 'var(--tx)', lineHeight: 1, marginBottom: 5 }}>
                            {msg}
                          </div>
                          <div style={{ fontSize: 9.5, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--tx3)' }}>message value</div>
                        </div>

                        {/* Arrow */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{ fontSize: 9, fontFamily: "'IBM Plex Mono',monospace", color: 'var(--acc)', letterSpacing: '.07em' }}>m^e mod n</div>
                          <div style={{ color: 'var(--acc)', opacity: .7 }}>{I.arr(18)}</div>
                          <div style={{ fontSize: 9, fontFamily: "'IBM Plex Mono',monospace", color: dark ? 'rgba(129,140,248,.6)' : 'var(--acc2)', letterSpacing: '.07em' }}>c^d mod n</div>
                          <div style={{ color: dark ? '#818cf8' : 'var(--acc2)', opacity: .7, transform: 'rotate(180deg)' }}>{I.arr(18)}</div>
                        </div>

                        {/* Encrypted / Decrypted */}
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 7 }}>
                          <div>
                            <div style={{ fontSize: 9.5, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 5 }}>Ciphertext c</div>
                            <span className="pill enc">{rsa.encrypted}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: 9.5, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 5 }}>Decrypted m'</div>
                            <span className="pill dec">{rsa.decrypted}</span>
                          </div>
                        </div>
                      </div>

                      {rsa.decrypted === (msg % rsa.n) && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          style={{ marginTop: 12, padding: '7px 12px', borderRadius: dark ? 2 : 6, fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, display: 'flex', gap: 7, alignItems: 'center',
                          background: dark ? 'rgba(52,211,153,.06)' : 'rgba(6,95,70,.05)',
                          border: dark ? '1px solid rgba(52,211,153,.18)' : '1.5px solid rgba(6,95,70,.15)',
                          color: dark ? '#6ee7b7' : 'var(--acc3)' }}>
                          ✓ Decryption successful — m' = m (mod n)
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Modular inverse check */}
                  {valid && (
                    <div className="panel" style={{ padding: '13px 16px' }}>
                      <div className="lbl" style={{ marginBottom: 8 }}>Key relationship verification</div>
                      <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: 'var(--tx2)', lineHeight: 1.75 }}>
                        <span style={{ color: 'var(--acc)' }}>e × d ≡ 1 (mod φ)</span>
                        {' '}→{' '}
                        <span style={{ color: 'var(--tx)' }}>{rsa.e} × {rsa.d} ≡ {Number(rsa.modInvCheck)} (mod {rsa.phi})</span>
                        {' '}
                        {Number(rsa.modInvCheck) === 1
                          ? <span style={{ color: 'var(--acc3)' }}>✓ Verified</span>
                          : <span style={{ color: 'var(--err)' }}>✗ Error</span>}
                      </div>
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ══════ STEPS ══════ */}
              {tab === 'steps' && (
                <motion.div key="steps" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

                  {valid && [
                    {
                      n: 1, title: 'Choose two distinct primes', color: 'var(--acc)',
                      desc: `Select two prime numbers p and q. Their product n forms the public modulus. The security of RSA depends entirely on the difficulty of factoring n back into p and q.`,
                      formula: `p = ${p},\\quad q = ${q}`,
                      result: null,
                    },
                    {
                      n: 2, title: 'Compute the modulus n', color: 'var(--acc)',
                      desc: `Multiply p and q to get n. This is shared publicly as part of both the public and private keys.`,
                      formula: `n = p \\times q = ${p} \\times ${q} = ${rsa.n}`,
                      result: `n = ${rsa.n}`,
                    },
                    {
                      n: 3, title: "Calculate Euler's totient φ(n)", color: 'var(--acc2)',
                      desc: `φ(n) counts how many integers from 1 to n are coprime to n. For two primes this simplifies to (p-1)(q-1). This value is kept secret.`,
                      formula: `\\varphi(n) = (p-1)(q-1) = ${p-1} \\times ${q-1} = ${rsa.phi}`,
                      result: `φ(n) = ${rsa.phi}`,
                    },
                    {
                      n: 4, title: 'Select public exponent e', color: 'var(--acc2)',
                      desc: `Choose e so that 1 < e < φ(n) and gcd(e, φ(n)) = 1 (coprime). Common choices are 17, 65537. This becomes part of the public key.`,
                      formula: `e = ${rsa.e},\\quad \\gcd(e, \\varphi(n)) = \\gcd(${rsa.e}, ${rsa.phi}) = 1 \\checkmark`,
                      result: `e = ${rsa.e}`,
                    },
                    {
                      n: 5, title: 'Compute private exponent d', color: 'var(--acc3)',
                      desc: `d is the modular inverse of e mod φ(n), found using the Extended Euclidean Algorithm. It satisfies e·d ≡ 1 (mod φ(n)). This is the secret key.`,
                      formula: `d \\equiv e^{-1} \\pmod{\\varphi(n)} \\Rightarrow d = ${rsa.d}`,
                      result: `d = ${rsa.d} (secret!)`,
                    },
                    {
                      n: 6, title: 'Encryption', color: dark ? '#fca5a5' : 'var(--err)',
                      desc: `To encrypt a message m, raise it to the public exponent e and take mod n. Anyone with the public key (e, n) can do this.`,
                      formula: `c = m^e \\bmod n = ${msg}^{${rsa.e}} \\bmod ${rsa.n} = ${rsa.encrypted}`,
                      result: `c = ${rsa.encrypted}`,
                    },
                    {
                      n: 7, title: 'Decryption', color: 'var(--acc3)',
                      desc: `To recover m from ciphertext c, raise c to the private exponent d and take mod n. Only the holder of d can do this.`,
                      formula: `m' = c^d \\bmod n = ${rsa.encrypted}^{${rsa.d}} \\bmod ${rsa.n} = ${rsa.decrypted}`,
                      result: `m' = ${rsa.decrypted} ✓`,
                      isLast: true,
                    },
                  ].map((step, i) => (
                    <motion.div key={step.n} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .06 }}
                      style={{ display: 'flex', gap: 0, marginBottom: 10 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 12, flexShrink: 0 }}>
                        <div className="step-n" style={{ borderColor: step.color, color: step.color, background: dark ? `${step.color}18` : `${step.color}12` }}>
                          {step.n}
                        </div>
                        {!step.isLast && <div style={{ width: 1.5, flex: 1, marginTop: 5, background: dark ? 'rgba(56,189,248,.1)' : 'rgba(29,78,216,.12)' }} />}
                      </div>
                      <div className="step" style={{ flex: 1, flexDirection: 'column', gap: 6, paddingLeft: 0, marginBottom: 0 }}>
                        <div style={{ fontFamily: "'Oxanium',sans-serif", fontSize: 14, fontWeight: 700, color: step.color, letterSpacing: '.02em' }}>{step.title}</div>
                        <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 15, color: 'var(--tx2)', lineHeight: 1.7 }}>{step.desc}</div>
                        <div className="formula">
                          {step.formula.split('\\').map((part, i) => (
                            <span key={i}>{part.replace(/quad|varphi|times|pmod|gcd|checkmark|Rightarrow|bmod|equiv|cdot/g, m => ({
                              'quad': '  ', 'varphi': 'φ', 'times': '×', 'pmod': 'mod', 'gcd': 'gcd',
                              'checkmark': '✓', 'Rightarrow': '⇒', 'bmod': 'mod', 'equiv': '≡', 'cdot': '·'
                            }[m] || m))}</span>
                          ))}
                        </div>
                        {step.result && (
                          <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600, color: step.color, marginTop: 2, opacity: .8 }}>
                            → {step.result}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {!valid && (
                    <div style={{ textAlign: 'center', padding: '40px 20px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: 'var(--tx3)' }}>
                      Enter valid primes in the sidebar to see the step-by-step walkthrough.
                    </div>
                  )}

                  
                </motion.div>
              )}

              {/* ══════ ENCODE TEXT ══════ */}
              {tab === 'encode' && (
                <motion.div key="enc" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>

                  <div style={{
                    padding: '9px 13px', borderRadius: dark ? 2 : 8,
                    background: dark ? 'rgba(56,189,248,.04)' : 'rgba(29,78,216,.04)',
                    border: dark ? '1px solid rgba(56,189,248,.15)' : '1.5px solid rgba(29,78,216,.15)',
                    fontFamily: "'IBM Plex Mono',monospace", fontSize: 11.5, color: 'var(--tx2)', display: 'flex', gap: 7, alignItems: 'flex-start', lineHeight: 1.6,
                  }}>
                    {I.info(13)}
                    <span>Each character is encoded as its ASCII code, then RSA-encrypted individually with your current (e,n). Max 8 characters shown. Real RSA encrypts full blocks — this is a character-by-character visualisation.</span>
                  </div>

                  <div className="panel" style={{ padding: '14px 16px' }}>
                    <div className="lbl" style={{ marginBottom: 9 }}>Text to encode (max 8 chars)</div>
                    <input className="inp" value={textIn} maxLength={8}
                      onChange={e => setTextIn(e.target.value.toUpperCase())}
                      placeholder="HELLO" />
                  </div>

                  {valid && encodedChars.length > 0 && (
                    <div>
                      <div className="lbl" style={{ marginBottom: 10 }}>Character-by-character RSA</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                        {encodedChars.map((c, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .07 }}
                            className="panel" style={{ padding: '11px 14px', display: 'grid', gridTemplateColumns: '32px 1fr 26px 1fr 26px 1fr', gap: 8, alignItems: 'center' }}>
                            <div style={{ fontFamily: "'Oxanium',sans-serif", fontWeight: 800, fontSize: 20, color: 'var(--acc)', textAlign: 'center' }}>{c.ch}</div>
                            <div>
                              <div style={{ fontSize: 8.5, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 2 }}>ASCII</div>
                              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, fontWeight: 600, color: 'var(--tx)' }}>{c.code}</div>
                            </div>
                            <div style={{ color: 'var(--tx3)', textAlign: 'center' }}>{I.arr(12)}</div>
                            <div>
                              <div style={{ fontSize: 8.5, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 2 }}>Encrypted c</div>
                              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, fontWeight: 600, color: dark ? '#fca5a5' : 'var(--err)' }}>{c.enc}</div>
                            </div>
                            <div style={{ color: 'var(--tx3)', textAlign: 'center', transform: 'rotate(180deg)' }}>{I.arr(12)}</div>
                            <div>
                              <div style={{ fontSize: 8.5, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--tx3)', marginBottom: 2 }}>c^d mod n</div>
                              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 14, fontWeight: 600, color: 'var(--acc3)' }}>
                                {Number(BigInt(c.enc) ** BigInt(rsa.d) % BigInt(rsa.n))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Ciphertext as array */}
                      <div className="panel" style={{ padding: '12px 16px', marginTop: 12 }}>
                        <div className="lbl" style={{ marginBottom: 7 }}>Ciphertext array</div>
                        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: dark ? '#fca5a5' : 'var(--err)', wordBreak: 'break-all', lineHeight: 1.65 }}>
                          [{encodedChars.map(c => c.enc).join(', ')}]
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
                    { n: 1, t: 'Choose two prime numbers',      d: 'Enter values for p and q in the sidebar. Both must be prime and different from each other. Use the preset pairs for quick starts, or enter your own. Larger primes give a larger n and more "security space" for the demo.' },
                    { n: 2, t: 'Set the public exponent e',      d: 'e must be coprime with φ(n) = (p-1)(q-1). The default value 17 works for most prime pairs. The most common real-world value is 65537 (a Fermat prime), chosen for efficiency.' },
                    { n: 3, t: 'Read the generated keys',        d: 'The public key is the pair (e, n) — share this freely. The private key is (d, n) — guard d with your life. d is computed as the modular inverse of e with respect to φ(n).' },
                    { n: 4, t: 'Encrypt a number',               d: 'Enter any integer m < n as your message. The encrypted ciphertext c = m^e mod n is displayed. Note the verification that decrypting c with d restores the original m.' },
                    { n: 5, t: 'Walk through the steps',         d: 'The ∑ Steps tab shows every calculation: modulus, totient, key derivation, encryption, and decryption — all with your live values. Change p, q, or m to see everything update.' },
                    { n: 6, t: 'Try the text encoder',           d: 'The ▦ Encode tab encrypts each character of a word individually using ASCII codes. This is a simplified visualisation — real RSA encrypts large blocks of bytes in a single modular exponentiation.' },
                  ].map(({ n, t, d }) => (
                    <div key={n} style={{ display: 'flex', gap: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div className="step-n">{n}</div>
                        {n < 6 && <div style={{ width: 1.5, flex: 1, marginTop: 5, background: dark ? 'rgba(56,189,248,.1)' : 'rgba(29,78,216,.12)' }} />}
                      </div>
                      <div style={{ flex: 1, paddingBottom: 10 }}>
                        <div style={{ fontFamily: "'Oxanium',sans-serif", fontWeight: 700, fontSize: 14, color: 'var(--tx)', marginBottom: 3 }}>{t}</div>
                        <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 15, color: 'var(--tx2)', lineHeight: 1.74 }}>{d}</div>
                      </div>
                    </div>
                  ))}
                  
                </motion.div>
              )}

              {/* ══════ THEORY ══════ */}
              {tab === 'learn' && (
                <motion.div key="learn" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="panel" style={{ padding: '22px 26px', marginBottom: 12 }}>
                    <div style={{ fontFamily: "'Oxanium',sans-serif", fontWeight: 800, fontSize: 22, color: 'var(--tx)', marginBottom: 4, letterSpacing: '.02em' }}>
                      The Magic of Prime Numbers: How RSA Secures the Web
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'var(--tx3)', marginBottom: 22, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                      Asymmetric cryptography · Trapdoor functions · Number theory
                    </div>
                    <div className="prose">
                      <p>Every time you log into email, make an online payment, or send a private message, you're relying on <strong>asymmetric cryptography</strong>. RSA (Rivest–Shamir–Adleman, 1977) is the oldest and most widely deployed public-key cryptosystem. Its security rests on a single hard problem: <strong>integer factorisation</strong>.</p>

                      <h3>Public Key vs. Private Key</h3>
                      <p>In symmetric encryption both parties share one secret key — like a lockbox with one key. If the key is intercepted in transit, security collapses. RSA avoids this with a key pair:</p>
                      <ul>
                        <li><strong>Public key (e, n)</strong>: shared openly. Anyone can encrypt with it, but no one can decrypt with it alone.</li>
                        <li><strong>Private key (d, n)</strong>: kept strictly secret. It is the only key that can undo what the public key locks.</li>
                      </ul>
                      <p>This separation solves the key distribution problem. You can publish your public key in a directory; anyone who wants to send you a private message uses it, and only you can read it.</p>

                      <h3>The Mathematical Trapdoor</h3>
                      <p>Multiplying two large primes p and q to get n is trivially fast — even for 2048-bit primes. But given only n, finding p and q again (the <strong>factorisation problem</strong>) is believed to be computationally infeasible. No polynomial-time classical algorithm is known for it. This asymmetry — easy one way, intractable the other — is a <strong>trapdoor function</strong>: the trapdoor is knowledge of p and q (or d).</p>

                      <h3>Euler's Totient and Modular Arithmetic</h3>
                      <p>The key insight comes from <strong>Euler's theorem</strong>: for any integer m coprime to n, m raised to φ(n) is congruent to 1 mod n. RSA encodes a message by raising it to the e-th power mod n, and the decryption exponent d is chosen so that e·d ≡ 1 (mod φ(n)). This ensures (m^e)^d ≡ m (mod n) — the original message is recovered.</p>

                      <h3>Practical Key Sizes</h3>
                      <p>This demo uses 2–3 digit primes for pedagogic clarity. Real-world RSA uses primes of 1,024–2,048 bits each, making n 2048–4096 bits (600–1200 decimal digits). The best classical factoring algorithms — GNFS — would take longer than the age of the universe to factor a well-chosen 2048-bit n.</p>

                      {[
                        { q: 'Why is 65537 the most common public exponent?', a: "65537 = 2¹⁶ + 1 is a Fermat prime. It's large enough that small-message attacks become infeasible, yet has only two 1-bits in binary (10000000000000001), making modular exponentiation with the public key extremely fast using square-and-multiply." },
                        { q: 'What is PKCS#1 padding and why does it matter?', a: 'Textbook RSA as shown here is vulnerable to chosen-plaintext attacks. Real RSA always adds randomised padding (PKCS#1 v1.5 or OAEP) before encryption, making identical messages produce different ciphertexts and closing several attack vectors.' },
                        { q: 'Can quantum computers break RSA?', a: "Yes — Shor's algorithm (1994) can factor n in polynomial time on a quantum computer. A cryptographically relevant quantum computer with ~4,000 error-corrected qubits could break 2048-bit RSA. NIST standardised post-quantum algorithms (CRYSTALS-Kyber, CRYSTALS-Dilithium) in 2024 to replace RSA in the long term." },
                        { q: 'Why is RSA rarely used to encrypt data directly?', a: 'RSA is slow — orders of magnitude slower than symmetric ciphers like AES. In practice, RSA is used in a hybrid scheme: RSA encrypts a random 256-bit AES key (a key encapsulation mechanism), and AES encrypts the actual data. TLS does exactly this.' },
                        { q: "What is the difference between RSA encryption and RSA signatures?", a: 'RSA encryption uses the recipient\'s public key to lock; their private key to unlock. RSA signatures reverse the roles: the signer uses their private key to sign a message hash; anyone can verify with the public key. The mathematics is identical, but the semantic direction is flipped.' },
                      ].map(({ q, a }, i) => (
                        <div key={i} className="faq">
                          <div style={{ fontFamily: "'Oxanium',sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--tx)', marginBottom: 5, letterSpacing: '.02em' }}>{q}</div>
                          <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 15, color: 'var(--tx2)', lineHeight: 1.74 }}>{a}</div>
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