// ╔══════════════════════════════════════════════════════════════════╗
// ║  ToolDetail.jsx — CLEAN AD MANAGEMENT                          ║
// ║  • All ads controlled HERE only — never inside tool components  ║
// ║  • Ad sanitizer strips ad nodes from tool output               ║
// ║  • Responsive, clean, professional layout                       ║
// ╚══════════════════════════════════════════════════════════════════╝

import React, {
  Suspense, useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Share2, Printer, Copy, Download,
  Twitter, Facebook, Linkedin, X, Check,
  Clock, AlertTriangle, RotateCcw, Bookmark, BookmarkCheck,
} from 'lucide-react';
import { tools } from '../data/tools';
import { ToolIcon } from './ToolIcon';
import { 
  CrystalCard, CrystalPanel, CrystalBtn, CrystalAdSlot, 
  CrystalBadge, CrystalDivider, CrystalSkeleton 
} from './CrystallineComponents';
import '../crystalline.css';

// ─── YOUR PUBLISHER ID — change this one place only ──────────────
const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX';

// ─── AD SLOT IDs — change these to your real slot IDs ────────────
const AD_SLOTS = {
  top:    '1111111111',   // leaderboard / responsive — above tool
  bottom: '2222222222',   // leaderboard / responsive — below tool
  sidebar:'3333333333',   // rectangle — sidebar (if you add one later)
};

// ═══════════════════════════════════════════════════════════════════
// GOOGLE ADSENSE COMPONENT
// Handles its own init, avoids double-push, fully responsive
// ═══════════════════════════════════════════════════════════════════
const AdUnit = ({ slotId, format = 'auto', style = {} }) => {
  const ref  = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    // Only push once per mount, guard against double-init in StrictMode
    if (done.current) return;
    done.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('[AdSense]', e);
    }
  }, [slotId]);

  return (
    <div style={{ width: '100%', overflow: 'hidden', ...style }} ref={ref}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Labelled ad wrapper — shows "Advertisement" label above the ins tag
// Required in many regions (EU, AU) and good practice everywhere
const LabelledAd = ({ slotId, topSpacing = 0, bottomSpacing = 0 }) => (
  <div style={{ paddingTop: topSpacing, paddingBottom: bottomSpacing }}>
    <p style={{
      textAlign: 'center',
      fontSize: 10,
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'rgba(148,163,184,.4)',
      marginBottom: 4,
      fontFamily: 'system-ui, sans-serif',
    }}>
      Advertisement
    </p>
    <AdUnit slotId={slotId} />
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// AD SANITIZER
// Wraps every tool component. After mount it walks the DOM subtree
// of the tool output and removes any ad-related nodes without
// touching the tool's React state or re-rendering it.
// This is a DOM operation — zero risk of breaking tool logic.
// ═══════════════════════════════════════════════════════════════════

// Selectors that identify ad markup inside tool components
const AD_SELECTORS = [
  '.ad-slot',           // class used in our tools (e.g. "ad-slot" divs)
  '.ad',                // generic ad class
  '[class*="ad-"]',     // any class starting with "ad-"
  '[class*="-ad"]',     // any class ending with "-ad"
  '[id*="ad-"]',        // any id starting with "ad-"
  'ins.adsbygoogle',    // any accidental AdSense ins tags inside tools
  '[data-ad-slot]',     // any element with a slot attribute
  '[data-ad-client]',   // any element with a client attribute
].join(',');

// Phrases in text nodes that hint at ad placeholder text
const AD_TEXT_HINTS = [
  'advertisement',
  'ads go here',
  'adsense',
  'ad slot',
  '◈ ad',
  '◈ advertisement',
];

function sanitizeAds(containerEl) {
  if (!containerEl) return;

  // 1. Remove nodes matching known ad selectors
  containerEl.querySelectorAll(AD_SELECTORS).forEach(el => {
    el.remove();
  });

  // 2. Remove divs whose only visible content is ad placeholder text
  containerEl.querySelectorAll('div, p, span').forEach(el => {
    const text = (el.textContent || '').trim().toLowerCase();
    if (text.length < 120) { // only check short strings — not entire tool content
      const isAdPlaceholder = AD_TEXT_HINTS.some(hint => text.includes(hint));
      if (isAdPlaceholder && el.children.length === 0) {
        // It's a leaf text node with ad text — remove
        el.remove();
      }
    }
  });
}

class AdSanitizer extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount()  { sanitizeAds(this.ref.current); }
  componentDidUpdate() { sanitizeAds(this.ref.current); }

  render() {
    return <div ref={this.ref}>{this.props.children}</div>;
  }
}

// ═══════════════════════════════════════════════════════════════════
// ERROR BOUNDARY — wraps every lazy tool
// ═══════════════════════════════════════════════════════════════════
class ToolErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { crashed: false, error: null }; }
  static getDerivedStateFromError(e) { return { crashed: true, error: e }; }
  componentDidCatch(e, info) { console.error('[ToolError]', e, info); }

  render() {
    const { crashed, error } = this.state;
    const dk = this.props.isDarkMode;
    if (!crashed) return this.props.children;
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: 280, gap: 14, padding: 32,
        borderRadius: 12, textAlign: 'center',
        background: dk ? 'rgba(239,68,68,.06)' : 'rgba(254,242,242,1)',
        border: '1px solid rgba(239,68,68,.2)',
      }}>
        <AlertTriangle size={36} color="#ef4444" />
        <p style={{ fontWeight: 700, fontSize: 15, color: dk ? '#fca5a5' : '#dc2626' }}>
          This tool encountered a problem
        </p>
        <p style={{ fontSize: 13, color: dk ? '#94a3b8' : '#6b7280', maxWidth: 380, lineHeight: 1.7 }}>
          {error?.message || 'Unexpected error. Please try refreshing.'}
        </p>
        <button
          onClick={() => this.setState({ crashed: false, error: null })}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 18px', borderRadius: 8, cursor: 'pointer',
            border: '1px solid rgba(239,68,68,.3)',
            background: 'rgba(239,68,68,.08)',
            color: '#ef4444', fontSize: 13, fontWeight: 600,
          }}>
          <RotateCcw size={14} /> Try Again
        </button>
      </div>
    );
  }
}

