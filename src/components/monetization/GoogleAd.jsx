import React, { useEffect, useRef } from 'react';
import { ADSENSE_PUB_ID } from '../../utils/adsenseService';

// ─── AD KILL SWITCH ──────────────────────────────────────
// Set to true after receiving AdSense approval to enable ads.
// Also set VITE_ADS_ENABLED=true in your .env file.
const ADS_ENABLED = import.meta.env.VITE_ADS_ENABLED === 'true' || false;
// ─────────────────────────────────────────────────────────

const GoogleAd = ({ slot, format = 'auto', className = '', style = {} }) => {
  const pushed = useRef(false);

  useEffect(() => {
    // Don't try to push ads if disabled — avoids all console errors
    if (!ADS_ENABLED) return;
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('[GoogleAd]', e);
    }
  }, []);

  // Return nothing when ads are disabled — no placeholder, no errors
  if (!ADS_ENABLED) return null;

  return (
    <div className={className} style={{ width: '100%', margin: '16px 0', ...style }}>
      <p style={{
        fontSize: '9px',
        color: 'rgba(148,163,184,.35)',
        letterSpacing: '.12em',
        textTransform: 'uppercase',
        marginBottom: 4,
        textAlign: 'center',
        userSelect: 'none',
      }}>
        Advertisement
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default GoogleAd;
