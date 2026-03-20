import { useEffect, useRef } from 'react';

/**
 * AdSlot component — use this for standard manual ad placements.
 */
export function AdSlot({
  slot,           // your ad unit slot ID from AdSense dashboard
  format = 'auto',
  style = {},
  className = '',
  label = true,   // show "Advertisement" label above
}) {
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return; // prevent double-init
    ref.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('AdSense error:', e);
    }
  }, []);

  return (
    <div className={className} style={{ position: 'relative', ...style }}>
      {label && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '8px',
          color: 'rgba(0,245,255,.2)',
          letterSpacing: '.14em',
          textAlign: 'center',
          marginBottom: 4,
        }}>
          ADVERTISEMENT
        </div>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"  // ← replace with your pub ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

/**
 * InFeedAd — renders as a tool card sized ad inside the tool grid.
 */
export function InFeedAd({ slot }) {
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch(e) {}
  }, []);

  return (
    <div style={{
      borderRadius: 12,
      border: '1px dashed rgba(0,245,255,.08)',
      background: 'rgba(0,245,255,.012)',
      overflow: 'hidden',
      minHeight: 148,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px',
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '7px',
        color: 'rgba(0,245,255,.15)',
        letterSpacing: '.14em',
        marginBottom: 8,
      }}>
        ADVERTISEMENT
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format="fluid"
        data-ad-layout="in-article"
      />
    </div>
  );
}
