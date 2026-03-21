import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, GraduationCap, ShieldCheck, Zap,
  Code2, FlaskConical, Calculator, Heart, Mail,
  MapPin, Calendar, Cpu
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────
   ABOUT US — StudentToolHub
   Built by a first-year ECE student from Bihar, India
───────────────────────────────────────────────────────────────── */

const S = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#020408 0%,#050d12 50%,#030810 100%)',
    color: '#e2eaf4',
    fontFamily: "'Space Grotesk',system-ui,sans-serif",
    padding: '40px 20px 80px',
    position: 'relative',
    overflowX: 'hidden',
  },
  inner: { maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 },
  backBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '8px 16px', borderRadius: 10, marginBottom: 48,
    background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(148,163,184,.8)', cursor: 'pointer',
    fontFamily: "'JetBrains Mono',monospace", fontSize: '.72rem',
    letterSpacing: '.05em', transition: 'all .15s',
  },
  badge: {
    display: 'inline-block', padding: '4px 14px', borderRadius: 20, marginBottom: 16,
    background: 'rgba(167,139,250,0.10)', border: '1px solid rgba(167,139,250,0.22)',
    fontFamily: "'JetBrains Mono',monospace", fontSize: '.6rem',
    letterSpacing: '.14em', color: 'rgba(167,139,250,.85)',
  },
  h1: {
    fontFamily: "'Orbitron',sans-serif", fontWeight: 900,
    fontSize: 'clamp(1.8rem,5vw,2.9rem)', letterSpacing: '.02em',
    lineHeight: 1.15, marginBottom: 16,
    background: 'linear-gradient(135deg,#fff 20%,#a78bfa 80%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
  },
  subhead: {
    fontSize: '1.05rem', lineHeight: 1.8,
    color: 'rgba(148,163,184,.7)', maxWidth: 620, marginBottom: 40,
  },
  metaPill: (c) => ({
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '5px 14px', borderRadius: 20, marginRight: 10, marginBottom: 10,
    background: `${c}12`, border: `1px solid ${c}28`,
    fontFamily: "'JetBrains Mono',monospace", fontSize: '.68rem',
    letterSpacing: '.05em', color: c,
  }),
  divider: {
    height: 1,
    background: 'linear-gradient(90deg,transparent,rgba(167,139,250,.25),transparent)',
    margin: '40px 0',
  },
  card: {
    background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(14px)',
    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
    padding: '24px 22px', transition: 'transform .2s, box-shadow .2s',
  },
  iconBox: (c) => ({
    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
    background: `${c}18`, border: `1px solid ${c}28`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: c, boxShadow: `0 0 16px ${c}14`,
  }),
  statBox: (c) => ({
    background: `${c}0a`, border: `1px solid ${c}20`,
    borderRadius: 12, padding: '20px 16px', textAlign: 'center',
    backdropFilter: 'blur(10px)',
  }),
  p: { fontSize: '.9rem', lineHeight: 1.8, color: 'rgba(148,163,184,.8)', margin: '0 0 10px' },
  link: { color: '#a78bfa', textDecoration: 'none' },
};

