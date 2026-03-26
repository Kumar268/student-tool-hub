import React, { useEffect, useRef } from 'react';
import { ADSENSE_PUB_ID } from '../utils/adsenseService';

/*
 * AdSlot — one AdSense unit.
 *
 * Props:
 *   type     = 'banner' | 'display' | 'native'
 *   position = 'top' | 'middle' | 'bottom'   (used only for dev label)
 *
 * type="banner"   → leaderboard, responsive horizontal  (top & bottom)
 * type="display"  → medium rectangle, auto responsive   (middle)
 * type="native"   → in-feed / native format             (in-feed)
 *
 * VITE_ADS_ENABLED=false  → shows a clearly sized placeholder (dev mode)
 * VITE_ADS_ENABLED=true   → shows real AdSense ad
 *
 * AdSense policy rules obeyed:
 *   ✓  No overflow:hidden on wrapper (would clip iframes)
 *   ✓  No backdrop-filter on wrapper
 *   ✓  <ins> style is ONLY display:block
 *   ✓  "Advertisement" label above every slot
 */

const ADS_ENABLED = import.meta.env.VITE_ADS_ENABLED === 'true';

const SLOT_IDS = {
  banner:  import.meta.env.VITE_BANNER_AD_SLOT  || '',
  display: import.meta.env.VITE_DISPLAY_AD_SLOT || '',
  native:  import.meta.env.VITE_NATIVE_AD_SLOT  || '',
};

// Dev placeholder min-heights so you can see exactly where ads will sit
const DEV_HEIGHT = {
  banner:  90,
  display: 250,
  native:  150,
};

const AdSlot = ({ type = 'display', position = '', className = '' }) => {
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADS_ENABLED || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('[AdSlot]', e);
    }
  }, []);

  const posLabel = position ? ` · ${position}` : '';
  const label = (
    <p style={{
      fontSize: 9,
      textTransform: 'uppercase',
      letterSpacing: '.16em',
      textAlign: 'center',
      userSelect: 'none',
      marginBottom: 4,
      color: 'rgba(148,163,184,.4)',
    }}>
      Advertisement
    </p>
  );

  /* ── Dev placeholder ── */
  if (!ADS_ENABLED) {
    return (
      <div className={`w-full ${className}`}>
        {label}
        <div style={{
          width: '100%',
          minHeight: DEV_HEIGHT[type] || 90,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed rgba(148,163,184,.3)',
          borderRadius: 12,
          background: 'rgba(148,163,184,.04)',
        }}>
          <span style={{
            fontFamily: 'monospace',
            fontSize: 11,
            color: 'rgba(148,163,184,.4)',
          }}>
            AdSense · {type.toUpperCase()}{posLabel}
          </span>
        </div>
      </div>
    );
  }

  /* ── Live AdSense unit ── */
  const format    = type === 'banner'  ? 'horizontal'
                  : type === 'native'  ? 'fluid'
                  :                      'auto';
  const extraAttr = type === 'native'
    ? { 'data-ad-layout-key': '-6t+ed+2i-1n-4w' }
    : {};

  return (
    <div className={`w-full ${className}`}>
      {label}
      {/*
        ⚠ DO NOT add overflow:hidden, backdrop-filter, or pointer-events
           to this wrapper — AdSense will clip iframes (policy violation).
      */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={SLOT_IDS[type]}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...extraAttr}
      />
    </div>
  );
};

export default AdSlot;