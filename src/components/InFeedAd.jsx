import React, { useEffect, useRef } from 'react';
import { ADSENSE_PUB_ID } from '../utils/adsenseService';

const ADS_ENABLED = import.meta.env.VITE_ADS_ENABLED === 'true';

const InFeedAd = ({ slot, layoutKey="-fg+5n+6t-70+8u" }) => {
  const pushed = useRef(false);

  useEffect(() => {
    if (ADS_ENABLED && !pushed.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (e) {
        console.warn('[InFeedAd] AdSense push failed:', e);
      }
    }
  }, []);

  if (!ADS_ENABLED) {
    return (
      <div className="ad-placeholder border border-dashed border-gray-300 dark:border-gray-700 rounded-xl py-4 text-center text-[10px] text-gray-400 my-6">
        [ADSENSE: IN-FEED SLOT]
      </div>
    );
  }

  return (
    <div className="my-8 w-full overflow-hidden">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key={layoutKey}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={slot}
      />
    </div>
  );
};

export default InFeedAd;
