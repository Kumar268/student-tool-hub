// ToolPageLayout.jsx
// ─────────────────────────────────────────────────────────────
// Drop-in wrapper for every tool page in StudentToolHub.
// Handles: video ad (once per session) + 3 banner ad slots.
//
// USAGE:
//   import ToolPageLayout from '@/components/ToolPageLayout';
//
//   export default function MyTool() {
//     return (
//       <ToolPageLayout
//         title="Word Counter"
//         icon="📝"
//         extraFeatures={<MyExtraSection />}
//         adClient="ca-pub-XXXXXXXXXXXXXXXXX"   // your AdSense publisher ID
//         adSlots={{
//           top:    "1234567890",
//           middle: "0987654321",
//           bottom: "1122334455",
//           video:  "5566778899",               // optional — for video ad unit
//         }}
//       >
//         {/* your main tool UI goes here */}
//         <MyToolContent />
//       </ToolPageLayout>
//     );
//   }
// ─────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react';

// ─── AdSense Banner ──────────────────────────────────────────
function BannerAd({ adClient, adSlot, label = 'Advertisement' }) {
  const ref = useRef(null);

  useEffect(() => {
    // Push AdSense ad after mount
    try {
      if (window.adsbygoogle && ref.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // adsbygoogle not loaded — dev mode fallback shows placeholder
    }
  }, []);

  // Dev / no-AdSense fallback
  const isDevMode = !adClient || adClient.includes('XXXX');

  return (
    <div className="tool-ad-banner" aria-label={label}>
      <span className="tool-ad-label">{label}</span>

      {isDevMode ? (
        /* ── Placeholder visible in development ── */
        <div className="tool-ad-placeholder">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
               xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="6" width="20" height="12" rx="2"
                  stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2"/>
            <circle cx="8" cy="12" r="2" fill="currentColor" opacity="0.5"/>
            <path d="M13 10h5M13 12h3M13 14h4" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p>Banner Ad · 728×90</p>
          <small>AdSense slot: {adSlot || 'not set'}</small>
        </div>
      ) : (
        /* ── Real AdSense unit ── */
        <ins
          ref={ref}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '90px' }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="horizontal"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}

// ─── Video Ad (once per session) ─────────────────────────────
function VideoAd({ adClient, adSlot }) {
  const SESSION_KEY = 'sth_video_ad_seen';
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem(SESSION_KEY);
    if (!alreadySeen) {
      setVisible(true);
      sessionStorage.setItem(SESSION_KEY, '1');
    }
  }, []);

  const dismiss = () => setDismissed(true);

  if (!visible || dismissed) return null;

  const isDevMode = !adClient || adClient.includes('XXXX');

  return (
    <div className="tool-video-ad" role="region" aria-label="Video advertisement">
      <div className="tool-video-ad-inner">
        <div className="tool-video-ad-badge">
          <span>🎬</span> Video Ad · Plays once per session
        </div>

        {isDevMode ? (
          <div className="tool-video-placeholder">
            <div className="tool-video-play-icon">▶</div>
            <p>Video Ad Placeholder</p>
            <small>Replace with your AdSense video unit (slot: {adSlot || 'not set'})</small>
          </div>
        ) : (
          /* ── Real video ad: use an AdSense in-feed / interstitial slot ── */
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
            data-ad-format="fluid"
          />
        )}

        <button className="tool-video-dismiss" onClick={dismiss} aria-label="Close video ad">
          ✕ Skip
        </button>
      </div>
    </div>
  );
}

// ─── Main Layout Component ────────────────────────────────────
export default function ToolPageLayout({
  title,
  icon = '🔧',
  children,            // main tool content
  extraFeatures,       // optional extra section below main content
  adClient = '',       // e.g. "ca-pub-XXXXXXXXXXXXXXXXX"
  adSlots = {},        // { top, middle, bottom, video }
}) {
  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{STYLES}</style>

      <div className="tool-page">

        {/* ── Page Title ── */}
        <header className="tool-header">
          <h1 className="tool-title">
            <span className="tool-icon">{icon}</span>
            {title}
          </h1>
        </header>

        {/* ── 🎬 Video Ad (once per session) ── */}
        <VideoAd adClient={adClient} adSlot={adSlots.video} />

        {/* ── 📍 Top Banner Ad ── */}
        <BannerAd
          adClient={adClient}
          adSlot={adSlots.top}
          label="Advertisement"
        />

        {/* ── Main Tool Content ── */}
        <main className="tool-main">
          {children}
        </main>

        {/* ── 📍 Middle Banner Ad ── */}
        <BannerAd
          adClient={adClient}
          adSlot={adSlots.middle}
          label="Advertisement"
        />

        {/* ── Extra Features Section ── */}
        {extraFeatures && (
          <section className="tool-extra">
            {extraFeatures}
          </section>
        )}

        {/* ── 📍 Bottom Banner Ad ── */}
        <BannerAd
          adClient={adClient}
          adSlot={adSlots.bottom}
          label="Advertisement"
        />

      </div>
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────
// Self-contained so the component works without Tailwind conflicts.
// You can migrate these into your Tailwind config / global CSS.
const STYLES = `
  .tool-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 1.5rem 1rem 3rem;
    font-family: inherit;
  }

  /* ── Header ── */
  .tool-header {
    margin-bottom: 1.5rem;
  }
  .tool-title {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  .tool-icon {
    font-size: 1.5rem;
  }

  /* ── Banner Ad ── */
  .tool-ad-banner {
    position: relative;
    width: 100%;
    margin: 1.25rem 0;
    min-height: 106px; /* 90px ad + 16px label */
    border-radius: 10px;
    overflow: hidden;
    background: #f8fafc;
    border: 1.5px dashed #cbd5e1;
  }
  .tool-ad-label {
    display: block;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #94a3b8;
    text-align: center;
    padding: 3px 0 2px;
  }
  .tool-ad-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90px;
    color: #94a3b8;
    gap: 4px;
  }
  .tool-ad-placeholder p {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 500;
  }
  .tool-ad-placeholder small {
    font-size: 0.7rem;
    opacity: 0.7;
  }

  /* ── Video Ad ── */
  .tool-video-ad {
    margin: 1.25rem 0;
    border-radius: 12px;
    overflow: hidden;
    border: 1.5px dashed #818cf8;
    background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%);
  }
  .tool-video-ad-inner {
    position: relative;
    padding: 1rem;
  }
  .tool-video-ad-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6366f1;
    background: #e0e7ff;
    padding: 3px 10px;
    border-radius: 99px;
    margin-bottom: 0.75rem;
  }
  .tool-video-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 120px;
    color: #818cf8;
    gap: 6px;
  }
  .tool-video-play-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #6366f1;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    margin-bottom: 4px;
  }
  .tool-video-placeholder p {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #4f46e5;
  }
  .tool-video-placeholder small {
    font-size: 0.7rem;
    color: #818cf8;
  }
  .tool-video-dismiss {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;
  }
  .tool-video-dismiss:hover {
    background: #4f46e5;
  }

  /* ── Main content & Extra ── */
  .tool-main {
    background: #fff;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.25rem 0;
    min-height: 200px;
  }
  .tool-extra {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 1.5rem;
    margin: 1.25rem 0;
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .tool-title { font-size: 1.35rem; }
    .tool-main, .tool-extra { padding: 1rem; }
  }
`;