import React, { useEffect, useRef, Suspense } from 'react';
import use3DTilt from '../hooks/use3DTilt';

/**
 * CrystalCard — Glassmorphism card with optional 3D tilt.
 */
export const CrystalCard = ({ children, tilt = true, hoverLift = true, className = "", style = {} }) => {
  const { ref, isLowEnd } = use3DTilt({ max: 2 });
  const containerRef = tilt && !isLowEnd ? ref : null;

  return (
    <div
      ref={containerRef}
      className={`crystalline-surface preserve-3d ${hoverLift ? 'crystal-hover' : ''} ${className}`}
      style={{
        width: '100%',
        ...style
      }}
    >
      <div className="preserve-3d" style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

/**
 * CrystalPanel — Non-tilting crystalline surface.
 */
export const CrystalPanel = ({ children, className = "", style = {} }) => (
  <div className={`crystalline-surface ${className}`} style={{ width: '100%', ...style }}>
    {children}
  </div>
);

/**
 * CrystalBtn — Premium glass button with hover interaction.
 */
export const CrystalBtn = ({ children, onClick, className = "", style = {}, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`crystalline-surface crystal-hover preserve-3d ${className}`}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: 'all 0.2s ease',
      ...style
    }}
  >
    <div className="preserve-3d">{children}</div>
  </button>
);

/**
 * CrystalAdSlot — Safe wrapper for AdSense.
 */
export const CrystalAdSlot = ({ slotId, className = "" }) => {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      if (window.adsbygoogle && adRef.current && adRef.current.children.length === 0) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense Error:", e);
    }
  }, []);

  return (
    <div className={`adsense-3d-container ${className}`}>
      <span className="ad-label">Advertisement</span>
      <div 
        ref={adRef}
        style={{ width: '100%', minHeight: '100px', display: 'flex', justifyContent: 'center' }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

/**
 * CrystalBadge — Premium tag/badge.
 */
export const CrystalBadge = ({ children, color = "#6366f1", className = "" }) => (
  <span 
    className={`preserve-3d ${className}`}
    style={{
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '600',
      background: `rgba(99, 102, 241, 0.1)`,
      border: `1px solid rgba(99, 102, 241, 0.2)`,
      color: color,
      backdropFilter: 'blur(4px)',
      display: 'inline-block',
      whiteSpace: 'nowrap'
    }}
  >
    {children}
  </span>
);

/**
 * CrystalDivider — Subtle gradient separator.
 */
export const CrystalDivider = ({ className = "" }) => (
  <div 
    className={className}
    style={{
      height: '1px',
      width: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
      margin: '24px 0'
    }}
  />
);

/**
 * CrystalSkeleton — Shimmer loading state.
 */
export const CrystalSkeleton = ({ width = "100%", height = "100px", className = "" }) => (
  <div 
    className={`crystalline-surface shimmer ${className}`}
    style={{ width, height }}
  />
);