// ═══════════════════════════════════════════════════════════════════
// LOADING FALLBACK
// ═══════════════════════════════════════════════════════════════════
const ToolLoadingFallback = ({ isDarkMode }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: 280, gap: 14,
  }}>
    <style>{`
      @keyframes tdSpin { to { transform: rotate(360deg); } }
      @keyframes tdPulse { 0%,100%{opacity:.4} 50%{opacity:1} }
    `}</style>
    <div style={{ position: 'relative', width: 44, height: 44 }}>
      <div style={{
        position: 'absolute', inset: 0,
        border: '2px solid rgba(99,102,241,.15)',
        borderTopColor: '#6366f1', borderRadius: '50%',
        animation: 'tdSpin .75s linear infinite',
      }}/>
    </div>
    <span style={{
      fontSize: 13, color: isDarkMode ? '#94a3b8' : '#64748b',
      animation: 'tdPulse 1.4s ease-in-out infinite',
    }}>
      Loading tool…
    </span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// TOAST SYSTEM — replaces all alert() calls
// ═══════════════════════════════════════════════════════════════════
const Toast = ({ toasts, remove }) => (
  <div style={{
    position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
    zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8,
    alignItems: 'center', pointerEvents: 'none',
  }}>
    <AnimatePresence>
      {toasts.map(t => (
        <motion.div key={t.id}
          initial={{ opacity: 0, y: 16, scale: .95 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{ opacity: 0, y: 8,  scale: .95 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 40,
            boxShadow: '0 8px 32px rgba(0,0,0,.25)',
            fontWeight: 600, fontSize: 13, pointerEvents: 'all',
            background: t.type === 'error' ? '#dc2626' : t.type === 'success' ? '#16a34a' : '#1e293b',
            color: '#fff',
          }}>
          {t.type === 'success' && <Check size={15} />}
          {t.type === 'error'   && <AlertTriangle size={15} />}
          {t.message}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = 'success', duration = 2800) => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
  }, []);
  const remove = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), []);
  return { toasts, add, remove };
}

