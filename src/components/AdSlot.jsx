import React, { useEffect, useRef, useState } from 'react';
import { ADSENSE_PUB_ID } from '../utils/adsenseService';
import VideoAd from './monetization/VideoAd';

const ADS_ENABLED = import.meta.env.VITE_ADS_ENABLED === 'true';

const AdSlot = ({ type = 'display', className = '', style = {} }) => {
  const pushed = useRef(false);
  const [slotId, setSlotId] = useState('');

  useEffect(() => {
    // Determine slot ID based on type
    let id = '';
    switch (type) {
      case 'banner':
        id = import.meta.env.VITE_BANNER_AD_SLOT;
        break;
      case 'native':
        id = import.meta.env.VITE_NATIVE_AD_SLOT;
        break;
      case 'display':
      default:
        id = import.meta.env.VITE_DISPLAY_AD_SLOT;
        break;
    }
    setSlotId(id);

    if (ADS_ENABLED && !pushed.current && type !== 'video') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (e) {
        console.warn('[AdSlot] AdSense push failed:', e);
      }
    }
  }, [type]);

  if (!ADS_ENABLED && type !== 'video') {
    return (
      <div className={`ad-placeholder border border-dashed border-gray-300 dark:border-gray-700 rounded-xl py-6 text-center text-xs text-gray-400 ${className}`} style={style}>
        [ADSENSE: {type.toUpperCase()} SLOT]
      </div>
    );
  }

  if (type === 'video') {
    return (
      <VideoAd 
        videoSrc={import.meta.env.VITE_VIDEO_AD_URL} 
        adLink="#" 
        isEnabled={ADS_ENABLED}
      />
    );
  }

  // Refined ad format based on type
  const format = type === 'banner' ? 'horizontal' : (type === 'native' ? 'fluid' : 'auto');

  return (
    <div className={`my-10 w-full flex flex-col items-center ${className}`} style={style}>
        <span className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] mb-2 select-none font-medium">
          Advertisement
        </span>
        <div className="w-full min-h-[50px]">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={ADSENSE_PUB_ID}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
            {...(type === 'native' ? { 'data-ad-layout-key': "-6t+ed+2i-1n-4w" } : {})}
          />
        </div>
    </div>
  );
};

export default AdSlot;