const TOOLS_BY_CAT = [
  { cat: 'Academic',      count: 12, icon: GraduationCap, color: '#a78bfa', desc: 'Calculus, matrix algebra, statistics, chemistry, physics, unit converter' },
  { cat: 'Financial',     count: 10, icon: Calculator,     color: '#34d399', desc: 'EMI, SIP, salary tax, scholarship ROI, student budgeting' },
  { cat: 'Document Maker',count: 13, icon: Code2,          color: '#00f5ff', desc: 'Resume, CV, cover letter, SOP, lab report, LinkedIn summary' },
  { cat: 'Image',         count: 7,  icon: Zap,            color: '#fb923c', desc: 'Image resizer, compressor, format converter, background remover' },
  { cat: 'PDF',           count: 6,  icon: FlaskConical,   color: '#facc15', desc: 'Merge, split, compress, PDF ↔ Word, unlock password-protected PDFs' },
  { cat: 'Developer',     count: 10, icon: Cpu,            color: '#22d3ee', desc: 'RSA demo, truth tables, QR generator, color picker, HTML previewer' },
  { cat: 'Text',          count: 5,  icon: Code2,          color: '#4ade80', desc: 'Word counter, grammar checker, case converter, plagiarism check' },
  { cat: 'Health',        count: 3,  icon: Heart,          color: '#f472b6', desc: 'BMI & calorie calculator, nutrition tracker, age calculator' },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>About Us | StudentToolHub — Free Engineering Tools</title>
        <meta name="description" content="StudentToolHub is built by a first-year ECE student from Bihar, India. 79 free engineering and student tools to help with calculations, conversions, documents, and more." />
        <link rel="canonical" href="https://studenttoolhub.com/about" />
      </Helmet>

      <div style={S.page}>
        {/* Background grid */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(167,139,250,.014) 1px,transparent 1px),linear-gradient(90deg,rgba(167,139,250,.014) 1px,transparent 1px)', backgroundSize: '48px 48px' }}/>
        {/* Orbs */}
        <div style={{ position: 'fixed', top: -200, right: -150, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(167,139,250,.14),transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }}/>
        <div style={{ position: 'fixed', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,245,255,.10),transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }}/>

        <div style={S.inner}>
          {/* Back */}
          <button style={S.backBtn} onClick={() => navigate('/')}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.10)'; e.currentTarget.style.color = '#e2eaf4'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.06)'; e.currentTarget.style.color = 'rgba(148,163,184,.8)'; }}>
            <ArrowLeft size={13}/> ← BACK TO TOOLS
          </button>

          {/* Hero */}
          <div style={S.badge}>◈ ABOUT STUDENTTOOLHUB</div>
          <h1 style={S.h1}>Built by a student,<br/>for every student.</h1>
          <p style={S.subhead}>
            StudentToolHub is a free platform of 79+ engineering and student tools — calculators, converters, document makers, PDF utilities, and more. No login. No cost. Works on any device.
          </p>

          {/* Meta pills */}
          <div style={{ marginBottom: 48 }}>
            {[
              { icon: <MapPin size={12}/>, text: 'Bihar, India',         color: '#f472b6' },
              { icon: <GraduationCap size={12}/>, text: 'ECE Student',   color: '#a78bfa' },
              { icon: <Calendar size={12}/>, text: 'Started 2024',       color: '#34d399' },
              { icon: <Cpu size={12}/>, text: 'Quantum Tech Interest',   color: '#00f5ff' },
            ].map((m, i) => (
              <span key={i} style={S.metaPill(m.color)}>
                {m.icon} {m.text}
              </span>
            ))}
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 48 }}>
            {[
              { value: '79+',   label: 'FREE TOOLS',   color: '#00f5ff' },
              { value: '100%',  label: 'IN-BROWSER',   color: '#34d399' },
              { value: '$0',    label: 'COST EVER',    color: '#a78bfa' },
              { value: '2024',  label: 'FOUNDED',      color: '#f472b6' },
            ].map((s, i) => (
              <div key={i} style={S.statBox(s.color)}>
                <div style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 900, fontSize: 'clamp(1.4rem,3vw,2rem)', color: s.color, lineHeight: 1, marginBottom: 6 }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.58rem', letterSpacing: '.12em', color: 'rgba(148,163,184,.4)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Who built this */}
          <div style={{ ...S.card, marginBottom: 20, borderColor: 'rgba(167,139,250,.18)' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={S.iconBox('#a78bfa')}><GraduationCap size={20}/></div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10, color: '#e2eaf4' }}>Who built this?</h2>
                <p style={S.p}>
                  I'm a first-year <strong style={{ color: '#e2eaf4' }}>Electronics and Communication Engineering (ECE)</strong> student from <strong style={{ color: '#e2eaf4' }}>Bihar, India</strong>. I built StudentToolHub in 2024 while learning React and web development — partly to improve my own programming skills, and partly because I kept needing these tools myself during my coursework and couldn't find a clean, free, all-in-one solution.
                </p>
                <p style={S.p}>
                  I'm particularly interested in <strong style={{ color: '#e2eaf4' }}>quantum technology</strong> and hope to contribute to that field one day. This project is my way of combining learning with giving back — every tool I build teaches me something new, and every student who uses it saves time on their assignments.
                </p>
                <p style={{ ...S.p, marginBottom: 0 }}>
                  StudentToolHub started with a handful of calculators and has grown to 79+ tools across 12 categories. I add new tools every week based on what students actually need.
                </p>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16, marginBottom: 20 }}>
            {[
              {
                icon: ShieldCheck, color: '#34d399', title: 'Privacy First',
                body: 'Every tool runs entirely in your browser. Your files, calculations, and inputs never touch our servers. We never collect or sell personal data.',
              },
              {
                icon: Zap, color: '#00f5ff', title: 'Always Free',
                body: 'No freemium. No trials. No credit card. All 79+ tools are completely free, forever. High-quality tools should be accessible to every student regardless of financial situation.',
              },
              {
                icon: Code2, color: '#a78bfa', title: 'Built to Learn',
                body: 'This entire project was built from scratch as a learning exercise. Every component, every algorithm, every tool was written with the goal of understanding how it works.',
              },
              {
                icon: FlaskConical, color: '#f472b6', title: 'Growing Weekly',
                body: 'New tools are added every week. If you need a tool that isn\'t here yet, contact us — student requests directly shape what gets built next.',
              },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} style={S.card}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 36px rgba(0,0,0,.4), 0 0 40px ${c.color}10`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={S.iconBox(c.color)}><Icon size={18}/></div>
                  <h3 style={{ fontSize: '.95rem', fontWeight: 700, marginTop: 14, marginBottom: 8, color: '#e2eaf4' }}>{c.title}</h3>
                  <p style={{ ...S.p, marginBottom: 0 }}>{c.body}</p>
                </div>
              );
            })}
          </div>

          <div style={S.divider}/>

          {/* Tool categories */}
          <h2 style={{ fontFamily: "'Orbitron',sans-serif", fontWeight: 800, fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', letterSpacing: '.04em', color: '#e2eaf4', marginBottom: 20 }}>
            What's Inside
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 14, marginBottom: 48 }}>
            {TOOLS_BY_CAT.map((t, i) => {
              const Icon = t.icon;
              return (
                <div key={i} style={{ ...S.card, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={S.iconBox(t.color)}><Icon size={16}/></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                      <span style={{ fontWeight: 700, fontSize: '.9rem', color: '#e2eaf4' }}>{t.cat}</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '.65rem', color: t.color, letterSpacing: '.06em' }}>{t.count} tools</span>
                    </div>
                    <p style={{ ...S.p, marginBottom: 0, fontSize: '.8rem', color: 'rgba(148,163,184,.6)' }}>{t.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tech stack */}
          <div style={{ ...S.card, marginBottom: 48, borderColor: 'rgba(0,245,255,.15)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14, color: '#e2eaf4', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Code2 size={16} style={{ color: '#00f5ff' }}/> Tech Stack
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                ['React 19',         '#61dafb'],
                ['Vite',             '#646cff'],
                ['Tailwind CSS',     '#38bdf8'],
                ['Framer Motion',    '#a78bfa'],
                ['Lucide Icons',     '#f472b6'],
                ['pdf-lib',          '#facc15'],
                ['Chart.js',         '#ff6384'],
                ['MathJS',           '#34d399'],
                ['KaTeX',            '#00f5ff'],
                ['Three.js',         '#ffffff'],
              ].map(([name, color]) => (
                <span key={name} style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: '.72rem',
                  fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.04em',
                  background: `${color}12`, border: `1px solid ${color}28`, color,
                }}>
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div style={{
            background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.20)',
            borderRadius: 14, padding: '32px 28px', textAlign: 'center', marginBottom: 48,
          }}>
            <Mail size={28} style={{ color: '#a78bfa', marginBottom: 12 }}/>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: '#e2eaf4' }}>Got a suggestion?</h2>
            <p style={{ ...S.p, maxWidth: 440, margin: '0 auto 20px' }}>
              If you need a tool that isn't here, or found a bug, or just want to say hi — I read every message.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 24px', borderRadius: 10,
                background: 'linear-gradient(135deg,#a78bfa,#8b5cf6)',
                color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '.85rem',
                boxShadow: '0 4px 20px rgba(167,139,250,.30)',
              }}>
                <Mail size={14}/> Contact Us
              </Link>
              <a href="mailto:contact@studenttoolhub.com" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '10px 24px', borderRadius: 10,
                background: 'rgba(255,255,255,.06)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,.14)',
                color: '#e2eaf4', textDecoration: 'none', fontWeight: 600, fontSize: '.85rem',
              }}>
                contact@studenttoolhub.com
              </a>
            </div>
          </div>

          {/* Footer links */}
          <div style={{ paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.07)', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            {[
              { label: '← Back to Tools', to: '/' },
              { label: 'Privacy Policy',  to: '/privacy' },
              { label: 'Contact',         to: '/contact' },
              { label: 'Legal & Terms',   to: '/legal' },
            ].map(l => (
              <Link key={l.to} to={l.to} style={{ fontSize: '.75rem', fontFamily: "'JetBrains Mono',monospace", letterSpacing: '.05em', color: 'rgba(148,163,184,.4)', textDecoration: 'none', transition: 'color .14s' }}
                onMouseEnter={e => e.target.style.color = '#e2eaf4'}
                onMouseLeave={e => e.target.style.color = 'rgba(148,163,184,.4)'}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}