// ═══════════════════════════════════════════════════════════════════
// SHARE MODAL
// ═══════════════════════════════════════════════════════════════════
const ShareModal = ({ open, onClose, tool, isDarkMode, onCopy }) => {
  if (!open) return null;
  const url   = window.location.href;
  const title = `Check out ${tool.name} on StudentToolHub!`;
  const links = [
    { name: 'Twitter',  icon: Twitter,  color: '#1DA1F2', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
    { name: 'Facebook', icon: Facebook, color: '#4267B2', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: 'LinkedIn', icon: Linkedin, color: '#0077B5', href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}` },
  ];
  const dk = isDarkMode;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ scale: .92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: .92, opacity: 0 }}
        style={{
          width: '100%', maxWidth: 400, padding: 24, borderRadius: 18,
          background: dk ? '#1e293b' : '#fff',
          border: `1px solid ${dk ? '#334155' : '#e2e8f0'}`,
          boxShadow: '0 24px 64px rgba(0,0,0,.3)',
        }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: dk ? '#f1f5f9' : '#0f172a' }}>Share this tool</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: dk ? '#94a3b8' : '#64748b', display: 'flex' }}>
            <X size={22} />
          </button>
        </div>

        {/* Social buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
          {links.map(l => (
            <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                padding: '12px 8px', borderRadius: 12, textDecoration: 'none',
                background: dk ? '#0f172a' : '#f8fafc',
                border: `1px solid ${dk ? '#334155' : '#e2e8f0'}`,
                transition: 'transform .13s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: l.color,
              }}>
                <l.icon size={20} color="#fff" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: dk ? '#94a3b8' : '#64748b' }}>{l.name}</span>
            </a>
          ))}
        </div>

        {/* Copy URL — FIX: uses toast instead of alert() */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
          borderRadius: 10, border: `1px solid ${dk ? '#334155' : '#e2e8f0'}`,
          background: dk ? '#0f172a' : '#f8fafc',
        }}>
          <span style={{
            flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontSize: 12, color: dk ? '#64748b' : '#94a3b8',
          }}>{url}</span>
          <button
            onClick={() => { navigator.clipboard.writeText(url); onCopy('Link copied to clipboard!'); onClose(); }}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', borderRadius: 7,
              background: '#3b82f6', color: '#fff', border: 'none',
              cursor: 'pointer', fontSize: 12, fontWeight: 700,
            }}>
            <Copy size={13} /> Copy
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// HISTORY PANEL
// ═══════════════════════════════════════════════════════════════════
const HistoryPanel = ({ open, onClose, history, isDarkMode, navigate }) => {
  const dk = isDarkMode;
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: 16, background: 'rgba(0,0,0,.5)', backdropFilter: 'blur(4px)',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
        style={{
          width: '100%', maxWidth: 520, maxHeight: '65vh',
          borderRadius: '18px 18px 12px 12px',
          background: dk ? '#1e293b' : '#fff',
          border: `1px solid ${dk ? '#334155' : '#e2e8f0'}`,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px',
          borderBottom: `1px solid ${dk ? '#334155' : '#e2e8f0'}`,
        }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: dk ? '#f1f5f9' : '#0f172a', display: 'flex', alignItems: 'center', gap: 7 }}>
            <Clock size={16} /> Recent Tools
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: dk ? '#94a3b8' : '#64748b' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ overflowY: 'auto', padding: '8px 0' }}>
          {history.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '32px 0', color: dk ? '#64748b' : '#94a3b8', fontSize: 13 }}>
              No history yet. Use a tool to start tracking.
            </p>
          ) : history.map((item, i) => (
            <div key={i}
              onClick={() => { navigate(`/tools/${item.category}/${item.slug}`); onClose(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 20px', cursor: 'pointer',
                transition: 'background .12s',
                borderBottom: i < history.length - 1 ? `1px solid ${dk ? '#1e293b' : '#f1f5f9'}` : 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.background = dk ? 'rgba(255,255,255,.04)' : '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: dk ? '#0f172a' : '#f1f5f9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
              }}>
                {item.icon || '🔧'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: dk ? '#e2e8f0' : '#0f172a', marginBottom: 2 }}>
                  {item.name}
                </div>
                {item.result && (
                  <div style={{
                    fontSize: 11, color: dk ? '#64748b' : '#94a3b8',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {item.result}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 10, color: dk ? '#475569' : '#cbd5e1', flexShrink: 0 }}>
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// RELATED TOOLS — same category, max 4, excludes current
// Drives internal linking + extra ad impressions per session
// ═══════════════════════════════════════════════════════════════════
const RelatedTools = ({ currentTool, isDarkMode, navigate }) => {
  const related = useMemo(() =>
    tools
      .filter(t => t.category === currentTool.category && t.slug !== currentTool.slug)
      .slice(0, 4),
    [currentTool]
  );
  if (related.length === 0) return null;
  const dk = isDarkMode;

  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={{
        fontSize: 16, fontWeight: 700,
        color: dk ? '#cbd5e1' : '#0f172a',
        marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 10,
        letterSpacing: '-0.01em'
      }}>
        <div style={{
          width: 4, height: 18, borderRadius: 2,
          background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)',
        }}/>
        Related {currentTool.category.charAt(0).toUpperCase() + currentTool.category.slice(1)} Tools
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 16,
      }}>
        {related.map(t => (
          <CrystalCard
            key={t.slug}
            tilt={true}
            onClick={() => navigate(`/tools/${t.category}/${t.slug}`)}
            style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 14 }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: dk ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, color: '#6366f1'
            }}>
              <ToolIcon iconName={t.icon} size={22} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: dk ? '#e2e8f0' : '#0f172a', marginBottom: 2 }}>
                {t.name}
              </div>
              <div style={{
                fontSize: 11, color: dk ? '#64748b' : '#94a3b8',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {t.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// BREADCRUMB
// ═══════════════════════════════════════════════════════════════════
const Breadcrumb = ({ tool, isDarkMode, navigate }) => {
  const dk = isDarkMode;
  const crumbs = [
    { label: 'Home',     action: () => navigate('/') },
    { label: tool.category.charAt(0).toUpperCase() + tool.category.slice(1),
      action: () => navigate(`/category/${tool.category}`) },
    { label: tool.name },
  ];
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', gap: 4,
      flexWrap: 'wrap', marginBottom: 16,
      fontFamily: 'system-ui, sans-serif',
    }} aria-label="breadcrumb">
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: dk ? '#475569' : '#cbd5e1', fontSize: 13 }}>/</span>}
          {c.action ? (
            <button onClick={c.action} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontSize: 12, color: dk ? '#64748b' : '#94a3b8',
              transition: 'color .13s',
            }}
              onMouseEnter={e => e.target.style.color = dk ? '#e2e8f0' : '#0f172a'}
              onMouseLeave={e => e.target.style.color = dk ? '#64748b' : '#94a3b8'}>
              {c.label}
            </button>
          ) : (
            <span style={{ fontSize: 12, color: dk ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
              {c.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// ═══════════════════════════════════════════════════════════════════
// LAZY TOOL MAP — unchanged from original
// ═══════════════════════════════════════════════════════════════════
const ComingSoon = React.lazy(() => import('../tools/ComingSoonTemplate'));

// (kept identical to original for zero breaking changes)
const TOOL_MAP = {
  'calculus-solver':        React.lazy(() => import('../tools/academic/CalculusSolver')),
  'integral-calculator':    React.lazy(() => import('../tools/academic/IntegralCalculator')),
  'matrix-algebra':         React.lazy(() => import('../tools/academic/MatrixAlgebra')),
  'basic-stats':            React.lazy(() => import('../tools/academic/BasicStats')),
  'projectile-simulator':   React.lazy(() => import('../tools/academic/ProjectileSimulator')),
  'chemistry-balancer':     React.lazy(() => import('../tools/academic/ChemistryBalancer')),
  'circuit-designer':       React.lazy(() => import('../tools/academic/CircuitDesigner')),
  'economics-elasticity':   React.lazy(() => import('../tools/academic/EconomicsElasticity')),
  'unit-converter':         React.lazy(() => import('../tools/academic/UnitConverter')),
  'gpa-calculator':         React.lazy(() => import('../tools/academic/GPACalculator')),
  'scientific-calculator':  React.lazy(() => import('../tools/academic/ScientificCalculator')),
  'loan-repayment':         React.lazy(() => import('../tools/financial/StudentLoanRepayment')),
  'scholarship-roi':        React.lazy(() => import('../tools/financial/ScholarshipROICalc')),
  'student-budgeting':      React.lazy(() => import('../tools/financial/StudentBudgeting')),
  'housing-calc':           React.lazy(() => import('../tools/financial/HousingCalc')),
  'textbook-resale':        React.lazy(() => import('../tools/financial/TextbookResale')),
  'moving-costs':           React.lazy(() => import('../tools/financial/MovingCosts')),
  'pomodoro-timer':         React.lazy(() => import('../tools/financial/PomodoroTimer')),
  'emi-loan-calculator':    React.lazy(() => import('../tools/financial/EMILoanCalc')),
  'sip-calculator':         React.lazy(() => import('../tools/financial/SIPCalculator')),
  'salary-calculator':      React.lazy(() => import('../tools/financial/salaryTax')),
  'final-grade-calc':       React.lazy(() => import('../tools/utility/FinalGradeCalc')),
  'scientific-notation':    React.lazy(() => import('../tools/academic/ScientificNotation')),
  'percentage-calc':        React.lazy(() => import('../tools/academic/PercentageCalc')),
  'study-planner':          React.lazy(() => import('../tools/utility/StudyPlanner')),
  'assignment-tracker':     React.lazy(() => import('../tools/utility/AssignmentTracker')),
  'exam-weighting':         React.lazy(() => import('../tools/utility/ExamWeighting')),
  'age-calculator':         React.lazy(() => import('../tools/utility/AgeCalculator')),
  'date-difference':        React.lazy(() => import('../tools/utility/DateDifference')),
  'rsa-demo':               React.lazy(() => import('../tools/developer/RSADemo')),
  'truth-table':            React.lazy(() => import('../tools/developer/TruthTableGenerator')),
  'music-theory':           React.lazy(() => import('../tools/niche/MusicTheoryCalc')),
  'carbon-footprint':       React.lazy(() => import('../tools/developer/CarbonFootprint')),
  'astronomy-calc':         React.lazy(() => import('../tools/niche/AstronomyCalc')),
  'nutrition-calc':         React.lazy(() => import('../tools/health/NutritionCalc')),
  'binary-converter':       React.lazy(() => import('../tools/niche/BinaryConverter')),
  'typing-speed-test':      React.lazy(() => import('../tools/niche/TypingSpeedTest')),
  'image-resizer':          React.lazy(() => import('../tools/image/ImageResizer')),
  'format-converter':       React.lazy(() => import('../tools/image/FormatConverter')),
  'background-remover':     React.lazy(() => import('../tools/image/BackgroundRemover')),
  'image-to-pdf':           React.lazy(() => import('../tools/image/ImageToPDF')),
  'image-compressor':       React.lazy(() => import('../tools/image/ImageCompressor')),
  'screenshot-mockup':      React.lazy(() => import('../tools/image/ScreenshotMockup')),
  'pdf-merger-splitter':    React.lazy(() => import('../tools/pdf/PDFMergeSplit')),
  'pdf-compressor':         React.lazy(() => import('../tools/pdf/PDFCompressor')),
  'pdf-splitter':           React.lazy(() => import('../tools/pdf/PDFMergeSplit')),
  'pdf-to-word':            React.lazy(() => import('../tools/pdf/PDFToWord')),
  'word-to-pdf':            React.lazy(() => import('../tools/pdf/WordToPDF')),
  'pdf-unlock':             React.lazy(() => import('../tools/pdf/PDFUnlock')),
  'word-counter':           React.lazy(() => import('../tools/text/WordCounter')),
  'grammar-checker':        React.lazy(() => import('../tools/text/GrammarChecker')),
  'text-formatter':         React.lazy(() => import('../tools/text/TextFormatter')),
  'case-converter':         React.lazy(() => import('../tools/text/CaseConverter')),
  'plagiarism-check':       React.lazy(() => import('../tools/text/PlagiarismCheck')),
  'audio-converter':        React.lazy(() => import('../tools/audio/AudioConverter')),
  'voice-recorder':         React.lazy(() => import('../tools/audio/VoiceRecorder')),
  'tts-converter':          React.lazy(() => import('../tools/audio/TextToSpeech')),
  'code-formatter':         React.lazy(() => import('../tools/developer/CodeFormatter')),
  'css-minifier':           React.lazy(() => import('../tools/developer/CSSMinifier')),
  'html-previewer':         React.lazy(() => import('../tools/developer/HTMLPreviewer')),
  'color-picker':           React.lazy(() => import('../tools/developer/ColorPicker')),
  'qr-generator':           React.lazy(() => import('../tools/developer/QRGenerator')),
  'password-generator':     React.lazy(() => import('../tools/developer/PasswordGenerator')),
  'resume-maker':           React.lazy(() => import('../tools/documentmaker/ResumeMaker')),
  'cv-maker':               React.lazy(() => import('../tools/documentmaker/CVMaker')),
  'biodata-maker':          React.lazy(() => import('../tools/documentmaker/BiodataMaker')),
  'cover-letter-generator': React.lazy(() => import('../tools/documentmaker/CoverLetterGenerator')),
  'linkedin-summary':       React.lazy(() => import('../tools/documentmaker/LinkedInSummaryGen')),
  'job-tracker':            React.lazy(() => import('../tools/documentmaker/JobApplicationTracker')),
  'research-outline':       React.lazy(() => import('../tools/documentmaker/ResearchPaperOutline')),
  'reference-generator':    React.lazy(() => import('../tools/documentmaker/ReferenceGenerator')),
  'lab-report':             React.lazy(() => import('../tools/documentmaker/LabReportBuilder')),
  'cover-page':             React.lazy(() => import('../tools/documentmaker/AssignmentCoverPage')),
  'scholarship-letter':     React.lazy(() => import('../tools/documentmaker/ScholarshipLatter')),
  'sop-generator':          React.lazy(() => import('../tools/documentmaker/SOPGenerator')),
  'recommendation-letter':  React.lazy(() => import('../tools/documentmaker/RecommendationLetter')),
  'internship-letter':      React.lazy(() => import('../tools/documentmaker/InternshipApplication')),
  'bmi-calorie-calculator': React.lazy(() => import('../tools/health/BMIAndCalorie')),
};

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
const ToolDetail = ({ isDarkMode }) => {
  const { toolId }  = useParams();
  const navigate    = useNavigate();
  const { toasts, add: addToast, remove: removeToast } = useToast();

  // ── All state declared BEFORE any conditional returns (hooks rule) ──
  const [shareOpen,   setShareOpen]   = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history,     setHistory]     = useState([]);
  const [bookmarked,  setBookmarked]  = useState(false);
  const [pdfLoading,  setPdfLoading]  = useState(false);

  // Load history from localStorage once
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tool_history') || '[]');
      setHistory(saved);
    } catch { setHistory([]); }
  }, []);

  // Check bookmark state
  useEffect(() => {
    try {
      const bm = JSON.parse(localStorage.getItem('tool_bookmarks') || '[]');
      setBookmarked(bm.includes(toolId));
    } catch { /* ignore */ }
  }, [toolId]);

  // ── Tool lookup — after all hooks ──
  const tool = useMemo(() => tools.find(t => t.slug === toolId), [toolId]);
  const ToolComponent = TOOL_MAP[toolId] || ComingSoon;

  // JSON-LD schema
  const jsonLd = useMemo(() => tool ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    url: window.location.href,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',        item: window.location.origin },
        { '@type': 'ListItem', position: 2, name: tool.category, item: `${window.location.origin}/category/${tool.category}` },
        { '@type': 'ListItem', position: 3, name: tool.name,     item: window.location.href },
      ],
    },
  }) : null, [tool]);

  // ── Callbacks ──
  const addToHistory = useCallback((resultValue) => {
    if (!tool) return;
    const entry = {
      name: tool.name, slug: toolId, category: tool.category,
      icon: tool.icon, timestamp: new Date().toISOString(),
      result: typeof resultValue === 'string' ? resultValue.slice(0, 80) : String(resultValue || ''),
    };
    setHistory(prev => {
      const next = [entry, ...prev.filter(x => !(x.slug === toolId && x.result === entry.result))].slice(0, 15);
      localStorage.setItem('tool_history', JSON.stringify(next));
      return next;
    });
  }, [tool, toolId]);

  const copyResult = useCallback((result) => {
    if (!result) return;
    navigator.clipboard.writeText(String(result))
      .then(() => addToast('Result copied to clipboard!', 'success'))
      .catch(() => addToast('Could not copy — please copy manually.', 'error'));
  }, [addToast]);

  // FIX: PDF libs loaded lazily — not bundled on every page load
  const handleDownloadPDF = useCallback(async () => {
    const el = document.getElementById('tool-content-inner');
    if (!el) return;
    setPdfLoading(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const canvas = await html2canvas(el, {
        scale: 2, useCORS: true, logging: false,
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        ignoreElements: el => el.classList.contains('adsbygoogle') || el.hasAttribute('data-ad-slot'),
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, w, h);
      pdf.save(`${(tool?.name || 'tool').toLowerCase().replace(/\s+/g, '-')}.pdf`);
      addToast('PDF downloaded!', 'success');
    } catch (err) {
      console.error(err);
      addToast('PDF failed. Try Print → Save as PDF instead.', 'error');
    } finally {
      setPdfLoading(false);
    }
  }, [tool, isDarkMode, addToast]);

  const handleShare = useCallback(async () => {
    // Use native share on mobile if available
    if (navigator.share && /Android|iPhone|iPad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({ title: tool?.name, text: tool?.description, url: window.location.href });
        return;
      } catch { /* user cancelled — fall through to modal */ }
    }
    setShareOpen(true);
  }, [tool]);

  const toggleBookmark = useCallback(() => {
    try {
      const bm = JSON.parse(localStorage.getItem('tool_bookmarks') || '[]');
      const next = bm.includes(toolId) ? bm.filter(x => x !== toolId) : [...bm, toolId];
      localStorage.setItem('tool_bookmarks', JSON.stringify(next));
      setBookmarked(next.includes(toolId));
      addToast(next.includes(toolId) ? 'Bookmarked!' : 'Bookmark removed', 'success');
    } catch { /* ignore */ }
  }, [toolId, addToast]);

  // ── 404 ──
  if (!tool) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
        background: isDarkMode ? '#0f172a' : '#f8fafc',
      }}>
        <div style={{ fontSize: 48 }}>🔍</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: isDarkMode ? '#f1f5f9' : '#0f172a' }}>Tool Not Found</h1>
        <p style={{ fontSize: 14, color: isDarkMode ? '#64748b' : '#94a3b8' }}>
          The tool "{toolId}" doesn't exist.
        </p>
        <button onClick={() => navigate('/')}
          style={{
            padding: '10px 24px', borderRadius: 10,
            background: '#6366f1', color: '#fff', border: 'none',
            cursor: 'pointer', fontWeight: 600, fontSize: 14,
          }}>
          ← Back to All Tools
        </button>
      </div>
    );
  }

  const dk = isDarkMode;

  // ── Page styles ──
  const pageStyle = {
    minHeight: '100vh',
    background: dk
      ? 'linear-gradient(135deg, #020408 0%, #050d12 50%, #030810 100%)'
      : 'linear-gradient(135deg, #f0f4f8 0%, #fff 50%, #f8f0ff 100%)',
    color: dk ? '#e2eaf4' : '#0f172a',
    fontFamily: 'system-ui, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  };

  const actionBtnStyle = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '8px 14px', borderRadius: 8,
    cursor: 'pointer', fontSize: 13, fontWeight: 500,
    transition: 'all .13s',
    background: dk ? 'rgba(255,255,255,.06)' : '#fff',
    color: dk ? '#94a3b8' : '#64748b',
    border: `1px solid ${dk ? 'rgba(255,255,255,.1)' : '#e2e8f0'}`,
  };

  const centeredSectionStyle = {
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    padding: '16px 20px',
  };

  return (
    <>
      <Helmet>
        <title>{`${tool.name} — Free Online Tool | StudentToolHub`}</title>
        <meta name="description" content={tool.description} />
        <meta name="keywords" content={[tool.name, ...(tool.tags || [])].join(', ')} />
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title"       content={`${tool.name} — StudentToolHub`} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:type"        content="website" />
        <meta name="twitter:card"       content="summary" />
        {jsonLd && <script type="application/ld+json">{jsonLd}</script>}
      </Helmet>

      <div style={pageStyle} className={`${dk ? 'dark' : 'light'} crystal-scene`}>
        
        {/* Ambient Glow Orbs — purely visual, disabled on mobile */}
        {typeof window !== 'undefined' && window.innerWidth > 768 && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-10%', left: '15%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
            <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '35vw', height: '35vw', background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)', filter: 'blur(50px)' }} />
          </div>
        )}

        {/* ── HEADER CONTAINER (Centered & Readable) ── */}
        <div style={centeredSectionStyle} className="preserve-3d">
          {/* ── BREADCRUMB ── */}
          <Breadcrumb tool={tool} isDarkMode={dk} navigate={navigate} />

          {/* ── TOP ACTION BAR ── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="preserve-3d"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 10,
              marginBottom: 24,
            }}>
            {/* Back */}
            <CrystalBtn onClick={() => navigate(-1)} style={{ padding: '8px 16px' }}>
              <ArrowLeft size={16} /> <span style={{ marginLeft: 4 }}>Back</span>
            </CrystalBtn>

            {/* Right actions */}
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }} className="preserve-3d">
              <CrystalBtn onClick={handleShare}>
                <Share2 size={15} /> <span>Share</span>
              </CrystalBtn>
              <CrystalBtn onClick={toggleBookmark} style={{ color: bookmarked ? '#f59e0b' : 'inherit' }}>
                {bookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                <span className="hidden-xs">{bookmarked ? 'Saved' : 'Save'}</span>
              </CrystalBtn>
              <CrystalBtn onClick={() => setHistoryOpen(true)}>
                <Clock size={15} />
                <span className="hidden-xs">History</span>
                {history.length > 0 && (
                  <span style={{
                    background: '#6366f1', color: '#fff',
                    borderRadius: 10, fontSize: 10, fontWeight: 700,
                    padding: '0 5px', minWidth: 16, textAlign: 'center', marginLeft: 4
                  }}>
                    {history.length}
                  </span>
                )}
              </CrystalBtn>
              <CrystalBtn onClick={() => window.print()}>
                <Printer size={15} />
                <span className="hidden-xs">Print</span>
              </CrystalBtn>
              <CrystalBtn onClick={handleDownloadPDF} disabled={pdfLoading}>
                {pdfLoading
                  ? <div className="spinner-xs" />
                  : <Download size={15} />
                }
                <span className="hidden-xs">{pdfLoading ? 'Saving…' : 'PDF'}</span>
              </CrystalBtn>
            </div>
          </motion.div>

          {/* ── TOOL HEADER ── */}
          <CrystalCard tilt={true} className="shimmer" style={{ padding: '40px 24px', textAlign: 'center', marginBottom: 32 }}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 80, height: 80, borderRadius: 24, marginBottom: 20,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
                color: '#fff'
              }}>
              <ToolIcon iconName={tool.icon} size={38} />
            </motion.div>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
              fontWeight: 900, lineHeight: 1.1,
              marginBottom: 12,
              letterSpacing: '-0.02em'
            }}>
              {tool.name}
            </h1>
            <p style={{
              fontSize: '1.05rem',
              color: dk ? '#94a3b8' : '#64748b',
              maxWidth: 650, margin: '0 auto 20px',
              lineHeight: 1.6,
            }}>
              {tool.description}
            </p>
            {tool.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                {tool.tags.map((tag, i) => (
                  <CrystalBadge key={i}>{tag}</CrystalBadge>
                ))}
              </div>
            )}
          </CrystalCard>

          {/* Ad Slot - Top */}
          <CrystalAdSlot slotId={AD_SLOTS.top} />
        </div> {/* /centeredSectionStyle */}

        {/* ── TOOL CONTENT CONTAINER (Full Width, Flat for Usability) ── */}
        <div className="w-full px-2 lg:px-4 tool-content-zone" style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
          <div id="tool-content-inner" style={{ flex: 1, width: '100%' }}>
            <ToolErrorBoundary isDarkMode={dk}>
              <AdSanitizer>
                <Suspense fallback={<CrystalSkeleton height="400px" />}>
                  <ToolComponent
                    isDarkMode={dk}
                    addToHistory={addToHistory}
                    copyResult={copyResult}
                    toolName={tool.name}
                  />
                </Suspense>
              </AdSanitizer>
            </ToolErrorBoundary>
          </div>
        </div>

        {/* ── FOOTER CONTAINER (Centered) ── */}
        <div style={centeredSectionStyle} className="preserve-3d">
          <CrystalAdSlot slotId={AD_SLOTS.bottom} />

          <CrystalPanel style={{ padding: '32px 24px', marginTop: 40 }}>
            <RelatedTools currentTool={tool} isDarkMode={dk} navigate={navigate} />
          </CrystalPanel>
        </div>{/* /centeredSectionStyle */}

      </div>{/* /page */}

      {/* ── MODALS & OVERLAYS ── */}
      <AnimatePresence>
        {shareOpen && (
          <ShareModal
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            tool={tool}
            isDarkMode={dk}
            onCopy={(msg) => addToast(msg, 'success')}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {historyOpen && (
          <HistoryPanel
            open={historyOpen}
            onClose={() => setHistoryOpen(false)}
            history={history}
            isDarkMode={dk}
            navigate={navigate}
          />
        )}
      </AnimatePresence>

      <Toast toasts={toasts} remove={removeToast} />

      <style>{`
        .spinner-xs { width: 14px; height: 14px; border: 2px solid #6366f1; border-top-color: transparent; border-radius: 50%; animation: tdSpin .7s linear infinite; }
        @keyframes tdSpin { to { transform: rotate(360deg); } }
        @media(max-width:480px) { .hidden-xs { display: none !important; } }
      `}</style>
    </>
  );
};

export default ToolDetail;