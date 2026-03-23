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
      <div className={`ad-placeholder border border-dashed border-gray-300 dark:border-gray-700 rounded-xl py-4 text-center text-xs text-gray-400 ${className}`} style={style}>
        [AD REPLACEMET: {type.toUpperCase()} SLOT]
      </div>
    );
  }

  if (type === 'video') {
    return (
      <VideoAd 
        videoSrc={import.meta.env.VITE_VIDEO_AD_URL} 
        adLink="#" 
      />
    );
  }

  return (
    <div className={`my-6 w-full overflow-hidden ${className}`} style={style}>
      <div className="flex justify-center flex-col items-center">
        <span className="text-[10px] text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-1 select-none">
          Advertisement
        </span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-client={ADSENSE_PUB_ID}
          data-ad-slot={slotId}
          data-ad-format={type === 'banner' ? 'horizontal' : 'auto'}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

export default AdSlot;
