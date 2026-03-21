import React, { useEffect, useRef } from 'react';
import use3DTilt from '../hooks/use3DTilt';

/**
 * CrystalCard
 * Glassmorphism card with optional 3D tilt.
 * crystal-scene provides the perspective context.
 */
export const CrystalCard = ({
  children,
  tilt      = true,
  hoverLift = true,
  shimmer   = false,
  className = '',
  style     = {},
  onClick,
  ...props
}) => {
  const { ref } = use3DTilt({ max: 2 });

  return (
    <div
      ref={tilt ? ref : undefined}
      className={[
        'crystal-scene',
        'crystalline-surface',
        hoverLift ? 'crystal-hover' : '',
        shimmer   ? 'shimmer' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={{ width: '100%', ...style }}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * CrystalPanel
 * Non-tilting crystalline surface for dense content / form areas.
 */
export const CrystalPanel = ({ children, className = '', style = {}, ...props }) => (
  <div
    className={`crystalline-surface ${className}`}
    style={{ width: '100%', ...style }}
    {...props}
  >
    {children}
  </div>
);

/**
 * CrystalBtn
 * Glass button with hover lift.
 * NOTE: transform:none is NOT forced here — the button itself is safe
 *       to animate. Only tool-content-zone inputs are locked flat.
 */
export const CrystalBtn = ({
  children,
  onClick,
  className = '',
  style     = {},
  disabled  = false,
  type      = 'button',
  ...props
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`crystalline-surface crystal-hover ${className}`}
    style={{
      display:        'inline-flex',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '6px',
      padding:        '8px 16px',
      fontSize:       '13px',
      fontWeight:     '600',
      cursor:         disabled ? 'not-allowed' : 'pointer',
      opacity:        disabled ? 0.55 : 1,
      border:         'none',
      outline:        'none',
      lineHeight:     1,
      whiteSpace:     'nowrap',
      ...style,
    }}
    {...props}
  >
    {children}
  </button>
);

/**
 * CrystalAdSlot
 * AdSense-safe wrapper.
 * Guarantees:
 *  - translateZ(2px) is the ONLY transform
 *  - NO overflow:hidden (clips iframes)
 *  - NO backdrop-filter on the container
 *  - NO pointer-events manipulation
 *  - Double-init guard (StrictMode safe)
 */
export const CrystalAdSlot = ({
  slotId,
  adClient  = 'ca-pub-XXXXXXXXXXXXXXXX',
  format    = 'auto',
  className = '',
  style     = {},
}) => {
  const adRef   = useRef(null);
  const didPush = useRef(false);

  useEffect(() => {
    if (didPush.current) return;       // guard against double-init
    if (!adRef.current) return;
    if (adRef.current.childElementCount > 0) return; // already has children

    try {
      didPush.current = true;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn('[CrystalAdSlot]', e);
    }
  }, [slotId]);

  return (
    <div
      className={`adsense-3d-container ${className}`}
      style={style}
    >
      <span className="ad-label">Advertisement</span>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={adClient}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

/**
 * CrystalBadge — tag / label pill
 */
export const CrystalBadge = ({
  children,
  color     = '#6366f1',
  className = '',
  style     = {},
  ...props
}) => (
  <span
    className={className}
    style={{
      display:       'inline-block',
      padding:       '3px 10px',
      borderRadius:  '20px',
      fontSize:      '11px',
      fontWeight:    '600',
      whiteSpace:    'nowrap',
      background:    'rgba(99, 102, 241, 0.10)',
      border:        '1px solid rgba(99, 102, 241, 0.22)',
      color,
      backdropFilter: 'blur(4px)',
      ...style,
    }}
    {...props}
  >
    {children}
  </span>
);

/**
 * CrystalDivider — gradient separator line
 */
export const CrystalDivider = ({ label, className = '' }) => {
  if (!label) {
    return (
      <div
        className={className}
        style={{
          height:     '1px',
          width:      '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)',
          margin:     '24px 0',
        }}
      />
    );
  }
  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}
    >
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
      <span style={{ fontSize: '11px', color: 'rgba(148,163,184,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
    </div>
  );
};

/**
 * CrystalSkeleton — shimmer loading placeholder
 */
export const CrystalSkeleton = ({
  width     = '100%',
  height    = '100px',
  className = '',
  style     = {},
}) => (
  <div
    className={`crystal-skeleton ${className}`}
    style={{ width, height, ...style }}
    aria-hidden="true"
  />
);