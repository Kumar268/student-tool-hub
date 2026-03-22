import React, { useEffect, useState } from 'react';
import { ADSENSE_PUB_ID } from '../utils/adsenseService';

const AdSense = ({ 
  format = 'auto', 
  slot = '', 
  style = {},
  className = ''
}) => {
  const [adsLoaded, setAdsLoaded] = useState(false);

  useEffect(() => {
    // Delay to ensure AdSense script is loaded
    const timer = setTimeout(() => {
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdsLoaded(true);
        }
      } catch (e) {
        console.log('AdSense error:', e.message);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [slot, format]);

  return (
    <div className={`ads-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          minHeight: '90px',
          ...style
        }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      {!adsLoaded && (
        <div className="text-center text-gray-400 text-xs py-2">
          Advertisement
        </div>
      )}
    </div>
  );
};

// Horizontal Banner Ad Component
export const HorizontalAd = ({ slot = '1234567890' }) => {
  return (
    <div className="w-full my-6">
      <AdSense 
        format="horizontal" 
        slot={slot}
        style={{ minHeight: '90px', width: '100%' }}
      />
    </div>
  );
};

// Rectangle Ad Component
export const RectangleAd = ({ slot = '1234567891' }) => {
  return (
    <div className="my-4">
      <AdSense 
        format="rectangle" 
        slot={slot}
        style={{ minHeight: '250px', width: '300px' }}
      />
    </div>
  );
};

// Responsive Ad Component (auto sizing)
export const ResponsiveAd = ({ slot = '1234567892' }) => {
  return (
    <div className="w-full my-4">
      <AdSense 
        format="auto" 
        slot={slot}
        style={{ minHeight: '90px', width: '100%' }}
      />
    </div>
  );
};

// In-Article Ad
export const InArticleAd = ({ slot = '1234567893' }) => {
  return (
    <div className="w-full my-8">
      <AdSense 
        format="fluid" 
        slot={slot}
        style={{ minHeight: '100px', width: '100%' }}
      />
    </div>
  );
};

export default AdSense;

