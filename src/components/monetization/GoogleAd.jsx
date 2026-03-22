import React, { useEffect, useRef } from 'react';
import { usePremium } from '../../contexts/PremiumContext';
import { ADSENSE_PUB_ID } from '../../utils/adsenseService';

const GoogleAd = ({ slot, format = 'auto', responsive = 'true', className = '' }) => {
  const { isPremium } = usePremium();
  const adRef = useRef(null);
  const initialized = useRef(false);

  // YOUR_ADSENSE_CLIENT_ID
  const client = ADSENSE_PUB_ID;

  useEffect(() => {
    // Don't initialize if premium user or already initialized
    if (isPremium || initialized.current || !adRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      initialized.current = true;
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [isPremium]);

  if (isPremium) return null;

  return (
    <div className={`w-full flex flex-col items-center justify-center my-6 ${className}`}>
      <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-mono opacity-60">Advertisement</span>
      <div className="w-full overflow-hidden flex justify-center bg-gray-50 dark:bg-gray-900/30 rounded-lg min-h-[90px] border border-gray-100 dark:border-gray-800">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
        />
      </div>
    </div>
  );
};

export default GoogleAd;
