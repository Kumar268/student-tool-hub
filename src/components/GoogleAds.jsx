import { useEffect, useRef } from 'react';
import { ADSENSE_PUB_ID } from '../utils/adsenseService';

/**
 * AdSlot — standard manual ad placement.
 *
 * AdSense rules:
 *  - <ins> style must only be { display: 'block' }   (never spread outer styles onto it)
 *  - No overflow:hidden on any ancestor
 *  - No backdrop-filter on container
 *  - No pointer-events manipulation
 *  - "Advertisement" label required above each slot
 */
export function AdSlot({
  slot,
  format    = 'auto',
  style     = {},       // applied to the wrapper div only, never to <ins>
  className = '',
  label     = true,
}) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('[AdSlot]', e);
    }
  }, []);

  return (
    <div
      className={className}
      style={{
        width: '100%',
        margin: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // NO overflow:hidden — clips iframes
        // NO backdrop-filter — clips iframes
        ...style,
      }}
    >
      {label && (
        <p 
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '9px',
            color: 'rgba(148,163,184,.35)',
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            marginBottom: 4,
            textAlign: 'center',
            userSelect: 'none',
          }}
          aria-label="Advertisement"
        >
          Advertisement
        </p>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        aria-label="Advertisement"
      />
    </div>
  );
}